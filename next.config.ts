import type { NextConfig } from "next";

/**
 * Arvona is a static-first site: one page, hash routing, no server code.
 * The build always produces a static export in ./out, which deploys to
 * GitHub Pages (or any static host) without rewrites.
 *
 * NEXT_PUBLIC_BASE_PATH controls the base path:
 *   - Project pages (izynu.github.io/arvona): set it to "/arvona"
 *   - Custom domain at the site root: leave it empty
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
