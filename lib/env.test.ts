import { describe, expect, it, vi } from "vitest";
import { ENV_NAMES, envReport, FEATURE_ENV, missingEnv, readEnv, readIdEnv } from "./env";

function clearAll() {
  for (const name of ENV_NAMES) vi.stubEnv(name, "");
}

describe("readEnv", () => {
  it("trims values and treats blank as unset", () => {
    vi.stubEnv("CONTACT_TO_EMAIL", "  team@laboon-app.com ");
    expect(readEnv("CONTACT_TO_EMAIL")).toBe("team@laboon-app.com");
    vi.stubEnv("CONTACT_TO_EMAIL", "   ");
    expect(readEnv("CONTACT_TO_EMAIL")).toBeUndefined();
  });
});

describe("readIdEnv", () => {
  it("reads a positive integer", () => {
    vi.stubEnv("LISTMONK_LIST_ID_BETA", "8");
    expect(readIdEnv("LISTMONK_LIST_ID_BETA")).toBe(8);
  });

  it.each(["", "abc", "0", "-3", "1.5"])("returns null for %j", (value) => {
    vi.stubEnv("LISTMONK_LIST_ID_BETA", value);
    expect(readIdEnv("LISTMONK_LIST_ID_BETA")).toBeNull();
  });
});

describe("missingEnv / envReport", () => {
  it("lists missing variables per feature", () => {
    clearAll();
    vi.stubEnv("LISTMONK_URL", "https://lists.example.com");
    vi.stubEnv("LISTMONK_API_USER", "website");
    vi.stubEnv("LISTMONK_API_TOKEN", "token");
    vi.stubEnv("LISTMONK_CONTACT_TEMPLATE_ID", "20");
    expect(missingEnv(FEATURE_ENV["contact form"])).toEqual(["CONTACT_TO_EMAIL"]);
    expect(envReport()).toContain("contact form: missing CONTACT_TO_EMAIL");
  });

  it("is empty when everything is configured", () => {
    for (const name of ENV_NAMES) vi.stubEnv(name, "1");
    expect(envReport()).toEqual([]);
  });

  it("only references declared variables", () => {
    for (const names of Object.values(FEATURE_ENV)) {
      for (const name of names) expect(ENV_NAMES).toContain(name);
    }
  });
});
