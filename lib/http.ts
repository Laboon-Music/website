import { NextResponse } from "next/server";

// JSON response helpers shared by the API routes.
// Error messages are shown as-is to visitors: they come from the dictionaries
// (content/<lang>/ui.ts, see lib/request-locale.ts).

export function jsonOk(extra: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: true, ...extra });
}

export function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

/** Largest JSON body accepted (the longest legitimate one is a 5000-character message). */
export const MAX_BODY_BYTES = 64 * 1024;

/** Parses a JSON object body; returns null when it is not a JSON object or is too large. */
export async function readJsonBody<T extends object>(
  request: Request,
): Promise<Partial<T> | null> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return null;
  try {
    const body: unknown = await request.json();
    return body && typeof body === "object" && !Array.isArray(body)
      ? (body as Partial<T>)
      : null;
  } catch {
    return null;
  }
}

/** True when running on Vercel / `next start`, false with `next dev` and tests. */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}
