#!/usr/bin/env bash
# Rebuild better-sqlite3 for the active Node.js version (fixes MODULE_VERSION mismatch)
set -e

if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck source=/dev/null
  . "$HOME/.nvm/nvm.sh"
  if [ -f "$(dirname "$0")/../.nvmrc" ]; then
    nvm use >/dev/null 2>&1 || true
  fi
fi

echo "Rebuilding better-sqlite3 for Node $(node -v)..."
npm rebuild better-sqlite3
