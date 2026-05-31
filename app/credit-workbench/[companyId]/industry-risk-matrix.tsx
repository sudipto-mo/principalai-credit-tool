import type { CSSProperties } from "react";
import { Fragment } from "react";

export type IndustryRisk = {
  id: string;
  theme: string;
  key_risks: string[];
  cf_impact: string[];
  csf: string[];
  sources: string[];
  strength_weakness?: {
    strengths: string[];
    weaknesses: string[];
  };
};

export type IndustryPage = {
  title: string;
  subtitle: string;
  risks: IndustryRisk[];
};

const thBase: CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  borderBottom: "2px solid var(--cd-border)",
  verticalAlign: "bottom",
};

const cellBase: CSSProperties = {
  padding: "10px 10px 12px",
  fontSize: 12,
  lineHeight: 1.55,
  color: "var(--cd-text-2)",
  verticalAlign: "top",
  borderBottom: "0.5px solid var(--cd-border)",
  background: "var(--cd-surface)",
};

const listStyle: CSSProperties = {
  margin: 0,
  paddingLeft: 18,
};

function BulletList({ items, idPrefix }: { items: string[]; idPrefix: string }) {
  return (
    <ul style={listStyle}>
      {items.map((t, i) => (
        <li key={`${idPrefix}-${i}`} style={{ marginBottom: 5 }}>
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Three-column risk matrix — industry risks vs CF vs mitigants (+ optional S&W rows). */
export function IndustryRiskMatrix({ page, caption }: { page: IndustryPage; caption: string }) {
  return (
    <div
      style={{
        marginBottom: 28,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        border: "0.5px solid var(--cd-border)",
        borderRadius: 6,
        background: "var(--cd-surface-2)",
      }}
    >
      <table
        style={{
          width: "100%",
          minWidth: 560,
          borderCollapse: "collapse",
        }}
        aria-label={caption}
      >
        <caption
          style={{
            captionSide: "top",
            textAlign: "left",
            padding: "0 0 10px 2px",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--cd-text-3)",
          }}
        >
          {caption}
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              style={{
                ...thBase,
                width: "34%",
                background: "color-mix(in srgb, var(--cd-accent) 18%, var(--cd-surface-2))",
                color: "var(--cd-text)",
                position: "sticky",
                left: 0,
                zIndex: 3,
                boxShadow: "4px 0 10px -4px rgba(0,0,0,0.12)",
              }}
            >
              Key industry risks
            </th>
            <th
              scope="col"
              style={{
                ...thBase,
                width: "33%",
                background: "color-mix(in srgb, var(--cd-accent) 10%, var(--cd-surface-2))",
                color: "var(--cd-text)",
              }}
            >
              Cash flow impact
            </th>
            <th
              scope="col"
              style={{
                ...thBase,
                width: "33%",
                background: "color-mix(in srgb, var(--cd-verdict-text) 12%, var(--cd-surface-2))",
                color: "var(--cd-text)",
              }}
            >
              Critical success factors
            </th>
          </tr>
        </thead>
        <tbody>
          {page.risks.map((risk) => (
            <Fragment key={risk.id}>
              <tr>
                <th
                  scope="row"
                  style={{
                    ...cellBase,
                    textAlign: "left",
                    fontWeight: 400,
                    borderRight: "0.5px solid var(--cd-border)",
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    boxShadow: "4px 0 10px -4px rgba(0,0,0,0.08)",
                  }}
                >
                  <strong style={{ display: "block", fontSize: 12, color: "var(--cd-text)", marginBottom: 8, lineHeight: 1.35 }}>
                    {risk.theme}
                  </strong>
                  <BulletList items={risk.key_risks} idPrefix={`${risk.id}-kr`} />
                </th>
                <td style={{ ...cellBase, borderRight: "0.5px solid var(--cd-border)" }}>
                  <BulletList items={risk.cf_impact} idPrefix={`${risk.id}-cf`} />
                </td>
                <td style={cellBase}>
                  <BulletList items={risk.csf} idPrefix={`${risk.id}-csf`} />
                </td>
              </tr>
              {risk.strength_weakness ? (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      ...cellBase,
                      background: "var(--cd-bg)",
                      padding: "12px 12px 14px",
                      borderBottom: "0.5px solid var(--cd-border)",
                    }}
                  >
                    <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--cd-text-3)", margin: "0 0 8px" }}>
                      Strengths and weaknesses
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                      }}
                    >
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 600, color: "var(--cd-verdict-text)", marginBottom: 6 }}>Strengths</p>
                        <BulletList items={risk.strength_weakness.strengths} idPrefix={`${risk.id}-s`} />
                      </div>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 600, color: "var(--cd-text-3)", marginBottom: 6 }}>Weaknesses</p>
                        <BulletList items={risk.strength_weakness.weaknesses} idPrefix={`${risk.id}-w`} />
                      </div>
                    </div>
                  </td>
                </tr>
              ) : null}
              <tr>
                <td
                  colSpan={3}
                  style={{
                    fontSize: 10,
                    color: "var(--cd-text-3)",
                    padding: "6px 10px 10px",
                    background: "var(--cd-surface-2)",
                    borderBottom: "0.5px solid var(--cd-border)",
                  }}
                >
                  Sources: {risk.sources.join(" · ")}
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
