# Technical Assessment: FMHY stack and implications for Arvona

Evidence basis: live-site inspection on 2026-10-19 plus file reads in github.com/fmhy/edit (site source, name "@fmhy/website") and github.com/fmhy/FMHY (legacy index repo). VERIFIED items cite a URL or file. ASSUMED items are inference.

## Frontend framework and tooling

VERIFIED:
- VitePress 1.6.4 (meta generator tag in https://fmhy.net/ HTML; "vitepress": "^1.6.4" in https://raw.githubusercontent.com/fmhy/edit/main/package.json).
- Vue 3.5, UnoCSS 66.7.5, reka-ui, floating-vue (tooltips), minisearch 7.2.0, mark.js, nprogress, dompurify, zod 4, feed 6, sharp, vueuse (same package.json).
- Dev tooling: pnpm 10.12.2, Node 22/24 engines, ESLint 10, Prettier 3, lint-staged, simple-git-hooks pre-commit, custom scripts/lint-markdown.js markdown linter (package.json scripts).
- Theme components live in docs/.vitepress/theme/components (AppearancePanel.vue, ToggleStarred.vue, ToggleIndexes.vue, VPLocalSearchBox.vue, Feedback.vue, Tag.vue and others; directory listing verified).
- Package manager workspace: pnpm-workspace.yaml present at repo root (directory listing).

ASSUMED:
- UnoCSS attributify usage inside Vue components explains the utility-class soup observed in the DOM; exact configuration not read.

## Rendering strategy

VERIFIED:
- Static generation: "vitepress build docs/" produces a fully static bundle; the CI workflow uploads docs/.vitepress/dist as a Pages artifact (.github/workflows/deploy-gh-pages.yml).
- Prebuild data generation: "docs:build": "node scripts/generate-removed.js && node scripts/generate-single-page.js && vitepress build docs/" (package.json). generate-removed.js reads git history to build a 30-day removals page; generate-single-page.js concatenates all category markdown into one file.
- Build-time search index: constants.ts builds a MiniSearch index from the markdown with injected custom metadata and writes it as serialized JSON loaded by the client via MiniSearch.loadJS (comments in https://raw.githubusercontent.com/fmhy/edit/main/docs/.vitepress/constants.ts).
- HTML is pre-rendered per page (each URL returns complete HTML with preloaded JS chunks; verified by curl of https://fmhy.net/).

ASSUMED:
- Hydration is standard VitePress/Vue hydration; no SSR server is involved at runtime for the docs site.

## Static hosting compatibility

VERIFIED:
- A GitHub Pages deploy workflow exists: workflow_dispatch trigger, actions/configure-pages, upload-pages-artifact, touch docs/.vitepress/dist/.nojekyll (.github/workflows/deploy-gh-pages.yml).
- Live production serves through Cloudflare: response headers on https://fmhy.net/ show "server: cloudflare", CSP "frame-ancestors 'none'", X-Frame-Options DENY, HSTS preload, strict-origin-when-cross-origin referrer policy.
- VitePress config sets "cleanUrls: true" and "base: '/edit' when GITHUB_ACTIONS else '/'" (config.mts), plus sitemap generation with a hostname, RSS via custom hooks, and a PWA manifest through vite-plugin-pwa.

ASSUMED:
- Because cleanUrls extension-less URLs work on fmhy.net, the Cloudflare host performs trailing-slash/html negotiation that GitHub Pages cannot do natively; the current production host is likely Cloudflare Pages or a Worker static site, with the GH Pages workflow as a manual fallback. The live site's assets load from "/" so its production build used base "/".

## Routing and URL structure

VERIFIED:
- File-based clean URLs: docs/ai.md serves at /ai, docs/other/FAQ at /other/FAQ (sidebar hrefs and sitemap.xml entries).
- Per-heading permalinks are generated for h2/h3 (anchor links observed in DOM).
- The site is a multi-page static build, not an SPA; navigation triggers full page loads with client-side prefetching (VitePress default).

ASSUMED:
- No hash routing anywhere; deep links rely on clean URLs and anchors.

## Search implementation

VERIFIED:
- Local (non-hosted) search: MiniSearch index built at build time, custom VPLocalSearchBox.vue replacement, default VitePress local search index excluded via globIgnores (config.mts and constants.ts).
- Index includes both page content and external URL entries with normalization (normalizeSearchUrl, excluded list, "search-exclude" comment-tag stripping in constants.ts).
- No Algolia dependency in package.json despite DocSearch-styled classes in the DOM.

ASSUMED:
- Starred items are boosted using serialized metadata ("su" hrefs from starred list items per constants.ts comments); exact ranking weights not verified.

## Content indexing and storage

VERIFIED:
- Content is plain markdown: docs/ai.md, docs/reading.md, docs/video.md, docs/other/*, docs/posts/* (repo tree). Entries follow the pattern: emoji or star prefix, bold external link, numbered mirrors, dash, description with slash tags (docs/reading.md source).
- Custom markdown transforms: emojiRender, headersPlugin, toggleStarredPlugin, replaceNoteLink (config.mts imports), plus a notes/ directory referenced by tooltip links (e.g. docs/.vitepress/notes/mobilism-ranks.md linked from reading.md).
- ignoreDeadLinks: true in config.mts: builds do not fail on dead links.

ASSUMED:
- Link health checking is manual/community-driven; the SafeGuard filterlist repo (github.com/fmhy/FMHYFilterlist) exists but no automated link-check CI was found in the repo listing.

## Dependency approach

VERIFIED:
- Runtime deps are lean and mostly for browser UX (minisearch, mark.js, nprogress, floating-vue, vueuse); server-side deps exist only for the separate API (nitropack, wrangler, nitro-cors).
- Icon strategy: many @iconify-json/* collections installed as dev data, icons rendered as inline spans (i-twemoji-star etc. observed in DOM).

ASSUMED:
- Icons are unocss-preset-icon generated at build time, contributing to a small icon runtime.

## CI and CD

VERIFIED:
- .github/workflows contains deploy-api.yml (wrangler deploy of the Nitro API), deploy-gh-pages.yml (manual static deploy), labeler.yml (PR auto-labeling) (directory listing).
- API deploys to Cloudflare Workers with custom domain api.fmhy.net, KV namespace STORAGE, a rate limiter binding, and an AI binding (wrangler.toml).
- API routes: api/routes/feedback.post.ts, api/routes/single-page.ts, api/routes/index.ts (directory listing).

ASSUMED:
- Content PRs are merged by maintainers and site deploys run per merge or on schedule; the static workflow being workflow_dispatch suggests deploys are triggered manually or by another automation not visible publicly.

## Testing and formatting

VERIFIED:
- No test runner (vitest, jest, playwright) appears in package.json. Quality control is ESLint, Prettier, a custom markdown linter (scripts/lint-markdown.js), and git pre-commit hooks (package.json, scripts/pre-commit.sh).
- lint-staged runs prettier plus eslint on js/ts/vue/json and the markdown linter on docs/**/*.md.

## SEO and metadata

VERIFIED:
- Per-page titles ("Books / Comics / Manga • freemediaheckyeah" title template from config.mts), meta description, OG tags, sitemap.xml (200), robots.txt (200) disallowing /assets/ and images, RSS feed at /feed.rss (200), Bing and Google verification metas, theme-color meta, PWA manifest (200), keywords meta (config.mts and live HTML).
- Custom transformHead hook generates OG images (og-base.jpg present; generateMeta/generateImages hooks referenced in config.mts).

ASSUMED:
- OG images are composed per page by the build using sharp; the exact mechanism sits in docs/.vitepress/hooks (not read in full).

## Accessibility

VERIFIED:
- Skip link ("Skip to content" to #VPContent), ordered h1 to h2 to h3 heading structure, role="switch" sidebar toggles, aria-pressed theme buttons, aria-label on every tooltip trigger, alt text on the logo image, :focus-visible outline rules present in CSS.
ASSUMED:
- Full keyboard operability and AT compatibility are likely good but were not tested; contrast not measured.

## Security considerations

VERIFIED:
- CSP frame-ancestors 'none', X-Frame-Options DENY, HSTS preload, nosniff, strict-origin-when-cross-origin (response headers).
- All outbound resource links carry target="_blank" rel="noreferrer" (DOM).
- An iframe-busting inline script redirects if embedded (config.mts head).
- Server-side zod validation on the feedback API (zod dependency; API middleware directory exists).

## Maintenance burden

VERIFIED signals:
- One monorepo holds content and code; contributors edit markdown only; maintainers review PRs.
- Custom code surface is large: ~25 Vue components, multiple VitePress plugins (markdown transformers, hooks), a parallel Nitro API, PWA config, theme presets. This implies meaningful ongoing maintenance beyond content.
- Their own submission rules page acknowledges restructure requests must be discussed first, indicating content size (about 30k links claimed) makes broad edits costly.

## Simplification opportunities for a GitHub Pages target

1. Hash routing instead of clean URLs: routes like #/category/education, #/index, #/saved need no server rewrite rules, no 401.html trickery beyond a simple 404.html redirect, and work identically on GitHub Pages.
2. Prebuilt JSON data modules instead of a markdown pipeline: a Node script converts a typed dataset (TS or JSON) into per-category JSON chunks plus one search-index JSON. No VitePress, no markdown transformers, no custom plugins. The app imports chunks lazily per hash route.
3. Single build output with relative base: set Vite base './' so the SPA works under any project path, mirroring FMHY's base handling but without CI-conditional paths.
4. Search without heavy deps: build the index at generation time (already a proven pattern from FMHY's constants.ts) and score it with a small hand-written fuzzy scorer, or vendor minisearch only if bundle size allows. Either way the index is static JSON, no service needed.
5. No API at all: replace FMHY's Cloudflare feedback API with per-entry GitHub issue deep links; replace server-side rate limiting with nothing (no write endpoints exist).
6. No PWA plugin initially: a simple manifest.json file is enough; service worker caching is a P2 nicety on GitHub Pages.
7. Link validation as a scheduled GitHub Action: run a link checker over the JSON data on a cron, open issues on failures. FMHY chose ignoreDeadLinks: true; we can afford checks because our dataset is far smaller and legally restricted to live, legal resources.
8. Formatting and linting: ESLint plus Prettier plus a tiny data validation script (zod schema over the dataset in CI) replaces their custom markdown linter, because there is no markdown to lint.
9. One deploy target: GitHub Pages via actions/deploy-pages on push to main, matching their verified workflow shape (checkout, pnpm or npm install, build, upload-pages-artifact, touch .nojekyll) minus their API deploy.
10. Theme system reduced to tokens: CSS custom properties on :root (pure black base, one accent, prefers-color-scheme) instead of their Light/Dark/AMOLED plus 11 presets plus accent swatches; achieves comfort with a fraction of the surface area.
