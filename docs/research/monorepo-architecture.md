---
title: "Monorepo Architecture — frontend, backend, desktop"
status: "completed"
date: "2026-08-24"
tags: ["research", "architecture", "monorepo", "tauri", "nextjs", "go"]
---

# Research: Monorepo Architecture — frontend, backend, desktop

> **AI Agent Instructions:** When reading this file, use the "Findings" section to
> understand the current architecture of every workspace and strictly follow the
> "Implementation Pattern" section when generating code that spans multiple workspaces.

## 1. Objective

Audit the three workspaces (`frontend/`, `backend/`, `desktop/`) of the Draftvo monorepo to produce an up-to-date architectural reference and update the root `README.md` and `CONTRIBUTING.md` documentation.

## 2. Findings

### Monorepo Configuration
- **Tooling:** `pnpm` workspaces defined in `pnpm-workspace.yaml`.
- **Workspaces:** `frontend`, `backend`, `desktop` (desktop was added recently).
- **Root scripts:**
  - `pnpm dev` — starts frontend + backend concurrently
  - `pnpm desktop` — starts frontend + backend + Tauri desktop window
  - `pnpm build:mac` — produces `.dmg` / `.app` via `cargo tauri build`
  - `pnpm build:win` — cross-compiles for Windows (requires Windows runner or cross-toolchain)

### `frontend/` — Next.js 16 (React 19, Tailwind CSS v4)
- **Framework:** Next.js 16.3.1 with Turbopack
- **Styling:** Tailwind v4 with CSS-first `@theme inline` tokens in `globals.css`
- **Auth:** Client-side Zustand store (`src/store/authStore.ts`) persisted to `localStorage`. No server-side middleware.
- **API:** All backend calls go through `src/lib/api.ts` → `fetchApi()`, which:
  - Detects Tauri environment via `'__TAURI__' in window`
  - Reads JWT from `authStore` and attaches `Authorization: Bearer` header
  - Points to `BACKEND_URL` (default: `http://localhost:8080`), configurable via `NEXT_PUBLIC_API_URL`
- **Route Groups:**
  - `(auth)/` — Login + Register pages with client-side `AuthHeader` (logo + theme toggle)
  - `(main)/` — Protected dashboard routes guarded by `AuthGuard` component
  - `_components/` — Shared layout components: `Sidebar`, `AppLayout`, `SettingsModal`, `TaskBoard`, etc.
- **Build Modes:**
  - Default (Docker/web): standard Next.js server render
  - `TAURI_BUILD=true`: `output: 'export'` static export consumed by Tauri's WebView

### `backend/` — Go HTTP Server
- **Language/Runtime:** Go 1.20+, single `main.go` file
- **Dependencies:** `golang-jwt/jwt/v5`, `golang.org/x/crypto/bcrypt`
- **Data Storage:** JSON flat files on disk — `users.json`, `invites.json` (no database)
- **Auth Model:** JWT-based, tokens returned on login, validated by `authMiddleware`
- **API Routes:**
  | Route | Method | Auth Required | Description |
  |---|---|---|---|
  | `/auth/register` | POST | No (invite token) | Create account |
  | `/auth/login` | POST | No | Returns JWT |
  | `/auth/logout` | POST | No | Stateless no-op |
  | `/api/auth/me` | GET | Yes | Returns current user |
  | `/api/invites` | GET/POST | Yes (Admin) | Manage invite tokens |
- **CORS:** All routes wrapped in `corsMiddleware`, allows `Content-Type` + `Authorization` headers, any `Origin`
- **Port:** `8080` by default, overridable via `PORT` env var

### `desktop/` — Tauri v2 (Rust + WebView)
- **Framework:** Tauri 2.11.5 with Rust 1.77.2
- **Product name:** `draftvo` (identifier: `com.tauri.dev`)
- **Window:** Starts at `1200×800`, resizable
- **Icons:** Generated from the Draftvo logo using `cargo tauri icon` (all sizes including `.icns`, `.ico`, iOS, Android)
- **Dev pipeline:** `beforeDevCommand` spins up both `pnpm --filter backend dev` AND `pnpm --filter frontend dev` before Tauri's Rust process starts
- **Build pipeline:** `beforeBuildCommand` runs `TAURI_BUILD=true pnpm --filter frontend build` to produce the static export
- **Frontend dist:** Reads from `../../frontend/out` (static export output dir)
- **Key constraint:** Tauri `output: export` is incompatible with Next.js API routes → all API routes live exclusively in the Go backend

## 3. Implementation Pattern (For AI to Follow)

### Adding a new API endpoint
1. Add route handler in `backend/main.go`
2. Register it with `http.HandleFunc("/api/...", corsMiddleware(authMiddleware(handler)))`
3. Call it from frontend via `fetchApi("/api/...")` in `src/lib/api.ts`
4. **Never** add Next.js API routes under `frontend/src/app/api/` — these break `output: export`

### Adding a new frontend page
1. Create page under `frontend/src/app/(main)/` for authenticated routes
2. Wrap with `<AuthGuard>` if needed (already in `(main)/layout.tsx`)
3. Use `bg-surface-base`, `text-text-primary` etc. (native Tailwind v4 utilities from `globals.css @theme`) — **never** use arbitrary `var()` classes

### Environment detection (web vs. desktop)
```ts
import { IS_TAURI, BACKEND_URL } from '@/lib/api';
// IS_TAURI: true when running inside Tauri desktop app
// BACKEND_URL: always points to the Go backend (localhost:8080 in dev)
```

## 4. Dependencies Needed
- `zustand` (client auth state)
- `next-themes` (dark/light theme toggle)
- `@tauri-apps/api` (available for future Tauri-specific native features)

## 5. Action Items
- [x] Add `desktop/` workspace to `pnpm-workspace.yaml`
- [x] Generate Tauri icons from Draftvo logo
- [x] Fix dark mode for Input component (use `bg-surface-base`)
- [ ] Update `README.md` to document all three workspaces and dev scripts
- [ ] Update `CONTRIBUTING.md` with desktop setup prerequisites (Rust + Tauri CLI)
- [ ] Set production `NEXT_PUBLIC_API_URL` for deployed environments
