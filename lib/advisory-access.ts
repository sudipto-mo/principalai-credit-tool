/** Advisory is dev-only on Dorrsum Advisory; production serves 404 at `/advisory`. */
export function isAdvisoryEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}

/** Production CTAs fall back to contact while Advisory is WIP. */
export function getAdvisoryHref(): "/advisory" | "/contact" {
  return isAdvisoryEnabled() ? "/advisory" : "/contact";
}