import PortfolioManagementNavLinkInner from "@/components/PortfolioManagementNavLinkInner";

/**
 * Portfolio Management nav link — not used on Dorrsum Advisory nav (PM app is separate).
 * Kept for optional use; `/portfolio-management` still works for direct access.
 */
export default function NavPortfolioManagementLink() {
  const configured = Boolean((process.env.NEXT_PUBLIC_PORTFOLIO_MANAGEMENT_URL || "").trim());

  return <PortfolioManagementNavLinkInner showDevWip={!configured} />;
}
