"use client";

import industryData from "@/lib/helios-industry-data.json";
import { DeskTabs, WorkbenchConclusionList, WorkbenchMetricCard } from "./HeliosBusinessAssetSalesPanels";
import { IndustryRiskMatrix, type IndustryPage } from "./industry-risk-matrix";

const page_2 = (industryData as { page_2: IndustryPage }).page_2;

const BUSINESS_MODEL_TAB_LABELS = ["Conclusion", "Key metrics", "Strengths & Weakness"] as const;

const BUSINESS_MODEL_CONCLUSION = [
  {
    label: "Contracted tower economics:",
    text: "Helios is a passive infrastructure owner: it builds and leases tower sites to mobile operators under long-term MLAs, with CPI-linked escalators and largely pass-through treatment on energy — supporting revenue visibility while keeping exposure to local power costs, grid reliability, and FX where tariffs do not fully recover.",
  },
  {
    label: "Scale and footprint:",
    text: "The group operated 14,525 sites across nine markets (plus Oman) at 31 Dec 2024, with a tenancy ratio of 2.03x in FY2024. Tanzania and DRC are material revenue contributors; portfolio evolution includes bolt-on markets such as Malawi via the Airtel acquisition (2022).",
  },
  {
    label: "Customers and inputs:",
    text: "Revenue is anchored in large MNO relationships (Airtel Africa largest; MTN, Vodacom, Orange, Millicom/Tigo) on 10–15 year contracts, with the top three customers representing roughly 60–65% of sales. Diesel/HFO and ground leases are the main operating cost drivers; management is rolling out solar-hybrid solutions to mitigate energy risk over time.",
  },
  {
    label: "Ownership and strategic priorities:",
    text: "LSE-listed (HTWS) with Millicom holding ~25–28%; CEO Tom Greenwood (co-founder) leads the group, with an earlier management transition flagged in 2023/24. Stated priorities are organic tenancy growth, deleveraging from ~6× Net Debt/EBITDA, and accelerating the shift to solar-hybrid power.",
  },
];

/** Research-style company description for Helios — Business Risk · Business Model (tabs: conclusion, metrics, S&W matrix). */
export default function HeliosBusinessModelPanel() {
  return (
    <article
      aria-label="Company description"
      style={{
        marginTop: 4,
        padding: "16px 18px 18px",
        borderRadius: 6,
        border: "0.5px solid var(--cd-border)",
        background: "var(--cd-surface-2)",
      }}
    >
      <h3
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
      </h3>
      <DeskTabs
        groupLabel="Business model — company description"
        tabLabels={BUSINESS_MODEL_TAB_LABELS}
        panels={[
          <WorkbenchConclusionList key="conc" items={BUSINESS_MODEL_CONCLUSION} />,
          <div key="km" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <WorkbenchMetricCard
              source="Public filing"
              label={<>Reported revenue scale (<span>FY2023</span>)</>}
              value="~USD 617m"
              sub="Midpoint of ~613–620m range"
              trend="TBC reasoning"
            />
            <WorkbenchMetricCard
              source="Public filing"
              label={<>Adj. EBITDA margin (<span>FY2023</span>)</>}
              value="~50%"
              sub="~USD 305–315m adj. EBITDA"
              trend="TBC reasoning"
            />
            <WorkbenchMetricCard
              source="Public filing"
              label={<>Tower sites (<span>31 Dec 2024</span>)</>}
              value="14,525"
              sub="9 African markets + Oman"
              trend="TBC reasoning"
            />
            <WorkbenchMetricCard
              source="Public filing"
              label={<>Tenancy ratio (<span>FY2024</span>)</>}
              value="2.03x"
              sub="Colocations per site"
              trend="TBC reasoning"
            />
          </div>,
          <div key="sw">
            <p style={{ fontSize: 12, lineHeight: 1.55, color: "var(--cd-text-2)", marginBottom: 14 }}>
              {page_2.subtitle}
            </p>
            <IndustryRiskMatrix
              page={page_2}
              caption="Strengths & weakness framing — FX, energy, and political risk (industry digest)"
            />
          </div>,
        ]}
      />
    </article>
  );
}
