/**
 * Ticker metadata and filter helpers for the Digital Infrastructure Universe map.
 * @see handoff universe-filter/README.md
 */

export type FilterGroup = "exchange" | "region" | "band";

export type ExchangeKey = "nasdaq" | "tokyo" | "euronext" | "hk" | "nse";
export type RegionKey = "us" | "apac" | "eu";
/** Supply-chain + capital layer band as stored on tickers in TICKER_META */
export type TickerBandKey = "capital" | "silicon" | "buildout" | "energy" | "connectivity" | "compute";
/** Subnode / filter bar band (excludes financing — cards use `financing`, tickers use `capital`) */
export type FilterBandKey = "silicon" | "buildout" | "energy" | "connectivity" | "compute";

export interface FilterState {
  exchange: "all" | ExchangeKey;
  region: "all" | RegionKey;
  /** Supply-chain band only; financing row is hidden when any specific band is selected */
  band: "all" | FilterBandKey;
  holdings: boolean;
  query: string;
}

export type TickerMeta = {
  exchange: ExchangeKey;
  region: RegionKey;
  band: TickerBandKey;
  held: boolean;
};

export const DEFAULT_FILTER_STATE: FilterState = {
  exchange: "all",
  region: "all",
  band: "all",
  holdings: false,
  query: "",
};

/** Curated overrides; unknown tickers use `inferExchange` / `inferRegion` / card band. */
export const TICKER_META: Record<string, TickerMeta> = {
  JPM: { exchange: "nasdaq", region: "us", band: "capital", held: false },
  GS: { exchange: "nasdaq", region: "us", band: "capital", held: false },
  MS: { exchange: "nasdaq", region: "us", band: "capital", held: false },
  OWL: { exchange: "nasdaq", region: "us", band: "capital", held: false },
  APO: { exchange: "nasdaq", region: "us", band: "capital", held: false },
  ARES: { exchange: "nasdaq", region: "us", band: "capital", held: false },
  BX: { exchange: "nasdaq", region: "us", band: "capital", held: false },
  KKR: { exchange: "nasdaq", region: "us", band: "capital", held: false },
  BN: { exchange: "nasdaq", region: "us", band: "capital", held: false },
  ASML: { exchange: "euronext", region: "eu", band: "silicon", held: true },
  AMAT: { exchange: "nasdaq", region: "us", band: "silicon", held: false },
  LRCX: { exchange: "nasdaq", region: "us", band: "silicon", held: false },
  KLAC: { exchange: "nasdaq", region: "us", band: "silicon", held: false },
  "8035.T": { exchange: "tokyo", region: "apac", band: "silicon", held: false },
  ASM: { exchange: "euronext", region: "eu", band: "silicon", held: false },
  NVDA: { exchange: "nasdaq", region: "us", band: "silicon", held: true },
  AMD: { exchange: "nasdaq", region: "us", band: "silicon", held: false },
  AVGO: { exchange: "nasdaq", region: "us", band: "silicon", held: true },
  TSM: { exchange: "nasdaq", region: "apac", band: "silicon", held: false },
  INTC: { exchange: "nasdaq", region: "us", band: "silicon", held: false },
  VRT: { exchange: "nasdaq", region: "us", band: "buildout", held: false },
  "SU.PA": { exchange: "euronext", region: "eu", band: "buildout", held: false },
  ETN: { exchange: "nasdaq", region: "us", band: "buildout", held: false },
  CMI: { exchange: "nasdaq", region: "us", band: "buildout", held: false },
  GNRC: { exchange: "nasdaq", region: "us", band: "buildout", held: false },
  CAT: { exchange: "nasdaq", region: "us", band: "buildout", held: false },
  PWR: { exchange: "nasdaq", region: "us", band: "buildout", held: false },
  EME: { exchange: "nasdaq", region: "us", band: "buildout", held: false },
  DUK: { exchange: "nasdaq", region: "us", band: "energy", held: false },
  D: { exchange: "nasdaq", region: "us", band: "energy", held: false },
  SO: { exchange: "nasdaq", region: "us", band: "energy", held: false },
  CEG: { exchange: "nasdaq", region: "us", band: "energy", held: false },
  VST: { exchange: "nasdaq", region: "us", band: "energy", held: false },
  NEE: { exchange: "nasdaq", region: "us", band: "energy", held: false },
  AMT: { exchange: "nasdaq", region: "us", band: "connectivity", held: false },
  CCI: { exchange: "nasdaq", region: "us", band: "connectivity", held: false },
  SBAC: { exchange: "nasdaq", region: "us", band: "connectivity", held: false },
  LUMN: { exchange: "nasdaq", region: "us", band: "connectivity", held: false },
  FYBR: { exchange: "nasdaq", region: "us", band: "connectivity", held: false },
  CSCO: { exchange: "nasdaq", region: "us", band: "connectivity", held: false },
  MSFT: { exchange: "nasdaq", region: "us", band: "compute", held: false },
  GOOGL: { exchange: "nasdaq", region: "us", band: "compute", held: false },
  AMZN: { exchange: "nasdaq", region: "us", band: "compute", held: false },
  BABA: { exchange: "hk", region: "apac", band: "compute", held: false },
  "0700.HK": { exchange: "hk", region: "apac", band: "compute", held: false },
  BIDU: { exchange: "nasdaq", region: "apac", band: "compute", held: false },
  META: { exchange: "nasdaq", region: "us", band: "compute", held: false },
  // India (NSE) — Band 02 Build-out
  "LT.NS":           { exchange: "nse", region: "apac", band: "buildout",     held: false },
  "BLUESTARCO.NS":   { exchange: "nse", region: "apac", band: "buildout",     held: false },
  "KPIL.NS":         { exchange: "nse", region: "apac", band: "buildout",     held: false },
  "KEC.NS":          { exchange: "nse", region: "apac", band: "buildout",     held: false },
  // India (NSE) — Band 03 Energy
  "TATAPOWER.NS":    { exchange: "nse", region: "apac", band: "energy",       held: false },
  "NTPC.NS":         { exchange: "nse", region: "apac", band: "energy",       held: false },
  "ADANIGREEN.NS":   { exchange: "nse", region: "apac", band: "energy",       held: false },
  "ADANIPOWER.NS":   { exchange: "nse", region: "apac", band: "energy",       held: false },
  "POWERGRID.NS":    { exchange: "nse", region: "apac", band: "energy",       held: false },
  // India (NSE) — Band 04 Connectivity
  "INDUSTOWER.NS":   { exchange: "nse", region: "apac", band: "connectivity", held: false },
  "BHARTIARTL.NS":   { exchange: "nse", region: "apac", band: "connectivity", held: false },
  "TATACOMM.NS":     { exchange: "nse", region: "apac", band: "connectivity", held: false },
  "STLTECH.NS":      { exchange: "nse", region: "apac", band: "connectivity", held: false },
  // India (NSE) — Band 05 Compute
  "TCS.NS":          { exchange: "nse", region: "apac", band: "compute",      held: false },
  "INFY.NS":         { exchange: "nse", region: "apac", band: "compute",      held: false },
  "WIPRO.NS":        { exchange: "nse", region: "apac", band: "compute",      held: false },
  "HCLTECH.NS":      { exchange: "nse", region: "apac", band: "compute",      held: false },
  "TECHM.NS":        { exchange: "nse", region: "apac", band: "compute",      held: false },
  "RELIANCE.NS":     { exchange: "nse", region: "apac", band: "compute",      held: false },
};

export function inferExchange(symbol: string): ExchangeKey {
  const s = symbol.toUpperCase();
  if (/\.T$/.test(s)) return "tokyo";
  if (/\.HK$/.test(s)) return "hk";
  if (/\.(PA|AS|BR|MI|DE|SW|MC|LS)$/.test(s)) return "euronext";
  if (/\.L$/.test(s)) return "euronext";
  if (/\.NS$/.test(s)) return "nse";
  return "nasdaq";
}

export function inferRegion(geo: string): RegionKey {
  const g = geo.toUpperCase();
  if (g === "EU") return "eu";
  if (g === "APAC" || g === "EM") return "apac";
  return "us";
}

function tickerBandFromMetaOrCard(cardBand: string): TickerBandKey {
  if (cardBand === "financing") return "capital";
  return cardBand as TickerBandKey;
}

export type TickerMatchContext = {
  name: string;
  geo: string;
  held: boolean;
  /** SUBNODES[id].band */
  cardBand: string;
};

export function tickerMatches(symbol: string, filters: FilterState, ctx: TickerMatchContext): boolean {
  const meta = TICKER_META[symbol];
  const exchange = meta?.exchange ?? inferExchange(symbol);
  const region = meta?.region ?? inferRegion(ctx.geo);
  const bandT = meta?.band ?? tickerBandFromMetaOrCard(ctx.cardBand);
  const held = meta?.held !== undefined ? meta.held : ctx.held;

  if (filters.exchange !== "all" && exchange !== filters.exchange) return false;
  if (filters.region !== "all" && region !== filters.region) return false;
  if (filters.band !== "all" && bandT !== filters.band) return false;
  if (filters.holdings && !held) return false;
  if (filters.query.trim()) {
    const q = filters.query.trim().toLowerCase();
    const symL = symbol.toLowerCase();
    const nameL = ctx.name.toLowerCase();
    if (!symL.includes(q) && !nameL.includes(q)) return false;
  }
  return true;
}

export function filtersAreActive(f: FilterState): boolean {
  return (
    f.exchange !== "all" ||
    f.region !== "all" ||
    f.band !== "all" ||
    f.holdings ||
    f.query.trim().length > 0
  );
}
