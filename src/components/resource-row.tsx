"use client";

import { ArrowUpRight, Bookmark, BookmarkCheck, ExternalLink, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { hueStyle } from "@/lib/hues";
import { useAtlasStore } from "@/lib/store";
import { hostOf, reportIssueUrl } from "@/data/resources";
import type { Resource } from "@/lib/types";
import { cn } from "@/lib/utils";

/** ISO date (2026-10-19) to a short human label (Oct 19, 2026). */
export function formatVerified(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[m - 1]} ${d}, ${y}`;
}

/**
 * A single catalog entry rendered as a quiet, scannable row.
 * Used in category views, the full index, and the saved view.
 */
export function ResourceRow({
  resource,
  highlight = false,
}: {
  resource: Resource;
  highlight?: boolean;
}) {
  const mounted = useMounted();
  const bookmarked = useAtlasStore((s) => s.bookmarks.includes(resource.id));
  const toggleBookmark = useAtlasStore((s) => s.toggleBookmark);
  const addRecent = useAtlasStore((s) => s.addRecent);

  const open = () => {
    window.open(resource.url, "_blank", "noopener,noreferrer");
    addRecent(resource.id);
  };

  return (
    <li
      id={`res-${resource.id}`}
      style={hueStyle(resource.category)}
      className={cn(
        "group border-b border-line transition-colors last:border-b-0 hover:bg-surface",
        highlight && "flash-row",
      )}
    >
      <div className="flex items-start justify-between gap-4 px-4 py-4 md:px-5">
        <div className="min-w-0 flex-1">
          {/* name + host */}
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="cat-dot self-center" aria-hidden="true" />
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => addRecent(resource.id)}
              className="link-cat inline-flex items-baseline gap-1 text-[15px] font-medium text-fg hover:underline link-external"
            >
              {resource.name}
              <ArrowUpRight className="size-3.5 self-center text-fg-faint" />
            </a>
            <span className="font-mono text-[11px] text-fg-faint">{hostOf(resource.url)}</span>
            {resource.openSource && (
              <span className="rounded-sm border border-line-strong px-1.5 py-px font-mono text-[10px] text-fg-muted">
                open source
              </span>
            )}
          </div>

          {/* description */}
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-fg-muted">
            {resource.description}
          </p>

          {/* notes, only when they exist */}
          {resource.notes && (
            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-fg-faint">
              Note: {resource.notes}
            </p>
          )}

          {/* meta line */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-fg-faint">
            <span
              className={cn(
                "rounded-sm px-1.5 py-px",
                resource.pricing === "free"
                  ? "bg-brand-soft text-brand"
                  : "bg-surface-2 text-fg-muted",
              )}
            >
              {resource.pricing === "free" ? "Free" : resource.pricing === "freemium" ? "Freemium" : "Paid"}
            </span>
            {resource.license && (
              <span title="License or content rights">{resource.license}</span>
            )}
            {resource.platforms && resource.platforms.length > 0 && (
              <span className="hidden sm:inline">{resource.platforms.join(" · ")}</span>
            )}
            <span title="Last manually verified">Checked {formatVerified(resource.verifiedAt)}</span>
          </div>
        </div>

        {/* actions */}
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-pressed={mounted ? bookmarked : false}
            aria-label={bookmarked ? `Remove ${resource.name} from saved` : `Save ${resource.name}`}
            onClick={() => toggleBookmark(resource.id)}
          >
            {mounted && bookmarked ? (
              <BookmarkCheck className="size-4 text-brand" />
            ) : (
              <Bookmark className="size-4 text-fg-faint transition-colors group-hover:text-fg" />
            )}
          </Button>
          <a
            href={reportIssueUrl(resource, "broken")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Report a problem with ${resource.name}`}
            title="Report a broken link or wrong info"
            className="inline-flex size-8 items-center justify-center rounded-md text-fg-faint transition-colors hover:bg-accent hover:text-fg"
          >
            <Flag className="size-4" />
          </a>
          <Button
            variant="outline"
            size="sm"
            className="hidden h-8 gap-1.5 px-2.5 text-xs sm:inline-flex"
            onClick={open}
            aria-label={`Visit ${resource.name}`}
          >
            Visit
            <ExternalLink className="size-3" />
          </Button>
        </div>
      </div>
    </li>
  );
}
