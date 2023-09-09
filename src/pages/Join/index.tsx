import { Button, Center, Flex, Text, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router';
import useKeplr from '../../hooks/useKeplr';
import useIgnite from '../../hooks/useIgnite';

const JoinPage = () => {
  const { accounts, error, loading } = useKeplr();
  const navigate = useNavigate();
  useIgnite((!error && accounts?.length && !loading) || false);

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
    <Center mih="100vh">
      <form onSubmit={handleJoin}>
        <Flex direction="column" gap="1rem" align="center">
          <Text>my address: {accounts[0].address}</Text>
          <TextInput
            label="Enter Bob address"
            placeholder="cosmos1234567890abcdef"
            style={{ width: '400px' }}
            name="address"
          />
          <Button type="submit">
            <Text>Join</Text>
          </Button>
        </Flex>
      </form>
    </Center>
  );
};

export default JoinPage;
