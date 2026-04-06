import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ApproachPage() {
  return (
    <div className="relative left-1/2 right-auto w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip bg-[#0B0F19] text-slate-50 font-sans antialiased selection:bg-blue-500/25">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035] mix-blend-overlay z-0"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-[1] px-6">
        {/* Hero — compact, front-loaded */}
        <header className="max-w-5xl mx-auto pt-16 pb-12">
          <h1 className="text-sm font-semibold tracking-widest text-blue-500 uppercase mb-4 m-0">THE APPROACH</h1>
          <h2 className="text-5xl font-bold tracking-tight text-white mb-6 m-0">Origination as Alpha.</h2>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl m-0">
            In fast-moving markets, latency is a deal-killer. This framework equips the Coverage Banker to move from
            &apos;First Meeting&apos; to &apos;Term Sheet&apos; with the speed of a fintech and the structural rigor
            of a Tier-1 Institution.
          </p>
        </header>

        {/* Before & after */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight mb-3 m-0">The Origination Bottleneck</h3>
            <p className="text-slate-300 leading-relaxed text-base m-0">
              The path to a &apos;Go/No-Go&apos; decision is stalled by manual heavy lifting. Precious days are lost
              spreading messy, multi-entity financials from PDFs, and losing 48 hours to a &apos;v0.1&apos; draft means
              losing the mandate.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight mb-3 m-0">The Virtual Deal Team</h3>
            <p className="text-slate-300 leading-relaxed text-base m-0">
              An agentic hierarchy mirroring a classic deal team. A &apos;Deal Coordinator&apos; manages the workflow
              for IC memos, while &apos;Specialist Agents&apos; handle high-fidelity OCR extraction and instant modeling
              of Cash Flow Conversion and Leverage.
            </p>
          </div>
        </div>

        {/* Reality check — full-width band */}
        <div className="w-screen relative left-1/2 -translate-x-1/2 bg-slate-900/50 border-y border-slate-800 py-12 mb-16 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-4 m-0">
              Professional Insight Over &apos;AI Noise&apos;
            </h2>
            <p className="text-slate-300 leading-relaxed text-base sm:text-lg max-w-3xl mx-auto m-0">
              AI is a high-performance engine, but it requires a &apos;Master Driver&apos;. While screening a global
              Packaging prospect, a generic AI misidentified &apos;Bills Payable&apos; as standard A/P. To a machine,
              it&apos;s a generic liability; to a Senior Banker, it is Bank Debt that triggers a covenant breach. I use
              AI to surface the truth in the data so you can focus on Structuring and Covenants, not data entry.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="max-w-5xl mx-auto text-center pb-20" aria-labelledby="approach-cta-heading">
          <h2 id="approach-cta-heading" className="text-2xl font-semibold text-white mb-6 m-0">
            Ready to accelerate your deal cycle?
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors no-underline"
          >
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
            Submit a Mandate
          </Link>
        </section>
      </div>
    </div>
  );
}
