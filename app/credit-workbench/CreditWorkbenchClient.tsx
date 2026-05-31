"use client";

import Link from "next/link";
import { isAdvisoryEnabled } from "@/lib/advisory-access";

/**
 * Main marketing nav is hidden on this route ({@link ConditionalSiteNavbar}).
 * The strip gives a clear way back to the rest of the site.
 */
export default function CreditWorkbenchClient() {
  return (
    <div className="flex min-h-0 min-h-[100dvh] flex-1 flex-col">
      <nav
        className="flex shrink-0 items-center gap-4 border-b border-[color:var(--pa-border)] bg-[var(--pa-page)] px-4 py-2.5"
        aria-label="Credit desk"
      >
        <Link
          href="/"
          className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--pa-navy)] no-underline transition-colors hover:text-[var(--pa-navy-deep)]"
        >
          ← Home
        </Link>
        <Link
          href="/research"
          className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#7b8794] no-underline transition-colors hover:text-[var(--pa-navy)]"
        >
          Research
        </Link>
        {isAdvisoryEnabled() ? (
          <Link
            href="/advisory"
            className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#7b8794] no-underline transition-colors hover:text-[var(--pa-navy)]"
          >
            Advisory
          </Link>
        ) : null}
      </nav>
      <iframe
        title="Institutional Credit Desk"
        src="/credit-workbench/index.html?embed=1"
        className="min-h-0 w-full flex-1 border-0 bg-[#0B0F19]"
      />
    </div>
  );
}
