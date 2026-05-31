/**
 * Homepage hero copy and carousel slide metadata.
 * Global chrome uses `SiteNavbar` with the same inline styles as the original Hero bar
 * (`lib/marketing-nav-styles.ts`).
 */

import { STACK_REPORTS, stackReportFullTitle, type StackReport } from "@/lib/dc-stack-reports";
import { isAdvisoryEnabled } from "@/lib/advisory-access";

/** Left-column hero — matches marketing homepage intent. */
export const HERO_MARKETING = {
  eyebrow: "APAC Digital Infrastructure Research",
  headline: "The physical stack prices the equity.",
  body:
    "The market prices AI infrastructure on growth assumptions. We price it on what the physical layer can actually deliver — the power that's permitted, the silicon that's shipping, the land that's available. The gap is the call.",
  methodStrip:
    "Market-implied expectations → physical-stack stress test → the mispricing call",
  primaryCta: { label: "Read the Research", href: "/research" as const },
  secondaryCta: { label: "Institutional Advisory", href: "/advisory" as const },
} as const;

/** Brand block — aligned with `SiteNavbar` home link (wordmark + tagline render in navbar). */
export const HERO_BRAND = {
  tagline: "RETURN AND RISK. SUMMED UP.",
} as const;

export type HeroCarouselVizKey = "physical" | "worldview" | "ecosystem";

export type HeroCarouselSlideMeta = {
  vizKey: HeroCarouselVizKey;
  type: string;
  title: string;
  subtitle: string;
  date: string;
  region: string;
  accent: string;
  light: boolean;
  href: string;
};

function stackReportCardDate(r: StackReport): string {
  return `${r.releaseMonthLong} ${r.releaseYear}`;
}

/**
 * Carousel slides: first two reports use `stackReportFullTitle` + dates/hrefs from `STACK_REPORTS`;
 * third slide is the ecosystem map tool (static href).
 */
export function getHeroCarouselSlides(): HeroCarouselSlideMeta[] {
  const ps = STACK_REPORTS["physical-stack"];
  const wv = STACK_REPORTS.worldview;
  return [
    {
      vizKey: "physical",
      type: "Research Report",
      title: stackReportFullTitle(ps),
      subtitle: "",
      date: stackReportCardDate(ps),
      region: ps.region,
      accent: "rgba(140,105,50,0.85)",
      light: true,
      href: ps.href,
    },
    {
      vizKey: "worldview",
      type: "Research Report",
      title: stackReportFullTitle(wv),
      subtitle: "",
      date: stackReportCardDate(wv),
      region: wv.region,
      accent: "rgba(100,80,30,0.80)",
      light: true,
      href: wv.href,
    },
    {
      vizKey: "ecosystem",
      type: "Interactive Tool",
      title: "Ecosystem Web",
      subtitle: "The AI Infrastructure Network",
      date: "LIVE",
      region: "WEB",
      accent: "rgba(100,80,30,0.80)",
      light: true,
      href: "/dc-network-map.html",
    },
  ];
}

export type HeroNavItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "origination"; label: string; href: string; wip?: true }
  | { kind: "advisory"; label: string; href: string; hasChevron: true };

/**
 * Primary nav items for the inline hero bar — same routes as `SiteNavbar` desktop row
 * (Research → Advisory dropdown parent → Contact), plus Origination when enabled and allowed.
 */
export function getHeroPrimaryNavItems(opts: { showOrigination: boolean }): HeroNavItem[] {
  const items: HeroNavItem[] = [{ kind: "link", label: "Research", href: "/research" }];
  if (opts.showOrigination) {
    items.push(
      process.env.NODE_ENV === "development"
        ? { kind: "origination", label: "Origination", href: "/origination", wip: true }
        : { kind: "origination", label: "Origination", href: "/origination" },
    );
  }
  items.push(
    ...(isAdvisoryEnabled()
      ? [{ kind: "advisory" as const, label: "Advisory", href: "/advisory", hasChevron: true as const }]
      : []),
    { kind: "link", label: "Contact", href: "/contact" },
  );
  return items;
}
