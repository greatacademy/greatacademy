// Further knowledge points for topics of Differential Equations, each a skill the
// topic's own points leave out. See `deeperDifferentialEquationsPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { dec, poly, Q } from "@ga/subject-math";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";
import { differentialEquationsDrawings1 } from "../explanation-drawings-differential-equations-1.ts";
import { multivariableDrawings8 } from "../explanation-drawings-multivariable-8.ts";

import { lowestTerms, numberProblem, why } from "../problems.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";

/** nonzero picks a nonzero integer from -r to r. */
const nonzero = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** inParens puts a negative number in parentheses, for use inside a sum. */
const inParens = (n: number) => (n < 0 ? `(${n})` : `${n}`);
/** different picks an integer from lo to hi other than the one given. */
const different = (rng: Rng, lo: number, hi: number, other: number) =>
  rng.pick([...Array(hi - lo + 1).keys()].map((i) => i + lo).filter((i) => i !== other));
/** matrix2 writes a two-by-two matrix by its rows. */
const matrix2 = (a: number | string, b: number | string, c: number | string, d: number | string) =>
  `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
/** decimal writes a whole number of tenths as a decimal. */
const decimal = (n: number) => `${n / 10}`;
/** complexRoots writes the conjugate roots with real part -p and imaginary part q. */
const complexRoots = (p: number, q: number) => `${-p} \\pm ${q === 1 ? "" : q}i`;

const levelThroughAPoint: KnowledgePointDef = {
  id: "the-level-of-the-solution-through-a-point",
  title: t("The level of the solution through a point", "过一点的解所在的等值线"),
  explanation: t(
    "The solutions of an exact equation $M\\,dx + N\\,dy = 0$ are the level curves $F(x, y) = C$ of its potential function. An initial condition picks one of these curves. So build $F$ with $F_x = M$ and $F_y = N$, and evaluate it at the given point to find $C$. For $(2x + y)\\,dx + (x + 2y)\\,dy = 0$, $F = x^{2} + xy + y^{2}$, and through $(1, 2)$ the curve is $F = 7$.\n\n> **Watch out.** The term $xy$ appears when integrating $M$ and again when integrating $N$, but it belongs in $F$ only once. Adding both integrals counts it twice.",
    "恰当方程 $M\\,dx + N\\,dy = 0$ 的解是势函数的等值线 $F(x, y) = C$。初始条件选出其中一条。所以先由 $F_x = M$ 和 $F_y = N$ 构造 $F$，再把给定的点代入，求出 $C$。对 $(2x + y)\\,dx + (x + 2y)\\,dy = 0$，$F = x^{2} + xy + y^{2}$，过 $(1, 2)$ 的曲线是 $F = 7$。\n\n> **注意。** 对 $M$ 积分和对 $N$ 积分都会出现 $xy$ 项，但它在 $F$ 中只出现一次。把两个积分相加会把它算两次。",
  ),
  generate(rng) {
    const a = rng.int(1, 4);
    const b = nonzero(rng, 5);
    const c = rng.int(1, 4);
    const p = nonzero(rng, 4);
    const q = nonzero(rng, 4);
    const answer = a * p * p + b * p * q + c * q * q;
    const M = poly([2 * a, "x"], [b, "y"]);
    const N = poly([b, "x"], [2 * c, "y"]);
    const F = poly([a, "x^2"], [b, "xy"], [c, "y^2"]);
    return explainedNumber(
      [
        `The solution of $(${M})\\,dx + (${N})\\,dy = 0$ through the point $(${p}, ${q})$ is the curve $F(x, y) = C$, where $F$ has no constant term. Find $C$.`,
        `$(${M})\\,dx + (${N})\\,dy = 0$ 过点 $(${p}, ${q})$ 的解是曲线 $F(x, y) = C$，其中 $F$ 没有常数项。求 $C$。`,
      ],
      answer,
      [
        labelled(
          ["Build the potential", "构造势函数"],
          `Integrating $M$ in $x$ gives $${poly([a, "x^2"], [b, "xy"])} + h(y)$. Then $F_y = ${poly([b, "x"])} + h'(y)$ must equal $N$, so $h'(y) = ${poly([2 * c, "y"])}$ and $h(y) = ${poly([c, "y^2"])}$.`,
          `对 $M$ 关于 $x$ 积分得 $${poly([a, "x^2"], [b, "xy"])} + h(y)$。于是 $F_y = ${poly([b, "x"])} + h'(y)$ 必须等于 $N$，所以 $h'(y) = ${poly([2 * c, "y"])}$，$h(y) = ${poly([c, "y^2"])}$。`,
          `F(x, y) = ${F}`,
        ),
        labelled(
          ["Evaluate at the point", "代入该点"],
          "",
          "",
          `C = ${a === 1 ? "" : `${a} \\cdot `}${inParens(p)}^{2} + ${inParens(b)} \\cdot ${inParens(p)} \\cdot ${inParens(q)} + ${c === 1 ? "" : `${c} \\cdot `}${inParens(q)}^{2} = ${answer}`,
        ),
      ],
      [
        `$F_x = ${M}$ and $F_y = ${N}$, so $F$ is a potential for the equation, and the point $(${p}, ${q})$ gives $F = ${answer}$.`,
        `$F_x = ${M}$，$F_y = ${N}$，所以 $F$ 是该方程的势函数，点 $(${p}, ${q})$ 给出 $F = ${answer}$。`,
      ],
      [
        [a * p * p + c * q * q, "That leaves out the cross term $xy$ of $F$.", "这里漏掉了 $F$ 中的交叉项 $xy$。"],
        [
          2 * answer,
          "That takes $F = Mx + Ny$; $F$ comes from integrating $M$ and $N$, which halves each term.",
          "这是取了 $F = Mx + Ny$；$F$ 要对 $M$、$N$ 积分得到，每一项都要减半。",
        ],
        [
          a * p * p + 2 * b * p * q + c * q * q,
          "That counts the term $xy$ twice, once from each integration; it belongs in $F$ only once.",
          "这里把 $xy$ 项算了两次，两次积分各算一次；它在 $F$ 中只出现一次。",
        ],
      ],
      "integer",
    );
  },
};

const bifurcationValue: KnowledgePointDef = {
  id: "the-parameter-where-equilibria-appear",
  title: t("The parameter where equilibria appear", "平衡解出现时的参数值"),
  explanation: t(
    "As a parameter changes, the equilibria of an equation can merge and vanish. This change is called a bifurcation. For a quadratic right-hand side, the equilibria are its roots, and the change happens where the discriminant is zero. At that value there is exactly one equilibrium. For $y' = 2y^{2} + 8y + k$, the discriminant $64 - 8k$ is zero at $k = 8$, where the only equilibrium is $y = -2$.\n\n> **Watch out.** The discriminant of $ay^{2} + by + k$ is $b^{2} - 4ak$: the factor $4a$ divides $b^{2}$, so $k = \\frac{b^{2}}{4a}$, and $k$ has the same sign as $a$ here.",
    "参数变化时，方程的平衡解可能合并并消失，这种变化叫作分岔。右端是二次式时，平衡解就是它的根，变化发生在判别式为零的地方。此时恰有一个平衡解。对 $y' = 2y^{2} + 8y + k$，判别式 $64 - 8k$ 在 $k = 8$ 时为零，此时唯一的平衡解是 $y = -2$。\n\n> **注意。** $ay^{2} + by + k$ 的判别式是 $b^{2} - 4ak$：要用 $4a$ 去除 $b^{2}$，所以 $k = \\frac{b^{2}}{4a}$，这里 $k$ 与 $a$ 同号。",
  ),
  generate(rng) {
    const a = rng.int(1, 4);
    const B = nonzero(rng, 9);
    const answer = a * B * B;
    const right = poly([a, "y^2"], [2 * a * B, "y"]);
    const disc = 4 * a * a * B * B;
    return numberProblem({
      prompt: t(
        `For which value of $k$ does $y' = ${right} + k$ have exactly one equilibrium solution?`,
        `$k$ 取何值时 $y' = ${right} + k$ 恰有一个平衡解？`,
      ),
      answer,
      solveFor: "k",
      mistakes: [
        ...(a === 1 ? [] : [why(B * B, `That leaves out the leading coefficient $${a}$.`, `这里漏掉了首项系数 $${a}$。`)]),
        why(
          -answer,
          "The sign is flipped; $b^{2} - 4ak = 0$ gives $k = \\frac{b^{2}}{4a}$, which is positive here.",
          "符号反了；由 $b^{2} - 4ak = 0$ 得 $k = \\frac{b^{2}}{4a}$，这里是正的。",
        ),
        why(
          4 * answer,
          `That divides $b^{2}$ by $${a}$ only; the discriminant has $4 \\cdot ${a} \\cdot k$.`,
          `这里只用 $${a}$ 去除 $b^{2}$；判别式中是 $4 \\cdot ${a} \\cdot k$。`,
        ),
      ],
      solution: walked(
        [
          [
            ["Set the discriminant to zero", "令判别式为零"],
            t("The equilibria are the roots of the right side, and there is exactly one when", "平衡解是右端的根，恰有一个当且仅当"),
            [`${inParens(2 * a * B)}^2 - 4 \\cdot ${a} \\cdot k = ${disc} - ${4 * a}k = 0`],
          ],
          [["Solve for k", "解出 k"], t("", ""), [`k = \\frac{${disc}}{${4 * a}} = ${answer}`]],
        ],
        t(
          `With $k = ${answer}$, $${right} + ${answer} = ${a === 1 ? "" : a}(y ${B < 0 ? "-" : "+"} ${Math.abs(B)})^{2}$, which is zero only at $y = ${-B}$.`,
          `当 $k = ${answer}$ 时，$${right} + ${answer} = ${a === 1 ? "" : a}(y ${B < 0 ? "-" : "+"} ${Math.abs(B)})^{2}$，只在 $y = ${-B}$ 处为零。`,
        ),
      ),
    });
  },
};

/** Reason is a wrong value with its reason in English and Chinese. */
type Reason = readonly [value: number | Q, en: string, zh: string];

/** labelled is a labelled step of a worked solution with what it says and its displayed lines. */
const labelled = (title: readonly [string, string], en: string, zh: string, ...lines: string[]): Step => [
  [title[0], title[1]],
  t(en, zh),
  lines,
];

/** explainedNumber asks for a number, explains it in labelled steps with a check, and keeps the first reason for each wrong value. */
function explainedNumber(
  prompt: readonly [string, string],
  answer: number | Q,
  parts: readonly Step[],
  check: readonly [string, string],
  reasons: readonly Reason[],
  form?: "integer",
) {
  const q = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
  const right = q(answer);
  const kept = reasons.filter((r, i) => !q(r[0]).eq(right) && reasons.findIndex((s) => q(s[0]).eq(q(r[0]))) === i);
  return numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer: right,
    ...(form ? { form } : {}),
    mistakes: kept.map(([value, en, zh]) => ({ value: q(value), why: t(en, zh) })),
    solution: walked(parts, t(check[0], check[1])),
  });
}

/** keptMistakes drops the reasons whose value is the answer or repeats an earlier one, for a number problem that needs options explainedNumber lacks. */
function keptMistakes(answer: number | Q, reasons: readonly Reason[]) {
  const q = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
  const right = q(answer);
  return reasons
    .filter((r, i) => !q(r[0]).eq(right) && reasons.findIndex((s) => q(s[0]).eq(q(r[0]))) === i)
    .map(([value, en, zh]) => ({ value: q(value), why: t(en, zh) }));
}

const largestHarvest: KnowledgePointDef = {
  id: "the-largest-sustainable-harvest",
  title: t("The largest sustainable harvest", "最大的可持续收获量"),
  explanation: t(
    "With a constant harvest $h$, logistic growth becomes $P' = rP\\left(1 - \\frac{P}{K}\\right) - h$. A steady population needs an equilibrium, so $h$ must not exceed the largest natural growth rate. That peak is at $P = \\frac{K}{2}$, where the rate is $\\frac{rK}{4}$. A larger harvest drives the population to extinction. For $P' = 0.4P\\left(1 - \\frac{P}{1000}\\right) - h$ the peak is at $P = 500$, with rate $0.4 \\cdot 500 \\cdot \\frac{1}{2} = 100$, so the largest harvest is $h = 100$.\n\nCheck: with $h = 100$ the right side is $-\\frac{1}{2500}(P - 500)^{2}$, which is zero only at $P = 500$; any larger $h$ makes it negative for every $P$.\n\n> **Watch out.** The rate at the peak is $\\frac{rK}{4}$, not $\\frac{rK}{2}$: the factor $1 - \\frac{P}{K}$ is $\\frac{1}{2}$ there.",
    "有固定收获量 $h$ 时，逻辑斯蒂增长变成 $P' = rP\\left(1 - \\frac{P}{K}\\right) - h$。要维持稳定的种群，必须存在平衡解，所以 $h$ 不能超过自然增长率的最大值。这个峰值在 $P = \\frac{K}{2}$ 处，增长率是 $\\frac{rK}{4}$。收获更多，种群就会灭绝。对 $P' = 0.4P\\left(1 - \\frac{P}{1000}\\right) - h$，峰值在 $P = 500$ 处，增长率为 $0.4 \\cdot 500 \\cdot \\frac{1}{2} = 100$，所以最大收获量是 $h = 100$。\n\n检验：$h = 100$ 时右边是 $-\\frac{1}{2500}(P - 500)^{2}$，只在 $P = 500$ 处为零；$h$ 再大一点，右边对每个 $P$ 都为负。\n\n> **注意。** 峰值处的增长率是 $\\frac{rK}{4}$ 而不是 $\\frac{rK}{2}$：那里的因子 $1 - \\frac{P}{K}$ 等于 $\\frac{1}{2}$。",
  ),
  generate(rng) {
    const r = rng.int(1, 9);
    const K = 100 * rng.int(1, 20);
    const answer = Q.of(r * K, 40);
    const lead = Q.of(-r, 10 * K);
    return explainedNumber(
      [
        `A population satisfies $P' = ${decimal(r)}P\\left(1 - \\frac{P}{${K}}\\right) - h$, with a constant harvest $h$. What is the largest $h$ for which an equilibrium exists?`,
        `种群满足 $P' = ${decimal(r)}P\\left(1 - \\frac{P}{${K}}\\right) - h$，其中 $h$ 是固定的收获量。存在平衡解的最大 $h$ 是多少？`,
      ],
      answer,
      [
        labelled(
          ["Find the peak of natural growth", "找自然增长的峰值"],
          `An equilibrium needs $${decimal(r)}P\\left(1 - \\frac{P}{${K}}\\right) = h$ for some $P$. The natural growth is a parabola in $P$ with zeros $0$ and $${K}$, so it peaks halfway, at $P = ${K / 2}$.`,
          `平衡解要求对某个 $P$ 有 $${decimal(r)}P\\left(1 - \\frac{P}{${K}}\\right) = h$。自然增长是 $P$ 的抛物线，零点为 $0$ 和 $${K}$，所以在正中间 $P = ${K / 2}$ 处达到峰值。`,
        ),
        labelled(
          ["Evaluate the peak", "求峰值"],
          "The largest harvest is the growth there:",
          "最大收获量就是那里的增长率：",
          `${decimal(r)} \\cdot ${K / 2}\\left(1 - \\frac{${K / 2}}{${K}}\\right) = ${answer.toLatex()}`,
        ),
      ],
      [
        `With $h = ${answer.toLatex()}$ the right side is $${poly([lead, `\\left(P - ${K / 2}\\right)^{2}`])}$, which is zero only at $P = ${K / 2}$, so there is exactly one equilibrium; a larger $h$ makes the right side negative for every $P$.`,
        `$h = ${answer.toLatex()}$ 时右边是 $${poly([lead, `\\left(P - ${K / 2}\\right)^{2}`])}$，只在 $P = ${K / 2}$ 处为零，所以恰有一个平衡解；$h$ 再大，右边对每个 $P$ 都为负。`,
      ],
      [
        [
          Q.of(r * K, 20),
          "This leaves out the factor $1 - \\frac{P}{K} = \\frac{1}{2}$ at the peak",
          "这里漏掉了峰值处的因子 $1 - \\frac{P}{K} = \\frac{1}{2}$",
        ],
        [
          Q.of(r * K, 10),
          "This is $rK$, as if growth stayed exponential up to $P = K$; logistic growth is zero there",
          "这是 $rK$，好像增长一直是指数式的直到 $P = K$；逻辑斯蒂增长在那里为零",
        ],
        [Q.of(K, 4), `This leaves out the rate $${decimal(r)}$`, `这里漏掉了增长率 $${decimal(r)}$`],
        [K / 2, `$${K / 2}$ is the population at the peak, not the growth rate there`, `$${K / 2}$ 是峰值处的种群数量，不是那里的增长率`],
      ],
    );
  },
};

const initialFromTwoReadings: KnowledgePointDef = {
  id: "an-initial-value-from-two-readings",
  title: t("An initial value from two readings", "由两次读数求初始值"),
  explanation: t(
    "Exponential change multiplies by the same factor over equal times. If two readings are one interval apart, their quotient is that factor. Dividing the first reading by the factor steps back one interval. When the readings are at times $T$ and $2T$, this gives $A(0) = \\frac{A(T)^2}{A(2T)}$. For example, readings $12$ at $t = 5$ and $36$ at $t = 10$ have factor $3$, so $A(0) = 12 \\div 3 = 4$.\n\nCheck: $\\frac{12^{2}}{36} = 4$, and $4 \\to 12 \\to 36$ multiplies by $3$ each interval.\n\n> **Watch out.** Equal times give equal ratios, not equal differences: stepping back by $36 - 12 = 24$ would give $-12$.",
    "指数变化在相等的时间内乘以相同的因子。如果两次读数相隔一段时间，它们的商就是这个因子。第一次读数除以这个因子，就回退了一段时间。读数在 $T$ 和 $2T$ 时，得 $A(0) = \\frac{A(T)^2}{A(2T)}$。例如在 $t = 5$ 时读数为 $12$，在 $t = 10$ 时为 $36$，因子是 $3$，所以 $A(0) = 12 \\div 3 = 4$。\n\n检验：$\\frac{12^{2}}{36} = 4$，而且 $4 \\to 12 \\to 36$ 每段都乘以 $3$。\n\n> **注意。** 相等的时间对应相等的比，而不是相等的差：按差 $36 - 12 = 24$ 回退会得到 $-12$。",
  ),
  generate(rng) {
    const A0 = 4 * rng.int(1, 9);
    const r = rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(1, 2)]);
    const T = rng.int(1, 10);
    const u = Q.of(A0).mul(r);
    const v = u.mul(r);
    return explainedNumber(
      [
        `A quantity satisfies $A' = kA$. It equals $${u.toLatex()}$ at $t = ${T}$ and $${v.toLatex()}$ at $t = ${2 * T}$. Find $A(0)$.`,
        `某个量满足 $A' = kA$。它在 $t = ${T}$ 时等于 $${u.toLatex()}$，在 $t = ${2 * T}$ 时等于 $${v.toLatex()}$。求 $A(0)$。`,
      ],
      A0,
      [
        labelled(
          ["Find the factor", "求因子"],
          `The solutions of $A' = kA$ multiply by the same factor over each interval of length $${T}$:`,
          `$A' = kA$ 的解在每段长为 $${T}$ 的时间内乘以相同的因子：`,
          `\\frac{${v.toLatex()}}{${u.toLatex()}} = ${r.toLatex()}`,
        ),
        labelled(
          ["Step back one interval", "回退一段"],
          "Divide the first reading by the factor:",
          "第一次读数除以这个因子：",
          `A(0) = ${u.toLatex()} \\div ${r.toLatex()} = ${A0}`,
        ),
      ],
      [
        `By the formula, $\\frac{A(${T})^{2}}{A(${2 * T})} = \\frac{${u.mul(u).toLatex()}}{${v.toLatex()}} = ${A0}$. And $A(t) = ${A0} \\cdot ${r.sign() > 0 && r.toLatex().includes("frac") ? `\\left(${r.toLatex()}\\right)` : r.toLatex()}^{${T === 1 ? "t" : `t/${T}`}}$ solves $A' = kA$ with $k = ${T === 1 ? `\\ln ${r.toLatex()}` : `\\frac{\\ln ${r.toLatex()}}{${T}}`}$, giving $${u.toLatex()}$ at $t = ${T}$ and $${v.toLatex()}$ at $t = ${2 * T}$.`,
        `按公式，$\\frac{A(${T})^{2}}{A(${2 * T})} = \\frac{${u.mul(u).toLatex()}}{${v.toLatex()}} = ${A0}$。而 $A(t) = ${A0} \\cdot ${r.sign() > 0 && r.toLatex().includes("frac") ? `\\left(${r.toLatex()}\\right)` : r.toLatex()}^{${T === 1 ? "t" : `t/${T}`}}$ 满足 $A' = kA$，其中 $k = ${T === 1 ? `\\ln ${r.toLatex()}` : `\\frac{\\ln ${r.toLatex()}}{${T}}`}$，它在 $t = ${T}$ 时为 $${u.toLatex()}$，在 $t = ${2 * T}$ 时为 $${v.toLatex()}$。`,
      ],
      [
        [
          u.add(u).sub(v),
          "This steps back by the difference, as if the change were linear; exponential change has equal ratios",
          "这是按差回退，好像变化是线性的；指数变化的是比相等",
        ],
        [u, `This is the reading at $t = ${T}$, one interval after the start`, `这是 $t = ${T}$ 时的读数，比起点晚一段`],
        [
          Q.of(A0).div(r),
          "This steps back two intervals from the first reading, to before the start",
          "这是从第一次读数回退了两段，退到了起点之前",
        ],
        [v, `This is the reading at $t = ${2 * T}$`, `这是 $t = ${2 * T}$ 时的读数`],
      ],
    );
  },
};

const halfLifeFromReadings: KnowledgePointDef = {
  id: "a-half-life-from-two-amounts",
  title: t("A half-life from two amounts", "由两个量求半衰期"),
  explanation: t(
    "If an amount falls by an exact power of two, count how many halvings that takes. The elapsed time divided by this count is the half-life. No logarithm is needed in this case, and the size of the starting amount does not matter, only the ratio of the two amounts. For example, $96$ g falls to $3$ g in $20$ years: $\\frac{96}{3} = 32 = 2^{5}$, five halvings, so the half-life is $4$ years.\n\nCheck: $96 \\to 48 \\to 24 \\to 12 \\to 6 \\to 3$ is five steps of $4$ years, $20$ years in all.\n\n> **Watch out.** Divide by the number of halvings, $5$, not by the ratio $32$.",
    "如果一个量恰好减少到二的幂分之一，就数一数减半了多少次。经过的时间除以这个次数就是半衰期。这种情况不需要对数，初始量的大小也不重要，只有两个量的比值才有关系。例如 $96$ g 在 $20$ 年内降到 $3$ g：$\\frac{96}{3} = 32 = 2^{5}$，减半五次，所以半衰期是 $4$ 年。\n\n检验：$96 \\to 48 \\to 24 \\to 12 \\to 6 \\to 3$ 共五步，每步 $4$ 年，合计 $20$ 年。\n\n> **注意。** 要除以减半的次数 $5$，而不是除以比值 $32$。",
  ),
  generate(rng) {
    const H = rng.int(2, 12);
    const n = rng.int(2, 5);
    const end = rng.int(1, 9);
    const start = end * 2 ** n;
    const time = n * H;
    const chain = Array.from({ length: n + 1 }, (_, i) => `${start / 2 ** i}`).join(" \\to ");
    return explainedNumber(
      [
        `A sample decays exponentially from ${start} g to ${end} g in ${time} years. What is its half-life, in years?`,
        `某样品从 ${start} g 按指数衰减到 ${end} g，用了 ${time} 年。它的半衰期是多少年？`,
      ],
      H,
      [
        labelled(["Count the halvings", "数减半的次数"], "", "", `\\frac{${start}}{${end}} = ${2 ** n} = 2^{${n}}`),
        labelled(
          ["Share out the time", "平分时间"],
          `The $${n}$ halvings take equal times:`,
          `$${n}$ 次减半所用的时间相等：`,
          `\\frac{${time}}{${n}} = ${H}`,
        ),
      ],
      [
        `Halve step by step: $${chain}$ is $${n}$ steps of $${H}$ years, $${time}$ years in all.`,
        `逐次减半：$${chain}$ 共 $${n}$ 步，每步 $${H}$ 年，合计 $${time}$ 年。`,
      ],
      (
        [
          [
            time / 2,
            `Half the time is not the half-life: the sample halved $${n}$ times, not twice`,
            `一半的时间不是半衰期：样品减半了 $${n}$ 次，而不是两次`,
          ],
          [time, `This is the whole time, in which the sample halved $${n}$ times`, `这是全部时间，在这段时间里样品减半了 $${n}$ 次`],
          [n, `$${n}$ is the number of halvings, not the time each one takes`, `$${n}$ 是减半的次数，不是每次所用的时间`],
          ...(time % 2 ** n === 0
            ? [
                [
                  time / 2 ** n,
                  `This divides by the ratio $${2 ** n}$; divide by the number of halvings, $${n}$`,
                  `这里除以了比值 $${2 ** n}$；应当除以减半的次数 $${n}$`,
                ] as const,
              ]
            : []),
        ] as Reason[]
      ).filter((r) => Number.isInteger(r[0])),
      "integer",
    );
  },
};

const logisticAfterGrowthFactor: KnowledgePointDef = {
  id: "a-logistic-value-from-the-exponential-factor",
  title: t("A logistic value from the exponential factor", "由指数因子求逻辑斯蒂值"),
  explanation: t(
    "The logistic solution is $P(t) = \\frac{K}{1 + Ae^{-rt}}$, with $A = \\frac{K - P_0}{P_0}$. The time enters only through $e^{rt}$. So if this factor is known, the population can be found without knowing $r$ or $t$ separately. Early growth is close to exponential, but the denominator holds it below $K$. For $P_0 = 20$ and $K = 100$, $A = 4$, and when $e^{rt} = 4$ the population is $\\frac{100}{1 + \\frac{4}{4}} = 50$.\n\nCheck: the ratio $\\frac{P}{K - P}$ is multiplied by $e^{rt}$. It starts at $\\frac{20}{80} = \\frac{1}{4}$ and becomes $\\frac{50}{50} = 1$, four times as much.\n\n> **Watch out.** The factor appears as $e^{-rt} = \\frac{1}{4}$ in the denominator, not as $4$.",
    "逻辑斯蒂解是 $P(t) = \\frac{K}{1 + Ae^{-rt}}$，其中 $A = \\frac{K - P_0}{P_0}$。时间只通过 $e^{rt}$ 出现。所以只要知道这个因子，不必分别知道 $r$ 和 $t$ 就能求出种群数量。初期增长接近指数，但分母使它始终低于 $K$。对 $P_0 = 20$、$K = 100$，$A = 4$；当 $e^{rt} = 4$ 时，种群数量为 $\\frac{100}{1 + \\frac{4}{4}} = 50$。\n\n检验：比值 $\\frac{P}{K - P}$ 会乘以 $e^{rt}$。它起初是 $\\frac{20}{80} = \\frac{1}{4}$，后来变成 $\\frac{50}{50} = 1$，正好是四倍。\n\n> **注意。** 这个因子在分母中以 $e^{-rt} = \\frac{1}{4}$ 出现，而不是 $4$。",
  ),
  generate(rng) {
    const P0 = 10 * rng.int(1, 9);
    const A = rng.int(1, 9);
    const K = P0 * (1 + A);
    const m = rng.int(2, 9);
    const answer = Q.of(K * m, m + A);
    const odds = answer.div(Q.of(K).sub(answer));
    return explainedNumber(
      [
        `A population follows the logistic equation with $P(0) = ${P0}$ and carrying capacity ${K}. Find $P$ at the time when $e^{rt} = ${m}$.`,
        `种群服从逻辑斯蒂方程，$P(0) = ${P0}$，环境容量是 ${K}。求 $e^{rt} = ${m}$ 时的 $P$。`,
      ],
      answer,
      [
        labelled(
          ["Find A", "求 A"],
          "In $P = \\frac{K}{1 + Ae^{-rt}}$ the constant comes from the start:",
          "在 $P = \\frac{K}{1 + Ae^{-rt}}$ 中，常数由初值决定：",
          `A = \\frac{${K} - ${P0}}{${P0}} = ${A}`,
        ),
        labelled(
          ["Put in the factor", "代入因子"],
          `When $e^{rt} = ${m}$, $e^{-rt} = \\frac{1}{${m}}$:`,
          `当 $e^{rt} = ${m}$ 时，$e^{-rt} = \\frac{1}{${m}}$：`,
          `P = \\frac{${K}}{1 + \\frac{${A}}{${m}}} = ${answer.toLatex()}`,
        ),
      ],
      [
        `The ratio $\\frac{P}{K - P}$ of a logistic solution is multiplied by $e^{rt}$. It starts at $\\frac{${P0}}{${K - P0}} = ${Q.of(P0, K - P0).toLatex()}$ and here is $\\frac{${answer.toLatex()}}{${Q.of(K).sub(answer).toLatex()}} = ${odds.toLatex()}$, exactly $${m}$ times as much.`,
        `逻辑斯蒂解的比值 $\\frac{P}{K - P}$ 会乘以 $e^{rt}$。它起初是 $\\frac{${P0}}{${K - P0}} = ${Q.of(P0, K - P0).toLatex()}$，这里是 $\\frac{${answer.toLatex()}}{${Q.of(K).sub(answer).toLatex()}} = ${odds.toLatex()}$，正好是 $${m}$ 倍。`,
      ],
      [
        [
          Q.of(P0 * m),
          "This is pure exponential growth; the logistic denominator holds the population below the capacity",
          "这是纯指数增长；逻辑斯蒂解的分母使种群始终低于环境容量",
        ],
        [
          Q.of(K, 1 + A * m),
          `This uses $e^{-rt} = ${m}$; the time enters as $e^{-rt} = \\frac{1}{${m}}$`,
          `这里用了 $e^{-rt} = ${m}$；时间应以 $e^{-rt} = \\frac{1}{${m}}$ 出现`,
        ],
        [
          Q.of(K, m),
          "This divides the capacity by the factor; the factor divides $A$ in the denominator",
          "这是用因子去除环境容量；因子应当去除分母中的 $A$",
        ],
        [
          K,
          "The capacity is approached only as $t \\to \\infty$, not at a finite time",
          "环境容量只在 $t \\to \\infty$ 时才趋近，有限时刻达不到",
        ],
      ],
    );
  },
};

const dragFromTerminal: KnowledgePointDef = {
  id: "the-drag-coefficient-from-terminal-velocity",
  title: t("The drag coefficient from terminal velocity", "由终端速度求阻力系数"),
  explanation: t(
    "At terminal velocity the acceleration is zero, so drag exactly balances weight. With quadratic drag, $mv' = mg - kv^2$ gives $kv_T^2 = mg$. A measured terminal velocity therefore gives the coefficient $k$, with no need to solve the differential equation at all.\n\n> **Watch out.** The drag uses the square of the speed. A $2$ kg object with terminal velocity $10$ m/s and $g = 10$ m/s² has $k = \\frac{20}{100} = 0.2$, not $\\frac{20}{10} = 2$.",
    "达到终端速度时加速度为零，所以阻力恰好与重力平衡。对二次阻力，由 $mv' = mg - kv^2$ 得 $kv_T^2 = mg$。所以测出终端速度就能得到系数 $k$，完全不必解微分方程。\n\n> **注意。** 阻力用的是速度的平方。质量 $2$ kg、终端速度 $10$ m/s、取 $g = 10$ m/s² 的物体，$k = \\frac{20}{100} = 0.2$，不是 $\\frac{20}{10} = 2$。",
  ),
  generate(rng) {
    const m = rng.int(1, 9);
    const v = rng.int(5, 30);
    const answer = Q.of(10 * m, v * v);
    return explainedNumber(
      [
        `An object of mass ${m} kg falls with drag force $kv^2$ and reaches a terminal velocity of ${v} m/s. Taking $g = 10$ m/s², find $k$.`,
        `质量为 ${m} kg 的物体下落，阻力是 $kv^2$，终端速度是 ${v} m/s。取 $g = 10$ m/s²，求 $k$。`,
      ],
      answer,
      [
        labelled(
          ["Balance the forces", "力的平衡"],
          "At terminal velocity the drag equals the weight.",
          "达到终端速度时阻力等于重力。",
          `k \\cdot ${v}^2 = ${m} \\cdot 10 = ${10 * m}`,
        ),
        labelled(["Solve for k", "解出 k"], "", "", `k = ${10 * m} \\div ${v * v} = ${answer.toLatex()}`),
      ],
      [
        `With this $k$ the drag at ${v} m/s is $${answer.toLatex()} \\cdot ${v * v} = ${10 * m}$ N, the weight, so the acceleration is zero.`,
        `取这个 $k$，${v} m/s 时的阻力为 $${answer.toLatex()} \\cdot ${v * v} = ${10 * m}$ N，等于重力，所以加速度为零。`,
      ],
      [
        [
          Q.of(10 * m, v),
          "That divides the weight by the speed; the drag is $kv^2$, so divide by its square.",
          "这用重力除以速度；阻力是 $kv^2$，应除以速度的平方。",
        ],
        [Q.of(10, v * v), "That leaves out the mass: the weight is $mg$.", "这漏了质量：重力是 $mg$。"],
        [
          Q.of(v * v, 10 * m),
          "That divides the square of the speed by the weight, the wrong way round.",
          "这用速度的平方除以重力，颠倒了。",
        ],
      ],
    );
  },
};

const escapeRatio: KnowledgePointDef = {
  id: "comparing-the-escape-velocities-of-two-planets",
  title: t("Comparing the escape velocities of two planets", "比较两颗行星的逃逸速度"),
  explanation: t(
    "The escape velocity $v = \\sqrt{\\frac{2GM}{R}}$ depends on mass and radius only through their quotient, and then only by a square root. So in a comparison the constants cancel. Multiplying the mass by $a$ and the radius by $b$ multiplies the escape velocity by $\\sqrt{\\frac{a}{b}}$.\n\n> **Watch out.** Divide the mass factor by the radius factor, then take the square root. With $18$ times the mass and $2$ times the radius the factor is $\\sqrt{9} = 3$, not $9$.",
    "逃逸速度 $v = \\sqrt{\\frac{2GM}{R}}$ 只通过商依赖于质量和半径，而且还要开平方。所以比较时常数都约去了。质量乘以 $a$、半径乘以 $b$，逃逸速度就乘以 $\\sqrt{\\frac{a}{b}}$。\n\n> **注意。** 先用质量倍数除以半径倍数，再开平方。质量为 $18$ 倍、半径为 $2$ 倍时，倍数是 $\\sqrt{9} = 3$，不是 $9$。",
  ),
  generate(rng) {
    const a = rng.int(2, 6);
    const r = rng.int(2, 7);
    const M = a * a * r;
    return explainedNumber(
      [
        `A planet has ${M} times the mass and ${r} times the radius of another. How many times the other's escape velocity is its escape velocity?`,
        `一颗行星的质量是另一颗的 ${M} 倍，半径是其 ${r} 倍。它的逃逸速度是另一颗的多少倍？`,
      ],
      a,
      [
        labelled(
          ["Form the ratio", "写出比值"],
          "The constants $2G$ cancel.",
          "常数 $2G$ 约去了。",
          `\\frac{v_1}{v_2} = \\sqrt{\\frac{M_1 / R_1}{M_2 / R_2}} = \\sqrt{${M} \\div ${r}}`,
        ),
        labelled(["Take the root", "开平方"], "", "", `\\sqrt{${a * a}} = ${a}`),
      ],
      [`Squaring back, $${a}^2 \\cdot ${r} = ${M}$, the mass factor.`, `平方回去，$${a}^2 \\cdot ${r} = ${M}$，正是质量倍数。`],
      [
        [a * a, "That is the ratio $\\frac{M}{R}$ before the square root.", "这是开平方之前的比值 $\\frac{M}{R}$。"],
        [
          M,
          "That ignores the radius: a larger planet holds things less tightly at its surface.",
          "这忽略了半径：半径更大的行星对表面物体的束缚更弱。",
        ],
        [
          Q.of(M * r),
          "That multiplies by the radius factor instead of dividing, and skips the square root.",
          "这乘以了半径倍数而不是除以它，还漏了开平方。",
        ],
      ],
      "integer",
    );
  },
};

const annihilatorOrder: KnowledgePointDef = {
  id: "the-order-of-an-annihilating-operator",
  title: t("The order of an annihilating operator", "零化算子的阶"),
  explanation: t(
    "The operator $(D - a)^{n+1}$ sends $x^ne^{ax}$ to zero, because each factor lowers the power of $x$ by one. For a sum with different exponential rates, multiply the operators for the separate terms. The order of the product is the total of the separate orders, and no smaller constant-coefficient operator works. For $xe^{2x} + e^{3x}$ the operator is $(D - 2)^{2}(D - 3)$, of order $3$.\n\n> **Watch out.** $x^{n}e^{ax}$ needs $n + 1$ factors $D - a$, one more than the power; and terms with different rates need their own factors, so the orders add.",
    "算子 $(D - a)^{n+1}$ 把 $x^ne^{ax}$ 变成零，因为每个因子都使 $x$ 的幂次降低一。对指数速率不同的和，把各项的算子相乘。乘积的阶是各阶之和，没有更低阶的常系数算子能做到。对 $xe^{2x} + e^{3x}$，算子是 $(D - 2)^{2}(D - 3)$，阶为 $3$。\n\n> **注意。** $x^{n}e^{ax}$ 需要 $n + 1$ 个因子 $D - a$，比幂次多一；速率不同的项需要各自的因子，所以阶要相加。",
  ),
  generate(rng) {
    const n = rng.int(0, 3);
    const m = rng.int(0, 3);
    const a = rng.int(1, 5);
    const b = different(rng, 1, 5, a);
    const term = (power: number, rate: number) => `${power === 0 ? "" : power === 1 ? "x" : `x^${power}`}e^{${poly([rate, "x"])}}`;
    const answer = n + m + 2;
    const factor = (rate: number, order: number) => (order === 1 ? `(D - ${rate})` : `(D - ${rate})^{${order}}`);
    return explainedNumber(
      [
        `What is the smallest order of a linear constant-coefficient differential operator that sends $${term(n, a)} + ${term(m, b)}$ to zero?`,
        `能把 $${term(n, a)} + ${term(m, b)}$ 变成零的线性常系数微分算子，最低是几阶？`,
      ],
      answer,
      [
        labelled(
          ["Annihilate each term", "分别零化每一项"],
          `$${term(n, a)}$ needs $${factor(a, n + 1)}$, and $${term(m, b)}$ needs $${factor(b, m + 1)}$: each factor lowers the power of $x$ by one, and one more removes the exponential.`,
          `$${term(n, a)}$ 需要 $${factor(a, n + 1)}$，$${term(m, b)}$ 需要 $${factor(b, m + 1)}$：每个因子使 $x$ 的幂次降低一，再多一个就消去指数函数。`,
        ),
        labelled(
          ["Multiply the operators", "把算子相乘"],
          "The rates differ, so neither factor helps with the other term, and the orders add.",
          "两个速率不同，所以哪个因子都帮不了另一项，阶要相加。",
          `${factor(a, n + 1)}${factor(b, m + 1)}`,
          `${n + 1} + ${m + 1} = ${answer}`,
        ),
      ],
      [
        `The characteristic polynomial of the product has the root $${a}$ ${n + 1 === 1 ? "once" : `$${n + 1}$ times`} and the root $${b}$ ${m + 1 === 1 ? "once" : `$${m + 1}$ times`}, which is exactly what is needed for $${term(n, a)}$ and $${term(m, b)}$ to be solutions.`,
        `乘积的特征多项式有根 $${a}$（${n + 1 === 1 ? "单根" : `${n + 1} 重根`}）与根 $${b}$（${m + 1 === 1 ? "单根" : `${m + 1} 重根`}），这恰好是 $${term(n, a)}$ 与 $${term(m, b)}$ 成为解所需要的。`,
      ],
      [
        [
          Math.max(n, m) + 1,
          "That annihilates only one of the two terms; the other rate needs its own factors.",
          "这只零化了其中一项；另一个速率需要自己的因子。",
        ],
        [n + m, "Each term needs one factor more than its power of $x$.", "每一项需要的因子数比它的 $x$ 的幂次多一。"],
        [n + m + 1, "That adds the extra factor only once; each of the two terms needs one.", "这只多加了一个因子；两项各需要一个。"],
      ],
      "integer",
    );
  },
};

const boundedSlope: KnowledgePointDef = {
  id: "the-initial-slope-that-keeps-a-solution-bounded",
  title: t("The initial slope that keeps a solution bounded", "使解有界的初始斜率"),
  explanation: t(
    "With roots of opposite signs, the general solution is $c_1e^{rt} + c_2e^{st}$ with $r > 0 > s$. The first term grows without bound unless $c_1 = 0$. So a bounded solution is a multiple of $e^{st}$ alone, and its initial slope must be $s$ times its initial value. For $y'' - y' - 2y = 0$ the roots are $2$ and $-1$, so with $y(0) = 3$ the bounded solution is $3e^{-t}$, with slope $-3$.\n\n> **Watch out.** Keep the decaying root $s$, not the growing one, and multiply it by $y(0)$: the slope is $s\\,y(0)$, not $s$ alone.",
    "两根异号时，通解是 $c_1e^{rt} + c_2e^{st}$，其中 $r > 0 > s$。除非 $c_1 = 0$，否则第一项无限增长。所以有界解只是 $e^{st}$ 的倍数，它的初始斜率必须等于 $s$ 乘以初始值。对 $y'' - y' - 2y = 0$，根是 $2$ 和 $-1$，所以 $y(0) = 3$ 时有界解是 $3e^{-t}$，斜率为 $-3$。\n\n> **注意。** 要保留衰减的根 $s$，而不是增长的根，并乘以 $y(0)$：斜率是 $s\\,y(0)$，而不只是 $s$。",
  ),
  generate(rng) {
    const r = rng.int(1, 6);
    const s = -rng.int(1, 6);
    const y0 = rng.int(1, 9);
    const answer = s * y0;
    const b = -(r + s);
    const c = r * s;
    const eq = poly([1, "y''"], [b, "y'"], [c, "y"]);
    const grow = r === 1 ? "e^{t}" : `e^{${r}t}`;
    const decay = `e^{${poly([s, "t"])}}`;
    return explainedNumber(
      [
        `For $${eq} = 0$ with $y(0) = ${y0}$, which value of $y'(0)$ makes the solution bounded as $t \\to \\infty$?`,
        `对 $${eq} = 0$，$y(0) = ${y0}$，$y'(0)$ 取何值时解在 $t \\to \\infty$ 时有界？`,
      ],
      answer,
      [
        labelled(
          ["Find the roots", "求特征根"],
          `The characteristic roots are $${r}$ and $${s}$, so $y = c_1${grow} + c_2${decay}$.`,
          `特征根是 $${r}$ 和 $${s}$，所以 $y = c_1${grow} + c_2${decay}$。`,
          `${poly([1, "r^2"], [b, "r"], [c, ""])} = (r - ${r})(r + ${-s})`,
        ),
        labelled(
          ["Remove the growing term", "去掉增长项"],
          `A bounded solution has $c_1 = 0$, so it is $y = ${poly([y0, decay])}$.`,
          `有界解满足 $c_1 = 0$，所以是 $y = ${poly([y0, decay])}$。`,
          `y'(0) = ${s} \\cdot ${y0} = ${answer}`,
        ),
      ],
      [
        `With $y(0) = ${y0}$ and $y'(0) = ${answer}$: $c_1 + c_2 = ${y0}$ and $${r}c_1 ${s === -1 ? "-" : `- ${-s}`}c_2 = ${answer}$ give $c_1 = 0$, so nothing grows.`,
        `取 $y(0) = ${y0}$，$y'(0) = ${answer}$：$c_1 + c_2 = ${y0}$ 与 $${r}c_1 ${s === -1 ? "-" : `- ${-s}`}c_2 = ${answer}$ 给出 $c_1 = 0$，所以没有增长项。`,
      ],
      [
        [
          r * y0,
          `That keeps the growing root $${r}$; the bounded solution uses the decaying root $${s}$.`,
          `这是保留了增长的根 $${r}$；有界解用的是衰减的根 $${s}$。`,
        ],
        [
          y0,
          "That makes the slope equal to the value; the slope is the decaying root times the value.",
          "这是让斜率等于函数值；斜率是衰减的根乘以函数值。",
        ],
        [s, `That is the root alone; multiply it by $y(0) = ${y0}$.`, `这只是根本身；还要乘以 $y(0) = ${y0}$。`],
      ],
      "integer",
    );
  },
};

const peakWithRepeatedRoot: KnowledgePointDef = {
  id: "the-peak-of-a-solution-with-a-repeated-root",
  title: t("The peak of a solution with a repeated root", "重根解的峰值时刻"),
  explanation: t(
    "With a repeated root $-a$ and $y(0) = 0$, the solution is $y = vte^{-at}$. The factor $t$ makes it rise at first, and the exponential makes it decay later. Setting $y' = 0$ shows the peak is at $t = \\frac{1}{a}$, and this time does not depend on the initial slope $v$. For example $y'' + 4y' + 4y = 0$ with $y(0) = 0$ and $y'(0) = 5$ gives $y = 5te^{-2t}$, which peaks at $t = \\frac{1}{2}$.\n\n> **Watch out.** The peak is where $y' = 0$, not where $y'' = 0$ (that is the inflection point at $t = \\frac{2}{a}$); the initial slope $v$ changes the height, not the time.",
    "重根为 $-a$ 且 $y(0) = 0$ 时，解是 $y = vte^{-at}$。因子 $t$ 使它先上升，指数项使它后来衰减。令 $y' = 0$，得峰值在 $t = \\frac{1}{a}$ 处，这个时刻与初始斜率 $v$ 无关。例如 $y'' + 4y' + 4y = 0$，$y(0) = 0$，$y'(0) = 5$：$y = 5te^{-2t}$，峰值在 $t = \\frac{1}{2}$。\n\n> **注意。** 峰值是 $y' = 0$ 的地方，不是 $y'' = 0$ 的地方（那是 $t = \\frac{2}{a}$ 处的拐点）；初始斜率 $v$ 只改变高度，不改变时刻。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const v = rng.int(1, 9);
    const answer = Q.of(1, a);
    const decay = `e^{${poly([-a, "t"])}}`;
    const eq = poly([1, "y''"], [2 * a, "y'"], [a * a, "y"]);
    return explainedNumber(
      [
        `Let $${eq} = 0$ with $y(0) = 0$ and $y'(0) = ${v}$. At what time $t > 0$ is $y$ largest?`,
        `设 $${eq} = 0$，$y(0) = 0$，$y'(0) = ${v}$。在什么时刻 $t > 0$，$y$ 最大？`,
      ],
      answer,
      [
        labelled(
          ["Solve the problem", "求解"],
          `The root $${-a}$ is repeated, so $y = (c_1 + c_2t)${decay}$. Then $y(0) = c_1 = 0$ and $y'(0) = c_2 = ${v}$.`,
          `根 $${-a}$ 是重根，所以 $y = (c_1 + c_2t)${decay}$。于是 $y(0) = c_1 = 0$，$y'(0) = c_2 = ${v}$。`,
          `y = ${poly([v, `t${decay}`])}`,
        ),
        labelled(
          ["Set the derivative to zero", "令导数为零"],
          `The factor $${decay}$ is never zero, so $y' = 0$ only where $${poly([1, ""], [-a, "t"])} = 0$.`,
          `因子 $${decay}$ 永不为零，所以 $y' = 0$ 只在 $${poly([1, ""], [-a, "t"])} = 0$ 处。`,
          `y' = ${v === 1 ? "" : v}(${poly([1, ""], [-a, "t"])})${decay}`,
          `t = ${answer.toLatex()}`,
        ),
      ],
      [
        `$y'$ has the sign of $${poly([1, ""], [-a, "t"])}$: positive before $t = ${answer.toLatex()}$ and negative after, so $y$ rises and then falls, with its largest value there.`,
        `$y'$ 与 $${poly([1, ""], [-a, "t"])}$ 同号：在 $t = ${answer.toLatex()}$ 之前为正，之后为负，所以 $y$ 先升后降，在该处取最大值。`,
      ],
      [
        [Q.of(2, a), "That is where $y'' = 0$, the inflection point after the peak.", "这是 $y'' = 0$ 的地方，即峰值之后的拐点。"],
        [
          Q.of(1, 2 * a),
          `That takes the decay rate as $${2 * a}$, the coefficient of $y'$; the repeated root is $${-a}$.`,
          `这是把衰减速率当成 $y'$ 的系数 $${2 * a}$；重根是 $${-a}$。`,
        ],
        [
          Q.of(v, a),
          "The initial slope only scales the solution; it does not move the peak.",
          "初始斜率只改变解的大小，不改变峰值的位置。",
        ],
      ],
    );
  },
};

const firstZeroOfDampedOscillation: KnowledgePointDef = {
  id: "the-first-zero-of-a-damped-oscillation",
  title: t("The first zero of a damped oscillation", "阻尼振动的第一个零点"),
  explanation: t(
    "With complex roots $-p \\pm qi$ and $y(0) = 0$, the solution is $y = \\frac{v}{q}e^{-pt}\\sin qt$. The exponential is never zero, so the zeros are those of the sine. The first after the start is at $t = \\frac{\\pi}{q}$. Damping shrinks the swings but leaves the spacing of the zeros alone. For $y'' + 2y' + 5y = 0$ the roots are $-1 \\pm 2i$, so the first zero is at $t = \\frac{\\pi}{2}$.\n\n> **Watch out.** Use the imaginary part $q$, not the real part $p$; and the sine returns to zero after half a period, at $qt = \\pi$, not after a full period.",
    "复根为 $-p \\pm qi$ 且 $y(0) = 0$ 时，解是 $y = \\frac{v}{q}e^{-pt}\\sin qt$。指数项永不为零，所以零点就是正弦的零点，起点之后的第一个在 $t = \\frac{\\pi}{q}$ 处。阻尼使振幅缩小，但不改变零点的间距。对 $y'' + 2y' + 5y = 0$，根是 $-1 \\pm 2i$，所以第一个零点在 $t = \\frac{\\pi}{2}$。\n\n> **注意。** 要用虚部 $q$，而不是实部 $p$；正弦经过半个周期、即 $qt = \\pi$ 时回到零，而不是一个完整周期。",
  ),
  generate(rng) {
    const p = rng.int(1, 6);
    const q = rng.int(1, 9);
    const v = rng.int(1, 9);
    const answer = Q.of(1, q);
    const eq = poly([1, "y''"], [2 * p, "y'"], [p * p + q * q, "y"]);
    const qt = poly([q, "t"]);
    return explainedNumber(
      [
        `Let $${eq} = 0$ with $y(0) = 0$ and $y'(0) = ${v}$. The first positive zero of $y$ is at $t = c\\pi$. Find $c$.`,
        `设 $${eq} = 0$，$y(0) = 0$，$y'(0) = ${v}$。$y$ 的第一个正零点在 $t = c\\pi$ 处。求 $c$。`,
      ],
      answer,
      [
        labelled(
          ["Find the roots", "求特征根"],
          `Completing the square, $(r + ${p})^{2} + ${q * q} = 0$, so the roots are $${complexRoots(p, q)}$.`,
          `配方得 $(r + ${p})^{2} + ${q * q} = 0$，所以根是 $${complexRoots(p, q)}$。`,
        ),
        labelled(
          ["Use y(0) = 0", "用 y(0) = 0"],
          `The cosine term drops out, so $y$ is a multiple of $e^{${poly([-p, "t"])}}\\sin ${qt}$. The exponential is never zero, and the sine first returns to zero at $${qt} = \\pi$.`,
          `余弦项消失，所以 $y$ 是 $e^{${poly([-p, "t"])}}\\sin ${qt}$ 的倍数。指数项永不为零，正弦在 $${qt} = \\pi$ 时第一次回到零。`,
          `t = ${q === 1 ? "\\pi" : `\\frac{\\pi}{${q}}`}, \\quad c = ${answer.toLatex()}`,
        ),
      ],
      [
        `At $t = ${q === 1 ? "\\pi" : `\\frac{\\pi}{${q}}`}$, $\\sin ${qt} = \\sin \\pi = 0$, while for smaller $t > 0$ the angle $${qt}$ lies in $(0, \\pi)$, where the sine is positive.`,
        `在 $t = ${q === 1 ? "\\pi" : `\\frac{\\pi}{${q}}`}$ 处，$\\sin ${qt} = \\sin \\pi = 0$；而对更小的 $t > 0$，角 $${qt}$ 落在 $(0, \\pi)$ 内，正弦为正。`,
      ],
      [
        [
          Q.of(1, p),
          `That uses the real part $${p}$; the zeros come from the sine, whose frequency is the imaginary part $${q}$.`,
          `这是用了实部 $${p}$；零点来自正弦，其频率是虚部 $${q}$。`,
        ],
        [
          Q.of(2, q),
          "That is a full period; the sine is already zero again after half a period.",
          "这是一个完整周期；正弦经过半个周期就再次为零。",
        ],
        [
          Q.of(1, 2 * q),
          `That is where $${qt} = \\frac{\\pi}{2}$, where the sine is $1$, not $0$.`,
          `这是 $${qt} = \\frac{\\pi}{2}$ 的地方，此时正弦为 $1$，而不是 $0$。`,
        ],
      ],
    );
  },
};

const forcingAtADoubleRoot: KnowledgePointDef = {
  id: "exponential-forcing-at-a-double-root",
  title: t("Exponential forcing at a double root", "重根处的指数强迫"),
  explanation: t(
    "If the forcing rate is a double root of the characteristic equation, both $e^{at}$ and $te^{at}$ solve the homogeneous equation, so the trial must be $At^2e^{at}$. Substituting, only the term in which both derivatives hit $t^2$ survives, which gives $2A$ on the left side. For $y'' - 4y' + 4y = 6e^{2t}$ this means $2A = 6$, so $A = 3$.\n\n> **Watch out.** The left side reduces to $2A\\,e^{at}$, so $A$ is half the forcing constant; it is neither the constant itself nor the constant divided by $a^{2}$.",
    "如果强迫项的速率是特征方程的重根，$e^{at}$ 和 $te^{at}$ 都是齐次方程的解，所以试探解必须是 $At^2e^{at}$。代入后，只有两次求导都作用在 $t^2$ 上的项留下来，左边得到 $2A$。对 $y'' - 4y' + 4y = 6e^{2t}$，即 $2A = 6$，所以 $A = 3$。\n\n> **注意。** 左边化为 $2A\\,e^{at}$，所以 $A$ 是强迫常数的一半；它既不是常数本身，也不是常数除以 $a^{2}$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const k = rng.int(1, 12);
    const answer = Q.of(k, 2);
    const rate = poly([a, "t"]);
    const eq = poly([1, "y''"], [-2 * a, "y'"], [a * a, "y"]);
    const op = poly([1, "D"], [-a, ""]);
    return explainedNumber(
      [
        `The equation $${eq} = ${k}e^{${rate}}$ has a particular solution $At^2e^{${rate}}$. Find $A$.`,
        `方程 $${eq} = ${k}e^{${rate}}$ 有特解 $At^2e^{${rate}}$。求 $A$。`,
      ],
      answer,
      [
        labelled(
          ["Factor the operator", "分解算子"],
          `The left side is $(${op})^{2}y$, and $(${op})\\left(f(t)e^{${rate}}\\right) = f'(t)e^{${rate}}$: the factor only differentiates what multiplies the exponential.`,
          `左边是 $(${op})^{2}y$，且 $(${op})\\left(f(t)e^{${rate}}\\right) = f'(t)e^{${rate}}$：这个因子只对乘在指数函数前面的部分求导。`,
        ),
        labelled(
          ["Apply it twice", "作用两次"],
          "",
          "",
          `(${op})^{2}\\left(At^{2}e^{${rate}}\\right) = A(t^{2})''e^{${rate}} = 2Ae^{${rate}}`,
          `2A = ${k} \\implies A = ${answer.toLatex()}`,
        ),
      ],
      [
        `With $f = ${poly([answer, "t^{2}"])}$: $f' = ${poly([k, "t"])}$ and $f'' = ${k}$, so $(${op})^{2}$ turns $fe^{${rate}}$ into $${k}e^{${rate}}$, the forcing.`,
        `取 $f = ${poly([answer, "t^{2}"])}$：$f' = ${poly([k, "t"])}$，$f'' = ${k}$，所以 $(${op})^{2}$ 把 $fe^{${rate}}$ 变成 $${k}e^{${rate}}$，正是强迫项。`,
      ],
      [
        [Q.of(k), "That forgets the factor $2$ from differentiating $t^{2}$ twice.", "这里忘了对 $t^{2}$ 求两次导产生的因子 $2$。"],
        [Q.of(2 * k), "That multiplies by $2$; the equation $2A = k$ calls for dividing.", "这是乘以 $2$；方程 $2A = k$ 要求除以 $2$。"],
        [
          Q.of(k, a * a),
          "That divides by the coefficient of $y$, as for a plain trial $Ae^{at}$; at a double root that trial fails.",
          "这是像普通试探解 $Ae^{at}$ 那样除以 $y$ 的系数；在重根处那个试探解行不通。",
        ],
      ],
    );
  },
};

const frequencyFromStretch: KnowledgePointDef = {
  id: "the-frequency-from-the-static-stretch-of-a-spring",
  title: t("The frequency from the static stretch of a spring", "由弹簧静伸长求频率"),
  explanation: t(
    "At rest, a hanging mass stretches a spring by a distance $d$ for which $kd = mg$. So $\\frac{k}{m} = \\frac{g}{d}$, and the natural frequency is $\\omega = \\sqrt{\\frac{g}{d}}$. Neither the mass nor the spring constant needs to be known separately: the stretch alone sets the frequency. With $g = 10$, a stretch of $d = \\frac{2}{5}$ m gives $\\omega = \\sqrt{25} = 5$ rad/s.\n\n> **Watch out.** $\\frac{g}{d}$ is $\\omega^{2}$, so take its root; and the mass cancels, so it must not be multiplied in.",
    "静止时，悬挂的质量使弹簧伸长 $d$，满足 $kd = mg$。所以 $\\frac{k}{m} = \\frac{g}{d}$，固有频率是 $\\omega = \\sqrt{\\frac{g}{d}}$。质量和弹簧常数都不必单独知道，只由静伸长就能确定频率。取 $g = 10$，伸长 $d = \\frac{2}{5}$ m 给出 $\\omega = \\sqrt{25} = 5$ rad/s。\n\n> **注意。** $\\frac{g}{d}$ 是 $\\omega^{2}$，还要开方；质量会约掉，不能再乘进去。",
  ),
  generate(rng) {
    const w = rng.int(2, 10);
    const m = rng.int(1, 6);
    const d = Q.of(10, w * w);
    return explainedNumber(
      [
        `A mass of ${m} kg hanging at rest stretches a spring by $${d.toLatex()}$ m. Taking $g = 10$ m/s² and ignoring damping, find the natural frequency in rad/s.`,
        `质量为 ${m} kg 的物体静止悬挂时，使弹簧伸长 $${d.toLatex()}$ m。取 $g = 10$ m/s²，忽略阻尼，求固有频率（rad/s）。`,
      ],
      w,
      [
        labelled(
          ["Use the rest position", "用静止位置"],
          "At rest the spring force balances gravity, so the mass cancels:",
          "静止时弹簧力与重力平衡，所以质量约掉：",
          `kd = mg \\implies \\frac{k}{m} = \\frac{g}{d}`,
        ),
        labelled(["Take the root", "开方"], "", "", `\\omega^2 = \\frac{10}{${d.toLatex()}} = ${w * w}`, `\\omega = ${w}`),
      ],
      [
        `$${w}^2 \\cdot ${d.toLatex()} = 10 = g$, so $k = ${m} \\cdot ${w * w} = ${m * w * w}$ N/m stretches $${d.toLatex()}$ m under $${m * 10}$ N.`,
        `$${w}^2 \\cdot ${d.toLatex()} = 10 = g$，所以 $k = ${m} \\cdot ${w * w} = ${m * w * w}$ N/m 在 $${m * 10}$ N 下伸长 $${d.toLatex()}$ m。`,
      ],
      [
        [w * w, "That is $\\frac{g}{d} = \\omega^{2}$; take the square root.", "这是 $\\frac{g}{d} = \\omega^{2}$；还要开平方。"],
        [m * w, "That multiplies by the mass, but it cancels from $kd = mg$.", "这是乘以了质量，但它在 $kd = mg$ 中约掉了。"],
        [
          m * w * w,
          "That is the spring constant $k = \\frac{mg}{d}$, not the frequency.",
          "这是弹簧常数 $k = \\frac{mg}{d}$，而不是频率。",
        ],
        [Q.of(1, w), "That is $\\sqrt{\\frac{d}{g}}$, the ratio upside down.", "这是 $\\sqrt{\\frac{d}{g}}$，比值倒过来了。"],
      ],
    );
  },
};

const quasiFrequency: KnowledgePointDef = {
  id: "the-quasi-frequency-of-a-damped-oscillator",
  title: t("The quasi-frequency of a damped oscillator", "阻尼振子的准频率"),
  explanation: t(
    "An underdamped oscillator $my'' + cy' + ky = 0$ has characteristic roots $-\\frac{c}{2m} \\pm qi$, where $q^2 = \\frac{k}{m} - \\frac{c^2}{4m^2}$. Its oscillation therefore has the frequency $q$, which is lower than the undamped frequency $\\sqrt{\\frac{k}{m}}$. Damping slows the swings as well as shrinking them. For $y'' + 2y' + 10y = 0$ the roots are $-1 \\pm 3i$, so the quasi-frequency is $3$, below $\\sqrt{10}$.\n\n> **Watch out.** Divide the whole equation by the mass first; the real part $-\\frac{c}{2m}$ is the decay rate, and only the imaginary part is the frequency.",
    "欠阻尼振子 $my'' + cy' + ky = 0$ 的特征根是 $-\\frac{c}{2m} \\pm qi$，其中 $q^2 = \\frac{k}{m} - \\frac{c^2}{4m^2}$。所以它的振动频率是 $q$，低于无阻尼频率 $\\sqrt{\\frac{k}{m}}$。阻尼既使振幅缩小，也使振动变慢。对 $y'' + 2y' + 10y = 0$，根是 $-1 \\pm 3i$，准频率是 $3$，低于 $\\sqrt{10}$。\n\n> **注意。** 先把整个方程除以质量；实部 $-\\frac{c}{2m}$ 是衰减速率，只有虚部才是频率。",
  ),
  generate(rng) {
    const m = rng.int(1, 6);
    const p = rng.int(1, 6);
    const q = rng.int(1, 6);
    const c = 2 * m * p;
    const k = m * (p * p + q * q);
    const free = Math.sqrt(p * p + q * q);
    const monic = poly([1, "r^2"], [2 * p, "r"], [p * p + q * q, ""]);
    return explainedNumber(
      [
        `Find the quasi-frequency, in rad/s, of the oscillator $${poly([m, "y''"], [c, "y'"], [k, "y"])} = 0$.`,
        `求振子 $${poly([m, "y''"], [c, "y'"], [k, "y"])} = 0$ 的准频率（rad/s）。`,
      ],
      q,
      [
        labelled(["Divide by the mass", "除以质量"], "The characteristic equation becomes", "特征方程变为", `${monic} = 0`),
        labelled(
          ["Complete the square", "配方"],
          "The imaginary part of the roots is the quasi-frequency:",
          "根的虚部就是准频率：",
          `(r + ${p})^2 + ${q * q} = 0 \\implies r = ${complexRoots(p, q)}`,
        ),
      ],
      [
        `$(r + ${p})^2 + ${q * q} = ${monic}$, and $${m} \\cdot ${p * p + q * q} = ${k}$.`,
        `$(r + ${p})^2 + ${q * q} = ${monic}$，且 $${m} \\cdot ${p * p + q * q} = ${k}$。`,
      ],
      [
        [p, "That is the decay rate $\\frac{c}{2m}$, the real part of the roots.", "这是衰减速率 $\\frac{c}{2m}$，即根的实部。"],
        [
          p * p + q * q,
          "That is $\\frac{k}{m}$; subtract $\\frac{c^2}{4m^2}$ and take the root.",
          "这是 $\\frac{k}{m}$；还要减去 $\\frac{c^2}{4m^2}$ 并开方。",
        ],
        [q * q, "That is $q^{2}$; take the square root.", "这是 $q^{2}$；还要开平方。"],
        ...(Number.isInteger(free)
          ? [
              [
                free,
                "That is the undamped frequency $\\sqrt{\\frac{k}{m}}$; damping lowers it.",
                "这是无阻尼频率 $\\sqrt{\\frac{k}{m}}$；阻尼会使它降低。",
              ] as const,
            ]
          : []),
      ],
      "integer",
    );
  },
};

const beats: KnowledgePointDef = {
  id: "the-coefficient-of-a-beat",
  title: t("The coefficient of a beat", "拍的系数"),
  explanation: t(
    "An undamped oscillator forced from rest at a nearby frequency combines two cosines: $y = A(\\cos\\nu t - \\cos\\omega t)$, with $A = \\frac{F}{\\omega^2 - \\nu^2}$. The closer the frequencies, the larger $A$ is. The two cosines drift in and out of step, which produces the swelling and fading called beats. For $y'' + 9y = 5\\cos 2t$: $A = \\frac{5}{9 - 4} = 1$, so $y = \\cos 2t - \\cos 3t$.\n\n> **Watch out.** The denominator is the natural frequency squared minus the driving frequency squared, $\\omega^2 - \\nu^2$, in that order; not the difference of the frequencies themselves.",
    "无阻尼振子从静止开始，受到相近频率的强迫时，解是两个余弦的组合：$y = A(\\cos\\nu t - \\cos\\omega t)$，其中 $A = \\frac{F}{\\omega^2 - \\nu^2}$。频率越接近，$A$ 越大。两个余弦时而同步、时而错开，产生时强时弱的现象，叫作拍。对 $y'' + 9y = 5\\cos 2t$：$A = \\frac{5}{9 - 4} = 1$，所以 $y = \\cos 2t - \\cos 3t$。\n\n> **注意。** 分母是固有频率的平方减驱动频率的平方 $\\omega^2 - \\nu^2$，顺序不能反；也不是两个频率本身的差。",
  ),
  generate(rng) {
    const w = rng.int(1, 9);
    const n = different(rng, 1, 9, w);
    const F = rng.int(1, 20);
    const answer = Q.of(F, w * w - n * n);
    const cos = (j: number) => `\\cos ${j === 1 ? "" : j}t`;
    return explainedNumber(
      [
        `The solution of $${poly([1, "y''"], [w * w, "y"])} = ${F}${cos(n)}$ with $y(0) = y'(0) = 0$ has the form $y = A(${cos(n)} - ${cos(w)})$. Find $A$.`,
        `$${poly([1, "y''"], [w * w, "y"])} = ${F}${cos(n)}$，$y(0) = y'(0) = 0$ 的解形如 $y = A(${cos(n)} - ${cos(w)})$。求 $A$。`,
      ],
      answer,
      [
        labelled(
          ["Substitute the forced part", "代入受迫部分"],
          `The term in $${cos(w)}$ solves the homogeneous equation, so only $A${cos(n)}$ meets the forcing:`,
          `$${cos(w)}$ 项满足齐次方程，所以只有 $A${cos(n)}$ 与强迫项对应：`,
          `(A${cos(n)})'' + ${w * w}A${cos(n)} = A(${w * w} - ${n * n})${cos(n)} = ${F}${cos(n)}`,
        ),
        labelled(["Solve for A", "解出 A"], "", "", `A = \\frac{${F}}{${w * w - n * n}} = ${answer.toLatex()}`),
      ],
      [
        `At $t = 0$, $y = A(1 - 1) = 0$ and $y' = A(0 - 0) = 0$; and $${w * w - n * n} \\cdot ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} = ${F}$.`,
        `在 $t = 0$ 处，$y = A(1 - 1) = 0$，$y' = A(0 - 0) = 0$；且 $${w * w - n * n} \\cdot ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} = ${F}$。`,
      ],
      [
        [
          answer.neg(),
          "The sign is flipped; the denominator is $\\omega^2 - \\nu^2$, natural minus driving.",
          "符号反了；分母是 $\\omega^2 - \\nu^2$，固有减驱动。",
        ],
        [
          Q.of(F, w * w + n * n),
          "That adds the squares; the forced term gives $\\omega^2 - \\nu^2$.",
          "这是把平方相加；受迫项给出的是 $\\omega^2 - \\nu^2$。",
        ],
        [Q.of(F, w - n), "That subtracts the frequencies, not their squares.", "这是把频率相减，而不是它们的平方相减。"],
        [F, "That forgets to divide by $\\omega^2 - \\nu^2$.", "这里忘了除以 $\\omega^2 - \\nu^2$。"],
      ],
    );
  },
};

const criticalResistance: KnowledgePointDef = {
  id: "the-resistance-for-critical-damping",
  title: t("The resistance for critical damping", "临界阻尼的电阻"),
  explanation: t(
    "The charge in a series circuit satisfies $Lq'' + Rq' + \\frac{q}{C} = 0$. The circuit is critically damped when the characteristic equation has a repeated root, that is, when $R^2 = \\frac{4L}{C}$. A smaller resistance makes the charge oscillate, and a larger one makes it decay slowly without oscillating. For $L = 2$ H and $C = \\frac{1}{8}$ F, $R^2 = 64$ and $R = 8\\ \\Omega$.\n\n> **Watch out.** $R^2 = \\frac{4L}{C}$ gives the square of the resistance; take the root, and keep the $4$ under it, which becomes a factor $2$.",
    "串联电路中的电荷满足 $Lq'' + Rq' + \\frac{q}{C} = 0$。特征方程有重根时电路处于临界阻尼，即 $R^2 = \\frac{4L}{C}$。电阻更小时电荷会振荡，更大时电荷缓慢衰减而不振荡。对 $L = 2$ H，$C = \\frac{1}{8}$ F，$R^2 = 64$，$R = 8\\ \\Omega$。\n\n> **注意。** $R^2 = \\frac{4L}{C}$ 给出的是电阻的平方，还要开方；根号下的 $4$ 要保留，开方后成为因子 $2$。",
  ),
  generate(rng) {
    const s = rng.int(1, 9);
    const L = rng.int(1, 6);
    const C = Q.of(L, s * s);
    const answer = 2 * s;
    return explainedNumber(
      [
        `A series circuit has inductance ${L} H and capacitance $${C.toLatex()}$ F. Which resistance, in ohms, makes it critically damped?`,
        `串联电路的电感是 ${L} H，电容是 $${C.toLatex()}$ F。多大的电阻（欧姆）使它处于临界阻尼？`,
      ],
      answer,
      [
        labelled(
          ["Ask for a repeated root", "要求重根"],
          `The characteristic equation $${L === 1 ? "" : L}r^2 + Rr + \\frac{1}{C} = 0$ has a repeated root when its discriminant is zero:`,
          `特征方程 $${L === 1 ? "" : L}r^2 + Rr + \\frac{1}{C} = 0$ 的判别式为零时有重根：`,
          `R^2 = \\frac{4L}{C} = 4 \\cdot ${L} \\div ${C.toLatex()} = ${answer * answer}`,
        ),
        labelled(["Take the root", "开方"], "", "", `R = ${answer}`),
      ],
      [`$${answer}^2 \\cdot ${C.toLatex()} = ${4 * L} = 4L$.`, `$${answer}^2 \\cdot ${C.toLatex()} = ${4 * L} = 4L$。`],
      [
        [
          s,
          "That is $\\sqrt{\\frac{L}{C}}$; the $4$ under the root gives a factor $2$.",
          "这是 $\\sqrt{\\frac{L}{C}}$；根号下的 $4$ 给出因子 $2$。",
        ],
        [4 * s * s, "That is $R^2$; take the square root.", "这是 $R^2$；还要开平方。"],
        [
          2 * L,
          "That is $2L$; the capacitance belongs in the formula too, as $\\sqrt{\\frac{4L}{C}}$.",
          "这是 $2L$；公式中还要有电容：$\\sqrt{\\frac{4L}{C}}$。",
        ],
        [s * s, "That is $\\frac{L}{C}$, with neither the $4$ nor the root.", "这是 $\\frac{L}{C}$，既没有乘 $4$ 也没有开方。"],
      ],
      "integer",
    );
  },
};

const stabilityThreshold: KnowledgePointDef = {
  id: "the-parameter-range-for-asymptotic-stability",
  title: t("The parameter range for asymptotic stability", "渐近稳定的参数范围"),
  explanation: t(
    "A two-dimensional linear system is asymptotically stable exactly when its matrix has negative trace and positive determinant. With a parameter in the matrix, each condition gives an inequality. Both must hold, so the stable range is bounded by the stricter of the two conditions. For $\\begin{pmatrix} -2 & 1 \\\\ 3 & k \\end{pmatrix}$: the trace needs $k < 2$ and the determinant $-2k - 3 > 0$ needs $k < -\\tfrac{3}{2}$, so $K = -\\tfrac{3}{2}$.\n\n> **Watch out.** Dividing $-ak > bc$ by the negative number $-a$ reverses the inequality; and the answer is the smaller of the two bounds, not the first one found.",
    "二维线性系统渐近稳定，当且仅当矩阵的迹为负、行列式为正。矩阵含参数时，每个条件都给出一个不等式。两个都必须成立，所以稳定范围由更严格的那个条件决定。对 $\\begin{pmatrix} -2 & 1 \\\\ 3 & k \\end{pmatrix}$：迹要求 $k < 2$，行列式 $-2k - 3 > 0$ 要求 $k < -\\tfrac{3}{2}$，所以 $K = -\\tfrac{3}{2}$。\n\n> **注意。** 用负数 $-a$ 去除 $-ak > bc$ 时不等号要反向；答案是两个界中较小的那个，而不是先求出的那个。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = nonzero(rng, 5);
    const c = nonzero(rng, 5);
    const fromDet = Q.of(-b * c, a);
    const detBound = (-b * c) / a;
    const answer = detBound < a ? fromDet : Q.of(a);
    const other = detBound < a ? Q.of(a) : fromDet;
    return explainedNumber(
      [
        `The system $\\mathbf{x}' = ${matrix2(-a, b, c, "k")}\\mathbf{x}$ is asymptotically stable exactly when $k < K$. Find $K$.`,
        `系统 $\\mathbf{x}' = ${matrix2(-a, b, c, "k")}\\mathbf{x}$ 渐近稳定，当且仅当 $k < K$。求 $K$。`,
      ],
      answer,
      [
        labelled(["Require a negative trace", "要求迹为负"], "", "", `\\operatorname{tr}(A) = k - ${a} < 0, \\qquad k < ${a}`),
        labelled(
          ["Require a positive determinant", "要求行列式为正"],
          `Dividing by $-${a}$ reverses the inequality:`,
          `除以 $-${a}$ 时不等号反向：`,
          `\\det(A) = ${poly([-a, "k"], [-b * c, ""])} > 0, \\qquad k < ${fromDet.toLatex()}`,
        ),
        labelled(
          ["Take the stricter bound", "取更严格的界"],
          "Both conditions must hold:",
          "两个条件都必须成立：",
          `K = \\min\\left(${a}, ${fromDet.toLatex()}\\right) = ${answer.toLatex()}`,
        ),
      ],
      [
        `Just below $K$, at $k = ${answer.sub(Q.of(1)).toLatex()}$, the trace is $${answer.sub(Q.of(1 + a)).toLatex()} < 0$ and the determinant is $${Q.of(
          -a,
        )
          .mul(answer.sub(Q.of(1)))
          .sub(Q.of(b * c))
          .toLatex()} > 0$.`,
        `在 $K$ 稍下方取 $k = ${answer.sub(Q.of(1)).toLatex()}$，迹为 $${answer.sub(Q.of(1 + a)).toLatex()} < 0$，行列式为 $${Q.of(-a)
          .mul(answer.sub(Q.of(1)))
          .sub(Q.of(b * c))
          .toLatex()} > 0$。`,
      ],
      [
        [
          other,
          "That is the weaker bound; both conditions must hold, so take the smaller.",
          "这是较弱的界；两个条件都必须成立，所以取较小的。",
        ],
        [answer.neg(), "The sign is flipped.", "符号反了。"],
        [Q.of(b * c), "That forgets to divide by $-a$ in the determinant condition.", "这是在行列式条件中忘了除以 $-a$。"],
        [Q.of(b * c, a), "Dividing by $-a$ changes the sign of the bound.", "除以 $-a$ 会改变界的符号。"],
      ],
    );
  },
};

const parameterForCenter: KnowledgePointDef = {
  id: "the-parameter-that-makes-a-center",
  title: t("The parameter that makes a center", "使平衡点成为中心的参数"),
  explanation: t(
    "The eigenvalues of a matrix are purely imaginary exactly when its trace is zero and its determinant is positive. Then trajectories are closed curves around a center. A trace above zero gives an outward spiral, and a trace below zero an inward one, so a center is the boundary between the two.\n\n> **Watch out.** A zero trace is not enough on its own: check that the determinant is then positive, or the origin is a saddle. For $\\begin{pmatrix} k & 1 \\\\ -5 & 2 \\end{pmatrix}$, $k = -2$ gives $\\det = -4 + 5 = 1 > 0$, so it is a center.",
    "矩阵的特征值是纯虚数，当且仅当迹为零且行列式为正。此时轨线是绕中心的闭曲线。迹大于零时是向外的螺线，小于零时是向内的螺线，所以中心是二者的分界。\n\n> **注意。** 仅有迹为零还不够：还要检查此时行列式为正，否则原点是鞍点。对 $\\begin{pmatrix} k & 1 \\\\ -5 & 2 \\end{pmatrix}$，$k = -2$ 时 $\\det = -4 + 5 = 1 > 0$，所以是中心。",
  ),
  generate(rng) {
    const d = nonzero(rng, 4);
    const b = rng.int(1, 5);
    const c = d * d + rng.int(1, 5);
    const answer = -d;
    const det = answer * d + b * c;
    const reasons = (
      [
        [d, `That makes the trace $2 \\cdot ${inParens(d)}$, not zero.`, `这使迹为 $2 \\cdot ${inParens(d)}$，而不是零。`],
        [
          0,
          `That leaves the trace at $${d}$; $k$ must cancel the other diagonal entry.`,
          `这使迹仍为 $${d}$；$k$ 必须抵消另一个对角元素。`,
        ],
        [b, "That uses an off-diagonal entry; the trace adds only the diagonal.", "这用了非对角元素；迹只把对角线相加。"],
      ] as const
    )
      .filter(([v], i, all) => v !== answer && all.findIndex(([w]) => w === v) === i)
      .map(([v, en, zh]) => why(v, en, zh));
    return numberProblem({
      prompt: t(
        `For which $k$ is the origin a center of $\\mathbf{x}' = ${matrix2("k", b, -c, d)}\\mathbf{x}$?`,
        `$k$ 取何值时，原点是 $\\mathbf{x}' = ${matrix2("k", b, -c, d)}\\mathbf{x}$ 的中心？`,
      ),
      answer,
      solveFor: "k",
      mistakes: reasons,
      solution: walked(
        [
          labelled(
            ["Set the trace to zero", "令迹为零"],
            "",
            "",
            `\\operatorname{tr} = ${poly([1, "k"], [d, ""])} = 0, \\qquad k = ${answer}`,
          ),
          labelled(
            ["Check the determinant", "检查行列式"],
            "It is positive, so the eigenvalues are purely imaginary and the origin is a center.",
            "它为正，所以特征值是纯虚数，原点是中心。",
            `\\det = ${inParens(answer)}(${d}) - (${b})(${-c}) = ${det}`,
          ),
        ],
        t(
          `With $k = ${answer}$ the characteristic equation is $\\lambda^2 + ${det} = 0$, so $\\lambda = \\pm i\\sqrt{${det}}$, with zero real part.`,
          `$k = ${answer}$ 时特征方程为 $\\lambda^2 + ${det} = 0$，所以 $\\lambda = \\pm i\\sqrt{${det}}$，实部为零。`,
        ),
      ),
    });
  },
};

const parameterForRepeatedEigenvalue: KnowledgePointDef = {
  id: "the-parameter-that-makes-an-eigenvalue-repeated",
  title: t("The parameter that makes an eigenvalue repeated", "使特征值重复的参数"),
  explanation: t(
    "A two-by-two matrix has a repeated eigenvalue when the discriminant of its characteristic equation is zero. For $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$ this discriminant is $(a - d)^2 + 4bc$. Setting it to zero gives the boundary between the real and the complex cases in a phase portrait.\n\n> **Watch out.** The discriminant has a plus sign, $(a - d)^2 + 4bc$, because it comes from $(a + d)^2 - 4(ad - bc)$. For $\\begin{pmatrix} 1 & 2 \\\\ k & 3 \\end{pmatrix}$ it is $4 + 8k$, which is zero at $k = -\\frac{1}{2}$.",
    "二阶矩阵的特征方程判别式为零时，特征值重复。对 $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$，判别式是 $(a - d)^2 + 4bc$。令它为零，就得到相图中实根情形与复根情形的分界。\n\n> **注意。** 判别式中是加号，$(a - d)^2 + 4bc$，因为它来自 $(a + d)^2 - 4(ad - bc)$。对 $\\begin{pmatrix} 1 & 2 \\\\ k & 3 \\end{pmatrix}$，它是 $4 + 8k$，在 $k = -\\frac{1}{2}$ 时为零。",
  ),
  generate(rng) {
    const a = rng.int(-6, 6);
    const d = different(rng, -6, 6, a);
    const b = nonzero(rng, 5);
    const gap = (a - d) ** 2;
    const answer = Q.of(-gap, 4 * b);
    const det = Q.of(a * d).sub(Q.of(b).mul(answer));
    const detIn = det.sign() < 0 ? `\\left(${det.toLatex()}\\right)` : det.toLatex();
    return explainedNumber(
      [
        `For which $k$ does $${matrix2(a, b, "k", d)}$ have a repeated eigenvalue?`,
        `$k$ 取何值时 $${matrix2(a, b, "k", d)}$ 有重复的特征值？`,
      ],
      answer,
      [
        labelled(["Write the discriminant", "写出判别式"], "", "", `(${a - d})^2 + 4(${b})k = ${poly([gap, ""], [4 * b, "k"])}`),
        labelled(["Set it to zero", "令它为零"], "", "", `k = ${-gap} \\div ${inParens(4 * b)} = ${answer.toLatex()}`),
      ],
      [
        `With this $k$, $\\operatorname{tr}^2 - 4\\det = ${inParens(a + d)}^2 - 4 \\cdot ${detIn} = 0$, so the eigenvalue $${Q.of(a + d, 2).toLatex()}$ is repeated.`,
        `取这个 $k$，$\\operatorname{tr}^2 - 4\\det = ${inParens(a + d)}^2 - 4 \\cdot ${detIn} = 0$，所以特征值 $${Q.of(a + d, 2).toLatex()}$ 是重根。`,
      ],
      [
        [answer.neg(), "The sign is flipped when $4bk$ is moved across.", "把 $4bk$ 移到另一边时符号弄反了。"],
        [Q.of(-gap, b), "That forgets the factor $4$ in $4bk$.", "这里忘了 $4bk$ 中的因子 $4$。"],
        [Q.of(-(a - d), 4 * b), "That forgets to square $a - d$.", "这里忘了把 $a - d$ 平方。"],
      ],
    );
  },
};

const determinantOfExponential: KnowledgePointDef = {
  id: "the-determinant-of-a-matrix-exponential",
  title: t("The determinant of a matrix exponential", "矩阵指数的行列式"),
  explanation: t(
    "The eigenvalues of $e^{tA}$ are $e^{t\\lambda}$ for each eigenvalue $\\lambda$ of $A$, and a determinant is a product of eigenvalues. Multiplying exponentials adds their exponents, so $\\det e^{tA} = e^{t\\operatorname{tr}A}$. This holds without computing the exponential, and it shows that $e^{tA}$ is never singular.\n\n> **Watch out.** The exponent uses the trace of $A$, not its determinant, and it is multiplied by $t$. For $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$, $\\det e^{2A} = e^{2 \\cdot 5} = e^{10}$, not $e^{2 \\cdot (-2)}$ and not $e^{5}$.",
    "$e^{tA}$ 的特征值是 $e^{t\\lambda}$，其中 $\\lambda$ 是 $A$ 的特征值，而行列式是特征值之积。指数相乘时指数部分相加，所以 $\\det e^{tA} = e^{t\\operatorname{tr}A}$。这不必算出矩阵指数，也说明 $e^{tA}$ 永远可逆。\n\n> **注意。** 指数用的是 $A$ 的迹而不是行列式，并且要乘以 $t$。对 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$，$\\det e^{2A} = e^{2 \\cdot 5} = e^{10}$，不是 $e^{2 \\cdot (-2)}$，也不是 $e^{5}$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const b = nonzero(rng, 9);
    const c = nonzero(rng, 9);
    let d = nonzero(rng, 9);
    if (a + d === 0) d = d === 9 ? 8 : d + 1;
    const s = rng.int(2, 5);
    const trace = a + d;
    const det = a * d - b * c;
    const answer = s * trace;
    const mistakes = (
      [
        [trace, "That is the trace of $A$; the exponent of $e^{sA}$ is $s$ times it.", "这是 $A$ 的迹；$e^{sA}$ 的指数是它的 $s$ 倍。"],
        [s * det, "That uses the determinant of $A$; the exponent comes from the trace.", "这用了 $A$ 的行列式；指数来自迹。"],
        [
          det,
          "That is the determinant of $A$ itself; the exponent comes from the trace of $sA$.",
          "这是 $A$ 本身的行列式；指数来自 $sA$ 的迹。",
        ],
      ] as const
    )
      .filter(([v], i, all) => v !== answer && all.findIndex(([w]) => w === v) === i)
      .map(([v, en, zh]) => why(v, en, zh));
    return numberProblem({
      prompt: t(
        `$A = ${matrix2(a, b, c, d)}$, and $\\det e^{${s}A} = e^{k}$. Find $k$.`,
        `$A = ${matrix2(a, b, c, d)}$，$\\det e^{${s}A} = e^{k}$。求 $k$。`,
      ),
      answer,
      solveFor: "k",
      mistakes,
      solution: walked(
        [
          labelled(
            ["Take the trace", "求迹"],
            "Add the diagonal entries only.",
            "只把对角元素相加。",
            `\\operatorname{tr}A = ${a} + ${inParens(d)} = ${trace}`,
          ),
          labelled(
            ["Scale by the time", "乘以时间"],
            `The trace of $${s}A$ is $${s}$ times the trace of $A$.`,
            `$${s}A$ 的迹是 $A$ 的迹的 $${s}$ 倍。`,
            `k = ${s} \\cdot ${inParens(trace)} = ${answer}`,
          ),
        ],
        t(
          `If $\\lambda_1, \\lambda_2$ are the eigenvalues of $A$, then $\\det e^{${s}A} = e^{${s}\\lambda_1}e^{${s}\\lambda_2} = e^{${s}(\\lambda_1 + \\lambda_2)}$, and $\\lambda_1 + \\lambda_2 = ${trace}$, so the exponent is $${answer}$.`,
          `设 $\\lambda_1, \\lambda_2$ 是 $A$ 的特征值，则 $\\det e^{${s}A} = e^{${s}\\lambda_1}e^{${s}\\lambda_2} = e^{${s}(\\lambda_1 + \\lambda_2)}$，而 $\\lambda_1 + \\lambda_2 = ${trace}$，所以指数为 $${answer}$。`,
        ),
      ),
    });
  },
};

const slopeFromTransform: KnowledgePointDef = {
  id: "initial-values-from-a-transform",
  title: t("Initial values from a transform", "由变换求初始值"),
  explanation: t(
    "A transform shows the initial behaviour of a function without inverting it. Since $\\mathcal{L}\\{f'\\} = sF(s) - f(0)$ tends to zero as $s$ grows, $f(0) = \\lim_{s \\to \\infty} sF(s)$. Applying the same limit to $f'$ gives $f'(0) = \\lim_{s \\to \\infty} s\\left(sF(s) - f(0)\\right)$.\n\n> **Watch out.** Subtract $f(0)$ before multiplying by $s$ again; the denominator then contributes too. For $F(s) = \\frac{2s + 7}{s^{2} + 3s + 5}$, $f(0) = 2$ and $f'(0) = 7 - 2 \\cdot 3 = 1$, not the constant $7$ of the numerator.",
    "不用求逆变换，也能从变换看出函数的初始行为。由于 $s$ 增大时 $\\mathcal{L}\\{f'\\} = sF(s) - f(0)$ 趋于零，所以 $f(0) = \\lim_{s \\to \\infty} sF(s)$。对 $f'$ 用同样的极限，得 $f'(0) = \\lim_{s \\to \\infty} s\\left(sF(s) - f(0)\\right)$。\n\n> **注意。** 要先减去 $f(0)$ 再乘以 $s$，这时分母也会起作用。对 $F(s) = \\frac{2s + 7}{s^{2} + 3s + 5}$，$f(0) = 2$，$f'(0) = 7 - 2 \\cdot 3 = 1$，不是分子的常数 $7$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 9);
    const c = rng.int(1, 6);
    const d = rng.int(1, 12);
    const answer = b - a * c;
    const den = poly([1, "s^2"], [c, "s"], [d, ""]);
    const F = `\\frac{${poly([a, "s"], [b, ""])}}{${den}}`;
    const next = answer === 0 ? "" : ` ${answer < 0 ? "-" : "+"} \\frac{${Math.abs(answer)}}{s^2}`;
    const series = `${a < 0 ? "-" : ""}\\frac{${Math.abs(a)}}{s}${next}`;
    return explainedNumber(
      [`The function $f$ has Laplace transform $F(s) = ${F}$. Find $f'(0)$.`, `函数 $f$ 的拉普拉斯变换是 $F(s) = ${F}$。求 $f'(0)$。`],
      answer,
      [
        labelled(
          ["Find f(0)", "求 f(0)"],
          "As $s \\to \\infty$ only the leading terms count:",
          "当 $s \\to \\infty$ 时只有最高次项起作用：",
          `f(0) = \\lim_{s \\to \\infty} \\frac{${poly([a, "s^2"], [b, "s"])}}{${den}} = ${a}`,
        ),
        labelled(
          ["Subtract f(0) and multiply by s", "减去 f(0) 再乘以 s"],
          "",
          "",
          `sF(s) ${a < 0 ? "+" : "-"} ${Math.abs(a)} = \\frac{${poly([answer, "s"], [-a * d, ""])}}{${den}}`,
          `f'(0) = \\lim_{s \\to \\infty} \\frac{${poly([answer, "s^2"], [-a * d, "s"])}}{${den}} = ${answer}`,
        ),
      ],
      [
        `Long division gives $F(s) = ${series} + \\cdots$, and since $\\mathcal{L}\\{1\\} = \\frac{1}{s}$ and $\\mathcal{L}\\{t\\} = \\frac{1}{s^2}$, near $t = 0$ we have $f(t) \\approx ${poly([a, ""], [answer, "t"])}$.`,
        `长除法给出 $F(s) = ${series} + \\cdots$，由于 $\\mathcal{L}\\{1\\} = \\frac{1}{s}$，$\\mathcal{L}\\{t\\} = \\frac{1}{s^2}$，在 $t = 0$ 附近 $f(t) \\approx ${poly([a, ""], [answer, "t"])}$。`,
      ],
      [
        [
          b,
          `That is the constant of the numerator; subtracting $f(0)$ also brings in $-${inParens(a)} \\cdot ${c}$ from the $${c === 1 ? "" : c}s$ of the denominator.`,
          `这是分子的常数；减去 $f(0)$ 时还会从分母的 $${c === 1 ? "" : c}s$ 带来 $-${inParens(a)} \\cdot ${c}$。`,
        ],
        [a, "That is $f(0)$, the first limit; $f'(0)$ needs a second one.", "这是第一个极限 $f(0)$；求 $f'(0)$ 还要再取一次极限。"],
        [b + a * c, "That adds the $f(0)$ term instead of subtracting it.", "这把 $f(0)$ 那一项加上了，应当减去。"],
      ],
      "integer",
    );
  },
};

const convolutionOfPowers: KnowledgePointDef = {
  id: "a-convolution-through-the-transform",
  title: t("A convolution through the transform", "通过变换求卷积"),
  explanation: t(
    "The convolution $(f * g)(t) = \\int_0^t f(\\tau)g(t - \\tau)\\,d\\tau$ has the transform $F(s)G(s)$. So a convolution can be found by multiplying transforms and inverting the product. This is usually quicker than the integral, and it is also why a product of transforms is not the transform of a product.\n\n> **Watch out.** Inverting $\\frac{1}{s^{n + 1}}$ gives $\\frac{t^{n}}{n!}$, so the factorial must be divided out. For $t * t$, the product $\\frac{1}{s^{4}}$ inverts to $\\frac{t^{3}}{6}$, not $t^{3}$; the integral $\\int_0^t \\tau(t - \\tau)\\,d\\tau = \\frac{t^{3}}{6}$ agrees.",
    "卷积 $(f * g)(t) = \\int_0^t f(\\tau)g(t - \\tau)\\,d\\tau$ 的变换是 $F(s)G(s)$。所以可以把变换相乘，再求逆变换，得到卷积。这通常比直接积分快，这也说明变换之积并不是乘积的变换。\n\n> **注意。** $\\frac{1}{s^{n + 1}}$ 的逆变换是 $\\frac{t^{n}}{n!}$，阶乘必须除掉。对 $t * t$，乘积 $\\frac{1}{s^{4}}$ 的逆变换是 $\\frac{t^{3}}{6}$，不是 $t^{3}$；积分 $\\int_0^t \\tau(t - \\tau)\\,d\\tau = \\frac{t^{3}}{6}$ 也给出同样结果。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const T = rng.int(1, 4);
    const answer = Q.of(a * b * T ** 4, 12);
    const coef = Q.of(a * b, 12);
    return explainedNumber(
      [
        `Let $f(t) = ${poly([a, "t"])}$ and $g(t) = ${poly([b, "t^2"])}$. Find the convolution $(f * g)(${T})$.`,
        `设 $f(t) = ${poly([a, "t"])}$，$g(t) = ${poly([b, "t^2"])}$。求卷积 $(f * g)(${T})$。`,
      ],
      answer,
      [
        labelled(
          ["Multiply the transforms", "把变换相乘"],
          "",
          "",
          `F(s)G(s) = \\frac{${a}}{s^2} \\cdot \\frac{${2 * b}}{s^3} = \\frac{${2 * a * b}}{s^5}`,
        ),
        labelled(
          ["Invert the product", "求乘积的逆变换"],
          "Since $\\mathcal{L}\\{t^4\\} = \\frac{24}{s^5}$, divide by $4! = 24$:",
          "由于 $\\mathcal{L}\\{t^4\\} = \\frac{24}{s^5}$，要除以 $4! = 24$：",
          `(f * g)(t) = \\frac{${2 * a * b}}{24}t^4${coef.toLatex() === `\\frac{${2 * a * b}}{24}` ? "" : ` = ${poly([coef, "t^4"])}`}`,
          `(f * g)(${T}) = ${coef.toLatex()} \\cdot ${T ** 4} = ${answer.toLatex()}`,
        ),
      ],
      [
        `The integral agrees: $\\int_0^t ${a === 1 ? "" : a}\\tau \\cdot ${b === 1 ? "" : b}(t - \\tau)^2\\,d\\tau = ${a * b === 1 ? "" : a * b}\\left(\\frac{t^4}{2} - \\frac{2t^4}{3} + \\frac{t^4}{4}\\right) = ${poly([coef, "t^4"])}$.`,
        `直接积分也一致：$\\int_0^t ${a === 1 ? "" : a}\\tau \\cdot ${b === 1 ? "" : b}(t - \\tau)^2\\,d\\tau = ${a * b === 1 ? "" : a * b}\\left(\\frac{t^4}{2} - \\frac{2t^4}{3} + \\frac{t^4}{4}\\right) = ${poly([coef, "t^4"])}$。`,
      ],
      [
        [
          Q.of(a * b * T ** 3),
          "That multiplies $f$ and $g$ at the point; a convolution is an integral, not a product.",
          "这是在该点把 $f$ 与 $g$ 相乘；卷积是积分，不是乘积。",
        ],
        [
          Q.of(a * b * T ** 4, 24),
          "That inverts $\\frac{1}{s^3}$ for $g$ as $t^2$ without the factor $2$ in $\\mathcal{L}\\{t^2\\} = \\frac{2}{s^3}$.",
          "这里把 $g$ 的变换写成了 $\\frac{1}{s^3}$，漏掉了 $\\mathcal{L}\\{t^2\\} = \\frac{2}{s^3}$ 中的因子 $2$。",
        ],
        [
          Q.of(a * b * T ** 4, 2),
          "That divides by $4$ instead of by $4! = 24$ when inverting $\\frac{1}{s^5}$.",
          "求 $\\frac{1}{s^5}$ 的逆变换时除以了 $4$，应除以 $4! = 24$。",
        ],
      ],
    );
  },
};

const sineCoefficientOfAStep: KnowledgePointDef = {
  id: "a-fourier-sine-coefficient-of-a-step",
  title: t("A Fourier sine coefficient of a step", "阶跃函数的傅里叶正弦系数"),
  explanation: t(
    "For a function that is constant on each half of $(-\\pi, \\pi)$, split the integral for $b_n$ at zero. Over a half period, $\\int_0^\\pi \\sin nx\\,dx$ is $\\frac{2}{n}$ for odd $n$ and zero for even $n$. So only odd frequencies appear, and their coefficients fall off like $\\frac{1}{n}$.\n\n> **Watch out.** On $(-\\pi, 0)$ the sine is negative, so the left value enters with a minus sign. For $f = -1$ then $1$, $b_1 = \\frac{1}{\\pi}\\left((-1)(-2) + 1 \\cdot 2\\right) = \\frac{4}{\\pi}$, not $0$.",
    "对在 $(-\\pi, \\pi)$ 两半上分别为常数的函数，把 $b_n$ 的积分在零处分开。在半个周期上，$\\int_0^\\pi \\sin nx\\,dx$ 当 $n$ 为奇数时是 $\\frac{2}{n}$，为偶数时是零。所以只出现奇数频率，系数按 $\\frac{1}{n}$ 衰减。\n\n> **注意。** 在 $(-\\pi, 0)$ 上正弦为负，所以左边的值带着负号进入。对先为 $-1$、后为 $1$ 的 $f$，$b_1 = \\frac{1}{\\pi}\\left((-1)(-2) + 1 \\cdot 2\\right) = \\frac{4}{\\pi}$，不是 $0$。",
  ),
  generate(rng) {
    const a = rng.int(-6, 6);
    const b = different(rng, -6, 6, a);
    const n = rng.pick([1, 3, 5, 7]);
    const answer = Q.of(2 * (b - a), n);
    const f = `\\begin{cases} ${a} & -\\pi < x < 0 \\\\ ${b} & 0 < x < \\pi \\end{cases}`;
    const half = n === 1 ? "2" : `\\frac{2}{${n}}`;
    const sine = `\\sin ${n === 1 ? "" : n}x`;
    return explainedNumber(
      [
        `Let $f(x) = ${f}$. Its Fourier coefficient is $b_{${n}} = \\frac{c}{\\pi}$. Find $c$.`,
        `设 $f(x) = ${f}$。它的傅里叶系数是 $b_{${n}} = \\frac{c}{\\pi}$。求 $c$。`,
      ],
      answer,
      [
        labelled(
          ["Integrate over each half", "在每一半上积分"],
          "",
          "",
          `\\int_{-\\pi}^{0}${sine}\\,dx = -${half}, \\qquad \\int_{0}^{\\pi}${sine}\\,dx = ${half}`,
        ),
        labelled(
          ["Weight by the two values", "乘以两段的值"],
          "",
          "",
          `\\pi b_{${n}} = ${inParens(a)} \\cdot \\left(-${half}\\right) + ${inParens(b)} \\cdot ${half} = ${answer.toLatex()}`,
          `c = ${answer.toLatex()}`,
        ),
      ],
      [
        `The jump from $${a}$ to $${b}$ is $${b - a}$, and $c = 2 \\cdot ${inParens(b - a)} \\div ${n} = ${answer.toLatex()}$, as for a square wave of that height.`,
        `从 $${a}$ 到 $${b}$ 的跳跃为 $${b - a}$，$c = 2 \\cdot ${inParens(b - a)} \\div ${n} = ${answer.toLatex()}$，与这个高度的方波相同。`,
      ],
      [
        [
          Q.of(b - a, n),
          `That drops the 2: over a half period $\\int_{0}^{\\pi}${sine}\\,dx = ${half}$.`,
          `这漏掉了 2：在半个周期上 $\\int_{0}^{\\pi}${sine}\\,dx = ${half}$。`,
        ],
        [
          answer.neg(),
          "That swaps the signs of the halves; the sine is negative on $(-\\pi, 0)$, so the left value gets the minus sign.",
          "这把两半的符号弄反了；正弦在 $(-\\pi, 0)$ 上为负，所以负号属于左边的值。",
        ],
        [
          Q.of(2 * (a + b), n),
          "That gives both halves the same integral; on $(-\\pi, 0)$ it is negative.",
          "这让两半的积分相同；在 $(-\\pi, 0)$ 上它是负的。",
        ],
      ],
    );
  },
};

const recurrenceGrowth: KnowledgePointDef = {
  id: "the-long-run-ratio-of-a-linear-recurrence",
  title: t("The long-run ratio of a linear recurrence", "线性递推的长期比值"),
  explanation: t(
    "Trying $a_n = x^n$ in $a_{n+2} = pa_{n+1} + qa_n$ gives the characteristic equation $x^2 = px + q$, just as for a differential equation. The solution is a combination of the powers of the two roots. The root of larger size dominates, so the ratio of consecutive terms tends to that root.\n\nFor example, $a_{n+2} = a_{n+1} + a_n$ with $a_0 = a_1 = 1$ gives $1, 1, 2, 3, 5, 8, 13, \\ldots$. Its characteristic equation $x^2 = x + 1$ has roots $\\frac{1 \\pm \\sqrt{5}}{2}$, about $1.618$ and $-0.618$. The ratios $\\frac{13}{8} = 1.625$ and $\\frac{8}{5} = 1.6$ already lie close to $1.618$.\n\n> **Watch out.** The ratio tends to a root of the characteristic equation, not to a coefficient of the recurrence. Of the two roots, take the one of larger size, not the one written first. That root wins only when the starting values give it a nonzero coefficient.",
    "把 $a_n = x^n$ 代入 $a_{n+2} = pa_{n+1} + qa_n$，得特征方程 $x^2 = px + q$，与微分方程的做法一样。解是两个根的幂的组合。绝对值较大的根占主导，所以相邻两项之比趋于这个根。\n\n例如，$a_{n+2} = a_{n+1} + a_n$，$a_0 = a_1 = 1$，得到 $1, 1, 2, 3, 5, 8, 13, \\ldots$。特征方程 $x^2 = x + 1$ 的根是 $\\frac{1 \\pm \\sqrt{5}}{2}$，约为 $1.618$ 和 $-0.618$。比值 $\\frac{13}{8} = 1.625$、$\\frac{8}{5} = 1.6$ 已经很接近 $1.618$。\n\n> **注意。** 比值趋于特征方程的根，而不是递推式的系数。两个根中取绝对值较大的那个，而不是先写出的那个。只有初始值使这个根的系数不为零，它才占主导。",
  ),
  generate(rng) {
    const r = rng.int(2, 7);
    const s = rng.pick([...Array(2 * r - 1).keys()].map((i) => i - r + 1).filter((i) => i !== 0 && i !== 1));
    const p = r + s;
    const q = -r * s;
    const right = poly([p, "a_{n+1}"], [q, "a_n"]);
    const characteristic = poly([1, "x^2"], [-p, "x"], [-q, ""]);
    const coefficient = Q.of(1 - s, r - s);
    return explainedNumber(
      [
        `A sequence has $a_0 = a_1 = 1$ and $a_{n+2} = ${right}$. What does $\\frac{a_{n+1}}{a_n}$ tend to?`,
        `数列满足 $a_0 = a_1 = 1$，$a_{n+2} = ${right}$。$\\frac{a_{n+1}}{a_n}$ 趋于多少？`,
      ],
      r,
      [
        labelled(
          ["Form the characteristic equation", "写出特征方程"],
          `Trying $a_n = x^n$ gives $${characteristic} = 0$, which factors as $(x - ${r})${s < 0 ? `(x + ${-s})` : `(x - ${s})`} = 0$. The roots are $${r}$ and $${s}$.`,
          `代入 $a_n = x^n$ 得 $${characteristic} = 0$，分解为 $(x - ${r})${s < 0 ? `(x + ${-s})` : `(x - ${s})`} = 0$。两根是 $${r}$ 和 $${s}$。`,
        ),
        labelled(
          ["Pick the dominant root", "选出占主导的根"],
          `So $a_n = A \\cdot ${r}^n + B \\cdot ${s < 0 ? `(${s})` : s}^n$. From $a_0 = a_1 = 1$, $A = ${coefficient.toLatex()}$, which is not zero. Since $|${s}| < ${r}$, the term in $${r}^n$ outgrows the other, and the ratio tends to $${r}$.`,
          `所以 $a_n = A \\cdot ${r}^n + B \\cdot ${s < 0 ? `(${s})` : s}^n$。由 $a_0 = a_1 = 1$ 得 $A = ${coefficient.toLatex()}$，不为零。因为 $|${s}| < ${r}$，含 $${r}^n$ 的项增长得更快，比值趋于 $${r}$。`,
        ),
      ],
      [
        `$${r}$ is a root: $${r}^2 = ${r * r}$ and $${p} \\cdot ${r} ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${p * r + q}$.`,
        `$${r}$ 是根：$${r}^2 = ${r * r}$，$${p} \\cdot ${r} ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${p * r + q}$。`,
      ],
      [
        [
          s,
          `This is the other root, $${s}$, whose size is smaller, so its powers fade beside those of $${r}$.`,
          `这是另一个根 $${s}$，它的绝对值较小，它的幂与 $${r}$ 的幂相比可以忽略。`,
        ],
        [
          p,
          `This is the coefficient $${p}$ of $a_{n+1}$, the sum of the roots, not a root.`,
          `这是 $a_{n+1}$ 的系数 $${p}$，它是两根之和，不是根。`,
        ],
        [
          q,
          `This is the coefficient $${q}$ of $a_n$, minus the product of the roots, not a root.`,
          `这是 $a_n$ 的系数 $${q}$，它是两根之积的相反数，不是根。`,
        ],
      ],
      "integer",
    );
  },
};

const richardson: KnowledgePointDef = {
  id: "richardson-extrapolation",
  title: t("Richardson extrapolation", "理查森外推"),
  explanation: t(
    "If a method has order $p$, halving the step divides the error by about $2^p$. Combining two estimates can cancel this leading error: $y \\approx \\frac{2^py_{h/2} - y_h}{2^p - 1}$. So two runs with different steps give a better answer than either, at no extra cost beyond the runs themselves.\n\n> **Watch out.** Put the weight $2^p$ on the finer estimate, and divide by $2^p - 1$. For a second-order method with $y_h = 2.0$ and $y_{h/2} = 2.3$: $\\frac{4 \\cdot 2.3 - 2.0}{3} = 2.4$; leaving out the division gives $7.2$, far from both estimates.",
    "如果方法是 $p$ 阶的，步长减半时误差大约除以 $2^p$。组合两个估计值可以消去这个主要误差：$y \\approx \\frac{2^py_{h/2} - y_h}{2^p - 1}$。所以用不同步长运行两次，能得到比任何一次都好的答案，除了运行本身没有额外代价。\n\n> **注意。** 权重 $2^p$ 要放在较细步长的估计值上，并且要除以 $2^p - 1$。对二阶方法，$y_h = 2.0$，$y_{h/2} = 2.3$：$\\frac{4 \\cdot 2.3 - 2.0}{3} = 2.4$；漏掉除法会得到 $7.2$，与两个估计值都相差很远。",
  ),
  generate(rng) {
    const p = rng.int(1, 2);
    const y1 = rng.int(11, 40);
    const y2 = y1 + rng.int(1, 9);
    const factor = 2 ** p;
    const answer = Q.of(factor * y2 - y1, 10 * (factor - 1));
    const weighted = Q.of(factor * y2 - y1, 10);
    const fine = Q.of(y2 - y1, 10 * (factor - 1));
    const coarse = Q.of(factor * (y2 - y1), 10 * (factor - 1));
    return explainedNumber(
      [
        `A method of order ${p} gives the estimate $${decimal(y1)}$ with step $h$ and $${decimal(y2)}$ with step $\\frac{h}{2}$. What value does Richardson extrapolation give?`,
        `一个 ${p} 阶方法用步长 $h$ 得到估计值 $${decimal(y1)}$，用步长 $\\frac{h}{2}$ 得到 $${decimal(y2)}$。理查森外推给出什么值？`,
      ],
      answer,
      [
        labelled(
          ["Weight the finer estimate", "给较细的估计值加权"],
          `For order $${p}$ the weight is $2^p = ${factor}$:`,
          `对 $${p}$ 阶方法，权重为 $2^p = ${factor}$：`,
          `${factor} \\cdot ${decimal(y2)} - ${decimal(y1)} = ${dec(weighted)}`,
        ),
        p === 1
          ? labelled(
              ["Divide by $2^p - 1$", "除以 $2^p - 1$"],
              `Here $2 - 1 = 1$, so the value stands: $y \\approx ${answer.toLatex()}$.`,
              `这里 $2 - 1 = 1$，所以数值不变：$y \\approx ${answer.toLatex()}$。`,
            )
          : labelled(["Divide by $2^p - 1$", "除以 $2^p - 1$"], "", "", `y \\approx \\frac{${dec(weighted)}}{3} = ${answer.toLatex()}`),
      ],
      [
        `The errors left in the two estimates are $${answer.toLatex()} - ${decimal(y1)} = ${coarse.toLatex()}$ and $${answer.toLatex()} - ${decimal(y2)} = ${fine.toLatex()}$, and $${factor} \\cdot ${fine.toLatex()} = ${coarse.toLatex()}$: halving the step divided the error by $${factor}$, as order $${p}$ predicts.`,
        `两个估计值剩下的误差为 $${answer.toLatex()} - ${decimal(y1)} = ${coarse.toLatex()}$ 与 $${answer.toLatex()} - ${decimal(y2)} = ${fine.toLatex()}$，而 $${factor} \\cdot ${fine.toLatex()} = ${coarse.toLatex()}$：步长减半使误差除以 $${factor}$，正如 $${p}$ 阶所预言。`,
      ],
      [
        [
          Q.of(y2, 10),
          "That is the finer estimate itself; extrapolation goes beyond it by removing its leading error.",
          "这是较细步长的估计值本身；外推要消去它的主要误差，从而超出它。",
        ],
        [
          Q.of(y1 + y2, 20),
          "That averages the two estimates; the finer one carries the weight $2^p$.",
          "这是两个估计值的平均；较细的那个权重为 $2^p$。",
        ],
        [
          p === 1 ? Q.of(4 * y2 - y1, 30) : Q.of(2 * y2 - y1, 10),
          `That uses the weight for order $${p === 1 ? 2 : 1}$; this method has order $${p}$.`,
          `这用了 $${p === 1 ? 2 : 1}$ 阶的权重；这个方法是 $${p}$ 阶的。`,
        ],
        [weighted, "That leaves out the division by $2^p - 1$.", "这漏掉了除以 $2^p - 1$。"],
      ],
    );
  },
};

/** exponential writes e raised to a whole multiple of a variable, without a coefficient of 1. */
const exponential = (r: number, v: string) => `e^{${r === 1 ? "" : r === -1 ? "-" : r}${v}}`;
/** power writes x raised to a nonzero whole number, without an exponent of 1. */
const power = (r: number) => (r === 1 ? "x" : `x^{${r}}`);
/** shifted writes x minus a number, as a single sign. */
const shifted = (a: number) => poly([1, "x"], [-a, ""]);
/** multiple writes a whole multiple of an angle, without a coefficient of 1. */
const multiple = (k: number, angle: string) => `${k === 1 ? "" : k}${angle}`;
/** signedFactor puts a negative rational in parentheses, for use after a product sign. */
const signedFactor = (q: Q) => (q.sign() < 0 ? `(${q.toLatex()})` : q.toLatex());
/** gcd is the greatest common divisor of two positive integers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const timeConstantOfDrag: KnowledgePointDef = {
  id: "the-time-constant-of-linear-drag",
  title: t("The time constant of linear drag", "线性阻力的时间常数"),
  explanation: t(
    "A body falling from rest with drag $bv$ has speed $v = v_T\\left(1 - e^{-bt/m}\\right)$, where $v_T$ is its terminal speed. The fraction of the terminal speed reached depends only on $\\frac{bt}{m}$, not on $g$. So $\\frac{m}{b}$ sets the time scale of the fall, and it is called the time constant.\n\n> **Watch out.** The time constant is $\\frac{m}{b}$, mass over drag coefficient. A $10$ kg body with drag $2v$ N reaches $1 - e^{-1}$ of its terminal speed after $\\frac{10}{2} = 5$ s, not $\\frac{2}{10} = 0.2$ s.",
    "从静止开始、受阻力 $bv$ 的落体，速度为 $v = v_T\\left(1 - e^{-bt/m}\\right)$，其中 $v_T$ 是终端速度。达到终端速度的比例只取决于 $\\frac{bt}{m}$，与 $g$ 无关。所以 $\\frac{m}{b}$ 决定了下落的时间尺度，它叫作时间常数。\n\n> **注意。** 时间常数是 $\\frac{m}{b}$，质量除以阻力系数。质量 $10$ kg、阻力 $2v$ N 的物体，经过 $\\frac{10}{2} = 5$ 秒达到终端速度的 $1 - e^{-1}$，不是 $\\frac{2}{10} = 0.2$ 秒。",
  ),
  generate(rng) {
    const m = rng.int(2, 20);
    const b = rng.int(2, 10);
    const k = rng.int(1, 3);
    const answer = Q.of(k * m, b);
    return explainedNumber(
      [
        `An object of mass $${m}\\text{ kg}$ falls from rest with air resistance $${b}v\\text{ N}$. After how many seconds has its speed reached the fraction $1 - e^{-${k}}$ of its terminal speed?`,
        `质量为 $${m}\\text{ kg}$ 的物体从静止开始下落，空气阻力为 $${b}v\\text{ N}$。经过多少秒，它的速度达到终端速度的 $1 - e^{-${k}}$ 倍？`,
      ],
      answer,
      [
        labelled(["Write the fraction reached", "写出达到的比例"], "", "", `\\frac{v}{v_T} = 1 - e^{-${b}t/${m}}`),
        labelled(
          ["Match the exponents", "比较指数"],
          "",
          "",
          `\\frac{${b}t}{${m}} = ${k}, \\qquad t = ${k * m} \\div ${b} = ${answer.toLatex()}`,
        ),
      ],
      [
        `At $t = ${answer.toLatex()}$ the exponent is $\\frac{${b}}{${m}} \\cdot ${answer.toLatex()} = ${k}$, as required.`,
        `在 $t = ${answer.toLatex()}$ 时，指数为 $\\frac{${b}}{${m}} \\cdot ${answer.toLatex()} = ${k}$，符合要求。`,
      ],
      [
        [
          Q.of(m, b),
          `That is one time constant; the fraction $1 - e^{-${k}}$ needs ${k} of them.`,
          `这是一个时间常数；比例 $1 - e^{-${k}}$ 需要 ${k} 个。`,
        ],
        [Q.of(k * b, m), "That turns the time constant upside down; it is $\\frac{m}{b}$.", "这把时间常数颠倒了；它是 $\\frac{m}{b}$。"],
        [Q.of(k * m), "That forgets to divide by the drag coefficient $b$.", "这忘了除以阻力系数 $b$。"],
      ],
    );
  },
};

const rateOfCurrent: KnowledgePointDef = {
  id: "the-rate-of-the-current-at-a-moment",
  title: t("The rate of the current at a moment", "某一时刻电流的变化率"),
  explanation: t(
    "In a series RL circuit the voltages balance, so $Li' + Ri = V$ at every moment. This gives the rate of change of the current directly from its present value, with no need to solve the equation. The current rises while it is below $\\frac{V}{R}$ and falls while it is above.\n\n> **Watch out.** Subtract the resistor's voltage before dividing by $L$. With $L = 2$ H, $R = 5\\ \\Omega$, $V = 40$ V and $i = 6$ A, $i' = \\frac{40 - 30}{2} = 5$ A/s, not $\\frac{40}{2} = 20$ A/s.",
    "在串联 RL 电路中电压始终平衡，所以每一时刻都有 $Li' + Ri = V$。由此可以直接从当前电流得到它的变化率，不需要解方程。电流低于 $\\frac{V}{R}$ 时上升，高于它时下降。\n\n> **注意。** 先减去电阻上的电压，再除以 $L$。若 $L = 2$ H，$R = 5\\ \\Omega$，$V = 40$ V，$i = 6$ A，则 $i' = \\frac{40 - 30}{2} = 5$ A/s，不是 $\\frac{40}{2} = 20$ A/s。",
  ),
  generate(rng) {
    const L = rng.int(1, 10);
    const R = rng.int(1, 12);
    const V = 10 * rng.int(1, 12);
    const i = rng.int(1, 10);
    const answer = Q.of(V - R * i, L);
    const left = V - R * i;
    return explainedNumber(
      [
        `A series circuit has $L = ${L}\\text{ H}$, $R = ${R}\\ \\Omega$ and a constant voltage $${V}\\text{ V}$. At a moment when the current is $${i}\\text{ A}$, how fast is it changing, in $\\text{A/s}$? Give a negative number if it is falling.`,
        `串联电路中 $L = ${L}\\text{ H}$，$R = ${R}\\ \\Omega$，恒定电压为 $${V}\\text{ V}$。在电流为 $${i}\\text{ A}$ 的时刻，它的变化率是多少 $\\text{A/s}$？如果电流在下降，答案取负数。`,
      ],
      answer,
      [
        labelled(["Balance the voltages", "电压平衡"], "", "", `${poly([L, "i'"])} + ${R} \\cdot ${i} = ${V}`),
        labelled(
          ["Solve for the rate", "解出变化率"],
          "What the resistor does not use drives the inductor.",
          "电阻没有用掉的电压加在电感上。",
          `${poly([L, "i'"])} = ${V} - ${R * i} = ${left}, \\qquad i' = ${answer.toLatex()}`,
        ),
      ],
      [
        `The current $${i}$ A is ${left > 0 ? "below" : left < 0 ? "above" : "at"} the steady value $${Q.of(V, R).toLatex()}$ A, so a ${left > 0 ? "positive" : left < 0 ? "negative" : "zero"} rate is what we expect.`,
        `电流 $${i}$ A ${left > 0 ? "低于" : left < 0 ? "高于" : "等于"}稳态值 $${Q.of(V, R).toLatex()}$ A，所以变化率应为${left > 0 ? "正" : left < 0 ? "负" : "零"}。`,
      ],
      [
        [Q.of(V, L), "That leaves out the resistor's voltage $Ri$.", "这漏了电阻上的电压 $Ri$。"],
        [Q.of(V + R * i, L), "That adds the resistor's voltage instead of subtracting it.", "这加上了电阻上的电压，而应减去它。"],
        [
          Q.of(V - R * i, R),
          "That divides by $R$; the rate of the current is multiplied by $L$.",
          "这除以了 $R$；乘在电流变化率上的是 $L$。",
        ],
        [Q.of(V - R * i), "That forgets to divide by the inductance $L$.", "这忘了除以电感 $L$。"],
      ],
    );
  },
};

const conditionsAtLaterTime: KnowledgePointDef = {
  id: "initial-conditions-at-a-later-time",
  title: t("Initial conditions at a later time", "在较晚时刻给定的初始条件"),
  explanation: t(
    "A constant-coefficient equation does not change when time is shifted, so $e^{r(t - t_0)}$ is a solution whenever $e^{rt}$ is. When the conditions are given at $t_0$, using this form makes every exponential equal $1$ at that time. The two conditions then become a simple linear system for the constants. For $y'' - y = 0$ with $y(2) = 3$ and $y'(2) = 1$, write $y = Ae^{t - 2} + Be^{-(t - 2)}$: then $A + B = 3$ and $A - B = 1$, so $A = 2$.\n\n> **Watch out.** At $t_0$ the exponentials are $1$, but the derivative still multiplies each constant by its own root: $r_1A + r_2B = y'(t_0)$.",
    "常系数方程在时间平移下不变，所以只要 $e^{rt}$ 是解，$e^{r(t - t_0)}$ 也是解。条件在 $t_0$ 给出时，用这种形式可以使每个指数函数在该时刻都等于 $1$。两个条件于是变成关于常数的简单线性方程组。对 $y'' - y = 0$，$y(2) = 3$，$y'(2) = 1$，写成 $y = Ae^{t - 2} + Be^{-(t - 2)}$：则 $A + B = 3$，$A - B = 1$，所以 $A = 2$。\n\n> **注意。** 在 $t_0$ 处指数函数等于 $1$，但求导时每个常数仍要乘以它自己的根：$r_1A + r_2B = y'(t_0)$。",
  ),
  generate(rng) {
    const u = nonzero(rng, 5);
    const w = different(rng, -5, 5, u);
    const r1 = Math.max(u, w);
    const r2 = Math.min(u, w);
    const t0 = rng.int(1, 5);
    const p = nonzero(rng, 6);
    const v = nonzero(rng, 9);
    const answer = Q.of(v - r2 * p, r1 - r2);
    const equation = poly([1, "y''"], [-(r1 + r2), "y'"], [r1 * r2, "y"]);
    const B = Q.of(p).sub(answer);
    return explainedNumber(
      [
        `Solve $${equation} = 0$ with $y(${t0}) = ${p}$ and $y'(${t0}) = ${v}$. Let $r_1 > r_2$ be the characteristic roots, and write the solution as $y = Ae^{r_1(t - ${t0})} + Be^{r_2(t - ${t0})}$. Find $A$.`,
        `解 $${equation} = 0$，条件为 $y(${t0}) = ${p}$，$y'(${t0}) = ${v}$。设 $r_1 > r_2$ 是特征根，把解写成 $y = Ae^{r_1(t - ${t0})} + Be^{r_2(t - ${t0})}$。求 $A$。`,
      ],
      answer,
      [
        labelled(
          ["Use the shifted form", "用平移形式"],
          `The roots are $r_1 = ${r1}$ and $r_2 = ${r2}$. At $t = ${t0}$ both exponentials equal $1$, so`,
          `特征根是 $r_1 = ${r1}$，$r_2 = ${r2}$。在 $t = ${t0}$ 处两个指数函数都等于 $1$，所以`,
          `A + B = ${p}`,
          `${poly([r1, "A"], [r2, "B"])} = ${v}`,
        ),
        labelled(
          ["Eliminate B", "消去 B"],
          `Subtract $${inParens(r2)}$ times the first equation from the second:`,
          `从第二式减去第一式的 $${inParens(r2)}$ 倍：`,
          `${poly([r1 - r2, "A"])} = ${v} - ${inParens(r2)} \\cdot ${inParens(p)} = ${v - r2 * p}`,
          `A = ${answer.toLatex()}`,
        ),
      ],
      [
        `Then $B = ${p} - ${signedFactor(answer)} = ${B.toLatex()}$, and $${inParens(r1)} \\cdot ${signedFactor(answer)} + ${inParens(r2)} \\cdot ${signedFactor(B)} = ${v}$, the given slope.`,
        `于是 $B = ${p} - ${signedFactor(answer)} = ${B.toLatex()}$，且 $${inParens(r1)} \\cdot ${signedFactor(answer)} + ${inParens(r2)} \\cdot ${signedFactor(B)} = ${v}$，正是所给的斜率。`,
      ],
      [
        [Q.of(v - r1 * p, r2 - r1), "That is $B$, the coefficient of the other exponential.", "这是 $B$，即另一个指数函数的系数。"],
        [
          Q.of(v + r2 * p, r1 - r2),
          `That adds $${inParens(r2)} \\cdot y(${t0})$ instead of subtracting it.`,
          `这是加上 $${inParens(r2)} \\cdot y(${t0})$，而不是减去它。`,
        ],
        [
          Q.of(v, r1 - r2),
          `That forgets to subtract $${inParens(r2)} \\cdot ${inParens(p)}$ when eliminating $B$.`,
          `这是消去 $B$ 时忘了减去 $${inParens(r2)} \\cdot ${inParens(p)}$。`,
        ],
        [p, "That is $A + B = y(t_0)$, not $A$ alone.", "这是 $A + B = y(t_0)$，而不只是 $A$。"],
      ],
    );
  },
};

const equationFromPowers: KnowledgePointDef = {
  id: "the-equation-from-two-power-solutions",
  title: t("The equation from two power solutions", "由两个幂函数解求方程"),
  explanation: t(
    "Substituting $y = x^m$ into $x^2y'' + bxy' + cy = 0$ gives the indicial equation $m^2 + (b - 1)m + c = 0$. Knowing two solutions means knowing its two roots, and the roots fix the quadratic. Expand $(m - r)(m - s)$ and compare coefficients. For the solutions $x^2$ and $x^3$, $(m - 2)(m - 3) = m^2 - 5m + 6$, so $b - 1 = -5$, $b = -4$ and $c = 6$.\n\n> **Watch out.** The term $b - 1$ is the usual trap: $b$ itself is not minus the sum of the roots, so add $1$ back.",
    "把 $y = x^m$ 代入 $x^2y'' + bxy' + cy = 0$，得到指标方程 $m^2 + (b - 1)m + c = 0$。知道两个解就是知道它的两个根，而两个根决定了这个二次式。展开 $(m - r)(m - s)$ 并比较系数。对解 $x^2$ 与 $x^3$，$(m - 2)(m - 3) = m^2 - 5m + 6$，所以 $b - 1 = -5$，$b = -4$，$c = 6$。\n\n> **注意。** 容易出错的是 $b - 1$ 这一项：$b$ 本身并不等于两根之和的相反数，要把 $1$ 加回去。",
  ),
  generate(rng) {
    const r = nonzero(rng, 5);
    const s = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((m) => m !== r));
    const askB = rng.pick([true, false]);
    const b = 1 - r - s;
    const c = r * s;
    const answer = askB ? b : c;
    const quadratic = poly([1, "m^2"], [-(r + s), "m"], [c, ""]);
    const reasons: [number, string, string][] = askB
      ? [
          [-(r + s), "That is $b - 1$; add $1$ to get $b$.", "这是 $b - 1$；加 $1$ 才得到 $b$。"],
          [r + s, "That is the sum of the roots; the middle coefficient is minus the sum.", "这是两根之和；一次项系数是两根之和的相反数。"],
          [1 + r + s, "The sign of the sum is flipped; $b - 1$ is minus the sum.", "两根之和的符号反了；$b - 1$ 是两根之和的相反数。"],
        ]
      : [
          [-c, "The sign is flipped; the constant term is the product of the roots itself.", "符号反了；常数项就是两根之积。"],
          [r + s, "That is the sum of the roots; $c$ is their product.", "这是两根之和；$c$ 是两根之积。"],
          [c + 1, "The $1$ belongs to $b - 1$, not to $c$.", "这个 $1$ 属于 $b - 1$，不属于 $c$。"],
        ];
    const xr = power(r);
    const value = `${r} \\cdot ${inParens(r - 1)} + ${inParens(b)} \\cdot ${inParens(r)} + ${inParens(c)} = ${r * (r - 1) + b * r + c}`;
    return numberProblem({
      prompt: t(
        `The equation $x^2y'' + bxy' + cy = 0$ has the solutions $y = ${xr}$ and $y = ${power(s)}$ for $x > 0$. Find $${askB ? "b" : "c"}$.`,
        `方程 $x^2y'' + bxy' + cy = 0$ 在 $x > 0$ 上有解 $y = ${xr}$ 和 $y = ${power(s)}$。求 $${askB ? "b" : "c"}$。`,
      ),
      answer,
      form: "integer",
      solveFor: askB ? "b" : "c",
      mistakes: reasons
        .filter(([v], i) => v !== answer && reasons.findIndex(([other]) => other === v) === i)
        .map(([v, en, zh]) => why(v, en, zh)),
      solution: walked(
        [
          labelled(
            ["Build the indicial equation", "构造指标方程"],
            "The exponents are its roots:",
            "两个指数就是它的根：",
            `(${poly([1, "m"], [-r, ""])})(${poly([1, "m"], [-s, ""])}) = ${quadratic}`,
          ),
          labelled(
            ["Compare coefficients", "比较系数"],
            askB ? "The middle coefficient is $b - 1$:" : "The constant term is $c$:",
            askB ? "一次项系数是 $b - 1$：" : "常数项是 $c$：",
            askB ? `b - 1 = ${-(r + s)}, \\quad b = ${b}` : `c = ${c}`,
          ),
        ],
        t(
          `With $b = ${b}$ and $c = ${c}$, the power $m = ${r}$ gives $${value}$, so $y = ${xr}$ is a solution.`,
          `当 $b = ${b}$，$c = ${c}$ 时，幂 $m = ${r}$ 给出 $${value}$，所以 $y = ${xr}$ 是解。`,
        ),
      ),
    });
  },
};

const coefficientForRepeatedRoot: KnowledgePointDef = {
  id: "the-coefficient-that-makes-a-repeated-root",
  title: t("The coefficient that makes a repeated root", "使指标方程有重根的系数"),
  explanation: t(
    "For $ax^2y'' + pxy' + ky = 0$ the indicial equation is $am^2 + (p - a)m + k = 0$. Solutions switch from two separate powers to $x^m$ and $x^m \\ln x$ exactly when this quadratic has a repeated root. So set its discriminant to zero. For $x^2y'' - 3xy' + ky = 0$ the indicial equation is $m^2 - 4m + k = 0$, and $16 - 4k = 0$ gives $k = 4$, with the repeated root $m = 2$.\n\n> **Watch out.** The middle coefficient is $p - a$, not $p$: using $p$ gives a $k$ whose indicial equation has two different roots.",
    "对 $ax^2y'' + pxy' + ky = 0$，指标方程是 $am^2 + (p - a)m + k = 0$。当且仅当这个二次方程有重根时，解才从两个不同的幂函数变成 $x^m$ 和 $x^m \\ln x$。所以令判别式为零。对 $x^2y'' - 3xy' + ky = 0$，指标方程是 $m^2 - 4m + k = 0$，由 $16 - 4k = 0$ 得 $k = 4$，重根是 $m = 2$。\n\n> **注意。** 中间的系数是 $p - a$，而不是 $p$：用 $p$ 求出的 $k$ 会使指标方程有两个不同的根。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const R = nonzero(rng, 9);
    const p = a * (1 - 2 * R);
    const answer = a * R * R;
    const middle = p - a;
    const reasons: [number | Q, string, string][] = [
      [R * R, "That is the square of the root; the leading coefficient $a$ multiplies it.", "这是根的平方；还要乘以首项系数 $a$。"],
      [-answer, "The sign is flipped; the discriminant condition gives a positive $k$ here.", "符号反了；这里判别式条件给出正的 $k$。"],
      [Q.of(p * p, 4 * a), "That uses $p$ as the middle coefficient; it is $p - a$.", "这是把 $p$ 当成一次项系数；应当是 $p - a$。"],
      [2 * answer, "That divides by $2a$; the discriminant has $4ak$.", "这是除以 $2a$；判别式里是 $4ak$。"],
    ];
    const lead = a === 1 ? "" : `${a}`;
    const asQ = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
    return numberProblem({
      prompt: t(
        `For which value of $k$ does $${poly([a, "x^2y''"], [p, "xy'"])} + ky = 0$ have an indicial equation with a repeated root?`,
        `$k$ 取何值时，$${poly([a, "x^2y''"], [p, "xy'"])} + ky = 0$ 的指标方程有重根？`,
      ),
      answer,
      form: "integer",
      solveFor: "k",
      mistakes: reasons
        .filter(([v], i) => !asQ(v).eq(Q.of(answer)) && reasons.findIndex(([o]) => asQ(o).eq(asQ(v))) === i)
        .map(([v, en, zh]) => why(v, en, zh)),
      solution: walked(
        [
          labelled(
            ["Write the indicial equation", "写出指标方程"],
            "The middle coefficient is $p - a$:",
            "一次项系数是 $p - a$：",
            `${poly([a, "m^2"], [middle, "m"])} + k = 0`,
          ),
          labelled(
            ["Set the discriminant to zero", "令判别式为零"],
            "",
            "",
            `${inParens(middle)}^2 - 4 \\cdot ${a} \\cdot k = 0`,
            `k = \\frac{${middle * middle}}{${4 * a}} = ${answer}`,
          ),
        ],
        t(
          `$${lead}(m ${R < 0 ? "+" : "-"} ${Math.abs(R)})^2 = ${poly([a, "m^2"], [middle, "m"], [answer, ""])}$, so $m = ${R}$ is a repeated root.`,
          `$${lead}(m ${R < 0 ? "+" : "-"} ${Math.abs(R)})^2 = ${poly([a, "m^2"], [middle, "m"], [answer, ""])}$，所以 $m = ${R}$ 是重根。`,
        ),
      ),
    });
  },
};

const coefficientFromOscillatingSolution: KnowledgePointDef = {
  id: "the-coefficient-from-an-oscillating-power-solution",
  title: t("A coefficient from an oscillating power solution", "由振荡的幂函数解求系数"),
  explanation: t(
    "A solution $x^{\\alpha}\\cos(\\beta \\ln x)$ of $x^2y'' + bxy' + cy = 0$ shows that $\\alpha \\pm \\beta i$ are the roots of the indicial equation $m^2 + (b - 1)m + c = 0$. The constant term of a monic quadratic is the product of its roots. For conjugate roots that product is $\\alpha^2 + \\beta^2$. For $y = x^{2}\\cos(3\\ln x)$ the roots are $2 \\pm 3i$, so $c = 4 + 9 = 13$.\n\n> **Watch out.** $(\\alpha + \\beta i)(\\alpha - \\beta i) = \\alpha^2 + \\beta^2$, a sum of squares, because $i^2 = -1$; it is not $\\alpha^2 - \\beta^2$.",
    "如果 $x^{\\alpha}\\cos(\\beta \\ln x)$ 是 $x^2y'' + bxy' + cy = 0$ 的解，那么 $\\alpha \\pm \\beta i$ 就是指标方程 $m^2 + (b - 1)m + c = 0$ 的根。首一二次式的常数项等于两根之积。对共轭根，这个积是 $\\alpha^2 + \\beta^2$。对 $y = x^{2}\\cos(3\\ln x)$，根为 $2 \\pm 3i$，所以 $c = 4 + 9 = 13$。\n\n> **注意。** $(\\alpha + \\beta i)(\\alpha - \\beta i) = \\alpha^2 + \\beta^2$ 是平方和，因为 $i^2 = -1$；它不是 $\\alpha^2 - \\beta^2$。",
  ),
  generate(rng) {
    const alpha = rng.int(-4, 4);
    const beta = rng.int(1, 6);
    const answer = alpha * alpha + beta * beta;
    const amplitude = alpha === 0 ? "" : power(alpha);
    const wave = `\\cos(${multiple(beta, "\\ln x")})`;
    const bi = multiple(beta, "i");
    const roots = alpha === 0 ? `\\pm ${bi}` : `${alpha} \\pm ${bi}`;
    const reasons: [number, string, string][] = [
      [beta * beta, "That drops $\\alpha^2$; the power in front adds the real part.", "这漏掉了 $\\alpha^2$；前面的幂给出实部。"],
      [
        alpha * alpha - beta * beta,
        "That subtracts $\\beta^2$; since $i^2 = -1$ the product is a sum of squares.",
        "这是减去 $\\beta^2$；由于 $i^2 = -1$，积是平方和。",
      ],
      [
        beta * beta - alpha * alpha,
        "That subtracts $\\alpha^2$; the product of conjugates adds both squares.",
        "这是减去 $\\alpha^2$；共轭根之积是两个平方相加。",
      ],
      [alpha + beta, "That adds the parts; $c$ is the product of the roots.", "这是把实部与虚部相加；$c$ 是两根之积。"],
    ];
    return numberProblem({
      prompt: t(
        `The equation $x^2y'' + bxy' + cy = 0$ has the solution $y = ${amplitude}${wave}$ for $x > 0$. Find $c$.`,
        `方程 $x^2y'' + bxy' + cy = 0$ 在 $x > 0$ 上有解 $y = ${amplitude}${wave}$。求 $c$。`,
      ),
      answer,
      form: "integer",
      solveFor: "c",
      mistakes: reasons.filter(([v], i) => v !== answer && reasons.findIndex(([o]) => o === v) === i).map(([v, en, zh]) => why(v, en, zh)),
      solution: walked(
        [
          labelled(
            ["Read the roots", "读出根"],
            "The power gives the real part and the logarithm's multiple gives the imaginary part:",
            "幂给出实部，对数前的倍数给出虚部：",
            `m = ${roots}`,
          ),
          labelled(
            ["Multiply the roots", "两根相乘"],
            "The constant term is their product:",
            "常数项是它们的积：",
            `c = ${inParens(alpha)}^2 + ${beta}^2 = ${answer}`,
          ),
        ],
        t(
          `$${poly([1, "m^2"], [-2 * alpha, "m"], [answer, ""])} = ${alpha === 0 ? "m^2" : `(${poly([1, "m"], [-alpha, ""])})^2`} + ${beta * beta}$ vanishes at $m = ${roots}$.`,
          `$${poly([1, "m^2"], [-2 * alpha, "m"], [answer, ""])} = ${alpha === 0 ? "m^2" : `(${poly([1, "m"], [-alpha, ""])})^2`} + ${beta * beta}$ 在 $m = ${roots}$ 处为零。`,
        ),
      ),
    });
  },
};

const equationForMultiplier: KnowledgePointDef = {
  id: "the-equation-for-the-multiplier",
  title: t("The equation for the multiplier", "乘子满足的方程"),
  explanation: t(
    "To reduce the order of $y'' + py' + qy = 0$ with a known solution $y_1$, substitute $y = vy_1$. The terms containing $v$ itself cancel, because $y_1$ is a solution. What remains is $y_1v'' + (2y_1' + py_1)v' = 0$. For $y_1 = e^{rt}$, dividing by $y_1$ gives $v'' + (2r + p)v' = 0$. For $y'' - 5y' + 6y = 0$ with $y_1 = e^{2t}$, this is $v'' - v' = 0$, since $2 \\cdot 2 - 5 = -1$.\n\n> **Watch out.** The product rule gives $2r$, not $r$, because $y''$ contributes $2rv'$ and the $py'$ term then adds $p$ with its own sign.",
    "已知 $y'' + py' + qy = 0$ 的一个解 $y_1$，要降阶就代入 $y = vy_1$。含 $v$ 本身的项会消去，因为 $y_1$ 是解。剩下的是 $y_1v'' + (2y_1' + py_1)v' = 0$。当 $y_1 = e^{rt}$ 时，除以 $y_1$ 得 $v'' + (2r + p)v' = 0$。对 $y'' - 5y' + 6y = 0$，$y_1 = e^{2t}$，结果是 $v'' - v' = 0$，因为 $2 \\cdot 2 - 5 = -1$。\n\n> **注意。** 乘积法则给出的是 $2r$ 而不是 $r$，因为 $y''$ 贡献 $2rv'$，然后 $py'$ 项再带着自己的符号加上 $p$。",
  ),
  generate(rng) {
    const r = nonzero(rng, 6);
    const s = different(rng, -6, 6, r);
    const p = -(r + s);
    const answer = 2 * r + p;
    const equation = poly([1, "y''"], [p, "y'"], [r * s, "y"]);
    const known = exponential(r, "t");
    const reasons: [number, string, string][] = [
      [
        r + p,
        "That counts $r$ once; the product rule gives $2r$ in the coefficient of $v'$.",
        "这只算了一次 $r$；乘积法则在 $v'$ 的系数中给出 $2r$。",
      ],
      [2 * r - p, "The sign of the $y'$ coefficient is flipped; it enters as it stands.", "$y'$ 系数的符号弄反了；它应原样加进去。"],
      [-answer, "The sign is flipped; recheck the coefficient of $v'$.", "符号反了；重新检查 $v'$ 的系数。"],
      [p, "That forgets the $2r$ that comes from differentiating the product twice.", "这里忘了对乘积求两次导产生的 $2r$。"],
    ];
    return numberProblem({
      prompt: t(
        `$y_1 = ${known}$ solves $${equation} = 0$. Substituting $y = v${known}$ gives $v'' + kv' = 0$. Find $k$.`,
        `$y_1 = ${known}$ 是 $${equation} = 0$ 的解。代入 $y = v${known}$ 得 $v'' + kv' = 0$。求 $k$。`,
      ),
      answer,
      form: "integer",
      solveFor: "k",
      mistakes: reasons
        .filter(([value], i) => value !== answer && reasons.findIndex(([other]) => other === value) === i)
        .map(([value, en, zh]) => why(value, en, zh)),
      solution: walked(
        [
          labelled(
            ["Differentiate the product", "对乘积求导"],
            `With $y = v${known}$:`,
            `由 $y = v${known}$：`,
            `y' = \\left(${poly([1, "v'"], [r, "v"])}\\right)${known}`,
            `y'' = \\left(${poly([1, "v''"], [2 * r, "v'"], [r * r, "v"])}\\right)${known}`,
          ),
          labelled(
            ["Collect the v' terms", "合并 v' 项"],
            `The terms in $v$ cancel because $y_1$ is a solution. The coefficient of $v'$ is $2r$ from $y''$ plus $${inParens(p)}$ from the $y'$ term.`,
            `含 $v$ 的项相互抵消，因为 $y_1$ 是解。$v'$ 的系数是来自 $y''$ 的 $2r$，加上来自 $y'$ 项的 $${inParens(p)}$。`,
            `k = 2 \\cdot ${inParens(r)} + ${inParens(p)} = ${answer}`,
          ),
        ],
        t(
          `Then $v' = Ce^{${poly([-answer, "t"])}}$, so the new solution contains $e^{(${r} - ${inParens(answer)})t} = ${exponential(s, "t")}$, the other root's exponential.`,
          `于是 $v' = Ce^{${poly([-answer, "t"])}}$，所以新解含有 $e^{(${r} - ${inParens(answer)})t} = ${exponential(s, "t")}$，即另一个根对应的指数函数。`,
        ),
      ),
    });
  },
};

const springForResonance: KnowledgePointDef = {
  id: "the-spring-constant-for-resonance",
  title: t("The spring constant for resonance", "产生共振的弹簧常数"),
  explanation: t(
    "An undamped system $mx'' + kx = F\\cos\\omega t$ has natural frequency $\\sqrt{\\frac{k}{m}}$. It resonates when the driving frequency equals the natural one, and the response then grows without bound. Engineers avoid this by choosing the stiffness. So $k = m\\omega^2$ is the value to reach or, in practice, to stay away from. For $3x'' + kx = 5\\cos 2t$ the system resonates at $k = 3 \\cdot 4 = 12$.\n\n> **Watch out.** Square the driving frequency and multiply by the mass; the force amplitude $F$ plays no part.",
    "无阻尼系统 $mx'' + kx = F\\cos\\omega t$ 的固有频率是 $\\sqrt{\\frac{k}{m}}$。当驱动频率等于固有频率时发生共振，响应会无限增大。工程师通过选择刚度来避免这种情况。所以 $k = m\\omega^2$ 是要达到的值，或者在实践中要避开的值。对 $3x'' + kx = 5\\cos 2t$，系统在 $k = 3 \\cdot 4 = 12$ 时共振。\n\n> **注意。** 把驱动频率平方再乘以质量；力的振幅 $F$ 不起作用。",
  ),
  generate(rng) {
    const m = rng.int(2, 9);
    const w = rng.int(1, 9);
    const F = rng.int(2, 9);
    const answer = m * w * w;
    const reasons: readonly Reason[] = [
      [m * w, "That forgets to square the driving frequency.", "这里忘了把驱动频率平方。"],
      [w * w, "That leaves out the mass; $k = m\\omega^2$.", "这里漏掉了质量；$k = m\\omega^2$。"],
      [
        Q.of(w * w, m),
        "That divides by the mass; $\\frac{k}{m} = \\omega^2$ means multiplying.",
        "这是除以质量；$\\frac{k}{m} = \\omega^2$ 意味着要乘以质量。",
      ],
      [m * m * w * w, "That squares the mass as well as the frequency.", "这是把质量也平方了。"],
      [F * w * w, "That uses the force amplitude in place of the mass.", "这是用力的振幅代替了质量。"],
    ];
    const q = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
    return numberProblem({
      prompt: t(
        `For which spring constant $k$ does the undamped system $${m}x'' + kx = ${F}\\cos ${multiple(w, "t")}$ resonate?`,
        `弹簧常数 $k$ 取何值时，无阻尼系统 $${m}x'' + kx = ${F}\\cos ${multiple(w, "t")}$ 发生共振？`,
      ),
      answer,
      solveFor: "k",
      mistakes: reasons
        .filter(([v], i) => !q(v).eq(Q.of(answer)) && reasons.findIndex(([o]) => q(o).eq(q(v))) === i)
        .map(([v, en, zh]) => why(v, en, zh)),
      solution: walked(
        [
          labelled(
            ["Match the frequencies", "使频率相等"],
            "Resonance needs the natural frequency to equal the driving one:",
            "共振要求固有频率等于驱动频率：",
            `\\sqrt{\\frac{k}{${m}}} = ${w}`,
          ),
          labelled(["Square", "平方"], "", "", `k = ${m} \\cdot ${w}^2 = ${answer}`),
        ],
        t(
          `$\\sqrt{\\frac{${answer}}{${m}}} = \\sqrt{${w * w}} = ${w}$; the force amplitude $${F}$ plays no part.`,
          `$\\sqrt{\\frac{${answer}}{${m}}} = \\sqrt{${w * w}} = ${w}$；力的振幅 $${F}$ 不起作用。`,
        ),
      ),
    });
  },
};

const capacitanceForResonance: KnowledgePointDef = {
  id: "the-capacitance-for-electrical-resonance",
  title: t("The capacitance for electrical resonance", "产生电共振的电容"),
  explanation: t(
    "The steady-state current in a series circuit has amplitude $\\frac{V}{\\sqrt{R^2 + \\left(L\\omega - \\frac{1}{C\\omega}\\right)^2}}$. The resistance cannot be removed, but the second term in the root can. The amplitude is largest when $L\\omega = \\frac{1}{C\\omega}$, which is how a radio tunes to a station by adjusting its capacitor. For $L = 2$ H at $\\omega = 5$, $C = \\frac{1}{2 \\cdot 25} = \\frac{1}{50}$ F.\n\n> **Watch out.** Solving $L\\omega = \\frac{1}{C\\omega}$ gives $C = \\frac{1}{L\\omega^2}$: the frequency is squared, and $C$ is a reciprocal, not $L\\omega^2$ itself. The resistance and the voltage do not affect it.",
    "串联电路的稳态电流振幅是 $\\frac{V}{\\sqrt{R^2 + \\left(L\\omega - \\frac{1}{C\\omega}\\right)^2}}$。电阻无法消除，但根号中的第二项可以。当 $L\\omega = \\frac{1}{C\\omega}$ 时振幅最大，收音机正是这样通过调节电容来选台的。对 $L = 2$ H，$\\omega = 5$，$C = \\frac{1}{2 \\cdot 25} = \\frac{1}{50}$ F。\n\n> **注意。** 由 $L\\omega = \\frac{1}{C\\omega}$ 解得 $C = \\frac{1}{L\\omega^2}$：频率要平方，而且 $C$ 是倒数，不是 $L\\omega^2$ 本身。电阻和电压都不影响它。",
  ),
  generate(rng) {
    const L = rng.int(1, 8);
    const w = rng.int(2, 12);
    const R = rng.int(1, 20);
    const V = 10 * rng.int(1, 9);
    const answer = Q.of(1, L * w * w);
    return explainedNumber(
      [
        `A series circuit has $R = ${R}\\ \\Omega$ and $L = ${L}\\text{ H}$, and is driven by $E(t) = ${V}\\sin ${w}t\\text{ V}$. Which capacitance, in farads, makes the steady-state current amplitude as large as possible?`,
        `串联电路中 $R = ${R}\\ \\Omega$，$L = ${L}\\text{ H}$，由 $E(t) = ${V}\\sin ${w}t\\text{ V}$ 驱动。电容取多少法拉时，稳态电流的振幅最大？`,
      ],
      answer,
      [
        labelled(
          ["Cancel the reactance", "消去电抗"],
          "The amplitude is largest when the second term under the root vanishes:",
          "根号下第二项为零时振幅最大：",
          `${L === 1 ? "" : `${L} \\cdot `}${w} = \\frac{1}{${w}C}`,
        ),
        labelled(["Solve for C", "解出 C"], "", "", `C = \\frac{1}{${L} \\cdot ${w}^2} = ${answer.toLatex()}`),
      ],
      [
        `With $C = ${answer.toLatex()}$, $\\frac{1}{${w}C} = \\frac{${L * w * w}}{${w}} = ${L * w} = L\\omega$, so the current amplitude is $\\frac{V}{R} = ${Q.of(V, R).toLatex()}$.`,
        `取 $C = ${answer.toLatex()}$，$\\frac{1}{${w}C} = \\frac{${L * w * w}}{${w}} = ${L * w} = L\\omega$，所以电流振幅为 $\\frac{V}{R} = ${Q.of(V, R).toLatex()}$。`,
      ],
      [
        [Q.of(1, L * w), "That forgets to square the frequency.", "这里忘了把频率平方。"],
        [Q.of(1, w * w), "That leaves out the inductance.", "这里漏掉了电感。"],
        [L * w * w, "That is $L\\omega^2$, the reciprocal of the capacitance.", "这是 $L\\omega^2$，即电容的倒数。"],
        [Q.of(1, L * L * w * w), "That squares the inductance as well.", "这是把电感也平方了。"],
      ],
    );
  },
};

const shiftedTransformAtPoint: KnowledgePointDef = {
  id: "a-shifted-transform-at-a-point",
  title: t("A shifted transform at a point", "平移后的变换在一点的值"),
  explanation: t(
    "The first shifting theorem says $\\mathcal{L}\\{e^{at}f(t)\\}(s) = F(s - a)$. So the transform of the product at $s$ is the transform of $f$ at the shifted point $s - a$. To evaluate it, subtract $a$ first and only then use the formula for $F$. Applying the formula at $s$ itself is the common mistake.\n\n> **Watch out.** The shift is $s - a$, so a factor $e^{-2t}$ moves the point to $s + 2$. For $\\mathcal{L}\\{e^{-2t}\\cos t\\}$ at $s = 1$, evaluate $\\frac{s}{s^{2} + 1}$ at $3$ to get $\\frac{3}{10}$, not at $-1$.",
    "第一平移定理说 $\\mathcal{L}\\{e^{at}f(t)\\}(s) = F(s - a)$。所以乘积在 $s$ 处的变换，就是 $f$ 的变换在平移后的点 $s - a$ 处的值。计算时先减去 $a$，再用 $F$ 的公式。直接在 $s$ 处套用公式是常见的错误。\n\n> **注意。** 平移是 $s - a$，所以因子 $e^{-2t}$ 把点移到 $s + 2$。求 $\\mathcal{L}\\{e^{-2t}\\cos t\\}$ 在 $s = 1$ 处的值时，要在 $3$ 处计算 $\\frac{s}{s^{2} + 1}$，得 $\\frac{3}{10}$，而不是在 $-1$ 处。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const b = rng.int(1, 6);
    const d = rng.int(1, 6);
    const s = a + d;
    const answer = Q.of(d, d * d + b * b);
    return explainedNumber(
      [
        `Find $\\mathcal{L}\\{${exponential(a, "t")}\\cos ${multiple(b, "t")}\\}$ at $s = ${s}$.`,
        `求 $\\mathcal{L}\\{${exponential(a, "t")}\\cos ${multiple(b, "t")}\\}$ 在 $s = ${s}$ 处的值。`,
      ],
      answer,
      [
        labelled(
          ["Find the shifted point", "求平移后的点"],
          `The transform of the cosine is $F(s) = \\frac{s}{s^2 + ${b * b}}$, and the factor $${exponential(a, "t")}$ shifts it by $${a}$:`,
          `余弦的变换是 $F(s) = \\frac{s}{s^2 + ${b * b}}$，因子 $${exponential(a, "t")}$ 使它平移 $${a}$：`,
          `s - ${inParens(a)} = ${s} - ${inParens(a)} = ${d}`,
        ),
        labelled(["Evaluate F there", "在该点计算 F"], "", "", `F(${d}) = \\frac{${d}}{${d * d} + ${b * b}} = ${answer.toLatex()}`),
      ],
      [
        `In the defining integral at $s = ${s}$ the two exponentials combine into $e^{-(${s} - ${inParens(a)})t} = ${exponential(-d, "t")}$, which is the kernel of the cosine transform at $${d}$.`,
        `在 $s = ${s}$ 处的定义积分中，两个指数合并为 $e^{-(${s} - ${inParens(a)})t} = ${exponential(-d, "t")}$，正是余弦变换在 $${d}$ 处的积分核。`,
      ],
      [
        [
          Q.of(s, s * s + b * b),
          `That evaluates $F$ at $${s}$ itself; the factor $${exponential(a, "t")}$ moves the point first.`,
          `这是在 $${s}$ 处直接计算 $F$；因子 $${exponential(a, "t")}$ 要先移动这个点。`,
        ],
        [
          Q.of(b, d * d + b * b),
          "That uses the sine transform, with $b$ on top; the cosine has $s$ on top.",
          "这用了正弦的变换，分子是 $b$；余弦的分子是 $s$。",
        ],
        [
          Q.of(s + a, (s + a) * (s + a) + b * b),
          `That shifts the wrong way, to $s + ${inParens(a)}$; the theorem gives $F(s - a)$.`,
          `这向反方向平移到了 $s + ${inParens(a)}$；定理给出的是 $F(s - a)$。`,
        ],
      ],
    );
  },
};

const stepOnUnshiftedFunction: KnowledgePointDef = {
  id: "a-step-on-an-unshifted-function",
  title: t("A step on an unshifted function", "阶跃函数乘未平移的函数"),
  explanation: t(
    "The second shifting theorem transforms $g(t - a)u(t - a)$, so the function must be written in powers of $t - a$ first. A function such as $pt + q$ is not yet in that form. Rewrite it as $p(t - a) + (pa + q)$. Then the transform of $(pt + q)u(t - a)$ is $e^{-as}\\left(\\frac{p}{s^2} + \\frac{pa + q}{s}\\right)$.\n\n> **Watch out.** The constant is the value of the function at the switch-on time, not its old constant term. For $(2t + 1)u(t - 3)$, write $2t + 1 = 2(t - 3) + 7$, so the coefficient of $\\frac{1}{s}$ is $7$, not $1$.",
    "第二平移定理变换的是 $g(t - a)u(t - a)$，所以必须先把函数写成 $t - a$ 的幂。像 $pt + q$ 这样的函数还不是这种形式。把它改写成 $p(t - a) + (pa + q)$。于是 $(pt + q)u(t - a)$ 的变换是 $e^{-as}\\left(\\frac{p}{s^2} + \\frac{pa + q}{s}\\right)$。\n\n> **注意。** 新的常数是函数在接通时刻的值，而不是原来的常数项。对 $(2t + 1)u(t - 3)$，写成 $2t + 1 = 2(t - 3) + 7$，所以 $\\frac{1}{s}$ 的系数是 $7$，不是 $1$。",
  ),
  generate(rng) {
    const p = nonzero(rng, 6);
    const a = rng.int(1, 6);
    const q = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((n) => n !== -p * a));
    const answer = p * a + q;
    const g = poly([p, "t"], [q, ""]);
    return explainedNumber(
      [
        `$\\mathcal{L}\\{(${g})u(t - ${a})\\} = e^{-${multiple(a, "s")}}\\left(\\frac{A}{s^2} + \\frac{B}{s}\\right)$. Find $B$.`,
        `$\\mathcal{L}\\{(${g})u(t - ${a})\\} = e^{-${multiple(a, "s")}}\\left(\\frac{A}{s^2} + \\frac{B}{s}\\right)$。求 $B$。`,
      ],
      answer,
      [
        labelled(
          ["Rewrite in powers of t - a", "写成 t - a 的幂"],
          `Put $t = (t - ${a}) + ${a}$:`,
          `令 $t = (t - ${a}) + ${a}$：`,
          `${g} = ${poly([p, `(t - ${a})`])} + ${inParens(p)} \\cdot ${a} ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${poly([p, `(t - ${a})`], [answer, ""])}`,
        ),
        labelled(
          ["Apply the second shifting theorem", "应用第二平移定理"],
          "",
          "",
          `\\mathcal{L}\\{(${g})u(t - ${a})\\} = e^{-${multiple(a, "s")}}\\left(${p < 0 ? "-" : ""}\\frac{${Math.abs(p)}}{s^2} ${answer < 0 ? "-" : "+"} \\frac{${Math.abs(answer)}}{s}\\right)`,
          `B = ${answer}`,
        ),
      ],
      [
        `$B$ is the value of the function when the step switches on: at $t = ${a}$, $${g} = ${answer}$.`,
        `$B$ 是阶跃接通时函数的值：在 $t = ${a}$ 处，$${g} = ${answer}$。`,
      ],
      [
        [
          q,
          "That keeps the old constant term; rewriting in powers of $t - a$ changes it.",
          "这保留了原来的常数项；改写成 $t - a$ 的幂会改变它。",
        ],
        [
          q - p * a,
          `That subtracts $${inParens(p)} \\cdot ${a}$; putting $t = (t - ${a}) + ${a}$ adds it.`,
          `这减去了 $${inParens(p)} \\cdot ${a}$；令 $t = (t - ${a}) + ${a}$ 应当加上它。`,
        ],
        [p, "That is $A$, the coefficient of $\\frac{1}{s^2}$.", "这是 $\\frac{1}{s^2}$ 的系数 $A$。"],
        [p * a, "That leaves out the constant term of the function.", "这漏掉了函数的常数项。"],
      ],
      "integer",
    );
  },
};

const integralOfSteps: KnowledgePointDef = {
  id: "integrating-a-sum-of-steps",
  figure: differentialEquationsDrawings1["the-unit-step-function#integrating-a-sum-of-steps"],
  title: t("Integrating a sum of steps", "对阶跃函数之和积分"),
  explanation: t(
    "The function $u(t - c)$ is $0$ before $t = c$ and $1$ after it. Over the interval from $0$ to $T$ it therefore encloses the area of a rectangle of width $T - c$. A combination of steps adds these rectangles, each scaled by its coefficient, and a negative coefficient subtracts its area.\n\n> **Watch out.** The width is $T - c$, the time the step is on, not $c$. For $\\int_0^{5} 2u(t - 1)\\,dt$ the rectangle has width $4$ and area $8$, not $2 \\cdot 1 = 2$.",
    "函数 $u(t - c)$ 在 $t = c$ 之前为 $0$，之后为 $1$。所以在 $0$ 到 $T$ 上，它围成一个宽为 $T - c$ 的矩形。阶跃函数的线性组合就是把这些矩形相加，每个矩形乘以自己的系数，负系数表示减去相应的面积。\n\n> **注意。** 宽度是阶跃接通的时间 $T - c$，不是 $c$。对 $\\int_0^{5} 2u(t - 1)\\,dt$，矩形宽 $4$，面积 $8$，不是 $2 \\cdot 1 = 2$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const b = nonzero(rng, 9);
    const p = rng.int(1, 4);
    const q = rng.int(p + 1, 7);
    const T = rng.int(q + 1, 12);
    const answer = a * (T - p) + b * (T - q);
    const f = poly([a, `u(t - ${p})`], [b, `u(t - ${q})`]);
    return explainedNumber(
      [`Evaluate $\\int_0^{${T}} \\big(${f}\\big)\\,dt$.`, `计算 $\\int_0^{${T}} \\big(${f}\\big)\\,dt$。`],
      answer,
      [
        labelled(
          ["Measure each rectangle", "量出每个矩形"],
          `$u(t - ${p})$ is on from $${p}$ to $${T}$ and $u(t - ${q})$ from $${q}$ to $${T}$:`,
          `$u(t - ${p})$ 从 $${p}$ 到 $${T}$ 接通，$u(t - ${q})$ 从 $${q}$ 到 $${T}$ 接通：`,
          `\\int_0^{${T}} u(t - ${p})\\,dt = ${T - p}, \\qquad \\int_0^{${T}} u(t - ${q})\\,dt = ${T - q}`,
        ),
        labelled(
          ["Add with the coefficients", "乘系数后相加"],
          "",
          "",
          `${a} \\cdot ${T - p} + ${inParens(b)} \\cdot ${T - q} = ${answer}`,
        ),
      ],
      [
        `Piece by piece: the function is $${a}$ on $(${p}, ${q})$ and $${a + b}$ on $(${q}, ${T})$, so the area is $${a} \\cdot ${q - p} + ${inParens(a + b)} \\cdot ${T - q} = ${answer}$.`,
        `分段计算：函数在 $(${p}, ${q})$ 上为 $${a}$，在 $(${q}, ${T})$ 上为 $${a + b}$，所以面积为 $${a} \\cdot ${q - p} + ${inParens(a + b)} \\cdot ${T - q} = ${answer}$。`,
      ],
      [
        [
          a * T + b * T,
          "That integrates each step over the whole interval; each is zero until it switches on.",
          "这把每个阶跃都在整个区间上积分；每个阶跃在接通之前都是零。",
        ],
        [
          a * p + b * q,
          "That uses the switch-on times as the widths; the widths are the times from the switch-on to the end.",
          "这把接通时刻当成了宽度；宽度是从接通到终点的时间。",
        ],
        [a * (T - p), "That leaves out the second step.", "这漏掉了第二个阶跃。"],
        [
          a * (T - p) - b * (T - q),
          "That subtracts the second rectangle; its coefficient already carries its sign.",
          "这减去了第二个矩形；它的系数本身已经带着符号。",
        ],
      ],
      "integer",
    );
  },
};

const inverseDividedByS: KnowledgePointDef = {
  id: "inverting-a-transform-divided-by-s",
  title: t("Inverting a transform divided by s", "求除以 s 后的变换的逆"),
  explanation: t(
    "Dividing a transform by $s$ corresponds to integrating the function: $\\mathcal{L}^{-1}\\left\\{\\frac{F(s)}{s}\\right\\} = \\int_0^t f(\\tau)\\,d\\tau$. This often replaces partial fractions. To invert $\\frac{c}{s(s + a)}$, recognize $\\frac{c}{s + a}$ as the transform of $ce^{-at}$ and integrate that from $0$ to $t$.\n\n> **Watch out.** Integrating $e^{-at}$ divides by $a$; it does not multiply. For $\\frac{6}{s(s + 3)}$, $\\int_0^t 6e^{-3\\tau}\\,d\\tau = 2\\left(1 - e^{-3t}\\right)$, not $18\\left(1 - e^{-3t}\\right)$.",
    "把变换除以 $s$ 相当于对函数积分：$\\mathcal{L}^{-1}\\left\\{\\frac{F(s)}{s}\\right\\} = \\int_0^t f(\\tau)\\,d\\tau$。这常常可以代替部分分式。要求 $\\frac{c}{s(s + a)}$ 的逆变换，先认出 $\\frac{c}{s + a}$ 是 $ce^{-at}$ 的变换，再把它从 $0$ 积分到 $t$。\n\n> **注意。** 对 $e^{-at}$ 积分要除以 $a$，而不是乘以 $a$。对 $\\frac{6}{s(s + 3)}$，$\\int_0^t 6e^{-3\\tau}\\,d\\tau = 2\\left(1 - e^{-3t}\\right)$，不是 $18\\left(1 - e^{-3t}\\right)$。",
  ),
  generate(rng) {
    const c = rng.int(1, 12);
    const a = rng.int(2, 9);
    const answer = Q.of(c, a);
    const decay = exponential(-a, "t");
    const decayTau = exponential(-a, "\\tau");
    const den = answer.d === 1n ? "" : `${answer.d}`;
    const split = `\\frac{${answer.n}}{${den}s} - \\frac{${answer.n}}{${den === "" ? `s + ${a}` : `${den}(s + ${a})`}}`;
    return explainedNumber(
      [
        `$\\mathcal{L}^{-1}\\left\\{\\frac{${c}}{s(s + ${a})}\\right\\} = K\\left(1 - ${decay}\\right)$. Find $K$.`,
        `$\\mathcal{L}^{-1}\\left\\{\\frac{${c}}{s(s + ${a})}\\right\\} = K\\left(1 - ${decay}\\right)$。求 $K$。`,
      ],
      answer,
      [
        labelled(
          ["Invert without the factor s", "先不看因子 s 求逆"],
          "",
          "",
          `\\mathcal{L}^{-1}\\left\\{\\frac{${c}}{s + ${a}}\\right\\} = ${poly([c, decay])}`,
        ),
        labelled(
          ["Integrate from 0 to t", "从 0 积分到 t"],
          "Dividing by $s$ integrates the function:",
          "除以 $s$ 就是对函数积分：",
          `\\int_0^t ${poly([c, decayTau])}\\,d\\tau = ${answer.toLatex()}\\left(1 - ${decay}\\right)`,
          `K = ${answer.toLatex()}`,
        ),
      ],
      [
        `Partial fractions agree: $\\frac{${c}}{s(s + ${a})} = ${split}$, which inverts to $${poly([answer, ""], [answer.neg(), decay])}$.`,
        `部分分式也一致：$\\frac{${c}}{s(s + ${a})} = ${split}$，逆变换为 $${poly([answer, ""], [answer.neg(), decay])}$。`,
      ],
      [
        [c, `That leaves out the division by $${a}$ that integrating $${decay}$ brings.`, `这漏掉了对 $${decay}$ 积分带来的除以 $${a}$。`],
        [
          Q.of(a, c),
          `That divides $${a}$ by $${c}$; integrating divides $${c}$ by $${a}$.`,
          `这用 $${a}$ 除以 $${c}$；积分是用 $${c}$ 除以 $${a}$。`,
        ],
        [
          Q.of(-c, a),
          `The sign is flipped; the integral of a positive function from $0$ to $t$ is positive.`,
          "符号反了；正函数从 $0$ 到 $t$ 的积分是正的。",
        ],
        [c * a, `That multiplies by $${a}$; integrating $${decay}$ divides by it.`, `这乘以了 $${a}$；对 $${decay}$ 积分要除以它。`],
      ],
    );
  },
};

const periodicPulseTrain: KnowledgePointDef = {
  id: "the-transform-of-a-periodic-pulse-train",
  title: t("The transform of a periodic pulse train", "周期脉冲序列的变换"),
  explanation: t(
    "A function of period $P$ has transform $F(s) = \\frac{1}{1 - e^{-Ps}}\\int_0^P e^{-st}f(t)\\,dt$, because the later periods repeat the first one with growing delays. As $s \\to 0^+$, the first factor behaves like $\\frac{1}{Ps}$ and the integral tends to $\\int_0^P f$. So $sF(s)$ tends to the average of $f$ over a period.\n\n> **Watch out.** The limit is the average over the whole period, so divide the area of one pulse by the period, not by the width of the pulse. A pulse of height $4$ for $1$ unit in every $4$ has average $1$, not $4$.",
    "周期为 $P$ 的函数的变换是 $F(s) = \\frac{1}{1 - e^{-Ps}}\\int_0^P e^{-st}f(t)\\,dt$，因为后面的周期只是第一个周期的延迟重复。当 $s \\to 0^+$ 时，第一个因子接近 $\\frac{1}{Ps}$，积分趋于 $\\int_0^P f$。所以 $sF(s)$ 趋于 $f$ 在一个周期上的平均值。\n\n> **注意。** 极限是整个周期上的平均值，所以要用一个脉冲的面积除以周期，而不是除以脉冲的宽度。每 $4$ 个单位中有 $1$ 个单位高度为 $4$ 的脉冲，平均值是 $1$，不是 $4$。",
  ),
  generate(rng) {
    const P = rng.int(2, 12);
    const d = rng.int(1, P - 1);
    const h = rng.int(2, 12);
    const answer = Q.of(h * d, P);
    const ds = exponential(-d, "s");
    const Ps = exponential(-P, "s");
    return explainedNumber(
      [
        `$f$ has period $${P}$, with $f(t) = ${h}$ for $0 \\le t < ${d}$ and $f(t) = 0$ for $${d} \\le t < ${P}$. Its transform is $F(s)$. Find $\\lim_{s \\to 0^+} sF(s)$.`,
        `$f$ 的周期为 $${P}$，当 $0 \\le t < ${d}$ 时 $f(t) = ${h}$，当 $${d} \\le t < ${P}$ 时 $f(t) = 0$。它的变换是 $F(s)$。求 $\\lim_{s \\to 0^+} sF(s)$。`,
      ],
      answer,
      [
        labelled(
          ["Use the period formula", "用周期公式"],
          "Only the first pulse is integrated:",
          "只需对第一个脉冲积分：",
          `\\int_0^${d < 10 ? d : `{${d}}`} ${h}e^{-st}\\,dt = \\frac{${h}\\left(1 - ${ds}\\right)}{s}, \\qquad sF(s) = \\frac{${h}\\left(1 - ${ds}\\right)}{1 - ${Ps}}`,
        ),
        labelled(
          ["Let s tend to 0", "令 s 趋于 0"],
          `For small $s$, $1 - ${ds} \\approx ${multiple(d, "s")}$ and $1 - ${Ps} \\approx ${P}s$:`,
          `$s$ 很小时，$1 - ${ds} \\approx ${multiple(d, "s")}$，$1 - ${Ps} \\approx ${P}s$：`,
          `\\lim_{s \\to 0^+} sF(s) = \\frac{${h} \\cdot ${d}}{${P}}${lowestTerms(h * d, P)}`,
        ),
      ],
      [
        `This is the average of $f$: one period has area $${h} \\cdot ${d} = ${h * d}$ spread over length $${P}$.`,
        `这正是 $f$ 的平均值：一个周期的面积 $${h} \\cdot ${d} = ${h * d}$ 分布在长度 $${P}$ 上。`,
      ],
      [
        [
          h * d,
          `That is the area of one pulse; the limit spreads it over the period $${P}$.`,
          `这是一个脉冲的面积；极限要把它分摊到周期 $${P}$ 上。`,
        ],
        [Q.of(h, P), `That leaves out the width $${d}$ of the pulse.`, `这漏掉了脉冲的宽度 $${d}$。`],
        [
          Q.of(h * (P - d), P),
          `That uses the time the pulse is off, $${P - d}$, in place of the time it is on.`,
          `这用了脉冲关断的时间 $${P - d}$，应当用接通的时间。`,
        ],
        [
          h,
          "That is the height of the pulse, which is the average only if the pulse never switches off.",
          "这是脉冲的高度；只有脉冲从不关断时它才是平均值。",
        ],
      ],
    );
  },
};

const halfPeriodShift: KnowledgePointDef = {
  id: "the-series-of-a-half-period-shift",
  title: t("The series of a half-period shift", "平移半个周期后的级数"),
  explanation: t(
    "Moving a $2\\pi$-periodic function by half its period changes its Fourier series in a simple way. Since $\\cos n(x + \\pi) = (-1)^n\\cos nx$ and $\\sin n(x + \\pi) = (-1)^n\\sin nx$, each coefficient keeps its size. Even harmonics stay the same and odd harmonics change sign, so no integral has to be computed again.\n\n> **Watch out.** The shift changes signs, not which list a coefficient comes from: the coefficient of $\\cos kx$ still comes from $a_k$, never from $b_k$. For $a_n = \\frac{6}{n}$, the shifted coefficient of $\\cos 3x$ is $-2$ and that of $\\cos 2x$ is $3$.",
    "把周期为 $2\\pi$ 的函数平移半个周期，它的傅里叶级数变化很简单。因为 $\\cos n(x + \\pi) = (-1)^n\\cos nx$，$\\sin n(x + \\pi) = (-1)^n\\sin nx$，每个系数的大小不变。偶次谐波不变，奇次谐波变号，所以不需要重新计算积分。\n\n> **注意。** 平移只改变符号，不改变系数来自哪一组：$\\cos kx$ 的系数仍来自 $a_k$，而不是 $b_k$。对 $a_n = \\frac{6}{n}$，平移后 $\\cos 3x$ 的系数是 $-2$，$\\cos 2x$ 的系数是 $3$。",
  ),
  generate(rng) {
    const c = rng.int(1, 12);
    const e = different(rng, 1, 9, c);
    const k = rng.int(2, 7);
    const sign = k % 2 === 0 ? 1 : -1;
    const answer = Q.of(sign * c, k);
    const minus = sign === 1 ? "" : "-";
    return explainedNumber(
      [
        `A $2\\pi$-periodic function $f$ has Fourier coefficients $a_n = \\frac{${c}}{n}$ and $b_n = \\frac{${e}}{n}$. Let $g(x) = f(x + \\pi)$. Find the coefficient of $\\cos ${k}x$ in the Fourier series of $g$.`,
        `周期为 $2\\pi$ 的函数 $f$ 的傅里叶系数是 $a_n = \\frac{${c}}{n}$，$b_n = \\frac{${e}}{n}$。设 $g(x) = f(x + \\pi)$。求 $g$ 的傅里叶级数中 $\\cos ${k}x$ 的系数。`,
      ],
      answer,
      [
        labelled(["Shift the cosine", "平移余弦"], "", "", `\\cos ${k}(x + \\pi) = \\cos(${k}x + ${k}\\pi) = ${minus}\\cos ${k}x`),
        labelled(
          ["Read off the coefficient", "读出系数"],
          `Only $a_{${k}}\\cos ${k}x$ feeds this term; the sine terms stay sines:`,
          `只有 $a_{${k}}\\cos ${k}x$ 贡献这一项；正弦项仍是正弦：`,
          `${minus}a_{${k}} = ${minus}\\frac{${c}}{${k}} = ${answer.toLatex()}`,
        ),
      ],
      [
        `$${k}$ is ${sign === 1 ? "even" : "odd"}, so $\\cos ${k}\\pi = ${sign}$; the size $${Q.of(c, k).toLatex()}$ of $a_{${k}}$ is unchanged.`,
        `$${k}$ 是${sign === 1 ? "偶数" : "奇数"}，所以 $\\cos ${k}\\pi = ${sign}$；$a_{${k}}$ 的大小 $${Q.of(c, k).toLatex()}$ 不变。`,
      ],
      [
        [
          answer.neg(),
          `That has the wrong sign: $\\cos ${k}\\pi = ${sign}$, so ${sign === 1 ? "an even harmonic keeps its sign" : "an odd harmonic changes sign"}.`,
          `符号错了：$\\cos ${k}\\pi = ${sign}$，所以${sign === 1 ? "偶次谐波保持符号" : "奇次谐波变号"}。`,
        ],
        [
          Q.of(sign * e, k),
          "That takes the sine coefficient $b_k$; the shift does not turn sines into cosines.",
          "这用了正弦系数 $b_k$；平移不会把正弦变成余弦。",
        ],
        [
          Q.of(e, k),
          "That takes $b_k$ and also misses the sign change; the cosine term comes from $a_k$.",
          "这用了 $b_k$，还漏了符号变化；余弦项来自 $a_k$。",
        ],
      ],
    );
  },
};

const sineSeriesOfLinear: KnowledgePointDef = {
  id: "the-sine-series-of-a-linear-function",
  title: t("The sine series of a linear function", "线性函数的正弦级数"),
  explanation: t(
    "The sine coefficients on $(0, \\pi)$ are $b_n = \\frac{2}{\\pi}\\int_0^\\pi f(x)\\sin nx\\,dx$. For $f(x) = x$, integration by parts gives $\\int_0^\\pi x\\sin nx\\,dx = -\\frac{\\pi\\cos n\\pi}{n}$. Since $\\cos n\\pi = (-1)^n$, the result is $b_n = \\frac{2(-1)^{n+1}}{n}$. The signs alternate, and a constant multiple of $x$ scales every coefficient.\n\n> **Watch out.** The signs start with $+$: $b_1 > 0$ for $f = x$, because $\\cos \\pi = -1$ cancels the minus in front. And the $\\frac{2}{\\pi}$ cancels the $\\pi$ of the integral, leaving a factor $2$. For $f = 3x$, $b_1 = 6$ and $b_2 = -3$.",
    "$(0, \\pi)$ 上的正弦系数是 $b_n = \\frac{2}{\\pi}\\int_0^\\pi f(x)\\sin nx\\,dx$。对 $f(x) = x$，分部积分得 $\\int_0^\\pi x\\sin nx\\,dx = -\\frac{\\pi\\cos n\\pi}{n}$。因为 $\\cos n\\pi = (-1)^n$，结果是 $b_n = \\frac{2(-1)^{n+1}}{n}$。符号交替出现，$x$ 乘以常数时每个系数也乘以同一个常数。\n\n> **注意。** 符号从 $+$ 开始：对 $f = x$ 有 $b_1 > 0$，因为 $\\cos \\pi = -1$ 抵消了前面的负号。而 $\\frac{2}{\\pi}$ 与积分中的 $\\pi$ 约掉，留下因子 $2$。对 $f = 3x$，$b_1 = 6$，$b_2 = -3$。",
  ),
  generate(rng) {
    const c = nonzero(rng, 9);
    const n = rng.int(1, 8);
    const sign = n % 2 === 1 ? 1 : -1;
    const answer = Q.of(2 * c * sign, n);
    const sine = `\\sin ${n === 1 ? "" : n}x`;
    const integral = `${sign < 0 ? "-" : ""}${n === 1 ? "\\pi" : `\\frac{\\pi}{${n}}`}`;
    return explainedNumber(
      [
        `The Fourier sine series of $f(x) = ${poly([c, "x"])}$ on $(0, \\pi)$ has coefficients $b_n$. Find $b_{${n}}$.`,
        `$f(x) = ${poly([c, "x"])}$ 在 $(0, \\pi)$ 上的傅里叶正弦级数的系数为 $b_n$。求 $b_{${n}}$。`,
      ],
      answer,
      [
        labelled(
          ["Integrate by parts", "分部积分"],
          "",
          "",
          `\\int_{0}^{\\pi} x\\sin nx\\,dx = \\left[-\\frac{x\\cos nx}{n}\\right]_{0}^{\\pi} + \\frac{1}{n}\\int_{0}^{\\pi}\\cos nx\\,dx = -\\frac{\\pi\\cos n\\pi}{n}`,
        ),
        labelled(
          [`Put in n = ${n}`, `代入 n = ${n}`],
          `Here $\\cos ${n}\\pi = ${-sign}$:`,
          `这里 $\\cos ${n}\\pi = ${-sign}$：`,
          `\\int_{0}^{\\pi} x${sine}\\,dx = ${integral}, \\qquad b_{${n}} = \\frac{2}{\\pi} \\cdot ${inParens(c)} \\cdot ${sign < 0 ? `\\left(${integral}\\right)` : integral} = ${answer.toLatex()}`,
        ),
      ],
      [
        `The rule $b_n = \\frac{2c(-1)^{n+1}}{n}$ with $c = ${c}$ and $n = ${n}$ gives $2 \\cdot ${inParens(c)} \\cdot ${inParens(sign)} \\div ${n} = ${answer.toLatex()}$.`,
        `由 $b_n = \\frac{2c(-1)^{n+1}}{n}$，$c = ${c}$，$n = ${n}$，得 $2 \\cdot ${inParens(c)} \\cdot ${inParens(sign)} \\div ${n} = ${answer.toLatex()}$。`,
      ],
      [
        [
          answer.neg(),
          `That has the wrong sign: $(-1)^{n+1}$ is $${sign}$ for $n = ${n}$.`,
          `符号错了：$n = ${n}$ 时 $(-1)^{n+1}$ 是 $${sign}$。`,
        ],
        [
          Q.of(c * sign, n),
          "That drops the factor $2$ of $\\frac{2}{\\pi}$ in front of the integral.",
          "这漏掉了积分前 $\\frac{2}{\\pi}$ 中的因子 $2$。",
        ],
        [
          Q.of(2 * c, n * n),
          "That divides by $n$ twice and loses the sign; the boundary term carries a single $\\frac{1}{n}$.",
          "这除了两次 $n$，还丢了符号；边界项只带一个 $\\frac{1}{n}$。",
        ],
        [
          Q.of(4 * c * sign, n),
          "That uses $\\frac{4}{\\pi}$, the factor for a constant on odd $n$; the factor here is $\\frac{2}{\\pi}$.",
          "这用了 $\\frac{4}{\\pi}$，那是常数在 $n$ 为奇数时的因子；这里的因子是 $\\frac{2}{\\pi}$。",
        ],
      ],
    );
  },
};

const cosineSeriesOfQuadratic: KnowledgePointDef = {
  id: "the-cosine-series-of-a-quadratic-function",
  title: t("The cosine series of a quadratic function", "二次函数的余弦级数"),
  explanation: t(
    "The cosine coefficients on $(0, \\pi)$ are $a_n = \\frac{2}{\\pi}\\int_0^\\pi f(x)\\cos nx\\,dx$. For $f(x) = x^2$, integrating by parts twice gives $\\int_0^\\pi x^2\\cos nx\\,dx = \\frac{2\\pi(-1)^n}{n^2}$, so $a_n = \\frac{4(-1)^n}{n^2}$. The coefficients shrink like $\\frac{1}{n^2}$, faster than for a function whose extension has a jump.\n\n> **Watch out.** Here the sign is $(-1)^n$, so $a_1 < 0$ for $f = x^2$, and the denominator is $n^2$, not $n$. For $f = x^2$, $a_1 = -4$, $a_2 = 1$ and $a_3 = -\\frac{4}{9}$.",
    "$(0, \\pi)$ 上的余弦系数是 $a_n = \\frac{2}{\\pi}\\int_0^\\pi f(x)\\cos nx\\,dx$。对 $f(x) = x^2$，分部积分两次得 $\\int_0^\\pi x^2\\cos nx\\,dx = \\frac{2\\pi(-1)^n}{n^2}$，所以 $a_n = \\frac{4(-1)^n}{n^2}$。系数像 $\\frac{1}{n^2}$ 那样减小，比延拓后有跳跃的函数更快。\n\n> **注意。** 这里的符号是 $(-1)^n$，所以对 $f = x^2$ 有 $a_1 < 0$；分母是 $n^2$，不是 $n$。对 $f = x^2$，$a_1 = -4$，$a_2 = 1$，$a_3 = -\\frac{4}{9}$。",
  ),
  generate(rng) {
    const c = nonzero(rng, 9);
    const n = rng.int(1, 8);
    const sign = n % 2 === 0 ? 1 : -1;
    const answer = Q.of(4 * c * sign, n * n);
    const integral = `${sign < 0 ? "-" : ""}${n === 1 ? "2\\pi" : `\\frac{2\\pi}{${n * n}}`}`;
    return explainedNumber(
      [
        `The Fourier cosine series of $f(x) = ${poly([c, "x^2"])}$ on $(0, \\pi)$ has coefficients $a_n$. Find $a_{${n}}$.`,
        `$f(x) = ${poly([c, "x^2"])}$ 在 $(0, \\pi)$ 上的傅里叶余弦级数的系数为 $a_n$。求 $a_{${n}}$。`,
      ],
      answer,
      [
        labelled(
          ["Integrate by parts twice", "分部积分两次"],
          "The first boundary term vanishes because $\\sin n\\pi = 0$, and the rest is the integral of $x\\sin nx$:",
          "第一次的边界项因 $\\sin n\\pi = 0$ 而为零，剩下的是 $x\\sin nx$ 的积分：",
          `\\int_{0}^{\\pi} x^{2}\\cos nx\\,dx = -\\frac{2}{n}\\int_{0}^{\\pi} x\\sin nx\\,dx = -\\frac{2}{n} \\cdot \\left(-\\frac{\\pi\\cos n\\pi}{n}\\right) = \\frac{2\\pi\\cos n\\pi}{n^{2}}`,
        ),
        labelled(
          [`Put in n = ${n}`, `代入 n = ${n}`],
          `Here $\\cos ${n}\\pi = ${sign}$:`,
          `这里 $\\cos ${n}\\pi = ${sign}$：`,
          `a_{${n}} = \\frac{2}{\\pi} \\cdot ${inParens(c)} \\cdot ${sign < 0 ? `\\left(${integral}\\right)` : integral} = ${answer.toLatex()}`,
        ),
      ],
      [
        `The rule $a_n = \\frac{4c(-1)^n}{n^2}$ with $c = ${c}$ and $n = ${n}$ gives $4 \\cdot ${inParens(c)} \\cdot ${inParens(sign)} \\div ${n * n} = ${answer.toLatex()}$.`,
        `由 $a_n = \\frac{4c(-1)^n}{n^2}$，$c = ${c}$，$n = ${n}$，得 $4 \\cdot ${inParens(c)} \\cdot ${inParens(sign)} \\div ${n * n} = ${answer.toLatex()}$。`,
      ],
      [
        [
          answer.neg(),
          `That has the wrong sign: $(-1)^{n}$ is $${sign}$ for $n = ${n}$.`,
          `符号错了：$n = ${n}$ 时 $(-1)^{n}$ 是 $${sign}$。`,
        ],
        [
          Q.of(2 * c * sign, n * n),
          "That drops the factor $2$ of $\\frac{2}{\\pi}$ in front of the integral.",
          "这漏掉了积分前 $\\frac{2}{\\pi}$ 中的因子 $2$。",
        ],
        [
          Q.of(4 * c * sign, n),
          "That divides by $n$ only once; each of the two integrations by parts brings a $\\frac{1}{n}$.",
          "这只除了一次 $n$；两次分部积分各带来一个 $\\frac{1}{n}$。",
        ],
        [
          Q.of(4 * c, n * n * n),
          "That divides by $n$ three times and loses the sign; there are only two integrations by parts.",
          "这除了三次 $n$，还丢了符号；只做了两次分部积分。",
        ],
      ],
    );
  },
};

const harmonicFromFrequency: KnowledgePointDef = {
  id: "naming-a-harmonic-from-its-frequency",
  title: t("Naming a harmonic from its frequency", "由频率确定谐波的次数"),
  explanation: t(
    "A function of period $T = 2L$ has a Fourier series with terms $\\cos\\frac{n\\pi x}{L}$. A written term may have its fraction reduced, which hides its number $n$. To recover it, divide the angular frequency of the term by the fundamental frequency $\\frac{\\pi}{L}$. The quotient is the number of full oscillations in a period.\n\n> **Watch out.** Divide by $\\frac{\\pi}{L}$ with $L$ half the period, and undo any cancelling first. For period $8$, $L = 4$, and $\\cos\\frac{3\\pi x}{2} = \\cos\\frac{6\\pi x}{4}$ is the harmonic $n = 6$, not $3$.",
    "周期为 $T = 2L$ 的函数，其傅里叶级数的项是 $\\cos\\frac{n\\pi x}{L}$。写出来的项可能约过分，因而看不出次数 $n$。要还原它，就用该项的角频率除以基频 $\\frac{\\pi}{L}$。商就是一个周期内完整振荡的次数。\n\n> **注意。** 除以 $\\frac{\\pi}{L}$ 时 $L$ 是半个周期，并且要先还原约分。对周期 $8$，$L = 4$，$\\cos\\frac{3\\pi x}{2} = \\cos\\frac{6\\pi x}{4}$ 是第 $n = 6$ 次谐波，不是 $3$。",
  ),
  generate(rng) {
    const L = rng.int(2, 8);
    const n = rng.int(1, 12);
    const g = gcd(n, L);
    const p = n / g;
    const q = L / g;
    const angle = q === 1 ? `${multiple(p, "\\pi")} x` : `\\frac{${multiple(p, "\\pi")} x}{${q}}`;
    const frequency = q === 1 ? multiple(p, "\\pi") : `\\frac{${multiple(p, "\\pi")}}{${q}}`;
    return numberProblem({
      prompt: t(
        `A function has period $${2 * L}$. Which harmonic number $n$ is the term $\\cos\\left(${angle}\\right)$ of its Fourier series?`,
        `函数的周期为 $${2 * L}$。它的傅里叶级数中，$\\cos\\left(${angle}\\right)$ 这一项的谐波次数 $n$ 是多少？`,
      ),
      answer: n,
      form: "integer",
      solveFor: "n",
      mistakes: keptMistakes(n, [
        [
          p,
          `That reads the numerator of the cancelled fraction; written over $L = ${L}$ the angle is $\\frac{${multiple(n, "\\pi")} x}{${L}}$.`,
          `这读的是约分后的分子；写成分母为 $L = ${L}$ 时，角度是 $\\frac{${multiple(n, "\\pi")} x}{${L}}$。`,
        ],
        [
          2 * n,
          `That puts the whole period $${2 * L}$ in place of $L$; the terms are $\\cos\\frac{n\\pi x}{L}$ with $L = ${L}$.`,
          `这把整个周期 $${2 * L}$ 当成了 $L$；各项是 $\\cos\\frac{n\\pi x}{L}$，其中 $L = ${L}$。`,
        ],
        [
          Q.of(n, 2),
          `That writes the terms as $\\cos\\frac{2n\\pi x}{${L}}$, as if the period were $${L}$; it is $${2 * L}$.`,
          `这把各项写成 $\\cos\\frac{2n\\pi x}{${L}}$，好像周期是 $${L}$；实际周期是 $${2 * L}$。`,
        ],
      ]),
      solution: walked(
        [
          [
            ["Find L", "求 L"],
            t("$L$ is half the period, and the fundamental frequency is $\\frac{\\pi}{L}$:", "$L$ 是半个周期，基频是 $\\frac{\\pi}{L}$："),
            [`L = \\frac{${2 * L}}{2} = ${L}, \\qquad \\frac{\\pi}{L} = \\frac{\\pi}{${L}}`],
          ],
          [["Divide by the fundamental", "除以基频"], t("", ""), [`n = ${frequency} \\div \\frac{\\pi}{${L}} = ${n}`]],
        ],
        t(
          `$\\frac{${multiple(n, "\\pi")} x}{${L}}$ reduces to $${angle}$, the term given.`,
          `$\\frac{${multiple(n, "\\pi")} x}{${L}}$ 约分后正是 $${angle}$。`,
        ),
      ),
    });
  },
};

const gibbsOvershoot: KnowledgePointDef = {
  id: "the-overshoot-at-a-jump",
  title: t("The overshoot at a jump", "跳跃点处的过冲"),
  explanation: t(
    "Partial sums of a Fourier series do not settle smoothly near a jump. They overshoot the higher value and undershoot the lower one by about $9\\%$ of the jump, however many terms are taken. This is the Gibbs phenomenon. The peak only moves closer to the jump, so convergence does not remove its height.\n\n> **Watch out.** The $9\\%$ is of the jump, not of the function value, and it is added to the higher value, not to the midpoint. For a jump from $-1$ to $3$, the peak is $3 + 0.09 \\cdot 4 = 3.36$, not $3.27$ or $1.36$.",
    "傅里叶级数的部分和在跳跃点附近不会平稳地趋近。无论取多少项，它都会高出较高的值、低于较低的值，差距约为跳跃量的 $9\\%$。这就是吉布斯现象。峰值只是越来越靠近跳跃点，所以收敛并不会消除它的高度。\n\n> **注意。** $9\\%$ 是跳跃量的百分比，不是函数值的百分比，而且要加在较高的值上，不是加在中点上。对从 $-1$ 跳到 $3$ 的情形，峰值为 $3 + 0.09 \\cdot 4 = 3.36$，不是 $3.27$ 或 $1.36$。",
  ),
  generate(rng) {
    const a = rng.int(-9, 8);
    const gap = rng.int(1, 12);
    const b = a + gap;
    const answer = Q.of(100 * b + 9 * gap, 100);
    const over = Q.of(9 * gap, 100);
    return numberProblem({
      prompt: t(
        `A $2\\pi$-periodic function equals $${a}$ on $(-\\pi, 0)$ and $${b}$ on $(0, \\pi)$. Taking the Gibbs overshoot to be $9\\%$ of the jump, what height do the peaks of the partial sums approach just to the right of $x = 0$?`,
        `周期为 $2\\pi$ 的函数在 $(-\\pi, 0)$ 上等于 $${a}$，在 $(0, \\pi)$ 上等于 $${b}$。取吉布斯过冲为跳跃量的 $9\\%$，部分和在 $x = 0$ 右侧的峰值趋于多高？`,
      ),
      answer,
      form: "decimal",
      mistakes: keptMistakes(answer, [
        [
          Q.of(a + b, 2),
          "That is the midpoint, the value the series takes at the jump itself, not the peak beside it.",
          "这是中点，即级数在跳跃点本身取的值，而不是旁边的峰值。",
        ],
        [b, "That leaves out the overshoot, which does not shrink as more terms are taken.", "这漏掉了过冲，而过冲不会随项数增加而缩小。"],
        [
          Q.of(100 * b + 18 * gap, 100),
          "That adds $9\\%$ twice; the overshoot above the top is $9\\%$ of the jump once.",
          "这加了两次 $9\\%$；顶端之上的过冲只是一次跳跃量的 $9\\%$。",
        ],
        [
          Q.of(100 * b + 9 * Math.abs(b), 100),
          `That takes $9\\%$ of the value $${b}$; it is $9\\%$ of the jump $${gap}$.`,
          `这取的是函数值 $${b}$ 的 $9\\%$；应当取跳跃量 $${gap}$ 的 $9\\%$。`,
        ],
        [
          Q.of(100 * a - 9 * gap, 100),
          "That is the undershoot on the left, below the lower value; the question asks just to the right of $0$.",
          "这是左侧低于较低值的下冲；题目问的是 $0$ 的右侧。",
        ],
      ]),
      solution: walked(
        [
          [["Measure the jump", "量出跳跃量"], t("", ""), [`${b} - ${inParens(a)} = ${gap}`]],
          [
            ["Add the overshoot", "加上过冲"],
            t("The peak lies above the higher value by $9\\%$ of the jump:", "峰值比较高的值高出跳跃量的 $9\\%$："),
            [`0.09 \\cdot ${gap} = ${dec(over)}, \\qquad ${b} + ${dec(over)} = ${dec(answer)}`],
          ],
        ],
        t(
          `The peak is above $${b}$ by $${dec(over)}$, which is $${dec(over)} \\div ${gap} = 0.09$ of the jump.`,
          `峰值比 $${b}$ 高 $${dec(over)}$，它是跳跃量的 $${dec(over)} \\div ${gap} = 0.09$。`,
        ),
      ),
    });
  },
};

const countingEigenvalues: KnowledgePointDef = {
  id: "counting-eigenvalues-below-a-bound",
  title: t("Counting eigenvalues below a bound", "计数小于某值的特征值"),
  explanation: t(
    "On an interval of length $\\ell$, the problem $y'' + \\lambda y = 0$ has eigenvalues $\\left(\\frac{n\\pi}{\\ell}\\right)^2$. With $y = 0$ at both ends, $n$ starts at $1$. With $y' = 0$ at both ends, $n$ starts at $0$, since a constant is then an eigenfunction. So the count depends on the boundary conditions as well as the length.\n\n> **Watch out.** Check the end conditions before counting. On $(0, \\pi)$ with the bound $10$: $y = 0$ at both ends gives $1, 4, 9$, three eigenvalues, while $y' = 0$ at both ends adds $\\lambda = 0$, making four.",
    "在长度为 $\\ell$ 的区间上，问题 $y'' + \\lambda y = 0$ 的特征值是 $\\left(\\frac{n\\pi}{\\ell}\\right)^2$。两端 $y = 0$ 时，$n$ 从 $1$ 开始。两端 $y' = 0$ 时，$n$ 从 $0$ 开始，因为这时常数是特征函数。所以特征值的个数既取决于长度，也取决于边界条件。\n\n> **注意。** 计数前先看端点条件。在 $(0, \\pi)$ 上、界限为 $10$ 时：两端 $y = 0$ 给出 $1, 4, 9$ 三个特征值；两端 $y' = 0$ 还要加上 $\\lambda = 0$，共四个。",
  ),
  generate(rng) {
    const m = rng.int(1, 3);
    const N = rng.int(2, 7);
    const low = (m * N) ** 2;
    const high = (m * (N + 1)) ** 2;
    const M = rng.int(low + 1, high - 1);
    const fixed = rng.pick([true, false]);
    const end = m === 1 ? "\\pi" : `\\frac{\\pi}{${m}}`;
    const answer = fixed ? N : N + 1;
    const conditions = fixed ? `y(0) = y\\left(${end}\\right) = 0` : `y'(0) = y'\\left(${end}\\right) = 0`;
    const rule = poly([m * m, "n^2"]);
    const start = fixed ? 1 : 0;
    const values = Array.from({ length: N + 2 - start }, (_, i) => ((i + start) * m) ** 2).join(", ");
    return explainedNumber(
      [
        `How many eigenvalues of $y'' + \\lambda y = 0$ with $${conditions}$ are less than $${M}$?`,
        `$y'' + \\lambda y = 0$（条件为 $${conditions}$）有多少个特征值小于 $${M}$？`,
      ],
      answer,
      [
        labelled(
          ["List the eigenvalues", "列出特征值"],
          `On an interval of length $${end}$ they are $\\lambda = ${rule}$, with $n$ starting at $${start}$:`,
          `在长度为 $${end}$ 的区间上，特征值为 $\\lambda = ${rule}$，$n$ 从 $${start}$ 开始：`,
          `\\lambda = ${values}, \\ldots`,
        ),
        labelled(
          ["Count those below the bound", "数出小于界限的"],
          `The values up to $${low}$ are below $${M}$ and $${high}$ is not, so $n$ runs from $${start}$ to $${N}$:`,
          `直到 $${low}$ 的值都小于 $${M}$，而 $${high}$ 不小于，所以 $n$ 从 $${start}$ 到 $${N}$：`,
          `${low} < ${M} \\le ${high}, \\qquad ${N} - ${start} + 1 = ${answer}`,
        ),
      ],
      [
        `$n = ${N}$ gives $${low} < ${M}$ and $n = ${N + 1}$ gives $${high} \\ge ${M}$, so the count stops at $n = ${N}$${fixed ? "" : ", with $\\lambda = 0$ included"}.`,
        `$n = ${N}$ 时为 $${low} < ${M}$，$n = ${N + 1}$ 时为 $${high} \\ge ${M}$，所以计数到 $n = ${N}$ 为止${fixed ? "" : "，并包括 $\\lambda = 0$"}。`,
      ],
      [
        [
          fixed ? N + 1 : N,
          fixed
            ? "That counts $\\lambda = 0$, but with $y = 0$ at both ends a constant must be $0$, so $n$ starts at $1$."
            : "That leaves out $\\lambda = 0$: with $y' = 0$ at both ends the constant $y = 1$ is an eigenfunction.",
          fixed
            ? "这把 $\\lambda = 0$ 也算进去了，但两端 $y = 0$ 时常数只能是 $0$，所以 $n$ 从 $1$ 开始。"
            : "这漏掉了 $\\lambda = 0$：两端 $y' = 0$ 时常数 $y = 1$ 是特征函数。",
        ],
        [answer + 1, `That also counts $${high}$, which is not less than $${M}$.`, `这把 $${high}$ 也算进去了，但它不小于 $${M}$。`],
        [
          answer - 1,
          `That stops one too early: $${low}$ is less than $${M}$ and counts.`,
          `这少数了一个：$${low}$ 小于 $${M}$，应当计入。`,
        ],
        [
          Math.floor(Math.sqrt(M)),
          `That counts the $n$ with $n^{2} < ${M}$, ignoring the length; here the eigenvalues are $${rule}$.`,
          `这数的是满足 $n^{2} < ${M}$ 的 $n$，忽略了区间长度；这里特征值是 $${rule}$。`,
        ],
      ],
      "integer",
    );
  },
};

const severalImplicitSteps: KnowledgePointDef = {
  id: "several-implicit-euler-steps",
  title: t("Several implicit Euler steps", "多步隐式欧拉法"),
  explanation: t(
    "For $y' = -\\lambda y$, the implicit Euler equation $y_{k+1} = y_k - h\\lambda y_{k+1}$ solves to $y_{k+1} = \\frac{y_k}{1 + h\\lambda}$. So every step divides by the same number, and repeated steps divide by its powers. The values shrink and stay positive for any step size, unlike the explicit method.\n\n> **Watch out.** Divide by $1 + h\\lambda$ once for every step, not by $1 + h\\lambda$ times the number of steps. For $y' = -10y$ with $h = 0.1$ and $y_0 = 8$, each step halves the value, so $y_3 = \\frac{8}{2^{3}} = 1$; dividing by $2 \\cdot 3 = 6$ would give $\\frac{4}{3}$.",
    "对 $y' = -\\lambda y$，隐式欧拉方程 $y_{k+1} = y_k - h\\lambda y_{k+1}$ 解得 $y_{k+1} = \\frac{y_k}{1 + h\\lambda}$。所以每一步都除以同一个数，多步就是除以它的幂。与显式方法不同，无论步长多大，这些值都会减小并保持为正。\n\n> **注意。** 每走一步都要除以一次 $1 + h\\lambda$，而不是除以 $1 + h\\lambda$ 与步数的乘积。对 $y' = -10y$，$h = 0.1$，$y_0 = 8$，每一步都使数值减半，所以 $y_3 = \\frac{8}{2^{3}} = 1$；若除以 $2 \\cdot 3 = 6$，会得到 $\\frac{4}{3}$。",
  ),
  generate(rng) {
    const F = rng.int(2, 4);
    const tenths = rng.pick([1, 2, 5, 10]);
    const lambda = ((F - 1) * 10) / tenths;
    const steps = rng.int(2, 3);
    const answer = rng.int(1, 20);
    const start = answer * F ** steps;
    const first = start / F;
    return explainedNumber(
      [
        `Apply $${steps}$ steps of the implicit Euler method with $h = ${decimal(tenths)}$ to $y' = ${poly([-lambda, "y"])}$, $y(0) = ${start}$. Find $y_{${steps}}$.`,
        `用隐式欧拉法对 $y' = ${poly([-lambda, "y"])}$，$y(0) = ${start}$ 迭代 $${steps}$ 步，步长 $h = ${decimal(tenths)}$。求 $y_{${steps}}$。`,
      ],
      answer,
      [
        labelled(
          ["Solve one step", "解出一步"],
          "Each step solves $y_{k+1} = y_k - h\\lambda y_{k+1}$ for the new value:",
          "每一步都从 $y_{k+1} = y_k - h\\lambda y_{k+1}$ 解出新值：",
          `y_{k+1} = \\frac{y_k}{1 + h\\lambda}, \\qquad 1 + h\\lambda = 1 + ${decimal(tenths)} \\cdot ${lambda} = ${F}`,
        ),
        labelled(
          ["Repeat the division", "重复除法"],
          `Over $${steps}$ steps the value is divided by $${F}$ each time:`,
          `在 $${steps}$ 步中，数值每次都除以 $${F}$：`,
          `y_{${steps}} = \\frac{${start}}{${F}^{${steps}}} = ${answer}`,
        ),
      ],
      [
        `The first step $y_1 = ${first}$ satisfies the implicit equation: $${start} - ${F - 1} \\cdot ${first} = ${first}$, and $${answer} \\cdot ${F}^{${steps}} = ${start}$ takes the last value back to the start.`,
        `第一步 $y_1 = ${first}$ 满足隐式方程：$${start} - ${F - 1} \\cdot ${first} = ${first}$；而 $${answer} \\cdot ${F}^{${steps}} = ${start}$ 把最后的值还原为初值。`,
      ],
      [
        [
          start * (2 - F) ** steps,
          "That is the explicit Euler result, which multiplies by $1 - h\\lambda$ at each step.",
          "这是显式欧拉法的结果，它每一步乘以 $1 - h\\lambda$。",
        ],
        [Q.of(start, F), "That is the value after one step only.", "这只是一步之后的值。"],
        [
          Q.of(start, F * steps),
          `That divides by $${F} \\cdot ${steps}$; each step divides again, so the divisor is $${F}^{${steps}}$.`,
          `这是除以 $${F} \\cdot ${steps}$；每一步都再除一次，所以除数是 $${F}^{${steps}}$。`,
        ],
      ],
    );
  },
};

const stepWithoutOvershoot: KnowledgePointDef = {
  id: "the-largest-step-without-oscillation",
  title: t("The largest step without oscillation", "不产生振荡的最大步长"),
  explanation: t(
    "Explicit Euler on $y' = \\lambda(c - y)$ multiplies the distance from $c$ by $1 - h\\lambda$ at each step. The method is stable for $h\\lambda$ up to $2$, but stability alone does not make the result look right. When $h\\lambda$ exceeds $1$ the factor is negative, so the values jump back and forth across $c$, which the true solution never does.\n\n> **Watch out.** Staying on one side needs $h\\lambda \\le 1$, a stricter bound than the stability bound $h\\lambda \\le 2$. For $y' = 4(3 - y)$ the largest such step is $\\frac{1}{4}$; at $h = 0.4$ the factor is $1 - 1.6 = -0.6$, so the method is stable but every step jumps across $3$.",
    "显式欧拉法用于 $y' = \\lambda(c - y)$ 时，每一步把到 $c$ 的距离乘以 $1 - h\\lambda$。只要 $h\\lambda$ 不超过 $2$，方法就是稳定的，但稳定并不代表结果合理。当 $h\\lambda$ 超过 $1$ 时因子为负，数值会在 $c$ 的两侧来回跳动，而真实解从不这样。\n\n> **注意。** 要始终留在一侧，需要 $h\\lambda \\le 1$，这比稳定性的界 $h\\lambda \\le 2$ 更严格。对 $y' = 4(3 - y)$，这样的最大步长是 $\\frac{1}{4}$；取 $h = 0.4$ 时因子为 $1 - 1.6 = -0.6$，方法稳定，但每一步都跳到 $3$ 的另一侧。",
  ),
  generate(rng) {
    const lambda = rng.int(2, 40);
    const c = rng.int(1, 20);
    const answer = Q.of(1, lambda);
    return explainedNumber(
      [
        `Explicit Euler is applied to $y' = ${lambda}(${c} - y)$, starting above $${c}$. What is the largest step size $h$ for which the values never cross below $${c}$?`,
        `对 $y' = ${lambda}(${c} - y)$ 使用显式欧拉法，初值大于 $${c}$。步长 $h$ 最大取多少时，数值始终不会低于 $${c}$？`,
      ],
      answer,
      [
        labelled(
          ["Follow the distance from the level", "跟踪到该水平的距离"],
          `One Euler step changes the distance $y_k - ${c}$ by a fixed factor:`,
          `欧拉法的一步使距离 $y_k - ${c}$ 乘以一个固定因子：`,
          `y_{k+1} - ${c} = (y_k - ${c}) + ${lambda}h(${c} - y_k) = (1 - ${lambda}h)(y_k - ${c})`,
        ),
        labelled(
          ["Keep the factor nonnegative", "使因子非负"],
          "A negative factor would carry the value across the level.",
          "因子为负时，数值会越过这个水平。",
          `1 - ${lambda}h \\ge 0 \\iff h \\le ${answer.toLatex()}`,
        ),
      ],
      [
        `At $h = ${answer.toLatex()}$ the factor is $1 - ${lambda} \\cdot ${answer.toLatex()} = 0$: the first step lands exactly on $${c}$ and stays there. Any larger step makes the factor negative, and the next value falls below $${c}$.`,
        `当 $h = ${answer.toLatex()}$ 时，因子为 $1 - ${lambda} \\cdot ${answer.toLatex()} = 0$：第一步正好落在 $${c}$ 上并停在那里。步长再大，因子就为负，下一个值会低于 $${c}$。`,
      ],
      [
        [
          Q.of(2, lambda),
          "That is the stability limit $h\\lambda \\le 2$; up to it the values stay bounded but may cross the level.",
          "这是稳定性的界 $h\\lambda \\le 2$；在此之内数值有界，但可能越过该水平。",
        ],
        [
          lambda,
          `That is the rate $\\lambda$ itself; the bound is $h \\le \\frac{1}{\\lambda}$.`,
          `这是速率 $\\lambda$ 本身；界是 $h \\le \\frac{1}{\\lambda}$。`,
        ],
        [
          Q.of(c, lambda),
          `That brings in the level $${c}$, which does not enter the factor $1 - h\\lambda$.`,
          `这引入了水平 $${c}$，而它并不出现在因子 $1 - h\\lambda$ 中。`,
        ],
      ],
    );
  },
};

const stepsForTargetError: KnowledgePointDef = {
  id: "the-steps-needed-for-a-target-error",
  title: t("The steps needed for a target error", "达到目标误差所需的步数"),
  explanation: t(
    "A method of order $p$ has error about $Ch^p$, and the number of steps on a fixed interval is proportional to $\\frac{1}{h}$. Dividing $h$ by $r$ multiplies the work by $r$ and divides the error by $r^p$. High-order methods therefore gain accuracy cheaply, while a first-order method pays for every factor in full.\n\n> **Watch out.** The number of steps grows by the $p$-th root of the error factor, not by the factor itself. A second-order method that needs an error $16$ times smaller takes $r = 4$, so $10$ steps become $40$, not $160$.",
    "$p$ 阶方法的误差约为 $Ch^p$，而固定区间上的步数与 $\\frac{1}{h}$ 成正比。把 $h$ 除以 $r$，工作量乘以 $r$，误差除以 $r^p$。所以高阶方法能以很小的代价提高精度，而一阶方法的每一分精度都要付出同样多的步数。\n\n> **注意。** 步数按误差倍数的 $p$ 次方根增长，而不是按倍数本身增长。二阶方法要使误差缩小 $16$ 倍，取 $r = 4$，所以 $10$ 步变成 $40$ 步，而不是 $160$ 步。",
  ),
  generate(rng) {
    const p = rng.pick([1, 2, 4]);
    const k = rng.int(1, 3);
    const N = 10 * rng.int(1, 10);
    const r = 2 ** k;
    const factor = r ** p;
    const answer = N * r;
    const root = p === 1 ? `r = ${factor}` : `r^{${p}} = ${factor} \\implies r = ${r}`;
    const shrink = p === 1 ? `$Ch$ shrinks by $${r}$` : `$Ch^{${p}}$ shrinks by $${r}^{${p}} = ${factor}$`;
    const shrinkZh = p === 1 ? `$Ch$ 缩小 $${r}$ 倍` : `$Ch^{${p}}$ 缩小 $${r}^{${p}} = ${factor}$ 倍`;
    return explainedNumber(
      [
        `A method of order $${p}$ takes $${N}$ steps to cross an interval. How many steps does it need on the same interval to make the error $${factor}$ times smaller?`,
        `一个 $${p}$ 阶方法用 $${N}$ 步走完一个区间。要使误差缩小到 $\\frac{1}{${factor}}$，在同一区间上需要多少步？`,
      ],
      answer,
      [
        labelled(
          ["Find how much to shrink the step", "求步长缩小的倍数"],
          `Dividing $h$ by $r$ divides the error by $r^p$, with $p = ${p}$:`,
          `把 $h$ 除以 $r$，误差除以 $r^p$，这里 $p = ${p}$：`,
          root,
        ),
        labelled(
          ["Multiply the steps", "步数相乘"],
          "On a fixed interval the number of steps is proportional to $\\frac{1}{h}$:",
          "在固定区间上，步数与 $\\frac{1}{h}$ 成正比：",
          `${N} \\cdot ${r} = ${answer}`,
        ),
      ],
      [
        `With $${answer}$ steps the step is $\\frac{1}{${r}}$ of the old one, and the error ${shrink}, the factor asked for.`,
        `用 $${answer}$ 步时，步长是原来的 $\\frac{1}{${r}}$，误差 ${shrinkZh}，正是所要求的倍数。`,
      ],
      [
        [
          N * factor,
          "That multiplies the steps by the error factor, which is right only for a first-order method.",
          "这把步数乘以误差倍数，只有一阶方法才是这样。",
        ],
        [
          N * p,
          "That multiplies the steps by the order; the step factor is the $p$-th root of the error factor.",
          "这把步数乘以阶数；步长倍数是误差倍数的 $p$ 次方根。",
        ],
        [
          N + factor,
          "That adds the error factor to the steps; a smaller step multiplies the number of steps.",
          "这把误差倍数加到步数上；步长变小时，步数是成倍增加的。",
        ],
        [
          N * r * r,
          `That squares the step factor $${r}$; the steps grow by $r$ itself.`,
          `这把步长倍数 $${r}$ 平方了；步数只按 $r$ 本身增长。`,
        ],
      ],
      "integer",
    );
  },
};

const midpointStep: KnowledgePointDef = {
  id: "a-midpoint-step",
  title: t("A midpoint step", "中点法的一步"),
  explanation: t(
    "The midpoint method is a second-order relative of Heun's method. It uses Euler's method for half a step to reach an estimated midpoint, and takes the slope there: $k_1 = f(t_n, y_n)$, then $k_2 = f\\left(t_n + \\frac{h}{2}, y_n + \\frac{h}{2}k_1\\right)$. The full step from $y_n$ then uses this better slope: $y_{n+1} = y_n + hk_2$.\n\n> **Watch out.** The full step starts again from $y_n$; the midpoint value only supplies the slope. For $y' = y$, $y_0 = 1$, $h = 1$: $k_1 = 1$, the midpoint value is $1.5$, $k_2 = 1.5$, so $y_1 = 1 + 1.5 = 2.5$; stepping $h$ from the midpoint would give $3$.",
    "中点法是与 Heun 方法同属二阶的方法。它先用欧拉法走半步，估计出中点，再取那里的斜率：$k_1 = f(t_n, y_n)$，然后 $k_2 = f\\left(t_n + \\frac{h}{2}, y_n + \\frac{h}{2}k_1\\right)$。之后从 $y_n$ 出发，用这个更好的斜率走完整一步：$y_{n+1} = y_n + hk_2$。\n\n> **注意。** 完整的一步要重新从 $y_n$ 出发；中点值只用来提供斜率。对 $y' = y$，$y_0 = 1$，$h = 1$：$k_1 = 1$，中点值为 $1.5$，$k_2 = 1.5$，所以 $y_1 = 1 + 1.5 = 2.5$；若从中点出发走 $h$，会得到 $3$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 3);
    const t0 = rng.int(0, 2);
    const y0 = rng.int(1, 9);
    const tenths = rng.pick([2, 4, 10]);
    const h = Q.of(tenths, 10);
    const half = Q.of(tenths, 20);
    const f = (time: Q, y: Q) => Q.of(a).mul(time).add(Q.of(b).mul(y));
    const start = Q.of(y0);
    const k1 = f(Q.of(t0), start);
    const middle = start.add(half.mul(k1));
    const k2 = f(Q.of(t0).add(half), middle);
    const answer = start.add(h.mul(k2));
    const k4 = f(Q.of(t0).add(h), start.add(h.mul(k1)));
    const tMid = Q.of(t0).add(half);
    const curvature = Q.of(a).add(Q.of(b).mul(k1));
    const bTimes = `${b < 0 ? "-" : "+"} ${Math.abs(b)} \\cdot ${signedFactor(k1)}`;
    return explainedNumber(
      [
        `Apply one step of the midpoint method with $h = ${decimal(tenths)}$ to $y' = ${poly([a, "t"], [b, "y"])}$, $y(${t0}) = ${y0}$. Find $y_1$.`,
        `用中点法对 $y' = ${poly([a, "t"], [b, "y"])}$，$y(${t0}) = ${y0}$ 走一步，步长 $h = ${decimal(tenths)}$。求 $y_1$。`,
      ],
      answer,
      [
        labelled(["The starting slope", "起点的斜率"], "", "", `k_1 = f(${t0}, ${y0}) = ${k1.toLatex()}`),
        labelled(
          ["Half a step to the midpoint", "走半步到中点"],
          "",
          "",
          `y_{1/2} = ${y0} + ${dec(half)} \\cdot ${signedFactor(k1)} = ${middle.toLatex()}`,
        ),
        labelled(
          ["The slope at the midpoint", "中点处的斜率"],
          "",
          "",
          `k_2 = f\\left(${dec(tMid)}, ${middle.toLatex()}\\right) = ${k2.toLatex()}`,
        ),
        labelled(
          ["The full step from the start", "从起点走完整一步"],
          "",
          "",
          `y_1 = ${y0} + ${decimal(tenths)} \\cdot ${signedFactor(k2)} = ${answer.toLatex()}`,
        ),
      ],
      [
        `For this linear equation the midpoint step equals the second-order Taylor step $y_0 + hy' + \\frac{h^{2}}{2}y''$, where $y'' = ${a} ${bTimes} = ${curvature.toLatex()}$: $${y0} + ${decimal(tenths)} \\cdot ${signedFactor(k1)} + ${dec(h.mul(h).div(Q.of(2)))} \\cdot ${signedFactor(curvature)} = ${answer.toLatex()}$.`,
        `对这个线性方程，中点法的一步等于二阶泰勒展开 $y_0 + hy' + \\frac{h^{2}}{2}y''$，其中 $y'' = ${a} ${bTimes} = ${curvature.toLatex()}$：$${y0} + ${decimal(tenths)} \\cdot ${signedFactor(k1)} + ${dec(h.mul(h).div(Q.of(2)))} \\cdot ${signedFactor(curvature)} = ${answer.toLatex()}$。`,
      ],
      [
        [start.add(h.mul(k1)), "That is Euler's step, with the starting slope $k_1$.", "这是欧拉法的一步，用的是起点斜率 $k_1$。"],
        [
          start.add(half.mul(k1.add(k4))),
          "That is Heun's method, which averages the slopes at the two ends.",
          "这是 Heun 方法，它对两端的斜率取平均。",
        ],
        [
          start.add(h.mul(f(tMid, start))),
          "That takes $k_2$ at $y_n$ instead of at the estimated midpoint value.",
          "这在 $y_n$ 处取 $k_2$，而不是在估计的中点值处。",
        ],
        [middle, "That is the midpoint value, only half a step along.", "这是中点值，只走了半步。"],
      ],
    );
  },
};

const rk4OfTime: KnowledgePointDef = {
  id: "an-rk4-step-for-a-function-of-t-alone",
  title: t("An RK4 step for a function of t alone", "右端只含 t 时的 RK4 步"),
  explanation: t(
    "When the right-hand side depends only on $t$, the slopes $k_2$ and $k_3$ are the same value, both taken at the midpoint. RK4 then becomes $y_{n+1} = y_n + \\frac{h}{6}(k_1 + 4k_2 + k_4)$, which is Simpson's rule for the integral of $f$. Simpson's rule is exact for quadratics, so here the step equals the true solution.\n\n> **Watch out.** The midpoint slope is counted twice, as $k_2$ and as $k_3$, so its weight is $4$, not $2$. For $y' = t^{2}$ from $y(0) = 0$ with $h = 2$: $\\frac{2}{6}(0 + 4 \\cdot 1 + 4) = \\frac{8}{3}$, which is $\\int_0^2 t^{2}\\,dt$.",
    "右端只依赖 $t$ 时，$k_2$ 和 $k_3$ 是同一个值，都在中点处取得。RK4 于是变成 $y_{n+1} = y_n + \\frac{h}{6}(k_1 + 4k_2 + k_4)$，这正是 $f$ 的积分的辛普森公式。辛普森公式对二次函数是精确的，所以这里的一步就等于真实解。\n\n> **注意。** 中点斜率作为 $k_2$ 和 $k_3$ 被计入两次，所以它的权重是 $4$，不是 $2$。对 $y' = t^{2}$，从 $y(0) = 0$ 出发，$h = 2$：$\\frac{2}{6}(0 + 4 \\cdot 1 + 4) = \\frac{8}{3}$，正是 $\\int_0^2 t^{2}\\,dt$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 3);
    const b = rng.int(-4, 4);
    const c = rng.int(-5, 5);
    const h = rng.pick([1, 2, 3, 4]);
    const t0 = rng.int(0, 3);
    const y0 = rng.int(1, 12);
    const f = (x: Q) => Q.of(a).mul(x).mul(x).add(Q.of(b).mul(x)).add(Q.of(c));
    const k1 = f(Q.of(t0));
    const k2 = f(Q.of(2 * t0 + h, 2));
    const k4 = f(Q.of(t0 + h));
    const start = Q.of(y0);
    const answer = start.add(Q.of(h, 6).mul(k1.add(k2.mul(Q.of(4))).add(k4)));
    const sum = k1.add(k2.mul(Q.of(4))).add(k4);
    const anti = (x: Q) =>
      Q.of(a, 3)
        .mul(x.pow(3))
        .add(Q.of(b, 2).mul(x.pow(2)))
        .add(Q.of(c).mul(x));
    const t1 = Q.of(t0 + h);
    const area = anti(t1).sub(anti(Q.of(t0)));
    return explainedNumber(
      [
        `Apply one RK4 step with $h = ${h}$ to $y' = ${poly([a, "t^2"], [b, "t"], [c, ""])}$, $y(${t0}) = ${y0}$. Find $y_1$.`,
        `用 RK4 对 $y' = ${poly([a, "t^2"], [b, "t"], [c, ""])}$，$y(${t0}) = ${y0}$ 走一步，步长 $h = ${h}$。求 $y_1$。`,
      ],
      answer,
      [
        labelled(
          ["The slopes", "各个斜率"],
          "The right side does not involve $y$, so $k_2$ and $k_3$ are both the value at the midpoint:",
          "右端不含 $y$，所以 $k_2$ 与 $k_3$ 都是中点处的值：",
          `k_1 = f(${t0}) = ${k1.toLatex()}, \\quad k_2 = k_3 = f\\left(${Q.of(2 * t0 + h, 2).toLatex()}\\right) = ${k2.toLatex()}, \\quad k_4 = f(${t0 + h}) = ${k4.toLatex()}`,
        ),
        labelled(
          ["The weighted sum", "加权和"],
          "",
          "",
          `k_1 + 2k_2 + 2k_3 + k_4 = ${k1.toLatex()} + 4 \\cdot ${signedFactor(k2)} + ${signedFactor(k4)} = ${sum.toLatex()}`,
        ),
        labelled(["The step", "这一步"], "", "", `y_1 = ${y0} + \\frac{${h}}{6} \\cdot ${signedFactor(sum)} = ${answer.toLatex()}`),
      ],
      [
        `Simpson's rule is exact for a quadratic, so the step equals $y_0 + \\int_${t0}^${t0 + h} f(t)\\,dt$. With $F(t) = ${poly([Q.of(a, 3), "t^{3}"], [Q.of(b, 2), "t^{2}"], [c, "t"])}$, $F(${t0 + h}) - F(${t0}) = ${area.toLatex()}$, and $${y0} + ${signedFactor(area)} = ${answer.toLatex()}$.`,
        `辛普森公式对二次函数是精确的，所以这一步等于 $y_0 + \\int_${t0}^${t0 + h} f(t)\\,dt$。取 $F(t) = ${poly([Q.of(a, 3), "t^{3}"], [Q.of(b, 2), "t^{2}"], [c, "t"])}$，$F(${t0 + h}) - F(${t0}) = ${area.toLatex()}$，而 $${y0} + ${signedFactor(area)} = ${answer.toLatex()}$。`,
      ],
      [
        [
          start.add(Q.of(h).mul(k2)),
          "That uses only the midpoint slope; RK4 also weighs in the slopes at the two ends.",
          "这只用了中点斜率；RK4 还要计入两端的斜率。",
        ],
        [start.add(Q.of(h).mul(k1)), "That is Euler's step, with the starting slope only.", "这是欧拉法的一步，只用了起点斜率。"],
        [
          start.add(Q.of(h, 2).mul(k1.add(k4))),
          "That is the trapezoidal average of the end slopes, which leaves out the midpoint.",
          "这是两端斜率的梯形平均，漏掉了中点。",
        ],
        [
          start.add(Q.of(h, 4).mul(k1.add(k2.mul(Q.of(2))).add(k4))),
          "That counts the midpoint slope once, with weights $1, 2, 1$ over $4$; it enters as both $k_2$ and $k_3$.",
          "这只计入一次中点斜率，权重为 $1, 2, 1$ 再除以 $4$；它既是 $k_2$ 又是 $k_3$。",
        ],
      ],
    );
  },
};

const harvestingBothSpecies: KnowledgePointDef = {
  id: "the-effect-of-harvesting-both-species",
  title: t("The effect of harvesting both species", "同时捕捞两个物种的效果"),
  explanation: t(
    "Suppose both populations of a predator-prey model are removed at the same per capita rate $e$. The prey growth rate $a$ becomes $a - e$ and the predator death rate $c$ becomes $c + e$. So the equilibrium moves to more prey and fewer predators. This is Volterra's principle, and it explains why less fishing can mean fewer prey fish.\n\n> **Watch out.** Harvesting lowers the prey growth rate to $a - e$ but raises the predator death rate to $c + e$; the two shifts have opposite signs. For $x' = 6x - 2xy - x$, $y' = -3y + xy - y$, the equilibrium is $\\left(4, \\frac{5}{2}\\right)$, not $(3, 3)$ as without harvesting.",
    "假设捕食模型中的两个种群都按相同的人均比率 $e$ 被移除。猎物的增长率 $a$ 变成 $a - e$，捕食者的死亡率 $c$ 变成 $c + e$。所以平衡点移向更多的猎物和更少的捕食者。这就是沃尔泰拉原理，它解释了为什么减少捕捞反而可能使被捕食的鱼变少。\n\n> **注意。** 捕捞使猎物增长率降为 $a - e$，却使捕食者死亡率升为 $c + e$；两个变化方向相反。对 $x' = 6x - 2xy - x$，$y' = -3y + xy - y$，平衡点是 $\\left(4, \\frac{5}{2}\\right)$，而不是不捕捞时的 $(3, 3)$。",
  ),
  generate(rng) {
    const a = rng.int(4, 12);
    const b = rng.int(1, 5);
    const c = rng.int(1, 6);
    const d = rng.int(1, 5);
    const e = rng.int(1, 3);
    const askPrey = rng.pick([true, false]);
    const prey = Q.of(c + e, d);
    const predator = Q.of(a - e, b);
    const answer = askPrey ? prey : predator;
    return numberProblem({
      prompt: t(
        `Both species are harvested in the model $x' = ${poly([a, "x"], [-b, "xy"])} - ${poly([e, "x"])}$, $y' = ${poly([-c, "y"], [d, "xy"])} - ${poly([e, "y"])}$, with prey $x$ and predators $y$. Find the ${askPrey ? "prey" : "predator"} population at the coexistence equilibrium.`,
        `在模型 $x' = ${poly([a, "x"], [-b, "xy"])} - ${poly([e, "x"])}$，$y' = ${poly([-c, "y"], [d, "xy"])} - ${poly([e, "y"])}$ 中，两个物种都被捕捞，$x$ 是猎物，$y$ 是捕食者。求共存平衡点处${askPrey ? "猎物" : "捕食者"}的数量。`,
      ),
      answer,
      mistakes: (askPrey
        ? [
            why(
              Q.of(c, d),
              "That leaves out the harvesting of the predators, which raises their death rate to $c + e$.",
              "这漏掉了对捕食者的捕捞，它使捕食者死亡率升为 $c + e$。",
            ),
            why(
              Q.of(c - e, d),
              "Harvesting adds to the predator death rate; it does not subtract from it.",
              "捕捞是增加捕食者的死亡率，而不是减少它。",
            ),
            why(predator, "That is the predator population at the equilibrium.", "这是平衡点处的捕食者数量。"),
          ]
        : [
            why(
              Q.of(a, b),
              "That leaves out the harvesting of the prey, which lowers their growth rate to $a - e$.",
              "这漏掉了对猎物的捕捞，它使猎物增长率降为 $a - e$。",
            ),
            why(
              Q.of(a + e, b),
              "Harvesting subtracts from the prey growth rate; it does not add to it.",
              "捕捞是减少猎物的增长率，而不是增加它。",
            ),
            why(prey, "That is the prey population at the equilibrium.", "这是平衡点处的猎物数量。"),
          ]
      ).filter((m, i, all) => {
        const q = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
        return !q(m.value).eq(answer) && all.findIndex((n) => q(n.value).eq(q(m.value))) === i;
      }),
      solution: walked(
        [
          labelled(
            ["Combine the rates", "合并速率"],
            "Harvesting subtracts $e$ from each per capita rate.",
            "捕捞使每个人均速率都减去 $e$。",
            `x' = ${poly([a - e, "x"], [-b, "xy"])}, \\qquad y' = ${poly([-(c + e), "y"], [d, "xy"])}`,
          ),
          labelled(
            ["Divide by $x$ and $y$", "除以 $x$ 与 $y$"],
            "At coexistence both populations are nonzero.",
            "共存时两个种群都不为零。",
            `${a - e} = ${poly([b, "y"])}, \\qquad ${c + e} = ${poly([d, "x"])}`,
          ),
          labelled(
            ["Solve", "求解"],
            "",
            "",
            askPrey ? `x_* = ${c + e} \\div ${d} = ${prey.toLatex()}` : `y_* = ${a - e} \\div ${b} = ${predator.toLatex()}`,
          ),
        ],
        t(
          `At $\\left(${prey.toLatex()}, ${predator.toLatex()}\\right)$: $${a - e} - ${b} \\cdot ${predator.toLatex()} = 0$ and $-${c + e} + ${d} \\cdot ${prey.toLatex()} = 0$. Without harvesting the equilibrium would be $\\left(${Q.of(c, d).toLatex()}, ${Q.of(a, b).toLatex()}\\right)$, so the prey rose and the predators fell.`,
          `在 $\\left(${prey.toLatex()}, ${predator.toLatex()}\\right)$ 处：$${a - e} - ${b} \\cdot ${predator.toLatex()} = 0$，$-${c + e} + ${d} \\cdot ${prey.toLatex()} = 0$。不捕捞时平衡点是 $\\left(${Q.of(c, d).toLatex()}, ${Q.of(a, b).toLatex()}\\right)$，所以猎物增加、捕食者减少。`,
        ),
      ),
    });
  },
};

const radiusOfConvergence: KnowledgePointDef = {
  id: "the-guaranteed-radius-of-convergence",
  title: t("The guaranteed radius of convergence", "有保证的收敛半径"),
  explanation: t(
    "For $P(x)y'' + Q(x)y' + R(x)y = 0$ with polynomial coefficients, the singular points are the zeros of $P$. A power series solution about an ordinary point $x_0$ converges at least out to the nearest singular point. Complex zeros count too, so the distance must be measured in the complex plane.\n\n> **Watch out.** A complex zero of $P$ limits the radius even when $P$ has no real zero. For $(x^{2} + 16)y'' + y = 0$ about $x = 3$, the zeros $\\pm 4i$ lie at distance $\\sqrt{3^{2} + 4^{2}} = 5$, so the guaranteed radius is $5$, not unlimited.",
    "对多项式系数方程 $P(x)y'' + Q(x)y' + R(x)y = 0$，奇点就是 $P$ 的零点。在常点 $x_0$ 处的幂级数解至少收敛到最近的奇点。复零点也算在内，所以距离要在复平面上度量。\n\n> **注意。** 即使 $P$ 没有实零点，它的复零点也会限制半径。对 $(x^{2} + 16)y'' + y = 0$，以 $x = 3$ 为中心，零点 $\\pm 4i$ 的距离为 $\\sqrt{3^{2} + 4^{2}} = 5$，所以保证的半径是 $5$，而不是无限大。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const complex = rng.pick([true, false]);
    const rest = poly([1, "y'"], [k, "y"]);
    if (complex) {
      const [leg, q, hyp] = rng.pick([
        [3, 4, 5],
        [4, 3, 5],
        [6, 8, 10],
        [8, 6, 10],
        [5, 12, 13],
        [12, 5, 13],
      ] as const);
      const x0 = rng.pick([leg, -leg]);
      return explainedNumber(
        [
          `A power series solution of $(${poly([1, "x^2"], [q * q, ""])})y'' + ${rest} = 0$ is centered at $x = ${x0}$. How large a radius of convergence does the ordinary-point theorem guarantee?`,
          `$(${poly([1, "x^2"], [q * q, ""])})y'' + ${rest} = 0$ 的幂级数解以 $x = ${x0}$ 为中心。常点定理保证的收敛半径是多少？`,
        ],
        hyp,
        [
          labelled(
            ["Find the singular points", "找出奇点"],
            "They are the zeros of the leading coefficient, complex ones included:",
            "奇点是首项系数的零点，包括复零点：",
            `${poly([1, "x^2"], [q * q, ""])} = 0 \\iff x = \\pm ${q}i`,
          ),
          labelled(
            ["Measure from the center", "从中心量距离"],
            "",
            "",
            `|${x0} - ${q}i| = \\sqrt{${inParens(x0)}^{2} + ${q}^{2}} = \\sqrt{${leg * leg + q * q}} = ${hyp}`,
          ),
        ],
        [
          `The two points $\\pm ${q}i$ are mirror images across the real axis, so both lie at the same distance $${hyp}$, and $${hyp}^{2} = ${hyp * hyp} = ${leg * leg} + ${q * q}$.`,
          `两点 $\\pm ${q}i$ 关于实轴对称，所以到中心的距离都是 $${hyp}$，而 $${hyp}^{2} = ${hyp * hyp} = ${leg * leg} + ${q * q}$。`,
        ],
        [
          [
            leg,
            `That is the distance from the center to $0$; the singular points lie off the real axis, at $\\pm ${q}i$.`,
            `这是中心到 $0$ 的距离；奇点不在实轴上，而在 $\\pm ${q}i$。`,
          ],
          [
            q,
            "That is the distance from $0$ to the singular points, not from the center.",
            "这是 $0$ 到奇点的距离，而不是中心到奇点的距离。",
          ],
          [leg + q, "That adds the two legs; the distance is the hypotenuse.", "这把两条直角边相加了；距离是斜边。"],
        ],
        "integer",
      );
    }
    const a = nonzero(rng, 9);
    const b = different(rng, -9, 9, a);
    const others = [...Array(21).keys()].map((i) => i - 10).filter((i) => i !== a && i !== b);
    const x0 = rng.pick(others);
    const first = Math.abs(x0 - a);
    const second = Math.abs(x0 - b);
    const answer = Math.min(first, second);
    const product = b === 0 ? `x(${shifted(a)})` : `(${shifted(a)})(${shifted(b)})`;
    const near = first <= second ? a : b;
    const far = first <= second ? b : a;
    const ends =
      first === second ? "both singular points at its ends" : `the singular point $x = ${near}$ at one end and leaves out $x = ${far}$`;
    const endsZh = first === second ? "两端恰好是两个奇点" : `一端恰好是奇点 $x = ${near}$，且不含 $x = ${far}$`;
    return explainedNumber(
      [
        `A power series solution of $${product}y'' + ${rest} = 0$ is centered at $x = ${x0}$. How large a radius of convergence does the ordinary-point theorem guarantee?`,
        `$${product}y'' + ${rest} = 0$ 的幂级数解以 $x = ${x0}$ 为中心。常点定理保证的收敛半径是多少？`,
      ],
      answer,
      [
        labelled(
          ["Find the singular points", "找出奇点"],
          "They are the zeros of the coefficient of $y''$:",
          "奇点是 $y''$ 的系数的零点：",
          `${product} = 0 \\iff x = ${a} \\text{ or } x = ${b}`,
        ),
        labelled(
          ["Measure from the center", "从中心量距离"],
          "",
          "",
          `|${x0} - ${inParens(a)}| = ${first}, \\qquad |${x0} - ${inParens(b)}| = ${second}`,
        ),
        labelled(["Take the nearer one", "取较近的一个"], "", "", `R = \\min(${first}, ${second}) = ${answer}`),
      ],
      [
        `The interval $(${x0 - answer}, ${x0 + answer})$ reaches ${ends}, so no singular point lies inside it.`,
        `区间 $(${x0 - answer}, ${x0 + answer})$ ${endsZh}，所以区间内部没有奇点。`,
      ],
      [
        [
          Math.max(first, second),
          "That is the distance to the farther singular point; the nearer one stops the series.",
          "这是到较远奇点的距离；较近的奇点就会限制级数。",
        ],
        [
          Math.abs(x0),
          "That is the distance to $0$, which is not where the coefficient vanishes.",
          "这是到 $0$ 的距离，而系数并不在那里为零。",
        ],
        [
          Math.abs(a - b),
          "That is the distance between the two singular points, not from the center.",
          "这是两个奇点之间的距离，而不是到中心的距离。",
        ],
        [first + second, "That adds the two distances; the radius is the smaller one.", "这把两个距离相加了；半径是较小的那个。"],
      ],
      "integer",
    );
  },
};

const rateWithChangingVolume: KnowledgePointDef = {
  id: "the-rate-when-the-volume-changes",
  title: t("The rate when the volume changes", "体积变化时的变化率"),
  explanation: t(
    "In a mixture problem the amount of solute changes at the rate in minus the rate out. The rate in is the inflow concentration times the inflow rate. The rate out uses the current concentration, $\\frac{Q}{V(t)}$. If inflow and outflow differ, the volume $V(t)$ changes linearly with time, so the volume at that moment must be found first.\n\n> **Watch out.** Use the volume at that moment, not the starting volume, and the outflow rate, not the inflow rate. A tank that starts at $100$ L, gains $2$ L/min and drains at $3$ L/min holds $120$ L at $t = 10$; with $60$ g of solute the rate out is $3 \\cdot \\frac{60}{120} = 1.5$ g/min, not $3 \\cdot \\frac{60}{100} = 1.8$ g/min.",
    "在混合问题中，溶质量的变化率等于流入率减去流出率。流入率是流入浓度乘以流入速度。流出率要用当前浓度 $\\frac{Q}{V(t)}$。如果流入和流出的速度不同，体积 $V(t)$ 随时间线性变化，所以必须先求出那一时刻的体积。\n\n> **注意。** 要用那一时刻的体积而不是初始体积，要用流出速度而不是流入速度。开始时 $100$ L、每分钟净增 $2$ L、以 $3$ L/min 流出的水箱，在 $t = 10$ 时有 $120$ L；若含溶质 $60$ g，流出率为 $3 \\cdot \\frac{60}{120} = 1.5$ g/min，不是 $3 \\cdot \\frac{60}{100} = 1.8$ g/min。",
  ),
  generate(rng) {
    const start = 50 * rng.int(2, 10);
    const out = rng.int(2, 8);
    const into = out + rng.int(1, 4);
    const c = rng.int(1, 9);
    const T = 5 * rng.int(1, 6);
    const S = 10 * rng.int(5, 30);
    const V = start + (into - out) * T;
    const inflow = c * into;
    const rateOut = Q.of(out * S, V);
    const answer = Q.of(inflow).sub(rateOut);
    return explainedNumber(
      [
        `A tank starts with $${start}$ liters. A solution of concentration $${c}\\text{ g/L}$ flows in at $${into}\\text{ L/min}$, and the mixture drains at $${out}\\text{ L/min}$. At $t = ${T}$ minutes it holds $${S}$ grams of solute. How fast is the solute changing then, in $\\text{g/min}$? Give a negative number if it is falling.`,
        `水箱开始时有 $${start}$ 升液体。浓度为 $${c}\\text{ g/L}$ 的溶液以 $${into}\\text{ L/min}$ 流入，混合液以 $${out}\\text{ L/min}$ 流出。在 $t = ${T}$ 分钟时，水箱中有 $${S}$ 克溶质。此时溶质的变化率是多少 $\\text{g/min}$？如果在减少，答案取负数。`,
      ],
      answer,
      [
        labelled(["Find the volume then", "求那时的体积"], "", "", `V(${T}) = ${start} + (${into} - ${out}) \\cdot ${T} = ${V}`),
        labelled(
          ["Rate in minus rate out", "流入率减流出率"],
          "",
          "",
          `${c} \\cdot ${into} - ${out} \\cdot \\frac{${S}}{${V}} = ${inflow} - ${rateOut.toLatex()} = ${answer.toLatex()}`,
        ),
      ],
      [
        `The tank's concentration $\\frac{${S}}{${V}}$ g/L is ${answer.sign() > 0 ? "below" : answer.sign() < 0 ? "above" : "equal to"} the incoming $${c}$ g/L, so the solute is ${answer.sign() > 0 ? "rising" : answer.sign() < 0 ? "falling" : "steady"}, as the sign of $${answer.toLatex()}$ says.`,
        `水箱浓度 $\\frac{${S}}{${V}}$ g/L ${answer.sign() > 0 ? "低于" : answer.sign() < 0 ? "高于" : "等于"}流入的 $${c}$ g/L，所以溶质${answer.sign() > 0 ? "在增加" : answer.sign() < 0 ? "在减少" : "不变"}，与 $${answer.toLatex()}$ 的符号一致。`,
      ],
      [
        [
          Q.of(inflow).sub(Q.of(out * S, start)),
          "That uses the starting volume; the volume has changed by then.",
          "这用了初始体积；那时体积已经变了。",
        ],
        [
          Q.of(inflow).sub(Q.of(into * S, V)),
          "That drains the mixture at the inflow rate instead of the outflow rate.",
          "这按流入速度计算流出，应该用流出速度。",
        ],
        [inflow, "That counts only the rate in and forgets the solute leaving.", "这只算了流入率，忘了流出的溶质。"],
      ],
    );
  },
};

const constantBernoulliSolution: KnowledgePointDef = {
  id: "the-nonzero-constant-solution-of-a-bernoulli-equation",
  title: t("The constant solution of a Bernoulli equation", "伯努利方程的常数解"),
  explanation: t(
    "With constant coefficients, $y' + py = qy^n$ is autonomous, so its constant solutions come from setting $y' = 0$. Besides $y = 0$, this gives $y^{n-1} = \\frac{p}{q}$. No substitution is needed. In the linear equation for $v = y^{1-n}$, the same value appears as the equilibrium, which is why solutions may level off there. For $y' + 18y = 2y^{3}$, $y^{2} = 9$, so the positive constant solution is $y = 3$.\n\n> **Watch out.** $\\frac{p}{q}$ is $y^{n-1}$, not $y$: take the $(n - 1)$-th root at the end. For $n = 2$ the two are the same, but for $n = 3$ the ratio $9$ gives $y = 3$.",
    "系数为常数时，$y' + py = qy^n$ 是自治方程，所以令 $y' = 0$ 就得到它的常数解。除了 $y = 0$，还有 $y^{n-1} = \\frac{p}{q}$。这不需要任何代换。在关于 $v = y^{1-n}$ 的线性方程中，同一个值表现为平衡解，所以解可能在那里趋于平稳。对 $y' + 18y = 2y^{3}$，$y^{2} = 9$，所以正常数解是 $y = 3$。\n\n> **注意。** $\\frac{p}{q}$ 是 $y^{n-1}$ 而不是 $y$：最后要开 $n - 1$ 次方。$n = 2$ 时两者相同，但 $n = 3$ 时比值 $9$ 给出 $y = 3$。",
  ),
  generate(rng) {
    const answer = rng.int(2, 6);
    const q = rng.int(1, 5);
    const n = rng.int(2, 4);
    const ratio = answer ** (n - 1);
    const p = q * ratio;
    const left = n === 2 ? "y" : `y^{${n - 1}}`;
    return explainedNumber(
      [
        `Find the positive constant solution of $y' + ${poly([p, "y"])} = ${poly([q, `y^{${n}}`])}$.`,
        `求 $y' + ${poly([p, "y"])} = ${poly([q, `y^{${n}}`])}$ 的正常数解。`,
      ],
      answer,
      [
        labelled(
          ["Set the derivative to zero", "令导数为零"],
          "A constant solution has $y' = 0$, so",
          "常数解满足 $y' = 0$，所以",
          `${poly([p, "y"])} = ${poly([q, `y^{${n}}`])}`,
        ),
        labelled(
          ["Solve for the nonzero value", "解出非零值"],
          `Dividing by $${poly([q, "y"])}$ gives $${left} = ${ratio}$, so the positive solution is $y = ${answer}$.`,
          `两边除以 $${poly([q, "y"])}$，得 $${left} = ${ratio}$，所以正解是 $y = ${answer}$。`,
        ),
      ],
      [
        `At $y = ${answer}$: $${p} \\cdot ${answer} = ${p * answer}$ and $${q === 1 ? "" : `${q} \\cdot `}${answer}^{${n}} = ${q * answer ** n}$, so the two sides agree and $y' = 0$.`,
        `当 $y = ${answer}$ 时：$${p} \\cdot ${answer} = ${p * answer}$，$${q === 1 ? "" : `${q} \\cdot `}${answer}^{${n}} = ${q * answer ** n}$，两边相等，$y' = 0$。`,
      ],
      [
        ...(n > 2
          ? [
              [
                ratio,
                `That is $y^{${n - 1}}$; take the root of order $${n - 1}$ to get $y$.`,
                `这是 $y^{${n - 1}}$；要开 $${n - 1}$ 次方才得到 $y$。`,
              ] as const,
            ]
          : []),
        [p, `That is the coefficient $${p}$ itself; divide it by $${q}$ first.`, `这是系数 $${p}$ 本身；要先除以 $${q}$。`],
        [
          q,
          `That is the coefficient of $y^{${n}}$; the constant solution comes from $p$ divided by $q$.`,
          `这是 $y^{${n}}$ 的系数；常数解来自 $p$ 除以 $q$。`,
        ],
        [n, "That is the exponent; the constant solution comes from the coefficients.", "这是指数；常数解来自系数。"],
        [
          Q.of(q, p),
          `That inverts the ratio; $${left} = \\frac{p}{q}$, not $\\frac{q}{p}$.`,
          `这是把比值颠倒了；$${left} = \\frac{p}{q}$，不是 $\\frac{q}{p}$。`,
        ],
      ],
    );
  },
};

const clairautLinesThroughPoint: KnowledgePointDef = {
  id: "the-solution-lines-through-a-point",
  figure: differentialEquationsDrawings1["clairaut-differential-equations#the-solution-lines-through-a-point"],
  title: t("The solution lines through a point", "过一点的解直线"),
  explanation: t(
    "The general solutions of Clairaut's equation $y = xy' + (y')^2$ are the lines $y = cx + c^2$. To find those through a given point, substitute its coordinates and solve the resulting quadratic in $c$. A point below the singular parabola $y = -\\frac{x^2}{4}$ gets no line, one on it gets one, and one above it gets two. Through $(-1, 6)$: $c^{2} - c - 6 = 0$, so $c = -2$ or $c = 3$.\n\n> **Watch out.** The point lies on $y = cx + c^{2}$ when $c^{2} + x_{0}c - y_{0} = 0$, with $y_{0}$ moved across with a minus sign; the roots are slopes, so neither coordinate of the point is an answer.",
    "克莱罗方程 $y = xy' + (y')^2$ 的通解是直线 $y = cx + c^2$。要找过给定点的直线，就代入该点的坐标，解关于 $c$ 的二次方程。奇解抛物线 $y = -\\frac{x^2}{4}$ 下方的点没有这样的直线，线上的点有一条，上方的点有两条。过 $(-1, 6)$：$c^{2} - c - 6 = 0$，所以 $c = -2$ 或 $c = 3$。\n\n> **注意。** 点在 $y = cx + c^{2}$ 上当且仅当 $c^{2} + x_{0}c - y_{0} = 0$，$y_{0}$ 移项后带负号；根是斜率，所以点的两个坐标都不是答案。",
  ),
  generate(rng) {
    const u = rng.int(-6, 6);
    const w = different(rng, -6, 6, u);
    const small = Math.min(u, w);
    const large = Math.max(u, w);
    const x0 = -(small + large);
    const y0 = -small * large;
    const quad = poly([1, "c^2"], [x0, "c"], [-y0, ""]);
    return explainedNumber(
      [
        `Two solution lines of $y = xy' + (y')^2$ pass through the point $(${x0}, ${y0})$. Find the larger of their slopes.`,
        `$y = xy' + (y')^2$ 有两条解直线经过点 $(${x0}, ${y0})$。求它们中较大的斜率。`,
      ],
      large,
      [
        labelled(
          ["Substitute the point", "代入该点"],
          `The solution lines are $y = cx + c^{2}$. Putting in $x = ${x0}$, $y = ${y0}$:`,
          `解直线是 $y = cx + c^{2}$。代入 $x = ${x0}$、$y = ${y0}$：`,
          `${y0} = ${inParens(x0)}c + c^{2}`,
          `${quad} = 0`,
        ),
        labelled(
          ["Solve the quadratic", "解二次方程"],
          `The roots are $c = ${small}$ and $c = ${large}$, so the larger slope is $${large}$.`,
          `根是 $c = ${small}$ 和 $c = ${large}$，所以较大的斜率是 $${large}$。`,
        ),
      ],
      [
        `$${large} \\cdot ${inParens(x0)} + ${inParens(large)}^{2} = ${large * x0} + ${large * large} = ${y0}$, so the line with slope $${large}$ does pass through the point.`,
        `$${large} \\cdot ${inParens(x0)} + ${inParens(large)}^{2} = ${large * x0} + ${large * large} = ${y0}$，所以斜率为 $${large}$ 的直线确实经过该点。`,
      ],
      [
        [small, "That is the smaller of the two slopes.", "这是两个斜率中较小的一个。"],
        [
          x0,
          "That is the $x$-coordinate of the point; the slopes are the roots of the quadratic in $c$.",
          "这是点的 $x$ 坐标；斜率是关于 $c$ 的二次方程的根。",
        ],
        [
          y0,
          "That is the $y$-coordinate of the point; the slopes are the roots of the quadratic in $c$.",
          "这是点的 $y$ 坐标；斜率是关于 $c$ 的二次方程的根。",
        ],
        [
          -large,
          "The sign is flipped; read each root of the quadratic with its own sign.",
          "符号反了；二次方程的每个根要按各自的符号读出。",
        ],
      ],
      "integer",
    );
  },
};

const limitFromThreeReadings: KnowledgePointDef = {
  id: "the-limit-from-three-readings",
  title: t("The limit from three readings", "由三次读数求极限值"),
  explanation: t(
    "Under inhibited growth $y' = k(M - y)$, the distance to the limit $M$ shrinks by a fixed factor over each equal time interval. So the increases between equally spaced readings form a geometric sequence. Their ratio gives that factor, and summing the increases still to come gives $M$, without ever finding $k$.\n\n> **Watch out.** Add all the increases still to come, not just the next one. For readings $60$, $80$, $90$ the increases halve, so the rest add up to $5 + 2.5 + \\cdots = 10$ and $M = 100$, not $90 + 5 = 95$.",
    "在抑制增长 $y' = k(M - y)$ 中，到极限 $M$ 的距离在每段相等的时间内都缩小相同的倍数。所以等间隔读数之间的增量构成等比数列。增量之比就是这个倍数，把以后的增量全部加起来就得到 $M$，完全不需要求 $k$。\n\n> **注意。** 要把以后的增量全部加起来，而不只是下一个。读数为 $60$、$80$、$90$ 时增量每次减半，以后的增量之和为 $5 + 2.5 + \\cdots = 10$，所以 $M = 100$，不是 $90 + 5 = 95$。",
  ),
  generate(rng) {
    const M = 150 + 10 * rng.int(0, 15);
    const shrink = rng.pick([2, 3]);
    const D = 36 * rng.int(1, 3);
    const T = rng.int(1, 5);
    const first = M - D;
    const second = M - D / shrink;
    const third = M - D / (shrink * shrink);
    const gap1 = second - first;
    const gap2 = third - second;
    const left = Q.of(gap2, shrink - 1);
    return explainedNumber(
      [
        `A quantity grows according to $y' = k(M - y)$. It equals $${first}$ at $t = ${T}$, $${second}$ at $t = ${2 * T}$ and $${third}$ at $t = ${3 * T}$. Find the limit $M$.`,
        `某个量按 $y' = k(M - y)$ 增长。它在 $t = ${T}$ 时等于 $${first}$，在 $t = ${2 * T}$ 时等于 $${second}$，在 $t = ${3 * T}$ 时等于 $${third}$。求极限 $M$。`,
      ],
      M,
      [
        labelled(
          ["Find the factor", "求倍数"],
          "Compare the two increases.",
          "比较两个增量。",
          `${second} - ${first} = ${gap1}, \\qquad ${third} - ${second} = ${gap2}, \\qquad \\frac{${gap2}}{${gap1}} = \\frac{1}{${shrink}}`,
        ),
        labelled(
          ["Sum the increases to come", "把以后的增量加起来"],
          "",
          "",
          `${gap2}\\left(\\frac{1}{${shrink}} + \\frac{1}{${shrink * shrink}} + \\cdots\\right) = ${shrink === 2 ? "" : `\\frac{${gap2}}{${shrink - 1}} = `}${left.toLatex()}`,
          `M = ${third} + ${left.toLatex()} = ${M}`,
        ),
      ],
      [
        `The distances to $${M}$ are $${M - first}$, $${M - second}$ and $${M - third}$, each $\\frac{1}{${shrink}}$ of the one before, as the model requires.`,
        `到 $${M}$ 的距离为 $${M - first}$、$${M - second}$、$${M - third}$，每个都是前一个的 $\\frac{1}{${shrink}}$，符合模型。`,
      ],
      [
        [
          third + gap2,
          "That adds only one more increase of the same size; the increases keep shrinking but never stop.",
          "这只加了一个同样大小的增量；增量不断缩小但不会停止。",
        ],
        [third + gap1, "That adds the first increase again; the increases shrink.", "这又加了一次第一个增量；增量在缩小。"],
        [third, "That takes the last reading as the limit; the quantity is still growing.", "这把最后一次读数当作极限；该量仍在增长。"],
      ],
      "integer",
    );
  },
};

// ---------------------------------------------------------------------------
// Third pass
// ---------------------------------------------------------------------------

/** signedPower writes a power of a variable, leaving out an exponent of one. */
const signedPower = (name: string, n: number) => (n === 1 ? name : `${name}^{${n}}`);
/** exponentOf writes the exponent c times the variable given, leaving out a coefficient of size one. */
const exponentOf = (c: number, name: string) => (c === 1 ? name : c === -1 ? `-${name}` : `${c}${name}`);

const blowUpTime: KnowledgePointDef = {
  id: "the-time-a-separable-solution-blows-up",
  title: t("The time a separable solution blows up", "可分离方程的解爆破的时间"),
  explanation: t(
    "A nonlinear equation can have a solution that stops existing, even though its right side is perfectly smooth. Separating $y' = ky^2$ gives $-\\frac{1}{y} = kt + C$, so $y$ is a constant divided by an expression that falls to zero at a finite time. As $t$ approaches that time, $y$ grows without bound, and the solution has no continuation past it. Nothing in the formula for the equation itself warns of this time; it depends on the initial value. For $y' = y^{2}$ with $y(0) = 2$: $\\frac{1}{y} = \\frac{1}{2} - t$, which reaches zero at $t = \\frac{1}{2}$.\n\nCheck: $y = \\frac{2}{1 - 2t}$ has $y' = \\frac{4}{(1 - 2t)^{2}} = y^{2}$ and $y(0) = 2$, and its denominator vanishes at $t = \\frac{1}{2}$.\n\n> **Watch out.** The larger the initial value, the sooner the solution blows up: the time is $\\frac{1}{k\\,y(0)}$, not $\\frac{1}{k}$.",
    "即使右边完全光滑，非线性方程的解也可能不再存在。分离 $y' = ky^2$ 得 $-\\frac{1}{y} = kt + C$，所以 $y$ 是一个常数除以在有限时刻降到零的式子。当 $t$ 趋近这个时刻，$y$ 无限增大，解无法延续到它之后。方程本身的公式并不提示这个时刻，它取决于初值。对 $y' = y^{2}$，$y(0) = 2$：$\\frac{1}{y} = \\frac{1}{2} - t$，在 $t = \\frac{1}{2}$ 时变为零。\n\n检验：$y = \\frac{2}{1 - 2t}$ 满足 $y' = \\frac{4}{(1 - 2t)^{2}} = y^{2}$ 和 $y(0) = 2$，它的分母在 $t = \\frac{1}{2}$ 时为零。\n\n> **注意。** 初值越大，解爆破得越早：这个时刻是 $\\frac{1}{k\\,y(0)}$，而不是 $\\frac{1}{k}$。",
  ),
  generate(rng) {
    const k = rng.int(1, 6);
    const a = rng.int(1, 6);
    const answer = Q.of(1, k * a);
    const kk = k === 1 ? "" : `${k}`;
    const ka = k * a === 1 ? "" : `${k * a}`;
    return explainedNumber(
      [
        `The solution of $y' = ${kk}y^2$, $y(0) = ${a}$, grows without bound as $t$ approaches a time $T > 0$. Find $T$.`,
        `$y' = ${kk}y^2$，$y(0) = ${a}$ 的解在 $t$ 趋近某时刻 $T > 0$ 时无限增大。求 $T$。`,
      ],
      answer,
      [
        labelled(
          ["Separate and integrate", "分离变量并积分"],
          `Divide by $y^{2}$ and integrate, then put in $y(0) = ${a}$:`,
          `两边除以 $y^{2}$ 再积分，然后代入 $y(0) = ${a}$：`,
          `-\\frac{1}{y} = ${kk}t + C, \\quad C = -${Q.of(1, a).toLatex()}`,
          `\\frac{1}{y} = ${Q.of(1, a).toLatex()} - ${kk}t`,
        ),
        labelled(
          ["Find where it fails", "找出解失效的时刻"],
          "$y$ grows without bound where $\\frac{1}{y}$ reaches zero:",
          "$\\frac{1}{y}$ 变为零时 $y$ 无限增大：",
          `${Q.of(1, a).toLatex()} - ${kk}t = 0 \\quad\\Rightarrow\\quad T = ${answer.toLatex()}`,
        ),
      ],
      [
        `Substitute back $y = \\frac{${a}}{1 - ${ka}t}$: $y' = \\frac{${k * a * a}}{(1 - ${ka}t)^{2}} = ${kk}y^{2}$, the equation, and $y(0) = ${a}$. Its denominator is zero at $t = ${answer.toLatex()}$.`,
        `代回检验 $y = \\frac{${a}}{1 - ${ka}t}$：$y' = \\frac{${k * a * a}}{(1 - ${ka}t)^{2}} = ${kk}y^{2}$，正是原方程，且 $y(0) = ${a}$。它的分母在 $t = ${answer.toLatex()}$ 时为零。`,
      ],
      [
        [Q.of(k * a), "This is upside down: $T = \\frac{1}{k\\,y(0)}$", "颠倒了：$T = \\frac{1}{k\\,y(0)}$"],
        [
          Q.of(1, k),
          `This leaves out the initial value; starting at $${a}$ makes $\\frac{1}{y}$ start at $${Q.of(1, a).toLatex()}$`,
          `这里漏掉了初值；从 $${a}$ 出发，$\\frac{1}{y}$ 的初值是 $${Q.of(1, a).toLatex()}$`,
        ],
        [
          Q.of(1, a),
          `This leaves out $k = ${k}$, the rate at which $\\frac{1}{y}$ falls`,
          `这里漏掉了 $k = ${k}$，即 $\\frac{1}{y}$ 下降的速率`,
        ],
        [Q.of(2, k * a), "Integrating $y^{-2}$ gives $-y^{-1}$, with no factor of $2$", "$y^{-2}$ 的积分是 $-y^{-1}$，没有因子 $2$"],
        [answer.neg(), "The solution grows forward in time, so the blow-up time is positive", "解随时间向前增长，所以爆破时刻是正的"],
      ],
    );
  },
};

const constantSolutionValue: KnowledgePointDef = {
  id: "the-initial-value-that-gives-a-constant-solution",
  title: t("The initial value that gives a constant solution", "得到常数解的初值"),
  explanation: t(
    "The general solution of $y' = py + q$ is a particular solution plus $Ce^{pt}$. Among all these solutions, exactly one has $C = 0$, and it is a constant. A constant has zero derivative, so setting $py + q = 0$ finds it at once, without any integration. Starting at this value, nothing ever changes. Starting anywhere else, the solution moves away from it or towards it depending on the sign of $p$. For $y' = 2y - 6$, $2y - 6 = 0$ gives the constant solution $y = 3$.\n\n> **Watch out.** Solve $py + q = 0$ for $y$: move $q$ across with its sign changed and then divide by $p$, so $y = -\\frac{q}{p}$, not $\\frac{q}{p}$ and not $-q$.",
    "$y' = py + q$ 的通解是一个特解加上 $Ce^{pt}$。在所有这些解中，恰有一个 $C = 0$，它是常数。常数的导数为零，所以令 $py + q = 0$ 就立刻求出它，不必积分。从这个值出发，什么都不会改变。从其他值出发，解会离开它或趋向它，取决于 $p$ 的符号。对 $y' = 2y - 6$，由 $2y - 6 = 0$ 得常数解 $y = 3$。\n\n> **注意。** 由 $py + q = 0$ 解出 $y$：$q$ 移项要变号，再除以 $p$，所以 $y = -\\frac{q}{p}$，不是 $\\frac{q}{p}$，也不是 $-q$。",
  ),
  generate(rng) {
    const p = nonzero(rng, 9);
    const q = nonzero(rng, 12);
    const answer = Q.of(-q, p);
    const right = poly([p, "y"], [q, ""]);
    return explainedNumber(
      [`For which value of $y(0)$ is the solution of $y' = ${right}$ constant?`, `当 $y(0)$ 取何值时，$y' = ${right}$ 的解是常数？`],
      answer,
      [
        labelled(
          ["Set the derivative to zero", "令导数为零"],
          "A constant solution has $y' = 0$, so",
          "常数解满足 $y' = 0$，所以",
          `${right} = 0`,
        ),
        labelled(
          ["Solve for y", "解出 y"],
          `So $y = ${answer.toLatex()}$, and the solution is constant exactly when it starts there.`,
          `所以 $y = ${answer.toLatex()}$，解为常数当且仅当它从这里出发。`,
        ),
      ],
      [
        `At $y = ${answer.toLatex()}$: $${p} \\cdot \\left(${answer.toLatex()}\\right) ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${-q} ${q < 0 ? "-" : "+"} ${Math.abs(q)} = 0$, so $y' = 0$ and $y$ never changes.`,
        `当 $y = ${answer.toLatex()}$ 时：$${p} \\cdot \\left(${answer.toLatex()}\\right) ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${-q} ${q < 0 ? "-" : "+"} ${Math.abs(q)} = 0$，所以 $y' = 0$，$y$ 不再变化。`,
      ],
      [
        [Q.of(q, p), "The sign is flipped; moving $q$ across changes its sign.", "符号反了；$q$ 移项要变号。"],
        [Q.of(p, q), "That inverts the fraction; divide by the coefficient of $y$.", "这是把分数颠倒了；要除以 $y$ 的系数。"],
        [Q.of(-q), `That forgets to divide by $${p}$, the coefficient of $y$.`, `这里忘了除以 $y$ 的系数 $${p}$。`],
        [
          Q.of(0),
          "That is where $y$ itself is zero; the constant solution is where $y'$ is zero.",
          "这是 $y$ 本身为零的地方；常数解是 $y'$ 为零的地方。",
        ],
      ],
    );
  },
};

const noTransientExponential: KnowledgePointDef = {
  id: "the-initial-value-with-no-transient-under-exponential-forcing",
  title: t("The initial value with no transient under exponential forcing", "指数强迫下没有瞬态项的初值"),
  explanation: t(
    "The solutions of a forced linear equation differ from each other only by a multiple of the homogeneous solution, which is the transient. The initial value decides that multiple. So a solution with no transient is the particular solution alone, and its value at $t = 0$ is just the coefficient found by undetermined coefficients. Any other starting value adds a term $Ce^{-at}$, in addition to the response to the forcing. For $y' + 3y = 10e^{2t}$, $A(2 + 3) = 10$ gives $A = 2$, so $y(0) = 2$.\n\n> **Watch out.** Differentiating $Ae^{ct}$ brings down $c$, so the coefficient is $\\frac{b}{c + a}$: leaving out $c$ or $a$, or writing $a - c$, gives a different starting value.",
    "受迫线性方程的解之间只差齐次解的一个倍数，这就是瞬态项。初值决定这个倍数。所以没有瞬态项的解就是特解本身，它在 $t = 0$ 的值就是待定系数法求出的系数。任何其他初值都会在受迫响应之外增加一项 $Ce^{-at}$。对 $y' + 3y = 10e^{2t}$，由 $A(2 + 3) = 10$ 得 $A = 2$，所以 $y(0) = 2$。\n\n> **注意。** 对 $Ae^{ct}$ 求导会带下 $c$，所以系数是 $\\frac{b}{c + a}$：漏掉 $c$ 或 $a$，或写成 $a - c$，都会得到不同的初值。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const c = different(rng, -6, 6, -a) || a + 1;
    const b = rng.int(2, 12);
    const answer = Q.of(b, a + c);
    const ect = `e^{${exponentOf(c, "t")}}`;
    const cA = c === 1 ? "" : c === -1 ? "-" : `${c}`;
    const al = answer.toLatex();
    const Aect = `${al === "1" ? "" : al === "-1" ? "-" : al}${ect}`;
    return explainedNumber(
      [
        `Find the value of $y(0)$ for which the solution of $${poly([1, "y'"], [a, "y"])} = ${b}${ect}$ has no term in $e^{${exponentOf(-a, "t")}}$.`,
        `求 $y(0)$ 的值，使 $${poly([1, "y'"], [a, "y"])} = ${b}${ect}$ 的解不含 $e^{${exponentOf(-a, "t")}}$ 项。`,
      ],
      answer,
      [
        labelled(
          ["Find the particular solution", "求特解"],
          `Try $y = A${ect}$, so $y' = ${cA}A${ect}$ and`,
          `设 $y = A${ect}$，则 $y' = ${cA}A${ect}$，于是`,
          `(${c} + ${a})A = ${b}`,
          `A = ${answer.toLatex()}`,
        ),
        labelled(
          ["Remove the transient", "去掉瞬态项"],
          `Every solution is $${Aect} + Ce^{${exponentOf(-a, "t")}}$, with $y(0) = ${answer.toLatex()} + C$. No transient means $C = 0$, so $y(0) = ${answer.toLatex()}$.`,
          `每个解都是 $${Aect} + Ce^{${exponentOf(-a, "t")}}$，且 $y(0) = ${answer.toLatex()} + C$。没有瞬态项即 $C = 0$，所以 $y(0) = ${answer.toLatex()}$。`,
        ),
      ],
      [
        `$y = ${Aect}$ gives $y' + ${a}y = (${c} + ${a})\\left(${Aect}\\right) = ${b}${ect}$, the forcing.`,
        `$y = ${Aect}$ 给出 $y' + ${a}y = (${c} + ${a})\\left(${Aect}\\right) = ${b}${ect}$，正是强迫项。`,
      ],
      [
        [
          Q.of(b, a),
          `That leaves out $y' = ${cA}A${ect}$; differentiating brings down the $${c}$.`,
          `这里漏掉了 $y' = ${cA}A${ect}$；求导会带下 $${c}$。`,
        ],
        [Q.of(b, c), `That leaves out the term $${a}y$.`, `这里漏掉了 $${a}y$ 项。`],
        [
          Q.of(b),
          "That takes the coefficient of the forcing as $A$; $A$ must satisfy the equation.",
          "这是把强迫项的系数当成 $A$；$A$ 必须满足方程。",
        ],
        ...(a === c
          ? []
          : [
              [
                Q.of(b, a - c),
                `That uses $${a} - ${inParens(c)}$; the derivative adds $${cA}A$.`,
                `这里用了 $${a} - ${inParens(c)}$；导数加上的是 $${cA}A$。`,
              ] as const,
            ]),
        [
          Q.of(0),
          "Starting at $0$ does not remove the transient; $C$ is fixed by $y(0) = A + C$.",
          "从 $0$ 出发并不能去掉瞬态项；$C$ 由 $y(0) = A + C$ 确定。",
        ],
      ],
    );
  },
};

const boundedAtOrigin: KnowledgePointDef = {
  id: "the-solution-that-stays-bounded-at-the-origin",
  title: t("The solution that stays bounded at the origin", "在原点附近有界的解"),
  explanation: t(
    "A coefficient that is singular at $x = 0$ can act in place of an initial condition. For $y' + \\frac{k}{x}y = c$, the integrating factor $x^k$ gives $y = \\frac{cx}{k + 1} + Cx^{-k}$. With $k > 0$, the second term grows without bound as $x$ approaches zero unless $C = 0$. So requiring the solution to stay bounded there picks out exactly one solution from the whole family. For $y' + \\frac{2}{x}y = 6$, $y = 2x + Cx^{-2}$, and the bounded solution $y = 2x$ has $y(1) = 2$.\n\n> **Watch out.** Integrating $cx^{k}$ gives $\\frac{cx^{k + 1}}{k + 1}$, so after dividing by $x^{k}$ the denominator is $k + 1$, not $k$; and the solution is evaluated at the given $x$, not at $x = 1$.",
    "在 $x = 0$ 处奇异的系数可以起到初始条件的作用。对 $y' + \\frac{k}{x}y = c$，积分因子 $x^k$ 给出 $y = \\frac{cx}{k + 1} + Cx^{-k}$。当 $k > 0$ 时，除非 $C = 0$，否则第二项在 $x$ 趋近零时无限增大。所以要求解在那里有界，就从整个解族中选出了唯一一个解。对 $y' + \\frac{2}{x}y = 6$，$y = 2x + Cx^{-2}$，有界解 $y = 2x$ 满足 $y(1) = 2$。\n\n> **注意。** 对 $cx^{k}$ 积分得 $\\frac{cx^{k + 1}}{k + 1}$，所以除以 $x^{k}$ 后分母是 $k + 1$，不是 $k$；并且要在给定的 $x$ 处求值，而不是在 $x = 1$ 处。",
  ),
  generate(rng) {
    const k = rng.int(1, 6);
    const c = rng.int(2, 12);
    const x0 = rng.int(1, 6);
    const answer = Q.of(c * x0, k + 1);
    const xk = k === 1 ? "x" : `x^{${k}}`;
    return explainedNumber(
      [
        `A solution of $y' + \\frac{${k}}{x}y = ${c}$ on $x > 0$ stays bounded as $x \\to 0^+$. Find $y(${x0})$.`,
        `$y' + \\frac{${k}}{x}y = ${c}$ 在 $x > 0$ 上的一个解在 $x \\to 0^+$ 时有界。求 $y(${x0})$。`,
      ],
      answer,
      [
        labelled(
          ["Multiply by the integrating factor", "乘以积分因子"],
          `The integrating factor is $e^{\\int ${k}/x \\, dx} = ${xk}$, so`,
          `积分因子是 $e^{\\int ${k}/x \\, dx} = ${xk}$，所以`,
          `(${xk}y)' = ${c}${xk}`,
          `${xk}y = \\frac{${c}x^{${k + 1}}}{${k + 1}} + C`,
          `y = \\frac{${c}x}{${k + 1}} + Cx^{-${k}}`,
        ),
        labelled(
          ["Use boundedness", "利用有界性"],
          `As $x \\to 0^+$, $Cx^{-${k}}$ blows up unless $C = 0$. So $y = \\frac{${c}x}{${k + 1}}$ and $y(${x0}) = ${answer.toLatex()}$.`,
          `当 $x \\to 0^+$ 时，除非 $C = 0$，否则 $Cx^{-${k}}$ 无界。所以 $y = \\frac{${c}x}{${k + 1}}$，$y(${x0}) = ${answer.toLatex()}$。`,
        ),
      ],
      [
        `$y = \\frac{${c}x}{${k + 1}}$ gives $y' + \\frac{${k}}{x}y = \\frac{${c}}{${k + 1}} + \\frac{${c * k}}{${k + 1}} = ${c}$, and it tends to $0$ as $x \\to 0^+$.`,
        `$y = \\frac{${c}x}{${k + 1}}$ 给出 $y' + \\frac{${k}}{x}y = \\frac{${c}}{${k + 1}} + \\frac{${c * k}}{${k + 1}} = ${c}$，且当 $x \\to 0^+$ 时趋于 $0$。`,
      ],
      [
        [
          Q.of(c * x0, k),
          `That divides by $${k}$; integrating $${c}${xk}$ gives a denominator of $${k + 1}$.`,
          `这里除以了 $${k}$；对 $${c}${xk}$ 积分得到的分母是 $${k + 1}$。`,
        ],
        [
          Q.of(c * x0),
          "That takes $y = cx$; the term $\\frac{k}{x}y$ also changes the solution.",
          "这是取了 $y = cx$；$\\frac{k}{x}y$ 项也会改变解。",
        ],
        [Q.of(c, k + 1), "That is the value at $x = 1$; evaluate at the given $x$.", "这是在 $x = 1$ 处的值；要在给定的 $x$ 处求值。"],
      ],
    );
  },
};

const eulerHomogeneous: KnowledgePointDef = {
  id: "eulers-theorem-for-homogeneous-functions",
  title: t("Euler's theorem for homogeneous functions", "齐次函数的欧拉定理"),
  explanation: t(
    "A function homogeneous of degree $n$ satisfies $f(sx, sy) = s^n f(x, y)$ for all $s$. Differentiating both sides with respect to $s$ and then setting $s = 1$ gives $xf_x + yf_y = nf$. So this particular combination of partial derivatives depends only on the degree and on the value of the function at the point. Neither the formula for $f$ nor the separate partial derivatives need to be known. For $f = x^{2}y$, of degree $3$, at $(1, 2)$: $xf_x + yf_y = 1 \\cdot 4 + 2 \\cdot 1 = 6 = 3 \\cdot 2$.\n\n> **Watch out.** The factor is the degree $n$ itself, not $n - 1$ (the degree of the partial derivatives), and the value is multiplied by $n$, not added to it.",
    "$n$ 次齐次函数对所有 $s$ 满足 $f(sx, sy) = s^n f(x, y)$。两边对 $s$ 求导，再令 $s = 1$，得 $xf_x + yf_y = nf$。所以这个特定的偏导数组合只取决于次数和函数在该点的值。既不需要知道 $f$ 的公式，也不需要知道各个偏导数。对 $3$ 次的 $f = x^{2}y$，在 $(1, 2)$ 处：$xf_x + yf_y = 1 \\cdot 4 + 2 \\cdot 1 = 6 = 3 \\cdot 2$。\n\n> **注意。** 因子就是次数 $n$ 本身，而不是偏导数的次数 $n - 1$；并且函数值要乘以 $n$，而不是加上 $n$。",
  ),
  generate(rng) {
    const n = rng.int(2, 6);
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const v = nonzero(rng, 9);
    const answer = n * v;
    const ca = a === 1 ? "" : `${a}`;
    const cb = b === 1 ? "" : `${b}`;
    return explainedNumber(
      [
        `A differentiable function $f$ is homogeneous of degree ${n}, with $f(${a}, ${b}) = ${v}$. Find $${ca}f_x(${a}, ${b}) + ${cb}f_y(${a}, ${b})$.`,
        `可微函数 $f$ 是 ${n} 次齐次函数，$f(${a}, ${b}) = ${v}$。求 $${ca}f_x(${a}, ${b}) + ${cb}f_y(${a}, ${b})$。`,
      ],
      answer,
      [
        labelled(
          ["Differentiate the homogeneity relation", "对齐次关系求导"],
          "Differentiate $f(sx, sy) = s^{n}f(x, y)$ with respect to $s$ and set $s = 1$:",
          "将 $f(sx, sy) = s^{n}f(x, y)$ 对 $s$ 求导，再令 $s = 1$：",
          "xf_x(x, y) + yf_y(x, y) = nf(x, y)",
        ),
        labelled(
          ["Apply it at the point", "在该点应用"],
          `At $(${a}, ${b})$ the expression asked for is exactly $xf_x + yf_y$:`,
          `在 $(${a}, ${b})$ 处，所求的式子正是 $xf_x + yf_y$：`,
          `${ca}f_x(${a}, ${b}) + ${cb}f_y(${a}, ${b}) = ${n} \\cdot ${inParens(v)} = ${answer}`,
        ),
      ],
      [
        `The function $f = ${v === 1 ? "" : v === -1 ? "-" : v}${a === 1 ? `x^{${n}}` : `\\left(\\frac{x}{${a}}\\right)^{${n}}`}$ is homogeneous of degree ${n} with $f(${a}, ${b}) = ${v}$, and for it $${ca}f_x = ${n} \\cdot ${inParens(v)}$ while $f_y = 0$, giving $${answer}$ again.`,
        `函数 $f = ${v === 1 ? "" : v === -1 ? "-" : v}${a === 1 ? `x^{${n}}` : `\\left(\\frac{x}{${a}}\\right)^{${n}}`}$ 是 ${n} 次齐次函数，$f(${a}, ${b}) = ${v}$，对它有 $${ca}f_x = ${n} \\cdot ${inParens(v)}$，$f_y = 0$，同样得到 $${answer}$。`,
      ],
      [
        [
          v,
          `That is $f(${a}, ${b})$ itself; Euler's theorem multiplies it by the degree.`,
          `这是 $f(${a}, ${b})$ 本身；欧拉定理要把它乘以次数。`,
        ],
        [n + v, "That adds the degree to the value; Euler's theorem multiplies them.", "这是把次数加到函数值上；欧拉定理是两者相乘。"],
        [
          (n - 1) * v,
          `That uses $n - 1 = ${n - 1}$, the degree of the partial derivatives; the factor is the degree $${n}$ of $f$.`,
          `这里用了偏导数的次数 $n - 1 = ${n - 1}$；因子是 $f$ 的次数 $${n}$。`,
        ],
        [-answer, `The sign is flipped; $xf_x + yf_y = nf$ with a plus sign.`, `符号反了；$xf_x + yf_y = nf$，是正号。`],
      ],
      "integer",
    );
  },
};

const powerMakingExact: KnowledgePointDef = {
  id: "the-power-of-x-that-makes-an-equation-exact",
  title: t("The power of x that makes an equation exact", "使方程恰当的 x 的幂"),
  explanation: t(
    "To find an integrating factor of a given shape, multiply through by it and apply the test for exactness. With the factor $x^m$, the equation $ay\\,dx + bx\\,dy = 0$ has $M = ax^m y$ and $N = bx^{m + 1}$. So $M_y = ax^m$ and $N_x = b(m + 1)x^m$. The powers of $x$ agree automatically, so exactness becomes one equation for $m$, and the exponent need not be a whole number. For $3y\\,dx + 2x\\,dy = 0$, $3 = 2(m + 1)$ gives $m = \\frac{1}{2}$.\n\n> **Watch out.** Differentiating $bx^{m + 1}$ in $x$ brings down $m + 1$, not $m$, so subtract $1$ from $\\frac{a}{b}$ at the end; and it is $\\frac{a}{b}$, the coefficient of $y\\,dx$ over that of $x\\,dy$.",
    "要求给定形状的积分因子，就乘上它，再用恰当性检验。用因子 $x^m$，方程 $ay\\,dx + bx\\,dy = 0$ 有 $M = ax^m y$，$N = bx^{m + 1}$。所以 $M_y = ax^m$，$N_x = b(m + 1)x^m$。$x$ 的幂自动相同，于是恰当性成为关于 $m$ 的一个方程，指数不一定是整数。对 $3y\\,dx + 2x\\,dy = 0$，由 $3 = 2(m + 1)$ 得 $m = \\frac{1}{2}$。\n\n> **注意。** 对 $bx^{m + 1}$ 关于 $x$ 求导带下的是 $m + 1$ 而不是 $m$，所以最后要从 $\\frac{a}{b}$ 中减去 $1$；并且是 $\\frac{a}{b}$，即 $y\\,dx$ 的系数比 $x\\,dy$ 的系数。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = different(rng, 1, 9, a);
    const ratio = Q.of(a, b);
    const answer = ratio.sub(Q.of(1));
    const ac = a === 1 ? "" : `${a}`;
    const bc = b === 1 ? "" : `${b}`;
    return explainedNumber(
      [
        `Find $m$ so that multiplying $${ac}y\\,dx + ${bc}x\\,dy = 0$ by $x^m$ makes the equation exact.`,
        `求 $m$，使 $${ac}y\\,dx + ${bc}x\\,dy = 0$ 乘以 $x^m$ 后成为恰当方程。`,
      ],
      answer,
      [
        labelled(
          ["Multiply and differentiate", "相乘并求偏导"],
          "After multiplying, $M$ and $N$ are",
          "相乘后 $M$ 与 $N$ 为",
          `M = ${ac}x^{m}y, \\quad N = ${bc}x^{m + 1}`,
          `M_y = ${ac}x^{m}, \\quad N_x = ${bc}(m + 1)x^{m}`,
        ),
        labelled(
          ["Solve the exactness condition", "解恰当性条件"],
          "Setting $M_y = N_x$ and cancelling $x^{m}$:",
          "令 $M_y = N_x$ 并约去 $x^{m}$：",
          `${a} = ${b}(m + 1)`,
          `m = ${ratio.toLatex()} - 1 = ${answer.toLatex()}`,
        ),
      ],
      [
        `With $m = ${answer.toLatex()}$, $${b}(m + 1) = ${b} \\cdot ${ratio.toLatex()} = ${a}$, so $M_y$ and $N_x$ are both $${ac}x^{${answer.toLatex()}}$.`,
        `当 $m = ${answer.toLatex()}$ 时，$${b}(m + 1) = ${b} \\cdot ${ratio.toLatex()} = ${a}$，所以 $M_y$ 与 $N_x$ 都是 $${ac}x^{${answer.toLatex()}}$。`,
      ],
      [
        [ratio, `That is $m + 1$; subtract $1$ to get $m$.`, `这是 $m + 1$；要减去 $1$ 才得到 $m$。`],
        [
          Q.of(b, a).sub(Q.of(1)),
          "That inverts the ratio; exactness gives $a = b(m + 1)$, so $m + 1 = \\frac{a}{b}$.",
          "这是把比值颠倒了；恰当性给出 $a = b(m + 1)$，所以 $m + 1 = \\frac{a}{b}$。",
        ],
        [ratio.add(Q.of(1)), "That adds $1$ instead of subtracting it.", "这是加了 $1$，而不是减去 $1$。"],
        [answer.neg(), "The sign is flipped; recheck $m = \\frac{a}{b} - 1$.", "符号反了；重新检查 $m = \\frac{a}{b} - 1$。"],
      ],
    );
  },
};

const semistableLimit: KnowledgePointDef = {
  id: "the-limit-near-a-semistable-equilibrium",
  title: t("The limit near a semistable equilibrium", "半稳定平衡点附近的极限"),
  explanation: t(
    "At a double root of the right side of an autonomous equation, $y'$ does not change sign. So solutions on one side approach that equilibrium, while solutions on the other side move away from it. Such an equilibrium is called semistable. To find a limit, look at the sign of $y'$ at the starting value, then follow the solution in that direction until it reaches the first equilibrium, which it can never cross. For $y' = (y - 1)^{2}(4 - y)$ with $y(0) = 0$: $y' = 1 \\cdot 4 = 4 > 0$, so $y$ rises to the double root $1$ and stops there.\n\nCheck: the constant $y = 1$ makes both sides $0$, so it is a solution that the rising solution cannot cross, and between $0$ and $1$ the right side has no zero, so the solution keeps rising toward $1$.\n\n> **Watch out.** A semistable equilibrium attracts from one side only: from $y(0) = 2$ the slope is $1 \\cdot 2 > 0$, and the solution moves away from $1$, up to $4$.",
    "在自治方程右边的二重根处，$y'$ 不变号。所以一侧的解趋向这个平衡点，另一侧的解离开它。这样的平衡点称为半稳定的。要求极限，先看 $y'$ 在初值处的符号，然后沿这个方向跟随解，直到它到达第一个平衡点，它永远无法越过这个点。对 $y' = (y - 1)^{2}(4 - y)$，$y(0) = 0$：$y' = 1 \\cdot 4 = 4 > 0$，所以 $y$ 上升到二重根 $1$ 并停在那里。\n\n检验：常数 $y = 1$ 使两边都为 $0$，所以它是解，上升的解无法越过它；在 $0$ 和 $1$ 之间右边没有零点，所以解一直上升趋于 $1$。\n\n> **注意。** 半稳定平衡点只从一侧吸引：从 $y(0) = 2$ 出发，斜率为 $1 \\cdot 2 > 0$，解离开 $1$，上升到 $4$。",
  ),
  generate(rng) {
    const a = rng.int(-6, 3);
    const b = a + rng.int(2, 6);
    const place = rng.pick(["below", "between", "above"] as const);
    const y0 = place === "below" ? a - rng.int(1, 4) : place === "between" ? a + rng.int(1, b - a - 1) : b + rng.int(1, 4);
    const answer = place === "below" ? a : b;
    const other = place === "below" ? b : a;
    const first = poly([1, "y"], [-a, ""]);
    const second = poly([b, ""], [-1, "y"]);
    const slope = (y0 - a) ** 2 * (b - y0);
    const up = slope > 0;
    const at = (y: number) => `(${y} - ${inParens(a)})^{2}(${b} - ${inParens(y)})`;
    return explainedNumber(
      [
        `Let $y' = (${first})^2(${second})$ with $y(0) = ${y0}$. Find $\\lim_{t \\to \\infty} y(t)$.`,
        `设 $y' = (${first})^2(${second})$，$y(0) = ${y0}$。求 $\\lim_{t \\to \\infty} y(t)$。`,
      ],
      answer,
      [
        labelled(
          ["Find the equilibria", "求平衡点"],
          `The right side is zero at $y = ${a}$, a double root, and at $y = ${b}$.`,
          `右边在 $y = ${a}$（二重根）和 $y = ${b}$ 处为零。`,
        ),
        labelled(["Read the sign at the start", "看初值处的符号"], "", "", `y' = ${at(y0)} = ${slope} ${up ? ">" : "<"} 0`),
        labelled(
          ["Follow the solution", "跟随解"],
          `So $y$ ${up ? "rises" : "falls"} from $${y0}$ to the first equilibrium in that direction, $${answer}$, and stops there.`,
          `所以 $y$ 从 $${y0}$ ${up ? "上升" : "下降"}到这个方向上的第一个平衡点 $${answer}$，并停在那里。`,
        ),
      ],
      [
        `Substitute the constant $y = ${answer}$: $y' = 0$ and the right side is $${at(answer)} = 0$, so it is a solution that the moving solution cannot cross. Between $${y0}$ and $${answer}$ the right side has no zero, so the solution keeps ${up ? "rising" : "falling"} toward $${answer}$.`,
        `代入常数 $y = ${answer}$：$y' = 0$，右边 $${at(answer)} = 0$，所以它是解，运动的解无法越过它。在 $${y0}$ 和 $${answer}$ 之间右边没有零点，所以解一直${up ? "上升" : "下降"}趋于 $${answer}$。`,
      ],
      [
        place === "between"
          ? [
              other,
              `$y' > 0$ between the equilibria, so the solution moves up, away from $${a}$; it attracts only from below`,
              `两个平衡点之间 $y' > 0$，所以解向上远离 $${a}$；它只从下方吸引`,
            ]
          : [
              other,
              `To reach $${other}$ the solution would have to cross the equilibrium $${answer}$, which it cannot`,
              `要到达 $${other}$，解必须越过平衡点 $${answer}$，这是不可能的`,
            ],
        [
          y0,
          `The slope at the start is $${slope}$, not $0$, so the solution does not stay at $${y0}$`,
          `起点处斜率为 $${slope}$，不是 $0$，所以解不会停在 $${y0}$`,
        ],
        [a + b, "This adds the two equilibria; the limit is one of them", "这是两个平衡点之和；极限是其中之一"],
      ],
      "integer",
    );
  },
};

const isoclineOfSlope: KnowledgePointDef = {
  id: "the-isocline-of-a-given-slope",
  figure: calculusDrawings5["analyzing-slope-fields-for-nonautonomous-differential-equations#the-isocline-of-a-given-slope"],
  title: t("The isocline of a given slope", "给定斜率的等斜线"),
  explanation: t(
    "An isocline is the set of points where the slope field has one fixed value. Setting the right side of $y' = f(x, y)$ equal to a constant $m$ describes it, so no solving of the differential equation is needed. For a linear right side, each isocline is a straight line, and these lines are all parallel. Drawing a few of them, with short segments of the matching slope, is a fast way to sketch a field. For $y' = x + 2y$ and slope $4$: $x + 2y = 4$, so $y = -\\frac{1}{2}x + 2$, with $y$-intercept $2$.\n\nCheck: at $(0, 2)$ the slope is $0 + 2 \\cdot 2 = 4$.\n\n> **Watch out.** The isocline's own slope, here $-\\frac{1}{2}$, is not the slope $4$ of the segments drawn on it.",
    "等斜线是斜率场取同一固定值的点集。令 $y' = f(x, y)$ 的右边等于常数 $m$ 就描述了它，所以不需要解微分方程。对线性的右边，每条等斜线都是直线，而且彼此平行。画出其中几条，并标上相应斜率的短线段，是快速勾画斜率场的方法。对 $y' = x + 2y$ 和斜率 $4$：$x + 2y = 4$，所以 $y = -\\frac{1}{2}x + 2$，$y$ 轴截距为 $2$。\n\n检验：在 $(0, 2)$ 处斜率为 $0 + 2 \\cdot 2 = 4$。\n\n> **注意。** 等斜线本身的斜率（这里是 $-\\frac{1}{2}$）不是画在它上面的线段的斜率 $4$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 6);
    const m = nonzero(rng, 9);
    const answer = Q.of(m, b);
    const right = poly([a, "x"], [b, "y"]);
    return explainedNumber(
      [
        `For $y' = ${right}$, the points where the slope field has slope $${m}$ form a line. Find its $y$-intercept.`,
        `对 $y' = ${right}$，斜率场中斜率为 $${m}$ 的点构成一条直线。求它的 $y$ 轴截距。`,
      ],
      answer,
      [
        labelled(["Set the slope", "令斜率为给定值"], "The isocline is where", "等斜线满足", `${right} = ${m}`),
        labelled(["Solve for y", "解出 y"], "", "", `y = ${poly([Q.of(-a, b), "x"], [answer, ""])}`),
      ],
      [
        `At $(0, ${answer.toLatex()})$ the slope is $${a} \\cdot 0 + ${inParens(b)} \\cdot ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} = ${m}$, as required.`,
        `在 $(0, ${answer.toLatex()})$ 处斜率为 $${a} \\cdot 0 + ${inParens(b)} \\cdot ${answer.sign() < 0 ? `\\left(${answer.toLatex()}\\right)` : answer.toLatex()} = ${m}$，符合要求。`,
      ],
      [
        [
          Q.of(m, a),
          "This is the $x$-intercept, found by setting $y = 0$; the $y$-intercept sets $x = 0$",
          "这是令 $y = 0$ 得到的 $x$ 轴截距；$y$ 轴截距要令 $x = 0$",
        ],
        [Q.of(-m, b), "A sign slipped when solving for $y$", "解出 $y$ 时符号出错了"],
        [
          Q.of(m),
          `$${m}$ is the slope of the segments, not the intercept of the line they lie on`,
          `$${m}$ 是线段的斜率，不是它们所在直线的截距`,
        ],
        [Q.of(m * b), `This multiplies by $${b}$; solve $${b}y = ${m}$ by dividing`, `这里乘了 $${b}$；解 $${b}y = ${m}$ 应当做除法`],
      ],
    );
  },
};

const tankTransient: KnowledgePointDef = {
  id: "the-transient-coefficient-of-a-mixing-tank",
  title: t("The transient coefficient of a mixing tank", "混合罐的瞬态系数"),
  explanation: t(
    "When brine flows in and out at the same rate, the amount of salt obeys a linear equation, and its solution has two parts. The constant part is the amount that the tank would hold at the concentration of the incoming brine. The other part is an exponential decay that carries the initial difference from this amount. Since it equals the whole difference at $t = 0$, its coefficient can be negative, if the tank starts with too little salt.\n\n> **Watch out.** $K$ is the start minus the long-run amount, in that order. A $100$ L tank with $50$ g of salt fed $2$ g/L brine has $M = 200$ and $K = 50 - 200 = -150$, not $150$.",
    "当盐水以相同速率流入流出时，盐量服从线性方程，它的解有两部分。常数部分是罐内浓度等于流入盐水浓度时的盐量。另一部分是指数衰减，携带着初始时与这个量的差。由于它在 $t = 0$ 时等于全部差值，如果罐里起初盐太少，它的系数可以是负的。\n\n> **注意。** $K$ 是初始量减去长期量，顺序不能反。$100$ L、含盐 $50$ g、注入 $2$ g/L 盐水的罐，$M = 200$，$K = 50 - 200 = -150$，不是 $150$。",
  ),
  generate(rng) {
    const volume = rng.int(2, 20) * 10;
    const c = rng.int(1, 6);
    const r = rng.int(1, 9);
    const start = rng.int(0, 40) * 10;
    const limit = c * volume;
    const answer = start - limit;
    return explainedNumber(
      [
        `A tank holds ${volume} L of water containing ${start} g of salt. Brine with ${c} g/L flows in at ${r} L/min, and the stirred mixture flows out at the same rate. The salt has the form $A(t) = M + Ke^{-kt}$. Find $K$.`,
        `一个罐装有 ${volume} L 水，含盐 ${start} g。浓度为 ${c} g/L 的盐水以 ${r} L/min 流入，搅拌后的混合液以相同速率流出。盐量的形式是 $A(t) = M + Ke^{-kt}$。求 $K$。`,
      ],
      answer,
      [
        labelled(
          ["Find the long-run amount", "求长期盐量"],
          "The tank ends at the incoming concentration.",
          "罐最终达到流入盐水的浓度。",
          `M = ${c} \\cdot ${volume} = ${limit}`,
        ),
        labelled(
          ["Use the start", "用初始条件"],
          "At $t = 0$ the exponential is $1$.",
          "在 $t = 0$ 时指数函数等于 $1$。",
          `M + K = ${start}, \\qquad K = ${start} - ${limit} = ${answer}`,
        ),
      ],
      [
        `Then $A(0) = ${limit} ${answer < 0 ? "-" : "+"} ${Math.abs(answer)} = ${start}$ g, the salt the tank starts with.`,
        `于是 $A(0) = ${limit} ${answer < 0 ? "-" : "+"} ${Math.abs(answer)} = ${start}$ g，正是罐里起初的盐量。`,
      ],
      [
        [start, "That is the starting amount $A(0) = M + K$; subtract $M$.", "这是初始量 $A(0) = M + K$；还要减去 $M$。"],
        [limit, "That is the long-run amount $M$, not the coefficient of the decaying part.", "这是长期量 $M$，不是衰减部分的系数。"],
        [limit - start, "That subtracts in the wrong order; $K = A(0) - M$.", "这减反了；$K = A(0) - M$。"],
        [c * r, "That is the rate at which salt flows in, in grams per minute.", "这是盐流入的速率，单位是克/分。"],
      ],
      "integer",
    );
  },
};

const orthogonalThroughPoint: KnowledgePointDef = {
  id: "the-orthogonal-trajectory-through-a-point",
  figure: differentialEquationsDrawings1["orthogonal-trajectories#the-orthogonal-trajectory-through-a-point"],
  title: t("The orthogonal trajectory through a point", "过一点的正交轨线"),
  explanation: t(
    "To find orthogonal trajectories, first remove the constant from the family. For $y = cx^n$, dividing gives $y' = \\frac{ny}{x}$, a slope that holds for every curve in the family. A curve crossing at right angles has the negative reciprocal slope, $y' = -\\frac{x}{ny}$. This equation is separable, and its solutions are ellipses. The initial point then fixes the particular ellipse, just as for any other family of solutions.\n\n> **Watch out.** The factor $n$ goes with $y^2$, because $ny\\,dy = -x\\,dx$. For $y = cx^2$ through $(1, 2)$ the trajectory is $x^2 + 2y^2 = 9$, not $2x^2 + y^2 = 6$.",
    "求正交轨线时，先从曲线族中消去常数。对 $y = cx^n$，相除得 $y' = \\frac{ny}{x}$，这个斜率对族中每条曲线都成立。以直角相交的曲线有负倒数斜率 $y' = -\\frac{x}{ny}$。这个方程可分离变量，解是椭圆。然后由给定的点确定具体的椭圆，就像其他解族一样。\n\n> **注意。** 因子 $n$ 跟着 $y^2$，因为 $ny\\,dy = -x\\,dx$。对 $y = cx^2$ 过 $(1, 2)$ 的正交轨线是 $x^2 + 2y^2 = 9$，不是 $2x^2 + y^2 = 6$。",
  ),
  generate(rng) {
    const n = rng.int(2, 5);
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 6);
    const answer = a * a + n * b * b;
    return explainedNumber(
      [
        `The orthogonal trajectory of the family $y = cx^{${n}}$ through $(${a}, ${b})$ has an equation $x^2 + py^2 = K$. Find $K$.`,
        `曲线族 $y = cx^{${n}}$ 过 $(${a}, ${b})$ 的正交轨线的方程是 $x^2 + py^2 = K$。求 $K$。`,
      ],
      answer,
      [
        labelled(
          ["Find the trajectories", "求正交轨线"],
          `The family has slope $\\frac{${n}y}{x}$; take the negative reciprocal and separate.`,
          `曲线族的斜率是 $\\frac{${n}y}{x}$；取负倒数再分离变量。`,
          `y' = -\\frac{x}{${n}y}, \\qquad ${n}y\\,dy = -x\\,dx, \\qquad x^2 + ${n}y^2 = K`,
        ),
        labelled(
          ["Use the point", "代入点"],
          "",
          "",
          `K = ${inParens(a)}^2 + ${n} \\cdot ${inParens(b)}^2 = ${a * a} + ${n * b * b} = ${answer}`,
        ),
      ],
      [
        `At $(${a}, ${b})$ the family's slope is $${Q.of(n * b, a).toLatex()}$ and the trajectory's is $${Q.of(-a, n * b).toLatex()}$; their product is $-1$.`,
        `在 $(${a}, ${b})$ 处曲线族的斜率是 $${Q.of(n * b, a).toLatex()}$，正交轨线的斜率是 $${Q.of(-a, n * b).toLatex()}$，两者之积为 $-1$。`,
      ],
      [
        [
          a * a + b * b,
          "That drops the factor $n$, as if the family were the lines $y = cx$.",
          "这丢了因子 $n$，好像曲线族是直线 $y = cx$。",
        ],
        [
          n * a * a + b * b,
          "That puts $n$ on $x^2$; it multiplies $y\\,dy$, so it goes with $y^2$.",
          "这把 $n$ 放在 $x^2$ 上；它乘在 $y\\,dy$ 上，应跟着 $y^2$。",
        ],
        [n * (a * a + b * b), "That multiplies both squares by $n$.", "这把两个平方都乘以了 $n$。"],
      ],
      "integer",
    );
  },
};

const accelerationFromPower: KnowledgePointDef = {
  id: "the-acceleration-when-speed-is-a-power-of-position",
  figure:
    multivariableDrawings8["velocity-and-acceleration-as-functions-of-displacement#the-acceleration-when-speed-is-a-power-of-position"],
  title: t("The acceleration when speed is a power of position", "速度是位置的幂时的加速度"),
  explanation: t(
    "If velocity is given as a function of position, $\\frac{dv}{dx}$ alone is not the acceleration, because it measures the change per metre and not per second. The chain rule supplies the missing factor: $a = \\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx}$. So the acceleration at a point is the speed there times the slope of the velocity graph. The time never needs to appear in the calculation. For $v = x^{2}$ at $x = 3$: $v = 9$ and $\\frac{dv}{dx} = 6$, so $a = 54$.\n\n> **Watch out.** $\\frac{dv}{dx}$ is a rate per unit of distance; multiply it by $v$ to get the rate per unit of time.",
    "如果速度是位置的函数，$\\frac{dv}{dx}$ 本身不是加速度，因为它度量的是每米而不是每秒的变化。链式法则补上缺少的因子：$a = \\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx}$。所以一点处的加速度是该点的速度乘以速度图的斜率。计算中根本不需要出现时间。对 $v = x^{2}$，在 $x = 3$ 处：$v = 9$，$\\frac{dv}{dx} = 6$，所以 $a = 54$。\n\n> **注意。** $\\frac{dv}{dx}$ 是对距离的变化率；乘以 $v$ 才得到对时间的变化率。",
  ),
  generate(rng) {
    const k = rng.int(1, 4);
    const n = rng.int(1, 3);
    const x0 = rng.int(1, 3);
    const velocity = k * x0 ** n;
    const slope = k * n * x0 ** (n - 1);
    const answer = velocity * slope;
    const v = `${k === 1 ? "" : k}${signedPower("x", n)}`;
    const dv = n === 1 ? `${k}` : `${k * n === 1 ? "" : k * n}${signedPower("x", n - 1)}`;
    const reasons: [number, string, string][] = [
      [
        slope,
        "That is $\\frac{dv}{dx}$ alone, a rate per unit of distance; multiply by $v$.",
        "这只是 $\\frac{dv}{dx}$，是对距离的变化率；还要乘以 $v$。",
      ],
      [velocity, "That is the velocity at the point, not its rate of change.", "这是该点的速度，而不是它的变化率。"],
      [
        velocity * velocity,
        "That squares the velocity; the second factor is the slope $\\frac{dv}{dx}$.",
        "这是把速度平方；第二个因子应是斜率 $\\frac{dv}{dx}$。",
      ],
      [2 * answer, "That is $\\frac{d}{dx}(v^{2})$; the acceleration is half of it.", "这是 $\\frac{d}{dx}(v^{2})$；加速度是它的一半。"],
    ];
    return numberProblem({
      prompt: t(
        `A particle moving along a line has velocity $v = ${v}$ at position $x$. Find its acceleration at $x = ${x0}$.`,
        `沿直线运动的质点在位置 $x$ 的速度是 $v = ${v}$。求它在 $x = ${x0}$ 处的加速度。`,
      ),
      answer,
      form: "integer",
      mistakes: reasons.filter(([w], i) => w !== answer && reasons.findIndex(([o]) => o === w) === i).map(([w, en, zh]) => why(w, en, zh)),
      solution: walked(
        [
          labelled(
            ["Use the chain rule", "用链式法则"],
            "The time drops out:",
            "时间被消去：",
            `a = \\frac{dv}{dt} = \\frac{dv}{dx}\\frac{dx}{dt} = v\\frac{dv}{dx}`,
            `\\frac{dv}{dx} = ${dv}`,
          ),
          labelled(
            ["Evaluate at the point", "在该点求值"],
            `At $x = ${x0}$:`,
            `在 $x = ${x0}$ 处：`,
            `v = ${velocity}, \\quad \\frac{dv}{dx} = ${slope}`,
            `a = ${velocity} \\cdot ${slope} = ${answer}`,
          ),
        ],
        t(
          `Since $a = \\frac{d}{dx}\\left(\\frac{v^{2}}{2}\\right)$ and $\\frac{v^{2}}{2} = \\frac{${k * k}}{2}x^{${2 * n}}$, differentiating gives $${n * k * k === 1 ? "" : n * k * k}${signedPower("x", 2 * n - 1)}$, which is $${answer}$ at $x = ${x0}$.`,
          `由于 $a = \\frac{d}{dx}\\left(\\frac{v^{2}}{2}\\right)$，而 $\\frac{v^{2}}{2} = \\frac{${k * k}}{2}x^{${2 * n}}$，求导得 $${n * k * k === 1 ? "" : n * k * k}${signedPower("x", 2 * n - 1)}$，在 $x = ${x0}$ 处等于 $${answer}$。`,
        ),
      ),
    });
  },
};

const periodOfOrbit: KnowledgePointDef = {
  id: "the-period-of-a-larger-circular-orbit",
  title: t("The period of a larger circular orbit", "更大圆轨道的周期"),
  explanation: t(
    "For a circular orbit, gravity supplies the centripetal force, so $\\frac{GMm}{r^2} = \\frac{mv^2}{r}$, and the speed satisfies $v^2 = \\frac{GM}{r}$. One full turn takes $T = \\frac{2\\pi r}{v}$, and combining these gives $T^2 = \\frac{4\\pi^2 r^3}{GM}$. So the square of the period is proportional to the cube of the radius, which is Kepler's third law. Neither the mass of the satellite nor the value of $G$ matters in a comparison.\n\n> **Watch out.** The period grows like $r^{3/2}$, faster than the radius. An orbit $4$ times as large takes $4^{3/2} = 8$ times as long, not $4$ times.",
    "对圆轨道，引力提供向心力，所以 $\\frac{GMm}{r^2} = \\frac{mv^2}{r}$，速度满足 $v^2 = \\frac{GM}{r}$。转一整圈需要 $T = \\frac{2\\pi r}{v}$，合起来得 $T^2 = \\frac{4\\pi^2 r^3}{GM}$。所以周期的平方与半径的立方成正比，这就是开普勒第三定律。做比较时，卫星的质量和 $G$ 的值都不起作用。\n\n> **注意。** 周期按 $r^{3/2}$ 增长，比半径增长得快。半径为 $4$ 倍的轨道，周期是 $4^{3/2} = 8$ 倍，不是 $4$ 倍。",
  ),
  generate(rng) {
    const k = rng.int(2, 5);
    const period = rng.int(1, 12);
    const ratio = k * k;
    const answer = k ** 3 * period;
    return explainedNumber(
      [
        `Two satellites circle the same planet. The outer orbit has ${ratio} times the radius of the inner one, and the inner satellite has a period of ${period} hours. Find the period of the outer satellite, in hours.`,
        `两颗卫星绕同一行星运行。外轨道的半径是内轨道的 ${ratio} 倍，内侧卫星的周期是 ${period} 小时。求外侧卫星的周期（小时）。`,
      ],
      answer,
      [
        labelled(
          ["Compare the periods", "比较周期"],
          "Since $T^2$ is proportional to $r^3$:",
          "由于 $T^2$ 与 $r^3$ 成正比：",
          `\\frac{T_2}{T_1} = ${ratio}^{3/2} = \\left(\\sqrt{${ratio}}\\right)^3 = ${k}^3 = ${k ** 3}`,
        ),
        labelled(["Scale the period", "换算周期"], "", "", `T_2 = ${k ** 3} \\cdot ${period} = ${answer}`),
      ],
      [
        `Squaring, $\\left(\\frac{T_2}{T_1}\\right)^2 = ${k ** 3}^2 = ${k ** 6}$, and $${ratio}^3 = ${k ** 6}$ as well.`,
        `平方得 $\\left(\\frac{T_2}{T_1}\\right)^2 = ${k ** 3}^2 = ${k ** 6}$，而 $${ratio}^3 = ${k ** 6}$ 也是如此。`,
      ],
      [
        [
          ratio * period,
          "That scales the period like the radius; it grows like $r^{3/2}$.",
          "这让周期像半径一样增长；它按 $r^{3/2}$ 增长。",
        ],
        [
          k * period,
          "That scales the period like $\\sqrt{r}$; the exponent is $\\frac{3}{2}$.",
          "这让周期按 $\\sqrt{r}$ 增长；指数是 $\\frac{3}{2}$。",
        ],
        [ratio * ratio * period, "That scales the period like $r^2$ instead of $r^{3/2}$.", "这让周期按 $r^2$ 增长，而不是 $r^{3/2}$。"],
      ],
      "integer",
    );
  },
};

const initialCurrent: KnowledgePointDef = {
  id: "the-initial-current-of-a-charging-circuit",
  title: t("The initial current of a charging circuit", "充电电路的初始电流"),
  explanation: t(
    "In the equation $Rq' + \\frac{q}{C} = V$, an uncharged capacitor has $q = 0$ at the moment the switch closes, and so no voltage across it. The whole battery voltage then falls across the resistor, and $q'(0) = \\frac{V}{R}$. The capacitance does not enter, because it only matters once charge has built up. As charging goes on, the current falls towards zero, with time constant $RC$.\n\n> **Watch out.** The current is largest at the start, not zero. A $12$ V battery with a $4\\ \\Omega$ resistor drives $\\frac{12}{4} = 3$ A into an empty capacitor at once; the current dies away only as charge builds up.",
    "在方程 $Rq' + \\frac{q}{C} = V$ 中，未充电的电容器在开关闭合瞬间 $q = 0$，所以两端没有电压。这时电池的全部电压都加在电阻上，$q'(0) = \\frac{V}{R}$。电容不出现，因为只有积累了电荷它才起作用。随着充电进行，电流趋于零，时间常数是 $RC$。\n\n> **注意。** 电流在开始时最大，而不是零。$12$ V 电池与 $4\\ \\Omega$ 电阻一接通，就向空电容器送入 $\\frac{12}{4} = 3$ A 的电流；只有随着电荷积累电流才衰减。",
  ),
  generate(rng) {
    const r = rng.int(2, 20);
    const v = rng.int(6, 24);
    const n = rng.int(2, 9);
    const answer = Q.of(v, r);
    return explainedNumber(
      [
        `An uncharged capacitor of $\\frac{1}{${n}}$ F, a resistor of ${r} Ω and a ${v} V battery are connected in series. Find the current, in amperes, at the moment the circuit is closed.`,
        `未充电的 $\\frac{1}{${n}}$ F 电容器、${r} Ω 电阻和 ${v} V 电池串联。求电路闭合瞬间的电流（安培）。`,
      ],
      answer,
      [
        labelled(
          ["Use the empty capacitor", "电容器为空"],
          "At first $q = 0$, so the capacitor has no voltage.",
          "起初 $q = 0$，所以电容器两端没有电压。",
          `${r}q'(0) + ${n} \\cdot 0 = ${v}`,
        ),
        labelled(["Solve", "求解"], "", "", `q'(0) = ${v} \\div ${r} = ${answer.toLatex()}`),
      ],
      [
        `The resistor then drops $${r} \\cdot ${answer.toLatex()} = ${v}$ V, the whole battery voltage, as it must while the capacitor is empty.`,
        `此时电阻上的压降为 $${r} \\cdot ${answer.toLatex()} = ${v}$ V，正是电池的全部电压，这在电容器为空时是必然的。`,
      ],
      [
        [
          Q.of(v, n),
          "That multiplies the voltage by the capacitance; with no charge yet, the capacitor plays no part.",
          "这把电压乘以了电容；还没有电荷时电容器不起作用。",
        ],
        [Q.of(v * r), "That multiplies the voltage by the resistance; Ohm's law divides.", "这把电压乘以电阻；欧姆定律是相除。"],
        [Q.of(r, v), "That divides the resistance by the voltage, the wrong way round.", "这用电阻除以电压，颠倒了。"],
        [Q.of(0), "That is the current at the end of charging, not at the start.", "这是充电结束时的电流，不是开始时的。"],
      ],
    );
  },
};

const operatorOnExponential: KnowledgePointDef = {
  id: "a-product-of-operators-on-an-exponential",
  title: t("A product of operators on an exponential", "算子之积作用于指数函数"),
  explanation: t(
    "Since $De^{cx} = ce^{cx}$, the operator $D - a$ acts on $e^{cx}$ simply by multiplying it by the number $c - a$. Applying a product of such operators then multiplies these numbers together, so a polynomial in $D$ acts on $e^{cx}$ as that polynomial evaluated at $c$. This is the reason the characteristic equation works. If $c$ is a root, the result is zero, and $e^{cx}$ solves the homogeneous equation. For example $(D - 1)(D - 3)e^{2x} = (2 - 1)(2 - 3)e^{2x} = -e^{2x}$.\n\n> **Watch out.** Each factor gives $c - a$, so the numbers multiply; adding them, or using $c + a$, gives the wrong factor.",
    "由于 $De^{cx} = ce^{cx}$，算子 $D - a$ 作用于 $e^{cx}$ 只是乘以数 $c - a$。于是这种算子之积作用时，就把这些数相乘，所以 $D$ 的多项式作用于 $e^{cx}$ 等于该多项式在 $c$ 处的值。这正是特征方程有效的原因。如果 $c$ 是根，结果为零，$e^{cx}$ 就是齐次方程的解。例如 $(D - 1)(D - 3)e^{2x} = (2 - 1)(2 - 3)e^{2x} = -e^{2x}$。\n\n> **注意。** 每个因子给出 $c - a$，这些数要相乘；把它们相加，或用 $c + a$，都会得到错误的因子。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const b = nonzero(rng, 5);
    const c = nonzero(rng, 5);
    const answer = (c - a) * (c - b);
    const fa = poly([1, "D"], [-a, ""]);
    const fb = poly([1, "D"], [-b, ""]);
    const e = `e^{${exponentOf(c, "x")}}`;
    const sg = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`);
    return explainedNumber(
      [`The operator $(${fa})(${fb})$ sends $${e}$ to $K${e}$. Find $K$.`, `算子 $(${fa})(${fb})$ 把 $${e}$ 变成 $K${e}$。求 $K$。`],
      answer,
      [
        labelled(
          ["Apply the right factor", "先作用右边的因子"],
          `Since $D${e} = ${poly([c, e])}$:`,
          `由于 $D${e} = ${poly([c, e])}$：`,
          `(${fb})${e} = (${c} - ${inParens(b)})${e} = ${poly([c - b, e])}`,
        ),
        labelled(
          ["Apply the left factor", "再作用左边的因子"],
          "",
          "",
          `(${fa})\\left(${poly([c - b, e])}\\right) = ${inParens(c - b)} \\cdot (${c} - ${inParens(a)})${e} = ${poly([answer, e])}`,
          `K = ${answer}`,
        ),
      ],
      [
        `Expanded, the operator is $${poly([1, "D^2"], [-(a + b), "D"], [a * b, ""])}$, and at $D = ${c}$ this is $${c * c} ${sg(-(a + b) * c)} ${sg(a * b)} = ${answer}$.`,
        `展开后算子为 $${poly([1, "D^2"], [-(a + b), "D"], [a * b, ""])}$，在 $D = ${c}$ 处为 $${c * c} ${sg(-(a + b) * c)} ${sg(a * b)} = ${answer}$。`,
      ],
      [
        [
          c * c + a * b,
          "That leaves out the middle term $-(a + b)D$ of the expanded operator.",
          "这里漏掉了展开后算子的中间项 $-(a + b)D$。",
        ],
        [
          (c + a) * (c + b),
          "That uses $c + a$ for each factor; $D - a$ multiplies by $c - a$.",
          "这是每个因子都用了 $c + a$；$D - a$ 乘的是 $c - a$。",
        ],
        [
          c - a + (c - b),
          "That adds the two numbers; applying one factor after the other multiplies them.",
          "这是把两个数相加；一个因子接着另一个作用，是把它们相乘。",
        ],
      ],
      "integer",
    );
  },
};

const companionProduct: KnowledgePointDef = {
  id: "the-product-of-the-eigenvalues-of-a-companion-matrix",
  title: t("The product of the eigenvalues of a companion matrix", "友矩阵特征值之积"),
  explanation: t(
    "When $y''' + ay'' + by' + cy = 0$ is written as a system for $(y, y', y'')$, the eigenvalues of the matrix are the roots of $r^3 + ar^2 + br + c$. By Vieta's formulas, the product of three roots of a monic cubic is $-c$, and their sum is $-a$. For a matrix, these numbers are the determinant and the trace, so a quick check of the sign against the bottom row of the matrix is available. For $y''' + 2y'' - y' + 6y = 0$ the product of the eigenvalues is $-6$.\n\n> **Watch out.** For a quadratic $r^2 + pr + q$ the product of the roots is $+q$, but for a cubic it is $-c$: the sign alternates with the degree.",
    "把 $y''' + ay'' + by' + cy = 0$ 写成 $(y, y', y'')$ 的方程组时，矩阵的特征值是 $r^3 + ar^2 + br + c$ 的根。由韦达定理，首一三次多项式三个根之积是 $-c$，和是 $-a$。对矩阵来说，这两个数就是行列式和迹，所以可以对照矩阵的最后一行快速检查符号。对 $y''' + 2y'' - y' + 6y = 0$，特征值之积为 $-6$。\n\n> **注意。** 对二次式 $r^2 + pr + q$，根之积是 $+q$；但对三次式是 $-c$：符号随次数交替变化。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const b = nonzero(rng, 9);
    const c = nonzero(rng, 12);
    const answer = -c;
    return explainedNumber(
      [
        `The equation $${poly([1, "y'''"], [a, "y''"], [b, "y'"], [c, "y"])} = 0$ is written as a system $\\mathbf{x}' = A\\mathbf{x}$ with $\\mathbf{x} = (y, y', y'')$. Find the product of the eigenvalues of $A$.`,
        `方程 $${poly([1, "y'''"], [a, "y''"], [b, "y'"], [c, "y"])} = 0$ 写成方程组 $\\mathbf{x}' = A\\mathbf{x}$，其中 $\\mathbf{x} = (y, y', y'')$。求 $A$ 的特征值之积。`,
      ],
      answer,
      [
        labelled(
          ["Write the companion matrix", "写出友矩阵"],
          "The last row holds the coefficients with their signs changed:",
          "最后一行是改变符号后的系数：",
          `A = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ ${-c} & ${-b} & ${-a} \\end{pmatrix}`,
        ),
        labelled(
          ["Take the determinant", "求行列式"],
          "The product of the eigenvalues is the determinant; expand along the first column:",
          "特征值之积等于行列式；按第一列展开：",
          `\\det(A) = ${inParens(-c)} \\cdot \\det\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} = ${answer}`,
        ),
      ],
      [
        `By Vieta's formulas the roots of $${poly([1, "r^3"], [a, "r^2"], [b, "r"], [c, ""])}$ multiply to minus the constant term, $${answer}$.`,
        `由韦达定理，$${poly([1, "r^3"], [a, "r^2"], [b, "r"], [c, ""])}$ 的根之积为常数项的相反数 $${answer}$。`,
      ],
      [
        [c, "That uses the quadratic rule; for a cubic the product of the roots is $-c$.", "这是用了二次式的规律；三次式的根之积是 $-c$。"],
        [-a, "That is the sum of the eigenvalues, the trace.", "这是特征值之和，即迹。"],
        [a, "That is the coefficient of $y''$, which belongs to the sum of the roots.", "这是 $y''$ 的系数，它与根之和有关。"],
        [-b, "That is an entry of the last row, not the determinant.", "这是最后一行中的一个元素，而不是行列式。"],
        [b, "That is the coefficient of $y'$, the sum of products of pairs of roots.", "这是 $y'$ 的系数，即两两根之积的和。"],
      ],
      "integer",
    );
  },
};

const oscillationRate: KnowledgePointDef = {
  id: "the-growth-rate-of-an-oscillating-system",
  title: t("The growth rate of an oscillating system", "振荡系统的增长率"),
  explanation: t(
    "When a real two-by-two matrix has complex eigenvalues $\\alpha \\pm i\\beta$, every solution of $\\mathbf{x}' = A\\mathbf{x}$ is $e^{\\alpha t}$ times a combination of a sine and a cosine. So $\\alpha$ alone decides whether the spiral grows, shrinks or closes. The two eigenvalues add to the trace of the matrix, and the imaginary parts cancel. Hence $\\alpha$ is half of the trace, and there is no need to solve a quadratic equation to find it. For $A = \\begin{pmatrix} 3 & -5 \\\\ 2 & -1 \\end{pmatrix}$ the trace is $2$, so $\\alpha = 1$ and the spiral grows.\n\n> **Watch out.** Halve the trace: the trace is $2\\alpha$, the sum of both eigenvalues. The determinant gives $\\alpha^2 + \\beta^2$, not $\\alpha$.",
    "当实二阶矩阵有复特征值 $\\alpha \\pm i\\beta$ 时，$\\mathbf{x}' = A\\mathbf{x}$ 的每个解都是 $e^{\\alpha t}$ 乘以正弦和余弦的组合。所以只有 $\\alpha$ 决定螺线是增长、收缩还是闭合。两个特征值之和是矩阵的迹，虚部相消。因此 $\\alpha$ 是迹的一半，不必解二次方程。对 $A = \\begin{pmatrix} 3 & -5 \\\\ 2 & -1 \\end{pmatrix}$，迹为 $2$，所以 $\\alpha = 1$，螺线向外增长。\n\n> **注意。** 要把迹减半：迹是 $2\\alpha$，即两个特征值之和。行列式给出的是 $\\alpha^2 + \\beta^2$，而不是 $\\alpha$。",
  ),
  generate(rng) {
    const a = rng.int(-6, 6);
    const d = rng.int(-6, 6);
    const b = rng.int(1, 5);
    const m = Math.floor(((a - d) * (a - d)) / (4 * b)) + rng.int(1, 3);
    const flip = rng.pick([1, -1]);
    const answer = Q.of(a + d, 2);
    const det = a * d + b * m;
    const beta2 = Q.of(det).sub(answer.mul(answer));
    return explainedNumber(
      [
        `The matrix $A = ${matrix2(a, flip * b, -flip * m, d)}$ has complex eigenvalues. Every solution of $\\mathbf{x}' = A\\mathbf{x}$ is $e^{\\alpha t}$ times a bounded oscillation. Find $\\alpha$.`,
        `矩阵 $A = ${matrix2(a, flip * b, -flip * m, d)}$ 有复特征值。$\\mathbf{x}' = A\\mathbf{x}$ 的每个解都是 $e^{\\alpha t}$ 乘以有界振荡。求 $\\alpha$。`,
      ],
      answer,
      [
        labelled(
          ["Find the trace", "求迹"],
          "The eigenvalues $\\alpha \\pm i\\beta$ add to $2\\alpha$:",
          "特征值 $\\alpha \\pm i\\beta$ 之和为 $2\\alpha$：",
          `\\operatorname{tr}(A) = ${inParens(a)} + ${inParens(d)} = ${a + d} = 2\\alpha`,
        ),
        labelled(["Halve it", "取一半"], "", "", `\\alpha = ${answer.toLatex()}`),
      ],
      [
        `$\\det(A) = ${det}$, and $\\beta^2 = \\det(A) - \\alpha^2 = ${beta2.toLatex()} > 0$, so the eigenvalues are indeed complex with real part $${answer.toLatex()}$.`,
        `$\\det(A) = ${det}$，且 $\\beta^2 = \\det(A) - \\alpha^2 = ${beta2.toLatex()} > 0$，所以特征值确实是复数，实部为 $${answer.toLatex()}$。`,
      ],
      [
        [Q.of(a + d), "That is the whole trace, $2\\alpha$; halve it.", "这是整个迹 $2\\alpha$；还要取一半。"],
        [answer.neg(), "The sign is flipped: $\\alpha$ has the sign of the trace.", "符号反了：$\\alpha$ 与迹同号。"],
        [Q.of(det), "That is the determinant, which gives $\\alpha^2 + \\beta^2$.", "这是行列式，它给出的是 $\\alpha^2 + \\beta^2$。"],
        [Q.of(a - d, 2), "That halves the difference of the diagonal entries; use their sum.", "这是把对角元素之差减半；应该用它们的和。"],
      ],
    );
  },
};

const polynomialTransform: KnowledgePointDef = {
  id: "the-transform-of-a-polynomial-at-a-point",
  title: t("The transform of a polynomial at a point", "多项式的变换在一点的值"),
  explanation: t(
    "By linearity, a polynomial transforms one term at a time, using $\\mathcal{L}\\{t^n\\} = \\frac{n!}{s^{n + 1}}$. The factorial is the part that is easy to forget, since it does not appear for $1$ or $t$ and first matters at $t^2$. The power of $s$ is one more than the power of $t$. Once the transform is known as a function of $s$, its value at a point follows by substitution.\n\n> **Watch out.** The transform of $t^{2}$ is $\\frac{2}{s^{3}}$, not $\\frac{1}{s^{3}}$. For $f(t) = 3t^{2}$ at $s = 1$ the value is $6$, not $3$.",
    "由线性性，多项式逐项变换，用 $\\mathcal{L}\\{t^n\\} = \\frac{n!}{s^{n + 1}}$。阶乘这部分容易被忘记，因为对 $1$ 或 $t$ 它不出现，到 $t^2$ 才开始起作用。$s$ 的幂比 $t$ 的幂大一。知道了变换作为 $s$ 的函数之后，代入就得到它在一点的值。\n\n> **注意。** $t^{2}$ 的变换是 $\\frac{2}{s^{3}}$，不是 $\\frac{1}{s^{3}}$。对 $f(t) = 3t^{2}$，在 $s = 1$ 处的值是 $6$，不是 $3$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const b = nonzero(rng, 9);
    const c = nonzero(rng, 9);
    const s = rng.int(1, 4);
    const at = (x: number, y: number, z: number) =>
      Q.of(x, s)
        .add(Q.of(y, s * s))
        .add(Q.of(z, s ** 3));
    const fraction = (n: number, den: string) => `${n < 0 ? "-" : "+"} \\frac{${Math.abs(n)}}{${den}}`;
    const transform = `${a < 0 ? "-" : ""}\\frac{${Math.abs(a)}}{s} ${fraction(b, "s^2")} ${fraction(2 * c, "s^3")}`;
    const answer = at(a, b, 2 * c);
    const parts = [Q.of(a, s), Q.of(b, s * s), Q.of(2 * c, s ** 3)];
    const sum = parts.map((v, i) => (i === 0 ? v.toLatex() : v.sign() < 0 ? `- ${v.neg().toLatex()}` : `+ ${v.toLatex()}`)).join(" ");
    return explainedNumber(
      [
        `Let $F(s)$ be the Laplace transform of $f(t) = ${poly([a, ""], [b, "t"], [c, "t^2"])}$. Find $F(${s})$.`,
        `设 $F(s)$ 是 $f(t) = ${poly([a, ""], [b, "t"], [c, "t^2"])}$ 的拉普拉斯变换。求 $F(${s})$。`,
      ],
      answer,
      [
        labelled(
          ["Transform term by term", "逐项变换"],
          "Use $\\mathcal{L}\\{1\\} = \\frac{1}{s}$, $\\mathcal{L}\\{t\\} = \\frac{1}{s^2}$ and $\\mathcal{L}\\{t^2\\} = \\frac{2}{s^3}$:",
          "用 $\\mathcal{L}\\{1\\} = \\frac{1}{s}$，$\\mathcal{L}\\{t\\} = \\frac{1}{s^2}$，$\\mathcal{L}\\{t^2\\} = \\frac{2}{s^3}$：",
          `F(s) = ${transform}`,
        ),
        labelled(["Substitute", "代入"], "", "", `F(${s}) = ${sum} = ${answer.toLatex()}`),
      ],
      [
        `Each term follows the pattern $\\frac{n!}{s^{n + 1}}$: the constant $${a}$ gives $\\frac{${a}}{s}$ with $0! = 1$, and $${poly([c, "t^2"])}$ gives $\\frac{${inParens(c)} \\cdot 2!}{s^3}$, the source of the $${2 * c}$.`,
        `每一项都符合 $\\frac{n!}{s^{n + 1}}$：常数 $${a}$ 给出 $\\frac{${a}}{s}$（$0! = 1$），$${poly([c, "t^2"])}$ 给出 $\\frac{${inParens(c)} \\cdot 2!}{s^3}$，这就是 $${2 * c}$ 的来源。`,
      ],
      [
        [at(a, b, c), "That leaves out the factorial $2! = 2$ in the transform of $t^2$.", "这漏掉了 $t^2$ 的变换中的阶乘 $2! = 2$。"],
        [
          Q.of(a + b + c, s),
          "That puts every term over $s$; the power of $s$ is one more than the power of $t$.",
          "这把每一项都放在 $s$ 上；$s$ 的幂应比 $t$ 的幂大一。",
        ],
        [
          Q.of(a)
            .add(Q.of(b, s))
            .add(Q.of(2 * c, s * s)),
          "That uses $s^n$ in place of $s^{n + 1}$ for each $t^n$.",
          "这对每个 $t^n$ 用了 $s^n$，应当是 $s^{n + 1}$。",
        ],
      ],
    );
  },
};

const powerTimesExponentialTransform: KnowledgePointDef = {
  id: "the-transform-of-a-power-times-an-exponential",
  title: t("The transform of a power times an exponential", "幂乘指数函数的变换"),
  explanation: t(
    "Multiplying by $t$ corresponds to taking $-\\frac{d}{ds}$ of the transform. Starting with $\\frac{1}{s - a}$ for $e^{at}$ and repeating this gives $\\frac{n!}{(s - a)^{n + 1}}$ for $t^n e^{at}$. Each derivative raises the power in the denominator by one, and brings down a factor that builds the factorial. The minus sign in the rule cancels the minus sign from differentiating, so the result is positive for $s > a$.\n\n> **Watch out.** The power in the denominator is $n + 1$, one more than the power of $t$. For $te^{2t}$ at $s = 4$ the value is $\\frac{1}{(4 - 2)^{2}} = \\frac{1}{4}$, not $\\frac{1}{2}$.",
    "乘以 $t$ 对应于对变换取 $-\\frac{d}{ds}$。从 $e^{at}$ 的 $\\frac{1}{s - a}$ 出发，反复这样做，就得到 $t^n e^{at}$ 的 $\\frac{n!}{(s - a)^{n + 1}}$。每次求导都把分母的幂升高一次，并带下一个构成阶乘的因子。法则中的负号抵消了求导产生的负号，所以当 $s > a$ 时结果为正。\n\n> **注意。** 分母的幂是 $n + 1$，比 $t$ 的幂大一。对 $te^{2t}$，在 $s = 4$ 处的值是 $\\frac{1}{(4 - 2)^{2}} = \\frac{1}{4}$，不是 $\\frac{1}{2}$。",
  ),
  generate(rng) {
    const n = rng.int(1, 3);
    const a = nonzero(rng, 3);
    const gap = rng.int(1, 4);
    const s = a + gap;
    const factorial = [1, 1, 2, 6][n] ?? 1;
    const answer = Q.of(factorial, gap ** (n + 1));
    const shift = poly([1, "s"], [-a, ""]);
    const reasons: [Q, string, string][] = [
      [Q.of(1, gap ** (n + 1)), `That leaves out the factor $${n}! = ${factorial}$.`, `这漏掉了因子 $${n}! = ${factorial}$。`],
      [
        Q.of(factorial, gap ** n),
        `That uses the power $${n}$; the denominator has the power $${n + 1}$.`,
        `这用了幂 $${n}$；分母的幂是 $${n + 1}$。`,
      ],
    ];
    if (s + a !== 0)
      reasons.push([
        Q.of(factorial, (s + a) ** (n + 1)),
        `That shifts the wrong way, using $${poly([1, "s"], [a, ""])}$; the factor $e^{${exponentOf(a, "t")}}$ gives $${shift}$.`,
        `这向反方向平移，用了 $${poly([1, "s"], [a, ""])}$；因子 $e^{${exponentOf(a, "t")}}$ 给出的是 $${shift}$。`,
      ]);
    if (s !== 0)
      reasons.push([
        Q.of(factorial, s ** (n + 1)),
        `That leaves out the shift from $e^{${exponentOf(a, "t")}}$ and evaluates at $${s}$ itself.`,
        `这漏掉了 $e^{${exponentOf(a, "t")}}$ 带来的平移，直接在 $${s}$ 处取值。`,
      ]);
    return explainedNumber(
      [
        `Find the Laplace transform of $${signedPower("t", n)}e^{${exponentOf(a, "t")}}$ at $s = ${s}$.`,
        `求 $${signedPower("t", n)}e^{${exponentOf(a, "t")}}$ 的拉普拉斯变换在 $s = ${s}$ 处的值。`,
      ],
      answer,
      [
        labelled(
          ["Write the transform", "写出变换"],
          `With $n = ${n}$ and $a = ${a}$:`,
          `其中 $n = ${n}$，$a = ${a}$：`,
          `\\mathcal{L}\\{${signedPower("t", n)}e^{${exponentOf(a, "t")}}\\} = \\frac{${factorial}}{(${shift})^{${n + 1}}}`,
        ),
        labelled(
          ["Substitute", "代入"],
          "",
          "",
          `${s} - ${inParens(a)} = ${gap}, \\qquad \\frac{${factorial}}{${gap}^{${n + 1}}} = ${answer.toLatex()}`,
        ),
      ],
      [
        `By the first shifting theorem, $\\mathcal{L}\\{${signedPower("t", n)}\\} = \\frac{${factorial}}{s^{${n + 1}}}$ evaluated at $s - ${inParens(a)} = ${gap}$ gives the same $${answer.toLatex()}$.`,
        `由第一平移定理，$\\mathcal{L}\\{${signedPower("t", n)}\\} = \\frac{${factorial}}{s^{${n + 1}}}$ 在 $s - ${inParens(a)} = ${gap}$ 处取值，同样得 $${answer.toLatex()}$。`,
      ],
      reasons,
    );
  },
};

const transformedNumerator: KnowledgePointDef = {
  id: "the-numerator-of-a-transformed-equation",
  title: t("The numerator of a transformed equation", "变换后方程的分子"),
  explanation: t(
    "Transforming $y'' + ay' + by = 0$ uses $\\mathcal{L}\\{y''\\} = s^2Y - sy(0) - y'(0)$ and $\\mathcal{L}\\{y'\\} = sY - y(0)$. Gathering the terms in $Y$ gives the characteristic polynomial as denominator, and the initial values all collect in the numerator. Notice that $y(0)$ appears twice, because the damping term contributes to the constant part. This extra product $ay(0)$ is the part of the numerator that is most often left out.\n\n> **Watch out.** For $y'' + 3y' + 2y = 0$ with $y(0) = 1$ and $y'(0) = 4$, the numerator is $s + 4 + 3 \\cdot 1 = s + 7$, so $K = 7$, not $4$.",
    "变换 $y'' + ay' + by = 0$ 要用 $\\mathcal{L}\\{y''\\} = s^2Y - sy(0) - y'(0)$ 和 $\\mathcal{L}\\{y'\\} = sY - y(0)$。合并 $Y$ 的项后，分母是特征多项式，初值都集中在分子。注意 $y(0)$ 出现两次，因为阻尼项也贡献给常数部分。这个额外的乘积 $ay(0)$ 是分子中最常被遗漏的部分。\n\n> **注意。** 对 $y'' + 3y' + 2y = 0$，$y(0) = 1$，$y'(0) = 4$，分子是 $s + 4 + 3 \\cdot 1 = s + 7$，所以 $K = 7$，不是 $4$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 9);
    const p = nonzero(rng, 6);
    const q = nonzero(rng, 9);
    const answer = q + a * p;
    const den = poly([1, "s^2"], [a, "s"], [b, ""]);
    return explainedNumber(
      [
        `For $${poly([1, "y''"], [a, "y'"], [b, "y"])} = 0$ with $y(0) = ${p}$ and $y'(0) = ${q}$, the transform has the form $Y(s) = \\frac{As + K}{${den}}$. Find $K$.`,
        `对 $${poly([1, "y''"], [a, "y'"], [b, "y"])} = 0$，$y(0) = ${p}$，$y'(0) = ${q}$，变换的形式是 $Y(s) = \\frac{As + K}{${den}}$。求 $K$。`,
      ],
      answer,
      [
        labelled(
          ["Transform each term", "逐项变换"],
          "",
          "",
          `${poly([1, `\\left(s^2Y - ${inParens(p)}s - ${inParens(q)}\\right)`], [a, `\\left(sY - ${inParens(p)}\\right)`], [b, "Y"])} = 0`,
        ),
        labelled(
          ["Collect the initial values", "合并初值"],
          "Everything without $Y$ moves to the right:",
          "不含 $Y$ 的项移到右边：",
          `(${den})Y = ${poly([p, "s"])} + ${inParens(q)} + ${inParens(a)} \\cdot ${inParens(p)} = ${poly([p, "s"], [answer, ""])}`,
          `K = ${answer}`,
        ),
      ],
      [
        `$K = y'(0) + ay(0) = ${q} + ${inParens(a * p)} = ${answer}$, and $A = y(0) = ${p}$.`,
        `$K = y'(0) + ay(0) = ${q} + ${inParens(a * p)} = ${answer}$，而 $A = y(0) = ${p}$。`,
      ],
      [
        [
          q,
          `That leaves out $ay(0) = ${a * p}$, which the term $${poly([a, "y'"])}$ brings.`,
          `这漏掉了 $${poly([a, "y'"])}$ 一项带来的 $ay(0) = ${a * p}$。`,
        ],
        [q - a * p, "That subtracts $ay(0)$; it moves to the right side with a plus sign.", "这减去了 $ay(0)$；移到右边时它带正号。"],
        [a * p, "That leaves out $y'(0)$, which the transform of $y''$ brings.", "这漏掉了 $y''$ 的变换带来的 $y'(0)$。"],
      ],
      "integer",
    );
  },
};

const mixedEndEigenvalue: KnowledgePointDef = {
  id: "eigenvalues-with-one-fixed-end-and-one-free-end",
  title: t("Eigenvalues with one fixed end and one free end", "一端固定一端自由的特征值"),
  explanation: t(
    "For $y'' + \\lambda y = 0$ with $y(0) = 0$, the first condition leaves $y = \\sin(kx)$, where $k^2 = \\lambda$. The condition $y'(L) = 0$ then needs $\\cos(kL) = 0$, so $kL$ is an odd multiple of $\\frac{\\pi}{2}$. This differs from two fixed ends, where $kL$ is any multiple of $\\pi$. So the lowest mode fits only a quarter of a wave on the interval, and the eigenvalues involve the odd numbers only.\n\n> **Watch out.** The multiples are odd multiples of $\\frac{\\pi}{2}$, and the $2$ is squared too. For $L = 1$ the smallest eigenvalue is $\\frac{\\pi^2}{4}$, not $\\pi^2$ or $\\frac{\\pi^2}{2}$.",
    "对 $y'' + \\lambda y = 0$，$y(0) = 0$，第一个条件留下 $y = \\sin(kx)$，其中 $k^2 = \\lambda$。条件 $y'(L) = 0$ 又要求 $\\cos(kL) = 0$，所以 $kL$ 是 $\\frac{\\pi}{2}$ 的奇数倍。这与两端固定不同，那时 $kL$ 是 $\\pi$ 的任意整数倍。所以最低模式在区间上只有四分之一个波，特征值只涉及奇数。\n\n> **注意。** 这里是 $\\frac{\\pi}{2}$ 的奇数倍，而且分母的 $2$ 也要平方。对 $L = 1$，最小的特征值是 $\\frac{\\pi^2}{4}$，不是 $\\pi^2$ 或 $\\frac{\\pi^2}{2}$。",
  ),
  generate(rng) {
    const n = rng.int(1, 4);
    const length = rng.int(1, 8);
    const odd = 2 * n - 1;
    const answer = Q.of(odd * odd, 4 * length * length);
    const en = ["smallest", "second smallest", "third smallest", "fourth smallest"][n - 1];
    const zh = ["最小的", "第二小的", "第三小的", "第四小的"][n - 1];
    const oddPi = `${odd === 1 ? "" : odd}\\pi`;
    const Lk = `${length === 1 ? "" : length}k`;
    return explainedNumber(
      [
        `For $y'' + \\lambda y = 0$ with $y(0) = 0$ and $y'(${length}) = 0$, the ${en} eigenvalue is $c\\pi^2$. Find $c$.`,
        `对 $y'' + \\lambda y = 0$，$y(0) = 0$，$y'(${length}) = 0$，${zh}特征值是 $c\\pi^2$。求 $c$。`,
      ],
      answer,
      [
        labelled(["Use y(0) = 0", "用 y(0) = 0"], "", "", "y = \\sin kx, \\qquad y' = k\\cos kx"),
        labelled(
          ["Use the free end", "用自由端"],
          `$y'(${length}) = 0$ needs the cosine to vanish, at the ${en} odd multiple of $\\frac{\\pi}{2}$:`,
          `$y'(${length}) = 0$ 要求余弦为零，取$\\frac{\\pi}{2}$ 的${zh}奇数倍：`,
          `\\cos ${Lk} = 0 \\implies ${Lk} = \\frac{${oddPi}}{2}`,
        ),
        labelled(
          ["Square k", "把 k 平方"],
          "",
          "",
          `k = \\frac{${oddPi}}{${2 * length}}, \\qquad \\lambda = k^{2} = \\frac{${odd === 1 ? "" : odd * odd}\\pi^{2}}{${4 * length * length}}`,
          `c = ${answer.toLatex()}`,
        ),
      ],
      [
        `$\\cos\\frac{${oddPi}}{2} = 0$, so $y'(${length}) = 0$; and $${odd} = 2 \\cdot ${n} - 1$ is the ${en} odd number.`,
        `$\\cos\\frac{${oddPi}}{2} = 0$，所以 $y'(${length}) = 0$；而 $${odd} = 2 \\cdot ${n} - 1$ 是${zh}奇数。`,
      ],
      [
        [
          Q.of(n * n, length * length),
          "That uses two fixed ends, where $kL$ is a multiple of $\\pi$; a free end makes it an odd multiple of $\\frac{\\pi}{2}$.",
          "这用的是两端固定，那时 $kL$ 是 $\\pi$ 的倍数；自由端使它成为 $\\frac{\\pi}{2}$ 的奇数倍。",
        ],
        [
          Q.of(odd * odd, length * length),
          "That takes $kL$ as an odd multiple of $\\pi$; the cosine vanishes at odd multiples of $\\frac{\\pi}{2}$.",
          "这把 $kL$ 当成 $\\pi$ 的奇数倍；余弦在 $\\frac{\\pi}{2}$ 的奇数倍处为零。",
        ],
        [
          Q.of((odd + 2) ** 2, 4 * length * length),
          `That skips one: the ${en} eigenvalue uses the odd number $${odd}$, counting from $1$.`,
          `这多跳了一个：${zh}特征值用的是奇数 $${odd}$，从 $1$ 数起。`,
        ],
        [
          Q.of(n * n, 4 * length * length),
          `That uses $n = ${n}$ in place of the odd number $2n - 1 = ${odd}$.`,
          `这用了 $n = ${n}$，应当用奇数 $2n - 1 = ${odd}$。`,
        ],
        [
          Q.of(odd * odd, 2 * length * length),
          "That does not square the $2$ of $\\frac{\\pi}{2}$; squaring gives $4$.",
          "这没有把 $\\frac{\\pi}{2}$ 中的 $2$ 平方；平方后是 $4$。",
        ],
      ],
    );
  },
};

const loadedEndSlope: KnowledgePointDef = {
  id: "the-end-slope-of-a-loaded-boundary-value-problem",
  figure:
    differentialEquationsDrawings1["second-order-inhomogeneous-boundary-value-problems#the-end-slope-of-a-loaded-boundary-value-problem"],
  title: t("The end slope of a loaded boundary value problem", "受载边值问题的端点斜率"),
  explanation: t(
    "Integrating $y'' = c$ twice gives $y = \\frac{c}{2}x^2 + Ax + B$, with two constants that the boundary conditions must fix. Unlike an initial value problem, the slope at the left end is not given in advance: it is whatever makes the curve arrive correctly at the far end. With $y(0) = y(L) = 0$, the parabola is symmetric about the midpoint, so the two end slopes are equal and opposite.\n\n> **Watch out.** The answer is a slope, not a height, and its sign is opposite to that of $c$. For $y'' = 4$ on $[0, 3]$, $y = 2x(x - 3)$, so $y'(0) = -6$, while the lowest height is $y(1.5) = -4.5$.",
    "对 $y'' = c$ 积分两次，得 $y = \\frac{c}{2}x^2 + Ax + B$，两个常数由边界条件确定。与初值问题不同，左端的斜率不是预先给定的，它要使曲线正确到达另一端。当 $y(0) = y(L) = 0$ 时，抛物线关于中点对称，所以两端的斜率大小相等、方向相反。\n\n> **注意。** 所求的是斜率，不是高度，并且它的符号与 $c$ 相反。对 $[0, 3]$ 上的 $y'' = 4$，$y = 2x(x - 3)$，所以 $y'(0) = -6$，而最低点的高度是 $y(1.5) = -4.5$。",
  ),
  generate(rng) {
    const c = nonzero(rng, 9);
    const length = rng.int(1, 9);
    const answer = Q.of(-c * length, 2);
    const LA = `${length === 1 ? "" : length}A`;
    return explainedNumber(
      [
        `Let $y'' = ${c}$ with $y(0) = 0$ and $y(${length}) = 0$. Find $y'(0)$.`,
        `设 $y'' = ${c}$，$y(0) = 0$，$y(${length}) = 0$。求 $y'(0)$。`,
      ],
      answer,
      [
        labelled(["Integrate twice", "积分两次"], "", "", `y = ${poly([Q.of(c, 2), "x^{2}"])} + Ax + B`),
        labelled(
          ["Use the two ends", "用两端条件"],
          "",
          "",
          `y(0) = B = 0`,
          `y(${length}) = ${Q.of(c * length * length, 2).toLatex()} + ${LA} = 0 \\implies A = ${answer.toLatex()}`,
        ),
        labelled(["Differentiate at 0", "在 0 处求导"], "", "", `y'(0) = A = ${answer.toLatex()}`),
      ],
      [
        `$y'(${length}) = ${answer.neg().toLatex()}$, the opposite slope, and $y'(${length}) - y'(0) = ${c * length}$, which is $y'' = ${c}$ times the length $${length}$.`,
        `$y'(${length}) = ${answer.neg().toLatex()}$，斜率相反；$y'(${length}) - y'(0) = ${c * length}$，正是 $y'' = ${c}$ 乘以长度 $${length}$。`,
      ],
      [
        [answer.neg(), "That is the slope at the far end; at the left end the sign is the opposite.", "这是另一端的斜率；左端的符号相反。"],
        [
          Q.of(c * length),
          "That is the total change $y'(L) - y'(0) = cL$, not the slope at $0$.",
          "这是总变化量 $y'(L) - y'(0) = cL$，不是 $0$ 处的斜率。",
        ],
        [
          Q.of(-c * length),
          "That drops the $\\frac{1}{2}$: the slope changes by $cL$ across the interval, and the two end slopes split it equally.",
          "这漏掉了 $\\frac{1}{2}$：斜率在整个区间上变化 $cL$，两端斜率平分它。",
        ],
        [
          Q.of(-c * length * length, 8),
          "That is the height at the midpoint, $y\\left(\\frac{L}{2}\\right)$, not a slope.",
          "这是中点的高度 $y\\left(\\frac{L}{2}\\right)$，不是斜率。",
        ],
      ],
    );
  },
};

const airyCoefficient: KnowledgePointDef = {
  id: "a-series-coefficient-of-the-equation-y-double-prime-equals-xy",
  title: t("A series coefficient of the equation y'' = xy", "方程 y'' = xy 的级数系数"),
  explanation: t(
    "The equation $y'' = xy$ has no solutions in elementary functions, but a power series handles it well. Comparing coefficients of $x^n$ gives $(n + 2)(n + 1)a_{n + 2} = a_{n - 1}$, so each coefficient is tied to the one three places back. Two free constants, $a_0 = y(0)$ and $a_1 = y'(0)$, start two separate chains of coefficients, and the coefficient $a_2$ is zero, starting a third chain of zeros.\n\n> **Watch out.** Each coefficient is tied to the one three places back, not two. For $y(0) = 6$ and $y'(0) = 0$: $a_3 = \\frac{6}{3 \\cdot 2} = 1$; tying $a_3$ to $a_1 = 0$ would give $0$.",
    "方程 $y'' = xy$ 没有初等函数解，但幂级数能很好地处理它。比较 $x^n$ 的系数，得 $(n + 2)(n + 1)a_{n + 2} = a_{n - 1}$，所以每个系数与前面第三个系数相关。两个自由常数 $a_0 = y(0)$ 和 $a_1 = y'(0)$ 开始两条独立的系数链，系数 $a_2$ 为零，开始第三条全为零的链。\n\n> **注意。** 每个系数与前面第三个系数相关，而不是第二个。对 $y(0) = 6$，$y'(0) = 0$：$a_3 = \\frac{6}{3 \\cdot 2} = 1$；若把 $a_3$ 与 $a_1 = 0$ 联系起来，会得到 $0$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 12);
    const b = nonzero(rng, 12);
    const cubic = rng.pick([true, false]);
    const power = cubic ? 3 : 4;
    const start = cubic ? a : b;
    const other = cubic ? b : a;
    const denominator = cubic ? 6 : 12;
    const answer = Q.of(start, denominator);
    return explainedNumber(
      [
        `The solution of $y'' = xy$ with $y(0) = ${a}$ and $y'(0) = ${b}$ has a power series about $x = 0$. Find the coefficient of $x^{${power}}$.`,
        `$y'' = xy$，$y(0) = ${a}$，$y'(0) = ${b}$ 的解在 $x = 0$ 处有幂级数。求 $x^{${power}}$ 的系数。`,
      ],
      answer,
      [
        labelled(
          ["Match the coefficients of $x^n$", "比较 $x^n$ 的系数"],
          "Shift both series so that they run over the same powers:",
          "把两个级数平移，使它们按相同的幂次排列：",
          "y'' = \\sum_{n \\ge 0} (n + 2)(n + 1)a_{n+2}x^{n}, \\qquad xy = \\sum_{n \\ge 1} a_{n-1}x^{n}",
          "(n + 2)(n + 1)a_{n+2} = a_{n-1}",
        ),
        labelled(
          [`Take $n = ${power - 2}$`, `取 $n = ${power - 2}$`],
          cubic ? `Here $a_0 = y(0) = ${a}$:` : `Here $a_1 = y'(0) = ${b}$:`,
          cubic ? `这里 $a_0 = y(0) = ${a}$：` : `这里 $a_1 = y'(0) = ${b}$：`,
          `${power} \\cdot ${power - 1} \\cdot a_{${power}} = a_{${power - 3}} = ${start}`,
          `a_{${power}} = \\frac{${start}}{${denominator}}${lowestTerms(start, denominator)}`,
        ),
      ],
      cubic
        ? [
            `Differentiating $y'' = xy$ gives $y''' = y + xy'$, so $y'''(0) = y(0) = ${a}$, and $a_3 = \\frac{y'''(0)}{3!} = ${answer.toLatex()}$.`,
            `对 $y'' = xy$ 求导得 $y''' = y + xy'$，所以 $y'''(0) = y(0) = ${a}$，而 $a_3 = \\frac{y'''(0)}{3!} = ${answer.toLatex()}$。`,
          ]
        : [
            `Differentiating $y'' = xy$ twice gives $y^{(4)} = 2y' + xy''$, so $y^{(4)}(0) = 2 \\cdot ${inParens(b)} = ${2 * b}$, and $a_4 = \\frac{y^{(4)}(0)}{4!} = ${answer.toLatex()}$.`,
            `对 $y'' = xy$ 求导两次得 $y^{(4)} = 2y' + xy''$，所以 $y^{(4)}(0) = 2 \\cdot ${inParens(b)} = ${2 * b}$，而 $a_4 = \\frac{y^{(4)}(0)}{4!} = ${answer.toLatex()}$。`,
          ],
      [
        [
          Q.of(other, denominator),
          `That starts from the other initial value; $a_{${power}}$ is in the chain of $a_{${power - 3}}$, three places back.`,
          `这是从另一个初值出发；$a_{${power}}$ 在 $a_{${power - 3}}$ 的链上，相隔三位。`,
        ],
        [
          Q.of(start, power),
          `That divides by $${power}$ only; the factor is $${power} \\cdot ${power - 1}$.`,
          `这只除以 $${power}$；因子是 $${power} \\cdot ${power - 1}$。`,
        ],
        [
          Q.of(start, power - 1),
          `That divides by $${power - 1}$ only; the factor is $${power} \\cdot ${power - 1}$.`,
          `这只除以 $${power - 1}$；因子是 $${power} \\cdot ${power - 1}$。`,
        ],
        [
          start,
          `That is $a_{${power - 3}}$ itself, before dividing by $${power} \\cdot ${power - 1}$.`,
          `这是 $a_{${power - 3}}$ 本身，还没有除以 $${power} \\cdot ${power - 1}$。`,
        ],
      ],
    );
  },
};

const indicialSum: KnowledgePointDef = {
  id: "the-sum-of-the-indicial-roots",
  title: t("The sum of the indicial roots", "指标根之和"),
  explanation: t(
    "For $x^2y'' + xP(x)y' + Q(x)y = 0$ with a regular singular point at the origin, only $p = P(0)$ and $q = Q(0)$ enter the indicial equation $r(r - 1) + pr + q = 0$. Written out, this is $r^2 + (p - 1)r + q = 0$, and by Vieta's formulas the roots add to $1 - p$. So $q$ and the higher terms of the coefficients play no part in the sum of the roots.\n\n> **Watch out.** The sum is $1 - p$, not $-p$: the product $r(r - 1)$ contributes $-r$. For $x^2y'' + 3xy' + y = 0$ the indicial equation is $r^2 + 2r + 1 = 0$, so the roots add to $-2$, not $-3$.",
    "对原点为正则奇点的 $x^2y'' + xP(x)y' + Q(x)y = 0$，只有 $p = P(0)$ 和 $q = Q(0)$ 进入指标方程 $r(r - 1) + pr + q = 0$。展开得 $r^2 + (p - 1)r + q = 0$，由韦达定理，两根之和是 $1 - p$。所以 $q$ 和系数的高次项对根之和都不起作用。\n\n> **注意。** 两根之和是 $1 - p$，不是 $-p$：乘积 $r(r - 1)$ 贡献了 $-r$。对 $x^2y'' + 3xy' + y = 0$，指标方程是 $r^2 + 2r + 1 = 0$，所以两根之和是 $-2$，不是 $-3$。",
  ),
  generate(rng) {
    const p = nonzero(rng, 9);
    const q = nonzero(rng, 9);
    const c = nonzero(rng, 5);
    const answer = 1 - p;
    const pr = p === 1 ? "r" : `${inParens(p)}r`;
    return explainedNumber(
      [
        `Find the sum of the indicial roots at $x = 0$ of $x^2y'' + ${p === 1 ? "" : p === -1 ? "-" : p}xy' + (${poly([q, ""], [c, "x"])})y = 0$.`.replace(
          "+ -",
          "- ",
        ),
        `求 $x^2y'' + ${p === 1 ? "" : p === -1 ? "-" : p}xy' + (${poly([q, ""], [c, "x"])})y = 0$ 在 $x = 0$ 处的指标根之和。`.replace(
          "+ -",
          "- ",
        ),
      ],
      answer,
      [
        labelled(
          ["Read off $p$ and $q$", "读出 $p$ 与 $q$"],
          `Here $xP(x) = ${p === 1 ? "" : p === -1 ? "-" : p}x$ and $Q(x) = ${poly([q, ""], [c, "x"])}$:`,
          `这里 $xP(x) = ${p === 1 ? "" : p === -1 ? "-" : p}x$，$Q(x) = ${poly([q, ""], [c, "x"])}$：`,
          `p = P(0) = ${p}, \\qquad q = Q(0) = ${q}`,
        ),
        labelled(
          ["Write the indicial equation", "写出指标方程"],
          "",
          "",
          `r(r - 1) + ${pr} + ${inParens(q)} = 0 \\iff ${poly([1, "r^{2}"], [p - 1, "r"], [q, ""])} = 0`,
        ),
        labelled(
          ["Add the roots", "求两根之和"],
          "By Vieta's formulas the sum is minus the coefficient of $r$:",
          "由韦达定理，两根之和是 $r$ 的系数的相反数：",
          `r_1 + r_2 = ${answer}`,
        ),
      ],
      [
        `The coefficient of $r$ is $-1 + ${inParens(p)} = ${p - 1}$, from $r(r - 1)$ and $pr$ together, and minus it is $${answer}$. The term $${poly([c, "x"])}$ of $Q(x)$ is zero at $x = 0$ and plays no part.`,
        `$r$ 的系数是 $-1 + ${inParens(p)} = ${p - 1}$，来自 $r(r - 1)$ 与 $pr$ 两部分，它的相反数是 $${answer}$。$Q(x)$ 中的项 $${poly([c, "x"])}$ 在 $x = 0$ 处为零，不起作用。`,
      ],
      [
        [-p, "That leaves out the $-r$ that comes from $r(r - 1)$.", "这漏掉了 $r(r - 1)$ 带来的 $-r$。"],
        [p - 1, "That is the coefficient of $r$; the sum of the roots is minus it.", "这是 $r$ 的系数；两根之和是它的相反数。"],
        [q, "That is the product of the roots, not their sum.", "这是两根之积，不是两根之和。"],
        [p, "That is $p$ itself; the sum of the roots is $1 - p$.", "这是 $p$ 本身；两根之和是 $1 - p$。"],
      ],
      "integer",
    );
  },
};

const twoTrapezoidalSteps: KnowledgePointDef = {
  id: "two-trapezoidal-steps-for-pure-decay",
  figure: differentialEquationsDrawings1["the-trapezoidal-method#two-trapezoidal-steps-for-pure-decay"],
  title: t("Two trapezoidal steps for pure decay", "纯衰减的两个梯形步"),
  explanation: t(
    "For $y' = -ky$, the trapezoidal rule reads $y_{n + 1} = y_n + \\frac{h}{2}(-ky_n - ky_{n + 1})$. Although the method is implicit, this equation is linear in the new value, so it can be solved at once to give $y_{n + 1} = \\frac{2 - hk}{2 + hk}y_n$. Each step multiplies by the same factor, so two steps multiply by its square. The size of the factor is always below 1, which is why the method is stable.\n\n> **Watch out.** The factor is $\\frac{2 - hk}{2 + hk}$, not the explicit Euler factor $1 - hk$, and two steps multiply by its square. For $y' = -2y$ with $h = 0.5$ from $y_0 = 9$: the factor is $\\frac{1}{3}$, so $y_2 = 9 \\cdot \\frac{1}{9} = 1$; explicit Euler would give $0$.",
    "对 $y' = -ky$，梯形法则是 $y_{n + 1} = y_n + \\frac{h}{2}(-ky_n - ky_{n + 1})$。虽然方法是隐式的，但这个方程对新值是线性的，所以可以立即解出 $y_{n + 1} = \\frac{2 - hk}{2 + hk}y_n$。每一步都乘以同样的因子，所以两步乘以它的平方。因子的大小总小于 1，这就是这个方法稳定的原因。\n\n> **注意。** 因子是 $\\frac{2 - hk}{2 + hk}$，不是显式欧拉法的因子 $1 - hk$，而且两步要乘以它的平方。对 $y' = -2y$，$h = 0.5$，$y_0 = 9$：因子为 $\\frac{1}{3}$，所以 $y_2 = 9 \\cdot \\frac{1}{9} = 1$；显式欧拉法会给出 $0$。",
  ),
  generate(rng) {
    const k = rng.int(1, 6);
    const d = rng.pick([1, 2, 4]);
    const start = rng.int(1, 9);
    const top = 2 * d - k;
    const bottom = 2 * d + k;
    const factor = Q.of(top, bottom);
    const answer = factor.mul(factor).mul(Q.of(start));
    const forward = Q.of(d - k, d);
    const hk = Q.of(k, d);
    const first = factor.mul(Q.of(start));
    const change = first.sub(Q.of(start));
    const sum = first.sign() < 0 ? `${start} - ${first.abs().toLatex()}` : `${start} + ${first.toLatex()}`;
    return explainedNumber(
      [
        `Apply two steps of the trapezoidal method with $h = ${Q.of(1, d).toLatex()}$ to $y' = ${k === 1 ? "-" : `-${k}`}y$, $y(0) = ${start}$. Find the value it gives for $y(${Q.of(2, d).toLatex()})$.`,
        `对 $y' = ${k === 1 ? "-" : `-${k}`}y$，$y(0) = ${start}$，用 $h = ${Q.of(1, d).toLatex()}$ 的梯形法走两步。求它给出的 $y(${Q.of(2, d).toLatex()})$ 的值。`,
      ],
      answer,
      [
        labelled(
          ["Solve one step for the new value", "解出一步的新值"],
          "The equation is linear in $y_{n+1}$:",
          "方程对 $y_{n+1}$ 是线性的：",
          `y_{n+1} = \\frac{2 - hk}{2 + hk}\\,y_n = \\frac{2 - ${hk.toLatex()}}{2 + ${hk.toLatex()}}\\,y_n = ${signedFactor(factor)} \\cdot y_n`,
        ),
        labelled(
          ["Take two steps", "走两步"],
          "Each step multiplies by the same factor:",
          "每一步都乘以同一个因子：",
          `y_2 = ${start} \\cdot \\left(${factor.toLatex()}\\right)^{2} = ${answer.toLatex()}`,
        ),
      ],
      [
        `The first value $y_1 = ${first.toLatex()}$ satisfies the trapezoidal equation: $y_1 - y_0 = ${change.toLatex()}$, and $-\\frac{${k}}{${2 * d}}\\left(${sum}\\right) = ${change.toLatex()}$.`,
        `第一步的值 $y_1 = ${first.toLatex()}$ 满足梯形法方程：$y_1 - y_0 = ${change.toLatex()}$，而 $-\\frac{${k}}{${2 * d}}\\left(${sum}\\right) = ${change.toLatex()}$。`,
      ],
      [
        [first, "That is the value after one step only.", "这只是一步之后的值。"],
        [
          forward.mul(forward).mul(Q.of(start)),
          "That is explicit Euler, with the factor $1 - hk$ at each step.",
          "这是显式欧拉法，每一步的因子是 $1 - hk$。",
        ],
        [
          Q.of(d * d * start, (d + k) * (d + k)),
          "That is implicit Euler, with the factor $\\frac{1}{1 + hk}$ at each step.",
          "这是隐式欧拉法，每一步的因子是 $\\frac{1}{1 + hk}$。",
        ],
        [first.mul(Q.of(2)), "That doubles the factor instead of squaring it.", "这把因子乘以 $2$，而不是平方。"],
      ],
    );
  },
};

const invariantLineSlope: KnowledgePointDef = {
  id: "the-slope-of-a-straight-line-solution",
  title: t("The slope of a straight-line solution", "直线解的斜率"),
  explanation: t(
    "A trajectory through the origin that stays on a straight line must have velocity along that line at every point, so its direction is an eigenvector. For an upper triangular matrix, the eigenvalues can be read off the diagonal, and the $x$-axis is one of these lines. The other line comes from solving $(A - dI)\\mathbf{v} = \\mathbf{0}$ for the second eigenvalue $d$, whose first row gives the slope of the line directly.\n\n> **Watch out.** Solve $(a - d)x + by = 0$ for $\\frac{y}{x}$, which is $\\frac{d - a}{b}$. For $\\begin{pmatrix} 1 & 2 \\\\ 0 & 5 \\end{pmatrix}$ the row is $-4x + 2y = 0$, so the slope is $2$, not $-2$ and not $\\frac{1}{2}$.",
    "过原点且保持在直线上的轨线，在每一点的速度都必须沿这条直线，所以它的方向是特征向量。对上三角矩阵，特征值可以从对角线读出，$x$ 轴是其中一条直线。另一条直线由第二个特征值 $d$ 解 $(A - dI)\\mathbf{v} = \\mathbf{0}$ 得到，它的第一行直接给出直线的斜率。\n\n> **注意。** 由 $(a - d)x + by = 0$ 解出 $\\frac{y}{x}$，结果是 $\\frac{d - a}{b}$。对 $\\begin{pmatrix} 1 & 2 \\\\ 0 & 5 \\end{pmatrix}$，这一行是 $-4x + 2y = 0$，所以斜率为 $2$，不是 $-2$，也不是 $\\frac{1}{2}$。",
  ),
  generate(rng) {
    const a = rng.int(-6, 6);
    const d = different(rng, -6, 6, a);
    const b = nonzero(rng, 6);
    const answer = Q.of(d - a, b);
    const times = d === 1 ? "" : d === -1 ? "-" : `${d}`;
    const v = `\\begin{pmatrix} ${b} \\\\ ${d - a} \\end{pmatrix}`;
    return explainedNumber(
      [
        `The system $\\mathbf{x}' = ${matrix2(a, b, 0, d)}\\mathbf{x}$ has solutions that stay on the $x$-axis, and also on one other line through the origin. Find the slope of that line.`,
        `方程组 $\\mathbf{x}' = ${matrix2(a, b, 0, d)}\\mathbf{x}$ 有保持在 $x$ 轴上的解，也有保持在另一条过原点直线上的解。求那条直线的斜率。`,
      ],
      answer,
      [
        labelled(
          ["Read the eigenvalues", "读出特征值"],
          `The matrix is upper triangular, so the eigenvalues are $${a}$, along the $x$-axis, and $${d}$.`,
          `矩阵是上三角的，所以特征值是沿 $x$ 轴的 $${a}$ 与 $${d}$。`,
        ),
        labelled(
          ["Solve for the eigenvector", "求特征向量"],
          `The first row of $(A - ${inParens(d)}I)\\mathbf{v} = \\mathbf{0}$ gives the slope.`,
          `$(A - ${inParens(d)}I)\\mathbf{v} = \\mathbf{0}$ 的第一行给出斜率。`,
          `${poly([a - d, "x"], [b, "y"])} = 0, \\qquad \\frac{y}{x} = ${answer.toLatex()}`,
        ),
      ],
      [
        `The vector $${v}$ lies on that line, and $${matrix2(a, b, 0, d)}${v} = \\begin{pmatrix} ${b * d} \\\\ ${d * (d - a)} \\end{pmatrix} = ${d === 0 ? "\\mathbf{0}" : `${times}${v}`}$.`,
        `向量 $${v}$ 在这条直线上，并且 $${matrix2(a, b, 0, d)}${v} = \\begin{pmatrix} ${b * d} \\\\ ${d * (d - a)} \\end{pmatrix} = ${d === 0 ? "\\mathbf{0}" : `${times}${v}`}$。`,
      ],
      [
        [Q.of(a - d, b), "The sign is lost when $by$ is left alone on one side.", "把 $by$ 单独留在一边时丢了符号。"],
        [Q.of(b, d - a), "That is $\\frac{x}{y}$; the slope is $\\frac{y}{x}$.", "这是 $\\frac{x}{y}$；斜率是 $\\frac{y}{x}$。"],
        [Q.of(d - a), "That forgets to divide by the entry $b$.", "这里忘了除以元素 $b$。"],
        [
          Q.of(d + a, b),
          "That adds the diagonal entries; the eigenvalue is subtracted from $a$.",
          "这是把对角元素相加；应当从 $a$ 中减去特征值。",
        ],
      ],
    );
  },
};

const bernoulliCoefficient: KnowledgePointDef = {
  id: "the-coefficient-after-a-bernoulli-substitution",
  title: t("The coefficient after a Bernoulli substitution", "伯努利代换后的系数"),
  explanation: t(
    "The substitution $v = y^{1 - n}$ turns $y' + py = qy^n$ into a linear equation. Dividing by $y^n$ gives $y^{-n}y' + py^{1 - n} = q$, and since $v' = (1 - n)y^{-n}y'$, multiplying by $1 - n$ gives $v' + (1 - n)pv = (1 - n)q$. Both the coefficient of $v$ and the new right side pick up the factor $1 - n$. For $n \\ge 2$, this factor is negative, which reverses the sign of the coefficient. For $y' + 4y = 3y^{2}$, $v = y^{-1}$ gives $v' - 4v = -3$, so $K = -4$.\n\n> **Watch out.** The factor is $1 - n$, not $n$ or $n - 1$, and $K$ comes from the coefficient $p$ of $y$, not from the coefficient $q$ on the right.",
    "代换 $v = y^{1 - n}$ 把 $y' + py = qy^n$ 变成线性方程。除以 $y^n$ 得 $y^{-n}y' + py^{1 - n} = q$，由于 $v' = (1 - n)y^{-n}y'$，再乘以 $1 - n$ 得 $v' + (1 - n)pv = (1 - n)q$。$v$ 的系数和新的右边都多了因子 $1 - n$。当 $n \\ge 2$ 时，这个因子是负的，使系数变号。对 $y' + 4y = 3y^{2}$，$v = y^{-1}$ 给出 $v' - 4v = -3$，所以 $K = -4$。\n\n> **注意。** 因子是 $1 - n$，不是 $n$，也不是 $n - 1$；并且 $K$ 来自 $y$ 的系数 $p$，而不是右边的系数 $q$。",
  ),
  generate(rng) {
    const p = nonzero(rng, 9);
    const q = rng.int(2, 9);
    const n = rng.int(2, 6);
    const answer = (1 - n) * p;
    const lhs = poly([1, "y'"], [p, "y"]);
    const fn = n === 2 ? "-" : `${1 - n}`;
    return explainedNumber(
      [
        `The substitution $v = y^{${1 - n}}$ turns $${lhs} = ${q}y^{${n}}$ into a linear equation $v' + Kv = g$. Find $K$.`,
        `代换 $v = y^{${1 - n}}$ 把 $${lhs} = ${q}y^{${n}}$ 变成线性方程 $v' + Kv = g$。求 $K$。`,
      ],
      answer,
      [
        labelled(
          ["Divide by the power of y", "除以 y 的幂"],
          `Dividing by $y^{${n}}$:`,
          `除以 $y^{${n}}$：`,
          `y^{${-n}}y' ${p < 0 ? "-" : "+"} ${Math.abs(p) === 1 ? "" : Math.abs(p)}y^{${1 - n}} = ${q}`,
        ),
        labelled(
          ["Rewrite in terms of v", "用 v 改写"],
          `Since $v' = ${fn}y^{${-n}}y'$, multiply by $${1 - n}$:`,
          `由于 $v' = ${fn}y^{${-n}}y'$，两边乘以 $${1 - n}$：`,
          `v' + ${inParens(1 - n)} \\cdot ${inParens(p)}v = ${(1 - n) * q}`,
          `K = ${answer}`,
        ),
      ],
      [
        `Term by term: $${fn}y^{${-n}}y' = v'$, $${1 - n} \\cdot ${inParens(p)}y^{${1 - n}} = ${poly([answer, "v"])}$ and $${1 - n} \\cdot ${q} = ${(1 - n) * q}$, so the equation is $${poly([1, "v'"], [answer, "v"])} = ${(1 - n) * q}$.`,
        `逐项看：$${fn}y^{${-n}}y' = v'$，$${1 - n} \\cdot ${inParens(p)}y^{${1 - n}} = ${poly([answer, "v"])}$，$${1 - n} \\cdot ${q} = ${(1 - n) * q}$，所以方程是 $${poly([1, "v'"], [answer, "v"])} = ${(1 - n) * q}$。`,
      ],
      [
        [p, `That forgets to multiply by $1 - n = ${1 - n}$.`, `这里忘了乘以 $1 - n = ${1 - n}$。`],
        [
          -answer,
          `That multiplies by $n - 1 = ${n - 1}$; the factor from $v'$ is $1 - n = ${1 - n}$.`,
          `这是乘以 $n - 1 = ${n - 1}$；由 $v'$ 得到的因子是 $1 - n = ${1 - n}$。`,
        ],
        [(1 - n) * q, "That is the new right side $g$; $K$ is the coefficient of $v$.", "这是新的右边 $g$；$K$ 是 $v$ 的系数。"],
        [n * p, `That multiplies by $n = ${n}$; the factor is $1 - n = ${1 - n}$.`, `这是乘以 $n = ${n}$；因子是 $1 - n = ${1 - n}$。`],
      ],
      "integer",
    );
  },
};

/** deeperDifferentialEquationsPoints gives, by topic id, the knowledge points added after a Differential Equations topic's own. */
export const deeperDifferentialEquationsPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "exact-differential-equations": [levelThroughAPoint],
  "classifying-equilibrium-solutions-of-first-order-odes": [bifurcationValue],
  "logistic-growth-models-with-first-order-odes": [largestHarvest],
  "exponential-growth-and-decay-models-with-first-order-odes-calculating-unknown-times-and-initial-values": [initialFromTwoReadings],
  "exponential-growth-and-decay-models-with-first-order-odes-half-life-problems": [halfLifeFromReadings],
  "solving-the-logistic-growth-equation": [logisticAfterGrowthFactor],
  "falling-body-problems-with-quadratic-drag": [dragFromTerminal],
  "modeling-escape-velocity-with-first-order-odes": [escapeRatio],
  "linear-differential-operators": [annihilatorOrder],
  "second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots": [boundedSlope],
  "second-order-homogeneous-odes-characteristic-equations-with-repeated-roots": [peakWithRepeatedRoot],
  "second-order-homogeneous-odes-characteristic-equations-with-complex-roots": [firstZeroOfDampedOscillation],
  "second-order-inhomogeneous-odes-with-exponential-forcing": [forcingAtADoubleRoot],
  "simple-harmonic-oscillators": [frequencyFromStretch],
  "damped-oscillators": [quasiFrequency],
  "forced-oscillators": [beats],
  "modeling-capacitor-charge-in-rcl-circuits-with-second-order-odes": [criticalResistance],
  "equilibrium-points-and-stability-for-systems-of-odes": [stabilityThreshold],
  "phase-portraits-for-linear-systems-with-complex-eigenvalues": [parameterForCenter],
  "phase-portraits-for-linear-systems-with-repeated-eigenvalues": [parameterForRepeatedEigenvalue],
  "matrix-exponentials": [determinantOfExponential],
  "laplace-transforms-of-derivatives": [slopeFromTransform],
  "inverse-laplace-transforms": [convolutionOfPowers],
  "introduction-to-fourier-series": [sineCoefficientOfAStep],
  "introduction-to-recurrence-relations": [recurrenceGrowth],
  "error-in-numerical-methods": [richardson],
  "falling-body-problems-with-linear-drag": [timeConstantOfDrag],
  "modeling-rl-circuits-with-first-order-odes": [rateOfCurrent],
  "second-order-homogeneous-initial-value-problems": [conditionsAtLaterTime],
  "cauchy-euler-equations-characteristic-equations-with-distinct-real-roots": [equationFromPowers],
  "cauchy-euler-equations-characteristic-equations-with-repeated-roots": [coefficientForRepeatedRoot],
  "cauchy-euler-equations-characteristic-equations-with-complex-roots": [coefficientFromOscillatingSolution],
  "reduction-of-order": [equationForMultiplier],
  "resonance-in-vibrating-systems": [springForResonance],
  "modeling-current-in-rcl-circuits-with-second-order-odes": [capacitanceForResonance],
  "the-first-shifting-theorem-of-laplace-transforms": [shiftedTransformAtPoint],
  "the-second-shifting-theorem-of-laplace-transforms": [stepOnUnshiftedFunction],
  "the-unit-step-function": [integralOfSteps],
  "laplace-transforms-of-integrals": [inverseDividedByS],
  "laplace-transforms-of-piecewise-continuous-functions": [periodicPulseTrain],
  "properties-of-fourier-series": [halfPeriodShift],
  "fourier-sine-series": [sineSeriesOfLinear],
  "fourier-cosine-series": [cosineSeriesOfQuadratic],
  "fourier-series-of-arbitrary-period": [harmonicFromFrequency],
  "convergence-of-fourier-series": [gibbsOvershoot],
  "eigenvalues-and-eigenfunctions-of-homogeneous-bvps": [countingEigenvalues],
  "the-implicit-euler-method": [severalImplicitSteps],
  "stability-of-numerical-methods": [stepWithoutOvershoot],
  "order-of-numerical-methods": [stepsForTargetError],
  "the-modified-euler-method": [midpointStep],
  "the-rk4-method": [rk4OfTime],
  "the-lotka-volterra-predator-prey-model": [harvestingBothSpecies],
  "power-series-solutions-of-differential-equations": [radiusOfConvergence],
  "modeling-mixture-problems-with-first-order-linear-odes": [rateWithChangingVolume],
  "bernoulli-differential-equations": [constantBernoulliSolution],
  "clairaut-differential-equations": [clairautLinesThroughPoint],
  "inhibited-growth-models-with-first-order-odes": [limitFromThreeReadings],
  "solving-first-order-odes-using-separation-of-variables": [blowUpTime],
  "general-solutions-of-first-order-linear-odes": [constantSolutionValue],
  "solving-first-order-linear-odes-with-exponential-forcing": [noTransientExponential],
  "solving-first-order-linear-odes-using-integrating-factors": [boundedAtOrigin],
  "homogeneous-functions": [eulerHomogeneous],
  "solving-exact-odes-using-integrating-factors": [powerMakingExact],
  "equilibrium-solutions-of-first-order-odes": [semistableLimit],
  "analyzing-slope-fields-for-nonautonomous-differential-equations": [isoclineOfSlope],
  "modeling-mixture-problems-with-first-order-separable-odes": [tankTransient],
  "orthogonal-trajectories": [orthogonalThroughPoint],
  "velocity-and-acceleration-as-functions-of-displacement": [accelerationFromPower],
  "newtons-law-of-universal-gravitation": [periodOfOrbit],
  "modeling-rc-circuits-with-first-order-odes": [initialCurrent],
  "differential-operators": [operatorOnExponential],
  "expressing-homogeneous-odes-as-first-order-systems": [companionProduct],
  "solving-homogeneous-systems-of-odes-with-complex-eigenvalues": [oscillationRate],
  "linearity-of-laplace-transforms": [polynomialTransform],
  "the-smoothness-property-of-laplace-transforms": [powerTimesExponentialTransform],
  "solving-second-order-odes-using-laplace-transforms": [transformedNumerator],
  "second-order-homogeneous-boundary-value-problems": [mixedEndEigenvalue],
  "second-order-inhomogeneous-boundary-value-problems": [loadedEndSlope],
  "taylor-series-solutions-of-differential-equations": [airyCoefficient],
  "the-method-of-frobenius": [indicialSum],
  "the-trapezoidal-method": [twoTrapezoidalSteps],
  "phase-portraits-for-linear-systems-with-real-distinct-eigenvalues": [invariantLineSlope],
  "reducing-odes-to-first-order-linear-by-substitution": [bernoulliCoefficient],
};
