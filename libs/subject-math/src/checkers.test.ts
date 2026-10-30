import { CheckerRegistry } from "@ga/content";
import { describe, expect, it } from "vitest";

import { mathCheckers } from "./checkers.ts";

const registry = new CheckerRegistry(mathCheckers);
const verdict = (checker: string, expected: Record<string, string | boolean>, response: string) =>
  registry.check(checker, expected, response);
const accepts = (checker: string, expected: Record<string, string | boolean>, response: string) =>
  verdict(checker, expected, response).correct;

describe("number", () => {
  it.each([
    ["-7", "-7"],
    ["-7", "−7"],
    ["-7", "(-7)"],
    ["-7", "\\left(-7\\right)"],
    ["3/4", "\\frac{3}{4}"],
    ["3/4", "3/4"],
    ["3/4", "0.75"],
    ["-3/4", "-\\frac{3}{4}"],
    ["-3/4", "\\frac{-3}{4}"],
    ["7/3", "2\\frac{1}{3}"],
    ["-7/3", "-2\\frac{1}{3}"],
    ["1000", "1{,}000"],
    ["5/2", "2.50"],
  ])("accepts %s as %s", (value, response) => {
    expect(accepts("number", { value }, response)).toBe(true);
  });

  it.each([
    ["-7", "7", undefined],
    ["-7", "-6", undefined],
    ["-7", "-3-4", "single number"],
    ["3/4", "\\frac{6}{8}", "lowest terms"],
    ["3", "\\frac{3}{1}", "lowest terms"],
    ["7/3", "2\\frac{2}{6}", "lowest terms"],
    ["3", "x", undefined],
    ["3", "3=3", "single number"],
    ["3", "\\placeholder{}", "could not be read"],
    ["3", "", "could not be read"],
    ["3", "3+", "could not be read"],
  ])("rejects %s as %s", (value, response, message) => {
    const v = verdict("number", { value }, response);
    expect(v.correct).toBe(false);
    if (message) expect(v.feedback?.en).toContain(message);
    else expect(v.feedback).toBeUndefined();
  });

  it("enforces forms", () => {
    expect(verdict("number", { value: "4", form: "integer" }, "\\frac{8}{2}").feedback?.en).toContain("integer");
    expect(verdict("number", { value: "4", form: "integer" }, "4.0").feedback?.en).toContain("integer");
    expect(verdict("number", { value: "1/2", form: "fraction" }, "0.5").feedback?.en).toContain("fraction");
    expect(verdict("number", { value: "1/2", form: "decimal" }, "\\frac{1}{2}").feedback?.en).toContain("decimal");
    expect(accepts("number", { value: "1/2", form: "decimal" }, ".5")).toBe(true);
    expect(verdict("number", { value: "7/3", form: "mixed" }, "\\frac{7}{3}").feedback?.en).toContain("mixed");
    expect(verdict("number", { value: "5/2", form: "mixed" }, "2.5").feedback?.en).toContain("mixed");
    expect(accepts("number", { value: "7/3", form: "mixed" }, "2\\frac{1}{3}")).toBe(true);
    expect(accepts("number", { value: "-2/3", form: "mixed" }, "-\\frac{2}{3}")).toBe(true);
    expect(accepts("number", { value: "3", form: "mixed" }, "3")).toBe(true);
  });

  it("ignores a typed percent sign when the field has one", () => {
    expect(accepts("number", { value: "25", percent: true }, "25\\%")).toBe(true);
    expect(accepts("number", { value: "25", percent: true }, "25%")).toBe(true);
    expect(accepts("number", { value: "25", percent: true }, "25")).toBe(true);
    expect(accepts("number", { value: "25" }, "25\\%")).toBe(false);
  });

  it("accepts the variable when asked to solve", () => {
    expect(accepts("number", { value: "3", var: "x" }, "x=3")).toBe(true);
    expect(accepts("number", { value: "3", var: "x" }, "3=x")).toBe(true);
    expect(accepts("number", { value: "3", var: "x" }, "y=3")).toBe(false);
    expect(accepts("number", { value: "3" }, "x=3")).toBe(false);
  });
});

describe("expression", () => {
  it.each([
    ["3x-5", "-5+3x"],
    ["3x-5", "3\\cdot x-5"],
    ["x^2+2x+1", "\\left(x+1\\right)^2"],
    ["\\frac{x}{2}", "0.5x"],
    ["\\frac{x+1}{x}", "1+\\frac{1}{x}"],
    ["2xy", "2yx"],
  ])("accepts %s as %s", (expr, response) => {
    expect(accepts("expression", { expr }, response)).toBe(true);
  });

  it.each([
    ["3x-5", "3x+5"],
    ["3x-5", "y=3x-5"],
    ["\\frac{x+1}{x}", "1+x"],
    ["x^2", "2x"],
  ])("rejects %s as %s", (expr, response) => {
    expect(accepts("expression", { expr }, response)).toBe(false);
  });

  it.each(["7x-3", "-3+7x", "-x+4", "x^{2}-x", "\\frac{3}{4}x-1", "\\frac{x}{2}+1", "-\\frac{2x}{3}", "3xy-y", "0"])(
    "accepts the simplified form %s",
    (response) => {
      const v = verdict("expression", { expr: response, form: "simplified" }, response);
      expect(v).toEqual({ correct: true });
    },
  );

  it.each([
    ["7x-3", "2x+5x-3"],
    ["7x-3", "7x+-3"],
    ["7x-3", "7x-3+0"],
    ["7x-3", "(7x-3)"],
    ["2x+2", "2(x+1)"],
    ["x-3", "1x-3"],
    ["x^{2}", "xx"],
    ["x^{2}", "x\\cdot x"],
    ["\\frac{x}{2}", "\\frac{2x}{4}"],
    ["2x", "x2"],
  ])("rejects %s written as %s when simplification is required", (expr, response) => {
    const v = verdict("expression", { expr, form: "simplified" }, response);
    expect(v.correct).toBe(false);
    expect(v.feedback?.en).toContain("Simplify");
  });
});

describe("factorization", () => {
  it.each(["2^{3}\\cdot 3", "3\\cdot 2^3", "2\\cdot 2\\cdot 2\\cdot 3", "2\\times 2^{2}\\times 3", "(2^3)(3)"])(
    "accepts %s as 24",
    (response) => {
      expect(accepts("factorization", { value: "24" }, response)).toBe(true);
    },
  );
  it("accepts a prime as its own factorization", () => {
    expect(accepts("factorization", { value: "13" }, "13")).toBe(true);
  });
  it.each([
    ["24", "Write the number"],
    ["4\\cdot 6", "Write the number"],
    ["8\\cdot 3", "Write the number"],
    ["2^{2}\\cdot 3", undefined],
    ["2^{3}+3", undefined],
  ])("rejects %s for 24", (response, message) => {
    const v = verdict("factorization", { value: "24" }, response);
    expect(v.correct).toBe(false);
    if (message) expect(v.feedback?.en).toContain(message);
    else expect(v.feedback).toBeUndefined();
  });
});

describe("inequality", () => {
  const lt = { var: "x", op: "<", value: "2" };
  it.each(["x<2", "2>x", "x\\lt 2", "\\left(x\\right)<2"])("accepts %s", (response) => {
    expect(accepts("inequality", lt, response)).toBe(true);
  });
  it.each(["x>2", "x\\le 2", "x<3", "2<x", "x=2", "2", "y<2"])("rejects %s", (response) => {
    expect(accepts("inequality", lt, response)).toBe(false);
  });
  it("accepts non-strict inequalities", () => {
    expect(accepts("inequality", { var: "x", op: ">=", value: "-3/2" }, "x\\ge -\\frac{3}{2}")).toBe(true);
    expect(accepts("inequality", { var: "x", op: ">=", value: "-3/2" }, "x≥-1.5")).toBe(true);
    expect(accepts("inequality", { var: "x", op: ">=", value: "-3/2" }, "-\\frac{3}{2}\\le x")).toBe(true);
  });
});
