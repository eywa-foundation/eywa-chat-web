import { Button, Container, Flex, Text, TextInput } from '@mantine/core';

const ChatPage = () => {
  return (
    <Container>
      <Flex gap="1rem">
        <TextInput style={{ flex: 1 }} />
        <Button>
          <Text>Send</Text>
        </Button>
      </Flex>
    </Container>
  );
};

export default ChatPage;
