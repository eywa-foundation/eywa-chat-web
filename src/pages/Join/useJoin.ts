import { useNavigate } from 'react-router';
import useKeplr from '../../hooks/useKeplr';
import { useClipboard } from '@mantine/hooks';

const useJoin = () => {
  const { accounts, error, loading } = useKeplr();
  const navigate = useNavigate();
  const { copy } = useClipboard();
  const copyAddress = () => {
    copy(accounts?.[0].address ?? '');
  };

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [account] = accounts ?? [];
    if (!account) return;
    navigate(`/chat/${e.currentTarget.address.value}`);
  };

  return { copyAddress, handleJoin, error, loading };
};

export default useJoin;
