import type { KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { paren, poly } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";
import { pickChoice } from "./grade-4-fractions.ts";

// ACT Math Fundamentals, functions: exponential equations whose exponent is quadratic, nested compositions, terms of
// recurrences that are not arithmetic or geometric, and which of several functions eventually exceeds the others.

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

/** nonzero picks a nonzero integer in [-m, m]. */
const nonzero = (rng: Rng, m: number) => rng.pick([...Array(2 * m + 1).keys()].map((i) => i - m).filter((v) => v !== 0));

/** factored writes (x - r)(x - s). */
const factored = (r: number, s: number) => `(${poly([1, "x"], [-r, ""])})(${poly([1, "x"], [-s, ""])})`;

// ---------------------------------------------------------------------------
// Quadratic exponents

/** solutionsText names the solutions of an equation as an answer option. */
const solutionsText = (r: number, s: number): Text =>
  r === s ? t(`$x = ${r}$ only`, `只有 $x = ${r}$`) : t(`$x = ${r}$ or $x = ${s}$`, `$x = ${r}$ 或 $x = ${s}$`);

/** solvingExponentialEquationsWithAQuadraticExponent solves exponential equations that lead to a quadratic in x. */
export const solvingExponentialEquationsWithAQuadraticExponent = topic(
  "solving-exponential-equations-with-a-quadratic-exponent",
  t("Solving Exponential Equations with a Quadratic Exponent", "解指数为二次式的指数方程"),
  t(
    "Solve an exponential equation whose exponent is quadratic by writing both sides as powers of one base, equating the exponents and solving the quadratic.",
    "把两边写成同底数的幂、令指数相等，再解所得的二次方程，从而解指数为二次式的指数方程。",
  ),
  ["solving-exponential-equations", "solving-quadratic-equations-by-factoring"],
  ["HSA.REI.B.4b"],
  [
    kp(
      "a-quadratic-exponent-equal-to-a-number",
      t("A quadratic exponent equal to a number", "二次指数等于一个数"),
      t(
        "To solve $2^{x^{2} - 2x} = 8$, write $8 = 2^{3}$ and equate the exponents: $x^{2} - 2x = 3$. Move everything to one side and factor: $x^{2} - 2x - 3 = (x - 3)(x + 1) = 0$, so $x = 3$ or $x = -1$. A quadratic exponent usually gives two solutions; check both in the original equation.",
        "解 $2^{x^{2} - 2x} = 8$ 时，把 $8$ 写成 $2^{3}$，令指数相等：$x^{2} - 2x = 3$。移项并分解：$x^{2} - 2x - 3 = (x - 3)(x + 1) = 0$，所以 $x = 3$ 或 $x = -1$。指数为二次式时通常有两个解；要在原方程中检验这两个解。",
      ),
      (rng) => {
        const b = rng.pick([2, 3, 5]);
        let r = 0;
        let s = 0;
        let n = 0;
        // x² - (r + s)x = n with n = -rs, so that b^n is a whole number or a unit fraction of moderate size.
        do {
          [r, s] = [nonzero(rng, 5), nonzero(rng, 5)];
          n = -r * s;
        } while (r <= s || n === 0 || Math.abs(n) > (b === 2 ? 6 : b === 3 ? 4 : 3));
        const value = n > 0 ? `${b ** n}` : `\\frac{1}{${b ** -n}}`;
        const exponent = poly([1, "x^{2}"], [-(r + s), "x"]);
        const larger = rng.bool();
        return numberProblem({
          prompt: t(
            `What is the ${larger ? "larger" : "smaller"} solution of $${b}^{${exponent}} = ${value}$?`,
            `方程 $${b}^{${exponent}} = ${value}$ 的${larger ? "较大" : "较小"}解是多少？`,
          ),
          answer: larger ? r : s,
          solveFor: "x",
          wrong: [larger ? s : r, -r, -s, n],
          solution: t(
            `Write $${value} = ${b}^{${n}}$ and equate the exponents:${steps(`${exponent} = ${n}`, `${poly([1, "x^{2}"], [-(r + s), "x"], [-n, ""])} = 0`, `${factored(r, s)} = 0`)}The solutions are $x = ${r}$ and $x = ${s}$, and the ${larger ? "larger" : "smaller"} one is $${larger ? r : s}$.`,
            `把 $${value}$ 写成 $${b}^{${n}}$，令指数相等：${steps(`${exponent} = ${n}`, `${poly([1, "x^{2}"], [-(r + s), "x"], [-n, ""])} = 0`, `${factored(r, s)} = 0`)}解为 $x = ${r}$ 和 $x = ${s}$，${larger ? "较大" : "较小"}的是 $${larger ? r : s}$。`,
          ),
        });
      },
    ),
    kp(
      "powers-of-a-common-base-on-both-sides",
      t("Powers of a common base on both sides", "两边都是同一底数的幂"),
      t(
        "When the bases differ, rewrite them as powers of one base first. In $3^{x^{2}} = 9^{x + 4}$, write $9^{x + 4} = (3^{2})^{x + 4} = 3^{2x + 8}$. Then $x^{2} = 2x + 8$, so $x^{2} - 2x - 8 = (x - 4)(x + 2) = 0$ and $x = 4$ or $x = -2$. Multiply the whole exponent $x + 4$ by $2$, not only $x$.",
        "底数不同时，先把它们写成同一底数的幂。在 $3^{x^{2}} = 9^{x + 4}$ 中，$9^{x + 4} = (3^{2})^{x + 4} = 3^{2x + 8}$。于是 $x^{2} = 2x + 8$，即 $x^{2} - 2x - 8 = (x - 4)(x + 2) = 0$，$x = 4$ 或 $x = -2$。要把整个指数 $x + 4$ 乘以 $2$，而不只是 $x$。",
      ),
      (rng) => {
        const g = rng.pick([2, 3, 5]);
        const k = rng.pick([2, 3]);
        const d = rng.int(-3, 3);
        // x² + dx = k(x + c) has roots r and s with r + s = k - d and rs = -kc.
        const options: (readonly [number, number])[] = [];
        for (let r = -9; r <= 9; r++) {
          const s = k - d - r;
          if (r > s && s >= -9 && (r * s) % k === 0 && r * s !== 0) options.push([r, s]);
        }
        const [r, s] = rng.pick(options);
        const c = -(r * s) / k;
        const big = g ** k;
        const left = poly([1, "x^{2}"], [d, "x"]);
        const inner = poly([1, "x"], [c, ""]);
        const expanded = poly([k, "x"], [k * c, ""]);
        // The slip of multiplying only x by k gives x² + dx = kx + c.
        const disc = (d - k) ** 2 + 4 * c;
        const root = Math.sqrt(disc);
        const slipRoots = disc >= 0 && Number.isInteger(root) ? [(k - d + root) / 2, (k - d - root) / 2] : undefined;
        const wrong = [solutionsText(-r, -s), solutionsText(r, -s), solutionsText(-r, s)];
        if (slipRoots?.every(Number.isInteger)) wrong.unshift(solutionsText(slipRoots[0]!, slipRoots[1]!));
        return pickChoice(
          rng,
          t(`What are the solutions of $${g}^{${left}} = ${big}^{${inner}}$?`, `方程 $${g}^{${left}} = ${big}^{${inner}}$ 的解是什么？`),
          solutionsText(r, s),
          wrong,
          t(
            `Write $${big} = ${g}^{${k}}$, so $${big}^{${inner}} = ${g}^{${expanded}}$. Equate the exponents:${steps(`${left} = ${expanded}`, `${poly([1, "x^{2}"], [d - k, "x"], [-k * c, ""])} = 0`, `${factored(r, s)} = 0`)}So $x = ${r}$ or $x = ${s}$.`,
            `把 $${big}$ 写成 $${g}^{${k}}$，则 $${big}^{${inner}} = ${g}^{${expanded}}$。令指数相等：${steps(`${left} = ${expanded}`, `${poly([1, "x^{2}"], [d - k, "x"], [-k * c, ""])} = 0`, `${factored(r, s)} = 0`)}所以 $x = ${r}$ 或 $x = ${s}$。`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Nested composition

/** Fn is a function of the composition problems: its formula and its values. */
interface Fn {
  readonly latex: string;
  readonly f: (x: number) => number;
  readonly at: (v: number) => string;
}

/** linearFn is ax + b. */
function linearFn(a: number, b: number): Fn {
  return {
    latex: poly([a, "x"], [b, ""]),
    f: (x) => a * x + b,
    at: (v) => `${a === 1 ? paren(v) : a === -1 ? `-(${v})` : `${a}(${v})`}${b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)}`}`,
  };
}

/** squareFn is x² + c. */
function squareFn(c: number): Fn {
  return {
    latex: poly([1, "x^{2}"], [c, ""]),
    f: (x) => x * x + c,
    at: (v) => `${paren(v)}^{2}${c === 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c)}`}`,
  };
}

/** reasoningWithNestedFunctionComposition evaluates and solves with compositions of three functions or of a function with itself. */
export const reasoningWithNestedFunctionComposition = topic(
  "reasoning-with-nested-function-composition",
  t("Reasoning With Nested Function Composition", "嵌套函数复合的推理"),
  t(
    "Evaluate a composition of three functions from the inside out, and find the input that a function composed with itself sends to a given value.",
    "由内向外求三个函数复合的值，并求出使函数与自身复合后得到给定值的输入。",
  ),
  ["function-composition"],
  ["HSF.BF.A.1c"],
  [
    kp(
      "evaluating-a-triple-composition",
      t("Evaluating a triple composition", "求三重复合的值"),
      t(
        "Work from the innermost function outward. With $f(x) = 2x - 1$ and $g(x) = x^{2} + 1$, to find $f(g(f(2)))$: first $f(2) = 3$, then $g(3) = 10$, then $f(10) = 19$. Each output becomes the next input; the order matters, since $g(f(f(2))) = g(5) = 26$.",
        "从最里层的函数向外算。设 $f(x) = 2x - 1$，$g(x) = x^{2} + 1$，求 $f(g(f(2)))$：先算 $f(2) = 3$，再算 $g(3) = 10$，最后 $f(10) = 19$。每一步的输出是下一步的输入；顺序很重要，因为 $g(f(f(2))) = g(5) = 26$。",
      ),
      (rng) => {
        const f = linearFn(rng.pick([-3, -2, 2, 3]), nonzero(rng, 5));
        const g = squareFn(rng.int(-5, 5));
        const order = rng.pick([
          ["f", "g", "f"],
          ["g", "f", "g"],
          ["f", "f", "g"],
          ["g", "f", "f"],
        ] as const);
        const x = rng.int(-3, 3);
        const fns = { f, g };
        // Evaluate the innermost name first: order lists the outermost function first.
        const inner = [...order].reverse();
        const values: number[] = [x];
        for (const name of inner) values.push(fns[name].f(values[values.length - 1]!));
        const answer = values[values.length - 1]!;
        const call = order.reduceRight((acc, name) => `${name}(${acc})`, `${x}`);
        const work = inner.map((name, i) => {
          const sub = order.slice(order.length - 1 - i).reduceRight((acc, nm) => `${nm}(${acc})`, `${x}`);
          return `${sub} = ${i === 0 ? "" : `${name}(${values[i]}) = `}${fns[name].at(values[i]!)} = ${values[i + 1]}`;
        });
        // The slip of applying the outermost function first.
        const outsideIn = order.reduce((v, name) => fns[name].f(v), x);
        return numberProblem({
          prompt: t(
            `If $f(x) = ${f.latex}$ and $g(x) = ${g.latex}$, what is the value of $${call}$?`,
            `若 $f(x) = ${f.latex}$，$g(x) = ${g.latex}$，则 $${call}$ 的值是多少？`,
          ),
          answer,
          wrong: [outsideIn, values[2]!, f.f(g.f(x)), g.f(f.f(x))],
          solution: t(`Work from the inside out:${steps(...work)}`, `由内向外计算：${steps(...work)}`),
        });
      },
    ),
    kp(
      "an-input-for-a-self-composition",
      t("An input for a self-composition", "自复合的输入"),
      t(
        "To solve $f(f(x)) = 13$ with $f(x) = 3x - 2$, work backward, undoing the outer function first: $f(u) = 13$ gives $u = 5$, and $f(x) = 5$ gives $x = \\frac{7}{3}$. Or expand: $f(f(x)) = 3(3x - 2) - 2 = 9x - 8$, and $9x - 8 = 13$ gives the same $x = \\frac{7}{3}$. Stopping at $u = 5$ answers $f(x) = 13$, not $f(f(x)) = 13$.",
        "解 $f(f(x)) = 13$，其中 $f(x) = 3x - 2$：可以倒推，先还原外层函数：由 $f(u) = 13$ 得 $u = 5$，再由 $f(x) = 5$ 得 $x = \\frac{7}{3}$。也可以展开：$f(f(x)) = 3(3x - 2) - 2 = 9x - 8$，由 $9x - 8 = 13$ 得到同样的 $x = \\frac{7}{3}$。停在 $u = 5$ 解的是 $f(x) = 13$，而不是 $f(f(x)) = 13$。",
      ),
      (rng) => {
        const a = rng.pick([-3, -2, 2, 3, 4]);
        const b = nonzero(rng, 6);
        const f = linearFn(a, b);
        const x = rng.int(-5, 5);
        const u = f.f(x);
        const v = f.f(u);
        return numberProblem({
          prompt: t(
            `If $f(x) = ${f.latex}$, for what value of $x$ is $f(f(x)) = ${v}$?`,
            `若 $f(x) = ${f.latex}$，当 $x$ 取何值时 $f(f(x)) = ${v}$？`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [u, f.f(v), -x],
          solution: t(
            `Work backward. $f(u) = ${v}$ means $${poly([a, "u"], [b, ""])} = ${v}$, so $u = ${u}$. Then $f(x) = ${u}$ means $${f.latex} = ${u}$, so $x = ${x}$. Check: $f(${x}) = ${u}$ and $f(${u}) = ${v}$.`,
            `倒推。$f(u) = ${v}$ 即 $${poly([a, "u"], [b, ""])} = ${v}$，所以 $u = ${u}$。再由 $f(x) = ${u}$ 即 $${f.latex} = ${u}$，得 $x = ${x}$。检验：$f(${x}) = ${u}$，$f(${u}) = ${v}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Nonstandard recurrences

/** Recurrence is a rule of the recurrence problems: its LaTeX and its next term from the previous two and the index. */
interface Recurrence {
  readonly latex: string;
  readonly next: (prev: number, prev2: number, n: number) => number;
  readonly show: (prev: number, prev2: number, n: number) => string;
}

/** twoTermRecurrences are rules built from the two previous terms for constants p and q. */
function twoTermRecurrences(p: number, q: number): Recurrence[] {
  return [
    {
      latex: `a_{n} = ${poly([1, "a_{n-1}"], [p, "a_{n-2}"])}`,
      next: (x, y) => x + p * y,
      show: (x, y) => `${paren(x)} ${p < 0 ? "-" : "+"} ${Math.abs(p) === 1 ? "" : Math.abs(p)}${Math.abs(p) === 1 ? paren(y) : `(${y})`}`,
    },
    {
      latex: "a_{n} = a_{n-1} \\cdot a_{n-2}",
      next: (x, y) => x * y,
      show: (x, y) => `(${x})(${y})`,
    },
    {
      latex: `a_{n} = a_{n-1} - a_{n-2} ${q < 0 ? "-" : "+"} ${Math.abs(q)}`,
      next: (x, y) => x - y + q,
      show: (x, y) => `${paren(x)} - ${paren(y)} ${q < 0 ? "-" : "+"} ${Math.abs(q)}`,
    },
  ];
}

/** indexRecurrences are rules built from the previous term and the index n for a constant p. */
function indexRecurrences(p: number): Recurrence[] {
  return [
    { latex: `a_{n} = n \\cdot a_{n-1} - ${p}`, next: (x, _, n) => n * x - p, show: (x, _, n) => `${n}(${x}) - ${p}` },
    { latex: `a_{n} = a_{n-1} + n^{2}`, next: (x, _, n) => x + n * n, show: (x, _, n) => `${paren(x)} + ${n}^{2}` },
    { latex: `a_{n} = (a_{n-1})^{2} - ${p}`, next: (x) => x * x - p, show: (x) => `(${x})^{2} - ${p}` },
    { latex: `a_{n} = 2a_{n-1} - n`, next: (x, _, n) => 2 * x - n, show: (x, _, n) => `2(${x}) - ${n}` },
  ];
}

/** computingTermsFromNonstandardRecurrences computes terms of recurrences that are neither arithmetic nor geometric. */
export const computingTermsFromNonstandardRecurrences = topic(
  "computing-terms-from-nonstandard-recurrences",
  t("Computing Terms From Nonstandard Recurrences", "由非标准递推式计算项"),
  t(
    "Compute terms of a sequence defined by a rule that uses the two previous terms, or the previous term and its position, one term at a time.",
    "对用前两项、或用前一项及其位置定义的数列，逐项计算各项。",
  ),
  ["recursive-sequences"],
  ["HSF.IF.A.3"],
  [
    kp(
      "rules-using-two-previous-terms",
      t("Rules using two previous terms", "用前两项的递推式"),
      t(
        "A rule such as $a_{n} = a_{n-1} + 2a_{n-2}$ needs two starting terms. With $a_{1} = 1$ and $a_{2} = 3$: $a_{3} = 3 + 2(1) = 5$, $a_{4} = 5 + 2(3) = 11$, $a_{5} = 11 + 2(5) = 21$. Write each term down before computing the next, and keep track of which term is $a_{n-1}$ and which is $a_{n-2}$.",
        "像 $a_{n} = a_{n-1} + 2a_{n-2}$ 这样的规则需要两个初始项。设 $a_{1} = 1$，$a_{2} = 3$：$a_{3} = 3 + 2(1) = 5$，$a_{4} = 5 + 2(3) = 11$，$a_{5} = 11 + 2(5) = 21$。每算出一项就记下来再算下一项，并分清哪一项是 $a_{n-1}$、哪一项是 $a_{n-2}$。",
      ),
      (rng) => {
        const rule = rng.pick(twoTermRecurrences(rng.pick([-2, -1, 2, 3]), nonzero(rng, 4)));
        const [a1, a2] = rule.latex.includes("cdot") ? [rng.pick([-2, -1, 2]), rng.pick([-2, 2, 3])] : [rng.int(-4, 5), rng.int(-4, 5)];
        const target = rule.latex.includes("cdot") ? rng.int(4, 5) : rng.int(5, 6);
        const terms = [a1, a2];
        for (let n = 3; n <= target; n++) terms.push(rule.next(terms[n - 2]!, terms[n - 3]!, n));
        const answer = terms[target - 1]!;
        const swapped = [a1, a2];
        for (let n = 3; n <= target; n++) swapped.push(rule.next(swapped[n - 3]!, swapped[n - 2]!, n));
        const work = terms.slice(2).map((v, i) => `a_{${i + 3}} = ${rule.show(terms[i + 1]!, terms[i]!, i + 3)} = ${v}`);
        return numberProblem({
          prompt: t(
            `A sequence has $a_{1} = ${a1}$, $a_{2} = ${a2}$ and $${rule.latex}$ for $n \\ge 3$. What is $a_{${target}}$?`,
            `数列满足 $a_{1} = ${a1}$，$a_{2} = ${a2}$，且当 $n \\ge 3$ 时 $${rule.latex}$。$a_{${target}}$ 是多少？`,
          ),
          answer,
          wrong: [swapped[target - 1]!, terms[target - 2]!, rule.next(answer, terms[target - 2]!, target + 1)],
          solution: t(`Compute one term at a time:${steps(...work)}`, `逐项计算：${steps(...work)}`),
        });
      },
    ),
    kp(
      "rules-using-the-position",
      t("Rules using the position", "用项的位置的递推式"),
      t(
        "Some rules use the position $n$ as well as the previous term. For $a_{n} = n \\cdot a_{n-1} - 1$ with $a_{1} = 2$: $a_{2} = 2(2) - 1 = 3$, $a_{3} = 3(3) - 1 = 8$, $a_{4} = 4(8) - 1 = 31$. Use the position of the term being computed, not of the previous one.",
        "有些规则除了前一项还用到位置 $n$。对于 $a_{n} = n \\cdot a_{n-1} - 1$，$a_{1} = 2$：$a_{2} = 2(2) - 1 = 3$，$a_{3} = 3(3) - 1 = 8$，$a_{4} = 4(8) - 1 = 31$。要用正在计算的这一项的位置，而不是前一项的位置。",
      ),
      (rng) => {
        const rule = rng.pick(indexRecurrences(rng.int(1, 3)));
        const squares = rule.latex.includes("^{2} -");
        const a1 = squares ? rng.int(1, 3) : rng.int(-3, 5);
        const target = squares ? 3 : rng.int(4, 5);
        const terms = [a1];
        for (let n = 2; n <= target; n++) terms.push(rule.next(terms[n - 2]!, 0, n));
        const answer = terms[target - 1]!;
        // The slip of using the previous position n - 1.
        const shifted = [a1];
        for (let n = 2; n <= target; n++) shifted.push(rule.next(shifted[n - 2]!, 0, n - 1));
        const work = terms.slice(1).map((v, i) => `a_{${i + 2}} = ${rule.show(terms[i]!, 0, i + 2)} = ${v}`);
        return numberProblem({
          prompt: t(
            `A sequence has $a_{1} = ${a1}$ and $${rule.latex}$ for $n \\ge 2$. What is $a_{${target}}$?`,
            `数列满足 $a_{1} = ${a1}$，且当 $n \\ge 2$ 时 $${rule.latex}$。$a_{${target}}$ 是多少？`,
          ),
          answer,
          wrong: [shifted[target - 1]!, terms[target - 2]!, rule.next(answer, 0, target + 1)],
          solution: t(`Compute one term at a time:${steps(...work)}`, `逐项计算：${steps(...work)}`),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Eventual dominance

/** Growth is a function of the dominance problems: its LaTeX and the rank of its growth, higher growing faster. */
interface Growth {
  readonly latex: string;
  readonly rank: number;
}

/** power is a·x^k. */
const power = (a: number, k: number): Growth => ({ latex: poly([a, k === 1 ? "x" : `x^{${k}}`]), rank: k });

/** exponential is b^x / c, ranked above every power and by its base. */
const exponential = (b: number, c: number): Growth => ({
  latex: c === 1 ? `${b}^{x}` : `\\frac{${b}^{x}}{${c}}`,
  rank: 10 + b,
});

/** decidingWhichFunctionEventuallyExceedsTheOthers compares how fast powers and exponentials grow. */
export const decidingWhichFunctionEventuallyExceedsTheOthers = topic(
  "deciding-which-function-eventually-exceeds-the-others",
  t("Deciding Which Function Eventually Exceeds the Others", "判断哪个函数最终超过其他函数"),
  t(
    "Decide which of several functions is greatest for all large inputs, and find the first whole number at which an exponential function overtakes a power.",
    "判断几个函数中哪一个在输入足够大时最大，并求出指数函数第一次超过幂函数的整数。",
  ),
  ["quadratic-vs-exponential-models"],
  ["HSF.LE.A.3"],
  [
    kp(
      "the-eventual-winner",
      t("The eventual winner", "最终的胜者"),
      t(
        "For large $x$, growth type matters more than coefficients. An exponential $b^{x}$ with $b > 1$ eventually exceeds every power of $x$, however large its coefficient; among powers, the higher exponent wins, so $x^{3}$ eventually exceeds $1000x^{2}$ (once $x > 1000$); among exponentials, the larger base wins. A large coefficient only delays the crossing.",
        "当 $x$ 很大时，增长的类型比系数更重要。底数 $b > 1$ 的指数函数 $b^{x}$ 最终会超过任何 $x$ 的幂，不论幂的系数多大；幂函数之间，指数高的胜出，所以 $x^{3}$ 最终会超过 $1000x^{2}$（当 $x > 1000$ 时）；指数函数之间，底数大的胜出。大系数只会推迟交点出现的时间。",
      ),
      (rng) => {
        const coef = () => rng.pick([10, 50, 100, 500, 1000]);
        const ks = rng.sample([1, 2, 3, 4], 3).sort((x, y) => x - y);
        const fns: Growth[] = [power(coef(), ks[0]!), power(coef(), ks[1]!)];
        if (rng.bool(0.6)) {
          const [b1, b2] = rng.sample([2, 3, 5], 2).sort((x, y) => x - y) as [number, number];
          fns.push(exponential(b1, rng.pick([1, 100, 1000])));
          fns.push(rng.bool() ? exponential(b2, rng.pick([1000, 10000])) : power(coef(), ks[2]!));
        } else {
          fns.push(power(coef(), ks[2]!), power(rng.pick([1, 2]), ks[2]! + 1));
        }
        const named = rng.shuffle(fns).map((g, i) => ({ ...g, name: ["f", "g", "h", "k"][i]! }));
        const best = named.reduce((a, b) => (b.rank > a.rank ? b : a));
        const label = (g: (typeof named)[number]): Text => t(`$${g.name}(x) = ${g.latex}$`, `$${g.name}(x) = ${g.latex}$`);
        const list = named.map((g) => `$${g.name}(x) = ${g.latex}$`);
        return pickChoice(
          rng,
          t(
            `Which of these functions is greater than the other three for all sufficiently large values of $x$? ${list.join(", ")}`,
            `当 $x$ 足够大时，下列哪个函数的值大于其他三个？${list.join("，")}`,
          ),
          label(best),
          named.filter((g) => g !== best).map(label),
          t(
            best.rank > 10
              ? `An exponential with base greater than $1$ eventually exceeds every power of $x$${named.filter((g) => g.rank > 10).length > 1 ? ", and of two exponentials the one with the larger base wins" : ""}. So $${best.name}(x) = ${best.latex}$ is eventually the greatest, whatever the coefficients.`
              : `There is no exponential, so the highest power of $x$ wins, whatever the coefficients: $${best.name}(x) = ${best.latex}$ is eventually the greatest.`,
            best.rank > 10
              ? `底数大于 $1$ 的指数函数最终会超过任何 $x$ 的幂${named.filter((g) => g.rank > 10).length > 1 ? "，两个指数函数中底数大的胜出" : ""}。所以不论系数如何，$${best.name}(x) = ${best.latex}$ 最终最大。`
              : `这里没有指数函数，所以不论系数如何，$x$ 的最高次幂胜出：$${best.name}(x) = ${best.latex}$ 最终最大。`,
          ),
        );
      },
    ),
    kp(
      "where-an-exponential-overtakes",
      t("Where an exponential overtakes", "指数函数在何处反超"),
      t(
        "To find the first whole number $n$ where $2^{n} > 10n$, make a table: $2^{5} = 32 < 50$, $2^{6} = 64 > 60$, and from there on the exponential stays ahead. So the first such $n$ is $6$. At small inputs the power may be ahead; the exponential only overtakes later.",
        "要求使 $2^{n} > 10n$ 的第一个正整数 $n$，可以列表：$2^{5} = 32 < 50$，$2^{6} = 64 > 60$，此后指数函数一直领先。所以第一个这样的 $n$ 是 $6$。在输入较小时幂函数可能领先，指数函数要稍后才反超。",
      ),
      (rng) => {
        const b = rng.pick([2, 3]);
        const k = rng.pick([1, 2]);
        const c =
          k === 1
            ? rng.pick(b === 2 ? [3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 30] : [5, 10, 15, 20, 30, 50, 100])
            : rng.pick(b === 2 ? [1, 2, 3, 4, 5, 8, 10] : [3, 5, 10, 20, 50, 100]);
        const g = (n: number) => c * n ** k;
        // For these constants b^n ≤ g(n) at n = 2, and b^n / g(n) increases from n = 3 on, so the first crossing is final.
        let n = 2;
        while (b ** n <= g(n)) n++;
        const powLatex = poly([c, k === 1 ? "n" : "n^{2}"]);
        return numberProblem({
          prompt: t(
            `What is the smallest whole number $n \\ge 2$ for which $${b}^{n} > ${powLatex}$?`,
            `使 $${b}^{n} > ${powLatex}$ 成立的最小整数 $n \\ge 2$ 是多少？`,
          ),
          answer: n,
          wrong: [n - 1, n + 1, Math.ceil(Math.log(c) / Math.log(b))],
          solution: t(
            `Compare the two sides for whole numbers near the crossing:${steps(`${b}^{${n - 1}} = ${b ** (n - 1)} \\le ${g(n - 1)}`, `${b}^{${n}} = ${b ** n} > ${g(n)}`)}From $n = ${n}$ on, the exponential stays ahead, so the answer is $${n}$.`,
            `比较交点附近的整数处两边的值：${steps(`${b}^{${n - 1}} = ${b ** (n - 1)} \\le ${g(n - 1)}`, `${b}^{${n}} = ${b ** n} > ${g(n)}`)}从 $n = ${n}$ 起指数函数一直领先，所以答案是 $${n}$。`,
          ),
        });
      },
    ),
  ],
);

/** actFundamentalsFunctionTopics are the ACT Math Fundamentals function topics. */
export const actFundamentalsFunctionTopics: TopicDef[] = [
  solvingExponentialEquationsWithAQuadraticExponent,
  reasoningWithNestedFunctionComposition,
  computingTermsFromNonstandardRecurrences,
  decidingWhichFunctionEventuallyExceedsTheOthers,
];
