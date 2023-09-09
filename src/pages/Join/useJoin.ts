import { useNavigate } from 'react-router';
import useKeplr from '../../hooks/useKeplr';
import { useClipboard } from '@mantine/hooks';
import { useEffect, useState } from 'react';

const useJoin = () => {
  const { accounts, error, loading } = useKeplr();
  const navigate = useNavigate();
  const { copy } = useClipboard();
  const copyAddress = () => {
    copy(accounts?.[0].address ?? '');
  };
  const [joining, setJoining] = useState(false);
  const [relyingServers, setRelyingServers] = useState<
    { value: string; label: string; selected: boolean }[]
  >([]);

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const server = e.currentTarget.server.value;
    if (!server) return;
    try {
      setJoining(true);
      const [account] = accounts ?? [];
      if (!account) return;
      const targetAddress = e.currentTarget.address.value;
      if (!targetAddress) return;
      navigate(`/chat/${targetAddress}`);
    } finally {
      setJoining(false);
    }
  };

  useEffect(() => {
    const servers = [
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
