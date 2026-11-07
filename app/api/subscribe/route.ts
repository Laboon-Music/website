import { checkAntibot, type AntibotFields } from "@/lib/antibot";
import { FEATURE_ENV, missingEnv, readEnv, readIdEnv } from "@/lib/env";
import { bodyLocale, errorsFor } from "@/lib/request-locale";
import { isProduction, jsonError, jsonOk, readJsonBody } from "@/lib/http";
import { listmonkCall } from "@/lib/listmonk";
import { reportError } from "@/lib/monitoring";
import { isValidEmail, normalizeEmail } from "@/lib/validation";

// POST /api/subscribe — newsletter signup (launch and/or beta lists) with listmonk
// double opt-in. See docs/features/newsletter-signup.md.

type SubscribeBody = AntibotFields & {
  email: unknown;
  wantsLaunch: unknown;
  wantsBeta: unknown;
};

const FEATURE = "subscribe";

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

  // Locally, without a listmonk token, the signup is a "dry run" (logged in the
  // terminal). Online, or with a half-configured listmonk, it is a real error:
  // never show "Merci" when nothing was saved.
  if (!readEnv("LISTMONK_API_TOKEN") && !isProduction()) {
    console.log("[subscribe] dry run (listmonk not configured):", {
      email,
      wantsLaunch,
      wantsBeta,
    });
    return jsonOk({ dryRun: true });
  }
  const missing = missingEnv(FEATURE_ENV["newsletter signup"]);
  if (missing.length) {
    reportError(FEATURE, "listmonk is not configured", { missing });
    return jsonError(errors.subscribeFailed, 500);
  }

  const launchListId = readIdEnv("LISTMONK_LIST_ID_LAUNCH");
  const betaListId = readIdEnv("LISTMONK_LIST_ID_BETA");
  if (launchListId === null || betaListId === null) {
    reportError(FEATURE, "listmonk list id is not a positive integer");
    return jsonError(errors.subscribeFailed, 500);
  }
  // listmonk lists matching the ticked boxes.
  const listIds = [wantsLaunch && launchListId, wantsBeta && betaListId].filter(
    (id): id is number => typeof id === "number",
  );

  try {
    // Double opt-in lists: listmonk e-mails a confirmation link and the
    // subscription stays "unconfirmed" until it is clicked. `language` picks
    // the language of that e-mail (emails/dist/listmonk/subscriber-optin.html).
    const created = await listmonkCall(FEATURE, "/api/subscribers", {
      body: {
        email,
        status: "enabled",
        lists: listIds,
        attribs: { language: locale, source: "landing" },
        preconfirm_subscriptions: false,
      },
      expected: [409],
    });
    if (created.ok) return jsonOk();
    if (created.status !== 409) return jsonError(errors.subscribeFailed, 502);

    // Already a subscriber (other list, app account, second try): the public
    // endpoint adds the lists, keeps the attributes and sends the opt-in again.
    const added = await addToLists(email, listIds);
    return added ? jsonOk() : jsonError(errors.subscribeFailed, 502);
  } catch (err) {
    reportError(FEATURE, "listmonk unreachable", {}, err);
    return jsonError(errors.network, 500);
  }
}

/** Subscribes an existing contact through `/api/public/subscription`, which takes list UUIDs. */
async function addToLists(email: string, listIds: number[]): Promise<boolean> {
  const uuids: string[] = [];
  for (const id of listIds) {
    const list = await listmonkCall(FEATURE, `/api/lists/${id}`, { method: "GET" });
    const uuid = (list.data as { data?: { uuid?: unknown } } | null)?.data?.uuid;
    if (!list.ok) return false;
    if (typeof uuid !== "string") {
      reportError(FEATURE, "listmonk list has no uuid", { listId: id });
      return false;
    }
    uuids.push(uuid);
  }
  const res = await listmonkCall(FEATURE, "/api/public/subscription", {
    body: { email, list_uuids: uuids },
    auth: false,
  });
  return res.ok;
}
