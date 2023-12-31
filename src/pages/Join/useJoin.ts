import { useNavigate } from 'react-router';
import useKeplr from '../../hooks/useKeplr';
import { useClipboard } from '@mantine/hooks';
import { useState } from 'react';
import useKeyPairStore from '../../hooks/useKeyPairStore';
import useRoomsStore from '../../hooks/useRoomsStore';
import useRelayServers from '../../hooks/useRelayServers';

const generateRoomId = (address1: string, address2: string) => {
  const [a, b] = [address1, address2].sort();
  return `${a}_${b}`;
};

const useJoin = () => {
  const { accounts, error, loading } = useKeplr();
  const navigate = useNavigate();
  const { copy } = useClipboard();
  const copyAddress = () => copy(accounts?.[0].address ?? '');
  const [joining, setJoining] = useState(false);
  const { client } = useKeplr();
  const { publicKey } = useKeyPairStore();
  const { addRoom } = useRoomsStore();
  const relayServers = useRelayServers();

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const server = e.currentTarget.server.value;
    if (!server || !client) return;
    (async () => {
      try {
        setJoining(true);
        const [account] = accounts ?? [];
        const targetAddress = e.currentTarget.address.value;
        if (!account || !targetAddress || !publicKey) return;
        await client.EywaEywa.tx.sendMsgCreateHandshake({
          value: {
            creator: account.address,
            receiver: targetAddress,
            roomId: generateRoomId(account.address, targetAddress),
            serverAddress: server,
          },
        });
        addRoom({
          opponent: targetAddress,
          roomId: generateRoomId(account.address, targetAddress),
          server,
          healthy: true,
          messages: [],
        });
        navigate('/list');
      } finally {
        setJoining(false);
      }
    })();
  };

  return { copyAddress, handleJoin, error, loading, joining, relayServers };
};

export default useJoin;
