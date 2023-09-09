import { Button, Center, Flex, Text, TextInput } from '@mantine/core';
import useJoin from './useJoin';

const JoinPage = () => {
  const { copyAddress, handleJoin, error, loading } = useJoin();

  if (error) {
    return (
      <Center mih="100vh">
        <Text>Keplr not installed</Text>
        <Text>{JSON.stringify(error)}</Text>
      </Center>
    );
  }
  if (loading) return null;

  return (
    <Flex h="100%" direction="column" justify="center">
      <form onSubmit={handleJoin}>
        <Flex direction="column" gap="1rem" align="center">
          <TextInput
            label="Enter Opponent Name"
            placeholder="Bob"
            name="opponent"
            w="100%"
            withAsterisk
          />
          <TextInput
            label="Enter Opponent Address"
            placeholder="celestia1234567890abcdef"
            name="address"
            w="100%"
            withAsterisk
          />
          <Flex gap="1rem">
            <Button onClick={copyAddress}>Copy my address</Button>
            <Button type="submit">
              <Text>Join</Text>
            </Button>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
};

export default JoinPage;
