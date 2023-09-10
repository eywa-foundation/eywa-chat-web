import { Button, Divider, Flex, Text, UnstyledButton } from '@mantine/core';
import useList, { Room } from './useList';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import HealthyCircle from '../../components/HealthyCircle';

const ChatList = ({ room }: { room: Room & { nickname: string } }) => {
  return (
    <Flex my="1rem" justify="space-between" align="center" gap="1em">
      <Flex direction="column" style={{ overflow: 'hidden' }}>
        <Text
          weight="bold"
          style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {room.opponent}
        </Text>
        <Text>{room.messages[room.messages.length - 1]?.message}</Text>
        <Text>{room.nickname}</Text>
      </Flex>
      <HealthyCircle healthy={room.healthy} />
    </Flex>
  );
};

const ListPage = () => {
  const { rooms, create } = useList();

  return (
    <Flex direction="column" py="1rem" gap="1rem">
      <Text size="1.5rem" weight="bold">
        Select Chatting Room or Create One
      </Text>
      <Button
        onClick={create}
        variant="gradient"
        gradient={{ from: '#87BCF7', to: '#C07FF7', deg: 130 }}
      >
        <Text>
          <b>+</b> Create New Room
        </Text>
      </Button>
      <Flex direction="column">
        {rooms?.map((room) => (
          <Fragment key={room.roomId}>
            <Link to={`/chat/${room.opponent}?server=${room.nickname}`}>
              <UnstyledButton style={{ width: '100%' }}>
                <ChatList room={room} />
              </UnstyledButton>
            </Link>
            <Divider />
          </Fragment>
        ))}
      </Flex>
    </Flex>
  );
};

export default ListPage;
