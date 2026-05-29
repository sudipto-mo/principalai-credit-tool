import PortfolioManagementNavLinkInner from "@/components/PortfolioManagementNavLinkInner";

/**
 * Client book portal — always visible (like Dorrsum Score).
 * `/portfolio-management` redirects when NEXT_PUBLIC_PORTFOLIO_MANAGEMENT_URL is set.
 */
export default function NavPortfolioManagementLink() {
  const configured = Boolean((process.env.NEXT_PUBLIC_PORTFOLIO_MANAGEMENT_URL || "").trim());

  return <PortfolioManagementNavLinkInner showDevWip={!configured} />;
}
