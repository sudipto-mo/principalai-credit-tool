import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StackEquityNoteArticle from "@/components/StackEquityNote";
import { DIGITAL_INFRASTRUCTURE_STACK, STACK_HUB_PATH } from "@/lib/dc-stack-reports";
import { getStackEquityNote } from "@/lib/stack-equity-notes";

const note = getStackEquityNote("banking-rerating");

export const metadata: Metadata = {
  title: note?.title ?? "Equity note",
  description: note?.description,
  robots: { index: true, follow: true },
};

export default function BankingReratingPage() {
  if (!note) notFound();

  return (
    <div className="min-h-full w-full bg-[var(--pa-page)] text-[var(--pa-text)]">
      <div className="mx-auto max-w-3xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14 md:pt-16">
        <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b8794]">
          <Link href="/research" className="no-underline transition-colors hover:text-[var(--pa-navy)]">
            ← Research
          </Link>
          {" · "}
          <Link href={STACK_HUB_PATH} className="no-underline transition-colors hover:text-[var(--pa-navy)]">
            {DIGITAL_INFRASTRUCTURE_STACK}
          </Link>
        </p>

        <StackEquityNoteArticle note={note} />

        <div className="mt-12 border-t border-[color:var(--pa-border)] pt-8">
          <Link
            href={STACK_HUB_PATH}
            className="text-sm text-[var(--pa-muted)] no-underline transition-colors hover:text-[var(--pa-text)]"
          >
            ← {DIGITAL_INFRASTRUCTURE_STACK}
          </Link>
        </div>
      </div>
    </div>
  );
}
