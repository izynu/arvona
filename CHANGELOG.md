# Changelog

All notable changes to Arvona are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-10-19

### Added

- First public release as Arvona, maintained by Zynu (`@izynu`, lead) and Shraddha (`@xhraddha`, co-maintainer). The project was developed under the working title Open Resource Atlas and shipped under the Arvona name.
- Curated catalog of 14 sections containing 174 hand-checked resources (147 free, 26 freemium, 1 paid), each with an original description, an honest pricing label, and a verification date.
- Search palette (`Ctrl+K` or `/`) with keyboard navigation, plus filters for text, pricing, platform, sorting, open-source only, and saved only.
- Saved list with JSON export and import, persisted locally in the browser.
- Report-a-link flow through prefilled GitHub issues at `https://github.com/izynu/arvona/issues/new/choose`; no backend required.
- Dark theme based on pure black (`#000000`) and a light theme, with selectable accent colors.
- Static export build configured for GitHub Pages, with a deploy workflow at `.github/workflows/deploy-pages.yml` that validates the catalog on every push to `main`.
- MIT license for code and CC0 1.0 for the catalog data.

[1.0.0]: https://github.com/izynu/arvona/releases/tag/v1.0.0
