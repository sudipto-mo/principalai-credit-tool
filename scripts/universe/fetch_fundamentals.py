#!/usr/bin/env python3
"""
fetch_fundamentals.py
---------------------
Pulls key financial metrics for every public ticker in tickers.json via yfinance,
normalises foreign-currency figures to USD using a snapshot FX pull, caches raw
responses, and emits three output files (parquet, xlsx, json) plus a failure log.

Usage:
    python fetch_fundamentals.py                  # fresh run if cache > 24h old
    python fetch_fundamentals.py --force          # always hit Yahoo
    python fetch_fundamentals.py --tickers NVDA,AMD  # refresh only those names

Outputs (written next to this script):
    universe_financials.parquet   — full dataset, binary
    universe_financials.xlsx      — sortable research workbook
    universe_financials.json      — shaped { BY_SYMBOL: {...}, METADATA: {...} }
    failure_log.csv               — tickers that failed with reason
    cache/raw/<SYMBOL>.json       — per-ticker raw snapshot
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import traceback
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import pandas as pd
import yfinance as yf

ROOT = Path(__file__).parent.resolve()
TICKERS_FILE = ROOT / "tickers.json"
CACHE_DIR = ROOT / "cache" / "raw"
CACHE_DIR.mkdir(parents=True, exist_ok=True)
FX_CACHE = ROOT / "cache" / "fx_snapshot.json"
FX_CACHE.parent.mkdir(parents=True, exist_ok=True)

OUT_PARQUET = ROOT / "universe_financials.parquet"
OUT_XLSX = ROOT / "universe_financials.xlsx"
OUT_JSON = ROOT / "universe_financials.json"
FAIL_LOG = ROOT / "failure_log.csv"

# Slim embed (HTML reads this). Weekly fundamentals merges in factor fields;
# fetch_prices.py patches daily-fresh fields. Last writer wins per field, with
# `if val is not None` guards so a missing value never clobbers a present one.
EMBED_FILE = ROOT / "financials_embed.json"

# Stage-1 history: one parquet snapshot per weekly fetch. Append-only, never
# overwritten — a year of weekly fundamentals = ~52 files × 50KB ≈ 2.5MB.
# When score engine + backtest go live, these files roll up into DuckDB.
SNAPSHOT_FUNDAMENTALS_DIR = ROOT / "data" / "snapshots" / "fundamentals"
SNAPSHOT_FUNDAMENTALS_DIR.mkdir(parents=True, exist_ok=True)

# Run-status surface: page footer reads this; launchd reads exit code.
RUN_STATUS_FILE = ROOT / "data" / "run_status.json"
RUN_STATUS_FILE.parent.mkdir(parents=True, exist_ok=True)

CACHE_TTL_HOURS = 24
BATCH_SIZE = 30
BATCH_SLEEP_SECONDS = 0.5

# Retry behaviour for per-ticker yfinance failures. Yahoo rate-limits IPs
# semi-randomly; a short retry window absorbs most of it without ballooning
# wall time on real failures (delisted symbols, wrong suffix, etc.)
MAX_RETRIES = 2
RETRY_BACKOFF_S = (5, 15)  # delay before retry 1 / before retry 2

# Bumped when the cached payload schema changes. fetch_one() ignores caches
# below the current version so a stale cache never silently masks a missing
# field. Bump this whenever you add new payload["_..."] entries.
CACHE_SCHEMA_VERSION = 2

# Run fails non-zero if more than this fraction of public tickers error out.
# Tuned to absorb routine Yahoo outages (~5%) while surfacing real breakage.
FAIL_THRESHOLD_PCT = 20

# Currencies we may need to convert to USD. USD stays at 1.0.
# CNY added in Phase 4.3 — Chinese ADRs (BABA, BIDU) report financials in
# CNY even though they trade in USD; without this, balance-sheet conversion
# silently dropped to None.
FX_PAIRS = {
    "EUR": "EURUSD=X", "GBP": "GBPUSD=X", "JPY": "JPYUSD=X", "HKD": "HKDUSD=X",
    "KRW": "KRWUSD=X", "TWD": "TWDUSD=X", "INR": "INRUSD=X", "SGD": "SGDUSD=X",
    "AUD": "AUDUSD=X", "IDR": "IDRUSD=X", "SEK": "SEKUSD=X", "DKK": "DKKUSD=X",
    "CNY": "CNYUSD=X",
    # LSE sometimes quotes in GBp (pence) — handled per-ticker below
}

# Columns we want in the output workbook. Factor-card additions follow the
# six factors enumerated in the drawer's METRIC_SCHEMA (Value / Growth /
# Profitability / Momentum / EPS Revisions / Financial Strength). EPS Revisions
# fields are placeholders for Phase 3 (analyst-revision pipeline).
OUT_COLUMNS = [
    "symbol", "name", "exchange", "country", "currency", "band", "subnode",
    "subnode_title", "held", "data_status",
    "price_local", "market_cap_usd", "ev_usd", "shares_out",
    "revenue_ttm_usd", "ebitda_ttm_usd", "fcf_ttm_usd", "net_debt_usd", "cash_usd",
    "gross_margin", "op_margin", "ebitda_margin", "fcf_yield_pct",
    "roe_pct", "roic_pct",
    "rev_growth_yoy_pct", "eps_yoy_pct", "fcf_yoy_pct",
    "rev_3y_cagr_pct", "eps_3y_cagr_pct",
    "pe_ttm", "fwd_pe", "ev_revenue", "ev_ebitda", "peg", "pb", "ps",
    "net_debt_ebitda", "int_coverage", "current_ratio", "debt_equity",
    "div_yield_pct", "beta",
    "price_52w_high", "price_52w_low", "off_52w_high_pct",
    "ret_3m_pct", "ret_6m_pct", "ret_9m_pct", "ytd_return_pct", "one_yr_return_pct",
    "analyst_target_local", "analyst_rating", "adv_10d",
]

# Subset of OUT_COLUMNS that gets merged into the slim HTML embed. Excludes
# heavy/analytical-only fields (ev_usd, shares_out, beta, adv_10d, 52w high/low
# absolutes, etc.) but keeps everything the drawer's six factor cards need.
EMBED_FIELDS = [
    # Classification (static — from roster)
    "name", "band", "subnode", "subnode_title", "held",
    # Market data
    "currency", "exchange", "data_status",
    "price_local", "market_cap_usd",
    "pe_ttm", "fwd_pe", "ev_ebitda", "peg", "pb", "ps",
    "rev_growth_yoy_pct", "eps_yoy_pct", "fcf_yoy_pct",
    "rev_3y_cagr_pct", "eps_3y_cagr_pct",
    "gross_margin", "op_margin", "ebitda_margin",
    "roe_pct", "roic_pct", "fcf_yield_pct",
    "ret_3m_pct", "ret_6m_pct", "ret_9m_pct",
    "ytd_return_pct", "one_yr_return_pct", "off_52w_high_pct",
    "net_debt_usd", "cash_usd", "net_debt_ebitda",
    "int_coverage", "current_ratio", "debt_equity",
]

# Yahoo occasionally reports dividendYield as a fraction (0.023) and sometimes as
# a percent (2.3). Normalise to percent.
def _as_pct(x: Any) -> float | None:
    if x is None:
        return None
    try:
        v = float(x)
    except (TypeError, ValueError):
        return None
    # If < 1 assume fraction, else already pct (heuristic matches yfinance quirks)
    return v * 100 if abs(v) < 1 else v


def _safe(d: dict, *keys, default=None):
    for k in keys:
        if k in d and d[k] is not None:
            return d[k]
    return default


def _to_float(x: Any) -> float | None:
    """Robust float coercion that filters NaN/inf — yfinance returns these as
    real Python floats which silently break downstream math."""
    if x is None:
        return None
    try:
        v = float(x)
    except (TypeError, ValueError):
        return None
    if v != v:  # NaN
        return None
    if v in (float("inf"), float("-inf")):
        return None
    return v


def _serialize_yf_df(df: Any) -> dict | None:
    """Turn a yfinance financial-statement DataFrame into a JSON-cacheable dict.
    Columns are date-stamped strings (newest-first per yfinance convention);
    rows are line-item names → list of values aligned to columns."""
    if df is None:
        return None
    try:
        if df.empty:
            return None
    except Exception:
        return None
    cols: list[str] = []
    for c in df.columns:
        try:
            cols.append(c.isoformat() if hasattr(c, "isoformat") else str(c))
        except Exception:
            cols.append(str(c))
    rows: dict[str, list[Any]] = {}
    for idx in df.index:
        try:
            vals = df.loc[idx].tolist()
            rows[str(idx)] = [None if (isinstance(v, float) and v != v) else v for v in vals]
        except Exception:
            continue
    return {"columns": cols, "rows": rows}


def _stmt_row(stmt: dict | None, *names: str) -> list[float | None] | None:
    """Pull a row by case-insensitive name match. Returns OLDEST-FIRST list."""
    if not stmt or "rows" not in stmt:
        return None
    rows = stmt["rows"]
    target = None
    lc_names = [n.strip().lower() for n in names]
    for key in rows:
        if str(key).strip().lower() in lc_names:
            target = rows[key]
            break
    if target is None:
        return None
    # yfinance returns columns newest-first → reverse so [0] is oldest
    return [_to_float(v) for v in reversed(target)]


def _compute_cagr_pct(series: list[float | None] | None, n_years: int) -> float | None:
    """CAGR over the last n_years given oldest-first series. Needs n_years+1
    valid points. Returns percent (e.g. 18.0 for 18%/yr)."""
    if not series or len(series) < n_years + 1:
        return None
    oldest = series[-(n_years + 1)]
    newest = series[-1]
    if oldest is None or newest is None or oldest <= 0 or newest <= 0:
        return None
    return ((newest / oldest) ** (1.0 / n_years) - 1.0) * 100.0


def _compute_yoy_pct(series: list[float | None] | None) -> float | None:
    """YoY = (latest / prior - 1) * 100 from oldest-first series."""
    if not series or len(series) < 2:
        return None
    prior = series[-2]
    latest = series[-1]
    if prior is None or latest is None or prior == 0:
        return None
    return (latest / prior - 1.0) * 100.0


def load_tickers() -> list[dict]:
    if not TICKERS_FILE.exists():
        sys.exit(f"Missing {TICKERS_FILE} — run the extractor first.")
    with TICKERS_FILE.open() as f:
        return json.load(f)


def fx_snapshot(force: bool) -> dict[str, float]:
    """Return {currency_code: to_usd_multiplier}. USD fixed at 1.0."""
    if FX_CACHE.exists() and not force:
        age = datetime.now(timezone.utc) - datetime.fromtimestamp(
            FX_CACHE.stat().st_mtime, tz=timezone.utc
        )
        if age < timedelta(hours=CACHE_TTL_HOURS):
            with FX_CACHE.open() as f:
                data = json.load(f)
                print(f"[FX] Using cached snapshot from {data.get('fetched_at')}")
                return data["rates"]

    print("[FX] Fetching live FX snapshot...")
    rates: dict[str, float] = {"USD": 1.0}
    for ccy, pair in FX_PAIRS.items():
        try:
            t = yf.Ticker(pair)
            hist = t.history(period="5d", interval="1d")
            if len(hist) == 0:
                raise RuntimeError("empty history")
            rate = float(hist["Close"].iloc[-1])
            rates[ccy] = rate
        except Exception as e:  # noqa: BLE001
            print(f"  [FX] {ccy} failed: {e}")
            rates[ccy] = None  # flag so we can mark affected tickers

    with FX_CACHE.open("w") as f:
        json.dump(
            {"fetched_at": datetime.now(timezone.utc).isoformat(), "rates": rates},
            f, indent=2,
        )
    return rates


def load_cached_raw(symbol: str) -> dict | None:
    p = CACHE_DIR / f"{symbol}.json"
    if not p.exists():
        return None
    age = datetime.now(timezone.utc) - datetime.fromtimestamp(
        p.stat().st_mtime, tz=timezone.utc
    )
    if age >= timedelta(hours=CACHE_TTL_HOURS):
        return None
    with p.open() as f:
        cached = json.load(f)
    if cached.get("_schema_version") != CACHE_SCHEMA_VERSION:
        return None
    return cached


def save_cached_raw(symbol: str, payload: dict) -> None:
    p = CACHE_DIR / f"{symbol}.json"
    # Strip non-serialisable bits defensively
    clean = {k: v for k, v in payload.items() if isinstance(v, (str, int, float, bool, list, dict, type(None)))}
    with p.open("w") as f:
        json.dump(clean, f, indent=2, default=str)


def fetch_one(symbol: str, force: bool) -> tuple[dict | None, str | None]:
    """Return (info_dict, error_or_None). info_dict carries .info + history summary."""
    if not force:
        cached = load_cached_raw(symbol)
        if cached is not None:
            return cached, None

    try:
        tk = yf.Ticker(symbol)
        info = tk.info or {}
        if not info or info.get("regularMarketPrice") is None and info.get("currentPrice") is None:
            # yfinance sometimes returns an empty dict for delisted / wrong tickers
            return None, "empty info (delisted / wrong suffix?)"

        # Pull 1Y+YTD history for return calc
        hist = tk.history(period="1y", interval="1d")
        if len(hist) > 0:
            px_now = float(hist["Close"].iloc[-1])
            px_year_ago = float(hist["Close"].iloc[0])
            one_yr_return = (px_now / px_year_ago - 1) * 100 if px_year_ago else None
            # YTD
            hist_ytd = hist[hist.index.year == hist.index[-1].year]
            if len(hist_ytd) > 0:
                ytd_open = float(hist_ytd["Close"].iloc[0])
                ytd_return = (px_now / ytd_open - 1) * 100 if ytd_open else None
            else:
                ytd_return = None
        else:
            one_yr_return = None
            ytd_return = None

        payload = dict(info)
        payload["_one_yr_return_pct"] = one_yr_return
        payload["_ytd_return_pct"] = ytd_return

        # Multi-period momentum slices from the 1Y history we already have.
        # 3M ~= 63 trading days, 6M ~= 126, 9M ~= 189. If the series is shorter
        # (recent IPO etc.) just leave the corresponding slice null.
        try:
            n = len(hist)
            px_now = float(hist["Close"].iloc[-1])
            def _ret_n_back(days: int) -> float | None:
                if n <= days:
                    return None
                px_then = float(hist["Close"].iloc[-1 - days])
                if not px_then:
                    return None
                return (px_now / px_then - 1) * 100
            payload["_ret_3m_pct"] = _ret_n_back(63)
            payload["_ret_6m_pct"] = _ret_n_back(126)
            payload["_ret_9m_pct"] = _ret_n_back(189)
            high_52w = float(hist["High"].max()) if "High" in hist.columns else float(hist["Close"].max())
            payload["_off_52w_high_pct"] = (px_now / high_52w - 1) * 100 if high_52w else None
        except Exception:
            payload["_ret_3m_pct"] = None
            payload["_ret_6m_pct"] = None
            payload["_ret_9m_pct"] = None
            payload["_off_52w_high_pct"] = None

        # Pull annual financial statements for CAGR / interest-coverage math.
        # These add ~2 HTTP calls per ticker → triples wall time for full runs;
        # acceptable on weekly cadence. Cached to disk.
        try:
            payload["_income_stmt"] = _serialize_yf_df(tk.income_stmt)
        except Exception:
            payload["_income_stmt"] = None
        try:
            payload["_cashflow"] = _serialize_yf_df(tk.cashflow)
        except Exception:
            payload["_cashflow"] = None

        payload["_fetched_at"] = datetime.now(timezone.utc).isoformat()
        payload["_schema_version"] = CACHE_SCHEMA_VERSION

        save_cached_raw(symbol, payload)
        return payload, None

    except Exception as e:  # noqa: BLE001
        return None, f"{type(e).__name__}: {e}"


def fetch_with_retries(symbol: str, force: bool) -> tuple[dict | None, str | None]:
    """Wrap fetch_one with bounded retries. Yfinance rate-limits roughly 1-3%
    of calls during US market hours; one short retry catches almost all of
    them. Real failures (delisted / wrong suffix / empty info) fail fast on
    the first attempt and the retries don't help — so we only retry on
    exception-shaped errors, not on the 'empty info' soft-fail."""
    last_err: str | None = None
    for attempt in range(MAX_RETRIES + 1):
        info, err = fetch_one(symbol, force)
        if not err:
            return info, None
        last_err = err
        # Don't retry the structural soft-fail; those are deterministic.
        if err.startswith("empty info"):
            return None, err
        if attempt >= MAX_RETRIES:
            break
        delay = RETRY_BACKOFF_S[attempt]
        print(f"  [RETRY] {symbol} ({err[:60]}) — sleeping {delay}s")
        time.sleep(delay)
    return None, last_err


def to_usd(value: float | None, currency: str | None, rates: dict[str, float]) -> float | None:
    if value is None or currency is None:
        return None
    # LSE: yfinance reports in pence for GBX tickers. We keep price_local raw, but
    # market_cap etc. arrive in GBP regardless — no adjustment needed.
    rate = rates.get(currency)
    if rate is None:
        return None
    return float(value) * rate


def build_record(entry: dict, info: dict | None, err: str | None, rates: dict[str, float]) -> dict:
    rec: dict[str, Any] = {
        "symbol": entry["symbol"], "name": entry["name"],
        "exchange": entry["exchange"], "country": entry["country"],
        "currency": entry["currency"], "band": entry["band"],
        "subnode": entry["subnode"], "subnode_title": entry["subnode_title"],
        "held": entry["held"],
    }
    for c in OUT_COLUMNS:
        rec.setdefault(c, None)

    if entry.get("private"):
        rec["data_status"] = "private"
        return rec
    if info is None:
        rec["data_status"] = f"missing: {err}"
        return rec

    # Phase 4.3: ADRs (e.g. TSM, BABA, BIDU) report price in USD but
    # financial statements in the home currency (TWD, CNY, etc.). yfinance
    # exposes both as info["currency"] and info["financialCurrency"].
    #   - currency       → applies to: price, marketCap, EV (price-derived)
    #   - financialCurrency → applies to: revenue, ebitda, fcf, debt, cash
    # Treat them the same when only `currency` is present (native listings).
    ccy = info.get("currency") or entry.get("currency") or "USD"
    fin_ccy = info.get("financialCurrency") or ccy
    rec["currency"] = ccy

    price_local = _safe(info, "currentPrice", "regularMarketPrice", "previousClose")
    mcap = _safe(info, "marketCap")
    ev = _safe(info, "enterpriseValue")
    debt = _safe(info, "totalDebt")
    cash = _safe(info, "totalCash")
    net_debt = (debt or 0) - (cash or 0) if (debt is not None or cash is not None) else None
    revenue = _safe(info, "totalRevenue")
    ebitda = _safe(info, "ebitda")
    fcf = _safe(info, "freeCashflow")

    rec["price_local"] = price_local
    # Price-derived → use `currency`
    rec["market_cap_usd"] = to_usd(mcap, ccy, rates)
    rec["ev_usd"] = to_usd(ev, ccy, rates)
    # Statement-derived → use `financialCurrency`
    rec["net_debt_usd"] = to_usd(net_debt, fin_ccy, rates) if net_debt is not None else None
    rec["revenue_ttm_usd"] = to_usd(revenue, fin_ccy, rates)
    rec["ebitda_ttm_usd"] = to_usd(ebitda, fin_ccy, rates)
    rec["fcf_ttm_usd"] = to_usd(fcf, fin_ccy, rates)
    rec["shares_out"] = _safe(info, "sharesOutstanding")

    rec["gross_margin"] = _as_pct(_safe(info, "grossMargins"))
    rec["op_margin"] = _as_pct(_safe(info, "operatingMargins"))
    rec["ebitda_margin"] = _as_pct(_safe(info, "ebitdaMargins"))
    rec["rev_growth_yoy_pct"] = _as_pct(_safe(info, "revenueGrowth"))
    rec["pe_ttm"] = _to_float(_safe(info, "trailingPE"))
    rec["fwd_pe"] = _to_float(_safe(info, "forwardPE"))
    rec["ev_revenue"] = _to_float(_safe(info, "enterpriseToRevenue"))
    rec["ev_ebitda"] = _to_float(_safe(info, "enterpriseToEbitda"))
    rec["div_yield_pct"] = _as_pct(_safe(info, "dividendYield"))
    rec["beta"] = _to_float(_safe(info, "beta"))
    rec["price_52w_high"] = _to_float(_safe(info, "fiftyTwoWeekHigh"))
    rec["price_52w_low"] = _to_float(_safe(info, "fiftyTwoWeekLow"))
    rec["ytd_return_pct"] = info.get("_ytd_return_pct")
    rec["one_yr_return_pct"] = info.get("_one_yr_return_pct")
    rec["analyst_target_local"] = _safe(info, "targetMeanPrice")
    rec["analyst_rating"] = _safe(info, "recommendationKey")
    rec["adv_10d"] = _safe(info, "averageDailyVolume10Day")

    # ---- VALUE additions ----
    rec["peg"] = _to_float(_safe(info, "trailingPegRatio", "pegRatio"))
    rec["pb"] = _to_float(_safe(info, "priceToBook"))
    rec["ps"] = _to_float(_safe(info, "priceToSalesTrailing12Months"))

    # ---- GROWTH additions ----
    # earningsGrowth from Yahoo is a fraction (0.19 = 19%); _as_pct normalises.
    rec["eps_yoy_pct"] = _as_pct(_safe(info, "earningsGrowth"))

    inc_stmt = info.get("_income_stmt")
    cf_stmt = info.get("_cashflow")
    rev_series = _stmt_row(inc_stmt, "Total Revenue", "TotalRevenue")
    eps_series = _stmt_row(inc_stmt, "Basic EPS", "Diluted EPS", "BasicEPS", "DilutedEPS")
    fcf_series = _stmt_row(cf_stmt, "Free Cash Flow", "FreeCashFlow")
    ebit_series = _stmt_row(inc_stmt, "EBIT")
    int_exp_series = _stmt_row(inc_stmt, "Interest Expense", "InterestExpense")

    # 3-year CAGR needs 4 valid annual points; YoY needs 2.
    rec["rev_3y_cagr_pct"] = _compute_cagr_pct(rev_series, 3)
    rec["eps_3y_cagr_pct"] = _compute_cagr_pct(eps_series, 3)
    rec["fcf_yoy_pct"] = _compute_yoy_pct(fcf_series)

    # ---- PROFITABILITY additions ----
    # ROE/ROA come from yfinance as a fraction (NVDA returns 1.01 for 101% ROE).
    # _as_pct's heuristic breaks for high-return names where the fraction
    # crosses 1.0 — force the multiplier here since these are KNOWN to be
    # fraction-encoded.
    roe_raw = _to_float(_safe(info, "returnOnEquity"))
    rec["roe_pct"] = roe_raw * 100 if roe_raw is not None else None
    roa_raw = _to_float(_safe(info, "returnOnAssets"))
    roa_pct = roa_raw * 100 if roa_raw is not None else None
    # ROIC isn't in .info; approximate via ROA × leverage proxy. The ×1.4
    # factor is a rough multiplier matching observed ROIC≈ROA×(1+D/E·(1-t))
    # on a sample; acceptable Phase-1 placeholder, replaced when score engine
    # builds the proper NOPAT / invested-capital calc.
    rec["roic_pct"] = roa_pct * 1.4 if roa_pct is not None else None

    # ---- MOMENTUM additions ----
    rec["ret_3m_pct"] = info.get("_ret_3m_pct")
    rec["ret_6m_pct"] = info.get("_ret_6m_pct")
    rec["ret_9m_pct"] = info.get("_ret_9m_pct")
    rec["off_52w_high_pct"] = info.get("_off_52w_high_pct")

    # ---- FINANCIAL STRENGTH additions ----
    # totalCash comes from the balance sheet → use financialCurrency.
    cash_local = _safe(info, "totalCash")
    rec["cash_usd"] = to_usd(cash_local, fin_ccy, rates)
    rec["current_ratio"] = _safe(info, "currentRatio")
    # debtToEquity arrives as a percent-ish number (34.0 for 34%) — keep raw.
    rec["debt_equity"] = _safe(info, "debtToEquity")
    if ebit_series and int_exp_series:
        latest_ebit = ebit_series[-1]
        latest_int = int_exp_series[-1]
        if latest_ebit is not None and latest_int is not None and abs(latest_int) > 0:
            rec["int_coverage"] = latest_ebit / abs(latest_int)

    # Derived ratios
    if rec["net_debt_usd"] is not None and rec["ebitda_ttm_usd"]:
        rec["net_debt_ebitda"] = rec["net_debt_usd"] / rec["ebitda_ttm_usd"]
    if rec["fcf_ttm_usd"] and rec["market_cap_usd"]:
        rec["fcf_yield_pct"] = rec["fcf_ttm_usd"] / rec["market_cap_usd"] * 100

    rec["data_status"] = "ok"
    return rec


def write_run_status(job: str, public_count: int, ok: int, fail: int,
                     fail_symbols: list[str]) -> bool:
    """Update run_status.json with the latest fetch outcome. Returns True if
    the run is considered healthy (fail rate <= threshold)."""
    now = datetime.now(timezone.utc).isoformat()
    fail_pct = (fail / public_count * 100) if public_count else 0
    healthy = fail_pct <= FAIL_THRESHOLD_PCT
    status = {}
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
        "fail_symbols": fail_symbols[:30],  # cap to keep file small
        "partial": fail > 0,
        "healthy": healthy,
    })
    if healthy:
        job_status["last_success_at"] = now
    status[job] = job_status
    RUN_STATUS_FILE.write_text(json.dumps(status, indent=2))
    return healthy


def merge_into_embed(records: list[dict]) -> dict:
    """Merge factor fields from this run's records into financials_embed.json,
    preserving daily-fresh values (price_local, pe_ttm, etc.) that fetch_prices
    writes between weekly fundamentals runs. Returns the resulting embed dict."""
    if EMBED_FILE.exists():
        with EMBED_FILE.open() as f:
            embed = json.load(f)
    else:
        embed = {"by_symbol": {}, "counts": {}}
    by_sym = embed.setdefault("by_symbol", {})

    for r in records:
        sym = r["symbol"]
        existing = by_sym.setdefault(sym, {})
        # Keep `data_status` policy: private wins; otherwise live record wins.
        if r.get("data_status") == "private":
            existing["data_status"] = "private"
            existing["currency"] = None
            existing["exchange"] = r.get("exchange") or "Private"
            continue
        for field in EMBED_FIELDS:
            val = r.get(field)
            # If this record has no value, don't clobber whatever's there from
            # the previous fetch — keeps stale-but-real numbers visible until
            # the next successful pull.
            if val is None:
                continue
            existing[field] = val

    embed["fundamentals_refreshed_at"] = datetime.now(timezone.utc).isoformat()
    embed.setdefault("fetched_at", embed["fundamentals_refreshed_at"])
    embed["counts"] = {
        **embed.get("counts", {}),
        "total": len(records),
        "ok": sum(1 for r in records if r.get("data_status") == "ok"),
        "missing": sum(1 for r in records if str(r.get("data_status", "")).startswith("missing")),
        "private": sum(1 for r in records if r.get("data_status") == "private"),
    }
    with EMBED_FILE.open("w") as f:
        json.dump(embed, f, separators=(",", ":"))
    return embed


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="Ignore cache, always hit Yahoo")
    ap.add_argument("--tickers", type=str, default=None,
                    help="Comma-separated ticker subset to refresh")
    args = ap.parse_args()

    roster = load_tickers()
    print(f"[ROSTER] loaded {len(roster)} entries "
          f"(public={sum(1 for r in roster if not r['private'])}, "
          f"private={sum(1 for r in roster if r['private'])})")

    target_set = None
    if args.tickers:
        target_set = {t.strip() for t in args.tickers.split(",")}
        print(f"[ROSTER] filter: refreshing only {len(target_set)} tickers")

    rates = fx_snapshot(args.force)
    print(f"[FX] rates loaded: "
          + ", ".join(f"{k}={rates[k]:.6f}" if rates.get(k) else f"{k}=FAIL"
                      for k in sorted(rates)))

    # Fetch loop
    public = [r for r in roster if not r["private"]]
    if target_set is not None:
        public = [r for r in public if r["symbol"] in target_set]

    failures: list[tuple[str, str]] = []
    records: list[dict] = []

    print(f"[FETCH] starting {len(public)} public tickers in batches of {BATCH_SIZE}")
    for i in range(0, len(public), BATCH_SIZE):
        batch = public[i:i + BATCH_SIZE]
        for entry in batch:
            info, err = fetch_with_retries(entry["symbol"], args.force)
            if err:
                failures.append((entry["symbol"], err))
                records.append(build_record(entry, None, err, rates))
            else:
                records.append(build_record(entry, info, None, rates))
        print(f"  [BATCH] {min(i + BATCH_SIZE, len(public))}/{len(public)} done")
        time.sleep(BATCH_SLEEP_SECONDS)

    # Add private-company rows with blank financials
    for entry in roster:
        if entry["private"]:
            records.append(build_record(entry, None, None, rates))

    df = pd.DataFrame(records, columns=OUT_COLUMNS)

    # Sanitise any stray "Infinity"/"-Infinity" strings that yfinance can produce
    # via JSON round-trips — pyarrow refuses to cast these to double.
    for col in df.select_dtypes(include="object").columns:
        mask = df[col].isin(["Infinity", "-Infinity", "inf", "-inf", "NaN", "nan"])
        if mask.any():
            df.loc[mask, col] = None

    # ---- write parquet ----
    df.to_parquet(OUT_PARQUET, index=False)

    # ---- write XLSX ----
    with pd.ExcelWriter(OUT_XLSX, engine="openpyxl") as xw:
        df.to_excel(xw, index=False, sheet_name="Universe")

    # ---- write JSON (shaped for the HTML) ----
    by_symbol = {r["symbol"]: r for r in records}
    meta = {
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "fx": rates,
        "counts": {
            "total": len(records),
            "ok": sum(1 for r in records if r.get("data_status") == "ok"),
            "missing": sum(1 for r in records if str(r.get("data_status", "")).startswith("missing")),
            "private": sum(1 for r in records if r.get("data_status") == "private"),
        },
    }
    with OUT_JSON.open("w") as f:
        json.dump({"BY_SYMBOL": by_symbol, "METADATA": meta}, f, indent=2, default=str)

    # Merge slim factor fields into the embed file the HTML actually reads.
    # When --tickers is used we only update those rows (others preserved).
    embed = merge_into_embed(records)
    print(f"[EMBED] merged {len(records)} record(s) into {EMBED_FILE.name} "
          f"(ok={embed['counts'].get('ok',0)})")

    # Stage-1 history snapshot — point-in-time dump of this run's records.
    # Filename uses ISO-week to dedupe re-runs within the same week (overwrite
    # is intentional — the latest run that week is canonical).
    iso_year, iso_week, _ = datetime.now(timezone.utc).isocalendar()
    snap_path = SNAPSHOT_FUNDAMENTALS_DIR / f"{iso_year}-W{iso_week:02d}.parquet"
    df.to_parquet(snap_path, index=False)
    print(f"[HISTORY] snapshot -> {snap_path.relative_to(ROOT)}")

    # ---- failure log ----
    if failures:
        with FAIL_LOG.open("w") as f:
            f.write("symbol,reason\n")
            for sym, reason in failures:
                reason_clean = str(reason).replace('"', "'").replace("\n", " ")
                f.write(f'"{sym}","{reason_clean}"\n')
    elif FAIL_LOG.exists():
        FAIL_LOG.unlink()

    # ---- console summary ----
    print("\n=== SUMMARY ===")
    print(f"Total records : {len(records)}")
    print(f"OK            : {meta['counts']['ok']}")
    print(f"Missing       : {meta['counts']['missing']}")
    print(f"Private       : {meta['counts']['private']}")
    if failures:
        print("\nFailures:")
        for sym, reason in failures:
            print(f"  {sym}: {reason}")
    print(f"\nOutputs:")
    print(f"  {OUT_PARQUET}")
    print(f"  {OUT_XLSX}")
    print(f"  {OUT_JSON}")
    if failures:
        print(f"  {FAIL_LOG}")

    # ---- run status (page reads this; launchd reads exit code) ----
    healthy = write_run_status(
        job="fundamentals",
        public_count=len(public),
        ok=meta["counts"]["ok"],
        fail=meta["counts"]["missing"],
        fail_symbols=[s for s, _ in failures],
    )

    # ---- auto-bake ----
    bake_path = ROOT / "bake_financials.py"
    if bake_path.exists():
        print("\n[BAKE] running bake_financials.py...")
        import subprocess
        r = subprocess.run([sys.executable, str(bake_path)],
                           capture_output=True, text=True)
        print(r.stdout)
        if r.returncode != 0:
            print(r.stderr, file=sys.stderr)

    if not healthy:
        print(f"\n[UNHEALTHY] fail rate above {FAIL_THRESHOLD_PCT}% — exiting non-zero",
              file=sys.stderr)
        sys.exit(3)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n[INTERRUPTED]")
        sys.exit(1)
    except Exception:
        traceback.print_exc()
        sys.exit(2)
