# Day 14 hands-on lab: Enterprise DevOps for React + TypeScript

One project that covers every topic in the Day 14 guide. Each lab below takes about 20 minutes.

| Day 14 section | Where it lives | Run it with |
| --- | --- | --- |
| 1. CI/CD pipelines | `.github/workflows/ci.yml` | Push to GitHub, open the **Actions** tab |
| 2. Git workflow | `CONTRIBUTING.md`, `.github/pull_request_template.md` | `git switch -c feature/...` |
| 3. SSR overview (Next.js) | `next-shop/` | `npm run dev:next` → http://localhost:3000 |
| 4. Micro frontends (Module Federation) | `shop-app/` (shell) + `catalog-remote/` (remote) | `npm run dev:mfe` → http://localhost:5173 |
| 5. Production monitoring (Sentry) | `shop-app/src/monitoring/sentry.ts` | Add your DSN to `shop-app/.env.local` |
| 6. LogRocket session replay | `shop-app/src/monitoring/logrocket.ts` | Add your app ID to `shop-app/.env.local` |

```text
day14-devops-lab/
├─ .github/
│  ├─ workflows/ci.yml            # lint → test → build on every PR; deploy on main
│  └─ pull_request_template.md
├─ shop-app/                      # Vite + React + TS — the SHELL (host), port 5173
│  └─ src/
│     ├─ App.tsx                  # loads catalog/ProductList at runtime (lazy + Suspense)
│     ├─ remotes.d.ts             # TypeScript types for the remote component
│     ├─ config.ts                # reads VITE_ env values in one place
│     ├─ monitoring/              # sentry.ts, logrocket.ts
│     └─ components/              # EnvBadge, BreakTheApp, RemoteErrorBoundary
├─ catalog-remote/                # Vite + React + TS — the REMOTE, port 5001
│  └─ src/ProductList.tsx         # exposed as "catalog/ProductList"
├─ next-shop/                     # Next.js App Router — SSG, ISR, SSR, CSR side by side, port 3000
├─ CONTRIBUTING.md                # Git workflow
├─ setup.bat / setup.sh           # one-step setup
└─ package.json                   # npm workspaces: one install for all 3 apps
```

---

## 0. One-time setup (15 min, do it before class)

**Install these first:**

1. **Node.js 22 LTS** — https://nodejs.org (tick "Add to PATH"). Check: `node -v` shows v22 or newer.
2. **Git** — https://git-scm.com. Then set your name once:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   ```
3. **VS Code** — https://code.visualstudio.com. Open the folder and accept the recommended extensions.
4. **A GitHub account** (labs 1–2). Optional for labs 5–6: free **Sentry** and **LogRocket** accounts.

**Then, in this folder:**

- **Windows:** double-click `setup.bat`, or run it from Command Prompt.
- **macOS / Linux:** `./setup.sh`

It checks Node and Git, runs `npm install` for all three apps, creates `shop-app/.env.local`, and makes the first Git commit on `main`.

**Check it worked:**

```bash
npm run lint
npm run build
```

Both must finish without errors. These are exactly the commands CI will run.

---

## Lab 1 — CI/CD pipeline with GitHub Actions (20 min)

1. On GitHub, create an **empty** repository named `day14-devops-lab` (no README).
2. Connect and push:
   ```bash
   git remote add origin https://github.com/<your-user>/day14-devops-lab.git
   git push -u origin main
   ```
3. Open the repo's **Actions** tab. The **CI** workflow runs: Install → Lint → Test → Build. Wait for the green check.
4. Open the run and click each step to read its log. The `deploy` job shows *"Deploy skipped"* — that is expected until you add Netlify secrets.
5. **Break it on purpose:** in `shop-app/src/App.tsx` change `useState<Product[]>([])` to `useState<number[]>([])`, commit, push. Watch **Build** turn red and read the TypeScript error in the log. Undo the change and push again.

**Optional — real deployment:** create a Netlify site, then add repository **Secrets** `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` (Settings → Secrets and variables → Actions). The next push to `main` deploys `shop-app/dist`. For the deployed shell to find the catalog, deploy `catalog-remote` too and set the **Variable** `CATALOG_REMOTE_URL` to its `…/remoteEntry.js` URL.

## Lab 2 — Git workflow: feature branch and pull request (20 min)

1. **Protect `main`:** repo **Settings → Branches → Add rule** (or **Rules → Rulesets**) for `main`: require a pull request, require status checks (pick **build**), block force pushes.
2. Make a change on a branch (see `CONTRIBUTING.md`):
   ```bash
   git switch -c feature/cart-badge-colour
   # edit shop-app/src/index.css: change .badge background to #dafbe1
   git add shop-app/src/index.css
   git commit -m "feat: green environment badge"
   git push -u origin feature/cart-badge-colour
   ```
3. On GitHub click **Compare & pull request**. The description is pre-filled from the PR template — complete it.
4. Watch CI run on the PR. Ask a classmate to review (or review it yourself to practise). Try merging before CI finishes: GitHub blocks it.
5. **Squash and merge**, delete the branch, then update your laptop:
   ```bash
   git switch main && git pull
   ```

## Lab 3 — SSR overview with Next.js (20 min)

```bash
npm run dev:next        # http://localhost:3000
```

1. Open each page from the top menu and read the code beside it in `next-shop/app/`:
   - `/products` — **Server Component**, ISR (`export const revalidate = 30`)
   - `/products/1` — SSG (`generateStaticParams`), `params` is a Promise
   - `/deals` — SSR on every request (`await connection()`), with `loading.tsx`
   - `/csr` — Client Component fetching `/api/products` in the browser, like a Vite app
   - `AddToCart.tsx` — `'use client'`: the only interactive part of the products page
2. Press **Ctrl+U** (View Page Source) on `/products` and `/csr`. Product names are in the HTML for `/products`, not for `/csr`.
3. Strategies only differ in production. Stop the dev server (Ctrl+C) and run:
   ```bash
   npm run build -w next-shop     # read the route table: ○ static, ● SSG, ƒ dynamic, 30s revalidate
   npm run start:next
   ```
   Refresh each page a few times and watch the blue timestamp: `/deals` changes every time, `/products/1` never, `/products` at most every 30 s.

## Lab 4 — Micro frontends with Module Federation (20 min)

```bash
npm run dev:mfe         # starts the catalog remote (5001) AND the shell (5173) together
```

1. Open **http://localhost:5001** — the catalog team's app running on its own.
2. Open **http://localhost:5173** — the shell. The dashed purple box is `ProductList`, loaded at runtime from port 5001. Click **Add to cart**: the remote calls the shell's `onAdd` callback and the shell's cart count goes up.
3. DevTools → **Network**: find `remoteEntry.js` coming from `localhost:5001`.
4. Read the wiring:
   - `catalog-remote/vite.config.ts` → `exposes: { './ProductList': … }`
   - `shop-app/vite.config.ts` → `remotes: { catalog: { entry: 'http://localhost:5001/remoteEntry.js' } }`
   - `shop-app/src/App.tsx` → `lazy(() => import('catalog/ProductList'))` inside `Suspense`
   - `shop-app/src/remotes.d.ts` → types for a module TypeScript can't see on disk
   - both → `shared: ['react', 'react-dom']` (one copy of React)
5. **Independent deploys:** change a product price in `catalog-remote/src/products.ts`. The shell picks it up without touching shell code.
6. **Failure isolation:** stop everything (Ctrl+C), then start only the shell: `npm run dev -w shop-app`. The shell still works and shows *"The catalog remote is not reachable"* (`RemoteErrorBoundary`).

## Lab 5 — Production monitoring with Sentry (20 min)

1. At **sentry.io**, create a project of type **React**. Copy the **DSN**.
2. Paste it into `shop-app/.env.local`:
   ```bash
   VITE_SENTRY_DSN=https://...ingest.sentry.io/...
   ```
3. Restart `npm run dev:mfe`. DevTools → Console shows `[monitoring] Sentry is on.`
4. Click **Log in as demo user**, then **Break the app (test Sentry)**. The `Sentry.ErrorBoundary` in `main.tsx` shows the fallback screen.
5. In Sentry open **Issues**: you'll see `Sentry test error from Day 14 lab` with the user id `student-01`, environment and release.
6. **Readable stack traces in production:** source maps are uploaded by `@sentry/vite-plugin` only when `SENTRY_AUTH_TOKEN` is set. In CI add the secret `SENTRY_AUTH_TOKEN` and variables `SENTRY_ORG`, `SENTRY_PROJECT`, `VITE_SENTRY_DSN`. Never put the auth token in a `VITE_` variable.

## Lab 6 — LogRocket session replay (20 min)

1. At **logrocket.com**, create a project and copy its app ID (`your-org/your-app`).
2. Add it to `shop-app/.env.local`:
   ```bash
   VITE_LOGROCKET_APP_ID=your-org/your-app
   ```
3. Restart `npm run dev:mfe`. Console shows `[monitoring] LogRocket is on.`
4. Demo script: log in → search "lamp" → add two items → **Break the app**.
5. In LogRocket → **Sessions**, play your session: clicks, console error and network calls. The search box text is masked (`inputSanitizer: true`).
6. In Sentry, open the error → **Contexts → logrocket → sessionURL**: one click from *what broke* to *how it happened*.

**Privacy:** session replay records real users. Mask inputs, never record passwords or payment fields, and follow your company's policy and laws like India's DPDP Act.

---

## Command cheat sheet

| Command (run from the project root) | What it does |
| --- | --- |
| `npm run dev:mfe` | Catalog remote (5001) + shell (5173) in dev mode |
| `npm run dev:next` | Next.js dev server (3000) |
| `npm run lint` | Lint all 3 apps (same as CI) |
| `npm run build` | Type-check and build all 3 apps (same as CI) |
| `npm run preview:mfe` | Serve the built remote (5001) + shell (4173) |
| `npm run start:next` | Serve the built Next.js app (3000) |
| `npm run dev -w shop-app` | Run one app only (`-w` = workspace) |

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `'npm' is not recognized` | Node isn't on PATH. Reinstall Node and tick "Add to PATH", then open a **new** terminal. |
| PowerShell: *running scripts is disabled* | Use **Command Prompt**, or run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once. |
| `Port 5173 is already in use` | Another dev server is running. Close other terminals, or find it with `netstat -ano \| findstr :5173`. |
| Shell says the catalog is not reachable | Start both apps with `npm run dev:mfe`, not `npm run dev -w shop-app`. |
| `npm install` fails behind an office proxy | `npm config set proxy http://proxy:port` and `npm config set https-proxy http://proxy:port`. |
| Sentry/LogRocket still "off" | Edit `shop-app/.env.local` (not `.env.example`), then restart the dev server. |
| `git push` asks for a password | Use a GitHub personal access token, or sign in with GitHub Desktop / the Git Credential Manager prompt. |
