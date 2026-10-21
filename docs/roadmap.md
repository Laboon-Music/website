# Roadmap & known gaps

Things deliberately left for later. Move an item to `decisions.md` once done.

## Before public launch

- [ ] Fill `[à compléter]` placeholders in the legal documents.
- [ ] Deep links: Android release SHA-256 (ticket APP-19,
      [deep-links.md](features/deep-links.md)).
- [ ] Finish the manual setup checklist in [deployment.md](deployment.md)
      (Sentry, branch protection, Turnstile, contact inbox…).

## Brand assets (waiting for a logo)

- [x] Favicon, apple icon and brand fonts (`next/font`) are in place.

## Technical follow-ups

- [ ] **Enforce the Content-Security-Policy** (sent as report-only today): see [security.md](features/security.md).
- [ ] **Rate limiting** on `/api/subscribe` and `/api/contact` (e.g. Vercel
      Firewall rule or Upstash) if spam gets past the anti-bot layers.
- [ ] **E2E tests** (Playwright) for the two forms at mobile and desktop
      sizes, run against the staging deployment.
- [ ] Conversion events are wired but need the **Vercel Pro** plan to be
      recorded ([analytics.md](features/analytics.md)) — decide when traffic
      justifies it.
- [ ] **Vector disc**: the animation zooms the disc up to ~4x, more than any raster of the artwork survives (the source is 3267 px). Ask the designer for an SVG export from Figma (an automatic trace merges the double strokes and changes the look). If it weighs under ~600 KB it replaces `public/brand/motif.avif`.
- [x] Image weight: home disc cropped and re-encoded (3.7 MB → 380 KB phones / 870 KB desktop), icons in WebP.
- [ ] Upgrade to **TypeScript 7** and **ESLint 10** once supported by
      `eslint-config-next`.

## Known dependency advisories

- `braces` (via `eslint-config-next` → `fast-glob` → `micromatch`): high
  severity ReDoS advisory with **no patched version** published. Dev-only
  (lint tooling), not shipped to production — `npm audit --omit=dev` is clean.
  Re-check on each dependency update.
