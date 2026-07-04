import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** True after client hydration; false during SSR. Safe for portals. */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
