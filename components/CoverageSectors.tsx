"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AdvisoryScopeCards from "@/components/AdvisoryScopeCards";
import ResearchVault from "@/components/ResearchVault";
import { ADVISORY_TO_RESEARCH_FILTER } from "@/lib/advisory-pillars";
import { getAdvisoryHref } from "@/lib/advisory-access";
import { paEditorialLead, paEditorialTitleResearchHub } from "@/lib/editorial-typography";

export default function CoverageSectors() {
  const router = useRouter();

  return (
    <div className="w-full">
      <header className="max-w-6xl border-b border-[color:var(--pa-border)] pb-10">
        <h1 className={`m-0 ${paEditorialTitleResearchHub}`}>
          TMT &amp; Digital Infrastructure Research
        </h1>
        <p className={paEditorialLead}>
          Sector intelligence across the convergence of Connectivity, Real Assets, and Power.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/dc-network-map.html"
            className="inline-flex items-center justify-center rounded-sm border border-[var(--pa-navy)] bg-[var(--pa-navy)] px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white no-underline transition-colors hover:bg-[var(--pa-navy-deep)]"
          >
            View Ecosystem Web
          </Link>
          <Link
            href="/research/dc-infrastructure"
            className="inline-flex items-center justify-center rounded-sm border border-[color:var(--pa-border)] bg-white px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--pa-navy)] no-underline transition-colors hover:border-[#bcc4ce]"
          >
            View the Digital Stack
          </Link>
        </div>
      </header>

      {/* Master–detail split */}
      <div className="mt-12 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: taxonomy master */}
        <section className="col-span-1 lg:col-span-8">
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b8794]">
            Advisory Scope
          </p>
          <AdvisoryScopeCards
            selected="ALL"
            onPillarClick={(id) =>
              router.push(`/research/dc-infrastructure?layer=${ADVISORY_TO_RESEARCH_FILTER[id]}#asset-deep-dives`)
            }
          />

          <div className="mt-8 flex items-center justify-between rounded-sm border border-[color:var(--pa-border)] bg-white px-5 py-4">
            <p className="text-sm text-[var(--pa-muted)]">
              Have a deal to assess or a project to structure?
            </p>
            <Link
              href={getAdvisoryHref()}
              className="shrink-0 rounded-sm border border-[color:var(--pa-border)] bg-[#faf8f2] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--pa-navy)] no-underline transition-colors hover:border-[#bcc4ce]"
            >
              View Advisory Services
            </Link>
          </div>
        </section>

        {/* Right: Research & Advisory Vault — sticky */}
        <aside className="col-span-1 lg:col-span-4">
          <div className="sticky top-16">
            <ResearchVault />
          </div>
        </aside>
      </div>
    </div>
  );
}
