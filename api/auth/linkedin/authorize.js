/**
 * GET /api/auth/linkedin/authorize — start LinkedIn OAuth (Sign in with LinkedIn using OpenID Connect).
 *
 * Env: LINKEDIN_CLIENT_ID, LINKEDIN_REDIRECT_URI (must match LinkedIn app), AUTH_SECRET
 */

const crypto = require("crypto");
const { STATE_COOKIE, buildSetCookie } = require("../../_lib/linkedin-session");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method Not Allowed");
  }

  const clientId = (process.env.LINKEDIN_CLIENT_ID || "").trim();
  const redirectUri = (process.env.LINKEDIN_REDIRECT_URI || "").trim();
  const authSecret = (process.env.AUTH_SECRET || "").trim();

  if (!clientId || !redirectUri || !authSecret) {
    return res.redirect(302, "/?linkedin_auth=missing_config");
  }

  const state = crypto.randomBytes(24).toString("hex");
  const xf = (req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const secure = xf === "https";
  res.setHeader("Set-Cookie", buildSetCookie(STATE_COOKIE, state, { maxAge: 600, secure }));

  const url = new URL("https://www.linkedin.com/oauth/v2/authorization");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", "openid profile email");

  res.redirect(302, url.toString());
};
