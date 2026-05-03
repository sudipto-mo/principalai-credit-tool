import OriginationNavLinkInner from "@/components/OriginationNavLinkInner";

/**
 * Origination nav link — dev/staging only.
 * Hidden in production unless ENABLE_ORIGINATION=1 is set in Vercel env vars.
 */
export default function NavOriginationLink() {
  const enabled =
    process.env.NODE_ENV === "development" ||
    process.env.ENABLE_ORIGINATION === "1";

  if (!enabled) return null;

  return <OriginationNavLinkInner showDevWip={process.env.NODE_ENV === "development"} />;
}
