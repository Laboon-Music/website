// Scroll-driven scene of the home page: wave field, growing disc, manifesto,
// card deck, spotlight stepper and the colour hand-over to the FAQ.
//
// The React component (HomeScene.tsx) renders the markup and tags what moves
// with `data-scene="…"`; this module reads those nodes and drives them from one
// requestAnimationFrame loop. Pure maths lives in lib/scene-math.ts.
// See docs/features/home-scene.md.

import {
  TAU,
  c01,
  cardStyle,
  deckScroll,
  easeInOut,
  enterProgress,
  faqBackground,
  lerp,
  manifestoInk,
  pinProgress,
  sstep,
  stepIndex,
  wordFill,
  type Rgb,
} from "@/lib/scene-math";

export type SceneHandle = {
  /** Skips what is left of the intro and shows the hero content. */
  reveal: () => void;
  destroy: () => void;
};

type Field = {
  ax: number;
  ay: number;
  tune: number;
  R: number;
  alpha: number;
  col: Rgb;
  lw: number;
  hole: number;
  spin: number;
};

/** Total length of the intro (disc turning, then growing), in seconds. */
const INTRO_END = 5.6;
/** The hero content appears once the disc has opened around it. */
const REVEAL_AT = 4.9;
const NIGHT = "#0F127A";

export function startHomeScene(root: HTMLElement, isReduced: () => boolean): SceneHandle {
  const $ = <T extends HTMLElement>(name: string) =>
    root.querySelector<T>(`[data-scene="${name}"]`)!;
  const $$ = <T extends HTMLElement>(name: string) =>
    Array.from(root.querySelectorAll<T>(`[data-scene="${name}"]`));

  const hero = $("hero");
  const copy = $("copy");
  const disc = $("disc");
  const discDot = $("disc-dot");
  const introMark = $("intro-mark");
  const man = $("manifesto");
  const values = $("values");
  const steps = $("steps");
  const close = $("close");
  const faqHeader = document.querySelector<HTMLElement>("[data-faq-header]");
  const bgEl = $("bgflow");
  const words = $$("word");
  const cards = $$("card");
  const stepTexts = $$("step-text");
  const stepIcons = $$("step-icon");
  const field = $<HTMLCanvasElement>("field");
  const dustCv = $<HTMLCanvasElement>("dust");
  const ctx = field.getContext("2d")!;
  const dustCtx = dustCv.getContext("2d")!;
  const discImg = disc.firstElementChild as HTMLImageElement | null;

  let reduce = isReduced();
  let vw = innerWidth;
  let vh = innerHeight;
  let dpr = 1;
  let raf = 0;
  let dead = false;

  /* ---- spotlight dust ---- */
  let dustW = 0;
  let dustH = 0;
  const dust = Array.from({ length: 70 }, () => ({
    u: Math.random() * 2 - 1,
    y: Math.random(),
    r: 0.5 + Math.random() * 1.6,
    sp: 0.004 + Math.random() * 0.012,
    ph: Math.random() * 6.28,
    a: 0.25 + Math.random() * 0.6,
  }));
  function sizeDust() {
    const r = dustCv.getBoundingClientRect();
    const d = Math.min(devicePixelRatio || 1, 2);
    dustW = r.width;
    dustH = r.height;
    dustCv.width = Math.round(dustW * d);
    dustCv.height = Math.round(dustH * d);
    dustCtx.setTransform(d, 0, 0, d, 0, 0);
  }
  function drawDust(dt: number) {
    if (!dustW) sizeDust();
    dustCtx.clearRect(0, 0, dustW, dustH);
    // The visible beam sits at the bottom of the canvas (the lamp is off-screen).
    for (const p of dust) {
      if (!reduce) {
        p.y += p.sp * dt * (p.u > 0 ? 1 : -0.6);
        p.ph += dt * 0.8;
        if (p.y > 1) p.y = 0;
        if (p.y < 0) p.y = 1;
      }
      const hw = 0.04 + 0.26 * p.y;
      const x = dustW * (0.5 + p.u * hw) + Math.sin(p.ph) * 6;
      const a =
        p.a *
        (p.y < 0.62 ? 0.15 : p.y < 0.72 ? 0.3 : 1) *
        (0.6 + 0.4 * Math.sin(p.ph * 1.7));
      dustCtx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
      dustCtx.beginPath();
      dustCtx.arc(x, dustH * p.y, p.r, 0, 6.2832);
      dustCtx.fill();
    }
  }

  /* ---- wave field ---- */
  function size() {
    vw = innerWidth;
    vh = innerHeight;
    dpr = Math.min(devicePixelRatio || 1, 1.75);
    field.width = Math.round(vw * dpr);
    field.height = Math.round(vh * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dustW = 0;
  }
  const S: Field = {
    ax: vw * 0.5,
    ay: vh * 0.3,
    tune: 0,
    R: 4000,
    alpha: 0,
    col: [71, 83, 255],
    lw: 1.2,
    hole: 0,
    spin: 0,
  };
  const T: Field = { ...S, col: [71, 83, 255] };

  function ring(
    cx: number,
    cy: number,
    r: number,
    ph: number,
    wob: number,
    spin: number,
    k: number,
  ) {
    const seg = r < 160 ? 56 : r < 520 ? 110 : 160;
    ctx.beginPath();
    for (let j = 0; j <= seg; j++) {
      const th = (j / seg) * TAU;
      const a = th + spin;
      const rr =
        r +
        wob * Math.sin(5 * a + ph + k) +
        wob * 0.55 * Math.sin(9 * a - ph * 1.3 + k * 0.7) +
        1.7 * Math.sin(28 * a + ph * 2 + k * 0.2);
      const x = cx + rr * Math.cos(th);
      const y = cy + rr * Math.sin(th);
      if (j) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.stroke();
  }
  function drawSource(
    cx: number,
    cy: number,
    t: number,
    alpha: number,
    wob: number,
    phase: number,
    spin: number,
  ) {
    const gap = vw < 700 ? 20 : 28;
    const maxR = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy)) + gap * 2;
    const lim = Math.min(maxR, S.R + gap * 3);
    const start = S.hole;
    const flow = reduce ? 0 : (t * 16) % gap;
    const c = S.col;
    ctx.lineWidth = S.lw;
    for (let i = 0; ; i++) {
      const r = start + i * gap + flow;
      if (r > lim) break;
      if (r < 4) continue;
      let a = alpha * (1 - 0.65 * Math.pow(r / maxR, 1.6));
      if (r > S.R) a *= 1 - c01((r - S.R) / (gap * 3));
      if (start > 0) a *= c01((r - start) / (gap * 1.5));
      if (a < 0.01) continue;
      ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
      ring(cx, cy, r, phase + i * 0.32, wob, spin, i * 0.9);
    }
  }

  /* ---- backdrop gradient of the hero + manifesto (stops placed in px) ---- */
  const bgStops = { light: 0, dark: 1 };
  function placeGradient() {
    const h = hero.offsetHeight;
    const end = h + man.offsetHeight;
    const V = innerHeight;
    const at = (x: number) => `${Math.round(x)}px`;
    bgEl.style.height = at(end);
    bgEl.style.background = `linear-gradient(to bottom,#FFFFFF ${at(h * 0.08)},#E3E5FF ${at(h * 0.94)},#4753FF ${at(h + V * 0.45)},#4753FF ${at(h + V * 1.2)},#2A31C8 ${at(end - V * 0.5)},#161A8F ${at(end)})`;
    // Ink and waves turn white once the disc core has covered the screen.
    bgStops.light = h * 0.55;
    bgStops.dark = h * 0.8;
  }

  /* ---- per-frame targets ---- */
  function targets() {
    vw = innerWidth;
    vh = innerHeight;
    const hr = hero.getBoundingClientRect();
    const heroE = c01(-hr.top / vh);
    const mr = man.getBoundingClientRect();
    const mp = pinProgress(mr.top, mr.height, vh);
    const mIn = enterProgress(mr.top, vh);
    const vIn = enterProgress(values.getBoundingClientRect().top, vh);
    const crr = close.getBoundingClientRect();
    const cIn = enterProgress(crr.top, vh);
    const cOut = c01(-crr.top / Math.max(crr.height, 1));
    const mobile = vw < 860;

    // hero: the wave source sits behind the wordmark
    const ax = vw / 2;
    const ay = vh / 2;
    // manifesto: tune (0..0.26) then press into a disc
    const tuneP = sstep(0, 0.26, mp);
    const discR = Math.min(vw, vh) * (mobile ? 0.42 : 0.36);
    const maxR = Math.hypot(vw, vh);
    const cx = vw / 2;
    const cy = vh / 2;

    T.alpha = 0;
    T.tune = 0.5 + heroE * 0.1;
    T.R = maxR;
    T.hole = 0;
    T.lw = 1.2;
    T.col = [71, 83, 255];
    T.ax = ax;
    T.ay = ay;

    if (mIn > 0) {
      const e = sstep(0, 1, mIn);
      T.ax = lerp(ax, cx, e);
      T.ay = lerp(ay, cy, e);
      T.alpha = sstep(0.55, 1, mIn);
      T.tune = lerp(T.tune, 0.6, e) + tuneP * 0.4;
      const press = sstep(0.18, 0.42, mp);
      T.R = lerp(maxR, discR, press);
      T.hole = lerp(0, discR * 0.16, press);
      T.lw = lerp(1.2, 1.5, press);
    }
    // values: the field fades under the night
    if (vIn > 0) T.alpha = 1 - sstep(0.05, 0.7, vIn);
    // close: back again, fully in phase
    if (cIn > 0) {
      const f = sstep(0.2, 0.95, cIn);
      T.alpha = f * 0.75 * (1 - sstep(0.02, 0.4, cOut));
      T.tune = 1;
      T.R = maxR;
      T.hole = 0;
      T.lw = 1.2;
      T.col = [255, 255, 255];
      T.ax = cx;
      T.ay = vh * 0.42;
    }
    // line colour follows the backdrop: blue on light, white once dark enough
    if (cIn <= 0) {
      const w = vIn > 0 ? 1 : sstep(bgStops.light, bgStops.dark, scrollY + vh * 0.5);
      T.col = [Math.round(lerp(71, 255, w)), Math.round(lerp(83, 255, w)), 255];
    }
    return {
      heroE,
      mp,
      vp: pinProgress(values.getBoundingClientRect().top, values.offsetHeight, vh),
      vIn,
      cOut,
    };
  }

  /* ---- intro of the disc ----
     Frame 1: a 480 px disc behind the wordmark. Frame 2: the disc is about twice
     the screen width and its blue core holds the title and the form. On scroll
     it keeps growing until its core floods the screen. */
  let introT = reduce ? 99 : 0;
  let introSpeed = 1;
  let revealed = false;
  const pageT0 = performance.now();
  function reveal() {
    if (revealed) return;
    revealed = true;
    root.classList.add("is-revealed");
  }
  function skipIntro() {
    if (introT < INTRO_END) introSpeed = 3;
  }
  function onKey(e: KeyboardEvent) {
    // Keyboard users want the content now: finish the intro on the first Tab.
    if (e.key === "Tab" && introT < INTRO_END) introT = INTRO_END;
    else skipIntro();
  }
  addEventListener("wheel", skipIntro, { passive: true });
  addEventListener("touchstart", skipIntro, { passive: true });
  addEventListener("keydown", onKey);

  function discFrame(dt: number, st: { heroE: number; mp: number }) {
    // however the visitor scrolls (wheel, bar, keyboard, link), the intro speeds up;
    // landing far down (anchor link, reload) skips it: the header must show at once.
    if (st.heroE > 0.5 && introT < INTRO_END) introT = INTRO_END;
    else if (st.heroE > 0.02) skipIntro();
    const started = !discImg || discImg.complete || performance.now() - pageT0 > 2500;
    if (started) introT += dt * introSpeed;
    const t = introT;
    const W = Math.min(788, vw * 0.86);
    const D1 = W * (572 / 788);
    const c1x = vw / 2 + W * 0.04;
    const c1y = vh / 2;
    // the core (≈ 22 % of the image) must hold the title and the form
    const cr = copy.getBoundingClientRect();
    const D2 = Math.max(vw * 1.993, (Math.max(cr.width * 0.92, cr.height) + 56) / 0.225);
    const a = sstep(0.6, 3.2, t);
    const b = easeInOut((t - 2.1) / 3.3);
    let sz = D1 * Math.pow(D2 / D1, b);
    let rot = -12.56 + (409.17 + 12.56) * (0.5 * a + 0.5 * b);
    const cx = lerp(c1x, vw / 2, b);
    const cy = lerp(c1y, vh / 2, b);
    if (t > REVEAL_AT) reveal();
    // on scroll: keeps turning and grows until it covers the screen
    const z = Math.pow(st.heroE, 1.6);
    sz *= Math.pow(Math.hypot(vw, vh) / (D2 * 0.2), z);
    rot += scrollY * 0.035;
    const op = 1 - sstep(0.12, 0.4, st.mp);
    disc.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg) scale(${(sz / 1000).toFixed(4)})`;
    disc.style.opacity = op.toFixed(3);
    discDot.style.opacity = (1 - sstep(0, 0.35, b)).toFixed(3);
    introMark.style.opacity = (
      (1 - sstep(0.1, 0.55, b)) *
      (1 - sstep(0, 0.25, st.heroE))
    ).toFixed(3);
    introMark.style.transform = `scale(${(1 + 0.18 * b).toFixed(3)})`;
  }

  /* ---- main loop ---- */
  let t0 = performance.now();
  let clock = 0;
  let lastDrawKey = "";
  let beamOn = false;
  let settleT = 0;
  let stayT = 0;
  let settleY = -1;
  let pulseT = 0;
  let stepIdx = 0;
  let bodyPainted = false;

  function frame(now: number) {
    if (dead) return;
    reduce = isReduced();
    if (reduce && introT < 99) introT = 99;
    const dt = Math.min((now - t0) / 1000, 0.05);
    t0 = now;
    clock += dt;
    const st = targets();
    const k = reduce ? 1 : 1 - Math.pow(0.0009, dt); // frame-rate independent smoothing
    S.ax = lerp(S.ax, T.ax, k);
    S.ay = lerp(S.ay, T.ay, k);
    S.tune = lerp(S.tune, T.tune, k);
    S.R = lerp(S.R, T.R, k);
    S.hole = lerp(S.hole, T.hole, k);
    S.alpha = lerp(S.alpha, T.alpha, reduce ? 1 : 1 - Math.pow(0.02, dt));
    S.lw = T.lw;
    S.col = T.col;
    S.spin += reduce ? 0 : dt * (0.05 + st.mp * 0.5);

    // field: no drawing while invisible; with reduced motion only when it changes
    const key = [
      S.ax | 0,
      S.ay | 0,
      S.tune.toFixed(2),
      S.R | 0,
      S.alpha.toFixed(2),
      S.col.join(),
    ].join();
    if (!(reduce && key === lastDrawKey)) {
      ctx.clearRect(0, 0, vw, vh);
      if (S.alpha > 0.01) {
        const dis = 1 - S.tune;
        drawSource(S.ax, S.ay, clock, S.alpha * 0.7, 2.5 + dis * 6, clock * 0.5, S.spin);
      }
      lastDrawKey = key;
    }

    discFrame(dt, st);

    // hero: copy drifts up and fades as the disc swallows the screen
    if (!reduce) {
      copy.style.transform = `translate3d(0,${(-st.heroE * vh * 0.32).toFixed(1)}px,0)`;
      copy.style.opacity = (1 - sstep(0.05, 0.45, st.heroE)).toFixed(3);
    } else {
      copy.style.transform = "";
      copy.style.opacity = "";
    }

    // manifesto: words fill one by one; ink follows the backdrop
    const ink = manifestoInk(S.col[0]);
    words.forEach((w, i) => {
      const f = wordFill(st.mp, i, words.length, reduce);
      w.style.color = `rgba(${ink[0]},${ink[1]},${ink[2]},${(0.22 + 0.78 * f).toFixed(3)})`;
    });

    // values: each card leaves with a swipe to the left
    const scroll = deckScroll(st.vp, cards.length, reduce);
    cards.forEach((card, i) => {
      const s = cardStyle(i, scroll);
      card.style.transform = s.transform;
      card.style.opacity = String(s.opacity);
      card.style.zIndex = String(s.zIndex);
      card.classList.toggle("is-back", s.back);
    });

    // closing → FAQ: the night background turns into the light FAQ background
    const bgT = sstep(0.2, 0.62, st.cOut);
    if (bgT > 0) {
      const [r, g, b] = faqBackground(bgT);
      document.body.style.backgroundColor = `rgb(${r},${g},${b})`;
      bodyPainted = true;
    } else if (st.vIn > 0) {
      document.body.style.backgroundColor = NIGHT;
      bodyPainted = true;
    } else if (bodyPainted) {
      document.body.style.backgroundColor = "";
      bodyPainted = false;
    }
    // the FAQ title (navy) only appears once the background is light enough
    if (faqHeader) faqHeader.style.opacity = sstep(0.6, 0.9, bgT).toFixed(3);

    // steps: the spotlight lights up when the section reaches the screen
    //  - "arrived": the section covers most of the screen
    //  - lit as soon as the scroll really slows down (< 2 px/frame for 0.12 s) or after 0.8 s
    //  - switched off only once clearly left (hysteresis: no flicker at the edges)
    const sr = steps.getBoundingClientRect();
    const arrived = sr.top < vh * 0.2 && sr.bottom > vh * 0.8;
    const gone = sr.top > vh * 0.5 || sr.bottom < vh * 0.5;
    if (beamOn) {
      if (gone) {
        beamOn = false;
        stayT = settleT = 0;
        steps.classList.remove("is-lit");
      }
    } else if (arrived) {
      stayT += dt;
      settleT = Math.abs(scrollY - settleY) < 2 ? settleT + dt : 0;
      if (settleT > 0.12 || stayT > 0.8) {
        beamOn = true;
        steps.classList.add("is-lit");
      }
    } else {
      stayT = settleT = 0;
    }
    settleY = scrollY;
    if (beamOn) drawDust(dt);
    // one step per third of the pinned scroll
    const si = stepIndex(pinProgress(sr.top, sr.height, vh), stepTexts.length);
    if (si !== stepIdx) {
      stepIdx = si;
      // the beam pulses at each new step
      steps.classList.remove("is-pulse");
      void steps.offsetWidth;
      steps.classList.add("is-pulse");
      clearTimeout(pulseT);
      pulseT = window.setTimeout(() => steps.classList.remove("is-pulse"), 700);
      stepTexts.forEach((el, q) => el.classList.toggle("is-active", q === si));
      stepIcons.forEach((el, q) => el.classList.toggle("is-active", q === si));
    }

    raf = requestAnimationFrame(frame);
  }

  function onResize() {
    size();
    placeGradient();
  }
  size();
  placeGradient();
  addEventListener("resize", onResize, { passive: true });
  document.fonts?.ready.then(() => {
    if (!dead) placeGradient();
  });
  raf = requestAnimationFrame(frame);

  return {
    reveal() {
      introT = Math.max(introT, INTRO_END);
      reveal();
    },
    destroy() {
      dead = true;
      cancelAnimationFrame(raf);
      clearTimeout(pulseT);
      removeEventListener("wheel", skipIntro);
      removeEventListener("touchstart", skipIntro);
      removeEventListener("keydown", onKey);
      removeEventListener("resize", onResize);
      document.body.style.backgroundColor = "";
    },
  };
}
