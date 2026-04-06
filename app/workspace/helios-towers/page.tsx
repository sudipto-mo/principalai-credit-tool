import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "@/lib/linkedin-session";
import { creditWorkbenchPathname } from "@/lib/workbench-redirect";

export const metadata: Metadata = {
  title: "Helios Towers workspace | Principal AI",
  robots: { index: false, follow: false },
};

/** Opens in a new tab from the landing teaser; redirects to LinkedIn OAuth here if session is missing. */
export default async function HeliosTowersWorkspaceGatePage() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value ?? "";
  const secret = (process.env.AUTH_SECRET || "").trim();

  if (secret && token && verifySession(token, secret)) {
    redirect(`${creditWorkbenchPathname()}/`);
  }

  redirect("/api/auth/linkedin/authorize");
}
