import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { isAdvisoryEnabled } from "@/lib/advisory-access";
import { paEditorialTitleModule } from "@/lib/editorial-typography";

export const metadata: Metadata = {
  title: "Helios Towers — Indicative Credit Brief",
  description:
    "Illustrative credit summary (financial, equity, and refinancing risk). Commissioned clients receive full institutional briefs, models, and covenant analysis.",
  openGraph: {
    title: "Helios Towers — Indicative Credit Brief",
    description:
      "Sample Dorrsum credit research: illustrative risk summary for qualified counterparties.",
  },
};

const body = "text-[15px] leading-relaxed text-[var(--pa-muted)] sm:text-base sm:leading-7";
const riskLabel = "text-sm font-bold text-[var(--pa-navy)] sm:text-[15px]";

export default async function HeliosTowersResearchPage() {
  return (
    <div className="min-h-full w-full bg-[var(--pa-page)] text-[var(--pa-text)]">
      <article className="relative mx-auto max-w-3xl px-5 pb-8 pt-10 sm:px-8 sm:pt-14 md:pt-16">
        <header className="mb-10 border-b border-[color:var(--pa-border)] pb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b8794]">
            {isAdvisoryEnabled() ? (
              <>
                <Link href="/advisory" className="no-underline text-[#7b8794] transition-colors hover:text-[var(--pa-navy)]">
                  ← Advisory
                </Link>
                {" · "}
              </>
            ) : null}
            Indicative Credit Brief
          </p>
          <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className={paEditorialTitleModule}>
              Helios Towers plc
            </h1>
            <span className="text-sm font-medium text-[#7b8794]">Telecom / Tower Infrastructure</span>
          </div>
          <p className="text-sm text-[#7b8794]">London · March 2026 · Excerpt for qualified counterparties only</p>
        </header>

        <div className="mb-2 flex flex-wrap items-center gap-2">
          <FileText className="h-5 w-5 shrink-0 text-[var(--pa-navy)]" aria-hidden />
          <h2
            id="teaser-summary-heading"
            className="m-0 text-lg font-extrabold uppercase tracking-[0.14em] text-[var(--pa-text)] sm:text-xl"
          >
            Summary{" "}
            <span className="normal-case font-extrabold tracking-[0.06em] text-[#7b8794]">( Illustrative )</span>
          </h2>
        </div>

        <section aria-labelledby="teaser-summary-heading" className="pb-2">
          <p className={`${riskLabel} mt-3`}>
            <strong className="font-bold">Financial Risk: Moderate</strong>
          </p>
          <p className={body}>
            Liquidity is strong; while cash flow generation has improved, enabling Helios to easily cover investment and
            debt servicing. It is targeting debt reduction; any significant reduction may prove difficult to achieve in the
            short term unless it sees further tenancy/margin improvement given the planned CAPEX.
          </p>
          <p className={`${riskLabel} mt-6`}>
            <strong className="font-bold">Equity Risk: High</strong>
          </p>
          <p className={body}>
            Given the low level of permanent equity and the lack of share price performance. Doubtful of its attractiveness
            to investors, thus equity refinancing is unlikely in short term.
          </p>
          <p className={`${riskLabel} mt-6`}>
            <strong className="font-bold">Refinancing Risk: Medium</strong>
          </p>
          <p className={body}>
            The $300M convertible bond maturing in 2027 requires a clear plan. If the stock price doesn&apos;t rise enough
            for investors to convert to shares, Helios must find cash or new loans.
          </p>
        </section>

        <div className="mt-10 border-t border-[color:var(--pa-border)] pt-8">
          <p className="text-sm leading-relaxed text-[var(--pa-muted)]">
            This note is an illustrative excerpt. The full institutional brief — financial reconstructions, covenant
            analysis, and debt serviceability models — is delivered on a commissioned mandate.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center justify-center rounded-sm border border-[var(--pa-navy)] bg-[var(--pa-navy)] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white no-underline transition-colors hover:bg-[var(--pa-navy-deep)]"
          >
            Commission a Mandate
          </Link>
        </div>
      </article>

    </div>
  );
}
