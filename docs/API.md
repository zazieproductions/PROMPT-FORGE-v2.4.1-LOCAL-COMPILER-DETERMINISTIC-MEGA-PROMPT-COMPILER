# Compiler API reference

## Scope

The functions below are **in-page implementation APIs**, not a published JavaScript package contract. They live in the inline Babel script in `index.html`; there is no ESM entry point, package manifest, or semver policy. The Node regression harness obtains the Ascension functions by extracting the marked source block. Treat names and object shapes as internal until the project defines a versioned module boundary.

## Ascension compiler

### `compileAscensionPrompt(state)`

Assembles the Ascension prompt from a task, selected archetype/intensity, optional text overrides, a seed profile, and module switches.

| Field | Type | Behavior |
|---|---|---|
| `rawTask` | `string` | Source brief. Empty/unknown values still compile with default entity and archetype fallbacks. |
| `archetypeKey` | `string \| null` | One of the 15 pack IDs below. When omitted or invalid, detection runs on `rawTask`. |
| `intensityId` | `string` | `professional`, `high_agency`, `genius_lab`, `mad_scientist`, or `terminal_deity`. Invalid/missing values fall back to `high_agency`. |
| `entityOverride` | `string` | Optional entity replacement; an empty string leaves the extracted value in effect. |
| `audienceOverride` | `string` | Optional audience replacement. |
| `descriptorOverride` | `string` | Optional descriptor replacement. |
| `seedProfile` | object | If `samples > 0`, supplies structural style values; otherwise the default profile is used. See [seed functions](#seed-profiling). |
| `enabledSections` | object | Optional flags for `identity`, `stakes`, `synthesis`, `seizure`, `protocol`, `components`, `laws`, and `close`. Omitted flags are enabled; only an explicit `false` disables a section. |

**Return value:**

```text
{
  fullText: string,
  sections: Array<{ id: string, title: string, content: string }>,
  tokenEstimate: number, // round(fullText.length / 3.8), not tokenizer-backed
  charCount: number,
  domain: { id, name, badge, color, description },
  intensity: { id, name, tag, multiplier },
  ascension: true,
  intent: { raw, pack, archetypeId, entity, entityUrl, audience, descriptor, money, artifact },
  money: { figures, headline, target, first, runRate, horizon, midpoint } | null,
  profile: seedProfile
}
```

`sections` contains only enabled sections and preserves compiler order. `fullText` joins their `content` values with three newline characters. Numeric metrics are based on that final text.

### Archetype IDs

`funnel_god`, `copy_architect`, `brand_visual`, `code_forge`, `ai_agent`, `product_architect`, `story_master`, `content_machine`, `research_oracle`, `data_oracle`, `audio_alchemist`, `video_director`, `growth_operator`, `education_architect`, `universal_genius`.

### `detectArchetype(raw)` and `parseAscensionIntent(raw, forcedPackId)`

- `detectArchetype(raw) → string` returns an archetype ID. It scores an earliest matching artifact affinity and keyword matches, with a modest bonus for keywords nearer the start of the brief. Empty or unclassified text falls back to `universal_genius`.
- `parseAscensionIntent(raw, forcedPackId) → object` parses against a forced pack when supplied, otherwise the detected pack. Its fields are `raw`, `pack`, `archetypeId`, `entity`, `entityUrl`, `audience`, `descriptor`, `money`, and `artifact`.
- Parsing is regular-expression and lexicon based. The UI exposes editable overrides because extraction is heuristic, not entity resolution or natural-language understanding.

### Seed profiling

- `analyzeSeedOutput(output) → { lawCount, protocolCount, useEntityLinks, closingQuestion, words }` measures a small number of output-format signals. If it cannot find a numbered law/protocol block, it uses the current fallback count (12 laws, 6 protocol steps).
- `deriveSeedProfile(seeds) → { lawCount, protocolCount, useEntityLinks, closingQuestion, source, samples }` summarizes records containing `output` (or legacy `enhanced`) text. Law and protocol counts use the most frequent measured values; law count is clamped to 4–12 and protocol count to 3–6 during compilation. Link usage is enabled only when a strict majority uses links; a closing question is enabled at half or more.
- The profile mirrors structure only. It does not learn semantics, rank examples, or train a model.

The UI's seed record shape is:

```json
{
  "id": "seed_<timestamp>",
  "label": "Example label",
  "input": "Raw request",
  "output": "Preferred enhanced prompt",
  "date": "Locale-formatted date"
}
```

### Commercial stakes heuristic

Commercial packs parse either a written figure phrase (`six figures`) or the first dollar amount (`$50k`). For a written figure count `n`, the headline is `10^n` and the 12-month target is 25% of that headline. For a matched explicit dollar amount, the current implementation multiplies the amount by 12. The first-six-month value is 40% of the target and the displayed run-rate is 16% of the target. `horizon` is currently fixed at `12 months`.

These transformations are intentionally deterministic copy inputs, **not financial forecasts or advice**. The parser does not reliably interpret currency, fiscal periods, context, or multiple amounts. Review or override any result before use.

## Classical Compiler

### `compileMegaPrompt(state)`

Assembles an engineering-oriented prompt from explicit configuration. The current implementation expects the fields below; unlike the Ascension compiler, it does not provide safe defaults for every missing sub-object.

| Field | Expected shape |
|---|---|
| `rawTask` | `string` |
| `domainKey` | One of the nine domain IDs below; unknown values fall back to `creative_tech`. |
| `selectedRoles` | `string[]` of role IDs. |
| `intensityId` | One of the five intensity IDs; unknown values fall back to `high_agency`. |
| `dna` | Numeric values 0–100 for `implementation`, `creativity`, `systems`, `technical`, `autonomy`, `documentation`, `adversarial`, `experimentalism`. |
| `forceRules` | Boolean map keyed by `f_runnable`, `f_diagrams`, `f_noplaceholders`, `f_failuremodes`, `f_testsuite`, `f_selfcritique`. |
| `banRules` | Boolean map keyed by `b_slop`, `b_summaries`, `b_mockshortcuts`, `b_lazyellipses`, `b_speculative`. |
| `activeSections` | Boolean map keyed by `systemHeader`, `missionDefinition`, `domainConstraints`, `promptDNA`, `behaviorMatrix`, `reportingContract`. |

Domain IDs: `creative_tech`, `web_architect`, `dsp_audio`, `repo_overhaul`, `arg_architect`, `saas_product`, `marketing_funnel`, `research_mode`, `general_genius`.

**Return value:** `{ fullText, sections, tokenEstimate, charCount, domain, intensity }`. Section objects use `{ id, title, content }`; their IDs match `activeSections`. The text is assembled in the section order defined by the compiler. The same character-based token estimate is used as in Ascension.

## UI and export data shapes

### Preset

A saved preset contains `id`, `name`, `date`, `engineMode`, and a `state` object with the compiler controls. Presets are written to IndexedDB, with localStorage fallback. There is no in-app preset importer.

### JSON configuration export

The JSON download serializes the current application state, `engineMode`, a timestamp, a detected-intent summary where applicable, the derived seed profile and seed count, and the current `compiledOutput`. It does **not** contain all saved presets or the full seed corpus, despite the current drawer button's “Export All Configs” label.

### Seed JSONL export

Each newline-delimited object currently has this shape:

```json
{
  "index": 0,
  "input": "Raw request",
  "output": "Preferred output",
  "meta": {
    "label": "Example label",
    "date": "Locale-formatted date",
    "style_profile": {},
    "detected_archetype": "code_forge"
  }
}
```

This is a Prompt Forge interchange convenience format, not a guarantee of compatibility with any model provider or fine-tuning pipeline. Validate consent, licensing, and sensitive content before sharing it.

## Test harness integration

`tools/selftest.mjs` reads `index.html`, slices from `// ASCENSION_ENGINE_START` up to `// ASCENSION_ENGINE_END`, evaluates that source in a Node `Function`, and returns selected internal symbols for testing. It does not expose a supported import surface. If the compiler is modularized, replace this extraction technique with direct imports or update the harness in the same change.
