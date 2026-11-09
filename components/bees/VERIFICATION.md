# Bee verification

Verified on November 9, 2026, against the production build served with
`bun run start --port 3002`.

## Automated checks

- `bun test components/bees`: 49 passing tests, 1,337 assertions.
- `bun run lint`, `bunx tsc --noEmit`, `bun run build`: passed.
- `git diff --check`: passed.
- Independent source review found no blocking correctness defects.

## Production baseline before explicit direction balancing

Apple M5, arm64 macOS, Paseo 0.15.3 / Chromium 152, ANGLE Metal renderer.
Viewport: 1280 × 800 CSS pixels. Display DPR: 2; canvas DPR capped at 1.5.
Each sample followed warmup and recorded 300 rendered frames over 2.5 seconds.

| Bees | Draw calls/frame | Mean CPU/frame | 95th percentile CPU/frame | Median render interval |
| --- | --- | --- | --- | --- |
| 4 | 12 | 0.125 ms | 0.200 ms | 8.3 ms |
| 20 | 60 | 0.252 ms | 0.400 ms | 8.3 ms |

All twenty bees were rendered in the measured centered sphere. Each bee uses
three shared meshes. Large spheres and viewport-edge positions can still trigger
normal frustum culling.

CPU measurements wrap animation callbacks that issue WebGL draw calls. They
include motion, scene updates, and render submission, with browser timer
resolution and instrumentation overhead. They do not measure GPU completion or
prove the same performance on other devices. The observed rendering cadence was
approximately 120 Hz on this display.

The lazy renderer/model/Three.js chunk measured 554,351 bytes decoded and
137,285 bytes encoded (about 134 KiB compressed) in this build. The atlas is
970 bytes. Framework, portfolio, and playground UI scripts are additional.
Eligibility is checked before the renderer import.

The static model uses 48 triangles, three shared geometries, and one atlas.
Changing positive counts did not allocate new shared buffers, textures, or
programs. Crossing zero removed the canvas, deleted its 12 geometry buffers,
atlas texture, and shader program, and released the renderer's context.
Repeated 0/1/5/20 count transitions retained this allocation pattern. No React
root commits were observed across 120 sampled animation frames with idle controls.

## Browser checks

- Default four-bee swarm: smaller, visibly varied sizes wandering in a sphere;
  the Random sizes checkbox switches to uniform `maxSize` without recreating the
  canvas. The JSX example includes the selected boolean.
- Regression tests require at least 8 world units between the full 3D wing
  bounding spheres through two minutes of idle and rapid cursor pursuit for
  4, 5, and 20 bees, including large uniform sizes. Models remain apart; projected
  front/back overlap is natural depth occlusion.
- Explicit per-bee handedness now balances clockwise and anticlockwise flight.
  An independent projected-motion check found two of each throughout the first
  five seconds at a centered cursor, with mixed directions in every sampled frame
  over thirty seconds. Near the introduction, mixed directions appeared in 100%
  of the early samples and 99.2% afterward.
- A thirty-second default simulation ranged from z = -75.5 to +83.4, compared
  with the former 24-unit depth span. Distances from the cursor center ranged
  from 35.9 to 101.2 within a 102.9-unit flight sphere. Physical wing clearance
  stayed at least 8.25 units in the independent check.
- Each bee reversed direction on X, Y, and Z. Individual sampled trajectories
  were noncoplanar, rather than circles tilted into different planes.
- Paused count/size changes reflow the volume without advancing its clock;
  resizing updates projection while paused. A 60-degree base perspective makes
  depth visible, and the camera keeps the sphere in front of its near plane.
- Front, side, and overhead model views: atlas alignment, face, antennae,
  stripes, legs, stinger, and wing cutouts verified against the pinned source.
- Light/dark backgrounds, cursor pursuit, banking, viewport edges, scrolling,
  live configuration, and resizing down to 390 × 844 checked. The canvas stayed
  fixed to the viewport without adding horizontal overflow.
- Pause produced zero continuous draw calls; resume restarted rendering.
- Leaving `/` for `/about` removed the swarm and pause control. Returning
  recreated one canvas. The playground remained unlisted and non-indexed.
- Reduced-motion and touch-only media-query simulations removed the canvas;
  restoring eligibility recreated it.
- Simulated WebGL2 absence, HTTP 503 texture failure, and explicit context loss
  produced visible errors. Context loss stopped rendering. Playground Reset and
  count 0 → 5 recovered after a texture failure was removed.
- Navigating away during a delayed texture request produced no canvas leak or
  unhandled rejection. Development Strict Mode mounting also rendered one canvas.
- Control labels, keyboard focus, slider updates, and JSX output checked.

## Remaining coverage and existing warnings

The available browser surface forces document visibility, so actual hidden-tab
transitions remain a manual browser check. Clock suspension is unit-tested and
the visibility lifecycle was source-reviewed. Safari, Firefox, physical touch
devices, hardware-triggered context loss, and successful clipboard writing still
need checks on their respective environments.

Existing site warnings observed during development included the theme toggle's
dark-theme title hydration mismatch and image preload warnings. Local Vercel
Analytics loading also reported a warning. These belong to existing portfolio
behavior and were not changed as part of the bee feature.
