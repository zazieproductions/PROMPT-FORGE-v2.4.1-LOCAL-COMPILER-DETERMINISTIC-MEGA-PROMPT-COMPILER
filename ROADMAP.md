# Roadmap

This is a set of candidate improvements based on the current repository—not a delivery schedule or a promise of support. Priorities reflect risk reduction and maintainability, not product commitments.

## Shipped foundation

- Single-file browser application with no project backend or build step.
- Two composition paths: Classical engineering prompts and the Ascension archetype compiler.
- Local saved presets and a style-seed corpus, with Markdown, JSON, and JSONL downloads.
- Dependency-free Node.js regression checks for the Ascension engine and its 15 archetype packs.
- Documentation for users, contributors, architecture, internal API, quality, and deployment.

## Candidate next steps

| Priority | Area | Candidate work | Why it matters |
|---|---|---|---|
| **P1** | Test coverage | Add regression cases for `compileMegaPrompt`; add browser smoke tests for mode switching, storage, clipboard, and exports. | Protects the second compiler and the user-facing behavior that the current Node harness cannot see. |
| **P1** | Data portability | Replace the misleading “Export All Configs” scope with an accurate label or a complete backup; add validated import/restore for presets and seeds. | Reduces data-loss risk and makes local-only workflows more usable. |
| **P1** | Accessibility | Add named tab semantics, keyboard/focus behavior, modal focus management, announcements, chart text alternatives, contrast review, and manual assistive-technology testing. | Makes the interface usable beyond pointer-and-vision interaction and supports a future conformance target. |
| **P1** | Dependency security | Pin or bundle runtime dependencies, assess CDN/SRI options, and define a CSP-compatible delivery strategy. | Reduces supply-chain and availability exposure from runtime script loading. |
| **P2** | Source modularity | Extract compiler data, pure functions, storage adapters, and React UI into testable ES modules while preserving a simple static deployment. | Makes changes easier to review, lint, and test without losing the local-first product shape. |
| **P2** | Compatibility | Define a browser support policy and automate smoke coverage across the supported browser set. | Turns assumptions about IndexedDB, Clipboard API, canvas, and React into validated expectations. |
| **P2** | Persistence resilience | Add schema migrations, transaction-completion handling, storage error feedback, and an explicit data reset/backup path. | Improves durability and user trust as stored user data grows. |
| **P2** | Heuristic quality | Expand parser fixtures, add ambiguity/fallback diagnostics, and make commercial-stakes assumptions more explicit in the UI. | Improves transparency without pretending rule-based extraction is semantic understanding. |
| **P3** | Performance | Establish startup/recompute baselines, set an input-size policy, and optimize only measured bottlenecks. | Keeps the single-page authoring experience responsive as content and dependencies evolve. |
| **P3** | Project governance | Select a license, define versioning/release notes, add contribution/security contact conventions, and decide whether CI is warranted. | Makes the project's reuse and maintenance expectations clear to users and contributors. |

## Decision principles

1. Preserve the **no-model-call** boundary unless the product scope explicitly changes and the resulting data flow is documented.
2. Keep deterministic compiler functions independently testable; isolate timestamps, random exploration, and browser side effects from prompt composition.
3. Prioritize safe data portability and accessibility before visual polish or new engine complexity.
4. Prefer pinned, auditable dependencies and reproducible builds before claiming production hardening.
5. Document observable behavior and known gaps; do not use aspirational roadmap items as claims about the current implementation.
