import Link from "next/link";

const LINKEDIN_OAUTH_HREF = "/api/auth/linkedin/authorize";

export default function SiteNavbar() {
  return (
    <nav
      className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md"
      aria-label="Primary"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 no-underline hover:opacity-95">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">
            P
          </div>
          <span className="font-semibold text-lg tracking-wide text-slate-100">Principal AI</span>
        </Link>
        <div className="flex flex-wrap gap-4 sm:gap-6 items-center justify-end">
          <Link
            href="/products"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors no-underline"
          >
            Coverage
          </Link>
          <Link
            href="/approach"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors no-underline"
          >
            Approach
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors no-underline"
          >
            Contact
          </Link>
          <a
            href={LINKEDIN_OAUTH_HREF}
            className="text-sm font-medium px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors no-underline shrink-0"
          >
            Client Login
          </a>
        </div>
      </div>
    </nav>
  );
}
