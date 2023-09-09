import { useNavigate } from 'react-router';
import useKeplr from '../../hooks/useKeplr';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import useKeyPairStore from '../../hooks/useKeyPairStore';

const useHome = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const { keplr, accounts } = useKeplr({ enabled: ready });
  const { publicKey, generateKeyPair } = useKeyPairStore();

  const start = () => {
    setReady(true);
  };

  useEffect(() => {
    if (publicKey) return;
  }, [generateKeyPair, publicKey]);

  useEffect(() => {
    const account = accounts?.[0];
    if (!keplr || !account) return;

    if (!publicKey) {
      generateKeyPair();
      notifications.show({ message: `Key pair generated.` });
    }
    notifications.show({ message: `Your address is ${account.address}` });
    navigate('/list', { replace: true });
  }, [accounts, generateKeyPair, keplr, navigate, publicKey]);

  return { start };
};

export default useHome;
