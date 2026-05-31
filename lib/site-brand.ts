/** Product names — Dorrsum Advisory (this site) vs Portfolio Management (Fund Finance app). */

export const BRAND_WORDMARK = "DORRSUM";

/** Public marketing / research / credit site (principalai-credit-tool). */
export const DORRSUM_ADVISORY_NAME = "Dorrsum Advisory";

/** Client & household portfolio app (Fund Finance / portfolio-management). */
export const PORTFOLIO_MANAGEMENT_NAME = "Portfolio Management";

export function advisoryPageTitle(segment: string): string {
  return `${segment} | ${DORRSUM_ADVISORY_NAME}`;
}
