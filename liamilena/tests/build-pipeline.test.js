import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { runBuildPipeline } from '../src/build/encrypt-pipeline.js';
import { decryptPayload } from '../src/modules/crypto.js';
import { auditSourceCode } from '../src/modules/memory-guard.js';

describe('Build Pipeline & Obfuscated Shell Generator', () => {
  const testPassword = 'ChaveTeste@Liamilena2026';

  test('runBuildPipeline should produce an encrypted HTML shell without leaking plaintext', async () => {
    const rawTemplate = `
      <div id="secret-dashboard">
        <h2>Painel Exclusivo DataJud CNJ e Receita Federal</h2>
        <p>Alerta: Risco de Estelionato Detectado</p>
      </div>
    `;

    const shellHtml = await runBuildPipeline({
      templateContent: rawTemplate,
      password: testPassword,
      outputPath: null // in-memory run
    });

    assert.ok(typeof shellHtml === 'string');
    assert.ok(shellHtml.includes('<!DOCTYPE html>'));
    assert.ok(shellHtml.includes('ENCRYPTED_PAYLOAD'));
    assert.ok(shellHtml.includes('decryptPayload') || shellHtml.includes('crypto.subtle'));

    // Check zero plaintext leakage
    assert.equal(shellHtml.includes('DataJud CNJ'), false, 'Must not leak DataJud CNJ in plaintext');
    assert.equal(shellHtml.includes('Risco de Estelionato'), false, 'Must not leak Estelionato in plaintext');

    // Extract ciphertext and test decryption in memory
    const match = shellHtml.match(/const ENCRYPTED_PAYLOAD = `([^`]+)`;/);
    assert.ok(match, 'Must find ENCRYPTED_PAYLOAD in shell');
    const ciphertext = match[1];

    const recovered = await decryptPayload(ciphertext, testPassword);
    assert.ok(recovered.includes('Painel Exclusivo DataJud CNJ'));
  });

  test('the generated shell must pass LGPD static audit (no localStorage/cookies)', async () => {
    const shellHtml = await runBuildPipeline({
      templateContent: '<p>Dashboard Limpa</p>',
      password: testPassword,
      outputPath: null
    });

    const audit = auditSourceCode(shellHtml);
    assert.equal(audit.passed, true, `Audit failed: ${JSON.stringify(audit.violations)}`);
  });
});
