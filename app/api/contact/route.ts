import { checkAntibot, type AntibotFields } from "@/lib/antibot";
import { BREVO_SENDER_EMAIL, brevoPost } from "@/lib/brevo";
import { CONTACT_LIMITS, subjectEmailLabel } from "@/lib/contact";
import { FEATURE_ENV, missingEnv, readEnv } from "@/lib/env";
import { bodyLocale, errorsFor } from "@/lib/request-locale";
import { isProduction, jsonError, jsonOk, readJsonBody } from "@/lib/http";
import { fmt } from "@/lib/i18n";
import { reportError } from "@/lib/monitoring";
import { cleanText, escapeHtml, isValidEmail, normalizeEmail } from "@/lib/validation";

// POST /api/contact — sends the contact form message to the team by email
// (Brevo transactional email). See docs/features/contact-form.md.

type ContactBody = AntibotFields & {
  name: unknown;
  email: unknown;
  subject: unknown;
  message: unknown;
};

export async function POST(request: Request) {
  const body = await readJsonBody<ContactBody>(request);
  const locale = bodyLocale(body);
  const errors = errorsFor(locale);
  if (!body) return jsonError(errors.invalidRequest, 400);

  const blocked = await checkAntibot(body, request);
  if (blocked) return blocked;

  const name = cleanText(body.name).slice(0, CONTACT_LIMITS.nameMax);
  const email = normalizeEmail(body.email);
  const subject = subjectEmailLabel(body.subject);
  const message = cleanText(body.message);

  if (!name) return jsonError(errors.nameRequired, 400);
  if (!isValidEmail(email)) return jsonError(errors.invalidEmail, 400);
  if (message.length < CONTACT_LIMITS.messageMin) {
    return jsonError(fmt(errors.messageShort, { min: CONTACT_LIMITS.messageMin }), 400);
  }
  if (message.length > CONTACT_LIMITS.messageMax) {
    return jsonError(fmt(errors.messageLong, { max: CONTACT_LIMITS.messageMax }), 400);
  }

  // Locally, a missing Brevo config is a "dry run" (logged in the terminal) so
  // the form can be tested without an API key. Online it is a real error: never
  // show "Message envoyé" when the message went nowhere.
  const missing = missingEnv(FEATURE_ENV["contact form"]);
  if (missing.length) {
    if (!isProduction()) {
      console.log("[contact] dry run (Brevo not configured):", {
        name,
        email,
        subject,
        message,
      });
      return jsonOk({ dryRun: true });
    }
    reportError("contact", "Brevo is not configured", { missing });
    return jsonError(errors.sendFailed, 500);
  }

  const apiKey = readEnv("BREVO_API_KEY")!;
  const to = readEnv("CONTACT_TO_EMAIL")!;

  try {
    // replyTo = the visitor: hitting "Reply" in the mailbox answers them directly.
    const sent = await brevoPost(
      "/smtp/email",
      apiKey,
      {
        sender: { name: "Laboon - Contact", email: BREVO_SENDER_EMAIL },
        to: [{ email: to }],
        replyTo: { email, name },
        subject: `[Contact Laboon] ${subject} — ${name}`,
        htmlContent: `
          <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
          <p><strong>Email :</strong> ${escapeHtml(email)}</p>
          <p><strong>Sujet :</strong> ${escapeHtml(subject)}</p>
          <p><strong>Langue :</strong> ${locale}</p>
          <hr />
          <p style="white-space: pre-wrap">${escapeHtml(message)}</p>
        `,
        textContent: `Nom : ${name}\nEmail : ${email}\nSujet : ${subject}\nLangue : ${locale}\n\n${message}`,
        tags: ["contact"],
      },
      "contact",
    );
    return sent ? jsonOk() : jsonError(errors.sendFailed, 502);
  } catch (err) {
    reportError("contact", "Brevo unreachable", {}, err);
    return jsonError(errors.network, 500);
  }
}
