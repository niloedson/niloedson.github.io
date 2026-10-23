---
name: liamilena-lgpd-audit
description: Audita estaticamente o código JavaScript, HTML e CSS do sistema de triagem da Liamilena para garantir conformidade estrita com a LGPD e o princípio Stateless, impedindo vazamentos ou persistência de dados.
---

# Liamilena LGPD Audit (Auditoria Estática e Compliance)

Esta skill atua como uma barreira de conformidade técnica para garantir que o sistema opere sob a premissa de **Destruição Imediata de Estado (Stateless)**, respeitando integralmente a LGPD (Lei Geral de Proteção de Dados - Lei 13.709/2018).

## 1. Princípio Arquitetural e SCAMPER (Modificar/Maximizar)
- **Ação SCAMPER:** *Modificar/Maximizar* o escopo de análise de segurança para atuar como um auditor contínuo e impeditivo pré-commit.
- **Zero Retenção:** Nenhum dado de clientes/leads (CPF, nome, processos, telefones) pode ser gravado em armazenamento local, cookies ou logs remotos.
- **Efemeridade de Memória:** Toda e qualquer consulta deve residir exclusivamente no escopo de variáveis voláteis do JavaScript e ser purgada ao fechar/recarregar a página.

## 2. Regras e Padrões Auditados

A skill deve inspecionar todo o código em `liamilena/src/` e `liamilena/p-*/` procurando violações:

### Violações Críticas (Impeditivas)
1. **Persistência no Navegador:**
   - Uso de `localStorage`, `sessionStorage`, `document.cookie` ou `indexedDB`.
   - Armazenamento em Cache API (`caches.open`, `serviceWorker`).
2. **Vazamento em Logs de Console:**
   - Chamadas a `console.log`, `console.info`, `console.warn`, `console.error` interpolando CPF, telefone ou nome limpo.
3. **Ausência de Rotina de Purga de RAM:**
   - O arquivo principal deve registrar listeners ativos para eventos de ciclo de vida (`beforeunload`, `pagehide`), com rotina explícita de sobrescrita e expurgo de dados (`nullify/wipe`).
4. **Telemetria / Trackers Não Autorizados:**
   - Proibição absoluta de Google Analytics, Facebook Pixel, scripts de heatmap ou qualquer biblioteca externa de terceiros que colete dados do DOM.

## 3. Procedimento Operacional da Skill

Ao ser acionada:
1. Executar varredura estática de busca por padrões proibidos em todo o diretório `liamilena/src/`.
2. Verificar a existência e cobertura dos testes em `liamilena/tests/lgpd-compliance.test.js`.
3. Emitir relatório no formato:
   - **Status Geral:** `APROVADO (Stateless)` ou `REPROVADO (Violações Detectadas)`
   - **Itens Analisados:** Persistência Local, Logs em Produção, Ciclo de Vida/RAM, Terceiros/CORS.
   - **Ações Requeridas:** Caso haja violações, listar arquivo, linha e código de substituição.
