# Home scene

The home page (`/`) is a scroll-driven story: a disc turns and opens around
the title and signup, the waves tune into the manifesto, a deck of cards is
swiped, a spotlight lights three steps, then the closing signup and the FAQ.

## Code

- `app/[lang]/page.tsx` — thin route (+ Organization and FAQPage JSON-LD).
- `components/home/HomeScene.tsx` — the markup; everything that moves is
  tagged `data-scene="…"`.
- `components/home/scene.ts` — one `requestAnimationFrame` loop reading those
  nodes (canvas wave field, disc, words, cards, steps, background hand-over).
- `components/home/home.css` — styles, scoped under `.home`.
- `lib/scene-math.ts` — pure maths (tested in `lib/scene-math.test.ts`).
- Texts: `content/<lang>/home.ts`, `content/<lang>/faq.ts`. Images: `public/brand/`.

Pinned sections: `.pin` with `--span` screens of scroll and a sticky `.stage`.

## Accessibility and motion

- Skip link; one `<h1>`; decoration is `aria-hidden`; the manifesto reads as one sentence.
- `prefers-reduced-motion` is read live; the footer button "Mettre les animations
  en pause" does the same on demand (WCAG 2.2.2).
- The intro hides the hero only when scripts run (`.js` class set in
  `app/[lang]/layout.tsx`); it never hides it for good (8 s failsafe: `reveal-failsafe` class set by a script in the layout) and the first
  Tab key ends it.
- Short screens (`max-height: 620px`, 200 % zoom): cards and steps are stacked, not pinned.

## Tests

`app/[lang]/page.test.tsx` (scene mocked), `lib/scene-math.test.ts`. The animation
itself needs a real browser: check at 375 px and desktop width after any change.
