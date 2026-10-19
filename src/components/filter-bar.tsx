"use client";

import { RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Platform, Pricing } from "@/lib/types";

export type SortChoice = "name" | "verified" | "featured";

export interface FilterState {
  query: string;
  pricing: "all" | Pricing;
  platform: "all" | Platform;
  sort: SortChoice;
  openSourceOnly: boolean;
}

const PLATFORM_OPTIONS: Platform[] = [
  "Web",
  "Windows",
  "macOS",
  "Linux",
  "Android",
  "iOS",
  "Self-hosted",
  "CLI",
  "Browser extension",
];

export const emptyFilters: FilterState = {
  query: "",
  pricing: "all",
  platform: "all",
  sort: "featured",
  openSourceOnly: false,
};

/**
 * Shared filter and sort bar for the category view and the full index.
 * One row of controls, no nesting, no hidden state.
 */
export function FilterBar({
  state,
  onChange,
  resultCount,
  totalCount,
}: {
  state: FilterState;
  onChange: (next: FilterState) => void;
  resultCount: number;
  totalCount: number;
}) {
  const patch = (partial: Partial<FilterState>) => onChange({ ...state, ...partial });
  const dirty =
    state.query !== "" ||
    state.pricing !== "all" ||
    state.platform !== "all" ||
    state.openSourceOnly;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        value={state.query}
        onChange={(e) => patch({ query: e.target.value })}
        placeholder="Filter by name, tag, or description"
        aria-label="Filter resources"
        className="h-9 min-w-44 flex-1 border-line bg-background text-sm"
      />

      <Select value={state.pricing} onValueChange={(v) => patch({ pricing: v as FilterState["pricing"] })}>
        <SelectTrigger className="h-9 w-[120px] border-line bg-background text-xs" aria-label="Filter by pricing">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any pricing</SelectItem>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="freemium">Freemium</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
        </SelectContent>
      </Select>

      <Select value={state.platform} onValueChange={(v) => patch({ platform: v as FilterState["platform"] })}>
        <SelectTrigger className="h-9 w-[124px] border-line bg-background text-xs" aria-label="Filter by platform">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any platform</SelectItem>
          {PLATFORM_OPTIONS.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={state.sort} onValueChange={(v) => patch({ sort: v as SortChoice })}>
        <SelectTrigger className="h-9 w-[140px] border-line bg-background text-xs" aria-label="Sort resources">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Editor picks first</SelectItem>
          <SelectItem value="name">Name, A to Z</SelectItem>
          <SelectItem value="verified">Recently checked</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2 rounded-md border border-line bg-background px-3 py-1.5">
        <Label className="flex cursor-pointer items-center gap-2 text-xs text-fg-muted">
          <Switch
            checked={state.openSourceOnly}
            onCheckedChange={(v) => patch({ openSourceOnly: v })}
            aria-label="Show open-source resources only"
          />
          Open source
        </Label>
      </div>

      {dirty && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 px-2 text-xs text-fg-muted"
          onClick={() => onChange({ ...emptyFilters, sort: state.sort })}
        >
          <RotateCcw className="size-3" /> Reset
        </Button>
      )}

      <span className="ml-auto font-mono text-[11px] text-fg-faint" aria-live="polite">
        {resultCount === totalCount ? `${totalCount} resources` : `${resultCount} of ${totalCount}`}
      </span>
    </div>
  );
}
