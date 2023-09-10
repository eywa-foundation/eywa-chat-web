import { Client } from 'eywa-client-ts';
import {
  AccountData,
  Keplr,
  Window as KeplrWindow,
  OfflineAminoSigner,
  OfflineDirectSigner,
} from '@keplr-wallet/types';
import { useEffect, useState } from 'react';

declare global {
  interface Window extends KeplrWindow {}
}

type Newed<T> = T extends new (...args: never[]) => infer R ? R : never;

const chains = {
  'eywa-testnet': {
    api: 'http://node.celestia.eywa.jaehong21.com:1317',
    rpc: 'http://node.celestia.eywa.jaehong21.com:26657',
  },
  eywa: {
    api: 'http://localhost:1317',
    rpc: 'http://localhost:26657',
  },
};

const useKeplr = ({
  chainId = 'eywa',
  enabled = true,
}: {
  chainId?: keyof typeof chains;
  enabled?: boolean;
} = {}) => {
  const [keplr, setKeplr] = useState<Keplr>();
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState<Error>();
  const [accounts, setAccounts] = useState<readonly AccountData[]>();
  const solvedKeplr = (!error && solved && keplr) || undefined;
  const [offlineSigner, setOfflineSigner] = useState<
    OfflineAminoSigner | OfflineDirectSigner
  >();
  const [client, setClient] = useState<Newed<typeof Client>>();

  useEffect(() => {
    if (!offlineSigner) return;
    setClient(
      new Client(
        {
          apiURL: chains[chainId].api,
          rpcURL: chains[chainId].rpc,
          prefix: 'cosmos',
        },
        offlineSigner,
      ),
    );
  }, [chainId, offlineSigner]);

  useEffect(() => {
    if (!enabled) return;
    if (window.keplr) {
      setKeplr(window.keplr as Keplr);
    }

    if (document.readyState === 'complete') {
      setKeplr(window.keplr as Keplr);
      if (!window.keplr) {
        setError(new Error('Keplr not found'));
      }
    }

    const stateChangeHandler = (event: Event) => {
      if ((event.target as Document | undefined)?.readyState !== 'complete')
        return;
      setKeplr(window.keplr as Keplr);
      if (!window.keplr) {
        setError(new Error('Keplr not found'));
      }
      document.removeEventListener('readystatechange', stateChangeHandler);
    };
    document.addEventListener('readystatechange', stateChangeHandler);
  }, [enabled]);

  useEffect(() => {
    if (!keplr) return;
    (async () => {
      try {
        await keplr.experimentalSuggestChain({
          chainId,
          chainName: chainId,
          rpc: chains[chainId].rpc,
          rest: chains[chainId].api,
          bip44: {
            coinType: 118,
          },
          bech32Config: {
            bech32PrefixAccAddr: 'cosmos',
            bech32PrefixAccPub: 'cosmos' + 'pub',
            bech32PrefixValAddr: 'cosmos' + 'valoper',
            bech32PrefixValPub: 'cosmos' + 'valoperpub',
            bech32PrefixConsAddr: 'cosmos' + 'valcons',
            bech32PrefixConsPub: 'cosmos' + 'valconspub',
          },
          currencies: [
            {
              coinDenom: 'ATOM',
              coinMinimalDenom: 'token',
              coinDecimals: 6,
              coinGeckoId: 'cosmos',
            },
          ],
          feeCurrencies: [
            {
              coinDenom: 'ATOM',
              coinMinimalDenom: 'token',
              coinDecimals: 6,
              coinGeckoId: 'cosmos',
              gasPriceStep: {
                low: 0.01,
                average: 0.025,
                high: 0.04,
              },
            },
          ],
          stakeCurrency: {
            coinDenom: 'ATOM',
            coinMinimalDenom: 'token',
            coinDecimals: 6,
            coinGeckoId: 'cosmos',
          },
        });
        await keplr.enable(chainId);
        setSolved(true);
      } catch (e) {
        setError(e as Error);
      }
    })();
  }, [keplr, chainId]);

  useEffect(() => {
    if (!offlineSigner) return;
    (async () => {
      try {
        const accounts = await offlineSigner.getAccounts();
        setAccounts(accounts);
      } catch (e) {
        setError(e as Error);
      }
    })();
  }, [offlineSigner]);

  useEffect(() => {
    (async () => {
      const signer = await solvedKeplr?.getOfflineSignerAuto(chainId);
      if (!signer) return;
      setOfflineSigner(signer);
    })();
  }, [chainId, solvedKeplr]);

  return {
    loading: !solved,
    keplr: solvedKeplr,
    error,
    offlineSigner,
    accounts,
    client,
  };
};

export default useKeplr;
