# Contributing to Draftvo

Thank you for taking the time to contribute! 🎉
This guide will help you get started quickly with our monorepo.

---

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Ways to Contribute](#ways-to-contribute)
- [Development Workflow](#development-workflow)
- [Commit Message Format](#commit-message-format)
- [Pull Request Guidelines](#pull-request-guidelines)

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **pnpm**
- **Go** 1.20+
- **Git**

### Fork & Clone

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/draftvo.git
cd draftvo

# 2. Add the upstream remote
git remote add upstream https://github.com/TiPS0/draftvo.git

# 3. Install dependencies across the monorepo
pnpm install
```

---

## Project Structure

```text
draftvo/
├── frontend/                  # Next.js 16 application (React 19, Tailwind v4)
├── backend/                   # Go API server (handles JWT auth & users.json)
├── docs/                      # AI-optimized documentation
├── package.json               # Monorepo scripts
└── pnpm-workspace.yaml        # Workspace definition
```

---

## Ways to Contribute

### 🐛 Bug Fixes
Check the Issues tab for any open issues labeled `bug`.

### ✨ New Features
Help us build out the core pillars: the block editor, calendar, PDF engine, or email hubs.

### 📝 Documentation Improvements
Help us improve `README.md` or our `docs/` folder by fixing typos, clarifying sections, or adding better examples.

---

## Development Workflow

```bash
# 1. Create a feature branch from main
git checkout -b feat/your-feature-name

# 2. Make your changes in frontend or backend

# 3. Run the project locally (starts frontend and backend)
pnpm dev

# Note: The app uses local authentication. Register a new account
# at http://localhost:3000/register to access the dashboard.

# 4. Push your branch
git push -u origin feat/your-feature-name
```

---

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>: <short description>

Types:
  feat     → New feature
  fix      → Bug fix
  docs     → Documentation only
  refactor → Code change without new feature or fix
  chore    → Build process, dependency updates
```

---

## Pull Request Guidelines

1. **One PR per change** — keep PRs focused and small.
2. **Fill out the PR description** — describe what you changed and why.
3. **Never push directly to `main`** — always use a feature branch.
4. **Wait for review** — a maintainer will review as soon as possible.

Happy contributing! 🚀
