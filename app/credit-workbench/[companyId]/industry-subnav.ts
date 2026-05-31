/** Helios Industry long-scroll subsections — URL ?ins= matches. */
export type HeliosIndustrySubId = "overview" | "digest" | "matrix1";

export const HELIOS_INDUSTRY_SUBSECTIONS: { id: HeliosIndustrySubId; label: string; navLabel: string }[] = [
  { id: "overview", label: "Business risk view", navLabel: "Overview" },
  { id: "digest", label: "Digest & extracted anchors", navLabel: "Digest" },
  { id: "matrix1", label: "Industry Risk", navLabel: "Industry Risk" },
];

export function parseIndustrySubParam(raw: string | null): HeliosIndustrySubId {
  if (raw === "matrix2") return "matrix1";
  if (raw === "digest" || raw === "matrix1" || raw === "overview") return raw;
  return "overview";
}
