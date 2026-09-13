#!/usr/bin/env bash
# ============================================================
# RESTORE SCRIPT — Ryas portfolio redesign rollback
# ------------------------------------------------------------
# Usage:
#   ./restore.sh              -> restore newest backup
#   ./restore.sh --list       -> list available backups
#   ./restore.sh <stamp>      -> restore a specific backup
#   ./restore.sh --verify     -> compare current files vs newest backup
#
# Backups live in .attic/pre-redesign-<timestamp>/
# ============================================================
set -euo pipefail
cd "$(dirname "$0")"

list_backups() {
  find .attic -maxdepth 1 -type d -name 'pre-redesign-*' 2>/dev/null | sort -r
}

usage() {
  echo "Usage: $0 [--list | --verify | <timestamp>]"
  echo ""
  echo "Available backups:"
  list_backups | sed 's|.attic/pre-redesign-|  |'
}

case "${1:-}" in
  --help|-h) usage; exit 0 ;;
  --list)    usage; exit 0 ;;
  --verify)
    BK="$(list_backups | head -1)"
    [ -z "$BK" ] && { echo "ERROR: no backup found"; exit 1; }
    echo "Verifying current tree against $BK ..."
    DIFFS=0
    while IFS= read -r f; do
      rel="${f#"$BK"/}"
      if [ ! -f "$rel" ]; then echo "  MISSING   $rel"; DIFFS=$((DIFFS+1)); continue; fi
      if ! cmp -s "$f" "$rel"; then echo "  MODIFIED  $rel"; DIFFS=$((DIFFS+1)); fi
    done < <(find "$BK" -type f | sort)
    [ "$DIFFS" -eq 0 ] && echo "  All files identical to backup." \
                       || echo "  $DIFFS file(s) differ from backup."
    exit 0 ;;
  "")  BK="$(list_backups | head -1)" ;;
  *)   BK=".attic/pre-redesign-$1"
       [ -d "$BK" ] || { echo "ERROR: backup not found: $BK"; usage; exit 1; } ;;
esac

[ -z "${BK:-}" ] && { echo "ERROR: no backup found"; exit 1; }

echo "Restoring from: $BK"
echo ""
# Stage a safety copy of the CURRENT state before overwriting, so a restore
# is itself reversible.
SAFETY=".attic/pre-restore-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$SAFETY"
for d in index.html css js; do
  [ -e "$d" ] && cp -a "$d" "$SAFETY/" 2>/dev/null || true
done
echo "Current state saved to: $SAFETY"
echo ""

# Restore
cp -a "$BK"/index.html .
rm -rf css js
cp -a "$BK"/css "$BK"/js .

echo "Restore complete. Reload the page to see the original design."
echo "To undo this restore: ./restore.sh $(basename "$SAFETY" | sed 's/pre-restore-//')"
