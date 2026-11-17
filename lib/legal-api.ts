// Server-side read of a legal document from the Laboon API:
// `GET /v1/legal/documents/{slug}?locale=` (the version in force) and
// `…&version=` (one frozen version: the mobile app shows its URL at its legal
// gate, so that text never changes under the reader). The website keeps no copy
// of the texts. See docs/features/legal-documents.md.
//
// Failures are reported with a fixed context (slug, version, status) and the
// thrown errors carry no URL, key or response body: the message can reach logs
// and the error page.

import { apiBaseHeaders, apiBaseUrl } from "@/lib/api";
import type { Locale } from "@/lib/i18n";
import { reportError } from "@/lib/monitoring";

/** Seconds a response stays in the ISR/data cache (also the page's `revalidate`). */
export const LEGAL_REVALIDATE_SECONDS = 300;
const TIMEOUT_MS = 8000;

export type LegalVersion = {
  slug: string;
  title: string;
  version: number;
  /** `YYYY-MM-DD` */
  effectiveDate: string;
  /** Language the API resolved: the one asked, else French, else the first available. */
  locale: Locale;
  bodyMd: string;
};

export type LegalVersionResult =
  { kind: "found"; doc: LegalVersion } | { kind: "not_found" };

/** One row of the history of a document: a version in force or replaced. */
export type LegalVersionSummary = {
  version: number;
  /** `YYYY-MM-DD` */
  effectiveDate: string;
  title: string;
  locale: Locale;
  changeSummary: string | null;
  /** True for the version currently in force. */
  inForce: boolean;
};

export type LegalVersionsResult =
  { kind: "found"; versions: LegalVersionSummary[] } | { kind: "not_found" };

/** Error with a fixed, neutral message (never the URL, the key or the API's body). */
export class LegalApiError extends Error {
  constructor() {
    super("Legal document unavailable");
    this.name = "LegalApiError";
  }
}

function parseDocument(data: unknown): LegalVersion | null {
  if (typeof data !== "object" || data === null) return null;
  const d = data as Record<string, unknown>;
  const { slug, title, version, effective_date, locale, body_md } = d;
  if (
    typeof slug !== "string" ||
    typeof title !== "string" ||
    typeof version !== "number" ||
    !Number.isInteger(version) ||
    typeof effective_date !== "string" ||
    typeof body_md !== "string" ||
    (locale !== "fr" && locale !== "en")
  ) {
    return null;
  }
  return { slug, title, version, effectiveDate: effective_date, locale, bodyMd: body_md };
}

type ApiRead<T> = { kind: "found"; value: T } | { kind: "not_found" };

/**
 * One GET on the legal API, shared by every read: configuration check, timeout,
 * ISR cache, neutral errors and fixed report context. `parse` returns `null` for
 * an invalid body. 404 and 422 are `not_found`; anything else throws.
 */
async function readApi<T>(
  path: string,
  query: string,
  context: Record<string, string | number>,
  parse: (data: unknown) => T | null,
): Promise<ApiRead<T>> {
  const base = apiBaseUrl();
  if (!base) {
    reportError("legal", "API not configured", context);
    throw new LegalApiError();
  }

  let res: Response;
  try {
    res = await fetch(`${base}/legal/documents/${path}?${query}`, {
      headers: { Accept: "application/json", ...apiBaseHeaders() },
      // The version in force changes when a scheduled one takes effect, a frozen one
      // may be cancelled: 300 s is the shortest `max-age` the API sends, safe for all.
      next: { revalidate: LEGAL_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    // The original error can hold the request URL: it is not forwarded.
    reportError("legal", "API unreachable", context);
    throw new LegalApiError();
  }

  if (res.status === 404 || res.status === 422) return { kind: "not_found" };
  if (!res.ok) {
    reportError("legal", "API error", { ...context, status: res.status });
    throw new LegalApiError();
  }

  const value = await res
    .json()
    .then(parse)
    .catch(() => null);
  if (value === null) {
    reportError("legal", "API answered an invalid document", {
      ...context,
      status: res.status,
    });
    throw new LegalApiError();
  }
  return { kind: "found", value };
}

function parseSummary(row: unknown): LegalVersionSummary | null {
  if (typeof row !== "object" || row === null) return null;
  const { version, effective_date, title, locale, change_summary, in_force } =
    row as Record<string, unknown>;
  if (
    typeof version !== "number" ||
    !Number.isInteger(version) ||
    typeof effective_date !== "string" ||
    typeof title !== "string" ||
    typeof in_force !== "boolean" ||
    (locale !== "fr" && locale !== "en") ||
    (change_summary !== null &&
      change_summary !== undefined &&
      typeof change_summary !== "string")
  ) {
    return null;
  }
  return {
    version,
    effectiveDate: effective_date,
    title,
    locale,
    changeSummary: change_summary ?? null,
    inForce: in_force,
  };
}

/** The list of versions, or `null` when the body or any row is invalid. */
function parseVersions(data: unknown): LegalVersionSummary[] | null {
  if (typeof data !== "object" || data === null) return null;
  const rows = (data as Record<string, unknown>).data;
  if (!Array.isArray(rows)) return null;
  const versions = rows.map(parseSummary);
  return versions.every((v) => v !== null) ? versions : null;
}

async function fetchLegal(
  slug: string,
  locale: Locale,
  version: number | undefined,
): Promise<LegalVersionResult> {
  const result = await readApi(
    encodeURIComponent(slug),
    `locale=${locale}${version === undefined ? "" : `&version=${version}`}`,
    version === undefined ? { slug } : { slug, version },
    (data) => parseDocument(data),
  );
  return result.kind === "found" ? { kind: "found", doc: result.value } : result;
}

/**
 * Reads one frozen version. An unknown slug, an unknown version, a draft (the API
 * answers the same 404) and a malformed version (422) are `not_found`. Anything
 * else (API down or not configured, 5xx, timeout, invalid body) throws a
 * `LegalApiError` after `reportError()`.
 */
export function fetchLegalVersion(
  slug: string,
  locale: Locale,
  version: number,
): Promise<LegalVersionResult> {
  return fetchLegal(slug, locale, version);
}

/** Reads the version in force (same contract). 404 = unknown slug or nothing in force. */
export function fetchLegalInForce(
  slug: string,
  locale: Locale,
): Promise<LegalVersionResult> {
  return fetchLegal(slug, locale, undefined);
}

/**
 * Reads the versions in force or replaced of a document, newest first (the API
 * never lists drafts, cancelled or scheduled versions; the page shows the list
 * as received). Same contract as the other reads. The API's own `url` field is
 * ignored: the page links to the site's own frozen pages.
 */
export async function fetchLegalVersions(
  slug: string,
  locale: Locale,
): Promise<LegalVersionsResult> {
  const result = await readApi(
    `${encodeURIComponent(slug)}/versions`,
    `locale=${locale}`,
    { slug },
    parseVersions,
  );
  return result.kind === "found" ? { kind: "found", versions: result.value } : result;
}
