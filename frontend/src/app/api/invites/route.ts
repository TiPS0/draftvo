import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    const res = await fetch(`${BACKEND_URL}/api/invites`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: token ? `auth_token=${token}` : "",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET /api/invites]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    const res = await fetch(`${BACKEND_URL}/api/invites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: token ? `auth_token=${token}` : "",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[POST /api/invites]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
