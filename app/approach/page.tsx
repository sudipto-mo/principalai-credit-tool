import type { Metadata } from "next";
import { ApproachPage } from "@/components/ApproachPage";

export const metadata: Metadata = {
  title: "Approach",
  description:
    "Institutional-grade credit structuring and deal screening: origination velocity, virtual deal team orchestration, and professional insight over generic AI.",
};

export default function ApproachRoute() {
  return <ApproachPage />;
}
