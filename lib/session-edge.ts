/**
 * Verify the signed session cookie using Web Crypto (Edge middleware).
 * Logic mirrors {@link verifySession} in linkedin-session.ts (Node crypto).
 */

function base64UrlToBytes(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const raw = atob(b64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Matches Node `Buffer.from(sig, "utf8")` vs `Buffer.from(expected, "utf8")`. */
function timingSafeEqualUtf8(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const da = enc.encode(a);
  const db = enc.encode(b);
  if (da.length !== db.length) return false;
  let x = 0;
  for (let i = 0; i < da.length; i++) x |= da[i] ^ db[i];
  return x === 0;
}

export async function verifySessionEdge(token: string, secret: string): Promise<Record<string, unknown> | null> {
  if (!token || typeof token !== "string") return null;
  const dot = token.indexOf(".");
  if (dot === -1) return null;
  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const expected = bytesToBase64Url(new Uint8Array(mac));

  if (!timingSafeEqualUtf8(sig, expected)) return null;

  try {
    const json = new TextDecoder().decode(base64UrlToBytes(data));
    const payload = JSON.parse(json) as Record<string, unknown>;
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}
