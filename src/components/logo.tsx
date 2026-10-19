import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * The Arvona mark: a geometric A drawn as a compass needle pointing up.
 * Original mark for Arvona.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7", className)}
      role="img"
      aria-label={`${site.name} logo`}
    >
      <rect width="32" height="32" rx="7" fill="#000000" stroke="var(--line-strong)" />
      <path
        d="M10 23.5 L16 8.5 L22 23.5"
        stroke="var(--brand)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12.7 18 H19.3" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <a
      href="#/"
      className={cn("flex shrink-0 items-center gap-2.5 rounded-md", className)}
      aria-label={`${site.name}, home`}
    >
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight text-fg">{site.name}</span>
    </a>
  );
}
