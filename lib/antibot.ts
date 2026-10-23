import { readEnv } from "@/lib/env";
import { jsonError, jsonOk } from "@/lib/http";
import { bodyLocale, errorsFor } from "@/lib/request-locale";
import { reportError } from "@/lib/monitoring";

// Anti-bot protections shared by every public form (signup, contact).
// See docs/features/antibot.md.

// A human needs several seconds to fill a form; a bot a few milliseconds.
export const MIN_FILL_MS = 3000;

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Fields every protected form sends alongside its own payload. */
export type AntibotFields = {
  /** Language of the page: error messages are written in it. */
  locale?: unknown;
  /** Honeypot: hidden from humans, filled in by naive bots. */
  website?: unknown;
  /** Milliseconds between form display and submit. */
  elapsedMs?: unknown;
  /** Cloudflare Turnstile token (empty when Turnstile is disabled). */
  turnstileToken?: unknown;
};

export function isTooFast(elapsedMs: unknown): boolean {
  return typeof elapsedMs !== "number" || elapsedMs < MIN_FILL_MS;
}

/**
 * Verifies a Turnstile token with Cloudflare. When TURNSTILE_SECRET_KEY is not
 * configured the check is skipped: forms keep working with the honeypot and
 * the minimum delay only.
 */
export async function verifyTurnstile(
  token: unknown,
  request: Request,
): Promise<boolean> {
  const secret = readEnv("TURNSTILE_SECRET_KEY");
  if (!secret) return true;

  if (typeof token !== "string" || !token) return false;

  const form = new URLSearchParams({ secret, response: token });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) form.set("remoteip", ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: form });
    const data = await res.json();
    if (!data.success) {
      console.warn("[turnstile] verification failed:", data["error-codes"]);
    }
    return data.success === true;
  } catch (err) {
    reportError("turnstile", "Cloudflare siteverify unreachable", {}, err);
    return false;
  }
}

/**
 * Runs the three anti-bot layers in order. Returns the response to send when
 * the request must stop here, or null when it may proceed.
 *
 * - Honeypot filled → fake "ok" so the bot gets no hint.
 * - Too fast / Turnstile failed → visible error, so a real (fast) human can retry.
 */
export async function checkAntibot(
  body: AntibotFields,
  request: Request,
): Promise<Response | null> {
  const errors = errorsFor(bodyLocale(body));
  if (body.website) return jsonOk();
  if (isTooFast(body.elapsedMs)) return jsonError(errors.tooFast, 400);
  if (!(await verifyTurnstile(body.turnstileToken, request))) {
    return jsonError(errors.turnstile, 400);
  }
  return null;
}
