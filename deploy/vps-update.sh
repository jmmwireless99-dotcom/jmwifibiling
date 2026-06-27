#!/usr/bin/env bash
# Update JM Billing on Ubuntu VPS (jmwifi.pro)
# Run on the VPS inside your billing app folder:
#   bash deploy/vps-update.sh

set -euo pipefail

APP_DIR="${APP_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
BRANCH="${BRANCH:-main}"
SERVICE="${SERVICE:-jm-billing}"

echo "==> Updating JM Billing in $APP_DIR (branch: $BRANCH)"
cd "$APP_DIR"

if [ -d .git ]; then
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
else
  echo "ERROR: $APP_DIR is not a git repo."
  exit 1
fi

node --check server.js
node --check lib/kitifi.js 2>/dev/null || true
node --check lib/db.js

if command -v systemctl >/dev/null 2>&1 && systemctl is-active --quiet "$SERVICE" 2>/dev/null; then
  echo "==> Restarting systemd service: $SERVICE"
  sudo systemctl restart "$SERVICE"
elif command -v pm2 >/dev/null 2>&1; then
  echo "==> Restarting via pm2"
  pm2 restart jm-billing 2>/dev/null || pm2 restart all
else
  echo "==> Restart manually: kill old node process, then: node server.js"
fi

echo ""
echo "==> KitFi GCash webhook (paste in KitFi management):"
echo "    https://jmwifi.pro/api/billing/kitifi/webhook"
echo "==> Set Public URL in Settings: https://jmwifi.pro"
