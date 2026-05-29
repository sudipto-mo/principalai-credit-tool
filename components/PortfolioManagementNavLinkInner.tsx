"use client";

import Link from "next/link";
import { PORTFOLIO_MANAGEMENT_PATH } from "@/lib/portfolio-management-url";
import { marketingNavLinkStyle, marketingNavWipBadgeStyle } from "@/lib/marketing-nav-styles";

export default function PortfolioManagementNavLinkInner({ showDevWip }: { showDevWip: boolean }) {
  return (
    <Link
      href={PORTFOLIO_MANAGEMENT_PATH}
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
      Portfolio Management
      {showDevWip ? <span style={marketingNavWipBadgeStyle}>WIP</span> : null}
    </Link>
  );
}
