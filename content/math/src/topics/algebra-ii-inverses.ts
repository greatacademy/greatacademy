import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, linear, num, type PlaneMark, type PlaneView, type Point, plane, poly, Q } from "@ga/subject-math";
import { algebraDrawings2 } from "../explanation-drawings-algebra-2.ts";
import { algebraDrawings3 } from "../explanation-drawings-algebra-3.ts";
import { annotate, at, plain, riseRun } from "../graph-figures.ts";
import { choiceProblem, expressionProblem, numberProblem, pointProblem, solutionsProblem, steps, why } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";

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

/** Step is one step of a solution: its title in English and Chinese, what it does, and the lines it displays. */
type Step = readonly [title: readonly [en: string, zh: string], say: Text, lines?: readonly string[]];

/** walked writes a solution as labelled steps (one step goes unlabelled) followed by a check, in each locale. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(([[en, zh], say, lines = []], i) => {
        const head = parts.length > 1 ? `${stepLabel(i + 1, en, zh)[locale]} ` : "";
        return `${head}${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`;
      })
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

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
  encompasses: [{ topic: "solving-odd-power-equations", weight: 0.3 }],
  xp: 18,
  standards: ["CCSS.HSF.BF.B.4.A"],
  intro: t(
    `The function $f(x) = (x + 2)^{3}$ adds $2$, then cubes. Its inverse must undo both steps in the opposite order: take the cube root, then subtract $2$. Writing $y = f(x)$, swapping $x$ and $y$ and solving for $y$ does this automatically:

$$x = (y + 2)^{3} \\implies y + 2 = \\sqrt[3]{x} \\implies f^{-1}(x) = \\sqrt[3]{x} - 2.$$

Check: $f(1) = 3^{3} = 27$, and $f^{-1}(27) = \\sqrt[3]{27} - 2 = 1$, back where we started.

In this lesson we find the formulas of inverses of cubic functions, of reciprocal functions, of quotients of linear expressions and of square-root functions.`,
    `函数 $f(x) = (x + 2)^{3}$ 先加 $2$，再立方。它的反函数要按相反的顺序撤销这两步：先开立方，再减 $2$。写出 $y = f(x)$，交换 $x$ 与 $y$，再解出 $y$，就自动做到了这一点：

$$x = (y + 2)^{3} \\implies y + 2 = \\sqrt[3]{x} \\implies f^{-1}(x) = \\sqrt[3]{x} - 2$$

检验：$f(1) = 3^{3} = 27$，而 $f^{-1}(27) = \\sqrt[3]{27} - 2 = 1$，回到了出发的地方。

这节课我们求三次函数、倒数型函数、一次式之商以及根式函数的反函数的解析式。`,
  ),
  knowledgePoints: [
    {
      id: "inverses-of-cubic-functions",
      title: t("Inverses of cubic functions", "三次函数的反函数"),
      explanation: t(
        `The inverse $f^{-1}$ sends each output of $f$ back to its input: if $f(a) = b$ then $f^{-1}(b) = a$. So the graph of $f^{-1}$ is the graph of $f$ with $x$ and $y$ swapped, and that gives the method:

1. write $y = f(x)$;
2. **swap** $x$ and $y$;
3. solve the new equation for $y$. The result is $f^{-1}(x)$.

A cubic in vertex form is invertible, since every number has exactly one cube root. Take $f(x) = 2(x - 1)^{3} + 5$ and swap: $x = 2(y - 1)^{3} + 5$. Undo the steps of $f$ from the outside in:

$$(y - 1)^{3} = \\frac{x - 5}{2}, \\quad y - 1 = \\sqrt[3]{\\frac{x - 5}{2}}, \\quad f^{-1}(x) = \\sqrt[3]{\\frac{x - 5}{2}} + 1.$$

Check: $f(3) = 2 \\cdot 2^{3} + 5 = 21$, and $f^{-1}(21) = \\sqrt[3]{8} + 1 = 3$.

> **Watch out.** Each step is undone with the opposite operation: $+5$ becomes $-5$ and $-1$ becomes $+1$; keeping the original signs gives $\\sqrt[3]{\\frac{x + 5}{2}} - 1$. Divide by $2$ before taking the cube root, inside the root: $\\frac{\\sqrt[3]{x - 5}}{2}$ and $\\sqrt[3]{2(x - 5)}$ are wrong. The $5$ is subtracted from $x$ inside the root, not from the result outside it.`,
        `反函数 $f^{-1}$ 把 $f$ 的每个输出送回它的输入：若 $f(a) = b$，则 $f^{-1}(b) = a$。所以 $f^{-1}$ 的图象就是把 $f$ 的图象中 $x$ 与 $y$ 对调，由此得到方法：

1. 写出 $y = f(x)$；
2. **交换** $x$ 与 $y$；
3. 从新方程中解出 $y$，结果就是 $f^{-1}(x)$。

顶点式的三次函数是可逆的，因为每个数恰有一个立方根。看 $f(x) = 2(x - 1)^{3} + 5$，交换得 $x = 2(y - 1)^{3} + 5$。从外到内撤销 $f$ 的各步：

$$(y - 1)^{3} = \\frac{x - 5}{2}, \\quad y - 1 = \\sqrt[3]{\\frac{x - 5}{2}}, \\quad f^{-1}(x) = \\sqrt[3]{\\frac{x - 5}{2}} + 1$$

检验：$f(3) = 2 \\cdot 2^{3} + 5 = 21$，而 $f^{-1}(21) = \\sqrt[3]{8} + 1 = 3$。

> **注意。** 每一步都用相反的运算撤销：$+5$ 变成 $-5$，$-1$ 变成 $+1$；保留原来的符号会得到 $\\sqrt[3]{\\frac{x + 5}{2}} - 1$。先除以 $2$ 再开立方，除法在根号里面：$\\frac{\\sqrt[3]{x - 5}}{2}$ 和 $\\sqrt[3]{2(x - 5)}$ 都是错的。$5$ 是在根号里从 $x$ 中减去，而不是在根号外从结果中减去。`,
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
            solution: walked(
              [
                [
                  ["Swap $x$ and $y$", "交换 $x$ 与 $y$"],
                  t(
                    `Write $y = f(x)$ and swap the two letters; the inverse is the $y$ that solves`,
                    `写出 $y = f(x)$，再交换两个字母；反函数就是从下式解出的 $y$：`,
                  ),
                  [`x = ${front(a)}${cube}${plus(k)}`],
                ],
                [
                  ["Undo the outer steps", "撤销外层的运算"],
                  t(
                    `After cubing, $f$ ${a === 1 ? "" : `multiplied by $${a}$ and then `}${k > 0 ? "added" : "subtracted"} $${Math.abs(k)}$. Undo these in reverse order: ${k > 0 ? "subtract" : "add"} $${Math.abs(k)}$${a === 1 ? "" : `, then divide by $${a}$`}:`,
                    `立方之后，$f$ ${a === 1 ? "" : `乘以 $${a}$，再`}${k > 0 ? "加上" : "减去"} $${Math.abs(k)}$。按相反的顺序撤销：${k > 0 ? "减去" : "加上"} $${Math.abs(k)}$${a === 1 ? "" : `，再除以 $${a}$`}：`,
                  ),
                  [`${cube} = ${inner}`],
                ],
                [
                  ["Take the cube root", "开立方"],
                  t(
                    `Every number has exactly one cube root, so no sign has to be chosen${h === 0 ? "" : `; then ${h > 0 ? "add" : "subtract"} $${Math.abs(h)}$`}:`,
                    `每个数恰有一个立方根，所以不用选择符号${h === 0 ? "" : `；再${h > 0 ? "加上" : "减去"} $${Math.abs(h)}$`}：`,
                  ),
                  [`${root} = \\sqrt[3]{${inner}}`, `f^{-1}(x) = ${answer}`],
                ],
              ],
              t(
                `$f(${h + 2}) = ${a} \\cdot 2^{3}${plus(k)} = ${8 * a + k}$, and $f^{-1}(${8 * a + k}) = \\sqrt[3]{${a === 1 ? `${8 * a + k} - ${sub(k)}` : `\\frac{${8 * a + k} - ${sub(k)}}{${a}}`}}${plus(h)} = \\sqrt[3]{8}${plus(h)} = ${h + 2}$.`,
                `$f(${h + 2}) = ${a} \\cdot 2^{3}${plus(k)} = ${8 * a + k}$，而 $f^{-1}(${8 * a + k}) = \\sqrt[3]{${a === 1 ? `${8 * a + k} - ${sub(k)}` : `\\frac{${8 * a + k} - ${sub(k)}}{${a}}`}}${plus(h)} = \\sqrt[3]{8}${plus(h)} = ${h + 2}$。`,
              ),
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
        `A reciprocal function $\\frac{m}{x - h} + v$ takes every value except $v$ exactly once, so it is invertible. Swapping and solving works as before; the new move is taking reciprocals of both sides, which is allowed because neither side is $0$.

Take $f(x) = \\frac{3}{x - 2} + 4$ and swap: $x = \\frac{3}{y - 2} + 4$. Isolate the fraction, then flip both sides and multiply by $3$:

$$x - 4 = \\frac{3}{y - 2}, \\quad y - 2 = \\frac{3}{x - 4}, \\quad f^{-1}(x) = \\frac{3}{x - 4} + 2.$$

Check: $f(3) = 3 + 4 = 7$, and $f^{-1}(7) = \\frac{3}{3} + 2 = 3$.

The numbers $2$ and $4$ trade places: $f$ is not defined at $x = 2$ and never takes the value $4$, and $f^{-1}$ is not defined at $x = 4$ and never takes the value $2$.

> **Watch out.** Swap first: writing $f$ again unchanged is not the inverse. The $+4$ is undone by $-4$ next to $x$, and the $-2$ by $+2$ outside; the signs change. Only the fraction is flipped: the $3$ stays on top, so $\\frac{x - 4}{3} + 2$ is wrong.`,
        `倒数型函数 $\\frac{m}{x - h} + v$ 取到除 $v$ 以外的每个值恰好一次，所以它是可逆的。交换并求解的方法照旧；新的一步是两边同取倒数，这是允许的，因为两边都不为 $0$。

看 $f(x) = \\frac{3}{x - 2} + 4$，交换得 $x = \\frac{3}{y - 2} + 4$。先把分式单独留在一边，再两边取倒数并乘以 $3$：

$$x - 4 = \\frac{3}{y - 2}, \\quad y - 2 = \\frac{3}{x - 4}, \\quad f^{-1}(x) = \\frac{3}{x - 4} + 2$$

检验：$f(3) = 3 + 4 = 7$，而 $f^{-1}(7) = \\frac{3}{3} + 2 = 3$。

数 $2$ 与 $4$ 互换了位置：$f$ 在 $x = 2$ 处无定义、取不到值 $4$；$f^{-1}$ 在 $x = 4$ 处无定义、取不到值 $2$。

> **注意。** 先交换：把 $f$ 原样再写一遍不是反函数。$+4$ 用 $x$ 旁边的 $-4$ 撤销，$-2$ 用外面的 $+2$ 撤销，符号都要变。只把分式颠倒：$3$ 仍在分子上，所以 $\\frac{x - 4}{3} + 2$ 是错的。`,
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
            solution: walked(
              [
                [
                  ["Swap $x$ and $y$", "交换 $x$ 与 $y$"],
                  t("Write $y = f(x)$ and swap the two letters:", "写出 $y = f(x)$，再交换两个字母："),
                  [`x = \\frac{${m}}{${shifted(h, "y")}}${plus(v)}`],
                ],
                [
                  ["Isolate the fraction", "把分式单独留在一边"],
                  t(
                    `${v === 0 ? "The fraction is already alone" : `Subtract $${v}$ from both sides`}:`,
                    `${v === 0 ? "分式已经单独在一边" : `两边减去 $${v}$`}：`,
                  ),
                  [`${shifted(v)} = \\frac{${m}}{${shifted(h, "y")}}`],
                ],
                [
                  ["Take reciprocals", "两边取倒数"],
                  t(
                    `Neither side is $0$, so flip both sides and multiply by $${m}$${h === 0 ? "" : `, then ${h > 0 ? "add" : "subtract"} $${Math.abs(h)}$`}:`,
                    `两边都不为 $0$，所以两边取倒数，再乘以 $${m}$${h === 0 ? "" : `，然后${h > 0 ? "加上" : "减去"} $${Math.abs(h)}$`}：`,
                  ),
                  [`${shifted(h, "y")} = \\frac{${m}}{${shifted(v)}}`, `f^{-1}(x) = ${answer}`],
                ],
              ],
              t(
                `$f(${h + 1}) = \\frac{${m}}{1}${plus(v)} = ${m + v}$, and $f^{-1}(${m + v}) = \\frac{${m}}{${m + v} - ${sub(v)}}${plus(h)} = 1${plus(h)} = ${h + 1}$.`,
                `$f(${h + 1}) = \\frac{${m}}{1}${plus(v)} = ${m + v}$，而 $f^{-1}(${m + v}) = \\frac{${m}}{${m + v} - ${sub(v)}}${plus(h)} = 1${plus(h)} = ${h + 1}$。`,
              ),
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
        `When $y$ appears in both the numerator and the denominator, no single operation undoes it. Instead treat the swapped equation as a linear equation in $y$: clear the fraction, gather the terms with $y$ on one side, and factor $y$ out.

Take $f(x) = \\frac{2x + 1}{x - 3}$ and swap: $x = \\frac{2y + 1}{y - 3}$. Then

$$x(y - 3) = 2y + 1, \\quad xy - 2y = 3x + 1, \\quad y(x - 2) = 3x + 1, \\quad f^{-1}(x) = \\frac{3x + 1}{x - 2}.$$

Check: $f(4) = \\frac{9}{1} = 9$, and $f^{-1}(9) = \\frac{28}{7} = 4$.

> **Watch out.** The inverse is not the reciprocal: $\\frac{x - 3}{2x + 1}$ is $\\frac{1}{f(x)}$, a different function. Expanding $x(y - 3)$ gives $-3x$, which moves to the other side as $+3x$; keep track of both signs when moving terms, or the answer comes out as $\\frac{-3x - 1}{x - 2}$ or with $x + 2$ below.`,
        `当 $y$ 同时出现在分子和分母中时，没有哪一种运算能直接撤销它。这时把交换后的方程看成关于 $y$ 的一次方程：去分母，把含 $y$ 的项移到同一边，再提出 $y$。

看 $f(x) = \\frac{2x + 1}{x - 3}$，交换得 $x = \\frac{2y + 1}{y - 3}$。于是

$$x(y - 3) = 2y + 1, \\quad xy - 2y = 3x + 1, \\quad y(x - 2) = 3x + 1, \\quad f^{-1}(x) = \\frac{3x + 1}{x - 2}$$

检验：$f(4) = \\frac{9}{1} = 9$，而 $f^{-1}(9) = \\frac{28}{7} = 4$。

> **注意。** 反函数不是倒数：$\\frac{x - 3}{2x + 1}$ 是 $\\frac{1}{f(x)}$，是另一个函数。展开 $x(y - 3)$ 得 $-3x$，移到另一边变成 $+3x$；移项时两边的符号都要跟着变，否则会得到 $\\frac{-3x - 1}{x - 2}$，或分母成了 $x + 2$。`,
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
            solution: walked(
              [
                [
                  ["Swap $x$ and $y$", "交换 $x$ 与 $y$"],
                  t("Write $y = f(x)$ and swap the two letters:", "写出 $y = f(x)$，再交换两个字母："),
                  [`x = \\frac{${linear(a, b, "y")}}{${linear(1, c, "y")}}`],
                ],
                [
                  ["Clear the fraction", "去分母"],
                  t("Multiply both sides by the denominator and expand:", "两边乘以分母，再展开："),
                  [`x(${linear(1, c, "y")}) = ${linear(a, b, "y")}`, `${poly([1, "xy"], [c, "x"])} = ${linear(a, b, "y")}`],
                ],
                [
                  ["Gather the terms with $y$", "把含 $y$ 的项移到一边"],
                  t(
                    `Move $${linear(a, 0, "y")}$ to the left and $${linear(c, 0)}$ to the right, changing their signs, then factor out $y$ and divide:`,
                    `把 $${linear(a, 0, "y")}$ 移到左边，$${linear(c, 0)}$ 移到右边，并改变符号；再提出 $y$，两边相除：`,
                  ),
                  [`${poly([1, "xy"], [-a, "y"])} = ${top}`, `y(${linear(1, -a)}) = ${top}`, `f^{-1}(x) = ${answer}`],
                ],
              ],
              t(
                `$f(${1 - c}) = \\frac{${a} \\cdot ${sub(1 - c)}${plus(b)}}{${sub(1 - c)}${plus(c)}} = ${a * (1 - c) + b}$, and $f^{-1}(${a * (1 - c) + b}) = \\frac{${-c} \\cdot ${sub(a * (1 - c) + b)}${plus(b)}}{${a * (1 - c) + b} - ${sub(a)}} = \\frac{${-c * (a * (1 - c) + b) + b}}{${b - a * c}} = ${1 - c}$.`,
                `$f(${1 - c}) = \\frac{${a} \\cdot ${sub(1 - c)}${plus(b)}}{${sub(1 - c)}${plus(c)}} = ${a * (1 - c) + b}$，而 $f^{-1}(${a * (1 - c) + b}) = \\frac{${-c} \\cdot ${sub(a * (1 - c) + b)}${plus(b)}}{${a * (1 - c) + b} - ${sub(a)}} = \\frac{${-c * (a * (1 - c) + b) + b}}{${b - a * c}} = ${1 - c}$。`,
              ),
            ),
          }),
          "f^{-1}(x) =",
        );
      },
    },
    {
      id: "inverses-of-square-root-functions",
      figure: algebraDrawings2["calculating-the-inverse-of-a-function#inverses-of-square-root-functions"],
      title: t("Inverses of square-root functions", "根式函数的反函数"),
      explanation: t(
        `A square root is undone by squaring. Squaring is not reversible in general, but here it is safe, because the outputs of $f^{-1}$ are limited to the range of $f$.

Take $f(x) = 2\\sqrt{x + 1} - 3$ and swap: $x = 2\\sqrt{y + 1} - 3$. Isolate the root, square, and finish:

$$\\frac{x + 3}{2} = \\sqrt{y + 1}, \\quad y + 1 = \\frac{(x + 3)^{2}}{4}, \\quad f^{-1}(x) = \\frac{(x + 3)^{2}}{4} - 1.$$

Check: $f(3) = 2 \\cdot 2 - 3 = 1$, and $f^{-1}(1) = \\frac{16}{4} - 1 = 3$.

The formula is a whole parabola, but $f^{-1}$ is only its right half: the domain of $f^{-1}$ is the range of $f$, here $x \\ge -3$.

> **Watch out.** Squaring the fraction $\\frac{x + 3}{2}$ squares the $2$ as well, so the denominator is $4$, not $2$, and the $2$ does not move to the top. The $-3$ becomes $+3$ inside the square and the $+1$ becomes $-1$ outside. Do not leave a root in the answer: the inverse of a root is a square.`,
        `平方根用平方撤销。平方一般不可逆，但在这里是安全的，因为 $f^{-1}$ 的输出限定在 $f$ 的值域内。

看 $f(x) = 2\\sqrt{x + 1} - 3$，交换得 $x = 2\\sqrt{y + 1} - 3$。把根式单独留在一边，两边平方，再解完：

$$\\frac{x + 3}{2} = \\sqrt{y + 1}, \\quad y + 1 = \\frac{(x + 3)^{2}}{4}, \\quad f^{-1}(x) = \\frac{(x + 3)^{2}}{4} - 1$$

检验：$f(3) = 2 \\cdot 2 - 3 = 1$，而 $f^{-1}(1) = \\frac{16}{4} - 1 = 3$。

这个式子是一整条抛物线，但 $f^{-1}$ 只是它的右半支：$f^{-1}$ 的定义域是 $f$ 的值域，这里是 $x \\ge -3$。

> **注意。** 把分式 $\\frac{x + 3}{2}$ 平方，$2$ 也要平方，所以分母是 $4$ 而不是 $2$，$2$ 也不会跑到分子上。$-3$ 在平方里变成 $+3$，$+1$ 在外面变成 $-1$。答案里不要留根号：根式的反函数是平方。`,
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
            solution: walked(
              [
                [
                  ["Swap $x$ and $y$", "交换 $x$ 与 $y$"],
                  t("Write $y = f(x)$ and swap the two letters:", "写出 $y = f(x)$，再交换两个字母："),
                  [`x = ${front(a)}\\sqrt{${shifted(h, "y")}}${plus(k)}`],
                ],
                [
                  ["Isolate the root", "把根式单独留在一边"],
                  t(
                    `${k > 0 ? "Subtract" : "Add"} $${Math.abs(k)}$${a === 1 ? "" : `, then divide by $${a}$`}:`,
                    `${k > 0 ? "减去" : "加上"} $${Math.abs(k)}$${a === 1 ? "" : `，再除以 $${a}$`}：`,
                  ),
                  [`${isolated} = \\sqrt{${shifted(h, "y")}}`],
                ],
                [
                  ["Square both sides", "两边平方"],
                  t(
                    `Squaring undoes the root${a * a === 1 ? "" : `; the denominator $${a}$ is squared too, giving $${a * a}$`}${h === 0 ? "" : `. Then ${h > 0 ? "add" : "subtract"} $${Math.abs(h)}$`}:`,
                    `平方撤销根号${a * a === 1 ? "" : `；分母 $${a}$ 也要平方，得 $${a * a}$`}${h === 0 ? "" : `。再${h > 0 ? "加上" : "减去"} $${Math.abs(h)}$`}：`,
                  ),
                  [`${shifted(h, "y")} = ${a * a === 1 ? sq : `\\frac{${sq}}{${a * a}}`}`, `f^{-1}(x) = ${answer}`],
                ],
                [
                  ["State the domain", "写出定义域"],
                  t(
                    `The square root is never negative, so $f(x) ${a > 0 ? "\\ge" : "\\le"} ${k}$. The domain of $f^{-1}$ is this range, $${dom}$: only ${a > 0 ? "the right" : "the left"} half of the parabola.`,
                    `平方根不会是负数，所以 $f(x) ${a > 0 ? "\\ge" : "\\le"} ${k}$。$f^{-1}$ 的定义域就是这个值域 $${dom}$：只取抛物线的${a > 0 ? "右" : "左"}半支。`,
                  ),
                ],
              ],
              t(
                `$f(${h + 1}) = ${a} \\cdot \\sqrt{1}${plus(k)} = ${a + k}$, and $f^{-1}(${a + k}) = ${a * a === 1 ? `(${a + k} - ${sub(k)})^{2}` : `\\frac{(${a + k} - ${sub(k)})^{2}}{${a * a}}`}${plus(h)} = 1${plus(h)} = ${h + 1}$.`,
                `$f(${h + 1}) = ${a} \\cdot \\sqrt{1}${plus(k)} = ${a + k}$，而 $f^{-1}(${a + k}) = ${a * a === 1 ? `(${a + k} - ${sub(k)})^{2}` : `\\frac{(${a + k} - ${sub(k)})^{2}}{${a * a}}`}${plus(h)} = 1${plus(h)} = ${h + 1}$。`,
              ),
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
    { topic: "invertible-functions", weight: 0.3 },
    { topic: "calculating-the-inverse-of-a-function", weight: 0.3 },
    { topic: "solving-equations-with-square-roots", weight: 0.3 },
    { topic: "writing-the-equation-of-a-parabola-in-vertex-form", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.4.D"],
  intro: t(
    `The function $x^{2}$ has no inverse on all the numbers: $3^{2} = (-3)^{2} = 9$, so an inverse would not know whether to send $9$ back to $3$ or to $-3$. Restrict the domain to one side of the vertex and the problem disappears. With $f(x) = x^{2}$ for $x \\le 0$, swap and solve:

$$x = y^{2} \\implies y = \\pm\\sqrt{x}.$$

The outputs of $f^{-1}$ must be inputs of $f$, which are at most $0$, so $f^{-1}(x) = -\\sqrt{x}$. Check: $f(-3) = 9$ and $f^{-1}(9) = -\\sqrt{9} = -3$.

In this lesson we invert quadratic functions restricted to one side of the vertex, in vertex form, with a leading coefficient, and in standard form.`,
    `函数 $x^{2}$ 在全体实数上没有反函数：$3^{2} = (-3)^{2} = 9$，反函数不知道该把 $9$ 送回 $3$ 还是 $-3$。把定义域限制在顶点的一侧，问题就消失了。对于 $f(x) = x^{2}$（$x \\le 0$），交换并求解：

$$x = y^{2} \\implies y = \\pm\\sqrt{x}$$

$f^{-1}$ 的输出必须是 $f$ 的输入，而它们不大于 $0$，所以 $f^{-1}(x) = -\\sqrt{x}$。检验：$f(-3) = 9$，$f^{-1}(9) = -\\sqrt{9} = -3$。

这节课我们求限制在顶点一侧的二次函数的反函数：顶点式、带首项系数的情形以及一般式。`,
  ),
  knowledgePoints: [
    {
      id: "inverses-of-shifted-squares",
      figure: algebraDrawings2["inverses-of-quadratic-functions#inverses-of-shifted-squares"],
      title: t("Inverses of shifted squares", "平移后平方函数的反函数"),
      explanation: t(
        `A quadratic function takes each value above its vertex twice, once on each side, so it is invertible only on one side of the vertex. Swapping and solving then leaves $\\pm$ in front of the root, and the restricted domain decides the sign: the outputs of $f^{-1}$ are the inputs of $f$.

Take $f(x) = (x - 3)^{2} + 1$ with $x \\ge 3$. Swap: $x = (y - 3)^{2} + 1$, so $(y - 3)^{2} = x - 1$ and

$$y - 3 = \\pm\\sqrt{x - 1}.$$

Since $y \\ge 3$, $y - 3 \\ge 0$: take the **positive** root, $f^{-1}(x) = \\sqrt{x - 1} + 3$. Check: $f(5) = 4 + 1 = 5$ and $f^{-1}(5) = \\sqrt{4} + 3 = 5$. With the domain $x \\le 3$ instead, $y - 3 \\le 0$ and $f^{-1}(x) = -\\sqrt{x - 1} + 3$.

> **Watch out.** The sign of the root comes from the domain of $f$, not from the sign of anything in the formula. The $+1$ is undone inside the root as $x - 1$, and the $-3$ outside as $+3$; keeping the original signs is a common slip. The vertex numbers do not trade places: $\\sqrt{x - 3} + 1$ is wrong. And the inverse of a square is a root, not another square.`,
        `二次函数在顶点以上的每个值都取两次，顶点两侧各一次，所以它只在顶点的一侧可逆。交换并求解后，根号前留下 $\\pm$，由限制后的定义域决定符号：$f^{-1}$ 的输出就是 $f$ 的输入。

看 $f(x) = (x - 3)^{2} + 1$（$x \\ge 3$）。交换得 $x = (y - 3)^{2} + 1$，所以 $(y - 3)^{2} = x - 1$，

$$y - 3 = \\pm\\sqrt{x - 1}$$

因为 $y \\ge 3$，$y - 3 \\ge 0$：取**正**的平方根，$f^{-1}(x) = \\sqrt{x - 1} + 3$。检验：$f(5) = 4 + 1 = 5$，$f^{-1}(5) = \\sqrt{4} + 3 = 5$。若定义域改为 $x \\le 3$，则 $y - 3 \\le 0$，$f^{-1}(x) = -\\sqrt{x - 1} + 3$。

> **注意。** 根号前的符号由 $f$ 的定义域决定，而不是由式子里某个数的符号决定。$+1$ 在根号里撤销为 $x - 1$，$-3$ 在外面撤销为 $+3$；保留原来的符号是常见的错误。顶点的两个数不会互换位置：$\\sqrt{x - 3} + 1$ 是错的。平方的反函数是平方根，而不是另一个平方。`,
      ),
      keyPrerequisites: ["solving-equations-with-square-roots"],
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const k = rng.int(-9, 9);
        const right = rng.bool();
        const answer = branch(right, shifted(k), h);
        const f = sqForm(1, h, k);
        const y0 = h + (right ? 2 : -2);
        const fy = 4 + k;
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
            solution: walked(
              [
                [
                  ["Swap $x$ and $y$", "交换 $x$ 与 $y$"],
                  t("Write $y = f(x)$ and swap the two letters:", "写出 $y = f(x)$，再交换两个字母："),
                  [`x = ${sqForm(1, h, k, "y")}`],
                ],
                [
                  ["Take the square root", "开平方"],
                  t(
                    `${k === 0 ? "The square is already alone" : `${k > 0 ? "Subtract" : "Add"} $${Math.abs(k)}$ to leave the square alone`}. A positive number has two square roots, so both signs appear:`,
                    `${k === 0 ? "平方已经单独在一边" : `${k > 0 ? "减去" : "加上"} $${Math.abs(k)}$，把平方单独留在一边`}。正数有两个平方根，所以两个符号都要写：`,
                  ),
                  [`(${shifted(h, "y")})^{2} = ${shifted(k)}`, `${shifted(h, "y")} = \\pm\\sqrt{${shifted(k)}}`],
                ],
                [["Choose the sign", "选定符号"], branchReason(right, h), [`f^{-1}(x) = ${answer}`]],
              ],
              t(
                `$f(${y0}) = (${right ? 2 : -2})^{2}${plus(k)} = ${fy}$, and $f^{-1}(${fy}) = ${right ? "" : "-"}\\sqrt{${fy} - ${sub(k)}}${plus(h)} = ${right ? "" : "-"}2${plus(h)} = ${y0}$.`,
                `$f(${y0}) = (${right ? 2 : -2})^{2}${plus(k)} = ${fy}$，而 $f^{-1}(${fy}) = ${right ? "" : "-"}\\sqrt{${fy} - ${sub(k)}}${plus(h)} = ${right ? "" : "-"}2${plus(h)} = ${y0}$。`,
              ),
            ),
          }),
          "f^{-1}(x) =",
        );
      },
    },
    {
      id: "inverses-in-vertex-form",
      figure: algebraDrawings3["inverses-of-quadratic-functions#inverses-in-vertex-form"],
      title: t("Inverses in vertex form", "顶点式的反函数"),
      explanation: t(
        `With a leading coefficient $a$, the square is multiplied by $a$ after it is formed, so undo that first: divide by $a$, then take the square root. The domain still picks the sign.

Take $f(x) = -2(x + 1)^{2} + 5$ with $x \\le -1$. Swap and solve:

$$x = -2(y + 1)^{2} + 5, \\quad (y + 1)^{2} = \\frac{5 - x}{2}, \\quad y + 1 = \\pm\\sqrt{\\frac{5 - x}{2}}.$$

Since $y \\le -1$, $y + 1 \\le 0$, so $f^{-1}(x) = -\\sqrt{\\frac{5 - x}{2}} - 1$. Check: $f(-3) = -2 \\cdot 4 + 5 = -3$ and $f^{-1}(-3) = -\\sqrt{4} - 1 = -3$.

> **Watch out.** Divide by $a$ inside the root: $\\frac{\\sqrt{x - k}}{a}$ and $\\sqrt{a(x - k)}$ are wrong. Subtract $k$ before dividing, so the whole $x - k$ is divided; $\\sqrt{\\frac{x}{a}}$ with $k$ moved outside is wrong. The sign in front of the root comes from the domain, and the shift $h$ is undone outside with the opposite sign.`,
        `有首项系数 $a$ 时，平方做完之后才乘以 $a$，所以先撤销它：除以 $a$，再开平方。符号仍由定义域选定。

看 $f(x) = -2(x + 1)^{2} + 5$（$x \\le -1$）。交换并求解：

$$x = -2(y + 1)^{2} + 5, \\quad (y + 1)^{2} = \\frac{5 - x}{2}, \\quad y + 1 = \\pm\\sqrt{\\frac{5 - x}{2}}$$

因为 $y \\le -1$，$y + 1 \\le 0$，所以 $f^{-1}(x) = -\\sqrt{\\frac{5 - x}{2}} - 1$。检验：$f(-3) = -2 \\cdot 4 + 5 = -3$，$f^{-1}(-3) = -\\sqrt{4} - 1 = -3$。

> **注意。** 除以 $a$ 要在根号里面：$\\frac{\\sqrt{x - k}}{a}$ 和 $\\sqrt{a(x - k)}$ 都是错的。先减去 $k$ 再除，使整个 $x - k$ 被除；把 $k$ 移到外面、写成 $\\sqrt{\\frac{x}{a}}$ 是错的。根号前的符号由定义域决定，平移量 $h$ 在外面以相反的符号撤销。`,
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 5, -1, -2, -3]);
        const h = rng.nonZero(-6, 6);
        const k = rng.int(-9, 9);
        const right = rng.bool();
        const inner = a === -1 ? flipped(k) : a > 0 ? `\\frac{${shifted(k)}}{${a}}` : `\\frac{${flipped(k)}}{${-a}}`;
        const answer = branch(right, inner, h);
        const f = sqForm(a, h, k);
        const y0 = h + (right ? 1 : -1);
        const fy = a + k;
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
            solution: walked(
              [
                [
                  ["Swap $x$ and $y$", "交换 $x$ 与 $y$"],
                  t("Write $y = f(x)$ and swap the two letters:", "写出 $y = f(x)$，再交换两个字母："),
                  [`x = ${sqForm(a, h, k, "y")}`],
                ],
                [
                  ["Isolate the square", "把平方单独留在一边"],
                  t(
                    `${k === 0 ? "" : `${k > 0 ? "Subtract" : "Add"} $${Math.abs(k)}$, then `}divide by $${a}$; the coefficient was applied after squaring, so it is undone first:`,
                    `${k === 0 ? "" : `${k > 0 ? "减去" : "加上"} $${Math.abs(k)}$，再`}除以 $${a}$；系数是平方之后才乘上的，所以先撤销它：`,
                  ),
                  [`(${shifted(h, "y")})^{2} = ${inner}`],
                ],
                [
                  ["Take the square root", "开平方"],
                  t("Both signs of the root are possible so far:", "到这里根号前两个符号都有可能："),
                  [`${shifted(h, "y")} = \\pm\\sqrt{${inner}}`],
                ],
                [["Choose the sign", "选定符号"], branchReason(right, h), [`f^{-1}(x) = ${answer}`]],
              ],
              t(
                `$f(${y0}) = ${a} \\cdot (${right ? 1 : -1})^{2}${plus(k)} = ${fy}$, and $f^{-1}(${fy}) = ${right ? "" : "-"}\\sqrt{${a === -1 ? `${k} - ${sub(fy)}` : `\\frac{${fy} - ${sub(k)}}{${a}}`}}${plus(h)} = ${right ? "" : "-"}1${plus(h)} = ${y0}$.`,
                `$f(${y0}) = ${a} \\cdot (${right ? 1 : -1})^{2}${plus(k)} = ${fy}$，而 $f^{-1}(${fy}) = ${right ? "" : "-"}\\sqrt{${a === -1 ? `${k} - ${sub(fy)}` : `\\frac{${fy} - ${sub(k)}}{${a}}`}}${plus(h)} = ${right ? "" : "-"}1${plus(h)} = ${y0}$。`,
              ),
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
        `In standard form $x$ appears twice, in $x^{2}$ and in $bx$, so swapping and solving directly would give a quadratic equation in $y$. Completing the square first rewrites $f$ with $x$ in one place, and then the steps of the vertex form apply. The vertex also shows where the restricted domain starts.

Take $f(x) = x^{2} - 6x + 4$ with $x \\ge 3$. Half of $-6$ is $-3$, and $(-3)^{2} = 9$:

$$f(x) = (x - 3)^{2} - 9 + 4 = (x - 3)^{2} - 5.$$

Swap and solve: $(y - 3)^{2} = x + 5$. Since $y \\ge 3$, $f^{-1}(x) = \\sqrt{x + 5} + 3$. Check: $f(5) = 25 - 30 + 4 = -1$ and $f^{-1}(-1) = \\sqrt{4} + 3 = 5$.

> **Watch out.** The constant of the vertex form is not the constant $c$ of the standard form: subtract the square of half the middle coefficient, so here $-5$, not $4$. The sign of the root comes from the domain, and the shift is undone with the opposite sign, $+3$ for $(x - 3)$.`,
        `一般式中 $x$ 出现两次，在 $x^{2}$ 和 $bx$ 中，所以直接交换求解会得到关于 $y$ 的二次方程。先配方，把 $f$ 改写成 $x$ 只出现一次的形式，再按顶点式的步骤做。顶点也指出了限制后的定义域从哪里开始。

看 $f(x) = x^{2} - 6x + 4$（$x \\ge 3$）。$-6$ 的一半是 $-3$，$(-3)^{2} = 9$：

$$f(x) = (x - 3)^{2} - 9 + 4 = (x - 3)^{2} - 5$$

交换并求解：$(y - 3)^{2} = x + 5$。因为 $y \\ge 3$，$f^{-1}(x) = \\sqrt{x + 5} + 3$。检验：$f(5) = 25 - 30 + 4 = -1$，$f^{-1}(-1) = \\sqrt{4} + 3 = 5$。

> **注意。** 顶点式的常数不是一般式的常数 $c$：要减去一次项系数一半的平方，所以这里是 $-5$，不是 $4$。根号前的符号由定义域决定，平移量以相反的符号撤销，$(x - 3)$ 对应 $+3$。`,
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
        const y0 = h + (right ? 2 : -2);
        const fy = 4 + k;
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
            solution: walked(
              [
                [
                  ["Complete the square", "配方"],
                  t(
                    `Half of $${2 * m}$ is $${m}$, and $${sub(m)}^{2} = ${m * m}$. Add and subtract it:`,
                    `$${2 * m}$ 的一半是 $${m}$，$${sub(m)}^{2} = ${m * m}$。加上再减去它：`,
                  ),
                  [`f(x) = (${shifted(h)})^{2} - ${m * m}${plus(c)}`, `f(x) = ${sqForm(1, h, k)}`],
                ],
                [
                  ["Swap and take the square root", "交换并开平方"],
                  t(
                    "Swap $x$ and $y$, leave the square alone, and take the root with both signs:",
                    "交换 $x$ 与 $y$，把平方单独留在一边，再开平方，两个符号都写上：",
                  ),
                  [
                    `x = ${sqForm(1, h, k, "y")}`,
                    `(${shifted(h, "y")})^{2} = ${shifted(k)}`,
                    `${shifted(h, "y")} = \\pm\\sqrt{${shifted(k)}}`,
                  ],
                ],
                [["Choose the sign", "选定符号"], branchReason(right, h), [`f^{-1}(x) = ${answer}`]],
              ],
              t(
                `$f(${y0}) = ${sub(y0)}^{2}${plus(2 * m)} \\cdot ${sub(y0)}${plus(c)} = ${fy}$, and $f^{-1}(${fy}) = ${right ? "" : "-"}\\sqrt{${fy} - ${sub(k)}}${plus(h)} = ${right ? "" : "-"}2${plus(h)} = ${y0}$.`,
                `$f(${y0}) = ${sub(y0)}^{2}${plus(2 * m)} \\cdot ${sub(y0)}${plus(c)} = ${fy}$，而 $f^{-1}(${fy}) = ${right ? "" : "-"}\\sqrt{${fy} - ${sub(k)}}${plus(h)} = ${right ? "" : "-"}2${plus(h)} = ${y0}$。`,
              ),
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
      `A parabola opening to the ${a.sign() > 0 ? "right" : "left"}, with its vertex marked at (${h}, ${k}) and passing through (${a.add(Q.of(h)).toString()}, ${k + 1}) and (${a.add(Q.of(h)).toString()}, ${k - 1}).`,
      `一条开口向${a.sign() > 0 ? "右" : "左"}的抛物线，标出了顶点 (${h}, ${k})，并经过 (${a.add(Q.of(h)).toString()}, ${k + 1}) 和 (${a.add(Q.of(h)).toString()}, ${k - 1})。`,
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
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSF.BF.B.4.C"],
  intro: t(
    `In $x = y^{2}$ it is $y$ that is chosen and $x$ that is computed. Choosing $y = -2, -1, 0, 1, 2$ gives $x = 4, 1, 0, 1, 4$, so the graph passes through

$$(4, -2), \\quad (1, -1), \\quad (0, 0), \\quad (1, 1), \\quad (4, 2).$$

These points form a parabola lying on its side, opening to the right: the graph of $y = x^{2}$ reflected in the line $y = x$. It is not the graph of a function of $x$, since $x = 4$ meets it twice, but it is a perfectly good function of $y$. Check: $(4, 2)$ fits, since $2^{2} = 4$.

In this lesson we plot points of equations $x = g(y)$, read the vertex and direction of sideways parabolas, and match their graphs with their equations.`,
    `在 $x = y^{2}$ 中，先取的是 $y$，算出的是 $x$。取 $y = -2, -1, 0, 1, 2$，得 $x = 4, 1, 0, 1, 4$，所以图象经过

$$(4, -2), \\quad (1, -1), \\quad (0, 0), \\quad (1, 1), \\quad (4, 2)$$

这些点组成一条横躺、开口向右的抛物线：它是 $y = x^{2}$ 的图象关于直线 $y = x$ 的对称图形。它不是关于 $x$ 的函数的图象，因为 $x = 4$ 与它相交两次，但它是一个完全合格的关于 $y$ 的函数。检验：$(4, 2)$ 满足方程，因为 $2^{2} = 4$。

这节课我们画出方程 $x = g(y)$ 的点，读出横躺抛物线的顶点和开口方向，并把图象与方程配对。`,
  ),
  knowledgePoints: [
    {
      id: "points-on-x-as-a-function-of-y",
      figure: algebraDrawings2["plotting-x-as-a-function-of-y#points-on-x-as-a-function-of-y"],
      title: t("Points on the graph", "图象上的点"),
      explanation: t(
        `In an equation such as $x = y^{2} - 2y$, $x$ is a **function of $y$**: each $y$ gives exactly one $x$. So choose $y$ first, then compute $x$. The graph is still drawn in the usual plane, with $x$ across and $y$ up, and every point is still written $(x, y)$.

Take $y = 3$: $x = 3^{2} - 2 \\cdot 3 = 9 - 6 = 3$, so $(3, 3)$ is on the graph. Take $y = -1$: $x = (-1)^{2} - 2 \\cdot (-1) = 1 + 2 = 3$, so $(3, -1)$ is on it too. Check: $(3, -1)$ has $y = -1$, and $1 + 2 = 3$ is its $x$-coordinate.

> **Watch out.** The number you chose is the **second** coordinate: write $(x, y)$, not the numbers in the order you found them. Put a negative $y$ in parentheses before squaring: $(-1)^{2} = 1$, and $-2 \\cdot (-1) = +2$; dropping a sign gives the value at $-y$ instead.`,
        `在 $x = y^{2} - 2y$ 这样的方程中，$x$ 是 **$y$ 的函数**：每个 $y$ 恰好对应一个 $x$。所以先取 $y$，再算 $x$。图象仍画在通常的坐标平面上，$x$ 轴水平，$y$ 轴竖直，每个点仍写成 $(x, y)$。

取 $y = 3$：$x = 3^{2} - 2 \\cdot 3 = 9 - 6 = 3$，所以 $(3, 3)$ 在图象上。取 $y = -1$：$x = (-1)^{2} - 2 \\cdot (-1) = 1 + 2 = 3$，所以 $(3, -1)$ 也在图象上。检验：$(3, -1)$ 的 $y = -1$，而 $1 + 2 = 3$ 正是它的横坐标。

> **注意。** 你选的数是**第二个**坐标：点要写成 $(x, y)$，而不是按求出数的先后顺序。负的 $y$ 要加括号再平方：$(-1)^{2} = 1$，$-2 \\cdot (-1) = +2$；丢掉一个符号，算出的就是 $-y$ 处的值。`,
      ),
      generate(rng) {
        const g: number[] = rng.bool(0.3) ? [rng.int(-9, 9), rng.nonZero(-5, 5)] : [rng.int(-9, 9), rng.int(-5, 5), rng.nonZero(-3, 3)];
        const c = rng.nonZero(-4, 4);
        const x = evalPoly(g, c);
        const subst = polyLatex(g, "y").replace(/y/g, `(${c})`);
        const parts = g.map((co, i) => co * c ** i).reverse();
        const terms = `${parts[0]}${parts.slice(1).map(plus).join("")} = ${x}`;
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
          solution: walked(
            [
              [
                ["Substitute the $y$-coordinate", "代入纵坐标"],
                t(
                  `Put $y = ${c}$ into the right side, in parentheses, so its sign is kept:`,
                  `把 $y = ${c}$ 加上括号代入右边，保留它的符号：`,
                ),
                [`x = ${subst}`, `x = ${x}`],
              ],
              [
                ["Write the point", "写出这个点"],
                t(
                  `The $x$-coordinate comes first, even though it was found second: the point is $${pt(x, c)}$.`,
                  `横坐标写在前面，虽然它是后求出的：所求点为 $${pt(x, c)}$。`,
                ),
              ],
            ],
            t(
              `Term by term, $${terms}$, and the point's second coordinate is the chosen $${c}$.`,
              `逐项计算，$${terms}$，而这个点的第二个坐标正是所取的 $${c}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "sideways-parabolas",
      figure: algebraDrawings2["plotting-x-as-a-function-of-y#sideways-parabolas"],
      title: t("Sideways parabolas", "开口向左右的抛物线"),
      explanation: t(
        `The graph of $x = a(y - k)^{2} + h$ is the graph of $y = a(x - h)^{2} + k$ with the roles of $x$ and $y$ swapped, that is, reflected in the line $y = x$: a parabola on its side.

- Its **vertex** is $(h, k)$: the square is $0$ when $y = k$, and then $x = h$. The $x$-coordinate is the number added outside.
- Its axis of symmetry is the horizontal line $y = k$.
- The square is never negative, so it opens to the **right** when $a > 0$ (then $x \\ge h$) and to the **left** when $a < 0$ (then $x \\le h$).

Take $x = -(y + 2)^{2} + 4$: the square is $0$ at $y = -2$, where $x = 4$, so the vertex is $(4, -2)$; and $a = -1 < 0$, so it opens to the left. Check: at $y = 0$, $x = -4 + 4 = 0$, which is left of $4$.

> **Watch out.** The vertex is written $(h, k)$ with the outside number first; it is easy to swap them. The number inside the square changes sign: $(y + 2)$ means $k = -2$. A sideways parabola never opens up or down.`,
        `$x = a(y - k)^{2} + h$ 的图象就是把 $y = a(x - h)^{2} + k$ 中 $x$ 与 $y$ 的角色对调，即关于直线 $y = x$ 作对称：一条横躺的抛物线。

- 它的**顶点**是 $(h, k)$：当 $y = k$ 时平方为 $0$，此时 $x = h$。横坐标是括号外加上的数。
- 对称轴是水平直线 $y = k$。
- 平方不会是负数，所以 $a > 0$ 时开口向**右**（此时 $x \\ge h$），$a < 0$ 时开口向**左**（此时 $x \\le h$）。

看 $x = -(y + 2)^{2} + 4$：$y = -2$ 时平方为 $0$，此时 $x = 4$，所以顶点为 $(4, -2)$；$a = -1 < 0$，所以开口向左。检验：$y = 0$ 时 $x = -4 + 4 = 0$，在 $4$ 的左边。

> **注意。** 顶点写成 $(h, k)$，括号外的数在前；很容易把两者对调。平方里的数要变号：$(y + 2)$ 表示 $k = -2$。横躺的抛物线不会开口向上或向下。`,
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
            solution: walked(
              [
                [
                  ["Find where the square is $0$", "找出平方为 $0$ 的位置"],
                  t(
                    `The square $(${shifted(k, "y")})^{2}$ is $0$ when $y = ${k}$, and then $x = ${h}$.`,
                    `当 $y = ${k}$ 时平方 $(${shifted(k, "y")})^{2}$ 为 $0$，此时 $x = ${h}$。`,
                  ),
                ],
                [
                  ["Write the vertex", "写出顶点"],
                  t(`The vertex is $(h, k)$ with the $x$-coordinate first: $${pt(h, k)}$.`, `顶点为 $(h, k)$，横坐标在前：$${pt(h, k)}$。`),
                ],
              ],
              t(
                `At $y = ${k + 1}$ and at $y = ${k - 1}$ the square is $1$, and both give $x = ${num(a.add(Q.of(h)))}$: the graph is symmetric about $y = ${k}$, the line through the vertex.`,
                `$y = ${k + 1}$ 与 $y = ${k - 1}$ 时平方都是 $1$，都得到 $x = ${num(a.add(Q.of(h)))}$：图象关于经过顶点的直线 $y = ${k}$ 对称。`,
              ),
            ),
          });
        return reasoned(
          choiceProblem({
            prompt: t(`In which direction does the graph of $${eq}$ open?`, `$${eq}$ 的图象开口向哪个方向？`),
            options: openOptions,
            correct: a.sign() > 0 ? 0 : 1,
            solution: walked(
              [
                [
                  ["Compare $x$ with the vertex", "把 $x$ 与顶点比较"],
                  t(
                    `The square is never negative and its coefficient $${num(a)}$ is ${a.sign() > 0 ? "positive" : "negative"}, so $x ${a.sign() > 0 ? "\\ge" : "\\le"} ${h}$ for every $y$.`,
                    `平方不会是负数，它的系数 $${num(a)}$ 为${a.sign() > 0 ? "正" : "负"}，所以对每个 $y$ 都有 $x ${a.sign() > 0 ? "\\ge" : "\\le"} ${h}$。`,
                  ),
                ],
                [
                  ["Read the direction", "读出开口方向"],
                  t(
                    `Since $y$ is squared, the parabola lies on its side, and it spreads from its vertex to the ${a.sign() > 0 ? "right" : "left"}: it opens to the ${a.sign() > 0 ? "right" : "left"}.`,
                    `因为平方的是 $y$，抛物线横躺着，从顶点向${a.sign() > 0 ? "右" : "左"}伸展：开口向${a.sign() > 0 ? "右" : "左"}。`,
                  ),
                ],
              ],
              t(
                `At $y = ${k + 2}$ the square is $4$ and $x = ${num(a.mul(Q.of(4)).add(Q.of(h)))}$, which is ${a.sign() > 0 ? "right" : "left"} of the vertex's $x = ${h}$.`,
                `$y = ${k + 2}$ 时平方为 $4$，$x = ${num(a.mul(Q.of(4)).add(Q.of(h)))}$，在顶点 $x = ${h}$ 的${a.sign() > 0 ? "右" : "左"}边。`,
              ),
            ),
          }),
          [
            [
              "Right",
              `The coefficient $${num(a)}$ is negative, so $x$ is never more than $${h}$: the graph spreads to the left of its vertex.`,
              `系数 $${num(a)}$ 是负数，所以 $x$ 不会超过 $${h}$：图象从顶点向左伸展。`,
            ],
            [
              "Left",
              `The coefficient $${num(a)}$ is positive, so $x$ is never less than $${h}$: the graph spreads to the right of its vertex.`,
              `系数 $${num(a)}$ 是正数，所以 $x$ 不会小于 $${h}$：图象从顶点向右伸展。`,
            ],
            [
              "Up",
              "Up and down are for parabolas $y = a(x - h)^{2} + k$, where $x$ is squared. Here $y$ is squared, so the parabola lies on its side and opens left or right.",
              "开口向上或向下的是 $y = a(x - h)^{2} + k$ 这样平方 $x$ 的抛物线。这里平方的是 $y$，抛物线横躺着，开口向左或向右。",
            ],
            [
              "Down",
              "Up and down are for parabolas $y = a(x - h)^{2} + k$, where $x$ is squared. Here $y$ is squared, so the parabola lies on its side and opens left or right.",
              "开口向上或向下的是 $y = a(x - h)^{2} + k$ 这样平方 $x$ 的抛物线。这里平方的是 $y$，抛物线横躺着，开口向左或向右。",
            ],
          ],
        );
      },
    },
    {
      id: "matching-sideways-graphs",
      figure: algebraDrawings2["plotting-x-as-a-function-of-y#matching-sideways-graphs"],
      title: t("Matching graphs and equations", "图象与方程配对"),
      explanation: t(
        `A sideways parabola $x = a(y - k)^{2} + h$ is fixed by three numbers, and the graph shows all of them. The vertex gives $h$ and $k$. One unit above or below the vertex the square is $1$, so there $x = a + h$: the horizontal distance from the vertex to that point is $a$, and its direction gives the sign.

Suppose the vertex is $(1, 2)$, the graph opens to the left, and it passes through $(-1, 3)$. Then $h = 1$, $k = 2$, and $-1 = a + 1$, so $a = -2$:

$$x = -2(y - 2)^{2} + 1.$$

Check: one unit below the vertex, $y = 1$ gives $x = -2 + 1 = -1$, the mirror point $(-1, 1)$.

> **Watch out.** A graph on its side needs $x =$ on the left and $y$ inside the square; $y = a(x - h)^{2} + k$ is an upright parabola. Inside the square the sign of $k$ flips. The sign of $a$ must match the direction: left means negative. Do not swap the coordinates of the vertex.`,
        `横躺的抛物线 $x = a(y - k)^{2} + h$ 由三个数确定，图象把它们都显示出来了。顶点给出 $h$ 和 $k$。在顶点上方或下方一个单位处，平方为 $1$，所以那里 $x = a + h$：从顶点到这个点的水平距离就是 $a$，方向给出符号。

设顶点为 $(1, 2)$，开口向左，且经过 $(-1, 3)$。则 $h = 1$，$k = 2$，$-1 = a + 1$，所以 $a = -2$：

$$x = -2(y - 2)^{2} + 1$$

检验：在顶点下方一个单位处，$y = 1$ 得 $x = -2 + 1 = -1$，正是对称点 $(-1, 1)$。

> **注意。** 横躺的图象需要左边是 $x =$、平方里是 $y$；$y = a(x - h)^{2} + k$ 是竖直的抛物线。平方里 $k$ 的符号要反过来。$a$ 的符号必须与开口方向一致：向左就是负的。不要把顶点的两个坐标对调。`,
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
        const opens = (c: Q) => (c.sign() > 0 ? t("right", "右") : t("left", "左"));
        return {
          ...reasoned(
            choiceProblem({
              prompt: t("Which equation has the graph shown?", "哪个方程的图象如下图所示？"),
              options: order.map((i) => t(`$${candidates[i]}$`, `$${candidates[i]}$`)),
              correct: order.indexOf(0),
              solution: walked(
                [
                  [
                    ["Read the vertex and the direction", "读出顶点和开口方向"],
                    t(
                      `The vertex is $${pt(h, kk)}$ and the parabola opens to the ${opens(a).en}, so it lies on its side: $x$ is a function of $y$, $x = a(y - k)^{2} + h$ with $h = ${h}$ and $k = ${kk}$.`,
                      `顶点为 $${pt(h, kk)}$，抛物线开口向${opens(a)["zh-CN"]}，所以它横躺着：$x$ 是 $y$ 的函数，$x = a(y - k)^{2} + h$，其中 $h = ${h}$，$k = ${kk}$。`,
                    ),
                  ],
                  [
                    ["Find $a$ from one more point", "用另一个点求 $a$"],
                    t(
                      `One unit above the vertex, at $y = ${kk + 1}$, the graph has $x = ${num(a.add(Q.of(h)))}$. There the square is $1$, so $x = a + h$:`,
                      `在顶点上方一个单位处，$y = ${kk + 1}$，图象上 $x = ${num(a.add(Q.of(h)))}$。那里平方为 $1$，所以 $x = a + h$：`,
                    ),
                    [`${num(a.add(Q.of(h)))} = a${plus(h)}`, `a = ${num(a)}`, candidates[0]!],
                  ],
                ],
                t(
                  `The sign of $a = ${num(a)}$ matches the opening to the ${opens(a).en}, and one unit below the vertex, $y = ${kk - 1}$ gives $x = ${num(a)} \\cdot 1${plus(h)} = ${num(a.add(Q.of(h)))}$, the mirror point.`,
                  `$a = ${num(a)}$ 的符号与开口向${opens(a)["zh-CN"]}一致；在顶点下方一个单位处，$y = ${kk - 1}$ 得 $x = ${num(a)} \\cdot 1${plus(h)} = ${num(a.add(Q.of(h)))}$，正是对称点。`,
                ),
              ),
            }),
            [
              [
                `$${candidates[1]}$`,
                "Here $x$ is squared, so $y$ is a function of $x$ and the graph is an upright parabola opening up or down, not one on its side.",
                "这里平方的是 $x$，$y$ 是 $x$ 的函数，图象是开口向上或向下的竖直抛物线，而不是横躺的。",
              ],
              [
                `$${candidates[2]}$`,
                `The sign inside the square is wrong: this parabola has its vertex at $${pt(h, -kk)}$, not $${pt(h, kk)}$.`,
                `平方里的符号错了：这条抛物线的顶点在 $${pt(h, -kk)}$，不在 $${pt(h, kk)}$。`,
              ],
              [
                `$${candidates[3]}$`,
                `The coefficient has the wrong sign: this parabola opens to the ${opens(a.neg()).en}, but the graph opens to the ${opens(a).en}.`,
                `系数的符号错了：这条抛物线开口向${opens(a.neg())["zh-CN"]}，而图象开口向${opens(a)["zh-CN"]}。`,
              ],
              [
                `$${candidates[4]}$`,
                `The two coordinates of the vertex are swapped: this parabola has its vertex at $${pt(kk, h)}$, not $${pt(h, kk)}$.`,
                `顶点的两个坐标对调了：这条抛物线的顶点在 $${pt(kk, h)}$，不在 $${pt(h, kk)}$。`,
              ],
            ],
          ),
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
  intro: t(
    `Suppose a function repeats its values every $4$ units: $f(0) = 2$, $f(1) = -1$, $f(2) = 5$, $f(3) = 0$, and then $f(4) = 2$, $f(5) = -1$, and so on in both directions. To find $f(18)$ there is no need to list sixteen more values. Since $18 = 4 \\cdot 4 + 2$, moving back $4$ periods lands on $2$:

$$f(18) = f(18 - 16) = f(2) = 5.$$

Check: $f(18) = f(14) = f(10) = f(6) = f(2)$, one period at a time.

In this lesson we read the period of a function from its graph and use it to find values far from those given, in a table or on a graph.`,
    `设一个函数每隔 $4$ 个单位重复它的值：$f(0) = 2$，$f(1) = -1$，$f(2) = 5$，$f(3) = 0$，然后 $f(4) = 2$，$f(5) = -1$，向两个方向都这样延续。求 $f(18)$ 时不必再列出十六个值。因为 $18 = 4 \\cdot 4 + 2$，往回移 $4$ 个周期就落到 $2$：

$$f(18) = f(18 - 16) = f(2) = 5$$

检验：$f(18) = f(14) = f(10) = f(6) = f(2)$，每次移一个周期。

这节课我们从图象读出函数的周期，并用周期求远离已知值处的函数值，已知值可以在表格中，也可以在图象上。`,
  ),
  knowledgePoints: [
    {
      id: "the-period-from-a-graph",
      figure: algebraDrawings2["periodic-functions#the-period-from-a-graph"],
      title: t("The period from a graph", "从图象求周期"),
      explanation: t(
        `A function $f$ is **periodic** with period $p > 0$ if $f(x + p) = f(x)$ for every $x$: shifting the graph $p$ units to the right lands it exactly on itself, so the graph is one piece copied over and over. Any multiple of a period is also a shift that works, so the **period** is the smallest such $p$.

To read it from a graph, pick a recognizable point, such as a peak, and measure the horizontal distance to the next point where the same pattern starts again. If the peaks are at $x = -3, 1, 5$, the distance from one to the next is $1 - (-3) = 4$, and the period is $4$. Check: the whole piece from $x = 1$ to $x = 5$ appears again from $x = 5$ to $x = 9$.

> **Watch out.** The period is a horizontal distance, a difference of $x$-values, not a count of points or segments; counting the points from one peak to the next, both included, gives one too many. Shifting by two periods also works, but it is not the smallest shift. Make sure the whole pattern repeats, not just the height of one point.`,
        `若对每个 $x$ 都有 $f(x + p) = f(x)$（$p > 0$），则函数 $f$ 是**周期函数**：把图象向右平移 $p$ 个单位，它与自身完全重合，所以图象是一段反复复制而成的。周期的任何倍数也都是可行的平移，所以**周期**指最小的这样的 $p$。

从图象读周期：选一个容易辨认的点（如峰顶），量出到同样的图形再次开始处的水平距离。若峰顶在 $x = -3, 1, 5$，相邻两个的距离是 $1 - (-3) = 4$，周期为 $4$。检验：从 $x = 1$ 到 $x = 5$ 的整段图形在 $x = 5$ 到 $x = 9$ 又出现一次。

> **注意。** 周期是水平距离，是 $x$ 值之差，而不是点或线段的个数；从一个峰顶数到下一个峰顶，两端都算，会多数一个。平移两个周期也能重合，但那不是最小的平移。要确认整个图形都重复，而不只是某一个点的高度相同。`,
      ),
      generate(rng) {
        const p = rng.int(2, 6);
        const ys = periodicPattern(rng, p);
        const fails = range(1, p - 1).map((d) => {
          const i = range(0, p - 1).find((j) => ys[(j + d) % p] !== ys[j])!;
          return `$f(${i} + ${d}) = ${ys[(i + d) % p]} \\ne ${ys[i]} = f(${i})$`;
        });
        return annotate(
          {
            ...numberProblem({
              prompt: t(
                `${graphShown.en} The pattern continues in both directions forever. Find the period of $f$.`,
                `${graphShown["zh-CN"]}图形向两个方向无限延续。求 $f$ 的周期。`,
              ),
              answer: p,
              wrong: [2 * p, p + 1, p - 1],
              solution: walked(
                [
                  [
                    ["Find where the pattern starts again", "找出图形重新开始的位置"],
                    t(
                      `Start at $${pt(0, ys[0]!)}$ and follow the graph to the right. From $x = ${p}$ on, it repeats the piece from $x = 0$ to $x = ${p}$: $f(${p}) = ${ys[0]}$, $f(${p + 1}) = ${ys[1 % p]}$, and so on.`,
                      `从 $${pt(0, ys[0]!)}$ 出发，沿图象向右看。从 $x = ${p}$ 起，图象重复从 $x = 0$ 到 $x = ${p}$ 的那一段：$f(${p}) = ${ys[0]}$，$f(${p + 1}) = ${ys[1 % p]}$，依此类推。`,
                    ),
                  ],
                  [
                    ["Rule out shorter shifts", "排除更短的平移"],
                    t(
                      `${p === 2 ? "A shift of $1$ fails" : `Every shift from $1$ to $${p - 1}$ fails`}: ${fails.join(", ")}. So the period is the distance $${p} - 0 = ${p}$.`,
                      `${p === 2 ? "平移 $1$ 不能重合" : `从 $1$ 到 $${p - 1}$ 的每个平移都不能重合`}：${fails.join("，")}。所以周期是距离 $${p} - 0 = ${p}$。`,
                    ),
                  ],
                ],
                t(
                  `One more period on, $f(${2 * p}) = ${ys[0]}$ and $f(${2 * p + 1}) = ${ys[1 % p]}$ again: the piece repeats every $${p}$.`,
                  `再过一个周期，$f(${2 * p}) = ${ys[0]}$，$f(${2 * p + 1}) = ${ys[1 % p]}$，又一次相同：图形每 $${p}$ 个单位重复一次。`,
                ),
              ),
            }),
            figure: periodicFigure(ys),
          },
          view,
          [{ kind: "arrow", from: [0, ys[0]!], to: [p, ys[0]!], tone: "result" }],
          `The pattern repeats every ${p}.`,
          `图象每隔 ${p} 重复一次。`,
        );
      },
    },
    {
      id: "values-from-the-period",
      title: t("Values from the period", "用周期求函数值"),
      explanation: t(
        `If $f$ has period $p$, adding or subtracting $p$ to the input does not change the output, and doing it again and again shows the same for any multiple of $p$. So to find $f$ at a large input, divide by $p$: write the input as a multiple of $p$ plus a remainder between $0$ and $p - 1$, and the value is the one at the remainder.

If $f$ has period $5$ and $f(3) = -2$, then $38 = 7 \\cdot 5 + 3$, so $f(38) = f(38 - 35) = f(3) = -2$. For a negative input the multiple is negative: $-7 = -2 \\cdot 5 + 3$, so $f(-7) = f(-7 + 10) = f(3) = -2$. Check: $-7 + 5 = -2$ and $-2 + 5 = 3$, two periods.

> **Watch out.** The remainder must be between $0$ and $p - 1$, even for a negative input: $-7 = -1 \\cdot 5 - 2$ is true, but $-2$ is not in the table, and reading $f(2)$ instead is wrong. Check the division by multiplying back, since a remainder off by one reads the neighbouring value of the table.`,
        `若 $f$ 的周期为 $p$，输入加上或减去 $p$，输出不变；反复这样做，可知加减 $p$ 的任何倍数也是如此。所以求 $f$ 在很大的输入处的值，就用 $p$ 去除：把输入写成 $p$ 的倍数加上 $0$ 到 $p - 1$ 之间的余数，函数值就等于余数处的值。

若 $f$ 的周期为 $5$，$f(3) = -2$，则 $38 = 7 \\cdot 5 + 3$，所以 $f(38) = f(38 - 35) = f(3) = -2$。输入为负数时倍数也是负的：$-7 = -2 \\cdot 5 + 3$，所以 $f(-7) = f(-7 + 10) = f(3) = -2$。检验：$-7 + 5 = -2$，$-2 + 5 = 3$，正好两个周期。

> **注意。** 余数必须在 $0$ 到 $p - 1$ 之间，输入为负数时也是如此：$-7 = -1 \\cdot 5 - 2$ 虽然成立，但 $-2$ 不在表中，改读 $f(2)$ 是错的。用乘回去的方法检查除法，因为余数差一，读到的就是表中相邻的值。`,
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
          solution: walked(
            [
              [
                ["Divide by the period", "用周期去除"],
                t(
                  `Write $${n}$ as a multiple of $${p}$ plus a remainder between $0$ and $${p - 1}$:`,
                  `把 $${n}$ 写成 $${p}$ 的倍数加上 $0$ 到 $${p - 1}$ 之间的余数：`,
                ),
                [`${n} = ${sub(q)} \\cdot ${p}${plus(r)}`],
              ],
              [
                ["Shift by whole periods", "平移整数个周期"],
                t(
                  `${q >= 0 ? "Subtracting" : "Adding"} $${Math.abs(q)}$ period${Math.abs(q) === 1 ? "" : "s"}, that is $${Math.abs(q * p)}$, does not change the value:`,
                  `${q >= 0 ? "减去" : "加上"} $${Math.abs(q)}$ 个周期，即 $${Math.abs(q * p)}$，函数值不变：`,
                ),
                [`f(${n}) = f(${n}${plus(-q * p)}) = f(${r})`],
              ],
              [
                ["Read the table", "查表"],
                t(
                  `The table gives $f(${r}) = ${ys[r]}$, so $f(${n}) = ${ys[r]}$.`,
                  `由表得 $f(${r}) = ${ys[r]}$，所以 $f(${n}) = ${ys[r]}$。`,
                ),
              ],
            ],
            t(
              `$${sub(q)} \\cdot ${p}${plus(r)} = ${q * p}${plus(r)} = ${n}$, and the remainder $${r}$ is between $0$ and $${p - 1}$, so it is in the table.`,
              `$${sub(q)} \\cdot ${p}${plus(r)} = ${q * p}${plus(r)} = ${n}$，余数 $${r}$ 在 $0$ 到 $${p - 1}$ 之间，所以在表中。`,
            ),
          ),
        });
      },
    },
    {
      id: "periodic-values-from-a-graph",
      figure: algebraDrawings2["periodic-functions#periodic-values-from-a-graph"],
      title: t("Values far along the graph", "图象远处的函数值"),
      explanation: t(
        `When only part of a periodic graph is visible, the window still holds a whole period, and that is enough: first read the period, then move the input back into the window by a multiple of the period, and read the height there.

Suppose the graph repeats every $3$ units and passes through $(1, 4)$. Then $31 = 10 \\cdot 3 + 1$, so

$$f(31) = f(31 - 30) = f(1) = 4.$$

Check: one period to the left, the graph also passes through $(-2, 4)$, as it must if every shift by $3$ keeps the value.

> **Watch out.** Read the period as a horizontal distance before using it; a wrong period sends the input to the wrong place. For a negative input add periods until the input is between $0$ and $p - 1$. Read the height at the reduced input, not at its neighbour or at the opposite number.`,
        `当只能看到周期函数图象的一部分时，窗口里仍有完整的一个周期，这就足够了：先读出周期，再把输入平移周期的若干倍，移回窗口中，读出那里的高度。

设图象每 $3$ 个单位重复一次，且经过 $(1, 4)$。则 $31 = 10 \\cdot 3 + 1$，所以

$$f(31) = f(31 - 30) = f(1) = 4$$

检验：向左一个周期，图象也经过 $(-2, 4)$，因为每平移 $3$ 函数值都不变。

> **注意。** 先把周期当作水平距离读准，再使用它；周期错了，输入就被移到错误的位置。输入为负数时，加上若干个周期，直到它落在 $0$ 到 $p - 1$ 之间。读的是化简后输入处的高度，而不是旁边一点或相反数处的高度。`,
      ),
      generate(rng) {
        const p = rng.int(2, 6);
        const ys = periodicPattern(rng, p);
        const n = rng.bool(0.75) ? rng.int(10, 60) : -rng.int(10, 40);
        const r = mod(n, p);
        const q = (n - r) / p;
        return annotate(
          {
            ...numberProblem({
              prompt: t(
                `${graphShown.en} The pattern continues in both directions forever. Find $f(${n})$.`,
                `${graphShown["zh-CN"]}图形向两个方向无限延续。求 $f(${n})$。`,
              ),
              answer: ys[r]!,
              wrong: [ys[mod(n + 1, p)]!, ys[mod(n - 1, p)]!, ys[mod(-n, p)]!],
              solution: walked(
                [
                  [
                    ["Read the period", "读出周期"],
                    t(
                      `The graph repeats every $${p}$ units: $f(0) = f(${p}) = ${ys[0]}$, and the whole piece between them is copied.`,
                      `图象每 $${p}$ 个单位重复一次：$f(0) = f(${p}) = ${ys[0]}$，两点之间的整段图形被复制。`,
                    ),
                  ],
                  [
                    ["Move the input into the window", "把输入移回窗口"],
                    t(
                      `Divide by the period, and ${q >= 0 ? "subtract" : "add"} $${Math.abs(q)}$ period${Math.abs(q) === 1 ? "" : "s"}:`,
                      `用周期去除，再${q >= 0 ? "减去" : "加上"} $${Math.abs(q)}$ 个周期：`,
                    ),
                    [`${n} = ${sub(q)} \\cdot ${p}${plus(r)}`, `f(${n}) = f(${r})`],
                  ],
                  [
                    ["Read the graph", "读图"],
                    t(
                      `Above $x = ${r}$ the graph is at height $${ys[r]}$, so $f(${n}) = ${ys[r]}$.`,
                      `在 $x = ${r}$ 处图象的高度为 $${ys[r]}$，所以 $f(${n}) = ${ys[r]}$。`,
                    ),
                  ],
                ],
                t(
                  `$${sub(q)} \\cdot ${p}${plus(r)} = ${n}$, and one period to the left the graph is at the same height: $f(${r - p}) = ${ys[r]}$.`,
                  `$${sub(q)} \\cdot ${p}${plus(r)} = ${n}$，向左一个周期，图象的高度相同：$f(${r - p}) = ${ys[r]}$。`,
                ),
              ),
            }),
            figure: periodicFigure(ys),
          },
          view,
          [{ kind: "point", at: [r, ys[r]!], label: at([r, ys[r]!]), dir: "n", tone: "result" }],
          `${n} = ${p} · ${q} + ${r}, so the value is the one at x = ${r}: ${ys[r]}.`,
          `${n} = ${p} · ${q} + ${r}，所以函数值等于 x = ${r} 处的值：${ys[r]}。`,
        );
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
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3"],
  intro: t(
    `Compare $g(x) = x^{2}$ and $h(x) = x^{3}$ at $2$ and $-2$:

$$g(-2) = 4 = g(2), \\qquad h(-2) = -8 = -h(2).$$

The same happens at every $x$. Changing the sign of the input leaves $x^{2}$ alone, so the graph of $g$ is its own mirror image in the $y$-axis; it changes the sign of $x^{3}$, so the graph of $h$ matches itself after a half-turn about the origin. Functions like $g$ are called even, functions like $h$ odd. Check: $(3, 27)$ is on the graph of $h$, and so is $(-3, -27)$.

In this lesson we recognize even and odd functions from their graphs and their formulas, and use the symmetry to find values.`,
    `在 $2$ 和 $-2$ 处比较 $g(x) = x^{2}$ 与 $h(x) = x^{3}$：

$$g(-2) = 4 = g(2), \\qquad h(-2) = -8 = -h(2)$$

在每个 $x$ 处都是如此。输入变号时 $x^{2}$ 不变，所以 $g$ 的图象关于 $y$ 轴与自身对称；$x^{3}$ 则变号，所以 $h$ 的图象绕原点旋转半周后与自身重合。像 $g$ 这样的函数叫偶函数，像 $h$ 这样的叫奇函数。检验：$(3, 27)$ 在 $h$ 的图象上，$(-3, -27)$ 也在。

这节课我们从图象和解析式识别偶函数与奇函数，并利用对称性求函数值。`,
  ),
  knowledgePoints: [
    {
      id: "even-and-odd-from-a-graph",
      figure: algebraDrawings2["even-and-odd-functions#even-and-odd-from-a-graph"],
      title: t("Even and odd graphs", "奇偶函数的图象"),
      explanation: t(
        `A function is **even** if $f(-x) = f(x)$ for every $x$. The points $(x, y)$ and $(-x, y)$ are mirror images in the $y$-axis, so the graph is symmetric about the $y$-axis: folding along it matches the two halves. A function is **odd** if $f(-x) = -f(x)$. The points $(x, y)$ and $(-x, -y)$ are swapped by a half-turn about $(0, 0)$, so the graph is symmetric about the origin.

Test pairs of points. If $(2, 3)$ is on the graph, an even function also passes through $(-2, 3)$, an odd one through $(-2, -3)$. Suppose the graph also passes through $(-2, -3)$, $(4, 1)$, $(-4, -1)$ and $(0, 0)$: every point has its partner across the origin, so the function is odd. Check: $f(0) = -f(0)$ forces $f(0) = 0$, and the graph does pass through the origin.

> **Watch out.** Even means a mirror image in the $y$-axis, odd a half-turn about the origin; do not swap the two. One matching pair is not enough: every point needs its partner, and a single failure makes the test fail. Passing through the origin does not make a function odd, and a graph that fails both tests is neither.`,
        `若对每个 $x$ 都有 $f(-x) = f(x)$，则函数是**偶函数**。点 $(x, y)$ 与 $(-x, y)$ 关于 $y$ 轴对称，所以图象关于 $y$ 轴对称：沿 $y$ 轴对折，两半重合。若 $f(-x) = -f(x)$，则函数是**奇函数**。点 $(x, y)$ 与 $(-x, -y)$ 绕 $(0, 0)$ 旋转半周后互换，所以图象关于原点对称。

成对检验点。若 $(2, 3)$ 在图象上，偶函数还经过 $(-2, 3)$，奇函数还经过 $(-2, -3)$。设图象还经过 $(-2, -3)$、$(4, 1)$、$(-4, -1)$ 和 $(0, 0)$：每个点在原点另一侧都有对应点，所以函数是奇函数。检验：$f(0) = -f(0)$ 迫使 $f(0) = 0$，图象确实经过原点。

> **注意。** 偶函数是关于 $y$ 轴的镜像，奇函数是绕原点旋转半周；不要把两者弄反。一对点相符还不够：每个点都要有对应点，只要有一处不符，检验就不通过。经过原点并不能说明函数是奇函数；两种检验都不通过的图象两者都不是。`,
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
        const e = pts.find(([x, y]) => !valueOn(pts, -x)!.eq(Q.of(y)));
        const o = pts.find(([x, y]) => !valueOn(pts, -x)!.eq(Q.of(-y)));
        const miss = ([x, y]: Point, odd: boolean) =>
          t(
            `$f(${x}) = ${y}$ but $f(${-x}) = ${num(valueOn(pts, -x)!)}$, not $${odd ? -y : y}$`,
            `$f(${x}) = ${y}$，但 $f(${-x}) = ${num(valueOn(pts, -x)!)}$，不是 $${odd ? -y : y}$`,
          );
        const [start, end] = [pts[0]![1], pts[pts.length - 1]![1]];
        const reasons: [string, string, string][] = [];
        if (e)
          reasons.push([
            "Even",
            `The graph is not symmetric about the $y$-axis: ${miss(e, false).en}.`,
            `图象不关于 $y$ 轴对称：${miss(e, false)["zh-CN"]}。`,
          ]);
        if (o)
          reasons.push([
            "Odd",
            `The graph is not symmetric about the origin: ${miss(o, true).en}.`,
            `图象不关于原点对称：${miss(o, true)["zh-CN"]}。`,
          ]);
        reasons.push(
          kind === 1
            ? [
                "Neither",
                "Every point has a partner across the origin at the opposite height, so the function is odd.",
                "每个点在原点另一侧都有高度相反的对应点，所以函数是奇函数。",
              ]
            : [
                "Neither",
                "Every point has a mirror image in the $y$-axis at the same height, so the function is even.",
                "每个点在 $y$ 轴另一侧都有同样高度的对应点，所以函数是偶函数。",
              ],
        );
        return {
          ...reasoned(
            choiceProblem({
              prompt: t(`${graphShown.en} Is $f$ even, odd, or neither?`, `${graphShown["zh-CN"]}$f$ 是偶函数、奇函数，还是都不是？`),
              options: parityOptions,
              correct: kind,
              solution: walked(
                [
                  [
                    ["Compare a point with its partners", "把一个点与它的对应点比较"],
                    t(
                      `The graph has $f(${x0}) = ${y0}$ and $f(${-x0}) = ${num(m)}$. An even function needs $f(${-x0}) = ${y0}$; an odd one needs $f(${-x0}) = ${-y0}$.`,
                      `图象上 $f(${x0}) = ${y0}$，$f(${-x0}) = ${num(m)}$。偶函数要求 $f(${-x0}) = ${y0}$；奇函数要求 $f(${-x0}) = ${-y0}$。`,
                    ),
                  ],
                  [
                    ["Test every point", "检验每一个点"],
                    kind === 0
                      ? t(
                          "Every corner of the graph has its mirror image in the $y$-axis at the same height, so the graph is symmetric about the $y$-axis: $f$ is even.",
                          "图象的每个拐点在 $y$ 轴另一侧都有同样高度的对应点，所以图象关于 $y$ 轴对称：$f$ 是偶函数。",
                        )
                      : kind === 1
                        ? t(
                            "Every corner of the graph has a partner across the origin at the opposite height, so the graph is symmetric about the origin: $f$ is odd.",
                            "图象的每个拐点在原点另一侧都有高度相反的对应点，所以图象关于原点对称：$f$ 是奇函数。",
                          )
                        : t(
                            `Both tests fail somewhere: ${miss(e!, false).en}, and ${miss(o!, true).en}. So $f$ is neither even nor odd.`,
                            `两种检验都有不符之处：${miss(e!, false)["zh-CN"]}；${miss(o!, true)["zh-CN"]}。所以 $f$ 既不是偶函数也不是奇函数。`,
                          ),
                  ],
                ],
                kind === 0
                  ? t(
                      `At the ends, $f(5) = ${end}$ and $f(-5) = ${start}$: the same height, as for an even function.`,
                      `在两端，$f(5) = ${end}$，$f(-5) = ${start}$：高度相同，符合偶函数。`,
                    )
                  : kind === 1
                    ? t(
                        `At the ends, $f(5) = ${end}$ and $f(-5) = ${start}$: opposite heights, and $f(0) = 0$, as for an odd function.`,
                        `在两端，$f(5) = ${end}$，$f(-5) = ${start}$：高度相反，且 $f(0) = 0$，符合奇函数。`,
                      )
                    : t(
                        `Folding along the $y$-axis would need the point $${pt(-e![0], e![1])}$, and a half-turn the point $${pt(-o![0], -o![1])}$; neither is on the graph.`,
                        `沿 $y$ 轴对折需要点 $${pt(-e![0], e![1])}$，绕原点旋转半周需要点 $${pt(-o![0], -o![1])}$；两点都不在图象上。`,
                      ),
              ),
            }),
            reasons,
          ),
          figure: segmentsFigure(pts),
        };
      },
    },
    {
      id: "even-and-odd-from-a-formula",
      title: t("Even and odd formulas", "由解析式判断奇偶"),
      explanation: t(
        `To decide from a formula, work out $f(-x)$ and compare it with $f(x)$ and with $-f(x)$. For powers, $(-x)^{n} = x^{n}$ when $n$ is even and $(-x)^{n} = -x^{n}$ when $n$ is odd. So a polynomial is

- even when all its powers are even (a constant counts as $x^{0}$),
- odd when all its powers are odd,
- neither when it mixes even and odd powers.

Take $f(x) = 2x^{5} - x^{3} + 4x$. Every power is odd, so every term changes sign:

$$f(-x) = -2x^{5} + x^{3} - 4x = -f(x),$$

and $f$ is odd. Check: $f(1) = 5$ and $f(-1) = -5$. Adding $+1$ would make it neither: the constant keeps its sign while the other terms change.

> **Watch out.** Only the exponents matter, not the signs of the coefficients: $-3x^{4}$ is an even term. A constant term is an even power, so $x^{3} + 2$ is not odd. Mixed powers give neither, never both.`,
        `由解析式判断时，算出 $f(-x)$，再与 $f(x)$ 和 $-f(x)$ 比较。对于幂，$n$ 为偶数时 $(-x)^{n} = x^{n}$，$n$ 为奇数时 $(-x)^{n} = -x^{n}$。所以多项式

- 所有次数都是偶数时是偶函数（常数项算作 $x^{0}$），
- 所有次数都是奇数时是奇函数，
- 奇偶次数混合时两者都不是。

看 $f(x) = 2x^{5} - x^{3} + 4x$。所有次数都是奇数，所以每一项都变号：

$$f(-x) = -2x^{5} + x^{3} - 4x = -f(x)$$

$f$ 是奇函数。检验：$f(1) = 5$，$f(-1) = -5$。若再加上 $+1$，就两者都不是：常数不变号，其他项却变号。

> **注意。** 只看次数，不看系数的符号：$-3x^{4}$ 是偶次项。常数项是偶次幂，所以 $x^{3} + 2$ 不是奇函数。次数混合时两者都不是，绝不会两者都是。`,
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
        const fMinus = poly(...terms.map(([c, d]) => term(-c, d)));
        const fAt = (x: number) => terms.reduce((acc, [c, d]) => acc + c * x ** d, 0);
        const evenPart = (x: number) => terms.reduce((acc, [c, d]) => acc + (d % 2 === 0 ? c * x ** d : 0), 0);
        const oddPart = (x: number) => terms.reduce((acc, [c, d]) => acc + (d % 2 === 1 ? c * x ** d : 0), 0);
        const xa = range(1, 6).find((x) => (kind === 2 ? evenPart(x) !== 0 && oddPart(x) !== 0 : fAt(x) !== 0)) ?? 1;
        const [va, wa] = [fAt(xa), fAt(-xa)];
        const reasons: [string, string, string][] = [
          [
            "Even",
            `$f(-x) = ${fNeg}$, which is not $f(x)$: the terms with odd powers change sign.`,
            `$f(-x) = ${fNeg}$，不等于 $f(x)$：奇次项变号了。`,
          ],
          [
            "Odd",
            `$f(-x) = ${fNeg}$, which is not $-f(x) = ${fMinus}$: the terms with even powers${degrees.includes(0) ? ", the constant among them," : ""} keep their sign.`,
            `$f(-x) = ${fNeg}$，不等于 $-f(x) = ${fMinus}$：偶次项${degrees.includes(0) ? "（包括常数项）" : ""}不变号。`,
          ],
          kind === 1
            ? [
                "Neither",
                "All the powers are odd, so $f(-x) = -f(x)$ exactly: $f$ is odd.",
                "所有次数都是奇数，所以恰好 $f(-x) = -f(x)$：$f$ 是奇函数。",
              ]
            : [
                "Neither",
                "All the powers are even, so $f(-x) = f(x)$ exactly: $f$ is even.",
                "所有次数都是偶数，所以恰好 $f(-x) = f(x)$：$f$ 是偶函数。",
              ],
        ];
        return reasoned(
          choiceProblem({
            prompt: t(`Is $f(x) = ${f}$ even, odd, or neither?`, `$f(x) = ${f}$ 是偶函数、奇函数，还是都不是？`),
            options: parityOptions,
            correct: kind,
            solution: walked(
              [
                [
                  ["Replace $x$ by $-x$", "把 $x$ 换成 $-x$"],
                  t(
                    "Even powers of $-x$ equal those of $x$, and odd powers change sign, so only the terms with odd powers change:",
                    "$-x$ 的偶次幂等于 $x$ 的偶次幂，奇次幂则变号，所以只有奇次项变号：",
                  ),
                  [`f(-x) = ${fNeg}`],
                ],
                [
                  ["Compare with $f(x)$ and $-f(x)$", "与 $f(x)$ 和 $-f(x)$ 比较"],
                  [
                    t(
                      `The powers are all even, so nothing changed: $f(-x) = f(x)$, and $f$ is even.`,
                      `次数都是偶数，什么都没变：$f(-x) = f(x)$，$f$ 是偶函数。`,
                    ),
                    t(
                      `The powers are all odd, so every term changed sign: $f(-x) = -f(x)$, and $f$ is odd.`,
                      `次数都是奇数，每一项都变号：$f(-x) = -f(x)$，$f$ 是奇函数。`,
                    ),
                    t(
                      `The powers are mixed, so some terms changed sign and some did not: $f(-x)$ is neither $f(x)$ nor $-f(x) = ${fMinus}$. So $f$ is neither even nor odd.`,
                      `次数奇偶混合，有的项变号，有的不变：$f(-x)$ 既不是 $f(x)$，也不是 $-f(x) = ${fMinus}$。所以 $f$ 两者都不是。`,
                    ),
                  ][kind]!,
                ],
              ],
              t(
                `$f(${xa}) = ${va}$ and $f(${-xa}) = ${wa}$: ${["equal", "opposite", "neither equal nor opposite"][kind]}.`,
                `$f(${xa}) = ${va}$，$f(${-xa}) = ${wa}$：${["相等", "互为相反数", "既不相等也不互为相反数"][kind]}。`,
              ),
            ),
          }),
          reasons,
        );
      },
    },
    {
      id: "using-symmetry",
      title: t("Using symmetry", "利用对称性"),
      explanation: t(
        `If a function is known to be even or odd, its values for $x \\ge 0$ decide all the others, because each negative input is paired with a positive one:

- even: $f(-x) = f(x)$;
- odd: $f(-x) = -f(x)$.

Suppose $f$ is odd and $f(x) = x^{2} - 3x$ for $x \\ge 0$. To find $f(-4)$, go to the positive partner:

$$f(-4) = -f(4) = -(4^{2} - 3 \\cdot 4) = -(16 - 12) = -4.$$

Check: $f(4) + f(-4) = 4 + (-4) = 0$, as it must be for an odd function.

> **Watch out.** Substituting $-4$ into the formula is wrong: the formula holds only for $x \\ge 0$, and here it would give $28$. For an odd function do not forget the minus sign in front of $f(4)$; for an even one there is none.`,
        `若已知函数是偶函数或奇函数，它在 $x \\ge 0$ 时的值决定了其余的值，因为每个负的输入都与一个正的输入配对：

- 偶函数：$f(-x) = f(x)$；
- 奇函数：$f(-x) = -f(x)$。

设 $f$ 是奇函数，且当 $x \\ge 0$ 时 $f(x) = x^{2} - 3x$。求 $f(-4)$ 时，转到与它配对的正数：

$$f(-4) = -f(4) = -(4^{2} - 3 \\cdot 4) = -(16 - 12) = -4$$

检验：$f(4) + f(-4) = 4 + (-4) = 0$，奇函数正应如此。

> **注意。** 把 $-4$ 直接代入公式是错的：公式只对 $x \\ge 0$ 成立，这样会得到 $28$。奇函数不要忘了 $f(4)$ 前面的负号；偶函数则没有负号。`,
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
          solution: walked(
            [
              [
                ["Go to the positive partner", "转到配对的正数"],
                t(
                  `The formula holds only for $x \\ge 0$, so use the symmetry of ${odd ? "an odd" : "an even"} function:`,
                  `公式只对 $x \\ge 0$ 成立，所以利用${odd ? "奇" : "偶"}函数的对称性：`,
                ),
                [`f(${-c}) = ${odd ? "-" : ""}f(${c})`],
              ],
              [
                ["Evaluate at the positive input", "在正数处求值"],
                t(`Now $${c} \\ge 0$, so the formula applies:`, `现在 $${c} \\ge 0$，可以用公式：`),
                [`f(${c}) = ${work} = ${fc}`],
              ],
              [
                ["Finish", "得出结果"],
                t(`So $f(${-c}) = ${odd ? `-(${fc})` : fc} = ${answer}$.`, `所以 $f(${-c}) = ${odd ? `-(${fc})` : fc} = ${answer}$。`),
              ],
            ],
            t(
              odd
                ? `$f(${c}) + f(${-c}) = ${fc} + ${sub(answer)} = 0$, as for an odd function.`
                : `$f(${c}) - f(${-c}) = ${fc} - ${sub(answer)} = 0$, as for an even function.`,
              odd
                ? `$f(${c}) + f(${-c}) = ${fc} + ${sub(answer)} = 0$，奇函数正应如此。`
                : `$f(${c}) - f(${-c}) = ${fc} - ${sub(answer)} = 0$，偶函数正应如此。`,
            ),
          ),
        });
      },
    },
  ],
};

// Topic: products of even and odd functions.

/** power writes name(x)^e, or nothing for e = 0. */
const power = (name: string, e: number) => (e === 0 ? "" : e === 1 ? `${name}(x)` : `${name}(x)^{${e}}`);

/** Factor is a function used in a product, with its parity (0 even, 1 odd, 2 neither) and its values. */
interface Factor {
  readonly latex: string;
  readonly parity: 0 | 1 | 2;
  readonly value: (x: number) => number;
}

/** randomFactor draws a factor of the given parity. */
function randomFactor(rng: Rng, parity: 0 | 1 | 2): Factor {
  const c = rng.nonZero(-9, 9);
  const options: readonly (readonly [string, (x: number) => number])[] = [
    [
      [`x^{2}${plus(c)}`, (x: number) => x ** 2 + c],
      [`x^{4}${plus(c)}`, (x: number) => x ** 4 + c],
      ["|x|", Math.abs],
      ["x^{2}", (x: number) => x ** 2],
      [poly([1, "x^{4}"], [c, "x^{2}"]), (x: number) => x ** 4 + c * x ** 2],
    ] as const,
    [
      [poly([1, "x^{3}"], [c, "x"]), (x: number) => x ** 3 + c * x],
      ["x", (x: number) => x],
      ["x^{3}", (x: number) => x ** 3],
      ["x^{5}", (x: number) => x ** 5],
      [poly([c, "x^{5}"], [1, "x"]), (x: number) => c * x ** 5 + x],
    ] as const,
    [
      [linear(1, c), (x: number) => x + c],
      [poly([1, "x^{2}"], [c, "x"]), (x: number) => x ** 2 + c * x],
      [poly([1, "x^{3}"], [c, ""]), (x: number) => x ** 3 + c],
    ] as const,
  ][parity]!;
  const [latex, value] = rng.pick(options);
  return { latex, parity, value };
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
  encompasses: [{ topic: "even-and-odd-functions", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSF.BF.B.3"],
  intro: t(
    `Multiply the even function $x^{2}$ by the odd function $x^{3}$: the product is $x^{5}$, which is odd. Multiply two odd functions, $x \\cdot x^{3} = x^{4}$, and the product is even. The reason shows in $h(-x)$. For $h(x) = x^{2} \\cdot x^{3}$,

$$h(-x) = (-x)^{2} \\cdot (-x)^{3} = x^{2} \\cdot (-x^{3}) = -h(x):$$

only the odd factor changes sign. Even and odd multiply like the signs $+$ and $-$. Check: $h(2) = 4 \\cdot 8 = 32$ and $h(-2) = 4 \\cdot (-8) = -32$.

In this lesson we find whether products and quotients of even and odd functions are even or odd, use this to find their values, and apply it to products of formulas.`,
    `把偶函数 $x^{2}$ 乘以奇函数 $x^{3}$：乘积是 $x^{5}$，是奇函数。两个奇函数相乘，$x \\cdot x^{3} = x^{4}$，乘积是偶函数。原因体现在 $h(-x)$ 中。对于 $h(x) = x^{2} \\cdot x^{3}$，

$$h(-x) = (-x)^{2} \\cdot (-x)^{3} = x^{2} \\cdot (-x^{3}) = -h(x)$$

只有奇函数因式变号。偶与奇相乘就像符号 $+$ 与 $-$ 相乘。检验：$h(2) = 4 \\cdot 8 = 32$，$h(-2) = 4 \\cdot (-8) = -32$。

这节课我们判断奇偶函数之积与商的奇偶性，用它求函数值，并用于解析式的乘积。`,
  ),
  knowledgePoints: [
    {
      id: "parity-of-products",
      title: t("The sign rules", "符号法则"),
      explanation: t(
        `Replacing $x$ by $-x$ leaves an even factor unchanged and changes the sign of an odd factor. In a product or a quotient these sign changes multiply, so even and odd behave like the signs $+$ and $-$. If $f$ is even and $g$ is odd, then for $h(x) = f(x)g(x)$:

$$h(-x) = f(-x)\\,g(-x) = f(x) \\cdot (-g(x)) = -h(x),$$

so $h$ is odd. In general, count the **odd** factors with their powers: an even number of them gives an even function, an odd number an odd function. Take $h(x) = f(x)^{2}g(x)^{3}$: $g$ appears $3$ times, so $h(-x) = f(x)^{2}(-g(x))^{3} = -h(x)$ and $h$ is odd. Check with $f(x) = x^{2}$ and $g(x) = x$: $h(x) = x^{4} \\cdot x^{3} = x^{7}$, an odd power.

> **Watch out.** Count only the odd factors: an even factor never changes sign, however often it appears. A power counts as that many factors, so $g(x)^{2}$ is even although $g$ is odd. Dividing by an odd function changes the sign just as multiplying does: $\\frac{g(x)}{f(x)}$ is odd.`,
        `把 $x$ 换成 $-x$，偶函数因式不变，奇函数因式变号。在积或商中这些变号相乘，所以偶与奇就像符号 $+$ 与 $-$。若 $f$ 是偶函数，$g$ 是奇函数，则对于 $h(x) = f(x)g(x)$：

$$h(-x) = f(-x)\\,g(-x) = f(x) \\cdot (-g(x)) = -h(x)$$

所以 $h$ 是奇函数。一般地，数一数**奇函数**因式的个数（连同次数）：偶数个得偶函数，奇数个得奇函数。看 $h(x) = f(x)^{2}g(x)^{3}$：$g$ 出现 $3$ 次，所以 $h(-x) = f(x)^{2}(-g(x))^{3} = -h(x)$，$h$ 是奇函数。用 $f(x) = x^{2}$，$g(x) = x$ 检验：$h(x) = x^{4} \\cdot x^{3} = x^{7}$，是奇次幂。

> **注意。** 只数奇函数因式：偶函数因式无论出现多少次都不变号。幂按因式的个数计算，所以虽然 $g$ 是奇函数，$g(x)^{2}$ 却是偶函数。除以奇函数和乘以奇函数一样会变号：$\\frac{g(x)}{f(x)}$ 是奇函数。`,
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
        const n = quotient ? (oddOnTop ? e2 - 2 * e1 : 2 * e1 - e2) : 2 * e1 + e2;
        return reasoned(
          choiceProblem({
            prompt: t(
              `$${E}$ is an even function and $${O}$ is an odd function. Is $h(x) = ${h}$ even or odd?`,
              `$${E}$ 是偶函数，$${O}$ 是奇函数。$h(x) = ${h}$ 是偶函数还是奇函数？`,
            ),
            options: parityOptions.slice(0, 2),
            correct: odd ? 1 : 0,
            solution: walked(
              [
                [
                  ["Replace $x$ by $-x$ in each factor", "把每个因式中的 $x$ 换成 $-x$"],
                  t(
                    `$${E}$ is even, so $${E}(-x) = ${E}(x)$; $${O}$ is odd, so $${O}(-x) = -${O}(x)$. Only the factors of $${O}$ change sign${quotient ? ", in the numerator or the denominator alike" : ""}.`,
                    `$${E}$ 是偶函数，所以 $${E}(-x) = ${E}(x)$；$${O}$ 是奇函数，所以 $${O}(-x) = -${O}(x)$。只有 $${O}$ 的因式变号${quotient ? "，在分子或分母中都一样" : ""}。`,
                  ),
                ],
                [
                  ["Count the sign changes", "数变号的次数"],
                  t(
                    `$${O}$ appears $${e2}$ time${e2 === 1 ? "" : "s"} in $h$, so there ${e2 === 1 ? "is" : "are"} $${e2}$ sign change${e2 === 1 ? "" : "s"}. ${odd ? "An odd number leaves one over: $h(-x) = -h(x)$, and $h$ is odd." : "An even number cancels in pairs: $h(-x) = h(x)$, and $h$ is even."}`,
                    `$${O}$ 在 $h$ 中出现 $${e2}$ 次，所以变号 $${e2}$ 次。${odd ? "奇数次变号多出一次：$h(-x) = -h(x)$，$h$ 是奇函数。" : "偶数次变号两两抵消：$h(-x) = h(x)$，$h$ 是偶函数。"}`,
                  ),
                ],
              ],
              t(
                `With the simplest examples $${E}(x) = x^{2}$ and $${O}(x) = x$, $h(x) = x^{${n}}$, ${odd ? "an odd" : "an even"} power.`,
                `取最简单的例子 $${E}(x) = x^{2}$，$${O}(x) = x$，则 $h(x) = x^{${n}}$，是${odd ? "奇" : "偶"}次幂。`,
              ),
            ),
          }),
          [
            [
              "Even",
              `The odd function $${O}$ appears $${e2}$ time${e2 === 1 ? "" : "s"}, an odd number, so one sign change is left over: $h(-x) = -h(x)$.`,
              `奇函数 $${O}$ 出现 $${e2}$ 次，是奇数次，所以多出一次变号：$h(-x) = -h(x)$。`,
            ],
            [
              "Odd",
              `The odd function $${O}$ appears $${e2}$ time${e2 === 1 ? "" : "s"}, an even number, so the sign changes cancel in pairs: $h(-x) = h(x)$. The even function $${E}$ never changes sign, however often it appears.`,
              `奇函数 $${O}$ 出现 $${e2}$ 次，是偶数次，所以变号两两抵消：$h(-x) = h(x)$。偶函数 $${E}$ 无论出现多少次都不变号。`,
            ],
          ],
        );
      },
    },
    {
      id: "values-of-products",
      title: t("Values of products", "乘积的函数值"),
      explanation: t(
        `To evaluate a product at $-a$, replace each factor by its value at $-a$, which the symmetry gives from its value at $a$: an even factor keeps its value, an odd factor changes sign. Then compute.

If $f$ is even, $g$ is odd, $f(2) = 3$ and $g(2) = -5$, then $f(-2) = 3$ and $g(-2) = 5$, so for $h(x) = f(x)g(x)^{3}$:

$$h(-2) = f(-2) \\cdot g(-2)^{3} = 3 \\cdot 5^{3} = 375.$$

Check: $h$ has three odd factors, so it is odd, and indeed $h(2) = 3 \\cdot (-5)^{3} = -375 = -h(-2)$.

> **Watch out.** Change the sign of the odd factor's value before raising it to a power; using $g(2)$ in place of $g(-2)$ gives $h(2)$, not $h(-2)$. Do not change the sign of the even factor, and do not flip the sign of the final answer as well: the sign change has already been made inside.`,
        `在 $-a$ 处求乘积的值，就把每个因式换成它在 $-a$ 处的值，而对称性由它在 $a$ 处的值给出：偶函数因式值不变，奇函数因式变号。然后计算。

若 $f$ 是偶函数，$g$ 是奇函数，$f(2) = 3$，$g(2) = -5$，则 $f(-2) = 3$，$g(-2) = 5$，所以对于 $h(x) = f(x)g(x)^{3}$：

$$h(-2) = f(-2) \\cdot g(-2)^{3} = 3 \\cdot 5^{3} = 375$$

检验：$h$ 有三个奇函数因式，是奇函数，而确实 $h(2) = 3 \\cdot (-5)^{3} = -375 = -h(-2)$。

> **注意。** 先把奇函数因式的值变号，再求幂；用 $g(2)$ 代替 $g(-2)$ 算出的是 $h(2)$，不是 $h(-2)$。不要给偶函数因式变号，也不要再给最后的答案变一次号：变号已经在里面做过了。`,
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
          solution: walked(
            [
              [
                ["Use the symmetry of each factor", "利用每个因式的对称性"],
                t(
                  `$f$ is even, so it keeps its value; $g$ is odd, so its value changes sign:`,
                  `$f$ 是偶函数，值不变；$g$ 是奇函数，值变号：`,
                ),
                [`f(${-a}) = f(${a}) = ${u}`, `g(${-a}) = -g(${a}) = ${-v}`],
              ],
              [
                ["Substitute", "代入"],
                t(`Put these values into $h(x) = ${h}$:`, `把这些值代入 $h(x) = ${h}$：`),
                [`h(${-a}) = ${subst} = ${num(answer)}`],
              ],
            ],
            t(
              `$g$ appears $${ge}$ time${ge === 1 ? "" : "s"}, so $h$ is ${ge % 2 === 1 ? "odd" : "even"}. Using the values at $${a}$, $h(${a}) = ${num(naive)}$, and indeed $h(${-a}) = ${ge % 2 === 1 ? "-" : ""}h(${a}) = ${num(answer)}$.`,
              `$g$ 出现 $${ge}$ 次，所以 $h$ 是${ge % 2 === 1 ? "奇" : "偶"}函数。用 $${a}$ 处的值算得 $h(${a}) = ${num(naive)}$，而确实 $h(${-a}) = ${ge % 2 === 1 ? "-" : ""}h(${a}) = ${num(answer)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "parity-of-products-of-formulas",
      title: t("Products of formulas", "解析式的乘积"),
      explanation: t(
        `To decide whether a product of formulas is even or odd, decide each factor first, then use the sign rules. A factor with only even powers, or $|x|$, is even; one with only odd powers is odd; one that mixes them, such as $x + 1$, is neither, and then the product is neither too (for the factors met here), because its $h(-x)$ is neither $h(x)$ nor $-h(x)$.

Take $h(x) = (x^{2} + 1)(x^{3} - 4x)$: the first factor is even, the second odd, so $h$ is odd. Check: $h(1) = 2 \\cdot (-3) = -6$ and $h(-1) = 2 \\cdot 3 = 6$. Likewise $x^{3}|x|$ is odd times even, so odd, and $(x - 2)x^{2}$ is neither.

> **Watch out.** A constant term is an even power: $x^{2} + 1$ is even, but $x^{3} + 1$ is neither. The signs of the coefficients do not matter, only the powers. Two odd factors give an even product, not an odd one.`,
        `判断解析式之积的奇偶性：先判断每个因式，再用符号法则。只含偶次幂的因式或 $|x|$ 是偶函数；只含奇次幂的是奇函数；奇偶次数混合的，如 $x + 1$，两者都不是，这时乘积也两者都不是（就这里遇到的因式而言），因为它的 $h(-x)$ 既不等于 $h(x)$ 也不等于 $-h(x)$。

看 $h(x) = (x^{2} + 1)(x^{3} - 4x)$：第一个因式是偶函数，第二个是奇函数，所以 $h$ 是奇函数。检验：$h(1) = 2 \\cdot (-3) = -6$，$h(-1) = 2 \\cdot 3 = 6$。同样，$x^{3}|x|$ 是奇乘偶，是奇函数；$(x - 2)x^{2}$ 两者都不是。

> **注意。** 常数项是偶次幂：$x^{2} + 1$ 是偶函数，而 $x^{3} + 1$ 两者都不是。系数的符号不影响，只看次数。两个奇函数因式的乘积是偶函数，不是奇函数。`,
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
        const because = (p: 0 | 1 | 2) =>
          [
            t("replacing $x$ by $-x$ leaves it unchanged", "把 $x$ 换成 $-x$，它不变"),
            t("replacing $x$ by $-x$ changes its sign", "把 $x$ 换成 $-x$，它变号"),
            t(
              "it mixes even and odd powers, so replacing $x$ by $-x$ changes only some of its terms",
              "它的次数奇偶混合，把 $x$ 换成 $-x$，只有一部分项变号",
            ),
          ][p]!;
        const hAt = (x: number) => A.value(x) * B.value(x);
        const xa = range(1, 6).find((x) => hAt(x) !== 0 && (correct !== 2 || Math.abs(hAt(-x)) !== Math.abs(hAt(x)))) ?? 1;
        const [va, wa] = [hAt(xa), hAt(-xa)];
        const odd = t(
          "Exactly one factor is odd, so one sign change is left over: $h(-x) = -h(x)$, and $h$ is odd.",
          "恰有一个因式是奇函数，多出一次变号：$h(-x) = -h(x)$，$h$ 是奇函数。",
        );
        const even = t(
          pa + pb === 2
            ? "Both factors are odd, so their sign changes cancel: $h(-x) = h(x)$, and $h$ is even."
            : "Both factors are even, so nothing changes sign: $h(-x) = h(x)$, and $h$ is even.",
          pa + pb === 2
            ? "两个因式都是奇函数，它们的变号相互抵消：$h(-x) = h(x)$，$h$ 是偶函数。"
            : "两个因式都是偶函数，都不变号：$h(-x) = h(x)$，$h$ 是偶函数。",
        );
        const mixed = t(
          `A factor is neither even nor odd, so the sign rules do not apply: $h(${xa}) = ${va}$ and $h(${-xa}) = ${wa}$ are neither equal nor opposite.`,
          `有一个因式既不是奇函数也不是偶函数，符号法则不适用：$h(${xa}) = ${va}$ 与 $h(${-xa}) = ${wa}$ 既不相等也不互为相反数。`,
        );
        const right = [even, odd, mixed][correct]!;
        const reasons: [string, string, string][] = ["Even", "Odd", "Neither"].map((o): [string, string, string] => [
          o,
          right.en,
          right["zh-CN"],
        ]);
        return reasoned(
          choiceProblem({
            prompt: t(`Is $h(x) = ${h}$ even, odd, or neither?`, `$h(x) = ${h}$ 是偶函数、奇函数，还是都不是？`),
            options: parityOptions,
            correct,
            solution: walked(
              [
                [
                  ["Classify each factor", "判断每个因式"],
                  t(
                    `$${A.latex}$ is ${name(pa).en}: ${because(pa).en}. $${B.latex}$ is ${name(pb).en}: ${because(pb).en}.`,
                    `$${A.latex}$ ${pa === 2 ? "" : "是"}${name(pa)["zh-CN"]}：${because(pa)["zh-CN"]}。$${B.latex}$ ${pb === 2 ? "" : "是"}${name(pb)["zh-CN"]}：${because(pb)["zh-CN"]}。`,
                  ),
                ],
                [
                  ["Combine", "合起来"],
                  correct === 2
                    ? t(
                        "A factor that is neither even nor odd keeps the product from being either: $h(-x)$ is neither $h(x)$ nor $-h(x)$. So $h$ is neither even nor odd.",
                        "有一个因式既不是奇函数也不是偶函数，乘积也就两者都不是：$h(-x)$ 既不等于 $h(x)$ 也不等于 $-h(x)$。所以 $h$ 两者都不是。",
                      )
                    : t(
                        `There ${pa + pb === 1 ? "is one odd factor" : pa + pb === 2 ? "are two odd factors, whose sign changes cancel" : "is no odd factor"}, so by the sign rules $h$ is ${correct === 1 ? "odd" : "even"}.`,
                        `${pa + pb === 1 ? "有一个奇函数因式" : pa + pb === 2 ? "有两个奇函数因式，它们的变号相互抵消" : "没有奇函数因式"}，所以由符号法则，$h$ 是${correct === 1 ? "奇" : "偶"}函数。`,
                      ),
                ],
              ],
              t(
                `$h(${xa}) = ${va}$ and $h(${-xa}) = ${wa}$: ${["equal", "opposite", "neither equal nor opposite"][correct]}.`,
                `$h(${xa}) = ${va}$，$h(${-xa}) = ${wa}$：${["相等", "互为相反数", "既不相等也不互为相反数"][correct]}。`,
              ),
            ),
          }),
          reasons,
        );
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

/** behaviorSides are the signs left and right of each of the behaviorOptions. */
const behaviorSides: readonly (readonly [number, number])[] = [
  [1, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
];

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
  encompasses: [{ topic: "simplifying-rational-expressions-by-factoring", weight: 0.2 }],
  xp: 15,
  standards: ["CCSS.HSF.IF.C.7.D"],
  intro: t(
    `Watch $f(x) = \\frac{1}{x - 3}$ as $x$ comes close to $3$ from the right:

$$f(3.1) = \\frac{1}{0.1} = 10, \\quad f(3.01) = 100, \\quad f(3.001) = 1000.$$

Dividing $1$ by tinier and tinier positive numbers gives larger and larger results, with no limit: $f(x) \\to \\infty$. From the left the denominator is tiny and negative, so $f(2.99) = -100$ and $f(x) \\to -\\infty$. The graph hugs the vertical line $x = 3$ from both sides without touching it. Check: $f(2.999) = \\frac{1}{-0.001} = -1000$.

In this lesson we find the vertical asymptotes of rational functions and decide whether the function goes to $\\infty$ or $-\\infty$ on each side, from a formula and from a graph.`,
    `看 $f(x) = \\frac{1}{x - 3}$ 在 $x$ 从右侧接近 $3$ 时的变化：

$$f(3.1) = \\frac{1}{0.1} = 10, \\quad f(3.01) = 100, \\quad f(3.001) = 1000$$

用 $1$ 除以越来越小的正数，结果越来越大，没有上限：$f(x) \\to \\infty$。从左侧接近时分母是很小的负数，所以 $f(2.99) = -100$，$f(x) \\to -\\infty$。图象从两侧贴近竖直线 $x = 3$，却不与它相交。检验：$f(2.999) = \\frac{1}{-0.001} = -1000$。

这节课我们求分式函数的竖直渐近线，并由解析式和图象判断函数在每一侧趋于 $\\infty$ 还是 $-\\infty$。`,
  ),
  knowledgePoints: [
    {
      id: "vertical-asymptotes",
      figure: algebraDrawings2["unbounded-behavior-of-functions-near-a-point#vertical-asymptotes"],
      title: t("Vertical asymptotes", "竖直渐近线"),
      explanation: t(
        `Near a value where the denominator of a fraction is $0$ and the numerator is not, the fraction divides a number close to the numerator's value by tinier and tinier numbers, so it grows **without bound**. The graph then hugs the vertical line there, a **vertical asymptote**. If the numerator is $0$ there too, the factor may cancel instead.

So factor the denominator and cancel common factors first: a factor that cancels leaves only a hole in the graph, not an asymptote. Take

$$f(x) = \\frac{x - 1}{x^{2} + x - 2} = \\frac{x - 1}{(x - 1)(x + 2)}.$$

The denominator is $0$ at $x = 1$ and $x = -2$. The factor $x - 1$ cancels, leaving $\\frac{1}{x + 2}$, so the only vertical asymptote is $x = -2$; at $x = 1$ there is a hole. Check: near $x = 1$ the values approach $\\frac{1}{1 + 2} = \\frac{1}{3}$, a finite number.

> **Watch out.** $x - 3 = 0$ at $x = 3$, not $-3$: read the zeros of the factors with the right sign. A factor shared with the numerator gives a hole, not an asymptote, so do not list it. Only the denominator's zeros can give asymptotes; a zero of the numerator alone is just an $x$-intercept.`,
        `在分母为 $0$ 而分子不为 $0$ 的值附近，分式用接近分子值的数除以越来越小的数，于是**无界**地增大。图象贴近那里的竖直线，这条线叫做**竖直渐近线**。若分子在那里也为 $0$，这个因式可能会被约去。

所以先把分母因式分解并约去公因式：被约去的因式只在图象上留下一个空洞，而不是渐近线。看

$$f(x) = \\frac{x - 1}{x^{2} + x - 2} = \\frac{x - 1}{(x - 1)(x + 2)}$$

分母在 $x = 1$ 和 $x = -2$ 处为 $0$。因式 $x - 1$ 被约去，剩下 $\\frac{1}{x + 2}$，所以唯一的竖直渐近线是 $x = -2$；$x = 1$ 处是一个空洞。检验：在 $x = 1$ 附近，函数值趋近 $\\frac{1}{1 + 2} = \\frac{1}{3}$，是一个有限的数。

> **注意。** $x - 3 = 0$ 的解是 $x = 3$，不是 $-3$：读因式的零点时符号要对。与分子相同的因式给出空洞而不是渐近线，不要把它列上。只有分母的零点才可能给出渐近线；只是分子的零点，那只是与 $x$ 轴的交点。`,
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
        // A factor x is written first and without parentheses: x(x - 5).
        const factored = h1 === 0 ? `x(${shifted(h2)})` : h2 === 0 ? `x(${shifted(h1)})` : `(${shifted(h1)})(${shifted(h2)})`;
        const bottom = expanded ? polyLatex([h1 * h2, -(h1 + h2), 1]) : factored;
        const answer = constant || (p !== h1 && p !== h2) ? [h1, h2] : [p === h1 ? h2 : h1];
        const values = answer.map(String);
        const numAt = (x: number) => (constant ? Number(top) : x - p);
        return solutionsProblem({
          prompt: t(
            `Find the vertical asymptotes of $f(x) = \\frac{${top}}{${bottom}}$. Write each as $x = a$.`,
            `求 $f(x) = \\frac{${top}}{${bottom}}$ 的竖直渐近线，每条写成 $x = a$ 的形式。`,
          ),
          values,
          wrong: [[String(-h1), String(-h2)], [String(h1), String(h2)], ...(constant ? [] : [[String(p)], [String(p), ...values]])],
          solution: walked(
            [
              [
                ["Find the zeros of the denominator", "求分母的零点"],
                t(
                  `${expanded ? "Factor the denominator" : "The denominator is already factored"}; it is $0$ where a factor is $0$:`,
                  `${expanded ? "把分母因式分解" : "分母已经分解好了"}；某个因式为 $0$ 时它就为 $0$：`,
                ),
                [...(expanded ? [`${bottom} = ${factored}`] : []), `x = ${h1}, \\quad x = ${h2}`],
              ],
              [
                ["Check the numerator there", "检查分子在这些地方的值"],
                answer.length === 2
                  ? t(
                      `The numerator $${top}$ is not $0$ at either value${constant ? ", since it is a constant" : ""}, so nothing cancels and both are vertical asymptotes: $x = ${h1}$ and $x = ${h2}$.`,
                      `分子 $${top}$ 在这两处都不为 $0$${constant ? "，因为它是常数" : ""}，没有可约的因式，所以两条都是竖直渐近线：$x = ${h1}$ 和 $x = ${h2}$。`,
                    )
                  : t(
                      `The numerator $${top}$ is $0$ at $x = ${p}$: the factor $${shifted(p)}$ cancels, leaving $\\frac{1}{${shifted(answer[0]!)}}$ and a hole at $x = ${p}$. The only vertical asymptote is $x = ${answer[0]}$.`,
                      `分子 $${top}$ 在 $x = ${p}$ 处为 $0$：因式 $${shifted(p)}$ 被约去，剩下 $\\frac{1}{${shifted(answer[0]!)}}$，在 $x = ${p}$ 处留下空洞。唯一的竖直渐近线是 $x = ${answer[0]}$。`,
                    ),
              ],
            ],
            answer.length === 2
              ? t(
                  `At $x = ${h1}$ the numerator is $${numAt(h1)}$ and at $x = ${h2}$ it is $${numAt(h2)}$, both nonzero, while the denominator is $0$.`,
                  `在 $x = ${h1}$ 处分子为 $${numAt(h1)}$，在 $x = ${h2}$ 处为 $${numAt(h2)}$，都不为 $0$，而分母为 $0$。`,
                )
              : t(
                  `Near the hole the values approach $\\frac{1}{${p} - ${sub(answer[0]!)}} = ${num(Q.of(1, p - answer[0]!))}$, a finite number; at $x = ${answer[0]}$ the numerator $1$ is not $0$.`,
                  `在空洞附近，函数值趋近 $\\frac{1}{${p} - ${sub(answer[0]!)}} = ${num(Q.of(1, p - answer[0]!))}$，是有限的数；在 $x = ${answer[0]}$ 处分子 $1$ 不为 $0$。`,
                ),
          ),
        });
      },
    },
    {
      id: "behavior-on-each-side",
      title: t("Behavior on each side", "两侧的行为"),
      explanation: t(
        `Close to an asymptote $x = h$ the fraction is huge, so only its **sign** is left to decide: $\\infty$ if it is positive, $-\\infty$ if it is negative. $x \\to h^{+}$ means $x$ approaches $h$ from the right ($x > h$), and $x \\to h^{-}$ from the left. Find the sign of the numerator near $h$ and the sign of the denominator on each side; anything added to the fraction stays fixed and does not matter.

Take $f(x) = \\frac{-3}{x - 2}$. Just right of $2$, $x - 2$ is a tiny positive number, so $f(x)$ is a huge negative number: $f(x) \\to -\\infty$ as $x \\to 2^{+}$. Just left of $2$, $x - 2$ is tiny and negative, so $f(x) \\to \\infty$ as $x \\to 2^{-}$. Check: $f(2.01) = -300$ and $f(1.99) = 300$.

A squared factor such as $(x - 2)^{2}$ is positive on both sides, so then both sides go the same way.

> **Watch out.** A factor $x - h$ is negative on the left of $h$ and positive on the right, so the two sides go opposite ways; a square $(x - h)^{2}$ is positive on both. A negative numerator reverses both sides. The constant added after the fraction does not change the direction.`,
        `在渐近线 $x = h$ 附近，分式的绝对值很大，只剩下它的**符号**要判断：为正则趋于 $\\infty$，为负则趋于 $-\\infty$。$x \\to h^{+}$ 表示 $x$ 从右侧趋近 $h$（$x > h$），$x \\to h^{-}$ 表示从左侧趋近。找出分子在 $h$ 附近的符号，以及分母在每一侧的符号；加在分式后面的数是固定的，不影响结论。

看 $f(x) = \\frac{-3}{x - 2}$：在 $2$ 的右侧附近，$x - 2$ 是很小的正数，所以 $f(x)$ 是绝对值很大的负数：当 $x \\to 2^{+}$ 时 $f(x) \\to -\\infty$。在 $2$ 的左侧附近，$x - 2$ 是很小的负数，所以当 $x \\to 2^{-}$ 时 $f(x) \\to \\infty$。检验：$f(2.01) = -300$，$f(1.99) = 300$。

像 $(x - 2)^{2}$ 这样的平方因式在两侧都为正，这时两侧趋向相同。

> **注意。** 因式 $x - h$ 在 $h$ 左侧为负、右侧为正，所以两侧趋向相反；平方 $(x - h)^{2}$ 在两侧都为正。分子为负会使两侧都反过来。分式后面加上的常数不改变趋向。`,
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
        const den = n === 1 ? shifted(h) : h === 0 ? "x^{2}" : `(${shifted(h)})^{2}`;
        const fx = (x: number) => (constant ? c : x - p) / (x - h) ** n + v;
        const reasons = behaviorOptions(h).map((o, i): [string, string, string] => {
          const [l, r] = behaviorSides[i]!;
          if (l !== left && r !== right)
            return [
              o.en,
              `Every sign is reversed: near $x = ${h}$ the numerator is close to $${topAt}$, which is ${topAt > 0 ? "positive" : "negative"}.`,
              `符号全反了：在 $x = ${h}$ 附近，分子接近 $${topAt}$，为${topAt > 0 ? "正" : "负"}。`,
            ];
          return n === 2
            ? [
                o.en,
                `The square $${den}$ is positive on both sides of $${h}$, so both sides go the same way.`,
                `平方 $${den}$ 在 $${h}$ 两侧都为正，所以两侧趋向相同。`,
              ]
            : [
                o.en,
                `The denominator $${den}$ is negative left of $${h}$ and positive right of it, so the two sides go opposite ways.`,
                `分母 $${den}$ 在 $${h}$ 左侧为负、右侧为正，所以两侧趋向相反。`,
              ];
        });
        return reasoned(
          choiceProblem({
            prompt: t(
              `Describe the behavior of $f(x) = \\frac{${top}}{${den}}${plus(v)}$ near $x = ${h}$.`,
              `描述 $f(x) = \\frac{${top}}{${den}}${plus(v)}$ 在 $x = ${h}$ 附近的行为。`,
            ),
            options: behaviorOptions(h),
            correct: behaviorIndex(left, right),
            solution: walked(
              [
                [
                  ["The sign of the numerator", "分子的符号"],
                  t(
                    `${constant ? `The numerator is the constant $${c}$` : `Near $x = ${h}$ the numerator $${top}$ is close to $${topAt}$`}, which is ${topAt > 0 ? "positive" : "negative"}.`,
                    `${constant ? `分子是常数 $${c}$` : `在 $x = ${h}$ 附近，分子 $${top}$ 接近 $${topAt}$`}，为${topAt > 0 ? "正" : "负"}。`,
                  ),
                ],
                [
                  ["The sign of the denominator on each side", "分母在两侧的符号"],
                  t(
                    n === 2
                      ? `The denominator $${den}$ is a square: a tiny positive number on both sides of $${h}$.`
                      : `The denominator $${den}$ is a tiny negative number left of $${h}$ and a tiny positive number right of it.`,
                    n === 2
                      ? `分母 $${den}$ 是平方：在 $${h}$ 两侧都是很小的正数。`
                      : `分母 $${den}$ 在 $${h}$ 左侧是很小的负数，在右侧是很小的正数。`,
                  ),
                ],
                [
                  ["Combine the signs", "合并符号"],
                  t(
                    `A ${topAt > 0 ? "positive" : "negative"} number over a tiny ${left > 0 === topAt > 0 ? "positive" : "negative"} one is huge and ${left > 0 ? "positive" : "negative"} on the left, and over a tiny positive one ${right > 0 ? "positive" : "negative"} on the right${v === 0 ? "" : `; the added $${v}$ does not change this`}. So $f(x) \\to ${inf(left)}$ as $x \\to ${h}^{-}$ and $f(x) \\to ${inf(right)}$ as $x \\to ${h}^{+}$.`,
                    `${topAt > 0 ? "正" : "负"}数除以很小的${left > 0 === topAt > 0 ? "正" : "负"}数，在左侧得到绝对值很大的${left > 0 ? "正" : "负"}数；除以很小的正数，在右侧得到${right > 0 ? "正" : "负"}数${v === 0 ? "" : `；加上的 $${v}$ 不改变这一点`}。所以当 $x \\to ${h}^{-}$ 时 $f(x) \\to ${inf(left)}$，当 $x \\to ${h}^{+}$ 时 $f(x) \\to ${inf(right)}$。`,
                  ),
                ],
              ],
              t(
                `$f(${(h - 0.01).toFixed(2)}) \\approx ${Math.round(fx(h - 0.01))}$ and $f(${(h + 0.01).toFixed(2)}) \\approx ${Math.round(fx(h + 0.01))}$: ${left > 0 ? "large and positive" : "large and negative"} on the left, ${right > 0 ? "large and positive" : "large and negative"} on the right.`,
                `$f(${(h - 0.01).toFixed(2)}) \\approx ${Math.round(fx(h - 0.01))}$，$f(${(h + 0.01).toFixed(2)}) \\approx ${Math.round(fx(h + 0.01))}$：左侧是绝对值很大的${left > 0 ? "正" : "负"}数，右侧是绝对值很大的${right > 0 ? "正" : "负"}数。`,
              ),
            ),
          }),
          reasons,
        );
      },
    },
    {
      id: "unbounded-behavior-from-a-graph",
      figure: algebraDrawings2["unbounded-behavior-of-functions-near-a-point#unbounded-behavior-from-a-graph"],
      title: t("Unbounded behavior from a graph", "从图象看无界行为"),
      explanation: t(
        `On a graph, a vertical asymptote $x = h$ is often drawn dashed. Near it the graph climbs or falls steeply, and the direction it takes as it approaches the line is the behavior: a branch that shoots up goes to $\\infty$, one that plunges down goes to $-\\infty$. Read the left side ($x \\to h^{-}$) and the right side ($x \\to h^{+}$) separately; they may agree or not.

Suppose the dashed line is $x = 1$; left of it the graph rises steeply, and right of it the graph falls steeply. Then $f(x) \\to \\infty$ as $x \\to 1^{-}$ and $f(x) \\to -\\infty$ as $x \\to 1^{+}$. Check: moving toward the line, the heights on the left keep growing, and those on the right keep dropping.

> **Watch out.** Follow each branch toward the line, not away from it: far from the line the graph levels off, which says nothing about the asymptote. Read each side on its own side: $x \\to h^{-}$ is the branch to the left of the line.`,
        `在图象上，竖直渐近线 $x = h$ 常画成虚线。在它附近图象陡然上升或下降，图象接近这条线时的方向就是所求的行为：向上冲的一支趋于 $\\infty$，向下落的一支趋于 $-\\infty$。左侧（$x \\to h^{-}$）与右侧（$x \\to h^{+}$）要分别看，它们可能相同也可能不同。

设虚线是 $x = 1$；在它左侧图象陡然上升，在它右侧图象陡然下降。则当 $x \\to 1^{-}$ 时 $f(x) \\to \\infty$，当 $x \\to 1^{+}$ 时 $f(x) \\to -\\infty$。检验：向虚线靠近时，左侧的高度不断增大，右侧的高度不断减小。

> **注意。** 沿每一支向虚线靠近来看，而不是远离它：远离虚线时图象趋于平稳，与渐近线处的行为无关。每一侧看自己那一侧的图象：$x \\to h^{-}$ 是虚线左边的那一支。`,
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
        const height = (d: number) =>
          num(
            Q.of(a)
              .div(Q.of(Math.round(d * 2), 2).pow(n))
              .add(Q.of(v)),
          );
        const reasons = behaviorOptions(h).map((o, i): [string, string, string] => {
          const [l, r] = behaviorSides[i]!;
          const en: string[] = [];
          const zhs: string[] = [];
          if (l !== left) {
            en.push(`left of the line the graph goes ${left > 0 ? "up" : "down"}, so $f(x) \\to ${inf(left)}$ as $x \\to ${h}^{-}$`);
            zhs.push(`在虚线左侧图象${zh(left)}，所以当 $x \\to ${h}^{-}$ 时 $f(x) \\to ${inf(left)}$`);
          }
          if (r !== right) {
            en.push(`right of the line the graph goes ${right > 0 ? "up" : "down"}, so $f(x) \\to ${inf(right)}$ as $x \\to ${h}^{+}$`);
            zhs.push(`在虚线右侧图象${zh(right)}，所以当 $x \\to ${h}^{+}$ 时 $f(x) \\to ${inf(right)}$`);
          }
          return [o.en, `The graph says otherwise: ${en.join(", and ")}.`, `与图象不符：${zhs.join("；")}。`];
        });
        return {
          ...reasoned(
            choiceProblem({
              prompt: t(
                `${graphShown.en} Describe its behavior near $x = ${h}$.`,
                `${graphShown["zh-CN"]}描述它在 $x = ${h}$ 附近的行为。`,
              ),
              options: behaviorOptions(h),
              correct: behaviorIndex(left, right),
              solution: walked(
                [
                  [
                    ["Follow the left branch", "沿左边一支看"],
                    t(
                      `Left of the dashed line $x = ${h}$, as the graph approaches the line it goes ${left > 0 ? "up" : "down"} without bound, so $f(x) \\to ${inf(left)}$ as $x \\to ${h}^{-}$.`,
                      `在虚线 $x = ${h}$ 的左侧，图象靠近虚线时${zh(left)}，所以当 $x \\to ${h}^{-}$ 时 $f(x) \\to ${inf(left)}$。`,
                    ),
                  ],
                  [
                    ["Follow the right branch", "沿右边一支看"],
                    t(
                      `Right of the line the graph goes ${right > 0 ? "up" : "down"} without bound as it approaches the line, so $f(x) \\to ${inf(right)}$ as $x \\to ${h}^{+}$.`,
                      `在虚线右侧，图象靠近虚线时${zh(right)}，所以当 $x \\to ${h}^{+}$ 时 $f(x) \\to ${inf(right)}$。`,
                    ),
                  ],
                ],
                t(
                  `Moving toward the line, the heights run away from the level $y = ${v}$: on the left $f(${h - 1}) = ${height(-1)}$ and $f(${h - 0.5}) = ${height(-0.5)}$; on the right $f(${h + 1}) = ${height(1)}$ and $f(${h + 0.5}) = ${height(0.5)}$.`,
                  `向虚线靠近时，高度离水平线 $y = ${v}$ 越来越远：左侧 $f(${h - 1}) = ${height(-1)}$，$f(${h - 0.5}) = ${height(-0.5)}$；右侧 $f(${h + 1}) = ${height(1)}$，$f(${h + 0.5}) = ${height(0.5)}$。`,
                ),
              ),
            }),
            reasons,
          ),
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

/** rateMistakes lists the mistakes of an average rate of change. */
function rateMistakes(fa: number, fb: number, a: number, b: number) {
  return [
    why(
      Q.of(fb - fa),
      "That is the change in the output. Divide it by the change in the input.",
      "这是输出的变化量，还要除以输入的变化量。",
    ),
    why(
      Q.of(fa - fb, b - a),
      "The sign is wrong: subtract the outputs and the inputs in the same order.",
      "符号错了：输出和输入要按相同的顺序相减。",
    ),
    ...(fb !== fa
      ? [
          why(
            Q.of(b - a, fb - fa),
            "That is the change in the input over the change in the output. The rate is the other way round.",
            "这是输入的变化量除以输出的变化量。变化率正好相反。",
          ),
        ]
      : []),
    why(Q.of(fb + fa, b - a), "You added the outputs. The rate uses their difference.", "你把输出相加了。变化率用的是它们的差。"),
  ];
}

/** rateLatex writes the computation of an average rate of change. */
const rateLatex = (name: string, fa: number, fb: number, a: number, b: number) =>
  `\\frac{${name}(${b}) - ${name}(${a})}{${b} - ${sub(a)}} = \\frac{${fb} - ${sub(fa)}}{${b - a}} = ${num(averageRate(fa, fb, a, b))}`;

/** rateCheck goes from the first point at the average rate and arrives at the second. */
function rateCheck(name: string, fa: number, fb: number, a: number, b: number): Text {
  const m = averageRate(fa, fb, a, b);
  const mL = m.sign() < 0 || num(m).includes("frac") ? `\\left(${num(m)}\\right)` : num(m);
  const work = `${fa} + ${mL} \\cdot ${b - a} = ${fb}`;
  return t(
    `Starting from $${name}(${a}) = ${fa}$ and changing at the rate $${num(m)}$ for $${b - a}$ unit${b - a === 1 ? "" : "s"} of input gives $${work}$, which is $${name}(${b})$.`,
    `从 $${name}(${a}) = ${fa}$ 出发，按变化率 $${num(m)}$ 变化 $${b - a}$ 个单位的输入，得 $${work}$，正是 $${name}(${b})$。`,
  );
}

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
    { topic: "units-of-rates-of-change", weight: 0.2 },
    { topic: "slope-of-a-line", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.B.6"],
  intro: t(
    `A car has driven $d(1) = 50$ kilometers after $1$ hour and $d(3) = 170$ kilometers after $3$ hours. It may have sped up and slowed down in between, but over those two hours it covered $170 - 50 = 120$ kilometers, so its average speed was

$$\\frac{d(3) - d(1)}{3 - 1} = \\frac{120}{2} = 60 \\text{ km/h}.$$

This is the slope of the straight line through $(1, 50)$ and $(3, 170)$ on the graph of $d$. Check: $50 + 60 \\cdot 2 = 170$.

In this lesson we find average rates of change of functions given by formulas, tables and graphs, and interpret them with units in context.`,
    `一辆汽车 $1$ 小时后行驶了 $d(1) = 50$ 千米，$3$ 小时后行驶了 $d(3) = 170$ 千米。中间它可能加速也可能减速，但这两小时里它走了 $170 - 50 = 120$ 千米，所以平均速度是

$$\\frac{d(3) - d(1)}{3 - 1} = \\frac{120}{2} = 60 \\text{ km/h}$$

这就是 $d$ 的图象上经过 $(1, 50)$ 与 $(3, 170)$ 的直线的斜率。检验：$50 + 60 \\cdot 2 = 170$。

这节课我们求由解析式、表格和图象给出的函数的平均变化率，并在实际问题中结合单位解释它。`,
  ),
  knowledgePoints: [
    {
      id: "average-rate-of-change-from-a-formula",
      title: t("From a formula", "由解析式求"),
      explanation: t(
        `A line has one slope, but the graph of most functions bends, so its steepness changes from place to place. The **average rate of change** of $f$ from $x = a$ to $x = b$ ignores what happens in between and compares only the ends: the change in output divided by the change in input,

$$\\frac{f(b) - f(a)}{b - a}.$$

It is the slope of the line through $(a, f(a))$ and $(b, f(b))$. For $f(x) = x^{2} + 1$ from $x = 1$ to $x = 4$, first $f(1) = 2$ and $f(4) = 17$, then

$$\\frac{f(4) - f(1)}{4 - 1} = \\frac{17 - 2}{3} = 5.$$

Check: starting from $f(1) = 2$ and rising $5$ per unit for $3$ units gives $2 + 5 \\cdot 3 = 17 = f(4)$.

> **Watch out.** The change in output alone, $15$, is not the rate: divide by the change in input. Subtract in the same order on top and bottom, later minus earlier, or the sign flips. The input change goes below, not above, and the outputs are subtracted, not added.`,
        `直线只有一个斜率，但大多数函数的图象是弯曲的，陡峭程度处处不同。$f$ 从 $x = a$ 到 $x = b$ 的**平均变化率**不管中间发生了什么，只比较两端：输出的变化量除以输入的变化量，

$$\\frac{f(b) - f(a)}{b - a}$$

它就是经过 $(a, f(a))$ 与 $(b, f(b))$ 的直线的斜率。对于 $f(x) = x^{2} + 1$，从 $x = 1$ 到 $x = 4$：先求 $f(1) = 2$，$f(4) = 17$，再算

$$\\frac{f(4) - f(1)}{4 - 1} = \\frac{17 - 2}{3} = 5$$

检验：从 $f(1) = 2$ 出发，每单位上升 $5$，走 $3$ 个单位，得 $2 + 5 \\cdot 3 = 17 = f(4)$。

> **注意。** 只有输出的变化量 $15$ 还不是变化率：要除以输入的变化量。分子分母按同样的顺序相减，都是后减前，否则符号会反。输入的变化量在分母上，不在分子上；输出要相减，不是相加。`,
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
          mistakes: rateMistakes(fa, fb, a, b),
          solution: walked(
            [
              [
                ["Evaluate at both ends", "求两端的函数值"],
                t("Substitute each end of the interval into the formula:", "把区间的两个端点分别代入解析式："),
                [`f(${a}) = ${polyLatex(p).replace(/x/g, `(${a})`)} = ${fa}`, `f(${b}) = ${polyLatex(p).replace(/x/g, `(${b})`)} = ${fb}`],
              ],
              [
                ["Divide the changes", "变化量相除"],
                t(
                  `Subtract in the same order on top and bottom, the later value minus the earlier one:`,
                  `分子分母按同样的顺序相减，都是后面的值减前面的值：`,
                ),
                [rateLatex("f", fa, fb, a, b)],
              ],
            ],
            rateCheck("f", fa, fb, a, b),
          ),
        });
      },
    },
    {
      id: "average-rate-of-change-from-a-table",
      title: t("From a table", "由数值表求"),
      explanation: t(
        `A table gives the outputs directly, so there is nothing to compute before dividing: read $f(a)$ and $f(b)$ and divide the differences, subtracting in the same order on top and bottom. The values in between do not matter, because the average rate compares only the two ends.

If $f(-2) = 7$ and $f(3) = -8$, the average rate of change from $-2$ to $3$ is

$$\\frac{-8 - 7}{3 - (-2)} = \\frac{-15}{5} = -3:$$

on average $f$ falls $3$ units for each unit of $x$. Check: $7 + (-3) \\cdot 5 = -8$.

> **Watch out.** Take the two columns asked for, not neighbouring ones. Subtracting a negative input adds it: $3 - (-2) = 5$. Keep the order the same on top and bottom; mixing it gives $+3$ instead of $-3$. Dividing the input change by the output change gives the reciprocal, not the rate.`,
        `表格直接给出输出，相除之前不用再计算：读出 $f(a)$ 和 $f(b)$，再求差相除，分子分母按同样的顺序相减。中间的值不影响结果，因为平均变化率只比较两端。

若 $f(-2) = 7$，$f(3) = -8$，则从 $-2$ 到 $3$ 的平均变化率为

$$\\frac{-8 - 7}{3 - (-2)} = \\frac{-15}{5} = -3$$

$x$ 每增加一个单位，$f$ 平均下降 $3$ 个单位。检验：$7 + (-3) \\cdot 5 = -8$。

> **注意。** 取题目要求的那两列，不要取相邻的列。减去负的输入等于加上它：$3 - (-2) = 5$。分子分母的顺序要一致；顺序混了会得到 $+3$ 而不是 $-3$。用输入的变化量除以输出的变化量得到的是倒数，不是变化率。`,
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
          mistakes: rateMistakes(fa, fb, a, b),
          solution: walked(
            [
              [
                ["Read the two values", "读出两个值"],
                t(
                  `In the columns $x = ${a}$ and $x = ${b}$ the table gives $g(${a}) = ${fa}$ and $g(${b}) = ${fb}$; the other columns do not matter.`,
                  `在 $x = ${a}$ 和 $x = ${b}$ 两列，表格给出 $g(${a}) = ${fa}$，$g(${b}) = ${fb}$；其他列不影响结果。`,
                ),
              ],
              [
                ["Divide the changes", "变化量相除"],
                t(
                  `Subtract in the same order on top and bottom, the later value minus the earlier one:`,
                  `分子分母按同样的顺序相减，都是后面的值减前面的值：`,
                ),
                [rateLatex("g", fa, fb, a, b)],
              ],
            ],
            rateCheck("g", fa, fb, a, b),
          ),
        });
      },
    },
    {
      id: "average-rate-of-change-from-a-graph",
      figure: algebraDrawings2["the-average-rate-of-change-of-a-function#average-rate-of-change-from-a-graph"],
      title: t("From a graph", "由图象求"),
      explanation: t(
        `On a graph, the average rate of change from $a$ to $b$ is the slope of the **secant line** joining the points of the graph above $x = a$ and $x = b$. Read the two heights, then divide the rise by the run. What the graph does in between does not matter: it may go up and down, but only the two end points enter the slope.

Suppose the graph passes through $(-2, 3)$ and $(4, -1)$. The run is $4 - (-2) = 6$ and the rise is $-1 - 3 = -4$, so the average rate of change is $\\frac{-4}{6} = -\\frac{2}{3}$. Check: $3 + \\left(-\\frac{2}{3}\\right) \\cdot 6 = -1$.

> **Watch out.** Rise over run, not run over rise. A secant going down from left to right has a negative slope: the rise is negative. Read the heights at the two given inputs exactly, and do not add them.`,
        `在图象上，从 $a$ 到 $b$ 的平均变化率是连接图象上 $x = a$ 与 $x = b$ 处两点的**割线**的斜率。读出两点的高度，再用竖直变化量除以水平变化量。图象在两点之间如何变化不影响结果：它可能忽上忽下，但斜率只用到两个端点。

设图象经过 $(-2, 3)$ 和 $(4, -1)$。水平变化量为 $4 - (-2) = 6$，竖直变化量为 $-1 - 3 = -4$，所以平均变化率为 $\\frac{-4}{6} = -\\frac{2}{3}$。检验：$3 + \\left(-\\frac{2}{3}\\right) \\cdot 6 = -1$。

> **注意。** 是竖直变化量除以水平变化量，不是反过来。从左到右下降的割线斜率为负：竖直变化量是负数。准确读出两个给定输入处的高度，也不要把它们相加。`,
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
        return annotate(
          {
            ...numberProblem({
              prompt: t(
                `${graphShown.en} Find the average rate of change of $f$ from $x = ${a}$ to $x = ${b}$.`,
                `${graphShown["zh-CN"]}求 $f$ 从 $x = ${a}$ 到 $x = ${b}$ 的平均变化率。`,
              ),
              answer: averageRate(fa, fb, a, b),
              mistakes: rateMistakes(fa, fb, a, b),
              solution: walked(
                [
                  [
                    ["Read the two points", "读出两个点"],
                    t(
                      `Above $x = ${a}$ and $x = ${b}$ the graph passes through $${pt(a, fa)}$ and $${pt(b, fb)}$.`,
                      `在 $x = ${a}$ 和 $x = ${b}$ 处，图象经过 $${pt(a, fa)}$ 和 $${pt(b, fb)}$。`,
                    ),
                  ],
                  [
                    ["Rise over run", "竖直变化量除以水平变化量"],
                    t(
                      `The run is $${b - a}$ and the rise is $${fb - fa}$; the slope of the secant line is`,
                      `水平变化量为 $${b - a}$，竖直变化量为 $${fb - fa}$；割线的斜率为`,
                    ),
                    [rateLatex("f", fa, fb, a, b)],
                  ],
                ],
                rateCheck("f", fa, fb, a, b),
              ),
            }),
            figure: segmentsFigure(pts),
          },
          view,
          [{ kind: "segment", a: [a, fa], b: [b, fb], dashed: true, tone: "result" }, ...riseRun([a, fa], [b, fb])],
          `From ${at([a, fa])} to ${at([b, fb])} the run is ${b - a} and the rise is ${fb - fa}, a rate of ${plain(averageRate(fa, fb, a, b))}.`,
          `从 ${at([a, fa])} 到 ${at([b, fb])}，水平变化 ${b - a}，竖直变化 ${fb - fa}，平均变化率是 ${plain(averageRate(fa, fb, a, b))}。`,
        );
      },
    },
    {
      id: "average-rate-of-change-in-context",
      title: t("Average rates of change in context", "实际问题中的平均变化率"),
      explanation: t(
        `In a model, the average rate of change has units, output units per input unit, and its sign says which way the quantity went: positive means it grew on average, negative that it shrank. For a position it is an average velocity.

If a ball's height is $h(t) = -5t^{2} + 20t$ meters after $t$ seconds, then $h(1) = 15$ and $h(3) = 15$, so from $t = 1$ to $t = 3$:

$$\\frac{h(3) - h(1)}{3 - 1} = \\frac{15 - 15}{2} = 0 \\text{ m/s}.$$

The ball's average velocity over those two seconds is $0$: it rose and fell back to the same height. Check: $15 + 0 \\cdot 2 = 15$.

> **Watch out.** The change in height alone is in meters, not meters per second: divide by the time. Subtract in the same order on top and bottom. A negative answer is meaningful, a falling ball or a draining tank, so keep its sign.`,
        `在模型中，平均变化率带有单位：输出单位每输入单位；它的符号说明量的变化方向：正表示平均增加，负表示平均减少。对位置而言，它就是平均速度。

若球在 $t$ 秒后的高度为 $h(t) = -5t^{2} + 20t$ 米，则 $h(1) = 15$，$h(3) = 15$，所以从 $t = 1$ 到 $t = 3$：

$$\\frac{h(3) - h(1)}{3 - 1} = \\frac{15 - 15}{2} = 0 \\text{ m/s}$$

这两秒内球的平均速度为 $0$：它上升后又落回到同样的高度。检验：$15 + 0 \\cdot 2 = 15$。

> **注意。** 只有高度的变化量，单位是米而不是米每秒：要除以时间。分子分母按同样的顺序相减。负的答案是有意义的，表示球在下落或水箱在放水，所以要保留符号。`,
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
        const rate = averageRate(fa, fb, a, b);
        return numberProblem({
          prompt: ctx,
          answer: averageRate(fa, fb, a, b),
          mistakes: rateMistakes(fa, fb, a, b),
          unit: ball ? "m/s" : "L/min",
          solution: walked(
            [
              [
                ["Evaluate at both times", "求两个时刻的值"],
                t("Substitute each time into the model:", "把两个时刻分别代入模型："),
                [`${name}(${a}) = ${f.replace(/t/g, `(${a})`)} = ${fa}`, `${name}(${b}) = ${f.replace(/t/g, `(${b})`)} = ${fb}`],
              ],
              [
                ["Divide the changes", "变化量相除"],
                t(
                  `Subtract in the same order on top and bottom, the later value minus the earlier one:`,
                  `分子分母按同样的顺序相减，都是后面的值减前面的值：`,
                ),
                [rateLatex(name, fa, fb, a, b)],
              ],
              [
                ["Interpret", "解释结果"],
                t(
                  `The rate is $${num(rate)}$ ${ball ? "meters per second" : "liters per minute"}: ${rate.sign() === 0 ? (ball ? "the ball ends at the same height it started" : "the tank ends with as much water as it started with") : rate.sign() > 0 ? (ball ? "on average the ball was rising" : "on average the tank was filling") : ball ? "on average the ball was falling" : "on average the tank was draining"}.`,
                  `变化率为 $${num(rate)}$ ${ball ? "米每秒" : "升每分钟"}：${rate.sign() === 0 ? (ball ? "球最后回到出发时的高度" : "水箱最后的水量与开始时相同") : rate.sign() > 0 ? (ball ? "球平均在上升" : "水箱平均在进水") : ball ? "球平均在下落" : "水箱平均在放水"}。`,
                ),
              ],
            ],
            rateCheck(name, fa, fb, a, b),
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
