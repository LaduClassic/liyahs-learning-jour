#!/usr/bin/env bash
set -euo pipefail

# build_and_fix.sh
# Runs the project's build, removes crossorigin attributes from built files,
# renames any index-<hash>.html to index.html, and adjusts internal references.

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

BUILD_CMD="npm run build"
echo "Running build: $BUILD_CMD"
$BUILD_CMD

DIST_DIR="$PROJECT_DIR/dist"
if [ ! -d "$DIST_DIR" ]; then
  echo "Build output directory '$DIST_DIR' not found. Exiting." >&2
  exit 1
fi

echo "Removing crossorigin attributes from built files..."
shopt -s globstar nullglob
for f in "$DIST_DIR"/**/*.{html,js,css}; do
  [ -f "$f" ] || continue
  if grep -q "crossorigin" "$f"; then
    # remove standalone crossorigin or crossorigin="..."
    sed -i -E 's/[[:space:]]+crossorigin(="[^"]*")?//g' "$f" || true
    echo "fixed: $f"
  fi
done

echo "Searching for index-*.html files to rename to index.html..."
renamed=0
for f in "$DIST_DIR"/index-*.html; do
  [ -e "$f" ] || continue
  base=$(basename "$f")
  if [ "$base" != "index.html" ]; then
    echo "Renaming $base -> index.html"
    mv -f "$f" "$DIST_DIR/index.html"
    renamed=1
  fi
done

if [ "$renamed" -eq 1 ]; then
  echo "Updating references to index-<hash>.html in built files..."
  for f in "$DIST_DIR"/**/*.{html,js,css}; do
    [ -f "$f" ] || continue
    # replace occurrences like index-<hash>.html -> index.html
    sed -i -E 's/index-[a-zA-Z0-9._-]+\.html/index.html/g' "$f" || true
  done
fi

echo "Build adjustment complete. Output directory: $DIST_DIR"

echo "Files changed summary (first 20):"
ls -la "$DIST_DIR" | head -n 20 || true

echo "Done."
