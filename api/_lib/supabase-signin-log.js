/**
 * Append-only sign-in log via Supabase PostgREST (no @supabase/supabase-js dependency).
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Safe to omit — login still works.
 *
 * SUPABASE_URL may be the full API URL (https://…supabase.co) or a bare project ref
 * (Vercel env sometimes gets only the ref — fetch() needs a valid absolute URL).
 */

function trimEnv(s) {
  return typeof s === "string" ? s.trim() : "";
}

/** @param {string} raw */
function normalizeSupabaseBaseUrl(raw) {
  let s = trimEnv(raw);
  if (!s) return "";
  s = s.replace(/\/+$/, "");
  if (/^https?:\/\//i.test(s)) return s;
  s = s.replace(/^\/+/, "");
  if (s.includes(".")) return `https://${s}`;
  if (/^[a-z0-9_-]+$/i.test(s)) return `https://${s}.supabase.co`;
  return s;
}

/**
 * @param {{ sub: string, email?: string, name?: string, userAgent?: string, ip?: string }} row
 */
async function logLinkedInSignIn(row) {
  const base = normalizeSupabaseBaseUrl(process.env.SUPABASE_URL);
  const key = trimEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!base || !key || !row.sub) {
    return;
  }

  const url = `${base}/rest/v1/linkedin_sign_ins`;
  const body = {
    linkedin_sub: String(row.sub).slice(0, 512),
    email: row.email ? String(row.email).slice(0, 512) : null,
    name: row.name ? String(row.name).slice(0, 512) : null,
    user_agent: row.userAgent ? String(row.userAgent).slice(0, 2000) : null,
    ip: row.ip ? String(row.ip).slice(0, 128) : null,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: "Bearer " + key,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text();
      console.warn("[linkedin_sign_ins]", res.status, t.slice(0, 300));
    } else {
      console.info("[linkedin_sign_ins] insert ok");
    }
  } catch (e) {
    console.warn("[linkedin_sign_ins]", String(e && e.message ? e.message : e));
  }
}

module.exports = { logLinkedInSignIn };
