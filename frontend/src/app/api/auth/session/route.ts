import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwt, SESSION_COOKIE } from "@/lib/auth";

/**
 * GET /api/auth/session
 *
 * Lightweight session check used by the client-side bfcache guard in AppLayout.
 * Verifies the JWT cookie signature and expiry, then returns:
 *   - 200 { ok: true }  — session is valid
 *   - 401 { ok: false } — session is missing or invalid
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value ?? "";

  if (!token) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const payload = await verifyJwt(token);

  if (!payload) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
