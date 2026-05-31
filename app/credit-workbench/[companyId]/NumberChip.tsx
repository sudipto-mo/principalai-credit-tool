import type { CSSProperties } from "react";

export type ChipTone = "good" | "watch" | "supporting";

const BASE: CSSProperties = {
  display: "inline-block",
  padding: "0 5px 1px",
  borderRadius: 3,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.01em",
  lineHeight: 1.6,
  whiteSpace: "nowrap",
};

const TONE_STYLES: Record<ChipTone, CSSProperties> = {
  good: {
    background: "var(--cd-chip-good-bg)",
    color: "var(--cd-chip-good-text)",
    borderBottom: "1.5px dashed var(--cd-chip-good-border)",
  },
  watch: {
    background: "var(--cd-chip-watch-bg)",
    color: "var(--cd-chip-watch-text)",
    borderBottom: "1.5px dashed var(--cd-chip-watch-border)",
  },
  supporting: {
    background: "transparent",
    color: "var(--cd-chip-sup-text)",
  },
};

export default function NumberChip({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: ChipTone;
}) {
  return (
    <span style={{ ...BASE, ...TONE_STYLES[tone] }}>
      {children}
    </span>
  );
}
