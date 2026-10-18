# Nilo Edson

**Telecom Systems Engineer & Independent R&D Lead**  
Senior Technical Assistant at [Instituto de Pesquisas Eldorado](https://www.eldorado.org.br/) &middot; Founder at **Haunted Labs**  
Manaus, AM, Brazil &middot; [LinkedIn](https://www.linkedin.com/in/nedson/) &middot; [GitHub](https://github.com/niloedson) &middot; [Live Portfolio](https://niloedson.github.io/) &middot; [niloedson.ms@gmail.com](mailto:niloedson.ms@gmail.com)

---

## ⚡ About Me

Telecom Systems Engineer specializing in **Baseband processor stack integration (Qualcomm & MediaTek)**, **Android Core OS upgrades**, **RIL/IMS low-level debugging**, and **3GPP compliance (5G NR / 4G LTE)**. Extensive background in bare-metal and RTOS firmware engineering for ARM Cortex-M microcontrollers, hardware abstraction layers, and discrete-event protocol simulation.

Founder and Principal Architect at **Haunted Labs**, an independent software laboratory engineering formal algebraic game grammars, high-performance deterministic simulation engines, and Model Context Protocol (MCP) agent tooling.

---

## 🏛️ Haunted Labs Initiatives

**Haunted Labs** is an independent engineering laboratory focused on formal language design, deterministic combinatorial simulation, and agentic AI tooling.

### 1. [YGN Standard (Yu-Gi-Oh! Game Notation)](https://github.com/niloedson/ygn-standard) &middot; `RFC 0001`
* **What it is:** The open, human-readable, deterministic algebraic standard for competitive match logs, game state snapshots (YBN), and AI arbitration—modeled after **Chess PGN and FEN**.
* **Key Innovation:** Replaces 25 years of bloated browser DOM clickstreams (91% UI noise) with compact algebraic syntax and `#1..#40` alias registries, delivering an **88% to 94% compression ratio**.
* **Tooling:** Reference TypeScript parser (npm), Python bindings, and Lua emitter for game engines.
* **Deep Dive:** [Read the full specification](https://niloedson.github.io/projects/ygn-standard.html)

### 2. [ygo-sim-core](https://github.com/niloedson/ygo-sim-core) &middot; `SPEC-SIM-2026-001`
* **What it is:** Autonomous, high-performance deterministic simulation engine (**"Stockfish for Yu-Gi-Oh!"**).
* **Key Innovation:** 14-zone immutable memory model, Konami Fast Effect Timing state machine (Boxes A–E), SEGOC 4-tier chain blocking, xxHash64 zero-collision transposition table, and multi-layer $V(\text{YBN})$ board valuation.
* **Agentic AI Surface:** Native stdio **Model Context Protocol (MCP)** server providing `simulate_test_hands`, `explore_combo_tree`, `evaluate_handtrap_resilience`, and `score_ybn_state` to LLM agents.
* **Deep Dive:** [Read the architectural blueprint](https://niloedson.github.io/projects/ygo-sim-core.html)

### 3. [ygoprodeck-mcp](https://www.npmjs.com/package/ygoprodeck-mcp) &middot; `v2.0.0`
* **What it is:** Hardened, air-gapped Model Context Protocol (MCP) server delivering zero-hallucination Problem-Solving Card Text (PSCT), 13,000+ card statistics, format banlists, and Genesys point valuations with sub-2ms local execution.
* **Key Innovation:** Zero outbound HTTP requests at runtime via embedded SQLite WAL database; conditional ETag bulk sync; integrated FTS5 full-text search across all card texts. Decoupled from volatile tournament scraping for 99.99% uptime.
* **Agentic AI Surface:** Published on npm (`npx -y ygoprodeck-mcp`), exposing 5 production tools (`search_cards`, `get_card_details`, `check_banlist`, `get_genesys_points`, `get_database_info`) to Cursor, Claude Code, and autonomous LLM agents.
* **Deep Dive:** [Read the full documentation](https://niloedson.github.io/projects/ygoprodeck-mcp.html)

### 4. [ygo-meta-mcp](https://www.npmjs.com/package/ygo-meta-mcp) &middot; `v1.1.0`
* **What it is:** Multi-source competitive metagame intelligence and tournament discovery Model Context Protocol (MCP) server.
* **Key Innovation:** Aggregates live top-cut tournament decks across YGOPRODeck, Yu-Gi-Oh! Meta, and Road of the King into an embedded SQLite WAL database. Computes sample-weighted Bayesian consensus tier rankings, empirical tech adoption (Main & Side), and immutable tournament decklists with sub-2ms local analytical execution.
* **Agentic AI Surface:** Published on npm (`npx -y ygo-meta-mcp`), exposing 5 analytical tools (`get_meta_tier_list`, `list_tournaments`, `get_meta_decklists`, `get_tech_adoption_trends`, `evaluate_matchup_counters`) to Cursor, Claude Code, and autonomous LLM agents.
* **Deep Dive:** [Read the full documentation](https://niloedson.github.io/projects/ygo-meta-mcp.html)

---

## 💼 Experience

### Senior Technical Assistant &middot; [Instituto de Pesquisas Eldorado](https://www.eldorado.org.br/)
*June 2022 – Present | Manaus, AM*
* **Baseband Stack Integration:** Integrated proprietary chipsets and modem firmware (Qualcomm/MediaTek) during Android Core OS upgrades, bridging vendor codebases with Motorola’s custom system architecture.
* **Low-Level Protocol Debugging:** Investigated and resolved timing and synchronization anomalies between application and baseband processors (RIL, IMS, 5G/4G) utilizing C and Java.
* **GCF/PTCRB Certification:** Led modem software compliance and verification, securing strict 3GPP Specification alignment for global products launch programs.
* **Modem Stability & Ramdump Analysis:** Investigated modem silent panics by analyzing post-mortem ramdumps, differentiating consumer and developer crash signatures to isolate, root-cause, and implement critical stability fixes.

### Embedded Software Developer (Bare-Metal and Systems) &middot; [Grupo ICTS](http://grupoicts.com.br/)
*Oct. 2021 – May 2022 | Manaus, AM*
* **Bare-Metal ARM Firmware:** Developed high-efficiency bare-metal firmware for STM32 (ARM Cortex-M) microcontrollers, utilizing CMSIS tools and low-level drivers to optimize memory and execution overhead.
* **Register-Level Integration:** Programmed physical communication protocols (I²C, UART, SPI) via direct peripheral manipulation, implementing low-level hardware state machines.
* **Hardware Abstraction:** Authored modular custom C libraries, providing clean, portable HAL components for STM32 targets.
* **Connectivity Drivers:** Built LoRaWAN communication interfaces for ESP32 systems utilizing PlatformIO and AT-command parsing for low-power wireless telemetry.

### Research Fellow (Embedded Systems) &middot; [Federal University of Amazonas (UFAM)](https://www.ufam.edu.br/)
*May 2020 – Sep. 2021 | Manaus, AM*
* **ARM R&D Collaboration:** Co-developed high-performance ARM-based IoT systems in a joint R&D partnership between CETELI/UFAM, Grupo ICTS, and TPV, bridging hardware prototyping with custom low-level firmware.
* **RTOS Firmware Engineering:** Engineered real-time, multi-threaded firmware using FreeRTOS on ARM microcontrollers, managing concurrent safety-critical tasks including battery management systems (BMS) and low-latency audio processing.

### Software Developer &middot; [INDT (formerly Nokia Institute of Technology)](https://www.indt.org.br/)
*Apr. 2012 – May 2015 | Manaus, AM*
* **Performance Optimization:** Profiled code execution limits to optimize telecommunication simulation tool execution.
* **Protocol Stack Modeling:** Engineered discrete-event software simulators modeling protocol stack messaging.
* **Virtual Prototyping:** Simulated custom protocols, validating latency and throughput prior to 5G standardization.
* **Power Modeling:** Benchmarked mobile hardware dynamics to engineer software models for battery drain profiles.

---

## 🛠️ Technical Skills

* **Languages:** ANSI C/C++, Python, Java, C#, Assembly (ARM), Lua, TypeScript / Node.js
* **Embedded & Systems:** ARM Cortex-M, CMSIS, FreeRTOS, Bare-Metal, Device Trees, Android RIL/IMS, Ramdump Analysis
* **Developer Tools & Agentic AI:** Git, GCC, PlatformIO, STM32CubeIDE, Gemini CLI (AI Diagnostics), Model Context Protocol (MCP), LLM Tooling & Agents
* **Protocols & Interfaces:** 3GPP (5G NR / 4G LTE), I²C, UART, SPI, LoRaWAN, HIDL/AIDL, MQTT

---

## 🎓 Education

* **Faculdade Martha Falcão - Wyden:** B.S. in Electrical Engineering (*Expected 2027*)
* **Federal University of Amazonas (UFAM):** B.S. in Electrical Engineering (*Coursework Transferred, 2018–2022*)
* **Fundação Nokia de Ensino:** Technical Degree in Telecommunications (*2009–2011*)

---

## 📄 Publications & Presentations

* **IEEE 2021 ICCE-TW:** *Smart Garden Monitoring and Irrigation System in Multiplatform Application Using IoT* (Sep 2021 &middot; UFAM / Samsung)
* **FEBRACE 10 & VI FECITEC:** *VoIP System for Digital TV using Ginga-NCLua* (2012 &middot; Fundação Nokia)

---

&copy; 2026 Nilo Edson &middot; Haunted Labs.
