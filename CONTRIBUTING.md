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

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Frontend runtime |
| pnpm | 9+ | Package manager |
| Go | 1.20+ | Backend server |
| Rust | 1.77.2+ | Desktop (Tauri) only |
| Tauri CLI | 2.x | Desktop (Tauri) only |

To install Rust: https://rustup.rs/

To install Tauri CLI (desktop contributors only):
```bash
cargo install tauri-cli
```

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
│   └── src/
│       ├── app/(auth)/        # Login & Register pages
│       ├── app/(main)/        # Authenticated dashboard routes
│       ├── components/ui/     # Shared UI components (Button, Input, etc.)
│       ├── lib/api.ts         # fetchApi() — unified HTTP client for web & desktop
│       └── store/authStore.ts # Zustand client-side auth state (persisted to localStorage)
│
├── backend/                   # Go API server (JWT auth, flat-file storage)
│   ├── main.go                # All routes, handlers, middleware in one file
│   ├── users.json             # Local user data store (gitignored in prod)
│   └── invites.json           # Invite token store
│
├── desktop/                   # Tauri v2 desktop app
│   ├── package.json           # Desktop workspace scripts
│   └── src-tauri/
│       ├── tauri.conf.json    # App config (window size, icons, build commands)
│       ├── Cargo.toml         # Rust dependencies
│       └── src/               # Rust application shell
│
├── docs/                      # AI-optimized documentation
│   └── research/              # Research documents for AI agents & contributors
├── package.json               # Root monorepo scripts
└── pnpm-workspace.yaml        # Workspace definition
```

---

## Ways to Contribute

### 🐛 Bug Fixes
Check the Issues tab for any open issues labeled `bug`.

### ✨ New Features
Help us build out the core pillars: the block editor, calendar, PDF engine, or email hubs.

### 🖥️ Desktop-Specific Work
Improve native Tauri integrations: file system access, tray icons, OS notifications, offline support.

### 📝 Documentation Improvements
Help us improve `README.md`, `CONTRIBUTING.md`, or our `docs/` folder.

---

## Development Workflow

### Working on the web app

```bash
# 1. Create a feature branch from main
git checkout -b feat/your-feature-name

# 2. Start frontend + backend concurrently
pnpm dev

# 3. Open http://localhost:3000/register to create an account
# 4. Make your changes, then push your branch
git push -u origin feat/your-feature-name
```

### Working on the desktop app

```bash
# 1. Create a feature branch
git checkout -b feat/desktop-your-feature

# 2. Start desktop dev mode (starts backend + frontend + Tauri window)
pnpm desktop

# Note: First run compiles Rust and may take 1-2 minutes.
# Subsequent runs are fast (only recompiles changed Rust files).
```

### Adding a new API endpoint

1. Add the handler function in `backend/main.go`
2. Register it with `http.HandleFunc("/api/...", corsMiddleware(authMiddleware(handler)))`
3. Call it from the frontend via `fetchApi("/api/...")` — **never** create Next.js API routes under `frontend/src/app/api/`; they are incompatible with the static export required by Tauri

---

## Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>: <short description>

Types:
  feat      → New feature
  fix       → Bug fix
  docs      → Documentation only
  refactor  → Code change without new feature or fix
  chore     → Build process, dependency updates
  desktop   → Tauri/desktop-specific changes
```

Examples:
```
feat: add invite token expiry
fix: dark mode input text color
desktop: increase default window size to 1200x800
docs: update CONTRIBUTING with desktop prerequisites
```

---

## Pull Request Guidelines

1. **One PR per change** — keep PRs focused and small.
2. **Fill out the PR description** — describe what you changed and why.
3. **Never push directly to `main`** — always use a feature branch.
4. **Test both web and desktop** if your change touches shared frontend code.
5. **Wait for review** — a maintainer will review as soon as possible.

Happy contributing! 🚀
