import { describe, expect, it } from "vitest";

import { linear, num, paren, poly } from "./format.ts";
import { q } from "./rational.ts";

describe("format", () => {
  it("writes terms without unit coefficients or doubled signs", () => {
    expect(poly([3, "x"], [-1, "y"], [-5, ""])).toBe("3x - y - 5");
    expect(poly([-1, "x"], [0, "y"], [1, ""])).toBe("-x + 1");
    expect(poly([0, "x"])).toBe("0");
    expect(linear(q(-3, 4), 2)).toBe("-\\frac{3}{4}x + 2");
    expect(num(-5)).toBe("-5");
    expect(paren(-5)).toBe("(-5)");
    expect(paren(5)).toBe("5");
  });
});
