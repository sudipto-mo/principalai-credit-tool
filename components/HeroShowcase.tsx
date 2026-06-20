"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
};

const SLIDES: Slide[] = [
  {
    id: "ecosystem-map",
    label: "Interactive",
    eyebrow: "Ecosystem Web",
    title: "The AI infrastructure network",
    description: "Trace capital flows and supply chain dependencies across 17 nodes in the digital infrastructure stack.",
    cta: { label: "Explore the Ecosystem Web", href: "/dc-network-map.html" },
  },
  {
    id: "worldview-brief",
    label: "Latest · April 2026",
    eyebrow: "Worldview · No. 003",
    title: "Data centres are now an energy story.",
    description:
      "APAC investors are underpricing the transition. Power availability, interconnect queues, and PPA bankability are the dominant credit drivers.",
    cta: { label: "Read the Worldview", href: "/research/dc-infrastructure/worldview" },
  },
  {
    id: "credit-framework",
    label: "Proprietary",
    eyebrow: "6-Layer TMT Framework",
    title: "Where covenants still fail to reach.",
    description:
      "Our framework walks through the six physical layers of digital infrastructure — and surfaces the two that standard covenants systematically miss.",
    cta: { label: "See the framework", href: "/research/dc-infrastructure/physical-stack" },
  },
];

const AUTO_ADVANCE_MS = 6500;

export default function HeroShowcase({ height = 620 }: { height?: number }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const active = SLIDES[index];

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-[color:var(--pa-border)] bg-[#08080e] shadow-[0_1px_0_rgba(0,0,0,0.04)]"
      style={{ height: `${height}px` }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{
            opacity: i === index ? 1 : 0,
            pointerEvents: i === index ? "auto" : "none",
          }}
          aria-hidden={i !== index}
        >
          {slide.id === "ecosystem-map" ? <EcosystemMapSlide /> : null}
          {slide.id === "worldview-brief" ? <ResearchPaperSlide /> : null}
          {slide.id === "credit-framework" ? <FrameworkSlide /> : null}
        </div>
      ))}

      {/* Carousel controls */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 p-2 text-white/90 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-black/55"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/35 p-2 text-white/90 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-black/55"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* CTA footer + dots */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="flex w-full items-center justify-between gap-3 border-t border-[#1c1c2c] bg-[#0b0b13] px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
              {active.eyebrow} · <span className="text-[#64748b]">{active.label}</span>
            </p>
            <p className="mt-1 truncate text-[13px] font-semibold leading-tight text-[#f1f5f9]">{active.title}</p>
          </div>
          <Link
            href={active.cta.href}
            className="shrink-0 rounded-md bg-[#4f6ef7] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white no-underline transition-colors hover:bg-[#3b5bdb] sm:text-[12px]"
          >
            {active.cta.label}
          </Link>
        </div>

        <div className="flex items-center justify-center gap-1.5 bg-[#08080e] py-2.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-1 rounded-full transition-all ${
                i === index ? "w-6 bg-[#4f6ef7]" : "w-1.5 bg-[#2a2a3d] hover:bg-[#4a4a60]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute left-0 right-0 top-0 z-10 h-[2px] bg-[#1c1c2c]">
        <div
          key={`${index}-${isPaused}`}
          className="h-full bg-[#4f6ef7]"
          style={{
            width: "0%",
            animation: isPaused ? "none" : `heroShowcaseProgress ${AUTO_ADVANCE_MS}ms linear forwards`,
          }}
        />
      </div>

      <style jsx>{`
        @keyframes heroShowcaseProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.18; }
        }
        :global(.node-glow) { animation: glowPulse 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Slide 1 — Ecosystem Map
 * ──────────────────────────────────────────────────────────── */
function EcosystemMapSlide() {
  return (
    <div className="relative h-full w-full bg-[#08080e]">
      {/* Top header */}
      <div className="absolute inset-x-0 top-0 z-10 px-4 pt-5 sm:px-5">
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#4f6ef7] sm:text-[10px]">
          Dorrsum · Data Centre Coverage
        </p>
        <div className="inline-flex gap-[3px] rounded-lg border border-[#1c1c2c] bg-[#0e0e18] p-[3px]">
          <span className="rounded-[5px] bg-[#4f6ef7] px-[14px] py-[6px] text-[11px] font-semibold text-white sm:text-[12px]">
            Supply Chain
          </span>
          <span className="px-[14px] py-[6px] text-[11px] font-semibold text-[#475569] sm:text-[12px]">
            Financing Flows
          </span>
        </div>
      </div>

      {/* Network SVG */}
      <svg
        viewBox="30 5 740 530"
        className="absolute inset-x-0 bottom-[100px] top-[72px]"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Ecosystem map preview"
        role="img"
      >
        <g>
          <rect x="-8" y="20" width="890" height="82" rx="10" fill="#fff" opacity="0.018" />
          <rect x="-8" y="145" width="245" height="308" rx="10" fill="#fff" opacity="0.014" />
          <rect x="168" y="200" width="104" height="288" rx="10" fill="#fff" opacity="0.014" />
          <rect x="340" y="256" width="102" height="192" rx="10" fill="#fff" opacity="0.014" />
          <rect x="505" y="196" width="102" height="214" rx="10" fill="#fff" opacity="0.014" />
          <rect x="688" y="205" width="100" height="290" rx="10" fill="#fff" opacity="0.014" />
        </g>

        <g stroke="#4b5775" strokeWidth="1.5" fill="none" strokeDasharray="5 3" opacity="0.55">
          <path d="M93 300 Q 180 300, 358 300" />
          <path d="M93 412 Q 200 380, 358 340" />
          <path d="M239 240 Q 300 270, 358 290" />
          <path d="M239 352 Q 300 330, 358 310" />
          <path d="M412 300 Q 470 270, 523 250" />
          <path d="M412 300 Q 470 340, 523 370" />
        </g>
        <g stroke="#22c55e" strokeWidth="1.5" fill="none" opacity="0.45">
          <path d="M239 250 Q 400 245, 523 240" />
          <path d="M239 455 Q 400 420, 523 390" />
          <path d="M577 380 Q 650 320, 703 258" />
          <path d="M577 380 Q 650 370, 703 362" />
          <path d="M577 390 Q 650 430, 703 458" />
          <path d="M550 267 Q 550 320, 550 353" />
        </g>

        {/* Nodes */}
        {[
          { x: 190, y: 64, c: "#4f6ef7", label: "Banks", sub: "JPMorgan · Barclays", delay: 0 },
          { x: 355, y: 46, c: "#4f6ef7", label: "Private", label2: "Credit", sub: "Blue Owl · Apollo", delay: 0.4 },
          { x: 510, y: 64, c: "#4f6ef7", label: "PE &", label2: "Infra", sub: "Blackstone · KKR", delay: 0.8 },
          { x: 660, y: 46, c: "#4f6ef7", label: "REITs", sub: "Digital Realty", delay: 1.2 },
          { x: 66, y: 178, c: "#f59e0b", label: "Silicon", sub: "NVIDIA · AMD", delay: 0.2 },
          { x: 66, y: 300, c: "#f59e0b", label: "Hardware", sub: "Dell · HPE", delay: 0.6 },
          { x: 66, y: 412, c: "#f59e0b", label: "Cooling &", label2: "Power", sub: "Vertiv", delay: 1.0 },
          { x: 212, y: 240, c: "#f97316", label: "Power", label2: "Grid ⚠", sub: "Utilities", delay: 0.3 },
          { x: 212, y: 352, c: "#f97316", label: "Land &", label2: "Site", sub: "Landowners", delay: 0.7 },
          { x: 212, y: 455, c: "#f97316", label: "Connec-", label2: "tivity", sub: "Fibre · Subsea", delay: 1.1 },
          { x: 385, y: 300, c: "#a855f7", label: "DC", label2: "Developers", sub: "Vantage · NTT", delay: 0.5 },
          { x: 385, y: 420, c: "#a855f7", label: "Contrac-", label2: "tors", sub: "Mortenson", delay: 0.9 },
          { x: 550, y: 240, c: "#22c55e", label: "Colocation", sub: "Equinix", delay: 0.35 },
          { x: 550, y: 380, c: "#22c55e", label: "Hyper-", label2: "scalers", sub: "AWS · Azure", delay: 0.75 },
          { x: 730, y: 248, c: "#ec4899", label: "AI Cos", sub: "OpenAI · Anthropic", delay: 0.45 },
          { x: 730, y: 362, c: "#ec4899", label: "Enter-", label2: "prise", sub: "Fortune 500", delay: 0.85 },
          { x: 730, y: 468, c: "#ec4899", label: "Sovereign", label2: "AI", sub: "National AI", delay: 1.25 },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="38" fill={n.c} className="node-glow" style={{ animationDelay: `${n.delay}s` }} />
            <circle cx={n.x} cy={n.y} r="27" fill="#11111c" stroke={n.c} strokeWidth="1.6" />
            {n.label2 ? (
              <>
                <text x={n.x} y={n.y - 3} textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif">{n.label}</text>
                <text x={n.x} y={n.y + 10} textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif">{n.label2}</text>
              </>
            ) : (
              <text x={n.x} y={n.y + 4} textAnchor="middle" fill="#ecf0f6" fontSize="10.5" fontWeight="700" fontFamily="Inter, sans-serif">{n.label}</text>
            )}
            <text x={n.x} y={n.y + 40} textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, sans-serif">{n.sub}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Slide 2 — Research Paper (Bridgewater-style document preview)
 * ──────────────────────────────────────────────────────────── */
function ResearchPaperSlide() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-[#e8e4d8] via-[#efeae0] to-[#d8d4c8]">
      {/* Handwritten margin texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, #000 0.5px, transparent 0.5px), radial-gradient(circle at 82% 72%, #000 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px, 32px 32px",
        }}
      />

      {/* Background paper (rear) */}
      <div
        className="absolute left-[8%] top-[8%] h-[70%] w-[55%] -rotate-[6deg] bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35),0_8px_20px_-5px_rgba(0,0,0,0.2)]"
        aria-hidden
      >
        <div className="border-b-[3px] border-[#6b1d2a] px-4 pb-2 pt-3">
          <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#6b1d2a]">Bridgewater-style archive</p>
          <p className="mt-1 font-serif text-[10px] font-bold text-[#1a1a1a]">Dorrsum · Worldview</p>
        </div>
        <div className="space-y-1.5 p-4">
          {[92, 85, 78, 88, 70, 82, 76].map((w, i) => (
            <div key={i} className="h-[4px] rounded-full bg-[#3a3a3a]/15" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>

      {/* Background paper (side) */}
      <div
        className="absolute right-[6%] top-[16%] h-[64%] w-[42%] rotate-[5deg] bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.3),0_8px_20px_-5px_rgba(0,0,0,0.18)]"
        aria-hidden
      >
        <div className="border-b-[3px] border-[#6b1d2a] px-4 pb-2 pt-3">
          <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#6b1d2a]">Sector note</p>
          <p className="mt-1 font-serif text-[10px] font-bold text-[#1a1a1a]">Physical Stack</p>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          <div className="space-y-1">
            {[95, 80, 72, 88].map((w, i) => (
              <div key={i} className="h-[3px] rounded-full bg-[#3a3a3a]/15" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="space-y-1">
            {[86, 74, 90, 68].map((w, i) => (
              <div key={i} className="h-[3px] rounded-full bg-[#3a3a3a]/15" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Foreground paper (featured brief) */}
      <div className="absolute left-1/2 top-[50%] w-[62%] max-w-[380px] -translate-x-1/2 -translate-y-1/2 -rotate-[1.5deg] bg-white shadow-[0_40px_70px_-15px_rgba(0,0,0,0.45),0_15px_30px_-8px_rgba(0,0,0,0.25)]">
        <div className="border-b-[4px] border-[#6b1d2a] px-5 pb-3 pt-5">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#6b1d2a]">
            Dorrsum · Worldview · No. 003
          </p>
          <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">April 2026 · 18 pp</p>
        </div>

        <div className="px-5 py-4">
          <h3 className="font-serif text-[16px] font-bold leading-[1.18] text-[#0f172a] sm:text-[18px]">
            Data centres are now an energy story.
          </h3>
          <p className="mt-2 font-serif text-[12px] italic leading-[1.35] text-[#6b1d2a]">
            APAC investors are underpricing the transition.
          </p>

          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="h-px bg-[#0f172a]/20" />
            <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#6b7280]">The thesis</p>
            <div className="h-px bg-[#0f172a]/20" />
          </div>

          <div className="mt-3 space-y-1.5">
            {[98, 92, 88, 94, 85, 90, 78].map((w, i) => (
              <div key={i} className="h-[3px] rounded-full bg-[#0f172a]/18" style={{ width: `${w}%` }} />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#0f172a]/10 pt-3">
            <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#6b7280]">S. Mondal</p>
            <span className="rounded-sm border border-[#6b1d2a]/40 bg-[#6b1d2a]/5 px-2 py-0.5 text-[7.5px] font-bold uppercase tracking-[0.14em] text-[#6b1d2a]">
              Teaser
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Slide 3 — 6-Layer Credit Framework
 * ──────────────────────────────────────────────────────────── */
function FrameworkSlide() {
  const layers = [
    { n: "L6", name: "Contracts & Covenants", tag: "Capital", color: "#4f6ef7", width: 72, risk: "Bankable" },
    { n: "L5", name: "Compute & AI Demand", tag: "Demand", color: "#ec4899", width: 86, risk: "Accelerating" },
    { n: "L4", name: "Network & Connectivity", tag: "Operate", color: "#22c55e", width: 78, risk: "Monitored" },
    { n: "L3", name: "Cooling & Thermal", tag: "Supply", color: "#f59e0b", width: 82, risk: "Constrained ⚠" },
    { n: "L2", name: "Power & Grid", tag: "Infra", color: "#f97316", width: 94, risk: "Binding ⚠" },
    { n: "L1", name: "Land & Site", tag: "Infra", color: "#f97316", width: 68, risk: "Scarce" },
  ];
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-[#0f1422] via-[#0b0f19] to-[#08080e]">
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #4f6ef7 1px, transparent 1px), linear-gradient(to bottom, #4f6ef7 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative flex h-full flex-col px-6 pb-[100px] pt-6 sm:px-8 sm:pt-8">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#4f6ef7] sm:text-[10px]">
            Dorrsum · Proprietary Methodology
          </p>
          <h3 className="mt-2 text-[18px] font-semibold leading-tight text-white sm:text-[20px]">
            6-Layer TMT Credit Framework
          </h3>
          <p className="mt-1.5 text-[11px] leading-snug text-[#94a3b8] sm:text-[12px]">
            Every digital infrastructure deal evaluated layer-by-layer. The binding constraints surface where the
            market is not yet looking.
          </p>
        </div>

        <div className="mt-5 flex-1 space-y-2 sm:mt-6 sm:space-y-2.5">
          {layers.map((l, i) => (
            <div key={l.n} className="group relative">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-9 shrink-0 items-center justify-center rounded-sm border border-[#1c1c2c] bg-[#0e0e18] text-[10px] font-bold text-[#94a3b8] sm:h-8 sm:w-10 sm:text-[11px]">
                  {l.n}
                </div>

                <div className="relative min-w-0 flex-1">
                  <div
                    className="relative h-7 overflow-hidden rounded-sm border border-[#1c1c2c] sm:h-8"
                    style={{ background: "rgba(79,110,247,0.04)" }}
                  >
                    <div
                      className="absolute inset-y-0 left-0 transition-all"
                      style={{
                        width: `${l.width}%`,
                        background: `linear-gradient(90deg, ${l.color}44 0%, ${l.color}22 60%, transparent 100%)`,
                        borderRight: `2px solid ${l.color}`,
                        animation: `frameBarSlide 900ms ${i * 90}ms cubic-bezier(0.2, 0.8, 0.2, 1) both`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-between gap-3 px-3">
                      <span className="truncate text-[11px] font-semibold text-white sm:text-[12px]">{l.name}</span>
                      <span
                        className="shrink-0 text-[9px] font-bold uppercase tracking-[0.1em] sm:text-[10px]"
                        style={{ color: l.color }}
                      >
                        {l.risk}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden shrink-0 text-right md:block">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#64748b]">{l.tag}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[#1c1c2c] pt-4">
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#64748b]">Coverage</p>
            <p className="mt-1 text-[14px] font-semibold text-white">6 layers</p>
          </div>
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#64748b]">Binding</p>
            <p className="mt-1 text-[14px] font-semibold text-[#f97316]">2 ⚠</p>
          </div>
          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#64748b]">Mandates</p>
            <p className="mt-1 text-[14px] font-semibold text-white">APAC</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes frameBarSlide {
          from { transform: scaleX(0); transform-origin: left; }
          to { transform: scaleX(1); transform-origin: left; }
        }
      `}</style>
    </div>
  );
}
