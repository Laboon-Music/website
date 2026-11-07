import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockFetch, sentJson, silenceConsole } from "@/tests/helpers";
import { reportError } from "./monitoring";
import { listmonkCall } from "./listmonk";

vi.mock("./monitoring", () => ({ reportError: vi.fn() }));

beforeEach(() => {
  vi.mocked(reportError).mockClear();
  vi.stubEnv("LISTMONK_URL", "https://lists.example.com/");
  vi.stubEnv("LISTMONK_API_USER", "website");
  vi.stubEnv("LISTMONK_API_TOKEN", "secret");
});

const headersOf = (fetchMock: ReturnType<typeof mockFetch>, call = 0) =>
  fetchMock.mock.calls[call][1]?.headers as Record<string, string>;

describe("listmonkCall", () => {
  it("posts JSON with Basic auth and returns the answer", async () => {
    const fetchMock = mockFetch(200, { data: { id: 1 } });
    const res = await listmonkCall("test", "/api/subscribers", { body: { a: 1 } });

    expect(res).toEqual({ ok: true, status: 200, data: { data: { id: 1 } } });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://lists.example.com/api/subscribers");
    expect(init?.method).toBe("POST");
    expect(headersOf(fetchMock).Authorization).toBe(`Basic ${btoa("website:secret")}`);
    expect(sentJson(fetchMock)).toEqual({ a: 1 });
  });

  it("sends no credentials to the public endpoints", async () => {
    const fetchMock = mockFetch();
    await listmonkCall("test", "/api/public/subscription", { body: {}, auth: false });
    expect(headersOf(fetchMock).Authorization).toBeUndefined();
  });

  it("sends GET requests without a body", async () => {
    const fetchMock = mockFetch();
    await listmonkCall("test", "/api/lists/3", { method: "GET" });
    const init = fetchMock.mock.calls[0][1];
    expect(init?.method).toBe("GET");
    expect(init?.body).toBeUndefined();
  });

  it("reports refusals with the status only (never listmonk's message)", async () => {
    silenceConsole();
    mockFetch(400, { message: "invalid email: jane@example.com" });
    const res = await listmonkCall("subscribe", "/api/subscribers", { body: {} });
    expect(res.ok).toBe(false);
    expect(reportError).toHaveBeenCalledWith(
      "subscribe",
      "listmonk refused the request",
      {
        path: "/api/subscribers",
        status: 400,
      },
    );
  });

  it("does not report the refusals the caller expects", async () => {
    mockFetch(409);
    const res = await listmonkCall("subscribe", "/x", { body: {}, expected: [409] });
    expect(res.status).toBe(409);
    expect(reportError).not.toHaveBeenCalled();
  });

  it("throws on network errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    await expect(listmonkCall("test", "/x")).rejects.toThrow("down");
  });
});
