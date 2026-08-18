/**
 * Lightweight JWT helpers for the Draftvo auth layer.
 *
 * We use the Web Crypto API (available in Next.js Edge & Node runtimes)
 * to sign and verify HS256 JWTs without any npm dependency.
 */

const SECRET = process.env.AUTH_SECRET ?? "draftvo-dev-secret-change-me";

function base64url(input: ArrayBuffer | Uint8Array): string {
  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : input;
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeBase64url(input: string): string {
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export interface JwtPayload {
  sub: string;  // user id / email
  name: string;
  role: string;
  iat: number;
  exp: number;
}

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function signJwt(payload: Omit<JwtPayload, "iat" | "exp">): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };

  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
  const body = base64url(new TextEncoder().encode(JSON.stringify(fullPayload)));
  const data = `${header}.${body}`;

  const key = await getKey(SECRET);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));

  return `${data}.${base64url(sig)}`;
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const data = `${header}.${body}`;

    const key = await getKey(SECRET);
    const sigBytes = Buffer.from(signature.replace(/-/g, "+").replace(/_/g, "/"), "base64");
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      new TextEncoder().encode(data)
    );
    if (!valid) return null;

    const payload = JSON.parse(decodeBase64url(body)) as JwtPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "draftvo_session";
