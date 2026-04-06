import Link from "next/link";

export default function CoverageSectors() {
  return (
    <div className="w-full">
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 max-w-4xl">
        <article
          className="bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors overflow-hidden"
          aria-labelledby="sector-telecom-infra"
        >
          <div className="px-6 sm:px-8 py-4 border-b border-slate-800">
            <h2 id="sector-telecom-infra" className="text-xl font-semibold text-slate-50 m-0">
              Telecom Infrastructure
            </h2>
          </div>

          <ul className="m-0 p-0 list-none divide-y divide-slate-800/50">
            <li className="px-6 sm:px-8 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-slate-200 font-medium m-0">Helios Towers</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 shrink-0">
                  <Link href="/approach" className="text-blue-500 hover:text-blue-400 text-sm no-underline">
                    View Methodology
                  </Link>
                  <span className="text-slate-600 text-sm" aria-hidden>
                    ·
                  </span>
                  <Link
                    href="/workspace/helios-towers"
                    className="text-blue-500 hover:text-blue-400 text-sm no-underline"
                  >
                    Access Brief
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </article>
      </div>
    </div>
  );
}
