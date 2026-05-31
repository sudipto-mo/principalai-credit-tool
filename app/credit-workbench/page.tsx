import type { Metadata } from "next";
import CreditWorkbenchClient from "./CreditWorkbenchClient";

export const metadata: Metadata = {
  title: "Institutional Credit Desk",
  description:
    "Structured indicative credit briefs with analyst review layer — domain-grounded workflow for institutional credit preparation.",
};

export default function CreditWorkbenchPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <CreditWorkbenchClient />
    </div>
  );
}
