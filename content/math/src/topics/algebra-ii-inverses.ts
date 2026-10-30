import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, linear, num, type PlaneMark, type PlaneView, type Point, plane, poly, Q } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, pointProblem, solutionsProblem, steps } from "../problems.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** range lists the integers from lo to hi. */
const range = (lo: number, hi: number) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

/** plus writes a constant added to what comes before: " + 3", " - 3", or "" for 0. */
function plus(c: Coefficient): string {
  const v = toQ(c);
  if (v.isZero()) return "";
  return v.sign() < 0 ? ` - ${v.neg().toLatex()}` : ` + ${v.toLatex()}`;
}

/** front writes a coefficient in front of a factor: "", "-", "2", "\frac{1}{2}". */
function front(a: Coefficient): string {
  const v = toQ(a);
  if (v.eq(Q.one)) return "";
  if (v.eq(Q.of(-1))) return "-";
  return v.toLatex();
}

/** shifted writes v - h: "x - 3", "x + 2", "x". */
const shifted = (h: Coefficient, v = "x") => linear(1, toQ(h).neg(), v);

/** flipped writes h - v: "3 - x", "-2 - x", "-x". */
const flipped = (h: Coefficient, v = "x") => poly([h, ""], [-1, v]);

/** sqForm writes a(v - h)^2 + k. */
const sqForm = (a: Coefficient, h: Coefficient, k: Coefficient, v = "x") =>
  `${front(a)}${toQ(h).isZero() ? `${v}^{2}` : `(${shifted(h, v)})^{2}`}${plus(k)}`;

/** pt writes an ordered pair: "(3, -\frac{1}{2})". */
const pt = (x: Coefficient, y: Coefficient) => `(${num(x)}, ${num(y)})`;

/** withPrefix shows a prefix such as "f^{-1}(x) =" before the answer field. */
function withPrefix(p: Problem, prefix: string): Problem {
  return { ...p, answer: { ...p.answer, input: { kind: "math", prefix } } };
}

/** distinctFrom draws an integer in [lo, hi] other than avoid. */
function distinctFrom(rng: Rng, lo: number, hi: number, avoid: number): number {
  const y = rng.int(lo, hi - 1);
  return y >= avoid ? y + 1 : y;
}

/** valueTable writes a table of values as display math. */
function valueTable(name: string, xs: readonly Coefficient[], ys: readonly Coefficient[]): string {
  return `$$\\begin{array}{c|${"c".repeat(xs.length)}} x & ${xs.map(num).join(" & ")} \\\\ \\hline ${name}(x) & ${ys.map(num).join(" & ")} \\end{array}$$`;
}

/** Poly is a polynomial in x as coefficients from the constant term up. */
type Poly = readonly number[];

/** polyLatex writes a polynomial from its highest power down: "2x^{2} - x + 3". */
function polyLatex(p: Poly, variable = "x"): string {
  const terms: [number, string][] = [];
  for (let i = p.length - 1; i >= 0; i--) terms.push([p[i]!, i === 0 ? "" : i === 1 ? variable : `${variable}^{${i}}`]);
  return poly(...terms);
}

const evalPoly = (p: Poly, x: number) => p.reduce((acc, c, i) => acc + c * x ** i, 0);

/** paren writes a number in parentheses when it is negative, for substituting it. */
const sub = (x: number) => (x < 0 ? `(${x})` : String(x));

// Graphs.

const view: PlaneView = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

const pointText = ([x, y]: Point) => `(${x}, ${y})`;

/** polylineMarks draws line segments through the points. */
function polylineMarks(pts: readonly Point[], accent = true): PlaneMark[] {
  const marks: PlaneMark[] = [];
  for (let i = 0; i + 1 < pts.length; i++) marks.push({ kind: "segment", a: pts[i]!, b: pts[i + 1]!, accent });
  return marks;
}

/** segmentsFigure draws a graph made of line segments with a filled dot at each end. */
function segmentsFigure(pts: readonly Point[]): Figure {
  return {
    svg: plane(view, [
      ...polylineMarks(pts),
      { kind: "point", at: pts[0]!, accent: true },
      { kind: "point", at: pts[pts.length - 1]!, accent: true },
    ]),
    alt: t(
      `The graph of f: line segments through ${pts.map(pointText).join(", ")}, with a filled dot at each end.`,
      `f 的图象：依次经过 ${pts.map(pointText).join("、")} 的折线，两端为实心点。`,
    ),
  };
}

/** valueOn is the y-value of a graph made of segments at x, if x is in its domain. */
function valueOn(pts: readonly Point[], x: number): Q | undefined {
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[i + 1]!;
    if (x >= x0 && x <= x1) return Q.of(y0).add(Q.of((y1 - y0) * (x - x0), x1 - x0));
  }
  return undefined;
}

const graphShown = t("The graph of $f$ is shown.", "下图是 $f$ 的图象。");

// Topic: calculating the inverse of a function.

/** calculatingTheInverseOfAFunction finds formulas for the inverses of cubic, rational and square-root functions. */
export const calculatingTheInverseOfAFunction: TopicDef = {
  id: "calculating-the-inverse-of-a-function",
  title: t("Calculating the Inverse of a Function", "求函数的反函数"),
  summary: t(
    "Find the formula of an inverse function by swapping x and y and solving for y: cubic, rational and square-root functions.",
    "交换 x 与 y 再解出 y，求反函数的解析式：三次函数、分式函数与根式函数。",
  ),
  prerequisites: ["domain-and-range-of-inverse-functions", "solving-odd-power-equations", "rational-equations-with-one-fractional-term"],
  encompasses: [
    { topic: "introduction-to-inverse-functions", weight: 0.5 },
    { topic: "solving-odd-power-equations", weight: 0.3 },
    { topic: "rational-equations-with-one-fractional-term", weight: 0.3 },
    { topic: "domain-and-range-of-inverse-functions", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSF.BF.B.4.A"],
  knowledgePoints: [
    {
      id: "inverses-of-cubic-functions",
      title: t("Inverses of cubic functions", "三次函数的反函数"),
      explanation: t(
        "To find the inverse of any invertible function $f$:\n\n1. write $y = f(x)$;\n2. **swap** $x$ and $y$;\n3. solve the new equation for $y$. The result is $f^{-1}(x)$.\n\nFor $f(x) = 2(x - 1)^{3} + 5$: swap to get $x = 2(y - 1)^{3} + 5$. Then\n\n$$(y - 1)^{3} = \\frac{x - 5}{2}, \\quad y - 1 = \\sqrt[3]{\\frac{x - 5}{2}}, \\quad f^{-1}(x) = \\sqrt[3]{\\frac{x - 5}{2}} + 1.$$\n\nUndo the steps of $f$ in reverse order: the cube was done first, so the cube root is taken last but one.",
        "求任意可逆函数 $f$ 的反函数：\n\n1. 写出 $y = f(x)$；\n2. **交换** $x$ 与 $y$；\n3. 从新方程中解出 $y$，结果就是 $f^{-1}(x)$。\n\n对于 $f(x) = 2(x - 1)^{3} + 5$：交换得 $x = 2(y - 1)^{3} + 5$。于是\n\n$$(y - 1)^{3} = \\frac{x - 5}{2}, \\quad y - 1 = \\sqrt[3]{\\frac{x - 5}{2}}, \\quad f^{-1}(x) = \\sqrt[3]{\\frac{x - 5}{2}} + 1.$$\n\n按相反的顺序撤销 $f$ 的各步：立方是最先做的，所以开立方在倒数第二步。",
      ),
      keyPrerequisites: ["solving-odd-power-equations"],
      generate(rng) {
        const a = rng.pick([1, 1, -1, 2, -2, 3, 4, -4, 5]);
        const h = rng.int(-6, 6);
        const k = rng.nonZero(-9, 9);
        const inner = a === 1 ? shifted(k) : a === -1 ? flipped(k) : a > 0 ? `\\frac{${shifted(k)}}{${a}}` : `\\frac{${flipped(k)}}{${-a}}`;
        const answer = `\\sqrt[3]{${inner}}${plus(h)}`;
        const f = `${front(a)}${h === 0 ? "x^{3}" : `(${shifted(h)})^{3}`}${plus(k)}`;
        const cube = h === 0 ? "y^{3}" : `(${shifted(h, "y")})^{3}`;
        const root = h === 0 ? "y" : shifted(h, "y");
        return withPrefix(
          expressionProblem({
            prompt: t(`Find the inverse of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的反函数。`),
            answer,
            wrong: [
              `\\sqrt[3]{\\frac{${linear(1, k)}}{${a}}}${plus(-h)}`,
              `\\sqrt[3]{\\frac{${shifted(k)}}{${a}}}${plus(-h)}`,
              `\\frac{\\sqrt[3]{${shifted(k)}}}{${a}}${plus(h)}`,
              `\\sqrt[3]{${a}(${shifted(k)})}${plus(h)}`,
              `\\sqrt[3]{\\frac{x}{${a}}}${plus(h - k)}`,
            ],
            solution: t(
              `Swap $x$ and $y$ and solve for $y$:${steps(`x = ${front(a)}${cube}${plus(k)}`, `${cube} = ${inner.replaceAll("x", "x")}`, `${root} = \\sqrt[3]{${inner}}`)}So $f^{-1}(x) = ${answer}$.`,
              `交换 $x$ 与 $y$，再解出 $y$：${steps(`x = ${front(a)}${cube}${plus(k)}`, `${cube} = ${inner}`, `${root} = \\sqrt[3]{${inner}}`)}所以 $f^{-1}(x) = ${answer}$。`,
            ),
          }),
          "f^{-1}(x) =",
        );
      },
    },
    {
      id: "inverses-of-reciprocal-functions",
      title: t("Inverses of reciprocal functions", "倒数型函数的反函数"),
      explanation: t(
        "For $f(x) = \\frac{3}{x - 2} + 4$, swap $x$ and $y$: $x = \\frac{3}{y - 2} + 4$. Isolate the fraction, then take reciprocals of both sides:\n\n$$x - 4 = \\frac{3}{y - 2}, \\quad y - 2 = \\frac{3}{x - 4}, \\quad f^{-1}(x) = \\frac{3}{x - 4} + 2.$$\n\nThe numbers $2$ and $4$ trade places: $f$ is not defined at $x = 2$ and never takes the value $4$, and its inverse is not defined at $x = 4$ and never takes the value $2$.",
        "对于 $f(x) = \\frac{3}{x - 2} + 4$，交换 $x$ 与 $y$：$x = \\frac{3}{y - 2} + 4$。先把分式单独留在一边，再两边同取倒数：\n\n$$x - 4 = \\frac{3}{y - 2}, \\quad y - 2 = \\frac{3}{x - 4}, \\quad f^{-1}(x) = \\frac{3}{x - 4} + 2.$$\n\n数 $2$ 与 $4$ 互换了位置：$f$ 在 $x = 2$ 处无定义、取不到值 $4$；它的反函数在 $x = 4$ 处无定义、取不到值 $2$。",
      ),
      keyPrerequisites: ["rational-equations-with-one-fractional-term"],
      generate(rng) {
        const m = rng.nonZero(-9, 9);
        const h = rng.int(-7, 7);
        const v = distinctFrom(rng, -7, 7, h);
        const answer = `\\frac{${m}}{${shifted(v)}}${plus(h)}`;
        const f = `\\frac{${m}}{${shifted(h)}}${plus(v)}`;
        return withPrefix(
          expressionProblem({
            prompt: t(`Find the inverse of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的反函数。`),
            answer,
            wrong: [
              f,
              `\\frac{${m}}{${linear(1, v)}}${plus(-h)}`,
              `\\frac{${m}}{${shifted(v)}}${plus(-h)}`,
              `\\frac{${shifted(v)}}{${m}}${plus(h)}`,
              `\\frac{${shifted(h)}}{${m}}${plus(v)}`,
            ],
            solution: t(
              `Swap $x$ and $y$, isolate the fraction and take reciprocals:${steps(`x = \\frac{${m}}{${shifted(h, "y")}}${plus(v)}`, `${shifted(v)} = \\frac{${m}}{${shifted(h, "y")}}`, `${shifted(h, "y")} = \\frac{${m}}{${shifted(v)}}`)}So $f^{-1}(x) = ${answer}$.`,
              `交换 $x$ 与 $y$，把分式单独留在一边，再两边取倒数：${steps(`x = \\frac{${m}}{${shifted(h, "y")}}${plus(v)}`, `${shifted(v)} = \\frac{${m}}{${shifted(h, "y")}}`, `${shifted(h, "y")} = \\frac{${m}}{${shifted(v)}}`)}所以 $f^{-1}(x) = ${answer}$。`,
            ),
          }),
          "f^{-1}(x) =",
        );
      },
    },
    {
      id: "inverses-of-linear-over-linear-functions",
      title: t("Inverses of quotients of linear expressions", "一次式之商的反函数"),
      explanation: t(
        "When $y$ appears in both the numerator and the denominator, clear the fraction, gather the terms with $y$ on one side, and factor $y$ out.\n\nFor $f(x) = \\frac{2x + 1}{x - 3}$, swap: $x = \\frac{2y + 1}{y - 3}$. Then\n\n$$x(y - 3) = 2y + 1, \\quad xy - 2y = 3x + 1, \\quad y(x - 2) = 3x + 1, \\quad f^{-1}(x) = \\frac{3x + 1}{x - 2}.$$",
        "当 $y$ 同时出现在分子和分母中时，先去分母，把含 $y$ 的项移到同一边，再提出 $y$。\n\n对于 $f(x) = \\frac{2x + 1}{x - 3}$，交换得 $x = \\frac{2y + 1}{y - 3}$。于是\n\n$$x(y - 3) = 2y + 1, \\quad xy - 2y = 3x + 1, \\quad y(x - 2) = 3x + 1, \\quad f^{-1}(x) = \\frac{3x + 1}{x - 2}.$$",
      ),
      keyPrerequisites: ["rational-equations-with-one-fractional-term"],
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const c = rng.nonZero(-6, 6);
        let b: number;
        do b = rng.nonZero(-9, 9);
        while (b === a * c);
        const f = `\\frac{${linear(a, b)}}{${linear(1, c)}}`;
        const top = poly([-c, "x"], [b, ""]);
        const answer = `\\frac{${top}}{${linear(1, -a)}}`;
        return withPrefix(
          expressionProblem({
            prompt: t(`Find the inverse of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的反函数。`),
            answer,
            wrong: [
              `\\frac{${linear(1, c)}}{${linear(a, b)}}`,
              `\\frac{${poly([c, "x"], [-b, ""])}}{${linear(1, -a)}}`,
              `\\frac{${top}}{${linear(1, a)}}`,
              `\\frac{${poly([c, "x"], [b, ""])}}{${linear(1, -a)}}`,
              `\\frac{${linear(1, -b)}}{${linear(a, c)}}`,
            ],
            solution: t(
              `Swap $x$ and $y$, multiply by the denominator, and gather the terms with $y$:${steps(
                `x = \\frac{${linear(a, b, "y")}}{${linear(1, c, "y")}}`,
                `x(${linear(1, c, "y")}) = ${linear(a, b, "y")}`,
                `${poly([1, "xy"], [c, "x"])} = ${linear(a, b, "y")}`,
                `${poly([1, "xy"], [-a, "y"])} = ${top}`,
                `y(${linear(1, -a)}) = ${top}`,
              )}So $f^{-1}(x) = ${answer}$.`,
              `交换 $x$ 与 $y$，两边乘以分母，再把含 $y$ 的项移到一边：${steps(
                `x = \\frac{${linear(a, b, "y")}}{${linear(1, c, "y")}}`,
                `x(${linear(1, c, "y")}) = ${linear(a, b, "y")}`,
                `${poly([1, "xy"], [c, "x"])} = ${linear(a, b, "y")}`,
                `${poly([1, "xy"], [-a, "y"])} = ${top}`,
                `y(${linear(1, -a)}) = ${top}`,
              )}所以 $f^{-1}(x) = ${answer}$。`,
            ),
          }),
          "f^{-1}(x) =",
        );
      },
    },
    {
      id: "inverses-of-square-root-functions",
      title: t("Inverses of square-root functions", "根式函数的反函数"),
      explanation: t(
        "Undo a square root by squaring. For $f(x) = 2\\sqrt{x + 1} - 3$, swap: $x = 2\\sqrt{y + 1} - 3$. Then\n\n$$\\frac{x + 3}{2} = \\sqrt{y + 1}, \\quad y + 1 = \\left(\\frac{x + 3}{2}\\right)^{2}, \\quad f^{-1}(x) = \\frac{(x + 3)^{2}}{4} - 1.$$\n\nThe formula is a parabola, but $f^{-1}$ is only its right half: the domain of $f^{-1}$ is the range of $f$, here $x \\ge -3$.",
        "用平方撤销平方根。对于 $f(x) = 2\\sqrt{x + 1} - 3$，交换得 $x = 2\\sqrt{y + 1} - 3$。于是\n\n$$\\frac{x + 3}{2} = \\sqrt{y + 1}, \\quad y + 1 = \\left(\\frac{x + 3}{2}\\right)^{2}, \\quad f^{-1}(x) = \\frac{(x + 3)^{2}}{4} - 1.$$\n\n这个式子是一条抛物线，但 $f^{-1}$ 只是它的右半支：$f^{-1}$ 的定义域是 $f$ 的值域，这里是 $x \\ge -3$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 1, -1, 2, -2, 3]);
        const h = rng.int(-7, 7);
        const k = rng.nonZero(-7, 7);
        const sq = `(${shifted(k)})^{2}`;
        const answer = a * a === 1 ? `${sq}${plus(h)}` : `\\frac{${sq}}{${a * a}}${plus(h)}`;
        const f = `${front(a)}\\sqrt{${shifted(h)}}${plus(k)}`;
        const isolated = a === 1 ? shifted(k) : a === -1 ? flipped(k) : `\\frac{${shifted(k)}}{${a}}`;
        const dom = a > 0 ? `x \\ge ${k}` : `x \\le ${k}`;
        return withPrefix(
          expressionProblem({
            prompt: t(`Find the formula of the inverse of $f(x) = ${f}$.`, `求 $f(x) = ${f}$ 的反函数的解析式。`),
            answer,
            wrong: [
              `(${linear(1, k)})^{2}${plus(h)}`,
              `${sq}${plus(-h)}`,
              `\\frac{${sq}}{${a}}${plus(h)}`,
              `${a}${sq}${plus(h)}`,
              `\\sqrt{${shifted(k)}}${plus(h)}`,
              `(${shifted(h)})^{2}${plus(k)}`,
            ],
            solution: t(
              `Swap $x$ and $y$, isolate the root and square:${steps(`x = ${front(a)}\\sqrt{${shifted(h, "y")}}${plus(k)}`, `${isolated} = \\sqrt{${shifted(h, "y")}}`, `${shifted(h, "y")} = ${a * a === 1 ? sq : `\\frac{${sq}}{${a * a}}`}`)}So $f^{-1}(x) = ${answer}$, with domain $${dom}$ (the range of $f$).`,
              `交换 $x$ 与 $y$，把根式单独留在一边，再两边平方：${steps(`x = ${front(a)}\\sqrt{${shifted(h, "y")}}${plus(k)}`, `${isolated} = \\sqrt{${shifted(h, "y")}}`, `${shifted(h, "y")} = ${a * a === 1 ? sq : `\\frac{${sq}}{${a * a}}`}`)}所以 $f^{-1}(x) = ${answer}$，定义域为 $${dom}$（即 $f$ 的值域）。`,
            ),
          }),
          "f^{-1}(x) =",
        );
      },
    },
  ],
};

// Topic: inverses of quadratic functions.

/** branch writes ±√(inner) + h: the right branch takes the positive root. */
const branch = (right: boolean, inner: string, h: Coefficient) => `${right ? "" : "-"}\\sqrt{${inner}}${plus(h)}`;

const domainText = (right: boolean, h: Coefficient) => `x ${right ? "\\ge" : "\\le"} ${num(h)}`;

/** branchReason explains the choice of sign of the root. */
function branchReason(right: boolean, h: Coefficient): Text {
  const y = `y ${right ? "\\ge" : "\\le"} ${num(h)}`;
  return t(
    `The outputs of $f^{-1}$ are the inputs of $f$, so $${y}$: $${shifted(h, "y")}$ is ${right ? "at least" : "at most"} $0$, and we take the ${right ? "positive" : "negative"} root.`,
    `$f^{-1}$ 的输出就是 $f$ 的输入，所以 $${y}$：$${shifted(h, "y")}$ ${right ? "不小于" : "不大于"} $0$，取${right ? "正" : "负"}的平方根。`,
  );
}

/** inversesOfQuadraticFunctions inverts quadratic functions restricted to one side of the vertex. */
export const inversesOfQuadraticFunctions: TopicDef = {
  id: "inverses-of-quadratic-functions",
  title: t("Inverses of Quadratic Functions", "二次函数的反函数"),
  summary: t(
    "Invert a quadratic function restricted to one side of its vertex, choosing the sign of the square root from the restricted domain.",
    "求限制在顶点一侧的二次函数的反函数，由限制后的定义域确定平方根的符号。",
  ),
  prerequisites: ["calculating-the-inverse-of-a-function", "invertible-functions", "writing-the-equation-of-a-parabola-in-vertex-form"],
  encompasses: [
    { topic: "invertible-functions", weight: 0.5 },
    { topic: "calculating-the-inverse-of-a-function", weight: 0.3 },
    { topic: "solving-equations-with-square-roots", weight: 0.3 },
    { topic: "writing-the-equation-of-a-parabola-in-vertex-form", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.4.D"],
  knowledgePoints: [
    {
      id: "inverses-of-shifted-squares",
      title: t("Inverses of shifted squares", "平移后平方函数的反函数"),
      explanation: t(
        "A quadratic function is invertible only on one side of its vertex. For $f(x) = (x - 3)^{2} + 1$ with $x \\ge 3$, swap: $x = (y - 3)^{2} + 1$, so $(y - 3)^{2} = x - 1$ and\n\n$$y - 3 = \\pm\\sqrt{x - 1}.$$\n\nThe outputs of $f^{-1}$ are the inputs of $f$, so $y \\ge 3$ and $y - 3 \\ge 0$: take the **positive** root, $f^{-1}(x) = \\sqrt{x - 1} + 3$. With the domain $x \\le 3$ instead, $y - 3 \\le 0$ and $f^{-1}(x) = -\\sqrt{x - 1} + 3$.",
        "二次函数只在顶点的一侧可逆。对于 $f(x) = (x - 3)^{2} + 1$（$x \\ge 3$），交换得 $x = (y - 3)^{2} + 1$，所以 $(y - 3)^{2} = x - 1$，\n\n$$y - 3 = \\pm\\sqrt{x - 1}.$$\n\n$f^{-1}$ 的输出就是 $f$ 的输入，所以 $y \\ge 3$，$y - 3 \\ge 0$：取**正**的平方根，$f^{-1}(x) = \\sqrt{x - 1} + 3$。若定义域改为 $x \\le 3$，则 $y - 3 \\le 0$，$f^{-1}(x) = -\\sqrt{x - 1} + 3$。",
      ),
      keyPrerequisites: ["solving-equations-with-square-roots"],
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const k = rng.int(-9, 9);
        const right = rng.bool();
        const answer = branch(right, shifted(k), h);
        const f = sqForm(1, h, k);
        return withPrefix(
          expressionProblem({
            prompt: t(
              `Find the inverse of $f(x) = ${f}$ with domain $${domainText(right, h)}$.`,
              `求 $f(x) = ${f}$（定义域为 $${domainText(right, h)}$）的反函数。`,
            ),
            answer,
            wrong: [
              branch(!right, shifted(k), h),
              branch(right, linear(1, k), h),
              branch(right, shifted(k), -h),
              branch(right, shifted(h), k),
              `(${shifted(k)})^{2}${plus(h)}`,
            ],
            solution: t(
              `Swap $x$ and $y$ and solve:${steps(`x = ${sqForm(1, h, k, "y")}`, `(${shifted(h, "y")})^{2} = ${shifted(k)}`, `${shifted(h, "y")} = \\pm\\sqrt{${shifted(k)}}`)}${branchReason(right, h).en} So $f^{-1}(x) = ${answer}$.`,
              `交换 $x$ 与 $y$ 并求解：${steps(`x = ${sqForm(1, h, k, "y")}`, `(${shifted(h, "y")})^{2} = ${shifted(k)}`, `${shifted(h, "y")} = \\pm\\sqrt{${shifted(k)}}`)}${branchReason(right, h)["zh-CN"]}所以 $f^{-1}(x) = ${answer}$。`,
            ),
          }),
          "f^{-1}(x) =",
        );
      },
    },
    {
      id: "inverses-in-vertex-form",
      title: t("Inverses in vertex form", "顶点式的反函数"),
      explanation: t(
        "With a leading coefficient, divide by it before taking the square root. For $f(x) = -2(x + 1)^{2} + 5$ with $x \\le -1$, swap and solve:\n\n$$x = -2(y + 1)^{2} + 5, \\quad (y + 1)^{2} = \\frac{5 - x}{2}, \\quad y + 1 = \\pm\\sqrt{\\frac{5 - x}{2}}.$$\n\nSince $y \\le -1$, $y + 1 \\le 0$, so $f^{-1}(x) = -\\sqrt{\\frac{5 - x}{2}} - 1$.",
        "有首项系数时，先除以它再开平方。对于 $f(x) = -2(x + 1)^{2} + 5$（$x \\le -1$），交换并求解：\n\n$$x = -2(y + 1)^{2} + 5, \\quad (y + 1)^{2} = \\frac{5 - x}{2}, \\quad y + 1 = \\pm\\sqrt{\\frac{5 - x}{2}}.$$\n\n因为 $y \\le -1$，$y + 1 \\le 0$，所以 $f^{-1}(x) = -\\sqrt{\\frac{5 - x}{2}} - 1$。",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 5, -1, -2, -3]);
        const h = rng.nonZero(-6, 6);
        const k = rng.int(-9, 9);
        const right = rng.bool();
        const inner = a === -1 ? flipped(k) : a > 0 ? `\\frac{${shifted(k)}}{${a}}` : `\\frac{${flipped(k)}}{${-a}}`;
        const answer = branch(right, inner, h);
        const f = sqForm(a, h, k);
        return withPrefix(
          expressionProblem({
            prompt: t(
              `Find the inverse of $f(x) = ${f}$ with domain $${domainText(right, h)}$.`,
              `求 $f(x) = ${f}$（定义域为 $${domainText(right, h)}$）的反函数。`,
            ),
            answer,
            wrong: [
              branch(!right, inner, h),
              branch(right, inner, -h),
              `${right ? "" : "-"}\\sqrt{${a}(${shifted(k)})}${plus(h)}`,
              `${right ? "" : "-"}\\frac{\\sqrt{${shifted(k)}}}{${a}}${plus(h)}`,
              branch(right, `\\frac{x}{${a}}`, h - k),
            ],
            solution: t(
              `Swap $x$ and $y$ and solve:${steps(`x = ${sqForm(a, h, k, "y")}`, `(${shifted(h, "y")})^{2} = ${inner}`, `${shifted(h, "y")} = \\pm\\sqrt{${inner}}`)}${branchReason(right, h).en} So $f^{-1}(x) = ${answer}$.`,
              `交换 $x$ 与 $y$ 并求解：${steps(`x = ${sqForm(a, h, k, "y")}`, `(${shifted(h, "y")})^{2} = ${inner}`, `${shifted(h, "y")} = \\pm\\sqrt{${inner}}`)}${branchReason(right, h)["zh-CN"]}所以 $f^{-1}(x) = ${answer}$。`,
            ),
          }),
          "f^{-1}(x) =",
        );
      },
    },
    {
      id: "inverses-from-standard-form",
      title: t("Inverses from standard form", "由一般式求反函数"),
      explanation: t(
        "If the quadratic is in standard form, complete the square first. For $f(x) = x^{2} - 6x + 4$ with $x \\ge 3$:\n\n$$f(x) = (x - 3)^{2} - 5.$$\n\nNow swap and solve: $(y - 3)^{2} = x + 5$. Since $y \\ge 3$, $f^{-1}(x) = \\sqrt{x + 5} + 3$.",
        "若二次函数是一般式，先配方。对于 $f(x) = x^{2} - 6x + 4$（$x \\ge 3$）：\n\n$$f(x) = (x - 3)^{2} - 5.$$\n\n再交换并求解：$(y - 3)^{2} = x + 5$。因为 $y \\ge 3$，$f^{-1}(x) = \\sqrt{x + 5} + 3$。",
      ),
      keyPrerequisites: ["writing-the-equation-of-a-parabola-in-vertex-form"],
      generate(rng) {
        const m = rng.nonZero(-5, 5);
        const c = rng.int(-9, 9);
        const h = -m;
        const k = c - m * m;
        const right = rng.bool();
        const f = polyLatex([c, 2 * m, 1]);
        const answer = branch(right, shifted(k), h);
        return withPrefix(
          expressionProblem({
            prompt: t(
              `Find the inverse of $f(x) = ${f}$ with domain $${domainText(right, h)}$.`,
              `求 $f(x) = ${f}$（定义域为 $${domainText(right, h)}$）的反函数。`,
            ),
            answer,
            wrong: [
              branch(!right, shifted(k), h),
              branch(right, shifted(c), h),
              branch(right, shifted(k), -h),
              branch(right, linear(1, k), h),
            ],
            solution: t(
              `Complete the square: $f(x) = ${sqForm(1, h, k)}$. Swap and solve:${steps(`(${shifted(h, "y")})^{2} = ${shifted(k)}`, `${shifted(h, "y")} = \\pm\\sqrt{${shifted(k)}}`)}${branchReason(right, h).en} So $f^{-1}(x) = ${answer}$.`,
              `配方：$f(x) = ${sqForm(1, h, k)}$。交换并求解：${steps(`(${shifted(h, "y")})^{2} = ${shifted(k)}`, `${shifted(h, "y")} = \\pm\\sqrt{${shifted(k)}}`)}${branchReason(right, h)["zh-CN"]}所以 $f^{-1}(x) = ${answer}$。`,
            ),
          }),
          "f^{-1}(x) =",
        );
      },
    },
  ],
};

// Topic: plotting x as a function of y.

/** sidewaysFigure draws the graph of x = a(y - k)^2 + h with its vertex. */
function sidewaysFigure(a: Q, h: number, k: number): Figure {
  const pts: Point[] = range(-80, 80).map((i): Point => {
    const y = k + i / 10;
    return [a.toNumber() * (y - k) ** 2 + h, y];
  });
  return {
    svg: plane(view, [...polylineMarks(pts), { kind: "point", at: [h, k], accent: true }]),
    alt: t(
      `A parabola opening to the ${a.sign() > 0 ? "right" : "left"}, with its vertex marked at (${h}, ${k}) and passing through (${num(a.add(Q.of(h)))}, ${k + 1}) and (${num(a.add(Q.of(h)))}, ${k - 1}).`,
      `一条开口向${a.sign() > 0 ? "右" : "左"}的抛物线，标出了顶点 (${h}, ${k})，并经过 (${num(a.add(Q.of(h)))}, ${k + 1}) 和 (${num(a.add(Q.of(h)))}, ${k - 1})。`,
    ),
  };
}

const sidewaysCoefficients: readonly Q[] = [Q.of(1), Q.of(-1), Q.of(1, 2), Q.of(-1, 2), Q.of(2), Q.of(-2)];

const openOptions: readonly Text[] = [t("Right", "向右"), t("Left", "向左"), t("Up", "向上"), t("Down", "向下")];

/** plottingXAsAFunctionOfY graphs equations that give x in terms of y. */
export const plottingXAsAFunctionOfY: TopicDef = {
  id: "plotting-x-as-a-function-of-y",
  title: t("Plotting X as a Function of Y", "把 x 看作 y 的函数作图"),
  summary: t(
    "Plot equations x = g(y): choose y, compute x, and recognize sideways parabolas opening left or right.",
    "画出 x = g(y) 的图象：先取 y 再算 x，并识别开口向左或向右的抛物线。",
  ),
  prerequisites: ["graphs-of-inverse-functions", "the-vertex-form-of-a-parabola"],
  encompasses: [
    { topic: "the-vertex-form-of-a-parabola", weight: 0.3 },
    { topic: "graphs-of-inverse-functions", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.BF.B.4.C"],
  knowledgePoints: [
    {
      id: "points-on-x-as-a-function-of-y",
      title: t("Points on the graph", "图象上的点"),
      explanation: t(
        "In an equation such as $x = y^{2} - 2y$, $x$ is a **function of $y$**: choose $y$ first, then compute $x$. The graph is still drawn in the usual plane, with $x$ across and $y$ up.\n\nFor $y = 3$: $x = 3^{2} - 2 \\cdot 3 = 3$, so the point $(3, 3)$ is on the graph. For $y = -1$: $x = 1 + 2 = 3$, so $(3, -1)$ is on it too. Write the point as $(x, y)$, not in the order the numbers were found.",
        "在 $x = y^{2} - 2y$ 这样的方程中，$x$ 是 **$y$ 的函数**：先取 $y$，再算 $x$。图象仍画在通常的坐标平面上，$x$ 轴水平，$y$ 轴竖直。\n\n取 $y = 3$：$x = 3^{2} - 2 \\cdot 3 = 3$，所以点 $(3, 3)$ 在图象上。取 $y = -1$：$x = 1 + 2 = 3$，所以 $(3, -1)$ 也在图象上。点要写成 $(x, y)$，而不是按求出数的先后顺序。",
      ),
      generate(rng) {
        const g: number[] = rng.bool(0.3) ? [rng.int(-9, 9), rng.nonZero(-5, 5)] : [rng.int(-9, 9), rng.int(-5, 5), rng.nonZero(-3, 3)];
        const c = rng.nonZero(-4, 4);
        const x = evalPoly(g, c);
        const subst = polyLatex(g, "y").replace(/y/g, `(${c})`);
        return pointProblem({
          prompt: t(
            `Find the point on the graph of $x = ${polyLatex(g, "y")}$ whose $y$-coordinate is $${c}$.`,
            `求 $x = ${polyLatex(g, "y")}$ 的图象上纵坐标为 $${c}$ 的点。`,
          ),
          answer: [x, c],
          wrong: [
            [c, x],
            [evalPoly(g, -c), c],
            [x, -c],
          ],
          solution: t(
            `Substitute $y = ${c}$: $x = ${subst} = ${x}$. The point is $${pt(x, c)}$.`,
            `代入 $y = ${c}$：$x = ${subst} = ${x}$。所求点为 $${pt(x, c)}$。`,
          ),
        });
      },
    },
    {
      id: "sideways-parabolas",
      title: t("Sideways parabolas", "开口向左右的抛物线"),
      explanation: t(
        "The graph of $x = a(y - k)^{2} + h$ is the graph of $y = a(x - h)^{2} + k$ with the roles of $x$ and $y$ swapped: a parabola on its side.\n\n- Its **vertex** is $(h, k)$ (the $x$-coordinate is the number added outside).\n- Its axis of symmetry is the horizontal line $y = k$.\n- It opens to the **right** when $a > 0$ (since $x \\ge h$) and to the **left** when $a < 0$.\n\n$x = -(y + 2)^{2} + 4$ has vertex $(4, -2)$ and opens to the left.",
        "$x = a(y - k)^{2} + h$ 的图象就是把 $y = a(x - h)^{2} + k$ 中 $x$ 与 $y$ 的角色对调：一条横躺的抛物线。\n\n- 它的**顶点**是 $(h, k)$（横坐标是括号外加上的数）。\n- 对称轴是水平直线 $y = k$。\n- $a > 0$ 时开口向**右**（因为 $x \\ge h$），$a < 0$ 时开口向**左**。\n\n$x = -(y + 2)^{2} + 4$ 的顶点为 $(4, -2)$，开口向左。",
      ),
      keyPrerequisites: ["the-vertex-form-of-a-parabola"],
      generate(rng): Problem {
        const a = rng.pick(sidewaysCoefficients);
        const h = rng.nonZero(-9, 9);
        const k = distinctFrom(rng, -9, 9, h);
        const eq = `x = ${sqForm(a, k, h, "y")}`;
        if (rng.bool(0.6))
          return pointProblem({
            prompt: t(`Find the vertex of the graph of $${eq}$.`, `求 $${eq}$ 的图象的顶点。`),
            answer: [h, k],
            wrong: [
              [k, h],
              [h, -k],
              [-h, k],
            ],
            solution: t(
              `In $x = a(y - k)^{2} + h$ the vertex is $(h, k)$: at $y = ${k}$ the square is $0$ and $x = ${h}$. The vertex is $${pt(h, k)}$.`,
              `在 $x = a(y - k)^{2} + h$ 中顶点为 $(h, k)$：当 $y = ${k}$ 时平方为 $0$，$x = ${h}$。顶点为 $${pt(h, k)}$。`,
            ),
          });
        return choiceProblem({
          prompt: t(`In which direction does the graph of $${eq}$ open?`, `$${eq}$ 的图象开口向哪个方向？`),
          options: openOptions,
          correct: a.sign() > 0 ? 0 : 1,
          solution: t(
            `The square is never negative and its coefficient $${num(a)}$ is ${a.sign() > 0 ? "positive" : "negative"}, so $x ${a.sign() > 0 ? "\\ge" : "\\le"} ${h}$: the parabola opens to the ${a.sign() > 0 ? "right" : "left"}.`,
            `平方不会是负数，它的系数 $${num(a)}$ 为${a.sign() > 0 ? "正" : "负"}，所以 $x ${a.sign() > 0 ? "\\ge" : "\\le"} ${h}$：抛物线开口向${a.sign() > 0 ? "右" : "左"}。`,
          ),
        });
      },
    },
    {
      id: "matching-sideways-graphs",
      title: t("Matching graphs and equations", "图象与方程配对"),
      explanation: t(
        "To match a sideways parabola with its equation, read the vertex $(h, k)$ and the direction it opens, then find $a$ from one more point: one unit above or below the vertex, $x = a + h$.\n\nIf the vertex is $(1, 2)$, the graph opens to the left, and it passes through $(-1, 3)$, then $-1 = a + 1$, so $a = -2$ and the equation is $x = -2(y - 2)^{2} + 1$.",
        "要把横躺的抛物线与方程配对，先读出顶点 $(h, k)$ 和开口方向，再用另一个点求 $a$：在顶点上方或下方一个单位处，$x = a + h$。\n\n若顶点为 $(1, 2)$，开口向左，且经过 $(-1, 3)$，则 $-1 = a + 1$，$a = -2$，方程为 $x = -2(y - 2)^{2} + 1$。",
      ),
      generate(rng) {
        const a = rng.pick(sidewaysCoefficients);
        const h = rng.nonZero(-4, 4);
        const kk = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4].filter((v) => v !== h));
        const candidates = [
          `x = ${sqForm(a, kk, h, "y")}`,
          `y = ${sqForm(a, h, kk)}`,
          `x = ${sqForm(a, -kk, h, "y")}`,
          `x = ${sqForm(a.neg(), kk, h, "y")}`,
          `x = ${sqForm(a, h, kk, "y")}`,
        ];
        const order = rng.shuffle([0, ...rng.sample([1, 2, 3, 4], 3)]);
        return {
          ...choiceProblem({
            prompt: t("Which equation has the graph shown?", "哪个方程的图象如下图所示？"),
            options: order.map((i) => t(`$${candidates[i]}$`, `$${candidates[i]}$`)),
            correct: order.indexOf(0),
            solution: t(
              `The vertex is $${pt(h, kk)}$ and the parabola opens to the ${a.sign() > 0 ? "right" : "left"}, so $x$ is a function of $y$ with $h = ${h}$, $k = ${kk}$. One unit above the vertex, $x = ${num(a.add(Q.of(h)))}$, so $a = ${num(a)}$: $${candidates[0]}$.`,
              `顶点为 $${pt(h, kk)}$，抛物线开口向${a.sign() > 0 ? "右" : "左"}，所以 $x$ 是 $y$ 的函数，$h = ${h}$，$k = ${kk}$。在顶点上方一个单位处 $x = ${num(a.add(Q.of(h)))}$，所以 $a = ${num(a)}$：$${candidates[0]}$。`,
            ),
          }),
          figure: sidewaysFigure(a, h, kk),
        };
      },
    },
  ],
};

// Topic: periodic functions.

const mod = (x: number, p: number) => ((x % p) + p) % p;

/** periodicPattern draws the values at 0, 1, …, p - 1 of a pattern whose smallest period is p. */
function periodicPattern(rng: Rng, p: number): number[] {
  for (;;) {
    const ys = range(0, p - 1).map(() => rng.int(-4, 4));
    const proper = range(1, p - 1).filter((d) => p % d === 0);
    if (proper.every((d) => ys.some((y, i) => y !== ys[i % d]))) return ys;
  }
}

/** periodicFigure draws the periodic graph through (x, ys[x mod p]) across the window. */
function periodicFigure(ys: readonly number[]): Figure {
  const p = ys.length;
  const pts = range(-7, 7).map((x): Point => [x, ys[mod(x, p)]!]);
  const shown = range(0, p).map((x) => `(${x}, ${ys[mod(x, p)]})`);
  return {
    svg: plane(view, polylineMarks(pts)),
    alt: t(
      `A zigzag graph that repeats across the whole window, made of line segments through ${shown.join(", ")} and the points that follow the same pattern to the left and right.`,
      `一条在整个窗口中重复的折线图象，经过 ${shown.join("、")}，向左右按同样的规律延续。`,
    ),
  };
}

/** periodicFunctions finds periods and uses them to evaluate functions far from the values given. */
export const periodicFunctions: TopicDef = {
  id: "periodic-functions",
  title: t("Periodic Functions", "周期函数"),
  summary: t(
    "Recognize functions whose values repeat, find their period, and use it to find values far away.",
    "识别函数值循环重复的函数，求它的周期，并用周期求远处的函数值。",
  ),
  prerequisites: ["graphs-of-functions"],
  encompasses: [{ topic: "graphs-of-functions", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.IF.B.4"],
  knowledgePoints: [
    {
      id: "the-period-from-a-graph",
      title: t("The period from a graph", "从图象求周期"),
      explanation: t(
        "A function $f$ is **periodic** with period $p > 0$ if $f(x + p) = f(x)$ for every $x$: the graph repeats itself every $p$ units to the right. The **period** is the smallest such $p$.\n\nTo read it from a graph, pick a recognizable point, such as a peak, and measure the horizontal distance to the next point where the same pattern starts again. If the peaks are at $x = -3, 1, 5$, the period is $4$.",
        "若对每个 $x$ 都有 $f(x + p) = f(x)$（$p > 0$），则函数 $f$ 是**周期函数**：图象每向右 $p$ 个单位就重复一次。最小的这样的 $p$ 叫做**周期**。\n\n从图象读周期：选一个容易辨认的点（如峰顶），量出到同样的图形再次开始处的水平距离。若峰顶在 $x = -3, 1, 5$，则周期为 $4$。",
      ),
      generate(rng) {
        const p = rng.int(2, 6);
        const ys = periodicPattern(rng, p);
        return {
          ...numberProblem({
            prompt: t(
              `${graphShown.en} The pattern continues in both directions forever. Find the period of $f$.`,
              `${graphShown["zh-CN"]}图形向两个方向无限延续。求 $f$ 的周期。`,
            ),
            answer: p,
            wrong: [2 * p, p + 1, p - 1],
            solution: t(
              `The graph repeats every $${p}$ units: for example $f(0) = f(${p}) = ${ys[0]}$, and the whole piece from $x = 0$ to $x = ${p}$ is copied again from $x = ${p}$ to $x = ${2 * p}$. No shorter shift fits, so the period is $${p}$.`,
              `图象每 $${p}$ 个单位重复一次：例如 $f(0) = f(${p}) = ${ys[0]}$，从 $x = 0$ 到 $x = ${p}$ 的整段图形在 $x = ${p}$ 到 $x = ${2 * p}$ 又出现一次。没有更短的平移能重合，所以周期为 $${p}$。`,
            ),
          }),
          figure: periodicFigure(ys),
        };
      },
    },
    {
      id: "values-from-the-period",
      title: t("Values from the period", "用周期求函数值"),
      explanation: t(
        "If $f$ has period $p$, adding or subtracting any multiple of $p$ to the input does not change the output. To find $f$ at a large input, subtract multiples of $p$ until the input lands in the part you know.\n\nIf $f$ has period $5$ and $f(3) = -2$, then $f(38) = f(38 - 7 \\cdot 5) = f(3) = -2$. For a negative input add multiples instead: $f(-7) = f(-7 + 2 \\cdot 5) = f(3) = -2$.",
        "若 $f$ 的周期为 $p$，输入加上或减去 $p$ 的任意倍数，输出不变。求 $f$ 在很大的输入处的值，就减去 $p$ 的倍数，直到输入落入已知的部分。\n\n若 $f$ 的周期为 $5$，$f(3) = -2$，则 $f(38) = f(38 - 7 \\cdot 5) = f(3) = -2$。输入为负数时改为加上倍数：$f(-7) = f(-7 + 2 \\cdot 5) = f(3) = -2$。",
      ),
      generate(rng) {
        const p = rng.int(3, 7);
        const ys = rng.sample(range(-9, 9), p);
        const n = rng.bool(0.7) ? rng.int(p + 1, 80) : -rng.int(1, 40);
        const r = mod(n, p);
        const q = (n - r) / p;
        return numberProblem({
          prompt: t(
            `The function $f$ is periodic with period $${p}$. The table shows one period.${valueTable("f", range(0, p - 1), ys)}Find $f(${n})$.`,
            `函数 $f$ 是周期为 $${p}$ 的周期函数。下表给出一个周期内的值。${valueTable("f", range(0, p - 1), ys)}求 $f(${n})$。`,
          ),
          answer: ys[r]!,
          wrong: [ys[mod(n + 1, p)]!, ys[mod(n - 1, p)]!, ys[mod(-n, p)]!],
          solution: t(
            `$${n} = ${q} \\cdot ${p}${plus(r)}$, so ${q >= 0 ? "subtracting" : "adding"} $${Math.abs(q)}$ periods gives $f(${n}) = f(${r}) = ${ys[r]}$.`,
            `$${n} = ${q} \\cdot ${p}${plus(r)}$，所以${q >= 0 ? "减去" : "加上"} $${Math.abs(q)}$ 个周期得 $f(${n}) = f(${r}) = ${ys[r]}$。`,
          ),
        });
      },
    },
    {
      id: "periodic-values-from-a-graph",
      title: t("Values far along the graph", "图象远处的函数值"),
      explanation: t(
        "When only part of a periodic graph is visible, first read the period, then shift the input back into the window by a multiple of the period.\n\nIf the graph has period $3$ and passes through $(1, 4)$, then $f(31) = f(31 - 10 \\cdot 3) = f(1) = 4$.",
        "当只能看到周期函数图象的一部分时，先读出周期，再把输入平移周期的若干倍，移回窗口中。\n\n若图象的周期为 $3$ 且经过 $(1, 4)$，则 $f(31) = f(31 - 10 \\cdot 3) = f(1) = 4$。",
      ),
      generate(rng) {
        const p = rng.int(2, 6);
        const ys = periodicPattern(rng, p);
        const n = rng.bool(0.75) ? rng.int(10, 60) : -rng.int(10, 40);
        const r = mod(n, p);
        const q = (n - r) / p;
        return {
          ...numberProblem({
            prompt: t(
              `${graphShown.en} The pattern continues in both directions forever. Find $f(${n})$.`,
              `${graphShown["zh-CN"]}图形向两个方向无限延续。求 $f(${n})$。`,
            ),
            answer: ys[r]!,
            wrong: [ys[mod(n + 1, p)]!, ys[mod(n - 1, p)]!, ys[mod(-n, p)]!],
            solution: t(
              `The graph repeats every $${p}$ units. $${n} = ${q} \\cdot ${p}${plus(r)}$, so $f(${n}) = f(${r}) = ${ys[r]}$, read from the graph.`,
              `图象每 $${p}$ 个单位重复一次。$${n} = ${q} \\cdot ${p}${plus(r)}$，所以 $f(${n}) = f(${r}) = ${ys[r]}$，由图象读出。`,
            ),
          }),
          figure: periodicFigure(ys),
        };
      },
    },
  ],
};

// Topic: even and odd functions.

const parityOptions: readonly Text[] = [t("Even", "偶函数"), t("Odd", "奇函数"), t("Neither", "既不是奇函数也不是偶函数")];

/** symmetric tells whether a graph made of segments is even (sign 1) or odd (sign -1) at its vertices and their mirror images. */
function symmetric(pts: readonly Point[], sign: 1 | -1): boolean {
  return pts.every(([x, y]) => {
    const m = valueOn(pts, -x);
    return m?.eq(Q.of(sign * y)) === true;
  });
}

/** monomial writes c·x^d. */
const term = (c: number, d: number): [number, string] => [c, d === 0 ? "" : d === 1 ? "x" : `x^{${d}}`];

/** evenAndOddFunctions recognizes even and odd functions from graphs and formulas, and uses their symmetry. */
export const evenAndOddFunctions: TopicDef = {
  id: "even-and-odd-functions",
  title: t("Even and Odd Functions", "奇函数与偶函数"),
  summary: t(
    "Recognize even functions, symmetric about the y-axis, and odd functions, symmetric about the origin, and use the symmetry to find values.",
    "识别关于 y 轴对称的偶函数和关于原点对称的奇函数，并利用对称性求函数值。",
  ),
  prerequisites: ["graphs-of-functions", "simplifying-polynomials"],
  encompasses: [{ topic: "graphs-of-functions", weight: 0.2 }],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "even-and-odd-from-a-graph",
      title: t("Even and odd graphs", "奇偶函数的图象"),
      explanation: t(
        "A function is **even** if $f(-x) = f(x)$ for every $x$: its graph is symmetric about the $y$-axis, so folding along the $y$-axis matches the two halves. It is **odd** if $f(-x) = -f(x)$: its graph is symmetric about the origin, so a half-turn about $(0, 0)$ matches it with itself.\n\nTest a few points: if $(2, 3)$ is on the graph, an even function also passes through $(-2, 3)$, an odd one through $(-2, -3)$. A graph that fails both is neither. An odd function defined at $0$ passes through the origin, since $f(0) = -f(0)$.",
        "若对每个 $x$ 都有 $f(-x) = f(x)$，则函数是**偶函数**：图象关于 $y$ 轴对称，沿 $y$ 轴对折两半重合。若 $f(-x) = -f(x)$，则是**奇函数**：图象关于原点对称，绕 $(0, 0)$ 旋转半周与自身重合。\n\n检验几个点：若 $(2, 3)$ 在图象上，偶函数还经过 $(-2, 3)$，奇函数还经过 $(-2, -3)$。两者都不满足的图象既不是奇函数也不是偶函数。在 $0$ 处有定义的奇函数经过原点，因为 $f(0) = -f(0)$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let pts: Point[];
        do {
          const xs = [0, ...rng.sample(range(1, 4), rng.int(1, 3)).sort((a, b) => a - b), 5];
          const odd = kind === 1 || (kind === 2 && rng.bool());
          const half = xs.map((x): Point => [x, x === 0 && odd ? 0 : rng.int(-5, 5)]);
          const mirror = half
            .slice(1)
            .reverse()
            .map(([x, y]): Point => [-x, odd ? -y : y]);
          pts = [...mirror, ...half];
          if (kind === 2) {
            const i = rng.int(0, mirror.length - 1);
            const [x, y] = pts[i]!;
            pts[i] = [x, distinctFrom(rng, -5, 5, y)];
          }
        } while ((kind === 2 && (symmetric(pts, 1) || symmetric(pts, -1))) || (kind !== 2 && pts.every(([, y]) => y === 0)));
        const [x0, y0] = pts[pts.length - 2]!;
        const m = valueOn(pts, -x0)!;
        return {
          ...choiceProblem({
            prompt: t(`${graphShown.en} Is $f$ even, odd, or neither?`, `${graphShown["zh-CN"]}$f$ 是偶函数、奇函数，还是都不是？`),
            options: parityOptions,
            correct: kind,
            solution: [
              t(
                `The graph is symmetric about the $y$-axis: for example $f(${x0}) = f(${-x0}) = ${y0}$, and the same holds at every point. So $f$ is even.`,
                `图象关于 $y$ 轴对称：例如 $f(${x0}) = f(${-x0}) = ${y0}$，每一点都如此。所以 $f$ 是偶函数。`,
              ),
              t(
                `The graph is symmetric about the origin: for example $f(${x0}) = ${y0}$ and $f(${-x0}) = ${-y0}$, and the same holds at every point. So $f$ is odd.`,
                `图象关于原点对称：例如 $f(${x0}) = ${y0}$，$f(${-x0}) = ${-y0}$，每一点都如此。所以 $f$ 是奇函数。`,
              ),
              t(
                `The graph is symmetric neither about the $y$-axis nor about the origin: for example $f(${x0}) = ${y0}$ but $f(${-x0}) = ${num(m)}$${m.eq(Q.of(y0)) || m.eq(Q.of(-y0)) ? ", and other pairs of points fail the other test" : ""}. So $f$ is neither even nor odd.`,
                `图象既不关于 $y$ 轴对称，也不关于原点对称：例如 $f(${x0}) = ${y0}$，而 $f(${-x0}) = ${num(m)}$${m.eq(Q.of(y0)) || m.eq(Q.of(-y0)) ? "，另外一些成对的点不满足另一种对称" : ""}。所以 $f$ 既不是偶函数也不是奇函数。`,
              ),
            ][kind]!,
          }),
          figure: segmentsFigure(pts),
        };
      },
    },
    {
      id: "even-and-odd-from-a-formula",
      title: t("Even and odd formulas", "由解析式判断奇偶"),
      explanation: t(
        "To decide from a formula, simplify $f(-x)$ and compare it with $f(x)$. Since $(-x)^{n} = x^{n}$ for even $n$ and $(-x)^{n} = -x^{n}$ for odd $n$, a polynomial is\n\n- even when all its powers are even (a constant counts as $x^{0}$),\n- odd when all its powers are odd,\n- neither when it mixes even and odd powers.\n\nFor $f(x) = 2x^{5} - x^{3} + 4x$: $f(-x) = -2x^{5} + x^{3} - 4x = -f(x)$, so $f$ is odd. Adding $+1$ would make it neither.",
        "由解析式判断时，化简 $f(-x)$ 并与 $f(x)$ 比较。因为 $n$ 为偶数时 $(-x)^{n} = x^{n}$，$n$ 为奇数时 $(-x)^{n} = -x^{n}$，所以多项式\n\n- 所有次数都是偶数时是偶函数（常数项算作 $x^{0}$），\n- 所有次数都是奇数时是奇函数，\n- 奇偶次数混合时两者都不是。\n\n对于 $f(x) = 2x^{5} - x^{3} + 4x$：$f(-x) = -2x^{5} + x^{3} - 4x = -f(x)$，所以 $f$ 是奇函数。若再加上 $+1$，就两者都不是。",
      ),
      keyPrerequisites: ["simplifying-polynomials"],
      generate(rng) {
        const kind = rng.int(0, 2);
        const evens = [0, 2, 4, 6];
        const odds = [1, 3, 5, 7];
        const degrees =
          kind === 0
            ? rng.sample(evens, rng.int(2, 3))
            : kind === 1
              ? rng.sample(odds, rng.int(2, 3))
              : [rng.pick(evens), rng.pick(odds), ...(rng.bool() ? [rng.pick(odds)] : [])].filter((d, i, all) => all.indexOf(d) === i);
        degrees.sort((a, b) => b - a);
        const terms = degrees.map((d) => [rng.nonZero(-9, 9), d] as const);
        const f = poly(...terms.map(([c, d]) => term(c, d)));
        const fNeg = poly(...terms.map(([c, d]) => term(d % 2 === 0 ? c : -c, d)));
        return choiceProblem({
          prompt: t(`Is $f(x) = ${f}$ even, odd, or neither?`, `$f(x) = ${f}$ 是偶函数、奇函数，还是都不是？`),
          options: parityOptions,
          correct: kind,
          solution: t(
            `$f(-x) = ${fNeg}$. ${["This equals $f(x)$: all the powers are even, so $f$ is even.", "This equals $-f(x)$: all the powers are odd, so $f$ is odd.", "This is neither $f(x)$ nor $-f(x)$, because the powers are mixed, so $f$ is neither."][kind]}`,
            `$f(-x) = ${fNeg}$。${["它等于 $f(x)$：所有次数都是偶数，所以 $f$ 是偶函数。", "它等于 $-f(x)$：所有次数都是奇数，所以 $f$ 是奇函数。", "它既不等于 $f(x)$ 也不等于 $-f(x)$，因为次数奇偶混合，所以 $f$ 两者都不是。"][kind]}`,
          ),
        });
      },
    },
    {
      id: "using-symmetry",
      title: t("Using symmetry", "利用对称性"),
      explanation: t(
        "If a function is known to be even or odd, its values for $x \\ge 0$ decide all the others:\n\n- even: $f(-x) = f(x)$;\n- odd: $f(-x) = -f(x)$.\n\nSuppose $f$ is odd and $f(x) = x^{2} - 3x$ for $x \\ge 0$. Then $f(-4) = -f(4) = -(16 - 12) = -4$. Substituting $-4$ into the formula is wrong: the formula holds only for $x \\ge 0$.",
        "若已知函数是偶函数或奇函数，它在 $x \\ge 0$ 时的值决定了其余的值：\n\n- 偶函数：$f(-x) = f(x)$；\n- 奇函数：$f(-x) = -f(x)$。\n\n设 $f$ 是奇函数，且当 $x \\ge 0$ 时 $f(x) = x^{2} - 3x$。则 $f(-4) = -f(4) = -(16 - 12) = -4$。把 $-4$ 直接代入公式是错的：公式只对 $x \\ge 0$ 成立。",
      ),
      generate(rng) {
        const odd = rng.bool();
        const p: Poly = [odd ? 0 : rng.int(-9, 9), rng.nonZero(-6, 6), rng.nonZero(-3, 3)];
        const c = rng.int(1, 6);
        const fc = evalPoly(p, c);
        const answer = odd ? -fc : fc;
        const formula = polyLatex(p);
        const work = polyLatex(p).replace(/x/g, `(${c})`);
        return numberProblem({
          prompt: t(
            `The function $f$ is ${odd ? "odd" : "even"}, and $f(x) = ${formula}$ for $x \\ge 0$. Find $f(${-c})$.`,
            `函数 $f$ 是${odd ? "奇" : "偶"}函数，且当 $x \\ge 0$ 时 $f(x) = ${formula}$。求 $f(${-c})$。`,
          ),
          answer,
          wrong: [evalPoly(p, -c), -answer],
          solution: t(
            `The formula holds only for $x \\ge 0$, so use the symmetry: $f(${-c}) = ${odd ? "-" : ""}f(${c})$, and $f(${c}) = ${work} = ${fc}$. So $f(${-c}) = ${answer}$.`,
            `公式只对 $x \\ge 0$ 成立，所以利用对称性：$f(${-c}) = ${odd ? "-" : ""}f(${c})$，而 $f(${c}) = ${work} = ${fc}$。所以 $f(${-c}) = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

// Topic: products of even and odd functions.

/** power writes name(x)^e, or nothing for e = 0. */
const power = (name: string, e: number) => (e === 0 ? "" : e === 1 ? `${name}(x)` : `${name}(x)^{${e}}`);

/** Factor is a function used in a product, with its parity: 0 even, 1 odd, 2 neither. */
interface Factor {
  readonly latex: string;
  readonly parity: 0 | 1 | 2;
}

function randomFactor(rng: Rng, parity: 0 | 1 | 2): Factor {
  const c = rng.nonZero(-9, 9);
  const options: readonly string[] = [
    [`x^{2}${plus(c)}`, `x^{4}${plus(c)}`, "|x|", "x^{2}", poly([1, "x^{4}"], [c, "x^{2}"])],
    [poly([1, "x^{3}"], [c, "x"]), "x", "x^{3}", "x^{5}", poly([c, "x^{5}"], [1, "x"])],
    [linear(1, c), poly([1, "x^{2}"], [c, "x"]), poly([1, "x^{3}"], [c, ""])],
  ][parity]!;
  return { latex: rng.pick(options), parity };
}

/** wrapFactor puts a sum in parentheses. */
const wrapFactor = (s: string) => (/[+-]/.test(s.slice(1)) ? `(${s})` : s);

/** productsOfEvenAndOddFunctions finds the parity of products and quotients of even and odd functions. */
export const productsOfEvenAndOddFunctions: TopicDef = {
  id: "products-of-even-and-odd-functions",
  title: t("Products of Even and Odd Functions", "奇偶函数的乘积"),
  summary: t(
    "Products and quotients of even and odd functions follow sign rules: even·even and odd·odd are even, even·odd is odd.",
    "奇偶函数的积与商遵循符号法则：偶·偶与奇·奇为偶函数，偶·奇为奇函数。",
  ),
  prerequisites: ["even-and-odd-functions", "arithmetic-of-functions"],
  encompasses: [
    { topic: "even-and-odd-functions", weight: 0.5 },
    { topic: "arithmetic-of-functions", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.BF.B.3"],
  knowledgePoints: [
    {
      id: "parity-of-products",
      title: t("The sign rules", "符号法则"),
      explanation: t(
        "Even and odd behave like the signs $+$ and $-$ under multiplication and division. If $f$ is even and $g$ is odd, then for $h(x) = f(x)g(x)$:\n\n$$h(-x) = f(-x)\\,g(-x) = f(x) \\cdot (-g(x)) = -h(x),$$\n\nso $h$ is odd. In general, count the **odd** factors (with their powers): an even number of them gives an even function, an odd number an odd function. So $g(x)^{2}$ is even, $f(x)g(x)^{3}$ is odd, and $\\frac{g(x)}{f(x)}$ is odd.",
        "在乘法和除法中，偶与奇就像符号 $+$ 与 $-$。若 $f$ 是偶函数，$g$ 是奇函数，则对于 $h(x) = f(x)g(x)$：\n\n$$h(-x) = f(-x)\\,g(-x) = f(x) \\cdot (-g(x)) = -h(x),$$\n\n所以 $h$ 是奇函数。一般地，数一数**奇函数**因式的个数（连同次数）：偶数个得偶函数，奇数个得奇函数。所以 $g(x)^{2}$ 是偶函数，$f(x)g(x)^{3}$ 是奇函数，$\\frac{g(x)}{f(x)}$ 是奇函数。",
      ),
      generate(rng) {
        const [E, O] = rng.bool() ? ["f", "g"] : ["g", "f"];
        let e1: number;
        let e2: number;
        do {
          e1 = rng.int(0, 3);
          e2 = rng.int(0, 3);
        } while (e1 + e2 < 2);
        const quotient = e1 > 0 && e2 > 0 && rng.bool(0.4);
        const oddOnTop = rng.bool();
        const h = quotient
          ? oddOnTop
            ? `\\frac{${power(O, e2)}}{${power(E, e1)}}`
            : `\\frac{${power(E, e1)}}{${power(O, e2)}}`
          : rng.bool()
            ? `${power(E, e1)}${power(O, e2)}`
            : `${power(O, e2)}${power(E, e1)}`;
        const odd = e2 % 2 === 1;
        return choiceProblem({
          prompt: t(
            `$${E}$ is an even function and $${O}$ is an odd function. Is $h(x) = ${h}$ even or odd?`,
            `$${E}$ 是偶函数，$${O}$ 是奇函数。$h(x) = ${h}$ 是偶函数还是奇函数？`,
          ),
          options: parityOptions.slice(0, 2),
          correct: odd ? 1 : 0,
          solution: t(
            `The odd function $${O}$ appears ${e2 === 0 ? "no times" : `$${e2}$ time${e2 === 1 ? "" : "s"}`}, so replacing $x$ by $-x$ changes the sign ${e2 === 0 ? "no times" : `$${e2}$ time${e2 === 1 ? "" : "s"}`}; the even function $${E}$ changes nothing. ${odd ? "An odd number of sign changes gives $h(-x) = -h(x)$: $h$ is odd." : "An even number of sign changes gives $h(-x) = h(x)$: $h$ is even."}`,
            `奇函数 $${O}$ 出现 $${e2}$ 次，所以把 $x$ 换成 $-x$ 时符号改变 $${e2}$ 次；偶函数 $${E}$ 不改变符号。${odd ? "符号改变奇数次，得 $h(-x) = -h(x)$：$h$ 是奇函数。" : "符号改变偶数次，得 $h(-x) = h(x)$：$h$ 是偶函数。"}`,
          ),
        });
      },
    },
    {
      id: "values-of-products",
      title: t("Values of products", "乘积的函数值"),
      explanation: t(
        "To evaluate a product at $-a$, replace each factor by its value at $a$: an even factor keeps its value, an odd factor changes sign.\n\nIf $f$ is even, $g$ is odd, $f(2) = 3$ and $g(2) = -5$, then for $h(x) = f(x)g(x)^{3}$:\n\n$$h(-2) = f(2) \\cdot (-g(2))^{3} = 3 \\cdot 5^{3} = 375.$$",
        "在 $-a$ 处求乘积的值，就把每个因式换成它在 $a$ 处的值：偶函数因式值不变，奇函数因式变号。\n\n若 $f$ 是偶函数，$g$ 是奇函数，$f(2) = 3$，$g(2) = -5$，则对于 $h(x) = f(x)g(x)^{3}$：\n\n$$h(-2) = f(2) \\cdot (-g(2))^{3} = 3 \\cdot 5^{3} = 375.$$",
      ),
      generate(rng) {
        const forms: readonly (readonly [string, number, number, boolean])[] = [
          ["f(x)g(x)", 1, 1, false],
          ["g(x)^{2}", 0, 2, false],
          ["f(x)^{2}g(x)", 2, 1, false],
          ["g(x)^{3}", 0, 3, false],
          ["f(x)g(x)^{2}", 1, 2, false],
          ["\\frac{f(x)}{g(x)}", 1, 1, true],
          ["\\frac{g(x)}{f(x)}", 1, 1, true],
        ];
        const idx = rng.int(0, forms.length - 1);
        const [h, fe, ge, quotient] = forms[idx]!;
        const a = rng.int(1, 9);
        const u = rng.nonZero(-6, 6);
        const v = rng.nonZero(-6, 6);
        const U = Q.of(u);
        const V = Q.of(-v);
        const value = (fu: Q, gv: Q) => (quotient ? (idx === 5 ? fu.div(gv) : gv.div(fu)) : fu.pow(fe).mul(gv.pow(ge)));
        const answer = value(U, V);
        const naive = value(U, Q.of(v));
        const subst = quotient
          ? idx === 5
            ? `\\frac{${u}}{${-v}}`
            : `\\frac{${-v}}{${u}}`
          : [fe === 0 ? "" : fe === 1 ? `(${u})` : `(${u})^{${fe}}`, ge === 1 ? `(${-v})` : `(${-v})^{${ge}}`]
              .filter(Boolean)
              .join(" \\cdot ");
        return numberProblem({
          prompt: t(
            `$f$ is even and $g$ is odd, with $f(${a}) = ${u}$ and $g(${a}) = ${v}$. Find $h(${-a})$ for $h(x) = ${h}$.`,
            `$f$ 是偶函数，$g$ 是奇函数，$f(${a}) = ${u}$，$g(${a}) = ${v}$。设 $h(x) = ${h}$，求 $h(${-a})$。`,
          ),
          answer,
          wrong: [naive, answer.neg()],
          solution: t(
            `$f(${-a}) = f(${a}) = ${u}$ and $g(${-a}) = -g(${a}) = ${-v}$. So $h(${-a}) = ${subst} = ${num(answer)}$.`,
            `$f(${-a}) = f(${a}) = ${u}$，$g(${-a}) = -g(${a}) = ${-v}$。所以 $h(${-a}) = ${subst} = ${num(answer)}$。`,
          ),
        });
      },
    },
    {
      id: "parity-of-products-of-formulas",
      title: t("Products of formulas", "解析式的乘积"),
      explanation: t(
        "To decide whether a product of formulas is even or odd, decide each factor first, then use the sign rules. A factor that is neither even nor odd, such as $x + 1$, makes the product neither (for the factors met here).\n\n$h(x) = (x^{2} + 1)(x^{3} - 4x)$ is even times odd, so it is odd. $h(x) = x^{3}|x|$ is odd times even, so it is odd as well. $h(x) = (x - 2)x^{2}$ is neither.",
        "判断解析式之积的奇偶性：先判断每个因式，再用符号法则。若有一个因式既不是奇函数也不是偶函数，如 $x + 1$，则乘积也两者都不是（就这里遇到的因式而言）。\n\n$h(x) = (x^{2} + 1)(x^{3} - 4x)$ 是偶乘奇，所以是奇函数。$h(x) = x^{3}|x|$ 是奇乘偶，也是奇函数。$h(x) = (x - 2)x^{2}$ 两者都不是。",
      ),
      generate(rng) {
        let pa: 0 | 1 | 2;
        let pb: 0 | 1 | 2;
        do {
          pa = rng.pick([0, 1, 2] as const);
          pb = rng.pick([0, 1, 2] as const);
        } while (pa === 2 && pb === 2);
        const A = randomFactor(rng, pa);
        let B: Factor;
        do B = randomFactor(rng, pb);
        while (B.latex === A.latex);
        const [l, r] = [wrapFactor(A.latex), wrapFactor(B.latex)];
        const h = r.startsWith("(") ? `${l}${r}` : l.startsWith("(") ? `${r}${l}` : `${l} \\cdot ${r}`;
        const correct = pa === 2 || pb === 2 ? 2 : (pa + pb) % 2 === 1 ? 1 : 0;
        const name = (p: 0 | 1 | 2) => [t("even", "偶函数"), t("odd", "奇函数"), t("neither even nor odd", "既不是奇函数也不是偶函数")][p]!;
        return choiceProblem({
          prompt: t(`Is $h(x) = ${h}$ even, odd, or neither?`, `$h(x) = ${h}$ 是偶函数、奇函数，还是都不是？`),
          options: parityOptions,
          correct,
          solution: t(
            `$${A.latex}$ is ${name(pa).en} and $${B.latex}$ is ${name(pb).en}. ${correct === 2 ? "With a factor that is neither, the product mixes even and odd powers, so $h$ is neither." : `By the sign rules the product is ${correct === 1 ? "odd" : "even"}.`}`,
            `$${A.latex}$ 是${name(pa)["zh-CN"]}，$${B.latex}$ 是${name(pb)["zh-CN"]}。${correct === 2 ? "有一个因式两者都不是，乘积中奇偶次数混合，所以 $h$ 两者都不是。" : `由符号法则，乘积是${correct === 1 ? "奇" : "偶"}函数。`}`,
          ),
        });
      },
    },
  ],
};

// Topic: unbounded behavior near a point.

const inf = (s: number) => (s > 0 ? "\\infty" : "-\\infty");

/** behaviorOptions describe f near x = h from the left and from the right. */
function behaviorOptions(h: number): Text[] {
  const both = (s: number) =>
    t(
      `$f(x) \\to ${inf(s)}$ as $x \\to ${h}^{-}$ and as $x \\to ${h}^{+}$`,
      `当 $x \\to ${h}^{-}$ 及 $x \\to ${h}^{+}$ 时，$f(x) \\to ${inf(s)}$`,
    );
  const split = (l: number) =>
    t(
      `$f(x) \\to ${inf(l)}$ as $x \\to ${h}^{-}$, and $f(x) \\to ${inf(-l)}$ as $x \\to ${h}^{+}$`,
      `当 $x \\to ${h}^{-}$ 时 $f(x) \\to ${inf(l)}$，当 $x \\to ${h}^{+}$ 时 $f(x) \\to ${inf(-l)}$`,
    );
  return [both(1), both(-1), split(-1), split(1)];
}

/** behaviorIndex is the option for signs left and right. */
const behaviorIndex = (left: number, right: number) => (left === right ? (left > 0 ? 0 : 1) : left < 0 ? 2 : 3);

/** unboundedBehaviorOfFunctionsNearAPoint finds vertical asymptotes and the behavior of a function on each side of them. */
export const unboundedBehaviorOfFunctionsNearAPoint: TopicDef = {
  id: "unbounded-behavior-of-functions-near-a-point",
  title: t("Unbounded Behavior of Functions Near a Point", "函数在一点附近的无界行为"),
  summary: t(
    "Find where a rational function grows without bound, its vertical asymptotes, and whether it goes to ∞ or −∞ on each side.",
    "求分式函数无界增长的位置，即竖直渐近线，并判断它在每一侧趋于 ∞ 还是 −∞。",
  ),
  prerequisites: ["simplifying-rational-expressions-by-factoring", "end-behavior"],
  encompasses: [
    { topic: "simplifying-rational-expressions-by-factoring", weight: 0.2 },
    { topic: "end-behavior", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7.D"],
  knowledgePoints: [
    {
      id: "vertical-asymptotes",
      title: t("Vertical asymptotes", "竖直渐近线"),
      explanation: t(
        "Near a value where the denominator of a fraction is $0$ and the numerator is not, the fraction divides by tinier and tinier numbers, so it grows **without bound**. The graph then hugs the vertical line there, a **vertical asymptote**.\n\nFactor the denominator and cancel common factors first: a factor that cancels leaves only a hole in the graph, not an asymptote.\n\n$$f(x) = \\frac{x - 1}{x^{2} + x - 2} = \\frac{x - 1}{(x - 1)(x + 2)}$$\n\nThe factor $x - 1$ cancels, so the only vertical asymptote is $x = -2$.",
        "在分母为 $0$ 而分子不为 $0$ 的值附近，分式除以越来越小的数，于是**无界**地增大。图象贴近那里的竖直线，这条线叫做**竖直渐近线**。\n\n先把分母因式分解并约去公因式：被约去的因式只在图象上留下一个空洞，而不是渐近线。\n\n$$f(x) = \\frac{x - 1}{x^{2} + x - 2} = \\frac{x - 1}{(x - 1)(x + 2)}$$\n\n因式 $x - 1$ 被约去，所以唯一的竖直渐近线是 $x = -2$。",
      ),
      keyPrerequisites: ["simplifying-rational-expressions-by-factoring"],
      generate(rng) {
        const h1 = rng.int(-7, 7);
        const h2 = distinctFrom(rng, -7, 7, h1);
        const kind = rng.int(0, 2);
        const p = kind === 2 ? h1 : rng.int(-7, 7);
        const constant = kind === 0;
        const top = constant ? String(rng.nonZero(-9, 9)) : shifted(p);
        const expanded = rng.bool();
        const bottom = expanded ? polyLatex([h1 * h2, -(h1 + h2), 1]) : `(${shifted(h1)})(${shifted(h2)})`;
        const answer = constant || (p !== h1 && p !== h2) ? [h1, h2] : [p === h1 ? h2 : h1];
        const values = answer.map(String);
        return solutionsProblem({
          prompt: t(
            `Find the vertical asymptotes of $f(x) = \\frac{${top}}{${bottom}}$. Write each as $x = a$.`,
            `求 $f(x) = \\frac{${top}}{${bottom}}$ 的竖直渐近线，每条写成 $x = a$ 的形式。`,
          ),
          values,
          wrong: [[String(-h1), String(-h2)], [String(h1), String(h2)], ...(constant ? [] : [[String(p)], [String(p), ...values]])],
          solution: t(
            `The denominator is $(${shifted(h1)})(${shifted(h2)})$, which is $0$ at $x = ${h1}$ and $x = ${h2}$. ${answer.length === 2 ? "The numerator is not $0$ at either, so both are vertical asymptotes" : `The factor $${shifted(p)}$ cancels with the numerator, leaving a hole at $x = ${p}$, so the only vertical asymptote is $x = ${answer[0]}$`}.`,
            `分母为 $(${shifted(h1)})(${shifted(h2)})$，在 $x = ${h1}$ 和 $x = ${h2}$ 处为 $0$。${answer.length === 2 ? "分子在这两处都不为 $0$，所以两条都是竖直渐近线" : `因式 $${shifted(p)}$ 与分子约去，在 $x = ${p}$ 处只留下空洞，所以唯一的竖直渐近线是 $x = ${answer[0]}$`}。`,
          ),
        });
      },
    },
    {
      id: "behavior-on-each-side",
      title: t("Behavior on each side", "两侧的行为"),
      explanation: t(
        "To see whether $f(x) \\to \\infty$ or $-\\infty$ as $x \\to h$, look at signs. $x \\to h^{+}$ means $x$ approaches $h$ from the right ($x > h$), and $x \\to h^{-}$ from the left.\n\nFor $f(x) = \\frac{-3}{x - 2}$: just right of $2$, $x - 2$ is a tiny positive number, so $f(x)$ is a huge negative number: $f(x) \\to -\\infty$ as $x \\to 2^{+}$. Just left of $2$, $x - 2$ is tiny and negative, so $f(x) \\to \\infty$ as $x \\to 2^{-}$.\n\nA squared factor such as $(x - 2)^{2}$ is positive on both sides, so then both sides go the same way.",
        "要判断 $x \\to h$ 时 $f(x) \\to \\infty$ 还是 $-\\infty$，看符号。$x \\to h^{+}$ 表示 $x$ 从右侧趋近 $h$（$x > h$），$x \\to h^{-}$ 表示从左侧趋近。\n\n对于 $f(x) = \\frac{-3}{x - 2}$：在 $2$ 的右侧附近，$x - 2$ 是很小的正数，所以 $f(x)$ 是绝对值很大的负数：当 $x \\to 2^{+}$ 时 $f(x) \\to -\\infty$。在 $2$ 的左侧附近，$x - 2$ 是很小的负数，所以当 $x \\to 2^{-}$ 时 $f(x) \\to \\infty$。\n\n像 $(x - 2)^{2}$ 这样的平方因式在两侧都为正，这时两侧趋向相同。",
      ),
      generate(rng) {
        const h = rng.int(-6, 6);
        const n = rng.pick([1, 1, 2]);
        const v = rng.int(-5, 5);
        const constant = rng.bool();
        const c = rng.nonZero(-9, 9);
        const p = distinctFrom(rng, -9, 9, h);
        const top = constant ? String(c) : shifted(p);
        const topAt = constant ? c : h - p;
        const right = Math.sign(topAt);
        const left = n === 2 ? right : -right;
        const den = n === 1 ? shifted(h) : `(${shifted(h)})^{2}`;
        return choiceProblem({
          prompt: t(
            `Describe the behavior of $f(x) = \\frac{${top}}{${den}}${plus(v)}$ near $x = ${h}$.`,
            `描述 $f(x) = \\frac{${top}}{${den}}${plus(v)}$ 在 $x = ${h}$ 附近的行为。`,
          ),
          options: behaviorOptions(h),
          correct: behaviorIndex(left, right),
          solution: t(
            `Near $x = ${h}$ the numerator is close to $${topAt}$, which is ${topAt > 0 ? "positive" : "negative"}, and the denominator is close to $0$: ${n === 2 ? "a square, positive on both sides" : "negative on the left and positive on the right"}. The added $${v}$ does not matter. So $f(x) \\to ${inf(left)}$ as $x \\to ${h}^{-}$ and $f(x) \\to ${inf(right)}$ as $x \\to ${h}^{+}$.`,
            `在 $x = ${h}$ 附近，分子接近 $${topAt}$，为${topAt > 0 ? "正" : "负"}，分母接近 $0$：${n === 2 ? "它是平方，在两侧都为正" : "左侧为负，右侧为正"}。加上的 $${v}$ 不影响结论。所以当 $x \\to ${h}^{-}$ 时 $f(x) \\to ${inf(left)}$，当 $x \\to ${h}^{+}$ 时 $f(x) \\to ${inf(right)}$。`,
          ),
        });
      },
    },
    {
      id: "unbounded-behavior-from-a-graph",
      title: t("Unbounded behavior from a graph", "从图象看无界行为"),
      explanation: t(
        "On a graph, a vertical asymptote $x = h$ is often drawn dashed. Follow each branch toward it: a branch that shoots up goes to $\\infty$, one that plunges down goes to $-\\infty$. Read the left side ($x \\to h^{-}$) and the right side ($x \\to h^{+}$) separately; they may agree or not.",
        "在图象上，竖直渐近线 $x = h$ 常画成虚线。沿每一支向它靠近：向上冲的一支趋于 $\\infty$，向下落的一支趋于 $-\\infty$。左侧（$x \\to h^{-}$）与右侧（$x \\to h^{+}$）要分别看，它们可能相同也可能不同。",
      ),
      generate(rng) {
        const h = rng.int(-3, 3);
        const v = rng.int(-2, 2);
        const n = rng.pick([1, 2]);
        const a = rng.sign() * rng.int(1, 3);
        const right = Math.sign(a);
        const left = n === 2 ? right : -right;
        const f = (x: number) => a / (x - h) ** n + v;
        const zh = (s: number) => (s > 0 ? "向上无限延伸" : "向下无限延伸");
        return {
          ...choiceProblem({
            prompt: t(`${graphShown.en} Describe its behavior near $x = ${h}$.`, `${graphShown["zh-CN"]}描述它在 $x = ${h}$ 附近的行为。`),
            options: behaviorOptions(h),
            correct: behaviorIndex(left, right),
            solution: t(
              `Left of the dashed line $x = ${h}$ the graph goes ${left > 0 ? "up" : "down"} without bound, so $f(x) \\to ${inf(left)}$ as $x \\to ${h}^{-}$. Right of it the graph goes ${right > 0 ? "up" : "down"}, so $f(x) \\to ${inf(right)}$ as $x \\to ${h}^{+}$.`,
              `在虚线 $x = ${h}$ 的左侧，图象${left > 0 ? "向上" : "向下"}无限延伸，所以当 $x \\to ${h}^{-}$ 时 $f(x) \\to ${inf(left)}$。在它的右侧，图象${right > 0 ? "向上" : "向下"}延伸，所以当 $x \\to ${h}^{+}$ 时 $f(x) \\to ${inf(right)}$。`,
            ),
          }),
          figure: {
            svg: plane(view, [
              { kind: "line", a: [h, 0], b: [h, 1], dashed: true },
              { kind: "curve", f, to: h - 0.001, accent: true },
              { kind: "curve", f, from: h + 0.001, accent: true },
            ]),
            alt: t(
              `The graph of f with a dashed vertical line at x = ${h}. Left of the line the graph goes ${left > 0 ? "up" : "down"} without bound; right of it, it goes ${right > 0 ? "up" : "down"} without bound. Far from the line it levels off near y = ${v}.`,
              `f 的图象，在 x = ${h} 处有一条竖直虚线。在虚线左侧，图象${zh(left)}；在右侧，图象${zh(right)}。远离虚线时，图象趋于 y = ${v}。`,
            ),
          },
        };
      },
    },
  ],
};

// Topic: the average rate of change of a function.

/** averageRate is (f(b) - f(a)) / (b - a). */
const averageRate = (fa: number, fb: number, a: number, b: number) => Q.of(fb - fa, b - a);

/** rateWrong lists the mistakes of an average rate of change. */
function rateWrong(fa: number, fb: number, a: number, b: number): Q[] {
  return [Q.of(fb - fa), Q.of(fa - fb, b - a), ...(fb !== fa ? [Q.of(b - a, fb - fa)] : []), Q.of(fb + fa, b - a)];
}

/** rateLatex writes the computation of an average rate of change. */
const rateLatex = (name: string, fa: number, fb: number, a: number, b: number) =>
  `\\frac{${name}(${b}) - ${name}(${a})}{${b} - ${sub(a)}} = \\frac{${fb} - ${sub(fa)}}{${b - a}} = ${num(averageRate(fa, fb, a, b))}`;

/** theAverageRateOfChangeOfAFunction finds average rates of change from formulas, tables, graphs and models. */
export const theAverageRateOfChangeOfAFunction: TopicDef = {
  id: "the-average-rate-of-change-of-a-function",
  title: t("The Average Rate of Change of a Function", "函数的平均变化率"),
  summary: t(
    "Find the average rate of change of a function over an interval: the slope of the line through two points of its graph.",
    "求函数在一个区间上的平均变化率：经过图象上两点的直线的斜率。",
  ),
  prerequisites: ["slope-of-a-line", "units-of-rates-of-change", "graphs-of-functions"],
  encompasses: [
    { topic: "units-of-rates-of-change", weight: 0.4 },
    { topic: "slope-of-a-line", weight: 0.3 },
    { topic: "graphs-of-functions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.B.6"],
  knowledgePoints: [
    {
      id: "average-rate-of-change-from-a-formula",
      title: t("From a formula", "由解析式求"),
      explanation: t(
        "The **average rate of change** of $f$ from $x = a$ to $x = b$ is the change in output divided by the change in input:\n\n$$\\frac{f(b) - f(a)}{b - a}.$$\n\nIt is the slope of the line through $(a, f(a))$ and $(b, f(b))$. For $f(x) = x^{2} + 1$ from $x = 1$ to $x = 4$:\n\n$$\\frac{f(4) - f(1)}{4 - 1} = \\frac{17 - 2}{3} = 5.$$",
        "函数 $f$ 从 $x = a$ 到 $x = b$ 的**平均变化率**是输出的变化量除以输入的变化量：\n\n$$\\frac{f(b) - f(a)}{b - a}.$$\n\n它就是经过 $(a, f(a))$ 与 $(b, f(b))$ 的直线的斜率。对于 $f(x) = x^{2} + 1$，从 $x = 1$ 到 $x = 4$：\n\n$$\\frac{f(4) - f(1)}{4 - 1} = \\frac{17 - 2}{3} = 5.$$",
      ),
      keyPrerequisites: ["slope-of-a-line"],
      generate(rng) {
        const cubic = rng.bool(0.3);
        const p: Poly = cubic
          ? [rng.int(-9, 9), rng.int(-5, 5), rng.int(-3, 3), rng.sign()]
          : [rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-4, 4)];
        const a = rng.int(-4, 3);
        const b = rng.int(a + 1, cubic ? 4 : 6);
        const fa = evalPoly(p, a);
        const fb = evalPoly(p, b);
        return numberProblem({
          prompt: t(
            `Find the average rate of change of $f(x) = ${polyLatex(p)}$ from $x = ${a}$ to $x = ${b}$.`,
            `求 $f(x) = ${polyLatex(p)}$ 从 $x = ${a}$ 到 $x = ${b}$ 的平均变化率。`,
          ),
          answer: averageRate(fa, fb, a, b),
          wrong: rateWrong(fa, fb, a, b),
          solution: t(
            `$f(${a}) = ${fa}$ and $f(${b}) = ${fb}$, so${steps(rateLatex("f", fa, fb, a, b))}`,
            `$f(${a}) = ${fa}$，$f(${b}) = ${fb}$，所以${steps(rateLatex("f", fa, fb, a, b))}`,
          ),
        });
      },
    },
    {
      id: "average-rate-of-change-from-a-table",
      title: t("From a table", "由数值表求"),
      explanation: t(
        "From a table, read $f(a)$ and $f(b)$ and divide the differences, subtracting in the same order on top and bottom. The values in between do not matter.\n\nIf $f(-2) = 7$ and $f(3) = -8$, the average rate of change from $-2$ to $3$ is $\\frac{-8 - 7}{3 - (-2)} = \\frac{-15}{5} = -3$: on average $f$ falls $3$ units for each unit of $x$.",
        "由数值表读出 $f(a)$ 和 $f(b)$，再求差相除，分子分母按同样的顺序相减。中间的值不影响结果。\n\n若 $f(-2) = 7$，$f(3) = -8$，则从 $-2$ 到 $3$ 的平均变化率为 $\\frac{-8 - 7}{3 - (-2)} = \\frac{-15}{5} = -3$：$x$ 每增加一个单位，$f$ 平均下降 $3$ 个单位。",
      ),
      generate(rng) {
        const xs = rng.sample(range(-6, 10), 5).sort((a, b) => a - b);
        const ys = xs.map(() => rng.int(-20, 20));
        const [i, j] = rng.sample(range(0, 4), 2).sort((a, b) => a - b) as [number, number];
        const [a, b, fa, fb] = [xs[i]!, xs[j]!, ys[i]!, ys[j]!];
        return numberProblem({
          prompt: t(
            `The table shows some values of $g$.${valueTable("g", xs, ys)}Find the average rate of change of $g$ from $x = ${a}$ to $x = ${b}$.`,
            `下表给出了 $g$ 的一些值。${valueTable("g", xs, ys)}求 $g$ 从 $x = ${a}$ 到 $x = ${b}$ 的平均变化率。`,
          ),
          answer: averageRate(fa, fb, a, b),
          wrong: rateWrong(fa, fb, a, b),
          solution: t(`From the table:${steps(rateLatex("g", fa, fb, a, b))}`, `由表格：${steps(rateLatex("g", fa, fb, a, b))}`),
        });
      },
    },
    {
      id: "average-rate-of-change-from-a-graph",
      title: t("From a graph", "由图象求"),
      explanation: t(
        "On a graph, the average rate of change from $a$ to $b$ is the slope of the **secant line** joining the points of the graph above $x = a$ and $x = b$. Read the two heights, then divide the rise by the run. What the graph does in between does not matter.",
        "在图象上，从 $a$ 到 $b$ 的平均变化率是连接图象上 $x = a$ 与 $x = b$ 处两点的**割线**的斜率。读出两点的高度，再用竖直变化量除以水平变化量。图象在两点之间如何变化不影响结果。",
      ),
      generate(rng) {
        const x0 = rng.int(-6, -4);
        const x1 = rng.int(4, 6);
        const inner = rng.sample(range(x0 + 1, x1 - 1), rng.int(2, 4)).sort((a, b) => a - b);
        const xs = [x0, ...inner, x1];
        const pts = xs.map((x): Point => [x, rng.int(-5, 5)]);
        const [i, j] = rng.sample(range(0, pts.length - 1), 2).sort((a, b) => a - b) as [number, number];
        const [a, fa] = pts[i]!;
        const [b, fb] = pts[j]!;
        return {
          ...numberProblem({
            prompt: t(
              `${graphShown.en} Find the average rate of change of $f$ from $x = ${a}$ to $x = ${b}$.`,
              `${graphShown["zh-CN"]}求 $f$ 从 $x = ${a}$ 到 $x = ${b}$ 的平均变化率。`,
            ),
            answer: averageRate(fa, fb, a, b),
            wrong: rateWrong(fa, fb, a, b),
            solution: t(
              `The graph passes through $${pt(a, fa)}$ and $${pt(b, fb)}$, so${steps(rateLatex("f", fa, fb, a, b))}`,
              `图象经过 $${pt(a, fa)}$ 和 $${pt(b, fb)}$，所以${steps(rateLatex("f", fa, fb, a, b))}`,
            ),
          }),
          figure: segmentsFigure(pts),
        };
      },
    },
    {
      id: "average-rate-of-change-in-context",
      title: t("Average rates of change in context", "实际问题中的平均变化率"),
      explanation: t(
        "In a model, the average rate of change has units: output units per input unit. If a ball's height is $h(t) = -5t^{2} + 20t$ meters after $t$ seconds, then from $t = 1$ to $t = 3$:\n\n$$\\frac{h(3) - h(1)}{3 - 1} = \\frac{15 - 15}{2} = 0 \\text{ m/s}.$$\n\nThe ball's average velocity over those two seconds is $0$: it rose and fell back to the same height.",
        "在模型中，平均变化率带有单位：输出单位每输入单位。若球在 $t$ 秒后的高度为 $h(t) = -5t^{2} + 20t$ 米，则从 $t = 1$ 到 $t = 3$：\n\n$$\\frac{h(3) - h(1)}{3 - 1} = \\frac{15 - 15}{2} = 0 \\text{ m/s}.$$\n\n这两秒内球的平均速度为 $0$：它上升后又落回到同样的高度。",
      ),
      keyPrerequisites: ["units-of-rates-of-change"],
      generate(rng) {
        const ball = rng.bool();
        const p: Poly = ball ? [rng.int(0, 12) * 5, rng.int(4, 8) * 5, -5] : [rng.int(10, 40) * 10, rng.int(5, 30), -rng.int(1, 3)];
        const a = rng.int(0, 3);
        const b = rng.int(a + 1, 4);
        const fa = evalPoly(p, a);
        const fb = evalPoly(p, b);
        const f = polyLatex(p, "t");
        const ctx = ball
          ? t(
              `A ball is thrown upward. Its height after $t$ seconds is $h(t) = ${f}$ meters. Find its average velocity from $t = ${a}$ to $t = ${b}$, in meters per second.`,
              `一个球被向上抛出，$t$ 秒后它的高度为 $h(t) = ${f}$ 米。求它从 $t = ${a}$ 到 $t = ${b}$ 的平均速度，单位为米每秒。`,
            )
          : t(
              `A tank is being filled and drained. After $t$ minutes it holds $V(t) = ${f}$ liters of water. Find the average rate of change of the volume from $t = ${a}$ to $t = ${b}$, in liters per minute.`,
              `一个水箱同时进水和放水，$t$ 分钟后箱中有 $V(t) = ${f}$ 升水。求水量从 $t = ${a}$ 到 $t = ${b}$ 的平均变化率，单位为升每分钟。`,
            );
        const name = ball ? "h" : "V";
        return numberProblem({
          prompt: ctx,
          answer: averageRate(fa, fb, a, b),
          wrong: rateWrong(fa, fb, a, b),
          unit: ball ? "m/s" : "L/min",
          solution: t(
            `$${name}(${a}) = ${fa}$ and $${name}(${b}) = ${fb}$, so${steps(rateLatex(name, fa, fb, a, b))}The answer is $${num(averageRate(fa, fb, a, b))}$ ${ball ? "meters per second" : "liters per minute"}.`,
            `$${name}(${a}) = ${fa}$，$${name}(${b}) = ${fb}$，所以${steps(rateLatex(name, fa, fb, a, b))}答案是 $${num(averageRate(fa, fb, a, b))}$ ${ball ? "米每秒" : "升每分钟"}。`,
          ),
        });
      },
    },
  ],
};

/** algebraIIInverseTopics are the later topics of the Algebra II functions module, in teaching order. */
export const algebraIIInverseTopics: readonly TopicDef[] = [
  calculatingTheInverseOfAFunction,
  inversesOfQuadraticFunctions,
  plottingXAsAFunctionOfY,
  periodicFunctions,
  evenAndOddFunctions,
  productsOfEvenAndOddFunctions,
  unboundedBehaviorOfFunctionsNearAPoint,
  theAverageRateOfChangeOfAFunction,
];
