/** Dorrsum Score is dev-only on Dorrsum Advisory; production serves 404 at `/dorrsum-score`. */
export function isDorrsumScoreOnAdvisoryEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Canonical Dorrsum Score URL — Portfolio Management app (Fund Finance), not this site.
 * Only used when {@link isDorrsumScoreOnAdvisoryEnabled} (local dev redirect).
 */
export function getDorrsumScoreUrl(): string {
  if (!isDorrsumScoreOnAdvisoryEnabled()) {
    return "/research";
  }
  const fromEnv = (process.env.NEXT_PUBLIC_DORRSUM_SCORE_URL || "").trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:8081/dorrsum-score/index.html";
  }

  const pm = (process.env.NEXT_PUBLIC_PORTFOLIO_MANAGEMENT_URL || "").trim();
  if (pm) {
    return `${pm.replace(/\/$/, "")}/dorrsum-score/index.html`;
  }

  return "https://portfolio.dorrsum.com/dorrsum-score/index.html";
}
