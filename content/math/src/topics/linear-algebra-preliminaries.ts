import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, q } from "@ga/subject-math";

import { choiceProblem, equationProblem, intervalProblem, numberProblem, pointProblem, solutionsProblem } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";

// Linear Algebra Unit 1: Preliminaries (Modules 1.1, 1.2, 1.3)
// 25 topics covering Set Theory, Set Operations, and 3D Vector Geometry.

type Vec3 = readonly [number, number, number];

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

// ═════════════════════════════════════════════════════════════════════════════
// MODULE 1.1: INTRODUCTION TO SET THEORY
// ═════════════════════════════════════════════════════════════════════════════

// ─── 1.1.1 Special Sets ──────────────────────────────────────────────────────

export const specialSets: TopicDef = {
  id: "special-sets",
  title: t("Special Sets", "常见数集与符号"),
  summary: t(
    "Understand the standard number sets N, Z, Q, R, C and the empty set notation.",
    "理解常用数集 N, Z, Q, R, C 的定义、包含关系及空集符号。",
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
        "Standard number sets are denoted by specific letters: $\\mathbb{N} = \\{1, 2, 3, \\dots\\}$ (natural numbers), $\\mathbb{Z}$ (integers), $\\mathbb{Q}$ (rational numbers $p/q$ with $p, q \\in \\mathbb{Z}, q \\neq 0$), $\\mathbb{R}$ (real numbers), and $\\mathbb{C}$ (complex numbers $a + bi$). They satisfy the inclusion hierarchy: $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$.",
        "常用数集有约定记号：$\\mathbb{N} = \\{1, 2, 3, \\dots\\}$（正整数集/自然数集），$\\mathbb{Z}$（整数集），$\\mathbb{Q}$（有理数集，可表示为 $p/q$，$p, q \\in \\mathbb{Z}, q \\neq 0$），$\\mathbb{R}$（实数集），以及 $\\mathbb{C}$（复数集 $a + bi$）。它们满足嵌套包含关系：$\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$。",
      ),
      generate(rng) {
        const cat = rng.pick(["neg_int", "frac", "irrational", "complex", "natural"]);
        if (cat === "neg_int") {
          const k = rng.int(2, 35);
          const numStr = `-${k}`;
          return oneOf(
            rng,
            t(
              `Which is the most specific (smallest) standard number set among $\\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{R}, \\mathbb{C}$ containing $x = ${numStr}$?`,
              `在数集 $\\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{R}, \\mathbb{C}$ 中，包含 $x = ${numStr}$ 的最特化（最小）数集是哪个？`,
            ),
            t("$\\mathbb{Z}$", "$\\mathbb{Z}$"),
            [t("$\\mathbb{N}$", "$\\mathbb{N}$"), t("$\\mathbb{Q}$", "$\\mathbb{Q}$"), t("$\\mathbb{R}$", "$\\mathbb{R}$")],
            t(
              `The number $${numStr}$ is a negative integer. It does not belong to $\\mathbb{N}$, but belongs to $\\mathbb{Z}$. Since $\\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$, the smallest set containing it is $\\mathbb{Z}$.`,
              `数 $${numStr}$ 是负整数，不属于自然数集 $\\mathbb{N}$，属于整数集 $\\mathbb{Z}$。由于 $\\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$，包含它的最小标准数集是 $\\mathbb{Z}$。`,
            ),
          );
        } else if (cat === "frac") {
          const q = rng.int(2, 11);
          let p = rng.int(1, 25);
          while (p % q === 0) p++;
          const sign = rng.bool() ? "-" : "";
          const numStr = `${sign}\\frac{${p}}{${q}}`;
          return oneOf(
            rng,
            t(
              `Which is the most specific (smallest) standard number set among $\\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{R}, \\mathbb{C}$ containing $x = ${numStr}$?`,
              `在数集 $\\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{R}, \\mathbb{C}$ 中，包含 $x = ${numStr}$ 的最特化（最小）数集是哪个？`,
            ),
            t("$\\mathbb{Q}$", "$\\mathbb{Q}$"),
            [t("$\\mathbb{Z}$", "$\\mathbb{Z}$"), t("$\\mathbb{R}$", "$\\mathbb{R}$"), t("$\\mathbb{N}$", "$\\mathbb{N}$")],
            t(
              `The number $${numStr}$ is a non-integer quotient of two integers. It is in $\\mathbb{Q}$ but not in $\\mathbb{Z}$. Thus $\\mathbb{Q}$ is the smallest standard set containing it.`,
              `数 $${numStr}$ 是两个整数之比且不是整数，属于有理数集 $\\mathbb{Q}$ 但不属于整数集 $\\mathbb{Z}$。因此包含它的最小数集是 $\\mathbb{Q}$。`,
            ),
          );
        } else if (cat === "irrational") {
          const nonSquares = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23];
          const rad = rng.pick(nonSquares);
          const mult = rng.pick([1, 2, 3, 5]);
          const numStr = mult === 1 ? `\\sqrt{${rad}}` : `${mult}\\sqrt{${rad}}`;
          return oneOf(
            rng,
            t(
              `Which is the most specific (smallest) standard number set among $\\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{R}, \\mathbb{C}$ containing $x = ${numStr}$?`,
              `在数集 $\\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{R}, \\mathbb{C}$ 中，包含 $x = ${numStr}$ 的最特化（最小）数集是哪个？`,
            ),
            t("$\\mathbb{R}$", "$\\mathbb{R}$"),
            [t("$\\mathbb{Q}$", "$\\mathbb{Q}$"), t("$\\mathbb{C}$", "$\\mathbb{C}$"), t("$\\mathbb{Z}$", "$\\mathbb{Z}$")],
            t(
              `The number $${numStr}$ is irrational: it cannot be expressed as a ratio of integers. It is real but not rational, so $\\mathbb{R}$ is the smallest set.`,
              `数 $${numStr}$ 是无理数，不能表示为整数之比。它属于实数集 $\\mathbb{R}$ 但不属于有理数集 $\\mathbb{Q}$，因此最小数集是 $\\mathbb{R}$。`,
            ),
          );
        } else if (cat === "complex") {
          const a = rng.int(-8, 8);
          const b = rng.pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]);
          const numStr = a === 0 ? `${b}i` : b > 0 ? `${a} + ${b}i` : `${a} - ${-b}i`;
          return oneOf(
            rng,
            t(
              `Which is the most specific (smallest) standard number set among $\\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{R}, \\mathbb{C}$ containing $x = ${numStr}$?`,
              `在数集 $\\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{R}, \\mathbb{C}$ 中，包含 $x = ${numStr}$ 的最特化（最小）数集是哪个？`,
            ),
            t("$\\mathbb{C}$", "$\\mathbb{C}$"),
            [t("$\\mathbb{R}$", "$\\mathbb{R}$"), t("$\\mathbb{Q}$", "$\\mathbb{Q}$"), t("$\\mathbb{Z}$", "$\\mathbb{Z}$")],
            t(
              `Because the imaginary part is non-zero ($b = ${b} \\neq 0$), $x = ${numStr}$ is not a real number. It is in the complex numbers $\\mathbb{C}$.`,
              `因为虚部非零（$b = ${b} \\neq 0$），数 $x = ${numStr}$ 不是实数，属于复数集 $\\mathbb{C}$。`,
            ),
          );
        } else {
          const n = rng.int(1, 35);
          return oneOf(
            rng,
            t(
              `Which is the most specific (smallest) standard number set among $\\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{R}, \\mathbb{C}$ containing $x = ${n}$?`,
              `在数集 $\\mathbb{N}, \\mathbb{Z}, \\mathbb{Q}, \\mathbb{R}, \\mathbb{C}$ 中，包含 $x = ${n}$ 的最特化（最小）数集是哪个？`,
            ),
            t("$\\mathbb{N}$", "$\\mathbb{N}$"),
            [t("$\\mathbb{Z}$", "$\\mathbb{Z}$"), t("$\\mathbb{Q}$", "$\\mathbb{Q}$"), t("$\\mathbb{R}$", "$\\mathbb{R}$")],
            t(
              `The positive integer $${n}$ is a natural number, so $${n} \\in \\mathbb{N}$. Since $\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R} \\subset \\mathbb{C}$, the smallest set is $\\mathbb{N}$.`,
              `正整数 $${n}$ 是自然数，故属于 $\\mathbb{N}$。在标准数集层次中最小的是 $\\mathbb{N}$。`,
            ),
          );
        }
      },
    },
    {
      id: "the-empty-set-and-set-membership",
      title: t("The empty set and set membership", "空集与属于关系"),
      explanation: t(
        "The empty set $\\emptyset$ (or $\\{\\}$) is the unique set containing no elements. Its cardinality is $|\\emptyset| = 0$. For any object $x$, $x \\in \\emptyset$ is always false. The empty set is a subset of every set $A$ ($\\emptyset \\subseteq A$), but is not necessarily an element of $A$ unless specifically included as an element.",
        "空集 $\\emptyset$（或记为 $\\{\\}$）是不含任何元素的唯一集合，其元素个数为 $|\\emptyset| = 0$。对于任意对象 $x$，$x \\in \\emptyset$ 恒为假。空集是任意集合 $A$ 的子集（$\\emptyset \\subseteq A$），但除非特别将其作为元素包含，否则它通常不是 $A$ 的元素。",
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
        const solution = [
          t(
            `For any real number $x$, $x^2 \\ge 0$, so $x^2 + ${r * r} \\ge ${r * r} > 0$. The equation has no real solution, so $S$ contains no elements: $S = \\emptyset$ and $|S| = 0$. Note that $\\emptyset$ is not $\\{0\\}$, which has one element.`,
            `对任意实数 $x$ 都有 $x^2 \\ge 0$，因此 $x^2 + ${r * r} \\ge ${r * r} > 0$。方程没有实数解，所以 $S$ 不含任何元素：$S = \\emptyset$ 且 $|S| = 0$。注意 $\\emptyset$ 不是含一个元素的 $\\{0\\}$。`,
          ),
          t(
            `$x^2 = ${r * r}$ gives $x = ${r}$ or $x = -${r}$, so $S = \\{-${r}, ${r}\\}$ and $|S| = 2$.`,
            `由 $x^2 = ${r * r}$ 得 $x = ${r}$ 或 $x = -${r}$，所以 $S = \\{-${r}, ${r}\\}$ 且 $|S| = 2$。`,
          ),
          t(
            `$(x - ${r})^2 = 0$ only when $x - ${r} = 0$, so $S = \\{${r}\\}$ and $|S| = 1$; the repeated root is one element.`,
            `$(x - ${r})^2 = 0$ 仅当 $x - ${r} = 0$，所以 $S = \\{${r}\\}$ 且 $|S| = 1$；重根只算一个元素。`,
          ),
        ];
        return choiceProblem({
          prompt: t(
            `Consider the real set $S = \\{x \\in \\mathbb{R} \\mid ${equation}\\}$. Which statement about $S$ is true?`,
            `考虑实数集合 $S = \\{x \\in \\mathbb{R} \\mid ${equation}\\}$。关于 $S$ 的下列陈述哪项是正确的？`,
          ),
          options,
          correct: kind,
          solution: solution[kind]!,
        });
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
  prerequisites: ["special-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "propositions-and-truth-values",
      title: t("Propositions and truth values", "命题与真假值"),
      explanation: t(
        "A proposition (or statement) is a declarative sentence that is either strictly True or strictly False, but not both. An open sentence containing free variables like '$x + 2 = 5$' is a predicate, not a proposition, until a specific value is assigned to $x$. Questions, commands, and paradoxes are not propositions.",
        "命题（或陈述句）是一个具有确切真假值（或真或假，且不能既真又假）的陈述句。含有自由变量的句子（如“$x + 2 = 5$”）称为谓词，在为变量赋予具体值之前不是命题。疑问句、祈使句及悖论均不是命题。",
      ),
      generate(rng) {
        const a = rng.int(2, 15);
        const b = rng.int(2, 15);
        const sum = a + b;
        const type = rng.pick(["true_prop", "false_prop", "open_predicate", "command"]);
        if (type === "true_prop") {
          return oneOf(
            rng,
            t(
              `Determine whether the sentence is a proposition, and if so, determine its truth value:\n\n"The integer $${a * 2}$ is an even number."`,
              `判断下列句子是否为命题；如果是命题，确定其真假值：\n\n“整数 $${a * 2}$ 是偶数。”`,
            ),
            t("It is a proposition with truth value True", "是命题，真值为真（True）"),
            [
              t("It is a proposition with truth value False", "是命题，真值为假（False）"),
              t("It is an open predicate with no definite truth value", "是开谓词，没有确定的真假值"),
              t("It is not a declarative sentence", "不是陈述句"),
            ],
            t(
              `The sentence makes a declarative mathematical claim that is unequivocally true, so it is a proposition with truth value True.`,
              `该句子作出了确切的数学陈述且客观为真，因此是一个真值为真的命题。`,
            ),
          );
        } else if (type === "false_prop") {
          const falseSum = sum + rng.pick([-2, -1, 1, 2]);
          return oneOf(
            rng,
            t(
              `Determine whether the sentence is a proposition, and if so, determine its truth value:\n\n"$${a} + ${b} = ${falseSum}$"`,
              `判断下列句子是否为命题；如果是命题，确定其真假值：\n\n“$${a} + ${b} = ${falseSum}$”`,
            ),
            t("It is a proposition with truth value False", "是命题，真值为假（False）"),
            [
              t("It is a proposition with truth value True", "是命题，真值为真（True）"),
              t("It is an open predicate with no definite truth value", "是开谓词，没有确定的真假值"),
              t("It is an undefined expression", "是未定义表达式"),
            ],
            t(
              `The equation asserts that $${a} + ${b} = ${falseSum}$, which is a definite false mathematical statement ($${a} + ${b} = ${sum} \\neq ${falseSum}$). Hence it is a proposition with truth value False.`,
              `该等式断言 $${a} + ${b} = ${falseSum}$，这是一个确定的假陈述（实际 $${a} + ${b} = ${sum}$），因此是真值为假的命题。`,
            ),
          );
        } else if (type === "open_predicate") {
          return oneOf(
            rng,
            t(
              `Determine whether the sentence is a proposition, and if so, determine its truth value:\n\n"$x + ${a} > ${a + b}$ for unknown $x$"`,
              `判断下列句子是否为命题；如果是命题，确定其真假值：\n\n“对未知数 $x$ 有 $x + ${a} > ${a + b}$”`,
            ),
            t(
              "It is an open predicate (not a proposition) because its truth depends on $x$",
              "是开谓词（非命题），因为其真假取决于 $x$ 的取值",
            ),
            [
              t("It is a proposition with truth value True", "是命题，真值为真（True）"),
              t("It is a proposition with truth value False", "是命题，真值为假（False）"),
              t("It is a tautology", "是恒真式"),
            ],
            t(
              `Because the truth value depends on the unquantified free variable $x$, it is an open predicate, not a proposition.`,
              `因为该句子的真假取决于未被量化的自由变量 $x$，它是一个谓词，而不是命题。`,
            ),
          );
        } else {
          return oneOf(
            rng,
            t(
              `Determine whether the sentence is a proposition, and if so, determine its truth value:\n\n"Solve the linear equation $2x + ${a} = ${b}$."`,
              `判断下列句子是否为命题；如果是命题，确定其真假值：\n\n“求解一元一次方程 $2x + ${a} = ${b}$。”`,
            ),
            t("It is not a proposition because it is an imperative sentence (command)", "不是命题，因为它是祈使句（指令）"),
            [
              t("It is a proposition with truth value True", "是命题，真值为真（True）"),
              t("It is a proposition with truth value False", "是命题，真值为假（False）"),
              t("It is a predicate with a free variable", "是含自由变量的谓词"),
            ],
            t(
              `An imperative command or instruction does not assert a fact that can be true or false. Thus it is not a proposition.`,
              `祈使句是一条操作指令，不表达可断定真假的陈述，因此不是命题。`,
            ),
          );
        }
      },
    },
    {
      id: "predicates-and-quantifiers",
      title: t("Predicates and quantifiers", "谓词与量词"),
      explanation: t(
        "Quantifiers bind variables in a predicate to form propositions: the universal quantifier $\\forall$ means 'for all' / 'for every', and the existential quantifier $\\exists$ means 'there exists' / 'for at least one'. A statement $\\forall x \\in S, P(x)$ is false if there exists even a single counterexample. A statement $\\exists x \\in S, P(x)$ is true if at least one example satisfies $P(x)$.",
        "量词通过约束谓词中的变量将其转化为命题：全称量词 $\\forall$ 表示“对所有/任意”，存在量词 $\\exists$ 表示“存在/至少有一个”。命题 $\\forall x \\in S, P(x)$ 只要存在一个反例即为假；命题 $\\exists x \\in S, P(x)$ 只要存在至少一个满足条件的特例即为真。",
      ),
      generate(rng) {
        const k = rng.int(2, 20);
        const pattern = rng.pick([0, 1, 2, 3]);
        if (pattern === 0) {
          return oneOf(
            rng,
            t(
              `Evaluate the truth value of the quantified statement:\n\n$$\\forall x \\in \\mathbb{R}, \\; x^2 + ${k} > 0$$`,
              `判断下列量化命题的真假值：\n\n$$\\forall x \\in \\mathbb{R}, \\; x^2 + ${k} > 0$$`,
            ),
            t(
              `True, because $x^2 \\ge 0$ for all real $x$, so $x^2 + ${k} \\ge ${k} > 0$`,
              `真，因为对所有实数 $x$ 都有 $x^2 \\ge 0$，故 $x^2 + ${k} \\ge ${k} > 0$`,
            ),
            [
              t("False, $x = 0$ is a counterexample", "假，$x = 0$ 是一个反例"),
              t("False, negative values of $x$ make $x^2 < 0$", "假，负数 $x$ 会导致 $x^2 < 0$"),
              t("False, the statement is open and not a proposition", "假，该陈述是开语句不是命题"),
            ],
            t(
              `For any real number $x$, $x^2 \\ge 0$. Adding $${k}$ gives $x^2 + ${k} \\ge ${k} > 0$. Hence the statement is True for all real $x$.`,
              `对任意实数 $x$ 都有 $x^2 \\ge 0$，两边加 $${k}$ 得到 $x^2 + ${k} \\ge ${k} > 0$，因此对所有实数 $x$ 均成立，真值为真。`,
            ),
          );
        } else if (pattern === 1) {
          return oneOf(
            rng,
            t(
              `Evaluate the truth value of the quantified statement:\n\n$$\\forall x \\in \\mathbb{R}, \\; x^2 > ${k}$$`,
              `判断下列量化命题的真假值：\n\n$$\\forall x \\in \\mathbb{R}, \\; x^2 > ${k}$$`,
            ),
            t(`False, because $x = 0$ provides a counterexample ($0 \\ngtr ${k}$)`, `假，因为 $x = 0$ 是一个反例（$0 \\ngtr ${k}$）`),
            [
              t("True, because squaring makes numbers large", "真，因为平方会使数变大"),
              t("True, because real numbers include arbitrarily large values", "真，因为实数包含任意大的值"),
              t("False, because $x^2$ is always negative for negative $x$", "假，因为负数的平方仍为负"),
            ],
            t(
              `A universal statement requires the predicate to hold for all $x \\in \\mathbb{R}$. Choosing $x = 0$ gives $0^2 = 0 \\ngtr ${k}$, so the statement is False.`,
              `全称命题要求对所有实数 $x$ 均成立。取 $x = 0$ 时，$0^2 = 0 \\ngtr ${k}$，构成反例，故命题为假。`,
            ),
          );
        } else if (pattern === 2) {
          return oneOf(
            rng,
            t(
              `Evaluate the truth value of the quantified statement:\n\n$$\\exists x \\in \\mathbb{Z}, \\; 2x = ${2 * k + 1}$$`,
              `判断下列量化命题的真假值：\n\n$$\\exists x \\in \\mathbb{Z}, \\; 2x = ${2 * k + 1}$$`,
            ),
            t(
              `False, because $2x$ is always even while $${2 * k + 1}$ is odd`,
              `假，因为对任意整数 $x$，$2x$ 恒为偶数，而 $${2 * k + 1}$ 是奇数`,
            ),
            [
              t(`True, $x = ${2 * k + 1}/2$ is an integer`, `真，$x = ${2 * k + 1}/2$ 是整数`),
              t("True, by choosing sufficiently large $x$", "真，只需选取足够大的 $x$"),
              t("False, because there are infinitely many solutions in $\\mathbb{R}$", "假，因为在实数集内有无穷多解"),
            ],
            t(
              `The only solution to $2x = ${2 * k + 1}$ is $x = \\frac{${2 * k + 1}}{2}$, which is not an integer ($x \\notin \\mathbb{Z}$). Thus no such integer exists, and the statement is False.`,
              `方程 $2x = ${2 * k + 1}$ 的唯一解为 $x = \\frac{${2 * k + 1}}{2}$，它不是整数。因此在整数集 $\\mathbb{Z}$ 内不存在这样的数，命题为假。`,
            ),
          );
        } else {
          return oneOf(
            rng,
            t(
              `Evaluate the truth value of the quantified statement:\n\n$$\\exists x \\in \\mathbb{Q}, \\; x^2 = ${k * k}$$`,
              `判断下列量化命题的真假值：\n\n$$\\exists x \\in \\mathbb{Q}, \\; x^2 = ${k * k}$$`,
            ),
            t(
              `True, because $x = ${k} \\in \\mathbb{Q}$ satisfies $${k}^2 = ${k * k}$`,
              `真，因为 $x = ${k} \\in \\mathbb{Q}$ 满足 $${k}^2 = ${k * k}$`,
            ),
            [
              t("False, no rational numbers can be squared", "假，有理数不能进行平方"),
              t(`False, $x^2 = ${k * k}$ has only irrational solutions`, `假，$x^2 = ${k * k}$ 只有无理数解`),
              t("False, the statement must hold for all $x$", "假，该陈述必须对所有 $x$ 成立"),
            ],
            t(
              `Since $x = ${k}$ is an integer, it is rational ($${k} \\in \\mathbb{Q}$) and satisfies $x^2 = ${k * k}$. Thus the existential statement is True.`,
              `因为 $x = ${k}$ 是整数，属于有理数集（$${k} \\in \\mathbb{Q}$），且满足 $x^2 = ${k * k}$。因此存在性命题为真。`,
            ),
          );
        }
      },
    },
  ],
};

// ─── 1.1.3 Equivalent Sets ───────────────────────────────────────────────────

export const equivalentSets: TopicDef = {
  id: "equivalent-sets",
  title: t("Equivalent Sets", "等价集合与外延公理"),
  summary: t("Apply the axiom of extensionality to determine when two sets are equal.", "应用外延公理判断两个集合何时完全相等。"),
  prerequisites: ["special-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "axiom-of-extensionality",
      title: t("Axiom of extensionality", "外延公理与集合相等"),
      explanation: t(
        "The Axiom of Extensionality states that two sets $A$ and $B$ are equal if and only if they have exactly the same elements: $A = B \\iff \\forall x (x \\in A \\iff x \\in B)$. Consequently, the order in which elements are listed and repetition of elements do not affect set identity.",
        "外延公理指出，两个集合 $A$ 与 $B$ 相等当且仅当它们包含完全相同的元素：$A = B \\iff \\forall x (x \\in A \\iff x \\in B)$。因此，元素的排列顺序和重复出现均不影响集合的同一性。",
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
        return reasoned(
          oneOf(
            rng,
            t(
              `According to the Axiom of Extensionality, which set is equal to $A = ${setAStr}$?`,
              `根据外延公理，下列哪个集合与集合 $A = ${setAStr}$ 相等？`,
            ),
            t(`$${setBStr}$`, `$${setBStr}$`),
            [
              t(`$\\{${a}, ${b}\\}$`, `$\\{${a}, ${b}\\}$`),
              t(`$\\{${a}, ${b}, ${c}, ${extra}\\}$`, `$\\{${a}, ${b}, ${c}, ${extra}\\}$`),
              t(`$\\{${a + 1}, ${b + 1}, ${c + 1}\\}$`, `$\\{${a + 1}, ${b + 1}, ${c + 1}\\}$`),
            ],
            t(
              `By the Axiom of Extensionality, two sets are equal if and only if they have the same elements. The order of elements does not matter, so $${setBStr} = ${setAStr}$.`,
              `由外延公理可知，两集合相等当且仅当它们具有完全相同的元素。元素的列举顺序不影响集合本身，因此 $${setBStr} = ${setAStr}$。`,
            ),
          ),
          [
            [
              `$\\{${a}, ${b}\\}$`,
              `The element $${c}$ is missing, so the two sets do not have the same elements.`,
              `缺少元素 $${c}$，所以两个集合的元素不相同。`,
            ],
            [
              `$\\{${a}, ${b}, ${c}, ${extra}\\}$`,
              `The element $${extra}$ is extra, so the two sets do not have the same elements.`,
              `多了元素 $${extra}$，所以两个集合的元素不相同。`,
            ],
            [
              `$\\{${a + 1}, ${b + 1}, ${c + 1}\\}$`,
              `The element $${c + 1}$ is not in $A$: equal sets have exactly the same elements.`,
              `元素 $${c + 1}$ 不在 $A$ 中：相等的集合元素完全相同。`,
            ],
          ],
        );
      },
    },
    {
      id: "determining-set-equality",
      title: t("Determining set equality", "判断集合相等"),
      explanation: t(
        "To verify whether two sets given in different forms are equal, solve for the elements of each set. For instance, $\\{x \\in \\mathbb{R} \\mid x^2 = a^2\\} = \\{-a, a\\}$. If every element of $A$ belongs to $B$ and every element of $B$ belongs to $A$, then $A = B$.",
        "要验证不同描述形式给出的两个集合是否相等，需分别求解或列出各集合的全部元素。例如 $\\{x \\in \\mathbb{R} \\mid x^2 = a^2\\} = \\{-a, a\\}$。若 $A$ 的每个元素均属于 $B$ 且 $B$ 的每个元素均属于 $A$，则 $A = B$。",
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
          solution: t(
            `Factoring gives $${polyStr} = (x - ${p})(x - ${q}) = 0$, whose real solutions are $x = ${p}$ and $x = ${q}$. Therefore, the elements are $x = ${p}, ${q}$ (or $\\{${p}, ${q}\\}$).`,
            `对二次多项式因式分解得到 $(x - ${p})(x - ${q}) = 0$，其实数解为 $x = ${p}$ 与 $x = ${q}$。因此集合元素为 $x = ${p}, ${q}$（或记为 $\\{${p}, ${q}\\}$）。`,
          ),
          wrong: [[String(-p), String(-q)], [String(p)], [String(q)], [String(sum), String(prod)]],
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
  prerequisites: ["special-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "roster-notation-and-order",
      title: t("Roster notation and order", "列举法与无序性"),
      explanation: t(
        "The constructive (roster) method defines a set by explicitly listing all of its elements enclosed in braces $\\{ \\}$, separated by commas. The ordering of elements within the braces is irrelevant: $\\{1, 2, 3\\} = \\{3, 1, 2\\}$.",
        "集合的构造性（列举）表示法通过在花括号 $\\{ \\}$ 中用逗号分隔显式列出所有元素。集合中元素的排列次序是无关紧要的，例如 $\\{1, 2, 3\\} = \\{3, 1, 2\\}$。",
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
          solution: t(
            `Setting each factor to zero yields $x = ${r1}$, $x = ${r2}$, and $x = ${r3}$. In roster notation, the solution set is $\\{${r1}, ${r2}, ${r3}\\}$.`,
            `令各因式为零可得 $x = ${r1}$、$x = ${r2}$ 与 $x = ${r3}$。用列举法表示解集为 $\\{${r1}, ${r2}, ${r3}\\}$。`,
          ),
          wrong: [
            [String(-r1), String(-r2), String(-r3)],
            [String(r1), String(r2)],
            [String(r2), String(r3)],
          ],
        });
      },
    },
    {
      id: "uniqueness-of-elements-in-roster",
      title: t("Uniqueness of elements in roster notation", "列举法中元素的互异性"),
      explanation: t(
        "A fundamental property of sets is that elements are distinct: listing an element more than once does not create extra elements. For example, $\\{2, 3, 3, 5, 5, 5\\} = \\{2, 3, 5\\}$, and its cardinality is 3.",
        "集合的一个基本性质是元素的互异性：在列举法中重复列出某一元素并不会增加集合中的元素。例如 $\\{2, 3, 3, 5, 5, 5\\} = \\{2, 3, 5\\}$，其元素个数为 3。",
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
          solution: t(
            `In set theory, duplicate listings are redundant. Listing each distinct element once gives $S = \\{${a}, ${b}, ${c}\\}$.`,
            `在集合论中，重复列出的元素是多余的。每个不同元素只计一次，化简后为 $S = \\{${a}, ${b}, ${c}\\}$。`,
          ),
          wrong: [
            [String(a), String(b)],
            [String(b), String(c)],
            [String(a), String(b), String(c), String(rawList.length)],
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
  prerequisites: ["the-constructive-definition-of-a-set"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "understanding-set-builder-notation",
      title: t("Understanding set-builder notation", "理解集合描述法"),
      explanation: t(
        "Set-builder notation specifies a set conditionally by a property that its members must satisfy: $\\{x \\in U \\mid P(x)\\}$ (read 'the set of all $x$ in $U$ such that $P(x)$ is true'). For example, $\\{x \\in \\mathbb{Z} \\mid 1 \\le x \\le 5\\} = \\{1, 2, 3, 4, 5\\}$.",
        "集合描述法通过指定元素必须满足的条件或谓词来定义集合：$\\{x \\in U \\mid P(x)\\}$（读作“所有属于 $U$ 且使 $P(x)$ 成立的 $x$ 的集合”）。例如 $\\{x \\in \\mathbb{Z} \\mid 1 \\le x \\le 5\\} = \\{1, 2, 3, 4, 5\\}$。",
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
        return numberProblem({
          prompt: t(
            `Find the smallest integer in the set $S = \\{x \\in \\mathbb{Z} \\mid ${lo} \\le x \\le ${hi} \\text{ and } x \\text{ is a multiple of } ${m}\\}$.`,
            `求集合 $S = \\{x \\in \\mathbb{Z} \\mid ${lo} \\le x \\le ${hi} \\text{ 且 } x \\text{ 是 } ${m} \\text{ 的倍数}\\}$ 中的最小整数。`,
          ),
          answer: minValid,
          solution: t(
            `To belong to $S$, an integer $x$ must satisfy two conditions: $${lo} \\le x \\le ${hi}$ and $x$ must be divisible by $${m}$. The multiples of $${m}$ in this range are $${validValues.join(", ")}$, so the smallest is $${minValid}$.`,
            `属于集合 $S$ 的整数 $x$ 必须同时满足两个条件：$${lo} \\le x \\le ${hi}$ 且能被 $${m}$ 整除。在此范围内的 $${m}$ 的倍数为 $${validValues.join(", ")}$，因此最小的整数是 $${minValid}$。`,
          ),
          wrong: [minValid + m, minValid - m, lo],
        });
      },
    },
    {
      id: "converting-between-roster-and-builder",
      title: t("Converting between roster and builder forms", "描述法与列举法的转换"),
      explanation: t(
        "To convert a conditional description $\\{x \\in \\mathbb{Z} \\mid P(x)\\}$ to roster form, list all integers satisfying the predicate $P(x)$. Conversely, to convert a roster list to set-builder notation, identify the common arithmetic pattern or condition.",
        "将描述法 $\\{x \\in \\mathbb{Z} \\mid P(x)\\}$ 转换为列举法时，逐一列出使谓词 $P(x)$ 成立的全部整数。反之，将列举法转换为描述法时，需识别其通项算术规律或特征性质。",
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        const d = rng.int(2, 6);
        const start = rng.int(1, 5);
        const elements: number[] = [];
        for (let i = start; i < start + n; i++) elements.push(i * d);
        const minVal = elements[0]!;
        const maxVal = elements[elements.length - 1]!;
        return solutionsProblem({
          prompt: t(
            `List all elements of the set $S = \\{x \\in \\mathbb{Z} \\mid ${minVal} \\le x \\le ${maxVal} \\text{ and } x \\text{ is a multiple of } ${d}\\}$.`,
            `列出集合 $S = \\{x \\in \\mathbb{Z} \\mid ${minVal} \\le x \\le ${maxVal} \\text{ 且 } x \\text{ 是 } ${d} \\text{ 的倍数}\\}$ 的全部元素。`,
          ),
          values: elements.map(String),
          variable: "x",
          solution: t(
            `The multiples of $${d}$ between $${minVal}$ and $${maxVal}$ are $${elements.join(", ")}$. In roster form, $S = \\{${elements.join(", ")}\\}$.`,
            `在 $${minVal}$ 到 $${maxVal}$ 之间 $${d}$ 的倍数有 $${elements.join(", ")}$。因此集合元素为 $${elements.join(", ")}$（即列举法 $S = \\{${elements.join(", ")}\\}$）。`,
          ),
          wrong: [elements.slice(0, -1).map(String), elements.slice(1).map(String)],
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
  prerequisites: ["the-conditional-definition-of-a-set"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "arithmetic-and-modular-sets",
      title: t("Arithmetic and modular sets", "算术生成集与同余集"),
      explanation: t(
        "Sets of integers with a regular step size can be defined using builder notation: $\\{m k + r \\mid k \\in \\mathbb{Z}\\}$, representing all integers congruent to $r$ modulo $m$. For instance, odd integers are $\\{2k + 1 \\mid k \\in \\mathbb{Z}\\}$.",
        "具有固定步长的整数集可以用集合构建符表示为 $\\{m k + r \\mid k \\in \\mathbb{Z}\\}$，表示模 $m$ 余 $r$ 的所有整数（同余类）。例如奇数集合为 $\\{2k + 1 \\mid k \\in \\mathbb{Z}\\}$。",
      ),
      generate(rng) {
        const m = rng.int(3, 12);
        const r = rng.int(1, m - 1);
        const kVal = rng.int(1, 15);
        const rightVal = m * kVal + r;
        return numberProblem({
          prompt: t(
            `Find the integer in the residue set $S = \\{${m}k + ${r} \\mid k \\in \\mathbb{Z}\\}$ corresponding to $k = ${kVal}$.`,
            `求同余集合 $S = \\{${m}k + ${r} \\mid k \\in \\mathbb{Z}\\}$ 中对应于 $k = ${kVal}$ 的整数。`,
          ),
          answer: rightVal,
          solution: t(
            `Substituting $k = ${kVal}$ into the formula yields $${m}(${kVal}) + ${r} = ${rightVal}$.`,
            `将 $k = ${kVal}$ 代入公式得 $${m}(${kVal}) + ${r} = ${rightVal}$。`,
          ),
          wrong: [rightVal + 1, rightVal - 1, m * kVal],
        });
      },
    },
    {
      id: "interval-subsets-of-reals",
      title: t("Interval subsets of the real numbers", "实数集中的区间与构建符"),
      explanation: t(
        "A round bracket means the endpoint is left out and a square bracket means it is included, so each interval is a compact way of writing a pair of inequalities. Intervals on the real line $\\mathbb{R}$ correspond directly to inequalities in set-builder notation: $(a, b] = \\{x \\in \\mathbb{R} \\mid a < x \\le b\\}$, $[a, b] = \\{x \\in \\mathbb{R} \\mid a \\le x \\le b\\}$, and $[a, \\infty) = \\{x \\in \\mathbb{R} \\mid x \\ge a\\}$.",
        "圆括号表示不包含端点，方括号表示包含端点，所以每个区间都是一对不等式的简洁写法。实数轴 $\\mathbb{R}$ 上的区间直接对应集合构建符中的不等式：$(a, b] = \\{x \\in \\mathbb{R} \\mid a < x \\le b\\}$，$[a, b] = \\{x \\in \\mathbb{R} \\mid a \\le x \\le b\\}$，以及 $[a, \\infty) = \\{x \\in \\mathbb{R} \\mid x \\ge a\\}$。",
      ),
      generate(rng) {
        const a = rng.int(-9, 5);
        const b = a + rng.int(3, 12);
        const kind = rng.pick(["half_open", "closed", "open"]);
        if (kind === "half_open") {
          return oneOf(
            rng,
            t(
              `Which set-builder notation correctly defines the half-open interval $( ${a}, ${b} ]$?`,
              `下列哪个集合构建符表达式正确表示了半开半闭区间 $( ${a}, ${b} ]$？`,
            ),
            t(`$\\{x \\in \\mathbb{R} \\mid ${a} < x \\le ${b}\\}$`, `$\\{x \\in \\mathbb{R} \\mid ${a} < x \\le ${b}\\}$`),
            [
              t(`$\\{x \\in \\mathbb{R} \\mid ${a} \\le x \\le ${b}\\}$`, `$\\{x \\in \\mathbb{R} \\mid ${a} \\le x \\le ${b}\\}$`),
              t(`$\\{x \\in \\mathbb{R} \\mid ${a} < x < ${b}\\}$`, `$\\{x \\in \\mathbb{R} \\mid ${a} < x < ${b}\\}$`),
              t(`$\\{x \\in \\mathbb{Z} \\mid ${a} < x \\le ${b}\\}$`, `$\\{x \\in \\mathbb{Z} \\mid ${a} < x \\le ${b}\\}$`),
            ],
            t(
              `The parenthesis at $${a}$ indicates that $${a}$ is excluded ($x > ${a}$), and the bracket at $${b}$ indicates that $${b}$ is included ($x \\le ${b}$). Thus $( ${a}, ${b} ] = \\{x \\in \\mathbb{R} \\mid ${a} < x \\le ${b}\\}$.`,
              `在 $${a}$ 处的圆括号表示不包含端点（$x > ${a}$），在 $${b}$ 处的方括号表示包含端点（$x \\le ${b}$）。因此 $( ${a}, ${b} ] = \\{x \\in \\mathbb{R} \\mid ${a} < x \\le ${b}\\}$。`,
            ),
          );
        } else if (kind === "closed") {
          return oneOf(
            rng,
            t(
              `Which set-builder notation correctly defines the closed interval $[ ${a}, ${b} ]$?`,
              `下列哪个集合构建符表达式正确表示了闭区间 $[ ${a}, ${b} ]$？`,
            ),
            t(`$\\{x \\in \\mathbb{R} \\mid ${a} \\le x \\le ${b}\\}$`, `$\\{x \\in \\mathbb{R} \\mid ${a} \\le x \\le ${b}\\}$`),
            [
              t(`$\\{x \\in \\mathbb{R} \\mid ${a} < x < ${b}\\}$`, `$\\{x \\in \\mathbb{R} \\mid ${a} < x < ${b}\\}$`),
              t(`$\\{x \\in \\mathbb{R} \\mid ${a} \\le x < ${b}\\}$`, `$\\{x \\in \\mathbb{R} \\mid ${a} \\le x < ${b}\\}$`),
              t(`$\\{x \\in \\mathbb{Z} \\mid ${a} \\le x \\le ${b}\\}$`, `$\\{x \\in \\mathbb{Z} \\mid ${a} \\le x \\le ${b}\\}$`),
            ],
            t(
              `Brackets at both endpoints denote inclusion of both $${a}$ and $${b}$ on the real line: $[ ${a}, ${b} ] = \\{x \\in \\mathbb{R} \\mid ${a} \\le x \\le ${b}\\}$.`,
              `两端均为方括号表示包含两端点，因此在实数集中为 $[ ${a}, ${b} ] = \\{x \\in \\mathbb{R} \\mid ${a} \\le x \\le ${b}\\}$。`,
            ),
          );
        } else {
          return oneOf(
            rng,
            t(
              `Which set-builder notation correctly defines the open interval $( ${a}, ${b} )$?`,
              `下列哪个集合构建符表达式正确表示了开区间 $( ${a}, ${b} )$？`,
            ),
            t(`$\\{x \\in \\mathbb{R} \\mid ${a} < x < ${b}\\}$`, `$\\{x \\in \\mathbb{R} \\mid ${a} < x < ${b}\\}$`),
            [
              t(`$\\{x \\in \\mathbb{R} \\mid ${a} \\le x \\le ${b}\\}$`, `$\\{x \\in \\mathbb{R} \\mid ${a} \\le x \\le ${b}\\}$`),
              t(`$\\{x \\in \\mathbb{R} \\mid ${a} < x \\le ${b}\\}$`, `$\\{x \\in \\mathbb{R} \\mid ${a} < x \\le ${b}\\}$`),
              t(`$\\{x \\in \\mathbb{Z} \\mid ${a} < x < ${b}\\}$`, `$\\{x \\in \\mathbb{Z} \\mid ${a} < x < ${b}\\}$`),
            ],
            t(
              `Parentheses at both endpoints denote strict inequality: $( ${a}, ${b} ) = \\{x \\in \\mathbb{R} \\mid ${a} < x < ${b}\\}$.`,
              `两端均为圆括号表示严格不等式，因此 $( ${a}, ${b} ) = \\{x \\in \\mathbb{R} \\mid ${a} < x < ${b}\\}$。`,
            ),
          );
        }
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
  prerequisites: ["describing-sets-using-set-builder-notation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "linear-half-planes",
      title: t("Linear half-planes in R2", "平面上的线性半平面"),
      explanation: t(
        "A linear inequality $a x + b y \\le c$ in $\\mathbb{R}^2$ defines a closed half-plane bounded by the line $a x + b y = c$. To test whether a given point $(x_0, y_0)$ lies in the set $\\{(x, y) \\in \\mathbb{R}^2 \\mid a x + b y \\le c\\}$, evaluate the left side at $(x_0, y_0)$ and check if it does not exceed $c$.",
        "在 $\\mathbb{R}^2$ 中，线性不等式 $a x + b y \\le c$ 定义了一个以直线 $a x + b y = c$ 为边界的闭半平面。要检验给定点 $(x_0, y_0)$ 是否属于集合 $\\{(x, y) \\in \\mathbb{R}^2 \\mid a x + b y \\le c\\}$，只需将 $(x_0, y_0)$ 代入左端并验证是否不超过 $c$。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const xIn = rng.int(-4, 4);
        const yIn = rng.int(-4, 4);
        const valIn = a * xIn + b * yIn;
        const c = valIn + rng.int(1, 5); // so (xIn, yIn) satisfies ax + by <= c

        // candidate points that violate ax + by <= c
        const xOut1 = xIn + (a > 0 ? 3 : -3);
        const yOut1 = yIn + (b > 0 ? 3 : -3);
        const xOut2 = xIn + (a > 0 ? 6 : -6);
        const yOut2 = yIn;
        const xOut3 = xIn;
        const yOut3 = yIn + (b > 0 ? 6 : -6);

        const aStr = a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
        const bStr = b === 1 ? "+ y" : b === -1 ? "- y" : b > 0 ? `+ ${b}y` : `- ${-b}y`;
        return oneOf(
          rng,
          t(
            `Which of the following points lies in the planar region $R = \\{(x, y) \\in \\mathbb{R}^2 \\mid ${aStr} ${bStr} \\le ${c}\\}$?`,
            `下列哪个点位于平面区域 $R = \\{(x, y) \\in \\mathbb{R}^2 \\mid ${aStr} ${bStr} \\le ${c}\\}$ 内？`,
          ),
          t(`$(${xIn}, ${yIn})$`, `$(${xIn}, ${yIn})$`),
          [
            t(`$(${xOut1}, ${yOut1})$`, `$(${xOut1}, ${yOut1})$`),
            t(`$(${xOut2}, ${yOut2})$`, `$(${xOut2}, ${yOut2})$`),
            t(`$(${xOut3}, ${yOut3})$`, `$(${xOut3}, ${yOut3})$`),
          ],
          t(
            `Substitute $(${xIn}, ${yIn})$ into $${aStr} ${bStr}$: $(${a})(${xIn}) + (${b})(${yIn}) = ${valIn} \\le ${c}$, which is true. The other points give values strictly greater than $${c}$.`,
            `将点 $(${xIn}, ${yIn})$ 代入得 $(${a})(${xIn}) + (${b})(${yIn}) = ${valIn} \\le ${c}$，不等式成立。其余各点代入后均大于 $${c}$。`,
          ),
        );
      },
    },
    {
      id: "circular-disks-and-regions",
      title: t("Circular disks and boundaries", "平面上的圆盘区域与边界"),
      explanation: t(
        "A closed disk centered at $(h, k)$ with radius $r > 0$ is defined in set-builder notation as $\\{(x, y) \\in \\mathbb{R}^2 \\mid (x - h)^2 + (y - k)^2 \\le r^2\\}$. The boundary circle is given by equality $= r^2$, while the open disk uses strict inequality $< r^2$.",
        "以 $(h, k)$ 为圆心、半径为 $r > 0$ 的闭圆盘在集合构建符中表示为 $\\{(x, y) \\in \\mathbb{R}^2 \\mid (x - h)^2 + (y - k)^2 \\le r^2\\}$。边界圆周对应等号 $= r^2$，而开圆盘对应严格不等号 $< r^2$。",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const r = rng.int(2, 7);
        const rSq = r * r;
        const hStr = h === 0 ? "x^2" : h > 0 ? `(x - ${h})^2` : `(x + ${-h})^2`;
        const kStr = k === 0 ? "y^2" : k > 0 ? `(y - ${k})^2` : `(y + ${-k})^2`;
        return oneOf(
          rng,
          t(
            `Which set-builder expression represents the closed circular disk centered at $(${h}, ${k})$ with radius $r = ${r}$?`,
            `下列哪个集合构建符表达式表示以 $(${h}, ${k})$ 为圆心、半径为 $r = ${r}$ 的闭圆盘？`,
          ),
          t(
            `$\\{(x, y) \\in \\mathbb{R}^2 \\mid ${hStr} + ${kStr} \\le ${rSq}\\}$`,
            `$\\{(x, y) \\in \\mathbb{R}^2 \\mid ${hStr} + ${kStr} \\le ${rSq}\\}$`,
          ),
          [
            t(
              `$\\{(x, y) \\in \\mathbb{R}^2 \\mid ${hStr} + ${kStr} < ${r}\\}$`,
              `$\\{(x, y) \\in \\mathbb{R}^2 \\mid ${hStr} + ${kStr} < ${r}\\}$`,
            ),
            t(
              `$\\{(x, y) \\in \\mathbb{R}^2 \\mid ${hStr} + ${kStr} = ${rSq}\\}$`,
              `$\\{(x, y) \\in \\mathbb{R}^2 \\mid ${hStr} + ${kStr} = ${rSq}\\}$`,
            ),
            t(
              `$\\{(x, y) \\in \\mathbb{R}^2 \\mid ${hStr} + ${kStr} \\ge ${rSq}\\}$`,
              `$\\{(x, y) \\in \\mathbb{R}^2 \\mid ${hStr} + ${kStr} \\ge ${rSq}\\}$`,
            ),
          ],
          t(
            `The distance from $(x, y)$ to $(h, k)$ is $\\sqrt{(x - h)^2 + (y - k)^2}$. For a closed disk of radius $r = ${r}$, the condition is $\\text{distance} \\le r$, or $${hStr} + ${kStr} \\le ${r}^2 = ${rSq}$.`,
            `点 $(x, y)$ 到圆心 $(h, k)$ 的距离为 $\\sqrt{(x - h)^2 + (y - k)^2}$。闭圆盘要求该距离小于等于半径 $r = ${r}$，平方后即为 $${hStr} + ${kStr} \\le ${rSq}$。`,
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
  prerequisites: ["the-constructive-definition-of-a-set"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "cardinality-of-a-finite-set",
      title: t("Cardinality of a finite set", "有限集合的元素个数"),
      explanation: t(
        "The cardinality of a finite set $A$, denoted $|A|$ or $n(A)$, is the number of distinct elements in $A$. For example, $|\\{2, 5, 8, 11\\}| = 4$, and the empty set has $|\\emptyset| = 0$.",
        "有限集合 $A$ 的基数（记作 $|A|$ 或 $n(A)$）是指 $A$ 中不同元素的个数。例如 $|\\{2, 5, 8, 11\\}| = 4$，空集的基数为 $|\\emptyset| = 0$。",
      ),
      generate(rng) {
        const lo = rng.int(1, 10);
        const d = rng.int(2, 5);
        const count = rng.int(4, 12);
        const hi = lo + (count - 1) * d;
        const setStr = `\\{x \\in \\mathbb{Z} \\mid ${lo} \\le x \\le ${hi} \\text{ and } (x - ${lo}) \\text{ is a multiple of } ${d}\\}`;
        return numberProblem({
          prompt: t(`Find the cardinality $|S|$ of the set:\n\n$$S = ${setStr}$$`, `求集合 $S$ 的基数 $|S|$：\n\n$$S = ${setStr}$$`),
          answer: count,
          solution: t(
            `The elements form an arithmetic sequence starting at $${lo}$ with common difference $${d}$ and ending at $${hi}$. The number of terms is $\\frac{${hi} - ${lo}}{${d}} + 1 = ${count}$, so $|S| = ${count}$.`,
            `该集合元素构成首项为 $${lo}$、公差为 $${d}$ 的等差数列，末项为 $${hi}$。项数为 $\\frac{${hi} - ${lo}}{${d}} + 1 = ${count}$，因此基数 $|S| = ${count}$。`,
          ),
          wrong: [count - 1, count + 1, hi - lo + 1],
        });
      },
    },
    {
      id: "inclusion-exclusion-for-two-sets",
      title: t("Inclusion-exclusion principle for two sets", "两集合的容斥原理"),
      explanation: t(
        "The Principle of Inclusion-Exclusion for two finite sets $A$ and $B$ states: $|A \\cup B| = |A| + |B| - |A \\cap B|$. Subtracting $|A \\cap B|$ corrects for the elements counted twice in $|A| + |B|$.",
        "两有限集合 $A$ 与 $B$ 的容斥原理为：$|A \\cup B| = |A| + |B| - |A \\cap B|$。减去 $|A \\cap B|$ 是为了校正这些元素在 $|A| + |B|$ 中被重复计算的一次。",
      ),
      generate(rng) {
        const nA = rng.int(15, 45);
        const nB = rng.int(15, 45);
        const maxInter = Math.min(nA, nB) - 4;
        const nInter = rng.int(3, Math.max(4, maxInter));
        const nUnion = nA + nB - nInter;
        const askUnion = rng.bool();
        if (askUnion) {
          return numberProblem({
            prompt: t(
              `Given two finite sets $A$ and $B$ with $|A| = ${nA}$, $|B| = ${nB}$, and $|A \\cap B| = ${nInter}$, find $|A \\cup B|$.`,
              `已知有限集合 $A$ 与 $B$ 满足 $|A| = ${nA}$，$|B| = ${nB}$，且 $|A \\cap B| = ${nInter}$，求 $|A \\cup B|$。`,
            ),
            answer: nUnion,
            solution: t(
              `By the Principle of Inclusion-Exclusion:\n\n$$|A \\cup B| = |A| + |B| - |A \\cap B| = ${nA} + ${nB} - ${nInter} = ${nUnion}$$`,
              `由容斥原理：\n\n$$|A \\cup B| = |A| + |B| - |A \\cap B| = ${nA} + ${nB} - ${nInter} = ${nUnion}$$`,
            ),
            wrong: [nA + nB, nUnion + 2, nUnion - 2],
          });
        } else {
          return numberProblem({
            prompt: t(
              `Given two finite sets $A$ and $B$ with $|A| = ${nA}$, $|B| = ${nB}$, and $|A \\cup B| = ${nUnion}$, find $|A \\cap B|$.`,
              `已知有限集合 $A$ 与 $B$ 满足 $|A| = ${nA}$，$|B| = ${nB}$，且 $|A \\cup B| = ${nUnion}$，求 $|A \\cap B|$。`,
            ),
            answer: nInter,
            solution: t(
              `Rearranging the Inclusion-Exclusion formula:\n\n$$|A \\cap B| = |A| + |B| - |A \\cup B| = ${nA} + ${nB} - ${nUnion} = ${nInter}$$`,
              `由容斥原理变形可得：\n\n$$|A \\cap B| = |A| + |B| - |A \\cup B| = ${nA} + ${nB} - ${nUnion} = ${nInter}$$`,
            ),
            wrong: [nInter + 1, Math.max(1, nInter - 2), nA + nB],
          });
        }
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
  prerequisites: ["cardinality-of-finite-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "countable-and-countably-infinite-sets",
      title: t("Countable and countably infinite sets", "可数集与可数无限集"),
      explanation: t(
        "A set is countably infinite if there is a bijection between it and the natural numbers $\\mathbb{N}$; its cardinality is denoted $\\aleph_0$ ('aleph-null'). Countably infinite sets include $\\mathbb{N}$, the integers $\\mathbb{Z}$, the rational numbers $\\mathbb{Q}$, and Cartesian products like $\\mathbb{N} \\times \\mathbb{N}$.",
        "若一个集合与自然数集 $\\mathbb{N}$ 之间存在一一对应（双射），则称该集合为可数无限集，其基数记作 $\\aleph_0$（阿列夫零）。常见的可数无限集包括自然数集 $\\mathbb{N}$、整数集 $\\mathbb{Z}$、有理数集 $\\mathbb{Q}$，以及笛卡尔积 $\\mathbb{N} \\times \\mathbb{N}$。",
      ),
      generate(rng) {
        const k = rng.int(2, 35);
        const setType = rng.pick(["multiples", "rationals_gt", "odds"]);
        let setNameEn: string;
        let setNameZh: string;
        let setLatex: string;
        if (setType === "multiples") {
          setNameEn = `the set of all integer multiples of ${k}`;
          setNameZh = `所有 ${k} 的整数倍构成的集合`;
          setLatex = `\\{ ${k}m \\mid m \\in \\mathbb{Z} \\}`;
        } else if (setType === "rationals_gt") {
          setNameEn = `the set of rational numbers greater than ${k}`;
          setNameZh = `所有大于 ${k} 的有理数构成的集合`;
          setLatex = `\\{ q \\in \\mathbb{Q} \\mid q > ${k} \\}`;
        } else {
          setNameEn = `the set of integers of the form $${2 * k}n + 1$`;
          setNameZh = `形如 $${2 * k}n + 1$ 的整数集合`;
          setLatex = `\\{ ${2 * k}n + 1 \\mid n \\in \\mathbb{Z} \\}`;
        }

        return oneOf(
          rng,
          t(
            `Classify the cardinality of the set $S = ${setLatex}$ (${setNameEn}):`,
            `判断集合 $S = ${setLatex}$（${setNameZh}）的基数类型：`,
          ),
          t("Countably infinite (cardinality $\\aleph_0$)", "可数无限集（基数为 $\\aleph_0$）"),
          [
            t("Uncountably infinite (continuum cardinality $\\mathfrak{c}$)", "不可数无限集（连续统基数 $\\mathfrak{c}$）"),
            t("Finite set", "有限集合"),
            t("Undefined cardinality", "基数未定义"),
          ],
          t(
            `Because $S$ is an infinite subset of the countable set $${setType === "rationals_gt" ? "\\mathbb{Q}" : "\\mathbb{Z}"}$, it can be placed in a one-to-one correspondence with the natural numbers $\\mathbb{N}$. Thus its cardinality is $\\aleph_0$ (countably infinite).`,
            `因为 $S$ 是可数集 $${setType === "rationals_gt" ? "\\mathbb{Q}" : "\\mathbb{Z}"}$ 的无限子集，它可以与自然数集 $\\mathbb{N}$ 建立一一对应。因此它是可数无限集，基数为 $\\aleph_0$。`,
          ),
        );
      },
    },
    {
      id: "uncountable-sets",
      title: t("Uncountable sets", "不可数集"),
      explanation: t(
        "An infinite set that cannot be put into one-to-one correspondence with $\\mathbb{N}$ is uncountable. By Cantor's diagonal argument, the real numbers $\\mathbb{R}$ and any non-degenerate real interval $(a, b)$ have continuum cardinality $\\mathfrak{c} = 2^{\\aleph_0} > \\aleph_0$, making them uncountable.",
        "不能与自然数集 $\\mathbb{N}$ 建立双射的无限集称为不可数集。由康托尔对角线论证法可知，实数集 $\\mathbb{R}$ 以及任何非单点实数区间 $(a, b)$ 的基数均为连续统基数 $\\mathfrak{c} = 2^{\\aleph_0} > \\aleph_0$，因此它们是不可数的。",
      ),
      generate(rng) {
        const a = rng.int(-15, 10);
        const len = rng.int(2, 12);
        const b = a + len;
        const open = rng.bool();
        const intervalStr = open ? `(${a}, ${b})` : `[${a}, ${b}]`;

        return oneOf(
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
            t("Countably infinite (cardinality $\\aleph_0$)", "可数无限集（基数为 $\\aleph_0$）"),
            t(`Finite set with cardinality $|S| = ${len}$`, `有限集，元素个数 $|S| = ${len}$`),
            t("The empty set", "空集"),
          ],
          t(
            `Every non-degenerate real interval contains uncountably many points (in bijection with $\\mathbb{R}$, having continuum cardinality $\\mathfrak{c}$).`,
            `任何非单点的实数区间都包含不可数个实数点（与整个实数集 $\\mathbb{R}$ 等势，基数为连续统基数 $\\mathfrak{c}$）。`,
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
  prerequisites: ["special-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "subsets-and-proper-subsets",
      title: t("Subsets and proper subsets", "子集与真子集"),
      explanation: t(
        "$A$ is a subset of $B$ ($A \\subseteq B$) if every element of $A$ belongs to $B$: $\\forall x (x \\in A \\implies x \\in B)$. $A$ is a proper subset of $B$ ($A \\subsetneq B$) if $A \\subseteq B$ and $A \\neq B$ (there is at least one element in $B$ not in $A$). For every set $A$, $\\emptyset \\subseteq A$ and $A \\subseteq A$.",
        "若 $A$ 的每个元素都属于 $B$，则称 $A$ 是 $B$ 的子集（$A \\subseteq B$），即 $\\forall x (x \\in A \\implies x \\in B)$。若 $A \\subseteq B$ 且 $A \\neq B$（即 $B$ 中至少含有一个不属于 $A$ 的元素），则称 $A$ 是 $B$ 的真子集（$A \\subsetneq B$）。对任意集合 $A$，恒有 $\\emptyset \\subseteq A$ 且 $A \\subseteq A$。",
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
        const solution = [
          t(
            `Every element of $A$ is in $B$, so $A \\subseteq B$, and $B$ also contains $${sorted(extraB)}$, which ${extraB.length === 1 ? "is" : "are"} not in $A$. So $A \\subsetneq B$.`,
            `$A$ 的每个元素都在 $B$ 中，故 $A \\subseteq B$；而 $B$ 还含有 $A$ 中没有的 $${sorted(extraB)}$，所以 $A \\subsetneq B$。`,
          ),
          t(
            `Every element of $B$ is in $A$, so $B \\subseteq A$, and $A$ also contains $${sorted(extraA)}$, which ${extraA.length === 1 ? "is" : "are"} not in $B$. So $B \\subsetneq A$.`,
            `$B$ 的每个元素都在 $A$ 中，故 $B \\subseteq A$；而 $A$ 还含有 $B$ 中没有的 $${sorted(extraA)}$，所以 $B \\subsetneq A$。`,
          ),
          t(
            "Both sets have exactly the same elements, listed in a different order, so $A \\subseteq B$ and $B \\subseteq A$: $A = B$.",
            "两个集合的元素完全相同，只是列出的顺序不同，故 $A \\subseteq B$ 且 $B \\subseteq A$，即 $A = B$。",
          ),
          t(
            `$${sorted(extraA)} \\in A$ but not in $B$, and $${sorted(extraB)} \\in B$ but not in $A$, so neither set is a subset of the other.`,
            `$${sorted(extraA)} \\in A$ 但不在 $B$ 中，$${sorted(extraB)} \\in B$ 但不在 $A$ 中，所以两者互不为子集。`,
          ),
        ];
        return choiceProblem({
          prompt: t(
            `Let $A = ${aStr}$ and $B = ${bStr}$. Which relationship between $A$ and $B$ is correct?`,
            `设 $A = ${aStr}$ 且 $B = ${bStr}$。下列关于 $A$ 与 $B$ 之间关系的表述哪项是正确的？`,
          ),
          options,
          correct: relation,
          solution: solution[relation]!,
        });
      },
    },
    {
      id: "the-power-set",
      title: t("The power set", "幂集"),
      explanation: t(
        "The power set of a set $A$, denoted $\\mathcal{P}(A)$ or $2^A$, is the set of all subsets of $A$. If $|A| = n$, then $|\\mathcal{P}(A)| = 2^n$. For example, if $A = \\{1, 2\\}$, then $\\mathcal{P}(A) = \\{\\emptyset, \\{1\\}, \\{2\\}, \\{1, 2\\}\\}$ and $|\\mathcal{P}(A)| = 2^2 = 4$.",
        "集合 $A$ 的幂集（记作 $\\mathcal{P}(A)$ 或 $2^A$）是由 $A$ 的所有子集组成的集合。若 $|A| = n$，则其幂集的基数为 $|\\mathcal{P}(A)| = 2^n$。例如若 $A = \\{1, 2\\}$，则 $\\mathcal{P}(A) = \\{\\emptyset, \\{1\\}, \\{2\\}, \\{1, 2\\}\\}$，其元素个数为 $2^2 = 4$。",
      ),
      generate(rng) {
        const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const n = rng.int(2, 5);
        const elements = rng.sample(pool, n).sort((a, b) => a - b);
        const setStr = `\\{${elements.join(", ")}\\}`;
        const card = 2 ** n;
        return numberProblem({
          prompt: t(
            `If finite set $A = ${setStr}$, find the cardinality $|\\mathcal{P}(A)|$ of its power set.`,
            `若有限集合 $A = ${setStr}$，求其幂集的基数 $|\\mathcal{P}(A)|$。`,
          ),
          answer: card,
          solution: t(
            `Set $A$ contains $|A| = ${n}$ elements. Each element has 2 choices (included or excluded) in a subset, giving $|\\mathcal{P}(A)| = 2^{${n}} = ${card}$.`,
            `集合 $A$ 共含有 $|A| = ${n}$ 个元素。构造子集时每个元素均有包含与不包含2种选择，因此 $|\\mathcal{P}(A)| = 2^{${n}} = ${card}$。`,
          ),
          wrong: [2 * n, n * n, card - 1, card + 1],
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
  prerequisites: ["subsets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "computing-the-set-difference",
      title: t("Computing the set difference", "计算集合的相对差集"),
      explanation: t(
        "The relative complement (or difference) of $B$ in $A$, denoted $A \\setminus B$ (or $A - B$), is the set of elements that belong to $A$ but do not belong to $B$: $A \\setminus B = \\{x \\in A \\mid x \\notin B\\}$.",
        "集合 $B$ 相对于集合 $A$ 的相对补集（或差集），记作 $A \\setminus B$（或 $A - B$），是由所有属于 $A$ 但不属于 $B$ 的元素组成的集合：$A \\setminus B = \\{x \\in A \\mid x \\notin B\\}$。",
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
          solution: t(
            `$A \\setminus B$ contains elements in $A$ that are not in $B$. Removing shared elements $\\{${shared.join(", ")}\\}$ from $A$ leaves $${diffStr}$.`,
            `$A \\setminus B$ 包含属于 $A$ 但不属于 $B$ 的元素。从 $A$ 中去掉两者的公共元素 $\\{${shared.join(", ")}\\}$，得到 $${diffStr}$。`,
          ),
          wrong: [onlyB.map(String), shared.map(String)],
        });
      },
    },
    {
      id: "properties-of-set-difference",
      title: t("Properties of set difference", "差集的性质"),
      explanation: t(
        "The difference of two sets keeps the elements of the first set that are not in the second, so it never shares any element with the second set. Important properties of set difference include: $A \\setminus A = \\emptyset$, $A \\setminus \\emptyset = A$, $(A \\setminus B) \\cap B = \\emptyset$, and $A \\setminus B = A \\iff A \\cap B = \\emptyset$. Also, $A \\setminus (A \\setminus B) = A \\cap B$. The symmetric difference is $(A \\setminus B) \\cup (B \\setminus A)$.",
        "两个集合的差保留第一个集合中不属于第二个集合的元素，所以它与第二个集合没有公共元素。差集的重要运算性质包括：$A \\setminus A = \\emptyset$，$A \\setminus \\emptyset = A$，$(A \\setminus B) \\cap B = \\emptyset$，以及 $A \\setminus B = A \\iff A \\cap B = \\emptyset$。此外还有 $A \\setminus (A \\setminus B) = A \\cap B$。对称差集定义为 $(A \\setminus B) \\cup (B \\setminus A)$。",
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
        const unionAll = [...A, ...B].sort((a, b) => a - b);

        return solutionsProblem({
          prompt: t(
            `Given sets $A = ${aStr}$ and $B = ${bStr}$, find all elements of the symmetric difference $(A \\setminus B) \\cup (B \\setminus A)$.`,
            `已知集合 $A = ${aStr}$ 与 $B = ${bStr}$，求对称差集 $(A \\setminus B) \\cup (B \\setminus A)$ 的全部元素。`,
          ),
          values: symDiff.map(String),
          variable: "x",
          solution: t(
            `We have $A \\setminus B = \\{${onlyA.join(", ")}\\}$ and $B \\setminus A = \\{${onlyB.join(", ")}\\}$. Taking the union gives $(A \\setminus B) \\cup (B \\setminus A) = ${symDiffStr}$.`,
            `易得 $A \\setminus B = \\{${onlyA.join(", ")}\\}$ 且 $B \\setminus A = \\{${onlyB.join(", ")}\\}$。取并集得到 $(A \\setminus B) \\cup (B \\setminus A) = ${symDiffStr}$。`,
          ),
          wrong: [unionAll.map(String), shared.map(String)],
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
  prerequisites: ["the-difference-of-sets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "absolute-complement-with-respect-to-universal-set",
      title: t("Absolute complement with respect to a universal set", "全集下的绝对补集"),
      explanation: t(
        "When all sets under consideration are subsets of a universal set $U$, the absolute complement of $A$, denoted $A^c$ or $A'$ or $\\overline{A}$, is $U \\setminus A = \\{x \\in U \\mid x \\notin A\\}$. Clearly, $A \\cup A^c = U$ and $A \\cap A^c = \\emptyset$.",
        "当所研究的集合都是全集 $U$ 的子集时，$A$ 关于 $U$ 的绝对补集（记作 $A^c$、$\\overline{A}$ 或 $A'$）定义为 $U \\setminus A = \\{x \\in U \\mid x \\notin A\\}$。显然有 $A \\cup A^c = U$ 且 $A \\cap A^c = \\emptyset$。",
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
        const acStr = `\\{${Ac.join(", ")}\\}`;
        return numberProblem({
          prompt: t(
            `Let universal set $U = ${uStr}$ and $A = \\{x \\in U \\mid x \\text{ is a multiple of } ${k}\\} = ${aStr}$. Find the cardinality $|A^c|$ of the complement.`,
            `设全集 $U = ${uStr}$ 且 $A = \\{x \\in U \\mid x \\text{ 是 } ${k} \\text{ 的倍数}\\} = ${aStr}$。求补集 $A^c$ 的基数 $|A^c|$。`,
          ),
          answer: Ac.length,
          solution: t(
            `$A^c = U \\setminus A$ consists of all $${Ac.length}$ elements in $U$ that are not multiples of $${k}$: $A^c = ${acStr}$. Thus $|A^c| = ${Ac.length}$.`,
            `$A^c = U \\setminus A$ 由 $U$ 中所有不是 $${k}$ 的倍数的 $${Ac.length}$ 个元素构成：$A^c = ${acStr}$。因此 $|A^c| = ${Ac.length}$。`,
          ),
          wrong: [A.length, n, Ac.length + 1, Math.max(1, Ac.length - 1)],
        });
      },
    },
    {
      id: "de-morgans-laws",
      title: t("De Morgan's laws for sets", "集合的德摩根定律"),
      explanation: t(
        "De Morgan's Laws state that for any subsets $A, B \\subseteq U$:\n\n1. $(A \\cup B)^c = A^c \\cap B^c$\n2. $(A \\cap B)^c = A^c \\cup B^c$\n\nThe complement of a union is the intersection of the complements, and the complement of an intersection is the union of the complements.",
        "德摩根定律指出，对全集 $U$ 的任意子集 $A, B$：\n\n1. $(A \\cup B)^c = A^c \\cap B^c$\n2. $(A \\cap B)^c = A^c \\cup B^c$\n\n并集的补集等于补集的交集，交集的补集等于补集的并集。",
      ),
      generate(rng) {
        const n = rng.int(8, 15);
        const U: number[] = [];
        for (let i = 1; i <= n; i++) U.push(i);
        const aVals = rng.sample(U, rng.int(2, 4)).sort((a, b) => a - b);
        const bVals = rng.sample(U, rng.int(2, 4)).sort((a, b) => a - b);
        const B = new Set(bVals);
        const isUnion = rng.bool();
        if (isUnion) {
          const unionSet = new Set([...aVals, ...bVals]);
          const res = U.filter((x) => !unionSet.has(x));
          const resStr = `\\{${res.join(", ")}\\}`;
          const unionStr = `\\{${[...unionSet].sort((a, b) => a - b).join(", ")}\\}`;
          return numberProblem({
            prompt: t(
              `Let $U = \\{1, \\dots, ${n}\\}$, $A = \\{${aVals.join(", ")}\\}$, and $B = \\{${bVals.join(", ")}\\}$. Find the cardinality $|(A \\cup B)^c|$ of the complement of the union.`,
              `设全集 $U = \\{1, \\dots, ${n}\\}$，$A = \\{${aVals.join(", ")}\\}$，$B = \\{${bVals.join(", ")}\\}$。求并集的补集的基数 $|(A \\cup B)^c|$。`,
            ),
            answer: res.length,
            solution: t(
              `First compute the union $A \\cup B = ${unionStr}$, which has $${unionSet.size}$ elements. Taking the complement with respect to $U$ gives $(A \\cup B)^c = ${resStr}$, which has $|(A \\cup B)^c| = ${res.length}$ elements. By De Morgan's laws, this also equals $|A^c \\cap B^c|$.`,
              `首先求并集 $A \\cup B = ${unionStr}$，共含 $${unionSet.size}$ 个元素。取关于全集 $U$ 的补集得 $(A \\cup B)^c = ${resStr}$，元素个数为 $|(A \\cup B)^c| = ${res.length}$。由德摩根定律知其亦等于 $|A^c \\cap B^c|$。`,
            ),
            wrong: [n - res.length, n, res.length + 1, Math.max(0, res.length - 1)],
          });
        } else {
          const interSet = new Set(aVals.filter((x) => B.has(x)));
          const res = U.filter((x) => !interSet.has(x));
          const resStr = `\\{${res.join(", ")}\\}`;
          const interStr = interSet.size === 0 ? "\\emptyset" : `\\{${[...interSet].sort((a, b) => a - b).join(", ")}\\}`;
          return numberProblem({
            prompt: t(
              `Let $U = \\{1, \\dots, ${n}\\}$, $A = \\{${aVals.join(", ")}\\}$, and $B = \\{${bVals.join(", ")}\\}$. Find the cardinality $|(A \\cap B)^c|$ of the complement of the intersection.`,
              `设全集 $U = \\{1, \\dots, ${n}\\}$，$A = \\{${aVals.join(", ")}\\}$，$B = \\{${bVals.join(", ")}\\}$。求交集的补集的基数 $|(A \\cap B)^c|$。`,
            ),
            answer: res.length,
            solution: t(
              `First compute intersection $A \\cap B = ${interStr}$, which has $${interSet.size}$ elements. Then $(A \\cap B)^c = U \\setminus (A \\cap B) = ${resStr}$, which has $|(A \\cap B)^c| = ${res.length}$ elements. By De Morgan's laws, this also equals $|A^c \\cup B^c|$.`,
              `首先求交集 $A \\cap B = ${interStr}$，共含 $${interSet.size}$ 个元素。因此补集为 $(A \\cap B)^c = U \\setminus (A \\cap B) = ${resStr}$，元素个数为 $|(A \\cap B)^c| = ${res.length}$。由德摩根定律知其亦等于 $|A^c \\cup B^c|$。`,
            ),
            wrong: [n - res.length, n, res.length + 1, Math.max(0, res.length - 1)],
          });
        }
      },
    },
  ],
};

// ─── 1.2.3 The Cartesian Product ─────────────────────────────────────────────

export const theCartesianProduct: TopicDef = {
  id: "the-cartesian-product",
  title: t("The Cartesian Product", "笛卡尔积"),
  summary: t("Construct the Cartesian product of two sets and evaluate its cardinality.", "构造两个集合的笛卡尔积并计算其元素总数。"),
  prerequisites: ["subsets"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "elements-of-the-cartesian-product",
      title: t("Elements of the Cartesian product", "笛卡尔积的元素与序偶"),
      explanation: t(
        "The Cartesian product $A \\times B$ is the set of all ordered pairs $(a, b)$ where $a \\in A$ and $b \\in B$: $A \\times B = \\{(a, b) \\mid a \\in A, b \\in B\\}$. In general, $A \\times B \\neq B \\times A$ because ordered pairs depend on order: $(a, b) \\neq (b, a)$ when $a \\neq b$.",
        "两个集合 $A$ 与 $B$ 的笛卡尔积 $A \\times B$ 是由所有有序对 $(a, b)$ 组成的集合，其中 $a \\in A$ 且 $b \\in B$：$A \\times B = \\{(a, b) \\mid a \\in A, b \\in B\\}$。一般而言 $A \\times B \\neq B \\times A$，因为有序对依赖于元素次序：当 $a \\neq b$ 时 $(a, b) \\neq (b, a)$。",
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
        return reasoned(
          oneOf(
            rng,
            t(
              `Let $A = \\{${A.join(", ")}\\}$ and $B = \\{${B.join(", ")}\\}$. Which of the following ordered pairs is an element of $A \\times B$?`,
              `设 $A = \\{${A.join(", ")}\\}$ 且 $B = \\{${B.join(", ")}\\}$。下列哪个有序对属于笛卡尔积 $A \\times B$？`,
            ),
            t(`$${rightPair}$`, `$${rightPair}$`),
            [t(`$${wrongPair1}$`, `$${wrongPair1}$`), t(`$${wrongPair2}$`, `$${wrongPair2}$`), t(`$${wrongPair3}$`, `$${wrongPair3}$`)],
            t(
              `By definition, $(a, b) \\in A \\times B$ if and only if $a \\in A$ and $b \\in B$. Here $${A[0]} \\in A$ and $${B[0]} \\in B$, so $${rightPair} \\in A \\times B$. Note that $${wrongPair1} \\in B \\times A$, not $A \\times B$.`,
              `根据定义，$(a, b) \\in A \\times B$ 当且仅当首元素属于 $A$ 且次元素属于 $B$。在此 $${A[0]} \\in A$ 且 $${B[0]} \\in B$，故 $${rightPair} \\in A \\times B$。注意 $${wrongPair1} \\in B \\times A$。`,
            ),
          ),
          [
            [`$${wrongPair1}$`, "The order is reversed: the first entry must come from $A$.", "次序反了：第一个元素必须来自 $A$。"],
            [
              `$${wrongPair2}$`,
              "Both entries come from $A$, but the second must come from $B$.",
              "两个元素都来自 $A$，但第二个必须来自 $B$。",
            ],
            [
              `$${wrongPair3}$`,
              "Both entries come from $B$, but the first must come from $A$.",
              "两个元素都来自 $B$，但第一个必须来自 $A$。",
            ],
          ],
        );
      },
    },
    {
      id: "cardinality-of-cartesian-products",
      title: t("Cardinality of Cartesian products", "笛卡尔积的基数"),
      explanation: t(
        "For finite sets $A$ and $B$, the number of elements in their Cartesian product is the product of their cardinalities: $|A \\times B| = |A| \\cdot |B|$. For multiple sets, $|A_1 \\times A_2 \\times \\cdots \\times A_k| = |A_1| \\cdot |A_2| \\cdots |A_k|$.",
        "对于有限集合 $A$ 与 $B$，其笛卡尔积的元素个数等于各自基数的乘积：$|A \\times B| = |A| \\cdot |B|$。推广到多个有限集合，$|A_1 \\times A_2 \\times \\cdots \\times A_k| = |A_1| \\cdot |A_2| \\cdots |A_k|$。",
      ),
      generate(rng) {
        const m = rng.int(2, 8);
        const n = rng.int(2, 8);
        const prod = m * n;
        return numberProblem({
          prompt: t(
            `If finite set $A$ has $|A| = ${m}$ and finite set $B$ has $|B| = ${n}$, find $|A \\times B|$.`,
            `若有限集合 $A$ 满足 $|A| = ${m}$，有限集合 $B$ 满足 $|B| = ${n}$，求 $|A \\times B|$。`,
          ),
          answer: prod,
          solution: t(
            `Each of the $${m}$ choices from $A$ can be paired with any of the $${n}$ choices from $B$, giving $|A \\times B| = |A| \\cdot |B| = ${m} \\cdot ${n} = ${prod}$.`,
            `集合 $A$ 中的每个元素（共 $${m}$ 个）都可以与集合 $B$ 中的任意元素（共 $${n}$ 个）配对，因此 $|A \\times B| = |A| \\cdot |B| = ${m} \\cdot ${n} = ${prod}$。`,
          ),
          wrong: [m + n, prod + 2, prod - 2],
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
  prerequisites: ["the-cartesian-product"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "discrete-cartesian-grids",
      title: t("Discrete Cartesian product grids", "离散笛卡尔积网格点"),
      explanation: t(
        "When $A$ and $B$ are discrete subsets of $\\mathbb{R}$, $A \\times B$ forms a lattice of points in the Cartesian plane $\\mathbb{R}^2$. The horizontal coordinates come from $A$ and the vertical coordinates from $B$.",
        "当 $A$ 与 $B$ 是实数集 $\\mathbb{R}$ 的离散子集时，$A \\times B$ 在平面直角坐标系 $\\mathbb{R}^2$ 中表示为一个点阵网格。点的横坐标取自 $A$，纵坐标取自 $B$。",
      ),
      generate(rng) {
        const poolX = [1, 2, 3, 4, 5];
        const poolY = [-3, -2, -1, 1, 2, 3];
        const countX = rng.int(2, 4);
        const countY = rng.int(2, 4);
        const A = rng.sample(poolX, countX).sort((a, b) => a - b);
        const B = rng.sample(poolY, countY).sort((a, b) => a - b);
        const positiveYCount = B.filter((y) => y > 0).length;
        const firstQuadrantPoints = A.length * positiveYCount;
        return numberProblem({
          prompt: t(
            `Let $A = \\{${A.join(", ")}\\}$ and $B = \\{${B.join(", ")}\\}$. How many points of the Cartesian product $A \\times B$ lie strictly in the first quadrant of $\\mathbb{R}^2$ ($x > 0$ and $y > 0$)?`,
            `设 $A = \\{${A.join(", ")}\\}$ 且 $B = \\{${B.join(", ")}\\}$。笛卡尔积 $A \\times B$ 中共有多少个点严格位于 $\\mathbb{R}^2$ 的第一象限（$x > 0$ 且 $y > 0$）？`,
          ),
          answer: firstQuadrantPoints,
          solution: t(
            `A point $(x, y) \\in A \\times B$ lies in the first quadrant if $x > 0$ and $y > 0$. Here all $${A.length}$ elements of $A$ are positive, and $${positiveYCount}$ elements of $B$ are positive, giving $${A.length} \\times ${positiveYCount} = ${firstQuadrantPoints}$ points.`,
            `点 $(x, y) \\in A \\times B$ 位于第一象限当且仅当 $x > 0$ 且 $y > 0$。在此 $A$ 的全部 $${A.length}$ 个元素均为正，$B$ 中有 $${positiveYCount}$ 个正数，因此第一象限内的点共有 $${A.length} \\times ${positiveYCount} = ${firstQuadrantPoints}$ 个。`,
          ),
          wrong: [A.length * B.length, firstQuadrantPoints + 1, Math.max(0, firstQuadrantPoints - 1)],
        });
      },
    },
    {
      id: "cartesian-product-of-intervals",
      title: t("Cartesian product of intervals", "区间的笛卡尔积与平面矩形"),
      explanation: t(
        "If $I_1 = [a, b]$ and $I_2 = [c, d]$ are intervals on the real line, their Cartesian product $I_1 \\times I_2 = \\{(x, y) \\in \\mathbb{R}^2 \\mid a \\le x \\le b, c \\le y \\le d\\}$ is a rectangle in $\\mathbb{R}^2$ with width $b - a$, height $d - c$, and area $(b - a)(d - c)$.",
        "若 $I_1 = [a, b]$ 与 $I_2 = [c, d]$ 为实数区间，则其笛卡尔积 $I_1 \\times I_2 = \\{(x, y) \\in \\mathbb{R}^2 \\mid a \\le x \\le b, c \\le y \\le d\\}$ 表示平面 $\\mathbb{R}^2$ 上的一个矩形区域，其底宽为 $b - a$，高为 $d - c$，面积为 $(b - a)(d - c)$。",
      ),
      generate(rng) {
        const a = rng.int(-5, 3);
        const w = rng.int(2, 8);
        const b = a + w;
        const c = rng.int(-4, 4);
        const h = rng.int(2, 8);
        const d = c + h;
        const area = w * h;
        return numberProblem({
          prompt: t(
            `Find the area of the planar region formed by the Cartesian product $[${a}, ${b}] \\times [${c}, ${d}] \\subset \\mathbb{R}^2$.`,
            `求由笛卡尔积 $[${a}, ${b}] \\times [${c}, ${d}] \\subset \\mathbb{R}^2$ 构成的平面矩形区域的面积。`,
          ),
          answer: area,
          solution: t(
            `The region is a rectangle with width $b - a = ${fmtSub(b, a)} = ${w}$ and height $d - c = ${fmtSub(d, c)} = ${h}$. The area is $\\text{width} \\times \\text{height} = ${w} \\times ${h} = ${area}$.`,
            `该区域为一个矩形，宽为 $b - a = ${fmtSub(b, a)} = ${w}$，高为 $d - c = ${fmtSub(d, c)} = ${h}$。其面积为 $\\text{宽} \\times \\text{高} = ${w} \\times ${h} = ${area}$。`,
          ),
          wrong: [2 * (w + h), area + w, area - h],
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
  prerequisites: ["set-complements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "arbitrary-unions-of-indexed-sets",
      title: t("Arbitrary unions of indexed sets", "指标集族的并集"),
      explanation: t(
        "For an indexed collection of sets $\\{A_i\\}_{i \\in I}$, their union $\\bigcup_{i \\in I} A_i$ is the set of all elements belonging to at least one set $A_i$: $\\bigcup_{i \\in I} A_i = \\{x \\mid \\exists i \\in I, x \\in A_i\\}$.",
        "对于由指标集 $I$ 标记的集合族 $\\{A_i\\}_{i \\in I}$，其广义并集 $\\bigcup_{i \\in I} A_i$ 是指属于至少一个 $A_i$ 的所有元素构成的集合：$\\bigcup_{i \\in I} A_i = \\{x \\mid \\exists i \\in I, x \\in A_i\\}$。",
      ),
      generate(rng) {
        const n = rng.int(3, 35);
        const start = rng.int(0, 5);
        return intervalProblem({
          prompt: t(
            `For each $i \\in \\{1, 2, \\dots, ${n}\\}$, let $A_i = [${start}, ${start} + i] \\subset \\mathbb{R}$. Evaluate the union $\\bigcup_{i=1}^{${n}} A_i$ in interval notation.`,
            `对每个 $i \\in \\{1, 2, \\dots, ${n}\\}$，设 $A_i = [${start}, ${start} + i] \\subset \\mathbb{R}$。用区间记号表示并集 $\\bigcup_{i=1}^{${n}} A_i$。`,
          ),
          set: [{ lo: q(start), loClosed: true, hi: q(start + n), hiClosed: true }],
          solution: t(
            `Notice that $A_1 \\subset A_2 \\subset \\dots \\subset A_{${n}} = [${start}, ${start + n}]$. Since the sets are nested, their union is the largest set: $\\bigcup_{i=1}^{${n}} A_i = [${start}, ${start + n}]$.`,
            `注意到这些集合相互嵌套包含：$A_1 \\subset A_2 \\subset \\dots \\subset A_{${n}} = [${start}, ${start + n}]$。因此它们的并集就是包含所有元素的最大集合：$[${start}, ${start + n}]$。`,
          ),
          wrong: [
            [{ lo: q(start), loClosed: true, hi: q(start + 1), hiClosed: true }],
            [{ lo: q(start), loClosed: true, hi: q(start + n + 1), hiClosed: true }],
          ],
        });
      },
    },
    {
      id: "arbitrary-intersections-of-indexed-sets",
      title: t("Arbitrary intersections of indexed sets", "指标集族的交集"),
      explanation: t(
        "For an indexed collection of sets $\\{A_i\\}_{i \\in I}$, their intersection $\\bigcap_{i \\in I} A_i$ is the set of elements belonging to every set $A_i$: $\\bigcap_{i \\in I} A_i = \\{x \\mid \\forall i \\in I, x \\in A_i\\}$.",
        "对于由指标集 $I$ 标记的集合族 $\\{A_i\\}_{i \\in I}$，其广义交集 $\\bigcap_{i \\in I} A_i$ 是指属于每一个 $A_i$ 的所有公共元素构成的集合：$\\bigcap_{i \\in I} A_i = \\{x \\mid \\forall i \\in I, x \\in A_i\\}$。",
      ),
      generate(rng) {
        const n = rng.int(3, 35);
        const c = rng.int(-5, 5);
        return intervalProblem({
          prompt: t(
            `For each $i \\in \\{1, 2, \\dots, ${n}\\}$, let $A_i = [${c} - i, ${c} + i] \\subset \\mathbb{R}$. Evaluate the intersection $\\bigcap_{i=1}^{${n}} A_i$ in interval notation.`,
            `对每个 $i \\in \\{1, 2, \\dots, ${n}\\}$，设 $A_i = [${c} - i, ${c} + i] \\subset \\mathbb{R}$。用区间记号表示交集 $\\bigcap_{i=1}^{${n}} A_i$。`,
          ),
          set: [{ lo: q(c - 1), loClosed: true, hi: q(c + 1), hiClosed: true }],
          solution: t(
            `The intervals are nested in reverse: $A_1 = [${c - 1}, ${c + 1}] \\subset A_2 \\subset \\dots \\subset A_{${n}}$. The intersection of nested sets is the smallest set, so $\\bigcap_{i=1}^{${n}} A_i = A_1 = [${c - 1}, ${c + 1}]$.`,
            `这些区间满足反向嵌套包含：$A_1 = [${c - 1}, ${c + 1}] \\subset A_2 \\subset \\dots \\subset A_{${n}}$。嵌套集合族的交集即为其最小集合，因此 $\\bigcap_{i=1}^{${n}} A_i = A_1 = [${c - 1}, ${c + 1}]$。`,
          ),
          wrong: [
            [{ lo: q(c - n), loClosed: true, hi: q(c + n), hiClosed: true }],
            [{ lo: q(c - 1), loClosed: false, hi: q(c + 1), hiClosed: false }],
          ],
        });
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
  prerequisites: ["the-cartesian-product"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "functions-as-relations",
      title: t("Functions as relations", "函数作为笛卡尔积的子集"),
      explanation: t(
        "A relation from $A$ to $B$ is any subset $R \\subseteq A \\times B$. A relation $f \\subseteq A \\times B$ is a function from $A$ to $B$ (denoted $f: A \\to B$) if every element $a \\in A$ appears as the first entry of exactly one ordered pair $(a, b) \\in f$.",
        "从集合 $A$ 到集合 $B$ 的二元关系是笛卡尔积 $A \\times B$ 的任意子集 $R$。若关系 $f \\subseteq A \\times B$ 满足 $A$ 中的每个元素 $a$ 都在 $f$ 中有且仅有一个有序对 $(a, b)$ 与之对应，则称 $f$ 是从 $A$ 到 $B$ 的函数（记作 $f: A \\to B$）。",
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
        return oneOf(
          rng,
          t(
            `Let $A = ${aStr}$ and $B = ${bStr}$. Which of the following subsets of $A \\times B$ is a well-defined function $f: A \\to B$?`,
            `设 $A = ${aStr}$ 且 $B = ${bStr}$。下列 $A \\times B$ 的哪个子集构成了良定义的函数 $f: A \\to B$？`,
          ),
          t(`$${rightRel}$`, `$${rightRel}$`),
          [
            t(`$${notFuncMulti}$`, `$${notFuncMulti}$`),
            t(`$${notFuncMissing}$`, `$${notFuncMissing}$`),
            t(`$${notFuncEmpty}$`, `$${notFuncEmpty}$`),
          ],
          t(
            `For $f$ to be a function from $A$ to $B$, every element in $A$ must appear exactly once as an input. In $${rightRel}$, each of ${A.join(", ")} has a unique image. In $${notFuncMulti}$, $${A[0]}$ has two outputs; in $${notFuncMissing}$, $${A[2]}$ has no output.`,
            `要使 $f$ 成为从 $A$ 到 $B$ 的函数，$A$ 中的每个元素必须在有序对的首项恰好出现一次。在 $${rightRel}$ 中，${A.join(", ")} 各自对应唯一的输出。其他选项存在一数多值或输入缺失的情况。`,
          ),
        );
      },
    },
    {
      id: "domain-codomain-and-range",
      title: t("Domain, codomain, and range", "定义域、到达域与值域"),
      explanation: t(
        "For a function $f: A \\to B$, $A$ is the domain, $B$ is the codomain, and the range (or image) is the set of all outputs actually attained: $f(A) = \\{f(a) \\mid a \\in A\\} \\subseteq B$. The range is always a subset of the codomain, but need not equal the entire codomain.",
        "对于函数 $f: A \\to B$，$A$ 称为定义域，$B$ 称为到达域（陪域），而值域（或像集）是实际达到的所有输出构成的集合：$f(A) = \\{f(a) \\mid a \\in A\\} \\subseteq B$。值域总是到达域的子集，但不一定等于整个到达域。",
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
          solution: t(
            `Compute $f(x)$ for each domain element:\n\n- $f(1) = ${rangeVals[0]}$\n- $f(2) = ${rangeVals[1]}$\n- $f(3) = ${rangeVals[2]}$\n- $f(4) = ${rangeVals[3]}$\n\nThus the range is $${rangeStr}$.`,
            `分别计算定义域中每个元素的像：\n\n- $f(1) = ${rangeVals[0]}$\n- $f(2) = ${rangeVals[1]}$\n- $f(3) = ${rangeVals[2]}$\n- $f(4) = ${rangeVals[3]}$\n\n因此值域为 $${rangeStr}$。`,
          ),
          wrong: [rangeVals.slice(0, 3).map(String), [1, 2, 3, 4].map(String)],
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
