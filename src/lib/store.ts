"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Client-side personal data: bookmarks and recently opened resources.
 * Stored in localStorage under a versioned key. No server involvement,
 * which keeps the site privacy-friendly and GitHub-Pages compatible.
 */

interface AtlasState {
  bookmarks: string[];
  recents: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  clearBookmarks: () => void;
  importBookmarks: (ids: string[]) => number;
  addRecent: (id: string) => void;
}

const MAX_RECENTS = 12;

export const useAtlasStore = create<AtlasState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      recents: [],

      toggleBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(id)
            ? state.bookmarks.filter((b) => b !== id)
            : [...state.bookmarks, id],
        })),

      isBookmarked: (id) => get().bookmarks.includes(id),

      clearBookmarks: () => set({ bookmarks: [] }),

      importBookmarks: (ids) => {
        const known = new Set(get().bookmarks);
        const incoming = ids.filter((id) => typeof id === "string" && !known.has(id));
        if (incoming.length === 0) return 0;
        set((state) => ({ bookmarks: [...state.bookmarks, ...incoming] }));
        return incoming.length;
      },

      addRecent: (id) =>
        set((state) => ({
          recents: [id, ...state.recents.filter((r) => r !== id)].slice(0, MAX_RECENTS),
        })),
    }),
    {
      name: "arvona-store-v1",
      // Guard against stale or hand-edited localStorage: only arrays survive.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AtlasState>;
        return {
          ...current,
          bookmarks: Array.isArray(p.bookmarks)
            ? p.bookmarks.filter((id): id is string => typeof id === "string")
            : [],
          recents: Array.isArray(p.recents)
            ? p.recents.filter((id): id is string => typeof id === "string")
            : [],
        };
      },
    },
  ),
);
