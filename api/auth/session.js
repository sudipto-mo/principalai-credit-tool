/**
 * GET /api/auth/session — JSON: configured, authenticated, optional name/email
 */

const { SESSION_COOKIE, getCookie, verifySession } = require("../_lib/linkedin-session");

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.AUTH_SECRET;
  const configured = !!(
    process.env.LINKEDIN_CLIENT_ID &&
    process.env.LINKEDIN_CLIENT_SECRET &&
    process.env.LINKEDIN_REDIRECT_URI &&
    secret
  );

  if (!configured) {
    return res.status(200).json({ configured: false, authenticated: false });
  }

  const token = getCookie(req, SESSION_COOKIE);
  const session = verifySession(token, secret);

  if (!session) {
    return res.status(200).json({ configured: true, authenticated: false });
  }

  return res.status(200).json({
    configured: true,
    authenticated: true,
    name: session.name || null,
    email: session.email || null,
  });
};
