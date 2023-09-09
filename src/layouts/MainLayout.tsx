import { Container, Flex } from '@mantine/core';
import { Outlet } from 'react-router';

const MainLayout = ({ smallPadding = false }: { smallPadding?: boolean }) => {
  return (
    <Flex
      justify="center"
      sx={(theme) => ({
        background:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[8]
            : theme.colors.gray[1],
      })}
    >
      <Container
        w="100vw"
        maw="500px"
        mih="100vh"
        px={smallPadding ? '1rem' : '3rem'}
        sx={(theme) => ({
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[7]
              : theme.colors.gray[0],
        })}
      >
        <Outlet />
      </Container>
    </Flex>
  );
};

export default MainLayout;
