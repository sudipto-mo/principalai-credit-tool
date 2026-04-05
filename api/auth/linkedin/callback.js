/**
 * GET /api/auth/linkedin/callback — OAuth redirect handler (exchange code, set session cookie).
 *
 * Env: LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI, AUTH_SECRET
 * Optional: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY — logs sign-ins to table linkedin_sign_ins
 */

const url = require("url");
const {
  SESSION_COOKIE,
  STATE_COOKIE,
  getCookie,
  signSession,
  buildSetCookie,
} = require("../../_lib/linkedin-session");
const { logLinkedInSignIn } = require("../../_lib/supabase-signin-log");

function decodeJwtPayload(jwt) {
  if (!jwt || typeof jwt !== "string") return null;
  const parts = jwt.split(".");
  if (parts.length < 2) return null;
  try {
    return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function trimEnv(s) {
  return typeof s === "string" ? s.trim() : "";
}

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method Not Allowed");
  }

  const clientId = trimEnv(process.env.LINKEDIN_CLIENT_ID);
  const clientSecret = trimEnv(process.env.LINKEDIN_CLIENT_SECRET);
  const redirectUri = trimEnv(process.env.LINKEDIN_REDIRECT_URI);
  const authSecret = trimEnv(process.env.AUTH_SECRET);
  const xf = (req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const secure = xf === "https";

  const clearState = buildSetCookie(STATE_COOKIE, "", { maxAge: 0, secure });

  if (!clientId || !clientSecret || !redirectUri || !authSecret) {
    res.setHeader("Set-Cookie", clearState);
    return res.redirect(302, "/?linkedin_auth=missing_config");
  }

  const parsed = url.parse(req.url, true);
  const q = parsed.query || {};

  if (q.error) {
    res.setHeader("Set-Cookie", clearState);
    const msg = typeof q.error_description === "string" ? q.error_description : String(q.error);
    return res.redirect(302, "/?linkedin_auth=error&reason=" + encodeURIComponent(msg.slice(0, 200)));
  }

  const code = q.code;
  const state = q.state;
  const saved = getCookie(req, STATE_COOKIE);

  if (!code || !state || !saved || state !== saved) {
    res.setHeader("Set-Cookie", clearState);
    return res.redirect(
      302,
      "/?linkedin_auth=error&reason=" +
        encodeURIComponent(
          "Invalid OAuth state (cookie missing or mismatch). Common fix: use one site URL (www OR apex), match LINKEDIN_REDIRECT_URI + LinkedIn redirect, or set SESSION_COOKIE_DOMAIN=yourdomain.com in Vercel."
        )
    );
  }

  let tokenRes;
  try {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: String(code),
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });
    tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
  } catch (e) {
    res.setHeader("Set-Cookie", clearState);
    return res.redirect(302, "/?linkedin_auth=error&reason=" + encodeURIComponent("Token request failed"));
  }

  const tokenText = await tokenRes.text();
  let tokenJson;
  try {
    tokenJson = JSON.parse(tokenText);
  } catch {
    tokenJson = {};
  }

  if (!tokenRes.ok || !tokenJson.access_token) {
    res.setHeader("Set-Cookie", clearState);
    const liErr =
      trimEnv(tokenJson.error_description) ||
      trimEnv(tokenJson.error) ||
      tokenText.replace(/\s+/g, " ").slice(0, 280).trim() ||
      "Token exchange failed";
    return res.redirect(302, "/?linkedin_auth=error&reason=" + encodeURIComponent(liErr));
  }

  let profile = {};
  let profileRes;
  try {
    profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: "Bearer " + tokenJson.access_token },
    });
    const profileText = await profileRes.text();
    try {
      profile = JSON.parse(profileText);
    } catch {
      profile = {};
    }
  } catch {
    profile = {};
  }

  if (!profile.sub && typeof tokenJson.id_token === "string") {
    const claims = decodeJwtPayload(tokenJson.id_token);
    if (claims && claims.sub) profile = claims;
  }

  if (!profile.sub) {
    res.setHeader("Set-Cookie", clearState);
    const detail =
      profileRes && !profileRes.ok
        ? "userinfo " + profileRes.status + " (enable OpenID product + openid profile email scopes)"
        : "No subject in profile or id_token";
    return res.redirect(302, "/?linkedin_auth=error&reason=" + encodeURIComponent(detail));
  }

  const now = Math.floor(Date.now() / 1000);
  const exp = now + 60 * 60 * 24 * 7;
  const payload = {
    sub: String(profile.sub),
    name: typeof profile.name === "string" ? profile.name : "",
    email: typeof profile.email === "string" ? profile.email : "",
    iat: now,
    exp: exp,
  };

  const fwdFor = trimEnv(req.headers["x-forwarded-for"]);
  const clientIp = fwdFor ? fwdFor.split(",")[0].trim() : trimEnv(req.headers["x-real-ip"]);
  await logLinkedInSignIn({
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    userAgent: typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"] : "",
    ip: clientIp,
  });

  const sessionToken = signSession(payload, authSecret);
  const sessionCookie = buildSetCookie(SESSION_COOKIE, sessionToken, {
    maxAge: 60 * 60 * 24 * 7,
    secure: secure,
  });

  res.setHeader("Set-Cookie", [clearState, sessionCookie]);
  return res.redirect(302, "/?linkedin_auth=success");
};
