import { useEffect } from 'react';
import { useNavigate } from 'react-router';

const ResetPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    globalThis.localStorage.removeItem('rooms');
    globalThis.localStorage.removeItem('keyPair');
    navigate('/');
  }, [navigate]);

  return null;
};

export default ResetPage;
