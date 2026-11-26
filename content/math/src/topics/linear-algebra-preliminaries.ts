import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { intervalLatex, poly, q } from "@ga/subject-math";
import { linearAlgebraDrawings1 } from "../explanation-drawings-linear-algebra-1.ts";

import {
  choiceProblem,
  equationProblem,
  intervalProblem,
  numberProblem,
  pointProblem,
  say,
  solutionsProblem,
  why,
  whySet,
  withMistakes,
} from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

// Linear Algebra Unit 1: Preliminaries (Modules 1.1, 1.2, 1.3)
// 25 topics covering Set Theory, Set Operations, and 3D Vector Geometry.

type Vec3 = readonly [number, number, number];
type Vec2 = readonly [number, number];

const add3 = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const _sub3 = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const _smul3 = (k: number, a: Vec3): Vec3 => [k * a[0], k * a[1], k * a[2]];
const dot3 = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross3 = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

function gcd2(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
}

function _gcd3(a: number, b: number, c: number): number {
  return gcd2(gcd2(a, b), c);
}

function vec3Latex(v: Vec3): string {
  return `\\langle ${v[0]}, ${v[1]}, ${v[2]} \\rangle`;
}

function pt3Latex(p: Vec3): string {
  return `(${p[0]}, ${p[1]}, ${p[2]})`;
}

function fmtLinear3(a: number, b: number, c: number, vars = ["x", "y", "z"]): string {
  const parts: string[] = [];
  const coeffs = [a, b, c];
  for (let i = 0; i < 3; i++) {
    const coeff = coeffs[i]!;
    const v = vars[i]!;
    if (coeff === 0) continue;
    if (parts.length === 0) {
      if (coeff === 1) parts.push(v);
      else if (coeff === -1) parts.push(`-${v}`);
      else parts.push(`${coeff}${v}`);
    } else {
      if (coeff === 1) parts.push(`+ ${v}`);
      else if (coeff === -1) parts.push(`- ${v}`);
      else if (coeff > 0) parts.push(`+ ${coeff}${v}`);
      else parts.push(`- ${-coeff}${v}`);
    }
  }
  return parts.length === 0 ? "0" : parts.join(" ");
}

function planeEqLatex(a: number, b: number, c: number, d: number): string {
  const lhs = fmtLinear3(a, b, c);
  let dStr = "";
  if (d > 0) dStr = ` + ${d}`;
  else if (d < 0) dStr = ` - ${-d}`;
  return `${lhs}${dStr} = 0`;
}

function fmtTerm(coeff: number, v: string, p: number): string {
  const inner = p === 0 ? v : p > 0 ? `(${v} - ${p})` : `(${v} + ${-p})`;
  if (p === 0) {
    if (coeff === 1) return v;
    if (coeff === -1) return `-${v}`;
    return `${coeff}${v}`;
  }
  if (coeff === 1) return inner;
  if (coeff === -1) return `-${inner}`;
  return `${coeff}${inner}`;
}

// joinTerms adds terms, writing "a + -b" as "a - b".
function joinTerms(terms: readonly string[]): string {
  return terms.reduce((acc, s) => (acc === "" ? s : s.startsWith("-") ? `${acc} - ${s.slice(1)}` : `${acc} + ${s}`), "");
}

function fmtSub(a: number, b: number): string {
  return b < 0 ? `${a} - (${b})` : `${a} - ${b}`;
}

function factorLatex(root: number, v = "x"): string {
  if (root === 0) return v;
  return root > 0 ? `(${v} - ${root})` : `(${v} + ${-root})`;
}

function symNum(axis: string, val: number): string {
  if (val === 0) return axis;
  return val > 0 ? `${axis} - ${val}` : `${axis} + ${-val}`;
}

function paramLineLatex(p: Vec3, v: Vec3, tVar = "t"): string {
  const fmtCoord = (val: number, dir: number, axis: string) => {
    if (dir === 0) return `${axis} = ${val}`;
    if (val === 0) {
      if (dir === 1) return `${axis} = ${tVar}`;
      if (dir === -1) return `${axis} = -${tVar}`;
      return `${axis} = ${dir}${tVar}`;
    }
    if (dir === 1) return `${axis} = ${val} + ${tVar}`;
    if (dir === -1) return `${axis} = ${val} - ${tVar}`;
    if (dir > 0) return `${axis} = ${val} + ${dir}${tVar}`;
    return `${axis} = ${val} - ${-dir}${tVar}`;
  };
  return `${fmtCoord(p[0], v[0], "x")}, \\; ${fmtCoord(p[1], v[1], "y")}, \\; ${fmtCoord(p[2], v[2], "z")}`;
}

function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([right.en]);
  const rest: Text[] = [];
  for (const w of wrong) {
    if (!seen.has(w.en)) {
      seen.add(w.en);
      rest.push(w);
      if (rest.length === 3) break;
    }
  }
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

/** Wrong is a wrong option with what is wrong with it in English and Chinese. */
type Wrong = readonly [option: Text, en: string, zh: string];

/** explained builds a choice problem whose solution says why each wrong option is wrong. */
function explained(rng: Rng, prompt: Text, right: Text, wrong: readonly Wrong[], solution: Text): Problem {
  return reasoned(
    oneOf(
      rng,
      prompt,
      right,
      wrong.map(([option]) => option),
      solution,
    ),
    wrong.map(([option, en, zh]): Reason => [option.en, en, zh]),
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MODULE 1.1: INTRODUCTION TO SET THEORY
// ═════════════════════════════════════════════════════════════════════════════

// ─── 1.1.1 Special Sets ──────────────────────────────────────────────────────

/** setNames are the standard number sets from the smallest to the largest. */
const setNames = ["\\mathbb{N}", "\\mathbb{Z}", "\\mathbb{Q}", "\\mathbb{R}", "\\mathbb{C}"] as const;

/** NumberKind is a kind of number, named by the smallest standard set that holds it. */
type NumberKind = {
  /** at is the index of the smallest set in setNames. */
  at: number;
  /** missing says why the number is not in each smaller set. */
  missing: readonly (readonly [string, string])[];
  /** inside says why it is in its smallest set. */
  inside: readonly [string, string];
  /** check confirms the classification. */
  check: readonly [string, string];
};

export const specialSets: TopicDef = {
  id: "special-sets",
  title: t("Special Sets", "常见数集与符号"),
  summary: t(
    "Understand the standard number sets N, Z, Q, R, C and the empty set notation.",
    "理解常用数集 N, Z, Q, R, C 的定义、包含关系及空集符号。",
  ),
  intro: t(
    "Take the number $-\\frac{12}{4}$. It is written as a fraction, but it equals $-3$, a whole number below zero. It is not in $\\mathbb{N} = \\{1, 2, 3, \\dots\\}$, because it is negative, but it is in the integers $\\mathbb{Z}$, and so also in $\\mathbb{Q}$, $\\mathbb{R}$ and $\\mathbb{C}$, which contain $\\mathbb{Z}$.\n\nCheck: $-3 = \\frac{-3}{1}$ is a ratio of integers, so it is rational too; the integers are simply the smallest of the standard sets that hold it.\n\nIn this lesson we name the standard number sets, place a number in the smallest of them, and meet the empty set, the set with no elements.",
    "看数 $-\\frac{12}{4}$。它写成分数，但等于 $-3$，是一个小于零的整数。它不在 $\\mathbb{N} = \\{1, 2, 3, \\dots\\}$ 中，因为它是负数；但它在整数集 $\\mathbb{Z}$ 中，因而也在包含 $\\mathbb{Z}$ 的 $\\mathbb{Q}$、$\\mathbb{R}$ 和 $\\mathbb{C}$ 中。\n\n检验：$-3 = \\frac{-3}{1}$ 是整数之比，所以它也是有理数；整数集只是包含它的标准数集中最小的一个。\n\n本课我们认识常用数集，把一个数放进包含它的最小数集，并认识不含任何元素的空集。",
  ),
  prerequisites: ["evaluating-expressions"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSN.Q.A.1"],
  knowledgePoints: [
    {
      id: "identifying-number-sets",
      title: t("Identifying number sets", "识别常用数集"),
      explanation: t(
        "Standard number sets are denoted by specific letters: $\\mathbb{N} = \\{1, 2, 3, \\dots\\}$ (natural numbers), $\\mathbb{Z}$ (integers), $\\mathbb{Q}$ (rational numbers $p/q$ with $p, q \\in \\mathbb{Z}, q \\neq 0$), $\\mathbb{R}$ (real numbers), and $\\mathbb{C}$ (complex numbers $a + bi$). They satisfy the inclusion hierarchy $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$, so a number in one set is in every larger one. To find the smallest set holding a number, test the sets in order from $\\mathbb{N}$ up. For $\\frac{7}{2}$: it is not a whole number, so it is not in $\\mathbb{N}$ or $\\mathbb{Z}$, but it is a ratio of integers, so the smallest set is $\\mathbb{Q}$.\n\n> **Watch out.** A number belongs to every set above its smallest one, so naming a larger set, such as $\\mathbb{R}$ for $\\frac{7}{2}$, is true but not the answer. And $\\sqrt{2}$ is real but not rational, since it is no ratio of integers.",
        "常用数集有约定记号：$\\mathbb{N} = \\{1, 2, 3, \\dots\\}$（正整数集/自然数集），$\\mathbb{Z}$（整数集），$\\mathbb{Q}$（有理数集，可表示为 $p/q$，$p, q \\in \\mathbb{Z}, q \\neq 0$），$\\mathbb{R}$（实数集），以及 $\\mathbb{C}$（复数集 $a + bi$）。它们满足嵌套包含关系 $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$，所以属于一个数集的数也属于每个更大的数集。要找包含一个数的最小数集，就从 $\\mathbb{N}$ 开始依次检验。对 $\\frac{7}{2}$：它不是整数，所以不在 $\\mathbb{N}$ 和 $\\mathbb{Z}$ 中，但它是整数之比，所以最小数集是 $\\mathbb{Q}$。\n\n> **注意。** 一个数属于它的最小数集之上的每个数集，所以说出一个更大的数集，比如对 $\\frac{7}{2}$ 说 $\\mathbb{R}$，虽然正确，却不是答案。而 $\\sqrt{2}$ 是实数但不是有理数，因为它不是整数之比。",
      ),
      generate(rng) {
        const cat = rng.pick(["neg_int", "frac", "irrational", "complex", "natural"] as const);
        let x: string;
        let kind: NumberKind;
        if (cat === "neg_int") {
          const k = rng.int(2, 35);
          x = `-${k}`;
          kind = {
            at: 1,
            missing: [["it is negative, and $\\mathbb{N}$ holds only positive whole numbers", "它是负数，而 $\\mathbb{N}$ 只含正整数"]],
            inside: ["it is a whole number", "它是整数"],
            check: [
              `$${x}$ is a whole number below zero: it is an integer but not a natural number.`,
              `$${x}$ 是小于零的整数：它是整数，但不是自然数。`,
            ],
          };
        } else if (cat === "frac") {
          const d = rng.int(2, 11);
          let p = rng.int(1, 25);
          while (p % d === 0) p++;
          const sign = rng.bool() ? "-" : "";
          x = `${sign}\\frac{${p}}{${d}}`;
          const whole: [string, string] = [
            `it is not a whole number, since $${d}$ does not divide $${p}$`,
            `它不是整数，因为 $${d}$ 不整除 $${p}$`,
          ];
          kind = {
            at: 2,
            missing: [whole, whole],
            inside: [`it is the ratio of the integers $${sign}${p}$ and $${d}$`, `它是整数 $${sign}${p}$ 与 $${d}$ 之比`],
            check: [
              `$${p} = ${d} \\cdot ${Math.floor(p / d)} + ${p % d}$, so $${x}$ lies strictly between two integers, yet it is a ratio of integers.`,
              `$${p} = ${d} \\cdot ${Math.floor(p / d)} + ${p % d}$，所以 $${x}$ 严格位于两个整数之间，但它是整数之比。`,
            ],
          };
        } else if (cat === "irrational") {
          const rad = rng.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23]);
          const mult = rng.pick([1, 2, 3, 5]);
          x = mult === 1 ? `\\sqrt{${rad}}` : `${mult}\\sqrt{${rad}}`;
          const s = Math.floor(Math.sqrt(rad));
          const whole: [string, string] = [
            `it is not a whole number, since $${rad}$ is not a perfect square`,
            `它不是整数，因为 $${rad}$ 不是完全平方数`,
          ];
          kind = {
            at: 3,
            missing: [
              whole,
              whole,
              [`$\\sqrt{${rad}}$ is irrational, so it is no ratio of integers`, `$\\sqrt{${rad}}$ 是无理数，不是整数之比`],
            ],
            inside: ["it is a point on the number line", "它是数轴上的点"],
            check: [
              `$${s}^2 = ${s * s} < ${rad} < ${(s + 1) ** 2} = ${s + 1}^2$, so $\\sqrt{${rad}}$ lies strictly between $${s}$ and $${s + 1}$ and is real, but not rational.`,
              `$${s}^2 = ${s * s} < ${rad} < ${(s + 1) ** 2} = ${s + 1}^2$，所以 $\\sqrt{${rad}}$ 严格位于 $${s}$ 与 $${s + 1}$ 之间，是实数，但不是有理数。`,
            ],
          };
        } else if (cat === "complex") {
          const a = rng.int(-8, 8);
          const b = rng.pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]);
          x = a === 0 ? `${b}i` : b > 0 ? `${a} + ${b}i` : `${a} - ${-b}i`;
          const real: [string, string] = [
            `its imaginary part is $${b} \\ne 0$, so it is not real`,
            `它的虚部是 $${b} \\ne 0$，所以不是实数`,
          ];
          kind = {
            at: 4,
            missing: [real, real, real, real],
            inside: [`it has the form $a + bi$ with $a = ${a}$ and $b = ${b}$`, `它具有 $a + bi$ 的形式，$a = ${a}$，$b = ${b}$`],
            check: [
              `$(${x})$ has a nonzero multiple of $i$, so no real number equals it.`,
              `$(${x})$ 含有 $i$ 的非零倍数，所以没有实数等于它。`,
            ],
          };
        } else {
          const n = rng.int(1, 35);
          x = String(n);
          kind = {
            at: 0,
            missing: [],
            inside: ["it is a positive whole number", "它是正整数"],
            check: [
              `$${n}$ is one of $1, 2, 3, \\dots$, so it is a natural number.`,
              `$${n}$ 是 $1, 2, 3, \\dots$ 中的一个，所以是自然数。`,
            ],
          };
        }
        const answer = setNames[kind.at]!;
        const shown = [kind.at, ...[0, 1, 2, 3, 4].filter((i) => i !== kind.at && Math.abs(i - kind.at) <= 2)].slice(0, 4);
        const options = shown.map((i) => t(`$${setNames[i]}$`, `$${setNames[i]}$`));
        const tests = kind.missing.map(
          ([en, zh], i) => [`$${x} \\notin ${setNames[i]}$: ${en}.`, `$${x} \\notin ${setNames[i]}$：${zh}。`] as const,
        );
        const problem = oneOf(
          rng,
          t(
            `Which is the most specific (smallest) standard number set among $\\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{R}, \\mathbb{C}$ containing $x = ${x}$?`,
            `在数集 $\\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{R}, \\mathbb{C}$ 中，包含 $x = ${x}$ 的最特化（最小）数集是哪个？`,
          ),
          options[0]!,
          options.slice(1),
          walked(
            [
              [
                ["Test the sets from the smallest", "从最小的数集开始检验"],
                t(
                  [...tests.map(([en]) => en), `$${x} \\in ${answer}$: ${kind.inside[0]}.`].join(" "),
                  [...tests.map(([, zh]) => zh), `$${x} \\in ${answer}$：${kind.inside[1]}。`].join(""),
                ),
              ],
              [
                ["Take the smallest", "取最小的数集"],
                t(
                  `Every set above $${answer}$ in $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$ also contains $${x}$, so the smallest is $${answer}$.`,
                  `在 $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$ 中，$${answer}$ 之上的每个数集也都包含 $${x}$，所以最小的是 $${answer}$。`,
                ),
              ],
            ],
            t(...kind.check),
          ),
        );
        return reasoned(
          problem,
          shown
            .slice(1)
            .map(
              (i): Reason =>
                i < kind.at
                  ? [
                      `$${setNames[i]}$`,
                      `$${x}$ is not in $${setNames[i]}$: ${kind.missing[i]![0]}.`,
                      `$${x}$ 不在 $${setNames[i]}$ 中：${kind.missing[i]![1]}。`,
                    ]
                  : [
                      `$${setNames[i]}$`,
                      `$${x}$ is in $${setNames[i]}$, but the smaller set $${answer}$ already contains it.`,
                      `$${x}$ 在 $${setNames[i]}$ 中，但更小的数集 $${answer}$ 已经包含它。`,
                    ],
            ),
        );
      },
    },
    {
      id: "the-empty-set-and-set-membership",
      title: t("The empty set and set membership", "空集与属于关系"),
      explanation: t(
        "The empty set $\\emptyset$ (or $\\{\\}$) is the unique set containing no elements. Its cardinality is $|\\emptyset| = 0$. For any object $x$, $x \\in \\emptyset$ is always false. The empty set is a subset of every set $A$ ($\\emptyset \\subseteq A$), but is not necessarily an element of $A$ unless specifically included as an element. A set described by an equation holds exactly the solutions of that equation: $\\{x \\in \\mathbb{R} \\mid x^2 = 9\\} = \\{-3, 3\\}$, while $\\{x \\in \\mathbb{R} \\mid x^2 = -9\\} = \\emptyset$, because no real square is negative.\n\n> **Watch out.** $\\emptyset$ is not $\\{0\\}$: the second set has one element, the number $0$. And a repeated root is one element, so $\\{x \\mid (x - 3)^2 = 0\\} = \\{3\\}$ has size $1$, not $2$.",
        "空集 $\\emptyset$（或记为 $\\{\\}$）是不含任何元素的唯一集合，其元素个数为 $|\\emptyset| = 0$。对于任意对象 $x$，$x \\in \\emptyset$ 恒为假。空集是任意集合 $A$ 的子集（$\\emptyset \\subseteq A$），但除非特别将其作为元素包含，否则它通常不是 $A$ 的元素。用方程描述的集合恰好由方程的解组成：$\\{x \\in \\mathbb{R} \\mid x^2 = 9\\} = \\{-3, 3\\}$，而 $\\{x \\in \\mathbb{R} \\mid x^2 = -9\\} = \\emptyset$，因为实数的平方不会是负数。\n\n> **注意。** $\\emptyset$ 不是 $\\{0\\}$：后者有一个元素，即数 $0$。而重根只算一个元素，所以 $\\{x \\mid (x - 3)^2 = 0\\} = \\{3\\}$ 的大小是 $1$，不是 $2$。",
      ),
      generate(rng) {
        const r = rng.int(1, 9);
        // 0: x² + r² = 0 has no real root, 1: x² − r² = 0 has two, 2: (x − r)² = 0 has one.
        const kind = rng.int(0, 2);
        const equation = [`x^2 + ${r * r} = 0`, `x^2 - ${r * r} = 0`, `(x - ${r})^2 = 0`][kind]!;
        const options = [
          t("$S = \\emptyset$ and $|S| = 0$", "$S = \\emptyset$ 且 $|S| = 0$"),
          t(`$S = \\{-${r}, ${r}\\}$ and $|S| = 2$`, `$S = \\{-${r}, ${r}\\}$ 且 $|S| = 2$`),
          t(`$S = \\{${r}\\}$ and $|S| = 1$`, `$S = \\{${r}\\}$ 且 $|S| = 1$`),
          t("$S = \\{0\\}$ and $|S| = 1$", "$S = \\{0\\}$ 且 $|S| = 1$"),
        ];
        const solve = [
          t(
            `$x^2 + ${r * r} = 0$ means $x^2 = -${r * r}$. For any real $x$, $x^2 \\ge 0$, so no real number solves it.`,
            `$x^2 + ${r * r} = 0$ 即 $x^2 = -${r * r}$。对任意实数 $x$ 都有 $x^2 \\ge 0$，所以没有实数是它的解。`,
          ),
          t(`$x^2 = ${r * r}$ gives $x = ${r}$ or $x = -${r}$.`, `由 $x^2 = ${r * r}$ 得 $x = ${r}$ 或 $x = -${r}$。`),
          t(
            `$(x - ${r})^2 = 0$ only when $x - ${r} = 0$, that is $x = ${r}$, a repeated root.`,
            `$(x - ${r})^2 = 0$ 仅当 $x - ${r} = 0$，即 $x = ${r}$，是重根。`,
          ),
        ][kind]!;
        const collect = [
          t("$S$ contains no elements: $S = \\emptyset$ and $|S| = 0$.", "$S$ 不含任何元素：$S = \\emptyset$ 且 $|S| = 0$。"),
          t(`$S = \\{-${r}, ${r}\\}$ and $|S| = 2$.`, `$S = \\{-${r}, ${r}\\}$ 且 $|S| = 2$。`),
          t(`The repeated root is listed once, so $S = \\{${r}\\}$ and $|S| = 1$.`, `重根只列一次，所以 $S = \\{${r}\\}$ 且 $|S| = 1$。`),
        ][kind]!;
        const check = [
          t(
            `Even the smallest square, $0^2 = 0$, gives $0 + ${r * r} = ${r * r} \\ne 0$.`,
            `即使最小的平方 $0^2 = 0$，也有 $0 + ${r * r} = ${r * r} \\ne 0$。`,
          ),
          t(`$(-${r})^2 - ${r * r} = 0$ and $${r}^2 - ${r * r} = 0$.`, `$(-${r})^2 - ${r * r} = 0$，$${r}^2 - ${r * r} = 0$。`),
          t(
            `$(${r} - ${r})^2 = 0$, and any other $x$ makes $x - ${r} \\ne 0$, so its square is positive.`,
            `$(${r} - ${r})^2 = 0$，而任何其他 $x$ 都使 $x - ${r} \\ne 0$，其平方为正。`,
          ),
        ][kind]!;
        const problem = choiceProblem({
          prompt: t(
            `Consider the real set $S = \\{x \\in \\mathbb{R} \\mid ${equation}\\}$. Which statement about $S$ is true?`,
            `考虑实数集合 $S = \\{x \\in \\mathbb{R} \\mid ${equation}\\}$。关于 $S$ 的下列陈述哪项是正确的？`,
          ),
          options,
          correct: kind,
          solution: walked(
            [
              [["Solve the equation", "解方程"], solve],
              [["Collect the solutions", "收集解"], collect],
            ],
            check,
          ),
        });
        const reasons: Reason[] = [
          [options[0]!.en, "The equation has real solutions, so $S$ is not empty.", "方程有实数解，所以 $S$ 不是空集。"],
          [
            options[1]!.en,
            kind === 0
              ? `$x^2 = -${r * r}$ has no real solution, so $\\pm ${r}$ do not belong.`
              : `$-${r}$ is not a solution: $(-${r} - ${r})^2 = ${4 * r * r} \\ne 0$.`,
            kind === 0
              ? `$x^2 = -${r * r}$ 没有实数解，所以 $\\pm ${r}$ 都不属于 $S$。`
              : `$-${r}$ 不是解：$(-${r} - ${r})^2 = ${4 * r * r} \\ne 0$。`,
          ],
          [
            options[2]!.en,
            kind === 0
              ? `$${r}$ is not a solution: $${r}^2 + ${r * r} = ${2 * r * r} \\ne 0$.`
              : `$-${r}$ is a solution too, since $(-${r})^2 = ${r * r}$.`,
            kind === 0 ? `$${r}$ 不是解：$${r}^2 + ${r * r} = ${2 * r * r} \\ne 0$。` : `$-${r}$ 也是解，因为 $(-${r})^2 = ${r * r}$。`,
          ],
          [
            options[3]!.en,
            `$0$ is not a solution: putting $x = 0$ gives ${kind === 2 ? `$(0 - ${r})^2 = ${r * r}$` : `$${kind === 0 ? "" : "-"}${r * r}$`}, not $0$. An empty set is $\\emptyset$, not $\\{0\\}$.`,
            `$0$ 不是解：代入 $x = 0$ 得 ${kind === 2 ? `$(0 - ${r})^2 = ${r * r}$` : `$${kind === 0 ? "" : "-"}${r * r}$`}，不是 $0$。空集是 $\\emptyset$，不是 $\\{0\\}$。`,
          ],
        ];
        return reasoned(problem, reasons);
      },
    },
  ],
};

// ─── 1.1.2 Statements and Predicates ─────────────────────────────────────────

export const statementsAndPredicates: TopicDef = {
  id: "statements-and-predicates",
  title: t("Statements and Predicates", "命题与谓词"),
  summary: t(
    "Distinguish statements and open predicates, and evaluate truth values under universal and existential quantifiers.",
    "区分命题与开谓词，并判断在全称量词与存在量词下的真假值。",
  ),
  intro: t(
    'Compare "$7$ is odd" with "$x$ is odd". The first sentence makes a claim, and the claim is true. The second cannot be judged until $x$ is known: it is true for $x = 3$ and false for $x = 4$. Putting "for some integer $x$" in front settles it, since $x = 3$ works, so "there is an integer $x$ that is odd" is true.\n\nCheck: $7 = 2 \\cdot 3 + 1$ leaves remainder $1$ on division by $2$, so the first sentence is indeed true.\n\nIn this lesson we tell statements from predicates, and decide the truth of a predicate once a quantifier binds its variable.',
    "比较“$7$ 是奇数”和“$x$ 是奇数”。第一句作出了一个断言，而且这个断言为真。第二句在不知道 $x$ 之前无法判断：$x = 3$ 时为真，$x = 4$ 时为假。在前面加上“存在整数 $x$”就能确定它，因为 $x = 3$ 满足，所以“存在奇整数 $x$”为真。\n\n检验：$7 = 2 \\cdot 3 + 1$ 除以 $2$ 余 $1$，所以第一句确实为真。\n\n本课我们区分命题与谓词，并在量词约束变量之后判断谓词的真假。",
  ),
  prerequisites: ["special-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "propositions-and-truth-values",
      title: t("Propositions and truth values", "命题与真假值"),
      explanation: t(
        "A proposition (or statement) is a declarative sentence that is either strictly True or strictly False, but not both. An open sentence containing free variables like '$x + 2 = 5$' is a predicate, not a proposition, until a specific value is assigned to $x$. Questions, commands, and paradoxes are not propositions. So decide in two steps: is the sentence a claim at all, and if it is, does its truth depend on an unknown? \"$3 + 4 = 8$\" is a claim about known numbers, so it is a proposition, and a false one.\n\n> **Watch out.** A false sentence is still a proposition: being a proposition means having a definite truth value, true or false. Only a sentence whose truth is undecided, or that claims nothing, fails to be one.",
        "命题（或陈述句）是一个具有确切真假值（或真或假，且不能既真又假）的陈述句。含有自由变量的句子（如“$x + 2 = 5$”）称为谓词，在为变量赋予具体值之前不是命题。疑问句、祈使句及悖论均不是命题。所以分两步判断：这个句子是否作出了断言；如果是，它的真假是否取决于未知数？“$3 + 4 = 8$”是关于已知数的断言，所以是命题，而且是假命题。\n\n> **注意。** 假的句子仍然是命题：是命题意味着有确定的真假值，或真或假。只有真假未定的句子，或者什么也没断言的句子，才不是命题。",
      ),
      generate(rng) {
        const a = rng.int(2, 15);
        const b = rng.int(2, 15);
        const sum = a + b;
        const type = rng.pick(["true_prop", "false_prop", "open_predicate", "command"] as const);
        const ask = (sentence: string, sentenceZh: string) =>
          t(
            `Determine whether the sentence is a proposition, and if so, determine its truth value:\n\n"${sentence}"`,
            `判断下列句子是否为命题；如果是命题，确定其真假值：\n\n“${sentenceZh}”`,
          );
        const isTrue = t("It is a proposition with truth value True", "是命题，真值为真（True）");
        const isFalse = t("It is a proposition with truth value False", "是命题，真值为假（False）");
        const open = t(
          "It is an open predicate (not a proposition) because its truth depends on $x$",
          "是开谓词（非命题），因为其真假取决于 $x$ 的取值",
        );
        const claim = ["It is a declarative sentence: it asserts something.", "它是陈述句：它断言了某件事。"] as const;
        if (type === "true_prop") {
          return explained(
            rng,
            ask(`The integer $${a * 2}$ is an even number.`, `整数 $${a * 2}$ 是偶数。`),
            isTrue,
            [
              [isFalse, `$${a * 2} = 2 \\cdot ${a}$ is even, so the claim is true.`, `$${a * 2} = 2 \\cdot ${a}$ 是偶数，所以断言为真。`],
              [
                t("It is an open predicate with no definite truth value", "是开谓词，没有确定的真假值"),
                "There is no unknown in the sentence: it speaks about one fixed integer.",
                "句子中没有未知数：它说的是一个确定的整数。",
              ],
              [
                t("It is not a declarative sentence", "不是陈述句"),
                "It asserts a fact; it is not a question or a command.",
                "它断言了一个事实，不是疑问句或祈使句。",
              ],
            ],
            walked(
              [
                [["Is it a claim?", "它是断言吗？"], t(...claim)],
                [
                  ["Decide its truth", "判断真假"],
                  t(
                    `It is about the fixed integer $${a * 2}$, with no unknown, so it is a proposition.`,
                    `它说的是确定的整数 $${a * 2}$，没有未知数，所以是命题。`,
                  ),
                ],
              ],
              t(
                `$${a * 2} = 2 \\cdot ${a}$, so $${a * 2}$ is even and the proposition is True.`,
                `$${a * 2} = 2 \\cdot ${a}$，所以 $${a * 2}$ 是偶数，命题为真。`,
              ),
            ),
          );
        }
        if (type === "false_prop") {
          const falseSum = sum + rng.pick([-2, -1, 1, 2]);
          return explained(
            rng,
            ask(`$${a} + ${b} = ${falseSum}$`, `$${a} + ${b} = ${falseSum}$`),
            isFalse,
            [
              [
                isTrue,
                `$${a} + ${b} = ${sum}$, not $${falseSum}$, so the claim is false.`,
                `$${a} + ${b} = ${sum}$，不是 $${falseSum}$，所以断言为假。`,
              ],
              [
                t("It is an open predicate with no definite truth value", "是开谓词，没有确定的真假值"),
                "Every number in it is known, so its truth is decided.",
                "其中每个数都是已知的，所以真假是确定的。",
              ],
              [
                t("It is a meaningless expression", "是无意义的表达式"),
                "Adding two integers always gives a number, so the sentence has a clear meaning.",
                "两个整数相加总得到一个数，所以句子的意思是明确的。",
              ],
            ],
            walked(
              [
                [
                  ["Is it a claim?", "它是断言吗？"],
                  t(
                    `It asserts that $${a} + ${b}$ equals $${falseSum}$, about known numbers only, so it is a proposition.`,
                    `它断言 $${a} + ${b}$ 等于 $${falseSum}$，只涉及已知数，所以是命题。`,
                  ),
                ],
                [
                  ["Decide its truth", "判断真假"],
                  t(`$${a} + ${b} = ${sum} \\neq ${falseSum}$, so it is False.`, `$${a} + ${b} = ${sum} \\neq ${falseSum}$，所以为假。`),
                ],
              ],
              t(
                `$${sum} - ${falseSum} = ${sum - falseSum} \\ne 0$, so the two sides differ.`,
                `$${sum} - ${falseSum} = ${sum - falseSum} \\ne 0$，所以两边不相等。`,
              ),
            ),
          );
        }
        if (type === "open_predicate") {
          return explained(
            rng,
            ask(`$x + ${a} > ${a + b}$ for unknown $x$`, `对未知数 $x$ 有 $x + ${a} > ${a + b}$`),
            open,
            [
              [
                isTrue,
                `It fails for $x = 0$: $0 + ${a} = ${a}$ is not greater than $${a + b}$.`,
                `$x = 0$ 时不成立：$0 + ${a} = ${a}$ 不大于 $${a + b}$。`,
              ],
              [
                isFalse,
                `It holds for $x = ${b + 1}$: $${b + 1} + ${a} = ${a + b + 1} > ${a + b}$.`,
                `$x = ${b + 1}$ 时成立：$${b + 1} + ${a} = ${a + b + 1} > ${a + b}$。`,
              ],
              [
                t("It is a tautology", "是恒真式"),
                `A tautology is true for every $x$, but $x = 0$ makes it false.`,
                `恒真式对每个 $x$ 都为真，但 $x = 0$ 使它为假。`,
              ],
            ],
            walked(
              [
                [
                  ["Is it a claim?", "它是断言吗？"],
                  t("It has the form of a claim, but it contains the free variable $x$.", "它有断言的形式，但含有自由变量 $x$。"),
                ],
                [
                  ["Decide its truth", "判断真假"],
                  t(
                    `It is true when $x > ${b}$ and false otherwise, so it has no single truth value: it is an open predicate.`,
                    `当 $x > ${b}$ 时为真，否则为假，所以没有唯一的真假值：它是开谓词。`,
                  ),
                ],
              ],
              t(
                `$x = ${b + 1}$ gives $${a + b + 1} > ${a + b}$, true, while $x = 0$ gives $${a} > ${a + b}$, false.`,
                `$x = ${b + 1}$ 时 $${a + b + 1} > ${a + b}$，为真；$x = 0$ 时 $${a} > ${a + b}$，为假。`,
              ),
            ),
          );
        }
        return explained(
          rng,
          ask(`Solve the linear equation $2x + ${a} = ${b}$.`, `求解一元一次方程 $2x + ${a} = ${b}$。`),
          t("It is not a proposition because it is an imperative sentence (command)", "不是命题，因为它是祈使句（指令）"),
          [
            [isTrue, "A command asserts nothing, so it is neither true nor false.", "指令什么也没断言，所以既不真也不假。"],
            [isFalse, "A command asserts nothing, so it is neither true nor false.", "指令什么也没断言，所以既不真也不假。"],
            [
              t("It is a predicate with a free variable", "是含自由变量的谓词"),
              "The sentence mentions $x$, but it gives an instruction rather than making a claim about $x$.",
              "句子提到了 $x$，但它是在下指令，而不是对 $x$ 作出断言。",
            ],
          ],
          walked(
            [
              [
                ["Is it a claim?", "它是断言吗？"],
                t('"Solve …" is an instruction to do something, not a claim.', "“求解……”是要求做某件事的指令，不是断言。"),
              ],
              [
                ["Conclude", "得出结论"],
                t(
                  "A sentence that claims nothing has no truth value, so it is not a proposition.",
                  "不作断言的句子没有真假值，所以不是命题。",
                ),
              ],
            ],
            t(
              `Asking "is it true?" makes no sense for "Solve $2x + ${a} = ${b}$", which confirms that it is a command.`,
              `对“求解 $2x + ${a} = ${b}$”问“它真吗？”没有意义，这证实了它是一条指令。`,
            ),
          ),
        );
      },
    },
    {
      id: "predicates-and-quantifiers",
      title: t("Predicates and quantifiers", "谓词与量词"),
      explanation: t(
        "Quantifiers bind variables in a predicate to form propositions: the universal quantifier $\\forall$ means 'for all' / 'for every', and the existential quantifier $\\exists$ means 'there exists' / 'for at least one'. A statement $\\forall x \\in S, P(x)$ is false if there exists even a single counterexample. A statement $\\exists x \\in S, P(x)$ is true if at least one example satisfies $P(x)$. For example, $\\forall x \\in \\mathbb{R},\\ x^2 \\ge 1$ is false, since $x = 0$ gives $0 \\ge 1$, while $\\exists x \\in \\mathbb{R},\\ x^2 \\ge 1$ is true, since $x = 1$ works.\n\n> **Watch out.** The set after the quantifier matters. $2x = 5$ has the solution $x = \\frac{5}{2}$, so $\\exists x \\in \\mathbb{Q},\\ 2x = 5$ is true, but $\\exists x \\in \\mathbb{Z},\\ 2x = 5$ is false, because that solution is not an integer.",
        "量词通过约束谓词中的变量将其转化为命题：全称量词 $\\forall$ 表示“对所有/任意”，存在量词 $\\exists$ 表示“存在/至少有一个”。命题 $\\forall x \\in S, P(x)$ 只要存在一个反例即为假；命题 $\\exists x \\in S, P(x)$ 只要存在至少一个满足条件的特例即为真。例如，$\\forall x \\in \\mathbb{R},\\ x^2 \\ge 1$ 为假，因为 $x = 0$ 给出 $0 \\ge 1$；而 $\\exists x \\in \\mathbb{R},\\ x^2 \\ge 1$ 为真，因为 $x = 1$ 满足。\n\n> **注意。** 量词后面的集合很重要。$2x = 5$ 有解 $x = \\frac{5}{2}$，所以 $\\exists x \\in \\mathbb{Q},\\ 2x = 5$ 为真；但 $\\exists x \\in \\mathbb{Z},\\ 2x = 5$ 为假，因为这个解不是整数。",
      ),
      generate(rng) {
        const k = rng.int(2, 20);
        const pattern = rng.pick([0, 1, 2, 3]);
        const ask = (statement: string) =>
          t(`Evaluate the truth value of the quantified statement:\n\n$$${statement}$$`, `判断下列量化命题的真假值：\n\n$$${statement}$$`);
        const notOpen = [
          "The variable is bound by the quantifier, so the statement is a proposition.",
          "变量已被量词约束，所以这个陈述是命题。",
        ] as const;
        if (pattern === 0) {
          return explained(
            rng,
            ask(`\\forall x \\in \\mathbb{R}, \\; x^2 + ${k} > 0`),
            t(
              `True, because $x^2 \\ge 0$ for all real $x$, so $x^2 + ${k} \\ge ${k} > 0$`,
              `真，因为对所有实数 $x$ 都有 $x^2 \\ge 0$，故 $x^2 + ${k} \\ge ${k} > 0$`,
            ),
            [
              [
                t("False, $x = 0$ is a counterexample", "假，$x = 0$ 是一个反例"),
                `$x = 0$ gives $0 + ${k} = ${k} > 0$, so it is not a counterexample.`,
                `$x = 0$ 给出 $0 + ${k} = ${k} > 0$，所以不是反例。`,
              ],
              [
                t("False, negative values of $x$ make $x^2 < 0$", "假，负数 $x$ 会导致 $x^2 < 0$"),
                "The square of a negative number is positive: $(-2)^2 = 4$.",
                "负数的平方是正数：$(-2)^2 = 4$。",
              ],
              [t("False, the statement is open and not a proposition", "假，该陈述是开语句不是命题"), ...notOpen],
            ],
            walked(
              [
                [
                  ["Read the quantifier", "读量词"],
                  t(
                    "$\\forall$ asks whether the inequality holds for every real $x$; one counterexample would make it false.",
                    "$\\forall$ 问的是不等式是否对每个实数 $x$ 都成立；一个反例就能使它为假。",
                  ),
                ],
                [
                  ["Bound the expression", "估计表达式"],
                  t(
                    `Every real square satisfies $x^2 \\ge 0$, so $x^2 + ${k} \\ge ${k} > 0$ for all $x$: True.`,
                    `每个实数的平方都满足 $x^2 \\ge 0$，所以对所有 $x$ 都有 $x^2 + ${k} \\ge ${k} > 0$：为真。`,
                  ),
                ],
              ],
              t(`The smallest value, at $x = 0$, is $${k}$, which is still positive.`, `最小值在 $x = 0$ 处取得，为 $${k}$，仍是正数。`),
            ),
          );
        }
        if (pattern === 1) {
          return explained(
            rng,
            ask(`\\forall x \\in \\mathbb{R}, \\; x^2 > ${k}`),
            t(`False, because $x = 0$ provides a counterexample ($0 \\ngtr ${k}$)`, `假，因为 $x = 0$ 是一个反例（$0 \\ngtr ${k}$）`),
            [
              [
                t("True, because squaring makes numbers large", "真，因为平方会使数变大"),
                `Squaring makes small numbers smaller: $0^2 = 0$, which is not greater than $${k}$.`,
                `平方会使小的数更小：$0^2 = 0$，不大于 $${k}$。`,
              ],
              [
                t("True, because real numbers include arbitrarily large values", "真，因为实数包含任意大的值"),
                "Large values show that some $x$ works, but $\\forall$ needs every $x$ to work.",
                "大的值只说明有些 $x$ 满足，而 $\\forall$ 要求每个 $x$ 都满足。",
              ],
              [
                t("False, because $x^2$ is always negative for negative $x$", "假，因为负数的平方仍为负"),
                "The verdict is right, but the reason is not: a negative number has a positive square.",
                "结论对，但理由不对：负数的平方是正数。",
              ],
            ],
            walked(
              [
                [
                  ["Read the quantifier", "读量词"],
                  t(
                    "$\\forall$ needs the inequality for every real $x$, so one counterexample settles it.",
                    "$\\forall$ 要求不等式对每个实数 $x$ 都成立，所以一个反例就能定论。",
                  ),
                ],
                [
                  ["Find a counterexample", "找反例"],
                  t(
                    `$x = 0$ gives $0^2 = 0 \\ngtr ${k}$, so the statement is False.`,
                    `$x = 0$ 给出 $0^2 = 0 \\ngtr ${k}$，所以命题为假。`,
                  ),
                ],
              ],
              t(`$0$ is a real number and $0 < ${k}$, so the counterexample is valid.`, `$0$ 是实数，且 $0 < ${k}$，所以这个反例成立。`),
            ),
          );
        }
        if (pattern === 2) {
          return explained(
            rng,
            ask(`\\exists x \\in \\mathbb{Z}, \\; 2x = ${2 * k + 1}`),
            t(
              `False, because $2x$ is always even while $${2 * k + 1}$ is odd`,
              `假，因为对任意整数 $x$，$2x$ 恒为偶数，而 $${2 * k + 1}$ 是奇数`,
            ),
            [
              [
                t(`True, $x = ${2 * k + 1}/2$ is an integer`, `真，$x = ${2 * k + 1}/2$ 是整数`),
                `$\\frac{${2 * k + 1}}{2} = ${k}.5$ lies between $${k}$ and $${k + 1}$, so it is not an integer.`,
                `$\\frac{${2 * k + 1}}{2} = ${k}.5$ 位于 $${k}$ 与 $${k + 1}$ 之间，不是整数。`,
              ],
              [
                t("True, by choosing sufficiently large $x$", "真，只需选取足够大的 $x$"),
                `Large $x$ makes $2x$ large, but never odd: $2x$ skips $${2 * k + 1}$.`,
                `$x$ 大时 $2x$ 也大，但永远不是奇数：$2x$ 会跳过 $${2 * k + 1}$。`,
              ],
              [
                t("False, because there are infinitely many solutions in $\\mathbb{R}$", "假，因为在实数集内有无穷多解"),
                `$2x = ${2 * k + 1}$ has exactly one real solution, and in any case real solutions would not decide a question about integers.`,
                `$2x = ${2 * k + 1}$ 恰有一个实数解，而且实数解本来也决定不了关于整数的问题。`,
              ],
            ],
            walked(
              [
                [
                  ["Read the quantifier", "读量词"],
                  t("$\\exists$ needs a single integer that satisfies the equation.", "$\\exists$ 只需要一个满足方程的整数。"),
                ],
                [
                  ["Solve and test", "求解并检验"],
                  t(
                    `The only solution is $x = \\frac{${2 * k + 1}}{2}$, which is not an integer, so no integer works: False.`,
                    `唯一的解是 $x = \\frac{${2 * k + 1}}{2}$，它不是整数，所以没有整数满足：为假。`,
                  ),
                ],
              ],
              t(
                `$2 \\cdot ${k} = ${2 * k}$ and $2 \\cdot ${k + 1} = ${2 * k + 2}$, so $${2 * k + 1}$ falls between two consecutive values of $2x$.`,
                `$2 \\cdot ${k} = ${2 * k}$，$2 \\cdot ${k + 1} = ${2 * k + 2}$，所以 $${2 * k + 1}$ 落在 $2x$ 的两个相邻值之间。`,
              ),
            ),
          );
        }
        return explained(
          rng,
          ask(`\\exists x \\in \\mathbb{Q}, \\; x^2 = ${k * k}`),
          t(
            `True, because $x = ${k} \\in \\mathbb{Q}$ satisfies $${k}^2 = ${k * k}$`,
            `真，因为 $x = ${k} \\in \\mathbb{Q}$ 满足 $${k}^2 = ${k * k}$`,
          ),
          [
            [
              t("False, no rational numbers can be squared", "假，有理数不能进行平方"),
              "Any number can be squared; the square of a rational number is rational.",
              "任何数都能平方；有理数的平方是有理数。",
            ],
            [
              t(`False, $x^2 = ${k * k}$ has only irrational solutions`, `假，$x^2 = ${k * k}$ 只有无理数解`),
              `$${k * k}$ is a perfect square, so its square roots $\\pm ${k}$ are integers.`,
              `$${k * k}$ 是完全平方数，所以它的平方根 $\\pm ${k}$ 是整数。`,
            ],
            [
              t("False, the statement must hold for all $x$", "假，该陈述必须对所有 $x$ 成立"),
              "$\\exists$ needs only one $x$, not all of them.",
              "$\\exists$ 只需要一个 $x$，而不是全部。",
            ],
          ],
          walked(
            [
              [
                ["Read the quantifier", "读量词"],
                t("$\\exists$ needs one rational number with the property.", "$\\exists$ 只需要一个具有这个性质的有理数。"),
              ],
              [
                ["Give an example", "举出例子"],
                t(
                  `$x = ${k}$ is an integer, so $${k} = \\frac{${k}}{1} \\in \\mathbb{Q}$, and it satisfies the equation: True.`,
                  `$x = ${k}$ 是整数，所以 $${k} = \\frac{${k}}{1} \\in \\mathbb{Q}$，且满足方程：为真。`,
                ),
              ],
            ],
            t(`$${k}^2 = ${k} \\cdot ${k} = ${k * k}$.`, `$${k}^2 = ${k} \\cdot ${k} = ${k * k}$。`),
          ),
        );
      },
    },
  ],
};

// ─── 1.1.3 Equivalent Sets ───────────────────────────────────────────────────

export const equivalentSets: TopicDef = {
  id: "equivalent-sets",
  title: t("Equivalent Sets", "等价集合与外延公理"),
  summary: t("Apply the axiom of extensionality to determine when two sets are equal.", "应用外延公理判断两个集合何时完全相等。"),
  intro: t(
    "Are $A = \\{1, 2, 3\\}$ and $B = \\{3, 1, 2, 2\\}$ the same set? They are written differently: $B$ lists its elements in another order and lists $2$ twice. But each element of $A$ is in $B$, and each element of $B$ is in $A$, so they are the same set.\n\nCheck: removing the repeated $2$ and sorting $B$ gives $\\{1, 2, 3\\}$, which is exactly how $A$ is written.\n\nIn this lesson we decide whether two sets are equal by comparing their elements, and find the elements of a set given by an equation.",
    "$A = \\{1, 2, 3\\}$ 与 $B = \\{3, 1, 2, 2\\}$ 是同一个集合吗？它们的写法不同：$B$ 换了列举的顺序，还把 $2$ 列了两次。但 $A$ 的每个元素都在 $B$ 中，$B$ 的每个元素也都在 $A$ 中，所以它们是同一个集合。\n\n检验：去掉 $B$ 中重复的 $2$ 并排序，得到 $\\{1, 2, 3\\}$，正是 $A$ 的写法。\n\n本课我们通过比较元素判断两个集合是否相等，并求出由方程给出的集合的元素。",
  ),
  prerequisites: ["special-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "axiom-of-extensionality",
      title: t("Axiom of extensionality", "外延公理与集合相等"),
      explanation: t(
        "The Axiom of Extensionality states that two sets $A$ and $B$ are equal if and only if they have exactly the same elements: $A = B \\iff \\forall x (x \\in A \\iff x \\in B)$. Consequently, the order in which elements are listed and repetition of elements do not affect set identity. To test equality, check both directions: every element of $A$ must be in $B$, and every element of $B$ must be in $A$.\n\n> **Watch out.** Checking one direction is not enough. Every element of $\\{1, 2\\}$ is in $\\{1, 2, 3\\}$, yet the sets are not equal, because $3$ is in the second set and not in the first.",
        "外延公理指出，两个集合 $A$ 与 $B$ 相等当且仅当它们包含完全相同的元素：$A = B \\iff \\forall x (x \\in A \\iff x \\in B)$。因此，元素的排列顺序和重复出现均不影响集合的同一性。判断相等要检查两个方向：$A$ 的每个元素都在 $B$ 中，$B$ 的每个元素也都在 $A$ 中。\n\n> **注意。** 只检查一个方向是不够的。$\\{1, 2\\}$ 的每个元素都在 $\\{1, 2, 3\\}$ 中，但两个集合并不相等，因为 $3$ 在第二个集合中而不在第一个集合中。",
      ),
      generate(rng) {
        const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const selected = rng.sample(pool, 3).sort((a, b) => a - b);
        const a = selected[0] ?? 1;
        const b = selected[1] ?? 2;
        const c = selected[2] ?? 3;
        const shuffled = rng.shuffle([a, b, c]);
        const setAStr = `\\{${a}, ${b}, ${c}\\}`;
        const setBStr = `\\{${shuffled.join(", ")}\\}`;
        const extra = rng.pick([16, 17, 18, 19, 20]);
        const option = (s: string) => t(`$${s}$`, `$${s}$`);
        return explained(
          rng,
          t(
            `According to the Axiom of Extensionality, which set is equal to $A = ${setAStr}$?`,
            `根据外延公理，下列哪个集合与集合 $A = ${setAStr}$ 相等？`,
          ),
          option(setBStr),
          [
            [
              option(`\\{${a}, ${b}\\}`),
              `The element $${c}$ of $A$ is missing, so the two sets do not have the same elements.`,
              `缺少 $A$ 的元素 $${c}$，所以两个集合的元素不相同。`,
            ],
            [
              option(`\\{${a}, ${b}, ${c}, ${extra}\\}`),
              `Every element of $A$ is there, but the extra element $${extra}$ is not in $A$: the other direction fails.`,
              `$A$ 的元素都在其中，但多出的元素 $${extra}$ 不在 $A$ 中：另一个方向不成立。`,
            ],
            [
              option(`\\{${a + 1}, ${b + 1}, ${c + 1}\\}`),
              `The element $${c + 1}$ is not in $A$: equal sets have exactly the same elements, not elements shifted by one.`,
              `元素 $${c + 1}$ 不在 $A$ 中：相等的集合元素完全相同，而不是各加 $1$。`,
            ],
          ],
          walked(
            [
              [
                ["Compare the elements", "比较元素"],
                t(
                  `$${setBStr}$ contains $${a}$, $${b}$ and $${c}$, and nothing else.`,
                  `$${setBStr}$ 含有 $${a}$、$${b}$、$${c}$，没有别的元素。`,
                ),
              ],
              [
                ["Apply extensionality", "应用外延公理"],
                t(
                  `It has exactly the elements of $A$, only listed in another order, and order does not matter, so $${setBStr} = A$.`,
                  `它的元素恰好是 $A$ 的元素，只是列举顺序不同，而顺序无关紧要，所以 $${setBStr} = A$。`,
                ),
              ],
            ],
            t(
              `Sorting $${setBStr}$ gives $${setAStr}$, which is how $A$ is written.`,
              `把 $${setBStr}$ 排序得到 $${setAStr}$，正是 $A$ 的写法。`,
            ),
          ),
        );
      },
    },
    {
      id: "determining-set-equality",
      title: t("Determining set equality", "判断集合相等"),
      explanation: t(
        "To verify whether two sets given in different forms are equal, solve for the elements of each set. For instance, $\\{x \\in \\mathbb{R} \\mid x^2 = a^2\\} = \\{-a, a\\}$. If every element of $A$ belongs to $B$ and every element of $B$ belongs to $A$, then $A = B$. For a set defined by a quadratic equation, factor it: the set $\\{x \\in \\mathbb{R} \\mid (x - 2)(x - 5) = 0\\}$ is $\\{2, 5\\}$.\n\n> **Watch out.** A factor $x - p$ is zero when $x = p$, not when $x = -p$. The roots of $(x - 2)(x - 5) = 0$ are $2$ and $5$; the numbers $-2$ and $-5$ make neither factor zero.",
        "要验证不同描述形式给出的两个集合是否相等，需分别求解或列出各集合的全部元素。例如 $\\{x \\in \\mathbb{R} \\mid x^2 = a^2\\} = \\{-a, a\\}$。若 $A$ 的每个元素均属于 $B$ 且 $B$ 的每个元素均属于 $A$，则 $A = B$。对由二次方程定义的集合，先因式分解：集合 $\\{x \\in \\mathbb{R} \\mid (x - 2)(x - 5) = 0\\}$ 就是 $\\{2, 5\\}$。\n\n> **注意。** 因式 $x - p$ 在 $x = p$ 时为零，而不是在 $x = -p$ 时。$(x - 2)(x - 5) = 0$ 的根是 $2$ 和 $5$；$-2$ 和 $-5$ 不能使任何一个因式为零。",
      ),
      generate(rng) {
        const p = rng.int(2, 14);
        const q = p + rng.int(1, 6);
        const sum = p + q;
        const prod = p * q;
        const polyStr = poly([1, "x^2"], [-sum, "x"], [prod, ""]);
        return solutionsProblem({
          prompt: t(
            `Find all elements of the set $S = \\{x \\in \\mathbb{R} \\mid ${polyStr} = 0\\}$.`,
            `求集合 $S = \\{x \\in \\mathbb{R} \\mid ${polyStr} = 0\\}$ 的全部元素。`,
          ),
          values: [String(p), String(q)],
          variable: "x",
          solution: walked(
            [
              [
                ["Factor", "因式分解"],
                t(
                  `Look for two numbers with sum $${sum}$ and product $${prod}$: they are $${p}$ and $${q}$.`,
                  `找和为 $${sum}$、积为 $${prod}$ 的两个数：它们是 $${p}$ 和 $${q}$。`,
                ),
                [`${polyStr} = (x - ${p})(x - ${q})`],
              ],
              [
                ["Set each factor to zero", "令每个因式为零"],
                t(
                  `$x - ${p} = 0$ gives $x = ${p}$ and $x - ${q} = 0$ gives $x = ${q}$, so $S = \\{${p}, ${q}\\}$.`,
                  `$x - ${p} = 0$ 得 $x = ${p}$，$x - ${q} = 0$ 得 $x = ${q}$，所以 $S = \\{${p}, ${q}\\}$。`,
                ),
              ],
            ],
            t(
              `$${p}^2 - ${sum} \\cdot ${p} + ${prod} = ${p * p} - ${sum * p} + ${prod} = 0$, and likewise $${q * q} - ${sum * q} + ${prod} = 0$.`,
              `$${p}^2 - ${sum} \\cdot ${p} + ${prod} = ${p * p} - ${sum * p} + ${prod} = 0$，同样 $${q * q} - ${sum * q} + ${prod} = 0$。`,
            ),
          ),
          mistakes: [
            whySet(
              [String(-p), String(-q)],
              "The signs are flipped: $x - p = 0$ gives $x = p$. Substitute your values into the equation to see that they fail.",
              "符号反了：$x - p = 0$ 得 $x = p$。把你的值代入方程，可以看到它们不满足。",
            ),
            whySet(
              [String(p)],
              "That is only one element; the equation has a second root. Find the other factor.",
              "这只是一个元素；方程还有第二个根。找出另一个因式。",
            ),
            whySet(
              [String(q)],
              "That is only one element; the equation has a second root. Find the other factor.",
              "这只是一个元素；方程还有第二个根。找出另一个因式。",
            ),
            whySet(
              [String(sum), String(prod)],
              "These are the sum and the product of the roots, read off the coefficients, not the roots themselves.",
              "这是从系数读出的两根之和与两根之积，不是根本身。",
            ),
          ],
        });
      },
    },
  ],
};

// ─── 1.1.4 The Constructive Definition of a Set ──────────────────────────────

export const theConstructiveDefinitionOfASet: TopicDef = {
  id: "the-constructive-definition-of-a-set",
  title: t("The Constructive Definition of a Set", "集合的列举表示法"),
  summary: t(
    "Represent sets using roster notation, understanding that element order and duplicates do not affect identity.",
    "用列举法表示集合，理解元素顺序与重复项不改变集合同一性。",
  ),
  intro: t(
    "The equation $(x - 1)(x + 2) = 0$ holds when $x - 1 = 0$ or $x + 2 = 0$, that is, when $x = 1$ or $x = -2$. Listing these solutions in braces gives its solution set $\\{1, -2\\}$. Writing $\\{-2, 1\\}$ or $\\{1, -2, 1\\}$ describes the same set.\n\nCheck: $(1 - 1)(1 + 2) = 0$ and $(-2 - 1)(-2 + 2) = 0$.\n\nIn this lesson we write sets by listing their elements, and see why order and repetition in such a list do not matter.",
    "方程 $(x - 1)(x + 2) = 0$ 在 $x - 1 = 0$ 或 $x + 2 = 0$ 时成立，即 $x = 1$ 或 $x = -2$。把这些解列在花括号中，得到解集 $\\{1, -2\\}$。写成 $\\{-2, 1\\}$ 或 $\\{1, -2, 1\\}$ 表示的是同一个集合。\n\n检验：$(1 - 1)(1 + 2) = 0$，$(-2 - 1)(-2 + 2) = 0$。\n\n本课我们通过列举元素写出集合，并理解为什么列举中的顺序与重复无关紧要。",
  ),
  prerequisites: ["special-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "roster-notation-and-order",
      title: t("Roster notation and order", "列举法与无序性"),
      explanation: t(
        "The constructive (roster) method defines a set by explicitly listing all of its elements enclosed in braces $\\{ \\}$, separated by commas. The ordering of elements within the braces is irrelevant: $\\{1, 2, 3\\} = \\{3, 1, 2\\}$. To list the solution set of a factored equation, set each factor to zero: $(x + 4)(x - 3) = 0$ has the solution set $\\{-4, 3\\}$.\n\n> **Watch out.** Read each root from its factor with care: $x + 4 = 0$ gives $x = -4$, and $x - 3 = 0$ gives $x = 3$. The number in the factor appears in the root with the opposite sign.",
        "集合的构造性（列举）表示法通过在花括号 $\\{ \\}$ 中用逗号分隔显式列出所有元素。集合中元素的排列次序是无关紧要的，例如 $\\{1, 2, 3\\} = \\{3, 1, 2\\}$。要列出已分解方程的解集，令每个因式为零：$(x + 4)(x - 3) = 0$ 的解集是 $\\{-4, 3\\}$。\n\n> **注意。** 从每个因式读出根时要仔细：$x + 4 = 0$ 得 $x = -4$，$x - 3 = 0$ 得 $x = 3$。因式中的数在根中符号相反。",
      ),
      generate(rng) {
        const r1 = rng.int(-9, -1);
        const r2 = rng.int(1, 6);
        const r3 = rng.int(7, 14);
        const eqStr = `${factorLatex(r1)}${factorLatex(r2)}${factorLatex(r3)} = 0`;
        return solutionsProblem({
          prompt: t(`Find all elements of the solution set of the equation $${eqStr}$.`, `求方程 $${eqStr}$ 解集的全部元素。`),
          values: [String(r1), String(r2), String(r3)],
          variable: "x",
          solution: walked(
            [
              [
                ["Set each factor to zero", "令每个因式为零"],
                t("A product is zero exactly when one of its factors is zero:", "乘积为零当且仅当某个因式为零："),
                [
                  `${factorLatex(r1).slice(1, -1)} = 0 \\Rightarrow x = ${r1}`,
                  `${factorLatex(r2).slice(1, -1)} = 0 \\Rightarrow x = ${r2}`,
                  `${factorLatex(r3).slice(1, -1)} = 0 \\Rightarrow x = ${r3}`,
                ],
              ],
              [
                ["List the solutions", "列出解"],
                t(
                  `In roster notation, the solution set is $\\{${r1}, ${r2}, ${r3}\\}$.`,
                  `用列举法表示，解集为 $\\{${r1}, ${r2}, ${r3}\\}$。`,
                ),
              ],
            ],
            t(
              `At $x = ${r1}$ the first factor is $${r1} + ${-r1} = 0$, so the product is $0$; the other two roots each make their own factor zero in the same way.`,
              `$x = ${r1}$ 时第一个因式为 $${r1} + ${-r1} = 0$，所以乘积为 $0$；另外两个根同样各使自己的因式为零。`,
            ),
          ),
          mistakes: [
            whySet(
              [String(-r1), String(-r2), String(-r3)],
              "The signs are flipped: a factor $x - r$ is zero at $x = r$. Substitute your values: each root must make its own factor zero.",
              "符号反了：因式 $x - r$ 在 $x = r$ 时为零。代入你的值：每个根都必须使它自己的因式为零。",
            ),
            whySet(
              [String(r1), String(r2)],
              "There are three factors, so there are three solutions; one is missing.",
              "有三个因式，所以有三个解；漏了一个。",
            ),
            whySet(
              [String(r2), String(r3)],
              "There are three factors, so there are three solutions; one is missing.",
              "有三个因式，所以有三个解；漏了一个。",
            ),
            whySet(
              [String(r1), String(-r2), String(-r3)],
              "Only one root has the right sign: read each root as the number that makes its own factor zero.",
              "只有一个根的符号是对的：每个根都应是使它所在因式为零的数。",
            ),
          ].filter((m) => new Set(m.values).size === m.values.length),
        });
      },
    },
    {
      id: "uniqueness-of-elements-in-roster",
      title: t("Uniqueness of elements in roster notation", "列举法中元素的互异性"),
      explanation: t(
        "A fundamental property of sets is that elements are distinct: listing an element more than once does not create extra elements. For example, $\\{2, 3, 3, 5, 5, 5\\} = \\{2, 3, 5\\}$, and its cardinality is 3. To find the distinct elements, go through the list and keep each value the first time it appears.\n\n> **Watch out.** The number of entries in a listing is not the number of elements. $\\{2, 3, 3, 5, 5, 5\\}$ has six entries but only three elements, and the entry count $6$ is not itself an element.",
        "集合的一个基本性质是元素的互异性：在列举法中重复列出某一元素并不会增加集合中的元素。例如 $\\{2, 3, 3, 5, 5, 5\\} = \\{2, 3, 5\\}$，其元素个数为 3。要找出互异元素，就依次查看列表，每个值只在第一次出现时保留。\n\n> **注意。** 列举中的项数不等于元素个数。$\\{2, 3, 3, 5, 5, 5\\}$ 有六项，但只有三个元素，而项数 $6$ 本身也不是元素。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const b = rng.int(6, 10);
        const c = rng.int(11, 15);
        const rawList = [a, b, b, c, c, c, a];
        const rawStr = `\\{${rawList.join(", ")}\\}`;
        return solutionsProblem({
          prompt: t(`List all distinct elements of the set $S = ${rawStr}$.`, `列出集合 $S = ${rawStr}$ 的所有互异元素。`),
          values: [String(a), String(b), String(c)],
          variable: "x",
          solution: walked(
            [
              [
                ["Go through the list", "依次查看列表"],
                t(
                  `Reading left to right, the new values are $${a}$, $${b}$ and $${c}$; every later entry repeats one of them.`,
                  `从左往右读，新出现的值是 $${a}$、$${b}$、$${c}$；之后的每一项都是它们的重复。`,
                ),
              ],
              [
                ["Keep each once", "每个只保留一次"],
                t(
                  `Repeated listings add nothing, so $S = \\{${a}, ${b}, ${c}\\}$.`,
                  `重复列出不增加元素，所以 $S = \\{${a}, ${b}, ${c}\\}$。`,
                ),
              ],
            ],
            t(
              `$${a}$ appears $2$ times, $${b}$ appears $2$ times and $${c}$ appears $3$ times: $2 + 2 + 3 = ${rawList.length}$ entries, which is all of them.`,
              `$${a}$ 出现 $2$ 次，$${b}$ 出现 $2$ 次，$${c}$ 出现 $3$ 次：$2 + 2 + 3 = ${rawList.length}$ 项，正是全部的项。`,
            ),
          ),
          mistakes: [
            whySet(
              [String(a), String(b)],
              `The value $${c}$ also appears in the listing, so it is an element too.`,
              `值 $${c}$ 也出现在列举中，所以它也是元素。`,
            ),
            whySet(
              [String(b), String(c)],
              `The value $${a}$ appears at both ends of the listing, so it is an element too.`,
              `值 $${a}$ 出现在列举的两端，所以它也是元素。`,
            ),
            ...(b === rawList.length
              ? []
              : [
                  whySet(
                    [String(a), String(b), String(c), String(rawList.length)],
                    `$${rawList.length}$ is the number of entries in the listing, not one of the entries.`,
                    `$${rawList.length}$ 是列举中的项数，不是其中的一项。`,
                  ),
                ]),
          ],
        });
      },
    },
  ],
};

// ─── 1.1.5 The Conditional Definition of a Set ───────────────────────────────

export const theConditionalDefinitionOfASet: TopicDef = {
  id: "the-conditional-definition-of-a-set",
  title: t("The Conditional Definition of a Set", "集合的描述法"),
  summary: t(
    "Understand set-builder notation {x in U | P(x)} and convert between roster and builder forms.",
    "理解集合的描述法 {x in U | P(x)}，并在列举法与描述法之间进行相互转换。",
  ),
  intro: t(
    "The set $\\{x \\in \\mathbb{Z} \\mid 1 \\le x \\le 10 \\text{ and } x \\text{ is a multiple of } 3\\}$ is described by a condition rather than a list. Going through the integers from $1$ to $10$ and keeping the multiples of $3$ gives $\\{3, 6, 9\\}$.\n\nCheck: the next multiples, $0$ and $12$, lie outside $1 \\le x \\le 10$, so nothing is missing.\n\nIn this lesson we read set-builder notation, and turn a condition into a list of elements.",
    "集合 $\\{x \\in \\mathbb{Z} \\mid 1 \\le x \\le 10 \\text{ 且 } x \\text{ 是 } 3 \\text{ 的倍数}\\}$ 是用条件而不是列表描述的。依次查看 $1$ 到 $10$ 的整数，保留 $3$ 的倍数，得到 $\\{3, 6, 9\\}$。\n\n检验：相邻的倍数 $0$ 和 $12$ 都不在 $1 \\le x \\le 10$ 内，所以没有遗漏。\n\n本课我们读懂描述法，并把条件转化为元素的列表。",
  ),
  prerequisites: ["the-constructive-definition-of-a-set"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "understanding-set-builder-notation",
      title: t("Understanding set-builder notation", "理解集合描述法"),
      explanation: t(
        "Set-builder notation specifies a set conditionally by a property that its members must satisfy: $\\{x \\in U \\mid P(x)\\}$ (read 'the set of all $x$ in $U$ such that $P(x)$ is true'). For example, $\\{x \\in \\mathbb{Z} \\mid 1 \\le x \\le 5\\} = \\{1, 2, 3, 4, 5\\}$. When the condition has several parts joined by \"and\", an element must satisfy every part.\n\n> **Watch out.** Zero and negative integers can be multiples too: $0 = 3 \\cdot 0$ and $-6 = 3 \\cdot (-2)$ are multiples of $3$. In $\\{x \\in \\mathbb{Z} \\mid -7 \\le x \\le 7 \\text{ and } x \\text{ is a multiple of } 3\\}$ the smallest element is $-6$, not $3$.",
        "集合描述法通过指定元素必须满足的条件或谓词来定义集合：$\\{x \\in U \\mid P(x)\\}$（读作“所有属于 $U$ 且使 $P(x)$ 成立的 $x$ 的集合”）。例如 $\\{x \\in \\mathbb{Z} \\mid 1 \\le x \\le 5\\} = \\{1, 2, 3, 4, 5\\}$。当条件由“且”连接的几部分组成时，元素必须满足每一部分。\n\n> **注意。** 零和负整数也可以是倍数：$0 = 3 \\cdot 0$，$-6 = 3 \\cdot (-2)$ 都是 $3$ 的倍数。在 $\\{x \\in \\mathbb{Z} \\mid -7 \\le x \\le 7 \\text{ 且 } x \\text{ 是 } 3 \\text{ 的倍数}\\}$ 中，最小的元素是 $-6$，而不是 $3$。",
      ),
      generate(rng) {
        const m = rng.int(2, 5);
        const lo = rng.int(-5, 0);
        const hi = lo + rng.int(10, 18);
        const validValues: number[] = [];
        for (let x = lo; x <= hi; x++) {
          if (x % m === 0) validValues.push(x);
        }
        const minValid = validValues[0]!;
        const mistakes = [
          why(
            minValid + m,
            `$${minValid}$ is also a multiple of $${m}$ in the range, and it is smaller.`,
            `$${minValid}$ 也是范围内 $${m}$ 的倍数，而且更小。`,
          ),
          why(
            minValid - m,
            `$${minValid - m}$ is a multiple of $${m}$, but it is below $${lo}$, so it fails the first condition.`,
            `$${minValid - m}$ 是 $${m}$ 的倍数，但它小于 $${lo}$，不满足第一个条件。`,
          ),
          why(
            lo,
            `$${lo}$ is in the range, but it is not a multiple of $${m}$, so it fails the second condition.`,
            `$${lo}$ 在范围内，但它不是 $${m}$ 的倍数，不满足第二个条件。`,
          ),
          why(
            m,
            `Zero and negative multiples count: $${m} \\cdot k$ for any integer $k$ is a multiple of $${m}$.`,
            `零和负的倍数也算：对任意整数 $k$，$${m} \\cdot k$ 都是 $${m}$ 的倍数。`,
          ),
        ].filter((x, i, all) => all.findIndex((y) => y.value === x.value) === i);
        return numberProblem({
          prompt: t(
            `Find the smallest integer in the set $S = \\{x \\in \\mathbb{Z} \\mid ${lo} \\le x \\le ${hi} \\text{ and } x \\text{ is a multiple of } ${m}\\}$.`,
            `求集合 $S = \\{x \\in \\mathbb{Z} \\mid ${lo} \\le x \\le ${hi} \\text{ 且 } x \\text{ 是 } ${m} \\text{ 的倍数}\\}$ 中的最小整数。`,
          ),
          answer: minValid,
          solution: walked(
            [
              [
                ["Read the conditions", "读条件"],
                t(
                  `An integer $x$ belongs to $S$ when $${lo} \\le x \\le ${hi}$ and $x$ is a multiple of $${m}$.`,
                  `整数 $x$ 属于 $S$，当且仅当 $${lo} \\le x \\le ${hi}$ 且 $x$ 是 $${m}$ 的倍数。`,
                ),
              ],
              [
                ["List the members", "列出元素"],
                t(
                  `The multiples of $${m}$ in this range are $${validValues.join(", ")}$, so the smallest is $${minValid}$.`,
                  `此范围内 $${m}$ 的倍数为 $${validValues.join(", ")}$，所以最小的是 $${minValid}$。`,
                ),
              ],
            ],
            t(
              `$${minValid} = ${m} \\cdot (${minValid / m})$ is a multiple of $${m}$, and the multiple before it, $${minValid - m}$, is less than $${lo}$.`,
              `$${minValid} = ${m} \\cdot (${minValid / m})$ 是 $${m}$ 的倍数，而它前一个倍数 $${minValid - m}$ 小于 $${lo}$。`,
            ),
          ),
          mistakes,
        });
      },
    },
    {
      id: "converting-between-roster-and-builder",
      title: t("Converting between roster and builder forms", "描述法与列举法的转换"),
      explanation: t(
        "To convert a conditional description $\\{x \\in \\mathbb{Z} \\mid P(x)\\}$ to roster form, list all integers satisfying the predicate $P(x)$. Conversely, to convert a roster list to set-builder notation, identify the common arithmetic pattern or condition. For example, $\\{x \\in \\mathbb{Z} \\mid 4 \\le x \\le 12 \\text{ and } x \\text{ is a multiple of } 4\\} = \\{4, 8, 12\\}$.\n\n> **Watch out.** The sign $\\le$ includes the endpoint. In the example above both $4$ and $12$ satisfy the condition, so both belong; leaving out an endpoint loses an element.",
        "将描述法 $\\{x \\in \\mathbb{Z} \\mid P(x)\\}$ 转换为列举法时，逐一列出使谓词 $P(x)$ 成立的全部整数。反之，将列举法转换为描述法时，需识别其通项算术规律或特征性质。例如 $\\{x \\in \\mathbb{Z} \\mid 4 \\le x \\le 12 \\text{ 且 } x \\text{ 是 } 4 \\text{ 的倍数}\\} = \\{4, 8, 12\\}$。\n\n> **注意。** 符号 $\\le$ 包含端点。上例中 $4$ 和 $12$ 都满足条件，所以都属于这个集合；漏掉端点就少了一个元素。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        const d = rng.int(2, 6);
        const start = rng.int(1, 5);
        const elements: number[] = [];
        for (let i = start; i < start + n; i++) elements.push(i * d);
        const minVal = elements[0]!;
        const maxVal = elements[elements.length - 1]!;
        const fromD: number[] = [];
        for (let x = d; x <= maxVal; x += d) fromD.push(x);
        return solutionsProblem({
          prompt: t(
            `List all elements of the set $S = \\{x \\in \\mathbb{Z} \\mid ${minVal} \\le x \\le ${maxVal} \\text{ and } x \\text{ is a multiple of } ${d}\\}$.`,
            `列出集合 $S = \\{x \\in \\mathbb{Z} \\mid ${minVal} \\le x \\le ${maxVal} \\text{ 且 } x \\text{ 是 } ${d} \\text{ 的倍数}\\}$ 的全部元素。`,
          ),
          values: elements.map(String),
          variable: "x",
          solution: walked(
            [
              [
                ["Start at the lower end", "从下端开始"],
                t(
                  `$${minVal} = ${d} \\cdot ${start}$ is a multiple of $${d}$, and $\\le$ includes it.`,
                  `$${minVal} = ${d} \\cdot ${start}$ 是 $${d}$ 的倍数，而 $\\le$ 包含它。`,
                ),
              ],
              [
                ["Step by the divisor", "每次加上除数"],
                t(
                  `Adding $${d}$ each time up to $${maxVal}$ gives $${elements.join(", ")}$, so $S = \\{${elements.join(", ")}\\}$.`,
                  `每次加 $${d}$，直到 $${maxVal}$，得到 $${elements.join(", ")}$，所以 $S = \\{${elements.join(", ")}\\}$。`,
                ),
              ],
            ],
            t(
              `From $${d} \\cdot ${start}$ to $${d} \\cdot ${start + n - 1}$ there are $${start + n - 1} - ${start} + 1 = ${n}$ multiples, and the list has $${n}$ elements.`,
              `从 $${d} \\cdot ${start}$ 到 $${d} \\cdot ${start + n - 1}$ 共有 $${start + n - 1} - ${start} + 1 = ${n}$ 个倍数，列表恰有 $${n}$ 个元素。`,
            ),
          ),
          mistakes: [
            whySet(
              elements.slice(0, -1).map(String),
              `$${maxVal}$ is missing: $\\le$ includes the upper endpoint, and $${maxVal}$ is a multiple of $${d}$.`,
              `漏了 $${maxVal}$：$\\le$ 包含上端点，而 $${maxVal}$ 是 $${d}$ 的倍数。`,
            ),
            whySet(
              elements.slice(1).map(String),
              `$${minVal}$ is missing: $\\le$ includes the lower endpoint, and $${minVal}$ is a multiple of $${d}$.`,
              `漏了 $${minVal}$：$\\le$ 包含下端点，而 $${minVal}$ 是 $${d}$ 的倍数。`,
            ),
            ...(start > 1
              ? [
                  whySet(
                    fromD.map(String),
                    `Multiples below $${minVal}$ fail the condition $${minVal} \\le x$, so they do not belong.`,
                    `小于 $${minVal}$ 的倍数不满足 $${minVal} \\le x$，所以不属于 $S$。`,
                  ),
                ]
              : []),
          ],
        });
      },
    },
  ],
};

// ─── 1.1.6 Describing Sets Using Set-Builder Notation ────────────────────────

export const describingSetsUsingSetBuilderNotation: TopicDef = {
  id: "describing-sets-using-set-builder-notation",
  title: t("Describing Sets Using Set-Builder Notation", "用集合构建符表示集合"),
  summary: t(
    "Describe arithmetic progressions, residue classes, and real intervals using set-builder notation.",
    "用集合构建符描述等差数列形式的数集、同余类与实数区间。",
  ),
  intro: t(
    "The set $\\{3k + 1 \\mid k \\in \\mathbb{Z}\\}$ is built by a formula: each integer $k$ produces one element $3k + 1$. The values $k = -1, 0, 1, 2$ produce $-2, 1, 4, 7$, so the set is $\\{\\dots, -2, 1, 4, 7, \\dots\\}$, the integers that leave remainder $1$ on division by $3$.\n\nCheck: $7 - 1 = 6 = 3 \\cdot 2$, so $7$ does come from $k = 2$.\n\nIn this lesson we describe sets by a formula or by inequalities, including residue classes and intervals of real numbers.",
    "集合 $\\{3k + 1 \\mid k \\in \\mathbb{Z}\\}$ 是由公式构建的：每个整数 $k$ 产生一个元素 $3k + 1$。$k = -1, 0, 1, 2$ 产生 $-2, 1, 4, 7$，所以这个集合是 $\\{\\dots, -2, 1, 4, 7, \\dots\\}$，即除以 $3$ 余 $1$ 的整数。\n\n检验：$7 - 1 = 6 = 3 \\cdot 2$，所以 $7$ 确实来自 $k = 2$。\n\n本课我们用公式或不等式描述集合，包括同余类和实数区间。",
  ),
  prerequisites: ["the-conditional-definition-of-a-set"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "arithmetic-and-modular-sets",
      title: t("Arithmetic and modular sets", "算术生成集与同余集"),
      explanation: t(
        "Sets of integers with a regular step size can be defined using builder notation: $\\{m k + r \\mid k \\in \\mathbb{Z}\\}$, representing all integers congruent to $r$ modulo $m$. For instance, odd integers are $\\{2k + 1 \\mid k \\in \\mathbb{Z}\\}$. To find the element for a given $k$, multiply $k$ by $m$ first, then add $r$: in $\\{5k + 2 \\mid k \\in \\mathbb{Z}\\}$, $k = 3$ gives $5 \\cdot 3 + 2 = 17$.\n\n> **Watch out.** Multiply before adding. $5k + 2$ at $k = 3$ is $15 + 2 = 17$, not $5 \\cdot (3 + 2) = 25$; and the $+2$ is part of every element, so $15$ alone is not in the set.",
        "具有固定步长的整数集可以用集合构建符表示为 $\\{m k + r \\mid k \\in \\mathbb{Z}\\}$，表示模 $m$ 余 $r$ 的所有整数（同余类）。例如奇数集合为 $\\{2k + 1 \\mid k \\in \\mathbb{Z}\\}$。要求给定 $k$ 对应的元素，先把 $k$ 乘以 $m$，再加 $r$：在 $\\{5k + 2 \\mid k \\in \\mathbb{Z}\\}$ 中，$k = 3$ 给出 $5 \\cdot 3 + 2 = 17$。\n\n> **注意。** 先乘后加。$5k + 2$ 在 $k = 3$ 时是 $15 + 2 = 17$，不是 $5 \\cdot (3 + 2) = 25$；而且 $+2$ 属于每个元素，所以单独的 $15$ 不在这个集合中。",
      ),
      generate(rng) {
        const m = rng.int(3, 12);
        const r = rng.int(1, m - 1);
        const kVal = rng.int(1, 15);
        const rightVal = m * kVal + r;
        const mistakes = [
          why(
            m * kVal,
            `That is $${m} \\cdot ${kVal}$ without the $+${r}$; every element of the set includes the $+${r}$.`,
            `这是 $${m} \\cdot ${kVal}$，少了 $+${r}$；集合的每个元素都包含 $+${r}$。`,
          ),
          why(
            m * (kVal + r),
            `That adds $${r}$ to $k$ before multiplying; multiply $k$ by $${m}$ first, then add $${r}$.`,
            `这是先把 $${r}$ 加到 $k$ 上再乘；应先把 $k$ 乘以 $${m}$，再加 $${r}$。`,
          ),
          why(m + kVal + r, `$${m}k$ means $${m}$ times $k$, not $${m}$ plus $k$.`, `$${m}k$ 表示 $${m}$ 乘以 $k$，而不是 $${m}$ 加 $k$。`),
          why(
            r * kVal + m,
            `The roles are swapped: $k$ is multiplied by the step $${m}$, and the remainder $${r}$ is added.`,
            `角色弄反了：$k$ 应乘以步长 $${m}$，再加上余数 $${r}$。`,
          ),
        ].filter((x, i, all) => x.value !== rightVal && all.findIndex((y) => y.value === x.value) === i);
        return numberProblem({
          prompt: t(
            `Find the integer in the residue set $S = \\{${m}k + ${r} \\mid k \\in \\mathbb{Z}\\}$ corresponding to $k = ${kVal}$.`,
            `求同余集合 $S = \\{${m}k + ${r} \\mid k \\in \\mathbb{Z}\\}$ 中对应于 $k = ${kVal}$ 的整数。`,
          ),
          answer: rightVal,
          solution: walked(
            [
              [["Multiply by the step", "乘以步长"], t(`$${m} \\cdot ${kVal} = ${m * kVal}$.`, `$${m} \\cdot ${kVal} = ${m * kVal}$。`)],
              [
                ["Add the remainder", "加上余数"],
                t(
                  `$${m * kVal} + ${r} = ${rightVal}$, so $k = ${kVal}$ gives the element $${rightVal}$.`,
                  `$${m * kVal} + ${r} = ${rightVal}$，所以 $k = ${kVal}$ 给出元素 $${rightVal}$。`,
                ),
              ],
            ],
            t(
              `$${rightVal} - ${r} = ${m * kVal}$ and $${m * kVal} \\div ${m} = ${kVal}$, so going back recovers $k = ${kVal}$.`,
              `$${rightVal} - ${r} = ${m * kVal}$，$${m * kVal} \\div ${m} = ${kVal}$，倒推回去得到 $k = ${kVal}$。`,
            ),
          ),
          mistakes,
        });
      },
    },
    {
      id: "interval-subsets-of-reals",
      title: t("Interval subsets of the real numbers", "实数集中的区间与构建符"),
      explanation: t(
        "A round bracket means the endpoint is left out and a square bracket means it is included, so each interval is a compact way of writing a pair of inequalities. Intervals on the real line $\\mathbb{R}$ correspond directly to inequalities in set-builder notation: $(a, b] = \\{x \\in \\mathbb{R} \\mid a < x \\le b\\}$, $[a, b] = \\{x \\in \\mathbb{R} \\mid a \\le x \\le b\\}$, and $[a, \\infty) = \\{x \\in \\mathbb{R} \\mid x \\ge a\\}$. Translate one endpoint at a time: a round bracket gives $<$, a square bracket gives $\\le$.\n\n> **Watch out.** An interval contains every real number between its endpoints, not only the integers. $(1, 3]$ contains $1.5$ and $\\sqrt{2}$, so it is not $\\{x \\in \\mathbb{Z} \\mid 1 < x \\le 3\\} = \\{2, 3\\}$.",
        "圆括号表示不包含端点，方括号表示包含端点，所以每个区间都是一对不等式的简洁写法。实数轴 $\\mathbb{R}$ 上的区间直接对应集合构建符中的不等式：$(a, b] = \\{x \\in \\mathbb{R} \\mid a < x \\le b\\}$，$[a, b] = \\{x \\in \\mathbb{R} \\mid a \\le x \\le b\\}$，以及 $[a, \\infty) = \\{x \\in \\mathbb{R} \\mid x \\ge a\\}$。一次翻译一个端点：圆括号对应 $<$，方括号对应 $\\le$。\n\n> **注意。** 区间包含两端点之间的每个实数，而不只是整数。$(1, 3]$ 包含 $1.5$ 和 $\\sqrt{2}$，所以它不是 $\\{x \\in \\mathbb{Z} \\mid 1 < x \\le 3\\} = \\{2, 3\\}$。",
      ),
      generate(rng) {
        const a = rng.int(-9, 5);
        const b = a + rng.int(3, 12);
        const kind = rng.pick(["half_open", "closed", "open"] as const);
        const shapes = {
          half_open: { left: "(", right: "]", lo: "<", hi: "\\le", en: "half-open", zh: "半开半闭" },
          closed: { left: "[", right: "]", lo: "\\le", hi: "\\le", en: "closed", zh: "闭" },
          open: { left: "(", right: ")", lo: "<", hi: "<", en: "open", zh: "开" },
        };
        const s = shapes[kind];
        const interval = `${s.left} ${a}, ${b} ${s.right}`;
        const builder = (lo: string, hi: string, set = "\\mathbb{R}") =>
          t(`$\\{x \\in ${set} \\mid ${a} ${lo} x ${hi} ${b}\\}$`, `$\\{x \\in ${set} \\mid ${a} ${lo} x ${hi} ${b}\\}$`);
        const endpoint = (sign: string, at: number): [string, string] =>
          sign === "<"
            ? [
                `the round bracket at $${at}$ leaves it out, so $${at}$ is not in the set`,
                `$${at}$ 处的圆括号表示不包含它，所以 $${at}$ 不在集合中`,
              ]
            : [`the square bracket at $${at}$ keeps it, so $${at}$ is in the set`, `$${at}$ 处的方括号表示包含它，所以 $${at}$ 在集合中`];
        const [lEn, lZh] = endpoint(s.lo, a);
        const [rEn, rZh] = endpoint(s.hi, b);
        const flip = (sign: string) => (sign === "<" ? "\\le" : "<");
        const wrongEnd = (lo: string, hi: string): Wrong => {
          const at = lo !== s.lo ? a : b;
          const keeps = (lo !== s.lo ? lo : hi) === "\\le";
          return [
            builder(lo, hi),
            keeps
              ? `This includes $${at}$, but the round bracket at $${at}$ leaves it out.`
              : `This leaves out $${at}$, but the square bracket at $${at}$ includes it.`,
            keeps ? `这包含了 $${at}$，但 $${at}$ 处的圆括号表示不包含它。` : `这去掉了 $${at}$，但 $${at}$ 处的方括号表示包含它。`,
          ];
        };
        const bothWrong: Wrong = [
          builder(flip(s.lo), flip(s.hi)),
          `In $${interval}$ both endpoints are ${s.lo === "<" ? "left out" : "kept"}, but this treats both of them the other way.`,
          `在 $${interval}$ 中两个端点都${s.lo === "<" ? "不包含" : "包含"}，而这个选项把两个端点都处理反了。`,
        ];
        const integers: Wrong = [
          builder(s.lo, s.hi, "\\mathbb{Z}"),
          `This keeps only integers, but the interval also contains numbers such as $${a} + \\frac{1}{2}$.`,
          `这只保留了整数，但区间还包含 $${a} + \\frac{1}{2}$ 这样的数。`,
        ];
        const wrong: Wrong[] =
          kind === "half_open"
            ? [wrongEnd(flip(s.lo), s.hi), wrongEnd(s.lo, flip(s.hi)), integers]
            : kind === "closed"
              ? [bothWrong, wrongEnd(s.lo, flip(s.hi)), integers]
              : [bothWrong, wrongEnd(s.lo, flip(s.hi)), integers];
        return explained(
          rng,
          t(
            `Which set-builder notation correctly defines the ${s.en} interval $${interval}$?`,
            `下列哪个集合构建符表达式正确表示了${s.zh}区间 $${interval}$？`,
          ),
          builder(s.lo, s.hi),
          wrong,
          walked(
            [
              [["Translate the left end", "翻译左端点"], t(`At the left, ${lEn}: $${a} ${s.lo} x$.`, `左端，${lZh}：$${a} ${s.lo} x$。`)],
              [
                ["Translate the right end", "翻译右端点"],
                t(
                  `At the right, ${rEn}: $x ${s.hi} ${b}$. Together, $${interval} = \\{x \\in \\mathbb{R} \\mid ${a} ${s.lo} x ${s.hi} ${b}\\}$.`,
                  `右端，${rZh}：$x ${s.hi} ${b}$。合起来，$${interval} = \\{x \\in \\mathbb{R} \\mid ${a} ${s.lo} x ${s.hi} ${b}\\}$。`,
                ),
              ],
            ],
            t(
              `The midpoint $${(a + b) / 2}$ satisfies $${a} ${s.lo} ${(a + b) / 2} ${s.hi} ${b}$, as every point strictly inside the interval must.`,
              `中点 $${(a + b) / 2}$ 满足 $${a} ${s.lo} ${(a + b) / 2} ${s.hi} ${b}$，区间内部的每个点都应如此。`,
            ),
          ),
        );
      },
    },
  ],
};

// ─── 1.1.7 Describing Planar Regions Using Set-Builder Notation ───────────────

export const describingPlanarRegionsUsingSetBuilderNotation: TopicDef = {
  id: "describing-planar-regions-using-set-builder-notation",
  title: t("Describing Planar Regions Using Set-Builder Notation", "用集合符号描述平面区域"),
  summary: t(
    "Describe half-planes, disks, and other regions of $\\mathbb{R}^2$ using set-builder notation.",
    "用集合构建符表示 $\\mathbb{R}^2$ 中的半平面、圆盘等区域。",
  ),
  intro: t(
    "Is the point $(1, 2)$ in the region $R = \\{(x, y) \\in \\mathbb{R}^2 \\mid x + y \\le 4\\}$? Substitute: $1 + 2 = 3$ and $3 \\le 4$, so it is. The point $(3, 3)$ gives $6$, which is more than $4$, so it is not. The region is the half-plane on one side of the line $x + y = 4$.\n\nCheck: the origin gives $0 \\le 4$, so it is in $R$, and $(1, 2)$ lies on the same side of the line, below $(1, 3)$, the point of the line above it.\n\nIn this lesson we describe half-planes and disks by inequalities, and test whether a point belongs to them.",
    "点 $(1, 2)$ 在区域 $R = \\{(x, y) \\in \\mathbb{R}^2 \\mid x + y \\le 4\\}$ 中吗？代入：$1 + 2 = 3$，而 $3 \\le 4$，所以在。点 $(3, 3)$ 给出 $6$，大于 $4$，所以不在。这个区域是直线 $x + y = 4$ 一侧的半平面。\n\n检验：原点给出 $0 \\le 4$，所以在 $R$ 中；$(1, 2)$ 位于直线的同一侧，在直线上的点 $(1, 3)$ 的下方。\n\n本课我们用不等式描述半平面与圆盘，并检验一个点是否属于它们。",
  ),
  prerequisites: ["describing-sets-using-set-builder-notation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "linear-half-planes",
      title: t("Linear half-planes in R2", "平面上的线性半平面"),
      explanation: t(
        "A linear inequality $a x + b y \\le c$ in $\\mathbb{R}^2$ defines a closed half-plane bounded by the line $a x + b y = c$. To test whether a given point $(x_0, y_0)$ lies in the set $\\{(x, y) \\in \\mathbb{R}^2 \\mid a x + b y \\le c\\}$, evaluate the left side at $(x_0, y_0)$ and check if it does not exceed $c$. For $2x - y \\le 3$, the point $(1, 4)$ gives $2 - 4 = -2 \\le 3$, so it is in the half-plane.\n\n> **Watch out.** Keep the sign of each coefficient when you substitute. In $2x - y$ at $(1, -4)$, the term is $-(-4) = +4$, giving $2 + 4 = 6$, which is greater than $3$; dropping a sign would wrongly give $2 - 4 = -2$.",
        "在 $\\mathbb{R}^2$ 中，线性不等式 $a x + b y \\le c$ 定义了一个以直线 $a x + b y = c$ 为边界的闭半平面。要检验给定点 $(x_0, y_0)$ 是否属于集合 $\\{(x, y) \\in \\mathbb{R}^2 \\mid a x + b y \\le c\\}$，只需将 $(x_0, y_0)$ 代入左端并验证是否不超过 $c$。对 $2x - y \\le 3$，点 $(1, 4)$ 给出 $2 - 4 = -2 \\le 3$，所以它在半平面内。\n\n> **注意。** 代入时要保留每个系数的符号。$2x - y$ 在 $(1, -4)$ 处，这一项是 $-(-4) = +4$，得 $2 + 4 = 6$，大于 $3$；丢掉一个符号就会错算成 $2 - 4 = -2$。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const xIn = rng.int(-4, 4);
        const yIn = rng.int(-4, 4);
        const valIn = a * xIn + b * yIn;
        const c = valIn + rng.int(1, 5); // so (xIn, yIn) satisfies ax + by <= c

        // candidate points that violate ax + by <= c
        const outs: Vec2[] = [
          [xIn + (a > 0 ? 3 : -3), yIn + (b > 0 ? 3 : -3)],
          [xIn + (a > 0 ? 6 : -6), yIn],
          [xIn, yIn + (b > 0 ? 6 : -6)],
        ];

        const aStr = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
        const bStr = b === 1 ? "+ y" : b === -1 ? "- y" : b > 0 ? `+ ${b}y` : `- ${-b}y`;
        const value = ([x, y]: Vec2) => `(${a})(${x}) + (${b})(${y}) = ${a * x + b * y}`;
        return explained(
          rng,
          t(
            `Which of the following points lies in the planar region $R = \\{(x, y) \\in \\mathbb{R}^2 \\mid ${aStr} ${bStr} \\le ${c}\\}$?`,
            `下列哪个点位于平面区域 $R = \\{(x, y) \\in \\mathbb{R}^2 \\mid ${aStr} ${bStr} \\le ${c}\\}$ 内？`,
          ),
          t(`$(${xIn}, ${yIn})$`, `$(${xIn}, ${yIn})$`),
          outs.map(
            ([x, y]): Wrong => [
              t(`$(${x}, ${y})$`, `$(${x}, ${y})$`),
              `It gives $${value([x, y])}$, which is greater than $${c}$.`,
              `它给出 $${value([x, y])}$，大于 $${c}$。`,
            ],
          ),
          walked(
            [
              [
                ["Substitute the point", "代入点"],
                t(
                  `At $(${xIn}, ${yIn})$ the left side is $${value([xIn, yIn])}$.`,
                  `在 $(${xIn}, ${yIn})$ 处左端为 $${value([xIn, yIn])}$。`,
                ),
              ],
              [
                ["Compare with the bound", "与上界比较"],
                t(
                  `$${valIn} \\le ${c}$ holds, so $(${xIn}, ${yIn}) \\in R$.`,
                  `$${valIn} \\le ${c}$ 成立，所以 $(${xIn}, ${yIn}) \\in R$。`,
                ),
              ],
            ],
            t(
              `$${c} - ${valIn < 0 ? `(${valIn})` : valIn} = ${c - valIn} \\ge 0$, so the point is on the side of the line where the inequality holds.`,
              `$${c} - ${valIn < 0 ? `(${valIn})` : valIn} = ${c - valIn} \\ge 0$，所以这个点位于直线上使不等式成立的一侧。`,
            ),
          ),
        );
      },
    },
    {
      id: "circular-disks-and-regions",
      figure: linearAlgebraDrawings1["describing-planar-regions-using-set-builder-notation#circular-disks-and-regions"],
      title: t("Circular disks and boundaries", "平面上的圆盘区域与边界"),
      explanation: t(
        "A closed disk centered at $(h, k)$ with radius $r > 0$ is defined in set-builder notation as $\\{(x, y) \\in \\mathbb{R}^2 \\mid (x - h)^2 + (y - k)^2 \\le r^2\\}$. The boundary circle is given by equality $= r^2$, while the open disk uses strict inequality $< r^2$. The condition says that the distance $\\sqrt{(x - h)^2 + (y - k)^2}$ to the center is at most $r$, squared on both sides.\n\n> **Watch out.** The right side is $r^2$, not $r$. The disk of radius $3$ about the origin is $x^2 + y^2 \\le 9$; the point $(2, 0)$ lies in it, yet $x^2 + y^2 \\le 3$ would leave it out, since $4 > 3$.",
        "以 $(h, k)$ 为圆心、半径为 $r > 0$ 的闭圆盘在集合构建符中表示为 $\\{(x, y) \\in \\mathbb{R}^2 \\mid (x - h)^2 + (y - k)^2 \\le r^2\\}$。边界圆周对应等号 $= r^2$，而开圆盘对应严格不等号 $< r^2$。这个条件说的是到圆心的距离 $\\sqrt{(x - h)^2 + (y - k)^2}$ 不超过 $r$，两边平方即得。\n\n> **注意。** 右端是 $r^2$，不是 $r$。以原点为圆心、半径为 $3$ 的圆盘是 $x^2 + y^2 \\le 9$；点 $(2, 0)$ 在其中，但 $x^2 + y^2 \\le 3$ 会把它排除，因为 $4 > 3$。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const r = rng.int(2, 7);
        const rSq = r * r;
        const hStr = h === 0 ? "x^2" : h > 0 ? `(x - ${h})^2` : `(x + ${-h})^2`;
        const kStr = k === 0 ? "y^2" : k > 0 ? `(y - ${k})^2` : `(y + ${-k})^2`;
        const region = (rel: string, rhs: number) =>
          t(
            `$\\{(x, y) \\in \\mathbb{R}^2 \\mid ${hStr} + ${kStr} ${rel} ${rhs}\\}$`,
            `$\\{(x, y) \\in \\mathbb{R}^2 \\mid ${hStr} + ${kStr} ${rel} ${rhs}\\}$`,
          );
        return explained(
          rng,
          t(
            `Which set-builder expression represents the closed circular disk centered at $(${h}, ${k})$ with radius $r = ${r}$?`,
            `下列哪个集合构建符表达式表示以 $(${h}, ${k})$ 为圆心、半径为 $r = ${r}$ 的闭圆盘？`,
          ),
          region("\\le", rSq),
          [
            [
              region("<", r),
              `The right side must be $r^2 = ${rSq}$, not $r = ${r}$, and a closed disk uses $\\le$, keeping its boundary.`,
              `右端应为 $r^2 = ${rSq}$，而不是 $r = ${r}$；而且闭圆盘用 $\\le$，保留边界。`,
            ],
            [
              region("=", rSq),
              "Equality describes only the boundary circle; the disk also contains the points inside it, such as the center.",
              "等号只描述边界圆周；圆盘还包含其内部的点，例如圆心。",
            ],
            [
              region("\\ge", rSq),
              "$\\ge$ describes the points at distance at least the radius, outside the circle; the center is not among them.",
              "$\\ge$ 描述的是距离不小于半径的点，在圆外；圆心不在其中。",
            ],
          ],
          walked(
            [
              [
                ["Write the distance condition", "写出距离条件"],
                t(
                  `A point is in the closed disk when its distance to $(${h}, ${k})$ is at most $${r}$: $\\sqrt{${hStr} + ${kStr}} \\le ${r}$.`,
                  `一个点在闭圆盘中，当且仅当它到 $(${h}, ${k})$ 的距离不超过 $${r}$：$\\sqrt{${hStr} + ${kStr}} \\le ${r}$。`,
                ),
              ],
              [
                ["Square both sides", "两边平方"],
                t(
                  `Both sides are nonnegative, so this is $${hStr} + ${kStr} \\le ${rSq}$.`,
                  `两边都非负，所以等价于 $${hStr} + ${kStr} \\le ${rSq}$。`,
                ),
              ],
            ],
            t(
              `The center $(${h}, ${k})$ gives $0 \\le ${rSq}$, inside, and the point $(${h + r}, ${k})$ gives $${r}^2 = ${rSq} \\le ${rSq}$, on the boundary, which a closed disk keeps.`,
              `圆心 $(${h}, ${k})$ 给出 $0 \\le ${rSq}$，在内部；点 $(${h + r}, ${k})$ 给出 $${r}^2 = ${rSq} \\le ${rSq}$，在边界上，闭圆盘保留它。`,
            ),
          ),
        );
      },
    },
  ],
};

// ─── 1.1.8 Cardinality of Finite Sets ────────────────────────────────────────

export const cardinalityOfFiniteSets: TopicDef = {
  id: "cardinality-of-finite-sets",
  title: t("Cardinality of Finite Sets", "有限集合的基数"),
  summary: t(
    "Find the cardinality of finite sets and apply the principle of inclusion-exclusion for two sets.",
    "计算有限集合的元素个数（基数），并应用两集合的容斥原理。",
  ),
  intro: t(
    "Let $A = \\{1, 2, 3, 4\\}$ and $B = \\{3, 4, 5\\}$, so $|A| = 4$ and $|B| = 3$. Their union $A \\cup B = \\{1, 2, 3, 4, 5\\}$ has $5$ elements, not $4 + 3 = 7$: the elements $3$ and $4$ belong to both sets and were counted twice. Subtracting the overlap once gives $7 - 2 = 5$.\n\nCheck: counting the listed union $1, 2, 3, 4, 5$ one by one gives $5$.\n\nIn this lesson we count the elements of finite sets, and count a union by inclusion-exclusion.",
    "设 $A = \\{1, 2, 3, 4\\}$，$B = \\{3, 4, 5\\}$，则 $|A| = 4$，$|B| = 3$。它们的并集 $A \\cup B = \\{1, 2, 3, 4, 5\\}$ 有 $5$ 个元素，而不是 $4 + 3 = 7$ 个：元素 $3$ 和 $4$ 同时属于两个集合，被数了两次。减去一次重叠部分，得 $7 - 2 = 5$。\n\n检验：把列出的并集 $1, 2, 3, 4, 5$ 逐个数一遍，得 $5$。\n\n本课我们数有限集合的元素个数，并用容斥原理计算并集的元素个数。",
  ),
  prerequisites: ["the-constructive-definition-of-a-set"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "cardinality-of-a-finite-set",
      title: t("Cardinality of a finite set", "有限集合的元素个数"),
      explanation: t(
        "The cardinality of a finite set $A$, denoted $|A|$ or $n(A)$, is the number of distinct elements in $A$. For example, $|\\{2, 5, 8, 11\\}| = 4$, and the empty set has $|\\emptyset| = 0$. When the elements run from $a$ to $b$ in steps of $d$, there are $\\frac{b - a}{d}$ steps and one more element than steps: $\\frac{b - a}{d} + 1$ elements.\n\n> **Watch out.** Count elements, not gaps. From $3$ to $15$ in steps of $3$ the elements are $3, 6, 9, 12, 15$: there are $\\frac{15 - 3}{3} = 4$ steps but $5$ elements.",
        "有限集合 $A$ 的基数（记作 $|A|$ 或 $n(A)$）是指 $A$ 中不同元素的个数。例如 $|\\{2, 5, 8, 11\\}| = 4$，空集的基数为 $|\\emptyset| = 0$。当元素从 $a$ 到 $b$、每次增加 $d$ 时，共有 $\\frac{b - a}{d}$ 步，元素比步数多一个：共 $\\frac{b - a}{d} + 1$ 个元素。\n\n> **注意。** 数的是元素，不是间隔。从 $3$ 到 $15$、每次加 $3$，元素是 $3, 6, 9, 12, 15$：有 $\\frac{15 - 3}{3} = 4$ 步，却有 $5$ 个元素。",
      ),
      generate(rng) {
        const lo = rng.int(1, 10);
        const d = rng.int(2, 5);
        const count = rng.int(4, 12);
        const hi = lo + (count - 1) * d;
        const setStr = `\\{x \\in \\mathbb{Z} \\mid ${lo} \\le x \\le ${hi} \\text{ and } (x - ${lo}) \\text{ is a multiple of } ${d}\\}`;
        const setZh = `\\{x \\in \\mathbb{Z} \\mid ${lo} \\le x \\le ${hi} \\text{ 且 } (x - ${lo}) \\text{ 是 } ${d} \\text{ 的倍数}\\}`;
        return numberProblem({
          prompt: t(`Find the cardinality $|S|$ of the set:\n\n$$S = ${setStr}$$`, `求集合 $S$ 的基数 $|S|$：\n\n$$S = ${setZh}$$`),
          answer: count,
          solution: walked(
            [
              [
                ["Describe the elements", "描述元素"],
                t(
                  `The elements start at $${lo}$ and go up by $${d}$: $${lo}, ${lo + d}, ${lo + 2 * d}, \\dots, ${hi}$.`,
                  `元素从 $${lo}$ 开始，每次加 $${d}$：$${lo}, ${lo + d}, ${lo + 2 * d}, \\dots, ${hi}$。`,
                ),
              ],
              [
                ["Count steps, then elements", "先数步数，再数元素"],
                t(
                  `There are $\\frac{${hi} - ${lo}}{${d}} = ${count - 1}$ steps, and one more element than steps, so $|S| = ${count}$.`,
                  `共有 $\\frac{${hi} - ${lo}}{${d}} = ${count - 1}$ 步，元素比步数多一个，所以 $|S| = ${count}$。`,
                ),
              ],
            ],
            t(
              `The $${count}$th element is $${lo} + (${count} - 1) \\cdot ${d} = ${hi}$, the upper end.`,
              `第 $${count}$ 个元素是 $${lo} + (${count} - 1) \\cdot ${d} = ${hi}$，正是上端点。`,
            ),
          ),
          mistakes: [
            why(
              count - 1,
              `$${count - 1}$ is the number of steps from $${lo}$ to $${hi}$; there is one more element than steps.`,
              `$${count - 1}$ 是从 $${lo}$ 到 $${hi}$ 的步数；元素比步数多一个。`,
            ),
            why(
              hi - lo + 1,
              `That counts every integer from $${lo}$ to $${hi}$; only every $${d}$th one belongs to $S$.`,
              `这数的是从 $${lo}$ 到 $${hi}$ 的所有整数；只有每隔 $${d}$ 个的那些属于 $S$。`,
            ),
            why(
              count + 1,
              "Both ends are already included once; adding $2$ to the number of steps counts one element twice.",
              "两个端点都已各计一次；在步数上加 $2$ 会把一个元素多算一次。",
            ),
          ],
        });
      },
    },
    {
      id: "inclusion-exclusion-for-two-sets",
      title: t("Inclusion-exclusion principle for two sets", "两集合的容斥原理"),
      explanation: t(
        "The Principle of Inclusion-Exclusion for two finite sets $A$ and $B$ states: $|A \\cup B| = |A| + |B| - |A \\cap B|$. Subtracting $|A \\cap B|$ corrects for the elements counted twice in $|A| + |B|$. The same equation, rearranged, gives the overlap: $|A \\cap B| = |A| + |B| - |A \\cup B|$.\n\n> **Watch out.** Subtract the overlap once, not twice. With $|A| = 10$, $|B| = 8$ and $|A \\cap B| = 3$, the union has $10 + 8 - 3 = 15$ elements; $10 + 8 - 6 = 12$ counts only the elements in exactly one of the sets.",
        "两有限集合 $A$ 与 $B$ 的容斥原理为：$|A \\cup B| = |A| + |B| - |A \\cap B|$。减去 $|A \\cap B|$ 是为了校正这些元素在 $|A| + |B|$ 中被重复计算的一次。把同一个等式变形，可求出重叠部分：$|A \\cap B| = |A| + |B| - |A \\cup B|$。\n\n> **注意。** 重叠部分只减一次，不是两次。若 $|A| = 10$，$|B| = 8$，$|A \\cap B| = 3$，则并集有 $10 + 8 - 3 = 15$ 个元素；$10 + 8 - 6 = 12$ 数的只是恰好属于其中一个集合的元素。",
      ),
      generate(rng) {
        const nA = rng.int(15, 45);
        const nB = rng.int(15, 45);
        const maxInter = Math.min(nA, nB) - 4;
        const nInter = rng.int(3, Math.max(4, maxInter));
        const nUnion = nA + nB - nInter;
        const askUnion = rng.bool();
        const apart = <M extends { value: unknown }>(answer: number, list: M[]) =>
          list.filter((x, i, all) => x.value !== answer && all.findIndex((y) => y.value === x.value) === i);
        if (askUnion) {
          return numberProblem({
            prompt: t(
              `Given two finite sets $A$ and $B$ with $|A| = ${nA}$, $|B| = ${nB}$, and $|A \\cap B| = ${nInter}$, find $|A \\cup B|$.`,
              `已知有限集合 $A$ 与 $B$ 满足 $|A| = ${nA}$，$|B| = ${nB}$，且 $|A \\cap B| = ${nInter}$，求 $|A \\cup B|$。`,
            ),
            answer: nUnion,
            solution: walked(
              [
                [
                  ["Add the two sizes", "两个大小相加"],
                  t(
                    `$|A| + |B| = ${nA} + ${nB} = ${nA + nB}$, which counts the $${nInter}$ shared elements twice.`,
                    `$|A| + |B| = ${nA} + ${nB} = ${nA + nB}$，其中 $${nInter}$ 个公共元素被数了两次。`,
                  ),
                ],
                [["Subtract the overlap once", "减去一次重叠"], t("", ""), [`|A \\cup B| = ${nA + nB} - ${nInter} = ${nUnion}`]],
              ],
              t(
                `Only in $A$: $${nA} - ${nInter} = ${nA - nInter}$; only in $B$: $${nB} - ${nInter} = ${nB - nInter}$; in both: $${nInter}$. In total $${nA - nInter} + ${nB - nInter} + ${nInter} = ${nUnion}$.`,
                `只在 $A$ 中：$${nA} - ${nInter} = ${nA - nInter}$；只在 $B$ 中：$${nB} - ${nInter} = ${nB - nInter}$；两者都在：$${nInter}$。合计 $${nA - nInter} + ${nB - nInter} + ${nInter} = ${nUnion}$。`,
              ),
            ),
            mistakes: apart(nUnion, [
              why(
                nA + nB,
                "The shared elements are counted twice in $|A| + |B|$; subtract the overlap.",
                "公共元素在 $|A| + |B|$ 中被数了两次；要减去重叠部分。",
              ),
              why(
                nA + nB - 2 * nInter,
                "The overlap was subtracted twice, which removes the shared elements entirely; subtract it once.",
                "重叠部分减了两次，把公共元素完全去掉了；只应减一次。",
              ),
              why(
                nA + nB + nInter,
                "The overlap is subtracted, not added: it was already counted twice.",
                "重叠部分应该减去而不是加上：它已经被数了两次。",
              ),
            ]),
          });
        }
        return numberProblem({
          prompt: t(
            `Given two finite sets $A$ and $B$ with $|A| = ${nA}$, $|B| = ${nB}$, and $|A \\cup B| = ${nUnion}$, find $|A \\cap B|$.`,
            `已知有限集合 $A$ 与 $B$ 满足 $|A| = ${nA}$，$|B| = ${nB}$，且 $|A \\cup B| = ${nUnion}$，求 $|A \\cap B|$。`,
          ),
          answer: nInter,
          solution: walked(
            [
              [["Write inclusion-exclusion", "写出容斥原理"], t("", ""), [`${nUnion} = ${nA} + ${nB} - |A \\cap B|`]],
              [
                ["Solve for the overlap", "解出重叠部分"],
                t(
                  `$${nA} + ${nB} = ${nA + nB}$ exceeds the union by the overlap:`,
                  `$${nA} + ${nB} = ${nA + nB}$ 比并集多出的正是重叠部分：`,
                ),
                [`|A \\cap B| = ${nA + nB} - ${nUnion} = ${nInter}`],
              ],
            ],
            t(
              `$${nA} + ${nB} - ${nInter} = ${nUnion}$, the given size of the union.`,
              `$${nA} + ${nB} - ${nInter} = ${nUnion}$，正是已知的并集大小。`,
            ),
          ),
          mistakes: apart(nInter, [
            why(
              nA + nB + nUnion,
              "The union is subtracted from $|A| + |B|$, not added to it.",
              "并集的大小应从 $|A| + |B|$ 中减去，而不是加上。",
            ),
            why(
              nUnion - nA,
              `$|A \\cup B| - |A| = ${nUnion - nA}$ counts the elements of $B$ outside $A$, not the overlap.`,
              `$|A \\cup B| - |A| = ${nUnion - nA}$ 数的是 $B$ 中不在 $A$ 里的元素，不是重叠部分。`,
            ),
            why(
              nUnion - nB,
              `$|A \\cup B| - |B| = ${nUnion - nB}$ counts the elements of $A$ outside $B$, not the overlap.`,
              `$|A \\cup B| - |B| = ${nUnion - nB}$ 数的是 $A$ 中不在 $B$ 里的元素，不是重叠部分。`,
            ),
          ]),
        });
      },
    },
  ],
};

// ─── 1.1.9 Infinite Sets ─────────────────────────────────────────────────────

export const infiniteSets: TopicDef = {
  id: "infinite-sets",
  title: t("Infinite Sets", "无限集与可数性初步"),
  summary: t(
    "Distinguish countably infinite sets like N, Z, Q from uncountable sets like R and real intervals.",
    "区分可数无限集（如 N, Z, Q）与不可数集（如实数集 R 及实数区间）。",
  ),
  intro: t(
    "Pair each natural number $n$ with the even number $2n$: $0 \\leftrightarrow 0$, $1 \\leftrightarrow 2$, $2 \\leftrightarrow 4$, and so on. Every natural number gets exactly one partner and every even natural number is used exactly once, so the even numbers can be listed in a sequence, just like $\\mathbb{N}$: the two sets have the same size. The real numbers are different: no list, however long, contains them all.\n\nCheck: the even number $38$ is paired with $19$ and with nothing else, since $2n = 38$ only for $n = 19$.\n\nIn this lesson we tell countably infinite sets, which can be listed, from uncountable sets such as $\\mathbb{R}$ and its intervals.",
    "把每个自然数 $n$ 与偶数 $2n$ 配对：$0 \\leftrightarrow 0$，$1 \\leftrightarrow 2$，$2 \\leftrightarrow 4$，依此类推。每个自然数恰好有一个配对，每个偶自然数也恰好被用一次，所以偶数可以像 $\\mathbb{N}$ 一样排成一列：这两个集合一样大。实数则不同：无论多长的列表，都列不全所有实数。\n\n检验：偶数 $38$ 与 $19$ 配对，且只与它配对，因为只有 $n = 19$ 时 $2n = 38$。\n\n本课我们区分可以排成一列的可数无限集，与 $\\mathbb{R}$ 及其区间这样的不可数集。",
  ),
  prerequisites: ["cardinality-of-finite-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "countable-and-countably-infinite-sets",
      title: t("Countable and countably infinite sets", "可数集与可数无限集"),
      explanation: t(
        "A set is countably infinite if there is a bijection between it and the natural numbers $\\mathbb{N}$; its cardinality is denoted $\\aleph_0$ ('aleph-null'). Countably infinite sets include $\\mathbb{N}$, the integers $\\mathbb{Z}$, the rational numbers $\\mathbb{Q}$, and Cartesian products like $\\mathbb{N} \\times \\mathbb{N}$. In practice, a set is countably infinite when it is infinite and its elements can be written as a list in which each element appears at some position; every infinite subset of a countable set is countably infinite.\n\n> **Watch out.** A set that seems larger than $\\mathbb{N}$ can still be countable. The integers extend in both directions, yet the list $0, 1, -1, 2, -2, 3, -3, \\dots$ reaches every integer, so $|\\mathbb{Z}| = \\aleph_0$.",
        "若一个集合与自然数集 $\\mathbb{N}$ 之间存在一一对应（双射），则称该集合为可数无限集，其基数记作 $\\aleph_0$（阿列夫零）。常见的可数无限集包括自然数集 $\\mathbb{N}$、整数集 $\\mathbb{Z}$、有理数集 $\\mathbb{Q}$，以及笛卡尔积 $\\mathbb{N} \\times \\mathbb{N}$。实际判断时，一个集合是可数无限集，当且仅当它是无限的，并且其元素可以排成一列，使每个元素都出现在某个位置；可数集的每个无限子集都是可数无限集。\n\n> **注意。** 看起来比 $\\mathbb{N}$ 大的集合仍可能可数。整数向两个方向延伸，但列表 $0, 1, -1, 2, -2, 3, -3, \\dots$ 能到达每个整数，所以 $|\\mathbb{Z}| = \\aleph_0$。",
      ),
      generate(rng) {
        const k = rng.int(2, 35);
        const setType = rng.pick(["multiples", "rationals_gt", "odds"] as const);
        let setNameEn: string;
        let setNameZh: string;
        let setLatex: string;
        let first: string;
        if (setType === "multiples") {
          setNameEn = `the set of all integer multiples of ${k}`;
          setNameZh = `所有 ${k} 的整数倍构成的集合`;
          setLatex = `\\{ ${k}m \\mid m \\in \\mathbb{Z} \\}`;
          first = `0, ${k}, -${k}, ${2 * k}, -${2 * k}, \\dots`;
        } else if (setType === "rationals_gt") {
          setNameEn = `the set of rational numbers greater than ${k}`;
          setNameZh = `所有大于 ${k} 的有理数构成的集合`;
          setLatex = `\\{ q \\in \\mathbb{Q} \\mid q > ${k} \\}`;
          first = `${k + 1}, ${k + 2}, ${k + 3}, \\dots`;
        } else {
          setNameEn = `the set of integers of the form $${2 * k}n + 1$`;
          setNameZh = `形如 $${2 * k}n + 1$ 的整数集合`;
          setLatex = `\\{ ${2 * k}n + 1 \\mid n \\in \\mathbb{Z} \\}`;
          first = `1, ${2 * k + 1}, -${2 * k - 1}, ${4 * k + 1}, -${4 * k - 1}, \\dots`;
        }
        const big = setType === "rationals_gt" ? "\\mathbb{Q}" : "\\mathbb{Z}";
        const listing =
          setType === "rationals_gt"
            ? t(
                `Take a listing of $\\mathbb{Q}$ and keep only the rationals greater than $${k}$; what remains is still a list, and it never ends, since it contains $${first}$`,
                `取 $\\mathbb{Q}$ 的一个排列，只保留大于 $${k}$ 的有理数；剩下的仍是一个列表，而且永不结束，因为其中有 $${first}$`,
              )
            : t(
                `Pair $n = 0, 1, -1, 2, -2, \\dots$ with the elements in order: $${first}$, which reaches every element and never ends`,
                `按 $n = 0, 1, -1, 2, -2, \\dots$ 的顺序依次排出元素：$${first}$，这样能到达每个元素，而且永不结束`,
              );
        return explained(
          rng,
          t(
            `Classify the cardinality of the set $S = ${setLatex}$ (${setNameEn}):`,
            `判断集合 $S = ${setLatex}$（${setNameZh}）的基数类型：`,
          ),
          t("Countably infinite (cardinality $\\aleph_0$)", "可数无限集（基数为 $\\aleph_0$）"),
          [
            [
              t("Uncountably infinite (continuum cardinality $\\mathfrak{c}$)", "不可数无限集（连续统基数 $\\mathfrak{c}$）"),
              `$S$ is a subset of $${big}$, which is countable, so it cannot be uncountable.`,
              `$S$ 是可数集 $${big}$ 的子集，所以不可能不可数。`,
            ],
            [
              t("Finite set", "有限集合"),
              `$S$ contains $${first.split(",")[0]}, ${first.split(",")[1]?.trim()}, \\dots$ without end, so it is infinite.`,
              `$S$ 包含 $${first.split(",")[0]}, ${first.split(",")[1]?.trim()}, \\dots$，无穷无尽，所以是无限集。`,
            ],
            [
              t("Undefined cardinality", "基数未定义"),
              "Every set has a cardinality; for an infinite set it compares the set with $\\mathbb{N}$ by one-to-one pairing.",
              "每个集合都有基数；对无限集，基数通过一一配对与 $\\mathbb{N}$ 比较。",
            ],
          ],
          walked(
            [
              [["List the elements", "排出元素"], t(`${listing.en}.`, `${listing["zh-CN"]}。`)],
              [
                ["Conclude", "得出结论"],
                t(
                  `So $S$ is an infinite subset of the countable set $${big}$, in one-to-one correspondence with $\\mathbb{N}$: $|S| = \\aleph_0$.`,
                  `所以 $S$ 是可数集 $${big}$ 的无限子集，与 $\\mathbb{N}$ 一一对应：$|S| = \\aleph_0$。`,
                ),
              ],
            ],
            setType === "rationals_gt"
              ? t(
                  `The map $n \\mapsto ${k} + n + 1$ sends the natural numbers one-to-one into $S$, so $S$ is infinite, and $S \\subseteq \\mathbb{Q}$ keeps it countable.`,
                  `映射 $n \\mapsto ${k} + n + 1$ 把自然数一一地映入 $S$，所以 $S$ 是无限的；而 $S \\subseteq \\mathbb{Q}$ 保证它可数。`,
                )
              : t(
                  `The element with $n = 3$ is $${setType === "multiples" ? 3 * k : 6 * k + 1}$, and it sits at position $6$ of the list, as every positive $n$ sits at position $2n$.`,
                  `$n = 3$ 对应的元素是 $${setType === "multiples" ? 3 * k : 6 * k + 1}$，它位于列表第 $6$ 位，正如每个正的 $n$ 位于第 $2n$ 位。`,
                ),
          ),
        );
      },
    },
    {
      id: "uncountable-sets",
      title: t("Uncountable sets", "不可数集"),
      explanation: t(
        "An infinite set that cannot be put into one-to-one correspondence with $\\mathbb{N}$ is uncountable. By Cantor's diagonal argument, the real numbers $\\mathbb{R}$ and any non-degenerate real interval $(a, b)$ have continuum cardinality $\\mathfrak{c} = 2^{\\aleph_0} > \\aleph_0$, making them uncountable. An interval has as many points as $\\mathbb{R}$: for instance $x \\mapsto a + (b - a)x$ matches $[0, 1]$ one-to-one with $[a, b]$.\n\n> **Watch out.** The length of an interval is not the number of its points. $[0, 1]$ has length $1$, yet it contains $\\frac{1}{2}, \\frac{1}{3}, \\frac{1}{4}, \\dots$ and uncountably many other points.",
        "不能与自然数集 $\\mathbb{N}$ 建立双射的无限集称为不可数集。由康托尔对角线论证法可知，实数集 $\\mathbb{R}$ 以及任何非单点实数区间 $(a, b)$ 的基数均为连续统基数 $\\mathfrak{c} = 2^{\\aleph_0} > \\aleph_0$，因此它们是不可数的。区间的点与 $\\mathbb{R}$ 一样多：例如 $x \\mapsto a + (b - a)x$ 把 $[0, 1]$ 与 $[a, b]$ 一一对应。\n\n> **注意。** 区间的长度不是它的点数。$[0, 1]$ 的长度是 $1$，却包含 $\\frac{1}{2}, \\frac{1}{3}, \\frac{1}{4}, \\dots$ 以及不可数个其他点。",
      ),
      generate(rng) {
        const a = rng.int(-15, 10);
        const len = rng.int(2, 12);
        const b = a + len;
        const open = rng.bool();
        const intervalStr = open ? `(${a}, ${b})` : `[${a}, ${b}]`;
        const unit = open ? "(0, 1)" : "[0, 1]";
        return explained(
          rng,
          t(
            `Determine the cardinality of the real interval $S = ${intervalStr} \\subset \\mathbb{R}$:`,
            `判断实数区间 $S = ${intervalStr} \\subset \\mathbb{R}$ 的基数类型：`,
          ),
          t(
            "Uncountably infinite (cardinality $\\mathfrak{c} = 2^{\\aleph_0}$)",
            "不可数无限集（连续统基数 $\\mathfrak{c} = 2^{\\aleph_0}$）",
          ),
          [
            [
              t("Countably infinite (cardinality $\\aleph_0$)", "可数无限集（基数为 $\\aleph_0$）"),
              "By Cantor's diagonal argument, every list of points of an interval misses some point, so no listing exists.",
              "由康托尔对角线论证，区间的任何点列都会漏掉某个点，所以不存在这样的排列。",
            ],
            [
              t(`Finite set with cardinality $|S| = ${len}$`, `有限集，元素个数 $|S| = ${len}$`),
              `$${len}$ is the length $${b} - (${a})$, not a count of points; the interval contains infinitely many points.`,
              `$${len}$ 是长度 $${b} - (${a})$，不是点的个数；区间包含无穷多个点。`,
            ],
            [
              t("The empty set", "空集"),
              `$S$ contains its midpoint $${(a + b) / 2}$, so it is not empty.`,
              `$S$ 包含它的中点 $${(a + b) / 2}$，所以不是空集。`,
            ],
          ],
          walked(
            [
              [
                ["Show it is infinite", "说明它是无限的"],
                t(
                  `$S$ contains $${a} + \\frac{1}{2}, ${a} + \\frac{1}{3}, ${a} + \\frac{1}{4}, \\dots$, all different.`,
                  `$S$ 包含 $${a} + \\frac{1}{2}, ${a} + \\frac{1}{3}, ${a} + \\frac{1}{4}, \\dots$，它们互不相同。`,
                ),
              ],
              [
                ["Compare with the real line", "与实数轴比较"],
                t(
                  "A non-degenerate interval matches $\\mathbb{R}$ one-to-one, and $\\mathbb{R}$ is uncountable by Cantor's diagonal argument, so $S$ has cardinality $\\mathfrak{c}$.",
                  "非单点区间与 $\\mathbb{R}$ 一一对应，而由康托尔对角线论证 $\\mathbb{R}$ 不可数，所以 $S$ 的基数为 $\\mathfrak{c}$。",
                ),
              ],
            ],
            t(
              `The map $x \\mapsto ${a} + ${len}x$ sends $${unit}$ one-to-one onto $${intervalStr}$, and $${unit}$ is uncountable, so $S$ is too.`,
              `映射 $x \\mapsto ${a} + ${len}x$ 把 $${unit}$ 一一地映满 $${intervalStr}$，而 $${unit}$ 不可数，所以 $S$ 也不可数。`,
            ),
          ),
        );
      },
    },
  ],
};

// ─── 1.1.10 Subsets ──────────────────────────────────────────────────────────

export const subsets: TopicDef = {
  id: "subsets",
  title: t("Subsets", "子集与真子集"),
  summary: t(
    "Determine subset and proper subset relations, and compute the cardinality and elements of power sets.",
    "判定子集与真子集关系，并计算幂集的基数与子集构成。",
  ),
  intro: t(
    "Every element of $\\{1, 2\\}$ is in $\\{1, 2, 3\\}$, so $\\{1, 2\\}$ is a subset of $\\{1, 2, 3\\}$; it is a proper subset, since $3$ is left out. The subsets of $\\{1, 2\\}$ itself are $\\emptyset$, $\\{1\\}$, $\\{2\\}$ and $\\{1, 2\\}$: four of them.\n\nCheck: building a subset of $\\{1, 2\\}$ means deciding, for each of the $2$ elements, whether to take it, which gives $2 \\cdot 2 = 4$ choices.\n\nIn this lesson we decide when one set is a subset or proper subset of another, and count all the subsets of a finite set.",
    "$\\{1, 2\\}$ 的每个元素都在 $\\{1, 2, 3\\}$ 中，所以 $\\{1, 2\\}$ 是 $\\{1, 2, 3\\}$ 的子集；它是真子集，因为 $3$ 没有被取到。$\\{1, 2\\}$ 本身的子集是 $\\emptyset$、$\\{1\\}$、$\\{2\\}$ 和 $\\{1, 2\\}$，共四个。\n\n检验：构造 $\\{1, 2\\}$ 的子集，就是对 $2$ 个元素各决定取或不取，共 $2 \\cdot 2 = 4$ 种选择。\n\n本课我们判断一个集合何时是另一个集合的子集或真子集，并数出有限集合的全部子集。",
  ),
  prerequisites: ["special-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "subsets-and-proper-subsets",
      title: t("Subsets and proper subsets", "子集与真子集"),
      explanation: t(
        "$A$ is a subset of $B$ ($A \\subseteq B$) if every element of $A$ belongs to $B$: $\\forall x (x \\in A \\implies x \\in B)$. $A$ is a proper subset of $B$ ($A \\subsetneq B$) if $A \\subseteq B$ and $A \\neq B$ (there is at least one element in $B$ not in $A$). For every set $A$, $\\emptyset \\subseteq A$ and $A \\subseteq A$. To compare two sets, look for an element of $A$ outside $B$, and for an element of $B$ outside $A$: which of these exist decides the relation.\n\n> **Watch out.** A shared element does not make one set a subset of the other. $\\{1, 2\\}$ and $\\{2, 3\\}$ share $2$, but $1$ is outside the second and $3$ is outside the first, so neither is a subset of the other.",
        "若 $A$ 的每个元素都属于 $B$，则称 $A$ 是 $B$ 的子集（$A \\subseteq B$），即 $\\forall x (x \\in A \\implies x \\in B)$。若 $A \\subseteq B$ 且 $A \\neq B$（即 $B$ 中至少含有一个不属于 $A$ 的元素），则称 $A$ 是 $B$ 的真子集（$A \\subsetneq B$）。对任意集合 $A$，恒有 $\\emptyset \\subseteq A$ 且 $A \\subseteq A$。比较两个集合时，寻找 $A$ 中不在 $B$ 里的元素，以及 $B$ 中不在 $A$ 里的元素：哪些存在，决定了两者的关系。\n\n> **注意。** 有公共元素并不意味着一个是另一个的子集。$\\{1, 2\\}$ 与 $\\{2, 3\\}$ 有公共元素 $2$，但 $1$ 不在第二个集合中，$3$ 不在第一个集合中，所以两者互不为子集。",
      ),
      generate(rng) {
        const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const shared = rng.sample(pool, 3);
        const [x, y] = rng.sample(
          pool.filter((n) => !shared.includes(n)),
          2,
        ) as [number, number];
        // 0: A ⊊ B, 1: B ⊊ A, 2: A = B, 3: neither contains the other.
        const relation = rng.int(0, 3);
        const a = [...shared, ...(relation === 1 ? [x, y] : relation === 3 ? [x] : [])];
        const b = [...shared, ...(relation === 0 ? [x, y] : relation === 3 ? [y] : [])];
        const aList = rng.shuffle(a);
        let bList = rng.shuffle(b);
        // Equal sets are listed in different orders, so the solution's remark holds.
        if (bList.join() === aList.join()) bList = [...bList].reverse();
        const [aStr, bStr] = [aList, bList].map((xs) => `\\{${xs.join(", ")}\\}`);
        const sorted = (xs: number[]) => [...xs].sort((m, n) => m - n).join(", ");
        const options = [
          t("$A \\subsetneq B$ ($A$ is a proper subset of $B$)", "$A \\subsetneq B$（$A$ 是 $B$ 的真子集）"),
          t("$B \\subsetneq A$ ($B$ is a proper subset of $A$)", "$B \\subsetneq A$（$B$ 是 $A$ 的真子集）"),
          t("$A = B$", "$A = B$"),
          t("Neither is a subset of the other", "两者互不为子集"),
        ];
        const extraB = b.filter((n) => !a.includes(n));
        const extraA = a.filter((n) => !b.includes(n));
        const outA = extraA[0];
        const outB = extraB[0];
        const notIn = (n: number | undefined, from: string, to: string): [string, string] => [
          `$${n}$ is in $${from}$ but not in $${to}$, so $${from} \\not\\subseteq ${to}$.`,
          `$${n}$ 在 $${from}$ 中但不在 $${to}$ 中，所以 $${from} \\not\\subseteq ${to}$。`,
        ];
        const reasons: Reason[] = [
          [
            options[0]!.en,
            ...(outA !== undefined
              ? notIn(outA, "A", "B")
              : ([
                  "$B$ has no element outside $A$, so $A$ equals $B$ and is not a proper subset of it.",
                  "$B$ 中没有 $A$ 以外的元素，所以 $A$ 等于 $B$，不是它的真子集。",
                ] as [string, string])),
          ],
          [
            options[1]!.en,
            ...(outB !== undefined
              ? notIn(outB, "B", "A")
              : ([
                  "$A$ has no element outside $B$, so $B$ equals $A$ and is not a proper subset of it.",
                  "$A$ 中没有 $B$ 以外的元素，所以 $B$ 等于 $A$，不是它的真子集。",
                ] as [string, string])),
          ],
          [options[2]!.en, ...(outA !== undefined ? notIn(outA, "A", "B") : notIn(outB, "B", "A"))],
          [
            options[3]!.en,
            ...((outA === undefined
              ? ["Every element of $A$ is in $B$, so $A \\subseteq B$.", "$A$ 的每个元素都在 $B$ 中，所以 $A \\subseteq B$。"]
              : ["Every element of $B$ is in $A$, so $B \\subseteq A$.", "$B$ 的每个元素都在 $A$ 中，所以 $B \\subseteq A$。"]) as [
              string,
              string,
            ]),
          ],
        ];
        const look = t(
          `Elements of $A$ outside $B$: ${extraA.length > 0 ? `$${sorted(extraA)}$` : "none"}. Elements of $B$ outside $A$: ${extraB.length > 0 ? `$${sorted(extraB)}$` : "none"}.`,
          `$A$ 中不在 $B$ 里的元素：${extraA.length > 0 ? `$${sorted(extraA)}$` : "没有"}。$B$ 中不在 $A$ 里的元素：${extraB.length > 0 ? `$${sorted(extraB)}$` : "没有"}。`,
        );
        const decide = [
          t(
            `So $A \\subseteq B$, and $B$ has more, so $A \\subsetneq B$.`,
            `所以 $A \\subseteq B$，且 $B$ 还有别的元素，所以 $A \\subsetneq B$。`,
          ),
          t(
            `So $B \\subseteq A$, and $A$ has more, so $B \\subsetneq A$.`,
            `所以 $B \\subseteq A$，且 $A$ 还有别的元素，所以 $B \\subsetneq A$。`,
          ),
          t(
            "So $A \\subseteq B$ and $B \\subseteq A$: $A = B$, listed in a different order.",
            "所以 $A \\subseteq B$ 且 $B \\subseteq A$：$A = B$，只是列出的顺序不同。",
          ),
          t(
            "Each set has an element the other lacks, so neither is a subset of the other.",
            "每个集合都有对方没有的元素，所以两者互不为子集。",
          ),
        ];
        return reasoned(
          choiceProblem({
            prompt: t(
              `Let $A = ${aStr}$ and $B = ${bStr}$. Which relationship between $A$ and $B$ is correct?`,
              `设 $A = ${aStr}$ 且 $B = ${bStr}$。下列关于 $A$ 与 $B$ 之间关系的表述哪项是正确的？`,
            ),
            options,
            correct: relation,
            solution: walked(
              [
                [["Look for elements left out", "寻找被漏掉的元素"], look],
                [["Decide the relation", "判断关系"], decide[relation]!],
              ],
              t(
                `$|A| = ${a.length}$ and $|B| = ${b.length}$, with $${shared.length}$ elements in common, which fits this relation.`,
                `$|A| = ${a.length}$，$|B| = ${b.length}$，公共元素 $${shared.length}$ 个，与这一关系相符。`,
              ),
            ),
          }),
          reasons,
        );
      },
    },
    {
      id: "the-power-set",
      title: t("The power set", "幂集"),
      explanation: t(
        "The power set of a set $A$, denoted $\\mathcal{P}(A)$ or $2^A$, is the set of all subsets of $A$. If $|A| = n$, then $|\\mathcal{P}(A)| = 2^n$. For example, if $A = \\{1, 2\\}$, then $\\mathcal{P}(A) = \\{\\emptyset, \\{1\\}, \\{2\\}, \\{1, 2\\}\\}$ and $|\\mathcal{P}(A)| = 2^2 = 4$. The count comes from building a subset: each of the $n$ elements is either taken or left, two choices each.\n\n> **Watch out.** The empty set and $A$ itself are subsets of $A$, so they are counted. Leaving them out of $\\mathcal{P}(\\{1, 2\\})$ would give $2$ instead of $4$.",
        "集合 $A$ 的幂集（记作 $\\mathcal{P}(A)$ 或 $2^A$）是由 $A$ 的所有子集组成的集合。若 $|A| = n$，则其幂集的基数为 $|\\mathcal{P}(A)| = 2^n$。例如若 $A = \\{1, 2\\}$，则 $\\mathcal{P}(A) = \\{\\emptyset, \\{1\\}, \\{2\\}, \\{1, 2\\}\\}$，其元素个数为 $2^2 = 4$。这个计数来自构造子集的过程：$n$ 个元素中的每一个都可取或不取，各有两种选择。\n\n> **注意。** 空集和 $A$ 本身都是 $A$ 的子集，都要计入。在 $\\mathcal{P}(\\{1, 2\\})$ 中漏掉它们，会得到 $2$ 而不是 $4$。",
      ),
      generate(rng) {
        const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const n = rng.int(2, 5);
        const elements = rng.sample(pool, n).sort((a, b) => a - b);
        const setStr = `\\{${elements.join(", ")}\\}`;
        const card = 2 ** n;
        const binomials: number[] = [1];
        for (let k = 1; k <= n; k++) binomials.push(((binomials[k - 1] ?? 1) * (n - k + 1)) / k);
        const mistakes = [
          why(
            2 * n,
            `That is $2 \\cdot ${n}$; the two choices for each element multiply: $2 \\cdot 2 \\cdots 2$, ${n} times.`,
            `这是 $2 \\cdot ${n}$；每个元素的两种选择要相乘：$${n}$ 个 $2$ 连乘。`,
          ),
          why(
            n * n,
            `That is $${n}^2$; the count is $2^{${n}}$, two choices for each of the $${n}$ elements.`,
            `这是 $${n}^2$；子集个数是 $2^{${n}}$，$${n}$ 个元素各有两种选择。`,
          ),
          why(
            card - 1,
            "One subset is missing: both $\\emptyset$ and $A$ itself are subsets of $A$.",
            "漏了一个子集：$\\emptyset$ 和 $A$ 本身都是 $A$ 的子集。",
          ),
          why(
            card - 2,
            "Both $\\emptyset$ and $A$ itself are subsets of $A$ and must be counted.",
            "$\\emptyset$ 和 $A$ 本身都是 $A$ 的子集，必须计入。",
          ),
        ].filter((m, i, all) => m.value !== card && all.findIndex((o) => o.value === m.value) === i);
        return numberProblem({
          prompt: t(
            `If finite set $A = ${setStr}$, find the cardinality $|\\mathcal{P}(A)|$ of its power set.`,
            `若有限集合 $A = ${setStr}$，求其幂集的基数 $|\\mathcal{P}(A)|$。`,
          ),
          answer: card,
          solution: walked(
            [
              [["Count the elements", "数元素"], t(`$A$ has $|A| = ${n}$ elements.`, `$A$ 有 $|A| = ${n}$ 个元素。`)],
              [
                ["Choose for each element", "对每个元素作选择"],
                t(
                  `A subset takes or leaves each element, two choices each, so $|\\mathcal{P}(A)| = 2^{${n}} = ${card}$.`,
                  `子集对每个元素取或不取，各两种选择，所以 $|\\mathcal{P}(A)| = 2^{${n}} = ${card}$。`,
                ),
              ],
            ],
            t(
              `Counting subsets by size, from $0$ to $${n}$ elements: $${binomials.join(" + ")} = ${card}$.`,
              `按子集的元素个数从 $0$ 到 $${n}$ 分别计数：$${binomials.join(" + ")} = ${card}$。`,
            ),
          ),
          mistakes,
        });
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// MODULE 1.2: SET OPERATIONS
// ═════════════════════════════════════════════════════════════════════════════

// ─── 1.2.1 The Difference of Sets ────────────────────────────────────────────

export const theDifferenceOfSets: TopicDef = {
  id: "the-difference-of-sets",
  title: t("The Difference of Sets", "集合的差集"),
  summary: t(
    "Compute the relative difference A \\ B of two sets and apply algebraic properties of set difference.",
    "计算两个集合的相对差集 A \\ B，并掌握差集的代数运算性质。",
  ),
  intro: t(
    "Let $A = \\{1, 2, 3, 4\\}$ and $B = \\{3, 4, 5\\}$. Taking away from $A$ everything that is also in $B$ removes $3$ and $4$ and leaves $A \\setminus B = \\{1, 2\\}$. The other way round, $B \\setminus A = \\{5\\}$: the order matters.\n\nCheck: putting back the shared elements, $\\{1, 2\\} \\cup \\{3, 4\\} = \\{1, 2, 3, 4\\}$ rebuilds $A$.\n\nIn this lesson we compute the difference of two sets, and combine differences into the symmetric difference.",
    "设 $A = \\{1, 2, 3, 4\\}$，$B = \\{3, 4, 5\\}$。从 $A$ 中去掉所有也在 $B$ 中的元素，去掉了 $3$ 和 $4$，剩下 $A \\setminus B = \\{1, 2\\}$。反过来，$B \\setminus A = \\{5\\}$：顺序是有关系的。\n\n检验：把公共元素放回去，$\\{1, 2\\} \\cup \\{3, 4\\} = \\{1, 2, 3, 4\\}$，重新得到 $A$。\n\n本课我们计算两个集合的差，并把两个差合成对称差。",
  ),
  prerequisites: ["subsets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "computing-the-set-difference",
      title: t("Computing the set difference", "计算集合的相对差集"),
      explanation: t(
        "The relative complement (or difference) of $B$ in $A$, denoted $A \\setminus B$ (or $A - B$), is the set of elements that belong to $A$ but do not belong to $B$: $A \\setminus B = \\{x \\in A \\mid x \\notin B\\}$. To compute it, go through the elements of $A$ and cross out each one that also lies in $B$; the elements of $B$ that are not in $A$ play no part.\n\n> **Watch out.** $A \\setminus B$ and $B \\setminus A$ are different sets. With $A = \\{1, 2, 3\\}$ and $B = \\{3, 4\\}$, $A \\setminus B = \\{1, 2\\}$ but $B \\setminus A = \\{4\\}$.",
        "集合 $B$ 相对于集合 $A$ 的相对补集（或差集），记作 $A \\setminus B$（或 $A - B$），是由所有属于 $A$ 但不属于 $B$ 的元素组成的集合：$A \\setminus B = \\{x \\in A \\mid x \\notin B\\}$。计算时，依次查看 $A$ 的元素，划去每个也在 $B$ 中的元素；$B$ 中不在 $A$ 里的元素与结果无关。\n\n> **注意。** $A \\setminus B$ 与 $B \\setminus A$ 是不同的集合。若 $A = \\{1, 2, 3\\}$，$B = \\{3, 4\\}$，则 $A \\setminus B = \\{1, 2\\}$，而 $B \\setminus A = \\{4\\}$。",
      ),
      generate(rng) {
        const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const shared = rng.sample(pool, 2).sort((a, b) => a - b);
        const onlyA = rng
          .sample(
            pool.filter((x) => !shared.includes(x)),
            3,
          )
          .sort((a, b) => a - b);
        const onlyB = rng
          .sample(
            pool.filter((x) => !shared.includes(x) && !onlyA.includes(x)),
            2,
          )
          .sort((a, b) => a - b);

        const A = [...shared, ...onlyA].sort((a, b) => a - b);
        const B = [...shared, ...onlyB].sort((a, b) => a - b);

        const aStr = `\\{${A.join(", ")}\\}`;
        const bStr = `\\{${B.join(", ")}\\}`;
        const diffStr = `\\{${onlyA.join(", ")}\\}`;
        return solutionsProblem({
          prompt: t(
            `Find all elements of the set difference $A \\setminus B$, where $A = ${aStr}$ and $B = ${bStr}$.`,
            `求差集 $A \\setminus B$ 的全部元素，其中 $A = ${aStr}$ 且 $B = ${bStr}$。`,
          ),
          values: onlyA.map(String),
          variable: "x",
          solution: walked(
            [
              [
                ["Find the shared elements", "找出公共元素"],
                t(
                  `The elements of $A$ that also lie in $B$ are $${shared.join(", ")}$.`,
                  `$A$ 中也在 $B$ 里的元素是 $${shared.join(", ")}$。`,
                ),
              ],
              [
                ["Cross them out of $A$", "从 $A$ 中划去"],
                t(
                  `Removing them from $A$ leaves $A \\setminus B = ${diffStr}$.`,
                  `把它们从 $A$ 中去掉，剩下 $A \\setminus B = ${diffStr}$。`,
                ),
              ],
            ],
            t(
              `None of $${onlyA.join(", ")}$ appears in $B = ${bStr}$, and together with $${shared.join(", ")}$ they make up all of $A$.`,
              `$${onlyA.join(", ")}$ 都不在 $B = ${bStr}$ 中，而它们与 $${shared.join(", ")}$ 合起来恰好是整个 $A$。`,
            ),
          ),
          mistakes: [
            whySet(
              onlyB.map(String),
              "That is $B \\setminus A$, the elements of $B$ outside $A$; the question asks for the elements of $A$ outside $B$.",
              "这是 $B \\setminus A$，即 $B$ 中不在 $A$ 里的元素；题目要的是 $A$ 中不在 $B$ 里的元素。",
            ),
            whySet(
              shared.map(String),
              "Those are the elements in both sets, $A \\cap B$; they are exactly the ones to remove.",
              "这些是两个集合共有的元素 $A \\cap B$；它们恰恰是要去掉的。",
            ),
            whySet(
              A.map(String),
              "That is all of $A$: the elements that also lie in $B$ must be removed.",
              "这是整个 $A$：也在 $B$ 中的元素必须去掉。",
            ),
            whySet(
              [...onlyA, ...onlyB].map(String),
              "Elements of $B$ never belong to $A \\setminus B$; only elements of $A$ can.",
              "$B$ 的元素从不属于 $A \\setminus B$；只有 $A$ 的元素才可能属于。",
            ),
          ],
        });
      },
    },
    {
      id: "properties-of-set-difference",
      title: t("Properties of set difference", "差集的性质"),
      explanation: t(
        "The difference of two sets keeps the elements of the first set that are not in the second, so it never shares any element with the second set. Important properties of set difference include: $A \\setminus A = \\emptyset$, $A \\setminus \\emptyset = A$, $(A \\setminus B) \\cap B = \\emptyset$, and $A \\setminus B = A \\iff A \\cap B = \\emptyset$. Also, $A \\setminus (A \\setminus B) = A \\cap B$. The symmetric difference is $(A \\setminus B) \\cup (B \\setminus A)$: the elements that lie in exactly one of the two sets.\n\n> **Watch out.** The symmetric difference is not the union: it leaves out the shared elements. For $\\{1, 2, 3\\}$ and $\\{3, 4\\}$ the symmetric difference is $\\{1, 2, 4\\}$, while the union is $\\{1, 2, 3, 4\\}$.",
        "两个集合的差保留第一个集合中不属于第二个集合的元素，所以它与第二个集合没有公共元素。差集的重要运算性质包括：$A \\setminus A = \\emptyset$，$A \\setminus \\emptyset = A$，$(A \\setminus B) \\cap B = \\emptyset$，以及 $A \\setminus B = A \\iff A \\cap B = \\emptyset$。此外还有 $A \\setminus (A \\setminus B) = A \\cap B$。对称差集定义为 $(A \\setminus B) \\cup (B \\setminus A)$：恰好属于两个集合之一的元素。\n\n> **注意。** 对称差不是并集：它不含公共元素。$\\{1, 2, 3\\}$ 与 $\\{3, 4\\}$ 的对称差是 $\\{1, 2, 4\\}$，而并集是 $\\{1, 2, 3, 4\\}$。",
      ),
      generate(rng) {
        const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const shared = rng.sample(pool, 2).sort((a, b) => a - b);
        const onlyA = rng
          .sample(
            pool.filter((x) => !shared.includes(x)),
            2,
          )
          .sort((a, b) => a - b);
        const onlyB = rng
          .sample(
            pool.filter((x) => !shared.includes(x) && !onlyA.includes(x)),
            2,
          )
          .sort((a, b) => a - b);
        const A = [...shared, ...onlyA].sort((a, b) => a - b);
        const B = [...shared, ...onlyB].sort((a, b) => a - b);
        const aStr = `\\{${A.join(", ")}\\}`;
        const bStr = `\\{${B.join(", ")}\\}`;
        const symDiff = [...onlyA, ...onlyB].sort((a, b) => a - b);
        const symDiffStr = `\\{${symDiff.join(", ")}\\}`;
        const unionAll = [...new Set([...A, ...B])].sort((a, b) => a - b);

        return solutionsProblem({
          prompt: t(
            `Given sets $A = ${aStr}$ and $B = ${bStr}$, find all elements of the symmetric difference $(A \\setminus B) \\cup (B \\setminus A)$.`,
            `已知集合 $A = ${aStr}$ 与 $B = ${bStr}$，求对称差集 $(A \\setminus B) \\cup (B \\setminus A)$ 的全部元素。`,
          ),
          values: symDiff.map(String),
          variable: "x",
          solution: walked(
            [
              [
                ["Compute both differences", "求出两个差"],
                t(
                  `Removing the shared $${shared.join(", ")}$: $A \\setminus B = \\{${onlyA.join(", ")}\\}$ and $B \\setminus A = \\{${onlyB.join(", ")}\\}$.`,
                  `去掉公共元素 $${shared.join(", ")}$：$A \\setminus B = \\{${onlyA.join(", ")}\\}$，$B \\setminus A = \\{${onlyB.join(", ")}\\}$。`,
                ),
              ],
              [
                ["Take the union", "取并集"],
                t(
                  `$(A \\setminus B) \\cup (B \\setminus A) = ${symDiffStr}$.`,
                  `$(A \\setminus B) \\cup (B \\setminus A) = ${symDiffStr}$。`,
                ),
              ],
            ],
            t(
              `The union $A \\cup B$ has $${unionAll.length}$ elements; removing the $${shared.length}$ shared ones leaves $${unionAll.length - shared.length}$, the size of $${symDiffStr}$.`,
              `并集 $A \\cup B$ 有 $${unionAll.length}$ 个元素；去掉 $${shared.length}$ 个公共元素剩 $${unionAll.length - shared.length}$ 个，正是 $${symDiffStr}$ 的大小。`,
            ),
          ),
          mistakes: [
            whySet(
              unionAll.map(String),
              `That is the union $A \\cup B$; the shared elements $${shared.join(", ")}$ lie in neither difference.`,
              `这是并集 $A \\cup B$；公共元素 $${shared.join(", ")}$ 不属于任何一个差。`,
            ),
            whySet(
              shared.map(String),
              "Those are the elements in both sets, $A \\cap B$: exactly the ones the symmetric difference leaves out.",
              "这些是两个集合共有的元素 $A \\cap B$：恰恰是对称差排除的元素。",
            ),
            whySet(
              onlyA.map(String),
              "That is only $A \\setminus B$; the union with $B \\setminus A$ adds the elements of $B$ outside $A$.",
              "这只是 $A \\setminus B$；与 $B \\setminus A$ 取并还要加上 $B$ 中不在 $A$ 里的元素。",
            ),
          ],
        });
      },
    },
  ],
};

// ─── 1.2.2 Set Complements ───────────────────────────────────────────────────

export const setComplements: TopicDef = {
  id: "set-complements",
  title: t("Set Complements", "补集与全集"),
  summary: t(
    "Find absolute complements with respect to a universal set and apply De Morgan's laws.",
    "求关于全集的绝对补集，并掌握并集与交集的德摩根定律。",
  ),
  intro: t(
    "Take the universal set $U = \\{1, 2, 3, 4, 5, 6\\}$ and $A = \\{2, 4, 6\\}$. The complement $A^c$ collects everything in $U$ that is not in $A$: $A^c = \\{1, 3, 5\\}$. So $|A^c| = |U| - |A| = 6 - 3 = 3$.\n\nCheck: $A$ and $A^c$ share no element, and together, $\\{2, 4, 6\\} \\cup \\{1, 3, 5\\}$, they make up all of $U$.\n\nIn this lesson we take complements within a universal set, and use De Morgan's laws for the complement of a union or an intersection.",
    "取全集 $U = \\{1, 2, 3, 4, 5, 6\\}$，$A = \\{2, 4, 6\\}$。补集 $A^c$ 收集 $U$ 中所有不在 $A$ 里的元素：$A^c = \\{1, 3, 5\\}$。所以 $|A^c| = |U| - |A| = 6 - 3 = 3$。\n\n检验：$A$ 与 $A^c$ 没有公共元素，而合起来 $\\{2, 4, 6\\} \\cup \\{1, 3, 5\\}$ 正是整个 $U$。\n\n本课我们在全集中取补集，并用德摩根定律求并集或交集的补集。",
  ),
  prerequisites: ["the-difference-of-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "absolute-complement-with-respect-to-universal-set",
      title: t("Absolute complement with respect to a universal set", "全集下的绝对补集"),
      explanation: t(
        "When all sets under consideration are subsets of a universal set $U$, the absolute complement of $A$, denoted $A^c$ or $A'$ or $\\overline{A}$, is $U \\setminus A = \\{x \\in U \\mid x \\notin A\\}$. Clearly, $A \\cup A^c = U$ and $A \\cap A^c = \\emptyset$, so for a finite $U$, $|A^c| = |U| - |A|$.\n\n> **Watch out.** A complement depends on the universal set. With $U = \\{1, \\dots, 6\\}$, $\\{2, 4, 6\\}^c = \\{1, 3, 5\\}$; with $U = \\{1, \\dots, 8\\}$, the same set has complement $\\{1, 3, 5, 7, 8\\}$.",
        "当所研究的集合都是全集 $U$ 的子集时，$A$ 关于 $U$ 的绝对补集（记作 $A^c$、$\\overline{A}$ 或 $A'$）定义为 $U \\setminus A = \\{x \\in U \\mid x \\notin A\\}$。显然有 $A \\cup A^c = U$ 且 $A \\cap A^c = \\emptyset$，所以当 $U$ 有限时，$|A^c| = |U| - |A|$。\n\n> **注意。** 补集取决于全集。若 $U = \\{1, \\dots, 6\\}$，则 $\\{2, 4, 6\\}^c = \\{1, 3, 5\\}$；若 $U = \\{1, \\dots, 8\\}$，同一个集合的补集是 $\\{1, 3, 5, 7, 8\\}$。",
      ),
      generate(rng) {
        const n = rng.int(8, 25);
        const U: number[] = [];
        for (let i = 1; i <= n; i++) U.push(i);
        const k = rng.pick([2, 3, 4, 5]);
        const A: number[] = [];
        const Ac: number[] = [];
        for (const x of U) {
          if (x % k === 0) A.push(x);
          else Ac.push(x);
        }
        const uStr = `\\{1, 2, \\dots, ${n}\\}`;
        const aStr = `\\{${A.join(", ")}\\}`;
        const mistakes = [
          why(
            A.length,
            `$${A.length}$ is $|A|$, the number of multiples of $${k}$; the complement holds the other elements of $U$.`,
            `$${A.length}$ 是 $|A|$，即 $${k}$ 的倍数的个数；补集是 $U$ 中其余的元素。`,
          ),
          why(n, `$${n}$ is $|U|$; the elements of $A$ are not in $A^c$.`, `$${n}$ 是 $|U|$；$A$ 的元素不在 $A^c$ 中。`),
          why(
            n - k,
            `The complement removes the $${A.length}$ elements of $A$, not $${k}$ elements.`,
            `补集去掉的是 $A$ 的 $${A.length}$ 个元素，而不是 $${k}$ 个。`,
          ),
        ].filter((m, i, all) => m.value !== Ac.length && all.findIndex((o) => o.value === m.value) === i);
        return numberProblem({
          prompt: t(
            `Let universal set $U = ${uStr}$ and $A = \\{x \\in U \\mid x \\text{ is a multiple of } ${k}\\} = ${aStr}$. Find the cardinality $|A^c|$ of the complement.`,
            `设全集 $U = ${uStr}$ 且 $A = \\{x \\in U \\mid x \\text{ 是 } ${k} \\text{ 的倍数}\\} = ${aStr}$。求补集 $A^c$ 的基数 $|A^c|$。`,
          ),
          answer: Ac.length,
          solution: walked(
            [
              [
                ["Count the two sets", "数两个集合"],
                t(
                  `$|U| = ${n}$, and $A$ lists $${A.length}$ elements, so $|A| = ${A.length}$.`,
                  `$|U| = ${n}$，$A$ 列出了 $${A.length}$ 个元素，所以 $|A| = ${A.length}$。`,
                ),
              ],
              [
                ["Subtract", "相减"],
                t("$A^c$ is the rest of $U$:", "$A^c$ 是 $U$ 中其余的部分："),
                [`|A^c| = |U| - |A| = ${n} - ${A.length} = ${Ac.length}`],
              ],
            ],
            t(
              `$A^c = \\{${Ac.join(", ")}\\}$, the numbers in $U$ that are not multiples of $${k}$; listing them gives $${Ac.length}$.`,
              `$A^c = \\{${Ac.join(", ")}\\}$，即 $U$ 中不是 $${k}$ 的倍数的数；逐个列出共 $${Ac.length}$ 个。`,
            ),
          ),
          mistakes,
        });
      },
    },
    {
      id: "de-morgans-laws",
      title: t("De Morgan's laws for sets", "集合的德摩根定律"),
      explanation: t(
        "De Morgan's Laws state that for any subsets $A, B \\subseteq U$:\n\n1. $(A \\cup B)^c = A^c \\cap B^c$\n2. $(A \\cap B)^c = A^c \\cup B^c$\n\nThe complement of a union is the intersection of the complements, and the complement of an intersection is the union of the complements. To find $|(A \\cup B)^c|$, find $A \\cup B$ first and subtract its size from $|U|$.\n\n> **Watch out.** Taking a complement swaps $\\cup$ and $\\cap$. With $U = \\{1, 2, 3\\}$, $A = \\{1\\}$ and $B = \\{2\\}$, $(A \\cup B)^c = \\{3\\}$, but $A^c \\cup B^c = \\{2, 3\\} \\cup \\{1, 3\\} = \\{1, 2, 3\\}$.",
        "德摩根定律指出，对全集 $U$ 的任意子集 $A, B$：\n\n1. $(A \\cup B)^c = A^c \\cap B^c$\n2. $(A \\cap B)^c = A^c \\cup B^c$\n\n并集的补集等于补集的交集，交集的补集等于补集的并集。要求 $|(A \\cup B)^c|$，先求 $A \\cup B$，再从 $|U|$ 中减去它的大小。\n\n> **注意。** 取补集会把 $\\cup$ 与 $\\cap$ 互换。若 $U = \\{1, 2, 3\\}$，$A = \\{1\\}$，$B = \\{2\\}$，则 $(A \\cup B)^c = \\{3\\}$，而 $A^c \\cup B^c = \\{2, 3\\} \\cup \\{1, 3\\} = \\{1, 2, 3\\}$。",
      ),
      generate(rng) {
        const n = rng.int(8, 15);
        const U: number[] = [];
        for (let i = 1; i <= n; i++) U.push(i);
        const aVals = rng.sample(U, rng.int(2, 4)).sort((a, b) => a - b);
        const bVals = rng.sample(U, rng.int(2, 4)).sort((a, b) => a - b);
        const B = new Set(bVals);
        const unionSet = new Set([...aVals, ...bVals]);
        const interSet = new Set(aVals.filter((x) => B.has(x)));
        const setLatex = (s: Set<number>) => (s.size === 0 ? "\\emptyset" : `\\{${[...s].sort((a, b) => a - b).join(", ")}\\}`);
        const isUnion = rng.bool();
        const [inner, other] = isUnion ? [unionSet, interSet] : [interSet, unionSet];
        const res = n - inner.size;
        const op = isUnion ? "\\cup" : "\\cap";
        const swapped = isUnion ? "A^c \\cap B^c" : "A^c \\cup B^c";
        const wrongSide = isUnion ? "A^c \\cup B^c" : "A^c \\cap B^c";
        const mistakes = [
          why(
            inner.size,
            `$${inner.size}$ is the size of $A ${op} B$ itself; the complement is everything else in $U$.`,
            `$${inner.size}$ 是 $A ${op} B$ 本身的大小；补集是 $U$ 中其余的一切。`,
          ),
          why(
            n - other.size,
            `That counts $${wrongSide}$; by De Morgan's laws the complement of $A ${op} B$ is $${swapped}$.`,
            `这数的是 $${wrongSide}$；由德摩根定律，$A ${op} B$ 的补集是 $${swapped}$。`,
          ),
          why(
            n - aVals.length - bVals.length,
            "Subtracting $|A|$ and $|B|$ separately removes the shared elements twice; subtract the size of the combined set once.",
            "分别减去 $|A|$ 和 $|B|$ 会把公共元素减两次；应只减一次合并后集合的大小。",
          ),
        ].filter((m, i, all) => m.value !== res && all.findIndex((o) => o.value === m.value) === i);
        return numberProblem({
          prompt: t(
            `Let $U = \\{1, \\dots, ${n}\\}$, $A = \\{${aVals.join(", ")}\\}$, and $B = \\{${bVals.join(", ")}\\}$. Find the cardinality $|(A ${op} B)^c|$ of the complement of the ${isUnion ? "union" : "intersection"}.`,
            `设全集 $U = \\{1, \\dots, ${n}\\}$，$A = \\{${aVals.join(", ")}\\}$，$B = \\{${bVals.join(", ")}\\}$。求${isUnion ? "并集" : "交集"}的补集的基数 $|(A ${op} B)^c|$。`,
          ),
          answer: res,
          solution: walked(
            [
              [
                ["Combine the sets", isUnion ? "求并集" : "求交集"],
                t(
                  `$A ${op} B = ${setLatex(inner)}$, with $${inner.size}$ elements.`,
                  `$A ${op} B = ${setLatex(inner)}$，共 $${inner.size}$ 个元素。`,
                ),
              ],
              [
                ["Take the complement", "取补集"],
                t("Everything else in $U$ is in the complement:", "$U$ 中其余的元素都在补集中："),
                [`|(A ${op} B)^c| = ${n} - ${inner.size} = ${res}`],
              ],
            ],
            t(
              `By De Morgan's laws, $(A ${op} B)^c = ${swapped}$. Counting the elements of $U$ that lie ${isUnion ? "in neither $A$ nor $B$" : "outside $A$ or outside $B$"} gives $${res}$ again.`,
              `由德摩根定律，$(A ${op} B)^c = ${swapped}$。数 $U$ 中${isUnion ? "既不在 $A$ 也不在 $B$" : "不在 $A$ 或不在 $B$"}的元素，同样得到 $${res}$。`,
            ),
          ),
          mistakes,
        });
      },
    },
  ],
};

// ─── 1.2.3 The Cartesian Product ─────────────────────────────────────────────

export const theCartesianProduct: TopicDef = {
  id: "the-cartesian-product",
  title: t("The Cartesian Product", "笛卡尔积"),
  summary: t("Construct the Cartesian product of two sets and evaluate its cardinality.", "构造两个集合的笛卡尔积并计算其元素总数。"),
  intro: t(
    "Pair every element of $A = \\{1, 2\\}$ with every element of $B = \\{5, 6, 7\\}$, putting the element of $A$ first: $(1, 5), (1, 6), (1, 7), (2, 5), (2, 6), (2, 7)$. These six ordered pairs form the Cartesian product $A \\times B$.\n\nCheck: each of the $2$ elements of $A$ starts $3$ pairs, one for each element of $B$, and $2 \\cdot 3 = 6$.\n\nIn this lesson we recognise the elements of a Cartesian product, and count them.",
    "把 $A = \\{1, 2\\}$ 的每个元素与 $B = \\{5, 6, 7\\}$ 的每个元素配对，$A$ 的元素放在前面：$(1, 5), (1, 6), (1, 7), (2, 5), (2, 6), (2, 7)$。这六个有序对构成笛卡尔积 $A \\times B$。\n\n检验：$A$ 的 $2$ 个元素各开头 $3$ 个有序对，$B$ 的每个元素一个，$2 \\cdot 3 = 6$。\n\n本课我们辨认笛卡尔积的元素，并数出它们的个数。",
  ),
  prerequisites: ["subsets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "elements-of-the-cartesian-product",
      title: t("Elements of the Cartesian product", "笛卡尔积的元素与序偶"),
      explanation: t(
        "The Cartesian product $A \\times B$ is the set of all ordered pairs $(a, b)$ where $a \\in A$ and $b \\in B$: $A \\times B = \\{(a, b) \\mid a \\in A, b \\in B\\}$. In general, $A \\times B \\neq B \\times A$ because ordered pairs depend on order: $(a, b) \\neq (b, a)$ when $a \\neq b$. To test a pair, check its two entries separately: the first against $A$, the second against $B$.\n\n> **Watch out.** Both numbers appearing somewhere is not enough. With $A = \\{1, 2\\}$ and $B = \\{5, 6\\}$, the pair $(5, 1)$ is not in $A \\times B$: its first entry $5$ is not in $A$.",
        "两个集合 $A$ 与 $B$ 的笛卡尔积 $A \\times B$ 是由所有有序对 $(a, b)$ 组成的集合，其中 $a \\in A$ 且 $b \\in B$：$A \\times B = \\{(a, b) \\mid a \\in A, b \\in B\\}$。一般而言 $A \\times B \\neq B \\times A$，因为有序对依赖于元素次序：当 $a \\neq b$ 时 $(a, b) \\neq (b, a)$。检验一个有序对时，分别检查两个分量：第一个对照 $A$，第二个对照 $B$。\n\n> **注意。** 两个数都出现过还不够。若 $A = \\{1, 2\\}$，$B = \\{5, 6\\}$，则有序对 $(5, 1)$ 不在 $A \\times B$ 中：它的第一个分量 $5$ 不在 $A$ 中。",
      ),
      generate(rng) {
        const poolA = [1, 2, 3, 4, 5, 6];
        const poolB = [7, 8, 9, 10, 11, 12];
        const A = rng.sample(poolA, 2).sort((a, b) => a - b);
        const B = rng.sample(poolB, 2).sort((a, b) => a - b);
        const rightPair = `(${A[0]}, ${B[0]})`;
        const wrongPair1 = `(${B[0]}, ${A[0]})`; // reversed order
        const wrongPair2 = `(${A[0]}, ${A[1]})`;
        const wrongPair3 = `(${B[0]}, ${B[1]})`;
        const pair = (s: string) => t(`$${s}$`, `$${s}$`);
        return explained(
          rng,
          t(
            `Let $A = \\{${A.join(", ")}\\}$ and $B = \\{${B.join(", ")}\\}$. Which of the following ordered pairs is an element of $A \\times B$?`,
            `设 $A = \\{${A.join(", ")}\\}$ 且 $B = \\{${B.join(", ")}\\}$。下列哪个有序对属于笛卡尔积 $A \\times B$？`,
          ),
          pair(rightPair),
          [
            [
              pair(wrongPair1),
              `The order is reversed: the first entry $${B[0]}$ is not in $A$. This pair lies in $B \\times A$.`,
              `次序反了：第一个分量 $${B[0]}$ 不在 $A$ 中。这个有序对属于 $B \\times A$。`,
            ],
            [
              pair(wrongPair2),
              `The second entry $${A[1]}$ is not in $B$; both entries come from $A$.`,
              `第二个分量 $${A[1]}$ 不在 $B$ 中；两个分量都来自 $A$。`,
            ],
            [
              pair(wrongPair3),
              `The first entry $${B[0]}$ is not in $A$; both entries come from $B$.`,
              `第一个分量 $${B[0]}$ 不在 $A$ 中；两个分量都来自 $B$。`,
            ],
          ],
          walked(
            [
              [
                ["Check the first entry", "检查第一个分量"],
                t(`$${A[0]} \\in A = \\{${A.join(", ")}\\}$.`, `$${A[0]} \\in A = \\{${A.join(", ")}\\}$。`),
              ],
              [
                ["Check the second entry", "检查第二个分量"],
                t(
                  `$${B[0]} \\in B = \\{${B.join(", ")}\\}$, so $${rightPair} \\in A \\times B$.`,
                  `$${B[0]} \\in B = \\{${B.join(", ")}\\}$，所以 $${rightPair} \\in A \\times B$。`,
                ),
              ],
            ],
            t(
              `$A \\times B = \\{(${A[0]}, ${B[0]}), (${A[0]}, ${B[1]}), (${A[1]}, ${B[0]}), (${A[1]}, ${B[1]})\\}$, and $${rightPair}$ is the first pair in this list.`,
              `$A \\times B = \\{(${A[0]}, ${B[0]}), (${A[0]}, ${B[1]}), (${A[1]}, ${B[0]}), (${A[1]}, ${B[1]})\\}$，$${rightPair}$ 是其中的第一个有序对。`,
            ),
          ),
        );
      },
    },
    {
      id: "cardinality-of-cartesian-products",
      title: t("Cardinality of Cartesian products", "笛卡尔积的基数"),
      explanation: t(
        "For finite sets $A$ and $B$, the number of elements in their Cartesian product is the product of their cardinalities: $|A \\times B| = |A| \\cdot |B|$. For multiple sets, $|A_1 \\times A_2 \\times \\cdots \\times A_k| = |A_1| \\cdot |A_2| \\cdots |A_k|$. The pairs can be arranged in a table with one row for each element of $A$ and one column for each element of $B$.\n\n> **Watch out.** Multiply, do not add. If $|A| = 3$ and $|B| = 4$, the table has $3$ rows of $4$ pairs, so $|A \\times B| = 12$, not $3 + 4 = 7$.",
        "对于有限集合 $A$ 与 $B$，其笛卡尔积的元素个数等于各自基数的乘积：$|A \\times B| = |A| \\cdot |B|$。推广到多个有限集合，$|A_1 \\times A_2 \\times \\cdots \\times A_k| = |A_1| \\cdot |A_2| \\cdots |A_k|$。这些有序对可以排成一张表：$A$ 的每个元素一行，$B$ 的每个元素一列。\n\n> **注意。** 要相乘，不是相加。若 $|A| = 3$，$|B| = 4$，表中有 $3$ 行、每行 $4$ 个有序对，所以 $|A \\times B| = 12$，而不是 $3 + 4 = 7$。",
      ),
      generate(rng) {
        const m = rng.int(2, 8);
        const n = rng.int(2, 8);
        const prod = m * n;
        const mistakes = [
          why(
            m + n,
            `That adds the sizes; each of the $${m}$ elements of $A$ pairs with all $${n}$ elements of $B$, so the sizes multiply.`,
            `这是把两个大小相加；$A$ 的 $${m}$ 个元素各与 $B$ 的全部 $${n}$ 个元素配对，所以应相乘。`,
          ),
          why(
            m * m,
            `That is $|A|^2 = |A \\times A|$; the second entry comes from $B$, which has $${n}$ elements.`,
            `这是 $|A|^2 = |A \\times A|$；第二个分量来自 $B$，它有 $${n}$ 个元素。`,
          ),
          why(
            n * n,
            `That is $|B|^2 = |B \\times B|$; the first entry comes from $A$, which has $${m}$ elements.`,
            `这是 $|B|^2 = |B \\times B|$；第一个分量来自 $A$，它有 $${m}$ 个元素。`,
          ),
        ].filter((x, i, all) => x.value !== prod && all.findIndex((y) => y.value === x.value) === i);
        return numberProblem({
          prompt: t(
            `If finite set $A$ has $|A| = ${m}$ and finite set $B$ has $|B| = ${n}$, find $|A \\times B|$.`,
            `若有限集合 $A$ 满足 $|A| = ${m}$，有限集合 $B$ 满足 $|B| = ${n}$，求 $|A \\times B|$。`,
          ),
          answer: prod,
          solution: walked(
            [
              [
                ["Arrange the pairs in a table", "把有序对排成表"],
                t(
                  `One row for each of the $${m}$ elements of $A$, one column for each of the $${n}$ elements of $B$.`,
                  `$A$ 的 $${m}$ 个元素各占一行，$B$ 的 $${n}$ 个元素各占一列。`,
                ),
              ],
              [["Count the cells", "数格子"], t("", ""), [`|A \\times B| = |A| \\cdot |B| = ${m} \\cdot ${n} = ${prod}`]],
            ],
            t(
              `Adding the $${m}$ rows of $${n}$ pairs one by one: $${Array.from({ length: m }, () => n).join(" + ")} = ${prod}$.`,
              `把 $${m}$ 行、每行 $${n}$ 个有序对逐行相加：$${Array.from({ length: m }, () => n).join(" + ")} = ${prod}$。`,
            ),
          ),
          mistakes,
        });
      },
    },
  ],
};

// ─── 1.2.4 Visualizing Cartesian Products ────────────────────────────────────

export const visualizingCartesianProducts: TopicDef = {
  id: "visualizing-cartesian-products",
  title: t("Visualizing Cartesian Products", "笛卡尔积的几何表示"),
  summary: t(
    "Visualize Cartesian products as discrete lattices or continuous rectangular regions in the Cartesian plane.",
    "将笛卡尔积在平面直角坐标系中可视化为离散网格点集或矩形连续区域。",
  ),
  intro: t(
    "Plot $\\{1, 2, 3\\} \\times \\{1, 2\\}$ in the plane, reading each pair $(x, y)$ as a point: the six points form a grid of $3$ columns and $2$ rows. Replace the sets by intervals and the gaps fill in: $[1, 3] \\times [1, 2]$ is the whole rectangle with $1 \\le x \\le 3$ and $1 \\le y \\le 2$, of width $2$ and height $1$.\n\nCheck: the corner $(3, 2)$ belongs to both, since $3$ is in $\\{1, 2, 3\\}$ and in $[1, 3]$, and $2$ is in $\\{1, 2\\}$ and in $[1, 2]$.\n\nIn this lesson we draw Cartesian products as grids of points and as rectangles, and count or measure them.",
    "在平面上画出 $\\{1, 2, 3\\} \\times \\{1, 2\\}$，把每个有序对 $(x, y)$ 看成一个点：六个点组成 $3$ 列 $2$ 行的网格。把集合换成区间，空隙就被填满：$[1, 3] \\times [1, 2]$ 是满足 $1 \\le x \\le 3$、$1 \\le y \\le 2$ 的整个矩形，宽 $2$、高 $1$。\n\n检验：角点 $(3, 2)$ 同时属于两者，因为 $3$ 既在 $\\{1, 2, 3\\}$ 中也在 $[1, 3]$ 中，$2$ 既在 $\\{1, 2\\}$ 中也在 $[1, 2]$ 中。\n\n本课我们把笛卡尔积画成点阵和矩形，并数出点数或量出面积。",
  ),
  prerequisites: ["the-cartesian-product"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "discrete-cartesian-grids",
      title: t("Discrete Cartesian product grids", "离散笛卡尔积网格点"),
      explanation: t(
        "When $A$ and $B$ are discrete subsets of $\\mathbb{R}$, $A \\times B$ forms a lattice of points in the Cartesian plane $\\mathbb{R}^2$. The horizontal coordinates come from $A$ and the vertical coordinates from $B$. To count the points of the grid that satisfy a condition on $x$ and a condition on $y$, count the allowed $x$ values and the allowed $y$ values, and multiply.\n\n> **Watch out.** The first quadrant needs both coordinates positive. A point with $x > 0$ and $y < 0$, such as $(2, -1)$, lies in the fourth quadrant, so the negative elements of $B$ give no points of the first quadrant.",
        "当 $A$ 与 $B$ 是实数集 $\\mathbb{R}$ 的离散子集时，$A \\times B$ 在平面直角坐标系 $\\mathbb{R}^2$ 中表示为一个点阵网格。点的横坐标取自 $A$，纵坐标取自 $B$。要数网格中满足关于 $x$ 和关于 $y$ 两个条件的点，分别数出允许的 $x$ 值与 $y$ 值，再相乘。\n\n> **注意。** 第一象限要求两个坐标都为正。$x > 0$ 而 $y < 0$ 的点，例如 $(2, -1)$，位于第四象限，所以 $B$ 中的负数不给出第一象限的点。",
      ),
      generate(rng) {
        const poolX = [1, 2, 3, 4, 5];
        const poolY = [-3, -2, -1, 1, 2, 3];
        const countX = rng.int(2, 4);
        const countY = rng.int(2, 4);
        const A = rng.sample(poolX, countX).sort((a, b) => a - b);
        const B = rng.sample(poolY, countY).sort((a, b) => a - b);
        const positive = B.filter((y) => y > 0);
        const positiveYCount = positive.length;
        const firstQuadrantPoints = A.length * positiveYCount;
        const mistakes = [
          why(
            A.length * B.length,
            `That counts every point of the grid; the points with $y < 0$ lie below the $x$-axis, outside the first quadrant.`,
            `这数的是网格的所有点；$y < 0$ 的点在 $x$ 轴下方，不在第一象限。`,
          ),
          why(
            positiveYCount,
            `That counts the allowed $y$ values only; each of them pairs with all $${A.length}$ values of $x$.`,
            `这只数了允许的 $y$ 值；每个 $y$ 值都与全部 $${A.length}$ 个 $x$ 值配对。`,
          ),
          why(
            A.length + positiveYCount,
            "The counts of allowed $x$ and $y$ values multiply, as in any Cartesian product.",
            "允许的 $x$ 值个数与 $y$ 值个数要相乘，和任何笛卡尔积一样。",
          ),
        ].filter((x, i, all) => x.value !== firstQuadrantPoints && all.findIndex((y) => y.value === x.value) === i);
        return numberProblem({
          prompt: t(
            `Let $A = \\{${A.join(", ")}\\}$ and $B = \\{${B.join(", ")}\\}$. How many points of the Cartesian product $A \\times B$ lie strictly in the first quadrant of $\\mathbb{R}^2$ ($x > 0$ and $y > 0$)?`,
            `设 $A = \\{${A.join(", ")}\\}$ 且 $B = \\{${B.join(", ")}\\}$。笛卡尔积 $A \\times B$ 中共有多少个点严格位于 $\\mathbb{R}^2$ 的第一象限（$x > 0$ 且 $y > 0$）？`,
          ),
          answer: firstQuadrantPoints,
          solution: walked(
            [
              [
                ["Count the allowed coordinates", "数允许的坐标"],
                t(
                  `All $${A.length}$ elements of $A$ are positive. The positive elements of $B$ are ${positiveYCount === 0 ? "none" : `$${positive.join(", ")}$`}: $${positiveYCount}$ of them.`,
                  `$A$ 的全部 $${A.length}$ 个元素都为正。$B$ 中的正数${positiveYCount === 0 ? "没有" : `是 $${positive.join(", ")}$`}：共 $${positiveYCount}$ 个。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `Each allowed $x$ pairs with each allowed $y$: $${A.length} \\cdot ${positiveYCount} = ${firstQuadrantPoints}$ points.`,
                  `每个允许的 $x$ 与每个允许的 $y$ 配对：$${A.length} \\cdot ${positiveYCount} = ${firstQuadrantPoints}$ 个点。`,
                ),
              ],
            ],
            t(
              `The grid has $${A.length} \\cdot ${B.length} = ${A.length * B.length}$ points, of which $${A.length} \\cdot ${B.length - positiveYCount} = ${A.length * (B.length - positiveYCount)}$ have $y < 0$; $${A.length * B.length} - ${A.length * (B.length - positiveYCount)} = ${firstQuadrantPoints}$.`,
              `网格共有 $${A.length} \\cdot ${B.length} = ${A.length * B.length}$ 个点，其中 $${A.length} \\cdot ${B.length - positiveYCount} = ${A.length * (B.length - positiveYCount)}$ 个满足 $y < 0$；$${A.length * B.length} - ${A.length * (B.length - positiveYCount)} = ${firstQuadrantPoints}$。`,
            ),
          ),
          mistakes,
        });
      },
    },
    {
      id: "cartesian-product-of-intervals",
      figure: linearAlgebraDrawings1["visualizing-cartesian-products#cartesian-product-of-intervals"],
      title: t("Cartesian product of intervals", "区间的笛卡尔积与平面矩形"),
      explanation: t(
        "If $I_1 = [a, b]$ and $I_2 = [c, d]$ are intervals on the real line, their Cartesian product $I_1 \\times I_2 = \\{(x, y) \\in \\mathbb{R}^2 \\mid a \\le x \\le b, c \\le y \\le d\\}$ is a rectangle in $\\mathbb{R}^2$ with width $b - a$, height $d - c$, and area $(b - a)(d - c)$.\n\n> **Watch out.** Take each side length as a difference of endpoints, even when an endpoint is negative. $[-2, 3]$ has length $3 - (-2) = 5$, not $3 - 2 = 1$, so $[-2, 3] \\times [0, 4]$ has area $5 \\cdot 4 = 20$.",
        "若 $I_1 = [a, b]$ 与 $I_2 = [c, d]$ 为实数区间，则其笛卡尔积 $I_1 \\times I_2 = \\{(x, y) \\in \\mathbb{R}^2 \\mid a \\le x \\le b, c \\le y \\le d\\}$ 表示平面 $\\mathbb{R}^2$ 上的一个矩形区域，其底宽为 $b - a$，高为 $d - c$，面积为 $(b - a)(d - c)$。\n\n> **注意。** 每条边长都取端点之差，端点为负时也一样。$[-2, 3]$ 的长度是 $3 - (-2) = 5$，不是 $3 - 2 = 1$，所以 $[-2, 3] \\times [0, 4]$ 的面积是 $5 \\cdot 4 = 20$。",
      ),
      generate(rng) {
        const a = rng.int(-5, 3);
        const w = rng.int(2, 8);
        const b = a + w;
        const c = rng.int(-4, 4);
        const h = rng.int(2, 8);
        const d = c + h;
        const area = w * h;
        const mistakes = [
          why(
            2 * (w + h),
            `$2(${w} + ${h}) = ${2 * (w + h)}$ is the perimeter of the rectangle, not its area.`,
            `$2(${w} + ${h}) = ${2 * (w + h)}$ 是矩形的周长，不是面积。`,
          ),
          why(w + h, "The width and the height multiply to give the area.", "面积是宽与高相乘。"),
          why(
            b * d,
            "That multiplies the right endpoints; the sides are the differences $b - a$ and $d - c$.",
            "这是右端点相乘；边长是差 $b - a$ 与 $d - c$。",
          ),
          why(
            Math.abs(Math.abs(b) - Math.abs(a)) * Math.abs(Math.abs(d) - Math.abs(c)),
            "A negative endpoint was treated as positive; subtract it with its sign.",
            "把负端点当成了正数；应带着符号相减。",
          ),
        ].filter((x, i, all) => x.value !== area && all.findIndex((y) => y.value === x.value) === i);
        return numberProblem({
          prompt: t(
            `Find the area of the planar region formed by the Cartesian product $[${a}, ${b}] \\times [${c}, ${d}] \\subset \\mathbb{R}^2$.`,
            `求由笛卡尔积 $[${a}, ${b}] \\times [${c}, ${d}] \\subset \\mathbb{R}^2$ 构成的平面矩形区域的面积。`,
          ),
          answer: area,
          solution: walked(
            [
              [
                ["Find the side lengths", "求边长"],
                t(
                  `Width $${fmtSub(b, a)} = ${w}$ and height $${fmtSub(d, c)} = ${h}$.`,
                  `宽 $${fmtSub(b, a)} = ${w}$，高 $${fmtSub(d, c)} = ${h}$。`,
                ),
              ],
              [
                ["Multiply", "相乘"],
                t(
                  `The region is a rectangle, so its area is $${w} \\cdot ${h} = ${area}$.`,
                  `这个区域是矩形，所以面积为 $${w} \\cdot ${h} = ${area}$。`,
                ),
              ],
            ],
            t(
              `Starting from $x = ${a}$ and adding the width gives $${a} + ${w} = ${b}$; starting from $y = ${c}$ and adding the height gives $${c} + ${h} = ${d}$.`,
              `从 $x = ${a}$ 加上宽得 $${a} + ${w} = ${b}$；从 $y = ${c}$ 加上高得 $${c} + ${h} = ${d}$。`,
            ),
          ),
          mistakes,
        });
      },
    },
  ],
};

// ─── 1.2.5 Indexed Sets ──────────────────────────────────────────────────────

export const indexedSets: TopicDef = {
  id: "indexed-sets",
  title: t("Indexed Sets", "指标集与集合族"),
  summary: t(
    "Evaluate arbitrary unions and intersections of families of sets indexed by a parameter set.",
    "计算由参数指标集标记的集合族的广义并集与广义交集。",
  ),
  intro: t(
    "Let $A_i = [0, i]$ for $i = 1, 2, 3$, so $A_1 = [0, 1]$, $A_2 = [0, 2]$ and $A_3 = [0, 3]$. A number lies in the union when it lies in at least one $A_i$, which gives $[0, 3]$. It lies in the intersection when it lies in all of them, which gives $[0, 1]$.\n\nCheck: $2.5$ is in $A_3$ but not in $A_1$, so it is in the union and not in the intersection, as $[0, 3]$ and $[0, 1]$ say.\n\nIn this lesson we form unions and intersections of families of sets labelled by an index.",
    "设 $A_i = [0, i]$，$i = 1, 2, 3$，即 $A_1 = [0, 1]$，$A_2 = [0, 2]$，$A_3 = [0, 3]$。一个数在并集中，当且仅当它至少在一个 $A_i$ 中，得到 $[0, 3]$；它在交集中，当且仅当它在所有 $A_i$ 中，得到 $[0, 1]$。\n\n检验：$2.5$ 在 $A_3$ 中而不在 $A_1$ 中，所以它在并集中而不在交集中，与 $[0, 3]$ 和 $[0, 1]$ 相符。\n\n本课我们求由指标标记的集合族的并集与交集。",
  ),
  prerequisites: ["set-complements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "arbitrary-unions-of-indexed-sets",
      title: t("Arbitrary unions of indexed sets", "指标集族的并集"),
      explanation: t(
        "For an indexed collection of sets $\\{A_i\\}_{i \\in I}$, their union $\\bigcup_{i \\in I} A_i$ is the set of all elements belonging to at least one set $A_i$: $\\bigcup_{i \\in I} A_i = \\{x \\mid \\exists i \\in I, x \\in A_i\\}$. When the sets grow, $A_1 \\subseteq A_2 \\subseteq \\cdots$, every set lies inside the last one, so the union of $A_1, \\dots, A_n$ is $A_n$.\n\n> **Watch out.** The union of growing sets is the largest set, not the smallest. For $A_i = [0, i]$, $i = 1, 2, 3$, the union is $A_3 = [0, 3]$; the smallest set $A_1 = [0, 1]$ is their intersection.",
        "对于由指标集 $I$ 标记的集合族 $\\{A_i\\}_{i \\in I}$，其广义并集 $\\bigcup_{i \\in I} A_i$ 是指属于至少一个 $A_i$ 的所有元素构成的集合：$\\bigcup_{i \\in I} A_i = \\{x \\mid \\exists i \\in I, x \\in A_i\\}$。当集合逐个增大，即 $A_1 \\subseteq A_2 \\subseteq \\cdots$ 时，每个集合都在最后一个集合之内，所以 $A_1, \\dots, A_n$ 的并集就是 $A_n$。\n\n> **注意。** 逐个增大的集合的并集是最大的集合，而不是最小的。对 $A_i = [0, i]$，$i = 1, 2, 3$，并集是 $A_3 = [0, 3]$；最小的集合 $A_1 = [0, 1]$ 是它们的交集。",
      ),
      generate(rng) {
        const n = rng.int(3, 35);
        const start = rng.int(0, 5);
        const closed = (lo: number, hi: number) => [{ lo: q(lo), loClosed: true, hi: q(hi), hiClosed: true }];
        return withMistakes(
          intervalProblem({
            prompt: t(
              `For each $i \\in \\{1, 2, \\dots, ${n}\\}$, let $A_i = [${start}, ${start} + i] \\subset \\mathbb{R}$. Evaluate the union $\\bigcup_{i=1}^{${n}} A_i$ in interval notation.`,
              `对每个 $i \\in \\{1, 2, \\dots, ${n}\\}$，设 $A_i = [${start}, ${start} + i] \\subset \\mathbb{R}$。用区间记号表示并集 $\\bigcup_{i=1}^{${n}} A_i$。`,
            ),
            set: closed(start, start + n),
            solution: walked(
              [
                [
                  ["See how the sets grow", "看集合如何增大"],
                  t(
                    `Each $A_i = [${start}, ${start + 1}], [${start}, ${start + 2}], \\dots$ contains the one before it: $A_1 \\subseteq A_2 \\subseteq \\cdots \\subseteq A_{${n}}$.`,
                    `每个 $A_i = [${start}, ${start + 1}], [${start}, ${start + 2}], \\dots$ 都包含前一个：$A_1 \\subseteq A_2 \\subseteq \\cdots \\subseteq A_{${n}}$。`,
                  ),
                ],
                [
                  ["Take the largest", "取最大的集合"],
                  t(
                    `Every set lies inside $A_{${n}}$, so the union is $A_{${n}} = [${start}, ${start + n}]$.`,
                    `每个集合都在 $A_{${n}}$ 之内，所以并集是 $A_{${n}} = [${start}, ${start + n}]$。`,
                  ),
                ],
              ],
              t(
                `The endpoint $${start + n}$ belongs to $A_{${n}}$, so it is in the union, while $${start + n} + \\frac{1}{2}$ lies beyond every $A_i$.`,
                `端点 $${start + n}$ 属于 $A_{${n}}$，所以在并集中；而 $${start + n} + \\frac{1}{2}$ 不在任何 $A_i$ 中。`,
              ),
            ),
            wrong: [closed(start, start + 1), closed(start, start + n + 1)],
          }),
          [
            say(
              intervalLatex(closed(start, start + 1)),
              "That is $A_1$, the smallest set, which is the intersection of the family; the union collects every element of every $A_i$.",
              "这是最小的集合 $A_1$，也就是集合族的交集；并集收集每个 $A_i$ 的每个元素。",
            ),
            say(
              intervalLatex(closed(start, start + n + 1)),
              `The largest index is $i = ${n}$, so no set reaches past $${start} + ${n}$.`,
              `最大的指标是 $i = ${n}$，所以没有集合超过 $${start} + ${n}$。`,
            ),
            say(
              intervalLatex(closed(0, n)),
              `Every $A_i$ starts at $${start}$, not at $0$.`,
              `每个 $A_i$ 都从 $${start}$ 开始，而不是从 $0$ 开始。`,
            ),
          ],
        );
      },
    },
    {
      id: "arbitrary-intersections-of-indexed-sets",
      title: t("Arbitrary intersections of indexed sets", "指标集族的交集"),
      explanation: t(
        "For an indexed collection of sets $\\{A_i\\}_{i \\in I}$, their intersection $\\bigcap_{i \\in I} A_i$ is the set of elements belonging to every set $A_i$: $\\bigcap_{i \\in I} A_i = \\{x \\mid \\forall i \\in I, x \\in A_i\\}$. When the sets grow, $A_1 \\subseteq A_2 \\subseteq \\cdots$, an element of $A_1$ lies in all of them, so the intersection of $A_1, \\dots, A_n$ is $A_1$.\n\n> **Watch out.** An element must lie in every set, so the smallest set decides. For $A_i = [-i, i]$, $i = 1, 2, 3$, the number $2$ lies in $A_2$ and $A_3$ but not in $A_1 = [-1, 1]$, so it is not in the intersection, which is $[-1, 1]$.",
        "对于由指标集 $I$ 标记的集合族 $\\{A_i\\}_{i \\in I}$，其广义交集 $\\bigcap_{i \\in I} A_i$ 是指属于每一个 $A_i$ 的所有公共元素构成的集合：$\\bigcap_{i \\in I} A_i = \\{x \\mid \\forall i \\in I, x \\in A_i\\}$。当集合逐个增大，即 $A_1 \\subseteq A_2 \\subseteq \\cdots$ 时，$A_1$ 的元素在所有集合中，所以 $A_1, \\dots, A_n$ 的交集就是 $A_1$。\n\n> **注意。** 元素必须在每个集合中，所以由最小的集合决定。对 $A_i = [-i, i]$，$i = 1, 2, 3$，数 $2$ 在 $A_2$ 和 $A_3$ 中，但不在 $A_1 = [-1, 1]$ 中，所以不在交集中，交集是 $[-1, 1]$。",
      ),
      generate(rng) {
        const n = rng.int(3, 35);
        const c = rng.int(-5, 5);
        const closed = (lo: number, hi: number) => [{ lo: q(lo), loClosed: true, hi: q(hi), hiClosed: true }];
        const open = [{ lo: q(c - 1), loClosed: false, hi: q(c + 1), hiClosed: false }];
        return withMistakes(
          intervalProblem({
            prompt: t(
              `For each $i \\in \\{1, 2, \\dots, ${n}\\}$, let $A_i = [${c} - i, ${c} + i] \\subset \\mathbb{R}$. Evaluate the intersection $\\bigcap_{i=1}^{${n}} A_i$ in interval notation.`,
              `对每个 $i \\in \\{1, 2, \\dots, ${n}\\}$，设 $A_i = [${c} - i, ${c} + i] \\subset \\mathbb{R}$。用区间记号表示交集 $\\bigcap_{i=1}^{${n}} A_i$。`,
            ),
            set: closed(c - 1, c + 1),
            solution: walked(
              [
                [
                  ["See how the sets grow", "看集合如何增大"],
                  t(
                    `$A_1 = [${c - 1}, ${c + 1}]$, $A_2 = [${c - 2}, ${c + 2}]$, and each $A_i$ contains the one before it.`,
                    `$A_1 = [${c - 1}, ${c + 1}]$，$A_2 = [${c - 2}, ${c + 2}]$，每个 $A_i$ 都包含前一个。`,
                  ),
                ],
                [
                  ["Take the smallest", "取最小的集合"],
                  t(
                    `Every element of $A_1$ lies in every $A_i$, and nothing outside $A_1$ does, so the intersection is $A_1 = [${c - 1}, ${c + 1}]$.`,
                    `$A_1$ 的每个元素都在每个 $A_i$ 中，而 $A_1$ 之外的元素都不满足，所以交集是 $A_1 = [${c - 1}, ${c + 1}]$。`,
                  ),
                ],
              ],
              t(
                `The endpoint $${c + 1}$ lies in every $A_i$, since $${c + 1} \\le ${c} + i$ for all $i \\ge 1$, while $${c + 1} + \\frac{1}{2}$ is outside $A_1$.`,
                `端点 $${c + 1}$ 在每个 $A_i$ 中，因为对所有 $i \\ge 1$ 有 $${c + 1} \\le ${c} + i$；而 $${c + 1} + \\frac{1}{2}$ 不在 $A_1$ 中。`,
              ),
            ),
            wrong: [closed(c - n, c + n), open],
          }),
          [
            say(
              intervalLatex(closed(c - n, c + n)),
              `That is $A_{${n}}$, the largest set, which is the union of the family; the intersection keeps only what lies in every set.`,
              `这是最大的集合 $A_{${n}}$，也就是集合族的并集；交集只保留在每个集合中的元素。`,
            ),
            say(
              intervalLatex(open),
              `The endpoints $${c - 1}$ and $${c + 1}$ belong to $A_1$ and to every larger $A_i$, so they are in the intersection.`,
              `端点 $${c - 1}$ 和 $${c + 1}$ 属于 $A_1$ 和每个更大的 $A_i$，所以在交集中。`,
            ),
          ],
        );
      },
    },
  ],
};

// ─── 1.2.6 Sets and Functions ────────────────────────────────────────────────

export const setsAndFunctions: TopicDef = {
  id: "sets-and-functions",
  title: t("Sets and Functions", "集合与映射关系"),
  summary: t(
    "Understand functions as special binary relations (subsets of A x B), and identify domain, codomain, and range.",
    "将函数理解为笛卡尔积 A x B 的特殊二元关系子集，并确定其定义域、到达域与值域。",
  ),
  intro: t(
    "Let $A = \\{1, 2, 3\\}$ and $B = \\{4, 5, 6, 7\\}$. The set of pairs $f = \\{(1, 4), (2, 6), (3, 6)\\} \\subseteq A \\times B$ is a function from $A$ to $B$: each input $1, 2, 3$ appears exactly once as a first entry. Its outputs are $4$ and $6$, so its range is $\\{4, 6\\}$, a smaller set than the codomain $B$.\n\nCheck: the first entries $1, 2, 3$ are exactly the elements of $A$, each once, and $5$ and $7$ never appear as second entries.\n\nIn this lesson we see functions as sets of ordered pairs, and tell the domain, the codomain and the range apart.",
    "设 $A = \\{1, 2, 3\\}$，$B = \\{4, 5, 6, 7\\}$。有序对集合 $f = \\{(1, 4), (2, 6), (3, 6)\\} \\subseteq A \\times B$ 是从 $A$ 到 $B$ 的函数：每个输入 $1, 2, 3$ 作为第一个分量恰好出现一次。它的输出是 $4$ 和 $6$，所以值域是 $\\{4, 6\\}$，比到达域 $B$ 小。\n\n检验：第一个分量 $1, 2, 3$ 恰好是 $A$ 的元素，各出现一次；而 $5$ 和 $7$ 从未作为第二个分量出现。\n\n本课我们把函数看作有序对的集合，并区分定义域、到达域与值域。",
  ),
  prerequisites: ["the-cartesian-product"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "functions-as-relations",
      title: t("Functions as relations", "函数作为笛卡尔积的子集"),
      explanation: t(
        "A relation from $A$ to $B$ is any subset $R \\subseteq A \\times B$. A relation $f \\subseteq A \\times B$ is a function from $A$ to $B$ (denoted $f: A \\to B$) if every element $a \\in A$ appears as the first entry of exactly one ordered pair $(a, b) \\in f$. So check two things: no element of $A$ is missing as a first entry, and none appears twice.\n\n> **Watch out.** Two inputs may share an output. $\\{(1, 4), (2, 4)\\}$ is a function from $\\{1, 2\\}$; what a function cannot do is give one input two outputs, as $\\{(1, 4), (1, 5), (2, 4)\\}$ does.",
        "从集合 $A$ 到集合 $B$ 的二元关系是笛卡尔积 $A \\times B$ 的任意子集 $R$。若关系 $f \\subseteq A \\times B$ 满足 $A$ 中的每个元素 $a$ 都在 $f$ 中有且仅有一个有序对 $(a, b)$ 与之对应，则称 $f$ 是从 $A$ 到 $B$ 的函数（记作 $f: A \\to B$）。所以要检查两点：$A$ 的元素没有一个缺席第一个分量，也没有一个出现两次。\n\n> **注意。** 两个输入可以有相同的输出。$\\{(1, 4), (2, 4)\\}$ 是定义在 $\\{1, 2\\}$ 上的函数；函数不能做的是让一个输入有两个输出，就像 $\\{(1, 4), (1, 5), (2, 4)\\}$ 那样。",
      ),
      generate(rng) {
        const poolA = [1, 2, 3, 4, 5, 6, 7];
        const poolB = [8, 9, 10, 11, 12, 13, 14];
        const A = rng.sample(poolA, 3).sort((a, b) => a - b);
        const B = rng.sample(poolB, 3).sort((a, b) => a - b);
        const aStr = `\\{${A.join(", ")}\\}`;
        const bStr = `\\{${B.join(", ")}\\}`;

        const rightRel = `\\{(${A[0]}, ${B[0]}), (${A[1]}, ${B[1]}), (${A[2]}, ${B[2]})\\}`;
        const notFuncMulti = `\\{(${A[0]}, ${B[0]}), (${A[0]}, ${B[1]}), (${A[1]}, ${B[2]})\\}`;
        const notFuncMissing = `\\{(${A[0]}, ${B[0]}), (${A[1]}, ${B[1]})\\}`;
        const notFuncEmpty = `\\emptyset`;
        const rel = (s: string) => t(`$${s}$`, `$${s}$`);
        return explained(
          rng,
          t(
            `Let $A = ${aStr}$ and $B = ${bStr}$. Which of the following subsets of $A \\times B$ is a well-defined function $f: A \\to B$?`,
            `设 $A = ${aStr}$ 且 $B = ${bStr}$。下列 $A \\times B$ 的哪个子集构成了良定义的函数 $f: A \\to B$？`,
          ),
          rel(rightRel),
          [
            [
              rel(notFuncMulti),
              `$${A[0]}$ appears twice as a first entry, with outputs $${B[0]}$ and $${B[1]}$, and $${A[2]}$ has no output.`,
              `$${A[0]}$ 作为第一个分量出现两次，输出 $${B[0]}$ 和 $${B[1]}$，而 $${A[2]}$ 没有输出。`,
            ],
            [
              rel(notFuncMissing),
              `$${A[2]}$ never appears as a first entry, so it has no output.`,
              `$${A[2]}$ 从未作为第一个分量出现，所以没有输出。`,
            ],
            [rel(notFuncEmpty), "No element of $A$ has an output.", "$A$ 的元素都没有输出。"],
          ],
          walked(
            [
              [
                ["List the first entries", "列出第一个分量"],
                t(`In $${rightRel}$ the first entries are $${A.join(", ")}$.`, `在 $${rightRel}$ 中，第一个分量是 $${A.join(", ")}$。`),
              ],
              [
                ["Compare with $A$", "与 $A$ 比较"],
                t(
                  "Each element of $A$ appears exactly once, so each input has exactly one output: it is a function.",
                  "$A$ 的每个元素恰好出现一次，所以每个输入恰有一个输出：它是函数。",
                ),
              ],
            ],
            t(
              `It has $3$ pairs for the $3$ elements of $A$, and no first entry repeats, so none is missing either.`,
              `它有 $3$ 个有序对，对应 $A$ 的 $3$ 个元素，且第一个分量没有重复，所以也没有缺失。`,
            ),
          ),
        );
      },
    },
    {
      id: "domain-codomain-and-range",
      title: t("Domain, codomain, and range", "定义域、到达域与值域"),
      explanation: t(
        "For a function $f: A \\to B$, $A$ is the domain, $B$ is the codomain, and the range (or image) is the set of all outputs actually attained: $f(A) = \\{f(a) \\mid a \\in A\\} \\subseteq B$. The range is always a subset of the codomain, but need not equal the entire codomain. To find the range of a function on a finite domain, evaluate it at every element of the domain and collect the results.\n\n> **Watch out.** The range consists of outputs, not inputs. For $f(x) = 2x$ on $\\{1, 2, 3\\}$, the range is $\\{2, 4, 6\\}$; the domain $\\{1, 2, 3\\}$ is where the inputs come from.",
        "对于函数 $f: A \\to B$，$A$ 称为定义域，$B$ 称为到达域（陪域），而值域（或像集）是实际达到的所有输出构成的集合：$f(A) = \\{f(a) \\mid a \\in A\\} \\subseteq B$。值域总是到达域的子集，但不一定等于整个到达域。要求有限定义域上函数的值域，就在定义域的每个元素处求值，并收集结果。\n\n> **注意。** 值域由输出组成，不是输入。对定义在 $\\{1, 2, 3\\}$ 上的 $f(x) = 2x$，值域是 $\\{2, 4, 6\\}$；定义域 $\\{1, 2, 3\\}$ 是输入的来源。",
      ),
      generate(rng) {
        const c = rng.int(1, 8);
        const d = rng.int(-5, 8);
        const domain = [1, 2, 3, 4];
        const rangeVals = domain.map((x) => c * x + d);
        const rangeStr = `\\{${rangeVals.join(", ")}\\}`;
        const fnExpr = poly([c, "x"], [d, ""]);
        return solutionsProblem({
          prompt: t(
            `Let $f: \\{1, 2, 3, 4\\} \\to \\mathbb{Z}$ be defined by $f(x) = ${fnExpr}$. List all elements of the range of $f$.`,
            `设函数 $f: \\{1, 2, 3, 4\\} \\to \\mathbb{Z}$ 定义为 $f(x) = ${fnExpr}$。列出 $f$ 的值域的全部元素。`,
          ),
          values: rangeVals.map(String),
          variable: "y",
          solution: walked(
            [
              [
                ["Evaluate at each input", "在每个输入处求值"],
                t("", ""),
                domain.map((x, i) => `f(${x}) = ${c} \\cdot ${x} ${d < 0 ? "-" : "+"} ${Math.abs(d)} = ${rangeVals[i]}`),
              ],
              [["Collect the outputs", "收集输出"], t(`The range is $${rangeStr}$.`, `值域为 $${rangeStr}$。`)],
            ],
            t(
              `Consecutive inputs differ by $1$, so the outputs go up by $${c}$ each time: $${rangeVals.join(", ")}$.`,
              `相邻输入相差 $1$，所以输出每次增加 $${c}$：$${rangeVals.join(", ")}$。`,
            ),
          ),
          mistakes: [
            whySet(
              rangeVals.slice(0, 3).map(String),
              `$f(4) = ${rangeVals[3]}$ is missing; every element of the domain gives an output.`,
              `漏了 $f(4) = ${rangeVals[3]}$；定义域的每个元素都给出一个输出。`,
            ),
            whySet(
              domain.map(String),
              "That is the domain, the set of inputs; the range is the set of outputs.",
              "这是定义域，即输入的集合；值域是输出的集合。",
            ),
            whySet(
              domain.map((x) => String(c * x)),
              `Each output includes the constant term: $f(x) = ${fnExpr}$.`,
              `每个输出都包含常数项：$f(x) = ${fnExpr}$。`,
            ),
          ],
        });
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// MODULE 1.3: VECTOR GEOMETRY IN 3D
// ═════════════════════════════════════════════════════════════════════════════

// ─── 1.3.1 The Vector Equation of a Line ─────────────────────────────────────

export const theVectorEquationOfALine: TopicDef = {
  id: "the-vector-equation-of-a-line",
  title: t("The Vector Equation of a Line", "空间直线的向量方程"),
  summary: t(
    "Determine the vector equation of a line in 3D space given a point and direction vector, and test collinear points.",
    "根据空间一点及方向向量确定直线的向量方程，并检验空间点是否位于直线上。",
  ),
  prerequisites: ["calculating-the-magnitude-of-cartesian-vectors-in-3d"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.6"],
  knowledgePoints: [
    {
      id: "vector-equation-from-point-and-direction",
      figure: linearAlgebraDrawings1["the-vector-equation-of-a-line#vector-equation-from-point-and-direction"],
      title: t("Vector equation from a point and direction vector", "由点和方向向量求直线向量方程"),
      explanation: t(
        "A line in 3D passing through point $P(x_0, y_0, z_0)$ with position vector $\\mathbf{r}_0 = \\langle x_0, y_0, z_0 \\rangle$ and parallel to direction vector $\\mathbf{v} = \\langle a, b, c \\rangle$ has vector equation $\\mathbf{r}(t) = \\mathbf{r}_0 + t \\mathbf{v}$, where $t \\in \\mathbb{R}$ is the scalar parameter.",
        "三维空间中通过点 $P(x_0, y_0, z_0)$（位置向量 $\\mathbf{r}_0 = \\langle x_0, y_0, z_0 \\rangle$）且平行于方向向量 $\\mathbf{v} = \\langle a, b, c \\rangle$ 的直线，其向量方程为 $\\mathbf{r}(t) = \\mathbf{r}_0 + t \\mathbf{v}$，其中 $t \\in \\mathbb{R}$ 为标量参数。",
      ),
      generate(rng) {
        const x0 = rng.int(-6, 6);
        const y0 = rng.int(-6, 6);
        const z0 = rng.int(-6, 6);
        const a = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const c = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);

        const r0: Vec3 = [x0, y0, z0];
        const v: Vec3 = [a, b, c];

        const rightEq = `\\mathbf{r}(t) = ${vec3Latex(r0)} + t${vec3Latex(v)}`;
        const wrong1 = `\\mathbf{r}(t) = ${vec3Latex(v)} + t${vec3Latex(r0)}`; // swapped
        const wrong2 = `\\mathbf{r}(t) = ${vec3Latex(r0)} + t${vec3Latex([a, -b, c])}`;
        const wrong3 = `\\mathbf{r}(t) = ${vec3Latex([x0, y0, -z0])} + t${vec3Latex(v)}`;
        return oneOf(
          rng,
          t(
            `Find the vector equation of the line passing through point $P${pt3Latex(r0)}$ with direction vector $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `求过点 $P${pt3Latex(r0)}$ 且以 $\\mathbf{v} = ${vec3Latex(v)}$ 为方向向量的直线的向量方程。`,
          ),
          t(`$${rightEq}$`, `$${rightEq}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `The vector equation of a line is $\\mathbf{r}(t) = \\mathbf{r}_0 + t\\mathbf{v}$, where $\\mathbf{r}_0$ is the position vector of the point on the line and $\\mathbf{v}$ is the direction vector:\n\n$$\\mathbf{r}(t) = ${vec3Latex(r0)} + t${vec3Latex(v)}$$`,
            `空间直线的向量方程为 $\\mathbf{r}(t) = \\mathbf{r}_0 + t\\mathbf{v}$，其中 $\\mathbf{r}_0$ 是已知点的位置向量，$\\mathbf{v}$ 是方向向量：\n\n$$\\mathbf{r}(t) = ${vec3Latex(r0)} + t${vec3Latex(v)}$$`,
          ),
        );
      },
    },
    {
      id: "points-on-a-vector-line",
      title: t("Points on a vector line", "直线上的点与参数值"),
      explanation: t(
        "Each value of parameter $t$ in $\\mathbf{r}(t) = \\mathbf{r}_0 + t\\mathbf{v}$ corresponds to a specific point on the line. Conversely, a point $Q$ lies on the line if and only if there exists a single scalar $t$ such that $\\vec{OQ} = \\mathbf{r}_0 + t\\mathbf{v}$.",
        "在直线向量方程 $\\mathbf{r}(t) = \\mathbf{r}_0 + t\\mathbf{v}$ 中，参数 $t$ 的每一个实数值都对应直线上的一点。反之，点 $Q$ 在直线上当且仅当存在单一标量 $t$ 满足 $\\vec{OQ} = \\mathbf{r}_0 + t\\mathbf{v}$。",
      ),
      generate(rng) {
        const x0 = rng.int(-5, 5);
        const y0 = rng.int(-5, 5);
        const z0 = rng.int(-5, 5);
        const a = rng.pick([-3, -2, -1, 1, 2, 3]);
        const b = rng.pick([-3, -2, -1, 1, 2, 3]);
        const c = rng.pick([-3, -2, -1, 1, 2, 3]);
        const tVal = rng.pick([-3, -2, 2, 3]);

        const r0: Vec3 = [x0, y0, z0];
        const v: Vec3 = [a, b, c];
        const ptAtT: Vec3 = [x0 + a * tVal, y0 + b * tVal, z0 + c * tVal];

        const w1: Vec3 = [x0 + a * (tVal + 1), y0 + b * tVal, z0 + c * tVal];
        const w2: Vec3 = [x0 - a * tVal, y0 - b * tVal, z0 - c * tVal];
        const w3: Vec3 = [x0 + a, y0 + b, z0 + c];
        return pointProblem({
          prompt: t(
            `A line is given by $\\mathbf{r}(t) = ${vec3Latex(r0)} + t${vec3Latex(v)}$. Find the coordinates $(x, y, z)$ of the point corresponding to parameter $t = ${tVal}$.`,
            `已知直线的向量方程为 $\\mathbf{r}(t) = ${vec3Latex(r0)} + t${vec3Latex(v)}$。求参数 $t = ${tVal}$ 时对应的空间点坐标 $(x, y, z)$。`,
          ),
          answer: ptAtT,
          vars: ["x", "y", "z"],
          solution: t(
            `Substitute $t = ${tVal}$ into each coordinate:\n\n$$x = ${x0} + (${a})(${tVal}) = ${ptAtT[0]}, \\quad y = ${y0} + (${b})(${tVal}) = ${ptAtT[1]}, \\quad z = ${z0} + (${c})(${tVal}) = ${ptAtT[2]}$$`,
            `将 $t = ${tVal}$ 代入各分量：\n\n$$x = ${x0} + (${a})(${tVal}) = ${ptAtT[0]}, \\quad y = ${y0} + (${b})(${tVal}) = ${ptAtT[1]}, \\quad z = ${z0} + (${c})(${tVal}) = ${ptAtT[2]}$$`,
          ),
          wrong: [w1, w2, w3],
        });
      },
    },
  ],
};

// ─── 1.3.2 The Parametric Equations of a Line ────────────────────────────────

export const theParametricEquationsOfALine: TopicDef = {
  id: "the-parametric-equations-of-a-line",
  title: t("The Parametric Equations of a Line", "空间直线的参数方程"),
  summary: t(
    "Formulate and interpret the parametric scalar equations of a line in 3D.",
    "建立并分析三维空间中直线的参数方程，提取方向向量与基准点。",
  ),
  prerequisites: ["the-vector-equation-of-a-line"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.6"],
  knowledgePoints: [
    {
      id: "deriving-parametric-equations-of-a-line",
      title: t("Deriving parametric equations of a line", "求直线的参数方程"),
      explanation: t(
        "A line is fixed by one point and a direction, and each coordinate of a point on it is the starting coordinate plus a multiple of the matching direction component. Breaking the vector equation $\\mathbf{r}(t) = \\langle x_0, y_0, z_0 \\rangle + t \\langle a, b, c \\rangle$ into scalar components gives the parametric equations of the line:\n\n$$x = x_0 + at, \\quad y = y_0 + bt, \\quad z = z_0 + ct, \\quad t \\in \\mathbb{R}$$",
        "一条直线由一个点和一个方向确定，直线上点的每个坐标都等于起点坐标加上相应方向分量的倍数。将直线的向量方程 $\\mathbf{r}(t) = \\langle x_0, y_0, z_0 \\rangle + t \\langle a, b, c \\rangle$ 按分量展开，即得到直线的参数方程：\n\n$$x = x_0 + at, \\quad y = y_0 + bt, \\quad z = z_0 + ct, \\quad t \\in \\mathbb{R}$$",
      ),
      generate(rng) {
        const x0 = rng.int(-6, 6);
        const y0 = rng.int(-6, 6);
        const z0 = rng.int(-6, 6);
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const c = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);

        const p: Vec3 = [x0, y0, z0];
        const v: Vec3 = [a, b, c];

        const rightForm = paramLineLatex(p, v);
        const wrong1 = paramLineLatex(v, p); // swapped point and dir
        const wrong2 = paramLineLatex(p, [a, -b, c]);
        const wrong3 = paramLineLatex([x0, y0, -z0], v);
        return reasoned(
          oneOf(
            rng,
            t(
              `Find the parametric equations of the line passing through point $P${pt3Latex(p)}$ with direction vector $\\mathbf{v} = ${vec3Latex(v)}$.`,
              `求通过点 $P${pt3Latex(p)}$ 且以 $\\mathbf{v} = ${vec3Latex(v)}$ 为方向向量的直线的参数方程。`,
            ),
            t(`$${rightForm}$`, `$${rightForm}$`),
            [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
            t(
              `The parametric equations are $x = x_0 + at, y = y_0 + bt, z = z_0 + ct$:\n\n$$${rightForm}$$`,
              `直线的参数方程为 $x = x_0 + at, y = y_0 + bt, z = z_0 + ct$：\n\n$$${rightForm}$$`,
            ),
          ),
          [
            [
              `$${wrong1}$`,
              "The point and the direction are exchanged: the coefficients of $t$ come from the direction vector.",
              "点和方向弄反了：$t$ 的系数来自方向向量。",
            ],
            [
              `$${wrong2}$`,
              "The coefficient of $t$ in $y$ has the wrong sign: it is the second entry of the direction vector.",
              "$y$ 中 $t$ 的系数符号错了：它是方向向量的第二个分量。",
            ],
            [
              `$${wrong3}$`,
              `The constant in $z$ has the wrong sign: at $t = 0$ the line is at $z = ${z0}$.`,
              `$z$ 中的常数符号错了：$t = 0$ 时直线在 $z = ${z0}$ 处。`,
            ],
          ],
        );
      },
    },
    {
      id: "direction-vector-and-points-from-parametric-form",
      title: t("Direction vector and points from parametric equations", "从参数方程读取方向向量与点"),
      explanation: t(
        "From the parametric equations $x = x_0 + at, y = y_0 + bt, z = z_0 + ct$, the coefficients of parameter $t$ form the direction vector $\\mathbf{v} = \\langle a, b, c \\rangle$, while setting $t = 0$ yields the base point $(x_0, y_0, z_0)$.",
        "从空间直线的参数方程 $x = x_0 + at, y = y_0 + bt, z = z_0 + ct$ 中，参数 $t$ 的系数构成了直线的方向向量 $\\mathbf{v} = \\langle a, b, c \\rangle$；令 $t = 0$ 即可得到直线上的一基准点 $(x_0, y_0, z_0)$。",
      ),
      generate(rng) {
        const x0 = rng.int(-5, 5);
        const y0 = rng.int(-5, 5);
        const z0 = rng.int(-5, 5);
        const a = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const c = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);

        const p: Vec3 = [x0, y0, z0];
        const v: Vec3 = [a, b, c];
        const lineStr = paramLineLatex(p, v);

        return pointProblem({
          prompt: t(
            `A line is given by parametric equations:\n\n$$${lineStr}$$\n\nIdentify a direction vector $\\mathbf{v} = \\langle a, b, c \\rangle$ of this line.`,
            `已知直线的参数方程为：\n\n$$${lineStr}$$\n\n确定该直线的一个方向向量 $\\mathbf{v} = \\langle a, b, c \\rangle$。`,
          ),
          answer: v,
          vars: ["x", "y", "z"],
          vector: true,
          solution: t(
            `The components of the direction vector are the coefficients of parameter $t$: $a = ${a}, b = ${b}, c = ${c}$, so $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `方向向量的分量即为参数 $t$ 的系数：$a = ${a}, b = ${b}, c = ${c}$，因此 $\\mathbf{v} = ${vec3Latex(v)}$。`,
          ),
          wrong: [p, [a, -b, c], [-a, b, -c]],
        });
      },
    },
  ],
};

// ─── 1.3.3 The Cartesian Equation of a Line ──────────────────────────────────

export const theCartesianEquationOfALine: TopicDef = {
  id: "the-cartesian-equation-of-a-line",
  title: t("The Cartesian Equation of a Line", "空间直线的对称式（点向式）方程"),
  summary: t(
    "Convert between parametric and symmetric Cartesian forms of a line, handling components with zero direction.",
    "在参数方程与对称式（点向式）方程间进行转换，并处理方向向量分量为零的情形。",
  ),
  prerequisites: ["the-parametric-equations-of-a-line"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.6"],
  knowledgePoints: [
    {
      id: "symmetric-equations-of-a-line",
      title: t("Symmetric equations of a line", "空间直线的点向式对称方程"),
      explanation: t(
        "Solving each parametric equation for the parameter and setting the results equal removes the parameter, leaving equations in the coordinates alone. Eliminating parameter $t$ from $x = x_0 + at, y = y_0 + bt, z = z_0 + ct$ (with $a, b, c \\neq 0$) yields the symmetric equations of the line:\n\n$$\\frac{x - x_0}{a} = \\frac{y - y_0}{b} = \\frac{z - z_0}{c}$$",
        "从每个参数方程中解出参数并令它们相等，就消去了参数，只剩下关于坐标的方程。从参数方程 $x = x_0 + at, y = y_0 + bt, z = z_0 + ct$（$a, b, c \\neq 0$）中消去参数 $t$，得到直线的对称式（点向式）方程：\n\n$$\\frac{x - x_0}{a} = \\frac{y - y_0}{b} = \\frac{z - z_0}{c}$$",
      ),
      generate(rng) {
        const x0 = rng.int(-5, 5);
        const y0 = rng.int(-5, 5);
        const z0 = rng.int(-5, 5);
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const c = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);

        const symPart = (val: number, dir: number, axis: string) => `\\frac{${symNum(axis, val)}}{${dir}}`;
        const rightSym = `${symPart(x0, a, "x")} = ${symPart(y0, b, "y")} = ${symPart(z0, c, "z")}`;
        const wrong1 = `${symPart(a, x0 || 1, "x")} = ${symPart(b, y0 || 1, "y")} = ${symPart(c, z0 || 1, "z")}`;
        const wrong2 = `${symPart(-x0, a, "x")} = ${symPart(y0, b, "y")} = ${symPart(z0, c, "z")}`;
        const wrong3 = `${symPart(x0, a, "x")} = ${symPart(y0, -b, "y")} = ${symPart(z0, c, "z")}`;
        const wrong4 = `${symPart(x0, a, "x")} = ${symPart(-y0, b, "y")} = ${symPart(z0, c, "z")}`;
        const wrong5 = `${symPart(x0, -a, "x")} = ${symPart(y0, b, "y")} = ${symPart(z0, c, "z")}`;

        const p: Vec3 = [x0, y0, z0];
        const v: Vec3 = [a, b, c];
        return oneOf(
          rng,
          t(
            `Find the symmetric Cartesian equations of the line passing through point $P${pt3Latex(p)}$ with direction vector $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `求通过点 $P${pt3Latex(p)}$ 且以 $\\mathbf{v} = ${vec3Latex(v)}$ 为方向向量的直线的对称式方程。`,
          ),
          t(`$${rightSym}$`, `$${rightSym}$`),
          [wrong1, wrong2, wrong3, wrong4, wrong5].map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `Solving for $t$ in each coordinate gives $t = \\frac{${symNum("x", x0)}}{${a}} = \\frac{${symNum("y", y0)}}{${b}} = \\frac{${symNum("z", z0)}}{${c}}$. Thus the symmetric equations are:\n\n$$${rightSym}$$`,
            `在每个参数方程中解出 $t$，得 $t = \\frac{${symNum("x", x0)}}{${a}} = \\frac{${symNum("y", y0)}}{${b}} = \\frac{${symNum("z", z0)}}{${c}}$。联立即得对称式方程：\n\n$$${rightSym}$$`,
          ),
        );
      },
    },
    {
      id: "handling-zero-direction-components",
      title: t("Lines with zero direction components", "方向向量含零分量的直线方程"),
      explanation: t(
        "If one direction component is zero, say $c = 0$, the coordinate $z$ is constant ($z = z_0$) and the line lies in the plane $z = z_0$. The symmetric equations are written as $\\frac{x - x_0}{a} = \\frac{y - y_0}{b}, \\; z = z_0$.",
        "若方向向量的一个分量为零（例如 $c = 0$），则该坐标为常数（$z = z_0$），直线平行于坐标平面并位于平面 $z = z_0$ 内。此时对称式方程写作 $\\frac{x - x_0}{a} = \\frac{y - y_0}{b}, \\; z = z_0$。",
      ),
      generate(rng) {
        const x0 = rng.int(-5, 5);
        const y0 = rng.int(-5, 5);
        const z0 = rng.int(-5, 5);
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const c = 0;

        const symPart = (val: number, dir: number, axis: string) => {
          const num = val === 0 ? axis : val > 0 ? `${axis} - ${val}` : `${axis} + ${-val}`;
          return `\\frac{${num}}{${dir}}`;
        };
        const rightEq = `${symPart(x0, a, "x")} = ${symPart(y0, b, "y")}, \\quad z = ${z0}`;
        const wrong1 = `${symPart(x0, a, "x")} = ${symPart(y0, b, "y")} = \\frac{${z0 === 0 ? "z" : z0 < 0 ? `z + ${-z0}` : `z - ${z0}`}}{0}`;
        const wrong2 = `${symPart(x0, a, "x")} = ${symPart(y0, b, "y")}, \\quad z = 0`;
        const wrong3 = `${symPart(x0, a, "x")} = ${symPart(y0, b, "y")}, \\quad z = ${x0}`;
        const wrong4 = `${symPart(x0, a, "x")} = ${symPart(y0, b, "y")}, \\quad z = ${z0 + 1}`;
        const wrong5 = `${symPart(x0, b, "x")} = ${symPart(y0, a, "y")}, \\quad z = ${z0}`;

        const p: Vec3 = [x0, y0, z0];
        const v: Vec3 = [a, b, c];
        return oneOf(
          rng,
          t(
            `A line passes through point $P${pt3Latex(p)}$ with direction vector $\\mathbf{v} = ${vec3Latex(v)}$. Which expression correctly gives its Cartesian symmetric equations?`,
            `一条直线过点 $P${pt3Latex(p)}$，其方向向量为 $\\mathbf{v} = ${vec3Latex(v)}$。下列哪个表达式正确表示了其对称式方程？`,
          ),
          t(`$${rightEq}$`, `$${rightEq}$`),
          [wrong1, wrong2, wrong3, wrong4, wrong5].map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `Because the $z$-component of the direction vector is $0$, $z$ remains constantly equal to $z_0 = ${z0}$. Equating the parameters for $x$ and $y$ gives:\n\n$$${rightEq}$$`,
            `因为方向向量的 $z$ 分量为 $0$，所以 $z$ 恒等于常数 $z_0 = ${z0}$。将 $x$ 与 $y$ 的参数联立，得到方程为 $${rightEq}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 1.3.4 The Vector Equation of a Plane ────────────────────────────────────

export const theVectorEquationOfAPlane: TopicDef = {
  id: "the-vector-equation-of-a-plane",
  title: t("The Vector Equation of a Plane", "空间平面的向量方程"),
  summary: t(
    "Formulate the vector equation of a plane using a normal vector n and position vector r0.",
    "利用平面的法向量 n 与已知点 r0 建立平面的点法式向量方程。",
  ),
  prerequisites: ["the-cross-product-of-two-vectors"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.6"],
  knowledgePoints: [
    {
      id: "normal-vector-and-vector-plane-equation",
      figure: linearAlgebraDrawings1["the-vector-equation-of-a-plane#normal-vector-and-vector-plane-equation"],
      title: t("Normal vector and the vector equation of a plane", "法向量与平面的点法式向量方程"),
      explanation: t(
        "A plane in 3D is determined by a point $P(x_0, y_0, z_0)$ with position vector $\\mathbf{r}_0$ and a non-zero normal vector $\\mathbf{n} = \\langle A, B, C \\rangle$ perpendicular to the plane. The vector equation is $\\mathbf{n} \\cdot (\\mathbf{r} - \\mathbf{r}_0) = 0$, or equivalently $\\mathbf{n} \\cdot \\mathbf{r} = d$ where $d = \\mathbf{n} \\cdot \\mathbf{r}_0$.",
        "空间平面由一点 $P(x_0, y_0, z_0)$（位置向量 $\\mathbf{r}_0$）与垂直于平面的非零法向量 $\\mathbf{n} = \\langle A, B, C \\rangle$ 唯一确定。其点法式向量方程为 $\\mathbf{n} \\cdot (\\mathbf{r} - \\mathbf{r}_0) = 0$，或等价地写作 $\\mathbf{n} \\cdot \\mathbf{r} = d$，其中 $d = \\mathbf{n} \\cdot \\mathbf{r}_0$。",
      ),
      generate(rng) {
        const A = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const B = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const C = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const x0 = rng.int(-5, 5);
        const y0 = rng.int(-5, 5);
        const z0 = rng.int(-5, 5);

        const n: Vec3 = [A, B, C];
        const r0: Vec3 = [x0, y0, z0];
        const d = dot3(n, r0);

        return numberProblem({
          prompt: t(
            `Find the constant $d$ in the scalar product equation $\\mathbf{n} \\cdot \\mathbf{r} = d$ of the plane passing through $P${pt3Latex(r0)}$ with normal vector $\\mathbf{n} = ${vec3Latex(n)}$.`,
            `求通过点 $P${pt3Latex(r0)}$ 且法向量为 $\\mathbf{n} = ${vec3Latex(n)}$ 的平面的标量积方程 $\\mathbf{n} \\cdot \\mathbf{r} = d$ 中的常数 $d$。`,
          ),
          answer: d,
          solution: t(
            `The constant is $d = \\mathbf{n} \\cdot \\mathbf{r}_0 = (${A})(${x0}) + (${B})(${y0}) + (${C})(${z0}) = ${d}$. Thus the equation is $${vec3Latex(n)} \\cdot \\mathbf{r} = ${d}$.`,
            `常数项为 $d = \\mathbf{n} \\cdot \\mathbf{r}_0 = (${A})(${x0}) + (${B})(${y0}) + (${C})(${z0}) = ${d}$。因此方程为 $${vec3Latex(n)} \\cdot \\mathbf{r} = ${d}$。`,
          ),
          wrong: [-d, 0, d + 1, d - 1],
        });
      },
    },
    {
      id: "plane-through-three-points-vector-form",
      figure: linearAlgebraDrawings1["the-vector-equation-of-a-plane#plane-through-three-points-vector-form"],
      title: t("Plane passing through three points", "过不共线三点的平面向量法向量"),
      explanation: t(
        "Given three non-collinear points $P, Q, R$, displacement vectors $\\vec{PQ} = \\mathbf{q} - \\mathbf{p}$ and $\\vec{PR} = \\mathbf{r} - \\mathbf{p}$ both lie parallel to the plane. A normal vector to the plane is given by their cross product: $\\mathbf{n} = \\vec{PQ} \\times \\vec{PR}$.",
        "给定不共线的三点 $P, Q, R$，位移向量 $\\vec{PQ} = \\mathbf{q} - \\mathbf{p}$ 与 $\\vec{PR} = \\mathbf{r} - \\mathbf{p}$ 均平行于该平面。平面的法向量由两向量的叉积给出：$\\mathbf{n} = \\vec{PQ} \\times \\vec{PR}$。",
      ),
      generate(rng) {
        const P: Vec3 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
        let u: Vec3;
        let v: Vec3;
        let n: Vec3;
        do {
          u = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
          v = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
          n = cross3(u, v);
        } while (n[0] === 0 && n[1] === 0 && n[2] === 0);

        const Q = add3(P, u);
        const R = add3(P, v);

        const wrong1: Vec3 = [-n[0], -n[1], n[2]];
        const wrong2: Vec3 = [n[1], n[0], n[2]];
        const wrong3: Vec3 = add3(u, v);

        return pointProblem({
          prompt: t(
            `Find a normal vector $\\mathbf{n} = \\vec{PQ} \\times \\vec{PR}$ for the plane containing the three points $P${pt3Latex(P)}$, $Q${pt3Latex(Q)}$, and $R${pt3Latex(R)}$.`,
            `求包含点 $P${pt3Latex(P)}$、$Q${pt3Latex(Q)}$ 与 $R${pt3Latex(R)}$ 的平面的法向量 $\\mathbf{n} = \\vec{PQ} \\times \\vec{PR}$。`,
          ),
          answer: n,
          vars: ["x", "y", "z"],
          vector: true,
          solution: t(
            `Compute $\\vec{PQ} = ${vec3Latex(u)}$ and $\\vec{PR} = ${vec3Latex(v)}$. Then evaluate the cross product:\n\n$$\\mathbf{n} = \\vec{PQ} \\times \\vec{PR} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\end{vmatrix} = ${vec3Latex(n)}$$`,
            `先求位移向量 $\\vec{PQ} = ${vec3Latex(u)}$ 与 $\\vec{PR} = ${vec3Latex(v)}$。然后计算其叉积：\n\n$$\\mathbf{n} = \\vec{PQ} \\times \\vec{PR} = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ ${u[0]} & ${u[1]} & ${u[2]} \\\\ ${v[0]} & ${v[1]} & ${v[2]} \\end{vmatrix} = ${vec3Latex(n)}$$`,
          ),
          wrong: [wrong1, wrong2, wrong3],
        });
      },
    },
  ],
};

// ─── 1.3.5 The Cartesian Equation of a Plane ─────────────────────────────────

export const theCartesianEquationOfAPlane: TopicDef = {
  id: "the-cartesian-equation-of-a-plane",
  title: t("The Cartesian Equation of a Plane", "空间平面的一般方程"),
  summary: t(
    "Find the general Cartesian equation Ax + By + Cz + D = 0 of a plane and identify its normal vector.",
    "建立平面的点法式一般方程 Ax + By + Cz + D = 0，并由系数识别其法向量。",
  ),
  prerequisites: ["the-vector-equation-of-a-plane"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.6"],
  knowledgePoints: [
    {
      id: "general-linear-equation-of-a-plane",
      figure: linearAlgebraDrawings1["the-cartesian-equation-of-a-plane#general-linear-equation-of-a-plane"],
      title: t("General linear equation of a plane", "平面的一般方程"),
      explanation: t(
        "A plane is the set of points whose displacement from a fixed point is perpendicular to a normal vector, and the coefficients of the equation are that normal vector's components. Expanding $\\mathbf{n} \\cdot (\\mathbf{r} - \\mathbf{r}_0) = A(x - x_0) + B(y - y_0) + C(z - z_0) = 0$ gives the general linear equation of a plane in $\\mathbb{R}^3$:\n\n$$Ax + By + Cz + D = 0, \\quad \\text{where } D = -(Ax_0 + By_0 + Cz_0)$$",
        "平面是到一个定点的位移与法向量垂直的点的集合，方程的系数就是法向量的各个分量。展开点法式方程 $\\mathbf{n} \\cdot (\\mathbf{r} - \\mathbf{r}_0) = A(x - x_0) + B(y - y_0) + C(z - z_0) = 0$，得到三维空间平面的线性一般方程：\n\n$$Ax + By + Cz + D = 0, \\quad \\text{其中 } D = -(Ax_0 + By_0 + Cz_0)$$",
      ),
      generate(rng) {
        const A = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const B = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const C = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const x0 = rng.int(-4, 4);
        const y0 = rng.int(-4, 4);
        const z0 = rng.int(-4, 4);

        const D = -(A * x0 + B * y0 + C * z0);
        const rightEq = planeEqLatex(A, B, C, D);
        const wrong1 = planeEqLatex(A, B, C, -D);
        const wrong2 = planeEqLatex(A, -B, C, D);
        const wrong3 = planeEqLatex(A, B, C, D + 2);

        const p: Vec3 = [x0, y0, z0];
        const n: Vec3 = [A, B, C];
        return equationProblem({
          prompt: t(
            `Find the general equation of the plane passing through $P${pt3Latex(p)}$ with normal vector $\\mathbf{n} = ${vec3Latex(n)}$. Express the equation in the form $Ax + By + Cz + D = 0$.`,
            `求过点 $P${pt3Latex(p)}$ 且以 $\\mathbf{n} = ${vec3Latex(n)}$ 为法向量的平面的点法式一般方程（写成 $Ax + By + Cz + D = 0$ 的形式）。`,
          ),
          answer: rightEq,
          solution: t(
            `Substitute into $A(x - x_0) + B(y - y_0) + C(z - z_0) = 0$:\n\n$$${joinTerms([fmtTerm(A, "x", x0), fmtTerm(B, "y", y0), fmtTerm(C, "z", z0)])} = 0 \\implies ${rightEq}$$`,
            `代入点法式方程 $A(x - x_0) + B(y - y_0) + C(z - z_0) = 0$：\n\n$$${joinTerms([fmtTerm(A, "x", x0), fmtTerm(B, "y", y0), fmtTerm(C, "z", z0)])} = 0 \\implies ${rightEq}$$`,
          ),
          wrong: [wrong1, wrong2, wrong3],
        });
      },
    },
    {
      id: "identifying-normal-vectors-from-cartesian-form",
      figure: linearAlgebraDrawings1["the-cartesian-equation-of-a-plane#identifying-normal-vectors-from-cartesian-form"],
      title: t("Identifying normal vectors and parallel planes", "由一般方程读取法向量与平行平面"),
      explanation: t(
        "In the equation $Ax + By + Cz + D = 0$, the coefficients $\\langle A, B, C \\rangle$ give a normal vector to the plane. Two planes are parallel if their normal vectors are scalar multiples of each other: $\\mathbf{n}_1 = k \\mathbf{n}_2$.",
        "在平面方程 $Ax + By + Cz + D = 0$ 中，各坐标项系数 $\\langle A, B, C \\rangle$ 即为平面的一个法向量。两平面相互平行当且仅当它们的法向量成比例：$\\mathbf{n}_1 = k \\mathbf{n}_2$。",
      ),
      generate(rng) {
        const A = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const B = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const C = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const D = rng.int(-10, 10);

        const planeStr = planeEqLatex(A, B, C, D);
        const n: Vec3 = [A, B, C];

        return pointProblem({
          prompt: t(
            `The plane $\\Pi$ is defined by the equation:\n\n$$${planeStr}$$\n\nIdentify a normal vector $\\mathbf{n} = \\langle A, B, C \\rangle$ perpendicular to this plane.`,
            `平面 $\\Pi$ 由下列方程给出：\n\n$$${planeStr}$$\n\n确定垂直于该平面的一个法向量 $\\mathbf{n} = \\langle A, B, C \\rangle$。`,
          ),
          answer: n,
          vars: ["x", "y", "z"],
          vector: true,
          solution: t(
            `The coefficients of $x, y, z$ in $Ax + By + Cz + D = 0$ directly define a normal vector $\\mathbf{n} = \\langle A, B, C \\rangle = ${vec3Latex(n)}$.`,
            `在方程 $Ax + By + Cz + D = 0$ 中，$x, y, z$ 的系数直接构成了平面的法向量 $\\mathbf{n} = \\langle A, B, C \\rangle = ${vec3Latex(n)}$.`,
          ),
          wrong: [
            [A, -B, C],
            [A, B, D],
            [B, A, C],
          ],
        });
      },
    },
  ],
};

// ─── 1.3.6 The Parametric Equations of a Plane ───────────────────────────────

export const theParametricEquationsOfAPlane: TopicDef = {
  id: "the-parametric-equations-of-a-plane",
  title: t("The Parametric Equations of a Plane", "空间平面的参数方程"),
  summary: t(
    "Express a plane in parametric form r = r0 + su + tv with two linearly independent direction vectors.",
    "利用两个线性无关的平行向量建立平面的双参数方程 r = r0 + su + tv。",
  ),
  prerequisites: ["the-vector-equation-of-a-plane"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.6"],
  knowledgePoints: [
    {
      id: "two-parameter-form-of-a-plane",
      figure: linearAlgebraDrawings1["the-parametric-equations-of-a-plane#two-parameter-form-of-a-plane"],
      title: t("Two-parameter vector form of a plane", "平面的双参数方程"),
      explanation: t(
        "A plane through $P(x_0, y_0, z_0)$ spanned by two non-parallel vectors $\\mathbf{u} = \\langle u_1, u_2, u_3 \\rangle$ and $\\mathbf{v} = \\langle v_1, v_2, v_3 \\rangle$ has the two-parameter vector equation:\n\n$$\\mathbf{r}(s, t) = \\mathbf{r}_0 + s\\mathbf{u} + t\\mathbf{v}, \\quad s, t \\in \\mathbb{R}$$",
        "过点 $P(x_0, y_0, z_0)$ 且由两个不平行的向量 $\\mathbf{u} = \\langle u_1, u_2, u_3 \\rangle$ 与 $\\mathbf{v} = \\langle v_1, v_2, v_3 \\rangle$ 张成的平面，其双参数向量方程为：\n\n$$\\mathbf{r}(s, t) = \\mathbf{r}_0 + s\\mathbf{u} + t\\mathbf{v}, \\quad s, t \\in \\mathbb{R}$$",
      ),
      generate(rng) {
        const x0 = rng.int(-4, 4);
        const y0 = rng.int(-4, 4);
        const z0 = rng.int(-4, 4);
        const u: Vec3 = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];
        let v: Vec3;
        do {
          v = [rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3]), rng.pick([-3, -2, -1, 1, 2, 3])];
        } while (cross3(u, v).every((val) => val === 0));

        const r0: Vec3 = [x0, y0, z0];
        const rightEq = `\\mathbf{r}(s, t) = ${vec3Latex(r0)} + s${vec3Latex(u)} + t${vec3Latex(v)}`;
        const wrong1 = `\\mathbf{r}(s, t) = ${vec3Latex(u)} + s${vec3Latex(r0)} + t${vec3Latex(v)}`;
        const wrong2 = `\\mathbf{r}(s, t) = ${vec3Latex(r0)} + s${vec3Latex(u)} + t${vec3Latex([v[0], -v[1], v[2]])}`;
        const wrong3 = `\\mathbf{r}(s, t) = ${vec3Latex([x0, -y0, z0])} + s${vec3Latex(u)} + t${vec3Latex(v)}`;

        return oneOf(
          rng,
          t(
            `Find the two-parameter vector equation of the plane passing through $P${pt3Latex(r0)}$ parallel to spanning vectors $\\mathbf{u} = ${vec3Latex(u)}$ and $\\mathbf{v} = ${vec3Latex(v)}$.`,
            `求通过点 $P${pt3Latex(r0)}$ 且平行于两张成向量 $\\mathbf{u} = ${vec3Latex(u)}$ 与 $\\mathbf{v} = ${vec3Latex(v)}$ 的平面的双参数向量方程。`,
          ),
          t(`$${rightEq}$`, `$${rightEq}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `A plane is described by $\\mathbf{r}(s, t) = \\mathbf{r}_0 + s\\mathbf{u} + t\\mathbf{v}$. Substituting the point $\\mathbf{r}_0 = ${vec3Latex(r0)}$ and direction vectors gives:\n\n$$${rightEq}$$`,
            `平面的双参数方程形式为 $\\mathbf{r}(s, t) = \\mathbf{r}_0 + s\\mathbf{u} + t\\mathbf{v}$。代入已知点与方向向量得到：\n\n$$${rightEq}$$`,
          ),
        );
      },
    },
    {
      id: "points-and-parameters-on-a-plane",
      title: t("Points and parameters on a plane", "平面上的点与参数确定"),
      explanation: t(
        "Evaluating the parametric form $\\mathbf{r}(s, t) = \\mathbf{r}_0 + s\\mathbf{u} + t\\mathbf{v}$ at specific parameter values $(s, t)$ produces the coordinates of a point on the plane.",
        "在平面的参数方程 $\\mathbf{r}(s, t) = \\mathbf{r}_0 + s\\mathbf{u} + t\\mathbf{v}$ 中代入特定的参数值对 $(s, t)$，即可求出该平面上对应点的坐标。",
      ),
      generate(rng) {
        const x0 = rng.int(-4, 4);
        const y0 = rng.int(-4, 4);
        const z0 = rng.int(-4, 4);
        const u: Vec3 = [rng.pick([-2, -1, 1, 2]), rng.pick([-2, -1, 1, 2]), rng.pick([-2, -1, 1, 2])];
        const v: Vec3 = [rng.pick([-2, -1, 1, 2]), rng.pick([-2, -1, 1, 2]), rng.pick([-2, -1, 1, 2])];

        const sVal = rng.pick([-2, -1, 1, 2]);
        const tVal = rng.pick([-2, -1, 1, 2]);

        const r0: Vec3 = [x0, y0, z0];
        const ptResult: Vec3 = [x0 + sVal * u[0] + tVal * v[0], y0 + sVal * u[1] + tVal * v[1], z0 + sVal * u[2] + tVal * v[2]];

        const w1: Vec3 = [ptResult[0] + 1, ptResult[1], ptResult[2]];
        const w2: Vec3 = [ptResult[0], ptResult[1] - 1, ptResult[2]];
        const w3: Vec3 = [x0 - sVal * u[0], y0 - sVal * u[1], z0 - sVal * u[2]];

        return pointProblem({
          prompt: t(
            `A plane has parametric equation $\\mathbf{r}(s, t) = ${vec3Latex(r0)} + s${vec3Latex(u)} + t${vec3Latex(v)}$. Find the coordinates $(x, y, z)$ corresponding to parameters $s = ${sVal}$ and $t = ${tVal}$.`,
            `已知平面的参数方程为 $\\mathbf{r}(s, t) = ${vec3Latex(r0)} + s${vec3Latex(u)} + t${vec3Latex(v)}$。求参数取值 $s = ${sVal}$ 且 $t = ${tVal}$ 时对应的空间点坐标 $(x, y, z)$。`,
          ),
          answer: ptResult,
          vars: ["x", "y", "z"],
          solution: t(
            `Calculate each coordinate:\n\n$$x = ${x0} + (${sVal})(${u[0]}) + (${tVal})(${v[0]}) = ${ptResult[0]}$$\n$$y = ${y0} + (${sVal})(${u[1]}) + (${tVal})(${v[1]}) = ${ptResult[1]}$$\n$$z = ${z0} + (${sVal})(${u[2]}) + (${tVal})(${v[2]}) = ${ptResult[2]}$$`,
            `代入计算各分量：\n\n$$x = ${x0} + (${sVal})(${u[0]}) + (${tVal})(${v[0]}) = ${ptResult[0]}$$\n$$y = ${y0} + (${sVal})(${u[1]}) + (${tVal})(${v[1]}) = ${ptResult[1]}$$\n$$z = ${z0} + (${sVal})(${u[2]}) + (${tVal})(${v[2]}) = ${ptResult[2]}$$`,
          ),
          wrong: [w1, w2, w3],
        });
      },
    },
  ],
};

// ─── 1.3.7 The Intersection of Two Planes ────────────────────────────────────

export const theIntersectionOfTwoPlanes: TopicDef = {
  id: "the-intersection-of-two-planes",
  title: t("The Intersection of Two Planes", "两平面的交线"),
  summary: t(
    "Find the direction vector and line equation of the intersection of two non-parallel planes using cross products.",
    "利用两平面法向量的叉积求两相交平面的交线方向向量及直线方程。",
  ),
  prerequisites: ["the-cartesian-equation-of-a-plane"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.6"],
  knowledgePoints: [
    {
      id: "direction-vector-of-plane-intersection",
      figure: linearAlgebraDrawings1["the-intersection-of-two-planes#direction-vector-of-plane-intersection"],
      title: t("Direction vector of the line of intersection", "两平面交线的方向向量"),
      explanation: t(
        "The line of intersection $L$ of two non-parallel planes $\\Pi_1$ and $\\Pi_2$ lies in both planes, so its direction vector $\\mathbf{v}$ is perpendicular to both normal vectors $\\mathbf{n}_1$ and $\\mathbf{n}_2$. Thus, a direction vector is given by their cross product:\n\n$$\\mathbf{v} = \\mathbf{n}_1 \\times \\mathbf{n}_2$$",
        "两相交平面 $\\Pi_1$ 与 $\\Pi_2$ 的交线 $L$ 同时位于两个平面内，因此该交线的方向向量 $\\mathbf{v}$ 必定同时垂直于两平面的法向量 $\\mathbf{n}_1$ 与 $\\mathbf{n}_2$。因此交线的方向向量可由其叉积给出：\n\n$$\\mathbf{v} = \\mathbf{n}_1 \\times \\mathbf{n}_2$$",
      ),
      generate(rng) {
        let n1: Vec3;
        let n2: Vec3;
        let v: Vec3;
        do {
          n1 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
          n2 = [rng.int(-3, 3), rng.int(-3, 3), rng.int(-3, 3)];
          v = cross3(n1, n2);
        } while (v[0] === 0 && v[1] === 0 && v[2] === 0);

        const d1 = rng.int(-8, 8);
        const d2 = rng.int(-8, 8);
        const plane1Str = planeEqLatex(n1[0], n1[1], n1[2], d1);
        const plane2Str = planeEqLatex(n2[0], n2[1], n2[2], d2);

        const wrong1: Vec3 = [-v[0], -v[1], v[2]];
        const wrong2: Vec3 = [v[1], v[0], v[2]];
        const wrong3: Vec3 = add3(n1, n2);

        return pointProblem({
          prompt: t(
            `Find a direction vector $\\mathbf{v} = \\mathbf{n}_1 \\times \\mathbf{n}_2$ for the line of intersection between the two planes:\n\n$$\\Pi_1: ${plane1Str}$$\n$$\\Pi_2: ${plane2Str}$$`,
            `求下列两平面交线的方向向量 $\\mathbf{v} = \\mathbf{n}_1 \\times \\mathbf{n}_2$：\n\n$$\\Pi_1: ${plane1Str}$$\n$$\\Pi_2: ${plane2Str}$$`,
          ),
          answer: v,
          vars: ["x", "y", "z"],
          vector: true,
          solution: t(
            `The direction vector is perpendicular to both normal vectors $\\mathbf{n}_1 = ${vec3Latex(n1)}$ and $\\mathbf{n}_2 = ${vec3Latex(n2)}$:\n\n$$\\mathbf{v} = \\mathbf{n}_1 \\times \\mathbf{n}_2 = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ ${n1[0]} & ${n1[1]} & ${n1[2]} \\\\ ${n2[0]} & ${n2[1]} & ${n2[2]} \\end{vmatrix} = ${vec3Latex(v)}$$`,
            `交线的方向向量垂直于两平面的法向量 $\\mathbf{n}_1 = ${vec3Latex(n1)}$ 与 $\\mathbf{n}_2 = ${vec3Latex(n2)}$：\n\n$$\\mathbf{v} = \\mathbf{n}_1 \\times \\mathbf{n}_2 = \\begin{vmatrix} \\mathbf{i} & \\mathbf{j} & \\mathbf{k} \\\\ ${n1[0]} & ${n1[1]} & ${n1[2]} \\\\ ${n2[0]} & ${n2[1]} & ${n2[2]} \\end{vmatrix} = ${vec3Latex(v)}$$`,
          ),
          wrong: [wrong1, wrong2, wrong3],
        });
      },
    },
    {
      id: "line-of-intersection-equations",
      title: t("Parametric equation of the line of intersection", "两平面交线的方程求解"),
      explanation: t(
        "To find the line of intersection, determine a direction vector $\\mathbf{v} = \\mathbf{n}_1 \\times \\mathbf{n}_2$ and find a common point $P_0$ by setting one coordinate to zero (e.g. $z = 0$) and solving the resulting $2 \\times 2$ linear system.",
        "求解两平面的交线方程时，先由法向量叉积 $\\mathbf{v} = \\mathbf{n}_1 \\times \\mathbf{n}_2$ 得到方向向量，再通过令某一坐标为零（例如 $z = 0$）解二元一次方程组求得两平面的一个公共交点 $P_0$，从而写出交线的参数方程。",
      ),
      generate(rng) {
        const p0: Vec3 = [rng.int(-3, 3), rng.int(-3, 3), 0];
        const v: Vec3 = [rng.pick([-2, -1, 1, 2]), rng.pick([-2, -1, 1, 2]), 1];

        const n1: Vec3 = [1, 0, -v[0]];
        const n2: Vec3 = [0, 1, -v[1]];

        const d1 = -dot3(n1, p0);
        const d2 = -dot3(n2, p0);

        const plane1Str = planeEqLatex(n1[0], n1[1], n1[2], d1);
        const plane2Str = planeEqLatex(n2[0], n2[1], n2[2], d2);

        const wrong2: Vec3 = [p0[0] + 1, p0[1], 0];

        return pointProblem({
          prompt: t(
            `Find the coordinates $(x, y, z)$ of the point on the line of intersection of the two planes with $z = 0$:\n\n$$\\Pi_1: ${plane1Str}$$\n$$\\Pi_2: ${plane2Str}$$`,
            `求下列两平面交线上 $z = 0$ 的交点坐标 $(x, y, z)$：\n\n$$\\Pi_1: ${plane1Str}$$\n$$\\Pi_2: ${plane2Str}$$`,
          ),
          answer: p0,
          vars: ["x", "y", "z"],
          solution: t(
            `Setting $z = 0$ in both plane equations yields $x = ${p0[0]}$ and $y = ${p0[1]}$, giving intersection point $P_0${pt3Latex(p0)}$.`,
            `令 $z = 0$，分别代入两平面方程解得 $x = ${p0[0]}$ 与 $y = ${p0[1]}$，得到交点 $P_0${pt3Latex(p0)}$。`,
          ),
          wrong: [wrong2, [p0[0], p0[1] + 1, 0], [p0[1], p0[0], 0]],
        });
      },
    },
  ],
};

// ─── 1.3.8 The Shortest Distance Between a Plane and a Point ─────────────────

export const theShortestDistanceBetweenAPlaneAndAPoint: TopicDef = {
  id: "the-shortest-distance-between-a-plane-and-a-point",
  title: t("The Shortest Distance Between a Plane and a Point", "点到平面的距离公式"),
  summary: t(
    "Calculate the shortest perpendicular distance from a point to a plane and the distance between parallel planes.",
    "计算空间一点到平面的垂直距离以及两平行平面之间的最短距离。",
  ),
  prerequisites: ["the-cartesian-equation-of-a-plane"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.6"],
  knowledgePoints: [
    {
      id: "point-plane-distance-formula",
      figure: linearAlgebraDrawings1["the-shortest-distance-between-a-plane-and-a-point#point-plane-distance-formula"],
      title: t("Point-plane distance formula", "点到平面的距离计算"),
      explanation: t(
        "The shortest path from a point to a plane runs along the normal direction, so the distance is the size of the projection onto the unit normal. The shortest perpendicular distance from a point $P_0(x_0, y_0, z_0)$ to the plane $Ax + By + Cz + D = 0$ is given by the formula:\n\n$$d = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}$$",
        "从点到平面的最短路径沿法线方向，所以距离等于在单位法向量上投影的大小。从空间点 $P_0(x_0, y_0, z_0)$ 到平面 $Ax + By + Cz + D = 0$ 的最短垂直距离公式为：\n\n$$d = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}$$",
      ),
      generate(rng) {
        const quadruples: readonly [number, number, number, number][] = [
          [1, 2, 2, 3],
          [2, 3, 6, 7],
          [1, 4, 8, 9],
          [2, 6, 9, 11],
          [3, 4, 12, 13],
        ];
        const [A, B, C, norm] = rng.pick(quadruples);
        const sA = rng.bool() ? A : -A;
        const sB = rng.bool() ? B : -B;
        const sC = rng.bool() ? C : -C;

        const x0 = rng.int(-4, 4);
        const y0 = rng.int(-4, 4);
        const z0 = rng.int(-4, 4);
        const targetD = rng.pick([1, 2, 3, 4, 5]) * norm;
        const baseVal = sA * x0 + sB * y0 + sC * z0;
        const D = targetD - baseVal;
        const dist = Math.abs(baseVal + D) / norm;

        const planeStr = planeEqLatex(sA, sB, sC, D);
        const p0: Vec3 = [x0, y0, z0];

        return numberProblem({
          prompt: t(
            `Find the distance from point $P${pt3Latex(p0)}$ to the plane:\n\n$$${planeStr}$$`,
            `求点 $P${pt3Latex(p0)}$ 到平面 $${planeStr}$ 的最短距离。`,
          ),
          answer: dist,
          solution: t(
            `Applying the distance formula:\n\n$$d = \\frac{|(${sA})(${x0}) + (${sB})(${y0}) + (${sC})(${z0}) + (${D})|}{\\sqrt{(${sA})^2 + (${sB})^2 + (${sC})^2}} = \\frac{|${baseVal + D}|}{${norm}} = ${dist}$$`,
            `代入点到平面的距离公式：\n\n$$d = \\frac{|(${sA})(${x0}) + (${sB})(${y0}) + (${sC})(${z0}) + (${D})|}{\\sqrt{(${sA})^2 + (${sB})^2 + (${sC})^2}} = \\frac{|${baseVal + D}|}{${norm}} = ${dist}$$`,
          ),
          wrong: [dist + 1, Math.max(1, dist - 1), dist * norm],
        });
      },
    },
    {
      id: "distance-between-parallel-planes",
      figure: linearAlgebraDrawings1["the-shortest-distance-between-a-plane-and-a-point#distance-between-parallel-planes"],
      title: t("Distance between parallel planes", "两平行平面间的距离"),
      explanation: t(
        "Parallel planes share a normal vector, so the distance between them is the distance from any point of one plane to the other. The distance between two parallel planes $\\Pi_1: Ax + By + Cz + D_1 = 0$ and $\\Pi_2: Ax + By + Cz + D_2 = 0$ is:\n\n$$d = \\frac{|D_1 - D_2|}{\\sqrt{A^2 + B^2 + C^2}}$$",
        "平行平面有相同的法向量，所以它们之间的距离等于一个平面上任意一点到另一个平面的距离。两平行平面 $\\Pi_1: Ax + By + Cz + D_1 = 0$ 与 $\\Pi_2: Ax + By + Cz + D_2 = 0$ 之间的距离公式为：\n\n$$d = \\frac{|D_1 - D_2|}{\\sqrt{A^2 + B^2 + C^2}}$$",
      ),
      generate(rng) {
        const quadruples: readonly [number, number, number, number][] = [
          [1, 2, 2, 3],
          [2, 3, 6, 7],
          [1, 4, 8, 9],
          [3, 4, 12, 13],
        ];
        const [A, B, C, norm] = rng.pick(quadruples);
        const k = rng.pick([1, 2, 3, 4]);
        const D1 = rng.int(-10, 10);
        const diff = k * norm;
        const D2 = D1 + diff;
        const dist = diff / norm;

        const plane1Str = planeEqLatex(A, B, C, D1);
        const plane2Str = planeEqLatex(A, B, C, D2);

        return numberProblem({
          prompt: t(
            `Find the distance between the parallel planes:\n\n$$\\Pi_1: ${plane1Str}$$\n$$\\Pi_2: ${plane2Str}$$`,
            `求两平行平面之间的距离：\n\n$$\\Pi_1: ${plane1Str}$$\n$$\\Pi_2: ${plane2Str}$$`,
          ),
          answer: dist,
          solution: t(
            `Using the parallel plane distance formula:\n\n$$d = \\frac{|${fmtSub(D1, D2)}|}{\\sqrt{${A}^2 + ${B}^2 + ${C}^2}} = \\frac{${diff}}{${norm}} = ${dist}$$`,
            `应用平行平面间距离公式：\n\n$$d = \\frac{|${fmtSub(D1, D2)}|}{\\sqrt{${A}^2 + ${B}^2 + ${C}^2}} = \\frac{${diff}}{${norm}} = ${dist}$$`,
          ),
          wrong: [dist + 2, diff, dist + 1],
        });
      },
    },
  ],
};

// ─── 1.3.9 The Intersection Between a Line and a Plane ───────────────────────

export const theIntersectionBetweenALineAndAPlane: TopicDef = {
  id: "the-intersection-between-a-line-and-a-plane",
  title: t("The Intersection Between a Line and a Plane", "直线与平面的交点"),
  summary: t(
    "Find the point of intersection between a line and a plane by substituting parametric equations, and identify parallel or contained lines.",
    "通过将直线参数方程代入平面方程求解两者的交点，并判定平行与包含关系。",
  ),
  prerequisites: ["the-parametric-equations-of-a-line", "the-cartesian-equation-of-a-plane"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSN.VM.C.6"],
  knowledgePoints: [
    {
      id: "finding-point-of-intersection-line-and-plane",
      title: t("Finding the point of intersection between a line and a plane", "求直线与平面的交点坐标"),
      explanation: t(
        "To find the intersection of a line $x = x_0 + at, y = y_0 + bt, z = z_0 + ct$ and plane $Ax + By + Cz + D = 0$, substitute the parametric expressions for $x, y, z$ into the plane equation and solve the linear equation for $t$. Substituting $t$ back into the parametric equations gives the intersection point.",
        "求直线 $x = x_0 + at, y = y_0 + bt, z = z_0 + ct$ 与平面 $Ax + By + Cz + D = 0$ 的交点时，将直线的参数表达式代入平面方程解出一元一次方程中的参数 $t$，再将求得的 $t$ 代回直线的参数方程即可得到交点坐标。",
      ),
      generate(rng) {
        const A = rng.pick([-3, -2, -1, 1, 2, 3]);
        const B = rng.pick([-3, -2, -1, 1, 2, 3]);
        const C = rng.pick([-3, -2, -1, 1, 2, 3]);

        let a: number;
        let b: number;
        let c: number;
        let denom: number;
        do {
          a = rng.pick([-3, -2, -1, 1, 2, 3]);
          b = rng.pick([-3, -2, -1, 1, 2, 3]);
          c = rng.pick([-3, -2, -1, 1, 2, 3]);
          denom = A * a + B * b + C * c;
        } while (denom === 0);

        const x0 = rng.int(-4, 4);
        const y0 = rng.int(-4, 4);
        const z0 = rng.int(-4, 4);
        const tSol = rng.pick([-3, -2, -1, 1, 2, 3]);

        const xInt = x0 + a * tSol;
        const yInt = y0 + b * tSol;
        const zInt = z0 + c * tSol;
        const D = -(A * xInt + B * yInt + C * zInt);

        const p0: Vec3 = [x0, y0, z0];
        const v: Vec3 = [a, b, c];
        const ptIntersect: Vec3 = [xInt, yInt, zInt];

        const lineStr = paramLineLatex(p0, v);
        const planeStr = planeEqLatex(A, B, C, D);

        const w1: Vec3 = [xInt + 1, yInt, zInt];
        const w2: Vec3 = [x0, y0, z0];
        const w3: Vec3 = [xInt, yInt - 1, zInt];

        const constTerm = A * x0 + B * y0 + C * z0 + D;
        const eqStep = `${poly([denom, "t"], [constTerm, ""])} = 0`;

        return pointProblem({
          prompt: t(
            `Find the coordinates $(x, y, z)$ of the point of intersection between the line and the plane:\n\n$$\\text{Line: } ${lineStr}$$\n$$\\text{Plane: } ${planeStr}$$`,
            `求下列直线与平面的交点坐标 $(x, y, z)$：\n\n$$\\text{直线: } ${lineStr}$$\n$$\\text{平面: } ${planeStr}$$`,
          ),
          answer: ptIntersect,
          vars: ["x", "y", "z"],
          solution: t(
            `Substitute $x(t), y(t), z(t)$ into the plane equation and solve for $t$:\n\n$$${eqStep} \\implies t = ${tSol}$$\n\nSubstituting $t = ${tSol}$ into the line gives $(x, y, z) = ${pt3Latex(ptIntersect)}$.`,
            `将参数表达式 $x(t), y(t), z(t)$ 代入平面方程并解出 $t$：\n\n$$${eqStep} \\implies t = ${tSol}$$\n\n将 $t = ${tSol}$ 代回直线方程得交点坐标 $(x, y, z) = ${pt3Latex(ptIntersect)}$。`,
          ),
          wrong: [w1, w2, w3],
        });
      },
    },
    {
      id: "parallel-and-contained-lines",
      figure: linearAlgebraDrawings1["the-intersection-between-a-line-and-a-plane#parallel-and-contained-lines"],
      title: t("Parallel and contained lines relative to a plane", "直线与平面的平行与包含关系"),
      explanation: t(
        "If the direction vector $\\mathbf{v}$ of a line is orthogonal to the normal vector $\\mathbf{n}$ of a plane ($\\mathbf{n} \\cdot \\mathbf{v} = 0$), then the line is parallel to the plane. If the base point $P_0$ of the line also satisfies the plane equation, the line is entirely contained within the plane (infinite intersections). Otherwise, the line never meets the plane (no intersections).",
        "若直线的方向向量 $\\mathbf{v}$ 与平面的法向量 $\\mathbf{n}$ 垂直（$\\mathbf{n} \\cdot \\mathbf{v} = 0$），则直线平行于该平面。若直线的基准点 $P_0$ 同时满足该平面方程，则整条直线完全包含于该平面内（有无穷多个交点）；否则，直线与平面没有交点（完全平行）。",
      ),
      generate(rng) {
        const A = rng.pick([-3, -2, -1, 1, 2, 3]);
        const B = rng.pick([-3, -2, -1, 1, 2, 3]);
        const C = rng.pick([-3, -2, -1, 1, 2, 3]);

        // Direction vector orthogonal to [A, B, C]
        // Let v = [B, -A, 0] so A*B + B*(-A) + C*0 = 0
        const v: Vec3 = [B, -A, 0];
        const x0 = rng.int(-4, 4);
        const y0 = rng.int(-4, 4);
        const z0 = rng.int(-4, 4);
        const p0: Vec3 = [x0, y0, z0];

        const isContained = rng.bool();
        const D = isContained ? -(A * x0 + B * y0 + C * z0) : -(A * x0 + B * y0 + C * z0) + rng.pick([-5, -4, 4, 5]);

        const lineStr = paramLineLatex(p0, v);
        const planeStr = planeEqLatex(A, B, C, D);

        if (isContained) {
          return oneOf(
            rng,
            t(
              `Determine the geometric relationship between the line and the plane:\n\n$$\\text{Line: } ${lineStr}$$\n$$\\text{Plane: } ${planeStr}$$`,
              `确定下列直线与平面之间的几何位置关系：\n\n$$\\text{直线: } ${lineStr}$$\n$$\\text{平面: } ${planeStr}$$`,
            ),
            t("The line lies entirely in the plane (infinitely many points of intersection)", "直线完全落在平面内（有无穷多个交点）"),
            [
              t("The line is strictly parallel to the plane (no intersection)", "直线与平面严格平行（没有交点）"),
              t("The line intersects the plane at exactly one point", "直线与平面相交于唯一单点"),
              t("The line is perpendicular to the plane", "直线与平面垂直"),
            ],
            t(
              `The dot product $\\mathbf{n} \\cdot \\mathbf{v} = (${A})(${B}) + (${B})(${-A}) + (${C})(0) = 0$, so the line is parallel to the plane. Testing initial point $P_0${pt3Latex(p0)}$ in the plane equation gives $0 = 0$. Thus the line lies entirely within the plane.`,
              `法向量与方向向量的点积为 $\\mathbf{n} \\cdot \\mathbf{v} = (${A})(${B}) + (${B})(${-A}) + (${C})(0) = 0$，说明直线平行于平面。将直线的基准点 $P_0${pt3Latex(p0)}$ 代入平面方程满足等式，因此整条直线完全包含在平面内。`,
            ),
          );
        } else {
          return oneOf(
            rng,
            t(
              `Determine the geometric relationship between the line and the plane:\n\n$$\\text{Line: } ${lineStr}$$\n$$\\text{Plane: } ${planeStr}$$`,
              `确定下列直线与平面之间的几何位置关系：\n\n$$\\text{直线: } ${lineStr}$$\n$$\\text{平面: } ${planeStr}$$`,
            ),
            t("The line is strictly parallel to the plane (no intersection)", "直线与平面严格平行（没有交点）"),
            [
              t("The line lies entirely in the plane (infinitely many points of intersection)", "直线完全落在平面内（有无穷多个交点）"),
              t("The line intersects the plane at exactly one point", "直线与平面相交于唯一单点"),
              t("The line is perpendicular to the plane", "直线与平面垂直"),
            ],
            t(
              `The dot product $\\mathbf{n} \\cdot \\mathbf{v} = (${A})(${B}) + (${B})(${-A}) + (${C})(0) = 0$, so the line is parallel to the plane. Substituting $P_0${pt3Latex(p0)}$ does not satisfy the plane equation. Thus the line is strictly parallel to the plane with no points of intersection.`,
              `点积 $\\mathbf{n} \\cdot \\mathbf{v} = 0$ 说明方向向量垂直于法向量（直线平行于平面）。将基准点代入平面方程不成立，因此直线与平面严格平行，无交点。`,
            ),
          );
        }
      },
    },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// EXPORT ALL TOPICS
// ═════════════════════════════════════════════════════════════════════════════

/** linearAlgebraPreliminaryTopics contains all 25 topics for Unit 1 of Linear Algebra. */
export const linearAlgebraPreliminaryTopics: readonly TopicDef[] = [
  // Module 1.1: Introduction to Set Theory (10 topics)
  specialSets,
  statementsAndPredicates,
  equivalentSets,
  theConstructiveDefinitionOfASet,
  theConditionalDefinitionOfASet,
  describingSetsUsingSetBuilderNotation,
  describingPlanarRegionsUsingSetBuilderNotation,
  cardinalityOfFiniteSets,
  infiniteSets,
  subsets,

  // Module 1.2: Set Operations (6 topics)
  theDifferenceOfSets,
  setComplements,
  theCartesianProduct,
  visualizingCartesianProducts,
  indexedSets,
  setsAndFunctions,

  // Module 1.3: Vector Geometry (9 topics)
  theVectorEquationOfALine,
  theParametricEquationsOfALine,
  theCartesianEquationOfALine,
  theVectorEquationOfAPlane,
  theCartesianEquationOfAPlane,
  theParametricEquationsOfAPlane,
  theIntersectionOfTwoPlanes,
  theShortestDistanceBetweenAPlaneAndAPoint,
  theIntersectionBetweenALineAndAPlane,
];
