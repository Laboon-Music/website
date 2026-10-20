// The e-mails, written in French ("tu"). Brevo variables: {{ doubleoptin }},
// {{ mirror }} (view in browser), {{ unsubscribe }}, {{ contact.FIRSTNAME }}.

import { COLORS, button, p, renderEmail, small, title } from "./layout.ts";

/** Double opt-in: sent right after the signup form (Brevo template, ID 1). */
export const doubleOptin = renderEmail({
  preheader: "Confirme ton adresse pour rejoindre Laboon.",
  body: [
    title("Presque fini !"),
    `<div style="height:20px;line-height:20px;">&nbsp;</div>`,
    p(
      "Merci de t’être inscrit·e sur Laboon, l’appli pour trouver des musiciens près de chez toi.",
    ),
    p(
      "Clique sur le bouton pour confirmer ton adresse. On te prévient dès que l’appli sort.",
    ),
    button("Confirmer mon inscription", "{{ doubleoptin }}"),
    `<div style="height:16px;line-height:16px;">&nbsp;</div>`,
    small(
      `Le bouton ne marche pas ? Copie ce lien dans ton navigateur :<br><a class="lnk" href="{{ doubleoptin }}" style="color:${COLORS.blue};word-break:break-all;">{{ doubleoptin }}</a>`,
    ),
    small("Tu n’as rien demandé ? Ignore ce message : rien ne sera enregistré."),
  ].join("\n"),
});

/** Campaign frame (launch news, beta invitation…): edit the title and paragraphs in Brevo. */
export const campaign = renderEmail({
  preheader: "Une nouvelle de l’équipe Laboon.",
  topLine: `<a class="lnk" href="{{ mirror }}" style="color:${COLORS.inkSoft};">Voir cet e-mail dans le navigateur</a>`,
  body: [
    title("Le titre de ta campagne"),
    `<div style="height:20px;line-height:20px;">&nbsp;</div>`,
    p("Salut {{ contact.FIRSTNAME | default : 'musicien·ne' }},"),
    p(
      "Écris ici ton message. Garde des paragraphes courts : sur téléphone, un e-mail se lit en quelques secondes.",
    ),
    button("Ouvrir Laboon", "https://www.laboon-app.com"),
    p("À très vite,<br>L’équipe Laboon"),
  ].join("\n"),
  footer: `<p class="soft" style="margin:12px 0 0;font-family:'Bricolage Grotesque',Arial,sans-serif;font-size:13px;color:${COLORS.inkSoft};">Tu reçois cet e-mail car tu t’es inscrit·e sur laboon-app.com. <a class="lnk" href="{{ unsubscribe }}" style="color:${COLORS.inkSoft};">Se désinscrire</a></p>`,
});
