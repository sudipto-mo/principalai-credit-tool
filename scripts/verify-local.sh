#!/usr/bin/env bash
# Smoke-check local dev — run while npm run dev is up on 8080.
set -euo pipefail
BASE="${1:-http://localhost:8080}"

fail=0
check() {
  local path="$1"
  local needle="$2"
  local code
  code=$(curl -s -o /tmp/dorrsum-check.html -w "%{http_code}" "${BASE}${path}")
  if [[ "$code" != "200" ]]; then
    echo "FAIL ${path} — HTTP ${code}"
    fail=1
    return
  fi
  if ! grep -q "$needle" /tmp/dorrsum-check.html; then
    echo "FAIL ${path} — missing: ${needle}"
    fail=1
    return
  fi
  echo "OK   ${path}"
}

echo "Checking ${BASE}…"
check "/" "Financial Modelling"
check "/" "How We Value"
check "/research" "TMT"

if [[ "$fail" != "0" ]]; then
  echo ""
  echo "Dev may be broken. Try: npm run dev:clean"
  exit 1
fi
echo "All checks passed."
