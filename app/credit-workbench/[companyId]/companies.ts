export type CreditDeskCompany = {
  slug: string;
  /** Full line as shown in entity finder — legal name + listing */
  displayLine: string;
  sector: string;
  initials: string;
  period: string;
  lastSpread: string;
  /** Lowercase substring match for typeahead (name, ticker, venue, aliases) */
  searchBlob: string;
  sensitivityRows: { label: string; value: string; pos: number }[];
  chart: {
    lastLabel: string;
    pts: [number, number][];
  };
};

export const CREDIT_DESK_COMPANIES: CreditDeskCompany[] = [
  {
    slug: "acme",
    displayLine: "Acme Corp (NYSE: ACM)",
    sector: "Industrials",
    initials: "AC",
    period: "FY2025",
    lastSpread: "2 May 2026",
    searchBlob:
      "acme corp nyse acm industrial manufacturing usa american chemical machinery",
    sensitivityRows: [
      { label: "Revenue growth", value: "+12.4%", pos: 62 },
      { label: "EBITDA margin", value: "18.2%", pos: 58 },
      { label: "Leverage", value: "3.8×", pos: 68 },
    ],
    chart: {
      lastLabel: "18.2%",
      pts: [
        [36, 54],
        [114, 38],
        [192, 24],
        [270, 30],
        [348, 28],
      ],
    },
  },
  {
    slug: "helios-towers",
    displayLine: "Helios Towers plc (LON: HTWS)",
    sector: "Telecom / tower infrastructure",
    initials: "HT",
    period: "FY2025",
    lastSpread: "4 May 2026",
    searchBlob:
      "helios towers africa plc lon htws london telecom tower towerco htws.l wireless passive infrastructure",
    sensitivityRows: [
      { label: "Revenue growth", value: "+7.8%", pos: 52 },
      { label: "EBITDA margin", value: "55.2%", pos: 62 },
      { label: "Leverage", value: "3.4×", pos: 48 },
    ],
    chart: {
      // Adj EBITDA margin FY21–FY25; FY23–25 from digest, FY21/22 estimated
      lastLabel: "55.2%",
      pts: [
        [36, 52],   // FY21 ~46.5% est
        [114, 46],  // FY22 ~49.1% est
        [192, 38],  // FY23 51.3% confirmed
        [270, 32],  // FY24 53.0% confirmed
        [348, 26],  // FY25 55.2% confirmed
      ],
    },
  },
];

export function resolveCreditDeskCompany(slug: string): CreditDeskCompany | undefined {
  const key = slug.trim().toLowerCase();
  return CREDIT_DESK_COMPANIES.find((c) => c.slug === key);
}

export function filterCompaniesByQuery(query: string): CreditDeskCompany[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...CREDIT_DESK_COMPANIES];
  return CREDIT_DESK_COMPANIES.filter(
    (c) =>
      c.displayLine.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q) ||
      c.slug.includes(q) ||
      c.searchBlob.includes(q)
  );
}
