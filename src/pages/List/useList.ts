import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useRoomsStore from '../../hooks/useRoomsStore';
import useKeplr from '../../hooks/useKeplr';

export interface Room {
  opponent: string;
  roomId: string;
  server: string;
  healthy: boolean;
  lastMessage: string;
}

const useList = () => {
  const { rooms, addRoom } = useRoomsStore();
  const navigate = useNavigate();
  const { client, accounts } = useKeplr();

  useEffect(() => {
    const account = accounts?.[0];
    if (!client || !account) return;
    const pooling = async () => {
      const handshake = await client.EywaEywa.query.queryGetHandshake(
        account.address,
      );
      const notOpenedShakes = handshake.data.handshake?.filter(
        (shake) =>
          shake.roomId &&
          !(rooms?.map((room) => room.roomId).includes(shake.roomId) ?? false),
      );
      notOpenedShakes?.forEach((shake) => {
        addRoom({
          opponent: shake.sender ?? '',
          roomId: shake.roomId ?? '',
          server: shake.serverAddress ?? '',
          healthy: true,
          lastMessage: '',
        });
      });
    };
    const interval = setInterval(pooling, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [accounts, addRoom, client, rooms]);

  const create = () => {
    navigate('/join');
  };

  return { rooms, create };
};

export default useList;
