import type { Category, CategoryId } from "@/lib/types";

/**
 * The 14 top-level sections of the catalog.
 * Subcategory labels are canonical: every resource subcategory must match one.
 */
export const categories: Category[] = [
  {
    id: "ai-dev-tools",
    name: "AI & Developer Tools",
    tagline: "Run models locally and build with open ML tooling.",
    description:
      "Tools for working with artificial intelligence on your own terms: local model runtimes, open dataset hubs, coding assistants, and notebook environments that do not require a paid subscription to try.",
    icon: "Bot",
    subcategories: ["Local AI", "Model & Dataset Hubs", "Coding Assistants", "Notebooks & Experimentation"],
  },
  {
    id: "privacy-security",
    name: "Privacy & Security",
    tagline: "Encrypted messaging, passwords, and anonymity tools.",
    description:
      "Services and software that keep accounts, messages, and browsing private. Every pick here has a published security model, and paid options are labeled honestly.",
    icon: "ShieldCheck",
    subcategories: ["Messaging & Email", "Passwords & Keys", "Secure Collaboration", "Anonymity", "Monitoring & Guidance"],
  },
  {
    id: "open-source",
    name: "Open Source Software",
    tagline: "Find, compare, and understand free software.",
    description:
      "Discovery layers for the open-source ecosystem: forges, curated lists, alternative finders, and licensing guides that help you choose software you can trust and legally modify.",
    icon: "GitFork",
    subcategories: ["Discovery", "Forges & Hosting", "Licensing & Method"],
  },
  {
    id: "education",
    name: "Education & Research",
    tagline: "Full courses, open textbooks, and study tools.",
    description:
      "Universities, nonprofits, and volunteer communities that publish complete learning material for free, including lecture notes, problem sets, and openly licensed textbooks.",
    icon: "GraduationCap",
    subcategories: ["Courses & Curriculum", "Textbooks", "Memory & Practice"],
  },
  {
    id: "books-literature",
    name: "Books & Literature",
    tagline: "Public-domain ebooks, audiobooks, and library access.",
    description:
      "Legal reading for free: public-domain classics, volunteer-produced editions, open-content wikis, and apps that borrow from your existing public library card.",
    icon: "BookOpen",
    subcategories: ["Ebooks", "Audiobooks", "Poetry & Short Form", "Library Access"],
  },
  {
    id: "music-audio",
    name: "Music & Audio",
    tagline: "Free music libraries, radio, and open audio tools.",
    description:
      "Where to listen without breaking the law and tools to make your own sound: Creative Commons catalogs, internet radio, and fully open digital audio workstations.",
    icon: "Music",
    subcategories: ["Streaming & Radio", "Free & CC Libraries", "Production Tools"],
  },
  {
    id: "movies-video",
    name: "Movies & Video",
    tagline: "Legal free streaming, open players, and media tools.",
    description:
      "Ad-supported streaming platforms with licensed catalogs, public-domain film archives, and the open-source players, servers, and converters that handle any file you own.",
    icon: "Clapperboard",
    subcategories: ["Free Streaming", "Community Hosting", "Players & Media Centers", "Servers & Tools"],
  },
  {
    id: "gaming",
    name: "Gaming",
    tagline: "Complete open-source games and free indie picks.",
    description:
      "Games whose code and art carry licenses you can inspect, plus storefronts and compatibility tools for playing everything else legally on any platform.",
    icon: "Gamepad2",
    subcategories: ["Open-Source Games", "Free & Indie Games", "Launchers & Compatibility"],
  },
  {
    id: "creative-design",
    name: "Creative & Design",
    tagline: "Professional-grade creative tools at zero cost.",
    description:
      "Image editors, 3D suites, vector tools, and design platforms used by working professionals, plus libraries of openly licensed fonts, photos, and artwork.",
    icon: "Palette",
    subcategories: ["Image & Photo", "Vector, 3D & Print", "UI & Whiteboards", "Assets & Fonts", "Game Engines"],
  },
  {
    id: "writing-productivity",
    name: "Writing & Productivity",
    tagline: "Editors, notebooks, and research managers.",
    description:
      "From full office suites to Markdown knowledge bases and reference managers, tools that keep your documents in open formats you own.",
    icon: "PenLine",
    subcategories: ["Office Suites", "Notes & Knowledge", "Academic Writing", "Language Tools"],
  },
  {
    id: "web-internet",
    name: "Web & Internet Tools",
    tagline: "Documentation, hosting, and everyday web utilities.",
    description:
      "Reference documentation, static hosting, performance and accessibility auditors, and small utilities that solve one web problem well.",
    icon: "Globe",
    subcategories: ["Documentation & Standards", "Hosting & Performance", "Utilities"],
  },
  {
    id: "platform-tools",
    name: "Platform Tools",
    tagline: "The best free software per operating system.",
    description:
      "Package managers, updaters, and system utilities organized by platform: Linux distributions, Windows install and debloat tools, macOS helpers, and open-source Android apps.",
    icon: "MonitorSmartphone",
    subcategories: ["Linux", "Windows", "macOS", "Android", "iOS", "Command Line"],
  },
  {
    id: "science-reference",
    name: "Science & Reference",
    tagline: "Papers, data, and calculators for fact work.",
    description:
      "Open-access paper preprints, structured knowledge bases, question-and-answer networks, and calculation tools used by students and working researchers.",
    icon: "Microscope",
    subcategories: ["Papers & Preprints", "Encyclopedic Data", "Q&A Networks", "Math Tools", "Data & Reference"],
  },
  {
    id: "misc",
    name: "Everything Else",
    tagline: "Archives, independent search, and handy oddities.",
    description:
      "The cross-category shelf: the Internet Archive, curated awesome lists, independent search engines, and quick file tools that did not fit anywhere else.",
    icon: "Compass",
    subcategories: ["Archives", "Discovery & Search", "File Tools"],
  },
];

export const categoryMap: Record<CategoryId, Category> = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export const categoryIds = categories.map((c) => c.id);

export function getCategory(id: string): Category | undefined {
  return categoryMap[id as CategoryId];
}
