"use client";

import { useEffect } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogStats } from "@/data/resources";
import { categories } from "@/data/categories";
import { site } from "@/data/site";
import { formatVerified } from "@/components/resource-row";

const sectionClass = "scroll-mt-24";
const h2Class = "text-xl font-semibold tracking-tight text-fg";

export function AboutView({ to }: { to?: string }) {
  const stats = catalogStats();

  // #/about?to={id} scrolls to a section after mount.
  useEffect(() => {
    if (!to) return;
    const el = document.getElementById(to);
    if (el) {
      const t = window.setTimeout(() => {
        el.scrollIntoView({ block: "start", behavior: "smooth" });
      }, 150);
      return () => window.clearTimeout(t);
    }
  }, [to]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16">
      <header className="pt-10">
        <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          About {site.name}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-fg-muted">
          {site.name} is a hand-checked directory of the free and open web, maintained by Zynu
          and Shraddha. It exists because finding genuinely free, legal resources usually means
          digging through SEO spam, abandoned blogs, and sketchy link farms. This is the
          antidote: a short, verified list you can actually finish reading.
        </p>
      </header>

      {/* what */}
      <section id="what" className={`${sectionClass} mt-10`}>
        <h2 className={h2Class}>What you will find here</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-fg-muted">
          <p>
            {stats.total} entries across {categories.length} sections: open-source software,
            public-domain books and media, full university courses, privacy tools, and everyday
            utilities. Every entry was opened, reviewed, and dated by a human before it was
            listed, most recently on {formatVerified(stats.lastVerified)}.
          </p>
          <p>
            Free means two things here: no cost and no legal risk. Nothing in the catalog
            requires piracy, and nothing hides its real price behind a trial.
          </p>
        </div>
      </section>

      {/* policy */}
      <section id="policy" className={`${sectionClass} mt-10`}>
        <h2 className={h2Class}>What belongs, and what never will</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-surface p-4">
            <h3 className="text-sm font-medium text-fg">Belongs</h3>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-fg-muted">
              <li>Free and open-source software with a real license</li>
              <li>Public-domain and Creative Commons media</li>
              <li>Complete courses and open textbooks</li>
              <li>Privacy-respecting services with honest free tiers</li>
            </ul>
          </div>
          <div className="rounded-lg border border-line bg-surface p-4">
            <h3 className="text-sm font-medium text-fg">Never</h3>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-fg-muted">
              <li>Piracy, cracks, or DRM circumvention</li>
              <li>Paywall bypass tools</li>
              <li>Deceptive download buttons or bundled adware</li>
              <li>Anything that stops working the moment you skip payment</li>
            </ul>
          </div>
        </div>
      </section>

      {/* methodology */}
      <section id="methodology" className={`${sectionClass} mt-10`}>
        <h2 className={h2Class}>How entries are verified</h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-fg-muted">
          <li className="flex gap-3">
            <span className="font-mono text-xs text-brand">01</span>
            <span>
              A resource is proposed by a user report or found during maintainer research, then
              checked against the inclusion rules above.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-xs text-brand">02</span>
            <span>
              The URL is opened and its legal status, pricing, and platforms are confirmed from
              the site itself, not from third-party descriptions.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-xs text-brand">03</span>
            <span>
              An entry is written in original words with the license, an honest pricing label,
              and the verification date printed on the row.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-xs text-brand">04</span>
            <span>
              Before each release the whole catalog is re-swept. Dead links are fixed or
              removed, and the flag icon on any row re-opens an entry at any time.
            </span>
          </li>
        </ol>
      </section>

      {/* maintainers */}
      <section id="maintainers" className={`${sectionClass} mt-10`}>
        <h2 className={h2Class}>Maintainers</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {site.maintainers.map((m) => (
            <a
              key={m.handle}
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-line-strong"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-soft text-lg font-semibold text-brand">
                {m.name.charAt(0)}
              </span>
              <span>
                <span className="flex items-center gap-1.5 font-medium text-fg">
                  {m.name}
                  <ExternalLink className="size-3.5 text-fg-faint transition-colors group-hover:text-brand" />
                </span>
                <span className="mt-0.5 block font-mono text-xs text-fg-faint">@{m.handle}</span>
                <span className="mt-0.5 block text-sm text-fg-muted">{m.role}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* contribute */}
      <section id="contribute" className={`${sectionClass} mt-10`}>
        <h2 className={h2Class}>Contributing</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-fg-muted">
          <p>
            Suggestions come straight from users. The fastest route is the flag icon on any row
            or the issue chooser on GitHub, and pull requests that add or fix entries are
            welcome. Every addition must pass the catalog validator before review.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button asChild>
              <a
                href={`${site.repositoryUrl}/issues/new/choose`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open an issue
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href={`${site.repositoryUrl}/blob/main/CONTRIBUTING.md`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="size-4" />
                Contribution guide
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* changelog */}
      <section id="changelog" className={`${sectionClass} mt-10`}>
        <h2 className={h2Class}>Changelog</h2>
        <div className="mt-4 space-y-4">
          {site.changelog.map((entry) => (
            <div key={entry.version} className="rounded-lg border border-line bg-surface p-4">
              <div className="flex items-baseline gap-2.5">
                <h3 className="font-mono text-sm font-medium text-brand">v{entry.version}</h3>
                <span className="font-mono text-[11px] text-fg-faint">{entry.date}</span>
              </div>
              <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-fg-muted">
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* colophon */}
      <section id="colophon" className={`${sectionClass} mt-10`}>
        <h2 className={h2Class}>Colophon</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-fg-muted">
          <p>
            {site.name} is built with Next.js, Tailwind CSS, and shadcn/ui, exported to plain
            static files, and hosted on GitHub Pages. There are no accounts, no analytics, no
            ads, and no cookies. The code is MIT licensed and the catalog data is CC0, so you
            can reuse both freely with attribution.
          </p>
          <p>
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/data/catalog.json`}
              download
              className="text-fg underline-offset-2 hover:text-brand hover:underline"
            >
              Download the full catalog as JSON
            </a>{" "}
            if you want to build on top of the data.
          </p>
        </div>
      </section>
    </div>
  );
}
