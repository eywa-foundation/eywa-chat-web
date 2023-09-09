import { Client } from 'eywa-contract-client-ts';
import { useEffect, useState } from 'react';

const useIgnite = () => {
  const [client] = useState(
    new Client({
      apiURL: 'http://localhost:1317',
      rpcURL: 'http://localhost:26657',
      prefix: 'cosmos',
    }),
  );

  useEffect(() => {
    (async () => {
      const balances = await client.CosmosBankV1Beta1.query.queryAllBalances(
        'cosmos1ly65awg79mydn9gf3m5ys5cren3f8k4l3xtr40',
      );
      console.log(balances);
    })();
  }, [client]);
};

export default useIgnite;
