import type { Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Coefficient, gcd, linear, num, poly, Q, type Surd, simplifyRadical, surd, surdLatex } from "@ga/subject-math";
import { algebraDrawings } from "../explanation-drawings-algebra.ts";
import { graphFigure } from "../graph-figures.ts";

import { choiceProblem, equationProblem, numberProblem, pointProblem, solutionsProblem, steps, whySet, yesNo } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** quad writes ax² + bx + c in the variable v. */
const quad = (a: Coefficient, b: Coefficient, c: Coefficient, v = "x") => poly([a, `${v}^{2}`], [b, v], [c, ""]);

/** lf writes the factor (px + q). */
const lf = (p: Coefficient, q: Coefficient, v = "x") => `(${linear(p, q, v)})`;

/** front writes a constant factor before parentheses: "", "-" or "3". */
const front = (k: number) => (k === 1 ? "" : k === -1 ? "-" : String(k));

/** tail writes a constant added after an expression: "", " + 3" or " - \frac{1}{2}". */
function tail(c: Coefficient): string {
  const v = toQ(c);
  return v.isZero() ? "" : v.sign() < 0 ? ` - ${num(v.neg())}` : ` + ${num(v)}`;
}

/** rootSlips are the two classic mistakes in reading the solutions off $(x - r)(x - s) = 0$. */
const rootSlips = (r: number, s: number) => [
  whySet(
    [num(-r), num(-s)],
    "The signs are wrong. A solution makes its factor zero: substitute your values into the factors and check.",
    "符号错了。解要使对应的因式等于零：把你的值代入因式检验一下。",
  ),
  whySet([num(r)], "There is a second solution: the product is zero when either factor is zero.", "还有一个解：任一因式为零时，积都为零。"),
];

/** isSquare tells whether n is the square of an integer. */
const isSquare = (n: number) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

/** sqrtSurd is √k for a rational k ≥ 0, in simplest form. */
function sqrtSurd(k: Q): Surd {
  if (k.isZero()) return surd(Q.zero);
  const [c, m] = simplifyRadical(Number(k.n * k.d));
  return surd(Q.zero, Q.of(c, k.d), BigInt(m));
}

/** pm lists center ± root in simplest form; one value when the root is 0. */
function pm(center: Q, root: Surd): string[] {
  if (root.m === 1n) {
    if (root.a.isZero()) return [num(center)];
    return [num(center.add(root.a)), num(center.sub(root.a))];
  }
  return [surdLatex(surd(center, root.b, root.m)), surdLatex(surd(center, root.b.neg(), root.m))];
}

/** rootsOf lists the real solutions of ax² + bx + c = 0 in simplest form. */
function rootsOf(a: number, b: number, c: number): string[] {
  const d = b * b - 4 * a * c;
  if (d < 0) return [];
  return pm(Q.of(-b, 2 * a), sqrtSurd(Q.of(d, 4 * a * a)));
}

/** pmLatex writes center ± root as a learner would: "-3 \\pm 2\\sqrt{2}", "\\frac{5 \\pm \\sqrt{13}}{2}", "\\pm 4". */
function pmLatex(center: Q, root: Surd): string {
  if (root.m === 1n) {
    if (root.a.isZero()) return num(center);
    return `${center.isZero() ? "" : `${num(center)} `}\\pm ${num(root.a.abs())}`;
  }
  const b = root.b.abs();
  const d = (center.d * b.d) / gcdBig(center.d, b.d);
  const p = (center.n * d) / center.d;
  const k = (b.n * d) / b.d;
  const rad = `${k === 1n ? "" : k}\\sqrt{${root.m}}`;
  if (d === 1n) return `${p === 0n ? "" : `${p} `}\\pm ${rad}`;
  return p === 0n ? `\\pm\\frac{${rad}}{${d}}` : `\\frac{${p} \\pm ${rad}}{${d}}`;
}

function gcdBig(a: bigint, b: bigint): bigint {
  let [x, y] = [a, b];
  while (y !== 0n) [x, y] = [y, x % y];
  return x;
}

/** solved writes a solution set in words: "$x = 2$ or $x = -3$", "$x = 5$", or that there is no real solution. */
function solved(values: readonly string[], v = "x"): Text {
  if (values.length === 0) return t("there is no real solution", "没有实数解");
  const en = values.map((x) => `$${v} = ${x}$`).join(" or ");
  const zh = values.map((x) => `$${v} = ${x}$`).join(" 或 ");
  return t(en, zh);
}

/** solvePrompt asks to solve an equation, optionally by a given method. */
function solvePrompt(eq: string, method?: Text): Text {
  return method ? t(`Solve $${eq}$ ${method.en}.`, `${method["zh-CN"]}解方程 $${eq}$。`) : t(`Solve $${eq}$.`, `解方程 $${eq}$。`);
}

const byFactoring = t("by factoring", "用因式分解法");
const byCompleting = t("by completing the square", "用配方法");
const byFormula = t("using the quadratic formula", "用求根公式");

/** inside writes a value in parentheses, as it is substituted after a coefficient: "(3)", "(-2)", "\left(\frac{1}{2}\right)". */
const inside = (x: Q) => (x.isInteger() ? `(${num(x)})` : `\\left(${num(x)}\\right)`);

/** bare writes a value substituted with no coefficient before it: negatives and fractions go in parentheses. */
const bare = (x: Q) => (x.isInteger() && x.sign() >= 0 ? num(x) : inside(x));

/** signed joins values into a sum as written: "18 - 15 + 3". */
function signed(values: readonly Q[]): string {
  const kept = values.filter((v) => !v.isZero());
  if (kept.length === 0) return "0";
  return kept.map((v, i) => (i === 0 ? num(v) : v.sign() < 0 ? ` - ${num(v.neg())}` : ` + ${num(v)}`)).join("");
}

/** substitution writes ax² + bx + c at x: term by term, then the value of each term, then the total: "2(3)^{2} - 5(3) + 3 = 18 - 15 + 3 = 6". */
function substitution(a: Coefficient, b: Coefficient, c: Coefficient, x: Q): string {
  const parts: string[] = [];
  const values: Q[] = [];
  for (const [k, power] of [
    [toQ(a), "^{2}"],
    [toQ(b), ""],
  ] as const) {
    if (k.isZero()) continue;
    const body = k.abs().eq(Q.one) ? `${bare(x)}${power}` : `${num(k.abs())}${inside(x)}${power}`;
    parts.push(parts.length === 0 ? `${k.sign() < 0 ? "-" : ""}${body}` : `${k.sign() < 0 ? " - " : " + "}${body}`);
    values.push(power ? k.mul(x).mul(x) : k.mul(x));
  }
  const C = toQ(c);
  if (!C.isZero()) {
    parts.push(parts.length === 0 ? num(C) : C.sign() < 0 ? ` - ${num(C.neg())}` : ` + ${num(C)}`);
    values.push(C);
  }
  const total = values.reduce((s, v) => s.add(v), Q.zero);
  const shown = parts.join("");
  const middle = signed(values);
  return [shown, ...(middle === shown || middle === num(total) ? [] : [middle]), num(total)].join(" = ");
}

/** substituted checks rational solutions by putting each one back into ax² + bx + c = 0, written in the variable v. */
function substituted(a: Coefficient, b: Coefficient, c: Coefficient, roots: readonly Q[], v = "x"): Text {
  const lines = roots.map((r) => `${v} = ${num(r)}: \\quad ${substitution(a, b, c, r)}`);
  const one = roots.length === 1;
  return t(
    `**Check.** Put ${one ? "the solution" : "each solution"} back into $${quad(a, b, c, v)} = 0$:${steps(...lines)}${one ? "It gives" : "Each gives"} $0$, as it should.`,
    `**检验。** 把${one ? "这个解" : "每个解"}代回 $${quad(a, b, c, v)} = 0$：${steps(...lines)}${one ? "结果" : "结果都"}是 $0$，符合要求。`,
  );
}

/** expandedBack checks the solutions of ax² + bx + c = 0 by squaring out the completed square they come from, back to the equation; back says how that leads to the original equation when it was not in standard form. */
function expandedBack(a: number, b: number, c: number, back?: Text, fromRoots = false): Text {
  const p = Q.of(b, 2 * a);
  const k = p.mul(p).sub(Q.of(c, a));
  const square = p.isInteger() ? `(${linear(1, p)})^{2}` : `\\left(${linear(1, p)}\\right)^{2}`;
  const root = sqrtSurd(k);
  const r = pmLatex(Q.zero, root).replace(/^\\pm\s?/, "");
  const lines = [
    ...(fromRoots ? [`${square} = ${squaredRoot(root, k)}`] : []),
    `${quad(1, p.mul(Q.of(2)), p.mul(p))} = ${num(k)}`,
    `${quad(1, Q.of(b, a), Q.of(c, a))} = 0`,
  ];
  const opening = fromRoots
    ? t(
        `Each solution is $${num(p.neg())}$ plus or minus $${r}$, so $${linear(1, p)} = \\pm ${r}$, and squaring removes the sign. Square out the left side and move the constant back:`,
        `每个解都是 $${num(p.neg())}$ 加上或减去 $${r}$，所以 $${linear(1, p)} = \\pm ${r}$，平方后符号消失。把左边展开，再把常数移回左边：`,
      )
    : t(
        `The two solutions are the two numbers with $${square} = ${num(k)}$. Square out the left side and move the constant back:`,
        `两个解恰好是满足 $${square} = ${num(k)}$ 的两个数。把左边展开，再把常数移回左边：`,
      );
  const times = t(`Multiplying by $${a}$ gives $${quad(a, b, c)} = 0$`, `两边乘以 $${a}$ 得 $${quad(a, b, c)} = 0$`);
  const last = back
    ? a === 1
      ? back
      : t(`${times.en}. ${back.en}`, `${times["zh-CN"]}。${back["zh-CN"]}`)
    : a === 1
      ? t("This is the original equation.", "这正是原方程。")
      : t(`${times.en}, the original equation.`, `${times["zh-CN"]}，正是原方程。`);
  return t(`**Check.** ${opening.en}${steps(...lines)}${last.en}`, `**检验。** ${opening["zh-CN"]}${steps(...lines)}${last["zh-CN"]}`);
}

/** checked checks the real solutions of ax² + bx + c = 0: rational ones by substitution, irrational ones by expanding back; nothing when there are none. */
function checked(a: number, b: number, c: number, v = "x", back?: Text, fromRoots = false): Text | undefined {
  const d = b * b - 4 * a * c;
  if (d < 0) return undefined;
  if (!isSquare(d)) return expandedBack(a, b, c, back, fromRoots);
  const s = Math.sqrt(d);
  const roots = d === 0 ? [Q.of(-b, 2 * a)] : [Q.of(-b + s, 2 * a), Q.of(-b - s, 2 * a)].sort((x, y) => x.cmp(y));
  return substituted(a, b, c, roots, v);
}

/** drawRoots draws two distinct nonzero integer roots r and s with r + s ≠ 0. */
function drawRoots(rng: Rng, max = 10): [number, number] {
  let r: number;
  let s: number;
  do {
    r = rng.nonZero(-max, max);
    s = rng.nonZero(-max, max);
  } while (r === s || r + s === 0);
  return [r, s];
}

/** drawBinomials draws (px + q)(rx + s) with each factor primitive, p·r ≥ 2 and two distinct roots. */
function drawBinomials(rng: Rng, max = 9): [number, number, number, number] {
  let p: number;
  let q: number;
  let r: number;
  let s: number;
  do {
    p = rng.int(1, 5);
    r = rng.int(1, 5);
    q = rng.nonZero(-max, max);
    s = rng.nonZero(-max, max);
  } while (gcd(p, q) !== 1 || gcd(r, s) !== 1 || p * r < 2 || p * s + q * r === 0 || p * s === q * r);
  return [p, q, r, s];
}

export const introductionToQuadraticEquations: TopicDef = {
  id: "introduction-to-quadratic-equations",
  title: t("Introduction to Quadratic Equations", "一元二次方程简介"),
  summary: t(
    "Recognize quadratic equations, write them in standard form and check solutions.",
    "识别一元二次方程，把它写成一般形式，并检验解。",
  ),
  prerequisites: ["distributive-law-for-polynomials", "equations-with-variables-on-both-sides"],
  encompasses: [{ topic: "evaluating-expressions", weight: 0.2 }],
  xp: 10,
  standards: ["CCSS.HSA.REI.B.4"],
  intro: t(
    `So far every equation we solved was **linear**: after expanding, $x$ appeared only to the first power, and moving terms and dividing isolated it. Now try this puzzle: a number squared is $6$ more than the number. Written as an equation,

$$x^{2} = x + 6$$

The moves that solve linear equations get stuck here: $x$ appears both squared and on its own, and no amount of adding or dividing puts it alone. Still, we can test values. $x = 3$ gives $9 = 9$, so it works. So does $x = -2$, since $(-2)^{2} = 4 = -2 + 6$. A linear equation has at most one solution, but this one has two.

Moving every term to the left gives $x^{2} - x - 6 = 0$. The left side is $0$ exactly at the two solutions, which is where the graph of $y = x^{2} - x - 6$ crosses the $x$-axis:

{{figure 0}}

An equation like this, with an $x^{2}$ term and no higher power, is a **quadratic equation**. In this lesson we learn to recognize one, write it in a standard form, and check whether a number solves it. The lessons that follow find the solutions.`,
    `到目前为止，我们解过的方程都是**一次方程**：展开后 $x$ 只以一次幂出现，通过移项和相除就能把它单独求出。现在看这样一个问题：一个数的平方比这个数大 $6$。写成方程就是

$$x^{2} = x + 6$$

解一次方程的方法在这里行不通：$x$ 既以平方出现，又单独出现，无论怎样加减或相除都不能把它单独留在一边。不过我们可以试值。$x = 3$ 得 $9 = 9$，成立。$x = -2$ 也成立，因为 $(-2)^{2} = 4 = -2 + 6$。一次方程最多只有一个解，这个方程却有两个解。

把所有项移到左边得 $x^{2} - x - 6 = 0$。左边恰好在这两个解处等于 $0$，也就是 $y = x^{2} - x - 6$ 的图象与 $x$ 轴相交的地方：

{{figure 0}}

像这样含有 $x^{2}$ 项、且没有更高次幂的方程叫做**一元二次方程**。这节课我们学习识别一元二次方程，把它写成一般形式，并检验一个数是不是它的解。后面的课再学习求解。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -5, xMax: 5, yMin: -8, yMax: 8, labelEvery: 2, step: 1 },
      [
        { kind: "curve", f: (x) => x * x - x - 6, accent: true },
        { kind: "point", at: [-2, 0], label: "(−2, 0)", dir: "nw", tone: "result" },
        { kind: "point", at: [3, 0], label: "(3, 0)", dir: "ne", tone: "result" },
      ],
      "The U-shaped graph of y = x² − x − 6 crosses the x-axis at (−2, 0) and (3, 0): the two solutions of x² − x − 6 = 0.",
      "y = x² − x − 6 的 U 形图象与 x 轴交于 (−2, 0) 和 (3, 0)：这就是 x² − x − 6 = 0 的两个解。",
    ),
  ],
  knowledgePoints: [
    {
      id: "identifying",
      title: t("Recognizing quadratic equations", "识别一元二次方程"),
      explanation: t(
        `A **quadratic equation** is one that can be written in the **standard form**

$$ax^{2} + bx + c = 0 \\qquad a \\ne 0$$

The condition $a \\ne 0$ is what makes it quadratic: without the $x^{2}$ term the equation is linear. So we cannot judge an equation by a glance at its terms; we first expand any products and move every term to one side, and only then look at the highest power of $x$.

For $2x(x - 3) = 5$: expanding gives $2x^{2} - 6x = 5$, and moving $5$ gives $2x^{2} - 6x - 5 = 0$. The highest power is $2$ and $a = 2$, so it is quadratic. For $x^{2} + 3x = x^{2} - 5$: subtracting $x^{2}$ from both sides leaves $3x + 5 = 0$, a linear equation. An equation with an $x^{3}$ term is not quadratic either.

> **Watch out.** Seeing $x^{2}$ in an equation is not enough. When $x^{2}$ appears on both sides with the same coefficient, it cancels, and the equation is linear. Rearrange first, then decide.`,
        `**一元二次方程**是可以写成**一般形式**

$$ax^{2} + bx + c = 0 \\qquad a \\ne 0$$

的方程。条件 $a \\ne 0$ 正是它成为二次方程的原因：没有 $x^{2}$ 项，方程就是一次方程。所以不能只看一眼各项就下结论；要先展开乘积、把所有项移到一边，然后再看 $x$ 的最高次幂。

对 $2x(x - 3) = 5$：展开得 $2x^{2} - 6x = 5$，移项得 $2x^{2} - 6x - 5 = 0$。最高次幂是 $2$，且 $a = 2$，所以是一元二次方程。对 $x^{2} + 3x = x^{2} - 5$：两边减去 $x^{2}$，剩下 $3x + 5 = 0$，是一元一次方程。含 $x^{3}$ 项的方程也不是一元二次方程。

> **注意。** 方程里出现 $x^{2}$ 还不够。如果两边都有系数相同的 $x^{2}$，它们会相互抵消，方程就成了一次方程。先整理，再判断。`,
      ),
      generate(rng) {
        const kind = rng.pick(["standard", "product", "linear", "cancel", "cubic"] as const);
        const a = rng.nonZero(-6, 6);
        const b = rng.int(-9, 9);
        const c = rng.nonZero(-12, 12);
        const n = rng.nonZero(-9, 9);
        let eq: string;
        let work: Text;
        let why: Text;
        const moveC =
          c < 0
            ? t(`Adding $${-c}$ to both sides`, `两边同时加上 $${-c}$`)
            : t(`Subtracting $${c}$ from both sides`, `两边同时减去 $${c}$`);
        switch (kind) {
          case "standard":
            eq = `${quad(a, b, 0)} = ${c}`;
            work = t(
              `**Step 1: Move every term to the left.** ${moveC.en} gives${steps(`${quad(a, b, -c)} = 0`)}`,
              `**第一步：把所有项移到左边。** ${moveC["zh-CN"]}，得${steps(`${quad(a, b, -c)} = 0`)}`,
            );
            why = t(
              `**Step 2: Look at the highest power.** It is $x^{2}$, with $a = ${a} \\ne 0$, so the equation is quadratic.`,
              `**第二步：看最高次幂。** 最高次是 $x^{2}$，且 $a = ${a} \\ne 0$，所以是一元二次方程。`,
            );
            break;
          case "product":
            eq = `${front(a)}x${lf(1, n)} = ${c}`;
            work = t(
              `**Step 1: Expand and move every term to the left.** Distributing $${poly([a, "x"])}$ and ${c < 0 ? `adding $${-c}$` : `subtracting $${c}$`} gives${steps(`${quad(a, a * n, 0)} = ${c}`, `${quad(a, a * n, -c)} = 0`)}`,
              `**第一步：展开并把所有项移到左边。** 用 $${poly([a, "x"])}$ 去乘括号内各项，再两边${c < 0 ? `加上 $${-c}$` : `减去 $${c}$`}，得${steps(`${quad(a, a * n, 0)} = ${c}`, `${quad(a, a * n, -c)} = 0`)}`,
            );
            why = t(
              `**Step 2: Look at the highest power.** It is $x^{2}$, with $a = ${a} \\ne 0$, so the equation is quadratic.`,
              `**第二步：看最高次幂。** 最高次是 $x^{2}$，且 $a = ${a} \\ne 0$，所以是一元二次方程。`,
            );
            break;
          case "linear":
            eq = `${linear(a, b)} = ${c}`;
            work = t(
              `**Step 1: Move every term to the left.** ${moveC.en} gives${steps(`${linear(a, b - c)} = 0`)}`,
              `**第一步：把所有项移到左边。** ${moveC["zh-CN"]}，得${steps(`${linear(a, b - c)} = 0`)}`,
            );
            why = t(
              "**Step 2: Look at the highest power.** It is $x$ to the first power; there is no $x^{2}$ term, so the equation is linear, not quadratic.",
              "**第二步：看最高次幂。** 最高次是 $x$ 的一次幂，没有 $x^{2}$ 项，所以这是一元一次方程，不是一元二次方程。",
            );
            break;
          case "cancel":
            eq = `${quad(1, n, 0)} = ${quad(1, 0, c)}`;
            work = t(
              `**Step 1: Move every term to the left.** Subtracting $x^{2}$ from both sides and ${c < 0 ? `adding $${-c}$` : `subtracting $${c}$`} gives${steps(`${linear(n, -c)} = 0`)}`,
              `**第一步：把所有项移到左边。** 两边同时减去 $x^{2}$，再${c < 0 ? `加上 $${-c}$` : `减去 $${c}$`}，得${steps(`${linear(n, -c)} = 0`)}`,
            );
            why = t(
              "**Step 2: Look at the highest power.** The $x^{2}$ terms cancelled, and only $x$ to the first power is left, so the equation is linear, not quadratic.",
              "**第二步：看最高次幂。** $x^{2}$ 项相互抵消了，只剩 $x$ 的一次幂，所以这是一元一次方程，不是一元二次方程。",
            );
            break;
          case "cubic":
            eq = `${poly([a, "x^{3}"], [b, "x"])} = ${c}`;
            work = t(
              `**Step 1: Move every term to the left.** ${moveC.en} gives${steps(`${poly([a, "x^{3}"], [b, "x"], [-c, ""])} = 0`)}`,
              `**第一步：把所有项移到左边。** ${moveC["zh-CN"]}，得${steps(`${poly([a, "x^{3}"], [b, "x"], [-c, ""])} = 0`)}`,
            );
            why = t(
              "**Step 2: Look at the highest power.** It is $x^{3}$, not $x^{2}$, so the equation is not quadratic.",
              "**第二步：看最高次幂。** 最高次是 $x^{3}$，不是 $x^{2}$，所以不是一元二次方程。",
            );
            break;
        }
        const yes = kind === "standard" || kind === "product";
        return choiceProblem({
          prompt: t(`Is $${eq}$ a quadratic equation?`, `$${eq}$ 是一元二次方程吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: t(`${work.en}${why.en}`, `${work["zh-CN"]}${why["zh-CN"]}`),
        });
      },
    },
    {
      id: "standard-form",
      title: t("Writing a quadratic equation in standard form", "化为一般形式"),
      explanation: t(
        `To read off $a$, $b$ and $c$, the equation must look exactly like $ax^{2} + bx + c = 0$: zero on the right, and one term of each power on the left. Subtracting a term from both sides keeps the equation true, so we can move every term on the right to the left, where it appears with the **opposite sign**. Then we combine like terms.

For $3x^{2} - 5 = 2x(x - 1) + 4$, first expand the right side to $2x^{2} - 2x + 4$. Subtracting $2x^{2}$, adding $2x$ and subtracting $4$ on both sides gives

$$3x^{2} - 2x^{2} + 2x - 5 - 4 = 0 \\quad\\Rightarrow\\quad x^{2} + 2x - 9 = 0$$

So $a = 1$, $b = 2$ and $c = -9$. A power that does not appear has coefficient $0$.

> **Watch out.** A term changes sign when it crosses to the other side. Adding the right side's coefficients to the left side's, instead of subtracting them, is the usual slip; so is copying a coefficient from the left side without combining it.`,
        `要读出 $a$、$b$、$c$，方程必须恰好是 $ax^{2} + bx + c = 0$ 的样子：右边是零，左边每个次幂各一项。两边同时减去同一项，等式仍然成立，所以可以把右边的每一项移到左边，移过去后它的**符号改变**。然后合并同类项。

对 $3x^{2} - 5 = 2x(x - 1) + 4$，先把右边展开成 $2x^{2} - 2x + 4$。两边同时减去 $2x^{2}$、加上 $2x$、减去 $4$，得

$$3x^{2} - 2x^{2} + 2x - 5 - 4 = 0 \\quad\\Rightarrow\\quad x^{2} + 2x - 9 = 0$$

所以 $a = 1$，$b = 2$，$c = -9$。没有出现的次幂，系数为 $0$。

> **注意。** 一项移到另一边要变号。把右边的系数加到左边的系数上（而不是减去），是常见的错误；直接照抄左边的系数而不合并，也是常见的错误。`,
      ),
      generate(rng) {
        let p: number;
        let q: number;
        let r: number;
        let ra: number;
        let rb: number;
        let rc: number;
        let right: string;
        let expanded: string | undefined;
        const kind = rng.pick(["linear", "quadratic", "product"] as const);
        do {
          p = rng.nonZero(-6, 6);
          q = rng.int(-9, 9);
          r = rng.int(-12, 12);
          if (kind === "linear") {
            ra = 0;
            rb = rng.nonZero(-9, 9);
            rc = rng.int(-12, 12);
            right = linear(rb, rc);
          } else if (kind === "quadratic") {
            ra = rng.nonZero(-5, 5);
            rb = rng.bool() ? 0 : rng.nonZero(-9, 9);
            rc = rng.nonZero(-12, 12);
            right = quad(ra, rb, rc);
          } else {
            ra = rng.nonZero(-4, 4);
            const n = rng.nonZero(-6, 6);
            rb = ra * n;
            rc = rng.bool() ? 0 : rng.nonZero(-9, 9);
            right = `${front(ra)}x${lf(1, n)}${tail(rc)}`;
            expanded = quad(ra, rb, rc);
          }
        } while (p === ra || (q === rb && r === rc));
        const a = p - ra;
        const b = q - rb;
        const c = r - rc;
        const target = rng.pick(["a", "b", "b", "c", "c"] as const);
        const answer = { a, b, c }[target];
        const wrongSum = { a: p + ra, b: q + rb, c: r + rc }[target];
        const original = { a: p, b: q, c: r }[target];
        const left = quad(p, q, r);
        const moved = `${quad(p, q, r)}${[
          [-ra, "x^{2}"],
          [-rb, "x"],
          [-rc, ""],
        ]
          .filter(([k]) => k !== 0)
          .map(([k, v]) => `${(k as number) < 0 ? " - " : " + "}${poly([Math.abs(k as number), v as string])}`)
          .join("")} = 0`;
        const combined = `${quad(a, b, c)} = 0`;
        const combine = moved === combined ? [moved] : [moved, combined];
        const l1 = p + q + r;
        const r1 = ra + rb + rc;
        const sum = signed([Q.of(a), Q.of(b), Q.of(c)]);
        const abc = sum === String(a + b + c) ? sum : `${sum} = ${a + b + c}`;
        return numberProblem({
          prompt: t(
            `Write $${left} = ${right}$ in the form $ax^{2} + bx + c = 0$ by moving every term to the left side. What is $${target}$?`,
            `把所有项移到左边，将 $${left} = ${right}$ 写成 $ax^{2} + bx + c = 0$ 的形式。$${target}$ 是多少？`,
          ),
          answer,
          wrong: [wrongSum, -answer, original],
          solution: t(
            `${expanded ? `**Step 1: Expand the right side.**${steps(`${left} = ${expanded}`)}` : ""}**Step ${expanded ? 2 : 1}: Move every term of the right side to the left, then combine like terms.** Each term changes sign as it crosses:${steps(...combine)}So $a = ${a}$, $b = ${b}$ and $c = ${c}$; the one asked for is $${target} = ${answer}$.\n\n**Check.** At $x = 1$ the left side minus the right side of the original equation is $${l1} - ${r1 < 0 ? `(${r1})` : r1} = ${l1 - r1}$, and $a + b + c = ${abc}$ too.`,
            `${expanded ? `**第一步：展开右边。**${steps(`${left} = ${expanded}`)}` : ""}**${expanded ? "第二步" : "第一步"}：把右边的每一项移到左边，再合并同类项。** 每一项移过去都要变号：${steps(...combine)}所以 $a = ${a}$，$b = ${b}$，$c = ${c}$；所求的是 $${target} = ${answer}$。\n\n**检验。** 当 $x = 1$ 时，原方程左边减右边等于 $${l1} - ${r1 < 0 ? `(${r1})` : r1} = ${l1 - r1}$，而 $a + b + c = ${abc}$，两者相等。`,
          ),
        });
      },
    },
    {
      id: "checking-solutions",
      title: t("Checking solutions", "检验解"),
      explanation: t(
        `A **solution** of an equation is a value of $x$ that makes it true. So checking a value needs no solving at all: substitute it for every $x$, evaluate, and see whether the two sides agree. For an equation of the form $\\ldots = 0$, the value must make the left side exactly $0$.

For $x^{2} - 5x + 6 = 0$:

$$x = 3: \\quad 3^{2} - 5(3) + 6 = 9 - 15 + 6 = 0$$

$$x = -3: \\quad (-3)^{2} - 5(-3) + 6 = 9 + 15 + 6 = 30$$

So $3$ is a solution and $-3$ is not.

> **Watch out.** Substitute a negative value inside parentheses. $(-3)^{2} = 9$, but $-3^{2}$ means $-(3^{2}) = -9$; and $-5(-3)$ is $+15$. Dropping the parentheses changes the signs and the verdict.`,
        `方程的**解**是使方程成立的 $x$ 的值。所以检验一个值根本不需要解方程：把它代入每一个 $x$，计算，看两边是否相等。对于形如 $\\ldots = 0$ 的方程，这个值必须使左边恰好等于 $0$。

对 $x^{2} - 5x + 6 = 0$：

$$x = 3: \\quad 3^{2} - 5(3) + 6 = 9 - 15 + 6 = 0$$

$$x = -3: \\quad (-3)^{2} - 5(-3) + 6 = 9 + 15 + 6 = 30$$

所以 $3$ 是解，$-3$ 不是。

> **注意。** 代入负数时要加括号。$(-3)^{2} = 9$，而 $-3^{2}$ 表示 $-(3^{2}) = -9$；$-5(-3)$ 等于 $+15$。漏掉括号会弄错符号，也会弄错结论。`,
      ),
      generate(rng) {
        const [r, s] = drawRoots(rng, 9);
        const k = rng.pick([1, 1, 1, 2, -1]);
        const a = k;
        const b = -k * (r + s);
        const c = k * r * s;
        const eq = `${quad(a, b, c)} = 0`;
        const root = rng.bool() ? r : s;
        const others = [-r, -s, r + s, root + 1, root - 1, 2 * root, 0].filter((v) => v !== r && v !== s);
        const decoys = rng.sample([...new Set(others)], 3);
        const values = [...decoys, root].sort((x, y) => x - y);
        const decoy = decoys[0]!;
        return choiceProblem({
          prompt: t(`Which value of $x$ is a solution of $${eq}$?`, `下列哪个 $x$ 的值是方程 $${eq}$ 的解？`),
          options: values.map((v) => same(`$x = ${v}$`)),
          correct: values.indexOf(root),
          solution: t(
            `A solution must make the left side equal to $0$. Substitute each value, keeping negatives in parentheses.\n\n**The solution.** For $x = ${root}$:${steps(substitution(a, b, c, Q.of(root)))}This is $0$, so $x = ${root}$ solves the equation.\n\n**Check.** The other values do not give $0$; for example, $x = ${decoy}$ gives${steps(substitution(a, b, c, Q.of(decoy)))}`,
            `解必须使左边等于 $0$。逐个代入，负数要加括号。\n\n**解。** 当 $x = ${root}$ 时：${steps(substitution(a, b, c, Q.of(root)))}结果是 $0$，所以 $x = ${root}$ 是方程的解。\n\n**检验。** 其他值代入后都不等于 $0$；例如 $x = ${decoy}$ 得${steps(substitution(a, b, c, Q.of(decoy)))}`,
          ),
        });
      },
    },
  ],
};

/** undoConstant says how to remove a constant c added on the left: subtract it from both sides, or add its opposite when it is negative. */
function undoConstant(c: Coefficient): Text {
  const v = toQ(c);
  return v.sign() < 0
    ? t(`add $${num(v.neg())}$ to both sides`, `两边同时加上 $${num(v.neg())}$`)
    : t(`subtract $${num(v)}$ from both sides`, `两边同时减去 $${num(v)}$`);
}

/** isolatedSquare writes the step that leaves a(base)² alone: undo the constant c, then divide by a, so that base squared equals k. */
function isolatedSquare(a: number, base: string, c: number, k: number): Text {
  const lines = [...(c !== 0 ? [`${front(a)}${base} = ${a * k}`] : []), ...(a !== 1 ? [`${base} = ${k}`] : [])];
  if (lines.length === 0)
    return t(
      `**Step 1: Isolate the square.** It is already alone: $${base} = ${k}$.\n\n`,
      `**第一步：把平方项单独留在一边。** 平方项已经单独在一边：$${base} = ${k}$。\n\n`,
    );
  const how =
    c !== 0 && a !== 1
      ? t(`${undoConstant(c).en}, then divide both sides by $${a}$`, `${undoConstant(c)["zh-CN"]}，再两边同时除以 $${a}$`)
      : c !== 0
        ? undoConstant(c)
        : t(`divide both sides by $${a}$`, `两边同时除以 $${a}$`);
  return t(
    `**Step 1: Isolate the square.** To get the square alone, ${how.en}:${steps(...lines)}`,
    `**第一步：把平方项单独留在一边。** ${how["zh-CN"]}：${steps(...lines)}`,
  );
}

/** squaredRoot writes (±r)² = k for a root r = √k in simplest form, through b²·m when r = b√m. */
function squaredRoot(root: Surd, k: Q): string {
  const sq = `\\left(${pmLatex(Q.zero, root)}\\right)^{2}`;
  if (root.m === 1n) return `${sq} = ${num(k)}`;
  const b2 = root.b.mul(root.b);
  return b2.eq(Q.one) ? `${sq} = ${num(k)}` : `${sq} = ${num(b2)} \\cdot ${root.m} = ${num(k)}`;
}

/** rootsOfK writes ±√k and, when it simplifies, its simplest form: "\pm\sqrt{12} = \pm 2\sqrt{3}". */
function rootsOfK(k: Q, root: Surd): string {
  const raw = `\\pm\\sqrt{${num(k)}}`;
  const simple = pmLatex(Q.zero, root);
  return simple.replace(/\s/g, "") === raw ? raw : `${raw} = ${simple}`;
}

/** atSquare writes a(v + h)² + c evaluated at an integer v: "2(5 - 3)^{2} + 1 = 2(2)^{2} + 1 = 9". */
function atSquare(a: number, h: number, c: number, v: number): string {
  const inner = v + h;
  const second = `${a === 1 ? `${bare(Q.of(inner))}^{2}` : `${front(a)}(${inner})^{2}`}${tail(c)}`;
  if (h === 0) return `${second} = ${a * inner * inner + c}`;
  const first = `${front(a)}(${linear(1, h).replace("x", String(v))})^{2}${tail(c)}`;
  return `${first} = ${second} = ${a * inner * inner + c}`;
}

export const solvingPerfectSquareQuadraticEquations: TopicDef = {
  id: "solving-perfect-square-quadratic-equations",
  title: t("Solving Perfect Square Quadratic Equations", "解完全平方型一元二次方程"),
  summary: t(
    "Solve $x^{2} = k$ and $(x + h)^{2} = k$ by taking square roots, including equations with one or no solutions.",
    "通过开平方解 $x^{2} = k$ 和 $(x + h)^{2} = k$，包括只有一个解或没有解的方程。",
  ),
  prerequisites: ["introduction-to-quadratic-equations", "solving-equations-with-square-roots"],
  encompasses: [{ topic: "solving-equations-with-square-roots", weight: 0.8 }],
  xp: 16,
  standards: ["CCSS.HSA.REI.B.4.B"],
  intro: t(
    `We already solve $x^{2} = 25$ by taking square roots: $x$ is a number whose square is $25$, so $x = 5$ or $x = -5$. That idea does not care what is being squared. In

$$(x - 3)^{2} = 25$$

the quantity $x - 3$ is a number whose square is $25$, so $x - 3 = 5$ or $x - 3 = -5$. Two easy linear equations follow: $x = 8$ or $x = -2$. Check one: $(8 - 3)^{2} = 5^{2} = 25$.

On a graph, the solutions are where the parabola $y = (x - 3)^{2}$ reaches the height $25$; here is the same picture for $(x - 3)^{2} = 4$, with solutions $1$ and $5$, two steps either side of $3$:

{{figure 0}}

This is the first real method for quadratic equations: whenever an equation is a square equal to a number, take square roots. In this lesson we also see why such an equation can have two solutions, one, or none, depending on the sign of that number.`,
    `我们已经会用开平方解 $x^{2} = 25$：$x$ 是平方等于 $25$ 的数，所以 $x = 5$ 或 $x = -5$。这个想法并不在乎被平方的是什么。在

$$(x - 3)^{2} = 25$$

中，$x - 3$ 是一个平方等于 $25$ 的数，所以 $x - 3 = 5$ 或 $x - 3 = -5$。接着解两个简单的一次方程：$x = 8$ 或 $x = -2$。检验一个：$(8 - 3)^{2} = 5^{2} = 25$。

从图象上看，解就是抛物线 $y = (x - 3)^{2}$ 达到某个高度的位置；下图是 $(x - 3)^{2} = 4$ 的情形，解是 $1$ 和 $5$，分别在 $3$ 的两侧、相距 $2$：

{{figure 0}}

这是解一元二次方程的第一个真正的方法：只要方程是“一个平方等于一个数”，就开平方。这节课我们还会看到，根据这个数的符号，这样的方程可能有两个解、一个解或没有解。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -2, xMax: 8, yMin: -2, yMax: 10, labelEvery: 2, step: 1 },
      [
        { kind: "curve", f: (x) => (x - 3) ** 2, accent: true },
        { kind: "line", a: [0, 4], b: [1, 4], tone: "action" },
        { kind: "point", at: [1, 4], label: "(1, 4)", dir: "nw", tone: "result" },
        { kind: "point", at: [5, 4], label: "(5, 4)", dir: "ne", tone: "result" },
        { kind: "point", at: [3, 0], label: "(3, 0)", dir: "s" },
      ],
      "The parabola y = (x − 3)², lowest at (3, 0), meets the horizontal line y = 4 at (1, 4) and (5, 4), two units either side of x = 3.",
      "抛物线 y = (x − 3)² 的最低点是 (3, 0)，它与水平直线 y = 4 交于 (1, 4) 和 (5, 4)，分别在 x = 3 两侧 2 个单位处。",
    ),
  ],
  knowledgePoints: [
    {
      id: "square-equals-a-number",
      title: t("Solving $x^{2} = k$", "解 $x^{2} = k$"),
      explanation: t(
        `If $x^{2} = k$ with $k > 0$, then $x$ is a number whose square is $k$. There are two such numbers, because a negative number squared is positive too: $\\sqrt{k}$ and $-\\sqrt{k}$. We write both at once as $x = \\pm\\sqrt{k}$.

$$x^{2} = 49 \\Rightarrow x = \\pm 7 \\qquad x^{2} = 12 \\Rightarrow x = \\pm\\sqrt{12} = \\pm 2\\sqrt{3}$$

When there are other terms, isolate $x^{2}$ first, undoing the addition before the multiplication: $3x^{2} - 5 = 70$ gives $3x^{2} = 75$, then $x^{2} = 25$, so $x = \\pm 5$. Check: $3(-5)^{2} - 5 = 75 - 5 = 70$.

> **Watch out.** The square root sign $\\sqrt{k}$ means only the positive root, but the equation $x^{2} = k$ has the negative solution as well. Writing only $x = \\sqrt{k}$ loses half the answer.`,
        `如果 $x^{2} = k$ 且 $k > 0$，那么 $x$ 是平方等于 $k$ 的数。这样的数有两个，因为负数的平方也是正数：$\\sqrt{k}$ 和 $-\\sqrt{k}$。合写为 $x = \\pm\\sqrt{k}$。

$$x^{2} = 49 \\Rightarrow x = \\pm 7 \\qquad x^{2} = 12 \\Rightarrow x = \\pm\\sqrt{12} = \\pm 2\\sqrt{3}$$

有其他项时，先把 $x^{2}$ 单独留在一边：先消去加减，再消去乘法。$3x^{2} - 5 = 70$ 得 $3x^{2} = 75$，再得 $x^{2} = 25$，所以 $x = \\pm 5$。检验：$3(-5)^{2} - 5 = 75 - 5 = 70$。

> **注意。** 根号 $\\sqrt{k}$ 只表示正的平方根，但方程 $x^{2} = k$ 还有负数解。只写 $x = \\sqrt{k}$ 就丢了一半的答案。`,
      ),
      generate(rng) {
        const kind = rng.pick(["square", "surd", "isolate", "fraction"] as const);
        let k: Q;
        let eq: string;
        let isolate: Text | undefined;
        let slip: Q | undefined;
        let check: string;
        if (kind === "square") {
          const n = rng.int(1, 15);
          k = Q.of(n * n);
          eq = `x^{2} = ${n * n}`;
          check = squaredRoot(sqrtSurd(k), k);
        } else if (kind === "surd") {
          let m: number;
          do m = rng.int(2, 75);
          while (isSquare(m));
          k = Q.of(m);
          eq = `x^{2} = ${m}`;
          check = squaredRoot(sqrtSurd(k), k);
        } else if (kind === "fraction") {
          let p: number;
          let q: number;
          do {
            p = rng.int(1, 9);
            q = rng.int(2, 7);
          } while (gcd(p, q) !== 1);
          k = Q.of(p * p, q * q);
          eq = `${q * q}x^{2} = ${p * p}`;
          isolate = t(
            `**Step 1: Isolate $x^{2}$.** Divide both sides by $${q * q}$:${steps(`x^{2} = ${num(k)}`)}`,
            `**第一步：把 $x^{2}$ 单独留在一边。** 两边同时除以 $${q * q}$：${steps(`x^{2} = ${num(k)}`)}`,
          );
          check = `${q * q}\\left(\\pm\\frac{${p}}{${q}}\\right)^{2} = ${q * q} \\cdot \\frac{${p * p}}{${q * q}} = ${p * p}`;
        } else {
          const a = rng.int(2, 5);
          const n = rng.int(1, 9);
          const c = rng.nonZero(-20, 20);
          k = Q.of(n * n);
          eq = `${a}x^{2}${tail(c)} = ${a * n * n + c}`;
          isolate = t(
            `**Step 1: Isolate $x^{2}$.** Undo the addition first, then the multiplication: ${undoConstant(c).en}, then divide by $${a}$:${steps(`${a}x^{2} = ${a * n * n}`, `x^{2} = ${n * n}`)}`,
            `**第一步：把 $x^{2}$ 单独留在一边。** 先消去加减，再消去乘法：${undoConstant(c)["zh-CN"]}，再除以 $${a}$：${steps(`${a}x^{2} = ${a * n * n}`, `x^{2} = ${n * n}`)}`,
          );
          slip = Q.of(a * n * n + 2 * c, a);
          check = `${a}(\\pm ${n})^{2}${tail(c)} = ${a} \\cdot ${n * n}${tail(c)} = ${a * n * n + c}`;
        }
        const root = sqrtSurd(k);
        const values = pm(Q.zero, root);
        const label = isolate ? t("**Step 2: Take square roots.** ", "**第二步：开平方。** ") : t("", "");
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          mistakes: [
            whySet(
              [values[0]!],
              "A positive number has two square roots, one positive and one negative. Give both solutions.",
              "正数有两个平方根，一正一负。两个解都要写出。",
            ),
          ],
          wrong: [[num(k), num(k.neg())], ...(slip && slip.sign() > 0 ? [pm(Q.zero, sqrtSurd(slip))] : [])],
          solution: t(
            `${isolate?.en ?? ""}${label.en}$x$ is a number whose square is $${num(k)}$. There are two, one positive and one negative:${steps(`x = ${rootsOfK(k, root)}`)}So ${solved(values).en}.\n\n**Check.** Squaring removes the sign, so both work:${steps(check)}`,
            `${isolate?.["zh-CN"] ?? ""}${label["zh-CN"]}$x$ 是平方等于 $${num(k)}$ 的数。这样的数有两个，一正一负：${steps(`x = ${rootsOfK(k, root)}`)}所以 ${solved(values)["zh-CN"]}。\n\n**检验。** 平方会消去符号，所以两个解都成立：${steps(check)}`,
          ),
        });
      },
    },
    {
      id: "square-of-a-binomial",
      title: t("Solving $(x + h)^{2} = k$", "解 $(x + h)^{2} = k$"),
      explanation: t(
        `When a whole binomial is squared, treat it as one quantity. If $(x - 3)^{2} = 25$, then $x - 3$ is a number whose square is $25$, so $x - 3 = 5$ or $x - 3 = -5$. Each is a linear equation:

$$x - 3 = \\pm 5 \\Rightarrow x = 3 \\pm 5, \\text{ so } x = 8 \\text{ or } x = -2$$

When $k$ is not a perfect square, keep the root exact and simplified: $(x + 1)^{2} = 8$ gives $x + 1 = \\pm 2\\sqrt{2}$, so $x = -1 \\pm 2\\sqrt{2}$. If the square has a coefficient or a constant beside it, isolate the square first: $2(x + 1)^{2} - 3 = 13$ gives $2(x + 1)^{2} = 16$, then $(x + 1)^{2} = 8$.

> **Watch out.** To undo $x + 1$, subtract $1$; to undo $x - 3$, add $3$. The solutions of $(x - 3)^{2} = 25$ sit around $+3$, not $-3$: moving the number across without changing its sign is the commonest slip here.`,
        `整个二项式被平方时，把它看成一个整体。如果 $(x - 3)^{2} = 25$，那么 $x - 3$ 是平方等于 $25$ 的数，所以 $x - 3 = 5$ 或 $x - 3 = -5$。每个都是一次方程：

$$x - 3 = \\pm 5 \\Rightarrow x = 3 \\pm 5, \\text{ 即 } x = 8 \\text{ 或 } x = -2$$

当 $k$ 不是完全平方数时，根式要保持精确并化为最简：$(x + 1)^{2} = 8$ 得 $x + 1 = \\pm 2\\sqrt{2}$，所以 $x = -1 \\pm 2\\sqrt{2}$。如果平方项旁边还有系数或常数，先把平方项单独留在一边：$2(x + 1)^{2} - 3 = 13$ 得 $2(x + 1)^{2} = 16$，再得 $(x + 1)^{2} = 8$。

> **注意。** 要消去 $x + 1$ 中的 $+1$，就减去 $1$；要消去 $x - 3$ 中的 $-3$，就加上 $3$。$(x - 3)^{2} = 25$ 的解在 $+3$ 两侧，而不是 $-3$ 两侧：把数移过去却不变号，是这里最常见的错误。`,
      ),
      generate(rng) {
        const h = rng.nonZero(-9, 9);
        let k: number;
        if (rng.bool(0.5)) k = rng.int(1, 10) ** 2;
        else {
          do k = rng.int(2, 50);
          while (isSquare(k));
        }
        const withCoef = rng.bool(0.35);
        const a = withCoef ? rng.int(2, 4) : 1;
        const c = withCoef ? rng.nonZero(-15, 15) : 0;
        const sq = `(${linear(1, h)})^{2}`;
        const eq = `${front(a)}${sq}${tail(c)} = ${a * k + c}`;
        const root = sqrtSurd(Q.of(k));
        const values = pm(Q.of(-h), root);
        const n = withCoef ? 2 : 1;
        const label = (i: number) => t(`**Step ${i}: `, `**第${["一", "二", "三"][i - 1]}步：`);
        const rootText = isSquare(k) ? `\\pm ${Math.sqrt(k)}` : rootsOfK(Q.of(k), root);
        const check = isSquare(k)
          ? t(
              `**Check.** Substitute each solution into the original equation:${steps(...values.map((v) => `x = ${v}: \\quad ${atSquare(a, h, c, Number(v))}`))}Both give $${a * k + c}$, the right side.`,
              `**检验。** 把每个解代回原方程：${steps(...values.map((v) => `x = ${v}: \\quad ${atSquare(a, h, c, Number(v))}`))}结果都是右边的 $${a * k + c}$。`,
            )
          : t(
              `**Check.** For each solution, $${linear(1, h)}$ is $${pmLatex(Q.zero, root)}$, and squaring removes the sign:${steps(squaredRoot(root, Q.of(k)))}So $${sq} = ${k}$ holds for both${withCoef ? `, and then $${front(a)}${sq}${tail(c)} = ${a} \\cdot ${k}${tail(c)} = ${a * k + c}$` : ""}.`,
              `**检验。** 对每个解，$${linear(1, h)}$ 都等于 $${pmLatex(Q.zero, root)}$，平方后符号消失：${steps(squaredRoot(root, Q.of(k)))}所以两个解都满足 $${sq} = ${k}$${withCoef ? `，于是 $${front(a)}${sq}${tail(c)} = ${a} \\cdot ${k}${tail(c)} = ${a * k + c}$` : ""}。`,
            );
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          mistakes: [
            whySet(
              pm(Q.of(h), root),
              "Check the sign of the number you moved across: undo the addition inside the square by subtracting it.",
              "注意移过去的数的符号：平方内加了几，就要减去几。",
            ),
            whySet(
              [values[0]!],
              "A square root gives two cases, one positive and one negative. Give both solutions.",
              "开平方有正负两种情况，两个解都要写出。",
            ),
          ],
          wrong: [pm(Q.of(-h), surd(Q.of(k)))],
          solution: t(
            `${withCoef ? isolatedSquare(a, sq, c, k).en : ""}${label(n).en}Take square roots.** $${linear(1, h)}$ is a number whose square is $${k}$, so it is the positive or the negative root:${steps(`${linear(1, h)} = ${rootText}`)}${label(n + 1).en}Solve for $x$.** ${undoConstant(h).en.replace(/^./, (s) => s.toUpperCase())}:${steps(`x = ${pmLatex(Q.of(-h), root)}`)}So ${solved(values).en}.\n\n${check.en}`,
            `${withCoef ? isolatedSquare(a, sq, c, k)["zh-CN"] : ""}${label(n)["zh-CN"]}开平方。** $${linear(1, h)}$ 是平方等于 $${k}$ 的数，所以它等于正的或负的平方根：${steps(`${linear(1, h)} = ${rootText}`)}${label(n + 1)["zh-CN"]}解出 $x$。** ${undoConstant(h)["zh-CN"]}：${steps(`x = ${pmLatex(Q.of(-h), root)}`)}所以 ${solved(values)["zh-CN"]}。\n\n${check["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "number-of-solutions",
      title: t("How many solutions?", "有几个解？"),
      explanation: t(
        `A square is never negative: $(x + h)^{2} \\ge 0$ for every $x$. So once the square is isolated, the sign of the number on the other side decides everything. For $(x + h)^{2} = k$:

- $k > 0$: the quantity $x + h$ can be $\\sqrt{k}$ or $-\\sqrt{k}$, so there are **two** solutions;
- $k = 0$: only $0$ squares to $0$, so $x + h = 0$ and there is **one** solution, $x = -h$;
- $k < 0$: no real number squares to a negative number, so there is **no** real solution.

For example, $-2(x + 1)^{2} + 3 = 11$ gives $-2(x + 1)^{2} = 8$ and then $(x + 1)^{2} = -4$: no solution.

> **Watch out.** Judge the sign only **after** isolating the square. In $-2(x + 1)^{2} + 3 = 11$ the right side $11$ is positive, but dividing by $-2$ makes it $-4$. Reading the sign off the original right side gives the wrong count.`,
        `平方不可能是负数：对每个 $x$ 都有 $(x + h)^{2} \\ge 0$。所以把平方项单独留在一边后，另一边那个数的符号决定了一切。对 $(x + h)^{2} = k$：

- $k > 0$：$x + h$ 可以等于 $\\sqrt{k}$ 或 $-\\sqrt{k}$，所以有**两个**解；
- $k = 0$：只有 $0$ 的平方是 $0$，所以 $x + h = 0$，只有**一个**解 $x = -h$；
- $k < 0$：没有实数的平方是负数，所以**没有**实数解。

例如，$-2(x + 1)^{2} + 3 = 11$ 得 $-2(x + 1)^{2} = 8$，再得 $(x + 1)^{2} = -4$：无解。

> **注意。** 要在**把平方项单独留在一边之后**再看符号。$-2(x + 1)^{2} + 3 = 11$ 的右边 $11$ 是正数，但除以 $-2$ 后就变成了 $-4$。直接看原方程右边的符号，会数错解的个数。`,
      ),
      generate(rng) {
        const kind = rng.pick(["two", "one", "none"] as const);
        const h = rng.int(-9, 9);
        const k = kind === "two" ? rng.int(1, 30) : kind === "one" ? 0 : -rng.int(1, 30);
        const a = rng.pick([1, 1, 2, 3, -1, -2, -3]);
        const c = rng.bool(0.6) ? rng.nonZero(-15, 15) : 0;
        const base = h === 0 ? "x^{2}" : `(${linear(1, h)})^{2}`;
        const inner = h === 0 ? "x" : linear(1, h);
        const eq = `${front(a)}${base}${tail(c)} = ${a * k + c}`;
        const options = [t("No real solution", "没有实数解"), t("Exactly one solution", "恰有一个解"), t("Two solutions", "两个解")];
        const correct = kind === "none" ? 0 : kind === "one" ? 1 : 2;
        const values = k < 0 ? [] : pm(Q.of(-h), sqrtSurd(Q.of(k)));
        const decide =
          k > 0
            ? t(
                `**Step 2: Read the sign.** $${k}$ is positive, and a positive number has two square roots, so $${inner} = \\pm\\sqrt{${k}}$: two solutions.`,
                `**第二步：看符号。** $${k}$ 是正数，正数有两个平方根，所以 $${inner} = \\pm\\sqrt{${k}}$：两个解。`,
              )
            : k === 0
              ? t(
                  `**Step 2: Read the sign.** The square equals $0$, and only $0$ squares to $0$, so $${inner} = 0$: exactly one solution, $x = ${-h}$.`,
                  `**第二步：看符号。** 平方等于 $0$，而只有 $0$ 的平方是 $0$，所以 $${inner} = 0$：恰有一个解 $x = ${-h}$。`,
                )
              : t(
                  `**Step 2: Read the sign.** $${k}$ is negative, and no real number squared is negative, so there is no real solution.`,
                  `**第二步：看符号。** $${k}$ 是负数，而实数的平方不可能是负数，所以没有实数解。`,
                );
        const check =
          k > 0
            ? t(
                `**Check.** The two solutions are ${solved(values).en}; at each, $${inner}$ is $\\pm\\sqrt{${k}}$, whose square is $${k}$.`,
                `**检验。** 两个解是 ${solved(values)["zh-CN"]}；在每个解处 $${inner}$ 等于 $\\pm\\sqrt{${k}}$，其平方是 $${k}$。`,
              )
            : k === 0
              ? t(
                  `**Check.** At $x = ${-h}$ the square is $0$, so the left side is ${c === 0 ? "$0$" : `$${c}$`}, equal to the right side.`,
                  `**检验。** 当 $x = ${-h}$ 时平方为 $0$，左边等于 ${c === 0 ? "$0$" : `$${c}$`}，与右边相等。`,
                )
              : t(
                  `**Check.** Since $${base} \\ge 0$, the left side is always ${a > 0 ? "at least" : "at most"} $${c}$, so it can never equal $${a * k + c}$.`,
                  `**检验。** 因为 $${base} \\ge 0$，左边总是${a > 0 ? "不小于" : "不大于"} $${c}$，所以它不可能等于 $${a * k + c}$。`,
                );
        return choiceProblem({
          prompt: t(`How many real solutions does $${eq}$ have?`, `方程 $${eq}$ 有几个实数解？`),
          options,
          correct,
          solution: t(
            `${isolatedSquare(a, base, c, k).en}${decide.en}\n\n${check.en}`,
            `${isolatedSquare(a, base, c, k)["zh-CN"]}${decide["zh-CN"]}\n\n${check["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "one-or-no-solutions",
      title: t("Equations with one or no solutions", "只有一个解或没有解的方程"),
      explanation: t(
        `Solve exactly as before, but look at the number the square equals **before** taking square roots, because that number decides how many roots there are. A square equal to $0$ means the quantity inside is $0$; a square equal to a negative number is impossible, and we write the empty set $\\varnothing$.

$$3(x - 2)^{2} + 7 = 7 \\Rightarrow 3(x - 2)^{2} = 0 \\Rightarrow (x - 2)^{2} = 0 \\Rightarrow x - 2 = 0 \\Rightarrow x = 2$$

$$x^{2} + 9 = 0 \\Rightarrow x^{2} = -9 \\Rightarrow \\varnothing$$

> **Watch out.** $\\pm 0$ is just $0$, so a square equal to $0$ gives **one** solution, not two. And $x^{2} = -9$ does not give $x = \\pm 3$: $3^{2}$ and $(-3)^{2}$ are both $+9$. Taking the root of $9$ and ignoring the sign invents solutions.`,
        `照常求解，但要在开平方**之前**看平方项等于的数，因为这个数决定了有几个根。平方等于 $0$，说明括号里的式子等于 $0$；平方等于负数是不可能的，这时写空集 $\\varnothing$。

$$3(x - 2)^{2} + 7 = 7 \\Rightarrow 3(x - 2)^{2} = 0 \\Rightarrow (x - 2)^{2} = 0 \\Rightarrow x - 2 = 0 \\Rightarrow x = 2$$

$$x^{2} + 9 = 0 \\Rightarrow x^{2} = -9 \\Rightarrow \\varnothing$$

> **注意。** $\\pm 0$ 就是 $0$，所以平方等于 $0$ 只给出**一个**解，而不是两个。$x^{2} = -9$ 也不会得到 $x = \\pm 3$：$3^{2}$ 和 $(-3)^{2}$ 都是 $+9$。对 $9$ 开平方而不管符号，就凭空造出了解。`,
      ),
      generate(rng) {
        const kind = rng.pick(["one", "one", "none", "none", "two"] as const);
        const h = rng.int(-9, 9);
        const k = kind === "two" ? rng.int(1, 8) ** 2 : kind === "one" ? 0 : -rng.int(1, 30);
        const a = rng.pick([1, 1, 2, 3, -1, -2]);
        const c = rng.bool(0.6) ? rng.nonZero(-12, 12) : 0;
        const base = h === 0 ? "x^{2}" : `(${linear(1, h)})^{2}`;
        const inner = h === 0 ? "x" : linear(1, h);
        const eq = `${front(a)}${base}${tail(c)} = ${a * k + c}`;
        const values = k < 0 ? [] : pm(Q.of(-h), sqrtSurd(Q.of(k)));
        const wrong: string[][] =
          k < 0
            ? [pm(Q.of(-h), sqrtSurd(Q.of(-k))), [num(-h)]]
            : k === 0
              ? [[num(h)], ...(h === 0 ? [] : [[num(-h), num(h)]]), []]
              : [[], [values[0]!]];
        const solve =
          k < 0
            ? t(
                `**Step 2: Read the sign.** A square cannot be negative, so no real $x$ makes $${base} = ${k}$. There is no real solution: $\\varnothing$.`,
                `**第二步：看符号。** 平方不可能是负数，所以没有实数 $x$ 使 $${base} = ${k}$。没有实数解：$\\varnothing$。`,
              )
            : k === 0
              ? t(
                  `**Step 2: Take the square root.** Only $0$ squares to $0$, so${steps(`${inner} = 0`, ...(h === 0 ? [] : [`x = ${-h}`]))}There is exactly one solution, $x = ${-h}$.`,
                  `**第二步：开平方。** 只有 $0$ 的平方是 $0$，所以${steps(`${inner} = 0`, ...(h === 0 ? [] : [`x = ${-h}`]))}恰有一个解 $x = ${-h}$。`,
                )
              : t(
                  `**Step 2: Take square roots.** $${k}$ is positive, so${steps(`${inner} = \\pm ${Math.sqrt(k)}`, ...(h === 0 ? [] : [`x = ${pmLatex(Q.of(-h), sqrtSurd(Q.of(k)))}`]))}So ${solved(values).en}.`,
                  `**第二步：开平方。** $${k}$ 是正数，所以${steps(`${inner} = \\pm ${Math.sqrt(k)}`, ...(h === 0 ? [] : [`x = ${pmLatex(Q.of(-h), sqrtSurd(Q.of(k)))}`]))}所以 ${solved(values)["zh-CN"]}。`,
                );
        const check =
          k < 0
            ? t(
                `**Check.** Since $${base} \\ge 0$, the left side is always ${a > 0 ? "at least" : "at most"} $${c}$, so it never reaches $${a * k + c}$.`,
                `**检验。** 因为 $${base} \\ge 0$，左边总是${a > 0 ? "不小于" : "不大于"} $${c}$，永远达不到 $${a * k + c}$。`,
              )
            : t(
                `**Check.** Substitute into the original equation:${steps(...values.map((v) => `x = ${v}: \\quad ${atSquare(a, h, c, Number(v))}`))}This is the right side, $${a * k + c}$.`,
                `**检验。** 代回原方程：${steps(...values.map((v) => `x = ${v}: \\quad ${atSquare(a, h, c, Number(v))}`))}结果等于右边的 $${a * k + c}$。`,
              );
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong,
          solution: t(
            `${isolatedSquare(a, base, c, k).en}${solve.en}\n\n${check.en}`,
            `${isolatedSquare(a, base, c, k)["zh-CN"]}${solve["zh-CN"]}\n\n${check["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

/** linearAt writes px + q with x replaced by a value: "2(-5) + 3", "-5 - 3". */
function linearAt(p: number, q: number, x: Q): string {
  const sub = p === 1 ? num(x) : p === -1 ? bare(x) : inside(x);
  return linear(p, q).replace("x", sub);
}

/** Factor is a linear factor px + q of a product, squared when twice is set. */
interface Factor {
  readonly p: number;
  readonly q: number;
  readonly twice?: boolean;
}

/** factoredAt writes k·(p₁x + q₁)(p₂x + q₂)… at x, then with each factor's value, then the product: "(3 - 3)(3 + 5) = (0)(8) = 0". */
function factoredAt(k: number, factors: readonly Factor[], x: Q): string {
  const power = (f: Factor) => (f.twice ? "^{2}" : "");
  const [open, close] = x.isInteger() ? ["(", ")"] : ["\\left(", "\\right)"];
  const shown = `${front(k)}${factors.map((f) => `${open}${f.p === 1 && f.q === 0 ? num(x) : linearAt(f.p, f.q, x)}${close}${power(f)}`).join("")}`;
  const values = `${front(k)}${factors.map((f) => `${open}${num(x.mul(Q.of(f.p)).add(Q.of(f.q)))}${close}${power(f)}`).join("")}`;
  return shown === values ? `${shown} = 0` : `${shown} = ${values} = 0`;
}

/** factoredCheck puts each solution back into the factored equation, showing the factor it makes zero. */
function factoredCheck(k: number, factors: readonly Factor[], roots: readonly Q[], v = "x"): Text {
  const lines = roots.map((r) => `${v} = ${num(r)}: \\quad ${factoredAt(k, factors, r)}`);
  return t(
    `**Check.** Put each solution back into the factored equation; each makes one factor $0$:${steps(...lines)}`,
    `**检验。** 把每个解代回分解后的方程，每个解都使某个因式为 $0$：${steps(...lines)}`,
  );
}

/** factorZero writes the solving of one linear factor px + q = 0: "2x - 7 = 0 \Rightarrow 2x = 7 \Rightarrow x = \frac{7}{2}". */
function factorZero(p: number, q: number, v = "x"): string {
  const root = num(Q.of(-q, p));
  if (q === 0) return p === 1 ? `${v} = 0` : `${poly([p, v])} = 0 \\Rightarrow ${v} = 0`;
  if (p === 1) return `${linear(1, q, v)} = 0 \\Rightarrow ${v} = ${root}`;
  return `${linear(p, q, v)} = 0 \\Rightarrow ${poly([p, v])} = ${-q} \\Rightarrow ${v} = ${root}`;
}

export const zeroProductRule: TopicDef = {
  id: "zero-product-rule",
  title: t("The Zero Product Rule for Solving Quadratic Equations", "用零积法则解一元二次方程"),
  summary: t(
    "Solve equations of the form $(x - r)(x - s) = 0$: a product is zero only when a factor is zero.",
    "解形如 $(x - r)(x - s) = 0$ 的方程：乘积为零当且仅当某个因式为零。",
  ),
  prerequisites: ["introduction-to-quadratic-equations"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSA.REI.B.4.B"],
  intro: t(
    `We met $x^{2} - x - 6 = 0$, whose solutions $3$ and $-2$ we found by trying values. There is a way to see them at once. Multiplying out shows that $(x - 3)(x + 2) = x^{2} - x - 6$, so the equation is

$$(x - 3)(x + 2) = 0$$

Now think about products of numbers. If neither of two numbers is $0$, their product is not $0$ either: $5 \\cdot 7$, $(-2) \\cdot 4$ and $\\frac{1}{2} \\cdot 6$ are all nonzero. So the only way for a product to be $0$ is for one of its factors to be $0$. Here that means $x - 3 = 0$, giving $x = 3$, or $x + 2 = 0$, giving $x = -2$: exactly the two solutions.

This is the **zero product rule**, and it turns one quadratic equation into two linear ones. It needs a $0$ on one side: from $(x - 3)(x + 2) = 6$ we learn nothing about either factor, since many pairs of numbers multiply to $6$. In this lesson we use the rule on products that are already factored; the next lessons do the factoring.`,
    `我们见过 $x^{2} - x - 6 = 0$，它的解 $3$ 和 $-2$ 是试出来的。其实有办法一眼看出它们。展开可知 $(x - 3)(x + 2) = x^{2} - x - 6$，所以方程就是

$$(x - 3)(x + 2) = 0$$

想一想数的乘积。如果两个数都不是 $0$，它们的积也不是 $0$：$5 \\cdot 7$、$(-2) \\cdot 4$、$\\frac{1}{2} \\cdot 6$ 都不为零。所以乘积为 $0$ 的唯一可能是某个因数为 $0$。在这里就是 $x - 3 = 0$，得 $x = 3$；或 $x + 2 = 0$，得 $x = -2$：正好是那两个解。

这就是**零乘积法则**，它把一个一元二次方程变成两个一次方程。它要求一边是 $0$：从 $(x - 3)(x + 2) = 6$ 得不出任何一个因式的值，因为积为 $6$ 的数对有很多。这节课我们对已经分解好的乘积运用这个法则；后面的课再学习如何分解。`,
  ),
  knowledgePoints: [
    {
      id: "two-factors",
      title: t("Two linear factors", "两个一次因式"),
      explanation: t(
        `The **zero product rule**: if $AB = 0$, then $A = 0$ or $B = 0$. It holds because two nonzero numbers always have a nonzero product. So to solve a product of factors equal to $0$, set each factor equal to $0$ and solve the small equations that result.

$$(x - 3)(x + 5) = 0 \\Rightarrow x - 3 = 0 \\text{ or } x + 5 = 0 \\Rightarrow x = 3 \\text{ or } x = -5$$

Each solution is the value that makes its own factor $0$: $x = -5$ makes $x + 5$ zero.

> **Watch out.** The solution has the **opposite** sign of the number in the factor: $x + 5 = 0$ gives $x = -5$, not $5$. And there are two solutions, one from each factor; stopping after the first one loses the other.`,
        `**零乘积法则**：如果 $AB = 0$，那么 $A = 0$ 或 $B = 0$。它成立的原因是两个非零数的积一定不为零。所以解“几个因式的积等于 $0$”时，令每个因式等于 $0$，再解得到的小方程。

$$(x - 3)(x + 5) = 0 \\Rightarrow x - 3 = 0 \\text{ 或 } x + 5 = 0 \\Rightarrow x = 3 \\text{ 或 } x = -5$$

每个解都是使它自己那个因式为 $0$ 的值：$x = -5$ 使 $x + 5$ 为零。

> **注意。** 解与因式中的数**符号相反**：$x + 5 = 0$ 得 $x = -5$，而不是 $5$。而且有两个解，每个因式各给出一个；只求出第一个就停下，会漏掉另一个。`,
      ),
      generate(rng) {
        const [r, s] = drawRoots(rng, 12);
        const eq = `${lf(1, -r)}${lf(1, -s)} = 0`;
        const values = [num(r), num(s)];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [[num(r), num(-s)]],
          mistakes: rootSlips(r, s),
          solution: t(
            `**Step 1: Use the zero product rule.** The product is $0$, so one of the factors is $0$:${steps(`${linear(1, -r)} = 0 \\quad\\text{or}\\quad ${linear(1, -s)} = 0`)}**Step 2: Solve each equation.** Undo the number in each factor:${steps(`x = ${r} \\quad\\text{or}\\quad x = ${s}`)}So ${solved(values).en}.\n\n${
              factoredCheck(
                1,
                [
                  { p: 1, q: -r },
                  { p: 1, q: -s },
                ],
                [Q.of(r), Q.of(s)],
              ).en
            }`,
            `**第一步：运用零乘积法则。** 积为 $0$，所以某个因式为 $0$：${steps(`${linear(1, -r)} = 0 \\quad\\text{或}\\quad ${linear(1, -s)} = 0`)}**第二步：分别求解。** 消去每个因式中的数：${steps(`x = ${r} \\quad\\text{或}\\quad x = ${s}`)}所以 ${solved(values)["zh-CN"]}。\n\n${
              factoredCheck(
                1,
                [
                  { p: 1, q: -r },
                  { p: 1, q: -s },
                ],
                [Q.of(r), Q.of(s)],
              )["zh-CN"]
            }`,
          ),
        });
      },
    },
    {
      id: "factors-with-coefficients",
      title: t("Factors with coefficients", "带系数的因式"),
      explanation: t(
        `The rule does not care what the factors look like. When a factor has a coefficient, setting it to $0$ gives a two-step linear equation, and its solution may be a fraction. A lone factor $x$ is a factor too: it is $0$ when $x = 0$.

$$x(2x - 7) = 0 \\Rightarrow x = 0 \\text{ or } 2x - 7 = 0$$

The second gives $2x = 7$, so $x = \\frac{7}{2}$. Check: $\\frac{7}{2}\\left(2 \\cdot \\frac{7}{2} - 7\\right) = \\frac{7}{2} \\cdot 0 = 0$.

> **Watch out.** From $2x - 7 = 0$ the solution is $\\frac{7}{2}$, not $7$ and not $\\frac{2}{7}$: undo the $-7$ first, then divide by the coefficient $2$. And do not forget the solution $x = 0$ from a lone factor $x$.`,
        `法则并不在乎因式长什么样。因式带系数时，令它为 $0$ 得到一个两步的一次方程，解可能是分数。单独的 $x$ 也是一个因式：当 $x = 0$ 时它为 $0$。

$$x(2x - 7) = 0 \\Rightarrow x = 0 \\text{ 或 } 2x - 7 = 0$$

后者得 $2x = 7$，所以 $x = \\frac{7}{2}$。检验：$\\frac{7}{2}\\left(2 \\cdot \\frac{7}{2} - 7\\right) = \\frac{7}{2} \\cdot 0 = 0$。

> **注意。** 由 $2x - 7 = 0$ 得到的解是 $\\frac{7}{2}$，不是 $7$，也不是 $\\frac{2}{7}$：先消去 $-7$，再除以系数 $2$。也不要忘了单独的因式 $x$ 给出的解 $x = 0$。`,
      ),
      generate(rng) {
        const lone = rng.bool(0.3);
        let p: number;
        let q: number;
        let r: number;
        let s: number;
        do {
          p = rng.int(2, 7);
          q = rng.nonZero(-9, 9);
          r = lone ? 1 : rng.int(1, 5);
          s = lone ? 0 : rng.nonZero(-9, 9);
        } while (gcd(p, q) !== 1 || (!lone && gcd(r, s) !== 1) || Q.of(-q, p).eq(Q.of(-s, r)));
        const eq = lone ? `x${lf(p, q)} = 0` : `${lf(p, q)}${lf(r, s)} = 0`;
        const values = [num(Q.of(-s, r)), num(Q.of(-q, p))];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [
            [num(Q.of(s, r)), num(Q.of(q, p))],
            [num(-s), num(-q)],
            [num(Q.of(-s, r)), num(Q.of(-p, q))],
            ...(lone ? [[num(Q.of(-q, p))]] : []),
          ],
          solution: t(
            `**Step 1: Use the zero product rule.** One of the factors is $0$:${steps(`${lone ? "x" : linear(r, s)} = 0 \\quad\\text{or}\\quad ${linear(p, q)} = 0`)}**Step 2: Solve each linear equation.** Undo the constant, then divide by the coefficient of $x$:${steps(factorZero(r, s), factorZero(p, q))}So ${solved(values).en}.\n\n${
              factoredCheck(
                1,
                [
                  { p: r, q: s },
                  { p, q },
                ],
                [Q.of(-s, r), Q.of(-q, p)],
              ).en
            }`,
            `**第一步：运用零乘积法则。** 某个因式为 $0$：${steps(`${lone ? "x" : linear(r, s)} = 0 \\quad\\text{或}\\quad ${linear(p, q)} = 0`)}**第二步：分别解一次方程。** 先消去常数，再除以 $x$ 的系数：${steps(factorZero(r, s), factorZero(p, q))}所以 ${solved(values)["zh-CN"]}。\n\n${
              factoredCheck(
                1,
                [
                  { p: r, q: s },
                  { p, q },
                ],
                [Q.of(-s, r), Q.of(-q, p)],
              )["zh-CN"]
            }`,
          ),
        });
      },
    },
    {
      id: "more-factors",
      title: t("Constant, repeated and extra factors", "常数因数、重复因式与更多因式"),
      explanation: t(
        `The reasoning behind the rule works for any number of factors: a product is $0$ only if some factor is $0$. So $x(x - 2)(x + 4) = 0$ has three solutions, $0$, $2$ and $-4$, one from each factor.

A nonzero constant factor can never be $0$, so it contributes no solution: $3(x - 1)(x + 6) = 0$ has only the solutions $1$ and $-6$. A repeated factor gives the same solution twice, and a solution is listed once: $(x - 5)^{2} = 0$ means $(x - 5)(x - 5) = 0$, whose only solution is $x = 5$.

> **Watch out.** A constant factor such as $3$ is not a solution, and does not give $x = 0$ either; only a factor containing $x$ can be $0$. But a factor $x$ on its own **does** give $x = 0$, so keep it when it is there.`,
        `法则背后的道理对任意多个因式都成立：乘积为 $0$，只能是某个因式为 $0$。所以 $x(x - 2)(x + 4) = 0$ 有三个解：$0$、$2$ 和 $-4$，每个因式给出一个。

非零的常数因数永远不会是 $0$，所以它不给出解：$3(x - 1)(x + 6) = 0$ 的解只有 $1$ 和 $-6$。重复的因式两次给出同一个解，而同一个解只写一次：$(x - 5)^{2} = 0$ 即 $(x - 5)(x - 5) = 0$，唯一的解是 $x = 5$。

> **注意。** 像 $3$ 这样的常数因数不是解，也不会给出 $x = 0$；只有含 $x$ 的因式才可能为 $0$。但单独的因式 $x$ **确实**给出 $x = 0$，有它时不要漏掉。`,
      ),
      generate(rng) {
        const kind = rng.pick(["x-factor", "constant", "repeated"] as const);
        const [r, s] = drawRoots(rng, 9);
        const k = rng.int(2, 9);
        let eq: string;
        let values: string[];
        let wrong: string[][];
        let factors: Factor[];
        let lead: number;
        if (kind === "x-factor") {
          eq = `${k}x${lf(1, -r)}${lf(1, -s)} = 0`;
          values = ["0", num(r), num(s)];
          wrong = [
            [num(r), num(s)],
            ["0", num(-r), num(-s)],
            [num(k), num(r), num(s)],
          ];
          factors = [
            { p: 1, q: 0 },
            { p: 1, q: -r },
            { p: 1, q: -s },
          ];
          lead = k;
        } else if (kind === "constant") {
          eq = `${k}${lf(1, -r)}${lf(1, -s)} = 0`;
          values = [num(r), num(s)];
          wrong = [
            ["0", num(r), num(s)],
            [num(k), num(r), num(s)],
            [num(-r), num(-s)],
          ];
          factors = [
            { p: 1, q: -r },
            { p: 1, q: -s },
          ];
          lead = k;
        } else {
          const single = rng.bool();
          eq = single ? `(${linear(1, -r)})^{2} = 0` : `(${linear(1, -r)})^{2}${lf(1, -s)} = 0`;
          values = single ? [num(r)] : [num(r), num(s)];
          wrong = [single ? [num(r), num(-r)] : [num(r), num(-r), num(s)], values.map((v) => num(Q.parse(v).neg()))];
          factors = single
            ? [{ p: 1, q: -r, twice: true }]
            : [
                { p: 1, q: -r, twice: true },
                { p: 1, q: -s },
              ];
          lead = 1;
        }
        const zeros = factors.map((f) => factorZero(f.p, f.q));
        const which =
          kind === "constant"
            ? t(
                `The constant factor $${k}$ is never $0$, so only the two factors with $x$ can be.`,
                `常数因数 $${k}$ 永远不为 $0$，所以只有两个含 $x$ 的因式可能为 $0$。`,
              )
            : kind === "x-factor"
              ? t(
                  `The constant $${k}$ is never $0$, but the lone factor $x$ is a factor with $x$, like the other two.`,
                  `常数 $${k}$ 永远不为 $0$，但单独的 $x$ 和另外两个因式一样，是含 $x$ 的因式。`,
                )
              : t(
                  `The square $(${linear(1, -r)})^{2}$ is $(${linear(1, -r)})(${linear(1, -r)})$, the same factor twice, so it gives one solution.`,
                  `平方 $(${linear(1, -r)})^{2}$ 就是 $(${linear(1, -r)})(${linear(1, -r)})$，同一个因式出现两次，只给出一个解。`,
                );
        const roots = values.map((v) => Q.parse(v));
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong,
          solution: t(
            `**Step 1: Decide which factors can be $0$.** ${which.en}\n\n**Step 2: Set each of them equal to $0$.**${steps(...zeros)}So ${solved(values).en}.\n\n${factoredCheck(lead, factors, roots).en}`,
            `**第一步：判断哪些因式可能为 $0$。** ${which["zh-CN"]}\n\n**第二步：令它们分别等于 $0$。**${steps(...zeros)}所以 ${solved(values)["zh-CN"]}。\n\n${factoredCheck(lead, factors, roots)["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

export const solvingQuadraticEquationsUsingADifferenceOfSquares: TopicDef = {
  id: "solving-quadratic-equations-using-a-difference-of-squares",
  title: t("Solving Quadratic Equations Using a Difference of Squares", "用平方差公式解一元二次方程"),
  summary: t(
    "Solve equations such as $x^{2} - 49 = 0$ and $4x^{2} = 9$ by factoring a difference of squares.",
    "通过分解平方差解 $x^{2} - 49 = 0$、$4x^{2} = 9$ 这类方程。",
  ),
  prerequisites: ["zero-product-rule", "factoring-differences-of-squares"],
  encompasses: [
    { topic: "zero-product-rule", weight: 0.5 },
    { topic: "factoring-differences-of-squares", weight: 0.4 },
  ],
  xp: 10,
  standards: ["CCSS.HSA.REI.B.4.B"],
  intro: t(
    `The zero product rule solves an equation once one side is a product and the other side is $0$. We also know how to factor a **difference of squares**: $A^{2} - B^{2} = (A + B)(A - B)$. Put the two together on

$$x^{2} - 49 = 0$$

Since $49 = 7^{2}$, the left side is $x^{2} - 7^{2} = (x + 7)(x - 7)$. So the equation says $(x + 7)(x - 7) = 0$, and one of the factors is $0$: $x = -7$ or $x = 7$.

Taking square roots of $x^{2} = 49$ gives the same pair, $x = \\pm 7$, so the two methods agree. Factoring has an advantage, though: it fits the same pattern as every equation we will solve by factoring, and it handles coefficients such as $9x^{2} - 4 = 0$ just as easily. In this lesson we spot differences of squares, including ones hidden behind a common factor, and solve them this way.`,
    `零乘积法则能解一边是乘积、另一边是 $0$ 的方程。我们也会分解**平方差**：$A^{2} - B^{2} = (A + B)(A - B)$。把两者结合起来解

$$x^{2} - 49 = 0$$

因为 $49 = 7^{2}$，左边是 $x^{2} - 7^{2} = (x + 7)(x - 7)$。所以方程就是 $(x + 7)(x - 7) = 0$，某个因式为 $0$：$x = -7$ 或 $x = 7$。

对 $x^{2} = 49$ 开平方得到同样的一对解 $x = \\pm 7$，两种方法一致。不过因式分解有它的好处：它和以后所有用因式分解解的方程是同一个套路，而且处理 $9x^{2} - 4 = 0$ 这样带系数的方程同样容易。这节课我们识别平方差（包括藏在公因数后面的平方差），并用这种方法求解。`,
  ),
  knowledgePoints: [
    {
      id: "monic",
      title: t("Solving $x^{2} - a^{2} = 0$", "解 $x^{2} - a^{2} = 0$"),
      explanation: t(
        `A difference of squares factors as $A^{2} - B^{2} = (A + B)(A - B)$, which we can see by expanding: the middle terms $-AB$ and $+AB$ cancel. So when an equation is a square minus a square number, factor it and use the zero product rule:

$$x^{2} - 49 = 0 \\Rightarrow (x + 7)(x - 7) = 0 \\Rightarrow x = -7 \\text{ or } x = 7$$

The two solutions are opposites, $x = \\pm 7$. The same works with the terms the other way round: $49 - x^{2} = (7 + x)(7 - x)$ is $0$ when $x = -7$ or $x = 7$.

> **Watch out.** The number in the factors is the square **root** of the constant: $x^{2} - 49$ gives $x = \\pm 7$, not $\\pm 49$. And there are two solutions; $x = 7$ alone misses $x = -7$, which makes the factor $x + 7$ zero.`,
        `平方差可以分解为 $A^{2} - B^{2} = (A + B)(A - B)$，展开就能看出：中间的 $-AB$ 和 $+AB$ 相互抵消。所以当方程是“一个平方减一个平方数”时，先分解，再用零乘积法则：

$$x^{2} - 49 = 0 \\Rightarrow (x + 7)(x - 7) = 0 \\Rightarrow x = -7 \\text{ 或 } x = 7$$

两个解互为相反数，即 $x = \\pm 7$。两项顺序反过来也一样：$49 - x^{2} = (7 + x)(7 - x)$ 在 $x = -7$ 或 $x = 7$ 时为 $0$。

> **注意。** 因式中的数是常数的**平方根**：$x^{2} - 49$ 给出 $x = \\pm 7$，而不是 $\\pm 49$。而且有两个解；只写 $x = 7$ 会漏掉使因式 $x + 7$ 为零的 $x = -7$。`,
      ),
      generate(rng) {
        const a = rng.int(1, 15);
        const v = rng.pick(["x", "y", "t"]);
        const reversed = rng.bool(0.3);
        const eq = reversed ? `${a * a} - ${v}^{2} = 0` : `${v}^{2} - ${a * a} = 0`;
        const squares = reversed ? `${a}^{2} - ${v}^{2} = 0` : `${v}^{2} - ${a}^{2} = 0`;
        const factored = reversed ? `(${a} + ${v})(${a} - ${v}) = 0` : `(${v} + ${a})(${v} - ${a}) = 0`;
        const values = [String(a), String(-a)];
        const at = (x: number) =>
          reversed
            ? `${v} = ${x}: \\quad ${a * a} - ${bare(Q.of(x))}^{2} = ${a * a} - ${a * a} = 0`
            : `${v} = ${x}: \\quad ${bare(Q.of(x))}^{2} - ${a * a} = ${a * a} - ${a * a} = 0`;
        return solutionsProblem({
          prompt: solvePrompt(eq, byFactoring),
          variable: v,
          values,
          wrong: [[String(a)], [String(a * a), String(-a * a)], ...(a % 2 === 0 ? [[String(a / 2), String(-a / 2)]] : [])],
          solution: t(
            `**Step 1: Write it as a difference of squares.** $${a * a} = ${a}^{2}$, so${steps(squares)}**Step 2: Factor and use the zero product rule.** $A^{2} - B^{2} = (A + B)(A - B)$:${steps(factored)}One factor is $0$, so ${solved(values, v).en}.\n\n**Check.** Squaring removes the sign, so both solutions work:${steps(at(a), at(-a))}`,
            `**第一步：写成平方差。** $${a * a} = ${a}^{2}$，所以${steps(squares)}**第二步：分解并运用零乘积法则。** $A^{2} - B^{2} = (A + B)(A - B)$：${steps(factored)}某个因式为 $0$，所以 ${solved(values, v)["zh-CN"]}。\n\n**检验。** 平方会消去符号，所以两个解都成立：${steps(at(a), at(-a))}`,
          ),
        });
      },
    },
    {
      id: "coefficients",
      title: t("Squares with coefficients", "带系数的平方"),
      explanation: t(
        `A coefficient that is itself a perfect square fits the same pattern, because $9x^{2} = (3x)^{2}$. So $9x^{2} - 4$ is $(3x)^{2} - 2^{2}$, and it factors as $(3x + 2)(3x - 2)$:

$$9x^{2} - 4 = 0 \\Rightarrow (3x + 2)(3x - 2) = 0 \\Rightarrow x = -\\frac{2}{3} \\text{ or } x = \\frac{2}{3}$$

Each factor gives a two-step linear equation, so the solutions are fractions. An equation such as $9x^{2} = 4$ is the same one after subtracting $4$ from both sides.

> **Watch out.** From $3x - 2 = 0$ the solution is $x = \\frac{2}{3}$: divide by the $3$ in front of $x$. Stopping at $x = \\pm 2$, or flipping the fraction to $\\pm\\frac{3}{2}$, are the usual slips.`,
        `本身是完全平方数的系数也符合同样的模式，因为 $9x^{2} = (3x)^{2}$。所以 $9x^{2} - 4$ 就是 $(3x)^{2} - 2^{2}$，可以分解为 $(3x + 2)(3x - 2)$：

$$9x^{2} - 4 = 0 \\Rightarrow (3x + 2)(3x - 2) = 0 \\Rightarrow x = -\\frac{2}{3} \\text{ 或 } x = \\frac{2}{3}$$

每个因式给出一个两步的一次方程，所以解是分数。$9x^{2} = 4$ 这样的方程，两边减去 $4$ 后就是同一个方程。

> **注意。** 由 $3x - 2 = 0$ 得到的解是 $x = \\frac{2}{3}$：要除以 $x$ 前面的 $3$。停在 $x = \\pm 2$，或者把分数颠倒成 $\\pm\\frac{3}{2}$，都是常见的错误。`,
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(2, 9);
          q = rng.int(1, 12);
        } while (gcd(p, q) !== 1);
        const moved = rng.bool(0.35);
        const eq = moved ? `${p * p}x^{2} = ${q * q}` : `${p * p}x^{2} - ${q * q} = 0`;
        const values = [num(Q.of(q, p)), num(Q.of(-q, p))];
        const first = moved
          ? t(
              `**Step 1: Get $0$ on one side.** Subtract $${q * q}$ from both sides and write each term as a square:${steps(`${p * p}x^{2} - ${q * q} = 0`, `(${p}x)^{2} - ${q}^{2} = 0`)}`,
              `**第一步：使一边为 $0$。** 两边同时减去 $${q * q}$，并把每一项写成平方：${steps(`${p * p}x^{2} - ${q * q} = 0`, `(${p}x)^{2} - ${q}^{2} = 0`)}`,
            )
          : t(
              `**Step 1: Write each term as a square.** $${p * p}x^{2} = (${p}x)^{2}$ and $${q * q} = ${q}^{2}$:${steps(`(${p}x)^{2} - ${q}^{2} = 0`)}`,
              `**第一步：把每一项写成平方。** $${p * p}x^{2} = (${p}x)^{2}$，$${q * q} = ${q}^{2}$：${steps(`(${p}x)^{2} - ${q}^{2} = 0`)}`,
            );
        return solutionsProblem({
          prompt: solvePrompt(eq, byFactoring),
          values,
          wrong: [
            [String(q), String(-q)],
            [num(Q.of(p, q)), num(Q.of(-p, q))],
            [num(Q.of(q, p))],
            [num(Q.of(q * q, p * p)), num(Q.of(-q * q, p * p))],
          ],
          solution: t(
            `${first.en}**Step 2: Factor.**${steps(`${lf(p, q)}${lf(p, -q)} = 0`)}**Step 3: Solve each factor.** Undo the constant, then divide by $${p}$:${steps(factorZero(p, q), factorZero(p, -q))}So ${solved(values).en}.\n\n${substituted(p * p, 0, -q * q, [Q.of(q, p), Q.of(-q, p)]).en}`,
            `${first["zh-CN"]}**第二步：分解因式。**${steps(`${lf(p, q)}${lf(p, -q)} = 0`)}**第三步：分别解每个因式。** 先消去常数，再除以 $${p}$：${steps(factorZero(p, q), factorZero(p, -q))}所以 ${solved(values)["zh-CN"]}。\n\n${substituted(p * p, 0, -q * q, [Q.of(q, p), Q.of(-q, p)])["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "common-factor-first",
      title: t("Common factors and rearranging", "提取公因数与移项"),
      explanation: t(
        `A difference of squares is often hidden. First move every term to one side so that the other side is $0$; then take out any common factor of the coefficients. What is left in the parentheses may now be a difference of squares. The constant factor is never $0$, so it gives no solution:

$$5x^{2} + 1 = 2x^{2} + 13 \\Rightarrow 3x^{2} - 12 = 0 \\Rightarrow 3(x^{2} - 4) = 0 \\Rightarrow 3(x + 2)(x - 2) = 0$$

So $x = -2$ or $x = 2$. Here $12$ is not a perfect square, but after taking out $3$, the $4$ inside is.

> **Watch out.** The common factor $3$ is not a solution: $3 = 0$ is never true. And taking out the factor does not change the solutions; dividing both sides by $3$ to get $x^{2} - 4 = 0$ is just as good.`,
        `平方差常常是隐藏的。先把所有项移到一边，使另一边为 $0$；再提出各系数的公因数。括号里剩下的可能就是平方差。常数因数永远不为 $0$，所以不给出解：

$$5x^{2} + 1 = 2x^{2} + 13 \\Rightarrow 3x^{2} - 12 = 0 \\Rightarrow 3(x^{2} - 4) = 0 \\Rightarrow 3(x + 2)(x - 2) = 0$$

所以 $x = -2$ 或 $x = 2$。这里 $12$ 不是完全平方数，但提出 $3$ 后，括号里的 $4$ 就是了。

> **注意。** 公因数 $3$ 不是解：$3 = 0$ 永远不成立。提出公因数也不会改变解；两边同时除以 $3$ 得 $x^{2} - 4 = 0$，效果一样。`,
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 3);
          q = rng.int(1, 9);
        } while (gcd(p, q) !== 1);
        const k = rng.int(2, 5);
        const rearrange = rng.bool(0.5);
        const b = rng.int(1, 5);
        const c = rng.nonZero(-9, 9);
        const eq = rearrange ? `${quad(b + k * p * p, 0, c)} = ${quad(b, 0, c + k * q * q)}` : `${k * p * p}x^{2} - ${k * q * q} = 0`;
        const values = [num(Q.of(q, p)), num(Q.of(-q, p))];
        const move = t(
          `**Step 1: Move every term to the left.** Subtract $${quad(b, 0, c + k * q * q)}$ from both sides and combine like terms:${steps(`${k * p * p}x^{2} - ${k * q * q} = 0`)}`,
          `**第一步：把所有项移到左边。** 两边同时减去 $${quad(b, 0, c + k * q * q)}$，合并同类项：${steps(`${k * p * p}x^{2} - ${k * q * q} = 0`)}`,
        );
        const n = rearrange ? 1 : 0;
        const label = (i: number) => t(`**Step ${i + n}: `, `**第${["一", "二", "三", "四"][i + n - 1]}步：`);
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [[num(Q.of(q, p))], [num(Q.of(q * q, p * p)), num(Q.of(-q * q, p * p))], [num(k), num(Q.of(q, p)), num(Q.of(-q, p))]],
          solution: t(
            `${rearrange ? move.en : ""}${label(1).en}Take out the common factor $${k}$.** What is left is a difference of squares:${steps(`${k}(${quad(p * p, 0, -q * q)}) = 0`, `${k}${lf(p, q)}${lf(p, -q)} = 0`)}${label(2).en}Solve each factor with $x$.** The factor $${k}$ is never $0$:${steps(factorZero(p, q), factorZero(p, -q))}So ${solved(values).en}.\n\n${substituted(k * p * p, 0, -k * q * q, [Q.of(q, p), Q.of(-q, p)]).en}`,
            `${rearrange ? move["zh-CN"] : ""}${label(1)["zh-CN"]}提出公因数 $${k}$。** 剩下的是平方差：${steps(`${k}(${quad(p * p, 0, -q * q)}) = 0`, `${k}${lf(p, q)}${lf(p, -q)} = 0`)}${label(2)["zh-CN"]}解含 $x$ 的因式。** 因数 $${k}$ 永远不为 $0$：${steps(factorZero(p, q), factorZero(p, -q))}所以 ${solved(values)["zh-CN"]}。\n\n${substituted(k * p * p, 0, -k * q * q, [Q.of(q, p), Q.of(-q, p)])["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

export const solvingQuadraticEquationsWithNoConstantTerm: TopicDef = {
  id: "solving-quadratic-equations-with-no-constant-term",
  title: t("Solving Quadratic Equations With No Constant Term", "解不含常数项的一元二次方程"),
  summary: t(
    "Solve $ax^{2} + bx = 0$ by factoring out $x$, without losing the solution $x = 0$.",
    "提出 $x$ 解 $ax^{2} + bx = 0$，不丢掉解 $x = 0$。",
  ),
  prerequisites: ["zero-product-rule", "factoring-polynomials-using-gcfs"],
  encompasses: [
    { topic: "zero-product-rule", weight: 0.5 },
    { topic: "factoring-polynomials-using-gcfs", weight: 0.4 },
  ],
  xp: 10,
  standards: ["CCSS.HSA.REI.B.4.B"],
  intro: t(
    `The zero product rule needs a product equal to $0$, and taking out a greatest common factor is one way to make a product. A quadratic equation with no constant term is the easiest case of all, because every term contains $x$. Take

$$x^{2} - 6x = 0$$

Both terms have a factor $x$, so $x^{2} - 6x = x(x - 6)$, and the equation is $x(x - 6) = 0$. One factor is $0$: either $x = 0$, or $x - 6 = 0$ and $x = 6$. Both check: $0^{2} - 6(0) = 0$ and $6^{2} - 6(6) = 36 - 36 = 0$.

It is tempting to divide both sides by $x$ instead, which leaves $x - 6 = 0$ and only $x = 6$. That loses a solution, because dividing by $x$ is allowed only when $x \\ne 0$, and $x = 0$ is precisely the solution that disappears. In this lesson we always factor out $x$, which keeps both.`,
    `零乘积法则需要一个等于 $0$ 的乘积，而提取最大公因式正是构造乘积的一种办法。不含常数项的一元二次方程是最简单的情形，因为每一项都含有 $x$。看

$$x^{2} - 6x = 0$$

两项都有因式 $x$，所以 $x^{2} - 6x = x(x - 6)$，方程就是 $x(x - 6) = 0$。某个因式为 $0$：要么 $x = 0$，要么 $x - 6 = 0$，即 $x = 6$。两个都能通过检验：$0^{2} - 6(0) = 0$，$6^{2} - 6(6) = 36 - 36 = 0$。

人们很容易想到两边同时除以 $x$，剩下 $x - 6 = 0$，只得到 $x = 6$。这样会丢掉一个解，因为只有当 $x \\ne 0$ 时才能除以 $x$，而 $x = 0$ 恰恰就是被丢掉的那个解。这节课我们总是提出 $x$，这样两个解都能保住。`,
  ),
  knowledgePoints: [
    {
      id: "monic",
      title: t("Solving $x^{2} + bx = 0$", "解 $x^{2} + bx = 0$"),
      explanation: t(
        `When every term contains $x$, factor it out: $x^{2} + bx = x(x + b)$. The zero product rule then gives two solutions at once, one from each factor:

$$x^{2} - 6x = 0 \\Rightarrow x(x - 6) = 0 \\Rightarrow x = 0 \\text{ or } x = 6$$

If the equation is written as $x^{2} = 6x$, first subtract $6x$ from both sides to get $0$ on the right.

> **Watch out.** Do not divide both sides by $x$. Dividing by $x$ assumes $x \\ne 0$, so it throws away the solution $x = 0$. One of the two solutions of $x^{2} + bx = 0$ is **always** $0$.`,
        `当每一项都含有 $x$ 时，把它提出来：$x^{2} + bx = x(x + b)$。零乘积法则立即给出两个解，每个因式各一个：

$$x^{2} - 6x = 0 \\Rightarrow x(x - 6) = 0 \\Rightarrow x = 0 \\text{ 或 } x = 6$$

如果方程写成 $x^{2} = 6x$，先两边同时减去 $6x$，使右边为 $0$。

> **注意。** 不要两边同时除以 $x$。除以 $x$ 已经假定了 $x \\ne 0$，所以会丢掉解 $x = 0$。$x^{2} + bx = 0$ 的两个解中**总有**一个是 $0$。`,
      ),
      generate(rng) {
        const b = rng.nonZero(-20, 20);
        const v = rng.pick(["x", "x", "y", "t"]);
        const moved = rng.bool(0.3);
        const eq = moved ? `${v}^{2} = ${poly([-b, v])}` : `${quad(1, b, 0, v)} = 0`;
        const values = ["0", num(-b)];
        const move = t(
          `**Step 1: Get $0$ on one side.** ${b > 0 ? `Add $${poly([b, v])}$ to` : `Subtract $${poly([-b, v])}$ from`} both sides:${steps(`${quad(1, b, 0, v)} = 0`)}`,
          `**第一步：使一边为 $0$。** 两边同时${b > 0 ? `加上 $${poly([b, v])}$` : `减去 $${poly([-b, v])}$`}：${steps(`${quad(1, b, 0, v)} = 0`)}`,
        );
        const n = moved ? 1 : 0;
        const label = (i: number) => t(`**Step ${i + n}: `, `**第${["一", "二", "三"][i + n - 1]}步：`);
        return solutionsProblem({
          prompt: solvePrompt(eq),
          variable: v,
          values,
          wrong: [[num(-b)], ["0", num(b)], [num(b)]],
          solution: t(
            `${moved ? move.en : ""}${label(1).en}Factor out $${v}$.** Both terms contain $${v}$:${steps(`${v}${lf(1, b, v)} = 0`)}${label(2).en}Use the zero product rule.** One factor is $0$:${steps(`${v} = 0 \\quad\\text{or}\\quad ${factorZero(1, b, v)}`)}So ${solved(values, v).en}.\n\n${substituted(1, b, 0, [Q.zero, Q.of(-b)], v).en}`,
            `${moved ? move["zh-CN"] : ""}${label(1)["zh-CN"]}提出 $${v}$。** 两项都含有 $${v}$：${steps(`${v}${lf(1, b, v)} = 0`)}${label(2)["zh-CN"]}运用零乘积法则。** 某个因式为 $0$：${steps(`${v} = 0 \\quad\\text{或}\\quad ${factorZero(1, b, v)}`)}所以 ${solved(values, v)["zh-CN"]}。\n\n${substituted(1, b, 0, [Q.zero, Q.of(-b)], v)["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("Solving $ax^{2} + bx = 0$", "解 $ax^{2} + bx = 0$"),
      explanation: t(
        `Take out the **greatest** common factor: $x$ together with the largest number that divides both coefficients. The factor left in the parentheses is then as simple as possible, and its solution may be a fraction:

$$6x^{2} + 9x = 0 \\Rightarrow 3x(2x + 3) = 0 \\Rightarrow x = 0 \\text{ or } 2x + 3 = 0$$

The second gives $2x = -3$, so $x = -\\frac{3}{2}$. The number $3$ in front does not give a solution, but the $x$ in $3x$ does: $3x = 0$ means $x = 0$.

> **Watch out.** From $2x + 3 = 0$ the solution is $-\\frac{3}{2}$: move the constant across, changing its sign, then divide by the coefficient of $x$. Writing $\\frac{3}{2}$, or the flipped $-\\frac{2}{3}$, is the usual slip.`,
        `提出**最大**公因式：$x$ 连同能整除两个系数的最大的数。这样括号里剩下的因式最简单，它给出的解可能是分数：

$$6x^{2} + 9x = 0 \\Rightarrow 3x(2x + 3) = 0 \\Rightarrow x = 0 \\text{ 或 } 2x + 3 = 0$$

后者得 $2x = -3$，所以 $x = -\\frac{3}{2}$。前面的数 $3$ 不给出解，但 $3x$ 中的 $x$ 给出解：$3x = 0$ 即 $x = 0$。

> **注意。** 由 $2x + 3 = 0$ 得到的解是 $-\\frac{3}{2}$：把常数移过去并变号，再除以 $x$ 的系数。写成 $\\frac{3}{2}$，或者颠倒成 $-\\frac{2}{3}$，是常见的错误。`,
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.pick([2, 3, 4, 5, 6, 8, -2, -3, -4]);
          b = rng.nonZero(-18, 18);
        } while (Q.of(b, a).isInteger() && rng.bool(0.7));
        const g = gcd(a, b) * Math.sign(a);
        const eq = `${quad(a, b, 0)} = 0`;
        const root = Q.of(-b, a);
        const values = ["0", num(root)];
        const gx = poly([g, "x"]);
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [[num(root)], ["0", num(root.neg())], ["0", num(Q.of(-a, b))], ["0", num(-b)]],
          solution: t(
            `**Step 1: Factor out the greatest common factor.** Both terms contain $x$${Math.abs(g) === 1 ? `, and $${a}$ and $${b}$ have no common factor other than $1$` : `, and $${Math.abs(g)}$ is the largest number dividing $${a}$ and $${b}$`}${g < 0 ? "; taking out the negative sign as well keeps the inner $x$ term positive" : ""}:${steps(`${gx}${lf(a / g, b / g)} = 0`)}**Step 2: Use the zero product rule.** $${gx} = 0$ gives $x = 0$, and the other factor gives the second solution:${steps(factorZero(a / g, b / g))}So ${solved(values).en}.\n\n${substituted(a, b, 0, [Q.zero, root]).en}`,
            `**第一步：提出最大公因式。** 两项都含有 $x$${Math.abs(g) === 1 ? `，而 $${a}$ 与 $${b}$ 除 $1$ 外没有公因数` : `，而 $${Math.abs(g)}$ 是能整除 $${a}$ 和 $${b}$ 的最大的数`}${g < 0 ? "；同时提出负号，使括号内 $x$ 项为正" : ""}：${steps(`${gx}${lf(a / g, b / g)} = 0`)}**第二步：运用零乘积法则。** $${gx} = 0$ 给出 $x = 0$，另一个因式给出第二个解：${steps(factorZero(a / g, b / g))}所以 ${solved(values)["zh-CN"]}。\n\n${substituted(a, b, 0, [Q.zero, root])["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "rearranging",
      title: t("Rearranging first", "先移项"),
      explanation: t(
        `The zero product rule only works when one side is $0$, so when $x$ terms are on both sides, move everything to one side first and combine like terms. Then factor out $x$:

$$4x^{2} = 10x \\Rightarrow 4x^{2} - 10x = 0 \\Rightarrow 2x(2x - 5) = 0 \\Rightarrow x = 0 \\text{ or } x = \\frac{5}{2}$$

A product must be expanded first: $x(x + 3) = 5x$ becomes $x^{2} + 3x - 5x = 0$, that is $x^{2} - 2x = 0$, so $x(x - 2) = 0$ and $x = 0$ or $x = 2$.

> **Watch out.** In $4x^{2} = 10x$, cancelling an $x$ from both sides leaves $4x = 10$ and loses $x = 0$. Moving $10x$ across instead keeps every solution. Also watch the sign of the term you move: $10x$ on the right becomes $-10x$ on the left.`,
        `零乘积法则只在一边为 $0$ 时才能用，所以当两边都有含 $x$ 的项时，先把所有项移到一边并合并同类项，再提出 $x$：

$$4x^{2} = 10x \\Rightarrow 4x^{2} - 10x = 0 \\Rightarrow 2x(2x - 5) = 0 \\Rightarrow x = 0 \\text{ 或 } x = \\frac{5}{2}$$

乘积要先展开：$x(x + 3) = 5x$ 化为 $x^{2} + 3x - 5x = 0$，即 $x^{2} - 2x = 0$，所以 $x(x - 2) = 0$，$x = 0$ 或 $x = 2$。

> **注意。** 在 $4x^{2} = 10x$ 中，两边约去一个 $x$ 会剩下 $4x = 10$，丢掉 $x = 0$。把 $10x$ 移过去就能保住所有解。还要注意移项的符号：右边的 $10x$ 移到左边变成 $-10x$。`,
      ),
      generate(rng) {
        const kind = rng.pick(["ax2=bx", "both-sides", "product"] as const);
        let a: number;
        let b: number;
        let eq: string;
        let lead: string[];
        if (kind === "ax2=bx") {
          a = rng.int(1, 6);
          const r = rng.nonZero(-15, 15);
          b = -r;
          eq = `${poly([a, "x^{2}"])} = ${poly([r, "x"])}`;
          lead = [];
        } else if (kind === "both-sides") {
          a = rng.int(1, 5);
          const c = rng.nonZero(-9, 9);
          let d: number;
          do d = rng.nonZero(-9, 9);
          while (d === c);
          b = c - d;
          const extra = rng.int(0, 3);
          eq = `${quad(a + extra, c, 0)} = ${quad(extra, d, 0)}`;
          lead = [];
        } else {
          a = 1;
          const p = rng.nonZero(-9, 9);
          let q: number;
          do q = rng.nonZero(-12, 12);
          while (q === p);
          b = p - q;
          eq = `x${lf(1, p)} = ${poly([q, "x"])}`;
          lead = [`${quad(1, p, 0)} = ${poly([q, "x"])}`];
        }
        const root = Q.of(-b, a);
        const values = ["0", num(root)];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [[num(root)], ["0", num(root.neg())]],
          solution: t(
            `**Step 1: Get $0$ on one side.** ${lead.length > 0 ? "Expand the product, then move" : "Move"} every term on the right to the left, changing its sign, and combine like terms:${steps(...lead, `${quad(a, b, 0)} = 0`)}**Step 2: Factor out $x$.**${steps(`x${lf(a, b)} = 0`)}**Step 3: Use the zero product rule.** One factor is $0$:${steps(`x = 0 \\quad\\text{or}\\quad ${factorZero(a, b)}`)}So ${solved(values).en}.\n\n${substituted(a, b, 0, [Q.zero, root]).en}`,
            `**第一步：使一边为 $0$。** ${lead.length > 0 ? "先展开乘积，再把" : "把"}右边的每一项移到左边（变号），合并同类项：${steps(...lead, `${quad(a, b, 0)} = 0`)}**第二步：提出 $x$。**${steps(`x${lf(a, b)} = 0`)}**第三步：运用零乘积法则。** 某个因式为 $0$：${steps(`x = 0 \\quad\\text{或}\\quad ${factorZero(a, b)}`)}所以 ${solved(values)["zh-CN"]}。\n\n${substituted(a, b, 0, [Q.zero, root])["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

/** stepLabel writes the bold start of step i with its title in each locale: "**Step 2: Factor.**" / "**第二步：分解。**". */
function stepLabel(i: number, en: string, zh: string): Text {
  return t(`**Step ${i}: ${en}.**`, `**第${["一", "二", "三", "四", "五"][i - 1]}步：${zh}。**`);
}

/** pairLine shows two numbers with their product and their sum: "3 \cdot (-5) = -15, \quad 3 + (-5) = -2". */
function pairLine(m: number, n: number): string {
  return `${m} \\cdot ${bare(Q.of(n))} = ${m * n}, \\quad ${m} + ${bare(Q.of(n))} = ${m + n}`;
}

/** pairStep writes the step of factoring x² + bx + c = 0 whose solutions are r and s, after a constant factor k: the two numbers −r and −s, then the factors. */
function pairStep(i: number, r: number, s: number, k = 1): Text {
  const b = -(r + s);
  const c = r * s;
  const where = k === 1 ? t("", "") : t(" inside the parentheses", "括号内的");
  const lines = [pairLine(-r, -s), `${front(k)}${lf(1, -r)}${lf(1, -s)} = 0`];
  return t(
    `${stepLabel(i, `Factor the trinomial${where.en}`, `分解${where["zh-CN"]}三项式`).en} We need two numbers whose product is $${c}$ and whose sum is $${b}$. They are $${-r}$ and $${-s}$:${steps(...lines)}`,
    `${stepLabel(i, `Factor the trinomial${where.en}`, `分解${where["zh-CN"]}三项式`)["zh-CN"]}要找两个数，积为 $${c}$，和为 $${b}$。这两个数是 $${-r}$ 和 $${-s}$：${steps(...lines)}`,
  );
}

/** zeroStep writes the step of the zero product rule on linear factors px + q, after a constant factor k that is never 0. */
function zeroStep(i: number, factors: readonly (readonly [number, number])[], values: readonly string[], k = 1): Text {
  const lines = factors.map(([p, q]) => factorZero(p, q));
  const one = values.length === 1;
  const why =
    k === 1
      ? t("A product is $0$ only when one of its factors is $0$", "乘积为 $0$，当且仅当某个因式为 $0$")
      : t(
          `The constant factor $${k}$ is never $0$, so a factor with $x$ must be $0$`,
          `常数因数 $${k}$ 永远不为 $0$，所以必有一个含 $x$ 的因式为 $0$`,
        );
  return t(
    `${stepLabel(i, "Use the zero product rule", "运用零乘积法则").en} ${why.en}${one ? ". Both factors are the same" : ""}:${steps(...lines)}So ${solved(values).en}${one ? ", the only solution" : ""}.`,
    `${stepLabel(i, "Use the zero product rule", "运用零乘积法则")["zh-CN"]}${why["zh-CN"]}${one ? "。两个因式相同" : ""}：${steps(...lines)}所以 ${solved(values)["zh-CN"]}${one ? "，这是唯一的解" : ""}。`,
  );
}

/** moveStep writes the step of getting 0 on one side: every term on the right moves to the left with its sign changed. */
function moveStep(i: number, standard: string): Text {
  return t(
    `${stepLabel(i, "Get $0$ on one side", "使一边为 $0$").en} Move every term on the right to the left, changing its sign:${steps(standard)}`,
    `${stepLabel(i, "Get $0$ on one side", "使一边为 $0$")["zh-CN"]}把右边的每一项移到左边，并改变符号：${steps(standard)}`,
  );
}

/** takeOutStep writes the step of taking the constant k out of every term of k(ax² + bx + c). */
function takeOutStep(i: number, k: number, b: number, c: number, a = 1): Text {
  const line = `${quad(k * a, k * b, k * c)} = ${front(k)}(${quad(a, b, c)})`;
  const what =
    k === -1
      ? t("The leading coefficient is negative, so take out $-1$", "首项系数为负，所以提出 $-1$")
      : k < 0
        ? t(
            `Every coefficient is a multiple of $${-k}$ and the leading coefficient is negative, so take out $${k}$`,
            `每个系数都是 $${-k}$ 的倍数，且首项系数为负，所以提出 $${k}$`,
          )
        : t(`Every coefficient is a multiple of $${k}$, so take out $${k}$`, `每个系数都是 $${k}$ 的倍数，所以提出 $${k}$`);
  return t(
    `${stepLabel(i, "Take out the common factor", "提出公因数").en} ${what.en}:${steps(line)}`,
    `${stepLabel(i, "Take out the common factor", "提出公因数")["zh-CN"]}${what["zh-CN"]}：${steps(line)}`,
  );
}

/** sidesCheck puts each solution back into an equation whose two sides are written at x by left and right, and shows that they agree. */
function sidesCheck(roots: readonly Q[], left: (x: Q) => string, right: (x: Q) => string): Text {
  const lines = (l: string, r: string) =>
    roots.map((x) => `x = ${num(x)}: \\quad \\text{${l}} \\; ${left(x)}, \\quad \\text{${r}} \\; ${right(x)}`);
  return t(
    `**Check.** Put each solution back into the original equation and work out both sides:${steps(...lines("left", "right"))}Both sides agree each time.`,
    `**检验。** 把每个解代回原方程，分别计算两边：${steps(...lines("左边", "右边"))}每次两边都相等。`,
  );
}

/** productAt writes x(x + b) at a value: "(-3)(-3 + 5) = (-3)(2) = -6". */
function productAt(b: number, x: Q): string {
  const other = x.add(Q.of(b));
  return `${bare(x)}(${linearAt(1, b, x)}) = ${bare(x)}(${num(other)}) = ${num(x.mul(other))}`;
}

export const solvingQuadraticEquationsByFactoring: TopicDef = {
  id: "solving-quadratic-equations-by-factoring",
  title: t("Solving Quadratic Equations by Factoring", "用因式分解法解一元二次方程"),
  summary: t(
    "Solve $x^{2} + bx + c = 0$ by factoring the trinomial and using the zero product rule.",
    "分解三项式并用零乘积法则解 $x^{2} + bx + c = 0$。",
  ),
  prerequisites: ["zero-product-rule", "factoring-trinomials-using-common-factors"],
  encompasses: [
    { topic: "zero-product-rule", weight: 0.6 },
    { topic: "factoring-trinomials", weight: 0.6 },
    { topic: "factoring-trinomials-using-common-factors", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.REI.B.4.B", "CCSS.HSA.SSE.B.3.A"],
  intro: t(
    `We can factor a trinomial $x^{2} + bx + c$ by finding two numbers whose product is $c$ and whose sum is $b$, and we can solve a product equal to $0$ with the zero product rule. Put together, they solve a great many quadratic equations. Take

$$x^{2} - 2x - 15 = 0$$

We want two numbers with product $-15$ and sum $-2$: they are $3$ and $-5$. So the equation is $(x + 3)(x - 5) = 0$. A product is $0$ only when a factor is $0$, so $x + 3 = 0$ or $x - 5 = 0$, that is, $x = -3$ or $x = 5$.

Each solution can be checked in the original equation: $(-3)^{2} - 2(-3) - 15 = 9 + 6 - 15 = 0$. In this lesson we solve trinomial equations this way, first moving terms so that one side is $0$ and taking out any common factor when there is one.`,
    `我们会分解三项式 $x^{2} + bx + c$：找两个积为 $c$、和为 $b$ 的数；也会用零乘积法则解“乘积等于 $0$”的方程。两者结合，就能解许多一元二次方程。看

$$x^{2} - 2x - 15 = 0$$

要找积为 $-15$、和为 $-2$ 的两个数：$3$ 和 $-5$。所以方程就是 $(x + 3)(x - 5) = 0$。乘积为 $0$ 时必有一个因式为 $0$，所以 $x + 3 = 0$ 或 $x - 5 = 0$，即 $x = -3$ 或 $x = 5$。

每个解都可以代回原方程检验：$(-3)^{2} - 2(-3) - 15 = 9 + 6 - 15 = 0$。这节课我们用这种方法解三项式方程：先移项使一边为 $0$，有公因数时先提出公因数。`,
  ),
  knowledgePoints: [
    {
      id: "standard-form",
      title: t("Equations in standard form", "一般形式的方程"),
      explanation: t(
        `With $0$ on one side, factor the trinomial, and the zero product rule turns the equation into two linear ones. To factor $x^{2} + bx + c$, look for two numbers $m$ and $n$ with $mn = c$ and $m + n = b$; then $x^{2} + bx + c = (x + m)(x + n)$, because expanding the right side gives $x^{2} + (m + n)x + mn$.

For $x^{2} - 2x - 15 = 0$, the numbers $3$ and $-5$ have product $-15$ and sum $-2$, so

$$(x + 3)(x - 5) = 0 \\Rightarrow x = -3 \\text{ or } x = 5$$

Check $x = 5$: $5^{2} - 2(5) - 15 = 25 - 10 - 15 = 0$.

> **Watch out.** The numbers $m$ and $n$ are not the solutions: the factor $x + 3$ is $0$ when $x = -3$. Each solution has the opposite sign of the number in its factor, and both factors give one.`,
        `一边为 $0$ 时，分解三项式，零乘积法则就把方程化为两个一次方程。分解 $x^{2} + bx + c$ 时，找两个数 $m$ 和 $n$，使 $mn = c$，$m + n = b$；那么 $x^{2} + bx + c = (x + m)(x + n)$，因为把右边展开得 $x^{2} + (m + n)x + mn$。

对 $x^{2} - 2x - 15 = 0$，$3$ 和 $-5$ 的积是 $-15$，和是 $-2$，所以

$$(x + 3)(x - 5) = 0 \\Rightarrow x = -3 \\text{ 或 } x = 5$$

检验 $x = 5$：$5^{2} - 2(5) - 15 = 25 - 10 - 15 = 0$。

> **注意。** 数 $m$ 和 $n$ 不是解：因式 $x + 3$ 在 $x = -3$ 时才为 $0$。每个解都与它所在因式中的数符号相反，而且两个因式各给出一个解。`,
      ),
      keyPrerequisites: ["factoring-trinomials"],
      generate(rng) {
        const [r, s] = drawRoots(rng, 12);
        const b = -(r + s);
        const c = r * s;
        const eq = `${quad(1, b, c)} = 0`;
        const values = [num(r), num(s)];
        const factors = [
          [1, -r],
          [1, -s],
        ] as const;
        const work = [pairStep(1, r, s), zeroStep(2, factors, values), substituted(1, b, c, [Q.of(r), Q.of(s)])];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [[num(r), num(-s)]],
          mistakes: rootSlips(r, s),
          solution: t(work.map((w) => w.en).join("\n\n"), work.map((w) => w["zh-CN"]).join("\n\n")),
        });
      },
    },
    {
      id: "rearranging",
      title: t("Rearranging first", "先移项"),
      explanation: t(
        `The zero product rule speaks only about a product equal to $0$, so move every term to one side first. For $x(x + 2) = 15$, expand and subtract $15$:

$$x^{2} + 2x - 15 = 0 \\Rightarrow (x + 5)(x - 3) = 0 \\Rightarrow x = -5 \\text{ or } x = 3$$

Check $x = 3$ in the original equation: $3(3 + 2) = 3 \\cdot 5 = 15$.

> **Watch out.** Do not set $x = 15$ and $x + 2 = 15$. Two numbers whose product is $15$ need not be $15$ themselves; only a product of $0$ forces a factor to be $0$.`,
        `零乘积法则只适用于乘积等于 $0$ 的情形，所以先把所有项移到一边。对 $x(x + 2) = 15$，展开后两边减去 $15$：

$$x^{2} + 2x - 15 = 0 \\Rightarrow (x + 5)(x - 3) = 0 \\Rightarrow x = -5 \\text{ 或 } x = 3$$

在原方程中检验 $x = 3$：$3(3 + 2) = 3 \\cdot 5 = 15$。

> **注意。** 不要令 $x = 15$ 且 $x + 2 = 15$。积为 $15$ 的两个数本身不一定是 $15$；只有乘积为 $0$ 时，才能断定某个因式为 $0$。`,
      ),
      generate(rng) {
        const [r, s] = drawRoots(rng, 10);
        const b = -(r + s);
        const c = r * s;
        const kind = rng.pick(["x2=", "move-c", "product"] as const);
        const eq = kind === "x2=" ? `x^{2} = ${linear(-b, -c)}` : kind === "move-c" ? `${quad(1, b, 0)} = ${-c}` : `x${lf(1, b)} = ${-c}`;
        const values = [num(r), num(s)];
        const wrong: string[][] = [];
        if (kind === "product") wrong.push([num(-c), num(-c - b)]);
        const standard = kind === "product" ? `${quad(1, b, 0)} = ${-c} \\Rightarrow ${quad(1, b, c)} = 0` : `${quad(1, b, c)} = 0`;
        const move =
          kind === "product"
            ? t(
                `${stepLabel(1, "Get $0$ on one side", "使一边为 $0$").en} Expand the left side, then move $${-c}$ to the left by ${c > 0 ? `adding $${c}$` : `subtracting $${-c}$`}:${steps(standard)}`,
                `${stepLabel(1, "Get $0$ on one side", "使一边为 $0$")["zh-CN"]}先展开左边，再两边${c > 0 ? `加上 $${c}$` : `减去 $${-c}$`}，把 $${-c}$ 移到左边：${steps(standard)}`,
              )
            : moveStep(1, standard);
        const left = (x: Q) => (kind === "x2=" ? substitution(1, 0, 0, x) : kind === "move-c" ? substitution(1, b, 0, x) : productAt(b, x));
        const right = (x: Q) => (kind === "x2=" ? substitution(0, -b, -c, x) : num(-c));
        const factors = [
          [1, -r],
          [1, -s],
        ] as const;
        const work = [move, pairStep(2, r, s), zeroStep(3, factors, values), sidesCheck([Q.of(r), Q.of(s)], left, right)];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong,
          mistakes: rootSlips(r, s),
          solution: t(work.map((w) => w.en).join("\n\n"), work.map((w) => w["zh-CN"]).join("\n\n")),
        });
      },
    },
    {
      id: "common-factors-and-repeated-roots",
      title: t("Common factors and repeated solutions", "公因数与重根"),
      explanation: t(
        `Take out a common factor first: it makes the trinomial inside simpler, and a constant factor is never $0$, so it gives no solution.

$$2x^{2} - 2x - 24 = 0 \\Rightarrow 2(x^{2} - x - 12) = 0 \\Rightarrow 2(x + 3)(x - 4) = 0 \\Rightarrow x = -3 \\text{ or } x = 4$$

A perfect square trinomial has two equal factors, so it gives just one solution:

$$x^{2} - 10x + 25 = 0 \\Rightarrow (x - 5)^{2} = 0 \\Rightarrow x = 5$$

Check: $5^{2} - 10(5) + 25 = 25 - 50 + 25 = 0$.

> **Watch out.** The constant $2$ in $2(x + 3)(x - 4) = 0$ is not a solution, and neither is $x = 0$: $2$ can never be $0$, so only the factors with $x$ give solutions. A repeated factor gives its solution once.`,
        `先提出公因数：括号内的三项式会更简单，而常数因数永远不为 $0$，不给出解。

$$2x^{2} - 2x - 24 = 0 \\Rightarrow 2(x^{2} - x - 12) = 0 \\Rightarrow 2(x + 3)(x - 4) = 0 \\Rightarrow x = -3 \\text{ 或 } x = 4$$

完全平方三项式有两个相同的因式，所以只给出一个解：

$$x^{2} - 10x + 25 = 0 \\Rightarrow (x - 5)^{2} = 0 \\Rightarrow x = 5$$

检验：$5^{2} - 10(5) + 25 = 25 - 50 + 25 = 0$。

> **注意。** $2(x + 3)(x - 4) = 0$ 中的常数 $2$ 不是解，$x = 0$ 也不是：$2$ 永远不为 $0$，只有含 $x$ 的因式才给出解。重复的因式只给出一个解。`,
      ),
      generate(rng) {
        if (rng.bool(0.4)) {
          const r = rng.nonZero(-12, 12);
          const k = rng.pick([1, 1, 2, 3, -1]);
          const eq = `${quad(k, -2 * k * r, k * r * r)} = 0`;
          const values = [num(r)];
          const square = `${quad(1, -2 * r, r * r)} = (${linear(1, -r)})^{2}`;
          const n = k === 1 ? 0 : 1;
          const spot = t(
            `${stepLabel(n + 1, `Factor the trinomial${k === 1 ? "" : " inside the parentheses"}`, `分解${k === 1 ? "" : "括号内的"}三项式`).en} The first term is $x^{2}$, the last is $${r * r} = ${bare(Q.of(-r))}^{2}$, and the middle term is $2 \\cdot x \\cdot ${bare(Q.of(-r))} = ${poly([-2 * r, "x"])}$, so it is a perfect square:${steps(square)}`,
            `${stepLabel(n + 1, `Factor the trinomial${k === 1 ? "" : " inside the parentheses"}`, `分解${k === 1 ? "" : "括号内的"}三项式`)["zh-CN"]}首项是 $x^{2}$，末项是 $${r * r} = ${bare(Q.of(-r))}^{2}$，中间项是 $2 \\cdot x \\cdot ${bare(Q.of(-r))} = ${poly([-2 * r, "x"])}$，所以它是完全平方：${steps(square)}`,
          );
          const work = [
            ...(k === 1 ? [] : [takeOutStep(1, k, -2 * r, r * r)]),
            spot,
            zeroStep(n + 2, [[1, -r]], values, k),
            substituted(k, -2 * k * r, k * r * r, [Q.of(r)]),
          ];
          return solutionsProblem({
            prompt: solvePrompt(eq),
            values,
            wrong: [[num(r), num(-r)], [num(-r)]],
            solution: t(work.map((w) => w.en).join("\n\n"), work.map((w) => w["zh-CN"]).join("\n\n")),
          });
        }
        const [r, s] = drawRoots(rng, 9);
        const k = rng.pick([2, 3, 4, 5, -1, -2, -3]);
        const eq = `${quad(k, -k * (r + s), k * r * s)} = 0`;
        const values = [num(r), num(s)];
        const factors = [
          [1, -r],
          [1, -s],
        ] as const;
        const work = [
          takeOutStep(1, k, -(r + s), r * s),
          pairStep(2, r, s, k),
          zeroStep(3, factors, values, k),
          substituted(k, -k * (r + s), k * r * s, [Q.of(r), Q.of(s)]),
        ];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [
            [num(-r), num(-s)],
            [num(k), num(r), num(s)],
            ["0", num(r), num(s)],
          ],
          solution: t(work.map((w) => w.en).join("\n\n"), work.map((w) => w["zh-CN"]).join("\n\n")),
        });
      },
    },
  ],
};

/** acStep writes the step of factoring (pr)x² + (ps + qr)x + qs = 0 by the ac method, after a constant factor k: split the middle term into psx and qrx, then group. */
function acStep(i: number, p: number, q: number, r: number, s: number, k = 1): Text {
  const a = p * r;
  const b = p * s + q * r;
  const c = q * s;
  const tailGroup = `${q < 0 ? " - " : " + "}${Math.abs(q) === 1 ? "" : Math.abs(q)}${lf(r, s)}`;
  const lines = [
    pairLine(p * s, q * r),
    `${front(k)}(${poly([a, "x^{2}"], [p * s, "x"], [q * r, "x"], [c, ""])}) = 0`.replace(/^\((.*)\) = 0$/, "$1 = 0"),
    `${front(k)}${k === 1 ? "" : "["}${poly([p, "x"])}${lf(r, s)}${tailGroup}${k === 1 ? "" : "]"} = 0`,
    `${front(k)}${lf(p, q)}${lf(r, s)} = 0`,
  ];
  const where = k === 1 ? "" : " inside the parentheses";
  const zhWhere = k === 1 ? "" : "括号内的";
  const label = stepLabel(i, `Factor the trinomial${where}`, `分解${zhWhere}三项式`);
  return t(
    `${label.en} Multiply the leading coefficient by the constant: $${a} \\cdot ${bare(Q.of(c))} = ${a * c}$. We need two numbers whose product is $${a * c}$ and whose sum is $${b}$; they are $${p * s}$ and $${q * r}$. Split the middle term into these two parts, then take out a factor from each pair of terms:${steps(...lines)}`,
    `${label["zh-CN"]}把首项系数与常数项相乘：$${a} \\cdot ${bare(Q.of(c))} = ${a * c}$。要找两个数，积为 $${a * c}$，和为 $${b}$；它们是 $${p * s}$ 和 $${q * r}$。把中间项拆成这两部分，再从每两项中各提出一个公因式：${steps(...lines)}`,
  );
}

export const solvingQuadraticEquationsWithLeadingCoefficientsByFactoring: TopicDef = {
  id: "solving-quadratic-equations-with-leading-coefficients-by-factoring",
  title: t("Solving Quadratic Equations With Leading Coefficients by Factoring", "用因式分解法解首项系数不为 1 的一元二次方程"),
  summary: t("Solve $ax^{2} + bx + c = 0$ by factoring into $(px + q)(rx + s)$.", "分解为 $(px + q)(rx + s)$，解 $ax^{2} + bx + c = 0$。"),
  prerequisites: ["solving-quadratic-equations-by-factoring", "further-factoring-trinomials-with-leading-coefficients"],
  encompasses: [
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.3 },
    { topic: "factoring-trinomials-with-leading-coefficients", weight: 0.6 },
    { topic: "further-factoring-trinomials-with-leading-coefficients", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.4.B"],
  intro: t(
    `We can solve $x^{2} + bx + c = 0$ by factoring, and we can factor a trinomial $ax^{2} + bx + c$ whose leading coefficient is not $1$, for example with the $ac$ method. Putting the two together solves equations such as

$$2x^{2} + 5x - 3 = 0$$

Here $ac = 2 \\cdot (-3) = -6$, and $6$ and $-1$ have product $-6$ and sum $5$. Splitting $5x$ into $6x - x$ and grouping gives $2x(x + 3) - (x + 3) = (2x - 1)(x + 3)$. So $2x - 1 = 0$ or $x + 3 = 0$, that is, $x = \\frac{1}{2}$ or $x = -3$.

The new feature is that a factor such as $2x - 1$ gives a fraction: we solve it like any linear equation, adding $1$ and then dividing by $2$. In this lesson we solve such equations, also when the terms must first be moved to one side or a common factor taken out.`,
    `我们会用因式分解法解 $x^{2} + bx + c = 0$，也会分解首项系数不为 $1$ 的三项式 $ax^{2} + bx + c$，例如用 $ac$ 法。两者结合，就能解这样的方程：

$$2x^{2} + 5x - 3 = 0$$

这里 $ac = 2 \\cdot (-3) = -6$，而 $6$ 与 $-1$ 的积是 $-6$，和是 $5$。把 $5x$ 拆成 $6x - x$ 再分组，得 $2x(x + 3) - (x + 3) = (2x - 1)(x + 3)$。所以 $2x - 1 = 0$ 或 $x + 3 = 0$，即 $x = \\frac{1}{2}$ 或 $x = -3$。

新的地方在于，像 $2x - 1$ 这样的因式会给出分数解：像解一次方程一样，先加 $1$，再除以 $2$。这节课我们解这类方程，包括需要先移项或先提出公因数的情形。`,
  ),
  knowledgePoints: [
    {
      id: "standard-form",
      title: t("Equations in standard form", "一般形式的方程"),
      explanation: t(
        `Factor $ax^{2} + bx + c$ into $(px + q)(rx + s)$, then set each factor equal to $0$. A factor $px + q$ is $0$ exactly when $x = -\\frac{q}{p}$: subtract $q$, then divide by $p$.

For $2x^{2} + 5x - 3 = 0$:

$$(2x - 1)(x + 3) = 0 \\Rightarrow 2x - 1 = 0 \\text{ or } x + 3 = 0 \\Rightarrow x = \\frac{1}{2} \\text{ or } x = -3$$

Check $x = \\frac{1}{2}$: $2\\left(\\frac{1}{2}\\right)^{2} + 5\\left(\\frac{1}{2}\\right) - 3 = \\frac{1}{2} + \\frac{5}{2} - 3 = 0$.

> **Watch out.** Solve each factor completely. $2x - 1 = 0$ gives $x = \\frac{1}{2}$, not $x = 1$ (the division by $2$ forgotten), not $x = -\\frac{1}{2}$ (the sign changed twice) and not $x = 2$ (the fraction turned over).`,
        `把 $ax^{2} + bx + c$ 分解为 $(px + q)(rx + s)$，再令每个因式等于 $0$。因式 $px + q$ 为 $0$ 恰好当 $x = -\\frac{q}{p}$：先减去 $q$，再除以 $p$。

对 $2x^{2} + 5x - 3 = 0$：

$$(2x - 1)(x + 3) = 0 \\Rightarrow 2x - 1 = 0 \\text{ 或 } x + 3 = 0 \\Rightarrow x = \\frac{1}{2} \\text{ 或 } x = -3$$

检验 $x = \\frac{1}{2}$：$2\\left(\\frac{1}{2}\\right)^{2} + 5\\left(\\frac{1}{2}\\right) - 3 = \\frac{1}{2} + \\frac{5}{2} - 3 = 0$。

> **注意。** 每个因式都要完整地解出来。$2x - 1 = 0$ 给出 $x = \\frac{1}{2}$，而不是 $x = 1$（忘了除以 $2$），不是 $x = -\\frac{1}{2}$（符号变了两次），也不是 $x = 2$（分数颠倒了）。`,
      ),
      generate(rng) {
        const [p, q, r, s] = drawBinomials(rng);
        const a = p * r;
        const b = p * s + q * r;
        const c = q * s;
        const eq = `${quad(a, b, c)} = 0`;
        const roots = [Q.of(-q, p), Q.of(-s, r)];
        const values = roots.map(num);
        const work = [
          acStep(1, p, q, r, s),
          zeroStep(
            2,
            [
              [p, q],
              [r, s],
            ],
            values,
          ),
          substituted(a, b, c, roots),
        ];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [
            [num(Q.of(q, p)), num(Q.of(s, r))],
            [num(-q), num(-s)],
            [num(Q.of(-p, q)), num(Q.of(-r, s))],
          ],
          solution: t(work.map((w) => w.en).join("\n\n"), work.map((w) => w["zh-CN"]).join("\n\n")),
        });
      },
    },
    {
      id: "rearranging",
      title: t("Rearranging first", "先移项"),
      explanation: t(
        `As before, the zero product rule needs $0$ on one side. Move every term to the side of the $x^{2}$ term, so that the leading coefficient stays positive, then factor:

$$6x^{2} = 5x + 6 \\Rightarrow 6x^{2} - 5x - 6 = 0 \\Rightarrow (2x - 3)(3x + 2) = 0 \\Rightarrow x = \\frac{3}{2} \\text{ or } x = -\\frac{2}{3}$$

Check $x = \\frac{3}{2}$ in the original equation: $6\\left(\\frac{3}{2}\\right)^{2} = \\frac{27}{2}$ and $5\\left(\\frac{3}{2}\\right) + 6 = \\frac{15}{2} + 6 = \\frac{27}{2}$.

> **Watch out.** A term that moves across the equals sign changes its sign: $5x$ on the right becomes $-5x$ on the left. Then solve each factor fully, dividing by its coefficient of $x$.`,
        `和前面一样，零乘积法则要求一边为 $0$。把所有项移到 $x^{2}$ 项所在的一边，使首项系数保持为正，再分解：

$$6x^{2} = 5x + 6 \\Rightarrow 6x^{2} - 5x - 6 = 0 \\Rightarrow (2x - 3)(3x + 2) = 0 \\Rightarrow x = \\frac{3}{2} \\text{ 或 } x = -\\frac{2}{3}$$

在原方程中检验 $x = \\frac{3}{2}$：$6\\left(\\frac{3}{2}\\right)^{2} = \\frac{27}{2}$，$5\\left(\\frac{3}{2}\\right) + 6 = \\frac{15}{2} + 6 = \\frac{27}{2}$。

> **注意。** 项移过等号要变号：右边的 $5x$ 到左边变成 $-5x$。然后完整地解每个因式，记得除以 $x$ 的系数。`,
      ),
      generate(rng) {
        const [p, q, r, s] = drawBinomials(rng);
        const a = p * r;
        const b = p * s + q * r;
        const c = q * s;
        const linearRight = rng.bool();
        const eq = linearRight ? `${poly([a, "x^{2}"])} = ${linear(-b, -c)}` : `${quad(a, b, 0)} = ${-c}`;
        const roots = [Q.of(-q, p), Q.of(-s, r)];
        const values = roots.map(num);
        const left = (x: Q) => (linearRight ? substitution(a, 0, 0, x) : substitution(a, b, 0, x));
        const right = (x: Q) => (linearRight ? substitution(0, -b, -c, x) : num(-c));
        const work = [
          moveStep(1, `${quad(a, b, c)} = 0`),
          acStep(2, p, q, r, s),
          zeroStep(
            3,
            [
              [p, q],
              [r, s],
            ],
            values,
          ),
          sidesCheck(roots, left, right),
        ];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [
            [num(Q.of(q, p)), num(Q.of(s, r))],
            [num(-q), num(-s)],
          ],
          solution: t(work.map((w) => w.en).join("\n\n"), work.map((w) => w["zh-CN"]).join("\n\n")),
        });
      },
    },
    {
      id: "common-and-negative-factors",
      title: t("Common factors and negative leading coefficients", "公因数与负的首项系数"),
      explanation: t(
        `Before factoring, take out any number that divides every coefficient, and take out $-1$ when the leading coefficient is negative. The trinomial left inside is smaller and has a positive leading coefficient, and the number taken out is never $0$, so it gives no solution:

$$-6x^{2} + x + 2 = 0 \\Rightarrow -(6x^{2} - x - 2) = 0 \\Rightarrow -(2x + 1)(3x - 2) = 0 \\Rightarrow x = -\\frac{1}{2} \\text{ or } x = \\frac{2}{3}$$

Check $x = \\frac{2}{3}$: $-6\\left(\\frac{2}{3}\\right)^{2} + \\frac{2}{3} + 2 = -\\frac{8}{3} + \\frac{2}{3} + 2 = 0$.

> **Watch out.** The number taken out is not a solution: in $-(2x + 1)(3x - 2) = 0$ the factor $-1$ can never be $0$. Only the factors with $x$ give solutions.`,
        `分解之前，先提出能整除所有系数的数；首项系数为负时提出 $-1$。括号内剩下的三项式更小，首项系数为正；提出的数永远不为 $0$，不给出解：

$$-6x^{2} + x + 2 = 0 \\Rightarrow -(6x^{2} - x - 2) = 0 \\Rightarrow -(2x + 1)(3x - 2) = 0 \\Rightarrow x = -\\frac{1}{2} \\text{ 或 } x = \\frac{2}{3}$$

检验 $x = \\frac{2}{3}$：$-6\\left(\\frac{2}{3}\\right)^{2} + \\frac{2}{3} + 2 = -\\frac{8}{3} + \\frac{2}{3} + 2 = 0$。

> **注意。** 提出的数不是解：在 $-(2x + 1)(3x - 2) = 0$ 中，因数 $-1$ 永远不为 $0$。只有含 $x$ 的因式才给出解。`,
      ),
      generate(rng) {
        const [p, q, r, s] = drawBinomials(rng, 7);
        const k = rng.pick([2, 3, -1, -1, -2]);
        const a = p * r;
        const b = p * s + q * r;
        const c = q * s;
        const eq = `${quad(k * a, k * b, k * c)} = 0`;
        const roots = [Q.of(-q, p), Q.of(-s, r)];
        const values = roots.map(num);
        const work = [
          takeOutStep(1, k, b, c, a),
          acStep(2, p, q, r, s, k),
          zeroStep(
            3,
            [
              [p, q],
              [r, s],
            ],
            values,
            k,
          ),
          substituted(k * a, k * b, k * c, roots),
        ];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [
            [num(Q.of(q, p)), num(Q.of(s, r))],
            [num(k), num(Q.of(-q, p)), num(Q.of(-s, r))],
          ],
          solution: t(work.map((w) => w.en).join("\n\n"), work.map((w) => w["zh-CN"]).join("\n\n")),
        });
      },
    },
  ],
};

/** pqPrompt asks for p and q in the form a(x + p)² + q. */
function pqPrompt(expr: string, a = 1): Text {
  const form = `${front(a)}(x + p)^{2} + q`;
  return t(`Write $${expr}$ in the form $${form}$. Give $p$ and $q$.`, `把 $${expr}$ 写成 $${form}$ 的形式，求 $p$ 和 $q$。`);
}

/** squareOf writes (x + p)², with tall parentheses when p is a fraction. */
const squareOf = (p: Q, v = "x") =>
  p.isZero() ? `${v}^{2}` : p.isInteger() ? `(${linear(1, p, v)})^{2}` : `\\left(${linear(1, p, v)}\\right)^{2}`;

/** completedForm writes a(x + p)² + q. */
const completedForm = (a: number, p: Q, q: Q) => `${front(a)}${squareOf(p)}${tail(q)}`;

/** chain joins the forms of one expression with equals signs, leaving out a form that repeats the one before it. */
function chain(parts: readonly string[]): string {
  return parts.filter((part, i) => i === 0 || part !== parts[i - 1]).join(" = ");
}

/** expansionCheck checks a(x + p)² + q by squaring it out back to ax² + bx + c. */
function expansionCheck(a: number, p: Q, q: Q): Text {
  const A = Q.of(a);
  const b = p.mul(A).mul(Q.of(2));
  const ap2 = p.mul(p).mul(A);
  const c = ap2.add(q);
  const parts =
    a === 1
      ? [completedForm(1, p, q), `${quad(1, b, ap2)}${tail(q)}`, quad(1, b, c)]
      : [
          completedForm(a, p, q),
          `${front(a)}\\left(${quad(1, p.mul(Q.of(2)), p.mul(p))}\\right)${tail(q)}`,
          `${quad(a, b, ap2)}${tail(q)}`,
          quad(a, b, c),
        ];
  return t(
    `**Check.** Square out the result and combine the constants:${steps(chain(parts))}This is the expression we started with.`,
    `**检验。** 把结果展开，再合并常数：${steps(chain(parts))}这正是原来的式子。`,
  );
}

/** halfSquared writes how the completing number arises from the coefficient b of x: "half of 6 is 3, and 3^{2} = 9". */
function halfSquared(b: Q): Text {
  const half = b.div(Q.of(2));
  const line = `${bare(half)}^{2} = ${num(half.mul(half))}`;
  return t(`half of $${num(b)}$ is $${num(half)}$, and $${line}$`, `$${num(b)}$ 的一半是 $${num(half)}$，而 $${line}$`);
}

/** monicCompletion writes the steps of writing x² + bx + c as (x + p)² + q: the number to add, adding and subtracting it, then the square and the constants. */
function monicCompletion(b: number, c: number): Text {
  const p = Q.of(b, 2);
  const p2 = p.mul(p);
  const q = Q.of(c).sub(p2);
  const expr = quad(1, b, c);
  const [open, close] = p.isInteger() ? ["(", ")"] : ["\\left(", "\\right)"];
  const added = `${expr} = ${open}${quad(1, b, p2)}${close} - ${num(p2)}${tail(c)}`;
  const combine =
    c === 0 || p.isInteger()
      ? []
      : [`-${num(p2)} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = -${num(p2)} ${c < 0 ? "-" : "+"} \\frac{${4 * Math.abs(c)}}{4} = ${num(q)}`];
  const half = halfSquared(Q.of(b));
  const constants =
    combine.length > 0 ? t(" Over a common denominator, the constants combine as follows:", "通分后合并常数：") : t(" So:", "所以：");
  return t(
    `**Step 1: Find the number that completes the square.** Since $(x + p)^{2} = x^{2} + 2px + p^{2}$, the number is the square of half the coefficient of $x$: ${half.en}.

**Step 2: Add it and take it away again.** Adding $${num(p2)}$ and subtracting it leaves the value unchanged:${steps(added)}**Step 3: Write the square and combine the constants.** The parentheses hold $${quad(1, b, p2)} = ${squareOf(p)}$.${constants.en}${steps(...combine, `${expr} = ${completedForm(1, p, q)}`)}So $p = ${num(p)}$ and $q = ${num(q)}$.`,
    `**第一步：找出配方所需的数。** 因为 $(x + p)^{2} = x^{2} + 2px + p^{2}$，这个数是 $x$ 的系数一半的平方：${half["zh-CN"]}。

**第二步：加上它，再减去它。** 加上 $${num(p2)}$ 再减去它，式子的值不变：${steps(added)}**第三步：写成平方，合并常数。** 括号内 $${quad(1, b, p2)} = ${squareOf(p)}$。${constants["zh-CN"]}${steps(...combine, `${expr} = ${completedForm(1, p, q)}`)}所以 $p = ${num(p)}$，$q = ${num(q)}$。`,
  );
}

export const completingTheSquare: TopicDef = {
  id: "completing-the-square",
  title: t("Completing the Square", "配方"),
  summary: t(
    "Write $x^{2} + bx + c$ as $(x + p)^{2} + q$, with even or odd $b$.",
    "把 $x^{2} + bx + c$ 写成 $(x + p)^{2} + q$ 的形式（$b$ 为偶数或奇数）。",
  ),
  prerequisites: ["factoring-perfect-square-trinomials"],
  encompasses: [{ topic: "factoring-perfect-square-trinomials", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSA.SSE.B.3.B"],
  intro: t(
    `We know the perfect square trinomials: $x^{2} + 6x + 9 = (x + 3)^{2}$, because $(x + 3)^{2} = x^{2} + 2 \\cdot 3x + 3^{2}$. Most trinomials are not perfect squares, but every one of them is a perfect square plus a constant. Writing it that way is called **completing the square**, and it is how we will solve every quadratic equation and find the lowest or highest point of every parabola.

Take $x^{2} + 6x + 2$. It has the same $x^{2} + 6x$ as $(x + 3)^{2} = x^{2} + 6x + 9$, but $2$ instead of $9$, that is, $7$ less:

$$x^{2} + 6x + 2 = (x + 3)^{2} - 7$$

Now $x$ appears only once. Since a square is never negative, the expression is never less than $-7$, and it equals $-7$ exactly when $x = -3$:

{{figure 0}}

In this lesson we find the number that completes the square and write $x^{2} + bx + c$ as $(x + p)^{2} + q$, when $b$ is even and when it is odd.`,
    `我们认识完全平方三项式：$x^{2} + 6x + 9 = (x + 3)^{2}$，因为 $(x + 3)^{2} = x^{2} + 2 \\cdot 3x + 3^{2}$。大多数三项式不是完全平方，但每一个都等于一个完全平方加上一个常数。这样改写叫做**配方**；以后我们要靠它解所有的一元二次方程，求所有抛物线的最低点或最高点。

看 $x^{2} + 6x + 2$。它与 $(x + 3)^{2} = x^{2} + 6x + 9$ 有相同的 $x^{2} + 6x$，但常数是 $2$ 而不是 $9$，即少了 $7$：

$$x^{2} + 6x + 2 = (x + 3)^{2} - 7$$

现在 $x$ 只出现一次。平方永远不是负数，所以这个式子永远不小于 $-7$，并且恰好在 $x = -3$ 时等于 $-7$：

{{figure 0}}

这节课我们找出配方所需的数，并把 $x^{2} + bx + c$ 写成 $(x + p)^{2} + q$，包括 $b$ 为偶数和奇数的情形。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -8, xMax: 2, yMin: -8, yMax: 6, labelEvery: 2, step: 1 },
      [
        { kind: "curve", f: (x) => x * x + 6 * x + 2, accent: true },
        { kind: "point", at: [-3, -7], label: "(−3, −7)", dir: "s", tone: "result" },
      ],
      "The parabola y = x² + 6x + 2 = (x + 3)² − 7 has its lowest point at (−3, −7).",
      "抛物线 y = x² + 6x + 2 = (x + 3)² − 7 的最低点是 (−3, −7)。",
    ),
  ],
  knowledgePoints: [
    {
      id: "missing-constant",
      title: t("The constant that completes the square", "配成完全平方的常数"),
      explanation: t(
        `A perfect square $(x + p)^{2} = x^{2} + 2px + p^{2}$ has a coefficient of $x$ equal to $2p$ and a constant equal to $p^{2}$. So to turn $x^{2} + bx$ into a perfect square, take $p$ as half of $b$ and add $p^{2}$, the square of **half** the coefficient of $x$:

$$x^{2} + 10x + \\left(\\frac{10}{2}\\right)^{2} = x^{2} + 10x + 25 = (x + 5)^{2}$$

When $b$ is odd, the number is a fraction: $x^{2} - 3x + \\frac{9}{4} = \\left(x - \\frac{3}{2}\\right)^{2}$. The number added is never negative, even when $b$ is.

> **Watch out.** Both halving and squaring are needed. For $x^{2} + 10x$ the number is $25$, not $5$ (half without squaring), not $100$ (squaring without halving) and not $50$.`,
        `完全平方 $(x + p)^{2} = x^{2} + 2px + p^{2}$ 中，$x$ 的系数是 $2p$，常数是 $p^{2}$。所以要把 $x^{2} + bx$ 配成完全平方，取 $p$ 为 $b$ 的一半，加上 $p^{2}$，即 $x$ 的系数**一半**的平方：

$$x^{2} + 10x + \\left(\\frac{10}{2}\\right)^{2} = x^{2} + 10x + 25 = (x + 5)^{2}$$

当 $b$ 是奇数时，这个数是分数：$x^{2} - 3x + \\frac{9}{4} = \\left(x - \\frac{3}{2}\\right)^{2}$。即使 $b$ 是负数，加上的数也不是负数。

> **注意。** 既要取一半，又要平方。对 $x^{2} + 10x$，这个数是 $25$，不是 $5$（只取一半没有平方），不是 $100$（只平方没有取一半），也不是 $50$。`,
      ),
      generate(rng) {
        const b = rng.bool(0.7) ? 2 * rng.nonZero(-10, 10) : 2 * rng.int(-8, 7) + 1;
        const v = rng.pick(["x", "x", "y"]);
        const half = Q.of(b, 2);
        const answer = half.mul(half);
        const square = `${quad(1, b, answer, v)} = ${squareOf(half, v)}`;
        const expand = `${squareOf(half, v)} = ${v}^{2} + 2 \\cdot ${bare(half)} \\cdot ${v} + ${bare(half)}^{2} = ${quad(1, b, answer, v)}`;
        return numberProblem({
          prompt: t(
            `What number must be added to $${quad(1, b, 0, v)}$ to make a perfect square trinomial?`,
            `$${quad(1, b, 0, v)}$ 加上什么数才能成为完全平方三项式？`,
          ),
          answer,
          wrong: [half, half.abs(), Q.of(b * b), Q.of(b * b, 2), Q.of(b).abs()],
          solution: t(
            `**Step 1: Halve the coefficient of $${v}$.** A square $(${v} + p)^{2}$ has $2p$ as the coefficient of $${v}$, so here $p$ is half of $${b}$: $p = ${num(half)}$.

**Step 2: Square it.** The constant of the square is $p^{2} = ${bare(half)}^{2} = ${num(answer)}$, so that is the number to add:${steps(square)}**Check.** Expand the square:${steps(expand)}This is $${quad(1, b, 0, v)}$ with $${num(answer)}$ added.`,
            `**第一步：取 $${v}$ 的系数的一半。** 平方 $(${v} + p)^{2}$ 中 $${v}$ 的系数是 $2p$，所以这里 $p$ 是 $${b}$ 的一半：$p = ${num(half)}$。

**第二步：平方。** 平方的常数项是 $p^{2} = ${bare(half)}^{2} = ${num(answer)}$，这就是要加上的数：${steps(square)}**检验。** 展开这个平方：${steps(expand)}这正是 $${quad(1, b, 0, v)}$ 加上 $${num(answer)}$。`,
          ),
        });
      },
    },
    {
      id: "even-linear-term",
      title: t("Writing $x^{2} + bx + c$ as $(x + p)^{2} + q$", "把 $x^{2} + bx + c$ 写成 $(x + p)^{2} + q$"),
      explanation: t(
        `To **complete the square**, add the square of half the coefficient of $x$ to make a perfect square, and subtract the same number at once so that the value does not change. Then write the perfect square as a square and combine the constants:

$$x^{2} + 6x + 2 = (x^{2} + 6x + 9) - 9 + 2 = (x + 3)^{2} - 7$$

So $p = 3$ and $q = -7$. In general $p$ is half of $b$ and $q = c - p^{2}$. Squaring out checks it: $(x + 3)^{2} - 7 = x^{2} + 6x + 9 - 7 = x^{2} + 6x + 2$.

> **Watch out.** The number added must be taken away again: $(x + 3)^{2} + 2$ and $(x + 3)^{2} + 11$ are not equal to $x^{2} + 6x + 2$. And $p$ has the sign of $b$: $x^{2} - 6x$ completes to $(x - 3)^{2}$.`,
        `**配方**时，加上 $x$ 的系数一半的平方，凑成完全平方，同时减去这个数，使式子的值不变。然后把完全平方写成平方，再合并常数：

$$x^{2} + 6x + 2 = (x^{2} + 6x + 9) - 9 + 2 = (x + 3)^{2} - 7$$

所以 $p = 3$，$q = -7$。一般地，$p$ 是 $b$ 的一半，$q = c - p^{2}$。展开即可检验：$(x + 3)^{2} - 7 = x^{2} + 6x + 9 - 7 = x^{2} + 6x + 2$。

> **注意。** 加上的数必须再减去：$(x + 3)^{2} + 2$ 和 $(x + 3)^{2} + 11$ 都不等于 $x^{2} + 6x + 2$。另外，$p$ 与 $b$ 同号：$x^{2} - 6x$ 配成 $(x - 3)^{2}$。`,
      ),
      generate(rng) {
        const p = rng.nonZero(-9, 9);
        const c = rng.int(-15, 15);
        const q = c - p * p;
        const expr = quad(1, 2 * p, c);
        const work = [monicCompletion(2 * p, c), expansionCheck(1, Q.of(p), Q.of(q))];
        return pointProblem({
          prompt: pqPrompt(expr),
          answer: [p, q],
          vars: ["p", "q"],
          wrong: [
            [p, c + p * p],
            [-p, q],
            [2 * p, c - 4 * p * p],
            [p, c],
          ],
          solution: t(work.map((w) => w.en).join("\n\n"), work.map((w) => w["zh-CN"]).join("\n\n")),
        });
      },
    },
    {
      id: "odd-linear-term",
      title: t("Odd linear terms", "一次项系数为奇数"),
      explanation: t(
        `The method does not change when $b$ is odd: add and subtract the square of half the coefficient of $x$. Only the numbers become fractions, since $p = \\frac{b}{2}$ and $p^{2} = \\frac{b^{2}}{4}$:

$$x^{2} + 5x + 1 = \\left(x^{2} + 5x + \\frac{25}{4}\\right) - \\frac{25}{4} + 1 = \\left(x + \\frac{5}{2}\\right)^{2} - \\frac{21}{4}$$

To combine the constants, write $1 = \\frac{4}{4}$: $-\\frac{25}{4} + \\frac{4}{4} = -\\frac{21}{4}$.

> **Watch out.** Keep $p$ as the fraction $\\frac{5}{2}$; do not round it or use $5$ instead. And combine the constants over the common denominator $4$: $-\\frac{25}{4} + 1$ is $-\\frac{21}{4}$, not $-\\frac{24}{4}$.`,
        `$b$ 为奇数时方法不变：加上再减去 $x$ 的系数一半的平方。只是数变成了分数，因为 $p = \\frac{b}{2}$，$p^{2} = \\frac{b^{2}}{4}$：

$$x^{2} + 5x + 1 = \\left(x^{2} + 5x + \\frac{25}{4}\\right) - \\frac{25}{4} + 1 = \\left(x + \\frac{5}{2}\\right)^{2} - \\frac{21}{4}$$

合并常数时把 $1$ 写成 $\\frac{4}{4}$：$-\\frac{25}{4} + \\frac{4}{4} = -\\frac{21}{4}$。

> **注意。** $p$ 要保留为分数 $\\frac{5}{2}$，不要取近似，也不要用 $5$ 代替。合并常数时要通分成分母 $4$：$-\\frac{25}{4} + 1$ 等于 $-\\frac{21}{4}$，不是 $-\\frac{24}{4}$。`,
      ),
      keyPrerequisites: ["factoring-perfect-square-trinomials"],
      generate(rng) {
        const b = 2 * rng.int(-6, 5) + 1;
        const c = rng.int(-12, 12);
        const p = Q.of(b, 2);
        const p2 = p.mul(p);
        const q = Q.of(c).sub(p2);
        const expr = quad(1, b, c);
        const work = [monicCompletion(b, c), expansionCheck(1, p, q)];
        return pointProblem({
          prompt: pqPrompt(expr),
          answer: [p, q],
          vars: ["p", "q"],
          wrong: [
            [p, Q.of(c).add(p2)],
            [p.neg(), q],
            [Q.of(b), Q.of(c - b * b)],
            [p, Q.of(c)],
          ],
          solution: t(work.map((w) => w.en).join("\n\n"), work.map((w) => w["zh-CN"]).join("\n\n")),
        });
      },
    },
  ],
};

/** leadingCompletion writes the steps of completing the square of ax² + bx + c: take a out of the x terms, complete the square inside, then bring the subtracted number out multiplied by a; the check squares it out again. */
function leadingCompletion(a: number, b: number, c: number): { p: Q; q: Q; text: Text } {
  const p = Q.of(b, 2 * a);
  const p2 = p.mul(p);
  const out = p2.mul(Q.of(-a));
  const q = Q.of(c).add(out);
  const ba = Q.of(b, a);
  const take = `${quad(a, b, c)} = ${front(a)}\\left(${quad(1, ba, 0)}\\right)${tail(c)}`;
  const inside = `${quad(a, b, c)} = ${front(a)}\\left(${quad(1, ba, p2)} - ${num(p2)}\\right)${tail(c)}`;
  const outside = chain([`${quad(a, b, c)}`, `${front(a)}${squareOf(p)}${tail(out)}${tail(c)}`, completedForm(a, p, q)]);
  const half = halfSquared(ba);
  const work = [
    t(
      `**Step 1: Take $${a}$ out of the $x$ terms.** Factor $${a}$ out of $${quad(a, b, 0)}$${c === 0 ? "" : " only; the constant stays outside"}:${steps(take)}`,
      `**第一步：从含 $x$ 的项中提出 $${a}$。** ${c === 0 ? "" : "只"}从 $${quad(a, b, 0)}$ 中提出 $${a}$${c === 0 ? "" : "，常数项留在括号外"}：${steps(take)}`,
    ),
    t(
      `**Step 2: Complete the square inside.** In the parentheses, ${half.en}. Add it and take it away again:${steps(inside)}`,
      `**第二步：在括号内配方。** 括号内，${half["zh-CN"]}。加上它，再减去它：${steps(inside)}`,
    ),
    t(
      `**Step 3: Bring the subtracted number out.** The parentheses hold $${squareOf(p)} - ${num(p2)}$. Multiplying by $${a}$, the $-${num(p2)}$ inside becomes $${num(out)}$ outside${c === 0 ? "" : ", and it combines with the constant"}:${steps(outside)}So $p = ${num(p)}$ and $q = ${num(q)}$.`,
      `**第三步：把减去的数移出括号。** 括号内是 $${squareOf(p)} - ${num(p2)}$。乘以 $${a}$ 后，括号内的 $-${num(p2)}$ 在括号外变成 $${num(out)}$${c === 0 ? "" : "，再与常数项合并"}：${steps(outside)}所以 $p = ${num(p)}$，$q = ${num(q)}$。`,
    ),
    expansionCheck(a, p, q),
  ];
  return { p, q, text: t(work.map((w) => w.en).join("\n\n"), work.map((w) => w["zh-CN"]).join("\n\n")) };
}

export const completingTheSquareWithLeadingCoefficients: TopicDef = {
  id: "completing-the-square-with-leading-coefficients",
  title: t("Completing the Square With Leading Coefficients", "首项系数不为 1 的配方"),
  summary: t("Write $ax^{2} + bx + c$ as $a(x + p)^{2} + q$.", "把 $ax^{2} + bx + c$ 写成 $a(x + p)^{2} + q$ 的形式。"),
  prerequisites: ["completing-the-square"],
  encompasses: [{ topic: "completing-the-square", weight: 0.7 }],
  xp: 14,
  standards: ["CCSS.HSA.SSE.B.3.B"],
  intro: t(
    `We can complete the square of $x^{2} + bx + c$, writing it as $(x + p)^{2} + q$. A trinomial such as $2x^{2} + 12x + 5$ starts with $2x^{2}$, and no square $(x + p)^{2}$ does. The way around it is to take the $2$ out of the terms with $x$, complete the square inside the parentheses, and keep track of what the $2$ does to the number we take away:

$$2x^{2} + 12x + 5 = 2(x^{2} + 6x) + 5 = 2(x^{2} + 6x + 9 - 9) + 5 = 2(x + 3)^{2} - 18 + 5 = 2(x + 3)^{2} - 13$$

The result $a(x + p)^{2} + q$ shows the same things as before: $2(x + 3)^{2}$ is never negative, so $2x^{2} + 12x + 5$ is never less than $-13$, and it is $-13$ exactly when $x = -3$. In this lesson we complete the square with a leading coefficient, including when $p$ is a fraction and when the leading coefficient is negative.`,
    `我们会给 $x^{2} + bx + c$ 配方，把它写成 $(x + p)^{2} + q$。像 $2x^{2} + 12x + 5$ 这样的三项式以 $2x^{2}$ 开头，而任何 $(x + p)^{2}$ 都不是这样。办法是：从含 $x$ 的项中提出 $2$，在括号内配方，并注意 $2$ 对减去的数有什么影响：

$$2x^{2} + 12x + 5 = 2(x^{2} + 6x) + 5 = 2(x^{2} + 6x + 9 - 9) + 5 = 2(x + 3)^{2} - 18 + 5 = 2(x + 3)^{2} - 13$$

结果 $a(x + p)^{2} + q$ 告诉我们的东西和以前一样：$2(x + 3)^{2}$ 永远不是负数，所以 $2x^{2} + 12x + 5$ 永远不小于 $-13$，并且恰好在 $x = -3$ 时等于 $-13$。这节课我们给首项系数不为 $1$ 的三项式配方，包括 $p$ 是分数和首项系数为负的情形。`,
  ),
  knowledgePoints: [
    {
      id: "a-divides-b",
      title: t("Factoring out the leading coefficient", "提出首项系数"),
      explanation: t(
        `Factor the leading coefficient out of the $x^{2}$ and $x$ terms only, and complete the square inside the parentheses. The number subtracted inside is multiplied by the leading coefficient when it comes out, because the leading coefficient multiplies everything in the parentheses:

$$2x^{2} + 12x + 5 = 2(x^{2} + 6x + 9 - 9) + 5 = 2(x + 3)^{2} - 18 + 5 = 2(x + 3)^{2} - 13$$

Check by squaring out: $2(x + 3)^{2} - 13 = 2x^{2} + 12x + 18 - 13 = 2x^{2} + 12x + 5$.

> **Watch out.** The $-9$ inside is $-18$ outside. Bringing it out as $-9$ gives $2(x + 3)^{2} - 4$, which squares out to $2x^{2} + 12x + 14$, not the expression we started with.`,
        `只从 $x^{2}$ 项和 $x$ 项中提出首项系数，在括号内配方。括号内减去的数移出括号时要乘以首项系数，因为首项系数乘的是括号里的全部：

$$2x^{2} + 12x + 5 = 2(x^{2} + 6x + 9 - 9) + 5 = 2(x + 3)^{2} - 18 + 5 = 2(x + 3)^{2} - 13$$

展开检验：$2(x + 3)^{2} - 13 = 2x^{2} + 12x + 18 - 13 = 2x^{2} + 12x + 5$。

> **注意。** 括号内的 $-9$ 到括号外是 $-18$。如果移出来还写 $-9$，得到 $2(x + 3)^{2} - 4$，展开是 $2x^{2} + 12x + 14$，不是原来的式子。`,
      ),
      generate(rng) {
        const a = rng.int(2, 5);
        const p0 = rng.nonZero(-6, 6);
        const c = rng.int(-20, 20);
        const b = 2 * a * p0;
        const { p, q, text } = leadingCompletion(a, b, c);
        return pointProblem({
          prompt: pqPrompt(quad(a, b, c), a),
          answer: [p, q],
          vars: ["p", "q"],
          wrong: [
            [p, Q.of(c - p0 * p0)],
            [Q.of(2 * p0), Q.of(c - 4 * a * p0 * p0)],
            [p.neg(), q],
            [Q.of(a * p0), Q.of(c - a * a * p0 * p0)],
          ],
          solution: text,
        });
      },
    },
    {
      id: "fractions",
      title: t("Fractions inside the square", "平方内出现分数"),
      explanation: t(
        `After the leading coefficient $a$ is taken out, the coefficient of $x$ inside is $\\frac{b}{a}$, so $p$ is half of it: $p = \\frac{b}{2a}$. When $a$ does not divide $b$ evenly, $p$ is a fraction:

$$2x^{2} + 6x + 1 = 2(x^{2} + 3x) + 1 = 2\\left(x^{2} + 3x + \\frac{9}{4} - \\frac{9}{4}\\right) + 1 = 2\\left(x + \\frac{3}{2}\\right)^{2} - \\frac{9}{2} + 1 = 2\\left(x + \\frac{3}{2}\\right)^{2} - \\frac{7}{2}$$

Check by squaring out: $2\\left(x^{2} + 3x + \\frac{9}{4}\\right) - \\frac{7}{2} = 2x^{2} + 6x + \\frac{9}{2} - \\frac{7}{2} = 2x^{2} + 6x + 1$.

> **Watch out.** Halve the coefficient of $x$ inside the parentheses, $3$, not the original $6$: $p = \\frac{3}{2}$, not $3$. And the $-\\frac{9}{4}$ inside still comes out multiplied by $2$.`,
        `提出首项系数 $a$ 后，括号内 $x$ 的系数是 $\\frac{b}{a}$，$p$ 是它的一半：$p = \\frac{b}{2a}$。当 $a$ 不能整除 $b$ 时，$p$ 是分数：

$$2x^{2} + 6x + 1 = 2(x^{2} + 3x) + 1 = 2\\left(x^{2} + 3x + \\frac{9}{4} - \\frac{9}{4}\\right) + 1 = 2\\left(x + \\frac{3}{2}\\right)^{2} - \\frac{9}{2} + 1 = 2\\left(x + \\frac{3}{2}\\right)^{2} - \\frac{7}{2}$$

展开检验：$2\\left(x^{2} + 3x + \\frac{9}{4}\\right) - \\frac{7}{2} = 2x^{2} + 6x + \\frac{9}{2} - \\frac{7}{2} = 2x^{2} + 6x + 1$。

> **注意。** 取一半的是括号内 $x$ 的系数 $3$，而不是原来的 $6$：$p = \\frac{3}{2}$，不是 $3$。括号内的 $-\\frac{9}{4}$ 移出来时同样要乘以 $2$。`,
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.int(2, 5);
          b = rng.nonZero(-12, 12);
        } while (b % (2 * a) === 0);
        const c = rng.int(-9, 9);
        const { p, q, text } = leadingCompletion(a, b, c);
        return pointProblem({
          prompt: pqPrompt(quad(a, b, c), a),
          answer: [p, q],
          vars: ["p", "q"],
          wrong: [
            [p, Q.of(c).sub(p.mul(p))],
            [Q.of(b, 2), Q.of(c).sub(Q.of(a * b * b, 4))],
            [p.neg(), q],
            [p, Q.of(c).add(p.mul(p).mul(Q.of(a)))],
          ],
          solution: text,
        });
      },
    },
    {
      id: "negative-leading-coefficient",
      title: t("A negative leading coefficient", "首项系数为负"),
      explanation: t(
        `With a negative leading coefficient, factor out the negative number itself, so that the square inside starts with $x^{2}$. The number subtracted inside is then multiplied by a negative number on its way out, so it is **added** outside:

$$-x^{2} + 6x - 2 = -(x^{2} - 6x) - 2 = -(x^{2} - 6x + 9 - 9) - 2 = -(x - 3)^{2} + 9 - 2 = -(x - 3)^{2} + 7$$

Check by squaring out: $-(x^{2} - 6x + 9) + 7 = -x^{2} + 6x - 9 + 7 = -x^{2} + 6x - 2$.

> **Watch out.** Taking out $-1$ changes the sign of the $x$ term inside: $-x^{2} + 6x = -(x^{2} - 6x)$, so $p = -3$. And $-(\\dots - 9)$ gives $+9$ outside, not $-9$.`,
        `首项系数为负时，就提出这个负数本身，使括号内的平方以 $x^{2}$ 开头。括号内减去的数移出时要乘以一个负数，所以在括号外变成**加上**：

$$-x^{2} + 6x - 2 = -(x^{2} - 6x) - 2 = -(x^{2} - 6x + 9 - 9) - 2 = -(x - 3)^{2} + 9 - 2 = -(x - 3)^{2} + 7$$

展开检验：$-(x^{2} - 6x + 9) + 7 = -x^{2} + 6x - 9 + 7 = -x^{2} + 6x - 2$。

> **注意。** 提出 $-1$ 会改变括号内 $x$ 项的符号：$-x^{2} + 6x = -(x^{2} - 6x)$，所以 $p = -3$。而 $-(\\dots - 9)$ 在括号外得到 $+9$，不是 $-9$。`,
      ),
      generate(rng) {
        const a = rng.pick([-1, -1, -2, -3]);
        const b = a === -1 ? 2 * rng.nonZero(-7, 7) : rng.nonZero(-12, 12);
        const c = rng.int(-12, 12);
        const { p, q, text } = leadingCompletion(a, b, c);
        const ap2 = p.mul(p).mul(Q.of(-a));
        return pointProblem({
          prompt: pqPrompt(quad(a, b, c), a),
          answer: [p, q],
          vars: ["p", "q"],
          wrong: [
            [p, Q.of(c).sub(ap2)],
            [p.neg(), q],
            [Q.of(-b, 2), Q.of(c).add(Q.of(b * b, 4))],
          ],
          solution: text,
        });
      },
    },
  ],
};

/** Step is one titled step of a worked solution, in both locales. */
interface Step {
  readonly title: Text;
  readonly body: Text;
}

/** worked numbers the steps of a solution, "**Step 1: Title.** Body", and joins them with the paragraphs that follow, such as a check. */
function worked(list: readonly Step[], after: readonly (Text | undefined)[] = []): Text {
  const zh = ["一", "二", "三", "四", "五", "六"];
  const parts = list.map((s, i) =>
    t(`**Step ${i + 1}: ${s.title.en}.** ${s.body.en}`, `**第${zh[i]}步：${s.title["zh-CN"]}。**${s.body["zh-CN"]}`),
  );
  const all = [...parts, ...after.filter((x): x is Text => x !== undefined)];
  return t(all.map((w) => w.en).join("\n\n"), all.map((w) => w["zh-CN"]).join("\n\n"));
}

/** cap capitalizes the first letter of an English phrase. */
const cap = (s: string) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`;

/** completingSteps writes the steps of solving x² + Bx + C = 0 by completing the square: move C, add the square of half of B to both sides, take square roots. The first step is left out when C is already on the right. */
function completingSteps(B: Q, C: Q, moved = false): { list: Step[]; values: string[] } {
  const h = B.div(Q.of(2));
  const P = h.mul(h);
  const k = P.sub(C);
  const list: Step[] = [];
  if (!moved && !C.isZero()) {
    const undo = undoConstant(C);
    list.push({
      title: t("Move the constant to the right", "把常数项移到右边"),
      body: t(
        `${cap(undo.en)}:${steps(`${quad(1, B, 0)} = ${num(C.neg())}`)}`,
        `${undo["zh-CN"]}：${steps(`${quad(1, B, 0)} = ${num(C.neg())}`)}`,
      ),
    });
  }
  const half = halfSquared(B);
  const lines = [`${quad(1, B, P)} = ${signed([C.neg(), P])}`, `${squareOf(h)} = ${num(k)}`];
  list.push({
    title: t("Complete the square", "配方"),
    body: t(
      `${cap(half.en)}. Add $${num(P)}$ to both sides, so that the left side becomes a perfect square:${steps(...lines)}`,
      `${half["zh-CN"]}。两边同时加上 $${num(P)}$，使左边成为完全平方：${steps(...lines)}`,
    ),
  });
  const root = k.sign() < 0 ? sqrtSurd(Q.zero) : sqrtSurd(k);
  const values = k.sign() < 0 ? [] : pm(h.neg(), root);
  const undoH = undoConstant(h);
  const roots =
    k.sign() < 0
      ? t(
          `A square is never negative, but the right side is $${num(k)}$. No real number $x$ makes this true, so there is no real solution.`,
          `平方永远不是负数，而右边是 $${num(k)}$。没有实数 $x$ 能使它成立，所以没有实数解。`,
        )
      : k.isZero()
        ? t(
            `A square is $0$ only when the number squared is $0$:${steps(`${linear(1, h)} = 0`, `x = ${num(h.neg())}`)}So ${solved(values).en}.`,
            `平方为 $0$ 当且仅当被平方的数为 $0$：${steps(`${linear(1, h)} = 0`, `x = ${num(h.neg())}`)}所以 ${solved(values)["zh-CN"]}。`,
          )
        : t(
            `$${linear(1, h)}$ is a number whose square is $${num(k)}$, so it is one of the two square roots of $${num(k)}$. Then ${undoH.en}:${steps(`${linear(1, h)} = ${rootsOfK(k, root)}`, `x = ${pmLatex(h.neg(), root)}`)}So ${solved(values).en}.`,
            `$${linear(1, h)}$ 的平方是 $${num(k)}$，所以它是 $${num(k)}$ 的两个平方根之一。再${undoH["zh-CN"]}：${steps(`${linear(1, h)} = ${rootsOfK(k, root)}`, `x = ${pmLatex(h.neg(), root)}`)}所以 ${solved(values)["zh-CN"]}。`,
          );
  list.push({ title: t("Take square roots", "开平方"), body: roots });
  return { list, values };
}

export const solvingQuadraticEquationsByCompletingTheSquare: TopicDef = {
  id: "solving-quadratic-equations-by-completing-the-square",
  title: t("Solving Quadratic Equations by Completing the Square", "用配方法解一元二次方程"),
  summary: t("Solve $x^{2} + bx + c = 0$ by rewriting it as $(x + p)^{2} = k$.", "把 $x^{2} + bx + c = 0$ 化为 $(x + p)^{2} = k$ 来求解。"),
  prerequisites: ["completing-the-square", "solving-perfect-square-quadratic-equations"],
  encompasses: [
    { topic: "completing-the-square", weight: 0.6 },
    { topic: "solving-perfect-square-quadratic-equations", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.4.A", "CCSS.HSA.REI.B.4.B"],
  intro: t(
    `We can solve a perfect square equation such as $(x + 3)^{2} = 11$ by taking square roots, $x + 3 = \\pm\\sqrt{11}$, and we can complete the square of $x^{2} + bx$. Together they solve **every** quadratic equation, including the many that do not factor.

Take $x^{2} + 6x - 2 = 0$. No two integers have product $-2$ and sum $6$, so factoring does not help. Instead, move the constant to the right and add $9$, the number that completes the square of $x^{2} + 6x$, to both sides:

$$x^{2} + 6x = 2 \\Rightarrow x^{2} + 6x + 9 = 11 \\Rightarrow (x + 3)^{2} = 11$$

Now it is a perfect square equation: $x + 3 = \\pm\\sqrt{11}$, so $x = -3 + \\sqrt{11}$ or $x = -3 - \\sqrt{11}$. In this lesson we solve equations $x^{2} + bx + c = 0$ this way, with even and odd $b$, and see how it shows when there is no real solution.`,
    `我们会用开平方法解 $(x + 3)^{2} = 11$ 这样的完全平方型方程：$x + 3 = \\pm\\sqrt{11}$；也会给 $x^{2} + bx$ 配方。两者结合，就能解**所有**一元二次方程，包括许多不能分解因式的方程。

看 $x^{2} + 6x - 2 = 0$。没有两个整数的积是 $-2$、和是 $6$，所以分解因式行不通。改为把常数项移到右边，再在两边都加上 $9$，即给 $x^{2} + 6x$ 配方所需的数：

$$x^{2} + 6x = 2 \\Rightarrow x^{2} + 6x + 9 = 11 \\Rightarrow (x + 3)^{2} = 11$$

现在它是完全平方型方程：$x + 3 = \\pm\\sqrt{11}$，所以 $x = -3 + \\sqrt{11}$ 或 $x = -3 - \\sqrt{11}$。这节课我们用这种方法解 $x^{2} + bx + c = 0$，包括 $b$ 为偶数和奇数的情形，并看到没有实数解时它怎样显示出来。`,
  ),
  knowledgePoints: [
    {
      id: "even-linear-term",
      title: t("Even coefficients of $x$", "$x$ 的系数为偶数"),
      explanation: t(
        `Completing the square turns any quadratic equation into a perfect square equation. Move the constant to the right, then add the square of half the coefficient of $x$ to **both** sides, which keeps the equation true and makes the left side a perfect square. Then take square roots:

$$x^{2} + 6x - 2 = 0 \\Rightarrow x^{2} + 6x = 2 \\Rightarrow x^{2} + 6x + 9 = 11 \\Rightarrow (x + 3)^{2} = 11 \\Rightarrow x = -3 \\pm \\sqrt{11}$$

Check by going back: $(x + 3)^{2} = 11$ expands to $x^{2} + 6x + 9 = 11$, that is, $x^{2} + 6x - 2 = 0$.

> **Watch out.** Moving the constant changes its sign: $-2$ on the left is $2$ on the right, so the right side is $2 + 9 = 11$, not $-2 + 9 = 7$. And $x + 3 = \\pm\\sqrt{11}$ gives $x = -3 \\pm \\sqrt{11}$: both signs, and $-3$, not $3$.`,
        `配方能把任何一元二次方程化为完全平方型方程。把常数项移到右边，再在**两边**都加上 $x$ 的系数一半的平方：等式仍然成立，左边成为完全平方。然后开平方：

$$x^{2} + 6x - 2 = 0 \\Rightarrow x^{2} + 6x = 2 \\Rightarrow x^{2} + 6x + 9 = 11 \\Rightarrow (x + 3)^{2} = 11 \\Rightarrow x = -3 \\pm \\sqrt{11}$$

倒推检验：$(x + 3)^{2} = 11$ 展开是 $x^{2} + 6x + 9 = 11$，即 $x^{2} + 6x - 2 = 0$。

> **注意。** 常数项移项要变号：左边的 $-2$ 到右边是 $2$，所以右边是 $2 + 9 = 11$，不是 $-2 + 9 = 7$。而 $x + 3 = \\pm\\sqrt{11}$ 给出 $x = -3 \\pm \\sqrt{11}$：两个符号都要，而且是 $-3$，不是 $3$。`,
      ),
      generate(rng) {
        const p = rng.nonZero(-8, 8);
        let k: number;
        do k = rng.int(1, 40);
        while (k === p * p || (isSquare(k) && rng.bool(0.6)));
        const c = p * p - k;
        const values = pm(Q.of(-p), sqrtSurd(Q.of(k)));
        const slip = p * p + c;
        const { list } = completingSteps(Q.of(2 * p), Q.of(c));
        return solutionsProblem({
          prompt: solvePrompt(`${quad(1, 2 * p, c)} = 0`, byCompleting),
          values,
          wrong: [pm(Q.of(p), sqrtSurd(Q.of(k))), [values[0]!], ...(slip > 0 ? [pm(Q.of(-p), sqrtSurd(Q.of(slip)))] : [])],
          solution: worked(list, [checked(1, 2 * p, c)]),
        });
      },
    },
    {
      id: "odd-linear-term",
      title: t("Odd coefficients of $x$", "$x$ 的系数为奇数"),
      explanation: t(
        `With an odd coefficient of $x$ the method is the same, but half of it is a fraction, and so is the number added. Write the right side over $4$, then take the square root of the top and the bottom:

$$x^{2} + 3x - 1 = 0 \\Rightarrow x^{2} + 3x + \\frac{9}{4} = 1 + \\frac{9}{4} \\Rightarrow \\left(x + \\frac{3}{2}\\right)^{2} = \\frac{13}{4}$$

$$x + \\frac{3}{2} = \\pm\\frac{\\sqrt{13}}{2} \\Rightarrow x = \\frac{-3 \\pm \\sqrt{13}}{2}$$

> **Watch out.** The root of $\\frac{13}{4}$ is $\\frac{\\sqrt{13}}{2}$: the $4$ becomes $2$, so the solutions are over $2$. And the centre is $-\\frac{3}{2}$, the opposite of the number in $x + \\frac{3}{2}$, not $\\frac{3}{2}$ and not $-3$.`,
        `$x$ 的系数为奇数时方法相同，只是它的一半是分数，加上的数也是分数。把右边写成分母为 $4$ 的分数，再对分子、分母分别开平方：

$$x^{2} + 3x - 1 = 0 \\Rightarrow x^{2} + 3x + \\frac{9}{4} = 1 + \\frac{9}{4} \\Rightarrow \\left(x + \\frac{3}{2}\\right)^{2} = \\frac{13}{4}$$

$$x + \\frac{3}{2} = \\pm\\frac{\\sqrt{13}}{2} \\Rightarrow x = \\frac{-3 \\pm \\sqrt{13}}{2}$$

> **注意。** $\\frac{13}{4}$ 的平方根是 $\\frac{\\sqrt{13}}{2}$：$4$ 变成 $2$，所以解的分母是 $2$。中心是 $-\\frac{3}{2}$，与 $x + \\frac{3}{2}$ 中的数相反，不是 $\\frac{3}{2}$，也不是 $-3$。`,
      ),
      generate(rng) {
        let b: number;
        let c: number;
        do {
          b = 2 * rng.int(-6, 5) + 1;
          c = rng.int(-15, 6);
        } while (b * b - 4 * c <= 0);
        const d = b * b - 4 * c;
        const values = rootsOf(1, b, c);
        const { list } = completingSteps(Q.of(b), Q.of(c));
        return solutionsProblem({
          prompt: solvePrompt(`${quad(1, b, c)} = 0`, byCompleting),
          values,
          wrong: [pm(Q.of(b, 2), sqrtSurd(Q.of(d, 4))), pm(Q.of(-b), sqrtSurd(Q.of(d))), [values[0]!]],
          solution: worked(list, [checked(1, b, c)]),
        });
      },
    },
    {
      id: "rearranging-and-no-solution",
      title: t("Rearranging, and equations with no solution", "移项与无解的方程"),
      explanation: t(
        `If the equation is not in standard form, first collect the terms so that $x^{2} + bx$ is alone on the left and the constant on the right. Then complete the square as usual. The number left on the right decides everything: a square can be any number that is not negative, so a positive number gives two solutions, and a negative one gives none:

$$x^{2} - 4x + 7 = 0 \\Rightarrow x^{2} - 4x + 4 = -7 + 4 \\Rightarrow (x - 2)^{2} = -3$$

No real number squared is $-3$, so this equation has no real solution.

> **Watch out.** Do not drop the minus sign of $-3$ and write $x = 2 \\pm \\sqrt{3}$: those numbers give $(x - 2)^{2} = 3$. And when the right side is positive, there are always two solutions.`,
        `如果方程不是一般形式，先整理各项，使 $x^{2} + bx$ 单独在左边，常数在右边。然后照常配方。右边剩下的数决定一切：平方可以是任何非负数，所以右边为正时有两个解，为负时没有解：

$$x^{2} - 4x + 7 = 0 \\Rightarrow x^{2} - 4x + 4 = -7 + 4 \\Rightarrow (x - 2)^{2} = -3$$

没有实数的平方等于 $-3$，所以这个方程没有实数解。

> **注意。** 不要丢掉 $-3$ 的负号而写成 $x = 2 \\pm \\sqrt{3}$：这两个数满足的是 $(x - 2)^{2} = 3$。右边为正数时，总是有两个解。`,
      ),
      generate(rng) {
        const p = rng.nonZero(-8, 8);
        const none = rng.bool(0.4);
        let k: number;
        do k = none ? -rng.int(1, 20) : rng.int(1, 40);
        while (k === p * p);
        const c = p * p - k;
        const kind = rng.pick(["move", "both-sides"] as const);
        const extra = rng.nonZero(-6, 6);
        const eq = kind === "move" ? `${quad(1, 2 * p, 0)} = ${-c}` : `${quad(1, 2 * p + extra, c)} = ${poly([extra, "x"])}`;
        const values = none ? [] : pm(Q.of(-p), sqrtSurd(Q.of(k)));
        const { list } = completingSteps(Q.of(2 * p), Q.of(c), kind === "move");
        const ex = poly([Math.abs(extra), "x"]);
        const lead: Step[] =
          kind === "move"
            ? []
            : [
                {
                  title: t("Collect the $x$ terms on the left", "把含 $x$ 的项集中到左边"),
                  body: t(
                    `${extra > 0 ? `Subtract $${ex}$ from` : `Add $${ex}$ to`} both sides:${steps(`${quad(1, 2 * p, c)} = 0`)}`,
                    `两边同时${extra > 0 ? "减去" : "加上"} $${ex}$：${steps(`${quad(1, 2 * p, c)} = 0`)}`,
                  ),
                },
              ];
        const back =
          kind === "move"
            ? t(`Moving $${c}$ back to the right gives $${eq}$, the original equation.`, `把 $${c}$ 移回右边，得 $${eq}$，正是原方程。`)
            : t(
                `${extra > 0 ? "Adding" : "Subtracting"} $${ex}$ ${extra > 0 ? "to" : "from"} both sides gives $${eq}$, the original equation.`,
                `两边同时${extra > 0 ? "加上" : "减去"} $${ex}$，得 $${eq}$，正是原方程。`,
              );
        return solutionsProblem({
          prompt: solvePrompt(eq, byCompleting),
          values,
          wrong: none ? [pm(Q.of(-p), sqrtSurd(Q.of(-k)))] : [[], pm(Q.of(p), sqrtSurd(Q.of(k)))],
          solution: worked([...lead, ...list], [checked(1, 2 * p, c, "x", back)]),
        });
      },
    },
  ],
};

/** leadingSolution writes the steps of solving ax² + bx + c = 0 by dividing by a and completing the square, then checks the solutions. */
function leadingSolution(a: number, b: number, c: number): Text {
  const B = Q.of(b, a);
  const C = Q.of(c, a);
  const line = `${quad(1, B, C)} = 0`;
  const divide: Step = {
    title: t(`Divide by $${a}$`, `两边同时除以 $${a}$`),
    body: t(
      `Completing the square needs $x^{2}$ on its own, and dividing both sides by $${a}$ does not change the solutions. Divide every term by $${a}$:${steps(line)}`,
      `配方需要 $x^{2}$ 的系数为 $1$，而两边同时除以 $${a}$ 不改变方程的解。每一项都除以 $${a}$：${steps(line)}`,
    ),
  };
  const { list } = completingSteps(B, C);
  return worked([divide, ...list], [checked(a, b, c)]);
}

/** drawPositiveDiscriminant draws ax² + bx + c with gcd(a, b, c) = 1 and b² − 4ac > 0, mostly not a perfect square. */
function drawPositiveDiscriminant(rng: Rng, as: readonly number[]): [number, number, number] {
  let a: number;
  let b: number;
  let c: number;
  do {
    a = rng.pick(as);
    b = rng.nonZero(-10, 10);
    c = rng.nonZero(-10, 10);
  } while (gcd(gcd(a, b), c) !== 1 || b * b - 4 * a * c <= 0 || (isSquare(b * b - 4 * a * c) && rng.bool(0.7)));
  return [a, b, c];
}

export const solvingQuadraticEquationsWithLeadingCoefficientsByCompletingTheSquare: TopicDef = {
  id: "solving-quadratic-equations-with-leading-coefficients-by-completing-the-square",
  title: t("Solving Quadratic Equations With Leading Coefficients by Completing the Square", "用配方法解首项系数不为 1 的一元二次方程"),
  summary: t(
    "Solve $ax^{2} + bx + c = 0$ by dividing by $a$ and completing the square.",
    "两边除以 $a$ 后配方，解 $ax^{2} + bx + c = 0$。",
  ),
  prerequisites: ["solving-quadratic-equations-by-completing-the-square", "completing-the-square-with-leading-coefficients"],
  encompasses: [{ topic: "solving-quadratic-equations-by-completing-the-square", weight: 0.7 }],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.4.A", "CCSS.HSA.REI.B.4.B"],
  intro: t(
    `We can solve $x^{2} + bx + c = 0$ by completing the square. An equation such as $3x^{2} - 12x + 6 = 0$ starts with $3x^{2}$ instead. In an **equation**, unlike an expression, there is a short way around it: dividing both sides by the same nonzero number does not change which values of $x$ make it true. So divide by $3$ first:

$$3x^{2} - 12x + 6 = 0 \\Rightarrow x^{2} - 4x + 2 = 0$$

Then complete the square as before: $x^{2} - 4x = -2$, so $x^{2} - 4x + 4 = 2$, that is, $(x - 2)^{2} = 2$, and $x = 2 \\pm \\sqrt{2}$. In this lesson we solve equations with a leading coefficient this way, including when dividing gives fractions and when the leading coefficient is negative.`,
    `我们会用配方法解 $x^{2} + bx + c = 0$。像 $3x^{2} - 12x + 6 = 0$ 这样的方程却以 $3x^{2}$ 开头。与式子不同，**方程**有一条捷径：两边同时除以同一个非零数，使等式成立的 $x$ 不变。所以先除以 $3$：

$$3x^{2} - 12x + 6 = 0 \\Rightarrow x^{2} - 4x + 2 = 0$$

然后像以前一样配方：$x^{2} - 4x = -2$，所以 $x^{2} - 4x + 4 = 2$，即 $(x - 2)^{2} = 2$，$x = 2 \\pm \\sqrt{2}$。这节课我们用这种方法解首项系数不为 $1$ 的方程，包括相除后出现分数和首项系数为负的情形。`,
  ),
  knowledgePoints: [
    {
      id: "a-divides-every-coefficient",
      title: t("Dividing by the leading coefficient", "两边除以首项系数"),
      explanation: t(
        `Completing the square needs $x^{2}$ with coefficient $1$. Dividing both sides of an equation by the same nonzero number does not change its solutions, so divide by the leading coefficient first and then complete the square:

$$3x^{2} - 12x + 6 = 0 \\Rightarrow x^{2} - 4x + 2 = 0 \\Rightarrow (x - 2)^{2} = 2 \\Rightarrow x = 2 \\pm \\sqrt{2}$$

Check by going back: $(x - 2)^{2} = 2$ expands to $x^{2} - 4x + 2 = 0$, and multiplying by $3$ gives the original equation.

> **Watch out.** Divide **every** term, the constant included: $3x^{2} - 12x + 6 = 0$ becomes $x^{2} - 4x + 2 = 0$, not $x^{2} - 4x + 6 = 0$. Leaving a coefficient undivided changes the solutions.`,
        `配方需要 $x^{2}$ 的系数为 $1$。方程两边同时除以同一个非零数，解不变，所以先除以首项系数，再配方：

$$3x^{2} - 12x + 6 = 0 \\Rightarrow x^{2} - 4x + 2 = 0 \\Rightarrow (x - 2)^{2} = 2 \\Rightarrow x = 2 \\pm \\sqrt{2}$$

倒推检验：$(x - 2)^{2} = 2$ 展开是 $x^{2} - 4x + 2 = 0$，再乘以 $3$ 就得到原方程。

> **注意。** **每一项**都要除，包括常数项：$3x^{2} - 12x + 6 = 0$ 化为 $x^{2} - 4x + 2 = 0$，而不是 $x^{2} - 4x + 6 = 0$。漏除任何一个系数，解就变了。`,
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5, -2, -3]);
        const p = rng.nonZero(-6, 6);
        let k: number;
        do k = rng.int(1, 30);
        while (k === p * p || isSquare(k));
        const c = p * p - k;
        const values = pm(Q.of(-p), sqrtSurd(Q.of(k)));
        const slip = p * p - a * c;
        return solutionsProblem({
          prompt: solvePrompt(`${quad(a, 2 * a * p, a * c)} = 0`, byCompleting),
          values,
          wrong: [
            ...(slip > 0 ? [pm(Q.of(-p), sqrtSurd(Q.of(slip)))] : []),
            pm(Q.of(p), sqrtSurd(Q.of(k))),
            pm(Q.of(-a * p), sqrtSurd(Q.of(a * a * p * p - a * a * c))),
          ],
          solution: leadingSolution(a, 2 * a * p, a * c),
        });
      },
    },
    {
      id: "fractions",
      title: t("Fractional coefficients after dividing", "除后出现分数系数"),
      explanation: t(
        `When the leading coefficient does not divide the other coefficients, dividing gives fractions. Keep them exact, and complete the square with them as with any number: half of $\\frac{b}{a}$ is $\\frac{b}{2a}$.

$$2x^{2} + 6x - 1 = 0 \\Rightarrow x^{2} + 3x = \\frac{1}{2} \\Rightarrow \\left(x + \\frac{3}{2}\\right)^{2} = \\frac{1}{2} + \\frac{9}{4} = \\frac{11}{4}$$

$$x = -\\frac{3}{2} \\pm \\frac{\\sqrt{11}}{2} = \\frac{-3 \\pm \\sqrt{11}}{2}$$

> **Watch out.** The number in the square is half of the coefficient after dividing: half of $3$ is $\\frac{3}{2}$. Forgetting to halve gives $x = -3 \\pm \\dots$, and using half of the original $6$ gives $x + 3$, both wrong.`,
        `当首项系数不能整除其他系数时，相除会得到分数。要保持精确，并像对待任何数一样用它们配方：$\\frac{b}{a}$ 的一半是 $\\frac{b}{2a}$。

$$2x^{2} + 6x - 1 = 0 \\Rightarrow x^{2} + 3x = \\frac{1}{2} \\Rightarrow \\left(x + \\frac{3}{2}\\right)^{2} = \\frac{1}{2} + \\frac{9}{4} = \\frac{11}{4}$$

$$x = -\\frac{3}{2} \\pm \\frac{\\sqrt{11}}{2} = \\frac{-3 \\pm \\sqrt{11}}{2}$$

> **注意。** 平方中的数是相除之后 $x$ 的系数的一半：$3$ 的一半是 $\\frac{3}{2}$。忘了取一半会得到 $x = -3 \\pm \\dots$，用原来的 $6$ 取一半会得到 $x + 3$，都是错的。`,
      ),
      generate(rng) {
        const [a, b, c] = drawPositiveDiscriminant(rng, [2, 3, 4, 5]);
        const d = b * b - 4 * a * c;
        const values = rootsOf(a, b, c);
        return solutionsProblem({
          prompt: solvePrompt(`${quad(a, b, c)} = 0`, byCompleting),
          values,
          wrong: [pm(Q.of(-b, a), sqrtSurd(Q.of(d, a * a))), pm(Q.of(b, 2 * a), sqrtSurd(Q.of(d, 4 * a * a))), [values[0]!]],
          solution: leadingSolution(a, b, c),
        });
      },
    },
    {
      id: "negative-leading-coefficient",
      title: t("A negative leading coefficient", "首项系数为负"),
      explanation: t(
        `A negative leading coefficient is handled the same way: divide every term by it. Dividing by a negative number changes the sign of every term, and then the square is completed as usual:

$$-x^{2} + 4x + 1 = 0 \\Rightarrow x^{2} - 4x - 1 = 0 \\Rightarrow (x - 2)^{2} = 5 \\Rightarrow x = 2 \\pm \\sqrt{5}$$

Check by going back: $(x - 2)^{2} = 5$ expands to $x^{2} - 4x - 1 = 0$, and multiplying by $-1$ gives $-x^{2} + 4x + 1 = 0$.

> **Watch out.** Every sign changes, not only the sign of $x^{2}$: $-x^{2} + 4x + 1 = 0$ becomes $x^{2} - 4x - 1 = 0$. Writing $x^{2} + 4x + 1 = 0$ solves a different equation.`,
        `首项系数为负时方法相同：每一项都除以它。除以负数会改变每一项的符号，然后照常配方：

$$-x^{2} + 4x + 1 = 0 \\Rightarrow x^{2} - 4x - 1 = 0 \\Rightarrow (x - 2)^{2} = 5 \\Rightarrow x = 2 \\pm \\sqrt{5}$$

倒推检验：$(x - 2)^{2} = 5$ 展开是 $x^{2} - 4x - 1 = 0$，再乘以 $-1$ 得 $-x^{2} + 4x + 1 = 0$。

> **注意。** 每一项的符号都要变，而不只是 $x^{2}$ 的符号：$-x^{2} + 4x + 1 = 0$ 化为 $x^{2} - 4x - 1 = 0$。写成 $x^{2} + 4x + 1 = 0$ 就是在解另一个方程了。`,
      ),
      generate(rng) {
        const [a, b, c] = drawPositiveDiscriminant(rng, [-1, -1, -2, -3]);
        const d = b * b - 4 * a * c;
        const values = rootsOf(a, b, c);
        return solutionsProblem({
          prompt: solvePrompt(`${quad(a, b, c)} = 0`, byCompleting),
          values,
          wrong: [...(b * b + 4 * a * c > 0 ? [rootsOf(-a, b, c)] : []), pm(Q.of(b, 2 * a), sqrtSurd(Q.of(d, 4 * a * a))), [values[0]!]],
          solution: leadingSolution(a, b, c),
        });
      },
    },
  ],
};

/** discriminantLine writes b² − 4ac worked out: "(-5)^{2} - 4 \cdot 2 \cdot (-3) = 25 + 24 = 49". */
function discriminantLine(a: number, b: number, c: number): string {
  const paren = (n: number) => (n < 0 ? `(${n})` : String(n));
  const ac4 = 4 * a * c;
  const middle = `${b * b} ${ac4 > 0 ? "-" : "+"} ${Math.abs(ac4)}`;
  return `b^{2} - 4ac = ${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot ${paren(c)} = ${middle} = ${b * b - ac4}`;
}

/** formulaSteps writes the steps of the quadratic formula for ax² + bx + c = 0: read off a, b and c, work out b² − 4ac, then put them into the formula. */
function formulaSteps(a: number, b: number, c: number): Step[] {
  const d = b * b - 4 * a * c;
  const values = rootsOf(a, b, c);
  const read: Step = {
    title: t("Read off $a$, $b$ and $c$", "读出 $a$、$b$、$c$"),
    body: t(
      `Compare $${quad(a, b, c)} = 0$ with $ax^{2} + bx + c = 0$, keeping each sign with its number:${steps(`a = ${a}, \\quad b = ${b}, \\quad c = ${c}`)}`,
      `把 $${quad(a, b, c)} = 0$ 与 $ax^{2} + bx + c = 0$ 对照，每个数都连同符号读出：${steps(`a = ${a}, \\quad b = ${b}, \\quad c = ${c}`)}`,
    ),
  };
  const under: Step = {
    title: t("Work out the number under the root", "计算根号下的数"),
    body: t(
      `The formula needs $b^{2} - 4ac$:${steps(discriminantLine(a, b, c))}`,
      `公式中需要 $b^{2} - 4ac$：${steps(discriminantLine(a, b, c))}`,
    ),
  };
  let body: Text;
  if (d < 0) {
    body = t(
      `The formula would need $\\sqrt{${d}}$, but no real number squares to a negative number. So there is no real solution.`,
      `公式中要用到 $\\sqrt{${d}}$，但没有实数的平方是负数。所以没有实数解。`,
    );
  } else {
    const raw = `x = \\frac{${-b} \\pm \\sqrt{${d}}}{${2 * a}}`;
    let lines: string[];
    if (isSquare(d)) {
      const s = Math.sqrt(d);
      const value = (top: number) => `x = \\frac{${top}}{${2 * a}} = ${num(Q.of(top, 2 * a))}`;
      lines = d === 0 ? [raw, value(-b)] : [raw, `x = \\frac{${-b} \\pm ${s}}{${2 * a}}`, value(-b + s), value(-b - s)];
    } else {
      const [k, m] = simplifyRadical(d);
      const middle = k === 1 ? [] : [`x = \\frac{${-b} \\pm ${k}\\sqrt{${m}}}{${2 * a}}`];
      lines = [raw, ...middle, `x = ${pmLatex(Q.of(-b, 2 * a), sqrtSurd(Q.of(d, 4 * a * a)))}`];
    }
    lines = lines.filter((l, i) => i === 0 || l !== lines[i - 1]);
    const simplify =
      !isSquare(d) && simplifyRadical(d)[0] !== 1
        ? t(
            ` Then simplify $\\sqrt{${d}}$ and divide every term of the top by the common factor.`,
            `然后化简 $\\sqrt{${d}}$，并把分子的每一项都除以公因数。`,
          )
        : t("", "");
    body = t(
      `Put the numbers into $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$, with $-b = ${-b}$ and $2a = ${2 * a}$.${simplify.en}${steps(...lines)}So ${solved(values).en}.`,
      `把这些数代入 $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$，其中 $-b = ${-b}$，$2a = ${2 * a}$。${simplify["zh-CN"]}${steps(...lines)}所以 ${solved(values)["zh-CN"]}。`,
    );
  }
  return [read, under, { title: t("Use the formula", "运用公式"), body }];
}

/** formulaWrong lists the solution sets the usual slips with the quadratic formula produce: −b dropped, a instead of 2a, one root only. */
function formulaWrong(a: number, b: number, c: number): string[][] {
  const d = b * b - 4 * a * c;
  const values = rootsOf(a, b, c);
  if (d < 0) return [pm(Q.of(-b, 2 * a), sqrtSurd(Q.of(-d, 4 * a * a)))];
  return [pm(Q.of(b, 2 * a), sqrtSurd(Q.of(d, 4 * a * a))), pm(Q.of(-b, a), sqrtSurd(Q.of(d, a * a))), [values[0]!]];
}

export const theQuadraticFormula: TopicDef = {
  id: "the-quadratic-formula",
  title: t("The Quadratic Formula", "求根公式"),
  summary: t(
    "Solve any quadratic equation with $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$.",
    "用 $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$ 解任意一元二次方程。",
  ),
  prerequisites: ["solving-quadratic-equations-with-leading-coefficients-by-completing-the-square"],
  encompasses: [
    { topic: "simplifying-square-roots", weight: 0.3 },
    { topic: "order-of-operations-with-integers", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.4.A", "CCSS.HSA.REI.B.4.B"],
  intro: t(
    `We can solve any equation $ax^{2} + bx + c = 0$ by dividing by $a$ and completing the square. The steps are the same every time, so we can carry them out once with the letters $a$, $b$ and $c$ and keep the result:

$$x^{2} + \\frac{b}{a}x = -\\frac{c}{a} \\Rightarrow \\left(x + \\frac{b}{2a}\\right)^{2} = \\frac{b^{2}}{4a^{2}} - \\frac{c}{a} = \\frac{b^{2} - 4ac}{4a^{2}} \\Rightarrow x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$$

This is the **quadratic formula**. It turns solving into arithmetic. For $2x^{2} - 5x - 3 = 0$ we have $a = 2$, $b = -5$, $c = -3$, so $b^{2} - 4ac = 25 + 24 = 49$ and

$$x = \\frac{5 \\pm 7}{4}, \\text{ that is, } x = 3 \\text{ or } x = -\\frac{1}{2}$$

In this lesson we use the formula for rational and irrational solutions, and on equations that must first be put in standard form.`,
    `我们会通过除以 $a$ 再配方来解任意方程 $ax^{2} + bx + c = 0$。每次的步骤都一样，所以可以用字母 $a$、$b$、$c$ 一次性做完，把结果记下来：

$$x^{2} + \\frac{b}{a}x = -\\frac{c}{a} \\Rightarrow \\left(x + \\frac{b}{2a}\\right)^{2} = \\frac{b^{2}}{4a^{2}} - \\frac{c}{a} = \\frac{b^{2} - 4ac}{4a^{2}} \\Rightarrow x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$$

这就是**求根公式**。它把解方程变成了计算。对 $2x^{2} - 5x - 3 = 0$，$a = 2$，$b = -5$，$c = -3$，所以 $b^{2} - 4ac = 25 + 24 = 49$，

$$x = \\frac{5 \\pm 7}{4}, \\text{ 即 } x = 3 \\text{ 或 } x = -\\frac{1}{2}$$

这节课我们用公式求有理数解和无理数解，也解需要先化为一般形式的方程。`,
  ),
  knowledgePoints: [
    {
      id: "rational-solutions",
      title: t("Using the formula", "运用求根公式"),
      explanation: t(
        `Completing the square on $ax^{2} + bx + c = 0$ once and for all gives the **quadratic formula**:

$$x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$$

Read $a$, $b$ and $c$ from the standard form with their signs, work out $b^{2} - 4ac$ first, then the two values. For $2x^{2} - 5x - 3 = 0$: $a = 2$, $b = -5$, $c = -3$, so $b^{2} - 4ac = 25 + 24 = 49$ and

$$x = \\frac{5 \\pm 7}{4}, \\text{ so } x = 3 \\text{ or } x = -\\frac{1}{2}$$

Check $x = 3$: $2(3)^{2} - 5(3) - 3 = 18 - 15 - 3 = 0$.

> **Watch out.** With $b = -5$, $-b$ is $5$, not $-5$, and $b^{2}$ is $25$, not $-25$. The whole top is divided by $2a$, here $4$, not by $a$.`,
        `对 $ax^{2} + bx + c = 0$ 一次性配方，就得到**求根公式**：

$$x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$$

从一般形式中连同符号读出 $a$、$b$、$c$，先算 $b^{2} - 4ac$，再算两个值。对 $2x^{2} - 5x - 3 = 0$：$a = 2$，$b = -5$，$c = -3$，所以 $b^{2} - 4ac = 25 + 24 = 49$，

$$x = \\frac{5 \\pm 7}{4}, \\text{ 即 } x = 3 \\text{ 或 } x = -\\frac{1}{2}$$

检验 $x = 3$：$2(3)^{2} - 5(3) - 3 = 18 - 15 - 3 = 0$。

> **注意。** $b = -5$ 时，$-b$ 是 $5$ 而不是 $-5$，$b^{2}$ 是 $25$ 而不是 $-25$。整个分子都除以 $2a$，这里是 $4$，而不是除以 $a$。`,
      ),
      generate(rng) {
        const [p, q, r, s] = drawBinomials(rng, 7);
        const k = rng.bool(0.3) ? -1 : 1;
        const [a, b, c] = [k * p * r, k * (p * s + q * r), k * q * s];
        return solutionsProblem({
          prompt: solvePrompt(`${quad(a, b, c)} = 0`, byFormula),
          values: rootsOf(a, b, c),
          wrong: formulaWrong(a, b, c),
          solution: worked(formulaSteps(a, b, c), [checked(a, b, c, "x", undefined, true)]),
        });
      },
    },
    {
      id: "irrational-solutions",
      title: t("Irrational solutions", "无理数解"),
      explanation: t(
        `When $b^{2} - 4ac$ is not a perfect square, the solutions are irrational. Simplify the square root, then divide by any factor that the bottom shares with **every** term of the top:

$$x^{2} + 4x - 1 = 0: \\quad x = \\frac{-4 \\pm \\sqrt{20}}{2} = \\frac{-4 \\pm 2\\sqrt{5}}{2} = -2 \\pm \\sqrt{5}$$

The answer is still a pair of exact numbers, $-2 + \\sqrt{5}$ and $-2 - \\sqrt{5}$; a calculator gives about $0.24$ and $-4.24$.

> **Watch out.** Dividing only one term of the top is a common slip: $\\frac{-4 \\pm 2\\sqrt{5}}{2}$ is $-2 \\pm \\sqrt{5}$, not $-4 \\pm \\sqrt{5}$ and not $-2 \\pm 2\\sqrt{5}$.`,
        `当 $b^{2} - 4ac$ 不是完全平方数时，解是无理数。先化简平方根，再用分母与分子**每一项**的公因数约分：

$$x^{2} + 4x - 1 = 0: \\quad x = \\frac{-4 \\pm \\sqrt{20}}{2} = \\frac{-4 \\pm 2\\sqrt{5}}{2} = -2 \\pm \\sqrt{5}$$

答案仍然是一对精确的数 $-2 + \\sqrt{5}$ 和 $-2 - \\sqrt{5}$；用计算器算约为 $0.24$ 和 $-4.24$。

> **注意。** 只约分子的一项是常见错误：$\\frac{-4 \\pm 2\\sqrt{5}}{2}$ 等于 $-2 \\pm \\sqrt{5}$，不是 $-4 \\pm \\sqrt{5}$，也不是 $-2 \\pm 2\\sqrt{5}$。`,
      ),
      generate(rng) {
        let a: number;
        let b: number;
        let c: number;
        do {
          [a, b, c] = drawPositiveDiscriminant(rng, [1, 1, 2, 3, 4, 5, -1, -2]);
        } while (isSquare(b * b - 4 * a * c));
        return solutionsProblem({
          prompt: solvePrompt(`${quad(a, b, c)} = 0`, byFormula),
          values: rootsOf(a, b, c),
          wrong: formulaWrong(a, b, c),
          solution: worked(formulaSteps(a, b, c), [checked(a, b, c, "x", undefined, true)]),
        });
      },
    },
    {
      id: "rearranging-and-no-solution",
      title: t("Standard form first", "先化为一般形式"),
      explanation: t(
        `The formula reads $a$, $b$ and $c$ from the standard form $ax^{2} + bx + c = 0$, so rearrange first: $3x^{2} = 2x + 4$ becomes $3x^{2} - 2x - 4 = 0$, with $a = 3$, $b = -2$ and $c = -4$.

The number $b^{2} - 4ac$ under the root also tells us whether there are solutions at all. For $x^{2} + 2x + 5 = 0$ it is $4 - 20 = -16$; no real number has square $-16$, so the equation has no real solution.

> **Watch out.** Reading $b$ and $c$ before rearranging gives the wrong signs: in $3x^{2} = 2x + 4$, $b$ is $-2$, not $2$. And a negative number under the root means no real solution, not a root of the positive number.`,
        `公式中的 $a$、$b$、$c$ 取自一般形式 $ax^{2} + bx + c = 0$，所以要先移项：$3x^{2} = 2x + 4$ 化为 $3x^{2} - 2x - 4 = 0$，其中 $a = 3$，$b = -2$，$c = -4$。

根号下的数 $b^{2} - 4ac$ 还告诉我们方程有没有解。对 $x^{2} + 2x + 5 = 0$，它是 $4 - 20 = -16$；没有实数的平方等于 $-16$，所以方程没有实数解。

> **注意。** 移项之前就读 $b$ 和 $c$，符号会错：在 $3x^{2} = 2x + 4$ 中，$b$ 是 $-2$，不是 $2$。根号下是负数意味着没有实数解，而不是对它的相反数开平方。`,
      ),
      generate(rng) {
        let a: number;
        let b: number;
        let c: number;
        const none = rng.bool(0.3);
        do {
          a = rng.int(1, 5);
          b = rng.nonZero(-10, 10);
          c = rng.nonZero(-10, 10);
        } while (gcd(gcd(a, b), c) !== 1 || (none ? b * b - 4 * a * c >= 0 : b * b - 4 * a * c <= 0));
        const kind = rng.pick(["x2=", "move-c"] as const);
        const eq = kind === "x2=" ? `${poly([a, "x^{2}"])} = ${linear(-b, -c)}` : `${quad(a, b, 0)} = ${-c}`;
        const values = rootsOf(a, b, c);
        const slip = kind === "x2=" ? [a, -b, -c] : [a, b, -c];
        const [sa, sb, sc] = slip as [number, number, number];
        const move: Step = {
          title: t("Get $0$ on one side", "使一边为 $0$"),
          body: t(
            `Move every term on the right to the left, changing its sign:${steps(`${quad(a, b, c)} = 0`)}`,
            `把右边的每一项移到左边，并改变符号：${steps(`${quad(a, b, c)} = 0`)}`,
          ),
        };
        const back = t(
          `Moving the terms back to the right gives $${eq}$, the original equation.`,
          `把这些项移回右边，得 $${eq}$，正是原方程。`,
        );
        return solutionsProblem({
          prompt: solvePrompt(eq, byFormula),
          values,
          wrong: [
            ...formulaWrong(a, b, c),
            ...(sb * sb - 4 * sa * sc >= 0 ? [rootsOf(sa, sb, sc)] : []),
            ...(values.length > 0 ? [[]] : []),
          ],
          solution: worked([move, ...formulaSteps(a, b, c)], [checked(a, b, c, "x", back, true)]),
        });
      },
    },
  ],
};

const solutionCountOptions: readonly Text[] = [
  t("No real solution", "没有实数解"),
  t("Exactly one real solution", "恰有一个实数解"),
  t("Two real solutions", "两个实数解"),
];

/** readStep writes the step of reading a, b and c off ax² + bx + c = 0. */
function readStep(a: number, b: number, c: number): Step {
  return {
    title: t("Read off $a$, $b$ and $c$", "读出 $a$、$b$、$c$"),
    body: t(
      `In the standard form $${quad(a, b, c)} = 0$, each coefficient keeps its sign:${steps(`a = ${a}, \\quad b = ${b}, \\quad c = ${c}`)}`,
      `在一般形式 $${quad(a, b, c)} = 0$ 中，每个系数都连同符号读出：${steps(`a = ${a}, \\quad b = ${b}, \\quad c = ${c}`)}`,
    ),
  };
}

/** discriminantStep writes the step of working out b² − 4ac. */
function discriminantStep(a: number, b: number, c: number): Step {
  return {
    title: t("Work out the discriminant", "计算判别式"),
    body: t(
      `Square $b$ first, then subtract $4ac$:${steps(discriminantLine(a, b, c))}`,
      `先算 $b$ 的平方，再减去 $4ac$：${steps(discriminantLine(a, b, c))}`,
    ),
  };
}

/** countStep writes the step of reading the number of real solutions off the sign of the discriminant. */
function countStep(a: number, b: number, c: number): Step {
  const d = b * b - 4 * a * c;
  const body =
    d > 0
      ? t(
          `The discriminant is positive, so $\\pm\\sqrt{${d}}$ is two different numbers and the quadratic formula gives two real solutions.`,
          `判别式为正，所以 $\\pm\\sqrt{${d}}$ 是两个不同的数，求根公式给出两个实数解。`,
        )
      : d === 0
        ? t(
            `The discriminant is $0$, so $\\pm\\sqrt{0}$ is just $0$ and the quadratic formula gives exactly one solution, $x = -\\frac{b}{2a} = ${num(Q.of(-b, 2 * a))}$.`,
            `判别式为 $0$，所以 $\\pm\\sqrt{0}$ 就是 $0$，求根公式恰好给出一个解 $x = -\\frac{b}{2a} = ${num(Q.of(-b, 2 * a))}$。`,
          )
        : t(
            `The discriminant is negative. The formula would need $\\sqrt{${d}}$, and no real number has a negative square, so there is no real solution.`,
            `判别式为负。公式中要用到 $\\sqrt{${d}}$，而没有实数的平方是负数，所以没有实数解。`,
          );
  return { title: t("Read its sign", "看它的符号"), body };
}

/** discriminantCheck confirms b² − 4ac by completing the square: the equation becomes (x + p)² = k, and 4a²·k is the discriminant again. */
function discriminantCheck(a: number, b: number, c: number, count: boolean): Text {
  const d = b * b - 4 * a * c;
  const p = Q.of(b, 2 * a);
  const k = Q.of(d, 4 * a * a);
  const paren = (n: number) => (n < 0 ? `(${n})` : String(n));
  const lines = [
    `${squareOf(p)} = ${num(k)}`,
    `4 \\cdot ${paren(a)}^{2} \\cdot ${k.sign() < 0 ? `\\left(${num(k)}\\right)` : num(k)} = ${d}`,
  ];
  const agree = count
    ? k.sign() > 0
      ? t(" The right side is positive, so there are two square roots, as found.", "右边为正，有两个平方根，与上面一致。")
      : k.isZero()
        ? t(" The right side is $0$, which has one square root, as found.", "右边为 $0$，只有一个平方根，与上面一致。")
        : t(" The right side is negative, which has no real square root, as found.", "右边为负，没有实数平方根，与上面一致。")
    : t("", "");
  return t(
    `**Check.** ${a === 1 ? "Completing" : `Dividing by $${a}$ and completing`} the square turns the equation into $(x + p)^{2} = k$, and $4a^{2} \\cdot k$ gives the discriminant back:${steps(...lines)}It agrees.${agree.en}`,
    `**检验。** ${a === 1 ? "配方后" : `两边除以 $${a}$ 再配方，`}方程化为 $(x + p)^{2} = k$，而 $4a^{2} \\cdot k$ 又得到判别式：${steps(...lines)}结果一致。${agree["zh-CN"]}`,
  );
}

/** drawBySign draws ax² + bx + c whose discriminant has the given sign. */
function drawBySign(rng: Rng, sign: -1 | 0 | 1): [number, number, number] {
  if (sign === 0) {
    let p: number;
    let q: number;
    do {
      p = rng.int(1, 4);
      q = rng.nonZero(-7, 7);
    } while (gcd(p, q) !== 1);
    const k = rng.pick([1, 1, 2, -1]);
    return [k * p * p, 2 * k * p * q, k * q * q];
  }
  let a: number;
  let b: number;
  let c: number;
  do {
    a = rng.nonZero(-5, 5);
    b = rng.int(-10, 10);
    c = rng.nonZero(-10, 10);
  } while (Math.sign(b * b - 4 * a * c) !== sign);
  return [a, b, c];
}

/** countReasons say why each count of solutions is wrong for an equation whose discriminant is d. */
function countReasons(d: number): [string, string, string][] {
  return [
    [solutionCountOptions[0]!.en, `That needs a negative discriminant, and here it is $${d}$.`, `这要求判别式为负，而这里它等于 $${d}$。`],
    [solutionCountOptions[1]!.en, `That needs a discriminant of $0$, and here it is $${d}$.`, `这要求判别式为 $0$，而这里它等于 $${d}$。`],
    [solutionCountOptions[2]!.en, `That needs a positive discriminant, and here it is $${d}$.`, `这要求判别式为正，而这里它等于 $${d}$。`],
  ];
}

export const theDiscriminantOfAQuadraticEquation: TopicDef = {
  id: "the-discriminant-of-a-quadratic-equation",
  title: t("The Discriminant of a Quadratic Equation", "一元二次方程的判别式"),
  summary: t(
    "Compute $b^{2} - 4ac$ and use its sign to tell how many real solutions an equation has.",
    "计算 $b^{2} - 4ac$，并根据它的符号判断方程有几个实数解。",
  ),
  prerequisites: ["the-quadratic-formula"],
  encompasses: [{ topic: "order-of-operations-with-integers", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSA.REI.B.4.B"],
  intro: t(
    `In the quadratic formula $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$, everything hangs on the number under the root. Compare three equations that differ only in their constant:

- $x^{2} - 6x + 5 = 0$: $b^{2} - 4ac = 36 - 20 = 16$, and $x = \\frac{6 \\pm 4}{2}$ gives two solutions, $5$ and $1$.
- $x^{2} - 6x + 9 = 0$: $b^{2} - 4ac = 36 - 36 = 0$, and $x = \\frac{6 \\pm 0}{2}$ gives one solution, $3$.
- $x^{2} - 6x + 13 = 0$: $b^{2} - 4ac = 36 - 52 = -16$, and $\\sqrt{-16}$ is not a real number, so there is no solution.

The graphs show the same thing: the first parabola crosses the $x$-axis twice, the second touches it once, and the third misses it.

{{figure 0}}

So the number $b^{2} - 4ac$ tells us how many real solutions there are before we solve anything. It is called the **discriminant**, and in this lesson we compute it and read its sign, also for equations that are not yet in standard form.`,
    `在求根公式 $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$ 中，一切都取决于根号下的数。比较三个只有常数项不同的方程：

- $x^{2} - 6x + 5 = 0$：$b^{2} - 4ac = 36 - 20 = 16$，$x = \\frac{6 \\pm 4}{2}$ 给出两个解 $5$ 和 $1$。
- $x^{2} - 6x + 9 = 0$：$b^{2} - 4ac = 36 - 36 = 0$，$x = \\frac{6 \\pm 0}{2}$ 只给出一个解 $3$。
- $x^{2} - 6x + 13 = 0$：$b^{2} - 4ac = 36 - 52 = -16$，而 $\\sqrt{-16}$ 不是实数，所以没有解。

图象说明了同样的事：第一条抛物线与 $x$ 轴交于两点，第二条与它相切于一点，第三条与它不相交。

{{figure 0}}

所以不必解方程，数 $b^{2} - 4ac$ 就能告诉我们有几个实数解。它叫做**判别式**。这节课我们计算判别式并看它的符号，也包括还不是一般形式的方程。`,
  ),
  introFigures: [
    graphFigure(
      { xMin: -1, xMax: 7, yMin: -5, yMax: 8, labelEvery: 2, step: 1 },
      [
        { kind: "curve", f: (x) => x * x - 6 * x + 5, accent: true },
        { kind: "curve", f: (x) => x * x - 6 * x + 9, tone: "action" },
        { kind: "curve", f: (x) => x * x - 6 * x + 13, dashed: true },
        { kind: "point", at: [1, 0], label: "1", dir: "nw", tone: "result" },
        { kind: "point", at: [5, 0], label: "5", dir: "ne", tone: "result" },
        { kind: "point", at: [3, 0], label: "3", dir: "s", tone: "result" },
      ],
      "Three parabolas: y = x² − 6x + 5 crosses the x-axis at 1 and 5, y = x² − 6x + 9 touches it at 3, and the dashed y = x² − 6x + 13 stays above it.",
      "三条抛物线：y = x² − 6x + 5 与 x 轴交于 1 和 5，y = x² − 6x + 9 与它相切于 3，虚线 y = x² − 6x + 13 始终在它上方。",
    ),
  ],
  knowledgePoints: [
    {
      id: "computing",
      title: t("Computing the discriminant", "计算判别式"),
      explanation: t(
        `The number under the root in the quadratic formula, $\\Delta = b^{2} - 4ac$, is the **discriminant**. Read $a$, $b$ and $c$ from the standard form with their signs, square $b$, then subtract $4ac$. For $3x^{2} - 4x - 2 = 0$:

$$b^{2} - 4ac = (-4)^{2} - 4 \\cdot 3 \\cdot (-2) = 16 + 24 = 40$$

When $a$ and $c$ have opposite signs, $4ac$ is negative and subtracting it adds.

> **Watch out.** $b^{2}$ is never negative, even when $b$ is: $(-4)^{2} = 16$, not $-16$. And keep the sign of $4ac$: $16 - 4 \\cdot 3 \\cdot (-2)$ is $16 + 24$, not $16 - 24$.`,
        `求根公式中根号下的数 $\\Delta = b^{2} - 4ac$ 叫做**判别式**。从一般形式中连同符号读出 $a$、$b$、$c$，先算 $b$ 的平方，再减去 $4ac$。对 $3x^{2} - 4x - 2 = 0$：

$$b^{2} - 4ac = (-4)^{2} - 4 \\cdot 3 \\cdot (-2) = 16 + 24 = 40$$

当 $a$ 与 $c$ 异号时，$4ac$ 是负数，减去它就是加上。

> **注意。** 即使 $b$ 是负数，$b^{2}$ 也不会是负数：$(-4)^{2} = 16$，不是 $-16$。还要保留 $4ac$ 的符号：$16 - 4 \\cdot 3 \\cdot (-2)$ 是 $16 + 24$，不是 $16 - 24$。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-12, 12);
        const c = rng.nonZero(-12, 12);
        const scrambled = rng.bool(0.3);
        const eq = scrambled ? `${poly([b, "x"], [a, "x^{2}"], [c, ""])} = 0` : `${quad(a, b, c)} = 0`;
        const d = b * b - 4 * a * c;
        return numberProblem({
          prompt: t(`Find the discriminant of $${eq}$.`, `求方程 $${eq}$ 的判别式。`),
          answer: d,
          form: "integer",
          wrong: [b * b + 4 * a * c, -b * b - 4 * a * c, b - 4 * a * c, a * a - 4 * b * c],
          solution: worked([readStep(a, b, c), discriminantStep(a, b, c)], [discriminantCheck(a, b, c, false)]),
        });
      },
    },
    {
      id: "number-of-solutions",
      title: t("The number of real solutions", "实数解的个数"),
      explanation: t(
        `The quadratic formula adds and subtracts $\\sqrt{b^{2} - 4ac}$, so the sign of the discriminant tells how many real solutions there are:

- $b^{2} - 4ac > 0$: the root is a positive number, and adding and subtracting it gives two real solutions;
- $b^{2} - 4ac = 0$: the root is $0$, and there is exactly one, $x = -\\frac{b}{2a}$;
- $b^{2} - 4ac < 0$: the root is not a real number, and there is no real solution.

For $4x^{2} - 12x + 9 = 0$: $144 - 144 = 0$, so there is one solution, $x = \\frac{12}{8} = \\frac{3}{2}$.

> **Watch out.** It is the sign of $b^{2} - 4ac$ that counts, not the sign of $a$, $b$ or $c$. A discriminant of $0$ means one solution, not none.`,
        `求根公式要加上和减去 $\\sqrt{b^{2} - 4ac}$，所以判别式的符号决定了实数解的个数：

- $b^{2} - 4ac > 0$：根号是正数，加上和减去它得到两个实数解；
- $b^{2} - 4ac = 0$：根号是 $0$，恰有一个解 $x = -\\frac{b}{2a}$；
- $b^{2} - 4ac < 0$：根号不是实数，没有实数解。

对 $4x^{2} - 12x + 9 = 0$：$144 - 144 = 0$，所以只有一个解 $x = \\frac{12}{8} = \\frac{3}{2}$。

> **注意。** 起作用的是 $b^{2} - 4ac$ 的符号，而不是 $a$、$b$ 或 $c$ 的符号。判别式为 $0$ 意味着有一个解，而不是没有解。`,
      ),
      generate(rng) {
        const sign = rng.pick([-1, 0, 1] as const);
        const [a, b, c] = drawBySign(rng, sign);
        return reasoned(
          choiceProblem({
            prompt: t(`How many real solutions does $${quad(a, b, c)} = 0$ have?`, `方程 $${quad(a, b, c)} = 0$ 有几个实数解？`),
            options: solutionCountOptions,
            correct: sign + 1,
            solution: worked([readStep(a, b, c), discriminantStep(a, b, c), countStep(a, b, c)], [discriminantCheck(a, b, c, true)]),
          }),
          countReasons(b * b - 4 * a * c),
        );
      },
    },
    {
      id: "rearranging",
      title: t("Equations not in standard form", "非一般形式的方程"),
      explanation: t(
        `The discriminant is built from the coefficients of the standard form, so write the equation in standard form before reading $a$, $b$ and $c$:

$$x(x - 4) = -4 \\Rightarrow x^{2} - 4x + 4 = 0 \\Rightarrow b^{2} - 4ac = 16 - 16 = 0$$

so it has exactly one real solution. Indeed $x^{2} - 4x + 4 = (x - 2)^{2}$.

> **Watch out.** Reading the numbers off the equation as given is wrong: in $x(x - 4) = -4$ the constant is $4$ once it is moved to the left, not $-4$. With $c = -4$ the discriminant would be $32$, two solutions.`,
        `判别式由一般形式的系数构成，所以先把方程化为一般形式，再读出 $a$、$b$、$c$：

$$x(x - 4) = -4 \\Rightarrow x^{2} - 4x + 4 = 0 \\Rightarrow b^{2} - 4ac = 16 - 16 = 0$$

所以恰有一个实数解。确实，$x^{2} - 4x + 4 = (x - 2)^{2}$。

> **注意。** 直接从原方程读数是错的：在 $x(x - 4) = -4$ 中，常数移到左边后是 $4$，不是 $-4$。若取 $c = -4$，判别式就成了 $32$，有两个解。`,
      ),
      generate(rng) {
        const sign = rng.pick([-1, 0, 1] as const);
        let a: number;
        let b: number;
        let c: number;
        do [a, b, c] = drawBySign(rng, sign);
        while (a < 0);
        const kind = rng.pick(["x2=", "move-c", "product"] as const);
        const product = kind === "product" && a === 1;
        const eq =
          kind === "x2=" || (kind === "product" && a !== 1)
            ? `${poly([a, "x^{2}"])} = ${linear(-b, -c)}`
            : kind === "move-c"
              ? `${quad(a, 0, c)} = ${poly([-b, "x"])}`
              : `x${lf(1, b)} = ${-c}`;
        const standard: Step = {
          title: t("Write it in standard form", "化为一般形式"),
          body: t(
            `${product ? "Expand the left side, then move" : "Move"} every term on the right to the left, changing its sign:${steps(`${quad(a, b, c)} = 0`)}`,
            `${product ? "先展开左边，再" : ""}把右边的每一项移到左边，并改变符号：${steps(`${quad(a, b, c)} = 0`)}`,
          ),
        };
        return reasoned(
          choiceProblem({
            prompt: t(`How many real solutions does $${eq}$ have?`, `方程 $${eq}$ 有几个实数解？`),
            options: solutionCountOptions,
            correct: sign + 1,
            solution: worked(
              [standard, readStep(a, b, c), discriminantStep(a, b, c), countStep(a, b, c)],
              [discriminantCheck(a, b, c, true)],
            ),
          }),
          countReasons(b * b - 4 * a * c),
        );
      },
    },
  ],
};

/** paren wraps a negative integer in parentheses, for a product or a power. */
const paren = (n: number) => (n < 0 ? `(${n})` : String(n));

/** zeroDiscriminantStep sets the discriminant of the equation to 0, given the discriminant written out and simplified. */
function zeroDiscriminantStep(read: Text, lines: readonly string[]): Step {
  return {
    title: t("Set the discriminant to $0$", "令判别式等于 $0$"),
    body: t(
      `The equation has exactly one real solution when $b^{2} - 4ac = 0$. Here ${read.en}:${steps(...lines)}`,
      `方程恰有一个实数解，当且仅当 $b^{2} - 4ac = 0$。这里 ${read["zh-CN"]}：${steps(...lines)}`,
    ),
  };
}

/** perfectSquareCheck shows that ax² + bx + c with b² = 4ac is a times a square, so it is 0 at x = −b/2a only. */
function perfectSquareCheck(k: Q, a: number, b: number, c: Q): Text {
  const p = Q.of(b, 2 * a);
  const inner = quad(1, p.mul(Q.of(2)), p.mul(p));
  const line = `${front(a)}${squareOf(p)}${a === 1 ? "" : ` = ${front(a)}\\left(${inner}\\right)`} = ${quad(a, b, c)}`;
  const x = num(p.neg());
  return t(
    `**Check.** With $k = ${num(k)}$ the equation is $${quad(a, b, c)} = 0$, and its left side is ${a === 1 ? "" : a === -1 ? "the negative of " : `$${a}$ times `}a perfect square:${steps(line)}So the equation holds only when $${linear(1, p)} = 0$, that is, at the single solution $x = ${x}$.`,
    `**检验。** 当 $k = ${num(k)}$ 时，方程是 $${quad(a, b, c)} = 0$，它的左边是${a === 1 ? "一个完全平方" : a === -1 ? "一个完全平方的相反数" : ` $${a}$ 乘以一个完全平方`}：${steps(line)}所以只有 $${linear(1, p)} = 0$ 时等式成立，即只有一个解 $x = ${x}$。`,
  );
}

export const quadraticEquationsWithOneRealSolution: TopicDef = {
  id: "quadratic-equations-with-one-real-solution",
  title: t("Determining Unknown Parameters in Quadratic Equations With One Real Solution", "由只有一个实数解确定一元二次方程中的参数"),
  summary: t(
    "Find a coefficient for which a quadratic equation has exactly one real solution by setting $b^{2} - 4ac = 0$.",
    "令 $b^{2} - 4ac = 0$，求使一元二次方程恰有一个实数解的系数。",
  ),
  prerequisites: ["the-discriminant-of-a-quadratic-equation"],
  encompasses: [
    { topic: "the-discriminant-of-a-quadratic-equation", weight: 0.6 },
    { topic: "two-step-equations", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.REI.B.4.B"],
  intro: t(
    `The discriminant $b^{2} - 4ac$ tells how many real solutions a quadratic equation has, and it is $0$ exactly when there is one. Now suppose one coefficient is not fixed. In $x^{2} + 6x + k = 0$, the constant $k$ changes the count:

- $k = 5$: $36 - 20 = 16 > 0$, two solutions;
- $k = 13$: $36 - 52 = -16 < 0$, no real solution.

Somewhere between, the parabola $y = x^{2} + 6x + k$ just touches the $x$-axis. To find where, turn the condition into an equation for $k$: $36 - 4k = 0$, so $k = 9$, and indeed $x^{2} + 6x + 9 = (x + 3)^{2}$ has the single solution $x = -3$. In this lesson we find such a coefficient, whether it is the constant, the coefficient of $x^{2}$ or the coefficient of $x$.`,
    `判别式 $b^{2} - 4ac$ 告诉我们一元二次方程有几个实数解，它等于 $0$ 时恰有一个解。现在假设某个系数不确定。在 $x^{2} + 6x + k = 0$ 中，常数 $k$ 会改变解的个数：

- $k = 5$：$36 - 20 = 16 > 0$，两个解；
- $k = 13$：$36 - 52 = -16 < 0$，没有实数解。

在这两者之间，抛物线 $y = x^{2} + 6x + k$ 恰好与 $x$ 轴相切。要找到这个 $k$，就把条件变成关于 $k$ 的方程：$36 - 4k = 0$，所以 $k = 9$。确实，$x^{2} + 6x + 9 = (x + 3)^{2}$ 只有一个解 $x = -3$。这节课我们求这样的系数，无论它是常数项、$x^{2}$ 的系数还是 $x$ 的系数。`,
  ),
  knowledgePoints: [
    {
      id: "unknown-constant",
      title: t("An unknown constant term", "未知的常数项"),
      explanation: t(
        `An equation has exactly one real solution when its discriminant is $0$. With the constant unknown, $c = k$, and $b^{2} - 4ak = 0$ is a linear equation in $k$. For $2x^{2} + 12x + k = 0$:

$$12^{2} - 4 \\cdot 2 \\cdot k = 0 \\Rightarrow 144 = 8k \\Rightarrow k = 18$$

Check: $2x^{2} + 12x + 18 = 2(x + 3)^{2}$, which is $0$ only at $x = -3$.

> **Watch out.** Square $b$ and divide by $4a$, the whole of it: here $k = \\frac{144}{8} = 18$. Dividing by $2a$ gives $36$, dividing by $4$ alone gives $36$ too, and halving $b$ gives $6$, all wrong. Keep the sign as well: when $a$ is negative, so is $k$.`,
        `判别式为 $0$ 时，方程恰有一个实数解。常数项未知时 $c = k$，$b^{2} - 4ak = 0$ 是关于 $k$ 的一次方程。对 $2x^{2} + 12x + k = 0$：

$$12^{2} - 4 \\cdot 2 \\cdot k = 0 \\Rightarrow 144 = 8k \\Rightarrow k = 18$$

检验：$2x^{2} + 12x + 18 = 2(x + 3)^{2}$，只在 $x = -3$ 时为 $0$。

> **注意。** 先把 $b$ 平方，再除以整个 $4a$：这里 $k = \\frac{144}{8} = 18$。除以 $2a$ 得 $36$，只除以 $4$ 也得 $36$，把 $b$ 取一半得 $6$，都是错的。还要注意符号：$a$ 为负时，$k$ 也为负。`,
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 1, 2, 3, 4, -1, -2]);
        const b = rng.nonZero(-12, 12);
        const answer = Q.of(b * b, 4 * a);
        const solve: Step = {
          title: t("Solve for $k$", "解出 $k$"),
          body: t(
            `So $4ak = b^{2}$. Divide both sides by $${4 * a}$:${steps(`${poly([4 * a, "k"])} = ${b * b}`, `k = ${num(answer)}`)}`,
            `即 $4ak = b^{2}$。两边同时除以 $${4 * a}$：${steps(`${poly([4 * a, "k"])} = ${b * b}`, `k = ${num(answer)}`)}`,
          ),
        };
        return numberProblem({
          prompt: t(
            `For what value of $k$ does $${quad(a, b, 0)} + k = 0$ have exactly one real solution?`,
            `$k$ 取何值时，方程 $${quad(a, b, 0)} + k = 0$ 恰有一个实数解？`,
          ),
          answer,
          solveFor: "k",
          wrong: [answer.neg(), Q.of(b * b, 2 * a), Q.of(b, 2), Q.of(b * b, 4), Q.of(b * b)],
          solution: worked(
            [
              zeroDiscriminantStep(t(`$a = ${a}$, $b = ${b}$ and $c = k$`, `$a = ${a}$，$b = ${b}$，$c = k$`), [
                `${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot k = 0`,
                `${poly([b * b, ""], [-4 * a, "k"])} = 0`,
              ]),
              solve,
            ],
            [perfectSquareCheck(answer, a, b, answer)],
          ),
        });
      },
    },
    {
      id: "unknown-leading-coefficient",
      title: t("An unknown leading coefficient", "未知的首项系数"),
      explanation: t(
        `The same condition works when $a$ is unknown. Now $a = k$, so $b^{2} - 4kc = 0$, and $k$ must not be $0$, or the equation would not be quadratic. For $kx^{2} - 12x + 4 = 0$:

$$(-12)^{2} - 4 \\cdot k \\cdot 4 = 0 \\Rightarrow 144 = 16k \\Rightarrow k = 9$$

Check: $9x^{2} - 12x + 4 = (3x - 2)^{2}$, which is $0$ only at $x = \\frac{2}{3}$.

> **Watch out.** Solving $16k = 144$ gives $k = \\frac{144}{16}$, with $4c$ in the denominator, not $\\frac{16}{144}$. And the $4$ stays: dividing by $c$ alone gives $36$, four times too big.`,
        `当 $a$ 未知时同样适用。这时 $a = k$，所以 $b^{2} - 4kc = 0$，而且 $k$ 不能是 $0$，否则方程就不是一元二次方程。对 $kx^{2} - 12x + 4 = 0$：

$$(-12)^{2} - 4 \\cdot k \\cdot 4 = 0 \\Rightarrow 144 = 16k \\Rightarrow k = 9$$

检验：$9x^{2} - 12x + 4 = (3x - 2)^{2}$，只在 $x = \\frac{2}{3}$ 时为 $0$。

> **注意。** 由 $16k = 144$ 得 $k = \\frac{144}{16}$，分母是 $4c$，而不是 $\\frac{16}{144}$。$4$ 也不能丢：只除以 $c$ 得 $36$，大了四倍。`,
      ),
      generate(rng) {
        const b = rng.nonZero(-12, 12);
        const c = rng.nonZero(-9, 9);
        const answer = Q.of(b * b, 4 * c);
        const eq = `kx^{2} ${b < 0 ? "-" : "+"} ${poly([Math.abs(b), "x"], [c, ""])} = 0`;
        const solve: Step = {
          title: t("Solve for $k$", "解出 $k$"),
          body: t(
            `So $4kc = b^{2}$. Divide both sides by $${4 * c}$:${steps(`${poly([4 * c, "k"])} = ${b * b}`, `k = ${num(answer)}`)}This is not $0$, so the equation is quadratic.`,
            `即 $4kc = b^{2}$。两边同时除以 $${4 * c}$：${steps(`${poly([4 * c, "k"])} = ${b * b}`, `k = ${num(answer)}`)}它不等于 $0$，所以方程确实是一元二次方程。`,
          ),
        };
        const check = t(
          `**Check.** Put $k = ${num(answer)}$ back into the discriminant:${steps(`${paren(b)}^{2} - 4 \\cdot ${answer.sign() < 0 ? `\\left(${num(answer)}\\right)` : num(answer)} \\cdot ${paren(c)} = ${b * b} - ${b * b} = 0`)}So the equation has exactly one real solution.`,
          `**检验。** 把 $k = ${num(answer)}$ 代回判别式：${steps(`${paren(b)}^{2} - 4 \\cdot ${answer.sign() < 0 ? `\\left(${num(answer)}\\right)` : num(answer)} \\cdot ${paren(c)} = ${b * b} - ${b * b} = 0`)}所以方程恰有一个实数解。`,
        );
        return numberProblem({
          prompt: t(`For what value of $k$ does $${eq}$ have exactly one real solution?`, `$k$ 取何值时，方程 $${eq}$ 恰有一个实数解？`),
          answer,
          solveFor: "k",
          wrong: [answer.neg(), Q.of(b * b, 2 * c), Q.of(b * b, c), Q.of(4 * c, b * b)],
          solution: worked(
            [
              zeroDiscriminantStep(t(`$a = k$, $b = ${b}$ and $c = ${c}$`, `$a = k$，$b = ${b}$，$c = ${c}$`), [
                `${paren(b)}^{2} - 4 \\cdot k \\cdot ${paren(c)} = 0`,
                `${poly([b * b, ""], [-4 * c, "k"])} = 0`,
              ]),
              solve,
            ],
            [check],
          ),
        });
      },
    },
    {
      id: "unknown-linear-coefficient",
      title: t("An unknown coefficient of $x$", "未知的一次项系数"),
      explanation: t(
        `When the coefficient of $x$ is unknown, $b = k$ and the condition $k^{2} - 4ac = 0$ is about $k^{2}$. A positive number has two square roots, so there are two answers, $k = \\pm\\sqrt{4ac}$. For $x^{2} + kx + 9 = 0$:

$$k^{2} - 4 \\cdot 1 \\cdot 9 = 0 \\Rightarrow k^{2} = 36 \\Rightarrow k = 6 \\text{ or } k = -6$$

Both work: $x^{2} + 6x + 9 = (x + 3)^{2}$ and $x^{2} - 6x + 9 = (x - 3)^{2}$.

> **Watch out.** Give both values: $k = -6$ is as good as $k = 6$. And $k$ is the square root of $4ac$, not $4ac$ itself and not half of it: here $\\pm 6$, not $\\pm 36$ or $\\pm 3$.`,
        `当 $x$ 的系数未知时，$b = k$，条件 $k^{2} - 4ac = 0$ 是关于 $k^{2}$ 的。正数有两个平方根，所以有两个答案 $k = \\pm\\sqrt{4ac}$。对 $x^{2} + kx + 9 = 0$：

$$k^{2} - 4 \\cdot 1 \\cdot 9 = 0 \\Rightarrow k^{2} = 36 \\Rightarrow k = 6 \\text{ 或 } k = -6$$

两个都成立：$x^{2} + 6x + 9 = (x + 3)^{2}$，$x^{2} - 6x + 9 = (x - 3)^{2}$。

> **注意。** 两个值都要写：$k = -6$ 和 $k = 6$ 同样成立。而且 $k$ 是 $4ac$ 的平方根，既不是 $4ac$ 本身，也不是它的一半：这里是 $\\pm 6$，不是 $\\pm 36$ 或 $\\pm 3$。`,
      ),
      generate(rng) {
        const w = rng.pick([1, 1, 2, 3]) * rng.sign();
        const m = rng.int(1, 4);
        const n = rng.int(1, 6);
        const a = w * m * m;
        const c = w * n * n;
        const k = 2 * Math.abs(w) * m * n;
        const s = Math.sign(w);
        const eq = `${poly([a, "x^{2}"])} + kx ${c < 0 ? "-" : "+"} ${Math.abs(c)} = 0`;
        const roots: Step = {
          title: t("Take square roots", "开平方"),
          body: t(
            `$k^{2} = ${k * k}$ has two solutions, one positive and one negative:${steps(`k = \\pm\\sqrt{${k * k}} = \\pm ${k}`)}`,
            `$k^{2} = ${k * k}$ 有两个解，一正一负：${steps(`k = \\pm\\sqrt{${k * k}} = \\pm ${k}`)}`,
          ),
        };
        const square = (sign: number) => {
          const sq = `${front(w)}${lf(m, sign * s * n)}^{2}`;
          return `${quad(a, sign * k, c)} = ${sq}`;
        };
        const check = t(
          `**Check.** Each value makes the left side ${w === 1 ? "" : w === -1 ? "the negative of " : `$${w}$ times `}a perfect square:${steps(square(1), square(-1))}Each is $0$ at one value of $x$ only, so each equation has exactly one real solution.`,
          `**检验。** 每个值都使左边成为${w === 1 ? "一个完全平方" : w === -1 ? "一个完全平方的相反数" : ` $${w}$ 乘以一个完全平方`}：${steps(square(1), square(-1))}每个式子都只在一个 $x$ 值处为 $0$，所以每个方程都恰有一个实数解。`,
        );
        return solutionsProblem({
          prompt: t(
            `Find all values of $k$ for which $${eq}$ has exactly one real solution.`,
            `求使方程 $${eq}$ 恰有一个实数解的所有 $k$ 值。`,
          ),
          variable: "k",
          values: [String(k), String(-k)],
          wrong: [[String(k)], [String(k / 2), String(-k / 2)], [String(4 * a * c), String(-4 * a * c)]],
          solution: worked(
            [
              zeroDiscriminantStep(t(`$a = ${a}$, $b = k$ and $c = ${c}$`, `$a = ${a}$，$b = k$，$c = ${c}$`), [
                `k^{2} - 4 \\cdot ${paren(a)} \\cdot ${paren(c)} = 0`,
                `k^{2} = ${4 * a * c}`,
              ]),
              roots,
            ],
            [check],
          ),
        });
      },
    },
  ],
};

export const modelingWithQuadraticEquations: TopicDef = {
  id: "modeling-with-quadratic-equations",
  title: t("Modeling With Quadratic Equations", "用一元二次方程建模"),
  summary: t(
    "Solve word problems about areas, numbers and falling objects with quadratic equations, rejecting solutions that do not fit the situation.",
    "用一元二次方程解关于面积、数和下落物体的应用题，并舍去不符合实际的解。",
  ),
  prerequisites: ["solving-quadratic-equations-by-factoring"],
  encompasses: [{ topic: "solving-quadratic-equations-by-factoring", weight: 0.5 }],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.1"],
  intro: t(
    `We can solve an equation such as $x^{2} + 2x - 24 = 0$ by factoring. Equations like it come out of many everyday questions. A garden is $2$ m longer than it is wide, and its area is $24$ m². How wide is it? Call the width $w$; the length is $w + 2$, and the area is width times length:

$$w(w + 2) = 24 \\Rightarrow w^{2} + 2w - 24 = 0 \\Rightarrow (w + 6)(w - 4) = 0$$

The equation has two solutions, $4$ and $-6$, but a width cannot be negative, so the garden is $4$ m wide and $6$ m long. In this lesson we turn questions about areas, numbers and thrown objects into quadratic equations, solve them, and keep only the solutions that make sense in the situation.`,
    `我们会用因式分解解 $x^{2} + 2x - 24 = 0$ 这样的方程。很多日常问题都会得到这样的方程。一块菜地的长比宽多 $2$ m，面积是 $24$ m²。它有多宽？设宽为 $w$，则长为 $w + 2$，面积等于宽乘以长：

$$w(w + 2) = 24 \\Rightarrow w^{2} + 2w - 24 = 0 \\Rightarrow (w + 6)(w - 4) = 0$$

方程有两个解 $4$ 和 $-6$，但宽不可能是负数，所以菜地宽 $4$ m、长 $6$ m。这节课我们把关于面积、数和抛出物体的问题化为一元二次方程，解出它们，并只保留符合实际情况的解。`,
  ),
  knowledgePoints: [
    {
      id: "rectangles",
      figure: algebraDrawings["modeling-with-quadratic-equations#rectangles"],
      title: t("Areas of rectangles", "长方形的面积"),
      explanation: t(
        `Name the unknown, write the area as width times length, and solve. The length of a rectangle is $3$ m more than its width, and its area is $40$ m². With width $w$:

$$w(w + 3) = 40 \\Rightarrow w^{2} + 3w - 40 = 0 \\Rightarrow (w + 8)(w - 5) = 0$$

So $w = 5$ or $w = -8$. A length must be positive, so $w = 5$: the width is $5$ m and the length $8$ m. Check: $5 \\cdot 8 = 40$.

> **Watch out.** Answer the question that was asked. The equation gives the width; if the question asks for the length, add $3$ to it. And $-8$ solves the equation but is not a width, so it is rejected, not reported.`,
        `设出未知数，把面积写成宽乘以长，然后求解。一个长方形的长比宽多 $3$ m，面积是 $40$ m²。设宽为 $w$：

$$w(w + 3) = 40 \\Rightarrow w^{2} + 3w - 40 = 0 \\Rightarrow (w + 8)(w - 5) = 0$$

所以 $w = 5$ 或 $w = -8$。长度必须是正数，所以 $w = 5$：宽是 $5$ m，长是 $8$ m。检验：$5 \\cdot 8 = 40$。

> **注意。** 要回答题目问的量。方程解出的是宽；如果问的是长，还要加上 $3$。$-8$ 虽然满足方程，却不可能是宽，要舍去，不能当作答案。`,
      ),
      generate(rng) {
        const w = rng.int(2, 15);
        const d = rng.int(1, 9);
        const twice = rng.bool(0.35);
        const length = twice ? 2 * w + d : w + d;
        const area = w * length;
        const unit = rng.pick(["m", "cm", "ft"]);
        const askLength = rng.bool(0.35);
        const rel = twice
          ? t(`$${d}$ ${unit} more than twice its width`, `比宽的 $2$ 倍多 $${d}$ ${unit}`)
          : t(`$${d}$ ${unit} more than its width`, `比宽多 $${d}$ ${unit}`);
        const lengthOf = twice ? `2w + ${d}` : `w + ${d}`;
        const eq = `w(${lengthOf}) = ${area}`;
        const std = `${quad(twice ? 2 : 1, d, -area, "w")} = 0`;
        const factored = twice ? `(2w + ${length})(w - ${w}) = 0` : `(w + ${length})(w - ${w}) = 0`;
        const other = twice ? Q.of(-length, 2) : Q.of(-length);
        const answer = askLength ? length : w;
        const lengthCalc = twice ? `2 \\cdot ${w} + ${d} = ${length}` : `${w} + ${d} = ${length}`;
        const lengthEn = askLength ? `, and the length is $${lengthCalc}$ ${unit}` : "";
        const lengthZh = askLength ? `，长是 $${lengthCalc}$ ${unit}` : "";
        return numberProblem({
          prompt: t(
            `The length of a rectangle is ${rel.en}. Its area is $${area}$ ${unit}². Find its ${askLength ? "length" : "width"}.`,
            `一个长方形的长${rel["zh-CN"]}，面积是 $${area}$ ${unit}²。求它的${askLength ? "长" : "宽"}。`,
          ),
          answer,
          unit,
          wrong: [askLength ? w : length, other, area / 2 === Math.floor(area / 2) ? area / 2 : area],
          solution: worked(
            [
              {
                title: t("Write the equation", "列方程"),
                body: t(
                  `Let the width be $w$ ${unit}. The length is $${lengthOf}$, and the area is width times length:${steps(eq)}`,
                  `设宽为 $w$ ${unit}，则长为 $${lengthOf}$，面积等于宽乘以长：${steps(eq)}`,
                ),
              },
              {
                title: t("Solve it", "解方程"),
                body: t(
                  `Expand, move $${area}$ to the left, and factor:${steps(std, factored)}So $w = ${w}$ or $w = ${num(other)}$.`,
                  `展开，把 $${area}$ 移到左边，再因式分解：${steps(std, factored)}所以 $w = ${w}$ 或 $w = ${num(other)}$。`,
                ),
              },
              {
                title: t("Keep the solution that fits", "保留符合实际的解"),
                body: t(
                  `A width cannot be negative, so $w = ${w}$: the width is $${w}$ ${unit}${lengthEn}.`,
                  `宽不可能是负数，所以 $w = ${w}$：宽是 $${w}$ ${unit}${lengthZh}。`,
                ),
              },
            ],
            [
              t(
                `**Check.** The length is $${lengthCalc}$, which is $${d}$ more than ${twice ? "twice " : ""}the width, and the area is $${w} \\cdot ${length} = ${area}$.`,
                `**检验。** 长是 $${lengthCalc}$，比宽${twice ? "的 $2$ 倍" : ""}多 $${d}$，面积是 $${w} \\cdot ${length} = ${area}$。`,
              ),
            ],
          ),
        });
      },
    },
    {
      id: "numbers",
      title: t("Number problems", "数的问题"),
      explanation: t(
        `Consecutive integers are $n$ and $n + 1$; consecutive even or odd integers are $n$ and $n + 2$, since they are two apart. If the product of two consecutive positive integers is $132$:

$$n(n + 1) = 132 \\Rightarrow n^{2} + n - 132 = 0 \\Rightarrow (n + 12)(n - 11) = 0$$

The integers are positive, so $n = 11$, not $-12$: the integers are $11$ and $12$. Check: $11 \\cdot 12 = 132$.

> **Watch out.** $n$ is the smaller integer. If the question asks for the larger one, give $n + 1$ (or $n + 2$), not $n$. And the solution $-12$ is rejected because the integers are positive.`,
        `相邻整数是 $n$ 和 $n + 1$；相邻偶数或相邻奇数相差 $2$，是 $n$ 和 $n + 2$。如果两个相邻正整数之积是 $132$：

$$n(n + 1) = 132 \\Rightarrow n^{2} + n - 132 = 0 \\Rightarrow (n + 12)(n - 11) = 0$$

这两个整数是正数，所以 $n = 11$，而不是 $-12$：它们是 $11$ 和 $12$。检验：$11 \\cdot 12 = 132$。

> **注意。** $n$ 是较小的数。如果问的是较大的数，答案是 $n + 1$（或 $n + 2$），而不是 $n$。解 $-12$ 要舍去，因为这两个整数是正数。`,
      ),
      generate(rng) {
        const kind = rng.pick(["consecutive", "even", "odd"] as const);
        const step = kind === "consecutive" ? 1 : 2;
        let n = rng.int(3, 25);
        if (kind === "even" && n % 2 === 1) n += 1;
        if (kind === "odd" && n % 2 === 0) n += 1;
        const product = n * (n + step);
        const askLarger = rng.bool(0.4);
        const name = {
          consecutive: t("consecutive positive integers", "相邻正整数"),
          even: t("consecutive positive even integers", "相邻正偶数"),
          odd: t("consecutive positive odd integers", "相邻正奇数"),
        }[kind];
        const answer = askLarger ? n + step : n;
        const ask = askLarger
          ? t(`The larger integer is $${n} + ${step} = ${n + step}$.`, `较大的数是 $${n} + ${step} = ${n + step}$。`)
          : t(`The smaller integer is $${n}$.`, `较小的数是 $${n}$。`);
        return numberProblem({
          prompt: t(
            `The product of two ${name.en} is $${product}$. What is the ${askLarger ? "larger" : "smaller"} integer?`,
            `两个${name["zh-CN"]}的积是 $${product}$。${askLarger ? "较大" : "较小"}的数是多少？`,
          ),
          answer,
          form: "integer",
          wrong: [askLarger ? n : n + step, -(n + step), -n, Math.floor(product / 2)],
          solution: worked(
            [
              {
                title: t("Write the equation", "列方程"),
                body: t(
                  `Let the smaller integer be $n$. ${step === 1 ? "The next integer" : "The next one of the same kind is two more, so it"} is $n + ${step}$, and their product is $${product}$:${steps(`n(n + ${step}) = ${product}`)}`,
                  `设较小的数为 $n$。${step === 1 ? "下一个整数" : "同类的下一个数大 $2$，所以它"}是 $n + ${step}$，它们的积是 $${product}$：${steps(`n(n + ${step}) = ${product}`)}`,
                ),
              },
              {
                title: t("Solve it", "解方程"),
                body: t(
                  `Expand, move $${product}$ to the left, and factor:${steps(`${quad(1, step, -product, "n")} = 0`, `(n + ${n + step})(n - ${n}) = 0`)}So $n = ${n}$ or $n = ${-(n + step)}$.`,
                  `展开，把 $${product}$ 移到左边，再因式分解：${steps(`${quad(1, step, -product, "n")} = 0`, `(n + ${n + step})(n - ${n}) = 0`)}所以 $n = ${n}$ 或 $n = ${-(n + step)}$。`,
                ),
              },
              {
                title: t("Keep the solution that fits", "保留符合实际的解"),
                body: t(
                  `The integers are positive, so $n = ${n}$, and the integers are $${n}$ and $${n + step}$. ${ask.en}`,
                  `这两个数是正数，所以 $n = ${n}$，两个数是 $${n}$ 和 $${n + step}$。${ask["zh-CN"]}`,
                ),
              },
            ],
            [
              t(
                `**Check.** $${n}$ and $${n + step}$ are ${name.en}, and $${n} \\cdot ${n + step} = ${product}$.`,
                `**检验。** $${n}$ 和 $${n + step}$ 是${name["zh-CN"]}，并且 $${n} \\cdot ${n + step} = ${product}$。`,
              ),
            ],
          ),
        });
      },
    },
    {
      id: "falling-objects",
      title: t("Objects thrown into the air", "抛出的物体"),
      explanation: t(
        `The height of an object thrown upward is often modeled by $h = -16t^{2} + v t + h_{0}$ in feet, or $h = -5t^{2} + v t + h_{0}$ in meters, $t$ seconds after it is thrown: $h_{0}$ is the starting height and $v$ the starting speed upward. It hits the ground when $h = 0$:

$$-16t^{2} + 32t + 48 = 0 \\Rightarrow -16(t^{2} - 2t - 3) = 0 \\Rightarrow -16(t - 3)(t + 1) = 0$$

So $t = 3$ or $t = -1$. The model only describes the time after the throw, so the object lands after $3$ seconds. Check: $-16 \\cdot 9 + 32 \\cdot 3 + 48 = 0$.

> **Watch out.** The factor $t + 1$ gives $t = -1$, not $t = 1$: each factor is $0$ at the opposite of its number. And $-1$ is rejected, because it is before the throw.`,
        `向上抛出的物体，在抛出 $t$ 秒后的高度常用 $h = -16t^{2} + vt + h_{0}$（单位：英尺）或 $h = -5t^{2} + vt + h_{0}$（单位：米）来描述：$h_{0}$ 是起始高度，$v$ 是向上的初速度。物体落地时 $h = 0$：

$$-16t^{2} + 32t + 48 = 0 \\Rightarrow -16(t^{2} - 2t - 3) = 0 \\Rightarrow -16(t - 3)(t + 1) = 0$$

所以 $t = 3$ 或 $t = -1$。这个模型只描述抛出之后的时间，所以物体在 $3$ 秒后落地。检验：$-16 \\cdot 9 + 32 \\cdot 3 + 48 = 0$。

> **注意。** 因式 $t + 1$ 给出 $t = -1$，而不是 $t = 1$：每个因式在它的数的相反数处为 $0$。而 $-1$ 要舍去，因为那是在抛出之前。`,
      ),
      generate(rng) {
        const big = rng.int(2, 8);
        const small = rng.int(1, big - 1);
        const feet = rng.bool();
        const g = feet ? 16 : 5;
        const v = g * (big - small);
        const h0 = g * big * small;
        const h = `${quad(-g, v, h0, "t")}`;
        const unitEn = feet ? "feet" : "meters";
        const unitZh = feet ? "英尺" : "米";
        return numberProblem({
          prompt: t(
            `A ball is thrown upward from a height of $${h0}$ ${unitEn}. Its height after $t$ seconds is $h = ${h}$ ${unitEn}. After how many seconds does it hit the ground?`,
            `一个球从 $${h0}$ ${unitZh}高处向上抛出，$t$ 秒后它的高度是 $h = ${h}$ ${unitZh}。它在多少秒后落地？`,
          ),
          answer: big,
          unit: "s",
          wrong: [-small, small, big - small],
          solution: worked(
            [
              {
                title: t("Set the height to $0$", "令高度为 $0$"),
                body: t(`On the ground the height is $0$:${steps(`${h} = 0`)}`, `落地时高度为 $0$：${steps(`${h} = 0`)}`),
              },
              {
                title: t("Solve it", "解方程"),
                body: t(
                  `Take out the common factor $-${g}$, then factor what is left:${steps(`-${g}(${quad(1, small - big, -big * small, "t")}) = 0`, `-${g}(t - ${big})(t + ${small}) = 0`)}So $t = ${big}$ or $t = -${small}$.`,
                  `提取公因数 $-${g}$，再分解剩下的部分：${steps(`-${g}(${quad(1, small - big, -big * small, "t")}) = 0`, `-${g}(t - ${big})(t + ${small}) = 0`)}所以 $t = ${big}$ 或 $t = -${small}$。`,
                ),
              },
              {
                title: t("Keep the solution that fits", "保留符合实际的解"),
                body: t(
                  `The model describes the time after the throw, so $t$ cannot be negative. The ball lands after $${big}$ seconds.`,
                  `这个模型描述的是抛出之后的时间，$t$ 不能是负数。球在 $${big}$ 秒后落地。`,
                ),
              },
            ],
            [
              t(
                `**Check.** At $t = ${big}$:${steps(`-${g} \\cdot ${big}^{2} + ${v} \\cdot ${big} + ${h0} = ${-g * big * big} + ${v * big} + ${h0} = 0`)}`,
                `**检验。** 当 $t = ${big}$ 时：${steps(`-${g} \\cdot ${big}^{2} + ${v} \\cdot ${big} + ${h0} = ${-g * big * big} + ${v * big} + ${h0} = 0`)}`,
              ),
            ],
          ),
        });
      },
    },
  ],
};

/** twoStepLines solves m·u + n = R for the unknown u, one operation per line. */
function twoStepLines(m: number, n: number, R: number, u: string): string[] {
  const lines = [`${linear(m, n, u)} = ${R}`];
  if (m !== 1) lines.push(`${poly([m, u])} = ${R - n}`);
  lines.push(`${u} = ${num(Q.of(R - n, m))}`);
  return lines;
}

/** valueAt writes m·v + n with v put in, for a check. */
const valueAt = (m: number, v: number, n: number) => `${m === 1 ? "" : `${m} \\cdot `}${paren(v)} ${n < 0 ? "-" : "+"} ${Math.abs(n)}`;

export const equatingPolynomialCoefficients: TopicDef = {
  id: "equating-polynomial-coefficients",
  title: t("Equating Polynomial Coefficients", "比较多项式的系数"),
  summary: t(
    "Find unknown constants in a polynomial identity by equating the coefficients of like powers of $x$.",
    "比较 $x$ 的同次幂的系数，求多项式恒等式中的未知常数。",
  ),
  prerequisites: ["multiplying-binomials", "two-step-equations"],
  encompasses: [
    { topic: "multiplying-binomials", weight: 0.3 },
    { topic: "two-step-equations", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.APR.A.1"],
  intro: t(
    `We can multiply binomials and solve two-step equations. Put the two together: for which number $a$ is $(x + a)(x + 3) = x^{2} + 5x + 6$ true for **every** value of $x$? Expanding the left side gives

$$x^{2} + (a + 3)x + 3a = x^{2} + 5x + 6$$

Two polynomials that agree for every $x$ must have the same coefficients, power by power. So $a + 3 = 5$ and $3a = 6$, and both give $a = 2$. Indeed $(x + 2)(x + 3) = x^{2} + 5x + 6$. Matching coefficients turns one identity into several small equations, one for each power of $x$. In this lesson we use it to find unknown constants, with one, two or three of them.`,
    `我们会做二项式乘法，也会解两步方程。把两者结合起来：$a$ 取什么数时，$(x + a)(x + 3) = x^{2} + 5x + 6$ 对 $x$ 的**每一个**值都成立？展开左边得

$$x^{2} + (a + 3)x + 3a = x^{2} + 5x + 6$$

对每个 $x$ 都相等的两个多项式，每个次幂的系数必须分别相等。所以 $a + 3 = 5$，$3a = 6$，两者都给出 $a = 2$。确实，$(x + 2)(x + 3) = x^{2} + 5x + 6$。比较系数把一个恒等式变成几个小方程，$x$ 的每个次幂一个。这节课我们用它求一个、两个或三个未知常数。`,
  ),
  knowledgePoints: [
    {
      id: "matching-coefficients",
      title: t("Matching coefficients", "对应系数相等"),
      explanation: t(
        `Two polynomials are equal **for every value of $x$** exactly when the coefficients of each power of $x$ are equal. The reason: if some coefficients differed, the difference of the two sides would be a nonzero polynomial of degree at most $2$, and such a polynomial is $0$ for at most two values of $x$, not for all of them. So from

$$(2a - 1)x^{2} + (b + 4)x - 3 = 5x^{2} - 2x - 3$$

we get $2a - 1 = 5$ and $b + 4 = -2$, so $a = 3$ and $b = -6$.

> **Watch out.** Solve each equation by undoing in reverse order: $2a - 1 = 5$ gives $2a = 6$ by **adding** $1$, then $a = 3$. Adding when you should subtract, or dividing before dealing with the $-1$, gives a wrong $a$. And match like with like: $a$ comes from $x^{2}$ and $b$ from $x$ here.`,
        `两个多项式**对 $x$ 的每一个值**都相等，当且仅当 $x$ 的每个次幂的系数都相等。原因是：如果有系数不同，两边之差就是一个不为零、次数不超过 $2$ 的多项式，而这样的多项式最多在两个 $x$ 值处为 $0$，不会处处为 $0$。所以由

$$(2a - 1)x^{2} + (b + 4)x - 3 = 5x^{2} - 2x - 3$$

得 $2a - 1 = 5$，$b + 4 = -2$，所以 $a = 3$，$b = -6$。

> **注意。** 解每个方程时按相反的顺序逆运算：$2a - 1 = 5$ 两边**加** $1$ 得 $2a = 6$，再得 $a = 3$。该减时加，或者没处理 $-1$ 就先除，都会得到错误的 $a$。还要同类对应：这里 $a$ 来自 $x^{2}$ 项，$b$ 来自 $x$ 项。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.nonZero(-9, 9);
        const m = rng.int(1, 4);
        const n = rng.nonZero(-9, 9);
        const u = rng.int(1, 3);
        const w = rng.nonZero(-9, 9);
        const c = rng.int(-9, 9);
        const A = m * a + n;
        const B = u * b + w;
        const left = `(${linear(m, n, "a")})x^{2} + (${linear(u, w, "b")})x${tail(c)}`;
        const right = quad(A, B, c);
        return pointProblem({
          prompt: t(
            `The equation $${left} = ${right}$ holds for every value of $x$. Find $a$ and $b$.`,
            `等式 $${left} = ${right}$ 对 $x$ 的每一个值都成立。求 $a$ 和 $b$。`,
          ),
          answer: [a, b],
          vars: ["a", "b"],
          wrong: [
            [Q.of(A + n, m), Q.of(B + w, u)],
            [b, a],
            [Q.of(A, m), Q.of(B, u)],
          ],
          solution: worked(
            [
              {
                title: t("Match the coefficients of $x^{2}$", "令 $x^{2}$ 的系数相等"),
                body: t(
                  `On the left the coefficient of $x^{2}$ is $${linear(m, n, "a")}$, on the right $${A}$:${steps(...twoStepLines(m, n, A, "a"))}`,
                  `左边 $x^{2}$ 的系数是 $${linear(m, n, "a")}$，右边是 $${A}$：${steps(...twoStepLines(m, n, A, "a"))}`,
                ),
              },
              {
                title: t("Match the coefficients of $x$", "令 $x$ 的系数相等"),
                body: t(
                  `On the left the coefficient of $x$ is $${linear(u, w, "b")}$, on the right $${B}$:${steps(...twoStepLines(u, w, B, "b"))}${c === 0 ? "Neither side has a constant term." : `The constant terms are $${c}$ on both sides already.`}`,
                  `左边 $x$ 的系数是 $${linear(u, w, "b")}$，右边是 $${B}$：${steps(...twoStepLines(u, w, B, "b"))}${c === 0 ? "两边都没有常数项。" : `两边的常数项本来就都是 $${c}$。`}`,
                ),
              },
            ],
            [
              t(
                `**Check.** With $a = ${a}$ and $b = ${b}$ the coefficients on the left are${steps(`${valueAt(m, a, n)} = ${A}, \\quad ${valueAt(u, b, w)} = ${B}`)}the same as on the right.`,
                `**检验。** 当 $a = ${a}$，$b = ${b}$ 时，左边的系数是${steps(`${valueAt(m, a, n)} = ${A}, \\quad ${valueAt(u, b, w)} = ${B}`)}与右边相同。`,
              ),
            ],
          ),
        });
      },
    },
    {
      id: "expanding-first",
      title: t("Expanding first", "先展开"),
      explanation: t(
        `When one side is a product, expand it first, so that each power of $x$ has one coefficient to compare:

$$(x + a)(x + 3) = x^{2} + bx - 12$$

$$x^{2} + (a + 3)x + 3a = x^{2} + bx - 12$$

The constant terms give $3a = -12$, so $a = -4$; the coefficients of $x$ give $b = a + 3 = -1$.

> **Watch out.** The constant term $3a$ is a product, so $3a = -12$ is solved by dividing, $a = -4$, not by subtracting. And the coefficient of $x$ collects both cross terms, $ax$ and $3x$: it is $a + 3$.`,
        `当一边是乘积时，先展开，使 $x$ 的每个次幂只有一个系数可以比较：

$$(x + a)(x + 3) = x^{2} + bx - 12$$

$$x^{2} + (a + 3)x + 3a = x^{2} + bx - 12$$

常数项给出 $3a = -12$，所以 $a = -4$；$x$ 的系数给出 $b = a + 3 = -1$。

> **注意。** 常数项 $3a$ 是乘积，所以解 $3a = -12$ 要用除法，得 $a = -4$，而不是用减法。$x$ 的系数要把两个交叉项 $ax$ 和 $3x$ 都算上：它是 $a + 3$。`,
      ),
      generate(rng) {
        const q = rng.pick([1, 1, 2, 3]);
        const p = rng.nonZero(-9, 9);
        const a = rng.nonZero(-9, 9);
        const C = a * p;
        const b = q * p + a;
        const left = `(${q === 1 ? "" : q}x + a)${lf(1, p)}`;
        const right = `${poly([q, "x^{2}"])} + bx${tail(C)}`;
        const constantLines = p === 1 ? [`a = ${C}`] : [`${poly([p, "a"])} = ${C}`, `a = ${a}`];
        const expanded = `${poly([q, "x^{2}"])} + (${q * p} + a)x ${p < 0 ? "-" : "+"} ${Math.abs(p) === 1 ? "" : Math.abs(p)}a`;
        return pointProblem({
          prompt: t(
            `The equation $${left} = ${right}$ holds for every value of $x$. Find $a$ and $b$.`,
            `等式 $${left} = ${right}$ 对 $x$ 的每一个值都成立。求 $a$ 和 $b$。`,
          ),
          answer: [a, b],
          vars: ["a", "b"],
          wrong: [
            [-a, q * p - a],
            [a, a + p],
            [C - p, q * p + C - p],
          ],
          solution: worked(
            [
              {
                title: t("Expand the left side", "展开左边"),
                body: t(
                  `Multiply each term of the first factor by each term of the second:${steps(`${left} = ${expanded}`)}`,
                  `用第一个因式的每一项乘第二个因式的每一项：${steps(`${left} = ${expanded}`)}`,
                ),
              },
              {
                title: t("Match the constant terms", "令常数项相等"),
                body: t(`The constant term has only $a$ in it:${steps(...constantLines)}`, `常数项中只含 $a$：${steps(...constantLines)}`),
              },
              {
                title: t("Match the coefficients of $x$", "令 $x$ 的系数相等"),
                body: t(
                  `Now put $a = ${a}$ into the coefficient of $x$:${steps(`b = ${q * p} + a = ${q * p} ${a < 0 ? "-" : "+"} ${Math.abs(a)} = ${b}`)}`,
                  `把 $a = ${a}$ 代入 $x$ 的系数：${steps(`b = ${q * p} + a = ${q * p} ${a < 0 ? "-" : "+"} ${Math.abs(a)} = ${b}`)}`,
                ),
              },
            ],
            [
              t(
                `**Check.** Expand with $a = ${a}$:${steps(`${lf(q, a)}${lf(1, p)} = ${quad(q, b, C)}`)}This is the right side with $b = ${b}$.`,
                `**检验。** 取 $a = ${a}$ 展开：${steps(`${lf(q, a)}${lf(1, p)} = ${quad(q, b, C)}`)}这正是 $b = ${b}$ 时的右边。`,
              ),
            ],
          ),
        });
      },
    },
    {
      id: "three-unknowns",
      title: t("Three unknowns", "三个未知数"),
      explanation: t(
        `Each power of $x$ gives one equation. Solve the ones with a single unknown first, then use their answers in the rest:

$$(ax + 2)(3x + b) = 6x^{2} + cx - 10$$

$$3ax^{2} + (ab + 6)x + 2b = 6x^{2} + cx - 10$$

So $3a = 6$ and $2b = -10$: $a = 2$, $b = -5$, and then $c = ab + 6 = -10 + 6 = -4$.

> **Watch out.** The coefficient of $x$ has two parts, one from each cross product: $ax \\cdot b$ and $2 \\cdot 3x$. So $c = ab + 6$, not $ab$ alone, and not $3a + 2b$, which adds the wrong pairs.`,
        `$x$ 的每个次幂给出一个方程。先解只含一个未知数的方程，再把结果代入其余的方程：

$$(ax + 2)(3x + b) = 6x^{2} + cx - 10$$

$$3ax^{2} + (ab + 6)x + 2b = 6x^{2} + cx - 10$$

所以 $3a = 6$，$2b = -10$：$a = 2$，$b = -5$，于是 $c = ab + 6 = -10 + 6 = -4$。

> **注意。** $x$ 的系数有两部分，分别来自两个交叉乘积：$ax \\cdot b$ 和 $2 \\cdot 3x$。所以 $c = ab + 6$，不是只有 $ab$，也不是把错误的两项相加的 $3a + 2b$。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-9, 9);
        const p = rng.nonZero(-7, 7);
        const q = rng.int(2, 5);
        const A = a * q;
        const B = p * b;
        const c = a * b + p * q;
        const left = `(ax${tail(p)})(${q}x + b)`;
        const right = `${poly([A, "x^{2}"])} + cx${tail(B)}`;
        const pq = `${p * q < 0 ? "-" : "+"} ${Math.abs(p * q)}`;
        return pointProblem({
          prompt: t(
            `The equation $${left} = ${right}$ holds for every value of $x$. Find $a$, $b$ and $c$.`,
            `等式 $${left} = ${right}$ 对 $x$ 的每一个值都成立。求 $a$、$b$ 和 $c$。`,
          ),
          answer: [a, b, c],
          vars: ["a", "b", "c"],
          wrong: [
            [a, b, a * b],
            [a, b, a * b - p * q],
            [a, b, a * q + p * b],
          ],
          solution: worked(
            [
              {
                title: t("Expand the left side", "展开左边"),
                body: t(
                  `Multiply each term of the first factor by each term of the second, and collect the two terms in $x$:${steps(`${left} = ${poly([q, "ax^{2}"])} + (ab ${pq})x ${p < 0 ? "-" : "+"} ${poly([Math.abs(p), "b"])}`)}`,
                  `用第一个因式的每一项乘第二个因式的每一项，再合并两个含 $x$ 的项：${steps(`${left} = ${poly([q, "ax^{2}"])} + (ab ${pq})x ${p < 0 ? "-" : "+"} ${poly([Math.abs(p), "b"])}`)}`,
                ),
              },
              {
                title: t("Match $x^{2}$ and the constants", "令 $x^{2}$ 的系数和常数项相等"),
                body: t(
                  `Each of these has a single unknown:${steps(`${q}a = ${A} \\Rightarrow a = ${a}`, p === 1 ? `b = ${b}` : `${poly([p, "b"])} = ${B} \\Rightarrow b = ${b}`)}`,
                  `它们各自只含一个未知数：${steps(`${q}a = ${A} \\Rightarrow a = ${a}`, p === 1 ? `b = ${b}` : `${poly([p, "b"])} = ${B} \\Rightarrow b = ${b}`)}`,
                ),
              },
              {
                title: t("Match the coefficients of $x$", "令 $x$ 的系数相等"),
                body: t(
                  `Put $a$ and $b$ into the coefficient of $x$:${steps(`c = ab ${pq} = ${paren(a)} \\cdot ${paren(b)} ${pq} = ${c}`)}`,
                  `把 $a$ 和 $b$ 代入 $x$ 的系数：${steps(`c = ab ${pq} = ${paren(a)} \\cdot ${paren(b)} ${pq} = ${c}`)}`,
                ),
              },
            ],
            [
              t(
                `**Check.** Expand with $a = ${a}$ and $b = ${b}$:${steps(`${lf(a, p)}${lf(q, b)} = ${quad(A, c, B)}`)}This is the right side with $c = ${c}$.`,
                `**检验。** 取 $a = ${a}$，$b = ${b}$ 展开：${steps(`${lf(a, p)}${lf(q, b)} = ${quad(A, c, B)}`)}这正是 $c = ${c}$ 时的右边。`,
              ),
            ],
          ),
        });
      },
    },
  ],
};

export const vietasFormulas: TopicDef = {
  id: "vietas-formulas",
  title: t("Vieta's Formulas", "韦达定理"),
  summary: t(
    "Relate the sum and product of the solutions of $ax^{2} + bx + c = 0$ to its coefficients: $-\\frac{b}{a}$ and $\\frac{c}{a}$.",
    "把 $ax^{2} + bx + c = 0$ 的两根之和与两根之积与系数联系起来：$-\\frac{b}{a}$ 与 $\\frac{c}{a}$。",
  ),
  prerequisites: ["equating-polynomial-coefficients", "solving-quadratic-equations-by-factoring"],
  encompasses: [{ topic: "multiplying-binomials", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSA.APR.B.2"],
  intro: t(
    `Factoring $x^{2} - 7x + 12 = 0$ as $(x - 3)(x - 4) = 0$ gives the solutions $3$ and $4$. Look at them next to the coefficients: their sum $3 + 4 = 7$ is the coefficient of $x$ with its sign changed, and their product $3 \\cdot 4 = 12$ is the constant. This is no accident. Expanding $(x - r)(x - s)$ and equating coefficients gives

$$x^{2} - (r + s)x + rs$$

So the coefficients carry the sum and the product of the solutions, even when the solutions are hard to find. For $x^{2} - 6x + 7 = 0$ the solutions are $3 \\pm \\sqrt{2}$, yet we can say at once that they add to $6$ and multiply to $7$. In this lesson we read sums and products off an equation, find a missing solution, and build an equation from its solutions.`,
    `把 $x^{2} - 7x + 12 = 0$ 分解为 $(x - 3)(x - 4) = 0$，得解 $3$ 和 $4$。把它们和系数放在一起看：两根之和 $3 + 4 = 7$ 是 $x$ 的系数变号，两根之积 $3 \\cdot 4 = 12$ 是常数项。这不是巧合。展开 $(x - r)(x - s)$ 并比较系数，得

$$x^{2} - (r + s)x + rs$$

所以即使解很难求，系数里也含有两根之和与两根之积。$x^{2} - 6x + 7 = 0$ 的解是 $3 \\pm \\sqrt{2}$，但我们立刻就能说出它们的和是 $6$，积是 $7$。这节课我们从方程直接读出两根之和与积，求另一个根，并由已知解写出方程。`,
  ),
  knowledgePoints: [
    {
      id: "sum-and-product",
      title: t("The sum and the product of the solutions", "两根之和与两根之积"),
      explanation: t(
        `If $r$ and $s$ are the solutions of $ax^{2} + bx + c = 0$, then $ax^{2} + bx + c = a(x - r)(x - s) = ax^{2} - a(r + s)x + ars$. Equating coefficients gives $b = -a(r + s)$ and $c = ars$, which are **Vieta's formulas**:

$$r + s = -\\frac{b}{a} \\qquad rs = \\frac{c}{a}$$

For $2x^{2} - 7x + 3 = 0$, the sum of the solutions is $-\\frac{-7}{2} = \\frac{7}{2}$ and the product is $\\frac{3}{2}$, without solving the equation. Indeed the solutions are $3$ and $\\frac{1}{2}$.

> **Watch out.** The sum has a minus sign and the product does not: here the sum is $\\frac{7}{2}$, not $-\\frac{7}{2}$. Both are divided by $a$; with $a = 2$, the sum is not $7$. And the sum uses $b$, the product $c$.`,
        `如果 $r$ 和 $s$ 是 $ax^{2} + bx + c = 0$ 的两个解，那么 $ax^{2} + bx + c = a(x - r)(x - s) = ax^{2} - a(r + s)x + ars$。比较系数得 $b = -a(r + s)$，$c = ars$，这就是**韦达定理**：

$$r + s = -\\frac{b}{a} \\qquad rs = \\frac{c}{a}$$

对 $2x^{2} - 7x + 3 = 0$，不解方程就知道两根之和是 $-\\frac{-7}{2} = \\frac{7}{2}$，两根之积是 $\\frac{3}{2}$。确实，它的解是 $3$ 和 $\\frac{1}{2}$。

> **注意。** 和有负号，积没有：这里和是 $\\frac{7}{2}$，不是 $-\\frac{7}{2}$。两者都要除以 $a$；$a = 2$ 时，和不是 $7$。还有，和用的是 $b$，积用的是 $c$。`,
      ),
      generate(rng) {
        let a: number;
        let b: number;
        let c: number;
        do {
          a = rng.pick([1, 1, 2, 3, 4, 5, -1, -2]);
          b = rng.nonZero(-12, 12);
          c = rng.nonZero(-12, 12);
        } while (b * b - 4 * a * c <= 0);
        const askSum = rng.bool();
        const answer = askSum ? Q.of(-b, a) : Q.of(c, a);
        const d = b * b - 4 * a * c;
        const read: Step = {
          title: t("Read off the coefficients", "读出系数"),
          body: t(
            `In $${quad(a, b, c)} = 0$, ${askSum ? `$a = ${a}$ and $b = ${b}$` : `$a = ${a}$ and $c = ${c}$`}. The discriminant $${d}$ is positive, so there are two real solutions to add or multiply.`,
            `在 $${quad(a, b, c)} = 0$ 中，${askSum ? `$a = ${a}$，$b = ${b}$` : `$a = ${a}$，$c = ${c}$`}。判别式 $${d}$ 为正，所以有两个实数解可以相加或相乘。`,
          ),
        };
        const use: Step = askSum
          ? {
              title: t("Use the formula for the sum", "用两根之和的公式"),
              body: t(
                `The sum is $-\\frac{b}{a}$: change the sign of $b$ and divide by $a$:${steps(`r + s = -\\frac{b}{a} = ${num(answer)}`)}`,
                `两根之和是 $-\\frac{b}{a}$：把 $b$ 变号，再除以 $a$：${steps(`r + s = -\\frac{b}{a} = ${num(answer)}`)}`,
              ),
            }
          : {
              title: t("Use the formula for the product", "用两根之积的公式"),
              body: t(
                `The product is $\\frac{c}{a}$, with no change of sign:${steps(`rs = \\frac{c}{a} = ${num(answer)}`)}`,
                `两根之积是 $\\frac{c}{a}$，不变号：${steps(`rs = \\frac{c}{a} = ${num(answer)}`)}`,
              ),
            };
        const m = Q.of(-b, 2 * a);
        const root = isSquare(d) ? num(Q.of(Math.sqrt(d), 2 * Math.abs(a))) : `\\frac{\\sqrt{${d}}}{${2 * Math.abs(a)}}`;
        const base = m.isInteger() ? (m.sign() < 0 ? `(${num(m)})` : num(m)) : `\\left(${num(m)}\\right)`;
        const line = askSum
          ? `\\left(${num(m)} + ${root}\\right) + \\left(${num(m)} - ${root}\\right) = ${num(answer)}`
          : `${base}^{2} - \\left(${root}\\right)^{2} = ${num(m.mul(m))} - ${num(Q.of(d, 4 * a * a))} = ${num(answer)}`;
        const check = t(
          `**Check.** By the quadratic formula the solutions are $${num(m)} \\pm ${root}$. ${askSum ? `Adding them, the $\\pm$ parts cancel:` : "Multiplying them is a difference of squares:"}${steps(line)}`,
          `**检验。** 由求根公式，两个解是 $${num(m)} \\pm ${root}$。${askSum ? "相加时 $\\pm$ 的部分抵消：" : "相乘是平方差："}${steps(line)}`,
        );
        return numberProblem({
          prompt: t(
            `What is the ${askSum ? "sum" : "product"} of the solutions of $${quad(a, b, c)} = 0$?`,
            `方程 $${quad(a, b, c)} = 0$ 的两根之${askSum ? "和" : "积"}是多少？`,
          ),
          answer,
          wrong: askSum ? [Q.of(b, a), Q.of(-b), Q.of(c, a), Q.of(-a, b)] : [Q.of(-c, a), Q.of(c), Q.of(-b, a), Q.of(a, c)],
          solution: worked([read, use], [check]),
        });
      },
    },
    {
      id: "the-other-solution",
      title: t("Finding the other solution", "求另一个根"),
      explanation: t(
        `If one solution is known, Vieta's formulas give the other, even when a coefficient is unknown. Use the formula whose coefficient is known. If $x^{2} + kx + 12 = 0$ has the solution $x = 3$, the product of the solutions is $12$, so the other is $\\frac{12}{3} = 4$ (and then $k = -(3 + 4) = -7$).

If instead the coefficient of $x$ is known, use the sum: $x^{2} - 5x + k = 0$ with solution $x = 7$ has solutions adding to $5$, so the other is $5 - 7 = -2$.

> **Watch out.** From the product, **divide** by the known solution: $\\frac{12}{3} = 4$, not $12 - 3$ and not $\\frac{3}{12}$. From the sum, **subtract** it: $5 - 7 = -2$. And the sum is the coefficient of $x$ with its sign changed, $5$ here, not $-5$.`,
        `如果已知一个解，即使某个系数未知，也能由韦达定理求出另一个解。要用系数已知的那个公式。如果 $x^{2} + kx + 12 = 0$ 有解 $x = 3$，两根之积是 $12$，所以另一个解是 $\\frac{12}{3} = 4$（进而 $k = -(3 + 4) = -7$）。

如果已知的是 $x$ 的系数，就用两根之和：$x^{2} - 5x + k = 0$ 有解 $x = 7$，两根之和是 $5$，所以另一个解是 $5 - 7 = -2$。

> **注意。** 用积时要**除以**已知的解：$\\frac{12}{3} = 4$，不是 $12 - 3$，也不是 $\\frac{3}{12}$。用和时要**减去**它：$5 - 7 = -2$。而且和是 $x$ 的系数变号，这里是 $5$，不是 $-5$。`,
      ),
      generate(rng) {
        const [r, s] = drawRoots(rng, 9);
        const useProduct = rng.bool();
        const eq = useProduct ? `x^{2} + kx${tail(r * s)} = 0` : `${quad(1, -(r + s), 0)} + k = 0`;
        const k = useProduct ? -(r + s) : r * s;
        const choose: Step = useProduct
          ? {
              title: t("Use the product", "用两根之积"),
              body: t(
                `The coefficient of $x$ is unknown but the constant is known, so use the product. With $a = 1$ it is the constant itself:${steps(`${paren(r)} \\cdot x_{2} = ${r * s}`)}`,
                `$x$ 的系数未知而常数项已知，所以用两根之积。$a = 1$ 时它就是常数项：${steps(`${paren(r)} \\cdot x_{2} = ${r * s}`)}`,
              ),
            }
          : {
              title: t("Use the sum", "用两根之和"),
              body: t(
                `The constant is unknown but the coefficient of $x$ is known, so use the sum. With $a = 1$ it is the coefficient of $x$ with its sign changed:${steps(`${r} + x_{2} = ${r + s}`)}`,
                `常数项未知而 $x$ 的系数已知，所以用两根之和。$a = 1$ 时它是 $x$ 的系数变号：${steps(`${r} + x_{2} = ${r + s}`)}`,
              ),
            };
        const solve: Step = {
          title: t("Find the other solution", "求出另一个解"),
          body: useProduct
            ? t(
                `Divide by the known solution:${steps(`x_{2} = \\frac{${r * s}}{${r}} = ${s}`)}`,
                `除以已知的解：${steps(`x_{2} = \\frac{${r * s}}{${r}} = ${s}`)}`,
              )
            : t(
                `Subtract the known solution:${steps(`x_{2} = ${r + s} - ${paren(r)} = ${s}`)}`,
                `减去已知的解：${steps(`x_{2} = ${r + s} - ${paren(r)} = ${s}`)}`,
              ),
        };
        const check = t(
          `**Check.** The solutions $${r}$ and $${s}$ give ${useProduct ? `$k = -(${r} ${s < 0 ? "-" : "+"} ${Math.abs(s)}) = ${k}$` : `$k = ${paren(r)} \\cdot ${paren(s)} = ${k}$`}, and${steps(`(x ${r < 0 ? "+" : "-"} ${Math.abs(r)})(x ${s < 0 ? "+" : "-"} ${Math.abs(s)}) = ${quad(1, -(r + s), r * s)}`)}which is the equation with this $k$, so both are solutions.`,
          `**检验。** 解 $${r}$ 和 $${s}$ 给出 ${useProduct ? `$k = -(${r} ${s < 0 ? "-" : "+"} ${Math.abs(s)}) = ${k}$` : `$k = ${paren(r)} \\cdot ${paren(s)} = ${k}$`}，并且${steps(`(x ${r < 0 ? "+" : "-"} ${Math.abs(r)})(x ${s < 0 ? "+" : "-"} ${Math.abs(s)}) = ${quad(1, -(r + s), r * s)}`)}这正是取这个 $k$ 时的方程，所以两者都是解。`,
        );
        return numberProblem({
          prompt: t(
            `The equation $${eq}$ has the solution $x = ${r}$. Find its other solution.`,
            `方程 $${eq}$ 有一个解 $x = ${r}$。求它的另一个解。`,
          ),
          answer: s,
          solveFor: "x",
          wrong: useProduct ? [-s, r * s - r, Q.of(r, r * s)] : [-s, r + s + r, -(r + s) - r],
          solution: worked([choose, solve], [check]),
        });
      },
    },
    {
      id: "building-an-equation",
      title: t("An equation with given solutions", "由已知解写方程"),
      explanation: t(
        `A product is $0$ when one of its factors is, so the equation $(x - r)(x - s) = 0$ has exactly the solutions $r$ and $s$. Expanded:

$$x^{2} - (r + s)x + rs = 0$$

For the solutions $3$ and $-5$: the sum is $-2$ and the product $-15$, so $x^{2} + 2x - 15 = 0$. For a fraction such as $\\frac{1}{2}$, use the factor $2x - 1$, which is also $0$ at $x = \\frac{1}{2}$ and keeps the coefficients whole.

> **Watch out.** The factor for the solution $3$ is $x - 3$, not $x + 3$: it has to be $0$ when $x = 3$. In the expanded form the sum appears with a minus sign and the product with none; flipping either sign gives an equation with other solutions.`,
        `乘积为 $0$ 当且仅当某个因式为 $0$，所以方程 $(x - r)(x - s) = 0$ 的解恰好是 $r$ 和 $s$。展开得：

$$x^{2} - (r + s)x + rs = 0$$

对解 $3$ 和 $-5$：和是 $-2$，积是 $-15$，所以方程是 $x^{2} + 2x - 15 = 0$。对分数解，例如 $\\frac{1}{2}$，用因式 $2x - 1$，它在 $x = \\frac{1}{2}$ 时也为 $0$，并使系数保持为整数。

> **注意。** 解 $3$ 对应的因式是 $x - 3$，不是 $x + 3$：它必须在 $x = 3$ 时为 $0$。展开后，和前面带负号，积前面不带；弄反任何一个符号，得到的方程就有别的解。`,
      ),
      generate(rng) {
        const fraction = rng.bool(0.35);
        let p: number;
        let d: number;
        let s: number;
        do {
          p = rng.nonZero(-9, 9);
          d = fraction ? rng.int(2, 5) : 1;
          s = rng.nonZero(-9, 9);
        } while (gcd(p, d) !== 1 || Q.of(p, d).eq(Q.of(s)) || (!fraction && p + s === 0));
        const r = Q.of(p, d);
        const a = d;
        const b = -(p + d * s);
        const c = p * s;
        const answer = `${quad(a, b, c)} = 0`;
        const factors: Step = {
          title: t("Write a factor for each solution", "为每个解写一个因式"),
          body: t(
            `$${linear(d, -p)}$ is $0$ at $x = ${num(r)}$${fraction ? ", and its coefficients are whole numbers" : ""}; $${linear(1, -s)}$ is $0$ at $x = ${s}$. So the equation is${steps(`${lf(d, -p)}${lf(1, -s)} = 0`)}`,
            `$${linear(d, -p)}$ 在 $x = ${num(r)}$ 时为 $0$${fraction ? "，而且系数都是整数" : ""}；$${linear(1, -s)}$ 在 $x = ${s}$ 时为 $0$。所以方程是${steps(`${lf(d, -p)}${lf(1, -s)} = 0`)}`,
          ),
        };
        const expand: Step = {
          title: t("Expand", "展开"),
          body: t(`Multiply out the factors:${steps(answer)}`, `把因式乘开：${steps(answer)}`),
        };
        const sum = r.add(Q.of(s));
        const product = r.mul(Q.of(s));
        const check = t(
          `**Check.** By Vieta's formulas this equation has solutions with sum $-\\frac{b}{a} = ${num(Q.of(-b, a))}$ and product $\\frac{c}{a} = ${num(Q.of(c, a))}$, and indeed $${num(r)} + ${paren(s)} = ${num(sum)}$ and $${num(r)} \\cdot ${paren(s)} = ${num(product)}$.`,
          `**检验。** 由韦达定理，这个方程两根之和为 $-\\frac{b}{a} = ${num(Q.of(-b, a))}$，两根之积为 $\\frac{c}{a} = ${num(Q.of(c, a))}$，而确实 $${num(r)} + ${paren(s)} = ${num(sum)}$，$${num(r)} \\cdot ${paren(s)} = ${num(product)}$。`,
        );
        return equationProblem({
          prompt: t(
            `Write a quadratic equation in $x$ whose solutions are $x = ${num(r)}$ and $x = ${s}$.`,
            `写一个关于 $x$ 的一元二次方程，使它的解是 $x = ${num(r)}$ 和 $x = ${s}$。`,
          ),
          answer,
          wrong: [`${quad(a, -b, c)} = 0`, `${quad(a, b, -c)} = 0`, `${quad(a, -b, -c)} = 0`],
          solution: worked([factors, expand], [check]),
        });
      },
    },
  ],
};

/** quadraticEquationTopics are the topics of the quadratic equations module, in teaching order. */
export const quadraticEquationTopics: readonly TopicDef[] = [
  introductionToQuadraticEquations,
  solvingPerfectSquareQuadraticEquations,
  zeroProductRule,
  solvingQuadraticEquationsUsingADifferenceOfSquares,
  solvingQuadraticEquationsWithNoConstantTerm,
  solvingQuadraticEquationsByFactoring,
  solvingQuadraticEquationsWithLeadingCoefficientsByFactoring,
  completingTheSquare,
  completingTheSquareWithLeadingCoefficients,
  solvingQuadraticEquationsByCompletingTheSquare,
  solvingQuadraticEquationsWithLeadingCoefficientsByCompletingTheSquare,
  theQuadraticFormula,
  theDiscriminantOfAQuadraticEquation,
  quadraticEquationsWithOneRealSolution,
  modelingWithQuadraticEquations,
  equatingPolynomialCoefficients,
  vietasFormulas,
];
