"use client";

import Link from "next/link";
import TeaserNav from "@/components/TeaserNav";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const TEASERS = [
  {
    id: "network",
    pathLabel: "dorrsum.com/dc-network-map",
    openHref: "/dc-network-map.html",
    footerHint:
      "Review the network preview. Deeper models, covenants, and full briefs are available to clients.",
  },
  {
    id: "helios",
    pathLabel: "dorrsum.com/research/helios-towers",
    openHref: "/research/helios-towers",
    footerHint:
      "Public excerpt — illustrative summary. Full models, covenants, and institutional briefs require client access.",
  },
] as const;

/** Fixed height keeps scroll-snap and iframe layout stable across slides */
const SLIDE_H_CLASS = "h-[min(52vh,520px)] sm:h-[480px]";

export default function TeaserWindow() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const n = TEASERS.length;

  const scrollToIndex = useCallback((i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(n - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  }, [n]);

  const updateIndexFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setIndex(Math.max(0, Math.min(n - 1, i)));
  }, [n]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateIndexFromScroll();
    el.addEventListener("scroll", updateIndexFromScroll, { passive: true });
    const ro = new ResizeObserver(updateIndexFromScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateIndexFromScroll);
      ro.disconnect();
    };
  }, [updateIndexFromScroll]);

  const active = TEASERS[index];

  return (
    <div className="relative rounded-sm border border-[color:var(--pa-border)] bg-white p-2 shadow-[0_12px_28px_rgba(31,36,48,0.06)] transition-colors duration-300 ease-out hover:border-[#bcc4ce]">
      <div className="rounded-t-sm border-b border-[color:var(--pa-border)] bg-[#faf8f2] px-3 py-2.5 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="flex shrink-0 gap-1.5" aria-hidden>
              <div className="h-2.5 w-2.5 rounded-full bg-[#d8d3c8]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#d8d3c8]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#d8d3c8]" />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => scrollToIndex(index - 1)}
              disabled={index === 0}
              className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-[color:var(--pa-border)] bg-white text-[var(--pa-muted)] transition hover:border-[#bcc4ce] disabled:pointer-events-none disabled:opacity-30"
              aria-label="Previous preview"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <span className="min-w-[2.75rem] text-center text-[11px] font-medium tabular-nums text-[#7b8794]">
              {index + 1} / {n}
            </span>
            <button
              type="button"
              onClick={() => scrollToIndex(index + 1)}
              disabled={index === n - 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-[color:var(--pa-border)] bg-white text-[var(--pa-muted)] transition hover:border-[#bcc4ce] disabled:pointer-events-none disabled:opacity-30"
              aria-label="Next preview"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
        <a
          href={active.openHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block truncate text-xs font-medium text-[var(--pa-link)] transition-colors hover:text-[var(--pa-link-hover)] no-underline"
        >
          {active.pathLabel}
        </a>
      </div>

      <div
        ref={scrollerRef}
        className={`flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth bg-[#0b1220] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${SLIDE_H_CLASS}`}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Preview carousel"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollToIndex(index - 1);
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            scrollToIndex(index + 1);
          }
        }}
      >
        <div className={`flex w-full min-w-full shrink-0 snap-center snap-always flex-col ${SLIDE_H_CLASS}`}>
          <iframe
            title="AI infrastructure network — interactive preview"
            src="/dc-network-map.html?embed=1"
            className="h-full w-full border-0"
            loading="lazy"
          />
        </div>

        <div
          className={`flex w-full min-w-full shrink-0 snap-center snap-always flex-col items-center justify-center bg-[#f5f2eb] px-6 py-10 text-center ${SLIDE_H_CLASS}`}
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-sm border border-[color:var(--pa-border)] bg-white">
            <FileText className="h-6 w-6 text-[var(--pa-navy)]" aria-hidden />
          </div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b8794]">Sample credit brief</p>
          <h3 className="mb-2 text-xl font-bold tracking-tight text-[var(--pa-navy)]">Helios Towers plc</h3>
          <p className="mb-6 max-w-sm text-sm leading-relaxed text-[var(--pa-muted)]">
            Illustrative summary: financial, equity, and refinancing risk. Full institutional brief and models require
            client access.
          </p>
          <Link
            href="/research/helios-towers"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-[var(--pa-navy)] bg-[var(--pa-navy)] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[var(--pa-navy-deep)] no-underline"
          >
            View public excerpt
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>

      <div className="flex justify-center gap-1.5 border-t border-[color:var(--pa-border)] bg-[#faf8f2] py-2">
        {TEASERS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => scrollToIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-[var(--pa-navy)]" : "w-1.5 bg-[#c7c1b6] hover:bg-[#9aa5b1]"
            }`}
            aria-label={`Go to preview ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
          />
        ))}
      </div>

      <div className="rounded-b-sm border-t border-[color:var(--pa-border)] bg-white px-4 pb-4 pt-3">
        {active.id === "helios" ? (
          <button
            type="button"
            onClick={() => scrollToIndex(0)}
            className="mb-3 w-full text-left text-xs font-medium text-[var(--pa-muted)] transition-colors hover:text-[var(--pa-text)]"
          >
            ← Return to infrastructure network
          </button>
        ) : null}
        {active.id === "network" ? (
          <TeaserNav
            description={active.footerHint}
            nextLabel="Helios credit brief"
            onNextClick={() => scrollToIndex(1)}
            className="mt-0 border-t-0 pt-0"
          />
        ) : (
          <TeaserNav
            terminal
            description={active.footerHint}
            className="mt-0 border-t-0 pt-0"
            loginHref={"/login?returnTo=" + encodeURIComponent("/research/helios-towers")}
          />
        )}
      </div>
    </div>
  );
}
