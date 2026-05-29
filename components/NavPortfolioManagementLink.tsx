import PortfolioManagementNavLinkInner from "@/components/PortfolioManagementNavLinkInner";
import { resolvePortfolioManagementUrl } from "@/lib/portfolio-management-url";

/**
 * Client book portal — links to `/portfolio-management`, which redirects to the hosted PM app.
 * Hidden in production when NEXT_PUBLIC_PORTFOLIO_MANAGEMENT_URL is unset.
 */
export default function NavPortfolioManagementLink() {
  const url = resolvePortfolioManagementUrl();
  if (!url) return null;

  return (
    <PortfolioManagementNavLinkInner
      showDevWip={process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_PORTFOLIO_MANAGEMENT_URL?.trim()}
    />
  );
}
