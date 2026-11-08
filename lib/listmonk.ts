import { readEnv } from "@/lib/env";
import { reportError } from "@/lib/monitoring";

// Minimal listmonk API client (REST, no SDK). See docs/integrations/listmonk.md.

export type ListmonkResult = { ok: boolean; status: number; data: unknown };

type CallOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  /** false for the public endpoints (`/api/public/*`), which take no credentials. */
  auth?: boolean;
  /** Refusals the caller handles itself: not reported. */
  expected?: number[];
};

/**
 * Calls the listmonk API (`LISTMONK_URL` + `path`). Returns the status and the
 * JSON answer; a refusal is reported (Sentry) with its status only, never
 * listmonk's message, which can quote the e-mail address. Throws on network
 * errors so callers can tell "listmonk said no" apart from "listmonk unreachable".
 */
export async function listmonkCall(
  feature: string,
  path: string,
  { method = "POST", body, auth = true, expected = [] }: CallOptions = {},
): Promise<ListmonkResult> {
  const base = (readEnv("LISTMONK_URL") ?? "").replace(/\/+$/, "");
  const headers: Record<string, string> = { accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    headers.Authorization = `Basic ${btoa(`${readEnv("LISTMONK_API_USER")}:${readEnv("LISTMONK_API_TOKEN")}`)}`;
  }

  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data: unknown = await res.json().catch(() => null);

  if (!res.ok && !expected.includes(res.status)) {
    reportError(feature, "listmonk refused the request", { path, status: res.status });
  }
  return { ok: res.ok, status: res.status, data };
}
