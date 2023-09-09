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
  const { privateKey, exportPublicKey } = useKeyPairStore();
  const [bobPublicKey, setBobPublicKey] = useState<CryptoKey>();

  useEffect(() => {
    exportPublicKey().then((v) => {
      if (!v) return;
      alert(v);
    });
  }, [exportPublicKey]);

  useEffect(() => {
    if (!address || !targetAddress) return;
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
  }, [address, messageHandler, privateKey, socket, targetAddress]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message || !address || !targetAddress) return;
    if (!bobPublicKey) {
      importPublicKey(message).then(setBobPublicKey);
      setMessage('');
      return;
    }
    encryptWithPublicKey(message, bobPublicKey).then((content) =>
      socket.emit('chat', { from: address, to: targetAddress, content }),
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
    scrollIntoView();
  }, [messages, scrollIntoView]);

  return {
    targetRef,
    scrollableRef,
    handleSendMessage,
    message,
    setMessage,
    messages,
  };
};

export default useChat;
