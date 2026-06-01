/**
 * research-archive.ts
 *
 * Data for featured research briefs (e.g. home page hero carousel brief slides).
 * To add a new brief: prepend to RESEARCH_ARCHIVE (newest first).
 *
 * Keep excerpts short (1–3 sentences, < ~220 chars) so they render cleanly
 * inside brief preview cards.
 */

export type ResearchCategory =
  | "Credit Brief"
  | "Worldview"
  | "Sector Note"
  | "Capital Structure"
  | "Special Report";

export type ResearchArtifact = {
  /** Stable slug — used as the React key. */
  id: string;

  /** Short category chip (top-left of the card). */
  category: ResearchCategory;

  /** Issue line, e.g. "Principal AI Credit Brief · No. 003". */
  issueLabel: string;

  /** Month + year the brief was released. */
  date: string;

  /** Headline rendered in serif display type. */
  title: string;

  /** 1–3 sentence body excerpt for the card preview. */
  excerpt: string;

  /** Contributor byline(s). Initials are fine (e.g. "S. Mondal"). */
  authors: string[];

  /** Optional — link to the full piece if published on site. */
  href?: string;

  /** Optional — page count, rendered as "14 pp" next to the date. */
  pages?: number;

  /**
   * Optional — gating tag surfaced on the card.
   * "open"   → anyone can read.
   * "teaser" → excerpt visible, full piece gated.
   * "client" → visible to authenticated clients only.
   */
  access?: "open" | "teaser" | "client";
};

/**
 * Newest first. Edit this array to grow the archive.
 */
export const RESEARCH_ARCHIVE: ResearchArtifact[] = [
  {
    id: "banking-rerating-2026",
    category: "Sector Note",
    issueLabel: "Principal AI · Digital Infrastructure Stack · JUN 2026",
    date: "June 2026",
    title: "The Banking Re-Rating Starts Here",
    excerpt:
      "The AI trade isn't only in AI stocks — bank equity scale premiums are mispriced versus operational precision and hyperscaler compute constraints.",
    authors: ["S. Mondal"],
    href: "/research/dc-infrastructure/banking-rerating",
    access: "open",
  },
  {
    id: "dc-worldview-2026",
    category: "Worldview",
    issueLabel: "Principal AI Worldview · No. 003",
    date: "April 2026",
    title:
      "Data centres are now an energy story. APAC investors are underpricing the transition.",
    excerpt:
      "Power availability, interconnect queues, and PPA bankability are becoming the dominant credit drivers across APAC hyperscale and colocation portfolios. The thesis argues pricing has not caught up.",
    authors: ["S. Mondal"],
    href: "/research/dc-infrastructure/worldview",
    pages: 18,
    access: "open",
  },
  {
    id: "dc-physical-stack-2026",
    category: "Sector Note",
    issueLabel: "Principal AI Sector Note · No. 002",
    date: "March 2026",
    title:
      "The physical stack of digital infrastructure: where covenants still fail to reach.",
    excerpt:
      "A walkthrough of the six physical layers — land, power, cooling, network, compute, contracts — and how standard lender covenants systematically miss two of them.",
    authors: ["S. Mondal"],
    href: "/research/dc-infrastructure/physical-stack",
    pages: 14,
    access: "open",
  },
  {
    id: "helios-towers-2026",
    category: "Credit Brief",
    issueLabel: "Principal AI Credit Brief · No. 001",
    date: "February 2026",
    title:
      "Helios Towers plc: tower credit resilience when currencies and tenants both move.",
    excerpt:
      "An independent credit assessment of Helios Towers, stress-testing USD-denominated MLAs against frontier-market FX and anchor-tenant concentration risk.",
    authors: ["S. Mondal"],
    href: "/research/helios-towers",
    pages: 12,
    access: "open",
  },
];
