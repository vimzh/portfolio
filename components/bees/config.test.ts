import { describe, expect, test } from "bun:test";

import {
  DEFAULT_BEE_OPTIONS,
  resolveBeeOptions,
  validateBeePosition,
  type BeeOptions,
} from "./config";

describe("bee configuration", () => {
  test("resolves the documented defaults without changing the supplied options", () => {
    expect(resolveBeeOptions({})).toEqual({
      count: 4,
      minSize: 14,
      maxSize: 28,
      randomizeSize: true,
      orbitRadius: 96,
      orbitSpeed: 0.6,
      followSpeed: 3,
      paused: false,
    });
    const supplied = { count: 1, minSize: 18, paused: true };
    expect(resolveBeeOptions(supplied)).toEqual({ ...DEFAULT_BEE_OPTIONS, ...supplied });
    expect(supplied).toEqual({ count: 1, minSize: 18, paused: true });
  });

  test("explicit undefined optional props behave like omitted React props", () => {
    expect(resolveBeeOptions({ count: undefined, minSize: undefined, paused: undefined, randomizeSize: undefined }))
      .toEqual(DEFAULT_BEE_OPTIONS);
  });

  test.each([0, 1, 4, 5, 20])("accepts the supported count %s", (count) => {
    expect(resolveBeeOptions({ count }).count).toBe(count);
  });

  test.each([-1, 21, 0.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid count %s with an actionable field name",
    (count) => {
      expect(() => resolveBeeOptions({ count })).toThrow(/count/);
    },
  );

  test.each(["minSize", "maxSize", "orbitRadius", "orbitSpeed", "followSpeed"] as const)(
    "rejects non-finite %s",
    (key) => {
      for (const value of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
        expect(() => resolveBeeOptions({ [key]: value })).toThrow(new RegExp(key));
      }
    },
  );

  test.each([
    { minSize: 0 },
    { minSize: -1 },
    { maxSize: -1 },
    { minSize: 41, maxSize: 40 },
  ])("rejects invalid or reversed size bounds: %j", (options) => {
    expect(() => resolveBeeOptions(options)).toThrow(/minSize.*maxSize/);
  });

  test("allows one consistent size and a stationary orbit", () => {
    const options = resolveBeeOptions({ minSize: 32, maxSize: 32, orbitRadius: 0, orbitSpeed: 0 });
    expect(options.minSize).toBe(options.maxSize);
    expect(options.orbitRadius).toBe(0);
    expect(options.orbitSpeed).toBe(0);
  });

  test.each([
    { orbitRadius: -1 },
    { orbitSpeed: -1 },
    { followSpeed: 0 },
    { followSpeed: -1 },
  ])("rejects invalid motion settings: %j", (options) => {
    expect(() => resolveBeeOptions(options)).toThrow(/orbitRadius.*orbitSpeed.*followSpeed/);
  });

  test("rejects non-boolean paused values from untyped consumers", () => {
    const options = { paused: "false" } as unknown as Partial<BeeOptions>;
    expect(() => resolveBeeOptions(options)).toThrow(/paused.*boolean/);
  });

  test("accepts uniform sizing and rejects a non-boolean randomizeSize", () => {
    expect(resolveBeeOptions({ randomizeSize: false }).randomizeSize).toBe(false);
    const options = { randomizeSize: "false" } as unknown as Partial<BeeOptions>;
    expect(() => resolveBeeOptions(options)).toThrow(/randomizeSize.*boolean/);
  });

  test("accepts an omitted position and finite viewport coordinates", () => {
    expect(() => validateBeePosition()).not.toThrow();
    expect(() => validateBeePosition({ x: 0, y: 0 })).not.toThrow();
    expect(() => validateBeePosition({ x: -20, y: 1920.5 })).not.toThrow();
  });

  test.each([
    { x: Number.NaN, y: 0 },
    { x: 0, y: Number.POSITIVE_INFINITY },
    { x: Number.NEGATIVE_INFINITY, y: 1 },
  ])("rejects non-finite initial coordinates: %j", (position) => {
    expect(() => validateBeePosition(position)).toThrow(/initialPosition.*finite/);
  });
});
