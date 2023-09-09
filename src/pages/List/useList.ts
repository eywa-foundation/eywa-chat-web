import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useRoomsStore from '../../hooks/useRoomsStore';

export interface Room {
  opponent: string;
  roomId: string;
  server: string;
  healthy: boolean;
  lastMessage: string;
}

const useList = () => {
  const { rooms: persistRooms } = useRoomsStore();
  const [rooms, setRooms] = useState<Room[]>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!persistRooms) return;
    setRooms(
      persistRooms.map((room) => ({
        ...room,
        healthy: Math.random() < 0.9,
        lastMessage: 'lastMessage',
      })),
    );
  }, [persistRooms]);

  const create = () => {
    navigate('/join');
  };

  return { rooms, create };
};

export default useList;
