import OpenPortfolioNavLinkInner from "@/components/OpenPortfolioNavLinkInner";

/**
 * Dorrsum Score nav link — dev/staging only.
 * Hidden in production unless ENABLE_OPEN_PORTFOLIO=1 is set in env vars.
 */
export default function NavOpenPortfolioLink() {
  const enabled =
    process.env.NODE_ENV === "development" ||
    process.env.ENABLE_OPEN_PORTFOLIO === "1";

  if (!enabled) return null;

  return <OpenPortfolioNavLinkInner showDevWip={process.env.NODE_ENV === "development"} />;
}

