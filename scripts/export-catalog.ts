/**
 * Exports the catalog to public/data/catalog.json.
 *
 * Run with: bun run scripts/export-catalog.ts
 *
 * The exported file is committed to the repository so static mirrors,
 * the GitHub Pages build, and external consumers can read the catalog
 * without executing TypeScript. Keep it deterministic.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { catalogStats, resources } from "../src/data/resources";
import { categories } from "../src/data/categories";
import { site } from "../src/data/site";

const payload = {
  format: "open-resource-atlas-catalog",
  version: site.version,
  generatedAt: site.lastVerified,
  license: site.license,
  categories,
  resources,
  stats: catalogStats(),
};

const outDir = resolve(import.meta.dir, "../public/data");
mkdirSync(outDir, { recursive: true });
const outFile = resolve(outDir, "catalog.json");
writeFileSync(outFile, `${JSON.stringify(payload, null, 2)}\n`);

console.log(
  `Exported ${payload.resources.length} resources and ${payload.categories.length} categories to public/data/catalog.json`,
);
