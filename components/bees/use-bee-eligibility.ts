"use client";

import { useSyncExternalStore } from "react";

const POINTER_QUERY = "(any-hover: hover) and (any-pointer: fine)";
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const pointer = window.matchMedia(POINTER_QUERY);
  const motion = window.matchMedia(MOTION_QUERY);
  pointer.addEventListener("change", onChange);
  motion.addEventListener("change", onChange);
  return () => {
    pointer.removeEventListener("change", onChange);
    motion.removeEventListener("change", onChange);
  };
}

function getSnapshot() {
  return window.matchMedia(POINTER_QUERY).matches && window.matchMedia(MOTION_QUERY).matches;
}

// A false server snapshot avoids rendering or importing WebGL during hydration.
export function useBeeEligibility(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
