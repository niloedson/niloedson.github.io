# Liamilena - Portfólio & Sistema Stateless de Triagem de Leads

Projeto autônomo e seguro para a corretora **Liamilena**.

---

## 1. Estrutura do Projeto

- **Portfólio Público:** `index.html` (atualmente com a mensagem divertida `"Casada com Nilo Edson <3"`).
- **Rota Oculta de Triagem:** `p-9a2f7c4b/index.html` (casca pública ofuscada com descriptografia AES-256 em memória RAM).
- **Código-Fonte Limpo:** `src/template.html` e `src/modules/` (módulos da triagem e guardiões de memória).
- **Pipeline de Cifragem:** `src/build/encrypt-pipeline.js` (compila e gera a casca criptografada).
- **Suíte TDD:** `tests/` com 33 testes automatizados (Node 24 native test runner).
- **Skills Gemini CLI:** `.gemini/skills/` com as 4 skills prontas para continuar a evolução assistida por IA.

---

## 2. Acesso e Senha da Ferramenta de Triagem

- **URL no GitHub Pages Provisório:**
  `https://niloedson.github.io/liamilena/p-9a2f7c4b/`
- **Senha Padrão de Descriptografia:**
  `Liamilena#Imoveis2026`
  *(Para alterar a senha no build, defina a variável de ambiente `LIAMILENA_DASHBOARD_KEY` e execute `npm run build`).*

---

## 3. Comandos de Desenvolvimento

```bash
# Executar todos os 33 testes TDD
npm test

# Modo de monitoramento de testes (watch)
npm run test:watch

# Compilar e recifrar a dashboard para produção
npm run build
```

---

## 4. Como Migrar para o GitHub Próprio da Liamilena

Quando ela criar a conta própria no GitHub (ex: `liamilena.github.io`):

1. Crie o novo repositório vazio no GitHub dela: `github.com/liamilena/liamilena.github.io`.
2. Copie o conteúdo inteiro da pasta `liamilena/` para a raiz do novo repositório local.
3. Como todos os caminhos foram construídos relativos (`./`), o site e o painel oculto funcionarão imediatamente sem nenhuma alteração de código:
   - Portfólio: `https://liamilena.github.io/`
   - Painel Oculto: `https://liamilena.github.io/p-9a2f7c4b/`
