import type { Metadata } from "next";
import { SITE_LINKEDIN_URL } from "@/lib/contact-constants";
import { paEditorialTitleMarketing } from "@/lib/editorial-typography";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach out to Principal AI for credit origination, collaboration, or general inquiries.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-10 sm:mb-12">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b8794]">Contact</p>
        <h1 className={paEditorialTitleMarketing}>Discuss a Mandate</h1>
        <p className="m-0 max-w-2xl text-base leading-[1.8] text-[var(--pa-muted)] sm:text-lg">
          For advisory mandates, screening requests, or follow-up on active workstreams, the fastest path is direct
          outreach on LinkedIn.
        </p>
      </header>

      <section
        className="rounded-sm border border-[color:var(--pa-border)] bg-white p-8 text-center sm:p-10"
        aria-label="LinkedIn"
      >
        <p className="m-0 mb-6 text-base leading-relaxed text-[var(--pa-muted)]">
          Open my profile and send a direct message with your context, timeline, and the transaction or asset class you
          are evaluating.
        </p>
        <a
          href={SITE_LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-sm border border-[var(--pa-navy)] bg-[var(--pa-navy)] px-8 py-3.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white no-underline transition-colors hover:bg-[var(--pa-navy-deep)]"
        >
          Message on LinkedIn
        </a>
      </section>
    </div>
  );
}
