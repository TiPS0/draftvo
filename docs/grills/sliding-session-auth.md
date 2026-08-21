# Sliding Session Architecture Audit

## 1. Context & Goal
The goal is to implement a 1-day (24-hour) sliding session for the application. 
- **10 AM Day 1 -> 9 AM Day 2**: The user returns before the 24h expiration. The session should be extended for another 24 hours (reset).
- **10 AM Day 1 -> 11 AM Day 2**: The user returns after 24h. The session is expired and they are kicked back to login.

## 2. Interactive Audit Results
We audited this approach against standard stateless JWT best practices:

**Q: Refresh Trigger Strategy?**
**Decision:** *Refresh the token only if it has passed a threshold (e.g., > 12 hours old).*
- *Why:* Refreshing on every request causes immense overhead (constant crypto signing and header rewriting). Waiting until the token is halfway expired provides the "sliding" experience without the performance penalty.

**Q: Session Revocation (Multi-device)?**
**Decision:** *Keep it completely stateless.*
- *Why:* Because the TTL is very short (1 day), the risk window is small. This avoids introducing a database bottleneck (like Redis or a Postgres query) on every single page load.

## 3. Implementation Plan
We will make the following changes to implement the validated architecture:

### A. Update Token Expiration
- **Target File:** `frontend/src/lib/auth.ts`
- **Change:** Decrease `TOKEN_TTL_SECONDS` from 7 days (`60 * 60 * 24 * 7`) to 1 day (`60 * 60 * 24`).

### B. Implement Token Refresh Logic
- **Target File:** `frontend/src/proxy.ts`
- **Change:** After verifying the token, check its age (`current_time - payload.iat`).
- If the token is older than 12 hours (`60 * 60 * 12`), generate a new JWT with the same `sub`, `name`, and `role`.
- Append a `Set-Cookie` header to the `NextResponse` using the Next.js `response.cookies.set()` API so the browser receives the fresh token.

## 4. Edge Cases Accounted For
- **Silent Failures in Middleware:** We must ensure we use the correct Next.js cookie API on the response object so the `Set-Cookie` header is properly propagated to the client.
- **Clock Skew:** `iat` and `exp` are checked safely using standard Unix timestamps.
- **Browser Caching:** Our previously implemented `Cache-Control: no-store` headers on protected routes will ensure that if the token expires and they press back, the proxy will correctly intercept and kick them out.
