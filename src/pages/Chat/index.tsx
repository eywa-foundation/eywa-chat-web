import { Box, Button, Container, Flex, Text, TextInput } from '@mantine/core';
import useChat from './useChat';

const ChatPage = () => {
  const {
    messages,
    message,
    setMessage,
    handleSendMessage,
    scrollableRef,
    targetRef,
  } = useChat();

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
          <Flex direction="column-reverse" gap=".25em" pr="1em">
            <span ref={targetRef} />
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
