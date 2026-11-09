"use client";

// Connects the homepage introduction and pause control to the reusable swarm.
import { useCallback, useEffect, useState } from "react";

import { beesCopy } from "@/content/bees";

import { BeeSwarm } from "./BeeSwarm";
import { useBeeEligibility } from "./use-bee-eligibility";

export function HomeBeeSwarm() {
  const eligible = useBeeEligibility();
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialPosition, setInitialPosition] = useState<{
    x: number;
    y: number;
  }>();
  const reportError = useCallback((cause: Error) => setError(cause.message), []);

  useEffect(() => {
    if (!eligible) return;

    let pointerMoved = false;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (pointerMoved) return;
        const intro = document.getElementById("home-intro");
        if (!intro) {
          throw new Error("HomeBeeSwarm requires the #home-intro anchor.");
        }
        const bounds = intro.getBoundingClientRect();
        setInitialPosition({
          x: Math.max(104, Math.min(window.innerWidth - 104, bounds.right + 72)),
          y: Math.max(104, Math.min(window.innerHeight - 104, bounds.top + 72)),
        });
      });
    };
    const trackPointer = (event: PointerEvent) => {
      if (event.pointerType === "mouse") pointerMoved = true;
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("pointermove", trackPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", trackPointer);
    };
  }, [eligible]);

  return (
    <>
      <BeeSwarm
        count={error ? 0 : undefined}
        paused={paused}
        initialPosition={initialPosition}
        onError={reportError}
      />
      {eligible && (
        <div className="fixed right-4 bottom-4 z-50 max-w-xs">
          {error ? (
            <p
              role="status"
              className="rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground"
            >
              {beesCopy.unavailable}: {error}
            </p>
          ) : (
            <button
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused((value) => !value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {paused ? beesCopy.resume : beesCopy.pause}
            </button>
          )}
        </div>
      )}
    </>
  );
}
