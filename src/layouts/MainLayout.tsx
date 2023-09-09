import { Container, Flex } from '@mantine/core';
import { Outlet } from 'react-router';

const MainLayout = () => {
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
        maw="500px"
        px="1rem"
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
