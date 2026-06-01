import { DIGITAL_INFRASTRUCTURE_STACK, STACK_HUB_PATH } from "@/lib/dc-stack-reports";

export type StackEquityNoteSectionLabel =
  | "THE CALL"
  | "WHAT'S PRICED"
  | "THE STACK"
  | "THE GAP"
  | "THE TELL";

export type StackEquityNoteSection = {
  label: StackEquityNoteSectionLabel;
  body: string;
};

export type StackEquityNote = {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  deck: string;
  sections: StackEquityNoteSection[];
  source: string;
  href: string;
  releaseMonthLong: string;
  releaseMonthShort: string;
  releaseYear: string;
  region: string;
  description: string;
  tags: string[];
  /** Asset deep-dive card metadata when filter is ALL */
  pillar: string;
  categories: ("CONNECTIVITY" | "REAL_ASSETS" | "POWER" | "EXPERIENCE")[];
};

const BANKING_RERATING: StackEquityNote = {
  id: "banking-rerating",
  slug: "banking-rerating",
  eyebrow: "JUNE 2026 · FINANCIALS × AI",
  title: "The Banking Re-Rating Starts Here",
  subtitle: "Financials × AI · Mispricing call",
  deck: "The AI trade isn't in AI stocks only. It's in bank equity — and the market hasn't caught up.",
  sections: [
    {
      label: "THE CALL",
      body: "Scale premiums in bank equity and M&A valuations are increasingly mispriced. AI rewards operational precision, not balance-sheet heft. First movers stand to capture $250M–$500M in incremental annual profit per $100B in assets. The divergence is coming. The market hasn't priced it.",
    },
    {
      label: "WHAT'S PRICED",
      body: "Large-cap banks trade at premiums built on a longstanding assumption: bigger balance sheets equal better efficiency and superior shareholder returns. M&A multiples reward scale — the larger the target, the stronger the strategic rationale. The equity market is still largely pricing the heft model.",
    },
    {
      label: "THE STACK",
      body: "McKinsey's 2026 Global Banking Annual Review is direct: in the US, scale does not correlate to better bank performance. What AI rewards is precision — in M&A (acquiring for tech-stack fit and talent, not size), in capital deployment (AI-driven loan categorisation and risk-weighted asset optimisation), and in customer targeting (near-one-to-one engagement at segment level). Banks moving from pilot to production are already generating material operating leverage: call-centre handle times down as much as 75%, KYC workflows running with half the prior headcount. The physical constraint flows directly from the AI infrastructure layer — banks racing to scale AI implementation are competing for the same bottlenecked hyperscaler compute capacity this column tracks. Those with committed cloud-AI capacity contracts are a deployment cycle ahead.",
    },
    {
      label: "THE GAP",
      body: "A 20–25% cost improvement translates to $250M–$500M per $100B in assets — but competition will erode those gains. Industry-wide profit pools compress 9–10% over time. The equity advantage goes to first movers who capture the margin before it's competed out, then reinvest to take share from laggards. That window is short and narrowing.",
    },
    {
      label: "THE TELL",
      body: "Watch Q2–Q3 2026 bank earnings for operating leverage signals: cost-to-income ratios falling, high-volume workflow throughput rising. Watch M&A deal language — when acquirers start explicitly pricing tech-stack fit and AI talent over balance-sheet size, the re-rating begins.",
    },
  ],
  source:
    "The McKinsey Podcast — Move first or fall behind: How AI is rewriting the rules of banking, May 28, 2026.",
  href: `${STACK_HUB_PATH}/banking-rerating`,
  releaseMonthLong: "JUNE",
  releaseMonthShort: "JUN",
  releaseYear: "2026",
  region: "GLOBAL",
  description:
    "Bank equity scale premiums are mispriced versus AI-driven operating leverage — a mispricing call on financials × AI infrastructure constraints.",
  tags: ["#FINANCIALS", "#AI", "#BANKS", "#MISPRICING"],
  pillar: "STRATEGY",
  categories: ["EXPERIENCE", "POWER"],
};

/** Newest first — asset deep dives on the Digital Infrastructure Stack hub. */
export const STACK_EQUITY_NOTES: StackEquityNote[] = [BANKING_RERATING];

export function getStackEquityNote(slug: string): StackEquityNote | undefined {
  return STACK_EQUITY_NOTES.find((p) => p.slug === slug);
}

export function stackEquityNoteSidebarMetaLine(note: StackEquityNote): string {
  return `${note.releaseMonthLong} ${note.releaseYear} · ${note.region}`;
}

export function stackEquityNoteToLibraryModule(note: StackEquityNote) {
  return {
    id: note.id,
    title: note.title,
    subtitle: note.subtitle,
    description: note.deck,
    href: note.href,
    status: "Available" as const,
    pillar: note.pillar,
    releaseMonth: `${note.releaseMonthShort} ${note.releaseYear}`,
    tags: note.tags,
    categories: note.categories,
  };
}

/** Breadcrumb label for article pages */
export { DIGITAL_INFRASTRUCTURE_STACK };
