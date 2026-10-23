import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAndFormatCPF,
  getReceitaFederalLink,
  analyzePhoneNumber,
  getAnatelConsultLink,
  getWhatsAppLink,
  getBnmpLink,
  getPoliciaFederalLink,
} from '../src/modules/deep-links.js';

describe('Level A: Deep Links & Identity Verification', () => {
  describe('CPF Validation and Formatting', () => {
    test('should validate a correct CPF with valid check digits', () => {
      const validCpf = '529.982.247-25';
      const result = validateAndFormatCPF(validCpf);
      assert.equal(result.valid, true);
      assert.equal(result.formatted, '529.982.247-25');
      assert.equal(result.clean, '52998224725');
    });

    test('should reject CPFs with invalid check digits or all identical digits', () => {
      assert.equal(validateAndFormatCPF('111.111.111-11').valid, false);
      assert.equal(validateAndFormatCPF('123.456.789-00').valid, false);
      assert.equal(validateAndFormatCPF('12345').valid, false);
    });
  });

  describe('Receita Federal Deep Link', () => {
    test('should return official Receita Federal URL', () => {
      const link = getReceitaFederalLink('52998224725');
      assert.ok(link.includes('receita.fazenda.gov.br'));
      assert.ok(link.includes('consultapublica'));
    });
  });

  describe('Phone and VoIP/Virtual Operator Analysis', () => {
    test('should parse valid mobile phone and identify DDD region', () => {
      const result = analyzePhoneNumber('11987654321');
      assert.equal(result.valid, true);
      assert.equal(result.ddd, '11');
      assert.equal(result.region, 'São Paulo - SP');
      assert.equal(result.isMobile, true);
      assert.equal(result.formatted, '(11) 98765-4321');
    });

    test('should flag virtual PBX or fixed numbers potentially used as VoIP', () => {
      const result = analyzePhoneNumber('1140030000');
      assert.equal(result.valid, true);
      assert.equal(result.isMobile, false);
      assert.equal(result.isVoipOrVirtual, true);
      assert.equal(result.type, 'Fixo / Número Virtual');
    });

    test('should generate Anatel / ABR Telecom deep link for carrier check', () => {
      const link = getAnatelConsultLink();
      assert.ok(link.includes('abrtelecom.com.br'));
    });

    test('should generate direct WhatsApp link without saving to contacts', () => {
      const link = getWhatsAppLink('(11) 98765-4321');
      assert.equal(link, 'https://wa.me/5511987654321');
    });
  });

  describe('Police Records and Arrest Warrants', () => {
    test('should generate direct link to BNMP (Banco Nacional de Mandados de Prisão - CNJ)', () => {
      const link = getBnmpLink();
      assert.ok(link.includes('portalbnmp.cnj.jus.br'));
    });

    test('should generate direct link to Polícia Federal Antecedentes Criminais', () => {
      const link = getPoliciaFederalLink();
      assert.ok(link.includes('antecedentes.dpf.gov.br'));
    });
  });
});
