"use client";

import { useCallback, useMemo, useState } from "react";
import {
  type FilterState,
  DEFAULT_FILTER_STATE,
  filtersAreActive,
  type ExchangeKey,
  type RegionKey,
  type FilterBandKey,
} from "@/lib/universe-tickers";

export type UniverseFilterStats = {
  matchTickers: number;
  visibleCategories: number;
  totalCategories: number;
};

export type UniverseFilterBarProps = {
  className?: string;
  /** When set, row 1 / row 2 counts reflect live data (e.g. parent scans category cards). */
  getFilterStats?: (filters: FilterState) => UniverseFilterStats;
  onFiltersChange?: (filters: FilterState) => void;
};

const EXCHANGE_OPTIONS: { val: "all" | ExchangeKey; label: string }[] = [
  { val: "all", label: "All" },
  { val: "nasdaq", label: "NYSE" },
  { val: "tokyo", label: "Tokyo" },
  { val: "euronext", label: "Euronext" },
  { val: "hk", label: "HKEX" },
];

const REGION_OPTIONS: { val: "all" | RegionKey; label: string }[] = [
  { val: "all", label: "All" },
  { val: "us", label: "US" },
  { val: "apac", label: "APAC" },
  { val: "eu", label: "EU" },
];

const BAND_OPTIONS: { val: "all" | FilterBandKey; label: string }[] = [
  { val: "all", label: "All" },
  { val: "silicon", label: "01 Silicon" },
  { val: "buildout", label: "02 Build-Out" },
  { val: "energy", label: "03 Energy" },
  { val: "connectivity", label: "04 Connectivity" },
  { val: "compute", label: "05 Compute" },
];

function chipClass(active: boolean): string {
  const base =
    "cursor-pointer whitespace-nowrap border px-[9px] py-1 font-[family-name:var(--font-mono-brand),ui-monospace,monospace] text-[9px] uppercase tracking-[0.1em] transition-all duration-[120ms]";
  if (active) {
    return `${base} border-[var(--color-deep)] bg-[var(--color-deep)] text-white`;
  }
  return `${base} border-[var(--pa-border)] bg-transparent text-[var(--pa-muted)] hover:border-[var(--color-mid)] hover:text-[var(--pa-text)]`;
}

function groupLabel(text: string) {
  return (
    <span
      className="shrink-0 whitespace-nowrap font-[family-name:var(--font-mono-brand),ui-monospace,monospace] text-[8.5px] uppercase tracking-[0.18em] text-[var(--pa-muted)]"
    >
      {text}
    </span>
  );
}

function Divider() {
  return <span className="h-[18px] w-px shrink-0 bg-[var(--pa-border)]" aria-hidden />;
}

export default function UniverseFilterBar({
  className = "",
  getFilterStats,
  onFiltersChange,
}: UniverseFilterBarProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER_STATE);

  const push = useCallback(
    (next: FilterState) => {
      setFilters(next);
      onFiltersChange?.(next);
    },
    [onFiltersChange],
  );

  const stats = useMemo(() => {
    if (!getFilterStats) return null;
    return getFilterStats(filters);
  }, [filters, getFilterStats]);

  const active = filtersAreActive(filters);
  const matchLine =
    stats && active ? `${stats.matchTickers} match${stats.matchTickers !== 1 ? "es" : ""}` : "";
  const resultsLine =
    stats && active
      ? `${stats.visibleCategories} of ${stats.totalCategories} categories`
      : "";

  const clearAll = () => {
    push({ ...DEFAULT_FILTER_STATE });
  };

  return (
    <div className={`mb-[28px] overflow-hidden rounded border border-[var(--pa-border)] bg-white ${className}`}>
      {/* Row 1 */}
      <div className="flex flex-col flex-wrap items-stretch gap-3 px-[18px] py-3 sm:flex-row sm:items-center sm:gap-[14px]">
        {/* Search */}
        <div className="flex min-w-[220px] items-center gap-[7px] rounded border border-[var(--pa-border)] bg-[var(--pa-page)] px-2.5 py-1.5 transition-colors focus-within:border-[var(--color-violet)]">
          <svg
            className="h-[13px] w-[13px] shrink-0 text-[var(--pa-muted)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={filters.query}
            onChange={(e) => push({ ...filters, query: e.target.value })}
            placeholder="Search…"
            className="w-full border-0 bg-transparent font-sans text-xs text-[var(--pa-text)] outline-none placeholder:text-[var(--pa-muted)] placeholder:opacity-60"
            autoComplete="off"
          />
          {filters.query ? (
            <button
              type="button"
              className="px-0.5 font-sans text-[10px] text-[var(--pa-muted)]"
              onClick={() => push({ ...filters, query: "" })}
              aria-label="Clear search"
            >
              ✕
            </button>
          ) : null}
        </div>

        <Divider />

        {/* Exchange — desktop chips */}
        <div className="hidden flex-wrap items-center gap-[14px] md:flex">
          {groupLabel("Exchange")}
          <div className="flex flex-wrap gap-[5px]">
            {EXCHANGE_OPTIONS.map((o) => (
              <button
                key={o.val}
                type="button"
                className={chipClass(filters.exchange === o.val)}
                onClick={() => push({ ...filters, exchange: o.val })}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exchange — mobile */}
        <div className="flex flex-col gap-1 md:hidden">
          {groupLabel("Exchange")}
          <select
            className="rounded border border-[var(--pa-border)] bg-[var(--pa-page)] px-2 py-1.5 font-[family-name:var(--font-mono-brand),ui-monospace,monospace] text-[9px] uppercase tracking-[0.1em] text-[var(--pa-text)]"
            value={filters.exchange}
            onChange={(e) =>
              push({ ...filters, exchange: e.target.value as FilterState["exchange"] })
            }
          >
            {EXCHANGE_OPTIONS.map((o) => (
              <option key={o.val} value={o.val}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <Divider />

        {/* Region — desktop */}
        <div className="hidden flex-wrap items-center gap-[14px] md:flex">
          {groupLabel("Region")}
          <div className="flex flex-wrap gap-[5px]">
            {REGION_OPTIONS.map((o) => (
              <button
                key={o.val}
                type="button"
                className={chipClass(filters.region === o.val)}
                onClick={() => push({ ...filters, region: o.val })}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Region — mobile */}
        <div className="flex flex-col gap-1 md:hidden">
          {groupLabel("Region")}
          <select
            className="rounded border border-[var(--pa-border)] bg-[var(--pa-page)] px-2 py-1.5 font-[family-name:var(--font-mono-brand),ui-monospace,monospace] text-[9px] uppercase tracking-[0.1em] text-[var(--pa-text)]"
            value={filters.region}
            onChange={(e) =>
              push({ ...filters, region: e.target.value as FilterState["region"] })
            }
          >
            {REGION_OPTIONS.map((o) => (
              <option key={o.val} value={o.val}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <Divider />

        {/* Holdings */}
        <button
          type="button"
          className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap border-0 bg-transparent p-0 text-left font-[family-name:var(--font-mono-brand),ui-monospace,monospace] text-[9px] uppercase tracking-[0.14em] text-[var(--pa-muted)]"
          onClick={() => push({ ...filters, holdings: !filters.holdings })}
          aria-pressed={filters.holdings}
        >
          <span
            className={`relative h-[15px] w-[30px] shrink-0 rounded-full transition-colors duration-200 ${
              filters.holdings ? "bg-[var(--color-violet)]" : "bg-[var(--pa-border)]"
            }`}
          >
            <span
              className="absolute left-0.5 top-[1.5px] h-3 w-3 rounded-full bg-white shadow transition-[left] duration-200"
              style={{ left: filters.holdings ? "16px" : "2px", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}
            />
          </span>
          Holdings only
        </button>

        <div className="ml-auto flex items-center gap-2.5">
          {active && matchLine ? (
            <span className="whitespace-nowrap font-[family-name:var(--font-mono-brand),ui-monospace,monospace] text-[9px] tracking-[0.12em] text-[var(--color-violet)]">
              {matchLine}
            </span>
          ) : null}
          {active ? (
            <button
              type="button"
              onClick={clearAll}
              className="whitespace-nowrap rounded border border-[var(--pa-border)] bg-transparent px-[9px] py-1 font-[family-name:var(--font-mono-brand),ui-monospace,monospace] text-[9px] uppercase tracking-[0.12em] text-[var(--pa-muted)] hover:border-[var(--pa-text)] hover:text-[var(--pa-text)]"
            >
              Clear all
            </button>
          ) : null}
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex flex-wrap items-center gap-[14px] border-t border-[var(--pa-border)] bg-[var(--pa-page)] px-[18px] py-2">
        {groupLabel("Band")}
        <div className="flex flex-wrap gap-[5px]">
          {BAND_OPTIONS.map((o) => (
            <button
              key={o.val}
              type="button"
              className={chipClass(filters.band === o.val)}
              onClick={() => push({ ...filters, band: o.val })}
            >
              {o.label}
            </button>
          ))}
        </div>
        {resultsLine ? (
          <span className="ml-auto font-[family-name:var(--font-mono-brand),ui-monospace,monospace] text-[9px] uppercase tracking-[0.12em] text-[var(--pa-muted)]">
            {resultsLine}
          </span>
        ) : null}
      </div>
    </div>
  );
}
