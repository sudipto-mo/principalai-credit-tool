import type { Metadata } from "next";
import Link from "next/link";
import { getResearchContent } from "@/lib/markdown";
import {
  DIGITAL_INFRASTRUCTURE_STACK,
  getStackReport,
  stackReportFullTitle,
} from "@/lib/dc-stack-reports";
import ResearchReportContents from "@/components/ResearchReportContents";
import { PHYSICAL_STACK_TOC } from "@/lib/physical-stack-contents";
import { paEditorialTitleModule } from "@/lib/editorial-typography";

const report = getStackReport("physical-stack");
const prevReport = getStackReport("worldview");

export const metadata: Metadata = {
  title: `${stackReportFullTitle(report)}`,
  description:
    "Digital Infrastructure Stack — where the bottlenecks are: an APAC supply chain map across power, silicon, cooling, land, connectivity, and construction — mapped by constraint status.",
  robots: { index: true, follow: true },
};

export default async function PhysicalStackPage() {
  const content = await getResearchContent("dc-physical-stack");

  return (
    <div className="min-h-full w-full bg-[var(--pa-page)] text-[var(--pa-text)]">
      <div className="mx-auto max-w-3xl px-5 pt-10 sm:px-8 sm:pt-14 md:pt-16">

        {/* Breadcrumb — brand is in site nav */}
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b8794]">
          <Link href="/research" className="transition-colors no-underline hover:text-[var(--pa-navy)]">
            ← Research
          </Link>
          {" · "}
          <Link href="/research/dc-infrastructure" className="transition-colors no-underline hover:text-[var(--pa-navy)]">
            {DIGITAL_INFRASTRUCTURE_STACK}
          </Link>
        </p>

        {/* Header */}
        <header className="mb-10 border-b border-[color:var(--pa-border)] pb-8">
          <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className={paEditorialTitleModule}>
              {stackReportFullTitle(report)}
            </h1>
          </div>
          <p className="mt-2 text-sm text-[#7b8794]">April 2026</p>
        </header>

        <ResearchReportContents items={PHYSICAL_STACK_TOC} linkable />

        <article className="prose-research mt-8" dangerouslySetInnerHTML={{ __html: content }} />
        <div className="mt-16 flex items-center justify-between border-t border-[color:var(--pa-border)] pb-20 pt-8 text-sm">
          <Link href="/research/dc-infrastructure" className="text-[var(--pa-muted)] transition-colors no-underline hover:text-[var(--pa-text)]">
            ← {DIGITAL_INFRASTRUCTURE_STACK}
          </Link>
          <a
            href="/research/dc-infrastructure/worldview"
            className="text-[var(--pa-link)] transition-colors no-underline hover:text-[var(--pa-link-hover)]"
          >
            {stackReportFullTitle(prevReport)}
          </a>
        </div>
      </div>
    </div>
  );
}
