import { checkAntibot, type AntibotFields } from "@/lib/antibot";
import { brevoPost } from "@/lib/brevo";
import { FEATURE_ENV, missingEnv, readEnv, readIdEnv } from "@/lib/env";
import { localePath } from "@/lib/i18n";
import { bodyLocale, errorsFor } from "@/lib/request-locale";
import { isProduction, jsonError, jsonOk, readJsonBody } from "@/lib/http";
import { reportError } from "@/lib/monitoring";
import { isValidEmail, normalizeEmail } from "@/lib/validation";

// POST /api/subscribe — newsletter signup (launch and/or beta lists) with Brevo
// double opt-in. See docs/features/newsletter-signup.md.

/** Brevo template of the confirmation e-mail: one per language (English falls back to French). */
function confirmationTemplateId(locale: string): number | null {
  const french = readIdEnv("BREVO_DOI_TEMPLATE_ID");
  return locale === "en" ? (readIdEnv("BREVO_DOI_TEMPLATE_ID_EN") ?? french) : french;
}

type SubscribeBody = AntibotFields & {
  email: unknown;
  wantsLaunch: unknown;
  wantsBeta: unknown;
};

export async function POST(request: Request) {
  const body = await readJsonBody<SubscribeBody>(request);
  const locale = bodyLocale(body);
  const errors = errorsFor(locale);
  if (!body) return jsonError(errors.invalidRequest, 400);

  const blocked = await checkAntibot(body, request);
  if (blocked) return blocked;

  const email = normalizeEmail(body.email);
  const wantsLaunch = body.wantsLaunch === true;
  const wantsBeta = body.wantsBeta === true;

  if (!isValidEmail(email)) return jsonError(errors.invalidEmail, 400);
  if (!wantsLaunch && !wantsBeta) return jsonError(errors.noList, 400);

  // Locally, without a Brevo key, the signup is a "dry run" (logged in the
  // terminal). Online, or with a half-configured Brevo, it is a real error:
  // never show "Merci" when nothing was saved.
  if (!readEnv("BREVO_API_KEY") && !isProduction()) {
    console.log("[subscribe] dry run (Brevo not configured):", {
      email,
      wantsLaunch,
      wantsBeta,
    });
    return jsonOk({ dryRun: true });
  }
  const missing = missingEnv(FEATURE_ENV["newsletter signup"]);
  if (missing.length) {
    reportError("subscribe", "Brevo is not configured", { missing });
    return jsonError(errors.subscribeFailed, 500);
  }

  const apiKey = readEnv("BREVO_API_KEY")!;
  const templateId = confirmationTemplateId(locale);
  const launchListId = readIdEnv("BREVO_LIST_ID_LAUNCH");
  const betaListId = readIdEnv("BREVO_LIST_ID_BETA");
  if (templateId === null || launchListId === null || betaListId === null) {
    reportError("subscribe", "Brevo list/template id is not a positive integer");
    return jsonError(errors.subscribeFailed, 500);
  }
  // Brevo lists matching the ticked boxes.
  const listIds = [wantsLaunch && launchListId, wantsBeta && betaListId].filter(
    (id): id is number => typeof id === "number",
  );

  try {
    // Double opt-in: Brevo emails a confirmation link. The contact joins the
    // lists only after clicking it, then lands on /inscription-confirmee of the
    // same site (prod or staging).
    const sent = await brevoPost(
      "/contacts/doubleOptinConfirmation",
      apiKey,
      {
        email,
        includeListIds: listIds,
        templateId,
        redirectionUrl: `${new URL(request.url).origin}${localePath(locale, "/inscription-confirmee")}`,
        attributes: { SOURCE: "landing", LANGUAGE: locale },
      },
      "subscribe",
    );
    return sent ? jsonOk() : jsonError(errors.subscribeFailed, 502);
  } catch (err) {
    reportError("subscribe", "Brevo unreachable", {}, err);
    return jsonError(errors.network, 500);
  }
}
