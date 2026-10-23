---
name: liamilena-osint-dorks
description: Converte relatos de novas fraudes imobiliárias, notícias jurídicas e vetores de engenharia social em operadores avançados de busca booleana (Google Dorking) para Diários Oficiais e consultas públicas.
---

# Liamilena OSINT Dorks (Engenharia de Prompt e Dorking Dinâmico)

Esta skill atua como o sintetizador de inteligência contra fraudes imobiliárias da corretora Liamilena. Ela traduz relatos operacionais de novos golpes em operadores booleanos precisos de busca (Google Dorks) otimizados para motores de busca sem requerer chamadas pagas a bureaus de crédito.

## 1. Princípio Arquitetural e SCAMPER (Adaptar)
- **Ação SCAMPER:** *Adaptar* notícias de crimes patrimoniais e engenharia social imobiliária em filtros executáveis de consulta rápida em fontes abertas (OSINT).
- **Sem Falsos Positivos Excessivos:** Construção de queries booleanas que combinam o nome completo exato (entre aspas), prefixos jurídicos de identificação (CPF ou cidade) e operadores restritivos (`filetype:pdf`, `site:jusbrasil.com.br`, termos judiciais).

## 2. Tipologia de Vetores de Fraude no Setor Imobiliário

A skill cataloga e atualiza os padrões de busca para os seguintes cenários:
1. **Golpe do Falso Proprietário / Procuração Falsa:**
   - Termos-chave: `"procuração falsa"`, `"falso proprietário"`, `"escritura pública fraudulenta"`, `"usurpação"`.
2. **Estelionato e Apropriação Indébita (Locação e Venda):**
   - Termos-chave: `"estelionato"`, `"art. 171"`, `"apropriação indébita"`, `"dupla venda"`.
3. **Falso Corretor (Exercício Ilegal da Profissão):**
   - Termos-chave: `"exercício ilegal da profissão"`, `"sem registro no CRECI"`, `"falso corretor"`.
4. **Golpe do Sinal / Depósito Antecipado:**
   - Termos-chave: `"golpe do sinal"`, `"transferência antecipada"`, `"imóvel de leilão falso"`.

## 3. Gerador de Expressões Booleanas (Dork Syntax)

Ao receber um nome ou CPF, a skill estrutura links clicáveis para abertura de abas instantâneas no navegador:

- **Busca Geral de Antecedentes e Notícias:**
  ```text
  "NOME DO LEAD" AND ("estelionato" OR "fraude" OR "processo" OR "golpe")
  ```

- **Busca em Diários Oficiais e PDFs Públicos:**
  ```text
  "NOME DO LEAD" filetype:pdf AND ("Réu" OR "Indiciado" OR "Executado" OR "Sentença")
  ```

- **Busca em Tribunais e Jusbrasil:**
  ```text
  "NOME DO LEAD" site:jusbrasil.com.br OR site:escavador.com
  ```

## 4. Procedimento Operacional da Skill

Ao ser acionada com uma notícia, relato ou termo de fraude:
1. Extrair os descritores jurídicos e palavras de maior correlação criminal/cível.
2. Formular o template de dorking parametrizado.
3. Atualizar o módulo `liamilena/src/modules/osint-dorking.js` garantindo que os novos termos fiquem disponíveis na dashboard interna.
4. Executar os testes unitários em `liamilena/tests/osint-dorking.test.js` para garantir formatação e encoding corretos da URL gerada.
