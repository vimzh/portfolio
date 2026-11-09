# Cursor bees

A viewport overlay of Minecraft bees for React. The renderer loads only on devices
with a fine, hovering pointer and without a reduced-motion preference. The canvas
is decorative, hidden from assistive technology, and does not intercept pointer
events.

```tsx
"use client";

import { useState } from "react";
import { BeeSwarm } from "@/components/bees/BeeSwarm";

export function CursorBees() {
  const [paused, setPaused] = useState(false);

  return (
    <>
      <BeeSwarm count={4} minSize={14} maxSize={28} randomizeSize paused={paused} />
      <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>
        {paused ? "Resume bees" : "Pause bees"}
      </button>
    </>
  );
}
```

## Configuration

All props are optional. Explicit `undefined` uses the corresponding default.

| Prop | Default | Meaning |
| --- | --- | --- |
| `count` | `4` | Integer from 0 through 20. Zero removes the canvas and disposes its resources. |
| `minSize` | `14` | Minimum body length in CSS pixels at the central depth. |
| `maxSize` | `28` | Maximum body length at the central depth. Must be at least `minSize`. |
| `randomizeSize` | `true` | Give each bee a stable random size within the range. When false, every bee uses `maxSize`. |
| `orbitRadius` | `96` | Nominal radius of the flight sphere in CSS pixels at the central depth. The sphere expands when the bee count and size need more room. |
| `orbitSpeed` | `0.6` | Nominal local flight rate per second, varied independently per bee. Zero stops local wandering. |
| `followSpeed` | `3` | Positive pursuit response per second. Higher values follow faster. |
| `paused` | `false` | Freezes the current scene and stops its animation loop. |
| `initialPosition` | Viewport center | `{ x, y }` in viewport CSS pixels. Ignored after the first mouse movement. |
| `onError` | Console reporting | Optional callback receiving renderer, asset-loading, or context-loss errors. |

Numeric settings must be finite. Sizes must be positive and ordered. Invalid props
throw actionable errors during rendering; they are not silently clamped or
replaced. Flight speed and acceleration are bounded independently of the pursuit
response.

Bees wander independently through a sphere around a smoothed cursor target, with
alternating clockwise/anticlockwise travel, different speeds, and varying distances
from its center. They move vertically,
horizontally, and toward or away from the viewer. Local separation includes the
extended wings to keep nearby models apart. Bees can pass in front of or behind
one another; projected overlap at different depths is natural occlusion. Large
swarms can extend beyond the viewport edges.

The canvas is fixed to the viewport and portaled to `document.body` at z-index 40.
Controls that should remain above it can use z-index 50. Changes to count, sizes,
and motion settings update the current renderer; crossing zero count releases or
recreates it. Position and motion updates do not trigger React renders.

## Lifecycle and errors

Touch-only devices and reduced-motion users receive no canvas or Three.js import.
Changing these preferences updates eligibility. Pausing or hiding the tab stops
continuous rendering; resuming resets the frame clock instead of simulating the
time spent suspended. Unmounting releases events and GPU resources, including
when navigation interrupts initialization.

WebGL 2 is required. Initialization and runtime errors are reported to the console
and to `onError` when supplied. Hosts should display the error if they provide a
status control. The component does not replace failed artwork with placeholder
geometry or claim an unavailable effect succeeded.

The homepage mounts `HomeBeeSwarm` only on `/`, measures `#home-intro` for its
initial anchor, and provides a pause control. `/playground/bees` is an unlisted,
non-indexed configuration page with the same component and a copyable JSX example.

## Assets and extraction

Copy the core files from this component directory and `public/bees/` when
extracting the component. `HomeBeeSwarm` and `BeePlayground` are portfolio demo
hosts; omit them or also copy their `content/bees.ts` dependency.
Install matching `three` and `@types/three` dependencies. Keep the atlas available
at `/bees/bee.png` and preserve the upstream source and terms in
[`public/bees/LICENSE.md`](../../public/bees/LICENSE.md).

Minecraft artwork remains subject to Mojang's terms. The renderer implementation
does not confer commercial redistribution rights to the model or texture.
See the [Minecraft usage guidelines](https://www.minecraft.net/en-us/usage-guidelines).
This component is not an official Minecraft product and is not approved by or
associated with Mojang or Microsoft.

## Verification

```sh
bun test components/bees
bun run lint
bunx tsc --noEmit
bun run build
```

The unit tests cover configuration validation, deterministic variation,
frame-rate independence, bounded movement, long-running stability, pause, and
suspension behavior. Browser verification must additionally cover artwork,
pointer interaction, configuration changes, route cleanup, eligibility, context
loss, and production rendering performance. Record the measured device and
browser when reporting frame timings or draw calls.

See [verification results](VERIFICATION.md) for measured production performance,
browser coverage, and remaining manual checks.
