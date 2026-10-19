"use client";

import { useSyncExternalStore } from "react";

/**
 * Hydration gate for UI that depends on localStorage.
 * Renders the server fallback during hydration, then flips to true.
 */
const emptySubscribe = () => () => {};

export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
