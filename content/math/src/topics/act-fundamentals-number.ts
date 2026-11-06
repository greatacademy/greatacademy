import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { expressionProblem, numberProblem, pointProblem, steps, vectorLatex } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// ACT Math Fundamentals, number and quantity: net displacement from compass legs, parity deduced from an expression
// known to be even or odd, expressions mixing complex operations, and reasoning from complex products and nonreal zeros.

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

// ---------------------------------------------------------------------------
// Direction and displacement

/** Leg is one straight stretch of a trip along a compass direction. */
interface Leg {
  readonly dir: "east" | "west" | "north" | "south";
  readonly km: number;
}

const dirZh = { east: "东", west: "西", north: "北", south: "南" } as const;

/** legs splits a net change into two opposite legs of positive length. */
function legs(rng: Rng, net: number, plus: Leg["dir"], minus: Leg["dir"]): Leg[] {
  const back = rng.int(1, 6);
  const forward = back + net;
  return forward > 0
    ? [
        { dir: plus, km: forward },
        { dir: minus, km: back },
      ]
    : [
        { dir: plus, km: back },
        { dir: minus, km: back - net },
      ];
}

const triples: readonly [number, number][] = [
  [3, 4],
  [4, 3],
  [6, 8],
  [8, 6],
  [5, 12],
  [12, 5],
  [9, 12],
];

/** reasoningFromDirectionAndDisplacement combines legs of a trip, or displacement vectors, into one net displacement. */
export const reasoningFromDirectionAndDisplacement = topic(
  "reasoning-from-direction-and-displacement",
  t("Reasoning From Direction and Displacement", "由方向与位移进行推理"),
  t(
    "Combine legs of a trip in compass directions, or displacement vectors, into one net displacement, and find the straight-line distance or the displacement that returns to the start.",
    "把沿罗盘方向的各段行程或各个位移向量合成一个总位移，并求出直线距离或回到起点所需的位移。",
  ),
  ["two-dimensional-vectors-expressed-in-component-form"],
  ["HSN.VM.A.3"],
  [
    kp(
      "straight-line-distance-from-legs",
      t("Straight-line distance from legs of a trip", "由各段行程求直线距离"),
      t(
        "The straight-line distance from the start depends only on the net displacement, not on the path. Add the east legs and subtract the west legs to get the net east–west change, do the same with north and south, and then use the Pythagorean theorem. Walking $7$ km east, $5$ km north, $3$ km west and $2$ km south gives a net $4$ km east and $3$ km north, so the walker ends $\\sqrt{4^{2} + 3^{2}} = 5$ km from the start, although the path was $17$ km long.",
        "离起点的直线距离只取决于总位移，与路径无关。把向东的各段相加、减去向西的各段，得到东西方向的净变化；南北方向同样处理；再用勾股定理。向东走 $7$ 千米、向北 $5$ 千米、向西 $3$ 千米、再向南 $2$ 千米，净位移是向东 $4$ 千米、向北 $3$ 千米，所以终点离起点 $\\sqrt{4^{2} + 3^{2}} = 5$ 千米，尽管走过的路程是 $17$ 千米。",
      ),
      (rng) => {
        const [x, y] = rng.pick(triples);
        const dx = x * rng.sign();
        const dy = y * rng.sign();
        const trip = rng.shuffle([...legs(rng, dx, "east", "west"), ...legs(rng, dy, "north", "south")]);
        const path = trip.reduce((s, l) => s + l.km, 0);
        const en = trip.map((l) => `${l.km} km ${l.dir}`).join(", then ");
        const zh = trip.map((l) => `向${dirZh[l.dir]}走 ${l.km} 千米`).join("，再");
        const sum = (d: Leg["dir"]) => trip.filter((l) => l.dir === d).reduce((s, l) => s + l.km, 0);
        const [e, w, n, s] = [sum("east"), sum("west"), sum("north"), sum("south")];
        const distance = Math.sqrt(dx * dx + dy * dy);
        const across = dx > 0 ? t(`${dx} km east`, `向东 ${dx} 千米`) : t(`${-dx} km west`, `向西 ${-dx} 千米`);
        const up = dy > 0 ? t(`${dy} km north`, `向北 ${dy} 千米`) : t(`${-dy} km south`, `向南 ${-dy} 千米`);
        return numberProblem({
          prompt: t(
            `A hiker walks ${en}. How far is the hiker from the starting point, in a straight line, in kilometers?`,
            `一位徒步者先${zh}。徒步者离起点的直线距离是多少千米？`,
          ),
          answer: distance,
          unit: "km",
          wrong: [path, x + y, Math.abs(x - y)],
          solution: t(
            `East–west: $${e} - ${w} = ${dx}$, so the net change is ${across.en}. North–south: $${n} - ${s} = ${dy}$, so it is ${up.en}. The distance is${steps(`\\sqrt{${x}^{2} + ${y}^{2}} = \\sqrt{${x * x + y * y}} = ${distance}`)}`,
            `东西方向：$${e} - ${w} = ${dx}$，净变化为${across["zh-CN"]}。南北方向：$${n} - ${s} = ${dy}$，净变化为${up["zh-CN"]}。距离为${steps(`\\sqrt{${x}^{2} + ${y}^{2}} = \\sqrt{${x * x + y * y}} = ${distance}`)}`,
          ),
        });
      },
    ),
    kp(
      "combining-displacement-vectors",
      t("Combining displacement vectors", "合成位移向量"),
      t(
        "Displacements add componentwise: moving by $\\langle a, b \\rangle$ and then by $\\langle c, d \\rangle$ is one move by $\\langle a + c, b + d \\rangle$. Starting at $(x, y)$, the object ends at $(x + a + c, y + b + d)$. The displacement that brings it back to the start is the opposite of the total, $\\langle -(a + c), -(b + d) \\rangle$. For moves $\\langle 3, -2 \\rangle$ and $\\langle -5, 6 \\rangle$ the total is $\\langle -2, 4 \\rangle$, and the way back is $\\langle 2, -4 \\rangle$.",
        "位移按分量相加：先按 $\\langle a, b \\rangle$ 移动、再按 $\\langle c, d \\rangle$ 移动，相当于一次按 $\\langle a + c, b + d \\rangle$ 移动。从 $(x, y)$ 出发，物体最后到达 $(x + a + c, y + b + d)$。使它回到起点的位移是总位移的相反向量 $\\langle -(a + c), -(b + d) \\rangle$。对位移 $\\langle 3, -2 \\rangle$ 和 $\\langle -5, 6 \\rangle$，总位移是 $\\langle -2, 4 \\rangle$，返回的位移是 $\\langle 2, -4 \\rangle$。",
      ),
      (rng) => {
        const [x, y] = [rng.int(-6, 6), rng.int(-6, 6)];
        const [a, b, c, d] = [rng.nonZero(-8, 8), rng.nonZero(-8, 8), rng.nonZero(-8, 8), rng.nonZero(-8, 8)];
        const [sx, sy] = [a + c, b + d];
        const moves = `$${vectorLatex([a, b])}$`;
        const then = `$${vectorLatex([c, d])}$`;
        const start = `(${x}, ${y})`;
        if (rng.bool()) {
          return pointProblem({
            prompt: t(
              `A robot starts at $${start}$ and moves by the displacement ${moves} and then by ${then}. At what point does it stop?`,
              `一个机器人从 $${start}$ 出发，先按位移 ${moves} 移动，再按 ${then} 移动。它停在哪个点？`,
            ),
            answer: [x + sx, y + sy],
            wrong: [
              [sx, sy],
              [x - sx, y - sy],
              [x + a - c, y + b - d],
            ],
            solution: t(
              `The total displacement is $${vectorLatex([sx, sy])}$, so the robot stops at $(${x} + ${sx < 0 ? `(${sx})` : sx}, ${y} + ${sy < 0 ? `(${sy})` : sy}) = (${x + sx}, ${y + sy})$.`,
              `总位移是 $${vectorLatex([sx, sy])}$，所以机器人停在 $(${x} + ${sx < 0 ? `(${sx})` : sx}, ${y} + ${sy < 0 ? `(${sy})` : sy}) = (${x + sx}, ${y + sy})$。`,
            ),
          });
        }
        return pointProblem({
          prompt: t(
            `A robot moves by the displacement ${moves} and then by ${then}. What single displacement brings it straight back to where it started?`,
            `一个机器人先按位移 ${moves} 移动，再按 ${then} 移动。哪一个位移能使它直接回到出发点？`,
          ),
          answer: [-sx, -sy],
          vector: true,
          wrong: [
            [sx, sy],
            [-a + c, -b + d],
            [-sx, sy],
          ],
          solution: t(
            `The total displacement is $${vectorLatex([a, b])} + ${vectorLatex([c, d])} = ${vectorLatex([sx, sy])}$. The way back is its opposite, $${vectorLatex([-sx, -sy])}$.`,
            `总位移是 $${vectorLatex([a, b])} + ${vectorLatex([c, d])} = ${vectorLatex([sx, sy])}$。返回的位移是它的相反向量 $${vectorLatex([-sx, -sy])}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Parity

/** parityWord names a parity, 0 for even and 1 for odd. */
const parityWord = (p: number) => (p ? t("odd", "奇数") : t("even", "偶数"));

/** oneVariable are expressions in n with their parity for an n of parity p. */
const oneVariable: readonly [string, (p: number) => number][] = [
  ["n + 1", (p) => p ^ 1],
  ["n + 2", (p) => p],
  ["n^{2}", (p) => p],
  ["n^{2} + 1", (p) => p ^ 1],
  ["3n", (p) => p],
  ["3n + 1", (p) => p ^ 1],
  ["5n + 2", (p) => p],
  ["2n + 1", () => 1],
  ["n(n + 1)", () => 0],
  ["n^{2} + n + 1", () => 1],
];

/** twoVariables are expressions in m and n with their parity for an m of parity a and an n of parity b. */
const twoVariables: readonly [string, (a: number, b: number) => number][] = [
  ["m + n", (a, b) => a ^ b],
  ["mn", (a, b) => a & b],
  ["m^{2} + n", (a, b) => a ^ b],
  ["m + 2n", (a) => a],
  ["2m + n", (_, b) => b],
  ["mn + m", (a, b) => (a & b) ^ a],
  ["m^{2}n", (a, b) => a & b],
  ["m + n + 1", (a, b) => a ^ b ^ 1],
  ["3m + n^{2}", (a, b) => a ^ b],
  ["mn + 1", (a, b) => (a & b) ^ 1],
];

/** deducingParityFromAnIntegerValuedExpression deduces the parity of integers from expressions known to be even or odd. */
export const deducingParityFromAnIntegerValuedExpression = topic(
  "deducing-parity-from-an-integer-valued-expression",
  t("Deducing Parity From an Integer-Valued Expression", "由整数值表达式推断奇偶性"),
  t(
    "Work back from an expression known to be even or odd to the parity of the integer in it, and decide which other expressions must be even or odd.",
    "由已知为偶数或奇数的表达式倒推其中整数的奇偶性，并判断其他哪些表达式必为偶数或奇数。",
  ),
  ["parity"],
  ["HSA.SSE.A.1"],
  [
    kp(
      "working-back-to-the-parity-of-n",
      t("Working back to the parity of n", "倒推 n 的奇偶性"),
      t(
        "Undo the expression one step at a time, tracking only parity. If $3n + 5$ is even, then $3n$ is even minus odd, which is odd. A product with an odd factor $3$ has the parity of its other factor, so $n$ is odd. Once the parity of $n$ is known, every expression in $n$ has a known parity: here $n + 1$ is even and $n^{2}$ is odd. An expression such as $n(n + 1)$ is even for every integer $n$, since one of two consecutive integers is even.",
        "逐步还原表达式，只跟踪奇偶性。若 $3n + 5$ 是偶数，则 $3n$ 是偶数减奇数，为奇数。含奇因数 $3$ 的乘积与另一个因数的奇偶性相同，所以 $n$ 是奇数。知道 $n$ 的奇偶性后，每个关于 $n$ 的表达式的奇偶性都确定了：这里 $n + 1$ 是偶数，$n^{2}$ 是奇数。像 $n(n + 1)$ 这样的表达式对每个整数 $n$ 都是偶数，因为两个相邻整数中必有一个是偶数。",
      ),
      (rng) => {
        const a = rng.pick([1, 3, 5, 7]);
        const b = rng.int(1, 9);
        const s = rng.int(0, 1);
        const p = s ^ (b % 2);
        const q = rng.int(0, 1);
        const right = rng.pick(oneVariable.filter(([, f]) => f(p) === q));
        const wrong = rng.sample(
          oneVariable.filter(([, f]) => f(p) !== q),
          3,
        );
        const given = `${a === 1 ? "" : a}n + ${b}`;
        const term = `${a === 1 ? "" : a}n`;
        return pickChoice(
          rng,
          t(
            `$n$ is an integer, and $${given}$ is ${parityWord(s).en}. Which of the following must be ${parityWord(q).en}?`,
            `$n$ 是整数，且 $${given}$ 是${parityWord(s)["zh-CN"]}。下列哪一个必为${parityWord(q)["zh-CN"]}？`,
          ),
          mathText(right[0]),
          wrong.map(([e]) => mathText(e)),
          t(
            `$${term} = (${given}) - ${b}$ is ${parityWord(s).en} minus ${parityWord(b % 2).en}, so it is ${parityWord(p).en}${a === 1 ? "" : `, and since $${a}$ is odd, $n$ is ${parityWord(p).en} too`}. Then $${right[0]}$ is ${parityWord(q).en}, while ${wrong.map(([e]) => `$${e}$`).join(", ")} are ${parityWord(q ^ 1).en}.`,
            `$${term} = (${given}) - ${b}$ 是${parityWord(s)["zh-CN"]}减${parityWord(b % 2)["zh-CN"]}，为${parityWord(p)["zh-CN"]}${a === 1 ? "" : `；因为 $${a}$ 是奇数，$n$ 也是${parityWord(p)["zh-CN"]}`}。于是 $${right[0]}$ 是${parityWord(q)["zh-CN"]}，而 ${wrong.map(([e]) => `$${e}$`).join("、")} 都是${parityWord(q ^ 1)["zh-CN"]}。`,
          ),
        );
      },
    ),
    kp(
      "parity-of-expressions-in-two-integers",
      t("Parity of expressions in two integers", "含两个整数的表达式的奇偶性"),
      t(
        "With the parities of $m$ and $n$ known, find the parity of an expression from the rules for sums and products: a sum is odd exactly when it has an odd number of odd terms, and a product is odd exactly when every factor is odd. A term with an even coefficient, such as $2n$, is always even. If $m$ is odd and $n$ is even, then $mn$ is even, $m + n$ is odd and $mn + m$ is even plus odd, which is odd. When the parities are not stated, first work them out from what is given, as for a single integer.",
        "已知 $m$ 和 $n$ 的奇偶性时，用和与积的规则求表达式的奇偶性：和为奇数当且仅当其中奇数项的个数为奇数；积为奇数当且仅当每个因数都是奇数。系数为偶数的项，如 $2n$，总是偶数。若 $m$ 是奇数、$n$ 是偶数，则 $mn$ 是偶数，$m + n$ 是奇数，$mn + m$ 是偶数加奇数，为奇数。如果没有直接给出奇偶性，先像对单个整数那样由已知条件推出。",
      ),
      (rng) => {
        const [a, b] = [rng.int(0, 1), rng.int(0, 1)];
        const clue = (v: string, parity: number) => {
          const k = rng.pick([1, 3, 5]);
          const c = rng.int(1, 9);
          return { tex: `${k === 1 ? "" : k}${v} + ${c}`, parity: parity ^ (c % 2), c };
        };
        const [cm, cn] = [clue("m", a), clue("n", b)];
        const counts = [0, 1].map((q) => twoVariables.filter(([, f]) => f(a, b) === q).length);
        const q = rng.pick([0, 1].filter((v) => counts[v]! >= 1 && counts[v ^ 1]! >= 3));
        const right = rng.pick(twoVariables.filter(([, f]) => f(a, b) === q));
        const wrong = rng.sample(
          twoVariables.filter(([, f]) => f(a, b) !== q),
          3,
        );
        return pickChoice(
          rng,
          t(
            `$m$ and $n$ are integers, $${cm.tex}$ is ${parityWord(cm.parity).en} and $${cn.tex}$ is ${parityWord(cn.parity).en}. Which of the following must be ${parityWord(q).en}?`,
            `$m$ 和 $n$ 是整数，$${cm.tex}$ 是${parityWord(cm.parity)["zh-CN"]}，$${cn.tex}$ 是${parityWord(cn.parity)["zh-CN"]}。下列哪一个必为${parityWord(q)["zh-CN"]}？`,
          ),
          mathText(right[0]),
          wrong.map(([e]) => mathText(e)),
          t(
            `Subtracting ${cm.c} from $${cm.tex}$ and ${cn.c} from $${cn.tex}$, and dividing out the odd coefficients, shows that $m$ is ${parityWord(a).en} and $n$ is ${parityWord(b).en}. Apply the rules for sums and products to each expression: $${right[0]}$ is ${parityWord(q).en}, while ${wrong.map(([e]) => `$${e}$`).join(", ")} are ${parityWord(q ^ 1).en}.`,
            `从 $${cm.tex}$ 中减去 ${cm.c}、从 $${cn.tex}$ 中减去 ${cn.c}，再去掉奇数系数，可知 $m$ 是${parityWord(a)["zh-CN"]}，$n$ 是${parityWord(b)["zh-CN"]}。对每个表达式运用和与积的规则：$${right[0]}$ 是${parityWord(q)["zh-CN"]}，而 ${wrong.map(([e]) => `$${e}$`).join("、")} 都是${parityWord(q ^ 1)["zh-CN"]}。`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Complex numbers

/** cx writes a + bi. */
const cx = (a: number, b: number) => poly([a, ""], [b, "i"]);

/** cxPar writes (a + bi). */
const cxPar = (a: number, b: number) => `(${cx(a, b)})`;

/** powersOfI are i^0, i^1, i^2 and i^3 as [real, imaginary]. */
const powersOfI: readonly (readonly [number, number])[] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

/** iPower is i^n as [real, imaginary]. */
const iPower = (n: number) => powersOfI[n % 4]!;

/** evaluatingMixedComplexExpressions evaluates expressions that combine several operations on complex numbers. */
export const evaluatingMixedComplexExpressions = topic(
  "evaluating-mixed-complex-expressions",
  t("Evaluating Mixed Complex Expressions", "计算混合运算的复数表达式"),
  t(
    "Evaluate expressions that combine products, squares, sums and powers of $i$, following the order of operations and writing the result as $a + bi$.",
    "按运算顺序计算含乘积、平方、和与 $i$ 的乘方的复数表达式，并把结果写成 $a + bi$ 的形式。",
  ),
  ["multiplying-complex-numbers"],
  ["HSN.CN.A.2"],
  [
    kp(
      "a-product-and-a-sum",
      t("A product and a sum", "乘积与和"),
      t(
        "Follow the order of operations: multiply first, using $i^{2} = -1$, and then add or subtract by combining real parts and imaginary parts separately. For $(2 + i)(3 - 4i) - (1 - 6i)$, the product is $6 - 8i + 3i - 4i^{2} = 10 - 5i$, and then $10 - 5i - 1 + 6i = 9 + i$. Subtracting a complex number changes the sign of both of its parts.",
        "按运算顺序：先相乘，并利用 $i^{2} = -1$；再把实部与虚部分别合并来进行加减。对 $(2 + i)(3 - 4i) - (1 - 6i)$，乘积是 $6 - 8i + 3i - 4i^{2} = 10 - 5i$，于是 $10 - 5i - 1 + 6i = 9 + i$。减去一个复数时，它的两个部分都要变号。",
      ),
      (rng) => {
        const [a, b, c, d] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5), rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
        const [e, f] = [rng.nonZero(-9, 9), rng.nonZero(-9, 9)];
        const sign = rng.sign();
        const [pr, pi] = [a * c - b * d, a * d + b * c];
        const answer = cx(pr + sign * e, pi + sign * f);
        const expr = `${cxPar(a, b)}${cxPar(c, d)} ${sign > 0 ? "+" : "-"} ${cxPar(e, f)}`;
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Write the answer in the form $a + bi$.`, `化简 $${expr}$，结果写成 $a + bi$ 的形式。`),
          answer,
          simplified: true,
          wrong: [cx(a * c + b * d + sign * e, pi + sign * f), cx(pr + sign * e, pi - sign * f), cx(pr + e, pi + f)],
          solution: t(
            `Multiply first:${steps(`${cxPar(a, b)}${cxPar(c, d)} = ${poly([a * c, ""], [a * d + b * c, "i"], [b * d, "i^{2}"])} = ${cx(pr, pi)}`)}Then ${sign > 0 ? "add" : "subtract"} $${cx(e, f)}$:${steps(`${cx(pr, pi)} ${sign > 0 ? "+" : "-"} ${cxPar(e, f)} = ${answer}`)}`,
            `先相乘：${steps(`${cxPar(a, b)}${cxPar(c, d)} = ${poly([a * c, ""], [a * d + b * c, "i"], [b * d, "i^{2}"])} = ${cx(pr, pi)}`)}再${sign > 0 ? "加上" : "减去"} $${cx(e, f)}$：${steps(`${cx(pr, pi)} ${sign > 0 ? "+" : "-"} ${cxPar(e, f)} = ${answer}`)}`,
          ),
        });
      },
    ),
    kp(
      "squares-and-powers-of-i",
      t("Squares and powers of i", "平方与 i 的乘方"),
      t(
        "Square a complex number as a binomial: $(a + bi)^{2} = a^{2} + 2abi + b^{2}i^{2} = (a^{2} - b^{2}) + 2abi$. Reduce a power of $i$ with the cycle $i, -1, -i, 1$, which repeats every four powers: divide the exponent by $4$ and keep the remainder, so $i^{27} = i^{3} = -i$ since $27 = 4 \\cdot 6 + 3$. Then combine the parts. For example, $(3 - i)^{2} + i^{27} = 9 - 6i - 1 - i = 8 - 7i$.",
        "像二项式那样求复数的平方：$(a + bi)^{2} = a^{2} + 2abi + b^{2}i^{2} = (a^{2} - b^{2}) + 2abi$。用每四次重复一次的循环 $i, -1, -i, 1$ 化简 $i$ 的乘方：把指数除以 $4$ 取余数，因为 $27 = 4 \\cdot 6 + 3$，所以 $i^{27} = i^{3} = -i$。最后合并各部分。例如 $(3 - i)^{2} + i^{27} = 9 - 6i - 1 - i = 8 - 7i$。",
      ),
      (rng) => {
        const [a, b] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        const n = rng.int(5, 60);
        const k = rng.nonZero(-4, 4);
        const [ur, ui] = iPower(n);
        const [sr, si] = [a * a - b * b, 2 * a * b];
        const answer = cx(sr + k * ur, si + k * ui);
        const coeff = k === 1 ? "" : k === -1 ? "-" : String(k);
        const expr = `${cxPar(a, b)}^{2} ${k > 0 ? "+" : "-"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}i^{${n}}`;
        const [wr, wi] = iPower(n + 2);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$. Write the answer in the form $a + bi$.`, `化简 $${expr}$，结果写成 $a + bi$ 的形式。`),
          answer,
          simplified: true,
          wrong: [cx(a * a + b * b + k * ur, si + k * ui), cx(sr + k * wr, si + k * wi), cx(a * a + k * ur, b * b + k * ui)],
          solution: t(
            `Square the binomial: $${cxPar(a, b)}^{2} = ${poly([a * a, ""], [si, "i"], [b * b, "i^{2}"])} = ${cx(sr, si)}$. Since $${n} = 4 \\cdot ${Math.floor(n / 4)} + ${n % 4}$, $i^{${n}} = ${cx(ur, ui)}$, so $${coeff}i^{${n}} = ${cx(k * ur, k * ui)}$. Altogether:${steps(`${cx(sr, si)} + ${cxPar(k * ur, k * ui)} = ${answer}`)}`,
            `把二项式平方：$${cxPar(a, b)}^{2} = ${poly([a * a, ""], [si, "i"], [b * b, "i^{2}"])} = ${cx(sr, si)}$。因为 $${n} = 4 \\cdot ${Math.floor(n / 4)} + ${n % 4}$，$i^{${n}} = ${cx(ur, ui)}$，所以 $${coeff}i^{${n}} = ${cx(k * ur, k * ui)}$。合起来：${steps(`${cx(sr, si)} + ${cxPar(k * ur, k * ui)} = ${answer}`)}`,
          ),
        });
      },
    ),
  ],
);

/** reasoningFromComplexProductsAndNonrealZeros finds unknowns that make a complex product real and quadratics with a given nonreal zero. */
export const reasoningFromComplexProductsAndNonrealZeros = topic(
  "reasoning-from-complex-products-and-nonreal-zeros",
  t("Reasoning From Complex Products and Nonreal Zeros", "由复数乘积与非实数零点进行推理"),
  t(
    "Find the value that makes a product of complex numbers real, and find the coefficients of a real quadratic from one nonreal zero and its conjugate.",
    "求使复数乘积为实数的值，并由一个非实数零点及其共轭复数求实系数二次式的系数。",
  ),
  ["multiplying-complex-numbers", "the-complex-conjugate-and-the-roots-of-a-quadratic-equation"],
  ["HSN.CN.C.7"],
  [
    kp(
      "making-a-product-real",
      t("Making a product real", "使乘积为实数"),
      t(
        "A complex number is real exactly when its imaginary part is $0$. Expand the product, collect the imaginary part and set it equal to $0$. For $(k + 2i)(3 - i) = 3k - ki + 6i - 2i^{2} = (3k + 2) + (6 - k)i$, the product is real when $6 - k = 0$, that is, $k = 6$.",
        "复数是实数当且仅当它的虚部为 $0$。展开乘积，合并出虚部，令它等于 $0$。对 $(k + 2i)(3 - i) = 3k - ki + 6i - 2i^{2} = (3k + 2) + (6 - k)i$，当 $6 - k = 0$ 即 $k = 6$ 时乘积是实数。",
      ),
      (rng) => {
        const k = rng.nonZero(-6, 6);
        const d = rng.int(1, 5);
        const divisors = Array.from({ length: Math.abs(k * d) }, (_, i) => i + 1).filter((c) => (k * d) % c === 0 && c <= 9);
        const c = rng.pick(divisors.length > 1 ? divisors.slice(1) : divisors);
        const b = (k * d) / c;
        const product = `(k ${b > 0 ? "+" : "-"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}i)(${c} - ${d === 1 ? "" : d}i)`;
        return numberProblem({
          prompt: t(`For what real number $k$ is $${product}$ a real number?`, `实数 $k$ 取何值时，$${product}$ 是实数？`),
          answer: k,
          wrong: [-k, Q.of(c * d, b), Q.of(-b * d, c), b * c],
          solution: t(
            `Expand: $${product} = ${poly([c, "k"], [-d, "ki"], [b * c, "i"], [-b * d, "i^{2}"])} = (${poly([c, "k"], [b * d, ""])}) + (${poly([b * c, ""], [-d, "k"])})i$. The product is real when the imaginary part is $0$:${steps(`${poly([b * c, ""], [-d, "k"])} = 0`, `k = ${k}`)}`,
            `展开：$${product} = ${poly([c, "k"], [-d, "ki"], [b * c, "i"], [-b * d, "i^{2}"])} = (${poly([c, "k"], [b * d, ""])}) + (${poly([b * c, ""], [-d, "k"])})i$。虚部为 $0$ 时乘积是实数：${steps(`${poly([b * c, ""], [-d, "k"])} = 0`, `k = ${k}`)}`,
          ),
        });
      },
    ),
    kp(
      "a-quadratic-from-a-nonreal-zero",
      t("A quadratic from a nonreal zero", "由非实数零点求二次式"),
      t(
        "If a quadratic with real coefficients has a nonreal zero $p + qi$, its other zero is the conjugate $p - qi$. The quadratic $x^{2} + bx + c$ with these zeros has $-b$ equal to their sum, $2p$, and $c$ equal to their product, $(p + qi)(p - qi) = p^{2} + q^{2}$. For the zero $2 + 3i$: the sum is $4$ and the product is $4 + 9 = 13$, so the quadratic is $x^{2} - 4x + 13$.",
        "若实系数二次式有非实数零点 $p + qi$，则它的另一个零点是共轭复数 $p - qi$。以它们为零点的二次式 $x^{2} + bx + c$ 中，$-b$ 等于两零点之和 $2p$，$c$ 等于两零点之积 $(p + qi)(p - qi) = p^{2} + q^{2}$。对零点 $2 + 3i$：和为 $4$，积为 $4 + 9 = 13$，所以二次式是 $x^{2} - 4x + 13$。",
      ),
      (rng) => {
        const p = rng.nonZero(-6, 6);
        const q = rng.int(1, 7);
        const askB = rng.bool();
        const zero = cx(p, q);
        const answer = askB ? -2 * p : p * p + q * q;
        return numberProblem({
          prompt: t(
            `The quadratic $x^{2} + bx + c$, where $b$ and $c$ are real numbers, has $${zero}$ as one of its zeros. What is the value of $${askB ? "b" : "c"}$?`,
            `二次式 $x^{2} + bx + c$（$b$、$c$ 为实数）的一个零点是 $${zero}$。$${askB ? "b" : "c"}$ 的值是多少？`,
          ),
          answer,
          wrong: askB ? [2 * p, -p, p * p + q * q] : [p * p - q * q, -2 * p, p * p + q],
          solution: t(
            `The other zero is the conjugate $${cx(p, -q)}$. The sum of the zeros is $${2 * p}$ and their product is $${p < 0 ? `(${p})` : p}^{2} + ${q}^{2} = ${p * p + q * q}$, so the quadratic is $${poly([1, "x^{2}"], [-2 * p, "x"], [p * p + q * q, ""])}$ and $${askB ? "b" : "c"} = ${answer}$.`,
            `另一个零点是共轭复数 $${cx(p, -q)}$。两零点之和为 $${2 * p}$，之积为 $${p < 0 ? `(${p})` : p}^{2} + ${q}^{2} = ${p * p + q * q}$，所以二次式是 $${poly([1, "x^{2}"], [-2 * p, "x"], [p * p + q * q, ""])}$，$${askB ? "b" : "c"} = ${answer}$。`,
          ),
        });
      },
    ),
  ],
);

/** actFundamentalsNumberTopics are the topics of this file. */
export const actFundamentalsNumberTopics: TopicDef[] = [
  reasoningFromDirectionAndDisplacement,
  deducingParityFromAnIntegerValuedExpression,
  evaluatingMixedComplexExpressions,
  reasoningFromComplexProductsAndNonrealZeros,
];
