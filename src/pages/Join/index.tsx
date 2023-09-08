import { Button, Center, Flex, Text, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router';

const JoinPage = () => {
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.address.value);
    navigate('/chat');
  };

  return (
    <Center mih="100vh">
      <form onSubmit={handleJoin}>
        <Flex direction="column" gap="1rem" align="center">
          <TextInput
            label="Enter Bob address"
            placeholder="0x1234567890abcdef"
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
