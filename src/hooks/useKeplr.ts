import { AccountData, Keplr, Window as KeplrWindow } from '@keplr-wallet/types';
import { useEffect, useMemo, useState } from 'react';

declare global {
  interface Window extends KeplrWindow {}
}

const useKeplr = (chainId = 'cosmoshub-4') => {
  const [keplr, setKeplr] = useState<Keplr>();
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState<Error>();
  const [accounts, setAccounts] = useState<readonly AccountData[]>();
  const solvedKeplr = (!error && solved && keplr) || undefined;
  const offlineSigner = useMemo(
    () => solvedKeplr?.getOfflineSigner(chainId),
    [chainId, solvedKeplr],
  );

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!keplr) return;
    (async () => {
      try {
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

  return {
    loading: !solved,
    keplr: solvedKeplr,
    error,
    offlineSigner,
    accounts,
  };
};

export default useKeplr;
