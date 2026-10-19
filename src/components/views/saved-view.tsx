"use client";

import { Bookmark, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ResourceRow } from "@/components/resource-row";
import { useMounted } from "@/hooks/use-mounted";
import { useAtlasStore } from "@/lib/store";
import { getResource } from "@/data/resources";
import { categories } from "@/data/categories";

/**
 * The user's bookmarked resources. Everything lives in localStorage on
 * this device only; nothing is uploaded anywhere.
 */
export function SavedView() {
  const mounted = useMounted();
  const bookmarks = useAtlasStore((s) => s.bookmarks);
  const clearBookmarks = useAtlasStore((s) => s.clearBookmarks);

  const saved = mounted
    ? bookmarks.map((id) => getResource(id)).filter((r): r is NonNullable<typeof r> => Boolean(r))
    : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16">
      <header className="pt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Saved</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
              Your bookmarked resources, stored only in this browser. No account, no sync, no
              server copy.
            </p>
          </div>
          {saved.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-1.5 text-xs text-fg-muted">
                  <Trash2 className="size-3.5" />
                  Clear all
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear all saved resources?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes all {saved.length} saved entries from this browser. The catalog
                    itself is not affected.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep them</AlertDialogCancel>
                  <AlertDialogAction onClick={clearBookmarks}>
                    Clear saved list
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </header>

      {saved.length === 0 ? (
        <div className="mt-10 rounded-lg border border-line bg-surface p-12 text-center">
          <Bookmark className="mx-auto size-6 text-fg-faint" />
          <p className="mt-3 font-medium text-fg">Nothing saved yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-fg-muted">
            Use the bookmark icon on any row to build a personal shortlist. It stays on this
            device.
          </p>
          <Button className="mt-6" asChild>
            <a href="#/">Browse sections</a>
          </Button>
        </div>
      ) : (
        <>
          <p className="mt-6 font-mono text-[11px] text-fg-faint" aria-live="polite">
            {saved.length} saved {saved.length === 1 ? "resource" : "resources"}
          </p>
          <ul className="mt-3 overflow-hidden rounded-lg border border-line">
            {saved.map((r) => (
              <ResourceRow key={r.id} resource={r} />
            ))}
          </ul>
          <p className="mt-6 text-sm text-fg-muted">
            Want more like these?{" "}
            <a href={`#/category/${categories[0].id}`} className="text-fg underline-offset-2 hover:text-brand hover:underline">
              Browse every section
            </a>
            .
          </p>
        </>
      )}
    </div>
  );
}
