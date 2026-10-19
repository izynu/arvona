# Arvona

**A hand-checked index of the free and open web.**

Arvona is a verified directory of legally free resources: open-source software, public-domain books and media, full university courses, privacy tools, and everyday utilities. Every entry is opened, reviewed, and dated by a human before it is listed. No piracy, no DRM circumvention, no paywall bypass tools, no ads, no trackers.

Maintained by **Zynu** ([@izynu](https://github.com/izynu)) and **Shraddha** ([@xhraddha](https://github.com/xhraddha)).

- Live site: `https://izynu.github.io/arvona/`
- Report a broken link: [open an issue](https://github.com/izynu/arvona/issues/new/choose)
- License: MIT for the code, CC0 1.0 for the catalog data

## What is inside

- **174 verified resources** across 14 sections (AI and developer tools, privacy and security, education, books, music, video, gaming, creative tools, and more).
- Client-side **search, filters, and sorting** over the whole catalog: no backend, no database.
- A personal **saved list** stored only in your browser (localStorage, nothing uploaded).
- **Dark (pure #000000) and light themes**, keyboard accessible, reduced-motion friendly.
- **Report a link** on every row: one click opens a prefilled GitHub issue.
- Pure **static export**: the build produces plain files in `out/` that deploy to GitHub Pages with no server and no rewrites.

## Quick start

Requirements: Node.js 20 LTS (or Bun 1.1+), Git, VS Code.

```bash
git clone https://github.com/izynu/arvona.git
cd arvona
bun install        # or: npm install
bun run dev        # or: npm run dev
```

Open `http://localhost:3000` and start browsing. To stop the dev server press `Ctrl+C`.

## Scripts

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the dev server on port 3000 |
| `bun run build` | Static export to `out/` |
| `bun run start` | Serve the exported `out/` folder locally |
| `bun run lint` | ESLint over the whole project |
| `bun run validate` | Validate the catalog: schema, duplicate ids and URLs, https-only, copy rules |
| `bun run catalog` | Regenerate `public/data/catalog.json` (the open-data export) |

Both `bun run X` and `npm run X` work; the lockfile in the repo is Bun's.

## Where things live

```
src/data/site.ts                  name, links, maintainers, changelog: edit branding here
src/data/categories.ts            the 14 sections and their subcategories
src/data/resources-*.ts           the catalog, split by topic group
src/lib/types.ts                  the Resource data model
src/lib/router.ts                 hash router (#/, #/category/{slug}, #/index, ...)
src/components/                   header, footer, resource rows, views
scripts/validate-resources.ts     data validation, runs in CI before every deploy
DEPLOYMENT.md                     step-by-step VS Code deployment guide
CONTRIBUTING.md                   how to add a resource or report a problem
CHANGELOG.md                      release history
```

## Editing the catalog

Add or fix entries in `src/data/resources-*.ts`, then run `bun run validate` before committing. The validator fails the build on bad data: broken schema, duplicate ids or URLs, missing subcategories, or copy that contains em dashes or emoji. The full contribution rules and the field-by-field schema are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Deployment

Deploys are automated with GitHub Actions: every push to `main` validates the catalog, builds the static export, and publishes it to GitHub Pages. The complete walkthrough, including the custom-domain setup, is in [DEPLOYMENT.md](DEPLOYMENT.md).

## Credits and license

Built and maintained by Zynu ([@izynu](https://github.com/izynu), lead maintainer) and Shraddha ([@xhraddha](https://github.com/xhraddha), co-maintainer).

The site code is released under the [MIT License](LICENSE). The catalog data (descriptions and the JSON export) is dedicated to the public domain under CC0 1.0. All product names and trademarks at linked destinations belong to their respective owners.
