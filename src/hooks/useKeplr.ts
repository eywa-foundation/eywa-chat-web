import { Keplr } from '@keplr-wallet/types';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    keplr: Keplr;
  }
}

const useKeplr = () => {
  const [keplr, setKeplr] = useState<Keplr>();
  useEffect(() => {
    if (window.keplr) {
      setKeplr(window.keplr);
    }

    if (document.readyState === 'complete') {
      setKeplr(window.keplr);
    }

    const stateChangeHandler = (event: Event) => {
      if ((event.target as Document | undefined)?.readyState !== 'complete')
        return;
      setKeplr(window.keplr);
      document.removeEventListener('readystatechange', stateChangeHandler);
    };
    document.addEventListener('readystatechange', stateChangeHandler);
  }, []);

  return keplr;
};

export default useKeplr;
