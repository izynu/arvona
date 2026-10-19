import {
  Bot,
  Clapperboard,
  Compass,
  Gamepad2,
  GitFork,
  Globe,
  GraduationCap,
  BookOpen,
  Microscope,
  MonitorSmartphone,
  Music,
  Palette,
  PenLine,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Bot,
  ShieldCheck,
  GitFork,
  GraduationCap,
  BookOpen,
  Music,
  Clapperboard,
  Gamepad2,
  Palette,
  PenLine,
  Globe,
  MonitorSmartphone,
  Microscope,
  Compass,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] ?? Compass;
  return <Icon className={className} aria-hidden="true" />;
}
