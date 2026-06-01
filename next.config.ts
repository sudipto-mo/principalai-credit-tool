import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Pin workspace root so Turbopack does not pick up a parent lockfile (e.g. ~/package-lock.json). */
const repoRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: repoRoot,
  turbopack: {
    root: repoRoot,
  },
  /** Hides the dev-only “N” route indicator (bottom-left) so it never overlaps HUDs like the map legend. */
  devIndicators: false,
  /** Legacy score/PM paths — dev can forward to local Fund Finance; production → research hub. */
  async redirects() {
    const isDev = process.env.NODE_ENV === "development";
    const legacyScoreDest = isDev ? "/dorrsum-score" : "/research";
    const legacyPmDest = isDev ? "http://127.0.0.1:8081" : "/research";

    return [
      { source: "/open-portfolio", destination: legacyScoreDest, permanent: true },
      { source: "/open-portfolio/", destination: legacyScoreDest, permanent: true },
      { source: "/open-portfolio/index.html", destination: legacyScoreDest, permanent: true },
      { source: "/portfolio-management", destination: legacyPmDest, permanent: true },
      { source: "/portfolio-management/", destination: legacyPmDest, permanent: true },
      { source: "/research/digital-stock", destination: "/research/dc-infrastructure", permanent: true },
      { source: "/research/digital-stock/", destination: "/research/dc-infrastructure", permanent: true },
      {
        source: "/research/digital-stock/banking-rerating",
        destination: "/research/dc-infrastructure/banking-rerating",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
