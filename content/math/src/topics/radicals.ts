import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, gcd, num, Q, radical, simplifyRadical } from "@ga/subject-math";

import { numberProblem, radicalProblem, steps } from "../problems.ts";

/** squareFree are the square-free radicands used in generated problems. */
const squareFree = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];

/** root writes c√m without simplifying: root(3, 8) is "3\sqrt{8}". */
const root = (c: number, m: number) => `${c === 1 ? "" : c === -1 ? "-" : c}\\sqrt{${m}}`;

/** extraction writes the steps √(k²m) = √(k²)·√m = k√m. */
function extraction(n: number): string {
  const [k, m] = simplifyRadical(n);
  return `\\sqrt{${n}} = \\sqrt{${k * k}} \\cdot \\sqrt{${m}} = ${radical(k, m)}`;
}

/** radicand draws k²m with k ≥ 2 and m square-free, at most max. */
function radicand(rng: Rng, max: number): number {
  for (;;) {
    const k = rng.int(2, 7);
    const m = rng.pick(squareFree);
    if (k * k * m <= max) return k * k * m;
  }
}

export const squareRootsAndCubeRoots: TopicDef = {
  id: "square-roots-and-cube-roots",
  title: t("Square Roots and Cube Roots", "平方根与立方根"),
  summary: t("Take square roots of perfect squares and cube roots of perfect cubes.", "求完全平方数的平方根和完全立方数的立方根。"),
  prerequisites: ["powers-of-rational-numbers"],
  encompasses: [{ topic: "powers-of-rational-numbers", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.8.EE.A.2"],
  knowledgePoints: [
    {
      id: "square-roots-of-perfect-squares",
      title: t("Square roots of perfect squares", "完全平方数的平方根"),
      explanation: t(
        "The **square root** $\\sqrt{a}$ is the number $r \\ge 0$ with $r^{2} = a$. So $\\sqrt{49} = 7$ because $7^{2} = 49$. The symbol always means the nonnegative root: $\\sqrt{49}$ is $7$, not $-7$, and $-\\sqrt{49} = -7$.\n\nFor fractions and decimals, take the root of each part: $\\sqrt{\\frac{9}{25}} = \\frac{3}{5}$ and $\\sqrt{0.36} = 0.6$, since $0.6^{2} = 0.36$.",
        "**平方根** $\\sqrt{a}$ 是满足 $r^{2} = a$ 的非负数 $r$。所以 $\\sqrt{49} = 7$，因为 $7^{2} = 49$。这个符号总是表示非负的根：$\\sqrt{49}$ 是 $7$ 而不是 $-7$，而 $-\\sqrt{49} = -7$。\n\n对分数和小数，分别开方：$\\sqrt{\\frac{9}{25}} = \\frac{3}{5}$，$\\sqrt{0.36} = 0.6$，因为 $0.6^{2} = 0.36$。",
      ),
      generate(rng) {
        const kind = rng.pick(["integer", "integer", "fraction", "decimal"] as const);
        let r: Q;
        if (kind === "integer") r = Q.of(rng.int(1, 25));
        else if (kind === "decimal") r = Q.of(rng.int(1, 12), 10);
        else {
          let a: number;
          let b: number;
          do {
            a = rng.int(1, 9);
            b = rng.int(2, 12);
          } while (gcd(a, b) !== 1);
          r = Q.of(a, b);
        }
        const negate = rng.bool(0.25);
        const sq = r.mul(r);
        const inside = kind === "decimal" ? dec(sq) : num(sq);
        const value = negate ? r.neg() : r;
        const shown = (v: Q) => (kind === "decimal" ? dec(v) : num(v));
        return numberProblem({
          prompt: t(`Evaluate $${negate ? "-" : ""}\\sqrt{${inside}}$.`, `计算 $${negate ? "-" : ""}\\sqrt{${inside}}$。`),
          answer: value,
          ...(kind === "decimal" && { form: "decimal" as const }),
          wrong: [value.neg(), sq.div(Q.of(2)), ...(kind === "decimal" ? [r.mul(Q.of(10))] : [])],
          solution: t(
            `$${shown(r)}^{2} = ${inside}$ and $${shown(r)} \\ge 0$, so $\\sqrt{${inside}} = ${shown(r)}$${negate ? ` and $-\\sqrt{${inside}} = ${shown(value)}$` : ""}.`,
            `$${shown(r)}^{2} = ${inside}$ 且 $${shown(r)} \\ge 0$，所以 $\\sqrt{${inside}} = ${shown(r)}$${negate ? `，$-\\sqrt{${inside}} = ${shown(value)}$` : ""}。`,
          ),
        });
      },
    },
    {
      id: "squaring-a-square-root",
      title: t("Squaring a square root", "平方根的平方"),
      explanation: t(
        "By definition $\\sqrt{a}$ is the nonnegative number whose square is $a$, so squaring it gives $a$ back, even when $\\sqrt{a}$ is not a whole number:\n\n$$\\left(\\sqrt{a}\\right)^{2} = \\sqrt{a} \\cdot \\sqrt{a} = a \\qquad \\left(3\\sqrt{2}\\right)^{2} = 3^{2} \\cdot 2 = 18$$",
        "按定义，$\\sqrt{a}$ 是平方等于 $a$ 的非负数，所以它的平方就是 $a$，即使 $\\sqrt{a}$ 不是整数：\n\n$$\\left(\\sqrt{a}\\right)^{2} = \\sqrt{a} \\cdot \\sqrt{a} = a \\qquad \\left(3\\sqrt{2}\\right)^{2} = 3^{2} \\cdot 2 = 18$$",
      ),
      generate(rng) {
        const m = rng.pick([...squareFree, 17, 19, 21, 22, 23, 26, 29, 30]);
        const c = rng.bool(0.5) ? 1 : rng.pick([2, 3, 4, 5, -2, -3]);
        const value = c * c * m;
        const expr = c === 1 ? `\\left(\\sqrt{${m}}\\right)^{2}` : `\\left(${root(c, m)}\\right)^{2}`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `计算 $${expr}$。`),
          answer: value,
          form: "integer",
          wrong: [m * m * c * c, c * m, 2 * c * m, ...(c === 1 ? [] : [c * m * m])],
          solution: t(
            c === 1
              ? `Squaring a square root gives back the number under it: $${expr} = ${m}$.`
              : `Square the coefficient and the root separately:${steps(`${expr} = ${c < 0 ? `(${c})` : c}^{2} \\cdot \\left(\\sqrt{${m}}\\right)^{2} = ${c * c} \\cdot ${m} = ${value}`)}`,
            c === 1
              ? `平方根的平方就是根号下的数：$${expr} = ${m}$。`
              : `系数与根式分别平方：${steps(`${expr} = ${c < 0 ? `(${c})` : c}^{2} \\cdot \\left(\\sqrt{${m}}\\right)^{2} = ${c * c} \\cdot ${m} = ${value}`)}`,
          ),
        });
      },
    },
    {
      id: "cube-roots-of-perfect-cubes",
      title: t("Cube roots of perfect cubes", "完全立方数的立方根"),
      explanation: t(
        "The **cube root** $\\sqrt[3]{a}$ is the number whose cube is $a$: $\\sqrt[3]{64} = 4$ because $4^{3} = 64$.\n\nUnlike square roots, cube roots of negative numbers exist, because the cube of a negative number is negative: $\\sqrt[3]{-27} = -3$ since $(-3)^{3} = -27$.",
        "**立方根** $\\sqrt[3]{a}$ 是立方等于 $a$ 的数：$\\sqrt[3]{64} = 4$，因为 $4^{3} = 64$。\n\n与平方根不同，负数也有立方根，因为负数的立方是负数：$\\sqrt[3]{-27} = -3$，因为 $(-3)^{3} = -27$。",
      ),
      keyPrerequisites: ["powers-of-integers"],
      generate(rng) {
        const r = rng.bool(0.75)
          ? Q.of(rng.nonZero(-10, 10))
          : (() => {
              let a: number;
              let b: number;
              do {
                a = rng.int(1, 5);
                b = rng.int(2, 6);
              } while (gcd(a, b) !== 1);
              return Q.of(rng.sign() * a, b);
            })();
        const cube = r.pow(3);
        return numberProblem({
          prompt: t(`Evaluate $\\sqrt[3]{${num(cube)}}$.`, `计算 $\\sqrt[3]{${num(cube)}}$。`),
          answer: r,
          wrong: [r.neg(), cube.div(Q.of(3))],
          solution: t(
            `$${r.sign() < 0 || !r.isInteger() ? `\\left(${num(r)}\\right)` : num(r)}^{3} = ${num(cube)}$, so $\\sqrt[3]{${num(cube)}} = ${num(r)}$.`,
            `$${r.sign() < 0 || !r.isInteger() ? `\\left(${num(r)}\\right)` : num(r)}^{3} = ${num(cube)}$，所以 $\\sqrt[3]{${num(cube)}} = ${num(r)}$。`,
          ),
        });
      },
    },
  ],
};

export const simplifyingSquareRoots: TopicDef = {
  id: "simplifying-square-roots",
  title: t("Simplifying Square Roots", "化简平方根"),
  summary: t("Write square roots in simplest radical form, and multiply them.", "把平方根化成最简根式，并进行根式乘法。"),
  prerequisites: ["square-roots-and-cube-roots"],
  encompasses: [{ topic: "square-roots-and-cube-roots", weight: 0.4 }],
  xp: 12,
  standards: ["CCSS.8.EE.A.2", "CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "simplest-radical-form",
      title: t("Simplest radical form", "最简根式"),
      explanation: t(
        "Since $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$, a perfect-square factor can be taken out of the root:\n\n$$\\sqrt{72} = \\sqrt{36} \\cdot \\sqrt{2} = 6\\sqrt{2}$$\n\nA root is in **simplest form** when no perfect square other than $1$ divides the number under it. Use the **largest** square factor; taking a smaller one ($\\sqrt{72} = 2\\sqrt{18}$) leaves more to simplify. A prime factorization shows it: $72 = 2^{3} \\cdot 3^{2}$, and each pair of equal primes comes out as one.",
        "因为 $\\sqrt{ab} = \\sqrt{a} \\cdot \\sqrt{b}$，可以把完全平方因数移到根号外：\n\n$$\\sqrt{72} = \\sqrt{36} \\cdot \\sqrt{2} = 6\\sqrt{2}$$\n\n当根号内的数除 $1$ 外不含完全平方因数时，根式就是**最简根式**。要取**最大**的平方因数；取较小的（$\\sqrt{72} = 2\\sqrt{18}$）还需要继续化简。质因数分解能看出它：$72 = 2^{3} \\cdot 3^{2}$，每一对相同的质数移出一个。",
      ),
      keyPrerequisites: ["prime-factorization"],
      generate(rng) {
        const n = radicand(rng, 300);
        const [k, m] = simplifyRadical(n);
        const c = rng.bool(0.3) ? rng.int(2, 5) : 1;
        const expr = root(c, n);
        const partial = [2, 3, 5].find((p) => k % p === 0 && k !== p);
        return radicalProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer: [c * k, m],
          wrong: [root(c * m, k * k === n ? 1 : k), root(c * k * k, m), ...(partial ? [root(c * partial, n / (partial * partial))] : [])],
          solution: t(
            `The largest perfect square dividing $${n}$ is $${k * k}$:${steps(c === 1 ? extraction(n) : `${expr} = ${c} \\cdot ${radical(k, m)} = ${radical(c * k, m)}`)}`,
            `能整除 $${n}$ 的最大完全平方数是 $${k * k}$：${steps(c === 1 ? extraction(n) : `${expr} = ${c} \\cdot ${radical(k, m)} = ${radical(c * k, m)}`)}`,
          ),
        });
      },
    },
    {
      id: "multiplying-square-roots",
      title: t("Multiplying square roots", "根式的乘法"),
      explanation: t(
        "Multiply the coefficients, multiply the numbers under the roots, then simplify:\n\n$$2\\sqrt{6} \\cdot 5\\sqrt{10} = 10\\sqrt{60} = 10 \\cdot 2\\sqrt{15} = 20\\sqrt{15}$$",
        "系数相乘，根号内的数相乘，然后化简：\n\n$$2\\sqrt{6} \\cdot 5\\sqrt{10} = 10\\sqrt{60} = 10 \\cdot 2\\sqrt{15} = 20\\sqrt{15}$$",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          [p, q] = rng.sample(squareFree, 2) as [number, number];
        } while (gcd(p, q) === 1 && rng.bool(0.7));
        const [a, b] = [rng.int(1, 5), rng.int(1, 5)];
        const [k, m] = simplifyRadical(p * q);
        const product = `${a * b === 1 ? "" : a * b}\\sqrt{${p * q}}`;
        return radicalProblem({
          prompt: t(`Simplify $${root(a, p)} \\cdot ${root(b, q)}$.`, `化简 $${root(a, p)} \\cdot ${root(b, q)}$。`),
          answer: [a * b * k, m],
          wrong: [root(a * b, p + q), root(a + b, p * q), root(a * b * k, m * k)],
          solution: t(
            `${steps(`${root(a, p)} \\cdot ${root(b, q)} = ${product}${k > 1 ? ` = ${radical(a * b * k, m)}` : ""}`)}${k > 1 ? `since $${p * q} = ${k * k} \\cdot ${m}$.` : `$${p * q}$ has no square factor, so this is in simplest form.`}`,
            `${steps(`${root(a, p)} \\cdot ${root(b, q)} = ${product}${k > 1 ? ` = ${radical(a * b * k, m)}` : ""}`)}${k > 1 ? `因为 $${p * q} = ${k * k} \\cdot ${m}$。` : `$${p * q}$ 不含平方因数，已是最简形式。`}`,
          ),
        });
      },
    },
  ],
};

export const addingAndSubtractingRadicals: TopicDef = {
  id: "adding-and-subtracting-radicals",
  title: t("Adding and Subtracting Radicals", "根式的加减"),
  summary: t("Combine like radicals, simplifying first when needed.", "合并同类根式，必要时先化简。"),
  prerequisites: ["simplifying-square-roots", "combining-like-terms"],
  encompasses: [
    { topic: "simplifying-square-roots", weight: 0.4 },
    { topic: "combining-like-terms", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSN.RN.B.3"],
  knowledgePoints: [
    {
      id: "like-radicals",
      title: t("Like radicals", "同类根式"),
      explanation: t(
        "Radicals with the same number under the root are **like radicals**, and combine like like terms: add or subtract the coefficients and keep the root.\n\n$$3\\sqrt{2} + 5\\sqrt{2} = 8\\sqrt{2}$$\n\nThe numbers under the roots are **not** added: $\\sqrt{2} + \\sqrt{2} = 2\\sqrt{2}$, not $\\sqrt{4}$.",
        "根号内的数相同的根式叫**同类根式**，像同类项一样合并：系数相加减，根式不变。\n\n$$3\\sqrt{2} + 5\\sqrt{2} = 8\\sqrt{2}$$\n\n根号内的数**不**相加：$\\sqrt{2} + \\sqrt{2} = 2\\sqrt{2}$，而不是 $\\sqrt{4}$。",
      ),
      keyPrerequisites: ["combining-like-terms"],
      generate(rng) {
        const m = rng.pick(squareFree);
        let a: number;
        let b: number;
        let s: 1 | -1;
        do {
          [a, b, s] = [rng.int(1, 12), rng.int(1, 12), rng.sign()];
        } while (a + s * b === 0);
        const c = a + s * b;
        const expr = `${root(a, m)} ${s > 0 ? "+" : "-"} ${root(b, m)}`;
        return radicalProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer: [c, m],
          wrong: [root(c, 2 * m), root(a - s * b === 0 ? c + 1 : a - s * b, m), root(a * b, m)],
          solution: t(
            `These are like radicals; combine the coefficients:${steps(`${expr} = (${a} ${s > 0 ? "+" : "-"} ${b})\\sqrt{${m}} = ${radical(c, m)}`)}`,
            `这是同类根式，合并系数：${steps(`${expr} = (${a} ${s > 0 ? "+" : "-"} ${b})\\sqrt{${m}} = ${radical(c, m)}`)}`,
          ),
        });
      },
    },
    {
      id: "simplifying-then-combining",
      title: t("Simplifying before combining", "先化简再合并"),
      explanation: t(
        "Roots that look different may become like radicals once simplified:\n\n$$\\sqrt{12} + \\sqrt{27} = 2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}$$\n\nSimplify every root first, then combine the like radicals.",
        "看起来不同的根式化简后可能成为同类根式：\n\n$$\\sqrt{12} + \\sqrt{27} = 2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}$$\n\n先化简每个根式，再合并同类根式。",
      ),
      keyPrerequisites: ["simplifying-square-roots"],
      generate(rng) {
        const m = rng.pick([2, 3, 5, 6, 7]);
        let j: number;
        let k: number;
        do {
          [j, k] = [rng.int(1, 6), rng.int(2, 6)];
        } while (j === k);
        const s = rng.sign();
        const c = j + s * k;
        const [x, y] = [j * j * m, k * k * m];
        const expr = `\\sqrt{${x}} ${s > 0 ? "+" : "-"} \\sqrt{${y}}`;
        return radicalProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer: [c, m],
          wrong: [s > 0 ? `\\sqrt{${x + y}}` : `\\sqrt{${Math.abs(x - y)}}`, root(j * k, m), root(c, 2 * m)],
          solution: t(
            `Simplify each root, then combine:${steps(`${expr} = ${radical(j, m)} ${s > 0 ? "+" : "-"} ${radical(k, m)} = ${radical(c, m)}`)}`,
            `先化简每个根式，再合并：${steps(`${expr} = ${radical(j, m)} ${s > 0 ? "+" : "-"} ${radical(k, m)} = ${radical(c, m)}`)}`,
          ),
        });
      },
    },
  ],
};

export const rationalizingDenominators: TopicDef = {
  id: "rationalizing-denominators",
  title: t("Rationalizing Denominators", "分母有理化"),
  summary: t("Remove a square root from a denominator by multiplying by the root.", "通过乘以根式去掉分母中的平方根。"),
  prerequisites: ["simplifying-square-roots"],
  encompasses: [{ topic: "simplifying-square-roots", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSN.RN.A.2"],
  knowledgePoints: [
    {
      id: "monomial-denominators",
      title: t("Roots in the denominator", "分母中含有根式"),
      explanation: t(
        "Simplest radical form has no root in the denominator. Multiply the numerator and the denominator by the root; since $\\sqrt{m} \\cdot \\sqrt{m} = m$, the denominator becomes a whole number. Then reduce the fraction:\n\n$$\\frac{6}{\\sqrt{3}} = \\frac{6 \\cdot \\sqrt{3}}{\\sqrt{3} \\cdot \\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$$",
        "最简根式的分母中不含根式。把分子和分母同乘以这个根式；因为 $\\sqrt{m} \\cdot \\sqrt{m} = m$，分母就变成整数。然后约分：\n\n$$\\frac{6}{\\sqrt{3}} = \\frac{6 \\cdot \\sqrt{3}}{\\sqrt{3} \\cdot \\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$$",
      ),
      keyPrerequisites: ["equivalent-fractions"],
      generate(rng) {
        const m = rng.pick([2, 3, 5, 6, 7, 10, 11]);
        const b = rng.pick([1, 1, 2, 3]);
        const a = rng.bool(0.5) ? m * rng.int(1, 4) : rng.int(1, 12);
        const c = Q.of(a, b * m);
        const den = root(b, m);
        const raw = `\\frac{${root(a, m)}}{${b * m}}`;
        const middle = b === 1 ? raw : `\\frac{${root(a, m)}}{${b} \\cdot ${m}} = ${raw}`;
        const work = `\\frac{${a}}{${den}} = ${middle}${raw === radical(c, m) ? "" : ` = ${radical(c, m)}`}`;
        return radicalProblem({
          prompt: t(`Rationalize the denominator and simplify: $\\frac{${a}}{${den}}$.`, `将分母有理化并化简：$\\frac{${a}}{${den}}$。`),
          answer: [c, m],
          wrong: [b > 1 ? `\\frac{${a}\\sqrt{${m}}}{${b}}` : root(a, m), radical(Q.of(a, b * m * m), m), `\\frac{${a}}{${b * m}}`],
          solution: t(
            `Multiply the numerator and the denominator by $\\sqrt{${m}}$:${steps(work)}`,
            `分子、分母同乘以 $\\sqrt{${m}}$：${steps(work)}`,
          ),
        });
      },
    },
  ],
};

/** radicalTopics are the square root and cube root topics. */
export const radicalTopics: readonly TopicDef[] = [
  squareRootsAndCubeRoots,
  simplifyingSquareRoots,
  addingAndSubtractingRadicals,
  rationalizingDenominators,
];
