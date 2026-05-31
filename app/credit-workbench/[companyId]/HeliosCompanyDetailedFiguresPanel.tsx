"use client";

type Bullet = { k: string; text: string; verified?: boolean };
type Block = { title: string; bullets: Bullet[] };

const LEFT: Block[] = [
  {
    title: "Activities & Products",
    bullets: [
      {
        k: "Business",
        text: "Passive telecoms tower infrastructure — own, build and lease tower sites to MNOs under long-term contracts.",
      },
      {
        k: "Sales",
        text: "~USD 613–620m FY2023; Adj. EBITDA ~50% margin (~USD 305–315m)",
        verified: true,
      },
      {
        k: "Model",
        text: "CPI-linked annual escalators; largely cost pass-through on energy supply.",
      },
    ],
  },
  {
    title: "Operational Footprint",
    bullets: [
      {
        k: "Scale",
        text: "14,525 tower sites across 9 markets — Tanzania, DRC, Ghana, Senegal, Congo Brazzaville, South Africa, Madagascar, Malawi, Oman (as at 31 Dec 2024).",
      },
      {
        k: "Tenancy ratio",
        text: "2.03x (FY2024); Tanzania and DRC are key sales contributors; Malawi added via Airtel acquisition (2022).",
      },
    ],
  },
];

const RIGHT: Block[] = [
  {
    title: "Key Buyers & Suppliers",
    bullets: [
      {
        k: "Customers",
        text: "Airtel Africa (largest), MTN, Vodacom, Orange, Millicom/Tigo; 10–15yr contracts; top 3 ~60–65% of sales",
        verified: true,
      },
      {
        k: "Inputs",
        text: "Diesel/HFO fuel (~20–25% opex) and ground leases are main cost drivers; solar-hybrid rollout underway.",
      },
    ],
  },
  {
    title: "Ownership & Management",
    bullets: [
      {
        k: "Structure",
        text: "LSE listed (HTWS); Millicom ~25–28% stake; CEO Tom Greenwood (co-founder); management transition flagged 2023/24",
        verified: true,
      },
    ],
  },
  {
    title: "Strategy",
    bullets: [
      {
        k: "Priorities",
        text: "Grow tenancy ratio organically; deleverage from ~6x Net Debt/EBITDA; accelerate energy transition to solar-hybrid",
        verified: true,
      },
    ],
  },
];

function VerifiedMark() {
  return (
    <sup>
      <abbr
        title="Verified: tied to issuer filing, vendor extract, or model line — full cite in published appendix."
        style={{
          fontSize: 9,
          fontWeight: 700,
          color: "var(--cd-accent)",
          marginLeft: 2,
          cursor: "help",
          letterSpacing: "0.02em",
          textDecoration: "none",
          borderBottom: "0.5px dotted var(--cd-accent)",
        }}
      >
        [V]
      </abbr>
    </sup>
  );
}

function BulletList({ bullets }: { bullets: Bullet[] }) {
  return (
    <ul className="m-0 list-none p-0" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {bullets.map((b, i) => (
        <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span
            aria-hidden
            style={{
              flexShrink: 0,
              marginTop: 3,
              fontSize: 8,
              lineHeight: 1,
              color: "var(--cd-accent)",
            }}
          >
            ▶
          </span>
          <span style={{ fontSize: 12, lineHeight: 1.55, color: "var(--cd-text-2)" }}>
            <strong style={{ color: "var(--cd-text)", fontWeight: 600 }}>{b.k}:</strong> {b.text}
            {b.verified ? <VerifiedMark /> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Column({ blocks }: { blocks: Block[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {blocks.map((block) => (
        <section key={block.title}>
          <h3
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--cd-text)",
              margin: "0 0 8px",
              letterSpacing: "-0.01em",
            }}
          >
            {block.title}
          </h3>
          <BulletList bullets={block.bullets} />
        </section>
      ))}
    </div>
  );
}

/** Two-column detailed figures (former Business Model → Detailed figures tab). */
export default function HeliosCompanyDetailedFiguresPanel() {
  return (
    <article
      aria-label="Company description detailed figures"
      style={{
        marginTop: 4,
        padding: "16px 18px 18px",
        borderRadius: 6,
        border: "0.5px solid var(--cd-border)",
        background: "var(--cd-surface-2)",
      }}
    >
      <h2
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: "var(--cd-text)",
          margin: "0 0 12px",
          paddingBottom: 10,
          borderBottom: "0.5px solid var(--cd-border)",
          letterSpacing: "-0.02em",
        }}
      >
        Company Description
      </h2>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cd-text-3)", margin: "0 0 14px" }}>
        Detailed figures
      </p>
      <div className="grid grid-cols-1 gap-y-5 min-[640px]:grid-cols-2 min-[640px]:gap-x-8">
        <div className="min-[640px]:border-r min-[640px]:pr-8" style={{ borderRightColor: "var(--cd-border)" }}>
          <Column blocks={LEFT} />
        </div>
        <div>
          <Column blocks={RIGHT} />
        </div>
      </div>
    </article>
  );
}
