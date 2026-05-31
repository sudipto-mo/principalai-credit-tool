"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GitCompare, SlidersHorizontal, FileSearch } from "lucide-react";
import CompanyEntitySelector from "./CompanyEntitySelector";
import { resolveCreditDeskCompany, type CreditDeskCompany } from "./companies";
import { getCreditDeskSections, type SectionId } from "./credit-desk-sections";
import HeliosIndustryPanel from "./HeliosIndustryPanel";
import HeliosBusinessModelPanel from "./HeliosBusinessModelPanel";
import HeliosCompanyDetailedFiguresPanel from "./HeliosCompanyDetailedFiguresPanel";
import { HeliosBusinessAssetManagementPanel, HeliosSalesProfitabilityPanel } from "./HeliosBusinessAssetSalesPanels";
import {
  HELIOS_BUSINESS_SUBSECTIONS,
  type HeliosBusinessSubId,
  parseBusinessSubParam,
} from "./business-subnav";
import {
  HELIOS_INDUSTRY_SUBSECTIONS,
  type HeliosIndustrySubId,
  parseIndustrySubParam,
} from "./industry-subnav";
import {
  HELIOS_FINANCIAL_SUBSECTIONS,
  type HeliosFinancialSubId,
  parseFinancialSubParam,
} from "./financial-subnav";

// ── Layer nav (visual only) ─────────────────────────────────────────────────

const LAYER_ITEMS = [
  { id: "compare", label: "Compare", Icon: GitCompare },
  { id: "sensitivity", label: "Sensitivity", Icon: SlidersHorizontal },
  { id: "source", label: "Source", Icon: FileSearch },
];

const COMPARISON_PILLS = ["Peers", "Prior 3yr", "Downside"];

const CHART_YEARS = ["FY21", "FY22", "FY23", "FY24", "FY25"];

// ── Sub-components ────────────────────────────────────────────────────────────

function SourceThumbnail() {
  return (
    <div
      style={{
        background: "var(--cd-bg)",
        borderRadius: 4,
        overflow: "hidden",
        padding: "8px 10px",
        border: "0.5px solid var(--cd-border)",
      }}
    >
      <svg
        viewBox="0 0 160 86"
        className="w-full"
        aria-hidden
        style={{ color: "var(--cd-text-2)", display: "block" }}
      >
        <rect x="8" y="4" width="144" height="6" rx="1.5" fill="currentColor" opacity="0.2" />
        {[15, 24, 33, 42, 51, 60, 69, 78].map((y, i) => (
          <rect
            key={y}
            x="8"
            y={y}
            width={i % 3 === 0 ? 120 : i % 3 === 1 ? 98 : 134}
            height="4"
            rx="1"
            fill="currentColor"
            opacity="0.10"
          />
        ))}
        <rect
          x="6"
          y="39"
          width="110"
          height="14"
          rx="2"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeDasharray="3 2"
          fill="rgba(239,68,68,0.06)"
        />
      </svg>
      <p style={{ fontSize: 10, color: "var(--cd-text-3)", marginTop: 5, lineHeight: 1.3 }}>
        Revenue · conf 98%
      </p>
    </div>
  );
}

function SensitivityTrack({ label, value, pos }: { label: string; value: string; pos: number }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: "var(--cd-text-2)" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--cd-text)", fontVariantNumeric: "tabular-nums" }}>
          {value}
        </span>
      </div>
      <div style={{ position: "relative", height: 14, display: "flex", alignItems: "center" }}>
        <div style={{ width: "100%", height: 4, borderRadius: 2, background: "var(--cd-border)" }}>
          <div
            style={{ width: `${pos}%`, height: "100%", borderRadius: 2, background: "var(--cd-accent)", opacity: 0.3 }}
            aria-hidden
          />
        </div>
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: `calc(${pos}% - 6px)`,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "var(--cd-accent)",
            border: "2px solid var(--cd-surface)",
            boxShadow: "0 0 0 1.5px var(--cd-accent)",
          }}
        />
      </div>
    </div>
  );
}

function EbitdaChart({ chart }: { chart: CreditDeskCompany["chart"] }) {
  const CHART_PTS = chart.pts;
  const pts = CHART_PTS.map(([x, y]) => `${x},${y}`).join(" ");
  const area =
    `M${CHART_PTS[0][0]},${CHART_PTS[0][1]} ` +
    CHART_PTS.slice(1).map(([x, y]) => `L${x},${y}`).join(" ") +
    ` L${CHART_PTS[CHART_PTS.length - 1][0]},68 L${CHART_PTS[0][0]},68 Z`;

  return (
    <div
      style={{
        background: "var(--cd-surface-2)",
        borderRadius: 5,
        padding: "10px 12px 8px",
        marginTop: 14,
        border: "0.5px solid var(--cd-border)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "baseline" }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cd-text-3)" }}>
          EBITDA margin · 5yr
        </p>
        <span style={{ fontSize: 10, color: "var(--cd-text-3)" }}>
          FY21 → FY25
        </span>
      </div>
      <svg viewBox="0 0 380 72" className="w-full" role="img" aria-label="EBITDA margin five-year trend" style={{ display: "block" }}>
        {[12, 36, 60].map((y) => (
          <line key={y} x1="28" y1={y} x2="376" y2={y} style={{ stroke: "var(--cd-border)" }} strokeWidth="0.6" />
        ))}
        {[{ y: 15, label: "19%" }, { y: 39, label: "17%" }, { y: 63, label: "15%" }].map(({ y, label }) => (
          <text key={label} x="0" y={y} fontSize="8" style={{ fill: "var(--cd-text-3)" }}>{label}</text>
        ))}
        {CHART_YEARS.map((yr, i) => (
          <text key={yr} x={CHART_PTS[i][0]} y="72" fontSize="8" textAnchor="middle" style={{ fill: "var(--cd-text-3)" }}>{yr}</text>
        ))}
        <path d={area} style={{ fill: "var(--cd-accent)" }} fillOpacity="0.07" />
        <polyline points={pts} fill="none" style={{ stroke: "var(--cd-accent)" }} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        {CHART_PTS.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5" style={{ fill: "var(--cd-accent)" }} />
        ))}
        {/* Label the last data point */}
        <text x={CHART_PTS[4][0] + 6} y={CHART_PTS[4][1] + 3} fontSize="8.5" fontWeight="600" style={{ fill: "var(--cd-accent)" }}>
          {chart.lastLabel}
        </text>
      </svg>
    </div>
  );
}

function RailPanels({
  sensitivityRows,
}: {
  sensitivityRows: CreditDeskCompany["sensitivityRows"];
}) {
  return (
    <>
      {/* Source · pinned */}
      <div style={{ borderBottom: "0.5px solid var(--cd-border)", padding: "12px 14px 14px" }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cd-text-3)", marginBottom: 8 }}>
          Source · pinned
        </p>
        <SourceThumbnail />
      </div>

      {/* Sensitivity */}
      <div style={{ borderBottom: "0.5px solid var(--cd-border)", padding: "12px 14px 14px" }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cd-text-3)", marginBottom: 10 }}>
          Sensitivity
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sensitivityRows.map((row) => (
            <SensitivityTrack key={row.label} {...row} />
          ))}
        </div>
      </div>

      {/* Verdict */}
      <div style={{ padding: "12px 14px 14px" }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cd-text-3)", marginBottom: 8 }}>
          Verdict
        </p>
        <div style={{ background: "var(--cd-verdict-bg)", borderRadius: 4, padding: "10px 12px 11px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--cd-verdict-text)" }}>BCA</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--cd-verdict-text)" }}>ba2</span>
          </div>
          <div style={{ marginTop: 6, borderTop: "0.5px solid rgba(22,101,52,0.2)", paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "var(--cd-verdict-text)", opacity: 0.8 }}>Covenant</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: "var(--cd-verdict-text)" }}>OK · 0.7x headroom</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CreditDeskClient({ companyId }: { companyId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const company = resolveCreditDeskCompany(companyId)!;
  const sections = useMemo(() => getCreditDeskSections(companyId), [companyId]);

  const [activeId, setActiveId] = useState<SectionId>("financial");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bizSub, setBizSub] = useState<HeliosBusinessSubId>("model");
  const [indSub, setIndSub] = useState<HeliosIndustrySubId>("overview");
  const [finSub, setFinSub] = useState<HeliosFinancialSubId>("profile");
  const mainScrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setActiveId("financial");
  }, [companyId]);

  const activeSection = sections.find((s) => s.id === activeId)!;
  const showHeliosIndustryDigest = company.slug === "helios-towers" && activeId === "industry";
  const showHeliosCompany = company.slug === "helios-towers" && activeId === "company";
  const showHeliosBusinessModel = company.slug === "helios-towers" && activeId === "business";
  const showHeliosFinancial = company.slug === "helios-towers" && activeId === "financial";

  const heliosBizDigestBullets = useMemo(() => {
    if (company.slug !== "helios-towers") return [] as string[];
    const all = getCreditDeskSections("helios-towers");
    const exec = all.find((s) => s.id === "exec");
    const biz = all.find((s) => s.id === "business");
    const out: string[] = [];
    if (exec?.lede) out.push(exec.lede);
    const b0 = exec?.body[0];
    if (typeof b0 === "string") out.push(b0.length > 220 ? `${b0.slice(0, 217)}…` : b0);
    if (biz?.lede) out.push(biz.lede);
    return out.slice(0, 4);
  }, [company.slug]);

  const heliosIndustryDigestBullets = useMemo(() => {
    if (company.slug !== "helios-towers") return [] as string[];
    const ind = getCreditDeskSections("helios-towers").find((s) => s.id === "industry");
    if (!ind) return [];
    const out: string[] = [];
    if (ind.lede) out.push(ind.lede);
    const b0 = ind.body[0];
    if (typeof b0 === "string") out.push(b0.length > 220 ? `${b0.slice(0, 217)}…` : b0);
    const b1 = ind.body[1];
    if (typeof b1 === "string") out.push(b1.length > 200 ? `${b1.slice(0, 197)}…` : b1);
    return out.slice(0, 4);
  }, [company.slug]);

  const scrollToBizSub = useCallback(
    (id: HeliosBusinessSubId) => {
      const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(`cd-biz-${id}`)?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      setBizSub(id);
      const q = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      q.set("bs", id);
      router.replace(`${pathname}?${q.toString()}`, { scroll: false });
    },
    [pathname, router]
  );

  const scrollToIndSub = useCallback(
    (id: HeliosIndustrySubId) => {
      const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(`cd-ind-${id}`)?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      setIndSub(id);
      const q = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      q.set("ins", id);
      router.replace(`${pathname}?${q.toString()}`, { scroll: false });
    },
    [pathname, router]
  );

  const scrollToFinSub = useCallback(
    (id: HeliosFinancialSubId) => {
      const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(`cd-fin-${id}`)?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      setFinSub(id);
      const q = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      q.set("fin", id);
      router.replace(`${pathname}?${q.toString()}`, { scroll: false });
    },
    [pathname, router]
  );

  useEffect(() => {
    const main = mainScrollRef.current;
    if (!main) return;
    if (showHeliosBusinessModel) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const valid = parseBusinessSubParam(new URLSearchParams(window.location.search).get("bs"));
      setBizSub(valid);
      requestAnimationFrame(() => {
        document.getElementById(`cd-biz-${valid}`)?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      });
      return;
    }
    if (showHeliosIndustryDigest) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const valid = parseIndustrySubParam(new URLSearchParams(window.location.search).get("ins"));
      setIndSub(valid);
      requestAnimationFrame(() => {
        document.getElementById(`cd-ind-${valid}`)?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      });
      return;
    }
    if (showHeliosFinancial) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = new URLSearchParams(window.location.search);
      let valid = parseFinancialSubParam(q.get("fin"));
      if (q.get("bs") === "asset" && !q.get("fin")) valid = "asset";
      setFinSub(valid);
      requestAnimationFrame(() => {
        document.getElementById(`cd-fin-${valid}`)?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      });
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    main.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [activeId, showHeliosBusinessModel, showHeliosIndustryDigest, showHeliosFinancial]);

  useEffect(() => {
    if (!showHeliosBusinessModel) return;
    const main = mainScrollRef.current;
    if (!main) return;
    const ids: HeliosBusinessSubId[] = ["model", "sales"];
    let raf = 0;
    const tick = () => {
      const focusLine = main.getBoundingClientRect().top + 80;
      let current: HeliosBusinessSubId = "model";
      for (const id of ids) {
        const el = document.getElementById(`cd-biz-${id}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= focusLine + 28) current = id;
      }
      setBizSub((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    main.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => {
      main.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [showHeliosBusinessModel]);

  useEffect(() => {
    if (!showHeliosIndustryDigest) return;
    const main = mainScrollRef.current;
    if (!main) return;
    const ids: HeliosIndustrySubId[] = ["overview", "digest", "matrix1"];
    let raf = 0;
    const tick = () => {
      const focusLine = main.getBoundingClientRect().top + 80;
      let current: HeliosIndustrySubId = "overview";
      for (const id of ids) {
        const el = document.getElementById(`cd-ind-${id}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= focusLine + 28) current = id;
      }
      setIndSub((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    main.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => {
      main.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [showHeliosIndustryDigest]);

  useEffect(() => {
    if (!showHeliosFinancial) return;
    const main = mainScrollRef.current;
    if (!main) return;
    const ids: HeliosFinancialSubId[] = ["profile", "asset"];
    let raf = 0;
    const tick = () => {
      const focusLine = main.getBoundingClientRect().top + 80;
      let current: HeliosFinancialSubId = "profile";
      for (const id of ids) {
        const el = document.getElementById(`cd-fin-${id}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= focusLine + 28) current = id;
      }
      setFinSub((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    main.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => {
      main.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [showHeliosFinancial]);

  useEffect(() => {
    if (!showHeliosBusinessModel) return;
    const t = window.setTimeout(() => {
      const q = new URLSearchParams(window.location.search);
      if (q.get("bs") === bizSub) return;
      q.set("bs", bizSub);
      router.replace(`${pathname}?${q.toString()}`, { scroll: false });
    }, 280);
    return () => clearTimeout(t);
  }, [bizSub, showHeliosBusinessModel, pathname, router]);

  useEffect(() => {
    if (!showHeliosFinancial) return;
    const t = window.setTimeout(() => {
      const q = new URLSearchParams(window.location.search);
      if (q.get("fin") === finSub) return;
      q.set("fin", finSub);
      router.replace(`${pathname}?${q.toString()}`, { scroll: false });
    }, 280);
    return () => clearTimeout(t);
  }, [finSub, showHeliosFinancial, pathname, router]);

  useEffect(() => {
    if (!showHeliosIndustryDigest) return;
    const t = window.setTimeout(() => {
      const q = new URLSearchParams(window.location.search);
      if (q.get("ins") === indSub) return;
      q.set("ins", indSub);
      router.replace(`${pathname}?${q.toString()}`, { scroll: false });
    }, 280);
    return () => clearTimeout(t);
  }, [indSub, showHeliosIndustryDigest, pathname, router]);

  useEffect(() => {
    const keys = sections.map((s) => s.id);
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        t &&
        (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      if (typing) {
        if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          document.getElementById("credit-desk-entity-search")?.focus();
        }
        return;
      }
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        document.getElementById("credit-desk-entity-search")?.focus();
        return;
      }
      if (e.altKey && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        e.preventDefault();
        const idx = keys.indexOf(activeId);
        if (idx < 0) return;
        const next = e.key === "ArrowDown" ? Math.min(keys.length - 1, idx + 1) : Math.max(0, idx - 1);
        if (next !== idx) setActiveId(keys[next]!);
        return;
      }
      if (!e.ctrlKey && !e.metaKey && !e.altKey && (e.key === "p" || e.key === "P")) {
        if (!window.matchMedia("(min-width: 1100px)").matches) {
          e.preventDefault();
          setDrawerOpen((o) => !o);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, sections]);

  return (
    <div
      className="cd-root flex h-full min-h-0 flex-col overflow-hidden"
      style={{ background: "var(--cd-bg)", color: "var(--cd-text)" }}
    >
      {/* ── App chrome — fixed in viewport; body scrolls inside panes only ── */}
      <header
        style={{
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          minHeight: 52,
          padding: "8px 18px 10px",
          background: "var(--cd-surface)",
          borderBottom: "0.5px solid var(--cd-border)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
          <Link
            href="/credit-workbench"
            style={{ flexShrink: 0, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cd-text-3)", textDecoration: "none" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--cd-text-2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--cd-text-3)"; }}
          >
            ← Desk
          </Link>
          <div style={{ width: 1, alignSelf: "stretch", minHeight: 28, flexShrink: 0, background: "var(--cd-border)" }} aria-hidden />
          <CompanyEntitySelector currentSlug={company.slug} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span style={{ background: "var(--cd-chip-good-bg)", color: "var(--cd-chip-good-text)", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 3 }}>
            BCA ba2
          </span>
          <span style={{ background: "var(--cd-surface-2)", color: "var(--cd-text-2)", fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 3 }}>
            Stable
          </span>
          <button
            type="button"
            style={{ marginLeft: 2, padding: "3px 10px", fontSize: 11, fontWeight: 500, background: "transparent", color: "var(--cd-text-2)", border: "0.5px solid var(--cd-border)", borderRadius: 3, cursor: "default", letterSpacing: "0.02em" }}
          >
            Share
          </button>
        </div>
      </header>

      {/* ── Three-pane body: nav + rail stay fixed; center (and rail) scroll independently ── */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* LEFT NAV */}
        <nav
          aria-label="Credit desk sections"
          className="w-10 shrink-0 overflow-y-auto overscroll-y-contain min-[1100px]:w-[120px]"
          style={{
            background: "var(--cd-surface-2)",
            borderRight: "0.5px solid var(--cd-border)",
            flexShrink: 0,
            alignSelf: "stretch",
            minHeight: 0,
          }}
        >
          <p
            className="hidden min-[1100px]:block"
            style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cd-text-3)", padding: "11px 12px 4px" }}
          >
            Report
          </p>

          <ul className="m-0 list-none p-0 py-1" role="list">
            {sections.map((s) => {
              const isActive = s.id === activeId;
              const showBizSub =
                s.id === "business" && company.slug === "helios-towers" && activeId === "business";
              const showIndSub =
                s.id === "industry" && company.slug === "helios-towers" && activeId === "industry";
              const showFinSub =
                s.id === "financial" && company.slug === "helios-towers" && activeId === "financial";
              return (
                <li key={s.id} role="listitem">
                  <button
                    type="button"
                    onClick={() => setActiveId(s.id)}
                    aria-current={isActive ? "page" : undefined}
                    style={{
                      display: "flex",
                      width: "100%",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      textAlign: "left",
                      fontSize: 12,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "var(--cd-text)" : "var(--cd-text-2)",
                      background: isActive ? "var(--cd-active-bg)" : "transparent",
                      borderTop: "none",
                      borderRight: "none",
                      borderBottom: "none",
                      borderLeft: isActive ? "2px solid var(--cd-accent)" : "2px solid transparent",
                      cursor: "pointer",
                      transition: "background 0.12s, color 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }}
                  >
                    <s.Icon size={14} strokeWidth={isActive ? 2 : 1.6} style={{ flexShrink: 0 }} />
                    <span className="hidden min-[1100px]:inline">{s.label}</span>
                    <span className="sr-only min-[1100px]:hidden">{s.label}</span>
                  </button>
                  {showBizSub ? (
                    <ul className="m-0 list-none p-0 pb-1 pl-2 min-[1100px]:pl-3" role="list" aria-label="Business Risk subsections">
                      {HELIOS_BUSINESS_SUBSECTIONS.map((sub) => {
                        const subOn = bizSub === sub.id;
                        return (
                          <li key={sub.id} role="listitem">
                            <button
                              type="button"
                              onClick={() => scrollToBizSub(sub.id)}
                              aria-current={subOn ? true : undefined}
                              style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                padding: "4px 8px 4px 10px",
                                textAlign: "left",
                                fontSize: 10,
                                fontWeight: subOn ? 600 : 400,
                                color: subOn ? "var(--cd-accent)" : "var(--cd-text-3)",
                                background: "transparent",
                                border: "none",
                                borderLeft: subOn ? "2px solid var(--cd-accent)" : "2px solid transparent",
                                cursor: "pointer",
                                borderRadius: 0,
                              }}
                            >
                              <span className="hidden min-[1100px]:inline">{sub.navLabel}</span>
                              <span className="sr-only min-[1100px]:hidden">{sub.navLabel}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                  {showIndSub ? (
                    <ul className="m-0 list-none p-0 pb-1 pl-2 min-[1100px]:pl-3" role="list" aria-label="Industry subsections">
                      {HELIOS_INDUSTRY_SUBSECTIONS.map((sub) => {
                        const subOn = indSub === sub.id;
                        return (
                          <li key={sub.id} role="listitem">
                            <button
                              type="button"
                              onClick={() => scrollToIndSub(sub.id)}
                              aria-current={subOn ? true : undefined}
                              style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                padding: "4px 8px 4px 10px",
                                textAlign: "left",
                                fontSize: 10,
                                fontWeight: subOn ? 600 : 400,
                                color: subOn ? "var(--cd-accent)" : "var(--cd-text-3)",
                                background: "transparent",
                                border: "none",
                                borderLeft: subOn ? "2px solid var(--cd-accent)" : "2px solid transparent",
                                cursor: "pointer",
                                borderRadius: 0,
                              }}
                            >
                              <span className="hidden min-[1100px]:inline">{sub.navLabel}</span>
                              <span className="sr-only min-[1100px]:hidden">{sub.navLabel}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                  {showFinSub ? (
                    <ul className="m-0 list-none p-0 pb-1 pl-2 min-[1100px]:pl-3" role="list" aria-label="Financial subsections">
                      {HELIOS_FINANCIAL_SUBSECTIONS.map((sub) => {
                        const subOn = finSub === sub.id;
                        return (
                          <li key={sub.id} role="listitem">
                            <button
                              type="button"
                              onClick={() => scrollToFinSub(sub.id)}
                              aria-current={subOn ? true : undefined}
                              style={{
                                display: "flex",
                                width: "100%",
                                alignItems: "center",
                                padding: "4px 8px 4px 10px",
                                textAlign: "left",
                                fontSize: 10,
                                fontWeight: subOn ? 600 : 400,
                                color: subOn ? "var(--cd-accent)" : "var(--cd-text-3)",
                                background: "transparent",
                                border: "none",
                                borderLeft: subOn ? "2px solid var(--cd-accent)" : "2px solid transparent",
                                cursor: "pointer",
                                borderRadius: 0,
                              }}
                            >
                              <span className="hidden min-[1100px]:inline">{sub.navLabel}</span>
                              <span className="sr-only min-[1100px]:hidden">{sub.navLabel}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>

          <div style={{ borderTop: "0.5px solid var(--cd-border)", paddingTop: 6, marginTop: 4 }}>
            <p
              className="hidden min-[1100px]:block"
              style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cd-text-3)", padding: "0 12px 4px" }}
            >
              Layers
            </p>
            <ul className="m-0 list-none p-0 pb-2" role="list">
              {LAYER_ITEMS.map((item) => (
                <li key={item.id} role="listitem">
                  <div
                    aria-disabled="true"
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", fontSize: 11, color: "var(--cd-text-3)", opacity: 0.45, cursor: "default", borderLeft: "2px solid transparent" }}
                  >
                    <item.Icon size={12} strokeWidth={1.5} style={{ flexShrink: 0 }} />
                    <span className="hidden min-[1100px]:inline">{item.label}</span>
                    <span className="sr-only min-[1100px]:hidden">{item.label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* CENTER PANE — primary scroll surface */}
        <main
          ref={mainScrollRef}
          className="cd-main-pane min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain"
          aria-label="Section content"
          style={{ padding: "20px 26px 32px", background: "var(--cd-surface)" }}
        >
          <div style={{ maxWidth: showHeliosIndustryDigest || showHeliosBusinessModel || showHeliosCompany || showHeliosFinancial ? 820 : 600 }}>
            {showHeliosIndustryDigest ? (
              <>
                <nav
                  aria-label="Current industry subsection"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 6,
                    margin: "0 0 14px",
                    padding: "8px 0 10px",
                    background: "var(--cd-surface)",
                    borderBottom: "0.5px solid var(--cd-border)",
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cd-text-3)" }}>
                    Industry
                  </span>
                  <span style={{ margin: "0 8px", color: "var(--cd-border)", fontSize: 12 }} aria-hidden>
                    ·
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--cd-text)" }}>
                    {HELIOS_INDUSTRY_SUBSECTIONS.find((x) => x.id === indSub)?.label ?? "Overview"}
                  </span>
                </nav>

                {heliosIndustryDigestBullets.length > 0 ? (
                  <details
                    style={{
                      marginBottom: 16,
                      padding: "10px 14px 12px",
                      borderRadius: 6,
                      border: "0.5px solid var(--cd-border)",
                      background: "var(--cd-surface-2)",
                    }}
                  >
                    <summary
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--cd-text-2)",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      At a glance
                    </summary>
                    <ul style={{ margin: "12px 0 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                      {heliosIndustryDigestBullets.map((line, i) => (
                        <li key={i} style={{ fontSize: 12, lineHeight: 1.5, color: "var(--cd-text-2)" }}>
                          {line}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}

                <HeliosIndustryPanel />
                <div style={{ display: "flex", gap: 6, marginTop: 22, flexWrap: "wrap" }}>
                  {COMPARISON_PILLS.map((label) => (
                    <span
                      key={label}
                      style={{
                        padding: "3px 11px",
                        fontSize: 11,
                        fontWeight: 500,
                        color: "var(--cd-text-3)",
                        border: "0.5px solid var(--cd-border)",
                        borderRadius: 20,
                        cursor: "default",
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <EbitdaChart chart={company.chart} />
                <p className="sr-only" aria-live="polite">
                  Industry deep link ?ins=overview|digest|matrix1 — same shortcuts as Business Risk: / search · Alt+↑↓ section · P panels
                </p>
              </>
            ) : showHeliosCompany ? (
              <>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cd-text-3)", marginBottom: 4 }}>
                  {activeSection.label}
                </p>
                <h1 style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.3, color: "var(--cd-text)", marginBottom: 5, letterSpacing: "-0.008em" }}>
                  {activeSection.title}
                </h1>
                <p style={{ fontSize: 12, lineHeight: 1.5, color: "var(--cd-text-2)", marginBottom: 14, borderBottom: "0.5px solid var(--cd-border)", paddingBottom: 12 }}>
                  {activeSection.lede}
                </p>
                <HeliosCompanyDetailedFiguresPanel />
                <div style={{ display: "flex", gap: 6, marginTop: 18, flexWrap: "wrap" }}>
                  {COMPARISON_PILLS.map((label) => (
                    <span
                      key={label}
                      style={{ padding: "3px 11px", fontSize: 11, fontWeight: 500, color: "var(--cd-text-3)", border: "0.5px solid var(--cd-border)", borderRadius: 20, cursor: "default" }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <EbitdaChart chart={company.chart} />
              </>
            ) : showHeliosFinancial ? (
              <>
                <nav
                  aria-label="Current Financial subsection"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 6,
                    margin: "0 0 14px",
                    padding: "8px 0 10px",
                    background: "var(--cd-surface)",
                    borderBottom: "0.5px solid var(--cd-border)",
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cd-text-3)" }}>
                    Financial
                  </span>
                  <span style={{ margin: "0 8px", color: "var(--cd-border)", fontSize: 12 }} aria-hidden>
                    ·
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--cd-text)" }}>
                    {HELIOS_FINANCIAL_SUBSECTIONS.find((x) => x.id === finSub)?.label ?? "Financial profile"}
                  </span>
                </nav>
                <section id="cd-fin-profile" aria-labelledby="cd-fin-h-profile" style={{ scrollMarginTop: 8 }}>
                  <h2 id="cd-fin-h-profile" className="sr-only">
                    Financial profile
                  </h2>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cd-text-3)", marginBottom: 4 }}>
                    {activeSection.label}
                  </p>
                  <h1 style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.3, color: "var(--cd-text)", marginBottom: 5, letterSpacing: "-0.008em" }}>
                    {activeSection.title}
                  </h1>
                  <p style={{ fontSize: 12, lineHeight: 1.5, color: "var(--cd-text-2)", marginBottom: 14, borderBottom: "0.5px solid var(--cd-border)", paddingBottom: 12 }}>
                    {activeSection.lede}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {activeSection.body.map((para, i) => (
                      <p key={i} style={{ fontSize: 13, lineHeight: 1.62, color: "var(--cd-text-2)", margin: 0 }}>
                        {para}
                      </p>
                    ))}
                  </div>
                </section>
                <section id="cd-fin-asset" aria-labelledby="cd-fin-h-asset" style={{ scrollMarginTop: 8 }}>
                  <h2
                    id="cd-fin-h-asset"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--cd-text-3)",
                      margin: "28px 0 10px",
                    }}
                  >
                    Asset Management
                  </h2>
                  <HeliosBusinessAssetManagementPanel />
                </section>
                <div style={{ display: "flex", gap: 6, marginTop: 18, flexWrap: "wrap" }}>
                  {COMPARISON_PILLS.map((label) => (
                    <span
                      key={label}
                      style={{ padding: "3px 11px", fontSize: 11, fontWeight: 500, color: "var(--cd-text-3)", border: "0.5px solid var(--cd-border)", borderRadius: 20, cursor: "default" }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <EbitdaChart chart={company.chart} />
                <p className="sr-only" aria-live="polite">
                  Financial deep link ?fin=profile|asset
                </p>
              </>
            ) : (
              <>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cd-text-3)", marginBottom: 4 }}>
                  {activeSection.label}
                </p>
                <h1 style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.3, color: "var(--cd-text)", marginBottom: 5, letterSpacing: "-0.008em" }}>
                  {activeSection.title}
                </h1>
                <p style={{ fontSize: 12, lineHeight: 1.5, color: "var(--cd-text-2)", marginBottom: 14, borderBottom: "0.5px solid var(--cd-border)", paddingBottom: 12 }}>
                  {activeSection.lede}
                </p>
                {showHeliosBusinessModel ? (
                  <>
                    <nav
                      aria-label="Current Business Risk subsection"
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 6,
                        margin: "0 0 14px",
                        padding: "8px 0 10px",
                        background: "var(--cd-surface)",
                        borderBottom: "0.5px solid var(--cd-border)",
                      }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cd-text-3)" }}>
                        Business Risk
                      </span>
                      <span style={{ margin: "0 8px", color: "var(--cd-border)", fontSize: 12 }} aria-hidden>
                        ·
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--cd-text)" }}>
                        {HELIOS_BUSINESS_SUBSECTIONS.find((x) => x.id === bizSub)?.label ?? "Business Model"}
                      </span>
                    </nav>

                    {heliosBizDigestBullets.length > 0 ? (
                      <details
                        style={{
                          marginBottom: 16,
                          padding: "10px 14px 12px",
                          borderRadius: 6,
                          border: "0.5px solid var(--cd-border)",
                          background: "var(--cd-surface-2)",
                        }}
                      >
                        <summary
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "var(--cd-text-2)",
                            cursor: "pointer",
                            userSelect: "none",
                          }}
                        >
                          At a glance
                        </summary>
                        <ul style={{ margin: "12px 0 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                          {heliosBizDigestBullets.map((line, i) => (
                            <li key={i} style={{ fontSize: 12, lineHeight: 1.5, color: "var(--cd-text-2)" }}>
                              {line}
                            </li>
                          ))}
                        </ul>
                      </details>
                    ) : null}

                    <section id="cd-biz-model" aria-labelledby="cd-biz-h-model" style={{ scrollMarginTop: 8 }}>
                      <h2
                        id="cd-biz-h-model"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--cd-text-3)",
                          margin: "0 0 10px",
                        }}
                      >
                        Business Model
                      </h2>
                      <HeliosBusinessModelPanel />
                    </section>
                    <section id="cd-biz-sales" aria-labelledby="cd-biz-h-sales" style={{ scrollMarginTop: 8 }}>
                      <h2
                        id="cd-biz-h-sales"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--cd-text-3)",
                          margin: "28px 0 10px",
                        }}
                      >
                        Sales & Profitability
                      </h2>
                      <HeliosSalesProfitabilityPanel />
                    </section>
                    <p className="sr-only" aria-live="polite">
                      Keyboard: / search company · Alt+↑↓ change report section · P toggle panels on small screens · Business Risk ?bs=model|sales · Financial ?fin=profile|asset · Industry ?ins=overview|digest|matrix1
                    </p>
                  </>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {activeSection.body.map((para, i) => (
                      <p key={i} style={{ fontSize: 13, lineHeight: 1.62, color: "var(--cd-text-2)", margin: 0 }}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: 6, marginTop: 18, flexWrap: "wrap" }}>
                  {COMPARISON_PILLS.map((label) => (
                    <span
                      key={label}
                      style={{ padding: "3px 11px", fontSize: 11, fontWeight: 500, color: "var(--cd-text-3)", border: "0.5px solid var(--cd-border)", borderRadius: 20, cursor: "default" }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <EbitdaChart chart={company.chart} />
              </>
            )}
          </div>
        </main>

        {/* RIGHT RAIL — desktop only; independent scroll if content is long */}
        <aside
          className="hidden min-h-0 min-[1100px]:block min-[1100px]:overflow-y-auto min-[1100px]:overscroll-y-contain"
          aria-label="Analysis panels"
          style={{ width: 200, flexShrink: 0, background: "var(--cd-surface-2)", borderLeft: "0.5px solid var(--cd-border)" }}
        >
          <RailPanels sensitivityRows={company.sensitivityRows} />
        </aside>
      </div>

      {/* ── Floating panels button (≤1100px) ─────────────────────────── */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-expanded={drawerOpen}
        aria-controls="credit-desk-drawer"
        title="Analysis panels (keyboard: P)"
        className="flex min-[1100px]:hidden"
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 50, alignItems: "center", gap: 6, padding: "7px 14px", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--cd-surface)", color: "var(--cd-text-2)", border: "0.5px solid var(--cd-border)", borderRadius: 4, boxShadow: "0 4px 14px rgba(0,0,0,0.12)", cursor: "pointer" }}
      >
        Panels <span aria-hidden>↑</span>
      </button>

      {/* ── Bottom drawer (≤1100px) ───────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div
            aria-hidden
            className="fixed inset-0 z-50 min-[1100px]:hidden"
            style={{ background: "rgba(0,0,0,0.2)" }}
            onClick={() => setDrawerOpen(false)}
          />
          <div
            id="credit-desk-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Analysis panels"
            className="fixed inset-x-0 bottom-0 z-50 overflow-y-auto min-[1100px]:hidden"
            style={{ maxHeight: "60vh", background: "var(--cd-surface-2)", borderTop: "0.5px solid var(--cd-border)", borderRadius: "8px 8px 0 0", boxShadow: "0 -8px 28px rgba(0,0,0,0.16)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 16px 8px", borderBottom: "0.5px solid var(--cd-border)", position: "relative" }}>
              <div aria-hidden style={{ width: 32, height: 4, borderRadius: 2, background: "var(--cd-border)" }} />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close analysis panels"
                style={{ position: "absolute", right: 16, fontSize: 14, background: "transparent", border: "none", cursor: "pointer", color: "var(--cd-text-3)", padding: 4 }}
              >
                ✕
              </button>
            </div>
            <RailPanels sensitivityRows={company.sensitivityRows} />
          </div>
        </>
      )}
    </div>
  );
}
