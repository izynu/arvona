import type { Resource } from "@/lib/types";
import type { FilterState } from "@/components/filter-bar";

/**
 * Pure filter and sort functions shared by the category view and the
 * full index view so behavior can never drift between them.
 */

function matchesQuery(r: Resource, q: string): boolean {
  const haystack = `${r.name} ${r.description} ${r.tags.join(" ")} ${r.subcategory} ${r.license ?? ""}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

export function applyFilters(
  list: Resource[],
  state: FilterState,
): Resource[] {
  let out = list;

  if (state.query.trim()) out = out.filter((r) => matchesQuery(r, state.query));
  if (state.pricing !== "all") out = out.filter((r) => r.pricing === state.pricing);
  if (state.platform !== "all")
    out = out.filter((r) => r.platforms?.includes(state.platform as Resource["platforms"] extends (infer P)[] | undefined ? P : never));
  if (state.openSourceOnly) out = out.filter((r) => r.openSource);

  switch (state.sort) {
    case "name":
      out = [...out].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "verified":
      out = [...out].sort(
        (a, b) => b.verifiedAt.localeCompare(a.verifiedAt) || a.name.localeCompare(b.name),
      );
      break;
    case "featured":
    default:
      out = [...out].sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          a.name.localeCompare(b.name),
      );
      break;
  }

  return out;
}

/** Group resources by a canonical subcategory ordering. */
export function groupBySubcategory(
  list: Resource[],
  order: string[],
): { subcategory: string; items: Resource[] }[] {
  return order
    .map((sub) => ({ subcategory: sub, items: list.filter((r) => r.subcategory === sub) }))
    .filter((g) => g.items.length > 0);
}

export function slugifyAnchor(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
