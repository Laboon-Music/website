// Texts of the FAQ, shown on the home page and in the mobile app (/faq/embed WebView).
// ✏️ Safe to edit: change the text between quotes only; keep the structure.
// A link is written [label](address): an internal path (/contact), an https://
// address or a mailto: address. See docs/content.md.

import { CONTACT_EMAIL, SOCIALS } from "@/lib/site";

export const FAQ_CONTENT = {
  title: "Questions fréquentes sur Laboon",
  subtitle:
    "Tout ce qu’il faut savoir sur l’appli pour trouver des musiciens et former un groupe.",
  groups: [
    {
      title: "Comprendre Laboon",
      items: [
        {
          question: "C'est quoi Laboon ?",
          answer:
            "Une application mobile qui met en relation les musiciens pour former des groupes, trouver un batteur, une chanteuse, un guitariste… et jouer ensemble près de chez soi.",
        },
        {
          question: "À qui s'adresse l'appli ?",
          answer:
            "Aux musiciens de tous niveaux (débutants, amateurs, confirmés) qui cherchent un groupe ou des musiciens pour compléter le leur.",
        },
        {
          question: "Comment ça marche ?",
          answer:
            "Tu crées ton profil (instruments, styles, niveau, disponibilités), tu découvres les musiciens et les groupes autour de toi, puis tu les contactes.",
        },
        {
          question:
            "Pourquoi Laboon plutôt que Facebook, les groupes WhatsApp ou les petites annonces ?",
          answer:
            "Laboon est pensé uniquement pour les musiciens : filtres par instrument, style, niveau et distance, sans le bruit des réseaux généralistes.",
        },
      ],
    },
    {
      title: "Lancement et disponibilité",
      items: [
        {
          question: "Quand l'appli sort-elle ?",
          answer:
            "[Inscris-toi à la liste d'attente](/#inscription) pour être prévenu·e en premier.",
        },
        {
          question: "À quoi sert la liste d'attente ? Qu'est-ce que j'y gagne ?",
          answer:
            "Tu seras averti·e dès l'ouverture et tu pourras créer ton profil parmi les premiers.",
        },
      ],
    },
    {
      title: "Tarifs",
      items: [
        {
          question: "Laboon est-elle gratuite ?",
          answer:
            "Oui, l'essentiel est gratuit pour les musiciens. Une formule premium optionnelle sera proposée.",
        },
      ],
    },
    {
      title: "Données, sécurité et confiance",
      items: [
        {
          question: "Que faites-vous de mes données ?",
          answer:
            "Elles sont traitées conformément au RGPD. Ton consentement est demandé explicitement à l'inscription et tu peux le retirer ou supprimer ton compte à tout moment. Détails dans la [Politique de confidentialité](/confidentialite).",
        },
        {
          question: "Comment éviter les comportements déplacés ou les faux profils ?",
          answer:
            "Une [Charte de bonne conduite](/charte) encadre les échanges, et chaque utilisateur pourra signaler un profil ou un message.",
        },
      ],
    },
    {
      title: "Contact",
      items: [
        {
          question: "Comment vous contacter ou vous suivre ?",
          answer: `Sur ${SOCIALS.map((s) => `[${s.name}](${s.href})`).join(" ou ")}, par mail à [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}) ou via le [formulaire de contact](/contact).`,
        },
        {
          question: "J'ai une idée ou un bug à signaler, comment faire ?",
          answer: `N'hésite pas à nous écrire à [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}) ou via le [formulaire de contact](/contact).`,
        },
      ],
    },
  ],
};
