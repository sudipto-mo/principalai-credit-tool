import type { Metadata } from "next";
import { Suspense } from "react";
import DcInfrastructureStackClient from "@/components/DcInfrastructureStackClient";
import { type LibraryModule } from "@/components/DCInfrastructureLibrary";
import {
  DIGITAL_INFRASTRUCTURE_STACK,
  STACK_REPORT_LIST,
  stackReportMainPillarLine,
} from "@/lib/dc-stack-reports";
import { STACK_EQUITY_NOTES, stackEquityNoteToLibraryModule } from "@/lib/stack-equity-notes";

export const metadata: Metadata = {
  title: `The ${DIGITAL_INFRASTRUCTURE_STACK}`,
  description:
    "APAC digital infrastructure research — supply chain, operator landscape, and company-level credit analysis across the full stack.",
  robots: { index: true, follow: true },
};

const strategicReports: LibraryModule[] = STACK_REPORT_LIST.map((r) => ({
  id: r.id,
  title: r.title,
  subtitle: r.subtitle,
  description: r.description,
  href: r.href,
  status: "Available" as const,
  pillarLineMain: stackReportMainPillarLine(r),
  pillar: r.pillarKey,
  releaseMonth: `${r.releaseMonthShort} ${r.releaseYear}`,
  tags: r.tags,
  categories: r.pillarResearchCategories,
}));

/** Layer-tagged briefs — equity mispricing notes and company-level research. */
const assetDeepDives: LibraryModule[] = STACK_EQUITY_NOTES.map(stackEquityNoteToLibraryModule);

export default function DCInfrastructureIndexPage() {
  return (
    <div className="min-h-full w-full bg-[var(--pa-page)] text-[var(--pa-text)]">
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14 md:pt-16">
        <Suspense
          fallback={
            <div className="rounded-sm border border-[color:var(--pa-border)] bg-white px-5 py-12 text-center text-sm text-[var(--pa-muted)]">
              Loading research…
            </div>
          }
        >
          <DcInfrastructureStackClient strategicReports={strategicReports} assetDeepDives={assetDeepDives} />
        </Suspense>
      </div>
    </div>
  );
}
