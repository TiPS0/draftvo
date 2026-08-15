---
title: "Monorepo Architecture"
status: "active"
date: "2026-08-15"
tags: ["architecture", "core", "monorepo"]
---

# Architecture: Monorepo Overview

> **AI Agent Instructions:** This is a "living document". Do not create new files using this template for every minor change. Instead, update the existing architecture documents. Read these documents to understand the foundational rules of the system before proposing structural changes.

## 1. Overview

Draftation is a monorepo consisting of two primary domains:
1. **Frontend**: A React application built with Next.js (App Router), Tailwind CSS v4, and TypeScript.
2. **Backend**: A lightweight Go API that handles data storage and authentication.

Both domains communicate over HTTP APIs. The frontend authenticates by storing a JWT token in an HTTP-only cookie, allowing Server Components in Next.js to securely verify the session.

## 2. Rules & Conventions

_List the hard rules that human developers and AI agents MUST follow when working in this domain._

- **Rule 1 (Monorepo Tooling):** Use `pnpm` as the package manager from the root directory to manage workspaces (`pnpm -r`).
- **Rule 2 (Tailwind CSS v4):** The frontend relies on Tailwind CSS v4. Do NOT use tailwind.config.js for custom themes; instead, rely on the inline `@theme` directive in `globals.css` and CSS variables.
- **Rule 3 (Theme Engine):** The UI strictly supports Dark and Light mode via CSS variables (`.dark` class on the HTML tag, managed by `next-themes`).
- **Rule 4 (Data Storage):** The Go backend currently relies on a lightweight JSON file store (e.g., `users.json`). Ensure file I/O operations are locked properly via Mutexes to prevent race conditions.
- **Rule 5 (Authentication):** Authentication utilizes stateless JWTs (`SESSION_COOKIE`). Next.js server components MUST read from `next/headers` cookies to authorize server-side renders.

## 3. Diagram / Structure

```
draftation/
├── frontend/             # Next.js Application
│   ├── src/app/          # App Router (Pages, Layouts, Server Components)
│   │   ├── (main)/       # Authenticated Dashboard Layout
│   │   ├── _components/  # Client and Server Reusable UI Components
│   │   └── globals.css   # Tailwind v4 configuration and Theme variables
│   └── package.json
├── backend/              # Go API Server
│   ├── main.go           # HTTP Server & Endpoints
│   ├── users.json        # Flat-file database
│   └── go.mod
├── docs/                 # AI-Optimized Documentation
└── pnpm-workspace.yaml   # Workspace definitions
```
