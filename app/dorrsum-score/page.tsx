import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getDorrsumScoreUrl } from "@/lib/dorrsum-score-url";
import { PORTFOLIO_MANAGEMENT_NAME } from "@/lib/site-brand";

export const metadata: Metadata = {
  title: "Dorrsum Score",
  description: `Digital infrastructure universe screener — hosted on ${PORTFOLIO_MANAGEMENT_NAME}.`,
};

/** Dev only — Dorrsum Score is not served from Dorrsum Advisory in production. */
export default function DorrsumScorePage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  redirect(getDorrsumScoreUrl());
}
