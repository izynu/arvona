"use client";

import { useState } from "react";
import { Bookmark, Github, List, Menu, Moon, Sun, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogoWordmark } from "@/components/logo";
import { CategoryIcon } from "@/components/icon-map";
import { hueStyle } from "@/lib/hues";
import { useTheme } from "@/components/theme-provider";
import { useMounted } from "@/hooks/use-mounted";
import { useRoute } from "@/lib/router";
import { useAtlasStore } from "@/lib/store";
import { categories } from "@/data/categories";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Browse", hash: "#/", icon: Compass },
  { label: "All resources", hash: "#/index", icon: List },
  { label: "Saved", hash: "#/saved", icon: Bookmark },
] as const;

function NavLink({
  label,
  hash,
  icon: Icon,
  active,
  badge,
  onClick,
}: {
  label: string;
  hash: string;
  icon: typeof List;
  active: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <a
      href={hash}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-surface-2 text-fg"
          : "text-fg-muted hover:bg-surface-2 hover:text-fg",
      )}
    >
      <Icon className={cn("size-4", active && "text-brand")} />
      {label}
      {typeof badge === "number" && badge > 0 ? (
        <span className="ml-1 rounded-sm bg-brand-soft px-1.5 py-0.5 font-mono text-[10px] text-brand">
          {badge}
        </span>
      ) : null}
    </a>
  );
}

export function SiteHeader() {
  const route = useRoute();
  const { theme, toggleTheme } = useTheme();
  const mounted = useMounted();
  const savedCount = useAtlasStore((s) => s.bookmarks.length);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (hash: string) => {
    if (hash === "#/") return route.name === "home";
    return `#/${route.name === "category" ? "category" : route.name}` === hash;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4">
        <LogoWordmark className="mr-1" />

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.hash}
              {...item}
              active={isActive(item.hash)}
              badge={item.hash === "#/saved" && mounted ? savedCount : undefined}
            />
          ))}
          <a
            href="#/about"
            aria-current={isActive("#/about") ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-sm transition-colors",
              isActive("#/about")
                ? "bg-surface-2 text-fg"
                : "text-fg-muted hover:bg-surface-2 hover:text-fg",
            )}
          >
            About
          </a>
        </nav>

        <div className={cn("flex items-center gap-2", "md:ml-2", "ml-auto md:ml-2")}>
          <Button
            variant="outline"
            size="icon"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <a
            href={site.repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="hidden size-9 items-center justify-center rounded-md border border-line text-fg-muted transition-colors hover:border-line-strong hover:text-fg sm:flex"
          >
            <Github className="size-4" />
          </a>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto p-0">
              <SheetHeader className="border-b border-line p-4 text-left">
                <SheetTitle className="text-sm font-semibold">Browse {site.name}</SheetTitle>
                <SheetDescription className="text-xs text-fg-muted">
                  {categories.length} sections, last checked {site.lastVerified}
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-1 p-3">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.hash}
                    {...item}
                    active={isActive(item.hash)}
                    badge={item.hash === "#/saved" && mounted ? savedCount : undefined}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
                <a
                  href="#/about"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive("#/about")
                      ? "bg-surface-2 text-fg"
                      : "text-fg-muted hover:bg-surface-2 hover:text-fg",
                  )}
                >
                  About
                </a>
                <div className="eyebrow mt-3 px-3 pb-1 pt-2 text-fg-faint">Sections</div>
                <div className="grid grid-cols-1 gap-0.5">
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`#/category/${cat.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
                    >
                      <span className="grid place-items-center" style={hueStyle(cat.id)}>
                        <CategoryIcon name={cat.icon} className="size-4" />
                      </span>
                      {cat.name}
                    </a>
                  ))}
                </div>
                <a
                  href={site.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-fg-muted hover:bg-surface-2 hover:text-fg"
                >
                  <Github className="size-4" /> Source on GitHub
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
