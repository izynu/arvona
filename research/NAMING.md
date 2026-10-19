# Naming research: Arvona

Date: 2026-10-19. The project needed a unique one-word name with no existing product, company, package, or repository collision. Research was performed live against public registries and the web.

## Requirements

- One word, invented or near-invented, pronounceable, professional.
- No existing product, company, or well-known project with the same or a near-identical name.
- Clean across the ecosystems a software project touches: GitHub, npm, PyPI, domains.

## Candidates checked

| Name | GitHub repos | npm | PyPI | Web search | Verdict |
| --- | --- | --- | --- | --- | --- |
| arvona | 2 irrelevant (a profile config, a dormant repo) | free | free | 0 results | selected |
| ozvana | 0 | free | free | 8 results, ozvana.com is a live nightlife SaaS | rejected |
| atlora | existing AI knowledge-mapping product plus a GitHub org | free | free | 0 | rejected |
| koshly | one student finance project | free | free | 0 | rejected: too close to the devtool company Kosli |
| novault | 22 repos | free | taken | multiple uses | rejected |
| nivara | 551 repos | free | taken | multiple uses | rejected |
| resourcery | 37 repos | taken | free | multiple uses | rejected |

## Result

**Arvona** (pronounced ar-VOH-na).

- Zero meaningful web search results on the day of research.
- npm package name free, PyPI project name free.
- No GitHub organization or product named Arvona; only two dormant, unrelated repositories matched.
- Domain status: `arvona.com`, `arvona.app`, and `arvona.io` are registered or parked; `arvona.dev`, `arvona.org`, and `getarvona.com` did not resolve, which usually means they are unregistered. Availability must be re-checked at purchase time.
- Closest existing names (Arvato, Arvana) are in unrelated industries and phonetically distinct.

## Where the name is wired in

- `src/data/site.ts` (single source of truth for name, tagline, maintainers, repo URLs)
- `package.json` (name, author, contributors, repository, homepage)
- `LICENSE` (MIT, copyright Zynu and Shraddha), `CODEOWNERS`
- `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `DEPLOYMENT.md`
- `src/app/layout.tsx` (metadata, OG tags), `src/app/icon.svg` (the A mark)
- localStorage keys: `arvona-theme`, `arvona-store-v1`

Renaming the project later means editing `src/data/site.ts`, `package.json`, and the docs: nothing else hardcodes the name.
