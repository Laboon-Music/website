import { describe, expect, it } from "vitest";
import {
  apiErrorKey,
  isStrongPassword,
  MIN_PASSWORD_LENGTH,
  PASSWORD_RULES,
  passwordProblem,
} from "./password";

const STRONG = "Un-bon-mot-2-passe";

describe("password rules (mirror of the API policy)", () => {
  it("accepts 12+ characters with an uppercase letter, a digit and a special character", () => {
    expect(isStrongPassword(STRONG)).toBe(true);
    expect(MIN_PASSWORD_LENGTH).toBe(12);
  });

  it.each([
    ["too short", "Aa1-bcdefg"],
    ["no uppercase", "un-bon-mot-2-passe"],
    ["no digit", "Un-bon-mot-de-passe"],
    ["no special character", "UnBonMotDePasse2"],
  ])("rejects a password with %s", (_, password) => {
    expect(isStrongPassword(password)).toBe(false);
  });

  it("counts accented letters as letters, not special characters", () => {
    expect(isStrongPassword("Éléphantdorée1")).toBe(false);
    expect(isStrongPassword("Éléphant-dorée1")).toBe(true);
  });

  it("lists each rule so the form can show them", () => {
    expect(PASSWORD_RULES.map((r) => r.id)).toEqual([
      "length",
      "upper",
      "digit",
      "special",
    ]);
  });
});

describe("passwordProblem", () => {
  it("accepts a strong matching password", () => {
    expect(passwordProblem(STRONG, STRONG)).toBeNull();
  });

  it("flags a weak password first, then a mismatch", () => {
    expect(passwordProblem("faible", "faible")).toBe("invalidRules");
    expect(passwordProblem(STRONG, `${STRONG}x`)).toBe("mismatch");
  });
});

describe("apiErrorKey", () => {
  it("maps the stable API codes to dictionary keys", () => {
    expect(apiErrorKey("weak_password")).toBe("weakPassword");
    expect(apiErrorKey("rate_limited")).toBe("rateLimited");
    expect(apiErrorKey("network")).toBe("apiNetwork");
  });

  it("never exposes an unknown code or message", () => {
    expect(apiErrorKey("whatever")).toBe("accountGeneric");
    expect(apiErrorKey("")).toBe("accountGeneric");
  });
});
