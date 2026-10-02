# Quality, testing, performance, and accessibility

This page distinguishes automated checks from unverified expectations. The project currently has a focused compiler regression harness, not a complete browser QA program.

## Testing

### Automated regression suite

```bash
node tools/selftest.mjs
node tools/selftest.mjs --print
```

No package installation or network access is required by the test script. It reads the Ascension Engine from `index.html` using the `ASCENSION_ENGINE_START` / `ASCENSION_ENGINE_END` markers, evaluates the exact source block in Node.js, and currently runs 71 assertions.

Coverage includes:

- the RadioReach reference case and derived stake values;
- representative written-figure and explicit-dollar parsing;
- entity and archetype examples plus empty/gibberish fallbacks;
- intensity-dependent opener, law count, and protocol structure;
- byte-identical Ascension output with identical compiler inputs;
- seed profiling and output mirroring;
- required-field and output-size checks across all 15 archetype packs;
- output hygiene for placeholders and common malformed strings.

`--print` appends the full reference output after running the checks.

### Not covered yet

The test harness does not render React or exercise the browser. It does not currently regression-test `compileMegaPrompt`, IndexedDB/localStorage behavior, clipboard permissions, file downloads, responsive layout, accessibility, CDN loading, or performance. The pack-completeness assertion checks a defined field list but does not currently assert every runtime dependency (for example, the archetype `keywords` array).

### Manual smoke test

Before a user-facing release or meaningful UI change, serve the app over HTTP and verify at least:

1. The page loads with runtime dependencies available and no console errors.
2. Ascension and Classical mode controls switch correctly; edit a task and confirm the output updates.
3. Pin an archetype, edit the three context overrides, and toggle output modules.
4. In Classical mode, change a domain, role, intensity, slider, force/ban rule, and section toggle.
5. Copy text in a secure context and download Markdown and JSON.
6. Save, reload, load, and delete a preset; add, remove, reload, and export a seed.
7. Check the layout at narrow and wide viewport sizes and with keyboard-only interaction.

This is a suggested checklist, not a report that every browser combination has been tested. See [Contribution workflow](../CONTRIBUTING.md#validation).

## Performance

### Current characteristics

- The checked-in `index.html` is approximately 216 KB uncompressed (215,714 bytes at the time this documentation was written). No performance budget or browser benchmark is committed.
- UI dependencies are loaded remotely; CDN latency, availability, and client-side Babel/Tailwind processing affect startup.
- The compilers synchronously parse strings and assemble a small, bounded set of sections. The Ascension reference case produces about 7.6k characters; output size varies with pack and settings.
- React `useMemo` derives compiled output from relevant controls. The DNA canvas redraws when its inputs change.
- `tokenEstimate` is `round(charCount / 3.8)`, not a tokenizer call or performance metric.

These properties make compiler work modest for ordinary briefs, but they are not measured guarantees. No Lighthouse score, memory profile, time-to-interactive target, or maximum input length is currently maintained.

### Performance discipline

Before optimizing, record a repeatable baseline in representative browsers. Measure cold/warm page startup separately from compiler recomputation; CDN behavior and browser Babel transformation can dominate the short string-assembly path. Prefer profiling over speculative memoization. If prompt or seed sizes grow substantially, consider explicit input limits, worker offloading for CPU-heavy analysis, or moving dependencies and compiler code into a reproducible build.

## Accessibility

**No WCAG conformance claim has been made, and no formal accessibility audit is checked in.** The UI uses native buttons, inputs, select elements, and associated labels in several controls, but accessibility treatment is incomplete:

- there are no explicit `aria-*` attributes or a complete semantic tab pattern in the current markup;
- the radar visualization is a canvas without a textual data alternative;
- focus styling is present on some controls but is not systematically documented or audited;
- dark neon color combinations have not been measured for contrast;
- modal/drawer focus management, screen-reader announcements, reduced-motion behavior, and zoom/reflow have not been verified.

### Accessibility validation targets

For future UI work, test keyboard-only navigation and visible focus, a screen reader with named controls and status announcements, 200% zoom/reflow, contrast for text and control states, reduced-motion preferences, and a text equivalent for the DNA chart. Use a combination of automated scans and manual review; a clean automated scan alone is not proof of conformance.

## Privacy and security

- The compiler code does not call a project API or send the prompt to an LLM. Prompt composition and heuristic parsing run in the browser.
- Presets and seed text can be stored in IndexedDB or localStorage on the current origin. Browser storage is not encrypted and can be cleared by the user or evicted by the browser.
- The page loads executable libraries and fonts from third-party CDNs. Those scripts run in the page context; treat them as trusted code and do not use the current unpinned CDN setup for highly sensitive prompts without a security review.
- JSON, Markdown, and JSONL downloads can contain user-authored prompts and examples. Review data before sharing exports.
- No authentication, authorization, backend access control, CSP policy, dependency lockfile, or documented vulnerability disclosure process is present in this repository.

Before a production or sensitive-data deployment, pin or self-host dependencies, review script integrity and CSP needs, make data-retention/export behavior explicit, and publish a license/security contact process appropriate to the project.
