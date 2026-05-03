import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { getVerifiedSessionPayload } from "@/lib/get-session";
import { anyOAuthReady } from "@/lib/auth-oauth-config";
import { checkDorrsumScoreAccess } from "@/lib/dorrsum-score-access";

export const metadata: Metadata = {
  title: "Dorrsum Score — DORRSUM",
  description:
    "A live, public portfolio of global TMT and digital infrastructure equities. Real fills, full transparency, updated daily.",
};

export default async function DorrsumScorePage() {
  const authConfigured = anyOAuthReady();

  // Resolve identity: undefined = auth not set up, null = not signed in, string = email
  let email: string | null | undefined;
  if (!authConfigured) {
    email = undefined; // no gate possible
  } else {
    const session = await getVerifiedSessionPayload();
    email = session?.email ?? null;
  }

  const access = await checkDorrsumScoreAccess(email);

  if (access.granted) {
    return (
      <div className="flex min-h-0 min-h-[100dvh] flex-1 flex-col bg-[var(--pa-page)]">
        <iframe
          title="Dorrsum Score"
          src="/open-portfolio/index.html?embed=1"
          className="min-h-0 w-full flex-1 border-0 bg-[var(--pa-page)]"
        />
      </div>
    );
  }

  // ── Teaser / gate wall ────────────────────────────────────────────────────
  const returnTo = encodeURIComponent("/dorrsum-score");
  const loginHref =
    access.reason === "not_whitelisted"
      ? null // signed in but not on the list — no point re-logging in
      : `/login?returnTo=${returnTo}`;

  return (
    <div className="flex min-h-0 min-h-[100dvh] flex-1 flex-col items-center justify-start bg-[var(--pa-page)] px-5 py-16 sm:py-24">

      {/* ── Teaser content — visible to everyone ─────────────────────────── */}
      <div className="mx-auto w-full max-w-2xl">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#7b8794]">
          Dorrsum Score
        </p>
        <h1 className="mb-5 text-[28px] font-bold leading-[1.15] tracking-[-0.01em] text-[var(--pa-navy)] sm:text-[36px]">
          The Digital Infrastructure Universe
        </h1>
        <p className="mb-5 text-base leading-[1.8] text-[var(--pa-muted)] sm:text-lg">
          A live, public-markets view of the full digital infrastructure supply chain — roughly 150 names across
          Silicon, Build-Out, Energy, Connectivity, and Compute — scored daily on Value, Growth, Profitability,
          Momentum, EPS Revisions, and Financial Strength.
        </p>
        <p className="mb-8 text-base leading-[1.8] text-[var(--pa-muted)] sm:text-lg">
          Each ticker carries a composite letter grade and a factor breakdown so you can see exactly{" "}
          <em>why</em> a name ranks where it does — not just a number, but a forensic view of the
          underlying credit and equity signals.
        </p>

        {/* Feature bullets */}
        <ul className="mb-10 space-y-3 border-l-2 border-[color:var(--pa-border)] pl-5 text-sm text-[var(--pa-text)]">
          {[
            "Daily-refreshed prices, market cap, P/E, and trailing returns for every name",
            "Factor grades: Value · Growth · Profitability · Momentum · EPS Revisions · Financial Strength",
            "Screen by Exchange, Region, Band, or search free-form across the full universe",
            "Click any ticker for a full score X-ray drawer with threshold tables and analyst revisions",
            "Holdings flag: filter to our live portfolio positions at any time",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 leading-relaxed">
              <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pa-navy)]" />
              {item}
            </li>
          ))}
        </ul>

        {/* ── Gate wall ────────────────────────────────────────────────────── */}
        <div className="rounded-sm border border-[color:var(--pa-border)] bg-white px-8 py-8 shadow-[0_12px_32px_rgba(31,36,48,0.07)]">
          <div className="mb-5 flex justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-[color:var(--pa-border)] bg-[#faf8f2] text-[var(--pa-navy)]">
              <Lock className="h-5 w-5" aria-hidden />
            </div>
          </div>

          {access.reason === "not_whitelisted" ? (
            <>
              <h2 className="mb-2 text-center text-xl font-semibold text-[var(--pa-navy)]">
                Access by invitation only
              </h2>
              <p className="mb-6 text-center text-sm leading-relaxed text-[var(--pa-muted)]">
                You are signed in as <strong className="text-[var(--pa-text)]">{email}</strong>, but this
                account is not yet on the access list. Request access below and we will be in touch.
              </p>
              <a
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-sm border border-[var(--pa-navy)] bg-[var(--pa-navy)] px-4 py-3.5 text-sm font-semibold tracking-wide text-white no-underline transition-colors hover:bg-[var(--pa-navy-deep)]"
              >
                Request access
              </a>
            </>
          ) : (
            <>
              <h2 className="mb-2 text-center text-xl font-semibold text-[var(--pa-navy)]">
                Access by invitation only
              </h2>
              <p className="mb-6 text-center text-sm leading-relaxed text-[var(--pa-muted)]">
                Sign in with your invited account to access the full Dorrsum Score universe, or{" "}
                <Link href="/contact" className="text-[var(--pa-navy)] underline underline-offset-2">
                  request access
                </Link>{" "}
                if you don&apos;t have one yet.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href={`/api/auth/google/authorize?returnTo=${returnTo}`}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-sm border border-[color:var(--pa-border)] bg-[#faf8f2] px-4 py-3.5 text-sm font-semibold tracking-wide text-[var(--pa-text)] no-underline transition-colors hover:bg-[#f2eee5]"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </a>
                <a
                  href={`/api/auth/linkedin/authorize?returnTo=${returnTo}`}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-sm border border-[#0a66c2] bg-[#0a66c2] px-4 py-3.5 text-sm font-semibold tracking-wide text-white no-underline transition-colors hover:bg-[#004182]"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Continue with LinkedIn
                </a>
              </div>
            </>
          )}

          <p className="mt-6 text-center text-[11px] leading-relaxed text-[#7b8794]">
            Access is managed by invitation. Approved accounts get full access upon sign-in.
          </p>
        </div>
      </div>
    </div>
  );
}
