"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import {
  filterCompaniesByQuery,
  resolveCreditDeskCompany,
  type CreditDeskCompany,
} from "./companies";

const labelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--cd-text-3)",
  marginBottom: 4,
};

const fieldShell: CSSProperties = {
  borderRadius: 4,
  border: "0.5px solid var(--cd-border)",
  background: "var(--cd-surface)",
  minHeight: 34,
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "0 10px",
};

/**
 * Capital IQ / Fitch-style entity finder: typeahead filter, keyboard navigation,
 * URL updates on selection (bookmarkable), click-outside to dismiss.
 */
export default function CompanyEntitySelector({ currentSlug }: { currentSlug: string }) {
  const router = useRouter();
  const selected = resolveCreditDeskCompany(currentSlug)!;
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  const filtered = useMemo(() => filterCompaniesByQuery(open ? query : ""), [open, query]);

  const selectCompany = useCallback(
    (c: CreditDeskCompany) => {
      setOpen(false);
      setQuery("");
      setHighlight(0);
      if (c.slug !== currentSlug) {
        router.push(`/credit-workbench/${c.slug}`);
      }
      inputRef.current?.blur();
    },
    [currentSlug, router]
  );

  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  useEffect(() => {
    setHighlight(0);
  }, [query, open]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      setQuery("");
      e.preventDefault();
      return;
    }
    if (!open) return;

    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
      inputRef.current?.blur();
      e.preventDefault();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, Math.max(0, filtered.length - 1)));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
      return;
    }
    if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      selectCompany(filtered[highlight] ?? filtered[0]);
    }
  };

  return (
    <div
      ref={wrapRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        flex: 1,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          gap: "10px 14px",
        }}
      >
      <div
        aria-hidden
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: 4,
          background: "var(--cd-accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: "#fff",
        }}
      >
        {selected.initials}
      </div>

      <div style={{ flex: "1 1 180px", minWidth: 140, position: "relative" }}>
        <label htmlFor="credit-desk-entity-search" style={labelStyle}>
          Company
        </label>
        <div style={{ ...fieldShell, position: "relative" }}>
          <Search size={14} strokeWidth={2} style={{ flexShrink: 0, color: "var(--cd-text-3)" }} aria-hidden />
          <input
            ref={inputRef}
            id="credit-desk-entity-search"
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-activedescendant={open && filtered[highlight] ? `${listId}-opt-${filtered[highlight].slug}` : undefined}
            autoComplete="off"
            spellCheck={false}
            placeholder="Search by name or ticker…"
            value={open ? query : selected.displayLine}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              setOpen(true);
              setQuery("");
            }}
            onKeyDown={onKeyDown}
            style={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--cd-text)",
              padding: "6px 0",
            }}
          />
          <ChevronDown size={14} style={{ flexShrink: 0, color: "var(--cd-text-3)", opacity: 0.7 }} aria-hidden />
        </div>

        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-label="Companies"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "calc(100% + 4px)",
              zIndex: 60,
              margin: 0,
              padding: "4px 0",
              listStyle: "none",
              maxHeight: 220,
              overflowY: "auto",
              borderRadius: 4,
              border: "0.5px solid var(--cd-border)",
              background: "var(--cd-surface)",
              boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
            }}
          >
            {filtered.length === 0 ? (
              <li style={{ padding: "10px 12px", fontSize: 12, color: "var(--cd-text-3)" }}>
                No matches
              </li>
            ) : (
              filtered.map((c, i) => (
                <li key={c.slug} role="presentation">
                  <button
                    type="button"
                    role="option"
                    id={`${listId}-opt-${c.slug}`}
                    aria-selected={i === highlight}
                    onMouseEnter={() => setHighlight(i)}
                    onMouseDown={(ev) => ev.preventDefault()}
                    onClick={() => selectCompany(c)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      fontSize: 13,
                      fontWeight: c.slug === currentSlug ? 600 : 400,
                      color: "var(--cd-text)",
                      background: i === highlight ? "var(--cd-active-bg)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      lineHeight: 1.35,
                    }}
                  >
                    {c.displayLine}
                    <span
                      style={{
                        display: "block",
                        fontSize: 11,
                        fontWeight: 400,
                        color: "var(--cd-text-3)",
                        marginTop: 2,
                      }}
                    >
                      {c.sector}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      <div style={{ flex: "1 1 160px", minWidth: 120 }}>
        <p style={labelStyle}>Sector</p>
        <div style={{ ...fieldShell, cursor: "default", color: "var(--cd-text-2)", fontSize: 13 }}>
          {selected.sector}
        </div>
      </div>
      </div>

      <p style={{ fontSize: 11, color: "var(--cd-text-2)", lineHeight: 1.25, paddingLeft: 38, margin: 0 }}>
        {selected.period} · Last spread: {selected.lastSpread}
      </p>
    </div>
  );
}
