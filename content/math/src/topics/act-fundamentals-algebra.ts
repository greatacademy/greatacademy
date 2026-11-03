import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// ACT Math Fundamentals, algebra: nested substitution, locating a radical among known values, reasoning under
// absolute-value constraints, variable ratios from homogeneous equations, quadratics with a parameter, and completing
// the square when the linear coefficient is odd.

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
function kp(id: string, title: Text, explanation: Text, generate: (rng: Rng) => Problem): KnowledgePointDef {
  return { id, title, explanation, generate };
}

/** nonzero picks a nonzero integer in [-m, m]. */
const nonzero = (rng: Rng, m: number) => rng.pick([...Array(2 * m + 1).keys()].map((i) => i - m).filter((v) => v !== 0));

// ---------------------------------------------------------------------------
// Nested expressions

/** chained are the expressions in x and y of the chained-substitution problems. */
const chained: readonly [string, (x: number, y: number) => number, (x: string, y: string) => string][] = [
  ["x^{2} - y", (x, y) => x * x - y, (x, y) => `(${x})^{2} - (${y})`],
  ["xy + y", (x, y) => x * y + y, (x, y) => `(${x})(${y}) + (${y})`],
  ["2y - x^{2}", (x, y) => 2 * y - x * x, (x, y) => `2(${y}) - (${x})^{2}`],
  ["(y - x)^{2}", (x, y) => (y - x) ** 2, (x, y) => `\\left((${y}) - (${x})\\right)^{2}`],
  ["y^{2} - 3x", (x, y) => y * y - 3 * x, (x, y) => `(${y})^{2} - 3(${x})`],
];

/** times writes m times the value v for a substitution step: "3(-2)", "-(4)", "5". */
const times = (m: number, v: number) => (m === 1 ? paren(v) : m === -1 ? `-(${v})` : `${m}(${v})`);

/** Nested is a template of the nested-grouping problems: its LaTeX, its value, and two values from typical slips. */
interface Nested {
  readonly latex: string;
  readonly f: (x: number) => number;
  readonly slips: readonly ((x: number) => number)[];
  readonly show: (x: number) => string[];
}

/** nestedTemplates builds the nested-grouping templates for constants p, q and r. */
function nestedTemplates(p: number, q: number, r: number): Nested[] {
  return [
    {
      latex: `${p} - ${q}\\left[x - (${r} - x)^{2}\\right]`,
      f: (x) => p - q * (x - (r - x) ** 2),
      slips: [(x) => p - q * x - (r - x) ** 2, (x) => (p - q) * (x - (r - x) ** 2)],
      show: (x) => [
        `${p} - ${q}\\left[${paren(x)} - (${r} - ${paren(x)})^{2}\\right]`,
        `= ${p} - ${q}\\left[${paren(x)} - (${r - x})^{2}\\right]`,
        `= ${p} - ${q}\\left[${paren(x)} - ${(r - x) ** 2}\\right]`,
        `= ${p} - ${q}(${x - (r - x) ** 2}) = ${p - q * (x - (r - x) ** 2)}`,
      ],
    },
    {
      latex: `${p}\\left[x^{2} - ${q}(x - ${r})\\right]`,
      f: (x) => p * (x * x - q * (x - r)),
      slips: [(x) => p * (x * x - q * x - r), (x) => p * x * x - q * (x - r)],
      show: (x) => [
        `${p}\\left[${paren(x)}^{2} - ${q}(${paren(x)} - ${r})\\right]`,
        `= ${p}\\left[${x * x} - ${q}(${x - r})\\right]`,
        `= ${p}(${x * x - q * (x - r)}) = ${p * (x * x - q * (x - r))}`,
      ],
    },
    {
      latex: `\\left(${p} - (x - ${q})^{2}\\right)(x + ${r})`,
      f: (x) => (p - (x - q) ** 2) * (x + r),
      slips: [(x) => (p - (x * x - q * q)) * (x + r), (x) => (p - (x - q) ** 2) * x + r],
      show: (x) => [
        `\\left(${p} - (${paren(x)} - ${q})^{2}\\right)(${paren(x)} + ${r})`,
        `= \\left(${p} - (${x - q})^{2}\\right)(${x + r})`,
        `= (${p - (x - q) ** 2})(${x + r}) = ${(p - (x - q) ** 2) * (x + r)}`,
      ],
    },
  ];
}

/** evaluatingNestedExpressionsAfterSubstitution evaluates chained definitions and nested grouping symbols. */
export const evaluatingNestedExpressionsAfterSubstitution = topic(
  "evaluating-nested-expressions-after-substitution",
  t("Evaluating Nested Expressions After Substitution", "代入后求嵌套表达式的值"),
  t(
    "Substitute a value through a chain of definitions, or into an expression with nested grouping symbols, and evaluate from the inside out.",
    "把一个值沿着一串定义依次代入，或代入含多层括号的表达式，并由内向外求值。",
  ),
  ["evaluating-algebraic-expressions"],
  ["6.EE.A.2c"],
  [
    kp(
      "a-chain-of-substitutions",
      t("A chain of substitutions", "依次代入"),
      t(
        "When one variable is defined in terms of another, substitute in order. If $x = -2$ and $y = 3x + 1$, first find $y = 3(-2) + 1 = -5$; then $x^{2} - y = (-2)^{2} - (-5) = 9$. Put each negative value in parentheses when you substitute: $(-2)^{2} = 4$, while $-2^{2} = -4$.",
        "当一个变量用另一个变量定义时，按顺序代入。若 $x = -2$，$y = 3x + 1$，先求 $y = 3(-2) + 1 = -5$；再求 $x^{2} - y = (-2)^{2} - (-5) = 9$。代入负数时要加括号：$(-2)^{2} = 4$，而 $-2^{2} = -4$。",
      ),
      (rng) => {
        const x = nonzero(rng, 5);
        const m = nonzero(rng, 4);
        const b = rng.int(-6, 6);
        const y = m * x + b;
        const [e, f, show] = rng.pick(chained);
        const answer = f(x, y);
        const yLatex = poly([m, "x"], [b, ""]);
        return numberProblem({
          prompt: t(
            `If $x = ${x}$ and $y = ${yLatex}$, what is the value of $${e}$?`,
            `若 $x = ${x}$，$y = ${yLatex}$，则 $${e}$ 的值是多少？`,
          ),
          answer,
          wrong: [f(x, m * x - b), f(-x, y), f(x, -y), e.includes("x^{2}") ? f(x, y) - 2 * x * x : answer + 2 * y],
          solution: t(
            `First $y = ${b === 0 ? times(m, x) : `${times(m, x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`} = ${y}$. Then substitute both values:${steps(`${show(`${x}`, `${y}`)} = ${answer}`)}`,
            `先求 $y = ${b === 0 ? times(m, x) : `${times(m, x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`} = ${y}$。再代入两个值：${steps(`${show(`${x}`, `${y}`)} = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "nested-grouping-symbols",
      t("Nested grouping symbols", "多层括号"),
      t(
        "With brackets inside brackets, work from the innermost pair outward. For $10 - 2\\left[x - (4 - x)^{2}\\right]$ at $x = 1$: the innermost part is $4 - 1 = 3$, its square is $9$, the bracket is $1 - 9 = -8$, and the value is $10 - 2(-8) = 26$. A number in front of a bracket multiplies the whole bracket, not only its first term.",
        "括号里还有括号时，从最里层向外算。求 $10 - 2\\left[x - (4 - x)^{2}\\right]$ 在 $x = 1$ 时的值：最里层 $4 - 1 = 3$，平方为 $9$，中括号为 $1 - 9 = -8$，结果为 $10 - 2(-8) = 26$。括号前的数乘的是整个括号，而不只是括号中的第一项。",
      ),
      (rng) => {
        const [p, q, r] = [rng.int(2, 9), rng.int(2, 5), rng.int(1, 6)];
        const x = nonzero(rng, 4);
        const tpl = rng.pick(nestedTemplates(p, q, r));
        const answer = tpl.f(x);
        return numberProblem({
          prompt: t(`What is the value of $${tpl.latex}$ when $x = ${x}$?`, `当 $x = ${x}$ 时，$${tpl.latex}$ 的值是多少？`),
          answer,
          wrong: [...tpl.slips.map((s) => s(x)), tpl.f(-x)],
          solution: t(
            `Work from the innermost grouping outward:${steps(...tpl.show(x))}`,
            `由最里层的括号向外计算：${steps(...tpl.show(x))}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Locating a radical

/** pairText names two numbers as an answer option: "7 and 8". */
const pairText = (a: string, b: string): Text => t(`$${a}$ and $${b}$`, `$${a}$ 和 $${b}$`);

/** tenth writes k + d/10 as a decimal. */
const tenth = (v: number) => (v / 10).toFixed(1);

/** locatingARadicalAmongKnownValues places a square root between consecutive integers or tenths. */
export const locatingARadicalAmongKnownValues = topic(
  "locating-a-radical-among-known-values",
  t("Locating a Radical Among Known Values", "确定根式在已知数值之间的位置"),
  t(
    "Place a square root between consecutive integers or consecutive tenths by comparing the number under the root with the squares of the candidates.",
    "把被开方数与候选数的平方比较，确定平方根位于哪两个相邻整数或相邻十分位数之间。",
  ),
  ["approximating-square-roots"],
  ["8.NS.A.2"],
  [
    kp(
      "between-consecutive-integers",
      t("Between consecutive integers", "在相邻整数之间"),
      t(
        "To place $\\sqrt{n}$, find the perfect squares on either side of $n$. Since $49 < 58 < 64$, taking square roots gives $7 < \\sqrt{58} < 8$. Compare squares, not the number itself: $\\sqrt{58}$ is not near $58 \\div 2 = 29$.",
        "要确定 $\\sqrt{n}$ 的位置，找出 $n$ 两边的完全平方数。因为 $49 < 58 < 64$，取平方根得 $7 < \\sqrt{58} < 8$。要比较的是平方，而不是数本身：$\\sqrt{58}$ 并不接近 $58 \\div 2 = 29$。",
      ),
      (rng) => {
        const k = rng.int(2, 14);
        const n = rng.int(k * k + 1, (k + 1) * (k + 1) - 1);
        const half = Math.floor(n / 2);
        return pickChoice(
          rng,
          t(`Between which two consecutive integers does $\\sqrt{${n}}$ lie?`, `$\\sqrt{${n}}$ 位于哪两个相邻整数之间？`),
          pairText(`${k}`, `${k + 1}`),
          [
            pairText(`${k - 1}`, `${k}`),
            pairText(`${k + 1}`, `${k + 2}`),
            pairText(`${half}`, `${half + 1}`),
            pairText(`${k + 2}`, `${k + 3}`),
          ],
          t(
            `$${k}^{2} = ${k * k}$ and $${k + 1}^{2} = ${(k + 1) ** 2}$. Since $${k * k} < ${n} < ${(k + 1) ** 2}$, we get $${k} < \\sqrt{${n}} < ${k + 1}$.`,
            `$${k}^{2} = ${k * k}$，$${k + 1}^{2} = ${(k + 1) ** 2}$。由于 $${k * k} < ${n} < ${(k + 1) ** 2}$，得 $${k} < \\sqrt{${n}} < ${k + 1}$。`,
          ),
        );
      },
    ),
    kp(
      "between-consecutive-tenths",
      t("Between consecutive tenths", "在相邻十分位数之间"),
      t(
        "To place $\\sqrt{n}$ between tenths, square the candidates. Since $7.1^{2} = 50.41$ and $7.2^{2} = 51.84$, and $50.41 < 51 < 51.84$, the root $\\sqrt{51}$ lies between $7.1$ and $7.2$. First find the consecutive integers, then try the tenths between them.",
        "要确定 $\\sqrt{n}$ 位于哪两个十分位数之间，就把候选数平方。因为 $7.1^{2} = 50.41$，$7.2^{2} = 51.84$，且 $50.41 < 51 < 51.84$，所以 $\\sqrt{51}$ 位于 $7.1$ 和 $7.2$ 之间。先确定相邻整数，再在它们之间试十分位数。",
      ),
      (rng) => {
        // Pick tenths a/10 < √n < (a + 1)/10 with an integer n strictly between their squares.
        let a = 0;
        let n = 0;
        for (;;) {
          a = rng.int(2, 9) * 10 + rng.int(1, 7);
          n = Math.floor((a * a) / 100) + 1;
          if (n * 100 < (a + 1) * (a + 1) && n * 100 > a * a) break;
        }
        const sq = (v: number) => ((v * v) / 100).toFixed(2);
        return pickChoice(
          rng,
          t(`Between which two consecutive tenths does $\\sqrt{${n}}$ lie?`, `$\\sqrt{${n}}$ 位于哪两个相邻的十分位数之间？`),
          pairText(tenth(a), tenth(a + 1)),
          [pairText(tenth(a - 1), tenth(a)), pairText(tenth(a + 1), tenth(a + 2)), pairText(tenth(a + 2), tenth(a + 3))],
          t(
            `$${tenth(a)}^{2} = ${sq(a)}$ and $${tenth(a + 1)}^{2} = ${sq(a + 1)}$. Since $${sq(a)} < ${n} < ${sq(a + 1)}$, the root $\\sqrt{${n}}$ lies between $${tenth(a)}$ and $${tenth(a + 1)}$.`,
            `$${tenth(a)}^{2} = ${sq(a)}$，$${tenth(a + 1)}^{2} = ${sq(a + 1)}$。由于 $${sq(a)} < ${n} < ${sq(a + 1)}$，$\\sqrt{${n}}$ 位于 $${tenth(a)}$ 和 $${tenth(a + 1)}$ 之间。`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Absolute-value constraints

/** reasoningUnderAbsoluteValueConstraints finds the values that absolute-value constraints allow. */
export const reasoningUnderAbsoluteValueConstraints = topic(
  "reasoning-under-absolute-value-constraints",
  t("Reasoning Under Absolute-Value Constraints", "在绝对值约束下推理"),
  t(
    "Turn an absolute-value inequality into the interval of values it allows, and combine two such intervals to find the possible values of a sum or difference.",
    "把绝对值不等式化为它所允许的取值区间，并结合两个这样的区间求和或差的可能取值。",
  ),
  ["absolute-value-inequalities"],
  ["HSA.REI.B.3"],
  [
    kp(
      "values-a-constraint-allows",
      t("Values a constraint allows", "约束允许的值"),
      t(
        "$|cx - d| < e$ says that $cx - d$ is within $e$ of $0$, so $-e < cx - d < e$. Add $d$ and divide by $c$ to get the interval for $x$. For $|2x - 3| < 7$: $-7 < 2x - 3 < 7$, so $-4 < 2x < 10$ and $-2 < x < 5$. With $<$ the endpoints are excluded; with $\\le$ they are included.",
        "$|cx - d| < e$ 表示 $cx - d$ 与 $0$ 的距离小于 $e$，即 $-e < cx - d < e$。各部分加 $d$ 再除以 $c$，就得到 $x$ 的区间。例如 $|2x - 3| < 7$：$-7 < 2x - 3 < 7$，所以 $-4 < 2x < 10$，$-2 < x < 5$。用 $<$ 时不含端点；用 $\\le$ 时含端点。",
      ),
      (rng) => {
        const c = rng.pick([1, 2, 3]);
        const lo = rng.int(-8, 2);
        const hi = lo + rng.int(2, 6);
        // cx - d lies within e of 0 exactly when lo < x < hi: d = c(lo + hi)/2, e = c(hi - lo)/2, doubled if odd.
        const s = (lo + hi) % 2 === 0 ? 1 : 2;
        const [d, e] = [(c * s * (lo + hi)) / 2, (c * s * (hi - lo)) / 2];
        const closed = rng.bool();
        const inside = (v: number) => (closed ? v >= lo && v <= hi : v > lo && v < hi);
        const right = rng.pick([...Array(hi - lo + 1).keys()].map((i) => lo + i).filter(inside));
        const outside = [lo - 1, lo - 2, hi + 1, hi + 2, lo, hi, -hi, -lo].filter((v) => !inside(v));
        const expr = poly([c * s, "x"], [-d, ""]);
        const rel = closed ? "\\le" : "<";
        return pickChoice(
          rng,
          t(
            `If $|${expr}| ${rel} ${e}$, which of the following could be the value of $x$?`,
            `若 $|${expr}| ${rel} ${e}$，则 $x$ 可能是下列哪一个值？`,
          ),
          mathText(`${right}`),
          rng.sample([...new Set(outside)], 3).map((v) => mathText(`${v}`)),
          t(
            `The inequality means ${steps(`${-e} ${rel} ${expr} ${rel} ${e}`, `${-e + d} ${rel} ${c * s === 1 ? "x" : `${c * s}x`} ${rel} ${e + d}`, `${lo} ${rel} x ${rel} ${hi}`)}Of the options only $${right}$ lies in this interval.`,
            `这个不等式即 ${steps(`${-e} ${rel} ${expr} ${rel} ${e}`, `${-e + d} ${rel} ${c * s === 1 ? "x" : `${c * s}x`} ${rel} ${e + d}`, `${lo} ${rel} x ${rel} ${hi}`)}选项中只有 $${right}$ 在这个区间内。`,
          ),
        );
      },
    ),
    kp(
      "combining-two-constraints",
      t("Combining two constraints", "结合两个约束"),
      t(
        "If $|x - 3| < 2$ and $|y + 1| < 1$, then $1 < x < 5$ and $-2 < y < 0$. A sum takes its extremes from the extremes of both: $-1 < x + y < 5$. For a difference, pair the largest $x$ with the smallest $y$: $x - y$ is below $5 - (-2) = 7$ and above $1 - 0 = 1$, so $1 < x - y < 7$.",
        "若 $|x - 3| < 2$，$|y + 1| < 1$，则 $1 < x < 5$，$-2 < y < 0$。和的极端值来自两者的极端值：$-1 < x + y < 5$。对于差，要用最大的 $x$ 配最小的 $y$：$x - y$ 小于 $5 - (-2) = 7$，大于 $1 - 0 = 1$，所以 $1 < x - y < 7$。",
      ),
      (rng) => {
        const [a, b, c, d] = [rng.int(-5, 6), rng.int(1, 4), rng.int(-5, 6), rng.int(1, 3)];
        const sum = rng.bool();
        const [lo, hi] = sum ? [a + c - b - d, a + c + b + d] : [a - c - b - d, a - c + b + d];
        const right = rng.int(lo + 1, hi - 1);
        // Wrong values: the endpoints, values past them, and values from the other operation's interval.
        const other = sum ? [a - c - b - d, a - c + b + d] : [a + c - b - d, a + c + b + d];
        const outside = [lo, hi, lo - 1, hi + 1, ...other].filter((v) => v <= lo || v >= hi);
        const target = sum ? "x + y" : "x - y";
        const [xLo, xHi, yLo, yHi] = [a - b, a + b, c - d, c + d];
        return pickChoice(
          rng,
          t(
            `If $|${poly([1, "x"], [-a, ""])}| < ${b}$ and $|${poly([1, "y"], [-c, ""])}| < ${d}$, which of the following could be the value of $${target}$?`,
            `若 $|${poly([1, "x"], [-a, ""])}| < ${b}$，$|${poly([1, "y"], [-c, ""])}| < ${d}$，则 $${target}$ 可能是下列哪一个值？`,
          ),
          mathText(`${right}`),
          rng.sample([...new Set(outside)], 3).map((v) => mathText(`${v}`)),
          t(
            `The constraints give $${xLo} < x < ${xHi}$ and $${yLo} < y < ${yHi}$. ${sum ? `Adding the bounds gives $${lo} < x + y < ${hi}$.` : `The largest $x - y$ comes from the largest $x$ and the smallest $y$, and the smallest from the reverse: $${xLo} - ${paren(yHi)} < x - y < ${xHi} - ${paren(yLo)}$, that is $${lo} < x - y < ${hi}$.`} Of the options only $${right}$ lies strictly between these bounds.`,
            `由约束得 $${xLo} < x < ${xHi}$，$${yLo} < y < ${yHi}$。${sum ? `把上下界相加得 $${lo} < x + y < ${hi}$。` : `$x - y$ 的最大值来自最大的 $x$ 和最小的 $y$，最小值则相反：$${xLo} - ${paren(yHi)} < x - y < ${xHi} - ${paren(yLo)}$，即 $${lo} < x - y < ${hi}$。`}选项中只有 $${right}$ 严格位于这两个界之间。`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Homogeneous equations

/** findingVariableRatiosFromHomogeneousEquations finds x/y from equations whose terms all have the same degree. */
export const findingVariableRatiosFromHomogeneousEquations = topic(
  "finding-variable-ratios-from-homogeneous-equations",
  t("Finding Variable Ratios From Homogeneous Equations", "由齐次方程求变量之比"),
  t(
    "Find the ratio of two variables from an equation whose terms all have the same degree, and use a known ratio to evaluate a quotient of such expressions.",
    "由各项次数都相同的方程求两个变量之比，并利用已知的比求这类式子之商的值。",
  ),
  ["solving-quadratic-equations-by-factoring"],
  ["HSA.SSE.A.2"],
  [
    kp(
      "a-linear-relation",
      t("A linear relation", "一次关系"),
      t(
        "When every term contains $x$ or $y$ to the first power, collect the $x$ terms on one side and the $y$ terms on the other, then divide. From $7x + 2y = 3x + 8y$: $4x = 6y$, so $\\frac{x}{y} = \\frac{6}{4} = \\frac{3}{2}$. Neither value is fixed; only their ratio is.",
        "当每一项都含 $x$ 或 $y$ 的一次方时，把 $x$ 项移到一边、$y$ 项移到另一边，再相除。由 $7x + 2y = 3x + 8y$ 得 $4x = 6y$，所以 $\\frac{x}{y} = \\frac{6}{4} = \\frac{3}{2}$。两个值都不确定，确定的只是它们的比。",
      ),
      (rng) => {
        let [a, b, c, d] = [0, 0, 0, 0];
        do {
          [a, b, c, d] = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
        } while (a === c || b === d);
        const ratio = Q.of(d - b, a - c);
        return numberProblem({
          prompt: t(
            `If $${poly([a, "x"], [b, "y"])} = ${poly([c, "x"], [d, "y"])}$ and $y \\ne 0$, what is the value of $\\frac{x}{y}$?`,
            `若 $${poly([a, "x"], [b, "y"])} = ${poly([c, "x"], [d, "y"])}$，且 $y \\ne 0$，则 $\\frac{x}{y}$ 的值是多少？`,
          ),
          answer: ratio,
          form: "fraction",
          wrong: [Q.of(a - c, d - b), ratio.neg(), Q.of(d + b, a - c), Q.of(d, a)],
          solution: t(
            `Collect like terms:${steps(`${poly([a - c, "x"])} = ${poly([d - b, "y"])}`, `\\frac{x}{y} = ${ratio.toLatex()}`)}`,
            `合并同类项：${steps(`${poly([a - c, "x"])} = ${poly([d - b, "y"])}`, `\\frac{x}{y} = ${ratio.toLatex()}`)}`,
          ),
        });
      },
    ),
    kp(
      "a-quotient-from-a-known-ratio",
      t("A quotient from a known ratio", "由已知比求商"),
      t(
        "If $\\frac{x}{y} = 3$, divide the top and bottom of $\\frac{2x + y}{x - y}$ by $y$: it becomes $\\frac{2\\frac{x}{y} + 1}{\\frac{x}{y} - 1} = \\frac{2(3) + 1}{3 - 1} = \\frac{7}{2}$. Equivalently, take $x = 3y$ and cancel $y$. This works because every term has the same degree.",
        "若 $\\frac{x}{y} = 3$，把 $\\frac{2x + y}{x - y}$ 的分子分母同除以 $y$：得 $\\frac{2\\frac{x}{y} + 1}{\\frac{x}{y} - 1} = \\frac{2(3) + 1}{3 - 1} = \\frac{7}{2}$。也可以令 $x = 3y$ 再约去 $y$。之所以可行，是因为每一项的次数都相同。",
      ),
      (rng) => {
        const r = rng.pick([-3, -2, 2, 3, 4, 5]);
        let [p, q, s, u] = [0, 0, 0, 0];
        do {
          [p, q, s, u] = [rng.int(1, 5), nonzero(rng, 5), rng.int(1, 5), nonzero(rng, 5)];
        } while (s * r + u === 0 || p * r + q === 0);
        const answer = Q.of(p * r + q, s * r + u);
        const top = poly([p, "x"], [q, "y"]);
        const bottom = poly([s, "x"], [u, "y"]);
        return numberProblem({
          prompt: t(
            `If $\\frac{x}{y} = ${r}$, what is the value of $\\frac{${top}}{${bottom}}$?`,
            `若 $\\frac{x}{y} = ${r}$，则 $\\frac{${top}}{${bottom}}$ 的值是多少？`,
          ),
          answer,
          form: "fraction",
          wrong: (
            [
              [p + q, s + u],
              [p * r - q, s * r - u],
              [q * r + p, u * r + s],
              [p * r, s * r],
            ] as const
          )
            .filter(([, den]) => den !== 0)
            .map(([num, den]) => Q.of(num, den)),
          solution: t(
            `Replace $x$ with $${r}y$ and cancel $y$:${steps(`\\frac{${poly([p, `(${r}y)`], [q, "y"])}}{${poly([s, `(${r}y)`], [u, "y"])}} = \\frac{${p * r + q}y}{${s * r + u}y} = ${answer.toLatex()}`)}`,
            `把 $x$ 换成 $${r}y$ 并约去 $y$：${steps(`\\frac{${poly([p, `(${r}y)`], [q, "y"])}}{${poly([s, `(${r}y)`], [u, "y"])}} = \\frac{${p * r + q}y}{${s * r + u}y} = ${answer.toLatex()}`)}`,
          ),
        });
      },
    ),
    kp(
      "a-quadratic-relation",
      t("A quadratic relation", "二次关系"),
      t(
        "An equation such as $x^{2} - 5xy + 6y^{2} = 0$ factors like a quadratic in $x$: $(x - 2y)(x - 3y) = 0$. So $x = 2y$ or $x = 3y$, and with $y \\ne 0$ the ratio $\\frac{x}{y}$ is $2$ or $3$. Dividing the equation by $y^{2}$ gives the same thing: $\\left(\\frac{x}{y}\\right)^{2} - 5\\frac{x}{y} + 6 = 0$.",
        "像 $x^{2} - 5xy + 6y^{2} = 0$ 这样的方程可以像关于 $x$ 的二次式一样分解：$(x - 2y)(x - 3y) = 0$。所以 $x = 2y$ 或 $x = 3y$，在 $y \\ne 0$ 时 $\\frac{x}{y}$ 为 $2$ 或 $3$。把方程除以 $y^{2}$ 也得到同样结果：$\\left(\\frac{x}{y}\\right)^{2} - 5\\frac{x}{y} + 6 = 0$。",
      ),
      (rng) => {
        const [p, q] = rng.sample([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6], 2) as [number, number];
        const eq = poly([1, "x^{2}"], [-(p + q), "xy"], [p * q, "y^{2}"]);
        const right = rng.pick([p, q]);
        const wrong = [-p, -q, p * q, p + q, -(p + q)].filter((v) => v !== p && v !== q);
        return pickChoice(
          rng,
          t(
            `If $${eq} = 0$ and $y \\ne 0$, which of the following is a possible value of $\\frac{x}{y}$?`,
            `若 $${eq} = 0$，且 $y \\ne 0$，则 $\\frac{x}{y}$ 可能是下列哪一个值？`,
          ),
          mathText(`${right}`),
          wrong.map((v) => mathText(`${v}`)),
          t(
            `Factor: $(${poly([1, "x"], [-p, "y"])})(${poly([1, "x"], [-q, "y"])}) = 0$, so $x = ${poly([p, "y"])}$ or $x = ${poly([q, "y"])}$. The possible values of $\\frac{x}{y}$ are $${p}$ and $${q}$, and $${right}$ is among the options.`,
            `分解因式：$(${poly([1, "x"], [-p, "y"])})(${poly([1, "x"], [-q, "y"])}) = 0$，所以 $x = ${poly([p, "y"])}$ 或 $x = ${poly([q, "y"])}$。$\\frac{x}{y}$ 的可能值为 $${p}$ 和 $${q}$，选项中的是 $${right}$。`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Quadratics with a parameter

/** rootsText names two solutions as an answer option. */
const rootsText = (a: string, b: string): Text => t(`$x = ${a}$ or $x = ${b}$`, `$x = ${a}$ 或 $x = ${b}$`);

/** solvingQuadraticEquationsContainingUnknownParameters solves quadratics whose coefficients contain a parameter. */
export const solvingQuadraticEquationsContainingUnknownParameters = topic(
  "solving-quadratic-equations-containing-unknown-parameters",
  t("Solving Quadratic Equations Containing Unknown Parameters", "解含未知参数的二次方程"),
  t(
    "Solve a quadratic whose coefficients contain a parameter by factoring in terms of the parameter, and use one known solution to find the parameter and the other solution.",
    "通过用参数表示的因式分解来解系数含参数的二次方程，并利用一个已知解求出参数和另一个解。",
  ),
  ["solving-quadratic-equations-by-factoring"],
  ["HSA.REI.B.4b"],
  [
    kp(
      "solving-in-terms-of-a-parameter",
      t("Solving in terms of a parameter", "用参数表示解"),
      t(
        "Treat the parameter as a fixed number and factor as usual. For $x^{2} - kx - 6k^{2} = 0$, look for two terms with product $-6k^{2}$ and sum $-k$: they are $-3k$ and $2k$, so $(x - 3k)(x + 2k) = 0$ and $x = 3k$ or $x = -2k$. Check by substituting a value such as $k = 1$.",
        "把参数看作一个固定的数，照常分解。对于 $x^{2} - kx - 6k^{2} = 0$，找积为 $-6k^{2}$、和为 $-k$ 的两项：它们是 $-3k$ 和 $2k$，所以 $(x - 3k)(x + 2k) = 0$，$x = 3k$ 或 $x = -2k$。可以代入 $k = 1$ 之类的值来检验。",
      ),
      (rng) => {
        const [p, q] = rng.sample([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6], 2) as [number, number];
        const v = rng.pick(["k", "a", "c", "m"]);
        const eq = poly([1, "x^{2}"], [-(p + q), `${v}x`], [p * q, `${v}^{2}`]);
        const r = (c: number) => poly([c, v]);
        return pickChoice(
          rng,
          t(`In terms of $${v}$, what are the solutions of $${eq} = 0$?`, `用 $${v}$ 表示，方程 $${eq} = 0$ 的解是什么？`),
          rootsText(r(p), r(q)),
          [rootsText(r(-p), r(-q)), rootsText(r(p), r(-q)), rootsText(r(-p), r(q)), rootsText(r(p + q), r(p * q))],
          t(
            `The terms $${r(-p)}$ and $${r(-q)}$ have product $${poly([p * q, `${v}^{2}`])}$ and sum $${r(-(p + q))}$, so $${eq} = (${poly([1, "x"], [-p, v])})(${poly([1, "x"], [-q, v])})$. Setting each factor to $0$ gives $x = ${r(p)}$ or $x = ${r(q)}$.`,
            `$${r(-p)}$ 与 $${r(-q)}$ 的积为 $${poly([p * q, `${v}^{2}`])}$，和为 $${r(-(p + q))}$，所以 $${eq} = (${poly([1, "x"], [-p, v])})(${poly([1, "x"], [-q, v])})$。令每个因式为 $0$，得 $x = ${r(p)}$ 或 $x = ${r(q)}$。`,
          ),
        );
      },
    ),
    kp(
      "the-other-solution-from-a-known-one",
      t("The other solution from a known one", "由已知解求另一个解"),
      t(
        "If $x = 2$ is a solution of $x^{2} + kx - 10 = 0$, substitute it to find the parameter: $4 + 2k - 10 = 0$, so $k = 3$. The equation is $x^{2} + 3x - 10 = (x - 2)(x + 5) = 0$, and the other solution is $x = -5$. As a check, the two solutions multiply to the constant term: $2(-5) = -10$.",
        "若 $x = 2$ 是 $x^{2} + kx - 10 = 0$ 的一个解，代入它求参数：$4 + 2k - 10 = 0$，所以 $k = 3$。方程为 $x^{2} + 3x - 10 = (x - 2)(x + 5) = 0$，另一个解是 $x = -5$。检验：两个解之积等于常数项：$2(-5) = -10$。",
      ),
      (rng) => {
        const r = nonzero(rng, 6);
        let s = 0;
        do s = nonzero(rng, 7);
        while (s === r);
        const c = r * s;
        const k = -(r + s);
        const eq = `x^{2} + kx ${c < 0 ? "-" : "+"} ${Math.abs(c)} = 0`;
        return numberProblem({
          prompt: t(
            `$x = ${r}$ is a solution of $${eq}$, where $k$ is a constant. What is the other solution?`,
            `$x = ${r}$ 是方程 $${eq}$ 的一个解，其中 $k$ 是常数。另一个解是多少？`,
          ),
          answer: s,
          solveFor: "x",
          wrong: [-s, k, -r, c - r],
          solution: t(
            `Substitute $x = ${r}$:${steps(`${paren(r)}^{2} + ${paren(r)}k ${c < 0 ? "-" : "+"} ${Math.abs(c)} = 0`, `${poly([r, "k"])} = ${-(r * r + c)}`, `k = ${k}`)}So the equation is $${poly([1, "x^{2}"], [k, "x"], [c, ""])} = (${poly([1, "x"], [-r, ""])})(${poly([1, "x"], [-s, ""])}) = 0$, and the other solution is $x = ${s}$.`,
            `代入 $x = ${r}$：${steps(`${paren(r)}^{2} + ${paren(r)}k ${c < 0 ? "-" : "+"} ${Math.abs(c)} = 0`, `${poly([r, "k"])} = ${-(r * r + c)}`, `k = ${k}`)}所以方程为 $${poly([1, "x^{2}"], [k, "x"], [c, ""])} = (${poly([1, "x"], [-r, ""])})(${poly([1, "x"], [-s, ""])}) = 0$，另一个解是 $x = ${s}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Completing the square with an odd linear coefficient

/** oddCoefficients are the odd linear coefficients of the completing-the-square problems. */
const oddCoefficients = [-13, -11, -9, -7, -5, -3, -1, 1, 3, 5, 7, 9, 11, 13];

/** completingTheSquareWithOddLinearTerms completes the square when half the linear coefficient is a fraction. */
export const completingTheSquareWithOddLinearTerms = topic(
  "completing-the-square-with-odd-linear-terms",
  t("Completing the Square With Odd Linear Terms", "一次项系数为奇数时的配方"),
  t(
    "Complete the square when the coefficient of the linear term is odd, so that half of it and its square are fractions.",
    "在一次项系数为奇数时配方，此时一次项系数的一半及其平方都是分数。",
  ),
  ["completing-the-square"],
  ["HSA.SSE.B.3b"],
  [
    kp(
      "the-constant-that-completes-the-square",
      t("The constant that completes the square", "配成完全平方的常数"),
      t(
        "$x^{2} + bx + c$ is a perfect square when $c$ is the square of half of $b$. For $x^{2} + 5x + c$, half of $5$ is $\\frac{5}{2}$, so $c = \\left(\\frac{5}{2}\\right)^{2} = \\frac{25}{4}$ and $x^{2} + 5x + \\frac{25}{4} = \\left(x + \\frac{5}{2}\\right)^{2}$. Square the whole fraction: $\\left(\\frac{5}{2}\\right)^{2}$ is $\\frac{25}{4}$, not $\\frac{25}{2}$.",
        "当 $c$ 等于 $b$ 的一半的平方时，$x^{2} + bx + c$ 是完全平方式。对于 $x^{2} + 5x + c$，$5$ 的一半是 $\\frac{5}{2}$，所以 $c = \\left(\\frac{5}{2}\\right)^{2} = \\frac{25}{4}$，且 $x^{2} + 5x + \\frac{25}{4} = \\left(x + \\frac{5}{2}\\right)^{2}$。要把整个分数平方：$\\left(\\frac{5}{2}\\right)^{2}$ 是 $\\frac{25}{4}$，而不是 $\\frac{25}{2}$。",
      ),
      (rng) => {
        const b = rng.pick(oddCoefficients);
        const v = rng.pick(["x", "t", "y", "n"]);
        const half = Q.of(b, 2);
        const answer = half.mul(half);
        const expr = `${poly([1, `${v}^{2}`], [b, v])} + c`;
        return numberProblem({
          prompt: t(`What value of $c$ makes $${expr}$ a perfect square trinomial?`, `$c$ 取什么值时，$${expr}$ 是完全平方三项式？`),
          answer,
          form: "fraction",
          solveFor: "c",
          wrong: [half, Q.of(b * b, 2), Q.of(b * b), half.abs()],
          solution: t(
            `Half of $${b}$ is $${half.toLatex()}$, so $c = \\left(${half.toLatex()}\\right)^{2} = ${answer.toLatex()}$, and $${poly([1, `${v}^{2}`], [b, v])} + ${answer.toLatex()} = \\left(${poly([1, v], [half, ""])}\\right)^{2}$.`,
            `$${b}$ 的一半是 $${half.toLatex()}$，所以 $c = \\left(${half.toLatex()}\\right)^{2} = ${answer.toLatex()}$，且 $${poly([1, `${v}^{2}`], [b, v])} + ${answer.toLatex()} = \\left(${poly([1, v], [half, ""])}\\right)^{2}$。`,
          ),
        });
      },
    ),
    kp(
      "the-constant-in-vertex-form",
      t("The constant in vertex form", "顶点式中的常数"),
      t(
        "To write $x^{2} + 3x + 1$ as $(x + h)^{2} + k$, take $h = \\frac{3}{2}$. Since $\\left(x + \\frac{3}{2}\\right)^{2} = x^{2} + 3x + \\frac{9}{4}$, subtract what was added: $k = 1 - \\frac{9}{4} = -\\frac{5}{4}$. Write the constant over the common denominator $4$ before subtracting: $1 = \\frac{4}{4}$.",
        "要把 $x^{2} + 3x + 1$ 写成 $(x + h)^{2} + k$，取 $h = \\frac{3}{2}$。因为 $\\left(x + \\frac{3}{2}\\right)^{2} = x^{2} + 3x + \\frac{9}{4}$，所以要减去多加的部分：$k = 1 - \\frac{9}{4} = -\\frac{5}{4}$。相减前先把常数化成分母为 $4$ 的分数：$1 = \\frac{4}{4}$。",
      ),
      (rng) => {
        const b = rng.pick(oddCoefficients);
        const d = rng.int(-8, 8);
        const half = Q.of(b, 2);
        const square = half.mul(half);
        const k = Q.of(d).sub(square);
        const expr = poly([1, "x^{2}"], [b, "x"], [d, ""]);
        return numberProblem({
          prompt: t(
            `The expression $${expr}$ is written as $(x + h)^{2} + k$, where $h$ and $k$ are constants. What is the value of $k$?`,
            `把 $${expr}$ 写成 $(x + h)^{2} + k$ 的形式，其中 $h$、$k$ 是常数。$k$ 的值是多少？`,
          ),
          answer: k,
          form: "fraction",
          solveFor: "k",
          wrong: [Q.of(d).add(square), Q.of(d).sub(half), Q.of(d * 4 - b * b, 2), square.sub(Q.of(d))],
          solution: t(
            `Take $h = ${half.toLatex()}$. Then $\\left(${poly([1, "x"], [half, ""])}\\right)^{2} = ${poly([1, "x^{2}"], [b, "x"], [square, ""])}$, so${steps(`${expr} = \\left(${poly([1, "x"], [half, ""])}\\right)^{2} + ${paren(d)} - ${square.toLatex()}`, `k = ${k.toLatex()}`)}`,
            `取 $h = ${half.toLatex()}$。则 $\\left(${poly([1, "x"], [half, ""])}\\right)^{2} = ${poly([1, "x^{2}"], [b, "x"], [square, ""])}$，所以${steps(`${expr} = \\left(${poly([1, "x"], [half, ""])}\\right)^{2} + ${paren(d)} - ${square.toLatex()}`, `k = ${k.toLatex()}`)}`,
          ),
        });
      },
    ),
  ],
);

/** actFundamentalsAlgebraTopics are the ACT Math Fundamentals algebra topics. */
export const actFundamentalsAlgebraTopics: TopicDef[] = [
  evaluatingNestedExpressionsAfterSubstitution,
  locatingARadicalAmongKnownValues,
  reasoningUnderAbsoluteValueConstraints,
  findingVariableRatiosFromHomogeneousEquations,
  solvingQuadraticEquationsContainingUnknownParameters,
  completingTheSquareWithOddLinearTerms,
];
