import {
  useClipboard,
  useInputState,
  useListState,
  useScrollIntoView,
} from '@mantine/hooks';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import useKeplr from '../../hooks/useKeplr';
import { useParams } from 'react-router';

interface ChatMessage {
  id: string;
  author: 'Alice' | 'Bob';
  message: string;
  timestamp: number;
}

const encryptWithPublicKey = async (message: string, publicKey: CryptoKey) => {
  return globalThis.crypto.subtle
    .encrypt({ name: 'RSA-OAEP' }, publicKey, new TextEncoder().encode(message))
    .then((message) => {
      const bytes = new Uint8Array(message);
      const binaryString = String.fromCharCode.apply(null, Array.from(bytes));
      return globalThis.btoa(binaryString);
    });
};

const decryptWithPrivateKey = async (
  message: string,
  privateKey: CryptoKey,
) => {
  return globalThis.crypto.subtle
    .decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      (() => {
        const binaryString = globalThis.atob(message);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      })(),
    )
    .then((message) => new TextDecoder().decode(message));
};

const generateKeyPair = async () => {
  return globalThis.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt'],
  );
};

const exportPublicKey = async (publicKey: CryptoKey) => {
  const pem = await globalThis.crypto.subtle.exportKey('spki', publicKey);
  const pemArray = String.fromCharCode.apply(
    null,
    new Uint8Array(pem) as unknown as number[],
  );
  return globalThis.btoa(pemArray);
};

const importPublicKey = async (pem: string) => {
  return globalThis.crypto.subtle.importKey(
    'spki',
    (() => {
      const binaryString = globalThis.atob(pem);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    })(),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['encrypt'],
  );
};

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
  const [keyPair, setKeyPair] = useState<CryptoKeyPair>();
  const [publicKeyPem, setPublicKeyPem] = useState<string>();
  const { copy } = useClipboard();
  const copyPublicKey = () => copy(publicKeyPem);
  const [bobPublicKey, setBobPublicKey] = useState<CryptoKey>();

  useEffect(() => {
    (async () => {
      const keyPair = await generateKeyPair();
      setKeyPair(keyPair);
      setPublicKeyPem(await exportPublicKey(keyPair.publicKey));
    })();
  }, []);

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
      if (from === address || !keyPair) return;
      decryptWithPrivateKey(content, keyPair.privateKey).then((message) =>
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
  }, [address, keyPair, messageHandler, socket, targetAddress]);

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
    copyPublicKey,
  };
};

export default useChat;
