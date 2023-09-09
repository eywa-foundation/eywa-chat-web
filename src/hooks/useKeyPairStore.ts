import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  exportPrivateKey,
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
      publicKey: null as CryptoKey | null,
      privateKey: null as CryptoKey | null,
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
      partialize: (state) => ({
        privateKey: state.privateKey,
        publicKey: state.publicKey,
      }),
      storage: {
        getItem: async (name) => {
          const serialized = globalThis.localStorage.getItem(name);
          if (!serialized) return null;
          const json = JSON.parse(serialized);
          return {
            state: {
              publicKey: json.publicKey
                ? await importPublicKey(json.publicKey)
                : null,
              privateKey: json.privateKey
                ? await importPrivateKey(json.privateKey)
                : null,
            },
            version: json.version,
          };
        },
        setItem: async (name, value) => {
          const serialized = JSON.stringify({
            publicKey: value.state.publicKey
              ? await exportPublicKey(value.state.publicKey)
              : null,
            privateKey: value.state.privateKey
              ? await exportPrivateKey(value.state.privateKey)
              : null,
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
