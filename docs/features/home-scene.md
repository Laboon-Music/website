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

## Intro length

The intro keeps the designer's choreography (5.6 s of animation time) played at `INTRO_PACE = 1.7`
(`scene.ts`), so it lasts about 3.3 s. The growing disc is the last element painted: it decides the
Largest Contentful Paint, so a shorter intro directly improves it. Any key or scroll still speeds it up.

## Centring

The waves are centred on the **pinned stage** (`.stage`, 100svh) and the hero disc on the hero, not on `innerHeight`:
on phones the window height changes while the browser bars collapse, and the text (centred in the stage)
would drift away from the middle of the waves. Check it after any change to the stage or the hero height.

## Accessibility and motion

- Skip link; one `<h1>`; decoration is `aria-hidden`; the manifesto reads as one sentence.
- `prefers-reduced-motion` is read live; the footer button "Mettre les animations
  en pause" does the same on demand (WCAG 2.2.2).
- The intro hides the hero only when scripts run (`.js` class set in
  `app/[lang]/layout.tsx`); it never hides it for good (8 s failsafe: `reveal-failsafe` class set by a script in the layout) and the first
  Tab key ends it.
- Card deck and steps controls: visitors tried to swipe sideways, so previous / next buttons and dots sit
  under the deck (`PagerControls` in `HomeScene.tsx`, texts in `content/<lang>/home.ts` →
  `values.controls` and `steps.controls`; the same buttons drive the steps via `stepProgressFor`). The scroll stays the single source of truth: a click scrolls the page to the
  position where that card rests (`deckProgressFor`, the inverse of `deckScroll`), and the scene
  loop keeps `aria-current` / `disabled` in sync (`deckIndex`). Hidden on short screens, where the
  cards are stacked. A horizontal swipe gesture is not implemented yet.
- Short screens (`max-height: 620px`, 200 % zoom): cards and steps are stacked, not pinned.

## Tests

`app/[lang]/page.test.tsx` (scene mocked), `lib/scene-math.test.ts`. The animation
itself needs a real browser: check at 375 px and desktop width after any change.

## First frame

The disc is `position: fixed` at `left: 0; top: 0` and `scene.ts` moves it to the centre on every frame. Until
the first frame (server render, hydration) it would show unscaled in the top-left corner, so `.disc` is
`opacity: 0` in CSS and `scene.ts` sets its opacity inline. Keep that default when touching the disc.
