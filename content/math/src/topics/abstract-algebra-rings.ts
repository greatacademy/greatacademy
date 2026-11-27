import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly } from "@ga/subject-math";

import { numberProblem, why } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { divisors, gcd, lcm, mod, modInverse, phi, texChoice } from "./abstract-algebra-common.ts";
import { type Mat2, mat2Tex } from "./abstract-algebra-groups.ts";
import { apart, because, type Decision, decide } from "./abstract-algebra-quotients.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";
import { range } from "./methods-of-proof-common.ts";

// Abstract Algebra unit 8, part 1: rings, integral domains, fields, ideals and ring homomorphisms.

/** zTex writes ℤₙ. */
const zTex = (n: number) => `\\mathbb{Z}_{${n}}`;

/** primesOf lists the distinct primes dividing n. */
const primesOf = (n: number) => range(2, n).filter((p) => n % p === 0 && range(2, p - 1).every((d) => p % d !== 0));

/** isPrime reports whether n is prime. */
const isPrime = (n: number) => n > 1 && primesOf(n).length === 1 && primesOf(n)[0] === n;

/** isSquare reports whether n is a perfect square. */
const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));

/** nonSquare is a random integer in [2, 15] that is not a perfect square. */
function nonSquare(rng: Rng): number {
  let k: number;
  do k = rng.int(2, 15);
  while (isSquare(k));
  return k;
}

/** surdTex writes a + b√k. */
function surdTex(a: number, b: number, k: number): string {
  const root = `\\sqrt{${k}}`;
  if (b === 0) return `${a}`;
  const bPart = b === 1 ? root : b === -1 ? `-${root}` : `${b}${root}`;
  if (a === 0) return bPart;
  return b < 0 ? `${a} - ${b === -1 ? root : `${-b}${root}`}` : `${a} + ${bPart}`;
}

/** sumTex writes a + b, folding a negative b into a subtraction. */
const sumTex = (a: number, b: number) => (b < 0 ? `${a} - ${-b}` : `${a} + ${b}`);

/** introductionToRings recognizes rings and multiplies in ℤ[√k]. */
export const introductionToRings: TopicDef = {
  id: "introduction-to-rings",
  title: t("Introduction to Rings", "环的介绍"),
  summary: t(
    "A ring is a set R with two operations, + and ·, such that (R, +) is an abelian group, multiplication is associative, and the distributive laws a(b + c) = ab + ac and (b + c)a = ba + ca hold. Examples are ℤ, ℚ, ℝ, ℂ, ℤₙ, nℤ, the n × n matrices over a ring, and ℤ[√k] = {a + b√k : a, b ∈ ℤ}.",
    "环是带有两种运算 + 与 · 的集合 R，满足：(R, +) 是阿贝尔群，乘法满足结合律，且分配律 a(b + c) = ab + ac 与 (b + c)a = ba + ca 成立。例子有 ℤ、ℚ、ℝ、ℂ、ℤₙ、nℤ、环上的 n × n 矩阵，以及 ℤ[√k] = {a + b√k : a, b ∈ ℤ}。",
  ),
  intro: t(
    "In $\\mathbb{Z}[\\sqrt 3]$, $(1 + \\sqrt 3)(2 - \\sqrt 3) = 2 - \\sqrt 3 + 2\\sqrt 3 - 3 = -1 + \\sqrt 3$, again of the form $a + b\\sqrt 3$ with integers $a$ and $b$.\n\nCheck: the norms multiply: $(1 - 3)(4 - 3) = -2$, and $(-1)^2 - 3(1)^2 = -2$.\n\nIn this lesson we decide which sets are rings and multiply in $\\mathbb{Z}[\\sqrt k]$.",
    "在 $\\mathbb{Z}[\\sqrt 3]$ 中，$(1 + \\sqrt 3)(2 - \\sqrt 3) = 2 - \\sqrt 3 + 2\\sqrt 3 - 3 = -1 + \\sqrt 3$，仍是 $a + b\\sqrt 3$（$a$、$b$ 为整数）的形式。\n\n检验：范数相乘：$(1 - 3)(4 - 3) = -2$，而 $(-1)^2 - 3(1)^2 = -2$。\n\n本课我们判断哪些集合是环，并在 $\\mathbb{Z}[\\sqrt k]$ 中做乘法。",
  ),
  prerequisites: ["abelian-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-rings",
      title: t("Recognizing rings", "识别环"),
      explanation: t(
        "$3\\mathbb{Z}$ is a ring under the usual operations: it is an additive group, closed under multiplication. The positive integers are not: they have no additive inverses. The odd integers are not: $1 + 1 = 2$ is even.\n\nThe $3 \\times 3$ matrices with entries in $100\\mathbb{Z}$ form a ring: sums and differences stay in $100\\mathbb{Z}$ entry by entry, and each entry of a product is a sum of products of multiples of $100$.\n\nCheck: the ring laws, associativity and distributivity, already hold for all integer matrices, so they hold for these.\n\n> **Watch out.** An additive group is not enough: the set must also be closed under multiplication. $\\{a + b\\sqrt[3]{2} : a, b \\in \\mathbb{Z}\\}$ is an additive group, but $\\sqrt[3]{2} \\cdot \\sqrt[3]{2} = \\sqrt[3]{4}$ falls outside it. A ring need not contain $1$.",
        "$3\\mathbb{Z}$ 在通常运算下是环：它是加法群，且对乘法封闭。正整数集不是：没有加法逆元。奇数集不是：$1 + 1 = 2$ 是偶数。\n\n元素都在 $100\\mathbb{Z}$ 中的 $3 \\times 3$ 矩阵构成环：和与差逐个元素仍在 $100\\mathbb{Z}$ 中，乘积的每个元素都是 $100$ 的倍数之积的和。\n\n检验：环的运算律（结合律与分配律）对所有整数矩阵都成立，所以对这些矩阵也成立。\n\n> **注意。** 只是加法群还不够：集合还必须对乘法封闭。$\\{a + b\\sqrt[3]{2} : a, b \\in \\mathbb{Z}\\}$ 是加法群，但 $\\sqrt[3]{2} \\cdot \\sqrt[3]{2} = \\sqrt[3]{4}$ 不在其中。环不必含 $1$。",
      ),
      generate(rng) {
        const n = rng.int(2, 12);
        const k = nonSquare(rng);
        // 8 is a cube, so the cube-root set is ℤ itself.
        const cube = k === 8;
        const facts: Decision[] = [
          {
            prompt: t(
              `Is $${n}\\mathbb{Z}$ a ring under the usual addition and multiplication?`,
              `$${n}\\mathbb{Z}$ 在通常的加法和乘法下是环吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Check subtraction", "检查减法"],
                t(
                  `$${n}a - ${n}b = ${n}(a - b)$, so $${n}\\mathbb{Z}$ is an additive subgroup of $\\mathbb{Z}$.`,
                  `$${n}a - ${n}b = ${n}(a - b)$，所以 $${n}\\mathbb{Z}$ 是 $\\mathbb{Z}$ 的加法子群。`,
                ),
              ],
              [
                ["Check multiplication", "检查乘法"],
                t(
                  `$(${n}a)(${n}b) = ${n}(${n}ab)$, and the ring laws hold because they hold in $\\mathbb{Z}$: yes, it is a ring.`,
                  `$(${n}a)(${n}b) = ${n}(${n}ab)$，环的运算律在 $\\mathbb{Z}$ 中成立，因而在其中成立：是环。`,
                ),
              ],
            ],
            check: t(
              `$${n} \\cdot ${n} = ${n * n}$ and $${n} - ${2 * n} = -${n}$ are both multiples of $${n}$.`,
              `$${n} \\cdot ${n} = ${n * n}$ 与 $${n} - ${2 * n} = -${n}$ 都是 $${n}$ 的倍数。`,
            ),
            wrong: t("It is closed under subtraction and multiplication, so it is a ring.", "它对减法和乘法都封闭，所以是环。"),
          },
          {
            prompt: t(
              `Is $\\{x \\in \\mathbb{Z} : x \\ge ${n}\\}$ a ring under the usual operations?`,
              `$\\{x \\in \\mathbb{Z} : x \\ge ${n}\\}$ 在通常运算下是环吗？`,
            ),
            holds: false,
            steps: [
              [["Look for zero", "找零元"], t(`$0 < ${n}$, so $0$ is not in the set.`, `$0 < ${n}$，所以 $0$ 不在该集合中。`)],
              [
                ["Decide", "作出判断"],
                t(
                  "Without an additive identity it is not an additive group: no, it is not a ring.",
                  "没有加法单位元，它就不是加法群：不是环。",
                ),
              ],
            ],
            check: t(
              `$${n} - ${n + 1} = -1$ is not in the set either, so it is not closed under subtraction.`,
              `$${n} - ${n + 1} = -1$ 也不在该集合中，所以它对减法不封闭。`,
            ),
            wrong: t("It contains no $0$ and no additive inverses.", "它不含 $0$，也没有加法逆元。"),
          },
          {
            prompt: t(
              `Is $\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Z}\\}$ a ring under the usual operations?`,
              `$\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Z}\\}$ 在通常运算下是环吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Check subtraction", "检查减法"],
                t(
                  `$(a + b\\sqrt{${k}}) - (c + d\\sqrt{${k}}) = (a - c) + (b - d)\\sqrt{${k}}$.`,
                  `$(a + b\\sqrt{${k}}) - (c + d\\sqrt{${k}}) = (a - c) + (b - d)\\sqrt{${k}}$。`,
                ),
              ],
              [
                ["Check multiplication", "检查乘法"],
                t(
                  `$(a + b\\sqrt{${k}})(c + d\\sqrt{${k}}) = (ac + ${k}bd) + (ad + bc)\\sqrt{${k}}$, again of the same form: yes, it is a ring.`,
                  `$(a + b\\sqrt{${k}})(c + d\\sqrt{${k}}) = (ac + ${k}bd) + (ad + bc)\\sqrt{${k}}$，形式不变：是环。`,
                ),
              ],
            ],
            check: t(
              `$\\sqrt{${k}} \\cdot \\sqrt{${k}} = ${k} = ${k} + 0\\sqrt{${k}}$ stays in the set.`,
              `$\\sqrt{${k}} \\cdot \\sqrt{${k}} = ${k} = ${k} + 0\\sqrt{${k}}$ 仍在集合中。`,
            ),
            wrong: t(
              `Differences and products stay of the form $a + b\\sqrt{${k}}$, because $\\sqrt{${k}}^2 = ${k}$ is an integer.`,
              `差与积仍是 $a + b\\sqrt{${k}}$ 的形式，因为 $\\sqrt{${k}}^2 = ${k}$ 是整数。`,
            ),
          },
          cube
            ? {
                prompt: t(
                  `Is $\\{a + b\\sqrt[3]{${k}} : a, b \\in \\mathbb{Z}\\}$ a ring under the usual operations?`,
                  `$\\{a + b\\sqrt[3]{${k}} : a, b \\in \\mathbb{Z}\\}$ 在通常运算下是环吗？`,
                ),
                holds: true,
                steps: [
                  [
                    ["Simplify the root", "化简根式"],
                    t(`$\\sqrt[3]{${k}} = 2$, so the set is $\\{a + 2b\\}$.`, `$\\sqrt[3]{${k}} = 2$，所以该集合就是 $\\{a + 2b\\}$。`),
                  ],
                  [
                    ["Decide", "作出判断"],
                    t(
                      "Taking $b = 0$ gives every integer, so the set is $\\mathbb{Z}$: yes, it is a ring.",
                      "取 $b = 0$ 就得到每个整数，所以该集合就是 $\\mathbb{Z}$：是环。",
                    ),
                  ],
                ],
                check: t(
                  `$\\sqrt[3]{${k}} \\cdot \\sqrt[3]{${k}} = 4 = 4 + 0\\sqrt[3]{${k}}$ stays in the set.`,
                  `$\\sqrt[3]{${k}} \\cdot \\sqrt[3]{${k}} = 4 = 4 + 0\\sqrt[3]{${k}}$ 仍在集合中。`,
                ),
                wrong: t(
                  `$\\sqrt[3]{${k}} = 2$ is an integer, so the set is all of $\\mathbb{Z}$.`,
                  `$\\sqrt[3]{${k}} = 2$ 是整数，所以该集合就是整个 $\\mathbb{Z}$。`,
                ),
              }
            : {
                prompt: t(
                  `Is $\\{a + b\\sqrt[3]{${k}} : a, b \\in \\mathbb{Z}\\}$ a ring under the usual operations?`,
                  `$\\{a + b\\sqrt[3]{${k}} : a, b \\in \\mathbb{Z}\\}$ 在通常运算下是环吗？`,
                ),
                holds: false,
                steps: [
                  [
                    ["Multiply two elements", "把两个元素相乘"],
                    t(
                      `$\\sqrt[3]{${k}} \\cdot \\sqrt[3]{${k}} = \\sqrt[3]{${k * k}}$.`,
                      `$\\sqrt[3]{${k}} \\cdot \\sqrt[3]{${k}} = \\sqrt[3]{${k * k}}$。`,
                    ),
                  ],
                  [
                    ["Decide", "作出判断"],
                    t(
                      `$\\sqrt[3]{${k * k}}$ is not of the form $a + b\\sqrt[3]{${k}}$, so the set is not closed under multiplication: no, it is not a ring.`,
                      `$\\sqrt[3]{${k * k}}$ 不具有 $a + b\\sqrt[3]{${k}}$ 的形式，所以集合对乘法不封闭：不是环。`,
                    ),
                  ],
                ],
                check: t(
                  `$x^3 - ${k}$ has no rational root, so $\\sqrt[3]{${k}}$ satisfies no equation of degree $2$ over $\\mathbb{Q}$; but $\\sqrt[3]{${k * k}} = a + b\\sqrt[3]{${k}}$ would square to such an equation.`,
                  `$x^3 - ${k}$ 没有有理根，所以 $\\sqrt[3]{${k}}$ 不满足任何有理系数的二次方程；而若 $\\sqrt[3]{${k * k}} = a + b\\sqrt[3]{${k}}$，就会得到这样的方程。`,
                ),
                wrong: t(
                  `It is an additive group, but $\\sqrt[3]{${k}} \\cdot \\sqrt[3]{${k}} = \\sqrt[3]{${k * k}}$ falls outside it.`,
                  `它是加法群，但 $\\sqrt[3]{${k}} \\cdot \\sqrt[3]{${k}} = \\sqrt[3]{${k * k}}$ 不在其中。`,
                ),
              },
          {
            prompt: t(
              `Is the set of $${n} \\times ${n}$ matrices with integer entries a ring under matrix addition and multiplication?`,
              `整数元素的 $${n} \\times ${n}$ 矩阵在矩阵加法和乘法下是环吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Check addition", "检查加法"],
                t(
                  "Matrices add entry by entry, so they form an abelian group under addition.",
                  "矩阵逐个元素相加，所以在加法下构成阿贝尔群。",
                ),
              ],
              [
                ["Check multiplication", "检查乘法"],
                t(
                  "A product of integer matrices has integer entries, matrix multiplication is associative, and it distributes over addition: yes, it is a ring.",
                  "整数矩阵之积的元素仍是整数，矩阵乘法满足结合律，且对加法满足分配律：是环。",
                ),
              ],
            ],
            check: t(
              "$(A + B)C = AC + BC$ holds entry by entry, since each entry of a product is a sum of products of entries.",
              "$(A + B)C = AC + BC$ 逐个元素成立，因为乘积的每个元素都是元素之积的和。",
            ),
            wrong: t(
              "Matrix multiplication is associative and distributes over addition, so the ring laws hold.",
              "矩阵乘法满足结合律，且对加法满足分配律，所以环的运算律成立。",
            ),
          },
          {
            prompt: t(
              `Is $\\{x \\in \\mathbb{Z} : x \\equiv 1 \\pmod{${n}}\\}$ a ring under the usual operations?`,
              `$\\{x \\in \\mathbb{Z} : x \\equiv 1 \\pmod{${n}}\\}$ 在通常运算下是环吗？`,
            ),
            holds: false,
            steps: [
              [["Add two elements", "把两个元素相加"], t("$1$ is in the set, and $1 + 1 = 2$.", "$1$ 在该集合中，而 $1 + 1 = 2$。")],
              [
                ["Decide", "作出判断"],
                t(
                  `$2 \\not\\equiv 1 \\pmod{${n}}$, so the set is not closed under addition: no, it is not a ring.`,
                  `$2 \\not\\equiv 1 \\pmod{${n}}$，所以集合对加法不封闭：不是环。`,
                ),
              ],
            ],
            check: t(
              `The set does not contain $0$ either, since $0 \\not\\equiv 1 \\pmod{${n}}$.`,
              `该集合也不含 $0$，因为 $0 \\not\\equiv 1 \\pmod{${n}}$。`,
            ),
            wrong: t(
              `$1 + 1 = 2 \\not\\equiv 1 \\pmod{${n}}$, so it is not closed under addition.`,
              `$1 + 1 = 2 \\not\\equiv 1 \\pmod{${n}}$，所以对加法不封闭。`,
            ),
          },
          {
            prompt: t(
              `Is $${zTex(n)}$ a ring under addition and multiplication modulo $${n}$?`,
              `$${zTex(n)}$ 在模 $${n}$ 加法和乘法下是环吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Look at the operations", "看运算"],
                t(
                  `Adding or multiplying and then reducing modulo $${n}$ keeps the result in $${zTex(n)}$.`,
                  `相加或相乘后再模 $${n}$ 约化，结果仍在 $${zTex(n)}$ 中。`,
                ),
              ],
              [
                ["Inherit the laws", "继承运算律"],
                t(
                  "The operations come from $\\mathbb{Z}$, and reduction respects them, so all ring laws hold: yes, it is a ring.",
                  "运算来自 $\\mathbb{Z}$，而约化与它们相容，所以环的运算律都成立：是环。",
                ),
              ],
            ],
            check: t(
              `$(${n - 1})(${n - 1}) = ${(n - 1) ** 2} \\equiv 1 \\pmod{${n}}$ is again an element of $${zTex(n)}$.`,
              `$(${n - 1})(${n - 1}) = ${(n - 1) ** 2} \\equiv 1 \\pmod{${n}}$ 仍是 $${zTex(n)}$ 的元素。`,
            ),
            wrong: t(
              "The operations are inherited from $\\mathbb{Z}$, so all ring laws hold.",
              "运算继承自 $\\mathbb{Z}$，所以环的运算律都成立。",
            ),
          },
        ];
        return decide(rng.pick(facts));
      },
    },
    {
      id: "multiplying-in-quadratic-integer-rings",
      title: t("Multiplying in $\\mathbb{Z}[\\sqrt{k}]$", "在 $\\mathbb{Z}[\\sqrt{k}]$ 中做乘法"),
      explanation: t(
        "Multiply as with binomials, then replace the square of the root by the integer it stands for. $(2 + 3\\sqrt{5})(1 - \\sqrt{5}) = 2 - 2\\sqrt{5} + 3\\sqrt{5} - 15 = -13 + \\sqrt{5}$.\n\nIn $\\mathbb{Z}[\\sqrt{13}]$, $(10 + 7\\sqrt{13})(-4 + 3\\sqrt{13}) = -40 + 30\\sqrt{13} - 28\\sqrt{13} + 273 = 233 + 2\\sqrt{13}$, since $7 \\cdot 3 \\cdot 13 = 273$.\n\nCheck: the norms multiply: $(100 - 637)(16 - 117) = (-537)(-101) = 54237$, and $233^2 - 13 \\cdot 2^2 = 54289 - 52 = 54237$.\n\n> **Watch out.** $\\sqrt{k} \\cdot \\sqrt{k} = k$: the product of the two root terms is $k$ times the product of their coefficients, and it belongs to the rational part. Dropping the factor $k$ gives the wrong rational part.",
        "像二项式那样相乘，再把根号的平方换成它所代表的整数。$(2 + 3\\sqrt{5})(1 - \\sqrt{5}) = 2 - 2\\sqrt{5} + 3\\sqrt{5} - 15 = -13 + \\sqrt{5}$。\n\n在 $\\mathbb{Z}[\\sqrt{13}]$ 中，$(10 + 7\\sqrt{13})(-4 + 3\\sqrt{13}) = -40 + 30\\sqrt{13} - 28\\sqrt{13} + 273 = 233 + 2\\sqrt{13}$，因为 $7 \\cdot 3 \\cdot 13 = 273$。\n\n检验：范数相乘：$(100 - 637)(16 - 117) = (-537)(-101) = 54237$，而 $233^2 - 13 \\cdot 2^2 = 54289 - 52 = 54237$。\n\n> **注意。** $\\sqrt{k} \\cdot \\sqrt{k} = k$：两个根号项之积是它们系数之积的 $k$ 倍，属于有理部分。漏掉因子 $k$ 会使有理部分出错。",
      ),
      generate(rng) {
        const k = nonSquare(rng);
        const [a, c] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        const [b, d] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
        const x = a * c + k * b * d;
        const y = a * d + b * c;
        const askRational = rng.bool();
        const [n1, n2] = [a * a - k * b * b, c * c - k * d * d];
        const product = `(${surdTex(a, b, k)})(${surdTex(c, d, k)})`;
        return numberProblem({
          prompt: askRational
            ? t(
                `Write $(${surdTex(a, b, k)})(${surdTex(c, d, k)})$ as $x + y\\sqrt{${k}}$. Find $x$.`,
                `把 $(${surdTex(a, b, k)})(${surdTex(c, d, k)})$ 写成 $x + y\\sqrt{${k}}$。求 $x$。`,
              )
            : t(
                `Write $(${surdTex(a, b, k)})(${surdTex(c, d, k)})$ as $x + y\\sqrt{${k}}$. Find $y$.`,
                `把 $(${surdTex(a, b, k)})(${surdTex(c, d, k)})$ 写成 $x + y\\sqrt{${k}}$。求 $y$。`,
              ),
          answer: askRational ? x : y,
          mistakes: askRational
            ? [
                why(
                  a * c + b * d,
                  `That multiplies the root terms as if $\\sqrt{${k}} \\cdot \\sqrt{${k}} = 1$; it is $${k}$.`,
                  `那把根号项相乘时当成了 $\\sqrt{${k}} \\cdot \\sqrt{${k}} = 1$；它等于 $${k}$。`,
                ),
                why(
                  a * c - k * b * d,
                  `Sign slip: $\\sqrt{${k}} \\cdot \\sqrt{${k}} = +${k}$, so the root terms add $${k}bd$.`,
                  `符号错误：$\\sqrt{${k}} \\cdot \\sqrt{${k}} = +${k}$，所以根号项贡献 $+${k}bd$。`,
                ),
                why(
                  y,
                  `That is $y$, the coefficient of $\\sqrt{${k}}$; $x$ is the rational part.`,
                  `那是 $y$，即 $\\sqrt{${k}}$ 的系数；$x$ 是有理部分。`,
                ),
              ]
            : [
                why(a * d - b * c, "Sign slip: both cross terms are added, $ad + bc$.", "符号错误：两个交叉项都是相加，即 $ad + bc$。"),
                why(
                  b * d,
                  `That multiplies only the root coefficients; their product $${k}bd$ belongs to the rational part.`,
                  `那只把根号的系数相乘；它们的积 $${k}bd$ 属于有理部分。`,
                ),
                why(
                  x,
                  `That is $x$, the rational part; $y$ is the coefficient of $\\sqrt{${k}}$.`,
                  `那是 $x$，即有理部分；$y$ 是 $\\sqrt{${k}}$ 的系数。`,
                ),
              ],
          solution: walked(
            [
              [
                ["Find the rational part", "求有理部分"],
                t(
                  `$x = ac + ${k}bd = (${a})(${c}) + ${k}(${b})(${d}) = ${sumTex(a * c, k * b * d)} = ${x}$.`,
                  `$x = ac + ${k}bd = (${a})(${c}) + ${k}(${b})(${d}) = ${sumTex(a * c, k * b * d)} = ${x}$。`,
                ),
              ],
              [
                ["Find the coefficient of the root", "求根号的系数"],
                t(
                  `$y = ad + bc = (${a})(${d}) + (${b})(${c}) = ${sumTex(a * d, b * c)} = ${y}$, so $${product} = ${surdTex(x, y, k)}$.`,
                  `$y = ad + bc = (${a})(${d}) + (${b})(${c}) = ${sumTex(a * d, b * c)} = ${y}$，所以 $${product} = ${surdTex(x, y, k)}$。`,
                ),
              ],
            ],
            t(
              `The norms multiply: $(${n1})(${n2}) = ${n1 * n2}$, and $(${x})^2 - ${k}(${y})^2 = ${x * x - k * y * y}$.`,
              `范数相乘：$(${n1})(${n2}) = ${n1 * n2}$，而 $(${x})^2 - ${k}(${y})^2 = ${x * x - k * y * y}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** smallMatrix is a random 2 × 2 integer matrix with entries in [−3, 3]. */
const smallMatrix = (rng: Rng): Mat2 => [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];

/** mulMat multiplies 2 × 2 matrices. */
const mulMat = (x: Mat2, y: Mat2): Mat2 => [
  x[0] * y[0] + x[1] * y[2],
  x[0] * y[1] + x[1] * y[3],
  x[2] * y[0] + x[3] * y[2],
  x[2] * y[1] + x[3] * y[3],
];

/** commutativeRings decides which rings are commutative and measures noncommutativity of matrices. */
export const commutativeRings: TopicDef = {
  id: "commutative-rings",
  title: t("Commutative Rings", "交换环"),
  summary: t(
    "A ring is commutative if ab = ba for all a and b. ℤ, ℚ, ℤₙ, polynomial rings and direct products of commutative rings are commutative; rings of n × n matrices with n ≥ 2 are not.",
    "若对所有 a、b 有 ab = ba，则称环是交换环。ℤ、ℚ、ℤₙ、多项式环以及交换环的直积都是交换环；n ≥ 2 时的 n × n 矩阵环不是。",
  ),
  intro: t(
    "In the ring of $2 \\times 2$ matrices, $A = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$ and $B = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}$ give $AB = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$ but $BA = \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}$, so the ring is not commutative.\n\nCheck: $AB - BA = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$ is not zero, and its diagonal entries add up to $0$, as they do for every commutator.\n\nIn this lesson we decide which rings are commutative and compute commutators of matrices.",
    "在 $2 \\times 2$ 矩阵环中，$A = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$ 与 $B = \\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}$ 给出 $AB = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$，而 $BA = \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}$，所以这个环不是交换环。\n\n检验：$AB - BA = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$ 不是零矩阵，且它的对角元之和为 $0$，每个交换子都是如此。\n\n本课我们判断哪些环是交换环，并计算矩阵的交换子。",
  ),
  prerequisites: ["introduction-to-rings"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-commutative-rings",
      title: t("Recognizing commutative rings", "识别交换环"),
      explanation: t(
        "$\\mathbb{Z}_4 \\times \\mathbb{Z}$ is commutative, since multiplication is done in each coordinate. The ring of $2 \\times 2$ real matrices is not.\n\nIn $\\mathbb{Z}_{1000} \\times \\mathbb{Q}[x]$, $(7, x)(3, x + 1) = (21, x^2 + x) = (3, x + 1)(7, x)$: each coordinate ring is commutative, so the product ring is.\n\nCheck: $7 \\cdot 3 = 3 \\cdot 7$ in $\\mathbb{Z}_{1000}$, and $x(x + 1) = (x + 1)x$ in $\\mathbb{Q}[x]$.\n\n> **Watch out.** One pair that fails to commute is enough to show a ring is not commutative, but one pair that commutes proves nothing: every matrix commutes with $I$, yet $E_{12}E_{21} = E_{11}$ while $E_{21}E_{12} = E_{22}$.",
        "$\\mathbb{Z}_4 \\times \\mathbb{Z}$ 是交换环，因为乘法按坐标进行。$2 \\times 2$ 实矩阵环不是。\n\n在 $\\mathbb{Z}_{1000} \\times \\mathbb{Q}[x]$ 中，$(7, x)(3, x + 1) = (21, x^2 + x) = (3, x + 1)(7, x)$：每个坐标环都是交换的，所以直积环也是。\n\n检验：在 $\\mathbb{Z}_{1000}$ 中 $7 \\cdot 3 = 3 \\cdot 7$，在 $\\mathbb{Q}[x]$ 中 $x(x + 1) = (x + 1)x$。\n\n> **注意。** 只要有一对元素不可交换，就足以说明环不是交换环；但一对可交换的元素什么也证明不了：每个矩阵都与 $I$ 可交换，然而 $E_{12}E_{21} = E_{11}$，$E_{21}E_{12} = E_{22}$。",
      ),
      generate(rng) {
        const m = rng.int(2, 12);
        const n = rng.int(2, 4);
        const k = nonSquare(rng);
        const facts: Decision[] = [
          {
            prompt: t(`Is $${zTex(m)} \\times \\mathbb{Z}$ a commutative ring?`, `$${zTex(m)} \\times \\mathbb{Z}$ 是交换环吗？`),
            holds: true,
            steps: [
              [
                ["Multiply in coordinates", "按坐标相乘"],
                t("$(a, b)(c, d) = (ac, bd)$ and $(c, d)(a, b) = (ca, db)$.", "$(a, b)(c, d) = (ac, bd)$，$(c, d)(a, b) = (ca, db)$。"),
              ],
              [
                ["Compare", "比较"],
                t(
                  `$ac = ca$ in $${zTex(m)}$ and $bd = db$ in $\\mathbb{Z}$, so the two products agree: yes, it is commutative.`,
                  `在 $${zTex(m)}$ 中 $ac = ca$，在 $\\mathbb{Z}$ 中 $bd = db$，所以两个乘积相等：是交换环。`,
                ),
              ],
            ],
            check: t(
              `$(2, 3)(${m - 1}, 5)$ and $(${m - 1}, 5)(2, 3)$ both equal $(${mod(2 * (m - 1), m)}, 15)$.`,
              `$(2, 3)(${m - 1}, 5)$ 与 $(${m - 1}, 5)(2, 3)$ 都等于 $(${mod(2 * (m - 1), m)}, 15)$。`,
            ),
            wrong: t(
              "Multiplication is coordinatewise, and each coordinate ring is commutative.",
              "乘法按坐标进行，而每个坐标环都是交换的。",
            ),
          },
          {
            prompt: t(
              `Is the ring of $${n} \\times ${n}$ matrices over $${zTex(m)}$ commutative?`,
              `$${zTex(m)}$ 上的 $${n} \\times ${n}$ 矩阵环是交换环吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Take two matrix units", "取两个矩阵单位"],
                t(
                  "Let $E_{12}$ and $E_{21}$ have a single entry $1$, in row $1$, column $2$ and in row $2$, column $1$.",
                  "设 $E_{12}$ 与 $E_{21}$ 各只有一个元素为 $1$，分别位于第 $1$ 行第 $2$ 列与第 $2$ 行第 $1$ 列。",
                ),
              ],
              [
                ["Compare the products", "比较乘积"],
                t(
                  "$E_{12}E_{21} = E_{11}$ but $E_{21}E_{12} = E_{22}$: no, it is not commutative.",
                  "$E_{12}E_{21} = E_{11}$，而 $E_{21}E_{12} = E_{22}$：不是交换环。",
                ),
              ],
            ],
            check: t(
              `$E_{12}E_{21} - E_{21}E_{12} = E_{11} - E_{22}$ has diagonal entries $1$ and $-1$, not zero in $${zTex(m)}$.`,
              `$E_{12}E_{21} - E_{21}E_{12} = E_{11} - E_{22}$ 的对角元为 $1$ 与 $-1$，在 $${zTex(m)}$ 中不为零。`,
            ),
            wrong: t(
              "Matrix units such as $E_{12}E_{21} = E_{11}$ and $E_{21}E_{12} = E_{22}$ do not commute.",
              "矩阵单位如 $E_{12}E_{21} = E_{11}$ 与 $E_{21}E_{12} = E_{22}$ 不可交换。",
            ),
          },
          {
            prompt: t(`Is $\\mathbb{Z}[\\sqrt{${k}}]$ a commutative ring?`, `$\\mathbb{Z}[\\sqrt{${k}}]$ 是交换环吗？`),
            holds: true,
            steps: [
              [
                ["Multiply two elements", "把两个元素相乘"],
                t(
                  `$(a + b\\sqrt{${k}})(c + d\\sqrt{${k}}) = (ac + ${k}bd) + (ad + bc)\\sqrt{${k}}$.`,
                  `$(a + b\\sqrt{${k}})(c + d\\sqrt{${k}}) = (ac + ${k}bd) + (ad + bc)\\sqrt{${k}}$。`,
                ),
              ],
              [
                ["Swap the factors", "交换因子"],
                t(
                  `Swapping $a, b$ with $c, d$ gives $(ca + ${k}db) + (cb + da)\\sqrt{${k}}$, the same: yes, it is commutative.`,
                  `把 $a, b$ 与 $c, d$ 互换得 $(ca + ${k}db) + (cb + da)\\sqrt{${k}}$，结果相同：是交换环。`,
                ),
              ],
            ],
            check: t(
              "It is a subring of $\\mathbb{R}$, where multiplication is commutative.",
              "它是 $\\mathbb{R}$ 的子环，而 $\\mathbb{R}$ 中乘法可交换。",
            ),
            wrong: t("It is a subring of $\\mathbb{R}$, which is commutative.", "它是 $\\mathbb{R}$ 的子环，而 $\\mathbb{R}$ 是交换的。"),
          },
          {
            prompt: t(
              `Is the ring of upper triangular $${n} \\times ${n}$ real matrices commutative?`,
              `$${n} \\times ${n}$ 上三角实矩阵环是交换环吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Take two upper triangular matrices", "取两个上三角矩阵"],
                t("$E_{11}$ and $E_{12}$ are both upper triangular.", "$E_{11}$ 与 $E_{12}$ 都是上三角矩阵。"),
              ],
              [
                ["Compare the products", "比较乘积"],
                t(
                  "$E_{11}E_{12} = E_{12}$ but $E_{12}E_{11} = 0$: no, it is not commutative.",
                  "$E_{11}E_{12} = E_{12}$，而 $E_{12}E_{11} = 0$：不是交换环。",
                ),
              ],
            ],
            check: t(
              "In the top left corner: $\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$, while the other order gives the zero matrix.",
              "看左上角：$\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}$，而另一种顺序得到零矩阵。",
            ),
            wrong: t("$E_{11}E_{12} = E_{12}$ but $E_{12}E_{11} = 0$.", "$E_{11}E_{12} = E_{12}$，而 $E_{12}E_{11} = 0$。"),
          },
          {
            prompt: t(
              `Is the ring of polynomials with coefficients in $${zTex(m)}$ commutative?`,
              `系数在 $${zTex(m)}$ 中的多项式环是交换环吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Write a coefficient of the product", "写出乘积的系数"],
                t("The coefficient of $x^j$ in $fg$ is $\\sum_{i} a_i b_{j - i}$.", "$fg$ 中 $x^j$ 的系数为 $\\sum_{i} a_i b_{j - i}$。"),
              ],
              [
                ["Swap the factors", "交换因子"],
                t(
                  `In $gf$ it is $\\sum_{i} b_{j - i} a_i$, the same sum since $${zTex(m)}$ is commutative: yes, it is commutative.`,
                  `在 $gf$ 中它是 $\\sum_{i} b_{j - i} a_i$，由于 $${zTex(m)}$ 可交换，两个和相同：是交换环。`,
                ),
              ],
            ],
            check: t(
              `$(x + 2)(x + 3)$ and $(x + 3)(x + 2)$ both give $x^2 + 5x + 6$ before reducing modulo $${m}$.`,
              `$(x + 2)(x + 3)$ 与 $(x + 3)(x + 2)$ 在模 $${m}$ 约化前都得 $x^2 + 5x + 6$。`,
            ),
            wrong: t("Polynomial multiplication over a commutative ring is commutative.", "交换环上的多项式乘法是交换的。"),
          },
          {
            prompt: t(
              `Is the ring of $${n} \\times ${n}$ diagonal matrices over $\\mathbb{Z}$ commutative?`,
              `$\\mathbb{Z}$ 上 $${n} \\times ${n}$ 对角矩阵环是交换环吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Multiply diagonal matrices", "把对角矩阵相乘"],
                t(
                  "The product of two diagonal matrices is diagonal, with the products $a_i b_i$ of the diagonal entries.",
                  "两个对角矩阵之积仍是对角矩阵，对角元为对角元之积 $a_i b_i$。",
                ),
              ],
              [
                ["Compare", "比较"],
                t(
                  "$a_i b_i = b_i a_i$ in $\\mathbb{Z}$, so the order does not matter: yes, it is commutative.",
                  "在 $\\mathbb{Z}$ 中 $a_i b_i = b_i a_i$，所以顺序无关：是交换环。",
                ),
              ],
            ],
            check: t(
              "$\\operatorname{diag}(2, 3)\\operatorname{diag}(5, 7) = \\operatorname{diag}(10, 21)$ in either order.",
              "$\\operatorname{diag}(2, 3)\\operatorname{diag}(5, 7) = \\operatorname{diag}(10, 21)$，两种顺序都一样。",
            ),
            wrong: t("Diagonal matrices multiply entry by entry along the diagonal.", "对角矩阵沿对角线逐项相乘。"),
          },
        ];
        return decide(rng.pick(facts));
      },
    },
    {
      id: "commutators-of-matrices",
      title: t("Commutators of matrices", "矩阵的交换子"),
      explanation: t(
        "The commutator $AB - BA$ measures how far two matrices are from commuting, and it is the zero matrix exactly when they commute. With $A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ and $B = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$: $AB = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ and $BA = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$, so $AB - BA = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$.\n\nWith $A = \\begin{pmatrix} 20 & 0 \\\\ 0 & 50 \\end{pmatrix}$ and $B = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$: $AB = \\begin{pmatrix} 0 & 20 \\\\ 50 & 0 \\end{pmatrix}$ and $BA = \\begin{pmatrix} 0 & 50 \\\\ 20 & 0 \\end{pmatrix}$, so $AB - BA = \\begin{pmatrix} 0 & -30 \\\\ 30 & 0 \\end{pmatrix}$.\n\nCheck: the diagonal entries of a commutator always add up to $0$: here $0$ and $0$, and above $1$ and $-1$.\n\n> **Watch out.** The order matters: $BA - AB$ is the negative of $AB - BA$. And each entry of a product is a row times a column, not the product of the entries in the same place.",
        "交换子 $AB - BA$ 衡量两个矩阵离可交换有多远，当且仅当它们可交换时，它是零矩阵。设 $A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$，$B = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$：$AB = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$，$BA = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$，所以 $AB - BA = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$。\n\n设 $A = \\begin{pmatrix} 20 & 0 \\\\ 0 & 50 \\end{pmatrix}$，$B = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$：$AB = \\begin{pmatrix} 0 & 20 \\\\ 50 & 0 \\end{pmatrix}$，$BA = \\begin{pmatrix} 0 & 50 \\\\ 20 & 0 \\end{pmatrix}$，所以 $AB - BA = \\begin{pmatrix} 0 & -30 \\\\ 30 & 0 \\end{pmatrix}$。\n\n检验：交换子的对角元之和总是 $0$：这里是 $0$ 与 $0$，上例是 $1$ 与 $-1$。\n\n> **注意。** 顺序很重要：$BA - AB$ 是 $AB - BA$ 的相反数。而且乘积的每个元素是行乘以列，不是同一位置的元素相乘。",
      ),
      generate(rng) {
        let a: Mat2;
        let b: Mat2;
        let c: Mat2;
        do {
          a = smallMatrix(rng);
          b = smallMatrix(rng);
          const ab = mulMat(a, b);
          const ba = mulMat(b, a);
          c = [ab[0] - ba[0], ab[1] - ba[1], ab[2] - ba[2], ab[3] - ba[3]];
        } while (c.every((x) => x === 0));
        const neg = c.map((x) => -x) as unknown as Mat2;
        return reasoned(
          texChoice(
            rng,
            t(
              `Let $A = ${mat2Tex(a)}$ and $B = ${mat2Tex(b)}$. Find $AB - BA$.`,
              `设 $A = ${mat2Tex(a)}$，$B = ${mat2Tex(b)}$。求 $AB - BA$。`,
            ),
            mat2Tex(c),
            [mat2Tex(neg), mat2Tex([c[0], c[2], c[1], c[3]]), mat2Tex([0, 0, 0, 0]), mat2Tex([c[3], c[1], c[2], c[0]])],
            walked(
              [
                [["Multiply in the order AB", "按原顺序相乘"], t(`$AB = ${mat2Tex(mulMat(a, b))}$.`, `$AB = ${mat2Tex(mulMat(a, b))}$。`)],
                [
                  ["Multiply the other way and subtract", "交换顺序相乘再相减"],
                  t(
                    `$BA = ${mat2Tex(mulMat(b, a))}$, so $AB - BA = ${mat2Tex(c)}$.`,
                    `$BA = ${mat2Tex(mulMat(b, a))}$，所以 $AB - BA = ${mat2Tex(c)}$。`,
                  ),
                ],
              ],
              t(
                `The diagonal entries $${c[0]}$ and $${c[3]}$ add up to $0$, as they do for every commutator.`,
                `对角元 $${c[0]}$ 与 $${c[3]}$ 之和为 $0$，每个交换子都是如此。`,
              ),
            ),
          ),
          [
            because(mat2Tex(neg), "That is $BA - AB$: the subtraction is in the wrong order.", "那是 $BA - AB$：减的顺序反了。"),
            because(mat2Tex([c[0], c[2], c[1], c[3]]), "That swaps the two off-diagonal entries.", "那把两个非对角元互换了。"),
            because(
              mat2Tex([0, 0, 0, 0]),
              "That would mean $A$ and $B$ commute, but $AB \\ne BA$.",
              "那意味着 $A$ 与 $B$ 可交换，但 $AB \\ne BA$。",
            ),
            because(mat2Tex([c[3], c[1], c[2], c[0]]), "That swaps the two diagonal entries.", "那把两个对角元互换了。"),
          ],
        );
      },
    },
  ],
};

/** subgroupUnity is the unity of the subring ⟨d⟩ of ℤₙ, if it has one. */
function subgroupUnity(d: number, n: number): number | undefined {
  const elems = range(0, n / d - 1).map((i) => i * d);
  return elems.find((e) => elems.every((x) => mod(e * x, n) === x));
}

/** ringsWithUnity decides which rings have a unity and finds unities of subrings of ℤₙ. */
export const ringsWithUnity: TopicDef = {
  id: "rings-with-unity",
  title: t("Rings With Unity", "含幺环"),
  summary: t(
    "A unity (or identity) of a ring is a nonzero element 1 with 1 · a = a · 1 = a for all a; it is unique if it exists. ℤ, ℤₙ and matrix rings have unities, but nℤ for n ≥ 2 does not. A subring may have a unity different from the unity of the whole ring: in ℤ₁₀, the subring {0, 2, 4, 6, 8} has unity 6.",
    "环的幺元（单位元）是非零元素 1，满足对所有 a 有 1 · a = a · 1 = a；若存在则唯一。ℤ、ℤₙ 与矩阵环都有幺元，但 n ≥ 2 时 nℤ 没有。子环的幺元可以不同于整个环的幺元：在 ℤ₁₀ 中，子环 {0, 2, 4, 6, 8} 的幺元是 6。",
  ),
  intro: t(
    "In $\\mathbb{Z}_{10}$, the subring $\\{0, 2, 4, 6, 8\\}$ has unity $6$: $6 \\cdot 2 = 12 \\equiv 2$, $6 \\cdot 4 = 24 \\equiv 4$, $6 \\cdot 6 = 36 \\equiv 6$ and $6 \\cdot 8 = 48 \\equiv 8$.\n\nCheck: $6 \\equiv 0 \\pmod 2$ and $6 \\equiv 1 \\pmod 5$, which is exactly what a unity of this subring needs.\n\nIn this lesson we decide which rings have a unity and find the unities of subrings of $\\mathbb{Z}_n$.",
    "在 $\\mathbb{Z}_{10}$ 中，子环 $\\{0, 2, 4, 6, 8\\}$ 的幺元为 $6$：$6 \\cdot 2 = 12 \\equiv 2$，$6 \\cdot 4 = 24 \\equiv 4$，$6 \\cdot 6 = 36 \\equiv 6$，$6 \\cdot 8 = 48 \\equiv 8$。\n\n检验：$6 \\equiv 0 \\pmod 2$ 且 $6 \\equiv 1 \\pmod 5$，这正是这个子环的幺元所需满足的。\n\n本课我们判断哪些环有幺元，并求 $\\mathbb{Z}_n$ 的子环的幺元。",
  ),
  prerequisites: ["commutative-rings"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-rings-with-unity",
      title: t("Recognizing unities", "识别幺元"),
      explanation: t(
        "$2\\mathbb{Z}$ has no unity: $e \\cdot 2 = 2$ forces $e = 1 \\notin 2\\mathbb{Z}$. The matrices $\\begin{pmatrix} a & 0 \\\\ 0 & 0 \\end{pmatrix}$ have unity $\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$, even though it is not the identity matrix.\n\nIn $\\mathbb{Z}_{50} \\times 7\\mathbb{Z} \\times \\mathbb{Z}$, a unity would need a unity in every coordinate, and $7\\mathbb{Z}$ has none, so the ring has no unity. Without the middle factor, $\\mathbb{Z}_{50} \\times \\mathbb{Z}$ has the unity $(1, 1)$.\n\nCheck: $(1, 1)(37, -4) = (37, -4)$, and the same in the other order.\n\n> **Watch out.** A unity must lie in the ring itself and work for every element: the integer $1$ is not a unity of $2\\mathbb{Z}$, because it is not in $2\\mathbb{Z}$. And a unity need not be $1$ or the identity matrix.",
        "$2\\mathbb{Z}$ 没有幺元：$e \\cdot 2 = 2$ 迫使 $e = 1 \\notin 2\\mathbb{Z}$。矩阵 $\\begin{pmatrix} a & 0 \\\\ 0 & 0 \\end{pmatrix}$ 的幺元为 $\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$，尽管它不是单位矩阵。\n\n在 $\\mathbb{Z}_{50} \\times 7\\mathbb{Z} \\times \\mathbb{Z}$ 中，幺元在每个坐标上都必须是幺元，而 $7\\mathbb{Z}$ 没有幺元，所以这个环没有幺元。去掉中间的因子，$\\mathbb{Z}_{50} \\times \\mathbb{Z}$ 有幺元 $(1, 1)$。\n\n检验：$(1, 1)(37, -4) = (37, -4)$，另一种顺序也一样。\n\n> **注意。** 幺元必须属于这个环本身，并对每个元素都成立：整数 $1$ 不是 $2\\mathbb{Z}$ 的幺元，因为它不在 $2\\mathbb{Z}$ 中。而且幺元不一定是 $1$ 或单位矩阵。",
      ),
      generate(rng) {
        const n = rng.int(2, 12);
        const m = rng.int(2, 12);
        const facts: Decision[] = [
          {
            prompt: t(`Does $${n}\\mathbb{Z}$ have a unity?`, `$${n}\\mathbb{Z}$ 有幺元吗？`),
            holds: false,
            steps: [
              [
                ["Suppose there is one", "假设存在幺元"],
                t(`A unity $e$ would satisfy $e \\cdot ${n} = ${n}$.`, `幺元 $e$ 应满足 $e \\cdot ${n} = ${n}$。`),
              ],
              [
                ["Solve for it", "解出它"],
                t(
                  `That forces $e = 1$, which is not in $${n}\\mathbb{Z}$: no, there is no unity.`,
                  `这迫使 $e = 1$，而 $1 \\notin ${n}\\mathbb{Z}$：没有幺元。`,
                ),
              ],
            ],
            check: t(
              `Even the smallest positive element fails: $${n} \\cdot ${n} = ${n * n} \\ne ${n}$.`,
              `即使最小的正元素也不行：$${n} \\cdot ${n} = ${n * n} \\ne ${n}$。`,
            ),
            wrong: t(
              `$e \\cdot ${n} = ${n}$ forces $e = 1$, which is not in $${n}\\mathbb{Z}$.`,
              `$e \\cdot ${n} = ${n}$ 迫使 $e = 1$，而 $1 \\notin ${n}\\mathbb{Z}$。`,
            ),
          },
          {
            prompt: t(`Does $${zTex(m)} \\times ${n}\\mathbb{Z}$ have a unity?`, `$${zTex(m)} \\times ${n}\\mathbb{Z}$ 有幺元吗？`),
            holds: false,
            steps: [
              [
                ["Look at the coordinates", "看各坐标"],
                t(
                  "A unity $(e_1, e_2)$ of the product needs $e_2$ to be a unity of the second factor.",
                  "直积的幺元 $(e_1, e_2)$ 要求 $e_2$ 是第二个因子的幺元。",
                ),
              ],
              [
                ["Decide", "作出判断"],
                t(`$${n}\\mathbb{Z}$ has no unity: no, the product has none.`, `$${n}\\mathbb{Z}$ 没有幺元：直积也没有。`),
              ],
            ],
            check: t(
              `$(e_1, e_2)(0, ${n}) = (0, ${n})$ forces $${n}e_2 = ${n}$, so $e_2 = 1 \\notin ${n}\\mathbb{Z}$.`,
              `$(e_1, e_2)(0, ${n}) = (0, ${n})$ 迫使 $${n}e_2 = ${n}$，所以 $e_2 = 1 \\notin ${n}\\mathbb{Z}$。`,
            ),
            wrong: t(
              `A unity would need a unity in the second coordinate, but $${n}\\mathbb{Z}$ has none.`,
              `幺元在第二个坐标上也必须是幺元，但 $${n}\\mathbb{Z}$ 没有。`,
            ),
          },
          {
            prompt: t(`Does $${zTex(m)} \\times \\mathbb{Z}$ have a unity?`, `$${zTex(m)} \\times \\mathbb{Z}$ 有幺元吗？`),
            holds: true,
            steps: [
              [
                ["Take the unities of the factors", "取各因子的幺元"],
                t(
                  `$1$ is a unity of $${zTex(m)}$ and of $\\mathbb{Z}$, so try $(1, 1)$.`,
                  `$1$ 是 $${zTex(m)}$ 与 $\\mathbb{Z}$ 的幺元，所以试 $(1, 1)$。`,
                ),
              ],
              [
                ["Check it", "验证"],
                t("$(1, 1)(a, b) = (a, b) = (a, b)(1, 1)$: yes, there is a unity.", "$(1, 1)(a, b) = (a, b) = (a, b)(1, 1)$：有幺元。"),
              ],
            ],
            check: t(`$(1, 1)(${m - 1}, -5) = (${m - 1}, -5)$.`, `$(1, 1)(${m - 1}, -5) = (${m - 1}, -5)$。`),
            wrong: t("$(1, 1)$ is a unity.", "$(1, 1)$ 是幺元。"),
          },
          {
            prompt: t(
              `Does the ring of matrices $\\begin{pmatrix} a & 0 \\\\ 0 & 0 \\end{pmatrix}$ with $a \\in ${zTex(m)}$ have a unity?`,
              `由矩阵 $\\begin{pmatrix} a & 0 \\\\ 0 & 0 \\end{pmatrix}$（$a \\in ${zTex(m)}$）构成的环有幺元吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Try the matrix with a = 1", "试取左上角为 1 的矩阵"],
                t(
                  "Let $E = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$, which is in the ring.",
                  "设 $E = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$，它在这个环中。",
                ),
              ],
              [
                ["Check it", "验证"],
                t(
                  "$E\\begin{pmatrix} a & 0 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} a & 0 \\\\ 0 & 0 \\end{pmatrix}$, in either order: yes, $E$ is a unity.",
                  "$E\\begin{pmatrix} a & 0 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} a & 0 \\\\ 0 & 0 \\end{pmatrix}$，两种顺序都成立：$E$ 是幺元。",
                ),
              ],
            ],
            check: t(
              "$E$ is not the identity matrix $I$, and $I$ is not even in this ring, since its lower right entry is $1$.",
              "$E$ 不是单位矩阵 $I$，而 $I$ 甚至不在这个环中，因为它右下角的元素为 $1$。",
            ),
            wrong: t(
              "$\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$ is a unity.",
              "$\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$ 是幺元。",
            ),
          },
          {
            prompt: t(
              `Does the ring of $${n} \\times ${n}$ matrices with even integer entries have a unity?`,
              `元素均为偶数的 $${n} \\times ${n}$ 整数矩阵环有幺元吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Suppose there is one", "假设存在幺元"],
                t(
                  "A unity $E$ would satisfy $E(2I) = 2I$, so $2E = 2I$ and $E = I$.",
                  "幺元 $E$ 应满足 $E(2I) = 2I$，所以 $2E = 2I$，$E = I$。",
                ),
              ],
              [
                ["Decide", "作出判断"],
                t("$I$ does not have all entries even: no, there is no unity.", "$I$ 的元素并非全为偶数：没有幺元。"),
              ],
            ],
            check: t("$I$ has the entry $1$ on its diagonal, and $1$ is odd.", "$I$ 的对角线上有元素 $1$，而 $1$ 是奇数。"),
            wrong: t(
              "A unity would have to be the identity matrix, whose entries are not all even.",
              "幺元只能是单位矩阵，而它的元素并非全为偶数。",
            ),
          },
        ];
        return decide(rng.pick(facts));
      },
    },
    {
      id: "unities-of-subrings-of-zn",
      title: t("Unities of subrings of $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 子环的幺元"),
      explanation: t(
        "A subring may have a unity different from one, namely an element of the subring that multiplies every element of it to itself. In $\\mathbb{Z}_{10}$, the subring $\\langle 2 \\rangle = \\{0, 2, 4, 6, 8\\}$ has unity $6$: $6 \\equiv 0 \\pmod 2$ and $6 \\equiv 1 \\pmod 5$, so $6x = x$ for every even $x$.\n\nIn $\\mathbb{Z}_{100}$, the subring $\\langle 4 \\rangle$ has $25$ elements, and its unity is the multiple of $4$ that is $1$ modulo $25$: $76 = 4 \\cdot 19$.\n\nCheck: $76 \\cdot 8 = 608 \\equiv 8 \\pmod{100}$.\n\n> **Watch out.** The unity of a subring is usually neither $1$, which is not in it, nor the generator: in $\\langle 2 \\rangle \\subset \\mathbb{Z}_{10}$, $2 \\cdot 2 = 4 \\ne 2$. Some subrings have no unity at all, like $\\langle 2 \\rangle$ in $\\mathbb{Z}_8$.",
        "子环可能有不同于 1 的单位元，也就是子环中一个与其每个元素相乘都得到该元素本身的元素。在 $\\mathbb{Z}_{10}$ 中，子环 $\\langle 2 \\rangle = \\{0, 2, 4, 6, 8\\}$ 的幺元为 $6$：$6 \\equiv 0 \\pmod 2$ 且 $6 \\equiv 1 \\pmod 5$，所以对每个偶数 $x$ 有 $6x = x$。\n\n在 $\\mathbb{Z}_{100}$ 中，子环 $\\langle 4 \\rangle$ 有 $25$ 个元素，它的幺元是模 $25$ 余 $1$ 的 $4$ 的倍数：$76 = 4 \\cdot 19$。\n\n检验：$76 \\cdot 8 = 608 \\equiv 8 \\pmod{100}$。\n\n> **注意。** 子环的幺元通常既不是 $1$（它不在子环中），也不是生成元：在 $\\langle 2 \\rangle \\subset \\mathbb{Z}_{10}$ 中，$2 \\cdot 2 = 4 \\ne 2$。有些子环根本没有幺元，例如 $\\mathbb{Z}_8$ 中的 $\\langle 2 \\rangle$。",
      ),
      generate(rng) {
        let n: number;
        let d: number;
        let e: number | undefined;
        do {
          do n = rng.int(6, 60);
          while (isPrime(n));
          d = rng.pick(divisors(n).filter((x) => x > 1 && x < n));
          e = subgroupUnity(d, n);
        } while (e === undefined || e === d || n / d < 3);
        const u = e!;
        const q = n / d;
        const list = q === 3 ? `${d}, ${2 * d}` : `${d}, ${2 * d}, \\ldots, ${n - d}`;
        return numberProblem({
          prompt: t(
            `In $${zTex(n)}$, the subring $\\langle ${d} \\rangle$ has a unity. Find it.`,
            `在 $${zTex(n)}$ 中，子环 $\\langle ${d} \\rangle$ 有幺元。求它。`,
          ),
          answer: u,
          mistakes: apart(u, [
            why(
              d,
              `That is the generator, but a unity must be $1$ modulo $${q}$, and $${d} \\equiv ${mod(d, q)} \\pmod{${q}}$.`,
              `那是生成元，但幺元必须模 $${q}$ 余 $1$，而 $${d} \\equiv ${mod(d, q)} \\pmod{${q}}$。`,
            ),
            why(
              1,
              `$1$ is the unity of $${zTex(n)}$, but it is not a multiple of $${d}$, so it is not in the subring.`,
              `$1$ 是 $${zTex(n)}$ 的幺元，但它不是 $${d}$ 的倍数，所以不在子环中。`,
            ),
            why(
              n - d,
              `That is $-${d}$; a unity must be $1$ modulo $${q}$, and $${n - d} \\equiv ${mod(n - d, q)} \\pmod{${q}}$.`,
              `那是 $-${d}$；幺元必须模 $${q}$ 余 $1$，而 $${n - d} \\equiv ${mod(n - d, q)} \\pmod{${q}}$。`,
            ),
            why(
              mod(u + d, n),
              `That is one step of $${d}$ past the unity, and it is $${mod(u + d, q)}$ modulo $${q}$, not $1$.`,
              `那比幺元多走了一步 $${d}$，它模 $${q}$ 余 $${mod(u + d, q)}$，不是 $1$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the conditions", "写出条件"],
                t(
                  `The unity $e$ lies in $\\langle ${d} \\rangle$, so it is a multiple of $${d}$, and $e \\cdot ${d} \\equiv ${d} \\pmod{${n}}$ means $e \\equiv 1 \\pmod{${q}}$.`,
                  `幺元 $e$ 在 $\\langle ${d} \\rangle$ 中，所以是 $${d}$ 的倍数；而 $e \\cdot ${d} \\equiv ${d} \\pmod{${n}}$ 意味着 $e \\equiv 1 \\pmod{${q}}$。`,
                ),
              ],
              [
                ["Search the multiples", "在倍数中查找"],
                t(
                  `Among $${list}$, the one that leaves remainder $1$ on division by $${q}$ is $${u}$.`,
                  `在 $${list}$ 中，除以 $${q}$ 余 $1$ 的是 $${u}$。`,
                ),
              ],
            ],
            t(
              `$${u} \\cdot ${d} = ${u * d} \\equiv ${d} \\pmod{${n}}$, so $${u}$ fixes the generator, and with it every multiple of $${d}$.`,
              `$${u} \\cdot ${d} = ${u * d} \\equiv ${d} \\pmod{${n}}$，所以 $${u}$ 保持生成元不变，从而保持 $${d}$ 的每个倍数不变。`,
            ),
          ),
        });
      },
    },
  ],
};

/** integralDomains counts zero divisors and recognizes integral domains. */
export const integralDomains: TopicDef = {
  id: "integral-domains",
  title: t("Integral Domains", "整环"),
  summary: t(
    "A zero divisor is a nonzero a such that ab = 0 for some nonzero b. An integral domain is a commutative ring with unity and no zero divisors; in it, cancellation holds: if a ≠ 0 and ab = ac then b = c. ℤ, ℤ[√k] and ℤₚ for p prime are integral domains; ℤₙ for composite n and ℤ × ℤ are not. In ℤₙ, the zero divisors are the nonzero non-units.",
    "零因子是存在非零 b 使 ab = 0 的非零元素 a。整环是有幺元、无零因子的交换环；其中消去律成立：若 a ≠ 0 且 ab = ac，则 b = c。ℤ、ℤ[√k] 以及素数 p 的 ℤₚ 是整环；合数 n 的 ℤₙ 与 ℤ × ℤ 不是。在 ℤₙ 中，零因子就是非零的非单位元。",
  ),
  intro: t(
    "In $\\mathbb{Z}_{15}$, $3 \\cdot 5 = 15 \\equiv 0$ with $3 \\ne 0$ and $5 \\ne 0$, so $3$ and $5$ are zero divisors and $\\mathbb{Z}_{15}$ is not an integral domain.\n\nCheck: $\\mathbb{Z}_{15}$ has $\\varphi(15) = 8$ units, so it has $15 - 8 - 1 = 6$ zero divisors: $3, 5, 6, 9, 10, 12$.\n\nIn this lesson we count the zero divisors of $\\mathbb{Z}_n$ and decide which rings are integral domains.",
    "在 $\\mathbb{Z}_{15}$ 中，$3 \\cdot 5 = 15 \\equiv 0$，而 $3 \\ne 0$、$5 \\ne 0$，所以 $3$ 与 $5$ 是零因子，$\\mathbb{Z}_{15}$ 不是整环。\n\n检验：$\\mathbb{Z}_{15}$ 有 $\\varphi(15) = 8$ 个单位，所以有 $15 - 8 - 1 = 6$ 个零因子：$3, 5, 6, 9, 10, 12$。\n\n本课我们数 $\\mathbb{Z}_n$ 的零因子，并判断哪些环是整环。",
  ),
  prerequisites: ["rings-with-unity"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-zero-divisors-in-zn",
      title: t("Zero divisors in $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 中的零因子"),
      explanation: t(
        "In this ring every nonzero element is either a unit or a zero divisor, so subtract the units and zero from the total. In $\\mathbb{Z}_{12}$, the units are $1, 5, 7, 11$, so the zero divisors are the other $12 - 4 - 1 = 7$ nonzero elements: $2, 3, 4, 6, 8, 9, 10$.\n\nIn $\\mathbb{Z}_{100}$ there are $\\varphi(100) = 40$ units, so there are $100 - 40 - 1 = 59$ zero divisors.\n\nCheck: count the nonzero elements sharing a factor $2$ or $5$ with $100$ directly: $49$ are even, $19$ are multiples of $5$, and the $9$ multiples of $10$ were counted twice: $49 + 19 - 9 = 59$.\n\n> **Watch out.** $0$ is not a zero divisor, so subtract it as well as the units. For a prime $p$ there are no zero divisors at all: $p - (p - 1) - 1 = 0$.",
        "在这个环中，每个非零元素要么是单位，要么是零因子，所以从总数中减去单位和零。在 $\\mathbb{Z}_{12}$ 中，单位为 $1, 5, 7, 11$，所以零因子是其余 $12 - 4 - 1 = 7$ 个非零元素：$2, 3, 4, 6, 8, 9, 10$。\n\n$\\mathbb{Z}_{100}$ 有 $\\varphi(100) = 40$ 个单位，所以有 $100 - 40 - 1 = 59$ 个零因子。\n\n检验：直接数与 $100$ 有公因数 $2$ 或 $5$ 的非零元素：偶数有 $49$ 个，$5$ 的倍数有 $19$ 个，而 $10$ 的 $9$ 个倍数被数了两次：$49 + 19 - 9 = 59$。\n\n> **注意。** $0$ 不是零因子，所以除了单位还要减去它。对素数 $p$ 根本没有零因子：$p - (p - 1) - 1 = 0$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(6, 80);
        while (isPrime(n));
        const value = n - phi(n) - 1;
        const p = primesOf(n)[0]!;
        return numberProblem({
          prompt: t(`How many zero divisors does $${zTex(n)}$ have?`, `$${zTex(n)}$ 有多少个零因子？`),
          answer: value,
          mistakes: apart(value, [
            why(n - phi(n), "That counts $0$ too; a zero divisor must be nonzero.", "那把 $0$ 也算进去了；零因子必须非零。"),
            why(phi(n), `That counts the units, the elements coprime to $${n}$.`, `那数的是单位，即与 $${n}$ 互素的元素。`),
            why(
              divisors(n).length - 2,
              `That counts only the divisors of $${n}$ other than $1$ and $${n}$; their multiples are zero divisors too.`,
              `那只数了 $${n}$ 除 $1$ 与 $${n}$ 外的因数；它们的倍数也是零因子。`,
            ),
            why(
              value - 1,
              "One short: every nonzero element that is not a unit is a zero divisor.",
              "少了一个：每个非零且非单位的元素都是零因子。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Count the units", "数单位"],
                t(
                  `The units are the elements coprime to $${n}$: $\\varphi(${n}) = ${phi(n)}$ of them.`,
                  `单位是与 $${n}$ 互素的元素：共 $\\varphi(${n}) = ${phi(n)}$ 个。`,
                ),
              ],
              [
                ["Remove the units and zero", "去掉单位和零"],
                t(
                  `The rest are the zero divisors: $${n} - ${phi(n)} - 1 = ${value}$.`,
                  `其余的就是零因子：$${n} - ${phi(n)} - 1 = ${value}$。`,
                ),
              ],
            ],
            t(
              `$${p} \\cdot ${n / p} = ${n} \\equiv 0$, so $${p}$ is one of them, while the unit $${n - 1}$ is not: $${n - 1} \\cdot ${n - 1} \\equiv 1$.`,
              `$${p} \\cdot ${n / p} = ${n} \\equiv 0$，所以 $${p}$ 是零因子之一；而单位 $${n - 1}$ 不是：$${n - 1} \\cdot ${n - 1} \\equiv 1$。`,
            ),
          ),
        });
      },
    },
    {
      id: "recognizing-integral-domains",
      title: t("Recognizing integral domains", "识别整环"),
      explanation: t(
        "An integral domain is a commutative ring with unity in which a product is zero only when one of the factors is zero. $\\mathbb{Z}_{13}$ is an integral domain, but $\\mathbb{Z}_{15}$ is not: $3 \\cdot 5 = 0$. $\\mathbb{Z} \\times \\mathbb{Z}$ is not either: $(1, 0)(0, 1) = (0, 0)$.\n\n$\\mathbb{Z}_{101}$ is an integral domain, since $101$ is prime, but $\\mathbb{Z}_{91}$ is not: $7 \\cdot 13 = 91 \\equiv 0$.\n\nCheck: $7$ and $13$ are both nonzero in $\\mathbb{Z}_{91}$, so they are zero divisors.\n\n> **Watch out.** A product of integral domains is never one: $(1, 0)(0, 1) = (0, 0)$, even though each factor has no zero divisors. And an integral domain must be commutative with a unity, so $2\\mathbb{Z}$, which has no unity, is not one.",
        "整环是有单位元的交换环，其中乘积为零只有在某个因子为零时才会发生。$\\mathbb{Z}_{13}$ 是整环，而 $\\mathbb{Z}_{15}$ 不是：$3 \\cdot 5 = 0$。$\\mathbb{Z} \\times \\mathbb{Z}$ 也不是：$(1, 0)(0, 1) = (0, 0)$。\n\n$\\mathbb{Z}_{101}$ 是整环，因为 $101$ 是素数；而 $\\mathbb{Z}_{91}$ 不是：$7 \\cdot 13 = 91 \\equiv 0$。\n\n检验：$7$ 与 $13$ 在 $\\mathbb{Z}_{91}$ 中都非零，所以它们是零因子。\n\n> **注意。** 整环的直积永远不是整环：$(1, 0)(0, 1) = (0, 0)$，尽管每个因子都没有零因子。而且整环必须是有幺元的交换环，所以没有幺元的 $2\\mathbb{Z}$ 不是整环。",
      ),
      generate(rng) {
        const n = rng.int(4, 40);
        const k = nonSquare(rng);
        const p = primesOf(n)[0]!;
        const prime = isPrime(n);
        const facts: Decision[] = [
          prime
            ? {
                prompt: t(`Is $${zTex(n)}$ an integral domain?`, `$${zTex(n)}$ 是整环吗？`),
                holds: true,
                steps: [
                  [
                    ["Use that the modulus is prime", "利用模是素数"],
                    t(
                      `$${n}$ is prime, so $${n} \\mid ab$ forces $${n} \\mid a$ or $${n} \\mid b$.`,
                      `$${n}$ 是素数，所以 $${n} \\mid ab$ 迫使 $${n} \\mid a$ 或 $${n} \\mid b$。`,
                    ),
                  ],
                  [
                    ["Decide", "作出判断"],
                    t(
                      `So $ab = 0$ in $${zTex(n)}$ only when $a = 0$ or $b = 0$: yes, it is an integral domain.`,
                      `所以在 $${zTex(n)}$ 中 $ab = 0$ 仅当 $a = 0$ 或 $b = 0$：是整环。`,
                    ),
                  ],
                ],
                check: t(
                  `All $${n - 1}$ nonzero elements are coprime to $${n}$, so they are units, and a unit is never a zero divisor.`,
                  `全部 $${n - 1}$ 个非零元素都与 $${n}$ 互素，所以都是单位，而单位不会是零因子。`,
                ),
                wrong: t(
                  `$${n}$ is prime, so a product is $0$ only when a factor is $0$.`,
                  `$${n}$ 是素数，所以乘积为 $0$ 仅当某个因子为 $0$。`,
                ),
              }
            : {
                prompt: t(`Is $${zTex(n)}$ an integral domain?`, `$${zTex(n)}$ 是整环吗？`),
                holds: false,
                steps: [
                  [["Factor the modulus", "分解模"], t(`$${n} = ${p} \\cdot ${n / p}$.`, `$${n} = ${p} \\cdot ${n / p}$。`)],
                  [
                    ["Find a zero product", "找出积为零的一对"],
                    t(
                      `$${p} \\cdot ${n / p} = 0$ in $${zTex(n)}$, with both factors nonzero: no, it is not an integral domain.`,
                      `在 $${zTex(n)}$ 中 $${p} \\cdot ${n / p} = 0$，两个因子都非零：不是整环。`,
                    ),
                  ],
                ],
                check: t(
                  `$${p}$ and $${n / p}$ both lie strictly between $0$ and $${n}$, so neither is $0$ in $${zTex(n)}$.`,
                  `$${p}$ 与 $${n / p}$ 都严格介于 $0$ 与 $${n}$ 之间，所以在 $${zTex(n)}$ 中都不为 $0$。`,
                ),
                wrong: t(`$${p} \\cdot ${n / p} = 0$ in $${zTex(n)}$.`, `在 $${zTex(n)}$ 中 $${p} \\cdot ${n / p} = 0$。`),
              },
          {
            prompt: t(`Is $\\mathbb{Z}[\\sqrt{${k}}]$ an integral domain?`, `$\\mathbb{Z}[\\sqrt{${k}}]$ 是整环吗？`),
            holds: true,
            steps: [
              [
                ["Check the ring", "检查这个环"],
                t("It is a commutative subring of $\\mathbb{R}$ that contains $1$.", "它是 $\\mathbb{R}$ 的含 $1$ 的交换子环。"),
              ],
              [
                ["Look for zero divisors", "寻找零因子"],
                t(
                  "A product of nonzero real numbers is nonzero, so it has no zero divisors: yes, it is an integral domain.",
                  "非零实数之积非零，所以它没有零因子：是整环。",
                ),
              ],
            ],
            check: t(
              `$(1 + \\sqrt{${k}})(1 - \\sqrt{${k}}) = -${k - 1}$, not $0$, as a product of two nonzero elements must be.`,
              `$(1 + \\sqrt{${k}})(1 - \\sqrt{${k}}) = -${k - 1}$，不为 $0$，两个非零元素之积本应如此。`,
            ),
            wrong: t(
              "It is a commutative subring of $\\mathbb{R}$ containing $1$, and $\\mathbb{R}$ has no zero divisors.",
              "它是含 $1$ 的 $\\mathbb{R}$ 的交换子环，而 $\\mathbb{R}$ 没有零因子。",
            ),
          },
          {
            prompt: t(`Is $\\mathbb{Z} \\times ${zTex(n)}$ an integral domain?`, `$\\mathbb{Z} \\times ${zTex(n)}$ 是整环吗？`),
            holds: false,
            steps: [
              [["Multiply two elements", "把两个元素相乘"], t("$(1, 0)(0, 1) = (0, 0)$.", "$(1, 0)(0, 1) = (0, 0)$。")],
              [
                ["Decide", "作出判断"],
                t(
                  "Both factors are nonzero, so they are zero divisors: no, it is not an integral domain.",
                  "两个因子都非零，所以它们是零因子：不是整环。",
                ),
              ],
            ],
            check: t(
              "$(2, 0)(0, 3) = (0, 0)$ as well: every nonzero element with a zero coordinate is a zero divisor.",
              "$(2, 0)(0, 3) = (0, 0)$ 也成立：每个有一个坐标为零的非零元素都是零因子。",
            ),
            wrong: t("$(1, 0)(0, 1) = (0, 0)$.", "$(1, 0)(0, 1) = (0, 0)$。"),
          },
          prime
            ? {
                prompt: t(
                  `Is the ring of polynomials with coefficients in $${zTex(n)}$ an integral domain?`,
                  `系数在 $${zTex(n)}$ 中的多项式环是整环吗？`,
                ),
                holds: true,
                steps: [
                  [
                    ["Look at leading coefficients", "看首项系数"],
                    t(
                      "The leading coefficient of $fg$ is the product of the leading coefficients of $f$ and $g$.",
                      "$fg$ 的首项系数等于 $f$ 与 $g$ 的首项系数之积。",
                    ),
                  ],
                  [
                    ["Decide", "作出判断"],
                    t(
                      `$${zTex(n)}$ is an integral domain, so that product is nonzero, and $fg \\ne 0$: yes, it is an integral domain.`,
                      `$${zTex(n)}$ 是整环，所以这个积非零，$fg \\ne 0$：是整环。`,
                    ),
                  ],
                ],
                check: t(
                  "For nonzero $f$ and $g$, $\\deg(fg) = \\deg f + \\deg g$, so their product is not the zero polynomial.",
                  "对非零的 $f$ 与 $g$，$\\deg(fg) = \\deg f + \\deg g$，所以它们的积不是零多项式。",
                ),
                wrong: t(
                  `$${zTex(n)}$ is an integral domain, and the leading coefficient of a product is the product of the leading coefficients.`,
                  `$${zTex(n)}$ 是整环，乘积的首项系数等于首项系数之积。`,
                ),
              }
            : {
                prompt: t(
                  `Is the ring of polynomials with coefficients in $${zTex(n)}$ an integral domain?`,
                  `系数在 $${zTex(n)}$ 中的多项式环是整环吗？`,
                ),
                holds: false,
                steps: [
                  [
                    ["Take constant polynomials", "取常数多项式"],
                    t(`The constants $${p}$ and $${n / p}$ are nonzero polynomials.`, `常数 $${p}$ 与 $${n / p}$ 是非零多项式。`),
                  ],
                  [
                    ["Multiply them", "把它们相乘"],
                    t(
                      `$${p} \\cdot ${n / p} = ${n} \\equiv 0$: no, it is not an integral domain.`,
                      `$${p} \\cdot ${n / p} = ${n} \\equiv 0$：不是整环。`,
                    ),
                  ],
                ],
                check: t(
                  `$(${p}x)(${n / p}x) = ${n}x^2 = 0$ as well, a zero product of two polynomials of degree $1$.`,
                  `$(${p}x)(${n / p}x) = ${n}x^2 = 0$ 也成立，是两个一次多项式之积为零。`,
                ),
                wrong: t(`The constants $${p}$ and $${n / p}$ multiply to $0$.`, `常数 $${p}$ 与 $${n / p}$ 之积为 $0$。`),
              },
        ];
        return decide(rng.pick(facts));
      },
    },
  ],
};

/** introductionToFields recognizes fields and solves linear equations in ℤₚ. */
export const introductionToFields: TopicDef = {
  id: "introduction-to-fields",
  title: t("Introduction to Fields", "域的介绍"),
  summary: t(
    "A field is a commutative ring with unity in which every nonzero element is a unit. Every field is an integral domain, and every finite integral domain is a field; so ℤₙ is a field exactly when n is prime. ℚ, ℝ, ℂ and ℚ(√k) = {a + b√k : a, b ∈ ℚ} are fields; ℤ is not.",
    "域是有幺元的交换环，其中每个非零元素都是单位。每个域都是整环，每个有限整环都是域；所以 ℤₙ 是域当且仅当 n 是素数。ℚ、ℝ、ℂ 与 ℚ(√k) = {a + b√k : a, b ∈ ℚ} 是域；ℤ 不是。",
  ),
  intro: t(
    "In $\\mathbb{Z}_7$, $3 \\cdot 5 = 15 \\equiv 1$, so $3^{-1} = 5$, and the equation $3x = 4$ gives $x = 4 \\cdot 5 = 20 \\equiv 6$.\n\nCheck: $3 \\cdot 6 = 18 \\equiv 4 \\pmod 7$.\n\nIn this lesson we decide which rings are fields and solve linear equations in $\\mathbb{Z}_p$.",
    "在 $\\mathbb{Z}_7$ 中，$3 \\cdot 5 = 15 \\equiv 1$，所以 $3^{-1} = 5$，方程 $3x = 4$ 得 $x = 4 \\cdot 5 = 20 \\equiv 6$。\n\n检验：$3 \\cdot 6 = 18 \\equiv 4 \\pmod 7$。\n\n本课我们判断哪些环是域，并在 $\\mathbb{Z}_p$ 中解线性方程。",
  ),
  prerequisites: ["integral-domains", "multiplicative-inverses-modulo-n"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-fields",
      title: t("Recognizing fields", "识别域"),
      explanation: t(
        "A field is a commutative ring in which every nonzero element has a multiplicative inverse, so check whether the inverses stay in the set. $\\mathbb{Q}(\\sqrt{2})$ is a field: $\\frac{1}{a + b\\sqrt 2} = \\frac{a - b\\sqrt 2}{a^2 - 2b^2}$. $\\mathbb{Z}[\\sqrt 2]$ is not: $2$ has no inverse in it.\n\n$\\mathbb{Z}_{97}$ is a field, since $97$ is prime, but $\\mathbb{Z}_{99}$ is not: $3x$ is always a multiple of $3$ modulo $99$, so it is never $1$, and $3$ has no inverse.\n\nCheck: $3 \\cdot 33 = 99 \\equiv 0$, so $3$ is even a zero divisor in $\\mathbb{Z}_{99}$.\n\n> **Watch out.** Having no zero divisors is not enough for an infinite ring: $\\mathbb{Z}$ has none, yet $2$ has no inverse in it. Only a finite integral domain is automatically a field.",
        "域是每个非零元素都有乘法逆元的交换环，所以要检查这些逆元是否仍在集合中。$\\mathbb{Q}(\\sqrt{2})$ 是域：$\\frac{1}{a + b\\sqrt 2} = \\frac{a - b\\sqrt 2}{a^2 - 2b^2}$。$\\mathbb{Z}[\\sqrt 2]$ 不是：$2$ 在其中没有逆元。\n\n$\\mathbb{Z}_{97}$ 是域，因为 $97$ 是素数；而 $\\mathbb{Z}_{99}$ 不是：$3x$ 模 $99$ 总是 $3$ 的倍数，永远不等于 $1$，所以 $3$ 没有逆元。\n\n检验：$3 \\cdot 33 = 99 \\equiv 0$，所以 $3$ 在 $\\mathbb{Z}_{99}$ 中甚至是零因子。\n\n> **注意。** 对无限环来说，没有零因子还不够：$\\mathbb{Z}$ 没有零因子，但 $2$ 在其中没有逆元。只有有限整环才自动是域。",
      ),
      generate(rng) {
        const n = rng.int(4, 40);
        const k = nonSquare(rng);
        const q = primesOf(n)[0]!;
        const facts: Decision[] = [
          isPrime(n)
            ? {
                prompt: t(`Is $${zTex(n)}$ a field?`, `$${zTex(n)}$ 是域吗？`),
                holds: true,
                steps: [
                  [
                    ["Look at the nonzero elements", "看非零元素"],
                    t(
                      `$${n}$ is prime, so every nonzero element of $${zTex(n)}$ is coprime to $${n}$.`,
                      `$${n}$ 是素数，所以 $${zTex(n)}$ 的每个非零元素都与 $${n}$ 互素。`,
                    ),
                  ],
                  [
                    ["Find the inverses", "求逆元"],
                    t(
                      `An element coprime to $${n}$ has an inverse modulo $${n}$, so every nonzero element is a unit: yes, it is a field.`,
                      `与 $${n}$ 互素的元素模 $${n}$ 有逆元，所以每个非零元素都是单位：是域。`,
                    ),
                  ],
                ],
                check: t(
                  `$${n - 1} \\cdot ${n - 1} = ${(n - 1) ** 2} \\equiv 1 \\pmod{${n}}$, so $${n - 1}$ is its own inverse.`,
                  `$${n - 1} \\cdot ${n - 1} = ${(n - 1) ** 2} \\equiv 1 \\pmod{${n}}$，所以 $${n - 1}$ 是自身的逆元。`,
                ),
                wrong: t(
                  `$${n}$ is prime, so every nonzero element is coprime to $${n}$ and has an inverse.`,
                  `$${n}$ 是素数，所以每个非零元素与 $${n}$ 互素，有逆元。`,
                ),
              }
            : {
                prompt: t(`Is $${zTex(n)}$ a field?`, `$${zTex(n)}$ 是域吗？`),
                holds: false,
                steps: [
                  [
                    ["Take a prime factor", "取一个素因数"],
                    t(`$${q}$ divides $${n}$, so $\\gcd(${q}, ${n}) = ${q}$.`, `$${q}$ 整除 $${n}$，所以 $\\gcd(${q}, ${n}) = ${q}$。`),
                  ],
                  [
                    ["Look for its inverse", "找它的逆元"],
                    t(
                      `$${q}x$ is always a multiple of $${q}$ modulo $${n}$, so it is never $1$: $${q}$ has no inverse, and no, it is not a field.`,
                      `$${q}x$ 模 $${n}$ 总是 $${q}$ 的倍数，永远不等于 $1$：$${q}$ 没有逆元，所以不是域。`,
                    ),
                  ],
                ],
                check: t(
                  `$${q} \\cdot ${n / q} = ${n} \\equiv 0$, so $${q}$ is a zero divisor, and a zero divisor has no inverse.`,
                  `$${q} \\cdot ${n / q} = ${n} \\equiv 0$，所以 $${q}$ 是零因子，而零因子没有逆元。`,
                ),
                wrong: t(`$${q}$ has no inverse modulo $${n}$.`, `$${q}$ 模 $${n}$ 没有逆元。`),
              },
          {
            prompt: t(
              `Is $\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Q}\\}$ a field?`,
              `$\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Q}\\}$ 是域吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Rationalize the inverse", "把逆元有理化"],
                t(
                  `$\\frac{1}{a + b\\sqrt{${k}}} = \\frac{a - b\\sqrt{${k}}}{a^2 - ${k}b^2}$.`,
                  `$\\frac{1}{a + b\\sqrt{${k}}} = \\frac{a - b\\sqrt{${k}}}{a^2 - ${k}b^2}$。`,
                ),
              ],
              [
                ["Check the denominator", "检查分母"],
                t(
                  `$a^2 - ${k}b^2 \\ne 0$ for $(a, b) \\ne (0, 0)$, since $\\sqrt{${k}}$ is irrational, and the coefficients are rational: yes, it is a field.`,
                  `当 $(a, b) \\ne (0, 0)$ 时 $a^2 - ${k}b^2 \\ne 0$，因为 $\\sqrt{${k}}$ 是无理数，而系数都是有理数：是域。`,
                ),
              ],
            ],
            check: t(
              `$(1 + \\sqrt{${k}}) \\cdot \\frac{1 - \\sqrt{${k}}}{-${k - 1}} = \\frac{-${k - 1}}{-${k - 1}} = 1$.`,
              `$(1 + \\sqrt{${k}}) \\cdot \\frac{1 - \\sqrt{${k}}}{-${k - 1}} = \\frac{-${k - 1}}{-${k - 1}} = 1$。`,
            ),
            wrong: t(
              `$\\frac{1}{a + b\\sqrt{${k}}} = \\frac{a - b\\sqrt{${k}}}{a^2 - ${k}b^2}$, and $a^2 - ${k}b^2 \\ne 0$ since $\\sqrt{${k}}$ is irrational.`,
              `$\\frac{1}{a + b\\sqrt{${k}}} = \\frac{a - b\\sqrt{${k}}}{a^2 - ${k}b^2}$，且由于 $\\sqrt{${k}}$ 是无理数，$a^2 - ${k}b^2 \\ne 0$。`,
            ),
          },
          {
            prompt: t(
              `Is $\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Z}\\}$ a field?`,
              `$\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Z}\\}$ 是域吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Look for the inverse of 2", "找 2 的逆元"],
                t("In $\\mathbb{R}$ the inverse of $2$ is $\\frac{1}{2}$.", "在 $\\mathbb{R}$ 中 $2$ 的逆元是 $\\frac{1}{2}$。"),
              ],
              [
                ["Decide", "作出判断"],
                t(
                  `$\\frac{1}{2}$ is not of the form $a + b\\sqrt{${k}}$ with integers $a$ and $b$: no, it is not a field.`,
                  `$\\frac{1}{2}$ 不能写成整数 $a$、$b$ 的 $a + b\\sqrt{${k}}$：不是域。`,
                ),
              ],
            ],
            check: t(
              `If $2(a + b\\sqrt{${k}}) = 1$, comparing parts gives $2a = 1$, which has no integer solution.`,
              `若 $2(a + b\\sqrt{${k}}) = 1$，比较两部分得 $2a = 1$，它没有整数解。`,
            ),
            wrong: t(
              `$2$ has no inverse: $\\frac{1}{2}$ is not of the form $a + b\\sqrt{${k}}$ with integers $a, b$.`,
              `$2$ 没有逆元：$\\frac{1}{2}$ 不能写成整数 $a, b$ 的 $a + b\\sqrt{${k}}$。`,
            ),
          },
          {
            prompt: t(`Is $${zTex(n)} \\times ${zTex(n)}$ a field?`, `$${zTex(n)} \\times ${zTex(n)}$ 是域吗？`),
            holds: false,
            steps: [
              [
                ["Take a nonzero element", "取一个非零元素"],
                t("$(1, 0)$ is not the zero element $(0, 0)$.", "$(1, 0)$ 不是零元 $(0, 0)$。"),
              ],
              [
                ["Look for its inverse", "找它的逆元"],
                t(
                  "$(1, 0)(a, b) = (a, 0)$ is never the unity $(1, 1)$: no, it is not a field.",
                  "$(1, 0)(a, b) = (a, 0)$ 永远不等于幺元 $(1, 1)$：不是域。",
                ),
              ],
            ],
            check: t(
              "$(1, 0)(0, 1) = (0, 0)$, so $(1, 0)$ is even a zero divisor.",
              "$(1, 0)(0, 1) = (0, 0)$，所以 $(1, 0)$ 甚至是零因子。",
            ),
            wrong: t(
              "$(1, 0)$ is nonzero but has no inverse, since $(1, 0)(a, b) = (a, 0)$.",
              "$(1, 0)$ 非零但没有逆元，因为 $(1, 0)(a, b) = (a, 0)$。",
            ),
          },
        ];
        return decide(rng.pick(facts));
      },
    },
    {
      id: "solving-linear-equations-in-zp",
      title: t("Solving $ax = b$ in $\\mathbb{Z}_p$", "在 $\\mathbb{Z}_p$ 中解 $ax = b$"),
      explanation: t(
        "Modulo a prime every nonzero element has an inverse, so a linear equation is solved by multiplying by the inverse of the coefficient. In $\\mathbb{Z}_{11}$, $3x = 7$ gives $x = 7 \\cdot 3^{-1} = 7 \\cdot 4 = 28 \\equiv 6$. Check: $3 \\cdot 6 = 18 \\equiv 7$.\n\nIn $\\mathbb{Z}_{101}$, solve $7x = 5$: $7 \\cdot 29 = 203 = 2 \\cdot 101 + 1$, so $7^{-1} = 29$ and $x = 5 \\cdot 29 = 145 \\equiv 44$.\n\nCheck: $7 \\cdot 44 = 308 = 3 \\cdot 101 + 5 \\equiv 5$.\n\n> **Watch out.** Dividing by $a$ means multiplying by $a^{-1}$, not by $a$ and not subtracting $a$. Substitute to check: $a$ times the answer must reduce to $b$.",
        "模素数时每个非零元素都有逆元，所以线性方程可以通过乘以系数的逆元来求解。在 $\\mathbb{Z}_{11}$ 中，$3x = 7$ 得 $x = 7 \\cdot 3^{-1} = 7 \\cdot 4 = 28 \\equiv 6$。验证：$3 \\cdot 6 = 18 \\equiv 7$。\n\n在 $\\mathbb{Z}_{101}$ 中解 $7x = 5$：$7 \\cdot 29 = 203 = 2 \\cdot 101 + 1$，所以 $7^{-1} = 29$，$x = 5 \\cdot 29 = 145 \\equiv 44$。\n\n检验：$7 \\cdot 44 = 308 = 3 \\cdot 101 + 5 \\equiv 5$。\n\n> **注意。** 除以 $a$ 意味着乘以 $a^{-1}$，不是乘以 $a$，也不是减去 $a$。代入检验：$a$ 乘以答案约化后必须等于 $b$。",
      ),
      generate(rng) {
        const p = rng.pick([5, 7, 11, 13, 17, 19, 23, 29, 31]);
        const a = rng.int(2, p - 1);
        // Any value but a, since a = b would show the answer 1 at a glance.
        const drawn = rng.int(1, p - 2);
        const b = drawn >= a ? drawn + 1 : drawn;
        const ai = modInverse(a, p);
        const x = mod(b * ai, p);
        return numberProblem({
          prompt: t(`Solve $${a}x = ${b}$ in $${zTex(p)}$.`, `在 $${zTex(p)}$ 中解 $${a}x = ${b}$。`),
          answer: x,
          mistakes: apart(x, [
            why(
              mod(b * a, p),
              `That multiplies $${b}$ by $${a}$; to undo the coefficient, multiply by its inverse $${ai}$.`,
              `那是把 $${b}$ 乘以 $${a}$；要消去系数，应乘以它的逆元 $${ai}$。`,
            ),
            why(ai, `That is $${a}^{-1}$ alone; it still has to be multiplied by $${b}$.`, `那只是 $${a}^{-1}$；还要乘以 $${b}$。`),
            why(
              mod(b - a, p),
              `That subtracts $${a}$; the coefficient multiplies $x$, so divide by multiplying by $${ai}$.`,
              `那是减去 $${a}$；系数是乘在 $x$ 上的，所以要乘以 $${ai}$ 来相除。`,
            ),
            why(mod(p - x, p), `Sign slip: that is $-${x}$, the negative of the solution.`, `符号错误：那是 $-${x}$，即解的相反数。`),
          ]),
          solution: walked(
            [
              [
                ["Invert the coefficient", "求系数的逆元"],
                t(
                  `$${a} \\cdot ${ai} = ${a * ai} \\equiv 1 \\pmod{${p}}$, so $${a}^{-1} = ${ai}$ in $${zTex(p)}$.`,
                  `$${a} \\cdot ${ai} = ${a * ai} \\equiv 1 \\pmod{${p}}$，所以在 $${zTex(p)}$ 中 $${a}^{-1} = ${ai}$。`,
                ),
              ],
              [
                ["Multiply both sides", "两边同乘"],
                b === 1
                  ? t(`$x = ${a}^{-1} = ${ai}$.`, `$x = ${a}^{-1} = ${ai}$。`)
                  : t(`$x = ${b} \\cdot ${ai} = ${b * ai} \\equiv ${x}$.`, `$x = ${b} \\cdot ${ai} = ${b * ai} \\equiv ${x}$。`),
              ],
            ],
            t(`$${a} \\cdot ${x} = ${a * x} \\equiv ${b} \\pmod{${p}}$.`, `$${a} \\cdot ${x} = ${a * x} \\equiv ${b} \\pmod{${p}}$。`),
          ),
        });
      },
    },
  ],
};

/** theCharacteristicOfARing finds characteristics of products and decides which values are possible for domains. */
export const theCharacteristicOfARing: TopicDef = {
  id: "the-characteristic-of-a-ring",
  title: t("The Characteristic of a Ring", "环的特征"),
  summary: t(
    "The characteristic of a ring R is the least n ≥ 1 with nx = 0 for every x ∈ R, or 0 if there is none. For a ring with unity it is the additive order of 1. So ℤₙ has characteristic n, ℤ, ℚ, ℝ have characteristic 0, and ℤₘ × ℤₙ has characteristic lcm(m, n). The characteristic of an integral domain is 0 or a prime.",
    "环 R 的特征是使对所有 x ∈ R 都有 nx = 0 的最小正整数 n；若不存在则为 0。对有幺元的环，它就是 1 的加法阶。所以 ℤₙ 的特征为 n，ℤ、ℚ、ℝ 的特征为 0，ℤₘ × ℤₙ 的特征为 lcm(m, n)。整环的特征为 0 或素数。",
  ),
  intro: t(
    "$\\mathbb{Z}_4 \\times \\mathbb{Z}_6$ has characteristic $12$: the unity $(1, 1)$ needs $12$ copies to reach $(0, 0)$, since $12$ is the least common multiple of $4$ and $6$.\n\nCheck: $6(1, 1) = (6, 6) = (2, 0) \\ne (0, 0)$, so $6$ copies are not enough.\n\nIn this lesson we find the characteristics of product rings and decide which characteristics an integral domain can have.",
    "$\\mathbb{Z}_4 \\times \\mathbb{Z}_6$ 的特征为 $12$：幺元 $(1, 1)$ 需要 $12$ 份相加才得到 $(0, 0)$，因为 $12$ 是 $4$ 与 $6$ 的最小公倍数。\n\n检验：$6(1, 1) = (6, 6) = (2, 0) \\ne (0, 0)$，所以 $6$ 份不够。\n\n本课我们求直积环的特征，并判断整环可以有哪些特征。",
  ),
  prerequisites: ["integral-domains"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "characteristics-of-product-rings",
      title: t("Characteristics of products", "直积的特征"),
      explanation: t(
        "The characteristic is the least number of copies of the unity that sum to zero, which in a product must work in every coordinate. $\\mathbb{Z}_4 \\times \\mathbb{Z}_6$ has characteristic $\\operatorname{lcm}(4, 6) = 12$: $12(a, b) = (0, 0)$ always, and $(1, 1)$ needs all $12$. $\\mathbb{Z} \\times \\mathbb{Z}_6$ has characteristic $0$.\n\n$\\mathbb{Z}_{12} \\times \\mathbb{Z}_{18} \\times \\mathbb{Z}_{25}$ has characteristic $\\operatorname{lcm}(12, 18, 25) = 900$.\n\nCheck: $900 = 12 \\cdot 75 = 18 \\cdot 50 = 25 \\cdot 36$, and a common multiple of $36$ and $25$, which are coprime, is at least $36 \\cdot 25 = 900$.\n\n> **Watch out.** The characteristic of a product is the least common multiple of the characteristics, not their product: $\\mathbb{Z}_4 \\times \\mathbb{Z}_6$ has characteristic $12$, not $24$. One factor of characteristic $0$ makes the whole product characteristic $0$.",
        "特征是使单位元的若干份相加等于零的最小份数，在直积中这必须对每个坐标都成立。$\\mathbb{Z}_4 \\times \\mathbb{Z}_6$ 的特征为 $\\operatorname{lcm}(4, 6) = 12$：总有 $12(a, b) = (0, 0)$，而 $(1, 1)$ 恰需 $12$。$\\mathbb{Z} \\times \\mathbb{Z}_6$ 的特征为 $0$。\n\n$\\mathbb{Z}_{12} \\times \\mathbb{Z}_{18} \\times \\mathbb{Z}_{25}$ 的特征为 $\\operatorname{lcm}(12, 18, 25) = 900$。\n\n检验：$900 = 12 \\cdot 75 = 18 \\cdot 50 = 25 \\cdot 36$，而互素的 $36$ 与 $25$ 的公倍数至少是 $36 \\cdot 25 = 900$。\n\n> **注意。** 直积的特征是各因子特征的最小公倍数，而不是它们的乘积：$\\mathbb{Z}_4 \\times \\mathbb{Z}_6$ 的特征是 $12$，不是 $24$。只要有一个因子的特征为 $0$，整个直积的特征就是 $0$。",
      ),
      generate(rng) {
        const ns = range(1, rng.int(2, 3)).map(() => rng.int(2, 20));
        const withZ = rng.bool(0.2);
        const value = withZ ? 0 : ns.reduce((a, b) => lcm(a, b), 1);
        const tex = [...(withZ ? ["\\mathbb{Z}"] : []), ...ns.map(zTex)].join(" \\times ");
        const unity = `(${[...(withZ ? [1] : []), ...ns.map(() => 1)].join(", ")})`;
        const zero: [string, string] = [
          "But $\\mathbb{Z}$ has characteristic $0$, so the product does too.",
          "但 $\\mathbb{Z}$ 的特征为 $0$，所以直积的特征也是 $0$。",
        ];
        const said = (v: number, en: string, zh: string) => (withZ ? why(v, `${en} ${zero[0]}`, `${zh}${zero[1]}`) : why(v, en, zh));
        return numberProblem({
          prompt: t(
            `Find the characteristic of $${tex}$. (Enter $0$ if the characteristic is $0$.)`,
            `求 $${tex}$ 的特征。（若特征为 $0$，填 $0$。）`,
          ),
          answer: value,
          mistakes: apart(value, [
            said(
              ns.reduce((a, b) => a * b, 1),
              "That multiplies the moduli; the characteristic is their least common multiple.",
              "那是把模相乘；特征是它们的最小公倍数。",
            ),
            said(
              Math.max(...ns),
              "That is the largest modulus; the unity must return to zero in every coordinate at once.",
              "那是最大的模；幺元必须在每个坐标上同时回到零。",
            ),
            said(
              ns.reduce((a, b) => gcd(a, b)),
              "That is the greatest common divisor; the characteristic is the least common multiple.",
              "那是最大公因数；特征是最小公倍数。",
            ),
            said(
              lcm(ns[0]!, ns[1]!),
              `That uses only $${ns[0]}$ and $${ns[1]}$; every modulus counts.`,
              `那只用了 $${ns[0]}$ 与 $${ns[1]}$；每个模都要算上。`,
            ),
          ]),
          solution: withZ
            ? walked(
                [
                  [
                    ["Look at the integer coordinate", "看整数坐标"],
                    t(
                      `The unity is $${unity}$, and its first coordinate is $1 \\in \\mathbb{Z}$.`,
                      `幺元为 $${unity}$，它的第一个坐标是 $1 \\in \\mathbb{Z}$。`,
                    ),
                  ],
                  [
                    ["Decide", "作出判断"],
                    t(
                      "No positive multiple of $1$ is $0$ in $\\mathbb{Z}$, so the characteristic is $0$.",
                      "在 $\\mathbb{Z}$ 中 $1$ 的正整数倍都不为 $0$，所以特征为 $0$。",
                    ),
                  ],
                ],
                t(
                  `For every $m \\ge 1$, $m${unity}$ has first coordinate $m \\ne 0$.`,
                  `对每个 $m \\ge 1$，$m${unity}$ 的第一个坐标为 $m \\ne 0$。`,
                ),
              )
            : walked(
                [
                  [
                    ["Find the unity", "找幺元"],
                    t(`The unity is $${unity}$, and the characteristic is its additive order.`, `幺元为 $${unity}$，特征就是它的加法阶。`),
                  ],
                  [
                    ["Take the least common multiple", "取最小公倍数"],
                    t(
                      `Each coordinate returns to $0$ after a multiple of its modulus, so all do first at $\\operatorname{lcm}(${ns.join(", ")}) = ${value}$.`,
                      `每个坐标在其模的倍数处回到 $0$，所以所有坐标首次同时回到 $0$ 是在 $\\operatorname{lcm}(${ns.join(", ")}) = ${value}$。`,
                    ),
                  ],
                ],
                t(
                  `$${ns.map((x) => `\\frac{${value}}{${x}} = ${value / x}`).join("$, $")}$ are whole numbers, so $${value}${unity}$ is zero in every coordinate.`,
                  `$${ns.map((x) => `\\frac{${value}}{${x}} = ${value / x}`).join("$，$")}$ 都是整数，所以 $${value}${unity}$ 的每个坐标都为零。`,
                ),
              ),
        });
      },
    },
    {
      id: "possible-characteristics-of-integral-domains",
      title: t("Characteristics of integral domains", "整环的特征"),
      explanation: t(
        "If an integral domain with unity $e$ had characteristic $6$, then $(2e)(3e) = 6e = 0$ with $2e \\ne 0$ and $3e \\ne 0$, a contradiction. So the characteristic is $0$ or prime.\n\nCharacteristic $91 = 7 \\cdot 13$ is impossible for the same reason: $(7e)(13e) = 91e = 0$. Characteristic $97$ is possible, since $97$ is prime and $\\mathbb{Z}_{97}$ is an integral domain.\n\nCheck: in $\\mathbb{Z}_{91}$, $7 \\cdot 13 = 0$ while $7$ and $13$ are nonzero, so $\\mathbb{Z}_{91}$ is indeed not an integral domain.\n\n> **Watch out.** Characteristic $0$ is possible too, as for $\\mathbb{Z}$ and $\\mathbb{Q}$. A composite characteristic always splits into two smaller factors, and those give zero divisors.",
        "若一个幺元为 $e$ 的整环特征为 $6$，则 $(2e)(3e) = 6e = 0$，而 $2e \\ne 0$、$3e \\ne 0$，矛盾。所以特征为 $0$ 或素数。\n\n特征 $91 = 7 \\cdot 13$ 由同样的理由不可能：$(7e)(13e) = 91e = 0$。特征 $97$ 是可能的，因为 $97$ 是素数，而 $\\mathbb{Z}_{97}$ 是整环。\n\n检验：在 $\\mathbb{Z}_{91}$ 中，$7 \\cdot 13 = 0$，而 $7$ 与 $13$ 都非零，所以 $\\mathbb{Z}_{91}$ 确实不是整环。\n\n> **注意。** 特征 $0$ 也是可能的，例如 $\\mathbb{Z}$ 与 $\\mathbb{Q}$。合数特征总能分成两个较小的因数，而它们给出零因子。",
      ),
      generate(rng) {
        const n = rng.int(2, 100);
        const prime = isPrime(n);
        const p = primesOf(n)[0]!;
        const prompt = t(`Can an integral domain have characteristic $${n}$?`, `整环的特征可以是 $${n}$ 吗？`);
        return decide(
          prime
            ? {
                prompt,
                holds: true,
                steps: [
                  [["Look at the number", "看这个数"], t(`$${n}$ is prime.`, `$${n}$ 是素数。`)],
                  [
                    ["Give an example", "举一个例子"],
                    t(
                      `$${zTex(n)}$ is an integral domain, and its characteristic is $${n}$: yes, it can.`,
                      `$${zTex(n)}$ 是整环，它的特征为 $${n}$：可以。`,
                    ),
                  ],
                ],
                check: t(
                  `In $${zTex(n)}$, $${n}$ copies of $1$ add up to $${n} \\equiv 0$, and fewer copies give a nonzero residue.`,
                  `在 $${zTex(n)}$ 中，$${n}$ 个 $1$ 相加得 $${n} \\equiv 0$，而更少的份数得到非零剩余。`,
                ),
                wrong: t(
                  `$${n}$ is prime, and $${zTex(n)}$ is an integral domain of characteristic $${n}$.`,
                  `$${n}$ 是素数，$${zTex(n)}$ 就是特征为 $${n}$ 的整环。`,
                ),
              }
            : {
                prompt,
                holds: false,
                steps: [
                  [
                    ["Factor the number", "分解这个数"],
                    t(
                      `$${n} = ${p} \\cdot ${n / p}$, with both factors less than $${n}$.`,
                      `$${n} = ${p} \\cdot ${n / p}$，两个因数都小于 $${n}$。`,
                    ),
                  ],
                  [
                    ["Find zero divisors", "找出零因子"],
                    t(
                      `With unity $e$, $(${p}e)(${n / p}e) = ${n}e = 0$, while $${p}e \\ne 0$ and $${n / p}e \\ne 0$: no, it cannot.`,
                      `设幺元为 $e$，则 $(${p}e)(${n / p}e) = ${n}e = 0$，而 $${p}e \\ne 0$、$${n / p}e \\ne 0$：不可以。`,
                    ),
                  ],
                ],
                check: t(
                  `In $${zTex(n)}$ itself, $${p} \\cdot ${n / p} = 0$ with both factors nonzero, so $${zTex(n)}$ is not an integral domain.`,
                  `在 $${zTex(n)}$ 中，$${p} \\cdot ${n / p} = 0$，两个因子都非零，所以 $${zTex(n)}$ 不是整环。`,
                ),
                wrong: t(
                  `$(${p}e)(${n / p}e) = ${n}e = 0$ would make $${p}e$ a zero divisor.`,
                  `$(${p}e)(${n / p}e) = ${n}e = 0$ 会使 $${p}e$ 成为零因子。`,
                ),
              },
        );
      },
    },
  ],
};

/** theUnitsOfARing counts units of products of ℤₙ and recognizes units of ℤ[√k]. */
export const theUnitsOfARing: TopicDef = {
  id: "the-units-of-a-ring",
  title: t("The Units of a Ring", "环的单位"),
  summary: t(
    "A unit of a ring with unity is an element with a multiplicative inverse; the units form a group U(R). U(ℤₙ) = U(n) has φ(n) elements, and U(R × S) = U(R) × U(S). In ℤ[√k], a + b√k is a unit exactly when its norm a² − kb² is ±1, since the norm is multiplicative.",
    "有幺元的环中有乘法逆元的元素称为单位；单位构成群 U(R)。U(ℤₙ) = U(n) 有 φ(n) 个元素，且 U(R × S) = U(R) × U(S)。在 ℤ[√k] 中，a + b√k 是单位当且仅当它的范数 a² − kb² 为 ±1，因为范数是可乘的。",
  ),
  intro: t(
    "In $\\mathbb{Z}_8 \\times \\mathbb{Z}_9$, $(3, 2)$ is a unit with inverse $(3, 5)$: $3 \\cdot 3 = 9 \\equiv 1 \\pmod 8$ and $2 \\cdot 5 = 10 \\equiv 1 \\pmod 9$. In all, the ring has $4 \\cdot 6 = 24$ units.\n\nCheck: $(3, 2)(3, 5) = (9, 10) = (1, 1)$, the unity.\n\nIn this lesson we count the units of product rings and recognize the units of $\\mathbb{Z}[\\sqrt k]$.",
    "在 $\\mathbb{Z}_8 \\times \\mathbb{Z}_9$ 中，$(3, 2)$ 是单位，逆为 $(3, 5)$：$3 \\cdot 3 = 9 \\equiv 1 \\pmod 8$，$2 \\cdot 5 = 10 \\equiv 1 \\pmod 9$。这个环共有 $4 \\cdot 6 = 24$ 个单位。\n\n检验：$(3, 2)(3, 5) = (9, 10) = (1, 1)$，正是幺元。\n\n本课我们数直积环的单位，并识别 $\\mathbb{Z}[\\sqrt k]$ 的单位。",
  ),
  prerequisites: ["introduction-to-fields"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-units-of-product-rings",
      title: t("Units of products", "直积的单位"),
      explanation: t(
        "An element of a product ring is a unit exactly when every coordinate is a unit, so multiply the numbers of units. $U(\\mathbb{Z}_8 \\times \\mathbb{Z}_9) = U(8) \\times U(9)$ has $4 \\cdot 6 = 24$ elements.\n\n$\\mathbb{Z}_{20} \\times \\mathbb{Z}_{21} \\times \\mathbb{Z}_{25}$ has $\\varphi(20)\\varphi(21)\\varphi(25) = 8 \\cdot 12 \\cdot 20 = 1920$ units.\n\nCheck: $\\varphi(20) = 20 \\cdot \\frac{1}{2} \\cdot \\frac{4}{5} = 8$, $\\varphi(21) = 2 \\cdot 6 = 12$ and $\\varphi(25) = 25 - 5 = 20$.\n\n> **Watch out.** Multiply the counts, do not add them, and do not use $\\varphi(mn)$: $\\mathbb{Z}_4 \\times \\mathbb{Z}_6$ has $2 \\cdot 2 = 4$ units, while $\\mathbb{Z}_{24}$ has $8$.",
        "直积环中的元素是单位，当且仅当每个坐标都是单位，所以把各自的单位个数相乘。$U(\\mathbb{Z}_8 \\times \\mathbb{Z}_9) = U(8) \\times U(9)$ 有 $4 \\cdot 6 = 24$ 个元素。\n\n$\\mathbb{Z}_{20} \\times \\mathbb{Z}_{21} \\times \\mathbb{Z}_{25}$ 有 $\\varphi(20)\\varphi(21)\\varphi(25) = 8 \\cdot 12 \\cdot 20 = 1920$ 个单位。\n\n检验：$\\varphi(20) = 20 \\cdot \\frac{1}{2} \\cdot \\frac{4}{5} = 8$，$\\varphi(21) = 2 \\cdot 6 = 12$，$\\varphi(25) = 25 - 5 = 20$。\n\n> **注意。** 要把个数相乘，不是相加，也不要用 $\\varphi(mn)$：$\\mathbb{Z}_4 \\times \\mathbb{Z}_6$ 有 $2 \\cdot 2 = 4$ 个单位，而 $\\mathbb{Z}_{24}$ 有 $8$ 个。",
      ),
      generate(rng) {
        const m = rng.int(3, 30);
        const n = rng.int(3, 30);
        const value = phi(m) * phi(n);
        const whole = phi(m * n);
        return numberProblem({
          prompt: t(`How many units does $${zTex(m)} \\times ${zTex(n)}$ have?`, `$${zTex(m)} \\times ${zTex(n)}$ 有多少个单位？`),
          answer: value,
          mistakes: apart(value, [
            why(
              phi(m) + phi(n),
              "That adds the counts; a pair is a unit when both coordinates are, so multiply them.",
              "那是把个数相加；有序对是单位当且仅当两个坐标都是单位，所以要相乘。",
            ),
            whole === value
              ? why(value + 1, "One too many: count exactly the pairs of units.", "多了一个：恰好数出由单位组成的有序对。")
              : why(
                  whole,
                  `That is $\\varphi(${m * n})$, the units of $${zTex(m * n)}$; since $\\gcd(${m}, ${n}) \\ne 1$, that ring is not $${zTex(m)} \\times ${zTex(n)}$.`,
                  `那是 $\\varphi(${m * n})$，即 $${zTex(m * n)}$ 的单位个数；由于 $\\gcd(${m}, ${n}) \\ne 1$，那个环不是 $${zTex(m)} \\times ${zTex(n)}$。`,
                ),
            why(
              m * n - 1,
              "That counts every nonzero pair; a pair is a unit only when both coordinates are units.",
              "那数的是所有非零有序对；有序对只有在两个坐标都是单位时才是单位。",
            ),
            why(
              (m - 1) * (n - 1),
              "That counts the pairs of nonzero coordinates; each coordinate must be coprime to its modulus, not just nonzero.",
              "那数的是两个坐标都非零的有序对；每个坐标必须与其模互素，而不仅仅是非零。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Work coordinate by coordinate", "逐个坐标考虑"],
                t(
                  "$(a, b)(c, d) = (1, 1)$ exactly when $ac = 1$ and $bd = 1$, so $(a, b)$ is a unit exactly when $a$ and $b$ both are.",
                  "$(a, b)(c, d) = (1, 1)$ 当且仅当 $ac = 1$ 且 $bd = 1$，所以 $(a, b)$ 是单位当且仅当 $a$ 与 $b$ 都是单位。",
                ),
              ],
              [
                ["Count the pairs", "数有序对"],
                t(
                  `$\\varphi(${m}) \\cdot \\varphi(${n}) = ${phi(m)} \\cdot ${phi(n)} = ${value}$.`,
                  `$\\varphi(${m}) \\cdot \\varphi(${n}) = ${phi(m)} \\cdot ${phi(n)} = ${value}$。`,
                ),
              ],
            ],
            t(
              `Of the $${m}$ residues, $${m - phi(m)}$ share a factor with $${m}$, leaving $${phi(m)}$; of the $${n}$, $${n - phi(n)}$ do, leaving $${phi(n)}$.`,
              `$${m}$ 个剩余中有 $${m - phi(m)}$ 个与 $${m}$ 有公因数，剩下 $${phi(m)}$ 个；$${n}$ 个中有 $${n - phi(n)}$ 个，剩下 $${phi(n)}$ 个。`,
            ),
          ),
        });
      },
    },
    {
      id: "units-of-quadratic-integer-rings",
      title: t("Units of $\\mathbb{Z}[\\sqrt{k}]$", "$\\mathbb{Z}[\\sqrt{k}]$ 的单位"),
      explanation: t(
        "The norm is multiplicative, so an element can be a unit only when its norm is a unit of the integers, plus or minus one. $3 + 2\\sqrt 2$ is a unit of $\\mathbb{Z}[\\sqrt 2]$: its norm is $9 - 8 = 1$, and $(3 + 2\\sqrt 2)(3 - 2\\sqrt 2) = 1$. $1 + \\sqrt 3$ is not a unit of $\\mathbb{Z}[\\sqrt 3]$: its norm is $-2$.\n\nIn $\\mathbb{Z}[\\sqrt{13}]$, $18 + 5\\sqrt{13}$ is a unit: its norm is $324 - 13 \\cdot 25 = -1$, so its inverse is $-(18 - 5\\sqrt{13}) = -18 + 5\\sqrt{13}$.\n\nCheck: $(18 + 5\\sqrt{13})(-18 + 5\\sqrt{13}) = -324 + 325 = 1$.\n\n> **Watch out.** A norm of $-1$ still gives a unit; the inverse then carries a minus sign. A norm such as $4$ does not: the inverse would need norm $\\frac{1}{4}$, which no element of $\\mathbb{Z}[\\sqrt k]$ has.",
        "范数是积性的，所以一个元素只有在它的范数是整数的单位，即正负 1 时，才可能是单位。$3 + 2\\sqrt 2$ 是 $\\mathbb{Z}[\\sqrt 2]$ 的单位：范数为 $9 - 8 = 1$，且 $(3 + 2\\sqrt 2)(3 - 2\\sqrt 2) = 1$。$1 + \\sqrt 3$ 不是 $\\mathbb{Z}[\\sqrt 3]$ 的单位：范数为 $-2$。\n\n在 $\\mathbb{Z}[\\sqrt{13}]$ 中，$18 + 5\\sqrt{13}$ 是单位：范数为 $324 - 13 \\cdot 25 = -1$，所以它的逆为 $-(18 - 5\\sqrt{13}) = -18 + 5\\sqrt{13}$。\n\n检验：$(18 + 5\\sqrt{13})(-18 + 5\\sqrt{13}) = -324 + 325 = 1$。\n\n> **注意。** 范数为 $-1$ 时仍是单位，只是逆元带一个负号。范数为 $4$ 之类时则不是：逆元的范数必须是 $\\frac{1}{4}$，而 $\\mathbb{Z}[\\sqrt k]$ 中没有这样的元素。",
      ),
      generate(rng) {
        const k = rng.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13]);
        let a: number;
        let b: number;
        if (rng.bool()) {
          // Search small solutions of a² − kb² = ±1.
          const sols = range(1, 40).flatMap((x) =>
            range(1, 12)
              .filter((y) => Math.abs(x * x - k * y * y) === 1)
              .map((y) => [x, y] as const),
          );
          [a, b] = sols.length > 0 ? rng.pick(sols) : [rng.int(1, 9), rng.int(1, 4)];
        } else {
          do {
            a = rng.int(1, 12);
            b = rng.int(1, 5);
          } while (Math.abs(a * a - k * b * b) === 1);
        }
        const sb = rng.bool() ? b : -b;
        const norm = a * a - k * b * b;
        const holds = Math.abs(norm) === 1;
        const kb2 = b === 1 ? `${k}` : `${k} \\cdot ${b}^2`;
        const x = surdTex(a, sb, k);
        const conj = surdTex(a, -sb, k);
        const inverse = norm === 1 ? conj : surdTex(-a, sb, k);
        const prompt = t(`Is $${x}$ a unit of $\\mathbb{Z}[\\sqrt{${k}}]$?`, `$${x}$ 是 $\\mathbb{Z}[\\sqrt{${k}}]$ 的单位吗？`);
        const normStep: Step = [
          ["Find the norm", "求范数"],
          t(`$N(${x}) = ${a}^2 - ${kb2} = ${norm}$.`, `$N(${x}) = ${a}^2 - ${kb2} = ${norm}$。`),
        ];
        return decide(
          holds
            ? {
                prompt,
                holds: true,
                steps: [
                  normStep,
                  [
                    ["Write the inverse", "写出逆元"],
                    t(
                      `$(${x})(${conj}) = ${norm}$, so the inverse is $${inverse}$: yes, it is a unit.`,
                      `$(${x})(${conj}) = ${norm}$，所以逆元为 $${inverse}$：是单位。`,
                    ),
                  ],
                ],
                check: t(
                  `$(${x})(${inverse}) = 1$, and $${inverse}$ has integer coefficients, so it lies in $\\mathbb{Z}[\\sqrt{${k}}]$.`,
                  `$(${x})(${inverse}) = 1$，且 $${inverse}$ 的系数都是整数，所以它在 $\\mathbb{Z}[\\sqrt{${k}}]$ 中。`,
                ),
                wrong: t(
                  `Its norm is $${norm}$, so $${inverse}$ is an inverse in $\\mathbb{Z}[\\sqrt{${k}}]$.`,
                  `它的范数为 $${norm}$，所以 $${inverse}$ 是它在 $\\mathbb{Z}[\\sqrt{${k}}]$ 中的逆元。`,
                ),
              }
            : {
                prompt,
                holds: false,
                steps: [
                  normStep,
                  [
                    ["Use that the norm multiplies", "利用范数的积性"],
                    t(
                      `If $(${x})\\beta = 1$, then $N(${x})N(\\beta) = N(1) = 1$, so $N(${x})$ would be $\\pm 1$; it is $${norm}$: no, it is not a unit.`,
                      `若 $(${x})\\beta = 1$，则 $N(${x})N(\\beta) = N(1) = 1$，所以 $N(${x})$ 应为 $\\pm 1$；而它是 $${norm}$：不是单位。`,
                    ),
                  ],
                ],
                check: t(
                  `In $\\mathbb{R}$ the inverse is $\\frac{${conj}}{${norm}}$, whose coefficients are not both integers since $|${norm}| > 1$ does not divide both $${a}$ and $${b}$.`,
                  `在 $\\mathbb{R}$ 中它的逆为 $\\frac{${conj}}{${norm}}$，由于 $|${norm}| > 1$ 不同时整除 $${a}$ 与 $${b}$，其系数不全是整数。`,
                ),
                wrong: t(
                  `Its norm is $${norm} \\ne \\pm 1$, and the norm of a unit must be $\\pm 1$.`,
                  `它的范数为 $${norm} \\ne \\pm 1$，而单位的范数必须为 $\\pm 1$。`,
                ),
              },
        );
      },
    },
  ],
};

/** detMod is the determinant of a 2 × 2 matrix modulo n. */
const detMod = (m: Mat2, n: number) => mod(m[0] * m[3] - m[1] * m[2], n);

/** findingTheInverseOfAMatrixOverARing decides invertibility over ℤₙ and inverts. */
export const findingTheInverseOfAMatrixOverARing: TopicDef = {
  id: "finding-the-inverse-of-a-matrix-over-a-ring",
  title: t("Finding the Inverse of a Matrix Over a Ring", "求环上矩阵的逆"),
  summary: t(
    "Over a commutative ring R with unity, a square matrix is invertible exactly when its determinant is a unit of R. For 2 × 2 matrices the usual formula applies: the inverse of (a b; c d) is (ad − bc)⁻¹ (d −b; −c a). Over ℤₙ, this means det A must be coprime to n.",
    "在有幺元的交换环 R 上，方阵可逆当且仅当它的行列式是 R 的单位。对 2 × 2 矩阵，通常的公式适用：(a b; c d) 的逆为 (ad − bc)⁻¹ (d −b; −c a)。在 ℤₙ 上，这意味着 det A 必须与 n 互素。",
  ),
  intro: t(
    "Over $\\mathbb{Z}_7$, $A = \\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$ has $\\det A = 8 - 3 = 5$, a unit since $5 \\cdot 3 = 15 \\equiv 1$. So $A^{-1} = 3\\begin{pmatrix} 4 & -1 \\\\ -3 & 2 \\end{pmatrix} = \\begin{pmatrix} 5 & 4 \\\\ 5 & 6 \\end{pmatrix}$.\n\nCheck: the top row of $AA^{-1}$ is $(10 + 5, 8 + 6) = (15, 14) \\equiv (1, 0)$.\n\nIn this lesson we decide when a matrix over $\\mathbb{Z}_n$ is invertible and find its inverse.",
    "在 $\\mathbb{Z}_7$ 上，$A = \\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$ 的 $\\det A = 8 - 3 = 5$，由于 $5 \\cdot 3 = 15 \\equiv 1$，它是单位。所以 $A^{-1} = 3\\begin{pmatrix} 4 & -1 \\\\ -3 & 2 \\end{pmatrix} = \\begin{pmatrix} 5 & 4 \\\\ 5 & 6 \\end{pmatrix}$。\n\n检验：$AA^{-1}$ 的第一行为 $(10 + 5, 8 + 6) = (15, 14) \\equiv (1, 0)$。\n\n本课我们判断 $\\mathbb{Z}_n$ 上的矩阵何时可逆，并求出它的逆。",
  ),
  prerequisites: ["the-units-of-a-ring"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "invertibility-of-matrices-over-zn",
      title: t("Invertible or not", "是否可逆"),
      explanation: t(
        "Over $\\mathbb{Z}_{10}$, $\\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$ has determinant $5$, which is not a unit modulo $10$, so it is not invertible, even though its determinant is nonzero.\n\nOver $\\mathbb{Z}_{26}$, $\\begin{pmatrix} 5 & 8 \\\\ 17 & 3 \\end{pmatrix}$ has determinant $15 - 136 = -121 \\equiv 9$, and $\\gcd(9, 26) = 1$, so it is invertible.\n\nCheck: $9 \\cdot 3 = 27 \\equiv 1 \\pmod{26}$, so the determinant does have an inverse, $3$.\n\n> **Watch out.** Over $\\mathbb{Z}_n$, a nonzero determinant is not enough: it must be coprime to $n$. Only over a field such as $\\mathbb{Z}_p$ does every nonzero determinant work.",
        "在 $\\mathbb{Z}_{10}$ 上，$\\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$ 的行列式为 $5$，它模 $10$ 不是单位，所以不可逆，尽管行列式非零。\n\n在 $\\mathbb{Z}_{26}$ 上，$\\begin{pmatrix} 5 & 8 \\\\ 17 & 3 \\end{pmatrix}$ 的行列式为 $15 - 136 = -121 \\equiv 9$，而 $\\gcd(9, 26) = 1$，所以它可逆。\n\n检验：$9 \\cdot 3 = 27 \\equiv 1 \\pmod{26}$，所以行列式确实有逆元 $3$。\n\n> **注意。** 在 $\\mathbb{Z}_n$ 上，行列式非零还不够：它必须与 $n$ 互素。只有在 $\\mathbb{Z}_p$ 这样的域上，每个非零行列式才都可以。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(6, 26);
        while (isPrime(n));
        let m: Mat2;
        do m = [rng.int(0, n - 1), rng.int(0, n - 1), rng.int(0, n - 1), rng.int(0, n - 1)];
        while (detMod(m, n) === 0);
        const d = detMod(m, n);
        const g = gcd(d, n);
        const holds = g === 1;
        const raw = m[0] * m[3] - m[1] * m[2];
        const di = holds ? modInverse(d, n) : 0;
        return decide({
          prompt: t(`Is $${mat2Tex(m)}$ invertible over $${zTex(n)}$?`, `$${mat2Tex(m)}$ 在 $${zTex(n)}$ 上可逆吗？`),
          holds,
          steps: [
            [
              ["Find the determinant", "求行列式"],
              t(
                `$(${m[0]})(${m[3]}) - (${m[1]})(${m[2]}) = ${raw} \\equiv ${d} \\pmod{${n}}$.`,
                `$(${m[0]})(${m[3]}) - (${m[1]})(${m[2]}) = ${raw} \\equiv ${d} \\pmod{${n}}$。`,
              ),
            ],
            [
              ["Decide whether it is a unit", "判断它是否为单位"],
              holds
                ? t(
                    `$\\gcd(${d}, ${n}) = 1$, so $${d}$ is a unit of $${zTex(n)}$: yes, the matrix is invertible.`,
                    `$\\gcd(${d}, ${n}) = 1$，所以 $${d}$ 是 $${zTex(n)}$ 的单位：矩阵可逆。`,
                  )
                : t(
                    `$\\gcd(${d}, ${n}) = ${g}$, so $${d}$ is not a unit of $${zTex(n)}$: no, the matrix is not invertible.`,
                    `$\\gcd(${d}, ${n}) = ${g}$，所以 $${d}$ 不是 $${zTex(n)}$ 的单位：矩阵不可逆。`,
                  ),
            ],
          ],
          check: holds
            ? d === 1
              ? t("The determinant is $1$ itself, so the inverse is just the adjugate.", "行列式本身就是 $1$，所以逆矩阵就是伴随矩阵。")
              : t(
                  `$${d} \\cdot ${di} = ${d * di} \\equiv 1 \\pmod{${n}}$, so the inverse is $${di}$ times the adjugate.`,
                  `$${d} \\cdot ${di} = ${d * di} \\equiv 1 \\pmod{${n}}$，所以逆矩阵是伴随矩阵的 $${di}$ 倍。`,
                )
            : t(
                `$${d} \\cdot ${n / g} = ${d * (n / g)} \\equiv 0 \\pmod{${n}}$, so the determinant is a zero divisor and has no inverse.`,
                `$${d} \\cdot ${n / g} = ${d * (n / g)} \\equiv 0 \\pmod{${n}}$，所以行列式是零因子，没有逆元。`,
              ),
          wrong: holds
            ? t(
                `Its determinant $${d}$ is coprime to $${n}$, so it is a unit and the matrix is invertible.`,
                `它的行列式 $${d}$ 与 $${n}$ 互素，是单位，所以矩阵可逆。`,
              )
            : t(
                `Its determinant $${d}$ shares the factor $${g}$ with $${n}$, so it is not a unit, although it is nonzero.`,
                `它的行列式 $${d}$ 与 $${n}$ 有公因数 $${g}$，所以虽然非零，却不是单位。`,
              ),
        });
      },
    },
    {
      id: "inverting-matrices-over-zn",
      title: t("Inverting over $\\mathbb{Z}_n$", "在 $\\mathbb{Z}_n$ 上求逆"),
      explanation: t(
        "The usual formula for an inverse works over residues, with division by the determinant replaced by multiplication by its inverse. Over $\\mathbb{Z}_7$, $A = \\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$ has $\\det A = 5$ and $5^{-1} = 3$, so $A^{-1} = 3\\begin{pmatrix} 4 & -1 \\\\ -3 & 2 \\end{pmatrix} = \\begin{pmatrix} 5 & 4 \\\\ 5 & 6 \\end{pmatrix}$.\n\nOver $\\mathbb{Z}_{26}$, $A = \\begin{pmatrix} 5 & 8 \\\\ 17 & 3 \\end{pmatrix}$ has $\\det A = 9$ and $9^{-1} = 3$, so $A^{-1} = 3\\begin{pmatrix} 3 & -8 \\\\ -17 & 5 \\end{pmatrix} = \\begin{pmatrix} 9 & -24 \\\\ -51 & 15 \\end{pmatrix} \\equiv \\begin{pmatrix} 9 & 2 \\\\ 1 & 15 \\end{pmatrix}$.\n\nCheck: the top row of $AA^{-1}$ is $(45 + 8, 10 + 120) = (53, 130) \\equiv (1, 0) \\pmod{26}$.\n\n> **Watch out.** Multiply the adjugate by the inverse of the determinant, not by the determinant itself. In the adjugate the diagonal entries swap places, while the other two entries stay in place and change sign.",
        "求逆的常用公式在剩余类上同样适用，只是除以行列式要换成乘以它的逆元。在 $\\mathbb{Z}_7$ 上，$A = \\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$ 的 $\\det A = 5$，$5^{-1} = 3$，所以 $A^{-1} = 3\\begin{pmatrix} 4 & -1 \\\\ -3 & 2 \\end{pmatrix} = \\begin{pmatrix} 5 & 4 \\\\ 5 & 6 \\end{pmatrix}$。\n\n在 $\\mathbb{Z}_{26}$ 上，$A = \\begin{pmatrix} 5 & 8 \\\\ 17 & 3 \\end{pmatrix}$ 的 $\\det A = 9$，$9^{-1} = 3$，所以 $A^{-1} = 3\\begin{pmatrix} 3 & -8 \\\\ -17 & 5 \\end{pmatrix} = \\begin{pmatrix} 9 & -24 \\\\ -51 & 15 \\end{pmatrix} \\equiv \\begin{pmatrix} 9 & 2 \\\\ 1 & 15 \\end{pmatrix}$。\n\n检验：$AA^{-1}$ 的第一行为 $(45 + 8, 10 + 120) = (53, 130) \\equiv (1, 0) \\pmod{26}$。\n\n> **注意。** 要把伴随矩阵乘以行列式的逆元，而不是乘以行列式本身。伴随矩阵中对角元互换位置，另外两个元素位置不变、改变符号。",
      ),
      generate(rng) {
        const n = rng.pick([5, 7, 9, 10, 11, 12, 13, 15]);
        let m: Mat2;
        do m = [rng.int(0, n - 1), rng.int(0, n - 1), rng.int(0, n - 1), rng.int(0, n - 1)];
        while (gcd(detMod(m, n), n) !== 1 || detMod(m, n) === 1);
        const d = detMod(m, n);
        const di = modInverse(d, n);
        const inv: Mat2 = [mod(di * m[3], n), mod(-di * m[1], n), mod(-di * m[2], n), mod(di * m[0], n)];
        const adj: Mat2 = [m[3], mod(-m[1], n), mod(-m[2], n), m[0]];
        const scaled: Mat2 = [mod(d * m[3], n), mod(-d * m[1], n), mod(-d * m[2], n), mod(d * m[0], n)];
        const raw = m[0] * m[3] - m[1] * m[2];
        return reasoned(
          texChoice(
            rng,
            t(`Find the inverse of $${mat2Tex(m)}$ over $${zTex(n)}$.`, `求 $${mat2Tex(m)}$ 在 $${zTex(n)}$ 上的逆。`),
            mat2Tex(inv),
            [mat2Tex(adj), mat2Tex(scaled), mat2Tex([inv[3], inv[1], inv[2], inv[0]]), mat2Tex([inv[0], inv[2], inv[1], inv[3]])],
            walked(
              [
                [
                  ["Invert the determinant", "求行列式的逆元"],
                  t(
                    `$\\det = ${raw} \\equiv ${d}$, and $${d} \\cdot ${di} = ${d * di} \\equiv 1$, so $${d}^{-1} = ${di}$ in $${zTex(n)}$.`,
                    `$\\det = ${raw} \\equiv ${d}$，而 $${d} \\cdot ${di} = ${d * di} \\equiv 1$，所以在 $${zTex(n)}$ 中 $${d}^{-1} = ${di}$。`,
                  ),
                ],
                [
                  ["Scale the adjugate", "缩放伴随矩阵"],
                  t(
                    `The adjugate is $${mat2Tex(adj)}$, so the inverse is $${di}${mat2Tex(adj)} \\equiv ${mat2Tex(inv)}$.`,
                    `伴随矩阵为 $${mat2Tex(adj)}$，所以逆为 $${di}${mat2Tex(adj)} \\equiv ${mat2Tex(inv)}$。`,
                  ),
                ],
              ],
              t(
                `$${mat2Tex(m)}${mat2Tex(inv)} = ${mat2Tex(mulMat(m, inv))} \\equiv ${mat2Tex([1, 0, 0, 1])} \\pmod{${n}}$.`,
                `$${mat2Tex(m)}${mat2Tex(inv)} = ${mat2Tex(mulMat(m, inv))} \\equiv ${mat2Tex([1, 0, 0, 1])} \\pmod{${n}}$。`,
              ),
            ),
          ),
          [
            because(
              mat2Tex(adj),
              `That is the adjugate before scaling; it still has to be multiplied by $${d}^{-1} = ${di}$.`,
              `那是缩放前的伴随矩阵；还要乘以 $${d}^{-1} = ${di}$。`,
            ),
            because(
              mat2Tex(scaled),
              `That multiplies the adjugate by $\\det = ${d}$ instead of by its inverse $${di}$.`,
              `那是把伴随矩阵乘以 $\\det = ${d}$，而不是乘以它的逆元 $${di}$。`,
            ),
            because(
              mat2Tex([inv[3], inv[1], inv[2], inv[0]]),
              "That swaps the diagonal entries of the inverse back; the adjugate swaps the diagonal of the matrix only once.",
              "那把逆矩阵的对角元又换了回去；伴随矩阵只把原矩阵的对角元互换一次。",
            ),
            because(
              mat2Tex([inv[0], inv[2], inv[1], inv[3]]),
              "That is the transpose of the inverse; the off-diagonal entries stay in place and only change sign.",
              "那是逆矩阵的转置；非对角元位置不变，只改变符号。",
            ),
          ],
        );
      },
    },
  ],
};

/** theFieldOfQuotientsOfAnIntegralDomain identifies equal fractions and fields of quotients. */
export const theFieldOfQuotientsOfAnIntegralDomain: TopicDef = {
  id: "the-field-of-quotients-of-an-integral-domain",
  title: t("The Field of Quotients of an Integral Domain", "整环的分式域"),
  summary: t(
    "Every integral domain D lies in a smallest field, its field of quotients: the fractions a/b with a, b ∈ D, b ≠ 0, where a/b = c/d exactly when ad = bc. The field of quotients of ℤ is ℚ, of ℤ[√k] is ℚ(√k), of ℤ[i] is ℚ(i), of F[x] is the field F(x) of rational functions, and of a field F is F itself.",
    "每个整环 D 都包含于一个最小的域，即它的分式域：由分式 a/b（a, b ∈ D，b ≠ 0）组成，其中 a/b = c/d 当且仅当 ad = bc。ℤ 的分式域为 ℚ，ℤ[√k] 的为 ℚ(√k)，ℤ[i] 的为 ℚ(i)，F[x] 的为有理函数域 F(x)，域 F 的分式域就是 F 自身。",
  ),
  intro: t(
    "The fractions $\\frac{a}{b}$ of integers with $b \\ne 0$ form $\\mathbb{Q}$, the field of quotients of $\\mathbb{Z}$, and $\\frac{2}{6} = \\frac{3}{9}$ because $2 \\cdot 9 = 18 = 6 \\cdot 3$.\n\nCheck: both fractions reduce to $\\frac{1}{3}$.\n\nIn this lesson we decide when two fractions are equal and identify the field of quotients of an integral domain.",
    "整数分式 $\\frac{a}{b}$（$b \\ne 0$）构成 $\\mathbb{Q}$，即 $\\mathbb{Z}$ 的分式域；$\\frac{2}{6} = \\frac{3}{9}$，因为 $2 \\cdot 9 = 18 = 6 \\cdot 3$。\n\n检验：两个分式都约分为 $\\frac{1}{3}$。\n\n本课我们判断两个分式何时相等，并确定整环的分式域。",
  ),
  prerequisites: ["introduction-to-fields"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "equal-fractions-in-a-field-of-quotients",
      title: t("Equal fractions", "相等的分式"),
      explanation: t(
        "Two fractions are equal when cross multiplication gives the same product, exactly as for ordinary fractions of integers. In the field of quotients of $\\mathbb{Z}[\\sqrt 2]$, $\\frac{\\sqrt 2}{2} = \\frac{1}{\\sqrt 2}$, since $(\\sqrt 2)(\\sqrt 2) = (2)(1)$.\n\nIn the field of quotients of $\\mathbb{Z}[\\sqrt 7]$, $\\frac{3}{5\\sqrt 7} = \\frac{6\\sqrt 7}{70}$: cross multiplying gives $(3)(70) = 210$ and $(5\\sqrt 7)(6\\sqrt 7) = 30 \\cdot 7 = 210$.\n\nCheck: both fractions simplify to $\\frac{3\\sqrt 7}{35}$.\n\n> **Watch out.** Compare the cross products, not the numerators and denominators separately: $\\frac{1}{2} = \\frac{2}{4}$ although $1 \\ne 2$. When you cross multiply, $\\sqrt k \\cdot \\sqrt k = k$.",
        "两个分式相等，当且仅当交叉相乘得到相同的乘积，这与普通整数分数完全一样。在 $\\mathbb{Z}[\\sqrt 2]$ 的分式域中，$\\frac{\\sqrt 2}{2} = \\frac{1}{\\sqrt 2}$，因为 $(\\sqrt 2)(\\sqrt 2) = (2)(1)$。\n\n在 $\\mathbb{Z}[\\sqrt 7]$ 的分式域中，$\\frac{3}{5\\sqrt 7} = \\frac{6\\sqrt 7}{70}$：交叉相乘得 $(3)(70) = 210$ 与 $(5\\sqrt 7)(6\\sqrt 7) = 30 \\cdot 7 = 210$。\n\n检验：两个分式都化简为 $\\frac{3\\sqrt 7}{35}$。\n\n> **注意。** 要比较交叉乘积，而不是分别比较分子和分母：$\\frac{1}{2} = \\frac{2}{4}$，尽管 $1 \\ne 2$。交叉相乘时，$\\sqrt k \\cdot \\sqrt k = k$。",
      ),
      generate(rng) {
        const k = nonSquare(rng);
        const a = rng.int(1, 6);
        const b = rng.nonZero(-4, 4);
        // a/b√k = c/d with c = a√k·m, d = bk·m, or a perturbed version.
        const m = rng.int(1, 3);
        const equal = rng.bool();
        const c = surdTex(0, a * m, k);
        const shifted = b * k * m + (equal ? 0 : rng.nonZero(-2, 2));
        // A zero denominator is not a fraction; double the true denominator instead.
        const dVal = shifted === 0 ? 2 * b * k * m : shifted;
        const left = `\\frac{${a}}{${surdTex(0, b, k)}}`;
        const right = `\\frac{${c}}{${dVal}}`;
        const holds = dVal === b * k * m;
        const simple = `\\frac{${surdTex(0, a, k)}}{${b * k}}`;
        return decide({
          prompt: t(
            `In the field of quotients of $\\mathbb{Z}[\\sqrt{${k}}]$, is $${left} = ${right}$?`,
            `在 $\\mathbb{Z}[\\sqrt{${k}}]$ 的分式域中，$${left} = ${right}$ 吗？`,
          ),
          holds,
          steps: [
            [["Multiply one way", "沿一条对角线相乘"], t(`$(${a})(${dVal}) = ${a * dVal}$.`, `$(${a})(${dVal}) = ${a * dVal}$。`)],
            [
              ["Multiply the other way", "沿另一条对角线相乘"],
              t(
                `$(${surdTex(0, b, k)})(${c}) = ${a * m * b * k}$, since $\\sqrt{${k}} \\cdot \\sqrt{${k}} = ${k}$, which ${holds ? "agrees: yes, the fractions are equal" : "differs: no, the fractions are not equal"}.`,
                `$(${surdTex(0, b, k)})(${c}) = ${a * m * b * k}$（因为 $\\sqrt{${k}} \\cdot \\sqrt{${k}} = ${k}$），两者${holds ? "相等：两个分式相等" : "不等：两个分式不相等"}。`,
              ),
            ],
          ],
          check: holds
            ? t(
                `Multiplying the top and bottom of $${left}$ by $\\sqrt{${k}}$ gives $${simple}$, and $${right}$ ${m === 1 ? "is exactly that" : `is that with top and bottom multiplied by $${m}$`}.`,
                `把 $${left}$ 的分子分母同乘 $\\sqrt{${k}}$ 得 $${simple}$，而 $${right}$ ${m === 1 ? "恰好就是它" : `是它的分子分母同乘 $${m}$`}。`,
              )
            : t(
                `$${left} = ${simple}$, so the right side would need denominator $${b * k * m}$, not $${dVal}$.`,
                `$${left} = ${simple}$，所以右边的分母应为 $${b * k * m}$，而不是 $${dVal}$。`,
              ),
          wrong: holds
            ? t(`The cross products are both $${a * dVal}$, so the fractions are equal.`, `两个交叉乘积都是 $${a * dVal}$，所以分式相等。`)
            : t(
                `The cross products $${a * dVal}$ and $${a * m * b * k}$ differ, so the fractions are not equal.`,
                `交叉乘积 $${a * dVal}$ 与 $${a * m * b * k}$ 不等，所以分式不相等。`,
              ),
        });
      },
    },
    {
      id: "identifying-fields-of-quotients",
      title: t("Identifying fields of quotients", "识别分式域"),
      explanation: t(
        "The field of quotients is the smallest field containing the ring, obtained by allowing division by every nonzero element. The field of quotients of $\\mathbb{Z}[i]$ is $\\mathbb{Q}(i) = \\{a + bi : a, b \\in \\mathbb{Q}\\}$: every $\\frac{a + bi}{c + di}$ simplifies to this form by multiplying by $\\frac{c - di}{c - di}$.\n\nThe field of quotients of $\\mathbb{Z}[\\sqrt{11}]$ is $\\mathbb{Q}(\\sqrt{11})$: for instance $\\frac{2 + \\sqrt{11}}{3 - \\sqrt{11}} = \\frac{(2 + \\sqrt{11})(3 + \\sqrt{11})}{9 - 11} = \\frac{17 + 5\\sqrt{11}}{-2}$.\n\nCheck: $-\\frac{17}{2} - \\frac{5}{2}\\sqrt{11}$ has rational coefficients, as an element of $\\mathbb{Q}(\\sqrt{11})$ must.\n\n> **Watch out.** The field of quotients is the smallest field containing the ring, not just any field that contains it: $\\mathbb{R}$ contains $\\mathbb{Z}[\\sqrt 2]$ but is far too big. And a field is its own field of quotients.",
        "分式域是包含这个环的最小的域，通过允许除以每个非零元素而得到。$\\mathbb{Z}[i]$ 的分式域为 $\\mathbb{Q}(i) = \\{a + bi : a, b \\in \\mathbb{Q}\\}$：每个 $\\frac{a + bi}{c + di}$ 乘以 $\\frac{c - di}{c - di}$ 后都化为这种形式。\n\n$\\mathbb{Z}[\\sqrt{11}]$ 的分式域为 $\\mathbb{Q}(\\sqrt{11})$：例如 $\\frac{2 + \\sqrt{11}}{3 - \\sqrt{11}} = \\frac{(2 + \\sqrt{11})(3 + \\sqrt{11})}{9 - 11} = \\frac{17 + 5\\sqrt{11}}{-2}$。\n\n检验：$-\\frac{17}{2} - \\frac{5}{2}\\sqrt{11}$ 的系数都是有理数，$\\mathbb{Q}(\\sqrt{11})$ 的元素本应如此。\n\n> **注意。** 分式域是包含这个环的最小的域，而不是任意一个包含它的域：$\\mathbb{R}$ 包含 $\\mathbb{Z}[\\sqrt 2]$，但大得多。而域的分式域就是它自身。",
      ),
      generate(rng) {
        const k = nonSquare(rng);
        const p = rng.pick([2, 3, 5, 7, 11, 13]);
        const zp = zTex(p);
        const charZero = (field: string): Reason => [
          `$${field}$`,
          `$${field}$ has characteristic $0$, but in $${zp}$ the sum of $${p}$ copies of $1$ is $0$.`,
          `$${field}$ 的特征为 $0$，而在 $${zp}$ 中 $${p}$ 个 $1$ 之和为 $0$。`,
        ];
        interface Case {
          readonly d: string;
          readonly right: string;
          readonly wrong: readonly string[];
          readonly reasons: readonly Reason[];
          readonly every: Text;
          readonly check: Text;
        }
        const cases: Case[] = [
          {
            d: `\\mathbb{Z}[\\sqrt{${k}}]`,
            right: `\\mathbb{Q}(\\sqrt{${k}})`,
            wrong: ["\\mathbb{Q}", "\\mathbb{R}", `\\mathbb{Z}[\\sqrt{${k}}]`],
            reasons: [
              because(
                "\\mathbb{Q}",
                `$\\mathbb{Q}$ does not contain $\\sqrt{${k}}$, which is in the ring.`,
                `$\\mathbb{Q}$ 不含环中的 $\\sqrt{${k}}$。`,
              ),
              because(
                "\\mathbb{R}",
                "$\\mathbb{R}$ contains the ring but is far bigger: $\\pi$ is not a quotient of its elements.",
                "$\\mathbb{R}$ 包含这个环，但大得多：$\\pi$ 不是其元素之商。",
              ),
              because(
                `\\mathbb{Z}[\\sqrt{${k}}]`,
                "That is the ring itself, which is not a field: $\\frac{1}{2}$ is missing.",
                "那是这个环本身，它不是域：缺少 $\\frac{1}{2}$。",
              ),
              because(
                "\\mathbb{C}",
                "$\\mathbb{C}$ contains the ring but is far bigger: $i$ is not a quotient of real numbers.",
                "$\\mathbb{C}$ 包含这个环，但大得多：$i$ 不是实数之商。",
              ),
            ],
            every: t(
              `With a common denominator $q$, $\\frac{r}{q} + \\frac{s}{q}\\sqrt{${k}} = \\frac{r + s\\sqrt{${k}}}{q}$ is a quotient of elements of the ring.`,
              `取公分母 $q$，$\\frac{r}{q} + \\frac{s}{q}\\sqrt{${k}} = \\frac{r + s\\sqrt{${k}}}{q}$ 是环中元素之商。`,
            ),
            check: t(
              `$\\frac{1}{\\sqrt{${k}}} = \\frac{\\sqrt{${k}}}{${k}}$, a quotient of ring elements, has rational coefficients $0$ and $\\frac{1}{${k}}$.`,
              `$\\frac{1}{\\sqrt{${k}}} = \\frac{\\sqrt{${k}}}{${k}}$ 是环中元素之商，系数为有理数 $0$ 与 $\\frac{1}{${k}}$。`,
            ),
          },
          {
            d: `\\mathbb{Q}(\\sqrt{${k}})`,
            right: `\\mathbb{Q}(\\sqrt{${k}})`,
            wrong: ["\\mathbb{Q}", "\\mathbb{R}", `\\mathbb{Q}(\\sqrt{${k + 1}})`],
            reasons: [
              because("\\mathbb{Q}", `$\\mathbb{Q}$ does not contain $\\sqrt{${k}}$.`, `$\\mathbb{Q}$ 不含 $\\sqrt{${k}}$。`),
              because(
                "\\mathbb{R}",
                "$\\mathbb{R}$ is bigger than needed; a field is its own field of quotients.",
                "$\\mathbb{R}$ 比所需的大；域的分式域就是它自身。",
              ),
              because(
                `\\mathbb{Q}(\\sqrt{${k + 1}})`,
                `That is generated by $\\sqrt{${k + 1}}$, and it does not contain $\\sqrt{${k}}$.`,
                `那是由 $\\sqrt{${k + 1}}$ 生成的，它不含 $\\sqrt{${k}}$。`,
              ),
              because(
                "\\mathbb{C}",
                "$\\mathbb{C}$ is bigger than needed; a field is its own field of quotients.",
                "$\\mathbb{C}$ 比所需的大；域的分式域就是它自身。",
              ),
            ],
            every: t(
              "The ring is already a field, and each of its elements $x$ is the quotient $\\frac{x}{1}$.",
              "这个环已经是域，它的每个元素 $x$ 都是商 $\\frac{x}{1}$。",
            ),
            check: t(
              `A quotient $\\frac{x}{y}$ with $y \\ne 0$ is $x \\cdot y^{-1}$, and $y^{-1}$ already lies in $\\mathbb{Q}(\\sqrt{${k}})$.`,
              `商 $\\frac{x}{y}$（$y \\ne 0$）就是 $x \\cdot y^{-1}$，而 $y^{-1}$ 已经在 $\\mathbb{Q}(\\sqrt{${k}})$ 中。`,
            ),
          },
          {
            d: `${zp}[x]`,
            right: `${zp}(x)`,
            wrong: [zp, "\\mathbb{Q}(x)", `${zp}[x]`],
            reasons: [
              because(zp, "That is the field of constants; it does not contain $x$.", "那是常数域；它不含 $x$。"),
              charZero("\\mathbb{Q}(x)"),
              because(
                `${zp}[x]`,
                "That is the ring itself, which is not a field: $x$ has no inverse in it.",
                "那是这个环本身，它不是域：$x$ 在其中没有逆元。",
              ),
              charZero("\\mathbb{C}"),
            ],
            every: t(
              `An element of $${zp}(x)$ is a rational function $\\frac{f}{g}$, by definition a quotient of polynomials in $${zp}[x]$.`,
              `$${zp}(x)$ 的元素是有理函数 $\\frac{f}{g}$，按定义就是 $${zp}[x]$ 中多项式之商。`,
            ),
            check: t(
              `$\\frac{1}{x}$ is a quotient of polynomials, and it is not a polynomial, so the field is bigger than $${zp}[x]$.`,
              `$\\frac{1}{x}$ 是多项式之商，但它不是多项式，所以这个域比 $${zp}[x]$ 大。`,
            ),
          },
          {
            d: `${zp}`,
            right: zp,
            wrong: ["\\mathbb{Q}", `${zp}(x)`, "\\mathbb{Z}"],
            reasons: [
              charZero("\\mathbb{Q}"),
              because(
                `${zp}(x)`,
                `That is bigger than needed: $${zp}$ is already a field, its own field of quotients.`,
                `那比所需的大：$${zp}$ 已经是域，它的分式域就是它自身。`,
              ),
              charZero("\\mathbb{Z}"),
              charZero("\\mathbb{C}"),
            ],
            every: t(
              `$${p}$ is prime, so $${zp}$ is a field, and each element $x$ is the quotient $\\frac{x}{1}$.`,
              `$${p}$ 是素数，所以 $${zp}$ 是域，每个元素 $x$ 都是商 $\\frac{x}{1}$。`,
            ),
            check: t(
              `A quotient $\\frac{a}{b}$ with $b \\ne 0$ is $ab^{-1}$, and $b^{-1}$ exists in $${zp}$ because $\\gcd(b, ${p}) = 1$.`,
              `商 $\\frac{a}{b}$（$b \\ne 0$）就是 $ab^{-1}$，而由于 $\\gcd(b, ${p}) = 1$，$b^{-1}$ 在 $${zp}$ 中存在。`,
            ),
          },
          {
            d: `\\mathbb{Z}[${k}i]`,
            right: "\\mathbb{Q}(i)",
            wrong: ["\\mathbb{Q}", "\\mathbb{C}", `\\mathbb{Z}[${k}i]`],
            reasons: [
              because("\\mathbb{Q}", `$\\mathbb{Q}$ does not contain $${k}i$, which is in the ring.`, `$\\mathbb{Q}$ 不含环中的 $${k}i$。`),
              because(
                "\\mathbb{C}",
                "$\\mathbb{C}$ is far bigger: $\\sqrt 2$ is not a quotient of elements of the ring.",
                "$\\mathbb{C}$ 大得多：$\\sqrt 2$ 不是环中元素之商。",
              ),
              because(
                `\\mathbb{Z}[${k}i]`,
                "That is the ring itself, which is not a field: $\\frac{1}{2}$ is missing.",
                "那是这个环本身，它不是域：缺少 $\\frac{1}{2}$。",
              ),
            ],
            every: t(
              `$i = \\frac{${k}i}{${k}}$ is a quotient of ring elements, so every $r + si$ with rational $r$ and $s$ is one too.`,
              `$i = \\frac{${k}i}{${k}}$ 是环中元素之商，所以每个有理数 $r$、$s$ 的 $r + si$ 也是。`,
            ),
            check: t(
              `Every element $a + ${k}bi$ of the ring has rational real and imaginary parts, so all quotients lie in $\\mathbb{Q}(i)$.`,
              `环中每个元素 $a + ${k}bi$ 的实部和虚部都是有理数，所以所有的商都在 $\\mathbb{Q}(i)$ 中。`,
            ),
          },
        ];
        const pick = rng.pick(cases);
        return reasoned(
          texChoice(
            rng,
            t(`What is the field of quotients of the integral domain $${pick.d}$?`, `整环 $${pick.d}$ 的分式域是什么？`),
            pick.right,
            [...pick.wrong, "\\mathbb{C}"],
            walked(
              [
                [
                  ["Show the quotients lie in it", "说明商都在其中"],
                  t(
                    `$${pick.right}$ is a field containing $${pick.d}$, so every quotient of elements of $${pick.d}$ lies in it.`,
                    `$${pick.right}$ 是包含 $${pick.d}$ 的域，所以 $${pick.d}$ 中元素的每个商都在其中。`,
                  ),
                ],
                [["Show every element is a quotient", "说明每个元素都是商"], pick.every],
              ],
              pick.check,
            ),
          ),
          pick.reasons,
        );
      },
    },
  ],
};

/** subrings decides which subsets are subrings and counts the subrings of ℤₙ. */
export const subrings: TopicDef = {
  id: "subrings",
  title: t("Subrings", "子环"),
  summary: t(
    "A subset S of a ring R is a subring if it is a ring under the operations of R. By the subring test, a nonempty S is a subring exactly when it is closed under subtraction and multiplication. The subrings of ℤ are the nℤ, and the subrings of ℤₙ are its additive subgroups ⟨d⟩, one for each divisor d of n.",
    "环 R 的子集 S 若在 R 的运算下构成环，则称为子环。由子环判定法，非空 S 是子环当且仅当它对减法和乘法封闭。ℤ 的子环是各 nℤ，ℤₙ 的子环就是它的加法子群 ⟨d⟩，n 的每个因数 d 对应一个。",
  ),
  intro: t(
    "$4\\mathbb{Z}$ is a subring of $\\mathbb{Z}$: for $8$ and $12$, the difference $8 - 12 = -4$ and the product $8 \\cdot 12 = 96$ are again multiples of $4$, and the same holds for any two multiples of $4$.\n\nCheck: $-4 = 4 \\cdot (-1)$ and $96 = 4 \\cdot 24$.\n\nIn this lesson we apply the subring test and count the subrings of $\\mathbb{Z}_n$.",
    "$4\\mathbb{Z}$ 是 $\\mathbb{Z}$ 的子环：对 $8$ 与 $12$，差 $8 - 12 = -4$ 与积 $8 \\cdot 12 = 96$ 仍是 $4$ 的倍数，任意两个 $4$ 的倍数都是如此。\n\n检验：$-4 = 4 \\cdot (-1)$，$96 = 4 \\cdot 24$。\n\n本课我们运用子环判定法，并数出 $\\mathbb{Z}_n$ 的子环。",
  ),
  prerequisites: ["introduction-to-rings"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "applying-the-subring-test",
      title: t("The subring test", "子环判定法"),
      explanation: t(
        "$\\{a + bi : a, b \\in \\mathbb{Z}, b \\text{ even}\\}$ is a subring of $\\mathbb{C}$: differences keep $b$ even, and $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$ has $ad + bc$ even. The set of $x \\in \\mathbb{Z}$ with $x \\ge 0$ is not: $0 - 1 = -1$.\n\nThe odd integers are not a subring of $\\mathbb{Z}$ either: $3 - 1 = 2$ is even, although the product of two odd numbers is odd.\n\nCheck: the subring test needs both closures; closure under multiplication alone is not enough.\n\n> **Watch out.** Test subtraction, not addition: $\\{x \\ge 0\\}$ is closed under addition and multiplication but is not a subring. And one counterexample is enough to say no.",
        "$\\{a + bi : a, b \\in \\mathbb{Z}, b \\text{ 为偶数}\\}$ 是 $\\mathbb{C}$ 的子环：差仍使 $b$ 为偶数，而 $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$ 中 $ad + bc$ 为偶数。$\\{x \\in \\mathbb{Z} : x \\ge 0\\}$ 不是：$0 - 1 = -1$。\n\n奇数集也不是 $\\mathbb{Z}$ 的子环：$3 - 1 = 2$ 是偶数，尽管两个奇数之积是奇数。\n\n检验：子环判定法要求两种封闭性都成立；只对乘法封闭是不够的。\n\n> **注意。** 要检验减法，而不是加法：$\\{x \\ge 0\\}$ 对加法和乘法都封闭，但不是子环。要说“不是”，一个反例就够了。",
      ),
      generate(rng) {
        const n = rng.int(2, 12);
        const k = nonSquare(rng);
        const r = n % 2 === 0 ? 1 : 2;
        const decisions: Decision[] = [
          {
            prompt: t(
              `Is $\\{a + bi : a, b \\in \\mathbb{Z},\\ ${n} \\mid b\\}$ a subring of $\\mathbb{C}$?`,
              `$\\{a + bi : a, b \\in \\mathbb{Z},\\ ${n} \\mid b\\}$ 是 $\\mathbb{C}$ 的子环吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Check subtraction", "检验减法"],
                t(
                  `$(a + bi) - (c + di) = (a - c) + (b - d)i$, and $b - d$ is a multiple of $${n}$ when $b$ and $d$ are.`,
                  `$(a + bi) - (c + di) = (a - c) + (b - d)i$，当 $b$、$d$ 都是 $${n}$ 的倍数时，$b - d$ 也是。`,
                ),
              ],
              [
                ["Check multiplication", "检验乘法"],
                t(
                  `$(a + bi)(c + di) = (ac - bd) + (ad + bc)i$, and $ad + bc$ is a multiple of $${n}$: yes, it is a subring.`,
                  `$(a + bi)(c + di) = (ac - bd) + (ad + bc)i$，而 $ad + bc$ 是 $${n}$ 的倍数：是子环。`,
                ),
              ],
            ],
            check: t(
              `$${n}i \\cdot ${n}i = -${n * n}$ has imaginary part $0$, a multiple of $${n}$, so it stays in the set.`,
              `$${n}i \\cdot ${n}i = -${n * n}$ 的虚部为 $0$，是 $${n}$ 的倍数，仍在集合中。`,
            ),
            wrong: t(
              `Differences and products both keep the imaginary part a multiple of $${n}$, so the set passes the subring test.`,
              `差与积的虚部都仍是 $${n}$ 的倍数，所以该集合通过子环判定法。`,
            ),
          },
          k % n === 0
            ? {
                prompt: t(
                  `Is $\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Z},\\ ${n} \\mid a\\}$ a subring of $\\mathbb{R}$?`,
                  `$\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Z},\\ ${n} \\mid a\\}$ 是 $\\mathbb{R}$ 的子环吗？`,
                ),
                holds: true,
                steps: [
                  [
                    ["Check subtraction", "检验减法"],
                    t(
                      `The difference has rational part $a - c$, a multiple of $${n}$ when $a$ and $c$ are.`,
                      `差的有理部分为 $a - c$，当 $a$、$c$ 都是 $${n}$ 的倍数时，它也是。`,
                    ),
                  ],
                  [
                    ["Check multiplication", "检验乘法"],
                    t(
                      `$(a + b\\sqrt{${k}})(c + d\\sqrt{${k}})$ has rational part $ac + ${k}bd$, a multiple of $${n}$ since $${n} \\mid ${k}$: yes, it is a subring.`,
                      `$(a + b\\sqrt{${k}})(c + d\\sqrt{${k}})$ 的有理部分为 $ac + ${k}bd$，因为 $${n} \\mid ${k}$，它是 $${n}$ 的倍数：是子环。`,
                    ),
                  ],
                ],
                check: t(
                  `$\\sqrt{${k}} \\cdot \\sqrt{${k}} = ${k}$ has rational part $${k}$, which is $${k / n}$ times $${n}$.`,
                  `$\\sqrt{${k}} \\cdot \\sqrt{${k}} = ${k}$ 的有理部分为 $${k}$，是 $${n}$ 的 $${k / n}$ 倍。`,
                ),
                wrong: t(
                  `Products have rational part $ac + ${k}bd$, and $${n}$ divides both terms because $${n} \\mid ${k}$.`,
                  `积的有理部分为 $ac + ${k}bd$，由于 $${n} \\mid ${k}$，$${n}$ 整除这两项。`,
                ),
              }
            : {
                prompt: t(
                  `Is $\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Z},\\ ${n} \\mid a\\}$ a subring of $\\mathbb{R}$?`,
                  `$\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Z},\\ ${n} \\mid a\\}$ 是 $\\mathbb{R}$ 的子环吗？`,
                ),
                holds: false,
                steps: [
                  [
                    ["Pick an element", "取一个元素"],
                    t(
                      `$\\sqrt{${k}} = 0 + \\sqrt{${k}}$ is in the set, since $${n} \\mid 0$.`,
                      `$\\sqrt{${k}} = 0 + \\sqrt{${k}}$ 在集合中，因为 $${n} \\mid 0$。`,
                    ),
                  ],
                  [
                    ["Square it", "将它平方"],
                    t(
                      `$\\sqrt{${k}} \\cdot \\sqrt{${k}} = ${k}$ has rational part $${k}$, not a multiple of $${n}$: no, it is not a subring.`,
                      `$\\sqrt{${k}} \\cdot \\sqrt{${k}} = ${k}$ 的有理部分为 $${k}$，不是 $${n}$ 的倍数：不是子环。`,
                    ),
                  ],
                ],
                check: t(
                  `Dividing $${k}$ by $${n}$ leaves remainder $${k % n} \\ne 0$.`,
                  `$${k}$ 除以 $${n}$ 的余数为 $${k % n} \\ne 0$。`,
                ),
                wrong: t(
                  `The product $\\sqrt{${k}} \\cdot \\sqrt{${k}} = ${k}$ leaves the set, so it is not closed under multiplication.`,
                  `积 $\\sqrt{${k}} \\cdot \\sqrt{${k}} = ${k}$ 不在集合中，所以它对乘法不封闭。`,
                ),
              },
          {
            prompt: t(
              `Is $\\{x \\in \\mathbb{Z} : x \\ge -${n}\\}$ a subring of $\\mathbb{Z}$?`,
              `$\\{x \\in \\mathbb{Z} : x \\ge -${n}\\}$ 是 $\\mathbb{Z}$ 的子环吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Pick two elements", "取两个元素"],
                t(`$0$ and $${n + 1}$ are both at least $-${n}$.`, `$0$ 与 $${n + 1}$ 都不小于 $-${n}$。`),
              ],
              [
                ["Subtract", "相减"],
                t(
                  `$0 - ${n + 1} = -${n + 1}$ is below $-${n}$: no, it is not a subring.`,
                  `$0 - ${n + 1} = -${n + 1}$ 小于 $-${n}$：不是子环。`,
                ),
              ],
            ],
            check: t(
              `A subring of $\\mathbb{Z}$ contains the negative of each element, and $-${n + 1}$ is the negative of $${n + 1}$.`,
              `$\\mathbb{Z}$ 的子环包含每个元素的相反数，而 $-${n + 1}$ 是 $${n + 1}$ 的相反数。`,
            ),
            wrong: t(
              `It is closed under addition and multiplication, but $0 - ${n + 1}$ leaves it, so it fails the subring test.`,
              `它对加法和乘法封闭，但 $0 - ${n + 1}$ 不在其中，所以它不能通过子环判定法。`,
            ),
          },
          {
            prompt: t(`Is $${n}\\mathbb{Z}$ a subring of $\\mathbb{Z}$?`, `$${n}\\mathbb{Z}$ 是 $\\mathbb{Z}$ 的子环吗？`),
            holds: true,
            steps: [
              [
                ["Check subtraction", "检验减法"],
                t(`$${n}a - ${n}b = ${n}(a - b)$ is a multiple of $${n}$.`, `$${n}a - ${n}b = ${n}(a - b)$ 是 $${n}$ 的倍数。`),
              ],
              [
                ["Check multiplication", "检验乘法"],
                t(
                  `$(${n}a)(${n}b) = ${n}(${n}ab)$ is a multiple of $${n}$: yes, it is a subring.`,
                  `$(${n}a)(${n}b) = ${n}(${n}ab)$ 是 $${n}$ 的倍数：是子环。`,
                ),
              ],
            ],
            check: t(
              `$${n} - ${2 * n} = -${n}$ and $${n} \\cdot ${2 * n} = ${2 * n * n}$ are both multiples of $${n}$.`,
              `$${n} - ${2 * n} = -${n}$ 与 $${n} \\cdot ${2 * n} = ${2 * n * n}$ 都是 $${n}$ 的倍数。`,
            ),
            wrong: t(
              `Differences and products of multiples of $${n}$ are multiples of $${n}$, so it passes the subring test.`,
              `$${n}$ 的倍数之差与积仍是 $${n}$ 的倍数，所以它通过子环判定法。`,
            ),
          },
          {
            prompt: t(
              `Is $\\{x \\in \\mathbb{Z} : x \\equiv ${r} \\pmod{${n + 1}}\\} \\cup \\{0\\}$ a subring of $\\mathbb{Z}$?`,
              `$\\{x \\in \\mathbb{Z} : x \\equiv ${r} \\pmod{${n + 1}}\\} \\cup \\{0\\}$ 是 $\\mathbb{Z}$ 的子环吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Pick two elements", "取两个元素"],
                t(
                  `$${r}$ and $${r + n + 1}$ are both $\\equiv ${r} \\pmod{${n + 1}}$.`,
                  `$${r}$ 与 $${r + n + 1}$ 都 $\\equiv ${r} \\pmod{${n + 1}}$。`,
                ),
              ],
              [
                ["Subtract", "相减"],
                t(
                  `$${r + n + 1} - ${r} = ${n + 1} \\equiv 0 \\pmod{${n + 1}}$, and $${n + 1} \\ne 0$: no, it is not a subring.`,
                  `$${r + n + 1} - ${r} = ${n + 1} \\equiv 0 \\pmod{${n + 1}}$，且 $${n + 1} \\ne 0$：不是子环。`,
                ),
              ],
            ],
            check: t(
              `The only element of the set divisible by $${n + 1}$ is $0$, because $${r}$ is not divisible by $${n + 1}$.`,
              `集合中能被 $${n + 1}$ 整除的元素只有 $0$，因为 $${r}$ 不能被 $${n + 1}$ 整除。`,
            ),
            wrong: t(
              `$${r + n + 1} - ${r} = ${n + 1}$ leaves the set, so it is not closed under subtraction.`,
              `$${r + n + 1} - ${r} = ${n + 1}$ 不在集合中，所以它对减法不封闭。`,
            ),
          },
        ];
        return decide(rng.pick(decisions));
      },
    },
    {
      id: "counting-subrings-of-zn",
      title: t("Subrings of $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 的子环"),
      explanation: t(
        "Every additive subgroup $\\langle d \\rangle$ of $\\mathbb{Z}_n$ is closed under multiplication, so the subrings of $\\mathbb{Z}_{12}$ are the $6$ subgroups $\\langle 1 \\rangle, \\langle 2 \\rangle, \\langle 3 \\rangle, \\langle 4 \\rangle, \\langle 6 \\rangle, \\langle 0 \\rangle$.\n\n$\\mathbb{Z}_{30}$ has $8$ subrings, one for each divisor $1, 2, 3, 5, 6, 10, 15, 30$ of $30$; the divisor $30$ gives $\\langle 30 \\rangle = \\langle 0 \\rangle = \\{0\\}$.\n\nCheck: $30 = 2 \\cdot 3 \\cdot 5$ has $(1 + 1)(1 + 1)(1 + 1) = 8$ divisors.\n\n> **Watch out.** Count every divisor, $1$ and $n$ included: $\\langle 1 \\rangle$ is the whole ring and $\\langle n \\rangle$ is $\\{0\\}$. Here a subring need not contain $1$.",
        "$\\mathbb{Z}_n$ 的每个加法子群 $\\langle d \\rangle$ 都对乘法封闭，所以 $\\mathbb{Z}_{12}$ 的子环就是 $6$ 个子群 $\\langle 1 \\rangle, \\langle 2 \\rangle, \\langle 3 \\rangle, \\langle 4 \\rangle, \\langle 6 \\rangle, \\langle 0 \\rangle$。\n\n$\\mathbb{Z}_{30}$ 有 $8$ 个子环，$30$ 的每个因数 $1, 2, 3, 5, 6, 10, 15, 30$ 各对应一个；因数 $30$ 给出 $\\langle 30 \\rangle = \\langle 0 \\rangle = \\{0\\}$。\n\n检验：$30 = 2 \\cdot 3 \\cdot 5$ 有 $(1 + 1)(1 + 1)(1 + 1) = 8$ 个因数。\n\n> **注意。** 每个因数都要数，包括 $1$ 和 $n$：$\\langle 1 \\rangle$ 是整个环，$\\langle n \\rangle$ 是 $\\{0\\}$。这里子环不必含 $1$。",
      ),
      generate(rng) {
        const n = rng.int(6, 120);
        const ds = divisors(n);
        const value = ds.length;
        return numberProblem({
          prompt: t(
            `How many subrings does $${zTex(n)}$ have (including $\\{0\\}$ and $${zTex(n)}$ itself)?`,
            `$${zTex(n)}$ 有多少个子环（包括 $\\{0\\}$ 与 $${zTex(n)}$ 本身）？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              value - 2,
              `That leaves out $\\{0\\}$ and $${zTex(n)}$ itself, which the question includes.`,
              `那漏掉了 $\\{0\\}$ 与 $${zTex(n)}$ 本身，而题目要求包括它们。`,
            ),
            why(
              phi(n),
              `That is $\\varphi(${n})$, the number of generators of $${zTex(n)}$; the subrings correspond to divisors.`,
              `那是 $\\varphi(${n})$，即 $${zTex(n)}$ 的生成元个数；子环与因数一一对应。`,
            ),
            why(
              primesOf(n).length,
              `That counts only the prime divisors of $${n}$; every divisor gives a subring.`,
              `那只数了 $${n}$ 的素因数；每个因数都给出一个子环。`,
            ),
            why(
              value + 1,
              `That counts $\\langle 0 \\rangle$ and $\\langle ${n} \\rangle$ separately, but they are the same subring $\\{0\\}$.`,
              `那把 $\\langle 0 \\rangle$ 与 $\\langle ${n} \\rangle$ 分开数了，但它们是同一个子环 $\\{0\\}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Identify the subrings", "确定子环"],
                t(
                  "Every subring is an additive subgroup, and every additive subgroup $\\langle d \\rangle$ is closed under multiplication, so the subrings are the subgroups $\\langle d \\rangle$, one for each divisor $d$.",
                  "每个子环都是加法子群，而每个加法子群 $\\langle d \\rangle$ 都对乘法封闭，所以子环就是子群 $\\langle d \\rangle$，每个因数 $d$ 对应一个。",
                ),
              ],
              [
                ["List the divisors", "列出因数"],
                t(
                  `The divisors of $${n}$ are $${ds.join(", ")}$, so there are $${value}$ subrings.`,
                  `$${n}$ 的因数为 $${ds.join(", ")}$，所以共有 $${value}$ 个子环。`,
                ),
              ],
            ],
            t(
              `The list starts with $1$, giving all of $${zTex(n)}$, and ends with $${n}$, giving $\\{0\\}$.`,
              `列表以 $1$ 开头，对应整个 $${zTex(n)}$，以 $${n}$ 结尾，对应 $\\{0\\}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** ideals decides which subrings are ideals and combines ideals of ℤ. */
export const ideals: TopicDef = {
  id: "ideals",
  title: t("Ideals", "理想"),
  summary: t(
    "A subring I of R is an ideal if it absorbs multiplication: ra ∈ I and ar ∈ I for every r ∈ R and a ∈ I. The ideals of ℤ are the nℤ. For ideals I and J, the sum I + J, the intersection I ∩ J and the product IJ are ideals; in ℤ, aℤ + bℤ = gcd(a, b)ℤ, aℤ ∩ bℤ = lcm(a, b)ℤ and (aℤ)(bℤ) = abℤ.",
    "若环 R 的子环 I 吸收乘法，即对每个 r ∈ R、a ∈ I 有 ra ∈ I 且 ar ∈ I，则称 I 为理想。ℤ 的理想是各 nℤ。对理想 I、J，和 I + J、交 I ∩ J 与积 IJ 都是理想；在 ℤ 中，aℤ + bℤ = gcd(a, b)ℤ，aℤ ∩ bℤ = lcm(a, b)ℤ，(aℤ)(bℤ) = abℤ。",
  ),
  intro: t(
    "$6\\mathbb{Z}$ is an ideal of $\\mathbb{Z}$: it is a subring, and multiplying a multiple of $6$ by any integer gives a multiple of $6$, as in $(-5)(12) = -60 = 6 \\cdot (-10)$.\n\nCheck: $6\\mathbb{Z} + 4\\mathbb{Z} = 2\\mathbb{Z}$, since $\\gcd(6, 4) = 2$ and $6 - 4 = 2$.\n\nIn this lesson we recognize ideals and combine the ideals of $\\mathbb{Z}$ by sums, intersections and products.",
    "$6\\mathbb{Z}$ 是 $\\mathbb{Z}$ 的理想：它是子环，并且 $6$ 的倍数乘以任何整数仍是 $6$ 的倍数，例如 $(-5)(12) = -60 = 6 \\cdot (-10)$。\n\n检验：$6\\mathbb{Z} + 4\\mathbb{Z} = 2\\mathbb{Z}$，因为 $\\gcd(6, 4) = 2$ 且 $6 - 4 = 2$。\n\n本课我们识别理想，并用和、交、积来组合 $\\mathbb{Z}$ 的理想。",
  ),
  prerequisites: ["subrings"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-ideals",
      title: t("Recognizing ideals", "识别理想"),
      explanation: t(
        "An ideal is a subring that absorbs multiplication, so multiplying any of its elements by any ring element stays inside it. $\\mathbb{Z}$ is a subring of $\\mathbb{Q}$ but not an ideal: $(\\frac{1}{2})(1) = \\frac{1}{2} \\notin \\mathbb{Z}$. $\\{(a, 0) : a \\in \\mathbb{Z}\\}$ is an ideal of $\\mathbb{Z} \\times \\mathbb{Z}$: $(r, s)(a, 0) = (ra, 0)$.\n\nThe even polynomials of $\\mathbb{Z}[x]$, those with only even powers of $x$, form a subring but not an ideal: $x \\cdot x^2 = x^3$ is odd.\n\nCheck: $x^2 \\cdot x^2 = x^4$ is even, so the set is closed under multiplication; only absorption fails.\n\n> **Watch out.** Absorption is about multiplying by every element of the whole ring, not only by elements of the subset. Being closed under multiplication is not enough.",
        "理想是吸收乘法的子环，所以把它的任一元素乘以环中任一元素，结果仍在其中。$\\mathbb{Z}$ 是 $\\mathbb{Q}$ 的子环但不是理想：$(\\frac{1}{2})(1) = \\frac{1}{2} \\notin \\mathbb{Z}$。$\\{(a, 0) : a \\in \\mathbb{Z}\\}$ 是 $\\mathbb{Z} \\times \\mathbb{Z}$ 的理想：$(r, s)(a, 0) = (ra, 0)$。\n\n$\\mathbb{Z}[x]$ 中只含 $x$ 的偶次幂的偶多项式构成子环，但不是理想：$x \\cdot x^2 = x^3$ 是奇次的。\n\n检验：$x^2 \\cdot x^2 = x^4$ 是偶次的，所以该集合对乘法封闭；不成立的只是吸收性。\n\n> **注意。** 吸收性是指乘以整个环中的每个元素，而不只是子集中的元素。仅对乘法封闭是不够的。",
      ),
      generate(rng) {
        const n = rng.int(2, 15);
        const k = rng.int(2, 9);
        const decisions: Decision[] = [
          {
            prompt: t(`Is $${n}\\mathbb{Z}$ an ideal of $\\mathbb{Z}$?`, `$${n}\\mathbb{Z}$ 是 $\\mathbb{Z}$ 的理想吗？`),
            holds: true,
            steps: [
              [
                ["Check it is a subring", "检验它是子环"],
                t(`Differences and products of multiples of $${n}$ are multiples of $${n}$.`, `$${n}$ 的倍数之差与积仍是 $${n}$ 的倍数。`),
              ],
              [
                ["Check absorption", "检验吸收性"],
                t(
                  `For any integer $r$, $r \\cdot ${n}m = ${n}(rm)$ is a multiple of $${n}$: yes, it is an ideal.`,
                  `对任意整数 $r$，$r \\cdot ${n}m = ${n}(rm)$ 是 $${n}$ 的倍数：是理想。`,
                ),
              ],
            ],
            check: t(`$(-3)(${n}) = -${3 * n}$ is again a multiple of $${n}$.`, `$(-3)(${n}) = -${3 * n}$ 仍是 $${n}$ 的倍数。`),
            wrong: t(
              `Multiplying a multiple of $${n}$ by any integer gives a multiple of $${n}$, so it absorbs multiplication.`,
              `$${n}$ 的倍数乘以任何整数仍是 $${n}$ 的倍数，所以它吸收乘法。`,
            ),
          },
          {
            prompt: t(`Is $${n}\\mathbb{Z}$ an ideal of $\\mathbb{Q}$?`, `$${n}\\mathbb{Z}$ 是 $\\mathbb{Q}$ 的理想吗？`),
            holds: false,
            steps: [
              [
                ["Pick a multiplier and an element", "取一个乘数和一个元素"],
                t(
                  `$\\frac{1}{${n + 1}} \\in \\mathbb{Q}$ and $${n} \\in ${n}\\mathbb{Z}$.`,
                  `$\\frac{1}{${n + 1}} \\in \\mathbb{Q}$，$${n} \\in ${n}\\mathbb{Z}$。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `$\\frac{1}{${n + 1}} \\cdot ${n} = \\frac{${n}}{${n + 1}}$ is not an integer, let alone in $${n}\\mathbb{Z}$: no, it is not an ideal.`,
                  `$\\frac{1}{${n + 1}} \\cdot ${n} = \\frac{${n}}{${n + 1}}$ 不是整数，更不在 $${n}\\mathbb{Z}$ 中：不是理想。`,
                ),
              ],
            ],
            check: t(
              `$${n}$ and $${n + 1}$ are consecutive, so they share no factor and $\\frac{${n}}{${n + 1}}$ is in lowest terms.`,
              `$${n}$ 与 $${n + 1}$ 是相邻整数，没有公因数，所以 $\\frac{${n}}{${n + 1}}$ 已是最简分数。`,
            ),
            wrong: t(
              `It is a subring, but $\\frac{1}{${n + 1}} \\cdot ${n}$ leaves it, so it does not absorb multiplication by $\\mathbb{Q}$.`,
              `它是子环，但 $\\frac{1}{${n + 1}} \\cdot ${n}$ 不在其中，所以它不吸收 $\\mathbb{Q}$ 的乘法。`,
            ),
          },
          {
            prompt: t(
              `Is $\\{(a, a) : a \\in \\mathbb{Z}\\}$ an ideal of $\\mathbb{Z} \\times \\mathbb{Z}$?`,
              `$\\{(a, a) : a \\in \\mathbb{Z}\\}$ 是 $\\mathbb{Z} \\times \\mathbb{Z}$ 的理想吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Pick a multiplier and an element", "取一个乘数和一个元素"],
                t(
                  `$(${k}, 1) \\in \\mathbb{Z} \\times \\mathbb{Z}$ and $(1, 1)$ is in the set.`,
                  `$(${k}, 1) \\in \\mathbb{Z} \\times \\mathbb{Z}$，而 $(1, 1)$ 在该集合中。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `$(${k}, 1)(1, 1) = (${k}, 1)$, whose coordinates differ: no, it is not an ideal.`,
                  `$(${k}, 1)(1, 1) = (${k}, 1)$，两个坐标不同：不是理想。`,
                ),
              ],
            ],
            check: t(
              "The set is a subring: $(a, a) - (b, b) = (a - b, a - b)$ and $(a, a)(b, b) = (ab, ab)$. Only absorption fails.",
              "该集合是子环：$(a, a) - (b, b) = (a - b, a - b)$，$(a, a)(b, b) = (ab, ab)$。不成立的只是吸收性。",
            ),
            wrong: t(
              `It is closed under multiplication within itself, but $(${k}, 1)(1, 1) = (${k}, 1)$ leaves it, so it does not absorb.`,
              `它在自身内对乘法封闭，但 $(${k}, 1)(1, 1) = (${k}, 1)$ 不在其中，所以它不吸收乘法。`,
            ),
          },
          {
            prompt: t(
              `Is $${n}\\mathbb{Z} \\times ${k}\\mathbb{Z}$ an ideal of $\\mathbb{Z} \\times \\mathbb{Z}$?`,
              `$${n}\\mathbb{Z} \\times ${k}\\mathbb{Z}$ 是 $\\mathbb{Z} \\times \\mathbb{Z}$ 的理想吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Check it is a subring", "检验它是子环"],
                t(
                  `Coordinatewise, differences and products stay multiples of $${n}$ and of $${k}$.`,
                  `逐坐标看，差与积仍分别是 $${n}$ 与 $${k}$ 的倍数。`,
                ),
              ],
              [
                ["Check absorption", "检验吸收性"],
                t(
                  `$(r, s)(${n}a, ${k}b) = (${n}ra, ${k}sb)$ stays in the set: yes, it is an ideal.`,
                  `$(r, s)(${n}a, ${k}b) = (${n}ra, ${k}sb)$ 仍在集合中：是理想。`,
                ),
              ],
            ],
            check: t(
              `$(5, -2)(${n}, ${k}) = (${5 * n}, -${2 * k})$ has first coordinate a multiple of $${n}$ and second a multiple of $${k}$.`,
              `$(5, -2)(${n}, ${k}) = (${5 * n}, -${2 * k})$ 的第一个坐标是 $${n}$ 的倍数，第二个是 $${k}$ 的倍数。`,
            ),
            wrong: t(
              `Each coordinate is an ideal of $\\mathbb{Z}$ and absorbs multiplication, so the product does too.`,
              `每个坐标都是 $\\mathbb{Z}$ 的理想并吸收乘法，所以乘积也吸收乘法。`,
            ),
          },
          {
            prompt: t(
              `Is the set of polynomials in $\\mathbb{Z}[x]$ whose constant term is a multiple of $${n}$ an ideal of $\\mathbb{Z}[x]$?`,
              `$\\mathbb{Z}[x]$ 中常数项为 $${n}$ 的倍数的多项式之集是 $\\mathbb{Z}[x]$ 的理想吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Check it is a subring", "检验它是子环"],
                t(
                  `The constant term of $f - g$ is $f(0) - g(0)$, a multiple of $${n}$ when both are.`,
                  `$f - g$ 的常数项为 $f(0) - g(0)$，当两者都是 $${n}$ 的倍数时它也是。`,
                ),
              ],
              [
                ["Check absorption", "检验吸收性"],
                t(
                  `For any $g \\in \\mathbb{Z}[x]$, the constant term of $gf$ is $g(0)f(0)$, a multiple of $${n}$: yes, it is an ideal.`,
                  `对任意 $g \\in \\mathbb{Z}[x]$，$gf$ 的常数项为 $g(0)f(0)$，是 $${n}$ 的倍数：是理想。`,
                ),
              ],
            ],
            check: t(
              `$(x + 3)(x + ${n}) = x^2 + ${n + 3}x + ${3 * n}$ has constant term $${3 * n}$, a multiple of $${n}$.`,
              `$(x + 3)(x + ${n}) = x^2 + ${n + 3}x + ${3 * n}$ 的常数项为 $${3 * n}$，是 $${n}$ 的倍数。`,
            ),
            wrong: t(
              `The constant term of a product is the product of the constant terms, so multiplying by any polynomial keeps it a multiple of $${n}$.`,
              `乘积的常数项是常数项之积，所以乘以任何多项式后它仍是 $${n}$ 的倍数。`,
            ),
          },
          {
            prompt: t(
              `Is the set of polynomials in $\\mathbb{Z}[x]$ of degree at most $${k}$ (with $0$) an ideal of $\\mathbb{Z}[x]$?`,
              `$\\mathbb{Z}[x]$ 中次数不超过 $${k}$ 的多项式（含 $0$）之集是 $\\mathbb{Z}[x]$ 的理想吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Pick a multiplier and an element", "取一个乘数和一个元素"],
                t(`$x \\in \\mathbb{Z}[x]$ and $x^{${k}}$ has degree $${k}$.`, `$x \\in \\mathbb{Z}[x]$，而 $x^{${k}}$ 的次数为 $${k}$。`),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `$x \\cdot x^{${k}} = x^{${k + 1}}$ has degree $${k + 1} > ${k}$: no, it is not an ideal.`,
                  `$x \\cdot x^{${k}} = x^{${k + 1}}$ 的次数为 $${k + 1} > ${k}$：不是理想。`,
                ),
              ],
            ],
            check: t(
              "Degrees add under multiplication, so multiplying by $x$ raises the degree by exactly one.",
              "相乘时次数相加，所以乘以 $x$ 恰好使次数加一。",
            ),
            wrong: t(
              `$x \\cdot x^{${k}} = x^{${k + 1}}$ leaves the set; it is not even closed under multiplication.`,
              `$x \\cdot x^{${k}} = x^{${k + 1}}$ 不在集合中；它甚至对乘法不封闭。`,
            ),
          },
        ];
        return decide(rng.pick(decisions));
      },
    },
    {
      id: "sums-intersections-and-products-of-ideals-of-z",
      title: t("Combining ideals of $\\mathbb{Z}$", "组合 $\\mathbb{Z}$ 的理想"),
      explanation: t(
        "Every ideal of the integers is the multiples of one number, and sums, intersections and products correspond to the gcd, the lcm and the product. $12\\mathbb{Z} + 18\\mathbb{Z} = 6\\mathbb{Z}$, $12\\mathbb{Z} \\cap 18\\mathbb{Z} = 36\\mathbb{Z}$, and $(12\\mathbb{Z})(18\\mathbb{Z}) = 216\\mathbb{Z}$.\n\nFor $45$ and $75$: $45\\mathbb{Z} + 75\\mathbb{Z} = 15\\mathbb{Z}$, $45\\mathbb{Z} \\cap 75\\mathbb{Z} = 225\\mathbb{Z}$, and $(45\\mathbb{Z})(75\\mathbb{Z}) = 3375\\mathbb{Z}$.\n\nCheck: $15 \\cdot 225 = 3375 = 45 \\cdot 75$, as $\\gcd \\cdot \\operatorname{lcm} = $ product.\n\n> **Watch out.** Adding ideals makes the ideal bigger, so its generator gets smaller (the gcd); intersecting makes the ideal smaller, so its generator gets bigger (the lcm).",
        "整数环的每个理想都是某个数的倍数，理想的和、交、积分别对应最大公因数、最小公倍数和乘积。$12\\mathbb{Z} + 18\\mathbb{Z} = 6\\mathbb{Z}$，$12\\mathbb{Z} \\cap 18\\mathbb{Z} = 36\\mathbb{Z}$，$(12\\mathbb{Z})(18\\mathbb{Z}) = 216\\mathbb{Z}$。\n\n对 $45$ 与 $75$：$45\\mathbb{Z} + 75\\mathbb{Z} = 15\\mathbb{Z}$，$45\\mathbb{Z} \\cap 75\\mathbb{Z} = 225\\mathbb{Z}$，$(45\\mathbb{Z})(75\\mathbb{Z}) = 3375\\mathbb{Z}$。\n\n检验：$15 \\cdot 225 = 3375 = 45 \\cdot 75$，因为最大公因数与最小公倍数之积等于两数之积。\n\n> **注意。** 理想相加会变大，所以生成元变小（最大公因数）；理想相交会变小，所以生成元变大（最小公倍数）。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.int(4, 40);
          b = rng.int(4, 40);
        } while (a === b || gcd(a, b) === 1);
        const kind = rng.int(0, 2);
        const g = gcd(a, b);
        const l = lcm(a, b);
        const [op, value] = [
          ["+", g],
          ["\\cap", l],
          ["", a * b],
        ][kind] as [string, number];
        const left = kind === 2 ? `(${a}\\mathbb{Z})(${b}\\mathbb{Z})` : `${a}\\mathbb{Z} ${op} ${b}\\mathbb{Z}`;
        const rule: [string, string][] = [
          [
            "The sum consists of all $ax + by$, and by Bezout's identity these are exactly the multiples of the gcd",
            "和由所有 $ax + by$ 组成，由裴蜀等式，它们恰好是最大公因数的倍数",
          ],
          [
            "The intersection consists of the common multiples, which are exactly the multiples of the lcm",
            "交由公倍数组成，而公倍数恰好是最小公倍数的倍数",
          ],
          [
            "The product consists of sums of products $(ax)(by) = ab(xy)$, which are exactly the multiples of $ab$",
            "积由乘积 $(ax)(by) = ab(xy)$ 之和组成，它们恰好是 $ab$ 的倍数",
          ],
        ];
        const [ruleEn, ruleZh] = rule[kind] as [string, string];
        const compute: Text = [
          t(`$\\gcd(${a}, ${b}) = ${g}$.`, `$\\gcd(${a}, ${b}) = ${g}$。`),
          t(
            `$\\operatorname{lcm}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{${g}} = ${l}$.`,
            `$\\operatorname{lcm}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{${g}} = ${l}$。`,
          ),
          t(`$${a} \\cdot ${b} = ${a * b}$.`, `$${a} \\cdot ${b} = ${a * b}$。`),
        ][kind] as Text;
        const check: Text = [
          t(
            `$${a} \\div ${g} = ${a / g}$ and $${b} \\div ${g} = ${b / g}$ share no common factor, so no larger number divides both.`,
            `$${a} \\div ${g} = ${a / g}$ 与 $${b} \\div ${g} = ${b / g}$ 没有公因数，所以没有更大的数同时整除两者。`,
          ),
          t(
            `$${l} \\div ${a} = ${l / a}$ and $${l} \\div ${b} = ${l / b}$ are whole numbers, so $${l}$ is a multiple of both.`,
            `$${l} \\div ${a} = ${l / a}$ 与 $${l} \\div ${b} = ${l / b}$ 都是整数，所以 $${l}$ 是两者的公倍数。`,
          ),
          t(
            `$${a * b} = ${g} \\cdot ${l}$, the gcd times the lcm, as it must be.`,
            `$${a * b} = ${g} \\cdot ${l}$，正是最大公因数乘以最小公倍数。`,
          ),
        ][kind] as Text;
        return numberProblem({
          prompt: t(`Find the positive integer $n$ with $${left} = n\\mathbb{Z}$.`, `求正整数 $n$，使 $${left} = n\\mathbb{Z}$。`),
          answer: value,
          mistakes: apart(value, [
            why(
              g,
              `That is $\\gcd(${a}, ${b})$, which generates the sum $${a}\\mathbb{Z} + ${b}\\mathbb{Z}$.`,
              `那是 $\\gcd(${a}, ${b})$，它生成的是和 $${a}\\mathbb{Z} + ${b}\\mathbb{Z}$。`,
            ),
            why(
              l,
              `That is $\\operatorname{lcm}(${a}, ${b})$, which generates the intersection $${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z}$.`,
              `那是 $\\operatorname{lcm}(${a}, ${b})$，它生成的是交 $${a}\\mathbb{Z} \\cap ${b}\\mathbb{Z}$。`,
            ),
            why(
              a * b,
              `That is $${a} \\cdot ${b}$, which generates the product $(${a}\\mathbb{Z})(${b}\\mathbb{Z})$.`,
              `那是 $${a} \\cdot ${b}$，它生成的是积 $(${a}\\mathbb{Z})(${b}\\mathbb{Z})$。`,
            ),
            why(
              a + b,
              "That adds the two generators; adding generators corresponds to none of the three operations.",
              "那是把两个生成元相加；生成元相加不对应这三种运算中的任何一种。",
            ),
          ]),
          solution: walked(
            [
              [["Use the rule", "运用规则"], t(`${ruleEn}.`, `${ruleZh}。`)],
              [["Compute", "计算"], compute],
            ],
            check,
          ),
        });
      },
    },
  ],
};

/** generatingElementsOfPrincipalIdealRings compares principal ideals of ℤₙ and finds generators of sums. */
export const generatingElementsOfPrincipalIdealRings: TopicDef = {
  id: "generating-elements-of-principal-ideal-rings",
  title: t("Generating Elements of Principal Ideal Rings", "主理想环的生成元"),
  summary: t(
    "The principal ideal generated by a in a commutative ring with unity is ⟨a⟩ = {ra : r ∈ R}. In ℤ and ℤₙ every ideal is principal. In ℤₙ, ⟨a⟩ = ⟨gcd(a, n)⟩, so ⟨a⟩ = ⟨b⟩ exactly when gcd(a, n) = gcd(b, n), and ⟨a, b⟩ = ⟨gcd(a, b, n)⟩.",
    "有幺元交换环中由 a 生成的主理想为 ⟨a⟩ = {ra : r ∈ R}。在 ℤ 与 ℤₙ 中每个理想都是主理想。在 ℤₙ 中，⟨a⟩ = ⟨gcd(a, n)⟩，所以 ⟨a⟩ = ⟨b⟩ 当且仅当 gcd(a, n) = gcd(b, n)，且 ⟨a, b⟩ = ⟨gcd(a, b, n)⟩。",
  ),
  intro: t(
    "In $\\mathbb{Z}_{12}$, the ideal $\\langle 8 \\rangle = \\{0, 8, 4\\}$ is the same as $\\langle 4 \\rangle = \\{0, 4, 8\\}$, because $\\gcd(8, 12) = 4$.\n\nCheck: $2 \\cdot 8 = 16 \\equiv 4$, so $4 \\in \\langle 8 \\rangle$, and $2 \\cdot 4 = 8$, so $8 \\in \\langle 4 \\rangle$.\n\nIn this lesson we decide when two principal ideals of $\\mathbb{Z}_n$ are equal and find a single generator of $\\langle a, b \\rangle$.",
    "在 $\\mathbb{Z}_{12}$ 中，理想 $\\langle 8 \\rangle = \\{0, 8, 4\\}$ 与 $\\langle 4 \\rangle = \\{0, 4, 8\\}$ 相同，因为 $\\gcd(8, 12) = 4$。\n\n检验：$2 \\cdot 8 = 16 \\equiv 4$，所以 $4 \\in \\langle 8 \\rangle$；$2 \\cdot 4 = 8$，所以 $8 \\in \\langle 4 \\rangle$。\n\n本课我们判断 $\\mathbb{Z}_n$ 的两个主理想何时相等，并求出 $\\langle a, b \\rangle$ 的单个生成元。",
  ),
  prerequisites: ["ideals"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "equal-principal-ideals-of-zn",
      title: t("Equal principal ideals", "相等的主理想"),
      explanation: t(
        "Two elements generate the same ideal exactly when they have the same gcd with the modulus. In $\\mathbb{Z}_{20}$, $\\langle 6 \\rangle = \\langle 2 \\rangle = \\langle 14 \\rangle$ since $\\gcd(6, 20) = \\gcd(14, 20) = 2$, but $\\langle 4 \\rangle \\ne \\langle 6 \\rangle$.\n\nIn $\\mathbb{Z}_{90}$, $\\langle 21 \\rangle = \\langle 33 \\rangle$, since $\\gcd(21, 90) = 3 = \\gcd(33, 90)$; both equal $\\langle 3 \\rangle$, which has $\\frac{90}{3} = 30$ elements.\n\nCheck: $\\langle 15 \\rangle$ has $\\frac{90}{15} = 6$ elements, so it differs from $\\langle 21 \\rangle$.\n\n> **Watch out.** Compare the gcds with the modulus, not the generators themselves: $6 \\ne 14$, yet $\\langle 6 \\rangle = \\langle 14 \\rangle$ in $\\mathbb{Z}_{20}$.",
        "两个元素生成同一个理想，当且仅当它们与模的最大公因数相同。在 $\\mathbb{Z}_{20}$ 中，$\\langle 6 \\rangle = \\langle 2 \\rangle = \\langle 14 \\rangle$，因为 $\\gcd(6, 20) = \\gcd(14, 20) = 2$；但 $\\langle 4 \\rangle \\ne \\langle 6 \\rangle$。\n\n在 $\\mathbb{Z}_{90}$ 中，$\\langle 21 \\rangle = \\langle 33 \\rangle$，因为 $\\gcd(21, 90) = 3 = \\gcd(33, 90)$；两者都等于 $\\langle 3 \\rangle$，有 $\\frac{90}{3} = 30$ 个元素。\n\n检验：$\\langle 15 \\rangle$ 有 $\\frac{90}{15} = 6$ 个元素，所以它与 $\\langle 21 \\rangle$ 不同。\n\n> **注意。** 要比较它们与模的最大公因数，而不是生成元本身：$6 \\ne 14$，但在 $\\mathbb{Z}_{20}$ 中 $\\langle 6 \\rangle = \\langle 14 \\rangle$。",
      ),
      generate(rng) {
        const n = rng.pick([12, 18, 20, 24, 30, 36, 40, 42, 45, 48, 60]);
        const a = rng.int(2, n - 1);
        let b: number;
        if (rng.bool()) {
          const d = gcd(a, n);
          const cands = range(1, n - 1).filter((x) => gcd(x, n) === d && x !== a);
          b = cands.length > 0 ? rng.pick(cands) : rng.int(2, n - 1);
        } else {
          do b = rng.int(2, n - 1);
          while (b === a);
        }
        const ga = gcd(a, n);
        const gb = gcd(b, n);
        const holds = ga === gb;
        return decide({
          prompt: t(
            `In $${zTex(n)}$, is $\\langle ${a} \\rangle = \\langle ${b} \\rangle$?`,
            `在 $${zTex(n)}$ 中，$\\langle ${a} \\rangle = \\langle ${b} \\rangle$ 吗？`,
          ),
          holds,
          steps: [
            [
              ["Replace each generator by its gcd", "把每个生成元换成最大公因数"],
              t(
                `$\\gcd(${a}, ${n}) = ${ga}$ and $\\gcd(${b}, ${n}) = ${gb}$, so $\\langle ${a} \\rangle = \\langle ${ga} \\rangle$ and $\\langle ${b} \\rangle = \\langle ${gb} \\rangle$.`,
                `$\\gcd(${a}, ${n}) = ${ga}$，$\\gcd(${b}, ${n}) = ${gb}$，所以 $\\langle ${a} \\rangle = \\langle ${ga} \\rangle$，$\\langle ${b} \\rangle = \\langle ${gb} \\rangle$。`,
              ),
            ],
            [
              ["Compare", "比较"],
              holds
                ? t(`The gcds agree: yes, the ideals are equal.`, `两个最大公因数相同：两个理想相等。`)
                : t(`$${ga} \\ne ${gb}$: no, the ideals are not equal.`, `$${ga} \\ne ${gb}$：两个理想不相等。`),
            ],
          ],
          check: t(
            `$\\langle ${a} \\rangle$ has $\\frac{${n}}{${ga}} = ${n / ga}$ elements and $\\langle ${b} \\rangle$ has $\\frac{${n}}{${gb}} = ${n / gb}$.`,
            `$\\langle ${a} \\rangle$ 有 $\\frac{${n}}{${ga}} = ${n / ga}$ 个元素，$\\langle ${b} \\rangle$ 有 $\\frac{${n}}{${gb}} = ${n / gb}$ 个。`,
          ),
          wrong: holds
            ? t(
                `Both generators have gcd $${ga}$ with $${n}$, so both ideals are $\\langle ${ga} \\rangle$.`,
                `两个生成元与 $${n}$ 的最大公因数都是 $${ga}$，所以两个理想都是 $\\langle ${ga} \\rangle$。`,
              )
            : t(
                `The gcds $${ga}$ and $${gb}$ differ, so the ideals have different sizes.`,
                `最大公因数 $${ga}$ 与 $${gb}$ 不同，所以两个理想的大小不同。`,
              ),
        });
      },
    },
    {
      id: "generators-of-ideals-of-zn",
      title: t("Generators of ⟨a, b⟩", "⟨a, b⟩ 的生成元"),
      explanation: t(
        "An ideal generated by several elements of this ring is principal, generated by the gcd of those elements and the modulus. In $\\mathbb{Z}_{36}$, $\\langle 8, 30 \\rangle = \\langle \\gcd(8, 30, 36) \\rangle = \\langle 2 \\rangle$.\n\nIn $\\mathbb{Z}_{100}$, $\\langle 40, 70 \\rangle = \\langle \\gcd(40, 70, 100) \\rangle = \\langle 10 \\rangle$.\n\nCheck: $70 - 40 = 30$ and $40 - 30 = 10$ lie in the ideal, and $10$ divides $40$, $70$ and $100$.\n\n> **Watch out.** Include the modulus in the gcd: in $\\mathbb{Z}_{12}$, $\\gcd(8, 16) = 8$, but $\\langle 8, 16 \\rangle = \\langle \\gcd(8, 16, 12) \\rangle = \\langle 4 \\rangle$.",
        "这个环中由若干元素生成的理想是主理想，由这些元素与模的最大公因数生成。在 $\\mathbb{Z}_{36}$ 中，$\\langle 8, 30 \\rangle = \\langle \\gcd(8, 30, 36) \\rangle = \\langle 2 \\rangle$。\n\n在 $\\mathbb{Z}_{100}$ 中，$\\langle 40, 70 \\rangle = \\langle \\gcd(40, 70, 100) \\rangle = \\langle 10 \\rangle$。\n\n检验：$70 - 40 = 30$ 与 $40 - 30 = 10$ 都在这个理想中，而 $10$ 整除 $40$、$70$ 与 $100$。\n\n> **注意。** 求最大公因数时要把模也算进去：在 $\\mathbb{Z}_{12}$ 中，$\\gcd(8, 16) = 8$，但 $\\langle 8, 16 \\rangle = \\langle \\gcd(8, 16, 12) \\rangle = \\langle 4 \\rangle$。",
      ),
      generate(rng) {
        const n = rng.pick([24, 30, 36, 40, 48, 60, 72, 84, 90, 96, 120]);
        let a: number;
        let b: number;
        do {
          a = rng.int(2, n - 1);
          b = rng.int(2, n - 1);
        } while (a === b || gcd(gcd(a, b), n) === 1 || gcd(gcd(a, b), n) === gcd(a, n));
        const value = gcd(gcd(a, b), n);
        const ga = gcd(a, n);
        const gb = gcd(b, n);
        return numberProblem({
          prompt: t(
            `In $${zTex(n)}$, the ideal $\\langle ${a}, ${b} \\rangle$ equals $\\langle d \\rangle$ for exactly one positive divisor $d$ of $${n}$. Find $d$.`,
            `在 $${zTex(n)}$ 中，理想 $\\langle ${a}, ${b} \\rangle$ 恰等于某个 $${n}$ 的正因数 $d$ 生成的 $\\langle d \\rangle$。求 $d$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              ga,
              `That is $\\gcd(${a}, ${n})$, the generator of $\\langle ${a} \\rangle$ alone; $${b}$ makes the ideal bigger.`,
              `那是 $\\gcd(${a}, ${n})$，只是 $\\langle ${a} \\rangle$ 的生成元；$${b}$ 使理想更大。`,
            ),
            why(
              gb,
              `That is $\\gcd(${b}, ${n})$, the generator of $\\langle ${b} \\rangle$ alone; $${a}$ makes the ideal bigger.`,
              `那是 $\\gcd(${b}, ${n})$，只是 $\\langle ${b} \\rangle$ 的生成元；$${a}$ 使理想更大。`,
            ),
            why(
              gcd(a, b),
              `That is $\\gcd(${a}, ${b})$, which is not a divisor of $${n}$; include the modulus in the gcd.`,
              `那是 $\\gcd(${a}, ${b})$，它不是 $${n}$ 的因数；求最大公因数时要把模也算进去。`,
            ),
            why(
              lcm(ga, gb),
              `That generates the intersection $\\langle ${a} \\rangle \\cap \\langle ${b} \\rangle$, not the ideal generated by both.`,
              `那生成的是交 $\\langle ${a} \\rangle \\cap \\langle ${b} \\rangle$，而不是两者共同生成的理想。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Replace each generator by its gcd", "把每个生成元换成最大公因数"],
                t(
                  `$\\langle ${a} \\rangle = \\langle ${ga} \\rangle$ and $\\langle ${b} \\rangle = \\langle ${gb} \\rangle$, since $\\gcd(${a}, ${n}) = ${ga}$ and $\\gcd(${b}, ${n}) = ${gb}$.`,
                  `$\\langle ${a} \\rangle = \\langle ${ga} \\rangle$，$\\langle ${b} \\rangle = \\langle ${gb} \\rangle$，因为 $\\gcd(${a}, ${n}) = ${ga}$，$\\gcd(${b}, ${n}) = ${gb}$。`,
                ),
              ],
              [
                ["Combine the two", "合并两者"],
                t(
                  `$\\langle ${a}, ${b} \\rangle = \\langle \\gcd(${ga}, ${gb}) \\rangle = \\langle ${value} \\rangle$, so $d = ${value}$.`,
                  `$\\langle ${a}, ${b} \\rangle = \\langle \\gcd(${ga}, ${gb}) \\rangle = \\langle ${value} \\rangle$，所以 $d = ${value}$。`,
                ),
              ],
            ],
            t(
              `$${value}$ divides $${a}$, $${b}$ and $${n}$: $${a} \\div ${value} = ${a / value}$, $${b} \\div ${value} = ${b / value}$, $${n} \\div ${value} = ${n / value}$.`,
              `$${value}$ 整除 $${a}$、$${b}$ 与 $${n}$：$${a} \\div ${value} = ${a / value}$，$${b} \\div ${value} = ${b / value}$，$${n} \\div ${value} = ${n / value}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** gaussianTex writes a + bi. */
function gaussianTex(a: number, b: number): string {
  if (b === 0) return `${a}`;
  const bi = b === 1 ? "i" : b === -1 ? "-i" : `${b}i`;
  if (a === 0) return bi;
  return b < 0 ? `${a} - ${b === -1 ? "i" : `${-b}i`}` : `${a} + ${bi}`;
}

/** quotientRings finds sizes of quotients of ℤ[i] and computes in quotients of ℤₙ. */
export const quotientRings: TopicDef = {
  id: "quotient-rings",
  title: t("Quotient Rings", "商环"),
  summary: t(
    "If $I$ is an ideal of $R$, the cosets $r + I$ form a ring $R/I$ with $(a + I) + (b + I) = (a + b) + I$ and $(a + I)(b + I) = ab + I$; the absorption property makes multiplication well defined. $\\mathbb{Z}/n\\mathbb{Z} \\cong \\mathbb{Z}_n$, $\\mathbb{Z}_n/\\langle d \\rangle \\cong \\mathbb{Z}_d$ for $d \\mid n$, and $\\mathbb{Z}[i]/\\langle a + bi \\rangle$ has $a^2 + b^2$ elements.",
    "若 $I$ 是 $R$ 的理想，则陪集 $r + I$ 构成环 $R/I$，运算为 $(a + I) + (b + I) = (a + b) + I$，$(a + I)(b + I) = ab + I$；吸收性保证乘法良定义。$\\mathbb{Z}/n\\mathbb{Z} \\cong \\mathbb{Z}_n$，对 $d \\mid n$ 有 $\\mathbb{Z}_n/\\langle d \\rangle \\cong \\mathbb{Z}_d$，且 $\\mathbb{Z}[i]/\\langle a + bi \\rangle$ 有 $a^2 + b^2$ 个元素。",
  ),
  intro: t(
    "In $\\mathbb{Z}_{12}/\\langle 4 \\rangle$ there are $4$ cosets, $0 + \\langle 4 \\rangle, 1 + \\langle 4 \\rangle, 2 + \\langle 4 \\rangle, 3 + \\langle 4 \\rangle$, and $(3 + \\langle 4 \\rangle)(3 + \\langle 4 \\rangle) = 9 + \\langle 4 \\rangle = 1 + \\langle 4 \\rangle$.\n\nCheck: $9 - 1 = 8$ lies in $\\langle 4 \\rangle = \\{0, 4, 8\\}$, so $9$ and $1$ are in the same coset.\n\nIn this lesson we count the elements of quotients of $\\mathbb{Z}[i]$ and multiply cosets in quotients of $\\mathbb{Z}_n$.",
    "$\\mathbb{Z}_{12}/\\langle 4 \\rangle$ 中有 $4$ 个陪集：$0 + \\langle 4 \\rangle, 1 + \\langle 4 \\rangle, 2 + \\langle 4 \\rangle, 3 + \\langle 4 \\rangle$，并且 $(3 + \\langle 4 \\rangle)(3 + \\langle 4 \\rangle) = 9 + \\langle 4 \\rangle = 1 + \\langle 4 \\rangle$。\n\n检验：$9 - 1 = 8$ 在 $\\langle 4 \\rangle = \\{0, 4, 8\\}$ 中，所以 $9$ 与 $1$ 在同一个陪集中。\n\n本课我们数出 $\\mathbb{Z}[i]$ 的商环的元素个数，并在 $\\mathbb{Z}_n$ 的商环中做陪集乘法。",
  ),
  prerequisites: ["generating-elements-of-principal-ideal-rings", "quotient-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sizes-of-quotients-of-gaussian-integers",
      title: t("Quotients of $\\mathbb{Z}[i]$", "$\\mathbb{Z}[i]$ 的商环"),
      explanation: t(
        "The quotient of the Gaussian integers by a principal ideal has as many elements as the norm of its generator. $\\mathbb{Z}[i]/\\langle 2 + i \\rangle$ has $2^2 + 1^2 = 5$ elements; in fact it is isomorphic to $\\mathbb{Z}_5$, since $i \\equiv -2$.\n\n$\\mathbb{Z}[i]/\\langle 4 - 3i \\rangle$ has $4^2 + 3^2 = 25$ elements; the sign of the imaginary part does not matter, because it is squared.\n\nCheck: $(4 - 3i)(4 + 3i) = 16 + 9 = 25$.\n\n> **Watch out.** The norm is $a^2 + b^2$, not $a^2 - b^2$ and not $(a + b)^2$: for $3 + 2i$ it is $13$, not $5$ or $25$.",
        "高斯整数环模一个主理想所得商环的元素个数，等于生成元的范数。$\\mathbb{Z}[i]/\\langle 2 + i \\rangle$ 有 $2^2 + 1^2 = 5$ 个元素；事实上它同构于 $\\mathbb{Z}_5$，因为 $i \\equiv -2$。\n\n$\\mathbb{Z}[i]/\\langle 4 - 3i \\rangle$ 有 $4^2 + 3^2 = 25$ 个元素；虚部的符号无关紧要，因为它要平方。\n\n检验：$(4 - 3i)(4 + 3i) = 16 + 9 = 25$。\n\n> **注意。** 范数是 $a^2 + b^2$，不是 $a^2 - b^2$，也不是 $(a + b)^2$：$3 + 2i$ 的范数是 $13$，而不是 $5$ 或 $25$。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.nonZero(-7, 7);
        const value = a * a + b * b;
        const g = gaussianTex(a, b);
        return numberProblem({
          prompt: t(
            `How many elements does $\\mathbb{Z}[i]/\\langle ${g} \\rangle$ have?`,
            `$\\mathbb{Z}[i]/\\langle ${g} \\rangle$ 有多少个元素？`,
          ),
          answer: value,
          mistakes: apart(value, [
            ...(a * a === b * b
              ? []
              : [
                  why(
                    Math.abs(a * a - b * b),
                    "That subtracts the squares; the norm adds them: $a^2 + b^2$.",
                    "那是把平方相减；范数是平方相加：$a^2 + b^2$。",
                  ),
                ]),
            why(a + Math.abs(b), "That adds the coefficients without squaring them.", "那是把系数直接相加，没有平方。"),
            why(
              Math.abs(a * b),
              "That multiplies the coefficients; the norm is the sum of their squares.",
              "那是把系数相乘；范数是它们的平方和。",
            ),
            why(
              (a + Math.abs(b)) ** 2,
              "That squares the sum of the coefficients, which adds an extra $2|ab|$; square each coefficient separately.",
              "那是把系数之和平方，多出了 $2|ab|$；应分别把每个系数平方。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Use the norm", "用范数"],
                t(
                  "The quotient $\\mathbb{Z}[i]/\\langle a + bi \\rangle$ has $N(a + bi) = a^2 + b^2$ elements.",
                  "商环 $\\mathbb{Z}[i]/\\langle a + bi \\rangle$ 有 $N(a + bi) = a^2 + b^2$ 个元素。",
                ),
              ],
              [
                ["Compute the norm", "计算范数"],
                t(
                  `$N(${g}) = ${a}^2 + ${Math.abs(b)}^2 = ${a * a} + ${b * b} = ${value}$.`,
                  `$N(${g}) = ${a}^2 + ${Math.abs(b)}^2 = ${a * a} + ${b * b} = ${value}$。`,
                ),
              ],
            ],
            t(
              `Multiplying the generator by its conjugate gives $(${g})(${gaussianTex(a, -b)}) = ${a * a} + ${b * b} = ${value}$.`,
              `生成元乘以它的共轭得 $(${g})(${gaussianTex(a, -b)}) = ${a * a} + ${b * b} = ${value}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "multiplying-in-quotients-of-zn",
      title: t("Multiplying cosets", "陪集相乘"),
      explanation: t(
        "Multiply the representatives of the cosets and then reduce the result to the coset it belongs to. In $\\mathbb{Z}_{24}/\\langle 6 \\rangle$, $(5 + \\langle 6 \\rangle)(4 + \\langle 6 \\rangle) = 20 + \\langle 6 \\rangle = 2 + \\langle 6 \\rangle$.\n\nIn $\\mathbb{Z}_{60}/\\langle 12 \\rangle$, $(43 + \\langle 12 \\rangle)(29 + \\langle 12 \\rangle) = 1247 + \\langle 12 \\rangle = 11 + \\langle 12 \\rangle$, since $1247 = 1236 + 11$ and $1236$ is a multiple of $12$.\n\nCheck: reduce first: $43 \\equiv 7$ and $29 \\equiv 5$, and $(7)(5) = 35 \\equiv 11 \\pmod{12}$.\n\n> **Watch out.** Reduce modulo the generator $d$ of the ideal, not modulo $n$: the cosets of $\\langle d \\rangle$ are the residues modulo $d$.",
        "把陪集的代表元相乘，再把结果约化到它所属的陪集。在 $\\mathbb{Z}_{24}/\\langle 6 \\rangle$ 中，$(5 + \\langle 6 \\rangle)(4 + \\langle 6 \\rangle) = 20 + \\langle 6 \\rangle = 2 + \\langle 6 \\rangle$。\n\n在 $\\mathbb{Z}_{60}/\\langle 12 \\rangle$ 中，$(43 + \\langle 12 \\rangle)(29 + \\langle 12 \\rangle) = 1247 + \\langle 12 \\rangle = 11 + \\langle 12 \\rangle$，因为 $1247 = 1236 + 11$，而 $1236$ 是 $12$ 的倍数。\n\n检验：先约化：$43 \\equiv 7$，$29 \\equiv 5$，而 $(7)(5) = 35 \\equiv 11 \\pmod{12}$。\n\n> **注意。** 要模理想的生成元 $d$ 约化，而不是模 $n$：$\\langle d \\rangle$ 的陪集就是模 $d$ 的剩余类。",
      ),
      generate(rng) {
        const n = rng.pick([24, 30, 36, 40, 48, 60, 72]);
        const d = rng.pick(divisors(n).filter((x) => x >= 4 && x < n));
        const a = rng.int(2, n - 1);
        const b = rng.int(2, n - 1);
        const value = mod(a * b, d);
        const multiple = a * b - value;
        const [am, bm] = [mod(a, d), mod(b, d)];
        return numberProblem({
          prompt: t(
            `In $${zTex(n)}/\\langle ${d} \\rangle$, write $(${a} + \\langle ${d} \\rangle)(${b} + \\langle ${d} \\rangle)$ as $r + \\langle ${d} \\rangle$ with $0 \\le r < ${d}$. Find $r$.`,
            `在 $${zTex(n)}/\\langle ${d} \\rangle$ 中，把 $(${a} + \\langle ${d} \\rangle)(${b} + \\langle ${d} \\rangle)$ 写成 $r + \\langle ${d} \\rangle$，$0 \\le r < ${d}$。求 $r$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              mod(a + b, d),
              "That adds the representatives; multiplying cosets multiplies them.",
              "那是把代表元相加；陪集相乘应把代表元相乘。",
            ),
            mod(a * b, n) === value
              ? why(mod(value + 1, d), "That is off by one: recompute the remainder.", "差了一：请重新计算余数。")
              : why(
                  mod(a * b, n),
                  `That reduces modulo $${n}$; the cosets of $\\langle ${d} \\rangle$ are the residues modulo $${d}$.`,
                  `那是模 $${n}$ 约化；$\\langle ${d} \\rangle$ 的陪集是模 $${d}$ 的剩余类。`,
                ),
            why(
              am * bm,
              `That multiplies the reduced representatives but does not reduce the product modulo $${d}$.`,
              `那是把约化后的代表元相乘，但没有把乘积模 $${d}$ 约化。`,
            ),
          ]),
          solution: walked(
            [
              [["Multiply the representatives", "代表元相乘"], t(`$${a} \\cdot ${b} = ${a * b}$.`, `$${a} \\cdot ${b} = ${a * b}$。`)],
              [
                ["Reduce modulo the generator", "模生成元约化"],
                multiple === 0
                  ? t(
                      `$${a * b} < ${d}$, so it is already the remainder: $r = ${value}$.`,
                      `$${a * b} < ${d}$，所以它本身就是余数：$r = ${value}$。`,
                    )
                  : value === 0
                    ? t(
                        `$${a * b}$ is a multiple of $${d}$, so it lies in $\\langle ${d} \\rangle$ itself: $r = 0$.`,
                        `$${a * b}$ 是 $${d}$ 的倍数，所以它就在 $\\langle ${d} \\rangle$ 中：$r = 0$。`,
                      )
                    : t(
                        `$${a * b} = ${multiple} + ${value}$, and $${multiple}$ is a multiple of $${d}$, so $r = ${value}$.`,
                        `$${a * b} = ${multiple} + ${value}$，而 $${multiple}$ 是 $${d}$ 的倍数，所以 $r = ${value}$。`,
                      ),
              ],
            ],
            t(
              `Reduce first: $${a} \\equiv ${am}$ and $${b} \\equiv ${bm} \\pmod{${d}}$, and $(${am})(${bm}) = ${am * bm} \\equiv ${value}$.`,
              `先约化：$${a} \\equiv ${am}$，$${b} \\equiv ${bm} \\pmod{${d}}$，而 $(${am})(${bm}) = ${am * bm} \\equiv ${value}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** polyTex writes a polynomial from its coefficients, constant term first. */
export function polyTex(cs: readonly number[], v = "x"): string {
  const terms: string[] = [];
  for (let i = cs.length - 1; i >= 0; i--) {
    const c = cs[i]!;
    if (c === 0) continue;
    const mono = i === 0 ? "" : i === 1 ? v : `${v}^{${i}}`;
    const abs = Math.abs(c);
    const coef = mono !== "" && abs === 1 ? "" : `${abs}`;
    const sign = c < 0 ? "-" : "+";
    terms.push(terms.length === 0 ? `${c < 0 ? "-" : ""}${coef}${mono}` : ` ${sign} ${coef}${mono}`);
  }
  return terms.length === 0 ? "0" : terms.join("");
}

/** polynomialQuotientRings finds sizes of ℤₚ[x]/⟨f⟩ and multiplies in quotients by quadratics. */
export const polynomialQuotientRings: TopicDef = {
  id: "polynomial-quotient-rings",
  title: t("Polynomial Quotient Rings", "多项式商环"),
  summary: t(
    "For a nonconstant $f$ in $F[x]$, every coset of $\\langle f \\rangle$ contains exactly one polynomial of degree less than $\\deg f$, its remainder on division by $f$. So $F[x]/\\langle f \\rangle$ consists of these remainders, multiplied by reducing modulo $f$; $\\mathbb{Z}_p[x]/\\langle f \\rangle$ has $p^{\\deg f}$ elements, and $\\mathbb{R}[x]/\\langle x^2 + 1 \\rangle \\cong \\mathbb{C}$.",
    "对 $F[x]$ 中的非常数多项式 $f$，$\\langle f \\rangle$ 的每个陪集恰含一个次数小于 $\\deg f$ 的多项式，即除以 $f$ 的余式。所以 $F[x]/\\langle f \\rangle$ 由这些余式组成，乘法为模 $f$ 约化；$\\mathbb{Z}_p[x]/\\langle f \\rangle$ 有 $p^{\\deg f}$ 个元素，且 $\\mathbb{R}[x]/\\langle x^2 + 1 \\rangle \\cong \\mathbb{C}$。",
  ),
  intro: t(
    "In $\\mathbb{Z}_2[x]/\\langle x^2 + x + 1 \\rangle$ the elements are the remainders $0, 1, x, x + 1$, and since $x^2 = -x - 1 = x + 1$ there, $x \\cdot x = x + 1$.\n\nCheck: dividing $x^2$ by $x^2 + x + 1$ leaves remainder $-x - 1$, which is $x + 1$ modulo $2$.\n\nIn this lesson we count the elements of $\\mathbb{Z}_p[x]/\\langle f \\rangle$ and multiply in $F[x]/\\langle x^2 - c \\rangle$.",
    "在 $\\mathbb{Z}_2[x]/\\langle x^2 + x + 1 \\rangle$ 中，元素就是余式 $0, 1, x, x + 1$；由于其中 $x^2 = -x - 1 = x + 1$，所以 $x \\cdot x = x + 1$。\n\n检验：$x^2$ 除以 $x^2 + x + 1$ 的余式为 $-x - 1$，模 $2$ 即 $x + 1$。\n\n本课我们数出 $\\mathbb{Z}_p[x]/\\langle f \\rangle$ 的元素个数，并在 $F[x]/\\langle x^2 - c \\rangle$ 中做乘法。",
  ),
  prerequisites: ["quotient-rings", "dividing-polynomials-using-long-division"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sizes-of-polynomial-quotient-rings",
      title: t("Sizes of $\\mathbb{Z}_p[x]/\\langle f \\rangle$", "$\\mathbb{Z}_p[x]/\\langle f \\rangle$ 的大小"),
      explanation: t(
        "Every class has a unique remainder of degree less than the modulus polynomial, so count those remainders by their coefficients. $\\mathbb{Z}_3[x]/\\langle x^2 + 1 \\rangle$ consists of the $a + bx$ with $a, b \\in \\mathbb{Z}_3$: $3^2 = 9$ elements.\n\n$\\mathbb{Z}_5[x]/\\langle x^3 + 2x + 4 \\rangle$ consists of the $a + bx + cx^2$ with $a, b, c \\in \\mathbb{Z}_5$: $5^3 = 125$ elements.\n\nCheck: $5$ choices for each of the $3$ coefficients give $5 \\cdot 5 \\cdot 5 = 125$.\n\n> **Watch out.** A remainder of degree less than $n$ has $n$ coefficients, not $n + 1$; and the count is $p^n$, not $n^p$.",
        "每个类都有唯一一个次数小于模多项式的余式，所以按系数来数这些余式。$\\mathbb{Z}_3[x]/\\langle x^2 + 1 \\rangle$ 由 $a + bx$（$a, b \\in \\mathbb{Z}_3$）组成：共 $3^2 = 9$ 个元素。\n\n$\\mathbb{Z}_5[x]/\\langle x^3 + 2x + 4 \\rangle$ 由 $a + bx + cx^2$（$a, b, c \\in \\mathbb{Z}_5$）组成：共 $5^3 = 125$ 个元素。\n\n检验：$3$ 个系数各有 $5$ 种取法，共 $5 \\cdot 5 \\cdot 5 = 125$ 种。\n\n> **注意。** 次数小于 $n$ 的余式有 $n$ 个系数，而不是 $n + 1$ 个；个数是 $p^n$，而不是 $n^p$。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const deg = rng.int(2, p === 2 ? 6 : p === 3 ? 4 : 3);
        const cs = [rng.int(1, p - 1), ...range(1, deg - 1).map(() => rng.int(0, p - 1)), 1];
        const value = p ** deg;
        const coeffs = range(0, deg - 1)
          .map((i) => `a_{${i}}`)
          .join(", ");
        return numberProblem({
          prompt: t(
            `How many elements does $${zTex(p)}[x]/\\langle ${polyTex(cs)} \\rangle$ have?`,
            `$${zTex(p)}[x]/\\langle ${polyTex(cs)} \\rangle$ 有多少个元素？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              deg ** p,
              "That swaps the base and the exponent; there are $p$ choices for each coefficient.",
              "那是把底数和指数对调了；每个系数有 $p$ 种取法。",
            ),
            why(
              p * deg,
              "That multiplies the choices by the number of coefficients; the choices multiply together.",
              "那是把取法数乘以系数个数；各系数的取法应相乘。",
            ),
            why(
              p ** (deg - 1),
              `That counts $${deg - 1}$ coefficients; a remainder of degree less than $${deg}$ has $${deg}$.`,
              `那只数了 $${deg - 1}$ 个系数；次数小于 $${deg}$ 的余式有 $${deg}$ 个系数。`,
            ),
            why(
              p ** (deg + 1),
              `That counts $${deg + 1}$ coefficients, as for polynomials of degree at most $${deg}$; the remainders have degree less than $${deg}$.`,
              `那数了 $${deg + 1}$ 个系数，相当于次数不超过 $${deg}$ 的多项式；余式的次数小于 $${deg}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Describe the remainders", "描述余式"],
                t(
                  `Each coset has a unique representative of degree less than $${deg}$, with the $${deg}$ coefficients $${coeffs}$ in $${zTex(p)}$.`,
                  `每个陪集有唯一的次数小于 $${deg}$ 的代表元，它的 $${deg}$ 个系数 $${coeffs}$ 取自 $${zTex(p)}$。`,
                ),
              ],
              [
                ["Count them", "计数"],
                t(
                  `Each coefficient has $${p}$ choices: $${p}^{${deg}} = ${value}$.`,
                  `每个系数有 $${p}$ 种取法：$${p}^{${deg}} = ${value}$。`,
                ),
              ],
            ],
            t(
              `$${range(1, deg)
                .map(() => `${p}`)
                .join(" \\cdot ")} = ${value}$, one factor of $${p}$ for each coefficient.`,
              `$${range(1, deg)
                .map(() => `${p}`)
                .join(" \\cdot ")} = ${value}$，每个系数对应一个因子 $${p}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "multiplying-in-polynomial-quotient-rings",
      title: t("Multiplying in $F[x]/\\langle x^2 - c \\rangle$", "在 $F[x]/\\langle x^2 - c \\rangle$ 中相乘"),
      explanation: t(
        "Multiply the polynomials as usual, then use the relation given by the modulus to replace the square of the variable by a constant. In $\\mathbb{Z}_7[x]/\\langle x^2 - 3 \\rangle$, $x^2 = 3$, so $(2 + x)(4 + 5x) = 8 + 14x + 5x^2 = 8 + 14x + 15 = 23 + 14x = 2 + 0x$.\n\nIn $\\mathbb{Z}_{11}[x]/\\langle x^2 - 6 \\rangle$, $x^2 = 6$, so $(3 + 4x)(5 + 2x) = 15 + 26x + 8x^2 = 15 + 26x + 48 = 63 + 26x = 8 + 4x$.\n\nCheck: $63 = 55 + 8$ and $26 = 22 + 4$, and $55$ and $22$ are multiples of $11$.\n\n> **Watch out.** The modulus $x^2 - c$ gives $x^2 = c$, not $-c$. Replace $x^2$ before reducing, and reduce every coefficient modulo $p$ at the end.",
        "照常把多项式相乘，再用模所给出的关系把变量的平方换成常数。在 $\\mathbb{Z}_7[x]/\\langle x^2 - 3 \\rangle$ 中，$x^2 = 3$，所以 $(2 + x)(4 + 5x) = 8 + 14x + 5x^2 = 8 + 14x + 15 = 23 + 14x = 2 + 0x$。\n\n在 $\\mathbb{Z}_{11}[x]/\\langle x^2 - 6 \\rangle$ 中，$x^2 = 6$，所以 $(3 + 4x)(5 + 2x) = 15 + 26x + 8x^2 = 15 + 26x + 48 = 63 + 26x = 8 + 4x$。\n\n检验：$63 = 55 + 8$，$26 = 22 + 4$，而 $55$ 与 $22$ 都是 $11$ 的倍数。\n\n> **注意。** 模 $x^2 - c$ 给出 $x^2 = c$，而不是 $-c$。先替换 $x^2$，最后再把每个系数模 $p$ 约化。",
      ),
      generate(rng) {
        const p = rng.pick([5, 7, 11, 13]);
        const c = rng.int(2, p - 1);
        const [a, b, d, e] = [rng.int(0, p - 1), rng.int(1, p - 1), rng.int(0, p - 1), rng.int(1, p - 1)];
        const r0 = mod(a * d + c * b * e, p);
        const r1 = mod(a * e + b * d, p);
        const askConst = rng.bool();
        const f = polyTex([a, b]);
        const g = polyTex([d, e]);
        return numberProblem({
          prompt: t(
            `In $${zTex(p)}[x]/\\langle x^2 - ${c} \\rangle$, write $(${f})(${g})$ as $r + sx$ with $r, s \\in ${zTex(p)}$. Find $${askConst ? "r" : "s"}$.`,
            `在 $${zTex(p)}[x]/\\langle x^2 - ${c} \\rangle$ 中，把 $(${f})(${g})$ 写成 $r + sx$，$r, s \\in ${zTex(p)}$。求 $${askConst ? "r" : "s"}$。`,
          ),
          answer: askConst ? r0 : r1,
          mistakes: apart(
            askConst ? r0 : r1,
            askConst
              ? [
                  why(
                    mod(a * d, p),
                    `That drops the $x^2$ term; it becomes the constant $(${c})(${b * e})$.`,
                    `那漏掉了 $x^2$ 项；它会变成常数 $(${c})(${b * e})$。`,
                  ),
                  why(
                    mod(a * d - c * b * e, p),
                    `That uses $x^2 = -${c}$; the modulus $x^2 - ${c}$ gives $x^2 = ${c}$.`,
                    `那用了 $x^2 = -${c}$；模 $x^2 - ${c}$ 给出 $x^2 = ${c}$。`,
                  ),
                  why(r1, "That is $s$, the coefficient of $x$; the question asks for $r$.", "那是 $x$ 的系数 $s$；题目求的是 $r$。"),
                ]
              : [
                  why(
                    mod(a * e, p),
                    `That keeps only one of the two $x$ terms; add $(${b})(${d})$ as well.`,
                    `那只保留了两个 $x$ 项中的一个；还要加上 $(${b})(${d})$。`,
                  ),
                  why(
                    mod(b * e, p),
                    `That is the coefficient of $x^2$, which becomes a constant since $x^2 = ${c}$.`,
                    `那是 $x^2$ 的系数，由于 $x^2 = ${c}$，它会变成常数。`,
                  ),
                  why(r0, "That is $r$, the constant term; the question asks for $s$.", "那是常数项 $r$；题目求的是 $s$。"),
                ],
          ),
          solution: walked(
            [
              [
                ["Expand", "展开"],
                t(
                  `$(${f})(${g}) = ${poly([a * d, ""], [a * e + b * d, "x"], [b * e, "x^2"])}$.`,
                  `$(${f})(${g}) = ${poly([a * d, ""], [a * e + b * d, "x"], [b * e, "x^2"])}$。`,
                ),
              ],
              [
                ["Replace the square", "替换平方项"],
                t(
                  `Replace $x^2$ by $${c}$: $${poly([a * d + c * b * e, ""], [a * e + b * d, "x"])}$.`,
                  `把 $x^2$ 换成 $${c}$：$${poly([a * d + c * b * e, ""], [a * e + b * d, "x"])}$。`,
                ),
              ],
              [
                ["Reduce modulo the prime", "模素数约化"],
                t(
                  `Modulo $${p}$ this is $${poly([r0, ""], [r1, "x"])}$, so $${askConst ? `r = ${r0}` : `s = ${r1}`}$.`,
                  `模 $${p}$ 得 $${poly([r0, ""], [r1, "x"])}$，所以 $${askConst ? `r = ${r0}` : `s = ${r1}`}$。`,
                ),
              ],
            ],
            askConst
              ? t(
                  `$r = (${a})(${d}) + (${c})(${b})(${e}) = ${a * d + c * b * e} \\equiv ${r0} \\pmod{${p}}$.`,
                  `$r = (${a})(${d}) + (${c})(${b})(${e}) = ${a * d + c * b * e} \\equiv ${r0} \\pmod{${p}}$。`,
                )
              : t(
                  `$s = (${a})(${e}) + (${b})(${d}) = ${a * e + b * d} \\equiv ${r1} \\pmod{${p}}$.`,
                  `$s = (${a})(${e}) + (${b})(${d}) = ${a * e + b * d} \\equiv ${r1} \\pmod{${p}}$。`,
                ),
          ),
        });
      },
    },
  ],
};

/** ringHomomorphisms decides which maps are ring homomorphisms and evaluates evaluation homomorphisms. */
export const ringHomomorphisms: TopicDef = {
  id: "ring-homomorphisms",
  title: t("Ring Homomorphisms", "环同态"),
  summary: t(
    "A ring homomorphism φ: R → S preserves both operations: φ(a + b) = φ(a) + φ(b) and φ(ab) = φ(a)φ(b). Examples: reduction ℤ → ℤₙ, complex conjugation on ℂ, a + b√k ↦ a − b√k on ℤ[√k], and evaluation F[x] → F, f ↦ f(c). The map x ↦ 2x on ℤ is a group homomorphism but not a ring homomorphism.",
    "环同态 φ: R → S 保持两种运算：φ(a + b) = φ(a) + φ(b)，φ(ab) = φ(a)φ(b)。例如：约化 ℤ → ℤₙ，ℂ 上的复共轭，ℤ[√k] 上的 a + b√k ↦ a − b√k，以及求值 F[x] → F，f ↦ f(c)。ℤ 上的 x ↦ 2x 是群同态但不是环同态。",
  ),
  intro: t(
    "Reduction $\\varphi: \\mathbb{Z} \\to \\mathbb{Z}_5$, $x \\mapsto x \\bmod 5$, is a ring homomorphism: $\\varphi(7 \\cdot 8) = \\varphi(56) = 1$ and $\\varphi(7)\\varphi(8) = 2 \\cdot 3 = 6 \\equiv 1$.\n\nCheck: sums work too: $\\varphi(7 + 8) = \\varphi(15) = 0$ and $2 + 3 = 5 \\equiv 0$.\n\nIn this lesson we decide which maps are ring homomorphisms and compute evaluation homomorphisms into $\\mathbb{Z}_n$.",
    "约化 $\\varphi: \\mathbb{Z} \\to \\mathbb{Z}_5$，$x \\mapsto x \\bmod 5$ 是环同态：$\\varphi(7 \\cdot 8) = \\varphi(56) = 1$，$\\varphi(7)\\varphi(8) = 2 \\cdot 3 = 6 \\equiv 1$。\n\n检验：加法也成立：$\\varphi(7 + 8) = \\varphi(15) = 0$，$2 + 3 = 5 \\equiv 0$。\n\n本课我们判断哪些映射是环同态，并计算到 $\\mathbb{Z}_n$ 的求值同态。",
  ),
  prerequisites: ["ideals", "group-homomorphisms"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-ring-homomorphisms",
      title: t("Recognizing ring homomorphisms", "识别环同态"),
      explanation: t(
        "A ring homomorphism must respect both addition and multiplication, so check the product of two elements as well as the sum. $\\varphi(a + b\\sqrt 3) = a - b\\sqrt 3$ is a ring homomorphism of $\\mathbb{Z}[\\sqrt 3]$. $\\varphi(x) = 3x$ on $\\mathbb{Z}$ is not: $\\varphi(1^2) = \\varphi(1) = 3$ but $\\varphi(1)^2 = 9$.\n\nComplex conjugation $\\varphi(z) = \\bar z$ on $\\mathbb{C}$ is a ring homomorphism: $\\overline{(2 + i)(1 + 3i)} = \\overline{-1 + 7i} = -1 - 7i$, and $(2 - i)(1 - 3i) = -1 - 7i$.\n\nCheck: $\\overline{(2 + i) + (1 + 3i)} = 3 - 4i = (2 - i) + (1 - 3i)$.\n\n> **Watch out.** A map can preserve sums without preserving products: $x \\mapsto 3x$ is a group homomorphism of $\\mathbb{Z}$, but not a ring homomorphism. One failing pair is enough to say no.",
        "环同态必须同时保持加法和乘法，所以除了检查和，还要检查两个元素的乘积。$\\varphi(a + b\\sqrt 3) = a - b\\sqrt 3$ 是 $\\mathbb{Z}[\\sqrt 3]$ 的环同态。$\\mathbb{Z}$ 上的 $\\varphi(x) = 3x$ 不是：$\\varphi(1^2) = \\varphi(1) = 3$，而 $\\varphi(1)^2 = 9$。\n\n$\\mathbb{C}$ 上的复共轭 $\\varphi(z) = \\bar z$ 是环同态：$\\overline{(2 + i)(1 + 3i)} = \\overline{-1 + 7i} = -1 - 7i$，而 $(2 - i)(1 - 3i) = -1 - 7i$。\n\n检验：$\\overline{(2 + i) + (1 + 3i)} = 3 - 4i = (2 - i) + (1 - 3i)$。\n\n> **注意。** 一个映射可能保持加法却不保持乘法：$x \\mapsto 3x$ 是 $\\mathbb{Z}$ 的群同态，但不是环同态。要说“不是”，一对反例就够了。",
      ),
      generate(rng) {
        const n = rng.int(2, 12);
        const k = nonSquare(rng);
        const xPow = (e: number) => (e === 1 ? "x" : `x^{${e}}`);
        const decisions: Decision[] = [
          {
            prompt: t(
              `Is $\\varphi(x) = ${n}x$ a ring homomorphism $\\mathbb{Z} \\to \\mathbb{Z}$?`,
              `$\\varphi(x) = ${n}x$ 是环同态 $\\mathbb{Z} \\to \\mathbb{Z}$ 吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Check sums", "检验加法"],
                t(`$${n}(a + b) = ${n}a + ${n}b$, so sums are preserved.`, `$${n}(a + b) = ${n}a + ${n}b$，所以加法保持。`),
              ],
              [
                ["Check a product", "检验一个乘积"],
                t(
                  `$\\varphi(1^2) = \\varphi(1) = ${n}$ but $\\varphi(1)^2 = ${n * n}$: no, it is not a ring homomorphism.`,
                  `$\\varphi(1^2) = \\varphi(1) = ${n}$，而 $\\varphi(1)^2 = ${n * n}$：不是环同态。`,
                ),
              ],
            ],
            check: t(
              `$\\varphi(2 \\cdot 3) = ${6 * n}$ but $\\varphi(2)\\varphi(3) = ${2 * n} \\cdot ${3 * n} = ${6 * n * n}$, again different.`,
              `$\\varphi(2 \\cdot 3) = ${6 * n}$，而 $\\varphi(2)\\varphi(3) = ${2 * n} \\cdot ${3 * n} = ${6 * n * n}$，同样不等。`,
            ),
            wrong: t(
              `It preserves sums, but $\\varphi(1^2) = ${n} \\ne ${n * n} = \\varphi(1)^2$, so it does not preserve products.`,
              `它保持加法，但 $\\varphi(1^2) = ${n} \\ne ${n * n} = \\varphi(1)^2$，所以它不保持乘法。`,
            ),
          },
          {
            prompt: t(
              `Is $\\varphi(a + b\\sqrt{${k}}) = a - b\\sqrt{${k}}$ a ring homomorphism of $\\mathbb{Z}[\\sqrt{${k}}]$?`,
              `$\\varphi(a + b\\sqrt{${k}}) = a - b\\sqrt{${k}}$ 是 $\\mathbb{Z}[\\sqrt{${k}}]$ 的环同态吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Check sums", "检验加法"],
                t(
                  `Both sides of $\\varphi(\\text{sum})$ give $(a + c) - (b + d)\\sqrt{${k}}$.`,
                  `$\\varphi(\\text{和})$ 的两边都得 $(a + c) - (b + d)\\sqrt{${k}}$。`,
                ),
              ],
              [
                ["Check products", "检验乘法"],
                t(
                  `$\\varphi((a + b\\sqrt{${k}})(c + d\\sqrt{${k}}))$ and $(a - b\\sqrt{${k}})(c - d\\sqrt{${k}})$ both equal $(ac + ${k}bd) - (ad + bc)\\sqrt{${k}}$: yes, it is a ring homomorphism.`,
                  `$\\varphi((a + b\\sqrt{${k}})(c + d\\sqrt{${k}}))$ 与 $(a - b\\sqrt{${k}})(c - d\\sqrt{${k}})$ 都等于 $(ac + ${k}bd) - (ad + bc)\\sqrt{${k}}$：是环同态。`,
                ),
              ],
            ],
            check: t(
              `$(1 + \\sqrt{${k}})^2 = ${1 + k} + 2\\sqrt{${k}}$ maps to $${1 + k} - 2\\sqrt{${k}}$, which is $(1 - \\sqrt{${k}})^2$.`,
              `$(1 + \\sqrt{${k}})^2 = ${1 + k} + 2\\sqrt{${k}}$ 映为 $${1 + k} - 2\\sqrt{${k}}$，正是 $(1 - \\sqrt{${k}})^2$。`,
            ),
            wrong: t(
              `Changing the sign of $\\sqrt{${k}}$ respects sums and products, because $(-\\sqrt{${k}})^2 = ${k}$ as well.`,
              `改变 $\\sqrt{${k}}$ 的符号保持和与积，因为同样有 $(-\\sqrt{${k}})^2 = ${k}$。`,
            ),
          },
          {
            prompt: t(
              `Is $\\varphi(f) = f(${n})$ a ring homomorphism $\\mathbb{Z}[x] \\to \\mathbb{Z}$?`,
              `$\\varphi(f) = f(${n})$ 是环同态 $\\mathbb{Z}[x] \\to \\mathbb{Z}$ 吗？`,
            ),
            holds: true,
            steps: [
              [["Check sums", "检验加法"], t(`$(f + g)(${n}) = f(${n}) + g(${n})$.`, `$(f + g)(${n}) = f(${n}) + g(${n})$。`)],
              [
                ["Check products", "检验乘法"],
                t(`$(fg)(${n}) = f(${n})g(${n})$: yes, it is a ring homomorphism.`, `$(fg)(${n}) = f(${n})g(${n})$：是环同态。`),
              ],
            ],
            check: t(
              `For $f = x + 1$ and $g = x - 1$, $fg = x^2 - 1$ gives $${n * n - 1}$ at $${n}$, and $(${n + 1})(${n - 1}) = ${n * n - 1}$.`,
              `对 $f = x + 1$、$g = x - 1$，$fg = x^2 - 1$ 在 $${n}$ 处的值为 $${n * n - 1}$，而 $(${n + 1})(${n - 1}) = ${n * n - 1}$。`,
            ),
            wrong: t(
              "Evaluating at a number respects sums and products of polynomials, so it is a ring homomorphism.",
              "在一个数处求值保持多项式的和与积，所以它是环同态。",
            ),
          },
          {
            prompt: t(
              `Is $\\varphi(x) = x \\bmod ${n}$ a ring homomorphism $\\mathbb{Z} \\to ${zTex(n)}$?`,
              `$\\varphi(x) = x \\bmod ${n}$ 是环同态 $\\mathbb{Z} \\to ${zTex(n)}$ 吗？`,
            ),
            holds: true,
            steps: [
              [
                ["Check sums", "检验加法"],
                t(
                  `$(a + b) \\bmod ${n}$ is the sum of the residues of $a$ and $b$, reduced.`,
                  `$(a + b) \\bmod ${n}$ 就是 $a$ 与 $b$ 的余数之和再约化。`,
                ),
              ],
              [
                ["Check products", "检验乘法"],
                t(
                  `$ab \\bmod ${n}$ is the product of the residues, reduced: yes, it is a ring homomorphism.`,
                  `$ab \\bmod ${n}$ 就是余数之积再约化：是环同态。`,
                ),
              ],
            ],
            check: t(
              `$(${n + 1})(${n + 2}) = ${(n + 1) * (n + 2)} \\equiv ${mod(2, n)}$, and the residues give $(1)(${mod(2, n)}) = ${mod(2, n)}$.`,
              `$(${n + 1})(${n + 2}) = ${(n + 1) * (n + 2)} \\equiv ${mod(2, n)}$，而余数给出 $(1)(${mod(2, n)}) = ${mod(2, n)}$。`,
            ),
            wrong: t(
              `Reduction modulo $${n}$ respects sums and products, so it is a ring homomorphism.`,
              `模 $${n}$ 约化保持和与积，所以它是环同态。`,
            ),
          },
          {
            prompt: t(
              `Is $\\varphi(A) = \\det A$ a ring homomorphism from the $2 \\times 2$ real matrices to $\\mathbb{R}$?`,
              `$\\varphi(A) = \\det A$ 是从 $2 \\times 2$ 实矩阵到 $\\mathbb{R}$ 的环同态吗？`,
            ),
            holds: false,
            steps: [
              [
                ["Check products", "检验乘法"],
                t("$\\det(AB) = \\det A \\det B$, so products are preserved.", "$\\det(AB) = \\det A \\det B$，所以乘法保持。"),
              ],
              [
                ["Check a sum", "检验一个和"],
                t(
                  "$\\det(I + I) = \\det(2I) = 4$ but $\\det I + \\det I = 2$: no, it is not a ring homomorphism.",
                  "$\\det(I + I) = \\det(2I) = 4$，而 $\\det I + \\det I = 2$：不是环同态。",
                ),
              ],
            ],
            check: t(
              "$2I$ has diagonal entries $2$ and $2$ and zeros elsewhere, so its determinant is $2^2 = 4$.",
              "$2I$ 的对角元为 $2$ 和 $2$，其余为零，所以它的行列式为 $2^2 = 4$。",
            ),
            wrong: t(
              "It preserves products, but $\\det(I + I) = 4 \\ne 2 = \\det I + \\det I$, so it does not preserve sums.",
              "它保持乘法，但 $\\det(I + I) = 4 \\ne 2 = \\det I + \\det I$，所以它不保持加法。",
            ),
          },
          {
            prompt: t(
              `Is $\\varphi(f) = f'$, the derivative, a ring homomorphism $\\mathbb{R}[x] \\to \\mathbb{R}[x]$?`,
              `求导 $\\varphi(f) = f'$ 是环同态 $\\mathbb{R}[x] \\to \\mathbb{R}[x]$ 吗？`,
            ),
            holds: false,
            steps: [
              [["Check sums", "检验加法"], t("$(f + g)' = f' + g'$, so sums are preserved.", "$(f + g)' = f' + g'$，所以加法保持。")],
              [
                ["Check a product", "检验一个乘积"],
                t(
                  `$(x \\cdot x^{${n}})' = ${n + 1}x^{${n}}$, but $x' \\cdot (x^{${n}})' = ${n}${xPow(n - 1)}$: no, it is not a ring homomorphism.`,
                  `$(x \\cdot x^{${n}})' = ${n + 1}x^{${n}}$，而 $x' \\cdot (x^{${n}})' = ${n}${xPow(n - 1)}$：不是环同态。`,
                ),
              ],
            ],
            check: t(
              "The product rule $(fg)' = f'g + fg'$ is not $f'g'$; for constants, $(2 \\cdot 3)' = 0$ either way, so test with $x$.",
              "乘积法则 $(fg)' = f'g + fg'$ 不是 $f'g'$；对常数两边都是 $0$，所以要用 $x$ 来检验。",
            ),
            wrong: t(
              `It preserves sums, but $(x \\cdot x^{${n}})' \\ne x' \\cdot (x^{${n}})'$, so it does not preserve products.`,
              `它保持加法，但 $(x \\cdot x^{${n}})' \\ne x' \\cdot (x^{${n}})'$，所以它不保持乘法。`,
            ),
          },
        ];
        return decide(rng.pick(decisions));
      },
    },
    {
      id: "evaluation-homomorphisms-into-zn",
      title: t("Evaluation homomorphisms", "求值同态"),
      explanation: t(
        "Substituting a value for the variable and reducing respects both operations, so it is a ring homomorphism, computed by evaluating the polynomial. $\\varphi: \\mathbb{Z}[x] \\to \\mathbb{Z}_7$, $\\varphi(f) = f(3) \\bmod 7$, is a ring homomorphism. For $f = x^3 + 2x + 5$, $\\varphi(f) = 27 + 6 + 5 = 38 \\equiv 3$.\n\nWith $\\varphi(f) = f(4) \\bmod 9$ and $f = x^4 - 5x^2 + 2$, $\\varphi(f) = 256 - 80 + 2 = 178 \\equiv 7$, since $178 = 171 + 7$ and $171 = 9 \\cdot 19$.\n\nCheck: reduce as you go: $4^2 = 16 \\equiv 7$ and $4^4 \\equiv 7^2 = 49 \\equiv 4$, so $4 - 35 + 2 = -29 \\equiv 7$.\n\n> **Watch out.** Substitute the given value, not $1$ or $0$: $f(1)$ is the sum of the coefficients and $f(0)$ is the constant term. Keep the signs of negative coefficients.",
        "把变量换成一个值再约化，同时保持两种运算，所以它是环同态，计算方法就是求多项式的值。$\\varphi: \\mathbb{Z}[x] \\to \\mathbb{Z}_7$，$\\varphi(f) = f(3) \\bmod 7$ 是环同态。对 $f = x^3 + 2x + 5$，$\\varphi(f) = 27 + 6 + 5 = 38 \\equiv 3$。\n\n取 $\\varphi(f) = f(4) \\bmod 9$，$f = x^4 - 5x^2 + 2$，则 $\\varphi(f) = 256 - 80 + 2 = 178 \\equiv 7$，因为 $178 = 171 + 7$，而 $171 = 9 \\cdot 19$。\n\n检验：边算边约化：$4^2 = 16 \\equiv 7$，$4^4 \\equiv 7^2 = 49 \\equiv 4$，所以 $4 - 35 + 2 = -29 \\equiv 7$。\n\n> **注意。** 要代入给定的值，而不是 $1$ 或 $0$：$f(1)$ 是系数之和，$f(0)$ 是常数项。负系数的符号要保留。",
      ),
      generate(rng) {
        const n = rng.pick([5, 6, 7, 8, 9, 10, 11, 12, 13]);
        const c = rng.int(2, n - 1);
        const deg = rng.int(2, 4);
        const cs = [...range(0, deg - 1).map(() => rng.int(-6, 6)), 1];
        const raw = cs.reduce((s, a, i) => s + a * c ** i, 0);
        const value = mod(raw, n);
        const vals = cs
          .map((a, i) => a * c ** i)
          .reverse()
          .filter((v) => v !== 0);
        const sumTex = vals.map((v, i) => (i === 0 ? `${v}` : v < 0 ? ` - ${-v}` : ` + ${v}`)).join("");
        const cm = cs.map((a, i) => mod(a * mod(c ** i, n), n));
        return numberProblem({
          prompt: t(
            `Let $\\varphi: \\mathbb{Z}[x] \\to ${zTex(n)}$ be the ring homomorphism $\\varphi(f) = f(${c}) \\bmod ${n}$. Find $\\varphi(${polyTex(cs)})$.`,
            `设 $\\varphi: \\mathbb{Z}[x] \\to ${zTex(n)}$ 是环同态 $\\varphi(f) = f(${c}) \\bmod ${n}$。求 $\\varphi(${polyTex(cs)})$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              mod(
                cs.reduce((s, a) => s + a, 0),
                n,
              ),
              `That evaluates at $x = 1$, adding the coefficients; substitute $x = ${c}$.`,
              `那是在 $x = 1$ 处求值，即系数之和；应代入 $x = ${c}$。`,
            ),
            why(
              mod(cs[0]!, n),
              `That is only the constant term, the value at $x = 0$; substitute $x = ${c}$.`,
              `那只是常数项，即 $x = 0$ 处的值；应代入 $x = ${c}$。`,
            ),
            why(mod(raw + 1, n), "That is one too many: recompute the sum of the terms.", "多了一：请重新计算各项之和。"),
            why(mod(-raw, n), "That has the wrong sign: keep the signs of the terms.", "符号错了：要保留各项的符号。"),
          ]),
          solution: walked(
            [
              [
                ["Substitute", "代入"],
                t(
                  `$f(${c}) = ${polyTex(cs, `(${c})`)} = ${sumTex} = ${raw}$.`,
                  `$f(${c}) = ${polyTex(cs, `(${c})`)} = ${sumTex} = ${raw}$。`,
                ),
              ],
              [
                ["Reduce", "约化"],
                t(
                  `$${raw} - ${value} = ${raw - value}$ is a multiple of $${n}$, so $\\varphi(f) = ${value}$.`,
                  `$${raw} - ${value} = ${raw - value}$ 是 $${n}$ 的倍数，所以 $\\varphi(f) = ${value}$。`,
                ),
              ],
            ],
            t(
              `Reducing each term modulo $${n}$ first gives the residues $${[...cm].reverse().join(", ")}$, whose sum $${cm.reduce((s, v) => s + v, 0)}$ is again $\\equiv ${value}$.`,
              `先把每一项模 $${n}$ 约化，得余数 $${[...cm].reverse().join(", ")}$，它们之和 $${cm.reduce((s, v) => s + v, 0)}$ 同样 $\\equiv ${value}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** residueHom reports whether x ↦ kx is a ring homomorphism ℤₘ → ℤₙ. */
const residueHom = (k: number, m: number, n: number) => mod(k * k - k, n) === 0 && mod(m * k, n) === 0;

/** ringHomomorphismsBetweenResidueRings decides which multiplication maps ℤₘ → ℤₙ are ring homomorphisms and counts them. */
export const ringHomomorphismsBetweenResidueRings: TopicDef = {
  id: "ring-homomorphisms-between-residue-rings",
  title: t("Ring Homomorphisms Between Residue Rings", "剩余类环之间的环同态"),
  summary: t(
    "Every ring homomorphism ℤₘ → ℤₙ has the form x ↦ kx with k = φ(1). It is well defined and additive exactly when mk ≡ 0 (mod n), and it preserves products exactly when k is idempotent: k² ≡ k (mod n). So the ring homomorphisms ℤₘ → ℤₙ correspond to the idempotents k of ℤₙ with mk ≡ 0.",
    "每个环同态 ℤₘ → ℤₙ 都形如 x ↦ kx，其中 k = φ(1)。它良定义且保持加法当且仅当 mk ≡ 0 (mod n)，保持乘法当且仅当 k 是幂等元：k² ≡ k (mod n)。所以环同态 ℤₘ → ℤₙ 与满足 mk ≡ 0 的 ℤₙ 的幂等元 k 一一对应。",
  ),
  intro: t(
    "$x \\mapsto 3x$ from $\\mathbb{Z}_2$ to $\\mathbb{Z}_6$ is a ring homomorphism: $2 \\cdot 3 = 6 \\equiv 0 \\pmod 6$, so it is well defined, and $3^2 = 9 \\equiv 3 \\pmod 6$, so it preserves products.\n\nCheck: $\\varphi(1) + \\varphi(1) = 3 + 3 = 6 \\equiv 0 = \\varphi(0)$, as $1 + 1 = 0$ in $\\mathbb{Z}_2$ requires.\n\nIn this lesson we decide which maps $x \\mapsto kx$ are ring homomorphisms $\\mathbb{Z}_m \\to \\mathbb{Z}_n$ and count them.",
    "从 $\\mathbb{Z}_2$ 到 $\\mathbb{Z}_6$ 的 $x \\mapsto 3x$ 是环同态：$2 \\cdot 3 = 6 \\equiv 0 \\pmod 6$，所以它良定义；$3^2 = 9 \\equiv 3 \\pmod 6$，所以它保持乘法。\n\n检验：$\\varphi(1) + \\varphi(1) = 3 + 3 = 6 \\equiv 0 = \\varphi(0)$，正符合 $\\mathbb{Z}_2$ 中 $1 + 1 = 0$。\n\n本课我们判断哪些映射 $x \\mapsto kx$ 是环同态 $\\mathbb{Z}_m \\to \\mathbb{Z}_n$，并数出它们的个数。",
  ),
  prerequisites: ["ring-homomorphisms"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-homomorphisms-between-residue-rings",
      title: t("Is x ↦ kx a ring homomorphism?", "x ↦ kx 是环同态吗？"),
      explanation: t(
        "Such a map is a well defined ring homomorphism when it respects the modulus and the multiplier is idempotent in the target ring. $x \\mapsto 4x$ from $\\mathbb{Z}_6$ to $\\mathbb{Z}_{12}$ is a ring homomorphism: $6 \\cdot 4 = 24 \\equiv 0$ and $4^2 = 16 \\equiv 4 \\pmod{12}$. $x \\mapsto 3x$ is not: $9 \\not\\equiv 3$.\n\n$x \\mapsto 6x$ from $\\mathbb{Z}_5$ to $\\mathbb{Z}_{10}$ is a ring homomorphism: $5 \\cdot 6 = 30 \\equiv 0$ and $6^2 = 36 \\equiv 6 \\pmod{10}$.\n\nCheck: $x \\mapsto 5x$ from $\\mathbb{Z}_5$ to $\\mathbb{Z}_{10}$ fails, since $5^2 = 25 \\equiv 5$ holds but $5 \\cdot 5 = 25 \\not\\equiv 0 \\pmod{10}$.\n\n> **Watch out.** Both conditions are needed: $mk \\equiv 0 \\pmod n$ makes the map well defined, and $k^2 \\equiv k \\pmod n$ makes it preserve products. The identity $x \\mapsto x$ works only when $n \\mid m$.",
        "当这样的映射与模相容，并且乘数在目标环中是幂等元时，它就是良定义的环同态。从 $\\mathbb{Z}_6$ 到 $\\mathbb{Z}_{12}$ 的 $x \\mapsto 4x$ 是环同态：$6 \\cdot 4 = 24 \\equiv 0$，$4^2 = 16 \\equiv 4 \\pmod{12}$。$x \\mapsto 3x$ 不是：$9 \\not\\equiv 3$。\n\n从 $\\mathbb{Z}_5$ 到 $\\mathbb{Z}_{10}$ 的 $x \\mapsto 6x$ 是环同态：$5 \\cdot 6 = 30 \\equiv 0$，$6^2 = 36 \\equiv 6 \\pmod{10}$。\n\n检验：从 $\\mathbb{Z}_5$ 到 $\\mathbb{Z}_{10}$ 的 $x \\mapsto 5x$ 不行：$5^2 = 25 \\equiv 5$ 成立，但 $5 \\cdot 5 = 25 \\not\\equiv 0 \\pmod{10}$。\n\n> **注意。** 两个条件缺一不可：$mk \\equiv 0 \\pmod n$ 使映射良定义，$k^2 \\equiv k \\pmod n$ 使它保持乘法。恒等映射 $x \\mapsto x$ 只在 $n \\mid m$ 时可行。",
      ),
      generate(rng) {
        const want = rng.bool();
        let m: number;
        let n: number;
        let good: number[];
        do {
          m = rng.int(2, 30);
          n = rng.int(6, 30);
          good = range(1, n - 1).filter((k) => residueHom(k, m, n));
        } while (want && good.length === 0);
        const k = want ? rng.pick(good) : rng.pick(range(1, n - 1).filter((j) => !good.includes(j)));
        const add = mod(m * k, n) === 0;
        const mult = mod(k * k - k, n) === 0;
        const holds = add && mult;
        const mk = m * k;
        return decide({
          prompt: t(
            `Is $x \\mapsto ${k}x$ a ring homomorphism from $${zTex(m)}$ to $${zTex(n)}$?`,
            `$x \\mapsto ${k}x$ 是从 $${zTex(m)}$ 到 $${zTex(n)}$ 的环同态吗？`,
          ),
          holds,
          steps: [
            [
              ["Check it is well defined", "检验良定义"],
              add
                ? t(
                    `$(${m})(${k}) = ${mk}$ is a multiple of $${n}$, so $${m} \\equiv 0$ in $${zTex(m)}$ goes to $0$, and the map is well defined.`,
                    `$(${m})(${k}) = ${mk}$ 是 $${n}$ 的倍数，所以 $${zTex(m)}$ 中的 $${m} \\equiv 0$ 映到 $0$，映射良定义。`,
                  )
                : t(
                    `$(${m})(${k}) = ${mk} \\equiv ${mod(mk, n)} \\pmod{${n}}$, not $0$: no, the map is not even well defined.`,
                    `$(${m})(${k}) = ${mk} \\equiv ${mod(mk, n)} \\pmod{${n}}$，不是 $0$：映射甚至不是良定义的，所以不是环同态。`,
                  ),
            ],
            [
              ["Check products", "检验乘法"],
              t(
                `$${k}^2 = ${k * k} ${mult ? "\\equiv" : "\\not\\equiv"} ${k} \\pmod{${n}}$${holds ? ": yes, it is a ring homomorphism" : add ? ": no, it does not preserve products" : ""}.`,
                `$${k}^2 = ${k * k} ${mult ? "\\equiv" : "\\not\\equiv"} ${k} \\pmod{${n}}$${holds ? "：是环同态" : add ? "：它不保持乘法，所以不是环同态" : ""}。`,
              ),
            ],
          ],
          check: holds
            ? t(
                `$\\varphi(1) = ${k}$, and $\\varphi(1)^2 = ${mod(k * k, n)} = \\varphi(1^2)$: the image of the unity is idempotent, as it must be.`,
                `$\\varphi(1) = ${k}$，且 $\\varphi(1)^2 = ${mod(k * k, n)} = \\varphi(1^2)$：幺元的像是幂等元，本应如此。`,
              )
            : !add
              ? t(
                  `In $${zTex(m)}$, $${m} = 0$, yet $${m}$ would go to $${mod(mk, n)}$ while $0$ goes to $0$.`,
                  `在 $${zTex(m)}$ 中 $${m} = 0$，但 $${m}$ 会映到 $${mod(mk, n)}$，而 $0$ 映到 $0$。`,
                )
              : t(
                  `$\\varphi(1)^2 = ${mod(k * k, n)}$ but $\\varphi(1^2) = \\varphi(1) = ${k}$.`,
                  `$\\varphi(1)^2 = ${mod(k * k, n)}$，而 $\\varphi(1^2) = \\varphi(1) = ${k}$。`,
                ),
          wrong: holds
            ? t(
                `Both conditions hold: $(${m})(${k}) \\equiv 0$ and $${k}^2 \\equiv ${k} \\pmod{${n}}$.`,
                `两个条件都成立：$(${m})(${k}) \\equiv 0$，$${k}^2 \\equiv ${k} \\pmod{${n}}$。`,
              )
            : !add
              ? t(
                  `$(${m})(${k}) \\not\\equiv 0 \\pmod{${n}}$, so the map is not well defined.`,
                  `$(${m})(${k}) \\not\\equiv 0 \\pmod{${n}}$，所以映射不是良定义的。`,
                )
              : t(
                  `$${k}^2 \\not\\equiv ${k} \\pmod{${n}}$, so the map does not preserve products.`,
                  `$${k}^2 \\not\\equiv ${k} \\pmod{${n}}$，所以映射不保持乘法。`,
                ),
        });
      },
    },
    {
      id: "counting-homomorphisms-between-residue-rings",
      title: t("Counting ring homomorphisms", "数环同态"),
      explanation: t(
        "The ring homomorphisms $\\mathbb{Z}_{20} \\to \\mathbb{Z}_{30}$ come from the idempotents $0, 1, 6, 10, 15, 16, 21, 25$ of $\\mathbb{Z}_{30}$ with $20k \\equiv 0$: $k = 0, 6, 15, 21$, so there are $4$ (counting the zero map).\n\nThe ring homomorphisms $\\mathbb{Z}_{12} \\to \\mathbb{Z}_{6}$ come from the idempotents $0, 1, 3, 4$ of $\\mathbb{Z}_6$; every $k$ satisfies $12k \\equiv 0 \\pmod 6$, so there are $4$.\n\nCheck: $3^2 = 9 \\equiv 3$ and $4^2 = 16 \\equiv 4 \\pmod 6$, while $2^2 = 4$ and $5^2 = 25 \\equiv 1$ are not idempotent.\n\n> **Watch out.** This is not the count of group homomorphisms, which is $\\gcd(m, n)$: a ring homomorphism must also send $1$ to an idempotent. And not every idempotent works: $mk \\equiv 0 \\pmod n$ is needed too.",
        "环同态 $\\mathbb{Z}_{20} \\to \\mathbb{Z}_{30}$ 来自 $\\mathbb{Z}_{30}$ 的幂等元 $0, 1, 6, 10, 15, 16, 21, 25$ 中满足 $20k \\equiv 0$ 的：$k = 0, 6, 15, 21$，共 $4$ 个（含零映射）。\n\n环同态 $\\mathbb{Z}_{12} \\to \\mathbb{Z}_{6}$ 来自 $\\mathbb{Z}_6$ 的幂等元 $0, 1, 3, 4$；每个 $k$ 都满足 $12k \\equiv 0 \\pmod 6$，所以共 $4$ 个。\n\n检验：$3^2 = 9 \\equiv 3$，$4^2 = 16 \\equiv 4 \\pmod 6$，而 $2^2 = 4$ 与 $5^2 = 25 \\equiv 1$ 都不是幂等的。\n\n> **注意。** 这不是群同态的个数 $\\gcd(m, n)$：环同态还必须把 $1$ 映到幂等元。也不是每个幂等元都可以：还需要 $mk \\equiv 0 \\pmod n$。",
      ),
      generate(rng) {
        let m: number;
        let n: number;
        let ks: number[];
        do {
          m = rng.int(4, 60);
          n = rng.int(6, 60);
          ks = range(0, n - 1).filter((k) => residueHom(k, m, n));
        } while (ks.length < 2);
        const idem = range(0, n - 1).filter((k) => mod(k * k - k, n) === 0);
        const last = ks[ks.length - 1] as number;
        return numberProblem({
          prompt: t(
            `How many ring homomorphisms $${zTex(m)} \\to ${zTex(n)}$ are there, including the zero map?`,
            `$${zTex(m)} \\to ${zTex(n)}$ 的环同态（含零映射）有多少个？`,
          ),
          answer: ks.length,
          mistakes: apart(ks.length, [
            why(
              gcd(m, n),
              `That is $\\gcd(${m}, ${n})$, the number of group homomorphisms; a ring homomorphism must also send $1$ to an idempotent.`,
              `那是 $\\gcd(${m}, ${n})$，即群同态的个数；环同态还必须把 $1$ 映到幂等元。`,
            ),
            why(
              idem.length,
              `That counts every idempotent of $${zTex(n)}$; $k$ must also satisfy $${m}k \\equiv 0 \\pmod{${n}}$.`,
              `那数的是 $${zTex(n)}$ 的所有幂等元；$k$ 还必须满足 $${m}k \\equiv 0 \\pmod{${n}}$。`,
            ),
            why(
              ks.length + 1,
              "That is one too many: count each allowed $k$ exactly once, the zero map included.",
              "多了一个：每个可用的 $k$ 恰好数一次，包括零映射。",
            ),
          ]),
          solution: walked(
            [
              [
                ["List the idempotents", "列出幂等元"],
                t(
                  `The $k$ with $k^2 \\equiv k \\pmod{${n}}$ are $${idem.join(", ")}$.`,
                  `满足 $k^2 \\equiv k \\pmod{${n}}$ 的 $k$ 为 $${idem.join(", ")}$。`,
                ),
              ],
              [
                ["Keep those with the modulus condition", "保留满足模条件的"],
                t(
                  `Of these, $${m}k \\equiv 0 \\pmod{${n}}$ holds for $k = ${ks.join(", ")}$, so there are $${ks.length}$.`,
                  `其中满足 $${m}k \\equiv 0 \\pmod{${n}}$ 的是 $k = ${ks.join(", ")}$，所以共 $${ks.length}$ 个。`,
                ),
              ],
            ],
            t(
              `For $k = ${last}$: $${last}^2 = ${last * last} \\equiv ${mod(last * last, n)}$ and $(${m})(${last}) = ${m * last} \\equiv 0 \\pmod{${n}}$.`,
              `对 $k = ${last}$：$${last}^2 = ${last * last} \\equiv ${mod(last * last, n)}$，$(${m})(${last}) = ${m * last} \\equiv 0 \\pmod{${n}}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theImageAndKernelOfARingHomomorphism finds kernels in ℤ and images of residue ring homomorphisms. */
export const theImageAndKernelOfARingHomomorphism: TopicDef = {
  id: "the-image-and-kernel-of-a-ring-homomorphism",
  title: t("The Image and Kernel of a Ring Homomorphism", "环同态的像与核"),
  summary: t(
    "The kernel of a ring homomorphism φ: R → S is an ideal of R and the image is a subring of S, and R/ker φ ≅ φ(R). For example the kernel of ℤ → ℤₘ × ℤₙ, x ↦ (x mod m, x mod n), is lcm(m, n)ℤ, and the kernel of evaluation F[x] → F at c is ⟨x − c⟩.",
    "环同态 φ: R → S 的核是 R 的理想，像是 S 的子环，且 R/ker φ ≅ φ(R)。例如 ℤ → ℤₘ × ℤₙ，x ↦ (x mod m, x mod n) 的核是 lcm(m, n)ℤ，在 c 处求值 F[x] → F 的核为 ⟨x − c⟩。",
  ),
  intro: t(
    "Reduction $\\mathbb{Z} \\to \\mathbb{Z}_8$ has kernel $8\\mathbb{Z}$, the integers sent to $0$, and its image is all of $\\mathbb{Z}_8$; so $\\mathbb{Z}/8\\mathbb{Z} \\cong \\mathbb{Z}_8$ by the first isomorphism theorem.\n\nCheck: $24 \\bmod 8 = 0$, so $24$ is in the kernel, while $25 \\bmod 8 = 1$ is not $0$.\n\nIn this lesson we find kernels of homomorphisms from $\\mathbb{Z}$ and sizes of images and kernels between residue rings.",
    "约化 $\\mathbb{Z} \\to \\mathbb{Z}_8$ 的核为 $8\\mathbb{Z}$，即映到 $0$ 的整数，像是整个 $\\mathbb{Z}_8$；所以由第一同构定理，$\\mathbb{Z}/8\\mathbb{Z} \\cong \\mathbb{Z}_8$。\n\n检验：$24 \\bmod 8 = 0$，所以 $24$ 在核中；而 $25 \\bmod 8 = 1$ 不是 $0$。\n\n本课我们求从 $\\mathbb{Z}$ 出发的同态的核，以及剩余类环之间同态的像与核的大小。",
  ),
  prerequisites: ["ring-homomorphisms-between-residue-rings", "the-first-isomorphism-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "kernels-of-homomorphisms-from-z",
      title: t("Kernels from $\\mathbb{Z}$", "从 $\\mathbb{Z}$ 出发的核"),
      explanation: t(
        "The kernel of $\\mathbb{Z} \\to \\mathbb{Z}_4 \\times \\mathbb{Z}_6$, $x \\mapsto (x \\bmod 4, x \\bmod 6)$, consists of the common multiples of $4$ and $6$: $12\\mathbb{Z}$. So the image is isomorphic to $\\mathbb{Z}_{12}$.\n\nThe kernel of $\\mathbb{Z} \\to \\mathbb{Z}_{10} \\times \\mathbb{Z}_{15}$ is $30\\mathbb{Z}$, since $\\operatorname{lcm}(10, 15) = \\frac{10 \\cdot 15}{5} = 30$.\n\nCheck: $30 = 10 \\cdot 3 = 15 \\cdot 2$ goes to $(0, 0)$, and no smaller positive number is a multiple of both.\n\n> **Watch out.** The kernel is generated by the lcm, not the product: $4 \\cdot 6 = 24$, but $12$ already goes to $(0, 0)$. The two agree only when $\\gcd(m, n) = 1$.",
        "$\\mathbb{Z} \\to \\mathbb{Z}_4 \\times \\mathbb{Z}_6$，$x \\mapsto (x \\bmod 4, x \\bmod 6)$ 的核由 $4$ 与 $6$ 的公倍数组成：$12\\mathbb{Z}$。所以像同构于 $\\mathbb{Z}_{12}$。\n\n$\\mathbb{Z} \\to \\mathbb{Z}_{10} \\times \\mathbb{Z}_{15}$ 的核为 $30\\mathbb{Z}$，因为 $\\operatorname{lcm}(10, 15) = \\frac{10 \\cdot 15}{5} = 30$。\n\n检验：$30 = 10 \\cdot 3 = 15 \\cdot 2$ 映到 $(0, 0)$，且没有更小的正数同时是两者的倍数。\n\n> **注意。** 核由最小公倍数生成，而不是乘积：$4 \\cdot 6 = 24$，但 $12$ 已经映到 $(0, 0)$。只有当 $\\gcd(m, n) = 1$ 时两者才相同。",
      ),
      generate(rng) {
        const m = rng.int(2, 24);
        let n: number;
        do n = rng.int(2, 24);
        while (n === m);
        const value = lcm(m, n);
        const g = gcd(m, n);
        return numberProblem({
          prompt: t(
            `Let $\\varphi: \\mathbb{Z} \\to ${zTex(m)} \\times ${zTex(n)}$, $\\varphi(x) = (x \\bmod ${m}, x \\bmod ${n})$. Its kernel is $d\\mathbb{Z}$ for a positive integer $d$. Find $d$.`,
            `设 $\\varphi: \\mathbb{Z} \\to ${zTex(m)} \\times ${zTex(n)}$，$\\varphi(x) = (x \\bmod ${m}, x \\bmod ${n})$。它的核为 $d\\mathbb{Z}$，$d$ 为正整数。求 $d$。`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              m * n,
              `That is the product $${m} \\cdot ${n}$, a common multiple but not the least one, since $\\gcd(${m}, ${n}) = ${g}$.`,
              `那是乘积 $${m} \\cdot ${n}$，是公倍数但不是最小的，因为 $\\gcd(${m}, ${n}) = ${g}$。`,
            ),
            why(
              g,
              "That is the gcd; the kernel needs multiples of both moduli, so take the lcm.",
              "那是最大公因数；核中的数必须同时是两个模的倍数，所以要取最小公倍数。",
            ),
            why(m + n, "That adds the moduli; the kernel consists of the common multiples.", "那是把两个模相加；核由公倍数组成。"),
          ]),
          solution: walked(
            [
              [
                ["Describe the kernel", "描述核"],
                t(
                  `$\\varphi(x) = (0, 0)$ exactly when $${m} \\mid x$ and $${n} \\mid x$.`,
                  `$\\varphi(x) = (0, 0)$ 当且仅当 $${m} \\mid x$ 且 $${n} \\mid x$。`,
                ),
              ],
              [
                ["Take the lcm", "取最小公倍数"],
                t(
                  `The common multiples are the multiples of $\\operatorname{lcm}(${m}, ${n}) = \\frac{${m} \\cdot ${n}}{${g}} = ${value}$, so $d = ${value}$.`,
                  `公倍数就是 $\\operatorname{lcm}(${m}, ${n}) = \\frac{${m} \\cdot ${n}}{${g}} = ${value}$ 的倍数，所以 $d = ${value}$。`,
                ),
              ],
            ],
            t(
              `$${value} \\div ${m} = ${value / m}$ and $${value} \\div ${n} = ${value / n}$ are whole numbers, so $${value}$ goes to $(0, 0)$.`,
              `$${value} \\div ${m} = ${value / m}$ 与 $${value} \\div ${n} = ${value / n}$ 都是整数，所以 $${value}$ 映到 $(0, 0)$。`,
            ),
          ),
        });
      },
    },
    {
      id: "images-of-homomorphisms-between-residue-rings",
      title: t("Images of residue ring homomorphisms", "剩余类环同态的像"),
      explanation: t(
        "The image consists of the multiples of the multiplier in the target, so list those multiples. $x \\mapsto 4x$ is a ring homomorphism $\\mathbb{Z}_6 \\to \\mathbb{Z}_{12}$ with image $\\{0, 4, 8\\}$, so its kernel has $\\frac{6}{3} = 2$ elements: $\\{0, 3\\}$.\n\n$x \\mapsto 6x$ is a ring homomorphism $\\mathbb{Z}_5 \\to \\mathbb{Z}_{10}$ with image $\\langle 6 \\rangle = \\{0, 6, 2, 8, 4\\}$, which has $\\frac{10}{\\gcd(6, 10)} = 5$ elements, so its kernel has $\\frac{5}{5} = 1$ element: $\\{0\\}$.\n\nCheck: the image size $5$ times the kernel size $1$ is $5$, the size of $\\mathbb{Z}_5$.\n\n> **Watch out.** The image size comes from the target: $\\frac{n}{\\gcd(k, n)}$. The kernel size is then the size of the domain divided by the image size, by the first isomorphism theorem.",
        "像由目标环中乘数的倍数组成，所以把这些倍数列出来。$x \\mapsto 4x$ 是环同态 $\\mathbb{Z}_6 \\to \\mathbb{Z}_{12}$，像为 $\\{0, 4, 8\\}$，所以核有 $\\frac{6}{3} = 2$ 个元素：$\\{0, 3\\}$。\n\n$x \\mapsto 6x$ 是环同态 $\\mathbb{Z}_5 \\to \\mathbb{Z}_{10}$，像为 $\\langle 6 \\rangle = \\{0, 6, 2, 8, 4\\}$，有 $\\frac{10}{\\gcd(6, 10)} = 5$ 个元素，所以核有 $\\frac{5}{5} = 1$ 个元素：$\\{0\\}$。\n\n检验：像的大小 $5$ 乘以核的大小 $1$ 得 $5$，正是 $\\mathbb{Z}_5$ 的大小。\n\n> **注意。** 像的大小由目标环决定：$\\frac{n}{\\gcd(k, n)}$。再由第一同构定理，核的大小等于定义域的大小除以像的大小。",
      ),
      generate(rng) {
        let m: number;
        let n: number;
        let ks: number[];
        do {
          m = rng.int(4, 40);
          n = rng.int(6, 40);
          ks = range(2, n - 1).filter((k) => residueHom(k, m, n));
        } while (ks.length === 0);
        const k = rng.pick(ks);
        const g = gcd(k, n);
        const im = n / g;
        const askKernel = rng.bool();
        const ker = m / im;
        const answer = askKernel ? ker : im;
        const multiples = range(0, im - 1).map((i) => i * g);
        const listed = im <= 6 ? multiples.join(", ") : `0, ${g}, ${2 * g}, \\ldots, ${n - g}`;
        return numberProblem({
          prompt: askKernel
            ? t(
                `$x \\mapsto ${k}x$ is a ring homomorphism $${zTex(m)} \\to ${zTex(n)}$. How many elements does its kernel have?`,
                `$x \\mapsto ${k}x$ 是环同态 $${zTex(m)} \\to ${zTex(n)}$。它的核有多少个元素？`,
              )
            : t(
                `$x \\mapsto ${k}x$ is a ring homomorphism $${zTex(m)} \\to ${zTex(n)}$. How many elements does its image have?`,
                `$x \\mapsto ${k}x$ 是环同态 $${zTex(m)} \\to ${zTex(n)}$。它的像有多少个元素？`,
              ),
          answer,
          mistakes: apart(
            answer,
            askKernel
              ? [
                  why(im, "That is the size of the image; divide the size of the domain by it.", "那是像的大小；应用定义域的大小除以它。"),
                  why(
                    g,
                    `That is $\\gcd(${k}, ${n})$; the image has $\\frac{${n}}{${g}}$ elements, and the kernel has $${m}$ divided by that.`,
                    `那是 $\\gcd(${k}, ${n})$；像有 $\\frac{${n}}{${g}}$ 个元素，核的大小是 $${m}$ 除以它。`,
                  ),
                  why(
                    gcd(m, k),
                    `That is $\\gcd(${m}, ${k})$; the kernel size is $${m}$ divided by the image size.`,
                    `那是 $\\gcd(${m}, ${k})$；核的大小是 $${m}$ 除以像的大小。`,
                  ),
                ]
              : [
                  why(
                    ker,
                    "That is the size of the kernel; the image has $n / \\gcd(k, n)$ elements.",
                    "那是核的大小；像有 $n / \\gcd(k, n)$ 个元素。",
                  ),
                  why(
                    g,
                    `That is $\\gcd(${k}, ${n})$ itself; the image has $${n}$ divided by it.`,
                    `那是 $\\gcd(${k}, ${n})$ 本身；像的大小是 $${n}$ 除以它。`,
                  ),
                  why(
                    n,
                    `That is all of $${zTex(n)}$; the image is only the multiples of $${k}$.`,
                    `那是整个 $${zTex(n)}$；像只是 $${k}$ 的倍数。`,
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Find the image", "求像"],
                t(
                  `The image is $\\langle ${k} \\rangle = \\langle ${g} \\rangle$ in $${zTex(n)}$, the multiples $${listed}$ of $${g}$: $\\frac{${n}}{${g}} = ${im}$ elements.`,
                  `像为 $${zTex(n)}$ 中的 $\\langle ${k} \\rangle = \\langle ${g} \\rangle$，即 $${g}$ 的倍数 $${listed}$：共 $\\frac{${n}}{${g}} = ${im}$ 个元素。`,
                ),
              ],
              askKernel
                ? [
                    ["Use the first isomorphism theorem", "用第一同构定理"],
                    t(
                      `$${zTex(m)}/\\ker \\cong$ image, so the kernel has $\\frac{${m}}{${im}} = ${ker}$ elements.`,
                      `$${zTex(m)}/\\ker \\cong$ 像，所以核有 $\\frac{${m}}{${im}} = ${ker}$ 个元素。`,
                    ),
                  ]
                : [["State the size", "写出大小"], t(`So the image has $${im}$ elements.`, `所以像有 $${im}$ 个元素。`)],
            ],
            t(
              `$${k}x \\equiv 0 \\pmod{${n}}$ exactly when $${im} \\mid x$, so the kernel is the $${ker}$ multiples of $${im}$ in $${zTex(m)}$, and $${ker} \\times ${im} = ${m}$.`,
              `$${k}x \\equiv 0 \\pmod{${n}}$ 当且仅当 $${im} \\mid x$，所以核是 $${zTex(m)}$ 中 $${im}$ 的 $${ker}$ 个倍数，且 $${ker} \\times ${im} = ${m}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** primeIdealsAndMaximalIdeals recognizes prime and maximal ideals and counts maximal ideals. */
export const primeIdealsAndMaximalIdeals: TopicDef = {
  id: "prime-ideals-and-maximal-ideals",
  title: t("Prime Ideals and Maximal Ideals", "素理想与极大理想"),
  summary: t(
    "In a commutative ring R with unity, a proper ideal P is prime if ab ∈ P implies a ∈ P or b ∈ P, and a proper ideal M is maximal if no ideal lies strictly between M and R. Then R/P is an integral domain exactly when P is prime, and R/M is a field exactly when M is maximal; so maximal ideals are prime. In ℤ, nℤ is maximal exactly when n is prime, and {0} is prime but not maximal.",
    "在有幺元的交换环 R 中，若由 ab ∈ P 可推出 a ∈ P 或 b ∈ P，则真理想 P 称为素理想；若 M 与 R 之间严格地没有其他理想，则真理想 M 称为极大理想。R/P 是整环当且仅当 P 是素理想，R/M 是域当且仅当 M 是极大理想；所以极大理想都是素理想。在 ℤ 中，nℤ 是极大理想当且仅当 n 是素数，{0} 是素理想但不是极大理想。",
  ),
  intro: t(
    "In $\\mathbb{Z}$, $7\\mathbb{Z}$ is a maximal ideal, because $\\mathbb{Z}/7\\mathbb{Z} \\cong \\mathbb{Z}_7$ is a field, while $6\\mathbb{Z}$ is not even prime: $2 \\cdot 3 = 6 \\in 6\\mathbb{Z}$ although $2, 3 \\notin 6\\mathbb{Z}$.\n\nCheck: in $\\mathbb{Z}_6$, $2 \\cdot 3 = 0$ with $2 \\ne 0$ and $3 \\ne 0$, so $\\mathbb{Z}_6$ is not an integral domain.\n\nIn this lesson we recognize prime and maximal ideals of $\\mathbb{Z}_n$ and count the maximal ideals of a product.",
    "在 $\\mathbb{Z}$ 中，$7\\mathbb{Z}$ 是极大理想，因为 $\\mathbb{Z}/7\\mathbb{Z} \\cong \\mathbb{Z}_7$ 是域；而 $6\\mathbb{Z}$ 甚至不是素理想：$2 \\cdot 3 = 6 \\in 6\\mathbb{Z}$，但 $2, 3 \\notin 6\\mathbb{Z}$。\n\n检验：在 $\\mathbb{Z}_6$ 中 $2 \\cdot 3 = 0$，而 $2 \\ne 0$，$3 \\ne 0$，所以 $\\mathbb{Z}_6$ 不是整环。\n\n本课我们识别 $\\mathbb{Z}_n$ 的素理想与极大理想，并数出直积的极大理想。",
  ),
  prerequisites: ["quotient-rings", "introduction-to-fields"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-prime-and-maximal-ideals",
      title: t("Prime or maximal?", "素理想还是极大理想？"),
      explanation: t(
        "An ideal is maximal when the quotient is a field and prime when the quotient is an integral domain, so identify the quotient ring. $\\langle 5 \\rangle$ is maximal in $\\mathbb{Z}_{30}$, since $\\mathbb{Z}_{30}/\\langle 5 \\rangle \\cong \\mathbb{Z}_5$ is a field. $\\langle 6 \\rangle$ is not even prime: $2 \\cdot 3 \\in \\langle 6 \\rangle$ but $2, 3 \\notin \\langle 6 \\rangle$.\n\nIn $\\mathbb{Z}_{84}$, $\\langle 7 \\rangle$ is maximal, since the quotient is $\\mathbb{Z}_7$, and $\\langle 4 \\rangle$ is not prime, since the quotient $\\mathbb{Z}_4$ has $2 \\cdot 2 = 0$.\n\nCheck: $2 \\cdot 2 = 4 \\in \\langle 4 \\rangle$, but $2 \\notin \\langle 4 \\rangle$.\n\n> **Watch out.** For an ideal $\\langle d \\rangle$ with $d \\mid n$, the quotient $\\mathbb{Z}_d$ is finite, so prime and maximal mean the same thing: both hold exactly when $d$ is prime.",
        "当商环是域时理想是极大的，当商环是整环时理想是素的，所以要确定商环。$\\langle 5 \\rangle$ 是 $\\mathbb{Z}_{30}$ 的极大理想，因为 $\\mathbb{Z}_{30}/\\langle 5 \\rangle \\cong \\mathbb{Z}_5$ 是域。$\\langle 6 \\rangle$ 甚至不是素理想：$2 \\cdot 3 \\in \\langle 6 \\rangle$，但 $2, 3 \\notin \\langle 6 \\rangle$。\n\n在 $\\mathbb{Z}_{84}$ 中，$\\langle 7 \\rangle$ 是极大理想，因为商环为 $\\mathbb{Z}_7$；$\\langle 4 \\rangle$ 不是素理想，因为商环 $\\mathbb{Z}_4$ 中 $2 \\cdot 2 = 0$。\n\n检验：$2 \\cdot 2 = 4 \\in \\langle 4 \\rangle$，但 $2 \\notin \\langle 4 \\rangle$。\n\n> **注意。** 对 $d \\mid n$ 的理想 $\\langle d \\rangle$，商环 $\\mathbb{Z}_d$ 是有限的，所以素理想与极大理想是一回事：两者都恰在 $d$ 为素数时成立。",
      ),
      generate(rng) {
        const n = rng.pick([12, 18, 20, 24, 30, 36, 40, 42, 60, 70, 84, 90, 105]);
        const d = rng.pick(divisors(n).filter((x) => x > 1 && x < n));
        const kind = rng.pick(["prime", "maximal"]);
        const holds = isPrime(d);
        const p = primesOf(d)[0]!;
        const kindZh = kind === "prime" ? "素" : "极大";
        return decide({
          prompt: t(
            `Is $\\langle ${d} \\rangle$ a ${kind} ideal of $${zTex(n)}$?`,
            `$\\langle ${d} \\rangle$ 是 $${zTex(n)}$ 的${kindZh}理想吗？`,
          ),
          holds,
          steps: [
            [
              ["Identify the quotient", "确定商环"],
              t(
                `$${d} \\mid ${n}$, so $${zTex(n)}/\\langle ${d} \\rangle \\cong ${zTex(d)}$.`,
                `$${d} \\mid ${n}$，所以 $${zTex(n)}/\\langle ${d} \\rangle \\cong ${zTex(d)}$。`,
              ),
            ],
            holds
              ? [
                  ["Decide", "作出判断"],
                  t(
                    `$${d}$ is prime, so $${zTex(d)}$ is a field, hence an integral domain: yes, $\\langle ${d} \\rangle$ is ${kind}.`,
                    `$${d}$ 是素数，所以 $${zTex(d)}$ 是域，因而是整环：$\\langle ${d} \\rangle$ 是${kindZh}理想。`,
                  ),
                ]
              : [
                  ["Find zero divisors", "找零因子"],
                  t(
                    `$${p} \\cdot ${d / p} = ${d} \\equiv 0$ in $${zTex(d)}$, so $${zTex(d)}$ is not an integral domain, let alone a field: no, $\\langle ${d} \\rangle$ is not ${kind}.`,
                    `在 $${zTex(d)}$ 中 $${p} \\cdot ${d / p} = ${d} \\equiv 0$，所以 $${zTex(d)}$ 不是整环，更不是域：$\\langle ${d} \\rangle$ 不是${kindZh}理想。`,
                  ),
                ],
          ],
          check: holds
            ? t(
                `Every nonzero residue modulo $${d}$ is coprime to the prime $${d}$, so it has an inverse.`,
                `模 $${d}$ 的每个非零剩余都与素数 $${d}$ 互素，所以都有逆元。`,
              )
            : t(
                `$${p} \\cdot ${d / p} = ${d} \\in \\langle ${d} \\rangle$, but neither $${p}$ nor $${d / p}$ is a multiple of $${d}$.`,
                `$${p} \\cdot ${d / p} = ${d} \\in \\langle ${d} \\rangle$，但 $${p}$ 与 $${d / p}$ 都不是 $${d}$ 的倍数。`,
              ),
          wrong: holds
            ? t(
                `$${zTex(d)}$ is a field because $${d}$ is prime, so $\\langle ${d} \\rangle$ is maximal, and therefore also prime.`,
                `由于 $${d}$ 是素数，$${zTex(d)}$ 是域，所以 $\\langle ${d} \\rangle$ 是极大理想，因而也是素理想。`,
              )
            : t(
                `$${zTex(d)}$ has the zero divisors $${p}$ and $${d / p}$, so $\\langle ${d} \\rangle$ is not prime, and a maximal ideal would have to be prime.`,
                `$${zTex(d)}$ 有零因子 $${p}$ 与 $${d / p}$，所以 $\\langle ${d} \\rangle$ 不是素理想，而极大理想必须是素理想。`,
              ),
        });
      },
    },
    {
      id: "counting-maximal-ideals",
      title: t("Counting maximal ideals", "数极大理想"),
      explanation: t(
        "The maximal ideals of a product replace one factor by one of its maximal ideals and keep the other factor whole. The maximal ideals of $\\mathbb{Z}_{12} \\times \\mathbb{Z}_{15}$ are $M \\times \\mathbb{Z}_{15}$ and $\\mathbb{Z}_{12} \\times M$ for maximal $M$: $\\langle 2 \\rangle, \\langle 3 \\rangle$ in $\\mathbb{Z}_{12}$ and $\\langle 3 \\rangle, \\langle 5 \\rangle$ in $\\mathbb{Z}_{15}$, so $4$ in all.\n\n$\\mathbb{Z}_{8} \\times \\mathbb{Z}_{9}$ has $2$ maximal ideals: $\\langle 2 \\rangle \\times \\mathbb{Z}_9$ and $\\mathbb{Z}_8 \\times \\langle 3 \\rangle$.\n\nCheck: the quotients are $\\mathbb{Z}_2$ and $\\mathbb{Z}_3$, both fields.\n\n> **Watch out.** Count the primes of each factor separately: the prime $3$ appears in both $\\mathbb{Z}_{12}$ and $\\mathbb{Z}_{15}$ and gives two maximal ideals. And $\\langle 2 \\rangle \\times \\langle 3 \\rangle$ is not maximal: it lies inside $\\langle 2 \\rangle \\times \\mathbb{Z}_{15}$.",
        "直积的极大理想是把一个因子换成它的某个极大理想，而保持另一个因子不变。$\\mathbb{Z}_{12} \\times \\mathbb{Z}_{15}$ 的极大理想为 $M \\times \\mathbb{Z}_{15}$ 与 $\\mathbb{Z}_{12} \\times M$，$M$ 取极大理想：$\\mathbb{Z}_{12}$ 中的 $\\langle 2 \\rangle, \\langle 3 \\rangle$ 与 $\\mathbb{Z}_{15}$ 中的 $\\langle 3 \\rangle, \\langle 5 \\rangle$，共 $4$ 个。\n\n$\\mathbb{Z}_{8} \\times \\mathbb{Z}_{9}$ 有 $2$ 个极大理想：$\\langle 2 \\rangle \\times \\mathbb{Z}_9$ 与 $\\mathbb{Z}_8 \\times \\langle 3 \\rangle$。\n\n检验：商环分别为 $\\mathbb{Z}_2$ 与 $\\mathbb{Z}_3$，都是域。\n\n> **注意。** 要分别数每个因子的素因数：素数 $3$ 同时出现在 $\\mathbb{Z}_{12}$ 与 $\\mathbb{Z}_{15}$ 中，给出两个极大理想。而 $\\langle 2 \\rangle \\times \\langle 3 \\rangle$ 不是极大理想：它包含在 $\\langle 2 \\rangle \\times \\mathbb{Z}_{15}$ 中。",
      ),
      generate(rng) {
        const m = rng.int(4, 60);
        const n = rng.int(4, 60);
        const pm = primesOf(m);
        const pn = primesOf(n);
        const value = pm.length + pn.length;
        const ideals = (ps: number[]) => ps.map((p) => `\\langle ${p} \\rangle`).join(", ");
        const p = pm[0] as number;
        return numberProblem({
          prompt: t(
            `How many maximal ideals does $${zTex(m)} \\times ${zTex(n)}$ have?`,
            `$${zTex(m)} \\times ${zTex(n)}$ 有多少个极大理想？`,
          ),
          answer: value,
          mistakes: apart(value, [
            why(
              primesOf(m * n).length,
              `That counts the distinct primes of $${m * n}$, merging primes the two factors share; each factor contributes its own maximal ideals.`,
              `那数的是 $${m * n}$ 的不同素因数，把两个因子共有的素数合并了；每个因子各自贡献自己的极大理想。`,
            ),
            why(
              pm.length * pn.length,
              "That multiplies the counts, pairing a maximal ideal of each factor; a maximal ideal changes only one coordinate.",
              "那是把个数相乘，相当于把两个因子的极大理想配对；极大理想只改变一个坐标。",
            ),
            why(
              value + 1,
              "That is one too many: the whole ring is not a maximal ideal, since maximal ideals are proper.",
              "多了一个：整个环不是极大理想，因为极大理想是真理想。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Describe the maximal ideals", "描述极大理想"],
                t(
                  `They are $M \\times ${zTex(n)}$ and $${zTex(m)} \\times M$ with $M$ maximal in one factor.`,
                  `它们是 $M \\times ${zTex(n)}$ 与 $${zTex(m)} \\times M$，其中 $M$ 是某个因子的极大理想。`,
                ),
              ],
              [
                ["List them in each factor", "在每个因子中列出"],
                t(
                  `The maximal ideals of $${zTex(m)}$ are $${ideals(pm)}$ and those of $${zTex(n)}$ are $${ideals(pn)}$, one for each prime divisor.`,
                  `$${zTex(m)}$ 的极大理想为 $${ideals(pm)}$，$${zTex(n)}$ 的为 $${ideals(pn)}$，每个素因数对应一个。`,
                ),
              ],
              [["Add", "相加"], t(`$${pm.length} + ${pn.length} = ${value}$.`, `$${pm.length} + ${pn.length} = ${value}$。`)],
            ],
            t(
              `$(${zTex(m)} \\times ${zTex(n)})/(\\langle ${p} \\rangle \\times ${zTex(n)}) \\cong ${zTex(p)}$, a field, so $\\langle ${p} \\rangle \\times ${zTex(n)}$ is indeed maximal.`,
              `$(${zTex(m)} \\times ${zTex(n)})/(\\langle ${p} \\rangle \\times ${zTex(n)}) \\cong ${zTex(p)}$ 是域，所以 $\\langle ${p} \\rangle \\times ${zTex(n)}$ 确实是极大理想。`,
            ),
          ),
        });
      },
    },
  ],
};

/** abstractAlgebraRingTopics are the topics of Abstract Algebra unit 8 on rings, ideals and ring homomorphisms. */
export const abstractAlgebraRingTopics: readonly TopicDef[] = [
  introductionToRings,
  commutativeRings,
  ringsWithUnity,
  integralDomains,
  introductionToFields,
  theCharacteristicOfARing,
  theUnitsOfARing,
  findingTheInverseOfAMatrixOverARing,
  theFieldOfQuotientsOfAnIntegralDomain,
  subrings,
  ideals,
  generatingElementsOfPrincipalIdealRings,
  quotientRings,
  polynomialQuotientRings,
  ringHomomorphisms,
  ringHomomorphismsBetweenResidueRings,
  theImageAndKernelOfARingHomomorphism,
  primeIdealsAndMaximalIdeals,
];
