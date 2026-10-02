# PROMPT FORGE

**A browser-native, local-first prompt compiler for creative technology and software engineering briefs.**

Prompt Forge turns a rough task description and a small set of design choices into a structured, editable prompt artifact. It ships two deterministic composition engines, a browser UI, local presets, and a structural style-seed profiler—without a project backend or model inference.

> **Scope:** this application composes prompts; it does not execute them or call an LLM. The compiler runs in the browser. The page does load its UI libraries and fonts from public CDNs, so “local-first” does not mean “zero network at page load.”

## At a glance

| Attribute | Implementation |
|---|---|
| **Application** | Single-page browser app in `index.html` |
| **Engines** | Ascension (15 archetypes) and Classical (9 engineering domains) |
| **Runtime** | React 18, Tailwind CSS, Babel Standalone, Lucide; loaded from CDNs |
| **Build / backend** | No install or build step; no application server or model/API integration |
| **Persistence** | IndexedDB, with localStorage fallback for saved presets and seeds |
| **Regression tests** | Dependency-free Node.js harness: `node tools/selftest.mjs` |

## What it does

- **Ascension Engine** — classifies a task with transparent keyword and artifact-affinity rules, extracts editable context, selects one of 15 domain archetypes, and assembles up to eight prompt modules.
- **Classical Compiler** — combines an engineering domain pack, role stack, five-level intensity profile, eight Prompt DNA controls, force/ban rules, and six optional output sections.
- **Style-seed profiling** — measures structure in examples (law count, protocol depth, Markdown-link usage, and closing-question style). It does not train, fine-tune, or query a model.
- **Review and export** — inspect structured sections or raw text, copy the compiled prompt, download Markdown, export a JSON configuration snapshot, and export stored seeds as JSONL.
- **Local presets** — save and restore configuration in browser storage. Presets are scoped to the current browser and site origin; they do not sync between devices.

### Example

A brief such as `I want a six figures marketing funnel prompt for my ai agent for my startup RadioReach.US` is detected as a funnel task and assembled from the funnel archetype, intensity, extracted entity, and selected modules. In the current commercial-stakes template, “six figures” maps to a `$1,000,000` headline and a derived `$250,000` 12-month target. These are deterministic prompt-writing heuristics—not a forecast, recommendation, or financial model. See [the API and compiler reference](docs/API.md#commercial-stakes-heuristic).

## Run locally

**Requirements:** a current browser with JavaScript enabled; internet access to load the current CDN-hosted UI dependencies; and, for the self-test, a current Node.js release.

```bash
git clone https://github.com/zazieproductions/PROMPT-FORGE-v2.4.1-LOCAL-COMPILER-DETERMINISTIC-MEGA-PROMPT-COMPILER.git
cd PROMPT-FORGE-v2.4.1-LOCAL-COMPILER-DETERMINISTIC-MEGA-PROMPT-COMPILER
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/>. Stop the server with `Ctrl+C`.

There is no dependency-install or compilation command. A static HTTP server is recommended over opening `index.html` with `file://`, particularly for browser storage and clipboard behavior. Any equivalent static server works.

## Verify the compiler

```bash
node tools/selftest.mjs
```

The test harness extracts the Ascension Engine directly from the marked source block in `index.html`. It currently runs 71 assertions across the reference case, parsing, archetype detection, intensity behavior, determinism, seed profiling, archetype-pack completeness, and output hygiene. To print the reference prompt as well:

```bash
node tools/selftest.mjs --print
```

The harness does not currently exercise the Classical Compiler, rendered UI, browser storage, accessibility, or deployed CDN behavior. See [Testing and quality](docs/QUALITY.md#testing).

## How the system is organized

```text
index.html
├── Browser runtime and persistence helpers
├── Classical compiler data + compileMegaPrompt(state)
├── Ascension engine data + parsers + compileAscensionPrompt(state)
├── DnaRadarCanvas and IntensityDial
└── PromptForgeApp (state, controls, previews, storage, exports)

tools/selftest.mjs
└── Extracts and tests the in-page Ascension engine
```

The compiler functions assemble plain text from explicit inputs. They do not call a model, make an application API request, or perform semantic generation. The Ascension compiler is regression-tested for byte-identical output with unchanged inputs; UI actions such as “Mutate DNA” and timestamped filenames are intentionally outside that deterministic contract.

## Documentation

- [User guide](docs/USER_GUIDE.md) — workflows, engine controls, seeds, persistence, exports, and troubleshooting.
- [Architecture](docs/ARCHITECTURE.md) — runtime boundaries, data flow, component map, storage, and design rationale.
- [Compiler API reference](docs/API.md) — internal function inputs, output shapes, IDs, and heuristics.
- [Quality, testing, performance, and accessibility](docs/QUALITY.md) — verified coverage and known gaps.
- [Deployment guide](docs/DEPLOYMENT.md) — local serving and static hosting considerations.
- [Contributing guide](CONTRIBUTING.md) — development setup, change expectations, and pull-request checklist.
- [Roadmap](ROADMAP.md) — candidate improvements, clearly separated from shipped behavior.
- [Changelog](CHANGELOG.md) — documented baseline and repository changes.

## Important constraints

- **Heuristic, not intelligent.** Entity, audience, money, and archetype extraction are rule-based; always review and correct the generated context.
- **No model execution.** The output is a prompt to copy into another tool. The seed profiler measures a few structural conventions only.
- **CDN dependencies.** React, Tailwind, Babel, Lucide, and Google Fonts are requested from third parties at runtime. Their scripts execute in the page context. Do not treat the current deployment as an air-gapped or high-sensitivity environment.
- **Approximate token count.** The UI estimates tokens as `round(characterCount / 3.8)`; it does not use a model-specific tokenizer.
- **Export scope.** Markdown contains the current prompt. JSON contains the current configuration, derived metadata, and compiled output; despite the UI label, it is not a backup of every saved preset or the complete seed corpus. JSONL contains seed examples in a project-specific format, not a provider-ready fine-tuning schema.
- **License and release status.** There is no `LICENSE` file, package manifest, automated release workflow, or formal browser-support matrix in the repository. Do not assume reuse terms; see [Contributing](CONTRIBUTING.md#license-and-data-rights).

## Project status

The UI identifies itself as `v2.5-ASCENSION`, and the JSON configuration export embeds `2.5.0`. These are application strings, not a package version or proof of a published release. The checked-in implementation is a useful, working prototype with a strong deterministic core; broader browser, accessibility, and Classical Compiler coverage remain opportunities for follow-up work.
