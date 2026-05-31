import type { Metadata } from "next";
import CoverageSectors from "@/components/CoverageSectors";

export const metadata: Metadata = {
  title: "Research",
  description:
    "TMT infrastructure equity research from the physical stack up — mispricing calls, earnings analysis, and trend intelligence for institutional investors.",
};

export default function ResearchPage() {
  return <CoverageSectors />;
}
