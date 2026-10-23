import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UI as FR } from "@/content/fr/ui";
import { mockFetch, sentJson } from "@/tests/helpers";
import { TURNSTILE_WAIT_MS, useProtectedForm } from "./useProtectedForm";

// Turnstile enabled (site key configured) for this file.
vi.mock("@/components/antibot/Turnstile", () => ({ turnstileEnabled: true }));

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

describe("useProtectedForm with Turnstile", () => {
  it("does not start Turnstile before any interaction", () => {
    const { result } = renderHook(() => useProtectedForm("/api/x"));
    expect(result.current.turnstile.active).toBe(false);
    act(() => result.current.formProps.onFocus());
    expect(result.current.turnstile.active).toBe(true);
  });

  it("waits for the token instead of failing when submitted too early", async () => {
    const fetchMock = mockFetch(200, { ok: true });
    const { result } = renderHook(() => useProtectedForm("/api/x"));

    let submitted!: Promise<boolean>;
    act(() => {
      submitted = result.current.submit({ a: 1 });
    });
    expect(result.current.status).toBe("loading");
    expect(fetchMock).not.toHaveBeenCalled();

    await act(async () => {
      result.current.turnstile.onToken("tok");
      expect(await submitted).toBe(true);
    });
    expect(sentJson(fetchMock)).toMatchObject({ a: 1, turnstileToken: "tok" });
    expect(result.current.status).toBe("success");
  });

  it("gives up with a clear error when the token never comes", async () => {
    const fetchMock = mockFetch();
    const { result } = renderHook(() => useProtectedForm("/api/x"));

    await act(async () => {
      const submitted = result.current.submit({});
      await vi.advanceTimersByTimeAsync(TURNSTILE_WAIT_MS);
      expect(await submitted).toBe(false);
    });
    expect(result.current.error).toBe(FR.errors.turnstileTimeout);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("uses each token only once", async () => {
    const fetchMock = mockFetch(400, { error: "Nope" });
    const { result } = renderHook(() => useProtectedForm("/api/x"));
    act(() => result.current.turnstile.onToken("tok-1"));

    await act(async () => {
      await result.current.submit({});
    });
    expect(sentJson(fetchMock).turnstileToken).toBe("tok-1");
    expect(result.current.error).toBe("Nope");

    // Second attempt must wait for a fresh token.
    let second!: Promise<boolean>;
    act(() => {
      second = result.current.submit({});
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await act(async () => {
      result.current.turnstile.onToken("tok-2");
      await second;
    });
    expect(sentJson(fetchMock, 1).turnstileToken).toBe("tok-2");
  });
});
