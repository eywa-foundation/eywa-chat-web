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
          <Flex direction="column-reverse" gap=".4em">
            <span ref={targetRef} />
            {messages.map((message) => (
              <Box
                bg={`linear-gradient(130deg, #87BCF7 ${
                  message.author === 'Alice' ? -100 : 0
                }%, #C07FF7 ${message.author === 'Alice' ? 100 : 200}%)`}
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
                maw="80%"
              >
                <Text color="white" style={{ wordBreak: 'break-all' }}>
                  {message.message}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
        <form onSubmit={handleSendMessage}>
          <Flex gap="1em">
            <TextInput
              styles={(theme) => ({
                input: {
                  '&:focus-within': {
                    borderColor: theme.colors.gray[7],
                  },
                },
              })}
              style={{ flex: 1 }}
              value={message}
              onChange={setMessage}
              autoComplete="off"
              wrapperProps={{
                sx: {
                  '& input': {
                    height: '1.5em',
                    paddingInline: '0.75em',
                    fontWeight: '600',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: '#87BCF7', to: '#C07FF7', deg: 130 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </Button>
          </Flex>
        </form>
      </Flex>
    </Container>
  );
};

export default ChatPage;
