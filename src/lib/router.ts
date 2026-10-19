"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny hash router. Hash routing keeps every view deep-linkable while
 * remaining deployable to GitHub Pages as pure static files with no
 * server rewrites.
 *
 * Implemented as an external store so SSR and hydration always agree:
 * the server snapshot is the home route, and the real hash is read
 * after hydration through useSyncExternalStore, never during render
 * initialization.
 *
 * Supported routes:
 *   #/                     home
 *   #/category/{slug}      category view (?hl={id} highlights a row)
 *   #/index                full catalog (?q={query} presets the filter)
 *   #/saved                bookmarks
 *   #/about                methodology and contribution (?to={anchor} scrolls)
 *   #/privacy              privacy policy
 *   #/terms                terms of use
 */
export type Route =
  | { name: "home" }
  | { name: "category"; slug: string; highlight?: string }
  | { name: "index"; q?: string }
  | { name: "saved" }
  | { name: "about"; to?: string }
  | { name: "privacy" }
  | { name: "terms" }
  | { name: "not-found"; path: string };

const HOME: Route = { name: "home" };

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, "");
  const [path, query] = raw.split("?");
  const params = new URLSearchParams(query ?? "");
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) return { name: "home" };

  switch (segments[0]) {
    case "category": {
      if (segments.length >= 2) {
        return {
          name: "category",
          slug: segments[1],
          highlight: params.get("hl") ?? undefined,
        };
      }
      return { name: "not-found", path: raw };
    }
    case "index":
      return { name: "index", q: params.get("q") ?? undefined };
    case "saved":
      return { name: "saved" };
    case "about":
      return { name: "about", to: params.get("to") ?? undefined };
    case "privacy":
      return { name: "privacy" };
    case "terms":
      return { name: "terms" };
    default:
      return { name: "not-found", path: raw };
  }
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case "home":
      return "#/";
    case "category":
      return route.highlight
        ? `#/category/${route.slug}?hl=${route.highlight}`
        : `#/category/${route.slug}`;
    case "index":
      return route.q ? `#/index?q=${encodeURIComponent(route.q)}` : "#/index";
    case "saved":
      return "#/saved";
    case "about":
      return route.to ? `#/about?to=${route.to}` : "#/about";
    case "privacy":
      return "#/privacy";
    case "terms":
      return "#/terms";
    default:
      return "#/";
  }
}

export function navigate(hash: string) {
  if (window.location.hash === hash) return;
  window.location.hash = hash;
}

// Cached snapshots: getSnapshot must return a stable value per hash.
let cachedHash: string | null = null;
let cachedRoute: Route = HOME;

function getRouteSnapshot(): Route {
  const hash = window.location.hash;
  if (hash !== cachedHash) {
    cachedHash = hash;
    cachedRoute = parseHash(hash);
  }
  return cachedRoute;
}

function subscribeHash(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function getServerRoute(): Route {
  return HOME;
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribeHash, getRouteSnapshot, getServerRoute);
}

export function hrefFor(path: string): string {
  return `#${path}`;
}
