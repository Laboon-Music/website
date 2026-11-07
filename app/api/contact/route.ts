import { checkAntibot, type AntibotFields } from "@/lib/antibot";
import { CONTACT_LIMITS, subjectEmailLabel, type ContactEmailData } from "@/lib/contact";
import { FEATURE_ENV, missingEnv, readEnv, readIdEnv } from "@/lib/env";
import { bodyLocale, errorsFor } from "@/lib/request-locale";
import { isProduction, jsonError, jsonOk, readJsonBody } from "@/lib/http";
import { fmt } from "@/lib/i18n";
import { listmonkCall } from "@/lib/listmonk";
import { reportError } from "@/lib/monitoring";
import { cleanText, isValidEmail, normalizeEmail } from "@/lib/validation";

// POST /api/contact — sends the contact form message to the team by email
// (listmonk transactional e-mail). See docs/features/contact-form.md.

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

  // One line, no control characters: the name ends up in the e-mail subject.
  const name = cleanText(body.name)
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .trim()
    .slice(0, CONTACT_LIMITS.nameMax);
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

  // Locally, a missing listmonk config is a "dry run" (logged in the terminal)
  // so the form can be tested without a token. Online it is a real error: never
  // show "Message envoyé" when the message went nowhere.
  const missing = missingEnv(FEATURE_ENV["contact form"]);
  if (missing.length) {
    if (!isProduction()) {
      console.log("[contact] dry run (listmonk not configured):", {
        name,
        email,
        subject,
        message,
      });
      return jsonOk({ dryRun: true });
    }
    reportError("contact", "listmonk is not configured", { missing });
    return jsonError(errors.sendFailed, 500);
  }

  const templateId = readIdEnv("LISTMONK_CONTACT_TEMPLATE_ID");
  if (templateId === null) {
    reportError("contact", "listmonk template id is not a positive integer");
    return jsonError(errors.sendFailed, 500);
  }

  // listmonk escapes the data in the template (emails/contact.ts) and builds
  // the subject from it: user content is never parsed as a template.
  const data: ContactEmailData = { name, email, subject, message, locale };

  try {
    // "external": the team inbox does not have to be a listmonk subscriber.
    // Reply-To = the visitor: hitting "Reply" in the mailbox answers them directly.
    const { ok } = await listmonkCall("contact", "/api/tx", {
      body: {
        subscriber_mode: "external",
        subscriber_emails: [readEnv("CONTACT_TO_EMAIL")],
        template_id: templateId,
        data,
        headers: [{ "Reply-To": email }],
      },
    });
    return ok ? jsonOk() : jsonError(errors.sendFailed, 502);
  } catch (err) {
    reportError("contact", "listmonk unreachable", {}, err);
    return jsonError(errors.network, 500);
  }
}
