import * as Sentry from "@sentry/nextjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { silenceConsole } from "@/tests/helpers";
import { initMonitoring, reportError, sentryEnvironment } from "./monitoring";

vi.mock("@sentry/nextjs", () => {
  const scope = { setTag: vi.fn(), setContext: vi.fn(), setExtra: vi.fn() };
  return {
    init: vi.fn(),
    captureException: vi.fn(),
    captureMessage: vi.fn(),
    withScope: vi.fn((fn: (s: typeof scope) => void) => fn(scope)),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("sentryEnvironment", () => {
  it.each([
    [undefined, "local"],
    ["main", "production"],
    ["staging", "staging"],
  ])("branch %s → %s", (branch, env) => {
    vi.stubEnv("VERCEL_GIT_COMMIT_REF", branch);
    expect(sentryEnvironment()).toBe(env);
  });
});

describe("initMonitoring", () => {
  it("does not start Sentry without a DSN", () => {
    vi.stubEnv("SENTRY_DSN", "");
    initMonitoring();
    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it("starts Sentry without collecting personal data when a DSN is set", () => {
    vi.stubEnv("SENTRY_DSN", "https://key@o0.ingest.sentry.io/1");
    initMonitoring();
    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        tracesSampleRate: 0,
        dataCollection: expect.objectContaining({
          userInfo: false,
          httpBodies: [],
          httpHeaders: false,
          stackFrameVariables: false,
        }),
      }),
    );
  });

  it("warns about missing variables in production", () => {
    const { warn } = silenceConsole();
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CONTACT_TO_EMAIL", "");
    initMonitoring();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("contact form: missing"));
  });
});

describe("reportError", () => {
  it("logs and sends a message to Sentry", () => {
    const { error } = silenceConsole();
    reportError("subscribe", "listmonk is not configured", { missing: ["X"] });
    expect(error).toHaveBeenCalled();
    expect(Sentry.captureMessage).toHaveBeenCalledWith(
      "[subscribe] listmonk is not configured",
      "error",
    );
  });

  it("sends exceptions as exceptions", () => {
    silenceConsole();
    const err = new Error("down");
    reportError("contact", "listmonk unreachable", {}, err);
    expect(Sentry.captureException).toHaveBeenCalledWith(err);
  });
});
