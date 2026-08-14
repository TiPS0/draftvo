import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Proxy to Go backend
    const res = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error ?? "Registration failed." },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[/api/auth/register]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
