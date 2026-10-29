import { describe, expect, it } from "vitest";

import { Q, q } from "./rational.ts";

describe("Q", () => {
  it("normalizes", () => {
    expect(q(6, -8).toString()).toBe("-3/4");
    expect(q(0, -5).toString()).toBe("0");
    expect(Q.parse("-2.25").toString()).toBe("-9/4");
    expect(Q.parse("3/12").toString()).toBe("1/4");
    expect(Q.parse(".5").toString()).toBe("1/2");
  });
  it("rejects malformed input", () => {
    for (const s of ["", "-", "1/0", "a", "1.", "1//2"]) expect(() => Q.parse(s)).toThrow();
  });
  it("computes exactly", () => {
    expect(q(1, 3).add(q(1, 6)).toString()).toBe("1/2");
    expect(q(2, 3).pow(-2).toString()).toBe("9/4");
    expect(q(-1, 2).cmp(q(-1, 3))).toBe(-1);
    expect(q(-3, 4).toLatex()).toBe("-\\frac{3}{4}");
  });
});
