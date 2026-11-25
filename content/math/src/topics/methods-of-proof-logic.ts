import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { numberProblem, why } from "../problems.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";
import { oneOf } from "./calculus-common.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";

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

/** valueWord writes a truth value as a word in each locale. */
export const valueWord = (b: boolean) => t(b ? "true" : "false", b ? "真" : "假");

/** ruleOf states the rule of a formula's main connective with the values of its parts under env. */
export function ruleOf(f: Formula, env: Env): Text {
  if (f.k === "var") return t(`$${f.v}$ is given as ${TF(env[f.v])}.`, `$${f.v}$ 已给定为 ${TF(env[f.v])}。`);
  const a = TF(evaluate(f.a, env));
  if (f.k === "not")
    return t(
      `The main connective is $\\neg$, which flips the value of $${tex(f.a)}$, here ${a}.`,
      `主联结词是 $\\neg$，它把 $${tex(f.a)}$ 的值（这里是 ${a}）反过来。`,
    );
  const b = TF(evaluate(f.b, env));
  const rule = {
    and: t("is true only when both sides are true", "只有两边都为真时才为真"),
    or: t("is true when at least one side is true", "只要至少一边为真就为真"),
    imp: t("is false only when the left side is true and the right side false", "只有左边真而右边假时才为假"),
    iff: t("is true exactly when the two sides match", "恰在两边真假相同时为真"),
  }[f.k];
  return t(
    `The main connective is $${symbols[f.k]}$, which ${rule.en}; its sides are ${a} and ${b}.`,
    `主联结词是 $${symbols[f.k]}$，它${rule["zh-CN"]}；两边分别为 ${a} 和 ${b}。`,
  );
}

/** evaluateProblem asks for the truth value of a formula under an assignment. */
export function evaluateProblem(rng: Rng, f: Formula): Problem {
  const vars = varsOf(f);
  const env = rng.pick(rows(vars));
  const value = evaluate(f, env);
  const given = envText(env, vars);
  return reasoned(
    oneOf(
      rng,
      t(`Suppose ${given.en}. Is $${tex(f)}$ true or false?`, `设${given["zh-CN"]}。$${tex(f)}$ 是真还是假？`),
      truthOption(value),
      [truthOption(!value)],
      walked(
        [
          [
            ["Write in the values", "代入真假"],
            t(
              `Put ${vars.map((x) => `${TF(env[x])} for $${x}$`).join(", ")}.`,
              `把 ${vars.map((x) => `$${x}$ 记为 ${TF(env[x])}`).join("，")}。`,
            ),
          ],
          [
            ["Work from the inside out", "由内向外计算"],
            t(
              `Each part is evaluated before the connective that joins it: ${evaluationSteps(f, env)}.`,
              `每一部分先算出，再用连接它的联结词：${evaluationSteps(f, env)}。`,
            ),
          ],
        ],
        t(
          `${ruleOf(f, env).en} That gives ${TF(value)}: the statement is ${valueWord(value).en}.`,
          `${ruleOf(f, env)["zh-CN"]}所以得 ${TF(value)}：该命题为${valueWord(value)["zh-CN"]}。`,
        ),
      ),
    ),
    [
      [
        truthOption(!value).en,
        "One of the parts has the wrong value, or the rule of a connective was misapplied. Evaluate the innermost parts first.",
        "有一部分的真假算错了，或者某个联结词的规则用错了。先算最里层的部分。",
      ],
    ],
  );
}

/** differingRow finds an assignment where f and g differ, if there is one. */
export function differingRow(f: Formula, g: Formula): Env | undefined {
  return rows(varsOf(f, g)).find((env) => evaluate(f, env) !== evaluate(g, env));
}

/** rowWhere writes an assignment of the variables of f and g in words. */
export const rowWhere = (env: Env, f: Formula, g: Formula) => envText(env, varsOf(f, g));

/** differsReason says where a wrong option g fails to match f, without saying which option is right. */
export function differsReason(f: Formula, g: Formula): Reason | undefined {
  const env = differingRow(f, g);
  if (!env) return undefined;
  const where = rowWhere(env, f, g);
  return [
    math(g).en,
    `Where ${where.en}, this is ${TF(evaluate(g, env))} but $${tex(f)}$ is ${TF(evaluate(f, env))}, so they are not equivalent.`,
    `当${where["zh-CN"]}时，它为 ${TF(evaluate(g, env))}，而 $${tex(f)}$ 为 ${TF(evaluate(f, env))}，所以两者不等价。`,
  ];
}

/** rowCheck checks an equivalence on one row, chosen where f is false when there is such a row. */
export function rowCheck(f: Formula, g: Formula): Text {
  const all = rows(varsOf(f, g));
  const env = all.find((e) => !evaluate(f, e)) ?? all[0]!;
  const where = rowWhere(env, f, g);
  const a = TF(evaluate(f, env));
  const b = TF(evaluate(g, env));
  return t(
    `Try one row, where ${where.en}: $${tex(f)}$ is ${a} and $${tex(g)}$ is ${b}, as equivalent statements must agree.`,
    `取一行，当${where["zh-CN"]}时：$${tex(f)}$ 为 ${a}，$${tex(g)}$ 为 ${b}，等价的命题理应一致。`,
  );
}

/** columnOf writes the truth-table column of f over the variables of f and g, from all true to all false. */
const columnOf = (f: Formula, g: Formula) =>
  rows(varsOf(f, g))
    .map((env) => TF(evaluate(f, env)))
    .join(", ");

/** columnSteps find the equivalent option g of f by comparing truth-table columns. */
export function columnSteps(f: Formula, g: Formula): Step[] {
  return [
    [
      ["Fill in the column of the statement", "填出原命题的列"],
      t(
        `Row by row, from all true to all false, $${tex(f)}$ takes the values ${columnOf(f, g)}.`,
        `逐行计算，从全真到全假，$${tex(f)}$ 依次为 ${columnOf(f, g)}。`,
      ),
    ],
    [
      ["Compare the options", "比较各选项"],
      t(
        `$${tex(g)}$ takes ${columnOf(g, f)}, the same in every row, so it is equivalent. Each other option differs from the statement in at least one row.`,
        `$${tex(g)}$ 依次为 ${columnOf(g, f)}，每一行都相同，所以它与原命题等价。其他每个选项都至少有一行与原命题不同。`,
      ),
    ],
  ];
}

/** equivalentChoice asks which option is equivalent to f; right is the intended rewrite, worked in the given steps. */
export function equivalentChoice(
  rng: Rng,
  f: Formula,
  right: Formula,
  work: readonly Step[],
  options: { readonly candidates?: readonly Formula[]; readonly reasons?: readonly Reason[] } = {},
): Problem {
  const wrong = inequivalentTo(rng, f, options.candidates ?? [...mutations(right), ...mutations(f)]);
  return reasoned(
    oneOf(
      rng,
      t(`Which statement is logically equivalent to $${tex(f)}$?`, `哪个命题与 $${tex(f)}$ 逻辑等价？`),
      math(right),
      wrong.map(math),
      walked(work, rowCheck(f, right)),
    ),
    [
      ...(options.reasons ?? []),
      ...wrong.flatMap((g) => {
        const r = differsReason(f, g);
        return r ? [r] : [];
      }),
    ],
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
  intro: t(
    'Take two statements: "$12$ is even", which is true, and "$12$ is prime", which is false. Joined by "and", the claim "$12$ is even and $12$ is prime" asserts both, and one of them fails, so it is false. Joined by "or", the claim "$12$ is even or $12$ is prime" asserts at least one, and the first holds, so it is true.\n\nCheck: swap the order of the parts. "$12$ is prime and $12$ is even" is still false, and "$12$ is prime or $12$ is even" still true; the order of the parts never matters.\n\nIn this lesson we decide whether statements joined by "and" and "or" are true, then evaluate formulas built from $\\wedge$ and $\\vee$.',
    "取两个命题：“$12$ 是偶数”为真，“$12$ 是质数”为假。用“且”连接，“$12$ 是偶数且 $12$ 是质数”断言两者都成立，而其中一个不成立，所以为假。用“或”连接，“$12$ 是偶数或 $12$ 是质数”断言至少一个成立，第一个成立，所以为真。\n\n检验：交换两部分的次序。“$12$ 是质数且 $12$ 是偶数”仍为假，“$12$ 是质数或 $12$ 是偶数”仍为真；两部分的次序从不影响结果。\n\n本课我们判断用“且”“或”连接的命题的真假，再计算由 $\\wedge$ 和 $\\vee$ 构成的公式的真假。",
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
        'The **conjunction** $p \\wedge q$ ("$p$ and $q$") claims two things at once, so it is true only when both $p$ and $q$ are true. The **disjunction** $p \\vee q$ ("$p$ or $q$") claims at least one of them, so it is true when at least one is true; in mathematics "or" is inclusive, so it is also true when both are. Take "$7$ is prime and $4 > 9$": the first part is true, the second false, and a conjunction needs both, so it is false. Change "and" to "or" and the true first part is enough: "$7$ is prime or $4 > 9$" is true.\n\n> **Watch out.** "Or" in mathematics is not "one or the other but not both". "$2$ is even or $2$ is prime" is true, even though both parts are true.',
        "**合取** $p \\wedge q$（“$p$ 且 $q$”）同时断言两件事，所以只有在 $p$ 与 $q$ 都为真时才为真。**析取** $p \\vee q$（“$p$ 或 $q$”）断言至少一件成立，所以只要至少一个为真就为真；数学中的“或”是相容的，两者都真时它也为真。看“$7$ 是质数且 $4 > 9$”：第一部分为真，第二部分为假，合取需要两部分都真，所以它为假。把“且”换成“或”，第一部分为真就够了：“$7$ 是质数或 $4 > 9$”为真。\n\n> **注意。** 数学中的“或”不是“二者取一、不能都成立”。“$2$ 是偶数或 $2$ 是质数”为真，尽管两部分都为真。",
      ),
      generate(rng) {
        const [a, b] = twoAtoms(rng);
        const isAnd = rng.bool();
        const value = isAnd ? a.value && b.value : a.value || b.value;
        const en = `${a.text.en} ${isAnd ? "and" : "or"} ${b.text.en}`;
        const zh = `${a.text["zh-CN"]} ${isAnd ? "且" : "或"} ${b.text["zh-CN"]}`;
        const both = a.value && b.value;
        return reasoned(
          oneOf(
            rng,
            t(`Is the statement "${en}" true or false?`, `命题“${zh}”是真还是假？`),
            truthOption(value),
            [truthOption(!value)],
            walked(
              [
                [
                  ["Decide each part", "判断每一部分"],
                  t(
                    `"${a.text.en}" is ${valueWord(a.value).en}, and "${b.text.en}" is ${valueWord(b.value).en}.`,
                    `“${a.text["zh-CN"]}”为${valueWord(a.value)["zh-CN"]}，“${b.text["zh-CN"]}”为${valueWord(b.value)["zh-CN"]}。`,
                  ),
                ],
                [
                  ["Apply the connective", "用联结词的规则"],
                  isAnd
                    ? t(
                        `An "and" statement claims both parts, so it is true only when both are true. Here it is ${valueWord(value).en}.`,
                        `“且”命题断言两部分都成立，所以只有两部分都真时才为真。这里它为${valueWord(value)["zh-CN"]}。`,
                      )
                    : t(
                        `An "or" statement claims at least one part, so it is true when at least one is true. Here it is ${valueWord(value).en}.`,
                        `“或”命题断言至少一部分成立，所以只要至少一部分为真就为真。这里它为${valueWord(value)["zh-CN"]}。`,
                      ),
                ],
              ],
              isAnd
                ? t(
                    value
                      ? "Neither part is false, so nothing breaks the claim."
                      : 'A single false part is enough to break an "and" claim, and there is one.',
                    value ? "没有一部分为假，所以没有什么推翻这个断言。" : "只要有一部分为假就足以推翻“且”的断言，而这里有。",
                  )
                : t(
                    value
                      ? `${both ? 'Both parts hold, and inclusive "or" allows that.' : 'One true part is enough for an "or" claim, and there is one.'}`
                      : 'An "or" claim fails only when every part is false, and both are false here.',
                    value
                      ? `${both ? "两部分都成立，相容的“或”允许这种情形。" : "只要有一部分为真，“或”的断言就成立，而这里有。"}`
                      : "“或”的断言只有在每一部分都为假时才不成立，这里两部分都为假。",
                  ),
            ),
          ),
          [
            [
              truthOption(!value).en,
              isAnd
                ? 'Check each part again, and remember that "and" needs both parts true.'
                : both
                  ? 'Both parts are true here; "or" in mathematics includes that case.'
                  : 'Check each part again, and remember that "or" needs only one part true.',
              isAnd
                ? "再判断一次每一部分，记住“且”需要两部分都为真。"
                : both
                  ? "这里两部分都为真；数学中的“或”包含这种情形。"
                  : "再判断一次每一部分，记住“或”只需一部分为真。",
            ],
          ],
        );
      },
    },
    {
      id: "evaluating-formulas-with-and-and-or",
      title: t("Evaluating formulas", "计算公式的真假"),
      explanation: t(
        "A formula is built in layers, so it is evaluated in layers: a connective can only be applied once the values of its two sides are known, which means the innermost parentheses come first. If $p$ is true, $q$ is false and $r$ is true, then in $(p \\wedge q) \\vee r$ the inner part $p \\wedge q$ is $T \\wedge F$, which is false; the whole is then $F \\vee T$, which is true.\n\n> **Watch out.** Do not read a formula left to right like a sentence. In $p \\wedge (q \\vee r)$ the $\\vee$ is applied first, because it sits inside the parentheses.",
        "公式是一层层搭起来的，所以也要一层层计算：只有知道两边的值，才能用联结词，因此先算最里层的括号。若 $p$ 为真、$q$ 为假、$r$ 为真，则在 $(p \\wedge q) \\vee r$ 中，里面的 $p \\wedge q$ 是 $T \\wedge F$，为假；整体就是 $F \\vee T$，为真。\n\n> **注意。** 不要像读句子那样从左往右读公式。在 $p \\wedge (q \\vee r)$ 中，$\\vee$ 在括号里，要先算。",
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
  intro: t(
    "Is $p \\vee \\neg q$ true? That depends on $p$ and $q$, and each can be true or false, so there are four cases to try: TT, TF, FT and FF. In the first three, $p$ is true or $q$ is false, so the statement is true; in the last, $p$ is false and $\\neg q$ is false too, so it is false. Listing every case like this, one row each, is a **truth table**.\n\nCheck: the four rows cover every way to choose two truth values, $2 \\times 2 = 4$, and none repeats.\n\nIn this lesson we count the rows of a truth table and count the rows in which a statement is true.",
    "$p \\vee \\neg q$ 是真的吗？这取决于 $p$ 和 $q$，而每个都可真可假，所以要试四种情形：TT、TF、FT、FF。前三种中 $p$ 为真或 $q$ 为假，所以命题为真；最后一种中 $p$ 为假，$\\neg q$ 也为假，所以命题为假。像这样把每一种情形列成一行，就是**真值表**。\n\n检验：这四行涵盖了两个真值的所有取法，$2 \\times 2 = 4$，且没有重复。\n\n本课我们数真值表的行数，并数出命题为真的行数。",
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
        "A truth table has one row for each combination of truth values: $2^{n}$ rows for $n$ variables, listed from all true down to all false. Add a column for each subformula, working outward, so that every column is computed from columns already filled. For $p \\vee (q \\wedge r)$ there are $8$ rows. The $4$ rows where $p$ is true make the statement true at once. Of the $4$ rows where $p$ is false, only the one with $q$ and $r$ both true makes $q \\wedge r$ true. So the statement is true in $4 + 1 = 5$ rows.\n\n> **Watch out.** Count the rows where the whole statement is true, the last column, not the rows where one of its parts is true.",
        "真值表为每一种真值组合列一行：$n$ 个变量共 $2^{n}$ 行，从全真排到全假。由内向外为每个子公式加一列，使每一列都由已经填好的列算出。对 $p \\vee (q \\wedge r)$，共有 $8$ 行。$p$ 为真的 $4$ 行，命题直接为真。$p$ 为假的 $4$ 行中，只有 $q$、$r$ 都为真的那一行使 $q \\wedge r$ 为真。所以命题在 $4 + 1 = 5$ 行中为真。\n\n> **注意。** 要数整个命题（最后一列）为真的行，而不是其中某一部分为真的行。",
      ),
      generate(rng) {
        for (;;) {
          const vars: Var[] = rng.bool() ? ["p", "q"] : ["p", "q", "r"];
          const f = randomFormula(rng, 2, vars, ["and", "or"]);
          if (varsOf(f).length !== vars.length) continue;
          const table = rows(vars).map((env) => evaluate(f, env));
          const count = table.filter(Boolean).length;
          const n = table.length;
          return numberProblem({
            prompt: t(
              `In the truth table of $${tex(f)}$, in how many rows is the statement true?`,
              `在 $${tex(f)}$ 的真值表中，该命题在多少行中为真？`,
            ),
            answer: count,
            wrong: [n - count, n, count + 1],
            mistakes: [
              why(n - count, "That counts the rows where the statement is false.", "这是命题为假的行数。"),
              why(n, "That counts every row of the table, not only the true ones.", "这是表的全部行数，不只是为真的行。"),
            ],
            solution: walked(
              [
                [
                  ["Count the rows", "数出行数"],
                  t(
                    `There are $${vars.length}$ variables, ${vars.map((x) => `$${x}$`).join(", ")}, so the table has $2^{${vars.length}} = ${n}$ rows.`,
                    `共有 $${vars.length}$ 个变量 ${vars.map((x) => `$${x}$`).join("、")}，所以真值表有 $2^{${vars.length}} = ${n}$ 行。`,
                  ),
                ],
                [
                  ["Fill in the last column", "填出最后一列"],
                  t(
                    `Working each row from the inside out, with the rows from all true to all false, the statement takes the values ${table.map(TF).join(", ")}.`,
                    `每一行都由内向外计算，行从全真排到全假，命题依次取值 ${table.map(TF).join("、")}。`,
                  ),
                ],
                [["Count the T's", "数出 T"], t(`The statement is true in $${count}$ rows.`, `命题在 $${count}$ 行中为真。`)],
              ],
              t(
                `The F's number $${n - count}$, and $${count} + ${n - count} = ${n}$: every row is counted once.`,
                `F 有 $${n - count}$ 个，$${count} + ${n - count} = ${n}$：每一行恰好数了一次。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "number-of-rows-in-a-truth-table",
      title: t("Rows of a truth table", "真值表的行数"),
      explanation: t(
        "Each variable can be true or false, and each choice combines with every choice for the others, so each new variable doubles the number of combinations: $2$ for one variable, $4$ for two, $8$ for three. A statement in $n$ variables has a truth table with $2^{n}$ rows. A statement in $p$, $q$, $r$ and $s$ needs $2^{4} = 16$ rows, however long the statement is.\n\n> **Watch out.** Count distinct variables only. In $p \\wedge \\neg p \\vee q$ the letter $p$ appears twice and once negated, but there are still only two variables and $4$ rows.",
        "每个变量可真可假，而且每一种取法都能和其他变量的每一种取法搭配，所以每增加一个变量，组合数就翻倍：一个变量 $2$ 种，两个 $4$ 种，三个 $8$ 种。含 $n$ 个变量的命题的真值表有 $2^{n}$ 行。含 $p$、$q$、$r$、$s$ 的命题需要 $2^{4} = 16$ 行，不论命题有多长。\n\n> **注意。** 只数不同的变量。在 $p \\wedge \\neg p \\vee q$ 中，字母 $p$ 出现两次，其中一次带否定，但变量仍然只有两个，共 $4$ 行。",
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
          mistakes: [
            why(
              2 * n,
              "That adds two rows per variable; each variable doubles the rows instead.",
              "这是每个变量加两行；其实每个变量使行数翻倍。",
            ),
            why(
              2 ** terms.length,
              "That counts every appearance of a letter; a repeated letter is still one variable.",
              "这是把字母的每次出现都算上了；重复出现的字母仍是同一个变量。",
            ),
            why(
              n ** 2,
              "That squares the number of variables; the rows are 2 raised to it.",
              "这是把变量个数平方；行数是 2 的这么多次方。",
            ),
          ],
          solution: walked(
            [
              [
                ["Count the distinct variables", "数出不同的变量"],
                t(
                  `The letters that appear are ${used.map((x) => `$${x}$`).join(", ")}${repeats > 0 ? ", some of them more than once" : ""}: $${n}$ distinct variable${n === 1 ? "" : "s"}. A negation or a repeat adds no new variable.`,
                  `出现的字母是 ${used.map((x) => `$${x}$`).join("、")}${repeats > 0 ? "，其中有的不止出现一次" : ""}：共 $${n}$ 个不同的变量。否定或重复都不增加新变量。`,
                ),
              ],
              [
                ["Double for each variable", "每个变量翻一倍"],
                t(
                  `Each variable can be T or F, independently of the others, so the rows number $2^{${n}} = ${2 ** n}$.`,
                  `每个变量都可取 T 或 F，与其他变量无关，所以行数为 $2^{${n}} = ${2 ** n}$。`,
                ),
              ],
            ],
            t(
              `Doubling from one row, once per variable: ${[1, ...used.map((_, i) => 2 ** (i + 1))].join(", ")}.`,
              `从一行开始，每个变量翻一倍：${[1, ...used.map((_, i) => 2 ** (i + 1))].join("、")}。`,
            ),
          ),
        });
      },
    },
  ],
};

/** Case is one of the three ways two numbers compare. */
type Case = "lt" | "eq" | "gt";

/** casesOfRelation are the cases each comparison covers. */
const casesOfRelation: Readonly<Record<string, readonly Case[]>> = {
  "<": ["lt"],
  "\\le": ["lt", "eq"],
  ">": ["gt"],
  "\\ge": ["eq", "gt"],
  "=": ["eq"],
  "\\ne": ["lt", "gt"],
};

/** caseNames name the cases in each locale. */
const caseNames: Record<Case, Text> = { lt: t('"less"', "“小于”"), eq: t('"equal"', "“等于”"), gt: t('"greater"', "“大于”") };

/** namesOf names a list of cases: '"less" and "equal"'. */
const namesOf = (cases: readonly Case[]) =>
  t(cases.map((c) => caseNames[c].en).join(" and "), cases.map((c) => caseNames[c]["zh-CN"]).join("和"));

/** casesOf names the cases a comparison covers. */
const casesOf = (op: string) => namesOf(casesOfRelation[op]!);

/** compare evaluates a comparison of two numbers. */
const compare = (a: number, op: string, b: number) => casesOfRelation[op]!.includes(a < b ? "lt" : a === b ? "eq" : "gt");

/** relationReason says what is wrong with offering the comparison o as the negation of op. */
function relationReason(response: string, op: string, o: string): Reason {
  if (o === op) return [response, "That is the statement itself, not its negation.", "这是原命题本身，不是它的否定。"];
  const own = casesOfRelation[op]!;
  const offered = casesOfRelation[o]!;
  const extra = offered.filter((c) => own.includes(c));
  const missing = (["lt", "eq", "gt"] as const).filter((c) => !own.includes(c) && !offered.includes(c));
  const en: string[] = [];
  const zh: string[] = [];
  if (extra.length > 0) {
    en.push(`This is true in the case ${namesOf(extra).en}, where the statement is true as well.`);
    zh.push(`它在${namesOf(extra)["zh-CN"]}的情形下为真，而那时原命题也为真。`);
  }
  if (missing.length > 0) {
    en.push(`It leaves out the case ${namesOf(missing).en}, where the statement is false too.`);
    zh.push(`它漏掉了${namesOf(missing)["zh-CN"]}的情形，而那时原命题也为假。`);
  }
  return [response, en.join(" "), zh.join("")];
}

/** theNotConnective negates statements. */
export const theNotConnective: TopicDef = {
  id: "the-not-connective",
  title: t("The NOT Connective", "“非”联结词"),
  summary: t("¬p has the opposite truth value of p.", "¬p 的真假与 p 相反。"),
  intro: t(
    'The statement "$15$ is a multiple of $4$" is false. Its negation, "$15$ is not a multiple of $4$", must then be true: a negation says exactly that the statement fails. Negating twice returns to where we started: "it is not the case that $15$ is not a multiple of $4$" is false again.\n\nCheck: list the multiples of $4$ near $15$: $12, 16$. $15$ is not among them, so the negation is indeed the true one.\n\nIn this lesson we write the negation of a statement and evaluate formulas that contain $\\neg$.',
    "命题“$15$ 是 $4$ 的倍数”为假。它的否定“$15$ 不是 $4$ 的倍数”就必然为真：否定说的正是原命题不成立。否定两次就回到原处：“$15$ 不是 $4$ 的倍数，这不对”又为假。\n\n检验：列出 $15$ 附近 $4$ 的倍数：$12, 16$。$15$ 不在其中，所以确实是否定为真。\n\n本课我们写出命题的否定，并计算含 $\\neg$ 的公式的真假。",
  ),
  prerequisites: ["the-and-and-or-connectives"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "negating-a-statement",
      title: t("Negating a statement", "否定一个命题"),
      explanation: t(
        'The **negation** $\\neg p$ ("not $p$") is true exactly when $p$ is false, and false exactly when $p$ is true. So a negation must cover every case the statement leaves out, and none of the cases it includes. Two numbers compare in one of three ways: less, equal or greater. "$7 > 3$" covers only "greater", so its negation must cover both "less" and "equal": it is "$7 \\le 3$".\n\n> **Watch out.** The negation of $>$ is $\\le$, not $<$. "$7 < 3$" leaves out the case of equal numbers, where "$7 > 3$" would also be false.',
        "**否定** $\\neg p$（“非 $p$”）恰在 $p$ 为假时为真，在 $p$ 为真时为假。所以否定必须涵盖原命题没有包含的每种情形，而不包含原命题的任何情形。两个数的比较只有三种情形：小于、等于、大于。“$7 > 3$”只包含“大于”，所以它的否定要包含“小于”和“等于”两种：即“$7 \\le 3$”。\n\n> **注意。** $>$ 的否定是 $\\le$，不是 $<$。“$7 < 3$”漏掉了两数相等的情形，而那时“$7 > 3$”也为假。",
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
        const value = compare(a, op, b);
        return reasoned(
          oneOf(
            rng,
            t(`Which statement is the negation of $${a} ${op} ${b}$?`, `哪个命题是 $${a} ${op} ${b}$ 的否定？`),
            s(neg),
            [s(w1), s(w2), s(op)],
            walked(
              [
                [
                  ["See which cases the statement covers", "看原命题包含哪些情形"],
                  t(
                    `Two numbers are less, equal or greater. $${a} ${op} ${b}$ covers ${casesOf(op).en}.`,
                    `两个数只有小于、等于、大于三种情形。$${a} ${op} ${b}$ 包含${casesOf(op)["zh-CN"]}。`,
                  ),
                ],
                [
                  ["Take the other cases", "取其余的情形"],
                  t(
                    `The negation must cover exactly the rest, ${casesOf(neg).en}, which is $${a} ${neg} ${b}$.`,
                    `否定恰好包含其余情形，即${casesOf(neg)["zh-CN"]}，也就是 $${a} ${neg} ${b}$。`,
                  ),
                ],
              ],
              t(
                `With these numbers, $${a} ${op} ${b}$ is ${valueWord(value).en} and $${a} ${neg} ${b}$ is ${valueWord(!value).en}: opposite values, as a statement and its negation must have.`,
                `代入这两个数，$${a} ${op} ${b}$ 为${valueWord(value)["zh-CN"]}，$${a} ${neg} ${b}$ 为${valueWord(!value)["zh-CN"]}：真假相反，正如命题与其否定应有的那样。`,
              ),
            ),
          ),
          [w1, w2, op].map((o) => relationReason(s(o).en, op, o)),
        );
      },
    },
    {
      id: "evaluating-formulas-with-negation",
      title: t("Evaluating formulas with negation", "含否定的公式求值"),
      explanation: t(
        "A $\\neg$ applies only to what immediately follows it: a single letter, or a whole parenthesis. So the place of the $\\neg$ changes the statement. Let $p$ be true and $q$ false. In $\\neg p \\vee q$ the $\\neg$ applies to $p$ alone: $F \\vee F$, which is false. In $\\neg (p \\vee q)$ it applies to the parenthesis: $p \\vee q$ is true, so its negation is false. In $\\neg p \\vee \\neg q$ each letter is negated: $F \\vee T$, which is true.\n\n> **Watch out.** $\\neg p \\vee q$ is not $\\neg(p \\vee q)$. Without parentheses, the $\\neg$ stops at the first letter.",
        "$\\neg$ 只作用于紧跟其后的部分：一个字母，或者整个括号。所以 $\\neg$ 的位置会改变命题。设 $p$ 为真、$q$ 为假。在 $\\neg p \\vee q$ 中，$\\neg$ 只作用于 $p$：$F \\vee F$，为假。在 $\\neg (p \\vee q)$ 中，它作用于整个括号：$p \\vee q$ 为真，所以它的否定为假。在 $\\neg p \\vee \\neg q$ 中，每个字母都被否定：$F \\vee T$，为真。\n\n> **注意。** $\\neg p \\vee q$ 不是 $\\neg(p \\vee q)$。没有括号时，$\\neg$ 只管到第一个字母。",
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

/** equivalenceSolution explains an equivalence check by listing both columns, then checks it on one row. */
function equivalenceSolution(f: Formula, g: Formula): Text {
  const vars = varsOf(f, g);
  const table = rows(vars);
  const cf = table.map((env) => TF(evaluate(f, env))).join(", ");
  const cg = table.map((env) => TF(evaluate(g, env))).join(", ");
  const same = cf === cg;
  const differ = differingRow(f, g);
  return walked(
    [
      [
        ["List the rows", "列出各行"],
        t(
          `The statements use ${vars.map((x) => `$${x}$`).join(" and ")}, so the truth table has $${table.length}$ rows, from all true to all false.`,
          `两个命题用到 ${vars.map((x) => `$${x}$`).join("和")}，所以真值表有 $${table.length}$ 行，从全真排到全假。`,
        ),
      ],
      [
        ["Fill in both columns", "填出两列"],
        t(`$${tex(f)}$ takes the values ${cf}, and $${tex(g)}$ takes ${cg}.`, `$${tex(f)}$ 依次为 ${cf}，$${tex(g)}$ 依次为 ${cg}。`),
      ],
      [
        ["Compare", "比较"],
        same
          ? t("The columns agree in every row, so the statements are equivalent.", "两列每一行都相同，所以两命题等价。")
          : t("The columns differ in at least one row, so the statements are not equivalent.", "两列至少有一行不同，所以两命题不等价。"),
      ],
    ],
    differ
      ? t(
          `One row settles it: where ${rowWhere(differ, f, g).en}, $${tex(f)}$ is ${TF(evaluate(f, differ))} but $${tex(g)}$ is ${TF(evaluate(g, differ))}.`,
          `一行就足以判定：当${rowWhere(differ, f, g)["zh-CN"]}时，$${tex(f)}$ 为 ${TF(evaluate(f, differ))}，而 $${tex(g)}$ 为 ${TF(evaluate(g, differ))}。`,
        )
      : rowCheck(f, g),
  );
}

/** equivalenceReasons say what is wrong with answering Yes or No to whether f and g are equivalent. */
function equivalenceReasons(f: Formula, g: Formula): Reason[] {
  return equivalent(f, g)
    ? [["No", "Look for a row where the columns differ: there is none.", "找一找两列不同的行：一行也没有。"]]
    : [
        [
          "Yes",
          "Agreeing in some rows is not enough; equivalent statements agree in every row. Compare the columns row by row.",
          "在某些行相同还不够；等价的命题每一行都相同。逐行比较两列。",
        ],
      ];
}

/** logicalEquivalence compares statements with truth tables. */
export const logicalEquivalence: TopicDef = {
  id: "logical-equivalence",
  title: t("Logical Equivalence", "逻辑等价"),
  summary: t(
    "Two statements are logically equivalent, written ≡, when they have the same truth value in every row of the truth table.",
    "若两个命题在真值表的每一行中都真假相同，则它们逻辑等价，记作 ≡。",
  ),
  intro: t(
    'Compare $\\neg(\\neg p)$ with $p$. If $p$ is true, $\\neg p$ is false and $\\neg(\\neg p)$ is true; if $p$ is false, $\\neg p$ is true and $\\neg(\\neg p)$ is false. In both rows the two statements have the same value, so they say the same thing: they are **logically equivalent**, $\\neg(\\neg p) \\equiv p$. By contrast $p \\wedge q$ and $p \\vee q$ are not, since they differ when $p$ is true and $q$ false.\n\nCheck: with $p$ the statement "$5$ is odd", "it is not the case that $5$ is not odd" is true, and so is $p$.\n\nIn this lesson we decide with a truth table whether two statements are equivalent, and pick out an equivalent statement from several.',
    "比较 $\\neg(\\neg p)$ 与 $p$。若 $p$ 为真，$\\neg p$ 为假，$\\neg(\\neg p)$ 为真；若 $p$ 为假，$\\neg p$ 为真，$\\neg(\\neg p)$ 为假。两行中两个命题都真假相同，所以它们说的是同一件事：它们**逻辑等价**，$\\neg(\\neg p) \\equiv p$。相反，$p \\wedge q$ 与 $p \\vee q$ 不等价，因为在 $p$ 真 $q$ 假时它们不同。\n\n检验：令 $p$ 为命题“$5$ 是奇数”，“$5$ 不是奇数，这不对”为真，$p$ 也为真。\n\n本课我们用真值表判断两个命题是否等价，并从几个命题中选出等价的一个。",
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
        "Two statements are equivalent when no assignment of truth values can tell them apart, so to decide whether $P \\equiv Q$, build both columns of the truth table. They are equivalent if the columns agree in every row; a single row where they differ shows they are not. For example, take $\\neg(p \\wedge \\neg q)$ and $\\neg p \\vee q$. Row by row, TT, TF, FT, FF, the first is T, F, T, T and the second is T, F, T, T. The columns agree, so the statements are equivalent.\n\n> **Watch out.** Agreeing in one or two rows proves nothing. Equivalence needs every row; a difference needs only one.",
        "两个命题等价，是指任何真值取法都无法把它们区分开，所以要判断 $P \\equiv Q$ 是否成立，就在真值表中列出两列。若每一行都相同则等价；只要有一行不同，就不等价。例如看 $\\neg(p \\wedge \\neg q)$ 与 $\\neg p \\vee q$。按 TT、TF、FT、FF 各行，前者为 T、F、T、T，后者为 T、F、T、T。两列相同，所以两命题等价。\n\n> **注意。** 在一两行中相同证明不了什么。等价需要每一行都相同；不等价只需一行不同。",
      ),
      generate(rng) {
        for (;;) {
          const f = randomFormula(rng, 2, ["p", "q"], ["and", "or"]);
          if (varsOf(f).length < 2) continue;
          const candidates = mutations(f);
          const g = rng.bool() ? deMorganRewrite(f) : rng.pick(candidates);
          if (tex(g) === tex(f)) continue;
          const same = equivalent(f, g);
          return reasoned(
            oneOf(
              rng,
              t(`Are $${tex(f)}$ and $${tex(g)}$ logically equivalent?`, `$${tex(f)}$ 与 $${tex(g)}$ 逻辑等价吗？`),
              t(same ? "Yes" : "No", same ? "是" : "否"),
              [t(same ? "No" : "Yes", same ? "否" : "是")],
              equivalenceSolution(f, g),
            ),
            equivalenceReasons(f, g),
          );
        }
      },
    },
    {
      id: "choosing-an-equivalent-statement",
      title: t("Choosing an equivalent statement", "选出等价的命题"),
      explanation: t(
        "Among several candidates, only those whose truth-table column matches the original are equivalent. A full table is not always needed to rule a candidate out: one row where it differs from the original is enough. For $\\neg(p \\vee q)$, the candidate $\\neg p \\vee \\neg q$ fails at once in the row where $p$ is true and $q$ false: there $\\neg(p \\vee q)$ is F, but $\\neg p \\vee \\neg q$ is T. The candidate $\\neg p \\wedge \\neg q$ agrees in all four rows, so it is the equivalent one.\n\n> **Watch out.** A candidate that looks like the original, with the same letters and a negation in each place, can still differ in a row. Test it; do not judge by its shape.",
        "在几个候选项中，只有真值表列与原命题相同的才等价。排除一个候选项不一定要列出整张表：只要有一行与原命题不同就够了。对 $\\neg(p \\vee q)$，候选项 $\\neg p \\vee \\neg q$ 在 $p$ 真 $q$ 假的那一行就不行：那里 $\\neg(p \\vee q)$ 为 F，而 $\\neg p \\vee \\neg q$ 为 T。候选项 $\\neg p \\wedge \\neg q$ 四行都相同，所以它是等价的那个。\n\n> **注意。** 一个候选项看起来像原命题，字母相同、各处也都有否定，仍可能在某一行不同。要检验，不要只看形式。",
      ),
      generate(rng) {
        for (;;) {
          const f = randomFormula(rng, 2, ["p", "q"], ["and", "or"]);
          const g = deMorganRewrite(f);
          if (varsOf(f).length < 2 || tex(g) === tex(f)) continue;
          return equivalentChoice(rng, f, g, columnSteps(f, g));
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

/** LawName names the kinds of laws of this module. */
type LawName = "commutative" | "associative" | "distributive" | "absorption" | "deMorgan";

/** Law is a named equivalence with an example pair. */
interface Law {
  readonly kind: LawName;
  readonly make: (a: Formula, b: Formula, c: Formula) => [Formula, Formula];
}

/** lawTexts name each kind of law, say what it changes, and say how to spot it. */
const lawTexts: Record<LawName, { readonly name: Text; readonly does: Text }> = {
  commutative: {
    name: t("Commutative law", "交换律"),
    does: t("swaps the two sides of one connective and changes nothing else", "交换同一个联结词两边的次序，其余不变"),
  },
  associative: {
    name: t("Associative law", "结合律"),
    does: t(
      "moves the parentheses among three parts joined by the same connective, keeping their order",
      "在用同一联结词连接的三部分之间移动括号，次序不变",
    ),
  },
  distributive: {
    name: t("Distributive law", "分配律"),
    does: t(
      "applies one part to each part inside a parenthesis of the other connective, so that part appears twice on one side",
      "把一部分分别作用到另一种联结词括号里的每一部分上，于是这一部分在一边出现两次",
    ),
  },
  absorption: {
    name: t("Absorption law", "吸收律"),
    does: t(
      "removes a parenthesis that contains a part already standing beside it, leaving that part alone",
      "当括号里含有括号外已有的那一部分时，去掉整个括号，只留下这一部分",
    ),
  },
  deMorgan: {
    name: t("De Morgan's law", "德摩根律"),
    does: t(
      "moves a negation across a parenthesis, negating each part and swapping $\\wedge$ with $\\vee$",
      "把否定移过括号，否定每一部分，并互换 $\\wedge$ 与 $\\vee$",
    ),
  },
};

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
  { kind: "commutative", make: (a, b) => [and(a, b), and(b, a)] },
  { kind: "commutative", make: (a, b) => [or(a, b), or(b, a)] },
  { kind: "associative", make: (a, b, c) => [and(and(a, b), c), and(a, and(b, c))] },
  { kind: "associative", make: (a, b, c) => [or(a, or(b, c)), or(or(a, b), c)] },
  { kind: "distributive", make: (a, b, c) => [and(a, or(b, c)), or(and(a, b), and(a, c))] },
  { kind: "distributive", make: (a, b, c) => [or(a, and(b, c)), and(or(a, b), or(a, c))] },
  { kind: "absorption", make: (a, b) => [or(a, and(a, b)), a] },
  { kind: "absorption", make: (a, b) => [and(a, or(a, b)), a] },
  { kind: "deMorgan", make: (a, b) => [not(and(a, b)), or(not(a), not(b))] },
  { kind: "deMorgan", make: (a, b) => [not(or(a, b)), and(not(a), not(b))] },
];

/** lawReason says what a wrongly named law does, which the given equivalence does not. */
const lawReason = (kind: LawName): Reason => [
  lawTexts[kind].name.en,
  `The ${lawTexts[kind].name.en.toLowerCase()} ${lawTexts[kind].does.en}. Compare the two sides again: that is not what happens here.`,
  `${lawTexts[kind].name["zh-CN"]}${lawTexts[kind].does["zh-CN"]}。再比较一下两边：这里发生的不是这种变化。`,
];

/** nameTheLaw asks which law justifies an equivalence drawn from the given indices; names lists the kinds offered. */
function nameTheLaw(rng: Rng, indices: readonly number[], names: readonly LawName[]): Problem {
  const law = laws[rng.pick(indices)]!;
  const [a, b, c] = threeLiterals(rng);
  const [left, right] = law.make(a, b, c);
  const flip = rng.bool();
  const [x, y] = flip ? [right, left] : [left, right];
  const text = lawTexts[law.kind];
  const others = names.filter((n) => n !== law.kind);
  return reasoned(
    oneOf(
      rng,
      t(`Which law justifies $${tex(x)} \\equiv ${tex(y)}$?`, `哪条定律说明 $${tex(x)} \\equiv ${tex(y)}$？`),
      text.name,
      rng.shuffle(others.map((n) => lawTexts[n].name)),
      walked(
        [
          [
            ["Compare the two sides", "比较两边"],
            t(
              `Going from $${tex(left)}$ to $${tex(right)}$, the step ${text.does.en}.`,
              `从 $${tex(left)}$ 到 $${tex(right)}$，这一步${text.does["zh-CN"]}。`,
            ),
          ],
          [["Name the law", "说出定律"], t(`That is the ${text.name.en.toLowerCase()}.`, `这就是${text.name["zh-CN"]}。`)],
        ],
        rowCheck(x, y),
      ),
    ),
    others.map(lawReason),
  );
}

/** applyTheLaw asks for the result of applying a law to a formula. */
function applyTheLaw(rng: Rng, indices: readonly number[]): Problem {
  const law = laws[rng.pick(indices)]!;
  const [a, b, c] = threeLiterals(rng);
  const [left, right] = law.make(a, b, c);
  const text = lawTexts[law.kind];
  return equivalentChoice(rng, left, right, [
    [
      ["Recognize the shape", "认出形式"],
      t(
        `$${tex(left)}$ has the shape the ${text.name.en.toLowerCase()} works on, which ${text.does.en}.`,
        `$${tex(left)}$ 正是${text.name["zh-CN"]}适用的形式；${text.name["zh-CN"]}${text.does["zh-CN"]}。`,
      ),
    ],
    [["Apply it", "应用定律"], t(`So $${tex(left)} \\equiv ${tex(right)}$.`, `所以 $${tex(left)} \\equiv ${tex(right)}$。`)],
  ]);
}

/** logicalAssociativeAndCommutativeLaws reorders and regroups conjunctions and disjunctions. */
export const logicalAssociativeAndCommutativeLaws: TopicDef = {
  id: "logical-associative-and-commutative-laws",
  title: t("Logical Associative and Commutative Laws", "逻辑的结合律与交换律"),
  summary: t(
    "∧ and ∨ are each commutative and associative, so their operands can be reordered and regrouped freely.",
    "∧ 与 ∨ 都满足交换律和结合律，所以它们的运算对象可以任意交换次序和重新分组。",
  ),
  intro: t(
    '"$6$ is even and $6 > 4$" and "$6 > 4$ and $6$ is even" claim the same two things, so they must be true together and false together: $p \\wedge q \\equiv q \\wedge p$. Likewise, claiming $p$, $q$ and $r$ as "$p$ and $q$, and also $r$" or as "$p$, and also $q$ and $r$" makes no difference: $(p \\wedge q) \\wedge r \\equiv p \\wedge (q \\wedge r)$. The same holds for $\\vee$.\n\nCheck: in the row where $p$ is false and $q$, $r$ are true, $(p \\wedge q) \\wedge r$ is $F \\wedge T = F$ and $p \\wedge (q \\wedge r)$ is $F \\wedge T = F$.\n\nIn this lesson we name the commutative and associative laws and use them to rewrite statements.',
    "“$6$ 是偶数且 $6 > 4$”与“$6 > 4$ 且 $6$ 是偶数”断言的是同样两件事，所以它们同真同假：$p \\wedge q \\equiv q \\wedge p$。同样，把 $p$、$q$、$r$ 说成“$p$ 且 $q$，再且 $r$”还是“$p$，再且 $q$ 且 $r$”，没有区别：$(p \\wedge q) \\wedge r \\equiv p \\wedge (q \\wedge r)$。$\\vee$ 也一样。\n\n检验：在 $p$ 假、$q$ 与 $r$ 真的那一行，$(p \\wedge q) \\wedge r$ 为 $F \\wedge T = F$，$p \\wedge (q \\wedge r)$ 为 $F \\wedge T = F$。\n\n本课我们说出交换律与结合律，并用它们改写命题。",
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
        "**Commutative laws:** $p \\wedge q \\equiv q \\wedge p$ and $p \\vee q \\equiv q \\vee p$. **Associative laws:** $(p \\wedge q) \\wedge r \\equiv p \\wedge (q \\wedge r)$ and $(p \\vee q) \\vee r \\equiv p \\vee (q \\vee r)$. Each holds because $\\wedge$ asks for all of its parts and $\\vee$ for at least one, whatever their order and grouping; a truth table confirms it. To name the law, compare the two sides: in $\\neg r \\vee (p \\vee q) \\equiv (p \\vee q) \\vee \\neg r$ the parts trade places, so it is commutativity; in $(\\neg r \\vee p) \\vee q \\equiv \\neg r \\vee (p \\vee q)$ the order stays and the parentheses move, so it is associativity.\n\n> **Watch out.** Reordering is commutativity; regrouping is associativity. If the letters keep their order and only the parentheses move, it is not the commutative law.",
        "**交换律：**$p \\wedge q \\equiv q \\wedge p$，$p \\vee q \\equiv q \\vee p$。**结合律：**$(p \\wedge q) \\wedge r \\equiv p \\wedge (q \\wedge r)$，$(p \\vee q) \\vee r \\equiv p \\vee (q \\vee r)$。它们成立，是因为不论次序和分组如何，$\\wedge$ 都要求每一部分成立，$\\vee$ 都要求至少一部分成立；真值表可以验证。要说出定律，就比较两边：在 $\\neg r \\vee (p \\vee q) \\equiv (p \\vee q) \\vee \\neg r$ 中，两部分交换了位置，是交换律；在 $(\\neg r \\vee p) \\vee q \\equiv \\neg r \\vee (p \\vee q)$ 中，次序不变而括号移动，是结合律。\n\n> **注意。** 交换次序是交换律，重新分组是结合律。字母次序不变、只移动括号时，用的不是交换律。",
      ),
      generate: (rng) => nameTheLaw(rng, [0, 1, 2, 3], ["commutative", "associative", "distributive", "absorption", "deMorgan"]),
    },
    {
      id: "applying-associative-and-commutative-laws",
      title: t("Applying the laws", "应用定律"),
      explanation: t(
        "To apply a law, match the statement to one side of it, then write the other side with the same parts. In $(q \\wedge \\neg s) \\wedge p$ all three parts are joined by $\\wedge$, so the associative law regroups it as $q \\wedge (\\neg s \\wedge p)$, and the commutative law may then reorder any two sides. The laws apply only within one connective: when $\\wedge$ and $\\vee$ are mixed they say nothing.\n\n> **Watch out.** $(p \\wedge q) \\vee r$ cannot be regrouped as $p \\wedge (q \\vee r)$: the connectives differ. With $p$ false and $r$ true, the first is true and the second false.",
        "应用定律时，先把命题对上定律的一边，再用同样的各部分写出另一边。在 $(q \\wedge \\neg s) \\wedge p$ 中，三部分都用 $\\wedge$ 连接，所以结合律把它重新分组为 $q \\wedge (\\neg s \\wedge p)$，之后交换律还可以交换任意两边。这些定律只适用于同一种联结词：$\\wedge$ 与 $\\vee$ 混在一起时，它们不起作用。\n\n> **注意。** $(p \\wedge q) \\vee r$ 不能重新分组为 $p \\wedge (q \\vee r)$：联结词不同。$p$ 假、$r$ 真时，前者为真，后者为假。",
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
  intro: t(
    'A café offers "soup, and coffee or tea". You can have soup with coffee, or soup with tea: $p \\wedge (q \\vee r)$ says the same as $(p \\wedge q) \\vee (p \\wedge r)$. The "and" has been handed to each part of the "or", just as $2(3 + 4) = 2 \\cdot 3 + 2 \\cdot 4$.\n\nCheck: with $p$ true, $q$ false and $r$ true, $p \\wedge (q \\vee r)$ is $T \\wedge T = T$, and $(p \\wedge q) \\vee (p \\wedge r)$ is $F \\vee T = T$.\n\nIn this lesson we expand statements with the distributive laws and read the laws backwards to factor.',
    "一家咖啡馆提供“汤，以及咖啡或茶”。你可以要汤配咖啡，也可以要汤配茶：$p \\wedge (q \\vee r)$ 与 $(p \\wedge q) \\vee (p \\wedge r)$ 说的是同一件事。“且”被分给了“或”的每一部分，就像 $2(3 + 4) = 2 \\cdot 3 + 2 \\cdot 4$。\n\n检验：$p$ 真、$q$ 假、$r$ 真时，$p \\wedge (q \\vee r)$ 为 $T \\wedge T = T$，$(p \\wedge q) \\vee (p \\wedge r)$ 为 $F \\vee T = T$。\n\n本课我们用分配律展开命题，并把分配律倒过来用于提取公因式。",
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
        "In logic, and distributes over or just as multiplication distributes over addition: $p \\wedge (q \\vee r) \\equiv (p \\wedge q) \\vee (p \\wedge r)$. Unlike arithmetic, or also distributes over and: $p \\vee (q \\wedge r) \\equiv (p \\vee q) \\wedge (p \\vee r)$, which has no counterpart for numbers. Both hold row by row: in the second, if $p$ is true both sides are true, and if $p$ is false both sides reduce to $q \\wedge r$. To expand $\\neg s \\vee (q \\wedge p)$, hand $\\neg s \\vee$ to each part: $(\\neg s \\vee q) \\wedge (\\neg s \\vee p)$.\n\n> **Watch out.** The connective outside the parentheses goes inside, and the one inside comes out. Expanding $p \\vee (q \\wedge r)$ as $(p \\vee q) \\vee (p \\vee r)$, with $\\vee$ in both places, loses the $\\wedge$.",
        "在逻辑中，“且”对“或”满足分配律，就像乘法对加法一样：$p \\wedge (q \\vee r) \\equiv (p \\wedge q) \\vee (p \\wedge r)$。与算术不同，“或”对“且”也满足分配律：$p \\vee (q \\wedge r) \\equiv (p \\vee q) \\wedge (p \\vee r)$，数的运算中没有对应的规律。两条都可以逐行验证：在第二条中，若 $p$ 真，两边都为真；若 $p$ 假，两边都化为 $q \\wedge r$。要展开 $\\neg s \\vee (q \\wedge p)$，就把 $\\neg s \\vee$ 分给每一部分：$(\\neg s \\vee q) \\wedge (\\neg s \\vee p)$。\n\n> **注意。** 括号外的联结词进到括号里，括号里的联结词到外面来。把 $p \\vee (q \\wedge r)$ 展开成 $(p \\vee q) \\vee (p \\vee r)$，两处都用 $\\vee$，就把 $\\wedge$ 丢掉了。",
      ),
      generate: (rng) => applyTheLaw(rng, [4, 5]),
    },
    {
      id: "factoring-with-the-distributive-laws",
      title: t("Factoring", "提取公因式"),
      explanation: t(
        "Reading a distributive law from right to left pulls out a part shared by two clauses, which shortens the statement. In $(p \\vee q) \\wedge (p \\vee \\neg r)$ both clauses contain $p \\vee$, so $p$ comes out once and the other parts stay joined by the outer connective: $p \\vee (q \\wedge \\neg r)$.\n\n> **Watch out.** Only a part that appears in both clauses can be factored out, and it must be joined to them by the same connective in each.",
        "从右往左读分配律，可以提出两个子句共有的部分，使命题变短。在 $(p \\vee q) \\wedge (p \\vee \\neg r)$ 中，两个子句都含 $p \\vee$，所以把 $p$ 提出来一次，其余部分仍用外层的联结词连接：$p \\vee (q \\wedge \\neg r)$。\n\n> **注意。** 只有两个子句中都出现的部分才能提出来，而且它在两个子句中必须用同一种联结词连接。",
      ),
      generate(rng) {
        const law = laws[rng.pick([4, 5])]!;
        const [a, b, c] = threeLiterals(rng);
        const [factored, expanded] = law.make(a, b, c);
        return equivalentChoice(rng, expanded, factored, [
          [
            ["Find the shared part", "找出公共部分"],
            t(`Both clauses of $${tex(expanded)}$ contain $${tex(a)}$.`, `$${tex(expanded)}$ 的两个子句都含 $${tex(a)}$。`),
          ],
          [
            ["Factor it out", "把它提出来"],
            t(
              `By the distributive law read from right to left, $${tex(a)}$ comes out once and the remaining parts keep the outer connective: $${tex(expanded)} \\equiv ${tex(factored)}$.`,
              `由分配律从右往左读，$${tex(a)}$ 提出一次，其余部分保留外层的联结词：$${tex(expanded)} \\equiv ${tex(factored)}$。`,
            ),
          ],
        ]);
      },
    },
  ],
};

/** theAbsorptionLaws simplifies p ∨ (p ∧ q) and p ∧ (p ∨ q) to p. */
export const theAbsorptionLaws: TopicDef = {
  id: "the-absorption-laws",
  title: t("The Absorption Laws", "吸收律"),
  summary: t("p ∨ (p ∧ q) ≡ p and p ∧ (p ∨ q) ≡ p.", "p ∨ (p ∧ q) ≡ p，p ∧ (p ∨ q) ≡ p。"),
  intro: t(
    '"$n$ is even, or $n$ is even and greater than $10$." The second part can only hold when the first already does, so it adds nothing: the statement says just "$n$ is even". That is absorption, $p \\vee (p \\wedge q) \\equiv p$.\n\nCheck: for $n = 12$ both are true; for $n = 7$ both are false; for $n = 4$ both are true, since $4$ is even even though it is not greater than $10$.\n\nIn this lesson we simplify with the absorption laws and name each of the laws met so far.',
    "“$n$ 是偶数，或者 $n$ 是大于 $10$ 的偶数。”第二部分只有在第一部分已经成立时才会成立，所以它没有增加任何内容：这个命题说的就是“$n$ 是偶数”。这就是吸收律，$p \\vee (p \\wedge q) \\equiv p$。\n\n检验：$n = 12$ 时两者都为真；$n = 7$ 时两者都为假；$n = 4$ 时两者都为真，因为 $4$ 是偶数，虽然它不大于 $10$。\n\n本课我们用吸收律化简，并说出到目前为止学过的每条定律。",
  ),
  prerequisites: ["the-distributive-laws"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "simplifying-with-absorption",
      title: t("Simplifying with absorption", "用吸收律化简"),
      explanation: t(
        "In $p \\vee (p \\wedge q)$, whenever $p \\wedge q$ is true, $p$ is already true, so the parenthesis can never make the statement true on its own: the whole statement is just $p$. Similarly, in $p \\wedge (p \\vee q)$, whenever $p$ is true the parenthesis is true too, so the statement is again $p$. For example $\\neg r \\wedge (\\neg r \\vee s) \\equiv \\neg r$. The **idempotent laws** $p \\wedge p \\equiv p$ and $p \\vee p \\equiv p$ are simpler cases.\n\n> **Watch out.** What survives is the part that stands alone, $p$, not the other part $q$ and not the parenthesis.",
        "在 $p \\vee (p \\wedge q)$ 中，只要 $p \\wedge q$ 为真，$p$ 就已经为真，所以括号永远不能单独使命题为真：整个命题就是 $p$。同理，在 $p \\wedge (p \\vee q)$ 中，只要 $p$ 为真，括号也为真，所以命题仍是 $p$。例如 $\\neg r \\wedge (\\neg r \\vee s) \\equiv \\neg r$。**幂等律** $p \\wedge p \\equiv p$、$p \\vee p \\equiv p$ 是更简单的情形。\n\n> **注意。** 留下的是单独出现的那部分 $p$，不是另一部分 $q$，也不是括号。",
      ),
      generate: (rng) => applyTheLaw(rng, [6, 7]),
    },
    {
      id: "naming-the-laws",
      title: t("Naming the law", "说出定律"),
      explanation: t(
        "Recognize each law by what changes between the two sides: the order of two parts (commutative), the place of the parentheses (associative), one part handed to each part of a parenthesis (distributive), or a parenthesis swallowed by a part beside it (absorption). In $(q \\vee \\neg p) \\wedge (q \\vee r) \\equiv q \\vee (\\neg p \\wedge r)$, the part $q$ appears twice on the left and once on the right, so it is the distributive law.\n\n> **Watch out.** Distribution and absorption both start with a part beside a parenthesis. If that part also appears inside the parenthesis, the parenthesis disappears: absorption. If it does not, it is handed inside: distribution.",
        "按两边之间的变化来辨认定律：两部分的次序（交换律）、括号的位置（结合律）、一部分分给括号里的每一部分（分配律）、括号被旁边的部分吸收（吸收律）。在 $(q \\vee \\neg p) \\wedge (q \\vee r) \\equiv q \\vee (\\neg p \\wedge r)$ 中，$q$ 在左边出现两次、右边出现一次，所以这是分配律。\n\n> **注意。** 分配律和吸收律开头都是括号旁边有一部分。若这一部分也出现在括号里，括号就消失：吸收律。若没有，它就被分进括号里：分配律。",
      ),
      generate: (rng) => nameTheLaw(rng, [0, 1, 2, 3, 4, 5, 6, 7], ["commutative", "associative", "distributive", "absorption"]),
    },
  ],
};

/** deMorgansLawsForLogic negates conjunctions and disjunctions. */
export const deMorgansLawsForLogic: TopicDef = {
  id: "de-morgans-laws-for-logic",
  title: t("De Morgan's Laws for Logic", "逻辑中的德摩根律"),
  summary: t("¬(p ∧ q) ≡ ¬p ∨ ¬q and ¬(p ∨ q) ≡ ¬p ∧ ¬q.", "¬(p ∧ q) ≡ ¬p ∨ ¬q，¬(p ∨ q) ≡ ¬p ∧ ¬q。"),
  intro: t(
    'A sign says "Members must bring an ID and a ticket." When is that rule not met? When someone lacks the ID, or lacks the ticket: one missing item is enough. So "not (ID and ticket)" is "no ID or no ticket", $\\neg(p \\wedge q) \\equiv \\neg p \\vee \\neg q$. In the same way "not (ID or ticket)" means neither, "no ID and no ticket".\n\nCheck: someone with an ID but no ticket breaks the rule, and indeed "no ID or no ticket" is true for them.\n\nIn this lesson we move a negation inside parentheses with De Morgan\'s laws and negate compound sentences.',
    "告示上写着“会员必须带证件和门票”。什么时候不满足这条规定？没带证件，或者没带门票：缺一样就够了。所以“并非（证件且门票）”就是“没有证件或没有门票”，$\\neg(p \\wedge q) \\equiv \\neg p \\vee \\neg q$。同理，“并非（证件或门票）”是两样都没有，即“没有证件且没有门票”。\n\n检验：带了证件却没带门票的人违反了规定，而对他来说“没有证件或没有门票”确实为真。\n\n本课我们用德摩根律把否定移入括号，并否定复合语句。",
  ),
  prerequisites: ["the-absorption-laws"],
  encompasses: [{ topic: "the-not-connective", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "pushing-negations-inward",
      title: t("Pushing negations inward", "把否定移入括号"),
      explanation: t(
        '**De Morgan\'s laws:** $\\neg(p \\wedge q) \\equiv \\neg p \\vee \\neg q$ and $\\neg(p \\vee q) \\equiv \\neg p \\wedge \\neg q$. An "and" fails when at least one part fails, and an "or" fails when every part fails; that is why the connective swaps. A negation moves inside by negating each part and swapping $\\wedge$ with $\\vee$, and double negations cancel: $\\neg \\neg p \\equiv p$. Take $\\neg(\\neg p \\vee (q \\wedge r))$. The outer $\\vee$ becomes $\\wedge$, giving $\\neg \\neg p \\wedge \\neg(q \\wedge r)$. Then $\\neg \\neg p$ is $p$, and $\\neg(q \\wedge r)$ is $\\neg q \\vee \\neg r$. So the statement is $p \\wedge (\\neg q \\vee \\neg r)$.\n\n> **Watch out.** Negating each part is only half of the law: the connective must swap too. $\\neg(p \\wedge q)$ is not $\\neg p \\wedge \\neg q$.',
        "**德摩根律：**$\\neg(p \\wedge q) \\equiv \\neg p \\vee \\neg q$，$\\neg(p \\vee q) \\equiv \\neg p \\wedge \\neg q$。“且”只要有一部分不成立就不成立，“或”要每一部分都不成立才不成立；这就是联结词要互换的原因。否定移入括号时，要否定每一部分并互换 $\\wedge$ 与 $\\vee$；双重否定相互抵消：$\\neg \\neg p \\equiv p$。看 $\\neg(\\neg p \\vee (q \\wedge r))$。外层的 $\\vee$ 变为 $\\wedge$，得 $\\neg \\neg p \\wedge \\neg(q \\wedge r)$。$\\neg \\neg p$ 就是 $p$，$\\neg(q \\wedge r)$ 是 $\\neg q \\vee \\neg r$。所以命题为 $p \\wedge (\\neg q \\vee \\neg r)$。\n\n> **注意。** 否定每一部分只是定律的一半：联结词也必须互换。$\\neg(p \\wedge q)$ 不是 $\\neg p \\wedge \\neg q$。",
      ),
      generate(rng) {
        for (;;) {
          const inner = randomFormula(rng, 2, ["p", "q", "r"], ["and", "or"]);
          if (inner.k !== "and" && inner.k !== "or") continue;
          const f = not(inner);
          const g = deMorganRewrite(f);
          const swapped = inner.k === "and" ? "\\vee" : "\\wedge";
          const outer = and(not(inner.a), not(inner.b));
          const first = inner.k === "and" ? or(not(inner.a), not(inner.b)) : outer;
          return equivalentChoice(rng, f, g, [
            [
              ["Move the outer negation in", "把外层否定移入"],
              t(
                `The negation applies to a ${inner.k === "and" ? "conjunction" : "disjunction"}, so by De Morgan's law each side is negated and the connective becomes $${swapped}$: $${tex(first)}$.`,
                `否定作用于一个${inner.k === "and" ? "合取" : "析取"}，所以由德摩根律，每一边都加上否定，联结词变为 $${swapped}$：$${tex(first)}$。`,
              ),
            ],
            [
              ["Simplify each side", "化简每一边"],
              t(
                `Cancel double negations, $\\neg \\neg A \\equiv A$, and move any negation that stands before a parenthesis inward in the same way: $${tex(g)}$.`,
                `消去双重否定 $\\neg \\neg A \\equiv A$，括号前若还有否定，也同样移入：$${tex(g)}$。`,
              ),
            ],
          ]);
        }
      },
    },
    {
      id: "negating-compound-sentences",
      title: t("Negating compound sentences", "否定复合语句"),
      explanation: t(
        'De Morgan\'s laws hold for sentences, not only symbols. "$x$ is even and $x > 3$" fails as soon as one part fails, so its negation is "$x$ is not even or $x \\le 3$". "$x$ is even or $x > 3$" fails only when both parts fail, so its negation is "$x$ is not even and $x \\le 3$". In each case, negate both parts and change the connective.\n\n> **Watch out.** Negate each part correctly too: the negation of "$x > 3$" is "$x \\le 3$", not "$x < 3$".',
        "德摩根律不只适用于符号，也适用于语句。“$x$ 是偶数且 $x > 3$”只要有一部分不成立就不成立，所以它的否定是“$x$ 不是偶数或 $x \\le 3$”。“$x$ 是偶数或 $x > 3$”要两部分都不成立才不成立，所以它的否定是“$x$ 不是偶数且 $x \\le 3$”。两种情形都是：否定两部分，并改变联结词。\n\n> **注意。** 每一部分的否定也要写对：“$x > 3$”的否定是“$x \\le 3$”，不是“$x < 3$”。",
      ),
      generate(rng) {
        const [a, b] = twoAtoms(rng);
        const isAnd = rng.bool();
        const [w, wz] = isAnd ? ["and", "且"] : ["or", "或"];
        const [ow, owz] = isAnd ? ["or", "或"] : ["and", "且"];
        const s = (x: Text, y: Text, en: string, zh: string) => t(`${x.en} ${en} ${y.en}`, `${x["zh-CN"]} ${zh} ${y["zh-CN"]}`);
        const value = isAnd ? a.value && b.value : a.value || b.value;
        const negValue = isAnd ? !a.value || !b.value : !a.value && !b.value;
        return reasoned(
          oneOf(
            rng,
            t(
              `Which statement is the negation of "${a.text.en} ${w} ${b.text.en}"?`,
              `哪个命题是“${a.text["zh-CN"]} ${wz} ${b.text["zh-CN"]}”的否定？`,
            ),
            s(a.negation, b.negation, ow, owz),
            [s(a.negation, b.negation, w, wz), s(a.negation, b.text, w, wz), s(a.text, b.negation, ow, owz)],
            walked(
              [
                [
                  ["Apply De Morgan's law", "用德摩根律"],
                  t(
                    `The negation of an "${w}" sentence is an "${ow}" sentence of the negated parts.`,
                    `“${wz}”语句的否定，是各部分否定之后用“${owz}”连接的语句。`,
                  ),
                ],
                [
                  ["Negate each part", "否定每一部分"],
                  t(
                    `"${a.text.en}" becomes "${a.negation.en}", and "${b.text.en}" becomes "${b.negation.en}".`,
                    `“${a.text["zh-CN"]}”变为“${a.negation["zh-CN"]}”，“${b.text["zh-CN"]}”变为“${b.negation["zh-CN"]}”。`,
                  ),
                ],
              ],
              t(
                `The original sentence is ${valueWord(value).en}, and its negation is ${valueWord(negValue).en}: opposite values, as they must be.`,
                `原语句为${valueWord(value)["zh-CN"]}，它的否定为${valueWord(negValue)["zh-CN"]}：真假相反，正应如此。`,
              ),
            ),
          ),
          [
            [
              s(a.negation, b.negation, w, wz).en,
              `Both parts are negated, but the connective is still "${w}". De Morgan's law also changes it.`,
              `两部分都否定了，但联结词仍是“${wz}”。德摩根律还要求改变联结词。`,
            ],
            [s(a.negation, b.text, w, wz).en, "Only the first part is negated.", "只否定了第一部分。"],
            [
              s(a.text, b.negation, ow, owz).en,
              "The first part is left as it was; both parts must be negated.",
              "第一部分没有否定；两部分都要否定。",
            ],
          ],
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
  intro: t(
    'A teacher promises: "If you finish the project, then you get a bonus point." Four things can happen. You finish and get the point: the promise is kept. You finish and get no point: the promise is broken. You do not finish: whatever happens, the promise said nothing about that case, so it is not broken. A conditional $p \\Rightarrow q$ is false in exactly one case, $p$ true and $q$ false.\n\nCheck: of the four cases, only one was a broken promise, so the column of $p \\Rightarrow q$ is T, F, T, T.\n\nIn this lesson we decide whether conditional statements are true and evaluate formulas that contain $\\Rightarrow$.',
    "老师承诺：“如果你完成这个项目，那么你得一分奖励。”可能发生四种情况。你完成了并得到奖励：承诺兑现了。你完成了却没得到：承诺被打破了。你没有完成：不论结果如何，承诺对这种情况什么也没说，所以没有被打破。条件命题 $p \\Rightarrow q$ 恰在一种情形下为假：$p$ 真而 $q$ 假。\n\n检验：四种情况中只有一种打破了承诺，所以 $p \\Rightarrow q$ 的列为 T、F、T、T。\n\n本课我们判断条件命题的真假，并计算含 $\\Rightarrow$ 的公式的真假。",
  ),
  prerequisites: ["the-not-connective"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "truth-values-of-conditional-statements",
      title: t("Truth values of conditionals", "条件命题的真假"),
      explanation: t(
        'In $p \\Rightarrow q$, $p$ is the **hypothesis** and $q$ the **conclusion**. The statement is a promise that is broken only when $p$ is true and $q$ is false. When $p$ is false, $p \\Rightarrow q$ is true whatever $q$ is; it is **vacuously true**. So "If $4 > 9$, then $7$ is even" is true: its hypothesis is false, so it promises nothing that could fail. "If $9$ is odd, then $9$ is prime" is false: the hypothesis holds and the conclusion does not.\n\n> **Watch out.** A conditional does not claim that its hypothesis or its conclusion is true. A false hypothesis makes it true, not false.',
        "在 $p \\Rightarrow q$ 中，$p$ 是**前提**，$q$ 是**结论**。这个命题就像一个承诺，只有在 $p$ 真而 $q$ 假时才被打破。当 $p$ 为假时，无论 $q$ 如何，$p \\Rightarrow q$ 都为真；它是**空真**的。所以“如果 $4 > 9$，那么 $7$ 是偶数”为真：前提为假，它没有承诺任何会落空的事。“如果 $9$ 是奇数，那么 $9$ 是质数”为假：前提成立而结论不成立。\n\n> **注意。** 条件命题并不断言它的前提或结论为真。前提为假使它为真，而不是为假。",
      ),
      generate(rng) {
        const c = conditionalSentence(rng);
        return reasoned(
          oneOf(
            rng,
            t(`Is the statement "${c.en}" true or false?`, `命题“${c.zh}”是真还是假？`),
            truthOption(c.value),
            [truthOption(!c.value)],
            walked(
              [
                [
                  ["Decide the hypothesis and the conclusion", "判断前提与结论"],
                  t(
                    `The hypothesis "${c.a.text.en}" is ${valueWord(c.a.value).en}, and the conclusion "${c.b.text.en}" is ${valueWord(c.b.value).en}.`,
                    `前提“${c.a.text["zh-CN"]}”为${valueWord(c.a.value)["zh-CN"]}，结论“${c.b.text["zh-CN"]}”为${valueWord(c.b.value)["zh-CN"]}。`,
                  ),
                ],
                [
                  ["Apply the rule", "用规则判断"],
                  c.value
                    ? c.a.value
                      ? t(
                          "The hypothesis holds and so does the conclusion, so the conditional is true.",
                          "前提成立，结论也成立，所以条件命题为真。",
                        )
                      : t(
                          "The hypothesis is false, so the conditional is vacuously true, whatever the conclusion.",
                          "前提为假，所以不论结论如何，条件命题都空真。",
                        )
                    : t(
                        "The hypothesis holds but the conclusion fails, the one case that makes a conditional false.",
                        "前提成立而结论不成立，这正是使条件命题为假的唯一情形。",
                      ),
                ],
              ],
              c.value
                ? t(
                    "Read it as a promise: it is broken only if the hypothesis happens and the conclusion does not, and that is not the case here.",
                    "把它看作承诺：只有前提发生而结论没发生时才算打破，这里不是这种情形。",
                  )
                : t(
                    "Read it as a promise: the hypothesis happens and the conclusion does not, so the promise is broken.",
                    "把它看作承诺：前提发生了而结论没有发生，所以承诺被打破了。",
                  ),
            ),
          ),
          [
            [
              truthOption(!c.value).en,
              c.value
                ? c.a.value
                  ? "Both parts hold, so the promise is kept."
                  : "A false hypothesis does not make the conditional false; it promises nothing in that case."
                : "Check the hypothesis and the conclusion again: this is the one case where a conditional fails.",
              c.value
                ? c.a.value
                  ? "两部分都成立，承诺兑现了。"
                  : "前提为假并不使条件命题为假；这种情形下它什么也没承诺。"
                : "再判断一次前提与结论：这正是条件命题不成立的那种情形。",
            ],
          ],
        );
      },
    },
    {
      id: "evaluating-formulas-with-conditionals",
      title: t("Evaluating formulas with conditionals", "含条件命题的公式求值"),
      explanation: t(
        "Evaluate inner parts first, then use the rule for $\\Rightarrow$: it is false only for $T \\Rightarrow F$. If $p$ is false and $q$ is true, then in $(p \\vee q) \\Rightarrow p$ the hypothesis $p \\vee q$ is $F \\vee T = T$, and the conclusion $p$ is $F$; $T \\Rightarrow F$ is false.\n\n> **Watch out.** The order of the sides matters for $\\Rightarrow$: $T \\Rightarrow F$ is false, but $F \\Rightarrow T$ is true.",
        "先计算内层，再用 $\\Rightarrow$ 的规则：只有 $T \\Rightarrow F$ 为假。若 $p$ 为假、$q$ 为真，则在 $(p \\vee q) \\Rightarrow p$ 中，前提 $p \\vee q$ 为 $F \\vee T = T$，结论 $p$ 为 $F$；$T \\Rightarrow F$ 为假。\n\n> **注意。** 对 $\\Rightarrow$ 来说，两边的次序很重要：$T \\Rightarrow F$ 为假，而 $F \\Rightarrow T$ 为真。",
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

/** negated removes or adds a negation in front of a literal. */
const negated = (x: Formula) => (x.k === "not" ? x.a : not(x));

/** logicalEquivalenceWithConditionalStatements rewrites conditionals. */
export const logicalEquivalenceWithConditionalStatements: TopicDef = {
  id: "logical-equivalence-with-conditional-statements",
  title: t("Logical Equivalence With Conditional Statements", "条件命题的逻辑等价"),
  summary: t("p ⇒ q ≡ ¬p ∨ q, and ¬(p ⇒ q) ≡ p ∧ ¬q.", "p ⇒ q ≡ ¬p ∨ q，¬(p ⇒ q) ≡ p ∧ ¬q。"),
  intro: t(
    '"If it rains, the match is called off" rules out just one situation: rain with the match going ahead. So it says the same as "it does not rain, or the match is called off": $p \\Rightarrow q \\equiv \\neg p \\vee q$. And to deny it is to claim that very situation: "it rains and the match is not called off", $\\neg(p \\Rightarrow q) \\equiv p \\wedge \\neg q$.\n\nCheck: on a dry day, both "if it rains, the match is called off" and "it does not rain, or the match is called off" are true.\n\nIn this lesson we rewrite a conditional as a disjunction and negate a conditional.',
    "“如果下雨，比赛就取消”只排除了一种情形：下雨了比赛却照常进行。所以它与“不下雨，或者比赛取消”说的是同一件事：$p \\Rightarrow q \\equiv \\neg p \\vee q$。而否定它，就是断言恰好发生了那种情形：“下雨了而比赛没有取消”，$\\neg(p \\Rightarrow q) \\equiv p \\wedge \\neg q$。\n\n检验：在不下雨的日子，“如果下雨，比赛就取消”与“不下雨，或者比赛取消”都为真。\n\n本课我们把条件命题写成析取，并否定条件命题。",
  ),
  prerequisites: ["conditional-statements", "de-morgans-laws-for-logic"],
  encompasses: [{ topic: "conditional-statements", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rewriting-a-conditional-as-a-disjunction",
      title: t("Conditionals as disjunctions", "把条件命题写成析取"),
      explanation: t(
        '$p \\Rightarrow q$ is false only when $p$ is true and $q$ false, which is exactly when $\\neg p \\vee q$ is false, since an "or" is false only when both $\\neg p$ and $q$ are false. So $p \\Rightarrow q \\equiv \\neg p \\vee q$: negate the hypothesis and join with $\\vee$. For $\\neg p \\Rightarrow (q \\wedge r)$ the hypothesis is $\\neg p$, whose negation is $p$, so the statement is $p \\vee (q \\wedge r)$.\n\n> **Watch out.** Negate the hypothesis, not the conclusion. $p \\Rightarrow q$ is not $p \\vee \\neg q$, which is $q \\Rightarrow p$ instead.',
        "$p \\Rightarrow q$ 只有在 $p$ 真 $q$ 假时为假，而这恰好是 $\\neg p \\vee q$ 为假的情形，因为“或”只有在 $\\neg p$ 与 $q$ 都为假时才为假。所以 $p \\Rightarrow q \\equiv \\neg p \\vee q$：否定前提，再用 $\\vee$ 连接。对 $\\neg p \\Rightarrow (q \\wedge r)$，前提是 $\\neg p$，它的否定是 $p$，所以命题为 $p \\vee (q \\wedge r)$。\n\n> **注意。** 要否定的是前提，不是结论。$p \\Rightarrow q$ 不是 $p \\vee \\neg q$，后者是 $q \\Rightarrow p$。",
      ),
      generate(rng) {
        const [a, b] = threeLiterals(rng);
        const c = rng.bool() ? b : and(b, threeLiterals(rng)[2]);
        const f = imp(a, c);
        const g = or(negated(a), c);
        return equivalentChoice(rng, f, g, [
          [
            ["Use the rule", "用规则"],
            t(
              'A conditional is false only when its hypothesis is true and its conclusion false, which is when "not the hypothesis, or the conclusion" is false: $A \\Rightarrow B \\equiv \\neg A \\vee B$.',
              "条件命题只有在前提真、结论假时为假，这正是“非前提，或结论”为假的情形：$A \\Rightarrow B \\equiv \\neg A \\vee B$。",
            ),
          ],
          [
            ["Negate the hypothesis", "否定前提"],
            t(
              `The hypothesis is $${tex(a)}$, whose negation is $${tex(negated(a))}$, so $${tex(f)} \\equiv ${tex(g)}$.`,
              `前提是 $${tex(a)}$，它的否定是 $${tex(negated(a))}$，所以 $${tex(f)} \\equiv ${tex(g)}$。`,
            ),
          ],
        ]);
      },
    },
    {
      id: "negating-a-conditional",
      title: t("Negating a conditional", "否定条件命题"),
      explanation: t(
        '$\\neg(p \\Rightarrow q) \\equiv \\neg(\\neg p \\vee q) \\equiv p \\wedge \\neg q$, by rewriting the conditional and then applying De Morgan\'s law. In words, to deny a promise is to say it was broken: the hypothesis happened and the conclusion did not. The negation of "if it rains, the game is canceled" is "it rains and the game is not canceled".\n\n> **Watch out.** The negation of a conditional is not another conditional. "If it rains, the game is not canceled" is a new promise, not a denial of the old one.',
        "$\\neg(p \\Rightarrow q) \\equiv \\neg(\\neg p \\vee q) \\equiv p \\wedge \\neg q$：先改写条件命题，再用德摩根律。用话说，否认一个承诺，就是说它被打破了：前提发生了而结论没有发生。“如果下雨，比赛就取消”的否定是“下雨了而比赛没有取消”。\n\n> **注意。** 条件命题的否定不是另一个条件命题。“如果下雨，比赛不取消”是一个新的承诺，而不是对原承诺的否认。",
      ),
      generate(rng) {
        const [a, b] = threeLiterals(rng);
        const f = not(imp(a, b));
        const g = and(a, negated(b));
        return equivalentChoice(
          rng,
          f,
          g,
          [
            [
              ["Rewrite the conditional", "改写条件命题"],
              t(
                `$${tex(imp(a, b))} \\equiv ${tex(or(negated(a), b))}$, so the statement is $${tex(not(or(negated(a), b)))}$.`,
                `$${tex(imp(a, b))} \\equiv ${tex(or(negated(a), b))}$，所以命题为 $${tex(not(or(negated(a), b)))}$。`,
              ),
            ],
            [
              ["Apply De Morgan's law", "用德摩根律"],
              t(
                `Negate each side and swap $\\vee$ for $\\wedge$, cancelling double negations: $${tex(g)}$. The hypothesis holds and the conclusion fails.`,
                `否定每一边，把 $\\vee$ 换成 $\\wedge$，并消去双重否定：$${tex(g)}$。即前提成立而结论不成立。`,
              ),
            ],
          ],
          {
            candidates: [imp(negated(a), negated(b)), imp(a, negated(b)), and(negated(a), b), or(negated(a), b), imp(b, a)],
            reasons: [
              [
                math(imp(a, negated(b))).en,
                "This is another conditional, a new promise; the negation of a conditional says the old one was broken.",
                "这是另一个条件命题，是一个新的承诺；条件命题的否定是说原承诺被打破了。",
              ],
              [
                math(or(negated(a), b)).en,
                "This is the conditional itself rewritten, with the negation dropped.",
                "这是条件命题本身的改写，否定被丢掉了。",
              ],
            ],
          },
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
  intro: t(
    '"A whole number is even if and only if its last digit is even." This makes two promises: an even number ends in an even digit, and a number ending in an even digit is even. Together they say the two statements always stand or fall together. For $36$ both are true; for $47$ both are false; and the biconditional is true either way.\n\nCheck: a number where one part held and the other failed, such as an even number ending in $7$, would break it, and there is none.\n\nIn this lesson we decide whether biconditionals are true and rewrite them in other forms.',
    "“一个整数是偶数，当且仅当它的末位数字是偶数。”这包含两个承诺：偶数的末位是偶数，末位是偶数的数是偶数。合起来，它说这两个命题总是同真同假。对 $36$，两者都为真；对 $47$，两者都为假；无论哪种，这个双条件命题都为真。\n\n检验：如果有一个数使一部分成立而另一部分不成立，比如末位是 $7$ 的偶数，它就会被推翻，而这样的数不存在。\n\n本课我们判断双条件命题的真假，并把它改写成其他形式。",
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
        '$p \\Leftrightarrow q$ claims that $p$ and $q$ have the same truth value, so it is true when they are both true or both false, and false when they differ. "$9$ is prime if and only if $9 > 20$" is true: both parts are false, and they match. "$9$ is odd if and only if $9 > 20$" is false: the parts differ.\n\n> **Watch out.** A biconditional with two false parts is true. What it needs is matching values, not true ones.',
        "$p \\Leftrightarrow q$ 断言 $p$ 与 $q$ 真假相同，所以在两者同真或同假时为真，在两者不同时为假。“$9$ 是质数当且仅当 $9 > 20$”为真：两部分都为假，真假相同。“$9$ 是奇数当且仅当 $9 > 20$”为假：两部分不同。\n\n> **注意。** 两部分都为假的双条件命题为真。它需要的是真假相同，而不是都为真。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const [a, b] = twoAtoms(rng);
          const value = a.value === b.value;
          return reasoned(
            oneOf(
              rng,
              t(
                `Is the statement "${a.text.en} if and only if ${b.text.en}" true or false?`,
                `命题“${a.text["zh-CN"]}当且仅当 ${b.text["zh-CN"]}”是真还是假？`,
              ),
              truthOption(value),
              [truthOption(!value)],
              walked(
                [
                  [
                    ["Decide each part", "判断每一部分"],
                    t(
                      `"${a.text.en}" is ${valueWord(a.value).en}, and "${b.text.en}" is ${valueWord(b.value).en}.`,
                      `“${a.text["zh-CN"]}”为${valueWord(a.value)["zh-CN"]}，“${b.text["zh-CN"]}”为${valueWord(b.value)["zh-CN"]}。`,
                    ),
                  ],
                  [
                    ["Compare them", "比较两部分"],
                    t(
                      `A biconditional is true exactly when the parts match. They ${value ? "match" : "differ"}, so it is ${valueWord(value).en}.`,
                      `双条件命题恰在两部分真假相同时为真。这里两部分${value ? "相同" : "不同"}，所以它为${valueWord(value)["zh-CN"]}。`,
                    ),
                  ],
                ],
                t(
                  `Split it into two conditionals. "If ${a.text.en}, then ${b.text.en}" is ${valueWord(!a.value || b.value).en}, and its reverse is ${valueWord(!b.value || a.value).en}; the biconditional needs both, so it is ${valueWord(value).en}.`,
                  `把它拆成两个条件命题。“如果 ${a.text["zh-CN"]}，那么 ${b.text["zh-CN"]}”为${valueWord(!a.value || b.value)["zh-CN"]}，反方向的为${valueWord(!b.value || a.value)["zh-CN"]}；双条件命题需要两者都成立，所以它为${valueWord(value)["zh-CN"]}。`,
                ),
              ),
            ),
            [
              [
                truthOption(!value).en,
                value && !a.value
                  ? "Both parts are false, and a biconditional only asks that they match."
                  : "A biconditional is decided by whether the two parts match. Compare their values again.",
                value && !a.value
                  ? "两部分都为假，而双条件命题只要求两者真假相同。"
                  : "双条件命题看两部分是否真假相同。再比较一下它们的真假。",
              ],
            ],
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
        "A biconditional says that two statements are always true together or false together, which is the same as each implying the other: $p \\Leftrightarrow q \\equiv (p \\Rightarrow q) \\wedge (q \\Rightarrow p)$. Listing the two ways to match gives a second form, $p \\Leftrightarrow q \\equiv (p \\wedge q) \\vee (\\neg p \\wedge \\neg q)$. And a negated biconditional says the parts differ, which happens exactly when $p$ matches $\\neg q$: $\\neg(p \\Leftrightarrow q) \\equiv p \\Leftrightarrow \\neg q$.\n\n> **Watch out.** $(p \\Rightarrow q) \\wedge (\\neg q \\Rightarrow \\neg p)$ is not a biconditional: the second part is the contrapositive of the first, so it says one direction twice.",
        "双条件句是说两个命题总是同真或同假，这等价于它们互相蕴含：$p \\Leftrightarrow q \\equiv (p \\Rightarrow q) \\wedge (q \\Rightarrow p)$。列出两种相同的情形，得到第二种形式：$p \\Leftrightarrow q \\equiv (p \\wedge q) \\vee (\\neg p \\wedge \\neg q)$。而双条件的否定是说两部分不同，这恰好是 $p$ 与 $\\neg q$ 相同的情形：$\\neg(p \\Leftrightarrow q) \\equiv p \\Leftrightarrow \\neg q$。\n\n> **注意。** $(p \\Rightarrow q) \\wedge (\\neg q \\Rightarrow \\neg p)$ 不是双条件：第二部分是第一部分的逆否命题，所以只把一个方向说了两遍。",
      ),
      generate(rng) {
        const [a, b] = threeLiterals(rng);
        const kind = rng.int(0, 2);
        const f = kind === 2 ? not(iff(a, b)) : iff(a, b);
        const g = kind === 0 ? and(imp(a, b), imp(b, a)) : kind === 1 ? or(and(a, b), and(negated(a), negated(b))) : iff(a, negated(b));
        return equivalentChoice(
          rng,
          f,
          g,
          [
            [
              ["Say what the statement claims", "说出命题断言什么"],
              t(
                [
                  "A biconditional claims the two parts are true together or false together, which means each implies the other.",
                  "A biconditional is true in two ways: both parts true, or both parts false.",
                  "A negated biconditional claims the parts differ, which happens exactly when one part matches the negation of the other.",
                ][kind]!,
                [
                  "双条件命题断言两部分同真同假，也就是它们互相蕴含。",
                  "双条件命题有两种为真的方式：两部分都真，或两部分都假。",
                  "双条件命题的否定断言两部分不同，这恰好是一部分与另一部分的否定相同的情形。",
                ][kind]!,
              ),
            ],
            [["Write it in symbols", "写成符号"], t(`$${tex(f)} \\equiv ${tex(g)}$.`, `$${tex(f)} \\equiv ${tex(g)}$。`)],
          ],
          {
            candidates: [
              and(imp(a, b), imp(negated(b), negated(a))),
              or(imp(a, b), imp(b, a)),
              imp(a, b),
              and(a, b),
              or(and(a, negated(b)), and(negated(a), b)),
              iff(a, b),
              iff(negated(a), negated(b)),
            ],
            reasons: [
              ...(kind === 2
                ? []
                : ([
                    [
                      math(and(imp(a, b), imp(negated(b), negated(a)))).en,
                      "The second part is the contrapositive of the first, so this says one implication twice.",
                      "第二部分是第一部分的逆否命题，所以这只是把同一个蕴含说了两遍。",
                    ],
                    [
                      math(or(imp(a, b), imp(b, a))).en,
                      'With an "or" this is always true, since at least one of the two implications always holds.',
                      "用“或”连接时它恒为真，因为两个蕴含至少有一个总成立。",
                    ],
                    [math(imp(a, b)).en, "An implication alone says nothing about the other direction.", "单独一个蕴含没有说另一个方向。"],
                    [
                      math(and(a, b)).en,
                      "This is true only when both parts are true, which leaves out the case where both are false.",
                      "它只在两部分都为真时为真，漏掉了两部分都为假的情形。",
                    ],
                    [
                      math(or(and(a, negated(b)), and(negated(a), b))).en,
                      "This is true when the two parts differ, which is the negation of a biconditional.",
                      "它在两部分不同时为真，这是双条件的否定。",
                    ],
                  ] as Reason[])),
              [
                math(iff(negated(a), negated(b))).en,
                "Negating both parts gives back the same biconditional, so a negation has been lost or added. Compare it with the statement row by row.",
                "两部分都否定后还是原来的双条件，所以否定被丢掉或多加了。逐行和原命题比较一下。",
              ],
            ],
          },
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

/** kindReason says why a statement f is not of the wrong kind offered. */
function kindReason(f: Formula, offered: Kind): Reason {
  const all = rows(varsOf(f));
  const falseRow = all.find((env) => !evaluate(f, env));
  const trueRow = all.find((env) => evaluate(f, env));
  const where = (env: Env) => envText(env, varsOf(f));
  if (offered === "tautology" && falseRow)
    return [
      kinds.tautology.en,
      `A tautology is true in every row, but this statement is false where ${where(falseRow).en}.`,
      `永真式每一行都为真，但这个命题在${where(falseRow)["zh-CN"]}时为假。`,
    ];
  if (offered === "contradiction" && trueRow)
    return [
      kinds.contradiction.en,
      `A contradiction is false in every row, but this statement is true where ${where(trueRow).en}.`,
      `矛盾式每一行都为假，但这个命题在${where(trueRow)["zh-CN"]}时为真。`,
    ];
  return [
    kinds.contingency.en,
    '"Neither" needs a row where the statement is true and a row where it is false. Fill in every row and look again.',
    "“都不是”需要既有为真的行，又有为假的行。把每一行都算出来再看。",
  ];
}

/** tautologiesAndContradictions classifies statements by their truth tables. */
export const tautologiesAndContradictions: TopicDef = {
  id: "tautologies-and-contradictions",
  title: t("Tautologies and Contradictions", "永真式与矛盾式"),
  summary: t(
    "A tautology is true in every row of its truth table; a contradiction is false in every row.",
    "永真式在真值表的每一行都为真；矛盾式在每一行都为假。",
  ),
  intro: t(
    '"Either $n$ is prime or $n$ is not prime" is true whatever $n$ is, because of its form alone: $p \\vee \\neg p$ is true in both rows of its table. Such a statement is a **tautology**. "$n$ is prime and $n$ is not prime" is false whatever $n$ is: $p \\wedge \\neg p$ is false in both rows, a **contradiction**. Most statements, like $p \\wedge q$, are neither.\n\nCheck: try $n = 9$ and $n = 7$. The first statement is true for both; the second is false for both.\n\nIn this lesson we classify statements by their truth tables and see equivalence as a tautology.',
    "“$n$ 是质数，或者 $n$ 不是质数”不论 $n$ 是什么都为真，单凭它的形式就为真：$p \\vee \\neg p$ 在真值表的两行都为真。这样的命题是**永真式**。“$n$ 是质数且 $n$ 不是质数”不论 $n$ 是什么都为假：$p \\wedge \\neg p$ 在两行都为假，是**矛盾式**。大多数命题，例如 $p \\wedge q$，两者都不是。\n\n检验：取 $n = 9$ 与 $n = 7$。第一个命题对两者都为真；第二个对两者都为假。\n\n本课我们用真值表给命题分类，并把等价看作永真式。",
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
        'A **tautology** is true for every assignment, such as $p \\vee \\neg p$ or $(p \\wedge q) \\Rightarrow p$. A **contradiction** is always false, such as $p \\wedge \\neg p$. Anything else is neither: it is true in some rows and false in others. To classify a statement, fill in its last column. For $(p \\wedge q) \\Rightarrow p$, the hypothesis is true only in the row TT, where the conclusion $p$ is true too, so no row is $T \\Rightarrow F$: the column is T, T, T, T, a tautology.\n\n> **Watch out.** One false row is enough to rule out a tautology, and one true row to rule out a contradiction, but deciding "tautology" needs every row.',
        "**永真式**对每一种取值都为真，如 $p \\vee \\neg p$ 或 $(p \\wedge q) \\Rightarrow p$。**矛盾式**总是为假，如 $p \\wedge \\neg p$。其余的命题两者都不是：在某些行为真，在另一些行为假。给命题分类，就填出它的最后一列。对 $(p \\wedge q) \\Rightarrow p$，前提只在 TT 那一行为真，而那一行结论 $p$ 也为真，所以没有一行是 $T \\Rightarrow F$：这一列为 T、T、T、T，是永真式。\n\n> **注意。** 一行为假就足以排除永真式，一行为真就足以排除矛盾式，但要判定“永真式”需要检查每一行。",
      ),
      generate(rng) {
        const target = rng.pick(["tautology", "contradiction", "contingency"] as const);
        for (;;) {
          const f = randomFormula(rng, rng.int(2, 3), ["p", "q"], ["and", "or", "imp", "iff"]);
          if (kindOf(f) !== target || varsOf(f).length < 2 || f.k === "not") continue;
          const all = rows(varsOf(f));
          const table = all.map((env) => TF(evaluate(f, env)));
          const ff = all[all.length - 1]!;
          const trueRow = all.find((env) => evaluate(f, env));
          const falseRow = all.find((env) => !evaluate(f, env));
          const wrong = (Object.keys(kinds) as Kind[]).filter((k) => k !== target);
          return reasoned(
            oneOf(
              rng,
              t(`Is $${tex(f)}$ a tautology, a contradiction, or neither?`, `$${tex(f)}$ 是永真式、矛盾式，还是都不是？`),
              kinds[target],
              wrong.map((k) => kinds[k]),
              walked(
                [
                  [
                    ["Fill in the last column", "填出最后一列"],
                    t(
                      `Over the four rows TT, TF, FT, FF, working from the inside out, the statement takes the values ${table.join(", ")}.`,
                      `在 TT、TF、FT、FF 四行中由内向外计算，命题依次为 ${table.join("、")}。`,
                    ),
                  ],
                  [
                    ["Classify", "分类"],
                    target === "tautology"
                      ? t("Every row is T, so it is a tautology.", "每一行都是 T，所以它是永真式。")
                      : target === "contradiction"
                        ? t("Every row is F, so it is a contradiction.", "每一行都是 F，所以它是矛盾式。")
                        : t("It has both T and F rows, so it is neither.", "它既有 T 行又有 F 行，所以两者都不是。"),
                  ],
                ],
                target === "contingency"
                  ? t(
                      `Two rows show it: where ${envText(trueRow!, varsOf(f)).en} it is T, and where ${envText(falseRow!, varsOf(f)).en} it is F.`,
                      `两行就能说明：当${envText(trueRow!, varsOf(f))["zh-CN"]}时它为 T，当${envText(falseRow!, varsOf(f))["zh-CN"]}时它为 F。`,
                    )
                  : t(
                      `Recheck the row most often slipped, both variables false: ${ruleOf(f, ff).en} That gives ${TF(evaluate(f, ff))}, as the column says.`,
                      `重算最容易出错的一行，两个变量都为假：${ruleOf(f, ff)["zh-CN"]}得 ${TF(evaluate(f, ff))}，与这一列一致。`,
                    ),
              ),
            ),
            wrong.map((k) => kindReason(f, k)),
          );
        }
      },
    },
    {
      id: "equivalence-as-a-tautology",
      title: t("Equivalence as a tautology", "等价与永真式"),
      explanation: t(
        "$P \\Leftrightarrow Q$ is true in a row exactly when $P$ and $Q$ agree there. So $P \\Leftrightarrow Q$ is a tautology exactly when $P$ and $Q$ agree in every row, that is, when $P \\equiv Q$. To decide whether $P \\Leftrightarrow Q$ is a tautology, compare the truth-table columns of $P$ and $Q$. For instance, $(p \\Rightarrow q) \\Leftrightarrow (\\neg p \\vee q)$ is a tautology, because the two sides are equivalent.\n\n> **Watch out.** $\\equiv$ is a statement about two formulas; $\\Leftrightarrow$ is a connective inside one formula. $P \\equiv Q$ says that the formula $P \\Leftrightarrow Q$ is a tautology.",
        "$P \\Leftrightarrow Q$ 在某一行为真，恰好是 $P$ 与 $Q$ 在这一行相同。所以 $P \\Leftrightarrow Q$ 是永真式，恰好是 $P$ 与 $Q$ 每一行都相同，也就是 $P \\equiv Q$。要判断 $P \\Leftrightarrow Q$ 是否为永真式，比较 $P$ 与 $Q$ 的真值表列。例如 $(p \\Rightarrow q) \\Leftrightarrow (\\neg p \\vee q)$ 是永真式，因为两边等价。\n\n> **注意。** $\\equiv$ 是关于两个公式的断言；$\\Leftrightarrow$ 是一个公式内部的联结词。$P \\equiv Q$ 是说公式 $P \\Leftrightarrow Q$ 是永真式。",
      ),
      generate(rng) {
        for (;;) {
          const f = randomFormula(rng, 2, ["p", "q"], ["and", "or", "imp"]);
          if (varsOf(f).length < 2 || f.k === "var") continue;
          const g = rng.bool() ? deMorganRewrite(f) : rng.pick(mutations(f));
          if (tex(g) === tex(f)) continue;
          const whole = iff(f, g);
          const isTaut = kindOf(whole) === "tautology";
          return reasoned(
            oneOf(
              rng,
              t(`Is $${tex(whole)}$ a tautology?`, `$${tex(whole)}$ 是永真式吗？`),
              t(isTaut ? "Yes" : "No", isTaut ? "是" : "否"),
              [t(isTaut ? "No" : "Yes", isTaut ? "否" : "是")],
              equivalenceSolution(f, g),
            ),
            equivalenceReasons(f, g),
          );
        }
      },
    },
  ],
};

/** relatedForms are the three relatives of a conditional. */
const relatedForms = [
  { name: t("The converse", "逆命题"), make: (a: Formula, b: Formula) => imp(b, a) },
  { name: t("The inverse", "否命题"), make: (a: Formula, b: Formula) => imp(not(a), not(b)) },
  { name: t("The contrapositive", "逆否命题"), make: (a: Formula, b: Formula) => imp(not(b), not(a)) },
] as const;

/** howFormed says how each relative is formed from p ⇒ q. */
const howFormed = [
  t("swaps the hypothesis and the conclusion", "交换前提与结论"),
  t("negates the hypothesis and the conclusion, keeping their places", "否定前提与结论，位置不变"),
  t("swaps the hypothesis and the conclusion and negates both", "交换前提与结论，并否定两者"),
] as const;

/** converseInverseAndContrapositive forms the relatives of a conditional. */
export const converseInverseAndContrapositive: TopicDef = {
  id: "converse-inverse-and-contrapositive",
  title: t("Converse, Inverse and Contrapositive", "逆命题、否命题与逆否命题"),
  summary: t(
    "For p ⇒ q: the converse is q ⇒ p, the inverse ¬p ⇒ ¬q, and the contrapositive ¬q ⇒ ¬p, which alone is equivalent to the original.",
    "对 p ⇒ q：逆命题为 q ⇒ p，否命题为 ¬p ⇒ ¬q，逆否命题为 ¬q ⇒ ¬p；只有逆否命题与原命题等价。",
  ),
  intro: t(
    '"If a shape is a square, then it has four sides" is true. Turn it around, "if a shape has four sides, then it is a square", and it becomes false: a rectangle that is not a square has four sides. But "if a shape does not have four sides, then it is not a square" is true, and must be: a square always has four sides, so a shape without them cannot be one.\n\nCheck: a triangle has three sides, and indeed it is not a square.\n\nIn this lesson we form the converse, inverse and contrapositive of a conditional and find which of them are equivalent to it.',
    "“如果一个图形是正方形，那么它有四条边”为真。把它倒过来，“如果一个图形有四条边，那么它是正方形”，就变成假的了：不是正方形的长方形也有四条边。但“如果一个图形没有四条边，那么它不是正方形”为真，而且必然为真：正方形总有四条边，没有四条边的图形就不可能是正方形。\n\n检验：三角形有三条边，它确实不是正方形。\n\n本课我们写出条件命题的逆命题、否命题与逆否命题，并找出其中哪些与它等价。",
  ),
  prerequisites: ["conditional-statements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "forming-the-converse-inverse-and-contrapositive",
      title: t("Forming the related statements", "写出相关命题"),
      explanation: t(
        'From $p \\Rightarrow q$, the **converse** $q \\Rightarrow p$ swaps the hypothesis and the conclusion; the **inverse** $\\neg p \\Rightarrow \\neg q$ negates both in place; the **contrapositive** $\\neg q \\Rightarrow \\neg p$ does both. For "if $n$ is divisible by $4$, then $n$ is even": the converse is "if $n$ is even, then $n$ is divisible by $4$"; the inverse is "if $n$ is not divisible by $4$, then $n$ is not even"; the contrapositive is "if $n$ is not even, then $n$ is not divisible by $4$".\n\n> **Watch out.** The inverse and the contrapositive both negate. The contrapositive also swaps the two parts; the inverse does not.',
        "由 $p \\Rightarrow q$：**逆命题** $q \\Rightarrow p$ 交换前提与结论；**否命题** $\\neg p \\Rightarrow \\neg q$ 原位否定两者；**逆否命题** $\\neg q \\Rightarrow \\neg p$ 既交换又否定。对“若 $n$ 能被 $4$ 整除，则 $n$ 是偶数”：逆命题是“若 $n$ 是偶数，则 $n$ 能被 $4$ 整除”；否命题是“若 $n$ 不能被 $4$ 整除，则 $n$ 不是偶数”；逆否命题是“若 $n$ 不是偶数，则 $n$ 不能被 $4$ 整除”。\n\n> **注意。** 否命题和逆否命题都要否定。逆否命题还要交换两部分，否命题不交换。",
      ),
      generate(rng) {
        const [a, b] = twoAtoms(rng);
        const which = rng.int(0, 2);
        const name = relatedForms[which]!.name;
        const sentence = (h: Text, c: Text) => t(`If ${h.en}, then ${c.en}.`, `如果 ${h["zh-CN"]}，那么 ${c["zh-CN"]}。`);
        const forms = [sentence(b.text, a.text), sentence(a.negation, b.negation), sentence(b.negation, a.negation)];
        const original = !a.value || b.value;
        const converse = !b.value || a.value;
        return reasoned(
          oneOf(
            rng,
            t(
              `What is ${name.en.toLowerCase()} of "If ${a.text.en}, then ${b.text.en}"?`,
              `“如果 ${a.text["zh-CN"]}，那么 ${b.text["zh-CN"]}”的${name["zh-CN"]}是什么？`,
            ),
            forms[which]!,
            [...forms.filter((_, i) => i !== which), sentence(a.negation, b.text)],
            walked(
              [
                [
                  ["Name the parts", "找出两部分"],
                  t(
                    `The hypothesis is "${a.text.en}" and the conclusion is "${b.text.en}".`,
                    `前提是“${a.text["zh-CN"]}”，结论是“${b.text["zh-CN"]}”。`,
                  ),
                ],
                [
                  ["Form the statement", "写出所求命题"],
                  t(
                    `${name.en} ${howFormed[which]!.en}: ${forms[which]!.en}`,
                    `${name["zh-CN"]}${howFormed[which]!["zh-CN"]}：${forms[which]!["zh-CN"]}`,
                  ),
                ],
              ],
              which === 2
                ? t(
                    `A conditional and its contrapositive have the same truth value. Here the original is ${valueWord(original).en}, and so is the contrapositive.`,
                    `条件命题与其逆否命题真假相同。这里原命题为${valueWord(original)["zh-CN"]}，逆否命题也为${valueWord(original)["zh-CN"]}。`,
                  )
                : t(
                    `The converse and the inverse are contrapositives of each other, so they share a truth value: here both are ${valueWord(converse).en}.`,
                    `逆命题与否命题互为逆否命题，所以真假相同：这里两者都为${valueWord(converse)["zh-CN"]}。`,
                  ),
            ),
          ),
          [
            ...forms.map(
              (f, i) =>
                [
                  f.en,
                  `That ${howFormed[i]!.en}, which is ${relatedForms[i]!.name.en.toLowerCase()}, not what is asked.`,
                  `它${howFormed[i]!["zh-CN"]}，那是${relatedForms[i]!.name["zh-CN"]}，不是题目问的。`,
                ] as const,
            ),
            [
              sentence(a.negation, b.text).en,
              "This negates only the hypothesis, which gives none of the three related forms.",
              "这里只否定了前提，不是三种相关命题中的任何一种。",
            ],
          ],
        );
      },
    },
    {
      id: "which-related-statement-is-equivalent",
      title: t("Which are equivalent", "哪些等价"),
      explanation: t(
        'A conditional and its contrapositive fail in the same case: $p \\Rightarrow q$ fails when $p$ is true and $q$ false, and $\\neg q \\Rightarrow \\neg p$ fails when $\\neg q$ is true and $\\neg p$ false, which is the same row. So they are equivalent. In the same way the converse is equivalent to the inverse, since they are contrapositives of each other. A conditional is **not** equivalent to its converse: "if $n$ is divisible by $4$, then $n$ is even" is true, but its converse fails for $n = 6$.\n\n> **Watch out.** Proving the converse does not prove the original. Only the contrapositive can stand in for a conditional.',
        "条件命题与其逆否命题在同一种情形下不成立：$p \\Rightarrow q$ 在 $p$ 真 $q$ 假时不成立，$\\neg q \\Rightarrow \\neg p$ 在 $\\neg q$ 真 $\\neg p$ 假时不成立，这是同一行。所以它们等价。同理，逆命题与否命题等价，因为它们互为逆否。条件命题与其逆命题**不**等价：“若 $n$ 能被 $4$ 整除，则 $n$ 是偶数”为真，但其逆命题在 $n = 6$ 时不成立。\n\n> **注意。** 证明了逆命题，并不等于证明了原命题。只有逆否命题能代替条件命题。",
      ),
      generate(rng) {
        const [a, b] = threeLiterals(rng);
        const f = imp(a, b);
        const fromConverse = rng.int(0, 2) === 0;
        const source = fromConverse ? imp(b, a) : f;
        const right = fromConverse ? imp(negated(a), negated(b)) : imp(negated(b), negated(a));
        const [h, c] = fromConverse ? [b, a] : [a, b];
        return equivalentChoice(
          rng,
          source,
          right,
          [
            [
              ["Use the contrapositive", "用逆否命题"],
              t(
                "A conditional is equivalent to its contrapositive, and to none of its other relatives.",
                "条件命题与其逆否命题等价，而与其他相关命题都不等价。",
              ),
            ],
            [
              ["Form it", "写出它"],
              t(
                `The hypothesis is $${tex(h)}$ and the conclusion $${tex(c)}$. Swap them and negate both: $${tex(right)}$.`,
                `前提是 $${tex(h)}$，结论是 $${tex(c)}$。交换两者并都加上否定：$${tex(right)}$。`,
              ),
            ],
          ],
          { candidates: [imp(b, a), imp(negated(a), negated(b)), imp(negated(b), negated(a)), imp(a, negated(b)), imp(a, b)] },
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
