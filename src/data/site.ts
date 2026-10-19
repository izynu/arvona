/**
 * Site-wide configuration. Change project name, links, and domain here.
 * Everything the UI references comes from this file.
 */

export const site = {
  name: "Arvona",
  tagline: "A hand-checked index of the free and open web.",
  description:
    "Arvona is a hand-checked directory of free and open-source software, public-domain media, learning platforms, and privacy tools. Every entry is verified, dated, and free of piracy.",
  version: "1.0.0",
  /** Maintainers, in project-credit order */
  maintainers: [
    {
      name: "Zynu",
      handle: "izynu",
      role: "Creator and lead maintainer",
      url: "https://github.com/izynu",
    },
    {
      name: "Shraddha",
      handle: "xhraddha",
      role: "Co-maintainer",
      url: "https://github.com/xhraddha",
    },
  ],
  /** Change these when you fork or rename the project */
  repositoryUrl: "https://github.com/izynu/arvona",
  issuesUrl: "https://github.com/izynu/arvona/issues/new/choose",
  discussionsUrl: "https://github.com/izynu/arvona/discussions",
  /** Custom domain for GitHub Pages. Empty string means the default github.io URL. */
  customDomain: "",
  keywords: [
    "arvona",
    "open source",
    "free software",
    "resource directory",
    "public domain",
    "privacy tools",
    "open access",
    "verified links",
  ],
  license: {
    code: "MIT",
    data: "CC0 1.0",
  },
  /** Date the catalog was last swept and re-verified by editors */
  lastVerified: "2026-10-19",
  changelog: [
    {
      version: "1.0.0",
      date: "2026-10-19",
      items: [
        "First public release under the Arvona name, maintained by Zynu and Shraddha.",
        "Catalog of 14 sections with hand-checked, legally free resources.",
        "Search, filters, sorting, saved list, and report-a-link flow.",
        "Pure black design system with a light theme option.",
      ],
    },
  ],
} as const;

export type SiteConfig = typeof site;
