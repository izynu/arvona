# Product Roadmap: Arvona

Derives from FMHY-AUDIT.md, FEATURE-MATRIX.md, SITEMAP.md, and TECHNICAL-ASSESSMENT.md. Constraints from the project worklog: single user-visible route (src/app/page.tsx) with hash routing, pure black base theme, restrained animations, original copy only, only legally accessible resources, GitHub Pages target, Next.js 16 preview on port 3000. Preview date reference: 2026-10-19.

## Guiding principles

1. Learn from FMHY's mechanics (build-time indexing, starred filtering, per-page hierarchy) and drop its costs (huge single pages, parallel tool tree, server API, elaborate theme system).
2. Every resource must be legal to link and verify. When in doubt, exclude.
3. Static only. Anything that needs a server is redesigned as client-side plus GitHub.
4. Every claim on the site is either data (last-verified dates) or copy we wrote ourselves.

## P0: Launch (must ship)

1. Data model and dataset skeleton (maps to matrix rows: information architecture, category organization)
   - Define the Resource type: id, name, url, domain, category (one of the 14 slugs), group, description (original text), tags, license label (open-source, freemium, free-tier, public-domain, other), platforms, verifiedPick (boolean), lastVerified (date), active.
   - Create 14 category definitions with slugs: ai-dev-tools, privacy-security, open-source, education, books-literature, music-audio, movies-video, gaming, creative-design, writing-productivity, web-internet, platform-tools, science-reference, misc.
   - Seed 8 to 15 well-verified entries per category as the launch floor (roughly 150 to 200 total), each checked manually on the real date.
   - Zod schema validation script over the dataset, wired into CI so bad data fails the build.
2. Prebuilt data pipeline (maps to: search, content updates, performance)
   - Node script converts the typed dataset into per-category JSON modules plus one search-index JSON (name, tags, description, category, group, verifiedPick).
   - Chunks imported lazily per hash route to keep first paint light (FMHY's /video carries 959 entries on one page; we avoid that failure mode).
3. SPA shell and routing (maps to: navigation, mobile experience)
   - Hash router in src/app/page.tsx supporting #/, #/category/{slug}, #/index, #/saved, #/about, #/privacy, #/terms.
   - Fixed top bar: logo, search trigger (Ctrl+K), nav links (Index, Saved, About), category dropdown or drawer.
   - Responsive: single column under 768px, drawer navigation, no horizontal overflow.
4. Home page #/ (maps to: discovery, SEO)
   - Hero with original one-sentence positioning, resource count, last-verified date.
   - 14 category cards with counts. Static "how we curate" strip. Footer with data license and repo link.
5. Category pages #/category/{slug} (maps to: discovery, filters, recommendations)
   - Group headings with anchor links; resource rows with name, domain, original description, license label, verified-pick badge, last-verified date, save button, suggest-edit link.
   - Filters: text filter, verified only, license type, platform; sort: name or category order. All client-side via zustand.
   - One h1 per page, h2 groups, semantic lists.
6. Client-side search (maps to: search)
   - Ctrl+K modal over the prebuilt index, debounced scoring, keyboard navigation (arrows, enter, escape), results grouped by category.
7. Saved page #/saved (maps to: favorites)
   - zustand persist in localStorage, add/remove everywhere, export and import JSON, clear-all with confirm.
8. Static content pages
   - #/about (methodology, contribution guide, changelog section, repository link), #/privacy (no accounts, localStorage disclosure, external link disclaimer), #/terms (informational purpose, no warranty, data license, external-link responsibility). All original copy.
9. Theme and visual system (maps to: theme customization)
   - Pure black (#000000) base, one accent color, CSS custom properties, prefers-color-scheme respect, no gradients or pills, restrained motion.
10. Accessibility baseline (maps to: accessibility)
    - Skip link, focus-visible styles, aria labels on icon-only controls, focus moved to main content on route change, contrast checked against black.
11. Static hosting and CI (maps to: hosting)
    - next.config with static export and base './' during build for GitHub Pages, 404.html redirect to #/, robots.txt, manifest.json, sitemap.xml listing root, GitHub Action: install, validate data, build, deploy Pages on push to main.
12. Security hygiene
    - rel="noopener noreferrer" on external links, no inline third-party scripts, no analytics in P0.

## P1: Next quarter (high value, after launch)

1. Search upgrades (maps to: search): result snippets with match highlighting, recent searches in localStorage, tag browsing from search results.
2. Index page depth (maps to: discovery): A to Z virtualized table of all resources, per-category counts, keyboard-friendly row navigation.
3. Link health automation (maps to: content updates, trust): scheduled GitHub Action link checker over the JSON data, failures open issues with a label; entries show a "checked" date refreshed by the run.
4. Contribution ergonomics (maps to: contribution): issue templates for "add resource" and "report resource", a JSON snippet generator (small client-side form producing copy-paste JSON for PRs), CONTRIBUTING.md in the data repo.
5. Per-category metadata richness (maps to: category organization): optional pricing notes (free tier limits), platform badges, and a "similar resources" line computed from shared tags, all rendered from data.
6. Performance pass: bundle budget check in CI, lazy data chunks audited, Lighthouse run recorded as a baseline.
7. SEO package: JSON-LD WebSite plus SearchAction on root, canonical meta, social card image, route-level titles set via document.title on hash change.

## P2: Later (nice to have, keep cheap)

1. User preference panel: reduced motion toggle, font size stepper (FMHY omits font sizing; a minimal stepper is cheap and useful).
2. Optional verified-pick rationale: one-sentence original explanation of why an entry is starred, curated during data review.
3. Lightweight changelog generation: script that diffs the dataset in git and renders a monthly "added or updated" section into #/about, inspired by FMHY's recently-removed page but simpler.
4. Offline cache: minimal service worker for visited category JSON, opt-in, no background sync.
5. Community suggestions queue readout: a static page listing open "add resource" issues via the GitHub public API at request time (read-only, no server, degrades gracefully when rate limited).
6. Internationalization scaffolding: extract copy strings into a module so a second language can be added without refactoring.

## P0 acceptance criteria

1. Data model and dataset skeleton
   - Zod validation passes for every category file; CI fails on schema violations, duplicate ids, duplicate URLs, and non-HTTPS resource URLs.
   - Each entry has a last-verified date of 2026-10-19 or later.
2. Prebuilt data pipeline
   - Running the build script twice produces byte-identical output (deterministic).
   - Per-category chunk stays under a declared size budget; search index under another budget.
3. SPA shell and routing
   - Every hash route deep-links correctly from a fresh load, including after a hard refresh.
   - Unknown hash shows a designed not-found state with a link home.
4. Home page #/
   - Category cards link to routes; counts are computed from data, never hard-coded.
5. Category pages #/category/{slug}
   - Filters combine (text plus license plus verified only) without state bugs; sort is stable.
   - Anchor links scroll to groups and work from a fresh load with the hash.
6. Client-side search
   - Ten agreed test queries return relevant results, including multi-word and accented terms.
   - Keyboard flow complete: tab into trigger, arrows to move, enter to open, escape to close, focus restored.
7. Saved page #/saved
   - Saving persists across reloads; export produces valid JSON; import rejects invalid files with a friendly message.
8. Static content pages
   - All copy original; #/privacy discloses localStorage use; #/terms states no warranty and external-link responsibility.
9. Theme and visual system
   - No gradients, no pill buttons, no emoji icons; motion respects prefers-reduced-motion.
10. Accessibility baseline
    - Skip link, one h1 per view, focus-visible rings, labeled icon buttons, contrast verified for body text on black.
11. Static hosting and CI
    - Clean-clone build succeeds; site works from a subpath simulation; 404.html redirect works; Pages deploy green.

## P1 acceptance notes

1. Search upgrades: highlight matches without innerHTML injection (use React nodes); cap recent searches to 10.
2. Index page depth: virtualized list keeps scrolling smooth at 5,000 rows; every row keyboard focusable.
3. Link health automation: checker runs weekly; failed links get labeled issues; entries never auto-remove without human review.
4. Contribution ergonomics: issue templates render correctly; JSON snippet generator validates before allowing copy.
5. Metadata richness: pricing notes and platform badges are optional fields, defaulting cleanly when absent.
6. Performance pass: Lighthouse baseline recorded in the repo; budget failure fails CI.
7. SEO package: document.title updates per hash route; JSON-LD validates in the rich results test.

## P2 acceptance notes

1. Preference panel: font-size stepper adjusts root font-size in steps, persisted with the saved-list store.
2. Verified-pick rationale: one original sentence per starred entry, reviewed like copy.
3. Changelog generation: script diffs dataset in git and renders "added or updated" entries into #/about data; no manual editing required.
4. Offline cache: service worker is opt-in, caches only visited category JSON, and never serves stale index.html.
5. Community suggestions readout: fetch of open issues via public GitHub API degrades to a link when rate-limited.
6. Internationalization: all copy in a strings module; no hardcoded JSX text remains.

## Launch checklist

- [ ] Zod validation passes for all 14 category files; CI fails on schema errors, duplicate ids, duplicate URLs, or non-HTTPS resource URLs.
- [ ] Every entry has an original description (no copied text), a license label, a last-verified date of 2026-10-19 or later, and a working URL (spot-checked manually, at minimum 10 percent sample).
- [ ] No piracy-enabling, grey-area, or regionally illegal resources in the dataset; legal review pass completed against the project rule.
- [ ] All hash routes render: #/, all 14 #/category/{slug}, #/index, #/saved, #/about, #/privacy, #/terms.
- [ ] Search returns results for 10 test queries including accents and multi-word terms; keyboard-only flow works (tab, arrows, enter, escape).
- [ ] Saved flow works end to end: add, persist across reload, export, import, clear.
- [ ] Filters and sorts verified on the largest category dataset.
- [ ] Accessibility: skip link present, one h1 per view, focus visible on all interactive elements, labels on icon buttons, contrast verified for text on black, no motion when prefers-reduced-motion is set.
- [ ] Mobile: 390px and 768px spot checks, no horizontal scroll, drawer opens and closes.
- [ ] Lighthouse run recorded: performance, accessibility, best practices targets agreed before launch.
- [ ] Static export builds with relative paths; a clean clone serves correctly from a subpath (simulate GitHub Pages project path).
- [ ] 404.html redirect works when a user lands on a deep path directly.
- [ ] robots.txt, sitemap.xml, manifest.json, favicon, and social card present.
- [ ] Copy review: no em dashes, no emoji, no hype language, all original text.
- [ ] README plus #/about document the curation method and how to contribute.
- [ ] GitHub Pages deployment verified on the live URL after first push.
