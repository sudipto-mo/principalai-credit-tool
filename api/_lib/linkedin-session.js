/**
 * Signed session cookie for LinkedIn-authenticated "full report" demo gate.
 * Uses Node crypto only (no dependencies).
 */

const crypto = require("crypto");

const SESSION_COOKIE = "pa_full_report";
const STATE_COOKIE = "pa_linkedin_oauth_state";

function getCookie(req, name) {
  const raw = req.headers.cookie;
  if (!raw) return "";
  const parts = raw.split(";");
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const idx = p.indexOf("=");
    if (idx === -1) continue;
    const k = p.slice(0, idx).trim();
    const v = p.slice(idx + 1).trim();
    if (k === name) {
      try {
        return decodeURIComponent(v);
      } catch {
        return v;
      }
    }
  }
  return "";
}

function signSession(payload, secret) {
  const data = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return data + "." + sig;
}

function verifySession(token, secret) {
  if (!token || typeof token !== "string") return null;
  const dot = token.indexOf(".");
  if (dot === -1) return null;
  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8"));
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

function buildSetCookie(name, value, opts) {
  const enc = value === "" ? "" : encodeURIComponent(value);
  const parts = [`${name}=${enc}`, "Path=/", "HttpOnly", "SameSite=Lax"];
  if (opts.maxAge != null) parts.push("Max-Age=" + opts.maxAge);
  if (opts.secure) parts.push("Secure");
  const domain = (process.env.SESSION_COOKIE_DOMAIN || "").trim().replace(/^\./, "");
  if (domain && /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i.test(domain)) {
    parts.push("Domain=" + domain);
  }
  return parts.join("; ");
}

module.exports = {
  SESSION_COOKIE,
  STATE_COOKIE,
  getCookie,
  signSession,
  verifySession,
  buildSetCookie,
};
