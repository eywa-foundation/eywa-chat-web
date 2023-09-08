import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types';
import { useEffect, useState } from 'react';

declare global {
  interface Window extends KeplrWindow {}
}

const useKeplr = () => {
  const [keplr, setKeplr] = useState<Keplr | null>();
  useEffect(() => {
    if (window.keplr) {
      setKeplr(window.keplr);
    }

    if (document.readyState === 'complete') {
      setKeplr(window.keplr ?? null);
    }

    const stateChangeHandler = (event: Event) => {
      if ((event.target as Document | undefined)?.readyState !== 'complete')
        return;
      setKeplr(window.keplr ?? null);
      document.removeEventListener('readystatechange', stateChangeHandler);
    };
    document.addEventListener('readystatechange', stateChangeHandler);
  }, []);

  return keplr;
};

export default useKeplr;
