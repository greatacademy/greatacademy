import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem } from "../problems.ts";
import { oneOf } from "./calculus-common.ts";

// Methods of Proof unit 1, modules 1.1–1.2: statements, connectives, implications and biconditionals.

/** Var is a propositional variable. */
export type Var = "p" | "q" | "r" | "s";

/** Formula is a formula of propositional logic. */
export type Formula =
  | { readonly k: "var"; readonly v: Var }
  | { readonly k: "not"; readonly a: Formula }
  | { readonly k: "and" | "or" | "imp" | "iff"; readonly a: Formula; readonly b: Formula };

/** v builds a variable. */
export const v = (name: Var): Formula => ({ k: "var", v: name });
/** not builds a negation. */
export const not = (a: Formula): Formula => ({ k: "not", a });
/** and builds a conjunction. */
export const and = (a: Formula, b: Formula): Formula => ({ k: "and", a, b });
/** or builds a disjunction. */
export const or = (a: Formula, b: Formula): Formula => ({ k: "or", a, b });
/** imp builds an implication. */
export const imp = (a: Formula, b: Formula): Formula => ({ k: "imp", a, b });
/** iff builds a biconditional. */
export const iff = (a: Formula, b: Formula): Formula => ({ k: "iff", a, b });

/** symbols are the LaTeX symbols of the binary connectives. */
const symbols = { and: "\\wedge", or: "\\vee", imp: "\\Rightarrow", iff: "\\Leftrightarrow" } as const;

/** tex writes a formula in LaTeX, parenthesizing every compound operand. */
export function tex(f: Formula): string {
  const inner = (g: Formula) => (g.k === "var" || g.k === "not" ? tex(g) : `(${tex(g)})`);
  if (f.k === "var") return f.v;
  if (f.k === "not") return `\\neg ${inner(f.a)}`;
  return `${inner(f.a)} ${symbols[f.k]} ${inner(f.b)}`;
}

/** Env assigns truth values to the variables. */
export type Env = Readonly<Record<Var, boolean>>;

/** evaluate computes the truth value of a formula. */
export function evaluate(f: Formula, env: Env): boolean {
  switch (f.k) {
    case "var":
      return env[f.v];
    case "not":
      return !evaluate(f.a, env);
    case "and":
      return evaluate(f.a, env) && evaluate(f.b, env);
    case "or":
      return evaluate(f.a, env) || evaluate(f.b, env);
    case "imp":
      return !evaluate(f.a, env) || evaluate(f.b, env);
    case "iff":
      return evaluate(f.a, env) === evaluate(f.b, env);
  }
}

/** varsOf lists the variables of formulas in alphabetical order. */
export function varsOf(...fs: readonly Formula[]): Var[] {
  const found = new Set<Var>();
  const walk = (f: Formula) => {
    if (f.k === "var") found.add(f.v);
    else if (f.k === "not") walk(f.a);
    else {
      walk(f.a);
      walk(f.b);
    }
  };
  for (const f of fs) walk(f);
  return (["p", "q", "r", "s"] as const).filter((x) => found.has(x));
}

/** rows lists every assignment of the given variables, starting with all true as in a standard truth table. */
export function rows(vars: readonly Var[]): Env[] {
  const out: Env[] = [];
  for (let i = 0; i < 2 ** vars.length; i++) {
    const env: Record<Var, boolean> = { p: false, q: false, r: false, s: false };
    vars.forEach((x, j) => {
      env[x] = ((i >> (vars.length - 1 - j)) & 1) === 0;
    });
    out.push(env);
  }
  return out;
}

/** equivalent tells whether two formulas agree on every row. */
export function equivalent(f: Formula, g: Formula): boolean {
  return rows(varsOf(f, g)).every((env) => evaluate(f, env) === evaluate(g, env));
}

/** Kind classifies a formula. */
export type Kind = "tautology" | "contradiction" | "contingency";

/** kindOf classifies a formula by its truth table. */
export function kindOf(f: Formula): Kind {
  const values = rows(varsOf(f)).map((env) => evaluate(f, env));
  return values.every(Boolean) ? "tautology" : values.some(Boolean) ? "contingency" : "contradiction";
}

/** randomFormula builds a random formula of the given depth using the given connectives. */
export function randomFormula(
  rng: Rng,
  depth: number,
  vars: readonly Var[] = ["p", "q"],
  ops: readonly ("and" | "or" | "imp" | "iff")[] = ["and", "or"],
): Formula {
  if (depth === 0) return rng.int(0, 3) === 0 ? not(v(rng.pick(vars))) : v(rng.pick(vars));
  if (rng.int(0, 4) === 0) return not(randomFormula(rng, depth - 1, vars, ops));
  const k = rng.pick(ops);
  const a = randomFormula(rng, depth - 1, vars, ops);
  for (;;) {
    const b = randomFormula(rng, rng.int(0, depth - 1), vars, ops);
    // Skip operands that share their only variable, such as p and \neg p, which make degenerate statements.
    const [va, vb] = [varsOf(a), varsOf(b)];
    if (va.length === 1 && vb.length === 1 && va[0] === vb[0]) continue;
    if (tex(a) === tex(b)) continue;
    return { k, a, b };
  }
}

/** mutations are small edits a learner might make, used as distractors. */
export function mutations(f: Formula): Formula[] {
  const out: Formula[] = [];
  if (f.k === "not") {
    out.push(f.a);
    for (const m of mutations(f.a)) out.push(not(m));
  } else if (f.k === "var") {
    out.push(not(f));
  } else {
    if (f.k === "and") out.push(or(f.a, f.b));
    if (f.k === "or") out.push(and(f.a, f.b));
    if (f.k === "imp") out.push(imp(f.b, f.a), and(f.a, f.b));
    if (f.k === "iff") out.push(imp(f.a, f.b));
    for (const m of mutations(f.a)) out.push({ ...f, a: m });
    for (const m of mutations(f.b)) out.push({ ...f, b: m });
    out.push(not(f));
  }
  return out;
}

/** inequivalentTo picks up to three distractors, none equivalent to the target, with distinct text. */
export function inequivalentTo(rng: Rng, target: Formula, candidates: readonly Formula[]): Formula[] {
  const seen = new Set([tex(target)]);
  const out: Formula[] = [];
  for (const c of rng.shuffle(candidates)) {
    const s = tex(c);
    if (seen.has(s) || equivalent(c, target)) continue;
    seen.add(s);
    out.push(c);
    if (out.length === 3) break;
  }
  return out;
}

/** math wraps a formula as an option. */
export const math = (f: Formula): Text => t(`$${tex(f)}$`, `$${tex(f)}$`);

/** truthValues are the answers True and False. */
export const truthValues = [t("True", "真"), t("False", "假")] as const;

/** truthOption picks the option for a truth value. */
export const truthOption = (b: boolean) => truthValues[b ? 0 : 1];

/** TF writes a truth value as T or F. */
export const TF = (b: boolean) => (b ? "T" : "F");

/** envText writes an assignment such as "p is true, q is false". */
export function envText(env: Env, vars: readonly Var[]): Text {
  return t(
    vars.map((x) => `$${x}$ is ${env[x] ? "true" : "false"}`).join(", "),
    vars.map((x) => `$${x}$ 为${env[x] ? "真" : "假"}`).join("，"),
  );
}

/** evaluationSteps evaluates the subformulas of f from the inside out. */
export function evaluationSteps(f: Formula, env: Env): string {
  const out: string[] = [];
  const walk = (g: Formula) => {
    if (g.k === "var") return;
    if (g.k === "not") walk(g.a);
    else {
      walk(g.a);
      walk(g.b);
    }
    const s = `${tex(g)} \\text{ is } ${TF(evaluate(g, env))}`;
    if (!out.includes(s)) out.push(s);
  };
  walk(f);
  return out.map((s) => `$${s}$`).join(", ");
}

/** evaluateProblem asks for the truth value of a formula under an assignment. */
export function evaluateProblem(rng: Rng, f: Formula): Problem {
  const vars = varsOf(f);
  const env = rng.pick(rows(vars));
  const value = evaluate(f, env);
  const given = envText(env, vars);
  return oneOf(
    rng,
    t(`Suppose ${given.en}. Is $${tex(f)}$ true or false?`, `设${given["zh-CN"]}。$${tex(f)}$ 是真还是假？`),
    truthOption(value),
    [truthOption(!value)],
    t(
      `Work from the inside out: ${evaluationSteps(f, env)}. So the statement is ${value ? "true" : "false"}.`,
      `由内向外计算：${evaluationSteps(f, env)}。所以该命题为${value ? "真" : "假"}。`,
    ),
  );
}

/** equivalentChoice asks which option is equivalent to f; right is the intended rewrite. */
export function equivalentChoice(rng: Rng, f: Formula, right: Formula, why: Text): Problem {
  const wrong = inequivalentTo(rng, f, [...mutations(right), ...mutations(f)]);
  return oneOf(
    rng,
    t(`Which statement is logically equivalent to $${tex(f)}$?`, `哪个命题与 $${tex(f)}$ 逻辑等价？`),
    math(right),
    wrong.map(math),
    why,
  );
}

/** Atom is a concrete mathematical statement with its truth value and negation. */
export interface Atom {
  readonly text: Text;
  readonly negation: Text;
  readonly value: boolean;
}

/** isPrime tests primality of small integers. */
export const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};

/** atom picks a concrete statement about small integers. */
export function atom(rng: Rng): Atom {
  const kind = rng.int(0, 3);
  if (kind === 0) {
    const n = rng.int(2, 40);
    const even = n % 2 === 0;
    return {
      text: t(`$${n}$ is even`, `$${n}$ 是偶数`),
      negation: t(`$${n}$ is not even`, `$${n}$ 不是偶数`),
      value: even,
    };
  }
  if (kind === 1) {
    const n = rng.int(2, 50);
    return {
      text: t(`$${n}$ is prime`, `$${n}$ 是质数`),
      negation: t(`$${n}$ is not prime`, `$${n}$ 不是质数`),
      value: isPrime(n),
    };
  }
  if (kind === 2) {
    const a = rng.int(-9, 20);
    const b = rng.int(-9, 20);
    return { text: t(`$${a} > ${b}$`, `$${a} > ${b}$`), negation: t(`$${a} \\le ${b}$`, `$${a} \\le ${b}$`), value: a > b };
  }
  const d = rng.int(2, 9);
  const n = rng.int(10, 60);
  return {
    text: t(`$${d}$ divides $${n}$`, `$${d}$ 整除 $${n}$`),
    negation: t(`$${d}$ does not divide $${n}$`, `$${d}$ 不整除 $${n}$`),
    value: n % d === 0,
  };
}

/** twoAtoms picks two statements with different text. */
export function twoAtoms(rng: Rng): [Atom, Atom] {
  for (;;) {
    const a = atom(rng);
    const b = atom(rng);
    if (a.text.en !== b.text.en) return [a, b];
  }
}

/** theAndAndOrConnectives combines statements with "and" and "or". */
export const theAndAndOrConnectives: TopicDef = {
  id: "the-and-and-or-connectives",
  title: t("The AND and OR Connectives", "“且”与“或”联结词"),
  summary: t(
    "p ∧ q is true exactly when both parts are true; p ∨ q is true when at least one part is true.",
    "p ∧ q 当且仅当两部分都为真时为真；p ∨ q 只要至少一部分为真就为真。",
  ),
  prerequisites: ["statements-and-predicates"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "truth-values-of-conjunctions-and-disjunctions",
      title: t("Truth values of compound statements", "复合命题的真假"),
      explanation: t(
        'The **conjunction** $p \\wedge q$ ("$p$ and $q$") is true only when both $p$ and $q$ are true. The **disjunction** $p \\vee q$ ("$p$ or $q$") is true when at least one of them is true; in mathematics "or" is inclusive. So "$7$ is prime and $4 > 9$" is false, while "$7$ is prime or $4 > 9$" is true.',
        "**合取** $p \\wedge q$（“$p$ 且 $q$”）只有在 $p$ 与 $q$ 都为真时才为真。**析取** $p \\vee q$（“$p$ 或 $q$”）只要其中至少一个为真就为真；数学中的“或”是相容的。所以“$7$ 是质数且 $4 > 9$”为假，而“$7$ 是质数或 $4 > 9$”为真。",
      ),
      generate(rng) {
        const [a, b] = twoAtoms(rng);
        const isAnd = rng.bool();
        const value = isAnd ? a.value && b.value : a.value || b.value;
        const en = `${a.text.en} ${isAnd ? "and" : "or"} ${b.text.en}`;
        const zh = `${a.text["zh-CN"]} ${isAnd ? "且" : "或"} ${b.text["zh-CN"]}`;
        return oneOf(
          rng,
          t(`Is the statement "${en}" true or false?`, `命题“${zh}”是真还是假？`),
          truthOption(value),
          [truthOption(!value)],
          t(
            `"${a.text.en}" is ${a.value ? "true" : "false"} and "${b.text.en}" is ${b.value ? "true" : "false"}. ${isAnd ? "A conjunction needs both parts true" : "A disjunction needs at least one part true"}, so the statement is ${value ? "true" : "false"}.`,
            `“${a.text["zh-CN"]}”为${a.value ? "真" : "假"}，“${b.text["zh-CN"]}”为${b.value ? "真" : "假"}。${isAnd ? "合取需要两部分都为真" : "析取只需至少一部分为真"}，所以该命题为${value ? "真" : "假"}。`,
          ),
        );
      },
    },
    {
      id: "evaluating-formulas-with-and-and-or",
      title: t("Evaluating formulas", "计算公式的真假"),
      explanation: t(
        "To evaluate a formula built from $\\wedge$ and $\\vee$, evaluate the innermost parentheses first. If $p$ is true, $q$ is false and $r$ is true, then $p \\wedge q$ is false, so $(p \\wedge q) \\vee r$ is true.",
        "计算由 $\\wedge$ 和 $\\vee$ 构成的公式时，先计算最里层的括号。若 $p$ 为真、$q$ 为假、$r$ 为真，则 $p \\wedge q$ 为假，所以 $(p \\wedge q) \\vee r$ 为真。",
      ),
      generate(rng) {
        for (;;) {
          const f = randomFormula(rng, 2, ["p", "q", "r"], ["and", "or"]);
          if (f.k !== "var" && f.k !== "not" && varsOf(f).length >= 2) return evaluateProblem(rng, f);
        }
      },
    },
  ],
};

/** truthTables builds truth tables of compound statements. */
export const truthTables: TopicDef = {
  id: "truth-tables",
  title: t("Truth Tables", "真值表"),
  summary: t(
    "A truth table lists the value of a statement for each of the 2ⁿ assignments of its n variables.",
    "真值表列出一个命题在其 n 个变量的全部 2ⁿ 种取值下的真假。",
  ),
  prerequisites: ["the-and-and-or-connectives"],
  encompasses: [{ topic: "the-and-and-or-connectives", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "counting-true-rows",
      title: t("Counting true rows", "数出为真的行"),
      explanation: t(
        "A truth table has one row for each combination of truth values: $2^{n}$ rows for $n$ variables. Add a column for each subformula, working outward. For $p \\vee (q \\wedge r)$, there are $8$ rows, and the statement is true in $5$ of them: the $4$ rows where $p$ is true, plus the row where $p$ is false and $q$, $r$ are both true.",
        "真值表为每一种真值组合列一行：$n$ 个变量共 $2^{n}$ 行。由内向外为每个子公式加一列。对 $p \\vee (q \\wedge r)$，共有 $8$ 行，其中 $5$ 行为真：$p$ 为真的 $4$ 行，加上 $p$ 为假而 $q$、$r$ 都为真的那一行。",
      ),
      generate(rng) {
        for (;;) {
          const vars: Var[] = rng.bool() ? ["p", "q"] : ["p", "q", "r"];
          const f = randomFormula(rng, 2, vars, ["and", "or"]);
          if (varsOf(f).length !== vars.length) continue;
          const table = rows(vars).map((env) => evaluate(f, env));
          const count = table.filter(Boolean).length;
          return numberProblem({
            prompt: t(
              `In the truth table of $${tex(f)}$, in how many rows is the statement true?`,
              `在 $${tex(f)}$ 的真值表中，该命题在多少行中为真？`,
            ),
            answer: count,
            wrong: [table.length - count, table.length, count + 1],
            solution: t(
              `The table has $${table.length}$ rows. Going down the rows (${vars.map((x) => `$${x}$`).join(", ")} from all true to all false), the statement's values are ${table.map(TF).join(", ")}, so it is true in $${count}$ rows.`,
              `真值表共 $${table.length}$ 行。按行（${vars.map((x) => `$${x}$`).join("、")} 从全真到全假）依次为 ${table.map(TF).join("、")}，所以该命题在 $${count}$ 行中为真。`,
            ),
          });
        }
      },
    },
    {
      id: "number-of-rows-in-a-truth-table",
      title: t("Rows of a truth table", "真值表的行数"),
      explanation: t(
        "Each variable doubles the number of combinations, so a statement in $n$ variables has a truth table with $2^{n}$ rows. A statement in $p$, $q$, $r$ and $s$ needs $16$ rows.",
        "每增加一个变量，组合数就翻倍，所以含 $n$ 个变量的命题的真值表有 $2^{n}$ 行。含 $p$、$q$、$r$、$s$ 的命题需要 $16$ 行。",
      ),
      generate(rng) {
        const letters = ["p", "q", "r", "s", "t", "u", "w"];
        const n = rng.int(1, 7);
        const used = letters.slice(0, n);
        const repeats = rng.int(0, 2);
        const op = rng.pick(["\\wedge", "\\vee"]);
        const terms = [...used, ...rng.shuffle(used).slice(0, repeats)];
        const expr = rng
          .shuffle(terms)
          .map((x, i) => (i === 0 ? x : `${op} ${rng.bool(0.3) ? `\\neg ${x}` : x}`))
          .join(" ");
        return numberProblem({
          prompt: t(`How many rows does the truth table of $${expr}$ have?`, `$${expr}$ 的真值表有多少行？`),
          answer: 2 ** n,
          wrong: [2 * n, terms.length, 2 ** terms.length, n ** 2],
          solution: t(
            `The statement uses $${n}$ distinct variable${n === 1 ? "" : "s"}, so its truth table has $2^{${n}} = ${2 ** n}$ rows.`,
            `该命题含 $${n}$ 个不同的变量，所以真值表有 $2^{${n}} = ${2 ** n}$ 行。`,
          ),
        });
      },
    },
  ],
};

/** theNotConnective negates statements. */
export const theNotConnective: TopicDef = {
  id: "the-not-connective",
  title: t("The NOT Connective", "“非”联结词"),
  summary: t("¬p has the opposite truth value of p.", "¬p 的真假与 p 相反。"),
  prerequisites: ["the-and-and-or-connectives"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "negating-a-statement",
      title: t("Negating a statement", "否定一个命题"),
      explanation: t(
        'The **negation** $\\neg p$ ("not $p$") is true exactly when $p$ is false. The negation of "$7 > 3$" is "$7 \\le 3$", not "$7 < 3$": the negation must be true in every case where the statement is false.',
        "**否定** $\\neg p$（“非 $p$”）恰在 $p$ 为假时为真。“$7 > 3$”的否定是“$7 \\le 3$”，而不是“$7 < 3$”：否定必须在原命题为假的每种情形下都为真。",
      ),
      generate(rng) {
        const a = rng.int(-9, 20);
        const b = rng.int(-9, 20);
        const ops = [
          ["<", "\\ge", ">", "\\le"],
          ["\\le", ">", "\\ge", "<"],
          [">", "\\le", "<", "\\ge"],
          ["\\ge", "<", "\\le", ">"],
          ["=", "\\ne", "<", ">"],
          ["\\ne", "=", "<", "\\le"],
        ] as const;
        const [op, neg, w1, w2] = rng.pick(ops);
        const s = (o: string) => t(`$${a} ${o} ${b}$`, `$${a} ${o} ${b}$`);
        return oneOf(
          rng,
          t(`Which statement is the negation of $${a} ${op} ${b}$?`, `哪个命题是 $${a} ${op} ${b}$ 的否定？`),
          s(neg),
          [s(w1), s(w2), s(op)],
          t(
            `The negation is true exactly when $${a} ${op} ${b}$ is false, which is $${a} ${neg} ${b}$.`,
            `否定恰在 $${a} ${op} ${b}$ 为假时为真，即 $${a} ${neg} ${b}$。`,
          ),
        );
      },
    },
    {
      id: "evaluating-formulas-with-negation",
      title: t("Evaluating formulas with negation", "含否定的公式求值"),
      explanation: t(
        "A $\\neg$ applies only to what immediately follows it. If $p$ is true and $q$ is false, then $\\neg p \\vee q$ is false, but $\\neg (p \\vee q)$ is also false and $\\neg p \\vee \\neg q$ is true.",
        "$\\neg$ 只作用于紧跟其后的部分。若 $p$ 为真、$q$ 为假，则 $\\neg p \\vee q$ 为假，$\\neg (p \\vee q)$ 也为假，而 $\\neg p \\vee \\neg q$ 为真。",
      ),
      generate(rng) {
        for (;;) {
          const f = randomFormula(rng, 2, ["p", "q", "r"], ["and", "or"]);
          if (tex(f).includes("\\neg") && varsOf(f).length >= 2) return evaluateProblem(rng, f);
        }
      },
    },
  ],
};

/** equivalenceSolution explains an equivalence check by listing both columns. */
function equivalenceSolution(f: Formula, g: Formula): Text {
  const vars = varsOf(f, g);
  const table = rows(vars);
  const cf = table.map((env) => TF(evaluate(f, env))).join(", ");
  const cg = table.map((env) => TF(evaluate(g, env))).join(", ");
  const same = cf === cg;
  return t(
    `Over the $${table.length}$ rows of the truth table, $${tex(f)}$ takes the values ${cf} and $${tex(g)}$ takes ${cg}. ${same ? "The columns match, so the statements are equivalent." : "The columns differ, so the statements are not equivalent."}`,
    `在真值表的 $${table.length}$ 行中，$${tex(f)}$ 的值为 ${cf}，$${tex(g)}$ 的值为 ${cg}。${same ? "两列相同，所以两命题等价。" : "两列不同，所以两命题不等价。"}`,
  );
}

/** logicalEquivalence compares statements with truth tables. */
export const logicalEquivalence: TopicDef = {
  id: "logical-equivalence",
  title: t("Logical Equivalence", "逻辑等价"),
  summary: t(
    "Two statements are logically equivalent, written ≡, when they have the same truth value in every row of the truth table.",
    "若两个命题在真值表的每一行中都真假相同，则它们逻辑等价，记作 ≡。",
  ),
  prerequisites: ["truth-tables", "the-not-connective"],
  encompasses: [{ topic: "truth-tables", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "checking-equivalence-with-a-truth-table",
      title: t("Checking equivalence", "检验等价"),
      explanation: t(
        "To decide whether $P \\equiv Q$, build both columns of the truth table. They are equivalent if the columns agree in every row; a single row where they differ shows they are not. For example $\\neg(p \\wedge \\neg q)$ and $\\neg p \\vee q$ agree in all four rows, so they are equivalent.",
        "要判断 $P \\equiv Q$ 是否成立，就在真值表中列出两列。若每一行都相同则等价；只要有一行不同，就不等价。例如 $\\neg(p \\wedge \\neg q)$ 与 $\\neg p \\vee q$ 在四行中都相同，所以它们等价。",
      ),
      generate(rng) {
        for (;;) {
          const f = randomFormula(rng, 2, ["p", "q"], ["and", "or"]);
          if (varsOf(f).length < 2) continue;
          const candidates = mutations(f);
          const g = rng.bool() ? deMorganRewrite(f) : rng.pick(candidates);
          if (tex(g) === tex(f)) continue;
          const same = equivalent(f, g);
          return oneOf(
            rng,
            t(`Are $${tex(f)}$ and $${tex(g)}$ logically equivalent?`, `$${tex(f)}$ 与 $${tex(g)}$ 逻辑等价吗？`),
            t(same ? "Yes" : "No", same ? "是" : "否"),
            [t(same ? "No" : "Yes", same ? "否" : "是")],
            equivalenceSolution(f, g),
          );
        }
      },
    },
    {
      id: "choosing-an-equivalent-statement",
      title: t("Choosing an equivalent statement", "选出等价的命题"),
      explanation: t(
        "Among several candidates, only those whose truth-table column matches the original are equivalent. Checking a single row where a candidate differs is enough to rule it out.",
        "在几个候选项中，只有真值表列与原命题相同的才等价。只要找到一行不同，就能排除该候选项。",
      ),
      generate(rng) {
        for (;;) {
          const f = randomFormula(rng, 2, ["p", "q"], ["and", "or"]);
          const g = deMorganRewrite(f);
          if (varsOf(f).length < 2 || tex(g) === tex(f)) continue;
          return equivalentChoice(rng, f, g, equivalenceSolution(f, g));
        }
      },
    },
  ],
};

/** deMorganRewrite rewrites a formula into an equivalent one by pushing negations in and double negations out. */
export function deMorganRewrite(f: Formula): Formula {
  const push = (g: Formula, negate: boolean): Formula => {
    if (g.k === "var") return negate ? not(g) : g;
    if (g.k === "not") return push(g.a, !negate);
    if (g.k === "and") return negate ? or(push(g.a, true), push(g.b, true)) : and(push(g.a, false), push(g.b, false));
    if (g.k === "or") return negate ? and(push(g.a, true), push(g.b, true)) : or(push(g.a, false), push(g.b, false));
    return negate ? not(g) : g;
  };
  const pushed = push(f, false);
  // When there is nothing to push, negate twice and push once, giving the De Morgan dual.
  return tex(pushed) === tex(f) ? not(push(f, true)) : pushed;
}

/** Law is a named equivalence with an example pair. */
interface Law {
  readonly name: Text;
  readonly make: (a: Formula, b: Formula, c: Formula) => [Formula, Formula];
}

/** literal picks a variable, possibly negated. */
const literal = (rng: Rng, x: Var) => (rng.int(0, 2) === 0 ? not(v(x)) : v(x));

/** threeLiterals picks literals for p, q and r in random order. */
const threeLiterals = (rng: Rng) =>
  rng
    .shuffle(["p", "q", "r", "s"] as const)
    .slice(0, 3)
    .map((x) => literal(rng, x)) as [Formula, Formula, Formula];

/** laws are the equivalence laws of this module, used to name a step. */
const laws: readonly Law[] = [
  { name: t("Commutative law", "交换律"), make: (a, b) => [and(a, b), and(b, a)] },
  { name: t("Commutative law", "交换律"), make: (a, b) => [or(a, b), or(b, a)] },
  { name: t("Associative law", "结合律"), make: (a, b, c) => [and(and(a, b), c), and(a, and(b, c))] },
  { name: t("Associative law", "结合律"), make: (a, b, c) => [or(a, or(b, c)), or(or(a, b), c)] },
  { name: t("Distributive law", "分配律"), make: (a, b, c) => [and(a, or(b, c)), or(and(a, b), and(a, c))] },
  { name: t("Distributive law", "分配律"), make: (a, b, c) => [or(a, and(b, c)), and(or(a, b), or(a, c))] },
  { name: t("Absorption law", "吸收律"), make: (a, b) => [or(a, and(a, b)), a] },
  { name: t("Absorption law", "吸收律"), make: (a, b) => [and(a, or(a, b)), a] },
  { name: t("De Morgan's law", "德摩根律"), make: (a, b) => [not(and(a, b)), or(not(a), not(b))] },
  { name: t("De Morgan's law", "德摩根律"), make: (a, b) => [not(or(a, b)), and(not(a), not(b))] },
];

/** lawNames are the distinct law names. */
const lawNames = [...new Map(laws.map((l) => [l.name.en, l.name])).values()];

/** nameTheLaw asks which law justifies an equivalence drawn from the given indices. */
function nameTheLaw(rng: Rng, indices: readonly number[]): Problem {
  const law = laws[rng.pick(indices)]!;
  const [a, b, c] = threeLiterals(rng);
  const [left, right] = law.make(a, b, c);
  const flip = rng.bool();
  const [x, y] = flip ? [right, left] : [left, right];
  return oneOf(
    rng,
    t(`Which law justifies $${tex(x)} \\equiv ${tex(y)}$?`, `哪条定律说明 $${tex(x)} \\equiv ${tex(y)}$？`),
    law.name,
    rng.shuffle(lawNames.filter((n) => n.en !== law.name.en)),
    t(`This is an instance of the ${law.name.en.toLowerCase()}.`, `这是${law.name["zh-CN"]}的一个实例。`),
  );
}

/** applyTheLaw asks for the result of applying a law to a formula. */
function applyTheLaw(rng: Rng, indices: readonly number[]): Problem {
  const law = laws[rng.pick(indices)]!;
  const [a, b, c] = threeLiterals(rng);
  const [left, right] = law.make(a, b, c);
  return equivalentChoice(
    rng,
    left,
    right,
    t(
      `By the ${law.name.en.toLowerCase()}, $${tex(left)} \\equiv ${tex(right)}$.`,
      `由${law.name["zh-CN"]}，$${tex(left)} \\equiv ${tex(right)}$。`,
    ),
  );
}

/** logicalAssociativeAndCommutativeLaws reorders and regroups conjunctions and disjunctions. */
export const logicalAssociativeAndCommutativeLaws: TopicDef = {
  id: "logical-associative-and-commutative-laws",
  title: t("Logical Associative and Commutative Laws", "逻辑的结合律与交换律"),
  summary: t(
    "∧ and ∨ are each commutative and associative, so their operands can be reordered and regrouped freely.",
    "∧ 与 ∨ 都满足交换律和结合律，所以它们的运算对象可以任意交换次序和重新分组。",
  ),
  prerequisites: ["logical-equivalence"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "naming-associative-and-commutative-laws",
      title: t("Naming the law", "说出定律"),
      explanation: t(
        "**Commutative laws:** $p \\wedge q \\equiv q \\wedge p$ and $p \\vee q \\equiv q \\vee p$. **Associative laws:** $(p \\wedge q) \\wedge r \\equiv p \\wedge (q \\wedge r)$ and $(p \\vee q) \\vee r \\equiv p \\vee (q \\vee r)$. Each can be checked with a truth table. Reordering is commutativity; regrouping is associativity.",
        "**交换律：**$p \\wedge q \\equiv q \\wedge p$，$p \\vee q \\equiv q \\vee p$。**结合律：**$(p \\wedge q) \\wedge r \\equiv p \\wedge (q \\wedge r)$，$(p \\vee q) \\vee r \\equiv p \\vee (q \\vee r)$。每条都可以用真值表验证。交换次序是交换律，重新分组是结合律。",
      ),
      generate: (rng) => nameTheLaw(rng, [0, 1, 2, 3]),
    },
    {
      id: "applying-associative-and-commutative-laws",
      title: t("Applying the laws", "应用定律"),
      explanation: t(
        "The laws apply only within one connective: $(p \\wedge q) \\vee r$ cannot be regrouped as $p \\wedge (q \\vee r)$, because the connectives differ.",
        "这些定律只适用于同一种联结词：$(p \\wedge q) \\vee r$ 不能重新分组为 $p \\wedge (q \\vee r)$，因为联结词不同。",
      ),
      generate: (rng) => applyTheLaw(rng, [0, 1, 2, 3]),
    },
  ],
};

/** theDistributiveLaws distributes ∧ over ∨ and ∨ over ∧. */
export const theDistributiveLaws: TopicDef = {
  id: "the-distributive-laws",
  title: t("The Distributive Laws", "分配律"),
  summary: t(
    "p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r) and p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r).",
    "p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)，p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)。",
  ),
  prerequisites: ["logical-associative-and-commutative-laws"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "distributing-a-connective",
      title: t("Distributing", "展开"),
      explanation: t(
        "Unlike arithmetic, both connectives distribute over each other: $p \\wedge (q \\vee r) \\equiv (p \\wedge q) \\vee (p \\wedge r)$ and $p \\vee (q \\wedge r) \\equiv (p \\vee q) \\wedge (p \\vee r)$.",
        "与算术不同，两种联结词可以互相分配：$p \\wedge (q \\vee r) \\equiv (p \\wedge q) \\vee (p \\wedge r)$，$p \\vee (q \\wedge r) \\equiv (p \\vee q) \\wedge (p \\vee r)$。",
      ),
      generate: (rng) => applyTheLaw(rng, [4, 5]),
    },
    {
      id: "factoring-with-the-distributive-laws",
      title: t("Factoring", "提取公因式"),
      explanation: t(
        "Read right to left, the laws factor out a common part: $(p \\vee q) \\wedge (p \\vee \\neg r) \\equiv p \\vee (q \\wedge \\neg r)$.",
        "从右往左读，分配律可以提取公共部分：$(p \\vee q) \\wedge (p \\vee \\neg r) \\equiv p \\vee (q \\wedge \\neg r)$。",
      ),
      generate(rng) {
        const law = laws[rng.pick([4, 5])]!;
        const [a, b, c] = threeLiterals(rng);
        const [factored, expanded] = law.make(a, b, c);
        return equivalentChoice(
          rng,
          expanded,
          factored,
          t(
            `Both parts share $${tex(a)}$, so by the distributive law $${tex(expanded)} \\equiv ${tex(factored)}$.`,
            `两部分都含 $${tex(a)}$，所以由分配律 $${tex(expanded)} \\equiv ${tex(factored)}$。`,
          ),
        );
      },
    },
  ],
};

/** theAbsorptionLaws simplifies p ∨ (p ∧ q) and p ∧ (p ∨ q) to p. */
export const theAbsorptionLaws: TopicDef = {
  id: "the-absorption-laws",
  title: t("The Absorption Laws", "吸收律"),
  summary: t("p ∨ (p ∧ q) ≡ p and p ∧ (p ∨ q) ≡ p.", "p ∨ (p ∧ q) ≡ p，p ∧ (p ∨ q) ≡ p。"),
  prerequisites: ["the-distributive-laws"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "simplifying-with-absorption",
      title: t("Simplifying with absorption", "用吸收律化简"),
      explanation: t(
        "In $p \\vee (p \\wedge q)$, whenever $p \\wedge q$ is true, $p$ is already true, so the whole statement is just $p$. Similarly $p \\wedge (p \\vee q) \\equiv p$. The **idempotent laws** $p \\wedge p \\equiv p$ and $p \\vee p \\equiv p$ are simpler cases.",
        "在 $p \\vee (p \\wedge q)$ 中，只要 $p \\wedge q$ 为真，$p$ 就已经为真，所以整个命题就是 $p$。同理 $p \\wedge (p \\vee q) \\equiv p$。**幂等律** $p \\wedge p \\equiv p$、$p \\vee p \\equiv p$ 是更简单的情形。",
      ),
      generate: (rng) => applyTheLaw(rng, [6, 7]),
    },
    {
      id: "naming-the-laws",
      title: t("Naming the law", "说出定律"),
      explanation: t(
        "Recognize each law by its shape: reordering (commutative), regrouping (associative), expanding or factoring (distributive), and collapsing $p \\vee (p \\wedge q)$ or $p \\wedge (p \\vee q)$ to $p$ (absorption).",
        "按形式辨认各定律：交换次序（交换律）、重新分组（结合律）、展开或提取（分配律），把 $p \\vee (p \\wedge q)$ 或 $p \\wedge (p \\vee q)$ 化为 $p$（吸收律）。",
      ),
      generate: (rng) => nameTheLaw(rng, [0, 1, 2, 3, 4, 5, 6, 7]),
    },
  ],
};

/** deMorgansLawsForLogic negates conjunctions and disjunctions. */
export const deMorgansLawsForLogic: TopicDef = {
  id: "de-morgans-laws-for-logic",
  title: t("De Morgan's Laws for Logic", "逻辑中的德摩根律"),
  summary: t("¬(p ∧ q) ≡ ¬p ∨ ¬q and ¬(p ∨ q) ≡ ¬p ∧ ¬q.", "¬(p ∧ q) ≡ ¬p ∨ ¬q，¬(p ∨ q) ≡ ¬p ∧ ¬q。"),
  prerequisites: ["the-absorption-laws"],
  encompasses: [{ topic: "the-not-connective", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "pushing-negations-inward",
      title: t("Pushing negations inward", "把否定移入括号"),
      explanation: t(
        "**De Morgan's laws:** $\\neg(p \\wedge q) \\equiv \\neg p \\vee \\neg q$ and $\\neg(p \\vee q) \\equiv \\neg p \\wedge \\neg q$. A negation moves inside by negating each part and swapping $\\wedge$ with $\\vee$; double negations cancel: $\\neg \\neg p \\equiv p$. So $\\neg(\\neg p \\vee (q \\wedge r)) \\equiv p \\wedge (\\neg q \\vee \\neg r)$.",
        "**德摩根律：**$\\neg(p \\wedge q) \\equiv \\neg p \\vee \\neg q$，$\\neg(p \\vee q) \\equiv \\neg p \\wedge \\neg q$。否定移入括号时，要否定每一部分并互换 $\\wedge$ 与 $\\vee$；双重否定相互抵消：$\\neg \\neg p \\equiv p$。所以 $\\neg(\\neg p \\vee (q \\wedge r)) \\equiv p \\wedge (\\neg q \\vee \\neg r)$。",
      ),
      generate(rng) {
        for (;;) {
          const inner = randomFormula(rng, 2, ["p", "q", "r"], ["and", "or"]);
          if (inner.k !== "and" && inner.k !== "or") continue;
          const f = not(inner);
          const g = deMorganRewrite(f);
          return equivalentChoice(
            rng,
            f,
            g,
            t(
              `Move the negation inward, negating each part and swapping $\\wedge$ and $\\vee$: $${tex(f)} \\equiv ${tex(g)}$.`,
              `把否定移入括号，否定每一部分并互换 $\\wedge$ 与 $\\vee$：$${tex(f)} \\equiv ${tex(g)}$。`,
            ),
          );
        }
      },
    },
    {
      id: "negating-compound-sentences",
      title: t("Negating compound sentences", "否定复合语句"),
      explanation: t(
        'The negation of "$x$ is even and $x > 3$" is "$x$ is not even or $x \\le 3$". The negation of an "or" sentence is an "and" sentence of the negations.',
        "“$x$ 是偶数且 $x > 3$”的否定是“$x$ 不是偶数或 $x \\le 3$”。“或”语句的否定是各部分否定的“且”语句。",
      ),
      generate(rng) {
        const [a, b] = twoAtoms(rng);
        const isAnd = rng.bool();
        const [w, wz] = isAnd ? ["and", "且"] : ["or", "或"];
        const [ow, owz] = isAnd ? ["or", "或"] : ["and", "且"];
        const s = (x: Text, y: Text, en: string, zh: string) => t(`${x.en} ${en} ${y.en}`, `${x["zh-CN"]} ${zh} ${y["zh-CN"]}`);
        return oneOf(
          rng,
          t(
            `Which statement is the negation of "${a.text.en} ${w} ${b.text.en}"?`,
            `哪个命题是“${a.text["zh-CN"]} ${wz} ${b.text["zh-CN"]}”的否定？`,
          ),
          s(a.negation, b.negation, ow, owz),
          [s(a.negation, b.negation, w, wz), s(a.negation, b.text, w, wz), s(a.text, b.negation, ow, owz)],
          t(`By De Morgan's laws, negate each part and change "${w}" to "${ow}".`, `由德摩根律，否定每一部分，并把“${wz}”改为“${owz}”。`),
        );
      },
    },
  ],
};

/** conditionalAtoms picks a hypothesis and conclusion for "if … then …" sentences. */
function conditionalSentence(rng: Rng) {
  const [a, b] = twoAtoms(rng);
  const value = !a.value || b.value;
  return {
    a,
    b,
    value,
    en: `If ${a.text.en}, then ${b.text.en}`,
    zh: `如果 ${a.text["zh-CN"]}，那么 ${b.text["zh-CN"]}`,
  };
}

/** conditionalStatements introduces p ⇒ q. */
export const conditionalStatements: TopicDef = {
  id: "conditional-statements",
  title: t("Conditional Statements", "条件命题"),
  summary: t('p ⇒ q ("if p, then q") is false only when p is true and q is false.', "p ⇒ q（“若 p 则 q”）只有在 p 真而 q 假时为假。"),
  prerequisites: ["the-not-connective"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "truth-values-of-conditional-statements",
      title: t("Truth values of conditionals", "条件命题的真假"),
      explanation: t(
        'In $p \\Rightarrow q$, $p$ is the **hypothesis** and $q$ the **conclusion**. The statement is a promise that is broken only when $p$ is true and $q$ is false. When $p$ is false, $p \\Rightarrow q$ is true whatever $q$ is (it is **vacuously true**): "If $4 > 9$, then $7$ is even" is true.',
        "在 $p \\Rightarrow q$ 中，$p$ 是**前提**，$q$ 是**结论**。这个命题就像一个承诺，只有在 $p$ 真而 $q$ 假时才被打破。当 $p$ 为假时，无论 $q$ 如何，$p \\Rightarrow q$ 都为真（**空真**）：“如果 $4 > 9$，那么 $7$ 是偶数”为真。",
      ),
      generate(rng) {
        const c = conditionalSentence(rng);
        return oneOf(
          rng,
          t(`Is the statement "${c.en}" true or false?`, `命题“${c.zh}”是真还是假？`),
          truthOption(c.value),
          [truthOption(!c.value)],
          t(
            `The hypothesis is ${c.a.value ? "true" : "false"} and the conclusion is ${c.b.value ? "true" : "false"}. ${c.value ? (c.a.value ? "Both are true, so the conditional is true." : "A false hypothesis makes the conditional vacuously true.") : "A true hypothesis with a false conclusion makes the conditional false."}`,
            `前提为${c.a.value ? "真" : "假"}，结论为${c.b.value ? "真" : "假"}。${c.value ? (c.a.value ? "两者都为真，所以条件命题为真。" : "前提为假时条件命题空真。") : "前提真而结论假，所以条件命题为假。"}`,
          ),
        );
      },
    },
    {
      id: "evaluating-formulas-with-conditionals",
      title: t("Evaluating formulas with conditionals", "含条件命题的公式求值"),
      explanation: t(
        "Evaluate inner parts first, then use the rule for $\\Rightarrow$. If $p$ is false and $q$ is true, then $(p \\vee q) \\Rightarrow p$ is $T \\Rightarrow F$, which is false.",
        "先计算内层，再用 $\\Rightarrow$ 的规则。若 $p$ 为假、$q$ 为真，则 $(p \\vee q) \\Rightarrow p$ 即 $T \\Rightarrow F$，为假。",
      ),
      generate(rng) {
        for (;;) {
          const f = randomFormula(rng, 2, ["p", "q", "r"], ["and", "or", "imp"]);
          if (tex(f).includes("\\Rightarrow") && varsOf(f).length >= 2) return evaluateProblem(rng, f);
        }
      },
    },
  ],
};

/** logicalEquivalenceWithConditionalStatements rewrites conditionals. */
export const logicalEquivalenceWithConditionalStatements: TopicDef = {
  id: "logical-equivalence-with-conditional-statements",
  title: t("Logical Equivalence With Conditional Statements", "条件命题的逻辑等价"),
  summary: t("p ⇒ q ≡ ¬p ∨ q, and ¬(p ⇒ q) ≡ p ∧ ¬q.", "p ⇒ q ≡ ¬p ∨ q，¬(p ⇒ q) ≡ p ∧ ¬q。"),
  prerequisites: ["conditional-statements", "de-morgans-laws-for-logic"],
  encompasses: [{ topic: "conditional-statements", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rewriting-a-conditional-as-a-disjunction",
      title: t("Conditionals as disjunctions", "把条件命题写成析取"),
      explanation: t(
        "$p \\Rightarrow q$ is false only when $p$ is true and $q$ false, which is exactly when $\\neg p \\vee q$ is false. So $p \\Rightarrow q \\equiv \\neg p \\vee q$. For example, $\\neg p \\Rightarrow (q \\wedge r) \\equiv p \\vee (q \\wedge r)$.",
        "$p \\Rightarrow q$ 只有在 $p$ 真 $q$ 假时为假，这恰好是 $\\neg p \\vee q$ 为假的情形。所以 $p \\Rightarrow q \\equiv \\neg p \\vee q$。例如 $\\neg p \\Rightarrow (q \\wedge r) \\equiv p \\vee (q \\wedge r)$。",
      ),
      generate(rng) {
        const [a, b] = threeLiterals(rng);
        const c = rng.bool() ? b : and(b, threeLiterals(rng)[2]);
        const f = imp(a, c);
        const g = or(a.k === "not" ? a.a : not(a), c);
        return equivalentChoice(
          rng,
          f,
          g,
          t(
            `$A \\Rightarrow B \\equiv \\neg A \\vee B$, so $${tex(f)} \\equiv ${tex(g)}$.`,
            `$A \\Rightarrow B \\equiv \\neg A \\vee B$，所以 $${tex(f)} \\equiv ${tex(g)}$。`,
          ),
        );
      },
    },
    {
      id: "negating-a-conditional",
      title: t("Negating a conditional", "否定条件命题"),
      explanation: t(
        '$\\neg(p \\Rightarrow q) \\equiv \\neg(\\neg p \\vee q) \\equiv p \\wedge \\neg q$. The negation of a conditional is not another conditional: the negation of "if it rains, the game is canceled" is "it rains and the game is not canceled".',
        "$\\neg(p \\Rightarrow q) \\equiv \\neg(\\neg p \\vee q) \\equiv p \\wedge \\neg q$。条件命题的否定不是另一个条件命题：“如果下雨，比赛就取消”的否定是“下雨了而比赛没有取消”。",
      ),
      generate(rng) {
        const [a, b] = threeLiterals(rng);
        const f = not(imp(a, b));
        const g = and(a, b.k === "not" ? b.a : not(b));
        const wrong = inequivalentTo(rng, f, [imp(not(a), not(b)), imp(a, not(b)), and(not(a), b), or(not(a), b), imp(b, a)]);
        return oneOf(
          rng,
          t(`Which statement is logically equivalent to $${tex(f)}$?`, `哪个命题与 $${tex(f)}$ 逻辑等价？`),
          math(g),
          wrong.map(math),
          t(
            `$\\neg(A \\Rightarrow B) \\equiv A \\wedge \\neg B$, so $${tex(f)} \\equiv ${tex(g)}$.`,
            `$\\neg(A \\Rightarrow B) \\equiv A \\wedge \\neg B$，所以 $${tex(f)} \\equiv ${tex(g)}$。`,
          ),
        );
      },
    },
  ],
};

/** biconditionalStatements introduces p ⇔ q. */
export const biconditionalStatements: TopicDef = {
  id: "biconditional-statements",
  title: t("Biconditional Statements", "双条件命题"),
  summary: t(
    'p ⇔ q ("p if and only if q") is true when p and q have the same truth value; it is equivalent to (p ⇒ q) ∧ (q ⇒ p).',
    "p ⇔ q（“p 当且仅当 q”）在 p 与 q 真假相同时为真；它等价于 (p ⇒ q) ∧ (q ⇒ p)。",
  ),
  prerequisites: ["conditional-statements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "truth-values-of-biconditionals",
      title: t("Truth values of biconditionals", "双条件命题的真假"),
      explanation: t(
        '$p \\Leftrightarrow q$ is true when $p$ and $q$ are both true or both false, and false otherwise. "$9$ is prime if and only if $9 > 20$" is true, since both parts are false.',
        "$p \\Leftrightarrow q$ 在 $p$、$q$ 同真或同假时为真，否则为假。“$9$ 是质数当且仅当 $9 > 20$”为真，因为两部分都为假。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const [a, b] = twoAtoms(rng);
          const value = a.value === b.value;
          return oneOf(
            rng,
            t(
              `Is the statement "${a.text.en} if and only if ${b.text.en}" true or false?`,
              `命题“${a.text["zh-CN"]}当且仅当 ${b.text["zh-CN"]}”是真还是假？`,
            ),
            truthOption(value),
            [truthOption(!value)],
            t(
              `The parts are ${a.value ? "true" : "false"} and ${b.value ? "true" : "false"}; a biconditional is true exactly when they match, so it is ${value ? "true" : "false"}.`,
              `两部分分别为${a.value ? "真" : "假"}和${b.value ? "真" : "假"}；双条件命题恰在两者相同时为真，所以它为${value ? "真" : "假"}。`,
            ),
          );
        }
        for (;;) {
          const f = randomFormula(rng, 2, ["p", "q", "r"], ["and", "or", "iff"]);
          if (tex(f).includes("\\Leftrightarrow") && varsOf(f).length >= 2) return evaluateProblem(rng, f);
        }
      },
    },
    {
      id: "rewriting-biconditionals",
      title: t("Rewriting biconditionals", "改写双条件命题"),
      explanation: t(
        "$p \\Leftrightarrow q \\equiv (p \\Rightarrow q) \\wedge (q \\Rightarrow p)$: a biconditional asserts an implication in both directions. Also $p \\Leftrightarrow q \\equiv (p \\wedge q) \\vee (\\neg p \\wedge \\neg q)$ and $\\neg(p \\Leftrightarrow q) \\equiv p \\Leftrightarrow \\neg q$.",
        "$p \\Leftrightarrow q \\equiv (p \\Rightarrow q) \\wedge (q \\Rightarrow p)$：双条件命题断言两个方向的蕴涵。另外 $p \\Leftrightarrow q \\equiv (p \\wedge q) \\vee (\\neg p \\wedge \\neg q)$，$\\neg(p \\Leftrightarrow q) \\equiv p \\Leftrightarrow \\neg q$。",
      ),
      generate(rng) {
        const [a, b] = threeLiterals(rng);
        const kind = rng.int(0, 2);
        const neg = (x: Formula) => (x.k === "not" ? x.a : not(x));
        const f = kind === 2 ? not(iff(a, b)) : iff(a, b);
        const g = kind === 0 ? and(imp(a, b), imp(b, a)) : kind === 1 ? or(and(a, b), and(neg(a), neg(b))) : iff(a, neg(b));
        const wrong = inequivalentTo(rng, f, [
          and(imp(a, b), imp(neg(b), neg(a))),
          or(imp(a, b), imp(b, a)),
          imp(a, b),
          and(a, b),
          or(and(a, neg(b)), and(neg(a), b)),
          iff(a, b),
          iff(neg(a), neg(b)),
        ]);
        return oneOf(
          rng,
          t(`Which statement is logically equivalent to $${tex(f)}$?`, `哪个命题与 $${tex(f)}$ 逻辑等价？`),
          math(g),
          wrong.map(math),
          t(
            [
              "A biconditional is an implication in both directions.",
              "A biconditional is true when both parts are true or both are false.",
              "A negated biconditional is true when the parts differ, which is when one part matches the negation of the other.",
            ][kind]!,
            [
              "双条件命题就是两个方向的蕴涵。",
              "双条件命题在两部分同真或同假时为真。",
              "双条件命题的否定在两部分不同时为真，即一部分与另一部分的否定相同时。",
            ][kind]!,
          ),
        );
      },
    },
  ],
};

/** kinds are the answers for classifying a statement. */
const kinds: Record<Kind, Text> = {
  tautology: t("A tautology", "永真式"),
  contradiction: t("A contradiction", "矛盾式"),
  contingency: t("Neither", "都不是"),
};

/** tautologiesAndContradictions classifies statements by their truth tables. */
export const tautologiesAndContradictions: TopicDef = {
  id: "tautologies-and-contradictions",
  title: t("Tautologies and Contradictions", "永真式与矛盾式"),
  summary: t(
    "A tautology is true in every row of its truth table; a contradiction is false in every row.",
    "永真式在真值表的每一行都为真；矛盾式在每一行都为假。",
  ),
  prerequisites: ["logical-equivalence-with-conditional-statements", "biconditional-statements"],
  encompasses: [{ topic: "logical-equivalence", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "classifying-statements",
      title: t("Classifying statements", "判断命题类型"),
      explanation: t(
        "A **tautology** is true for every assignment, such as $p \\vee \\neg p$ or $(p \\wedge q) \\Rightarrow p$. A **contradiction** is always false, such as $p \\wedge \\neg p$. Two statements $P$ and $Q$ are equivalent exactly when $P \\Leftrightarrow Q$ is a tautology.",
        "**永真式**对每一种取值都为真，如 $p \\vee \\neg p$ 或 $(p \\wedge q) \\Rightarrow p$。**矛盾式**总是为假，如 $p \\wedge \\neg p$。两个命题 $P$ 与 $Q$ 等价，当且仅当 $P \\Leftrightarrow Q$ 是永真式。",
      ),
      generate(rng) {
        const target = rng.pick(["tautology", "contradiction", "contingency"] as const);
        for (;;) {
          const f = randomFormula(rng, rng.int(2, 3), ["p", "q"], ["and", "or", "imp", "iff"]);
          if (kindOf(f) !== target || varsOf(f).length < 2 || f.k === "not") continue;
          const table = rows(varsOf(f)).map((env) => TF(evaluate(f, env)));
          return oneOf(
            rng,
            t(`Is $${tex(f)}$ a tautology, a contradiction, or neither?`, `$${tex(f)}$ 是永真式、矛盾式，还是都不是？`),
            kinds[target],
            Object.values(kinds).filter((k) => k !== kinds[target]),
            t(
              `In the four rows of the truth table the statement is ${table.join(", ")}, so it is ${target === "contingency" ? "neither" : `a ${target}`}.`,
              `在真值表的四行中，该命题依次为 ${table.join("、")}，所以它${target === "contingency" ? "既不是永真式也不是矛盾式" : `是${kinds[target]["zh-CN"]}`}。`,
            ),
          );
        }
      },
    },
    {
      id: "equivalence-as-a-tautology",
      title: t("Equivalence as a tautology", "等价与永真式"),
      explanation: t(
        "$P \\equiv Q$ means $P \\Leftrightarrow Q$ is a tautology, and $P \\Rightarrow Q$ being a tautology means $Q$ is true whenever $P$ is. To decide whether $P \\Leftrightarrow Q$ is a tautology, compare the truth-table columns of $P$ and $Q$.",
        "$P \\equiv Q$ 表示 $P \\Leftrightarrow Q$ 是永真式；$P \\Rightarrow Q$ 是永真式表示只要 $P$ 为真 $Q$ 就为真。要判断 $P \\Leftrightarrow Q$ 是否为永真式，比较 $P$ 与 $Q$ 的真值表列。",
      ),
      generate(rng) {
        for (;;) {
          const f = randomFormula(rng, 2, ["p", "q"], ["and", "or", "imp"]);
          if (varsOf(f).length < 2 || f.k === "var") continue;
          const g = rng.bool() ? deMorganRewrite(f) : rng.pick(mutations(f));
          if (tex(g) === tex(f)) continue;
          const whole = iff(f, g);
          const isTaut = kindOf(whole) === "tautology";
          return oneOf(
            rng,
            t(`Is $${tex(whole)}$ a tautology?`, `$${tex(whole)}$ 是永真式吗？`),
            t(isTaut ? "Yes" : "No", isTaut ? "是" : "否"),
            [t(isTaut ? "No" : "Yes", isTaut ? "否" : "是")],
            t(
              `It is a tautology exactly when the two sides are equivalent. ${equivalenceSolution(f, g).en}`,
              `它是永真式当且仅当两边等价。${equivalenceSolution(f, g)["zh-CN"]}`,
            ),
          );
        }
      },
    },
  ],
};

/** relatedConditionals are the four forms of a conditional and its relatives. */
const relatedForms = [
  { name: t("The converse", "逆命题"), make: (a: Formula, b: Formula) => imp(b, a) },
  { name: t("The inverse", "否命题"), make: (a: Formula, b: Formula) => imp(not(a), not(b)) },
  { name: t("The contrapositive", "逆否命题"), make: (a: Formula, b: Formula) => imp(not(b), not(a)) },
] as const;

/** converseInverseAndContrapositive forms the relatives of a conditional. */
export const converseInverseAndContrapositive: TopicDef = {
  id: "converse-inverse-and-contrapositive",
  title: t("Converse, Inverse and Contrapositive", "逆命题、否命题与逆否命题"),
  summary: t(
    "For p ⇒ q: the converse is q ⇒ p, the inverse ¬p ⇒ ¬q, and the contrapositive ¬q ⇒ ¬p, which alone is equivalent to the original.",
    "对 p ⇒ q：逆命题为 q ⇒ p，否命题为 ¬p ⇒ ¬q，逆否命题为 ¬q ⇒ ¬p；只有逆否命题与原命题等价。",
  ),
  prerequisites: ["logical-equivalence-with-conditional-statements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "forming-the-converse-inverse-and-contrapositive",
      title: t("Forming the related statements", "写出相关命题"),
      explanation: t(
        'For "if $n$ is divisible by $4$, then $n$ is even": the **converse** is "if $n$ is even, then $n$ is divisible by $4$"; the **inverse** is "if $n$ is not divisible by $4$, then $n$ is not even"; the **contrapositive** is "if $n$ is not even, then $n$ is not divisible by $4$".',
        "对“若 $n$ 能被 $4$ 整除，则 $n$ 是偶数”：**逆命题**是“若 $n$ 是偶数，则 $n$ 能被 $4$ 整除”；**否命题**是“若 $n$ 不能被 $4$ 整除，则 $n$ 不是偶数”；**逆否命题**是“若 $n$ 不是偶数，则 $n$ 不能被 $4$ 整除”。",
      ),
      generate(rng) {
        const [a, b] = twoAtoms(rng);
        const which = rng.int(0, 2);
        const name = relatedForms[which]!.name;
        const sentence = (h: Text, c: Text) => t(`If ${h.en}, then ${c.en}.`, `如果 ${h["zh-CN"]}，那么 ${c["zh-CN"]}。`);
        const forms = [sentence(b.text, a.text), sentence(a.negation, b.negation), sentence(b.negation, a.negation)];
        return oneOf(
          rng,
          t(
            `What is ${name.en.toLowerCase()} of "If ${a.text.en}, then ${b.text.en}"?`,
            `“如果 ${a.text["zh-CN"]}，那么 ${b.text["zh-CN"]}”的${name["zh-CN"]}是什么？`,
          ),
          forms[which]!,
          [...forms.filter((_, i) => i !== which), sentence(a.negation, b.text)],
          t(
            `${name.en} of $p \\Rightarrow q$ is $${tex(relatedForms[which]!.make(v("p"), v("q")))}$.`,
            `$p \\Rightarrow q$ 的${name["zh-CN"]}是 $${tex(relatedForms[which]!.make(v("p"), v("q")))}$。`,
          ),
        );
      },
    },
    {
      id: "which-related-statement-is-equivalent",
      title: t("Which are equivalent", "哪些等价"),
      explanation: t(
        'A conditional is equivalent to its contrapositive, and the converse is equivalent to the inverse (they are contrapositives of each other). A conditional is **not** equivalent to its converse: "if $n$ is divisible by $4$, then $n$ is even" is true, but its converse fails for $n = 6$.',
        "条件命题与其逆否命题等价，逆命题与否命题等价（它们互为逆否）。条件命题与其逆命题**不**等价：“若 $n$ 能被 $4$ 整除，则 $n$ 是偶数”为真，但其逆命题在 $n = 6$ 时不成立。",
      ),
      generate(rng) {
        const [a, b] = threeLiterals(rng);
        const neg = (x: Formula) => (x.k === "not" ? x.a : not(x));
        const f = imp(a, b);
        const fromConverse = rng.int(0, 2) === 0;
        const source = fromConverse ? imp(b, a) : f;
        const right = fromConverse ? imp(neg(a), neg(b)) : imp(neg(b), neg(a));
        const wrong = inequivalentTo(rng, source, [imp(b, a), imp(neg(a), neg(b)), imp(neg(b), neg(a)), imp(a, neg(b)), imp(a, b)]);
        return oneOf(
          rng,
          t(`Which statement is logically equivalent to $${tex(source)}$?`, `哪个命题与 $${tex(source)}$ 逻辑等价？`),
          math(right),
          wrong.map(math),
          t(
            `A conditional is equivalent to its contrapositive: $${tex(source)} \\equiv ${tex(right)}$. Its converse and inverse are not equivalent to it.`,
            `条件命题与其逆否命题等价：$${tex(source)} \\equiv ${tex(right)}$。它的逆命题与否命题都与它不等价。`,
          ),
        );
      },
    },
  ],
};

/** methodsOfProofLogicTopics are the topics of Methods of Proof modules 1.1–1.2. */
export const methodsOfProofLogicTopics: readonly TopicDef[] = [
  theAndAndOrConnectives,
  truthTables,
  theNotConnective,
  logicalEquivalence,
  logicalAssociativeAndCommutativeLaws,
  theDistributiveLaws,
  theAbsorptionLaws,
  deMorgansLawsForLogic,
  conditionalStatements,
  logicalEquivalenceWithConditionalStatements,
  biconditionalStatements,
  tautologiesAndContradictions,
  converseInverseAndContrapositive,
];
