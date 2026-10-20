# Social links

Pill buttons (icon + name) to Laboon's social accounts.

- Component: `components/social/SocialLinks.tsx` (`size="md" | "lg"`).
- Shown in: site footer, `/contact`, `/inscription-confirmee`.
- Networks: **Instagram** (`@laboon.app.music`), **Facebook** (LaboonAPPMUSIC).
- Links open in a new tab with `rel="noopener noreferrer"`; each has an
  accessible label "Laboon sur <network>".

## Add a network

Add an entry to `SOCIALS` in `lib/site.ts` (name, handle, URL); it also feeds the footer column "Nous suivre".

## Tests

`components/social/SocialLinks.test.tsx`.

In e-mails the networks are round blue buttons with a white icon (PNG in `public/brand/email/<name>.png`, one per network, named in lower case): see [emails.md](emails.md).
