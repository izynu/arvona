/**
 * Catalog validation. Run with: bun run scripts/validate-resources.ts
 * Fails loudly on bad data so the catalog can never silently rot.
 * Wired into CI (see DEPLOYMENT.md) so invalid data fails the build.
 */
import { z } from "zod";
import { resources } from "../src/data/resources";
import { categories } from "../src/data/categories";

const platformEnum = z.enum([
  "Web",
  "Windows",
  "macOS",
  "Linux",
  "Android",
  "iOS",
  "Self-hosted",
  "CLI",
  "Browser extension",
]);

const resourceSchema = z.object({
  id: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/, "id must be lowercase kebab-case"),
  name: z.string().min(2).max(80),
  url: z.string().url().startsWith("https://", "resource URLs must be https"),
  description: z.string().min(40).max(240),
  category: z.string(),
  subcategory: z.string().min(1),
  tags: z.array(z.string().min(1)).min(3).max(8),
  platforms: z.array(platformEnum).optional(),
  pricing: z.enum(["free", "freemium", "paid"]),
  license: z.string().optional(),
  sourceUrl: z.string().url().startsWith("https://").optional(),
  openSource: z.boolean().optional(),
  featured: z.boolean().optional(),
  verifiedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "verifiedAt must be ISO yyyy-mm-dd"),
  status: z.enum(["active", "unavailable", "deprecated"]),
  notes: z.string().max(300).optional(),
});

const MIN_VERIFIED = "2026-10-01";
const FORBIDDEN_CHARS = /\u2014|\u2013|\u2705|\u2B50|\u2728|\uD83D/;

let errors = 0;
let warnings = 0;

function fail(msg: string) {
  errors += 1;
  console.error(`  ERROR  ${msg}`);
}
function warn(msg: string) {
  warnings += 1;
  console.warn(`  warn   ${msg}`);
}

const seenIds = new Map<string, string>();
const seenUrls = new Map<string, string>();
const minVerifiedDate = new Date(MIN_VERIFIED);

console.log(`\nValidating ${resources.length} resources against ${categories.length} categories...\n`);

for (const r of resources) {
  const label = `${r.id} (${r.name})`;

  const parsed = resourceSchema.safeParse(r);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      fail(`${label}: ${issue.path.join(".")} ${issue.message}`);
    }
    continue;
  }

  const category = categories.find((c) => c.id === r.category);
  if (!category) {
    fail(`${label}: unknown category "${r.category}"`);
    continue;
  }
  if (!category.subcategories.includes(r.subcategory)) {
    fail(
      `${label}: subcategory "${r.subcategory}" is not registered in category "${r.category}" ` +
        `(allowed: ${category.subcategories.join(", ")})`,
    );
  }

  const dupId = seenIds.get(r.id);
  if (dupId) fail(`${label}: duplicate id, already used by "${dupId}"`);
  else seenIds.set(r.id, r.name);

  const dupUrl = seenUrls.get(r.url);
  if (dupUrl) warn(`${label}: URL ${r.url} also used by "${dupUrl}"`);
  else seenUrls.set(r.url, r.name);

  if (new Date(r.verifiedAt) < minVerifiedDate) {
    fail(`${label}: verifiedAt ${r.verifiedAt} is older than ${MIN_VERIFIED}`);
  }

  const textBlob = `${r.name} ${r.description} ${r.notes ?? ""}`;
  if (FORBIDDEN_CHARS.test(textBlob)) {
    fail(`${label}: copy contains em dash, en dash, or emoji characters`);
  }

  if (r.openSource && !r.sourceUrl) {
    warn(`${label}: marked open source but has no sourceUrl for verification`);
  }
}

const featured = resources.filter((r) => r.featured).length;
const byPricing = {
  free: resources.filter((r) => r.pricing === "free").length,
  freemium: resources.filter((r) => r.pricing === "freemium").length,
  paid: resources.filter((r) => r.pricing === "paid").length,
};

console.log("\nCatalog summary");
console.log(`  resources      : ${resources.length}`);
console.log(`  featured       : ${featured}`);
console.log(`  pricing split  : free=${byPricing.free} freemium=${byPricing.freemium} paid=${byPricing.paid}`);
console.log(`  errors         : ${errors}`);
console.log(`  warnings       : ${warnings}\n`);

if (errors > 0) {
  console.error("Validation FAILED. Fix the errors above before shipping.\n");
  process.exit(1);
}
console.log("Validation PASSED.\n");
