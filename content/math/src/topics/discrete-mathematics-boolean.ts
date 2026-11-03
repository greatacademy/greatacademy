import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem, yesNo } from "../problems.ts";
import { oneOf } from "./calculus-common.ts";
import { range } from "./methods-of-proof-common.ts";

// Discrete Mathematics unit 1: Boolean algebra.

/** BExpr is a Boolean expression in the variables x, y, z, w (indices 0–3). */
export type BExpr =
  | { readonly k: "var"; readonly i: number }
  | { readonly k: "const"; readonly v: 0 | 1 }
  | { readonly k: "not"; readonly a: BExpr }
  | { readonly k: BinOp; readonly a: BExpr; readonly b: BExpr };

/** BinOp is a binary Boolean operation. */
export type BinOp = "and" | "or" | "xor" | "nand" | "nor" | "imp" | "iff";

/** VARS are the names of the Boolean variables. */
export const VARS = ["x", "y", "z", "w"] as const;

/** bv builds a variable. */
export const bv = (i: number): BExpr => ({ k: "var", i });
/** bc builds a constant. */
export const bc = (v: 0 | 1): BExpr => ({ k: "const", v });
/** bnot builds a negation. */
export const bnot = (a: BExpr): BExpr => ({ k: "not", a });
/** bin builds a binary operation. */
export const bin = (k: BinOp, a: BExpr, b: BExpr): BExpr => ({ k, a, b });
/** band builds a conjunction of one or more operands. */
export const band = (...xs: readonly BExpr[]): BExpr => xs.reduce((a, b) => bin("and", a, b));
/** bor builds a disjunction of one or more operands. */
export const bor = (...xs: readonly BExpr[]): BExpr => xs.reduce((a, b) => bin("or", a, b));
/** bxor builds an exclusive disjunction of one or more operands. */
export const bxor = (...xs: readonly BExpr[]): BExpr => xs.reduce((a, b) => bin("xor", a, b));

/** opTex are the LaTeX symbols of the binary operations. */
const opTex: Record<BinOp, string> = {
  and: "\\wedge",
  or: "\\vee",
  xor: "\\oplus",
  nand: "\\uparrow",
  nor: "\\downarrow",
  imp: "\\Rightarrow",
  iff: "\\Leftrightarrow",
};

/** btex writes an expression, leaving chains of one associative operation unparenthesized. */
export function btex(e: BExpr): string {
  if (e.k === "var") return VARS[e.i]!;
  if (e.k === "const") return `${e.v}`;
  if (e.k === "not") return e.a.k === "var" || e.a.k === "const" || e.a.k === "not" ? `\\neg ${btex(e.a)}` : `\\neg (${btex(e.a)})`;
  const assoc = e.k === "and" || e.k === "or" || e.k === "xor";
  const side = (g: BExpr) => (g.k === "var" || g.k === "const" || g.k === "not" || (assoc && g.k === e.k) ? btex(g) : `(${btex(g)})`);
  return `${side(e.a)} ${opTex[e.k]} ${side(e.b)}`;
}

/** bmath wraps an expression as an option. */
export const bmath = (e: BExpr): Text => t(`$${btex(e)}$`, `$${btex(e)}$`);

/** bits lists the bits of row r for n variables, the first variable most significant. */
export const bits = (r: number, n: number) => range(0, n - 1).map((i) => (r >> (n - 1 - i)) & 1);

/** beval evaluates an expression at an assignment of bits. */
export function beval(e: BExpr, x: readonly number[]): number {
  switch (e.k) {
    case "var":
      return x[e.i]!;
    case "const":
      return e.v;
    case "not":
      return 1 - beval(e.a, x);
  }
  const a = beval(e.a, x);
  const b = beval(e.b, x);
  switch (e.k) {
    case "and":
      return a & b;
    case "or":
      return a | b;
    case "xor":
      return a ^ b;
    case "nand":
      return 1 - (a & b);
    case "nor":
      return 1 - (a | b);
    case "imp":
      return (1 - a) | b;
    case "iff":
      return 1 - (a ^ b);
  }
}

/** vecOf is the value vector of an expression in n variables, listed from 00…0 to 11…1. */
export const vecOf = (e: BExpr, n: number) => range(0, 2 ** n - 1).map((r) => beval(e, bits(r, n)));

/** sameVec compares value vectors. */
const sameVec = (a: readonly number[], b: readonly number[]) => a.every((x, i) => x === b[i]);

/** vecTex writes a value vector in groups of four. */
export const vecTex = (vec: readonly number[]) =>
  range(0, Math.ceil(vec.length / 4) - 1)
    .map((g) => vec.slice(4 * g, 4 * g + 4).join(""))
    .join("\\,");

/** pointTex writes an input as a tuple. */
export const pointTex = (x: readonly number[]) => `(${x.join(", ")})`;

/** argsTex writes the argument list of an n-variable function: "x, y, z". */
const argsTex = (n: number) => VARS.slice(0, n).join(", ");

/** randomB builds a random expression over n variables with the given operations. */
export function randomB(rng: Rng, n: number, depth: number, ops: readonly BinOp[]): BExpr {
  if (depth === 0 || rng.bool(0.2)) {
    const leaf = bv(rng.int(0, n - 1));
    return rng.bool(0.3) ? bnot(leaf) : leaf;
  }
  if (rng.bool(0.15)) return bnot(randomB(rng, n, depth - 1, ops));
  // Literal operands on one variable, such as x ∧ y ∧ x or x ⊕ ¬x, make silly expressions.
  const v = (e: BExpr) => (e.k === "var" ? e.i : e.k === "not" && e.a.k === "var" ? e.a.i : -1);
  const operands = (e: BExpr, k: BinOp): BExpr[] => (e.k === k ? [...operands(e.a, k), ...operands(e.b, k)] : [e]);
  for (;;) {
    const e = bin(rng.pick(ops), randomB(rng, n, depth - 1, ops), randomB(rng, n, depth - 1, ops));
    const vs = operands(e, e.k as BinOp)
      .map(v)
      .filter((i) => i >= 0);
    if (new Set(vs).size === vs.length) return e;
  }
}

/** usesAll checks that an expression depends on each of the first n variables. */
function usesAll(e: BExpr, n: number): boolean {
  const vec = vecOf(e, n);
  return range(0, n - 1).every((i) => vec.some((v, r) => v !== vec[r ^ (1 << (n - 1 - i))]));
}

/** formula3 builds a random expression that depends on each of x, y and z. */
function formula3(rng: Rng, ops: readonly BinOp[], depth = 2): BExpr {
  for (;;) {
    const e = randomB(rng, 3, depth, ops);
    const vec = vecOf(e, 3);
    if (usesAll(e, 3) && vec.includes(0) && vec.includes(1)) return e;
  }
}

/** steps lists the value of each compound sub-expression, innermost first. */
function steps(e: BExpr, x: readonly number[]): string {
  const out: string[] = [];
  const walk = (g: BExpr): void => {
    if (g.k === "var" || g.k === "const") return;
    if (g.k === "not") walk(g.a);
    else {
      walk(g.a);
      walk(g.b);
    }
    out.push(`${btex(g)} = ${beval(g, x)}`);
  };
  walk(e);
  return out.map((s) => `$${s}$`).join(", ");
}

/** lit builds the literal of variable i that is true when the variable equals bit. */
const lit = (i: number, bit: number) => (bit ? bv(i) : bnot(bv(i)));

/** minterm builds the conjunction that is true only at row x. */
const minterm = (x: readonly number[]) => band(...x.map((b, i) => lit(i, b)));

/** maxterm builds the disjunction that is false only at row x. */
const maxterm = (x: readonly number[]) => bor(...x.map((b, i) => lit(i, 1 - b)));

/** Cube is a product term: per variable 1 (positive), 0 (negated) or −1 (absent). */
type Cube = readonly number[];

/** cubeHas tests whether a row lies in a cube. */
const cubeHas = (c: Cube, x: readonly number[]) => c.every((b, i) => b < 0 || b === x[i]);

/** cubeExpr writes a cube as a conjunction of literals, or 1 when it is empty. */
const cubeExpr = (c: Cube): BExpr => {
  const lits = c.flatMap((b, i) => (b < 0 ? [] : [lit(i, b)]));
  return lits.length === 0 ? bc(1) : band(...lits);
};

/** cubesExpr writes a cover of cubes as a DNF. */
const cubesExpr = (cs: readonly Cube[]): BExpr => (cs.length === 0 ? bc(0) : bor(...cs.map(cubeExpr)));

/** allCubes lists every cube in n variables. */
const allCubes = (n: number): Cube[] =>
  range(0, 3 ** n - 1).map((m) => range(0, n - 1).map((i) => (Math.floor(m / 3 ** (n - 1 - i)) % 3) - 1));

/** minimalDnf finds a DNF of the function with the fewest terms, then the fewest literals. */
export function minimalDnf(vec: readonly number[], n: number): Cube[] {
  const rows = range(0, 2 ** n - 1).map((r) => bits(r, n));
  const implicants = allCubes(n).filter((c) => rows.every((x, r) => !cubeHas(c, x) || vec[r] === 1));
  const primes = implicants.filter(
    (c) => !implicants.some((d) => d !== c && d.every((b, i) => b < 0 || b === c[i]) && d.some((b, i) => b !== c[i])),
  );
  const ones = rows.filter((_, r) => vec[r] === 1);
  let best: Cube[] | undefined;
  const size = (cs: readonly Cube[]) => cs.length * 100 + cs.reduce((s, c) => s + c.filter((b) => b >= 0).length, 0);
  for (let mask = 1; mask < 2 ** primes.length; mask++) {
    const cs = primes.filter((_, i) => (mask >> i) & 1);
    if (best && size(cs) >= size(best)) continue;
    if (ones.every((x) => cs.some((c) => cubeHas(c, x)))) best = cs;
  }
  return best ?? [];
}

/** literalCount counts the literals of a cover. */
const literalCount = (cs: readonly Cube[]) => cs.reduce((s, c) => s + c.filter((b) => b >= 0).length, 0);

/** anf computes the coefficients of the Boolean (Zhegalkin) polynomial, indexed like the value vector. */
export function anf(vec: readonly number[], n: number): number[] {
  const a = [...vec];
  for (let i = 0; i < n; i++) for (let m = 0; m < 2 ** n; m++) if ((m >> i) & 1) a[m] = a[m]! ^ a[m ^ (1 << i)]!;
  return a;
}

/** monomialTex writes the monomial of row mask m: "xz", or 1 for the empty monomial. */
const monomialTex = (m: number, n: number) => {
  const vs = bits(m, n).flatMap((b, i) => (b ? [VARS[i]!] : []));
  return vs.length === 0 ? "1" : vs.join("");
};

/** degree counts the variables of a monomial. */
const degree = (m: number) =>
  m
    .toString(2)
    .split("")
    .filter((c) => c === "1").length;

/** anfTex writes a Boolean polynomial from its coefficients, by increasing degree. */
export function anfTex(coeffs: readonly number[], n: number): string {
  const ms = range(0, coeffs.length - 1)
    .filter((m) => coeffs[m] === 1)
    .sort((a, b) => degree(a) - degree(b) || b - a);
  return ms.length === 0 ? "0" : ms.map((m) => monomialTex(m, n)).join(" \\oplus ");
}

/** PostClass names the five Post classes. */
type PostClass = "T0" | "T1" | "S" | "M" | "L";

/** inClass tests membership of a value vector in a Post class. */
export function inClass(cls: PostClass, vec: readonly number[], n: number): boolean {
  const N = vec.length;
  switch (cls) {
    case "T0":
      return vec[0] === 0;
    case "T1":
      return vec[N - 1] === 1;
    case "S":
      return vec.every((v, r) => v !== vec[N - 1 - r]);
    case "M":
      return range(0, N - 1).every((r) => range(0, N - 1).every((s) => (r & s) !== r || vec[r]! <= vec[s]!));
    case "L":
      return anf(vec, n).every((c, m) => c === 0 || degree(m) <= 1);
  }
}

/** POST are the five Post classes. */
const POST: readonly PostClass[] = ["T0", "T1", "S", "M", "L"];

/** classTex writes the LaTeX name of a Post class. */
const classTex: Record<PostClass, string> = { T0: "T_0", T1: "T_1", S: "S", M: "M", L: "L" };

/** classText names a Post class in words. */
const classText: Record<PostClass, Text> = {
  T0: t("preserves 0", "保 0"),
  T1: t("preserves 1", "保 1"),
  S: t("self-dual", "自对偶"),
  M: t("monotonic", "单调"),
  L: t("affine", "仿射"),
};

/** choose computes a binomial coefficient. */
const choose = (n: number, k: number): number => (k < 0 || k > n ? 0 : k === 0 ? 1 : (choose(n - 1, k - 1) * n) / k);

/** fTex writes "f(x, y, z) = expr". */
const fTex = (e: BExpr, n: number) => `f(${argsTex(n)}) = ${btex(e)}`;

/** booleanFunctions introduces functions from {0, 1}ⁿ to {0, 1}. */
export const booleanFunctions: TopicDef = {
  id: "boolean-functions",
  title: t("Boolean Functions", "布尔函数"),
  summary: t(
    "A Boolean function of $n$ variables maps each of the $2^n$ inputs in $\\{0, 1\\}^n$ to $0$ or $1$; it is given by a truth table or a value vector, and there are $2^{2^n}$ of them.",
    "$n$ 元布尔函数把 $\\{0, 1\\}^n$ 中的 $2^n$ 个输入各映射到 $0$ 或 $1$；它可以用真值表或值向量给出，共有 $2^{2^n}$ 个。",
  ),
  prerequisites: ["truth-tables"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-boolean-functions",
      title: t("Counting Boolean functions", "统计布尔函数"),
      explanation: t(
        "A function of $n$ variables has $2^n$ inputs, and each input independently gets $0$ or $1$: there are $2^{2^n}$ functions. With $n = 2$ there are $2^4 = 16$. If $k$ of the values are fixed, $2^{2^n - k}$ remain; the number taking the value $1$ at exactly $m$ inputs is $\\binom{2^n}{m}$.",
        "$n$ 元函数有 $2^n$ 个输入，每个输入独立地取 $0$ 或 $1$：共有 $2^{2^n}$ 个函数。$n = 2$ 时有 $2^4 = 16$ 个。若固定其中 $k$ 个值，还剩 $2^{2^n - k}$ 个；恰在 $m$ 个输入处取值 $1$ 的函数有 $\\binom{2^n}{m}$ 个。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const n = rng.int(1, 4);
          const k = rng.int(0, Math.min(3, 2 ** n - 1));
          const value = 2 ** (2 ** n - k);
          const fixed =
            k === 0
              ? t("", "")
              : t(
                  ` with ${k === 1 ? "the value at $(0, \\dots, 0)$" : `the values at $${k}$ given inputs`} already fixed`,
                  `（其中${k === 1 ? "在 $(0, \\dots, 0)$ 处的值" : `在 $${k}$ 个给定输入处的值`}已经确定）`,
                );
          return numberProblem({
            prompt: t(
              `How many Boolean functions of $${n}$ variable${n === 1 ? "" : "s"} are there${fixed.en}?`,
              `$${n}$ 元布尔函数${fixed["zh-CN"]}共有多少个？`,
            ),
            answer: value,
            wrong: [2 ** n, 2 ** (2 ** n), 2 ** (n - k + 1), value / 2],
            solution: t(
              `There are $2^{${n}} = ${2 ** n}$ inputs, of which $${2 ** n - k}$ are free, each taking $0$ or $1$: $2^{${2 ** n - k}} = ${value}$.`,
              `共有 $2^{${n}} = ${2 ** n}$ 个输入，其中 $${2 ** n - k}$ 个可以自由取 $0$ 或 $1$：$2^{${2 ** n - k}} = ${value}$。`,
            ),
          });
        }
        const n = rng.int(2, 3);
        const m = rng.int(0, 2 ** n);
        const value = choose(2 ** n, m);
        return numberProblem({
          prompt: t(
            `How many Boolean functions of $${n}$ variables take the value $1$ at exactly $${m}$ input${m === 1 ? "" : "s"}?`,
            `有多少个 $${n}$ 元布尔函数恰在 $${m}$ 个输入处取值 $1$？`,
          ),
          answer: value,
          wrong: [2 ** m, choose(n, m) || 1, 2 ** (2 ** n - m), value + 1],
          solution: t(
            `Choose which $${m}$ of the $${2 ** n}$ inputs give $1$: $\\binom{${2 ** n}}{${m}} = ${value}$.`,
            `从 $${2 ** n}$ 个输入中选出取 $1$ 的 $${m}$ 个：$\\binom{${2 ** n}}{${m}} = ${value}$。`,
          ),
        });
      },
    },
    {
      id: "reading-a-value-vector",
      title: t("Value vectors", "值向量"),
      explanation: t(
        "The value vector lists $f(0, 0, 0), f(0, 0, 1), f(0, 1, 0), \\dots, f(1, 1, 1)$, the inputs in binary counting order. For the vector $0110\\,1001$, the input $(1, 0, 1)$ is $101_2 = 5$, position $5$ counting from $0$, so $f(1, 0, 1) = 0$.",
        "值向量依次列出 $f(0, 0, 0), f(0, 0, 1), f(0, 1, 0), \\dots, f(1, 1, 1)$，即按二进制计数顺序排列的输入。对值向量 $0110\\,1001$，输入 $(1, 0, 1)$ 是 $101_2 = 5$，从 $0$ 开始数的第 $5$ 位，所以 $f(1, 0, 1) = 0$。",
      ),
      generate(rng) {
        const n = rng.int(2, 3);
        const vec = range(1, 2 ** n).map(() => rng.int(0, 1));
        const r = rng.int(0, 2 ** n - 1);
        const x = bits(r, n);
        const value = vec[r]!;
        return numberProblem({
          prompt: t(
            `The Boolean function $f(${argsTex(n)})$ has value vector $${vecTex(vec)}$, listing $f$ at the inputs from $${pointTex(bits(0, n))}$ to $${pointTex(bits(2 ** n - 1, n))}$ in binary order. Find $f${pointTex(x)}$.`,
            `布尔函数 $f(${argsTex(n)})$ 的值向量为 $${vecTex(vec)}$，按二进制顺序列出 $f$ 在 $${pointTex(bits(0, n))}$ 到 $${pointTex(bits(2 ** n - 1, n))}$ 处的值。求 $f${pointTex(x)}$。`,
          ),
          answer: value,
          wrong: [1 - value],
          solution: t(
            `$${x.join("")}_2 = ${r}$, so read entry $${r}$ (counting from $0$): $f${pointTex(x)} = ${value}$.`,
            `$${x.join("")}_2 = ${r}$，所以读取第 $${r}$ 位（从 $0$ 开始数）：$f${pointTex(x)} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** pairOf maps the variables of a two-variable template to a chosen pair. */
const pairOf = (e: BExpr, p: readonly [number, number]): BExpr => {
  if (e.k === "var") return bv(p[e.i]!);
  if (e.k === "const") return e;
  if (e.k === "not") return bnot(pairOf(e.a, p));
  return bin(e.k, pairOf(e.a, p), pairOf(e.b, p));
};

/** X and Y are the template variables. */
const X = bv(0);
const Y = bv(1);

/** opPool are two-variable expressions in ∧, ∨ and ¬ used as answers about ⊕, ↑ and ↓. */
const opPool: readonly BExpr[] = [
  bnot(band(X, Y)),
  bor(bnot(X), bnot(Y)),
  bnot(bor(X, Y)),
  band(bnot(X), bnot(Y)),
  bor(band(X, bnot(Y)), band(bnot(X), Y)),
  band(bor(X, Y), bnot(band(X, Y))),
  bor(band(X, Y), band(bnot(X), bnot(Y))),
  band(X, Y),
  bor(X, Y),
  bnot(X),
  bnot(Y),
  bor(bnot(X), Y),
  band(X, bnot(Y)),
  X,
  bc(0),
  bc(1),
];

/** opTargets are expressions in ⊕, ↑ and ↓ to rewrite. */
const opTargets: readonly BExpr[] = [
  bin("nand", X, Y),
  bin("nor", X, Y),
  bin("xor", X, Y),
  bin("nand", X, X),
  bin("nor", X, X),
  bin("nand", bin("nand", X, Y), bin("nand", X, Y)),
  bin("nor", bin("nor", X, Y), bin("nor", X, Y)),
  bin("nand", bin("nand", X, X), bin("nand", Y, Y)),
  bin("nor", bin("nor", X, X), bin("nor", Y, Y)),
  bnot(bin("xor", X, Y)),
  bin("xor", X, bc(1)),
  bin("xor", X, X),
  bin("nand", X, bnot(X)),
];

/** PAIRS are ordered variable pairs for templates. */
const PAIRS: readonly (readonly [number, number])[] = [
  [0, 1],
  [1, 2],
  [0, 2],
  [1, 0],
];

/** booleanFunctionsAndLogicalOperations adds XOR, NAND and NOR. */
export const booleanFunctionsAndLogicalOperations: TopicDef = {
  id: "boolean-functions-and-logical-operations",
  title: t("Boolean Functions and Logical Operations", "布尔函数与逻辑运算"),
  summary: t(
    "Besides ∧, ∨ and ¬: exclusive or x ⊕ y (1 when exactly one is 1), the Sheffer stroke x ↑ y = ¬(x ∧ y) (NAND) and the Peirce arrow x ↓ y = ¬(x ∨ y) (NOR).",
    "除 ∧、∨、¬ 外还有：异或 x ⊕ y（恰有一个为 1 时取 1）、谢弗竖线 x ↑ y = ¬(x ∧ y)（与非）和皮尔斯箭头 x ↓ y = ¬(x ∨ y)（或非）。",
  ),
  prerequisites: ["boolean-functions", "logical-equivalence"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-xor-nand-and-nor",
      title: t("Evaluating ⊕, ↑ and ↓", "计算 ⊕、↑ 与 ↓"),
      explanation: t(
        "Exclusive or detects a difference between the inputs, while nand and nor are the negations of and and or, and each can be read from a short truth table. $1 \\oplus 1 = 0$, $1 \\uparrow 1 = 0$ and $0 \\downarrow 0 = 1$; otherwise $\\oplus$ gives $1$ exactly when the inputs differ, $\\uparrow$ gives $1$, and $\\downarrow$ gives $0$. With $x = 1, y = 0, z = 1$: $(x \\uparrow y) \\oplus z = 1 \\oplus 1 = 0$.",
        "异或用来检测两个输入是否不同，而与非和或非是“与”和“或”的否定，每一个都可以从简短的真值表中读出。$1 \\oplus 1 = 0$，$1 \\uparrow 1 = 0$，$0 \\downarrow 0 = 1$；其余情况下，$\\oplus$ 在输入不同时取 $1$，$\\uparrow$ 取 $1$，$\\downarrow$ 取 $0$。取 $x = 1, y = 0, z = 1$：$(x \\uparrow y) \\oplus z = 1 \\oplus 1 = 0$。",
      ),
      generate(rng) {
        let e: BExpr;
        do e = formula3(rng, ["xor", "nand", "nor", "and", "or"]);
        while (!/oplus|uparrow|downarrow/.test(btex(e)));
        const x = bits(rng.int(0, 7), 3);
        const value = beval(e, x);
        return numberProblem({
          prompt: t(
            `Evaluate $${btex(e)}$ at $x = ${x[0]}$, $y = ${x[1]}$, $z = ${x[2]}$.`,
            `求 $${btex(e)}$ 在 $x = ${x[0]}$，$y = ${x[1]}$，$z = ${x[2]}$ 时的值。`,
          ),
          answer: value,
          wrong: [1 - value],
          solution: t(`Work from the inside out: ${steps(e, x)}.`, `由内向外计算：${steps(e, x)}。`),
        });
      },
    },
    {
      id: "rewriting-xor-nand-and-nor",
      title: t("Rewriting with ∧, ∨ and ¬", "用 ∧、∨、¬ 改写"),
      explanation: t(
        "De Morgan's laws turn a negated and into an or of negations and a negated or into an and of negations, which rewrites these gates with the basic connectives. $x \\uparrow y = \\neg (x \\wedge y) = \\neg x \\vee \\neg y$, $x \\downarrow y = \\neg x \\wedge \\neg y$, $x \\oplus y = (x \\wedge \\neg y) \\vee (\\neg x \\wedge y)$, and $x \\uparrow x = \\neg x$. Compare truth tables to check any rewriting.",
        "德摩根律把否定的“与”变成否定的“或”，把否定的“或”变成否定的“与”，从而用基本联结词改写这些门。$x \\uparrow y = \\neg (x \\wedge y) = \\neg x \\vee \\neg y$，$x \\downarrow y = \\neg x \\wedge \\neg y$，$x \\oplus y = (x \\wedge \\neg y) \\vee (\\neg x \\wedge y)$，$x \\uparrow x = \\neg x$。比较真值表即可检验任何改写。",
      ),
      generate(rng) {
        const pair = rng.pick(PAIRS);
        const target = pairOf(rng.pick(opTargets), pair);
        const vec = vecOf(target, 3);
        const pool = opPool.map((e) => pairOf(e, pair));
        const rights = pool.filter((e) => sameVec(vecOf(e, 3), vec));
        const right = rng.pick(rights);
        const wrong = rng.shuffle(pool.filter((e) => !sameVec(vecOf(e, 3), vec))).slice(0, 3);
        return oneOf(
          rng,
          t(`Which expression is equivalent to $${btex(target)}$?`, `哪个表达式与 $${btex(target)}$ 等价？`),
          bmath(right),
          wrong.map(bmath),
          t(
            `Both sides have the same truth table, so $${btex(target)} \\equiv ${btex(right)}$.`,
            `两边真值表相同，所以 $${btex(target)} \\equiv ${btex(right)}$。`,
          ),
        );
      },
    },
  ],
};

/** randomLit picks a literal of variable i. */
const randomLit = (rng: Rng, i: number) => (rng.bool() ? bv(i) : bnot(bv(i)));

/** randomTerm builds a conjunction (or disjunction) of 1–3 literals over distinct variables. */
function randomTerm(rng: Rng, n: number, op: "and" | "or", min = 1): BExpr {
  const vs = rng.shuffle(range(0, n - 1)).slice(0, rng.int(min, Math.min(3, n)));
  const lits = vs.sort().map((i) => randomLit(rng, i));
  return op === "and" ? band(...lits) : bor(...lits);
}

/** normalFormChoice asks whether an expression is in DNF (outer "or") or CNF (outer "and"). */
function normalFormChoice(rng: Rng, outer: "or" | "and"): ReturnType<typeof oneOf> {
  const inner = outer === "or" ? "and" : "or";
  const n = rng.int(3, 4);
  const term = (min = 1) => randomTerm(rng, n, inner, min);
  const kind = rng.bool() ? 0 : rng.int(1, 3);
  const e = [
    () => bin(outer, bin(outer, term(2), term()), term()),
    () => bin(inner, randomTerm(rng, n, outer, 2), randomTerm(rng, n, outer, 2)),
    () => bin(outer, bnot(randomTerm(rng, n, inner, 2)), term()),
    () => bin(inner, randomLit(rng, 0), bin(outer, randomLit(rng, 1), randomTerm(rng, n, inner, 2))),
  ][kind]!();
  const name = outer === "or" ? t("disjunctive normal form", "析取范式") : t("conjunctive normal form", "合取范式");
  const [o, i] = outer === "or" ? ["\\vee", "\\wedge"] : ["\\wedge", "\\vee"];
  const why = [
    outer === "or"
      ? t("Yes: it is a disjunction of conjunctions of literals.", "是：它是若干文字合取式的析取。")
      : t("Yes: it is a conjunction of disjunctions of literals.", "是：它是若干文字析取式的合取。"),
    t(`No: $${i}$ is applied to expressions containing $${o}$.`, `不是：$${i}$ 作用在含 $${o}$ 的表达式上。`),
    t("No: $\\neg$ is applied to a compound expression, not a variable.", "不是：$\\neg$ 作用在复合表达式上，而不是变量上。"),
    t(`No: $${i}$ is applied to an expression containing $${o}$.`, `不是：$${i}$ 作用在含 $${o}$ 的表达式上。`),
  ][kind]!;
  return oneOf(
    rng,
    t(`Is $${btex(e)}$ in ${name.en}?`, `$${btex(e)}$ 是${name["zh-CN"]}吗？`),
    yesNo[kind === 0 ? 0 : 1]!,
    [yesNo[kind === 0 ? 1 : 0]!],
    why,
  );
}

/** negLit negates a literal without double negation. */
const negLit = (e: BExpr): BExpr => (e.k === "not" ? e.a : bnot(e));

/** distributeChoice asks for the DNF (outer "or") or CNF (outer "and") of a product of sums or sum of products. */
function distributeChoice(rng: Rng, outer: "or" | "and"): ReturnType<typeof oneOf> {
  const inner = outer === "or" ? "and" : "or";
  const [a, b, c, d] = range(0, 3).map((i) => randomLit(rng, i)) as [BExpr, BExpr, BExpr, BExpr];
  const negated = rng.bool();
  // (a ∨ b) ∧ (c ∨ d) for DNF, (a ∧ b) ∨ (c ∧ d) for CNF, or the same written as a negation.
  const source = negated
    ? bnot(bin(outer, bin(inner, negLit(a), negLit(b)), bin(inner, negLit(c), negLit(d))))
    : bin(inner, bin(outer, a, b), bin(outer, c, d));
  const exact = bin(outer, bin(outer, bin(outer, bin(inner, a, c), bin(inner, a, d)), bin(inner, b, c)), bin(inner, b, d));
  const vec = vecOf(source, 4);
  const wrongs = [
    bin(outer, bin(inner, a, b), bin(inner, c, d)),
    bin(outer, bin(inner, a, c), bin(inner, b, d)),
    bin(outer, bin(outer, bin(inner, a, c), bin(inner, a, d)), bin(inner, b, c)),
    bin(outer, bin(inner, negLit(a), c), bin(inner, b, negLit(d))),
  ].filter((w) => !sameVec(vecOf(w, 4), vec));
  const name = outer === "or" ? t("disjunctive normal form", "析取范式") : t("conjunctive normal form", "合取范式");
  return oneOf(
    rng,
    t(`Which ${name.en} is equivalent to $${btex(source)}$?`, `哪个${name["zh-CN"]}与 $${btex(source)}$ 等价？`),
    bmath(exact),
    wrongs.map(bmath),
    t(
      `${negated ? "Apply De Morgan's laws, then distribute" : "Distribute"} ${outer === "or" ? "$\\wedge$ over $\\vee$" : "$\\vee$ over $\\wedge$"}: $${btex(exact)}$.`,
      `${negated ? "先用德摩根律，再" : ""}把 ${outer === "or" ? "$\\wedge$ 对 $\\vee$" : "$\\vee$ 对 $\\wedge$"} 展开：$${btex(exact)}$。`,
    ),
  );
}

/** disjunctiveNormalForms writes functions as disjunctions of conjunctions of literals. */
export const disjunctiveNormalForms: TopicDef = {
  id: "disjunctive-normal-forms",
  title: t("Disjunctive Normal Forms", "析取范式"),
  summary: t(
    "A disjunctive normal form (DNF) is a disjunction of conjunctions of literals; De Morgan's laws and distribution of ∧ over ∨ turn any expression into one.",
    "析取范式（DNF）是若干文字合取式的析取；利用德摩根律和 ∧ 对 ∨ 的分配律，任何表达式都能化成析取范式。",
  ),
  prerequisites: ["boolean-functions-and-logical-operations", "de-morgans-laws-for-logic"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-disjunctive-normal-forms",
      title: t("Recognizing DNF", "识别析取范式"),
      explanation: t(
        "$(x \\wedge \\neg y) \\vee z \\vee (\\neg x \\wedge y \\wedge z)$ is in DNF. $(x \\vee y) \\wedge z$ is not ($\\wedge$ over $\\vee$), and neither is $\\neg (x \\wedge y) \\vee z$ ($\\neg$ over a conjunction).",
        "$(x \\wedge \\neg y) \\vee z \\vee (\\neg x \\wedge y \\wedge z)$ 是析取范式。$(x \\vee y) \\wedge z$ 不是（$\\wedge$ 作用在 $\\vee$ 上），$\\neg (x \\wedge y) \\vee z$ 也不是（$\\neg$ 作用在合取式上）。",
      ),
      generate: (rng) => normalFormChoice(rng, "or"),
    },
    {
      id: "converting-to-disjunctive-normal-form",
      title: t("Converting to DNF", "化为析取范式"),
      explanation: t(
        "$(x \\vee y) \\wedge (z \\vee \\neg w) = (x \\wedge z) \\vee (x \\wedge \\neg w) \\vee (y \\wedge z) \\vee (y \\wedge \\neg w)$, distributing like $(a + b)(c + d) = ac + ad + bc + bd$. Push negations inward first with De Morgan's laws.",
        "$(x \\vee y) \\wedge (z \\vee \\neg w) = (x \\wedge z) \\vee (x \\wedge \\neg w) \\vee (y \\wedge z) \\vee (y \\wedge \\neg w)$，就像 $(a + b)(c + d) = ac + ad + bc + bd$ 那样展开。先用德摩根律把否定移到变量上。",
      ),
      generate: (rng) => distributeChoice(rng, "or"),
    },
  ],
};

/** principalChoice asks which minterm (dnf) or maxterm (cnf) appears in the principal normal form. */
function principalChoice(rng: Rng, dnf: boolean): ReturnType<typeof oneOf> {
  let e: BExpr;
  let vec: number[];
  do {
    e = formula3(rng, ["and", "or", "xor", "imp"]);
    vec = vecOf(e, 3);
  } while (vec.filter((b) => b === (dnf ? 1 : 0)).length < 1 || vec.filter((b) => b === (dnf ? 0 : 1)).length < 3);
  const good = range(0, 7).filter((r) => vec[r] === (dnf ? 1 : 0));
  const bad = range(0, 7).filter((r) => vec[r] !== (dnf ? 1 : 0));
  const term = (r: number) => (dnf ? minterm(bits(r, 3)) : maxterm(bits(r, 3)));
  const r = rng.pick(good);
  const x = bits(r, 3);
  return oneOf(
    rng,
    dnf
      ? t(`Which minterm appears in the principal DNF of $${fTex(e, 3)}$?`, `$${fTex(e, 3)}$ 的主析取范式中出现了哪个极小项？`)
      : t(`Which maxterm appears in the principal CNF of $${fTex(e, 3)}$?`, `$${fTex(e, 3)}$ 的主合取范式中出现了哪个极大项？`),
    bmath(term(r)),
    rng
      .shuffle(bad)
      .slice(0, 3)
      .map((s) => bmath(term(s))),
    dnf
      ? t(
          `$f${pointTex(x)} = 1$, and $${btex(term(r))}$ is the conjunction that is $1$ only at $${pointTex(x)}$.`,
          `$f${pointTex(x)} = 1$，而 $${btex(term(r))}$ 正是只在 $${pointTex(x)}$ 处取 $1$ 的合取式。`,
        )
      : t(
          `$f${pointTex(x)} = 0$, and $${btex(term(r))}$ is the disjunction that is $0$ only at $${pointTex(x)}$.`,
          `$f${pointTex(x)} = 0$，而 $${btex(term(r))}$ 正是只在 $${pointTex(x)}$ 处取 $0$ 的析取式。`,
        ),
  );
}

/** principalCount asks how many minterms (dnf) or maxterms (cnf) the principal normal form has. */
function principalCount(rng: Rng, dnf: boolean) {
  const n = rng.int(2, 3);
  let e: BExpr;
  let vec: number[];
  do {
    e = randomB(rng, n, 2, ["and", "or", "xor", "imp", "iff", "nand"]);
    vec = vecOf(e, n);
  } while (!usesAll(e, n) || !vec.includes(0) || !vec.includes(1));
  const ones = vec.filter((b) => b === 1).length;
  const value = dnf ? ones : vec.length - ones;
  return numberProblem({
    prompt: dnf
      ? t(`How many minterms does the principal DNF of $${fTex(e, n)}$ have?`, `$${fTex(e, n)}$ 的主析取范式有多少个极小项？`)
      : t(`How many maxterms does the principal CNF of $${fTex(e, n)}$ have?`, `$${fTex(e, n)}$ 的主合取范式有多少个极大项？`),
    answer: value,
    wrong: [vec.length - value, vec.length, value + 1],
    solution: t(
      `The value vector is $${vecTex(vec)}$. There is one ${dnf ? "minterm for each $1$" : "maxterm for each $0$"}: $${value}$.`,
      `值向量为 $${vecTex(vec)}$。每个${dnf ? " $1$ 对应一个极小项" : " $0$ 对应一个极大项"}：共 $${value}$ 个。`,
    ),
  });
}

/** principalDisjunctiveNormalForms writes a function as the disjunction of its minterms. */
export const principalDisjunctiveNormalForms: TopicDef = {
  id: "principal-disjunctive-normal-forms",
  title: t("Principal Disjunctive Normal Forms", "主析取范式"),
  summary: t(
    "The principal (full) DNF of f is the disjunction of one minterm for each input where f = 1; every non-zero function has exactly one.",
    "f 的主析取范式是对每个使 f = 1 的输入取一个极小项再析取；每个非零函数恰有一个主析取范式。",
  ),
  prerequisites: ["disjunctive-normal-forms"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-minterms",
      title: t("Counting minterms", "统计极小项"),
      explanation: t(
        "$f(x, y) = x \\Rightarrow y$ has value vector $1101$: it is $1$ at three inputs, so its principal DNF $(\\neg x \\wedge \\neg y) \\vee (\\neg x \\wedge y) \\vee (x \\wedge y)$ has three minterms.",
        "$f(x, y) = x \\Rightarrow y$ 的值向量是 $1101$：在三个输入处取 $1$，所以它的主析取范式 $(\\neg x \\wedge \\neg y) \\vee (\\neg x \\wedge y) \\vee (x \\wedge y)$ 有三个极小项。",
      ),
      generate: (rng) => principalCount(rng, true),
    },
    {
      id: "minterms-of-a-function",
      title: t("Minterms of a function", "函数的极小项"),
      explanation: t(
        "The minterm for the input $(1, 0, 1)$ is $x \\wedge \\neg y \\wedge z$: a variable appears plain where the input is $1$ and negated where it is $0$. It belongs to the principal DNF of $f$ exactly when $f(1, 0, 1) = 1$.",
        "输入 $(1, 0, 1)$ 对应的极小项是 $x \\wedge \\neg y \\wedge z$：输入为 $1$ 的变量直接出现，为 $0$ 的取否定。它出现在 $f$ 的主析取范式中当且仅当 $f(1, 0, 1) = 1$。",
      ),
      generate: (rng) => principalChoice(rng, true),
    },
  ],
};

/** conjunctiveNormalForms writes functions as conjunctions of disjunctions of literals. */
export const conjunctiveNormalForms: TopicDef = {
  id: "conjunctive-normal-forms",
  title: t("Conjunctive Normal Forms", "合取范式"),
  summary: t(
    "A conjunctive normal form (CNF) is a conjunction of disjunctions of literals; it is obtained by distributing ∨ over ∧.",
    "合取范式（CNF）是若干文字析取式的合取；把 ∨ 对 ∧ 展开即可得到。",
  ),
  prerequisites: ["disjunctive-normal-forms"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-conjunctive-normal-forms",
      title: t("Recognizing CNF", "识别合取范式"),
      explanation: t(
        "$(x \\vee \\neg y) \\wedge z \\wedge (\\neg x \\vee y \\vee z)$ is in CNF. $(x \\wedge y) \\vee z$ is not, and neither is $\\neg (x \\vee y) \\wedge z$.",
        "$(x \\vee \\neg y) \\wedge z \\wedge (\\neg x \\vee y \\vee z)$ 是合取范式。$(x \\wedge y) \\vee z$ 不是，$\\neg (x \\vee y) \\wedge z$ 也不是。",
      ),
      generate: (rng) => normalFormChoice(rng, "and"),
    },
    {
      id: "converting-to-conjunctive-normal-form",
      title: t("Converting to CNF", "化为合取范式"),
      explanation: t(
        "$(x \\wedge y) \\vee (z \\wedge w) = (x \\vee z) \\wedge (x \\vee w) \\wedge (y \\vee z) \\wedge (y \\vee w)$: distribute $\\vee$ over $\\wedge$, the dual of the DNF expansion.",
        "$(x \\wedge y) \\vee (z \\wedge w) = (x \\vee z) \\wedge (x \\vee w) \\wedge (y \\vee z) \\wedge (y \\vee w)$：把 $\\vee$ 对 $\\wedge$ 展开，与析取范式的展开对偶。",
      ),
      generate: (rng) => distributeChoice(rng, "and"),
    },
  ],
};

/** principalConjunctiveNormalForms writes a function as the conjunction of its maxterms. */
export const principalConjunctiveNormalForms: TopicDef = {
  id: "principal-conjunctive-normal-forms",
  title: t("Principal Conjunctive Normal Forms", "主合取范式"),
  summary: t(
    "The principal (full) CNF of f is the conjunction of one maxterm for each input where f = 0.",
    "f 的主合取范式是对每个使 f = 0 的输入取一个极大项再合取。",
  ),
  prerequisites: ["conjunctive-normal-forms", "principal-disjunctive-normal-forms"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-maxterms",
      title: t("Counting maxterms", "统计极大项"),
      explanation: t(
        "$f(x, y) = x \\Rightarrow y$ has value vector $1101$: it is $0$ only at $(1, 0)$, so its principal CNF is the single maxterm $\\neg x \\vee y$.",
        "$f(x, y) = x \\Rightarrow y$ 的值向量是 $1101$：只在 $(1, 0)$ 处取 $0$，所以它的主合取范式只有一个极大项 $\\neg x \\vee y$。",
      ),
      generate: (rng) => principalCount(rng, false),
    },
    {
      id: "maxterms-of-a-function",
      title: t("Maxterms of a function", "函数的极大项"),
      explanation: t(
        "The maxterm for the input $(1, 0, 1)$ is $\\neg x \\vee y \\vee \\neg z$, which is $0$ only there: a variable is negated where the input is $1$. It belongs to the principal CNF exactly when $f(1, 0, 1) = 0$.",
        "输入 $(1, 0, 1)$ 对应的极大项是 $\\neg x \\vee y \\vee \\neg z$，它只在该处取 $0$：输入为 $1$ 的变量取否定。它出现在主合取范式中当且仅当 $f(1, 0, 1) = 0$。",
      ),
      generate: (rng) => principalChoice(rng, false),
    },
  ],
};

/** booleanPolynomials writes functions as XOR sums of monomials. */
export const booleanPolynomials: TopicDef = {
  id: "boolean-polynomials",
  title: t("Boolean Polynomials", "布尔多项式"),
  summary: t(
    "Every Boolean function is uniquely a Boolean (Zhegalkin) polynomial: an ⊕-sum of distinct monomials such as 1, x, yz, using x ∧ y = xy, ¬x = x ⊕ 1 and x ∨ y = x ⊕ y ⊕ xy.",
    "每个布尔函数都唯一地表示为布尔（热加尔金）多项式：若干不同单项式（如 1、x、yz）的 ⊕ 和，利用 x ∧ y = xy、¬x = x ⊕ 1、x ∨ y = x ⊕ y ⊕ xy。",
  ),
  prerequisites: ["boolean-functions-and-logical-operations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-a-boolean-polynomial",
      title: t("Finding the polynomial", "求布尔多项式"),
      explanation: t(
        "Rewrite with $\\neg a = a \\oplus 1$ and $a \\vee b = a \\oplus b \\oplus ab$, expand, and cancel pairs since $a \\oplus a = 0$. For example $x \\vee \\neg y = x \\oplus (y \\oplus 1) \\oplus x(y \\oplus 1) = 1 \\oplus y \\oplus xy$.",
        "用 $\\neg a = a \\oplus 1$ 与 $a \\vee b = a \\oplus b \\oplus ab$ 改写，展开后两两抵消（$a \\oplus a = 0$）。例如 $x \\vee \\neg y = x \\oplus (y \\oplus 1) \\oplus x(y \\oplus 1) = 1 \\oplus y \\oplus xy$。",
      ),
      generate(rng) {
        const n = rng.int(2, 3);
        let e: BExpr;
        let vec: number[];
        do {
          e = randomB(rng, n, 2, ["and", "or", "imp", "iff"]);
          vec = vecOf(e, n);
        } while (!usesAll(e, n) || !vec.includes(0) || !vec.includes(1));
        const coeffs = anf(vec, n);
        const wrong = range(0, 5).map(() => {
          const c = [...coeffs];
          const m = rng.int(0, c.length - 1);
          c[m] = 1 - c[m]!;
          return anfTex(c, n);
        });
        const right = anfTex(coeffs, n);
        return oneOf(
          rng,
          t(`Which Boolean polynomial equals $${btex(e)}$?`, `哪个布尔多项式等于 $${btex(e)}$？`),
          t(`$${right}$`, `$${right}$`),
          wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `Rewrite with $\\neg a = a \\oplus 1$, $a \\vee b = a \\oplus b \\oplus ab$ and $a \\Rightarrow b = 1 \\oplus a \\oplus ab$, then cancel equal monomials: $${right}$.`,
            `用 $\\neg a = a \\oplus 1$、$a \\vee b = a \\oplus b \\oplus ab$、$a \\Rightarrow b = 1 \\oplus a \\oplus ab$ 改写，再消去相同的单项式：$${right}$。`,
          ),
        );
      },
    },
    {
      id: "counting-monomials",
      title: t("Counting monomials", "统计单项式"),
      explanation: t(
        "The value vector determines the polynomial. For $f(x, y)$ with values $f(0,0) = a$, the constant term is $a$; the coefficient of $x$ is $f(1,0) \\oplus f(0,0)$; of $y$ is $f(0,1) \\oplus f(0,0)$; of $xy$ is the $\\oplus$ of all four values. For $x \\vee y$ ($0111$) this gives $x \\oplus y \\oplus xy$: three monomials.",
        "值向量决定多项式。对 $f(x, y)$，常数项是 $f(0,0)$；$x$ 的系数是 $f(1,0) \\oplus f(0,0)$；$y$ 的系数是 $f(0,1) \\oplus f(0,0)$；$xy$ 的系数是四个值的 $\\oplus$。对 $x \\vee y$（$0111$）得到 $x \\oplus y \\oplus xy$：三个单项式。",
      ),
      generate(rng) {
        const n = rng.int(2, 3);
        let vec: number[];
        do vec = range(1, 2 ** n).map(() => rng.int(0, 1));
        while (!vec.includes(0) || !vec.includes(1));
        const coeffs = anf(vec, n);
        const count = coeffs.filter((c) => c === 1).length;
        return numberProblem({
          prompt: t(
            `The function $f(${argsTex(n)})$ has value vector $${vecTex(vec)}$. How many monomials does its Boolean polynomial have?`,
            `函数 $f(${argsTex(n)})$ 的值向量为 $${vecTex(vec)}$。它的布尔多项式有多少个单项式？`,
          ),
          answer: count,
          wrong: [vec.filter((b) => b === 1).length, count + 1, Math.max(0, count - 1)],
          solution: t(
            `The polynomial is $${anfTex(coeffs, n)}$: $${count}$ monomials.`,
            `多项式为 $${anfTex(coeffs, n)}$：共 $${count}$ 个单项式。`,
          ),
        });
      },
    },
  ],
};

/** mtex writes the minterm list of a value vector: "\sum m(1, 3, 5)". */
const mtex = (vec: readonly number[]) =>
  `\\textstyle\\sum m(${range(0, vec.length - 1)
    .filter((r) => vec[r] === 1)
    .join(", ")})`;

/** kmapFunction picks a function of 3 or 4 variables with at least two ones and two zeros. */
function kmapFunction(rng: Rng): { n: number; vec: number[] } {
  const n = rng.int(3, 4);
  for (;;) {
    const vec = range(1, 2 ** n).map(() => (rng.bool(n === 3 ? 0.45 : 0.4) ? 1 : 0));
    const ones = vec.filter((b) => b === 1).length;
    if (ones >= 2 && ones <= vec.length - 2) return { n, vec };
  }
}

/** simplifyingLogicalExpressionsUsingKarnaughMaps finds minimal DNFs with Karnaugh maps. */
export const simplifyingLogicalExpressionsUsingKarnaughMaps: TopicDef = {
  id: "simplifying-logical-expressions-using-karnaugh-maps",
  title: t("Simplifying Logical Expressions Using Karnaugh Maps", "用卡诺图化简逻辑表达式"),
  summary: t(
    "A Karnaugh map arranges the truth table in Gray-code order so that adjacent cells differ in one variable; covering the 1s with as few, as large rectangular blocks of size 1, 2, 4 or 8 as possible gives a minimal DNF.",
    "卡诺图按格雷码顺序排列真值表，使相邻格子只差一个变量；用尽可能少、尽可能大的矩形块（大小为 1、2、4 或 8）覆盖所有 1，就得到最简析取范式。",
  ),
  prerequisites: ["principal-disjunctive-normal-forms"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "terms-in-a-minimal-dnf",
      title: t("Terms in a minimal DNF", "最简析取范式的项数"),
      explanation: t(
        "For $f(x, y, z) = \\sum m(1, 3, 5, 6, 7)$, the map's 1s are covered by the block $z$ (cells $1, 3, 5, 7$) and the block $x \\wedge y$ (cells $6, 7$): the minimal DNF $z \\vee (x \\wedge y)$ has $2$ terms. Blocks may wrap around the edges of the map.",
        "对 $f(x, y, z) = \\sum m(1, 3, 5, 6, 7)$，卡诺图中的 1 被块 $z$（格子 $1, 3, 5, 7$）和块 $x \\wedge y$（格子 $6, 7$）覆盖：最简析取范式 $z \\vee (x \\wedge y)$ 有 $2$ 项。块可以跨越卡诺图的边缘。",
      ),
      generate(rng) {
        const { n, vec } = kmapFunction(rng);
        const cover = minimalDnf(vec, n);
        const ones = vec.filter((b) => b === 1).length;
        return numberProblem({
          prompt: t(
            `Let $f(${argsTex(n)}) = ${mtex(vec)}$, listing the inputs where $f = 1$ as binary numbers. How many terms does a minimal DNF of $f$ have?`,
            `设 $f(${argsTex(n)}) = ${mtex(vec)}$，即以二进制数列出 $f = 1$ 的输入。$f$ 的最简析取范式有多少项？`,
          ),
          answer: cover.length,
          wrong: [ones, cover.length + 1, cover.length - 1, literalCount(cover)],
          solution: t(
            `Grouping the 1s into the largest blocks gives $${btex(cubesExpr(cover))}$: $${cover.length}$ term${cover.length === 1 ? "" : "s"}.`,
            `把 1 合并成尽可能大的块，得到 $${btex(cubesExpr(cover))}$：共 $${cover.length}$ 项。`,
          ),
        });
      },
    },
    {
      id: "finding-a-minimal-dnf",
      title: t("Finding a minimal DNF", "求最简析取范式"),
      explanation: t(
        "For $f(x, y, z) = \\sum m(0, 2, 4, 5)$: cells $0, 2$ ($x = 0$, $z = 0$) form the block $\\neg x \\wedge \\neg z$, and cells $4, 5$ form $x \\wedge \\neg y$. So $f = (\\neg x \\wedge \\neg z) \\vee (x \\wedge \\neg y)$.",
        "对 $f(x, y, z) = \\sum m(0, 2, 4, 5)$：格子 $0, 2$（$x = 0$，$z = 0$）构成块 $\\neg x \\wedge \\neg z$，格子 $4, 5$ 构成 $x \\wedge \\neg y$。所以 $f = (\\neg x \\wedge \\neg z) \\vee (x \\wedge \\neg y)$。",
      ),
      generate(rng) {
        let n: number;
        let vec: number[];
        do ({ n, vec } = kmapFunction(rng));
        while (n === 4 && vec.filter((b) => b === 1).length > 8);
        const cover = minimalDnf(vec, n);
        const right = cubesExpr(cover);
        const wrong = range(0, 6).flatMap(() => {
          const v2 = [...vec];
          const r = rng.int(0, v2.length - 1);
          v2[r] = 1 - v2[r]!;
          return v2.includes(1) && v2.includes(0) ? [cubesExpr(minimalDnf(v2, n))] : [];
        });
        return oneOf(
          rng,
          t(`Which is a minimal DNF of $f(${argsTex(n)}) = ${mtex(vec)}$?`, `哪个是 $f(${argsTex(n)}) = ${mtex(vec)}$ 的最简析取范式？`),
          bmath(right),
          wrong.filter((w) => !sameVec(vecOf(w, n), vec)).map(bmath),
          t(`Cover the 1s with the fewest, largest blocks: $f = ${btex(right)}$.`, `用最少、最大的块覆盖所有 1：$f = ${btex(right)}$。`),
        );
      },
    },
  ],
};

/** truthPreservingBooleanFunctions studies the classes T₀ and T₁. */
export const truthPreservingBooleanFunctions: TopicDef = {
  id: "truth-preserving-boolean-functions",
  title: t("Truth-Preserving Boolean Functions", "保真布尔函数"),
  summary: t(
    "f preserves 0 (f ∈ T₀) if f(0, …, 0) = 0, and preserves 1 (f ∈ T₁) if f(1, …, 1) = 1; compositions of such functions keep the property.",
    "若 f(0, …, 0) = 0，则 f 保 0（f ∈ T₀）；若 f(1, …, 1) = 1，则 f 保 1（f ∈ T₁）；这样的函数复合后仍保持该性质。",
  ),
  prerequisites: ["boolean-functions-and-logical-operations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "classifying-truth-preservation",
      title: t("Classifying functions", "函数分类"),
      explanation: t(
        "$x \\wedge y$ preserves both $0$ and $1$. $x \\Rightarrow y$ preserves $1$ only, since $0 \\Rightarrow 0 = 1$. $x \\oplus y$ preserves $0$ only. $x \\uparrow y$ preserves neither.",
        "$x \\wedge y$ 既保 $0$ 又保 $1$。$x \\Rightarrow y$ 只保 $1$，因为 $0 \\Rightarrow 0 = 1$。$x \\oplus y$ 只保 $0$。$x \\uparrow y$ 两者都不保。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        let e: BExpr;
        let vec: number[];
        do {
          e = formula3(rng, ["and", "or", "xor", "imp", "nand", "nor", "iff"]);
          vec = vecOf(e, 3);
        } while (
          [vec[0] === 0 && vec[7] === 1, vec[0] === 0 && vec[7] === 0, vec[0] === 1 && vec[7] === 1, vec[0] === 1 && vec[7] === 0].indexOf(
            true,
          ) !== kind
        );
        const options = [
          t("Preserves both 0 and 1", "既保 0 又保 1"),
          t("Preserves 0 only", "只保 0"),
          t("Preserves 1 only", "只保 1"),
          t("Preserves neither", "两者都不保"),
        ];
        return oneOf(
          rng,
          t(`Which describes $${fTex(e, 3)}$?`, `哪个说法描述了 $${fTex(e, 3)}$？`),
          options[kind]!,
          options.filter((_, i) => i !== kind),
          t(`$f(0, 0, 0) = ${vec[0]}$ and $f(1, 1, 1) = ${vec[7]}$.`, `$f(0, 0, 0) = ${vec[0]}$，$f(1, 1, 1) = ${vec[7]}$。`),
        );
      },
    },
    {
      id: "counting-truth-preserving-functions",
      title: t("Counting functions", "统计函数个数"),
      explanation: t(
        "Of the $2^{2^n}$ functions of $n$ variables, fixing $f(0, \\dots, 0) = 0$ leaves $2^{2^n - 1}$; fixing both $f(0, \\dots, 0) = 0$ and $f(1, \\dots, 1) = 1$ leaves $2^{2^n - 2}$. For $n = 2$: $8$ preserve $0$ and $4$ preserve both.",
        "在 $2^{2^n}$ 个 $n$ 元函数中，固定 $f(0, \\dots, 0) = 0$ 后剩 $2^{2^n - 1}$ 个；同时固定 $f(0, \\dots, 0) = 0$ 与 $f(1, \\dots, 1) = 1$ 后剩 $2^{2^n - 2}$ 个。$n = 2$ 时：$8$ 个保 $0$，$4$ 个两者都保。",
      ),
      generate(rng) {
        const n = rng.int(1, 5);
        const kind = rng.int(0, 4);
        const N = 2 ** n;
        const [en, zh, value] = [
          ["preserve $0$", "保 $0$", 2 ** (N - 1)],
          ["preserve $1$", "保 $1$", 2 ** (N - 1)],
          ["preserve both $0$ and $1$", "既保 $0$ 又保 $1$", 2 ** (N - 2)],
          ["preserve $0$ but not $1$", "保 $0$ 但不保 $1$", 2 ** (N - 2)],
          ["preserve neither $0$ nor $1$", "既不保 $0$ 也不保 $1$", 2 ** (N - 2)],
        ][kind] as [string, string, number];
        return numberProblem({
          prompt: t(`How many Boolean functions of $${n}$ variable${n === 1 ? "" : "s"} ${en}?`, `有多少个 $${n}$ 元布尔函数${zh}？`),
          answer: value,
          wrong: [2 ** N, kind < 2 ? 2 ** (N - 2) : 2 ** (N - 1), N],
          solution: t(
            `${kind < 2 ? "One value is fixed" : "Two values are fixed"}, so $${kind < 2 ? N - 1 : N - 2}$ of the $${N}$ values are free: $2^{${kind < 2 ? N - 1 : N - 2}} = ${value}$.`,
            `${kind < 2 ? "固定了一个值" : "固定了两个值"}，所以 $${N}$ 个值中有 $${kind < 2 ? N - 1 : N - 2}$ 个是自由的：$2^{${kind < 2 ? N - 1 : N - 2}} = ${value}$。`,
          ),
        });
      },
    },
  ],
};

/** substitute replaces each variable i by the expression subs[i]. */
const substitute = (e: BExpr, subs: readonly BExpr[]): BExpr => {
  if (e.k === "var") return subs[e.i]!;
  if (e.k === "const") return e;
  if (e.k === "not") return bnot(substitute(e.a, subs));
  return bin(e.k, substitute(e.a, subs), substitute(e.b, subs));
};

/** dual swaps ∧ with ∨ and 0 with 1 in an expression over ∧, ∨ and ¬. */
const dual = (e: BExpr): BExpr => {
  if (e.k === "var") return e;
  if (e.k === "const") return bc(e.v === 1 ? 0 : 1);
  if (e.k === "not") return bnot(dual(e.a));
  return bin(e.k === "and" ? "or" : e.k === "or" ? "and" : e.k, dual(e.a), dual(e.b));
};

/** selfDualTemplates are self-dual functions of x, y, z. */
const selfDualTemplates: readonly BExpr[] = [
  bor(band(X, Y), band(Y, bv(2)), band(X, bv(2))),
  bxor(X, Y, bv(2)),
  band(bor(X, Y), bor(Y, bv(2)), bor(X, bv(2))),
  bor(band(X, bnot(Y)), band(X, bv(2)), band(bnot(Y), bv(2))),
  bxor(X, Y, bv(2), bc(1)),
];

/** selfDualBooleanFunctions studies functions equal to their duals. */
export const selfDualBooleanFunctions: TopicDef = {
  id: "self-dual-boolean-functions",
  title: t("Self-Dual Boolean Functions", "自对偶布尔函数"),
  summary: t(
    "The dual of $f$ is $f^*(x_1, \\dots, x_n) = \\neg f(\\neg x_1, \\dots, \\neg x_n)$, obtained by swapping $\\land$ with $\\lor$ and $0$ with $1$; $f$ is self-dual when $f^* = f$, that is, $f$ takes opposite values at opposite inputs.",
    "$f$ 的对偶函数是 $f^*(x_1, \\dots, x_n) = \\neg f(\\neg x_1, \\dots, \\neg x_n)$，可通过交换 $\\land$ 与 $\\lor$、$0$ 与 $1$ 得到；若 $f^* = f$，则 $f$ 是自对偶的，即 $f$ 在相反的输入处取相反的值。",
  ),
  prerequisites: ["truth-preserving-boolean-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-self-dual-functions",
      title: t("Recognizing self-dual functions", "识别自对偶函数"),
      explanation: t(
        "Check opposite pairs of inputs: $f$ is self-dual exactly when $f(\\neg a) = \\neg f(a)$ for each $a$, so its value vector read backward is its complement. The majority function $(x \\wedge y) \\vee (y \\wedge z) \\vee (x \\wedge z)$ is self-dual; $x \\wedge y$ is not, since $f(0, 1) = 0 = f(1, 0)$.",
        "检查相反的输入对：$f$ 自对偶当且仅当对每个 $a$ 有 $f(\\neg a) = \\neg f(a)$，即值向量倒过来读正好是它的补。多数函数 $(x \\wedge y) \\vee (y \\wedge z) \\vee (x \\wedge z)$ 是自对偶的；$x \\wedge y$ 不是，因为 $f(0, 1) = 0 = f(1, 0)$。",
      ),
      generate(rng) {
        const value = rng.bool();
        let e: BExpr;
        if (value) {
          const perm = rng.shuffle([0, 1, 2]);
          e = substitute(
            rng.pick(selfDualTemplates),
            perm.map((i) => randomLit(rng, i)),
          );
        } else {
          do e = formula3(rng, ["and", "or", "xor", "imp"]);
          while (inClass("S", vecOf(e, 3), 3));
        }
        const vec = vecOf(e, 3);
        const r = range(0, 7).find((s) => vec[s] === vec[7 - s]);
        return oneOf(
          rng,
          t(`Is $${fTex(e, 3)}$ self-dual?`, `$${fTex(e, 3)}$ 是自对偶的吗？`),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          r === undefined
            ? t(
                `Yes: the value vector $${vecTex(vec)}$ read backward is its complement.`,
                `是：值向量 $${vecTex(vec)}$ 倒过来读正好是它的补。`,
              )
            : t(
                `No: $f${pointTex(bits(r, 3))} = f${pointTex(bits(7 - r, 3))} = ${vec[r]}$ at opposite inputs.`,
                `不是：在相反的输入处 $f${pointTex(bits(r, 3))} = f${pointTex(bits(7 - r, 3))} = ${vec[r]}$。`,
              ),
        );
      },
    },
    {
      id: "finding-the-dual",
      title: t("Finding the dual", "求对偶函数"),
      explanation: t(
        "For an expression in $\\wedge$, $\\vee$, $\\neg$, $0$ and $1$, the dual swaps $\\wedge \\leftrightarrow \\vee$ and $0 \\leftrightarrow 1$ and keeps the literals: the dual of $x \\wedge (\\neg y \\vee 0)$ is $x \\vee (\\neg y \\wedge 1)$.",
        "对由 $\\wedge$、$\\vee$、$\\neg$、$0$、$1$ 组成的表达式，对偶就是交换 $\\wedge \\leftrightarrow \\vee$、$0 \\leftrightarrow 1$，文字保持不变：$x \\wedge (\\neg y \\vee 0)$ 的对偶是 $x \\vee (\\neg y \\wedge 1)$。",
      ),
      generate(rng) {
        let e: BExpr;
        do e = formula3(rng, ["and", "or"]);
        while (inClass("S", vecOf(e, 3), 3) || !/vee/.test(btex(e)) || !/wedge/.test(btex(e)));
        const d = dual(e);
        const vec = vecOf(d, 3);
        const wrong = [e, bnot(e), bnot(d), substitute(e, [bnot(X), bnot(Y), bnot(bv(2))])].filter((w) => !sameVec(vecOf(w, 3), vec));
        return oneOf(
          rng,
          t(`Find the dual of $${fTex(e, 3)}$.`, `求 $${fTex(e, 3)}$ 的对偶函数。`),
          bmath(d),
          wrong.map(bmath),
          t(
            `Swap $\\wedge$ and $\\vee$, keeping the literals: $f^* = ${btex(d)}$, which equals $\\neg f(\\neg x, \\neg y, \\neg z)$.`,
            `交换 $\\wedge$ 与 $\\vee$，文字不变：$f^* = ${btex(d)}$，它等于 $\\neg f(\\neg x, \\neg y, \\neg z)$。`,
          ),
        );
      },
    },
  ],
};

/** upSet builds the monotone function whose 1s lie above the given generators. */
const upSet = (gens: readonly number[], n: number) => range(0, 2 ** n - 1).map((r) => (gens.some((g) => (g & r) === g) ? 1 : 0));

/** violations lists the pairs r ≤ s (bitwise) with f(r) = 1 and f(s) = 0. */
const violations = (vec: readonly number[]) =>
  range(0, vec.length - 1).flatMap((r) =>
    range(0, vec.length - 1)
      .filter((s) => s !== r && (r & s) === r && vec[r] === 1 && vec[s] === 0)
      .map((s) => [r, s] as const),
  );

/** monotonicBooleanFunctions studies functions that never decrease when an input increases. */
export const monotonicBooleanFunctions: TopicDef = {
  id: "monotonic-boolean-functions",
  title: t("Monotonic Boolean Functions", "单调布尔函数"),
  summary: t(
    "Order inputs componentwise: α ≤ β when each αᵢ ≤ βᵢ. f is monotonic if α ≤ β always gives f(α) ≤ f(β); exactly these functions have a DNF without negations.",
    "按分量比较输入：若每个 αᵢ ≤ βᵢ，则 α ≤ β。若 α ≤ β 总推出 f(α) ≤ f(β)，则 f 是单调的；恰好是这些函数有不含否定的析取范式。",
  ),
  prerequisites: ["truth-preserving-boolean-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-monotonic-functions",
      title: t("Recognizing monotonic functions", "识别单调函数"),
      explanation: t(
        "For value vector $0001\\,0111$ (the majority of $x, y, z$), turning any $0$ into $1$ in an input never lowers $f$: it is monotonic. For $0110\\,0000$, $f(0, 0, 1) = 1$ but $f(1, 0, 1) = 0$ with $(0, 0, 1) \\le (1, 0, 1)$: it is not.",
        "对值向量 $0001\\,0111$（$x, y, z$ 的多数函数），把输入中任一 $0$ 改为 $1$ 都不会使 $f$ 变小：它是单调的。对 $0110\\,0000$，$(0, 0, 1) \\le (1, 0, 1)$ 但 $f(0, 0, 1) = 1$，$f(1, 0, 1) = 0$：它不是单调的。",
      ),
      generate(rng) {
        const value = rng.bool();
        let vec: number[];
        if (value) {
          do vec = upSet(rng.sample(range(1, 7), rng.int(1, 3)), 3);
          while (vec.every((b) => b === vec[7]));
        } else {
          do vec = range(0, 7).map(() => rng.int(0, 1));
          while (violations(vec).length === 0);
        }
        const bad = violations(vec)[0];
        return oneOf(
          rng,
          t(
            `Is the function $f(x, y, z)$ with value vector $${vecTex(vec)}$ monotonic?`,
            `值向量为 $${vecTex(vec)}$ 的函数 $f(x, y, z)$ 是单调的吗？`,
          ),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          bad
            ? t(
                `No: $${pointTex(bits(bad[0], 3))} \\le ${pointTex(bits(bad[1], 3))}$ but $f$ drops from $1$ to $0$.`,
                `不是：$${pointTex(bits(bad[0], 3))} \\le ${pointTex(bits(bad[1], 3))}$，但 $f$ 从 $1$ 降为 $0$。`,
              )
            : t("Yes: raising any input from $0$ to $1$ never lowers $f$.", "是：把任一输入从 $0$ 改为 $1$ 都不会使 $f$ 变小。"),
        );
      },
    },
    {
      id: "witnessing-non-monotonicity",
      title: t("Witnessing non-monotonicity", "说明非单调性"),
      explanation: t(
        "To show $f$ is not monotonic, give inputs $\\alpha \\le \\beta$ with $f(\\alpha) = 1$ and $f(\\beta) = 0$. The inputs must be comparable: $(1, 0, 0)$ and $(0, 1, 1)$ are not, since neither is below the other.",
        "要说明 $f$ 不单调，只需给出 $\\alpha \\le \\beta$ 且 $f(\\alpha) = 1$、$f(\\beta) = 0$。这两个输入必须可比较：$(1, 0, 0)$ 与 $(0, 1, 1)$ 不可比较，因为谁也不在谁下面。",
      ),
      generate(rng) {
        let vec: number[];
        do vec = range(0, 7).map(() => rng.int(0, 1));
        while (violations(vec).length === 0);
        const [r, s] = rng.pick(violations(vec));
        const pairText = ([a, b]: readonly [number, number]) =>
          t(
            `$\\alpha = ${pointTex(bits(a, 3))}$, $\\beta = ${pointTex(bits(b, 3))}$`,
            `$\\alpha = ${pointTex(bits(a, 3))}$，$\\beta = ${pointTex(bits(b, 3))}$`,
          );
        const others = range(0, 7).flatMap((a) =>
          range(0, 7)
            .filter((b) => a !== b && !((a & b) === a && vec[a] === 1 && vec[b] === 0))
            .filter((b) => ((a & b) === a && vec[a]! <= vec[b]!) || ((a & b) !== a && vec[a] === 1 && vec[b] === 0))
            .map((b) => [a, b] as const),
        );
        return oneOf(
          rng,
          t(
            `The function $f(x, y, z)$ has value vector $${vecTex(vec)}$. Which pair shows that $f$ is not monotonic?`,
            `函数 $f(x, y, z)$ 的值向量为 $${vecTex(vec)}$。哪一对输入说明 $f$ 不是单调的？`,
          ),
          pairText([r, s]),
          rng.shuffle(others).slice(0, 3).map(pairText),
          t(
            `$${pointTex(bits(r, 3))} \\le ${pointTex(bits(s, 3))}$, yet $f${pointTex(bits(r, 3))} = 1$ and $f${pointTex(bits(s, 3))} = 0$.`,
            `$${pointTex(bits(r, 3))} \\le ${pointTex(bits(s, 3))}$，但 $f${pointTex(bits(r, 3))} = 1$，$f${pointTex(bits(s, 3))} = 0$。`,
          ),
        );
      },
    },
  ],
};

/** affineBooleanFunctions studies functions whose Boolean polynomial has degree at most 1. */
export const affineBooleanFunctions: TopicDef = {
  id: "affine-boolean-functions",
  title: t("Affine Boolean Functions", "仿射布尔函数"),
  summary: t(
    "f is affine (linear) when its Boolean polynomial has no product terms: f = a₀ ⊕ a₁x₁ ⊕ ⋯ ⊕ aₙxₙ. There are 2ⁿ⁺¹ affine functions of n variables.",
    "若 f 的布尔多项式不含乘积项，即 f = a₀ ⊕ a₁x₁ ⊕ ⋯ ⊕ aₙxₙ，则 f 是仿射（线性）的。n 元仿射函数共有 2ⁿ⁺¹ 个。",
  ),
  prerequisites: ["boolean-polynomials"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-affine-functions",
      title: t("Recognizing affine functions", "识别仿射函数"),
      explanation: t(
        "$x \\Leftrightarrow y = 1 \\oplus x \\oplus y$ is affine. $x \\vee y = x \\oplus y \\oplus xy$ is not: its polynomial contains $xy$.",
        "$x \\Leftrightarrow y = 1 \\oplus x \\oplus y$ 是仿射的。$x \\vee y = x \\oplus y \\oplus xy$ 不是：它的多项式含有 $xy$。",
      ),
      generate(rng) {
        const value = rng.bool();
        let e: BExpr;
        let vec: number[];
        do {
          e = formula3(rng, value ? ["xor", "iff"] : ["and", "or", "xor", "iff", "imp"]);
          vec = vecOf(e, 3);
        } while (inClass("L", vec, 3) !== value);
        const poly = anfTex(anf(vec, 3), 3);
        return oneOf(
          rng,
          t(`Is $${fTex(e, 3)}$ affine?`, `$${fTex(e, 3)}$ 是仿射的吗？`),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          value
            ? t(`Yes: its Boolean polynomial is $${poly}$, with no products.`, `是：它的布尔多项式为 $${poly}$，不含乘积项。`)
            : t(`No: its Boolean polynomial $${poly}$ contains a product.`, `不是：它的布尔多项式 $${poly}$ 含有乘积项。`),
        );
      },
    },
    {
      id: "counting-affine-functions",
      title: t("Counting affine functions", "统计仿射函数"),
      explanation: t(
        "An affine function $a_0 \\oplus a_1 x_1 \\oplus \\dots \\oplus a_n x_n$ is fixed by $n + 1$ bits, so there are $2^{n + 1}$. Those that depend on exactly $k$ variables choose the $k$ variables and the constant: $2\\binom{n}{k}$.",
        "仿射函数 $a_0 \\oplus a_1 x_1 \\oplus \\dots \\oplus a_n x_n$ 由 $n + 1$ 个比特决定，所以共有 $2^{n + 1}$ 个。恰好依赖 $k$ 个变量的，需选出这 $k$ 个变量及常数项：$2\\binom{n}{k}$ 个。",
      ),
      generate(rng) {
        const n = rng.int(2, 8);
        const kind = rng.int(0, 2);
        const k = rng.int(1, n);
        const [en, zh, value, why, whyZh] = [
          [
            "are affine",
            "是仿射的",
            2 ** (n + 1),
            `There are $n + 1 = ${n + 1}$ free bits: $2^{${n + 1}}$`,
            `共有 $n + 1 = ${n + 1}$ 个自由比特：$2^{${n + 1}}$`,
          ],
          [
            "are affine and preserve $0$",
            "是仿射的且保 $0$",
            2 ** n,
            `Setting $a_0 = 0$ leaves $${n}$ free bits: $2^{${n}}$`,
            `取 $a_0 = 0$，剩 $${n}$ 个自由比特：$2^{${n}}$`,
          ],
          [
            `are affine and depend on exactly $${k}$ of them`,
            `是仿射的且恰好依赖其中 $${k}$ 个变量`,
            2 * choose(n, k),
            `Choose the $${k}$ variables and the constant: $2\\binom{${n}}{${k}}$`,
            `选出 $${k}$ 个变量和常数项：$2\\binom{${n}}{${k}}$`,
          ],
        ][kind] as [string, string, number, string, string];
        return numberProblem({
          prompt: t(`How many Boolean functions of $${n}$ variables ${en}?`, `有多少个 $${n}$ 元布尔函数${zh}？`),
          answer: value,
          wrong: [2 ** n === value ? 2 ** (n + 1) : 2 ** n, choose(n, k), value + 2],
          solution: t(`${why} $= ${value}$.`, `${whyZh} $= ${value}$。`),
        });
      },
    },
  ],
};

/** CompleteSet is a set of operations with whether it is functionally complete and why. */
interface CompleteSet {
  readonly ops: readonly string[];
  readonly complete: boolean;
  readonly why: Text;
}

/** completeSets are standard sets of operations. */
const completeSets: readonly CompleteSet[] = [
  {
    ops: ["\\neg", "\\wedge"],
    complete: true,
    why: t(
      "$x \\vee y = \\neg(\\neg x \\wedge \\neg y)$, and $\\{\\neg, \\wedge, \\vee\\}$ gives every DNF.",
      "$x \\vee y = \\neg(\\neg x \\wedge \\neg y)$，而 $\\{\\neg, \\wedge, \\vee\\}$ 能写出任何析取范式。",
    ),
  },
  {
    ops: ["\\neg", "\\vee"],
    complete: true,
    why: t(
      "$x \\wedge y = \\neg(\\neg x \\vee \\neg y)$, and $\\{\\neg, \\wedge, \\vee\\}$ gives every DNF.",
      "$x \\wedge y = \\neg(\\neg x \\vee \\neg y)$，而 $\\{\\neg, \\wedge, \\vee\\}$ 能写出任何析取范式。",
    ),
  },
  {
    ops: ["\\uparrow"],
    complete: true,
    why: t(
      "$\\neg x = x \\uparrow x$ and $x \\wedge y = (x \\uparrow y) \\uparrow (x \\uparrow y)$.",
      "$\\neg x = x \\uparrow x$，$x \\wedge y = (x \\uparrow y) \\uparrow (x \\uparrow y)$。",
    ),
  },
  {
    ops: ["\\downarrow"],
    complete: true,
    why: t(
      "$\\neg x = x \\downarrow x$ and $x \\vee y = (x \\downarrow y) \\downarrow (x \\downarrow y)$.",
      "$\\neg x = x \\downarrow x$，$x \\vee y = (x \\downarrow y) \\downarrow (x \\downarrow y)$。",
    ),
  },
  {
    ops: ["\\Rightarrow", "0"],
    complete: true,
    why: t(
      "$\\neg x = x \\Rightarrow 0$ and $x \\vee y = \\neg x \\Rightarrow y$.",
      "$\\neg x = x \\Rightarrow 0$，$x \\vee y = \\neg x \\Rightarrow y$。",
    ),
  },
  {
    ops: ["\\Rightarrow", "\\neg"],
    complete: true,
    why: t(
      "$x \\vee y = \\neg x \\Rightarrow y$, and $\\{\\neg, \\vee\\}$ is complete.",
      "$x \\vee y = \\neg x \\Rightarrow y$，而 $\\{\\neg, \\vee\\}$ 是完备的。",
    ),
  },
  { ops: ["\\wedge", "\\oplus", "1"], complete: true, why: t("They give every Boolean polynomial.", "它们能写出任何布尔多项式。") },
  {
    ops: ["\\wedge", "\\vee"],
    complete: false,
    why: t("Every expression in them is monotonic, so $\\neg x$ cannot be built.", "由它们构成的表达式都是单调的，所以写不出 $\\neg x$。"),
  },
  {
    ops: ["\\wedge", "\\vee", "0", "1"],
    complete: false,
    why: t("Every expression in them is monotonic, so $\\neg x$ cannot be built.", "由它们构成的表达式都是单调的，所以写不出 $\\neg x$。"),
  },
  {
    ops: ["\\oplus", "1"],
    complete: false,
    why: t(
      "Every expression in them is affine, so $x \\wedge y$ cannot be built.",
      "由它们构成的表达式都是仿射的，所以写不出 $x \\wedge y$。",
    ),
  },
  {
    ops: ["\\neg", "\\oplus"],
    complete: false,
    why: t(
      "Every expression in them is affine, so $x \\wedge y$ cannot be built.",
      "由它们构成的表达式都是仿射的，所以写不出 $x \\wedge y$。",
    ),
  },
  {
    ops: ["\\wedge", "\\oplus"],
    complete: false,
    why: t("Both preserve $0$, so $\\neg x$ cannot be built.", "两者都保 $0$，所以写不出 $\\neg x$。"),
  },
  {
    ops: ["\\Rightarrow"],
    complete: false,
    why: t("$\\Rightarrow$ preserves $1$, so $\\neg x$ cannot be built.", "$\\Rightarrow$ 保 $1$，所以写不出 $\\neg x$。"),
  },
  {
    ops: ["\\vee", "\\Leftrightarrow"],
    complete: false,
    why: t("Both preserve $1$, so $\\neg x$ cannot be built.", "两者都保 $1$，所以写不出 $\\neg x$。"),
  },
  {
    ops: ["\\neg"],
    complete: false,
    why: t("Expressions in $\\neg$ alone depend on one variable.", "只用 $\\neg$ 的表达式只依赖一个变量。"),
  },
  {
    ops: ["\\neg", "\\Leftrightarrow"],
    complete: false,
    why: t(
      "Every expression in them is affine, so $x \\wedge y$ cannot be built.",
      "由它们构成的表达式都是仿射的，所以写不出 $x \\wedge y$。",
    ),
  },
];

/** gateOnly lists two-variable expressions written with only ↑ or only ↓. */
const gateOnly = (op: "nand" | "nor"): readonly BExpr[] => [
  bin(op, X, X),
  bin(op, bin(op, X, Y), bin(op, X, Y)),
  bin(op, bin(op, X, X), bin(op, Y, Y)),
  bin(op, X, bin(op, Y, Y)),
  bin(op, bin(op, X, X), Y),
];

/** functionallyCompleteSets finds sets of operations that express every Boolean function. */
export const functionallyCompleteSets: TopicDef = {
  id: "functionally-complete-sets",
  title: t("Functionally Complete Sets", "函数完备集"),
  summary: t(
    "A set of operations is functionally complete if every Boolean function can be written using only them; {¬, ∧, ∨} is complete because of the principal DNF, and so are {↑} and {↓}.",
    "若只用一组运算就能写出所有布尔函数，则称这组运算函数完备；由主析取范式知 {¬, ∧, ∨} 是完备的，{↑} 与 {↓} 也是。",
  ),
  prerequisites: ["principal-disjunctive-normal-forms"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "writing-functions-with-nand-or-nor",
      title: t("Using only ↑ or only ↓", "只用 ↑ 或只用 ↓"),
      explanation: t(
        "$x \\uparrow x = \\neg x$, $(x \\uparrow y) \\uparrow (x \\uparrow y) = x \\wedge y$ and $(x \\uparrow x) \\uparrow (y \\uparrow y) = x \\vee y$. Dually, $(x \\downarrow y) \\downarrow (x \\downarrow y) = x \\vee y$ and $(x \\downarrow x) \\downarrow (y \\downarrow y) = x \\wedge y$.",
        "$x \\uparrow x = \\neg x$，$(x \\uparrow y) \\uparrow (x \\uparrow y) = x \\wedge y$，$(x \\uparrow x) \\uparrow (y \\uparrow y) = x \\vee y$。对偶地，$(x \\downarrow y) \\downarrow (x \\downarrow y) = x \\vee y$，$(x \\downarrow x) \\downarrow (y \\downarrow y) = x \\wedge y$。",
      ),
      generate(rng) {
        const op = rng.pick(["nand", "nor"] as const);
        const pair = rng.pick(PAIRS);
        const pool = gateOnly(op).map((e) => pairOf(e, pair));
        const targets = [bnot(X), band(X, Y), bor(X, Y), bor(bnot(X), Y), band(X, bnot(Y)), bor(X, bnot(Y)), band(bnot(X), Y)].map((e) =>
          pairOf(e, pair),
        );
        const target = rng.pick(targets.filter((g) => pool.some((e) => sameVec(vecOf(e, 3), vecOf(g, 3)))));
        const vec = vecOf(target, 3);
        const right = pool.find((e) => sameVec(vecOf(e, 3), vec))!;
        return oneOf(
          rng,
          t(
            `Which expression using only $${opTex[op]}$ is equivalent to $${btex(target)}$?`,
            `哪个只用 $${opTex[op]}$ 的表达式与 $${btex(target)}$ 等价？`,
          ),
          bmath(right),
          pool.filter((e) => !sameVec(vecOf(e, 3), vec)).map(bmath),
          t(`Compare truth tables: $${btex(right)} \\equiv ${btex(target)}$.`, `比较真值表：$${btex(right)} \\equiv ${btex(target)}$。`),
        );
      },
    },
    {
      id: "deciding-functional-completeness",
      title: t("Deciding completeness", "判断完备性"),
      explanation: t(
        "To show a set is complete, build a known complete set from it: $\\{\\Rightarrow, 0\\}$ gives $\\neg x = x \\Rightarrow 0$ and $x \\vee y = \\neg x \\Rightarrow y$. To show it is not, find a property every expression in it keeps: expressions in $\\wedge, \\vee$ are all monotonic, so they never give $\\neg x$.",
        "要证明一组运算完备，就用它构造出已知的完备集：$\\{\\Rightarrow, 0\\}$ 给出 $\\neg x = x \\Rightarrow 0$ 和 $x \\vee y = \\neg x \\Rightarrow y$。要证明不完备，就找出所有表达式都保持的性质：由 $\\wedge, \\vee$ 构成的表达式都是单调的，因而写不出 $\\neg x$。",
      ),
      generate(rng) {
        const s = rng.pick(completeSets);
        const ops = rng.shuffle(s.ops);
        return oneOf(
          rng,
          t(`Is $\\{${ops.join(", ")}\\}$ functionally complete?`, `$\\{${ops.join(", ")}\\}$ 函数完备吗？`),
          yesNo[s.complete ? 0 : 1]!,
          [yesNo[s.complete ? 1 : 0]!],
          s.why,
        );
      },
    },
  ],
};

/** missingClasses lists the Post classes that contain every function of a set. */
const missingClasses = (vecs: readonly (readonly number[])[], n: number) => POST.filter((c) => vecs.every((v) => inClass(c, v, n)));

/** postsFunctionalCompletenessTheorem decides completeness with the five Post classes. */
export const postsFunctionalCompletenessTheorem: TopicDef = {
  id: "posts-functional-completeness-theorem",
  title: t("Post's Functional Completeness Theorem", "波斯特函数完备性定理"),
  summary: t(
    "Post's theorem: a set of Boolean functions is functionally complete exactly when it is not contained in any of the five classes T₀, T₁, S (self-dual), M (monotonic) and L (affine).",
    "波斯特定理：一组布尔函数函数完备，当且仅当它不包含于 T₀、T₁、S（自对偶）、M（单调）、L（仿射）五个类中的任何一个。",
  ),
  prerequisites: ["functionally-complete-sets", "self-dual-boolean-functions", "monotonic-boolean-functions", "affine-boolean-functions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "post-classes-of-a-function",
      title: t("The Post classes of a function", "函数所属的波斯特类"),
      explanation: t(
        "$x \\wedge y$ preserves $0$ and $1$ and is monotonic, but is not self-dual and not affine ($xy$ is a product): it lies in $3$ of the $5$ classes. $x \\uparrow y$ lies in none, so $\\{\\uparrow\\}$ is complete.",
        "$x \\wedge y$ 保 $0$、保 $1$ 且单调，但不自对偶也不仿射（$xy$ 是乘积）：它属于 $5$ 个类中的 $3$ 个。$x \\uparrow y$ 不属于任何一个，所以 $\\{\\uparrow\\}$ 完备。",
      ),
      generate(rng) {
        const n = rng.int(2, 3);
        let e: BExpr;
        do e = randomB(rng, n, 2, ["and", "or", "xor", "imp", "iff", "nand", "nor"]);
        while (!usesAll(e, n));
        const vec = vecOf(e, n);
        const inside = missingClasses([vec], n);
        return numberProblem({
          prompt: t(
            `How many of the Post classes $T_0, T_1, S, M, L$ contain $${fTex(e, n)}$?`,
            `波斯特类 $T_0, T_1, S, M, L$ 中有多少个包含 $${fTex(e, n)}$？`,
          ),
          answer: inside.length,
          wrong: [5 - inside.length, Math.min(5, inside.length + 1), Math.max(0, inside.length - 1)],
          solution: t(
            `The value vector is $${vecTex(vec)}$. ${POST.map((c) => `$${classTex[c]}$: ${inside.includes(c) ? "yes" : "no"}`).join("; ")}. So $${inside.length}$.`,
            `值向量为 $${vecTex(vec)}$。${POST.map((c) => `$${classTex[c]}$：${inside.includes(c) ? "是" : "否"}`).join("；")}。所以是 $${inside.length}$ 个。`,
          ),
        });
      },
    },
    {
      id: "applying-posts-theorem",
      title: t("Applying Post's theorem", "应用波斯特定理"),
      explanation: t(
        "$\\{x \\wedge y, x \\oplus y\\}$: both preserve $0$, so the set lies in $T_0$ and is not complete. $\\{x \\Rightarrow y, x \\oplus y\\}$: $x \\oplus y$ leaves $T_1$; $x \\Rightarrow y$ leaves $T_0$, $S$, $M$ and $L$: it is complete.",
        "$\\{x \\wedge y, x \\oplus y\\}$：两者都保 $0$，所以该集合包含于 $T_0$，不完备。$\\{x \\Rightarrow y, x \\oplus y\\}$：$x \\oplus y$ 不在 $T_1$ 中；$x \\Rightarrow y$ 不在 $T_0$、$S$、$M$、$L$ 中：它是完备的。",
      ),
      generate(rng) {
        const value = rng.bool();
        let f: BExpr;
        let g: BExpr;
        let common: PostClass[];
        do {
          f = randomB(rng, 2, 2, ["and", "or", "xor", "imp", "iff", "nand", "nor"]);
          g = randomB(rng, 3, 1, ["and", "or", "xor", "imp", "iff"]);
          common = missingClasses([vecOf(f, 3), vecOf(g, 3)], 3);
        } while (!usesAll(f, 2) || (common.length === 0) !== value || !vecOf(f, 3).includes(0) || !vecOf(f, 3).includes(1));
        const fTexs = `f(x, y) = ${btex(f)}`;
        const gTexs = `g(${argsTex(3)}) = ${btex(g)}`;
        return oneOf(
          rng,
          t(
            `Is the set $\\{f, g\\}$ functionally complete, where $${fTexs}$ and $${gTexs}$?`,
            `设 $${fTexs}$，$${gTexs}$。集合 $\\{f, g\\}$ 函数完备吗？`,
          ),
          yesNo[value ? 0 : 1]!,
          [yesNo[value ? 1 : 0]!],
          value
            ? t(
                "Yes: for each of $T_0, T_1, S, M, L$, one of $f$ and $g$ lies outside it.",
                "是：对 $T_0, T_1, S, M, L$ 中的每一个，$f$ 与 $g$ 中都有一个不在其中。",
              )
            : t(
                `No: both $f$ and $g$ lie in $${classTex[common[0]!]}$ (both ${classText[common[0]!].en}).`,
                `不是：$f$ 与 $g$ 都属于 $${classTex[common[0]!]}$（都${classText[common[0]!]["zh-CN"]}）。`,
              ),
        );
      },
    },
  ],
};

/** gateName is the circuit name of an operation. */
const gateName: Record<BinOp | "not", string> = {
  and: "AND",
  or: "OR",
  xor: "XOR",
  nand: "NAND",
  nor: "NOR",
  imp: "IMP",
  iff: "XNOR",
  not: "NOT",
};

/** circuitOf lists gates g₁, g₂, … computing an expression, the last gate being the output. */
function circuitOf(e: BExpr): { lines: string[]; out: string } {
  const lines: string[] = [];
  const walk = (g: BExpr): string => {
    if (g.k === "var") return VARS[g.i]!;
    if (g.k === "const") return `${g.v}`;
    const args = g.k === "not" ? [walk(g.a)] : [walk(g.a), walk(g.b)];
    lines.push(`g_{${lines.length + 1}} = \\mathrm{${gateName[g.k]}}(${args.join(", ")})`);
    return `g_{${lines.length}}`;
  };
  return { lines, out: walk(e) };
}

/** circuitText describes a circuit gate by gate. */
const circuitText = (e: BExpr) => {
  const { lines, out } = circuitOf(e);
  return {
    en: `${lines.map((l) => `$${l}$`).join(", ")}, with output $${out}$`,
    zh: `${lines.map((l) => `$${l}$`).join("，")}，输出为 $${out}$`,
  };
};

/** introductionToLogicCircuits models circuits of gates as Boolean expressions. */
export const introductionToLogicCircuits: TopicDef = {
  id: "introduction-to-logic-circuits",
  title: t("Introduction to Logic Circuits", "逻辑电路入门"),
  summary: t(
    "A logic circuit feeds input bits through gates: AND, OR and NOT compute ∧, ∨ and ¬, and the circuit as a whole computes a Boolean function of its inputs.",
    "逻辑电路让输入比特经过各个门：与门、或门、非门分别计算 ∧、∨、¬，整个电路计算的是输入的一个布尔函数。",
  ),
  prerequisites: ["boolean-functions-and-logical-operations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "tracing-a-circuit",
      title: t("Tracing a circuit", "追踪电路"),
      explanation: t(
        "With $g_1 = \\mathrm{AND}(x, y)$, $g_2 = \\mathrm{NOT}(z)$, $g_3 = \\mathrm{OR}(g_1, g_2)$ and inputs $x = 1, y = 0, z = 0$: $g_1 = 0$, $g_2 = 1$, so the output is $g_3 = 1$.",
        "设 $g_1 = \\mathrm{AND}(x, y)$，$g_2 = \\mathrm{NOT}(z)$，$g_3 = \\mathrm{OR}(g_1, g_2)$，输入 $x = 1, y = 0, z = 0$：$g_1 = 0$，$g_2 = 1$，所以输出 $g_3 = 1$。",
      ),
      generate(rng) {
        const e = formula3(rng, ["and", "or"], 3);
        const x = bits(rng.int(0, 7), 3);
        const c = circuitText(e);
        const value = beval(e, x);
        return numberProblem({
          prompt: t(
            `A circuit has gates ${c.en}. What is the output when $x = ${x[0]}$, $y = ${x[1]}$, $z = ${x[2]}$?`,
            `某电路的门为 ${c.zh}。当 $x = ${x[0]}$，$y = ${x[1]}$，$z = ${x[2]}$ 时输出是多少？`,
          ),
          answer: value,
          wrong: [1 - value],
          solution: t(
            `The circuit computes $${btex(e)}$; gate by gate: ${steps(e, x)}.`,
            `电路计算的是 $${btex(e)}$；逐个门计算：${steps(e, x)}。`,
          ),
        });
      },
    },
    {
      id: "the-expression-of-a-circuit",
      title: t("The expression of a circuit", "电路的表达式"),
      explanation: t(
        "Replace each gate by its operation, working forward: $g_1 = \\mathrm{OR}(x, y)$, $g_2 = \\mathrm{NOT}(g_1)$, $g_3 = \\mathrm{AND}(g_2, z)$ computes $\\neg (x \\vee y) \\wedge z$.",
        "从前往后把每个门换成对应的运算：$g_1 = \\mathrm{OR}(x, y)$，$g_2 = \\mathrm{NOT}(g_1)$，$g_3 = \\mathrm{AND}(g_2, z)$ 计算的是 $\\neg (x \\vee y) \\wedge z$。",
      ),
      generate(rng) {
        const e = formula3(rng, ["and", "or"], 3);
        const vec = vecOf(e, 3);
        const c = circuitText(e);
        const wrong = range(0, 8)
          .map(() => formula3(rng, ["and", "or"], 2))
          .filter((w) => !sameVec(vecOf(w, 3), vec));
        const swap = (g: BExpr): BExpr =>
          g.k === "var" || g.k === "const" ? g : g.k === "not" ? bnot(swap(g.a)) : bin(g.k === "and" ? "or" : "and", swap(g.a), swap(g.b));
        return oneOf(
          rng,
          t(`Which expression does the circuit ${c.en} compute?`, `电路 ${c.zh} 计算的是哪个表达式？`),
          bmath(e),
          [swap(e), ...wrong].filter((w) => !sameVec(vecOf(w, 3), vec)).map(bmath),
          t(`Substitute each gate into the next: the output is $${btex(e)}$.`, `把每个门依次代入下一个门：输出为 $${btex(e)}$。`),
        );
      },
    },
  ],
};

/** logicGatesAndCombinationalCircuits uses XOR, NAND and NOR gates and builds adders. */
export const logicGatesAndCombinationalCircuits: TopicDef = {
  id: "logic-gates-and-combinational-circuits",
  title: t("Logic Gates and Combinational Circuits", "逻辑门与组合电路"),
  summary: t(
    "XOR, NAND and NOR gates compute ⊕, ↑ and ↓. Combinational circuits such as the half adder (sum a ⊕ b, carry a ∧ b) and the full adder add binary numbers bit by bit.",
    "异或门、与非门、或非门分别计算 ⊕、↑、↓。半加器（和 a ⊕ b，进位 a ∧ b）与全加器等组合电路可以逐位相加二进制数。",
  ),
  prerequisites: ["introduction-to-logic-circuits"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "tracing-circuits-with-xor-nand-and-nor",
      title: t("Circuits with XOR, NAND and NOR", "含异或门、与非门、或非门的电路"),
      explanation: t(
        "With $g_1 = \\mathrm{NAND}(x, y)$, $g_2 = \\mathrm{XOR}(g_1, z)$ and $x = y = z = 1$: $g_1 = 0$, so the output is $g_2 = 0 \\oplus 1 = 1$.",
        "设 $g_1 = \\mathrm{NAND}(x, y)$，$g_2 = \\mathrm{XOR}(g_1, z)$，$x = y = z = 1$：$g_1 = 0$，所以输出 $g_2 = 0 \\oplus 1 = 1$。",
      ),
      generate(rng) {
        let e: BExpr;
        do e = formula3(rng, ["xor", "nand", "nor", "and", "or"], 3);
        while (!/oplus|uparrow|downarrow/.test(btex(e)));
        const x = bits(rng.int(0, 7), 3);
        const c = circuitText(e);
        const value = beval(e, x);
        return numberProblem({
          prompt: t(
            `A circuit has gates ${c.en}. What is the output when $x = ${x[0]}$, $y = ${x[1]}$, $z = ${x[2]}$?`,
            `某电路的门为 ${c.zh}。当 $x = ${x[0]}$，$y = ${x[1]}$，$z = ${x[2]}$ 时输出是多少？`,
          ),
          answer: value,
          wrong: [1 - value],
          solution: t(
            `The circuit computes $${btex(e)}$; gate by gate: ${steps(e, x)}.`,
            `电路计算的是 $${btex(e)}$；逐个门计算：${steps(e, x)}。`,
          ),
        });
      },
    },
    {
      id: "ripple-carry-adders",
      title: t("Adders", "加法器"),
      explanation: t(
        "A full adder takes bits $a, b$ and a carry-in $c$; its sum is $a \\oplus b \\oplus c$ and its carry-out is $(a \\wedge b) \\vee (c \\wedge (a \\oplus b))$, which is $1$ when at least two inputs are $1$. Chaining full adders from the rightmost bit adds binary numbers: in $0111 + 0101$, the carries into positions $1, 2, 3$ are $1, 1, 1$.",
        "全加器输入比特 $a, b$ 和进位 $c$；和为 $a \\oplus b \\oplus c$，进位输出为 $(a \\wedge b) \\vee (c \\wedge (a \\oplus b))$，即至少两个输入为 $1$ 时为 $1$。从最右边一位开始串联全加器就能相加二进制数：在 $0111 + 0101$ 中，进入第 $1, 2, 3$ 位的进位都是 $1$。",
      ),
      generate(rng) {
        const w = rng.int(3, 5);
        const a = rng.int(1, 2 ** w - 1);
        const b = rng.int(1, 2 ** w - 1);
        const k = rng.int(1, w);
        const askSum = rng.bool() && k < w;
        const carry = (j: number) => ((a % 2 ** j) + (b % 2 ** j)) >> j;
        const sumBit = ((a + b) >> k) & 1;
        const value = askSum ? sumBit : carry(k);
        const bin = (v: number) => v.toString(2).padStart(w, "0");
        return numberProblem({
          prompt: askSum
            ? t(
                `A ripple-carry adder adds $${bin(a)}_2 + ${bin(b)}_2$. Numbering bit positions from $0$ at the right, what is the sum bit in position $${k}$?`,
                `一个行波进位加法器计算 $${bin(a)}_2 + ${bin(b)}_2$。从右往左从 $0$ 开始给位编号，第 $${k}$ 位的和是多少？`,
              )
            : t(
                `A ripple-carry adder adds $${bin(a)}_2 + ${bin(b)}_2$. Numbering bit positions from $0$ at the right, what is the carry into position $${k}$?`,
                `一个行波进位加法器计算 $${bin(a)}_2 + ${bin(b)}_2$。从右往左从 $0$ 开始给位编号，进入第 $${k}$ 位的进位是多少？`,
              ),
          answer: value,
          wrong: [1 - value],
          solution: t(
            `$${bin(a)}_2 + ${bin(b)}_2 = ${(a + b).toString(2)}_2$. Adding the bits below position $${k}$ gives carry $${carry(k)}$${askSum ? `, and position $${k}$ holds $${(a >> k) & 1} \\oplus ${(b >> k) & 1} \\oplus ${carry(k)} = ${sumBit}$` : ""}.`,
            `$${bin(a)}_2 + ${bin(b)}_2 = ${(a + b).toString(2)}_2$。第 $${k}$ 位以下各位相加产生进位 $${carry(k)}$${askSum ? `，第 $${k}$ 位为 $${(a >> k) & 1} \\oplus ${(b >> k) & 1} \\oplus ${carry(k)} = ${sumBit}$` : ""}。`,
          ),
        });
      },
    },
  ],
};

/** singleGates are circuits that one gate can replace, with the gate's operation. */
const singleGates: readonly [BExpr, BinOp | "wire"][] = [
  [bor(band(X, bnot(Y)), band(bnot(X), Y)), "xor"],
  [band(bor(X, Y), bnot(band(X, Y))), "xor"],
  [bor(bnot(X), bnot(Y)), "nand"],
  [bnot(band(X, Y)), "nand"],
  [band(bnot(X), bnot(Y)), "nor"],
  [bnot(bor(X, Y)), "nor"],
  [bnot(bor(bnot(X), bnot(Y))), "and"],
  [bnot(band(bnot(X), bnot(Y))), "or"],
  [bor(band(X, Y), band(bnot(X), bnot(Y))), "iff"],
  [bor(X, band(X, Y)), "wire"],
  [band(X, bor(X, Y)), "wire"],
  [bor(band(X, Y), band(X, bnot(Y))), "wire"],
  [bor(band(X, Y), X, band(Y, X)), "wire"],
];

/** simplifyingLogicCircuits replaces circuits by equivalent smaller ones. */
export const simplifyingLogicCircuits: TopicDef = {
  id: "simplifying-logic-circuits",
  title: t("Simplifying Logic Circuits", "化简逻辑电路"),
  summary: t(
    "Write the circuit's expression, simplify it with the laws of Boolean algebra or a Karnaugh map, and build the smaller equivalent circuit.",
    "写出电路的表达式，用布尔代数定律或卡诺图化简，再搭建等价的更小电路。",
  ),
  prerequisites: ["logic-gates-and-combinational-circuits", "simplifying-logical-expressions-using-karnaugh-maps"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "replacing-a-circuit-by-one-gate",
      title: t("Replacing a circuit by one gate", "用一个门替换电路"),
      explanation: t(
        "$(x \\wedge \\neg y) \\vee (\\neg x \\wedge y)$ uses five gates but equals $x \\oplus y$, a single XOR gate. By absorption, $x \\vee (x \\wedge y) = x$ needs no gate at all: a wire from $x$.",
        "$(x \\wedge \\neg y) \\vee (\\neg x \\wedge y)$ 用了五个门，却等于 $x \\oplus y$，一个异或门即可。由吸收律，$x \\vee (x \\wedge y) = x$ 完全不需要门：从 $x$ 引一根导线即可。",
      ),
      generate(rng) {
        const [tmpl, gate] = rng.pick(singleGates);
        const pair = rng.pick([...PAIRS, [2, 0] as const, [2, 1] as const]);
        const e = pairOf(tmpl, pair);
        const c = circuitText(e);
        const [p, q] = [VARS[pair[0]]!, VARS[pair[1]]!];
        const name = (g: BinOp | "wire") =>
          g === "wire"
            ? t(`A wire from $${p}$ (no gate)`, `从 $${p}$ 引出的导线（不需要门）`)
            : t(`One ${gateName[g]} gate`, `一个 ${gateName[g]} 门`);
        const all: (BinOp | "wire")[] = ["xor", "nand", "nor", "and", "or", "iff", "wire"];
        return oneOf(
          rng,
          t(`The circuit ${c.en} computes $${btex(e)}$. What can replace it?`, `电路 ${c.zh} 计算的是 $${btex(e)}$。可以用什么替换它？`),
          name(gate),
          rng
            .shuffle(all.filter((g) => g !== gate))
            .slice(0, 3)
            .map(name),
          gate === "wire"
            ? t(`By absorption, $${btex(e)} = ${p}$.`, `由吸收律，$${btex(e)} = ${p}$。`)
            : t(
                `$${btex(e)} = ${p} ${opTex[gate]} ${q}$, the ${gateName[gate]} gate.`,
                `$${btex(e)} = ${p} ${opTex[gate]} ${q}$，即 ${gateName[gate]} 门。`,
              ),
        );
      },
    },
    {
      id: "simplifying-a-circuit",
      title: t("Simplifying a circuit", "化简电路"),
      explanation: t(
        "The circuit for $(x \\wedge y) \\vee (x \\wedge \\neg y \\wedge z) \\vee (\\neg x \\wedge y \\wedge z)$ has value vector $0001\\,0111$, whose Karnaugh map groups into $(x \\wedge y) \\vee (x \\wedge z) \\vee (y \\wedge z)$: fewer, smaller gates.",
        "$(x \\wedge y) \\vee (x \\wedge \\neg y \\wedge z) \\vee (\\neg x \\wedge y \\wedge z)$ 对应电路的值向量是 $0001\\,0111$，其卡诺图合并为 $(x \\wedge y) \\vee (x \\wedge z) \\vee (y \\wedge z)$：门更少、更小。",
      ),
      generate(rng) {
        let e: BExpr;
        let vec: number[];
        let cover: Cube[];
        do {
          e = formula3(rng, ["and", "or"], 3);
          vec = vecOf(e, 3);
          cover = minimalDnf(vec, 3);
        } while (btex(cubesExpr(cover)).length >= btex(e).length);
        const right = cubesExpr(cover);
        const wrong = range(0, 6).flatMap(() => {
          const v2 = [...vec];
          const r = rng.int(0, 7);
          v2[r] = 1 - v2[r]!;
          return v2.includes(1) && v2.includes(0) ? [cubesExpr(minimalDnf(v2, 3))] : [];
        });
        const c = circuitText(e);
        return oneOf(
          rng,
          t(`Which simpler expression is equivalent to the circuit ${c.en}?`, `哪个更简单的表达式与电路 ${c.zh} 等价？`),
          bmath(right),
          wrong.filter((w) => !sameVec(vecOf(w, 3), vec)).map(bmath),
          t(
            `The circuit computes $${btex(e)}$, with value vector $${vecTex(vec)}$; a Karnaugh map gives $${btex(right)}$.`,
            `电路计算的是 $${btex(e)}$，值向量为 $${vecTex(vec)}$；用卡诺图得到 $${btex(right)}$。`,
          ),
        );
      },
    },
  ],
};

/** discreteMathematicsBooleanTopics are the new topics of Discrete Mathematics unit 1. */
export const discreteMathematicsBooleanTopics: readonly TopicDef[] = [
  booleanFunctions,
  booleanFunctionsAndLogicalOperations,
  disjunctiveNormalForms,
  principalDisjunctiveNormalForms,
  conjunctiveNormalForms,
  principalConjunctiveNormalForms,
  booleanPolynomials,
  simplifyingLogicalExpressionsUsingKarnaughMaps,
  truthPreservingBooleanFunctions,
  selfDualBooleanFunctions,
  monotonicBooleanFunctions,
  affineBooleanFunctions,
  functionallyCompleteSets,
  postsFunctionalCompletenessTheorem,
  introductionToLogicCircuits,
  logicGatesAndCombinationalCircuits,
  simplifyingLogicCircuits,
];
