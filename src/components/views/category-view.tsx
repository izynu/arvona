"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterBar, emptyFilters, type FilterState } from "@/components/filter-bar";
import { ResourceRow } from "@/components/resource-row";
import { CategoryIcon } from "@/components/icon-map";
import { hueStyle } from "@/lib/hues";
import { useAtlasStore } from "@/lib/store";
import { applyFilters, groupBySubcategory, slugifyAnchor } from "@/lib/filtering";
import { getCategory } from "@/data/categories";
import { resourcesByCategory } from "@/data/resources";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function CategoryView({
  slug,
  highlight,
}: {
  slug: string;
  highlight?: string;
}) {
  const cat = getCategory(slug);
  const all = useMemo(() => (cat ? resourcesByCategory(cat.id) : []), [cat]);
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const bookmarks = useAtlasStore((s) => s.bookmarks);

  const filtered = useMemo(
    () => applyFilters(all, filters),
    // bookmarks intentionally unused: filtering by saved lives in the Saved view
    [all, filters],
  );
  const groups = useMemo(
    () => (cat ? groupBySubcategory(filtered, cat.subcategories) : []),
    [cat, filtered],
  );

  // Deep link highlight: scroll the row into view once on mount.
  useEffect(() => {
    if (!highlight) return;
    const el = document.getElementById(`res-${highlight}`);
    if (el) {
      const t = window.setTimeout(() => {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 150);
      return () => window.clearTimeout(t);
    }
  }, [highlight]);

  if (!cat) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-fg">Section not found</h1>
        <p className="mt-2 text-sm text-fg-muted">
          The section <span className="font-mono">{slug}</span> does not exist.
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <a href="#/">Back to all sections</a>
        </Button>
      </div>
    );
  }

  const jumpTo = (sub: string) => {
    document.getElementById(`sub-${slugifyAnchor(sub)}`)?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16" style={hueStyle(cat.id)}>
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="pt-6">
        <ol className="flex items-center gap-1.5 text-sm text-fg-faint">
          <li>
            <a href="#/" className="transition-colors hover:text-fg">
              Home
            </a>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current="page" className="text-fg-muted">
            {cat.name}
          </li>
        </ol>
      </nav>

      {/* header */}
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="cat-tile grid size-10 shrink-0 place-items-center rounded-md">
            <CategoryIcon name={cat.icon} className="size-5" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{cat.name}</h1>
          <span className="font-mono text-xs text-fg-faint">{all.length} resources</span>
        </div>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-fg-muted">{cat.description}</p>
        <div aria-hidden="true" className="cat-line mt-5 max-w-3xl" />
      </header>

      {/* subsection jumps */}
      <div className="mt-5 flex flex-wrap gap-2" role="navigation" aria-label="Jump to subsection">
        {cat.subcategories.map((sub) => (
          <button
            key={sub}
            type="button"
            onClick={() => jumpTo(sub)}
            className="cat-chip rounded-md border border-line bg-surface px-2.5 py-1.5 text-xs text-fg-muted transition-colors"
          >
            {sub}
          </button>
        ))}
      </div>

      {/* filters */}
      <div className="mt-6">
        <FilterBar
          state={filters}
          onChange={setFilters}
          resultCount={filtered.length}
          totalCount={all.length}
        />
      </div>

      {/* rows */}
      {groups.length === 0 ? (
        <div className="mt-10 rounded-lg border border-line bg-surface p-10 text-center">
          <p className="text-sm text-fg-muted">No resources match these filters.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => setFilters({ ...emptyFilters })}
          >
            Reset filters
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {groups.map((g) => (
            <section key={g.subcategory} aria-labelledby={`sub-${slugifyAnchor(g.subcategory)}`}>
              <div className="flex items-center gap-2.5">
                <span className="cat-tick" aria-hidden="true" />
                <h2
                  id={`sub-${slugifyAnchor(g.subcategory)}`}
                  className="scroll-mt-20 text-base font-semibold text-fg"
                >
                  {g.subcategory}
                </h2>
                <span className="font-mono text-[11px] text-fg-faint">{g.items.length}</span>
              </div>
              <ul className="cat-band mt-3 overflow-hidden rounded-lg border border-line">
                {g.items.map((r) => (
                  <ResourceRow key={r.id} resource={r} highlight={r.id === highlight} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {/* report */}
      <p className={cn("mt-10 text-sm text-fg-muted")}>
        Something wrong in this section?{" "}
        <a
          href={`${site.repositoryUrl}/issues/new/choose`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-fg underline-offset-2 hover:text-brand hover:underline"
        >
          <Flag className="size-3.5" />
          Report it on GitHub
        </a>
        .
      </p>
    </div>
  );
}
