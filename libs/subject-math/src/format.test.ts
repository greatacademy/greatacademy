import { describe, expect, it } from "vitest";

import { dec, linear, num, paren, poly, radical, sci } from "./format.ts";
import { factorizationLatex, gcd, isPrime, isSquareFree, lcm, primeFactors, simplifyRadical } from "./numbers.ts";
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

describe("radicals and scientific notation", () => {
  it("simplifies square roots", () => {
    expect(simplifyRadical(72)).toEqual([6, 2]);
    expect(simplifyRadical(1)).toEqual([1, 1]);
    expect(simplifyRadical(49)).toEqual([7, 1]);
    expect(isSquareFree(30)).toBe(true);
    expect(isSquareFree(12)).toBe(false);
  });
  it("writes radicals and scientific notation", () => {
    expect(radical(6, 2)).toBe("6\\sqrt{2}");
    expect(radical(-1, 5)).toBe("-\\sqrt{5}");
    expect(radical(q(1, 3), 6)).toBe("\\frac{\\sqrt{6}}{3}");
    expect(radical(q(-2, 3), 3)).toBe("-\\frac{2\\sqrt{3}}{3}");
    expect(radical(4, 1)).toBe("4");
    expect(sci(q(9, 2), 4)).toBe("4.5 \\times 10^{4}");
  });
});
