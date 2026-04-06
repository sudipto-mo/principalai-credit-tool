import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCookieHeader } from "@/lib/http-cookies";
import { SESSION_COOKIE } from "@/lib/oauth-cookie-names";
import { verifySessionEdge } from "@/lib/session-edge";
import { creditWorkbenchPathname } from "@/lib/workbench-redirect";

/**
 * Skip the login screen when the session cookie is already valid (zero-click return).
 * OAuth uses Next.js API routes + signed cookies, not Supabase Auth.
 */
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/login") {
    return NextResponse.next();
  }

  const secret = (process.env.AUTH_SECRET || "").trim();
  if (!secret) {
    return NextResponse.next();
  }

  const token = getCookieHeader(request.headers.get("cookie"), SESSION_COOKIE);
  if (!token) {
    return NextResponse.next();
  }

  const session = await verifySessionEdge(token, secret);
  if (!session) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `${creditWorkbenchPathname()}/`;
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/login"],
};
