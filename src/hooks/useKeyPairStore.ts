import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  exportPublicKey,
  generateKeyPair,
  importPrivateKey,
  importPublicKey,
} from '../utils/crypto';

interface KeyPairState {
  publicKey: CryptoKey | null;
  privateKey: CryptoKey | null;
  generateKeyPair: () => Promise<CryptoKeyPair>;
  exportPublicKey: () => Promise<string>;
}

const useKeyPairStore = create<KeyPairState>()(
  persist(
    (set, get) => ({
      publicKey: null,
      privateKey: null,
      generateKeyPair: async () => {
        const { publicKey, privateKey } = await generateKeyPair();
        set({ publicKey, privateKey });
        return { publicKey, privateKey };
      },
      exportPublicKey: async () => {
        const publicKey = get().publicKey;
        if (!publicKey) return '';
        return exportPublicKey(publicKey);
      },
    }),
    {
      name: 'keyPair',
      storage: {
        getItem: async (name) => {
          const serialized = globalThis.localStorage.getItem(name);
          if (!serialized) return null;
          const json = JSON.parse(serialized);
          return {
            state: {
              publicKey: await importPublicKey(json.publicKey),
              privateKey: await importPrivateKey(json.privateKey),
            },
            version: json.version,
          };
        },
        setItem: async (name, value) => {
          const serialized = JSON.stringify({
            publicKey: await exportPublicKey(value.state.publicKey),
            privateKey: await exportPublicKey(value.state.privateKey),
            version: value.version,
          });
          globalThis.localStorage.setItem(name, serialized);
        },
        removeItem: (name) => globalThis.localStorage.removeItem(name),
      },
    },
  ),
);

export default useKeyPairStore;
