# niloedson.github.io — Engineering & Content Directives

## 1. Granular Git Commits
* **Mandatory Granular Commits**: All modifications to `niloedson.github.io` must trigger atomic commits using Conventional Commits (`feat`, `fix`, `refactor`, `docs`, `chore`, etc.).
* **Separation of Concerns**: Never bundle content updates, multi-language pages, styling fixes, or documentation into monolithic commits.

## 2. Multi-Language (EN / PT / ES) Architecture
* **Structural Parity**: Main content pages, Obsidian intelligence hubs, and YGN reports must maintain parity across English (`index.html`), Portuguese (`pt/index.html`), and Spanish (`es/index.html`).
* **Header Language Switcher**: Every page must maintain the `.lang-toggle` component with accurate relative cross-links (`EN / PT / ES`).
* **Convenience Redirects**: Subdirectory localizations should provide root `.html` convenience stubs (e.g., `pt.html`, `es.html`) redirecting to their respective `pt/index.html` and `es/index.html`.

## 3. Multilingual Competitive Yu-Gi-Oh! (TCG) Terminology Mandate
When writing, translating, or localizing Yu-Gi-Oh! TCG match commentary, reports, or articles across Portuguese, Spanish, and English:
* **Engine vs Motor**: Never translate "engine" as "motor" in a card game context. Always preserve the universal community term **"engine"** (e.g., *"a engine de 6+ buscas"*, *"la engine de Sacred Beasts"*).
* **Chain Link vs Corrente / Cadena**: Never translate "Chain Link" as "Corrente Link" or "Cadena Eslabón". Always use **"Chain Link"** (e.g., *"Chain Link 5"*, *"resolução de pilha LIFO de Chain Link"*).
* **Unchainable / Spell Speed 4**: For unchainable spells/effects (cards that cannot be responded to, such as *Super Polymerization*): avoid artificial translations like *"cláusula incorrenteável"* or *"cláusula inencadenable"*. Use the widely recognized competitive community terminology **"Velocidade de Magia 4 (Spell Speed 4)"** (PT) / **"Velocidad de Magia 4 (Spell Speed 4)"** (ES).
* **Competitive TCG Slang Retention**: Core competitive terms (e.g., *Hand Trap*, *Board Breaker*, *Floodgate*, *Side Deck*, *Top-Cut*, *Chokepoint*, *LIFO*, *GY*) should remain in their established English TCG forms or idiomatic community variants rather than being awkwardly literalized.
* **Manaus Duelists & Copa Nacional MYP Context**: All tournament matches involving Lucas Beneck (`lbeneck`), Jacson Moura (`jacsonmoura`), and Emanuel Araújo (`Manusuperheavy`) are official fixtures of the **Copa Nacional MYP TCG** (https://copa.mypcards.com/) representing Manaus, AM. They must always be evaluated as the primary duelists from their own winning perspective (2-1 victories), never treated as mere preparatory or sparring matches.
