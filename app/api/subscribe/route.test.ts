import { beforeEach, describe, expect, it, vi } from "vitest";
import { HUMAN, jsonRequest, mockFetch, sentJson, silenceConsole } from "@/tests/helpers";
import { UI as FR } from "@/content/fr/ui";
import { UI as EN } from "@/content/en/ui";
import { POST } from "./route";

const URL_ = "https://staging.laboon-app.com/api/subscribe";
const post = (body: unknown) => POST(jsonRequest(URL_, body));
const valid = {
  ...HUMAN,
  email: " Jane@Example.com ",
  wantsLaunch: true,
  wantsBeta: false,
};

function configureBrevo() {
  vi.stubEnv("BREVO_API_KEY", "key");
  vi.stubEnv("BREVO_LIST_ID_LAUNCH", "7");
  vi.stubEnv("BREVO_LIST_ID_BETA", "8");
  vi.stubEnv("BREVO_DOI_TEMPLATE_ID", "1");
}

beforeEach(() => {
  silenceConsole();
  vi.stubEnv("BREVO_API_KEY", "");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
});

describe("POST /api/subscribe — validation", () => {
  it("rejects a non-JSON body", async () => {
    const res = await post("oops");
    expect(res.status).toBe(400);
  });

  it("rejects an invalid email", async () => {
    const res = await post({ ...valid, email: "nope" });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Adresse email invalide." });
  });

  it("requires at least one list", async () => {
    const res = await post({ ...valid, wantsLaunch: false });
    expect(await res.json()).toEqual({ error: FR.errors.noList });
  });

  it("does not treat truthy non-booleans as a list choice", async () => {
    const res = await post({ ...valid, wantsLaunch: "yes" });
    expect(res.status).toBe(400);
  });

  it("silently accepts bots that fill the honeypot", async () => {
    const fetchMock = mockFetch();
    configureBrevo();
    const res = await post({ ...valid, website: "x" });
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/subscribe — missing config", () => {
  it("dry-runs locally without Brevo", async () => {
    const res = await post(valid);
    expect(await res.json()).toEqual({ ok: true, dryRun: true });
  });

  it("errors in production without Brevo (never a fake success)", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const res = await post(valid);
    expect(res.status).toBe(500);
  });

  it("errors when a needed list id is missing", async () => {
    configureBrevo();
    vi.stubEnv("BREVO_LIST_ID_BETA", "");
    const res = await post({ ...valid, wantsBeta: true });
    expect(res.status).toBe(500);
  });

  it("errors when the double opt-in template id is missing", async () => {
    configureBrevo();
    vi.stubEnv("BREVO_DOI_TEMPLATE_ID", "");
    expect((await post(valid)).status).toBe(500);
  });
});

describe("POST /api/subscribe — Brevo", () => {
  beforeEach(configureBrevo);

  it("starts a double opt-in on the ticked lists", async () => {
    const fetchMock = mockFetch(201);
    const res = await post({ ...valid, wantsBeta: true });

    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.brevo.com/v3/contacts/doubleOptinConfirmation",
    );
    expect(sentJson(fetchMock)).toEqual({
      email: "jane@example.com",
      includeListIds: [7, 8],
      templateId: 1,
      redirectionUrl: "https://staging.laboon-app.com/inscription-confirmee",
      attributes: { SOURCE: "landing", LANGUAGE: "fr" },
    });
  });

  it("uses the English template, page and errors for English visitors", async () => {
    vi.stubEnv("BREVO_DOI_TEMPLATE_ID_EN", "2");
    const fetchMock = mockFetch(201);
    await post({ ...valid, locale: "en" });

    expect(sentJson(fetchMock)).toMatchObject({
      templateId: 2,
      redirectionUrl: "https://staging.laboon-app.com/en/inscription-confirmee",
      attributes: { SOURCE: "landing", LANGUAGE: "en" },
    });
    const res = await post({ ...valid, locale: "en", email: "nope" });
    expect(await res.json()).toEqual({ error: EN.errors.invalidEmail });
  });

  it("falls back to the French template when no English one is configured", async () => {
    const fetchMock = mockFetch(201);
    await post({ ...valid, locale: "en" });
    expect(sentJson(fetchMock)).toMatchObject({ templateId: 1 });
  });

  it("returns 502 when Brevo refuses", async () => {
    mockFetch(400, { code: "invalid_parameter" });
    expect((await post(valid)).status).toBe(502);
  });

  it("returns 500 when Brevo is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    expect((await post(valid)).status).toBe(500);
  });
});
