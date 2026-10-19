# FMHY Audit (fmhy.net)

Research date: 2026-10-19. Method: headless browser (agent-browser) plus raw HTTP inspection with curl. All observations below are from the live site unless marked otherwise.

## 1. What FMHY is

- FMHY is the website of the Reddit community r/FREEMEDIAHECKYEAH. Its own meta description is "The largest collection of free stuff on the internet!" (verified in the homepage HTML head).
- The FAQ page (https://fmhy.net/other/FAQ) states the wiki includes "nearly 30k links" and is "updated daily" (quoted from the page; treat the number as their claim, not an audit).
- Footer says "Estd 2018." (verified on https://fmhy.net/ footer).
- Audience: general users looking for free media, software, tools, and learning resources. Content is heavily piracy-adjacent (streaming, torrenting, shadow libraries). This is documented here only as context; Arvona will not reproduce this content scope, only the directory mechanics.
- Community model: maintained by a small team plus community submissions. Edits arrive through GitHub pull requests (https://github.com/fmhy/edit) and Discord suggestions (stated on https://fmhy.net/other/contributing and the FAQ).
- Ecosystem extras: SearXNG instance (https://searx.fmhy.net/), SafeGuard browser extension (https://github.com/fmhy/FMHY-SafeGuard), bookmarks extension (https://github.com/mian196/fmhy-bookmarks-extension), startpage (https://fmhy.net/startpage).

## 2. Page-by-page inventory

Pages actually loaded and inspected (browser): 11 unique URLs. Raw HTTP checks (curl, status code and headers only): 12 additional URLs. GitHub file views: 13 files plus 7 directory listings.

| URL | Purpose | Notes |
| --- | --- | --- |
| https://fmhy.net/ | Homepage | Hero, 13 category cards, announcement banner, footer with build rev |
| https://fmhy.net/posts/search | "How-to Search FMHY" post | Curated list of ways to query FMHY (Streamlit app, SearXNG goggles, GitHub search, dupe checker, raw markdown backups) |
| https://fmhy.net/reading | Books / Comics / Manga category | ~10 top sections, h3 subsections, hundreds of entries, per-page feedback widget |
| https://fmhy.net/ai | Artificial Intelligence category | 9 sections, 16 subsections, 322 entries, 56 starred spans (counted in DOM) |
| https://fmhy.net/video | Movies / TV / Anime category | 11 sections, 34 subsections, 959 entries on one page (counted in DOM) |
| https://fmhy.net/text-tools | Text Tools page | 5 sections, 496 entries; one of 11 "Tools" pages |
| https://fmhy.net/beginners-guide | Beginners Guide | Q&A style onboarding guide with topic blocks and INFO containers |
| https://fmhy.net/other/FAQ | FAQs | Q&A about safety, contact, editing the wiki |
| https://fmhy.net/other/contributing | Contribution Guide | Submission rules, do-not-submit list, PR workflow, Discord-first policy |
| https://fmhy.net/posts | Changelog / Posts index | Monthly update posts, RSS link |
| https://fmhy.net/feedback | Feedback page | Anonymous comments aggregated from Reddit, Discord, X, and their feedback API |
| (curl) /storage, /unsafe, /other/backups, /startpage, /other/selfhosting, /other/wallpapers, /recently-removed | Auxiliary pages | All return 200; /recently-removed is generated from git history |
| (curl) /sitemap.xml, /robots.txt, /manifest.json, /feed.rss | SEO / PWA artifacts | All present, status 200 |

Navigation destinations verified in the navbar: Beginners Guide (/beginners-guide), Changelog (/posts), Tools dropdown (FMHY Search /posts/search, Startpage /startpage, SearXNG, SafeGuard repo, Bookmarks repo, Selfhosting /other/selfhosting), More dropdown (FAQs /other/FAQ, Contributing /other/contributing, Feedback /feedback, Backups /other/backups, Piracy Glossary external, SFW FMHY external, Badge external, Wallpapers /other/wallpapers, Site Hunting external reddit wiki).

## 3. Content organization

- Three-tier hierarchy on category pages: h1 page title, h2 major section (e.g. "Ebooks"), h3 subsection (e.g. "Public Domain", "PDF Search"), then ul lists of entries. Verified in the rendered DOM on /reading.
- Entry format conventions (verified in rendered HTML and in source markdown at https://github.com/fmhy/edit/blob/main/docs/reading.md):
  - Optional leading emoji icon character (e.g. a globe glyph for mirror-heavy entries).
  - Star character prefix for recommended entries; rendered as a star icon span with class "starred". 92 such spans on /reading, 56 on /ai.
  - Entry name as a bold external link, target="_blank" rel="noreferrer".
  - Numbered mirror links after the name: ", [2], [3]...".
  - " - " separator, then a compact description with slash-separated tags ("Books / Comics / Manga").
  - Inline trailing links for extras: Apps, Subreddit, GitHub, Deploy Locally, Requires Sign-Up, Requires Invite.
  - Hover tooltips (floating-vue) with aria-labels like "Name Note", "Name Warning", "Name Ranks" carrying safety or quality notes. 177 tooltip instances on /reading.
  - TIP / WARNING / INFO callout containers between lists for context.
- Recommendation system: the star character is the single source of truth. A build plugin (toggleStarredPlugin, referenced in https://github.com/fmhy/edit/blob/main/docs/.vitepress/config.mts) wraps starred items so the sidebar "Toggle Starred" switch can filter the page client-side. "Toggle Indexes" switch hides h3 index lists.
- Dead-link handling: no inline dead markers were found in rendered pages (no strikethrough, no dead/offline icons found in the /reading DOM). Dead entries appear to be removed via PRs, and a generated "Recently Removed" page (https://fmhy.net/recently-removed, built by scripts/generate-removed.js from the last 30 days of git history) surfaces removals. The SafeGuard extension flags unsafe sites client-side using the separate FMHYFilterlist repo. VitePress config sets ignoreDeadLinks: true, so builds do not fail on dead links.
- Duplicate-name convention: when two resources have the same name, entries get ", 2" appended (e.g. "Open Slum, 2") observed as a naming pattern; the sidebar and FAQ mention a "Dupe Checker" tool for maintainers.

## 4. Layout and navigation model

- VitePress 1.6.4 custom theme (meta generator tag, verified).
- Header: logo, search button with Ctrl+K hint, two dropdown menus, appearance panel button, three social links (GitHub, Discord, Reddit).
- Sidebar (desktop): collapsible groups (Beginners Guide, Posts, Contribute, Wiki with 12 categories, Tools with 11 pages, More) plus the two toggle switches. Same sidebar on all content pages.
- Right rail: "On this page" TOC listing h2/h3 with permalinks.
- Homepage is special-cased: no sidebar, hero with four CTAs (Beginners Guide, Posts, Contribute, Discord), announcement banner ("October Updates"), 13 category cards each an h2 heading wrapped in a link.
- Footer: "Made with" link to /feedback, revision commit link to github.com/fmhy/edit/commit/66e7415a2adc8c00a07eb783ea2cae2de4825897 (verified), "Estd 2018."

## 5. Search

- Header search button opens a custom local search modal. Evidence: FMHY replaces VitePress's VPLocalSearchBox.vue with its own component (config.mts import of './theme/components/VPLocalSearchBox.vue'); package.json includes minisearch 7.2.0 and mark.js 8.11.1. Search index is built at build time from the markdown with custom metadata, including starred-item hrefs ("su") used presumably to surface recommendations. Index files for default VitePress local search are excluded via globIgnores.
- The Algolia-looking "DocSearch" class on the button is styling only; no Algolia dependency exists in package.json (verified).
- Dedicated discovery page /posts/search documents external search options instead of hosting its own query UI.

## 6. Theme and personalization

- Appearance panel (verified DOM): three display modes (Light, Dark, AMOLED), a row of accent "Color Themes" swatches, and 11 named "Theme Presets" (Swarm, Turquoise, Carnation, Cerise, Meadow, Merlin, Blue violet, Catppuccin, Halloween, Monochrome, Monolith). Buttons expose aria-pressed and aria-label.
- A synchronous head script applies the saved theme before first paint (comment in config.mts describes avoiding a flash of default theme).
- PWA install support via vite-plugin-pwa and a custom manifest.json (200 on https://fmhy.net/manifest.json).
- No font-size control was found. No user accounts; personalization lives in localStorage (assumed from absence of any account UI and from client-only storage patterns in the theme code; the bookmarks feature is delegated to a third-party browser extension).

## 7. Contribution and feedback workflow

- Contributing page (https://fmhy.net/other/contributing): link submissions via PR, explicit do-not-submit list (paid/trial sites, emulators, browsers, leech sites, linux distros, non-English software, coding libraries, betting/mining, multiplayer hacks, custom Windows ISOs), requirement to discuss large restructures in Discord first, preview instructions for editors.
- Repo-level affordances (verified in https://github.com/fmhy/edit tree): .github/CONTRIBUTING.md, ISSUE_TEMPLATE directory, POST_TEMPLATE.md, labeler.yml auto-labeling workflow.
- Per-page "Share Feedback" widget on category pages; aggregated anonymous comments shown at /feedback; backend is api/routes/feedback.post.ts served by Nitro on Cloudflare Workers (wrangler.toml, verified) with KV storage and a rate limiter binding.
- Changelog discipline: monthly update posts at /posts plus generated recently-removed page.

## 8. Mobile experience

- At 390x844 viewport (verified): VitePress "local nav" bar appears with a Menu hamburger and an "On this page" button; the sidebar collapses behind it; content reflows to a single column. Standard VitePress responsive behavior, no custom mobile app shell observed.

## 9. Accessibility spot-checks

- "Skip to content" link present as the first focusable element, targeting #VPContent (verified).
- Heading hierarchy is generally orderly: one h1 per page, h2/h3 sections; homepage cards use h2 inside articles.
- Theme preset buttons expose aria-pressed; sidebar switches use role="switch" with aria-checked; tooltips expose aria-labels; logo image has alt="FMHY Logo".
- CSS includes multiple :focus-visible outline rules (9 focus outline/box-shadow rules sampled from computed stylesheets).
- Limitations: no screen reader or full keyboard walkthrough was performed; contrast was not measured.

## 10. Quantitative observations

DOM counts captured during the visit (single snapshot each, not full audits):

| Page | h2 sections | h3 subsections | ul entries | star spans | tooltip buttons |
| --- | --- | --- | --- | --- | --- |
| /reading | 10 | many (first group alone had 8) | 34 in first list | 92 total | 177 |
| /ai | 9 | 16 | 322 | 56 | not counted |
| /video | 11 | 34 | 959 | not counted | not counted |
| /text-tools | 5 | not counted | 496 | not counted | not counted |

- The heaviest category page (~959 entries) ships all entries in one HTML file. Combined with FMHY's claim of nearly 30k links, average page weight is dominated by content, not framework code.
- Footer build revision link exposes the exact commit deployed (66e7415a on 2026-10-19), a useful transparency pattern.

## 11. Entry anatomy example (structure only, content paraphrased)

Source pattern observed in docs/reading.md and in the rendered DOM:

```
* [star] **[Resource Name](https://example.org/)**, [2](https://mirror.example.org/) - Short Description / Tag / Tag
```

Rendered as:

```
li
├── span.icon (star icon if starred, or a topical icon)
├── strong > a[target=_blank][rel=noreferrer] (resource name)
├── ", " + numbered mirror anchors (optional)
└── " - " + plain text description with trailing inline links for extras
```

Extra affordances observed on individual entries: hover tooltips for notes and warnings (floating-vue, aria-label "Name Note" or "Name Warning"), and callout containers (TIP, INFO, WARNING) between groups.

## 12. Coverage and limitations

Total pages inspected in a browser: 11. Total URLs checked via raw HTTP: 23 (including the 11 above plus 12 status/header checks). GitHub repo files or directory listings viewed: 20.

Verified (direct evidence):
- Homepage, 4 category pages, search info page, beginners guide, FAQ, contributing, posts, feedback content and structure.
- VitePress version, package.json dependency list, build scripts, CI workflows, wrangler.toml, license file, entry markdown conventions, DOM entry formatting, theme panel options, sidebar switches, robots/sitemap/manifest/RSS, Cloudflare-fronted hosting headers.

Not verified or out of reach:
- Exact number of resources (their own claims only: nearly 30k links).
- Which platform actually serves the production build: response headers say Cloudflare, while the repo contains a workflow_dispatch GitHub Pages workflow that builds with base '/edit'. The live site serves assets from root. Possibly the Pages workflow is a mirror or the base was changed after deployment. Not resolvable from public artifacts.
- Full keyboard navigation, screen reader behavior, and contrast ratios (no assistive-tech testing).
- Discord internals (closed community tooling).
- Wiki pages under github.com/fmhy/FMHY/wiki were only spot-checked; the README there still links to the old Reddit wiki index, so content authority now clearly lives in the fmhy/edit docs folder, but migration completeness was not audited.
- The search modal could not be opened reliably in the headless run (it renders in a portal that did not appear in the accessibility snapshot); search behavior was therefore assessed from source code rather than interaction.
