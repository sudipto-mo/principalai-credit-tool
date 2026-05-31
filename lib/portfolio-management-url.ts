/**
 * Client portfolio portal (Fund Finance PM — clients-only deploy).
 * Set NEXT_PUBLIC_PORTFOLIO_MANAGEMENT_URL in Vercel to your Render/host URL, e.g.
 * https://portfolio.dorrsum.com
 */

/** In-app path; `/portfolio-management` redirects when a URL is configured. */
export const PORTFOLIO_MANAGEMENT_PATH = "/portfolio-management";

export function resolvePortfolioManagementUrl(): string | null {
  const fromEnv = (process.env.NEXT_PUBLIC_PORTFOLIO_MANAGEMENT_URL || "").trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:8081";
  }

  return null;
}

/** Redirect target when env is set; fallback hostname for forced redirects. */
export function getPortfolioManagementUrl(): string {
  return resolvePortfolioManagementUrl() ?? "https://portfolio.dorrsum.com";
}
