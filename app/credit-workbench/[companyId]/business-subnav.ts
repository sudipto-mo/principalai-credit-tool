/** Helios Business Risk long-scroll subsections — URL ?bs= matches. (Asset Management lives under Financial.) */
export type HeliosBusinessSubId = "model" | "sales";

export const HELIOS_BUSINESS_SUBSECTIONS: { id: HeliosBusinessSubId; label: string; navLabel: string }[] = [
  { id: "model", label: "Business Model", navLabel: "Business Model" },
  { id: "sales", label: "Sales & Profitability", navLabel: "Sales" },
];

export function parseBusinessSubParam(raw: string | null): HeliosBusinessSubId {
  if (raw === "asset") return "model";
  if (raw === "sales" || raw === "model") return raw;
  return "model";
}
