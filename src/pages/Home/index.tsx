import { Button, Center, Flex, Text } from '@mantine/core';
import useHome from './useHome';

const Logo = () => (
  <Center
    w="8rem"
    h="8rem"
    bg="linear-gradient(130deg, #87BCF7 0%, #C07FF7 100%)"
    style={{ borderRadius: '1rem' }}
  >
    <Text size="6rem" color="white">
      E
    </Text>
  </Center>
);

const HomePage = () => {
  const { start } = useHome();
  return (
    <Flex h="100%" direction="column" align="center">
      <Flex style={{ flex: 1 }} align="center">
        <Flex direction="column" align="center" gap="1rem">
          <Logo />
          <Text size="2rem">Eywa</Text>
        </Flex>
      </Flex>
      <Flex direction="column" my="2rem" gap="1rem">
        <Button onClick={start}>
          <Text>Starts with Wallet</Text>
        </Button>
        <Button variant="outline">
          <Text>What is Eywa?</Text>
        </Button>
      </Flex>
    </Flex>
  );
};

export default HomePage;
