"use client";

import { useId, useState, type ReactNode } from "react";
import amData from "@/lib/helios-asset-management-data.json";

/** Conclusion-first matches common research / rating memo layout. */
export const WORKBENCH_THREE_TAB_LABELS = ["Conclusion", "Key metrics", "Detailed figures"] as const;

export function DeskTabs({
  groupLabel,
  panels,
  tabLabels,
}: {
  groupLabel: string;
  panels: ReactNode[];
  /** Defaults to three standard labels; must match `panels.length` (e.g. four tabs for Business Model). */
  tabLabels?: readonly string[];
}) {
  const baseId = useId().replace(/:/g, "");
  const [i, setI] = useState(0);
  const labels = tabLabels ?? [...WORKBENCH_THREE_TAB_LABELS];
  if (labels.length !== panels.length) {
    throw new Error(`DeskTabs: tabLabels (${labels.length}) and panels (${panels.length}) must match`);
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={groupLabel}
        style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}
      >
        {labels.map((label, idx) => {
          const selected = i === idx;
          return (
            <button
              key={`${label}-${idx}`}
              type="button"
              role="tab"
              id={`${baseId}-tab-${idx}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${idx}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setI(idx)}
              style={{
                padding: "5px 11px",
                fontSize: 11,
                fontWeight: selected ? 600 : 500,
                borderRadius: 4,
                border: "0.5px solid var(--cd-border)",
                background: selected ? "var(--cd-active-bg)" : "var(--cd-surface)",
                color: selected ? "var(--cd-text)" : "var(--cd-text-2)",
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      {panels.map((panel, idx) => (
        <div
          key={idx}
          id={`${baseId}-panel-${idx}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${idx}`}
          hidden={i !== idx}
        >
          {panel}
        </div>
      ))}
    </div>
  );
}

function Subheading({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "var(--cd-text)",
        marginBottom: 10,
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </div>
  );
}

export function WorkbenchMetricCard({
  source,
  label,
  value,
  sub,
  trend,
}: {
  source: string;
  label: ReactNode;
  value: string;
  sub: string;
  trend: string;
}) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 6,
        border: "0.5px solid var(--cd-border)",
        background: "var(--cd-surface)",
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--cd-text-3)", marginBottom: 6 }}>
        {source}
      </div>
      <div style={{ fontSize: 11, color: "var(--cd-text-2)", lineHeight: 1.35, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: "var(--cd-text)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--cd-text-3)", marginTop: 4 }}>{sub}</div>
      <div style={{ fontSize: 10, color: "var(--cd-text-3)", marginTop: 8, fontStyle: "italic" }}>{trend}</div>
    </div>
  );
}

function FiguresTable({ head, rows }: { head: string[]; rows: (string | ReactNode)[][] }) {
  return (
    <div style={{ overflowX: "auto", marginTop: 4, WebkitOverflowScrolling: "touch" }}>
      <table
        style={{
          width: "100%",
          minWidth: 520,
          borderCollapse: "collapse",
          fontSize: 10,
          fontVariantNumeric: "tabular-nums",
          color: "var(--cd-text-2)",
        }}
      >
        <thead>
          <tr style={{ background: "var(--cd-surface-2)" }}>
            {head.map((h, j) => (
              <th
                key={j}
                style={{
                  textAlign: j === 0 ? "left" : "right",
                  padding: "8px 6px",
                  borderBottom: "0.5px solid var(--cd-border)",
                  fontWeight: 600,
                  color: "var(--cd-text)",
                  whiteSpace: "nowrap",
                  ...(j === 0
                    ? {
                        position: "sticky" as const,
                        left: 0,
                        zIndex: 2,
                        background: "var(--cd-surface-2)",
                        boxShadow: "4px 0 8px -4px rgba(0,0,0,0.12)",
                      }
                    : {}),
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 1 ? "rgba(0,0,0,0.02)" : undefined }}>
              {cells.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    textAlign: ci === 0 ? "left" : "right",
                    padding: "6px 6px",
                    borderBottom: "0.5px solid var(--cd-border)",
                    maxWidth: ci === 0 ? 200 : undefined,
                    ...(ci === 0
                      ? {
                          position: "sticky" as const,
                          left: 0,
                          zIndex: 1,
                          background: "var(--cd-surface)",
                          boxShadow: "4px 0 8px -4px rgba(0,0,0,0.08)",
                        }
                      : {}),
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function WorkbenchConclusionList({ items }: { items: { label: string; text: string }[] }) {
  return (
    <ul className="m-0 list-none p-0" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: 12, lineHeight: 1.55, color: "var(--cd-text-2)" }}>
          <strong style={{ color: "var(--cd-text)", fontWeight: 600 }}>{item.label}</strong> {item.text}
        </li>
      ))}
    </ul>
  );
}

function PanelShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        marginTop: 4,
        padding: "16px 18px 18px",
        borderRadius: 6,
        border: "0.5px solid var(--cd-border)",
        background: "var(--cd-surface-2)",
      }}
    >
      {children}
    </div>
  );
}

// ─── Verdict helpers ─────────────────────────────────────────────────────────
type Verdict = "Very comfortable" | "Comfortable" | "Tight" | "Watch";

function nwccVerdict(days: number): Verdict {
  if (days < 15) return "Very comfortable";
  if (days < 25) return "Comfortable";
  if (days < 40) return "Tight";
  return "Watch";
}

const VERDICT_COLOR: Record<Verdict, string> = {
  "Very comfortable": "#16a34a",
  "Comfortable":      "#16a34a",
  "Tight":            "#d97706",
  "Watch":            "#dc2626",
};

const VERDICT_BG: Record<Verdict, string> = {
  "Very comfortable": "rgba(22,163,74,0.10)",
  "Comfortable":      "rgba(22,163,74,0.10)",
  "Tight":            "rgba(217,119,6,0.10)",
  "Watch":            "rgba(220,38,38,0.10)",
};

// ─── Precomputed scenarios ────────────────────────────────────────────────────
const SCENARIOS = [
  { id: "upside",   label: "Upside",   debtorDays: 80,  nwcDays: 15.0, nwaPctSales: 4.5 },
  { id: "base",     label: "Base",     debtorDays: 109, nwcDays: 21.6, nwaPctSales: 5.9 },
  { id: "downside", label: "Downside", debtorDays: 130, nwcDays: 34.2, nwaPctSales: 9.4 },
] as const;

type ScenarioId = "upside" | "base" | "downside";

// ─── Detailed figures from JSON ───────────────────────────────────────────────
type AmValues = Record<string, number | null>;

const NWA_HEAD = ["( USD Million )", "FY2024", "FY2025"];

const NWA_ROWS: (string | ReactNode)[][] = [
  ...amData.nwa_table
    .filter((r) => r.type === "component")
    .map((r) => {
      const v = r.values as AmValues;
      return [r.label, v[2024] != null ? String(v[2024]) : "—", v[2025] != null ? String(v[2025]) : "—"];
    }),
  ...amData.nwa_table
    .filter((r) => r.type === "total")
    .map((r) => {
      const v = r.values as AmValues;
      return [
        <b key={r.label}>{r.label}</b>,
        <b key="24">{v[2024] != null ? String(v[2024]) : "—"}</b>,
        <b key="25">{v[2025] != null ? String(v[2025]) : "—"}</b>,
      ];
    }),
  ...amData.nwa_table
    .filter((r) => r.type === "margin")
    .map((r) => {
      const v = r.values as AmValues;
      return [
        <b key={r.label}>{r.label}</b>,
        <b key="24">{v[2024] != null ? `${v[2024]}%` : "—"}</b>,
        <b key="25">{v[2025] != null ? `${v[2025]}%` : "—"}</b>,
      ];
    }),
];

const NWCC_HEAD = ["( Days )", "FY2024", "FY2025"];

const NWCC_ROWS: (string | ReactNode)[][] = [
  ...amData.nwcc_drivers
    .filter((r) => r.type === "component")
    .map((r) => {
      const v = r.values as AmValues;
      return [r.label, v[2024] != null ? String(v[2024]) : "—", v[2025] != null ? String(v[2025]) : "—"];
    }),
  ...amData.nwcc_drivers
    .filter((r) => r.type === "total")
    .map((r) => {
      const v = r.values as AmValues;
      return [
        <b key={r.label}>{r.label}</b>,
        <b key="24">{v[2024] != null ? String(v[2024]) : "—"}</b>,
        <b key="25">{v[2025] != null ? String(v[2025]) : "—"}</b>,
      ];
    }),
];

const FA_HEAD = NWA_HEAD;

const FA_ROWS: (string | ReactNode)[][] = [
  ["Sales (USD m)", "387.8", "414.0", "449.1", "560.7", "721.0", "792.0"],
  ["EBITDA Margin (%)", "55%", "58%", "63%", "66%", "58%", "55% [E]"],
  [
    <>
      <abbr title="Depreciation & Amortization" style={{ textDecoration: "underline dotted", cursor: "help" }}>
        D&A
      </abbr>{" "}
      — Total (USD m)
    </>,
    "138.0",
    "135.4",
    "157.5",
    "165.8",
    "192.9",
    "139.2",
  ],
  ["Total Sites", "7,000 [A]", "6,966", "14,231 [A]", "14,416 [A]", "14,097", "14,325"],
  [<b key="c">Chg in Net Fixed Assets (CAPEX)</b>, <b>108.7</b>, <b>114.3</b>, <b>334.1</b>, <b>417.8</b>, <b>230.7</b>, <b>200.0</b>],
  [
    <b key="d">
      Capex / Total{" "}
      <abbr title="Depreciation & Amortization" style={{ textDecoration: "underline dotted" }}>
        D&A
      </abbr>{" "}
      (x)
    </b>,
    <b>0.8x</b>,
    <b>0.8x</b>,
    <b>2.1x</b>,
    <b>2.5x</b>,
    <b>1.2x</b>,
    <b>1.4x</b>,
  ],
  [<b key="s">Sales per Site ($000)</b>, <b>55.4</b>, <b>59.4</b>, <b>31.6</b>, <b>41.2</b>, <b>51.1</b>, <b>55.3</b>],
];

const FA_CONCLUSION = [
  {
    label: "CAPEX Trajectory — Acquisitive to Organic:",
    text: "CAPEX/D&A peaked at 2.5x (FY2022) during the DRC, South Africa, Senegal and Malawi acquisition program (FY2021–22, ~7,000+ towers added). Management formally pivoted to organic-only in 2023: +544 sites (FY2023), +228 sites (FY2024). CAPEX/D&A has moderated to 1.4x (FY2024), appropriate for maintenance + organic build. Note: the ratio is flattered by the South Africa disposal which reduced total D&A sharply from 192.9 (FY2023) to 139.2 (FY2024) — watch for re-acceleration in FY2025+.",
  },
  {
    label: "CAPEX Affordability — Structural Turning Point in FY2023/24:",
    text: "Cash Flow Available for Debt Service improved from $165–219M (FY2020–22) to $410–418M (FY2023–24) as tenancy growth drove operating leverage. Cash Flow Available for Debt Service/CAPEX recovered from 0.5x (FY2021–22) to 2.1x (FY2024): Helios now self-funds all CAPEX from operations for the first time. Cash Flow after Debt Service (168.8M, FY2024) falls marginally short of total CAPEX (200.0M), still requiring modest external funding for growth — but the gap vs. prior years (Cash Flow after Debt Service was only 9.3M in FY2021) represents a step-change improvement.",
  },
  {
    label: "Investment Payoff — Confirmed by Operational KPIs:",
    text: "Tenancy ratio reached 2.07x (FY2024), confirmed from annual report, up from ~1.30x pre-acquisition: the internal 2.0x investment thesis has been delivered. Sales per site fully recovered to $55.3k (FY2024), matching the FY2019 pre-M&A baseline of $55.4k despite near-doubling of site count (7,000 → 14,325). EBITDA/site also recovered to $30.2k (FY2024) vs $30.6k (FY2019). The dilution from acquiring lower-utilisation towers has been fully absorbed.",
  },
  {
    label: "Leverage and Affordability Risk:",
    text: "Interest expense (196.9M, FY2024) consumes 47% of Cash Flow Available for Debt Service, leaving Cash Flow after Debt Service of 220.8M. CPLTD of 52.0M (CPLTD Bond 16.5M + Finance Leases CP 35.5M) then reduces Cash Flow after Debt Service to 168.8M. While improved vs FY2021 (Cash Flow after Debt Service: 9.3M), any Cash Flow Available for Debt Service reversal — driven by SSA FX devaluation (TZS, GHS, CDF) or energy cost spikes — would quickly erode CAPEX coverage. Bond refinancing risk remains the key overhang, given elevated net leverage.",
  },
  {
    label: "Asset Efficiency vs. Peers — Still Closing the Gap:",
    text: "Fixed asset turnover (0.24x, FY2024) remains below AMT (0.27x) and SBA (0.46x), reflecting structurally lower revenue density in SSA vs. developed markets. Capex/Sales at ~25% (FY2024) has normalised from the FY2021 peak of ~349% but remains above global tower peers (~9–14%). The path to peer-level returns requires continued tenancy growth (current 2.07x vs. mature market benchmark ~2.5x+) and EBITDA margin expansion beyond the current ~55% base.",
  },
];

const SP_HEAD = ["( USD Million )", "31/12/2019", "31/12/2020", "31/12/2021", "31/12/2022", "31/12/2023", "31/12/2024"];

const SP_ROWS: (string | ReactNode)[][] = [
  [<b key="t">Total Sales</b>, <b>387.8</b>, <b>414.0</b>, <b>449.1</b>, <b>560.7</b>, <b>721.0</b>, <b>792.0</b>],
  [<b key="g">Gross Profit</b>, <b>125.9</b>, <b>147.9</b>, <b>153.8</b>, <b>194.8</b>, <b>270.6</b>, <b>383.1</b>],
  ["Net Profit After Tax", "(136.6)", "(36.7)", "(156.2)", "(171.4)", "(111.8)", "27.0"],
  [<b key="c">Change in Sales (%)</b>, "—", <b>6.8%</b>, <b>8.5%</b>, <b>24.8%</b>, <b>28.6%</b>, <b>9.8%</b>],
  [<b key="m">Gross Profit Margin (%)</b>, <b>32.5%</b>, <b>35.7%</b>, <b>34.2%</b>, <b>34.7%</b>, <b>37.5%</b>, <b>48.4%</b>],
  [<b key="e">EBITDA to Sales (%)</b>, <b>52.9%</b>, <b>54.7%</b>, <b>53.6%</b>, <b>50.4%</b>, <b>51.2%</b>, <b>53.0%</b>],
  ["NPBT to Sales (%)", "(19.3%)", "(5.0%)", "(26.6%)", "(29.0%)", "(15.6%)", "5.6%"],
];

const SP_CONCLUSION = [
  {
    label: "Revenue: strong USD growth, FX the persistent headwind:",
    text: "Sales expanded from $414m (FY2020) to $792m (FY2024) — a 91% increase over four years, underpinned by tower additions, tenancy ratio gains, and contracted CPI-linked escalators. USD growth peaked at +29% (FY2023) before moderating to +10% (FY2024) as SSA currency devaluations increasingly compress reported USD revenue. Tanzania ($270m, 34%) and DRC ($118m, 15%) are the dominant markets — together ~49% of FY2024 revenue — with Ghana ($127m, 16%) adding further FX exposure; collectively ~65% of revenue is in high-FX-risk jurisdictions (TZS, CDF, GHS). Senegal and South Africa provide growing but subscale offsets.",
  },
  {
    label: "GP margin step-change in FY2024: IFRS 16 rolloff, not cash improvement:",
    text: "Gross Profit margin from trading jumped 10.8pp to 48.4% in FY2024 (from 37.5% in FY2023). The primary driver was IFRS 16 ROU depreciation rolling off acquired lease towers (+9.2pp), a non-cash accounting release; incremental cash COS efficiency contributed only +1.7pp. The EBITDA margin improved modestly from 51% to 53% (FY2023→FY2024), confirming the bulk of the GP uplift is non-cash. EBITDA grew from $227m (FY2020) to $420m (FY2024) — an 85% increase at 17% CAGR — reflecting genuine operating leverage on the tower network.",
  },
  {
    label: "FY2024: first profit since IPO, but interest & FX costs remain elevated:",
    text: "EBIT reached $263m (FY2024), driving the first positive NPBT (+$44.2m) and NPAT (+$27m) since listing. However, gross interest expense compounded at ~16% p.a. to $197m (FY2024), and FX translation losses on non-USD debt added a further $22m — total interest and FX cost of $219m absorbed the majority of EBIT. FY2022/FY2023 FX losses ($52m/$66m) severely suppressed NPBT in those years. Structural profitability requires both continued EBITDA expansion and FX stabilisation across the SSA portfolio.",
  },
  {
    label: "Divisional: Tanzania and DRC core, but no segment EBITDA disclosed:",
    text: "Tanzania ($270m, +9% YoY) and DRC ($118m, +10%) are the earnings engine, growing steadily despite currency pressure. South Africa delivered the fastest growth at +10% to $87m as the build-out matures. Ghana ($127m) and Senegal ($71m) are broadly stable. The Group reports only segment revenue — no divisional EBITDA or margin data is disclosed, limiting the ability to assess profitability distribution and cross-subsidy risk across the six markets.",
  },
  {
    label: "Cash generation: step-change in FY2024; interest coverage improving:",
    text: "Operating cash flow reached $440m (FY2024), more than doubling from $197m (FY2021), as EBITDA expanded and adjusted working capital reversed — releasing $20m in FY2024 after absorbing $44–54m annually in FY2021–FY2023. Cash Flow Available for Debt Service of $418m (FY2024) covers cash interest of $197m at 2.1x (FY2019: 1.7x). Cash Flow after Debt Service improved to $221m, providing meaningful headroom for debt service and growth CAPEX. Est. FY2025 Cash Flow Available for Debt Service ~$400m [E] — stable-to-slight decline as the FY2023 tax credit unwinds and FX/other costs normalise.",
  },
];

function CurrentAssetBlock() {
  const [debtorDays, setDebtorDays] = useState(109);
  const [nwaPct, setNwaPct]         = useState(5.9);
  const [activeScenario, setActiveScenario] = useState<ScenarioId>("base");
  const [drillIn, setDrillIn] = useState<"conclusion" | "figures" | null>(null);

  // Derive live NWCC from sliders (empirical approximation anchored on FY25 actuals)
  const liveNwcc = parseFloat(
    (21.6 + (debtorDays - 109) * 0.22 + (nwaPct - 5.9) * 0.9).toFixed(1)
  );
  const verdict = nwccVerdict(liveNwcc);

  const applyScenario = (s: typeof SCENARIOS[number]) => {
    setActiveScenario(s.id);
    setDebtorDays(s.debtorDays);
    setNwaPct(s.nwaPctSales);
  };

  const conclusionItems = [
    {
      label: "Deferred income as structural offset:",
      text: "Deferred income DOH expanded from 29.7d (FY24) to 34.4d (FY25), absorbing part of the debtor day blowout and keeping NWCC net-positive.",
    },
    {
      label: "Debtor day spike is the watch item:",
      text: "Raw debtor DOH rose from 79.7d (FY24) to 109.3d (FY25) — a 29d deterioration driven primarily by TZS/GHS FX and delayed sovereign collections in DRC.",
    },
    {
      label: "Accruals buffer deepened:",
      text: "Accruals DOH widened from 56.9d to 78.0d, further compressing NWCC net. If accruals normalise, NWCC would widen by ~20d.",
    },
    {
      label: "NWA/Sales improved despite debtor pressure:",
      text: "NWA/Sales compressed from 9.4% (FY24) to 5.9% (FY25) — better than forecast — driven by the accruals build.",
    },
    {
      label: "Net cycle comfortable at 21.6d:",
      text: "Despite high raw debtor days, the net working capital cycle remains below the 25d threshold. Collection risk is the key residual exposure.",
    },
  ];

  return (
    <div style={{ marginBottom: 22 }}>
      {/* Block header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <Subheading>Current asset</Subheading>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 10,
            background: VERDICT_BG[verdict],
            color: VERDICT_COLOR[verdict],
            border: `0.5px solid ${VERDICT_COLOR[verdict]}`,
          }}
        >
          {verdict}
        </span>
      </div>
      <div style={{ fontSize: 10, color: "var(--cd-text-3)", marginBottom: 12 }}>
        Is working capital being managed efficiently?
      </div>

      {/* ── Primary insight view — always visible ─────────────────── */}

      {/* Live NWCC readout */}
      <div
        style={{
          padding: "12px 14px",
          borderRadius: 6,
          border: `1px solid ${VERDICT_COLOR[verdict]}`,
          background: VERDICT_BG[verdict],
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--cd-text-3)" }}>
            Live NWCC
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: VERDICT_COLOR[verdict], fontVariantNumeric: "tabular-nums" }}>
            {liveNwcc}d
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "var(--cd-text-2)", lineHeight: 1.4, marginBottom: 6 }}>
            Net working capital cycle at current inputs. Adjust sliders to stress-test.
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "rgba(0,0,0,0.06)", color: "var(--cd-text-3)", fontVariantNumeric: "tabular-nums" }}>
              FY24 actual: 34.2d
            </span>
            <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "rgba(0,0,0,0.06)", color: "var(--cd-text-3)", fontVariantNumeric: "tabular-nums" }}>
              FY25 actual: 21.6d
            </span>
          </div>
        </div>
      </div>

      {/* Scenario chips */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {SCENARIOS.map((s) => {
          const sv = nwccVerdict(s.nwcDays);
          const active = activeScenario === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => applyScenario(s)}
              style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                padding: "5px 12px",
                borderRadius: 14,
                border: `0.5px solid ${active ? VERDICT_COLOR[sv] : "var(--cd-border)"}`,
                background: active ? VERDICT_BG[sv] : "var(--cd-surface)",
                color: active ? VERDICT_COLOR[sv] : "var(--cd-text-2)",
                cursor: "pointer",
              }}
            >
              {s.label} — {s.nwcDays}d
            </button>
          );
        })}
      </div>

      {/* Sliders */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16 }}>
        {/* Debtor days */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--cd-text)" }}>Debtor days</span>
            <span style={{ fontSize: 10, fontVariantNumeric: "tabular-nums", color: "var(--cd-text-2)" }}>
              {debtorDays}d
              {debtorDays !== 109 && (
                <span style={{ fontSize: 9, color: debtorDays > 109 ? "#d97706" : "#16a34a", marginLeft: 4 }}>
                  ({debtorDays > 109 ? "+" : ""}{(debtorDays - 109).toFixed(0)}d vs FY25)
                </span>
              )}
            </span>
          </div>
          <input
            type="range" min={60} max={160} step={1} value={debtorDays}
            onChange={(e) => { setDebtorDays(Number(e.target.value)); setActiveScenario("base"); }}
            style={{ width: "100%", accentColor: VERDICT_COLOR[verdict] }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--cd-text-3)", marginTop: 2 }}>
            <span>60d</span><span>160d</span>
          </div>
          {/* Actual anchors */}
          <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
            <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "var(--cd-surface)", border: "0.5px solid var(--cd-border)", color: "var(--cd-text-2)", fontVariantNumeric: "tabular-nums" }}>
              FY24 actual: 79.7d
            </span>
            <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "var(--cd-surface)", border: "0.5px solid var(--cd-border)", color: "var(--cd-text-2)", fontVariantNumeric: "tabular-nums" }}>
              FY25 actual: 109.3d
            </span>
          </div>
        </div>

        {/* NWA / Sales */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--cd-text)" }}>NWA / Sales</span>
            <span style={{ fontSize: 10, fontVariantNumeric: "tabular-nums", color: "var(--cd-text-2)" }}>
              {nwaPct.toFixed(1)}%
              {Math.abs(nwaPct - 5.9) > 0.05 && (
                <span style={{ fontSize: 9, color: nwaPct > 5.9 ? "#d97706" : "#16a34a", marginLeft: 4 }}>
                  ({nwaPct > 5.9 ? "+" : ""}{(nwaPct - 5.9).toFixed(1)}pp vs FY25)
                </span>
              )}
            </span>
          </div>
          <input
            type="range" min={3} max={15} step={0.1} value={nwaPct}
            onChange={(e) => { setNwaPct(Number(e.target.value)); setActiveScenario("base"); }}
            style={{ width: "100%", accentColor: VERDICT_COLOR[verdict] }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--cd-text-3)", marginTop: 2 }}>
            <span>3%</span><span>15%</span>
          </div>
          {/* Actual anchors */}
          <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
            <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "var(--cd-surface)", border: "0.5px solid var(--cd-border)", color: "var(--cd-text-2)", fontVariantNumeric: "tabular-nums" }}>
              FY24 actual: 9.4%
            </span>
            <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "var(--cd-surface)", border: "0.5px solid var(--cd-border)", color: "var(--cd-text-2)", fontVariantNumeric: "tabular-nums" }}>
              FY25 actual: 5.9%
            </span>
          </div>
        </div>
      </div>

      {/* What would flip this */}
      <div style={{ borderTop: "0.5px solid var(--cd-border)", paddingTop: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--cd-text)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          What would flip this
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { trigger: "Debtor days > 130", outcome: "Tight",  color: "#d97706" },
            { trigger: "NWA / Sales > 12%", outcome: "Tight",  color: "#d97706" },
            { trigger: "OCF WC drag > $50m", outcome: "Watch", color: "#dc2626" },
          ].map((item) => (
            <div key={item.trigger} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "var(--cd-text-2)" }}>
              <span>{item.trigger}</span>
              <span style={{ fontWeight: 600, color: item.color }}>{item.outcome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drill-in links */}
      <div style={{ display: "flex", gap: 16, borderTop: "0.5px solid var(--cd-border)", paddingTop: 10, marginBottom: drillIn ? 12 : 0 }}>
        {(["conclusion", "figures"] as const).map((key) => {
          const label = key === "conclusion" ? "Why this verdict" : "Detailed figures";
          const active = drillIn === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setDrillIn(active ? null : key)}
              style={{
                fontSize: 10,
                color: active ? "var(--cd-text)" : "var(--cd-text-3)",
                fontWeight: active ? 600 : 400,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {label} {active ? "↑" : "→"}
            </button>
          );
        })}
        <button type="button" style={{ fontSize: 10, color: "var(--cd-text-3)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          Source →
        </button>
      </div>

      {/* ── Expandable drill-in panels ────────────────────────────── */}
      {drillIn === "conclusion" && (
        <div style={{ paddingTop: 12 }}>
          <WorkbenchConclusionList items={conclusionItems} />
        </div>
      )}
      {drillIn === "figures" && (
        <div style={{ paddingTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--cd-text)", marginBottom: 8 }}>
            Net Working Assets (Adj) — USD million
          </div>
          <FiguresTable head={NWA_HEAD} rows={NWA_ROWS} />
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--cd-text)", margin: "18px 0 8px" }}>
            Net Working Capital Cycle — Days
          </div>
          <FiguresTable head={NWCC_HEAD} rows={NWCC_ROWS} />
        </div>
      )}
    </div>
  );
}

function FixedAssetBlock() {
  return (
    <div>
      <Subheading>Fixed Asset</Subheading>
      <DeskTabs
        groupLabel="Fixed asset panels"
        panels={[
          <WorkbenchConclusionList key="c" items={FA_CONCLUSION} />,
          <div key="km" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <WorkbenchMetricCard
              source="Derived"
              label={
                <>
                  Capex / Total{" "}
                  <abbr title="Depreciation & Amortization" style={{ textDecoration: "underline dotted", cursor: "help" }}>
                    D&A
                  </abbr>{" "}
                  (<span>FY2024</span>)
                </>
              }
              value="1.4x"
              sub="Intensity"
              trend="TBC reasoning"
            />
            <WorkbenchMetricCard
              source="Derived"
              label={<>Sales per Site (<span>FY2024</span>)</>}
              value="55.3"
              sub="$000"
              trend="TBC reasoning"
            />
          </div>,
          <div key="df">
            <p style={{ fontSize: 10, color: "var(--cd-text-3)", margin: "0 0 8px" }}>Interactive row charts: coming soon (legacy workbench parity).</p>
            <FiguresTable head={FA_HEAD} rows={FA_ROWS} />
          </div>,
        ]}
      />
    </div>
  );
}

/** (b) Asset management — ported from `public/credit-workbench/index.html` (Current + Fixed). */
export function HeliosBusinessAssetManagementPanel() {
  return (
    <PanelShell>
      <CurrentAssetBlock />
      <FixedAssetBlock />
    </PanelShell>
  );
}

/** (c) Sales & Profitability — ported from legacy credit workbench. */
export function HeliosSalesProfitabilityPanel() {
  return (
    <PanelShell>
      <DeskTabs
        groupLabel="Sales and profitability panels"
        panels={[
          <WorkbenchConclusionList key="c" items={SP_CONCLUSION} />,
          <div key="km" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <WorkbenchMetricCard
              source="Public filing"
              label={<>Revenue (<span>FY2024</span>)</>}
              value="$792m"
              sub="+9.8% YoY"
              trend="TBC reasoning"
            />
            <WorkbenchMetricCard
              source="Public filing"
              label={<>Adj. EBITDA margin (<span>FY2024</span>)</>}
              value="~53%"
              sub="+1.8pp vs prior FY"
              trend="TBC reasoning"
            />
          </div>,
          <div key="df">
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--cd-text)", marginBottom: 8 }}>Profitability</div>
            <p style={{ fontSize: 10, color: "var(--cd-text-3)", margin: "0 0 8px" }}>Interactive row charts: coming soon (legacy workbench parity).</p>
            <FiguresTable head={SP_HEAD} rows={SP_ROWS} />
          </div>,
        ]}
      />
    </PanelShell>
  );
}
