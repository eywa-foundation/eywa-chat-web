import { useInputState, useListState, useScrollIntoView } from '@mantine/hooks';
import { useEffect } from 'react';

interface ChatMessage {
  id: string;
  author: 'Alice' | 'Bob';
  message: string;
  timestamp: number;
}

const useChat = () => {
  const [message, setMessage] = useInputState('');
  const [messages, messageHandler] = useListState<ChatMessage>(
    [...Array(100)].map((_, i) => ({
      id: `${i}`,
      author: i % 2 === 0 ? 'Alice' : 'Bob',
      message: `Message ${i}`,
      timestamp: Date.now(),
    })),
  );
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView({
    duration: 0,
  });

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) {
      return;
    }
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
