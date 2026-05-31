/** Dorrsum Score is dev-only on Dorrsum Advisory; production serves 404 at `/dorrsum-score`. */
export function isDorrsumScoreOnAdvisoryEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}

/** Local dev redirect to Fund Finance PM app (separate repo). */
export function getDorrsumScoreUrl(): string {
  if (!isDorrsumScoreOnAdvisoryEnabled()) {
    return "/research";
  }

  const fromEnv = (process.env.NEXT_PUBLIC_DORRSUM_SCORE_URL || "").trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  return "http://127.0.0.1:8081/dorrsum-score/index.html";
}
