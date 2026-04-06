import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { SESSION_COOKIE, verifySession } from "@/lib/linkedin-session";
import { creditWorkbenchPathname } from "@/lib/workbench-redirect";

export const metadata: Metadata = {
  title: "Client Access | Principal AI",
  description: "Authenticate to access institutional credit briefs and deal screening models.",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value ?? "";
  const secret = (process.env.AUTH_SECRET || "").trim();
  if (secret && token && verifySession(token, secret)) {
    redirect(`${creditWorkbenchPathname()}/`);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:py-20 min-h-0">
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-10 max-w-md w-full mx-auto shadow-xl shadow-black/25">
        <div className="flex justify-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 text-blue-400">
            <ShieldCheck className="h-6 w-6" aria-hidden />
          </div>
        </div>
        <h1 className="text-2xl font-semibold mb-2 text-center text-slate-50">Client Access</h1>
        <p className="text-slate-400 text-sm text-center mb-8 m-0 leading-relaxed">
          Authenticate to access institutional credit briefs and deal screening models.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="/api/auth/linkedin/authorize"
            className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-sm font-semibold tracking-wide transition-colors no-underline shadow-[0_1px_0_rgba(0,0,0,0.15)] border border-black/10"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Sign in with LinkedIn
          </a>
          <a
            href="/api/auth/google/authorize"
            className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-sm font-semibold tracking-wide transition-colors no-underline border border-slate-200/80 shadow-sm"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </a>
        </div>

        <p className="text-xs text-slate-500 text-center mt-8 mb-0 leading-relaxed">
          After a successful sign-in you&apos;ll go straight to the credit professional&apos;s workbench on this domain.
        </p>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors no-underline inline-flex items-center gap-1"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
