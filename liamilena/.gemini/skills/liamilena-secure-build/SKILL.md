---
name: liamilena-secure-build
description: Executa o pipeline de compilação e cifragem criptográfica (AES-256 via CryptoJS/WebCrypto) da Dashboard interna de triagem de leads da Liamilena, gerando a casca estática ofuscada para o GitHub Pages.
---

# Liamilena Secure Build (Pipeline Criptográfico Seguro)

Esta skill automatiza e audita a compilação e criptografia da ferramenta de triagem de leads da corretora Liamilena. Ela substitui etapas manuais de build por um pipeline determinístico e seguro, garantindo que o código-fonte real da dashboard nunca seja exposto de forma legível no GitHub Pages público.

## 1. Princípio Arquitetural e SCAMPER (Substituir)
- **Ação SCAMPER:** *Substituir* a compilação e criptografia manuais por um pipeline seguro orientado a CLI.
- **Modelo de Confiança Zero:** O repositório público do GitHub Pages hospeda apenas uma casca estática com formulário de autenticação.
- **Criptografia em Build-time:** O código limpo em `liamilena/src/` é empacotado e criptografado com AES-256.
- **Descriptografia em Memória RAM:** O navegador recebe o payload cifrado e apenas monta o DOM em memória após o operador fornecer a chave/senha mestre corporativa.

## 2. Estrutura de Arquivos Envolvidos
- **Origem (Limpo):** `liamilena/src/template.html` e módulos em `liamilena/src/modules/`
- **Script de Pipeline:** `liamilena/src/build/encrypt-pipeline.js`
- **Destino Ofuscado:** `liamilena/p-9a2f7c4b/index.html` (ou hash configurado)
- **Diretivas de Robôs:** `liamilena/robots.txt` (bloqueando rastreamento de `/p-*/`)

## 3. Procedimento Operacional da Skill

Ao ser acionada para compilar ou atualizar o ambiente:
1. **Verificação de Integridade Pré-Build:**
   - Garantir que todos os testes da suíte TDD em `liamilena/tests/` estejam passando (`npm test` no diretório).
   - Acionar a skill `liamilena-lgpd-audit` para certificar que nenhum dado persistente ou log desnecessário foi introduzido.
2. **Execução do Script de Cifragem:**
   - Executar o compilador passando a senha corporativa (via parâmetro seguro ou variável de ambiente `LIAMILENA_DASHBOARD_KEY`).
   - O compilador deve gerar o ciphertext AES-256 com Salt, IV e derivação PBKDF2/SHA-256.
3. **Validação Pós-Build:**
   - Verificar se o arquivo gerado em `liamilena/p-9a2f7c4b/index.html` não contém strings em texto claro da dashboard (ex: termos do DataJud, formulários de CPF, etc.).
   - Testar o ciclo de descriptografia simulada em memória para assegurar que a chave decifra com perfeição.
