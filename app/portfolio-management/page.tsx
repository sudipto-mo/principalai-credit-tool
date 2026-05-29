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
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-20 text-center">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b8794]">Client portal</p>
      <h1 className="mb-3 text-2xl font-semibold text-[var(--pa-navy)]">Portfolio Management</h1>
      <p className="mb-8 text-sm leading-relaxed text-[var(--pa-muted)]">
        The client portfolio app is not configured yet. Set{" "}
        <code className="rounded bg-[#faf8f2] px-1.5 py-0.5 text-[12px]">NEXT_PUBLIC_PORTFOLIO_MANAGEMENT_URL</code>{" "}
        in your hosting environment (e.g. your Render or subdomain URL).
      </p>
      <Link href="/" className="text-sm text-[var(--pa-link)] no-underline hover:underline">
        ← Back to home
      </Link>
      <p className="mt-6 text-[11px] text-[#7b8794]">{PORTFOLIO_MANAGEMENT_PATH}</p>
    </main>
  );
}
