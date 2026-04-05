/**
 * POST /api/auth/logout — clear full-report session cookie
 */

const { SESSION_COOKIE, buildSetCookie } = require("../_lib/linkedin-session");

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secure = req.headers["x-forwarded-proto"] === "https";
  res.setHeader(
    "Set-Cookie",
    buildSetCookie(SESSION_COOKIE, "", { maxAge: 0, secure: secure })
  );
  return res.status(200).json({ ok: true });
};
