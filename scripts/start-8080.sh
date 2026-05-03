#!/usr/bin/env bash
# Always bind start to 8080: free the port first (stale listeners).
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

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

exec ./node_modules/.bin/next start -H 0.0.0.0 -p 8080

