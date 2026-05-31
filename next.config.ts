import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
