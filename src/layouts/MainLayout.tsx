import { Box, Flex } from '@mantine/core';
import { Outlet } from 'react-router';
import Background from './Background';

const MainLayout = ({
  smallPadding: nonPadding = false,
}: {
  smallPadding?: boolean;
}) => {
  return (
    <Flex
      justify="center"
      sx={(theme) => ({
        background:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[7]
            : theme.colors.gray[0],
      })}
    >
      <Box
        w="100vw"
        maw="500px"
        mih="100vh"
        sx={(theme) => ({
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[1],
        })}
      >
        <Background>
          <Box h="100%" px={nonPadding ? 0 : '3rem'}>
            <Outlet />
          </Box>
        </Background>
      </Box>
    </Flex>
  );
};

export default MainLayout;
