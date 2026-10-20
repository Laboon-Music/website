import { afterEach, describe, expect, it, vi } from "vitest";

async function loadApi(apiUrl: string | undefined, apiStagingHeader?: string) {
  vi.resetModules();
  vi.doMock("@/lib/env", () => ({ publicEnv: { apiUrl, apiStagingHeader } }));
  return (await import("./api")).apiPost;
}

afterEach(() => vi.doUnmock("@/lib/env"));

describe("apiPost", () => {
  it("POSTs JSON to the configured API, in French, without caching", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);
    const apiPost = await loadApi("https://api.example.com/v1/");

    const result = await apiPost("/auth/password/reset", { email: "a@b.co" });

    expect(result).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.example.com/v1/auth/password/reset");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ email: "a@b.co" });
    expect(init.headers).toMatchObject({ "Accept-Language": "fr" });
    expect(init.cache).toBe("no-store");
  });

  it("sends the staging header only when the staging header value is configured", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);

    await (
      await loadApi("https://api.example.com/v1", "s3cret")
    )("/x", {});
    const withKey = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(withKey[1].headers).toMatchObject({ "X-Laboon-Staging": "s3cret" });

    await (
      await loadApi("https://api.example.com/v1")
    )("/x", {});
    const without = fetchMock.mock.calls[1] as unknown as [string, RequestInit];
    expect(without[1].headers).not.toHaveProperty("X-Laboon-Staging");
  });

  it("returns the stable error code of the API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ error: { code: "invalid_code" } }, { status: 400 }),
      ),
    );
    const apiPost = await loadApi("https://api.example.com/v1");
    expect(await apiPost("/auth/confirm", { code: "x", password: "y" })).toEqual({
      ok: false,
      code: "invalid_code",
      status: 400,
    });
  });

  it("falls back to 'unknown' when the error has no readable body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("oops", { status: 500 })),
    );
    const apiPost = await loadApi("https://api.example.com/v1");
    expect(await apiPost("/x", {})).toEqual({ ok: false, code: "unknown", status: 500 });
  });

  it("reports a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const apiPost = await loadApi("https://api.example.com/v1");
    expect(await apiPost("/x", {})).toMatchObject({ ok: false, code: "network" });
  });

  it("fails loudly, without calling anything, when the API is not configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const apiPost = await loadApi(undefined);
    expect(await apiPost("/x", {})).toMatchObject({ ok: false, code: "not_configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
