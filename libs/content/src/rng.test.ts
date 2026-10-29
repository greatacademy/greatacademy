import { describe, expect, it } from "vitest";

import { choiceChecker, textChecker } from "./checkers.ts";
import { createRng } from "./rng.ts";

describe("createRng", () => {
  it("is deterministic per seed", () => {
    const a = createRng(42);
    const b = createRng(42);
    const c = createRng(43);
    const xs = Array.from({ length: 10 }, () => a.next());
    expect(Array.from({ length: 10 }, () => b.next())).toEqual(xs);
    expect(Array.from({ length: 10 }, () => c.next())).not.toEqual(xs);
    expect(createRng("seed").int(0, 1000)).toBe(createRng("seed").int(0, 1000));
  });

  it("covers int ranges uniformly", () => {
    const rng = createRng(7);
    const counts = new Map<number, number>();
    for (let i = 0; i < 60_000; i++) {
      const v = rng.int(-2, 3);
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
    expect([...counts.keys()].sort((x, y) => x - y)).toEqual([-2, -1, 0, 1, 2, 3]);
    for (const n of counts.values()) expect(Math.abs(n - 10_000)).toBeLessThan(500);
  });

  it("never returns zero from nonZero", () => {
    const rng = createRng(1);
    for (let i = 0; i < 1000; i++) expect(rng.nonZero(-1, 1)).not.toBe(0);
  });

  it("samples distinct elements", () => {
    const rng = createRng(3);
    const s = rng.sample([1, 2, 3, 4, 5], 3);
    expect(new Set(s).size).toBe(3);
    expect(() => rng.sample([1], 2)).toThrow(RangeError);
  });
});

describe("core checkers", () => {
  it("checks choices by index", () => {
    expect(choiceChecker.check(2, "2").correct).toBe(true);
    expect(choiceChecker.check(2, "1").correct).toBe(false);
  });

  it("checks text ignoring case and spacing", () => {
    expect(textChecker.check(["Hello  World"], " hello world ").correct).toBe(true);
    expect(textChecker.check(["yes"], "no").correct).toBe(false);
  });
});
