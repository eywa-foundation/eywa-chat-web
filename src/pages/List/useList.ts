import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export interface Room {
  opponent: string;
  roomId: string;
  server: string;
  healthy: boolean;
  lastMessage: string;
}

const useList = () => {
  const [rooms, setRooms] = useState<Room[]>();
  const navigate = useNavigate();

  useEffect(() => {
    setRooms(
      [...Array(10)].map(() => ({
        opponent: 'opponent',
        roomId: globalThis.crypto.randomUUID(),
        server: 'server',
        healthy: Math.random() < 0.9,
        lastMessage: 'lastMessage',
      })),
    );
  }, []);

  const create = () => {
    navigate('/join');
  };

  return { rooms, create };
};

export default useList;
