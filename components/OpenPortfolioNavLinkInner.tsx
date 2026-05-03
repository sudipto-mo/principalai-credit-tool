"use client";

import Link from "next/link";
import { marketingNavLinkStyle, marketingNavWipBadgeStyle } from "@/lib/marketing-nav-styles";

export default function OpenPortfolioNavLinkInner({ showDevWip }: { showDevWip: boolean }) {
  return (
    <Link
      href="/dorrsum-score"
      style={{
        ...marketingNavLinkStyle,
        gap: 8,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.opacity = "0.68";
      }}
    >
      Dorrsum Score
      {showDevWip ? <span style={marketingNavWipBadgeStyle}>WIP</span> : null}
    </Link>
  );
}

