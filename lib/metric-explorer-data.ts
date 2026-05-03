export type MetricFactor =
  | "Value"
  | "Growth"
  | "Profitability"
  | "Momentum"
  | "Financial Strength";

export type ThresholdColor = "green" | "amber" | "red" | "violet";

export type MetricThreshold = {
  range: string;
  label: string;
  color: ThresholdColor;
};

export type MetricEntry = {
  factor: MetricFactor;
  name: string;
  fullName: string;
  formula: string;
  interp: string;
  thresholds: MetricThreshold[];
  value: string;
  /** Optional short hint next to the metric name in the left list (prototype parity). */
  hint?: string;
};

export const METRIC_FACTORS: MetricFactor[] = [
  "Value",
  "Growth",
  "Profitability",
  "Momentum",
  "Financial Strength",
];

/** Design reference: handoff README — 27 metrics for Dorrsum scoring tooltips. */
export const METRIC_DATA = {
  pe_ttm: {
    factor: "Value",
    name: "P/E TTM",
    hint: "Price / Earnings",
    fullName: "Price / Earnings — Trailing 12 Months",
    formula: "Price per Share ÷ EPS (trailing 12 months)",
    interp:
      "How much you pay per $1 of trailing profit. Below 15× = cheap; 15–25× = fair; above 30× = growth premium being paid. Always compare within sector.",
    thresholds: [
      { range: "< 15×", label: "Cheap", color: "green" },
      { range: "15–30×", label: "Fair", color: "amber" },
      { range: "> 30×", label: "Premium", color: "red" },
    ],
    value: "48.1×",
  },
  fwd_pe: {
    factor: "Value",
    name: "Forward P/E",
    hint: "NTM",
    fullName: "Price / Consensus EPS — Next 12 Months",
    formula: "Price per Share ÷ Consensus EPS (NTM)",
    interp:
      "Valuation based on expected earnings. Lower forward vs. TTM P/E implies earnings growth priced in. Watch revision risk — analyst cuts re-rate forward P/E upward immediately.",
    thresholds: [
      { range: "< 15×", label: "Cheap", color: "green" },
      { range: "15–25×", label: "Fair", color: "amber" },
      { range: "> 25×", label: "Premium", color: "red" },
    ],
    value: "30.7×",
  },
  ev_ebitda: {
    factor: "Value",
    name: "EV/EBITDA",
    fullName: "Enterprise Value / EBITDA",
    formula: "(Market Cap + Debt − Cash) ÷ EBITDA",
    interp:
      "Capital-structure neutral valuation. More useful than P/E when comparing leveraged vs. cash-rich peers.",
    thresholds: [
      { range: "< 10×", label: "Cheap", color: "green" },
      { range: "10–18×", label: "Fair", color: "amber" },
      { range: "> 25×", label: "Premium", color: "red" },
    ],
    value: "43.8×",
  },
  peg: {
    factor: "Value",
    name: "PEG",
    hint: "Price / Earnings-to-Growth",
    fullName: "Price / Earnings-to-Growth Ratio",
    formula: "Forward P/E ÷ EPS Growth Rate (%)",
    interp:
      "Below 1× = growth not yet priced in. 1–2× = fairly valued. Above 2× = growth already in the price. Negative EPS growth = ratio meaningless, treat as n/a.",
    thresholds: [
      { range: "< 1×", label: "Underpriced", color: "green" },
      { range: "1–2×", label: "Fair", color: "amber" },
      { range: "> 2×", label: "Overpriced", color: "red" },
    ],
    value: "2.25×",
  },
  pb: {
    factor: "Value",
    name: "P/B",
    hint: "Price / Book",
    fullName: "Price / Book Value",
    formula: "Market Cap ÷ Total Shareholders' Equity",
    interp:
      "High P/B normal for asset-light monopolies — reflects intangible value, not overvaluation. Below 1× = trading at or below book.",
    thresholds: [
      { range: "< 1×", label: "At/below book", color: "green" },
      { range: "1–5×", label: "Normal", color: "amber" },
      { range: "> 10×", label: "Intangible-led", color: "violet" },
    ],
    value: "24.8×",
  },
  ps: {
    factor: "Value",
    name: "P/S",
    hint: "Price / Sales",
    fullName: "Price / Sales",
    formula: "Market Cap ÷ Annual Revenue",
    interp:
      "Useful when earnings are depressed. Below 2× = cheap; above 10× = high-growth premium. Compare within sector only.",
    thresholds: [
      { range: "< 2×", label: "Cheap", color: "green" },
      { range: "2–5×", label: "Normal", color: "amber" },
      { range: "> 10×", label: "Premium", color: "red" },
    ],
    value: "16.7×",
  },

  rev_yoy: {
    factor: "Growth",
    name: "Revenue YoY",
    fullName: "Revenue Year-on-Year Growth",
    formula: "(Revenue₁ − Revenue₀) ÷ Revenue₀",
    interp:
      "Top-line organic growth. Above 15% = strong for large-cap. Deceleration trend matters more than the number.",
    thresholds: [
      { range: "> 15%", label: "Strong", color: "green" },
      { range: "5–15%", label: "Moderate", color: "amber" },
      { range: "< 5%", label: "Weak", color: "red" },
    ],
    value: "+13.2%",
  },
  eps_yoy: {
    factor: "Growth",
    name: "EPS YoY",
    fullName: "Earnings Per Share Year-on-Year",
    formula: "(EPS₁ − EPS₀) ÷ EPS₀",
    interp:
      "EPS higher than revenue growth = margin expansion or buybacks. Negative EPS with positive revenue = red flag.",
    thresholds: [
      { range: "> 15%", label: "Strong", color: "green" },
      { range: "5–15%", label: "Moderate", color: "amber" },
      { range: "< 0%", label: "Contraction", color: "red" },
    ],
    value: "+19.2%",
  },
  fcf_yoy: {
    factor: "Growth",
    name: "FCF YoY",
    fullName: "Free Cash Flow Year-on-Year",
    formula: "(FCF₁ − FCF₀) ÷ FCF₀",
    interp:
      "Highest-quality growth signal — actual cash after capex. FCF growing faster than EPS = earnings quality improving.",
    thresholds: [
      { range: "> 15%", label: "Strong", color: "green" },
      { range: "0–15%", label: "Moderate", color: "amber" },
      { range: "< 0%", label: "Contraction", color: "red" },
    ],
    value: "+21.4%",
  },
  rev_cagr: {
    factor: "Growth",
    name: "Rev 3Y CAGR",
    fullName: "Revenue 3-Year CAGR",
    formula: "(Revenue₃ ÷ Revenue₀)^(1/3) − 1",
    interp:
      "Smoothed 3-year revenue growth. Preferred over YoY for structural assessment. Above 10% = solid for large-cap.",
    thresholds: [
      { range: "> 10%", label: "Solid", color: "green" },
      { range: "5–10%", label: "Moderate", color: "amber" },
      { range: "< 5%", label: "Weak", color: "red" },
    ],
    value: "+15.6%",
  },
  eps_cagr: {
    factor: "Growth",
    name: "EPS 3Y CAGR",
    fullName: "EPS 3-Year CAGR",
    formula: "(EPS₃ ÷ EPS₀)^(1/3) − 1",
    interp:
      "EPS CAGR much higher than Rev CAGR = margin expansion or buybacks — identify which. Buyback-driven EPS growth is less durable.",
    thresholds: [
      { range: "> 10%", label: "Solid", color: "green" },
      { range: "5–10%", label: "Moderate", color: "amber" },
      { range: "< 5%", label: "Weak", color: "red" },
    ],
    value: "+15.4%",
  },

  gross_margin: {
    factor: "Profitability",
    name: "Gross Margin",
    fullName: "Gross Profit as % of Revenue",
    formula: "(Revenue − COGS) ÷ Revenue",
    interp:
      "Above 50% = strong pricing power or asset-light model. Declining gross margin on rising revenue = pricing pressure or input cost inflation.",
    thresholds: [
      { range: "> 50%", label: "Strong", color: "green" },
      { range: "30–50%", label: "Normal", color: "amber" },
      { range: "< 30%", label: "Weak", color: "red" },
    ],
    value: "52.6%",
  },
  op_margin: {
    factor: "Profitability",
    name: "Operating Margin",
    fullName: "EBIT as % of Revenue",
    formula: "EBIT ÷ Revenue",
    interp:
      "Above 25% = excellent for industrials/semis. Declining margin on rising revenue = cost structure not scaling.",
    thresholds: [
      { range: "> 25%", label: "Excellent", color: "green" },
      { range: "10–25%", label: "Normal", color: "amber" },
      { range: "< 10%", label: "Thin", color: "red" },
    ],
    value: "36.0%",
  },
  ebitda_margin: {
    factor: "Profitability",
    name: "EBITDA Margin",
    fullName: "EBITDA as % of Revenue",
    formula: "EBITDA ÷ Revenue",
    interp:
      "Large gap vs. operating margin signals heavy asset base with significant D&A — relevant for tower REITs and DC builders.",
    thresholds: [
      { range: "> 30%", label: "Strong", color: "green" },
      { range: "15–30%", label: "Decent", color: "amber" },
      { range: "< 15%", label: "Thin", color: "red" },
    ],
    value: "37.7%",
  },
  roe: {
    factor: "Profitability",
    name: "ROE",
    hint: "Return on Equity",
    fullName: "Return on Equity",
    formula: "Net Income ÷ Shareholders' Equity",
    interp:
      "Above 15% = good; above 30% = exceptional. High ROE with high debt = leverage-inflated — always check D/E alongside.",
    thresholds: [
      { range: "> 15%", label: "Good", color: "green" },
      { range: "> 30%", label: "Exceptional", color: "violet" },
      { range: "< 8%", label: "Poor", color: "red" },
    ],
    value: "52.2%",
  },
  roic: {
    factor: "Profitability",
    name: "ROIC",
    hint: "Return on Invested Capital",
    fullName: "Return on Invested Capital",
    formula: "NOPAT ÷ (Equity + Debt − Cash)",
    interp:
      "ROIC > WACC = value creation. ROIC < WACC = value destruction regardless of headline profits. The cleanest quality signal.",
    thresholds: [
      { range: "> WACC", label: "Value creation", color: "green" },
      { range: "≈ WACC", label: "Neutral", color: "amber" },
      { range: "< WACC", label: "Value destruction", color: "red" },
    ],
    value: "21.9%",
  },
  fcf_yield: {
    factor: "Profitability",
    name: "FCF Yield",
    fullName: "Free Cash Flow Yield",
    formula: "FCF Per Share ÷ Share Price",
    interp:
      "Above 5% = attractive; below 2% = priced for high growth. Low FCF yield acceptable when FCF CAGR is strong.",
    thresholds: [
      { range: "> 5%", label: "Attractive", color: "green" },
      { range: "2–5%", label: "Moderate", color: "amber" },
      { range: "< 2%", label: "Growth priced in", color: "violet" },
    ],
    value: "1.7%",
  },

  ret_3m: {
    factor: "Momentum",
    name: "3M Return",
    fullName: "3-Month Price Return",
    formula: "(Price₀ − Price₋₃ₘ) ÷ Price₋₃ₘ",
    interp:
      "Short-term signal. Weak short-term with strong 6M+ can indicate consolidation — often a good entry point.",
    thresholds: [
      { range: "> 5%", label: "Positive", color: "green" },
      { range: "-5–5%", label: "Flat", color: "amber" },
      { range: "< -5%", label: "Negative", color: "red" },
    ],
    value: "+5.1%",
  },
  ret_6m: {
    factor: "Momentum",
    name: "6M Return",
    fullName: "6-Month Price Return",
    formula: "(Price₀ − Price₋₆ₘ) ÷ Price₋₆ₘ",
    interp:
      "Core momentum signal per Jegadeesh-Titman. 6M and 9M windows are most predictive in academic literature.",
    thresholds: [
      { range: "> 10%", label: "Strong", color: "green" },
      { range: "0–10%", label: "Moderate", color: "amber" },
      { range: "< 0%", label: "Negative", color: "red" },
    ],
    value: "+44.5%",
  },
  ret_9m: {
    factor: "Momentum",
    name: "9M Return",
    fullName: "9-Month Price Return",
    formula: "(Price₀ − Price₋₉ₘ) ÷ Price₋₉ₘ",
    interp:
      "Primary momentum signal in Dorrsum model. 6–12M past returns predict future outperformance more than any other window.",
    thresholds: [
      { range: "> 15%", label: "Strong", color: "green" },
      { range: "0–15%", label: "Moderate", color: "amber" },
      { range: "< 0%", label: "Negative", color: "red" },
    ],
    value: "+102.2%",
  },
  ret_12m: {
    factor: "Momentum",
    name: "12M Return",
    fullName: "12-Month Price Return",
    formula: "(Price₀ − Price₋₁₂ₘ) ÷ Price₋₁₂ₘ",
    interp:
      "Full-year trend. Excludes most recent month (standard construction) to avoid short-term reversal contamination.",
    thresholds: [
      { range: "> 20%", label: "Strong", color: "green" },
      { range: "0–20%", label: "Moderate", color: "amber" },
      { range: "< 0%", label: "Negative", color: "red" },
    ],
    value: "+117.1%",
  },
  ytd: {
    factor: "Momentum",
    name: "YTD",
    fullName: "Year-to-Date Return",
    formula: "(Price₀ − Price Jan 1) ÷ Price Jan 1",
    interp:
      "Calendar-year return. Less useful for momentum (window varies) but relevant for portfolio reporting.",
    thresholds: [
      { range: "> 10%", label: "Strong", color: "green" },
      { range: "0–10%", label: "Positive", color: "amber" },
      { range: "< 0%", label: "Negative", color: "red" },
    ],
    value: "+25.4%",
  },
  off_52w: {
    factor: "Momentum",
    name: "Off 52w High",
    fullName: "Distance from 52-Week High",
    formula: "(Price₀ − 52-Week High) ÷ 52-Week High",
    interp:
      "Near 0% = at highs (strong signal). Below −20% = meaningful drawdown. The 52-week high effect: stocks near highs tend to continue outperforming.",
    thresholds: [
      { range: "> -5%", label: "Near highs", color: "green" },
      { range: "-5–-20%", label: "Pullback", color: "amber" },
      { range: "< -20%", label: "Drawdown", color: "red" },
    ],
    value: "−5.8%",
  },

  net_debt: {
    factor: "Financial Strength",
    name: "Net Debt",
    fullName: "Total Debt minus Cash & Equivalents",
    formula: "Total Debt − Cash & Equivalents",
    interp:
      "Negative = net cash (fortress). Critical for DC builders and tower REITs where debt load can be existential in a rate shock.",
    thresholds: [
      { range: "< 0", label: "Net cash", color: "green" },
      { range: "0–2× EBITDA", label: "Moderate", color: "amber" },
      { range: "> 4× EBITDA", label: "High leverage", color: "red" },
    ],
    value: "−$5.7B",
  },
  nd_ebitda: {
    factor: "Financial Strength",
    name: "Net Debt / EBITDA",
    fullName: "Leverage Turns",
    formula: "Net Debt ÷ EBITDA",
    interp:
      "Below 2× = conservative; 2–4× = moderate; above 5× = high-yield territory. Primary disqualifier lever for the Financial Strength factor.",
    thresholds: [
      { range: "< 2×", label: "Conservative", color: "green" },
      { range: "2–4×", label: "Moderate", color: "amber" },
      { range: "> 5×", label: "High-yield", color: "red" },
    ],
    value: "−0.45×",
  },
  int_cov: {
    factor: "Financial Strength",
    name: "Interest Coverage",
    fullName: "Interest Coverage Ratio",
    formula: "EBIT ÷ Interest Expense",
    interp:
      "Below 3× = distress risk; 3–5× = adequate; above 10× = comfortable. Below 1.5× triggers disqualifier.",
    thresholds: [
      { range: "> 10×", label: "Comfortable", color: "green" },
      { range: "3–10×", label: "Adequate", color: "amber" },
      { range: "< 3×", label: "Distress risk", color: "red" },
    ],
    value: "145×",
  },
  current_ratio: {
    factor: "Financial Strength",
    name: "Current Ratio",
    fullName: "Short-term Liquidity",
    formula: "Current Assets ÷ Current Liabilities",
    interp:
      "Above 1.5× = healthy; below 1× = potential liquidity squeeze. 1.5–2.5× is normal for capital-equipment companies.",
    thresholds: [
      { range: "> 1.5×", label: "Healthy", color: "green" },
      { range: "1–1.5×", label: "Adequate", color: "amber" },
      { range: "< 1×", label: "Squeeze risk", color: "red" },
    ],
    value: "1.8",
  },
  de: {
    factor: "Financial Strength",
    name: "Debt / Equity",
    fullName: "Debt-to-Equity Ratio",
    formula: "Total Debt ÷ Shareholders' Equity",
    interp:
      "Below 0.5× = conservative; 0.5–1× = moderate; above 2× = highly leveraged. Infrastructure often runs 2–4× intentionally.",
    thresholds: [
      { range: "< 0.5×", label: "Conservative", color: "green" },
      { range: "0.5–2×", label: "Moderate", color: "amber" },
      { range: "> 3×", label: "High leverage", color: "red" },
    ],
    value: "0.34",
  },
  cash: {
    factor: "Financial Strength",
    name: "Cash & Equivalents",
    fullName: "Absolute Liquidity Buffer",
    formula: "Cash + Short-term investments (balance sheet)",
    interp:
      "Most meaningful relative to annual capex and near-term debt maturities. Large cash eliminates refinancing risk.",
    thresholds: [
      { range: "> 2yr capex", label: "Fortress", color: "green" },
      { range: "1–2yr capex", label: "Adequate", color: "amber" },
      { range: "< 1yr capex", label: "Watch closely", color: "red" },
    ],
    value: "$8.4B",
  },
} as const satisfies Record<string, MetricEntry>;

export type MetricKey = keyof typeof METRIC_DATA;

export function metricsForFactor(factor: MetricFactor): [MetricKey, MetricEntry][] {
  return (Object.entries(METRIC_DATA) as [MetricKey, MetricEntry][]).filter(
    ([, row]) => row.factor === factor,
  );
}
