import HeroPreview from "@/components/HeroPreview";
import { HERO_MARKETING } from "@/lib/hero-marketing";

const expertise = [
  {
    title: "Equity Valuation Research",
    items: [
      "Physical-stack constraint modelling",
      "Market-implied expectations (reverse-DCF)",
      "Second-order and cross-sector mispricing calls",
    ],
  },
  {
    title: "Valuation Advisory",
    items: [
      "Enterprise and asset-level valuation",
      "Equity positioning and investor narrative",
      "Transaction and capital advisory",
    ],
  },
  {
    title: "Trend Intelligence",
    items: [
      "AI capex cycle and demand signals",
      "Power and energy transition impact on equity value",
      "Regulatory risk and policy pricing",
    ],
  },
] as const;

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
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b7280]">What We Believe</p>
          <p className="font-serif-display mt-8 text-3xl font-light leading-[1.22] text-[var(--pa-navy)] sm:text-4xl md:text-[2.5rem]">
            The market prices the AI narrative. We price the physical layer beneath it.{" "}
            <span className="italic text-[var(--pa-signature)]">That&apos;s where the calls are.</span>
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:py-20">
          <h2 className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b7280]">
            Research &amp; Advisory
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="rounded-[4px] border border-[color:var(--pa-border)] bg-white p-7">
              <h3 className="text-xl font-semibold tracking-tight text-[var(--pa-navy)]">
                Equity Valuation Research
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--pa-muted)]">
                Variant-perception research that stress-tests the market&apos;s AI-infrastructure assumptions against
                physical reality — for investors who want the edge the consensus model misses.
              </p>
              <div className="mt-6 border-t border-[color:var(--pa-border)] pt-4">
                <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7b8794]">For</p>
                <p className="mt-2 text-sm text-[var(--pa-text)]">
                  Fundamental and long/short equity funds, PE and infra equity, family offices.
                </p>
                <p className="mt-4 m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7b8794]">Mandate</p>
                <p className="mt-2 text-sm text-[var(--pa-text)]">Mispricing research and valuation calls.</p>
              </div>
            </article>

            <article className="rounded-[4px] border border-[color:var(--pa-border)] bg-white p-7">
              <h3 className="text-xl font-semibold tracking-tight text-[var(--pa-navy)]">
                Valuation Advisory
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--pa-muted)]">
                Valuation and positioning support built around how equity investors and strategic capital assess the
                enterprise value of digital infrastructure assets.
              </p>
              <div className="mt-6 border-t border-[color:var(--pa-border)] pt-4">
                <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7b8794]">For</p>
                <p className="mt-2 text-sm text-[var(--pa-text)]">
                  Data centre developers, TowerCos, AI-native operators.
                </p>
                <p className="mt-4 m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7b8794]">Mandate</p>
                <p className="mt-2 text-sm text-[var(--pa-text)]">Enterprise valuation and investor positioning.</p>
              </div>
            </article>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {expertise.map((col) => (
              <article
                key={col.title}
                className="rounded-[4px] border border-[color:var(--pa-border)] bg-white p-7"
                aria-label={col.title}
              >
                <h3 className="text-base font-semibold tracking-tight text-[var(--pa-navy)]">{col.title}</h3>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--pa-muted)]">
                  {col.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#7b8794]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
