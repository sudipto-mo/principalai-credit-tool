import Link from "next/link";
import {
  DIGITAL_INFRASTRUCTURE_STACK,
  STACK_HUB_PATH,
  STACK_REPORT_LIST,
  type StackReport,
  stackReportFullTitle,
  stackReportSidebarMetaLine,
} from "@/lib/dc-stack-reports";
import { STACK_EQUITY_NOTES, stackEquityNoteSidebarMetaLine } from "@/lib/stack-equity-notes";

/** Reverse-chronological: higher defaultOrder (newer report) first. */
function reportsNewestFirst(list: StackReport[]): StackReport[] {
  return [...list].sort((a, b) => b.defaultOrder - a.defaultOrder);
}

export default function ResearchVault() {
  const stackItems = reportsNewestFirst(STACK_REPORT_LIST);
  const equityNotes = STACK_EQUITY_NOTES;

  return (
    <div className="overflow-hidden rounded-sm border border-[color:var(--pa-border)] bg-white">
      <div className="border-b border-[color:var(--pa-border)] px-4 py-4">
        <Link
          href={STACK_HUB_PATH}
          className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--pa-navy)] no-underline transition-colors hover:text-[var(--pa-navy-deep)] uppercase"
        >
          Latest intelligence
        </Link>
      </div>

      <div className="flex flex-col">
        {equityNotes.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group block border-b border-[color:var(--pa-border)] px-5 py-7 no-underline transition-colors hover:bg-[#faf8f2]"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#7b8794]">
              {stackEquityNoteSidebarMetaLine(item)}
            </p>
            <span className="mt-2 block text-[15px] font-bold leading-snug tracking-tight text-[var(--pa-navy)] transition-colors group-hover:text-[var(--pa-navy-deep)]">
              {item.title}
            </span>
          </Link>
        ))}

        {stackItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="group block border-b border-[color:var(--pa-border)] px-5 py-7 no-underline transition-colors last:border-b-0 hover:bg-[#faf8f2]"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#7b8794]">
              {stackReportSidebarMetaLine(item)}
            </p>
            <span className="mt-2 block text-[15px] font-bold leading-snug tracking-tight text-[var(--pa-navy)] transition-colors group-hover:text-[var(--pa-navy-deep)]">
              {stackReportFullTitle(item)}
            </span>
          </Link>
        ))}

        {equityNotes.length === 0 && stackItems.length === 0 ? (
          <div className="px-5 py-8">
            <p className="text-sm leading-relaxed text-[var(--pa-muted)]">
              No reports listed. Open the{" "}
              <Link href={STACK_HUB_PATH} className="text-[var(--pa-link)] no-underline hover:text-[var(--pa-link-hover)]">
                {DIGITAL_INFRASTRUCTURE_STACK}
              </Link>{" "}
              library.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
