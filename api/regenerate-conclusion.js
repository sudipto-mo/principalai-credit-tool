/**
 * Vercel Serverless: POST /api/regenerate-conclusion
 * Body: { context: string, sourceText: string }
 *
 * Local (e.g. vercel dev + .env.local):
 *   ENABLE_CONCLUSION_REGEN=true
 *   PERPLEXITY_API_KEY=pplx-...
 *
 * Public production (GitHub / Vercel): omit both → 403 { code: "subscription_only" }
 * (no Perplexity call, no token spend).
 *
 * Docs: https://docs.perplexity.ai/api-reference/chat-completions-post
 */

function extractJsonObject(text) {
  if (!text || typeof text !== "string") return null;
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fence ? fence[1].trim() : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}

const SECTION_TITLES = {
  "current-asset": "Current asset / adjusted working capital",
  "fixed-asset": "Fixed asset / CAPEX and efficiency",
  "sales-profitability": "Sales and profitability",
  solvency: "Solvency and financial risk",
};

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const regenEnabled =
    process.env.ENABLE_CONCLUSION_REGEN === "true" || process.env.ENABLE_CONCLUSION_REGEN === "1";
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!regenEnabled || !apiKey) {
    return res.status(403).json({
      error: "Subscription only",
      code: "subscription_only",
    });
  }

  const body = req.body || {};
  const { context, sourceText } = body;

  if (!context || typeof sourceText !== "string") {
    return res.status(400).json({ error: "Expected JSON: { context: string, sourceText: string }" });
  }

  const sectionTitle = SECTION_TITLES[context] || context;
  const clipped = sourceText.length > 14000 ? sourceText.slice(0, 14000) + "\n…" : sourceText;

  const system =
    "You are a senior credit analyst drafting committee draft conclusions. Use clear, professional English. Output JSON only — no markdown fences, no commentary.";

  const user = `Regenerate the "${sectionTitle}" conclusion of a credit draft. Match the style: bullet list where each item starts with a short label (like a subheading) followed by narrative.

Current conclusion (reference for facts, tone, and structure — improve clarity; do not invent specific numbers not implied by the text):
---
${clipped}
---

Return ONLY valid JSON with this exact shape:
{"items":[{"label":"Short label ending with colon: ","body":"One to three sentences of analysis."}]}
Use between 4 and 7 items unless the source clearly needs fewer.`;

  let pplxRes;
  try {
    pplxRes = await fetch("https://api.perplexity.ai/v1/sonar", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.PERPLEXITY_MODEL || "sonar-pro",
        temperature: 0.35,
        max_tokens: 4096,
        disable_search: true,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
  } catch (e) {
    return res.status(502).json({ error: "Failed to reach Perplexity API", detail: String(e.message || e) });
  }

  const rawText = await pplxRes.text();
  if (!pplxRes.ok) {
    return res.status(502).json({
      error: "Perplexity API returned an error",
      status: pplxRes.status,
      detail: rawText.slice(0, 800),
    });
  }

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    return res.status(502).json({ error: "Invalid JSON from Perplexity" });
  }

  const content = data.choices?.[0]?.message?.content;
  const text = typeof content === "string" ? content : content != null ? String(content) : "";
  const parsed = extractJsonObject(text);

  if (!parsed || !Array.isArray(parsed.items)) {
    return res.status(502).json({
      error: "Model did not return usable JSON",
      preview: text.slice(0, 600),
    });
  }

  const items = parsed.items.filter(function (x) {
    return x && (x.label || x.body);
  });
  if (!items.length) {
    return res.status(502).json({ error: "Model returned empty items" });
  }

  return res.status(200).json({ items: items });
};
