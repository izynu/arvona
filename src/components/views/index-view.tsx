"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterBar, emptyFilters, type FilterState } from "@/components/filter-bar";
import { ResourceRow } from "@/components/resource-row";
import { hueStyle } from "@/lib/hues";
import { applyFilters, groupBySubcategory, slugifyAnchor } from "@/lib/filtering";
import { categories } from "@/data/categories";
import { resources } from "@/data/resources";

/**
 * The full catalog in one scrollable view, grouped by section.
 * Reached from the hero search (#/index?q=...) or the header link.
 */
export function IndexView({ initialQuery }: { initialQuery?: string }) {
  const [filters, setFilters] = useState<FilterState>({
    ...emptyFilters,
    query: initialQuery ?? "",
  });

  const filtered = useMemo(() => applyFilters(resources, filters), [filters]);

  // After a search lands here, scroll to the top (the router already does)
  // and focus the filter input through the natural tab order.
  useEffect(() => {
    document.title = initialQuery
      ? `Search: ${initialQuery} | Arvona`
      : "All resources | Arvona";
  }, [initialQuery]);

  const groups = useMemo(
    () =>
      categories
        .map((cat) => ({
          cat,
          items: filtered.filter((r) => r.category === cat.id),
        }))
        .filter((g) => g.items.length > 0),
    [filtered],
  );

  const jumpTo = (id: string) => {
    document.getElementById(`sec-${id}`)?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16">
      <header className="pt-10">
        <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">All resources</h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-fg-muted">
          The complete catalog: {resources.length} entries across {categories.length} sections.
          Filter, sort, or search the whole thing from one place.
        </p>
      </header>

      {/* section jumps */}
      <div className="mt-5 flex flex-wrap gap-2" role="navigation" aria-label="Jump to section">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => jumpTo(cat.id)}
            className="flex items-center gap-2 rounded-md border border-line bg-surface px-2.5 py-1.5 text-xs text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            <span className="cat-dot" style={hueStyle(cat.id)} aria-hidden="true" />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <FilterBar
          state={filters}
          onChange={setFilters}
          resultCount={filtered.length}
          totalCount={resources.length}
        />
      </div>

      {groups.length === 0 ? (
        <div className="mt-10 rounded-lg border border-line bg-surface p-10 text-center">
          <p className="text-sm text-fg-muted">
            Nothing matches <span className="font-mono text-fg">{filters.query}</span>.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setFilters({ ...emptyFilters })}
          >
            Clear search
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {groups.map((g) => (
            <section
              key={g.cat.id}
              aria-labelledby={`sec-${g.cat.id}`}
              style={hueStyle(g.cat.id)}
            >
              <div className="flex items-center gap-2.5">
                <span className="cat-tick" aria-hidden="true" />
                <h2 id={`sec-${g.cat.id}`} className="scroll-mt-20 text-lg font-semibold text-fg">
                  {g.cat.name}
                </h2>
                <span className="font-mono text-[11px] text-fg-faint">{g.items.length}</span>
              </div>
              {g.cat.subcategories.length > 1 ? (
                <div className="mt-6 space-y-6">
                  {groupBySubcategory(g.items, g.cat.subcategories).map((sg) => (
                    <div key={sg.subcategory}>
                      <div className="flex items-baseline gap-2.5">
                        <h3
                          id={`sec-${g.cat.id}-${slugifyAnchor(sg.subcategory)}`}
                          className="scroll-mt-20 text-sm font-medium text-fg-muted"
                        >
                          {sg.subcategory}
                        </h3>
                        <span className="font-mono text-[11px] text-fg-faint">{sg.items.length}</span>
                      </div>
                      <ul className="cat-band mt-2 overflow-hidden rounded-lg border border-line">
                        {sg.items.map((r) => (
                          <ResourceRow key={r.id} resource={r} />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="cat-band mt-3 overflow-hidden rounded-lg border border-line">
                  {g.items.map((r) => (
                    <ResourceRow key={r.id} resource={r} />
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
