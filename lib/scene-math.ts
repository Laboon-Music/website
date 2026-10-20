// Pure maths behind the scroll-driven home page (components/home/scene.ts).
// Kept free of the DOM so it can be unit-tested. See docs/features/home-scene.md.

export type Rgb = [number, number, number];

export const TAU = Math.PI * 2;

export const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
export const c01 = (x: number) => clamp(x, 0, 1);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smoothstep: 0 below `a`, 1 above `b`, eased in between. */
export function sstep(a: number, b: number, x: number): number {
  const t = c01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/** Cubic ease in-out, 0..1. */
export function easeInOut(x: number): number {
  const t = c01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Progress (0..1) through a pinned section whose stage is `height - vh` tall. */
export function pinProgress(top: number, height: number, vh: number): number {
  return c01(-top / Math.max(height - vh, 1));
}

/** How far a section has entered the screen (0 = below the fold, 1 = at the top). */
export function enterProgress(top: number, vh: number): number {
  return c01((vh - top) / vh);
}

/** Index of the active step: one step per equal share of the pinned scroll. */
export function stepIndex(progress: number, count: number): number {
  return Math.min(count - 1, Math.floor(progress * count * 0.999));
}

export type CardStyle = {
  transform: string;
  opacity: number;
  zIndex: number;
  /** Card is still behind the top of the deck (its content is faded). */
  back: boolean;
};

/**
 * Position of the deck (0..count-1, fractional while a card is being swiped).
 * With reduced motion it only rests on whole cards.
 */
export function deckScroll(progress: number, count: number, reduced: boolean): number {
  const raw = sstep(0.06, 0.9, progress) * (count - 1);
  if (reduced) return Math.round(raw);
  const whole = Math.floor(raw);
  return whole + sstep(0.2, 0.8, raw - whole);
}

/**
 * Style of card `index` for a deck at `scroll`: cards behind the top one are
 * stacked and fade; a swiped card flies off to the left.
 */
export function cardStyle(index: number, scroll: number): CardStyle {
  const dd = index - scroll;
  const zIndex = 10 - index;
  if (dd >= 0) {
    return {
      transform: `translate3d(${(dd * 14).toFixed(1)}px,${(dd * 14).toFixed(1)}px,0)`,
      opacity: dd > 3.2 ? 0 : Number((1 - 0.2 * Math.min(dd, 3)).toFixed(3)),
      zIndex,
      back: dd >= 0.5,
    };
  }
  const a = c01(-dd);
  return {
    transform: `translate3d(${(-a * 130).toFixed(1)}%,${(-a * 6).toFixed(1)}%,0) rotate(${(-a * 16).toFixed(1)}deg)`,
    opacity: Number((1 - sstep(0.55, 1, a)).toFixed(3)),
    zIndex,
    back: false,
  };
}

const FAQ_RAMP: [number, Rgb][] = [
  [0, [15, 18, 122]], // night
  [0.45, [71, 83, 255]], // Laboon blue
  [0.75, [182, 187, 254]],
  [1, [245, 245, 255]], // paper
];

/** Page colour while leaving the closing section for the FAQ: night → light. */
export function faqBackground(t: number): Rgb {
  let i = 1;
  while (i < FAQ_RAMP.length - 1 && t > FAQ_RAMP[i][0]) i++;
  const [t0, c0] = FAQ_RAMP[i - 1];
  const [t1, c1] = FAQ_RAMP[i];
  const k = (t - t0) / (t1 - t0);
  return [
    Math.round(lerp(c0[0], c1[0], k)),
    Math.round(lerp(c0[1], c1[1], k)),
    Math.round(lerp(c0[2], c1[2], k)),
  ];
}

/**
 * Ink of the manifesto words: navy on the light backdrop, white on the blue one.
 * `lineRed` is the red channel of the wave colour (71 = blue lines, 255 = white).
 */
export function manifestoInk(lineRed: number): Rgb {
  const k = c01((lineRed - 71) / 184);
  return [
    Math.round(lerp(0, 255, k)),
    Math.round(lerp(8, 255, k)),
    Math.round(lerp(115, 255, k)),
  ];
}

/** Opacity of the word at `index` while the sentence fills up (reduced = all filled). */
export function wordFill(
  progress: number,
  index: number,
  count: number,
  reduced: boolean,
) {
  if (reduced) return 1;
  return c01(sstep(0.2, 0.86, progress) * count - index);
}
