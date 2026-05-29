import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PORTFOLIO_MANAGEMENT_PATH, resolvePortfolioManagementUrl } from "@/lib/portfolio-management-url";

export const metadata: Metadata = {
  title: "Portfolio Management | DORRSUM",
  description: "Client portfolio portal — sign in to view holdings, performance, and monitoring.",
  robots: { index: false, follow: false },
};

export default function PortfolioManagementPage() {
  const target = resolvePortfolioManagementUrl();
  if (target) {
    redirect(target);
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-20">
      <div className="text-center">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b8794]">Client portal</p>
        <h1 className="mb-3 text-2xl font-semibold text-[var(--pa-navy)]">Portfolio Management</h1>
        <p className="mb-10 text-sm leading-relaxed text-[var(--pa-muted)]">
          This page redirects to the hosted client portfolio app. It is not wired up yet on production.
        </p>
      </div>

      <ol className="mb-10 space-y-6 text-left text-sm leading-relaxed text-[var(--pa-text)]">
        <li className="rounded-sm border border-[color:var(--pa-border)] bg-white p-5">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8794]">Step 1</p>
          <p className="font-semibold text-[var(--pa-navy)]">Deploy the portfolio app (Node + SQLite)</p>
          <p className="mt-2 text-[var(--pa-muted)]">
            Vercel hosts dorrsum.com only. The client book runs separately on Render (or Railway) — e.g.{" "}
            <code className="rounded bg-[#faf8f2] px-1 py-0.5 text-[12px]">portfolio.dorrsum.com</code>.
            Use the Fund Finance repo with <code className="rounded bg-[#faf8f2] px-1 py-0.5 text-[12px]">render.yaml</code>{" "}
            and Google OAuth env vars.
          </p>
        </li>
        <li className="rounded-sm border border-[color:var(--pa-border)] bg-white p-5">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8794]">Step 2</p>
          <p className="font-semibold text-[var(--pa-navy)]">Point dorrsum.com at that URL</p>
          <p className="mt-2 text-[var(--pa-muted)]">
            Vercel → dorrsum project → <strong>Environment Variables</strong> → add
          </p>
          <p className="mt-2 rounded bg-[#faf8f2] px-3 py-2 font-mono text-[12px]">
            NEXT_PUBLIC_PORTFOLIO_MANAGEMENT_URL=https://portfolio.dorrsum.com
          </p>
          <p className="mt-2 text-[var(--pa-muted)]">Use your real PM hostname (no trailing slash).</p>
        </li>
        <li className="rounded-sm border border-[color:var(--pa-border)] bg-white p-5">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8794]">Step 3</p>
          <p className="font-semibold text-[var(--pa-navy)]">Redeploy dorrsum on Vercel</p>
          <p className="mt-2 text-[var(--pa-muted)]">
            Deployments → Redeploy (required — <code className="text-[12px]">NEXT_PUBLIC_*</code> vars are baked in at
            build time). After that, this tab opens the live portal with Google sign-in.
          </p>
        </li>
      </ol>

      <p className="text-center">
        <Link href="/" className="text-sm text-[var(--pa-link)] no-underline hover:underline">
          ← Back to home
        </Link>
      </p>
    </main>
  );
}
