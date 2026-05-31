import type { Metadata } from "next";
import MetricExplorer from "@/components/MetricExplorer";

export const metadata: Metadata = {
  title: "Metric Explorer",
  description:
    "Interactive reference for Dorrsum score metrics: formulas, interpretations, and threshold bands by factor.",
};

export default function MetricExplorerPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col bg-[var(--pa-page)]">
      <MetricExplorer />
    </main>
  );
}
