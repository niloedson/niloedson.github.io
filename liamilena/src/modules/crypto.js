/**
 * Módulo Criptográfico Stateless (AES-256-GCM + PBKDF2)
 * Compatível 100% com Node.js (v16+) e Browsers Modernos através da Web Crypto API.
 */

const cryptoSubtle = globalThis.crypto?.subtle;

function uint8ToBase64(uint8) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(uint8).toString('base64');
  }
  let binary = '';
  for (let i = 0; i < uint8.byteLength; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  return btoa(binary);
}

function base64ToUint8(base64) {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveKey(password, saltUint8, usage) {
  const enc = new TextEncoder();
  const passwordKey = await cryptoSubtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return cryptoSubtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltUint8,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    usage
  );
}

/**
 * Criptografa um texto (HTML/JSON/JS) em AES-256-GCM com Salt e IV aleatórios.
 * @param {string} plaintext
 * @param {string} password
 * @returns {Promise<string>} String JSON serializada com s, iv e ct em base64
 */
export async function encryptPayload(plaintext, password) {
  if (!plaintext || typeof plaintext !== 'string') {
    throw new Error('Plaintext inválido para criptografia');
  }
  if (!password || typeof password !== 'string') {
    throw new Error('Senha obrigatória para cifragem');
  }

  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16));
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, ['encrypt']);

  const enc = new TextEncoder();
  const encodedPlaintext = enc.encode(plaintext);

  const ciphertextBuffer = await cryptoSubtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedPlaintext
  );

  const bundle = {
    v: 1,
    s: uint8ToBase64(salt),
    iv: uint8ToBase64(iv),
    ct: uint8ToBase64(new Uint8Array(ciphertextBuffer)),
  };

  return JSON.stringify(bundle);
}

/**
 * Descriptografa um bundle gerado por encryptPayload em memória RAM.
 * Rejeita com erro seguro caso a senha seja inválida ou os dados tenham sido adulterados.
 * @param {string} bundleString
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function decryptPayload(bundleString, password) {
  if (!bundleString || typeof bundleString !== 'string') {
    throw new Error('Payload criptografado inválido');
  }
  if (!password || typeof password !== 'string') {
    throw new Error('Senha requerida para descriptografia');
  }

  let bundle;
  try {
    bundle = JSON.parse(bundleString);
  } catch {
    throw new Error('Falha de descriptografia: Formato de payload corrompido');
  }

  if (!bundle.s || !bundle.iv || !bundle.ct) {
    throw new Error('Falha de descriptografia: Campos essenciais ausentes no payload');
  }

  try {
    const salt = base64ToUint8(bundle.s);
    const iv = base64ToUint8(bundle.iv);
    const ciphertext = base64ToUint8(bundle.ct);

    const key = await deriveKey(password, salt, ['decrypt']);

    const decryptedBuffer = await cryptoSubtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (err) {
    throw new Error('Chave inválida ou dados corrompidos (Falha de descriptografia)');
  }
}
