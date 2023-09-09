import { Button, Center, Flex, Text } from '@mantine/core';
import useHome from './useHome';

const Logo = () => (
  <Center
    w="8rem"
    h="8rem"
    bg="linear-gradient(130deg, #87BCF7 0%, #C07FF7 100%)"
    style={{ borderRadius: '1rem' }}
  >
    <svg
      width="4em"
      height="6em"
      viewBox="0 0 6 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 10C0.447715 10 0 9.55228 0 9V1.5C0 0.947715 0.447715 0.5 1 0.5H5.25C5.66421 0.5 6 0.835786 6 1.25V1.25C6 1.66421 5.66421 2 5.25 2H2.5C1.94772 2 1.5 2.44772 1.5 3V3.5C1.5 4.05228 1.94772 4.5 2.5 4.5H5.25C5.66421 4.5 6 4.83579 6 5.25V5.25C6 5.66421 5.66421 6 5.25 6H2.5C1.94772 6 1.5 6.44772 1.5 7V7.5C1.5 8.05228 1.94772 8.5 2.5 8.5H5.25C5.66421 8.5 6 8.83579 6 9.25V9.25C6 9.66421 5.66421 10 5.25 10H1Z"
        fill="white"
      />
    </svg>
  </Center>
);

const HomePage = () => {
  const { start, loading } = useHome();
  return (
    <Flex h="100%" direction="column" align="center">
      <Flex style={{ flex: 1 }} align="center">
        <Flex direction="column" align="center" gap="1rem">
          <Logo />
          <Text size="2rem">Eywa</Text>
        </Flex>
      </Flex>
      <Flex direction="column" my="4rem" gap="1rem">
        <Button
          loading={loading}
          onClick={start}
          variant="gradient"
          gradient={{ from: '#87BCF7', to: '#C07FF7', deg: 130 }}
        >
          <Text>Starts with Wallet</Text>
        </Button>
      </Flex>
    </Flex>
  );
};

export default HomePage;
