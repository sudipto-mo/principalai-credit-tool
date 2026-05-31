import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Origination Radar",
  description:
    "Live signal scan across APAC digital infrastructure — deal triggers, competitive landscape, and positional edge for capital providers.",
  robots: { index: false, follow: false },
};

export default function OriginationPage() {
  return (
    <iframe
      title="Origination Radar"
      src="/origination-radar.html"
      className="w-full flex-1 border-0"
      style={{ minHeight: "calc(100vh - 3.25rem)" }}
    />
  );
}
