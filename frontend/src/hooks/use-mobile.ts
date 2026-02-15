import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => undefined;

  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  mql.addEventListener("change", callback);
  window.addEventListener("resize", callback);

  return () => {
    mql.removeEventListener("change", callback);
    window.removeEventListener("resize", callback);
  };
};

const getSnapshot = () =>
  typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
