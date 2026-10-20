// Texts of the FAQ in English, shown on the home page and in the mobile app
// (/faq/embed WebView). Same structure as content/fr/faq.ts.
// ✏️ Safe to edit: change the text between quotes only; keep the structure.
// A link is written [label](address): an internal path (/contact), an https://
// address or a mailto: address. See docs/content.md.

import type { FAQ_CONTENT as FrFaq } from "../fr/faq";
import { CONTACT_EMAIL, SOCIALS } from "@/lib/site";

export const FAQ_CONTENT: typeof FrFaq = {
  title: "Frequently asked questions about Laboon",
  subtitle:
    "Everything you need to know about the app to find musicians and form a band.",
  groups: [
    {
      title: "Understanding Laboon",
      items: [
        {
          question: "What is Laboon?",
          answer:
            "A mobile app that connects musicians to form bands, find a drummer, a singer, a guitarist… and play together close to home.",
        },
        {
          question: "Who is the app for?",
          answer:
            "Musicians of all levels (beginners, amateurs, experienced) looking for a band or for musicians to complete theirs.",
        },
        {
          question: "How does it work?",
          answer:
            "You create your profile (instruments, styles, level, availability), discover the musicians and bands around you, then get in touch with them.",
        },
        {
          question: "Why Laboon rather than Facebook, WhatsApp groups or classified ads?",
          answer:
            "Laboon is built only for musicians: filters by instrument, style, level and distance, without the noise of general social networks.",
        },
      ],
    },
    {
      title: "Launch and availability",
      items: [
        {
          question: "When is the app coming out?",
          answer: "[Join the waiting list](/#inscription) to be the first to know.",
        },
        {
          question: "What is the waiting list for? What do I get out of it?",
          answer:
            "You will be told as soon as the app opens and you will be able to create your profile among the first.",
        },
      ],
    },
    {
      title: "Pricing",
      items: [
        {
          question: "Is Laboon free?",
          answer:
            "Yes, the essentials are free for musicians. An optional premium plan will be offered.",
        },
      ],
    },
    {
      title: "Data, security and trust",
      items: [
        {
          question: "What do you do with my data?",
          answer:
            "It is processed in accordance with the GDPR. Your consent is explicitly requested when you sign up and you can withdraw it or delete your account at any time. Details in the [Privacy policy](/confidentialite).",
        },
        {
          question: "How do you prevent inappropriate behaviour and fake profiles?",
          answer:
            "A [Code of conduct](/charte) governs exchanges, and every user will be able to report a profile or a message.",
        },
      ],
    },
    {
      title: "Contact",
      items: [
        {
          question: "How can I contact you or follow you?",
          answer: `On ${SOCIALS.map((s) => `[${s.name}](${s.href})`).join(" or ")}, by e-mail at [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}) or through the [contact form](/contact).`,
        },
        {
          question: "I have an idea or a bug to report, what should I do?",
          answer: `Feel free to write to us at [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}) or through the [contact form](/contact).`,
        },
      ],
    },
  ],
};
