# Contributing to Arvona

Thank you for helping grow the catalog. Arvona is a hand-checked index of the free and open web, so every contribution is reviewed by a maintainer before it appears on the site. This document explains what belongs in the catalog, the data format, and how to submit changes.

## What belongs in the catalog

A resource is a good fit when all of the following are true:

- It is legally accessible: free to use, openly licensed, public domain, or an honestly labeled freemium or paid product with a genuinely usable free tier.
- Its website loads over `https` without certificate warnings.
- It is active and maintained: the site works, downloads are current, and the project has signs of life (recent releases, posts, or commits) where that applies.
- Trying it requires no account for the core experience. Services that need an account for the free tier are acceptable only when signup is free and the entry says so.

## What never belongs

- Piracy of any kind: cracked software, key generators, leaked content, or unauthorized copies of books, films, music, or games.
- DRM circumvention tools and guides.
- Paywall bypass tools or instructions.
- Malware, spyware, or anything that harms the person using it.
- Deceptive downloads: fake download buttons, bundled adware installers, or pages that trick visitors into installing something else.

Entries that fall into these categories are removed on sight, and repeated attempts lead to a block from the repository.

## The resource schema

Every resource is one object in a data file under `src/data`, typed by `Resource` in `src/lib/types.ts` and enforced by the validator in `scripts/validate-resources.ts`.

| Field | Type | Rules |
| --- | --- | --- |
| `id` | `string` | Required. Lowercase kebab-case, 2 to 64 characters, unique across the whole catalog and never reused. |
| `name` | `string` | Required. Official product name, 2 to 80 characters. |
| `url` | `string` | Required. Canonical destination URL, must start with `https://`. No tracking parameters. |
| `description` | `string` | Required. One or two original sentences, 40 to 240 characters. Written in your own words. No em dashes, no en dashes, no emoji, no marketing fluff. |
| `category` | `string` | Required. One of the 14 category ids from `src/data/categories.ts`, for example `open-source`. |
| `subcategory` | `string` | Required. Must exactly match one of the chosen category's registered subcategories, for example `Discovery`. |
| `tags` | `string[]` | Required. 3 to 8 lowercase keywords people would search for. |
| `platforms` | `Platform[]` | Optional. Values from the fixed list: `Web`, `Windows`, `macOS`, `Linux`, `Android`, `iOS`, `Self-hosted`, `CLI`, `Browser extension`. |
| `pricing` | `string` | Required. Exactly one of `free`, `freemium`, `paid`. Label honestly; a free tier behind a paid core is `freemium`, not `free`. |
| `license` | `string` | Optional. SPDX identifier or a rights statement when applicable, for example `MIT`, `GPL-3.0`, or `CC BY-SA 4.0`. |
| `sourceUrl` | `string` | Optional. `https` URL where the license or open-source claim can be verified, such as the repository or license page. |
| `openSource` | `boolean` | Optional. `true` only when the open-source status is verifiable. If `true`, include `sourceUrl`. |
| `featured` | `boolean` | Optional. Editorially highlighted picks. Maintainers decide which entries are featured; do not set this in your own submissions. |
| `verifiedAt` | `string` | Required. Date you personally checked the resource, in ISO format `yyyy-mm-dd`. The validator rejects dates before `2026-10-01`. |
| `status` | `string` | Required. One of `active`, `unavailable`, `deprecated`. |
| `notes` | `string` | Optional. Up to 300 characters of limitations, safety guidance, or usage caveats. |

## Where resources live

The catalog is split across four data files. Check which file covers your category before editing:

| File | Categories it covers |
| --- | --- |
| `src/data/resources-tools.ts` | AI & Developer Tools (`ai-dev-tools`), Privacy & Security (`privacy-security`), Open Source Software (`open-source`), Web & Internet Tools (`web-internet`) |
| `src/data/resources-learning.ts` | Education & Research (`education`), Books & Literature (`books-literature`), Science & Reference (`science-reference`) |
| `src/data/resources-media.ts` | Music & Audio (`music-audio`), Movies & Video (`movies-video`), Gaming (`gaming`) |
| `src/data/resources-creation.ts` | Creative & Design (`creative-design`), Writing & Productivity (`writing-productivity`), Platform Tools (`platform-tools`), Everything Else (`misc`) |

`src/data/resources.ts` aggregates these four files and sorts the result; never edit it directly. `src/data/categories.ts` defines the 14 categories and their exact subcategory labels; the validator rejects any `subcategory` that does not match one of them.

## How to add a resource

1. Open the four data files listed above and confirm which file covers your category. When in doubt, search the files for a resource you already know and see where it lives.
2. Open `src/data/categories.ts` and pick the exact `subcategory` string for your category. Copy it character for character.
3. In the correct data file, copy an existing entry as a template and paste it at the end of the array. This shape is the reference:

   ```ts
   {
     id: "example-resource",
     name: "Example Resource",
     url: "https://example.com",
     description: "One or two original sentences explaining what this does and who it is for.",
     category: "open-source",
     subcategory: "Discovery",
     tags: ["example", "keywords", "here"],
     platforms: ["Web"],
     pricing: "free",
     license: "MIT",
     sourceUrl: "https://github.com/example/example",
     openSource: true,
     verifiedAt: "2026-10-19",
     status: "active",
   },
   ```

4. Fill in every required field, set `verifiedAt` to today's date (format `yyyy-mm-dd`), and visit the URL to confirm it works.
5. Run the validator and fix anything it reports:

   ```bash
   bun run validate
   ```

   or, if you use npm:

   ```bash
   npm run validate
   ```

6. Commit your change to a branch, push it, and open a pull request against `main` at `https://github.com/izynu/arvona/compare`.

### Pull request checklist

- [ ] The resource passes the "What belongs" rules above.
- [ ] `category` is a real category id and `subcategory` matches a registered subcategory exactly.
- [ ] The URL works and is `https`.
- [ ] The description is original, 40 to 240 characters, with no em dashes and no emoji.
- [ ] The `pricing` label is honest.
- [ ] `openSource: true` is backed by a `sourceUrl`.
- [ ] `verifiedAt` is today's date.
- [ ] `bun run validate` (or `npm run validate`) passes with 0 errors and 0 warnings.

## Reporting a broken link

You do not need to open a pull request to report a bad link. Two ways work:

- Click the flag icon on any resource row in the site. It opens a prefilled GitHub issue with the resource id and page.
- Open an issue directly at `https://github.com/izynu/arvona/issues/new/choose` and pick the broken link template.

The site has no backend for reports; prefilled issues are the supported flow.

## Review process

`CODEOWNERS` at the repository root requires review from `@izynu` and `@xhraddha` on every pull request, so GitHub requests both maintainers automatically. Nothing merges without a maintainer approval.

Before merging, the maintainers check:

- Legality: the resource is legally accessible and not adjacent to anything in the "never belongs" list.
- The URL resolves over `https` and leads where the name says it does.
- The `pricing` label matches reality.
- License and open-source claims are verifiable through `sourceUrl`.
- The description is original, accurate, and within length limits.
- The category and subcategory placement is sensible.
- The validator passes with 0 errors and 0 warnings.

Reviews usually happen within a few days. If your pull request is stale, a friendly comment pings the maintainers.
