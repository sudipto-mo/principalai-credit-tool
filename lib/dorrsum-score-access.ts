/**
 * Access control for the Dorrsum Score page.
 *
 * Production gate:
 *   - If AUTH_SECRET is not set  → page is fully open (OAuth not configured).
 *   - If AUTH_SECRET is set and DORRSUM_SCORE_WHITELIST is NOT set → any signed-in user gets access.
 *   - If DORRSUM_SCORE_WHITELIST is set → only emails that appear in the comma-separated list get access.
 *
 * Development:
 *   - NODE_ENV=development always grants access so local work is frictionless.
 *
 * DORRSUM_SCORE_WHITELIST format (Vercel env var or .env.local):
 *   DORRSUM_SCORE_WHITELIST=alice@example.com,bob@acme.org
 */

/** Returns the normalised whitelist, or null if no whitelist is configured. */
function getWhitelist(): Set<string> | null {
  const raw = (process.env.DORRSUM_SCORE_WHITELIST || "").trim();
  if (!raw) return null;
  const emails = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return emails.length > 0 ? new Set(emails) : null;
}

export type AccessResult =
  | { granted: true }
  | { granted: false; reason: "unauthenticated" | "not_whitelisted" | "auth_not_configured" };

/**
 * Checks whether `email` should have full access to the Dorrsum Score page.
 *
 * Pass `null` for `email` when the visitor has no session.
 * Pass `undefined` when auth is not configured at all (AUTH_SECRET missing).
 */
export function checkDorrsumScoreAccess(
  email: string | null | undefined
): AccessResult {
  // Dev: always open.
  if (process.env.NODE_ENV === "development") return { granted: true };

  // Auth not configured at all (no AUTH_SECRET in env) → treat page as public.
  if (email === undefined) return { granted: true };

  // Not signed in.
  if (email === null) return { granted: false, reason: "unauthenticated" };

  const whitelist = getWhitelist();

  // No whitelist configured → any authenticated user is fine.
  if (!whitelist) return { granted: true };

  // Whitelist configured → check membership.
  return whitelist.has(email.toLowerCase())
    ? { granted: true }
    : { granted: false, reason: "not_whitelisted" };
}
