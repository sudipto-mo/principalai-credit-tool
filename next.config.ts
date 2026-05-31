import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Hides the dev-only “N” route indicator (bottom-left) so it never overlaps HUDs like the map legend. */
  devIndicators: false,
  /** Legacy open-portfolio URLs — dev forwards to local PM; production returns to research hub. */
  async redirects() {
    const legacyOpenPortfolioDest =
      process.env.NODE_ENV === "development" ? "/dorrsum-score" : "/research";

    return [
      { source: "/open-portfolio", destination: legacyOpenPortfolioDest, permanent: true },
      { source: "/open-portfolio/", destination: legacyOpenPortfolioDest, permanent: true },
      { source: "/open-portfolio/index.html", destination: legacyOpenPortfolioDest, permanent: true },
    ];
  },
};

export default nextConfig;
