import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGoogleSearchUrl,
  buildDorkQuery,
  generateOsintSuite,
} from '../src/modules/osint-dorking.js';

describe('Level B: OSINT & Google Dorking Engine', () => {
  const leadName = 'Carlos Eduardo de Oliveira';

  test('buildGoogleSearchUrl should properly encode complex query parameters', () => {
    const rawQuery = '"Carlos Eduardo" AND ("fraude" OR "processo")';
    const url = buildGoogleSearchUrl(rawQuery);
    assert.ok(url.startsWith('https://www.google.com/search?q='));
    assert.ok(url.includes(encodeURIComponent('"Carlos Eduardo"')));
  });

  test('buildDorkQuery should generate targeted queries for crime and fraud', () => {
    const query = buildDorkQuery(leadName, 'CRIME_FRAUD');
    assert.ok(query.includes(`"${leadName}"`));
    assert.ok(query.includes('estelionato'));
    assert.ok(query.includes('fraude'));
  });

  test('buildDorkQuery should generate targeted queries for Official Gazettes (Diários Oficiais/PDFs)', () => {
    const query = buildDorkQuery(leadName, 'DIARIOS_OFICIAIS');
    assert.ok(query.includes(`"${leadName}"`));
    assert.ok(query.includes('filetype:pdf'));
    assert.ok(query.includes('Executado') || query.includes('Réu'));
  });

  test('buildDorkQuery should generate specific real estate scam queries', () => {
    const query = buildDorkQuery(leadName, 'REAL_ESTATE_SCAMS');
    assert.ok(query.includes(`"${leadName}"`));
    assert.ok(query.includes('procuração falsa') || query.includes('falso proprietário'));
  });

  test('generateOsintSuite should return a complete ready-to-click suite of OSINT searches', () => {
    const suite = generateOsintSuite(leadName, { city: 'São Paulo' });
    assert.ok(Array.isArray(suite));
    assert.ok(suite.length >= 4);

    const first = suite[0];
    assert.ok(first.id);
    assert.ok(first.title);
    assert.ok(first.url.startsWith('https://www.google.com/search?q='));
    assert.ok(first.description);
  });

  test('should throw an error if lead name is missing or too short', () => {
    assert.throws(() => generateOsintSuite(''), /Nome do lead é obrigatório/);
    assert.throws(() => generateOsintSuite('ab'), /Nome do lead deve ter no mínimo/);
  });
});
