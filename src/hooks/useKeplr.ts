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

const useKeplr = ({
  chainId = 'eywacontract',
  enabled = true,
}: {
  chainId?: string;
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
          rpc: 'http://localhost:26657',
          rest: 'http://localhost:1317',
          bip44: {
            coinType: 118,
          },
          bech32Config: {
            bech32PrefixAccAddr: 'celestia',
            bech32PrefixAccPub: 'celestia' + 'pub',
            bech32PrefixValAddr: 'celestia' + 'valoper',
            bech32PrefixValPub: 'celestia' + 'valoperpub',
            bech32PrefixConsAddr: 'celestia' + 'valcons',
            bech32PrefixConsPub: 'celestia' + 'valconspub',
          },
          currencies: [
            {
              coinDenom: 'TIA',
              coinMinimalDenom: 'utia',
              coinDecimals: 6,
              coinGeckoId: 'celestia',
            },
          ],
          feeCurrencies: [
            {
              coinDenom: 'TIA',
              coinMinimalDenom: 'utia',
              coinDecimals: 6,
              coinGeckoId: 'celestia',
              gasPriceStep: {
                low: 0.1,
                average: 0.2,
                high: 0.4,
              },
            },
          ],
          stakeCurrency: {
            coinDenom: 'TIA',
            coinMinimalDenom: 'utia',
            coinDecimals: 6,
            coinGeckoId: 'celestia',
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
  };
};

export default useKeplr;
