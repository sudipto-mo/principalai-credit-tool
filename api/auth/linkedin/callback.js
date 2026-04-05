/**
 * GET /api/auth/linkedin/callback — OAuth redirect handler (exchange code, set session cookie).
 *
 * Env: LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REDIRECT_URI, AUTH_SECRET
 */

const url = require("url");
const {
  SESSION_COOKIE,
  STATE_COOKIE,
  getCookie,
  signSession,
  buildSetCookie,
} = require("../../_lib/linkedin-session");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method Not Allowed");
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  const authSecret = process.env.AUTH_SECRET;
  const secure = req.headers["x-forwarded-proto"] === "https";

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
    return res.redirect(302, "/?linkedin_auth=error&reason=" + encodeURIComponent("Invalid OAuth state"));
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
    return res.redirect(302, "/?linkedin_auth=error&reason=" + encodeURIComponent("Token exchange failed"));
  }

  let profileRes;
  try {
    profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: "Bearer " + tokenJson.access_token },
    });
  } catch {
    res.setHeader("Set-Cookie", clearState);
    return res.redirect(302, "/?linkedin_auth=error&reason=" + encodeURIComponent("Profile request failed"));
  }

  const profileText = await profileRes.text();
  let profile;
  try {
    profile = JSON.parse(profileText);
  } catch {
    profile = {};
  }

  if (!profileRes.ok || !profile.sub) {
    res.setHeader("Set-Cookie", clearState);
    return res.redirect(302, "/?linkedin_auth=error&reason=" + encodeURIComponent("Profile unavailable"));
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

  const sessionToken = signSession(payload, authSecret);
  const sessionCookie = buildSetCookie(SESSION_COOKIE, sessionToken, {
    maxAge: 60 * 60 * 24 * 7,
    secure: secure,
  });

  res.setHeader("Set-Cookie", [clearState, sessionCookie]);
  return res.redirect(302, "/?linkedin_auth=success");
};
