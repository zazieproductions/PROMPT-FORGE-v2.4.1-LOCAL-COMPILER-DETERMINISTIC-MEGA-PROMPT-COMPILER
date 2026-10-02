# Architecture and implementation

This document describes the implementation in the checked-in repository. `index.html` is the application source of truth; the architecture below is intentionally descriptive of the current code, not a promise that every concern already has a dedicated module or test.

## System boundary

Prompt Forge is a **static, client-side application**. It accepts a user-authored brief, applies deterministic parsing and template assembly, renders the result, and optionally stores user-selected presets and examples in the browser. It does not include a backend, authentication, model inference, or application API.

```text
┌────────────────────────────── Browser tab ──────────────────────────────┐
│                                                                         │
│  CDN scripts / fonts ──> HTML + React UI ──> compiler functions          │
│                                 │                  │                    │
│                                 │                  └─> prompt sections  │
│                                 ├─> IndexedDB / localStorage             │
│                                 └─> clipboard / browser download         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                         No project backend or LLM call
```

The boundary matters for both privacy and deployment: the prompt composition logic is local, but the current page imports third-party JavaScript and fonts at runtime. Those scripts execute with the page's browser privileges. See [Deployment and supply-chain notes](DEPLOYMENT.md#runtime-dependencies-and-trust-boundary).

## Repository map

| Path | Responsibility |
|---|---|
| `index.html` | Document shell, theme, CDN dependencies, persistence helpers, both compilers, React components, and application UI. |
| `tools/selftest.mjs` | Dependency-free Node.js regression harness; reads the Ascension Engine between its source markers and evaluates it in a test scope. |
| `README.md` | Project overview and first-run path. |
| `docs/` | User, architecture, API, quality, and deployment documentation. |
| `CONTRIBUTING.md`, `ROADMAP.md`, `CHANGELOG.md` | Collaboration guidance and project planning/history. |

There is no package manifest, bundler configuration, checked-in CI workflow, or separate server entry point.

## Runtime composition

The HTML loads React 18 and ReactDOM UMD builds, Babel Standalone, Tailwind CSS, and Lucide from public CDNs. Google Fonts supplies Inter and JetBrains Mono. JSX in the `text/babel` script is transformed in the browser. The app mounts with `ReactDOM.createRoot(...)` into `#root`.

The source is arranged as a single-file application:

```text
index.html
├── head: CDN references, Tailwind theme config, custom CSS
├── browser persistence helpers
│   ├── initDB / IndexedDB schema
│   ├── dbSavePreset / dbGetPresets / dbDeletePreset
│   └── dbSaveSeed / dbGetSeeds / dbDeleteSeed
├── classical compiler
│   ├── DOMAIN_PACKS / ALL_ROLES / INTENSITY_MODES / BEHAVIOR_RULES
│   └── compileMegaPrompt(state)
├── Ascension Engine (ASCENSION_ENGINE_START … END)
│   ├── lexicons, archetype packs, and intensity profiles
│   ├── parsing, classification, and seed profiling
│   └── compileAscensionPrompt(state)
├── DnaRadarCanvas / IntensityDial
└── PromptForgeApp
    ├── React state and derived compiler result
    ├── task / mode / tab controls
    ├── structured and raw output views
    └── persistence, clipboard, and exports
```

## Compilation and data flow

```text
Brief + controls
      │
      ├── Ascension mode
      │     ├── artifact affinity + keyword scoring → archetype pack
      │     ├── regex / lexicon parsing → entity, audience, descriptor, money
      │     ├── optional seed profile + intensity + section switches
      │     └── ordered template assembly → 0–8 enabled output sections
      │
      └── Classical mode
            ├── domain pack + selected roles
            ├── eight Prompt DNA values + force/ban booleans
            └── optional section switches → ordered prompt sections
                               │
                               ▼
                 { fullText, sections, metrics, metadata }
                               │
              preview → copy / Markdown / JSON / JSONL export
```

`PromptForgeApp` owns the state and calls the active compiler from `useMemo`. Edits to the input or controls update the derived result immediately. The **Forge** action updates UI bookkeeping/time and triggers a recomputation; it does not make a network request.

### Ascension Engine

The Ascension path is a rule-based compiler enclosed by `ASCENSION_ENGINE_START` and `ASCENSION_ENGINE_END` comments. The self-test extracts this exact block, so the tested implementation is the one shipped in the HTML.

1. `detectArchetype` scores artifact affinity and pack keywords; earlier matches receive a small weighting. Unknown or empty input falls back to `universal_genius`.
2. `parseAscensionIntent` selects a pack and parses entity/domain context with regular expressions and lexicons. It is intentionally editable in the UI because heuristic extraction can be wrong.
3. Commercial packs use `extractMoney` and `buildMoney` to produce illustrative stakes. Non-commercial packs return `money: null`.
4. `deriveSeedProfile` summarizes a corpus of examples. It profiles counts and a few formatting signals; it does not compare semantic meaning or learn a language model.
5. `compileAscensionPrompt` combines pack content, intensity, overrides, optional seed profile, and eight module switches into ordered sections, then joins section content into `fullText`.

The 15 pack IDs are `funnel_god`, `copy_architect`, `brand_visual`, `code_forge`, `ai_agent`, `product_architect`, `story_master`, `content_machine`, `research_oracle`, `data_oracle`, `audio_alchemist`, `video_director`, `growth_operator`, `education_architect`, and `universal_genius`.

### Classical Compiler

`compileMegaPrompt(state)` assembles a separate engineering-oriented prompt from:

- nine domain packs (`creative_tech`, `web_architect`, `dsp_audio`, `repo_overhaul`, `arg_architect`, `saas_product`, `marketing_funnel`, `research_mode`, and `general_genius`);
- a selectable role stack;
- five intensity modes;
- eight numeric Prompt DNA dimensions;
- six force rules, five ban rules, and six optional output sections.

The Classical Compiler has its own domain data and output contract; it is not a wrapper around Ascension. The current self-test does **not** exercise this path, so changes to it should receive manual browser validation until dedicated regression coverage is added.

## UI component map

| Component / region | Responsibility |
|---|---|
| `PromptForgeApp` | Main application boundary; owns task, compiler mode, settings, seeds, presets, output view, and action handlers. |
| `IntensityDial` | Reusable five-choice intensity selector. The selected profile has different prompt effects in the two engines. |
| `DnaRadarCanvas` | Draws the eight Classical Prompt DNA values on a canvas. It is a visualization, not the source of the slider values. |
| Left control panel | Engine switch, task input, mode-specific tabs, archetype/domain and output controls. |
| Right compiler studio | Live output, structured/raw views, character and estimated-token metrics, copy action. |
| Preset drawer / save modal | Loads and deletes stored presets; opens JSON export; accepts a preset label. |
| Seed Corpus tab | Adds/captures/removes examples, shows measured structure, and downloads JSONL. |

## State and persistence

React state is in-memory for the active session. The application does not automatically persist every edit. Explicitly saved presets and seed examples are stored locally:

| Storage | Database / key | Shape and purpose |
|---|---|---|
| IndexedDB | `PromptForgeDB`, version `2`, object store `forged_presets` (`id` key) | Named configuration snapshots containing `id`, `name`, `date`, `engineMode`, and `state`. |
| IndexedDB | `PromptForgeDB`, version `2`, object store `style_seeds` (`id` key) | Seed records containing `id`, `label`, `input`, `output`, and `date`. |
| localStorage fallback | `forged_presets` and `style_seeds` | JSON arrays used when IndexedDB operations fail. |
| React state only | Recent clipboard forges | Short session-only history; it is not persisted across reloads. |

Storage is origin-scoped, unencrypted, and subject to browser quotas and user clearing. There is no cross-device sync or in-app full-data restore workflow. Presets and seed records should be treated as user data, not durable backups.

## Determinism and output contract

For identical compiler inputs and configuration, the compiler functions compose the same strings. The Ascension harness explicitly verifies byte-identical output. The UI itself contains nondeterministic or time-dependent actions—DNA mutation, preset IDs, timestamps, and download names—but these values are not inputs to the compiled prompt except where a user changes a setting.

Both compiler paths return an object with `fullText`, ordered `sections`, `charCount`, and `tokenEstimate`; the Ascension path also returns intent, pack, intensity, money, and seed-profile metadata. The token estimate is `Math.round(fullText.length / 3.8)`. It is a convenience metric, not a tokenizer result. For signatures and details, see [Compiler API reference](API.md).

## Design and engineering rationale

| Decision | Why it fits the current project | Cost / trade-off |
|---|---|---|
| Browser-only composition | Keeps the compiler inspectable and avoids maintaining a backend or model service. | Depends on browser capabilities and runtime CDN assets; no central sync or server-side policy enforcement. |
| Deterministic templates | Makes output reproducible, diffable, and suitable for regression checks. | Output quality is bounded by authored pack data and simple parsing rules. |
| Separate engines | Preserves a modular engineering brief workflow alongside a more directive archetype workflow. | Duplicated intensity concepts and a larger single-file surface require careful documentation. |
| Editable extracted context | Lets users correct parser mistakes without hiding the heuristic decision. | Users must review entities, audience, and descriptors before relying on output. |
| Structural seed profiles | Provides a small, transparent way to mirror formatting conventions without claiming model training. | Profiles capture only a few measurable signals and can be skewed by poor examples. |
| Single-file, no-build delivery | Makes the prototype easy to clone and serve as static files. | Harder to isolate, lint, test, version, and secure than a modular, bundled application. |

## Extension and maintenance points

- Add or revise an Ascension pack in `ASCENSION_ARCHETYPES`; keep all fields enforced by the self-test and include `keywords`, which detection uses even though the current required-field list does not assert it.
- Update `ARTIFACT_PACK_AFFINITY` or pack keywords when detection intent changes. Add regression cases for both positive and fallback examples.
- Change the compiler's returned fields or JSON/JSONL structure only with matching API documentation and compatibility notes.
- If IndexedDB stores change, bump `DB_VERSION` and implement an upgrade path that preserves existing user data.
- If the engine is moved out of `index.html`, update the marker-based self-test or replace it with direct module imports before removing the markers.
- Pin or self-host runtime dependencies before treating this as a production or high-sensitivity application; see [Deployment](DEPLOYMENT.md).
