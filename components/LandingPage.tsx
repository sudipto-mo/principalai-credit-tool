import type { ReactNode } from "react";
import HeroPreview from "@/components/HeroPreview";
import { HERO_MARKETING } from "@/lib/hero-marketing";

const equityResearchItems = [
  "Reverse-DCF and mispricing calls",
  "Lease-up economics and tenancy ratio analysis",
  "Variant-perception research notes — selected outputs from the tower model",
] as const;

const trendIntelligenceItems = [
  "Physical-stack constraint reads — power, land, silicon",
  "AI capex cycle and demand signals",
  "Data centre and AI-infra thesis — forward-looking research stream",
] as const;

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b7280]">{children}</p>
  );
}

function ResearchCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="flex h-full flex-col rounded-[4px] border border-[color:var(--pa-border)] bg-white p-7">
      <h3 className="text-xl font-semibold tracking-tight text-[var(--pa-navy)]">{title}</h3>
      {children}
    </article>
  );
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7b8794]">{label}</p>
      <p className="mt-2 text-sm text-[var(--pa-text)]">{value}</p>
    </div>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--pa-muted)]">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#7b8794]" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-full w-full bg-[var(--pa-page)] text-[var(--pa-text)]">
      <HeroPreview />

      <section
        aria-label="Method"
        className="border-b border-[color:var(--pa-border)] bg-white"
      >
        <div className="mx-auto max-w-4xl px-5 py-8 text-center sm:px-6 md:py-10">
          <p className="font-[family-name:var(--font-mono-brand)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--pa-navy)] sm:text-[12px]">
            {HERO_MARKETING.methodStrip}
          </p>
        </div>
      </section>

      <section id="the-commitment" className="scroll-mt-24 border-b border-[color:var(--pa-border)] bg-[var(--pa-band)]">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-6 md:py-20">
          <SectionEyebrow>What We Believe</SectionEyebrow>
          <p className="font-serif-display mt-8 text-3xl font-light leading-[1.22] text-[var(--pa-navy)] sm:text-4xl md:text-[2.5rem]">
            The market prices the AI narrative. We price the physical layer beneath it.{" "}
            <span className="italic text-[var(--pa-signature)]">That&apos;s where the calls are.</span>
          </p>
        </div>
      </section>

      <section id="how-we-value" className="scroll-mt-24 border-b border-[color:var(--pa-border)] bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-6 md:py-20">
          <SectionEyebrow>How We Value</SectionEyebrow>
          <p className="mt-8 text-[15px] leading-relaxed text-[var(--pa-muted)] sm:text-base sm:leading-7">
            We build decision-grade models — three-statement, DCF, reverse-DCF, LBO, debt sizing — and apply them to the
            capital decisions that matter: M&A, private equity, private credit, and equity valuation.
          </p>
          <ul className="mt-8 space-y-4 text-sm leading-relaxed text-[var(--pa-muted)] sm:text-[15px] sm:leading-7">
            <li className="flex gap-3">
              <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#7b8794]" aria-hidden />
              <span>
                <strong className="font-semibold text-[var(--pa-text)]">Full operating models.</strong> Three-statement
                build, capex and capacity ramp, scenario and sensitivity analysis — carried through to a defensible
                value or credit position, not a headline multiple.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#7b8794]" aria-hidden />
              <span>
                <strong className="font-semibold text-[var(--pa-text)]">Reverse-DCF first.</strong> We back out the
                growth and margin the market is already pricing, then test it against permitted power, shipping silicon,
                and available land. The gap is the call.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#7b8794]" aria-hidden />
              <span>
                <strong className="font-semibold text-[var(--pa-text)]">Across the capital stack.</strong> The same
                modelling craft — pro-forma accretion, LBO returns, debt sizing and covenant analysis, equity value —
                applied wherever the decision sits.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#7b8794]" aria-hidden />
              <span>
                <strong className="font-semibold text-[var(--pa-text)]">Practitioner-grade.</strong> Methodology
                consistent with institutional standards; every assumption sourced, every scenario stress-tested.
              </span>
            </li>
          </ul>
          <p className="mt-8 text-sm italic leading-relaxed text-[var(--pa-muted)] sm:text-[15px] sm:leading-7">
            Flagship showcase: a ground-up equity valuation of a telecom tower company — site portfolio, tenancy ratios,
            lease-up economics, reverse-DCF and mispricing call.
          </p>
        </div>
      </section>

      <section id="financial-modelling-research" className="scroll-mt-24 border-b border-[color:var(--pa-border)] bg-[var(--pa-band)]">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-6 md:py-20">
          <h2 className="text-center">
            <SectionEyebrow>Financial Modelling &amp; Research</SectionEyebrow>
          </h2>

          <div className="mx-auto mt-10">
            <ResearchCard title="Financial Modelling Advisory">
              <p className="mt-4 text-sm leading-relaxed text-[var(--pa-muted)]">
                We build the model. Clients get the full three-statement build, reverse-DCF, LBO, debt sizing, and
                scenario analysis — carried through to a defensible position on their capital decision. What you see
                publicly is what it produces.
              </p>
              <div className="mt-6 border-t border-[color:var(--pa-border)] pt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <MetaBlock
                    label="For"
                    value="M&A teams, PE and infra equity GPs, private credit funds, equity mandates across Digital Infrastructure."
                  />
                  <MetaBlock
                    label="Mandate"
                    value="Decision-grade models across the capital stack — private, built to the client's decision."
                  />
                </div>
              </div>
            </ResearchCard>
          </div>

          <div className="mx-auto mt-6 grid gap-6 md:grid-cols-2">
            <ResearchCard title="Equity Valuation Research">
              <BulletList items={equityResearchItems} />
            </ResearchCard>
            <ResearchCard title="Trend Intelligence">
              <BulletList items={trendIntelligenceItems} />
            </ResearchCard>
          </div>
        </div>
      </section>
    </div>
  );
}
