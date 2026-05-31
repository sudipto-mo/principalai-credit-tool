import type { Metadata } from "next";
import CoverageSectors from "@/components/CoverageSectors";

export const metadata: Metadata = {
  title: "Coverage & Research",
  description:
    "Institutional credit briefs, covenant stress-testing, and Telecom infrastructure deep-dives — with public stack research and ecosystem mapping.",
};

export default function ProductsPage() {
  return <CoverageSectors />;
}
