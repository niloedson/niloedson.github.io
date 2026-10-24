# Diretrizes do Projeto Liamilena (Portfólio & Triagem de Leads)

Este repositório contém o portfólio e a ferramenta interna de triagem de segurança para a corretora **Liamilena**.

## Skills Especializadas do Projeto

As skills exclusivas deste projeto estão localizadas em `.gemini/skills/` (e em `liamilena/.gemini/skills/`). Qualquer agente ou sessão trabalhando neste projeto deve consultar e aplicar as instruções contidas nelas:

1. **`liamilena-secure-build`** (`.gemini/skills/liamilena-secure-build/SKILL.md`):
   - Regras para execução do pipeline de criptografia AES-256 (`npm run build`).
   - Garante que nenhuma string em texto claro do painel seja exposta em `p-9a2f7c4b/index.html`.

2. **`liamilena-lgpd-audit`** (`.gemini/skills/liamilena-lgpd-audit/SKILL.md`):
   - Auditoria estática impeditiva contra uso de `localStorage`, `sessionStorage`, `document.cookie` e vazamento de dados em logs.
   - Valida a destruição de variáveis sensíveis na memória RAM (`memory-guard.js`).

3. **`liamilena-datajud-mock`** (`.gemini/skills/liamilena-datajud-mock/SKILL.md`):
   - Geradores de cenários de processos judiciais em memória (Clean, Civil Debt, High Risk Fraud) para testes e sandbox.

4. **`liamilena-osint-dorks`** (`.gemini/skills/liamilena-osint-dorks/SKILL.md`):
   - Regras de síntese de Google Dorks para antecedentes criminais, redes sociais (LinkedIn, Instagram), CNPJs/Sócios e diários oficiais.

## Padrões de Engenharia

- **TDD Estrito:** Sempre execute e mantenha a suíte de testes com `npm test` antes de qualquer alteração ou build.
- **Stateless:** A aplicação nunca deve gravar dados de leads no disco, storage do navegador ou banco de dados externo.
