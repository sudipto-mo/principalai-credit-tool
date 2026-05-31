'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { HERO_MARKETING, getHeroCarouselSlides } from '@/lib/hero-marketing';
import { isAdvisoryEnabled } from '@/lib/advisory-access';
import { heroPreviewViz } from '@/lib/hero-preview-viz-styles';
import { PHYSICAL_STACK_HERO_DETAILS, PHYSICAL_STACK_SUPPLY_TOC } from '@/lib/physical-stack-contents';

// ─────────────────────────────────────────────────────────────────────────────
// PRINCIPAL AI — Hero Preview Section
// Drop this component into your homepage. Requires:
//   - Fonts: Source Serif 4 + Space Grotesk via next/font on <html> (see app/layout.tsx)
//   - Tailwind NOT required — all styles are inline
// Usage: <HeroPreview /> — primary chrome is `SiteNavbar` in root layout (single nav).
// ─────────────────────────────────────────────────────────────────────────────



/* ─── ANIMATED CANVAS BACKGROUND ─────────────────────────────────────── */
function BackgroundNetwork() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const N = [
      {ox:.11,oy:.33,ph:0.0},{ox:.11,oy:.55,ph:0.5},{ox:.11,oy:.75,ph:1.1},
      {ox:.27,oy:.22,ph:0.3},{ox:.38,oy:.12,ph:0.8},{ox:.29,oy:.64,ph:1.3},
      {ox:.29,oy:.82,ph:0.6},{ox:.46,oy:.56,ph:0.2,big:1},{ox:.46,oy:.73,ph:0.9},
      {ox:.60,oy:.13,ph:1.0},{ox:.66,oy:.38,ph:0.4,big:1},{ox:.66,oy:.64,ph:0.7,big:1},
      {ox:.82,oy:.28,ph:1.4},{ox:.82,oy:.52,ph:0.1},{ox:.82,oy:.76,ph:0.65},
      {ox:.70,oy:.09,ph:0.95},
    ];
    const E = [
      [0,7],[1,7],[2,7],[5,7],[6,8],[3,7],[4,10],
      [7,10],[7,11],[10,12],[10,13],[11,13],[11,14],
      [3,10],[9,10],[15,10],
    ];

    let t = 0;
    const DRIFT = 0.007, SPD = 0.00045;
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0,0,W,H);
      t += SPD;
      const pos = N.map((n,i) => ({
        x: (n.ox + Math.sin(t + n.ph) * DRIFT) * W,
        y: (n.oy + Math.cos(t*1.2 + n.ph) * DRIFT * 0.6) * H,
      }));
      ctx.strokeStyle = 'rgba(28,52,110,0.055)';
      ctx.lineWidth = 0.6;
      E.forEach(([a,b]) => {
        ctx.beginPath();
        ctx.moveTo(pos[a].x, pos[a].y);
        ctx.lineTo(pos[b].x, pos[b].y);
        ctx.stroke();
      });
      pos.forEach((p,i) => {
        const r = N[i].big ? 5.5 : 3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(28,52,110,${N[i].big ? 0.10 : 0.07})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}/>;
}

/* ─── CARD VIZ 1: PHYSICAL STACK — report preview ────────────────────── */
function PhysicalStackViz() {
  const sections = PHYSICAL_STACK_SUPPLY_TOC.map((s, i) => ({
    ...s,
    ...PHYSICAL_STACK_HERO_DETAILS[i]!,
  }));

  const [active, setActive] = useState<number | null>(null);

  return (
    <div style={{ height:'100%', overflowY:'auto', background:'oklch(95.5% 0.012 82)',
      padding: heroPreviewViz.pad, scrollbarWidth:'none' }}>

      {/* Report header — full Contents lives on /research/dc-infrastructure/physical-stack */}
      <div style={{ marginBottom:12, paddingBottom:11, borderBottom:'1px solid rgba(80,60,20,0.14)' }}>
        <div style={{ ...heroPreviewViz.eyebrow, marginBottom:4 }}>STRATEGY · APAC · APRIL 2026</div>
        <div style={heroPreviewViz.reportTitle}>The Physical Stack: Where the Bottlenecks Are</div>
        <div style={{ ...heroPreviewViz.deckItalic, marginTop:8 }}>
          Preview: hover a supply-chain node for a snapshot — open the report for the full contents.
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap: heroPreviewViz.rowGap }}>
        {sections.map((s,i) => (
          <div key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            style={{
              padding: heroPreviewViz.rowPadding, borderRadius:3,
              background: active===i ? 'rgba(80,60,20,0.07)' : 'transparent',
              borderLeft: active===i ? `2px solid ${s.statusColor}` : '2px solid rgba(80,60,20,0.10)',
              cursor:'default', transition:'all 0.22s ease',
            }}>
            <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:8, marginBottom: active===i ? 6 : 0 }}>
              <span style={heroPreviewViz.rowNum}>{s.num}.</span>
              <span style={heroPreviewViz.rowPrimary}>{s.title}</span>
              <span style={{
                ...heroPreviewViz.statusBadge,
                background:`${s.statusColor}18`,
                color: s.statusColor,
              }}>{s.status}</span>
            </div>
            {active===i && (
              <div>
                <div style={{ display:'flex', alignItems:'baseline', flexWrap:'wrap', gap:6, marginBottom:4 }}>
                  <span style={heroPreviewViz.statFigure}>{s.stat}</span>
                  <span style={heroPreviewViz.statCaption}>{s.statLabel}</span>
                </div>
                <div style={{
                  ...heroPreviewViz.detailText,
                  borderTop:'1px solid rgba(80,60,20,0.10)', paddingTop:6, marginTop:6,
                }}>{s.note}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CARD VIZ 2: THE WORLDVIEW — report preview ─────────────────────── */
function WorldviewViz() {
  const [active, setActive] = useState<number | null>(null);

  const layers = [
    {
      label:'DEMAND LAYER', sublabel:'Hyperscalers in APAC',
      color:'#60a5fa', darkColor:'#1a4a8a',
      stat:'US$660–690B', statLabel:'combined global capex 2026 — nearly doubling 2025 levels',
      players:[
        { n:'Microsoft', note:'US$1.7B Indonesia commitment · Azure across 8 APAC markets' },
        { n:'Google', note:'US$15B AdaniConneX campus · Visakhapatnam · 1 GW' },
        { n:'Amazon', note:'Largest single tenant across APAC colo operators' },
        { n:'Meta', note:'Candle cable 570 Tbps · Japan→Singapore · 2028 delivery' },
        { n:'Oracle', note:'US$50B global capex · Singapore, Japan, India focus' },
      ],
    },
    {
      label:'SUPPLY LAYER', sublabel:'Who Is Building the Facilities',
      color:'#a78bfa', darkColor:'#4a2a8a',
      stat:'18.3%', statLabel:'APAC colo CAGR · US$29.6B (2025) → US$68.5B (2030)',
      players:[
        { n:'Equinix', note:'SG6 US$260M under construction · S$650M green bonds raised' },
        { n:'Digital Realty', note:'S$7B Singapore investment · 150 kW per cabinet capability' },
        { n:'AirTrunk', note:'A$24B Blackstone acquisition · A$16B refinancing · India entry' },
        { n:'NEXTDC', note:'A$7B OpenAI MoU · 550 MW S7 campus Sydney · A$2.2B FY26 capex' },
        { n:'STT GDC', note:'S$13.8B EV · 2.3 GW design capacity · 12 APAC markets' },
        { n:'GDS / DayOne', note:'RM 15B green financing · 750 MW committed SEA power' },
      ],
    },
    {
      label:'CAPITAL LAYER', sublabel:'Who Is Financing This',
      color:'#34d399', darkColor:'#0a6640',
      stat:'A$24B', statLabel:'largest single data centre transaction — Blackstone / AirTrunk',
      players:[
        { n:'Blackstone', note:'AirTrunk acquisition · targeting A$100B platform' },
        { n:'KKR + Singtel', note:'STT GDC full acquisition S$13.8B EV · H2 2026 close' },
        { n:'CPP Investments', note:'Co-investor with Blackstone in AirTrunk' },
        { n:'Domestic India', note:'Reliance + Adani balance-sheet capital · no PE structure' },
        { n:'Green Bonds', note:'ESG-linked financing now default instrument across APAC' },
      ],
    },
    {
      label:'GEO HEAT MAP', sublabel:'Where Capital Is Flowing',
      color:'#fbbf24', darkColor:'#7a4800',
      stat:'3 GW', statLabel:'Reliance Jamnagar — world\'s largest planned AI data centre campus',
      players:[
        { n:'Singapore', note:'Hub under pressure · capacity-controlled · premium pricing' },
        { n:'Japan', note:'Nuclear baseload advantage · Tokyo + Osaka second-largest market' },
        { n:'India', note:'1.7 GW current → potential 4× by 2030 · greenfield frontier' },
        { n:'Australia', note:'NEXTDC-OpenAI sovereign AI play · 550 MW S7 campus' },
        { n:'SEA Corridor', note:'Malaysia leads · Vietnam emerging · Indonesia Meta-enabled' },
      ],
    },
  ];

  return (
    <div style={{
      height:'100%', overflowY:'auto', background:'oklch(95.5% 0.012 82)',
      padding: heroPreviewViz.pad, scrollbarWidth:'none',
    }}>
      {/* Header — aligned with Physical Stack preview (eyebrow + deck) */}
      <div style={{ marginBottom:12, paddingBottom:11,
        borderBottom:'1px solid rgba(80,60,20,0.14)' }}>
        <div style={{ ...heroPreviewViz.eyebrow, marginBottom:6 }}>Capital Intelligence · APAC 2026</div>
        <div style={heroPreviewViz.deckItalic}>
          A multi-layered deployment involving sovereign wealth, PE, domestic conglomerates,
          and AI-native operators — each at a distinct position in the stack.
        </div>
      </div>

      {/* Layer rows */}
      <div style={{ display:'flex', flexDirection:'column', gap: heroPreviewViz.rowGap }}>
        {layers.map((l,i) => (
          <div key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            style={{
              padding: heroPreviewViz.rowPaddingWorldview,
              background: active===i ? 'rgba(80,60,20,0.07)' : 'transparent',
              borderRadius:3,
              borderLeft: active===i ? `2px solid ${l.darkColor}` : '2px solid rgba(80,60,20,0.10)',
              cursor:'default', transition:'all 0.22s ease',
            }}>
            <div style={{ display:'flex', alignItems:'baseline', flexWrap:'wrap', gap:8, marginBottom: active===i ? 8 : 0 }}>
              <span style={{ ...heroPreviewViz.layerTag, color: l.darkColor }}>{l.label}</span>
              <span style={heroPreviewViz.rowSecondary}>{l.sublabel}</span>
            </div>

            {active===i && (
              <div>
                <div style={{ display:'flex', alignItems:'baseline', flexWrap:'wrap', gap:8, marginBottom:10 }}>
                  <span style={heroPreviewViz.statFigure}>{l.stat}</span>
                  <span style={heroPreviewViz.statCaption}>{l.statLabel}</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                  {l.players.map((p,pi) => (
                    <div key={pi} style={{ display:'flex', gap:8, alignItems:'baseline' }}>
                      <span style={{ ...heroPreviewViz.playerName, color: l.darkColor }}>{p.n}</span>
                      <span style={heroPreviewViz.playerNote}>{p.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CARD VIZ 3: ECOSYSTEM WEB ──────────────────────────────────────── */
function EcosystemViz() {
  const tickRef = useRef(0);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => { tickRef.current++; setTick(tickRef.current); }, 40);
    return () => clearInterval(id);
  }, []);

  const t = tick * 0.018;
  const nodes = [
    {id:'si',  l:'Silicon',         x:14, y:34, r:15, c:'#a78bfa', g:'#7c3aed'},
    {id:'hw',  l:'Hardware',        x:14, y:54, r:14, c:'#a78bfa', g:'#7c3aed'},
    {id:'cp',  l:'Cooling',         x:14, y:72, r:14, c:'#a78bfa', g:'#7c3aed'},
    {id:'ls',  l:'Land & Site',     x:30, y:64, r:13, c:'#a78bfa', g:'#7c3aed'},
    {id:'co',  l:'Connect.',        x:30, y:80, r:12, c:'#818cf8', g:'#6366f1'},
    {id:'dc',  l:'DC Dev.',         x:47, y:57, r:23, c:'#818cf8', g:'#4f46e5', big:true},
    {id:'pc',  l:'Private\nCredit', x:34, y:15, r:18, c:'#34d399', g:'#059669'},
    {id:'pe',  l:'PE &\nInfra',     x:58, y:12, r:18, c:'#34d399', g:'#059669'},
    {id:'cl',  l:'Colocation',      x:70, y:37, r:21, c:'#34d399', g:'#059669', big:true},
    {id:'hy',  l:'Hyper-\nscalers', x:70, y:66, r:21, c:'#34d399', g:'#059669', big:true},
    {id:'ai',  l:'AI Cos',          x:88, y:27, r:13, c:'#94a3b8', g:'#64748b'},
    {id:'en',  l:'Enterprise',      x:88, y:52, r:13, c:'#94a3b8', g:'#64748b'},
    {id:'sv',  l:'Sovereign\nAI',   x:88, y:76, r:12, c:'#94a3b8', g:'#64748b'},
  ];
  const edges = [
    ['si','dc'],['hw','dc'],['cp','dc'],['ls','dc'],['co','dc'],
    ['dc','cl'],['dc','hy'],['pc','dc'],['pe','cl'],['pe','hy'],
    ['cl','ai'],['cl','en'],['hy','en'],['hy','sv'],
  ];
  const NM: Record<string, (typeof nodes)[number]> = {};
  nodes.forEach(n => { NM[n.id] = n; });

  const W=300, H=200;
  const px = (p: number) => p*W/100, py = (p: number) => p*H/100;
  /** Stable stringification for SVG attrs — avoids server/client float hydration mismatches. */
  const q = (n: number, places = 3) => Math.round(n * 10 ** places) / 10 ** places;
  const pos: Record<string, { x: number; y: number }> = {};
  nodes.forEach((n,i) => {
    pos[n.id] = {
      x: q(px(n.x) + Math.sin(t + i*0.71)*1.4),
      y: q(py(n.y) + Math.cos(t*1.15 + i*0.53)*1.1),
    };
  });

  return (
    <div style={{ width:'100%', height:'100%', padding:'14px 14px 14px', boxSizing:'border-box' }}>
    <div style={{ width:'100%', height:'calc(100% - 28px)', background:'oklch(11% 0.05 260)', borderRadius:6, overflow:'hidden', padding:'6px 2px 0' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'100%' }}>
        <defs>
          <filter id="eglow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {nodes.map(n => (
            <radialGradient key={`rg-${n.id}`} id={`rg-${n.id}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor={n.c} stopOpacity="0.92"/>
              <stop offset="100%" stopColor={n.g} stopOpacity="0.72"/>
            </radialGradient>
          ))}
        </defs>

        {edges.map(([a,b],i) => {
          const pa=pos[a], pb=pos[b];
          const isGreen = NM[b].c==='#34d399';
          const isCapital = a==='pc'||a==='pe';
          return (
            <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
              stroke={isGreen?'#34d399':'#818cf8'}
              strokeOpacity={0.28} strokeWidth={0.8}
              strokeDasharray={isCapital?'2.5 3':'none'}/>
          );
        })}

        {nodes.map((n,i) => {
          const p = pos[n.id];
          const pulsed = q(0.10 + 0.06*Math.sin(t*1.3 + i*0.8), 4);
          return (
            <g key={n.id} filter="url(#eglow)">
              <circle cx={p.x} cy={p.y} r={n.r+6} fill={n.g} opacity={pulsed}/>
              <circle cx={p.x} cy={p.y} r={n.r}
                fill={`url(#rg-${n.id})`} stroke={n.g} strokeWidth={1.5} strokeOpacity={0.6}/>
              {n.l.split('\n').map((line,li,arr) => (
                <text key={li}
                  x={p.x} y={p.y+(li-(arr.length-1)/2)*(n.big?9.5:8.5)}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="rgba(255,255,255,0.92)"
                  fontSize={n.big?8.5:7.5} fontWeight="600"
                  fontFamily="DM Sans,sans-serif"
                  style={{userSelect:'none'}}>{line}</text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
    </div>
  );
}

/* ─── WORK CARD ──────────────────────────────────────────────────────── */
function WorkCard({ type, title, subtitle, date, region, accent, light, href, children, ..._rest }: {
  type: string; title: string; subtitle?: string; date?: string; region?: string;
  accent: string; light?: boolean; href?: string; children?: React.ReactNode;
}) {
  void _rest;
  const [hov, setHov] = useState(false);
  const bg   = light ? 'oklch(95% 0.014 82)'   : 'oklch(10% 0.048 255)';
  const fade = light
    ? 'linear-gradient(to top, oklch(95% 0.014 82) 0%, transparent 100%)'
    : 'linear-gradient(to top, oklch(10% 0.048 255) 0%, transparent 100%)';
  const titleColor    = light ? 'oklch(14% 0.07 258)' : 'rgba(255,255,255,0.92)';
  const subColor      = light ? 'oklch(35% 0.05 70)'  : 'rgba(255,255,255,0.38)';
  const metaColor     = light ? 'oklch(48% 0.04 70)'  : 'rgba(255,255,255,0.22)';
  const arrowBorder   = light ? '1px solid rgba(0,0,0,0.18)' : '1px solid rgba(255,255,255,0.14)';
  const arrowColor    = light ? 'rgba(0,0,0,0.5)'     : 'rgba(255,255,255,0.55)';

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:'relative', background:bg,
        borderRadius:4, overflow:'hidden',
        display:'flex', flexDirection:'column',
        cursor:'pointer', width:'100%', height:'100%',
        transition:'box-shadow 0.4s ease',
        boxShadow: hov
          ? '0 32px 90px rgba(0,0,0,0.38), 0 0 0 1px rgba(120,165,255,0.10)'
          : '0 4px 28px rgba(0,0,0,0.22)',
      }}>

      <div style={{ flex:1, minHeight:0, overflow:'hidden', position:'relative' }}>
        {children}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'45%',
          background:fade, pointerEvents:'none' }}/>
      </div>

      <div style={{ padding:'16px 20px 20px', flexShrink:0 }}>
        <div style={{ fontSize:9.5, letterSpacing:'0.18em', textTransform:'uppercase',
          color: accent, fontWeight:600, marginBottom:8 }}>{type}</div>
        <div style={{ fontSize:18, fontFamily:'var(--font-serif),ui-serif,Georgia,serif', fontWeight:700,
          color:titleColor, lineHeight:1.22, marginBottom: subtitle ? 6 : 0 }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize:13, fontFamily:'var(--font-serif),ui-serif,Georgia,serif', fontStyle:'italic',
            color:subColor, lineHeight:1.35, marginBottom:8 }}>{subtitle}</div>
        )}
        {(date || region) && (
          <div style={{ display:'flex', gap:7, alignItems:'center', marginTop:6 }}>
            {date && <span style={{ fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase',
              color:metaColor, fontWeight:500 }}>{date}</span>}
            {date && region && <span style={{ color:metaColor, fontSize:9 }}>·</span>}
            {region && <span style={{ fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase',
              color:metaColor, fontWeight:500 }}>{region}</span>}
          </div>
        )}
      </div>

      {href ? (
        <Link
          href={href}
          aria-label={`Open ${title}`}
          style={{
            textDecoration:'none',
            position:'absolute', top:14, right:14, width:28, height:28,
            border: arrowBorder, borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:arrowColor, fontSize:12,
            opacity: hov ? 1 : 0,
            transform: hov ? 'scale(1)' : 'scale(0.75)',
            transition:'all 0.3s cubic-bezier(0.23,1,0.32,1)',
          }}
        >↗</Link>
      ) : (
        <div style={{
          position:'absolute', top:14, right:14, width:28, height:28,
          border: arrowBorder, borderRadius:'50%',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:arrowColor, fontSize:12,
          opacity: hov ? 1 : 0,
          transform: hov ? 'scale(1)' : 'scale(0.75)',
          transition:'all 0.3s cubic-bezier(0.23,1,0.32,1)',
        }}>↗</div>
      )}
    </div>
  );
}

/* ─── CAROUSEL ───────────────────────────────────────────────────────── */
function Carousel({ cards }: { cards: any[] }) {
  /** Must match server render (always 0) — restore from localStorage after mount to avoid hydration mismatch. */
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pai-carousel');
      const saved = raw ? parseInt(raw, 10) : 0;
      if (!Number.isNaN(saved)) {
        setIdx(Math.min(Math.max(0, saved), Math.max(0, cards.length - 1)));
      }
    } catch {
      /* ignore */
    }
  }, [cards.length]);

  const go = (dir: number) => {
    const next = Math.max(0, Math.min(cards.length - 1, idx + dir));
    setIdx(next);
    localStorage.setItem('pai-carousel', String(next));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx]);

  return (
    <div style={{ position:'relative', flex:1, display:'flex', flexDirection:'column',
      minWidth:0, minHeight:0 }}>

      {/* Slides — minHeight:0 so flex children can shrink and clip (avoids card spilling over controls) */}
      <div style={{ flex:1, minHeight:0, overflow:'hidden', borderRadius:4 }}>
        <div style={{
          display:'flex', height:'100%',
          transform:`translateX(calc(-${idx * 100}% - ${idx * 12}px))`,
          transition:'transform 0.55s cubic-bezier(0.77,0,0.18,1)',
          gap:12,
        }}>
          {cards.map((card, i) => (
            <div key={i} style={{ flex:'0 0 100%', height:'100%', minHeight:0 }}>
              <WorkCard {...card}>{card.viz}</WorkCard>
            </div>
          ))}
        </div>
      </div>

      {/* Controls row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        marginTop:16, paddingLeft:2 }}>

        {/* Dots */}
        <div style={{ display:'flex', gap:8 }}>
          {cards.map((_,i) => (
            <button key={i} onClick={() => { setIdx(i); localStorage.setItem('pai-carousel', String(i)); }}
              style={{
                width: i===idx ? 22 : 7, height:7, borderRadius:4,
                background: i===idx ? 'oklch(15% 0.07 258)' : 'oklch(15% 0.07 258 / 0.22)',
                border:'none', cursor:'pointer', padding:0,
                transition:'all 0.35s cubic-bezier(0.23,1,0.32,1)',
              }}/>
          ))}
        </div>

        {/* Counter + Arrows */}
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:11, color:'oklch(40% 0.05 258)', letterSpacing:'0.06em',
            fontWeight:400 }}>{idx+1} / {cards.length}</span>
          {[-1, 1].map(dir => (
            <button key={dir} onClick={() => go(dir)}
              disabled={dir===-1 ? idx===0 : idx===cards.length-1}
              style={{
                width:36, height:36, borderRadius:'50%',
                border:'1.5px solid oklch(15% 0.07 258 / 0.28)',
                background:'transparent', cursor: (dir===-1 ? idx===0 : idx===cards.length-1) ? 'default' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                color: (dir===-1 ? idx===0 : idx===cards.length-1) ? 'oklch(15% 0.07 258 / 0.2)' : 'oklch(15% 0.07 258)',
                fontSize:14,
                transition:'all 0.2s ease',
              }}>{dir===-1 ? '←' : '→'}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

const TWEAK_DEFAULTS = { showSubtitles: true, cardGap: 12 };

/* ─── TWEAKS PANEL ───────────────────────────────────────────────────── */
function TweaksPanel({ visible }: { visible: boolean }) {
  const [subs, setSubs] = useState(TWEAK_DEFAULTS.showSubtitles);
  const [gap, setGap] = useState(TWEAK_DEFAULTS.cardGap);

  const send = (edits: Record<string, unknown>) => {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
  };

  if (!visible) return null;
  return (
    <div style={{
      position:'fixed', bottom:24, right:24, zIndex:999,
      background:'white', borderRadius:8, padding:'18px 22px',
      boxShadow:'0 12px 40px rgba(0,0,0,0.14)',
      border:'1px solid rgba(0,0,0,0.08)',
      minWidth:210,
    }}>
      <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.1em',
        textTransform:'uppercase', color:'#888', marginBottom:14 }}>Tweaks</div>

      <label style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, cursor:'pointer' }}>
        <input type="checkbox" checked={subs} onChange={e => {
          setSubs(e.target.checked);
          send({ showSubtitles: e.target.checked });
        }}/>
        <span style={{ fontSize:13, color:'#333' }}>Show report subtitles</span>
      </label>

      <div style={{ marginBottom:4 }}>
        <div style={{ fontSize:12, color:'#555', marginBottom:6 }}>Card gap: {gap}px</div>
        <input type="range" min={4} max={20} value={gap}
          onChange={e => { setGap(+e.target.value); send({ cardGap: +e.target.value }); }}
          style={{ width:'100%' }}/>
      </div>
    </div>
  );
}

/* ─── APP ─────────────────────────────────────────────────────────────── */
export default function HeroPreview() {
  const [loaded, setLoaded] = useState(false);
  const [tweaks, setTweaks] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 120);

    // Tweaks protocol
    window.addEventListener('message', (e) => {
      if (e.data?.type === '__activate_edit_mode')   setTweaks(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaks(false);
    });
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
  }, []);

  const fadeIn = (delay = '0s') => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'none' : 'translateY(20px)',
    transition: `opacity 0.9s ease ${delay}, transform 0.9s ease ${delay}`,
  });

  const carouselCards = getHeroCarouselSlides().map(({ vizKey, ...meta }) => ({
    ...meta,
    viz:
      vizKey === 'physical' ? <PhysicalStackViz /> :
      vizKey === 'worldview' ? <WorldviewViz /> :
      <EcosystemViz />,
  }));

  const hm = HERO_MARKETING;

  return (
    <div style={{ minHeight:'100vh', background:'oklch(95.5% 0.010 82)' }}>
      <BackgroundNetwork />

      <main style={{ position:'relative', zIndex:1, paddingTop:0, paddingBottom:48,
        minHeight:'100vh', display:'flex', alignItems:'flex-start' }}>
        <div style={{
          width:'100%', maxWidth:1440, margin:'0 auto',
          padding:'52px 60px 72px',
          display:'flex', alignItems:'stretch', gap:68,
        }}>

          {/* ── LEFT: HERO TEXT ── */}
          <div style={{ flex:'0 0 36%', display:'flex', flexDirection:'column',
            justifyContent:'center', ...fadeIn('0s') }}>

            <div style={{ fontSize:9.5, letterSpacing:'0.22em', textTransform:'uppercase',
              color:'oklch(46% 0.14 253)', fontWeight:600, marginBottom:22 }}>
              {hm.eyebrow}
            </div>

            <h1 style={{
              fontFamily:'var(--font-serif),ui-serif,Georgia,serif',
              fontSize:'clamp(28px,3vw,50px)',
              fontWeight:700, lineHeight:1.08,
              letterSpacing:'-0.018em',
              color:'oklch(13% 0.07 258)',
              marginBottom:26,
            }}>
              {hm.headline}
            </h1>

            <p style={{
              fontSize:15, lineHeight:1.80,
              color:'oklch(33% 0.05 258)',
              fontWeight:300,
              maxWidth:370, marginBottom:40,
            }}>
              {hm.body}
            </p>

            <div style={{ display:'flex', gap:12 }}>
              <Link
                href={hm.primaryCta.href}
                style={{
                  textDecoration:'none',
                  padding:'13px 26px',
                  background:'oklch(13% 0.07 258)', color:'white',
                  border:'none', borderRadius:2,
                  fontSize:10.5, letterSpacing:'0.13em', textTransform:'uppercase',
                  fontWeight:600, cursor:'pointer',
                  transition:'opacity 0.2s',
                }}
                onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.opacity='0.85';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.opacity='1';}}
              >{hm.primaryCta.label}</Link>

              {isAdvisoryEnabled() ? (
                <Link
                  href={hm.secondaryCta.href}
                  style={{
                    textDecoration:'none',
                    padding:'13px 26px',
                    background:'transparent',
                    color:'oklch(13% 0.07 258)',
                    border:'1.5px solid oklch(13% 0.07 258 / 0.45)',
                    borderRadius:2,
                    fontSize:10.5, letterSpacing:'0.13em', textTransform:'uppercase',
                    fontWeight:600, cursor:'pointer',
                    transition:'border-color 0.2s',
                    display:'inline-flex',
                    alignItems:'center',
                    gap:8,
                  }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.borderColor='oklch(13% 0.07 258 / 0.8)';}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.borderColor='oklch(13% 0.07 258 / 0.45)';}}
                >
                  {hm.secondaryCta.label}
                  <span style={{
                    fontSize:8, fontWeight:700, letterSpacing:'0.08em',
                    padding:'2px 5px', borderRadius:2,
                    border:'1px solid oklch(13% 0.07 258 / 0.25)',
                    color:'oklch(13% 0.07 258 / 0.55)',
                  }}>WIP</span>
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  style={{
                    padding:'13px 26px',
                    background:'transparent',
                    color:'oklch(13% 0.07 258 / 0.35)',
                    border:'1.5px solid oklch(13% 0.07 258 / 0.18)',
                    borderRadius:2,
                    fontSize:10.5, letterSpacing:'0.13em', textTransform:'uppercase',
                    fontWeight:600, cursor:'not-allowed',
                    userSelect:'none',
                  }}
                >
                  {hm.secondaryCta.label}
                </span>
              )}
            </div>
          </div>

          {/* ── RIGHT: CAROUSEL — alignSelf keeps clamp height when left column is taller */}
          <div style={{
            flex:1, display:'flex', flexDirection:'column',
            alignSelf:'flex-start',
            width:'100%',
            height:'clamp(360px, 62vh, 540px)',
            ...fadeIn('0.18s'),
          }}>
            <Carousel cards={carouselCards}/>
          </div>
        </div>
      </main>

      <TweaksPanel visible={tweaks} />
    </div>
  );
}
