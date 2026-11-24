import type { KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, num, paren, poly, Q } from "@ga/subject-math";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { graphFigure } from "../graph-figures.ts";
import { pointLatex } from "../problems.ts";
import type { Pair, Wrong } from "./early-grades-more-kit.ts";
import { chosen, chosenMath, drawn, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { tableFigure } from "./grade-8-kit.ts";
import { equalTape, tapeFigure } from "./upper-grades-kit.ts";

// 8th Grade Math, linear equations: equations with infinitely many solutions or none, horizontal and vertical lines,
// and slope as the unit rate of a proportional relationship.

/** ccss is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

/** times writes k(ax + b), the product of a number and a linear expression. */
const times = (k: number, a: number, b: number) => `${k === -1 ? "-" : num(k)}(${linear(a, b)})`;

/** plus appends a term with its sign: plus("2(x + 1)", -3, "x") is "2(x + 1) - 3x". */
const plus = (left: string, c: number, v = "") => `${left} ${c < 0 ? "-" : "+"} ${poly([Math.abs(c), v])}`;

/** Count is how many solutions a linear equation has: 0 for exactly one, 1 for infinitely many, 2 for none. */
type Count = 0 | 1 | 2;

/** countOptions are the answers to "how many solutions", indexed by Count. */
const countOptions: readonly Text[] = [t("Exactly one", "恰有一个"), t("Infinitely many", "无穷多个"), t("None", "无解")];

/** cancelling says how to remove the term ax from both sides, as the start of a sentence. */
const cancelling = (a: number): Text =>
  a > 0
    ? t(`Subtracting $${poly([a, "x"])}$ from both sides`, `两边同时减去 $${poly([a, "x"])}$`)
    : t(`Adding $${poly([-a, "x"])}$ to both sides`, `两边同时加上 $${poly([-a, "x"])}$`);

/** verdictOf says what ax + b = cx + d means for the number of solutions. */
function verdictOf(a: number, b: number, c: number, d: number): Text {
  if (a !== c)
    return t(
      `The coefficients of $x$, $${a}$ and $${c}$, differ, so there is exactly one solution.`,
      `$x$ 的系数 $${a}$ 和 $${c}$ 不同，所以恰有一个解。`,
    );
  return b === d
    ? t("The two sides are the same expression, so every number is a solution.", "两边是同一个式子，所以任何数都是解。")
    : t(
        `${cancelling(a).en} leaves $${b} = ${d}$, which is false, so there is no solution.`,
        `${cancelling(a)["zh-CN"]}，得到 $${b} = ${d}$，这不成立，所以无解。`,
      );
}

/** countOf classifies ax + b = cx + d. */
const countOf = (a: number, b: number, c: number, d: number): Count => (a !== c ? 0 : b === d ? 1 : 2);

/** expandedEquation draws a(x + p) + qx = r(x + s) + u with both sides to expand, with the given number of solutions,
 * and returns the equation with both sides simplified. */
function expandedEquation(rng: Rng, kind: Count) {
  const a = rng.sign() * rng.int(2, 6);
  const p = rng.nonZero(-6, 6);
  const q = rng.nonZero(-5, 5);
  const left = a + q;
  if (left === 0) return expandedEquation(rng, kind);
  const r = rng.sign() * rng.int(2, 6);
  // The right side has x-coefficient r + w; for one solution it differs from the left.
  const w = kind === 0 ? left - r + rng.sign() * rng.int(1, 3) : left - r;
  if (w === 0 || r + w === 0) return expandedEquation(rng, kind);
  const s = rng.nonZero(-6, 6);
  if (r === a && s === p) return expandedEquation(rng, kind);
  // The constants a·p and r·s + u agree only for infinitely many solutions.
  const u = kind === 1 ? a * p - r * s : a * p - r * s + rng.sign() * rng.int(1, 6);
  const lhs = plus(times(a, 1, p), q, "x");
  const rhs = u === 0 ? plus(times(r, 1, s), w, "x") : plus(plus(times(r, 1, s), w, "x"), u);
  return { equation: `${lhs} = ${rhs}`, a: left, b: a * p, c: r + w, d: r * s + u };
}

// ---------------------------------------------------------------------------
// Infinitely many solutions and no solutions

/** sidesAt checks the number of solutions of ax + b = cx + d another way, by comparing the two sides at x = 0 and x = 1. */
function sidesAt(a: number, b: number, c: number, d: number): Pair {
  const [l1, r1] = [a + b, c + d];
  if (a !== c)
    return [
      `Compare the two sides at $x = 0$ and $x = 1$. The left side goes from $${b}$ to $${l1}$, and the right side from $${d}$ to $${r1}$. The gap between them changes from $${b - d}$ to $${l1 - r1}$, so it closes for exactly one value of $x$.`,
      `比较 $x = 0$ 和 $x = 1$ 时的两边。左边从 $${b}$ 变到 $${l1}$，右边从 $${d}$ 变到 $${r1}$。两边的差从 $${b - d}$ 变成 $${l1 - r1}$，所以恰好有一个 $x$ 使差为零。`,
    ];
  return b === d
    ? [
        `Compare the two sides at $x = 0$ and $x = 1$. Both sides give $${b}$, then both give $${l1}$. Two straight-line expressions that agree at two values agree everywhere, so every number works.`,
        `比较 $x = 0$ 和 $x = 1$ 时的两边。两边都得 $${b}$，然后都得 $${l1}$。两个一次式在两个值处相等，就处处相等，所以任何数都是解。`,
      ]
    : [
        `Compare the two sides at $x = 0$ and $x = 1$. The left side gives $${b}$, then $${l1}$, and the right side $${d}$, then $${r1}$. The gap stays $${b - d}$, so it never closes.`,
        `比较 $x = 0$ 和 $x = 1$ 时的两边。左边得 $${b}$，然后得 $${l1}$；右边得 $${d}$，然后得 $${r1}$。两边的差始终是 $${b - d}$，永远不会为零。`,
      ];
}

/** countWhy gives the reason each wrong count is wrong for ax + b = cx + d, as wrong options of a choice. */
function countWhy(a: number, b: number, c: number, d: number): Wrong[] {
  const right = countOf(a, b, c, d);
  const why: [string, string][] =
    right === 0
      ? [
          ["", ""],
          ["The $x$-terms differ, so the two sides are not the same expression.", "含 $x$ 的项不同，所以两边不是同一个式子。"],
          [
            "The $x$-terms differ, so they do not cancel, and one value of $x$ balances the sides.",
            "含 $x$ 的项不同，不会抵消，有一个 $x$ 能使两边相等。",
          ],
        ]
      : right === 1
        ? [
            ["The $x$-terms cancel, so no single value is singled out.", "含 $x$ 的项抵消了，不会只有一个值。"],
            ["", ""],
            [`The constants match too, so what is left, $${b} = ${d}$, is true.`, `常数项也相同，剩下的 $${b} = ${d}$ 成立。`],
          ]
        : [
            ["The $x$-terms cancel, so no single value is singled out.", "含 $x$ 的项抵消了，不会只有一个值。"],
            [`The constants differ, so what is left, $${b} = ${d}$, is false.`, `常数项不同，剩下的 $${b} = ${d}$ 不成立。`],
            ["", ""],
          ];
  return [0, 1, 2]
    .filter((i) => i !== right)
    .map((i) => [[countOptions[i]!.en, countOptions[i]!["zh-CN"]], why[i]![0], why[i]![1]] as const);
}

/** linearEquationsWithInfinitelyManySolutions finds the numbers that make a linear equation an identity. */
export const linearEquationsWithInfinitelyManySolutions = withIntro(
  topic(
    "linear-equations-with-infinitely-many-solutions",
    t("Linear Equations With Infinitely Many Solutions", "有无穷多个解的一元一次方程"),
    t(
      "A linear equation has infinitely many solutions when its two sides simplify to the same expression: the x-terms match and so do the constants. Then every number is a solution.",
      "当一元一次方程的两边化简后是同一个式子时，即含 x 的项相同、常数项也相同，方程有无穷多个解：任何数都是它的解。",
    ),
    ["equations-with-parentheses"],
    ["8.EE.C.7.A"],
    [
      lesson(
        "choosing-the-constant",
        ["Choosing the constant", "确定常数项"],
        [
          [
            "For which $k$ does $3(x - 4) + 2x = 5x + k$ have infinitely many solutions? Expand the left side: $3x - 12 + 2x = 5x - 12$. The $x$-terms already match, so the sides are the same exactly when $k = -12$.",
            "$k$ 取何值时，$3(x - 4) + 2x = 5x + k$ 有无穷多个解？展开左边：$3x - 12 + 2x = 5x - 12$。含 $x$ 的项已经相同，所以当且仅当 $k = -12$ 时两边相同。",
          ],
          [
            "Try two values of $x$ with $k = -12$. At $x = 0$ both sides give $-12$, and at $x = 4$ both give $8$.",
            "取 $k = -12$，试两个 $x$ 的值。$x = 0$ 时两边都得 $-12$，$x = 4$ 时两边都得 $8$。",
          ],
          [
            "Multiply every term in the parentheses: forgetting to multiply the $-4$ by $3$ gives the wrong $k = -4$.",
            "括号里的每一项都要乘：忘记把 $-4$ 乘以 $3$ 会得到错误的 $k = -4$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const a = rng.sign() * rng.int(2, 7);
            const p = rng.nonZero(-9, 9);
            const c = rng.nonZero(-6, 6);
            if (a + c === 0) continue;
            const k = a * p;
            const left = plus(times(a, 1, p), c, "x");
            const eq = `${left} = ${linear(a + c, 0)} + k`;
            const at1 = a * (1 + p) + c;
            return valued(
              [`For what value of $k$ does $${eq}$ have infinitely many solutions?`, `$k$ 取何值时，方程 $${eq}$ 有无穷多个解？`],
              k,
              [
                [
                  ["Simplify the left side", "化简左边"],
                  ["Multiply out the parentheses and collect the $x$-terms:", "去括号，再合并含 $x$ 的项："],
                  [`${left} = ${plus(linear(a, k), c, "x")} = ${linear(a + c, k)}`],
                ],
                [
                  ["Match the constants", "使常数项相同"],
                  [
                    `The $x$-terms already match, so the sides are the same expression exactly when $k = ${k}$.`,
                    `含 $x$ 的项已经相同，所以当且仅当 $k = ${k}$ 时两边是同一个式子。`,
                  ],
                ],
              ],
              [
                `Try two values of $x$ in the original equation with $k = ${k}$. At $x = 0$ both sides give $${k}$. At $x = 1$ the left side gives $${at1}$, and the right side $${a + c} + ${paren(k)} = ${at1}$ as well.`,
                `取 $k = ${k}$，把两个 $x$ 的值代入原方程。$x = 0$ 时两边都得 $${k}$。$x = 1$ 时左边得 $${at1}$，右边 $${a + c} + ${paren(k)} = ${at1}$，也相同。`,
              ],
              [
                [p, `That forgets to multiply $${p}$ by $${a}$.`, `这是忘了把 $${p}$ 乘以 $${a}$。`],
                [a + p, "That adds the numbers instead of multiplying them.", "这是把两个数相加了，而不是相乘。"],
                [-k, "That has the wrong sign; the constants must be equal, not opposite.", "符号错了；常数项必须相等，而不是相反。"],
              ],
            );
          }
        },
        tapeFigure(
          [
            {
              total: "3(x − 4) + 2x",
              pieces: [
                { size: 5, text: "5x" },
                { size: 2, text: "−12" },
              ],
            },
            {
              total: "5x + k",
              pieces: [
                { size: 5, text: "5x" },
                { size: 2, text: "k = −12", lit: true },
              ],
            },
          ],
          [
            "Two bars: the left side simplifies to 5x − 12, and the right side is 5x + k, so they are the same bar when k = −12.",
            "两个长条：左边化简为 5x − 12，右边是 5x + k，所以当 k = −12 时两个长条完全相同。",
          ],
        ),
      ),
      lesson(
        "choosing-the-multiplier",
        ["Choosing the multiplier", "确定括号外的系数"],
        [
          [
            "For which $k$ does $k(2x - 3) = 8x - 12$ have infinitely many solutions? Expanding gives $2kx - 3k$. Matching the $x$-terms, $2k = 8$, so $k = 4$. Both parts must match: if the constant were $-10$, no value of $k$ would work.",
            "$k$ 取何值时，$k(2x - 3) = 8x - 12$ 有无穷多个解？展开得 $2kx - 3k$。比较含 $x$ 的项，$2k = 8$，所以 $k = 4$。两部分都必须相同：如果常数项是 $-10$，$k$ 取任何值都不行。",
          ],
          ["Match the constants instead: $-3k = -12$ also gives $k = 4$.", "改为比较常数项：$-3k = -12$，同样得 $k = 4$。"],
          ["The answer is $k$, not the coefficient $8$ of $x$ on the right.", "答案是 $k$，不是右边 $x$ 的系数 $8$。"],
        ],
        (rng) => {
          const k = rng.sign() * rng.int(2, 6);
          const b = rng.int(2, 5);
          const p = rng.nonZero(-7, 7);
          const eq = `k(${linear(b, p)}) = ${linear(k * b, k * p)}`;
          return valued(
            [`For what value of $k$ does $${eq}$ have infinitely many solutions?`, `$k$ 取何值时，方程 $${eq}$ 有无穷多个解？`],
            k,
            [
              [
                ["Expand the left side", "展开左边"],
                ["Multiply each term in the parentheses by $k$:", "括号里的每一项都乘以 $k$："],
                [`k(${linear(b, p)}) = ${poly([b, "kx"])} ${p < 0 ? "-" : "+"} ${poly([Math.abs(p), "k"])}`],
              ],
              [
                ["Match the x-terms", "使含 x 的项相同"],
                [`The coefficients of $x$ must be equal:`, "两边 $x$ 的系数必须相等："],
                [`${b}k = ${k * b}`, `k = ${k}`],
              ],
            ],
            [
              `Match the constants instead: $${p} \\cdot k = ${k * p}$ gives $k = ${k * p} \\div ${paren(p)} = ${k}$ as well, so both parts agree.`,
              `改为比较常数项：$${p} \\cdot k = ${k * p}$，得 $k = ${k * p} \\div ${paren(p)} = ${k}$，两部分一致。`,
            ],
            [
              [k * b, "That is the coefficient of $x$ on the right, not $k$.", "这是右边 $x$ 的系数，不是 $k$。"],
              [k * b - b, "That subtracts instead of dividing.", "这是相减了，而不是相除。"],
              [k * p, "That is the constant on the right, not $k$.", "这是右边的常数项，不是 $k$。"],
            ],
          );
        },
        tapeFigure(
          [
            {
              total: "k(2x − 3)",
              pieces: [
                { size: 2, text: "2x − 3", lit: true },
                { size: 2, text: "2x − 3", lit: true },
                { size: 2, text: "2x − 3", lit: true },
                { size: 2, text: "2x − 3", lit: true },
              ],
            },
            { total: "8x − 12", pieces: [{ size: 8, text: "8x − 12" }] },
          ],
          ["Four copies of 2x − 3 make 8x − 12, so k = 4.", "四个 2x − 3 合起来是 8x − 12，所以 k = 4。"],
        ),
      ),
    ],
  ),
  [
    "Two phone plans cost $3(x - 4) + 2x$ and $5x + k$ dollars for $x$ gigabytes. For which $k$ do they cost the same, whatever $x$ is?",
    "两种手机套餐用 $x$ GB 流量分别花 $3(x - 4) + 2x$ 美元和 $5x + k$ 美元。$k$ 是多少时，无论 $x$ 是多少，两种套餐都花一样多？",
  ],
  ["The first is $5x - 12$, so $k = -12$.", "第一种是 $5x - 12$，所以 $k = -12$。"],
  ["find the number that makes the two sides of a linear equation the same expression.", "求使一元一次方程两边成为同一个式子的数。"],
);

/** twoSides draws the two sides of an equation as bars, with the same x-term and different constants. */
const twoSides = (m: number, left: number, right: number, alt: Pair) =>
  tapeFigure(
    [
      {
        total: `${m}x + ${left}`,
        pieces: [
          { size: m, text: `${m}x` },
          { size: left, text: `${left}` },
        ],
      },
      {
        total: `${m}x + ${right}`,
        pieces: [
          { size: m, text: `${m}x` },
          { size: right, text: `${right}`, lit: true },
        ],
      },
    ],
    alt,
  );

/** linearEquationsWithNoSolutions recognizes equations whose x-terms cancel and leave a false statement. */
export const linearEquationsWithNoSolutions = withIntro(
  topic(
    "linear-equations-with-no-solutions",
    t("Linear Equations With No Solutions", "无解的一元一次方程"),
    t(
      "A linear equation has no solution when, after simplifying, the x-terms on the two sides match but the constants do not. Subtracting the x-terms then leaves a false statement such as 5 = 6.",
      "当一元一次方程化简后两边含 x 的项相同而常数项不同时，方程无解。两边同时减去含 x 的项，会得到 5 = 6 这样不成立的式子。",
    ),
    ["linear-equations-with-infinitely-many-solutions"],
    ["8.EE.C.7.A"],
    [
      lesson(
        "choosing-the-coefficient",
        ["Choosing the coefficient of x", "确定 x 的系数"],
        [
          [
            "A linear equation has no solution when its $x$-terms match but its constants do not. For which $a$ does $ax + 5 = 3(x + 2)$ have no solution? The right side is $3x + 6$. With $a = 3$ the equation is $3x + 5 = 3x + 6$, and subtracting $3x$ leaves $5 = 6$, which is false.",
            "一元一次方程两边含 $x$ 的项相同、常数项不同时，方程无解。$a$ 取何值时，$ax + 5 = 3(x + 2)$ 无解？右边是 $3x + 6$。当 $a = 3$ 时方程为 $3x + 5 = 3x + 6$，两边减去 $3x$ 得 $5 = 6$，不成立。",
          ],
          [
            "Try another value: $a = 4$ gives $4x + 5 = 3x + 6$, so $x = 1$ is a solution. Only $a = 3$ removes every solution.",
            "换一个值试试：$a = 4$ 时 $4x + 5 = 3x + 6$，$x = 1$ 就是解。只有 $a = 3$ 才让方程无解。",
          ],
          [
            "The answer multiplies $x$. The constant $6$ is not the coefficient of $x$.",
            "答案是与 $x$ 相乘的数。常数 $6$ 不是 $x$ 的系数。",
          ],
        ],
        (rng) => {
          const c = rng.sign() * rng.int(2, 7);
          const p = rng.nonZero(-8, 8);
          let q: number;
          do q = rng.nonZero(-20, 20);
          while (q === c * p);
          const eq = `ax ${q < 0 ? "-" : "+"} ${Math.abs(q)} = ${times(c, 1, p)}`;
          return valued(
            [`For what value of $a$ does $${eq}$ have no solution?`, `$a$ 取何值时，方程 $${eq}$ 无解？`],
            c,
            [
              [
                ["Expand the right side", "展开右边"],
                [`$${times(c, 1, p)} = ${linear(c, c * p)}$.`, `$${times(c, 1, p)} = ${linear(c, c * p)}$。`],
              ],
              [
                ["Match the x-terms", "使含 x 的项相同"],
                [
                  `With $a = ${c}$ both sides have $${poly([c, "x"])}$, and the constants differ:`,
                  `当 $a = ${c}$ 时两边都有 $${poly([c, "x"])}$，而常数项不同：`,
                ],
                [`${linear(c, q)} = ${linear(c, c * p)}`],
              ],
            ],
            [`${cancelling(c).en} leaves $${q} = ${c * p}$, which is false.`, `${cancelling(c)["zh-CN"]}，得 $${q} = ${c * p}$，不成立。`],
            [
              [c * p, "That is the constant of the right side; it does not multiply $x$.", "这是右边的常数项；它不与 $x$ 相乘。"],
              [-c, "That has the wrong sign; the $x$-terms must match exactly.", "符号错了；两边含 $x$ 的项必须完全相同。"],
              [p, `That is the number in the parentheses, before multiplying by $${c}$.`, `这是括号里的数，还没有乘以 $${c}$。`],
            ],
          );
        },
        twoSides(3, 5, 6, [
          "Both sides have 3x, and 5 can never equal 6, so no x works.",
          "两边都有 3x，而 5 永远不等于 6，所以没有 x 能满足。",
        ]),
      ),
      lesson(
        "which-equation-has-no-solution",
        ["Which equation has no solution", "哪个方程无解"],
        [
          [
            "To decide, simplify each side. $2(x + 3) + x = 3x + 6$ becomes $3x + 6 = 3x + 6$: infinitely many solutions. $2(x + 3) + x = 3x + 5$ becomes $3x + 6 = 3x + 5$: no solution. $2(x + 3) + x = 4x + 5$ has different $x$-terms, so it has exactly one solution.",
            "要判断，先化简每一边。$2(x + 3) + x = 3x + 6$ 化为 $3x + 6 = 3x + 6$：有无穷多个解。$2(x + 3) + x = 3x + 5$ 化为 $3x + 6 = 3x + 5$：无解。$2(x + 3) + x = 4x + 5$ 两边含 $x$ 的项不同，所以恰有一个解。",
          ],
          [
            "In $2(x + 3) + x = 4x + 5$, $x = 1$ gives $9 = 9$, so it does have a solution.",
            "在 $2(x + 3) + x = 4x + 5$ 中，$x = 1$ 得 $9 = 9$，所以它确实有解。",
          ],
          [
            "The same $x$-terms are not enough. When the constants match too, every number is a solution, not none.",
            "只看含 $x$ 的项相同还不够。如果常数项也相同，那么任何数都是解，而不是无解。",
          ],
        ],
        (rng) => {
          const a = rng.sign() * rng.int(2, 6);
          const p = rng.nonZero(-6, 6);
          let q: number;
          do q = rng.nonZero(-4, 4);
          while (a + q === 0);
          const [m, k] = [a + q, a * p];
          const lhs = plus(times(a, 1, p), q, "x");
          const off = rng.sign() * rng.int(1, 5);
          const none = `${lhs} = ${linear(m, k + off)}`;
          return chosenMath(
            rng,
            [
              `The equations below all have the left side $${lhs}$. Which one has no solution?`,
              `下面的方程左边都是 $${lhs}$。哪个方程无解？`,
            ],
            none,
            [
              [
                `${lhs} = ${linear(m, k)}`,
                "Its sides simplify to the same expression, so every number is a solution.",
                "它两边化简后是同一个式子，所以任何数都是解。",
              ],
              [
                `${lhs} = ${linear(m + (m === 1 ? 1 : rng.sign()), k + off)}`,
                "Its $x$-terms differ, so it has exactly one solution.",
                "它两边含 $x$ 的项不同，所以恰有一个解。",
              ],
              [
                `${lhs} = ${linear(-m, k + off)}`,
                "Its $x$-terms have opposite signs, so it has exactly one solution.",
                "它两边含 $x$ 的项符号相反，所以恰有一个解。",
              ],
            ],
            [
              [
                ["Simplify the left side", "化简左边"],
                ["Every equation has the same left side:", "每个方程的左边都一样："],
                [`${lhs} = ${linear(m, k)}`],
              ],
              [
                ["Compare the right sides", "比较右边"],
                [
                  `Only $${linear(m, k + off)}$ has the same $x$-term, $${poly([m, "x"])}$, with a different constant.`,
                  `只有 $${linear(m, k + off)}$ 含 $x$ 的项同为 $${poly([m, "x"])}$，而常数项不同。`,
                ],
              ],
            ],
            [
              `${cancelling(m).en} leaves $${k} = ${k + off}$, which is false.`,
              `${cancelling(m)["zh-CN"]}，得 $${k} = ${k + off}$，不成立。`,
            ],
          );
        },
        twoSides(3, 6, 5, [
          "2(x + 3) + x simplifies to 3x + 6; against 3x + 5 the x-terms match and the constants never do.",
          "2(x + 3) + x 化简为 3x + 6；与 3x + 5 相比，含 x 的项相同，常数项永远不同。",
        ]),
      ),
      lesson(
        "the-value-that-removes-all-solutions",
        ["The value that removes all solutions", "使方程无解的值"],
        [
          [
            "When an unknown coefficient sits inside parentheses, expand first, so that the coefficient of $x$ shows on each side. Set the two coefficients equal to find the unknown. Then compare the constants: if they differ, there is no solution. For $2(kx + 3) = 8x + 7$: $2k = 8$ gives $k = 4$, and $6 \\ne 7$.",
            "当未知系数在括号里时，先展开，让两边 $x$ 的系数都显现出来。令这两个系数相等，求出未知数。再比较常数项：如果不同，方程就无解。对 $2(kx + 3) = 8x + 7$：由 $2k = 8$ 得 $k = 4$，而 $6 \\ne 7$。",
          ],
          [
            "With $k = 4$: $8x + 6 = 8x + 7$ would mean $6 = 7$, which never holds.",
            "当 $k = 4$ 时，$8x + 6 = 8x + 7$ 意味着 $6 = 7$，永远不成立。",
          ],
          [
            "Divide by the number outside. In $2(kx + 3) = 8x + 7$, $k$ is $4$, not $8$.",
            "要除以括号外的数。在 $2(kx + 3) = 8x + 7$ 中，$k$ 是 $4$，不是 $8$。",
          ],
        ],
        (rng) => {
          const a = rng.int(2, 6);
          const answer = rng.int(2, 9);
          const b = rng.int(1, 9);
          const m = a * answer;
          const d = a * b + rng.int(1, 9);
          return valued(
            [
              `For which value of $k$ does $${a}(kx + ${b}) = ${m}x + ${d}$ have no solution?`,
              `当 $k$ 取何值时，方程 $${a}(kx + ${b}) = ${m}x + ${d}$ 无解？`,
            ],
            answer,
            [
              [
                ["Expand", "展开"],
                ["Multiply both terms in the parentheses by the number outside:", "把括号里的两项都乘以括号外的数："],
                [`${a}(kx + ${b}) = ${a}kx + ${a * b}`],
              ],
              [
                ["Match the x-terms", "使含 x 的项相同"],
                [`The $x$-terms cancel when $${a}k = ${m}$:`, `当 $${a}k = ${m}$ 时含 $x$ 的项抵消：`],
                [`k = ${m} \\div ${a} = ${answer}`],
              ],
            ],
            [
              `Then $${a * b} = ${d}$ is left, which is false, so no $x$ works.`,
              `这时剩下 $${a * b} = ${d}$，不成立，所以没有 $x$ 能满足。`,
            ],
            [
              [m, `That is the coefficient after multiplying; divide it by $${a}$.`, `这是乘过之后的系数；还要除以 $${a}$。`],
              [m - a, `That subtracts $${a}$ instead of dividing by it.`, `这是减去了 $${a}$，而不是除以 $${a}$。`],
              [
                d - a * b,
                "That works with the constants; $k$ must make the $x$-terms match.",
                "这是用常数项算的；$k$ 要让含 $x$ 的项相同。",
              ],
            ],
          );
        },
        twoSides(8, 6, 7, [
          "With k = 4 the sides are 8x + 6 and 8x + 7: the same x-term, different constants.",
          "当 k = 4 时两边是 8x + 6 和 8x + 7：含 x 的项相同，常数项不同。",
        ]),
      ),
    ],
  ),
  [
    "One phone plan costs $3x + 5$ dollars for $x$ months, and another costs $3x + 6$. After how many months do they cost the same?",
    "一种话费套餐 $x$ 个月共 $3x + 5$ 美元，另一种共 $3x + 6$ 美元。几个月后两种套餐花费相同？",
  ],
  ["Never: both grow by $3$ each month, and $5$ never catches up with $6$.", "永远不会：两种每个月都增加 $3$，而 $5$ 永远追不上 $6$。"],
  ["spot equations with no solution and find the value that makes one.", "识别无解的方程，并求出使方程无解的值。"],
);

/** determiningTheNumberOfSolutionsOfALinearEquation simplifies both sides to decide between one, none and infinitely many. */
export const determiningTheNumberOfSolutionsOfALinearEquation = withIntro(
  topic(
    "determining-the-number-of-solutions-of-a-linear-equation",
    t("Determining the Number of Solutions of a Linear Equation", "判断一元一次方程解的个数"),
    t(
      "Simplify both sides to the form ax + b = cx + d. If a ≠ c, there is exactly one solution. If a = c and b = d, there are infinitely many. If a = c but b ≠ d, there is none.",
      "把两边化简成 ax + b = cx + d 的形式。若 a ≠ c，恰有一个解；若 a = c 且 b = d，有无穷多个解；若 a = c 而 b ≠ d，无解。",
    ),
    ["linear-equations-with-no-solutions"],
    ["8.EE.C.7.A"],
    [
      lesson(
        "counting-solutions-after-expanding",
        ["Counting solutions after expanding both sides", "两边展开后判断解的个数"],
        [
          [
            "$4(x - 1) + 2x = 3(2x + 1) - 7$. The left side is $6x - 4$ and the right side is $6x + 3 - 7 = 6x - 4$, so the sides are the same and there are infinitely many solutions.",
            "$4(x - 1) + 2x = 3(2x + 1) - 7$。左边是 $6x - 4$，右边是 $6x + 3 - 7 = 6x - 4$，两边相同，所以有无穷多个解。",
          ],
          ["Try $x = 0$ and $x = 1$: both sides give $-4$, then both give $2$.", "试 $x = 0$ 和 $x = 1$：两边都得 $-4$，然后都得 $2$。"],
          [
            "Equal $x$-terms alone do not decide it: the constants must be compared too.",
            "仅凭含 $x$ 的项相同还不能下结论：还要比较常数项。",
          ],
        ],
        (rng) => {
          const kind = rng.pick([0, 1, 2] as const);
          const { equation, a, b, c, d } = expandedEquation(rng, kind);
          const right = countOptions[countOf(a, b, c, d)]!;
          return chosen(
            rng,
            [`How many solutions does $${equation}$ have?`, `方程 $${equation}$ 有几个解？`],
            [right.en, right["zh-CN"]],
            countWhy(a, b, c, d),
            [
              [
                ["Simplify each side", "化简两边"],
                ["Multiply out the parentheses and collect like terms:", "去括号，合并同类项："],
                [`${linear(a, b)} = ${linear(c, d)}`],
              ],
              [
                ["Compare", "比较"],
                [verdictOf(a, b, c, d).en, verdictOf(a, b, c, d)["zh-CN"]],
              ],
            ],
            sidesAt(a, b, c, d),
          );
        },
        twoSides(6, 4, 4, [
          "Two bars that simplify to the same 6x and the same constant: the sides match for every x.",
          "两个长条化简后都是 6x 加同样的常数：对任何 x 两边都相等。",
        ]),
      ),
      lesson(
        "solving-or-classifying",
        ["Solving when there is one solution", "恰有一个解时求出它"],
        [
          [
            "$5x - 2(x + 4) = x + 6$ simplifies to $3x - 8 = x + 6$. The $x$-terms differ, so there is exactly one solution: $2x = 14$, $x = 7$.",
            "$5x - 2(x + 4) = x + 6$ 化简为 $3x - 8 = x + 6$。含 $x$ 的项不同，所以恰有一个解：$2x = 14$，$x = 7$。",
          ],
          [
            "Substitute $x = 7$: $5 \\cdot 7 - 2 \\cdot 11 = 13$ and $7 + 6 = 13$.",
            "代入 $x = 7$：$5 \\cdot 7 - 2 \\cdot 11 = 13$，$7 + 6 = 13$。",
          ],
          [
            "When the $x$-terms cancel, the answer is no solution or infinitely many, never a particular number.",
            "如果含 $x$ 的项被消去，答案就是无解或有无穷多个解，而不是某个具体的数。",
          ],
        ],
        (rng) => {
          for (;;) {
            const kind = rng.pick([0, 0, 1, 2] as const);
            const { equation, a, b, c, d } = expandedEquation(rng, kind);
            const x = a !== c ? Q.of(d - b, a - c) : Q.zero;
            if (!x.isInteger()) continue;
            const one = (v: Q): Pair => [`Exactly one: $x = ${num(v)}$`, `恰有一个：$x = ${num(v)}$`];
            // A sign slip in moving the constant, or for the other kinds the tempting x = 0.
            const slip = a !== c ? Q.of(d + b, a - c) : Q.of(d - b);
            const slipped = slip.eq(x) ? x.add(Q.one) : slip;
            const count = countOf(a, b, c, d);
            const xi = Number(x.n);
            const many: Wrong = [
              [countOptions[1]!.en, countOptions[1]!["zh-CN"]],
              ...(count === 2
                ? ([
                    `The constants differ, so what is left, $${b} = ${d}$, is false.`,
                    `常数项不同，剩下的 $${b} = ${d}$ 不成立。`,
                  ] as const)
                : ([
                    "The $x$-terms differ, so the two sides are not the same expression.",
                    "含 $x$ 的项不同，所以两边不是同一个式子。",
                  ] as const)),
            ];
            const none: Wrong = [
              [countOptions[2]!.en, countOptions[2]!["zh-CN"]],
              ...(count === 1
                ? ([
                    `The constants match too, so what is left, $${b} = ${d}$, is true.`,
                    `常数项也相同，剩下的 $${b} = ${d}$ 成立。`,
                  ] as const)
                : ([
                    "The $x$-terms differ, so one value of $x$ balances the sides.",
                    "含 $x$ 的项不同，有一个 $x$ 能使两边相等。",
                  ] as const)),
            ];
            const singled: Wrong[] =
              count === 0
                ? [[one(slipped), "That moves the constant across with the wrong sign.", "这是移项时常数项的符号弄错了。"]]
                : [
                    [one(x), "The $x$-terms cancel, so no single number is the answer.", "含 $x$ 的项抵消了，所以答案不是某个具体的数。"],
                    [
                      one(slipped),
                      "The $x$-terms cancel, so no single number is the answer.",
                      "含 $x$ 的项抵消了，所以答案不是某个具体的数。",
                    ],
                  ];
            const named = countOptions[count]!;
            const correct: Pair = count === 0 ? one(x) : [named.en, named["zh-CN"]];
            const wrongs = [...singled, ...(count === 1 ? [] : [many]), ...(count === 2 ? [] : [none])].slice(0, 3);
            return chosen(
              rng,
              [`Solve $${equation}$.`, `解方程 $${equation}$。`],
              correct,
              wrongs,
              a !== c
                ? [
                    [
                      ["Simplify each side", "化简两边"],
                      ["Multiply out the parentheses and collect like terms:", "去括号，合并同类项："],
                      [`${linear(a, b)} = ${linear(c, d)}`],
                    ],
                    [
                      ["Solve", "解方程"],
                      [
                        "The $x$-terms differ, so there is exactly one solution. Gather the $x$-terms on the left:",
                        "含 $x$ 的项不同，所以恰有一个解。把含 $x$ 的项移到左边：",
                      ],
                      [`${poly([a - c, "x"])} = ${d - b}`, `x = ${num(x)}`],
                    ],
                  ]
                : [
                    [
                      ["Simplify each side", "化简两边"],
                      ["Multiply out the parentheses and collect like terms:", "去括号，合并同类项："],
                      [`${linear(a, b)} = ${linear(c, d)}`],
                    ],
                    [
                      ["Compare", "比较"],
                      [verdictOf(a, b, c, d).en, verdictOf(a, b, c, d)["zh-CN"]],
                    ],
                  ],
              a !== c
                ? [
                    `Substitute $x = ${xi}$ into the simplified sides: $${a} \\cdot ${paren(xi)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${a * xi + b}$ and $${c} \\cdot ${paren(xi)} ${d < 0 ? "-" : "+"} ${Math.abs(d)} = ${c * xi + d}$.`,
                    `把 $x = ${xi}$ 代入化简后的两边：$${a} \\cdot ${paren(xi)} ${b < 0 ? "-" : "+"} ${Math.abs(b)} = ${a * xi + b}$，$${c} \\cdot ${paren(xi)} ${d < 0 ? "-" : "+"} ${Math.abs(d)} = ${c * xi + d}$。`,
                  ]
                : sidesAt(a, b, c, d),
            );
          }
        },
        tapeFigure(
          [
            {
              total: "3x − 8",
              pieces: [
                { size: 3, text: "3x", lit: true },
                { size: 1, text: "−8", dashed: true },
              ],
            },
            {
              total: "x + 6",
              pieces: [
                { size: 1, text: "x" },
                { size: 1, text: "6" },
              ],
            },
          ],
          [
            "The sides 3x − 8 and x + 6 have different x-terms, so they balance for one x only, x = 7.",
            "两边 3x − 8 和 x + 6 含 x 的项不同，所以只有一个 x 能使它们相等，即 x = 7。",
          ],
        ),
      ),
    ],
  ),
  [
    "Two savings plans grow as $4(x - 1) + 2x$ and $3(2x + 1) - 7$ dollars after $x$ weeks. Are they ever equal, always equal, or equal just once?",
    "两个储蓄计划 $x$ 周后分别有 $4(x - 1) + 2x$ 美元和 $3(2x + 1) - 7$ 美元。它们从不相等、总是相等，还是只相等一次？",
  ],
  ["Both simplify to $6x - 4$, so they are always equal.", "两者都化简为 $6x - 4$，所以总是相等。"],
  [
    "simplify both sides to tell one solution, none or infinitely many, and solve when there is one.",
    "化简两边，判断方程有一个解、无解还是有无穷多个解，恰有一个解时求出它。",
  ],
);

// ---------------------------------------------------------------------------
// Horizontal and vertical lines

/** horizontalAndVerticalLines writes the lines x = a and y = b and finds the points on them. */
export const horizontalAndVerticalLines = withIntro(
  topic(
    "horizontal-and-vertical-lines",
    t("Horizontal and Vertical Lines", "水平直线和竖直直线"),
    t(
      "Every point of a vertical line has the same x-coordinate, so its equation is x = a. Every point of a horizontal line has the same y-coordinate, so its equation is y = b.",
      "竖直直线上每个点的横坐标都相同，所以它的方程是 x = a。水平直线上每个点的纵坐标都相同，所以它的方程是 y = b。",
    ),
    ["graphing-linear-equations"],
    ["8.EE.B.6"],
    [
      lesson(
        "the-line-through-two-points",
        ["The line through two points", "过两点的直线"],
        [
          [
            "$(3, -1)$ and $(3, 4)$ have the same $x$-coordinate, so the line through them is vertical. Its equation is $x = 3$: every point on it has $x = 3$, whatever $y$ is. $(-2, 5)$ and $(6, 5)$ share the $y$-coordinate, so the line through them is horizontal: $y = 5$.",
            "$(3, -1)$ 和 $(3, 4)$ 的横坐标相同，所以过这两点的直线是竖直的。它的方程是 $x = 3$：无论 $y$ 是多少，直线上每个点都有 $x = 3$。$(-2, 5)$ 和 $(6, 5)$ 的纵坐标相同，所以过它们的直线是水平的：$y = 5$。",
          ],
          [
            "From $(3, -1)$ to $(3, 4)$ you move straight up by $5$ and never sideways, so the line is vertical.",
            "从 $(3, -1)$ 到 $(3, 4)$ 是笔直向上移动 $5$，从不左右移动，所以这条直线是竖直的。",
          ],
          [
            "The equation names the coordinate that stays the same. The vertical line through $(3, -1)$ and $(3, 4)$ is $x = 3$, not $y = 3$.",
            "方程写出的是保持不变的那个坐标。过 $(3, -1)$ 和 $(3, 4)$ 的竖直直线是 $x = 3$，不是 $y = 3$。",
          ],
        ],
        (rng) => {
          const vertical = rng.bool();
          const same = rng.nonZero(-9, 9);
          const [u, v] = rng.sample(
            Array.from({ length: 19 }, (_, i) => i - 9).filter((n) => n !== same && n !== -same),
            2,
          ) as [number, number];
          const [p1, p2] = vertical
            ? [
                [same, u],
                [same, v],
              ]
            : [
                [u, same],
                [v, same],
              ];
          const [axis, other] = vertical ? ["x", "y"] : ["y", "x"];
          const way: Pair = vertical ? (v > u ? ["up", "向上"] : ["down", "向下"]) : v > u ? ["right", "向右"] : ["left", "向左"];
          return chosenMath(
            rng,
            [
              `Which is the equation of the line through $${pointLatex(p1)}$ and $${pointLatex(p2)}$?`,
              `过点 $${pointLatex(p1)}$ 和 $${pointLatex(p2)}$ 的直线的方程是哪一个？`,
            ],
            `${axis} = ${same}`,
            [
              [
                `${other} = ${same}`,
                `That uses the wrong letter; the shared number is the $${axis}$-coordinate.`,
                `这是字母用错了；相同的数是 $${axis}$ 坐标。`,
              ],
              [
                `${other} = ${u}`,
                `That is the ${vertical ? "horizontal" : "vertical"} line through the first point; it misses the second point.`,
                `这是过第一个点的${vertical ? "水平" : "竖直"}直线；它不经过第二个点。`,
              ],
              [
                `${axis} = ${u}`,
                "That uses a coordinate that changes from one point to the other.",
                "这用的是从一个点到另一个点会变化的坐标。",
              ],
            ],
            [
              [
                ["Compare the coordinates", "比较坐标"],
                [
                  `Both points have $${axis} = ${same}$. Their $${other}$-coordinates, $${u}$ and $${v}$, differ.`,
                  `两点都有 $${axis} = ${same}$。它们的 $${other}$ 坐标 $${u}$ 和 $${v}$ 不同。`,
                ],
              ],
              [
                ["Name the line", "写出直线"],
                [
                  `So the line is ${vertical ? "vertical" : "horizontal"}, and every point on it has $${axis} = ${same}$:`,
                  `所以这条直线是${vertical ? "竖直" : "水平"}的，直线上每个点都有 $${axis} = ${same}$：`,
                ],
                [`${axis} = ${same}`],
              ],
            ],
            [
              `Picture it: from $${pointLatex(p1)}$ to $${pointLatex(p2)}$ you move straight ${way[0]} by $${Math.abs(v - u)}$ and never ${vertical ? "sideways" : "up or down"}. The line $${axis} = ${same}$ runs exactly that way.`,
              `画出来看：从 $${pointLatex(p1)}$ 到 $${pointLatex(p2)}$ 是笔直${way[1]}移动 $${Math.abs(v - u)}$，从不${vertical ? "左右" : "上下"}移动。$${axis} = ${same}$ 这条直线正是这个方向。`,
            ],
          );
        },
        graphFigure(
          { xMin: -4, xMax: 8, yMin: -3, yMax: 7 },
          [
            { kind: "line", a: [3, -1], b: [3, 4], accent: true },
            { kind: "line", a: [-2, 5], b: [6, 5], tone: "action" },
            { kind: "point", at: [3, -1], label: "(3, −1)", dir: "e", accent: true },
            { kind: "point", at: [3, 4], label: "(3, 4)", dir: "e", accent: true },
            { kind: "point", at: [-2, 5], label: "(−2, 5)", dir: "n", tone: "action" },
            { kind: "point", at: [6, 5], label: "(6, 5)", dir: "n", tone: "action" },
          ],
          "The vertical line x = 3 through (3, −1) and (3, 4), and the horizontal line y = 5 through (−2, 5) and (6, 5).",
          "过 (3, −1) 和 (3, 4) 的竖直直线 x = 3，以及过 (−2, 5) 和 (6, 5) 的水平直线 y = 5。",
        ),
      ),
      lesson(
        "points-on-a-horizontal-or-vertical-line",
        ["Points on the line", "直线上的点"],
        [
          [
            "The line $y = -2$ is horizontal, and a point lies on it exactly when its $y$-coordinate is $-2$, whatever its $x$-coordinate. So $(7, -2)$ is on it, but $(-2, 7)$ is not. The line $x = 4$ is vertical, and a point lies on it exactly when its $x$-coordinate is $4$.",
            "直线 $y = -2$ 是水平的，一个点在这条直线上当且仅当它的纵坐标是 $-2$，横坐标是多少都可以。所以 $(7, -2)$ 在直线上，而 $(-2, 7)$ 不在。直线 $x = 4$ 是竖直的，一个点在它上面当且仅当它的横坐标是 $4$。",
          ],
          [
            "Start where $y = -2$ crosses the $y$-axis, at $(0, -2)$, and move $7$ to the right along the line: you reach $(7, -2)$.",
            "从 $y = -2$ 与 $y$ 轴的交点 $(0, -2)$ 出发，沿直线向右移动 $7$：就到了 $(7, -2)$。",
          ],
          [
            "Look at the right coordinate. On $y = -2$ the $y$-coordinate is $-2$; a point with $x = -2$, such as $(-2, 7)$, is not on it.",
            "要看对坐标。在 $y = -2$ 上，纵坐标是 $-2$；横坐标为 $-2$ 的点，如 $(-2, 7)$，不在这条直线上。",
          ],
        ],
        (rng) => {
          const vertical = rng.bool();
          const c = rng.nonZero(-8, 8);
          let k = rng.nonZero(-8, 8);
          if (Math.abs(k) === Math.abs(c)) k = Math.abs(c) === 8 ? 1 : Math.abs(c) + 1;
          const pt = (x: number, y: number) => pointLatex([x, y]);
          const [correct, swapped, negated, zero] = vertical
            ? [pt(c, k), pt(k, c), pt(-c, k), pt(0, c)]
            : [pt(k, c), pt(c, k), pt(k, -c), pt(c, 0)];
          const [axis, other] = vertical ? ["x", "y"] : ["y", "x"];
          const line = `${axis} = ${c}`;
          const start = vertical ? pt(c, 0) : pt(0, c);
          const way: Pair = vertical ? (k > 0 ? ["up", "向上"] : ["down", "向下"]) : k > 0 ? ["right", "向右"] : ["left", "向左"];
          return chosenMath(
            rng,
            [`Which point lies on the line $${line}$?`, `哪个点在直线 $${line}$ 上？`],
            correct,
            [
              [
                swapped,
                `That swaps the coordinates; its $${axis}$-coordinate is $${k}$.`,
                `这是把坐标交换了；它的 $${axis}$ 坐标是 $${k}$。`,
              ],
              [
                negated,
                `Its $${axis}$-coordinate is $${-c}$, the opposite of $${c}$.`,
                `它的 $${axis}$ 坐标是 $${-c}$，是 $${c}$ 的相反数。`,
              ],
              [
                zero,
                `That puts $${c}$ in the $${other}$-coordinate; this point is on $${other} = ${c}$.`,
                `这是把 $${c}$ 放在了 $${other}$ 坐标上；这个点在 $${other} = ${c}$ 上。`,
              ],
            ],
            [
              [
                ["Read the line", "看懂直线"],
                [
                  `$${line}$ is ${vertical ? "vertical" : "horizontal"}. A point is on it exactly when its $${axis}$-coordinate is $${c}$; its $${other}$-coordinate can be anything.`,
                  `$${line}$ 是${vertical ? "竖直" : "水平"}的。一个点在它上面当且仅当它的 $${axis}$ 坐标是 $${c}$；$${other}$ 坐标是多少都可以。`,
                ],
              ],
              [["Test the points", "检查各点"], [`Only one choice has $${axis} = ${c}$:`, `只有一个选项的 $${axis} = ${c}$：`], [correct]],
            ],
            [
              `Start where the line crosses the $${axis}$-axis, at $${start}$, and move ${way[0]} by $${Math.abs(k)}$ along it. You reach $${correct}$ without leaving the line.`,
              `从直线与 $${axis}$ 轴的交点 $${start}$ 出发，沿直线${way[1]}移动 $${Math.abs(k)}$，就到了 $${correct}$，始终没有离开直线。`,
            ],
          );
        },
        drawn(gradeDrawings5["horizontal-and-vertical-lines#points-on-a-horizontal-or-vertical-line"]),
      ),
    ],
  ),
  [
    "On a city map, Fifth Street runs straight north and south. The bakery is at $(3, -1)$ and the library at $(3, 4)$, both on Fifth Street.",
    "在城市地图上，第五街笔直地南北走向。面包店在 $(3, -1)$，图书馆在 $(3, 4)$，都在第五街上。",
  ],
  [
    "Both places have $x = 3$, and so does every point of the street. Its equation is $x = 3$.",
    "两个地方都有 $x = 3$，这条街上的每个点也都是这样。它的方程是 $x = 3$。",
  ],
  [
    "write the equations of horizontal and vertical lines, and tell which points lie on them.",
    "写出水平直线和竖直直线的方程，并判断哪些点在它们上面。",
  ],
);

/** theRectangleInsideFourLines finds the area of the rectangle that two vertical and two horizontal lines enclose. */
export const theRectangleInsideFourLines = lesson(
  "the-rectangle-inside-four-lines",
  ["The rectangle inside four lines", "四条直线围成的长方形"],
  [
    [
      "Two vertical and two horizontal lines enclose a rectangle. Its width is the distance between the vertical lines, found by subtracting their $x$-values. Its height is the distance between the horizontal lines. The lines $x = -1$, $x = 4$, $y = 2$ and $y = 5$ enclose a rectangle $4 - (-1) = 5$ wide and $5 - 2 = 3$ high, with area $15$.",
      "两条竖直线和两条水平线围成一个长方形。宽是两条竖直线的距离，用它们的 $x$ 值相减求出。高是两条水平线的距离。直线 $x = -1$、$x = 4$、$y = 2$ 和 $y = 5$ 围成的长方形宽 $4 - (-1) = 5$，高 $5 - 2 = 3$，面积是 $15$。",
    ],
    ["$15 \\div 5 = 3$, the height.", "$15 \\div 5 = 3$，正是高。"],
    [
      "Use the side lengths, not the coordinates of a corner. Subtracting a negative value adds its size: $4 - (-1) = 5$.",
      "要用边长，不是某个顶点的坐标。减去负数等于加上它的大小：$4 - (-1) = 5$。",
    ],
  ],
  (rng) => {
    const x1 = rng.int(-9, 3);
    const w = rng.int(2, 12);
    const y1 = rng.int(-9, 3);
    const h = rng.int(2, 12);
    const [x2, y2] = [x1 + w, y1 + h];
    const area = w * h;
    return valued(
      [
        `What is the area of the rectangle enclosed by $x = ${x1}$, $x = ${x2}$, $y = ${y1}$ and $y = ${y2}$?`,
        `$x = ${x1}$、$x = ${x2}$、$y = ${y1}$ 和 $y = ${y2}$ 围成的长方形面积是多少？`,
      ],
      area,
      [
        [
          ["Find the width", "求宽"],
          ["The width is the distance between the vertical lines:", "宽是两条竖直线之间的距离："],
          [`${x2} - ${paren(x1)} = ${w}`],
        ],
        [
          ["Find the height", "求高"],
          ["The height is the distance between the horizontal lines:", "高是两条水平线之间的距离："],
          [`${y2} - ${paren(y1)} = ${h}`],
        ],
        [["Multiply", "相乘"], ["The area is the width times the height:", "面积等于宽乘高："], [`${w} \\times ${h} = ${area}`]],
      ],
      [
        `Divide back: $${area} \\div ${w} = ${h}$, which is the distance from $y = ${y1}$ up to $y = ${y2}$.`,
        `除回去：$${area} \\div ${w} = ${h}$，正是从 $y = ${y1}$ 到 $y = ${y2}$ 的距离。`,
      ],
      [
        [2 * (w + h), "That is the perimeter, not the area.", "这是周长，不是面积。"],
        [w + h, "That adds the width and the height instead of multiplying them.", "这是把宽和高相加了，而不是相乘。"],
        [
          Math.abs(x2) * Math.abs(y2),
          "That multiplies the coordinates of one corner instead of the side lengths.",
          "这是用一个顶点的坐标相乘，而不是用边长。",
        ],
      ],
      { form: "integer" },
    );
  },
  drawn(gradeDrawings5["horizontal-and-vertical-lines#the-rectangle-inside-four-lines"]),
);

// ---------------------------------------------------------------------------
// Slope as a unit rate

/** Rate is a context for a proportional relationship: who or what does it, the two quantities and their units. */
interface Rate {
  readonly thing: Text;
  readonly verb: Text;
  readonly quantity: Text;
  readonly x: string;
  readonly y: string;
  readonly xUnit: Text;
  readonly yUnit: Text;
  readonly rate: Text;
  readonly question: Text;
  readonly lo: number;
  readonly hi: number;
}

/** rates are the contexts for unit rates. */
const rates: readonly Rate[] = [
  {
    verb: t("travels", "行驶"),
    quantity: t("distance", "路程"),
    thing: t("Car", "汽车"),
    x: "t",
    y: "d",
    xUnit: t("hours", "小时"),
    yUnit: t("miles", "英里"),
    rate: t("miles per hour", "英里每小时"),
    question: t("Which car is faster?", "哪辆汽车更快？"),
    lo: 35,
    hi: 70,
  },
  {
    verb: t("prints", "打印"),
    quantity: t("page count", "打印的页数"),
    thing: t("Printer", "打印机"),
    x: "m",
    y: "p",
    xUnit: t("minutes", "分钟"),
    yUnit: t("pages", "页"),
    rate: t("pages per minute", "页每分钟"),
    question: t("Which printer prints faster?", "哪台打印机打印得更快？"),
    lo: 12,
    hi: 40,
  },
  {
    verb: t("earns", "挣"),
    quantity: t("earnings", "收入"),
    thing: t("Worker", "工人"),
    x: "h",
    y: "e",
    xUnit: t("hours", "小时"),
    yUnit: t("dollars", "美元"),
    rate: t("dollars per hour", "美元每小时"),
    question: t("Which worker earns more per hour?", "哪位工人每小时挣得更多？"),
    lo: 14,
    hi: 32,
  },
  {
    verb: t("fills", "放出"),
    quantity: t("volume of water", "放出的水量"),
    thing: t("Faucet", "水龙头"),
    x: "m",
    y: "v",
    xUnit: t("minutes", "分钟"),
    yUnit: t("liters", "升"),
    rate: t("liters per minute", "升每分钟"),
    question: t("Which faucet fills faster?", "哪个水龙头放水更快？"),
    lo: 6,
    hi: 18,
  },
];

/** slopeAsAUnitRateInProportionalRelationships reads the unit rate of a proportional relationship as the slope of its graph. */
export const slopeAsAUnitRateInProportionalRelationships = withIntro(
  topic(
    "slope-as-a-unit-rate-in-proportional-relationships",
    t("Slope as a Unit Rate in Proportional Relationships", "比例关系中作为单位比率的斜率"),
    t(
      "The graph of a proportional relationship y = kx is a line through the origin whose slope is k, the unit rate: the change in y for each increase of 1 in x. Unit rates let relationships given in different ways be compared.",
      "比例关系 y = kx 的图像是过原点的直线，它的斜率就是 k，即单位比率：x 每增加 1 时 y 的变化量。借助单位比率，可以比较以不同方式给出的比例关系。",
    ),
    ["slope-of-a-line", "understanding-proportional-relationships-using-graphs"],
    ["8.EE.B.5"],
    [
      lesson(
        "unit-rate-from-two-points",
        ["The unit rate from two points on the graph", "由图像上的两点求单位比率"],
        [
          [
            "The graph of a proportional relationship $y = kx$ is a line through the origin, and its slope $k$ is the unit rate. A car's distance $d$ is proportional to the time $t$, and the graph passes through $(2, 110)$ and $(5, 275)$. The slope is $\\frac{275 - 110}{5 - 2} = \\frac{165}{3} = 55$, so the car travels $55$ miles per hour.",
            "比例关系 $y = kx$ 的图像是过原点的直线，斜率 $k$ 就是单位比率。汽车行驶的路程 $d$ 与时间 $t$ 成正比，图像经过 $(2, 110)$ 和 $(5, 275)$。斜率为 $\\frac{275 - 110}{5 - 2} = \\frac{165}{3} = 55$，所以汽车每小时行驶 $55$ 英里。",
          ],
          [
            "$110 \\div 2 = 55$ and $275 \\div 5 = 55$: each point gives the same ratio.",
            "$110 \\div 2 = 55$，$275 \\div 5 = 55$：每个点给出的比都一样。",
          ],
          [
            "Divide the change in $y$ by the change in $x$. $\\frac{3}{165}$ is hours per mile, not miles per hour.",
            "要用 $y$ 的变化量除以 $x$ 的变化量。$\\frac{3}{165}$ 是每英里所需的小时数，不是每小时的英里数。",
          ],
        ],
        (rng) => {
          const c = rng.pick(rates);
          const k = rng.int(c.lo, c.hi);
          const [x1, x2] = rng.sample([1, 2, 3, 4, 5, 6, 7, 8], 2).sort((a, b) => a - b) as [number, number];
          const [y1, y2] = [k * x1, k * x2];
          const thing = t(c.thing.en.toLowerCase(), c.thing["zh-CN"]);
          return valued(
            [
              `The ${c.quantity.en} $${c.y}$ (${c.yUnit.en}) of a ${thing.en} ${c.quantity.en === "earnings" ? "are" : "is"} proportional to the time $${c.x}$ (${c.xUnit.en}), and the graph passes through $${pointLatex([x1, y1])}$ and $${pointLatex([x2, y2])}$. What is the slope of the graph, in ${c.rate.en}?`,
              `某${thing["zh-CN"]}的${c.quantity["zh-CN"]} $${c.y}$（${c.yUnit["zh-CN"]}）与时间 $${c.x}$（${c.xUnit["zh-CN"]}）成正比，图像经过 $${pointLatex([x1, y1])}$ 和 $${pointLatex([x2, y2])}$。图像的斜率是多少（单位：${c.rate["zh-CN"]}）？`,
            ],
            k,
            [
              [
                ["Find the changes", "求变化量"],
                [`Subtract the coordinates of the two points:`, "把两点的坐标分别相减："],
                [`${y2} - ${y1} = ${y2 - y1}`, `${x2} - ${x1} = ${x2 - x1}`],
              ],
              [
                ["Divide", "相除"],
                [`The slope is the change in $${c.y}$ over the change in $${c.x}$:`, `斜率等于 $${c.y}$ 的变化量除以 $${c.x}$ 的变化量：`],
                [`\\frac{${y2 - y1}}{${x2 - x1}} = ${k}`],
              ],
            ],
            [
              `The line passes through the origin, so one point gives the same rate: $${y1} \\div ${x1} = ${k}$.`,
              `直线过原点，所以只用一个点也得到同样的比率：$${y1} \\div ${x1} = ${k}$。`,
            ],
            [
              [
                Q.of(x2 - x1, y2 - y1),
                "That divides the change in time by the other change; it is the rate the other way round.",
                "这是用时间的变化量去除另一个变化量；是反过来的比率。",
              ],
              [
                y2 - y1,
                "That is the change on the vertical axis alone; divide it by the change in time.",
                "这只是纵轴上的变化量；还要除以时间的变化量。",
              ],
              [y2, "That is a coordinate of a point, not a rate.", "这是一个点的坐标，不是比率。"],
            ],
          );
        },
        drawn(gradeDrawings5["slope-as-a-unit-rate-in-proportional-relationships#unit-rate-from-two-points"]),
      ),
      lesson(
        "comparing-unit-rates",
        ["Comparing two proportional relationships", "比较两个比例关系"],
        [
          [
            "To compare two proportional relationships, find both unit rates. Car A travels $d = 52t$ miles in $t$ hours, so its rate is $52$ miles per hour. Car B travels $165$ miles in $3$ hours at a constant speed, so its rate is $165 \\div 3 = 55$. Since $55 > 52$, car B is faster.",
            "比较两个比例关系，要先求出两者的单位比率。汽车 A 在 $t$ 小时内行驶 $d = 52t$ 英里，所以它的比率是每小时 $52$ 英里。汽车 B 匀速行驶，$3$ 小时行驶 $165$ 英里，所以它的比率是 $165 \\div 3 = 55$。因为 $55 > 52$，所以汽车 B 更快。",
          ],
          [
            "In $3$ hours car A covers $52 \\times 3 = 156$ miles, less than car B's $165$.",
            "$3$ 小时内汽车 A 行驶 $52 \\times 3 = 156$ 英里，比汽车 B 的 $165$ 英里少。",
          ],
          [
            "Compare unit rates, not the numbers as written. $165$ is a total for $3$ hours, not a rate.",
            "要比较单位比率，不是直接比较题目中写出的数。$165$ 是 $3$ 小时的总量，不是比率。",
          ],
        ],
        (rng) => {
          const c = rng.pick(rates);
          const ka = rng.int(c.lo, c.hi);
          let kb: number;
          do kb = rng.int(c.lo, c.hi);
          while (kb === ka);
          const x = rng.int(3, 8);
          const y = kb * x;
          const a: Pair = [`${c.thing.en} A`, `${c.thing["zh-CN"]} A`];
          const b: Pair = [`${c.thing.en} B`, `${c.thing["zh-CN"]} B`];
          const [fast, slow] = ka > kb ? [a, b] : [b, a];
          const [high, low] = [Math.max(ka, kb), Math.min(ka, kb)];
          return chosen(
            rng,
            [
              `${a[0]} ${c.verb.en} $${c.y} = ${ka}${c.x}$ ${c.yUnit.en} in $${c.x}$ ${c.xUnit.en}. ${b[0]} works at a constant rate and ${c.verb.en} $${y}$ ${c.yUnit.en} in $${x}$ ${c.xUnit.en}. ${c.question.en}`,
              `${a[1]} 在 $${c.x}$ ${c.xUnit["zh-CN"]}内${c.verb["zh-CN"]} $${c.y} = ${ka}${c.x}$ ${c.yUnit["zh-CN"]}。${b[1]} 匀速工作，$${x}$ ${c.xUnit["zh-CN"]}内${c.verb["zh-CN"]} $${y}$ ${c.yUnit["zh-CN"]}。${c.question["zh-CN"]}`,
            ],
            fast,
            [
              [
                slow,
                `Its unit rate, $${low}$ ${c.rate.en}, is lower than $${high}$.`,
                `它的单位比率是 $${low}$ ${c.rate["zh-CN"]}，低于 $${high}$。`,
              ],
            ],
            [
              [
                ["Read the first rate", "读出第一个比率"],
                [
                  `In $${c.y} = ${ka}${c.x}$, the coefficient $${ka}$ is the unit rate of ${a[0]}.`,
                  `在 $${c.y} = ${ka}${c.x}$ 中，系数 $${ka}$ 就是${a[1]}的单位比率。`,
                ],
              ],
              [
                ["Find the second rate", "求第二个比率"],
                [`${b[0]}: $${y} \\div ${x} = ${kb}$ ${c.rate.en}.`, `${b[1]}：$${y} \\div ${x} = ${kb}$ ${c.rate["zh-CN"]}。`],
              ],
              [
                ["Compare", "比较"],
                [`$${high} > ${low}$, so the answer is ${fast[0]}.`, `$${high} > ${low}$，所以答案是${fast[1]}。`],
              ],
            ],
            [
              `Over $${x}$ ${c.xUnit.en}, ${a[0]} reaches $${ka * x}$ and ${b[0]} reaches $${y}$.`,
              `$${x}$ ${c.xUnit["zh-CN"]}内，${a[1]}达到 $${ka * x}$，${b[1]}达到 $${y}$。`,
            ],
            equalTape(x, "?", `${y}`),
          );
        },
        equalTape(3, "55", "165"),
      ),
      lesson(
        "another-point-on-a-line-through-the-origin",
        ["Another point on a line through the origin", "过原点的直线上的另一个点"],
        [
          [
            "A line through the origin shows a proportional relationship, so every point on it has the same ratio $\\frac{y}{x}$: the slope. One known point gives the slope, and the slope gives the missing coordinate of any other point. Through $(6, 9)$ the slope is $\\frac{3}{2}$, so at $x = 10$, $y = 15$.",
            "过原点的直线表示正比例关系，所以线上每个点的比 $\\frac{y}{x}$ 都相同，就是斜率。一个已知的点给出斜率，斜率又给出其他点缺少的坐标。经过 $(6, 9)$ 时斜率是 $\\frac{3}{2}$，所以 $x = 10$ 时 $y = 15$。",
          ],
          ["$\\frac{15}{10} = \\frac{3}{2} = \\frac{9}{6}$.", "$\\frac{15}{10} = \\frac{3}{2} = \\frac{9}{6}$。"],
          [
            "Points on the line differ by a factor, not by a sum. Adding $4$ to each coordinate of $(6, 9)$ gives $(10, 13)$, which is off the line.",
            "线上的点之间是倍数关系，不是相加关系。给 $(6, 9)$ 的两个坐标都加 $4$ 得 $(10, 13)$，它不在直线上。",
          ],
        ],
        (rng) => {
          const [p, q] = rng.pick([
            [2, 3],
            [3, 4],
            [3, 2],
            [5, 2],
            [4, 3],
            [5, 3],
            [2, 5],
            [3, 5],
            [5, 4],
            [7, 2],
          ]) as [number, number];
          const u = rng.int(2, 9);
          const v = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((w) => w !== u));
          const [a, b, c] = [q * u, p * u, q * v];
          const answer = p * v;
          return valued(
            [
              `A line through the origin passes through $(${a}, ${b})$ and $(${c}, y)$. Find $y$.`,
              `一条过原点的直线经过 $(${a}, ${b})$ 和 $(${c}, y)$。求 $y$。`,
            ],
            answer,
            [
              [
                ["Find the slope", "求斜率"],
                ["Through the origin, the slope is $y$ over $x$ at any point:", "直线过原点，斜率等于任一点的 $y$ 除以 $x$："],
                [`\\frac{${b}}{${a}} = \\frac{${p}}{${q}}`],
              ],
              [
                ["Use the slope", "用斜率求 y"],
                [`Multiply $${c}$ by the slope:`, `用 $${c}$ 乘以斜率：`],
                [`y = \\frac{${p}}{${q}} \\times ${c} = ${answer}`],
              ],
            ],
            [
              `The new point gives the same ratio: $\\frac{${answer}}{${c}} = \\frac{${p}}{${q}}$.`,
              `新的点给出同样的比：$\\frac{${answer}}{${c}} = \\frac{${p}}{${q}}$。`,
            ],
            [
              [
                b + c - a,
                "That adds the same amount to both coordinates; the change must multiply.",
                "这是给两个坐标加了同样的量；变化应该是相乘。",
              ],
              [Q.of(a * c, b), "That uses the ratio upside down, $x$ over $y$.", "这是把比倒过来了，用了 $x$ 除以 $y$。"],
              [c, "That copies the $x$-coordinate.", "这是照抄了 $x$ 坐标。"],
            ],
          );
        },
        tableFigure(
          ["x", "y"],
          ["P", "Q"],
          [
            ["6", "10"],
            ["9", "15"],
          ],
          ["A table of two points on the line: P is (6, 9) and Q is (10, 15).", "直线上两个点的数值表：P 是 (6, 9)，Q 是 (10, 15)。"],
        ),
      ),
    ],
  ),
  [
    "A car's trip is graphed as distance against time: a straight line from the origin through $(2, 110)$.",
    "一辆汽车的行程画成路程随时间变化的图像：一条从原点出发、经过 $(2, 110)$ 的直线。",
  ],
  ["The slope is $110 \\div 2 = 55$, so the car covers $55$ miles each hour.", "斜率是 $110 \\div 2 = 55$，所以汽车每小时行驶 $55$ 英里。"],
  ["read unit rates as slopes, compare them, and find other points on the line.", "把单位比率看作斜率，比较单位比率，并求直线上的其他点。"],
);

/** grade8LinearEquationTopics lists the 8th grade topics on linear equations and lines. */
export const grade8LinearEquationTopics: readonly TopicDef[] = [
  linearEquationsWithInfinitelyManySolutions,
  linearEquationsWithNoSolutions,
  determiningTheNumberOfSolutionsOfALinearEquation,
  horizontalAndVerticalLines,
  slopeAsAUnitRateInProportionalRelationships,
];

/** choosingAValueForNoSolution finds the coefficient that makes a linear equation have no solution; it is the third point of linear-equations-with-infinitely-many-solutions, to take the place of the one in the deeper files. */
export const choosingAValueForNoSolution = lesson(
  "choosing-a-value-for-no-solution",
  ["Choosing a value for no solution", "选值使方程无解"],
  [
    [
      "When both sides have the same coefficient of $x$, the variable terms cancel. With different constants the equation then says something false, so it has no solution at all. For $3(x + 2) = kx + 7$, the left side is $3x + 6$; with $k = 3$ the $x$-terms cancel and leave $6 = 7$.",
      "两边 $x$ 的系数相同时，含变量的项相互抵消。常数不同时方程成了假命题，所以无解。对于 $3(x + 2) = kx + 7$，左边是 $3x + 6$；$k = 3$ 时 $x$ 项抵消，剩下 $6 = 7$。",
    ],
    [
      "Try another value: $k = 4$ gives $3x + 6 = 4x + 7$, so $x = -1$ is a solution. Only $k = 3$ removes every solution.",
      "换一个值试试：$k = 4$ 时 $3x + 6 = 4x + 7$，$x = -1$ 就是解。只有 $k = 3$ 才让方程无解。",
    ],
    ["The answer multiplies $x$. The constant $6$ is not the coefficient of $x$.", "答案是与 $x$ 相乘的数。常数 $6$ 不是 $x$ 的系数。"],
  ],
  (rng) => {
    const a = rng.int(2, 12);
    const b = rng.int(1, 9);
    const c = a * b + rng.int(1, 9);
    return valued(
      [`For what value of $k$ does $${a}(x + ${b}) = kx + ${c}$ have no solution?`, `$k$ 为何值时，$${a}(x + ${b}) = kx + ${c}$ 无解？`],
      a,
      [
        [
          ["Expand the left side", "展开左边"],
          [`$${a}(x + ${b}) = ${a}x + ${a * b}$.`, `$${a}(x + ${b}) = ${a}x + ${a * b}$。`],
        ],
        [
          ["Cancel the x-terms", "消去含 x 的项"],
          [`With $k = ${a}$ the $x$-terms cancel, and what is left is false:`, `$k = ${a}$ 时 $x$ 项抵消，剩下的式子不成立：`],
          [`${a * b} = ${c}`],
        ],
      ],
      [
        `Try another value: $k = ${a + 1}$ gives $${a}x + ${a * b} = ${a + 1}x + ${c}$, so $x = ${a * b - c}$ is a solution. Only $k = ${a}$ removes every solution.`,
        `换一个值试试：$k = ${a + 1}$ 时 $${a}x + ${a * b} = ${a + 1}x + ${c}$，$x = ${a * b - c}$ 就是解。只有 $k = ${a}$ 才让方程无解。`,
      ],
      [
        [a * b, "That is the constant of the left side; it does not multiply $x$.", "这是左边的常数项；它不与 $x$ 相乘。"],
        [c, "That is the constant of the right side; it does not multiply $x$.", "这是右边的常数项；它不与 $x$ 相乘。"],
        [a + b, "That adds the numbers in the parentheses instead of matching the $x$-terms.", "这是把数相加了，而不是使含 $x$ 的项相同。"],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "3x + 6",
        pieces: [
          { size: 3, text: "3x" },
          { size: 6, text: "6" },
        ],
      },
      {
        total: "3x + 7",
        pieces: [
          { size: 3, text: "3x" },
          { size: 7, text: "7", lit: true },
        ],
      },
    ],
    ["With k = 3 both sides have 3x, and 6 never equals 7.", "k = 3 时两边都有 3x，而 6 永远不等于 7。"],
  ),
);

/** readingWhatIsLeft decides the number of solutions from what is left after the variable cancels or remains; it is the third point of determining-the-number-of-solutions-of-a-linear-equation, to take the place of the one in the deeper files. */
export const readingWhatIsLeft = lesson(
  "reading-what-is-left",
  ["Reading what is left", "读懂剩下的式子"],
  [
    [
      "When the variable cancels, what is left decides the matter. A true statement such as $5 = 5$ means every number works, a false one such as $5 = 8$ means no number does, and a surviving variable such as $3x = 5$ means exactly one solution.",
      "变量抵消后，由剩下的式子决定。像 $5 = 5$ 这样成立的式子表示每个数都是解，像 $5 = 8$ 这样不成立的式子表示没有解；像 $3x = 5$ 这样变量还在则恰有一个解。",
    ],
    [
      "$3x = 5$ has the one solution $x = \\frac{5}{3}$: $3 \\cdot \\frac{5}{3} = 5$.",
      "$3x = 5$ 有唯一的解 $x = \\frac{5}{3}$：$3 \\cdot \\frac{5}{3} = 5$。",
    ],
    ["A linear equation never has exactly two solutions.", "一元一次方程不会恰有两个解。"],
  ],
  (rng) => {
    const kind = rng.int(0, 2);
    const a = rng.int(1, 40);
    const b = kind === 1 ? a + rng.int(1, 20) : a;
    const k = rng.int(2, 9);
    const text = kind === 2 ? `${k}x = ${a}` : `${a} = ${b}`;
    const options: Pair[] = [
      ["Infinitely many solutions", "无穷多个解"],
      ["No solution", "没有解"],
      ["Exactly one solution", "恰有一个解"],
    ];
    const reasons: Pair[] = [
      [`$${text}$ holds whatever $x$ is, so every number is a solution.`, `无论 $x$ 是多少，$${text}$ 都成立，所以每个数都是解。`],
      [`$${text}$ is false whatever $x$ is, so no number is a solution.`, `无论 $x$ 是多少，$${text}$ 都不成立，所以没有解。`],
      [`The variable remains, so one value of $x$ makes it true.`, "变量还在，所以有一个 $x$ 能使它成立。"],
    ];
    const x = Q.of(a, k);
    return chosen(
      rng,
      [
        `Solving a linear equation leads to $${text}$. How many solutions does the equation have?`,
        `解一元一次方程得到 $${text}$。这个方程有几个解？`,
      ],
      options[kind]!,
      [
        ...[0, 1, 2].filter((i) => i !== kind).map((i) => [options[i]!, ...reasons[kind]!] as const),
        [
          ["Exactly two solutions", "恰有两个解"],
          "A linear equation never has exactly two solutions.",
          "一元一次方程不会恰有两个解。",
        ] as const,
      ],
      [
        [
          ["Look for the variable", "看变量还在不在"],
          kind === 2
            ? ["The variable $x$ is still there.", "变量 $x$ 还在。"]
            : ["The variable has cancelled; only numbers are left.", "变量已经抵消，只剩下数。"],
        ],
        [["Decide", "判断"], reasons[kind]!],
      ],
      kind === 2
        ? [
            `Solve it: $x = ${num(x)}$, and $${k} \\cdot ${x.isInteger() ? num(x) : `\\left(${num(x)}\\right)`} = ${a}$. Any other $x$ makes $${k}x$ a different number.`,
            `解出来：$x = ${num(x)}$，$${k} \\cdot ${x.isInteger() ? num(x) : `\\left(${num(x)}\\right)`} = ${a}$。其他任何 $x$ 都会让 $${k}x$ 变成别的数。`,
          ]
        : [
            `Try two values: with $x = 0$ or $x = 1$ there is no $x$ left to change, and $${a} = ${b}$ stays ${kind === 0 ? "true" : "false"} both times.`,
            `试两个值：无论 $x = 0$ 还是 $x = 1$，式子里都没有 $x$，$${a} = ${b}$ 两次都${kind === 0 ? "成立" : "不成立"}。`,
          ],
    );
  },
  tapeFigure(
    [
      { total: "5 = 5", pieces: [{ size: 5, text: "5" }] },
      {
        total: "5 = 8",
        pieces: [
          { size: 5, text: "5" },
          { size: 3, text: "?", dashed: true, lit: true },
        ],
      },
    ],
    [
      "Two comparisons: 5 = 5 always holds, so every number is a solution; 5 = 8 never holds, so there is none.",
      "两个比较：5 = 5 总成立，所以每个数都是解；5 = 8 永不成立，所以无解。",
    ],
  ),
);
