#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/bulwarkmail-website"
BRANCH="main"
STASH_MSG="deploy-auto-stash-$(date +%F-%H%M%S)"

cd "$APP_DIR"

echo "==> Stashing any local changes..."
if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
  git stash push -u -m "$STASH_MSG"
  echo "    Stashed as: $STASH_MSG"
else
  echo "    Working tree clean, nothing to stash."
fi

echo "==> Pulling latest from origin/$BRANCH..."
git pull --rebase origin "$BRANCH"

echo "==> Installing dependencies..."
npm ci

echo "==> Building..."
if ! npm run build; then
  echo "!!! Build failed — rolling back to previous commit..."
  git rebase --abort 2>/dev/null || true
  git reset --hard HEAD~1
  npm ci
  npm run build
  echo "!!! Rolled back and rebuilt previous version."
  exit 1
fi

echo "==> Restarting PM2 processes..."
pm2 restart all

echo "==> Deploy complete. Current commit:"
git --no-pager log --oneline -1

echo "==> PM2 status:"
pm2 status
