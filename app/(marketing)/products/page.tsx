import Link from "next/link";

export const metadata = {
  title: "Coverage & Research | Principal AI",
  description:
    "Institutional credit briefs, covenant stress-testing, and Telecom infrastructure deep-dives. Access is strictly gated for authenticated clients.",
};

export default function ProductsPage() {
  return (
    <div className="w-full">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl text-slate-50 tracking-tight font-semibold mb-3 m-0">
          Coverage & Research
        </h1>
        <p className="text-slate-400 leading-relaxed text-base sm:text-lg max-w-3xl m-0">
          Institutional credit briefs, covenant stress-testing, and Telecom infrastructure deep-dives. Access is
          strictly gated for authenticated clients.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 max-w-3xl">
        <article className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 sm:p-8">
          <h2 className="text-lg font-medium text-slate-50 mb-3">Featured Research: Helios Towers</h2>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base mb-6 m-0">
            Comprehensive credit brief featuring full FY25 projections, covenant stress-testing, and capital structure
            analysis. Secure LinkedIn authentication required for full access.
          </p>
          <p className="m-0 text-sm sm:text-base">
            <Link href="/approach" className="text-blue-500 hover:text-blue-400 font-medium no-underline">
              View Methodology
            </Link>
            <span className="text-slate-600 mx-2">·</span>
            <Link
              href="/research/helios-towers"
              className="text-blue-500 hover:text-blue-400 font-medium no-underline"
            >
              Access Full Brief
            </Link>
          </p>
        </article>
      </div>
    </div>
  );
}
