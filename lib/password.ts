// Password rules and error messages of the account pages (/reset-password,
// /confirm-email). The rules mirror the API (app/auth/password_policy.ts in
// Laboon-Music/api): the API is the judge, this only guides the visitor.
// See docs/features/account-links.md.

export const MIN_PASSWORD_LENGTH = 12;

export type PasswordRule = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: `${MIN_PASSWORD_LENGTH} caractères minimum`,
    test: (p) => p.length >= MIN_PASSWORD_LENGTH,
  },
  { id: "upper", label: "Une majuscule", test: (p) => /\p{Lu}/u.test(p) },
  { id: "digit", label: "Un chiffre", test: (p) => /\p{Nd}/u.test(p) },
  {
    id: "special",
    label: "Un caractère spécial (ni lettre ni chiffre)",
    test: (p) => /[^\p{L}\p{Nd}]/u.test(p),
  },
];

export function isStrongPassword(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

/** Returns the French error to display, or null when the new password is acceptable. */
export function validateNewPassword(password: string, confirm: string): string | null {
  if (!isStrongPassword(password)) {
    return "Ton mot de passe doit respecter les 4 conditions ci-dessus.";
  }
  if (password !== confirm) return "Les mots de passe ne correspondent pas.";
  return null;
}

export const GENERIC_ACCOUNT_ERROR =
  "Impossible de terminer pour le moment. Réessaie dans un instant.";

/** The API answers with stable codes: never show its (English) messages as-is. */
const API_ERRORS: Record<string, string> = {
  weak_password: "Ce mot de passe ne respecte pas les conditions ci-dessus.",
  validation_failed: "Vérifie les informations saisies et réessaie.",
  rate_limited: "Trop de tentatives. Patiente quelques minutes et réessaie.",
  network: "Impossible de joindre le serveur. Vérifie ta connexion et réessaie.",
};

/** French message for an API error code; `invalid_code` is handled by the pages. */
export function apiErrorMessage(code: string): string {
  return API_ERRORS[code] ?? GENERIC_ACCOUNT_ERROR;
}
