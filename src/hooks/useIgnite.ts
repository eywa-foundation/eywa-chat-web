import { Client } from 'eywa-client-ts';
import { useEffect, useState } from 'react';
import useKeplr from './useKeplr';

type Newed<T> = T extends new (...args: never[]) => infer R ? R : never;

const useIgnite = () => {
  const { offlineSigner } = useKeplr();
  const [client, setClient] = useState<Newed<typeof Client>>();

  useEffect(() => {
    setClient(
      new Client(
        {
          apiURL: 'http://localhost:1317',
          rpcURL: 'http://localhost:26657',
          prefix: 'cosmos',
        },
        offlineSigner,
      ),
    );
  }, [offlineSigner]);

  return client;
};

export default useIgnite;
