// Password rules and error codes of the account pages (/reset-password,
// /confirm-email). The rules mirror the API (app/auth/password_policy.ts in
// Laboon-Music/api): the API is the judge, this only guides the visitor.
// Texts live in the dictionaries (content/<lang>/ui.ts).
// See docs/features/account-links.md.

export const MIN_PASSWORD_LENGTH = 12;

export type PasswordRuleId = "length" | "upper" | "digit" | "special";

export const PASSWORD_RULES: {
  id: PasswordRuleId;
  test: (password: string) => boolean;
}[] = [
  { id: "length", test: (p) => p.length >= MIN_PASSWORD_LENGTH },
  { id: "upper", test: (p) => /\p{Lu}/u.test(p) },
  { id: "digit", test: (p) => /\p{Nd}/u.test(p) },
  { id: "special", test: (p) => /[^\p{L}\p{Nd}]/u.test(p) },
];

export function isStrongPassword(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

/** What is wrong with the new password, or null when it is acceptable. */
export function passwordProblem(
  password: string,
  confirm: string,
): "invalidRules" | "mismatch" | null {
  if (!isStrongPassword(password)) return "invalidRules";
  if (password !== confirm) return "mismatch";
  return null;
}

export type ApiErrorKey =
  "weakPassword" | "validationFailed" | "rateLimited" | "apiNetwork" | "accountGeneric";

const API_ERROR_KEYS: Record<string, ApiErrorKey> = {
  weak_password: "weakPassword",
  validation_failed: "validationFailed",
  rate_limited: "rateLimited",
  network: "apiNetwork",
};

/**
 * The API answers with stable codes: they map to a dictionary message
 * (`ui.errors[key]`); its own (English) messages are never shown as-is.
 * `invalid_code` is handled by the pages.
 */
export function apiErrorKey(code: string): ApiErrorKey {
  return API_ERROR_KEYS[code] ?? "accountGeneric";
}
