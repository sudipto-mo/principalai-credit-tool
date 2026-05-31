import type { Metadata } from "next";
import Link from "next/link";
import { getResearchContent } from "@/lib/markdown";
import {
  DIGITAL_INFRASTRUCTURE_STACK,
  getStackReport,
  stackReportFullTitle,
} from "@/lib/dc-stack-reports";
import ResearchReportContents from "@/components/ResearchReportContents";
import { paEditorialTitleModule } from "@/lib/editorial-typography";
import { WORLDVIEW_TOC } from "@/lib/worldview-contents";

const report = getStackReport("worldview");
const nextReport = getStackReport("physical-stack");

export const metadata: Metadata = {
  title: `${stackReportFullTitle(report)} (APAC)`,
  description:
    "Digital Infrastructure Stack — APAC colocation and hyperscaler landscape: who is building, where, and with whose capital. Tier 1–4 operators, hyperscaler commitments, and the capital layer financing the buildout.",
  robots: { index: true, follow: true },
};

export default async function WorldviewPage() {
  const content = await getResearchContent("dc-worldview");

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

        <ResearchReportContents items={WORLDVIEW_TOC} linkable />

        <article className="prose-research mt-8" dangerouslySetInnerHTML={{ __html: content }} />
        <div className="mt-16 flex items-center justify-between border-t border-[color:var(--pa-border)] pb-20 pt-8 text-sm">
          <a
            href="/research/dc-infrastructure/physical-stack"
            className="text-[var(--pa-muted)] transition-colors no-underline hover:text-[var(--pa-text)]"
          >
            ← {stackReportFullTitle(nextReport)}
          </a>
          <Link
            href="/research/dc-infrastructure"
            className="text-[var(--pa-link)] transition-colors no-underline hover:text-[var(--pa-link-hover)]"
          >
            {DIGITAL_INFRASTRUCTURE_STACK}
          </Link>
        </div>
      </div>
    </div>
  );
}
