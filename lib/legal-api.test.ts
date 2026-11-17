import { afterEach, describe, expect, it, vi } from "vitest";
import { silenceConsole } from "@/tests/helpers";

const reportError = vi.fn();

async function load(
  apiUrl: string | undefined = "https://api.example.com/v1",
  key?: string,
) {
  vi.resetModules();
  vi.doMock("@/lib/env", () => ({ publicEnv: { apiUrl, apiStagingKey: key } }));
  vi.doMock("@/lib/monitoring", () => ({ reportError }));
  return (await import("./legal-api")).fetchLegalVersion;
}

afterEach(() => {
  vi.doUnmock("@/lib/env");
  vi.doUnmock("@/lib/monitoring");
  reportError.mockReset();
});

const API_DOC = {
  type: "cgu",
  slug: "cgu",
  title: "Conditions générales d’utilisation",
  version: 1,
  effective_date: "2026-10-22",
  requires_acceptance: true,
  locale: "fr",
  url: "https://www.laboon-app.com/legal/cgu/1",
  body_md: "Intro\n\n## Article {#a}\n\nTexte",
  change_summary: null,
  content_hash: null,
};

function stubFetch(impl: () => Promise<Response>) {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const json = (status: number, data: unknown) => async () =>
  Response.json(data, { status });

describe("fetchLegalVersion", () => {
  it("reads the version with the locale and caches it (ISR)", async () => {
    const fetchMock = stubFetch(json(200, API_DOC));
    const fetchLegalVersion = await load();

    const result = await fetchLegalVersion("cgu", "en", 1);

    expect(result).toEqual({
      kind: "found",
      doc: {
        slug: "cgu",
        title: API_DOC.title,
        version: 1,
        effectiveDate: "2026-10-22",
        locale: "fr",
        bodyMd: API_DOC.body_md,
      },
    });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(
      "https://api.example.com/v1/legal/documents/cgu?locale=en&version=1",
    );
    expect((init as { next?: unknown }).next).toEqual({ revalidate: 300 });
  });

  it("sends the staging header only when the key is configured", async () => {
    const fetchMock = stubFetch(json(200, API_DOC));
    await (
      await load("https://api.example.com/v1", "s3cret")
    )("cgu", "fr", 1);
    expect(
      (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].headers,
    ).toMatchObject({ "X-Laboon-Staging": "s3cret" });

    await (
      await load()
    )("cgu", "fr", 1);
    const headers = (fetchMock.mock.calls[1] as unknown as [string, RequestInit])[1]
      .headers as Record<string, string>;
    expect(headers["X-Laboon-Staging"]).toBeUndefined();
  });

  it.each([404, 422])(
    "answers not_found for a %s (unknown, draft or malformed version)",
    async (status) => {
      stubFetch(json(status, { error: { code: "not_found" } }));
      expect(await (await load())("cgu", "fr", 99)).toEqual({ kind: "not_found" });
      expect(reportError).not.toHaveBeenCalled();
    },
  );

  describe("failures throw a neutral error and are reported", () => {
    const SECRET = "s3cret-key";
    const check = async (
      fetchLegalVersion: Awaited<ReturnType<typeof load>>,
      status?: number,
    ) => {
      const error = await fetchLegalVersion("cgu", "fr", 1).catch((e: Error) => e);
      expect(error).toBeInstanceOf(Error);
      const text = `${(error as Error).message} ${JSON.stringify(reportError.mock.calls)}`;
      expect(text).not.toContain("api.example.com");
      expect(text).not.toContain(SECRET);
      expect(text).not.toContain("internal-detail");
      expect(reportError).toHaveBeenCalledTimes(1);
      expect(reportError.mock.calls[0][0]).toBe("legal");
      expect(reportError.mock.calls[0][2]).toEqual({
        slug: "cgu",
        version: 1,
        ...(status ? { status } : {}),
      });
    };

    it("API 500", async () => {
      silenceConsole();
      stubFetch(json(500, { error: "internal-detail" }));
      await check(await load("https://api.example.com/v1", SECRET), 500);
    });

    it("network error", async () => {
      stubFetch(async () => {
        throw new TypeError("fetch failed https://api.example.com/v1 s3cret-key");
      });
      await check(await load("https://api.example.com/v1", SECRET));
    });

    it("invalid JSON", async () => {
      stubFetch(
        async () => new Response("<html>internal-detail</html>", { status: 200 }),
      );
      await check(await load("https://api.example.com/v1", SECRET), 200);
    });

    it("unexpected document shape", async () => {
      stubFetch(json(200, { ...API_DOC, locale: "de" }));
      await check(await load("https://api.example.com/v1", SECRET), 200);
    });

    it("API not configured", async () => {
      const fetchMock = stubFetch(json(200, API_DOC));
      await check(await load(""));
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
