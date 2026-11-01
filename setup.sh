#!/usr/bin/env bash
# macOS / Linux version of setup.bat
set -e
echo "=== Day 14 DevOps lab: setup ==="
command -v node >/dev/null || { echo "Install Node.js 22 LTS from https://nodejs.org"; exit 1; }
command -v git  >/dev/null || { echo "Install Git from https://git-scm.com"; exit 1; }
major=$(node -p 'process.versions.node.split(".")[0]')
[ "$major" -ge 20 ] || { echo "Node $major found; install Node 22 LTS"; exit 1; }
npm install
[ -f shop-app/.env.local ] || cp shop-app/.env.example shop-app/.env.local
if [ ! -d .git ]; then
  git init -b main >/dev/null && git add . && git commit -q -m "chore: initial Day 14 lab project" \
    || echo "Set git user.name and user.email, then commit."
fi
echo "Done. Run: npm run dev:mfe  (http://localhost:5173)  or  npm run dev:next  (http://localhost:3000)"
