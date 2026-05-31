import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CreditDeskClient from "./CreditDeskClient";
import { resolveCreditDeskCompany } from "./companies";

export function generateMetadata(): Metadata {
  return {
    title: "Interactive credit desk",
    description:
      "Read, audit, and stress-test a credit story in one place — structured indicative credit assessment with analyst review layer.",
    robots: { index: false, follow: false },
  };
}

export default async function CreditDeskPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  if (!resolveCreditDeskCompany(companyId)) {
    notFound();
  }

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] min-h-0 flex-1 flex-col overflow-hidden">
      <CreditDeskClient companyId={companyId} />
    </div>
  );
}
