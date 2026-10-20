// Single place listing and reading every environment variable.
// See .env.example and docs/deployment.md.

export const ENV_NAMES = [
  "BREVO_API_KEY",
  "BREVO_LIST_ID_LAUNCH",
  "BREVO_LIST_ID_BETA",
  "BREVO_DOI_TEMPLATE_ID",
  "BREVO_DOI_TEMPLATE_ID_EN",
  "CONTACT_TO_EMAIL",
  "TURNSTILE_SECRET_KEY",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_API_STAGING_HEADER",
  "SENTRY_DSN",
] as const;

export type EnvName = (typeof ENV_NAMES)[number];

/**
 * Public values inlined into the browser bundle. Next.js only inlines
 * `process.env.NEXT_PUBLIC_*` written literally, so they cannot go through
 * `readEnv()` in client code.
 */
export const publicEnv = {
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || undefined,
  apiStagingHeader: process.env.NEXT_PUBLIC_API_STAGING_HEADER || undefined,
};

/** Server-side read: trimmed value, or undefined when unset or blank. */
export function readEnv(name: EnvName): string | undefined {
  return process.env[name]?.trim() || undefined;
}

/** Positive integer id (Brevo list, template); null if missing or invalid. */
export function readIdEnv(name: EnvName): number | null {
  const id = Number(readEnv(name));
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** Names among `names` that are unset or blank. */
export function missingEnv(names: readonly EnvName[]): EnvName[] {
  return names.filter((name) => readEnv(name) === undefined);
}

/** Variables each feature needs to run for real (not dry run / disabled). */
export const FEATURE_ENV: Record<string, readonly EnvName[]> = {
  "newsletter signup": [
    "BREVO_API_KEY",
    "BREVO_LIST_ID_LAUNCH",
    "BREVO_LIST_ID_BETA",
    "BREVO_DOI_TEMPLATE_ID",
  ],
  "contact form": ["BREVO_API_KEY", "CONTACT_TO_EMAIL"],
  "Turnstile anti-bot": ["NEXT_PUBLIC_TURNSTILE_SITE_KEY", "TURNSTILE_SECRET_KEY"],
  "account links (password reset, e-mail confirmation)": ["NEXT_PUBLIC_API_URL"],
  "error monitoring": ["SENTRY_DSN"],
};

/** One line per feature with missing variables (empty when all is set). */
export function envReport(): string[] {
  return Object.entries(FEATURE_ENV).flatMap(([feature, names]) => {
    const missing = missingEnv(names);
    return missing.length ? [`${feature}: missing ${missing.join(", ")}`] : [];
  });
}
