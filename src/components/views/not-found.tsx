"use client";

import { Button } from "@/components/ui/button";

export function NotFoundView({ path }: { path: string }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-24 text-center">
      <p className="eyebrow text-fg-faint">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        Page not found
      </h1>
      {path && (
        <p className="mt-2 font-mono text-sm text-fg-faint">
          <span className="text-fg-muted">#/</span>
          {path}
        </p>
      )}
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fg-muted">
        The address may be mistyped, or the page may have moved during a release.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        <Button asChild>
          <a href="#/">Go home</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="#/index">Browse all resources</a>
        </Button>
      </div>
    </div>
  );
}
