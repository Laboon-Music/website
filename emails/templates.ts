// The e-mails, in French ("tu") and English, for Brevo and for listmonk: only the variables differ (syntax.ts).

import { LOCALES, type Locale } from "../lib/i18n.ts";
import { COLORS, button, p, renderEmail, small, title } from "./layout.ts";
import { BREVO, LISTMONK, LISTMONK_CONTENT, type Syntax } from "./syntax.ts";

const TEXTS = {
  fr: {
    optin: {
      preheader: "Confirme ton adresse pour rejoindre Laboon.",
      title: "Presque fini !",
      intro:
        "Merci de t’être inscrit·e sur Laboon, l’appli pour trouver des musiciens près de chez toi.",
      action:
        "Clique sur le bouton pour confirmer ton adresse. On te prévient dès que l’appli sort.",
      button: "Confirmer mon inscription",
      fallback: "Le bouton ne marche pas ? Copie ce lien dans ton navigateur :",
      ignore: "Tu n’as rien demandé ? Ignore ce message : rien ne sera enregistré.",
    },
    campaign: {
      preheader: "Une nouvelle de l’équipe Laboon.",
      mirror: "Voir cet e-mail dans le navigateur",
      title: "Le titre de ta campagne",
      greeting: "Salut",
      someone: "musicien·ne",
      body: "Écris ici ton message. Garde des paragraphes courts : sur téléphone, un e-mail se lit en quelques secondes.",
      button: "Ouvrir Laboon",
      signoff: "À très vite,<br>L’équipe Laboon",
      why: "Tu reçois cet e-mail car tu t’es inscrit·e sur laboon-app.com.",
      unsubscribe: "Se désinscrire",
    },
  },
  en: {
    optin: {
      preheader: "Confirm your address to join Laboon.",
      title: "Almost done!",
      intro: "Thanks for signing up to Laboon, the app to find musicians near you.",
      action:
        "Click the button to confirm your address. We will let you know as soon as the app is out.",
      button: "Confirm my sign-up",
      fallback: "The button does not work? Copy this link into your browser:",
      ignore: "Did not ask for anything? Ignore this message: nothing will be saved.",
    },
    campaign: {
      preheader: "News from the Laboon team.",
      mirror: "View this e-mail in your browser",
      title: "Your campaign title",
      greeting: "Hi",
      someone: "musician",
      body: "Write your message here. Keep paragraphs short: on a phone, an e-mail is read in a few seconds.",
      button: "Open Laboon",
      signoff: "See you soon,<br>The Laboon team",
      why: "You are receiving this e-mail because you signed up on laboon-app.com.",
      unsubscribe: "Unsubscribe",
    },
  },
} satisfies Record<Locale, unknown>;

/** Double opt-in: sent right after the signup form (one template per language). */
export function doubleOptin(locale: Locale, syntax: Syntax = BREVO): string {
  const t = TEXTS[locale].optin;
  return renderEmail(
    {
      preheader: t.preheader,
      body: [
        title(t.title),
        `<div style="height:20px;line-height:20px;">&nbsp;</div>`,
        p(t.intro),
        p(t.action),
        button(t.button, syntax.optinUrl),
        `<div style="height:16px;line-height:16px;">&nbsp;</div>`,
        small(
          `${t.fallback}<br><a class="lnk" href="${syntax.optinUrl}" style="color:${COLORS.blue};word-break:break-all;">${syntax.optinUrl}</a>`,
        ),
        small(t.ignore),
      ].join("\n"),
    },
    locale,
  );
}

/** Body of a campaign (title, greeting, text, button, sign-off): the part edited for each send. */
export function campaignContent(locale: Locale, syntax: Syntax = BREVO): string {
  const t = TEXTS[locale].campaign;
  return [
    title(t.title),
    `<div style="height:20px;line-height:20px;">&nbsp;</div>`,
    p(`${t.greeting} ${syntax.firstName(t.someone)},`),
    p(t.body),
    button(t.button, "https://www.laboon-app.com" + (locale === "en" ? "/en" : "")),
    p(t.signoff),
  ].join("\n");
}

/**
 * Campaign frame (launch news, beta invitation…). Brevo: the body is in the template, edit the title and paragraphs
 * there. listmonk: the template holds the frame only and each campaign brings its body (`campaignContent`).
 */
export function campaign(locale: Locale, syntax: Syntax = BREVO): string {
  const t = TEXTS[locale].campaign;
  return renderEmail(
    {
      preheader: t.preheader,
      topLine: `<a class="lnk" href="${syntax.mirrorUrl}" style="color:${COLORS.inkSoft};">${t.mirror}</a>`,
      body: syntax === LISTMONK ? LISTMONK_CONTENT : campaignContent(locale, syntax),
      footer: `<p class="soft" style="margin:12px 0 0;font-family:'Bricolage Grotesque',Arial,sans-serif;font-size:13px;color:${COLORS.inkSoft};">${t.why} <a class="lnk" href="${syntax.unsubscribeUrl}" style="color:${COLORS.inkSoft};">${t.unsubscribe}</a></p>`,
    },
    locale,
  );
}

/**
 * listmonk's opt-in e-mail is a system template (`subscriber-optin.html` in its static directory), one for every
 * language: English when the subscriber's `language` attribute is `en`, French otherwise (like the site's default).
 */
export function listmonkOptin(): string {
  return `{{ define "subscriber-optin" }}{{ if eq (.Subscriber.Attribs.language | default "fr" | toString) "en" }}
${doubleOptin("en", LISTMONK)}{{ else }}
${doubleOptin("fr", LISTMONK)}{{ end }}{{ end }}
`;
}

export const ALL_EMAILS = LOCALES.flatMap((locale) => [
  { file: `double-optin.${locale}.html`, html: doubleOptin(locale) },
  { file: `campaign.${locale}.html`, html: campaign(locale) },
]);

/** emails/dist/listmonk/: campaign templates, a starter body per language, and the opt-in system template. */
export const LISTMONK_EMAILS = [
  ...LOCALES.flatMap((locale) => [
    { file: `campaign.${locale}.html`, html: campaign(locale, LISTMONK) },
    {
      file: `campaign-content.${locale}.html`,
      html: campaignContent(locale, LISTMONK) + "\n",
    },
  ]),
  { file: "subscriber-optin.html", html: listmonkOptin() },
];
