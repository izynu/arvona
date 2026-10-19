import type { CSSProperties } from "react";
import type { CategoryId } from "@/lib/types";

/**
 * Section identity hues.
 *
 * Every one of the 14 catalog sections owns one hue so cards, rows, and
 * headers are identifiable at a glance. Values resolve through CSS custom
 * properties (--hue-<id>) defined per theme in globals.css, so the dark
 * and light themes each get tuned shades from the same token. Components
 * never hardcode hex values.
 */
export function hueVar(id: CategoryId): string {
  return `var(--hue-${id})`;
}

/**
 * Inline style that points --cat at a section's hue. Descendants then tint
 * themselves with color-mix utilities (.cat-tile, .cat-dot, .cat-band,
 * .cat-chip, .link-cat) without knowing the hex value.
 */
export function hueStyle(id: CategoryId): CSSProperties {
  return { "--cat": hueVar(id) } as CSSProperties;
}
