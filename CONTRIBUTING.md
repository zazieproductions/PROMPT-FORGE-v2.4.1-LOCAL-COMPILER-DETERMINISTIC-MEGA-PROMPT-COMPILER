# Contributing

Thanks for helping improve Prompt Forge. The project is intentionally small and currently ships as a single static HTML application with one dependency-free Node.js test. Contributions should preserve the compiler's inspectability, deterministic behavior, and accurate documentation.

## Before you start

- Read the [architecture](docs/ARCHITECTURE.md), [API reference](docs/API.md), and [quality notes](docs/QUALITY.md) for current implementation constraints.
- Search existing issues and pull requests before opening a duplicate. The repository currently has no checked-in issue templates or contribution automation.
- For substantial changes, open an issue or discussion first so scope and behavior can be agreed before implementation.
- Do not include real customer prompts, private seed corpora, credentials, or other sensitive material in commits, screenshots, or test fixtures.

## Development setup

**Requirements:** a current browser and Node.js. Python 3 is optional for serving the page locally. There is no `npm install` step.

```bash
python3 -m http.server 8000 --bind 127.0.0.1
# Open http://127.0.0.1:8000/ in a browser

# In another shell, from the repository root:
node tools/selftest.mjs
```

Use `node tools/selftest.mjs --print` when inspecting the full reference output. The app's third-party runtime dependencies are CDN-hosted, so browser validation needs network access even though the Node self-test does not.

## Change workflow

1. Make a focused change and keep the existing file organization unless the change explicitly includes a safe modularization plan.
2. If changing prompt composition, add or update regression cases and check both normal and fallback inputs.
3. If changing archetype data, include the fields used by the compiler and detection code. The current self-test requires: `id`, `name`, `badge`, `color`, `commercial`, `defaultAudience`, `defaultDescriptor`, `audienceNoun`, `assetNoun`, `warWindow`, `title`, `epithet`, `fusion`, `pillars`, `lineage`, `perceptionName`, `perceptionDomain`, `perceptionVerb`, `diagnosis`, `priority`, `manifestationName`, `manifestationBody`, `impact`, `componentHeader`, `components`, `productionAssets`, `signatureLaws`, `stakes`, `handoff`, and `closing`. Also include `keywords`: runtime classification reads it even though the current test's required-field array does not assert it.
4. If changing persistence, preserve existing user data: bump `DB_VERSION` and provide an upgrade path when the IndexedDB schema changes.
5. If changing compiler return values or exports, update `docs/API.md`, the user-facing documentation, and the changelog.
6. Run the automated suite and perform the relevant [manual smoke checks](docs/QUALITY.md#manual-smoke-test).

## Validation

```bash
node tools/selftest.mjs
```

Before changing or removing `ASCENSION_ENGINE_START` / `ASCENSION_ENGINE_END`, update the extraction mechanism in `tools/selftest.mjs` in the same change. The test harness is coupled to those markers by design.

For browser-facing work, manually check both engines, the narrow and wide layouts, the affected storage/export action, keyboard interaction, and the browser console. Automated browser, accessibility, and Classical Compiler tests are not currently configured.

## Code and documentation expectations

- Follow the style and naming already used near the changed code; do not reformat the entire inline application as incidental churn.
- Keep parsing deterministic and bounded. Make heuristic fallbacks visible and user-correctable rather than presenting them as certainty.
- Avoid adding network calls, trackers, or new third-party scripts without documenting the data flow and trust boundary.
- Document user-visible behavior, edge cases, persistence effects, and data export changes.
- Do not describe the seed profiler as model training or the token estimate as tokenizer-backed.
- Keep examples synthetic and shareable. Generated prompt artifacts can contain sensitive material and should not be committed by default.
- There is no configured formatter, linter, type checker, CI workflow, or browser test runner. Do not imply one was run when it was not.

## Pull request checklist

- [ ] The change has a clear scope and preserves unrelated user data/configuration.
- [ ] `node tools/selftest.mjs` passes, or any failure is explained with a reproducible reason.
- [ ] Relevant browser flows have been manually checked.
- [ ] Compiler/API, persistence, export, or UI documentation is updated where needed.
- [ ] New examples contain no private prompts, keys, or other sensitive data.
- [ ] The pull request description states trade-offs and known limitations.

## License and data rights

There is currently no `LICENSE` file. Until the project owner selects and adds a license, do not assume that the source code or project materials may be reused, redistributed, or relicensed. Contributors should only submit material they have the right to share. Seed examples may have separate ownership, confidentiality, or training-use constraints; obtain permission before including or exporting them.
