import { beforeEach, describe, expect, it, vi } from "vitest";
import { HUMAN, jsonRequest, mockFetch, sentJson, silenceConsole } from "@/tests/helpers";
import { POST } from "./route";

const CONFIG = [
  "LISTMONK_URL",
  "LISTMONK_API_USER",
  "LISTMONK_API_TOKEN",
  "LISTMONK_CONTACT_TEMPLATE_ID",
  "CONTACT_TO_EMAIL",
] as const;

function configureListmonk() {
  vi.stubEnv("LISTMONK_URL", "https://lists.laboon-app.com");
  vi.stubEnv("LISTMONK_API_USER", "laboon-website");
  vi.stubEnv("LISTMONK_API_TOKEN", "token");
  vi.stubEnv("LISTMONK_CONTACT_TEMPLATE_ID", "20");
  vi.stubEnv("CONTACT_TO_EMAIL", "team@laboon-app.com");
}

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
  for (const name of CONFIG) vi.stubEnv(name, "");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
});

describe("POST /api/contact — hardening", () => {
  it("rejects an oversized body", async () => {
    const res = await POST(
      jsonRequest("http://localhost:3000/api/contact", valid, {
        "content-length": "9999999",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("rejects an absurdly long e-mail address", async () => {
    const res = await post({ ...valid, email: `${"a".repeat(300)}@example.com` });
    expect(res.status).toBe(400);
  });

  it("keeps the name on one line in the e-mail subject (no header injection)", async () => {
    configureListmonk();
    const fetchMock = mockFetch(200);
    await post({ ...valid, name: "Jane\r\nBcc: evil@example.com" });
    const { name } = sentJson(fetchMock).data;
    expect(name).not.toMatch(/[\r\n]/);
    expect(name).toBe("Jane Bcc: evil@example.com");
  });
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
    configureListmonk();
    const fetchMock = mockFetch(200);
    await post({ ...valid, locale: "en" });
    expect(sentJson(fetchMock).data.locale).toBe("en");
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
  it("dry-runs locally without listmonk", async () => {
    expect(await (await post(valid)).json()).toEqual({ ok: true, dryRun: true });
  });

  it("errors in production without a recipient", async () => {
    vi.stubEnv("NODE_ENV", "production");
    configureListmonk();
    vi.stubEnv("CONTACT_TO_EMAIL", "");
    expect((await post(valid)).status).toBe(500);
  });
});

describe("POST /api/contact — listmonk", () => {
  beforeEach(configureListmonk);

  it("emails the team through the template, with the visitor as Reply-To", async () => {
    const fetchMock = mockFetch(200, { data: true });
    const res = await post(valid);

    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock.mock.calls[0][0]).toBe("https://lists.laboon-app.com/api/tx");
    expect(sentJson(fetchMock)).toEqual({
      subscriber_mode: "external",
      subscriber_emails: ["team@laboon-app.com"],
      template_id: 20,
      data: {
        name: "Jane",
        email: "jane@example.com",
        subject: "Beta / tests",
        message: "Hello, I'd love to join the beta <3",
        locale: "fr",
      },
      headers: [{ "Reply-To": "jane@example.com" }],
    });
  });

  it("truncates overly long names", async () => {
    const fetchMock = mockFetch(200);
    await post({ ...valid, name: "n".repeat(300) });
    expect(sentJson(fetchMock).data.name).toHaveLength(100);
  });

  it("errors online when the template id is not a number", async () => {
    vi.stubEnv("LISTMONK_CONTACT_TEMPLATE_ID", "contact");
    const fetchMock = mockFetch(200);
    expect((await post(valid)).status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 502 when listmonk refuses", async () => {
    mockFetch(400, { message: "template not found" });
    expect((await post(valid)).status).toBe(502);
  });

  it("returns 500 when listmonk is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    expect((await post(valid)).status).toBe(500);
  });
});
