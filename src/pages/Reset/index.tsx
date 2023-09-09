import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import useRoomsStore from '../../hooks/useRoomsStore';
import useKeyPairStore from '../../hooks/useKeyPairStore';

const ResetPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await useRoomsStore.persist.rehydrate();
      useRoomsStore.persist.clearStorage();
      await useKeyPairStore.persist.rehydrate();
      useKeyPairStore.persist.clearStorage();
      location.href = '/';
    })();
  }, [navigate]);

  return null;
};

export default ResetPage;
