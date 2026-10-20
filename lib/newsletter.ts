// Newsletter signup configuration shared by the form (client) and the API (server).
// (The messages live in content/<lang>/ui.ts.)

/** Lists a visitor can join: at least one is required. */
export const NEWSLETTER_LISTS = ["launch", "beta"] as const;
