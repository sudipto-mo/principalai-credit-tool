import Link from "next/link";
import { paEditorialTitleMarketing } from "@/lib/editorial-typography";

export const metadata = {
  title: "Institutional Credit Desk",
};

export default function CreditWorkbenchProductPage() {
  return (
    <div className="w-full max-w-3xl">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b8794]">Client Platform</p>
      <h1 className={paEditorialTitleMarketing}>Institutional Credit Desk</h1>
      <p className="m-0 mb-8 text-base leading-[1.8] text-[var(--pa-muted)] sm:text-lg">
        Structured credit memoranda, screened metrics, and analyst-reviewed workflows for digital infrastructure
        mandates. Quantitative outputs remain subject to investment judgment and committee verification.
      </p>
      <p className="mb-8">
        <Link
          href="/credit-workbench"
          className="inline-flex items-center justify-center rounded-sm border border-[var(--pa-navy)] bg-[var(--pa-navy)] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white no-underline transition-colors hover:bg-[var(--pa-navy-deep)]"
        >
          Open Credit Desk
        </Link>
      </p>
      <div className="mb-8 rounded-sm border border-[color:var(--pa-border)] bg-white p-6">
        <h2 className="m-0 mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b8794]">Authentication</h2>
        <p className="m-0 text-sm leading-relaxed text-[var(--pa-muted)]">
          Full-report actions use LinkedIn and/or Google OAuth where configured. API routes live under{" "}
          <code className="rounded border border-[color:var(--pa-border)] bg-[#faf8f2] px-1.5 py-0.5 text-xs text-[var(--pa-text)]">
            /api/auth/
          </code>{" "}
          on the same host.
        </p>
      </div>
      <p className="m-0">
        <Link href="/products" className="text-sm font-medium text-[var(--pa-link)] no-underline hover:text-[var(--pa-link-hover)]">
          ← All products
        </Link>
      </p>
    </div>
  );
}
