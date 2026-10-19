# Sitemap Research: FMHY Reference and Arvona Proposal

## Reference structure: FMHY observed tree

Observed between 2026-10-19 14:00 and 15:00 UTC via live browsing plus HTTP status checks. "ext" marks external domains.

```
https://fmhy.net/
├── / (homepage: hero, announcement banner, 13 category cards)
├── /beginners-guide (Q&A onboarding guide)
├── /posts (changelog index, monthly posts, RSS at /feed.rss)
│   └── /posts/search ("How-to Search FMHY")
│   └── /posts/oct-2026 (monthly update)
├── Wiki categories (one long page each)
│   ├── /privacy (Adblocking / Privacy)
│   ├── /ai (Artificial Intelligence)
│   ├── /video (Movies / TV / Anime)
│   ├── /audio (Music / Podcasts / Radio)
│   ├── /gaming (Gaming / Emulation)
│   ├── /reading (Books / Comics / Manga)
│   ├── /downloading
│   ├── /torrenting
│   ├── /educational
│   ├── /mobile (Android / iOS)
│   ├── /linux-macos
│   ├── /non-english
│   └── /misc (Miscellaneous)
├── Tools pages (one long page each)
│   ├── /system-tools
│   ├── /file-tools
│   ├── /internet-tools
│   ├── /social-media-tools
│   ├── /text-tools
│   ├── /gaming-tools
│   ├── /image-tools
│   ├── /video-tools
│   ├── /audio-tools
│   ├── /educational-tools
│   └── /developer-tools
├── More pages
│   ├── /other/FAQ
│   ├── /other/contributing
│   ├── /feedback (anonymous community comments)
│   ├── /other/backups
│   ├── /other/selfhosting
│   ├── /other/wallpapers
│   ├── /storage (verified via curl)
│   ├── /unsafe (verified via curl)
│   └── /recently-removed (generated from git history)
├── Off-site FMHY tools
│   ├── ext https://searx.fmhy.net/ (SearXNG instance)
│   ├── ext https://github.com/fmhy/FMHY-SafeGuard (safety extension)
│   ├── ext https://github.com/mian196/fmhy-bookmarks-extension
│   └── ext https://fmhy.xyz/ (SFW mirror)
└── Supporting artifacts: /sitemap.xml, /robots.txt, /manifest.json, /feed.rss
```

Category page internal pattern (from /reading, /ai, /video, /text-tools):
- h1 category title with a one-line subtitle
- Per-page feedback widget
- Repeating groups: h2 section, optional h3 subsections, ul of entries
- Entry = icon + optional star + bold name link + optional numbered mirrors + dash + description and tags
- Hover tooltips for notes and warnings; TIP/WARNING/INFO callouts

## Proposed sitemap: Arvona

Single-page app, hash routes only, deployable to GitHub Pages. All content comes from prebuilt client-side data modules.

```
#/ (home)
├── Hero: project name, one-sentence value proposition, total resource count, last-verified date
├── Search entry point (opens the Ctrl+K modal, also available as a hero search box)
├── Category grid: 14 cards, each with name, short original description, resource count
├── "How this site is curated" strip: three static steps (collect, verify, review)
├── Saved summary: count of saved items with a link to #/saved
└── Footer: links to #/about, #/privacy, #/terms, GitHub repo, data license

#/category/{slug} for the 14 slugs
├── ai-dev-tools
├── privacy-security
├── open-source
├── education
├── books-literature
├── music-audio
├── movies-video
├── gaming
├── creative-design
├── writing-productivity
├── web-internet
├── platform-tools
├── science-reference
└── misc
Each category page contains:
  - h1 category title and one-sentence original description
  - Filter bar: text filter, "verified picks only" toggle, license filter, platform filter, sort control
  - Groups (2 to 6 per category) with anchor links generated from data
  - Resource entries as cards or list rows: name, domain, one-line original description, verified-pick badge, license label, tags, last-verified date, "Suggest an edit" issue link, save-to-list button
  - Empty state and "no results" state for filtered views

#/index
  - Full A to Z table of every resource across all categories (name, category, group, verified flag)
  - Client-side filter input plus category jump links
  - Counts per category for quick scanning

#/saved
  - localStorage-backed list of saved entries (zustand persist)
  - Empty state explaining saving works without an account
  - Export JSON and Import JSON buttons; "Clear all" with confirmation

#/about
  - What the site is and is not; original positioning
  - Curation and verification methodology
  - Contribution guide: how to propose a resource via GitHub issue or PR
  - Changelog section with data version and verification dates
  - Contact and repository links

#/privacy
  - Static policy: no accounts, no analytics beyond none or self-hosted minimal, localStorage use disclosure, third-party link disclaimer

#/terms
  - Static terms: informational purpose, no warranty, external-link responsibility, data license, trademark disclaimer

Supporting artifacts (static files, not routes)
  - /index.html (SPA shell with full meta and JSON-LD on root)
  - /sitemap.xml (root plus documentation anchors; note hash routes are not separately crawlable)
  - /robots.txt
  - /manifest.json (name, icons, theme color)
  - /404.html (GitHub Pages fallback that redirects to #/)
  - /data/*.json or /data/*.js (per-category prebuilt data modules plus search index)
```

## Mapping decisions

- FMHY's 12 wiki categories plus 11 tool pages collapse into 14 unified categories. Tool-type resources integrate into topical categories (for example text tools live under writing-productivity) instead of a parallel "Tools" tree, because a single taxonomy is easier to search and filter.
- FMHY's /feedback and per-page feedback widgets are replaced by per-entry GitHub issue links; no backend exists in this project.
- FMHY's recently-removed page is replaced by a changelog section inside #/about plus last-verified dates on entries; generating it from git history is a possible later enhancement since data files are in git.
- FMHY's beginners guide is replaced by the "How this site is curated" strip on #/ plus the methodology section in #/about; a separate long guide is deferred to P2 if audience research justifies it.
- Startpage, SearXNG, SafeGuard, wallpapers, badge, and glossary pages are out of scope: they are separate products, not directory mechanics.
