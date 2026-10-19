import type { CategoryId, Resource } from "@/lib/types";
import { resources } from "@/data/resources";
import { categories } from "@/data/categories";

/**
 * Lightweight client-side scoring search over the catalog.
 * 174 entries are small enough to search in-memory instantly; if the
 * catalog grows past a few thousand, swap the data source for the
 * prebuilt index JSON (scripts/export-catalog.ts) without changing
 * this interface.
 */

const categoryNames = new Map<CategoryId, string>(categories.map((c) => [c.id, c.name]));

export interface SearchHit {
  resource: Resource;
  score: number;
}

export function searchResources(query: string, limit = 18): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const tokens = q.split(/\s+/).filter(Boolean);
  const hits: SearchHit[] = [];

  for (const r of resources) {
    const name = r.name.toLowerCase();
    const desc = r.description.toLowerCase();
    const tags = r.tags.join(" ").toLowerCase();
    const cat = (categoryNames.get(r.category) ?? "").toLowerCase();
    const sub = r.subcategory.toLowerCase();

    let score = 0;
    let matchedAll = true;

    for (const t of tokens) {
      let tokenScore = 0;
      if (name.startsWith(t)) tokenScore = 16;
      else if (name.includes(t)) tokenScore = 10;
      else if (tags.includes(t)) tokenScore = 6;
      else if (sub.includes(t)) tokenScore = 4;
      else if (desc.includes(t)) tokenScore = 3;
      else if (cat.includes(t)) tokenScore = 2;

      if (tokenScore === 0) {
        matchedAll = false;
        break;
      }
      score += tokenScore;
    }

    if (matchedAll && score > 0) {
      if (r.featured) score += 1;
      hits.push({ resource: r, score });
    }
  }

  return hits.sort((a, b) => b.score - a.score || a.resource.name.localeCompare(b.resource.name)).slice(0, limit);
}
