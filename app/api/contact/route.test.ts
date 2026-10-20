import { beforeEach, describe, expect, it, vi } from "vitest";
import { HUMAN, jsonRequest, mockFetch, sentJson, silenceConsole } from "@/tests/helpers";
import { POST } from "./route";

const post = (body: unknown) =>
  POST(jsonRequest("http://localhost:3000/api/contact", body));
const valid = {
  ...HUMAN,
  name: " Jane ",
  email: "Jane@Example.com",
  subject: "beta",
  message: "Hello, I'd love to join the beta <3",
};

beforeEach(() => {
  silenceConsole();
  vi.stubEnv("BREVO_API_KEY", "");
  vi.stubEnv("CONTACT_TO_EMAIL", "");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
});

describe("POST /api/contact — English", () => {
  it("answers in English when the form was in English", async () => {
    const res = await post({ ...valid, locale: "en", message: "short" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "Your message is a bit short (at least 10 characters).",
    });
  });

  it("tells the team which language the visitor wrote from", async () => {
    vi.stubEnv("BREVO_API_KEY", "key");
    vi.stubEnv("CONTACT_TO_EMAIL", "team@laboon.test");
    const fetchMock = mockFetch(201);
    await post({ ...valid, locale: "en" });
    expect(sentJson(fetchMock).textContent).toContain("Langue : en");
  });
});

describe("POST /api/contact — validation", () => {
  it.each([
    [{ name: "  " }, "Indique ton nom."],
    [{ email: "nope" }, "Adresse email invalide."],
    [{ message: "short" }, "Ton message est un peu court (10 caractères minimum)."],
    [{ message: "x".repeat(5001) }, "Ton message est trop long (5000 caractères max)."],
  ])("rejects %j", async (override, error) => {
    const res = await post({ ...valid, ...override });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error });
  });

  it("rejects submissions sent too fast", async () => {
    expect((await post({ ...valid, elapsedMs: 100 })).status).toBe(400);
  });
});

describe("POST /api/contact — missing config", () => {
  it("dry-runs locally without Brevo", async () => {
    expect(await (await post(valid)).json()).toEqual({ ok: true, dryRun: true });
  });

  it("errors in production without a recipient", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("BREVO_API_KEY", "key");
    expect((await post(valid)).status).toBe(500);
  });
});

describe("POST /api/contact — Brevo", () => {
  beforeEach(() => {
    vi.stubEnv("BREVO_API_KEY", "key");
    vi.stubEnv("CONTACT_TO_EMAIL", "team@laboon-app.com");
  });

  it("emails the team with the visitor as reply-to, HTML-escaped", async () => {
    const fetchMock = mockFetch(201);
    const res = await post(valid);

    expect(await res.json()).toEqual({ ok: true });
    const payload = sentJson(fetchMock);
    expect(payload.to).toEqual([{ email: "team@laboon-app.com" }]);
    expect(payload.replyTo).toEqual({ email: "jane@example.com", name: "Jane" });
    expect(payload.subject).toBe("[Contact Laboon] Beta / tests — Jane");
    expect(payload.htmlContent).toContain("&lt;3");
    expect(payload.htmlContent).not.toContain("<3");
  });

  it("truncates overly long names", async () => {
    const fetchMock = mockFetch(201);
    await post({ ...valid, name: "n".repeat(300) });
    expect(sentJson(fetchMock).replyTo.name).toHaveLength(100);
  });

  it("returns 502 when Brevo refuses", async () => {
    mockFetch(401);
    expect((await post(valid)).status).toBe(502);
  });
});
