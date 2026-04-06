/** Parse Cookie header values (no Node imports — safe for Edge middleware). */

export function getCookieHeader(cookieHeader: string | null, name: string): string {
  if (!cookieHeader) return "";
  const parts = cookieHeader.split(";");
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const idx = p.indexOf("=");
    if (idx === -1) continue;
    const k = p.slice(0, idx).trim();
    const v = p.slice(idx + 1).trim();
    if (k === name) {
      try {
        return decodeURIComponent(v);
      } catch {
        return v;
      }
    }
  }
  return "";
}
