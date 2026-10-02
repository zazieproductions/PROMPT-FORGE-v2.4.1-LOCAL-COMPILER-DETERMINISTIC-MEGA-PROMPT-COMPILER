# PROMPT FORGE — v2.5 ASCENSION ENGINE

**Local-first, deterministic mega-prompt compiler. Zero external APIs, zero build step, zero model weights.**

Open `index.html` in a browser. That's the whole app.

---

## What changed in v2.5

The original compiler (`compileMegaPrompt`) is still there and untouched in behaviour — it's
now behind the **CLASSICAL COMPILER** tab.

The new **ASCENSION ENGINE** does what you asked for: it takes a one-line, sloppy human
request and returns a full "God Operator" transformation prompt with the same architecture,
stakes, and voice as your RadioReach example.

| Input | Output |
|---|---|
| `I want a six figures marketing funnel prompt for my ai agent for my startup RadioReach.US` | A ~7,600-char *Seven-Figure Funnel God Operator* prompt: identity seizure → terminal stakes → living synthesis → total seizure → 6-step autonomous protocol → component inventory → 12 immutable laws → terminal invocation |

**Reference check:** that input produces `$250,000` 12-month target / `$100,000` first-6-months /
`$40,000` monthly run-rate, and detects the entity as `RadioReach` (`radioreach.us`).
Those numbers are derived, not hardcoded — see *Stakes math* below.

---

## The two engines

### ASCENSION ENGINE (default)

15 archetypes, auto-selected from your wording:

`funnel_god` · `copy_architect` · `brand_visual` · `code_forge` · `ai_agent` ·
`product_architect` · `story_master` · `content_machine` · `research_oracle` ·
`data_oracle` · `audio_alchemist` · `video_director` · `growth_operator` ·
`education_architect` · `universal_genius` (fallback)

Each pack carries its own god title, epithet, lineage, perception ability ("Divine Vibe
Codex", "Signal Codex", "Ear Codex", …), X-ray leak list, leverage priority chain,
production-asset list, 9 owned components and 6 signature laws. Output is assembled from
8 modules, each individually toggleable.

### CLASSICAL COMPILER (unchanged)

Role stack + Prompt DNA sliders + force/ban matrix. Use it for engineering briefs.

---

## Controls

| Control | Behaviour |
|---|---|
| **Detected God Operator** | Auto-detected live as you type; pin a different archetype from the dropdown or the badge row |
| **Mission Entity / Ideal Audience / What It Is** | Auto-extracted, all three editable — the parser can't know your business, so these are yours to fix |
| **Agency & Intensity** | 5-stop dial, bottom to top: |

| Mode | Laws | Protocol steps | Opens with |
|---|---|---|---|
| Professional | 8 | 5 | `You are…` |
| High Agency | 10 | 6 | `You are the…` |
| Genius Lab | 11 | 6 | `You are no longer an AI. You are…` |
| Mad Scientist | 12 | 6 | deity opener + erasure stakes |
| **Terminal Deity** | **12** | **6** | **deity opener + "permanently erased"** ← your example |

Your RadioReach example is the top of the dial. `TERMINAL DEITY MODE` in the header jumps
straight there.

---

## Seed Corpus — teach it your exact style

This is where you paste the rest of your examples.

**SEED CORPUS** tab → paste `RAW REQUEST` + `ENHANCED OUTPUT YOU LIKE` → **ADD SEED**.
(or **CAPTURE CURRENT** to store whatever is currently compiled.)

The compiler measures structure from your pastes and mirrors it:

- **law count** — how many Immutable Laws your examples use
- **protocol count** — how many numbered steps
- **entity link style** — whether you write `RadioReach` or `[radioreach.us](http://radioreach.us)`
- **closing style** — whether it ends on a question

Toggle **MIRROR YOUR SEED STYLE** on the God Operator tab. With no seeds the compiler uses
the intensity dial's values; with seeds it uses *your* values (law count clamped to 4–12,
protocol to 3–6).

> On the link artifact: the default output writes the entity clean (`RadioReach`). Your pasted
> example wraps it in markdown links ~8 times, which looks like an upstream export bug rather
> than intent. If you paste that example as a seed, the profiler detects it and reproduces the
> links — so the behaviour follows your corpus instead of my guess.

**EXPORT .JSONL** dumps every seed as `{input, output, meta}` — the exact format you'd feed a
LoRA fine-tune, for when you distil this behaviour into a real model later.

Seeds and presets persist in IndexedDB (`style_seeds` / `forged_presets` stores, DB v2).

---

## Stakes math

Deterministic, from whatever number you type in:

| Signal | Headline | 12-mo target | First 6 months | Run-rate |
|---|---|---|---|---|
| "six figures" | $1,000,000 | **$250,000** (25%) | **$100,000** (40%) | **$40,000** (16%) |
| "seven figure" | $10,000,000 | $2,500,000 | $1,000,000 | $400,000 |
| "$50k/month" | — | $600,000 (×12) | $240,000 | $96,000 |

`$12,000 a month` → $144,000 · `five figures` → $25,000

Non-commercial archetypes (code, film, research, data…) drop the money frame entirely and use
a craft-specific terminal stake instead — deadlines, verification, and "deleted if it fails".

---

## Tests

```bash
node tools/selftest.mjs            # ~110 assertions, no install, no network, no browser
node tools/selftest.mjs --print    # also print the full RadioReach reference output
```

`tools/selftest.mjs` extracts the engine straight out of `index.html` between the
`ASCENSION_ENGINE_START` / `ASCENSION_ENGINE_END` markers, so it always tests the shipped
file, not a copy. It covers the reference case, money parsing, entity/archetype extraction
(22 cases), the intensity ladder, determinism, seed mirroring, all 15 packs for structural
completeness, and output hygiene (no `undefined`, no unfilled `{placeholders}`).

---

## Architecture

Single file, ~3,500 lines. React 18 + Tailwind + Lucide via CDN, Babel standalone transpiles
the app in-browser, exactly as before.

```
index.html
├─ <script>        IndexedDB: presets + seed corpus (v2)
├─ <style>         cyberpunk theme
└─ <script text/babel>
     ├─ DOMAIN_PACKS / INTENSITY_MODES / BEHAVIOR_RULES   (classical engine data)
     ├─ compileMegaPrompt                                 (classical engine)
     ├─ ASCENSION_ENGINE_START
     │    ├─ ASCENSION_ARCHETYPES   15 packs
     │    ├─ ASCENSION_INTENSITY    5 rungs
     │    ├─ UNIVERSAL_LAWS        10 shared laws
     │    ├─ parseAscensionIntent   money / entity / audience / descriptor
     │    ├─ detectArchetype        15-way keyword + head-noun scoring
     │    ├─ analyzeSeedOutput      structure measurement
     │    └─ compileAscensionPrompt the assembler
     ├─ ASCENSION_ENGINE_END
     ├─ DnaRadarCanvas / IntensityDial
     └─ PromptForgeApp
```

**Deterministic by construction.** No `Math.random()`, no `Date.now()` inside the compiler,
no network. Same input + same settings → byte-identical output. That's asserted by the tests,
and it's what makes the seed profiler meaningful — style drift can't come from the engine.

## Extending it

Add a pack by copying any block in `ASCENSION_ARCHETYPES` and filling the 30 fields
(`tools/selftest.mjs` §7 enforces the list, so a missing field fails loudly instead of
rendering `undefined` mid-prompt). Add a detection signal with a keyword in `keywords` or an
entry in `ARTIFACT_PACK_AFFINITY`. Then re-run `node tools/selftest.mjs`.
