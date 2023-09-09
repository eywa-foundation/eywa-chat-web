import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useRoomsStore from '../../hooks/useRoomsStore';
import useKeyPairStore from '../../hooks/useKeyPairStore';

const ResetPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    useRoomsStore.persist.clearStorage();
    useKeyPairStore.persist.clearStorage();
    navigate('/');
  }, [navigate]);

  return null;
};

export default ResetPage;
