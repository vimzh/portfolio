import { describe, expect, test } from "bun:test";

import { resolveBeeOptions, type BeePosition } from "./config";
import {
  advanceBeeSwarm, createBeeMotion, createSwarmMotion, getBeeSize,
  getFlightRadius, getSwarmCameraDistance, MAX_FLIGHT_ACCELERATION,
  MAX_FLIGHT_SPEED, MAX_FRAME_DELTA, positionBeeSwarm, type BeeMotion,
} from "./simulation";

const origin = { x: 640, y: 400 };

function createSwarm(options = resolveBeeOptions({}), target = origin) {
  const swarm = createSwarmMotion(target);
  const bees = Array.from({ length: options.count }, (_, index) => createBeeMotion(index));
  positionBeeSwarm(swarm, bees, options);
  return { swarm, bees };
}

function minimumClearance(bees: BeeMotion[]) {
  let minimum = Infinity;
  for (let i = 0; i < bees.length; i++) {
    for (let j = i + 1; j < bees.length; j++) {
      minimum = Math.min(minimum, Math.hypot(bees[i].x - bees[j].x,
        bees[i].y - bees[j].y, bees[i].z - bees[j].z) - bees[i].radius - bees[j].radius);
    }
  }
  return minimum;
}

function numericStateIsFinite(bee: BeeMotion) {
  return Object.values(bee).every((value) => typeof value !== "number" || Number.isFinite(value));
}

describe("bee flight simulation", () => {
  test("small swarms have deterministic, visibly different sizes", () => {
    const options = resolveBeeOptions({ count: 4 });
    const first = createSwarm(options);
    expect(first).toEqual(createSwarm(options));
    const sizes = first.bees.map((bee) => getBeeSize(bee, options));
    expect(new Set(sizes).size).toBe(4);
    expect(Math.min(...sizes)).toBeLessThan(18);
    expect(Math.max(...sizes)).toBeGreaterThan(25);
    for (const size of sizes) {
      expect(size).toBeGreaterThanOrEqual(options.minSize);
      expect(size).toBeLessThanOrEqual(options.maxSize);
    }
  });

  test("disabling random sizes uses maxSize and preserves the random samples", () => {
    const options = resolveBeeOptions({ count: 20 });
    const { bees } = createSwarm(options);
    const sizes = bees.map((bee) => getBeeSize(bee, options));
    expect(bees.map((bee) => getBeeSize(bee, { ...options, randomizeSize: false })))
      .toEqual(Array(20).fill(options.maxSize));
    expect(bees.map((bee) => getBeeSize(bee, options))).toEqual(sizes);
  });

  test("default bees visibly travel in opposite winding directions from startup", () => {
    const options = resolveBeeOptions({});
    const { swarm, bees } = createSwarm(options);
    const matching = [0, 0, 0, 0];
    let mixedFrames = 0;
    for (let frame = 0; frame < 300; frame++) {
      advanceBeeSwarm(swarm, bees, 1 / 60, origin, options);
      let clockwise = false, anticlockwise = false;
      for (const bee of bees) {
        const winding = bee.ox * bee.vy - bee.oy * bee.vx;
        const expected = bee.index % 2 === 0 ? 1 : -1;
        if (winding * expected > 1) matching[bee.index]++;
        clockwise ||= winding > 1;
        anticlockwise ||= winding < -1;
      }
      if (clockwise && anticlockwise) mixedFrames++;
    }
    for (const frames of matching) expect(frames).toBeGreaterThan(240);
    expect(mixedFrames).toBeGreaterThan(270);
  });

  test("bees independently change direction throughout a volume rather than winding together", () => {
    const options = resolveBeeOptions({});
    const { swarm, bees } = createSwarm(options);
    const signs = bees.map(() => Array.from({ length: 3 }, () => new Set<number>()));
    let minDepth = Infinity, maxDepth = -Infinity, minRadius = Infinity, maxRadius = 0, mixedFrames = 0;
    for (let frame = 0; frame < 1800; frame++) {
      advanceBeeSwarm(swarm, bees, 1 / 60, origin, options);
      let clockwise = false, counterclockwise = false;
      for (const bee of bees) {
        minDepth = Math.min(minDepth, bee.z); maxDepth = Math.max(maxDepth, bee.z);
        const radius = Math.hypot(bee.ox, bee.oy, bee.oz);
        minRadius = Math.min(minRadius, radius); maxRadius = Math.max(maxRadius, radius);
        const winding = bee.ox * bee.vy - bee.oy * bee.vx;
        clockwise ||= winding > 1; counterclockwise ||= winding < -1;
        for (const [axis, velocity] of [bee.vx, bee.vy, bee.vz].entries()) {
          if (Math.abs(velocity) > 2) signs[bee.index][axis].add(Math.sign(velocity));
        }
      }
      if (clockwise && counterclockwise) mixedFrames++;
    }
    expect(maxDepth - minDepth).toBeGreaterThan(options.orbitRadius * 0.9);
    expect(maxRadius - minRadius).toBeGreaterThan(options.orbitRadius * 0.4);
    expect(mixedFrames).toBeGreaterThan(180);
    for (const axes of signs) for (const axis of axes) expect(axis.size).toBe(2);
  });

  test("individual trajectories leave a plane instead of following tilted circles", () => {
    const options = resolveBeeOptions({});
    const { swarm, bees } = createSwarm(options);
    const samples: number[][][] = bees.map(() => []);
    for (let frame = 0; frame <= 900; frame++) {
      if (frame % 300 === 0) {
        for (const bee of bees) samples[bee.index].push([bee.ox, bee.oy, bee.oz]);
      }
      advanceBeeSwarm(swarm, bees, 1 / 60, origin, options);
    }
    for (const points of samples) {
      const [origin, a, b, c] = points;
      const u = a.map((value, axis) => value - origin[axis]);
      const v = b.map((value, axis) => value - origin[axis]);
      const w = c.map((value, axis) => value - origin[axis]);
      const volume = Math.abs(u[0] * (v[1] * w[2] - v[2] * w[1])
        + u[1] * (v[2] * w[0] - v[0] * w[2]) + u[2] * (v[0] * w[1] - v[1] * w[0]));
      expect(volume / swarm.radius ** 3).toBeGreaterThan(0.005);
    }
  });

  test.each([4, 5, 20])("%s bees stay inside the sphere without intersecting their wings", (count) => {
    const options = resolveBeeOptions({ count });
    const { swarm, bees } = createSwarm(options);
    let clearance = minimumClearance(bees), extent = 0;
    for (let frame = 0; frame < 7200; frame++) {
      const target = frame < 3600 ? origin : frame % 120 < 60 ? { x: 1280, y: 0 } : { x: 0, y: 800 };
      advanceBeeSwarm(swarm, bees, 1 / 60, target, options);
      clearance = Math.min(clearance, minimumClearance(bees));
      for (const bee of bees) extent = Math.max(extent, Math.hypot(bee.ox, bee.oy, bee.oz));
    }
    expect(clearance).toBeGreaterThanOrEqual(8);
    expect(extent).toBeLessThanOrEqual(getFlightRadius(options) + 1e-8);
    expect(bees.every(numericStateIsFinite)).toBe(true);
  });

  test("large uniform swarms remain separated through fast cursor changes", () => {
    const options = resolveBeeOptions({ count: 20, maxSize: 80, randomizeSize: false, orbitRadius: 0 });
    const { swarm, bees } = createSwarm(options);
    let clearance = minimumClearance(bees);
    for (let frame = 0; frame < 3600; frame++) {
      advanceBeeSwarm(swarm, bees, 1 / 60, frame % 120 < 60 ? { x: 844, y: 0 } : { x: 0, y: 390 }, options);
      clearance = Math.min(clearance, minimumClearance(bees));
    }
    expect(clearance).toBeGreaterThanOrEqual(8);
  });

  test("camera retains visible perspective and keeps the sphere in front of its near plane", () => {
    const options = resolveBeeOptions({});
    expect(getSwarmCameraDistance(800, options)).toBeCloseTo(800 / (2 * Math.tan(Math.PI / 6)), 8);
    for (const height of [300, 390, 800]) {
      for (const count of [1, 4, 20]) {
        const dense = resolveBeeOptions({ count, maxSize: 80 });
        expect(getSwarmCameraDistance(height, dense))
          .toBeGreaterThan(getFlightRadius(dense) + dense.maxSize * 1.3);
      }
    }
  });

  test("paused count and size changes reflow in 3D without advancing time", () => {
    const options = resolveBeeOptions({ count: 4 });
    const { swarm, bees } = createSwarm(options);
    for (let frame = 0; frame < 120; frame++) advanceBeeSwarm(swarm, bees, 1 / 60, origin, options);
    const time = swarm.time;
    for (const count of [0, 1, 5, 20, 4]) {
      const next = resolveBeeOptions({ count, maxSize: 80, orbitRadius: 0, randomizeSize: false, paused: true });
      while (bees.length > count) bees.pop();
      while (bees.length < count) bees.push(createBeeMotion(bees.length));
      positionBeeSwarm(swarm, bees, next);
      expect(minimumClearance(bees)).toBeGreaterThanOrEqual(8);
      expect(bees.every((bee) => getBeeSize(bee, next) === 80)).toBe(true);
      expect(swarm.time).toBe(time);
    }
  });

  test("converges consistently at 30, 60, and 120 frames per second", () => {
    const options = resolveBeeOptions({});
    const finalStates = [30, 60, 120].map((rate) => {
      const result = createSwarm(options);
      for (let frame = 0; frame < rate * 6; frame++) {
        advanceBeeSwarm(result.swarm, result.bees, 1 / rate, { x: 1100, y: 160 }, options);
      }
      return result;
    });
    for (const result of finalStates.slice(0, 2)) {
      for (let index = 0; index < options.count; index++) {
        const a = result.bees[index], b = finalStates[2].bees[index];
        expect(Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z)).toBeLessThan(0.01);
      }
    }
  });

  test("bounds pursuit speed and acceleration after abrupt target changes", () => {
    const options = resolveBeeOptions({});
    const { swarm, bees } = createSwarm(options);
    for (let frame = 0; frame < 600; frame++) {
      const previous = { ...swarm };
      const target = frame % 120 < 60 ? { x: -10000, y: 10000 } : { x: 10000, y: -10000 };
      advanceBeeSwarm(swarm, bees, 1 / 60, target, options);
      expect(Math.hypot(swarm.vx, swarm.vy)).toBeLessThanOrEqual(MAX_FLIGHT_SPEED);
      expect(Math.hypot(swarm.vx - previous.vx, swarm.vy - previous.vy))
        .toBeLessThanOrEqual(MAX_FLIGHT_ACCELERATION / 60);
    }
  });

  test("pausing and zero-duration frames preserve positions and the flight clock", () => {
    const options = resolveBeeOptions({});
    const { swarm, bees } = createSwarm(options);
    advanceBeeSwarm(swarm, bees, 1 / 60, { x: 0, y: 0 }, options);
    const before = structuredClone({ swarm, bees });
    advanceBeeSwarm(swarm, bees, 60, origin, { ...options, paused: true });
    advanceBeeSwarm(swarm, bees, 0, origin, options);
    expect({ swarm, bees }).toEqual(before);
  });

  test("zero orbit speed freezes local wandering while pursuit and wings can continue", () => {
    const options = resolveBeeOptions({ orbitSpeed: 0 });
    const { swarm, bees } = createSwarm(options);
    const offsets = bees.map((bee) => [bee.ox, bee.oy, bee.oz]);
    for (let frame = 0; frame < 120; frame++) advanceBeeSwarm(swarm, bees, 1 / 60, { x: 0, y: 0 }, options);
    expect(bees.map((bee) => [bee.ox, bee.oy, bee.oz])).toEqual(offsets);
    expect(swarm.x).toBeLessThan(origin.x);
  });

  test("a suspended frame advances only the bounded duration", () => {
    const options = resolveBeeOptions({});
    const delayed = createSwarm(options), bounded = createSwarm(options);
    advanceBeeSwarm(delayed.swarm, delayed.bees, 60, { x: 1500, y: 800 }, options);
    advanceBeeSwarm(bounded.swarm, bounded.bees, MAX_FRAME_DELTA, { x: 1500, y: 800 }, options);
    expect(delayed).toEqual(bounded);
  });

  test("follow response changes pursuit speed and remains stable at extreme values", () => {
    const target: BeePosition = { x: 740, y: 400 };
    const slowOptions = resolveBeeOptions({ followSpeed: 1 }), slow = createSwarm(slowOptions);
    const fastOptions = resolveBeeOptions({ followSpeed: 6 }), fast = createSwarm(fastOptions);
    for (let frame = 0; frame < 30; frame++) {
      advanceBeeSwarm(slow.swarm, slow.bees, 1 / 60, target, slowOptions);
      advanceBeeSwarm(fast.swarm, fast.bees, 1 / 60, target, fastOptions);
    }
    expect(Math.abs(fast.swarm.x - target.x)).toBeLessThan(Math.abs(slow.swarm.x - target.x));
    const extreme = resolveBeeOptions({ count: 20, followSpeed: 100000 });
    const responsive = createSwarm(extreme);
    for (let frame = 0; frame < 3600; frame++) {
      advanceBeeSwarm(responsive.swarm, responsive.bees, 1 / 60, { x: Math.sin(frame / 100) * 600, y: 800 }, extreme);
    }
    expect(Object.values(responsive.swarm).every(Number.isFinite)).toBe(true);
    expect(responsive.bees.every(numericStateIsFinite)).toBe(true);
  });
});
