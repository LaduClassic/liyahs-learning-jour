#!/usr/bin/env bash
set -euo pipefail

# commit_branch.sh
# Creates a new branch, stages the scripts, and commits them.
# Usage: ./scripts/commit_branch.sh my-branch-name "commit message"

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <branch-name> [commit-message]" >&2
  exit 2
fi

BRANCH="$1"
MSG="${2:-chore: add build-and-fix scripts to post-process build output}" 

echo "Creating and switching to branch: $BRANCH"
git checkout -b "$BRANCH"

echo "Staging scripts..."
git add scripts/build_and_fix.sh scripts/commit_branch.sh || true

echo "Committing: $MSG"
git commit -m "$MSG" || {
  echo "Nothing to commit or commit failed." >&2
  exit 0
}

echo "Commit created on branch $BRANCH. To push run:"
echo "  git push -u origin $BRANCH"
