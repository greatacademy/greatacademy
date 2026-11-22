import { Q, surdLatex } from "@ga/subject-math";
import { describe, expect, it } from "vitest";

import {
  binomialSquare,
  chain,
  evalAt,
  flip,
  front,
  holds,
  isSquare,
  lf,
  listed,
  listRealSolutions,
  mono,
  pw,
  quad,
  range,
  signed,
  solvePrompt,
  sqrtSurd,
  stepLabel,
  tail,
  toggleEnds,
  toQ,
  valueRows,
  valueTable,
} from "./solution-kit.ts";

describe("numbers and sets", () => {
  it("toQ keeps a rational and converts an integer", () => {
    const half = Q.of(1, 2);
    expect(toQ(half)).toBe(half);
    expect(toQ(-3).eq(Q.of(-3))).toBe(true);
  });

  it("range lists integers, steps and nothing for an empty range", () => {
    expect(range(-2, 2)).toEqual([-2, -1, 0, 1, 2]);
    expect(range(0, 10, 5)).toEqual([0, 5, 10]);
    expect(range(3, 3)).toEqual([3]);
    expect(range(3, 2)).toEqual([]);
  });

  it("flip exchanges the sides of each inequality", () => {
    expect(flip["<"]).toBe(">");
    expect(flip[">="]).toBe("<=");
  });

  it("holds compares numbers and fractions", () => {
    expect(holds(-1, "<", 0)).toBe(true);
    expect(holds(2, "<=", 2)).toBe(true);
    expect(holds(2, "<", 2)).toBe(false);
    expect(holds(Q.of(1, 3), ">", Q.of(1, 4))).toBe(true);
    expect(holds(Q.of(-1, 2), ">=", 0)).toBe(false);
  });

  it("toggleEnds swaps closed and open finite endpoints", () => {
    const set = toggleEnds([{ lo: Q.of(-1), loClosed: true, hi: Q.of(2), hiClosed: false }]);
    expect(set).toEqual([{ lo: Q.of(-1), loClosed: false, hi: Q.of(2), hiClosed: true }]);
    expect(toggleEnds([{ loClosed: false, hi: Q.of(0), hiClosed: true }])).toEqual([{ loClosed: false, hi: Q.of(0), hiClosed: false }]);
  });

  it("isSquare accepts perfect squares only", () => {
    expect([0, 1, 4, 49].every(isSquare)).toBe(true);
    expect([-4, 2, 50].some(isSquare)).toBe(false);
  });

  it("sqrtSurd simplifies roots of integers and fractions", () => {
    expect(surdLatex(sqrtSurd(Q.zero))).toBe("0");
    expect(surdLatex(sqrtSurd(Q.of(1)))).toBe("1");
    expect(surdLatex(sqrtSurd(Q.of(12)))).toBe("2\\sqrt{3}");
    expect(surdLatex(sqrtSurd(Q.of(9, 4)))).toBe("\\frac{3}{2}");
  });
});

describe("terms", () => {
  it("pw leaves out the exponents 0 and 1", () => {
    expect(pw("x", 0)).toBe("");
    expect(pw("x", 1)).toBe("x");
    expect(pw("y", 3)).toBe("y^{3}");
    expect(pw("x", -2)).toBe("x^{-2}");
  });

  it("mono writes coefficients 1, -1, 0 and fractions", () => {
    expect(mono(3, 2, 1)).toBe("3x^{2}y");
    expect(mono(1, 1)).toBe("x");
    expect(mono(-1, 0, 2)).toBe("-y^{2}");
    expect(mono(7)).toBe("7");
    expect(mono(0, 3)).toBe("0");
    expect(mono(Q.of(-1, 2), 1)).toBe("-\\frac{1}{2}x");
  });

  it("front writes a factor before parentheses", () => {
    expect(front(1)).toBe("");
    expect(front(-1)).toBe("-");
    expect(front(3)).toBe("3");
    expect(front(-4)).toBe("-4");
    expect(front(Q.of(1, 2))).toBe("\\frac{1}{2}");
    expect(front(-2, 2)).toBe("-2x^{2}");
    expect(front(1, 0, 1)).toBe("y");
  });

  it("tail writes an added constant, or nothing for 0", () => {
    expect(tail(0)).toBe("");
    expect(tail(1)).toBe(" + 1");
    expect(tail(-1)).toBe(" - 1");
    expect(tail(Q.of(-1, 2))).toBe(" - \\frac{1}{2}");
  });

  it("signed turns the sign of a term into the operator", () => {
    expect(signed(5)).toBe("+ 5");
    expect(signed(-3)).toBe("- 3");
    expect(signed(0)).toBe("+ 0");
    expect(signed("-3x")).toBe("- 3x");
    expect(signed("x^{2}")).toBe("+ x^{2}");
  });

  it("quad and lf drop zero and unit coefficients", () => {
    expect(quad(1, -1, 0)).toBe("x^{2} - x");
    expect(quad(-1, 0, 5, "t")).toBe("-t^{2} + 5");
    expect(quad(Q.of(1, 2), 3, -2)).toBe("\\frac{1}{2}x^{2} + 3x - 2");
    expect(lf(1, -3)).toBe("(x - 3)");
    expect(lf(-2, 0, "y")).toBe("(-2y)");
  });

  it("binomialSquare writes (v + p)², with tall parentheses for fractions", () => {
    expect(binomialSquare(0)).toBe("x^{2}");
    expect(binomialSquare(1)).toBe("(x + 1)^{2}");
    expect(binomialSquare(-1, "t")).toBe("(t - 1)^{2}");
    expect(binomialSquare(Q.of(-3, 2))).toBe("\\left(x - \\frac{3}{2}\\right)^{2}");
  });

  it("evalAt writes m · x + b with unit slopes and a zero intercept", () => {
    expect(evalAt(2, -3, 1)).toBe("2 \\cdot (-3) + 1");
    expect(evalAt(1, 4, -5)).toBe("4 - 5");
    expect(evalAt(-1, -2, 0)).toBe("-(-2)");
    expect(evalAt(Q.of(1, 2), 4, Q.of(-1, 3))).toBe("\\frac{1}{2} \\cdot 4 - \\frac{1}{3}");
  });

  it("chain leaves out a stage that repeats the one before", () => {
    expect(chain("2 + 3", "5", "5")).toBe("2 + 3 = 5");
    expect(chain("a", "b", "a")).toBe("a = b = a");
    expect(chain("7")).toBe("7");
  });
});

describe("tables and words", () => {
  it("valueTable and valueRows write integers, negatives and fractions", () => {
    expect(valueTable("f", [0, 1], [Q.of(-1), Q.of(1, 2)])).toBe(
      "$$\\begin{array}{c|cc} x & 0 & 1 \\\\ \\hline f(x) & -1 & \\frac{1}{2} \\end{array}$$",
    );
    expect(
      valueRows(
        [-1, 0],
        [
          ["f(x)", [2, 3]],
          ["g(x)", [-4, 0.5]],
        ],
      ),
    ).toBe("$$\\begin{array}{c|cc} x & -1 & 0 \\\\ \\hline f(x) & 2 & 3 \\\\ g(x) & -4 & 0.5 \\end{array}$$");
  });

  it("stepLabel numbers steps in each locale", () => {
    expect(stepLabel(2, "Factor", "分解")).toEqual({ en: "**Step 2: Factor.**", "zh-CN": "**第二步：分解。**" });
  });

  it("listed joins one, two or more items", () => {
    expect(listed(["a"]).en).toBe("a");
    expect(listed(["a", "b"]).en).toBe("a and b");
    expect(listed(["a", "b", "c"])).toEqual({ en: "a, b and c", "zh-CN": "a、b、c" });
  });

  it("solvePrompt asks for real solutions unless told otherwise", () => {
    expect(solvePrompt("x^{2} = 4").en).toBe(`Solve $x^{2} = 4$. ${listRealSolutions.en}`);
    const how = { en: "Enter x.", "zh-CN": "写出 x。" };
    expect(solvePrompt("x = 1", how)).toEqual({ en: "Solve $x = 1$. Enter x.", "zh-CN": "解方程 $x = 1$。写出 x。" });
  });
});
