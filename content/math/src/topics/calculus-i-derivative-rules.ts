import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, poly, Q } from "@ga/subject-math";
import { calculusDrawings2 } from "../explanation-drawings-calculus-2.ts";

import { explainedChoice, functionProblem, numberProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { cdot, fracL, lim, type Poly, pAt, par, pDer, pLatex, power, range, sumLatex, table } from "./calculus-common.ts";

// Calculus I unit 4: Introduction to Differentiation, module 4.10.

/** Step is one labelled step of a solution: its title in both languages, what it says, and the lines it displays. */
type Step = readonly [title: readonly [string, string], say: Text, lines?: readonly string[]];

/** walked writes labelled steps, each with its displayed lines, followed by a check that takes a second route. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(
        ([[en, zh], say, lines = []], i) =>
          `${stepLabel(i + 1, en, zh)[locale]} ${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`,
      )
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** fmt writes a value rounded to three decimal places, without trailing zeros. */
const fmt = (v: number) => dec(Q.of(Math.round(v * 1000) || 0, 1000));

/** approxTo writes "= 5" for a whole number and "\approx 2.718" otherwise, after a derivative. */
const approxTo = (v: number) => (Math.abs(v - Math.round(v)) < 1e-9 ? `= ${Math.round(v) || 0}` : `\\approx ${fmt(v)}`);

/** quotientTable tabulates the difference quotients of f at a with h = 0.01 and h = −0.01; name is the function's letter and at writes a. */
function quotientTable(f: (x: number) => number, a: number, at: string, name: string): { readonly table: string; readonly mean: number } {
  const q = (h: number) => (f(a + h) - f(a)) / h;
  const row = `\\frac{${name}(${at} + h) - ${name}(${at})}{h}`;
  return {
    table: table(["$h$", "$0.01$", "$-0.01$"], [`$${row}$`, `$${fmt(q(0.01))}$`, `$${fmt(q(-0.01))}$`]),
    mean: (q(0.01) + q(-0.01)) / 2,
  };
}

/** slopeCheck compares a derivative from the rules with difference quotients at one point, with h = 0.01 on each side; exact writes the rules' value when it is not a whole number. */
function slopeCheck(f: (x: number) => number, slope: number, a: number, at = String(a), name = "f", exact?: string): Text {
  const q = quotientTable(f, a, at, name);
  const value = exact === undefined ? approxTo(slope) : `= ${exact}`;
  return t(
    `Compute difference quotients of $${name}$ at $x = ${at}$, with $h = 0.01$ on each side:\n\n${q.table}\n\nTheir average is $${fmt(q.mean)}$, and the rules give $${name}'(${at}) ${value}$.`,
    `计算 $${name}$ 在 $x = ${at}$ 处的差商，两侧各取 $h = 0.01$：\n\n${q.table}\n\n它们的平均值是 $${fmt(q.mean)}$，而求导法则给出 $${name}'(${at}) ${value}$。`,
  );
}

/** secondCheck compares a second derivative from the rules with second differences of f at a. */
function secondCheck(f: (x: number) => number, value: number, a: number, name = "f", v = "x"): Text {
  const d = (h: number) => (f(a + h) - 2 * f(a) + f(a - h)) / (h * h);
  const row = `\\frac{${name}(${a} + h) - 2${name}(${a}) + ${name}(${a} - h)}{h^{2}}`;
  const tab = table(["$h$", "$0.1$", "$0.01$"], [`$${row}$`, `$${fmt(d(0.1))}$`, `$${fmt(d(0.01))}$`]);
  return t(
    `A second difference estimates the second derivative without differentiating. At $${v} = ${a}$:\n\n${tab}\n\nAs $h$ shrinks the values approach $${name}''(${a}) ${approxTo(value)}$.`,
    `二阶差分不用求导就能估计二阶导数。在 $${v} = ${a}$ 处：\n\n${tab}\n\n随着 $h$ 变小，这些值逼近 $${name}''(${a}) ${approxTo(value)}$。`,
  );
}

/** Rule is a function with its derivative, as coefficient and LaTeX, a typical wrong derivative, and both as numbers. */
interface Rule {
  readonly f: string;
  readonly d: readonly [number, string];
  readonly bad: readonly [number, string];
  readonly at: (x: number) => number;
  readonly slope: (x: number) => number;
}

/** applyRules differentiates a sum of k·f terms, in LaTeX and as numbers. */
function applyRules(terms: readonly (readonly [number, Rule])[]) {
  return {
    f: poly(...terms.map(([k, r]) => [k, r.f] as const)),
    d: poly(...terms.map(([k, r]) => [k * r.d[0], r.d[1]] as const)),
    bad: poly(...terms.map(([k, r]) => [k * r.bad[0], r.bad[1]] as const)),
    at: (x: number) => terms.reduce((s, [k, r]) => s + k * r.at(x), 0),
    slope: (x: number) => terms.reduce((s, [k, r]) => s + k * r.slope(x), 0),
  };
}

/** ruleLine writes the rule of each term, joined in the language of the locale. */
const ruleLine = (rules: readonly Rule[]) =>
  t(
    rules.map((r) => `$\\frac{d}{dx} ${r.f} = ${poly(r.d)}$`).join(" and "),
    rules.map((r) => `$\\frac{d}{dx} ${r.f} = ${poly(r.d)}$`).join(" 和 "),
  );

/** differentiatingExponentialFunctions differentiates e^x and b^x. */
export const differentiatingExponentialFunctions: TopicDef = {
  id: "differentiating-exponential-functions",
  title: t("Differentiating Exponential Functions", "指数函数求导"),
  summary: t("Differentiate $e^x$ and exponential functions with other bases.", "对 $e^x$ 以及其他底数的指数函数求导。"),
  prerequisites: ["the-sum-and-constant-multiple-rules-for-differentiation", "limits-involving-the-exponential-function"],
  encompasses: [{ topic: "the-sum-and-constant-multiple-rules-for-differentiation", weight: 0.4 }],
  xp: 10,
  standards: [],
  intro: t(
    `The limit $\\lim_{h \\to 0} \\frac{e^{h} - 1}{h} = 1$ settles the slope of $e^{x}$. The difference quotient factors as\n\n$$\\frac{e^{x + h} - e^{x}}{h} = e^{x} \\cdot \\frac{e^{h} - 1}{h}.$$\n\nThe second factor tends to $1$, so the slope of $e^{x}$ at every point is $e^{x}$ itself.

Check: at $x = 1$, $\\frac{e^{1.01} - e}{0.01} \\approx 2.732$, close to $e \\approx 2.718$.

In this lesson we differentiate $e^{x}$, exponential functions with other bases, and find slopes of exponential curves.`,
    `极限 $\\lim_{h \\to 0} \\frac{e^{h} - 1}{h} = 1$ 决定了 $e^{x}$ 的斜率。差商可以分解为\n\n$$\\frac{e^{x + h} - e^{x}}{h} = e^{x} \\cdot \\frac{e^{h} - 1}{h}.$$\n\n第二个因子趋于 $1$，所以 $e^{x}$ 在每一点的斜率都是 $e^{x}$ 本身。

检验：在 $x = 1$ 处，$\\frac{e^{1.01} - e}{0.01} \\approx 2.732$，接近 $e \\approx 2.718$。

这节课我们对 $e^{x}$ 和其他底数的指数函数求导，并求指数曲线的斜率。`,
  ),
  knowledgePoints: [
    {
      id: "the-derivative-of-e-to-the-x",
      title: t("The derivative of e^x", "e^x 的导数"),
      explanation: t(
        "The exponential function is its own derivative:\n\n$$\\frac{d}{dx} e^{x} = e^{x}.$$\n\nThis follows from the definition: the difference quotient factors, and $\\lim_{h \\to 0} \\frac{e^{h} - 1}{h} = 1$:\n\n$$\\frac{e^{x + h} - e^{x}}{h} = e^{x} \\cdot \\frac{e^{h} - 1}{h} \\to e^{x}.$$\n\nWith the sum and constant multiple rules, $\\frac{d}{dx}\\left(4e^{x} - x^{3}\\right) = 4e^{x} - 3x^{2}$.\n\nCheck: $\\frac{e^{1.01} - e^{1}}{0.01} \\approx 2.732$, close to $e^{1} \\approx 2.718$.\n\n> **Watch out.** $e^{x}$ is not a power of $x$, so the power rule does not apply: its derivative is not $xe^{x - 1}$.",
        "指数函数的导数就是它自身：\n\n$$\\frac{d}{dx} e^{x} = e^{x}.$$\n\n这由定义得到：差商可以分解，且 $\\lim_{h \\to 0} \\frac{e^{h} - 1}{h} = 1$：\n\n$$\\frac{e^{x + h} - e^{x}}{h} = e^{x} \\cdot \\frac{e^{h} - 1}{h} \\to e^{x}.$$\n\n结合和法则与常数倍法则，$\\frac{d}{dx}\\left(4e^{x} - x^{3}\\right) = 4e^{x} - 3x^{2}$。\n\n检验：$\\frac{e^{1.01} - e^{1}}{0.01} \\approx 2.732$，接近 $e^{1} \\approx 2.718$。\n\n> **注意。** $e^{x}$ 不是 $x$ 的幂，不能用幂法则：它的导数不是 $xe^{x - 1}$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const k = rng.nonZero(-5, 5);
        const n = rng.int(2, 5);
        const c = rng.int(-9, 9);
        const f = poly([a, "e^{x}"], [k, power(n)], [c, ""]);
        const answer = poly([a, "e^{x}"], [k * n, power(n - 1)]);
        const value = (x: number) => a * Math.exp(x) + k * x ** n + c;
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [
            poly([a, "xe^{x - 1}"], [k * n, power(n - 1)]),
            poly([a, "e^{x}"], [k * n, power(n - 1)], [c, ""]),
            poly([k * n, power(n - 1)]),
          ],
          solution: walked(
            [
              [
                ["Differentiate the exponential term", "对指数项求导"],
                t(
                  `$\\frac{d}{dx} e^{x} = e^{x}$, so $${poly([a, "e^{x}"])}$ has derivative $${poly([a, "e^{x}"])}$.`,
                  `$\\frac{d}{dx} e^{x} = e^{x}$，所以 $${poly([a, "e^{x}"])}$ 的导数是 $${poly([a, "e^{x}"])}$。`,
                ),
              ],
              [
                ["Differentiate the power and the constant", "对幂和常数求导"],
                t(
                  `By the power rule $\\frac{d}{dx} ${power(n)} = ${n}${power(n - 1)}$, and the constant has derivative $0$:`,
                  `由幂法则 $\\frac{d}{dx} ${power(n)} = ${n}${power(n - 1)}$，常数的导数为 $0$：`,
                ),
                [`f'(x) = ${answer}`],
              ],
            ],
            slopeCheck(value, a * Math.E + k * n, 1),
          ),
        });
      },
    },
    {
      id: "the-derivative-of-b-to-the-x",
      title: t("The derivative of b^x", "b^x 的导数"),
      explanation: t(
        "For a base $b > 0$, write $b^{x} = e^{x\\ln b}$; its derivative is\n\n$$\\frac{d}{dx} b^{x} = b^{x}\\ln b.$$\n\nFor $b = e$, $\\ln e = 1$ and this is the rule for $e^{x}$. For example, $\\frac{d}{dx} 5 \\cdot 2^{x} = 5 \\cdot 2^{x}\\ln 2$.\n\nCheck: $\\frac{2^{1.01} - 2}{0.01} \\approx 1.391$, close to $2\\ln 2 \\approx 1.386$.\n\n> **Watch out.** The factor is $\\ln b$, not $\\frac{1}{\\ln b}$, and the exponent stays $x$: $b^{x}$ is not a power of $x$, so its derivative is not $xb^{x - 1}$.",
        "对底数 $b > 0$，有 $b^{x} = e^{x\\ln b}$，其导数为\n\n$$\\frac{d}{dx} b^{x} = b^{x}\\ln b.$$\n\n当 $b = e$ 时 $\\ln e = 1$，就是 $e^{x}$ 的求导法则。例如 $\\frac{d}{dx} 5 \\cdot 2^{x} = 5 \\cdot 2^{x}\\ln 2$。\n\n检验：$\\frac{2^{1.01} - 2}{0.01} \\approx 1.391$，接近 $2\\ln 2 \\approx 1.386$。\n\n> **注意。** 因子是 $\\ln b$，不是 $\\frac{1}{\\ln b}$；指数仍然是 $x$：$b^{x}$ 不是 $x$ 的幂，它的导数不是 $xb^{x - 1}$。",
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 4, 5, 7, 10]);
        const k = rng.pick([1, 1, 2, 3, 4, -1, -2, -3]);
        const a = rng.int(-4, 4);
        const f = sumLatex([cdot(k, `${b}^{x}`), poly([a, "e^{x}"])]);
        const answer = sumLatex([cdot(k, `${b}^{x}\\ln ${b}`), poly([a, "e^{x}"])]);
        const value = (x: number) => k * b ** x + a * Math.exp(x);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [
            sumLatex([cdot(k, `${b}^{x}`), poly([a, "e^{x}"])]),
            sumLatex([`${k < 0 ? "-" : ""}\\frac{${cdot(Math.abs(k), `${b}^{x}`)}}{\\ln ${b}}`, poly([a, "e^{x}"])]),
            sumLatex([cdot(k, `x \\cdot ${b}^{x - 1}`), poly([a, "e^{x}"])]),
          ],
          solution: walked(
            [
              [
                ["Use the rule for base b", "用以 b 为底的法则"],
                t(
                  `Since $${b}^{x} = e^{x\\ln ${b}}$, its derivative is $${b}^{x}\\ln ${b}$; the constant multiple $${k}$ stays.`,
                  `因为 $${b}^{x} = e^{x\\ln ${b}}$，它的导数是 $${b}^{x}\\ln ${b}$；常数倍 $${k}$ 保留。`,
                ),
              ],
              [
                ["Add the other term", "加上另一项"],
                a === 0
                  ? t("There is no other term, so", "没有其他项，所以")
                  : t(`$\\frac{d}{dx} e^{x} = e^{x}$, so`, `$\\frac{d}{dx} e^{x} = e^{x}$，所以`),
                [`f'(x) = ${answer}`],
              ],
            ],
            slopeCheck(value, k * b * Math.log(b) + a * Math.E, 1),
          ),
        });
      },
    },
    {
      id: "slopes-of-exponential-curves",
      title: t("Slopes of exponential curves", "指数曲线的斜率"),
      explanation: t(
        "Since $e^{0} = 1$, the curve $y = e^{x}$ has slope $1$ where it crosses the $y$-axis. To find a slope, differentiate and substitute.\n\nFor example, $y = 3e^{x} + x^{2}$ has $y' = 3e^{x} + 2x$, so its slope at $x = 0$ is $3 + 0 = 3$.\n\nCheck: $\\frac{y(0.01) - y(0)}{0.01} \\approx 3.025$, close to $3$.\n\n> **Watch out.** Substitute into the derivative, not into $y$. The constant term of $y$ disappears when differentiating, so it plays no part in the slope.",
        "因为 $e^{0} = 1$，曲线 $y = e^{x}$ 在与 $y$ 轴的交点处斜率为 $1$。求斜率时，先求导再代入。\n\n例如 $y = 3e^{x} + x^{2}$ 的导数是 $y' = 3e^{x} + 2x$，所以它在 $x = 0$ 处的斜率是 $3 + 0 = 3$。\n\n检验：$\\frac{y(0.01) - y(0)}{0.01} \\approx 3.025$，接近 $3$。\n\n> **注意。** 要代入导数，而不是代入 $y$。$y$ 的常数项在求导时消失，与斜率无关。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const p: Poly = [rng.int(-5, 5), rng.int(-6, 6), rng.int(-3, 3)];
        const d = pDer(p);
        const answer = a + pAt(d, 0);
        const f = sumLatex([poly([a, "e^{x}"]), pLatex(p)]);
        const dy = sumLatex([poly([a, "e^{x}"]), pLatex(d)]);
        return numberProblem({
          prompt: t(`Find the slope of the tangent line to $y = ${f}$ at $x = 0$.`, `求曲线 $y = ${f}$ 在 $x = 0$ 处的切线斜率。`),
          answer,
          wrong: [pAt(d, 0), a + p[0]!, a],
          solution: walked(
            [
              [["Differentiate", "求导"], t("Term by term,", "逐项求导，"), [`y' = ${dy}`]],
              [
                ["Substitute x = 0", "代入 x = 0"],
                t(`With $e^{0} = 1$, the slope is`, `由 $e^{0} = 1$，斜率为`),
                [`${a} \\cdot 1 ${pAt(d, 0) < 0 ? "-" : "+"} ${Math.abs(pAt(d, 0))} = ${answer}`],
              ],
            ],
            slopeCheck((x) => a * Math.exp(x) + pAt(p, x), answer, 0, "0", "y"),
          ),
        });
      },
    },
  ],
};

/** differentiatingLogarithmicFunctions differentiates ln x and log_b x. */
export const differentiatingLogarithmicFunctions: TopicDef = {
  id: "differentiating-logarithmic-functions",
  title: t("Differentiating Logarithmic Functions", "对数函数求导"),
  summary: t(
    "Differentiate ln x and logarithms to other bases, simplifying with the laws of logarithms first.",
    "对 ln x 和其他底数的对数求导，必要时先用对数运算法则化简。",
  ),
  prerequisites: ["differentiating-exponential-functions"],
  encompasses: [
    { topic: "change-of-base-formula", weight: 0.2 },
    { topic: "combining-laws-of-logarithms", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `The graph of $\\ln x$ is the graph of $e^{x}$ reflected in the line $y = x$. At the point $(\\ln a, a)$ the curve $y = e^{x}$ has slope $e^{\\ln a} = a$, so at the reflected point $(a, \\ln a)$ the logarithm has slope $\\frac{1}{a}$.

Check: $\\frac{\\ln 2.01 - \\ln 2}{0.01} \\approx 0.499$, close to $\\frac{1}{2}$.

In this lesson we differentiate $\\ln x$ and logarithms to other bases, simplifying with the laws of logarithms first.`,
    `$\\ln x$ 的图像是 $e^{x}$ 的图像关于直线 $y = x$ 的对称图形。曲线 $y = e^{x}$ 在点 $(\\ln a, a)$ 处的斜率是 $e^{\\ln a} = a$，所以对数在对称点 $(a, \\ln a)$ 处的斜率是 $\\frac{1}{a}$。

检验：$\\frac{\\ln 2.01 - \\ln 2}{0.01} \\approx 0.499$，接近 $\\frac{1}{2}$。

这节课我们对 $\\ln x$ 和其他底数的对数求导，必要时先用对数运算法则化简。`,
  ),
  knowledgePoints: [
    {
      id: "the-derivative-of-ln-x",
      figure: calculusDrawings2["differentiating-logarithmic-functions#the-derivative-of-ln-x"],
      title: t("The derivative of ln x", "ln x 的导数"),
      explanation: t(
        "The slope of the natural logarithm at any positive input is the reciprocal of that input, so the graph gets flatter as the input grows. For $x > 0$,\n\n$$\\frac{d}{dx} \\ln x = \\frac{1}{x}.$$\n\nSo the derivative of $3\\ln x + x^{2}$ is $\\frac{3}{x} + 2x$.\n\nCheck: $\\frac{\\ln 1.01 - \\ln 1}{0.01} \\approx 0.995$, close to $\\frac{1}{1} = 1$.\n\n> **Watch out.** The derivative of $\\ln x$ is $\\frac{1}{x}$, not $\\frac{1}{x^{2}}$ and not $\\ln x$ itself.",
        "自然对数在任意正数处的斜率都是该数的倒数，所以随着自变量增大，图像越来越平缓。当 $x > 0$ 时，\n\n$$\\frac{d}{dx} \\ln x = \\frac{1}{x}.$$\n\n所以 $3\\ln x + x^{2}$ 的导数是 $\\frac{3}{x} + 2x$。\n\n检验：$\\frac{\\ln 1.01 - \\ln 1}{0.01} \\approx 0.995$，接近 $\\frac{1}{1} = 1$。\n\n> **注意。** $\\ln x$ 的导数是 $\\frac{1}{x}$，不是 $\\frac{1}{x^{2}}$，也不是 $\\ln x$ 本身。",
      ),
      generate(rng) {
        const a = rng.nonZero(-7, 7);
        const k = rng.int(-4, 4);
        const n = rng.int(2, 4);
        const f = sumLatex([poly([a, "\\ln x"]), poly([k, power(n)])]);
        const kn = poly([k * n, power(n - 1)]);
        const answer = sumLatex([fracL(a, "x"), kn]);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$, where $x > 0$.`, `设 $f(x) = ${f}$，其中 $x > 0$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          positive: true,
          wrong: [sumLatex([fracL(a, "x^{2}"), kn]), sumLatex([poly([a, "x"]), kn]), sumLatex([poly([a, "\\ln x"]), kn])],
          solution: walked(
            [
              [
                ["Differentiate the logarithm", "对对数求导"],
                t(
                  `The derivative of $\\ln x$ is $\\frac{1}{x}$, so $${poly([a, "\\ln x"])}$ has derivative $${fracL(a, "x")}$.`,
                  `$\\ln x$ 的导数是 $\\frac{1}{x}$，所以 $${poly([a, "\\ln x"])}$ 的导数是 $${fracL(a, "x")}$。`,
                ),
              ],
              [
                ["Differentiate the power", "对幂求导"],
                k === 0
                  ? t("There is no power term, so", "没有幂项，所以")
                  : t(
                      `By the power rule $${poly([k, power(n)])}$ gives $${kn}$, so`,
                      `由幂法则，$${poly([k, power(n)])}$ 的导数是 $${kn}$，所以`,
                    ),
                [`f'(x) = ${answer}`],
              ],
            ],
            slopeCheck((x) => a * Math.log(x) + k * x ** n, a + k * n, 1),
          ),
        });
      },
    },
    {
      id: "the-derivative-of-log-base-b-of-x",
      title: t("The derivative of a logarithm to base b", "以 b 为底的对数的导数"),
      explanation: t(
        "A logarithm to any base is a constant multiple of the natural logarithm, so its derivative is the same reciprocal divided by the natural logarithm of the base. By the change of base formula, $\\log_{b} x = \\frac{\\ln x}{\\ln b}$, and $\\ln b$ is a constant. So\n\n$$\\frac{d}{dx} \\log_{b} x = \\frac{1}{x\\ln b}.$$\n\nFor example, the derivative of $\\log_{2} x$ is $\\frac{1}{x\\ln 2}$, which is about $1.443$ at $x = 1$.\n\nCheck: $\\frac{\\log_{2} 1.01 - \\log_{2} 1}{0.01} \\approx 1.436$, close to $1.443$.\n\n> **Watch out.** $\\ln b$ goes in the denominator, next to $x$. The derivative is $\\frac{1}{x\\ln b}$, not $\\frac{\\ln b}{x}$.",
        "任意底数的对数都是自然对数的常数倍，所以它的导数是同样的倒数再除以底数的自然对数。由换底公式，$\\log_{b} x = \\frac{\\ln x}{\\ln b}$，而 $\\ln b$ 是常数。所以\n\n$$\\frac{d}{dx} \\log_{b} x = \\frac{1}{x\\ln b}.$$\n\n例如 $\\log_{2} x$ 的导数是 $\\frac{1}{x\\ln 2}$，在 $x = 1$ 处约为 $1.443$。\n\n检验：$\\frac{\\log_{2} 1.01 - \\log_{2} 1}{0.01} \\approx 1.436$，接近 $1.443$。\n\n> **注意。** $\\ln b$ 在分母中，与 $x$ 相乘。导数是 $\\frac{1}{x\\ln b}$，不是 $\\frac{\\ln b}{x}$。",
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 4, 5, 7, 10]);
        const k = rng.pick([1, 1, 2, 3, 5, -1, -2, -4]);
        const f = poly([k, `\\log_{${b}} x`]);
        const answer = fracL(k, `x\\ln ${b}`);
        const rewritten = `${k < 0 ? "-" : ""}\\frac{${poly([Math.abs(k), "\\ln x"])}}{\\ln ${b}}`;
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$, where $x > 0$.`, `设 $f(x) = ${f}$，其中 $x > 0$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          positive: true,
          wrong: [fracL(k, "x"), `${k < 0 ? "-" : ""}\\frac{${poly([Math.abs(k), `\\ln ${b}`])}}{x}`, fracL(k, `${b}x`)],
          solution: walked(
            [
              [
                ["Change the base", "换底"],
                t(
                  `By the change of base formula, $f(x) = ${rewritten}$, and $\\ln ${b}$ is a constant.`,
                  `由换底公式，$f(x) = ${rewritten}$，而 $\\ln ${b}$ 是常数。`,
                ),
              ],
              [
                ["Differentiate", "求导"],
                t(`Since the derivative of $\\ln x$ is $\\frac{1}{x}$,`, `因为 $\\ln x$ 的导数是 $\\frac{1}{x}$，`),
                [`f'(x) = ${answer}`],
              ],
            ],
            slopeCheck((x) => (k * Math.log(x)) / Math.log(b), k / Math.log(b), 1),
          ),
        });
      },
    },
    {
      id: "simplifying-logarithms-before-differentiating",
      title: t("Simplifying logarithms before differentiating", "求导前先化简对数"),
      explanation: t(
        "Use the laws of logarithms to split a logarithm into simple terms first:\n\n$$\\ln\\left(5x^{3}\\right) = \\ln 5 + 3\\ln x, \\quad\\text{so}\\quad \\frac{d}{dx} \\ln\\left(5x^{3}\\right) = \\frac{3}{x}.$$\n\nThe constant $\\ln 5$ has derivative $0$.\n\nCheck: $\\frac{f(1.01) - f(1)}{0.01} \\approx 2.985$, close to $\\frac{3}{1} = 3$.\n\n> **Watch out.** Do not take the reciprocal of the inside. The derivative of $\\ln\\left(5x^{3}\\right)$ is not $\\frac{1}{5x^{3}}$.",
        "先用对数运算法则把对数拆成简单的项：\n\n$$\\ln\\left(5x^{3}\\right) = \\ln 5 + 3\\ln x, \\quad\\text{所以}\\quad \\frac{d}{dx} \\ln\\left(5x^{3}\\right) = \\frac{3}{x}.$$\n\n常数 $\\ln 5$ 的导数为 $0$。\n\n检验：$\\frac{f(1.01) - f(1)}{0.01} \\approx 2.985$，接近 $\\frac{3}{1} = 3$。\n\n> **注意。** 不要直接取真数的倒数。$\\ln\\left(5x^{3}\\right)$ 的导数不是 $\\frac{1}{5x^{3}}$。",
      ),
      generate(rng) {
        const c = rng.int(2, 9);
        const n = rng.int(2, 6);
        const quotient = rng.bool();
        const inside = quotient ? `\\frac{x^{${n}}}{${c}}` : `${c}x^{${n}}`;
        const split = quotient ? `${n}\\ln x - \\ln ${c}` : `\\ln ${c} + ${n}\\ln x`;
        const answer = `\\frac{${n}}{x}`;
        const value = (x: number) => Math.log(quotient ? x ** n / c : c * x ** n);
        return functionProblem({
          prompt: t(
            `Find $f'(x)$ for $f(x) = \\ln\\left(${inside}\\right)$, where $x > 0$.`,
            `设 $f(x) = \\ln\\left(${inside}\\right)$，其中 $x > 0$。求 $f'(x)$。`,
          ),
          answer,
          prefix: "f'(x) =",
          positive: true,
          wrong: [`\\frac{1}{${inside}}`, `\\frac{${quotient ? n : n * c}}{${quotient ? `${c}x` : "x"}}`, "\\frac{1}{x}"],
          solution: walked(
            [
              [["Split the logarithm", "拆开对数"], t("By the laws of logarithms,", "由对数运算法则，"), [`f(x) = ${split}`]],
              [
                ["Differentiate", "求导"],
                t(
                  `The constant $\\ln ${c}$ has derivative $0$, and $${n}\\ln x$ has derivative $\\frac{${n}}{x}$:`,
                  `常数 $\\ln ${c}$ 的导数为 $0$，$${n}\\ln x$ 的导数为 $\\frac{${n}}{x}$：`,
                ),
                [`f'(x) = ${answer}`],
              ],
            ],
            slopeCheck(value, n, 1),
          ),
        });
      },
    },
  ],
};

/** trigRules are the derivatives of sine, cosine and tangent. */
const trigRules: readonly Rule[] = [
  { f: "\\sin x", d: [1, "\\cos x"], bad: [-1, "\\cos x"], at: Math.sin, slope: Math.cos },
  { f: "\\cos x", d: [-1, "\\sin x"], bad: [1, "\\sin x"], at: Math.cos, slope: (x) => -Math.sin(x) },
  { f: "\\tan x", d: [1, "\\sec^{2}x"], bad: [1, "\\sec x\\tan x"], at: Math.tan, slope: (x) => 1 / Math.cos(x) ** 2 },
];

/** QuadrantalAngle is an angle with its LaTeX, sine, cosine and value in radians. */
type QuadrantalAngle = readonly [string, number, number, number];

/** quadrantalAngles are angles whose sine and cosine are integers. */
const quadrantalAngles: readonly QuadrantalAngle[] = [
  ["0", 0, 1, 0],
  ["\\frac{\\pi}{2}", 1, 0, Math.PI / 2],
  ["\\pi", 0, -1, Math.PI],
  ["\\frac{3\\pi}{2}", -1, 0, (3 * Math.PI) / 2],
];

/** differentiatingTrigonometricFunctions differentiates sin, cos and tan. */
export const differentiatingTrigonometricFunctions: TopicDef = {
  id: "differentiating-trigonometric-functions",
  title: t("Differentiating Trigonometric Functions", "三角函数求导"),
  summary: t(
    "Differentiate sine, cosine and tangent, and find slopes of trigonometric curves.",
    "对正弦、余弦、正切求导，并求三角函数曲线的斜率。",
  ),
  prerequisites: ["the-sum-and-constant-multiple-rules-for-differentiation", "special-limits-involving-cosine"],
  encompasses: [{ topic: "the-sum-and-constant-multiple-rules-for-differentiation", weight: 0.3 }],
  xp: 10,
  standards: [],
  intro: t(
    `The special limits $\\lim_{h \\to 0} \\frac{\\sin h}{h} = 1$ and $\\lim_{h \\to 0} \\frac{\\cos h - 1}{h} = 0$ give the slope of $\\sin x$. By the angle addition formula,

$$\\frac{\\sin(x + h) - \\sin x}{h} = \\sin x \\cdot \\frac{\\cos h - 1}{h} + \\cos x \\cdot \\frac{\\sin h}{h},$$

which tends to $\\sin x \\cdot 0 + \\cos x \\cdot 1 = \\cos x$.

Check: $\\frac{\\sin 1.01 - \\sin 1}{0.01} \\approx 0.536$, close to $\\cos 1 \\approx 0.540$.

In this lesson we differentiate sine, cosine and tangent, and find slopes of trigonometric curves.`,
    `特殊极限 $\\lim_{h \\to 0} \\frac{\\sin h}{h} = 1$ 和 $\\lim_{h \\to 0} \\frac{\\cos h - 1}{h} = 0$ 给出 $\\sin x$ 的斜率。由两角和公式，

$$\\frac{\\sin(x + h) - \\sin x}{h} = \\sin x \\cdot \\frac{\\cos h - 1}{h} + \\cos x \\cdot \\frac{\\sin h}{h},$$

它趋于 $\\sin x \\cdot 0 + \\cos x \\cdot 1 = \\cos x$。

检验：$\\frac{\\sin 1.01 - \\sin 1}{0.01} \\approx 0.536$，接近 $\\cos 1 \\approx 0.540$。

这节课我们对正弦、余弦、正切求导，并求三角函数曲线的斜率。`,
  ),
  knowledgePoints: [
    {
      id: "derivatives-of-sine-cosine-and-tangent",
      title: t("Derivatives of sine, cosine and tangent", "正弦、余弦、正切的导数"),
      explanation: t(
        "With $x$ in radians,\n\n$$\\frac{d}{dx} \\sin x = \\cos x, \\qquad \\frac{d}{dx} \\cos x = -\\sin x, \\qquad \\frac{d}{dx} \\tan x = \\sec^{2}x.$$\n\nThe first two follow from the definition and the special limits $\\frac{\\sin h}{h} \\to 1$ and $\\frac{\\cos h - 1}{h} \\to 0$. For example, $\\frac{d}{dx}\\left(4\\sin x + 3\\cos x\\right) = 4\\cos x - 3\\sin x$.\n\nCheck: $\\frac{\\cos 1.01 - \\cos 1}{0.01} \\approx -0.844$, close to $-\\sin 1 \\approx -0.841$.\n\n> **Watch out.** The derivative of cosine carries a minus sign, and the derivative of tangent is $\\sec^{2}x$, not $\\sec x\\tan x$. The rules hold only with $x$ in radians.",
        "当 $x$ 以弧度为单位时，\n\n$$\\frac{d}{dx} \\sin x = \\cos x, \\qquad \\frac{d}{dx} \\cos x = -\\sin x, \\qquad \\frac{d}{dx} \\tan x = \\sec^{2}x.$$\n\n前两个由定义及特殊极限 $\\frac{\\sin h}{h} \\to 1$、$\\frac{\\cos h - 1}{h} \\to 0$ 得到。例如 $\\frac{d}{dx}\\left(4\\sin x + 3\\cos x\\right) = 4\\cos x - 3\\sin x$。\n\n检验：$\\frac{\\cos 1.01 - \\cos 1}{0.01} \\approx -0.844$，接近 $-\\sin 1 \\approx -0.841$。\n\n> **注意。** 余弦的导数带负号；正切的导数是 $\\sec^{2}x$，不是 $\\sec x\\tan x$。这些法则只在 $x$ 以弧度为单位时成立。",
      ),
      generate(rng) {
        const rules = rng.sample(trigRules, 2);
        const terms = rules.map((r) => [rng.nonZero(-6, 6), r] as const);
        const k = rng.int(-4, 4);
        const g = applyRules(terms);
        const f = sumLatex([g.f, poly([k, "x^{2}"])]);
        const answer = sumLatex([g.d, poly([2 * k, "x"])]);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [sumLatex([g.bad, poly([2 * k, "x"])]), sumLatex([g.d, poly([k, "x^{2}"])])],
          solution: walked(
            [
              [
                ["Differentiate the trigonometric terms", "对三角函数项求导"],
                t(
                  `By ${ruleLine(rules).en}, $${g.f}$ has derivative $${g.d}$.`,
                  `由 ${ruleLine(rules)["zh-CN"]}，$${g.f}$ 的导数是 $${g.d}$。`,
                ),
              ],
              [
                ["Differentiate the power and add", "对幂求导并相加"],
                k === 0
                  ? t("There is no power term, so", "没有幂项，所以")
                  : t(
                      `$${poly([k, "x^{2}"])}$ has derivative $${poly([2 * k, "x"])}$, so`,
                      `$${poly([k, "x^{2}"])}$ 的导数是 $${poly([2 * k, "x"])}$，所以`,
                    ),
                [`f'(x) = ${answer}`],
              ],
            ],
            slopeCheck((x) => g.at(x) + k * x * x, g.slope(1) + 2 * k, 1),
          ),
        });
      },
    },
    {
      id: "slopes-of-trigonometric-curves",
      figure: calculusDrawings2["differentiating-trigonometric-functions#slopes-of-trigonometric-curves"],
      title: t("Slopes of trigonometric curves", "三角函数曲线的斜率"),
      explanation: t(
        "The slope of a curve at a point is the value of the derivative there, so find the derivative first and then substitute the exact values at the angle. For $y = 3\\sin x - 2\\cos x$ at $x = \\pi$: $y' = 3\\cos x + 2\\sin x$, so the slope is $3(-1) + 2(0) = -3$.\n\nCheck: $\\frac{y(\\pi + 0.01) - y(\\pi)}{0.01} \\approx -3.010$, close to $-3$.\n\n> **Watch out.** Substitute into $y'$, not into $y$. At $x = \\pi$ the values $\\sin \\pi = 0$ and $\\cos \\pi = -1$ are easy to swap; check them on the unit circle.",
        "曲线在一点处的斜率就是该点的导数值，所以先求导，再代入该角的精确三角函数值。对 $y = 3\\sin x - 2\\cos x$ 在 $x = \\pi$ 处：$y' = 3\\cos x + 2\\sin x$，所以斜率为 $3(-1) + 2(0) = -3$。\n\n检验：$\\frac{y(\\pi + 0.01) - y(\\pi)}{0.01} \\approx -3.010$，接近 $-3$。\n\n> **注意。** 要代入 $y'$，而不是 $y$。在 $x = \\pi$ 处 $\\sin \\pi = 0$、$\\cos \\pi = -1$ 容易弄混，可以在单位圆上核对。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-6, 6);
        const [x0, s, c, v] = rng.pick(quadrantalAngles);
        const answer = a * c - b * s;
        const y = poly([a, "\\sin x"], [b, "\\cos x"]);
        return numberProblem({
          prompt: t(`Find the slope of the tangent line to $y = ${y}$ at $x = ${x0}$.`, `求曲线 $y = ${y}$ 在 $x = ${x0}$ 处的切线斜率。`),
          answer,
          wrong: [a * s + b * c, a * c + b * s, -answer === answer ? a : -answer],
          solution: walked(
            [
              [
                ["Differentiate", "求导"],
                t("With the rules for sine and cosine,", "由正弦和余弦的求导法则，"),
                [`y' = ${poly([a, "\\cos x"], [-b, "\\sin x"])}`],
              ],
              [
                ["Substitute the angle", "代入角度"],
                t(
                  `At $x = ${x0}$, $\\sin x = ${s}$ and $\\cos x = ${c}$, so the slope is`,
                  `在 $x = ${x0}$ 处 $\\sin x = ${s}$，$\\cos x = ${c}$，所以斜率为`,
                ),
                [`${a}(${c}) ${b > 0 ? "-" : "+"} ${Math.abs(b)}(${s}) = ${answer}`],
              ],
            ],
            slopeCheck((x) => a * Math.sin(x) + b * Math.cos(x), answer, v, x0, "y"),
          ),
        });
      },
    },
  ],
};

/** hyperbolicRules are the derivatives of sinh, cosh and tanh. */
const hyperbolicRules: readonly Rule[] = [
  { f: "\\sinh x", d: [1, "\\cosh x"], bad: [-1, "\\cosh x"], at: Math.sinh, slope: Math.cosh },
  { f: "\\cosh x", d: [1, "\\sinh x"], bad: [-1, "\\sinh x"], at: Math.cosh, slope: Math.sinh },
  {
    f: "\\tanh x",
    d: [1, "\\operatorname{sech}^{2}x"],
    bad: [1, "\\sec^{2}x"],
    at: Math.tanh,
    slope: (x) => 1 / Math.cosh(x) ** 2,
  },
];

/** differentiatingHyperbolicFunctions differentiates sinh, cosh and tanh. */
export const differentiatingHyperbolicFunctions: TopicDef = {
  id: "differentiating-hyperbolic-functions",
  title: t("Differentiating Hyperbolic Functions", "双曲函数求导"),
  summary: t("Differentiate sinh, cosh and tanh, and evaluate their derivatives.", "对 sinh、cosh、tanh 求导，并计算导数值。"),
  prerequisites: ["differentiating-exponential-functions", "the-hyperbolic-functions"],
  encompasses: [
    { topic: "differentiating-exponential-functions", weight: 0.2 },
    { topic: "the-hyperbolic-functions", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `The rule for $b^{x}$ differentiates both halves of $\\sinh x = \\frac{e^{x} - e^{-x}}{2}$. Since $e^{-x} = \\left(\\frac{1}{e}\\right)^{x}$ and $\\ln \\frac{1}{e} = -1$, the derivative of $e^{-x}$ is $-e^{-x}$. So

$$\\frac{d}{dx} \\sinh x = \\frac{e^{x} + e^{-x}}{2} = \\cosh x.$$

Check: $\\frac{\\sinh 1.01 - \\sinh 1}{0.01} \\approx 1.549$, close to $\\cosh 1 \\approx 1.543$.

In this lesson we differentiate sinh, cosh and tanh, and evaluate their derivatives at points.`,
    `用 $b^{x}$ 的求导法则可以对 $\\sinh x = \\frac{e^{x} - e^{-x}}{2}$ 的两部分分别求导。因为 $e^{-x} = \\left(\\frac{1}{e}\\right)^{x}$，且 $\\ln \\frac{1}{e} = -1$，所以 $e^{-x}$ 的导数是 $-e^{-x}$。于是

$$\\frac{d}{dx} \\sinh x = \\frac{e^{x} + e^{-x}}{2} = \\cosh x.$$

检验：$\\frac{\\sinh 1.01 - \\sinh 1}{0.01} \\approx 1.549$，接近 $\\cosh 1 \\approx 1.543$。

这节课我们对 sinh、cosh、tanh 求导，并计算它们在某点的导数值。`,
  ),
  knowledgePoints: [
    {
      id: "derivatives-of-sinh-cosh-and-tanh",
      title: t("Derivatives of sinh, cosh and tanh", "sinh、cosh、tanh 的导数"),
      explanation: t(
        "Differentiating the exponential definitions shows that hyperbolic sine and cosine are each other's derivatives, with no minus sign, unlike sine and cosine. Differentiating $\\sinh x = \\frac{e^{x} - e^{-x}}{2}$ and $\\cosh x = \\frac{e^{x} + e^{-x}}{2}$ gives\n\n$$\\frac{d}{dx} \\sinh x = \\cosh x, \\qquad \\frac{d}{dx} \\cosh x = \\sinh x, \\qquad \\frac{d}{dx} \\tanh x = \\operatorname{sech}^{2}x.$$\n\nFor example, $\\frac{d}{dx}\\left(3\\sinh x - 2\\cosh x\\right) = 3\\cosh x - 2\\sinh x$.\n\nCheck: $\\frac{\\cosh 1.01 - \\cosh 1}{0.01} \\approx 1.183$, close to $\\sinh 1 \\approx 1.175$.\n\n> **Watch out.** Unlike cosine, the derivative of $\\cosh x$ has **no** minus sign. The derivative of $\\tanh x$ is $\\operatorname{sech}^{2}x$, not $\\sec^{2}x$.",
        "对指数定义求导可以看出，双曲正弦和双曲余弦互为导数，而且不像正弦和余弦那样出现负号。对 $\\sinh x = \\frac{e^{x} - e^{-x}}{2}$ 和 $\\cosh x = \\frac{e^{x} + e^{-x}}{2}$ 求导，得\n\n$$\\frac{d}{dx} \\sinh x = \\cosh x, \\qquad \\frac{d}{dx} \\cosh x = \\sinh x, \\qquad \\frac{d}{dx} \\tanh x = \\operatorname{sech}^{2}x.$$\n\n例如 $\\frac{d}{dx}\\left(3\\sinh x - 2\\cosh x\\right) = 3\\cosh x - 2\\sinh x$。\n\n检验：$\\frac{\\cosh 1.01 - \\cosh 1}{0.01} \\approx 1.183$，接近 $\\sinh 1 \\approx 1.175$。\n\n> **注意。** 与余弦不同，$\\cosh x$ 的导数**没有**负号。$\\tanh x$ 的导数是 $\\operatorname{sech}^{2}x$，不是 $\\sec^{2}x$。",
      ),
      generate(rng) {
        const rules = rng.sample(hyperbolicRules, 2);
        const g = applyRules(rules.map((r) => [rng.nonZero(-6, 6), r] as const));
        const a = rng.int(-3, 3);
        const f = sumLatex([g.f, poly([a, "e^{x}"])]);
        const answer = sumLatex([g.d, poly([a, "e^{x}"])]);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${f}$.`, `设 $f(x) = ${f}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [sumLatex([g.bad, poly([a, "e^{x}"])])],
          solution: walked(
            [
              [
                ["Differentiate the hyperbolic terms", "对双曲函数项求导"],
                t(
                  `By ${ruleLine(rules).en}, $${g.f}$ has derivative $${g.d}$.`,
                  `由 ${ruleLine(rules)["zh-CN"]}，$${g.f}$ 的导数是 $${g.d}$。`,
                ),
              ],
              [
                ["Add the exponential term", "加上指数项"],
                a === 0
                  ? t("There is no exponential term, so", "没有指数项，所以")
                  : t(`$\\frac{d}{dx} e^{x} = e^{x}$, so`, `$\\frac{d}{dx} e^{x} = e^{x}$，所以`),
                [`f'(x) = ${answer}`],
              ],
            ],
            slopeCheck((x) => g.at(x) + a * Math.exp(x), g.slope(1) + a * Math.E, 1),
          ),
        });
      },
    },
    {
      id: "evaluating-derivatives-of-hyperbolic-functions",
      title: t("Evaluating derivatives of hyperbolic functions", "计算双曲函数的导数值"),
      explanation: t(
        "Find the derivative first, then evaluate the hyperbolic functions at the point by substituting into their exponential definitions. At $x = 0$: $\\sinh 0 = 0$ and $\\cosh 0 = 1$. At $x = \\ln 2$, $e^{x} = 2$ and $e^{-x} = \\frac{1}{2}$, so $\\sinh(\\ln 2) = \\frac{3}{4}$ and $\\cosh(\\ln 2) = \\frac{5}{4}$. For example, $f(x) = 4\\sinh x$ has $f'(\\ln 2) = 4 \\cdot \\frac{5}{4} = 5$.\n\nCheck: the values satisfy $\\cosh^{2} - \\sinh^{2} = \\frac{25 - 9}{16} = 1$.\n\n> **Watch out.** $\\cosh 0 = 1$, not $0$. Substitute into the derivative: the derivative of $\\sinh$ is $\\cosh$, so it is $\\cosh(\\ln 2)$ that is needed.",
        "先求导，再把该点代入双曲函数的指数定义中求值。在 $x = 0$ 处：$\\sinh 0 = 0$，$\\cosh 0 = 1$。在 $x = \\ln 2$ 处 $e^{x} = 2$，$e^{-x} = \\frac{1}{2}$，所以 $\\sinh(\\ln 2) = \\frac{3}{4}$，$\\cosh(\\ln 2) = \\frac{5}{4}$。例如 $f(x) = 4\\sinh x$ 有 $f'(\\ln 2) = 4 \\cdot \\frac{5}{4} = 5$。\n\n检验：这两个值满足 $\\cosh^{2} - \\sinh^{2} = \\frac{25 - 9}{16} = 1$。\n\n> **注意。** $\\cosh 0 = 1$，不是 $0$。要代入导数：$\\sinh$ 的导数是 $\\cosh$，所以需要的是 $\\cosh(\\ln 2)$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-8, 8);
        const b = rng.nonZero(-8, 8);
        const atLn2 = rng.bool();
        const [x0, s, c, v] = atLn2 ? ["\\ln 2", Q.of(3, 4), Q.of(5, 4), Math.LN2] : ["0", Q.zero, Q.one, 0];
        const answer = Q.of(a).mul(c).add(Q.of(b).mul(s));
        const f = poly([a, "\\sinh x"], [b, "\\cosh x"]);
        return numberProblem({
          prompt: t(`Let $f(x) = ${f}$. Find $f'(${x0})$.`, `设 $f(x) = ${f}$。求 $f'(${x0})$。`),
          answer,
          wrong: [Q.of(a).mul(s).add(Q.of(b).mul(c)), Q.of(a).mul(c).sub(Q.of(b).mul(s)), Q.of(a + b)],
          solution: walked(
            [
              [
                ["Differentiate", "求导"],
                t("Since sinh and cosh are each other's derivatives,", "因为 sinh 和 cosh 互为导数，"),
                [`f'(x) = ${poly([a, "\\cosh x"], [b, "\\sinh x"])}`],
              ],
              [
                ["Substitute the point", "代入该点"],
                t(
                  `At $x = ${x0}$, $\\cosh x = ${c.toLatex()}$ and $\\sinh x = ${s.toLatex()}$, so`,
                  `在 $x = ${x0}$ 处 $\\cosh x = ${c.toLatex()}$，$\\sinh x = ${s.toLatex()}$，所以`,
                ),
                [`f'(${x0}) = ${a} \\cdot ${c.toLatex()} + ${par(b)} \\cdot ${s.toLatex()} = ${answer.toLatex()}`],
              ],
            ],
            slopeCheck(
              (x) => a * Math.sinh(x) + b * Math.cosh(x),
              answer.toNumber(),
              v,
              x0,
              "f",
              answer.isInteger() ? undefined : answer.toLatex(),
            ),
          ),
        });
      },
    },
  ],
};

/** reciprocalHyperbolicRules are the derivatives of sech, csch and coth. */
const reciprocalHyperbolicRules: readonly Rule[] = [
  {
    f: "\\operatorname{sech} x",
    d: [-1, "\\operatorname{sech} x\\tanh x"],
    bad: [1, "\\operatorname{sech} x\\tanh x"],
    at: (x) => 1 / Math.cosh(x),
    slope: (x) => -Math.tanh(x) / Math.cosh(x),
  },
  {
    f: "\\operatorname{csch} x",
    d: [-1, "\\operatorname{csch} x\\coth x"],
    bad: [1, "\\operatorname{csch} x\\coth x"],
    at: (x) => 1 / Math.sinh(x),
    slope: (x) => -Math.cosh(x) / Math.sinh(x) ** 2,
  },
  {
    f: "\\coth x",
    d: [-1, "\\operatorname{csch}^{2}x"],
    bad: [-1, "\\operatorname{sech}^{2}x"],
    at: (x) => 1 / Math.tanh(x),
    slope: (x) => -1 / Math.sinh(x) ** 2,
  },
];

/** differentiatingReciprocalHyperbolicFunctions differentiates sech, csch and coth. */
export const differentiatingReciprocalHyperbolicFunctions: TopicDef = {
  id: "differentiating-reciprocal-hyperbolic-functions",
  title: t("Differentiating Reciprocal Hyperbolic Functions", "倒数双曲函数求导"),
  summary: t("Differentiate sech, csch and coth.", "对 sech、csch、coth 求导。"),
  prerequisites: ["differentiating-hyperbolic-functions", "the-reciprocal-hyperbolic-functions"],
  encompasses: [
    { topic: "differentiating-hyperbolic-functions", weight: 0.4 },
    { topic: "the-reciprocal-hyperbolic-functions", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  intro: t(
    `The graph of $\\cosh x$ has its lowest point at $x = 0$, where its slope $\\sinh 0$ is $0$. Its reciprocal $\\operatorname{sech} x = \\frac{1}{\\cosh x}$ is largest there, so its slope at $0$ should also be $0$, and indeed the rule gives $-\\operatorname{sech} 0\\tanh 0 = -1 \\cdot 0 = 0$.

Check: $\\frac{\\operatorname{sech} 0.01 - \\operatorname{sech} 0}{0.01} \\approx -0.005$ and $\\frac{\\operatorname{sech}(-0.01) - \\operatorname{sech} 0}{-0.01} \\approx 0.005$, whose average is $0$.

In this lesson we differentiate sech, csch and coth, and sums of all six hyperbolic functions.`,
    `$\\cosh x$ 的图像在 $x = 0$ 处取最低点，那里的斜率 $\\sinh 0$ 为 $0$。它的倒数 $\\operatorname{sech} x = \\frac{1}{\\cosh x}$ 在那里取最大值，所以它在 $0$ 处的斜率也应为 $0$；求导法则确实给出 $-\\operatorname{sech} 0\\tanh 0 = -1 \\cdot 0 = 0$。

检验：$\\frac{\\operatorname{sech} 0.01 - \\operatorname{sech} 0}{0.01} \\approx -0.005$，$\\frac{\\operatorname{sech}(-0.01) - \\operatorname{sech} 0}{-0.01} \\approx 0.005$，平均值为 $0$。

这节课我们对 sech、csch、coth 求导，并对六个双曲函数的和式求导。`,
  ),
  knowledgePoints: [
    {
      id: "derivatives-of-sech-csch-and-coth",
      title: t("Derivatives of sech, csch and coth", "sech、csch、coth 的导数"),
      explanation: t(
        "These follow from the quotient rule applied to reciprocals, and their pattern resembles the derivatives of secant, cosecant and cotangent, with some signs changed. $$\\frac{d}{dx} \\operatorname{sech} x = -\\operatorname{sech} x\\tanh x, \\qquad \\frac{d}{dx} \\operatorname{csch} x = -\\operatorname{csch} x\\coth x, \\qquad \\frac{d}{dx} \\coth x = -\\operatorname{csch}^{2}x.$$\n\nFor example, $\\frac{d}{dx} 3\\operatorname{sech} x = -3\\operatorname{sech} x\\tanh x$.\n\nCheck: $\\frac{\\operatorname{sech} 1.01 - \\operatorname{sech} 1}{0.01} \\approx -0.493$, close to $-\\operatorname{sech} 1\\tanh 1 \\approx -0.494$.\n\n> **Watch out.** Compare $\\frac{d}{dx} \\sec x = \\sec x\\tan x$: the hyperbolic secant's derivative carries a minus sign. All three derivatives here are negative multiples.",
        "这些公式来自对倒数使用商法则，它们的形式与正割、余割和余切的导数相似，只是有些符号不同。$$\\frac{d}{dx} \\operatorname{sech} x = -\\operatorname{sech} x\\tanh x, \\qquad \\frac{d}{dx} \\operatorname{csch} x = -\\operatorname{csch} x\\coth x, \\qquad \\frac{d}{dx} \\coth x = -\\operatorname{csch}^{2}x.$$\n\n例如 $\\frac{d}{dx} 3\\operatorname{sech} x = -3\\operatorname{sech} x\\tanh x$。\n\n检验：$\\frac{\\operatorname{sech} 1.01 - \\operatorname{sech} 1}{0.01} \\approx -0.493$，接近 $-\\operatorname{sech} 1\\tanh 1 \\approx -0.494$。\n\n> **注意。** 对比 $\\frac{d}{dx} \\sec x = \\sec x\\tan x$：双曲正割的导数带负号。这里三个导数都带负号。",
      ),
      generate(rng) {
        const r = rng.pick(reciprocalHyperbolicRules);
        const k = rng.pick([1, 1, 2, 3, 4, 5, 6, 7, 8, 9, -1, -2, -3, -4, -5, -6]);
        const g = applyRules([[k, r]]);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${g.f}$.`, `设 $f(x) = ${g.f}$。求 $f'(x)$。`),
          answer: g.d,
          prefix: "f'(x) =",
          wrong: [g.bad, poly([-k, r.f])],
          solution: walked(
            [
              [
                ["Recall the rule", "回忆法则"],
                t(`The rule is $\\frac{d}{dx} ${r.f} = ${poly(r.d)}$.`, `求导法则是 $\\frac{d}{dx} ${r.f} = ${poly(r.d)}$。`),
              ],
              [["Keep the constant multiple", "保留常数倍"], t(`Multiply by $${k}$:`, `乘以 $${k}$：`), [`f'(x) = ${g.d}`]],
            ],
            slopeCheck(g.at, g.slope(1), 1),
          ),
        });
      },
    },
    {
      id: "sums-of-hyperbolic-functions",
      title: t("Sums of hyperbolic functions", "双曲函数之和"),
      explanation: t(
        "Just as with any other functions, a sum of hyperbolic functions is differentiated one term at a time, keeping the constant multiples. Differentiate a sum term by term with the rules for all six hyperbolic functions:\n\n$$\\frac{d}{dx}\\left(2\\cosh x - \\coth x\\right) = 2\\sinh x + \\operatorname{csch}^{2}x.$$\n\nCheck: at $x = 1$, $\\frac{f(1.01) - f(1)}{0.01} \\approx 3.081$, close to $2\\sinh 1 + \\operatorname{csch}^{2}1 \\approx 3.075$.\n\n> **Watch out.** Subtracting $\\coth x$ subtracts its derivative $-\\operatorname{csch}^{2}x$, and the two minus signs make a plus.",
        "与其他函数一样，双曲函数的和可以逐项求导，并保留常数倍数。用六个双曲函数的求导法则对和式逐项求导：\n\n$$\\frac{d}{dx}\\left(2\\cosh x - \\coth x\\right) = 2\\sinh x + \\operatorname{csch}^{2}x.$$\n\n检验：在 $x = 1$ 处，$\\frac{f(1.01) - f(1)}{0.01} \\approx 3.081$，接近 $2\\sinh 1 + \\operatorname{csch}^{2}1 \\approx 3.075$。\n\n> **注意。** 减去 $\\coth x$ 就是减去它的导数 $-\\operatorname{csch}^{2}x$，两个负号相乘得正号。",
      ),
      generate(rng) {
        const r1 = rng.pick(reciprocalHyperbolicRules);
        const r2 = rng.pick(hyperbolicRules);
        const terms = [
          [rng.nonZero(-5, 5), r2],
          [rng.nonZero(-5, 5), r1],
        ] as const;
        const g = applyRules(terms);
        const half = applyRules([terms[0], [terms[1][0], { ...r1, d: r1.bad }]]);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${g.f}$.`, `设 $f(x) = ${g.f}$。求 $f'(x)$。`),
          answer: g.d,
          prefix: "f'(x) =",
          wrong: [g.bad, half.d],
          solution: walked(
            [
              [["Differentiate each term", "逐项求导"], t(`Use ${ruleLine([r2, r1]).en}.`, `用到 ${ruleLine([r2, r1])["zh-CN"]}。`)],
              [["Keep the multiples and add", "保留倍数并相加"], t("With the constant multiples,", "带上常数倍，"), [`f'(x) = ${g.d}`]],
            ],
            slopeCheck(g.at, g.slope(1), 1),
          ),
        });
      },
    },
  ],
};

/** primes writes the derivative notation f', f'', f''' or f^{(n)}. */
const primes = (n: number, f = "f") => (n <= 3 ? `${f}${"'".repeat(n)}` : `${f}^{(${n})}`);

/** cycles are functions whose derivatives repeat, as signed LaTeX terms. */
const cycles: readonly (readonly (readonly [number, string])[])[] = [
  [
    [1, "\\sin x"],
    [1, "\\cos x"],
    [-1, "\\sin x"],
    [-1, "\\cos x"],
  ],
  [
    [1, "\\cos x"],
    [-1, "\\sin x"],
    [-1, "\\cos x"],
    [1, "\\sin x"],
  ],
  [
    [1, "\\sinh x"],
    [1, "\\cosh x"],
  ],
  [[1, "e^{x}"]],
];

/** cycleValues are the functions named in the cycles, as numbers. */
const cycleValues: Readonly<Record<string, (x: number) => number>> = {
  "\\sin x": Math.sin,
  "\\cos x": Math.cos,
  "\\sinh x": Math.sinh,
  "\\cosh x": Math.cosh,
  "e^{x}": Math.exp,
};

/** secondAndHigherOrderDerivatives differentiates repeatedly. */
export const secondAndHigherOrderDerivatives: TopicDef = {
  id: "second-and-higher-order-derivatives",
  title: t("Second and Higher-Order Derivatives", "二阶及高阶导数"),
  summary: t(
    "Differentiate repeatedly to find second and higher derivatives, including acceleration.",
    "反复求导得到二阶及更高阶导数，包括加速度。",
  ),
  prerequisites: ["differentiating-trigonometric-functions"],
  encompasses: [
    { topic: "the-sum-and-constant-multiple-rules-for-differentiation", weight: 0.4 },
    { topic: "differentiating-trigonometric-functions", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `A derivative is itself a function, so it can be differentiated again. With the rules for sine and cosine, $\\frac{d}{dx} \\sin x = \\cos x$, and differentiating once more gives $\\frac{d}{dx} \\cos x = -\\sin x$. So the second derivative of $\\sin x$ is $-\\sin x$.

Check: the second difference $\\frac{\\sin 1.01 - 2\\sin 1 + \\sin 0.99}{0.01^{2}} \\approx -0.841$, which matches $-\\sin 1 \\approx -0.841$.

In this lesson we find second and higher derivatives, spot derivatives that repeat, and read acceleration as a second derivative.`,
    `导数本身也是函数，所以可以再求导。由正弦和余弦的求导法则，$\\frac{d}{dx} \\sin x = \\cos x$，再求一次导得 $\\frac{d}{dx} \\cos x = -\\sin x$。所以 $\\sin x$ 的二阶导数是 $-\\sin x$。

检验：二阶差分 $\\frac{\\sin 1.01 - 2\\sin 1 + \\sin 0.99}{0.01^{2}} \\approx -0.841$，与 $-\\sin 1 \\approx -0.841$ 相符。

这节课我们求二阶及更高阶导数，找出循环出现的导数，并把加速度理解为二阶导数。`,
  ),
  knowledgePoints: [
    {
      id: "second-derivatives-of-polynomials",
      title: t("Second derivatives of polynomials", "多项式的二阶导数"),
      explanation: t(
        "Differentiating twice measures how the slope itself changes, and for a polynomial you simply apply the power rule a second time. The **second derivative** $f''$ is the derivative of $f'$, also written $\\frac{d^{2}y}{dx^{2}}$. For $f(x) = x^{4} - 3x^{2}$: $f'(x) = 4x^{3} - 6x$ and $f''(x) = 12x^{2} - 6$.\n\nCheck: at $x = 1$, $f''(1) = 6$, and the second difference $\\frac{f(1.01) - 2f(1) + f(0.99)}{0.01^{2}} \\approx 6.000$.\n\n> **Watch out.** $f''$ means differentiating twice, not squaring $f'$. Each differentiation lowers the degree by one, so a cubic has a linear second derivative.",
        "求两次导数衡量的是斜率本身怎样变化，对多项式只需再用一次幂法则。**二阶导数** $f''$ 是 $f'$ 的导数，也记作 $\\frac{d^{2}y}{dx^{2}}$。对 $f(x) = x^{4} - 3x^{2}$：$f'(x) = 4x^{3} - 6x$，$f''(x) = 12x^{2} - 6$。\n\n检验：在 $x = 1$ 处 $f''(1) = 6$，二阶差分 $\\frac{f(1.01) - 2f(1) + f(0.99)}{0.01^{2}} \\approx 6.000$。\n\n> **注意。** $f''$ 表示求两次导数，不是把 $f'$ 平方。每求一次导次数降低一，所以三次函数的二阶导数是一次函数。",
      ),
      generate(rng) {
        const deg = rng.int(3, 5);
        const p: number[] = range(0, deg).map((i) => (i === deg ? rng.nonZero(-4, 4) : rng.int(-7, 7)));
        const d1 = pDer(p);
        const d2 = pDer(d1);
        return functionProblem({
          prompt: t(`Find $f''(x)$ for $f(x) = ${pLatex(p)}$.`, `设 $f(x) = ${pLatex(p)}$。求 $f''(x)$。`),
          answer: pLatex(d2),
          prefix: "f''(x) =",
          wrong: [pLatex(d1), pLatex(d2.map((c, i) => c / (i + 2))), pLatex(pDer(d2))],
          solution: walked(
            [
              [["Differentiate once", "求一次导"], t("By the power rule,", "由幂法则，"), [`f'(x) = ${pLatex(d1)}`]],
              [
                ["Differentiate again", "再求一次导"],
                t("Apply the power rule to $f'$:", "对 $f'$ 再用幂法则："),
                [`f''(x) = ${pLatex(d2)}`],
              ],
            ],
            secondCheck((x) => pAt(p, x), pAt(d2, 1), 1),
          ),
        });
      },
    },
    {
      id: "higher-order-derivatives-that-repeat",
      title: t("Higher-order derivatives that repeat", "循环出现的高阶导数"),
      explanation: t(
        "Some derivatives repeat in a cycle. For sine:\n\n$$\\sin x \\to \\cos x \\to -\\sin x \\to -\\cos x \\to \\sin x,$$\n\nwith period $4$, so $f^{(n)}$ depends only on the remainder of $n$ divided by $4$. For example, $f(x) = \\sin x$ has $f^{(10)}(x) = -\\sin x$, since $10 = 4 \\cdot 2 + 2$. A polynomial of degree $n$ has $(n + 1)$th derivative $0$.\n\nCheck: each derivative of sine shifts it by a quarter turn, $f^{(n)}(x) = \\sin\\left(x + \\frac{n\\pi}{2}\\right)$, and $\\sin(x + 5\\pi) = -\\sin x$.\n\n> **Watch out.** Count from $f^{(0)} = f$. A remainder of $0$ brings you back to $f$ itself, not to $f'$. The cycle of $\\sinh x$ and $\\cosh x$ has period $2$, not $4$.",
        "有些导数会循环出现。对正弦：\n\n$$\\sin x \\to \\cos x \\to -\\sin x \\to -\\cos x \\to \\sin x,$$\n\n周期为 $4$，所以 $f^{(n)}$ 只取决于 $n$ 除以 $4$ 的余数。例如 $f(x) = \\sin x$ 有 $f^{(10)}(x) = -\\sin x$，因为 $10 = 4 \\cdot 2 + 2$。$n$ 次多项式的 $n + 1$ 阶导数为 $0$。\n\n检验：正弦每求一次导就平移四分之一周，$f^{(n)}(x) = \\sin\\left(x + \\frac{n\\pi}{2}\\right)$，而 $\\sin(x + 5\\pi) = -\\sin x$。\n\n> **注意。** 从 $f^{(0)} = f$ 开始数。余数为 $0$ 时回到 $f$ 本身，而不是 $f'$。$\\sinh x$ 与 $\\cosh x$ 的循环周期是 $2$，不是 $4$。",
      ),
      generate(rng) {
        const cycle = rng.pick(cycles);
        const n = rng.int(4, 30);
        const k = rng.pick([1, 1, 2, 3, -1, -2, 5]);
        const term = (i: number) => cycle[i % cycle.length]!;
        const at = (i: number) => {
          const [s, f] = term(i);
          return poly([k * s, f]);
        };
        const value = (i: number) => (x: number) => {
          const [s, f] = term(i);
          return k * s * cycleValues[f]!(x);
        };
        const answer = at(n);
        const wrong = [at(n + 1), at(n + 2), at(n + 3)].filter((w) => w !== answer);
        const q = quotientTable(value(n - 1), 1, "1", primes(n - 1));
        const goal = value(n)(1);
        return functionProblem({
          prompt: t(`Let $f(x) = ${at(0)}$. Find $${primes(n)}(x)$.`, `设 $f(x) = ${at(0)}$。求 $${primes(n)}(x)$。`),
          answer,
          prefix: `${primes(n)}(x) =`,
          wrong,
          solution: walked(
            [
              [
                ["Find the cycle", "找出循环"],
                cycle.length === 1
                  ? t(
                      "Every derivative of $e^{x}$ is $e^{x}$, so the cycle has length $1$.",
                      "$e^{x}$ 的每一阶导数都是 $e^{x}$，所以循环长度为 $1$。",
                    )
                  : t(
                      `The derivatives repeat every $${cycle.length}$ steps: ${range(0, cycle.length)
                        .map((i) => `$${at(i)}$`)
                        .join(", ")}.`,
                      `导数每 $${cycle.length}$ 次循环一次：${range(0, cycle.length)
                        .map((i) => `$${at(i)}$`)
                        .join("，")}。`,
                    ),
              ],
              [
                ["Use the remainder", "利用余数"],
                t(
                  `Since $${n} = ${cycle.length} \\cdot ${Math.floor(n / cycle.length)} + ${n % cycle.length}$, the $${n}$th derivative is the one in position $${n % cycle.length}$:`,
                  `因为 $${n} = ${cycle.length} \\cdot ${Math.floor(n / cycle.length)} + ${n % cycle.length}$，第 $${n}$ 阶导数就是位置 $${n % cycle.length}$ 上的那个：`,
                ),
                [`${primes(n)}(x) = ${answer}`],
              ],
            ],
            t(
              `The same count gives $${primes(n - 1)}(x) = ${at(n - 1)}$. Its difference quotients at $x = 1$ estimate $${primes(n)}(1)$:\n\n${q.table}\n\nTheir average is $${fmt(q.mean)}$, and the answer gives $${primes(n)}(1) ${approxTo(goal)}$.`,
              `同样地数，$${primes(n - 1)}(x) = ${at(n - 1)}$。它在 $x = 1$ 处的差商估计了 $${primes(n)}(1)$：\n\n${q.table}\n\n它们的平均值是 $${fmt(q.mean)}$，而答案给出 $${primes(n)}(1) ${approxTo(goal)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "acceleration-as-a-second-derivative",
      title: t("Acceleration as a second derivative", "加速度作为二阶导数"),
      explanation: t(
        "Velocity is the rate of change of position and acceleration is the rate of change of velocity, so differentiating position twice gives acceleration. For a position $s(t)$, the velocity is $v(t) = s'(t)$ and the **acceleration** is $a(t) = v'(t) = s''(t)$. For $s(t) = t^{3} - 6t^{2}$: $v(t) = 3t^{2} - 12t$ and $a(t) = 6t - 12$, so $a(3) = 6$ m/s².\n\nCheck: $\\frac{v(3.01) - v(3)}{0.01} = 6.03$, close to $6$.\n\n> **Watch out.** Acceleration is $s''$, not $s'$: one differentiation gives the velocity only. Substitute the time after differentiating twice.",
        "速度是位置的变化率，加速度是速度的变化率，所以对位置求两次导数就得到加速度。对位置函数 $s(t)$，速度为 $v(t) = s'(t)$，**加速度**为 $a(t) = v'(t) = s''(t)$。对 $s(t) = t^{3} - 6t^{2}$：$v(t) = 3t^{2} - 12t$，$a(t) = 6t - 12$，所以 $a(3) = 6$ m/s²。\n\n检验：$\\frac{v(3.01) - v(3)}{0.01} = 6.03$，接近 $6$。\n\n> **注意。** 加速度是 $s''$，不是 $s'$：求一次导只得到速度。求完两次导数后再代入时间。",
      ),
      generate(rng) {
        const p: Poly = [rng.int(0, 9), rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-2, 2)];
        const t0 = rng.int(0, 5);
        const d1 = pDer(p);
        const d2 = pDer(d1);
        const answer = pAt(d2, t0);
        return numberProblem({
          prompt: t(
            `A particle moves along a line so that its position at time $t$ seconds is $s(t) = ${pLatex(p, "t")}$ meters. Find its acceleration, in m/s², at $t = ${t0}$.`,
            `一个质点沿直线运动，$t$ 秒时的位置为 $s(t) = ${pLatex(p, "t")}$ 米。求它在 $t = ${t0}$ 时的加速度（单位 m/s²）。`,
          ),
          answer,
          wrong: [pAt(d1, t0), pAt(p, t0), pAt(pDer(d2), t0)],
          solution: walked(
            [
              [["Find the velocity", "求速度"], t("Differentiate the position:", "对位置求导："), [`v(t) = s'(t) = ${pLatex(d1, "t")}`]],
              [
                ["Find the acceleration", "求加速度"],
                t(`Differentiate again and substitute $t = ${t0}$:`, `再求一次导并代入 $t = ${t0}$：`),
                [`a(t) = s''(t) = ${pLatex(d2, "t")}`, `a(${t0}) = ${answer}`],
              ],
            ],
            secondCheck((x) => pAt(p, x), answer, t0, "s", "t"),
          ),
        });
      },
    },
  ],
};

/** Factor is a transcendental factor with its derivative as signed terms in LaTeX, and both as numbers. */
interface Factor {
  readonly f: string;
  readonly d: readonly [number, string];
  readonly at: (x: number) => number;
  readonly slope: (x: number) => number;
  readonly positive?: boolean;
}

/** factors are functions to multiply and divide by powers of x. */
const factors: readonly Factor[] = [
  { f: "e^{x}", d: [1, "e^{x}"], at: Math.exp, slope: Math.exp },
  { f: "\\sin x", d: [1, "\\cos x"], at: Math.sin, slope: Math.cos },
  { f: "\\cos x", d: [-1, "\\sin x"], at: Math.cos, slope: (x) => -Math.sin(x) },
  { f: "\\ln x", d: [1, "\\frac{1}{x}"], at: Math.log, slope: (x) => 1 / x, positive: true },
];

/** times writes the product of x^n and a function: "x^{2}\\sin x", "e^{x}", "x". */
const times = (n: number, f: string) => (f === "" ? power(n) || "1" : `${power(n)}${f}`);

/** pMul multiplies two polynomials given by their coefficients from the constant up. */
const pMul = (u: Poly, v: Poly): Poly => range(0, u.length + v.length - 2).map((k) => u.reduce((s, c, i) => s + c * (v[k - i] ?? 0), 0));

/** theProductRuleForDifferentiation differentiates products. */
export const theProductRuleForDifferentiation: TopicDef = {
  id: "the-product-rule-for-differentiation",
  title: t("The Product Rule for Differentiation", "求导的乘积法则"),
  summary: t("Differentiate products of functions with the product rule.", "用乘积法则对函数之积求导。"),
  prerequisites: ["differentiating-logarithmic-functions", "differentiating-trigonometric-functions"],
  encompasses: [
    { topic: "differentiating-exponential-functions", weight: 0.2 },
    { topic: "differentiating-logarithmic-functions", weight: 0.2 },
    { topic: "differentiating-trigonometric-functions", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `The power rule shows that the derivative of a product is not the product of the derivatives. Write $x^{5} = x^{2} \\cdot x^{3}$: the derivatives of the factors multiply to $2x \\cdot 3x^{2} = 6x^{3}$, but the power rule gives $5x^{4}$. Instead, each factor takes a turn being differentiated:

$$2x \\cdot x^{3} + x^{2} \\cdot 3x^{2} = 5x^{4}.$$

Check: $\\frac{1.01^{5} - 1}{0.01} \\approx 5.101$, close to $5 \\cdot 1^{4} = 5$.

In this lesson we differentiate products with the product rule, both as formulas and at a point.`,
    `幂法则说明，积的导数不是导数的积。写 $x^{5} = x^{2} \\cdot x^{3}$：两个因子的导数相乘得 $2x \\cdot 3x^{2} = 6x^{3}$，而幂法则给出 $5x^{4}$。正确的做法是让每个因子轮流被求导：

$$2x \\cdot x^{3} + x^{2} \\cdot 3x^{2} = 5x^{4}.$$

检验：$\\frac{1.01^{5} - 1}{0.01} \\approx 5.101$，接近 $5 \\cdot 1^{4} = 5$。

这节课我们用乘积法则对函数之积求导，既求导函数，也求某点处的导数值。`,
  ),
  knowledgePoints: [
    {
      id: "the-product-rule",
      title: t("The product rule", "乘积法则"),
      explanation: t(
        "**Product rule.** $(uv)' = u'v + uv'$. The derivative of a product is **not** the product of the derivatives. For $x^{2}e^{x}$, with $u = x^{2}$ and $v = e^{x}$:\n\n$$\\frac{d}{dx}\\left(x^{2}e^{x}\\right) = 2xe^{x} + x^{2}e^{x}.$$\n\nCheck: at $x = 1$ this is $3e \\approx 8.155$, and $\\frac{1.01^{2}e^{1.01} - e}{0.01} \\approx 8.251$.\n\n> **Watch out.** $u'v'$ is not the derivative: for $x^{2}e^{x}$ it would give $2xe^{x}$ and miss the term $x^{2}e^{x}$.",
        "**乘积法则** $(uv)' = u'v + uv'$。乘积的导数**不是**导数的乘积。对 $x^{2}e^{x}$，取 $u = x^{2}$，$v = e^{x}$：\n\n$$\\frac{d}{dx}\\left(x^{2}e^{x}\\right) = 2xe^{x} + x^{2}e^{x}.$$\n\n检验：在 $x = 1$ 处这等于 $3e \\approx 8.155$，而 $\\frac{1.01^{2}e^{1.01} - e}{0.01} \\approx 8.251$。\n\n> **注意。** $u'v'$ 不是导数：对 $x^{2}e^{x}$ 它会给出 $2xe^{x}$，漏掉 $x^{2}e^{x}$ 这一项。",
      ),
      generate(rng) {
        const v = rng.pick(factors);
        const n = rng.int(1, 5);
        const k = rng.pick([1, 1, 2, 3, 4, -1, -2, 5]);
        const f = poly([k, times(n, v.f)]);
        const first = poly([k * n, times(n - 1, v.f)]);
        const second = v.f === "\\ln x" ? poly([k, power(n - 1)]) : poly([k * v.d[0], times(n, v.d[1])]);
        const answer = sumLatex([first, second]);
        const both =
          v.f === "\\ln x" ? (n === 1 ? fracL(k, "x") : poly([k * n, power(n - 2)])) : poly([k * n * v.d[0], times(n - 1, v.d[1])]);
        return functionProblem({
          prompt: t(
            `Find $f'(x)$ for $f(x) = ${f}$${v.positive ? ", where $x > 0$" : ""}.`,
            `设 $f(x) = ${f}$${v.positive ? "，其中 $x > 0$" : ""}。求 $f'(x)$。`,
          ),
          answer,
          prefix: "f'(x) =",
          ...(v.positive && { positive: true }),
          wrong: [both, sumLatex([first, second.startsWith("-") ? second.slice(1) : `-${second}`]), first],
          solution: walked(
            [
              [
                ["Name the factors", "确定因子"],
                t(
                  `Take $u = ${poly([k, power(n)])}$ and $v = ${v.f}$. Then $u' = ${poly([k * n, power(n - 1)]) || "0"}$ and $v' = ${poly(v.d)}$.`,
                  `取 $u = ${poly([k, power(n)])}$，$v = ${v.f}$。则 $u' = ${poly([k * n, power(n - 1)]) || "0"}$，$v' = ${poly(v.d)}$。`,
                ),
              ],
              [
                ["Apply the product rule", "使用乘积法则"],
                t("Each factor takes a turn being differentiated:", "两个因子轮流被求导："),
                [`f'(x) = u'v + uv' = ${answer}`],
              ],
            ],
            slopeCheck((x) => k * x ** n * v.at(x), k * (n * v.at(1) + v.slope(1)), 1),
          ),
        });
      },
    },
    {
      id: "the-product-rule-at-a-point",
      title: t("The product rule at a point", "某点处的乘积法则"),
      explanation: t(
        "The derivative of a product is not the product of the derivatives; each factor takes a turn being differentiated while the other stays as it is. To find $(uv)'(a)$, evaluate $u(a)$, $u'(a)$, $v(a)$ and $v'(a)$, then combine: $(uv)'(a) = u'(a)v(a) + u(a)v'(a)$. There is no need to expand the product. For $f(x) = (x + 1)(x^{2} - 2)$ at $x = 1$: $u(1) = 2$, $u'(1) = 1$, $v(1) = -1$, $v'(1) = 2$, so $f'(1) = 1 \\cdot (-1) + 2 \\cdot 2 = 3$.\n\nCheck: expanding, $f(x) = x^{3} + x^{2} - 2x - 2$ and $f'(x) = 3x^{2} + 2x - 2$, so $f'(1) = 3$.\n\n> **Watch out.** $u'(a)v'(a)$ is not the answer; here it would give $1 \\cdot 2 = 2$. Both terms of the rule are needed, and they are added.",
        "积的导数不等于导数的积；两个因子轮流被求导，另一个保持不变。求 $(uv)'(a)$ 时，先求 $u(a)$、$u'(a)$、$v(a)$、$v'(a)$，再组合：$(uv)'(a) = u'(a)v(a) + u(a)v'(a)$。不必把乘积展开。对 $f(x) = (x + 1)(x^{2} - 2)$ 在 $x = 1$ 处：$u(1) = 2$，$u'(1) = 1$，$v(1) = -1$，$v'(1) = 2$，所以 $f'(1) = 1 \\cdot (-1) + 2 \\cdot 2 = 3$。\n\n检验：展开得 $f(x) = x^{3} + x^{2} - 2x - 2$，$f'(x) = 3x^{2} + 2x - 2$，所以 $f'(1) = 3$。\n\n> **注意。** $u'(a)v'(a)$ 不是答案，这里它会给出 $1 \\cdot 2 = 2$。法则的两项都需要，而且是相加。",
      ),
      generate(rng) {
        const u: Poly = [rng.int(-6, 6), rng.nonZero(-4, 4)];
        const v: Poly = [rng.int(-6, 6), rng.int(-3, 3), rng.nonZero(-3, 3)];
        const a = rng.int(-3, 3);
        const [ua, va, dua, dva] = [pAt(u, a), pAt(v, a), pAt(pDer(u), a), pAt(pDer(v), a)];
        const answer = dua * va + ua * dva;
        const uv = pMul(u, v);
        return numberProblem({
          prompt: t(
            `Let $f(x) = (${pLatex(u)})(${pLatex(v)})$. Find $f'(${a})$.`,
            `设 $f(x) = (${pLatex(u)})(${pLatex(v)})$。求 $f'(${a})$。`,
          ),
          answer,
          wrong: [dua * dva, ua * va, dua * va - ua * dva],
          solution: walked(
            [
              [
                ["Evaluate both factors and their derivatives", "求两个因子及其导数的值"],
                t(
                  `With $u = ${pLatex(u)}$ and $v = ${pLatex(v)}$: $u(${a}) = ${ua}$, $u'(${a}) = ${dua}$, $v(${a}) = ${va}$, $v'(${a}) = ${dva}$.`,
                  `取 $u = ${pLatex(u)}$，$v = ${pLatex(v)}$：$u(${a}) = ${ua}$，$u'(${a}) = ${dua}$，$v(${a}) = ${va}$，$v'(${a}) = ${dva}$。`,
                ),
              ],
              [
                ["Combine with the product rule", "用乘积法则组合"],
                t("By the product rule,", "由乘积法则，"),
                [`f'(${a}) = ${par(dua)} \\cdot ${par(va)} + ${par(ua)} \\cdot ${par(dva)}`, `= ${answer}`],
              ],
            ],
            t(
              `Expand the product first, and differentiate the polynomial:${steps(`f(x) = ${pLatex(uv)}`, `f'(x) = ${pLatex(pDer(uv))}`)}Substituting $x = ${a}$ gives $f'(${a}) = ${pAt(pDer(uv), a)}$, the same value.`,
              `先展开乘积，再对多项式求导：${steps(`f(x) = ${pLatex(uv)}`, `f'(x) = ${pLatex(pDer(uv))}`)}代入 $x = ${a}$ 得 $f'(${a}) = ${pAt(pDer(uv), a)}$，结果相同。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theQuotientRuleForDifferentiation differentiates quotients. */
export const theQuotientRuleForDifferentiation: TopicDef = {
  id: "the-quotient-rule-for-differentiation",
  title: t("The Quotient Rule for Differentiation", "求导的商法则"),
  summary: t("Differentiate quotients of functions with the quotient rule.", "用商法则对函数之商求导。"),
  prerequisites: ["the-product-rule-for-differentiation"],
  encompasses: [],
  xp: 12,
  standards: [],
  intro: t(
    `The product rule yields a rule for quotients. If $q = \\frac{u}{v}$, then $u = qv$, and the product rule gives $u' = q'v + qv'$. Solving for $q'$,

$$q' = \\frac{u' - qv'}{v} = \\frac{u'v - uv'}{v^{2}}.$$

For $\\frac{1}{x}$, with $u = 1$ and $v = x$, this gives $\\frac{0 \\cdot x - 1 \\cdot 1}{x^{2}} = -\\frac{1}{x^{2}}$.

Check: $\\frac{\\frac{1}{1.01} - 1}{0.01} \\approx -0.990$, close to $-1$.

In this lesson we differentiate quotients with the quotient rule, first of linear functions and then of other functions.`,
    `由乘积法则可以得到商的求导法则。若 $q = \\frac{u}{v}$，则 $u = qv$，由乘积法则 $u' = q'v + qv'$。解出 $q'$：

$$q' = \\frac{u' - qv'}{v} = \\frac{u'v - uv'}{v^{2}}.$$

对 $\\frac{1}{x}$，取 $u = 1$，$v = x$，得 $\\frac{0 \\cdot x - 1 \\cdot 1}{x^{2}} = -\\frac{1}{x^{2}}$。

检验：$\\frac{\\frac{1}{1.01} - 1}{0.01} \\approx -0.990$，接近 $-1$。

这节课我们用商法则对函数之商求导，先是一次函数之商，再是其他函数之商。`,
  ),
  knowledgePoints: [
    {
      id: "the-quotient-rule-for-rational-functions",
      title: t("The quotient rule for rational functions", "有理函数的商法则"),
      explanation: t(
        "In the quotient rule, the derivative of the top comes first in the numerator and the whole result is divided by the square of the bottom. **Quotient rule.**\n\n$$\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^{2}}.$$\n\nThe order in the numerator matters. For $\\frac{2x + 1}{x - 3}$:\n\n$$\\frac{2(x - 3) - (2x + 1)(1)}{(x - 3)^{2}} = \\frac{-7}{(x - 3)^{2}}.$$\n\nCheck: at $x = 4$ the rule gives $-7$, and $\\frac{f(4.01) - f(4)}{0.01} \\approx -6.931$.\n\n> **Watch out.** Swapping the order to $uv' - u'v$ flips the sign. The derivative is not $\\frac{u'}{v'}$, and the bottom is squared.",
        "在商法则中，分子里先写分子函数的导数，整个结果除以分母函数的平方。**商法则**\n\n$$\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^{2}}.$$\n\n分子中的顺序很重要。对 $\\frac{2x + 1}{x - 3}$：\n\n$$\\frac{2(x - 3) - (2x + 1)(1)}{(x - 3)^{2}} = \\frac{-7}{(x - 3)^{2}}.$$\n\n检验：在 $x = 4$ 处法则给出 $-7$，而 $\\frac{f(4.01) - f(4)}{0.01} \\approx -6.931$。\n\n> **注意。** 把顺序换成 $uv' - u'v$ 会使符号相反。导数不是 $\\frac{u'}{v'}$，而且分母要平方。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.int(-6, 6);
        const c = rng.pick([1, 1, 2, 3, -1]);
        const d = rng.pick(range(-6, 6).filter((x) => a * x - b * c !== 0));
        const num = poly([a, "x"], [b, ""]);
        const den = poly([c, "x"], [d, ""]);
        const sq = d === 0 ? (c === 1 ? "x^{2}" : `${c * c}x^{2}`) : `(${den})^{2}`;
        const det = a * d - b * c;
        const answer = fracL(det, sq);
        const x0 = [1, 2, 3, 0, -1, -2, -3].find((x) => Math.abs(c * x + d) >= 2) ?? 4;
        const slope = Q.of(det, (c * x0 + d) ** 2);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = \\frac{${num}}{${den}}$.`, `设 $f(x) = \\frac{${num}}{${den}}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [fracL(-det, sq), Q.of(a, c).toLatex(), fracL(det, d === 0 ? poly([c, "x"]) : den)],
          solution: walked(
            [
              [
                ["Name the parts", "确定各部分"],
                t(
                  `Take $u = ${num}$ and $v = ${den}$, so $u' = ${a}$ and $v' = ${c}$.`,
                  `取 $u = ${num}$，$v = ${den}$，则 $u' = ${a}$，$v' = ${c}$。`,
                ),
              ],
              [
                ["Apply the quotient rule", "使用商法则"],
                t(
                  "Put the parts into $\\frac{u'v - uv'}{v^{2}}$ and collect the numerator:",
                  "代入 $\\frac{u'v - uv'}{v^{2}}$ 并整理分子：",
                ),
                [`f'(x) = \\frac{${a}(${den}) - ${par(c)}(${num})}{${sq}}`, `= ${answer}`],
              ],
            ],
            slopeCheck(
              (x) => (a * x + b) / (c * x + d),
              slope.toNumber(),
              x0,
              String(x0),
              "f",
              slope.isInteger() ? undefined : slope.toLatex(),
            ),
          ),
        });
      },
    },
    {
      id: "the-quotient-rule-with-other-functions",
      title: t("The quotient rule with other functions", "含其他函数的商法则"),
      explanation: t(
        "The quotient rule works for any differentiable functions, and the result can often be simplified by cancelling a common factor from the top and bottom. For $\\frac{e^{x}}{x^{2}}$, after cancelling a factor $x$:\n\n$$\\frac{e^{x} \\cdot x^{2} - e^{x} \\cdot 2x}{x^{4}} = \\frac{xe^{x} - 2e^{x}}{x^{3}}.$$\n\nCheck: at $x = 1$ this is $-e \\approx -2.718$, and $\\frac{f(1.01) - f(1)}{0.01} \\approx -2.678$.\n\n> **Watch out.** Cancel a power of $x$ only when it divides every term of the numerator. The bottom of the rule is $v^{2}$, so for $v = x^{2}$ it is $x^{4}$.",
        "商法则适用于任意可导函数，结果常常可以通过约去分子和分母的公因式来化简。对 $\\frac{e^{x}}{x^{2}}$，约去一个因子 $x$ 后：\n\n$$\\frac{e^{x} \\cdot x^{2} - e^{x} \\cdot 2x}{x^{4}} = \\frac{xe^{x} - 2e^{x}}{x^{3}}.$$\n\n检验：在 $x = 1$ 处这等于 $-e \\approx -2.718$，而 $\\frac{f(1.01) - f(1)}{0.01} \\approx -2.678$。\n\n> **注意。** 只有当 $x$ 的幂能整除分子的每一项时才能约去。法则的分母是 $v^{2}$，所以 $v = x^{2}$ 时分母是 $x^{4}$。",
      ),
      generate(rng) {
        const g = rng.pick(factors);
        const n = rng.int(1, 3);
        const k = rng.pick([1, 1, 2, 3, 4, 5, -1, -2, -3]);
        const neg = (x: string) => (x.startsWith("-") ? x.slice(1) : `-${x}`);
        const top = poly([k, g.f]);
        const du = poly([k * g.d[0], g.d[1]]);
        const xd = g.f === "\\ln x" ? String(k) : poly([k * g.d[0], `x${g.d[1]}`]);
        const numerator = sumLatex([xd, poly([-k * n, g.f])]);
        const answer = `\\frac{${numerator}}{${power(n + 1)}}`;
        const quotient = `\\frac{${du} \\cdot ${power(n)} - ${k < 0 ? `(${top})` : top} \\cdot ${poly([n, power(n - 1)])}}{${power(2 * n)}}`;
        return functionProblem({
          prompt: t(
            `Find $f'(x)$ for $f(x) = \\frac{${top}}{${power(n)}}$${g.positive ? ", where $x > 0$" : ""}.`,
            `设 $f(x) = \\frac{${top}}{${power(n)}}$${g.positive ? "，其中 $x > 0$" : ""}。求 $f'(x)$。`,
          ),
          answer,
          prefix: "f'(x) =",
          ...(g.positive && { positive: true }),
          wrong: [
            `\\frac{${sumLatex([poly([k * n, g.f]), neg(xd)])}}{${power(n + 1)}}`,
            `\\frac{${du}}{${n === 1 ? "1" : poly([n, power(n - 1)])}}`,
          ],
          solution: walked(
            [
              [
                ["Apply the quotient rule", "使用商法则"],
                t(`With $u = ${top}$ and $v = ${power(n)}$,`, `取 $u = ${top}$，$v = ${power(n)}$，`),
                [`f'(x) = ${quotient}`],
              ],
              n === 1
                ? [
                    ["Simplify the numerator", "化简分子"],
                    t("Multiply out the numerator; there is no common power of $x$ to cancel:", "展开分子，没有可以约去的 $x$ 的幂："),
                    [`f'(x) = ${answer}`],
                  ]
                : [
                    ["Cancel the common power of x", "约去公共的 x 的幂"],
                    t(
                      `Every term of the numerator has a factor $${power(n - 1)}$; cancelling it leaves`,
                      `分子每一项都含因子 $${power(n - 1)}$，约去后得`,
                    ),
                    [`f'(x) = ${answer}`],
                  ],
            ],
            slopeCheck((x) => (k * g.at(x)) / x ** n, k * (g.slope(1) - n * g.at(1)), 1),
          ),
        });
      },
    },
  ],
};

/** reciprocalTrigRules are the derivatives of sec, csc and cot. */
const reciprocalTrigRules: readonly Rule[] = [
  {
    f: "\\sec x",
    d: [1, "\\sec x\\tan x"],
    bad: [-1, "\\sec x\\tan x"],
    at: (x) => 1 / Math.cos(x),
    slope: (x) => Math.sin(x) / Math.cos(x) ** 2,
  },
  {
    f: "\\csc x",
    d: [-1, "\\csc x\\cot x"],
    bad: [1, "\\csc x\\cot x"],
    at: (x) => 1 / Math.sin(x),
    slope: (x) => -Math.cos(x) / Math.sin(x) ** 2,
  },
  {
    f: "\\cot x",
    d: [-1, "\\csc^{2}x"],
    bad: [1, "\\csc^{2}x"],
    at: (x) => Math.cos(x) / Math.sin(x),
    slope: (x) => -1 / Math.sin(x) ** 2,
  },
];

/** differentiatingReciprocalTrigonometricFunctions differentiates sec, csc and cot. */
export const differentiatingReciprocalTrigonometricFunctions: TopicDef = {
  id: "differentiating-reciprocal-trigonometric-functions",
  title: t("Differentiating Reciprocal Trigonometric Functions", "倒数三角函数求导"),
  summary: t(
    "Differentiate secant, cosecant and cotangent, and quotients of trigonometric functions.",
    "对正割、余割、余切以及三角函数之商求导。",
  ),
  prerequisites: ["the-quotient-rule-for-differentiation"],
  encompasses: [
    { topic: "the-quotient-rule-for-differentiation", weight: 0.3 },
    { topic: "differentiating-trigonometric-functions", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `The quotient rule differentiates $\\sec x = \\frac{1}{\\cos x}$. With $u = 1$ and $v = \\cos x$,

$$\\frac{d}{dx} \\sec x = \\frac{0 \\cdot \\cos x - 1 \\cdot (-\\sin x)}{\\cos^{2}x} = \\frac{\\sin x}{\\cos^{2}x} = \\sec x\\tan x.$$

Check: $\\frac{\\sec 0.51 - \\sec 0.5}{0.01} \\approx 0.632$, close to $\\sec 0.5\\tan 0.5 \\approx 0.623$.

In this lesson we differentiate secant, cosecant and cotangent, and quotients of trigonometric functions.`,
    `用商法则对 $\\sec x = \\frac{1}{\\cos x}$ 求导。取 $u = 1$，$v = \\cos x$，

$$\\frac{d}{dx} \\sec x = \\frac{0 \\cdot \\cos x - 1 \\cdot (-\\sin x)}{\\cos^{2}x} = \\frac{\\sin x}{\\cos^{2}x} = \\sec x\\tan x.$$

检验：$\\frac{\\sec 0.51 - \\sec 0.5}{0.01} \\approx 0.632$，接近 $\\sec 0.5\\tan 0.5 \\approx 0.623$。

这节课我们对正割、余割、余切以及三角函数之商求导。`,
  ),
  knowledgePoints: [
    {
      id: "derivatives-of-secant-cosecant-and-cotangent",
      title: t("Derivatives of secant, cosecant and cotangent", "正割、余割、余切的导数"),
      explanation: t(
        'These derivatives come from writing each function as a quotient of sine and cosine. Applying the quotient rule to $\\frac{1}{\\cos x}$, $\\frac{1}{\\sin x}$ and $\\frac{\\cos x}{\\sin x}$ gives\n\n$$\\frac{d}{dx} \\sec x = \\sec x\\tan x, \\qquad \\frac{d}{dx} \\csc x = -\\csc x\\cot x, \\qquad \\frac{d}{dx} \\cot x = -\\csc^{2}x.$$\n\nFor example, $\\frac{d}{dx}\\left(2\\sec x - \\cot x\\right) = 2\\sec x\\tan x + \\csc^{2}x$.\n\nCheck: $\\frac{\\cot 0.51 - \\cot 0.5}{0.01} \\approx -4.273$, close to $-\\csc^{2}0.5 \\approx -4.351$.\n\n> **Watch out.** The functions whose names start with "co" have derivatives with a minus sign. The derivative of $\\sec x$ is $\\sec x\\tan x$, not $\\tan^{2}x$.',
        "把每个函数写成正弦与余弦之商就能得到这些导数。对 $\\frac{1}{\\cos x}$、$\\frac{1}{\\sin x}$、$\\frac{\\cos x}{\\sin x}$ 用商法则，得\n\n$$\\frac{d}{dx} \\sec x = \\sec x\\tan x, \\qquad \\frac{d}{dx} \\csc x = -\\csc x\\cot x, \\qquad \\frac{d}{dx} \\cot x = -\\csc^{2}x.$$\n\n例如 $\\frac{d}{dx}\\left(2\\sec x - \\cot x\\right) = 2\\sec x\\tan x + \\csc^{2}x$。\n\n检验：$\\frac{\\cot 0.51 - \\cot 0.5}{0.01} \\approx -4.273$，接近 $-\\csc^{2}0.5 \\approx -4.351$。\n\n> **注意。** 带“余”字的函数，导数带负号。$\\sec x$ 的导数是 $\\sec x\\tan x$，不是 $\\tan^{2}x$。",
      ),
      generate(rng) {
        const r1 = rng.pick(reciprocalTrigRules);
        const r2 = rng.pick(trigRules);
        const terms = [
          [rng.nonZero(-5, 5), r1],
          [rng.int(-5, 5), r2],
        ] as const;
        const kept = terms.filter(([k]) => k !== 0);
        const g = applyRules(kept);
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = ${g.f}$.`, `设 $f(x) = ${g.f}$。求 $f'(x)$。`),
          answer: g.d,
          prefix: "f'(x) =",
          wrong: [g.bad, applyRules(kept.map(([k, r]) => [k, r === r1 ? { ...r, d: r.bad } : r])).d],
          solution: walked(
            [
              [
                ["Recall the rules", "回忆法则"],
                t(`The terms need ${ruleLine(kept.map(([, r]) => r)).en}.`, `各项要用到 ${ruleLine(kept.map(([, r]) => r))["zh-CN"]}。`),
              ],
              [["Differentiate term by term", "逐项求导"], t("Keeping the constant multiples,", "保留常数倍，"), [`f'(x) = ${g.d}`]],
            ],
            slopeCheck(g.at, g.slope(0.5), 0.5),
          ),
        });
      },
    },
    {
      id: "quotients-of-trigonometric-functions",
      title: t("Quotients of trigonometric functions", "三角函数之商"),
      explanation: t(
        "After applying the quotient rule, look for the sum of squares of sine and cosine in the numerator, since replacing it by one usually simplifies the answer. Use the quotient rule, then simplify with $\\sin^{2}x + \\cos^{2}x = 1$. For $\\frac{2 + \\sin x}{\\cos x}$:\n\n$$\\frac{\\cos x \\cdot \\cos x - (2 + \\sin x)(-\\sin x)}{\\cos^{2}x} = \\frac{1 + 2\\sin x}{\\cos^{2}x}.$$\n\nCheck: at $x = 0$ this is $1$, and $\\frac{f(0.01) - f(0)}{0.01} \\approx 1.005$.\n\n> **Watch out.** The derivative of $\\cos x$ is $-\\sin x$, so subtracting $uv'$ turns into adding $u\\sin x$. Losing that sign gives the wrong numerator.",
        "使用商法则后，在分子中寻找正弦与余弦的平方和，把它换成 1 通常能化简答案。先用商法则，再用 $\\sin^{2}x + \\cos^{2}x = 1$ 化简。对 $\\frac{2 + \\sin x}{\\cos x}$：\n\n$$\\frac{\\cos x \\cdot \\cos x - (2 + \\sin x)(-\\sin x)}{\\cos^{2}x} = \\frac{1 + 2\\sin x}{\\cos^{2}x}.$$\n\n检验：在 $x = 0$ 处这等于 $1$，而 $\\frac{f(0.01) - f(0)}{0.01} \\approx 1.005$。\n\n> **注意。** $\\cos x$ 的导数是 $-\\sin x$，所以减去 $uv'$ 变成加上 $u\\sin x$。丢掉这个符号，分子就错了。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.pick([1, 1, 2, 3, -1, -2]);
        const overCos = rng.bool();
        const [top, bottom] = overCos ? ["\\sin x", "\\cos x"] : ["\\cos x", "\\sin x"];
        const [topAt, bottomAt] = overCos ? [Math.sin, Math.cos] : [Math.cos, Math.sin];
        const num = poly([a, ""], [b, top]);
        const sq = `${bottom.replace(" x", "")}^{2}x`;
        // (a + b sin x)/cos x has derivative (b + a sin x)/cos²x; (a + b cos x)/sin x has −(b + a cos x)/sin²x.
        const over = (c: number, d: number, sign: boolean) => `${sign ? "-" : ""}\\frac{${poly([c, ""], [d, top])}}{${sq}}`;
        const answer = over(b, a, !overCos);
        const slope = (x: number) => ((overCos ? 1 : -1) * (b + a * topAt(x))) / bottomAt(x) ** 2;
        const expanded = overCos
          ? `\\frac{${poly([b, "\\cos x"])} \\cdot \\cos x - (${num})(-\\sin x)}{\\cos^{2}x}`
          : `\\frac{${poly([-b, "\\sin x"])} \\cdot \\sin x - (${num})\\cos x}{\\sin^{2}x}`;
        return functionProblem({
          prompt: t(`Find $f'(x)$ for $f(x) = \\frac{${num}}{${bottom}}$.`, `设 $f(x) = \\frac{${num}}{${bottom}}$。求 $f'(x)$。`),
          answer,
          prefix: "f'(x) =",
          wrong: [over(b, a, overCos), over(b, -a, !overCos), over(a, b, !overCos)],
          solution: walked(
            [
              [
                ["Apply the quotient rule", "使用商法则"],
                t(`With $u = ${num}$ and $v = ${bottom}$,`, `取 $u = ${num}$，$v = ${bottom}$，`),
                [`f'(x) = ${expanded}`],
              ],
              [
                ["Simplify", "化简"],
                t(
                  `Expand the numerator; the terms $${Math.abs(b) === 1 ? "" : Math.abs(b)}\\sin^{2}x$ and $${Math.abs(b) === 1 ? "" : Math.abs(b)}\\cos^{2}x$ combine by $\\sin^{2}x + \\cos^{2}x = 1$:`,
                  `展开分子，$${Math.abs(b) === 1 ? "" : Math.abs(b)}\\sin^{2}x$ 与 $${Math.abs(b) === 1 ? "" : Math.abs(b)}\\cos^{2}x$ 由 $\\sin^{2}x + \\cos^{2}x = 1$ 合并：`,
                ),
                [`f'(x) = ${answer}`],
              ],
            ],
            slopeCheck((x) => (a + b * topAt(x)) / bottomAt(x), slope(0.5), 0.5),
          ),
        });
      },
    },
  ],
};

/** Combination is how h is built from f and g. */
type Combination = "product" | "quotient" | "sum";

/** lineLatex writes the line through (a, v) with slope s, as v + s(x − a). */
const lineLatex = (v: number, s: number, a: number) => poly([v, ""], [s, `(x - ${a})`]) || "0";

/** calculatingDerivativesFromDataAndTables uses tables of values. */
export const calculatingDerivativesFromDataAndTables: TopicDef = {
  id: "calculating-derivatives-from-data-and-tables",
  title: t("Calculating Derivatives From Data and Tables", "由数据和表格计算导数"),
  summary: t(
    "Use tables of function and derivative values with the differentiation rules, and estimate derivatives from data.",
    "利用函数值和导数值的表格及求导法则计算导数，并由数据估计导数。",
  ),
  prerequisites: ["the-quotient-rule-for-differentiation"],
  encompasses: [{ topic: "the-quotient-rule-for-differentiation", weight: 0.4 }],
  xp: 12,
  standards: [],
  intro: t(
    `The product and quotient rules use only the values of the functions and their derivatives at one point. Suppose all we know is $f(2) = 3$ and $f'(2) = -1$. For $h(x) = xf(x)$, the product rule gives

$$h'(2) = 1 \\cdot f(2) + 2f'(2) = 3 - 2 = 1.$$

Check: the function $f(x) = 5 - x$ has these values, and then $h(x) = 5x - x^{2}$ has $h'(x) = 5 - 2x$, so $h'(2) = 1$.

In this lesson we combine derivatives given in tables, and estimate derivatives from measured data.`,
    `乘积法则和商法则只用到函数及其导数在一点处的值。假设只知道 $f(2) = 3$，$f'(2) = -1$。对 $h(x) = xf(x)$，由乘积法则

$$h'(2) = 1 \\cdot f(2) + 2f'(2) = 3 - 2 = 1.$$

检验：函数 $f(x) = 5 - x$ 具有这些值，此时 $h(x) = 5x - x^{2}$，$h'(x) = 5 - 2x$，所以 $h'(2) = 1$。

这节课我们组合表格中给出的导数，并由测量数据估计导数。`,
  ),
  knowledgePoints: [
    {
      id: "combining-derivatives-from-a-table",
      title: t("Combining derivatives from a table", "由表格组合导数"),
      explanation: t(
        "You do not need formulas for the functions themselves: the rules only use the values of the functions and their derivatives at the one point. When only values of $f$, $f'$, $g$ and $g'$ are known, apply the rules at the point:\n\n$$(fg)'(a) = f'(a)g(a) + f(a)g'(a), \\qquad \\left(\\frac{f}{g}\\right)'(a) = \\frac{f'(a)g(a) - f(a)g'(a)}{g(a)^{2}}.$$\n\nFor example, with $f(2) = 3$, $f'(2) = 1$, $g(2) = -1$ and $g'(2) = 4$: $(fg)'(2) = 1 \\cdot (-1) + 3 \\cdot 4 = 11$.\n\nCheck: the lines $F(x) = 3 + (x - 2)$ and $G(x) = -1 + 4(x - 2)$ have the same values and slopes at $2$, and $\\frac{F(2.01)G(2.01) - F(2)G(2)}{0.01} = 11.04$.\n\n> **Watch out.** Use the row of the given point only. $(fg)'(a)$ is not $f'(a)g'(a)$, and in the quotient rule $g(a)$ is squared.",
        "不需要知道函数本身的公式：这些法则只用到函数及其导数在这一点处的值。当只知道 $f$、$f'$、$g$、$g'$ 的值时，在该点处应用求导法则：\n\n$$(fg)'(a) = f'(a)g(a) + f(a)g'(a), \\qquad \\left(\\frac{f}{g}\\right)'(a) = \\frac{f'(a)g(a) - f(a)g'(a)}{g(a)^{2}}.$$\n\n例如，已知 $f(2) = 3$，$f'(2) = 1$，$g(2) = -1$，$g'(2) = 4$：$(fg)'(2) = 1 \\cdot (-1) + 3 \\cdot 4 = 11$。\n\n检验：直线 $F(x) = 3 + (x - 2)$ 和 $G(x) = -1 + 4(x - 2)$ 在 $2$ 处有相同的值和斜率，而 $\\frac{F(2.01)G(2.01) - F(2)G(2)}{0.01} = 11.04$。\n\n> **注意。** 只用给定点那一行的数据。$(fg)'(a)$ 不是 $f'(a)g'(a)$；商法则中 $g(a)$ 要平方。",
      ),
      generate(rng) {
        const xs = [1, 2, 3];
        const nz = () => rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const rows = xs.map(() => [rng.int(-5, 5), rng.int(-5, 5), nz(), rng.int(-5, 5)] as const);
        const i = rng.int(0, 2);
        const [f, df, g, dg] = rows[i]!;
        const a = xs[i]!;
        const kind = rng.pick<Combination>(["product", "quotient", "sum"]);
        const k = rng.nonZero(-4, 4);
        const tab = table(
          ["$x$", "$f(x)$", "$f'(x)$", "$g(x)$", "$g'(x)$"],
          ...xs.map((x, j) => [`$${x}$`, ...rows[j]!.map((v) => `$${v}$`)]),
        );
        let h: string;
        let answer: Q;
        let wrong: Q[];
        let rule: Text;
        let work: string;
        let combine: (u: number, v: number) => number;
        if (kind === "product") {
          h = "f(x)g(x)";
          answer = Q.of(df * g + f * dg);
          wrong = [Q.of(df * dg), Q.of(df * g - f * dg), Q.of(f * g)];
          rule = t("By the product rule,", "由乘积法则，");
          work = `f'(${a})g(${a}) + f(${a})g'(${a}) = ${par(df)} \\cdot ${par(g)} + ${par(f)} \\cdot ${par(dg)}`;
          combine = (u, v) => u * v;
        } else if (kind === "quotient") {
          h = "\\frac{f(x)}{g(x)}";
          answer = Q.of(df * g - f * dg, g * g);
          wrong = [Q.of(f * dg - df * g, g * g), ...(dg === 0 ? [] : [Q.of(df, dg)]), Q.of(df * g - f * dg, g)];
          rule = t("By the quotient rule,", "由商法则，");
          work = `\\frac{f'(${a})g(${a}) - f(${a})g'(${a})}{g(${a})^{2}} = \\frac{${par(df)} \\cdot ${par(g)} - ${par(f)} \\cdot ${par(dg)}}{${par(g)}^{2}}`;
          combine = (u, v) => u / v;
        } else {
          h = poly([k, "f(x)"], [-x2(k), "g(x)"]);
          answer = Q.of(k * df - x2(k) * dg);
          wrong = [Q.of(k * f - x2(k) * g), Q.of(df - dg), Q.of(k * df + x2(k) * dg)];
          rule = t("By the sum and constant multiple rules,", "由和法则与常数倍法则，");
          work = `${k} \\cdot ${par(df)} - ${x2(k)} \\cdot ${par(dg)}`;
          combine = (u, v) => k * u - x2(k) * v;
        }
        const check = slopeCheck(
          (x) => combine(f + df * (x - a), g + dg * (x - a)),
          answer.toNumber(),
          a,
          String(a),
          "H",
          answer.isInteger() ? undefined : answer.toLatex(),
        );
        const [lineF, lineG] = [`$F(x) = ${lineLatex(f, df, a)}$`, `$G(x) = ${lineLatex(g, dg, a)}$`];
        return numberProblem({
          prompt: t(
            `The table gives values of $f$, $g$ and their derivatives.\n\n${tab}\n\nLet $h(x) = ${h}$. Find $h'(${a})$.`,
            `下表给出 $f$、$g$ 及其导数的值。\n\n${tab}\n\n设 $h(x) = ${h}$。求 $h'(${a})$。`,
          ),
          answer,
          wrong,
          solution: walked(
            [
              [
                ["Read the row", "读出这一行"],
                t(
                  `At $x = ${a}$ the table gives $f(${a}) = ${f}$, $f'(${a}) = ${df}$, $g(${a}) = ${g}$ and $g'(${a}) = ${dg}$.`,
                  `在 $x = ${a}$ 处，表格给出 $f(${a}) = ${f}$，$f'(${a}) = ${df}$，$g(${a}) = ${g}$，$g'(${a}) = ${dg}$。`,
                ),
              ],
              [["Apply the rule at the point", "在该点应用法则"], rule, [`h'(${a}) = ${work}`, `= ${answer.toLatex()}`]],
            ],
            t(
              `The lines ${lineF} and ${lineG} have the same values and slopes as $f$ and $g$ at $x = ${a}$, so the function $H$ built from them in the same way has $H'(${a}) = h'(${a})$. ${check.en}`,
              `直线 ${lineF} 和 ${lineG} 在 $x = ${a}$ 处与 $f$、$g$ 有相同的值和斜率，所以用它们以同样方式构造的函数 $H$ 满足 $H'(${a}) = h'(${a})$。${check["zh-CN"]}`,
            ),
          ),
        });
      },
    },
    {
      id: "estimating-a-derivative-from-data",
      title: t("Estimating a derivative from data", "由数据估计导数"),
      explanation: t(
        "From measured values, estimate $f'(a)$ by the slope between the nearest data points on either side of $a$:\n\n$$f'(a) \\approx \\frac{f(b) - f(c)}{b - c}, \\qquad c < a < b.$$\n\nFor example, if $T(2) = 40$, $T(3) = 44$ and $T(4) = 46$, then $T'(3) \\approx \\frac{46 - 40}{4 - 2} = 3$.\n\nCheck: the slopes on either side are $4$ and $2$, and their average is also $3$.\n\n> **Watch out.** Use the points on both sides of $a$, not $a$ and one neighbour. Divide by the difference of the times, $b - c$, not by $1$.",
        "由测量数据估计 $f'(a)$ 时，用 $a$ 两侧最近的两个数据点之间的斜率：\n\n$$f'(a) \\approx \\frac{f(b) - f(c)}{b - c}, \\qquad c < a < b.$$\n\n例如，若 $T(2) = 40$，$T(3) = 44$，$T(4) = 46$，则 $T'(3) \\approx \\frac{46 - 40}{4 - 2} = 3$。\n\n检验：两侧的斜率分别是 $4$ 和 $2$，它们的平均值也是 $3$。\n\n> **注意。** 要用 $a$ 两侧的点，而不是 $a$ 和一个相邻点。要除以时间差 $b - c$，而不是除以 $1$。",
      ),
      generate(rng) {
        const gaps = [rng.int(1, 3), rng.int(1, 3), rng.int(1, 3), rng.int(1, 3)];
        const ts = [0];
        for (const s of gaps) ts.push(ts[ts.length - 1]! + s);
        const temps = ts.map(() => 0);
        temps[0] = rng.int(20, 60);
        for (let j = 1; j < ts.length; j++) temps[j] = temps[j - 1]! + rng.int(-9, 9);
        const j = rng.int(1, 3);
        const [c, a, b] = [ts[j - 1]!, ts[j]!, ts[j + 1]!];
        const [fc, fa, fb] = [temps[j - 1]!, temps[j]!, temps[j + 1]!];
        const answer = Q.of(fb - fc, b - c);
        const [left, right] = [Q.of(fa - fc, a - c), Q.of(fb - fa, b - a)];
        const tab = table(["$t$ (min)", ...ts.map((x) => `$${x}$`)], ["$T(t)$ (°C)", ...temps.map((x) => `$${x}$`)]);
        const sides = table(
          ["", `$[${c}, ${a}]$`, `$[${a}, ${b}]$`],
          ["$\\frac{\\Delta T}{\\Delta t}$", `$${left.toLatex()}$`, `$${right.toLatex()}$`],
        );
        const weighted = `\\frac{${a - c} \\cdot ${par(left)} + ${b - a} \\cdot ${par(right)}}{${b - c}} = ${answer.toLatex()}`;
        return numberProblem({
          prompt: t(
            `The temperature $T$ of a liquid was measured at several times $t$.\n\n${tab}\n\nEstimate $T'(${a})$, in °C per minute, using the data points on either side of $t = ${a}$.`,
            `在若干时刻 $t$ 测量了某液体的温度 $T$。\n\n${tab}\n\n用 $t = ${a}$ 两侧的数据点估计 $T'(${a})$（单位：°C/分钟）。`,
          ),
          answer,
          wrong: [Q.of(fb - fa, b - a), Q.of(fa - fc, a - c), Q.of(fb - fc)].filter((w) => !w.eq(answer)),
          solution: walked(
            [
              [
                ["Pick the neighbours", "选取两侧的点"],
                t(
                  `The data points on either side of $t = ${a}$ are $t = ${c}$, with $T = ${fc}$, and $t = ${b}$, with $T = ${fb}$.`,
                  `$t = ${a}$ 两侧的数据点是 $t = ${c}$（$T = ${fc}$）和 $t = ${b}$（$T = ${fb}$）。`,
                ),
              ],
              [
                ["Take the slope between them", "求它们之间的斜率"],
                t("Rise over run:", "纵向变化量除以横向变化量："),
                [
                  `T'(${a}) \\approx \\frac{T(${b}) - T(${c})}{${b} - ${c}}`,
                  `= \\frac{${fb} - ${par(fc)}}{${b - c}} = ${answer.toLatex()}`,
                ],
              ],
            ],
            t(
              `Find the slopes on each side of $t = ${a}$ separately:\n\n${sides}\n\nWeighting each slope by the length of its interval gives the same estimate:${steps(weighted)}`,
              `分别求 $t = ${a}$ 两侧的斜率：\n\n${sides}\n\n按各区间的长度加权，得到同一个估计值：${steps(weighted)}`,
            ),
          ),
        });
      },
    },
  ],
};

/** x2 is the coefficient of g in a sum kf − x2(k)g: a second small number derived from k. */
function x2(k: number): number {
  return Math.abs(k) === 1 ? 2 : Math.abs(k) - 1;
}

/** Polyline is a piecewise linear graph through integer points at x = −6, −4, …, 6. */
type Polyline = readonly number[];

/** polyXs are the x-coordinates of a polyline's vertices. */
const polyXs = [-6, -4, -2, 0, 2, 4, 6];

/** polyline chooses a piecewise linear graph through integer points. */
function polyline(rng: Rng): Polyline {
  const ys = [rng.int(-4, 4)];
  for (let i = 1; i < polyXs.length; i++) {
    let y = ys[i - 1]! + rng.pick([-4, -3, -2, -1, 0, 1, 2, 3, 4]);
    if (y > 6 || y < -6) y = ys[i - 1]! - Math.sign(y) * 2;
    ys.push(y);
  }
  return ys;
}

/** polylineFigure draws a polyline. */
function polylineFigure(ys: Polyline): Figure {
  const marks: PlaneMark[] = ys.slice(1).map((y, i) => ({
    kind: "segment" as const,
    a: [polyXs[i]!, ys[i]!] as const,
    b: [polyXs[i + 1]!, y] as const,
    accent: true,
  }));
  return {
    svg: plane({ xMin: -7, xMax: 7, yMin: -7, yMax: 7 }, marks),
    alt: t(
      `A piecewise linear graph through ${ys.map((y, i) => `(${polyXs[i]}, ${y})`).join(", ")}.`,
      `经过 ${ys.map((y, i) => `(${polyXs[i]}, ${y})`).join("、")} 的折线图。`,
    ),
  };
}

/** onSegment picks an odd x inside a segment, with f and f' there. */
function onSegment(rng: Rng, ys: Polyline) {
  const i = rng.int(0, polyXs.length - 2);
  const x = polyXs[i]! + 1;
  const slope = Q.of(ys[i + 1]! - ys[i]!, 2);
  const value = Q.of(ys[i]! + ys[i + 1]!, 2);
  return { x, slope, value, from: [polyXs[i]!, ys[i]!] as const, to: [polyXs[i + 1]!, ys[i + 1]!] as const };
}

/** calculatingDerivativesFromGraphs reads derivatives from graphs. */
export const calculatingDerivativesFromGraphs: TopicDef = {
  id: "calculating-derivatives-from-graphs",
  title: t("Calculating Derivatives From Graphs", "由图像计算导数"),
  summary: t(
    "Read derivatives from graphs of piecewise linear functions and combine them with the differentiation rules.",
    "由折线函数的图像读出导数，并与求导法则结合使用。",
  ),
  prerequisites: ["calculating-derivatives-from-data-and-tables"],
  encompasses: [
    { topic: "calculating-derivatives-from-data-and-tables", weight: 0.4 },
    { topic: "slope-of-a-line", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `A graph holds the same information as a table of values: the height at $a$ is $f(a)$ and the slope of the tangent there is $f'(a)$. If the graph runs straight from $(0, 1)$ to $(2, 5)$, the tangent at $x = 1$ is that segment, so $f(1) = 3$ and $f'(1) = \\frac{5 - 1}{2 - 0} = 2$.

Check: on the segment $f(x) = 1 + 2x$, so $\\frac{f(1.01) - f(1)}{0.01} = \\frac{3.02 - 3}{0.01} = 2$.

In this lesson we read derivatives from piecewise linear graphs and combine them with the product rule.`,
    `图像与函数值表包含同样的信息：$a$ 处的高度是 $f(a)$，那里切线的斜率是 $f'(a)$。若图像从 $(0, 1)$ 到 $(2, 5)$ 是一条直线段，则 $x = 1$ 处的切线就是这条线段，所以 $f(1) = 3$，$f'(1) = \\frac{5 - 1}{2 - 0} = 2$。

检验：在这条线段上 $f(x) = 1 + 2x$，所以 $\\frac{f(1.01) - f(1)}{0.01} = \\frac{3.02 - 3}{0.01} = 2$。

这节课我们由折线图读出导数，并把它们与乘积法则结合使用。`,
  ),
  knowledgePoints: [
    {
      id: "derivatives-from-a-piecewise-linear-graph",
      figure: calculusDrawings2["calculating-derivatives-from-graphs#derivatives-from-a-piecewise-linear-graph"],
      title: t("Derivatives from a piecewise linear graph", "由折线图求导数"),
      explanation: t(
        "On a straight segment of a graph the tangent line is the segment itself, so $f'(a)$ is the slope of the segment containing $a$: rise over run between its endpoints. For example, on the segment from $(2, -1)$ to $(4, 5)$, $f'(3) = \\frac{5 - (-1)}{4 - 2} = 3$.\n\nCheck: the height at $x = 3$ is $2$, halfway between $-1$ and $5$, and each unit of $x$ raises the height by $3$.\n\n> **Watch out.** The derivative is the slope of the segment, not its height at $a$. At a corner, where two segments meet, the derivative does not exist.",
        "在图像的直线段上，切线就是这条线段本身，所以 $f'(a)$ 等于包含 $a$ 的那条线段的斜率：两端点间的纵向变化量除以横向变化量。例如在从 $(2, -1)$ 到 $(4, 5)$ 的线段上，$f'(3) = \\frac{5 - (-1)}{4 - 2} = 3$。\n\n检验：$x = 3$ 处的高度是 $2$，正好在 $-1$ 与 $5$ 之间的一半，而 $x$ 每增加一个单位，高度增加 $3$。\n\n> **注意。** 导数是线段的斜率，不是线段在 $a$ 处的高度。在两条线段相接的拐角处，导数不存在。",
      ),
      generate(rng) {
        const ys = polyline(rng);
        const s = onSegment(rng, ys);
        const heights = table(
          ["$x$", `$${s.from[0]}$`, `$${s.x}$`, `$${s.to[0]}$`],
          ["$f(x)$", `$${s.from[1]}$`, `$${s.value.toLatex()}$`, `$${s.to[1]}$`],
        );
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $y = f(x)$ is made of line segments. Find $f'(${s.x})$.`,
              `$y = f(x)$ 的图像由若干线段组成。求 $f'(${s.x})$。`,
            ),
            answer: s.slope,
            wrong: [s.value, s.slope.neg(), Q.of(s.to[1] - s.from[1])],
            solution: walked(
              [
                [
                  ["Find the segment", "找到线段"],
                  t(
                    `$x = ${s.x}$ lies on the segment from $(${s.from[0]}, ${s.from[1]})$ to $(${s.to[0]}, ${s.to[1]})$, and the tangent there is the segment itself.`,
                    `$x = ${s.x}$ 位于从 $(${s.from[0]}, ${s.from[1]})$ 到 $(${s.to[0]}, ${s.to[1]})$ 的线段上，那里的切线就是这条线段。`,
                  ),
                ],
                [
                  ["Take its slope", "求它的斜率"],
                  t("Rise over run:", "纵向变化量除以横向变化量："),
                  [`f'(${s.x}) = \\frac{${s.to[1]} - ${par(s.from[1])}}{${s.to[0]} - ${par(s.from[0])}} = ${s.slope.toLatex()}`],
                ],
              ],
              t(
                `Read three heights on the segment:\n\n${heights}\n\nEach unit step in $x$ changes the height by $${s.value.sub(Q.of(s.from[1])).toLatex()}$, the same slope $${s.slope.toLatex()}$.`,
                `读出线段上的三个高度：\n\n${heights}\n\n$x$ 每增加一个单位，高度变化 $${s.value.sub(Q.of(s.from[1])).toLatex()}$，正是斜率 $${s.slope.toLatex()}$。`,
              ),
            ),
          }),
          figure: polylineFigure(ys),
        };
      },
    },
    {
      id: "derivatives-of-products-from-a-graph",
      figure: calculusDrawings2["calculating-derivatives-from-graphs#derivatives-of-products-from-a-graph"],
      title: t("Derivatives of products from a graph", "由图像求乘积的导数"),
      explanation: t(
        "A graph gives the value of a function by its height and the derivative by the slope of the tangent, which is often read from a straight segment. Read $f(a)$ and $f'(a)$ from the graph, then apply the rules. For $h(x) = x^{2}f(x)$:\n\n$$h'(a) = 2af(a) + a^{2}f'(a).$$\n\nFor example, if $f(1) = 2$ and $f'(1) = 3$, then $h'(1) = 2 \\cdot 2 + 1 \\cdot 3 = 7$.\n\nCheck: near $x = 1$ take $f(x) = 2 + 3(x - 1)$; then $\\frac{h(1.01) - h(1)}{0.01} \\approx 7.080$.\n\n> **Watch out.** $f(a)$ is a height and $f'(a)$ is a slope; do not swap them. The product rule needs both terms.",
        "图像以高度给出函数值，以切线的斜率给出导数，后者常可以从一段直线读出。从图像读出 $f(a)$ 和 $f'(a)$，再应用求导法则。对 $h(x) = x^{2}f(x)$：\n\n$$h'(a) = 2af(a) + a^{2}f'(a).$$\n\n例如，若 $f(1) = 2$，$f'(1) = 3$，则 $h'(1) = 2 \\cdot 2 + 1 \\cdot 3 = 7$。\n\n检验：在 $x = 1$ 附近取 $f(x) = 2 + 3(x - 1)$，则 $\\frac{h(1.01) - h(1)}{0.01} \\approx 7.080$。\n\n> **注意。** $f(a)$ 是高度，$f'(a)$ 是斜率，不要弄反。乘积法则的两项都需要。",
      ),
      generate(rng) {
        const ys = polyline(rng);
        const s = onSegment(rng, ys);
        const a = s.x;
        const n = rng.pick([1, 2]);
        const xa = Q.of(a ** n);
        const dxa = Q.of(n * a ** (n - 1));
        const answer = dxa.mul(s.value).add(xa.mul(s.slope));
        const [v, m] = [s.value.toNumber(), s.slope.toNumber()];
        const run = s.from[0] === 0 ? "x" : `(x ${s.from[0] < 0 ? "+" : "-"} ${Math.abs(s.from[0])})`;
        const segment = s.slope.isZero()
          ? `f(x) = ${s.from[1]}`
          : `f(x) = ${s.from[1]} ${s.slope.sign() < 0 ? "-" : "+"} ${s.slope.abs().eq(Q.one) ? "" : s.slope.abs().toLatex()}${run}`;
        const check = slopeCheck(
          (x) => x ** n * (v + m * (x - a)),
          answer.toNumber(),
          a,
          String(a),
          "H",
          answer.isInteger() ? undefined : answer.toLatex(),
        );
        return {
          ...numberProblem({
            prompt: t(
              `The graph of $y = f(x)$ is made of line segments. Let $h(x) = ${power(n)}f(x)$. Find $h'(${a})$.`,
              `$y = f(x)$ 的图像由若干线段组成。设 $h(x) = ${power(n)}f(x)$。求 $h'(${a})$。`,
            ),
            answer,
            wrong: [dxa.mul(s.slope), xa.mul(s.slope), dxa.mul(s.value).sub(xa.mul(s.slope))],
            solution: walked(
              [
                [
                  ["Read the graph", "读图"],
                  t(
                    `$x = ${a}$ is the middle of the segment from $(${s.from[0]}, ${s.from[1]})$ to $(${s.to[0]}, ${s.to[1]})$, so $f(${a}) = ${s.value.toLatex()}$ and $f'(${a}) = ${s.slope.toLatex()}$.`,
                    `$x = ${a}$ 是从 $(${s.from[0]}, ${s.from[1]})$ 到 $(${s.to[0]}, ${s.to[1]})$ 的线段的中点，所以 $f(${a}) = ${s.value.toLatex()}$，$f'(${a}) = ${s.slope.toLatex()}$。`,
                  ),
                ],
                [
                  ["Apply the product rule", "使用乘积法则"],
                  t(
                    `$h'(x) = ${n === 1 ? "f(x)" : "2xf(x)"} + ${power(n)}f'(x)$, so`,
                    `$h'(x) = ${n === 1 ? "f(x)" : "2xf(x)"} + ${power(n)}f'(x)$，所以`,
                  ),
                  [`h'(${a}) = ${dxa.toLatex()} \\cdot ${par(s.value)} + ${par(xa)} \\cdot ${par(s.slope)}`, `= ${answer.toLatex()}`],
                ],
              ],
              t(
                `On this segment $${segment}$, so near $x = ${a}$ the function $H(x) = ${power(n)}f(x)$ can be computed, with $H'(${a}) = h'(${a})$. ${check.en}`,
                `在这条线段上 $${segment}$，所以在 $x = ${a}$ 附近可以计算函数 $H(x) = ${power(n)}f(x)$，且 $H'(${a}) = h'(${a})$。${check["zh-CN"]}`,
              ),
            ),
          }),
          figure: polylineFigure(ys),
        };
      },
    },
  ],
};

/** LimitDerivative is a limit that is the derivative of a function at a point, with its difference quotient as a number. */
interface LimitDerivative {
  readonly f: Text;
  readonly limit: string;
  readonly value: string;
  readonly wrong: readonly string[];
  /** h tells whether the limit is in h, as h → 0, or in x, as x → a. */
  readonly h: boolean;
  /** a is the point, as a number and in LaTeX. */
  readonly a: number;
  readonly aLatex: string;
  /** quotient is the expression inside the limit at a value of h or x. */
  readonly quotient: (v: number) => number;
  /** approx is the value of the limit as a number. */
  readonly approx: number;
}

/** limitDerivative chooses a function and a point and writes the difference quotient. */
function limitDerivative(rng: Rng): LimitDerivative {
  const kind = rng.int(0, 4);
  if (kind === 0) {
    const a = rng.int(1, 4);
    return {
      f: t(`$f(x) = e^{x}$ at $a = ${a}$`, `$f(x) = e^{x}$，$a = ${a}$`),
      limit: `${lim(0, undefined, "h")} \\frac{e^{${a} + h} - e^{${a}}}{h}`,
      value: `e^{${a}}`,
      wrong: ["1", "0", a === 1 ? "e^{0}" : a === 2 ? "2e" : `${a}e^{${a - 1}}`],
      h: true,
      a,
      aLatex: String(a),
      quotient: (h) => (Math.exp(a + h) - Math.exp(a)) / h,
      approx: Math.exp(a),
    };
  }
  if (kind === 1) {
    const [x0, sin, cos, v] = rng.pick([
      ["\\frac{\\pi}{6}", "\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}", Math.PI / 6],
      ["\\frac{\\pi}{3}", "\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}", Math.PI / 3],
      ["\\frac{\\pi}{4}", "\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{2}}{2}", Math.PI / 4],
      ["\\pi", "0", "-1", Math.PI],
    ] as const);
    const cosine = rng.bool();
    const fn = cosine ? Math.cos : Math.sin;
    return {
      f: t(`$f(x) = ${cosine ? "\\cos" : "\\sin"} x$ at $a = ${x0}$`, `$f(x) = ${cosine ? "\\cos" : "\\sin"} x$，$a = ${x0}$`),
      limit: `${lim(0, undefined, "h")} \\frac{${cosine ? "\\cos" : "\\sin"}\\left(${x0} + h\\right) - ${cosine ? "\\cos" : "\\sin"}${x0}}{h}`,
      value: cosine ? (sin === "0" ? "0" : `-${sin}`) : cos,
      wrong: cosine ? [cos, sin] : [sin, cos === "-1" ? "1" : `-${cos}`],
      h: true,
      a: v,
      aLatex: x0,
      quotient: (h) => (fn(v + h) - fn(v)) / h,
      approx: cosine ? -Math.sin(v) : Math.cos(v),
    };
  }
  if (kind === 2) {
    const a = rng.int(2, 9);
    return {
      f: t(`$f(x) = \\ln x$ at $a = ${a}$`, `$f(x) = \\ln x$，$a = ${a}$`),
      limit: `${lim(0, undefined, "h")} \\frac{\\ln(${a} + h) - \\ln ${a}}{h}`,
      value: `\\frac{1}{${a}}`,
      wrong: [`\\ln ${a}`, String(a), "1"],
      h: true,
      a,
      aLatex: String(a),
      quotient: (h) => (Math.log(a + h) - Math.log(a)) / h,
      approx: 1 / a,
    };
  }
  if (kind === 3) {
    const n = rng.int(2, 6);
    return {
      f: t(`$f(x) = \\sqrt{x}$ at $a = ${n * n}$`, `$f(x) = \\sqrt{x}$，$a = ${n * n}$`),
      limit: `${lim(n * n)} \\frac{\\sqrt{x} - ${n}}{x - ${n * n}}`,
      value: `\\frac{1}{${2 * n}}`,
      wrong: [String(n), `\\frac{1}{${n}}`, `${2 * n}`],
      h: false,
      a: n * n,
      aLatex: String(n * n),
      quotient: (x) => (Math.sqrt(x) - n) / (x - n * n),
      approx: 1 / (2 * n),
    };
  }
  const a = rng.pick([2, 3, 4, 5]);
  return {
    f: t(`$f(x) = \\frac{1}{x}$ at $a = ${a}$`, `$f(x) = \\frac{1}{x}$，$a = ${a}$`),
    limit: `${lim(a)} \\frac{\\frac{1}{x} - \\frac{1}{${a}}}{x - ${a}}`,
    value: `-\\frac{1}{${a * a}}`,
    wrong: [`\\frac{1}{${a * a}}`, `\\frac{1}{${a}}`, `-\\frac{1}{${a}}`],
    h: false,
    a,
    aLatex: String(a),
    quotient: (x) => (1 / x - 1 / a) / (x - a),
    approx: -1 / (a * a),
  };
}

/** limitCheck evaluates the quotient inside a limit close to its point and compares it with the value of the limit. */
function limitCheck(h: boolean, a: number, quotient: (v: number) => number, approx: number, value: string): Text {
  const at = h ? [0.01, -0.01] : [a + 0.01, a - 0.01];
  const tab = table([h ? "$h$" : "$x$", ...at.map((v) => `$${fmt(v)}$`)], ["$q$", ...at.map((v) => `$${fmt(quotient(v))}$`)]);
  const exact = Math.abs(approx - Math.round(approx)) < 1e-9;
  const close = exact ? `$${value}$` : `$${value} \\approx ${fmt(approx)}$`;
  return t(
    `Write $q$ for the quotient inside the limit, and evaluate it with ${h ? "$h$" : "$x$"} close to ${h ? "$0$" : `$${fmt(a)}$`} on each side:\n\n${tab}\n\nBoth values are close to ${close}.`,
    `把极限里的商记为 $q$，在 ${h ? "$0$" : `$${fmt(a)}$`} 两侧取接近的 ${h ? "$h$" : "$x$"} 计算它：\n\n${tab}\n\n两个值都接近 ${close}。`,
  );
}

/** recognizingDerivativesInLimits evaluates limits that are derivatives. */
export const recognizingDerivativesInLimits: TopicDef = {
  id: "recognizing-derivatives-in-limits",
  title: t("Recognizing Derivatives in Limits", "识别极限中的导数"),
  summary: t(
    "Recognize a limit as the derivative of a function at a point, and evaluate it by differentiating.",
    "把极限识别为某函数在某点处的导数，并通过求导计算极限。",
  ),
  prerequisites: ["differentiating-logarithmic-functions", "differentiating-trigonometric-functions"],
  encompasses: [
    { topic: "defining-the-derivative-using-derivative-notation", weight: 0.4 },
    { topic: "differentiating-trigonometric-functions", weight: 0.1 },
  ],
  xp: 12,
  standards: [],
  intro: t(
    `The rules turn some hard limits into easy ones. The limit $\\lim_{h \\to 0} \\frac{e^{h} - 1}{h}$ is $\\frac{e^{0 + h} - e^{0}}{h}$ as $h \\to 0$, the definition of the derivative of $e^{x}$ at $0$. Since $\\frac{d}{dx} e^{x} = e^{x}$, the limit is $e^{0} = 1$.

Check: at $h = 0.01$ the quotient is $\\frac{e^{0.01} - 1}{0.01} \\approx 1.005$, close to $1$.

In this lesson we recognize limits as derivatives, name the function and the point, and evaluate them by differentiating.`,
    `求导法则能把一些难算的极限变得简单。极限 $\\lim_{h \\to 0} \\frac{e^{h} - 1}{h}$ 就是 $h \\to 0$ 时的 $\\frac{e^{0 + h} - e^{0}}{h}$，即 $e^{x}$ 在 $0$ 处导数的定义。因为 $\\frac{d}{dx} e^{x} = e^{x}$，极限为 $e^{0} = 1$。

检验：在 $h = 0.01$ 处，商 $\\frac{e^{0.01} - 1}{0.01} \\approx 1.005$，接近 $1$。

这节课我们把极限识别为导数，指出其中的函数与点，并通过求导计算极限。`,
  ),
  knowledgePoints: [
    {
      id: "limits-that-are-derivatives-of-powers",
      title: t("Limits that are derivatives of powers", "幂函数导数形式的极限"),
      explanation: t(
        "Recognizing a limit as the definition of a derivative lets you evaluate it with the derivative rules instead of algebra. Both\n\n$$\\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h} \\quad\\text{and}\\quad \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}$$\n\nequal $f'(a)$. So $\\lim_{h \\to 0} \\frac{(2 + h)^{5} - 32}{h}$ is the derivative of $x^{5}$ at $2$: $5 \\cdot 2^{4} = 80$, with no expanding needed.\n\nCheck: at $h = 0.01$ the quotient is $\\frac{2.01^{5} - 32}{0.01} \\approx 80.804$, close to $80$.\n\n> **Watch out.** The number subtracted must be $f(a)$: here $32 = 2^{5}$. The answer is $f'(a)$, not $f(a)$.",
        "认出一个极限就是导数的定义后，就可以用求导法则而不是代数运算来计算它。下面两个极限\n\n$$\\lim_{h \\to 0} \\frac{f(a + h) - f(a)}{h} \\quad\\text{和}\\quad \\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a}$$\n\n都等于 $f'(a)$。所以 $\\lim_{h \\to 0} \\frac{(2 + h)^{5} - 32}{h}$ 就是 $x^{5}$ 在 $2$ 处的导数：$5 \\cdot 2^{4} = 80$，不必展开。\n\n检验：在 $h = 0.01$ 处，商 $\\frac{2.01^{5} - 32}{0.01} \\approx 80.804$，接近 $80$。\n\n> **注意。** 减去的数必须是 $f(a)$：这里 $32 = 2^{5}$。答案是 $f'(a)$，不是 $f(a)$。",
      ),
      generate(rng) {
        const n = rng.int(3, 8);
        const a = rng.pick(n <= 5 ? [-3, -2, -1, 1, 2, 3] : [-2, -1, 1, 2]);
        const an = a ** n;
        const answer = n * a ** (n - 1);
        const hForm = rng.bool();
        const limit = hForm
          ? `${lim(0, undefined, "h")} \\frac{(${a} + h)^{${n}} ${an < 0 ? "+" : "-"} ${Math.abs(an)}}{h}`
          : `${lim(a)} \\frac{x^{${n}} ${an < 0 ? "+" : "-"} ${Math.abs(an)}}{x ${a < 0 ? "+" : "-"} ${Math.abs(a)}}`;
        const quotient = hForm ? (h: number) => ((a + h) ** n - an) / h : (x: number) => (x ** n - an) / (x - a);
        return numberProblem({
          prompt: t(`Evaluate $${limit}$.`, `求 $${limit}$。`),
          answer,
          wrong: [an, n * an, 0, (n - 1) * a ** n],
          solution: walked(
            [
              [
                ["Match the definition", "对照定义"],
                t(
                  `Since $${an} = ${par(a)}^{${n}}$, this is the definition of $f'(${a})$ for $f(x) = x^{${n}}$.`,
                  `因为 $${an} = ${par(a)}^{${n}}$，这正是 $f(x) = x^{${n}}$ 在 $${a}$ 处导数 $f'(${a})$ 的定义。`,
                ),
              ],
              [
                ["Differentiate and substitute", "求导并代入"],
                t(`By the power rule $f'(x) = ${n}x^{${n - 1}}$, so the limit is`, `由幂法则 $f'(x) = ${n}x^{${n - 1}}$，所以极限为`),
                [`${n} \\cdot ${par(a)}^{${n - 1}} = ${answer}`],
              ],
            ],
            limitCheck(hForm, a, quotient, answer, String(answer)),
          ),
        });
      },
    },
    {
      id: "identifying-the-function-and-the-point",
      title: t("Identifying the function and the point", "识别函数与点"),
      explanation: t(
        "To evaluate a limit of a difference quotient, match it to $\\frac{f(a + h) - f(a)}{h}$ or $\\frac{f(x) - f(a)}{x - a}$ to find $f$ and $a$, then compute $f'(a)$. For example, $\\lim_{h \\to 0} \\frac{\\ln(3 + h) - \\ln 3}{h}$ is $f'(3)$ for $f(x) = \\ln x$, which is $\\frac{1}{3}$.\n\nCheck: at $h = 0.01$ the quotient is $\\frac{\\ln 3.01 - \\ln 3}{0.01} \\approx 0.333$, close to $\\frac{1}{3}$.\n\n> **Watch out.** The limit is the derivative at $a$, not the function's value there: the answer here is $\\frac{1}{3}$, not $\\ln 3$.",
        "计算差商的极限时，把它与 $\\frac{f(a + h) - f(a)}{h}$ 或 $\\frac{f(x) - f(a)}{x - a}$ 对照，找出 $f$ 和 $a$，再计算 $f'(a)$。例如 $\\lim_{h \\to 0} \\frac{\\ln(3 + h) - \\ln 3}{h}$ 是 $f(x) = \\ln x$ 的 $f'(3)$，等于 $\\frac{1}{3}$。\n\n检验：在 $h = 0.01$ 处，商 $\\frac{\\ln 3.01 - \\ln 3}{0.01} \\approx 0.333$，接近 $\\frac{1}{3}$。\n\n> **注意。** 极限是 $a$ 处的导数，而不是函数在那里的值：这里答案是 $\\frac{1}{3}$，不是 $\\ln 3$。",
      ),
      generate(rng) {
        const d = limitDerivative(rng);
        return functionProblem({
          prompt: t(`Evaluate $${d.limit}$.`, `求 $${d.limit}$。`),
          answer: d.value,
          wrong: [...d.wrong],
          solution: walked(
            [
              [
                ["Match the definition", "对照定义"],
                t(`The limit is $f'(a)$ for ${d.f.en}.`, `这个极限是 $f'(a)$，其中 ${d.f["zh-CN"]}。`),
              ],
              [
                ["Differentiate and substitute", "求导并代入"],
                t("By the rules of differentiation,", "由求导法则，"),
                [`f'(${d.aLatex}) = ${d.value}`],
              ],
            ],
            limitCheck(d.h, d.a, d.quotient, d.approx, d.value),
          ),
        });
      },
    },
    {
      id: "naming-the-function-and-the-point",
      title: t("Naming the function and the point", "指出函数与点"),
      explanation: t(
        "A limit of a difference quotient names a function $f$ and a point $a$. In $\\lim_{h \\to 0} \\frac{e^{2 + h} - e^{2}}{h}$, the function is $e^{x}$ and the point is $2$, so the limit is $e^{2}$.\n\nCheck: at $h = 0.01$ the quotient is $\\frac{e^{2.01} - e^{2}}{0.01} \\approx 7.426$, close to $e^{2} \\approx 7.389$.\n\n> **Watch out.** The point is the number that $h$ is added to, or that $x$ approaches. In $\\frac{e^{2 + h} - e^{2}}{h}$ the function is not $e^{2 + x}$.",
        "差商的极限对应一个函数 $f$ 和一个点 $a$。在 $\\lim_{h \\to 0} \\frac{e^{2 + h} - e^{2}}{h}$ 中，函数是 $e^{x}$，点是 $2$，所以极限是 $e^{2}$。\n\n检验：在 $h = 0.01$ 处，商 $\\frac{e^{2.01} - e^{2}}{0.01} \\approx 7.426$，接近 $e^{2} \\approx 7.389$。\n\n> **注意。** 点是 $h$ 所加上的那个数，或 $x$ 所趋近的那个数。在 $\\frac{e^{2 + h} - e^{2}}{h}$ 中，函数不是 $e^{2 + x}$。",
      ),
      generate(rng) {
        const d = limitDerivative(rng);
        const others: LimitDerivative[] = [];
        for (let i = 0; others.length < 3 && i < 50; i++) {
          const o = limitDerivative(rng);
          if (o.f.en !== d.f.en && !others.some((x) => x.f.en === o.f.en)) others.push(o);
        }
        return explainedChoice(rng, {
          prompt: t(
            `The limit $${d.limit}$ is the derivative $f'(a)$ for which function and point?`,
            `极限 $${d.limit}$ 是哪个函数在哪一点处的导数 $f'(a)$？`,
          ),
          correct: d.f,
          wrong: others.map((o) => ({
            option: o.f,
            why: t(
              `that pair gives the limit $${o.limit}$, which is a different quotient`,
              `这一组给出的极限是 $${o.limit}$，是另一个差商`,
            ),
          })),
          solution: walked(
            [
              [
                ["Find the point", "找出点"],
                d.h
                  ? t(
                      `The quotient adds $h$ to $${d.aLatex}$, so $a = ${d.aLatex}$.`,
                      `商中把 $h$ 加到 $${d.aLatex}$ 上，所以 $a = ${d.aLatex}$。`,
                    )
                  : t(
                      `The variable $x$ approaches $${d.aLatex}$, so $a = ${d.aLatex}$.`,
                      `变量 $x$ 趋近 $${d.aLatex}$，所以 $a = ${d.aLatex}$。`,
                    ),
              ],
              [
                ["Find the function", "找出函数"],
                t(
                  `Matching the numerator with $f(a + h) - f(a)$ or $f(x) - f(a)$ gives ${d.f.en}, and the limit equals $f'(${d.aLatex}) = ${d.value}$.`,
                  `把分子与 $f(a + h) - f(a)$ 或 $f(x) - f(a)$ 对照，得 ${d.f["zh-CN"]}，极限等于 $f'(${d.aLatex}) = ${d.value}$。`,
                ),
              ],
            ],
            limitCheck(d.h, d.a, d.quotient, d.approx, d.value),
          ),
        });
      },
    },
  ],
};

/** calculusIDerivativeRuleTopics are the topics of Calculus I module 4.10. */
export const calculusIDerivativeRuleTopics: readonly TopicDef[] = [
  differentiatingExponentialFunctions,
  differentiatingLogarithmicFunctions,
  differentiatingTrigonometricFunctions,
  differentiatingHyperbolicFunctions,
  differentiatingReciprocalHyperbolicFunctions,
  secondAndHigherOrderDerivatives,
  theProductRuleForDifferentiation,
  theQuotientRuleForDifferentiation,
  differentiatingReciprocalTrigonometricFunctions,
  calculatingDerivativesFromDataAndTables,
  calculatingDerivativesFromGraphs,
  recognizingDerivativesInLimits,
];
