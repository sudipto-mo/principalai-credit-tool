"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function GlobalOAuthFlashInner() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<{ text: string; kind: "ok" | "warn" | "err" } | null>(null);

  useEffect(() => {
    const mode = searchParams.get("oauth_auth") || searchParams.get("linkedin_auth");
    if (!mode) return;

    if (mode === "success") {
      setMessage({
        text: "You’re signed in. The credit workbench and research gates are available on this session.",
        kind: "ok",
      });
    } else if (mode === "missing_config") {
      setMessage({
        text: "Sign-in isn’t fully configured on this host. Add AUTH_SECRET and provider keys (see .env.example), then redeploy.",
        kind: "warn",
      });
    } else if (mode === "error") {
      const reason = searchParams.get("reason") || "Unknown error";
      setMessage({ text: `Sign-in did not complete: ${reason}`, kind: "err" });
    } else return;

    try {
      const u = new URL(window.location.href);
      u.searchParams.delete("oauth_auth");
      u.searchParams.delete("linkedin_auth");
      u.searchParams.delete("reason");
      window.history.replaceState({}, "", u.pathname + u.search + u.hash);
    } catch {
      /* ignore */
    }
  }, [searchParams]);

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => setMessage(null), 12000);
    return () => window.clearTimeout(t);
  }, [message]);

  if (!message) return null;

  const bar =
    message.kind === "ok"
      ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-100/95"
      : message.kind === "warn"
        ? "border-amber-500/35 bg-amber-500/10 text-amber-100/95"
        : "border-red-500/35 bg-red-500/10 text-red-100/95";

  return (
    <div
      className={`mx-auto max-w-4xl px-6 pt-4 ${bar} border rounded-lg px-4 py-3 text-sm leading-relaxed`}
      role="status"
    >
      {message.text}
    </div>
  );
}

export default function GlobalOAuthFlash() {
  return (
    <Suspense fallback={null}>
      <GlobalOAuthFlashInner />
    </Suspense>
  );
}
