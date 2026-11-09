"use client";

// React owns mounting and configuration; the lazy renderer owns every frame.
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { resolveBeeOptions, validateBeePosition } from "./config";
import type { BeePosition, BeeSwarmProps } from "./config";
import type { SwarmController } from "./renderer";
import { useBeeEligibility } from "./use-bee-eligibility";

export type { BeeSwarmProps } from "./config";

export function BeeSwarm({ initialPosition, onError, ...props }: BeeSwarmProps) {
  const options = resolveBeeOptions(props);
  validateBeePosition(initialPosition);
  const eligible = useBeeEligibility();
  const active = eligible && options.count > 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<SwarmController | null>(null);
  const latest = useRef({ options, initialPosition, onError });

  useEffect(() => {
    latest.current = { options, initialPosition, onError };
    controllerRef.current?.update(options, initialPosition);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!active || !canvas) return;
    const abort = new AbortController();
    let pendingPointer: BeePosition | undefined;
    const rememberPointer = (event: PointerEvent) => {
      if (event.pointerType === "mouse") pendingPointer = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("pointermove", rememberPointer, { passive: true });
    const report = (error: Error) => {
      if (abort.signal.aborted) return;
      console.error("[BeeSwarm]", error);
      latest.current.onError?.(error);
    };

    void import("./renderer")
      .then(({ createSwarm }) => {
        if (abort.signal.aborted) return;
        return createSwarm(canvas, latest.current.options, latest.current.initialPosition, report, abort.signal);
      })
      .then((controller) => {
        if (!controller) return;
        if (abort.signal.aborted) controller.dispose();
        else {
          controllerRef.current = controller;
          if (pendingPointer) controller.setPointer(pendingPointer);
          controller.update(latest.current.options, latest.current.initialPosition);
        }
        window.removeEventListener("pointermove", rememberPointer);
      })
      .catch((error: unknown) => {
        window.removeEventListener("pointermove", rememberPointer);
        if (error instanceof Error && error.name === "AbortError") return;
        report(error instanceof Error ? error : new Error(String(error)));
      });

    return () => {
      abort.abort();
      window.removeEventListener("pointermove", rememberPointer);
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, [active]);

  if (!active) return null;
  return createPortal(
    <canvas
      ref={canvasRef}
      data-bee-swarm=""
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 40 }}
    />,
    document.body,
  );
}
