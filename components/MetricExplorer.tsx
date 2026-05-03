"use client";

import { useState } from "react";
import {
  METRIC_DATA,
  METRIC_FACTORS,
  type MetricEntry,
  type MetricFactor,
  type MetricKey,
  type ThresholdColor,
  metricsForFactor,
} from "@/lib/metric-explorer-data";

const THRESHOLD_RANGE_CLASS: Record<ThresholdColor, string> = {
  green: "text-[#166534]",
  amber: "text-[#b8860b]",
  red: "text-[#b91c1c]",
  violet: "text-[var(--color-violet)]",
};

function factorPillClass(factor: MetricFactor): string {
  const base =
    "mb-1 inline-block rounded-[2px] px-2.5 py-1.5 font-mono-brand text-[8.5px] font-bold uppercase tracking-[0.2em]";
  switch (factor) {
    case "Value":
      return `${base} bg-[rgba(184,134,11,0.1)] text-[#b8860b]`;
    case "Growth":
      return `${base} bg-[rgba(22,101,52,0.1)] text-[#166534]`;
    case "Profitability":
      return `${base} bg-[rgba(83,74,183,0.1)] text-[var(--color-violet)]`;
    case "Momentum":
      return `${base} bg-[rgba(38,33,92,0.1)] text-[var(--color-deep)]`;
    case "Financial Strength":
      return `${base} border border-[rgba(83,74,183,0.2)] bg-[rgba(83,74,183,0.15)] text-[var(--color-violet)]`;
    default:
      return base;
  }
}

function factorPillLabel(factor: MetricFactor): string {
  if (factor === "Financial Strength") return "Financial Strength ✦ Dorrsum";
  return factor;
}

function MetricDetailCard({
  metricKey,
  data,
  referenceTicker,
  referenceExchange,
}: {
  metricKey: MetricKey;
  data: MetricEntry;
  referenceTicker: string;
  referenceExchange: string;
}) {
  return (
    <article
      key={metricKey}
      className="animate-fade-up"
      aria-labelledby={`metric-title-${metricKey}`}
    >
      <span className={factorPillClass(data.factor)}>{factorPillLabel(data.factor)}</span>
      <h2
        id={`metric-title-${metricKey}`}
        className="mb-1 font-brand text-[26px] font-bold leading-[1.1] tracking-[-0.01em] text-[var(--color-deep)] dark:text-[var(--pa-navy-deep)]"
      >
        {data.name}
      </h2>
      <p className="mb-6 text-[13px] font-normal text-[var(--pa-muted)]">{data.fullName}</p>

      <div className="mb-5 flex items-baseline gap-2 rounded-[3px] bg-[var(--color-deep)] px-5 py-4">
        <span className="font-mono-brand text-[8px] uppercase tracking-[0.18em] text-[rgba(175,169,236,0.6)]">
          {referenceTicker}
        </span>
        <span className="ml-2.5 font-brand text-[32px] font-bold leading-none text-[var(--color-off-white)]">
          {data.value}
        </span>
        <span className="ml-auto font-mono-brand text-[10px] tracking-[0.08em] text-[var(--color-mid)]">
          {referenceExchange}
        </span>
      </div>

      <h3 className="mb-2 mt-5 font-mono-brand text-[8.5px] uppercase tracking-[0.2em] text-[var(--pa-muted)]">
        Formula
      </h3>
      <div className="mb-0 rounded-[3px] border border-[var(--pa-border)] bg-[var(--pa-surface)] px-4 py-3 font-mono-brand text-xs leading-relaxed tracking-[0.02em] text-[var(--pa-text)]">
        {data.formula}
      </div>

      <h3 className="mb-2 mt-5 font-mono-brand text-[8.5px] uppercase tracking-[0.2em] text-[var(--pa-muted)]">
        Interpretation
      </h3>
      <div className="rounded-[3px] border border-[var(--pa-border)] bg-[var(--pa-surface)] px-4 py-3.5 text-[13px] font-normal leading-[1.7] text-[var(--pa-text)]">
        {data.interp}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-0.5 sm:grid-cols-3">
        {data.thresholds.map((t) => (
          <div
            key={`${t.range}-${t.label}`}
            className="rounded-[2px] border border-[var(--pa-border)] bg-[var(--pa-surface)] px-3 py-2.5 text-center"
          >
            <div
              className={`mb-0.5 font-mono-brand text-[10px] font-bold ${THRESHOLD_RANGE_CLASS[t.color]}`}
            >
              {t.range}
            </div>
            <div className="text-[11px] font-normal text-[var(--pa-muted)]">{t.label}</div>
          </div>
        ))}
      </div>
    </article>
  );
}

export type MetricExplorerProps = {
  referenceTicker?: string;
  referenceExchange?: string;
};

export default function MetricExplorer({
  referenceTicker = "ASML",
  referenceExchange = "NYSE / NASDAQ",
}: MetricExplorerProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey | null>(null);
  const activeData = activeMetric != null ? METRIC_DATA[activeMetric] : null;

  return (
    <div className="mx-auto grid min-h-0 w-full max-w-[1060px] grid-cols-1 md:min-h-[min(100dvh,900px)] md:grid-cols-[420px_1fr]">
      {/* Left — metric list */}
      <aside className="overflow-y-auto border-[var(--pa-border)] px-6 pb-20 pt-8 md:border-r">
        <header className="mb-7">
          <p className="mb-2.5 font-brand text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--color-deep)] dark:text-[var(--pa-navy-deep)]">
            DO<span className="text-[var(--color-violet)]">RR</span>SUM
          </p>
          <h1 className="mb-0.5 font-brand text-lg font-bold text-[var(--color-deep)] dark:text-[var(--pa-navy-deep)]">
            Metric Explorer
          </h1>
          <p className="font-mono-brand text-[9px] uppercase tracking-[0.18em] text-[var(--pa-muted)]">
            Click any metric to see formula + interpretation
          </p>
        </header>

        {METRIC_FACTORS.map((factor) => {
          const rows = metricsForFactor(factor);
          if (rows.length === 0) return null;
          return (
            <div key={factor} className="mb-5">
              <span className={factorPillClass(factor)}>{factorPillLabel(factor)}</span>
              <div className="overflow-hidden rounded-[3px] border border-[var(--pa-border)] bg-[var(--pa-surface)]">
                {rows.map(([key, row], idx) => {
                  const isActive = activeMetric === key;
                  const isLast = idx === rows.length - 1;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveMetric(key)}
                      className={[
                        "group flex w-full cursor-pointer items-center justify-between gap-3 border-[var(--pa-border)] px-3.5 py-2.5 text-left transition-colors duration-100",
                        !isLast ? "border-b" : "",
                        isActive
                          ? "border-l-[3px] border-l-[var(--color-violet)] bg-[var(--color-pale)] pl-[11px]"
                          : "border-l-[3px] border-l-transparent bg-[var(--pa-surface)] hover:bg-[var(--color-pale)]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "text-xs",
                          isActive
                            ? "font-semibold text-[var(--color-violet)]"
                            : "font-medium text-[var(--pa-text)]",
                        ].join(" ")}
                      >
                        {row.name}
                        {row.hint ? (
                          <span className="ml-1.5 font-mono-brand text-[8.5px] font-normal text-[var(--pa-muted)]">
                            {row.hint}
                          </span>
                        ) : null}
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="whitespace-nowrap font-mono-brand text-[11px] font-medium text-[var(--pa-text)]">
                          {row.value}
                        </span>
                        <span
                          className={[
                            "font-mono-brand text-[10px] text-[var(--color-mid)] transition-opacity duration-100",
                            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                          ].join(" ")}
                          aria-hidden
                        >
                          ›
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </aside>

      {/* Right — detail */}
      <section className="flex min-h-[280px] flex-col border-t border-[var(--pa-border)] px-8 pb-20 pt-8 md:sticky md:top-0 md:h-[min(100dvh,100%)] md:max-h-[calc(100dvh-3.5rem)] md:overflow-y-auto md:border-t-0">
        {!activeData || activeMetric == null ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 pb-16 pt-8 text-center opacity-45">
            <span className="font-mono-brand text-[28px] text-[var(--color-mid)]" aria-hidden>
              ›
            </span>
            <p className="font-mono-brand text-[10px] uppercase tracking-[0.18em] text-[var(--pa-muted)]">
              Click a metric to explore
            </p>
          </div>
        ) : (
          <MetricDetailCard
            metricKey={activeMetric}
            data={activeData}
            referenceTicker={referenceTicker}
            referenceExchange={referenceExchange}
          />
        )}
      </section>
    </div>
  );
}
