import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { encryptPayload, decryptPayload } from '../src/modules/crypto.js';

describe('Crypto Module (AES-256-GCM + PBKDF2)', () => {
  const password = 'SenhaSuperSecreta@Liamilena2026';
  const sampleHtml = `<!DOCTYPE html><html><body><h1>Dashboard Secreta</h1><p>Acesso Restrito & Seguro 🔒</p></body></html>`;

  test('encryptPayload should return a serialized encrypted bundle with salt, iv, and ciphertext', async () => {
    const encrypted = await encryptPayload(sampleHtml, password);
    assert.ok(typeof encrypted === 'string', 'Encrypted payload must be a string');
    
    const parsed = JSON.parse(encrypted);
    assert.ok(parsed.s, 'Must contain salt (s)');
    assert.ok(parsed.iv, 'Must contain iv');
    assert.ok(parsed.ct, 'Must contain ciphertext (ct)');
    assert.ok(parsed.v === 1, 'Must contain format version 1');
    assert.notEqual(parsed.ct, sampleHtml, 'Ciphertext must not be plaintext');
  });

  test('decryptPayload with correct password should recover exact plaintext', async () => {
    const encrypted = await encryptPayload(sampleHtml, password);
    const decrypted = await decryptPayload(encrypted, password);
    assert.equal(decrypted, sampleHtml);
  });

  test('decryptPayload with wrong password should fail with authorization error', async () => {
    const encrypted = await encryptPayload(sampleHtml, password);
    await assert.rejects(
      async () => {
        await decryptPayload(encrypted, 'SenhaErrada123');
      },
      (err) => {
        assert.match(err.message, /Chave inválida|Falha de descriptografia/i);
        return true;
      }
    );
  });

  test('decryptPayload should fail when ciphertext is corrupted or tampered with', async () => {
    const encrypted = await encryptPayload(sampleHtml, password);
    const parsed = JSON.parse(encrypted);
    parsed.ct = 'TAMPERED_CIPHERTEXT' + parsed.ct.slice(19);
    const tampered = JSON.stringify(parsed);

    await assert.rejects(
      async () => {
        await decryptPayload(tampered, password);
      },
      /Chave inválida|Falha de descriptografia/i
    );
  });

  test('should handle complex UTF-8, Portuguese accents, and large payloads', async () => {
    const complexPayload = 'ÁÉÍÓÚãõçÇ'.repeat(500) + ' 🔑 '.repeat(100);
    const encrypted = await encryptPayload(complexPayload, password);
    const decrypted = await decryptPayload(encrypted, password);
    assert.equal(decrypted, complexPayload);
  });
});
