import {
  Box,
  Button,
  Center,
  Flex,
  Select,
  Text,
  TextInput,
} from '@mantine/core';
import useJoin from './useJoin';

const JoinPage = () => {
  const { copyAddress, handleJoin, error, loading, joining, relyingServers } =
    useJoin();

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
        <Flex direction="column" gap="1em" align="center">
          <TextInput
            label="Opponent Name"
            placeholder="Bob"
            name="opponent"
            w="100%"
            withAsterisk
            required
            labelProps={{ mb: '0.5em', px: '0.5em' }}
            wrapperProps={{
              sx: {
                '& input': {
                  height: '1.5em',
                  borderRadius: '1em',
                  paddingInline: '1em',
                  fontWeight: '600',
                },
              },
            }}
          />
          <TextInput
            label="Opponent Address"
            placeholder="celestia1234567890abcdef"
            name="address"
            w="100%"
            withAsterisk
            required
            labelProps={{ mb: '0.5em', px: '0.5em' }}
            wrapperProps={{
              sx: {
                '& input': {
                  height: '1.5em',
                  borderRadius: '1em',
                  paddingInline: '1em',
                  fontWeight: '600',
                },
              },
            }}
          />
          <Select
            label="Relying Server"
            w="100%"
            data={relyingServers}
            name="server"
            withAsterisk
            labelProps={{ mb: '0.5em', px: '0.5em' }}
            maxDropdownHeight={400}
            wrapperProps={{
              sx: {
                '& input': {
                  height: '1.5em',
                  borderRadius: '1em',
                  paddingInline: '1em',
                  fontWeight: '600',
                },
              },
            }}
          />
          <Box style={{ flexBasis: 20 }} />
          <Flex gap="1rem">
            <Button
              onClick={copyAddress}
              variant="gradient"
              gradient={{ from: '#87BCF7', to: '#C07FF7', deg: 130 }}
            >
              Copy my address
            </Button>
            <Button
              type="submit"
              loading={joining}
              variant="gradient"
              gradient={{ from: '#87BCF7', to: '#C07FF7', deg: 130 }}
            >
              <Text>Join</Text>
            </Button>
          </Flex>
        </Flex>
      </form>
      <Box style={{ flexBasis: 100 }} />
    </Flex>
  );
};

export default JoinPage;
