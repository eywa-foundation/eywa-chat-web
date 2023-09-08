import { Box, Button, Container, Flex, Text, TextInput } from '@mantine/core';
import { useListState } from '@mantine/hooks';

interface ChatMessage {
  id: string;
  author: 'Alice' | 'Bob';
  message: string;
  timestamp: number;
}

const ChatPage = () => {
  const [messages] = useListState<ChatMessage>(
    [...Array(100)].map((_, i) => ({
      id: `${i}`,
      author: i % 2 === 0 ? 'Alice' : 'Bob',
      message: `Message ${i}`,
      timestamp: Date.now(),
    })),
  );

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
          <Flex direction="column-reverse">
            {messages.map((message) => (
              <Text
                key={message.id}
                style={{
                  alignSelf:
                    message.author === 'Alice' ? 'flex-start' : 'flex-end',
                }}
              >
                {message.message}
              </Text>
            ))}
          </Flex>
        </Box>
        <Flex gap="1rem">
          <TextInput style={{ flex: 1 }} />
          <Button>
            <Text>Send</Text>
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
};

export default ChatPage;
