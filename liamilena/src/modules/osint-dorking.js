/**
 * Módulo Nível B: Automação OSINT (Google Dorking para Triagem Imobiliária)
 * Constrói consultas lógicas avançadas para varredura de certidões, diários oficiais e riscos criminais.
 */

/**
 * Codifica e monta uma URL de busca no Google com operadores booleanos.
 * @param {string} query
 * @returns {string}
 */
export function buildGoogleSearchUrl(query) {
  if (!query || typeof query !== 'string') {
    throw new Error('Query inválida para busca');
  }
  return `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`;
}

/**
 * Constrói queries booleanas direcionadas conforme o tipo de investigação de antecedentes.
 * @param {string} leadName
 * @param {'CRIME_FRAUD'|'DIARIOS_OFICIAIS'|'REAL_ESTATE_SCAMS'|'JUSBRASIL_TRIBUNAIS'} type
 * @param {{ city?: string }} [options={}]
 * @returns {string}
 */
export function buildDorkQuery(leadName, type, options = {}) {
  if (!leadName || typeof leadName !== 'string') {
    throw new Error('Nome do lead é obrigatório');
  }

  const cleanName = leadName.replace(/"/g, '').trim();
  if (cleanName.length < 3) {
    throw new Error('Nome do lead deve ter no mínimo 3 caracteres');
  }

  const cityFilter = options.city ? ` "${options.city.trim()}"` : '';

  switch (type) {
    case 'CRIME_FRAUD':
      return `"${cleanName}"${cityFilter} AND ("estelionato" OR "fraude" OR "processo" OR "golpe" OR "art. 171")`;

    case 'DIARIOS_OFICIAIS':
      return `"${cleanName}"${cityFilter} filetype:pdf AND ("Réu" OR "Indiciado" OR "Executado" OR "Sentença" OR "Penhora")`;

    case 'REAL_ESTATE_SCAMS':
      return `"${cleanName}" AND ("procuração falsa" OR "falso proprietário" OR "dupla venda" OR "CRECI" OR "despejo")`;

    case 'JUSBRASIL_TRIBUNAIS':
      return `"${cleanName}"${cityFilter} (site:jusbrasil.com.br OR site:escavador.com)`;

    default:
      return `"${cleanName}"${cityFilter}`;
  }
}

/**
 * Gera a suíte completa de atalhos OSINT para triagem imediata da corretora.
 * @param {string} leadName
 * @param {{ city?: string, cpf?: string }} [options={}]
 * @returns {Array<{ id: string, title: string, category: string, query: string, url: string, description: string }>}
 */
export function generateOsintSuite(leadName, options = {}) {
  if (!leadName || typeof leadName !== 'string') {
    throw new Error('Nome do lead é obrigatório');
  }

  const cleanName = leadName.trim();
  if (cleanName.length < 3) {
    throw new Error('Nome do lead deve ter no mínimo 3 caracteres');
  }

  const suiteDefs = [
    {
      id: 'crime-fraud',
      title: 'Antecedentes e Fraudes Gerais',
      category: 'Criminal & Risco',
      type: 'CRIME_FRAUD',
      description: 'Varre notícias, processos e menções a estelionato, fraudes ou golpes.',
    },
    {
      id: 'diarios-oficiais',
      title: 'Diários Oficiais & PDFs Públicos',
      category: 'Jurídico Oficial',
      type: 'DIARIOS_OFICIAIS',
      description: 'Busca em publicações e decisões de tribunais filtrando por condição de Réu ou Executado.',
    },
    {
      id: 'real-estate-scams',
      title: 'Golpes no Mercado Imobiliário',
      category: 'Risco Patrimonial',
      type: 'REAL_ESTATE_SCAMS',
      description: 'Filtra alertas de procurações falsas, falso proprietário, ausência de CRECI ou despejos.',
    },
    {
      id: 'jusbrasil-tribunais',
      title: 'Jusbrasil & Escavador',
      category: 'Bureaus Jurídicos Abertos',
      type: 'JUSBRASIL_TRIBUNAIS',
      description: 'Consulta páginas públicas agregadas de tribunais estaduais e federais.',
    },
  ];

  return suiteDefs.map((def) => {
    const query = buildDorkQuery(cleanName, def.type, options);
    return {
      id: def.id,
      title: def.title,
      category: def.category,
      query,
      url: buildGoogleSearchUrl(query),
      description: def.description,
    };
  });
}
