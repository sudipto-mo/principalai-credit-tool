import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Hides the dev-only “N” route indicator (bottom-left) so it never overlaps HUDs like the map legend. */
  devIndicators: false,
  /** Product URL uses `/dorrsum-score`; keep `/open-portfolio` as a permanent alias (not `index.html` — iframe needs that path). */
  async redirects() {
    return [
      { source: "/open-portfolio", destination: "/dorrsum-score", permanent: true },
      { source: "/open-portfolio/", destination: "/dorrsum-score", permanent: true },
    ];
  },
  /** Static universe HTML is updated often; default caching can leave users on stale JS/CSS in the iframe. */
  async headers() {
    return [
      {
        source: "/open-portfolio/index.html",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
