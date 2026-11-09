"use client";

// Live configuration and a copyable usage example for the cursor bee component.
import { useCallback, useEffect, useRef, useState } from "react";

import { TextLink } from "@/components/TextLink";
import { Button } from "@/components/ui/button";
import { beeControls, beesCopy, type BeeControlKey } from "@/content/bees";

import { BeeSwarm } from "./BeeSwarm";
import { DEFAULT_BEE_OPTIONS } from "./config";
import { useBeeEligibility } from "./use-bee-eligibility";

type PlaygroundOptions = Record<BeeControlKey, number> & { randomizeSize: boolean };

function configurationCode(options: PlaygroundOptions) {
  return [
    'import { BeeSwarm } from "@/components/bees/BeeSwarm";',
    "",
    "<BeeSwarm",
    ...beeControls.map(({ key }) => `  ${key}={${options[key]}}`),
    `  randomizeSize={${options.randomizeSize}}`,
    "/>",
  ].join("\n");
}

export function BeePlayground() {
  const eligible = useBeeEligibility();
  const [options, setOptions] = useState<PlaygroundOptions>({
    ...DEFAULT_BEE_OPTIONS,
  });
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [initialPosition, setInitialPosition] = useState<{
    x: number;
    y: number;
  }>();
  const previewRef = useRef<HTMLDivElement>(null);
  const reportError = useCallback((cause: Error) => setError(cause.message), []);
  const code = configurationCode(options);

  useEffect(() => {
    const measure = () => {
      const bounds = previewRef.current?.getBoundingClientRect();
      if (bounds) {
        setInitialPosition({
          x: bounds.left + bounds.width / 2,
          y: bounds.top + bounds.height / 2,
        });
      }
    };
    const frame = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const changeOption = <K extends keyof PlaygroundOptions,>(key: K, value: PlaygroundOptions[K]) => {
    setOptions((current) => ({ ...current, [key]: value }));
    if (key === "count" && value === 0) setError(null);
    setCopyStatus("idle");
  };

  const reset = () => {
    setOptions({ ...DEFAULT_BEE_OPTIONS });
    setPaused(false);
    setError(null);
    setCopyStatus("idle");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  const hint = error
    ? `${beesCopy.unavailable}: ${error} ${beesCopy.retryHint}`
    : !eligible
      ? beesCopy.disabledHint
      : options.count === 0
        ? beesCopy.emptyHint
        : paused
          ? beesCopy.pausedHint
          : beesCopy.previewHint;

  return (
    <>
      <BeeSwarm
        {...options}
        count={error ? 0 : options.count}
        paused={paused}
        initialPosition={initialPosition}
        onError={reportError}
      />
      <div
        ref={previewRef}
        role="region"
        aria-label={beesCopy.previewLabel}
        className="flex min-h-64 items-end justify-center rounded-lg border border-dashed border-border px-6 py-5 sm:min-h-80"
      >
        <p role="status" className="max-w-sm text-center text-sm text-muted-foreground">
          {hint}
        </p>
      </div>

      <section className="flex flex-col gap-6" aria-labelledby="bee-controls-heading">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 id="bee-controls-heading" className="text-base font-medium text-foreground">
              {beesCopy.controlsHeading}
            </h2>
            <p className="text-sm text-muted-foreground">{beesCopy.controlsDescription}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-pressed={paused}
              disabled={!eligible || !!error || options.count === 0}
            >
              {paused ? beesCopy.resume : beesCopy.pause}
            </Button>
            <Button variant="ghost" size="sm" type="button" onClick={reset}>
              {beesCopy.reset}
            </Button>
          </div>
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            id="bee-randomizeSize"
            type="checkbox"
            checked={options.randomizeSize}
            onChange={(event) => changeOption("randomizeSize", event.target.checked)}
            aria-describedby="bee-random-size-hint"
            className="mt-0.5 size-4 accent-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          />
          <span className="space-y-1">
            <span className="block text-foreground">{beesCopy.randomSizeLabel}</span>
            <span id="bee-random-size-hint" className="block text-xs text-muted-foreground">
              {beesCopy.randomSizeHint}
            </span>
          </span>
        </label>
        <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {beeControls.map((control) => {
            const minimum = control.key === "maxSize" ? options.minSize : control.min;
            const maximum = control.key === "minSize" ? options.maxSize : control.max;
            return (
              <div key={control.key} className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <label htmlFor={`bee-${control.key}`} className="text-foreground">
                    {control.label}
                  </label>
                  <output
                    htmlFor={`bee-${control.key}`}
                    className="font-mono text-xs tabular-nums text-muted-foreground"
                  >
                    {options[control.key]}
                    {control.unit && ` ${control.unit}`}
                  </output>
                </div>
                <input
                  id={`bee-${control.key}`}
                  type="range"
                  min={minimum}
                  max={maximum}
                  step={control.step}
                  value={options[control.key]}
                  aria-describedby={control.key === "minSize" || control.key === "maxSize" ? "bee-size-hint" : undefined}
                  onChange={(event) => changeOption(control.key, Number(event.target.value))}
                  className="h-4 w-full cursor-pointer accent-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                />
              </div>
            );
          })}
        </div>
        <p id="bee-size-hint" className="text-xs leading-relaxed text-muted-foreground">
          {beesCopy.sizeHint}
        </p>
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="bee-code-heading">
        <div className="flex items-center justify-between gap-4">
          <h2 id="bee-code-heading" className="text-base font-medium text-foreground">
            {beesCopy.snippetHeading}
          </h2>
          <Button variant="outline" size="sm" type="button" onClick={copy}>
            {copyStatus === "copied" ? beesCopy.copied : beesCopy.copy}
          </Button>
        </div>
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 p-5 font-mono text-xs leading-6 text-foreground">
          <code>{code}</code>
        </pre>
        {copyStatus === "error" && (
          <p role="status" className="text-xs text-muted-foreground">
            {beesCopy.copyError}
          </p>
        )}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {beesCopy.artworkNotice}{" "}
          <TextLink href={beesCopy.sourceHref} className="underline">
            {beesCopy.sourceLabel}
          </TextLink>{" · "}
          <TextLink href={beesCopy.termsHref} className="underline">
            {beesCopy.termsLabel}
          </TextLink>
        </p>
      </section>
    </>
  );
}
