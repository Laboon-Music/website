// Texts of the home page (/), in display order.
// ✏️ Safe to edit: change the text between quotes only; keep the structure.
// The home page FAQ lives in content/faq.ts. See docs/content.md.

export const HOME_CONTENT = {
  nav: {
    logoLabel: "Laboon, retour en haut",
    join: "M’inscrire",
  },

  hero: {
    // The wordmark above the title is an image: this is its accessible name.
    wordmarkAlt: "Laboon",
    title: "Trouve ton band",
    subtitle:
      "L’appli qui met les musiciens sur la même longueur d’onde : trouve des musiciens près de chez toi et monte ton groupe.",
  },

  manifesto: {
    label: "Manifeste",
    text: "Moins de temps à chercher et plus de temps pour jouer.",
  },

  values: {
    title: "L’appli pensée pour les musiciens",
    subtitle:
      "Quatre raisons de laisser tomber les petites annonces pour trouver tes musiciens.",
    // `icon` = file name in public/brand.
    items: [
      {
        icon: "icon-puzzle.png",
        title: "Le bon match musical",
        text: "Trouve des musiciens selon l’instrument, le style, le niveau et tes envies. Fini les petites annonces qui ne mènent à rien.",
      },
      {
        icon: "icon-pin.png",
        title: "Près de chez toi",
        text: "Découvre les musiciens de ta ville prêts à jouer, répéter ou monter un projet ensemble.",
      },
      {
        icon: "icon-instruments.png",
        title: "Monte ton groupe",
        text: "Tu cherches un batteur, un·e chanteur·euse, un bassiste ? Compose ton groupe de musique en quelques swipes.",
      },
      {
        icon: "icon-heart.png",
        title: "Une vraie communauté",
        text: "Échange, organise des jams et des répètes, et rejoins une communauté de musiciens qui jouent vraiment.",
      },
    ],
  },

  steps: {
    title: "Comment trouver tes musiciens",
    subtitle: "Trois étapes entre toi et ta prochaine répète.",
    items: [
      {
        icon: "icon-microphone.png",
        label: "Étape 1",
        text: "Crée ton profil de musicien : tes instruments, tes styles, ton niveau et ce que tu recherches.",
      },
      {
        icon: "icon-pin.png",
        label: "Étape 2",
        text: "Laboon te propose des musiciens et des groupes compatibles près de chez toi.",
      },
      {
        icon: "icon-theater.png",
        label: "Étape 3",
        text: "Discute, cale une répète ou une jam, et lance ton prochain projet musical.",
      },
    ],
  },

  finalCta: {
    title: "On s’accorde ?",
    text: "Laisse ton e-mail : on te prévient dès que l’appli sort, et tu crées ton profil de musicien parmi les premiers.",
  },

  signup: {
    emailLabel: "Ton e-mail",
    emailPlaceholder: "prenom@mail.com",
    launch: "Me prévenir du lancement",
    beta: "Tester la bêta en avant-première",
    submit: "M’inscrire",
    successTitle: "Presque fini ! Vérifie ta boîte mail",
    successText:
      "On vient de t’envoyer un e-mail : clique sur le lien pour confirmer ton inscription (pense à regarder dans les spams).",
    privacy: "Politique de confidentialité",
    privacyNote:
      "On ne t’enverra que des nouvelles de Laboon. Désinscription en un clic.",
  },

  motion: {
    pause: "Mettre les animations en pause",
    resume: "Reprendre les animations",
  },
};
