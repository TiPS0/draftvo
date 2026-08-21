---
description: In Next.js 16+, `middleware.ts` is renamed to `proxy.ts` and the exported function must be named `proxy`. Never create `middleware.ts` — it conflicts with the existing `proxy.ts` and crashes the dev server.
globs: "*.ts, *.tsx"
version: 1.1.0
updated_at: 2026-08-21
---

# Next.js 16 — `proxy.ts` Convention (Not `middleware.ts`)

**Purpose:** Prevent agents from creating a `middleware.ts` file that conflicts with the existing `proxy.ts`, causing a fatal `Unhandled Rejection` crash on startup.

## Strict Anti-Patterns (NEVER DO THIS)

- **NEVER** create `frontend/src/middleware.ts` — this convention is **deprecated in Next.js 16** and conflicts with `proxy.ts`.
- **NEVER** export a function named `middleware` for route interception — use `proxy` instead.
- **NEVER** add new route guard or auth logic in a separate file without first reading `frontend/src/proxy.ts`.
- **NEVER** assume Next.js 13–15 middleware patterns apply — always verify the version in `frontend/package.json` first.

## Required Patterns (ALWAYS DO THIS)

- **ALWAYS** place all route interception logic in `frontend/src/proxy.ts`.
- **ALWAYS** export the interceptor function as `proxy` (not `middleware`).
- **ALWAYS** keep `export const config = { matcher: [...] }` in `proxy.ts` — it is still required by Next.js 16.
- **ALWAYS** read `frontend/src/proxy.ts` before implementing any auth guard or redirect logic — it likely already handles the use case.

## What `frontend/src/proxy.ts` Already Handles

Do **not** re-implement any of the following:

1. Redirects unauthenticated users to `/login` on all protected routes
2. Redirects authenticated users away from `/login` and `/register`
3. Sets `Cache-Control: no-store` on protected pages (prevents bfcache bypass)
4. **Sliding session** — refreshes the JWT cookie when it is older than 12 hours

## Example

**BAD — creates a conflicting file and uses the wrong export name:**
```ts
// ❌ frontend/src/middleware.ts  ← wrong filename for Next.js 16
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {  // ❌ wrong export name
  // ...
}
```

**GOOD — edit the existing proxy file with the correct export name:**
```ts
// ✅ frontend/src/proxy.ts  ← correct filename for Next.js 16
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {  // ✅ correct export name
  // Add your logic here
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

## Error This Rule Prevents

```
Unhandled Rejection: Error: Both middleware file "./src/middleware.ts" and
proxy file "./src/proxy.ts" are detected. Please use "./src/proxy.ts" only.
```
