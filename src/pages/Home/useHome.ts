import { useNavigate } from 'react-router';
import useKeplr from '../../hooks/useKeplr';
import { useEffect, useState } from 'react';

const useHome = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const { keplr } = useKeplr({ enabled: ready });

  const start = () => {
    setReady(true);
  };

  useEffect(() => {
    if (!keplr) return;
    navigate('/list');
  }, [keplr, navigate, ready]);

  return { start };
};

export default useHome;
