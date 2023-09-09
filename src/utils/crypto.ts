export const generateKeyPair = async () => {
  return globalThis.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt'],
  );
};

const importKey = async (pem: string, type: 'spki' | 'pkcs8') =>
  globalThis.crypto.subtle.importKey(
    type,
    (() => {
      const binaryString = globalThis.atob(pem);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    })(),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    true,
    ['encrypt'],
  );

const exportKey = async (key: CryptoKey, type: 'spki' | 'pkcs8') => {
  const pem = await globalThis.crypto.subtle.exportKey(type, key);
  const pemArray = String.fromCharCode.apply(
    null,
    new Uint8Array(pem) as unknown as number[],
  );
  return globalThis.btoa(pemArray);
};

export const importPublicKey = async (pem: string) => importKey(pem, 'spki');
export const exportPublicKey = async (key: CryptoKey) => exportKey(key, 'spki');
export const importPrivateKey = async (pem: string) => importKey(pem, 'pkcs8');
export const exportPrivateKey = async (key: CryptoKey) =>
  exportKey(key, 'pkcs8');

export const encryptWithPublicKey = async (
  message: string,
  publicKey: CryptoKey,
) => {
  return globalThis.crypto.subtle
    .encrypt({ name: 'RSA-OAEP' }, publicKey, new TextEncoder().encode(message))
    .then((message) => {
      const bytes = new Uint8Array(message);
      const binaryString = String.fromCharCode.apply(null, Array.from(bytes));
      return globalThis.btoa(binaryString);
    });
};

export const decryptWithPrivateKey = async (
  message: string,
  privateKey: CryptoKey,
) => {
  return globalThis.crypto.subtle
    .decrypt(
      { name: 'RSA-OAEP' },
      privateKey,
      (() => {
        const binaryString = globalThis.atob(message);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      })(),
    )
    .then((message) => new TextDecoder().decode(message));
};
