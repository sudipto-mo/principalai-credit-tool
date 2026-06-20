import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isAdvisoryEnabled } from "@/lib/advisory-access";

export const metadata: Metadata = {
  title: "Advisory",
  description:
    "Independent, practitioner-grade advisory for APAC digital infrastructure credit — across the capital stack.",
  robots: isAdvisoryEnabled() ? undefined : { index: false, follow: false },
};

type Persona = "providers" | "sponsors" | "cross-border";

function parsePersona(raw: string | undefined): Persona | null {
  if (raw === "providers" || raw === "sponsors" || raw === "cross-border") return raw;
  return null;
}

type Chapter = {
  id: Persona;
  numeral: string;
  eyebrow: string;
  title: string;
  lede: string;
  audience: string[];
  deliverables: string[];
  cta: { label: string; href: string; primary: boolean };
  sample?: { label: string; href: string };
};

const CHAPTERS: Chapter[] = [
  {
    id: "providers",
    numeral: "I",
    eyebrow: "For Capital Providers",
    title: "Independent credit assessment.",
    lede:
      "We stress-test complex digital infrastructure exposures before capital is committed — validating physical risk layers, pressure-testing borrower resilience, and designing covenants that remain effective through the full asset lifecycle.",
    audience: ["Corporate Banks", "Private Credit", "PE & Infra Funds"],
    deliverables: [
      "Deal screening and risk framework",
      "Covenant design and protection package",
      "Independent credit opinion",
      "Physical risk layer validation",
    ],
    cta: { label: "Commission an assessment", href: "/contact", primary: true },
    sample: { label: "Helios Towers plc — sample brief", href: "/research/helios-towers" },
  },
  {
    id: "sponsors",
    numeral: "II",
    eyebrow: "For Infrastructure Sponsors",
    title: "Bankability and capital structuring.",
    lede:
      "We reverse-engineer institutional credit committee requirements so your project becomes financeable. We optimise PPAs and MLAs, model debt capacity, and structure the financing mix to secure the lowest weighted average cost of capital.",
    audience: ["Data Centre Developers", "TowerCos", "IPPs"],
    deliverables: [
      "Debt capacity modelling",
      "Financing mix optimisation",
      "PPA / MLA bankability review",
      "Term sheet structuring",
    ],
    cta: { label: "Engage structuring desk", href: "/contact", primary: false },
  },
];

const CROSS_BORDER_CHAPTER: Chapter = {
  id: "cross-border",
  numeral: "III",
  eyebrow: "For Cross-Border Investors",
  title: "Cross-border capital structuring.",
  lede:
    "Cross-border structures for TMT and digital infrastructure across GIFT IFSC, Singapore, Mauritius, and onshore India — coordinated with tax, regulatory, and financing counsel. This service line is in preparation.",
  audience: ["Offshore LPs", "Pan-APAC Funds", "Strategic Acquirers"],
  deliverables: [
    "Jurisdictional structuring review",
    "IFSC / Singapore / Mauritius coordination",
    "Repatriation and tax-efficiency design",
    "Cross-border debt placement",
  ],
  cta: { label: "Discuss a mandate", href: "/contact", primary: false },
};

export default async function AdvisoryPage({
  searchParams,
}: {
  searchParams: Promise<{ persona?: string }>;
}) {
  if (!isAdvisoryEnabled()) {
    notFound();
  }

  const sp = await searchParams;
  const hashPersona = parsePersona(sp.persona);

  const crossBorderEnabled =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_ENABLE_CROSS_BORDER === "1";

  const chapters: Chapter[] = crossBorderEnabled
    ? [...CHAPTERS, CROSS_BORDER_CHAPTER]
    : CHAPTERS;

  return (
    <div className="w-full">
      {/* Hero — editorial, serif display, institutional signature rule */}
      <header className="border-b border-[color:var(--pa-border)] pb-16 pt-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7b8794]">
          Advisory
        </p>
        <h1 className="font-serif-display mt-6 max-w-4xl text-4xl font-normal leading-[1.08] text-[var(--pa-navy)] sm:text-5xl md:text-[3.5rem]">
          Independent counsel,{" "}
          <span className="italic text-[var(--pa-signature)]">across the capital stack.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-[1.7] text-[var(--pa-muted)] sm:text-base">
          For the institutions evaluating deals and the sponsors building them — practitioner-grade
          advisory on APAC digital infrastructure transactions. Research-first. Conflict-free.
          Transaction-ready.
        </p>
        <div className="mt-10 h-px w-24 bg-[var(--pa-signature)]" aria-hidden />
      </header>

      {/* Firm position — institutional manifesto */}
      <section className="grid gap-10 border-b border-[color:var(--pa-border)] py-16 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] md:gap-16">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b8794]">
            Our Position
          </p>
        </div>
        <div className="max-w-3xl">
          <p className="font-serif-display text-[1.5rem] font-light leading-[1.45] text-[var(--pa-navy)] sm:text-[1.75rem]">
            We work at the intersection of credit committees and the assets themselves — where
            physical risk, capital structure, and covenant design meet. We do not intermediate,
            broker, or place capital. Our work is to help principals make better decisions on
            infrastructure that matters.
          </p>
          <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="border-t border-[color:var(--pa-border)] pt-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8794]">
                Independence
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--pa-text)]">
                No placement fees, no origination incentives.
              </dd>
            </div>
            <div className="border-t border-[color:var(--pa-border)] pt-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8794]">
                Research-first
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--pa-text)]">
                Every mandate inherits a continuously maintained sector thesis.
              </dd>
            </div>
            <div className="border-t border-[color:var(--pa-border)] pt-4">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7b8794]">
                Practitioner-grade
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-[var(--pa-text)]">
                Modelling and documentation at credit-committee standard.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Chapters — each engagement lane as an editorial section, not a tab */}
      {chapters.map((ch, idx) => {
        const isLast = idx === chapters.length - 1;
        return (
          <section
            key={ch.id}
            id={ch.id}
            className={`scroll-mt-24 grid gap-10 py-20 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] md:gap-16 ${
              isLast ? "" : "border-b border-[color:var(--pa-border)]"
            }`}
          >
            <div>
              <p className="font-serif-display text-[2.5rem] font-light leading-none text-[var(--pa-signature)]">
                {ch.numeral}
              </p>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b8794]">
                {ch.eyebrow}
              </p>
            </div>

            <div className="max-w-3xl">
              <h2 className="font-serif-display text-[1.75rem] font-normal leading-[1.15] text-[var(--pa-navy)] sm:text-[2rem] md:text-[2.25rem]">
                {ch.title}
              </h2>
              <p className="mt-5 text-[15px] leading-[1.75] text-[var(--pa-muted)]">{ch.lede}</p>

              <div className="mt-10 grid gap-10 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7b8794]">
                    Who we work with
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {ch.audience.map((a) => (
                      <li key={a} className="text-[14px] text-[var(--pa-text)]">
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7b8794]">
                    What we deliver
                  </p>
                  <ul className="mt-3 space-y-2">
                    {ch.deliverables.map((d, i) => (
                      <li
                        key={d}
                        className="flex gap-3 text-[14px] leading-relaxed text-[var(--pa-text)]"
                      >
                        <span
                          className="w-5 shrink-0 pt-[2px] text-[11px] font-semibold tracking-[0.04em] text-[#7b8794]"
                          aria-hidden
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-[color:var(--pa-border)] pt-6">
                <Link
                  href={ch.cta.href}
                  className={`inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.18em] no-underline transition-colors ${
                    ch.cta.primary
                      ? "border-b-2 border-[var(--pa-signature)] pb-1 text-[var(--pa-signature)] hover:text-[var(--color-deep)]"
                      : "border-b border-[color:var(--pa-border)] pb-1 text-[var(--pa-navy)] hover:border-[var(--pa-navy)]"
                  }`}
                >
                  {ch.cta.label} →
                </Link>
                {ch.sample && (
                  <Link
                    href={ch.sample.href}
                    className="inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--pa-muted)] no-underline transition-colors hover:text-[var(--pa-navy)]"
                  >
                    {ch.sample.label} →
                  </Link>
                )}
              </div>
            </div>
          </section>
        );
      })}

      <section className="mt-2 grid gap-8 border-t border-[color:var(--pa-border)] bg-[#faf8f2] px-6 py-14 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] md:gap-16 md:px-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b8794]">Credit desk</p>
        </div>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h3 className="font-serif-display text-[1.5rem] font-normal leading-tight text-[var(--pa-navy)]">Credit Desk</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--pa-muted)]">
              The institutional credit assessment environment — open read access; sign in is optional for your session.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link
              href="/credit-workbench/helios-towers"
              className="border border-[var(--pa-navy)] bg-[var(--pa-navy)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white no-underline transition-colors hover:bg-[var(--pa-navy-deep)]"
            >
              Open interactive desk →
            </Link>
            <Link
              href="/credit-workbench"
              className="border border-[color:var(--pa-border)] bg-transparent px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--pa-navy)] no-underline transition-colors hover:border-[var(--pa-navy)]"
            >
              Open credit desk →
            </Link>
          </div>
        </div>
      </section>

      {/* Closing — disclosure-style */}
      <footer className="mt-4 border-t border-[color:var(--pa-border)] py-10">
        <p className="max-w-3xl text-[12px] leading-relaxed text-[#7b8794]">
          Dorrsum Advisory provides independent research and advisory. We do not solicit deposits,
          place securities, or receive transaction-contingent fees. All engagements are scoped under
          a written mandate. Jurisdictional availability may vary.
        </p>
      </footer>

      {/* Client-side scroll-to-anchor fallback for ?persona= deep links */}
      {hashPersona && (
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var el = document.getElementById(${JSON.stringify(hashPersona)});
                  if (el && typeof el.scrollIntoView === "function") {
                    requestAnimationFrame(function(){ el.scrollIntoView({ behavior: "smooth", block: "start" }); });
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      )}
    </div>
  );
}
