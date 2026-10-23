import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  purgeState,
  maskPII,
  auditSourceCode,
  registerUnloadGuard,
} from '../src/modules/memory-guard.js';

describe('LGPD & Stateless Memory Guard', () => {
  test('purgeState should completely zero out sensitive objects in memory', () => {
    const sensitiveSession = {
      leadName: 'João da Silva Santos',
      cpf: '123.456.789-00',
      processes: [
        { numero: '1002345-67.2023.8.26.0100', crime: 'Estelionato' }
      ],
      metadata: { score: 10, notes: 'Negociação em andamento' }
    };

    purgeState(sensitiveSession);

    assert.equal(sensitiveSession.leadName, null);
    assert.equal(sensitiveSession.cpf, null);
    assert.equal(sensitiveSession.processes.length, 0);
    assert.equal(sensitiveSession.metadata.score, null);
    assert.equal(sensitiveSession.metadata.notes, null);
  });

  test('maskPII should securely mask CPF numbers', () => {
    assert.equal(maskPII('12345678900', 'cpf'), '123.***.***-00');
    assert.equal(maskPII('123.456.789-00', 'cpf'), '123.***.***-00');
  });

  test('maskPII should securely mask phone numbers', () => {
    assert.equal(maskPII('11987654321', 'phone'), '(11) 9****-4321');
    assert.equal(maskPII('(11) 98765-4321', 'phone'), '(11) 9****-4321');
  });

  test('auditSourceCode should catch violations of localStorage, sessionStorage, and cookies', () => {
    const dirtyCode = `
      function saveUser(lead) {
        localStorage.setItem('lead_cpf', lead.cpf);
        sessionStorage.setItem('token', 'xyz');
        document.cookie = 'user=123';
      }
    `;

    const audit = auditSourceCode(dirtyCode);
    assert.equal(audit.passed, false);
    assert.ok(audit.violations.some(v => v.type === 'localStorage'));
    assert.ok(audit.violations.some(v => v.type === 'sessionStorage'));
    assert.ok(audit.violations.some(v => v.type === 'cookie'));
  });

  test('auditSourceCode should approve clean stateless code', () => {
    const cleanCode = `
      export function handleQuery(cpf) {
        const queryUrl = 'https://exemplo.gov.br?q=' + encodeURIComponent(cpf);
        return window.open(queryUrl, '_blank');
      }
    `;

    const audit = auditSourceCode(cleanCode);
    assert.equal(audit.passed, true);
    assert.equal(audit.violations.length, 0);
  });

  test('registerUnloadGuard should bind pagehide and beforeunload to trigger cleanup', () => {
    let cleanupTriggered = 0;
    const mockEvents = {};
    const mockWindow = {
      addEventListener: (evt, handler) => {
        mockEvents[evt] = handler;
      }
    };

    registerUnloadGuard(() => {
      cleanupTriggered++;
    }, mockWindow);

    assert.ok(mockEvents['pagehide'], 'Must listen to pagehide');
    assert.ok(mockEvents['beforeunload'], 'Must listen to beforeunload');

    // Simulate page closing/refresh
    mockEvents['pagehide']();
    assert.equal(cleanupTriggered, 1);

    mockEvents['beforeunload']();
    assert.equal(cleanupTriggered, 2);
  });
});
