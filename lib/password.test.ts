import { describe, expect, it } from "vitest";
import {
  apiErrorMessage,
  GENERIC_ACCOUNT_ERROR,
  isStrongPassword,
  MIN_PASSWORD_LENGTH,
  PASSWORD_RULES,
  validateNewPassword,
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

describe("validateNewPassword", () => {
  it("accepts a strong matching password", () => {
    expect(validateNewPassword(STRONG, STRONG)).toBeNull();
  });

  it("refuses a weak password", () => {
    expect(validateNewPassword("faible", "faible")).toMatch(/4 conditions/);
  });

  it("refuses mismatching passwords", () => {
    expect(validateNewPassword(STRONG, `${STRONG}x`)).toMatch(/ne correspondent pas/);
  });
});

describe("apiErrorMessage", () => {
  it("translates the stable API codes to French", () => {
    expect(apiErrorMessage("weak_password")).toMatch(/conditions/);
    expect(apiErrorMessage("rate_limited")).toMatch(/Trop de tentatives/);
    expect(apiErrorMessage("network")).toMatch(/connexion/);
  });

  it("never shows an unknown code or message", () => {
    expect(apiErrorMessage("whatever")).toBe(GENERIC_ACCOUNT_ERROR);
    expect(apiErrorMessage("")).toBe(GENERIC_ACCOUNT_ERROR);
  });
});
