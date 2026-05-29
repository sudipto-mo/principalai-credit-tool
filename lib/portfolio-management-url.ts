/**
 * Client portfolio portal (Fund Finance PM — clients-only deploy).
 * Set NEXT_PUBLIC_PORTFOLIO_MANAGEMENT_URL in Vercel to your Render/host URL, e.g.
 * https://portfolio.dorrsum.com
 */

export function resolvePortfolioManagementUrl(): string | null {
  const fromEnv = (process.env.NEXT_PUBLIC_PORTFOLIO_MANAGEMENT_URL || "").trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:8003";
  }

  return null;
}

/** In-app path; `/portfolio-management` redirects to the resolved URL. */
export const PORTFOLIO_MANAGEMENT_PATH = "/portfolio-management";
