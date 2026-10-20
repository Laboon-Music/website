// Texts of the home page (/en), in display order. Same structure as content/fr/home.ts.
// ✏️ Safe to edit: change the text between quotes only; keep the structure.
// The home page FAQ lives in content/en/faq.ts. See docs/content.md.

import type { HOME_CONTENT as FrHome } from "../fr/home";

export const HOME_CONTENT: typeof FrHome = {
  nav: {
    logoLabel: "Laboon, back to top",
    join: "Sign up",
  },

  hero: {
    wordmarkAlt: "Laboon",
    title: "Find your band",
    subtitle:
      "The app that puts musicians on the same wavelength: find musicians near you and form your band.",
  },

  manifesto: {
    label: "Manifesto",
    text: "Less time searching, more time playing.",
  },

  values: {
    title: "The app made for musicians",
    subtitle: "Four reasons to ditch classified ads and find your musicians.",
    items: [
      {
        icon: "icon-puzzle.png",
        title: "The right musical match",
        text: "Find musicians by instrument, style, level and what you are looking for. No more classified ads that lead nowhere.",
      },
      {
        icon: "icon-pin.png",
        title: "Close to you",
        text: "Discover musicians in your city, ready to play, rehearse or start a project together.",
      },
      {
        icon: "icon-instruments.png",
        title: "Form your band",
        text: "Looking for a drummer, a singer, a bass player? Put your band together in a few swipes.",
      },
      {
        icon: "icon-heart.png",
        title: "A real community",
        text: "Chat, organise jams and rehearsals, and join a community of musicians who actually play.",
      },
    ],
  },

  steps: {
    title: "How to find your musicians",
    subtitle: "Three steps between you and your next rehearsal.",
    items: [
      {
        icon: "icon-microphone.png",
        label: "Step 1",
        text: "Create your musician profile: your instruments, your styles, your level and what you are looking for.",
      },
      {
        icon: "icon-pin.png",
        label: "Step 2",
        text: "Laboon suggests compatible musicians and bands near you.",
      },
      {
        icon: "icon-theater.png",
        label: "Step 3",
        text: "Chat, set up a rehearsal or a jam, and kick off your next musical project.",
      },
    ],
  },

  finalCta: {
    title: "Shall we tune in?",
    text: "Leave your e-mail: we will let you know as soon as the app is out, and you will create your musician profile among the first.",
  },

  signup: {
    emailLabel: "Your e-mail",
    emailPlaceholder: "name@mail.com",
    launch: "Let me know when it launches",
    beta: "Try the beta first",
    submit: "Sign up",
    successTitle: "Almost done! Check your inbox",
    successText:
      "We just sent you an e-mail: click the link to confirm your sign-up (remember to check your spam folder).",
    privacy: "Privacy policy",
    privacyNote: "We will only send you Laboon news. Unsubscribe in one click.",
  },

  motion: {
    pause: "Pause animations",
    resume: "Resume animations",
  },
};
