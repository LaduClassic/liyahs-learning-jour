#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/deploy.sh [GIT_REMOTE] [BRANCH]
# Examples:
#   ./scripts/deploy.sh                                         # uses default remote and branch
#   ./scripts/deploy.sh https://github.com/LaduClassic/liyahasjourney.git gh-pages

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

GIT_REMOTE="${1:-https://github.com/LaduClassic/liyahasjourney.git}"
BRANCH="${2:-main}"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

echo "Working directory: $ROOT_DIR"
echo "Remote: $GIT_REMOTE"
echo "Branch: $BRANCH"

# Ensure dependencies (safe if already installed)
if command -v npm >/dev/null 2>&1; then
  echo "Installing dependencies (npm ci if lockfile present)..."
  if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then
    npm ci
  else
    npm install
  fi
else
  echo "npm not found on PATH" >&2
  exit 1
fi

# Run build (try package.json build script, fall back to vite)
echo "Running build..."
if npm run | grep -qE '(^| )build( |$)'; then
  npm run build
else
  echo "No build script found in package.json — attempting 'npx vite build'"
  npx vite build
fi

# Optional cleanup: use package.json clean script if available, otherwise clean npm cache
echo "Running clean step..."
if npm run | grep -qE '(^| )clean( |$)'; then
  npm run clean || true
else
  echo "No 'clean' script found. Running 'npm cache clean --force' (non-destructive)."
  npm cache clean --force || true
fi

# Ensure git repo and remote configured
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Initializing git repository..."
  git init
fi

if git remote get-url origin >/dev/null 2>&1; then
  CURRENT_URL="$(git remote get-url origin)"
  if [ "$CURRENT_URL" != "$GIT_REMOTE" ]; then
    echo "Updating origin remote URL"
    git remote set-url origin "$GIT_REMOTE"
  fi
else
  git remote add origin "$GIT_REMOTE"
fi

# Add, commit, push
echo "Staging changes..."
git add -A

echo "Committing..."
if git diff --cached --quiet; then
  echo "No staged changes to commit."
else
  git commit -m "chore(deploy): build at $TIMESTAMP"
fi

echo "Pushing to $GIT_REMOTE (branch: $BRANCH)..."
git push -u origin "$BRANCH"

echo "Deploy script finished."
