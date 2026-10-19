import type { CatalogStats, CategoryId, Resource } from "@/lib/types";
import { categories, categoryIds } from "@/data/categories";
import { site } from "@/data/site";
import { resourcesTools } from "@/data/resources-tools";
import { resourcesLearning } from "@/data/resources-learning";
import { resourcesMedia } from "@/data/resources-media";
import { resourcesCreation } from "@/data/resources-creation";

/** The complete catalog, in canonical category order. */
export const resources: Resource[] = [
  ...resourcesTools,
  ...resourcesLearning,
  ...resourcesMedia,
  ...resourcesCreation,
].sort((a, b) => {
  const ca = categoryIds.indexOf(a.category);
  const cb = categoryIds.indexOf(b.category);
  if (ca !== cb) return ca - cb;
  return a.name.localeCompare(b.name);
});

export const resourceMap: Record<string, Resource> = Object.fromEntries(
  resources.map((r) => [r.id, r]),
);

export function getResource(id: string): Resource | undefined {
  return resourceMap[id];
}

export function resourcesByCategory(categoryId: CategoryId): Resource[] {
  return resources.filter((r) => r.category === categoryId);
}

export function countByCategory(): Record<CategoryId, number> {
  const counts = Object.fromEntries(categoryIds.map((id) => [id, 0])) as Record<CategoryId, number>;
  for (const r of resources) counts[r.category] += 1;
  return counts;
}

export function catalogStats(): CatalogStats {
  const byCategory = countByCategory();
  return {
    total: resources.length,
    byCategory,
    openSource: resources.filter((r) => r.openSource).length,
    featured: resources.filter((r) => r.featured).length,
    lastVerified: resources.reduce((latest, r) => (r.verifiedAt > latest ? r.verifiedAt : latest), ""),
  };
}

export const catalogCategories = categories;

/** Hostname of a resource URL, used in compact rows. */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Build the GitHub "new issue" deep link for reporting a specific resource.
 * Works without any server, which keeps the site GitHub-Pages friendly.
 */
export function reportIssueUrl(r: Resource, kind: "broken" | "edit" = "broken"): string {
  const title =
    kind === "broken"
      ? `[Broken link] ${r.name} (${r.id})`
      : `[Suggested edit] ${r.name} (${r.id})`;
  const body = [
    `**Resource:** ${r.name}`,
    `**ID:** ${r.id}`,
    `**URL in catalog:** ${r.url}`,
    `**Category:** ${r.category} / ${r.subcategory}`,
    `**Problem:** <describe what is wrong>`,
    "",
    `Verified on ${r.verifiedAt} in catalog v${site.version}.`,
  ].join("\n");
  const params = new URLSearchParams({ title, body, labels: "resource-report" });
  return `${site.repositoryUrl}/issues/new?${params.toString()}`;
}
