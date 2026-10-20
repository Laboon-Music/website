// Client of the Laboon API (Laboon-Music/api) for the account links the app
// e-mails to the website: password reset and e-mail confirmation. The browser
// calls the API directly (the site's origin is in the API's CORS_ORIGINS), so no
// secret is involved. See docs/features/account-links.md.

import { publicEnv } from "@/lib/env";

export type ApiResult =
  | { ok: true }
  | {
      ok: false;
      /** Stable error code of the API (`invalid_code`, `weak_password`, `rate_limited`…) or `network` / `not_configured`. */
      code: string;
      status: number;
    };

/**
 * POSTs JSON to `<NEXT_PUBLIC_API_URL><path>`. The response body is never read
 * on success: the endpoints answer with a session the website does not keep.
 * Never logs the body (it holds passwords and one-time codes).
 */
export async function apiPost(
  path: string,
  body: Record<string, string>,
): Promise<ApiResult> {
  const base = publicEnv.apiUrl?.replace(/\/+$/, "");
  if (!base) return { ok: false, code: "not_configured", status: 0 };

  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept-Language": "fr" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return { ok: false, code: "network", status: 0 };
  }
  if (res.ok) return { ok: true };

  const code = await res
    .json()
    .then((data: { error?: { code?: unknown } }) => String(data?.error?.code ?? ""))
    .catch(() => "");
  return { ok: false, code: code || "unknown", status: res.status };
}
