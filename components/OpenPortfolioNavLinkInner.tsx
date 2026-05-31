"use client";

import Link from "next/link";
import { marketingNavLinkStyle, marketingNavWipBadgeStyle } from "@/lib/marketing-nav-styles";

function resolveNavHref(): string {
  const score = (process.env.NEXT_PUBLIC_DORRSUM_SCORE_URL || "").trim();
  if (score) return score.replace(/\/$/, "");
  const pm = (process.env.NEXT_PUBLIC_PORTFOLIO_MANAGEMENT_URL || "").trim();
  if (pm) return `${pm.replace(/\/$/, "")}/dorrsum-score/index.html`;
  return "/dorrsum-score";
}

export default function OpenPortfolioNavLinkInner({ showDevWip }: { showDevWip: boolean }) {
  const href = resolveNavHref();
  const isExternal = href.startsWith("http");
  const style = { ...marketingNavLinkStyle, gap: 8 };
  const wip = showDevWip ? <span style={marketingNavWipBadgeStyle}>WIP</span> : null;

  if (isExternal) {
    return (
      <a
        href={href}
        style={style}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.opacity = "0.68";
        }}
      >
        Dorrsum Score
        {wip}
      </a>
    );
  }

  return (
    <Link
      href={href}
      style={style}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.opacity = "0.68";
      }}
    >
      Dorrsum Score
      {wip}
    </Link>
  );
}
