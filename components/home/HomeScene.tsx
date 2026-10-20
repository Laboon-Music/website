"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaqSection } from "@/components/faq/FaqSection";
import { SiteFooter, SiteHeader, Wordmark } from "@/components/layout";
import SignupForm from "@/components/newsletter/SignupForm";
import { HOME_CONTENT } from "@/content/home";
import { cx } from "@/lib/cx";
import { startHomeScene, type SceneHandle } from "./scene";
import "./home.css";

const { nav, hero, manifesto, values, steps, finalCta, motion } = HOME_CONTENT;

/** Words of the manifesto: filled one by one on scroll (read as one sentence). */
const MANIFESTO_WORDS = manifesto.text.split(/\s+/);

// Spans (in screens of scroll) of the pinned sections.
const SPAN_MANIFESTO = 3.2;
const SPAN_VALUES = 2.8;
const SPAN_STEPS = 3.4;

function pinStyle(span: number) {
  return { "--span": span } as React.CSSProperties;
}

function focusEmail(formId: string) {
  document.querySelector<HTMLInputElement>(`#${formId} input[type=email]`)?.focus({
    preventScroll: true,
  });
}

// The home page: an animated, scroll-driven story (see scene.ts) ending on the
// signup form and the FAQ. Texts: content/home.ts and content/faq.ts.
export default function HomeScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneHandle | null>(null);
  // Visitor's own "pause animations" switch (WCAG 2.2.2), on top of the OS setting.
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
    // The class is toggled by hand: React must not own `className`, which the
    // scene also writes to (is-revealed).
    rootRef.current?.classList.toggle("is-paused", paused);
  }, [paused]);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    sceneRef.current = startHomeScene(
      rootRef.current!,
      () => mq.matches || pausedRef.current,
    );
    return () => {
      sceneRef.current?.destroy();
      sceneRef.current = null;
    };
  }, []);

  function onJoin(e: React.MouseEvent<HTMLAnchorElement>) {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // At the top the signup is the hero's: show it now and focus it.
    if (scrollY < innerHeight * 0.4) {
      e.preventDefault();
      sceneRef.current?.reveal();
      focusEmail("inscription");
      return;
    }
    // Elsewhere the link scrolls to the closing form, then we focus it.
    setTimeout(() => focusEmail("inscription-fin"), reduced ? 0 : 1500);
  }

  return (
    <div ref={rootRef} id="top" className="home">
      <a
        href="#contenu"
        className="sr-only z-70 rounded-full bg-white px-5 py-2.5 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Aller au contenu
      </a>

      {/* Decor: backdrop, growing disc, wave field and the opening wordmark. */}
      <div data-scene="bgflow" className="bgflow" aria-hidden="true" />
      <div data-scene="disc" className="disc" aria-hidden="true">
        <Image
          className="disc__motif"
          src="/brand/motif-hd.webp"
          alt=""
          width={4807}
          height={3548}
          unoptimized
          priority
        />
        <Image
          data-scene="disc-dot"
          className="disc__dot"
          src="/brand/cd-dot.svg"
          alt=""
          width={12}
          height={12}
          unoptimized
        />
      </div>
      <canvas data-scene="field" className="field" aria-hidden="true" />
      <div data-scene="intro-mark" className="intro-mark" aria-hidden="true">
        <Wordmark className="w-full" />
      </div>

      <SiteHeader
        logoHref="#top"
        logoLabel={nav.logoLabel}
        ctaHref="#rejoindre"
        ctaLabel={nav.join}
        onCtaClick={onJoin}
      />

      <main id="contenu" tabIndex={-1}>
        {/* 1 · Hero: the disc opens around the title and the signup */}
        <section data-scene="hero" className="hero" aria-labelledby="hero-title">
          <div data-scene="copy" className="hero__copy">
            <div className="hero__reveal">
              <Image
                className="hero__mark"
                src="/brand/wordmark-o-white.svg"
                alt={hero.wordmarkAlt}
                width={510}
                height={132}
                unoptimized
              />
              <h1 id="hero-title">{hero.title}</h1>
              <p className="hero__lede">{hero.subtitle}</p>
              <SignupForm id="inscription" />
            </div>
          </div>
        </section>

        {/* 2 · Manifesto: the waves tune, press into a disc, the sentence fills */}
        <section
          data-scene="manifesto"
          className="manifesto on-dark pin"
          style={pinStyle(SPAN_MANIFESTO)}
          aria-label={manifesto.label}
        >
          <div className="stage">
            <h2 className="manifesto__line display" aria-label={manifesto.text}>
              {MANIFESTO_WORDS.map((word, i) => (
                <span key={i}>
                  <span data-scene="word" className="w" aria-hidden="true">
                    {word}
                  </span>
                  {i < MANIFESTO_WORDS.length - 1 && " "}
                </span>
              ))}
            </h2>
          </div>
        </section>

        {/* 3 · Values: a deck of cards that gets swiped */}
        <section
          data-scene="values"
          className="values on-dark pin"
          style={pinStyle(SPAN_VALUES)}
          aria-labelledby="values-title"
        >
          <div className="stage">
            <div className="values__intro">
              <h2 id="values-title" className="display">
                {values.title}
              </h2>
              <p>{values.subtitle}</p>
            </div>
            <ol className="deck">
              {values.items.map((item) => (
                <li key={item.title} data-scene="card" className="deck-card">
                  <h3>{item.title}</h3>
                  <Image
                    className="deck-card__icon"
                    src={`/brand/${item.icon}`}
                    alt=""
                    width={256}
                    height={256}
                    unoptimized
                  />
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 4 · Steps: the disc stays, the icon and the text change at each step */}
        <section
          data-scene="steps"
          className="steps on-dark pin"
          style={pinStyle(SPAN_STEPS)}
          aria-labelledby="steps-title"
        >
          <div className="stage">
            <div className="steps__intro">
              <h2 id="steps-title" className="display">
                {steps.title}
              </h2>
              <p>{steps.subtitle}</p>
            </div>
            <div className="stepper">
              <ol className="stepper__texts">
                {steps.items.map((step, i) => (
                  <li
                    key={step.label}
                    data-scene="step-text"
                    className={cx("stepper__text", i === 0 && "is-active")}
                  >
                    <p className="stepper__label">{step.label}</p>
                    <p className="stepper__body">{step.text}</p>
                  </li>
                ))}
              </ol>
              <div className="stepper__visual" aria-hidden="true">
                <div className="beam">
                  <span className="beam__haze" />
                  <span className="beam__core" />
                  <canvas data-scene="dust" className="beam__dust" />
                </div>
                <span className="beam__pool" />
                <div className="stepper__icons">
                  {steps.items.map((step, i) => (
                    <Image
                      key={step.label}
                      data-scene="step-icon"
                      className={i === 0 ? "is-active" : undefined}
                      src={`/brand/${step.icon}`}
                      alt=""
                      width={256}
                      height={256}
                      unoptimized
                    />
                  ))}
                </div>
                <Image
                  className="stepper__plate"
                  src="/brand/plate-white.webp"
                  alt=""
                  width={900}
                  height={900}
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5 · End: the field is back, fully in phase */}
        <section
          data-scene="close"
          id="rejoindre"
          className="home-close on-dark"
          aria-labelledby="close-title"
        >
          <div className="home-close__inner">
            <h2 id="close-title" className="display">
              {finalCta.title}
            </h2>
            <p className="home-close__lede">{finalCta.text}</p>
            <SignupForm id="inscription-fin" />
          </div>
        </section>

        {/* 6 · FAQ */}
        <FaqSection />
      </main>

      <SiteFooter>
        <button
          type="button"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
          className="min-h-11 text-[13px] font-semibold underline underline-offset-[0.2em] hover:no-underline"
        >
          {paused ? motion.resume : motion.pause}
        </button>
      </SiteFooter>
    </div>
  );
}
