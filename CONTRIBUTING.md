# Git workflow (section 2)

Nobody pushes straight to `main`. Every change goes: **feature branch → pull request → green CI → review → merge**.

```bash
# 1. Start from the latest main
git switch main
git pull

# 2. Create a feature branch
git switch -c feature/cart-badge-colour

# 3. Commit in small steps (Conventional Commits)
git add shop-app/src/index.css
git commit -m "feat: highlight the cart badge"

# 4. Push and open a pull request on GitHub
git push -u origin feature/cart-badge-colour
```

| Convention | Examples |
| --- | --- |
| Branch names | `feature/cart-badge`, `fix/remote-fallback`, `chore/upgrade-vite` |
| Commit messages | `feat: …`, `fix: …`, `docs: …`, `chore: …`, `test: …` |

When your branch falls behind `main`:

```bash
git switch main && git pull
git switch feature/cart-badge-colour
git merge main
```
