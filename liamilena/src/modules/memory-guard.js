/**
 * Módulo Memory Guard & Conformidade LGPD
 * Garante que a aplicação permaneça estritamente Stateless,
 * expurgando dados da memória RAM no ciclo de vida e impedindo vazamento de dados.
 */

/**
 * Sobrescreve e destrói recursivamente valores de um objeto ou array na memória RAM.
 * @param {object|Array} target
 */
export function purgeState(target) {
  if (!target || typeof target !== 'object') return;

  if (Array.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      if (typeof target[i] === 'object' && target[i] !== null) {
        purgeState(target[i]);
      }
      target[i] = null;
    }
    target.length = 0;
    return;
  }

  for (const key of Object.keys(target)) {
    const val = target[key];
    if (typeof val === 'object' && val !== null) {
      purgeState(val);
    } else {
      target[key] = null;
    }
  }
}

/**
 * Aplica máscara de proteção em dados sensíveis para exibição segura.
 * @param {string} value
 * @param {'cpf'|'phone'} type
 * @returns {string}
 */
export function maskPII(value, type) {
  if (!value || typeof value !== 'string') return '';
  const digits = value.replace(/\D/g, '');

  if (type === 'cpf') {
    if (digits.length < 11) return '***.***.***-**';
    const first3 = digits.slice(0, 3);
    const last2 = digits.slice(9, 11);
    return `${first3}.***.***-${last2}`;
  }

  if (type === 'phone') {
    if (digits.length < 10) return '(**) ****-****';
    const ddd = digits.slice(0, 2);
    const last4 = digits.slice(-4);
    return `(${ddd}) 9****-${last4}`;
  }

  return '***';
}

/**
 * Analisa estaticamente trechos de código em busca de violações do princípio Stateless / LGPD.
 * @param {string} codeString
 * @returns {{ passed: boolean, violations: Array<{ type: string, pattern: string }> }}
 */
export function auditSourceCode(codeString) {
  const violations = [];

  const checks = [
    { type: 'localStorage', regex: /\blocalStorage\b/g },
    { type: 'sessionStorage', regex: /\bsessionStorage\b/g },
    { type: 'cookie', regex: /\b(document\.cookie|cookieStore)\b/g },
    { type: 'indexedDB', regex: /\bindexedDB\b/g },
    { type: 'cacheStorage', regex: /\bcaches\.open\b/g },
  ];

  for (const check of checks) {
    if (check.regex.test(codeString)) {
      violations.push({
        type: check.type,
        pattern: check.regex.source,
      });
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Registra listeners no ciclo de vida da página para destruição forçada de dados em RAM.
 * @param {Function} cleanupCallback
 * @param {Window} [win=globalThis.window]
 */
export function registerUnloadGuard(cleanupCallback, win = globalThis.window) {
  if (!win || typeof win.addEventListener !== 'function') return;

  const events = ['pagehide', 'beforeunload'];
  events.forEach((evt) => {
    win.addEventListener(evt, () => {
      try {
        cleanupCallback();
      } catch {
        // Falha silenciosa para não impedir fechamento do navegador
      }
    });
  });

  if (typeof win.document !== 'undefined' && win.document.addEventListener) {
    win.document.addEventListener('visibilitychange', () => {
      if (win.document.visibilityState === 'hidden') {
        try {
          cleanupCallback();
        } catch {}
      }
    });
  }
}
