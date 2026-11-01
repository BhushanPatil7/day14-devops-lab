@echo off
setlocal
echo.
echo === Day 14 DevOps lab: setup ===
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [X] Node.js is not installed. Install the LTS version from https://nodejs.org then run setup.bat again.
  exit /b 1
)
where git >nul 2>nul
if errorlevel 1 (
  echo [X] Git is not installed. Install it from https://git-scm.com then run setup.bat again.
  exit /b 1
)

for /f "tokens=1 delims=." %%v in ('node -p process.versions.node') do set NODE_MAJOR=%%v
if %NODE_MAJOR% LSS 20 (
  echo [X] Node %NODE_MAJOR% found. This lab needs Node 20.19 or newer - install Node 22 LTS.
  exit /b 1
)
echo [OK] Node and Git found.

echo.
echo Installing packages for all 3 apps (first time takes a few minutes)...
call npm install
if errorlevel 1 (
  echo [X] npm install failed. See the Troubleshooting section in README.md.
  exit /b 1
)

if not exist shop-app\.env.local (
  copy shop-app\.env.example shop-app\.env.local >nul
  echo [OK] Created shop-app\.env.local - add your Sentry and LogRocket keys there later.
)

if not exist .git (
  git init -b main >nul
  git add .
  git commit -q -m "chore: initial Day 14 lab project"
  if errorlevel 1 (
    echo [!] Git could not commit. Set your name and email, then commit:
    echo     git config --global user.name "Your Name"
    echo     git config --global user.email "you@example.com"
  ) else (
    echo [OK] Git repository created on branch main.
  )
)

echo.
echo === Setup complete ===
echo   Micro frontends + monitoring:  npm run dev:mfe   then open http://localhost:5173
echo   Next.js SSR:                   npm run dev:next  then open http://localhost:3000
echo   Everything CI runs:            npm run lint ^&^& npm run build
echo.
endlocal
