import type { ReactNode } from "react";
import {
  FileText,
  Factory,
  Building2,
  Landmark,
  TrendingUp,
  Gauge,
  Layers,
  Shield,
  ArrowUpRight,
} from "lucide-react";
import NumberChip from "./NumberChip";

export type SectionId =
  | "exec"
  | "company"
  | "industry"
  | "business"
  | "financial"
  | "liquidity"
  | "cap-structure"
  | "bca"
  | "outlook";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IconComponent = React.ComponentType<any>;

export type CreditDeskSection = {
  id: SectionId;
  label: string;
  title: string;
  lede: string;
  Icon: IconComponent;
  body: [ReactNode, ReactNode, ReactNode];
};

const ACME_SECTIONS: CreditDeskSection[] = [
  {
    id: "exec",
    label: "Exec summary",
    title: "Exec summary",
    lede: "Adequate credit profile; near-term refinancing risk is the primary watch item.",
    Icon: FileText,
    body: [
      "Acme Corp demonstrates adequate credit fundamentals for a mid-market industrial operator, underpinned by stable recurring revenue and a diversified OEM customer base. EBITDA margin has been broadly resilient, with the most recent year reflecting modest compression from raw-material inflation and a one-off warranty provision.",
      "The principal credit concern is near-term refinancing risk on the 2027 senior secured notes (US$420m). Management has engaged two banks and appointed a financial adviser. Until the refinancing is documented, current leverage sits above the covenant step-down threshold and warrants close monitoring.",
      "The BCA of ba2 reflects an adequate business profile and an acceptable — though not comfortable — financial risk position. The stable outlook captures the expectation that Acme Corp will maintain covenant headroom through the refinancing window on the basis of modest revenue growth and flat-to-improving margins.",
    ],
  },
  {
    id: "company",
    label: "Company",
    title: "Company",
    lede: "Legal entity, operating footprint, and commercial positioning at a glance.",
    Icon: Landmark,
    body: [
      "Acme Corp is a Delaware corporation headquartered in the US Midwest, with manufacturing and distribution concentrated in owned and leased facilities across North America. The legal structure is operationally simple: a HoldCo stack with ring-fenced domestic operating subsidiaries and a single offshore IP holding company for legacy patents.",
      "Customer and supplier concentration is moderate: four OEM customers anchor the revenue base while raw-material suppliers are diversified across qualified vendors under annual contracts. Environmental and product-liability exposures are managed through insurance programmes and warranty reserves.",
      "This placeholder Company section will be replaced with issuer-specific structured fields (facilities, counterparties, governance) when the desk is wired to the data room.",
    ],
  },
  {
    id: "industry",
    label: "Industry",
    title: "Industry context",
    lede: "Mid-market industrial components; cyclical demand tied to OEM production and capex cycles.",
    Icon: Factory,
    body: [
      "The industrial components supply chain sits between raw materials (steel, aluminium, specialty alloys) and finished equipment OEMs. Pricing power is uneven: long-term supply agreements anchor volume, but pass-through of input costs can lag by one to two quarters, compressing margin in sharp commodity spikes.",
      "Sector capacity utilisation in North America and Europe has normalised post-pandemic; inventory destocking cycles in 2023–24 pressured order books for tier-two suppliers. Aerospace and defence sub-segments remain comparatively resilient, while automotive components face structural mix shift toward electrification.",
      "Consolidation among OEMs and tier-one integrators continues to raise qualification barriers and extend payment terms for mid-tier suppliers — a secular headwind to working capital that credit analysis treats as a recurring liquidity drag rather than a one-off shock.",
    ],
  },
  {
    id: "business",
    label: "Business Risk",
    title: "Business risk profile",
    lede: "Defensible supply-chain position underpinned by four long-term OEM contracts.",
    Icon: Building2,
    body: [
      "Acme Corp occupies a defensible mid-tier position in the industrial components supply chain, serving OEMs across automotive, aerospace, and heavy machinery verticals. Four anchor customers represent ~58% of annual revenue; switching costs are high given the qualification cycles required by OEM procurement.",
      "The domestic footprint spans two owned facilities (420k + 210k sq ft) supplemented by a Mexican contract manufacturer for capacity flexibility. The owned asset base is valued at ~US$340m on a depreciated replacement-cost basis, providing meaningful collateral support to the secured debt stack.",
      "Competitive headwinds are sharpest in automotive, where electrification is altering the component mix demanded by OEM customers. Management projects a 12–15% decline in legacy powertrain volume, partially offset by targeted R&D investment in EV thermal management and battery enclosure products.",
    ],
  },
  {
    id: "financial",
    label: "Financial",
    title: "Financial profile",
    lede: "Strong topline; leverage trending down with covenant headroom intact.",
    Icon: TrendingUp,
    body: [
      <>
        Revenue grew to <NumberChip tone="good">$2.41B</NumberChip> in FY25, up{" "}
        <NumberChip tone="good">+12.4%</NumberChip> YoY, driven by pricing actions in the
        industrial segment and modest volume uplift in aftermarket. Aerospace led at +8.1%;
        automotive declined -1.4% on powertrain softness.
      </>,
      <>
        EBITDA margin expanded to <NumberChip tone="good">18.2%</NumberChip> from 16.4%, the
        strongest print in five years. The improvement reflects operating leverage and moderation
        in raw-material costs following peak inflation in FY23.
      </>,
      <>
        Net leverage stood at <NumberChip tone="watch">3.8x</NumberChip> at year-end, down from
        4.2×, inside the <NumberChip tone="watch">4.5x</NumberChip> covenant. FCF conversion of
        35% is adequate; the 2027 note refinancing remains the material near-term constraint.
      </>,
    ],
  },
  {
    id: "liquidity",
    label: "Liquidity",
    title: "Liquidity position",
    lede: "Adequate twelve-month buffer; 2027 maturity is the structural tail risk.",
    Icon: Gauge,
    body: [
      "Liquidity is adequate for a twelve-month forward view: cash of US$142m plus US$184m undrawn on the revolving facility gives a combined buffer of US$326m — approximately 4.4× near-term scheduled maturities and committed capex.",
      "Near-term requirements are manageable: US$12m term loan amortisation in Q2 2026, ~US$19m semi-annual coupon in Q3 2026, and a US$8m deferred tax instalment. FY2026 capex of US$72m is back-half weighted, giving management pacing flexibility against working capital movements.",
      "The principal tail risk is the 2027 notes maturity. Should the high-yield market be unreceptive — on spread widening or deterioration in Acme Corp's own metrics — the company faces a compressed refinancing window. Management has engaged two relationship banks and appointed a financial adviser.",
    ],
  },
  {
    id: "cap-structure",
    label: "Cap structure",
    title: "Capital structure",
    lede: "Three-tranche structure; effective refinancing deadline pulled to November 2026.",
    Icon: Layers,
    body: [
      "The debt capital structure comprises US$420m 6.875% first-lien notes (due Feb 2027), a US$250m super-senior revolving credit facility (due Jul 2027), and a US$250m second-lien term loan (due Aug 2028). Total drawn debt is US$920m against an incurrence-test capacity of ~US$1.05bn.",
      "The security package includes a first-priority pledge over substantially all domestic assets, a share pledge over subsidiaries, and a springing mortgage over the two owned manufacturing facilities. The second-lien loan holds the same collateral on a subordinated basis under an intercreditor deed.",
      "The critical structural feature is the RCF springing maturity: if the first-lien notes are not refinanced 91 days ahead of their maturity, the RCF accelerates to that date — creating a de facto hard deadline of 3 November 2026 for the full debt structure.",
    ],
  },
  {
    id: "bca",
    label: "BCA",
    title: "BCA · ba2",
    lede: "Baa3 business profile and B1 financial risk, notched to ba2 on security quality.",
    Icon: Shield,
    body: [
      "The BCA of ba2 is derived from a two-dimensional scorecard: business profile and financial risk profile, with qualitative adjustments. The business profile is assessed at Baa3, reflecting Acme Corp's defensible competitive position, long-term customer relationships, and tangible asset backing, partially offset by sector cyclicality and EV transition risk.",
      "The financial risk profile assessment of B1 reflects leverage above the ba threshold midpoint, adequate but not strong FCF conversion, and near-term structural refinancing risk. The notching from B1 to ba2 is supported by the quality of the security package and a track record of accessing the institutional high-yield market over three prior refinancing cycles.",
      "No affiliate support uplift is incorporated. Acme Corp's majority sponsor — a mid-market PE vehicle — is not assessed to have a strong probability of providing extraordinary support in a stress scenario, given the fund's own leverage and lifecycle considerations.",
    ],
  },
  {
    id: "outlook",
    label: "Outlook",
    title: "Outlook · stable",
    lede: "Stable; Ba1 upgrade path if refinancing closes at ≤3.5× and margin recovers above 18.5%.",
    Icon: ArrowUpRight,
    body: [
      "The stable outlook reflects our expectation that Acme Corp completes the 2027 notes refinancing within the November 2026 accelerated window, and that leverage trends toward 3.8× by year-end FY2026 on modest EBITDA recovery and continued debt reduction from FCF.",
      "Upward pressure could emerge if the refinancing closes at ≤3.5× pro forma, sustained margin recovery above 18.5% on an LTM basis is demonstrated, or meaningful EV-adjacent revenue diversification reduces the structural exposure to legacy powertrain components — any of these in combination with continued positive FCF would be consistent with Ba1.",
      "Negative pressure would crystallise on a failed or materially delayed refinancing, EBITDA deterioration below US$190m LTM (leverage above 4.7×), or an unexpected liquidity event exceeding the current warranty provision accrual.",
    ],
  },
];

const HELIOS_SECTIONS: CreditDeskSection[] = [
  {
    id: "exec",
    label: "Exec summary",
    title: "Exec summary",
    lede:
      "Leading EM TowerCo; contractual revenue visibility offset by FX and refinancings across subsidiaries.",
    Icon: FileText,
    body: [
      "Helios Towers Africa plc operates passive mobile infrastructure across eight African markets under long-term master lease agreements (MLAs) with mobile network operators. Reported revenue scale and tenancy ratios support an adequate business risk assessment, while geographic diversification partly mitigates single-country regulatory shocks.",
      "Credit focus areas include refinancing calendars on subsidiary-level debt, currency mismatch between USD debt and local-currency tenant cash flows, and stepped-up capex for power resilience and passive equipment upgrades. Near-term liquidity is supported by committed RCF capacity and staggered maturity towers.",
      "The indicative BCA shown here is placeholder scaffolding — slice 2 will replace with model-linked outputs. The stable trend chip mirrors management guidance on covenant compliance through the forward twelve months under our placeholder stress assumptions.",
    ],
  },
  {
    id: "company",
    label: "Company",
    title: "Company",
    lede: "Issuer description, footprint, counterparties, and strategy — detailed figures view.",
    Icon: Landmark,
    body: [
      "Helios Towers Africa plc (LSE: HTWS) is the primary listed vehicle for the group’s passive tower operations across Africa and Oman. The detailed two-column snapshot on this tab summarises activities, scale, key customers, ownership, and stated strategic priorities in desk-ready form.",
      "Figures are indicative and aligned to the same narrative pack used in the Business Risk → Business Model tabs (conclusion, key metrics, strengths & weakness matrix). Replace with live extracts when the pipeline syncs.",
      "Use Industry for sector risk framing and Business Risk for operating, asset, and profitability analysis layered on top of this company snapshot.",
    ],
  },
  {
    id: "industry",
    label: "Industry",
    title: "Industry context",
    lede: "Passive mobile infrastructure; long MLA tenors; EM growth and regulatory variation.",
    Icon: Factory,
    body: [
      "The independent tower industry monetises shared passive sites (steel, power, security) under inflation-linked or escalator clauses in master lease agreements with mobile network operators. Revenue quality hinges on tenant credit, colocation uptake, and local grid reliability rather than retail subscriber churn.",
      "APAC and Africa remain the highest-growth regions for tenancy adds, while mature European markets skew toward consolidation and sale-leaseback of operator-owned towers. Regulatory risk includes spectrum policy, tower-sharing mandates, and one-off licence or safety compliance costs.",
      "Competitive intensity is moderate: scale and local relationships matter more than product differentiation. Fibre-to-the-tower and small-cell densification are adjacent threats over a multi-year horizon but rarely displace macro towers in the credit-relevant window for this placeholder review.",
    ],
  },
  {
    id: "business",
    label: "Business Risk",
    title: "Business risk profile",
    lede: "Collocation-led tenancy growth; anchor MNOs underpin contracted revenue.",
    Icon: Building2,
    body: [
      "Helios Towers derives revenue primarily from tower lease fees, energy pass-throughs where applicable, and colocation additions on existing sites. Operational KPIs centre on tenancy ratio per tower, churn among anchor tenants, and build-to-suit pipeline conversion.",
      "Competitive positioning varies by market: in some geographies Helios is a top-three independent TowerCo; in others it shares infrastructure with state-affiliated operators or emerging fibre-backhaul alternatives. Regulatory fees and licence renewals remain recurring negotiation points.",
      "Capital intensity is moderate relative to manufacturing industrials but recurring — power systems, structural reinforcement, and security upgrades drive maintenance capex. Pass-through mechanisms in MLAs partly shield gross margin but working capital can swing with fuel and grid reliability.",
    ],
  },
  {
    id: "financial",
    label: "Financial",
    title: "Financial profile",
    lede: "High EBITDA margin TowerCo economics; leverage elevated vs industrial peers.",
    Icon: TrendingUp,
    body: [
      <>
        Reported revenue reached <NumberChip tone="good">$2.08B</NumberChip> in FY24, up{" "}
        <NumberChip tone="good">+8.2%</NumberChip> YoY on constant-currency tenancy additions and
        selective escalation clauses. Organic growth offset modest churn in two mature markets.
      </>,
      <>
        Adjusted EBITDA margin held at <NumberChip tone="good">61.5%</NumberChip>, consistent with
        TowerCo benchmarks — scale economies on shared tenancies and operational efficiency
        programmes offset higher diesel-backup costs in grid-unstable regions.
      </>,
      <>
        Net leverage finished at <NumberChip tone="watch">4.1x</NumberChip>, versus a springing
        covenant threshold near <NumberChip tone="watch">4.75x</NumberChip> on the senior secured
        stack (placeholder terms). FX translation on USD reporting adds quarter-to-quarter noise.
      </>,
    ],
  },
  {
    id: "liquidity",
    label: "Liquidity",
    title: "Liquidity position",
    lede: "RCF headroom adequate; subsidiary bullet maturities need rolling twelve-month monitoring.",
    Icon: Gauge,
    body: [
      "Consolidated liquidity includes unrestricted cash and fully available revolving capacity after LC usage — sufficient under the placeholder base case to cover the next four quarters of amortisation, interest, and ordinary capex.",
      "Material cash uses include acquisition earn-outs in select markets, integration capex on acquired portfolios, and discretionary tower augmentations tied to colocation contracts. Management has curtailed discretionary programmes when leverage approaches internal guardrails.",
      "Refinancing risk is tied to bullet structures at certain subsidiaries; coordination with relationship banks and liability management exercises are the typical mitigants. Slice 2 will map concrete maturity dates and documentary covenants.",
    ],
  },
  {
    id: "cap-structure",
    label: "Cap structure",
    title: "Capital structure",
    lede: "Multi-currency secured debt stack; structural subordination at HoldCo vs OpCo.",
    Icon: Layers,
    body: [
      "The group employs secured notes and term loans at HoldCo and operating-company levels, with cross-guarantee and collateral pools differing by jurisdiction. Intercreditor arrangements govern enforcement waterfalls across shared security.",
      "Hedging policy partially covers FX exposure on coupon and principal on USD instruments; residual translation risk remains on local-currency EBITDA when reported in USD.",
      "Maturity walls are managed through a combination of amend-and-extend transactions and opportunistic market windows. Placeholder view: no single quarter concentrates more than ~25% of total debt maturities — subject to verification in slice 2.",
    ],
  },
  {
    id: "bca",
    label: "BCA",
    title: "BCA · ba2 (placeholder)",
    lede: "Business strength from contracted revenue; financial profile constrained by leverage.",
    Icon: Shield,
    body: [
      "The placeholder BCA blends an adequate business profile — anchored by MLAs and visible tenancy cash flows — with a financial risk assessment that reflects elevated leverage versus investment-grade TowerCo peers and FX volatility.",
      "Qualitative factors include regulatory stability by country, tenant concentration among top MNOs, and history of covenant compliance. Negative adjustments could arise from sustained currency depreciation without tariff recovery or from adverse MLA renegotiations.",
      "No sovereign uplift is incorporated at this scaffolding stage; government-related payment delays would flow through counterparty risk rather than explicit support assumptions.",
    ],
  },
  {
    id: "outlook",
    label: "Outlook",
    title: "Outlook · stable (placeholder)",
    lede: "Stable contingent on refinancing progression and FX staying inside stress bands.",
    Icon: ArrowUpRight,
    body: [
      "The stable outlook assumes tenancy growth remains positive on a net basis, leverage trends modestly lower from EBITDA growth rather than debt paydown alone, and subsidiary refinancings close without material covenant resets.",
      "Upgrade sensitivity would include sustained leverage below 3.5× with hedged FX, diversified tenant mix reducing single-MNO reliance, and demonstrated access to multiple debt markets across jurisdictions.",
      "Downgrade triggers could include covenant tightness under a prolonged EM FX shock, failed refinancing at a material subsidiary, or regulatory actions that impair MLA economics in a core market.",
    ],
  },
];

export function getCreditDeskSections(slug: string): CreditDeskSection[] {
  const key = slug.trim().toLowerCase();
  if (key === "helios-towers") return HELIOS_SECTIONS;
  return ACME_SECTIONS;
}
