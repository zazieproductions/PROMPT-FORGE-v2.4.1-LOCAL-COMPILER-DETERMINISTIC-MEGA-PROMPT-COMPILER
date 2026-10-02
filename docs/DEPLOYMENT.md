# Deployment

Prompt Forge is delivered as a static browser application. There is no API server, database service, build command, environment file, or secret configuration to provision.

## Local run

From the repository root:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000/> and stop the server with `Ctrl+C`. Another static HTTP server may be used instead. A stable `localhost` origin is recommended for IndexedDB and Clipboard API behavior; a secure HTTPS origin is required by browsers for some clipboard access. Direct `file://` behavior varies between browsers.

## Static hosting

A static host can serve the repository root as-is:

1. Publish a directory containing `index.html` at its document root.
2. Configure no build command and no server-side functions; there is no build artifact to generate.
3. Serve the HTML as `text/html` over HTTPS.
4. Open the deployed URL and verify that CDN scripts/styles load, storage is available, and the clipboard action is permitted.
5. Run the manual smoke test in [Quality](QUALITY.md#manual-smoke-test) against the deployed URL.

GitHub Pages, Cloudflare Pages, Netlify, or a static object-store website can host the current shape, provided the chosen service is configured to publish the root directory. This repository does not include a deployment workflow or confirm that any particular hosting project is configured.

## Runtime dependencies and trust boundary

The page currently requests runtime assets from public services, including:

- Tailwind CSS CDN;
- React 18 and ReactDOM UMD builds via unpkg;
- Babel Standalone and Lucide via unpkg (the current URLs are not fully version-pinned);
- Inter and JetBrains Mono via Google Fonts.

The app's own compiler does not make model/API calls, but the imported scripts execute with access to the page context and normal network providers may receive request metadata. A CDN outage or blocked domain can prevent the UI from loading. Treat the current dependency model as a prototype convenience, not a hardened supply-chain strategy.

## Production hardening checklist

Before a public production or sensitive-data deployment:

- pin dependency versions and review upgrade diffs;
- consider bundling or self-hosting runtime assets and fonts, with integrity verification where appropriate;
- define a Content Security Policy compatible with the current inline scripts, styles, and Babel runtime—or first replace those patterns with a production build;
- test IndexedDB and fallback behavior on the intended origin and browser matrix;
- use HTTPS, review Clipboard API permissions, and make storage/export behavior clear to users;
- add browser-level regression coverage and accessibility checks;
- choose and add a license, support/security contact, and release/version policy.

A strict CSP is not currently configured. Inline scripts/styles and browser-side Babel may require policy changes or a packaging refactor before a restrictive policy can be applied safely.

## Deployment is separate from prompt execution

A deployed URL hosts only the prompt-authoring interface. It does not provide user accounts, centralized storage, prompt execution, API keys, model routing, or server-side analytics. Users copy or export the resulting text and use it in their chosen downstream tool.
