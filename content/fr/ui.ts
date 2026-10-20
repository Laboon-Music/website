// Interface texts (header, footer, forms, errors, account pages, error pages),
// in French. `{name}` placeholders are filled by `fmt()` (lib/i18n-format.ts).
// The English twin is content/en/ui.ts and must have the same keys (typed).
// ✏️ Safe to edit: change the text between quotes only. See docs/content.md.

export const UI = {
  skipLink: "Aller au contenu",
  newTab: "nouvel onglet",
  loading: "Chargement…",
  sending: "Envoi…",
  backHome: "Retour à l’accueil",

  header: { logoLabel: "Laboon, retour à l'accueil", join: "M’inscrire" },

  footer: {
    navLabel: "Pied de page",
    brand: "Laboon",
    information: "Informations",
    follow: "Nous suivre",
    faq: "FAQ",
    contact: "Contact",
    legal: "Mentions légales",
    privacy: "Confidentialité",
    copyright: "Laboon",
  },

  language: {
    label: "Langue",
    fr: "Français",
    en: "English",
    /** Accessible name of the link to the other language, e.g. "English (switch language)". */
    switch: "{language} (changer de langue)",
  },

  social: { on: "Laboon sur {name}" },

  password: {
    show: "Afficher",
    hide: "Masquer",
    newLabel: "Nouveau mot de passe",
    confirmLabel: "Confirmer le mot de passe",
    ruleMet: " (respecté)",
    rules: {
      length: "{min} caractères minimum",
      upper: "Une majuscule",
      digit: "Un chiffre",
      special: "Un caractère spécial (ni lettre ni chiffre)",
    },
    invalidRules: "Ton mot de passe doit respecter les 4 conditions ci-dessus.",
    mismatch: "Les mots de passe ne correspondent pas.",
  },

  errors: {
    generic: "Une erreur est survenue.",
    invalidRequest: "Requête invalide.",
    network: "Erreur réseau. Réessaie plus tard.",
    invalidEmail: "Adresse email invalide.",
    tooFast: "Oups, c'était un peu rapide ! Réessaie dans quelques secondes.",
    turnstile: "La vérification anti-robot a échoué. Recharge la page et réessaie.",
    turnstileTimeout:
      "La vérification anti-robot n'a pas abouti. Recharge la page et réessaie.",
    noList: "Choisis au moins une option (lancement ou beta).",
    subscribeFailed: "Inscription impossible pour le moment. Réessaie plus tard.",
    sendFailed: "Envoi impossible pour le moment. Réessaie plus tard.",
    nameRequired: "Indique ton nom.",
    messageShort: "Ton message est un peu court ({min} caractères minimum).",
    messageLong: "Ton message est trop long ({max} caractères max).",
    // Account pages (Laboon API error codes)
    accountGeneric: "Impossible de terminer pour le moment. Réessaie dans un instant.",
    weakPassword: "Ce mot de passe ne respecte pas les conditions ci-dessus.",
    validationFailed: "Vérifie les informations saisies et réessaie.",
    rateLimited: "Trop de tentatives. Patiente quelques minutes et réessaie.",
    apiNetwork: "Impossible de joindre le serveur. Vérifie ta connexion et réessaie.",
  },

  contact: {
    metaTitle: "Contact — Laboon",
    metaDescription: "Une question, une idée, un partenariat ? Écris à l'équipe Laboon.",
    title: "Contacte-nous",
    lede: "Une question sur l’appli, une idée, un partenariat ? Écris-nous, on lit tout.",
    embedLede: "Une question, une idée, un problème ? Écris-nous, on lit tout.",
    name: "Nom",
    namePlaceholder: "Ton nom ou pseudo",
    email: "E-mail",
    emailPlaceholder: "prenom@mail.com",
    subject: "Sujet",
    message: "Message",
    messagePlaceholder: "Dis-nous tout…",
    send: "Envoyer",
    sending: "Envoi…",
    note: "Ton nom et ton e-mail servent uniquement à te répondre.",
    privacy: "Politique de confidentialité",
    sentTitle: "Message envoyé, merci !",
    sentText: "On te répond dès que possible à l'adresse {email}.",
    backHome: "Retour à l'accueil",
    socials: "Ou retrouve-nous sur les réseaux",
    subjects: {
      question: "Une question",
      beta: "Beta / tests",
      partenariat: "Partenariat / presse",
      bug: "Signaler un problème",
      autre: "Autre",
    },
  },

  confirmed: {
    metaTitle: "Inscription confirmée — Laboon",
    title: "Inscription confirmée",
    text: "Merci ! Ton adresse est validée. On te tiendra au courant du lancement de Laboon.",
    follow: "En attendant, suis-nous pour ne rien rater :",
    backHome: "Retour à l'accueil",
  },

  notFound: {
    metaTitle: "Page introuvable — Laboon",
    title: "Cette page joue en sourdine",
    text: "La page que tu cherches n'existe pas ou a été déplacée.",
    backHome: "Retour à l'accueil",
  },

  error: {
    title: "Oups, une fausse note",
    text: "Quelque chose s'est mal passé de notre côté. Réessaie dans un instant.",
    retry: "Réessayer",
    backHome: "Retour à l'accueil",
  },

  faq: { metaTitle: "Questions fréquentes — Laboon" },

  legal: { backHome: "Retour à l’accueil", fallbackTitle: "Document légal — Laboon" },

  account: {
    resetMetaTitle: "Mot de passe — Laboon",
    confirmMetaTitle: "Confirmation du compte — Laboon",
    invalidLink: "Lien invalide ou expiré",
    invalidLinkText: "Ce lien n'est plus valide (il a peut-être déjà servi ou expiré).",
    emailLabel: "E-mail du compte",
    emailPlaceholder: "prenom@mail.com",
    reset: {
      doneTitle: "Mot de passe mis à jour",
      doneText:
        "C'est tout bon ! Tu peux maintenant te reconnecter à l'app Laboon avec ton nouveau mot de passe.",
      doneCta: "Revenir sur Laboon",
      newTitle: "Choisis un nouveau mot de passe",
      newLede: "Il remplacera l'ancien sur l'app Laboon.",
      newSubmit: "Mettre à jour",
      askTitle: "Mot de passe oublié ?",
      askLede:
        "Pas de panique. Indique l'adresse e-mail de ton compte Laboon : on t'envoie un lien (valable 30 minutes) pour choisir un nouveau mot de passe.",
      askSubmit: "Recevoir le lien",
      sentTitle: "Vérifie ta boîte mail",
      sentText:
        "Si un compte existe avec cette adresse, on vient d'y envoyer un lien. Pense à regarder dans tes spams.",
    },
    confirm: {
      doneTitle: "Compte confirmé !",
      doneText:
        "Ton adresse est validée et ton mot de passe est enregistré. Ouvre l'app Laboon pour te connecter.",
      doneCta: "Revenir sur Laboon",
      newTitle: "Choisis ton mot de passe",
      newLede: "Dernière étape : ton mot de passe confirme ton adresse e-mail.",
      newSubmit: "Confirmer mon compte",
      askTitle: "Confirme ton adresse e-mail",
      askLede:
        "Ouvre le lien reçu par e-mail à l'inscription. Il a disparu ou il a expiré ? On t'en envoie un nouveau.",
      askSubmit: "Renvoyer le lien",
      sentTitle: "Vérifie ta boîte mail",
      sentText:
        "Si un compte en attente de confirmation existe avec cette adresse, on vient d'y envoyer un nouveau lien. Les anciens ne fonctionnent plus.",
    },
  },
};
