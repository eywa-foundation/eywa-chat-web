import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  UnstyledButton,
} from '@mantine/core';
import useList, { Room } from './useList';
import { Fragment } from 'react';

const HealthyCircle = ({ healthy }: { healthy: boolean }) => (
  <Box
    mr="1rem"
    style={{
      width: '0.75rem',
      height: '0.75rem',
      borderRadius: '50%',
      backgroundColor: healthy ? 'green' : 'red',
    }}
  />
);

const ChatList = ({ room }: { room: Room }) => {
  return (
    <Flex my="1rem" justify="space-between" align="center">
      <Flex direction="column">
        <Text weight="bold">{room.opponent}</Text>
        <Text>{room.lastMessage}</Text>
      </Flex>
      <HealthyCircle healthy={room.healthy} />
    </Flex>
  );
};

const ListPage = () => {
  const { rooms } = useList();

  return (
    <Flex direction="column" py="1rem" gap="1rem">
      <Text size="1.75rem" weight="bold">
        Select Chatting Room
        <br />
        or Create One
      </Text>
      <Button>
        <Text>
          <b>+</b> Create New Room
        </Text>
      </Button>
      <Flex direction="column">
        {rooms?.map((room) => (
          <Fragment key={room.roomId}>
            <UnstyledButton>
              <ChatList room={room} />
            </UnstyledButton>
            <Divider />
          </Fragment>
        ))}
      </Flex>
    </Flex>
  );
};

export default ListPage;
