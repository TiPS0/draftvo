import { NextResponse } from "next/server";
import { signJwt, SESSION_COOKIE } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Proxy credentials to Go backend for verification
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error ?? "Invalid email or password." },
        { status: 401 }
      );
    }

    // Sign a frontend JWT — embed user identity from backend response
    const token = await signJwt({
      sub: data.user?.id ?? data.email ?? body.email,
      name: data.user?.name ?? data.name ?? "",
      role: data.user?.role ?? "Member",
    });

    const response = NextResponse.json({ ok: true, user: data.user });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[/api/auth/login]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
