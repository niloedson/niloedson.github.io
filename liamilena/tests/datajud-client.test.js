import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDataJudPayload,
  classifyProcessRisk,
  parseDataJudResponse,
  generateMockDataJudPayload,
  queryDataJud,
} from '../src/modules/datajud-client.js';

describe('Level C: DataJud (CNJ) Client & Risk Classifier', () => {
  describe('Payload Builder', () => {
    test('should build valid Elasticsearch query by process number', () => {
      const payload = buildDataJudPayload({ processNumber: '1002345-67.2023.8.26.0100' });
      assert.ok(payload.query);
      assert.ok(payload.query.match);
      assert.equal(payload.query.match.numeroProcesso, '10023456720238260100');
    });

    test('should build valid Elasticsearch query by lead name', () => {
      const payload = buildDataJudPayload({ name: 'Maria das Graças Silva' });
      assert.ok(payload.query.match_phrase);
    });
  });

  describe('Process Risk Classifier', () => {
    test('should classify fraud and criminal matters as HIGH risk', () => {
      const source = {
        classe: { nome: 'Ação Penal - Procedimento Ordinário' },
        assuntos: [{ nome: 'Estelionato (art. 171)' }, { nome: 'Fraude no Comércio' }]
      };
      const classification = classifyProcessRisk(source);
      assert.equal(classification.level, 'HIGH');
      assert.equal(classification.color, 'red');
      assert.ok(classification.reasons.includes('Estelionato (art. 171)'));
    });

    test('should classify eviction and debts as MODERATE risk', () => {
      const source = {
        classe: { nome: 'Execução de Título Extrajudicial' },
        assuntos: [{ nome: 'Despejo por Falta de Pagamento' }, { nome: 'Cobrança de Condomínio' }]
      };
      const classification = classifyProcessRisk(source);
      assert.equal(classification.level, 'MODERATE');
      assert.equal(classification.color, 'yellow');
    });

    test('should classify general administrative acts as LOW risk', () => {
      const source = {
        classe: { nome: 'Procedimento Comum Cível' },
        assuntos: [{ nome: 'Retificação de Registro Civil' }]
      };
      const classification = classifyProcessRisk(source);
      assert.equal(classification.level, 'LOW');
      assert.equal(classification.color, 'green');
    });
  });

  describe('Response Parser & Mock Generator (Sandbox)', () => {
    test('should parse CLEAN scenario with zero processes', () => {
      const mockPayload = generateMockDataJudPayload('CLEAN');
      const parsed = parseDataJudResponse(mockPayload);
      assert.equal(parsed.totalHits, 0);
      assert.equal(parsed.overallRisk, 'CLEAN');
      assert.equal(parsed.processes.length, 0);
    });

    test('should parse HIGH_RISK_FRAUD scenario with critical alerts', () => {
      const mockPayload = generateMockDataJudPayload('HIGH_RISK_FRAUD');
      const parsed = parseDataJudResponse(mockPayload);
      assert.equal(parsed.totalHits, 1);
      assert.equal(parsed.overallRisk, 'HIGH');
      assert.equal(parsed.processes[0].riskLevel, 'HIGH');
    });

    test('queryDataJud should return mock data seamlessly when in sandbox mode', async () => {
      const result = await queryDataJud({ name: 'Lead Teste' }, { sandbox: true, scenario: 'CIVIL_DEBT' });
      assert.equal(result.sandbox, true);
      assert.equal(result.overallRisk, 'MODERATE');
      assert.ok(result.processes.length > 0);
    });
  });
});
