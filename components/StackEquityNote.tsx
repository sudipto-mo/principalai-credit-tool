import type { StackEquityNote } from "@/lib/stack-equity-notes";

const body = "text-[15px] leading-relaxed text-[var(--pa-muted)] sm:text-base sm:leading-7";
const sectionLabel =
  "text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--pa-navy)] sm:text-xs";

export default function StackEquityNoteArticle({ note }: { note: StackEquityNote }) {
  return (
    <article>
      <header className="border-b border-[color:var(--pa-border)] pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7b8794]">{note.eyebrow}</p>
        <h1 className="font-serif-display mt-5 text-[2rem] font-light leading-[1.1] tracking-tight text-[var(--pa-navy)] sm:text-[2.35rem]">
          {note.title}
        </h1>
        <p className={`mt-5 max-w-2xl ${body} text-[var(--pa-text)]`}>{note.deck}</p>
      </header>

      <div className="mt-10 space-y-10">
        {note.sections.map((section) => (
          <section key={section.label}>
            <h2 className={sectionLabel}>{section.label}</h2>
            <p className={`mt-3 ${body}`}>{section.body}</p>
          </section>
        ))}
      </div>

      <footer className="mt-14 border-t border-[color:var(--pa-border)] pt-8">
        <p className="text-[13px] leading-relaxed text-[#7b8794]">
          <span className="font-semibold text-[var(--pa-text)]">Source: </span>
          {note.source}
        </p>
      </footer>
    </article>
  );
}
