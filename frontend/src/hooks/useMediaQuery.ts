'use client';
import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query. Returns false during SSR / first render,
 * then the real match on the client. Uses useSyncExternalStore so it stays
 * hydration-safe without calling setState inside an effect.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
