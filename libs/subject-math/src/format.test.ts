import { describe, expect, it } from "vitest";

import { dec, linear, num, paren, poly } from "./format.ts";
import { factorizationLatex, gcd, isPrime, lcm, primeFactors } from "./numbers.ts";
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

  it("writes terminating decimals", () => {
    expect(dec(q(3, 4))).toBe("0.75");
    expect(dec(q(-5, 2))).toBe("-2.5");
    expect(dec(q(1, 40))).toBe("0.025");
    expect(dec(12)).toBe("12");
    expect(() => dec(q(1, 3))).toThrow(RangeError);
  });
});

describe("numbers", () => {
  it("factors and finds common divisors and multiples", () => {
    expect([1, 2, 9, 17, 91, 97].map(isPrime)).toEqual([false, true, false, true, false, true]);
    expect(primeFactors(360)).toEqual([
      [2, 3],
      [3, 2],
      [5, 1],
    ]);
    expect(factorizationLatex(primeFactors(24))).toBe("2^{3} \\cdot 3");
    expect(gcd(-12, 18)).toBe(6);
    expect(lcm(4, 6)).toBe(12);
  });
});
