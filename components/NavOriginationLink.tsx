import OriginationNavLinkInner from "@/components/OriginationNavLinkInner";

/**
 * Origination nav link — not used on Dorrsum Advisory nav (route `/origination` may remain for direct access).
 */
export default function NavOriginationLink() {
  const enabled =
    process.env.NODE_ENV === "development" ||
    process.env.ENABLE_ORIGINATION === "1";

  if (!enabled) return null;

  return <OriginationNavLinkInner showDevWip={process.env.NODE_ENV === "development"} />;
}
