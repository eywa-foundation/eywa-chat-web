import { useNavigate } from 'react-router';
import useKeplr from '../../hooks/useKeplr';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import useKeyPairStore from '../../hooks/useKeyPairStore';
import { exportPublicKey } from '../../utils/crypto';

const useHome = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const { keplr, accounts, client } = useKeplr({ enabled: ready });
  const { publicKey, generateKeyPair } = useKeyPairStore();
  const [loading, setLoading] = useState(false);

  const start = () => {
    setReady(true);
  };

  useEffect(() => {
    const account = accounts?.[0];
    if (!keplr || !account || !client || loading) return;

    (async () => {
      try {
        setLoading(true);
        if (!publicKey) {
          const keyPair = await generateKeyPair();
          notifications.show({ message: `Key pair generated.` });
          await client.EywaEywa.tx.sendMsgRegisterUser({
            value: {
              creator: account.address,
              pubkey: await exportPublicKey(keyPair.publicKey),
            },
          });
        }
        notifications.show({ message: `Your address is ${account.address}` });
        navigate('/list', { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [accounts, client, generateKeyPair, keplr, loading, navigate, publicKey]);

  return { start, loading };
};

export default useHome;
