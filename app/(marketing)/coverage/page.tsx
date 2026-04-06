import type { Metadata } from "next";
import CoverageSectors from "@/components/CoverageSectors";

export const metadata: Metadata = {
  title: "Coverage & Research | Principal AI",
  description:
    "Institutional credit briefs, covenant stress-testing, and Telecom infrastructure deep-dives. Access is strictly gated for authenticated clients.",
};

/** Canonical sector hierarchy; same body as /products. */
export default function CoveragePage() {
  return <CoverageSectors />;
}
