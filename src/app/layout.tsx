import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Arvona: A hand-checked index of the free and open web",
    template: "%s | Arvona",
  },
  description:
    "A hand-checked directory of free and open-source software, public-domain media, learning platforms, and privacy tools. Every entry is verified, dated, and free of piracy. Maintained by Zynu and Shraddha.",
  keywords: [
    "arvona",
    "open source",
    "free software",
    "resource directory",
    "public domain",
    "privacy tools",
    "open access",
    "verified links",
  ],
  authors: [
    { name: "Zynu", url: "https://github.com/izynu" },
    { name: "Shraddha", url: "https://github.com/xhraddha" },
  ],
  creator: "Zynu",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Arvona",
    description:
      "A hand-checked index of the free and open web. 174 verified resources across 14 sections. No piracy, no paywall tricks, no filler.",
    type: "website",
    siteName: "Arvona",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

/**
 * Applies the persisted theme before first paint so the pure black
 * default never flashes the wrong colors. Arvona ships two themes:
 * dark (pure #000000, the default) and light.
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem('arvona-theme');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
        <noscript>
          <div
            style={{
              position: "fixed",
              inset: "auto 0 0 0",
              zIndex: 9999,
              padding: "12px 16px",
              backgroundColor: "#111113",
              color: "#fafafa",
              borderTop: "1px solid #2a2a2e",
              fontFamily: "system-ui, sans-serif",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            Arvona needs JavaScript for search, filters, and bookmarks. Enable
            scripts in this panel, or open the site in a full browser tab.
          </div>
        </noscript>
      </body>
    </html>
  );
}
