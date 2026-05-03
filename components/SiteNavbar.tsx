"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { HERO_BRAND } from "@/lib/hero-marketing";
import NavOpenPortfolioLink from "@/components/NavOpenPortfolioLink";
import {
  marketingNavBrandMarkLetterStyle,
  marketingNavBrandMarkStyle,
  marketingNavInnerRowStyle,
  marketingNavLinkStyle,
  marketingNavShellStyle,
  marketingNavTaglineStyle,
  marketingNavTitleStyle,
  marketingNavWipBadgeStyle,
} from "@/lib/marketing-nav-styles";

function NavMarketingLink({
  href,
  children,
  onClick,
  style,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.opacity = "0.68";
      }}
      style={{ ...marketingNavLinkStyle, ...style }}
    >
      {children}
    </Link>
  );
}

type AdvisoryItem = { href: string; label: string; devWip?: boolean };

const ADVISORY_ITEMS_BASE: AdvisoryItem[] = [
  { href: "/advisory?persona=providers", label: "Credit Assessment" },
  { href: "/advisory?persona=sponsors", label: "Capital Structuring" },
];

const isCrossBorderEnabled =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_ENABLE_CROSS_BORDER === "1";

const ADVISORY_ITEMS: AdvisoryItem[] = isCrossBorderEnabled
  ? [
      ...ADVISORY_ITEMS_BASE,
      {
        href: "/advisory?persona=cross-border",
        label: "Cross-Border Structuring",
        devWip: process.env.NODE_ENV === "development",
      },
    ]
  : ADVISORY_ITEMS_BASE;

function AdvisoryDropdown({ onNavigate }: { onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link
        href="/advisory"
        aria-haspopup="true"
        aria-expanded={open}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.opacity = "0.68";
        }}
        style={{
          ...marketingNavLinkStyle,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        Advisory
        <span style={{ fontSize: 7.5, opacity: 0.45 }} aria-hidden>
          ▾
        </span>
      </Link>

      {open && (
        <div style={{ position: "absolute", left: 0, top: "100%", zIndex: 110, paddingTop: 6 }}>
          <div
            style={{
              minWidth: 250,
              overflow: "hidden",
              borderRadius: 2,
              border: "1px solid rgba(20,40,80,0.12)",
              background: "white",
              boxShadow: "0 10px 30px rgba(31,36,48,0.08)",
            }}
          >
            {ADVISORY_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #ece8df",
                  padding: "12px 16px",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "oklch(95.5% 0.012 82)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#243b53",
                  }}
                >
                  {item.label}
                </span>
                {item.devWip ? (
                  <span style={{ ...marketingNavWipBadgeStyle, marginLeft: 12 }}>WIP</span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const mobilePanelStyle: CSSProperties = {
  position: "fixed",
  top: 58,
  left: 0,
  right: 0,
  zIndex: 99,
  borderTop: "1px solid rgba(20,40,80,0.07)",
  background: "oklch(95.5% 0.010 82 / 0.98)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  maxHeight: "min(80vh, 520px)",
  overflowY: "auto",
};

export default function SiteNavbar({ authBadge, authNavItems }: { authBadge?: React.ReactNode; authNavItems?: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <nav ref={navRef} style={marketingNavShellStyle} aria-label="Primary" className="print:hidden">
        <div style={marketingNavInnerRowStyle}>
          <Link
            href="/"
            aria-label="DORRSUM home"
            onClick={closeMobile}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.95";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              marginRight: "auto",
              textDecoration: "none",
              color: "inherit",
              flexShrink: 0,
            }}
          >
            <div style={marketingNavBrandMarkStyle} aria-hidden>
              <span style={marketingNavBrandMarkLetterStyle}>D</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }} aria-hidden>
              <span style={marketingNavTitleStyle}>
                DO
                <span style={{ color: "var(--color-violet)" }}>RR</span>
                SUM
              </span>
              <span className="hidden md:block" style={marketingNavTaglineStyle}>
                {HERO_BRAND.tagline}
              </span>
            </div>
          </Link>

          <div
            style={{
              display: "flex",
              minWidth: 0,
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-end",
              flexWrap: "nowrap",
              gap: 20,
            }}
          >
            <div
              className="hidden shrink-0 md:flex"
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 28,
                flexWrap: "nowrap",
              }}
            >
              <NavMarketingLink href="/research">Research</NavMarketingLink>
              {authNavItems}
              <AdvisoryDropdown />
              <NavOpenPortfolioLink />
              <NavMarketingLink href="/contact">Contact</NavMarketingLink>
            </div>

            <div style={{ display: "flex", flexShrink: 0, alignItems: "center", gap: 12, paddingLeft: 8 }}>
              {authBadge}
              <button
                type="button"
                style={{
                  display: "inline-flex",
                  height: 40,
                  width: 40,
                  flexShrink: 0,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  border: "1px solid transparent",
                  background: "transparent",
                  color: "oklch(20% 0.06 258)",
                  opacity: 0.68,
                  cursor: "pointer",
                }}
                className="md:hidden"
                aria-expanded={mobileOpen}
                aria-controls="site-nav-mobile"
                onClick={() => setMobileOpen((o) => !o)}
              >
                {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
                <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Reserve space for fixed bar (original Hero layout behavior) */}
      <div style={{ height: 58, flexShrink: 0 }} aria-hidden="true" />

      {mobileOpen ? (
        <div id="site-nav-mobile" style={mobilePanelStyle} className="md:hidden">
          <div style={{ maxWidth: 1440, margin: "0 auto", padding: "16px 20px 28px" }}>
            <NavMarketingLink href="/research" onClick={closeMobile} style={{ display: "block", padding: "10px 0" }}>
              Research
            </NavMarketingLink>
            <div style={{ padding: "10px 0" }}>
              <NavOpenPortfolioLink />
            </div>
            <div style={{ paddingTop: 4 }}>{authNavItems}</div>
            <p style={{ margin: "12px 0 6px", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", color: "#7b8794", textTransform: "uppercase" }}>
              Advisory
            </p>
            {ADVISORY_ITEMS.map((item) => (
              <NavMarketingLink key={item.href} href={item.href} onClick={closeMobile} style={{ display: "block", padding: "8px 0 8px 16px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {item.label}
                  {item.devWip ? <span style={marketingNavWipBadgeStyle}>WIP</span> : null}
                </span>
              </NavMarketingLink>
            ))}
            <NavMarketingLink href="/contact" onClick={closeMobile} style={{ display: "block", padding: "12px 0 0" }}>
              Contact
            </NavMarketingLink>
          </div>
        </div>
      ) : null}
    </>
  );
}
