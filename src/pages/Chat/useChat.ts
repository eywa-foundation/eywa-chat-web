import { useInputState, useListState, useScrollIntoView } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import useKeplr from '../../hooks/useKeplr';
import { useParams } from 'react-router';
import useKeyPairStore from '../../hooks/useKeyPairStore';
import {
  decryptWithPrivateKey,
  encryptWithPublicKey,
  importPublicKey,
} from '../../utils/crypto';
import useRoomsStore from '../../hooks/useRoomsStore';
import useRelayServers from '../../hooks/useRelayServers';
import { useSearchParams } from 'react-router-dom';
import { EywaChat } from 'eywa-client-ts/eywa.eywa/rest';

export interface ChatMessage {
  id: string;
  author: 'Alice' | 'Bob';
  message: string;
  timestamp: number;
}

const useChat = () => {
  const [message, setMessage] = useInputState('');
  const [messagesFromBob, messageHandler] = useListState<ChatMessage>();
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView({
    duration: 0,
  });
  const { accounts } = useKeplr();
  const address = accounts?.[0]?.address;
  const { address: targetAddress } = useParams<{ address: string }>();
  const { privateKey } = useKeyPairStore();
  const [bobPublicKey, setBobPublicKey] = useState<CryptoKey>();
  const { rooms, addChat } = useRoomsStore();
  const [socket, setSocket] = useState<Socket>();
  const { client } = useKeplr();
  const [searchParams] = useSearchParams();
  const servers = useRelayServers();
  const server = servers.find(
    (server) => server.label === searchParams.get('server'),
  );
  const room = rooms.find(
    (room) => room.opponent === targetAddress && room.server === server?.value,
  );
  const isChain = !(room?.server.endsWith('.com') ?? false);
  const [progress, setProgress] = useState(0);
  const [chats, setChats] = useState<EywaChat[]>();
  const messages = [
    ...(room?.messages.map((m) => ({
      ...m,
      author: 'Alice',
      id: `${globalThis.crypto.randomUUID()}`,
    })) ?? []),
    ...messagesFromBob,
  ].sort((a, b) => b.timestamp - a.timestamp);

  useEffect(() => {
    if (!room) return;
    setSocket(isChain ? undefined : io(room.server));
  }, [room, isChain]);

  useEffect(() => {
    if (!client || !targetAddress) return;
    (async () => {
      const user = await client.EywaEywa.query.queryGetUser(targetAddress);
      const key = user.data.user?.pubkey;
      if (!key) return;
      setBobPublicKey(await importPublicKey(key));
    })();
  }, [client, targetAddress]);

  useEffect(() => {
    if (!address || !targetAddress || isChain) return;
    socket?.emit('join', { from: address, to: targetAddress });
    const handleChat = ({
      from,
      content,
    }: {
      from: string;
      content: string;
    }) => {
      if (from === address || !privateKey) return;
      decryptWithPrivateKey(content, privateKey).then((message) =>
        messageHandler.prepend({
          id: `${globalThis.crypto.randomUUID()}`,
          author: 'Bob',
          message,
          timestamp: Date.now(),
        }),
      );
    };
    socket?.on('chat', handleChat);
    return () => {
      socket?.off('chat', handleChat);
    };
  }, [address, isChain, messageHandler, privateKey, socket, targetAddress]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message || !address || !targetAddress || !bobPublicKey) return;
    encryptWithPublicKey(message, bobPublicKey).then((content) =>
      isChain
        ? void client?.EywaEywa.tx.sendMsgCreateChat({
            value: {
              creator: address,
              message: content,
              receiver: targetAddress,
              roomId: room?.roomId ?? '',
              time: Date.now(),
            },
          })
        : socket?.emit('chat', { from: address, to: targetAddress, content }),
    );

    addChat(room?.roomId ?? '', message);
    setMessage('');
  };

  useEffect(() => {
    const roomId = room?.roomId ?? '';
    if (!client || !roomId || !privateKey) return;
    const fetch = async () => {
      const chat = await client.EywaEywa.query.queryGetChat(roomId);
      setChats(chat.data.chat);
    };
    const interval = setInterval(fetch, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [address, client, messageHandler, messagesFromBob, privateKey, room]);

  useEffect(() => {
    if (!chats || !privateKey || !address) return;
    let cancelled = false;
    const bobMessages = (
      chats.filter(
        (chat) =>
          chat.time &&
          chat.sender !== address &&
          !(
            messagesFromBob
              .map((m) => m.timestamp.toString())
              .includes(chat.time.toString()) ?? false
          ),
      ) ?? []
    ).map(async (chat) => ({
      id: globalThis.crypto.randomUUID(),
      author: 'Bob' as const,
      message: await decryptWithPrivateKey(chat.message ?? '', privateKey),
      timestamp: Number.parseInt(chat.time ?? '0'),
    }));
    if (bobMessages.length > 0) {
      Promise.all(bobMessages).then((messages) => {
        if (cancelled) return;
        messageHandler.prepend(...messages);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [address, chats, messageHandler, messagesFromBob, privateKey]);

  useEffect(() => {
    scrollIntoView();
  }, [messages, scrollIntoView]);

  useEffect(() => {
    setProgress(((chats?.length ?? 0) / messages.length) * 100);
  }, [chats, messages]);

  return {
    progress,
    room,
    targetRef,
    scrollableRef,
    handleSendMessage,
    message,
    setMessage,
    messages,
  };
};

export default useChat;
