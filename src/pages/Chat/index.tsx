import { Box, Button, Container, Flex, Text, TextInput } from '@mantine/core';
import { useInputState, useListState, useScrollIntoView } from '@mantine/hooks';
import { useEffect } from 'react';

interface ChatMessage {
  id: string;
  author: 'Alice' | 'Bob';
  message: string;
  timestamp: number;
}

const ChatPage = () => {
  const [message, setMessage] = useInputState('');
  const [messages, messageHandler] = useListState<ChatMessage>(
    [...Array(100)].map((_, i) => ({
      id: `${i}`,
      author: i % 2 === 0 ? 'Alice' : 'Bob',
      message: `Message ${i}`,
      timestamp: Date.now(),
    })),
  );
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView();

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

  return (
    <Container
      py="1rem"
      style={{
        height: '100vh',
        maxHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <Flex direction="column" gap="1rem" style={{ height: '100%' }}>
        <Box style={{ flex: 1, overflow: 'scroll' }} ref={scrollableRef}>
          <Flex direction="column-reverse">
            <span ref={targetRef} />
            {messages.map((message) => (
              <Text
                key={message.id}
                style={{
                  alignSelf:
                    message.author === 'Alice' ? 'flex-end' : 'flex-start',
                }}
              >
                {message.message}
              </Text>
            ))}
          </Flex>
        </Box>
        <form onSubmit={handleSendMessage}>
          <Flex gap="1rem">
            <TextInput
              style={{ flex: 1 }}
              value={message}
              onChange={setMessage}
            />
            <Button type="submit">
              <Text>Send</Text>
            </Button>
          </Flex>
        </form>
      </Flex>
    </Container>
  );
};

export default ChatPage;
