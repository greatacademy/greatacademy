// Third knowledge points for thin topics of Differential Equations, from repeated
// eigenvalues to numerical methods: the reverse question, a harder case or a common trap.
// See `deeperDifferentialEquationsThird2Points`.

import type { KnowledgePointDef, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly, Q } from "@ga/subject-math";
import { differentialEquationsDrawings1 } from "../explanation-drawings-differential-equations-1.ts";
import { explainedChoice, numberProblem, why } from "../problems.ts";
import { ask, choose, type Pair, point } from "../university-kit.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** apart drops the mistakes whose value is the answer or repeats an earlier one. */
const apart = (answer: number | Q, mistakes: readonly { readonly value: number | Q; readonly why: Text }[]) => {
  const key = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v).toLatex();
  return mistakes.filter((m, i, all) => key(m.value) !== key(answer) && all.findIndex((x) => key(x.value) === key(m.value)) === i);
};

/** nz picks a nonzero integer from -r to r. */
const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** expOf writes e to a multiple of a variable, leaving out a coefficient of 1. */
const expOf = (k: number, v = "t") => `e^{${k === 1 ? "" : k === -1 ? "-" : k}${v}}`;
/** mat writes a two by two matrix by rows. */
const mat = (a: number | string, b: number | string, c: number | string, d: number | string) =>
  `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
/** vec writes a column vector with two entries. */
const vec = (a: number | string, b: number | string) => `\\begin{pmatrix} ${a} \\\\ ${b} \\end{pmatrix}`;
/** angle writes a sine or cosine of a multiple of a variable, leaving out a multiple of 1. */
const angle = (fn: string, n: number, v: string) => `\\${fn} ${n === 1 ? "" : n}${v}`;

const pairedEigenvector = point(
  "the-eigenvector-paired-with-a-generalized-eigenvector",
  ["The eigenvector paired with a generalized eigenvector", "与广义特征向量配对的特征向量"],
  [
    "A defective system also has the solution $e^{\\lambda t}(t\\mathbf{v} + \\mathbf{w})$. It is easiest to choose $\\mathbf{w}$ first and compute $\\mathbf{v} = (A - \\lambda I)\\mathbf{w}$, which is automatically an eigenvector, because $(A - \\lambda I)^{2}$ is the zero matrix. For $A = \\begin{pmatrix} 4 & 1 \\\\ -1 & 2 \\end{pmatrix}$ with $\\lambda = 3$ and $\\mathbf{w} = (1, 0)$: $A - 3I = \\begin{pmatrix} 1 & 1 \\\\ -1 & -1 \\end{pmatrix}$, so $\\mathbf{v} = (1, -1)$.\n\n> **Watch out.** Subtract $\\lambda$ from the diagonal before multiplying; and multiplying by $(1, 0)$ or $(0, 1)$ picks out a column of the matrix, not a row.",
    "亏损方程组还有解 $e^{\\lambda t}(t\\mathbf{v} + \\mathbf{w})$。最简单的做法是先选 $\\mathbf{w}$，再计算 $\\mathbf{v} = (A - \\lambda I)\\mathbf{w}$；它自动是特征向量，因为 $(A - \\lambda I)^{2}$ 是零矩阵。对 $A = \\begin{pmatrix} 4 & 1 \\\\ -1 & 2 \\end{pmatrix}$，$\\lambda = 3$，$\\mathbf{w} = (1, 0)$：$A - 3I = \\begin{pmatrix} 1 & 1 \\\\ -1 & -1 \\end{pmatrix}$，所以 $\\mathbf{v} = (1, -1)$。\n\n> **注意。** 先从对角线减去 $\\lambda$ 再相乘；乘以 $(1, 0)$ 或 $(0, 1)$ 取出的是矩阵的一列，而不是一行。",
  ],
  (rng) => {
    const p = nz(rng, 4);
    const q = nz(rng, 4);
    const l = nz(rng, 6);
    const A = mat(l + p * q, p * p, -q * q, l - p * q);
    const useFirst = rng.bool();
    const w = useFirst ? vec(1, 0) : vec(0, 1);
    const v = useFirst ? [p * q, -q * q] : [p * p, -p * q];
    const firstEntry = rng.bool();
    const answer = (firstEntry ? v[0] : v[1]) as number;
    const raw = useFirst ? (firstEntry ? l + p * q : -q * q) : firstEntry ? p * p : l - p * q;
    const other = (firstEntry ? v[1] : v[0]) as number;
    const name: Pair = firstEntry ? ["first", "第一"] : ["second", "第二"];
    const row = (useFirst ? [p * q, p * p] : [-q * q, -p * q])[firstEntry ? 0 : 1] as number;
    const [v1, v2] = v as [number, number];
    const N = mat(p * q, p * p, -q * q, -p * q);
    return numberProblem({
      prompt: t(
        `$A = ${A}$ has the repeated eigenvalue $${l}$ and is defective. For $\\mathbf{w} = ${w}$, find the ${name[0]} entry of $\\mathbf{v} = (A - \\lambda I)\\mathbf{w}$.`,
        `$A = ${A}$ 有重特征值 $${l}$，且是亏损的。对 $\\mathbf{w} = ${w}$，求 $\\mathbf{v} = (A - \\lambda I)\\mathbf{w}$ 的${name[1]}个分量。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(raw, "That multiplies by $A$; subtract $\\lambda$ from the diagonal first.", "这是乘了 $A$；要先从对角线减去 $\\lambda$。"),
        why(-answer, "The sign is flipped.", "符号反了。"),
        why(other, "That is the other entry of $\\mathbf{v}$.", "这是 $\\mathbf{v}$ 的另一个分量。"),
        why(row, "That reads a row; multiplying by $\\mathbf{w}$ picks out a column.", "这是读了一行；乘以 $\\mathbf{w}$ 取出的是一列。"),
      ]),
      solution: walked(
        [
          [["Subtract the eigenvalue", "减去特征值"], t("", ""), [`A - ${paren(l)}I = ${N}`]],
          [
            ["Multiply by w", "乘以 w"],
            t(`It picks out column ${useFirst ? 1 : 2}:`, `它取出第 ${useFirst ? 1 : 2} 列：`),
            [`\\mathbf{v} = ${N}${w} = ${vec(v1, v2)}`],
          ],
        ],
        t(
          `$\\mathbf{v}$ is an eigenvector: $${N}${vec(v1, v2)} = ${vec(0, 0)}$, as $(A - \\lambda I)^{2} = 0$ requires.`,
          `$\\mathbf{v}$ 是特征向量：$${N}${vec(v1, v2)} = ${vec(0, 0)}$，正如 $(A - \\lambda I)^{2} = 0$ 所要求的。`,
        ),
      ),
    });
  },
);

const exponentialForcingVector = point(
  "an-exponential-forcing-vector",
  ["An exponential forcing vector", "指数强迫向量"],
  [
    "For $\\mathbf{x}' = A\\mathbf{x} + e^{mt}\\mathbf{b}$, when $m$ is not an eigenvalue, try $\\mathbf{x}_{p} = e^{mt}\\mathbf{a}$. This gives $(mI - A)\\mathbf{a} = \\mathbf{b}$. The two entries are coupled, so a triangular system is solved from the bottom row up. For $x_{1}' = x_{1} + x_{2} + 3e^{2t}$, $x_{2}' = -x_{2} + 3e^{2t}$: the second row gives $3a_{2} = 3$, so $a_{2} = 1$, and the first gives $a_{1} - 1 = 3$, so $a_{1} = 4$.\n\n> **Watch out.** Carry $a_{2}$ into the first equation: dropping the coupling term $\\beta a_{2}$, or moving it with the wrong sign, gives the wrong $a_{1}$.",
    "对 $\\mathbf{x}' = A\\mathbf{x} + e^{mt}\\mathbf{b}$，当 $m$ 不是特征值时，设 $\\mathbf{x}_{p} = e^{mt}\\mathbf{a}$，得 $(mI - A)\\mathbf{a} = \\mathbf{b}$。两个分量是耦合的，所以三角形方程组要从最后一行向上解。对 $x_{1}' = x_{1} + x_{2} + 3e^{2t}$，$x_{2}' = -x_{2} + 3e^{2t}$：第二行给出 $3a_{2} = 3$，所以 $a_{2} = 1$；第一行给出 $a_{1} - 1 = 3$，所以 $a_{1} = 4$。\n\n> **注意。** 要把 $a_{2}$ 代入第一个方程：漏掉耦合项 $\\beta a_{2}$，或移项时符号弄错，都会得到错误的 $a_{1}$。",
  ],
  (rng) => {
    const alpha = nz(rng, 5);
    const delta = nz(rng, 5);
    const beta = nz(rng, 4);
    const m = rng.pick([-3, -2, -1, 1, 2, 3].filter((v) => v !== alpha && v !== delta));
    const a1 = nz(rng, 5);
    const a2 = nz(rng, 5);
    const f2 = (m - delta) * a2;
    const f1 = (m - alpha) * a1 - beta * a2;
    const e = expOf(m);
    const first = poly([alpha, "x_{1}"], [beta, "x_{2}"], [f1, e]);
    const second = poly([delta, "x_{2}"], [f2, e]);
    return numberProblem({
      prompt: t(
        `$x_{1}' = ${first}$, $x_{2}' = ${second}$ has a particular solution with $x_{1} = a_{1}${e}$ and $x_{2} = a_{2}${e}$. Find $a_{1}$.`,
        `$x_{1}' = ${first}$，$x_{2}' = ${second}$ 有一个特解，其中 $x_{1} = a_{1}${e}$，$x_{2} = a_{2}${e}$。求 $a_{1}$。`,
      ),
      answer: a1,
      mistakes: apart(a1, [
        why(
          Q.of(f1, m - alpha),
          "That drops the coupling term $\\beta a_{2}$ from the first equation.",
          "这是在第一个方程中漏掉了耦合项 $\\beta a_{2}$。",
        ),
        why(Q.of(f1 - beta * a2, m - alpha), "The coupling term moved across with the wrong sign.", "耦合项移项时符号弄错了。"),
        why(
          -a1,
          "The sign is flipped: the system is $(mI - A)\\mathbf{a} = \\mathbf{b}$.",
          "符号反了：方程组是 $(mI - A)\\mathbf{a} = \\mathbf{b}$。",
        ),
        why(a2, "That is $a_{2}$, from the second equation.", "这是由第二个方程得到的 $a_{2}$。"),
      ]),
      solution: walked(
        [
          [
            ["Solve the second equation", "解第二个方程"],
            t(`Substituting $x_{2} = a_{2}${e}$ and dividing by $${e}$:`, `代入 $x_{2} = a_{2}${e}$ 并除以 $${e}$：`),
            [
              `${poly([m, "a_{2}"])} = ${poly([delta, "a_{2}"], [f2, ""])}, \\qquad ${poly([m - delta, "a_{2}"])} = ${f2}, \\qquad a_{2} = ${a2}`,
            ],
          ],
          [
            ["Carry it into the first", "代入第一个方程"],
            t("", ""),
            [
              `${poly([m, "a_{1}"])} = ${poly([alpha, "a_{1}"], [beta * a2, ""], [f1, ""])}`,
              `${poly([m - alpha, "a_{1}"])} = ${f1 + beta * a2}, \\qquad a_{1} = ${a1}`,
            ],
          ],
        ],
        t(
          `In the first equation: $${m} \\cdot ${paren(a1)} = ${m * a1}$ and $${paren(alpha)} \\cdot ${paren(a1)} + ${paren(beta)} \\cdot ${paren(a2)} + ${paren(f1)} = ${m * a1}$.`,
          `代回第一个方程：$${m} \\cdot ${paren(a1)} = ${m * a1}$，而 $${paren(alpha)} \\cdot ${paren(a1)} + ${paren(beta)} \\cdot ${paren(a2)} + ${paren(f1)} = ${m * a1}$。`,
        ),
      ),
    });
  },
);

const nullcline = point(
  "the-line-where-trajectories-turn",
  ["The line where trajectories turn", "轨线转向的直线"],
  [
    "A nullcline organizes a phase portrait. Trajectories have horizontal tangents where $y' = 0$ and vertical tangents where $x' = 0$. It is easy to swap these: the horizontal crossings come from the equation for $y'$, not the one for $x'$. For $x' = x + 2y$, $y' = 3x - y$ the tangents are horizontal on $3x - y = 0$, the line of slope $3$.\n\n> **Watch out.** Horizontal means no vertical motion, so set $y' = 0$; and solve for $y$ carefully, since $cx + dy = 0$ gives the slope $-\\frac{c}{d}$ with a minus sign.",
    "零斜线帮助整理相图。轨线在 $y' = 0$ 处切线水平，在 $x' = 0$ 处切线竖直。这两者容易弄反：水平穿越来自 $y'$ 的方程，而不是 $x'$ 的方程。对 $x' = x + 2y$，$y' = 3x - y$，切线在 $3x - y = 0$ 上水平，即斜率为 $3$ 的直线。\n\n> **注意。** 水平意味着没有竖直方向的运动，所以令 $y' = 0$；解出 $y$ 时要小心，$cx + dy = 0$ 给出的斜率是 $-\\frac{c}{d}$，带负号。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const b = nz(rng, 6);
    const c = nz(rng, 6);
    const d0 = nz(rng, 6);
    const d = a * d0 === b * c ? -d0 : d0;
    const horizontal = rng.bool();
    const answer = horizontal ? Q.of(-c, d) : Q.of(-a, b);
    const other = horizontal ? Q.of(-a, b) : Q.of(-c, d);
    const name: Pair = horizontal ? ["horizontal", "水平"] : ["vertical", "竖直"];
    const eq = horizontal ? poly([c, "x"], [d, "y"]) : poly([a, "x"], [b, "y"]);
    const [k, l] = horizontal ? [c, d] : [a, b];
    return numberProblem({
      prompt: t(
        `For $x' = ${poly([a, "x"], [b, "y"])}$, $y' = ${poly([c, "x"], [d, "y"])}$, trajectories have ${name[0]} tangents along a line through the origin. Find its slope.`,
        `对 $x' = ${poly([a, "x"], [b, "y"])}$，$y' = ${poly([c, "x"], [d, "y"])}$，轨线沿一条过原点的直线切线${name[1]}。求这条直线的斜率。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          other,
          horizontal ? "That sets $x' = 0$, which gives vertical tangents." : "That sets $y' = 0$, which gives horizontal tangents.",
          horizontal ? "这是令 $x' = 0$，它给出的是竖直切线。" : "这是令 $y' = 0$，它给出的是水平切线。",
        ),
        why(answer.neg(), "The sign is lost when solving for $y$.", "解出 $y$ 时丢了负号。"),
        why(other.neg(), "That uses the other equation and also loses the sign.", "这是用了另一个方程，而且还丢了负号。"),
        why(
          Q.of(l, k),
          "That inverts the ratio: solving $kx + ly = 0$ gives $y = -\\frac{k}{l}x$.",
          "这是把比值颠倒了：由 $kx + ly = 0$ 得 $y = -\\frac{k}{l}x$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Pick the equation", "选取方程"],
            horizontal
              ? t("A horizontal tangent needs no vertical motion, so $y' = 0$:", "切线水平要求没有竖直方向的运动，所以 $y' = 0$：")
              : t("A vertical tangent needs no horizontal motion, so $x' = 0$:", "切线竖直要求没有水平方向的运动，所以 $x' = 0$："),
            [`${eq} = 0`],
          ],
          [["Solve for y", "解出 y"], t("", ""), [`y = ${poly([answer, "x"])}`, `\\text{slope} = ${answer.toLatex()}`]],
        ],
        t(
          `At the point $(1, ${answer.toLatex()})$ on the line, $${horizontal ? "y'" : "x'"} = ${k} + ${paren(l)} \\cdot ${paren(answer)} = 0$, so the velocity there is ${horizontal ? "horizontal" : "vertical"}.`,
          `在直线上的点 $(1, ${answer.toLatex()})$ 处，$${horizontal ? "y'" : "x'"} = ${k} + ${paren(l)} \\cdot ${paren(answer)} = 0$，所以那里的速度是${horizontal ? "水平" : "竖直"}的。`,
        ),
      ),
    });
  },
);

const limitOnEquilibriumLine = point(
  "where-a-trajectory-lands-on-the-line-of-equilibria",
  ["Where a trajectory lands on the line of equilibria", "轨线落在平衡线上的位置"],
  [
    "When one eigenvalue is zero and the other is negative, each solution runs along a straight line to a point of the line of equilibria. A conserved combination of the variables tells which point, without solving the system.\n\n> **Watch out.** The conserved combination weights $x$ by the rate in the $y$ equation and $y$ by the rate in the $x$ equation. For $x' = -x + y$, $y' = 2x - 2y$ it is $2x + y$; from $(0, 3)$ it stays $3$, so the trajectory lands where $3x = 3$, at $x = 1$, not at the average $\\frac{3}{2}$.",
    "当一个特征值为零、另一个为负时，每个解都沿一条直线走到平衡线上的某一点。变量的一个守恒组合可以告诉我们是哪一点，无需解方程组。\n\n> **注意。** 守恒组合中 $x$ 的权重是 $y$ 方程中的速率，$y$ 的权重是 $x$ 方程中的速率。对 $x' = -x + y$，$y' = 2x - 2y$，它是 $2x + y$；从 $(0, 3)$ 出发它保持为 $3$，所以轨线落在 $3x = 3$ 即 $x = 1$ 处，而不是平均值 $\\frac{3}{2}$。",
  ],
  (rng) => {
    const p = rng.int(1, 6);
    const q = rng.int(1, 6);
    const x0 = rng.int(-9, 9);
    const y0 = x0 + nz(rng, 8);
    const total = q * x0 + p * y0;
    const answer = Q.of(total, p + q);
    const combo = poly([q, "x"], [p, "y"]);
    const fx = poly([-p, "x"], [p, "y"]);
    const fy = poly([q, "x"], [-q, "y"]);
    return numberProblem({
      prompt: t(
        `For $x' = ${fx}$, $y' = ${fy}$ with $x(0) = ${x0}$ and $y(0) = ${y0}$, find the limit of $x(t)$ as $t \\to \\infty$.`,
        `对 $x' = ${fx}$，$y' = ${fy}$，且 $x(0) = ${x0}$，$y(0) = ${y0}$，求 $t \\to \\infty$ 时 $x(t)$ 的极限。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(x0 + y0, 2),
          `That averages the starting values; the conserved combination $${combo}$ weights them by its coefficients.`,
          `这是对初值取平均；守恒组合 $${combo}$ 按其系数加权。`,
        ),
        why(
          x0,
          "That is where $x$ starts; it keeps moving until the point reaches the line $y = x$.",
          "这是 $x$ 的初值；点会一直运动到直线 $y = x$ 上。",
        ),
        why(y0, "That is the starting value of $y$, not where $x$ ends.", "这是 $y$ 的初值，不是 $x$ 的终点。"),
        why(
          Q.of(p * x0 + q * y0, p + q),
          `That swaps the weights; the conserved combination is $${combo}$.`,
          `这是把权重交换了；守恒组合是 $${combo}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Find the line of equilibria", "求平衡线"],
            t(
              `Both rates vanish when $y = x$; the eigenvalues are $0$ and $${-(p + q)}$.`,
              `当 $y = x$ 时两个变化率都为零；特征值是 $0$ 与 $${-(p + q)}$。`,
            ),
            [],
          ],
          [
            ["Find what is conserved", "求守恒量"],
            t("", ""),
            [
              `(${combo})' = ${q === 1 ? "" : q}(${fx}) + ${p === 1 ? "" : p}(${fy}) = 0, \\qquad ${combo} = ${q} \\cdot ${paren(x0)} + ${p} \\cdot ${paren(y0)} = ${total}`,
            ],
          ],
          [["Land on the line", "落到直线上"], t("", ""), [`y = x: \\quad ${p + q}x = ${total}, \\qquad x = ${answer.toLatex()}`]],
        ],
        t(
          `At $(${answer.toLatex()}, ${answer.toLatex()})$ both rates are zero, and $${q} \\cdot ${paren(answer)} + ${p} \\cdot ${paren(answer)} = ${total}$, the value fixed at the start.`,
          `在 $(${answer.toLatex()}, ${answer.toLatex()})$ 处两个变化率都为零，并且 $${q} \\cdot ${paren(answer)} + ${p} \\cdot ${paren(answer)} = ${total}$，正是起点处确定的值。`,
        ),
      ),
    });
  },
);

const shiftedInitial = point(
  "the-initial-condition-shifts-too",
  ["The initial condition shifts too", "初始条件也要平移"],
  [
    "Shifting to $u = x - x_{*}$ removes the constant from the equation, but the initial value changes as well, to $u(0) = x(0) - x_{*}$. So the decay applies to the distance from equilibrium, and the equilibrium is added back at the end.\n\n> **Watch out.** Halve the distance from equilibrium, not $x$ itself. For $x' = -2x + 6$ with $x(0) = 7$: $x_{*} = 3$, $u(0) = 4$, and at $t = \\frac{\\ln 2}{2}$, $u = 2$, so $x = 5$, not $3.5$.",
    "平移到 $u = x - x_{*}$ 消去了方程中的常数，但初值也变了，成为 $u(0) = x(0) - x_{*}$。所以衰减作用于到平衡点的距离，最后还要把平衡值加回来。\n\n> **注意。** 减半的是到平衡点的距离，而不是 $x$ 本身。对 $x' = -2x + 6$，$x(0) = 7$：$x_{*} = 3$，$u(0) = 4$，在 $t = \\frac{\\ln 2}{2}$ 时 $u = 2$，所以 $x = 5$，而不是 $3.5$。",
  ],
  (rng) => {
    const k = rng.int(1, 6);
    const xs = nz(rng, 9);
    const d = 2 * nz(rng, 6);
    const x0 = xs + d;
    const T = k === 1 ? "\\ln 2" : `\\frac{\\ln 2}{${k}}`;
    const answer = xs + d / 2;
    const rhs = poly([-k, "x"], [k * xs, ""]);
    return numberProblem({
      prompt: t(`Solve $x' = ${rhs}$ with $x(0) = ${x0}$, and find $x(${T})$.`, `解 $x' = ${rhs}$，$x(0) = ${x0}$，并求 $x(${T})$。`),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(x0, 2),
          "That halves $x$ itself; only the distance from the equilibrium halves.",
          "这是把 $x$ 本身减半；减半的只是到平衡点的距离。",
        ),
        why(xs, "That is the long-run limit; at this time the distance has only halved.", "这是长期极限；此时距离只减少了一半。"),
        why(
          Q.of(x0, 2).add(Q.of(xs)),
          "That halves $x(0)$ instead of $u(0) = x(0) - x_{*}$.",
          "这是把 $x(0)$ 减半，而不是 $u(0) = x(0) - x_{*}$。",
        ),
      ]),
      solution: walked(
        [
          [["Find the equilibrium", "求平衡点"], t("", ""), [`${rhs} = 0, \\qquad x_{*} = ${xs}`]],
          [
            ["Shift the variable and the start", "平移变量和初值"],
            t("", ""),
            [
              `u = x - ${paren(xs)}, \\qquad u' = -${k === 1 ? "" : k}u, \\qquad u(0) = ${x0} - ${paren(xs)} = ${d}`,
              `u = ${d}${expOf(-k)}`,
            ],
          ],
          [
            ["Evaluate", "求值"],
            t(`At $t = ${T}$ the factor $${expOf(-k)}$ is $\\frac{1}{2}$.`, `在 $t = ${T}$ 时因子 $${expOf(-k)}$ 等于 $\\frac{1}{2}$。`),
            [`u = ${d / 2}, \\qquad x = ${xs} ${d / 2 < 0 ? "-" : "+"} ${Math.abs(d / 2)} = ${answer}`],
          ],
        ],
        t(
          `At $t = 0$ the formula gives $x = ${xs} ${d < 0 ? "-" : "+"} ${Math.abs(d)} = ${x0}$, the given start, and as $t \\to \\infty$ it tends to the equilibrium $${xs}$.`,
          `在 $t = 0$ 时公式给出 $x = ${xs} ${d < 0 ? "-" : "+"} ${Math.abs(d)} = ${x0}$，正是给定的初值；$t \\to \\infty$ 时它趋于平衡点 $${xs}$。`,
        ),
      ),
    });
  },
);

const classifyEquilibrium = point(
  "classifying-an-equilibrium-by-its-jacobian",
  ["Classifying an equilibrium by its Jacobian", "由雅可比矩阵判断平衡点类型"],
  [
    "The Jacobian at an equilibrium decides its type when no eigenvalue has zero real part. A negative determinant means a saddle. A positive determinant with a negative trace means that both eigenvalues have negative real part, so the equilibrium is stable.\n\n> **Watch out.** Evaluate the Jacobian at the equilibrium itself: for $x' = y$, $y' = x^2 - 4 - y$ the entry $2x$ is $4$ at $(2, 0)$ and $-4$ at $(-2, 0)$, so the first is a saddle and the second is stable.",
    "当没有特征值的实部为零时，平衡点处的雅可比矩阵决定其类型。行列式为负表示鞍点。行列式为正且迹为负，表示两个特征值的实部都为负，所以平衡点稳定。\n\n> **注意。** 雅可比矩阵要在平衡点本身处求值：对 $x' = y$，$y' = x^2 - 4 - y$，元素 $2x$ 在 $(2, 0)$ 处为 $4$，在 $(-2, 0)$ 处为 $-4$，所以前者是鞍点，后者稳定。",
  ],
  (rng) => {
    const s = rng.pick([-1, 1]);
    const m = rng.int(1, 6);
    const d = rng.int(1, 6);
    const star = rng.pick([-m, m]);
    const det = -2 * s * star;
    const saddle: Pair = ["A saddle, which is unstable", "鞍点，不稳定"];
    const stable: Pair = ["Stable, with both eigenvalues having negative real part", "稳定，两个特征值的实部都为负"];
    const source: Pair = ["Unstable, with both eigenvalues having positive real part", "不稳定，两个特征值的实部都为正"];
    const center: Pair = ["A center, with purely imaginary eigenvalues", "中心，特征值是纯虚数"];
    const correct = det < 0 ? saddle : stable;
    const system = `x' = y$, $y' = ${poly([s, "x^{2}"], [-s * m * m, ""], [-d, "y"])}`;
    const systemZh = `x' = y$，$y' = ${poly([s, "x^{2}"], [-s * m * m, ""], [-d, "y"])}`;
    const J = mat(0, 1, 2 * s * star, -d);
    const reasons: [Pair, string, string][] = [
      [saddle, `A saddle needs $\\det J < 0$, but here $\\det J = ${det}$.`, `鞍点要求 $\\det J < 0$，而这里 $\\det J = ${det}$。`],
      [
        stable,
        `$\\det J = ${det} < 0$ gives real eigenvalues of opposite signs, so the equilibrium is not stable.`,
        `$\\det J = ${det} < 0$ 给出异号实特征值，所以平衡点不稳定。`,
      ],
      [
        source,
        `Both real parts positive needs a positive trace, but $\\operatorname{tr} J = ${-d}$.`,
        `两个实部都为正需要迹为正，而 $\\operatorname{tr} J = ${-d}$。`,
      ],
      [center, `A center needs a zero trace, but $\\operatorname{tr} J = ${-d}$.`, `中心要求迹为零，而 $\\operatorname{tr} J = ${-d}$。`],
    ];
    return explainedChoice(rng, {
      prompt: t(
        `What type of equilibrium does $${system}$ have at $(${star}, 0)$?`,
        `$${systemZh}$ 在 $(${star}, 0)$ 处的平衡点是什么类型？`,
      ),
      correct: t(...correct),
      wrong: reasons.filter((r) => r[0] !== correct).map(([o, en, zh]) => ({ option: t(...o), why: t(en, zh) })),
      solution: walked(
        [
          [["Differentiate", "求偏导"], t("", ""), [`J = ${mat(0, 1, `${s < 0 ? "-" : ""}2x`, -d)}, \\qquad J(${star}, 0) = ${J}`]],
          [
            ["Read the trace and determinant", "读出迹与行列式"],
            det < 0
              ? t("A negative determinant gives real eigenvalues of opposite signs: a saddle.", "行列式为负，特征值是异号实数：鞍点。")
              : t(
                  "A positive determinant and a negative trace make both real parts negative: stable.",
                  "行列式为正且迹为负，两个实部都为负：稳定。",
                ),
            [`\\det J = 0 \\cdot ${paren(-d)} - 1 \\cdot ${paren(2 * s * star)} = ${det}, \\qquad \\operatorname{tr} J = ${-d}`],
          ],
        ],
        t(
          `The eigenvalues solve $${poly([1, "\\lambda^2"], [d, "\\lambda"], [det, ""])} = 0$: their product is $${det}$ and their sum is $${-d}$, ${det < 0 ? "so one is positive and one negative" : "so both real parts are negative"}.`,
          `特征值满足 $${poly([1, "\\lambda^2"], [d, "\\lambda"], [det, ""])} = 0$：之积为 $${det}$，之和为 $${-d}$，${det < 0 ? "所以一正一负" : "所以两个实部都为负"}。`,
        ),
      ),
    });
  },
);

const coefficientsFromFundamental = point(
  "the-coefficients-for-an-initial-condition",
  ["The coefficients for an initial condition", "满足初始条件的系数"],
  [
    "Every solution is $\\mathbf{x}(t) = \\Phi(t)\\mathbf{c}$, and the initial condition requires $\\Phi(0)\\mathbf{c} = \\mathbf{x}(0)$. This is a linear system for the coefficients. Note that $\\Phi(0)$ need not be the identity, so $\\mathbf{c}$ is usually not $\\mathbf{x}(0)$ itself.\n\n> **Watch out.** Solve $\\Phi(0)\\mathbf{c} = \\mathbf{x}(0)$ instead of copying $\\mathbf{x}(0)$. For $\\Phi(0) = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$ and $\\mathbf{x}(0) = (5, 7)$, $c_{1} = 3$ and $c_{2} = 2$, not $5$ and $7$.",
    "每个解都是 $\\mathbf{x}(t) = \\Phi(t)\\mathbf{c}$，初始条件要求 $\\Phi(0)\\mathbf{c} = \\mathbf{x}(0)$。这是关于系数的线性方程组。注意 $\\Phi(0)$ 不一定是单位矩阵，所以 $\\mathbf{c}$ 通常不等于 $\\mathbf{x}(0)$。\n\n> **注意。** 要解 $\\Phi(0)\\mathbf{c} = \\mathbf{x}(0)$，而不是照抄 $\\mathbf{x}(0)$。对 $\\Phi(0) = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$ 与 $\\mathbf{x}(0) = (5, 7)$，$c_{1} = 3$，$c_{2} = 2$，不是 $5$ 和 $7$。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].filter((v) => v !== a));
    const p = nz(rng, 4);
    const q = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4].filter((v) => v !== p));
    const c1 = nz(rng, 6);
    const c2 = nz(rng, 6);
    const x0 = c1 + c2;
    const y0 = p * c1 + q * c2;
    const useFirst = rng.bool();
    const answer = useFirst ? c1 : c2;
    const phi = mat(expOf(a), expOf(b), poly([p, expOf(a)]), poly([q, expOf(b)]));
    const name = useFirst ? "c_{1}" : "c_{2}";
    const rest = y0 - p * x0;
    return numberProblem({
      prompt: t(
        `A fundamental matrix of a system is $\\Phi(t) = ${phi}$. The solution with $\\mathbf{x}(0) = ${vec(x0, y0)}$ is $\\Phi(t)${vec("c_{1}", "c_{2}")}$. Find $${name}$.`,
        `一个方程组的基本矩阵是 $\\Phi(t) = ${phi}$。满足 $\\mathbf{x}(0) = ${vec(x0, y0)}$ 的解是 $\\Phi(t)${vec("c_{1}", "c_{2}")}$。求 $${name}$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(useFirst ? c2 : c1, "That is the other coefficient.", "这是另一个系数。"),
        why(
          -answer,
          "The sign is flipped while eliminating; substitute back into both equations to catch it.",
          "消元时符号弄反了；代回两个方程就能发现。",
        ),
        why(
          useFirst ? x0 : y0,
          "That copies a component of $\\mathbf{x}(0)$; $\\Phi(0)$ is not the identity, so the coefficients must be solved for.",
          "这照抄了 $\\mathbf{x}(0)$ 的一个分量；$\\Phi(0)$ 不是单位矩阵，系数必须解出来。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Set $t = 0$", "令 $t = 0$"],
            t("Every exponential equals $1$ there.", "此时每个指数函数都等于 $1$。"),
            [`\\Phi(0) = ${mat(1, 1, p, q)}`, `c_{1} + c_{2} = ${x0}, \\qquad ${poly([p, "c_{1}"], [q, "c_{2}"])} = ${y0}`],
          ],
          [
            ["Eliminate $c_{1}$", "消去 $c_{1}$"],
            t(`Subtract $${p}$ times the first equation from the second.`, `用第二个方程减去第一个方程的 $${p}$ 倍。`),
            [
              `${poly([q - p, "c_{2}"])} = ${y0} - ${paren(p)} \\cdot ${paren(x0)} = ${rest}`,
              `c_{2} = ${rest} \\div ${paren(q - p)} = ${c2}, \\qquad c_{1} = ${x0} - ${paren(c2)} = ${c1}`,
            ],
          ],
        ],
        t(
          `$${c1} + ${paren(c2)} = ${x0}$ and $${p} \\cdot ${paren(c1)} + ${paren(q)} \\cdot ${paren(c2)} = ${y0}$, so both components of $\\mathbf{x}(0)$ are matched.`,
          `$${c1} + ${paren(c2)} = ${x0}$，$${p} \\cdot ${paren(c1)} + ${paren(q)} \\cdot ${paren(c2)} = ${y0}$，所以 $\\mathbf{x}(0)$ 的两个分量都吻合。`,
        ),
      ),
    });
  },
);

const exponentialOfJordan = point(
  "the-matrix-exponential-is-not-taken-entry-by-entry",
  ["The matrix exponential is not taken entry by entry", "矩阵指数不是逐个元素取指数"],
  [
    "Writing $A = \\lambda I + N$ with $N^{2}$ zero gives $e^{At} = e^{\\lambda t}(I + tN)$, since $\\lambda I$ commutes with $N$. So the upper entry is $bte^{\\lambda t}$. Taking the exponential of each entry would be wrong.\n\n> **Watch out.** The upper entry keeps both factors, $t$ and $e^{\\lambda t}$. For $A = \\begin{pmatrix} 1 & 3 \\\\ 0 & 1 \\end{pmatrix}$ at $t = \\ln 2$, $e^{t} = 2$, so the entry is $3 \\cdot 2\\ln 2 = 6\\ln 2$, not $3\\ln 2$ and not $e^{3\\ln 2} = 8$.",
    "把 $A$ 写成 $\\lambda I + N$，其中 $N^{2}$ 为零，由于 $\\lambda I$ 与 $N$ 可交换，得 $e^{At} = e^{\\lambda t}(I + tN)$。所以右上元素是 $bte^{\\lambda t}$。对每个元素分别取指数是错误的。\n\n> **注意。** 右上元素同时保留 $t$ 与 $e^{\\lambda t}$ 两个因子。对 $A = \\begin{pmatrix} 1 & 3 \\\\ 0 & 1 \\end{pmatrix}$，在 $t = \\ln 2$ 处 $e^{t} = 2$，所以该元素是 $3 \\cdot 2\\ln 2 = 6\\ln 2$，不是 $3\\ln 2$，也不是 $e^{3\\ln 2} = 8$。",
  ],
  (rng) => {
    const l = rng.pick([-2, -1, 1, 2, 3]);
    const b = nz(rng, 9);
    const scale = Q.of(2).pow(l);
    const answer = scale.mul(Q.of(b));
    const A = mat(l, b, 0, l);
    const entry = poly([b, `t${expOf(l)}`]);
    return numberProblem({
      prompt: t(
        `For $A = ${A}$, the upper right entry of $e^{At}$ at $t = \\ln 2$ is $k\\ln 2$. Find $k$.`,
        `对 $A = ${A}$，$e^{At}$ 在 $t = \\ln 2$ 处的右上元素是 $k\\ln 2$。求 $k$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          b,
          "That drops the factor $e^{\\lambda t}$, which multiplies every entry of $e^{At}$.",
          "这漏掉了因子 $e^{\\lambda t}$，它乘在 $e^{At}$ 的每个元素上。",
        ),
        why(scale, "That drops the factor $b$ that comes from $tN$.", "这漏掉了来自 $tN$ 的因子 $b$。"),
        why(l * b, "That multiplies by $\\lambda$ instead of by $e^{\\lambda t}$.", "这乘的是 $\\lambda$，而不是 $e^{\\lambda t}$。"),
        why(
          Q.of(2).pow(-l).mul(Q.of(b)),
          "That uses $e^{-\\lambda t}$; the exponent keeps the sign of $\\lambda$.",
          "这用了 $e^{-\\lambda t}$；指数应保持 $\\lambda$ 的符号。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Split $A$", "拆分 $A$"],
            t("$\\lambda I$ commutes with $N$, so the two exponentials multiply.", "$\\lambda I$ 与 $N$ 可交换，所以两个指数可以相乘。"),
            [`A = ${l}I + N, \\qquad N = ${mat(0, b, 0, 0)}, \\qquad N^{2} = 0`],
          ],
          [
            ["Exponentiate", "取指数"],
            t("The series for $e^{Nt}$ stops at $I + tN$.", "$e^{Nt}$ 的级数在 $I + tN$ 处终止。"),
            [`e^{At} = ${expOf(l)}(I + tN) = ${expOf(l)}${mat(1, poly([b, "t"]), 0, 1)}`],
          ],
          [
            ["Set $t = \\ln 2$", "令 $t = \\ln 2$"],
            t(`There $${expOf(l)} = ${scale.toLatex()}$.`, `此时 $${expOf(l)} = ${scale.toLatex()}$。`),
            [
              `\\left.${entry}\\right|_{t = \\ln 2} = ${b} \\cdot ${scale.toLatex()}\\ln 2 = ${poly([answer, "\\ln 2"])}`,
              `k = ${answer.toLatex()}`,
            ],
          ],
        ],
        t(
          `$\\frac{d}{dt}\\left(${entry}\\right) = ${poly([b, expOf(l)], [l * b, `t${expOf(l)}`])}$, which is $${l}$ times this entry plus $${b}$ times the diagonal entry $${expOf(l)}$: exactly the upper right entry of $Ae^{At}$.`,
          `$\\frac{d}{dt}\\left(${entry}\\right) = ${poly([b, expOf(l)], [l * b, `t${expOf(l)}`])}$，等于这个元素的 $${l}$ 倍加上对角元素 $${expOf(l)}$ 的 $${b}$ 倍，正是 $Ae^{At}$ 的右上元素。`,
        ),
      ),
    });
  },
);

const integralOfExponentialMatrix = point(
  "constant-forcing-through-the-matrix-exponential",
  ["Constant forcing through the matrix exponential", "通过矩阵指数处理常数强迫"],
  [
    "With zero initial state and constant forcing, $\\mathbf{x}(t) = \\int_{0}^{t} e^{As}\\mathbf{g} \\, ds$. For a diagonal $A$ each entry is an ordinary integral, giving $\\frac{g}{a}(e^{at} - 1)$. Both the factor $\\frac{1}{a}$ and the $-1$ from the lower limit are easy to lose.\n\n> **Watch out.** Keep both the $\\frac{1}{a}$ and the $-1$. For $x_{1}' = 2x_{1} + 6$ from $x_{1}(0) = 0$, $x_{1}(\\ln 2) = \\frac{6}{2}(4 - 1) = 9$, not $\\frac{6}{2} \\cdot 4 = 12$ and not $6 \\cdot 3 = 18$.",
    "零初始状态、常数强迫时，$\\mathbf{x}(t) = \\int_{0}^{t} e^{As}\\mathbf{g} \\, ds$。对角矩阵 $A$ 的每个分量都是普通积分，得 $\\frac{g}{a}(e^{at} - 1)$。因子 $\\frac{1}{a}$ 和下限带来的 $-1$ 都容易丢失。\n\n> **注意。** $\\frac{1}{a}$ 与 $-1$ 都要保留。对 $x_{1}' = 2x_{1} + 6$，$x_{1}(0) = 0$，$x_{1}(\\ln 2) = \\frac{6}{2}(4 - 1) = 9$，不是 $\\frac{6}{2} \\cdot 4 = 12$，也不是 $6 \\cdot 3 = 18$。",
  ],
  (rng) => {
    const a = rng.pick([-2, -1, 1, 2, 3]);
    const d = nz(rng, 4);
    const g = nz(rng, 12);
    const h = nz(rng, 12);
    const pow = Q.of(2).pow(a);
    const growth = pow.sub(Q.of(1));
    const answer = Q.of(g, a).mul(growth);
    const A = mat(a, 0, 0, d);
    const formula = poly([Q.of(g, a), `\\left(${expOf(a)} - 1\\right)`]);
    return numberProblem({
      prompt: t(
        `Solve $\\mathbf{x}' = ${A}\\mathbf{x} + ${vec(g, h)}$ with $\\mathbf{x}(0) = \\mathbf{0}$, and find $x_{1}(\\ln 2)$.`,
        `解 $\\mathbf{x}' = ${A}\\mathbf{x} + ${vec(g, h)}$，$\\mathbf{x}(0) = \\mathbf{0}$，并求 $x_{1}(\\ln 2)$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(g).mul(pow),
          "That drops both the factor $\\frac{1}{a}$ and the $-1$ from the lower limit.",
          "这同时漏掉了因子 $\\frac{1}{a}$ 和下限带来的 $-1$。",
        ),
        why(Q.of(g, a).mul(pow), "That drops the $-1$ that the lower limit $s = 0$ contributes.", "这漏掉了下限 $s = 0$ 带来的 $-1$。"),
        why(
          Q.of(g).mul(growth),
          "That drops the factor $\\frac{1}{a}$ from integrating $e^{as}$.",
          "这漏掉了对 $e^{as}$ 积分得到的因子 $\\frac{1}{a}$。",
        ),
        why(
          Q.of(g, a).mul(Q.of(2).pow(-a).sub(Q.of(1))),
          "That integrates $e^{-as}$; the exponent keeps the sign of $a$.",
          "这是对 $e^{-as}$ 积分；指数应保持 $a$ 的符号。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Take the first component", "取第一个分量"],
            t(
              "$A$ is diagonal, so $x_{1}$ involves only its own rate and forcing.",
              "$A$ 是对角矩阵，所以 $x_{1}$ 只与它自己的速率和强迫项有关。",
            ),
            [`x_{1}' = ${poly([a, "x_{1}"], [g, ""])}, \\qquad x_{1}(t) = \\int_{0}^{t} ${poly([g, expOf(a, "s")])} \\, ds`],
          ],
          [["Integrate", "积分"], t("", ""), [`x_{1}(t) = ${formula}`]],
          [
            ["Set $t = \\ln 2$", "令 $t = \\ln 2$"],
            t(`There $${expOf(a)} = ${pow.toLatex()}$.`, `此时 $${expOf(a)} = ${pow.toLatex()}$。`),
            [`x_{1}(\\ln 2) = ${Q.of(g, a).toLatex()} \\cdot ${paren(growth)} = ${answer.toLatex()}`],
          ],
        ],
        t(
          `$x_{1}(0) = 0$, and $${poly([a, "x_{1}"], [g, ""])} = ${poly([g, expOf(a)], [-g, ""], [g, ""])} = ${poly([g, expOf(a)])}$, which is the derivative of $${formula}$.`,
          `$x_{1}(0) = 0$，并且 $${poly([a, "x_{1}"], [g, ""])} = ${poly([g, expOf(a)], [-g, ""], [g, ""])} = ${poly([g, expOf(a)])}$，正是 $${formula}$ 的导数。`,
        ),
      ),
    });
  },
);

const vopNonDiagonal = point(
  "variation-of-parameters-with-a-non-diagonal-fundamental-matrix",
  ["Variation of parameters with a non-diagonal fundamental matrix", "基本矩阵非对角时的参数变易"],
  [
    "When $\\Phi$ is not diagonal, $\\Phi\\mathbf{u}' = \\mathbf{g}$ couples the parameters. With a triangular $\\Phi$, solve the bottom row first. The first parameter then has a term that depends on $t$, and it must be integrated rather than treated as a constant.\n\n> **Watch out.** The top row reads $u_{1}' + tu_{2}' = f_{1}$, so $u_{1}'$ changes with $t$. For $u_{2}' = 4$ and $f_{1} = 3$, $u_{1}' = 3 - 4t$ and $u_{1}(1) = 3 - 2 = 1$, not $3$.",
    "当 $\\Phi$ 不是对角矩阵时，$\\Phi\\mathbf{u}' = \\mathbf{g}$ 使参数耦合。$\\Phi$ 是三角矩阵时，先解最后一行。于是第一个参数含有依赖 $t$ 的项，必须积分，不能当作常数。\n\n> **注意。** 第一行是 $u_{1}' + tu_{2}' = f_{1}$，所以 $u_{1}'$ 随 $t$ 变化。对 $u_{2}' = 4$，$f_{1} = 3$，$u_{1}' = 3 - 4t$，$u_{1}(1) = 3 - 2 = 1$，不是 $3$。",
  ],
  (rng) => {
    const a = nz(rng, 4);
    const f1 = nz(rng, 9);
    const f2 = 2 * nz(rng, 6);
    const T = rng.int(1, 4);
    const answer = f1 * T - (f2 * T * T) / 2;
    const e = expOf(a);
    const phi = mat(e, `t${e}`, 0, e);
    const g = vec(poly([f1, e]), poly([f2, e]));
    const uPrime = poly([f1, ""], [-f2, "t"]);
    return numberProblem({
      prompt: t(
        `$\\Phi(t) = ${phi}$ is a fundamental matrix, and $\\mathbf{g}(t) = ${g}$. Solving $\\Phi\\mathbf{u}' = \\mathbf{g}$ with $\\mathbf{u}(0) = \\mathbf{0}$, find $u_{1}(${T})$.`,
        `$\\Phi(t) = ${phi}$ 是基本矩阵，$\\mathbf{g}(t) = ${g}$。解 $\\Phi\\mathbf{u}' = \\mathbf{g}$，$\\mathbf{u}(0) = \\mathbf{0}$，求 $u_{1}(${T})$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(f1 * T, "That drops the coupling term; the top row also contains $tu_{2}'$.", "这漏掉了耦合项；第一行还含有 $tu_{2}'$。"),
        why(
          f1 * T + (f2 * T * T) / 2,
          "The sign of the coupling term is flipped: $u_{1}' = f_{1} - tu_{2}'$.",
          "耦合项的符号弄反了：$u_{1}' = f_{1} - tu_{2}'$。",
        ),
        why(
          f1 - f2 * T,
          "That is the rate $u_{1}'$ at that time; it still has to be integrated.",
          "这是该时刻的变化率 $u_{1}'$；还要积分。",
        ),
        why(f2 * T, "That is $u_{2}$ at that time, the other parameter.", "这是该时刻的 $u_{2}$，即另一个参数。"),
      ]),
      solution: walked(
        [
          [
            ["Solve the bottom row", "解最后一行"],
            t(`Divide by $${e}$.`, `两边除以 $${e}$。`),
            [`${e}u_{2}' = ${poly([f2, e])}, \\qquad u_{2}' = ${f2}`],
          ],
          [
            ["Solve the top row", "解第一行"],
            t(`Divide by $${e}$ and put in $u_{2}'$.`, `两边除以 $${e}$，再代入 $u_{2}'$。`),
            [`u_{1}' + tu_{2}' = ${f1}, \\qquad u_{1}' = ${uPrime}`],
          ],
          [
            ["Integrate", "积分"],
            t("Start from $u_{1}(0) = 0$.", "从 $u_{1}(0) = 0$ 出发。"),
            [`u_{1} = ${poly([f1, "t"], [-f2 / 2, "t^{2}"])}, \\qquad u_{1}(${T}) = ${answer}`],
          ],
        ],
        t(
          `At $t = ${T}$: $u_{1}' + ${T === 1 ? "" : T}u_{2}' =${f1 - f2 * T} + ${T} \\cdot ${paren(f2)} = ${f1}$, the top entry of $\\mathbf{g}$ divided by $${e}$, and $u_{1}(0) = 0$.`,
          `在 $t = ${T}$ 处：$u_{1}' + ${T === 1 ? "" : T}u_{2}' =${f1 - f2 * T} + ${T} \\cdot ${paren(f2)} = ${f1}$，正是 $\\mathbf{g}$ 的第一个元素除以 $${e}$；并且 $u_{1}(0) = 0$。`,
        ),
      ),
    });
  },
);

const criticalCapacity = point(
  "the-carrying-capacity-that-predators-need",
  ["The carrying capacity that predators need", "捕食者所需的环境容量"],
  [
    "With logistic prey, coexistence needs the prey level $x_{*}$ that holds predators steady to be below the carrying capacity $K$. The predator level is $y_{*} = \\frac{r}{a}\\left(1 - \\frac{x_{*}}{K}\\right)$, so it falls to zero when $K$ reaches $x_{*}$, and predators die out below that.\n\n> **Watch out.** The threshold comes from the predator equation alone: $K = x_{*} = \\frac{c}{d}$, and the prey rates $r$ and $a$ do not enter it. For $y' = -6y + 2xy$, predators need $K > 3$, whatever the prey equation is.",
    "猎物为逻辑斯谛增长时，共存要求使捕食者保持稳定的猎物水平 $x_{*}$ 低于环境容量 $K$。捕食者水平是 $y_{*} = \\frac{r}{a}\\left(1 - \\frac{x_{*}}{K}\\right)$，所以当 $K$ 降到 $x_{*}$ 时它降为零，低于这个值捕食者就会灭绝。\n\n> **注意。** 这个临界值只由捕食者方程决定：$K = x_{*} = \\frac{c}{d}$，猎物的速率 $r$ 与 $a$ 不出现在其中。对 $y' = -6y + 2xy$，无论猎物方程如何，捕食者都需要 $K > 3$。",
  ],
  (rng) => {
    const r = rng.int(2, 9);
    const a = rng.int(1, 6);
    const c = rng.int(2, 12);
    const d = rng.int(1, 5);
    const answer = Q.of(c, d);
    const first = `x' = ${r}x\\left(1 - \\frac{x}{K}\\right) - ${poly([a, "xy"])}`;
    const second = `y' = ${poly([-c, "y"], [d, "xy"])}`;
    return numberProblem({
      prompt: t(
        `For $${first}$, $${second}$, the coexistence level of predators falls as $K$ falls. Find the value of $K$ at which it reaches zero.`,
        `对 $${first}$，$${second}$，当 $K$ 减小时，共存时的捕食者水平下降。求它降到零时的 $K$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(d, c),
          "That divides the wrong way: the predator equation gives $x_{*} = \\frac{c}{d}$.",
          "除反了：捕食者方程给出 $x_{*} = \\frac{c}{d}$。",
        ),
        why(c, "That is the predator death rate; it still has to be divided by $d$.", "这是捕食者的死亡率；还要除以 $d$。"),
        why(
          Q.of(r, a),
          "That is the predator level the prey equation would allow with unlimited prey, not a carrying capacity.",
          "这是猎物不受限时猎物方程允许的捕食者水平，不是环境容量。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Use the predator equation", "用捕食者方程"],
            t("Coexistence needs $y > 0$, so the bracket vanishes.", "共存要求 $y > 0$，所以括号为零。"),
            [`y\\left(${poly([-c, ""], [d, "x"])}\\right) = 0, \\qquad x_{*} = ${c} \\div ${d} = ${answer.toLatex()}`],
          ],
          [
            ["Use the prey equation", "用猎物方程"],
            t("Divide $x' = 0$ by $x$.", "把 $x' = 0$ 除以 $x$。"),
            [
              `${r}\\left(1 - \\frac{x_{*}}{K}\\right) - ${poly([a, "y"])} = 0, \\qquad y_{*} = \\left(1 - \\frac{x_{*}}{K}\\right) \\cdot ${Q.of(r, a).toLatex()}`,
            ],
          ],
          [["Set $y_{*} = 0$", "令 $y_{*} = 0$"], t("", ""), [`\\frac{x_{*}}{K} = 1, \\qquad K = x_{*} = ${answer.toLatex()}`]],
        ],
        t(
          `With $K = ${Q.of(2 * c, d).toLatex()}$, twice the threshold, $y_{*} = ${Q.of(r, 2 * a).toLatex()} > 0$; with $K = ${answer.toLatex()}$ the factor $1 - \\frac{x_{*}}{K}$ is exactly $0$.`,
          `取 $K = ${Q.of(2 * c, d).toLatex()}$，即临界值的两倍，$y_{*} = ${Q.of(r, 2 * a).toLatex()} > 0$；取 $K = ${answer.toLatex()}$ 时因子 $1 - \\frac{x_{*}}{K}$ 恰好为 $0$。`,
        ),
      ),
    });
  },
);

const cornerJump = point(
  "a-corner-is-a-jump-in-the-derivative",
  ["A corner is a jump in the derivative", "尖角是导数的跳跃"],
  [
    "A piecewise smooth function can be continuous and still have a corner. Then the function has no jump, but its derivative does, and the size of that jump is the right-hand derivative minus the left-hand derivative at the joining point.\n\n> **Watch out.** Compare the slopes, not the values, which agree at a corner. For $f = t^{2}$ before $t = 2$ and $f = 6t - 8$ after it, both pieces equal $4$ at $t = 2$, but the slopes are $4$ and $6$, so $f'$ jumps by $6 - 4 = 2$.",
    "分段光滑的函数可以连续却仍有尖角。这时函数本身没有跳跃，但导数有，跳跃的大小等于连接点处的右导数减去左导数。\n\n> **注意。** 要比较斜率，而不是函数值，尖角处的函数值是相等的。对 $t = 2$ 之前为 $f = t^{2}$、之后为 $f = 6t - 8$ 的函数，两段在 $t = 2$ 处都等于 $4$，但斜率分别是 $4$ 和 $6$，所以 $f'$ 跳跃 $6 - 4 = 2$。",
  ],
  (rng) => {
    const p = nz(rng, 4);
    const T = rng.int(1, 4);
    const q = rng.int(-9, 9);
    const r0 = nz(rng, 9);
    const r = r0 === 2 * p * T ? r0 + 1 : r0;
    const s = p * T * T + q - r * T;
    const left = poly([p, "t^{2}"], [q, ""]);
    const right = poly([r, "t"], [s, ""]);
    const f = `f(t) = \\begin{cases} ${left}, & 0 \\le t < ${T} \\\\ ${right}, & t \\ge ${T} \\end{cases}`;
    const answer = r - 2 * p * T;
    const value = p * T * T + q;
    return numberProblem({
      prompt: t(
        `The function $${f}$ is continuous at $t = ${T}$. Find the jump of $f'$ there, right value minus left value.`,
        `函数 $${f}$ 在 $t = ${T}$ 处连续。求 $f'$ 在该处的跳跃（右值减左值）。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(-answer, "That is the left slope minus the right slope; the jump is right minus left.", "这是左斜率减右斜率；跳跃是右减左。"),
        why(
          r - p * T,
          `That takes the derivative of $${poly([p, "t^{2}"])}$ as $${poly([p, "t"])}$; the power rule brings down a factor $2$.`,
          `这把 $${poly([p, "t^{2}"])}$ 的导数算成了 $${poly([p, "t"])}$；幂法则会带下因子 $2$。`,
        ),
        why(r, "That is the right slope alone; the left slope must be subtracted.", "这只是右斜率；还要减去左斜率。"),
      ]),
      solution: walked(
        [
          [
            ["Find the left slope", "求左斜率"],
            t(`Differentiate the first piece and let $t \\to ${T}$.`, `对第一段求导并令 $t \\to ${T}$。`),
            [`f'(t) = ${poly([2 * p, "t"])} \\to ${2 * p * T}`],
          ],
          [["Find the right slope", "求右斜率"], t("", ""), [`f'(t) = ${r}`]],
          [["Subtract", "相减"], t("", ""), [`${r} - ${paren(2 * p * T)} = ${answer}`]],
        ],
        t(
          `Both pieces equal $${value}$ at $t = ${T}$, so $f$ itself does not jump, and only its slope changes, from $${2 * p * T}$ to $${r}$.`,
          `两段在 $t = ${T}$ 处都等于 $${value}$，所以 $f$ 本身没有跳跃，只有斜率从 $${2 * p * T}$ 变为 $${r}$。`,
        ),
      ),
    });
  },
);

const transformOfT = point(
  "the-transform-of-t-from-the-definition",
  ["The transform of t from the definition", "由定义求 t 的变换"],
  [
    "The definition also handles a factor of $t$, through integration by parts: $\\int_{0}^{\\infty} te^{-kt} \\, dt = \\frac{1}{k^{2}}$ for $k > 0$. An exponential factor just shifts $s$, so the combined rate is $k = s - a$, and the exponent of the denominator is $2$, not $1$.\n\n> **Watch out.** The rate is $s - a$, not $s$. For $\\int_{0}^{\\infty} te^{t}e^{-st} \\, dt$ at $s = 3$, $k = 3 - 1 = 2$ and the value is $\\frac{1}{4}$, not $\\frac{1}{9}$.",
    "定义也能处理因子 $t$，用分部积分：当 $k > 0$ 时，$\\int_{0}^{\\infty} te^{-kt} \\, dt = \\frac{1}{k^{2}}$。指数因子只是平移 $s$，所以合起来的速率是 $k = s - a$，分母的指数是 $2$，而不是 $1$。\n\n> **注意。** 速率是 $s - a$，不是 $s$。对 $\\int_{0}^{\\infty} te^{t}e^{-st} \\, dt$，在 $s = 3$ 处 $k = 3 - 1 = 2$，值为 $\\frac{1}{4}$，不是 $\\frac{1}{9}$。",
  ],
  (rng) => {
    const c = nz(rng, 12);
    const a = rng.int(-3, 3);
    const k = rng.int(2, 5);
    const s = a + k;
    const answer = Q.of(c, k * k);
    const integrand = poly([c, a === 0 ? "t" : `t${expOf(a)}`]);
    const kt = expOf(-k);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_{0}^{\\infty} ${integrand}e^{-st} \\, dt$ at $s = ${s}$.`,
        `当 $s = ${s}$ 时，求 $\\int_{0}^{\\infty} ${integrand}e^{-st} \\, dt$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(c, k),
          "That uses the power $1$ in the denominator; integrating $t$ by parts gives $k^{2}$.",
          "这在分母用了幂 $1$；对 $t$ 分部积分得到 $k^{2}$。",
        ),
        why(
          Q.of(c, k * k * k),
          "That uses the power $3$, which belongs to $t^{2}$, not $t$.",
          "这用了幂 $3$，那是 $t^{2}$ 的，不是 $t$ 的。",
        ),
        why(
          answer.neg(),
          "The sign is flipped; the integrand has the sign of the coefficient throughout.",
          "符号反了；被积函数处处与系数同号。",
        ),
        ...(a === 0 || s === 0
          ? []
          : [
              why(
                Q.of(c, s * s),
                `That uses the rate $s = ${s}$; the exponential factor makes it $${s} - ${paren(a)} = ${k}$.`,
                `这用了速率 $s = ${s}$；指数因子使它变成 $${s} - ${paren(a)} = ${k}$。`,
              ),
            ]),
      ]),
      solution: walked(
        [
          [
            ["Find the rate", "求速率"],
            t(`At $s = ${s}$ the rate is $${s} - ${paren(a)} = ${k}$.`, `在 $s = ${s}$ 处速率为 $${s} - ${paren(a)} = ${k}$。`),
            [`\\int_{0}^{\\infty} ${poly([c, `t${kt}`])} \\, dt`],
          ],
          [
            ["Integrate by parts", "分部积分"],
            t("", ""),
            [
              `\\int_{0}^{\\infty} t${kt} \\, dt = \\left[-\\frac{t}{${k}}${kt}\\right]_{0}^{\\infty} + \\frac{1}{${k}}\\int_{0}^{\\infty} ${kt} \\, dt = \\frac{1}{${k * k}}`,
              `${c} \\cdot \\frac{1}{${k * k}} = ${answer.toLatex()}`,
            ],
          ],
        ],
        t(
          `The table gives $\\mathcal{L}\\{t\\} = \\frac{1}{s^{2}}$, and ${a === 0 ? "with no exponential it is not shifted" : `the factor $${expOf(a)}$ shifts it to $\\frac{1}{(s - ${paren(a)})^{2}}$`}; at $s = ${s}$ this is $\\frac{1}{${k * k}}$, and times $${c}$ it is $${answer.toLatex()}$.`,
          `查表得 $\\mathcal{L}\\{t\\} = \\frac{1}{s^{2}}$，${a === 0 ? "没有指数因子，不需平移" : `因子 $${expOf(a)}$ 把它平移为 $\\frac{1}{(s - ${paren(a)})^{2}}$`}；在 $s = ${s}$ 处为 $\\frac{1}{${k * k}}$，乘以 $${c}$ 得 $${answer.toLatex()}$。`,
        ),
      ),
    });
  },
);

const transformValue = point(
  "the-initial-value-in-the-transformed-equation",
  ["The initial value in the transformed equation", "变换后方程中的初值"],
  [
    "The rule $\\mathcal{L}\\{y'\\} = sY - y(0)$ brings the initial value in as a term of the algebra. So for $y' + ky = c$, $Y(s) = \\frac{y(0) + c/s}{s + k}$. Dropping $y(0)$ gives the response from rest, which is a different function.\n\n> **Watch out.** Keep both the initial value and the $\\frac{1}{s}$ of the constant. For $y' + 2y = 6$ with $y(0) = 3$ at $s = 2$, $Y(2) = \\frac{3 + 3}{4} = \\frac{3}{2}$; dropping $y(0)$ gives $\\frac{3}{4}$ instead.",
    "规则 $\\mathcal{L}\\{y'\\} = sY - y(0)$ 把初值作为代数项带入。所以对 $y' + ky = c$，$Y(s) = \\frac{y(0) + c/s}{s + k}$。漏掉 $y(0)$ 得到的是从静止开始的响应，那是另一个函数。\n\n> **注意。** 初值和常数的 $\\frac{1}{s}$ 都要保留。对 $y' + 2y = 6$，$y(0) = 3$，在 $s = 2$ 处 $Y(2) = \\frac{3 + 3}{4} = \\frac{3}{2}$；漏掉 $y(0)$ 会得到 $\\frac{3}{4}$。",
  ],
  (rng) => {
    const k = rng.int(1, 6);
    const c = nz(rng, 12);
    const y0 = nz(rng, 9);
    const s = rng.int(2, 5);
    const forcing = Q.of(c, s);
    const denom = Q.of(s + k);
    const answer = Q.of(y0).add(forcing).div(denom);
    const free = Q.of(y0, s + k);
    const forced = Q.of(c, s * (s + k));
    return numberProblem({
      prompt: t(
        `For $${poly([1, "y'"], [k, "y"])} = ${c}$ with $y(0) = ${y0}$, find the value of the Laplace transform $Y(s)$ at $s = ${s}$.`,
        `对 $${poly([1, "y'"], [k, "y"])} = ${c}$，$y(0) = ${y0}$，求拉普拉斯变换 $Y(s)$ 在 $s = ${s}$ 处的值。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          forcing.div(denom),
          "That drops $y(0)$, which $\\mathcal{L}\\{y'\\} = sY - y(0)$ brings in.",
          "这漏掉了 $\\mathcal{L}\\{y'\\} = sY - y(0)$ 带入的 $y(0)$。",
        ),
        why(
          forcing.sub(Q.of(y0)).div(denom),
          "That subtracts $y(0)$; it moves to the right side with a plus sign.",
          "这减去了 $y(0)$；它移到右边时带正号。",
        ),
        why(
          Q.of(y0 + c).div(denom),
          `That transforms the constant $${c}$ as $${c}$; its transform is $\\frac{${c}}{s}$.`,
          `这把常数 $${c}$ 的变换当成了 $${c}$；它的变换是 $\\frac{${c}}{s}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Transform the equation", "对方程取变换"],
            t("", ""),
            [`sY - ${paren(y0)} + ${k === 1 ? "" : k}Y = \\frac{${c}}{s}`, `Y(s) = \\frac{${y0} + \\frac{${c}}{s}}{s + ${k}}`],
          ],
          [["Evaluate", "求值"], t("", ""), [`Y(${s}) = \\frac{${y0} + ${paren(forcing)}}{${s + k}} = ${answer.toLatex()}`]],
        ],
        t(
          `Split $Y$ into the part from $y(0)$, $\\frac{${y0}}{s + ${k}}$, and the part from the forcing, $\\frac{${c}}{s(s + ${k})}$. At $s = ${s}$ they are $${free.toLatex()}$ and $${forced.toLatex()}$, which add to $${answer.toLatex()}$.`,
          `把 $Y$ 拆成来自 $y(0)$ 的部分 $\\frac{${y0}}{s + ${k}}$ 与来自外力的部分 $\\frac{${c}}{s(s + ${k})}$。在 $s = ${s}$ 处它们分别为 $${free.toLatex()}$ 与 $${forced.toLatex()}$，之和为 $${answer.toLatex()}$。`,
        ),
      ),
    });
  },
);

const afterSwitchOff = point(
  "the-response-after-a-switch-off",
  ["The response after a switch off", "关闭之后的响应"],
  [
    "Forcing $c(1 - u(t - T))$ is on until $T$ and off after it. By the delay theorem the response is the rise from rest minus the same rise delayed by $T$. So after $T$ the solution simply decays from the value it reached, with no further rise.\n\n> **Watch out.** After the switch-off $y$ decays from where it was; it does not keep rising. For $y' + y = 8\\left(1 - u(t - \\ln 2)\\right)$, $y(\\ln 2) = 4$ and $y(2\\ln 2) = 2$, not the $6$ that a force left on would give.",
    "强迫项 $c(1 - u(t - T))$ 在 $T$ 之前开启，之后关闭。由时滞定理，响应是从静止开始的上升减去延迟 $T$ 的同样上升。所以 $T$ 之后，解只是从已达到的值衰减，不再上升。\n\n> **注意。** 关闭之后 $y$ 从当时的值开始衰减，不再继续上升。对 $y' + y = 8\\left(1 - u(t - \\ln 2)\\right)$，$y(\\ln 2) = 4$，$y(2\\ln 2) = 2$，而不是外力一直作用时的 $6$。",
  ],
  (rng) => {
    const k = rng.int(1, 6);
    const c = rng.int(1, 60);
    const n = rng.int(2, 4);
    const T = k === 1 ? "\\ln 2" : `\\frac{\\ln 2}{${k}}`;
    const level = Q.of(c, k);
    const answer = Q.of(c, k * 2 ** n);
    const risen = level.mul(Q.of(2 ** n - 1, 2 ** n));
    const half = level.mul(Q.of(1, 2));
    const kk = k === 1 ? "" : `${k}`;
    return numberProblem({
      prompt: t(
        `$${poly([1, "y'"], [k, "y"])} = ${c}\\left(1 - u(t - T)\\right)$ with $y(0) = 0$ and $T = ${T}$. Find $y(${n}T)$.`,
        `$${poly([1, "y'"], [k, "y"])} = ${c}\\left(1 - u(t - T)\\right)$，$y(0) = 0$，$T = ${T}$。求 $y(${n}T)$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          risen,
          "That keeps the force on after $T$; once it is off, $y$ only decays.",
          "这让外力在 $T$ 之后仍然作用；关闭之后 $y$ 只会衰减。",
        ),
        why(level, "That is the level the force would lead to if it stayed on forever.", "这是外力一直作用时 $y$ 趋向的水平。"),
        why(half, "That is $y(T)$, the value at the switch-off; $y$ decays after it.", "这是关闭时刻的值 $y(T)$；此后 $y$ 还会衰减。"),
      ]),
      solution: walked(
        [
          [
            ["Rise until T", "到 T 为止的上升"],
            t(`From rest, and $e^{-${kk}T} = \\frac{1}{2}$:`, `从静止出发，且 $e^{-${kk}T} = \\frac{1}{2}$：`),
            [`y(t) = ${poly([level, `\\left(1 - ${expOf(-k)}\\right)`])}, \\qquad y(T) = ${half.toLatex()}`],
          ],
          [
            ["Decay after T", "T 之后的衰减"],
            t("The force is off, so $y$ halves every $T$:", "外力已关闭，所以 $y$ 每过 $T$ 减半："),
            [
              `y(t) = ${poly([half, `e^{-${kk}(t - T)}`])}, \\qquad y(${n}T) = ${half.toLatex()} \\cdot \\frac{1}{${2 ** (n - 1)}} = ${answer.toLatex()}`,
            ],
          ],
        ],
        t(
          `By the delay theorem, $y = ${poly([level, `\\left(${expOf(-k, "(t - T)")} - ${expOf(-k)}\\right)`])}$ for $t > T$; at $t = ${n}T$ this is $${poly([level, `\\left(\\frac{1}{${2 ** (n - 1)}} - \\frac{1}{${2 ** n}}\\right)`])} = ${answer.toLatex()}$.`,
          `由时滞定理，当 $t > T$ 时 $y = ${poly([level, `\\left(${expOf(-k, "(t - T)")} - ${expOf(-k)}\\right)`])}$；在 $t = ${n}T$ 处为 $${poly([level, `\\left(\\frac{1}{${2 ** (n - 1)}} - \\frac{1}{${2 ** n}}\\right)`])} = ${answer.toLatex()}$。`,
        ),
      ),
    });
  },
);

const pulseAmplitude = point(
  "the-amplitude-left-by-a-pulse",
  ["The amplitude left by a pulse", "脉冲留下的振幅"],
  [
    "When a constant force on an oscillator is switched off, the two delayed responses add. Their phases decide the outcome: a pulse lasting an odd number of half periods doubles the amplitude, and one lasting a whole number of periods leaves the oscillator at rest.\n\n> **Watch out.** A pulse of a whole period cancels itself. For $y'' + y = 3\\left(1 - u(t - T)\\right)$ from rest, $T = \\pi$ leaves the amplitude $6$, but $T = 2\\pi$ leaves the oscillator at rest, with amplitude $0$.",
    "作用在振子上的常力关闭时，两个延迟响应相加。它们的相位决定结果：持续奇数个半周期的脉冲使振幅加倍，持续整数个周期的脉冲使振子静止。\n\n> **注意。** 持续整整一个周期的脉冲会自我抵消。对从静止出发的 $y'' + y = 3\\left(1 - u(t - T)\\right)$，$T = \\pi$ 时振幅为 $6$，而 $T = 2\\pi$ 时振子静止，振幅为 $0$。",
  ],
  (rng) => {
    const w = rng.int(1, 6);
    const F = rng.int(1, 40);
    const j = rng.int(1, 4);
    const piPart = j === 1 ? "\\pi" : `${j}\\pi`;
    const lowest = Q.of(j, w);
    const top = lowest.n === 1n ? "\\pi" : `${lowest.n}\\pi`;
    const T = lowest.d === 1n ? top : `\\frac{${top}}{${lowest.d}}`;
    const full = Q.of(2 * F, w * w);
    const odd = j % 2 === 1;
    const answer = odd ? full : Q.of(0);
    const left = poly([1, "y''"], [w * w, "y"]);
    const c = w === 1 ? "" : w;
    const level = Q.of(F, w * w);
    return numberProblem({
      prompt: t(
        `$${left} = ${F}\\left(1 - u(t - T)\\right)$ with $y(0) = y'(0) = 0$ and $T = ${T}$. Find the amplitude of the motion for $t > T$, or $0$ if the oscillator is at rest.`,
        `$${left} = ${F}\\left(1 - u(t - T)\\right)$，$y(0) = y'(0) = 0$，$T = ${T}$。求 $t > T$ 时运动的振幅；如果振子静止，填 $0$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          odd ? 0 : full,
          odd
            ? `That treats the two cosines as cancelling; a shift by $${piPart}$ flips the sign of the cosine.`
            : `That treats the two cosines as reinforcing; a shift by $${piPart}$ leaves the cosine unchanged.`,
          odd ? `这把两个余弦当成相互抵消；平移 $${piPart}$ 使余弦变号。` : `这把两个余弦当成相互加强；平移 $${piPart}$ 不改变余弦。`,
        ),
        why(
          level,
          "That is the amplitude while the force is on; switching it off adds a second response.",
          "这是外力作用期间的振幅；关闭外力会叠加第二个响应。",
        ),
        why(
          Q.of(2 * F, w),
          `That divides by $\\omega = ${w}$; the response from rest has $\\frac{F}{\\omega^{2}}$.`,
          `这除以了 $\\omega = ${w}$；从静止出发的响应带有 $\\frac{F}{\\omega^{2}}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Subtract the delayed response", "减去延迟的响应"],
            t("The response from rest to the step is delayed by $T$ and subtracted:", "阶跃从静止出发的响应延迟 $T$ 后相减："),
            [`y = ${poly([level, `\\left(\\cos ${c}(t - T) - \\cos ${c}t\\right)`])}, \\qquad t > T`],
          ],
          [
            ["Use the phase", "利用相位"],
            t(`The shift changes the angle by $${c}T = ${piPart}$.`, `平移使角度改变 $${c}T = ${piPart}$。`),
            [`\\cos ${c}(t - T) = ${odd ? "-" : ""}\\cos ${c}t`, odd ? `y = ${poly([full.neg(), `\\cos ${c}t`])}` : "y = 0"],
          ],
        ],
        odd
          ? t(
              `At $t = T$, $y = ${poly([level, `\\left(1 - \\cos ${piPart}\\right)`])} = ${full.toLatex()}$ and $y' = 0$, so the oscillator starts its free motion at the top of a swing of amplitude $${full.toLatex()}$.`,
              `在 $t = T$ 处 $y = ${poly([level, `\\left(1 - \\cos ${piPart}\\right)`])} = ${full.toLatex()}$，$y' = 0$，所以振子从振幅为 $${full.toLatex()}$ 的摆动顶点开始自由运动。`,
            )
          : t(
              `At $t = T$, $y = ${poly([level, `\\left(1 - \\cos ${piPart}\\right)`])} = 0$ and $y' = 0$, so with the force off the oscillator stays at rest.`,
              `在 $t = T$ 处 $y = ${poly([level, `\\left(1 - \\cos ${piPart}\\right)`])} = 0$，$y' = 0$，外力关闭后振子保持静止。`,
            ),
      ),
    });
  },
);

const coupledTransform = point(
  "cramers-rule-for-a-coupled-transform",
  ["Cramer's rule for a coupled transform", "耦合变换的克拉默法则"],
  [
    "Transforming $\\mathbf{x}' = A\\mathbf{x}$ gives $(sI - A)\\mathbf{X} = \\mathbf{x}(0)$. In a coupled system neither transform can be found alone, so use Cramer's rule, and remember that the off-diagonal entries of $sI - A$ have the opposite sign to those of $A$.\n\n> **Watch out.** For $X_{1}$, replace the first column of $sI - A$ by $\\mathbf{x}(0)$; the entry $-b$ then meets $x_{2}(0)$ with a minus sign that cancels. For $x_{1}' = -x_{1} + 2x_{2}$, $x_{2}' = -x_{1} - 2x_{2}$ with $x_{1}(0) = x_{2}(0) = 1$ at $s = 1$, the determinant is $8$ and the numerator is $3 + 2 = 5$, so $X_{1}(1) = \\frac{5}{8}$, not $\\frac{1}{8}$.",
    "变换 $\\mathbf{x}' = A\\mathbf{x}$ 得 $(sI - A)\\mathbf{X} = \\mathbf{x}(0)$。在耦合方程组中，两个变换都不能单独求出，所以要用克拉默法则，并记住 $sI - A$ 的非对角元素与 $A$ 的符号相反。\n\n> **注意。** 求 $X_{1}$ 时用 $\\mathbf{x}(0)$ 替换 $sI - A$ 的第一列；这时元素 $-b$ 与 $x_{2}(0)$ 相乘时的负号会抵消。对 $x_{1}' = -x_{1} + 2x_{2}$，$x_{2}' = -x_{1} - 2x_{2}$，$x_{1}(0) = x_{2}(0) = 1$，在 $s = 1$ 处行列式为 $8$，分子为 $3 + 2 = 5$，所以 $X_{1}(1) = \\frac{5}{8}$，不是 $\\frac{1}{8}$。",
  ],
  (rng) => {
    const a = -rng.int(1, 5);
    const d = -rng.int(1, 5);
    const b = rng.int(1, 5);
    const c = -rng.int(1, 5);
    const p = nz(rng, 6);
    const r = nz(rng, 6);
    const s = rng.int(1, 4);
    const det = (s - a) * (s - d) - b * c;
    const top = (s - d) * p + b * r;
    const answer = Q.of(top, det);
    const second = Q.of((s - a) * r + c * p, det);
    return numberProblem({
      prompt: t(
        `For $x_{1}' = ${poly([a, "x_{1}"], [b, "x_{2}"])}$, $x_{2}' = ${poly([c, "x_{1}"], [d, "x_{2}"])}$ with $x_{1}(0) = ${p}$ and $x_{2}(0) = ${r}$, find $X_{1}(${s})$, where $X_{1} = \\mathcal{L}\\{x_{1}\\}$.`,
        `对 $x_{1}' = ${poly([a, "x_{1}"], [b, "x_{2}"])}$，$x_{2}' = ${poly([c, "x_{1}"], [d, "x_{2}"])}$，$x_{1}(0) = ${p}$，$x_{2}(0) = ${r}$，求 $X_{1}(${s})$，其中 $X_{1} = \\mathcal{L}\\{x_{1}\\}$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(p, s - a),
          "That ignores the coupling, as if $x_{2}$ had no effect on $x_{1}$.",
          "这忽略了耦合，好像 $x_{2}$ 对 $x_{1}$ 没有影响。",
        ),
        why(
          Q.of((s - a) * p + b * r, det),
          "That multiplies $x_{1}(0)$ by the wrong diagonal entry; replacing the first column leaves $s - d$ beside it.",
          "这让 $x_{1}(0)$ 乘了错误的对角元；替换第一列后与它相乘的是 $s - d$。",
        ),
        why(
          Q.of((s - d) * p - b * r, det),
          "That keeps the sign of $b$ from $A$; in $sI - A$ the entry is $-b$, and the determinant subtracts it once more.",
          "这沿用了 $A$ 中 $b$ 的符号；$sI - A$ 中该元素是 $-b$，行列式又再减一次。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Form sI - A", "写出 sI - A"],
            t(`At $s = ${s}$:`, `在 $s = ${s}$ 处：`),
            [`sI - A = ${mat(s - a, -b, -c, s - d)}, \\qquad \\det = ${s - a} \\cdot ${s - d} - ${paren(-b)} \\cdot ${paren(-c)} = ${det}`],
          ],
          [
            ["Apply Cramer's rule", "用克拉默法则"],
            t("Replace the first column by $\\mathbf{x}(0)$:", "用 $\\mathbf{x}(0)$ 替换第一列："),
            [
              `\\det${mat(p, -b, r, s - d)} = ${paren(p)} \\cdot ${s - d} - ${paren(-b)} \\cdot ${paren(r)} = ${top}`,
              `X_{1}(${s}) = \\frac{${top}}{${det}}${top % det === 0 || Q.of(top, det).toLatex() !== `\\frac{${top}}{${det}}` ? ` = ${answer.toLatex()}` : ""}`,
            ],
          ],
        ],
        t(
          `Cramer's rule also gives $X_{2}(${s}) = ${second.toLatex()}$, and the first row checks: $${s - a} \\cdot ${paren(answer)} - ${b} \\cdot ${paren(second)} = ${p}$, which is $x_{1}(0)$.`,
          `克拉默法则还给出 $X_{2}(${s}) = ${second.toLatex()}$，代入第一行检验：$${s - a} \\cdot ${paren(answer)} - ${b} \\cdot ${paren(second)} = ${p}$，正是 $x_{1}(0)$。`,
        ),
      ),
    });
  },
);

const cascadeTransform = point(
  "the-transform-of-a-forced-cascade",
  ["The transform of a forced cascade", "受迫级联系统的变换"],
  [
    "In a cascade the forcing reaches the first variable only through the second, so the transforms multiply along the chain. A constant force contributes $\\frac{f}{s}$, not $f$, and this factor of $\\frac{1}{s}$ is the part most often forgotten.\n\n> **Watch out.** For $x_{1}' = -x_{1} + x_{2}$, $x_{2}' = -x_{2} + 4$ from rest at $s = 2$: $X_{2}(2) = \\frac{4}{2 \\cdot 3} = \\frac{2}{3}$ and $X_{1}(2) = \\frac{2}{3} \\div 3 = \\frac{2}{9}$. Leaving out the $\\frac{1}{s}$ gives $\\frac{4}{9}$.",
    "在级联系统中，强迫项只通过第二个变量作用于第一个变量，所以变换沿着链条相乘。常力贡献的是 $\\frac{f}{s}$，而不是 $f$，这个 $\\frac{1}{s}$ 因子最容易被遗忘。\n\n> **注意。** 对从静止出发的 $x_{1}' = -x_{1} + x_{2}$，$x_{2}' = -x_{2} + 4$，在 $s = 2$ 处：$X_{2}(2) = \\frac{4}{2 \\cdot 3} = \\frac{2}{3}$，$X_{1}(2) = \\frac{2}{3} \\div 3 = \\frac{2}{9}$。漏掉 $\\frac{1}{s}$ 会得到 $\\frac{4}{9}$。",
  ],
  (rng) => {
    const a = rng.int(1, 5);
    const c = rng.int(1, 5);
    const b = nz(rng, 5);
    const f = nz(rng, 12);
    const s = rng.int(1, 4);
    const answer = Q.of(b * f, s * (s + a) * (s + c));
    const X2 = Q.of(f, s * (s + c));
    const bb = b === 1 ? "" : b === -1 ? "-" : `${b}`;
    return numberProblem({
      prompt: t(
        `For $x_{1}' = ${poly([-a, "x_{1}"], [b, "x_{2}"])}$, $x_{2}' = ${poly([-c, "x_{2}"], [f, ""])}$ with $x_{1}(0) = x_{2}(0) = 0$, find $X_{1}(${s})$, where $X_{1} = \\mathcal{L}\\{x_{1}\\}$.`,
        `对 $x_{1}' = ${poly([-a, "x_{1}"], [b, "x_{2}"])}$，$x_{2}' = ${poly([-c, "x_{2}"], [f, ""])}$，$x_{1}(0) = x_{2}(0) = 0$，求 $X_{1}(${s})$，其中 $X_{1} = \\mathcal{L}\\{x_{1}\\}$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          Q.of(b * f, (s + a) * (s + c)),
          `That transforms the constant $${f}$ as $${f}$; its transform is $\\frac{${f}}{s}$.`,
          `这把常数 $${f}$ 的变换当成了 $${f}$；它的变换是 $\\frac{${f}}{s}$。`,
        ),
        why(X2, "That is $X_{2}$; the question asks for $X_{1}$.", "这是 $X_{2}$；题目问的是 $X_{1}$。"),
        why(
          Q.of(b * f, s * (s + a)),
          `That leaves out the factor $\\frac{1}{s + ${c}}$ from the second equation.`,
          `这漏掉了第二个方程带来的因子 $\\frac{1}{s + ${c}}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Transform the second equation", "变换第二个方程"],
            t("", ""),
            [`(s + ${c})X_{2} = \\frac{${f}}{s}, \\qquad X_{2}(${s}) = \\frac{${f}}{${s} \\cdot ${s + c}} = ${X2.toLatex()}`],
          ],
          [
            ["Transform the first equation", "变换第一个方程"],
            t("", ""),
            [`(s + ${a})X_{1} = ${bb}X_{2}, \\qquad X_{1}(${s}) = \\frac{${b} \\cdot ${paren(X2)}}{${s + a}} = ${answer.toLatex()}`],
          ],
        ],
        t(
          `In one fraction, $X_{1}(s) = \\frac{${b * f}}{s(s + ${a})(s + ${c})}$, and at $s = ${s}$ the denominator is $${s} \\cdot ${s + a} \\cdot ${s + c} = ${s * (s + a) * (s + c)}$, which again gives $${answer.toLatex()}$.`,
          `合成一个分式，$X_{1}(s) = \\frac{${b * f}}{s(s + ${a})(s + ${c})}$，在 $s = ${s}$ 处分母为 $${s} \\cdot ${s + a} \\cdot ${s + c} = ${s * (s + a) * (s + c)}$，同样得 $${answer.toLatex()}$。`,
        ),
      ),
    });
  },
);

/** ordinals names the first few positions in a list. */
const ordinals: readonly Pair[] = [
  ["smallest", "最小的"],
  ["second smallest", "第二小的"],
  ["third smallest", "第三小的"],
  ["fourth smallest", "第四小的"],
];

const bvpEigenvalues = point(
  "the-values-of-lambda-with-nonzero-solutions",
  ["The values of lambda with nonzero solutions", "存在非零解的 lambda 值"],
  [
    "A homogeneous boundary value problem has the zero solution, and nonzero solutions only for special values of the parameter. For $y'' + \\lambda y = 0$ with $y(0) = y(L) = 0$, the condition is that $\\sqrt{\\lambda}L$ is a multiple of $\\pi$, so $\\lambda$ equals $\\left(\\frac{n\\pi}{L}\\right)^{2}$. For $L = \\frac{\\pi}{2}$: $\\sqrt{\\lambda} \\cdot \\frac{\\pi}{2} = n\\pi$ gives $\\sqrt{\\lambda} = 2n$, so $\\lambda = 4, 16, 36, \\ldots$\n\n> **Watch out.** $\\lambda = 0$ is not on the list: $y = c_{1} + c_{2}x$ with both ends zero is only $y = 0$. And square at the end: for $L = \\frac{\\pi}{3}$ the smallest $\\lambda$ is $9$, not $3$.",
    "齐次边值问题有零解，只有参数取特殊值时才有非零解。对 $y'' + \\lambda y = 0$，$y(0) = y(L) = 0$，条件是 $\\sqrt{\\lambda}L$ 为 $\\pi$ 的倍数，所以 $\\lambda$ 等于 $\\left(\\frac{n\\pi}{L}\\right)^{2}$。对 $L = \\frac{\\pi}{2}$：$\\sqrt{\\lambda} \\cdot \\frac{\\pi}{2} = n\\pi$ 给出 $\\sqrt{\\lambda} = 2n$，所以 $\\lambda = 4, 16, 36, \\ldots$\n\n> **注意。** $\\lambda = 0$ 不在其中：$y = c_{1} + c_{2}x$ 两端为零时只能是 $y = 0$。最后还要平方：对 $L = \\frac{\\pi}{3}$，最小的 $\\lambda$ 是 $9$，不是 $3$。",
  ],
  (rng) => {
    const k = rng.int(1, 9);
    const n = rng.int(1, 4);
    const L = k === 1 ? "\\pi" : `\\frac{\\pi}{${k}}`;
    const name = ordinals[n - 1] as Pair;
    const answer = (n * k) ** 2;
    const nPi = `${n === 1 ? "" : n}\\pi`;
    return numberProblem({
      prompt: t(
        `$y'' + \\lambda y = 0$ with $y(0) = 0$ and $y\\left(${L}\\right) = 0$ has nonzero solutions for certain positive $\\lambda$. Find the ${name[0]} such $\\lambda$.`,
        `$y'' + \\lambda y = 0$，$y(0) = 0$，$y\\left(${L}\\right) = 0$，对某些正数 $\\lambda$ 有非零解。求${name[1]}这样的 $\\lambda$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(n * k, "That is $\\sqrt{\\lambda}$; square it to get $\\lambda$.", "这是 $\\sqrt{\\lambda}$；平方后才是 $\\lambda$。"),
        why(
          ((n - 1) * k) ** 2,
          "That counts $\\lambda = 0$ as the first value; it gives only $y = 0$, so the list starts at $n = 1$.",
          "这把 $\\lambda = 0$ 算作第一个值；它只给出 $y = 0$，所以从 $n = 1$ 开始数。",
        ),
        why(
          (2 * n * k) ** 2,
          "That makes $\\sqrt{\\lambda}L$ a multiple of $2\\pi$; the sine is already $0$ at every multiple of $\\pi$.",
          "这要求 $\\sqrt{\\lambda}L$ 为 $2\\pi$ 的倍数；正弦在 $\\pi$ 的每个倍数处就已经为 $0$。",
        ),
      ]),
      solution: walked(
        [
          [
            ["Use the first condition", "用第一个条件"],
            t("", ""),
            ["y = c_{1}\\cos\\sqrt{\\lambda}x + c_{2}\\sin\\sqrt{\\lambda}x, \\qquad y(0) = c_{1} = 0"],
          ],
          [
            ["Use the second condition", "用第二个条件"],
            t(
              "A nonzero solution needs $c_{2} \\ne 0$, so the sine must vanish at the far end:",
              "非零解要求 $c_{2} \\ne 0$，所以正弦必须在另一端为零：",
            ),
            [`\\sqrt{\\lambda} \\cdot ${L} = n\\pi \\implies \\sqrt{\\lambda} = ${k === 1 ? "n" : `${k}n`}, \\quad n = 1, 2, 3, \\ldots`],
          ],
          [[`Take n = ${n}`, `取 n = ${n}`], t("", ""), [`\\sqrt{\\lambda} = ${n * k}, \\qquad \\lambda = ${answer}`]],
        ],
        t(
          `$y = ${angle("sin", n * k, "x")}$ is not zero, and at $x = ${L}$ its angle is $${nPi}$, where the sine is $0$.`,
          `$y = ${angle("sin", n * k, "x")}$ 不恒为零，在 $x = ${L}$ 处其角度为 $${nPi}$，正弦为 $0$。`,
        ),
      ),
    });
  },
);

const integrationConstant = point(
  "the-constant-from-integrating-sine-terms",
  ["The constant from integrating sine terms", "积分正弦项产生的常数"],
  [
    "Integrating a sine series term by term from $0$ to $x$ does not give a pure cosine series. Since $\\int_{0}^{x} \\sin nt \\, dt = \\frac{1 - \\cos nx}{n}$, each term leaves a constant $\\frac{1}{n}$ times its coefficient, and these constants add up. For $2\\sin t + 6\\sin 3t$: $\\int_{0}^{x} = 2(1 - \\cos x) + 2(1 - \\cos 3x) = 4 - 2\\cos x - 2\\cos 3x$, with constant term $4$.\n\n> **Watch out.** The constant is $+\\frac{b_n}{n}$: it comes from subtracting $-\\frac{\\cos 0}{n}$ at the lower limit. Dropping the lower limit gives $0$, and subtracting the wrong way flips the sign. For $\\sin 2t$ alone the constant is $\\frac{1}{2}$, not $0$ or $-\\frac{1}{2}$.",
    "把正弦级数从 $0$ 到 $x$ 逐项积分，得到的不是纯余弦级数。由于 $\\int_{0}^{x} \\sin nt \\, dt = \\frac{1 - \\cos nx}{n}$，每一项都留下一个常数，等于其系数乘以 $\\frac{1}{n}$，这些常数相加。对 $2\\sin t + 6\\sin 3t$：$\\int_{0}^{x} = 2(1 - \\cos x) + 2(1 - \\cos 3x) = 4 - 2\\cos x - 2\\cos 3x$，常数项为 $4$。\n\n> **注意。** 常数是 $+\\frac{b_n}{n}$：它来自在下限处减去 $-\\frac{\\cos 0}{n}$。漏掉下限得 $0$，减反了符号就反了。单独的 $\\sin 2t$ 常数为 $\\frac{1}{2}$，不是 $0$ 或 $-\\frac{1}{2}$。",
  ],
  (rng) => {
    const a = nz(rng, 12);
    const b = nz(rng, 12);
    const p = rng.int(1, 5);
    const q = rng.pick([1, 2, 3, 4, 5, 6].filter((v) => v !== p));
    const A = Q.of(a, p);
    const B = Q.of(b, q);
    const answer = A.add(B);
    const f = poly([a, angle("sin", p, "t")], [b, angle("sin", q, "t")]);
    /** times writes a rational coefficient in front of a bracket, leaving out 1. */
    const times = (r: Q) => (r.toLatex() === "1" ? "" : r.toLatex() === "-1" ? "-" : r.toLatex());
    const term = (c: number, m: number, r: Q) =>
      `\\int_{0}^{x} ${poly([c, angle("sin", m, "t")])}\\,dt = ${times(r)}\\left(1 - ${angle("cos", m, "x")}\\right)`;
    return numberProblem({
      prompt: t(
        `Integrate $${f}$ term by term from $0$ to $x$. Find the constant term of the result.`,
        `把 $${f}$ 从 $0$ 到 $x$ 逐项积分。求结果的常数项。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          0,
          "The sines have mean zero, but the lower limit still leaves a constant from each term.",
          "正弦的平均值为零，但下限仍为每一项留下一个常数。",
        ),
        why(
          answer.neg(),
          "The sign is flipped: $\\left[-\\frac{\\cos nt}{n}\\right]_{0}^{x} = \\frac{1}{n} - \\frac{\\cos nx}{n}$.",
          "符号反了：$\\left[-\\frac{\\cos nt}{n}\\right]_{0}^{x} = \\frac{1}{n} - \\frac{\\cos nx}{n}$。",
        ),
        why(a + b, "That forgets to divide each coefficient by its $n$.", "这忘了把每个系数除以对应的 $n$。"),
        why(
          Q.of(a, p * p).add(Q.of(b, q * q)),
          "That divides by $n$ twice; integrating once brings one factor $\\frac{1}{n}$.",
          "这除了两次 $n$；积分一次只带来一个因子 $\\frac{1}{n}$。",
        ),
      ]),
      solution: walked(
        [
          [["Integrate each term", "逐项积分"], t("", ""), [term(a, p, A), term(b, q, B)]],
          [
            ["Collect the constants", "合并常数"],
            t("Each bracket contributes its coefficient times $1$:", "每个括号贡献其系数乘以 $1$："),
            [`${A.toLatex()} + ${paren(B)} = ${answer.toLatex()}`],
          ],
        ],
        t(
          `At $x = 0$ the integral from $0$ to $0$ must be $0$. With every cosine equal to $1$ there, the result is $${answer.toLatex()} - ${paren(A)} - ${paren(B)} = 0$.`,
          `在 $x = 0$ 处，从 $0$ 到 $0$ 的积分必须为 $0$。那里每个余弦都等于 $1$，结果为 $${answer.toLatex()} - ${paren(A)} - ${paren(B)} = 0$。`,
        ),
      ),
    });
  },
);

const constantMode = point(
  "the-constant-mode-of-a-periodic-response",
  ["The constant mode of a periodic response", "周期响应的常数模态"],
  [
    "A Fourier series may have a constant term, and it counts as the mode with $n = 0$. For $y'' + k^{2}y = c + b\\sin nx$ the constant mode responds with $\\frac{c}{k^{2}}$ and the sine mode with $\\frac{b}{k^{2} - n^{2}}$, and the solution is their sum. For $y'' + 4y = 8 + 6\\sin x$: the constant $Y_{0}$ has $4Y_{0} = 8$, so $Y_{0} = 2$, and the sine mode has $(4 - 1)Y_{1} = 6$, so $Y_{1} = 2$. Thus $y = 2 + 2\\sin x$.\n\n> **Watch out.** The constant mode divides by $k^{2}$, and it must not be dropped. In the example $y\\left(\\frac{\\pi}{2}\\right) = 2 + 2 = 4$, not $2$; and $8$ undivided is not the constant of $y$.",
    "傅里叶级数可能有常数项，它相当于 $n = 0$ 的模态。对 $y'' + k^{2}y = c + b\\sin nx$，常数模态的响应是 $\\frac{c}{k^{2}}$，正弦模态的响应是 $\\frac{b}{k^{2} - n^{2}}$，解是它们的和。对 $y'' + 4y = 8 + 6\\sin x$：常数 $Y_{0}$ 满足 $4Y_{0} = 8$，所以 $Y_{0} = 2$；正弦模态满足 $(4 - 1)Y_{1} = 6$，所以 $Y_{1} = 2$。于是 $y = 2 + 2\\sin x$。\n\n> **注意。** 常数模态要除以 $k^{2}$，而且不能丢掉。在这个例子中 $y\\left(\\frac{\\pi}{2}\\right) = 2 + 2 = 4$，不是 $2$；没除的 $8$ 也不是 $y$ 的常数项。",
  ],
  (rng) => {
    const k = rng.int(2, 6);
    const n = rng.pick([1, 3].filter((v) => v !== k));
    const c = nz(rng, 40);
    const b = nz(rng, 40);
    const sign = n === 1 ? 1 : -1;
    const level = Q.of(c, k * k);
    const mode = Q.of(b, k * k - n * n);
    const answer = level.add(mode.mul(Q.of(sign)));
    const left = poly([1, "y''"], [k * k, "y"]);
    const right = poly([c, ""], [b, angle("sin", n, "x")]);
    const signed = mode.mul(Q.of(sign));
    return numberProblem({
      prompt: t(
        `$y$ is the periodic solution of $${left} = ${right}$. Find $y\\left(\\frac{\\pi}{2}\\right)$.`,
        `$y$ 是 $${left} = ${right}$ 的周期解。求 $y\\left(\\frac{\\pi}{2}\\right)$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(signed, "That drops the constant mode $Y_{0}$.", "这丢掉了常数模态 $Y_{0}$。"),
        why(level, "That drops the sine mode.", "这丢掉了正弦模态。"),
        why(
          level.sub(signed),
          `That takes the sine at $\\frac{\\pi}{2}$ with the wrong sign; $\\sin\\frac{${n === 1 ? "" : n}\\pi}{2} = ${sign}$.`,
          `这把 $\\frac{\\pi}{2}$ 处的正弦符号弄反了；$\\sin\\frac{${n === 1 ? "" : n}\\pi}{2} = ${sign}$。`,
        ),
        why(
          Q.of(c).add(signed),
          `That leaves the constant $${c}$ undivided; the constant mode is $\\frac{${c}}{${k * k}}$.`,
          `这没有把常数 $${c}$ 除以 $${k * k}$；常数模态是 $\\frac{${c}}{${k * k}}$。`,
        ),
      ]),
      solution: walked(
        [
          [
            ["Constant mode", "常数模态"],
            t("A constant $Y_{0}$ has $Y_{0}'' = 0$:", "常数 $Y_{0}$ 满足 $Y_{0}'' = 0$："),
            [`${k * k}Y_{0} = ${c}, \\qquad Y_{0} = ${level.toLatex()}`],
          ],
          [
            ["Sine mode", "正弦模态"],
            t(
              `For $Y_{1}${angle("sin", n, "x")}$ the second derivative brings $-${n * n}$:`,
              `对 $Y_{1}${angle("sin", n, "x")}$，二阶导数带来 $-${n * n}$：`,
            ),
            [`(${k * k} - ${n * n})Y_{1} = ${b}, \\qquad Y_{1} = ${mode.toLatex()}`],
          ],
          [
            ["Evaluate at π/2", "在 π/2 处求值"],
            t("", ""),
            [
              `\\sin\\frac{${n === 1 ? "" : n}\\pi}{2} = ${sign}, \\qquad y\\left(\\frac{\\pi}{2}\\right) = Y_{0} ${sign === 1 ? "+" : "-"} Y_{1} = ${answer.toLatex()}`,
            ],
          ],
        ],
        t(
          `Putting each part back: $${k * k} \\cdot ${paren(level)} = ${c}$ and $(${k * k} - ${n * n}) \\cdot ${paren(mode)} = ${b}$, the two terms of the right side.`,
          `逐项代回：$${k * k} \\cdot ${paren(level)} = ${c}$，$(${k * k} - ${n * n}) \\cdot ${paren(mode)} = ${b}$，正是右边的两项。`,
        ),
      ),
    });
  },
);

const cosineIvp = point(
  "cosine-forcing-changes-the-first-constant",
  ["Cosine forcing changes the first constant", "余弦强迫改变第一个常数"],
  [
    "Under sine forcing the particular part vanishes at $t = 0$, so $c_{1} = y(0)$. Under cosine forcing it does not: the particular part has the value $Y$ at $t = 0$, and so $c_{1} = y(0) - Y$. The derivative condition then fixes $c_{2}$ on its own. For $y'' + 4y = 3\\cos t$ with $y(0) = 5$: $(4 - 1)Y = 3$ gives $Y = 1$, and $y(0) = Y + c_{1}$ gives $c_{1} = 4$.\n\n> **Watch out.** Do not set $c_{1} = y(0)$ out of habit from sine forcing, and subtract $Y$ rather than add it. In the example $c_{1} = 4$, not $5$ or $6$.",
    "在正弦强迫下，特解部分在 $t = 0$ 处为零，所以 $c_{1} = y(0)$。在余弦强迫下则不然：特解部分在 $t = 0$ 处的值是 $Y$，所以 $c_{1} = y(0) - Y$。导数条件再单独确定 $c_{2}$。对 $y'' + 4y = 3\\cos t$，$y(0) = 5$：$(4 - 1)Y = 3$ 给出 $Y = 1$，$y(0) = Y + c_{1}$ 给出 $c_{1} = 4$。\n\n> **注意。** 不要沿用正弦强迫的习惯令 $c_{1} = y(0)$，并且要减去 $Y$ 而不是加上。在这个例子中 $c_{1} = 4$，不是 $5$ 或 $6$。",
  ],
  (rng) => {
    const k = rng.int(1, 6);
    const w = rng.pick([1, 2, 3, 4, 5, 6].filter((v) => v !== k));
    const F = nz(rng, 30);
    const y0 = rng.int(-9, 9);
    const v0 = rng.int(-9, 9);
    const Y = Q.of(F, k * k - w * w);
    const answer = Q.of(y0).sub(Y);
    const left = poly([1, "y''"], [k * k, "y"]);
    const form = `Y${angle("cos", w, "t")} + c_{1}${angle("cos", k, "t")} + c_{2}${angle("sin", k, "t")}`;
    return numberProblem({
      prompt: t(
        `Solve $${left} = ${poly([F, angle("cos", w, "t")])}$ with $y(0) = ${y0}$ and $y'(0) = ${v0}$, writing $y = ${form}$. Find $c_{1}$.`,
        `解 $${left} = ${poly([F, angle("cos", w, "t")])}$，$y(0) = ${y0}$，$y'(0) = ${v0}$，写成 $y = ${form}$。求 $c_{1}$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(
          y0,
          "That is the rule for sine forcing; here the particular part is $Y$ at $t = 0$.",
          "这是正弦强迫时的做法；这里特解部分在 $t = 0$ 处为 $Y$。",
        ),
        why(Q.of(y0).add(Y), "That adds $Y$; it has to be subtracted from $y(0)$.", "这加上了 $Y$；应当从 $y(0)$ 中减去。"),
        why(Y, "That is $Y$ itself, the coefficient of the forced cosine.", "这是 $Y$ 本身，即强迫余弦项的系数。"),
      ]),
      solution: walked(
        [
          [
            ["Find Y", "求 Y"],
            t(`Put $Y${angle("cos", w, "t")}$ into the equation:`, `把 $Y${angle("cos", w, "t")}$ 代入方程：`),
            [`(${k * k} - ${w * w})Y = ${F}, \\qquad Y = ${Y.toLatex()}`],
          ],
          [
            ["Use y(0)", "用 y(0)"],
            t("At $t = 0$ every cosine is $1$ and every sine is $0$:", "在 $t = 0$ 处每个余弦为 $1$，每个正弦为 $0$："),
            [`Y + c_{1} = ${y0}, \\qquad c_{1} = ${y0} - ${paren(Y)} = ${answer.toLatex()}`],
          ],
        ],
        t(
          `$y(0) = ${Y.toLatex()} + ${paren(answer)} = ${y0}$, as required; the condition $y'(0) = ${v0}$ only fixes $c_{2}$.`,
          `$y(0) = ${Y.toLatex()} + ${paren(answer)} = ${y0}$，符合要求；条件 $y'(0) = ${v0}$ 只确定 $c_{2}$。`,
        ),
      ),
    });
  },
);

const reactionBvp = point(
  "a-reaction-term-in-the-sine-expansion",
  ["A reaction term in the sine expansion", "正弦展开中的反应项"],
  [
    "The sine expansion still works for $-y'' + k^{2}y = f$ on $[0, \\pi]$ with zero boundary values. On the mode $\\sin nx$ the left side multiplies by $n^{2} + k^{2}$, so each coefficient divides by this sum. There is no resonance, because the sum is never zero. For $-y'' + 4y = 10\\sin x$: $y = Y\\sin x$ gives $(1 + 4)Y = 10$, so $Y = 2$.\n\n> **Watch out.** $-y''$ on $\\sin nx$ gives $+n^{2}$, so the two parts add. Dividing by $k^{2} - n^{2}$, or by $k^{2}$ alone, is wrong: in the example $Y = 2$, not $\\frac{10}{3}$ or $\\frac{5}{2}$.",
    "正弦展开对 $[0, \\pi]$ 上边界值为零的 $-y'' + k^{2}y = f$ 同样有效。在模态 $\\sin nx$ 上，左边乘以 $n^{2} + k^{2}$，所以每个系数都除以这个和。不会共振，因为这个和永远不为零。对 $-y'' + 4y = 10\\sin x$：$y = Y\\sin x$ 给出 $(1 + 4)Y = 10$，所以 $Y = 2$。\n\n> **注意。** $-y''$ 作用在 $\\sin nx$ 上给出 $+n^{2}$，所以两部分相加。除以 $k^{2} - n^{2}$ 或只除以 $k^{2}$ 都是错的：在这个例子中 $Y = 2$，不是 $\\frac{10}{3}$ 或 $\\frac{5}{2}$。",
  ],
  (rng) => {
    const n = rng.int(1, 5);
    const k = rng.int(1, 6);
    const b = nz(rng, 60);
    const answer = Q.of(b, n * n + k * k);
    const left = poly([-1, "y''"], [k * k, "y"]);
    const right = poly([b, angle("sin", n, "x")]);
    const mode = angle("sin", n, "x");
    const nn = n === 1 ? "" : `${n * n}`;
    return numberProblem({
      prompt: t(
        `Solve $${left} = ${right}$ on $[0, \\pi]$ with $y(0) = y(\\pi) = 0$, writing $y = Y${mode}$. Find $Y$.`,
        `在 $[0, \\pi]$ 上解 $${left} = ${right}$，$y(0) = y(\\pi) = 0$，写成 $y = Y${mode}$。求 $Y$。`,
      ),
      answer,
      mistakes: apart(answer, [
        why(Q.of(b, n * n), `That drops the term $${k === 1 ? "" : k * k}y$.`, `这漏掉了 $${k === 1 ? "" : k * k}y$ 这一项。`),
        why(Q.of(b, k * k), "That drops $-y''$, which contributes $n^{2}Y$.", "这漏掉了 $-y''$，它贡献 $n^{2}Y$。"),
        why(
          Q.of(b, (n + k) ** 2),
          "That adds $n$ and $k$ before squaring; the factor is $n^{2} + k^{2}$.",
          "这是先把 $n$ 与 $k$ 相加再平方；因子是 $n^{2} + k^{2}$。",
        ),
        ...(n === k
          ? []
          : [
              why(
                Q.of(b, k * k - n * n),
                "That treats $-y''$ as $-n^{2}Y$; differentiating twice gives $-n^{2}$, and the minus sign in front makes it $+n^{2}$.",
                "这把 $-y''$ 当成 $-n^{2}Y$；求两次导得 $-n^{2}$，前面的负号使它变成 $+n^{2}$。",
              ),
            ]),
      ]),
      solution: walked(
        [
          [["Differentiate the mode", "对模态求导"], t("", ""), [`y'' = -${nn}Y${mode}, \\qquad -y'' = ${nn}Y${mode}`]],
          [["Match the coefficients", "比较系数"], t("", ""), [`(${n * n} + ${k * k})Y = ${b}, \\qquad Y = ${answer.toLatex()}`]],
        ],
        t(
          `The mode meets both ends: $\\sin 0 = 0$ and $\\sin ${n === 1 ? "" : n}\\pi = 0$. And $${n * n + k * k} \\cdot ${paren(answer)} = ${b}$.`,
          `这个模态满足两端条件：$\\sin 0 = 0$，$\\sin ${n === 1 ? "" : n}\\pi = 0$。并且 $${n * n + k * k} \\cdot ${paren(answer)} = ${b}$。`,
        ),
      ),
    });
  },
);

const leadingLimits = point(
  "the-limits-that-enter-the-indicial-equation",
  ["The limits that enter the indicial equation", "进入指标方程的极限"],
  [
    "At a regular singular point $x = 0$, the numbers $p_{0} = \\lim_{x \\to 0} xP(x)$ and $q_{0} = \\lim_{x \\to 0} x^{2}Q(x)$ are what enter the indicial equation. Only the values at $x = 0$ matter, so the higher terms of the numerators have no effect.",
    "在正则奇点 $x = 0$ 处，进入指标方程的是 $p_{0} = \\lim_{x \\to 0} xP(x)$ 和 $q_{0} = \\lim_{x \\to 0} x^{2}Q(x)$。只有 $x = 0$ 处的值起作用，所以分子的高次项没有影响。",
  ],
  (rng) => {
    const a = nz(rng, 9);
    const b = nz(rng, 5);
    const e = rng.int(1, 6);
    const c = nz(rng, 9);
    const g = nz(rng, 5);
    const f = rng.int(1, 6);
    const useP = rng.bool();
    const answer = useP ? Q.of(a, e) : Q.of(c, f);
    const P = `\\frac{${poly([a, ""], [b, "x"])}}{x(x + ${e})}`;
    const R = `\\frac{${poly([c, ""], [g, "x"])}}{x^{2}(x + ${f})}`;
    const name = useP ? "p_{0} = \\lim_{x \\to 0} xP(x)" : "q_{0} = \\lim_{x \\to 0} x^{2}Q(x)";
    return ask(
      [
        `For $y'' + P(x)y' + Q(x)y = 0$ with $P(x) = ${P}$ and $Q(x) = ${R}$, find $${name}$.`,
        `对 $y'' + P(x)y' + Q(x)y = 0$，其中 $P(x) = ${P}$，$Q(x) = ${R}$，求 $${name}$。`,
      ],
      answer,
      [useP ? a : c, useP ? Q.of(b, e) : Q.of(g, f), useP ? Q.of(c, f) : Q.of(a, e)],
      [
        useP
          ? `$xP(x) = \\frac{${poly([a, ""], [b, "x"])}}{x + ${e}}$. Setting $x = 0$ gives $${answer.toLatex()}$.`
          : `$x^{2}Q(x) = \\frac{${poly([c, ""], [g, "x"])}}{x + ${f}}$. Setting $x = 0$ gives $${answer.toLatex()}$.`,
        useP
          ? `$xP(x) = \\frac{${poly([a, ""], [b, "x"])}}{x + ${e}}$。令 $x = 0$，得 $${answer.toLatex()}$。`
          : `$x^{2}Q(x) = \\frac{${poly([c, ""], [g, "x"])}}{x + ${f}}$。令 $x = 0$，得 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const nonzeroExponent = point(
  "the-recurrence-with-a-nonzero-exponent",
  ["The recurrence with a nonzero exponent", "指数不为零时的递推关系"],
  [
    "With exponent $r$, the power of $x$ in each term is $n + r$, so the exponent changes the recurrence. For $xy'' + cy = 0$, the coefficient of $x^{n + r}$ gives $a_{n + 1}(n + r + 1)(n + r) + ca_{n} = 0$, which has to be evaluated at the chosen $r$.",
    "指数为 $r$ 时，每项中 $x$ 的幂是 $n + r$，所以指数会改变递推关系。对 $xy'' + cy = 0$，$x^{n + r}$ 的系数给出 $a_{n + 1}(n + r + 1)(n + r) + ca_{n} = 0$，要在所选的 $r$ 处取值。",
  ],
  (rng) => {
    const c = nz(rng, 12);
    const N = rng.int(1, 5);
    const denom = (N + 2) * (N + 1);
    const answer = Q.of(-c, denom);
    return ask(
      [
        `The equation $${poly([1, "xy''"], [c, "y"])} = 0$ has a Frobenius solution $y = \\sum a_{n}x^{n + 1}$ with exponent $r = 1$. Find $\\frac{a_{${N + 1}}}{a_{${N}}}$.`,
        `方程 $${poly([1, "xy''"], [c, "y"])} = 0$ 有弗罗贝尼乌斯解 $y = \\sum a_{n}x^{n + 1}$，指数 $r = 1$。求 $\\frac{a_{${N + 1}}}{a_{${N}}}$。`,
      ],
      answer,
      [answer.neg(), Q.of(-c, (N + 1) * N), Q.of(-c, N + 1)],
      [
        `With $r = 1$ the recurrence is $a_{n + 1}(n + 2)(n + 1) + ${paren(c)}a_{n} = 0$. At $n = ${N}$, the factors are $${N + 2}$ and $${N + 1}$, so the ratio is $${answer.toLatex()}$.`,
        `当 $r = 1$ 时，递推关系是 $a_{n + 1}(n + 2)(n + 1) + ${paren(c)}a_{n} = 0$。在 $n = ${N}$ 处，因子是 $${N + 2}$ 和 $${N + 1}$，所以比值是 $${answer.toLatex()}$。`,
      ],
    );
  },
);

const secondSolutionForm = point(
  "the-form-of-the-second-solution",
  ["The form of the second solution", "第二个解的形式"],
  [
    "The difference of the exponents decides the form of the second Frobenius solution. A non-integer difference gives a second series. Equal exponents always bring a logarithm. A positive integer difference may bring a logarithm, with a coefficient that may turn out to be zero.",
    "指数之差决定第二个弗罗贝尼乌斯解的形式。差不是整数时，得到第二个级数。指数相等时，一定出现对数。差是正整数时，可能出现对数，其系数可能为零。",
  ],
  (rng) => {
    const kind = rng.pick(["half", "equal", "integer"]);
    let A = 1;
    let B = 0;
    let C = 0;
    let roots: Pair = ["", ""];
    if (kind === "equal") {
      const m = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
      B = 1 - 2 * m;
      C = m * m;
      roots = [`$${m}$ twice`, `$${m}$（二重）`];
    } else if (kind === "integer") {
      const low = rng.int(-3, 3);
      const high = low + rng.int(1, 3);
      B = 1 - low - high;
      C = low * high;
      roots = [`$${high}$ and $${low}$`, `$${high}$ 和 $${low}$`];
    } else {
      A = 2;
      const i = rng.int(0, 3);
      const j = rng.pick([-2, -1, 1, 2, 3]);
      B = 1 - 2 * i - 2 * j;
      C = (2 * i + 1) * j;
      const half = Q.of(2 * i + 1, 2).toLatex();
      roots = [`$${half}$ and $${j}$`, `$${half}$ 和 $${j}$`];
    }
    const two: Pair = [
      "Two series with no logarithm: $y_{2} = x^{r_{2}}\\sum b_{n}x^{n}$",
      "两个级数，没有对数：$y_{2} = x^{r_{2}}\\sum b_{n}x^{n}$",
    ];
    const log: Pair = [
      "Always a logarithm: $y_{2} = y_{1}\\ln x + x^{r_{1}}\\sum b_{n}x^{n}$",
      "一定有对数：$y_{2} = y_{1}\\ln x + x^{r_{1}}\\sum b_{n}x^{n}$",
    ];
    const maybe: Pair = [
      "Possibly a logarithm: $y_{2} = Cy_{1}\\ln x + x^{r_{2}}\\sum b_{n}x^{n}$, where $C$ may be zero",
      "可能有对数：$y_{2} = Cy_{1}\\ln x + x^{r_{2}}\\sum b_{n}x^{n}$，其中 $C$ 可能为零",
    ];
    const product: Pair = ["A simple multiple of the first: $y_{2} = xy_{1}$", "第一个解的简单倍数：$y_{2} = xy_{1}$"];
    const correct = kind === "half" ? two : kind === "equal" ? log : maybe;
    const eq = poly([A, "x^{2}y''"], [B, "xy'"], [1, "xy"], [C, "y"]);
    const indicial = poly([A, "r(r - 1)"], [B, "r"], [C, ""]);
    const why: Pair =
      kind === "half"
        ? ["The exponents differ by a non-integer, so two series exist.", "指数之差不是整数，所以存在两个级数。"]
        : kind === "equal"
          ? ["The exponents are equal, so a logarithm always appears.", "指数相等，所以一定出现对数。"]
          : ["The exponents differ by a positive integer, so a logarithm may appear.", "指数之差是正整数，所以可能出现对数。"];
    return choose(
      rng,
      [
        `Near the regular singular point $x = 0$ of $${eq} = 0$, what form does the second solution take, with $r_{1}$ the larger exponent and $r_{2}$ the smaller?`,
        `在 $${eq} = 0$ 的正则奇点 $x = 0$ 附近，第二个解是什么形式？其中 $r_{1}$ 是较大的指数，$r_{2}$ 是较小的指数。`,
      ],
      correct,
      [two, log, maybe, product].filter((o) => o !== correct),
      [
        `The indicial equation is $${indicial} = 0$, with roots ${roots[0]}. ${why[0]}`,
        `指标方程是 $${indicial} = 0$，根是 ${roots[1]}。${why[1]}`,
      ],
    );
  },
);

const stepLimit = point(
  "the-step-limit-set-by-the-fastest-mode",
  ["The step limit set by the fastest mode", "最快模态决定的步长限制"],
  [
    "Euler's method multiplies a mode with eigenvalue $\\lambda$ by $1 + h\\lambda$ at each step, so a decaying mode decays numerically only when $h < \\frac{2}{|\\lambda|}$. In a system the fastest mode sets the limit, even if that mode is too small to notice in the solution.",
    "欧拉法每一步把特征值为 $\\lambda$ 的模态乘以 $1 + h\\lambda$，所以衰减模态只有当 $h < \\frac{2}{|\\lambda|}$ 时在数值上才衰减。在方程组中，最快的模态决定限制，即使它在解中小到难以察觉。",
  ],
  (rng) => {
    const l1 = rng.int(1, 12);
    const l2 = rng.pick([...Array(20).keys()].map((i) => i + 1).filter((v) => v !== l1));
    const b = nz(rng, 9);
    const fast = Math.max(l1, l2);
    const slow = Math.min(l1, l2);
    const answer = Q.of(2, fast);
    const A = mat(-l1, b, 0, -l2);
    return ask(
      [
        `Euler's method is applied to $\\mathbf{x}' = ${A}\\mathbf{x}$. Every mode decays numerically exactly when $0 < h < h_{0}$. Find $h_{0}$.`,
        `把欧拉法用于 $\\mathbf{x}' = ${A}\\mathbf{x}$。当且仅当 $0 < h < h_{0}$ 时，每个模态在数值上都衰减。求 $h_{0}$。`,
      ],
      answer,
      [Q.of(2, slow), Q.of(1, fast), Q.of(2, l1 + l2)],
      [
        `The matrix is triangular, so its eigenvalues are $${-l1}$ and $${-l2}$. The condition $|1 + h\\lambda| < 1$ gives $h < \\frac{2}{|\\lambda|}$, and the stricter limit comes from $|\\lambda| = ${fast}$, so $h_{0} = ${answer.toLatex()}$.`,
        `矩阵是三角矩阵，所以特征值是 $${-l1}$ 和 $${-l2}$。条件 $|1 + h\\lambda| < 1$ 给出 $h < \\frac{2}{|\\lambda|}$，更严格的限制来自 $|\\lambda| = ${fast}$，所以 $h_{0} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

/** stepSizes are step sizes that keep the amplification factors exact. */
const stepSizes = [Q.of(1, 10), Q.of(1, 5), Q.of(1, 4), Q.of(1, 2), Q.of(1)] as const;

const energyGrowth = point(
  "euler-adds-energy-to-an-oscillator",
  ["Euler adds energy to an oscillator", "欧拉法给振子增加能量"],
  [
    "The exact motion of $y'' + k^{2}y = 0$ keeps $(y')^{2} + k^{2}y^{2}$ constant. Each Euler step multiplies this quantity by $1 + h^{2}k^{2}$, whatever the state is. So the numerical oscillation always grows, and a smaller step only slows the growth.",
    "$y'' + k^{2}y = 0$ 的精确运动保持 $(y')^{2} + k^{2}y^{2}$ 不变。欧拉法每一步都把这个量乘以 $1 + h^{2}k^{2}$，与状态无关。所以数值振荡总是增长，较小的步长只是减慢增长。",
  ],
  (rng) => {
    const k = rng.int(1, 6);
    const h = rng.pick(stepSizes);
    const k2 = Q.of(k * k);
    const answer = Q.one.add(h.mul(h).mul(k2));
    const left = poly([1, "y''"], [k * k, "y"]);
    const energy = poly([1, "(y')^{2}"], [k * k, "y^{2}"]);
    return ask(
      [
        `Euler's method with $h = ${h.toLatex()}$ is applied to $${left} = 0$. By what factor does each step multiply $E = ${energy}$?`,
        `把步长 $h = ${h.toLatex()}$ 的欧拉法用于 $${left} = 0$。每一步把 $E = ${energy}$ 乘以多少？`,
      ],
      answer,
      [Q.one.add(h.mul(k2)), Q.one.add(h.mul(h).mul(Q.of(k))), Q.one.sub(h.mul(h).mul(k2))],
      [
        `A step gives $y_{1} = y + hv$ and $v_{1} = ${poly([1, "v"], [-k * k, "hy"])}$. Expanding $E$ for the new values, the cross terms cancel and $E$ gains $${poly([k * k, "h^{2}E"])}$. So the factor is $1 + ${h.mul(h).mul(k2).toLatex()} = ${answer.toLatex()}$.`,
        `一步给出 $y_{1} = y + hv$，$v_{1} = ${poly([1, "v"], [-k * k, "hy"])}$。对新值展开 $E$，交叉项抵消，$E$ 增加 $${poly([k * k, "h^{2}E"])}$。所以因子是 $1 + ${h.mul(h).mul(k2).toLatex()} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const errorEstimate = point(
  "the-error-estimate-from-predictor-and-corrector",
  ["The error estimate from predictor and corrector", "由预测值和校正值估计误差"],
  [
    "A predictor-corrector pair produces an error estimate at no extra cost. For ABM2, the local errors of the predictor and the corrector are $\\frac{5}{12}h^{3}y'''$ and $-\\frac{1}{12}h^{3}y'''$, so the corrector's error is about one sixth of the gap between the two values.",
    "预测-校正方法不需额外计算就能给出误差估计。对 ABM2，预测值和校正值的局部误差分别是 $\\frac{5}{12}h^{3}y'''$ 和 $-\\frac{1}{12}h^{3}y'''$，所以校正值的误差约为两个值之差的六分之一。",
  ],
  (rng) => {
    const m = rng.int(1, 40);
    const base = rng.int(100, 900);
    const sign = rng.pick([-1, 1]);
    const P = base;
    const C = base + sign * 6 * m;
    const show = (v: number) => (v / 100).toFixed(2);
    return ask(
      [
        `In one step of ABM2, the predictor gives $${show(P)}$ and the corrector gives $${show(C)}$. Estimate the size of the local error of the corrected value.`,
        `在 ABM2 的一步中，预测值是 $${show(P)}$，校正值是 $${show(C)}$。估计校正值局部误差的大小。`,
      ],
      Q.of(m, 100),
      [Q.of(6 * m, 100), Q.of(3 * m, 100), Q.of(5 * m, 100)],
      [
        `The gap is $${show(6 * m)}$. The errors have the coefficients $\\frac{5}{12}$ and $-\\frac{1}{12}$, which differ by $\\frac{1}{2}$, so the corrector's error is $\\frac{1}{6}$ of the gap, about $${show(m)}$.`,
        `差是 $${show(6 * m)}$。误差的系数是 $\\frac{5}{12}$ 和 $-\\frac{1}{12}$，相差 $\\frac{1}{2}$，所以校正值的误差是差的 $\\frac{1}{6}$，约为 $${show(m)}$。`,
      ],
    );
  },
);

const newtonLinear = point(
  "newton-needs-one-iteration-for-a-linear-equation",
  ["Newton needs one iteration for a linear equation", "线性方程只需一次牛顿迭代"],
  [
    "When $f$ is linear in $y$, the equation $g(y) = 0$ of implicit Euler is linear too, and Newton's method lands on the exact root in one iteration from any starting guess. So the guess does not appear in the result, and the step is $\\frac{y_{n} + hc}{1 + hk}$ for $y' = -ky + c$.",
    "当 $f$ 关于 $y$ 是线性时，隐式欧拉法的方程 $g(y) = 0$ 也是线性的，牛顿法从任何初始猜测出发，一次迭代就得到精确的根。所以结果中不出现猜测值，对 $y' = -ky + c$，这一步是 $\\frac{y_{n} + hc}{1 + hk}$。",
  ],
  (rng) => {
    const k = rng.int(1, 8);
    const h = rng.pick([Q.of(1), Q.of(1, 2), Q.of(1, 4)]);
    const yn = nz(rng, 20);
    const c = nz(rng, 20);
    const guess = rng.int(-9, 9);
    const top = Q.of(yn).add(h.mul(Q.of(c)));
    const bottom = Q.one.add(h.mul(Q.of(k)));
    const answer = top.div(bottom);
    const f = poly([-k, "y"], [c, ""]);
    return ask(
      [
        `A backward Euler step with $h = ${h.toLatex()}$ for $y' = ${f}$ from $y_{n} = ${yn}$ uses Newton's method with starting guess $y^{(0)} = ${guess}$. Find $y^{(1)}$.`,
        `对 $y' = ${f}$ 从 $y_{n} = ${yn}$ 出发做步长 $h = ${h.toLatex()}$ 的后向欧拉步，用牛顿法，初始猜测 $y^{(0)} = ${guess}$。求 $y^{(1)}$。`,
      ],
      answer,
      [Q.of(yn).add(h.mul(Q.of(-k * guess + c))), top, guess],
      [
        `$g(y) = ${poly([bottom, "y"])} - ${paren(top)}$ is linear, so one Newton iteration reaches its root from any guess. The root is $\\frac{${top.toLatex()}}{${bottom.toLatex()}} = ${answer.toLatex()}$.`,
        `$g(y) = ${poly([bottom, "y"])} - ${paren(top)}$ 是线性的，所以牛顿法从任何猜测出发，一次迭代就到达它的根。根是 $\\frac{${top.toLatex()}}{${bottom.toLatex()}} = ${answer.toLatex()}$。`,
      ],
    );
  },
);

const trapezoidalFactor = {
  ...point(
    "the-amplification-factor-of-the-trapezoidal-method",
    ["The amplification factor of the trapezoidal method", "梯形法的放大因子"],
    [
      "For $y' = -ky$, solving the trapezoidal equation gives $y_{n + 1} = \\frac{1 - hk/2}{1 + hk/2}y_{n}$. This factor has size below $1$ for every $h$, so the method is stable. But for large $hk$ it nears $-1$, so stiff components oscillate and hardly decay.",
      "对 $y' = -ky$，解梯形方程得 $y_{n + 1} = \\frac{1 - hk/2}{1 + hk/2}y_{n}$。对任何 $h$，这个因子的绝对值都小于 $1$，所以方法稳定。但 $hk$ 很大时它接近 $-1$，所以刚性分量会振荡，几乎不衰减。",
    ],
    (rng) => {
      const k = rng.int(1, 20);
      const h = rng.pick(stepSizes);
      const half = h.mul(Q.of(k)).div(Q.of(2));
      const answer = Q.one.sub(half).div(Q.one.add(half));
      const hk = h.mul(Q.of(k));
      return ask(
        [
          `The trapezoidal method with $h = ${h.toLatex()}$ is applied to $y' = ${poly([-k, "y"])}$. It gives $y_{n + 1} = Ry_{n}$. Find $R$.`,
          `把步长 $h = ${h.toLatex()}$ 的梯形法用于 $y' = ${poly([-k, "y"])}$，得 $y_{n + 1} = Ry_{n}$。求 $R$。`,
        ],
        answer,
        [Q.one.div(Q.one.add(hk)), Q.one.sub(hk), answer.neg()],
        [
          `The method reads $y_{n + 1} = y_{n} - ${half.toLatex()}(y_{n} + y_{n + 1})$, using $\\frac{hk}{2} = ${half.toLatex()}$. Collecting terms gives $R = \\frac{1 - ${half.toLatex()}}{1 + ${half.toLatex()}} = ${answer.toLatex()}$.`,
          `方法写作 $y_{n + 1} = y_{n} - ${half.toLatex()}(y_{n} + y_{n + 1})$，其中 $\\frac{hk}{2} = ${half.toLatex()}$。合并同类项得 $R = \\frac{1 - ${half.toLatex()}}{1 + ${half.toLatex()}} = ${answer.toLatex()}$。`,
        ],
      );
    },
  ),
  figure:
    differentialEquationsDrawings1["using-the-trapezoidal-method-with-newtons-method#the-amplification-factor-of-the-trapezoidal-method"],
};

/** deeperDifferentialEquationsThird2Points maps topics of Differential Equations, from repeated eigenvalues to numerical methods, to a third knowledge point. */
export const deeperDifferentialEquationsThird2Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "solving-homogeneous-systems-of-odes-with-repeated-eigenvalues": [pairedEigenvector],
  "solving-inhomogeneous-systems-of-odes": [exponentialForcingVector],
  "phase-planes-and-phase-portraits": [nullcline],
  "phase-portraits-for-linear-systems-with-zero-eigenvalues": [limitOnEquilibriumLine],
  "shifted-systems-of-odes": [shiftedInitial],
  "linear-approximations-near-equilibria": [classifyEquilibrium],
  "fundamental-matrices": [coefficientsFromFundamental],
  "solving-homogeneous-systems-of-odes-using-matrix-methods": [exponentialOfJordan],
  "solving-inhomogeneous-systems-of-odes-using-matrix-methods": [integralOfExponentialMatrix],
  "solving-systems-of-odes-using-variation-of-parameters": [vopNonDiagonal],
  "the-lotka-volterra-model-with-carrying-capacity": [criticalCapacity],
  "piecewise-continuity-and-piecewise-smoothness": [cornerJump],
  "introduction-to-laplace-transforms": [transformOfT],
  "solving-first-order-odes-using-laplace-transforms": [transformValue],
  "solving-first-order-odes-with-time-delayed-forcing-using-laplace-transforms": [afterSwitchOff],
  "solving-second-order-odes-with-time-delayed-forcing-using-laplace-transforms": [pulseAmplitude],
  "solving-homogeneous-systems-of-odes-using-laplace-transforms": [coupledTransform],
  "solving-inhomogeneous-systems-of-odes-using-laplace-transforms": [cascadeTransform],
  "introduction-to-boundary-value-problems": [bvpEigenvalues],
  "differentiating-and-integrating-fourier-series": [integrationConstant],
  "solving-odes-using-fourier-series": [constantMode],
  "solving-ivps-using-fourier-series": [cosineIvp],
  "solving-bvps-using-fourier-series": [reactionBvp],
  "regular-singular-points": [leadingLimits],
  "finding-recurrence-relations-for-the-coefficients-of-a-frobenius-solution": [nonzeroExponent],
  "finding-general-solutions-using-the-method-of-frobenius": [secondSolutionForm],
  "eulers-method-for-systems-of-odes": [stepLimit],
  "eulers-method-for-second-order-odes": [energyGrowth],
  "the-abm2-method": [errorEstimate],
  "using-the-implicit-euler-method-with-newtons-method": [newtonLinear],
  "using-the-trapezoidal-method-with-newtons-method": [trapezoidalFactor],
};
