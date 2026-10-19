/**
 * Arvona - shared data model.
 * Resources live in src/data, UI components never hardcode content.
 */

export type Pricing = "free" | "freemium" | "paid";

export type ResourceStatus = "active" | "unavailable" | "deprecated";

export type Platform =
  | "Web"
  | "Windows"
  | "macOS"
  | "Linux"
  | "Android"
  | "iOS"
  | "Self-hosted"
  | "CLI"
  | "Browser extension";

export type CategoryId =
  | "ai-dev-tools"
  | "privacy-security"
  | "open-source"
  | "education"
  | "books-literature"
  | "music-audio"
  | "movies-video"
  | "gaming"
  | "creative-design"
  | "writing-productivity"
  | "web-internet"
  | "platform-tools"
  | "science-reference"
  | "misc";

export interface Category {
  id: CategoryId;
  /** Short display name, e.g. "Privacy & Security" */
  name: string;
  /** One-line tagline used on cards */
  tagline: string;
  /** Longer intro shown at the top of a category page */
  description: string;
  /** Lucide icon name, resolved in src/components/icon-map.tsx */
  icon: string;
  /** Canonical subsection labels, in display order */
  subcategories: string[];
}

export interface Resource {
  /** Stable unique identifier, never reused */
  id: string;
  name: string;
  /** Canonical destination URL, https only */
  url: string;
  /** Original one or two sentence explanation */
  description: string;
  category: CategoryId;
  /** Must match one of the category's subcategories */
  subcategory: string;
  /** Lowercase searchable keywords */
  tags: string[];
  /** Supported platforms where applicable */
  platforms?: Platform[];
  /** Honest cost classification */
  pricing: Pricing;
  /** SPDX-style license or content rights statement when applicable */
  license?: string;
  /** Where the claim (license, open-source status) can be verified */
  sourceUrl?: string;
  /** Only true when verifiably open source */
  openSource?: boolean;
  /** Editorially highlighted resource */
  featured?: boolean;
  /** Date of last manual verification, ISO 8601 yyyy-mm-dd */
  verifiedAt: string;
  status: ResourceStatus;
  /** Limitations, safety guidance, or usage notes */
  notes?: string;
}

export interface CatalogStats {
  total: number;
  byCategory: Record<CategoryId, number>;
  openSource: number;
  featured: number;
  lastVerified: string;
}
