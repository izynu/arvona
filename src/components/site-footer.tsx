"use client";

import { useRoute } from "@/lib/router";
import { categories } from "@/data/categories";
import { site } from "@/data/site";
import { LogoMark } from "@/components/logo";

/**
 * Sticky footer: sits at the bottom of the viewport on short pages and is
 * pushed down naturally on long ones (mt-auto in a min-h-screen column).
 */
export function SiteFooter() {
  const route = useRoute();

  const link =
    "text-sm text-fg-muted transition-colors hover:text-fg";
  const heading = "text-xs font-semibold text-fg";

  const onDirectory =
    route.name !== "category";

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <LogoMark />
              <span className="text-[15px] font-semibold tracking-tight text-fg">{site.name}</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-fg-muted">
              {site.tagline} Maintained by Zynu and Shraddha.
            </p>
          </div>

          <nav aria-label="Directory" className="space-y-3">
            <h2 className={heading}>Directory</h2>
            <ul className="space-y-2">
              <li><a href="#/" className={link}>Browse sections</a></li>
              <li><a href="#/index" className={link}>All resources</a></li>
              <li><a href="#/saved" className={link}>Saved</a></li>
              {onDirectory && (
                <li>
                  <a href={`#/category/${categories[0].id}`} className={link}>
                    Start with {categories[0].name}
                  </a>
                </li>
              )}
            </ul>
          </nav>

          <nav aria-label="Project" className="space-y-3">
            <h2 className={heading}>Project</h2>
            <ul className="space-y-2">
              <li><a href="#/about" className={link}>About and methodology</a></li>
              <li><a href="#/about?to=changelog" className={link}>Changelog</a></li>
              <li>
                <a
                  href={`${site.repositoryUrl}/issues/new/choose`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  Report a broken link
                </a>
              </li>
              <li>
                <a href={site.repositoryUrl} target="_blank" rel="noopener noreferrer" className={link}>
                  GitHub repository
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Legal" className="space-y-3">
            <h2 className={heading}>Legal</h2>
            <ul className="space-y-2">
              <li><a href="#/privacy" className={link}>Privacy policy</a></li>
              <li><a href="#/terms" className={link}>Terms of use</a></li>
              <li>
                <a
                  href={`${site.repositoryUrl}/blob/main/LICENSE`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  MIT License
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-fg-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.version} · Last catalog check {site.lastVerified}
          </p>
          <p>
            Code licensed MIT, catalog data CC0. Built by{" "}
            <a
              href="https://github.com/izynu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-muted underline-offset-2 hover:text-fg hover:underline"
            >
              Zynu
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/xhraddha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-muted underline-offset-2 hover:text-fg hover:underline"
            >
              Shraddha
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
