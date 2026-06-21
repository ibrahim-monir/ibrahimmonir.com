'use client';
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns false during SSR and the first client render, then true once the
 * component has hydrated. Hydration-safe (no setState-in-effect), so it
 * satisfies the react-hooks/set-state-in-effect rule.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
