#!/usr/bin/env python3
"""
bake_financials.py
------------------
Injects financials_embed.json into dorrsum-open-portfolio.html between the
FINANCIALS START/END fences, and drops in formatter helpers + an updated
activate() table body. Idempotent: re-run after any fetch to refresh numbers.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent.resolve()
# Script lives at <repo>/scripts/universe/; live HTML at <repo>/public/open-portfolio/
HTML = (ROOT.parent.parent / "public" / "open-portfolio" / "index.html").resolve()
EMBED = ROOT / "financials_embed.json"
SCORES = ROOT / "scores_embed.json"

FENCE_START = "/* === FINANCIALS START ==="
FENCE_END = "/* === FINANCIALS END === */"

SCORES_START = "/* === SCORES START ==="
SCORES_END = "/* === SCORES END === */"

# Anchor: insert the whole block immediately before "var BAND_LABELS"
ANCHOR = "  var BAND_LABELS = {"

# Formatter helpers + render-row rebuilder, inserted once (idempotent-guarded)
HELPERS_START = "/* === FINANCIALS HELPERS START === */"
HELPERS_END = "/* === FINANCIALS HELPERS END === */"

HELPERS_JS = """
  /* === FINANCIALS HELPERS START === */
  function fmtMCapUsd(v) {
    if (v === null || v === undefined || isNaN(v)) return '\u2014';
    var abs = Math.abs(v);
    if (abs >= 1e12) return '$' + (v/1e12).toFixed(2) + 'T';
    if (abs >= 1e9)  return '$' + (v/1e9).toFixed(1)  + 'B';
    if (abs >= 1e6)  return '$' + (v/1e6).toFixed(0)  + 'M';
    return '$' + v.toFixed(0);
  }
  function fmtPrice(v, ccy) {
    if (v === null || v === undefined || isNaN(v)) return '\u2014';
    var symbolMap = { USD:'$', EUR:'\u20ac', GBP:'\u00a3', GBp:'p', JPY:'\u00a5',
                      HKD:'HK$', KRW:'\u20a9', TWD:'NT$', INR:'\u20b9', SGD:'S$',
                      AUD:'A$', IDR:'Rp', SEK:'kr', DKK:'kr' };
    var sym = symbolMap[ccy] || '';
    var rounded = v >= 1000 ? Math.round(v).toLocaleString('en-US')
                            : v.toFixed(2);
    return sym + rounded;
  }
  function fmtPE(v) {
    if (v === null || v === undefined || isNaN(v) || v < 0) return '\u2014';
    return v.toFixed(1) + 'x';
  }
  function fmtPct(v) {
    if (v === null || v === undefined || isNaN(v)) return { t: '\u2014', cls: 'muted' };
    var sign = v >= 0 ? '+' : '';
    var cls = v >= 0 ? 'ret-pos' : 'ret-neg';
    return { t: sign + v.toFixed(1) + '%', cls: cls };
  }
  function getFin(sym) {
    var db = (FINANCIALS && FINANCIALS.by_symbol) || {};
    return db[sym] || null;
  }
  /* === FINANCIALS HELPERS END === */
"""

# Replacement activate() table body. We match the old four-column header and
# rebuild the row renderer. This regex-replaces the old bodyEl.innerHTML block.
OLD_TABLE_BLOCK_RE = re.compile(
    r"""
    (\s*)var\ rows\ =\ data\.roster\.map\(function\(entry\)\ \{\s*
    \s*var\ flags\ =\ \[\];\s*
    \s*if\ \(entry\.held\)\ flags\.push\('<span\ class="held">\\u2605\ Held</span>'\);\s*
    \s*if\ \(entry\.pvt\)\ \ flags\.push\('<span\ class="pvt">Private</span>'\);\s*
    \s*var\ tcls\ =\ 'col-ticker'\ \+\ \(entry\.held\ \?\ '\ held'\ :\ ''\);\s*
    \s*return\ '<tr>'\ \+\s*
    \s*'<td\ class="'\ \+\ tcls\ \+\ '">'\ \+\ esc\(entry\.symbol\)\ \+\ '</td>'\ \+\s*
    \s*'<td\ class="col-name">'\ \+\ esc\(entry\.name\)\ \+\ '</td>'\ \+\s*
    \s*'<td\ class="col-geo">'\ \+\ esc\(entry\.geo\)\ \+\ '</td>'\ \+\s*
    \s*'<td\ class="col-flag">'\ \+\ flags\.join\('\ &middot;\ '\)\ \+\ '</td>'\ \+\s*
    \s*'</tr>';\s*
    \s*\}\)\.join\(''\);\s*
    \s*bodyEl\.innerHTML\ =\s*
    \s*'<table><thead><tr>'\ \+\s*
    \s*'<th\ style="width:16%;">Ticker</th><th>Company</th>'\ \+\s*
    \s*'<th\ style="width:12%;">Geo</th><th\ style="width:22%;">Flag</th>'\ \+\s*
    \s*'</tr></thead><tbody>'\ \+\ rows\ \+\ '</tbody></table>';
    """,
    re.VERBOSE,
)

NEW_TABLE_BLOCK = """    var rows = data.roster.map(function(entry) {
      var fin = getFin(entry.symbol) || {};
      var flags = [];
      if (entry.held) flags.push('<span class="held">\\u2605 Held</span>');
      if (entry.pvt)  flags.push('<span class="pvt">Private</span>');
      var tcls = 'col-ticker' + (entry.held ? ' held' : '');
      var isPrivate = entry.pvt || fin.data_status === 'private';
      var isMissing = !isPrivate && (!fin.data_status || fin.data_status !== 'ok');
      var mcapHtml = isPrivate ? '<span class="muted">Private</span>' : (isMissing ? '<span class="muted">\\u2014</span>' : fmtMCapUsd(fin.market_cap_usd));
      var priceHtml = isPrivate || isMissing ? '<span class="muted">\\u2014</span>' : fmtPrice(fin.price_local, fin.currency);
      var peHtml = isPrivate || isMissing ? '<span class="muted">\\u2014</span>' : fmtPE(fin.pe_ttm);
      var ret = fmtPct(isPrivate || isMissing ? null : fin.one_yr_return_pct);
      var exchHtml = esc(fin.exchange || entry.geo || '');
      return '<tr>' +
        '<td class="' + tcls + '">' + esc(entry.symbol) + '</td>' +
        '<td class="col-name">' + esc(entry.name) + '</td>' +
        '<td class="col-exch">' + exchHtml + '</td>' +
        '<td class="col-num">' + priceHtml + '</td>' +
        '<td class="col-num">' + mcapHtml + '</td>' +
        '<td class="col-num">' + peHtml + '</td>' +
        '<td class="col-num ' + ret.cls + '">' + ret.t + '</td>' +
        '<td class="col-flag">' + flags.join(' &middot; ') + '</td>' +
      '</tr>';
    }).join('');

    bodyEl.innerHTML =
      '<table><thead><tr>' +
        '<th>Ticker</th>' +
        '<th>Company</th>' +
        '<th>Exchange</th>' +
        '<th class="num">Price</th>' +
        '<th class="num">MCap (USD)</th>' +
        '<th class="num">P/E</th>' +
        '<th class="num">1Y Ret</th>' +
        '<th>Flag</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table>';"""


def main() -> None:
    html = HTML.read_text()
    embed = EMBED.read_text().strip()
    compact = json.dumps(json.loads(embed), separators=(",", ":"))

    financials_block = (
        "  "
        + FENCE_START
        + " (auto-baked; do not edit by hand — re-run fetch_fundamentals.py + bake_financials.py) */\n"
        + "  var FINANCIALS = "
        + compact
        + ";\n  "
        + FENCE_END
        + "\n"
    )

    # --- 1. Inject or replace the FINANCIALS block ---
    if FENCE_START in html:
        # Replace between the fences. Callable replacement guards against
        # accidental backreference interpretation of any \uXXXX in the JSON.
        pat = re.compile(
            re.escape("  " + FENCE_START) + r".*?" + re.escape(FENCE_END) + r"\n",
            re.DOTALL,
        )
        html = pat.sub(lambda _m: financials_block, html, count=1)
        print("[FINANCIALS] replaced existing block")
    else:
        # Insert before BAND_LABELS anchor
        if ANCHOR not in html:
            sys.exit(f"Anchor not found: {ANCHOR!r}")
        html = html.replace(ANCHOR, financials_block + "\n" + ANCHOR, 1)
        print("[FINANCIALS] inserted new block")

    # --- 2. Inject helpers (only once) ---
    if HELPERS_START not in html:
        # Put helpers right after the FINANCIALS END fence
        html = html.replace(FENCE_END, FENCE_END + HELPERS_JS, 1)
        print("[HELPERS] inserted")
    else:
        # Replace existing helpers block
        pat = re.compile(
            re.escape(HELPERS_START) + r".*?" + re.escape(HELPERS_END),
            re.DOTALL,
        )
        html = pat.sub(HELPERS_JS.strip(), html, count=1)
        print("[HELPERS] replaced")

    # --- 3. Rewrite the activate() table body ---
    m = OLD_TABLE_BLOCK_RE.search(html)
    if m:
        html = OLD_TABLE_BLOCK_RE.sub(lambda _m: NEW_TABLE_BLOCK, html, count=1)
        print("[ACTIVATE] rewrote old 4-col table")
    else:
        # Already rewritten? check for an 8-col marker
        if "<th>Exchange</th>" in html and "col-num" in html:
            print("[ACTIVATE] already 8-col; no change")
        else:
            sys.exit("Could not locate old table block or 8-col marker — bailing")

    # --- 4. Inject SCORES block (Phase 2 — score engine output) ---
    # Lives right after FINANCIALS END so window.__Dorrsum picks it up at
    # IIFE close. If scores_embed.json doesn't exist yet, leave an empty
    # placeholder so the drawer's `SCORES = {}` fallback kicks in.
    if SCORES.exists():
        scores_compact = json.dumps(json.loads(SCORES.read_text()), separators=(",", ":"))
        scores_payload = f"var SCORES = {scores_compact};"
        scores_origin = f"loaded from {SCORES.name}"
    else:
        scores_payload = "var SCORES = { by_symbol: {}, weights_default: {}, fetched_at: null };"
        scores_origin = "placeholder — run score_engine.py to populate"

    scores_block = (
        "  "
        + SCORES_START
        + f" (auto-baked from score_engine.py; {scores_origin}) */\n"
        + "  " + scores_payload + "\n"
        + "  "
        + SCORES_END
        + "\n"
    )

    if SCORES_START in html:
        pat = re.compile(
            re.escape("  " + SCORES_START) + r".*?" + re.escape(SCORES_END) + r"\n",
            re.DOTALL,
        )
        # Use a callable replacement so JSON-encoded unicode (≥ etc.) in
        # the payload isn't interpreted as a regex backreference.
        html = pat.sub(lambda _m: scores_block, html, count=1)
        print(f"[SCORES] replaced ({scores_origin})")
    else:
        # Insert immediately AFTER the FINANCIALS HELPERS block so SCORES
        # is in scope by the time the IIFE assembles window.__Dorrsum.
        helpers_end_marker = HELPERS_END
        if helpers_end_marker in html:
            html = html.replace(helpers_end_marker,
                                helpers_end_marker + "\n" + scores_block,
                                1)
            print(f"[SCORES] inserted ({scores_origin})")
        else:
            sys.exit(f"Helpers anchor not found: {helpers_end_marker!r}")

    HTML.write_text(html)
    print(f"[WROTE] {HTML} ({len(html)//1024} KB)")


if __name__ == "__main__":
    main()
