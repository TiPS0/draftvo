---
title: "MacBook Swipe-Back Auth Bypass Bug"
status: "completed"
date: "2026-08-21"
tags: ["research", "auth", "navigation", "security", "next.js"]
---

# Research: MacBook 2-Finger Swipe-Back Auth Bypass

> **AI Agent Instructions:** When reading this file, use the "Findings" section to
> understand the root cause and limitations, and strictly follow the
> "Implementation Pattern" section when generating the fix.

## 1. Objective

After logging out (which redirects the user to `/login`), pressing the **2-finger swipe back** gesture on macOS (browser back navigation) returns the user to the home screen (`/`) — bypassing the auth guard. Investigate why this is possible and how to fix it.

---

## 2. Findings

### Root Cause: Browser Back-Forward Cache (bfcache)

The core issue is the **browser's Back-Forward Cache (bfcache)**. When the user is logged in and visits `/`, the browser takes a full snapshot of the page (HTML, JS state, DOM) and caches it. When logout is triggered:

1. The logout API (`POST /api/auth/logout`) correctly clears the `draftvo_session` cookie.
2. `window.location.replace('/login')` navigates to `/login`.
3. **BUT:** The macOS 2-finger swipe restores the cached home page snapshot **without making a new network request**. The Next.js server-side auth guard in `(main)/layout.tsx` is **never re-executed**.

### Key Files

| File | Role | Issue |
|---|---|---|
| `SettingsModal.tsx` L20-28 | Triggers logout + redirect | Uses `window.location.replace` — correct, but bfcache still applies |
| `(main)/layout.tsx` | Server-side auth guard | Never executes on bfcache restore |
| `api/auth/logout/route.ts` | Clears session cookie | Works correctly |
| No `middleware.ts` | — | Missing edge-level auth guard |

---

## 3. Implementation Pattern (For AI to Follow)

### Fix A — Client-side bfcache invalidation (quick fix)

Add a `pageshow` listener in `AppLayout` (or a dedicated `AuthGuard` client component):

```tsx
useEffect(() => {
  const handlePageShow = async (event: PageTransitionEvent) => {
    if (event.persisted) {
      const res = await fetch('/api/auth/session', { method: 'GET', cache: 'no-store' });
      if (!res.ok || !(await res.json()).ok) {
        window.location.replace('/login');
      }
    }
  };
  window.addEventListener('pageshow', handlePageShow);
  return () => window.removeEventListener('pageshow', handlePageShow);
}, []);
```

Also create `GET /api/auth/session/route.ts`:
```ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt, SESSION_COOKIE } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? "";
  const payload = token ? await verifyJwt(token) : null;
  if (!payload) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true });
}
```

### Fix B — Next.js Middleware (most robust)

Create `frontend/src/middleware.ts`:
```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("draftvo_session")?.value;
  const path = request.nextUrl.pathname;
  const isPublic = path.startsWith("/login") || path.startsWith("/register") || path.startsWith("/api/auth");
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

Middleware runs on every navigation — including bfcache restores that go through the browser's fetch mechanism — making it the most secure approach.

---

## 4. Dependencies Needed

- None — all fixes use existing Next.js built-ins.

---

## 5. Action Items

- [ ] **Quick fix:** Add `pageshow` handler in `AppLayout`. Create `GET /api/auth/session` route.
- [ ] **Best fix:** Add `src/middleware.ts` with JWT cookie presence check.
- [ ] Consider combining both for defense-in-depth.
