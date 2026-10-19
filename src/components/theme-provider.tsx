"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

/**
 * Theme system for Arvona.
 *
 * Two themes, nothing more:
 *   dark  pure #000000, the default
 *   light standard light surfaces
 *
 * The choice persists in localStorage under "arvona-theme" and is applied
 * before first paint by an inline script in layout.tsx. State syncs through
 * useSyncExternalStore so SSR and hydration stay consistent without
 * set-state-in-effect patterns.
 */

export type ThemeChoice = "dark" | "light";

const THEME_KEY = "arvona-theme";
const THEME_VALUES: ThemeChoice[] = ["dark", "light"];

function createThemeStore() {
  let cache: ThemeChoice | undefined;
  const listeners = new Set<() => void>();

  return {
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key === THEME_KEY) {
          cache = undefined;
          listeners.forEach((l) => l());
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    get(): ThemeChoice {
      if (cache === undefined) {
        try {
          const v = window.localStorage.getItem(THEME_KEY);
          cache = v === "light" || v === "dark" ? v : "dark";
        } catch {
          cache = "dark";
        }
      }
      return cache;
    },
    set(value: ThemeChoice) {
      cache = value;
      try {
        window.localStorage.setItem(THEME_KEY, value);
      } catch {
        /* storage unavailable; keep session-only value */
      }
      listeners.forEach((l) => l());
    },
    server(): ThemeChoice {
      return "dark";
    },
  };
}

const themeStore = createThemeStore();

interface ThemeContextValue {
  theme: ThemeChoice;
  setTheme: (t: ThemeChoice) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.get, themeStore.server);

  // Reflect the theme onto <html>, an external system, via effect.
  // The inline script in layout.tsx already set it pre-paint; this keeps
  // it in sync when the choice changes.
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.theme !== theme) root.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback((t: ThemeChoice) => {
    if (!THEME_VALUES.includes(t)) return;
    themeStore.set(t);
  }, []);

  const toggleTheme = useCallback(
    () => themeStore.set(theme === "dark" ? "light" : "dark"),
    [theme],
  );

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
