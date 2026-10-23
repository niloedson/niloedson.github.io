---
name: liamilena-datajud-mock
description: Gera e injeta sandboxes e payloads simulados em memória da API pública do DataJud (CNJ) para testes TDD, validação de interface mobile e simulação de cenários de processos judiciais e falhas.
---

# Liamilena DataJud Mock (Sandbox CNJ e Simulação Governamental)

Esta skill fornece uma infraestrutura em memória para simular o comportamento da API pública do DataJud (Conselho Nacional de Justiça) sem depender de chamadas externas ou arquivos estáticos JSON no repositório.

## 1. Princípio Arquitetural e SCAMPER (Combinar & Eliminar)
- **Ação SCAMPER:** *Combinar & Eliminar* a complexidade de testes, combinando a exportação criptografada com sandboxes dinâmicos em memória, eliminando a dependência de arquivos mock físicos ou exposição de dados reais de processos.
- **Isolamento de Testes:** Permite validar todo o ciclo TDD de forma determinística, rápida e offline.

## 2. Esquema do Payload DataJud (CNJ)

O padrão do DataJud (Elasticsearch API pública do CNJ) segue a estrutura:
```json
{
  "took": 15,
  "timed_out": false,
  "hits": {
    "total": { "value": 1, "relation": "eq" },
    "hits": [
      {
        "_index": "processos-tjsp",
        "_type": "_doc",
        "_id": "10023456720238260100",
        "_source": {
          "numeroProcesso": "1002345-67.2023.8.26.0100",
          "classe": { "codigo": 1116, "nome": "Execução de Título Extrajudicial" },
          "sistema": { "codigo": 1, "nome": "Projudi" },
          "tribunal": "TJSP",
          "dataAjuizamento": "2023-05-12T10:30:00.000Z",
          "assuntos": [
            { "codigo": 9580, "nome": "Inadimplemento" },
            { "codigo": 10432, "nome": "Despejo por Falta de Pagamento" }
          ],
          "movimentos": [
            { "nome": "Distribuição", "dataHora": "2023-05-12T10:30:00.000Z" }
          ]
        }
      }
    ]
  }
}
```

## 3. Catálogo de Cenários de Mock

A skill provê geradores prontos para os seguintes perfis de teste:
1. **`CLEAN_LEAD` (Nada consta):** `hits.total.value = 0`, array vazio.
2. **`CIVIL_DEBT` (Risco moderado / inadimplência cível):** Processos de execução, títulos extrajudiciais, cobrança condominial.
3. **`HIGH_RISK_FRAUD` (Alerta crítico / risco criminal):** Processos com assuntos vinculados a:
   - Art. 171 CP (Estelionato)
   - Fraude contra credores / Fraude à execução
   - Apropriação indébita / Falsidade ideológica
4. **`NETWORK_FAILURES` (Falhas de rede):**
   - HTTP 429 Too Many Requests (Rate limit da API do CNJ).
   - HTTP 504 Gateway Timeout.
   - Bloqueio de CORS do navegador.

## 4. Procedimento Operacional da Skill

Ao ser acionada:
1. Fornecer os geradores de payload para a suíte de testes em `liamilena/tests/datajud-client.test.js`.
2. Habilitar a injeção do modo de demonstração/sandbox na interface (`?sandbox=true` ou toggle de debug local).
3. Validar se a UI reage adequadamente com badges de severidade corretos (verde para limpo, amarelo para cível comum, vermelho com alerta sonoro/visual para risco crítico).
