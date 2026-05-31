import OpenPortfolioNavLinkInner from "@/components/OpenPortfolioNavLinkInner";

/**
 * Dorrsum Score nav link — not used on Dorrsum Advisory (Score lives in Portfolio Management only).
 * Kept for optional embeds; wire via SiteNavbar if needed.
 */
export default function NavOpenPortfolioLink() {
  return <OpenPortfolioNavLinkInner showDevWip={process.env.NODE_ENV === "development"} />;
}

