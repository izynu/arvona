"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HomeView } from "@/components/views/home";
import { CategoryView } from "@/components/views/category-view";
import { IndexView } from "@/components/views/index-view";
import { SavedView } from "@/components/views/saved-view";
import { AboutView } from "@/components/views/about-view";
import { PrivacyView, TermsView } from "@/components/views/legal-view";
import { NotFoundView } from "@/components/views/not-found";
import { routeToHash, useRoute, type Route } from "@/lib/router";
import { getCategory } from "@/data/categories";
import { site } from "@/data/site";

function titleFor(route: Route): string {
  switch (route.name) {
    case "home":
      return `${site.name}: ${site.tagline}`;
    case "category": {
      const cat = getCategory(route.slug);
      return cat ? `${cat.name} | ${site.name}` : `Not found | ${site.name}`;
    }
    case "index":
      return `All resources | ${site.name}`;
    case "saved":
      return `Saved | ${site.name}`;
    case "about":
      return `About | ${site.name}`;
    case "privacy":
      return `Privacy policy | ${site.name}`;
    case "terms":
      return `Terms of use | ${site.name}`;
    default:
      return `Not found | ${site.name}`;
  }
}

function viewFor(route: Route) {
  switch (route.name) {
    case "home":
      return <HomeView />;
    case "category":
      return <CategoryView slug={route.slug} highlight={route.highlight} />;
    case "index":
      return <IndexView initialQuery={route.q} />;
    case "saved":
      return <SavedView />;
    case "about":
      return <AboutView to={route.to} />;
    case "privacy":
      return <PrivacyView />;
    case "terms":
      return <TermsView />;
    default:
      return <NotFoundView path={route.name === "not-found" ? route.path : ""} />;
  }
}

function Shell() {
  const route = useRoute();
  const key = routeToHash(route);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [key]);

  useEffect(() => {
    document.title = titleFor(route);
  }, [route]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-3 focus:py-2 focus:text-sm focus:text-brand-fg"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" className="flex-1">
        <div key={key} className="view-enter">
          {viewFor(route)}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}
