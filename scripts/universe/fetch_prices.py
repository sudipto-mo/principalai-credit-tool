#!/usr/bin/env python3
"""
fetch_prices.py — daily lightweight refresh.

Pulls only the four fields that move on a trading day:
  price_local, market_cap_usd, one_yr_return_pct, pe_ttm (+ fresh FX).

Patches `financials_embed.json` in place — does NOT touch exchange, currency,
or data_status (those come from the weekly fetch_fundamentals.py run).

Intended to be scheduled Mon-Fri after US close (06:30 SGT the next morning).
"""
from __future__ import annotations

import datetime as dt
import json
import sys
import time
from pathlib import Path

import yfinance as yf

ROOT = Path(__file__).parent.resolve()
TICKERS = ROOT / "tickers.json"
EMBED = ROOT / "financials_embed.json"
LOG = ROOT / "daily_price_log.csv"
CACHE_TTL_SEC = 20 * 3600  # 20h — within-day reruns hit cache

# Retry behaviour for transient yfinance errors (rate-limit / network blips).
# Empty-history failures aren't retried — those are usually delisted symbols.
MAX_RETRIES = 2
RETRY_BACKOFF_S = (5, 15)
FAIL_THRESHOLD_PCT = 20

# Stage-1 history: one parquet per trading day. ~250 days/yr × ~30 KB ≈ 7 MB/yr.
# Append-only, gitignored. Roll up into DuckDB once Week 2 score engine ships.
SNAPSHOT_PRICES_DIR = ROOT / "data" / "snapshots" / "prices"
SNAPSHOT_PRICES_DIR.mkdir(parents=True, exist_ok=True)

# Run-status surface: page footer reads this; launchd reads exit code.
RUN_STATUS_FILE = ROOT / "data" / "run_status.json"
RUN_STATUS_FILE.parent.mkdir(parents=True, exist_ok=True)

# NYSE 2026 holiday calendar (date strings YYYY-MM-DD, US-centric but good enough).
US_HOLIDAYS_2026 = {
    "2026-01-01", "2026-01-19", "2026-02-16", "2026-04-03", "2026-05-25",
    "2026-06-19", "2026-07-03", "2026-09-07", "2026-11-26", "2026-12-25",
}

FX_PAIRS = ["EUR", "GBP", "GBp", "JPY", "HKD", "KRW", "TWD", "INR",
            "SGD", "AUD", "IDR", "SEK", "DKK"]


def is_trading_day(today: dt.date) -> bool:
    if today.weekday() >= 5:  # Sat, Sun
        return False
    if today.isoformat() in US_HOLIDAYS_2026:
        return False
    return True


def fx_snapshot() -> dict[str, float]:
    rates = {"USD": 1.0}
    for ccy in FX_PAIRS:
        try:
            pair = f"USD{ccy}=X" if ccy != "GBp" else "USDGBP=X"
            h = yf.Ticker(pair).history(period="5d")
            if h.empty:
                continue
            rate = float(h["Close"].iloc[-1])
            if ccy == "GBp":
                rate = rate * 100  # pence per USD
            rates[ccy] = rate
        except Exception as e:
            print(f"[FX] {ccy}: {e}", file=sys.stderr)
    return rates


def to_usd(value: float | None, ccy: str | None, rates: dict[str, float]) -> float | None:
    if value is None or ccy is None:
        return None
    rate = rates.get(ccy)
    if rate is None or rate == 0:
        return None
    return value / rate


def fetch_one(symbol: str) -> dict:
    """Pull daily-fresh fields: price, 1Y return, P/E, shares, plus the
    multi-period momentum slices (3M / 6M / 9M / YTD / off-52w-high) the
    drawer's Momentum card needs. All slices come from the same single
    1Y-history HTTP call — no extra API budget."""
    out: dict = {"symbol": symbol, "ok": False, "err": None}
    try:
        tk = yf.Ticker(symbol)
        # Price + 1Y return from history (one HTTP call)
        h = tk.history(period="1y", auto_adjust=False)
        if h.empty:
            out["err"] = "empty history"
            return out
        last = float(h["Close"].iloc[-1])
        first = float(h["Close"].iloc[0])
        out["price_local"] = last
        out["one_yr_return_pct"] = (last / first - 1.0) * 100 if first else None
        prev = float(h["Close"].iloc[-2]) if len(h) >= 2 else None
        out["chg_1d_pct"] = (last / prev - 1.0) * 100 if prev else None

        # 3M / 6M / 9M = approx 63 / 126 / 189 trading days back.
        # If history is short (recent IPO etc.) the slice returns None and
        # the drawer renders "—" for that cell.
        n = len(h)
        def _ret_n_back(days: int) -> float | None:
            if n <= days:
                return None
            px_then = float(h["Close"].iloc[-1 - days])
            if not px_then:
                return None
            return (last / px_then - 1.0) * 100
        out["ret_3m_pct"] = _ret_n_back(63)
        out["ret_6m_pct"] = _ret_n_back(126)
        out["ret_9m_pct"] = _ret_n_back(189)

        # YTD: rebase to first close of the current calendar year.
        try:
            year = h.index[-1].year
            ytd_slice = h[h.index.year == year]
            if len(ytd_slice) > 0:
                ytd_open = float(ytd_slice["Close"].iloc[0])
                out["ytd_return_pct"] = (last / ytd_open - 1.0) * 100 if ytd_open else None
            else:
                out["ytd_return_pct"] = None
        except Exception:
            out["ytd_return_pct"] = None

        # Off-52w-high: distance below the trailing-year high. Always <= 0
        # for a stock making new highs (we report 0%, not +0.x noise).
        try:
            high_52w = float(h["High"].max()) if "High" in h.columns else float(h["Close"].max())
            out["off_52w_high_pct"] = (last / high_52w - 1.0) * 100 if high_52w else None
        except Exception:
            out["off_52w_high_pct"] = None

        # Shares + PE from fast_info first (lighter), fall back to .info
        fi = tk.fast_info
        shares = getattr(fi, "shares", None) or fi.get("shares") if hasattr(fi, "get") else None
        pe = None
        try:
            info = tk.info or {}
            shares = shares or info.get("sharesOutstanding")
            pe = info.get("trailingPE")
        except Exception:
            info = {}

        out["shares_outstanding"] = shares
        out["pe_ttm"] = pe
        out["ok"] = True
    except Exception as e:
        out["err"] = str(e)[:120]
    return out


def write_run_status(job: str, public_count: int, ok: int, fail: int,
                     fail_symbols: list[str]) -> bool:
    """Update run_status.json with the latest fetch outcome. Returns True if
    fail rate is within threshold."""
    now = dt.datetime.now(dt.timezone.utc).isoformat()
    fail_pct = (fail / public_count * 100) if public_count else 0
    healthy = fail_pct <= FAIL_THRESHOLD_PCT
    status: dict = {}
    if RUN_STATUS_FILE.exists():
        try:
            status = json.loads(RUN_STATUS_FILE.read_text())
        except Exception:
            status = {}
    job_status = status.get(job, {})
    job_status.update({
        "last_run_at": now,
        "ok_count": ok,
        "fail_count": fail,
        "public_count": public_count,
        "fail_pct": round(fail_pct, 2),
        "fail_symbols": fail_symbols[:30],
        "partial": fail > 0,
        "healthy": healthy,
    })
    if healthy:
        job_status["last_success_at"] = now
    status[job] = job_status
    RUN_STATUS_FILE.write_text(json.dumps(status, indent=2))
    return healthy


def fetch_one_with_retries(symbol: str) -> dict:
    """Wrap fetch_one with bounded retries on transient errors. 'empty history'
    is treated as a permanent failure (likely delisted) and skips retry to
    keep wall time bounded."""
    last_res: dict | None = None
    for attempt in range(MAX_RETRIES + 1):
        res = fetch_one(symbol)
        if res.get("ok"):
            return res
        last_res = res
        err = res.get("err") or ""
        if err.startswith("empty history"):
            return res
        if attempt >= MAX_RETRIES:
            break
        delay = RETRY_BACKOFF_S[attempt]
        print(f"  [RETRY] {symbol} ({err[:60]}) — sleeping {delay}s")
        time.sleep(delay)
    return last_res or {"symbol": symbol, "ok": False, "err": "unknown"}


def load_embed() -> dict:
    return json.loads(EMBED.read_text())


def save_embed(embed: dict) -> None:
    EMBED.write_text(json.dumps(embed, separators=(",", ":")))


def main() -> int:
    today = dt.date.today()
    if not is_trading_day(today):
        print(f"[SKIP] {today} is not a trading day")
        return 0

    if not EMBED.exists():
        sys.exit("financials_embed.json missing — run fetch_fundamentals.py first")
    if not TICKERS.exists():
        sys.exit("tickers.json missing")

    entries = json.loads(TICKERS.read_text())
    live = [e for e in entries if not e.get("private")]
    print(f"[LOAD] {len(live)} live tickers, {len(entries) - len(live)} private (skipped)")

    print("[FX] snapshot...")
    rates = fx_snapshot()
    print(f"[FX] {len(rates)} pairs")

    embed = load_embed()
    by_sym = embed.get("by_symbol", {})

    ok = 0
    fail = 0
    failures = []
    t0 = time.time()

    for i, entry in enumerate(live, 1):
        sym = entry["symbol"]
        res = fetch_one_with_retries(sym)
        if not res["ok"]:
            fail += 1
            failures.append((sym, res.get("err", "unknown")))
            continue
        ok += 1
        ccy = by_sym.get(sym, {}).get("currency")
        mcap_local = None
        if res.get("shares_outstanding") and res.get("price_local"):
            mcap_local = res["shares_outstanding"] * res["price_local"]
        mcap_usd = to_usd(mcap_local, ccy, rates) if mcap_local else None

        rec = by_sym.setdefault(sym, {})
        rec["price_local"] = res["price_local"]
        if mcap_usd is not None:
            rec["market_cap_usd"] = mcap_usd
        rec["pe_ttm"] = res["pe_ttm"]
        rec["one_yr_return_pct"] = res["one_yr_return_pct"]
        rec["chg_1d_pct"] = res.get("chg_1d_pct")
        # Daily-refreshed Momentum-card fields. Only overwrite when present,
        # so a missing slice (short history) preserves whatever fundamentals
        # last computed.
        for k in ("ret_3m_pct", "ret_6m_pct", "ret_9m_pct",
                  "ytd_return_pct", "off_52w_high_pct"):
            v = res.get(k)
            if v is not None:
                rec[k] = v

        if i % 30 == 0:
            print(f"  ... {i}/{len(live)} ({ok} ok, {fail} fail)")
        time.sleep(0.4)

    embed["fetched_at"] = dt.datetime.now(dt.timezone.utc).isoformat()
    embed["daily_refreshed_at"] = embed["fetched_at"]
    embed["counts"] = {
        **embed.get("counts", {}),
        "daily_ok": ok,
        "daily_fail": fail,
    }
    save_embed(embed)

    # Append to daily log
    log_header = not LOG.exists()
    with LOG.open("a") as f:
        if log_header:
            f.write("date,ok,fail,fail_symbols\n")
        fails_str = ";".join(s for s, _ in failures)
        f.write(f"{today.isoformat()},{ok},{fail},{fails_str}\n")

    # Stage-1 history snapshot — flatten by_symbol dict to a parquet row-table
    # so it joins cleanly with weekly fundamentals snapshots in DuckDB later.
    try:
        import pandas as pd
        rows = [{"symbol": s, **rec} for s, rec in by_sym.items()]
        df = pd.DataFrame(rows)
        snap_path = SNAPSHOT_PRICES_DIR / f"{today.isoformat()}.parquet"
        df.to_parquet(snap_path, index=False)
        print(f"[HISTORY] snapshot -> {snap_path.relative_to(ROOT)} ({len(rows)} rows)")
    except Exception as e:  # noqa: BLE001
        print(f"[HISTORY] snapshot skipped: {e}", file=sys.stderr)

    dur = time.time() - t0
    print(f"[DONE] {ok} ok, {fail} fail in {dur:.1f}s")
    if failures[:5]:
        print("[FAILURES] sample:", failures[:5])

    # Run-status surface (page reads, launchd reads exit code)
    healthy = write_run_status(
        job="prices",
        public_count=len(live),
        ok=ok,
        fail=fail,
        fail_symbols=[s for s, _ in failures],
    )

    # Re-bake HTML
    bake_path = ROOT / "bake_financials.py"
    if bake_path.exists():
        print("[BAKE] running bake_financials.py...")
        import subprocess
        r = subprocess.run([sys.executable, str(bake_path)], capture_output=True, text=True)
        print(r.stdout)
        if r.returncode != 0:
            print(r.stderr, file=sys.stderr)
            return r.returncode

    if not healthy:
        print(f"[UNHEALTHY] fail rate above {FAIL_THRESHOLD_PCT}% — exiting non-zero",
              file=sys.stderr)
        return 3

    return 0


if __name__ == "__main__":
    sys.exit(main())
