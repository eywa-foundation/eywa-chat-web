import { Box, Container, Flex, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ChatMessage } from '../Chat/useChat';

const ChatHistory = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    (async () => {
      setMessages([
        {
          id: globalThis.crypto.randomUUID(),
          message: 'Hello',
          author: 'Bob',
          timestamp: Date.now(),
        },
      ]);
    })();
  }, []);

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
        <Box style={{ flex: 1, overflow: 'scroll' }}>
          <Flex direction="column-reverse" gap=".25em" pr="1em">
            {messages.map((message) => (
              <Box
                key={message.id}
                p="0.25em 0.5em"
                sx={(theme) => ({
                  backgroundColor:
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[6]
                      : theme.colors.gray[0],
                  alignSelf:
                    message.author === 'Alice' ? 'flex-end' : 'flex-start',
                  borderRadius: '0.5rem',
                })}
              >
                <Text>{message.message}</Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default ChatHistory;
