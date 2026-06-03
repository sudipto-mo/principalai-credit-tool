#!/usr/bin/env bash
# Always bind dev to 8080: free the port first (stale Next.js / other listeners).
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Some environments (certain sandboxes / file watcher backends) can hit Watchpack EMFILE errors.
# Polling is slower but far more robust and avoids exhausting watch handles.
export WATCHPACK_POLLING="${WATCHPACK_POLLING:-true}"

USE_TURBO=0
CLEAN=0
for arg in "$@"; do
  case "$arg" in
    --turbo|--turbopack) USE_TURBO=1 ;;
    --clean) CLEAN=1 ;;
    --webpack) USE_TURBO=0 ;;
  esac
done

if [[ "$CLEAN" == "1" ]]; then
  echo "Removing .next cache…"
  rm -rf .next
fi

pids_for_port() {
  lsof -tiTCP:8080 -sTCP:LISTEN 2>/dev/null || true
}

PIDS=$(pids_for_port)
if [[ -n "$PIDS" ]]; then
  echo "Freeing port 8080…"
  kill -TERM $PIDS 2>/dev/null || true
  sleep 0.5
  PIDS=$(pids_for_port)
  if [[ -n "$PIDS" ]]; then
    kill -KILL $PIDS 2>/dev/null || true
    sleep 0.2
  fi
fi

# Webpack dev is the default — Turbopack HMR can corrupt .next manifests on this repo.
# Use: npm run dev:turbo  (opt-in)  |  npm run dev:clean  (fresh .next + webpack)
if [[ "$USE_TURBO" == "1" ]]; then
  exec ./node_modules/.bin/next dev --turbopack -H 0.0.0.0 -p 8080
else
  exec ./node_modules/.bin/next dev -H 0.0.0.0 -p 8080
fi
