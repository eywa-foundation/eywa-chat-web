import { Button, Center, Flex, Text, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router';
import useKeplr from '../../hooks/useKeplr';
import useIgnite from '../../hooks/useIgnite';
import { useClipboard } from '@mantine/hooks';

const JoinPage = () => {
  const { accounts, error, loading } = useKeplr();
  const navigate = useNavigate();
  useIgnite((!error && accounts?.length && !loading) || false);
  const { copy } = useClipboard();
  const copyAddress = () => {
    copy(accounts?.[0].address ?? '');
  };

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [account] = accounts ?? [];
    if (!account) return;
    navigate(`/chat/${e.currentTarget.address.value}`);
  };

  if (error || !accounts) {
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
