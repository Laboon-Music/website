// The e-mails, in French ("tu") and English. Brevo variables: {{ doubleoptin }},
// {{ mirror }} (view in browser), {{ unsubscribe }}, {{ contact.FIRSTNAME }}.

import { LOCALES, type Locale } from "../lib/i18n.ts";
import { SITE_URL } from "../lib/site.ts";
import { COLORS, button, p, renderEmail, small, title } from "./layout.ts";

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
      greeting: "Salut {{ contact.FIRSTNAME | default : 'musicien·ne' }},",
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
      greeting: "Hi {{ contact.FIRSTNAME | default : 'musician' }},",
      body: "Write your message here. Keep paragraphs short: on a phone, an e-mail is read in a few seconds.",
      button: "Open Laboon",
      signoff: "See you soon,<br>The Laboon team",
      why: "You are receiving this e-mail because you signed up on laboon-app.com.",
      unsubscribe: "Unsubscribe",
    },
  },
} satisfies Record<Locale, unknown>;

/**
 * Images of the double opt-in come from the site that sent the sign-up: the subscribe route
 * stores its address in the contact attribute SITE_URL (staging mails show staging images, and
 * nothing is broken while a release is pending). Production is the fallback.
 */
export const OPTIN_ASSETS_BASE = `{{ contact.SITE_URL | default : '${SITE_URL}' }}`;

/** Double opt-in: sent right after the signup form (Brevo template, one per language). */
export function doubleOptin(locale: Locale): string {
  const t = TEXTS[locale].optin;
  return renderEmail(
    {
      preheader: t.preheader,
      assetsBase: OPTIN_ASSETS_BASE,
      body: [
        title(t.title),
        `<div style="height:20px;line-height:20px;">&nbsp;</div>`,
        p(t.intro),
        p(t.action),
        button(t.button, "{{ doubleoptin }}"),
        `<div style="height:16px;line-height:16px;">&nbsp;</div>`,
        small(
          `${t.fallback}<br><a class="lnk" href="{{ doubleoptin }}" style="color:${COLORS.blue};word-break:break-all;">{{ doubleoptin }}</a>`,
        ),
        small(t.ignore),
      ].join("\n"),
    },
    locale,
  );
}

/** Campaign frame (launch news, beta invitation…): edit the title and paragraphs in Brevo. */
export function campaign(locale: Locale): string {
  const t = TEXTS[locale].campaign;
  return renderEmail(
    {
      preheader: t.preheader,
      topLine: `<a class="lnk" href="{{ mirror }}" style="color:${COLORS.inkSoft};">${t.mirror}</a>`,
      body: [
        title(t.title),
        `<div style="height:20px;line-height:20px;">&nbsp;</div>`,
        p(t.greeting),
        p(t.body),
        button(t.button, "https://www.laboon-app.com" + (locale === "en" ? "/en" : "")),
        p(t.signoff),
      ].join("\n"),
      footer: `<p class="soft" style="margin:12px 0 0;font-family:'Bricolage Grotesque',Arial,sans-serif;font-size:13px;color:${COLORS.inkSoft};">${t.why} <a class="lnk" href="{{ unsubscribe }}" style="color:${COLORS.inkSoft};">${t.unsubscribe}</a></p>`,
    },
    locale,
  );
}

export const ALL_EMAILS = LOCALES.flatMap((locale) => [
  { file: `double-optin.${locale}.html`, html: doubleOptin(locale) },
  { file: `campaign.${locale}.html`, html: campaign(locale) },
]);
