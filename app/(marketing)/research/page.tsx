import type { Metadata } from "next";
import CoverageSectors from "@/components/CoverageSectors";

export const metadata: Metadata = {
  title: "Research",
  description:
    "APAC digital infrastructure sector research — operator landscape, supply chain analysis, and full-stack coverage for Capital Providers and Infrastructure Sponsors.",
};

export default function ResearchPage() {
  return <CoverageSectors />;
}
