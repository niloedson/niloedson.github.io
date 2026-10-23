import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { encryptPayload } from '../modules/crypto.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Gera a casca estática HTML com descriptografia em memória RAM.
 * @param {string} encryptedBundleJson
 * @returns {string}
 */
export function generateShellHtml(encryptedBundleJson) {
  // Escapa backticks e barras invertidas para injeção segura na string template
  const safeBundle = encryptedBundleJson.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <title>Acesso Restrito - Liamilena Imóveis</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      padding: 1.5rem;
    }
    .auth-card {
      background: #1e293b;
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      border: 1px solid #334155;
      max-width: 420px;
      width: 100%;
      text-align: center;
    }
    .icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      display: inline-block;
    }
    h1 {
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #f1f5f9;
    }
    p.desc {
      font-size: 0.85rem;
      color: #94a3b8;
      margin-bottom: 1.5rem;
      line-height: 1.4;
    }
    .form-group {
      margin-bottom: 1.25rem;
      text-align: left;
    }
    label {
      display: block;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #cbd5e1;
      margin-bottom: 0.4rem;
    }
    input[type="password"] {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 1px solid #475569;
      background: #0f172a;
      color: #f8fafc;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type="password"]:focus {
      border-color: #38bdf8;
    }
    button.unlock-btn {
      width: 100%;
      padding: 0.8rem;
      border-radius: 8px;
      border: none;
      background: #0284c7;
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
    }
    button.unlock-btn:hover { background: #0369a1; }
    button.unlock-btn:active { transform: scale(0.98); }
    .error-msg {
      margin-top: 1rem;
      padding: 0.6rem;
      border-radius: 6px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid #ef4444;
      color: #fca5a5;
      font-size: 0.85rem;
      display: none;
    }
    .badge {
      display: inline-block;
      margin-top: 1.5rem;
      font-size: 0.7rem;
      color: #64748b;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div id="auth-container" class="auth-card">
    <div class="icon">🔒</div>
    <h1>Liamilena • Terminal Seguro</h1>
    <p class="desc">Sistema Stateless de Triagem de Leads Imobiliários. Descriptografia direta em memória RAM (AES-256).</p>
    <form id="auth-form">
      <div class="form-group">
        <label for="pass">Chave Mestre de Acesso</label>
        <input type="password" id="pass" placeholder="••••••••••••" autocomplete="current-password" required autofocus>
      </div>
      <button type="submit" class="unlock-btn" id="submit-btn">Descriptografar Painel</button>
      <div id="error-box" class="error-msg"></div>
    </form>
    <span class="badge">AES-256-GCM • Zero Storage • LGPD Compliant</span>
  </div>

  <div id="app-root" style="display: none; width: 100%;"></div>

  <script>
    const ENCRYPTED_PAYLOAD = \`${safeBundle}\`;

    function base64ToUint8(base64) {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    }

    async function deriveKey(password, saltUint8) {
      const enc = new TextEncoder();
      const passwordKey = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      return window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: saltUint8,
          iterations: 100000,
          hash: 'SHA-256',
        },
        passwordKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );
    }

    async function decryptInRam(bundleString, password) {
      const bundle = JSON.parse(bundleString);
      const salt = base64ToUint8(bundle.s);
      const iv = base64ToUint8(bundle.iv);
      const ciphertext = base64ToUint8(bundle.ct);

      const key = await deriveKey(password, salt);
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );

      const dec = new TextDecoder();
      return dec.decode(decryptedBuffer);
    }

    document.getElementById('auth-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const passInput = document.getElementById('pass');
      const submitBtn = document.getElementById('submit-btn');
      const errorBox = document.getElementById('error-box');
      const password = passInput.value;

      submitBtn.disabled = true;
      submitBtn.innerText = 'Descriptografando na RAM...';
      errorBox.style.display = 'none';

      try {
        const decryptedHtml = await decryptInRam(ENCRYPTED_PAYLOAD, password);
        
        // Destrói a senha do input imediatamente
        passInput.value = '';

        // Oculta tela de login e monta dashboard em memória RAM
        document.getElementById('auth-container').style.display = 'none';
        const root = document.getElementById('app-root');
        root.style.display = 'block';
        root.innerHTML = decryptedHtml;

        // Executa scripts presentes no HTML descriptografado
        const scripts = root.querySelectorAll('script');
        scripts.forEach((s) => {
          const runScript = document.createElement('script');
          if (s.type) runScript.type = s.type;
          runScript.textContent = s.textContent;
          document.body.appendChild(runScript);
        });

      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Descriptografar Painel';
        errorBox.innerText = 'Chave inválida ou acesso não autorizado.';
        errorBox.style.display = 'block';
      }
    });
  </script>
</body>
</html>`;
}

/**
 * Executa o pipeline de build completo.
 * @param {{ templateContent?: string, templatePath?: string, password?: string, outputPath?: string|null }} [options={}]
 * @returns {Promise<string>}
 */
export async function runBuildPipeline(options = {}) {
  let templateContent = options.templateContent;

  if (!templateContent) {
    const templatePath = options.templatePath || path.resolve(__dirname, '../template.html');
    templateContent = fs.readFileSync(templatePath, 'utf-8');
  }

  const password = options.password || process.env.LIAMILENA_DASHBOARD_KEY || 'Liamilena#Imoveis2026';
  const encryptedBundle = await encryptPayload(templateContent, password);
  const shellHtml = generateShellHtml(encryptedBundle);

  if (options.outputPath !== null) {
    const defaultOutput = path.resolve(__dirname, '../../p-9a2f7c4b/index.html');
    const outPath = options.outputPath || defaultOutput;
    const outDir = path.dirname(outPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.writeFileSync(outPath, shellHtml, 'utf-8');
  }

  return shellHtml;
}

// Execução direta via CLI (npm run build)
if (process.argv[1] && process.argv[1].endsWith('encrypt-pipeline.js')) {
  console.log('Iniciando pipeline de compilação segura (AES-256)...');
  runBuildPipeline()
    .then(() => {
      console.log('✅ Sucesso: Casca criptografada gerada em liamilena/p-9a2f7c4b/index.html');
    })
    .catch((err) => {
      console.error('❌ Erro no pipeline de build:', err);
      process.exit(1);
    });
}
