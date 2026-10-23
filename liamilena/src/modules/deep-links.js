/**
 * Módulo Nível A: Deep Links Governamentais e Análise de Linhas Telefônicas
 * Oferece validação de CPF, telecomunicação, WhatsApp, BNMP e Antecedentes Criminais.
 */

const DDD_REGIONS = {
  '11': 'São Paulo - SP', '12': 'São José dos Campos - SP', '13': 'Santos - SP',
  '14': 'Bauru - SP', '15': 'Sorocaba - SP', '16': 'Ribeirão Preto - SP',
  '17': 'São José do Rio Preto - SP', '18': 'Presidente Prudente - SP', '19': 'Campinas - SP',
  '21': 'Rio de Janeiro - RJ', '22': 'Campos dos Goytacazes - RJ', '24': 'Volta Redonda - RJ',
  '27': 'Vitória - ES', '28': 'Cachoeiro de Itapemirim - ES',
  '31': 'Belo Horizonte - MG', '32': 'Juiz de Fora - MG', '33': 'Governador Valadares - MG',
  '34': 'Uberlândia - MG', '35': 'Poços de Caldas - MG', '37': 'Divinópolis - MG', '38': 'Montes Claros - MG',
  '41': 'Curitiba - Paraná', '42': 'Ponta Grossa - PR', '43': 'Londrina - PR',
  '44': 'Maringá - PR', '45': 'Foz do Iguaçu - PR', '46': 'Francisco Beltrão - PR',
  '47': 'Joinville - SC', '48': 'Florianópolis - SC', '49': 'Chapecó - SC',
  '51': 'Porto Alegre - RS', '53': 'Pelotas - RS', '54': 'Caxias do Sul - RS', '55': 'Santa Maria - RS',
  '61': 'Brasília - DF / Entorno', '62': 'Goiânia - GO', '64': 'Rio Verde - GO',
  '63': 'Palmas - TO', '65': 'Cuiabá - MT', '66': 'Rondonópolis - MT',
  '67': 'Campo Grande - MS', '68': 'Rio Branco - AC', '69': 'Porto Velho - RO',
  '71': 'Salvador - BA', '73': 'Ilhéus - BA', '74': 'Juazeiro - BA', '75': 'Feira de Santana - BA', '77': 'Vitória da Conquista - BA',
  '79': 'Aracaju - SE', '81': 'Recife - PE', '82': 'Maceió - AL', '83': 'João Pessoa - PB',
  '84': 'Natal - RN', '85': 'Fortaleza - CE', '86': 'Teresina - PI', '87': 'Petrolina - PE',
  '88': 'Juazeiro do Norte - CE', '89': 'Picos - PI',
  '91': 'Belém - PA', '92': 'Manaus - AM', '93': 'Santarém - PA', '94': 'Marabá - PA',
  '95': 'Boa Vista - RR', '96': 'Macapá - AP', '97': 'Coari - AM', '98': 'São Luís - MA', '99': 'Imperatriz - MA'
};

/**
 * Valida o algoritmo oficial do CPF (Dígitos Verificadores Módulo 11) e formata.
 * @param {string} cpfRaw
 * @returns {{ valid: boolean, formatted: string, clean: string }}
 */
export function validateAndFormatCPF(cpfRaw) {
  if (!cpfRaw || typeof cpfRaw !== 'string') {
    return { valid: false, formatted: '', clean: '' };
  }

  const clean = cpfRaw.replace(/\D/g, '');

  if (clean.length !== 11 || /^(\d)\1{10}$/.test(clean)) {
    return { valid: false, formatted: '', clean };
  }

  // Primeiro Dígito Verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(clean[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== Number(clean[9])) {
    return { valid: false, formatted: '', clean };
  }

  // Segundo Dígito Verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(clean[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== Number(clean[10])) {
    return { valid: false, formatted: '', clean };
  }

  const formatted = clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  return { valid: true, formatted, clean };
}

/**
 * Retorna o link oficial da Receita Federal para consulta pública de CPF.
 * @param {string} [cpfClean='']
 * @returns {string}
 */
export function getReceitaFederalLink(cpfClean = '') {
  return 'https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp';
}

/**
 * Analisa o número de telefone, DDD, e detecta se trata-se de celular pessoal ou linha fixa/VoIP virtual.
 * @param {string} phoneRaw
 * @returns {{ valid: boolean, ddd: string, region: string, isMobile: boolean, isVoipOrVirtual: boolean, type: string, formatted: string }}
 */
export function analyzePhoneNumber(phoneRaw) {
  if (!phoneRaw || typeof phoneRaw !== 'string') {
    return { valid: false, ddd: '', region: '', isMobile: false, isVoipOrVirtual: false, type: 'Inválido', formatted: '' };
  }

  const clean = phoneRaw.replace(/\D/g, '');

  if (clean.length < 10 || clean.length > 11) {
    return { valid: false, ddd: '', region: '', isMobile: false, isVoipOrVirtual: false, type: 'Comprimento Inválido', formatted: '' };
  }

  const ddd = clean.slice(0, 2);
  const region = DDD_REGIONS[ddd] || 'Região Desconhecida';

  if (clean.length === 11 && clean[2] === '9') {
    const formatted = `(${ddd}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
    return {
      valid: true,
      ddd,
      region,
      isMobile: true,
      isVoipOrVirtual: false,
      type: 'Celular Pessoal (Móvel)',
      formatted,
    };
  }

  // Linhas fixas, centrais PABX virtuais ou números de 10 dígitos (potencial VoIP)
  const formatted = `(${ddd}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  return {
    valid: true,
    ddd,
    region,
    isMobile: false,
    isVoipOrVirtual: true,
    type: 'Fixo / Número Virtual',
    formatted,
  };
}

/**
 * Retorna link oficial de consulta de operadora do número (Anatel / ABR Telecom).
 * @returns {string}
 */
export function getAnatelConsultLink() {
  return 'https://consultanumero.abrtelecom.com.br/consultanumero/consulta/consultaSituacaoAtualCtg';
}

/**
 * Gera link direto para conversa de WhatsApp sem precisar salvar o contato.
 * Permite visualizar foto de perfil, status e biografia pública do lead.
 * @param {string} phoneRaw
 * @returns {string}
 */
export function getWhatsAppLink(phoneRaw) {
  if (!phoneRaw || typeof phoneRaw !== 'string') return '#';
  const clean = phoneRaw.replace(/\D/g, '');
  if (clean.length < 10) return '#';
  return `https://wa.me/55${clean}`;
}

/**
 * Retorna link direto para o BNMP 3.0 (Banco Nacional de Mandados de Prisão - CNJ).
 * Consulta pública aberta nacional para mandados de prisão em aberto.
 * @returns {string}
 */
export function getBnmpLink() {
  return 'https://portalbnmp.cnj.jus.br/#/pesquisa-peca';
}

/**
 * Retorna link oficial para emissão de Certidão de Antecedentes Criminais da Polícia Federal.
 * @returns {string}
 */
export function getPoliciaFederalLink() {
  return 'https://antecedentes.dpf.gov.br/antecedentes-criminais/certidao';
}
