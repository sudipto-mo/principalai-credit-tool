import industryData from "@/lib/helios-industry-data.json";
import { IndustryRiskMatrix, type IndustryPage } from "./industry-risk-matrix";

const data = industryData as {
  _meta: {
    company: string;
    ticker: string;
    generated: string;
    digest_source: string;
    review_status: string;
    pipeline: string;
  };
  anchors: Record<string, number | null>;
  page_1: IndustryPage;
};

const ANCHOR_LABELS: Record<string, string> = {
  mno_revenue_pct: "MNO revenue",
  contracted_revenue_bn: "Contracted revenue (US$bn)",
  avg_contract_life_yrs: "Avg contract life (yrs)",
  total_towers: "Total towers",
  group_tenancy_ratio: "Group tenancy ratio",
  growth_capex_usdm: "Growth capex (US$m)",
  growth_capex_pct_total: "Growth capex % of total",
  maintenance_capex_usdm: "Maintenance capex (US$m)",
  net_leverage_fy25: "Net leverage FY25",
  net_leverage_fy24: "Net leverage FY24",
  hard_ccy_ebitda_pct: "Hard-ccy Adj EBITDA %",
  soft_ccy_revenue_pct: "Soft-ccy revenue %",
  drc_tax_contingency_usdm: "DRC tax contingency (US$m)",
  fx_swing_usdm: "FX swing FY24–25 (US$m)",
  minority_buyout_usdm: "Minority buyout (US$m)",
  hard_ccy_markets: "Hard-ccy markets",
  total_markets: "Total markets",
};

function formatAnchorValue(key: string, v: number | null): string {
  if (v === null || v === undefined) return "—";
  if (key.includes("pct") || key === "group_tenancy_ratio") {
    if (key === "group_tenancy_ratio") return String(v);
    return `${v}%`;
  }
  if (key.includes("bn")) return `US$${v}bn`;
  if (key.includes("usdm") || key === "fx_swing_usdm") return `US$${v}m`;
  if (key.includes("yrs") || key.includes("towers") || key.includes("markets")) return String(v);
  if (key.includes("leverage")) return `${v}x`;
  return String(v);
}

/** Institutional layout: headline → definition → score → conclusion → drivers; matches rating-agency style decks. */
function IndustryHeroAndNarrative() {
  const teal = "var(--cd-emphasis-teal)";

  return (
    <>
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cd-text-3)", marginBottom: 8 }}>
        Industry
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          alignItems: "flex-start",
          marginBottom: 18,
        }}
      >
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <h1
            style={{
              fontSize: 17,
              fontWeight: 700,
              lineHeight: 1.25,
              color: "var(--cd-accent)",
              margin: "0 0 12px",
              letterSpacing: "-0.02em",
            }}
          >
            Level of business risk — Sub-Saharan African tower market
          </h1>
          <div
            style={{
              border: "0.5px solid var(--cd-border)",
              borderRadius: 4,
              padding: "10px 12px",
              background: "var(--cd-surface-2)",
              fontSize: 12,
              lineHeight: 1.5,
              color: "var(--cd-text-2)",
            }}
          >
            Stability / volatility of{" "}
            <strong style={{ color: teal, fontWeight: 600 }}>cash flows</strong>
            {" "}and/or{" "}
            <strong style={{ color: teal, fontWeight: 600 }}>asset values</strong>
            {" "}over time
          </div>
        </div>

        <div
          role="img"
          aria-label="Business risk score 8 out of 10"
          style={{
            flexShrink: 0,
            width: 112,
            minHeight: 118,
            background: "var(--cd-accent)",
            borderRadius: 4,
            padding: "12px 10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", opacity: 0.95 }}>Business risk</span>
          <span style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.1, margin: "6px 0 4px" }}>8</span>
          <span style={{ fontSize: 10, fontWeight: 500, opacity: 0.9 }}>out of 10</span>
        </div>
      </div>

      <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--cd-text)", margin: "0 0 14px", fontWeight: 500 }}>
        Business risk for the SSA independent tower sector is assessed as{" "}
        <strong style={{ fontWeight: 700 }}>high (8 / 10)</strong>. The passive tower model supports predictable,
        contract-backed revenue, but{" "}
        <strong style={{ fontWeight: 600 }}>concentrated MNO customers</strong>, structural{" "}
        <strong style={{ fontWeight: 600 }}>FX and energy</strong> exposure, high capital intensity, and{" "}
        <strong style={{ fontWeight: 600 }}>macro and political volatility</strong> dominate the profile. Relative to
        global tower markets, SSA operators typically face greater execution, FX, and power-cost risk, which constrains
        free cash flow and the pace of deleveraging.
      </p>

      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--cd-text-3)", margin: "0 0 8px", letterSpacing: "0.04em" }}>
          Key risk drivers
        </p>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.65, color: "var(--cd-text-2)" }}>
          <li style={{ marginBottom: 6 }}>
            <strong style={{ color: "var(--cd-text)" }}>FX devaluation</strong> — compresses USD-reported sales even when
            local-currency operations grow.
          </li>
          <li style={{ marginBottom: 6 }}>
            <strong style={{ color: "var(--cd-text)" }}>Diesel dependency</strong> — sustains elevated opex and margin
            volatility where grid power is unreliable.
          </li>
          <li style={{ marginBottom: 6 }}>
            <strong style={{ color: "var(--cd-text)" }}>MNO concentration</strong> — top-three tenants often represent a
            large share of revenue, raising renegotiation and churn risk.
          </li>
          <li style={{ marginBottom: 6 }}>
            <strong style={{ color: "var(--cd-text)" }}>Leverage</strong> — elevated net debt / EBITDA leaves limited buffer
            for shocks until tenancy and pricing fully compound.
          </li>
        </ol>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--cd-text-2)", margin: "14px 0 0" }}>
          <span style={{ fontWeight: 700, color: "var(--cd-text-3)" }}>Offsetting factors: </span>
          Long-dated CPI-linked MLAs, improving group tenancy ratio, and capital discipline after prior expansion cycles
          partially mitigate these pressures — expanded in the industry risk matrix below; the two-column detailed
          snapshot is under <strong style={{ color: "var(--cd-text)" }}>Company</strong>; FX / energy / political themes
          and strengths & weakness rows are under <strong style={{ color: "var(--cd-text)" }}>Business Risk → Business Model</strong> (tab <em>Strengths & Weakness</em>).
        </p>
      </div>

      <div style={{ height: 1, background: "var(--cd-border)", margin: "4px 0 18px" }} aria-hidden />
    </>
  );
}

function MatrixBlock({
  page,
  caption,
  showHeading,
  headingId,
}: {
  page: IndustryPage;
  caption: string;
  showHeading: boolean;
  headingId?: string;
}) {
  return (
    <>
      {showHeading ? (
        <>
          <h2
            id={headingId}
            style={{ fontSize: 14, fontWeight: 600, color: "var(--cd-text)", marginBottom: 6, marginTop: 0 }}
          >
            {page.title}
          </h2>
          <p style={{ fontSize: 12, lineHeight: 1.55, color: "var(--cd-text-2)", marginBottom: 14 }}>{page.subtitle}</p>
        </>
      ) : null}
      <IndustryRiskMatrix page={page} caption={caption} />
    </>
  );
}

/** Pipeline output from lib/helios-industry-data.json — table layout for scanability. */
export default function HeliosIndustryPanel() {
  const { _meta, anchors, page_1 } = data;

  return (
    <div>
      <section id="cd-ind-overview" aria-labelledby="cd-ind-h-overview" style={{ scrollMarginTop: 8 }}>
        <h2 id="cd-ind-h-overview" className="sr-only">
          Industry overview
        </h2>
        <div
          style={{
            background: "color-mix(in srgb, var(--cd-chip-watch-bg) 35%, var(--cd-surface))",
            border: "0.5px solid var(--cd-border)",
            borderRadius: 4,
            padding: "8px 12px",
            marginBottom: 16,
            fontSize: 11,
            color: "var(--cd-text-2)",
            lineHeight: 1.45,
          }}
        >
          <strong style={{ color: "var(--cd-text)" }}>Review:</strong> {_meta.review_status}
        </div>

        <IndustryHeroAndNarrative />

        <p style={{ fontSize: 11, color: "var(--cd-text-3)", marginBottom: 10, lineHeight: 1.4 }}>
          {_meta.company} · {_meta.ticker} · Generated {_meta.generated} · Source: {_meta.digest_source}
        </p>
      </section>

      <section id="cd-ind-digest" aria-labelledby="cd-ind-h-digest" style={{ scrollMarginTop: 8 }}>
        <h2
          id="cd-ind-h-digest"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--cd-text-3)",
            margin: "0 0 8px",
          }}
        >
          Digest narrative (pipeline)
        </h2>
        <p style={{ fontSize: 12, lineHeight: 1.55, color: "var(--cd-text-2)", marginBottom: 14, fontStyle: "italic" }}>
          {page_1.subtitle}
        </p>

        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cd-text-3)", marginBottom: 8 }}>
            Extracted anchors
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {Object.entries(anchors).map(([key, val]) => (
              <span
                key={key}
                style={{
                  fontSize: 11,
                  padding: "4px 8px",
                  borderRadius: 3,
                  background: "var(--cd-surface-2)",
                  border: "0.5px solid var(--cd-border)",
                  color: "var(--cd-text-2)",
                }}
              >
                <span style={{ color: "var(--cd-text-3)" }}>{ANCHOR_LABELS[key] ?? key}:</span>{" "}
                <span style={{ fontWeight: 600, color: "var(--cd-text)", fontVariantNumeric: "tabular-nums" }}>
                  {formatAnchorValue(key, val)}
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="cd-ind-matrix1" aria-labelledby="cd-ind-h-matrix1" style={{ scrollMarginTop: 8, marginTop: 22 }}>
        <MatrixBlock
          page={page_1}
          caption="Risk matrix — structural tower industry risks"
          showHeading
          headingId="cd-ind-h-matrix1"
        />
        <p style={{ fontSize: 10, color: "var(--cd-text-3)", marginTop: 20, lineHeight: 1.5 }}>
          Data file: <code style={{ fontSize: 10 }}>lib/helios-industry-data.json</code> — replace with latest{" "}
          <code style={{ fontSize: 10 }}>output/narratives_industry.json</code> when the pipeline runs.
        </p>
      </section>
    </div>
  );
}
