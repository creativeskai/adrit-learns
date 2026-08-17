"use client";
import { useEffect, useState } from "react";

// Runs `factory` only after mount (client-side), never during SSR. Every game
// randomizes its round order/options with Math.random(), which — if computed
// during the initial render — produces different output on the server than on
// the client and triggers a React hydration mismatch. Deferring to an effect
// means server and first client paint both render nothing, then the real
// (randomized) content appears as an ordinary post-mount state update instead
// of a hydration diff.
export function useClientMemo<T>(factory: () => T): T | null {
  const [value, setValue] = useState<T | null>(null);
  useEffect(() => {
    setValue(factory());
    // Intentionally runs once per mount — factory is expected to be a stable closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}
