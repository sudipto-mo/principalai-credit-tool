"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HERO_MARKETING } from "@/lib/hero-marketing";
import { isAdvisoryEnabled } from "@/lib/advisory-access";
import HeroPreviewBackground from "@/components/HeroPreviewBackground";
import WorkCard from "@/components/WorkCard";
import EcosystemWebCardVisual from "@/components/hero-cards/EcosystemWebCardVisual";
import PhysicalStackCardVisual from "@/components/hero-cards/PhysicalStackCardVisual";
import WorldviewCardVisual from "@/components/hero-cards/WorldviewCardVisual";

const STORAGE_KEY = "pai-carousel";

export default function HeroPreviewSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw == null) return;
      const n = Number.parseInt(raw, 10);
      if (!Number.isNaN(n) && n >= 0 && n < 3) setActiveIndex(n);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(activeIndex));
    } catch {
      /* ignore */
    }
  }, [activeIndex]);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + 3) % 3);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % 3);
      }
    },
    [],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  const go = (dir: -1 | 1) => setActiveIndex((i) => (i + dir + 3) % 3);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[oklch(95.5%_0.010_82)] font-[family-name:var(--font-brand)] text-[oklch(33%_0.05_258)]">
      <HeroPreviewBackground />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] flex-col gap-10 px-5 pb-10 pt-12 sm:px-10 sm:pb-[60px] sm:pt-[52px] md:flex-row md:items-center md:gap-[68px] md:px-[60px]">
        {/* Left column */}
        <div className="flex w-full flex-[0_0_auto] flex-col justify-center md:max-w-[36%] md:flex-[0_0_36%]">
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-[oklch(46%_0.14_253)]">
            {HERO_MARKETING.eyebrow}
          </p>
          <h1 className="mt-5 max-w-[520px] font-[family-name:var(--font-serif)] text-[clamp(2rem,4vw,50px)] font-bold leading-[1.08] tracking-[-0.018em] text-[oklch(15%_0.07_258)]">
            {HERO_MARKETING.headline}
          </h1>
          <p className="mt-6 max-w-[370px] text-[15px] font-light leading-[1.8] text-[oklch(33%_0.05_258)]">
            {HERO_MARKETING.body}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={HERO_MARKETING.primaryCta.href}
              className="inline-flex items-center justify-center rounded-[2px] bg-[oklch(15%_0.07_258)] px-5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.13em] text-white no-underline transition-opacity hover:opacity-90"
            >
              {HERO_MARKETING.primaryCta.label}
            </Link>
            {isAdvisoryEnabled() ? (
              <Link
                href={HERO_MARKETING.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-[2px] border border-[oklch(15%_0.07_258)] bg-transparent px-5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.13em] text-[oklch(15%_0.07_258)] no-underline transition-colors hover:bg-black/[0.04]"
              >
                {HERO_MARKETING.secondaryCta.label}
                <span className="rounded-[2px] border border-[oklch(15%_0.07_258/0.25)] px-1.5 py-0.5 text-[8px] font-bold tracking-[0.08em] text-[oklch(15%_0.07_258/0.55)]">
                  WIP
                </span>
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="inline-flex cursor-not-allowed select-none items-center justify-center rounded-[2px] border border-[oklch(15%_0.07_258/0.18)] bg-transparent px-5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.13em] text-[oklch(15%_0.07_258/0.35)]"
              >
                {HERO_MARKETING.secondaryCta.label}
              </span>
            )}
          </div>
        </div>

        {/* Carousel */}
        <div className="relative flex min-h-0 w-full flex-1 flex-col justify-center">
          <div
            className="relative w-full overflow-hidden rounded-md"
            style={{ height: "clamp(360px, 62vh, 540px)" }}
          >
            <div
              className="flex h-full w-full transition-transform duration-[550ms] ease-[cubic-bezier(0.77,0,0.18,1)]"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              <div className="h-full min-h-0 w-full shrink-0 px-0.5">
                <WorkCard
                  type="RESEARCH REPORT"
                  title="The Physical Stack: Where the Bottlenecks Are"
                  subtitle=""
                  date="April 2026"
                  region="APAC"
                  accent="rgba(140,105,50,0.85)"
                  light
                  href="/research/dc-infrastructure/physical-stack"
                >
                  <PhysicalStackCardVisual />
                </WorkCard>
              </div>
              <div className="h-full min-h-0 w-full shrink-0 px-0.5">
                <WorkCard
                  type="RESEARCH REPORT"
                  title="The Worldview: Who Is Building the AI Cloud"
                  subtitle=""
                  date="April 2026"
                  region="APAC"
                  accent="rgba(100,80,30,0.80)"
                  light
                  href="/research/dc-infrastructure/worldview"
                >
                  <WorldviewCardVisual />
                </WorkCard>
              </div>
              <div className="h-full min-h-0 w-full shrink-0 px-0.5">
                <WorkCard
                  type="INTERACTIVE TOOL"
                  title="Ecosystem Web"
                  subtitle="The AI Infrastructure Network"
                  date="LIVE"
                  region="WEB"
                  accent="rgba(100,80,30,0.80)"
                  light
                  href="/dc-network-map.html"
                >
                  <EcosystemWebCardVisual />
                </WorkCard>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  aria-current={activeIndex === i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === i ? "w-8 bg-[oklch(46%_0.14_253)]" : "w-2 bg-black/15 hover:bg-black/25"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-0">
              <button
                type="button"
                onClick={() => go(-1)}
                className="bg-white p-4 text-black transition-colors hover:bg-gray-200"
                aria-label="Previous"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="bg-white p-4 text-black transition-colors hover:bg-gray-200"
                aria-label="Next"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
