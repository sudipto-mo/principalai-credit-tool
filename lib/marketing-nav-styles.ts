import type { CSSProperties } from "react";

/** Primary row links — same as the original `HeroPreview` fixed bar. */
export const marketingNavLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  flexShrink: 0,
  boxSizing: "border-box",
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 500,
  color: "oklch(20% 0.06 258)",
  cursor: "pointer",
  opacity: 0.68,
  transition: "opacity 0.2s",
  textDecoration: "none",
  whiteSpace: "nowrap",
  padding: "0 10px",
  fontFamily: "var(--font-brand), 'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
};

export const marketingNavShellStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  height: 58,
  background: "oklch(95.5% 0.010 82 / 0.9)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  borderBottom: "1px solid rgba(20,40,80,0.07)",
  display: "flex",
  alignItems: "center",
  padding: "0 clamp(16px, 4vw, 44px)",
  fontFamily: "var(--font-brand), 'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
};

export const marketingNavInnerRowStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1440,
  margin: "0 auto",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
};

/** Square D badge — deep surface, off-white letter (visible on cream nav). */
export const marketingNavBrandMarkStyle: CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 2,
  background: "var(--color-deep)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

export const marketingNavBrandMarkLetterStyle: CSSProperties = {
  fontFamily: "var(--font-brand), ui-sans-serif, system-ui, sans-serif",
  fontSize: 18,
  fontWeight: 700,
  lineHeight: 1,
  color: "var(--color-off-white)",
};

/** “DORRSUM” with RR in brand violet — use with child span for RR. */
export const marketingNavTitleStyle: CSSProperties = {
  fontFamily: "var(--font-brand), ui-sans-serif, system-ui, sans-serif",
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: "0.04em",
  color: "var(--color-deep)",
};

export const marketingNavTaglineStyle: CSSProperties = {
  fontFamily: "var(--font-mono-brand), ui-monospace, monospace",
  fontSize: 9,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--pa-muted)",
  fontWeight: 400,
  marginTop: -2,
};

/** Dev-only WIP pill next to nav labels (`next dev`); stripped from production bundles. */
export const marketingNavWipBadgeStyle: CSSProperties = {
  flexShrink: 0,
  fontSize: 7.5,
  padding: "3px 7px",
  background: "var(--color-violet)",
  color: "#fff",
  borderRadius: 2,
  letterSpacing: "0.07em",
  fontWeight: 700,
  textTransform: "uppercase",
};
