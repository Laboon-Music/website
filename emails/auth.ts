// The e-mails sent by the Laboon auth server (GoTrue): sign-up confirmation, password reset and e-mail change.
// GoTrue only loads a template from a URL, so `npm run emails` writes them to public/emails/auth/ and the site serves
// them (https://www.laboon-app.com/emails/auth/<name>.html). One file per mail holds both languages: GoTrue fills the
// `{{ … }}` variables, and English is chosen when the account's `legal_locale` (user metadata, set at sign-up) is
// "en", French otherwise. See docs/features/emails.md.

import type { Locale } from "../lib/i18n.ts";
import { button, p, renderEmail, small, title } from "./layout.ts";

const URL_VAR = "{{ .ConfirmationURL }}";
const gap = `<div style="height:20px;line-height:20px;">&nbsp;</div>`;
const link = `<a class="lnk" href="${URL_VAR}" style="color:#4753FF;word-break:break-all;">${URL_VAR}</a>`;

const TEXTS = {
  fr: {
    confirmation: {
      preheader: "Un clic pour activer ton compte.",
      title: "Bienvenue sur Laboon !",
      intro:
        "Plus qu’une étape : confirme ton adresse pour activer ton compte et trouver des musiciens près de chez toi.",
      button: "Confirmer mon adresse",
      fallback: "Le bouton ne marche pas ? Copie ce lien dans ton navigateur :",
      ignore: "Tu n’as pas créé de compte ? Ignore ce message, rien ne sera activé.",
    },
    recovery: {
      preheader: "Choisis un nouveau mot de passe pour ton compte.",
      title: "Nouveau mot de passe",
      intro:
        "Tu as demandé à réinitialiser ton mot de passe Laboon. Clique sur le bouton pour en choisir un nouveau.",
      button: "Choisir un nouveau mot de passe",
      once: "Le lien ne marche qu’une fois et expire au bout d’une heure.",
      fallback: "Le bouton ne marche pas ? Copie ce lien dans ton navigateur :",
      ignore:
        "Tu n’as rien demandé ? Ignore ce message, ton mot de passe reste inchangé.",
    },
    emailChange: {
      preheader: "Confirme le changement d’adresse de ton compte.",
      title: "Confirme ta nouvelle adresse",
      intro:
        "Tu as demandé à remplacer <strong>{{ .Email }}</strong> par <strong>{{ .NewEmail }}</strong> sur ton compte Laboon. Confirme ce changement pour l’appliquer.",
      button: "Confirmer le changement",
      fallback: "Le bouton ne marche pas ? Copie ce lien dans ton navigateur :",
      ignore:
        "Ce n’est pas toi ? Ignore ce message et écris-nous : ton adresse ne change pas tant que tu ne confirmes pas.",
    },
  },
  en: {
    confirmation: {
      preheader: "One click to activate your account.",
      title: "Welcome to Laboon!",
      intro:
        "One step left: confirm your address to activate your account and find musicians near you.",
      button: "Confirm my address",
      fallback: "The button does not work? Copy this link into your browser:",
      ignore:
        "Did not create an account? Ignore this message: nothing will be activated.",
    },
    recovery: {
      preheader: "Choose a new password for your account.",
      title: "New password",
      intro:
        "You asked to reset your Laboon password. Click the button to choose a new one.",
      button: "Choose a new password",
      once: "The link works once and expires after an hour.",
      fallback: "The button does not work? Copy this link into your browser:",
      ignore:
        "Did not ask for anything? Ignore this message: your password stays the same.",
    },
    emailChange: {
      preheader: "Confirm the address change on your account.",
      title: "Confirm your new address",
      intro:
        "You asked to replace <strong>{{ .Email }}</strong> with <strong>{{ .NewEmail }}</strong> on your Laboon account. Confirm this change to apply it.",
      button: "Confirm the change",
      fallback: "The button does not work? Copy this link into your browser:",
      ignore:
        "Wasn’t you? Ignore this message and write to us: your address does not change until you confirm.",
    },
  },
} satisfies Record<Locale, unknown>;

type Kind = "confirmation" | "recovery" | "emailChange";

function render(kind: Kind, locale: Locale): string {
  const t = TEXTS[locale][kind];
  const once = "once" in t ? [small(t.once)] : [];
  return renderEmail(
    {
      preheader: t.preheader,
      body: [
        title(t.title),
        gap,
        p(t.intro),
        button(t.button, URL_VAR),
        gap,
        ...once,
        small(`${t.fallback}<br>${link}`),
        small(t.ignore),
      ].join("\n"),
    },
    locale,
  );
}

/** Go template: English when the account's sign-up language is "en" (a missing value gives French). */
function bilingual(kind: Kind): string {
  return `{{ if and .Data .Data.legal_locale (eq .Data.legal_locale "en") }}${render(kind, "en")}{{ else }}${render(kind, "fr")}{{ end }}`;
}

/** File names match GoTrue's template types (MAILER_TEMPLATES_CONFIRMATION, _RECOVERY, _EMAIL_CHANGE). */
export const AUTH_EMAILS = [
  { file: "confirmation.html", html: bilingual("confirmation") },
  { file: "recovery.html", html: bilingual("recovery") },
  { file: "email_change.html", html: bilingual("emailChange") },
];

/** GoTrue subjects are plain strings (not translated), hence both languages. */
export const AUTH_SUBJECTS = {
  confirmation: "Bienvenue sur Laboon · Welcome to Laboon",
  recovery: "Nouveau mot de passe · New password",
  email_change: "Confirme ta nouvelle adresse · Confirm your new address",
};
