import { beforeEach, describe, expect, it, vi } from "vitest";
import { HUMAN, jsonRequest, mockFetch, sentJson, silenceConsole } from "@/tests/helpers";
import { UI as FR } from "@/content/fr/ui";
import { UI as EN } from "@/content/en/ui";
import { POST } from "./route";

const URL_ = "https://staging.laboon-app.com/api/subscribe";
const LISTMONK = "https://lists.laboon-app.com";
const post = (body: unknown) => POST(jsonRequest(URL_, body));
const valid = {
  ...HUMAN,
  email: " Jane@Example.com ",
  wantsLaunch: true,
  wantsBeta: false,
};

function configureListmonk() {
  vi.stubEnv("LISTMONK_URL", LISTMONK);
  vi.stubEnv("LISTMONK_API_USER", "laboon-website");
  vi.stubEnv("LISTMONK_API_TOKEN", "token");
  vi.stubEnv("LISTMONK_LIST_ID_LAUNCH", "7");
  vi.stubEnv("LISTMONK_LIST_ID_BETA", "8");
}

/** Answers each fetch call with the next [status, json] of `replies`. */
function mockReplies(...replies: [number, unknown][]) {
  const fetchMock = mockFetch();
  for (const [status, data] of replies) {
    fetchMock.mockImplementationOnce(async () => Response.json(data, { status }));
  }
  return fetchMock;
}

beforeEach(() => {
  silenceConsole();
  vi.stubEnv("LISTMONK_API_TOKEN", "");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "");
});

describe("POST /api/subscribe — validation", () => {
  it("rejects an absurdly long e-mail address", async () => {
    const res = await post({ ...valid, email: `${"a".repeat(300)}@example.com` });
    expect(res.status).toBe(400);
  });

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
    configureListmonk();
    const res = await post({ ...valid, website: "x" });
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/subscribe — missing config", () => {
  it("dry-runs locally without listmonk", async () => {
    const res = await post(valid);
    expect(await res.json()).toEqual({ ok: true, dryRun: true });
  });

  it("errors in production without listmonk (never a fake success)", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const res = await post(valid);
    expect(res.status).toBe(500);
  });

  it("errors when the listmonk URL is missing", async () => {
    configureListmonk();
    vi.stubEnv("LISTMONK_URL", "");
    expect((await post(valid)).status).toBe(500);
  });

  it("errors when a list id is not a number", async () => {
    configureListmonk();
    vi.stubEnv("LISTMONK_LIST_ID_BETA", "beta");
    const res = await post({ ...valid, wantsBeta: true });
    expect(res.status).toBe(500);
  });
});

describe("POST /api/subscribe — new subscriber", () => {
  beforeEach(configureListmonk);

  it("creates the subscriber on the ticked lists, opt-in e-mail sent by listmonk", async () => {
    const fetchMock = mockFetch(200, { data: { id: 1 } });
    const res = await post({ ...valid, wantsBeta: true });

    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(`${LISTMONK}/api/subscribers`);
    expect(sentJson(fetchMock)).toEqual({
      email: "jane@example.com",
      status: "enabled",
      lists: [7, 8],
      attribs: { language: "fr", source: "landing" },
      preconfirm_subscriptions: false,
    });
  });

  it("only subscribes to the ticked list", async () => {
    const fetchMock = mockFetch(200);
    await post({ ...valid, wantsLaunch: false, wantsBeta: true });
    expect(sentJson(fetchMock).lists).toEqual([8]);
  });

  it("records English visitors so the opt-in e-mail is in English", async () => {
    const fetchMock = mockFetch(200);
    await post({ ...valid, locale: "en" });
    expect(sentJson(fetchMock).attribs).toEqual({ language: "en", source: "landing" });

    const res = await post({ ...valid, locale: "en", email: "nope" });
    expect(await res.json()).toEqual({ error: EN.errors.invalidEmail });
  });

  it("returns 502 when listmonk refuses", async () => {
    mockFetch(400, { message: "invalid" });
    expect((await post(valid)).status).toBe(502);
  });

  it("returns 500 when listmonk is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));
    expect((await post(valid)).status).toBe(500);
  });
});

describe("POST /api/subscribe — already a subscriber", () => {
  beforeEach(configureListmonk);

  it("adds the lists through the public endpoint, with their UUIDs", async () => {
    const fetchMock = mockReplies(
      [409, { message: "E-mail already exists." }],
      [200, { data: { id: 7, uuid: "uuid-launch" } }],
      [200, { data: { id: 8, uuid: "uuid-beta" } }],
      [200, { data: { has_optin: true } }],
    );
    const res = await post({ ...valid, wantsBeta: true });

    expect(await res.json()).toEqual({ ok: true });
    const urls = fetchMock.mock.calls.map(([url]) => url);
    expect(urls).toEqual([
      `${LISTMONK}/api/subscribers`,
      `${LISTMONK}/api/lists/7`,
      `${LISTMONK}/api/lists/8`,
      `${LISTMONK}/api/public/subscription`,
    ]);
    expect(sentJson(fetchMock, 3)).toEqual({
      email: "jane@example.com",
      list_uuids: ["uuid-launch", "uuid-beta"],
    });
    const publicHeaders = fetchMock.mock.calls[3][1]?.headers as Record<string, string>;
    expect(publicHeaders.Authorization).toBeUndefined();
  });

  it("returns 502 when a list cannot be read", async () => {
    mockReplies([409, {}], [403, { message: "permission denied" }]);
    expect((await post(valid)).status).toBe(502);
  });

  it("returns 502 when a list answer has no UUID", async () => {
    mockReplies([409, {}], [200, { data: { id: 7 } }]);
    expect((await post(valid)).status).toBe(502);
  });

  it("returns 502 when the public endpoint refuses", async () => {
    mockReplies([409, {}], [200, { data: { uuid: "uuid-launch" } }], [400, {}]);
    expect((await post(valid)).status).toBe(502);
  });
});
