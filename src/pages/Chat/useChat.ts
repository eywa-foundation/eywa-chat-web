import { useInputState, useListState, useScrollIntoView } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import useKeplr from '../../hooks/useKeplr';
import { useParams } from 'react-router';
import useKeyPairStore from '../../hooks/useKeyPairStore';
import {
  decryptWithPrivateKey,
  encryptWithPublicKey,
  importPublicKey,
} from '../../utils/crypto';
import useRoomsStore from '../../hooks/useRoomsStore';

export interface ChatMessage {
  id: string;
  author: 'Alice' | 'Bob';
  message: string;
  timestamp: number;
}

const useChat = () => {
  const [message, setMessage] = useInputState('');
  const [messages, messageHandler] = useListState<ChatMessage>();
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView({
    duration: 0,
  });
  const [socket] = useState(() => io('http://localhost:3000'));
  const { accounts } = useKeplr();
  const address = accounts?.[0]?.address;
  const { address: targetAddress } = useParams<{ address: string }>();
  const { privateKey } = useKeyPairStore();
  const [bobPublicKey, setBobPublicKey] = useState<CryptoKey>();
  const { rooms } = useRoomsStore();
  const room = rooms.find((room) => room.opponent === targetAddress);
  const isChain = !(room?.server.endsWith('.com') ?? false);
  const { client } = useKeplr();

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
    socket.emit('join', { from: address, to: targetAddress });
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
    socket.on('chat', handleChat);
    return () => {
      socket.off('chat', handleChat);
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
        : socket.emit('chat', { from: address, to: targetAddress, content }),
    );

    messageHandler.prepend({
      id: `${globalThis.crypto.randomUUID()}`,
      author: 'Alice',
      message,
      timestamp: Date.now(),
    });
    setMessage('');
  };

  useEffect(() => {
    if (!isChain) return;
    let cancelled = false;
    const roomId = room?.roomId ?? '';
    if (!client || !roomId || !privateKey) return;
    const fetch = async () => {
      const chat = await client.EywaEywa.query.queryGetChat(roomId);
      const bobMessages = (
        chat.data.chat?.filter(
          (chat) =>
            chat.time &&
            chat.sender !== address &&
            !(
              messages
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
      if (bobMessages.length > 0 && !cancelled) {
        messageHandler.prepend(...(await Promise.all(bobMessages)));
      }
    };
    const interval = setInterval(fetch, 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [address, client, isChain, messageHandler, messages, privateKey, room]);

  useEffect(() => {
    scrollIntoView();
  }, [messages, scrollIntoView]);

  return {
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
