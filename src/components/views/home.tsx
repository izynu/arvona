"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResourceRow, formatVerified } from "@/components/resource-row";
import { CategoryIcon } from "@/components/icon-map";
import { hueStyle } from "@/lib/hues";
import { navigate, useRoute } from "@/lib/router";
import { useAtlasStore } from "@/lib/store";
import { categories } from "@/data/categories";
import { catalogStats, getResource, resources } from "@/data/resources";
import { site } from "@/data/site";
import type { Resource } from "@/lib/types";

/**
 * Six editor picks that cover different sections first, so the front
 * page does not read like one category repeated six times.
 */
function pickFeatured(limit = 6): Resource[] {
  const featured = resources.filter((r) => r.featured);
  const picked: Resource[] = [];
  const seenCategory = new Set<string>();
  for (const r of featured) {
    if (picked.length >= limit) break;
    if (!seenCategory.has(r.category)) {
      picked.push(r);
      seenCategory.add(r.category);
    }
  }
  for (const r of featured) {
    if (picked.length >= limit) break;
    if (!picked.includes(r)) picked.push(r);
  }
  return picked;
}

export function HomeView() {
  useRoute(); // subscribe so the view re-renders on navigation
  const stats = useMemo(() => catalogStats(), []);
  const featured = useMemo(() => pickFeatured(6), []);
  const recents = useAtlasStore((s) => s.recents);
  const [query, setQuery] = useState("");

  const lastCheck = formatVerified(stats.lastVerified || site.lastVerified);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `#/index?q=${encodeURIComponent(q)}` : "#/index");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16">
      {/* hero */}
      <section className="relative pt-14 md:pt-20" aria-labelledby="hero-heading">
        <div aria-hidden="true" className="hero-glow" />
        <p className="eyebrow text-fg-faint">Independent. Ad-free. No trackers.</p>
        <h1 id="hero-heading" className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-fg sm:text-4xl md:text-[2.75rem] md:leading-tight">
          Free and open resources, checked by hand.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted">
          {site.name} indexes {stats.total} tools, archives, and learning platforms across{" "}
          {categories.length} sections. Every entry points to something you can legally use for
          free, and every entry shows the date it was last verified.
        </p>

        <form onSubmit={onSearch} className="mt-7 flex max-w-xl gap-2" role="search">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-faint" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the catalog. Try obsidian, blender, or privacy"
              aria-label="Search resources"
              className="h-11 border-line bg-surface pl-9 text-sm"
            />
          </div>
          <Button type="submit" className="h-11 px-5 text-sm">
            Search
            <ArrowRight className="size-4" />
          </Button>
        </form>

        <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-fg-faint">
          <span>{stats.total} resources</span>
          <span aria-hidden="true">·</span>
          <span>{categories.length} sections</span>
          <span aria-hidden="true">·</span>
          <span>{stats.openSource} open source</span>
          <span aria-hidden="true">·</span>
          <span>last check {lastCheck}</span>
        </p>
      </section>

      {/* sections */}
      <section className="mt-16" aria-labelledby="sections-heading">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h2 id="sections-heading" className="text-xl font-semibold tracking-tight text-fg">
              Browse by section
            </h2>
            <p className="mt-1 text-sm text-fg-muted">
              Fourteen focused lists. Each one is small enough to read top to bottom.
            </p>
          </div>
        </div>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <li key={cat.id}>
              <a
                href={`#/category/${cat.id}`}
                style={hueStyle(cat.id)}
                className="cat-card group flex h-full flex-col rounded-lg border border-line bg-surface p-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="cat-tile grid size-9 shrink-0 place-items-center rounded-md">
                    <CategoryIcon name={cat.icon} className="size-4.5" />
                  </span>
                  <span className="font-medium text-fg">{cat.name}</span>
                  <span className="ml-auto font-mono text-[11px] text-fg-faint">
                    {stats.byCategory[cat.id]}
                  </span>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{cat.tagline}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* featured */}
      <section className="mt-16" aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="text-xl font-semibold tracking-tight text-fg">
          Start with these
        </h2>
        <p className="mt-1 text-sm text-fg-muted">
          Editor picks chosen for reliability, documentation, and staying power.
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {featured.map((r) => {
            const cat = categories.find((c) => c.id === r.category);
            return (
              <li
                key={r.id}
                className="rounded-lg border border-line bg-surface p-4 transition-colors hover:border-line-strong"
              >
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-fg hover:text-brand hover:underline link-external"
                >
                  {cat && <span className="cat-dot" style={hueStyle(cat.id)} aria-hidden="true" />}
                  {r.name}
                  <ArrowRight className="size-3.5 -rotate-45 text-fg-faint" />
                </a>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-fg-muted">
                  {r.description}
                </p>
                {cat && (
                  <p className="mt-2.5 font-mono text-[11px] text-fg-faint">
                    <a href={`#/category/${cat.id}`} className="hover:text-fg-muted hover:underline">
                      {cat.name}
                    </a>
                    {" · "}
                    {r.subcategory}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* recently viewed */}
      {recents.length > 0 && (
        <section className="mt-16" aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="text-xl font-semibold tracking-tight text-fg">
            Recently opened
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {recents.slice(0, 8).map((id) => {
              const r = getResource(id);
              if (!r) return null;
              return (
                <li key={id}>
                  <a
                    href={`#/category/${r.category}?hl=${r.id}`}
                    className="inline-flex items-center rounded-md border border-line bg-surface px-2.5 py-1.5 text-xs text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    {r.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* methodology */}
      <section className="mt-16" aria-labelledby="method-heading">
        <h2 id="method-heading" className="text-xl font-semibold tracking-tight text-fg">
          How entries get in
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-line bg-surface p-4">
            <ShieldCheck className="size-5 text-brand" />
            <h3 className="mt-3 font-medium text-fg">Legal only</h3>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">
              Piracy, DRM circumvention, and paywall bypass tools are rejected. Free means the
              rights holder allows it.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4">
            <BadgeCheck className="size-5 text-[var(--hue-education)]" />
            <h3 className="mt-3 font-medium text-fg">Checked by hand</h3>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">
              Every URL is opened and reviewed before listing. The check date is printed on each
              entry.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4">
            <RefreshCw className="size-5 text-[var(--hue-web-internet)]" />
            <h3 className="mt-3 font-medium text-fg">Kept current</h3>
            <p className="mt-1 text-sm leading-relaxed text-fg-muted">
              Links are re-verified before each release, and the flag icon on any row reports a
              dead link in one click.
            </p>
          </div>
        </div>
      </section>

      {/* contribute */}
      <section className="mt-16" aria-labelledby="contribute-heading">
        <div className="rounded-lg border border-line bg-surface p-6 md:p-8">
          <h2 id="contribute-heading" className="text-xl font-semibold tracking-tight text-fg">
            Help improve the catalog
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
            Suggestions come from users, not scrapers. If you know a resource that belongs here,
            or you hit a dead link, both fixes are one click away.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild>
              <a
                href={`${site.repositoryUrl}/issues/new/choose`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Suggest a resource
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#/about?to=contribute">Read the contribution guide</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
