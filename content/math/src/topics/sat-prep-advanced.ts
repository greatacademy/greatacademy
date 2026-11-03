import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Mark, num, type Point, poly, Q, sketch } from "@ga/subject-math";

import { numberProblem, solutionsProblem, steps } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// SAT Math Prep, advanced math: inputs and extreme values of quadratic functions, transformations and tables of
// exponential functions, times and units in exponential models, features of graphs in context, and systems of a
// quadratic and a constant.

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: standards.map((s) => `CCSS.${s}`),
    knowledgePoints,
  };
}

/** kp builds a KnowledgePointDef. */
function kp(id: string, title: Text, explanation: Text, generate: (rng: Rng) => Problem, figure?: Figure): KnowledgePointDef {
  return figure ? { id, title, explanation, figure, generate } : { id, title, explanation, generate };
}

/** distinct drops the values equal to the answer or to an earlier value. */
function distinct(answer: Q, values: readonly Q[]): Q[] {
  const out: Q[] = [];
  for (const v of values) if (!v.eq(answer) && !out.some((o) => o.eq(v))) out.push(v);
  return out;
}

/** shifted writes x − h as a factor, or x when h is 0. */
const shifted = (h: number) => {
  const q = Q.of(h);
  return q.isZero() ? "x" : `(${poly([1, "x"], [q.neg(), ""])})`;
};

/** Coef is a number or a rational. */
type Coef = number | Q;

/** lead writes a leading coefficient in front of a product: nothing for 1 and a minus sign for −1. */
const lead = (a: number) => (a === 1 ? "" : a === -1 ? "-" : `${a}`);

/** quadratic writes ax² + bx + c. */
const quadratic = (a: Coef, b: Coef, c: Coef) => poly([a, "x^{2}"], [b, "x"], [c, ""]);

// ---------------------------------------------------------------------------
// Quadratic functions

/** determiningInputsOfQuadraticFunctionsForGivenOutputs solves f(x) = k for quadratic functions. */
export const determiningInputsOfQuadraticFunctionsForGivenOutputs = topic(
  "determining-inputs-of-quadratic-functions-for-given-outputs",
  t("Determining Inputs of Quadratic Functions for Given Outputs", "由函数值求二次函数的自变量"),
  t(
    "Find every input of a quadratic function that gives a stated output, by factoring or by taking square roots.",
    "通过因式分解或开平方，求出使二次函数取给定值的所有自变量。",
  ),
  ["solving-quadratic-equations-by-factoring"],
  ["F-IF.A.2", "A-REI.B.4"],
  [
    kp(
      "outputs-of-standard-form-quadratics",
      t("Outputs of quadratics in standard form", "标准式二次函数的函数值"),
      t(
        "To find the inputs where $f(x) = k$, set the formula equal to $k$, move $k$ to the left so that one side is $0$, and factor. For $f(x) = x^{2} - 2x + 1$ and $f(x) = 9$, the equation $x^{2} - 2x - 8 = 0$ factors as $(x - 4)(x + 2) = 0$, so $x = 4$ or $x = -2$. A quadratic function usually reaches a given output at two inputs.",
        "要求出 $f(x) = k$ 时的自变量，令函数式等于 $k$，把 $k$ 移到左边使一边为 $0$，再因式分解。对于 $f(x) = x^{2} - 2x + 1$ 且 $f(x) = 9$，方程 $x^{2} - 2x - 8 = 0$ 分解为 $(x - 4)(x + 2) = 0$，所以 $x = 4$ 或 $x = -2$。二次函数通常在两个自变量处取得同一个函数值。",
      ),
      (rng) => {
        const r1 = rng.int(-9, 9);
        let r2 = rng.int(-9, 9);
        while (r2 === r1) r2 = rng.int(-9, 9);
        const k = rng.nonZero(-12, 20);
        const b = -(r1 + r2);
        const c = r1 * r2 + k;
        return solutionsProblem({
          prompt: t(
            `The function $f$ is defined by $f(x) = ${quadratic(1, b, c)}$. Find all values of $x$ for which $f(x) = ${k}$.`,
            `函数 $f$ 定义为 $f(x) = ${quadratic(1, b, c)}$。求使 $f(x) = ${k}$ 的所有 $x$ 的值。`,
          ),
          values: [String(r1), String(r2)],
          wrong: [[String(-r1), String(-r2)], [String(r1)], [String(r1 + r2), String(r1 * r2)]],
          solution: t(
            `Set $f(x) = ${k}$ and move $${k}$ to the left:${steps(`${quadratic(1, b, c)} = ${k}`, `${quadratic(1, b, r1 * r2)} = 0`, `${shifted(r1)}${shifted(r2)} = 0`)}So $x = ${r1}$ or $x = ${r2}$.`,
            `令 $f(x) = ${k}$，把 $${k}$ 移到左边：${steps(`${quadratic(1, b, c)} = ${k}`, `${quadratic(1, b, r1 * r2)} = 0`, `${shifted(r1)}${shifted(r2)} = 0`)}所以 $x = ${r1}$ 或 $x = ${r2}$。`,
          ),
        });
      },
    ),
    kp(
      "outputs-of-vertex-form-quadratics",
      t("Outputs of quadratics in vertex form", "顶点式二次函数的函数值"),
      t(
        "When $f(x) = a(x - h)^{2} + k$, solve $f(x) = v$ by undoing the operations around the square: subtract $k$, divide by $a$, then take both square roots. For $f(x) = 2(x - 1)^{2} + 3$ and $f(x) = 21$: $(x - 1)^{2} = 9$, so $x - 1 = \\pm 3$ and $x = 4$ or $x = -2$. The two inputs are equally far from $h$.",
        "当 $f(x) = a(x - h)^{2} + k$ 时，解 $f(x) = v$ 要依次撤销平方外的运算：减去 $k$，除以 $a$，再取正负两个平方根。对于 $f(x) = 2(x - 1)^{2} + 3$ 且 $f(x) = 21$：$(x - 1)^{2} = 9$，所以 $x - 1 = \\pm 3$，$x = 4$ 或 $x = -2$。两个自变量到 $h$ 的距离相等。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, 4, -1, -2, -3]);
        const h = rng.int(-8, 8);
        const k = rng.int(-15, 15);
        const d = rng.int(1, 7);
        const v = a * d * d + k;
        return solutionsProblem({
          prompt: t(
            `The function $f$ is defined by $f(x) = ${lead(a)}${shifted(h)}^{2} ${k < 0 ? "-" : "+"} ${Math.abs(k)}$. Find all values of $x$ for which $f(x) = ${v}$.`,
            `函数 $f$ 定义为 $f(x) = ${lead(a)}${shifted(h)}^{2} ${k < 0 ? "-" : "+"} ${Math.abs(k)}$。求使 $f(x) = ${v}$ 的所有 $x$ 的值。`,
          ),
          values: [String(h - d), String(h + d)],
          wrong: [[String(h + d)], [String(-h - d), String(-h + d)], [String(h - d * d), String(h + d * d)]],
          solution: t(
            `Undo the operations around the square:${steps(`${lead(a)}${shifted(h)}^{2} = ${v - k}`, `${shifted(h)}^{2} = ${d * d}`, `${poly([1, "x"], [-h, ""])} = \\pm ${d}`)}So $x = ${h - d}$ or $x = ${h + d}$.`,
            `依次撤销平方外的运算：${steps(`${lead(a)}${shifted(h)}^{2} = ${v - k}`, `${shifted(h)}^{2} = ${d * d}`, `${poly([1, "x"], [-h, ""])} = \\pm ${d}`)}所以 $x = ${h - d}$ 或 $x = ${h + d}$。`,
          ),
        });
      },
    ),
  ],
);

/** findingExtremeValuesOfQuadraticFunctionsInFactoredForm finds vertices from the zeros of a(x − p)(x − q). */
export const findingExtremeValuesOfQuadraticFunctionsInFactoredForm = topic(
  "finding-extreme-values-of-quadratic-functions-in-factored-form",
  t("Finding Extreme Values of Quadratic Functions in Factored Form", "求因式分解式二次函数的最值"),
  t(
    "Find where a quadratic in factored form reaches its minimum or maximum, and that extreme value, from the midpoint of its zeros.",
    "利用零点的中点，求出因式分解式二次函数取得最小值或最大值的位置及最值。",
  ),
  ["roots-of-quadratic-functions", "the-axis-of-symmetry-of-a-parabola"],
  ["F-IF.C.8.a"],
  [
    kp(
      "the-vertex-is-midway-between-the-zeros",
      t("The vertex is midway between the zeros", "顶点在两个零点正中间"),
      t(
        "The zeros of $f(x) = a(x - p)(x - q)$ are $p$ and $q$. A parabola is symmetric about its axis, so the vertex lies halfway between the zeros, at $x = \\frac{p + q}{2}$. That is where $f$ reaches its minimum when $a > 0$ and its maximum when $a < 0$. For $f(x) = (x - 2)(x + 8)$ the vertex is at $x = \\frac{2 + (-8)}{2} = -3$.",
        "$f(x) = a(x - p)(x - q)$ 的零点是 $p$ 和 $q$。抛物线关于对称轴对称，所以顶点位于两个零点的正中间，即 $x = \\frac{p + q}{2}$。当 $a > 0$ 时 $f$ 在此取得最小值，当 $a < 0$ 时取得最大值。对于 $f(x) = (x - 2)(x + 8)$，顶点在 $x = \\frac{2 + (-8)}{2} = -3$ 处。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, -1, -2, -3]);
        const p = rng.int(-10, 10);
        let q = rng.int(-10, 10);
        while (q === p) q = rng.int(-10, 10);
        const mid = Q.of(p + q, 2);
        return numberProblem({
          prompt: t(
            `The function $f$ is defined by $f(x) = ${lead(a)}${shifted(p)}${shifted(q)}$. For what value of $x$ does $f$ reach its ${a > 0 ? "minimum" : "maximum"} value?`,
            `函数 $f$ 定义为 $f(x) = ${lead(a)}${shifted(p)}${shifted(q)}$。$x$ 取何值时 $f$ 取得${a > 0 ? "最小" : "最大"}值？`,
          ),
          answer: mid,
          form: "fraction",
          wrong: distinct(mid, [Q.of(-(p + q), 2), Q.of(p + q), Q.of(q - p, 2), Q.of(a * p * q)]),
          solution: t(
            `The zeros are $${p}$ and $${q}$, and the vertex is halfway between them: $x = \\frac{${p} + ${num(q).startsWith("-") ? `(${q})` : q}}{2} = ${mid.toLatex()}$.`,
            `零点是 $${p}$ 和 $${q}$，顶点在它们正中间：$x = \\frac{${p} + ${num(q).startsWith("-") ? `(${q})` : q}}{2} = ${mid.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "the-extreme-value",
      t("The extreme value", "最值"),
      t(
        "After finding the $x$-coordinate of the vertex, substitute it into the function to get the minimum or maximum value. For $f(x) = 2(x - 1)(x - 7)$, the vertex is at $x = 4$, so the minimum value is $f(4) = 2(3)(-3) = -18$. Each factor at the vertex is half the distance between the zeros, with opposite signs.",
        "求出顶点的横坐标后，把它代入函数，就得到最小值或最大值。对于 $f(x) = 2(x - 1)(x - 7)$，顶点在 $x = 4$ 处，所以最小值为 $f(4) = 2(3)(-3) = -18$。在顶点处，两个因式的值都是两零点间距离的一半，符号相反。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, 4, -1, -2, -3]);
        const p = rng.int(-10, 10);
        const half = rng.int(1, 7);
        const q = p + 2 * half;
        const mid = p + half;
        const value = -a * half * half;
        return numberProblem({
          prompt: t(
            `The function $f$ is defined by $f(x) = ${lead(a)}${shifted(p)}${shifted(q)}$. What is the ${a > 0 ? "minimum" : "maximum"} value of $f$?`,
            `函数 $f$ 定义为 $f(x) = ${lead(a)}${shifted(p)}${shifted(q)}$。$f$ 的${a > 0 ? "最小" : "最大"}值是多少？`,
          ),
          answer: value,
          wrong: distinct(Q.of(value), [Q.of(mid), Q.of(a * p * q), Q.of(-value), Q.of(-half * half)]),
          solution: t(
            `The vertex is halfway between the zeros $${p}$ and $${q}$, at $x = ${mid}$. So the ${a > 0 ? "minimum" : "maximum"} value is $f(${mid}) = ${num(a)}(${half})(${-half}) = ${value}$.`,
            `顶点在零点 $${p}$ 与 $${q}$ 的正中间，即 $x = ${mid}$。所以${a > 0 ? "最小" : "最大"}值为 $f(${mid}) = ${num(a)}(${half})(${-half}) = ${value}$。`,
          ),
        });
      },
    ),
  ],
);

/** findingExtremeValuesOfQuadraticFunctionsInStandardForm finds vertices of ax² + bx + c from −b/(2a). */
export const findingExtremeValuesOfQuadraticFunctionsInStandardForm = topic(
  "finding-extreme-values-of-quadratic-functions-in-standard-form",
  t("Finding Extreme Values of Quadratic Functions in Standard Form", "求标准式二次函数的最值"),
  t(
    "Find where a quadratic in standard form reaches its minimum or maximum using $x = -\\frac{b}{2a}$, and evaluate the extreme value.",
    "用 $x = -\\frac{b}{2a}$ 求出标准式二次函数取得最小值或最大值的位置，并求出最值。",
  ),
  ["the-axis-of-symmetry-of-a-parabola"],
  ["F-IF.C.8.a"],
  [
    kp(
      "the-vertex-from-the-coefficients",
      t("The vertex from the coefficients", "由系数求顶点"),
      t(
        "For $f(x) = ax^{2} + bx + c$, the axis of symmetry and the vertex are at $x = -\\frac{b}{2a}$. The parabola opens up and has a minimum when $a > 0$, and opens down and has a maximum when $a < 0$. For $f(x) = -3x^{2} + 12x + 5$, the vertex is at $x = -\\frac{12}{2(-3)} = 2$, where $f$ has its maximum.",
        "对于 $f(x) = ax^{2} + bx + c$，对称轴与顶点在 $x = -\\frac{b}{2a}$ 处。当 $a > 0$ 时抛物线开口向上，有最小值；当 $a < 0$ 时开口向下，有最大值。对于 $f(x) = -3x^{2} + 12x + 5$，顶点在 $x = -\\frac{12}{2(-3)} = 2$ 处，$f$ 在此取得最大值。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, 4, 5, -1, -2, -3, -4]);
        const h = rng.nonZero(-8, 8);
        const b = -2 * a * h;
        const c = rng.int(-20, 20);
        return numberProblem({
          prompt: t(
            `The function $f$ is defined by $f(x) = ${quadratic(a, b, c)}$. For what value of $x$ does $f$ reach its ${a > 0 ? "minimum" : "maximum"} value?`,
            `函数 $f$ 定义为 $f(x) = ${quadratic(a, b, c)}$。$x$ 取何值时 $f$ 取得${a > 0 ? "最小" : "最大"}值？`,
          ),
          answer: h,
          wrong: distinct(Q.of(h), [
            Q.of(-h),
            Q.of(-b, a),
            Q.of(b, 2 * a)
              .neg()
              .neg(),
            Q.of(c),
          ]),
          solution: t(
            `The vertex is at $x = -\\frac{b}{2a} = -\\frac{${b}}{2 \\cdot ${num(a).startsWith("-") ? `(${a})` : a}} = ${h}$.`,
            `顶点在 $x = -\\frac{b}{2a} = -\\frac{${b}}{2 \\cdot ${num(a).startsWith("-") ? `(${a})` : a}} = ${h}$ 处。`,
          ),
        });
      },
    ),
    kp(
      "the-extreme-value-from-standard-form",
      t("The extreme value from standard form", "由标准式求最值"),
      t(
        "Substitute $x = -\\frac{b}{2a}$ back into the function to find the minimum or maximum value. For $f(x) = 2x^{2} - 8x + 3$, the vertex is at $x = 2$, and the minimum value is $f(2) = 8 - 16 + 3 = -5$. The extreme value is the $y$-coordinate of the vertex, not its $x$-coordinate.",
        "把 $x = -\\frac{b}{2a}$ 代回函数，就得到最小值或最大值。对于 $f(x) = 2x^{2} - 8x + 3$，顶点在 $x = 2$ 处，最小值为 $f(2) = 8 - 16 + 3 = -5$。最值是顶点的纵坐标，不是横坐标。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, -1, -2, -3]);
        const h = rng.nonZero(-7, 7);
        const b = -2 * a * h;
        const c = rng.int(-20, 20);
        const value = a * h * h + b * h + c;
        return numberProblem({
          prompt: t(
            `The function $f$ is defined by $f(x) = ${quadratic(a, b, c)}$. What is the ${a > 0 ? "minimum" : "maximum"} value of $f$?`,
            `函数 $f$ 定义为 $f(x) = ${quadratic(a, b, c)}$。$f$ 的${a > 0 ? "最小" : "最大"}值是多少？`,
          ),
          answer: value,
          wrong: distinct(Q.of(value), [Q.of(h), Q.of(c), Q.of(a * h * h - b * h + c), Q.of(-value)]),
          solution: t(
            `The vertex is at $x = -\\frac{${b}}{2 \\cdot ${num(a).startsWith("-") ? `(${a})` : a}} = ${h}$, so the ${a > 0 ? "minimum" : "maximum"} value is $f(${h}) = ${num(a)}(${h})^{2} ${b * h < 0 ? "-" : "+"} ${Math.abs(b * h)} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${value}$.`,
            `顶点在 $x = -\\frac{${b}}{2 \\cdot ${num(a).startsWith("-") ? `(${a})` : a}} = ${h}$ 处，所以${a > 0 ? "最小" : "最大"}值为 $f(${h}) = ${num(a)}(${h})^{2} ${b * h < 0 ? "-" : "+"} ${Math.abs(b * h)} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${value}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Exponential functions

/** power writes a(b)^{e}. */
const power = (a: number, b: string, e: string) => `${a}(${b})^{${e}}`;

/** transformingExponentialFunctions evaluates exponential functions shifted up, down, left or right. */
export const transformingExponentialFunctions = topic(
  "transforming-exponential-functions",
  t("Transforming Exponential Functions", "指数函数的变换"),
  t(
    "Evaluate and describe exponential functions after vertical and horizontal translations.",
    "求出并描述指数函数经过竖直平移和水平平移后的结果。",
  ),
  ["graphing-exponential-growth-functions", "horizontal-translations-of-functions"],
  ["F-BF.B.3", "F-LE.A.2"],
  [
    kp(
      "vertical-shifts-of-exponential-functions",
      t("Vertical shifts", "竖直平移"),
      t(
        "If $g(x) = f(x) + k$, every output of $f$ is increased by $k$. For $f(x) = a \\cdot b^{x}$, the $y$-intercept moves from $a$ to $a + k$ and the horizontal asymptote moves from $y = 0$ to $y = k$. With $f(x) = 3(2)^{x}$ and $g(x) = f(x) - 5$, $g(2) = 12 - 5 = 7$.",
        "若 $g(x) = f(x) + k$，则 $f$ 的每个函数值都增加 $k$。对于 $f(x) = a \\cdot b^{x}$，$y$ 轴截距从 $a$ 变为 $a + k$，水平渐近线从 $y = 0$ 变为 $y = k$。若 $f(x) = 3(2)^{x}$，$g(x) = f(x) - 5$，则 $g(2) = 12 - 5 = 7$。",
      ),
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(2, 5);
        const k = rng.nonZero(-20, 20);
        const n = rng.int(0, 3);
        const askAsymptote = rng.bool(0.25);
        const value = askAsymptote ? k : a * b ** n + k;
        const g = `f(x) ${k < 0 ? "-" : "+"} ${Math.abs(k)}`;
        return numberProblem({
          prompt: askAsymptote
            ? t(
                `The function $f$ is defined by $f(x) = ${power(a, String(b), "x")}$, and $g(x) = ${g}$. The graph of $g$ has the horizontal asymptote $y = c$. What is the value of $c$?`,
                `函数 $f$ 定义为 $f(x) = ${power(a, String(b), "x")}$，且 $g(x) = ${g}$。$g$ 的图象有水平渐近线 $y = c$。求 $c$ 的值。`,
              )
            : t(
                `The function $f$ is defined by $f(x) = ${power(a, String(b), "x")}$, and $g(x) = ${g}$. What is the value of $g(${n})$?`,
                `函数 $f$ 定义为 $f(x) = ${power(a, String(b), "x")}$，且 $g(x) = ${g}$。求 $g(${n})$ 的值。`,
              ),
          answer: value,
          wrong: distinct(
            Q.of(value),
            askAsymptote
              ? [Q.of(0), Q.of(a + k), Q.of(-k)]
              : [Q.of(a * b ** n), Q.of((a + k) * b ** n), Q.of(a * b ** (n + k > 0 ? 1 : 0) + k), Q.of(a * b * n + k)],
          ),
          solution: askAsymptote
            ? t(
                `The graph of $f$ approaches $y = 0$. Adding $${k}$ to every output moves the asymptote to $y = ${k}$.`,
                `$f$ 的图象趋近于 $y = 0$。每个函数值都加上 $${k}$，渐近线移到 $y = ${k}$。`,
              )
            : t(
                `First $f(${n}) = ${a} \\cdot ${b}^{${n}} = ${a * b ** n}$, so $g(${n}) = ${a * b ** n} ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${value}$.`,
                `先求 $f(${n}) = ${a} \\cdot ${b}^{${n}} = ${a * b ** n}$，所以 $g(${n}) = ${a * b ** n} ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${value}$。`,
              ),
        });
      },
    ),
    kp(
      "horizontal-shifts-of-exponential-functions",
      t("Horizontal shifts", "水平平移"),
      t(
        "If $g(x) = f(x - h)$, the graph of $f$ moves $h$ units to the right, and $g$ takes at $x$ the value that $f$ takes at $x - h$. For $f(x) = 5(3)^{x}$ and $g(x) = f(x - 2)$, $g(4) = f(2) = 45$. Writing $g(x) = 5(3)^{x - 2}$ shows the same thing.",
        "若 $g(x) = f(x - h)$，则 $f$ 的图象向右平移 $h$ 个单位，$g$ 在 $x$ 处的值等于 $f$ 在 $x - h$ 处的值。对于 $f(x) = 5(3)^{x}$ 与 $g(x) = f(x - 2)$，$g(4) = f(2) = 45$。写成 $g(x) = 5(3)^{x - 2}$ 也能看出这一点。",
      ),
      (rng) => {
        const a = rng.int(1, 9);
        const b = rng.int(2, 4);
        const h = rng.nonZero(-3, 4);
        const e = rng.int(0, 3);
        const n = e + h;
        const value = a * b ** e;
        const arg = h > 0 ? `x - ${h}` : `x + ${-h}`;
        return numberProblem({
          prompt: t(
            `The function $f$ is defined by $f(x) = ${power(a, String(b), "x")}$, and $g(x) = f(${arg})$. What is the value of $g(${n})$?`,
            `函数 $f$ 定义为 $f(x) = ${power(a, String(b), "x")}$，且 $g(x) = f(${arg})$。求 $g(${n})$ 的值。`,
          ),
          answer: value,
          wrong: distinct(Q.of(value), [
            Q.of(a).mul(Q.of(b).pow(n)),
            Q.of(a).mul(Q.of(b).pow(n + h)),
            Q.of(a * b ** e - h),
            Q.of(a).mul(Q.of(b).pow(n)).sub(Q.of(h)),
          ]),
          solution: t(
            `By definition $g(${n}) = f(${n} ${h > 0 ? "-" : "+"} ${Math.abs(h)}) = f(${e}) = ${a} \\cdot ${b}^{${e}} = ${value}$.`,
            `根据定义，$g(${n}) = f(${n} ${h > 0 ? "-" : "+"} ${Math.abs(h)}) = f(${e}) = ${a} \\cdot ${b}^{${e}} = ${value}$。`,
          ),
        });
      },
    ),
  ],
);

/** expTable writes a two-row table of values. */
function expTable(xs: readonly number[], ys: readonly Q[]): string {
  return `$$\\begin{array}{c|${"c".repeat(xs.length)}} x & ${xs.join(" & ")} \\\\ \\hline f(x) & ${ys.map((y) => y.toLatex()).join(" & ")} \\end{array}$$`;
}

/** identifyingExponentialFunctionsFromTabularData finds the initial value and growth factor of an exponential table. */
export const identifyingExponentialFunctionsFromTabularData = topic(
  "identifying-exponential-functions-from-tabular-data",
  t("Identifying Exponential Functions From Tabular Data", "由表格数据确定指数函数"),
  t(
    "Recognize a constant ratio between consecutive outputs and use it to write the exponential function given by a table.",
    "识别相邻函数值之间的恒定比值，并据此写出表格所给的指数函数。",
  ),
  ["linear-vs-exponential-models", "graphing-exponential-growth-functions"],
  ["F-LE.A.2", "F-LE.A.1.a"],
  [
    kp(
      "writing-the-function-from-a-table",
      t("Writing the function from a table", "由表格写出函数"),
      t(
        "In a table of $f(x) = a \\cdot b^{x}$ with inputs going up by $1$, each output is $b$ times the one before, and the output at $x = 0$ is $a$. If the table gives $f(0) = 3$, $f(1) = 12$ and $f(2) = 48$, the ratio is $4$ and the function is $f(x) = 3(4)^{x}$. A constant difference instead of a constant ratio would mean the function is linear.",
        "在自变量每次增加 $1$ 的 $f(x) = a \\cdot b^{x}$ 的表格中，每个函数值都是前一个的 $b$ 倍，$x = 0$ 处的函数值为 $a$。若表格给出 $f(0) = 3$、$f(1) = 12$、$f(2) = 48$，比值为 $4$，函数为 $f(x) = 3(4)^{x}$。如果相邻函数值的差恒定而不是比值恒定，函数就是一次函数。",
      ),
      (rng) => {
        const decay = rng.bool(0.3);
        const [b, bs, a] = decay
          ? (() => {
              const d = rng.pick([2, 3, 4]);
              return [Q.of(1, d), `\\frac{1}{${d}}`, rng.int(1, 4) * d ** 3] as const;
            })()
          : (() => {
              const g = rng.int(2, 6);
              return [Q.of(g), String(g), rng.int(2, 9)] as const;
            })();
        const xs = [0, 1, 2, 3];
        const ys = xs.map((x) => Q.of(a).mul(b.pow(x)));
        const y1 = ys[1]!.toLatex();
        const correct = mathText(`f(x) = ${power(a, bs, "x")}`);
        const wrong = [
          mathText(`f(x) = ${y1}(${bs})^{x}`),
          mathText(`f(x) = ${power(a, decay ? `\\frac{1}{${b.d + 1n}}` : String(Number(b.n) + 1), "x")}`),
          mathText(`f(x) = ${a} + ${ys[1]!.sub(Q.of(a)).toLatex()}x`.replace("+ -", "- ")),
          mathText(`f(x) = ${bs}(${a})^{x}`),
        ];
        return pickChoice(
          rng,
          t(
            `The table shows values of an exponential function $f$. ${expTable(xs, ys)}Which equation defines $f$?`,
            `下表给出指数函数 $f$ 的一些值。${expTable(xs, ys)}哪个方程定义了 $f$？`,
          ),
          correct,
          wrong,
          t(
            `The output at $x = 0$ is $${a}$, and each output is $${bs}$ times the one before, so $f(x) = ${power(a, bs, "x")}$.`,
            `$x = 0$ 处的函数值为 $${a}$，每个函数值都是前一个的 $${bs}$ 倍，所以 $f(x) = ${power(a, bs, "x")}$。`,
          ),
        );
      },
    ),
    kp(
      "the-initial-value-from-a-table",
      t("The initial value from a table without x = 0", "由不含 x = 0 的表格求初始值"),
      t(
        "If the table does not include $x = 0$, find the ratio $b$ from two consecutive outputs, then divide backward to reach $x = 0$. A table with $f(1) = 10$, $f(2) = 20$ and $f(3) = 40$ has ratio $2$, so $f(0) = \\frac{10}{2} = 5$ and $f(x) = 5(2)^{x}$. Dividing by the ratio moves one step to the left.",
        "如果表格不含 $x = 0$，先由两个相邻函数值求出比值 $b$，再向前倒除到 $x = 0$。若表格给出 $f(1) = 10$、$f(2) = 20$、$f(3) = 40$，比值为 $2$，所以 $f(0) = \\frac{10}{2} = 5$，$f(x) = 5(2)^{x}$。除以比值相当于向左移动一步。",
      ),
      (rng) => {
        const g = rng.int(2, 5);
        const a = rng.int(1, 12);
        const start = rng.int(1, 3);
        const xs = [start, start + 1, start + 2];
        const ys = xs.map((x) => Q.of(a * g ** x));
        return numberProblem({
          prompt: t(
            `The table shows values of the exponential function $f(x) = a \\cdot b^{x}$, where $a$ and $b$ are constants. ${expTable(xs, ys)}What is the value of $a$?`,
            `下表给出指数函数 $f(x) = a \\cdot b^{x}$（$a$、$b$ 为常数）的一些值。${expTable(xs, ys)}求 $a$ 的值。`,
          ),
          answer: a,
          wrong: distinct(Q.of(a), [ys[0]!, Q.of(g), ys[0]!.div(Q.of(g)).mul(Q.of(start === 1 ? g : 1)), ys[0]!.sub(Q.of(g))]),
          solution: t(
            `Each output is $${g}$ times the one before, so $b = ${g}$. Dividing $f(${start}) = ${ys[0]!.toLatex()}$ by $${g}$ ${start === 1 ? "once" : `$${start}$ times`} gives $f(0) = a = ${a}$.`,
            `每个函数值都是前一个的 $${g}$ 倍，所以 $b = ${g}$。把 $f(${start}) = ${ys[0]!.toLatex()}$ 除以 $${g}$ ${start === 1 ? "一次" : `$${start}$ 次`}，得 $f(0) = a = ${a}$。`,
          ),
        });
      },
    ),
  ],
);

/** calculatingUnknownTimesInExponentialModels finds when a doubling or halving model reaches a value. */
export const calculatingUnknownTimesInExponentialModels = topic(
  "calculating-unknown-times-in-exponential-models",
  t("Calculating Unknown Times in Exponential Models", "求指数模型中的未知时间"),
  t(
    "Find when an exponential model reaches a value by counting doubling, tripling or halving periods.",
    "通过数翻倍、增至三倍或减半的周期数，求出指数模型达到某个值的时间。",
  ),
  ["solving-exponential-growth-problems"],
  ["F-LE.A.2", "A-SSE.B.3.c"],
  [
    kp(
      "counting-periods",
      t("Counting doubling and halving periods", "数翻倍与减半的周期"),
      t(
        "If a quantity doubles every $d$ hours, then after $n$ doubling periods it is $2^{n}$ times as large, which takes $nd$ hours. A culture of $300$ bacteria that doubles every $4$ hours reaches $300 \\cdot 2^{3} = 2400$ after $3$ periods, that is after $12$ hours. Divide the target by the starting amount, write the result as a power of the factor, and multiply the exponent by the length of a period.",
        "如果一个量每 $d$ 小时翻一倍，那么经过 $n$ 个翻倍周期后它变为原来的 $2^{n}$ 倍，用时 $nd$ 小时。$300$ 个细菌每 $4$ 小时翻一倍，经过 $3$ 个周期达到 $300 \\cdot 2^{3} = 2400$，即 $12$ 小时。把目标值除以初始值，把结果写成倍数的幂，再用指数乘以一个周期的长度。",
      ),
      (rng) => {
        const kind = rng.pick([
          { f: 2, en: "doubles", zh: "翻一倍" },
          { f: 3, en: "triples", zh: "增至三倍" },
          { f: 0.5, en: "is halved", zh: "减半" },
        ]);
        const d = rng.int(2, 12);
        const n = rng.int(2, kind.f === 3 ? 4 : 6);
        const start = kind.f === 0.5 ? rng.int(1, 9) * 2 ** n * 5 : rng.int(1, 30) * 10;
        const end = kind.f === 0.5 ? start / 2 ** n : start * kind.f ** n;
        const thing = rng.pick([
          { en: "A culture of bacteria", zh: "一种细菌培养物", unitEn: "bacteria", unitZh: "个细菌" },
          { en: "The mass of a substance", zh: "一种物质的质量", unitEn: "grams", unitZh: "克" },
        ]);
        const answer = n * d;
        return numberProblem({
          prompt: t(
            `${thing.en} starts at $${start}$ ${thing.unitEn} and ${kind.en} every $${d}$ hours. After how many hours will it be $${end}$ ${thing.unitEn}?`,
            `${thing.zh}最初为 $${start}$ ${thing.unitZh}，每 $${d}$ 小时${kind.zh}。经过多少小时后它会变为 $${end}$ ${thing.unitZh}？`,
          ),
          answer,
          wrong: distinct(Q.of(answer), [Q.of(n), Q.of(answer + d), Q.of(Math.abs(end - start), d), Q.of(d * (n - 1))]),
          solution: t(
            `The amount changes by a factor of $\\frac{${end}}{${start}} = ${kind.f === 0.5 ? `\\left(\\frac{1}{2}\\right)^{${n}}` : `${kind.f}^{${n}}`}$, which takes $${n}$ periods of $${d}$ hours: $${n} \\cdot ${d} = ${answer}$ hours.`,
            `数量变为原来的 $\\frac{${end}}{${start}} = ${kind.f === 0.5 ? `\\left(\\frac{1}{2}\\right)^{${n}}` : `${kind.f}^{${n}}`}$ 倍，需要 $${n}$ 个 $${d}$ 小时的周期：$${n} \\cdot ${d} = ${answer}$ 小时。`,
          ),
        });
      },
    ),
    kp(
      "solving-for-time-in-the-exponent",
      t("Solving for time in the exponent", "求指数中的时间"),
      t(
        "A model such as $V(t) = 800(1.5)^{\\frac{t}{3}}$ grows by the factor $1.5$ every $3$ units of time. To find when $V(t) = 800(1.5)^{4}$, match the exponents: $\\frac{t}{3} = 4$, so $t = 12$. When both sides have the same base, equal values mean equal exponents.",
        "像 $V(t) = 800(1.5)^{\\frac{t}{3}}$ 这样的模型每过 $3$ 个时间单位增长为原来的 $1.5$ 倍。要求出 $V(t) = 800(1.5)^{4}$ 的时刻，就令指数相等：$\\frac{t}{3} = 4$，所以 $t = 12$。两边底数相同时，值相等意味着指数相等。",
      ),
      (rng) => {
        const a = rng.int(2, 90) * 10;
        const base = rng.pick(["1.5", "1.2", "0.8", "2", "3", "0.5", "1.05"]);
        const k = rng.int(2, 12);
        const m = rng.int(2, 9);
        const answer = m * k;
        return numberProblem({
          prompt: t(
            `The function $V(t) = ${a}(${base})^{\\frac{t}{${k}}}$ models a value $t$ years after it was first recorded. For what value of $t$ is $V(t) = ${a}(${base})^{${m}}$?`,
            `函数 $V(t) = ${a}(${base})^{\\frac{t}{${k}}}$ 表示首次记录 $t$ 年后的某个值。$t$ 取何值时 $V(t) = ${a}(${base})^{${m}}$？`,
          ),
          answer,
          wrong: distinct(Q.of(answer), [Q.of(m), Q.of(m, k), Q.of(k), Q.of(m + k)]),
          solution: t(
            `The bases are the same, so the exponents are equal: $\\frac{t}{${k}} = ${m}$, which gives $t = ${answer}$.`,
            `底数相同，所以指数相等：$\\frac{t}{${k}} = ${m}$，得 $t = ${answer}$。`,
          ),
        });
      },
    ),
  ],
);

/** TimeUnits pairs a larger unit of time with a smaller one and the number of small units in a large one. */
const timeUnits = [
  { big: "years", bigZh: "年", small: "months", smallZh: "月", n: 12, s: "m" },
  { big: "days", bigZh: "天", small: "hours", smallZh: "小时", n: 24, s: "h" },
  { big: "hours", bigZh: "小时", small: "minutes", smallZh: "分钟", n: 60, s: "m" },
  { big: "weeks", bigZh: "周", small: "days", smallZh: "天", n: 7, s: "d" },
] as const;

/** convertingUnitsOfTimeInExponentialModels rewrites exponential models for a different unit of time. */
export const convertingUnitsOfTimeInExponentialModels = topic(
  "converting-units-of-time-in-exponential-models",
  t("Converting Units of Time in Exponential Models", "指数模型中的时间单位换算"),
  t(
    "Rewrite an exponential model when time is measured in a different unit, and count growth periods across units.",
    "当时间用不同的单位度量时改写指数模型，并跨单位计算增长周期数。",
  ),
  ["modeling-exponential-growth-with-functions"],
  ["F-LE.A.2", "A-SSE.B.3.c", "N-Q.A.1"],
  [
    kp(
      "changing-the-time-variable",
      t("Changing the time variable", "改变时间变量"),
      t(
        "If $P = 500(1.04)^{t}$ with $t$ in years, and $m$ is the time in months, then $t = \\frac{m}{12}$. Substituting gives $P = 500(1.04)^{\\frac{m}{12}}$. Divide the new time variable by the number of small units in one large unit, and keep the base unchanged.",
        "若 $P = 500(1.04)^{t}$，其中 $t$ 以年为单位，而 $m$ 表示以月为单位的时间，则 $t = \\frac{m}{12}$。代入得 $P = 500(1.04)^{\\frac{m}{12}}$。用新的时间变量除以一个大单位所含的小单位个数，底数保持不变。",
      ),
      (rng) => {
        const u = rng.pick(timeUnits);
        const a = rng.int(2, 99) * 10;
        const base = rng.pick(["1.02", "1.04", "1.1", "1.25", "0.9", "0.85", "1.5", "2"]);
        const s = u.s;
        const correct = mathText(`P = ${a}(${base})^{\\frac{${s}}{${u.n}}}`);
        const wrong = [
          mathText(`P = ${a}(${base})^{${u.n}${s}}`),
          mathText(`P = ${a}\\left(\\frac{${base}}{${u.n}}\\right)^{${s}}`),
          mathText(`P = ${a}(${base})^{${s}}`),
          mathText(`P = \\frac{${a}}{${u.n}}(${base})^{${s}}`),
        ];
        return pickChoice(
          rng,
          t(
            `The equation $P = ${a}(${base})^{t}$ models a quantity $P$ after $t$ ${u.big}. Which equation models $P$ after $${s}$ ${u.small}?`,
            `方程 $P = ${a}(${base})^{t}$ 表示经过 $t$ ${u.bigZh}后的量 $P$。哪个方程表示经过 $${s}$ ${u.smallZh}后的 $P$？`,
          ),
          correct,
          wrong,
          t(
            `There are $${u.n}$ ${u.small} in one ${u.big.slice(0, -1)}, so $t = \\frac{${s}}{${u.n}}$. Substituting gives $P = ${a}(${base})^{\\frac{${s}}{${u.n}}}$.`,
            `一${u.bigZh}有 $${u.n}$ ${u.smallZh}，所以 $t = \\frac{${s}}{${u.n}}$。代入得 $P = ${a}(${base})^{\\frac{${s}}{${u.n}}}$。`,
          ),
        );
      },
    ),
    kp(
      "growth-factors-across-units",
      t("Growth factors across units", "跨单位的增长倍数"),
      t(
        "To find the total growth over a long time when the growth period is given in a smaller unit, convert the time to the smaller unit and count the periods. A quantity that doubles every $6$ hours goes through $\\frac{48}{6} = 8$ doublings in $2$ days, since $2$ days are $48$ hours, so it grows by a factor of $2^{8} = 256$.",
        "当增长周期用较小的单位给出时，要求较长时间内的总增长倍数，就把时间换算成较小的单位，再数周期数。一个每 $6$ 小时翻一倍的量，在 $2$ 天即 $48$ 小时内经历 $\\frac{48}{6} = 8$ 次翻倍，所以增长为原来的 $2^{8} = 256$ 倍。",
      ),
      (rng) => {
        const u = rng.pick(timeUnits);
        const factor = rng.pick([2, 3]);
        const periods = rng.int(2, factor === 2 ? 8 : 5);
        const bigs = rng.int(1, 3);
        const total = bigs * u.n;
        if (total % periods !== 0) return convertingUnitsOfTimeInExponentialModels.knowledgePoints[1]!.generate(rng);
        const len = total / periods;
        const answer = factor ** periods;
        return numberProblem({
          prompt: t(
            `A quantity ${factor === 2 ? "doubles" : "triples"} every $${len}$ ${u.small}. By what factor does it grow in $${bigs}$ ${bigs === 1 ? u.big.slice(0, -1) : u.big}?`,
            `一个量每 $${len}$ ${u.smallZh}${factor === 2 ? "翻一倍" : "增至三倍"}。经过 $${bigs}$ ${u.bigZh}，它增长为原来的多少倍？`,
          ),
          answer,
          form: "integer",
          wrong: distinct(Q.of(answer), [Q.of(factor * periods), Q.of(factor ** bigs), Q.of(periods), Q.of(factor ** (periods + 1))]),
          solution: t(
            `In $${bigs}$ ${bigs === 1 ? u.big.slice(0, -1) : u.big} there are $${total}$ ${u.small}, which is $\\frac{${total}}{${len}} = ${periods}$ periods. So the quantity grows by a factor of $${factor}^{${periods}} = ${answer}$.`,
            `$${bigs}$ ${u.bigZh}共有 $${total}$ ${u.smallZh}，即 $\\frac{${total}}{${len}} = ${periods}$ 个周期。所以这个量增长为原来的 $${factor}^{${periods}} = ${answer}$ 倍。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Interpreting graphs

/** LinearContext is a linear model whose intercept and slope have meanings. */
interface LinearContext {
  readonly en: (b: number, m: number) => string;
  readonly zh: (b: number, m: number) => string;
  readonly intercept: Text;
  readonly slope: Text;
  readonly others: readonly Text[];
}

const linearContexts: readonly LinearContext[] = [
  {
    en: (b, m) => `The total cost $C$, in dollars, of a gym membership for $n$ months is modeled by $C = ${m}n + ${b}$.`,
    zh: (b, m) => `健身房会员 $n$ 个月的总费用 $C$（美元）可用 $C = ${m}n + ${b}$ 表示。`,
    intercept: t("The one-time fee charged when joining", "入会时收取的一次性费用"),
    slope: t("The cost of each additional month", "每增加一个月的费用"),
    others: [t("The number of months of membership", "会员的月数"), t("The total cost after one month", "一个月后的总费用")],
  },
  {
    en: (b, m) =>
      `The amount of fuel $F$, in liters, left in a generator $h$ hours after it is switched on is modeled by $F = ${b} - ${m}h$.`,
    zh: (b, m) => `发电机开机 $h$ 小时后剩余的燃料 $F$（升）可用 $F = ${b} - ${m}h$ 表示。`,
    intercept: t("The amount of fuel in the generator when it is switched on", "发电机开机时的燃料量"),
    slope: t("The amount of fuel used each hour", "每小时消耗的燃料量"),
    others: [
      t("The number of hours until the fuel runs out", "燃料耗尽所需的小时数"),
      t("The amount of fuel left after one hour", "一小时后剩余的燃料量"),
    ],
  },
  {
    en: (b, m) => `The height $H$, in centimeters, of a tree $y$ years after it was planted is modeled by $H = ${m}y + ${b}$.`,
    zh: (b, m) => `一棵树种下 $y$ 年后的高度 $H$（厘米）可用 $H = ${m}y + ${b}$ 表示。`,
    intercept: t("The height of the tree when it was planted", "树种下时的高度"),
    slope: t("The growth of the tree each year", "树每年长高的量"),
    others: [t("The age of the tree", "树的年龄"), t("The height of the tree after one year", "树一年后的高度")],
  },
];

/** axes draws the two axes of a model graph, named x and y, out to (w, h). */
const axes = (w: number, h: number, x: string, y: string): Mark[] => [
  { kind: "segment", a: [0, 0], b: [w, 0] },
  { kind: "segment", a: [0, 0], b: [0, h] },
  { kind: "label", at: [w, 0], text: x, dir: "e" },
  { kind: "label", at: [0, h], text: y, dir: "n" },
];

/** costModelFigure graphs C = 25n + 40 (drawn 25 to a unit up), marking the intercept 40 and a slope step of 1 across and 25 up. */
const costModelFigure: Figure = {
  svg: sketch([
    ...axes(5, 6, "n", "C"),
    { kind: "segment", a: [0, 1.6], b: [4.2, 5.8] },
    { kind: "segment", a: [2, 3.6], b: [3, 3.6], dashed: true },
    { kind: "segment", a: [3, 3.6], b: [3, 4.6], dashed: true },
    { kind: "dot", at: [0, 1.6] },
    { kind: "label", at: [0, 1.6], text: "40", dir: "w" },
    { kind: "label", at: [2.5, 3.6], text: "1", dir: "s" },
    { kind: "label", at: [3, 4.1], text: "25", dir: "e" },
  ]),
  alt: t(
    "The graph of C = 25n + 40 is a line that starts at 40 on the C-axis and rises 25 for each step of 1 in n.",
    "C = 25n + 40 的图象是一条直线，从 C 轴上的 40 开始，n 每增加 1，C 上升 25。",
  ),
};

/** heightModelFigure graphs h(t) = −16t² + 64t + 80 (drawn 32 to a unit up), marking the h-intercept, the vertex and the t-intercept. */
const heightModelFigure: Figure = {
  svg: sketch([
    ...axes(6, 5.5, "t", "h"),
    ...Array.from({ length: 40 }, (_, i): Mark => {
      const at = (t: number): Point => [t, (-16 * t * t + 64 * t + 80) / 32];
      return { kind: "segment", a: at((5 * i) / 40), b: at((5 * (i + 1)) / 40) };
    }),
    { kind: "dot", at: [0, 2.5] },
    { kind: "dot", at: [2, 4.5] },
    { kind: "dot", at: [5, 0] },
    { kind: "label", at: [0, 2.5], text: "(0, 80)", dir: "w" },
    { kind: "label", at: [2, 4.5], text: "(2, 144)", dir: "n" },
    { kind: "label", at: [5, 0], text: "(5, 0)", dir: "s" },
  ]),
  alt: t(
    "The graph of h(t) = −16t² + 64t + 80 starts at the launch height (0, 80), rises to the vertex (2, 144), the maximum height, and meets the t-axis at (5, 0), when the object lands.",
    "h(t) = −16t² + 64t + 80 的图象从发射高度 (0, 80) 开始，上升到顶点 (2, 144)，即最大高度，再在 (5, 0) 与 t 轴相交，此时物体落地。",
  ),
};

/** identifyingGraphPropertiesInModelingContexts matches intercepts, slopes and vertices of model graphs with their meanings. */
export const identifyingGraphPropertiesInModelingContexts = topic(
  "identifying-graph-properties-in-modeling-contexts",
  t("Identifying Graph Properties in Modeling Contexts", "在建模情境中识别图象特征"),
  t(
    "Say what the intercepts, slope and vertex of the graph of a model mean in its context.",
    "说明模型图象的截距、斜率和顶点在情境中的含义。",
  ),
  ["graphs-of-functions", "interpreting-linear-expressions"],
  ["F-IF.B.4", "F-LE.B.5"],
  [
    kp(
      "intercepts-and-slopes-of-linear-models",
      t("Intercepts and slopes of linear models", "线性模型的截距与斜率"),
      t(
        "On the graph of a linear model, the vertical intercept is the output when the input is $0$, which is usually a starting amount or a fixed fee. The slope is the change in the output for each increase of $1$ in the input, which is a rate. For $C = 25n + 40$, the $C$-intercept $40$ is the cost before any months are counted and the slope $25$ is the cost per month.",
        "在线性模型的图象上，纵轴截距是输入为 $0$ 时的输出，通常表示初始量或固定费用。斜率是输入每增加 $1$ 时输出的变化量，表示一个变化率。对于 $C = 25n + 40$，$C$ 轴截距 $40$ 是还没计算任何月份时的费用，斜率 $25$ 是每月的费用。",
      ),
      (rng) => {
        const ctx = rng.pick(linearContexts);
        const b = rng.int(20, 300);
        const m = rng.int(2, 19);
        const askIntercept = rng.bool();
        const correct = askIntercept ? ctx.intercept : ctx.slope;
        return pickChoice(
          rng,
          t(
            `${ctx.en(b, m)} What does the ${askIntercept ? "vertical intercept" : "slope"} of the graph of this equation represent?`,
            `${ctx.zh(b, m)}这个方程的图象的${askIntercept ? "纵轴截距" : "斜率"}表示什么？`,
          ),
          correct,
          [askIntercept ? ctx.slope : ctx.intercept, ...ctx.others],
          askIntercept
            ? t(
                `The vertical intercept is the output when the input is $0$, here $${b}$: ${ctx.intercept.en.toLowerCase()}.`,
                `纵轴截距是输入为 $0$ 时的输出，这里是 $${b}$：${ctx.intercept["zh-CN"]}。`,
              )
            : t(
                `The slope is the change in the output for each increase of $1$ in the input, here $${m}$: ${ctx.slope.en.toLowerCase()}.`,
                `斜率是输入每增加 $1$ 时输出的变化量，这里是 $${m}$：${ctx.slope["zh-CN"]}。`,
              ),
        );
      },
      costModelFigure,
    ),
    kp(
      "features-of-a-projectile-graph",
      t("Features of the graph of a height model", "高度模型图象的特征"),
      t(
        "For a height model $h(t) = -16t^{2} + vt + s$, the $h$-intercept $s$ is the height at time $0$, the launch height. The vertex $(t, h)$ gives the time of the highest point and the maximum height. The positive $t$-intercept is the time when the height is $0$, when the object reaches the ground.",
        "对于高度模型 $h(t) = -16t^{2} + vt + s$，$h$ 轴截距 $s$ 是时刻 $0$ 的高度，即发射高度。顶点 $(t, h)$ 给出到达最高点的时刻和最大高度。正的 $t$ 轴截距是高度为 $0$ 的时刻，即物体落地的时刻。",
      ),
      (rng) => {
        const v = rng.int(2, 12) * 8;
        const s = rng.int(0, 30) * 2;
        const feature = rng.pick(["intercept", "vertexY", "vertexX", "zero"] as const);
        const meanings: Record<typeof feature, Text> = {
          intercept: t("The height of the ball when it was thrown", "球被抛出时的高度"),
          vertexY: t("The greatest height the ball reaches", "球达到的最大高度"),
          vertexX: t("The time it takes the ball to reach its greatest height", "球到达最高点所用的时间"),
          zero: t("The time it takes the ball to hit the ground", "球落地所用的时间"),
        };
        const askEn: Record<typeof feature, string> = {
          intercept: "the $h$-intercept",
          vertexY: "the $h$-coordinate of the vertex",
          vertexX: "the $t$-coordinate of the vertex",
          zero: "the positive $t$-intercept",
        };
        const askZh: Record<typeof feature, string> = {
          intercept: " $h$ 轴截距",
          vertexY: "顶点的 $h$ 坐标",
          vertexX: "顶点的 $t$ 坐标",
          zero: "正的 $t$ 轴截距",
        };
        const model = `h(t) = -16t^{2} + ${v}t${s ? ` + ${s}` : ""}`;
        return pickChoice(
          rng,
          t(
            `A ball is thrown upward. Its height, in feet, $t$ seconds after it is thrown is $${model}$. What does ${askEn[feature]} of the graph of $h$ represent?`,
            `一个球被向上抛出。抛出 $t$ 秒后它的高度（英尺）为 $${model}$。$h$ 的图象的${askZh[feature]}表示什么？`,
          ),
          meanings[feature],
          (Object.keys(meanings) as (typeof feature)[]).filter((k) => k !== feature).map((k) => meanings[k]),
          t(
            `${meanings[feature].en} is described by ${askEn[feature]}: the $h$-intercept is the height at $t = 0$, the vertex gives the highest point, and the positive $t$-intercept is where $h(t) = 0$.`,
            `${meanings[feature]["zh-CN"]}由${askZh[feature]}描述：$h$ 轴截距是 $t = 0$ 时的高度，顶点给出最高点，正的 $t$ 轴截距是 $h(t) = 0$ 的位置。`,
          ),
        );
      },
      heightModelFigure,
    ),
  ],
);

// ---------------------------------------------------------------------------
// Systems of nonlinear equations

/** solvingConstantQuadraticSystemsOfEquations intersects a parabola with a horizontal line. */
export const solvingConstantQuadraticSystemsOfEquations = topic(
  "solving-constant-quadratic-systems-of-equations",
  t("Solving Constant-Quadratic Systems of Equations", "解常数与二次函数组成的方程组"),
  t(
    "Solve systems made of a quadratic equation and a horizontal line, and count their solutions.",
    "解由二次方程与水平直线组成的方程组，并判断解的个数。",
  ),
  ["solving-systems-of-nonlinear-equations", "the-vertex-form-of-a-parabola"],
  ["A-REI.C.7", "A-REI.D.11"],
  [
    kp(
      "sum-of-the-x-coordinates",
      t("The sum of the x-coordinates", "横坐标之和"),
      t(
        "Solving $y = x^{2} + bx + c$ together with $y = k$ means solving $x^{2} + bx + (c - k) = 0$. The $x$-coordinates of the two intersection points are the roots of this equation, so their sum is $-b$ and they lie symmetrically about $x = -\\frac{b}{2}$. The value of $k$ changes the roots but not their sum.",
        "把 $y = x^{2} + bx + c$ 与 $y = k$ 联立，就是解 $x^{2} + bx + (c - k) = 0$。两个交点的横坐标是这个方程的根，所以它们的和为 $-b$，并关于 $x = -\\frac{b}{2}$ 对称。$k$ 的值会改变两个根，但不改变它们的和。",
      ),
      (rng) => {
        const r1 = rng.int(-9, 9);
        let r2 = rng.int(-9, 9);
        while (r2 === r1) r2 = rng.int(-9, 9);
        const k = rng.nonZero(-15, 15);
        const b = -(r1 + r2);
        const c = r1 * r2 + k;
        const askProduct = rng.bool(0.3);
        const answer = askProduct ? r1 * r2 : r1 + r2;
        return numberProblem({
          prompt: t(
            `The system $y = ${quadratic(1, b, c)}$ and $y = ${k}$ has two solutions, $(x_{1}, y_{1})$ and $(x_{2}, y_{2})$. What is the value of $x_{1} ${askProduct ? "\\cdot" : "+"} x_{2}$?`,
            `方程组 $y = ${quadratic(1, b, c)}$ 与 $y = ${k}$ 有两个解 $(x_{1}, y_{1})$ 和 $(x_{2}, y_{2})$。求 $x_{1} ${askProduct ? "\\cdot" : "+"} x_{2}$ 的值。`,
          ),
          answer,
          wrong: distinct(
            Q.of(answer),
            askProduct ? [Q.of(c), Q.of(-(r1 * r2)), Q.of(r1 + r2), Q.of(c + k)] : [Q.of(b), Q.of(2 * k), Q.of(c - k), Q.of(r1 * r2)],
          ),
          solution: t(
            `Substitute $y = ${k}$:${steps(`${quadratic(1, b, c)} = ${k}`, `${quadratic(1, b, c - k)} = 0`, `${shifted(r1)}${shifted(r2)} = 0`)}So $x_{1}$ and $x_{2}$ are $${r1}$ and $${r2}$, and ${askProduct ? `their product is $${answer}$` : `their sum is $${answer}$`}.`,
            `代入 $y = ${k}$：${steps(`${quadratic(1, b, c)} = ${k}`, `${quadratic(1, b, c - k)} = 0`, `${shifted(r1)}${shifted(r2)} = 0`)}所以 $x_{1}$、$x_{2}$ 为 $${r1}$ 和 $${r2}$，${askProduct ? `它们的积是 $${answer}$` : `它们的和是 $${answer}$`}。`,
          ),
        });
      },
    ),
    kp(
      "counting-intersections-with-a-horizontal-line",
      t("Counting intersections with a horizontal line", "判断与水平直线的交点个数"),
      t(
        "The parabola $y = a(x - h)^{2} + m$ has its vertex at height $m$. If it opens up ($a > 0$), a horizontal line $y = k$ meets it twice when $k > m$, once when $k = m$, and never when $k < m$. If it opens down, the inequalities reverse. So you can count the solutions by comparing $k$ with the height of the vertex.",
        "抛物线 $y = a(x - h)^{2} + m$ 的顶点高度为 $m$。若它开口向上（$a > 0$），水平直线 $y = k$ 在 $k > m$ 时与它交于两点，$k = m$ 时交于一点，$k < m$ 时没有交点。若开口向下，不等号方向相反。所以比较 $k$ 与顶点的高度就能判断解的个数。",
      ),
      (rng) => {
        const a = rng.pick([1, 2, 3, -1, -2, -3]);
        const h = rng.int(-8, 8);
        const m = rng.int(-12, 12);
        const rel = rng.pick([-1, 0, 1]);
        const k = m + rel * rng.int(1, 9);
        const count = k === m ? 1 : k > m === a > 0 ? 2 : 0;
        return numberProblem({
          prompt: t(
            `How many solutions does the system $y = ${lead(a)}${shifted(h)}^{2} ${m < 0 ? "-" : "+"} ${Math.abs(m)}$ and $y = ${k}$ have?`,
            `方程组 $y = ${lead(a)}${shifted(h)}^{2} ${m < 0 ? "-" : "+"} ${Math.abs(m)}$ 与 $y = ${k}$ 有几个解？`,
          ),
          answer: count,
          form: "integer",
          wrong: distinct(Q.of(count), [Q.of(0), Q.of(1), Q.of(2)]),
          solution: t(
            `The parabola opens ${a > 0 ? "up" : "down"} with its vertex at height $${m}$. The line $y = ${k}$ is ${k === m ? "at the height of the vertex, so it touches the parabola once" : k > m ? `above the vertex, so it meets the parabola ${a > 0 ? "twice" : "nowhere"}` : `below the vertex, so it meets the parabola ${a > 0 ? "nowhere" : "twice"}`}. The system has $${count}$ solution${count === 1 ? "" : "s"}.`,
            `抛物线开口向${a > 0 ? "上" : "下"}，顶点高度为 $${m}$。直线 $y = ${k}$ ${k === m ? "与顶点等高，所以与抛物线只有一个公共点" : k > m ? `在顶点上方，所以与抛物线${a > 0 ? "交于两点" : "没有交点"}` : `在顶点下方，所以与抛物线${a > 0 ? "没有交点" : "交于两点"}`}。方程组有 $${count}$ 个解。`,
          ),
        });
      },
    ),
  ],
);

/** satPrepAdvancedTopics lists the SAT Math Prep advanced math topics in prerequisite order. */
export const satPrepAdvancedTopics: readonly TopicDef[] = [
  determiningInputsOfQuadraticFunctionsForGivenOutputs,
  findingExtremeValuesOfQuadraticFunctionsInFactoredForm,
  findingExtremeValuesOfQuadraticFunctionsInStandardForm,
  transformingExponentialFunctions,
  identifyingExponentialFunctionsFromTabularData,
  calculatingUnknownTimesInExponentialModels,
  convertingUnitsOfTimeInExponentialModels,
  identifyingGraphPropertiesInModelingContexts,
  solvingConstantQuadraticSystemsOfEquations,
];
