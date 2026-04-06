import { NextRequest, NextResponse } from "next/server";

/** Path to static credit draft (default `/credit-workbench`). Override with NEXT_PUBLIC_CREDIT_WORKBENCH_PATH */
export function creditWorkbenchPathname(): string {
  const p = (process.env.NEXT_PUBLIC_CREDIT_WORKBENCH_PATH || "/credit-workbench").trim() || "/credit-workbench";
  const noTrail = p.replace(/\/+$/, "");
  return noTrail.startsWith("/") ? noTrail : "/" + noTrail;
}

/**
 * Path users land on after OAuth completes (success / error / config flash via query).
 * Defaults to {@link creditWorkbenchPathname} (live workbench). Override with OAUTH_SUCCESS_REDIRECT.
 */
export function oauthSuccessRedirectPath(): string {
  const raw = (process.env.OAUTH_SUCCESS_REDIRECT || "").trim();
  if (raw) return raw.startsWith("/") ? raw : "/" + raw;
  return creditWorkbenchPathname();
}

/**
 * Redirect after OAuth flow with query params (e.g. oauth_auth=success).
 * Uses OAUTH_SUCCESS_REDIRECT; legacy name kept for imports across API routes.
 */
export function redirectToWorkbench(request: NextRequest, params: Record<string, string>): NextResponse {
  const path = oauthSuccessRedirectPath();
  const u = new URL(path, request.url);
  for (const [k, v] of Object.entries(params)) {
    u.searchParams.set(k, v);
  }
  return NextResponse.redirect(u);
}
