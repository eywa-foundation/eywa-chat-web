import { useNavigate } from 'react-router';
import useKeplr from '../../hooks/useKeplr';
import { useEffect, useState } from 'react';
import useKeyPairStore from '../../hooks/useKeyPairStore';

const useHome = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const { keplr } = useKeplr({ enabled: ready });
  const { publicKey, generateKeyPair } = useKeyPairStore();

  const start = () => {
    setReady(true);
  };

  useEffect(() => {
    if (publicKey) return;
    generateKeyPair();
  }, [generateKeyPair, publicKey]);

  useEffect(() => {
    if (!keplr || !publicKey) return;
    navigate('/list');
  }, [keplr, navigate, publicKey]);

  return { start };
};

export default useHome;
