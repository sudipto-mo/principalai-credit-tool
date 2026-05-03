#!/usr/bin/env python3
"""
roster_review.py — monthly checkpoint.

Does NOT modify the roster. Produces a summary markdown file prompting the user
to consider whether any names should be added or dropped.

Writes: roster_review_YYYY-MM.md
"""
from __future__ import annotations

import datetime as dt
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
TICKERS = ROOT / "tickers.json"
EMBED = ROOT / "financials_embed.json"
REVIEW_DIR = ROOT / "roster_reviews"


def main() -> int:
    REVIEW_DIR.mkdir(exist_ok=True)
    today = dt.date.today()
    out_path = REVIEW_DIR / f"roster_review_{today:%Y-%m}.md"

    entries = json.loads(TICKERS.read_text())
    embed = json.loads(EMBED.read_text()) if EMBED.exists() else {"by_symbol": {}}
    by_sym = embed.get("by_symbol", {})

    # Breakdowns
    by_band = Counter(e["band"] for e in entries)
    by_geo = Counter(e["geo"] for e in entries)
    by_country = Counter(e.get("country") or "Private" for e in entries)
    by_subnode = Counter((e["band"], e["subnode_title"]) for e in entries)

    held = [e for e in entries if e.get("held")]
    private = [e for e in entries if e.get("private")]
    listed = [e for e in entries if not e.get("private")]

    # Performance buckets (from embed)
    listed_syms = [e["symbol"] for e in listed]
    rets = [by_sym.get(s, {}).get("one_yr_return_pct") for s in listed_syms]
    rets = [r for r in rets if r is not None]
    gainers = sorted(
        [(s, by_sym.get(s, {}).get("one_yr_return_pct")) for s in listed_syms
         if by_sym.get(s, {}).get("one_yr_return_pct") is not None],
        key=lambda x: x[1], reverse=True,
    )
    losers = list(reversed(gainers))

    # Missing / stale
    stale = [s for s in listed_syms
             if by_sym.get(s, {}).get("data_status", "").startswith("missing")]

    lines = []
    w = lines.append
    w(f"# Universe Roster Review — {today:%B %Y}\n")
    w(f"_Generated {today.isoformat()}. Read-only checkpoint — no changes applied._\n")

    w("## Shape\n")
    w(f"- **Total names:** {len(entries)} ({len(listed)} listed, {len(private)} private)")
    w(f"- **Held positions:** {len(held)}")
    w(f"- **Stale / missing data:** {len(stale)} ({', '.join(stale) if stale else 'none'})\n")

    w("## By band\n")
    for b, n in by_band.most_common():
        w(f"- `{b}`: {n}")
    w("")

    w("## By geography\n")
    for g, n in by_geo.most_common():
        w(f"- {g}: {n}")
    w("")

    w("## By country (top 10)\n")
    for c, n in by_country.most_common(10):
        w(f"- {c}: {n}")
    w("")

    if gainers:
        w("## Top 10 1Y performers\n")
        for s, r in gainers[:10]:
            w(f"- **{s}** — {r:+.1f}%")
        w("")
        w("## Bottom 10 1Y performers\n")
        for s, r in losers[:10]:
            w(f"- **{s}** — {r:+.1f}%")
        w("")

    w("## Review prompts\n")
    w("Treat the roster as hand-curated. Ask yourself:")
    w("1. Any names you'd **drop**? (Stale data, thesis broken, corp action, performance signal irrelevant)")
    w(f"   - Investigate the {len(stale)} stale names above first.")
    w("2. Any names you'd **add**? New entrants to the digital infra supply chain, IPOs, spin-offs, recent public listings.")
    w("3. Any **band or sub-node** under- or over-represented? See the breakdowns above.")
    w("4. Any **geography** under-represented for where the capital is flowing? Particularly India, Southeast Asia, GCC.")
    w("5. Any **held positions** no longer appropriate for the universe map?\n")
    w("When changes are needed:")
    w("- Edit `SUBNODES` in `dorrsum-open-portfolio.html`")
    w("- Re-run `python3 extract_tickers.py` (regenerates tickers.json)")
    w("- Run a full `fetch_fundamentals.py` to backfill")
    w("- Run `bake_financials.py`\n")

    out_path.write_text("\n".join(lines))
    print(f"[WROTE] {out_path}")
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())
