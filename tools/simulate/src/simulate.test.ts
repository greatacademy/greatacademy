import { compileMath } from "@ga/content-math";
import { describe, expect, it } from "vitest";

import { simulate } from "./simulate.ts";

const subject = compileMath();
const runs = (ability: number, xpPerDay: number) =>
  Array.from({ length: 10 }, (_, i) => simulate(subject, "algebra-foundations", { ability, xpPerDay }, i + 1));
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

describe("simulated students", () => {
  it("are deterministic for a seed", () => {
    expect(simulate(subject, "algebra-foundations", { ability: 0.85, xpPerDay: 30 }, 7)).toEqual(
      simulate(subject, "algebra-foundations", { ability: 0.85, xpPerDay: 30 }, 7),
    );
  });

  it("finish the course with about one explicit review per topic or fewer", () => {
    const typical = runs(0.85, 30);
    expect(typical.every((r) => r.finished)).toBe(true);
    expect(mean(typical.map((r) => r.reviewsPerTopic))).toBeLessThanOrEqual(1);
  });

  it("let struggling students finish, with more practice", () => {
    const struggling = runs(0.7, 20);
    expect(struggling.every((r) => r.finished)).toBe(true);
    expect(mean(struggling.map((r) => r.reviewsPerTopic))).toBeGreaterThan(mean(runs(0.85, 30).map((r) => r.reviewsPerTopic)));
  });

  it("let struggling students finish a broad course, without being held in reviews", () => {
    const prealgebra = Array.from({ length: 10 }, (_, i) => simulate(subject, "prealgebra", { ability: 0.7, xpPerDay: 20 }, i + 1));
    expect(prealgebra.every((r) => r.finished)).toBe(true);
    expect(Math.max(...prealgebra.map((r) => r.days))).toBeLessThan(180);
  });

  it("skip what the diagnostic finds the student knows", () => {
    const knows = ["integers-and-opposites", "absolute-value", "adding-integers", "subtracting-integers"];
    const placed = mean(
      Array.from({ length: 10 }, (_, i) => simulate(subject, "algebra-foundations", { ability: 0.85, xpPerDay: 30, knows }, i + 1).lessons),
    );
    expect(placed).toBeLessThan(mean(runs(0.85, 30).map((r) => r.lessons)));
  });
});
