import { describe, expect, it } from "vitest";

import { agreement, cohensKappa, parseScoredSet } from "./agreement.ts";

const T = true;
const F = false;

describe("cohensKappa", () => {
  it("measures agreement beyond chance", () => {
    expect(cohensKappa([T, T, F, F], [T, F, F, F])).toBeCloseTo(0.5);
    expect(cohensKappa([T, F, T, F], [T, F, T, F])).toBe(1);
    expect(cohensKappa([T, F], [F, T])).toBeCloseTo(-1);
  });

  it("is 1 for raters who always say the same and 0 when chance alone explains them", () => {
    expect(cohensKappa([T, T, T], [T, T, T])).toBe(1);
    expect(cohensKappa([T, T], [F, F])).toBe(0);
  });
});

describe("agreement", () => {
  const ids = ["a", "b", "c", "d"];
  const people: [boolean, boolean][] = [
    [T, T],
    [T, F],
    [F, F],
    [F, F],
  ];

  it("passes a route as close to people as they are to each other, once there are enough texts", () => {
    const r = agreement(ids, people, [T, T, F, F], 4);
    expect(r.humanKappa).toBeCloseTo(0.5);
    expect(r.kappa).toBeCloseTo(0.75);
    expect(r.passed).toBe(true);
    expect(agreement(ids, people, [T, T, F, F]).passed).toBe(false);
  });

  it("counts a text the route could not judge against it and lists where it differs from both people", () => {
    const r = agreement(ids, people, [undefined, T, T, F], 4);
    expect(r.disagreements).toEqual(["a", "c"]);
    expect(r.passed).toBe(false);
  });
});

describe("parseScoredSet", () => {
  const line = (x: object) => JSON.stringify({ id: "t1", task: { prompt: "P", modelAnswer: "M" }, text: "A text.", ...x });

  it("reads one text per line", () => {
    const set = parseScoredSet(`${line({ scores: { "c@1": [T, F] } })}\n\n`);
    expect(set).toEqual([{ id: "t1", task: { prompt: "P", modelAnswer: "M" }, text: "A text.", scores: { "c@1": [T, F] } }]);
  });

  it("names the first bad line", () => {
    expect(() => parseScoredSet("{")).toThrow("line 1: not JSON");
    expect(() => parseScoredSet(line({ scores: { "c@1": [T] } }))).toThrow("line 1: scores of c@1 are not two booleans");
    const ok = line({ scores: {} });
    expect(() => parseScoredSet(`${ok}\n${ok}`)).toThrow("line 2: id t1 repeats");
  });
});
