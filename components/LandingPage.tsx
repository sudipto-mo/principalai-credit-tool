import Link from "next/link";
import { Lock, Activity, Database, ShieldCheck, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-full text-slate-50 font-sans selection:bg-blue-500/30 w-full">
      <section className="relative max-w-7xl mx-auto px-6 pt-12 pb-20 lg:pt-20 lg:pb-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="w-full lg:w-1/2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Activity className="w-3 h-3 shrink-0" aria-hidden />
            Built for Human Judgment
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Institutional credit workflows, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              minus the analyst friction.
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl">
            Generic AI hallucinates. Principal AI is a finance-first engine built on institutional credit discipline. Extract, spread, and draft TMT infrastructure deals in an hour.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-base transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] no-underline"
            >
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
              Submit a Mandate
            </Link>
            <Link
              href="/approach"
              className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-base transition-all border border-slate-700 no-underline"
            >
              Our Approach
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500 font-medium tracking-wide">
            ON-DEMAND CREDIT STRUCTURING & DEAL SCREENING.
          </p>
        </div>

        <div className="w-full lg:w-1/2 relative">
          <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl p-2 shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-950/50 rounded-t-xl">
              <div className="w-3 h-3 rounded-full bg-slate-700" />
              <div className="w-3 h-3 rounded-full bg-slate-700" />
              <div className="w-3 h-3 rounded-full bg-slate-700" />
              <div className="ml-4 text-xs font-mono text-slate-500">principalai.pro/workspace/helios-towers</div>
            </div>

            <div className="relative p-6 bg-slate-900 rounded-b-xl h-[400px] overflow-hidden">
              <div
                className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: "url(https://www.transparenttextures.com/patterns/cubes.png)",
                }}
              />

              <div className="space-y-6 blur-[3px] opacity-60 select-none">
                <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                  <div>
                    <div className="h-4 w-24 bg-slate-700 rounded mb-2" />
                    <div className="h-8 w-64 bg-slate-600 rounded" />
                  </div>
                  <div className="h-10 w-32 bg-slate-800 rounded" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-slate-800/50 rounded border border-slate-700/50" />
                  <div className="h-24 bg-slate-800/50 rounded border border-slate-700/50" />
                  <div className="h-24 bg-slate-800/50 rounded border border-slate-700/50" />
                </div>

                <div className="h-32 bg-slate-800/30 rounded border border-slate-700/50" />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-sm rounded-b-xl">
                <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-blue-400" aria-hidden />
                </div>
                <h3 className="text-xl font-bold text-white mb-6">Report Locked</h3>
                <Link
                  href="/workspace/helios-towers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-2 bg-white text-slate-900 font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors no-underline"
                >
                  Unlock Workspace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-1">
              <h2 className="text-3xl font-bold text-white mb-4">
                Finance-first, <br />
                not &quot;prompt &amp; pray&quot;
              </h2>
              <p className="text-slate-400 leading-relaxed">
                I looked for a tool that actually understood a tower-infrastructure credit brief without inventing
                numbers. It wasn&apos;t there. So I built what I wished I&apos;d had on the desk.
              </p>
            </div>

            <div className="md:col-span-2 grid sm:grid-cols-2 gap-8">
              <div className="p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <Database className="w-8 h-8 text-blue-400 mb-4 shrink-0" aria-hidden />
                <h3 className="text-lg font-semibold text-white mb-2">Sector-Aware Spreading</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Adjusted EBITDA and net-leverage thinking tuned to tower infrastructure, including IFRS 16
                  lease-adjusted treatment where it matters.
                </p>
              </div>

              <div className="p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                <ShieldCheck className="w-8 h-8 text-blue-400 mb-4 shrink-0" aria-hidden />
                <h3 className="text-lg font-semibold text-white mb-2">Analyst-in-the-Loop</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  AI produces the first pass; the credit professional holds the pen for the final sign-off. Built for
                  institutional risk standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
