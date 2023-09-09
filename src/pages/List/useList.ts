import { useEffect, useState } from 'react';

export interface Room {
  opponent: string;
  roomId: string;
  server: string;
  healthy: boolean;
  lastMessage: string;
}

const useList = () => {
  const [rooms, setRooms] = useState<Room[]>();

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

  return { rooms };
};

export default useList;
