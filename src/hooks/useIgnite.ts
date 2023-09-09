import { Client } from 'eywa-contract-client-ts';
import { useEffect, useState } from 'react';
import useKeplr from './useKeplr';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';

const useIgnite = (enable: boolean) => {
  const { offlineSigner } = useKeplr();
  const [client] = useState(
    new Client({
      apiURL: 'http://localhost:1317',
      rpcURL: 'http://localhost:26657',
      prefix: 'cosmos',
    }),
  );

  useEffect(() => {
    if (!enable || !offlineSigner) return;
    (async () => {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        'struggle infant prefer soda patch client usage cup despair decline face voyage change pattern transfer grocery artwork marriage test slice hurry bridge sugar retreat',
        { prefix: 'celestia' },
      );

      client.useSigner(wallet);
      console.log(await offlineSigner.getAccounts());
      const balances = await client.EywacontractEywacontract.tx.sendMsgRegister(
        {
          value: {
            creator: 'celstia18efwkhkw8w9eq672cexeyf49dsv66lnrkepmgm',
            pubkey: 'asdf',
          },
        },
      );
      console.log(balances);
    })();
  }, [client, enable, offlineSigner]);
};

export default useIgnite;
