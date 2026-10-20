import { UI as FR } from "@/content/fr/ui";
import { UI as EN } from "@/content/en/ui";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HUMAN, mockFetch, silenceConsole } from "@/tests/helpers";
import { checkAntibot, isTooFast, MIN_FILL_MS, verifyTurnstile } from "./antibot";

const request = () =>
  new Request("http://localhost/api/x", {
    method: "POST",
    headers: { "x-forwarded-for": "1.2.3.4, 10.0.0.1" },
  });

beforeEach(() => {
  silenceConsole();
});

describe("isTooFast", () => {
  it("flags submissions under the minimum delay", () => {
    expect(isTooFast(MIN_FILL_MS - 1)).toBe(true);
    expect(isTooFast(MIN_FILL_MS)).toBe(false);
  });

  it("flags a missing or non-numeric delay", () => {
    expect(isTooFast(undefined)).toBe(true);
    expect(isTooFast("5000")).toBe(true);
  });
});

describe("verifyTurnstile", () => {
  it("is skipped (passes) when no secret is configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    const fetchMock = mockFetch();
    expect(await verifyTurnstile(undefined, request())).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  describe("with a secret", () => {
    beforeEach(() => {
      vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    });

    it("rejects a missing token without calling Cloudflare", async () => {
      const fetchMock = mockFetch();
      expect(await verifyTurnstile("", request())).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("sends secret, token and client IP to Cloudflare", async () => {
      const fetchMock = mockFetch(200, { success: true });
      expect(await verifyTurnstile("tok", request())).toBe(true);
      const body = fetchMock.mock.calls[0][1]?.body as URLSearchParams;
      expect(Object.fromEntries(body)).toEqual({
        secret: "secret",
        response: "tok",
        remoteip: "1.2.3.4",
      });
    });

    it("rejects when Cloudflare says no", async () => {
      mockFetch(200, { success: false, "error-codes": ["invalid-input-response"] });
      expect(await verifyTurnstile("tok", request())).toBe(false);
    });

    it("rejects on network error", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
      expect(await verifyTurnstile("tok", request())).toBe(false);
    });
  });
});

describe("checkAntibot", () => {
  it("lets a human submission through", async () => {
    expect(await checkAntibot(HUMAN, request())).toBeNull();
  });

  it("answers a fake ok when the honeypot is filled", async () => {
    const res = await checkAntibot({ ...HUMAN, website: "spam.com" }, request());
    expect(res?.status).toBe(200);
    expect(await res?.json()).toEqual({ ok: true });
  });

  it("returns a visible error when too fast", async () => {
    const res = await checkAntibot({ ...HUMAN, elapsedMs: 200 }, request());
    expect(res?.status).toBe(400);
    expect(await res?.json()).toEqual({ error: FR.errors.tooFast });
  });

  it("writes its errors in the language of the request", async () => {
    const res = await checkAntibot({ ...HUMAN, elapsedMs: 200, locale: "en" }, request());
    expect(await res?.json()).toEqual({ error: EN.errors.tooFast });
  });

  it("returns a visible error when Turnstile fails", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    const res = await checkAntibot(HUMAN, request());
    expect(res?.status).toBe(400);
    expect(await res?.json()).toEqual({ error: FR.errors.turnstile });
  });
});
