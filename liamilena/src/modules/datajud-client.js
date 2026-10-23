/**
 * Módulo Nível C: Cliente DataJud (Conselho Nacional de Justiça)
 * Realiza buscas processuais e classifica riscos jurídicos/criminais do lead.
 */

// Chave pública fornecida pelo CNJ para acesso à API pública do DataJud
const PUBLIC_CNJ_API_KEY = 'cDZHYzlZa0JadVREZDJCendQbXY6SkJlTkxScEntTVBGQUxhQGdScVNadw==';
const DATAJUD_ENDPOINT = 'https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search';

/**
 * Constrói o corpo da requisição Elasticsearch da API DataJud.
 * @param {{ processNumber?: string, name?: string }} params
 * @returns {object}
 */
export function buildDataJudPayload(params) {
  if (params.processNumber) {
    const cleanNumber = params.processNumber.replace(/\D/g, '');
    return {
      query: {
        match: {
          numeroProcesso: cleanNumber,
        },
      },
    };
  }

  if (params.name) {
    return {
      query: {
        match_phrase: {
          'dadosBasicos.polo.parte.pessoa.nome': params.name.trim(),
        },
      },
    };
  }

  throw new Error('Parâmetro de busca obrigatório (processNumber ou name)');
}

/**
 * Classifica a severidade de um processo com base em sua classe e assuntos.
 * @param {object} source
 * @returns {{ level: 'HIGH'|'MODERATE'|'LOW', color: 'red'|'yellow'|'green', reasons: string[] }}
 */
export function classifyProcessRisk(source) {
  const classeNome = source?.classe?.nome || '';
  const assuntos = (source?.assuntos || []).map((a) => a.nome || '');
  const combinedText = `${classeNome} ${assuntos.join(' ')}`.toLowerCase();

  const reasons = [];

  const highRiskPatterns = [
    { regex: /estelionato|art\.?\s*171/i, label: 'Estelionato (art. 171)' },
    { regex: /fraude/i, label: 'Fraude Processual / Comercial' },
    { regex: /apropria[çc][ãa]o\s*ind[ée]bita/i, label: 'Apropriação Indébita' },
    { regex: /falsidade|falsifica/i, label: 'Falsidade Documental / Ideológica' },
    { regex: /extors[ãa]o/i, label: 'Extorsão' },
    { regex: /lavagem\s*de\s*dinheiro/i, label: 'Lavagem de Dinheiro' },
    { regex: /crime|a[çc][ãa]o\s*penal/i, label: 'Ação Penal / Processo Criminal' },
  ];

  for (const pattern of highRiskPatterns) {
    if (pattern.regex.test(combinedText)) {
      reasons.push(pattern.label);
    }
  }

  if (reasons.length > 0) {
    return { level: 'HIGH', color: 'red', reasons };
  }

  const moderateRiskPatterns = [
    { regex: /execu[çc][ãa]o/i, label: 'Execução de Dívida / Título' },
    { regex: /despejo/i, label: 'Ação de Despejo' },
    { regex: /inadimplemento|cobran[çc]a/i, label: 'Inadimplemento / Cobrança' },
    { regex: /condom[íi]nio/i, label: 'Dívida Condominial' },
    { regex: /fal[êe]ncia|recupera[çc][ãa]o\s*judicial/i, label: 'Falência / Recuperação' },
  ];

  for (const pattern of moderateRiskPatterns) {
    if (pattern.regex.test(combinedText)) {
      reasons.push(pattern.label);
    }
  }

  if (reasons.length > 0) {
    return { level: 'MODERATE', color: 'yellow', reasons };
  }

  return { level: 'LOW', color: 'green', reasons: ['Processo Cível Informativo / Administrativo'] };
}

/**
 * Converte a resposta bruta do Elasticsearch do DataJud em estrutura limpa de triagem.
 * @param {object} json
 * @returns {{ totalHits: number, overallRisk: 'CLEAN'|'LOW'|'MODERATE'|'HIGH', processes: Array<object> }}
 */
export function parseDataJudResponse(json) {
  const hits = json?.hits?.hits || [];
  const total = json?.hits?.total?.value ?? hits.length;

  if (total === 0 || hits.length === 0) {
    return {
      totalHits: 0,
      overallRisk: 'CLEAN',
      processes: [],
    };
  }

  const processes = hits.map((hit) => {
    const src = hit._source || {};
    const risk = classifyProcessRisk(src);
    return {
      id: hit._id,
      numeroProcesso: src.numeroProcesso || hit._id,
      tribunal: src.tribunal || 'TJSP',
      classe: src.classe?.nome || 'Não informada',
      dataAjuizamento: src.dataAjuizamento ? src.dataAjuizamento.slice(0, 10) : 'N/A',
      assuntos: (src.assuntos || []).map((a) => a.nome),
      riskLevel: risk.level,
      riskColor: risk.color,
      riskReasons: risk.reasons,
    };
  });

  let overallRisk = 'LOW';
  if (processes.some((p) => p.riskLevel === 'HIGH')) {
    overallRisk = 'HIGH';
  } else if (processes.some((p) => p.riskLevel === 'MODERATE')) {
    overallRisk = 'MODERATE';
  }

  return {
    totalHits: total,
    overallRisk,
    processes,
  };
}

/**
 * Gera payloads de simulação em memória conforme a skill liamilena-datajud-mock.
 * @param {'CLEAN'|'CIVIL_DEBT'|'HIGH_RISK_FRAUD'} scenario
 * @returns {object}
 */
export function generateMockDataJudPayload(scenario = 'CLEAN') {
  if (scenario === 'CLEAN') {
    return {
      took: 8,
      timed_out: false,
      hits: {
        total: { value: 0, relation: 'eq' },
        hits: [],
      },
    };
  }

  if (scenario === 'CIVIL_DEBT') {
    return {
      took: 12,
      timed_out: false,
      hits: {
        total: { value: 1, relation: 'eq' },
        hits: [
          {
            _index: 'processos-tjsp',
            _type: '_doc',
            _id: '10045678920238260100',
            _source: {
              numeroProcesso: '1004567-89.2023.8.26.0100',
              tribunal: 'TJSP',
              dataAjuizamento: '2023-04-18T14:20:00.000Z',
              classe: { codigo: 1116, nome: 'Execução de Título Extrajudicial' },
              assuntos: [
                { codigo: 9580, nome: 'Cobrança de Condomínio' },
                { codigo: 10432, nome: 'Despejo por Falta de Pagamento' },
              ],
            },
          },
        ],
      },
    };
  }

  if (scenario === 'HIGH_RISK_FRAUD') {
    return {
      took: 15,
      timed_out: false,
      hits: {
        total: { value: 1, relation: 'eq' },
        hits: [
          {
            _index: 'processos-tjsp',
            _type: '_doc',
            _id: '15012349920228260100',
            _source: {
              numeroProcesso: '1501234-99.2022.8.26.0100',
              tribunal: 'TJSP',
              dataAjuizamento: '2022-11-05T09:15:00.000Z',
              classe: { codigo: 283, nome: 'Ação Penal - Procedimento Ordinário' },
              assuntos: [
                { codigo: 3419, nome: 'Estelionato (art. 171)' },
                { codigo: 3560, nome: 'Fraude no Comércio' },
              ],
            },
          },
        ],
      },
    };
  }

  return {
    took: 5,
    timed_out: false,
    hits: { total: { value: 0 }, hits: [] },
  };
}

/**
 * Consulta a API DataJud (ou modo sandbox simulado).
 * @param {object} params
 * @param {{ sandbox?: boolean, scenario?: 'CLEAN'|'CIVIL_DEBT'|'HIGH_RISK_FRAUD', fetchFn?: Function }} [options={}]
 * @returns {Promise<object>}
 */
export function queryDataJud(params, options = {}) {
  if (options.sandbox) {
    const mockData = generateMockDataJudPayload(options.scenario || 'CLEAN');
    const parsed = parseDataJudResponse(mockData);
    return Promise.resolve({
      sandbox: true,
      ...parsed,
    });
  }

  const fetchFn = options.fetchFn || globalThis.fetch;
  const payload = buildDataJudPayload(params);

  return fetchFn(DATAJUD_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `APIKey ${PUBLIC_CNJ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`DataJud API Error: HTTP ${res.status}`);
      }
      return res.json();
    })
    .then((json) => {
      const parsed = parseDataJudResponse(json);
      return {
        sandbox: false,
        ...parsed,
      };
    });
}
