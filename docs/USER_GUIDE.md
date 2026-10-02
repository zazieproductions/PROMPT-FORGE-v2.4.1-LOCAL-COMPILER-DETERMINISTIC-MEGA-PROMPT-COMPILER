# User guide

Prompt Forge creates prompt text for use elsewhere; it does not send the prompt to a model or generate the requested software/content itself. The UI is split between configuration on the left and a live artifact preview on the right.

## First compile

1. Start the app with the [local setup steps](../README.md#run-locally).
2. Enter a brief in **What should the agent do?** or choose a quick task.
3. Select **Ascension Engine** or **Classical Compiler**.
4. Review the active mode's controls and correct any detected context.
5. Inspect the output in **Structured** or **Raw Text** view.
6. Copy the prompt or download Markdown. Use JSON / JSONL exports when you need configuration metadata or seed examples.

Compiler output updates from the current state; **Forge Mega-Prompt** is a UI action, not an LLM execution command.

## Choose an engine

### Ascension Engine

Use this path when you want a brief mapped to a domain-specific operator archetype and assembled into a directive-style prompt.

1. **Set the task.** The app detects one of 15 archetypes from artifact affinities and keyword signals. Detection is a transparent heuristic; it can choose a plausible but incorrect pack.
2. **Review the archetype.** Use the dropdown or quick badges to pin another pack. Return the dropdown to the current auto-detected choice to resume detection as the task changes.
3. **Correct extracted context.** The mission entity, ideal audience, and descriptor fields accept overrides. Blank overrides leave the parser's value in effect.
4. **Choose intensity.** The five modes range from Professional to Terminal Deity. Higher levels change the opening, stakes language, and default law/protocol counts; they do not make the compiler more intelligent.
5. **Select modules.** Identity, Stakes, Synthesis, Seizure, Protocol, Components, Laws, and Invocation can be included or omitted. If every module is disabled, the resulting text is empty.
6. **Review money language, if present.** Commercial packs derive illustrative values using the [documented heuristic](API.md#commercial-stakes-heuristic). Treat them as prompt copy, not a forecast.

| Mode | Default laws | Default protocol steps | Behavior note |
|---|---:|---:|---|
| Professional | 8 | 5 | Measured opener and lower-agency language. |
| High Agency | 10 | 6 | Ownership-focused framing. |
| Genius Lab | 11 | 6 | Deity-style opener; no deletion stake. |
| Mad Scientist | 12 | 6 | Deity-style opener and terminal stake. |
| Terminal Deity | 12 | 6 | Highest-intensity language and terminal stake. |

When seed mirroring is enabled and seeds exist, the measured seed counts replace the intensity defaults (within the compiler's 4–12 law and 3–6 step limits). The UI's “MIRROR YOUR SEED STYLE” toggle has no effect until at least one seed is stored.

### Classical Compiler

Use this path for modular engineering briefs. Select a domain pack, combine one or more roles, choose an intensity, tune the eight Prompt DNA sliders, and set the force/ban requirements. The six section switches include role/context, mission, domain constraints, DNA, behavior matrix, and reporting contract. The DNA radar visualizes the same slider state; the sliders remain the editable source of truth.

The **Mutate DNA** action intentionally randomizes slider values for exploration. It changes compiler inputs, so the next output can differ. The Classical Compiler is not covered by the current automated regression harness; see [quality status](QUALITY.md#testing).

## Use the Seed Corpus

The Seed Corpus is a structural profiler—not a model-training feature.

1. Open **Seed Corpus** from the Ascension tab or the **Seeds** header action.
2. Enter a label, raw request, and preferred output, then choose **Add Seed**. The output is required; the request may be left blank.
3. Alternatively, choose **Capture Current** to store the currently compiled prompt with the current raw task as its input.
4. Review measured law count, protocol depth, word count, and link usage. Remove examples that would distort the profile.
5. Turn on **Mirror Your Seed Style** in the Ascension controls to apply the derived profile.
6. Use **Export .JSONL** to download the seed records in the project's JSONL format.

The profiler measures law and protocol counts, whether Markdown links appear, and whether the output ends in a question. It does not use embeddings, semantic matching, or machine learning. Counts can fall back to the default values when a seed's headings do not match the parser's patterns.

## Save, restore, and export

- **Save Preset** stores the current controls in browser storage. Choose **Presets** to load or delete a saved preset.
- **Recent clipboard forges** are transient UI history; they are not retained after reloading the page.
- **Export .MD** downloads the current compiled prompt as Markdown.
- **Export All Configs as JSON** currently downloads a snapshot of the current state, compiled output, derived metadata, and seed count. It is not a full backup of all presets or seed text; this label/scope mismatch is documented for transparency.
- **Export .JSONL** downloads seed examples only. The format is not automatically compatible with an LLM provider's fine-tuning API.

Browser storage is per site origin and is not encrypted. Clearing browser data, using private browsing, or switching browsers/devices can make saved records unavailable. The application has no import/restore control today. See [data and privacy notes](QUALITY.md#privacy-and-security).

## Troubleshooting

| Symptom | What to check |
|---|---|
| UI is blank or libraries do not load | Allow access to the configured CDNs and reload. The current HTML does not bundle or vendor the runtime libraries. |
| Presets or seeds do not persist | Serve through a stable `localhost` or HTTPS origin, allow browser storage, and check quota/private-mode restrictions. `file://` behavior varies by browser. |
| Clipboard copy does not work | Use a secure context (HTTPS or `localhost`), grant clipboard permission, and copy manually from Raw Text if necessary. |
| Entity, audience, or archetype is wrong | Edit the override fields or pin another archetype. The parser uses regular expressions and keyword lists. |
| Output is unexpectedly directive or long | Lower intensity, switch to Classical, or disable selected modules. The prompt is assembled from templates, not summarized by an LLM. |
| Seed mirroring looks odd | Remove atypical examples, inspect the measured profile, or turn off the mirror toggle. Only a few structural signals are measured. |
| Token count differs from a model's UI | The displayed value uses a character-to-token ratio of 3.8; it is only an estimate. |
| You need to restore a JSON export | There is no JSON import UI. Treat the file as a reference/backup artifact, not a round-trip configuration package. |

For installation and static hosting, see [Deployment](DEPLOYMENT.md). For compiler input/output details, see [API reference](API.md).
