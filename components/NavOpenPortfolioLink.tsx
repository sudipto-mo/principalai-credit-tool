import OpenPortfolioNavLinkInner from "@/components/OpenPortfolioNavLinkInner";

/**
 * Dorrsum Score nav link — always visible.
 * The page itself handles the access gate (teaser for public, full tool for whitelisted users).
 */
export default function NavOpenPortfolioLink() {
  return <OpenPortfolioNavLinkInner showDevWip={process.env.NODE_ENV === "development"} />;
}

