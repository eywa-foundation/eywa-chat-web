import { useNavigate } from 'react-router';
import useKeplr from '../../hooks/useKeplr';
import { useClipboard } from '@mantine/hooks';
import { useState } from 'react';

const useJoin = () => {
  const { accounts, error, loading } = useKeplr();
  const navigate = useNavigate();
  const { copy } = useClipboard();
  const copyAddress = () => {
    copy(accounts?.[0].address ?? '');
  };
  const [joining, setJoining] = useState(false);

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setJoining(true);
      const [account] = accounts ?? [];
      if (!account) return;
      navigate(`/chat/${e.currentTarget.address.value}`);
    } finally {
      setJoining(false);
    }
  };

  return { copyAddress, handleJoin, error, loading, joining };
};

export default useJoin;
