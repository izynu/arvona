# FMHY Feature Matrix for Arvona

Columns: Area | Existing behavior | User benefit | Implementation complexity | Keep, improve, or omit.
Complexity scale: Low (hours to a day), Medium (one to three days), High (multi-day or needs infrastructure). All "existing behavior" cells describe FMHY as observed; see FMHY-AUDIT.md for evidence.

How to read this matrix:
- "Keep" means the behavior is worth reproducing as-is in spirit; the clean-room implementation may still differ technically.
- "Keep and improve" means the idea is right but FMHY's execution has a gap we can fix cheaply.
- "Keep partially" means adopt the subset that survives static-only hosting.
- "Improve" means replace FMHY's approach with a simpler or more honest one.
- "Omit" means the behavior depends on infrastructure or content we will not have.

## Matrix

| Area | Existing behavior | User benefit | Implementation complexity | Keep, improve, or omit |
| --- | --- | --- | --- | --- |
| Information architecture | ~12 wiki categories plus 11 separate tool pages plus "More" pages; flat file-per-category markdown; one h1 per page | Predictable mental model; every category is one URL | Low | Keep (14 categories in one dataset, no separate tool pages) |
| Navigation | Sticky navbar with two dropdowns, persistent collapsible sidebar groups, right-rail "On this page" TOC | Three synchronized ways to jump anywhere; TOC reduces scrolling pain | Medium | Keep (navbar plus sidebar in the SPA; TOC inside category pages) |
| Search | Build-time MiniSearch index with custom metadata; header Ctrl+K modal; separate page documenting external search tools | Instant client-side results with starred items boosted | Medium | Keep and improve (single unified client-side index over prebuilt JSON) |
| Resource discovery | Long single-page catalogs with h3 subsection indexes; numbered mirror links; tooltip notes | Deep browsing; context on demand without leaving the page | Low | Keep (card/list hybrid with anchorable subsections) |
| Category organization | h2 major section, h3 subsection, ul entries; h3 lists act as mini-indexes | Scanability at 300 to 900 entries per page | Low | Keep (two-level grouping inside each of the 14 categories) |
| Filters and sorting | Sidebar "Toggle Starred" switch (show only recommended) and "Toggle Indexes" switch (hide subsection lists) | Removes noise for users who want the shortlist | Low | Keep and improve (filters for starred, license type, platform, free tier; sort options) |
| Recommendations | Star character in markdown, transformed at build time into toggleable starred spans; SafeGuard extension colors sites by safety tier | Users can trust a curated shortlist | Low | Keep (a "verified pick" badge derived from our own validation data) |
| Favorites and bookmarks | No in-site favorites; third-party browser extension (github.com/mian196/fmhy-bookmarks-extension) | Power users keep personal lists | Medium | Improve (built-in #/saved page with localStorage, export/import JSON) |
| Theme customization | Light, Dark, AMOLED modes; accent color swatches; 11 named presets; theme applied pre-paint to avoid flash | Comfort and identity without accounts | Medium | Keep (reduced: dark base, one accent, respect prefers-color-scheme) |
| Contribution mechanisms | GitHub PRs to fmhy/edit, CONTRIBUTING.md, issue templates, Discord-first for large changes, submission rules page | Transparent, git-backed edits with review | Low | Keep (issues and PRs against a public data repo; contribution guide page) |
| Community feedback | Per-page "Share Feedback" widget posting to a Nitro API on Cloudflare Workers; aggregated anonymous quotes at /feedback | Maintainers hear about broken or unsafe entries quickly | High (needs a server) | Omit as server feature; improve as GitHub issue deep links per entry |
| Content updates | Daily PR merges; monthly changelog posts with RSS; generated "Recently Removed" page from git history | Users see freshness and removals | Medium | Keep (changelog page plus data version and last-verified dates baked into JSON) |
| Performance | Static VitePress build, lean JS chunks, PWA caching; but pages are huge (959 entries on /video) | Fast loads; heavy pages still cost render time | Medium | Keep and improve (14 smaller category views from chunked data modules) |
| Mobile experience | VitePress local nav with hamburger and "On this page"; single-column reflow | Usable on phones with no separate app | Low | Keep (responsive Tailwind layout, drawer navigation) |
| Accessibility | Skip link, ordered headings, aria-pressed and role=switch controls, labeled tooltips, focus-visible styles | Basic keyboard and AT support | Low | Keep and improve (audit contrast, add focus management for routes) |
| SEO | cleanUrls, sitemap.xml, per-page meta and OG images, RSS feed, search engine verification metas, PWA manifest | Good indexing and sharing | Medium | Keep partially (hash routing limits per-route SEO; provide one canonical sitemap, strong root meta, structured data on root) |
| Security and trust | Cloudflare-fronted, CSP frame-ancestors, X-Frame-Options DENY, HSTS, rel=noreferrer on outbound links, SafeGuard filterlist for browsing safety | Users browse with fewer risks | Low | Keep (rel="noopener noreferrer", external-link warnings for non-HTTPS, static-only attack surface) |
| Hosting and maintenance | VitePress static site plus a separate Nitro API on Cloudflare Workers; GitHub Pages workflow exists as secondary; pnpm monorepo | Scales cheaply; two deploy targets add complexity | Medium | Improve (single static target, GitHub Pages, zero server) |
| Permalinks and anchors | Every h2 and h3 gets an anchor with a visible permalink button | Users can share a deep link to one subsection | Low | Keep (anchor links generated from group ids in data) |
| Content transparency | Footer exposes deployed commit hash; recently-removed page derived from git history; posts carry dates and authors | Users can audit what changed and when | Low | Keep (data version, commit link, last-verified dates) |
| Empty and error states | 404 page exists; filtered views rely on toggles rather than empty states | Minor: users always see something | Low | Improve (designed empty states for zero filter results and empty saved list) |
| Content licensing clarity | Site code is Apache 2.0; the resource content itself carries no visible license statement on pages | Legal status of the catalog text is ambiguous | Low | Improve (clear data license statement, e.g. CC0 or CC BY, stated on #/about and in the repo) |
| Analytics and privacy | No visible analytics badge or consent banner; feedback API is anonymous with rate limiting | Users get a no-tracking experience | Low | Keep (no analytics in P0; document in #/privacy) |

## Observed facts vs assumptions

Facts (evidence in FMHY-AUDIT.md):
- Site is VitePress 1.6.4 with a heavily customized theme (meta generator tag; package.json in github.com/fmhy/edit).
- Content is plain markdown, one file per category, with a star convention and numbered mirror links.
- Search is build-time MiniSearch with a custom modal component, not Algolia.
- Two sidebar toggles exist: Toggle Starred and Toggle Indexes.
- Feedback backend is a Nitro app on Cloudflare Workers with KV and rate limiting (wrangler.toml, api/routes/feedback.post.ts).
- Site deploys as static files; a GitHub Pages workflow exists (workflow_dispatch, base '/edit'); live traffic is served through Cloudflare (response headers).
- License: site code Apache 2.0 (docs/.vitepress/LICENSE, copyright taskylizard). Content itself has no license file found at repo root.
- Appearance panel offers Light, Dark, AMOLED modes plus 11 named presets plus accent swatches (DOM evidence).
- Contributing page lists an explicit do-not-submit category list and a Discord-first rule for big restructures (page text).
- Header search uses a custom VPLocalSearchBox replacement; default VitePress search index chunks are excluded from the build (config.mts).

Assumptions (reasonable but not proven):
- Personalization (theme, toggles) persists in localStorage only; no accounts.
- The GitHub Pages workflow is a secondary or mirrored deploy target since production headers show Cloudflare.
- Dead links are handled by maintainers removing entries rather than by inline markers.
- The DocSearch-styled button class is cosmetic, reusing VitePress Algolia styles for a custom modal.

## Proposed equivalents for Arvona

Each kept feature, re-implemented clean-room as a static single-page app with hash routes. Complexity references are relative to the matrix table above.

- Information architecture: one categories.ts module defining 14 categories and per-category groups; every category renders from the same ResourceCard component. Replaces FMHY's 12-plus-11 page taxonomy with one taxonomy, one dataset.
- Navigation: fixed top bar with hash-route links, a collapsible category drawer, and an in-page group TOC generated from the data model (not from markdown headers). Equivalent of FMHY's sidebar plus right-rail TOC without VitePress.
- Search: build script emits a compact search-index JSON (name, tags, description, category, group, starred flag); a Web Worker or debounced main-thread MiniSearch-style scorer (or a small hand-written fuzzy scorer to avoid the dependency) powers a Ctrl+K modal. Equivalent of FMHY's build-time MiniSearch index, minus their custom metadata patching.
- Discovery and category organization: each category page (#/category/{slug}) renders groups with anchor links; entries are data objects, not markdown, so rendering stays consistent and malformed entries are impossible (schema-validated).
- Filters and sorting: zustand store holding filters (starred only, license type, platform, text query) applied purely client-side. Generalizes FMHY's two switches (Toggle Starred, Toggle Indexes) into a real filter bar.
- Recommendations: a "verified" boolean plus a short note set by maintainers during data validation; rendered as a badge, never as an emoji. Equivalent of FMHY's star convention with a clearer trust story.
- Favorites: #/saved page reading a zustand-persisted store in localStorage with JSON export and import; no accounts, no server. Replaces FMHY's dependence on a third-party bookmarks extension.
- Theme: pure black base theme, prefers-color-scheme support, single accent color; skip multi-preset systems. Deliberately narrower than FMHY's Light/Dark/AMOLED plus 11 presets plus accent swatches.
- Contributions: a public GitHub data repo; per-entry "Suggest an edit" links that pre-fill an issue; contribution guide at #/about. Equivalent of FMHY's PR workflow without Discord as a required channel.
- Content updates: every entry carries lastVerified date; a generated stats line on #/ shows total entries and verification date; changelog section on #/about. Equivalent of FMHY's monthly posts and recently-removed page at a smaller scale.
- Performance: prebuilt per-category JSON modules imported lazily by route; no markdown pipeline at runtime. Avoids FMHY's 959-entries-on-one-page pattern.
- Accessibility: semantic landmarks, one h1 per view, focus moved to main on route change, visible focus rings, color contrast against pure black checked manually. Matches the patterns FMHY already demonstrates (skip link, role=switch, aria-pressed).
- SEO and trust: static index.html with complete meta and JSON-LD on root; sitemap listing the root; rel="noopener noreferrer" plus clear external-link labeling. Accepted tradeoff: hash routes are individually less crawlable than FMHY's clean URLs.
- Hosting: GitHub Pages with hash routing and relative asset paths; zero backend; any dynamic behavior is client-side only. Replaces FMHY's Cloudflare plus Workers two-target setup.

## Decision summary

Counts across the 23 matrix rows: keep 13, keep and improve 4, keep partially 1, improve 4, omit 1 (the community feedback backend, replaced by issue deep links). The dominant pattern: FMHY's product ideas are almost all worth keeping; its infrastructure choices (clean URLs, markdown pipeline, Workers API, theme presets) are the parts to simplify away for a GitHub Pages target.

The five highest-leverage features for launch, in order: (1) prebuilt per-category data plus search index, because everything else renders from it; (2) category pages with filters and verified-pick badges, the core browsing loop; (3) Ctrl+K search, the fastest discovery path; (4) the saved list, the main personalization win with no server; (5) static pages with clear legal positioning, which de-risk the whole project.
