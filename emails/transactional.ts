// The transactional e-mails sent by the Laboon API through Brevo templates (one template per e-mail and language,
// api#99). Only the `{{ params.… }}` variables the API sends are used: no contact attributes, no `safe` filter (Brevo
// escapes params, so a first name holding HTML shows as text), no tracking pixel. Links come only from
// `{{ params.link }}`. Wording from the API's resources/lang/{fr,en}/emails.json. See docs/features/emails.md.

import { LOCALES, type Locale } from "../lib/i18n.ts";
import { COLORS, button, p, renderEmail, small, title } from "./layout.ts";

const v = (name: string) => `{{ params.${name} }}`;
const gap = `<div style="height:20px;line-height:20px;">&nbsp;</div>`;

type Texts = {
  subject: string;
  preheader: string;
  title: string;
  body: string;
  forgot?: string;
  button?: string;
  expiry?: string;
  ignore: string;
  warningLead?: string;
  warning?: string;
};

const COMMON = {
  fr: {
    greeting: `Bonjour ${v("firstName")},`,
    fallback: "Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :",
    signature: "— L’équipe Laboon 🐳",
    footer: "Tu reçois cet email parce qu’un compte Laboon utilise cette adresse.",
  },
  en: {
    greeting: `Hi ${v("firstName")},`,
    fallback: "If the button does not work, copy this link into your browser:",
    signature: "— The Laboon team 🐳",
    footer: "You are receiving this email because a Laboon account uses this address.",
  },
} satisfies Record<Locale, unknown>;

const TEXTS = {
  fr: {
    confirm_signup: {
      subject: "Confirme ton adresse email Laboon",
      preheader: "Un clic pour terminer ton inscription.",
      title: "Bienvenue sur Laboon !",
      body: "Pour terminer ton inscription, confirme ton adresse email.",
      button: "Confirmer mon email",
      ignore: "Si tu n’as pas créé de compte Laboon, ignore cet email.",
    },
    account_exists: {
      subject: "Tu as déjà un compte Laboon",
      preheader: "Connecte-toi avec ton mot de passe habituel.",
      title: "Tu as déjà un compte",
      body: "Quelqu’un, sans doute toi, a voulu créer un compte Laboon avec cette adresse email. Un compte existe déjà : connecte-toi avec ton mot de passe habituel.",
      forgot: "Tu as oublié ton mot de passe ? Tu peux le réinitialiser :",
      button: "Réinitialiser mon mot de passe",
      ignore:
        "Si tu n’es pas à l’origine de cette demande, ignore cet email : ton compte ne change pas.",
    },
    password_reset: {
      subject: "Réinitialise ton mot de passe Laboon",
      preheader: "Choisis un nouveau mot de passe pour ton compte.",
      title: "Mot de passe oublié ?",
      body: "Tu as demandé à réinitialiser le mot de passe de ton compte Laboon.",
      button: "Choisir un nouveau mot de passe",
      expiry: `Ce lien est valable ${v("expiresIn")} et ne sert qu’une fois.`,
      ignore:
        "Si tu n’es pas à l’origine de cette demande, ignore cet email : ton mot de passe ne change pas.",
    },
    password_changed: {
      subject: "Ton mot de passe Laboon a été modifié",
      preheader: "Le mot de passe de ton compte vient de changer.",
      title: "Mot de passe modifié",
      body: "Le mot de passe de ton compte Laboon vient d’être modifié.",
      ignore: "Si tu es à l’origine de ce changement, tu peux ignorer cet email.",
      warningLead: "Si ce n’est pas toi",
      warning:
        ", réinitialise ton mot de passe immédiatement depuis l’application et contacte-nous.",
    },
    sign_in_method_added: {
      subject: "Un moyen de connexion a été ajouté à ton compte Laboon",
      preheader: "Un nouveau moyen de connexion est actif sur ton compte.",
      title: "Moyen de connexion ajouté",
      body: `La connexion avec ${v("providerName")} a été ajoutée à ton compte Laboon le ${v("date")} (UTC).`,
      ignore: "Si c’est toi, tu peux ignorer cet email.",
      warningLead: "Si ce n’est pas toi",
      warning:
        ", retire ce moyen de connexion depuis l’application, change ton mot de passe et contacte-nous.",
    },
    sign_in_method_removed: {
      subject: "Un moyen de connexion a été retiré de ton compte Laboon",
      preheader: "Un moyen de connexion a été retiré de ton compte.",
      title: "Moyen de connexion retiré",
      body: `La connexion avec ${v("providerName")} a été retirée de ton compte Laboon le ${v("date")} (UTC).`,
      ignore: "Si c’est toi, tu peux ignorer cet email.",
      warningLead: "Si ce n’est pas toi",
      warning:
        ", vérifie les moyens de connexion de ton compte depuis l’application, change ton mot de passe et contacte-nous.",
    },
  },
  en: {
    confirm_signup: {
      subject: "Confirm your Laboon email address",
      preheader: "One click to finish signing up.",
      title: "Welcome to Laboon!",
      body: "To finish signing up, please confirm your email address.",
      button: "Confirm my email",
      ignore: "If you did not create a Laboon account, you can ignore this email.",
    },
    account_exists: {
      subject: "You already have a Laboon account",
      preheader: "Sign in with your usual password.",
      title: "You already have an account",
      body: "Someone, probably you, tried to create a Laboon account with this email address. An account already exists: sign in with your usual password.",
      forgot: "Forgot your password? You can reset it:",
      button: "Reset my password",
      ignore:
        "If you did not ask for this, you can ignore this email: your account stays the same.",
    },
    password_reset: {
      subject: "Reset your Laboon password",
      preheader: "Choose a new password for your account.",
      title: "Forgot your password?",
      body: "You asked to reset the password of your Laboon account.",
      button: "Choose a new password",
      expiry: `This link is valid for ${v("expiresIn")} and can be used only once.`,
      ignore:
        "If you did not ask for this, you can ignore this email: your password stays the same.",
    },
    password_changed: {
      subject: "Your Laboon password was changed",
      preheader: "The password of your account just changed.",
      title: "Password changed",
      body: "The password of your Laboon account was just changed.",
      ignore: "If you made this change, you can ignore this email.",
      warningLead: "If it was not you",
      warning: ", reset your password right away from the app and contact us.",
    },
    sign_in_method_added: {
      subject: "A sign-in method was added to your Laboon account",
      preheader: "A new sign-in method is active on your account.",
      title: "Sign-in method added",
      body: `Sign in with ${v("providerName")} was added to your Laboon account on ${v("date")} (UTC).`,
      ignore: "If you made this change, you can ignore this email.",
      warningLead: "If it was not you",
      warning:
        ", remove this sign-in method from the app, change your password and contact us.",
    },
    sign_in_method_removed: {
      subject: "A sign-in method was removed from your Laboon account",
      preheader: "A sign-in method was removed from your account.",
      title: "Sign-in method removed",
      body: `Sign in with ${v("providerName")} was removed from your Laboon account on ${v("date")} (UTC).`,
      ignore: "If you made this change, you can ignore this email.",
      warningLead: "If it was not you",
      warning:
        ", check the sign-in methods of your account from the app, change your password and contact us.",
    },
  },
} satisfies Record<Locale, Record<string, Texts>>;

export type TransactionalName = keyof (typeof TEXTS)["fr"];

/** The variables each template may use, exactly (the API sends these and nothing else). */
export const TRANSACTIONAL_PARAMS: Record<TransactionalName, string[]> = {
  confirm_signup: ["firstName", "link"],
  account_exists: ["firstName", "link"],
  password_reset: ["firstName", "link", "expiresIn"],
  password_changed: ["firstName"],
  sign_in_method_added: ["firstName", "providerName", "date"],
  sign_in_method_removed: ["firstName", "providerName", "date"],
};

export function transactional(name: TransactionalName, locale: Locale): string {
  const t: Texts = TEXTS[locale][name];
  const c = COMMON[locale];
  const link = v("link");
  const action = t.button
    ? [
        ...(t.forgot ? [p(t.forgot)] : []),
        button(t.button, link),
        gap,
        ...(t.expiry ? [small(t.expiry)] : []),
        small(
          `${c.fallback}<br><a class="lnk" href="${link}" style="color:${COLORS.blue};word-break:break-all;">${link}</a>`,
        ),
      ]
    : [];
  const warning = t.warningLead
    ? [p(`<strong>${t.warningLead}</strong>${t.warning}`)]
    : [];
  return renderEmail(
    {
      preheader: t.preheader,
      body: [
        title(t.title),
        gap,
        p(c.greeting),
        p(t.body),
        ...action,
        small(t.ignore),
        ...warning,
        p(c.signature),
      ].join("\n"),
      footer: `<p class="soft" style="margin:12px 0 0;font-family:'Bricolage Grotesque',Arial,sans-serif;font-size:13px;color:${COLORS.inkSoft};">${c.footer}</p>`,
    },
    locale,
  );
}

export const transactionalSubject = (name: TransactionalName, locale: Locale) =>
  TEXTS[locale][name].subject;

export const TRANSACTIONAL_NAMES = Object.keys(
  TRANSACTIONAL_PARAMS,
) as TransactionalName[];

/** emails/dist/transactional/<name>.<lang>.html, to paste in Brevo with the subject from subjects.md. */
export const TRANSACTIONAL_EMAILS = LOCALES.flatMap((locale) =>
  TRANSACTIONAL_NAMES.map((name) => ({
    file: `${name}.${locale}.html`,
    name,
    locale,
    subject: transactionalSubject(name, locale),
    html: transactional(name, locale),
  })),
);
