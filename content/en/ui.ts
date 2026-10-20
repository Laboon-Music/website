// Interface texts in English. Same keys as content/fr/ui.ts (enforced by the type).
// ✏️ Safe to edit: change the text between quotes only. See docs/content.md.

import type { UI as FrUI } from "../fr/ui";

export const UI: typeof FrUI = {
  skipLink: "Skip to content",
  newTab: "new tab",
  loading: "Loading…",
  sending: "Sending…",
  backHome: "Back to home",
  backToTop: "Back to the top of the page",

  header: { logoLabel: "Laboon, back to home", join: "Sign up" },

  footer: {
    navLabel: "Footer",
    brand: "Laboon",
    information: "Information",
    follow: "Follow us",
    faq: "FAQ",
    contact: "Contact",
    legal: "Legal notice",
    privacy: "Privacy",
    copyright: "Laboon",
  },

  language: {
    label: "Language",
    fr: "Français",
    en: "English",
    switch: "{language} (change language)",
  },

  social: { on: "Laboon on {name}" },

  password: {
    show: "Show",
    hide: "Hide",
    newLabel: "New password",
    confirmLabel: "Confirm password",
    ruleMet: " (met)",
    rules: {
      length: "At least {min} characters",
      upper: "An uppercase letter",
      digit: "A digit",
      special: "A special character (neither letter nor digit)",
    },
    invalidRules: "Your password must meet the 4 conditions above.",
    mismatch: "The passwords do not match.",
  },

  errors: {
    generic: "Something went wrong.",
    invalidRequest: "Invalid request.",
    network: "Network error. Please try again later.",
    invalidEmail: "Invalid e-mail address.",
    tooFast: "Oops, that was a bit quick! Try again in a few seconds.",
    turnstile: "The anti-bot check failed. Reload the page and try again.",
    turnstileTimeout:
      "The anti-bot check did not complete. Reload the page and try again.",
    noList: "Pick at least one option (launch or beta).",
    subscribeFailed: "Sign-up is not possible right now. Please try again later.",
    sendFailed: "Sending is not possible right now. Please try again later.",
    nameRequired: "Please tell us your name.",
    messageShort: "Your message is a bit short (at least {min} characters).",
    messageLong: "Your message is too long ({max} characters maximum).",
    accountGeneric: "We could not finish right now. Please try again in a moment.",
    weakPassword: "This password does not meet the conditions above.",
    validationFailed: "Check the information you entered and try again.",
    rateLimited: "Too many attempts. Wait a few minutes and try again.",
    apiNetwork: "Could not reach the server. Check your connection and try again.",
  },

  contact: {
    metaTitle: "Contact — Laboon",
    metaDescription: "A question, an idea, a partnership? Write to the Laboon team.",
    title: "Get in touch",
    lede: "A question about the app, an idea, a partnership? Write to us, we read everything.",
    embedLede: "A question, an idea, a problem? Write to us, we read everything.",
    name: "Name",
    namePlaceholder: "Your name or nickname",
    email: "E-mail",
    emailPlaceholder: "name@mail.com",
    subject: "Subject",
    message: "Message",
    messagePlaceholder: "Tell us everything…",
    send: "Send",
    sending: "Sending…",
    note: "Your name and e-mail are only used to reply to you.",
    privacy: "Privacy policy",
    sentTitle: "Message sent, thank you!",
    sentText: "We will reply as soon as possible to {email}.",
    backHome: "Back to home",
    socials: "Or find us on social media",
    subjects: {
      question: "A question",
      beta: "Beta / testing",
      partenariat: "Partnership / press",
      bug: "Report a problem",
      autre: "Other",
    },
  },

  confirmed: {
    metaTitle: "Sign-up confirmed — Laboon",
    title: "Sign-up confirmed",
    text: "Thank you! Your address is confirmed. We will keep you posted about the Laboon launch.",
    follow: "In the meantime, follow us so you don't miss anything:",
    backHome: "Back to home",
  },

  notFound: {
    metaTitle: "Page not found — Laboon",
    title: "This page is playing quietly",
    text: "The page you are looking for does not exist or has moved.",
    backHome: "Back to home",
  },

  error: {
    title: "Oops, a wrong note",
    text: "Something went wrong on our side. Please try again in a moment.",
    retry: "Try again",
    backHome: "Back to home",
  },

  faq: { metaTitle: "Frequently asked questions — Laboon" },

  legal: { backHome: "Back to home", fallbackTitle: "Legal document — Laboon" },

  account: {
    resetMetaTitle: "Password — Laboon",
    confirmMetaTitle: "Account confirmation — Laboon",
    invalidLink: "Invalid or expired link",
    invalidLinkText: "This link is no longer valid (it may have been used or expired).",
    emailLabel: "Account e-mail",
    emailPlaceholder: "name@mail.com",
    reset: {
      doneTitle: "Password updated",
      doneText:
        "All set! You can now log back in to the Laboon app with your new password.",
      doneCta: "Back to Laboon",
      newTitle: "Choose a new password",
      newLede: "It will replace the old one in the Laboon app.",
      newSubmit: "Update",
      askTitle: "Forgot your password?",
      askLede:
        "No worries. Enter the e-mail address of your Laboon account: we will send you a link (valid for 30 minutes) to choose a new password.",
      askSubmit: "Get the link",
      sentTitle: "Check your inbox",
      sentText:
        "If an account exists with this address, we just sent it a link. Remember to check your spam folder.",
    },
    confirm: {
      doneTitle: "Account confirmed!",
      doneText:
        "Your address is confirmed and your password is saved. Open the Laboon app to log in.",
      doneCta: "Back to Laboon",
      newTitle: "Choose your password",
      newLede: "Last step: your password confirms your e-mail address.",
      newSubmit: "Confirm my account",
      askTitle: "Confirm your e-mail address",
      askLede:
        "Open the link you received by e-mail when you signed up. Lost it or expired? We will send you a new one.",
      askSubmit: "Resend the link",
      sentTitle: "Check your inbox",
      sentText:
        "If an account waiting for confirmation exists with this address, we just sent it a new link. The old ones no longer work.",
    },
  },
};
