"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useUi } from "@/components/i18n/LocaleProvider";
import { turnstileEnabled, type TurnstileHandle } from "@/components/antibot/Turnstile";

// Client side of the anti-bot protection + submit lifecycle shared by every
// public form. See docs/features/antibot.md.

export type FormStatus = "idle" | "loading" | "success" | "error";

/** How long a submit waits for the Turnstile token before giving up. */
export const TURNSTILE_WAIT_MS = 15_000;

export function useProtectedForm(endpoint: string) {
  const locale = useLocale();
  const ui = useUi();
  const { generic: GENERIC_ERROR, turnstileTimeout: TURNSTILE_TIMEOUT_ERROR } = ui.errors;
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");
  // Honeypot value: stays empty for humans.
  const [honeypot, setHoneypot] = useState("");
  // Turnstile is only mounted once the visitor interacts with the form, so a
  // page with several forms runs a single challenge (and none for readers).
  const [turnstileActive, setTurnstileActive] = useState(false);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const token = useRef("");
  const tokenWaiters = useRef<((token: string) => void)[]>([]);
  // When the form was displayed: a near-instant submit gives a bot away.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function onToken(value: string) {
    token.current = value;
    if (!value) return;
    for (const resolve of tokenWaiters.current) resolve(value);
    tokenWaiters.current = [];
  }

  /** Resolves with the Turnstile token as soon as it exists, or "" on timeout. */
  function waitForToken(): Promise<string> {
    if (token.current) return Promise.resolve(token.current);
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        tokenWaiters.current = tokenWaiters.current.filter((w) => w !== done);
        resolve("");
      }, TURNSTILE_WAIT_MS);
      const done = (value: string) => {
        clearTimeout(timer);
        resolve(value);
      };
      tokenWaiters.current.push(done);
    });
  }

  function fail(message: string) {
    setStatus("error");
    setError(message);
  }

  /** POSTs `payload` plus the anti-bot fields. Resolves true on success. */
  async function submit(payload: Record<string, unknown>): Promise<boolean> {
    setTurnstileActive(true);
    setStatus("loading");
    setError("");

    // A visitor clicking before Turnstile is done just waits a little longer
    // instead of getting an error.
    const turnstileToken = turnstileEnabled ? await waitForToken() : "";
    if (turnstileEnabled && !turnstileToken) {
      fail(TURNSTILE_TIMEOUT_ERROR);
      return false;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          locale,
          website: honeypot,
          elapsedMs: Date.now() - startedAt.current,
          turnstileToken,
        }),
      });
      const data = await res.json().catch(() => ({}));
      // A Turnstile token is single-use: ask for a fresh one.
      token.current = "";
      turnstileRef.current?.reset();

      if (!res.ok) {
        fail(typeof data.error === "string" ? data.error : GENERIC_ERROR);
        return false;
      }
      setStatus("success");
      return true;
    } catch {
      fail(GENERIC_ERROR);
      return false;
    }
  }

  return {
    status,
    error,
    fail,
    submit,
    /** Spread on the <form>: starts Turnstile on first interaction. */
    formProps: {
      onFocus: () => setTurnstileActive(true),
      onPointerDown: () => setTurnstileActive(true),
    },
    honeypot: { value: honeypot, onChange: setHoneypot },
    turnstile: { active: turnstileActive, ref: turnstileRef, onToken },
  };
}
