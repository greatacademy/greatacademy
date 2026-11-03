import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";
import { divisors, type Fact, factProblem, gcd, lcm, mod, modInverse, phi, texChoice } from "./abstract-algebra-common.ts";
import { type Mat2, mat2Tex } from "./abstract-algebra-groups.ts";
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
  prerequisites: ["abelian-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-rings",
      title: t("Recognizing rings", "识别环"),
      explanation: t(
        "$3\\mathbb{Z}$ is a ring under the usual operations: it is an additive group, closed under multiplication. The positive integers are not: they have no additive inverses. The odd integers are not: $1 + 1 = 2$ is even.",
        "$3\\mathbb{Z}$ 在通常运算下是环：它是加法群，且对乘法封闭。正整数集不是：没有加法逆元。奇数集不是：$1 + 1 = 2$ 是偶数。",
      ),
      generate(rng) {
        const n = rng.int(2, 12);
        const k = nonSquare(rng);
        const facts: Fact[] = [
          {
            prompt: t(
              `Is $${n}\\mathbb{Z}$ a ring under the usual addition and multiplication?`,
              `$${n}\\mathbb{Z}$ 在通常的加法和乘法下是环吗？`,
            ),
            holds: true,
            reason: t(
              `It is an abelian group under addition and closed under multiplication, and the ring laws hold because they hold in $\\mathbb{Z}$.`,
              `它是加法阿贝尔群且对乘法封闭，环的运算律在 $\\mathbb{Z}$ 中成立，因而在其中成立。`,
            ),
          },
          {
            prompt: t(
              `Is $\\{x \\in \\mathbb{Z} : x \\ge ${n}\\}$ a ring under the usual operations?`,
              `$\\{x \\in \\mathbb{Z} : x \\ge ${n}\\}$ 在通常运算下是环吗？`,
            ),
            holds: false,
            reason: t("It contains no additive identity and no additive inverses.", "它不含加法单位元，也没有加法逆元。"),
          },
          {
            prompt: t(
              `Is $\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Z}\\}$ a ring under the usual operations?`,
              `$\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Z}\\}$ 在通常运算下是环吗？`,
            ),
            holds: true,
            reason: t(
              `$(a + b\\sqrt{${k}})(c + d\\sqrt{${k}}) = (ac + ${k}bd) + (ad + bc)\\sqrt{${k}}$, so it is closed under multiplication as well as subtraction.`,
              `$(a + b\\sqrt{${k}})(c + d\\sqrt{${k}}) = (ac + ${k}bd) + (ad + bc)\\sqrt{${k}}$，所以它对乘法和减法都封闭。`,
            ),
          },
          {
            prompt: t(
              `Is $\\{a + b\\sqrt[3]{${k}} : a, b \\in \\mathbb{Z}\\}$ a ring under the usual operations?`,
              `$\\{a + b\\sqrt[3]{${k}} : a, b \\in \\mathbb{Z}\\}$ 在通常运算下是环吗？`,
            ),
            holds: false,
            reason: t(
              `$\\sqrt[3]{${k}} \\cdot \\sqrt[3]{${k}} = \\sqrt[3]{${k * k}}$ is not of the form $a + b\\sqrt[3]{${k}}$.`,
              `$\\sqrt[3]{${k}} \\cdot \\sqrt[3]{${k}} = \\sqrt[3]{${k * k}}$ 不具有 $a + b\\sqrt[3]{${k}}$ 的形式。`,
            ),
          },
          {
            prompt: t(
              `Is the set of $${n} \\times ${n}$ matrices with integer entries a ring under matrix addition and multiplication?`,
              `整数元素的 $${n} \\times ${n}$ 矩阵在矩阵加法和乘法下是环吗？`,
            ),
            holds: true,
            reason: t("Matrix multiplication is associative and distributes over addition.", "矩阵乘法满足结合律，且对加法满足分配律。"),
          },
          {
            prompt: t(
              `Is $\\{x \\in \\mathbb{Z} : x \\equiv 1 \\pmod{${n}}\\}$ a ring under the usual operations?`,
              `$\\{x \\in \\mathbb{Z} : x \\equiv 1 \\pmod{${n}}\\}$ 在通常运算下是环吗？`,
            ),
            holds: false,
            reason: t(
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
            reason: t(
              "The operations are inherited from $\\mathbb{Z}$, so all ring laws hold.",
              "运算继承自 $\\mathbb{Z}$，所以环的运算律都成立。",
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "multiplying-in-quadratic-integer-rings",
      title: t("Multiplying in $\\mathbb{Z}[\\sqrt{k}]$", "在 $\\mathbb{Z}[\\sqrt{k}]$ 中做乘法"),
      explanation: t(
        "Multiply as with binomials, then replace the square of the root by the integer it stands for. $(2 + 3\\sqrt{5})(1 - \\sqrt{5}) = 2 - 2\\sqrt{5} + 3\\sqrt{5} - 15 = -13 + \\sqrt{5}$.",
        "像二项式那样相乘，再把根号的平方换成它所代表的整数。$(2 + 3\\sqrt{5})(1 - \\sqrt{5}) = 2 - 2\\sqrt{5} + 3\\sqrt{5} - 15 = -13 + \\sqrt{5}$。",
      ),
      generate(rng) {
        const k = nonSquare(rng);
        const [a, c] = [rng.nonZero(-6, 6), rng.nonZero(-6, 6)];
        const [b, d] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
        const x = a * c + k * b * d;
        const y = a * d + b * c;
        const askRational = rng.bool();
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
          wrong: askRational ? [a * c + b * d, a * c - k * b * d, y] : [a * d - b * c, b * d, x],
          solution: t(
            `$(${surdTex(a, b, k)})(${surdTex(c, d, k)}) = (${sumTex(a * c, k * b * d)}) + (${sumTex(a * d, b * c)})\\sqrt{${k}} = ${surdTex(x, y, k)}$.`,
            `$(${surdTex(a, b, k)})(${surdTex(c, d, k)}) = (${sumTex(a * c, k * b * d)}) + (${sumTex(a * d, b * c)})\\sqrt{${k}} = ${surdTex(x, y, k)}$。`,
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
  prerequisites: ["introduction-to-rings"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-commutative-rings",
      title: t("Recognizing commutative rings", "识别交换环"),
      explanation: t(
        "$\\mathbb{Z}_4 \\times \\mathbb{Z}$ is commutative, since multiplication is done in each coordinate. The ring of $2 \\times 2$ real matrices is not.",
        "$\\mathbb{Z}_4 \\times \\mathbb{Z}$ 是交换环，因为乘法按坐标进行。$2 \\times 2$ 实矩阵环不是。",
      ),
      generate(rng) {
        const m = rng.int(2, 12);
        const n = rng.int(2, 4);
        const k = nonSquare(rng);
        const facts: Fact[] = [
          {
            prompt: t(`Is $${zTex(m)} \\times \\mathbb{Z}$ a commutative ring?`, `$${zTex(m)} \\times \\mathbb{Z}$ 是交换环吗？`),
            holds: true,
            reason: t("Multiplication is coordinatewise in commutative rings.", "乘法按坐标在交换环中进行。"),
          },
          {
            prompt: t(
              `Is the ring of $${n} \\times ${n}$ matrices over $${zTex(m)}$ commutative?`,
              `$${zTex(m)}$ 上的 $${n} \\times ${n}$ 矩阵环是交换环吗？`,
            ),
            holds: false,
            reason: t(
              "Matrix units such as $E_{12}E_{21} = E_{11}$ and $E_{21}E_{12} = E_{22}$ do not commute.",
              "矩阵单位如 $E_{12}E_{21} = E_{11}$ 与 $E_{21}E_{12} = E_{22}$ 不可交换。",
            ),
          },
          {
            prompt: t(`Is $\\mathbb{Z}[\\sqrt{${k}}]$ a commutative ring?`, `$\\mathbb{Z}[\\sqrt{${k}}]$ 是交换环吗？`),
            holds: true,
            reason: t("It is a subring of $\\mathbb{R}$, which is commutative.", "它是 $\\mathbb{R}$ 的子环，而 $\\mathbb{R}$ 是交换的。"),
          },
          {
            prompt: t(
              `Is the ring of upper triangular $${n} \\times ${n}$ real matrices commutative?`,
              `$${n} \\times ${n}$ 上三角实矩阵环是交换环吗？`,
            ),
            holds: false,
            reason: t("$E_{11}E_{12} = E_{12}$ but $E_{12}E_{11} = 0$.", "$E_{11}E_{12} = E_{12}$，而 $E_{12}E_{11} = 0$。"),
          },
          {
            prompt: t(
              `Is the ring of polynomials with coefficients in $${zTex(m)}$ commutative?`,
              `系数在 $${zTex(m)}$ 中的多项式环是交换环吗？`,
            ),
            holds: true,
            reason: t("Polynomial multiplication over a commutative ring is commutative.", "交换环上的多项式乘法是交换的。"),
          },
          {
            prompt: t(
              `Is the ring of $${n} \\times ${n}$ diagonal matrices over $\\mathbb{Z}$ commutative?`,
              `$\\mathbb{Z}$ 上 $${n} \\times ${n}$ 对角矩阵环是交换环吗？`,
            ),
            holds: true,
            reason: t("Diagonal matrices multiply entry by entry along the diagonal.", "对角矩阵沿对角线逐项相乘。"),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "commutators-of-matrices",
      title: t("Commutators of matrices", "矩阵的交换子"),
      explanation: t(
        "A commutator measures how far two elements are from commuting, and it equals the identity exactly when they commute. With $A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$ and $B = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$: $AB = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$ and $BA = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$, so $AB - BA = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$.",
        "交换子衡量两个元素离可交换有多远，当且仅当它们可交换时，交换子等于单位元。设 $A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$，$B = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix}$：$AB = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix}$，$BA = \\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$，所以 $AB - BA = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$。",
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
        return texChoice(
          rng,
          t(
            `Let $A = ${mat2Tex(a)}$ and $B = ${mat2Tex(b)}$. Find $AB - BA$.`,
            `设 $A = ${mat2Tex(a)}$，$B = ${mat2Tex(b)}$。求 $AB - BA$。`,
          ),
          mat2Tex(c),
          [mat2Tex(neg), mat2Tex([c[0], c[2], c[1], c[3]]), mat2Tex([0, 0, 0, 0]), mat2Tex([c[3], c[1], c[2], c[0]])],
          t(
            `$AB = ${mat2Tex(mulMat(a, b))}$ and $BA = ${mat2Tex(mulMat(b, a))}$, so $AB - BA = ${mat2Tex(c)}$.`,
            `$AB = ${mat2Tex(mulMat(a, b))}$，$BA = ${mat2Tex(mulMat(b, a))}$，所以 $AB - BA = ${mat2Tex(c)}$。`,
          ),
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
  prerequisites: ["commutative-rings"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-rings-with-unity",
      title: t("Recognizing unities", "识别幺元"),
      explanation: t(
        "$2\\mathbb{Z}$ has no unity: $e \\cdot 2 = 2$ forces $e = 1 \\notin 2\\mathbb{Z}$. The matrices $\\begin{pmatrix} a & 0 \\\\ 0 & 0 \\end{pmatrix}$ have unity $\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$, even though it is not the identity matrix.",
        "$2\\mathbb{Z}$ 没有幺元：$e \\cdot 2 = 2$ 迫使 $e = 1 \\notin 2\\mathbb{Z}$。矩阵 $\\begin{pmatrix} a & 0 \\\\ 0 & 0 \\end{pmatrix}$ 的幺元为 $\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$，尽管它不是单位矩阵。",
      ),
      generate(rng) {
        const n = rng.int(2, 12);
        const m = rng.int(2, 12);
        const facts: Fact[] = [
          {
            prompt: t(`Does $${n}\\mathbb{Z}$ have a unity?`, `$${n}\\mathbb{Z}$ 有幺元吗？`),
            holds: false,
            reason: t(
              `$e \\cdot ${n} = ${n}$ forces $e = 1$, which is not in $${n}\\mathbb{Z}$.`,
              `$e \\cdot ${n} = ${n}$ 迫使 $e = 1$，而 $1 \\notin ${n}\\mathbb{Z}$。`,
            ),
          },
          {
            prompt: t(`Does $${zTex(m)} \\times ${n}\\mathbb{Z}$ have a unity?`, `$${zTex(m)} \\times ${n}\\mathbb{Z}$ 有幺元吗？`),
            holds: false,
            reason: t(
              `A unity would need a unity in the second coordinate, but $${n}\\mathbb{Z}$ has none.`,
              `幺元在第二个坐标上也必须是幺元，但 $${n}\\mathbb{Z}$ 没有。`,
            ),
          },
          {
            prompt: t(`Does $${zTex(m)} \\times \\mathbb{Z}$ have a unity?`, `$${zTex(m)} \\times \\mathbb{Z}$ 有幺元吗？`),
            holds: true,
            reason: t("$(1, 1)$ is a unity.", "$(1, 1)$ 是幺元。"),
          },
          {
            prompt: t(
              `Does the ring of matrices $\\begin{pmatrix} a & 0 \\\\ 0 & 0 \\end{pmatrix}$ with $a \\in ${zTex(m)}$ have a unity?`,
              `由矩阵 $\\begin{pmatrix} a & 0 \\\\ 0 & 0 \\end{pmatrix}$（$a \\in ${zTex(m)}$）构成的环有幺元吗？`,
            ),
            holds: true,
            reason: t(
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
            reason: t(
              "A unity would have to be the identity matrix, whose entries are not all even.",
              "幺元只能是单位矩阵，而它的元素并非全为偶数。",
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "unities-of-subrings-of-zn",
      title: t("Unities of subrings of $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 子环的幺元"),
      explanation: t(
        "A subring may have a unity different from one, namely an element of the subring that multiplies every element of it to itself. In $\\mathbb{Z}_{10}$, the subring $\\langle 2 \\rangle = \\{0, 2, 4, 6, 8\\}$ has unity $6$: $6 \\equiv 0 \\pmod 2$ and $6 \\equiv 1 \\pmod 5$, so $6x = x$ for every even $x$.",
        "子环可能有不同于 1 的单位元，也就是子环中一个与其每个元素相乘都得到该元素本身的元素。在 $\\mathbb{Z}_{10}$ 中，子环 $\\langle 2 \\rangle = \\{0, 2, 4, 6, 8\\}$ 的幺元为 $6$：$6 \\equiv 0 \\pmod 2$ 且 $6 \\equiv 1 \\pmod 5$，所以对每个偶数 $x$ 有 $6x = x$。",
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
        return numberProblem({
          prompt: t(
            `In $${zTex(n)}$, the subring $\\langle ${d} \\rangle$ has a unity. Find it.`,
            `在 $${zTex(n)}$ 中，子环 $\\langle ${d} \\rangle$ 有幺元。求它。`,
          ),
          answer: e!,
          wrong: [d, 1, n - d, mod(e! + d, n)],
          solution: t(
            `The unity $e$ must satisfy $e \\equiv 0 \\pmod{${d}}$ and $e \\equiv 1 \\pmod{${n / d}}$, giving $e = ${e}$; then $${e}x = x$ for every $x \\in \\langle ${d} \\rangle$.`,
            `幺元 $e$ 须满足 $e \\equiv 0 \\pmod{${d}}$ 与 $e \\equiv 1 \\pmod{${n / d}}$，得 $e = ${e}$；于是对每个 $x \\in \\langle ${d} \\rangle$ 有 $${e}x = x$。`,
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
  prerequisites: ["rings-with-unity"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-zero-divisors-in-zn",
      title: t("Zero divisors in $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 中的零因子"),
      explanation: t(
        "In this ring every nonzero element is either a unit or a zero divisor, so subtract the units and zero from the total. In $\\mathbb{Z}_{12}$, the units are $1, 5, 7, 11$, so the zero divisors are the other $12 - 4 - 1 = 7$ nonzero elements: $2, 3, 4, 6, 8, 9, 10$.",
        "在这个环中，每个非零元素要么是单位，要么是零因子，所以从总数中减去单位和零。在 $\\mathbb{Z}_{12}$ 中，单位为 $1, 5, 7, 11$，所以零因子是其余 $12 - 4 - 1 = 7$ 个非零元素：$2, 3, 4, 6, 8, 9, 10$。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(6, 80);
        while (isPrime(n));
        const value = n - phi(n) - 1;
        return numberProblem({
          prompt: t(`How many zero divisors does $${zTex(n)}$ have?`, `$${zTex(n)}$ 有多少个零因子？`),
          answer: value,
          wrong: [n - phi(n), phi(n), divisors(n).length - 2, value - 1],
          solution: t(
            `The nonzero elements that are not units: $${n} - \\varphi(${n}) - 1 = ${n} - ${phi(n)} - 1 = ${value}$.`,
            `非零且非单位的元素：$${n} - \\varphi(${n}) - 1 = ${n} - ${phi(n)} - 1 = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "recognizing-integral-domains",
      title: t("Recognizing integral domains", "识别整环"),
      explanation: t(
        "An integral domain is a commutative ring with unity in which a product is zero only when one of the factors is zero. $\\mathbb{Z}_{13}$ is an integral domain, but $\\mathbb{Z}_{15}$ is not: $3 \\cdot 5 = 0$. $\\mathbb{Z} \\times \\mathbb{Z}$ is not either: $(1, 0)(0, 1) = (0, 0)$.",
        "整环是有单位元的交换环，其中乘积为零只有在某个因子为零时才会发生。$\\mathbb{Z}_{13}$ 是整环，而 $\\mathbb{Z}_{15}$ 不是：$3 \\cdot 5 = 0$。$\\mathbb{Z} \\times \\mathbb{Z}$ 也不是：$(1, 0)(0, 1) = (0, 0)$。",
      ),
      generate(rng) {
        const n = rng.int(4, 40);
        const k = nonSquare(rng);
        const p = primesOf(n)[0]!;
        const facts: Fact[] = [
          {
            prompt: t(`Is $${zTex(n)}$ an integral domain?`, `$${zTex(n)}$ 是整环吗？`),
            holds: isPrime(n),
            reason: isPrime(n)
              ? t(
                  `$${n}$ is prime, so $${n} \\mid ab$ forces $${n} \\mid a$ or $${n} \\mid b$.`,
                  `$${n}$ 是素数，所以 $${n} \\mid ab$ 迫使 $${n} \\mid a$ 或 $${n} \\mid b$。`,
                )
              : t(`$${p} \\cdot ${n / p} = 0$ in $${zTex(n)}$.`, `在 $${zTex(n)}$ 中 $${p} \\cdot ${n / p} = 0$。`),
          },
          {
            prompt: t(`Is $\\mathbb{Z}[\\sqrt{${k}}]$ an integral domain?`, `$\\mathbb{Z}[\\sqrt{${k}}]$ 是整环吗？`),
            holds: true,
            reason: t(
              "It is a commutative subring of $\\mathbb{R}$ containing $1$, and $\\mathbb{R}$ has no zero divisors.",
              "它是含 $1$ 的 $\\mathbb{R}$ 的交换子环，而 $\\mathbb{R}$ 没有零因子。",
            ),
          },
          {
            prompt: t(`Is $\\mathbb{Z} \\times ${zTex(n)}$ an integral domain?`, `$\\mathbb{Z} \\times ${zTex(n)}$ 是整环吗？`),
            holds: false,
            reason: t("$(1, 0)(0, 1) = (0, 0)$.", "$(1, 0)(0, 1) = (0, 0)$。"),
          },
          {
            prompt: t(
              `Is the ring of polynomials with coefficients in $${zTex(n)}$ an integral domain?`,
              `系数在 $${zTex(n)}$ 中的多项式环是整环吗？`,
            ),
            holds: isPrime(n),
            reason: isPrime(n)
              ? t(
                  `$${zTex(n)}$ is an integral domain, and the leading coefficient of a product is the product of the leading coefficients.`,
                  `$${zTex(n)}$ 是整环，乘积的首项系数等于首项系数之积。`,
                )
              : t(`The constants $${p}$ and $${n / p}$ multiply to $0$.`, `常数 $${p}$ 与 $${n / p}$ 之积为 $0$。`),
          },
        ];
        return factProblem(rng.pick(facts));
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
  prerequisites: ["integral-domains", "multiplicative-inverses-modulo-n"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-fields",
      title: t("Recognizing fields", "识别域"),
      explanation: t(
        "A field is a commutative ring in which every nonzero element has a multiplicative inverse, so check whether the inverses stay in the set. $\\mathbb{Q}(\\sqrt{2})$ is a field: $\\frac{1}{a + b\\sqrt 2} = \\frac{a - b\\sqrt 2}{a^2 - 2b^2}$. $\\mathbb{Z}[\\sqrt 2]$ is not: $2$ has no inverse in it.",
        "域是每个非零元素都有乘法逆元的交换环，所以要检查这些逆元是否仍在集合中。$\\mathbb{Q}(\\sqrt{2})$ 是域：$\\frac{1}{a + b\\sqrt 2} = \\frac{a - b\\sqrt 2}{a^2 - 2b^2}$。$\\mathbb{Z}[\\sqrt 2]$ 不是：$2$ 在其中没有逆元。",
      ),
      generate(rng) {
        const n = rng.int(4, 40);
        const k = nonSquare(rng);
        const facts: Fact[] = [
          {
            prompt: t(`Is $${zTex(n)}$ a field?`, `$${zTex(n)}$ 是域吗？`),
            holds: isPrime(n),
            reason: isPrime(n)
              ? t(
                  `$${n}$ is prime, so every nonzero element is coprime to $${n}$ and has an inverse.`,
                  `$${n}$ 是素数，所以每个非零元素与 $${n}$ 互素，有逆元。`,
                )
              : t(`$${primesOf(n)[0]}$ has no inverse modulo $${n}$.`, `$${primesOf(n)[0]}$ 模 $${n}$ 没有逆元。`),
          },
          {
            prompt: t(
              `Is $\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Q}\\}$ a field?`,
              `$\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Q}\\}$ 是域吗？`,
            ),
            holds: true,
            reason: t(
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
            reason: t(
              `$2$ has no inverse: $\\frac{1}{2}$ is not of the form $a + b\\sqrt{${k}}$ with integers $a, b$.`,
              `$2$ 没有逆元：$\\frac{1}{2}$ 不能写成整数 $a, b$ 的 $a + b\\sqrt{${k}}$。`,
            ),
          },
          {
            prompt: t(`Is $${zTex(n)} \\times ${zTex(n)}$ a field?`, `$${zTex(n)} \\times ${zTex(n)}$ 是域吗？`),
            holds: false,
            reason: t(
              "$(1, 0)$ is nonzero but has no inverse, since $(1, 0)(a, b) = (a, 0)$.",
              "$(1, 0)$ 非零但没有逆元，因为 $(1, 0)(a, b) = (a, 0)$。",
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "solving-linear-equations-in-zp",
      title: t("Solving ax = b in ℤₚ", "在 ℤₚ 中解 ax = b"),
      explanation: t(
        "Modulo a prime every nonzero element has an inverse, so a linear equation is solved by multiplying by the inverse of the coefficient. In $\\mathbb{Z}_{11}$, $3x = 7$ gives $x = 7 \\cdot 3^{-1} = 7 \\cdot 4 = 28 \\equiv 6$. Check: $3 \\cdot 6 = 18 \\equiv 7$.",
        "模素数时每个非零元素都有逆元，所以线性方程可以通过乘以系数的逆元来求解。在 $\\mathbb{Z}_{11}$ 中，$3x = 7$ 得 $x = 7 \\cdot 3^{-1} = 7 \\cdot 4 = 28 \\equiv 6$。验证：$3 \\cdot 6 = 18 \\equiv 7$。",
      ),
      generate(rng) {
        const p = rng.pick([5, 7, 11, 13, 17, 19, 23, 29, 31]);
        const a = rng.int(2, p - 1);
        const b = rng.int(1, p - 1);
        const ai = modInverse(a, p);
        const x = mod(b * ai, p);
        return numberProblem({
          prompt: t(`Solve $${a}x = ${b}$ in $${zTex(p)}$.`, `在 $${zTex(p)}$ 中解 $${a}x = ${b}$。`),
          answer: x,
          wrong: [mod(b * a, p), ai, mod(b - a, p), mod(p - x, p)].filter((w) => w !== x),
          solution: t(
            `$${a}^{-1} = ${ai}$ in $${zTex(p)}$, so $x = ${b} \\cdot ${ai} \\equiv ${x}$.`,
            `在 $${zTex(p)}$ 中 $${a}^{-1} = ${ai}$，所以 $x = ${b} \\cdot ${ai} \\equiv ${x}$。`,
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
  prerequisites: ["integral-domains"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "characteristics-of-product-rings",
      title: t("Characteristics of products", "直积的特征"),
      explanation: t(
        "The characteristic is the least number of copies of the unity that sum to zero, which in a product must work in every coordinate. $\\mathbb{Z}_4 \\times \\mathbb{Z}_6$ has characteristic $\\operatorname{lcm}(4, 6) = 12$: $12(a, b) = (0, 0)$ always, and $(1, 1)$ needs all $12$. $\\mathbb{Z} \\times \\mathbb{Z}_6$ has characteristic $0$.",
        "特征是使单位元的若干份相加等于零的最小份数，在直积中这必须对每个坐标都成立。$\\mathbb{Z}_4 \\times \\mathbb{Z}_6$ 的特征为 $\\operatorname{lcm}(4, 6) = 12$：总有 $12(a, b) = (0, 0)$，而 $(1, 1)$ 恰需 $12$。$\\mathbb{Z} \\times \\mathbb{Z}_6$ 的特征为 $0$。",
      ),
      generate(rng) {
        const ns = range(1, rng.int(2, 3)).map(() => rng.int(2, 20));
        const withZ = rng.bool(0.2);
        const value = withZ ? 0 : ns.reduce((a, b) => lcm(a, b), 1);
        const tex = [...(withZ ? ["\\mathbb{Z}"] : []), ...ns.map(zTex)].join(" \\times ");
        return numberProblem({
          prompt: t(
            `Find the characteristic of $${tex}$. (Enter $0$ if the characteristic is $0$.)`,
            `求 $${tex}$ 的特征。（若特征为 $0$，填 $0$。）`,
          ),
          answer: value,
          wrong: [ns.reduce((a, b) => a * b, 1), Math.max(...ns), ns.reduce((a, b) => gcd(a, b)), lcm(ns[0]!, ns[1]!)].filter(
            (x) => x !== value,
          ),
          solution: withZ
            ? t(
                "No positive multiple of $1$ is $0$ in $\\mathbb{Z}$, so the characteristic is $0$.",
                "在 $\\mathbb{Z}$ 中 $1$ 的正整数倍都不为 $0$，所以特征为 $0$。",
              )
            : t(
                `The characteristic is the additive order of the unity $(${ns.map(() => 1).join(", ")})$: $\\operatorname{lcm}(${ns.join(", ")}) = ${value}$.`,
                `特征是幺元 $(${ns.map(() => 1).join(", ")})$ 的加法阶：$\\operatorname{lcm}(${ns.join(", ")}) = ${value}$。`,
              ),
        });
      },
    },
    {
      id: "possible-characteristics-of-integral-domains",
      title: t("Characteristics of integral domains", "整环的特征"),
      explanation: t(
        "If an integral domain had characteristic $6$, then $(2 \\cdot 1)(3 \\cdot 1) = 6 \\cdot 1 = 0$ with $2 \\cdot 1 \\ne 0$ and $3 \\cdot 1 \\ne 0$, a contradiction. So the characteristic is $0$ or prime.",
        "若整环的特征为 $6$，则 $(2 \\cdot 1)(3 \\cdot 1) = 6 \\cdot 1 = 0$，而 $2 \\cdot 1 \\ne 0$、$3 \\cdot 1 \\ne 0$，矛盾。所以特征为 $0$ 或素数。",
      ),
      generate(rng) {
        const n = rng.int(2, 100);
        const prime = isPrime(n);
        const p = primesOf(n)[0]!;
        return factProblem({
          prompt: t(`Can an integral domain have characteristic $${n}$?`, `整环的特征可以是 $${n}$ 吗？`),
          holds: prime,
          reason: prime
            ? t(
                `$${n}$ is prime, and $${zTex(n)}$ is an integral domain of characteristic $${n}$.`,
                `$${n}$ 是素数，$${zTex(n)}$ 就是特征为 $${n}$ 的整环。`,
              )
            : t(
                `$(${p} \\cdot 1)(${n / p} \\cdot 1) = ${n} \\cdot 1 = 0$ would make $${p} \\cdot 1$ a zero divisor.`,
                `$(${p} \\cdot 1)(${n / p} \\cdot 1) = ${n} \\cdot 1 = 0$ 会使 $${p} \\cdot 1$ 成为零因子。`,
              ),
        });
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
  prerequisites: ["introduction-to-fields"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-units-of-product-rings",
      title: t("Units of products", "直积的单位"),
      explanation: t(
        "An element of a product ring is a unit exactly when every coordinate is a unit, so multiply the numbers of units. $U(\\mathbb{Z}_8 \\times \\mathbb{Z}_9) = U(8) \\times U(9)$ has $4 \\cdot 6 = 24$ elements.",
        "直积环中的元素是单位，当且仅当每个坐标都是单位，所以把各自的单位个数相乘。$U(\\mathbb{Z}_8 \\times \\mathbb{Z}_9) = U(8) \\times U(9)$ 有 $4 \\cdot 6 = 24$ 个元素。",
      ),
      generate(rng) {
        const m = rng.int(3, 30);
        const n = rng.int(3, 30);
        const value = phi(m) * phi(n);
        return numberProblem({
          prompt: t(`How many units does $${zTex(m)} \\times ${zTex(n)}$ have?`, `$${zTex(m)} \\times ${zTex(n)}$ 有多少个单位？`),
          answer: value,
          wrong: [phi(m) + phi(n), phi(m * n) === value ? value + 1 : phi(m * n), m * n - 1, (m - 1) * (n - 1)].filter((x) => x !== value),
          solution: t(
            `$(a, b)$ is a unit exactly when both coordinates are: $\\varphi(${m}) \\cdot \\varphi(${n}) = ${phi(m)} \\cdot ${phi(n)} = ${value}$.`,
            `$(a, b)$ 是单位当且仅当两个坐标都是单位：$\\varphi(${m}) \\cdot \\varphi(${n}) = ${phi(m)} \\cdot ${phi(n)} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "units-of-quadratic-integer-rings",
      title: t("Units of $\\mathbb{Z}[\\sqrt{k}]$", "$\\mathbb{Z}[\\sqrt{k}]$ 的单位"),
      explanation: t(
        "The norm is multiplicative, so an element can be a unit only when its norm is a unit of the integers, plus or minus one. $3 + 2\\sqrt 2$ is a unit of $\\mathbb{Z}[\\sqrt 2]$: its norm is $9 - 8 = 1$, and $(3 + 2\\sqrt 2)(3 - 2\\sqrt 2) = 1$. $1 + \\sqrt 3$ is not a unit of $\\mathbb{Z}[\\sqrt 3]$: its norm is $-2$.",
        "范数是积性的，所以一个元素只有在它的范数是整数的单位，即正负 1 时，才可能是单位。$3 + 2\\sqrt 2$ 是 $\\mathbb{Z}[\\sqrt 2]$ 的单位：范数为 $9 - 8 = 1$，且 $(3 + 2\\sqrt 2)(3 - 2\\sqrt 2) = 1$。$1 + \\sqrt 3$ 不是 $\\mathbb{Z}[\\sqrt 3]$ 的单位：范数为 $-2$。",
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
        return factProblem({
          prompt: t(
            `Is $${surdTex(a, sb, k)}$ a unit of $\\mathbb{Z}[\\sqrt{${k}}]$?`,
            `$${surdTex(a, sb, k)}$ 是 $\\mathbb{Z}[\\sqrt{${k}}]$ 的单位吗？`,
          ),
          holds,
          reason: holds
            ? t(
                `Its norm is $${a}^2 - ${k} \\cdot ${b}^2 = ${norm}$, so its inverse is $${norm === 1 ? "" : "-"}(${surdTex(a, -sb, k)})$.`,
                `它的范数为 $${a}^2 - ${k} \\cdot ${b}^2 = ${norm}$，所以它的逆为 $${norm === 1 ? "" : "-"}(${surdTex(a, -sb, k)})$。`,
              )
            : t(
                `Its norm is $${a}^2 - ${k} \\cdot ${b}^2 = ${norm} \\ne \\pm 1$, and the norm of a unit must be $\\pm 1$.`,
                `它的范数为 $${a}^2 - ${k} \\cdot ${b}^2 = ${norm} \\ne \\pm 1$，而单位的范数必须为 $\\pm 1$。`,
              ),
        });
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
  prerequisites: ["the-units-of-a-ring"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "invertibility-of-matrices-over-zn",
      title: t("Invertible or not", "是否可逆"),
      explanation: t(
        "Over $\\mathbb{Z}_{10}$, $\\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$ has determinant $5$, which is not a unit modulo $10$, so it is not invertible, even though its determinant is nonzero.",
        "在 $\\mathbb{Z}_{10}$ 上，$\\begin{pmatrix} 3 & 1 \\\\ 1 & 2 \\end{pmatrix}$ 的行列式为 $5$，它模 $10$ 不是单位，所以不可逆，尽管行列式非零。",
      ),
      generate(rng) {
        let n: number;
        do n = rng.int(6, 26);
        while (isPrime(n));
        let m: Mat2;
        do m = [rng.int(0, n - 1), rng.int(0, n - 1), rng.int(0, n - 1), rng.int(0, n - 1)];
        while (detMod(m, n) === 0);
        const d = detMod(m, n);
        const holds = gcd(d, n) === 1;
        return factProblem({
          prompt: t(`Is $${mat2Tex(m)}$ invertible over $${zTex(n)}$?`, `$${mat2Tex(m)}$ 在 $${zTex(n)}$ 上可逆吗？`),
          holds,
          reason: t(
            `Its determinant is $${d}$ modulo $${n}$, which ${holds ? "is" : "is not"} a unit since $\\gcd(${d}, ${n}) = ${gcd(d, n)}$.`,
            `它的行列式模 $${n}$ 为 $${d}$，由于 $\\gcd(${d}, ${n}) = ${gcd(d, n)}$，它${holds ? "是" : "不是"}单位。`,
          ),
        });
      },
    },
    {
      id: "inverting-matrices-over-zn",
      title: t("Inverting over $\\mathbb{Z}_n$", "在 $\\mathbb{Z}_n$ 上求逆"),
      explanation: t(
        "The usual formula for an inverse works over residues, with division by the determinant replaced by multiplication by its inverse. Over $\\mathbb{Z}_7$, $A = \\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$ has $\\det A = 5$ and $5^{-1} = 3$, so $A^{-1} = 3\\begin{pmatrix} 4 & -1 \\\\ -3 & 2 \\end{pmatrix} = \\begin{pmatrix} 5 & 4 \\\\ 5 & 6 \\end{pmatrix}$.",
        "求逆的常用公式在剩余类上同样适用，只是除以行列式要换成乘以它的逆元。在 $\\mathbb{Z}_7$ 上，$A = \\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$ 的 $\\det A = 5$，$5^{-1} = 3$，所以 $A^{-1} = 3\\begin{pmatrix} 4 & -1 \\\\ -3 & 2 \\end{pmatrix} = \\begin{pmatrix} 5 & 4 \\\\ 5 & 6 \\end{pmatrix}$。",
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
        return texChoice(
          rng,
          t(`Find the inverse of $${mat2Tex(m)}$ over $${zTex(n)}$.`, `求 $${mat2Tex(m)}$ 在 $${zTex(n)}$ 上的逆。`),
          mat2Tex(inv),
          [mat2Tex(adj), mat2Tex(scaled), mat2Tex([inv[3], inv[1], inv[2], inv[0]]), mat2Tex([inv[0], inv[2], inv[1], inv[3]])],
          t(
            `$\\det = ${d}$ and $${d}^{-1} = ${di}$ in $${zTex(n)}$, so the inverse is $${di}${mat2Tex(adj)} = ${mat2Tex(inv)}$.`,
            `$\\det = ${d}$，在 $${zTex(n)}$ 中 $${d}^{-1} = ${di}$，所以逆为 $${di}${mat2Tex(adj)} = ${mat2Tex(inv)}$。`,
          ),
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
  prerequisites: ["introduction-to-fields"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "equal-fractions-in-a-field-of-quotients",
      title: t("Equal fractions", "相等的分式"),
      explanation: t(
        "Two fractions are equal when cross multiplication gives the same product, exactly as for ordinary fractions of integers. In the field of quotients of $\\mathbb{Z}[\\sqrt 2]$, $\\frac{\\sqrt 2}{2} = \\frac{1}{\\sqrt 2}$, since $\\sqrt 2 \\cdot \\sqrt 2 = 2 \\cdot 1$.",
        "两个分式相等，当且仅当交叉相乘得到相同的乘积，这与普通整数分数完全一样。在 $\\mathbb{Z}[\\sqrt 2]$ 的分式域中，$\\frac{\\sqrt 2}{2} = \\frac{1}{\\sqrt 2}$，因为 $\\sqrt 2 \\cdot \\sqrt 2 = 2 \\cdot 1$。",
      ),
      generate(rng) {
        const k = nonSquare(rng);
        const a = rng.int(1, 6);
        const b = rng.nonZero(-4, 4);
        // a/b√k = c/d with c = a√k·m, d = bk·m, or a perturbed version.
        const m = rng.int(1, 3);
        const equal = rng.bool();
        const c = surdTex(0, a * m, k);
        const dVal = b * k * m + (equal ? 0 : rng.nonZero(-2, 2));
        const left = `\\frac{${a}}{${surdTex(0, b, k)}}`;
        const right = `\\frac{${c}}{${dVal}}`;
        const holds = dVal === b * k * m;
        return factProblem({
          prompt: t(
            `In the field of quotients of $\\mathbb{Z}[\\sqrt{${k}}]$, is $${left} = ${right}$?`,
            `在 $\\mathbb{Z}[\\sqrt{${k}}]$ 的分式域中，$${left} = ${right}$ 吗？`,
          ),
          holds,
          reason: t(
            `Cross-multiply: $${a} \\cdot ${dVal} = ${a * dVal}$ and $${surdTex(0, b, k)} \\cdot ${c} = ${a * m * b * k}$, which ${holds ? "agree" : "differ"}.`,
            `交叉相乘：$${a} \\cdot ${dVal} = ${a * dVal}$，$${surdTex(0, b, k)} \\cdot ${c} = ${a * m * b * k}$，两者${holds ? "相等" : "不等"}。`,
          ),
        });
      },
    },
    {
      id: "identifying-fields-of-quotients",
      title: t("Identifying fields of quotients", "识别分式域"),
      explanation: t(
        "The field of quotients is the smallest field containing the ring, obtained by allowing division by every nonzero element. The field of quotients of $\\mathbb{Z}[i]$ is $\\mathbb{Q}(i) = \\{a + bi : a, b \\in \\mathbb{Q}\\}$: every $\\frac{a + bi}{c + di}$ simplifies to this form by multiplying by $\\frac{c - di}{c - di}$.",
        "分式域是包含这个环的最小的域，通过允许除以每个非零元素而得到。$\\mathbb{Z}[i]$ 的分式域为 $\\mathbb{Q}(i) = \\{a + bi : a, b \\in \\mathbb{Q}\\}$：每个 $\\frac{a + bi}{c + di}$ 乘以 $\\frac{c - di}{c - di}$ 后都化为这种形式。",
      ),
      generate(rng) {
        const k = nonSquare(rng);
        const p = rng.pick([2, 3, 5, 7, 11, 13]);
        const cases: [string, string, string[]][] = [
          [`\\mathbb{Z}[\\sqrt{${k}}]`, `\\mathbb{Q}(\\sqrt{${k}})`, ["\\mathbb{Q}", "\\mathbb{R}", `\\mathbb{Z}[\\sqrt{${k}}]`]],
          [`\\mathbb{Q}(\\sqrt{${k}})`, `\\mathbb{Q}(\\sqrt{${k}})`, ["\\mathbb{Q}", "\\mathbb{R}", `\\mathbb{Q}(\\sqrt{${k + 1}})`]],
          [`${zTex(p)}[x]`, `${zTex(p)}(x)`, [zTex(p), "\\mathbb{Q}(x)", `${zTex(p)}[x]`]],
          [`${zTex(p)}`, zTex(p), ["\\mathbb{Q}", `${zTex(p)}(x)`, "\\mathbb{Z}"]],
          [`\\mathbb{Z}[${k}i]`, "\\mathbb{Q}(i)", ["\\mathbb{Q}", "\\mathbb{C}", `\\mathbb{Z}[${k}i]`]],
          [
            `${k}\\mathbb{Z} + \\mathbb{Z}\\sqrt{${k}}`,
            `\\mathbb{Q}(\\sqrt{${k}})`,
            ["\\mathbb{Q}", "\\mathbb{R}", `\\mathbb{Q}(\\sqrt{${k * k}})`],
          ],
        ];
        const [d, right, wrong] = rng.pick(cases.slice(0, 5));
        return texChoice(
          rng,
          t(`What is the field of quotients of the integral domain $${d}$?`, `整环 $${d}$ 的分式域是什么？`),
          right,
          [...wrong, "\\mathbb{C}"],
          t(
            `Every element of $${right}$ is a quotient of elements of $${d}$, and every such quotient lies in $${right}$.`,
            `$${right}$ 的每个元素都是 $${d}$ 中元素之商，而每个这样的商都在 $${right}$ 中。`,
          ),
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
  prerequisites: ["introduction-to-rings"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "applying-the-subring-test",
      title: t("The subring test", "子环判定法"),
      explanation: t(
        "$\\{a + bi : a, b \\in \\mathbb{Z}, b \\text{ even}\\}$ is a subring of $\\mathbb{C}$: differences keep $b$ even, and $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$ has $ad + bc$ even. The set of $x \\in \\mathbb{Z}$ with $x \\ge 0$ is not: $0 - 1 = -1$.",
        "$\\{a + bi : a, b \\in \\mathbb{Z}, b \\text{ 为偶数}\\}$ 是 $\\mathbb{C}$ 的子环：差仍使 $b$ 为偶数，而 $(a + bi)(c + di) = (ac - bd) + (ad + bc)i$ 中 $ad + bc$ 为偶数。$\\{x \\in \\mathbb{Z} : x \\ge 0\\}$ 不是：$0 - 1 = -1$。",
      ),
      generate(rng) {
        const n = rng.int(2, 12);
        const k = nonSquare(rng);
        const facts: Fact[] = [
          {
            prompt: t(
              `Is $\\{a + bi : a, b \\in \\mathbb{Z},\\ ${n} \\mid b\\}$ a subring of $\\mathbb{C}$?`,
              `$\\{a + bi : a, b \\in \\mathbb{Z},\\ ${n} \\mid b\\}$ 是 $\\mathbb{C}$ 的子环吗？`,
            ),
            holds: true,
            reason: t(
              `It is closed under subtraction, and $(a + bi)(c + di)$ has imaginary part $ad + bc$, a multiple of $${n}$.`,
              `它对减法封闭，且 $(a + bi)(c + di)$ 的虚部 $ad + bc$ 是 $${n}$ 的倍数。`,
            ),
          },
          {
            prompt: t(
              `Is $\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Z},\\ ${n} \\mid a\\}$ a subring of $\\mathbb{R}$?`,
              `$\\{a + b\\sqrt{${k}} : a, b \\in \\mathbb{Z},\\ ${n} \\mid a\\}$ 是 $\\mathbb{R}$ 的子环吗？`,
            ),
            holds: k % n === 0,
            reason:
              k % n === 0
                ? t(
                    `$(a + b\\sqrt{${k}})(c + d\\sqrt{${k}})$ has rational part $ac + ${k}bd$, a multiple of $${n}$ since $${n} \\mid ${k}$.`,
                    `乘积的有理部分 $ac + ${k}bd$ 是 $${n}$ 的倍数，因为 $${n} \\mid ${k}$。`,
                  )
                : t(
                    `$\\sqrt{${k}} \\cdot \\sqrt{${k}} = ${k}$, which is not a multiple of $${n}$.`,
                    `$\\sqrt{${k}} \\cdot \\sqrt{${k}} = ${k}$ 不是 $${n}$ 的倍数。`,
                  ),
          },
          {
            prompt: t(
              `Is $\\{x \\in \\mathbb{Z} : x \\ge -${n}\\}$ a subring of $\\mathbb{Z}$?`,
              `$\\{x \\in \\mathbb{Z} : x \\ge -${n}\\}$ 是 $\\mathbb{Z}$ 的子环吗？`,
            ),
            holds: false,
            reason: t(`$0 - ${n + 1} = -${n + 1}$ is not in the set.`, `$0 - ${n + 1} = -${n + 1}$ 不在该集合中。`),
          },
          {
            prompt: t(`Is $${n}\\mathbb{Z}$ a subring of $\\mathbb{Z}$?`, `$${n}\\mathbb{Z}$ 是 $\\mathbb{Z}$ 的子环吗？`),
            holds: true,
            reason: t("Differences and products of multiples of $n$ are multiples of $n$.", "$n$ 的倍数之差与积仍是 $n$ 的倍数。"),
          },
          {
            prompt: t(
              `Is $\\{x \\in \\mathbb{Z} : x \\equiv ${n % 2 === 0 ? 1 : 2} \\pmod{${n + 1}}\\} \\cup \\{0\\}$ a subring of $\\mathbb{Z}$?`,
              `$\\{x \\in \\mathbb{Z} : x \\equiv ${n % 2 === 0 ? 1 : 2} \\pmod{${n + 1}}\\} \\cup \\{0\\}$ 是 $\\mathbb{Z}$ 的子环吗？`,
            ),
            holds: false,
            reason: t(
              "It is not closed under subtraction: the difference of two of its nonzero elements is a nonzero multiple of the modulus.",
              "它对减法不封闭：两个非零元素之差是模的非零倍数。",
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "counting-subrings-of-zn",
      title: t("Subrings of $\\mathbb{Z}_n$", "$\\mathbb{Z}_n$ 的子环"),
      explanation: t(
        "Every additive subgroup $\\langle d \\rangle$ of $\\mathbb{Z}_n$ is closed under multiplication, so the subrings of $\\mathbb{Z}_{12}$ are the $6$ subgroups $\\langle 1 \\rangle, \\langle 2 \\rangle, \\langle 3 \\rangle, \\langle 4 \\rangle, \\langle 6 \\rangle, \\langle 0 \\rangle$.",
        "$\\mathbb{Z}_n$ 的每个加法子群 $\\langle d \\rangle$ 都对乘法封闭，所以 $\\mathbb{Z}_{12}$ 的子环就是 $6$ 个子群 $\\langle 1 \\rangle, \\langle 2 \\rangle, \\langle 3 \\rangle, \\langle 4 \\rangle, \\langle 6 \\rangle, \\langle 0 \\rangle$。",
      ),
      generate(rng) {
        const n = rng.int(6, 120);
        const value = divisors(n).length;
        return numberProblem({
          prompt: t(
            `How many subrings does $${zTex(n)}$ have (including $\\{0\\}$ and $${zTex(n)}$ itself)?`,
            `$${zTex(n)}$ 有多少个子环（包括 $\\{0\\}$ 与 $${zTex(n)}$ 本身）？`,
          ),
          answer: value,
          wrong: [value - 2, phi(n), primesOf(n).length, value + 1],
          solution: t(
            `The subrings are the subgroups $\\langle d \\rangle$, one for each of the $${value}$ divisors $d$ of $${n}$.`,
            `子环就是子群 $\\langle d \\rangle$，$${n}$ 的 $${value}$ 个因数 $d$ 各对应一个。`,
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
  prerequisites: ["subrings"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-ideals",
      title: t("Recognizing ideals", "识别理想"),
      explanation: t(
        "An ideal is a subring that absorbs multiplication, so multiplying any of its elements by any ring element stays inside it. $\\mathbb{Z}$ is a subring of $\\mathbb{Q}$ but not an ideal: $\\frac{1}{2} \\cdot 1 \\notin \\mathbb{Z}$. $\\{(a, 0) : a \\in \\mathbb{Z}\\}$ is an ideal of $\\mathbb{Z} \\times \\mathbb{Z}$: $(r, s)(a, 0) = (ra, 0)$.",
        "理想是吸收乘法的子环，所以把它的任一元素乘以环中任一元素，结果仍在其中。$\\mathbb{Z}$ 是 $\\mathbb{Q}$ 的子环但不是理想：$\\frac{1}{2} \\cdot 1 \\notin \\mathbb{Z}$。$\\{(a, 0) : a \\in \\mathbb{Z}\\}$ 是 $\\mathbb{Z} \\times \\mathbb{Z}$ 的理想：$(r, s)(a, 0) = (ra, 0)$。",
      ),
      generate(rng) {
        const n = rng.int(2, 15);
        const k = rng.int(2, 9);
        const facts: Fact[] = [
          {
            prompt: t(`Is $${n}\\mathbb{Z}$ an ideal of $\\mathbb{Z}$?`, `$${n}\\mathbb{Z}$ 是 $\\mathbb{Z}$ 的理想吗？`),
            holds: true,
            reason: t(`$r \\cdot ${n}m = ${n}(rm)$.`, `$r \\cdot ${n}m = ${n}(rm)$。`),
          },
          {
            prompt: t(`Is $${n}\\mathbb{Z}$ an ideal of $\\mathbb{Q}$?`, `$${n}\\mathbb{Z}$ 是 $\\mathbb{Q}$ 的理想吗？`),
            holds: false,
            reason: t(
              `$\\frac{1}{${n + 1}} \\cdot ${n} \\notin ${n}\\mathbb{Z}$.`,
              `$\\frac{1}{${n + 1}} \\cdot ${n} \\notin ${n}\\mathbb{Z}$。`,
            ),
          },
          {
            prompt: t(
              `Is $\\{(a, a) : a \\in \\mathbb{Z}\\}$ an ideal of $\\mathbb{Z} \\times \\mathbb{Z}$?`,
              `$\\{(a, a) : a \\in \\mathbb{Z}\\}$ 是 $\\mathbb{Z} \\times \\mathbb{Z}$ 的理想吗？`,
            ),
            holds: false,
            reason: t(
              `$(${k}, 1)(1, 1) = (${k}, 1)$ is not of the form $(a, a)$.`,
              `$(${k}, 1)(1, 1) = (${k}, 1)$ 不具有 $(a, a)$ 的形式。`,
            ),
          },
          {
            prompt: t(
              `Is $${n}\\mathbb{Z} \\times ${k}\\mathbb{Z}$ an ideal of $\\mathbb{Z} \\times \\mathbb{Z}$?`,
              `$${n}\\mathbb{Z} \\times ${k}\\mathbb{Z}$ 是 $\\mathbb{Z} \\times \\mathbb{Z}$ 的理想吗？`,
            ),
            holds: true,
            reason: t("Each coordinate absorbs multiplication.", "每个坐标都吸收乘法。"),
          },
          {
            prompt: t(
              `Is the set of polynomials in $\\mathbb{Z}[x]$ whose constant term is a multiple of $${n}$ an ideal of $\\mathbb{Z}[x]$?`,
              `$\\mathbb{Z}[x]$ 中常数项为 $${n}$ 的倍数的多项式之集是 $\\mathbb{Z}[x]$ 的理想吗？`,
            ),
            holds: true,
            reason: t(`The constant term of $gf$ is $g(0)f(0)$, a multiple of $${n}$.`, `$gf$ 的常数项为 $g(0)f(0)$，是 $${n}$ 的倍数。`),
          },
          {
            prompt: t(
              `Is the set of polynomials in $\\mathbb{Z}[x]$ of degree at most $${k}$ (with $0$) an ideal of $\\mathbb{Z}[x]$?`,
              `$\\mathbb{Z}[x]$ 中次数不超过 $${k}$ 的多项式（含 $0$）之集是 $\\mathbb{Z}[x]$ 的理想吗？`,
            ),
            holds: false,
            reason: t(
              `$x \\cdot x^{${k}} = x^{${k + 1}}$ has degree $${k + 1}$.`,
              `$x \\cdot x^{${k}} = x^{${k + 1}}$ 的次数为 $${k + 1}$。`,
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "sums-intersections-and-products-of-ideals-of-z",
      title: t("Combining ideals of ℤ", "组合 ℤ 的理想"),
      explanation: t(
        "Every ideal of the integers is the multiples of one number, and sums, intersections and products correspond to the gcd, the lcm and the product. $12\\mathbb{Z} + 18\\mathbb{Z} = 6\\mathbb{Z}$, $12\\mathbb{Z} \\cap 18\\mathbb{Z} = 36\\mathbb{Z}$, and $(12\\mathbb{Z})(18\\mathbb{Z}) = 216\\mathbb{Z}$.",
        "整数环的每个理想都是某个数的倍数，理想的和、交、积分别对应最大公因数、最小公倍数和乘积。$12\\mathbb{Z} + 18\\mathbb{Z} = 6\\mathbb{Z}$，$12\\mathbb{Z} \\cap 18\\mathbb{Z} = 36\\mathbb{Z}$，$(12\\mathbb{Z})(18\\mathbb{Z}) = 216\\mathbb{Z}$。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.int(4, 40);
          b = rng.int(4, 40);
        } while (a === b || gcd(a, b) === 1);
        const kind = rng.int(0, 2);
        const [op, value] = [
          ["+", gcd(a, b)],
          ["\\cap", lcm(a, b)],
          ["", a * b],
        ][kind] as [string, number];
        const left = kind === 2 ? `(${a}\\mathbb{Z})(${b}\\mathbb{Z})` : `${a}\\mathbb{Z} ${op} ${b}\\mathbb{Z}`;
        return numberProblem({
          prompt: t(`Find the positive integer $n$ with $${left} = n\\mathbb{Z}$.`, `求正整数 $n$，使 $${left} = n\\mathbb{Z}$。`),
          answer: value,
          wrong: [gcd(a, b), lcm(a, b), a * b, a + b].filter((x) => x !== value),
          solution: t(
            `${["The sum is generated by the gcd", "The intersection is generated by the lcm", "The product is generated by the product"][kind]}: $n = ${value}$.`,
            `${["和由最大公因数生成", "交由最小公倍数生成", "积由乘积生成"][kind]}：$n = ${value}$。`,
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
  prerequisites: ["ideals"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "equal-principal-ideals-of-zn",
      title: t("Equal principal ideals", "相等的主理想"),
      explanation: t(
        "Two elements generate the same ideal exactly when they have the same gcd with the modulus. In $\\mathbb{Z}_{20}$, $\\langle 6 \\rangle = \\langle 2 \\rangle = \\langle 14 \\rangle$ since $\\gcd(6, 20) = \\gcd(14, 20) = 2$, but $\\langle 4 \\rangle \\ne \\langle 6 \\rangle$.",
        "两个元素生成同一个理想，当且仅当它们与模的最大公因数相同。在 $\\mathbb{Z}_{20}$ 中，$\\langle 6 \\rangle = \\langle 2 \\rangle = \\langle 14 \\rangle$，因为 $\\gcd(6, 20) = \\gcd(14, 20) = 2$；但 $\\langle 4 \\rangle \\ne \\langle 6 \\rangle$。",
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
        const holds = gcd(a, n) === gcd(b, n);
        return factProblem({
          prompt: t(
            `In $${zTex(n)}$, is $\\langle ${a} \\rangle = \\langle ${b} \\rangle$?`,
            `在 $${zTex(n)}$ 中，$\\langle ${a} \\rangle = \\langle ${b} \\rangle$ 吗？`,
          ),
          holds,
          reason: t(
            `$\\gcd(${a}, ${n}) = ${gcd(a, n)}$ and $\\gcd(${b}, ${n}) = ${gcd(b, n)}$.`,
            `$\\gcd(${a}, ${n}) = ${gcd(a, n)}$，$\\gcd(${b}, ${n}) = ${gcd(b, n)}$。`,
          ),
        });
      },
    },
    {
      id: "generators-of-ideals-of-zn",
      title: t("Generators of ⟨a, b⟩", "⟨a, b⟩ 的生成元"),
      explanation: t(
        "An ideal generated by several elements of this ring is principal, generated by the gcd of those elements and the modulus. In $\\mathbb{Z}_{36}$, $\\langle 8, 30 \\rangle = \\langle \\gcd(8, 30, 36) \\rangle = \\langle 2 \\rangle$.",
        "这个环中由若干元素生成的理想是主理想，由这些元素与模的最大公因数生成。在 $\\mathbb{Z}_{36}$ 中，$\\langle 8, 30 \\rangle = \\langle \\gcd(8, 30, 36) \\rangle = \\langle 2 \\rangle$。",
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
        return numberProblem({
          prompt: t(
            `In $${zTex(n)}$, the ideal $\\langle ${a}, ${b} \\rangle$ equals $\\langle d \\rangle$ for exactly one positive divisor $d$ of $${n}$. Find $d$.`,
            `在 $${zTex(n)}$ 中，理想 $\\langle ${a}, ${b} \\rangle$ 恰等于某个 $${n}$ 的正因数 $d$ 生成的 $\\langle d \\rangle$。求 $d$。`,
          ),
          answer: value,
          wrong: [gcd(a, n), gcd(b, n), gcd(a, b), lcm(gcd(a, n), gcd(b, n))].filter((x) => x !== value),
          solution: t(
            `$\\langle ${a}, ${b} \\rangle = \\langle \\gcd(${a}, ${b}, ${n}) \\rangle = \\langle ${value} \\rangle$.`,
            `$\\langle ${a}, ${b} \\rangle = \\langle \\gcd(${a}, ${b}, ${n}) \\rangle = \\langle ${value} \\rangle$。`,
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
  prerequisites: ["generating-elements-of-principal-ideal-rings", "quotient-groups"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sizes-of-quotients-of-gaussian-integers",
      title: t("Quotients of ℤ[i]", "ℤ[i] 的商环"),
      explanation: t(
        "The quotient of the Gaussian integers by a principal ideal has as many elements as the norm of its generator. $\\mathbb{Z}[i]/\\langle 2 + i \\rangle$ has $2^2 + 1^2 = 5$ elements; in fact it is isomorphic to $\\mathbb{Z}_5$, since $i \\equiv -2$.",
        "高斯整数环模一个主理想所得商环的元素个数，等于生成元的范数。$\\mathbb{Z}[i]/\\langle 2 + i \\rangle$ 有 $2^2 + 1^2 = 5$ 个元素；事实上它同构于 $\\mathbb{Z}_5$，因为 $i \\equiv -2$。",
      ),
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.nonZero(-7, 7);
        const value = a * a + b * b;
        return numberProblem({
          prompt: t(
            `How many elements does $\\mathbb{Z}[i]/\\langle ${gaussianTex(a, b)} \\rangle$ have?`,
            `$\\mathbb{Z}[i]/\\langle ${gaussianTex(a, b)} \\rangle$ 有多少个元素？`,
          ),
          answer: value,
          wrong: [Math.abs(a * a - b * b) || 1, a + Math.abs(b), Math.abs(a * b), (a + Math.abs(b)) ** 2],
          solution: t(
            `The quotient has $|${gaussianTex(a, b)}|^2 = ${a}^2 + ${Math.abs(b)}^2 = ${value}$ elements.`,
            `商环有 $|${gaussianTex(a, b)}|^2 = ${a}^2 + ${Math.abs(b)}^2 = ${value}$ 个元素。`,
          ),
        });
      },
    },
    {
      id: "multiplying-in-quotients-of-zn",
      title: t("Multiplying cosets", "陪集相乘"),
      explanation: t(
        "Multiply the representatives of the cosets and then reduce the result to the coset it belongs to. In $\\mathbb{Z}_{24}/\\langle 6 \\rangle$, $(5 + \\langle 6 \\rangle)(4 + \\langle 6 \\rangle) = 20 + \\langle 6 \\rangle = 2 + \\langle 6 \\rangle$.",
        "把陪集的代表元相乘，再把结果约化到它所属的陪集。在 $\\mathbb{Z}_{24}/\\langle 6 \\rangle$ 中，$(5 + \\langle 6 \\rangle)(4 + \\langle 6 \\rangle) = 20 + \\langle 6 \\rangle = 2 + \\langle 6 \\rangle$。",
      ),
      generate(rng) {
        const n = rng.pick([24, 30, 36, 40, 48, 60, 72]);
        const d = rng.pick(divisors(n).filter((x) => x >= 4 && x < n));
        const a = rng.int(2, n - 1);
        const b = rng.int(2, n - 1);
        const value = mod(a * b, d);
        return numberProblem({
          prompt: t(
            `In $${zTex(n)}/\\langle ${d} \\rangle$, write $(${a} + \\langle ${d} \\rangle)(${b} + \\langle ${d} \\rangle)$ as $r + \\langle ${d} \\rangle$ with $0 \\le r < ${d}$. Find $r$.`,
            `在 $${zTex(n)}/\\langle ${d} \\rangle$ 中，把 $(${a} + \\langle ${d} \\rangle)(${b} + \\langle ${d} \\rangle)$ 写成 $r + \\langle ${d} \\rangle$，$0 \\le r < ${d}$。求 $r$。`,
          ),
          answer: value,
          wrong: [mod(a + b, d), mod(a * b, n) === value ? mod(value + 1, d) : mod(a * b, n), mod(a, d) * mod(b, d)].filter(
            (x) => x !== value,
          ),
          solution: t(
            `$${a} \\cdot ${b} = ${a * b} \\equiv ${value} \\pmod{${d}}$, so $r = ${value}$.`,
            `$${a} \\cdot ${b} = ${a * b} \\equiv ${value} \\pmod{${d}}$，所以 $r = ${value}$。`,
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
  prerequisites: ["quotient-rings", "dividing-polynomials-using-long-division"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sizes-of-polynomial-quotient-rings",
      title: t("Sizes of ℤₚ[x]/⟨f⟩", "ℤₚ[x]/⟨f⟩ 的大小"),
      explanation: t(
        "Every class has a unique remainder of degree less than the modulus polynomial, so count those remainders by their coefficients. $\\mathbb{Z}_3[x]/\\langle x^2 + 1 \\rangle$ consists of the $a + bx$ with $a, b \\in \\mathbb{Z}_3$: $3^2 = 9$ elements.",
        "每个类都有唯一一个次数小于模多项式的余式，所以按系数来数这些余式。$\\mathbb{Z}_3[x]/\\langle x^2 + 1 \\rangle$ 由 $a + bx$（$a, b \\in \\mathbb{Z}_3$）组成：共 $3^2 = 9$ 个元素。",
      ),
      generate(rng) {
        const p = rng.pick([2, 3, 5, 7]);
        const deg = rng.int(2, p === 2 ? 6 : p === 3 ? 4 : 3);
        const cs = [rng.int(1, p - 1), ...range(1, deg - 1).map(() => rng.int(0, p - 1)), 1];
        const value = p ** deg;
        return numberProblem({
          prompt: t(
            `How many elements does $${zTex(p)}[x]/\\langle ${polyTex(cs)} \\rangle$ have?`,
            `$${zTex(p)}[x]/\\langle ${polyTex(cs)} \\rangle$ 有多少个元素？`,
          ),
          answer: value,
          wrong: [deg ** p, p * deg, p ** (deg - 1), p ** (deg + 1)].filter((x) => x !== value),
          solution: t(
            `Each coset has a unique representative of degree less than $${deg}$, with $${deg}$ coefficients in $${zTex(p)}$: $${p}^{${deg}} = ${value}$.`,
            `每个陪集有唯一的次数小于 $${deg}$ 的代表元，它有 $${deg}$ 个取自 $${zTex(p)}$ 的系数：$${p}^{${deg}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "multiplying-in-polynomial-quotient-rings",
      title: t("Multiplying in $F[x]/\\langle x^2 - c \\rangle$", "在 $F[x]/\\langle x^2 - c \\rangle$ 中相乘"),
      explanation: t(
        "Multiply the polynomials as usual, then use the relation given by the modulus to replace the square of the variable by a constant. In $\\mathbb{Z}_7[x]/\\langle x^2 - 3 \\rangle$, $x^2 = 3$, so $(2 + x)(4 + 5x) = 8 + 14x + 5x^2 = 8 + 14x + 15 = 23 + 14x = 2 + 0x$.",
        "照常把多项式相乘，再用模所给出的关系把变量的平方换成常数。在 $\\mathbb{Z}_7[x]/\\langle x^2 - 3 \\rangle$ 中，$x^2 = 3$，所以 $(2 + x)(4 + 5x) = 8 + 14x + 5x^2 = 8 + 14x + 15 = 23 + 14x = 2 + 0x$。",
      ),
      generate(rng) {
        const p = rng.pick([5, 7, 11, 13]);
        const c = rng.int(2, p - 1);
        const [a, b, d, e] = [rng.int(0, p - 1), rng.int(1, p - 1), rng.int(0, p - 1), rng.int(1, p - 1)];
        const r0 = mod(a * d + c * b * e, p);
        const r1 = mod(a * e + b * d, p);
        const askConst = rng.bool();
        return numberProblem({
          prompt: t(
            `In $${zTex(p)}[x]/\\langle x^2 - ${c} \\rangle$, write $(${polyTex([a, b])})(${polyTex([d, e])})$ as $r + sx$ with $r, s \\in ${zTex(p)}$. Find $${askConst ? "r" : "s"}$.`,
            `在 $${zTex(p)}[x]/\\langle x^2 - ${c} \\rangle$ 中，把 $(${polyTex([a, b])})(${polyTex([d, e])})$ 写成 $r + sx$，$r, s \\in ${zTex(p)}$。求 $${askConst ? "r" : "s"}$。`,
          ),
          answer: askConst ? r0 : r1,
          wrong: askConst ? [mod(a * d, p), mod(a * d - c * b * e, p), r1] : [mod(a * e, p), mod(b * e, p), r0],
          solution: t(
            `Replace $x^2$ by $${c}$: $(${polyTex([a, b])})(${polyTex([d, e])}) = ${poly([a * d, ""], [a * e + b * d, "x"], [b * e, "x^2"])} = ${poly([a * d + c * b * e, ""], [a * e + b * d, "x"])} \\equiv ${poly([r0, ""], [r1, "x"])}$.`,
            `把 $x^2$ 换成 $${c}$：$(${polyTex([a, b])})(${polyTex([d, e])}) = ${poly([a * d, ""], [a * e + b * d, "x"], [b * e, "x^2"])} = ${poly([a * d + c * b * e, ""], [a * e + b * d, "x"])} \\equiv ${poly([r0, ""], [r1, "x"])}$。`,
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
  prerequisites: ["ideals", "group-homomorphisms"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-ring-homomorphisms",
      title: t("Recognizing ring homomorphisms", "识别环同态"),
      explanation: t(
        "A ring homomorphism must respect both addition and multiplication, so check the product of two elements as well as the sum. $\\varphi(a + b\\sqrt 3) = a - b\\sqrt 3$ is a ring homomorphism of $\\mathbb{Z}[\\sqrt 3]$. $\\varphi(x) = 3x$ on $\\mathbb{Z}$ is not: $\\varphi(1 \\cdot 1) = 3$ but $\\varphi(1)\\varphi(1) = 9$.",
        "环同态必须同时保持加法和乘法，所以除了检查和，还要检查两个元素的乘积。$\\varphi(a + b\\sqrt 3) = a - b\\sqrt 3$ 是 $\\mathbb{Z}[\\sqrt 3]$ 的环同态。$\\mathbb{Z}$ 上的 $\\varphi(x) = 3x$ 不是：$\\varphi(1 \\cdot 1) = 3$，而 $\\varphi(1)\\varphi(1) = 9$。",
      ),
      generate(rng) {
        const n = rng.int(2, 12);
        const k = nonSquare(rng);
        const facts: Fact[] = [
          {
            prompt: t(
              `Is $\\varphi(x) = ${n}x$ a ring homomorphism $\\mathbb{Z} \\to \\mathbb{Z}$?`,
              `$\\varphi(x) = ${n}x$ 是环同态 $\\mathbb{Z} \\to \\mathbb{Z}$ 吗？`,
            ),
            holds: false,
            reason: t(
              `$\\varphi(1 \\cdot 1) = ${n}$ but $\\varphi(1)\\varphi(1) = ${n * n}$.`,
              `$\\varphi(1 \\cdot 1) = ${n}$，而 $\\varphi(1)\\varphi(1) = ${n * n}$。`,
            ),
          },
          {
            prompt: t(
              `Is $\\varphi(a + b\\sqrt{${k}}) = a - b\\sqrt{${k}}$ a ring homomorphism of $\\mathbb{Z}[\\sqrt{${k}}]$?`,
              `$\\varphi(a + b\\sqrt{${k}}) = a - b\\sqrt{${k}}$ 是 $\\mathbb{Z}[\\sqrt{${k}}]$ 的环同态吗？`,
            ),
            holds: true,
            reason: t(
              `It preserves sums, and both $\\varphi((a + b\\sqrt{${k}})(c + d\\sqrt{${k}}))$ and $\\varphi(a + b\\sqrt{${k}})\\varphi(c + d\\sqrt{${k}})$ equal $(ac + ${k}bd) - (ad + bc)\\sqrt{${k}}$.`,
              `它保持加法，且 $\\varphi((a + b\\sqrt{${k}})(c + d\\sqrt{${k}}))$ 与 $\\varphi(a + b\\sqrt{${k}})\\varphi(c + d\\sqrt{${k}})$ 都等于 $(ac + ${k}bd) - (ad + bc)\\sqrt{${k}}$。`,
            ),
          },
          {
            prompt: t(
              `Is $\\varphi(f) = f(${n})$ a ring homomorphism $\\mathbb{Z}[x] \\to \\mathbb{Z}$?`,
              `$\\varphi(f) = f(${n})$ 是环同态 $\\mathbb{Z}[x] \\to \\mathbb{Z}$ 吗？`,
            ),
            holds: true,
            reason: t(
              `$(f + g)(${n}) = f(${n}) + g(${n})$ and $(fg)(${n}) = f(${n})g(${n})$.`,
              `$(f + g)(${n}) = f(${n}) + g(${n})$，$(fg)(${n}) = f(${n})g(${n})$。`,
            ),
          },
          {
            prompt: t(
              `Is $\\varphi(x) = x \\bmod ${n}$ a ring homomorphism $\\mathbb{Z} \\to ${zTex(n)}$?`,
              `$\\varphi(x) = x \\bmod ${n}$ 是环同态 $\\mathbb{Z} \\to ${zTex(n)}$ 吗？`,
            ),
            holds: true,
            reason: t("Reduction modulo $n$ respects sums and products.", "模 $n$ 约化保持和与积。"),
          },
          {
            prompt: t(
              `Is $\\varphi(A) = \\det A$ a ring homomorphism from the $2 \\times 2$ real matrices to $\\mathbb{R}$?`,
              `$\\varphi(A) = \\det A$ 是从 $2 \\times 2$ 实矩阵到 $\\mathbb{R}$ 的环同态吗？`,
            ),
            holds: false,
            reason: t(
              `It is not additive: $\\det(I + I) = 4$ but $\\det I + \\det I = 2$.`,
              `它不保持加法：$\\det(I + I) = 4$，而 $\\det I + \\det I = 2$。`,
            ),
          },
          {
            prompt: t(
              `Is $\\varphi(f) = f'$, the derivative, a ring homomorphism $\\mathbb{R}[x] \\to \\mathbb{R}[x]$?`,
              `求导 $\\varphi(f) = f'$ 是环同态 $\\mathbb{R}[x] \\to \\mathbb{R}[x]$ 吗？`,
            ),
            holds: false,
            reason: t(
              `$(x \\cdot x^{${n}})' = ${n + 1}x^{${n}}$, but $x' \\cdot (x^{${n}})' = ${n}x^{${n - 1}}$.`,
              `$(x \\cdot x^{${n}})' = ${n + 1}x^{${n}}$，而 $x' \\cdot (x^{${n}})' = ${n}x^{${n - 1}}$。`,
            ),
          },
        ];
        return factProblem(rng.pick(facts));
      },
    },
    {
      id: "evaluation-homomorphisms-into-zn",
      title: t("Evaluation homomorphisms", "求值同态"),
      explanation: t(
        "Substituting a value for the variable and reducing respects both operations, so it is a ring homomorphism, computed by evaluating the polynomial. $\\varphi: \\mathbb{Z}[x] \\to \\mathbb{Z}_7$, $\\varphi(f) = f(3) \\bmod 7$, is a ring homomorphism. For $f = x^3 + 2x + 5$, $\\varphi(f) = 27 + 6 + 5 = 38 \\equiv 3$.",
        "把变量换成一个值再约化，同时保持两种运算，所以它是环同态，计算方法就是求多项式的值。$\\varphi: \\mathbb{Z}[x] \\to \\mathbb{Z}_7$，$\\varphi(f) = f(3) \\bmod 7$ 是环同态。对 $f = x^3 + 2x + 5$，$\\varphi(f) = 27 + 6 + 5 = 38 \\equiv 3$。",
      ),
      generate(rng) {
        const n = rng.pick([5, 6, 7, 8, 9, 10, 11, 12, 13]);
        const c = rng.int(2, n - 1);
        const deg = rng.int(2, 4);
        const cs = [...range(0, deg - 1).map(() => rng.int(-6, 6)), 1];
        const raw = cs.reduce((s, a, i) => s + a * c ** i, 0);
        const value = mod(raw, n);
        return numberProblem({
          prompt: t(
            `Let $\\varphi: \\mathbb{Z}[x] \\to ${zTex(n)}$ be the ring homomorphism $\\varphi(f) = f(${c}) \\bmod ${n}$. Find $\\varphi(${polyTex(cs)})$.`,
            `设 $\\varphi: \\mathbb{Z}[x] \\to ${zTex(n)}$ 是环同态 $\\varphi(f) = f(${c}) \\bmod ${n}$。求 $\\varphi(${polyTex(cs)})$。`,
          ),
          answer: value,
          wrong: [
            mod(
              cs.reduce((s, a) => s + a, 0),
              n,
            ),
            mod(cs[0]!, n),
            mod(raw + 1, n),
            mod(-raw, n),
          ].filter((x) => x !== value),
          solution: t(`$f(${c}) = ${raw} \\equiv ${value} \\pmod{${n}}$.`, `$f(${c}) = ${raw} \\equiv ${value} \\pmod{${n}}$。`),
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
  prerequisites: ["ring-homomorphisms"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-homomorphisms-between-residue-rings",
      title: t("Is x ↦ kx a ring homomorphism?", "x ↦ kx 是环同态吗？"),
      explanation: t(
        "Such a map is a well defined ring homomorphism when it respects the modulus and the multiplier is idempotent in the target ring. $x \\mapsto 4x$ from $\\mathbb{Z}_6$ to $\\mathbb{Z}_{12}$ is a ring homomorphism: $6 \\cdot 4 = 24 \\equiv 0$ and $4^2 = 16 \\equiv 4 \\pmod{12}$. $x \\mapsto 3x$ is not: $9 \\not\\equiv 3$.",
        "当这样的映射与模相容，并且乘数在目标环中是幂等元时，它就是良定义的环同态。从 $\\mathbb{Z}_6$ 到 $\\mathbb{Z}_{12}$ 的 $x \\mapsto 4x$ 是环同态：$6 \\cdot 4 = 24 \\equiv 0$，$4^2 = 16 \\equiv 4 \\pmod{12}$。$x \\mapsto 3x$ 不是：$9 \\not\\equiv 3$。",
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
        return factProblem({
          prompt: t(
            `Is $x \\mapsto ${k}x$ a ring homomorphism from $${zTex(m)}$ to $${zTex(n)}$?`,
            `$x \\mapsto ${k}x$ 是从 $${zTex(m)}$ 到 $${zTex(n)}$ 的环同态吗？`,
          ),
          holds,
          reason: !add
            ? t(
                `$${m} \\cdot ${k} = ${m * k} \\not\\equiv 0 \\pmod{${n}}$, so the map is not well defined.`,
                `$${m} \\cdot ${k} = ${m * k} \\not\\equiv 0 \\pmod{${n}}$，所以映射不是良定义的。`,
              )
            : t(
                `$${m} \\cdot ${k} \\equiv 0$, and $${k}^2 = ${k * k} ${mult ? "\\equiv" : "\\not\\equiv"} ${k} \\pmod{${n}}$.`,
                `$${m} \\cdot ${k} \\equiv 0$，且 $${k}^2 = ${k * k} ${mult ? "\\equiv" : "\\not\\equiv"} ${k} \\pmod{${n}}$。`,
              ),
        });
      },
    },
    {
      id: "counting-homomorphisms-between-residue-rings",
      title: t("Counting ring homomorphisms", "数环同态"),
      explanation: t(
        "The ring homomorphisms $\\mathbb{Z}_{20} \\to \\mathbb{Z}_{30}$ come from the idempotents $0, 1, 6, 10, 15, 16, 21, 25$ of $\\mathbb{Z}_{30}$ with $20k \\equiv 0$: $k = 0, 15$, so there are $2$ (counting the zero map).",
        "环同态 $\\mathbb{Z}_{20} \\to \\mathbb{Z}_{30}$ 来自 $\\mathbb{Z}_{30}$ 的幂等元 $0, 1, 6, 10, 15, 16, 21, 25$ 中满足 $20k \\equiv 0$ 的：$k = 0, 15$，共 $2$ 个（含零映射）。",
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
        return numberProblem({
          prompt: t(
            `How many ring homomorphisms $${zTex(m)} \\to ${zTex(n)}$ are there, including the zero map?`,
            `$${zTex(m)} \\to ${zTex(n)}$ 的环同态（含零映射）有多少个？`,
          ),
          answer: ks.length,
          wrong: [gcd(m, n), idem.length, ks.length + 1].filter((x) => x !== ks.length),
          solution: t(
            `$k = \\varphi(1)$ must satisfy $k^2 \\equiv k$ and $${m}k \\equiv 0 \\pmod{${n}}$: $k = ${ks.join(", ")}$. So there are $${ks.length}$.`,
            `$k = \\varphi(1)$ 须满足 $k^2 \\equiv k$ 与 $${m}k \\equiv 0 \\pmod{${n}}$：$k = ${ks.join(", ")}$。所以共 $${ks.length}$ 个。`,
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
  prerequisites: ["ring-homomorphisms-between-residue-rings", "the-first-isomorphism-theorem"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "kernels-of-homomorphisms-from-z",
      title: t("Kernels from ℤ", "从 ℤ 出发的核"),
      explanation: t(
        "The kernel of $\\mathbb{Z} \\to \\mathbb{Z}_4 \\times \\mathbb{Z}_6$, $x \\mapsto (x \\bmod 4, x \\bmod 6)$, consists of the common multiples of $4$ and $6$: $12\\mathbb{Z}$. So the image is isomorphic to $\\mathbb{Z}_{12}$.",
        "$\\mathbb{Z} \\to \\mathbb{Z}_4 \\times \\mathbb{Z}_6$，$x \\mapsto (x \\bmod 4, x \\bmod 6)$ 的核由 $4$ 与 $6$ 的公倍数组成：$12\\mathbb{Z}$。所以像同构于 $\\mathbb{Z}_{12}$。",
      ),
      generate(rng) {
        const m = rng.int(2, 24);
        let n: number;
        do n = rng.int(2, 24);
        while (n === m);
        const value = lcm(m, n);
        return numberProblem({
          prompt: t(
            `Let $\\varphi: \\mathbb{Z} \\to ${zTex(m)} \\times ${zTex(n)}$, $\\varphi(x) = (x \\bmod ${m}, x \\bmod ${n})$. Its kernel is $d\\mathbb{Z}$ for a positive integer $d$. Find $d$.`,
            `设 $\\varphi: \\mathbb{Z} \\to ${zTex(m)} \\times ${zTex(n)}$，$\\varphi(x) = (x \\bmod ${m}, x \\bmod ${n})$。它的核为 $d\\mathbb{Z}$，$d$ 为正整数。求 $d$。`,
          ),
          answer: value,
          wrong: [m * n, gcd(m, n), m + n].filter((x) => x !== value),
          solution: t(
            `$\\varphi(x) = 0$ exactly when $${m} \\mid x$ and $${n} \\mid x$, that is, $\\operatorname{lcm}(${m}, ${n}) = ${value}$ divides $x$.`,
            `$\\varphi(x) = 0$ 当且仅当 $${m} \\mid x$ 且 $${n} \\mid x$，即 $\\operatorname{lcm}(${m}, ${n}) = ${value}$ 整除 $x$。`,
          ),
        });
      },
    },
    {
      id: "images-of-homomorphisms-between-residue-rings",
      title: t("Images of residue ring homomorphisms", "剩余类环同态的像"),
      explanation: t(
        "The image consists of the multiples of the multiplier in the target, so list those multiples. $x \\mapsto 4x$ is a ring homomorphism $\\mathbb{Z}_6 \\to \\mathbb{Z}_{12}$ with image $\\{0, 4, 8\\}$, so its kernel has $\\frac{6}{3} = 2$ elements: $\\{0, 3\\}$.",
        "像由目标环中乘数的倍数组成，所以把这些倍数列出来。$x \\mapsto 4x$ 是环同态 $\\mathbb{Z}_6 \\to \\mathbb{Z}_{12}$，像为 $\\{0, 4, 8\\}$，所以核有 $\\frac{6}{3} = 2$ 个元素：$\\{0, 3\\}$。",
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
        const im = n / gcd(k, n);
        const askKernel = rng.bool();
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
          answer: askKernel ? m / im : im,
          wrong: askKernel ? [im, gcd(k, n), gcd(m, k)] : [m / im, gcd(k, n), n],
          solution: t(
            `The image is $\\langle ${k} \\rangle$ in $${zTex(n)}$, with $\\frac{${n}}{\\gcd(${k}, ${n})} = ${im}$ elements${askKernel ? `, so the kernel has $\\frac{${m}}{${im}} = ${m / im}$` : ""}.`,
            `像为 $${zTex(n)}$ 中的 $\\langle ${k} \\rangle$，有 $\\frac{${n}}{\\gcd(${k}, ${n})} = ${im}$ 个元素${askKernel ? `，所以核有 $\\frac{${m}}{${im}} = ${m / im}$ 个` : ""}。`,
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
  prerequisites: ["quotient-rings", "introduction-to-fields"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-prime-and-maximal-ideals",
      title: t("Prime or maximal?", "素理想还是极大理想？"),
      explanation: t(
        "An ideal is maximal when the quotient is a field and prime when the quotient is an integral domain, so identify the quotient ring. $\\langle 5 \\rangle$ is maximal in $\\mathbb{Z}_{30}$, since $\\mathbb{Z}_{30}/\\langle 5 \\rangle \\cong \\mathbb{Z}_5$ is a field. $\\langle 6 \\rangle$ is not even prime: $2 \\cdot 3 \\in \\langle 6 \\rangle$ but $2, 3 \\notin \\langle 6 \\rangle$.",
        "当商环是域时理想是极大的，当商环是整环时理想是素的，所以要确定商环。$\\langle 5 \\rangle$ 是 $\\mathbb{Z}_{30}$ 的极大理想，因为 $\\mathbb{Z}_{30}/\\langle 5 \\rangle \\cong \\mathbb{Z}_5$ 是域。$\\langle 6 \\rangle$ 甚至不是素理想：$2 \\cdot 3 \\in \\langle 6 \\rangle$，但 $2, 3 \\notin \\langle 6 \\rangle$。",
      ),
      generate(rng) {
        const n = rng.pick([12, 18, 20, 24, 30, 36, 40, 42, 60, 70, 84, 90, 105]);
        const d = rng.pick(divisors(n).filter((x) => x > 1 && x < n));
        const kind = rng.pick(["prime", "maximal"]);
        const holds = isPrime(d);
        const p = primesOf(d)[0]!;
        return factProblem({
          prompt: t(
            `Is $\\langle ${d} \\rangle$ a ${kind} ideal of $${zTex(n)}$?`,
            `$\\langle ${d} \\rangle$ 是 $${zTex(n)}$ 的${kind === "prime" ? "素" : "极大"}理想吗？`,
          ),
          holds,
          reason: holds
            ? t(
                `$${zTex(n)}/\\langle ${d} \\rangle \\cong ${zTex(d)}$ is a field.`,
                `$${zTex(n)}/\\langle ${d} \\rangle \\cong ${zTex(d)}$ 是域。`,
              )
            : t(
                `$${zTex(n)}/\\langle ${d} \\rangle \\cong ${zTex(d)}$ is not an integral domain: $${p} \\cdot ${d / p} = 0$ there.`,
                `$${zTex(n)}/\\langle ${d} \\rangle \\cong ${zTex(d)}$ 不是整环：其中 $${p} \\cdot ${d / p} = 0$。`,
              ),
        });
      },
    },
    {
      id: "counting-maximal-ideals",
      title: t("Counting maximal ideals", "数极大理想"),
      explanation: t(
        "The maximal ideals of a product replace one factor by one of its maximal ideals and keep the other factor whole. The maximal ideals of $\\mathbb{Z}_{12} \\times \\mathbb{Z}_{15}$ are $M \\times \\mathbb{Z}_{15}$ and $\\mathbb{Z}_{12} \\times M$ for maximal $M$: $\\langle 2 \\rangle, \\langle 3 \\rangle$ in $\\mathbb{Z}_{12}$ and $\\langle 3 \\rangle, \\langle 5 \\rangle$ in $\\mathbb{Z}_{15}$, so $4$ in all.",
        "直积的极大理想是把一个因子换成它的某个极大理想，而保持另一个因子不变。$\\mathbb{Z}_{12} \\times \\mathbb{Z}_{15}$ 的极大理想为 $M \\times \\mathbb{Z}_{15}$ 与 $\\mathbb{Z}_{12} \\times M$，$M$ 取极大理想：$\\mathbb{Z}_{12}$ 中的 $\\langle 2 \\rangle, \\langle 3 \\rangle$ 与 $\\mathbb{Z}_{15}$ 中的 $\\langle 3 \\rangle, \\langle 5 \\rangle$，共 $4$ 个。",
      ),
      generate(rng) {
        const m = rng.int(4, 60);
        const n = rng.int(4, 60);
        const value = primesOf(m).length + primesOf(n).length;
        return numberProblem({
          prompt: t(
            `How many maximal ideals does $${zTex(m)} \\times ${zTex(n)}$ have?`,
            `$${zTex(m)} \\times ${zTex(n)}$ 有多少个极大理想？`,
          ),
          answer: value,
          wrong: [primesOf(m * n).length, primesOf(m).length * primesOf(n).length, value + 1].filter((x) => x !== value),
          solution: t(
            `Each maximal ideal is a maximal ideal in one coordinate times the whole ring in the other: $${primesOf(m).length}$ from $${zTex(m)}$ and $${primesOf(n).length}$ from $${zTex(n)}$, $${value}$ in all.`,
            `每个极大理想都是一个坐标上的极大理想与另一个坐标上的整个环之积：来自 $${zTex(m)}$ 的 $${primesOf(m).length}$ 个与来自 $${zTex(n)}$ 的 $${primesOf(n).length}$ 个，共 $${value}$ 个。`,
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
