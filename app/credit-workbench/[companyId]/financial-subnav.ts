/** Helios Financial long-scroll subsections — URL ?fin= matches. */
export type HeliosFinancialSubId = "profile" | "asset";

export const HELIOS_FINANCIAL_SUBSECTIONS: { id: HeliosFinancialSubId; label: string; navLabel: string }[] = [
  { id: "profile", label: "Financial profile", navLabel: "Profile" },
  { id: "asset", label: "Asset Management", navLabel: "Asset Management" },
];

export function parseFinancialSubParam(raw: string | null): HeliosFinancialSubId {
  if (raw === "asset" || raw === "profile") return raw;
  return "profile";
}
