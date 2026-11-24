import type { KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, gcd, num, paren, Q, radical, simplifyRadical } from "@ga/subject-math";

import { numberProblem, radicalProblem, steps } from "../problems.ts";
import type { Pair } from "./early-grades-more-kit.ts";
import { chosenMath, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { lineFigure, tapeFigure } from "./upper-grades-kit.ts";

// 8th Grade Math, radicals: square roots and cube roots of perfect squares and cubes, surds, the product and quotient
// rules for radicals, equations solved with square and cube roots, and side lengths of squares and cubes.

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

/** squareFree are square-free radicands other than 1. */
const squareFree = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23];

/** isSquare reports whether n is a perfect square. */
const isSquare = (n: number) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

/** reduced draws a fraction a/b in lowest terms with a between 1 and aMax and b between 2 and bMax. */
function reduced(rng: Rng, aMax: number, bMax: number): Q {
  const [a, b] = [rng.int(1, aMax), rng.int(2, bMax)];
  return gcd(a, b) === 1 ? Q.of(a, b) : reduced(rng, aMax, bMax);
}

/** power writes q^k with parentheses around a negative number or a fraction. */
const power = (q: Q, k: number) => `${q.sign() < 0 || !q.isInteger() ? `\\left(${num(q)}\\right)` : num(q)}^{${k}}`;

// ---------------------------------------------------------------------------
// Square roots and cube roots

/** theSquareRootOfAPerfectSquare evaluates square roots of perfect squares. */
export const theSquareRootOfAPerfectSquare = topic(
  "the-square-root-of-a-perfect-square",
  t("The Square Root of a Perfect Square", "完全平方数的平方根"),
  t(
    "The square root √a is the nonnegative number whose square is a, so √a = r exactly when r ≥ 0 and r² = a. For fractions and decimals, a perfect square has a square root that is a fraction or a decimal: √(9/25) = 3/5 and √0.36 = 0.6.",
    "平方根 √a 是平方等于 a 的非负数，所以 √a = r 当且仅当 r ≥ 0 且 r² = a。分数和小数中也有完全平方数，它们的平方根是分数或小数：√(9/25) = 3/5，√0.36 = 0.6。",
  ),
  ["powers-of-rational-numbers"],
  ["8.EE.A.2"],
  [
    {
      id: "square-roots-of-whole-numbers",
      title: t("Whole numbers", "整数"),
      explanation: t(
        "$\\sqrt{144} = 12$ because $12^{2} = 144$. Although $(-12)^{2} = 144$ as well, the symbol $\\sqrt{\\phantom{0}}$ means the nonnegative root, so $\\sqrt{144}$ is $12$ and $-\\sqrt{144} = -12$. The square root is not half the number: $\\sqrt{144} \\neq 72$.",
        "$\\sqrt{144} = 12$，因为 $12^{2} = 144$。虽然 $(-12)^{2}$ 也等于 $144$，但根号 $\\sqrt{\\phantom{0}}$ 表示非负的根，所以 $\\sqrt{144}$ 是 $12$，而 $-\\sqrt{144} = -12$。平方根不是这个数的一半：$\\sqrt{144} \\neq 72$。",
      ),
      generate(rng) {
        const r = rng.int(2, 30);
        const neg = rng.bool(0.25);
        const v = neg ? -r : r;
        const expr = `${neg ? "-" : ""}\\sqrt{${r * r}}`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: v,
          form: "integer",
          // The opposite sign, and half the number.
          wrong: [-v, Q.of((neg ? -1 : 1) * r * r, 2)],
          solution: t(
            `$${r}^{2} = ${r * r}$ and $${r} \\ge 0$, so $\\sqrt{${r * r}} = ${r}$${neg ? ` and $${expr} = ${v}$` : ""}.`,
            `$${r}^{2} = ${r * r}$ 且 $${r} \\ge 0$，所以 $\\sqrt{${r * r}} = ${r}$${neg ? `，$${expr} = ${v}$` : ""}。`,
          ),
        });
      },
    },
    {
      id: "square-roots-of-fractions-and-decimals",
      title: t("Fractions and decimals", "分数和小数"),
      explanation: t(
        "Take the root of the numerator and of the denominator: $\\sqrt{\\frac{49}{64}} = \\frac{7}{8}$. For a decimal, count decimal places: the square of a number with one decimal place has two, so $\\sqrt{0.09} = 0.3$, not $0.03$; check that $0.3^{2} = 0.09$.",
        "分子、分母分别开平方：$\\sqrt{\\frac{49}{64}} = \\frac{7}{8}$。对于小数，要数小数位数：一位小数的平方有两位小数，所以 $\\sqrt{0.09} = 0.3$，而不是 $0.03$；检验 $0.3^{2} = 0.09$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const r = reduced(rng, 12, 15);
          const sq = r.mul(r);
          return numberProblem({
            prompt: t(`Evaluate $\\sqrt{${num(sq)}}$.`, `计算 $\\sqrt{${num(sq)}}$。`),
            answer: r,
            // Halving the numerator and the denominator, and taking the root of the numerator only.
            wrong: [Q.of(Number(sq.n), 2 * Number(sq.d)), Q.of(Number(r.n), Number(sq.d))],
            solution: t(
              `$${power(r, 2)} = ${num(sq)}$, so $\\sqrt{${num(sq)}} = \\frac{\\sqrt{${sq.n}}}{\\sqrt{${sq.d}}} = ${num(r)}$.`,
              `$${power(r, 2)} = ${num(sq)}$，所以 $\\sqrt{${num(sq)}} = \\frac{\\sqrt{${sq.n}}}{\\sqrt{${sq.d}}} = ${num(r)}$。`,
            ),
          });
        }
        const r = rng.bool() ? Q.of(rng.int(1, 12), 10) : Q.of(rng.int(11, 25), 100);
        if (r.isInteger()) return this.generate(rng);
        const sq = r.mul(r);
        return numberProblem({
          prompt: t(`Evaluate $\\sqrt{${dec(sq)}}$.`, `计算 $\\sqrt{${dec(sq)}}$。`),
          answer: r,
          form: "decimal",
          // One decimal place too many, and one too few.
          wrong: [r.div(Q.of(10)), r.mul(Q.of(10))],
          solution: t(
            `$${dec(r)}^{2} = ${dec(sq)}$, so $\\sqrt{${dec(sq)}} = ${dec(r)}$.`,
            `$${dec(r)}^{2} = ${dec(sq)}$，所以 $\\sqrt{${dec(sq)}} = ${dec(r)}$。`,
          ),
        });
      },
    },
  ],
);

/** squaringASquareRoot squares square roots and multiples of them. */
export const squaringASquareRoot = topic(
  "squaring-a-square-root",
  t("Squaring a Square Root", "平方根的平方"),
  t(
    "Because √a is the nonnegative number whose square is a, (√a)² = √a · √a = a for every a ≥ 0, even when √a is irrational. A number in front squares too: (c√a)² = c² · a.",
    "因为 √a 是平方等于 a 的非负数，所以对任意 a ≥ 0，(√a)² = √a · √a = a，即使 √a 是无理数也成立。前面的系数也要平方：(c√a)² = c² · a。",
  ),
  ["the-square-root-of-a-perfect-square"],
  ["8.EE.A.2"],
  [
    {
      id: "squaring-a-root",
      title: t("Squaring a root", "根式的平方"),
      explanation: t(
        "$\\left(\\sqrt{7}\\right)^{2} = 7$ and $\\sqrt{7} \\cdot \\sqrt{7} = 7$, because $\\sqrt{7}$ is the number whose square is $7$. There is no need to find $\\sqrt{7}$ first, and the answer is not $7^{2} = 49$.",
        "$\\left(\\sqrt{7}\\right)^{2} = 7$，$\\sqrt{7} \\cdot \\sqrt{7} = 7$，因为 $\\sqrt{7}$ 就是平方等于 $7$ 的数。不需要先求出 $\\sqrt{7}$，答案也不是 $7^{2} = 49$。",
      ),
      generate(rng) {
        const m = rng.pick([...squareFree, 8, 12, 18, 20, 24, 30, 40, 50]);
        const expr = rng.bool() ? `\\left(\\sqrt{${m}}\\right)^{2}` : `\\sqrt{${m}} \\cdot \\sqrt{${m}}`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: m,
          form: "integer",
          // Squaring the number under the root, and doubling it.
          wrong: [m * m, 2 * m],
          solution: t(
            `$\\sqrt{${m}}$ is the nonnegative number whose square is $${m}$, so $${expr} = ${m}$.`,
            `$\\sqrt{${m}}$ 是平方等于 $${m}$ 的非负数，所以 $${expr} = ${m}$。`,
          ),
        });
      },
    },
    {
      id: "squaring-a-multiple-of-a-root",
      title: t("Coefficients and signs", "系数与符号"),
      explanation: t(
        "Square the number in front as well as the root: $\\left(3\\sqrt{5}\\right)^{2} = 3^{2} \\cdot \\left(\\sqrt{5}\\right)^{2} = 9 \\cdot 5 = 45$, not $3 \\cdot 5 = 15$. A negative sign inside the parentheses is squared, but one outside is not: $\\left(-\\sqrt{5}\\right)^{2} = 5$ while $-\\left(\\sqrt{5}\\right)^{2} = -5$.",
        "前面的系数和根式都要平方：$\\left(3\\sqrt{5}\\right)^{2} = 3^{2} \\cdot \\left(\\sqrt{5}\\right)^{2} = 9 \\cdot 5 = 45$，而不是 $3 \\cdot 5 = 15$。括号内的负号要参与平方，括号外的则不参与：$\\left(-\\sqrt{5}\\right)^{2} = 5$，而 $-\\left(\\sqrt{5}\\right)^{2} = -5$。",
      ),
      generate(rng) {
        const m = rng.pick(squareFree);
        const kind = rng.pick(["coefficient", "coefficient", "inside", "outside"] as const);
        if (kind === "coefficient") {
          const c = rng.pick([2, 3, 4, 5, 6, 10, -2, -3, -4]);
          const expr = `\\left(${c}\\sqrt{${m}}\\right)^{2}`;
          const v = c * c * m;
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
            answer: v,
            form: "integer",
            // Not squaring the coefficient, squaring the radicand, and a sign kept from the coefficient.
            wrong: [c * m, c * c * m * m, -v, 2 * c * m],
            solution: t(
              `Square the coefficient and the root:${steps(`${expr} = ${paren(c)}^{2} \\cdot \\left(\\sqrt{${m}}\\right)^{2} = ${c * c} \\cdot ${m} = ${v}`)}`,
              `系数和根式分别平方：${steps(`${expr} = ${paren(c)}^{2} \\cdot \\left(\\sqrt{${m}}\\right)^{2} = ${c * c} \\cdot ${m} = ${v}`)}`,
            ),
          });
        }
        const inside = kind === "inside";
        const expr = inside ? `\\left(-\\sqrt{${m}}\\right)^{2}` : `-\\left(\\sqrt{${m}}\\right)^{2}`;
        const v = inside ? m : -m;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: v,
          form: "integer",
          wrong: [-v, inside ? m * m : -m * m],
          solution: t(
            inside
              ? `The negative sign is inside the parentheses, so it is squared too: $${expr} = \\left(-\\sqrt{${m}}\\right) \\cdot \\left(-\\sqrt{${m}}\\right) = ${m}$.`
              : `Only $\\sqrt{${m}}$ is squared; the negative sign is applied afterward: $${expr} = -${m}$.`,
            inside
              ? `负号在括号内，也要平方：$${expr} = \\left(-\\sqrt{${m}}\\right) \\cdot \\left(-\\sqrt{${m}}\\right) = ${m}$。`
              : `只有 $\\sqrt{${m}}$ 被平方，负号在平方之后再加上：$${expr} = -${m}$。`,
          ),
        });
      },
    },
  ],
);

/** theCubeRootOfAPerfectCube evaluates cube roots of perfect cubes. */
export const theCubeRootOfAPerfectCube = topic(
  "the-cube-root-of-a-perfect-cube",
  t("The Cube Root of a Perfect Cube", "完全立方数的立方根"),
  t(
    "The cube root ∛a is the number whose cube is a. Every number has exactly one real cube root, and the cube root of a negative number is negative: ∛(−8) = −2. Fractions and decimals that are perfect cubes have cube roots that are fractions and decimals.",
    "立方根 ∛a 是立方等于 a 的数。每个数都恰好有一个实数立方根，负数的立方根是负数：∛(−8) = −2。是完全立方数的分数和小数，其立方根也是分数和小数。",
  ),
  ["the-square-root-of-a-perfect-square"],
  ["8.EE.A.2"],
  [
    {
      id: "cube-roots-of-integers",
      title: t("Integers", "整数"),
      explanation: t(
        "$\\sqrt[3]{125} = 5$ because $5^{3} = 125$, and $\\sqrt[3]{-125} = -5$ because $(-5)^{3} = -125$. A sign in front of the root applies afterward: $-\\sqrt[3]{125} = -5$ as well. A cube root is not a third of the number: $\\sqrt[3]{27} = 3$, but $\\sqrt[3]{216} = 6$, not $72$.",
        "$\\sqrt[3]{125} = 5$，因为 $5^{3} = 125$；$\\sqrt[3]{-125} = -5$，因为 $(-5)^{3} = -125$。根号前面的负号在开方之后再加上：$-\\sqrt[3]{125}$ 也等于 $-5$。立方根不是这个数的三分之一：$\\sqrt[3]{27} = 3$，但 $\\sqrt[3]{216} = 6$，而不是 $72$。",
      ),
      generate(rng) {
        const r = rng.int(2, 12) * (rng.bool(0.4) ? -1 : 1);
        const cube = r ** 3;
        // A negative sign in front of the root applies after the root is taken.
        const outside = rng.bool(0.25);
        const v = outside ? -r : r;
        const expr = `${outside ? "-" : ""}\\sqrt[3]{${cube}}`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: v,
          form: "integer",
          // The opposite sign, and a third of the number.
          wrong: [-v, Q.of(outside ? -cube : cube, 3)],
          solution: t(
            `$${paren(r)}^{3} = ${cube}$, so $\\sqrt[3]{${cube}} = ${r}$${outside ? ` and $${expr} = ${v}$` : ""}.`,
            `$${paren(r)}^{3} = ${cube}$，所以 $\\sqrt[3]{${cube}} = ${r}$${outside ? `，$${expr} = ${v}$` : ""}。`,
          ),
        });
      },
    },
    {
      id: "cube-roots-of-fractions-and-decimals",
      title: t("Fractions and decimals", "分数和小数"),
      explanation: t(
        "$\\sqrt[3]{\\frac{8}{27}} = \\frac{2}{3}$, taking the cube root of the numerator and of the denominator. The cube of a number with one decimal place has three decimal places, so $\\sqrt[3]{0.064} = 0.4$, since $0.4^{3} = 0.064$.",
        "$\\sqrt[3]{\\frac{8}{27}} = \\frac{2}{3}$，分子、分母分别开立方。一位小数的立方有三位小数，所以 $\\sqrt[3]{0.064} = 0.4$，因为 $0.4^{3} = 0.064$。",
      ),
      generate(rng) {
        const s = rng.bool(0.3) ? -1 : 1;
        if (rng.bool()) {
          const r = reduced(rng, 5, 6).mul(Q.of(s));
          const cube = r.pow(3);
          return numberProblem({
            prompt: t(`Evaluate $\\sqrt[3]{${num(cube)}}$.`, `计算 $\\sqrt[3]{${num(cube)}}$。`),
            answer: r,
            // The opposite sign, and dividing the numerator and denominator by 3.
            wrong: [r.neg(), Q.of(Number(cube.n), 3 * Number(cube.d))],
            solution: t(
              `$${power(r, 3)} = ${num(cube)}$, so $\\sqrt[3]{${num(cube)}} = ${num(r)}$.`,
              `$${power(r, 3)} = ${num(cube)}$，所以 $\\sqrt[3]{${num(cube)}} = ${num(r)}$。`,
            ),
          });
        }
        const r = Q.of(s * rng.int(1, 9), 10);
        const cube = r.pow(3);
        return numberProblem({
          prompt: t(`Evaluate $\\sqrt[3]{${dec(cube)}}$.`, `计算 $\\sqrt[3]{${dec(cube)}}$。`),
          answer: r,
          form: "decimal",
          // Too many decimal places, too few, and the opposite sign.
          wrong: [r.div(Q.of(10)), r.mul(Q.of(10)), r.neg()],
          solution: t(
            `$${r.sign() < 0 ? `(${dec(r)})` : dec(r)}^{3} = ${dec(cube)}$, so $\\sqrt[3]{${dec(cube)}} = ${dec(r)}$.`,
            `$${r.sign() < 0 ? `(${dec(r)})` : dec(r)}^{3} = ${dec(cube)}$，所以 $\\sqrt[3]{${dec(cube)}} = ${dec(r)}$。`,
          ),
        });
      },
    },
  ],
);

/** RootChoice is a root written in LaTeX with its value when the value is rational. */
interface RootChoice {
  readonly latex: string;
  readonly value?: string;
}

/** rationalRoots are roots that look irrational at first sight but have rational values. */
const rationalRoots: readonly RootChoice[] = [
  { latex: "\\sqrt{0.25}", value: "0.5" },
  { latex: "\\sqrt{0.04}", value: "0.2" },
  { latex: "\\sqrt[3]{-8}", value: "-2" },
  { latex: "\\sqrt[3]{0.001}", value: "0.1" },
  { latex: "\\sqrt{\\frac{50}{2}}", value: "5" },
  { latex: "\\sqrt{\\frac{16}{9}}", value: "\\frac{4}{3}" },
  { latex: "\\sqrt[3]{\\frac{1}{27}}", value: "\\frac{1}{3}" },
  { latex: "\\sqrt{196}", value: "14" },
  { latex: "\\sqrt[3]{216}", value: "6" },
  { latex: "\\sqrt{\\frac{27}{3}}", value: "3" },
  { latex: "\\sqrt[3]{-125}", value: "-5" },
  { latex: "\\sqrt{1.44}", value: "1.2" },
];

/** surdRoots are roots with irrational values, several of them perfect powers of the wrong kind. */
const surdRoots: readonly RootChoice[] = [
  { latex: "\\sqrt{0.4}" },
  { latex: "\\sqrt[3]{9}" },
  { latex: "\\sqrt[3]{16}" },
  { latex: "\\sqrt{\\frac{4}{5}}" },
  { latex: "\\sqrt{27}" },
  { latex: "\\sqrt{8}" },
  { latex: "\\sqrt[3]{36}" },
  { latex: "\\sqrt{0.9}" },
  { latex: "\\sqrt[3]{-4}" },
];

/** surds identifies roots whose values are irrational and makes a root rational with the smallest factor. */
export const surds = withIntro(
  topic(
    "surds",
    t("Surds", "不尽根数"),
    t(
      "A surd is a root whose value is irrational, such as √2 or ∛10. Roots that simplify to rational numbers, such as √0.25 = 0.5 or ∛(−8) = −2, are not surds. A square root of a whole number is a surd exactly when some prime appears in the number an odd number of times.",
      "值为无理数的根式叫作不尽根数，例如 √2 或 ∛10。能化为有理数的根式，例如 √0.25 = 0.5 或 ∛(−8) = −2，不是不尽根数。一个整数的平方根是不尽根数，当且仅当这个整数中有某个质因数出现奇数次。",
    ),
    ["the-cube-root-of-a-perfect-cube", "classifying-square-roots-and-cube-roots-as-rational-or-irrational"],
    ["8.NS.A.1", "8.EE.A.2"],
    [
      lesson(
        "identifying-surds",
        ["Identifying surds", "识别不尽根数"],
        [
          [
            "A **surd** is a root whose value is irrational, like $\\sqrt{2}$ or $\\sqrt[3]{10}$. To test a root, simplify the number under it. Then ask whether it is a perfect square, or a perfect cube for a cube root. $\\sqrt{\\frac{50}{2}} = \\sqrt{25} = 5$ is not a surd, but $\\sqrt{0.4} = \\sqrt{\\frac{2}{5}}$ is.",
            "值为无理数的根式叫作**不尽根数**，例如 $\\sqrt{2}$ 或 $\\sqrt[3]{10}$。判断时，先化简根号里的数，再看它是不是完全平方数；立方根就看是不是完全立方数。$\\sqrt{\\frac{50}{2}} = \\sqrt{25} = 5$ 不是不尽根数，而 $\\sqrt{0.4} = \\sqrt{\\frac{2}{5}}$ 是。",
          ],
          ["$5^{2} = 25$, but no fraction squared gives $\\frac{2}{5}$.", "$5^{2} = 25$，但没有哪个分数的平方等于 $\\frac{2}{5}$。"],
          [
            "Match the test to the root. $16$ is a perfect square, but $\\sqrt[3]{16}$ is still a surd.",
            "判断要看根指数。$16$ 是完全平方数，但 $\\sqrt[3]{16}$ 仍是不尽根数。",
          ],
        ],
        (rng) => {
          const surd = rng.pick(surdRoots);
          const others = rng.sample(rationalRoots, 3);
          const cube = surd.latex.includes("[3]");
          return chosenMath(
            rng,
            ["Which of these is a surd?", "下面哪一个是不尽根数？"],
            surd.latex,
            others.map(
              (r) => [r.latex, `That one is rational: $${r.latex} = ${r.value}$.`, `它是有理数：$${r.latex} = ${r.value}$。`] as const,
            ),
            [
              [
                ["Simplify each root", "化简每个根式"],
                ["Three of them come out exact:", "其中三个能开尽："],
                others.map((r) => `${r.latex} = ${r.value}`),
              ],
              [
                ["Find the surd", "找出不尽根数"],
                [
                  `The number under $${surd.latex}$ is not a perfect ${cube ? "cube" : "square"} of a rational number, so it is a surd.`,
                  `$${surd.latex}$ 根号里的数不是有理数的${cube ? "立方" : "平方"}，所以它是不尽根数。`,
                ],
              ],
            ],
            [
              "Raise each exact value to the root's power and you get back the number under its root. No rational number does that for the surd.",
              "把每个开尽的值按根指数乘方，都能得回根号里的数。没有哪个有理数能对不尽根数做到这一点。",
            ],
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 3,
            step: 0.5,
            labels: [0, 1, 2, 3],
            marks: [
              { at: Math.SQRT2, text: "√2", result: true },
              { at: 2, text: "√4" },
            ],
          },
          [
            "A number line from 0 to 3: √4 lands on the whole number 2, while √2 falls between 1 and 2.",
            "一条从 0 到 3 的数轴：√4 正好落在整数 2 上，而 √2 落在 1 和 2 之间。",
          ],
        ),
      ),
      lesson(
        "making-a-square-root-rational",
        ["Making a square root rational", "使平方根成为有理数"],
        [
          [
            "$\\sqrt{12}$ is a surd because $12 = 2^{2} \\cdot 3$ has the prime $3$ only once. Multiply $12$ by $3$ and you get $36 = 6^{2}$. So the smallest whole number $k$ that makes $\\sqrt{12k}$ rational is $3$.",
            "$\\sqrt{12}$ 是不尽根数，因为 $12 = 2^{2} \\cdot 3$ 中质因数 $3$ 只出现一次。$12$ 乘以 $3$ 得 $36 = 6^{2}$。所以使 $\\sqrt{12k}$ 为有理数的最小正整数 $k$ 是 $3$。",
          ],
          ["$\\sqrt{12 \\cdot 3} = \\sqrt{36} = 6$.", "$\\sqrt{12 \\cdot 3} = \\sqrt{36} = 6$。"],
          [
            "Multiplying by $12$ also works, but it is not the smallest. Use only the primes that have no partner.",
            "乘以 $12$ 也可以，但不是最小的。只补上没有配对的质因数。",
          ],
        ],
        (rng) => {
          for (;;) {
            const m = rng.pick([2, 3, 5, 6, 7, 10, 11, 14, 15]);
            const s = rng.pick([1, 2, 3, 4, 5, 6]);
            const n = s * s * m;
            if (n === m && rng.bool(0.7)) continue;
            return valued(
              [
                `What is the smallest positive whole number $k$ for which $\\sqrt{${n}k}$ is rational?`,
                `使 $\\sqrt{${n}k}$ 为有理数的最小正整数 $k$ 是多少？`,
              ],
              m,
              [
                [
                  ["Split off the squares", "分出平方因数"],
                  s > 1
                    ? [
                        `$${n} = ${s * s} \\cdot ${m}$, and $${s * s} = ${s}^{2}$ is already a perfect square.`,
                        `$${n} = ${s * s} \\cdot ${m}$，而 $${s * s} = ${s}^{2}$ 已经是完全平方数。`,
                      ]
                    : [`$${n}$ has no square factor at all.`, `$${n}$ 没有平方因数。`],
                ],
                [
                  ["Pair the rest", "给其余的配对"],
                  [
                    `$${m}$ has no square factor, so it needs one more $${m}$. Take $k = ${m}$:`,
                    `$${m}$ 没有平方因数，还需要再乘一个 $${m}$。取 $k = ${m}$：`,
                  ],
                  [`\\sqrt{${n} \\cdot ${m}} = \\sqrt{${n * m}} = ${s * m}`],
                ],
              ],
              [`Square the root back: $${s * m} \\cdot ${s * m} = ${n * m}$.`, `把结果平方回去：$${s * m} \\cdot ${s * m} = ${n * m}$。`],
              [
                [n, "That works, but it is not the smallest choice.", "这样也可以，但不是最小的。"],
                ...(s > 1
                  ? [
                      [
                        s * s,
                        "That is the square factor; it is already paired and does not help.",
                        "这是平方因数；它已经配好对，乘它没有用。",
                      ] as const,
                    ]
                  : []),
                [2, "That doubles the number, which does not pair every prime.", "这是乘以 $2$，并不能让每个质因数都配对。"],
              ],
            );
          }
        },
        tapeFigure(
          [
            {
              total: "36 = 6²",
              pieces: [
                { size: 2, text: "2" },
                { size: 2, text: "2" },
                { size: 3, text: "3" },
                { size: 3, text: "3", lit: true },
              ],
            },
          ],
          [
            "A bar of the factors of 12 · 3: 2, 2, 3 and a shaded extra 3. Every prime now has a partner, so the product 36 is 6².",
            "一个表示 12 · 3 各因数的长条：2、2、3，以及涂色的另一个 3。每个质因数都配了对，所以乘积 36 是 6²。",
          ],
        ),
      ),
    ],
  ),
  [
    "Mia draws a square with an area of $4$ cm². Its side is $\\sqrt{4} = 2$ cm. Then she draws one with an area of $2$ cm². Its side is $\\sqrt{2}$ cm, and no fraction is exactly that long.",
    "小米画了一个面积为 $4$ 平方厘米的正方形，边长是 $\\sqrt{4} = 2$ 厘米。她又画了一个面积为 $2$ 平方厘米的正方形，边长是 $\\sqrt{2}$ 厘米，没有哪个分数正好这么长。",
  ],
  [
    "$1.4^{2} = 1.96$ and $1.5^{2} = 2.25$, so $\\sqrt{2}$ is between $1.4$ and $1.5$.",
    "$1.4^{2} = 1.96$，$1.5^{2} = 2.25$，所以 $\\sqrt{2}$ 在 $1.4$ 和 $1.5$ 之间。",
  ],
  ["tell surds from roots that come out exact, and make a square root rational.", "区分不尽根数和能开尽的根式，并使平方根成为有理数。"],
);

// ---------------------------------------------------------------------------
// The rules of radicals

/** nonSquareSplit draws a factorization n = d · (n/d) with neither factor a perfect square, or nothing. */
function nonSquareSplit(rng: Rng, n: number): [number, number] | undefined {
  const ds: number[] = [];
  for (let d = 2; d < n; d++) if (n % d === 0 && !isSquare(d) && !isSquare(n / d)) ds.push(d);
  if (ds.length === 0) return undefined;
  const d = rng.pick(ds);
  return [d, n / d];
}

/** theProductRuleForRadicals multiplies square roots: √a · √b = √(ab). */
export const theProductRuleForRadicals = topic(
  "the-product-rule-for-radicals",
  t("The Product Rule for Radicals", "根式的乘法法则"),
  t(
    "For a, b ≥ 0, √a · √b = √(ab): the product of two square roots is the square root of the product. Two surds can multiply to a whole number, √2 · √8 = √16 = 4, and the product may need simplifying, √6 · √10 = √60 = 2√15. There is no such rule for sums: √a + √b is not √(a + b).",
    "对 a, b ≥ 0，√a · √b = √(ab)：两个平方根的积等于积的平方根。两个不尽根数的积可以是整数，√2 · √8 = √16 = 4；积也可能需要化简，√6 · √10 = √60 = 2√15。加法没有这样的法则：√a + √b 不等于 √(a + b)。",
  ),
  ["simplifying-square-roots"],
  ["8.EE.A.2", "HSN.RN.A.2"],
  [
    {
      id: "products-that-are-whole-numbers",
      title: t("Products that are whole numbers", "积为整数"),
      explanation: t(
        "$\\sqrt{3} \\cdot \\sqrt{27} = \\sqrt{81} = 9$. With numbers in front, multiply them separately: $2\\sqrt{5} \\cdot 3\\sqrt{20} = 6\\sqrt{100} = 60$. Forgetting the root gives $81$, the product of the numbers under it.",
        "$\\sqrt{3} \\cdot \\sqrt{27} = \\sqrt{81} = 9$。根号前有系数时，系数单独相乘：$2\\sqrt{5} \\cdot 3\\sqrt{20} = 6\\sqrt{100} = 60$。忘记开方会得到 $81$，即根号内两数之积。",
      ),
      generate(rng) {
        const r = rng.pick([4, 6, 8, 9, 10, 12, 15, 18, 20]);
        const split = nonSquareSplit(rng, r * r);
        if (!split) return this.generate(rng);
        const [a, b] = split;
        const [c, d] = rng.bool(0.35) ? [rng.int(2, 4), rng.int(2, 5)] : [1, 1];
        const lhs = `${c === 1 ? "" : c}\\sqrt{${a}} \\cdot ${d === 1 ? "" : d}\\sqrt{${b}}`;
        const v = c * d * r;
        return numberProblem({
          prompt: t(`Evaluate $${lhs}$.`, `计算 $${lhs}$。`),
          answer: v,
          form: "integer",
          // Not taking the root of the product, adding the radicands, and ignoring the coefficients.
          wrong: [c * d * a * b, ...(c * d === 1 ? [] : [r]), a + b],
          solution: t(
            `${c * d === 1 ? "Multiply" : "Multiply the coefficients and multiply"} the numbers under the roots:${steps(`${lhs} = ${c * d === 1 ? "" : c * d}\\sqrt{${a} \\cdot ${b}} = ${c * d === 1 ? "" : c * d}\\sqrt{${a * b}} = ${c * d === 1 ? r : `${c * d} \\cdot ${r} = ${v}`}`)}`,
            `${c * d === 1 ? "" : "系数相乘，"}根号内的数相乘：${steps(`${lhs} = ${c * d === 1 ? "" : c * d}\\sqrt{${a} \\cdot ${b}} = ${c * d === 1 ? "" : c * d}\\sqrt{${a * b}} = ${c * d === 1 ? r : `${c * d} \\cdot ${r} = ${v}`}`)}`,
          ),
        });
      },
    },
    {
      id: "products-in-simplest-form",
      title: t("Products in simplest radical form", "积化为最简根式"),
      explanation: t(
        "$\\sqrt{6} \\cdot \\sqrt{10} = \\sqrt{60}$. Then simplify: $60 = 4 \\cdot 15$, so $\\sqrt{60} = \\sqrt{4} \\cdot \\sqrt{15} = 2\\sqrt{15}$. An answer in simplest form has no perfect-square factor left under the root.",
        "$\\sqrt{6} \\cdot \\sqrt{10} = \\sqrt{60}$。再化简：$60 = 4 \\cdot 15$，所以 $\\sqrt{60} = \\sqrt{4} \\cdot \\sqrt{15} = 2\\sqrt{15}$。最简形式的根号内不能再有完全平方因数。",
      ),
      generate(rng) {
        const [a, b] = rng.sample([2, 3, 5, 6, 7, 10, 12, 14, 15, 18, 20, 21], 2) as [number, number];
        const p = a * b;
        const [k, m] = simplifyRadical(p);
        if (k === 1 || m === 1) return this.generate(rng);
        return radicalProblem({
          prompt: t(
            `Simplify $\\sqrt{${a}} \\cdot \\sqrt{${b}}$. Write the answer in simplest radical form.`,
            `化简 $\\sqrt{${a}} \\cdot \\sqrt{${b}}$，结果写成最简根式。`,
          ),
          answer: [k, m],
          // Adding the radicands, and taking the square factor out without its root.
          wrong: [`\\sqrt{${a + b}}`, radical(k * k, m), `${m}\\sqrt{${k}}`],
          solution: t(
            `Multiply under one root, then take out the perfect-square factor:${steps(`\\sqrt{${a}} \\cdot \\sqrt{${b}} = \\sqrt{${p}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${radical(k, m)}`)}`,
            `在同一个根号下相乘，再把完全平方因数开出来：${steps(`\\sqrt{${a}} \\cdot \\sqrt{${b}} = \\sqrt{${p}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${radical(k, m)}`)}`,
          ),
        });
      },
    },
  ],
);

/** theQuotientRuleForRadicals divides square roots: √a / √b = √(a/b). */
export const theQuotientRuleForRadicals = topic(
  "the-quotient-rule-for-radicals",
  t("The Quotient Rule for Radicals", "根式的除法法则"),
  t(
    "For a ≥ 0 and b > 0, √a / √b = √(a/b): the quotient of two square roots is the square root of the quotient. Dividing first often turns two surds into a whole number or a simpler surd: √72 / √2 = √36 = 6.",
    "对 a ≥ 0，b > 0，√a / √b = √(a/b)：两个平方根的商等于商的平方根。先做除法，常常能把两个不尽根数化为整数或更简单的根式：√72 / √2 = √36 = 6。",
  ),
  ["the-product-rule-for-radicals"],
  ["8.EE.A.2", "HSN.RN.A.2"],
  [
    {
      id: "quotients-that-are-rational",
      title: t("Quotients that are rational", "商为有理数"),
      explanation: t(
        "For positive numbers, the quotient of two square roots is the square root of the quotient, $\\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}}$. If that quotient is a perfect square, or a fraction of perfect squares, the root is a rational number.\n\n$\\frac{\\sqrt{75}}{\\sqrt{3}} = \\sqrt{\\frac{75}{3}} = \\sqrt{25} = 5$. The quotient under the root can also be a fraction: $\\frac{\\sqrt{50}}{\\sqrt{8}} = \\sqrt{\\frac{50}{8}} = \\sqrt{\\frac{25}{4}} = \\frac{5}{2}$.",
        "对正数，两个平方根之商等于商的平方根：$\\frac{\\sqrt{a}}{\\sqrt{b}} = \\sqrt{\\frac{a}{b}}$。如果这个商是完全平方数，或者是两个完全平方数之比，开方的结果就是有理数。\n\n$\\frac{\\sqrt{75}}{\\sqrt{3}} = \\sqrt{\\frac{75}{3}} = \\sqrt{25} = 5$。根号内的商也可以是分数：$\\frac{\\sqrt{50}}{\\sqrt{8}} = \\sqrt{\\frac{50}{8}} = \\sqrt{\\frac{25}{4}} = \\frac{5}{2}$。",
      ),
      generate(rng) {
        const m = rng.pick([2, 3, 5, 6, 7]);
        const r = rng.bool(0.65) ? Q.of(rng.int(2, 9)) : reduced(rng, 7, 5);
        // √(p²m) / √(q²m) = p/q.
        const [p, q] = [Number(r.n), Number(r.d)];
        const [a, b] = [p * p * m, q * q * m];
        const frac = `\\frac{\\sqrt{${a}}}{\\sqrt{${b}}}`;
        const inner = Q.of(a, b);
        return numberProblem({
          prompt: t(`Evaluate $${frac}$.`, `计算 $${frac}$。`),
          answer: r,
          // Not taking the root of the quotient, subtracting the radicands, and halving instead of taking the root.
          wrong: [inner, ...(isSquare(a - b) && a > b ? [Math.sqrt(a - b)] : []), Q.of(a, 2 * b)],
          solution: t(
            `Divide under one root:${steps(`${frac} = \\sqrt{\\frac{${a}}{${b}}} = \\sqrt{${num(inner)}} = ${num(r)}`)}`,
            `在同一个根号下相除：${steps(`${frac} = \\sqrt{\\frac{${a}}{${b}}} = \\sqrt{${num(inner)}} = ${num(r)}`)}`,
          ),
        });
      },
    },
    {
      id: "quotients-in-simplest-form",
      title: t("Quotients in simplest radical form", "商化为最简根式"),
      explanation: t(
        "After combining the roots into one, the number under the root may still have a square factor. Take that factor out as its square root, so that no square factor other than $1$ is left under the root.\n\n$\\frac{\\sqrt{90}}{\\sqrt{5}} = \\sqrt{18}$, which still has the square factor $9$: $\\sqrt{18} = \\sqrt{9} \\cdot \\sqrt{2} = 3\\sqrt{2}$.",
        "把两个根式合成一个后，根号内的数可能还有平方因数。把这个平方因数开方后移到根号外，使根号内不再含有 $1$ 以外的平方因数。\n\n$\\frac{\\sqrt{90}}{\\sqrt{5}} = \\sqrt{18}$，根号内还有平方因数 $9$：$\\sqrt{18} = \\sqrt{9} \\cdot \\sqrt{2} = 3\\sqrt{2}$。",
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 5, 6, 7]);
        const k = rng.int(2, 5);
        const m = rng.pick(squareFree.filter((x) => x <= 15 && x !== b));
        const a = b * k * k * m;
        if (a > 600) return this.generate(rng);
        const frac = `\\frac{\\sqrt{${a}}}{\\sqrt{${b}}}`;
        return radicalProblem({
          prompt: t(`Simplify $${frac}$. Write the answer in simplest radical form.`, `化简 $${frac}$，结果写成最简根式。`),
          answer: [k, m],
          // Subtracting the radicands, taking the square factor out without its root, and swapping the factors.
          wrong: [`\\sqrt{${a - b}}`, radical(k * k, m), `${m}\\sqrt{${k}}`],
          solution: t(
            `Divide under one root, then take out the perfect-square factor:${steps(`${frac} = \\sqrt{\\frac{${a}}{${b}}} = \\sqrt{${a / b}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${radical(k, m)}`)}`,
            `在同一个根号下相除，再把完全平方因数开出来：${steps(`${frac} = \\sqrt{\\frac{${a}}{${b}}} = \\sqrt{${a / b}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${radical(k, m)}`)}`,
          ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Equations with square and cube roots

/** signed writes "+ b" or "- |b|" after a term. */
const signed = (b: number) => (b < 0 ? `- ${-b}` : `+ ${b}`);

/** linearLatex writes ax + b. */
const linearLatex = (a: number, b: number) => `${a === 1 ? "" : a}x ${signed(b)}`;

/** solvingRadicalEquationsWithSquareRoots isolates a square root and squares both sides. */
export const solvingRadicalEquationsWithSquareRoots = withIntro(
  topic(
    "solving-radical-equations-with-square-roots",
    t("Solving Radical Equations With Square Roots", "解含平方根的方程"),
    t(
      "To solve an equation with the unknown under a square root, first isolate the root, then square both sides, since (√x)² = x. A square root is never negative, so an equation such as √x = −3 has no solution; always check the answer in the original equation.",
      "未知数在平方根号内的方程，先把根式单独留在一边，再两边平方，因为 (√x)² = x。平方根不会是负数，所以像 √x = −3 这样的方程无解；最后总要把答案代回原方程检验。",
    ),
    ["solving-equations-with-square-roots", "squaring-a-square-root"],
    ["8.EE.A.2"],
    [
      lesson(
        "isolating-the-square-root",
        ["Isolating the square root", "把根式单独留在一边"],
        [
          [
            "Get the root alone first, then square both sides, since $(\\sqrt{x})^{2} = x$. For $\\sqrt{x} + 4 = 11$, subtract $4$ to get $\\sqrt{x} = 7$. Then $x = 49$. For $3\\sqrt{x} = 12$, divide by $3$: $\\sqrt{x} = 4$, so $x = 16$.",
            "先把根式单独留在一边，再两边平方，因为 $(\\sqrt{x})^{2} = x$。对于 $\\sqrt{x} + 4 = 11$，两边减 $4$ 得 $\\sqrt{x} = 7$，于是 $x = 49$。对于 $3\\sqrt{x} = 12$，两边除以 $3$：$\\sqrt{x} = 4$，所以 $x = 16$。",
          ],
          ["$\\sqrt{49} + 4 = 7 + 4 = 11$.", "$\\sqrt{49} + 4 = 7 + 4 = 11$。"],
          [
            "Do not square before the root is alone. $(\\sqrt{x} + 4)^{2}$ is not $x + 16$.",
            "根式还没单独留下时不要平方。$(\\sqrt{x} + 4)^{2}$ 不等于 $x + 16$。",
          ],
        ],
        (rng) => {
          const r = rng.int(2, 15);
          const kind = rng.pick(["plain", "plus", "minus", "times"] as const);
          const b = rng.int(1, 12);
          const c = rng.int(2, 6);
          const [eq, isolate]: [string, Pair] =
            kind === "plain"
              ? [`\\sqrt{x} = ${r}`, ["The root is already alone.", "根式已经单独在一边。"]]
              : kind === "plus"
                ? [
                    `\\sqrt{x} + ${b} = ${r + b}`,
                    [`Subtract $${b}$ from both sides: $\\sqrt{x} = ${r}$.`, `两边减 $${b}$：$\\sqrt{x} = ${r}$。`],
                  ]
                : kind === "minus"
                  ? [
                      `\\sqrt{x} - ${b} = ${r - b}`,
                      [`Add $${b}$ to both sides: $\\sqrt{x} = ${r}$.`, `两边加 $${b}$：$\\sqrt{x} = ${r}$。`],
                    ]
                  : [
                      `${c}\\sqrt{x} = ${c * r}`,
                      [`Divide both sides by $${c}$: $\\sqrt{x} = ${r}$.`, `两边除以 $${c}$：$\\sqrt{x} = ${r}$。`],
                    ];
          const rhs = kind === "plain" ? r : kind === "plus" ? r + b : kind === "minus" ? r - b : c * r;
          return valued(
            [`Solve $${eq}$.`, `解方程 $${eq}$。`],
            r * r,
            [
              [["Isolate the root", "把根式单独留下"], isolate],
              [["Square both sides", "两边平方"], ["Squaring undoes the root:", "平方消去根号："], [`x = ${r}^{2} = ${r * r}`]],
            ],
            [
              `Put $${r * r}$ back: $\\sqrt{${r * r}} = ${r}$, so the equation holds.`,
              `把 $${r * r}$ 代回去：$\\sqrt{${r * r}} = ${r}$，方程成立。`,
            ],
            [
              [r, "That forgets to square; $x$ is under the root.", "这是忘了平方；$x$ 在根号里。"],
              ...(kind === "plain"
                ? []
                : [[rhs * rhs, "That squares before the root is alone.", "这是在根式单独留下之前就平方了。"] as const]),
              [2 * r, "That doubles instead of squaring.", "这是乘以 $2$，而不是平方。"],
              ...(kind === "times"
                ? [
                    [
                      Q.of(rhs * rhs, c),
                      `That divides by $${c}$ after squaring; divide first.`,
                      `这是平方之后才除以 $${c}$；要先除。`,
                    ] as const,
                  ]
                : []),
            ],
            { solveFor: "x" },
          );
        },
        tapeFigure(
          [
            {
              total: "11",
              pieces: [
                { size: 7, text: "√x" },
                { size: 4, text: "4", lit: true },
              ],
            },
          ],
          ["A bar of 11 made of √x and 4, so √x is 7.", "一个长度为 11 的长条，由 √x 和 4 组成，所以 √x 是 7。"],
        ),
      ),
      lesson(
        "expressions-under-the-square-root",
        ["Expressions under the root", "根号内是式子"],
        [
          [
            "In $\\sqrt{2x + 3} = 5$ the root is already alone, so the first step is to square both sides. That gives $2x + 3 = 25$. Then $2x = 22$ and $x = 11$.",
            "在 $\\sqrt{2x + 3} = 5$ 中，根式已经单独在一边，所以第一步就是两边平方，得 $2x + 3 = 25$。于是 $2x = 22$，$x = 11$。",
          ],
          ["$\\sqrt{2 \\cdot 11 + 3} = \\sqrt{25} = 5$.", "$\\sqrt{2 \\cdot 11 + 3} = \\sqrt{25} = 5$。"],
          [
            "Square the right side too. Solving $2x + 3 = 5$ gives the wrong $x = 1$.",
            "右边也要平方。解 $2x + 3 = 5$ 会得到错误的 $x = 1$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const a = rng.int(1, 5);
            const x = rng.int(-6, 15);
            const b = rng.int(-15, 15);
            const inside = a * x + b;
            if (b === 0 || !isSquare(inside) || inside === 0) continue;
            const c = Math.sqrt(inside);
            if (c === 1) continue;
            const eq = `\\sqrt{${linearLatex(a, b)}} = ${c}`;
            const move: Pair = b > 0 ? [`Subtract $${b}$`, `两边减 $${b}$`] : [`Add $${-b}$`, `两边加 $${-b}$`];
            return valued(
              [`Solve $${eq}$.`, `解方程 $${eq}$。`],
              x,
              [
                [
                  ["Square both sides", "两边平方"],
                  ["The root is alone, so square both sides:", "根式已经单独在一边，两边平方："],
                  [`${linearLatex(a, b)} = ${c * c}`],
                ],
                [
                  ["Solve", "解方程"],
                  a === 1 ? [`${move[0]}:`, `${move[1]}：`] : [`${move[0]}, then divide by $${a}$:`, `${move[1]}，再除以 $${a}$：`],
                  a === 1 ? [`x = ${x}`] : [`${a}x = ${c * c - b}`, `x = ${x}`],
                ],
              ],
              [
                `Put it back: $\\sqrt{${a === 1 ? "" : `${a} \\cdot `}${paren(x)} ${signed(b)}} = \\sqrt{${c * c}} = ${c}$.`,
                `代回去：$\\sqrt{${a === 1 ? "" : `${a} \\cdot `}${paren(x)} ${signed(b)}} = \\sqrt{${c * c}} = ${c}$。`,
              ],
              [
                [Q.of(c - b, a), "That leaves the right side unsquared.", "这是右边没有平方。"],
                [Q.of(c * c + b, a), "That moves the constant across without changing its sign.", "这是移项时没有改变常数的符号。"],
                [Q.of(2 * c - b, a), "That doubles the right side instead of squaring it.", "这是把右边乘以 $2$，而不是平方。"],
              ],
              { solveFor: "x" },
            );
          }
        },
        tapeFigure(
          [
            {
              total: "25",
              pieces: [
                { size: 22, text: "2x" },
                { size: 3, text: "3", lit: true },
              ],
            },
          ],
          ["After squaring, a bar of 25 made of 2x and 3, so 2x is 22.", "平方之后，一个长度为 25 的长条由 2x 和 3 组成，所以 2x 是 22。"],
        ),
      ),
      lesson(
        "two-square-roots-set-equal",
        ["Two square roots set equal", "两个相等的平方根"],
        [
          [
            "When one square root equals another, square both sides. Both roots go away at once. For $\\sqrt{5x + 2} = \\sqrt{3x + 8}$, that gives $5x + 2 = 3x + 8$. So $2x = 6$ and $x = 3$.",
            "一个平方根等于另一个平方根时，两边平方，两个根号同时去掉。对于 $\\sqrt{5x + 2} = \\sqrt{3x + 8}$，得到 $5x + 2 = 3x + 8$。所以 $2x = 6$，$x = 3$。",
          ],
          [
            "Both sides become $\\sqrt{17}$: $5 \\cdot 3 + 2 = 3 \\cdot 3 + 8 = 17$.",
            "两边都变成 $\\sqrt{17}$：$5 \\cdot 3 + 2 = 3 \\cdot 3 + 8 = 17$。",
          ],
          [
            "Check that the number under each root is not negative. A value that makes it negative is not a solution.",
            "要检验每个根号里的数不是负数。使它为负的值不是解。",
          ],
        ],
        (rng) => {
          const answer = rng.int(2, 12);
          const c = rng.int(2, 7);
          const a = c + rng.int(1, 5);
          const b = rng.int(1, 30);
          const d = (a - c) * answer + b;
          const value = a * answer + b;
          const gap = a - c === 1 ? "" : `${a - c}`;
          const root = Math.sqrt(value);
          return valued(
            [`Solve $\\sqrt{${a}x + ${b}} = \\sqrt{${c}x + ${d}}$.`, `解方程 $\\sqrt{${a}x + ${b}} = \\sqrt{${c}x + ${d}}$。`],
            answer,
            [
              [["Square both sides", "两边平方"], ["Both roots go away:", "两个根号都去掉："], [`${a}x + ${b} = ${c}x + ${d}`]],
              [
                ["Solve", "解方程"],
                [`Subtract $${c}x$ and $${b}$ from both sides:`, `两边减去 $${c}x$ 和 $${b}$：`],
                a - c === 1 ? [`x = ${d - b}`] : [`${gap}x = ${d - b}`, `x = ${answer}`],
              ],
            ],
            [
              `Both sides have $${value}$ under the root, which is not negative: $${a} \\cdot ${answer} + ${b} = ${c} \\cdot ${answer} + ${d} = ${value}$.`,
              `两边根号里都是 $${value}$，不是负数：$${a} \\cdot ${answer} + ${b} = ${c} \\cdot ${answer} + ${d} = ${value}$。`,
            ],
            [
              [-answer, "That gets the sign wrong when moving the terms.", "这是移项时符号弄错了。"],
              [Q.of(d - b, a + c), "That adds the $x$ terms instead of subtracting them.", "这是把含 $x$ 的项相加了，而不是相减。"],
              [value, "That is the number under the roots, not $x$.", "这是根号里的数，不是 $x$。"],
              ...(Number.isInteger(root) ? [[root, "That is the value of each root, not $x$.", "这是根式的值，不是 $x$。"] as const] : []),
            ],
            { solveFor: "x" },
          );
        },
        tapeFigure(
          [
            {
              total: "17",
              pieces: [
                { size: 15, text: "5x" },
                { size: 2, text: "2", lit: true },
              ],
            },
            {
              pieces: [
                { size: 9, text: "3x" },
                { size: 8, text: "8", lit: true },
              ],
            },
          ],
          [
            "Two bars of 17 when x = 3: one made of 5x and 2, the other of 3x and 8.",
            "x = 3 时两个长度都是 17 的长条：一个由 5x 和 2 组成，另一个由 3x 和 8 组成。",
          ],
        ),
      ),
    ],
  ),
  [
    "A square garden has an area of $x$ m². Its side is $\\sqrt{x}$ m. With a path $4$ m wide along one side, the garden and path measure $11$ m across.",
    "一个正方形花园的面积是 $x$ 平方米，边长是 $\\sqrt{x}$ 米。沿一边修了一条宽 $4$ 米的小路，花园加小路共宽 $11$ 米。",
  ],
  ["The side is $11 - 4 = 7$ m, so the area is $7^{2} = 49$ m².", "边长是 $11 - 4 = 7$ 米，所以面积是 $7^{2} = 49$ 平方米。"],
  [
    "solve equations with square roots by getting the root alone and squaring both sides.",
    "解含平方根的方程：先把根式单独留下，再两边平方。",
  ],
);

/** solvingEquationsUsingCubeRoots solves equations of the form ax³ + b = c by taking cube roots. */
export const solvingEquationsUsingCubeRoots = topic(
  "solving-equations-using-cube-roots",
  t("Solving Equations Using Cube Roots", "用立方根解方程"),
  t(
    "The equation x³ = a has exactly one solution, x = ∛a, which is negative when a is negative. Unlike x² = a, there is no second solution with the opposite sign, because (−2)³ = −8, not 8. To solve ax³ + b = c, isolate x³ first.",
    "方程 x³ = a 恰好有一个解 x = ∛a，当 a 为负数时它是负数。与 x² = a 不同，它没有符号相反的第二个解，因为 (−2)³ = −8，而不是 8。解 ax³ + b = c 时，先把 x³ 单独留在一边。",
  ),
  ["the-cube-root-of-a-perfect-cube", "solving-equations-with-square-roots"],
  ["8.EE.A.2"],
  [
    {
      id: "x-cubed-equals-a-number",
      title: t("$x^3$ equals a number", "$x^3$ 等于一个数"),
      explanation: t(
        "$x^{3} = -64$: the only real number whose cube is $-64$ is $-4$, so $x = \\sqrt[3]{-64} = -4$. Dividing by $3$ instead gives $-\\frac{64}{3}$, which is wrong.",
        "$x^{3} = -64$：立方等于 $-64$ 的实数只有 $-4$，所以 $x = \\sqrt[3]{-64} = -4$。除以 $3$ 得到 $-\\frac{64}{3}$，是错误的。",
      ),
      generate(rng) {
        const x = rng.bool(0.8) ? Q.of(rng.nonZero(-10, 10)) : reduced(rng, 4, 5).mul(Q.of(rng.sign()));
        const a = x.pow(3);
        if (a.abs().eq(Q.one)) return this.generate(rng);
        return numberProblem({
          prompt: t(`Solve $x^{3} = ${num(a)}$.`, `解方程 $x^{3} = ${num(a)}$。`),
          answer: x,
          solveFor: "x",
          // Dividing by 3, and the opposite sign.
          wrong: [a.div(Q.of(3)), x.neg()],
          solution: t(
            `Take the cube root of both sides: $x = \\sqrt[3]{${num(a)}} = ${num(x)}$, since $${power(x, 3)} = ${num(a)}$.`,
            `两边开立方：$x = \\sqrt[3]{${num(a)}} = ${num(x)}$，因为 $${power(x, 3)} = ${num(a)}$。`,
          ),
        });
      },
    },
    {
      id: "isolating-the-cube",
      title: t("Isolating the cube", "把立方项单独留在一边"),
      explanation: t(
        "$2x^{3} + 5 = -11$: subtract $5$ to get $2x^{3} = -16$, divide by $2$ to get $x^{3} = -8$, and take the cube root: $x = -2$. Take the cube root last, only after $x^{3}$ is alone.",
        "$2x^{3} + 5 = -11$：两边减 $5$ 得 $2x^{3} = -16$，两边除以 $2$ 得 $x^{3} = -8$，再开立方：$x = -2$。要等 $x^{3}$ 单独留在一边后，最后再开立方。",
      ),
      generate(rng) {
        const x = rng.nonZero(-5, 5);
        const a = rng.int(1, 5);
        const b = rng.nonZero(-20, 20);
        if (a === 1 && Math.abs(x) === 1) return this.generate(rng);
        const c = a * x ** 3 + b;
        const lhs = `${a === 1 ? "" : a}x^{3} ${signed(b)}`;
        return numberProblem({
          prompt: t(`Solve $${lhs} = ${c}$.`, `解方程 $${lhs} = ${c}$。`),
          answer: x,
          solveFor: "x",
          // Stopping at x³, the opposite sign, and dividing by 3 instead of taking the cube root.
          wrong: [x ** 3, -x, Q.of(x ** 3, 3)],
          solution: t(
            `Isolate $x^{3}$, then take the cube root:${steps(...(a === 1 ? [] : [`${a}x^{3} = ${c - b}`]), `x^{3} = ${x ** 3}`, `x = \\sqrt[3]{${x ** 3}} = ${x}`)}`,
            `先把 $x^{3}$ 单独留在一边，再开立方：${steps(...(a === 1 ? [] : [`${a}x^{3} = ${c - b}`]), `x^{3} = ${x ** 3}`, `x = \\sqrt[3]{${x ** 3}} = ${x}`)}`,
          ),
        });
      },
    },
  ],
);

/** solvingRadicalEquationsWithCubeRoots isolates a cube root and cubes both sides. */
export const solvingRadicalEquationsWithCubeRoots = topic(
  "solving-radical-equations-with-cube-roots",
  t("Solving Radical Equations With Cube Roots", "解含立方根的方程"),
  t(
    "To solve an equation with the unknown under a cube root, isolate the cube root and cube both sides, since (∛x)³ = x. A cube root can be negative, so ∛x = −3 has the solution x = −27.",
    "未知数在立方根号内的方程，先把立方根单独留在一边，再两边立方，因为 (∛x)³ = x。立方根可以是负数，所以 ∛x = −3 的解是 x = −27。",
  ),
  ["solving-equations-using-cube-roots", "solving-radical-equations-with-square-roots"],
  ["8.EE.A.2"],
  [
    {
      id: "isolating-the-cube-root",
      title: t("Isolating the cube root", "把立方根单独留在一边"),
      explanation: t(
        "$\\sqrt[3]{x} + 7 = 3$: subtract $7$ to get $\\sqrt[3]{x} = -4$, then cube: $x = (-4)^{3} = -64$. Unlike a square root, a cube root may equal a negative number, so this equation does have a solution.",
        "$\\sqrt[3]{x} + 7 = 3$：两边减 $7$ 得 $\\sqrt[3]{x} = -4$，再立方：$x = (-4)^{3} = -64$。与平方根不同，立方根可以等于负数，所以这个方程有解。",
      ),
      generate(rng) {
        const r = rng.nonZero(-6, 6);
        if (Math.abs(r) === 1) return this.generate(rng);
        const kind = rng.pick(["plain", "shift", "times"] as const);
        const b = rng.nonZero(-9, 9);
        const c = rng.int(2, 4);
        const [eq, isolate]: [string, [string, string]] =
          kind === "plain"
            ? [`\\sqrt[3]{x} = ${r}`, ["The cube root is already isolated.", "立方根已经单独在一边。"]]
            : kind === "shift"
              ? [
                  `\\sqrt[3]{x} ${signed(b)} = ${r + b}`,
                  [
                    `${b > 0 ? "Subtract" : "Add"} $${Math.abs(b)}$ ${b > 0 ? "from" : "to"} both sides: $\\sqrt[3]{x} = ${r}$.`,
                    `两边${b > 0 ? "减" : "加"} $${Math.abs(b)}$：$\\sqrt[3]{x} = ${r}$。`,
                  ],
                ]
              : [
                  `${c}\\sqrt[3]{x} = ${c * r}`,
                  [`Divide both sides by $${c}$: $\\sqrt[3]{x} = ${r}$.`, `两边除以 $${c}$：$\\sqrt[3]{x} = ${r}$。`],
                ];
        const rhs = kind === "plain" ? r : kind === "shift" ? r + b : c * r;
        return numberProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          answer: r ** 3,
          solveFor: "x",
          // Squaring instead of cubing, multiplying by 3, and cubing before isolating.
          wrong: [r * r, 3 * r, ...(kind === "plain" ? [] : [rhs ** 3])],
          solution: t(
            `${isolate[0]} Cube both sides:${steps(`x = ${paren(r)}^{3} = ${r ** 3}`)}`,
            `${isolate[1]}两边立方：${steps(`x = ${paren(r)}^{3} = ${r ** 3}`)}`,
          ),
        });
      },
    },
    {
      id: "expressions-under-the-cube-root",
      title: t("Expressions under the cube root", "立方根号内是式子"),
      explanation: t(
        "Cubing undoes a cube root, so cube both sides to remove the root and then solve the equation that is left. A cube root can be negative, so a negative right side is allowed. Check the solution in the original equation.\n\n$\\sqrt[3]{3x - 2} = -2$: cubing both sides gives $3x - 2 = -8$, so $3x = -6$ and $x = -2$. Check: $\\sqrt[3]{3 \\cdot (-2) - 2} = \\sqrt[3]{-8} = -2$.",
        "立方运算可以抵消立方根，所以两边同时立方，去掉根号，再解剩下的方程。立方根可以是负数，所以右边是负数也可以。最后把解代回原方程检验。\n\n$\\sqrt[3]{3x - 2} = -2$：两边立方得 $3x - 2 = -8$，所以 $3x = -6$，$x = -2$。检验：$\\sqrt[3]{3 \\cdot (-2) - 2} = \\sqrt[3]{-8} = -2$。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const c = rng.nonZero(-4, 4);
        const b = rng.nonZero(-12, 12);
        if (Math.abs(c) === 1 || (c ** 3 - b) % a !== 0) return this.generate(rng);
        const x = (c ** 3 - b) / a;
        const eq = `\\sqrt[3]{${linearLatex(a, b)}} = ${c}`;
        return numberProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          answer: x,
          solveFor: "x",
          // Not cubing the right side, squaring it instead of cubing, and multiplying it by 3.
          wrong: [Q.of(c - b, a), Q.of(c * c - b, a), Q.of(3 * c - b, a)],
          solution: t(
            `Cube both sides, then solve:${steps(`${linearLatex(a, b)} = ${c ** 3}`, ...(a === 1 ? [] : [`${a}x = ${c ** 3 - b}`]), `x = ${x}`)}`,
            `两边立方，再解方程：${steps(`${linearLatex(a, b)} = ${c ** 3}`, ...(a === 1 ? [] : [`${a}x = ${c ** 3 - b}`]), `x = ${x}`)}`,
          ),
        });
      },
    },
  ],
);

/** Unit is a length unit with its square and cubic units: [length, area, volume] in English and Chinese. */
type Unit = readonly [Text, Text, Text];

/** units are length units with their area and volume units. */
const units: readonly Unit[] = [
  [t("centimeters", "厘米"), t("square centimeters", "平方厘米"), t("cubic centimeters", "立方厘米")],
  [t("meters", "米"), t("square meters", "平方米"), t("cubic meters", "立方米")],
  [t("inches", "英寸"), t("square inches", "平方英寸"), t("cubic inches", "立方英寸")],
  [t("feet", "英尺"), t("square feet", "平方英尺"), t("cubic feet", "立方英尺")],
];

/** findingSideLengthsOfSquaresAndCubesFromAreaOrVolume uses square and cube roots to find side lengths. */
export const findingSideLengthsOfSquaresAndCubesFromAreaOrVolume = topic(
  "finding-side-lengths-of-squares-and-cubes-from-area-or-volume",
  t("Finding Side Lengths of Squares and Cubes From Area or Volume", "由面积或体积求正方形和正方体的边长"),
  t(
    "A square with side s has area s², so a square of area A has side √A. A cube with edge e has volume e³, so a cube of volume V has edge ∛V. Lengths are positive, so only the positive square root is used.",
    "边长为 s 的正方形面积是 s²，所以面积为 A 的正方形边长是 √A。棱长为 e 的正方体体积是 e³，所以体积为 V 的正方体棱长是 ∛V。长度是正数，所以只取正的平方根。",
  ),
  ["solving-equations-using-cube-roots"],
  ["8.EE.A.2"],
  [
    {
      id: "side-of-a-square-from-its-area",
      title: t("The side of a square", "正方形的边长"),
      explanation: t(
        "A square has area $81$ square meters. Its side $s$ satisfies $s^{2} = 81$, so $s = \\sqrt{81} = 9$ meters; $-9$ is also a solution of the equation but not a length. Dividing the area by $4$, as for a perimeter, gives the wrong $20.25$.",
        "一个正方形的面积是 $81$ 平方米。它的边长 $s$ 满足 $s^{2} = 81$，所以 $s = \\sqrt{81} = 9$ 米；$-9$ 虽然也是方程的解，但不是长度。像求周长那样把面积除以 $4$，会得到错误的 $20.25$。",
      ),
      generate(rng) {
        const [len, area] = rng.pick(units);
        const s = rng.bool(0.7) ? Q.of(rng.int(3, 25)) : Q.of(2 * rng.int(2, 12) + 1, 2);
        const A = s.mul(s);
        return numberProblem({
          prompt: t(
            `A square has an area of $${dec(A)}$ ${area.en}. How long is each side, in ${len.en}?`,
            `一个正方形的面积是 $${dec(A)}$ ${area["zh-CN"]}。它的边长是多少${len["zh-CN"]}？`,
          ),
          answer: s,
          form: "decimal",
          // Dividing the area by 4 as for a perimeter, and halving it.
          wrong: [A.div(Q.of(4)), A.div(Q.of(2))],
          solution: t(
            `The side $s$ satisfies $s^{2} = ${dec(A)}$, and a length is positive:${steps(`s = \\sqrt{${dec(A)}} = ${dec(s)}`)}Each side is $${dec(s)}$ ${len.en}.`,
            `边长 $s$ 满足 $s^{2} = ${dec(A)}$，而长度是正数：${steps(`s = \\sqrt{${dec(A)}} = ${dec(s)}`)}每条边长 $${dec(s)}$ ${len["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "edge-of-a-cube-from-its-volume",
      title: t("The edge of a cube", "正方体的棱长"),
      explanation: t(
        "A cube has volume $343$ cubic inches. Its edge $e$ satisfies $e^{3} = 343$, so $e = \\sqrt[3]{343} = 7$ inches. Then each face is a $7$ by $7$ square with area $49$ square inches, and the whole surface has area $6 \\cdot 49 = 294$ square inches.",
        "一个正方体的体积是 $343$ 立方英寸。它的棱长 $e$ 满足 $e^{3} = 343$，所以 $e = \\sqrt[3]{343} = 7$ 英寸。每个面都是 $7 \\times 7$ 的正方形，面积为 $49$ 平方英寸，整个表面积为 $6 \\cdot 49 = 294$ 平方英寸。",
      ),
      generate(rng) {
        const [len, area, volume] = rng.pick(units);
        const e = rng.int(2, 12);
        const V = e ** 3;
        const ask = rng.pick(["edge", "edge", "face", "surface"] as const);
        const [answer, qEn, qZh] =
          ask === "edge"
            ? [e, `How long is each edge, in ${len.en}?`, `它的棱长是多少${len["zh-CN"]}？`]
            : ask === "face"
              ? [e * e, `What is the area of one face, in ${area.en}?`, `它一个面的面积是多少${area["zh-CN"]}？`]
              : [6 * e * e, `What is its surface area, in ${area.en}?`, `它的表面积是多少${area["zh-CN"]}？`];
        const rest =
          ask === "edge"
            ? ["", ""]
            : ask === "face"
              ? [
                  `Each face is a square with area $${e}^{2} = ${e * e}$ ${area.en}.`,
                  `每个面是正方形，面积为 $${e}^{2} = ${e * e}$ ${area["zh-CN"]}。`,
                ]
              : [
                  `Each face has area $${e}^{2} = ${e * e}$, and a cube has $6$ faces: $6 \\cdot ${e * e} = ${6 * e * e}$ ${area.en}.`,
                  `每个面的面积为 $${e}^{2} = ${e * e}$，正方体有 $6$ 个面：$6 \\cdot ${e * e} = ${6 * e * e}$ ${area["zh-CN"]}。`,
                ];
        return numberProblem({
          prompt: t(`A cube has a volume of $${V}$ ${volume.en}. ${qEn}`, `一个正方体的体积是 $${V}$ ${volume["zh-CN"]}。${qZh}`),
          answer,
          form: "integer",
          // Dividing the volume by 3, the edge in place of the area, and one face in place of the whole surface.
          wrong: ask === "edge" ? [Q.of(V, 3), Q.of(V, 6)] : ask === "face" ? [e, Q.of(V, 6)] : [e * e, Q.of(V, 6), 6 * e],
          solution: t(
            `The edge $e$ satisfies $e^{3} = ${V}$, so $e = \\sqrt[3]{${V}} = ${e}$ ${len.en}.${rest[0] ? ` ${rest[0]}` : ""}`,
            `棱长 $e$ 满足 $e^{3} = ${V}$，所以 $e = \\sqrt[3]{${V}} = ${e}$ ${len["zh-CN"]}。${rest[1]}`,
          ),
        });
      },
    },
  ],
);

/** grade8RadicalTopics lists the 8th grade topics on radicals. */
export const grade8RadicalTopics: readonly TopicDef[] = [
  theSquareRootOfAPerfectSquare,
  squaringASquareRoot,
  theCubeRootOfAPerfectCube,
  surds,
  theProductRuleForRadicals,
  theQuotientRuleForRadicals,
  solvingRadicalEquationsWithSquareRoots,
  solvingEquationsUsingCubeRoots,
  solvingRadicalEquationsWithCubeRoots,
  findingSideLengthsOfSquaresAndCubesFromAreaOrVolume,
];

/** countingTheSurds counts the surds in a list of roots; it is the third point of surds, to take the place of the one in the deeper files. */
export const countingTheSurds = lesson(
  "counting-the-surds",
  ["Counting the surds", "数一数不尽根数"],
  [
    [
      "A surd is a root that cannot be written as a fraction. Roots of perfect squares and perfect cubes are whole numbers in disguise: $\\sqrt{49} = 7$ and $\\sqrt[3]{27} = 3$. So simplify each root before you count it.",
      "不能写成分数的根式叫作不尽根数。完全平方数和完全立方数的根其实是整数：$\\sqrt{49} = 7$，$\\sqrt[3]{27} = 3$。所以先化简每个根式，再计数。",
    ],
    ["$7^{2} = 49$ and $3^{3} = 27$, so neither of them is a surd.", "$7^{2} = 49$，$3^{3} = 27$，所以它们都不是不尽根数。"],
    [
      "Match the test to the root. $\\sqrt[3]{25}$ is a surd, even though $25$ is a perfect square.",
      "判断要看根指数。$\\sqrt[3]{25}$ 是不尽根数，尽管 $25$ 是完全平方数。",
    ],
  ],
  (rng) => {
    const draw = () => {
      const kind = rng.int(0, 3);
      if (kind === 0) {
        const r = rng.int(2, 15);
        return { latex: `\\sqrt{${r ** 2}}`, value: r };
      }
      if (kind === 1) {
        const r = rng.int(2, 6);
        return { latex: `\\sqrt[3]{${r ** 3}}`, value: r };
      }
      if (kind === 2) return { latex: `\\sqrt{${rng.pick([2, 3, 5, 6, 7, 10, 11, 13, 15, 17])}}` };
      return { latex: `\\sqrt[3]{${rng.pick([2, 3, 4, 5, 6, 7, 9, 10, 15, 25])}}` };
    };
    const size = rng.int(4, 6);
    const items: { latex: string; value?: number }[] = [];
    while (items.length < size) {
      const item = draw();
      if (!items.some((x) => x.latex === item.latex)) items.push(item);
    }
    const exact = items.filter((x) => x.value !== undefined);
    const surds = items.filter((x) => x.value === undefined).map((x) => x.latex);
    const count = surds.length;
    const list = items.map((x) => x.latex).join(",\\quad ");
    return valued(
      [`How many of these are surds? $$${list}$$`, `其中有几个不尽根数？$$${list}$$`],
      count,
      [
        exact.length === 0
          ? [
              ["Find the exact roots", "找出能开尽的根式"],
              ["None of them come out exact.", "没有一个能开尽。"],
            ]
          : [
              ["Find the exact roots", "找出能开尽的根式"],
              ["These are roots of perfect squares or perfect cubes:", "这些是完全平方数或完全立方数的根："],
              exact.map((x) => `${x.latex} = ${x.value}`),
            ],
        count === 0
          ? [
              ["Count the rest", "数剩下的"],
              ["Nothing is left, so there are no surds.", "没有剩下的，所以一个不尽根数也没有。"],
            ]
          : [
              ["Count the rest", "数剩下的"],
              [`The others are surds. There ${count === 1 ? "is" : "are"} $${count}$:`, `其余的是不尽根数，共 $${count}$ 个：`],
              [surds.join(",\\;")],
            ],
      ],
      [
        `Every root is counted once: $${exact.length}$ exact and $${count}$ surds make $${size}$.`,
        `每个根式都只数一次：$${exact.length}$ 个能开尽，$${count}$ 个不尽根数，共 $${size}$ 个。`,
      ],
      [
        [size, "That counts every root; some of them come out exact.", "这是把每个根式都算上了；有些能开尽。"],
        [size - count, "That counts the exact roots instead of the surds.", "这是数了能开尽的根式，而不是不尽根数。"],
        [count + 1, "That counts one exact root as a surd.", "这是把一个能开尽的根式算成了不尽根数。"],
      ],
    );
  },
  lineFigure(
    {
      lo: 6,
      hi: 8,
      step: 0.5,
      labels: [6, 7, 8],
      marks: [
        { at: 7, text: "√49" },
        { at: Math.sqrt(55), text: "√55", result: true },
      ],
    },
    [
      "A number line from 6 to 8: √49 lands on 7, while √55 falls between 7 and 8.",
      "一条从 6 到 8 的数轴：√49 正好落在 7 上，而 √55 落在 7 和 8 之间。",
    ],
  ),
);
