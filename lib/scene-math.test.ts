import { describe, expect, it } from "vitest";
import {
  c01,
  cardStyle,
  deckIndex,
  deckProgressFor,
  deckScroll,
  easeInOut,
  enterProgress,
  faqBackground,
  lerp,
  manifestoInk,
  pinProgress,
  ringFlow,
  sstep,
  stepIndex,
  stepProgressFor,
  wordFill,
} from "./scene-math";

describe("deck navigation", () => {
  it("deckProgressFor is the inverse of deckScroll for every card", () => {
    for (const count of [2, 4, 5]) {
      for (let i = 0; i < count; i++) {
        expect(deckScroll(deckProgressFor(i, count), count, false)).toBeCloseTo(i, 6);
        expect(
          deckIndex(deckScroll(deckProgressFor(i, count), count, false), count),
        ).toBe(i);
      }
    }
  });

  it("stepProgressFor lands in the middle of each step", () => {
    for (let i = 0; i < 3; i++) expect(stepIndex(stepProgressFor(i, 3), 3)).toBe(i);
  });

  it("deckIndex rounds to the nearest card and stays in range", () => {
    expect(deckIndex(1.4, 4)).toBe(1);
    expect(deckIndex(1.6, 4)).toBe(2);
    expect(deckIndex(-1, 4)).toBe(0);
    expect(deckIndex(9, 4)).toBe(3);
  });
});

describe("scene maths", () => {
  it("clamps and interpolates", () => {
    expect(c01(-1)).toBe(0);
    expect(c01(2)).toBe(1);
    expect(lerp(10, 20, 0.5)).toBe(15);
  });

  it("sstep is 0 before, 1 after and eased in between", () => {
    expect(sstep(0.2, 0.8, 0)).toBe(0);
    expect(sstep(0.2, 0.8, 1)).toBe(1);
    expect(sstep(0.2, 0.8, 0.5)).toBeCloseTo(0.5);
    expect(sstep(0, 1, 0.25)).toBeLessThan(0.25);
  });

  it("easeInOut keeps its endpoints and middle", () => {
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(1)).toBe(1);
    expect(easeInOut(0.5)).toBe(0.5);
  });

  it("pinProgress goes 0 → 1 over the pinned travel", () => {
    // section 3 screens tall (vh 100): travel = 200
    expect(pinProgress(0, 300, 100)).toBeCloseTo(0);
    expect(pinProgress(-100, 300, 100)).toBe(0.5);
    expect(pinProgress(-500, 300, 100)).toBe(1);
    expect(pinProgress(80, 300, 100)).toBe(0);
  });

  it("enterProgress is 0 below the fold and 1 once at the top", () => {
    expect(enterProgress(100, 100)).toBe(0);
    expect(enterProgress(50, 100)).toBe(0.5);
    expect(enterProgress(-20, 100)).toBe(1);
  });

  it("stepIndex shows one step per equal share and never overflows", () => {
    expect(stepIndex(0, 3)).toBe(0);
    expect(stepIndex(0.34, 3)).toBe(1);
    expect(stepIndex(0.7, 3)).toBe(2);
    expect(stepIndex(1, 3)).toBe(2);
  });
});

describe("deck of cards", () => {
  it("rests on whole cards when motion is reduced", () => {
    expect(Number.isInteger(deckScroll(0.4, 4, true))).toBe(true);
    expect(deckScroll(0, 4, true)).toBe(0);
    expect(deckScroll(1, 4, true)).toBe(3);
  });

  it("stacks the cards behind the top one, fading them", () => {
    const top = cardStyle(0, 0);
    const next = cardStyle(1, 0);
    expect(top.transform).toContain("translate3d(0.0px,0.0px,0)");
    expect(top.opacity).toBe(1);
    expect(top.back).toBe(false);
    expect(next.opacity).toBe(0.8);
    expect(next.back).toBe(true);
    expect(next.zIndex).toBeLessThan(top.zIndex);
    expect(cardStyle(5, 0).opacity).toBe(0);
  });

  it("flies the swiped card off to the left", () => {
    const gone = cardStyle(0, 1);
    expect(gone.transform).toContain("translate3d(-130.0%");
    expect(gone.opacity).toBe(0);
  });
});

describe("colours", () => {
  it("fades the FAQ background from night to paper", () => {
    expect(faqBackground(0)).toEqual([15, 18, 122]);
    expect(faqBackground(0.45)).toEqual([71, 83, 255]);
    expect(faqBackground(1)).toEqual([245, 245, 255]);
  });

  it("turns the manifesto ink from navy to white with the waves", () => {
    expect(manifestoInk(71)).toEqual([0, 8, 115]);
    expect(manifestoInk(255)).toEqual([255, 255, 255]);
  });

  it("fills the manifesto words one after the other", () => {
    expect(wordFill(0, 0, 5, false)).toBe(0);
    expect(wordFill(1, 4, 5, false)).toBe(1);
    expect(wordFill(0.1, 3, 5, true)).toBe(1);
    expect(wordFill(0.5, 0, 5, false)).toBeGreaterThan(wordFill(0.5, 4, 5, false));
  });
});

describe("ring flow (seamless loop)", () => {
  const gap = 28;
  // Radius and identity of the ring that sits at slot `slot` at time `t`.
  const ring = (t: number, slot: number) => {
    const { offset, cycle } = ringFlow(t, gap);
    return { r: slot * gap + offset, id: slot - cycle };
  };

  it("moves the rings outward by up to one gap, then wraps back", () => {
    expect(ringFlow(0, gap).offset).toBe(0);
    expect(ringFlow(1, gap).offset).toBeCloseTo(16);
    const wrap = gap / 16; // seconds for one gap
    expect(ringFlow(wrap - 0.001, gap).cycle).toBe(0);
    expect(ringFlow(wrap + 0.001, gap).cycle).toBe(1);
  });

  it("keeps the same ring identity across the wrap (no visible pop)", () => {
    const wrap = gap / 16;
    const before = ring(wrap - 0.0001, 3);
    // Just after the wrap the same physical ring sits one slot further out.
    const after = ring(wrap + 0.0001, 4);
    expect(after.r).toBeCloseTo(before.r, 1);
    expect(after.id).toBe(before.id);
  });

  it("is steady over many wraps", () => {
    for (let n = 1; n <= 20; n++) {
      const t = (n * gap) / 16;
      expect(ring(t - 1e-4, 5).id).toBe(ring(t + 1e-4, 6).id);
    }
  });
});
