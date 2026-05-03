/**
 * Access control for the Dorrsum Score page.
 *
 * Check order (first match wins):
 *  1. NODE_ENV=development  → always granted (local dev is frictionless)
 *  2. AUTH_SECRET not set   → page is public (OAuth not configured)
 *  3. Supabase whitelist table `dorrsum_score_whitelist` (if SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set)
 *  4. DORRSUM_SCORE_WHITELIST env var (comma-separated fallback)
 *  5. If neither whitelist source is configured → any authenticated user is granted
 *
 * Managing access:
 *   • Preferred: Supabase Dashboard → Table Editor → dorrsum_score_whitelist → insert/delete rows
 *   • Fallback:  Vercel env var DORRSUM_SCORE_WHITELIST=email1@x.com,email2@y.com
 */

import { getSupabaseServiceConfig } from "@/lib/supabase-admin";

export type AccessResult =
  | { granted: true }
  | { granted: false; reason: "unauthenticated" | "not_whitelisted" | "auth_not_configured" };

/** Check Supabase `dorrsum_score_whitelist` table. Returns null if Supabase is not configured. */
async function checkSupabaseWhitelist(email: string): Promise<boolean | null> {
  const cfg = getSupabaseServiceConfig();
  if (!cfg) return null;

  try {
    const url =
      `${cfg.url}/rest/v1/dorrsum_score_whitelist` +
      `?email=eq.${encodeURIComponent(email.toLowerCase())}&active=eq.true&select=id&limit=1`;

    const res = await fetch(url, {
      headers: {
        apikey: cfg.key,
        Authorization: "Bearer " + cfg.key,
        Accept: "application/json",
      },
      // Don't cache — access changes must take effect immediately
      cache: "no-store",
    });

    if (!res.ok) {
      // Table may not exist yet; fall through to env-var check
      console.warn("[dorrsum-score-access] Supabase query failed:", res.status);
      return null;
    }

    const rows = (await res.json()) as unknown[];
    return Array.isArray(rows) && rows.length > 0;
  } catch (e) {
    console.warn("[dorrsum-score-access] Supabase error:", e instanceof Error ? e.message : String(e));
    return null;
  }
}

/** Returns the normalised env-var whitelist, or null if not configured. */
function getEnvWhitelist(): Set<string> | null {
  const raw = (process.env.DORRSUM_SCORE_WHITELIST || "").trim();
  if (!raw) return null;
  const emails = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return emails.length > 0 ? new Set(emails) : null;
}

/**
 * Checks whether `email` should have full access to the Dorrsum Score page.
 *
 * Pass `null`      when the visitor has no active session.
 * Pass `undefined` when AUTH_SECRET is missing (OAuth not configured at all).
 */
export async function checkDorrsumScoreAccess(
  email: string | null | undefined
): Promise<AccessResult> {
  // 1. Dev: always open.
  if (process.env.NODE_ENV === "development") return { granted: true };

  // 2. Auth not configured → treat page as public.
  if (email === undefined) return { granted: true };

  // 3. Not signed in.
  if (email === null) return { granted: false, reason: "unauthenticated" };

  const normalised = email.toLowerCase();

  // 4. Supabase table (primary — managed via dashboard).
  const supabaseResult = await checkSupabaseWhitelist(normalised);
  if (supabaseResult !== null) {
    // Supabase is configured and responded — its answer is authoritative.
    return supabaseResult ? { granted: true } : { granted: false, reason: "not_whitelisted" };
  }

  // 5. Env-var fallback.
  const envList = getEnvWhitelist();
  if (envList !== null) {
    return envList.has(normalised)
      ? { granted: true }
      : { granted: false, reason: "not_whitelisted" };
  }

  // 6. No whitelist configured at all → any authenticated user is fine.
  return { granted: true };
}
