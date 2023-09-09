import { useNavigate } from 'react-router';
import useKeplr from '../../hooks/useKeplr';
import { useClipboard } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import useKeyPairStore from '../../hooks/useKeyPairStore';
import useRoomsStore from '../../hooks/useRoomsStore';

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
  const [relyingServers, setRelyingServers] = useState<
    { value: string; label: string; selected: boolean }[]
  >([]);
  const { client } = useKeplr();
  const { publicKey } = useKeyPairStore();
  const { addRoom } = useRoomsStore();

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
          lastMessage: '',
        });
        navigate(`/chat/${targetAddress}`);
      } finally {
        setJoining(false);
      }
    })();
  };

  useEffect(() => {
    const servers = [
      {
        value: 'cosmos',
        label: 'Cosmos Network',
      },
      {
        value: 'wss://relayer.eytukan.eywa.jaehong21.com',
        label: 'Eytukan',
      },
      {
        value: 'wss://relayer.neytiri.eywa.jaehong21.com',
        label: 'Neytiri',
      },
      {
        value: 'wss://relayer.toruk.eywa.jaehong21.com',
        label: 'Toruk',
      },
    ];
    const selectedIndex = Math.floor(Math.random() * servers.length);
    setRelyingServers(
      servers.map((server, index) => ({
        ...server,
        selected: index === selectedIndex,
      })),
    );
  }, []);

  return { copyAddress, handleJoin, error, loading, joining, relyingServers };
};

export default useJoin;
