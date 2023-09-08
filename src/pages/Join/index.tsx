import { Button, Center, Flex, Text, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router';
import useKeplr from '../../hooks/useKeplr';

const JoinPage = () => {
  const { accounts, error, loading } = useKeplr();
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [account] = accounts ?? [];
    if (!account) return;
    navigate(`/chat/${e.currentTarget.address.value}`);
  };

  if (loading) return null;
  if (error || !accounts) {
    return (
      <Center mih="100vh">
        <Text>Keplr not installed</Text>
      </Center>
    );
  }

  return (
    <Center mih="100vh">
      <form onSubmit={handleJoin}>
        <Flex direction="column" gap="1rem" align="center">
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
