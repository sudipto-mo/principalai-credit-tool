import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getDorrsumScoreUrl } from "@/lib/dorrsum-score-url";

export const metadata: Metadata = {
  title: "Dorrsum Score",
  description: "Not available on Dorrsum Advisory in production.",
};

/** Dev only — Dorrsum Score is not served from Dorrsum Advisory in production. */
export default function DorrsumScorePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  redirect(getDorrsumScoreUrl());
}
