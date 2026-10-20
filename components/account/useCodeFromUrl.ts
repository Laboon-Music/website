"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reads the one-time `?code=` of an e-mailed link, then removes it from the
 * address bar (history, screenshots, referrers). `undefined` while not read yet
 * (server render), `null` when there is no code.
 */
export function useCodeFromUrl(): string | null | undefined {
  const [code, setCode] = useState<string | null | undefined>(undefined);
  // React may run the effect twice (Strict Mode): the second run no longer finds
  // the code in the URL, so the first reading is kept.
  const found = useRef<string | null>(null);
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("code");
    if (fromUrl) {
      found.current = fromUrl;
      window.history.replaceState(null, "", window.location.pathname);
    }
    queueMicrotask(() => setCode(found.current));
  }, []);
  return code;
}
