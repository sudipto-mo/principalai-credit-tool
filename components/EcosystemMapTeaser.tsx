"use client";

import Link from "next/link";

export default function EcosystemMapTeaser({
  compact = false,
  height = 680,
}: {
  compact?: boolean;
  height?: number;
}) {
  return (
    <section className="w-full">
      <style jsx>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.18; }
        }
        @keyframes particle-flow {
          0% { offset-distance: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        .node-glow {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        .particle {
          offset-rotate: 0deg;
          animation: particle-flow var(--dur, 4s) linear infinite;
          animation-delay: var(--delay, 0s);
        }
      `}</style>

      <div className={compact ? "" : "mx-auto max-w-6xl px-6"}>
        {compact ? null : (
          <header className="mb-8">
            <h2 className="text-xl font-semibold tracking-tight text-[var(--pa-navy)] sm:text-2xl">Ecosystem Web</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--pa-muted)] sm:text-base">
              Map the financing flows, supply chain dependencies, and capital relationships across the digital
              infrastructure stack.
            </p>
          </header>
        )}

        <div
          className="relative w-full overflow-hidden rounded-xl border border-[#1c1c2c]"
          style={{ height: compact ? `${height}px` : "520px", background: "#08080e" }}
        >
          {/* Header with eyebrow + toggle */}
          <div className="absolute inset-x-0 top-0 z-10 px-4 pt-4 sm:px-5 sm:pt-5">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#4f6ef7] sm:text-[10px]">
              Dorrsum · Data Centre Coverage
            </p>
            <div className="inline-flex gap-[3px] rounded-lg border border-[#1c1c2c] bg-[#0e0e18] p-[3px]">
              <span className="rounded-[5px] bg-[#4f6ef7] px-[14px] py-[6px] text-[11px] font-semibold text-white sm:px-[18px] sm:py-[7px] sm:text-[12px]">
                Supply Chain
              </span>
              <span className="px-[14px] py-[6px] text-[11px] font-semibold text-[#475569] sm:px-[18px] sm:py-[7px] sm:text-[12px]">
                Financing Flows
              </span>
            </div>
          </div>

          {/* Network map SVG */}
          <svg
            viewBox="30 5 740 530"
            className="absolute inset-x-0 bottom-[68px] top-[68px]"
            preserveAspectRatio="xMidYMid meet"
            aria-label="Ecosystem map preview"
            role="img"
          >
            {/* Background cluster zones */}
            <g>
              <rect x="-8" y="20" width="890" height="82" rx="10" fill="#fff" opacity="0.018" />
              <rect x="-8" y="145" width="245" height="308" rx="10" fill="#fff" opacity="0.014" />
              <rect x="168" y="200" width="104" height="288" rx="10" fill="#fff" opacity="0.014" />
              <rect x="340" y="256" width="102" height="192" rx="10" fill="#fff" opacity="0.014" />
              <rect x="505" y="196" width="102" height="214" rx="10" fill="#fff" opacity="0.014" />
              <rect x="688" y="205" width="100" height="290" rx="10" fill="#fff" opacity="0.014" />
            </g>

            {/* Path definitions for particle animation */}
            <defs>
              <path id="p1" d="M93 300 Q 180 300, 358 300" />
              <path id="p2" d="M93 412 Q 200 380, 358 340" />
              <path id="p3" d="M239 240 Q 300 270, 358 290" />
              <path id="p4" d="M239 352 Q 300 330, 358 310" />
              <path id="p5" d="M412 300 Q 470 270, 523 250" />
              <path id="p6" d="M412 300 Q 470 340, 523 370" />
              <path id="p7" d="M239 250 Q 400 245, 523 240" />
              <path id="p8" d="M239 455 Q 400 420, 523 390" />
              <path id="p9" d="M577 380 Q 650 320, 703 258" />
              <path id="p10" d="M577 380 Q 650 370, 703 362" />
              <path id="p11" d="M577 390 Q 650 430, 703 458" />
              <path id="p12" d="M550 267 Q 550 320, 550 353" />
            </defs>

            {/* Supply chain edges (dashed gray) */}
            <g stroke="#4b5775" strokeWidth="1.5" fill="none" strokeDasharray="5 3" opacity="0.55">
              <use href="#p1" />
              <use href="#p2" />
              <use href="#p3" />
              <use href="#p4" />
              <use href="#p5" />
              <use href="#p6" />
            </g>

            {/* Operational edges (green) */}
            <g stroke="#22c55e" strokeWidth="1.5" fill="none" opacity="0.45">
              <use href="#p7" />
              <use href="#p8" />
              <use href="#p9" />
              <use href="#p10" />
              <use href="#p11" />
              <use href="#p12" />
            </g>

            {/* Animated particles - Supply chain (gray) */}
            <g fill="#6b7a94">
              <circle r="3" className="particle" style={{ offsetPath: "path('M93 300 Q 180 300, 358 300')", "--dur": "4s", "--delay": "0s" } as React.CSSProperties} />
              <circle r="3" className="particle" style={{ offsetPath: "path('M93 300 Q 180 300, 358 300')", "--dur": "4s", "--delay": "2s" } as React.CSSProperties} />
              <circle r="3" className="particle" style={{ offsetPath: "path('M93 412 Q 200 380, 358 340')", "--dur": "4.5s", "--delay": "0.5s" } as React.CSSProperties} />
              <circle r="3" className="particle" style={{ offsetPath: "path('M93 412 Q 200 380, 358 340')", "--dur": "4.5s", "--delay": "2.75s" } as React.CSSProperties} />
              <circle r="3" className="particle" style={{ offsetPath: "path('M239 240 Q 300 270, 358 290')", "--dur": "3.5s", "--delay": "0.3s" } as React.CSSProperties} />
              <circle r="3" className="particle" style={{ offsetPath: "path('M239 352 Q 300 330, 358 310')", "--dur": "3.8s", "--delay": "1s" } as React.CSSProperties} />
              <circle r="3" className="particle" style={{ offsetPath: "path('M412 300 Q 470 270, 523 250')", "--dur": "3s", "--delay": "0.2s" } as React.CSSProperties} />
              <circle r="3" className="particle" style={{ offsetPath: "path('M412 300 Q 470 340, 523 370')", "--dur": "3.2s", "--delay": "1.5s" } as React.CSSProperties} />
            </g>

            {/* Animated particles - Operational (green) */}
            <g fill="#22c55e">
              <circle r="3" className="particle" style={{ offsetPath: "path('M239 250 Q 400 245, 523 240')", "--dur": "3.5s", "--delay": "0s" } as React.CSSProperties} />
              <circle r="3" className="particle" style={{ offsetPath: "path('M239 250 Q 400 245, 523 240')", "--dur": "3.5s", "--delay": "1.75s" } as React.CSSProperties} />
              <circle r="3" className="particle" style={{ offsetPath: "path('M239 455 Q 400 420, 523 390')", "--dur": "4s", "--delay": "0.8s" } as React.CSSProperties} />
              <circle r="3" className="particle" style={{ offsetPath: "path('M577 380 Q 650 320, 703 258')", "--dur": "2.8s", "--delay": "0.4s" } as React.CSSProperties} />
              <circle r="3" className="particle" style={{ offsetPath: "path('M577 380 Q 650 320, 703 258')", "--dur": "2.8s", "--delay": "1.8s" } as React.CSSProperties} />
              <circle r="3" className="particle" style={{ offsetPath: "path('M577 380 Q 650 370, 703 362')", "--dur": "2.5s", "--delay": "0.6s" } as React.CSSProperties} />
              <circle r="3" className="particle" style={{ offsetPath: "path('M577 390 Q 650 430, 703 458')", "--dur": "3s", "--delay": "1.2s" } as React.CSSProperties} />
              <circle r="3" className="particle" style={{ offsetPath: "path('M550 267 Q 550 320, 550 353')", "--dur": "2s", "--delay": "0.5s" } as React.CSSProperties} />
            </g>

            {/* Capital nodes - Blue */}
            <g>
              <circle cx="190" cy="64" r="38" fill="#4f6ef7" className="node-glow" style={{ animationDelay: "0s" }} />
              <circle cx="190" cy="64" r="27" fill="#11111c" stroke="#4f6ef7" strokeWidth="1.6" />
              <text x="190" y="68" textAnchor="middle" fill="#ecf0f6" fontSize="10.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Banks</text>
              <text x="190" y="90" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">JPMorgan · Barclays</text>
            </g>
            <g>
              <circle cx="355" cy="46" r="38" fill="#4f6ef7" className="node-glow" style={{ animationDelay: "0.4s" }} />
              <circle cx="355" cy="46" r="27" fill="#11111c" stroke="#4f6ef7" strokeWidth="1.6" />
              <text x="355" y="40" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Private</text>
              <text x="355" y="53" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Credit</text>
              <text x="355" y="72" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">Blue Owl · Apollo · Ares</text>
            </g>
            <g>
              <circle cx="510" cy="64" r="38" fill="#4f6ef7" className="node-glow" style={{ animationDelay: "0.8s" }} />
              <circle cx="510" cy="64" r="27" fill="#11111c" stroke="#4f6ef7" strokeWidth="1.6" />
              <text x="510" y="58" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">PE &amp;</text>
              <text x="510" y="71" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Infra</text>
              <text x="510" y="90" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">Blackstone · KKR</text>
            </g>
            <g>
              <circle cx="660" cy="46" r="38" fill="#4f6ef7" className="node-glow" style={{ animationDelay: "1.2s" }} />
              <circle cx="660" cy="46" r="27" fill="#11111c" stroke="#4f6ef7" strokeWidth="1.6" />
              <text x="660" y="50" textAnchor="middle" fill="#ecf0f6" fontSize="10.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">REITs</text>
              <text x="660" y="72" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">Digital Realty</text>
            </g>

            {/* Supply nodes - Amber */}
            <g>
              <circle cx="66" cy="178" r="38" fill="#f59e0b" className="node-glow" style={{ animationDelay: "0.2s" }} />
              <circle cx="66" cy="178" r="27" fill="#11111c" stroke="#f59e0b" strokeWidth="1.6" />
              <text x="66" y="182" textAnchor="middle" fill="#ecf0f6" fontSize="10.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Silicon</text>
              <text x="66" y="204" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">NVIDIA · AMD</text>
            </g>
            <g>
              <circle cx="66" cy="300" r="38" fill="#f59e0b" className="node-glow" style={{ animationDelay: "0.6s" }} />
              <circle cx="66" cy="300" r="27" fill="#11111c" stroke="#f59e0b" strokeWidth="1.6" />
              <text x="66" y="304" textAnchor="middle" fill="#ecf0f6" fontSize="10.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Hardware</text>
              <text x="66" y="326" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">Dell · HPE</text>
            </g>
            <g>
              <circle cx="66" cy="412" r="38" fill="#f59e0b" className="node-glow" style={{ animationDelay: "1.0s" }} />
              <circle cx="66" cy="412" r="27" fill="#11111c" stroke="#f59e0b" strokeWidth="1.6" />
              <text x="66" y="406" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Cooling &amp;</text>
              <text x="66" y="419" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Power</text>
              <text x="66" y="438" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">Vertiv · Schneider</text>
            </g>

            {/* Infrastructure nodes - Orange */}
            <g>
              <circle cx="212" cy="240" r="38" fill="#f97316" className="node-glow" style={{ animationDelay: "0.3s" }} />
              <circle cx="212" cy="240" r="27" fill="#11111c" stroke="#f97316" strokeWidth="1.6" />
              <text x="212" y="234" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Power</text>
              <text x="212" y="247" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Grid ⚠</text>
              <text x="212" y="266" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">Utilities · PPAs</text>
            </g>
            <g>
              <circle cx="212" cy="352" r="38" fill="#f97316" className="node-glow" style={{ animationDelay: "0.7s" }} />
              <circle cx="212" cy="352" r="27" fill="#11111c" stroke="#f97316" strokeWidth="1.6" />
              <text x="212" y="346" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Land &amp;</text>
              <text x="212" y="359" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Site</text>
              <text x="212" y="378" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">Landowners</text>
            </g>
            <g>
              <circle cx="212" cy="455" r="38" fill="#f97316" className="node-glow" style={{ animationDelay: "1.1s" }} />
              <circle cx="212" cy="455" r="27" fill="#11111c" stroke="#f97316" strokeWidth="1.6" />
              <text x="212" y="449" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Connec-</text>
              <text x="212" y="462" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">tivity</text>
              <text x="212" y="481" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">Fibre · Subsea</text>
            </g>

            {/* Build nodes - Purple */}
            <g>
              <circle cx="385" cy="300" r="38" fill="#a855f7" className="node-glow" style={{ animationDelay: "0.5s" }} />
              <circle cx="385" cy="300" r="27" fill="#11111c" stroke="#a855f7" strokeWidth="1.6" />
              <text x="385" y="294" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">DC</text>
              <text x="385" y="307" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Developers</text>
              <text x="385" y="326" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">Vantage · QTS · NTT</text>
            </g>
            <g>
              <circle cx="385" cy="420" r="38" fill="#a855f7" className="node-glow" style={{ animationDelay: "0.9s" }} />
              <circle cx="385" cy="420" r="27" fill="#11111c" stroke="#a855f7" strokeWidth="1.6" />
              <text x="385" y="414" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Contrac-</text>
              <text x="385" y="427" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">tors</text>
              <text x="385" y="446" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">Mortenson · Turner</text>
            </g>

            {/* Operate nodes - Green */}
            <g>
              <circle cx="550" cy="240" r="38" fill="#22c55e" className="node-glow" style={{ animationDelay: "0.35s" }} />
              <circle cx="550" cy="240" r="27" fill="#11111c" stroke="#22c55e" strokeWidth="1.6" />
              <text x="550" y="244" textAnchor="middle" fill="#ecf0f6" fontSize="10.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Colocation</text>
              <text x="550" y="266" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">Equinix · Digital Realty</text>
            </g>
            <g>
              <circle cx="550" cy="380" r="38" fill="#22c55e" className="node-glow" style={{ animationDelay: "0.75s" }} />
              <circle cx="550" cy="380" r="27" fill="#11111c" stroke="#22c55e" strokeWidth="1.6" />
              <text x="550" y="374" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Hyper-</text>
              <text x="550" y="387" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">scalers</text>
              <text x="550" y="406" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">AWS · Azure · Google</text>
            </g>

            {/* Demand nodes - Pink */}
            <g>
              <circle cx="730" cy="248" r="38" fill="#ec4899" className="node-glow" style={{ animationDelay: "0.45s" }} />
              <circle cx="730" cy="248" r="27" fill="#11111c" stroke="#ec4899" strokeWidth="1.6" />
              <text x="730" y="252" textAnchor="middle" fill="#ecf0f6" fontSize="10.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">AI Cos</text>
              <text x="730" y="274" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">OpenAI · Anthropic</text>
            </g>
            <g>
              <circle cx="730" cy="362" r="38" fill="#ec4899" className="node-glow" style={{ animationDelay: "0.85s" }} />
              <circle cx="730" cy="362" r="27" fill="#11111c" stroke="#ec4899" strokeWidth="1.6" />
              <text x="730" y="356" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Enter-</text>
              <text x="730" y="369" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">prise</text>
              <text x="730" y="388" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">Fortune 500</text>
            </g>
            <g>
              <circle cx="730" cy="468" r="38" fill="#ec4899" className="node-glow" style={{ animationDelay: "1.25s" }} />
              <circle cx="730" cy="468" r="27" fill="#11111c" stroke="#ec4899" strokeWidth="1.6" />
              <text x="730" y="462" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">Sovereign</text>
              <text x="730" y="475" textAnchor="middle" fill="#ecf0f6" fontSize="9.5" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">AI</text>
              <text x="730" y="494" textAnchor="middle" fill="#3a4a60" fontSize="7.5" fontFamily="Inter, system-ui, sans-serif">Govts · National AI</text>
            </g>

            {/* Watermark */}
            <text x="858" y="558" textAnchor="end" fill="#1e2236" fontSize="8" fontWeight="600" letterSpacing="0.04em" fontFamily="Inter, system-ui, sans-serif">
              © 2026 Dorrsum
            </text>
          </svg>

          {/* Pinned teaser bar */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
            <div className="pointer-events-auto flex w-full items-center justify-between gap-3 border-t border-[#1c1c2c] bg-[#111118] px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#26264a] bg-[#14142a]">
                  <svg className="h-5 w-5 text-[#94a3b8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold leading-tight text-[#f1f5f9] sm:text-[13px]">
                    Ecosystem Web · Interactive
                  </p>
                  <p className="mt-0.5 text-[10px] leading-snug text-[#64748b] sm:text-[11px]">
                    You're authenticated — open the map to trace live capital flows.
                  </p>
                </div>
              </div>
              <Link
                href="/dc-network-map.html"
                className="shrink-0 rounded-lg bg-[#4f6ef7] px-4 py-2.5 text-[11px] font-semibold text-white no-underline transition-colors hover:bg-[#3b5bdb] sm:px-5 sm:py-3 sm:text-[12px]"
              >
                Explore the Ecosystem Web
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
