import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";

import { yesNo } from "../problems.ts";
import { oneOf } from "./calculus-common.ts";
import { domainTex, type Pred, range, setProblem, setTex, truthSet, twoPredicates } from "./methods-of-proof-common.ts";
import {
  and,
  evaluate,
  type Formula,
  iff,
  imp,
  inequivalentTo,
  math,
  not,
  or,
  randomFormula,
  rows,
  TF,
  tex,
  truthOption,
  type Var,
  v,
  varsOf,
} from "./methods-of-proof-logic.ts";

// Methods of Proof unit 1, modules 1.3–1.5: predicates, quantifiers and logical inference.

/** universe picks the domain 1..n. */
const universe = (rng: Rng) => {
  const n = rng.int(10, 16);
  return { n, domain: range(1, n), tex: domainTex(n) };
};

/** setOf writes "\{x \in U : …\}" in words. */
const describe = (p: Text) => t(`the set of $x \\in U$ for which ${p.en}`, `$U$ 中使${p["zh-CN"]}的 $x$ 组成的集合`);

/** joinPreds writes two predicates joined by a connective word. */
const joinPreds = (a: Text, b: Text, en: string, zh: string) => t(`${a.en} ${en} ${b.en}`, `${a["zh-CN"]} ${zh} ${b["zh-CN"]}`);

/** truthSetsOfPredicates finds the set of values that make a predicate true. */
export const truthSetsOfPredicates: TopicDef = {
  id: "truth-sets-of-predicates",
  title: t("Truth Sets of Predicates", "谓词的真值集"),
  summary: t(
    "The truth set of a predicate P(x) over a domain U is {x ∈ U : P(x)}, the set of values that make it true.",
    "谓词 P(x) 在论域 U 上的真值集是 {x ∈ U : P(x)}，即使它为真的所有值组成的集合。",
  ),
  prerequisites: ["statements-and-predicates", "describing-sets-using-set-builder-notation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-truth-sets-in-a-finite-domain",
      title: t("Truth sets in a finite domain", "有限论域中的真值集"),
      explanation: t(
        'A predicate $P(x)$ becomes a statement once $x$ is replaced by a value from the **domain** $U$. Its **truth set** is $\\{x \\in U : P(x)\\}$. With $U = \\{1, 2, \\dots, 10\\}$ and $P(x)$: "$x$ is a multiple of $3$", the truth set is $\\{3, 6, 9\\}$.',
        "谓词 $P(x)$ 中的 $x$ 用**论域** $U$ 中的值代入后就成为命题。它的**真值集**是 $\\{x \\in U : P(x)\\}$。若 $U = \\{1, 2, \\dots, 10\\}$，$P(x)$：“$x$ 是 $3$ 的倍数”，则真值集为 $\\{3, 6, 9\\}$。",
      ),
      generate(rng) {
        const u = universe(rng);
        const [p] = twoPredicates(rng, u.n);
        const set = truthSet(u.domain, p.holds);
        return setProblem({
          prompt: t(
            `Let $U = ${u.tex}$ and let $P(x)$ be the predicate "${p.text.en}". Find the truth set of $P(x)$.`,
            `设 $U = ${u.tex}$，谓词 $P(x)$ 为“${p.text["zh-CN"]}”。求 $P(x)$ 的真值集。`,
          ),
          values: set,
          wrong: [truthSet(u.domain, (x) => !p.holds(x)), set.slice(1)],
          solution: t(
            `Test each element of $U$: ${p.text.en} exactly for $x \\in ${setTex(set)}$.`,
            `逐个检验 $U$ 中的元素：恰当 $x \\in ${setTex(set)}$ 时${p.text["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "finding-truth-sets-over-the-integers",
      title: t("Truth sets over the integers", "整数上的真值集"),
      explanation: t(
        "The truth set of a predicate is the set of elements of the universe that make it true, so list exactly those integers, including the negative ones. Over $\\mathbb{Z}$ a truth set can still be finite. $\\{x \\in \\mathbb{Z} : x^2 < 10\\} = \\{-3, -2, -1, 0, 1, 2, 3\\}$: remember the negative integers.",
        "谓词的真值集是论域中使它为真的元素的集合，所以要准确列出这些整数，包括负整数。在 $\\mathbb{Z}$ 上真值集也可能是有限的。$\\{x \\in \\mathbb{Z} : x^2 < 10\\} = \\{-3, -2, -1, 0, 1, 2, 3\\}$：别忘了负整数。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const c = rng.int(2, 40);
          const r = Math.ceil(Math.sqrt(c)) - 1;
          const values = range(-r, r);
          return setProblem({
            prompt: t(`Find the truth set of $x^2 < ${c}$ over $\\mathbb{Z}$.`, `求 $x^2 < ${c}$ 在 $\\mathbb{Z}$ 上的真值集。`),
            values,
            wrong: [range(0, r), range(-r - 1, r + 1), range(1, r)],
            solution: t(
              `$x^2 < ${c}$ holds for $|x| \\le ${r}$, since $${r}^2 = ${r * r} < ${c}$ but $${r + 1}^2 = ${(r + 1) ** 2} \\ge ${c}$. The truth set is $${setTex(values)}$.`,
              `当 $|x| \\le ${r}$ 时 $x^2 < ${c}$，因为 $${r}^2 = ${r * r} < ${c}$，而 $${r + 1}^2 = ${(r + 1) ** 2} \\ge ${c}$。真值集为 $${setTex(values)}$。`,
            ),
          });
        }
        const a = rng.int(-6, 6);
        const b = rng.int(1, 3);
        const strict = rng.bool();
        const values = strict ? range(a - b + 1, a + b - 1) : range(a - b, a + b);
        const rel = strict ? "<" : "\\le";
        const shown = a === 0 ? "|x|" : `|x ${a > 0 ? "-" : "+"} ${Math.abs(a)}|`;
        return setProblem({
          prompt: t(
            `Find the truth set of $${shown} ${rel} ${b}$ over $\\mathbb{Z}$.`,
            `求 $${shown} ${rel} ${b}$ 在 $\\mathbb{Z}$ 上的真值集。`,
          ),
          values,
          wrong: [strict ? range(a - b, a + b) : range(a - b + 1, a + b - 1), range(a, a + b)],
          solution: t(
            `The integers within distance $${b}$ of $${a}$ (${strict ? "strictly" : "inclusive"}) are $${setTex(values)}$.`,
            `与 $${a}$ 的距离${strict ? "小于" : "不超过"} $${b}$ 的整数是 $${setTex(values)}$。`,
          ),
        });
      },
    },
  ],
};

/** combinedSetProblem asks for the truth set of a combination of two predicates. */
function combinedSetProblem(
  rng: Rng,
  label: (p: Pred, q: Pred) => Text,
  holds: (p: boolean, q: boolean) => boolean,
  why: Text,
  wrongs: readonly ((p: boolean, q: boolean) => boolean)[],
): Problem {
  const u = universe(rng);
  const [p, q] = twoPredicates(rng, u.n);
  const value = (f: (a: boolean, b: boolean) => boolean) => truthSet(u.domain, (x) => f(p.holds(x), q.holds(x)));
  const set = value(holds);
  const pSet = truthSet(u.domain, p.holds);
  const qSet = truthSet(u.domain, q.holds);
  const desc = label(p, q);
  return setProblem({
    prompt: t(`Let $U = ${u.tex}$. Find ${describe(desc).en}.`, `设 $U = ${u.tex}$。求${describe(desc)["zh-CN"]}。`),
    values: set,
    wrong: wrongs.map(value),
    solution: t(
      `Let $A = ${setTex(pSet)}$ be the truth set of "${p.text.en}" and $B = ${setTex(qSet)}$ that of "${q.text.en}". ${why.en} This gives $${setTex(set)}$.`,
      `设 $A = ${setTex(pSet)}$ 为“${p.text["zh-CN"]}”的真值集，$B = ${setTex(qSet)}$ 为“${q.text["zh-CN"]}”的真值集。${why["zh-CN"]}得到 $${setTex(set)}$。`,
    ),
  });
}

/** theAndAndOrConnectivesWithPredicates combines predicates with ∧ and ∨. */
export const theAndAndOrConnectivesWithPredicates: TopicDef = {
  id: "the-and-and-or-connectives-with-predicates",
  title: t("The AND and OR Connectives With Predicates", "谓词的“且”与“或”"),
  summary: t(
    "The truth set of P(x) ∧ Q(x) is the intersection of the truth sets; that of P(x) ∨ Q(x) is their union.",
    "P(x) ∧ Q(x) 的真值集是两个真值集的交集；P(x) ∨ Q(x) 的真值集是它们的并集。",
  ),
  prerequisites: ["truth-sets-of-predicates", "the-and-and-or-connectives"],
  encompasses: [{ topic: "truth-sets-of-predicates", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "truth-sets-of-conjunctions",
      title: t("Truth sets of conjunctions", "合取的真值集"),
      explanation: t(
        "If $A$ and $B$ are the truth sets of $P(x)$ and $Q(x)$, then $P(x) \\wedge Q(x)$ is true exactly for the elements in both: its truth set is $A \\cap B$.",
        "若 $A$、$B$ 分别是 $P(x)$、$Q(x)$ 的真值集，则 $P(x) \\wedge Q(x)$ 恰对同时属于两者的元素为真：其真值集为 $A \\cap B$。",
      ),
      generate: (rng) =>
        combinedSetProblem(
          rng,
          (p, q) => joinPreds(p.text, q.text, "and", "且"),
          (a, b) => a && b,
          t("The conjunction is true on $A \\cap B$.", "合取在 $A \\cap B$ 上为真。"),
          [(a, b) => a || b, (a) => a],
        ),
    },
    {
      id: "truth-sets-of-disjunctions",
      title: t("Truth sets of disjunctions", "析取的真值集"),
      explanation: t(
        "An element satisfies an or statement when it satisfies either part, so the truth set collects the elements of both truth sets. $P(x) \\vee Q(x)$ is true when at least one of the predicates is: its truth set is $A \\cup B$.",
        "一个元素满足“或”命题，只要它满足其中一部分，所以真值集汇集了两个真值集中的元素。$P(x) \\vee Q(x)$ 只要其中一个谓词为真就为真：其真值集为 $A \\cup B$。",
      ),
      generate: (rng) =>
        combinedSetProblem(
          rng,
          (p, q) => joinPreds(p.text, q.text, "or", "或"),
          (a, b) => a || b,
          t("The disjunction is true on $A \\cup B$.", "析取在 $A \\cup B$ 上为真。"),
          [(a, b) => a && b, (a, b) => a !== b],
        ),
    },
  ],
};

/** theNotConnectiveWithPredicates negates predicates. */
export const theNotConnectiveWithPredicates: TopicDef = {
  id: "the-not-connective-with-predicates",
  title: t("The NOT Connective With Predicates", "谓词的“非”"),
  summary: t(
    "The truth set of ¬P(x) is the complement of the truth set of P(x) in the domain.",
    "¬P(x) 的真值集是 P(x) 的真值集在论域中的补集。",
  ),
  prerequisites: ["the-and-and-or-connectives-with-predicates", "set-complements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "truth-sets-of-negations",
      title: t("Truth sets of negations", "否定的真值集"),
      explanation: t(
        "Negating a predicate swaps true and false for every element, so its truth set is everything in the universe outside the original truth set. $\\neg P(x)$ is true exactly where $P(x)$ is false, so its truth set is $A^{c} = U \\setminus A$.",
        "否定一个谓词会使每个元素的真假互换，所以它的真值集是论域中原真值集以外的所有元素。$\\neg P(x)$ 恰在 $P(x)$ 为假处为真，所以其真值集为 $A^{c} = U \\setminus A$。",
      ),
      generate(rng) {
        const u = universe(rng);
        const [p] = twoPredicates(rng, u.n);
        const set = truthSet(u.domain, p.holds);
        const comp = truthSet(u.domain, (x) => !p.holds(x));
        return setProblem({
          prompt: t(
            `Let $U = ${u.tex}$ and let $P(x)$ be "${p.text.en}". Find the truth set of $\\neg P(x)$.`,
            `设 $U = ${u.tex}$，$P(x)$ 为“${p.text["zh-CN"]}”。求 $\\neg P(x)$ 的真值集。`,
          ),
          values: comp,
          wrong: [set, ...(comp.length > 1 ? [comp.slice(1)] : [])],
          solution: t(
            `The truth set of $P(x)$ is $${setTex(set)}$; its complement in $U$ is $${setTex(comp)}$.`,
            `$P(x)$ 的真值集为 $${setTex(set)}$，它在 $U$ 中的补集为 $${setTex(comp)}$。`,
          ),
        });
      },
    },
    {
      id: "truth-sets-with-a-negated-predicate",
      title: t("Combining with a negated predicate", "与否定谓词组合"),
      explanation: t(
        "Combine the rules for and, or and not step by step, turning each logical operation into the matching set operation. Combine the rules: the truth set of $P(x) \\wedge \\neg Q(x)$ is $A \\cap B^{c} = A \\setminus B$, and that of $P(x) \\vee \\neg Q(x)$ is $A \\cup B^{c}$.",
        "把“与”“或”“非”的规则一步一步结合起来，把每个逻辑运算转化为相应的集合运算。组合这些规则：$P(x) \\wedge \\neg Q(x)$ 的真值集为 $A \\cap B^{c} = A \\setminus B$，$P(x) \\vee \\neg Q(x)$ 的真值集为 $A \\cup B^{c}$。",
      ),
      generate(rng) {
        const isAnd = rng.bool();
        return combinedSetProblem(
          rng,
          (p, q) => joinPreds(p.text, q.negation, isAnd ? "and" : "or", isAnd ? "且" : "或"),
          isAnd ? (a, b) => a && !b : (a, b) => a || !b,
          isAnd
            ? t("The statement is true on $A \\cap B^{c} = A \\setminus B$.", "该命题在 $A \\cap B^{c} = A \\setminus B$ 上为真。")
            : t("The statement is true on $A \\cup B^{c}$.", "该命题在 $A \\cup B^{c}$ 上为真。"),
          isAnd ? [(a, b) => a && b, (a, b) => !a && !b] : [(a, b) => a || b, (a, b) => a && !b],
        );
      },
    },
  ],
};

/** simplifyingPredicateExpressionsUsingDeMorgansLaws negates compound predicates. */
export const simplifyingPredicateExpressionsUsingDeMorgansLaws: TopicDef = {
  id: "simplifying-predicate-expressions-using-de-morgans-laws",
  title: t("Simplifying Predicate Expressions Using De Morgan's Laws", "用德摩根律化简谓词表达式"),
  summary: t(
    "¬(P(x) ∧ Q(x)) ≡ ¬P(x) ∨ ¬Q(x) and ¬(P(x) ∨ Q(x)) ≡ ¬P(x) ∧ ¬Q(x).",
    "¬(P(x) ∧ Q(x)) ≡ ¬P(x) ∨ ¬Q(x)，¬(P(x) ∨ Q(x)) ≡ ¬P(x) ∧ ¬Q(x)。",
  ),
  prerequisites: ["the-not-connective-with-predicates", "de-morgans-laws-for-logic"],
  encompasses: [{ topic: "the-not-connective-with-predicates", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "negating-compound-predicates",
      title: t("Negating compound predicates", "否定复合谓词"),
      explanation: t(
        'De Morgan\'s laws hold for predicates, for each value of $x$. The negation of "$x$ is even and $x > 4$" is "$x$ is odd or $x \\le 4$".',
        "德摩根律对谓词同样成立（对每个 $x$ 都成立）。“$x$ 是偶数且 $x > 4$”的否定是“$x$ 是奇数或 $x \\le 4$”。",
      ),
      generate(rng) {
        const [p, q] = twoPredicates(rng, 20);
        const isAnd = rng.bool();
        const [w, wz, ow, owz] = isAnd ? ["and", "且", "or", "或"] : ["or", "或", "and", "且"];
        return oneOf(
          rng,
          t(
            `Which predicate is equivalent to the negation of "${p.text.en} ${w} ${q.text.en}"?`,
            `哪个谓词等价于“${p.text["zh-CN"]} ${wz} ${q.text["zh-CN"]}”的否定？`,
          ),
          joinPreds(p.negation, q.negation, ow, owz),
          [joinPreds(p.negation, q.negation, w, wz), joinPreds(p.negation, q.text, ow, owz), joinPreds(p.text, q.negation, w, wz)],
          t(
            `By De Morgan's laws, negate both predicates and change "${w}" to "${ow}".`,
            `由德摩根律，否定两个谓词，并把“${wz}”改为“${owz}”。`,
          ),
        );
      },
    },
    {
      id: "truth-sets-of-negated-compound-predicates",
      title: t("Truth sets of negated compounds", "否定复合谓词的真值集"),
      explanation: t(
        "The truth set of $\\neg(P(x) \\vee Q(x))$ is $(A \\cup B)^{c} = A^{c} \\cap B^{c}$: the elements where both predicates fail. The truth set of $\\neg(P(x) \\wedge Q(x))$ is $A^{c} \\cup B^{c}$.",
        "$\\neg(P(x) \\vee Q(x))$ 的真值集为 $(A \\cup B)^{c} = A^{c} \\cap B^{c}$：两个谓词都不成立的元素。$\\neg(P(x) \\wedge Q(x))$ 的真值集为 $A^{c} \\cup B^{c}$。",
      ),
      generate(rng) {
        const isAnd = rng.bool();
        const [w, wz] = isAnd ? ["and", "且"] : ["or", "或"];
        return combinedSetProblem(
          rng,
          (p, q) => t(`it is not true that ${p.text.en} ${w} ${q.text.en}`, `“${p.text["zh-CN"]} ${wz} ${q.text["zh-CN"]}”不成立`),
          isAnd ? (a, b) => !(a && b) : (a, b) => !(a || b),
          isAnd
            ? t("By De Morgan's laws the statement is true on $A^{c} \\cup B^{c}$.", "由德摩根律，该命题在 $A^{c} \\cup B^{c}$ 上为真。")
            : t("By De Morgan's laws the statement is true on $A^{c} \\cap B^{c}$.", "由德摩根律，该命题在 $A^{c} \\cap B^{c}$ 上为真。"),
          isAnd ? [(a, b) => !a && !b, (a, b) => a && b] : [(a, b) => !a || !b, (a, b) => a || b],
        );
      },
    },
  ],
};

/** conditionalStatementsWithPredicates studies P(x) ⇒ Q(x). */
export const conditionalStatementsWithPredicates: TopicDef = {
  id: "conditional-statements-with-predicates",
  title: t("Conditional Statements With Predicates", "谓词的条件命题"),
  summary: t(
    "P(x) ⇒ Q(x) is true where P(x) is false or Q(x) is true, so its truth set is Aᶜ ∪ B.",
    "P(x) ⇒ Q(x) 在 P(x) 为假或 Q(x) 为真处为真，所以其真值集为 Aᶜ ∪ B。",
  ),
  prerequisites: ["the-not-connective-with-predicates", "conditional-statements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "truth-sets-of-conditional-predicates",
      title: t("Truth sets of conditionals", "条件命题的真值集"),
      explanation: t(
        "A conditional is false only when the hypothesis holds and the conclusion fails, so it is true everywhere except the part of the first set outside the second. Since $P(x) \\Rightarrow Q(x) \\equiv \\neg P(x) \\vee Q(x)$, its truth set is $A^{c} \\cup B$: every $x$ outside $A$, plus every $x$ in $B$.",
        "条件句只有在前提成立而结论不成立时才为假，所以除了第一个集合中不属于第二个集合的部分，它处处为真。由于 $P(x) \\Rightarrow Q(x) \\equiv \\neg P(x) \\vee Q(x)$，其真值集为 $A^{c} \\cup B$：不在 $A$ 中的所有 $x$，加上 $B$ 中的所有 $x$。",
      ),
      generate: (rng) =>
        combinedSetProblem(
          rng,
          (p, q) => t(`"if ${p.text.en}, then ${q.text.en}" is true`, `“如果 ${p.text["zh-CN"]}，那么 ${q.text["zh-CN"]}”为真`),
          (a, b) => !a || b,
          t("The conditional is true on $A^{c} \\cup B$.", "条件命题在 $A^{c} \\cup B$ 上为真。"),
          [(a, b) => a && b, (_, b) => b, (a, b) => a || !b],
        ),
    },
    {
      id: "values-that-make-a-conditional-false",
      title: t("Values that make a conditional false", "使条件命题为假的值"),
      explanation: t(
        "$P(x) \\Rightarrow Q(x)$ is false exactly when $P(x)$ is true and $Q(x)$ is false, that is on $A \\cap B^{c} = A \\setminus B$. These values are the **counterexamples** to the conditional.",
        "$P(x) \\Rightarrow Q(x)$ 恰在 $P(x)$ 真而 $Q(x)$ 假时为假，即在 $A \\cap B^{c} = A \\setminus B$ 上。这些值就是该条件命题的**反例**。",
      ),
      generate: (rng) =>
        combinedSetProblem(
          rng,
          (p, q) => t(`"if ${p.text.en}, then ${q.text.en}" is false`, `“如果 ${p.text["zh-CN"]}，那么 ${q.text["zh-CN"]}”为假`),
          (a, b) => a && !b,
          t("The conditional is false on $A \\setminus B$.", "条件命题在 $A \\setminus B$ 上为假。"),
          [(a, b) => !a && b, (a, b) => a && b, (_, b) => !b],
        ),
    },
  ],
};

/** letters picks two distinct statement letters. */
const twoLetters = (rng: Rng): [Formula, Formula] => {
  const [a, b] = rng.shuffle(["p", "q", "r", "s"] as const);
  return [v(a!), v(b!)];
};

/** Condition classifies how one condition relates to another. */
type Condition = "sufficient" | "necessary" | "both" | "neither";

/** conditionNames are the options for classifying a condition. */
const conditionNames: Record<Condition, Text> = {
  sufficient: t("Sufficient but not necessary", "充分不必要"),
  necessary: t("Necessary but not sufficient", "必要不充分"),
  both: t("Both necessary and sufficient", "充分必要"),
  neither: t("Neither necessary nor sufficient", "既不充分也不必要"),
};

/** necessaryAndSufficientConditions relates conditions to implications. */
export const necessaryAndSufficientConditions: TopicDef = {
  id: "necessary-and-sufficient-conditions",
  title: t("Necessary and Sufficient Conditions", "充分条件与必要条件"),
  summary: t(
    "p is sufficient for q when p ⇒ q, necessary for q when q ⇒ p, and both when p ⇔ q.",
    "若 p ⇒ q，则 p 是 q 的充分条件；若 q ⇒ p，则 p 是 q 的必要条件；若 p ⇔ q，则二者兼具。",
  ),
  prerequisites: ["conditional-statements-with-predicates", "biconditional-statements"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "conditions-as-implications",
      title: t("Conditions as implications", "用蕴涵表示条件"),
      explanation: t(
        '"$p$ is a **sufficient** condition for $q$" means $p \\Rightarrow q$: knowing $p$ is enough to get $q$. "$p$ is a **necessary** condition for $q$" means $q \\Rightarrow p$: $q$ cannot hold without $p$. "Necessary and sufficient" means $p \\Leftrightarrow q$.',
        "“$p$ 是 $q$ 的**充分**条件”表示 $p \\Rightarrow q$：有 $p$ 就足以得到 $q$。“$p$ 是 $q$ 的**必要**条件”表示 $q \\Rightarrow p$：没有 $p$ 就不可能有 $q$。“充分必要”表示 $p \\Leftrightarrow q$。",
      ),
      generate(rng) {
        const [a, b] = twoLetters(rng);
        const kind = rng.pick(["sufficient", "necessary", "both"] as const);
        const words = {
          sufficient: t("a sufficient condition", "充分条件"),
          necessary: t("a necessary condition", "必要条件"),
          both: t("a necessary and sufficient condition", "充分必要条件"),
        }[kind];
        const right = kind === "sufficient" ? imp(a, b) : kind === "necessary" ? imp(b, a) : iff(a, b);
        // ¬q ⇒ ¬p says the same as p ⇒ q, so the contrapositive offered must not be that of the right answer.
        const contrapositive = kind === "necessary" ? imp(not(b), not(a)) : imp(not(a), not(b));
        const wrong = [imp(a, b), imp(b, a), iff(a, b), contrapositive].filter((f) => tex(f) !== tex(right));
        return oneOf(
          rng,
          t(
            `Which statement means "$${tex(a)}$ is ${words.en} for $${tex(b)}$"?`,
            `哪个命题表示“$${tex(a)}$ 是 $${tex(b)}$ 的${words["zh-CN"]}”？`,
          ),
          math(right),
          wrong.map(math),
          t(
            `${kind === "sufficient" ? "A sufficient condition implies the other statement" : kind === "necessary" ? "A necessary condition is implied by the other statement" : "A necessary and sufficient condition implies and is implied by the other statement"}, so the statement is $${tex(right)}$.`,
            `${kind === "sufficient" ? "充分条件蕴涵另一命题" : kind === "necessary" ? "必要条件被另一命题蕴涵" : "充分必要条件与另一命题互相蕴涵"}，所以该命题为 $${tex(right)}$。`,
          ),
        );
      },
    },
    {
      id: "classifying-conditions",
      title: t("Classifying conditions", "判断条件类型"),
      explanation: t(
        'To classify condition $A$ for $B$, ask two questions: does $A$ imply $B$ (sufficient)? does $B$ imply $A$ (necessary)? For integers $x$, "$x$ is a multiple of $6$" is sufficient but not necessary for "$x$ is even": $6 \\mid x$ forces $x$ even, but $x = 4$ is even without being a multiple of $6$.',
        "判断 $A$ 是 $B$ 的什么条件，要问两个问题：$A$ 是否蕴涵 $B$（充分）？$B$ 是否蕴涵 $A$（必要）？对整数 $x$，“$x$ 是 $6$ 的倍数”是“$x$ 是偶数”的充分不必要条件：$6 \\mid x$ 必然使 $x$ 为偶数，但 $x = 4$ 是偶数却不是 $6$ 的倍数。",
      ),
      generate(rng) {
        let a: Text;
        let b: Text;
        let ab: boolean;
        let ba: boolean;
        let why: Text;
        if (rng.bool()) {
          const divisors = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15];
          const k = rng.pick(divisors);
          const m = rng.pick(divisors.filter((v) => v !== k));
          a = t(`$x$ is a multiple of $${k}$`, `$x$ 是 $${k}$ 的倍数`);
          b = t(`$x$ is a multiple of $${m}$`, `$x$ 是 $${m}$ 的倍数`);
          ab = k % m === 0;
          ba = m % k === 0;
          why = t(
            `Every multiple of $${k}$ is a multiple of $${m}$ ${ab ? `since $${m} \\mid ${k}$` : `only if $${m} \\mid ${k}$, which fails`}; every multiple of $${m}$ is a multiple of $${k}$ ${ba ? `since $${k} \\mid ${m}$` : `only if $${k} \\mid ${m}$, which fails`}.`,
            `$${k}$ 的倍数都是 $${m}$ 的倍数${ab ? `，因为 $${m} \\mid ${k}$` : `当且仅当 $${m} \\mid ${k}$，这不成立`}；$${m}$ 的倍数都是 $${k}$ 的倍数${ba ? `，因为 $${k} \\mid ${m}$` : `当且仅当 $${k} \\mid ${m}$，这不成立`}。`,
          );
        } else {
          const p = rng.int(-5, 9);
          const q = rng.bool(0.3) ? p : rng.int(-5, 9);
          a = t(`$x > ${p}$`, `$x > ${p}$`);
          b = p === q ? t(`$x \\ge ${p + 1}$`, `$x \\ge ${p + 1}$`) : t(`$x > ${q}$`, `$x > ${q}$`);
          ab = p >= q;
          ba = q >= p;
          why = t(
            p === q
              ? `For integers, $x > ${p}$ and $x \\ge ${p + 1}$ say the same thing.`
              : `For integers, $x > ${Math.max(p, q)}$ implies $x > ${Math.min(p, q)}$ but not conversely: $x = ${Math.max(p, q)}$ satisfies only $x > ${Math.min(p, q)}$.`,
            p === q
              ? `对整数，$x > ${p}$ 与 $x \\ge ${p + 1}$ 说的是同一件事。`
              : `对整数，$x > ${Math.max(p, q)}$ 蕴涵 $x > ${Math.min(p, q)}$，反之不成立：$x = ${Math.max(p, q)}$ 只满足 $x > ${Math.min(p, q)}$。`,
          );
        }
        const kind: Condition = ab && ba ? "both" : ab ? "sufficient" : ba ? "necessary" : "neither";
        return oneOf(
          rng,
          t(
            `For integers $x$, what kind of condition is "${a.en}" for "${b.en}"?`,
            `对整数 $x$，“${a["zh-CN"]}”是“${b["zh-CN"]}”的什么条件？`,
          ),
          conditionNames[kind],
          Object.values(conditionNames).filter((n) => n !== conditionNames[kind]),
          t(`${why.en} So it is ${conditionNames[kind].en.toLowerCase()}.`, `${why["zh-CN"]}所以是${conditionNames[kind]["zh-CN"]}条件。`),
        );
      },
    },
  ],
};

/** Construction is a way of phrasing a conditional; parts gives the hypothesis and conclusion. */
interface Construction {
  readonly phrase: (a: string, b: string) => Text;
  /** forward is true when the construction means a ⇒ b, false when it means b ⇒ a. */
  readonly meaning: "forward" | "backward" | "unless";
}

/** constructions are common English phrasings of conditionals. */
const constructions: readonly Construction[] = [
  { phrase: (a, b) => t(`${a} only if ${b}`, `${a}仅当${b}`), meaning: "forward" },
  { phrase: (a, b) => t(`${a} if ${b}`, `${a}，如果${b}`), meaning: "backward" },
  { phrase: (a, b) => t(`${a} whenever ${b}`, `每当${b}时，${a}`), meaning: "backward" },
  { phrase: (a, b) => t(`${a} is sufficient for ${b}`, `${a}是${b}的充分条件`), meaning: "forward" },
  { phrase: (a, b) => t(`${a} is necessary for ${b}`, `${a}是${b}的必要条件`), meaning: "backward" },
  { phrase: (a, b) => t(`${a} provided that ${b}`, `只要${b}，就${a}`), meaning: "backward" },
  { phrase: (a, b) => t(`${a} unless ${b}`, `除非${b}，否则${a}`), meaning: "unless" },
];

/** Fact is a true implication between two mathematical properties. */
interface Fact {
  readonly a: Text;
  readonly b: Text;
}

/** fact picks a true implication a ⇒ b whose converse fails. */
function fact(rng: Rng): Fact {
  const kind = rng.int(0, 3);
  if (kind === 0) {
    const k = rng.int(2, 5);
    const m = rng.int(2, 4);
    return {
      a: t(`$n$ is divisible by $${k * m}$`, `$n$ 能被 $${k * m}$ 整除`),
      b: t(`$n$ is divisible by $${k}$`, `$n$ 能被 $${k}$ 整除`),
    };
  }
  if (kind === 1) {
    const b = rng.int(-5, 8);
    const a = b + rng.int(1, 6);
    return { a: t(`$x > ${a}$`, `$x > ${a}$`), b: t(`$x > ${b}$`, `$x > ${b}$`) };
  }
  if (kind === 2) {
    const a = rng.int(1, 9);
    return { a: t(`$x = ${a}$`, `$x = ${a}$`), b: t(`$x^2 = ${a * a}$`, `$x^2 = ${a * a}$`) };
  }
  return rng.pick([
    { a: t("$ABCD$ is a square", "$ABCD$ 是正方形"), b: t("$ABCD$ is a rectangle", "$ABCD$ 是矩形") },
    {
      a: t("$\\triangle ABC$ is equilateral", "$\\triangle ABC$ 是等边三角形"),
      b: t("$\\triangle ABC$ is isosceles", "$\\triangle ABC$ 是等腰三角形"),
    },
    { a: t("$f$ is differentiable at $a$", "$f$ 在 $a$ 处可导"), b: t("$f$ is continuous at $a$", "$f$ 在 $a$ 处连续") },
  ]);
}

/** grammaticalConstructionsForConditionalStatements reads the many English phrasings of p ⇒ q. */
export const grammaticalConstructionsForConditionalStatements: TopicDef = {
  id: "grammatical-constructions-for-conditional-statements",
  title: t("Grammatical Constructions for Conditional Statements", "条件命题的语法结构"),
  summary: t(
    '"p only if q", "q if p", "q whenever p" and "q provided that p" all mean p ⇒ q; "p unless q" means ¬q ⇒ p.',
    "“p 仅当 q”、“q，如果 p”、“每当 p 时，q”、“只要 p，就 q”都表示 p ⇒ q；“除非 q，否则 p”表示 ¬q ⇒ p。",
  ),
  prerequisites: ["necessary-and-sufficient-conditions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "symbolizing-conditional-phrasings",
      title: t("Symbolizing phrasings", "把说法写成符号"),
      explanation: t(
        'Find the hypothesis first. In "$p$ only if $q$", $p$ cannot happen without $q$, so $p \\Rightarrow q$. In "$p$ if $q$", the "if" marks the hypothesis: $q \\Rightarrow p$. "$p$ unless $q$" means that if $q$ fails then $p$ holds: $\\neg q \\Rightarrow p$, equivalently $p \\vee q$.',
        "先找出前提。在“$p$ 仅当 $q$”中，没有 $q$ 就不可能有 $p$，所以是 $p \\Rightarrow q$。在“$p$，如果 $q$”中，“如果”标出的是前提：$q \\Rightarrow p$。“除非 $q$，否则 $p$”表示若 $q$ 不成立则 $p$ 成立：$\\neg q \\Rightarrow p$，等价于 $p \\vee q$。",
      ),
      generate(rng) {
        const [a, b] = twoLetters(rng);
        const c = rng.pick(constructions);
        const right = c.meaning === "forward" ? imp(a, b) : c.meaning === "backward" ? imp(b, a) : imp(not(b), a);
        const wrong = inequivalentTo(rng, right, [imp(a, b), imp(b, a), iff(a, b), imp(b, not(a)), imp(not(a), b), imp(a, not(b))]);
        const phrase = c.phrase(`$${tex(a)}$`, `$${tex(b)}$`);
        return oneOf(
          rng,
          t(`Which statement is "${phrase.en}" in symbols?`, `“${phrase["zh-CN"]}”用符号表示是哪个命题？`),
          math(right),
          wrong.map(math),
          t(
            c.meaning === "unless"
              ? `"Unless $${tex(b)}$" means "if not $${tex(b)}$", so the statement is $${tex(right)}$.`
              : `The hypothesis is $${tex(right.k === "imp" ? right.a : a)}$, so the statement is $${tex(right)}$.`,
            c.meaning === "unless"
              ? `“除非 $${tex(b)}$”表示“如果非 $${tex(b)}$”，所以该命题为 $${tex(right)}$。`
              : `前提是 $${tex(right.k === "imp" ? right.a : a)}$，所以该命题为 $${tex(right)}$。`,
          ),
        );
      },
    },
    {
      id: "rewriting-sentences-as-if-then",
      title: t("Rewriting sentences as if–then", "改写成“如果……那么……”"),
      explanation: t(
        '"$f$ is continuous at $a$ if $f$ is differentiable at $a$" and "$f$ is differentiable at $a$ only if $f$ is continuous at $a$" both say: if $f$ is differentiable at $a$, then $f$ is continuous at $a$.',
        "“$f$ 在 $a$ 处连续，如果 $f$ 在 $a$ 处可导”与“$f$ 在 $a$ 处可导仅当 $f$ 在 $a$ 处连续”说的都是：如果 $f$ 在 $a$ 处可导，那么 $f$ 在 $a$ 处连续。",
      ),
      generate(rng) {
        const f = fact(rng);
        const c = rng.pick(constructions.filter((x) => x.meaning !== "unless"));
        const phrase = c.meaning === "forward" ? c.phrase.bind(null) : c.phrase.bind(null);
        const sentence =
          c.meaning === "forward"
            ? t(phrase(f.a.en, f.b.en).en, phrase(f.a["zh-CN"], f.b["zh-CN"])["zh-CN"])
            : t(phrase(f.b.en, f.a.en).en, phrase(f.b["zh-CN"], f.a["zh-CN"])["zh-CN"]);
        const ifThen = (h: Text, k: Text) => t(`If ${h.en}, then ${k.en}.`, `如果 ${h["zh-CN"]}，那么 ${k["zh-CN"]}。`);
        return oneOf(
          rng,
          t(`Which sentence means the same as "${sentence.en}"?`, `哪个句子与“${sentence["zh-CN"]}”意思相同？`),
          ifThen(f.a, f.b),
          [ifThen(f.b, f.a), t(`${f.a.en} if and only if ${f.b.en}.`, `${f.a["zh-CN"]}当且仅当 ${f.b["zh-CN"]}。`)],
          t(`The hypothesis is "${f.a.en}" and the conclusion is "${f.b.en}".`, `前提是“${f.a["zh-CN"]}”，结论是“${f.b["zh-CN"]}”。`),
        );
      },
    },
  ],
};

/** setExpr translates a formula into a set expression, writing p, q, r and s as A, B, C and D. */
export function setExpr(f: Formula): string {
  const names: Record<Var, string> = { p: "A", q: "B", r: "C", s: "D" };
  const inner = (g: Formula) => (g.k === "var" || g.k === "not" ? setExpr(g) : `(${setExpr(g)})`);
  if (f.k === "var") return names[f.v];
  if (f.k === "not") return f.a.k === "not" ? `(${setExpr(f.a)})^{c}` : `${inner(f.a)}^{c}`;
  if (f.k === "and") return `${inner(f.a)} \\cap ${inner(f.b)}`;
  if (f.k === "or") return `${inner(f.a)} \\cup ${inner(f.b)}`;
  if (f.k === "imp") return setExpr(or(not(f.a), f.b));
  return `${inner(f.a)} = ${inner(f.b)}`;
}

/** predExpr writes a formula with predicate letters P(x), Q(x). */
function predExpr(f: Formula): string {
  return tex(f).replace(/\bp\b/g, "P(x)").replace(/\bq\b/g, "Q(x)");
}

/** translatingBetweenLogicalAndSetOperations matches connectives with set operations. */
export const translatingBetweenLogicalAndSetOperations: TopicDef = {
  id: "translating-between-logical-and-set-operations",
  title: t("Translating Between Logical and Set Operations", "逻辑运算与集合运算的互译"),
  summary: t(
    "∧, ∨ and ¬ on predicates match ∩, ∪ and complement on truth sets; ∀x (P(x) ⇒ Q(x)) matches A ⊆ B.",
    "谓词上的 ∧、∨、¬ 对应真值集上的 ∩、∪、补集；∀x (P(x) ⇒ Q(x)) 对应 A ⊆ B。",
  ),
  prerequisites: ["simplifying-predicate-expressions-using-de-morgans-laws", "conditional-statements-with-predicates"],
  encompasses: [{ topic: "simplifying-predicate-expressions-using-de-morgans-laws", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "truth-sets-of-compound-predicates",
      title: t("Truth sets of compound predicates", "复合谓词的真值集"),
      explanation: t(
        "Let $A$ and $B$ be the truth sets of $P(x)$ and $Q(x)$. Replace $\\wedge$ by $\\cap$, $\\vee$ by $\\cup$ and $\\neg$ by complement: $P(x) \\wedge \\neg Q(x)$ has truth set $A \\cap B^{c}$, and $\\neg(P(x) \\vee Q(x))$ has truth set $(A \\cup B)^{c}$.",
        "设 $A$、$B$ 分别是 $P(x)$、$Q(x)$ 的真值集。把 $\\wedge$ 换成 $\\cap$，$\\vee$ 换成 $\\cup$，$\\neg$ 换成补集：$P(x) \\wedge \\neg Q(x)$ 的真值集为 $A \\cap B^{c}$，$\\neg(P(x) \\vee Q(x))$ 的真值集为 $(A \\cup B)^{c}$。",
      ),
      generate(rng) {
        for (;;) {
          const f = randomFormula(rng, 2, ["p", "q"], ["and", "or"]);
          if (varsOf(f).length < 2) continue;
          const wrong = inequivalentTo(rng, f, [...[f.k === "not" ? f.a : not(f)], ...swapConnectives(f), ...negateLeaves(f)]);
          const opt = (g: Formula) => t(`$${setExpr(g)}$`, `$${setExpr(g)}$`);
          return oneOf(
            rng,
            t(
              `Let $A$ and $B$ be the truth sets of $P(x)$ and $Q(x)$ in a domain $U$. What is the truth set of $${predExpr(f)}$?`,
              `设 $A$、$B$ 分别是 $P(x)$、$Q(x)$ 在论域 $U$ 中的真值集。$${predExpr(f)}$ 的真值集是什么？`,
            ),
            opt(f),
            wrong.map(opt),
            t(
              `Replace $\\wedge$ by $\\cap$, $\\vee$ by $\\cup$ and $\\neg$ by complement: $${setExpr(f)}$.`,
              `把 $\\wedge$ 换成 $\\cap$，$\\vee$ 换成 $\\cup$，$\\neg$ 换成补集：$${setExpr(f)}$。`,
            ),
          );
        }
      },
    },
    {
      id: "quantified-statements-as-set-relations",
      title: t("Quantified statements as set relations", "量化命题与集合关系"),
      explanation: t(
        'A predicate picks out the set of elements where it is true, so statements about all elements become statements about how those sets relate. "$P(x) \\Rightarrow Q(x)$ for every $x \\in U$" says every element of $A$ lies in $B$: $A \\subseteq B$. "$P(x) \\Leftrightarrow Q(x)$ for every $x$" says $A = B$. "No $x$ satisfies $P(x) \\wedge Q(x)$" says $A \\cap B = \\varnothing$.',
        "一个谓词选出使它为真的元素组成的集合，所以关于所有元素的命题就变成了关于这些集合之间关系的命题。“对每个 $x \\in U$，$P(x) \\Rightarrow Q(x)$”表示 $A$ 的每个元素都在 $B$ 中：$A \\subseteq B$。“对每个 $x$，$P(x) \\Leftrightarrow Q(x)$”表示 $A = B$。“没有 $x$ 满足 $P(x) \\wedge Q(x)$”表示 $A \\cap B = \\varnothing$。",
      ),
      generate(rng) {
        const letters = rng.shuffle([
          ["P", "A"],
          ["Q", "B"],
          ["R", "C"],
        ] as const);
        const [[p, a], [q, b]] = [letters[0]!, letters[1]!];
        const neg = rng.int(0, 3);
        const pl = neg === 1 ? `\\neg ${p}(x)` : `${p}(x)`;
        const ql = neg === 2 ? `\\neg ${q}(x)` : `${q}(x)`;
        const as = neg === 1 ? `${a}^{c}` : a;
        const bs = neg === 2 ? `${b}^{c}` : b;
        const kind = rng.int(0, 3);
        const statement = [
          t(`$${pl} \\Rightarrow ${ql}$ for every $x \\in U$`, `对每个 $x \\in U$，$${pl} \\Rightarrow ${ql}$`),
          t(`$${pl} \\Leftrightarrow ${ql}$ for every $x \\in U$`, `对每个 $x \\in U$，$${pl} \\Leftrightarrow ${ql}$`),
          t(`no $x \\in U$ satisfies $${pl} \\wedge ${ql}$`, `没有 $x \\in U$ 满足 $${pl} \\wedge ${ql}$`),
          t(`some $x \\in U$ satisfies $${pl} \\wedge ${ql}$`, `存在 $x \\in U$ 满足 $${pl} \\wedge ${ql}$`),
        ][kind]!;
        const relations = [
          `${as} \\subseteq ${bs}`,
          `${as} = ${bs}`,
          `${as} \\cap ${bs} = \\varnothing`,
          `${as} \\cap ${bs} \\ne \\varnothing`,
          `${bs} \\subseteq ${as}`,
        ];
        const opt = (s: string) => t(`$${s}$`, `$${s}$`);
        return oneOf(
          rng,
          t(
            `Let $${a}$ and $${b}$ be the truth sets of $${p}(x)$ and $${q}(x)$. Which set relation says that ${statement.en}?`,
            `设 $${a}$、$${b}$ 分别是 $${p}(x)$、$${q}(x)$ 的真值集。哪个集合关系表示${statement["zh-CN"]}？`,
          ),
          opt(relations[kind]!),
          relations.filter((_, i) => i !== kind).map(opt),
          t(
            `The truth sets of the two parts are $${as}$ and $${bs}$, so the statement says $${relations[kind]}$.`,
            `两部分的真值集分别为 $${as}$ 和 $${bs}$，所以该命题表示 $${relations[kind]}$。`,
          ),
        );
      },
    },
  ],
};

/** swapConnectives changes the top connective of a formula. */
function swapConnectives(f: Formula): Formula[] {
  if (f.k === "and") return [or(f.a, f.b)];
  if (f.k === "or") return [and(f.a, f.b)];
  if (f.k === "not") return swapConnectives(f.a).map(not);
  return [];
}

/** negateLeaves negates one variable occurrence at a time. */
function negateLeaves(f: Formula): Formula[] {
  if (f.k === "var") return [not(f)];
  if (f.k === "not") return f.a.k === "var" ? [f.a] : negateLeaves(f.a).map(not);
  return [...negateLeaves(f.a).map((a) => ({ ...f, a })), ...negateLeaves(f.b).map((b) => ({ ...f, b }))];
}

/** Claim is a quantified statement with its truth value and a reason. */
interface Claim {
  readonly tex: string;
  readonly value: boolean;
  readonly why: Text;
}

/** Domain is ℤ or ℝ. */
type Domain = "Z" | "R";

/** dom writes a domain in LaTeX. */
const dom = (d: Domain) => (d === "Z" ? "\\mathbb{Z}" : "\\mathbb{R}");

/** singleClaim builds a statement with one quantifier over ℤ or ℝ. */
function singleClaim(rng: Rng): Claim {
  const d: Domain = rng.bool() ? "Z" : "R";
  const D = dom(d);
  const k = rng.int(2, 9);
  const kind = rng.int(0, 7);
  switch (kind) {
    case 0:
      return {
        tex: `\\forall x \\in ${D},\\ x^2 \\ge 0`,
        value: true,
        why: t("Every square is nonnegative.", "任何数的平方都非负。"),
      };
    case 1:
      return {
        tex: `\\forall x \\in ${D},\\ x^2 > 0`,
        value: false,
        why: t("$x = 0$ is a counterexample: $0^2 = 0$.", "$x = 0$ 是反例：$0^2 = 0$。"),
      };
    case 2: {
      const value = d === "R" || k % 2 === 0;
      return {
        tex: `\\exists x \\in ${D},\\ 2x = ${k}`,
        value,
        why: value
          ? t(`$x = ${k / 2}$ works.`, `$x = ${k / 2}$ 满足条件。`)
          : t(`The only solution is $x = ${k}/2$, which is not an integer.`, `唯一的解是 $x = ${k}/2$，它不是整数。`),
      };
    }
    case 3:
      return {
        tex: `\\exists x \\in ${D},\\ x^2 = -${k}`,
        value: false,
        why: t("A square is never negative.", "平方永远不是负数。"),
      };
    case 4: {
      const root = Math.round(Math.sqrt(k));
      const value = d === "R" || root * root === k;
      return {
        tex: `\\exists x \\in ${D},\\ x^2 = ${k}`,
        value,
        why: value
          ? t(`$x = ${root * root === k ? root : `\\sqrt{${k}}`}$ works.`, `$x = ${root * root === k ? root : `\\sqrt{${k}}`}$ 满足条件。`)
          : t(`$${k}$ is not a perfect square, so no integer works.`, `$${k}$ 不是完全平方数，所以没有整数满足。`),
      };
    }
    case 5:
      return {
        tex: `\\forall x \\in ${D},\\ x^2 \\ge x`,
        value: d === "Z",
        why:
          d === "Z"
            ? t(
                "For an integer, $x^2 - x = x(x - 1) \\ge 0$ since there is no integer strictly between $0$ and $1$.",
                "对整数，$x^2 - x = x(x - 1) \\ge 0$，因为 $0$ 与 $1$ 之间没有整数。",
              )
            : t(
                "$x = \\tfrac{1}{2}$ is a counterexample: $\\tfrac{1}{4} < \\tfrac{1}{2}$.",
                "$x = \\tfrac{1}{2}$ 是反例：$\\tfrac{1}{4} < \\tfrac{1}{2}$。",
              ),
      };
    case 6:
      return {
        tex: `\\forall x \\in ${D},\\ x + ${k} > x`,
        value: true,
        why: t(`Adding $${k} > 0$ always increases a number.`, `加上 $${k} > 0$ 总会使数变大。`),
      };
    default:
      return {
        tex: `\\exists x \\in ${D},\\ ${k}x = x`,
        value: true,
        why: t("$x = 0$ works.", "$x = 0$ 满足条件。"),
      };
  }
}

/** universalAndExistentialQuantifiers evaluates ∀ and ∃ statements. */
export const universalAndExistentialQuantifiers: TopicDef = {
  id: "universal-and-existential-quantifiers",
  title: t("Universal and Existential Quantifiers", "全称量词与存在量词"),
  summary: t(
    "∀x ∈ S, P(x) is true when P holds for every element of S; ∃x ∈ S, P(x) is true when P holds for at least one.",
    "∀x ∈ S, P(x) 在 P 对 S 的每个元素都成立时为真；∃x ∈ S, P(x) 在 P 至少对一个元素成立时为真。",
  ),
  prerequisites: ["truth-sets-of-predicates"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "quantifiers-over-finite-sets",
      title: t("Quantifiers over finite sets", "有限集上的量词"),
      explanation: t(
        '$\\forall x \\in S,\\ P(x)$ ("for all") is true when $P(x)$ holds for every element of $S$; one counterexample makes it false. $\\exists x \\in S,\\ P(x)$ ("there exists") is true when at least one element works. With $S = \\{2, 3, 5\\}$, "$\\forall x \\in S$, $x$ is prime" is true, while "$\\exists x \\in S$, $x$ is even" is true because of $2$.',
        "$\\forall x \\in S,\\ P(x)$（“对所有”）在 $P(x)$ 对 $S$ 的每个元素都成立时为真；一个反例就使它为假。$\\exists x \\in S,\\ P(x)$（“存在”）只要至少一个元素满足就为真。若 $S = \\{2, 3, 5\\}$，则“$\\forall x \\in S$，$x$ 是质数”为真，“$\\exists x \\in S$，$x$ 是偶数”因 $2$ 而为真。",
      ),
      generate(rng) {
        const size = rng.int(3, 5);
        const s = rng
          .shuffle(range(1, 30))
          .slice(0, size)
          .sort((x, y) => x - y);
        const [p] = twoPredicates(rng, 30);
        const all = rng.bool();
        const hits = s.filter(p.holds);
        const value = all ? hits.length === s.length : hits.length > 0;
        const q = all ? "\\forall" : "\\exists";
        const misses = s.filter((x) => !p.holds(x));
        return oneOf(
          rng,
          t(
            `Let $S = ${setTex(s)}$. Is the statement "$${q} x \\in S$, ${p.text.en}" true or false?`,
            `设 $S = ${setTex(s)}$。命题“$${q} x \\in S$，${p.text["zh-CN"]}”是真还是假？`,
          ),
          truthOption(value),
          [truthOption(!value)],
          all
            ? value
              ? t("Every element of $S$ satisfies the predicate.", "$S$ 的每个元素都满足该谓词。")
              : t(`$x = ${misses[0]}$ is a counterexample.`, `$x = ${misses[0]}$ 是反例。`)
            : value
              ? t(`$x = ${hits[0]}$ satisfies the predicate.`, `$x = ${hits[0]}$ 满足该谓词。`)
              : t("No element of $S$ satisfies the predicate.", "$S$ 中没有元素满足该谓词。"),
        );
      },
    },
    {
      id: "quantifiers-over-infinite-sets",
      title: t("Quantifiers over infinite sets", "无限集上的量词"),
      explanation: t(
        "Over $\\mathbb{Z}$ or $\\mathbb{R}$ you cannot check every element. A $\\forall$ statement needs a general argument, or one counterexample to refute it; an $\\exists$ statement needs one example, or a general argument that none exists. $\\exists x \\in \\mathbb{Z},\\ 2x = 7$ is false, but $\\exists x \\in \\mathbb{R},\\ 2x = 7$ is true.",
        "在 $\\mathbb{Z}$ 或 $\\mathbb{R}$ 上无法逐个检验。$\\forall$ 命题需要一般性的论证，或用一个反例否定；$\\exists$ 命题需要一个例子，或论证不存在。$\\exists x \\in \\mathbb{Z},\\ 2x = 7$ 为假，而 $\\exists x \\in \\mathbb{R},\\ 2x = 7$ 为真。",
      ),
      generate(rng) {
        const c = singleClaim(rng);
        return oneOf(
          rng,
          t(`Is the statement $${c.tex}$ true or false?`, `命题 $${c.tex}$ 是真还是假？`),
          truthOption(c.value),
          [truthOption(!c.value)],
          t(`${c.why.en} So the statement is ${c.value ? "true" : "false"}.`, `${c.why["zh-CN"]}所以该命题为${c.value ? "真" : "假"}。`),
        );
      },
    },
  ],
};

/** Rel is a relation with its negation, in LaTeX. */
interface Rel {
  readonly tex: string;
  readonly neg: string;
  /** wrongNeg is a plausible but incorrect negation. */
  readonly wrongNeg: string;
}

/** relation picks a relation between an expression in x and a number. */
function relation(rng: Rng, lhs: string): Rel {
  const c = rng.int(-9, 12);
  const [op, neg, wrong] = rng.pick([
    [">", "\\le", "<"],
    ["<", "\\ge", ">"],
    ["\\ge", "<", "\\le"],
    ["\\le", ">", "\\ge"],
    ["=", "\\ne", "<"],
    ["\\ne", "=", ">"],
  ] as const);
  return { tex: `${lhs} ${op} ${c}`, neg: `${lhs} ${neg} ${c}`, wrongNeg: `${lhs} ${wrong} ${c}` };
}

/** flipQ swaps ∀ and ∃. */
const flipQ = (q: string) => (q === "\\forall" ? "\\exists" : "\\forall");

/** negatingQuantifiedStatements negates ∀ and ∃ statements. */
export const negatingQuantifiedStatements: TopicDef = {
  id: "negating-quantified-statements",
  title: t("Negating Quantified Statements", "否定量化命题"),
  summary: t("¬(∀x, P(x)) ≡ ∃x, ¬P(x) and ¬(∃x, P(x)) ≡ ∀x, ¬P(x).", "¬(∀x, P(x)) ≡ ∃x, ¬P(x)，¬(∃x, P(x)) ≡ ∀x, ¬P(x)。"),
  prerequisites: ["universal-and-existential-quantifiers", "simplifying-predicate-expressions-using-de-morgans-laws"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "negating-quantified-statements-symbolically",
      title: t("Negating symbolically", "用符号否定"),
      explanation: t(
        "To negate, flip the quantifier and negate the predicate: $\\neg(\\forall x,\\ P(x)) \\equiv \\exists x,\\ \\neg P(x)$. Then simplify the predicate with De Morgan's laws and $\\neg(A \\Rightarrow B) \\equiv A \\wedge \\neg B$. The negation of $\\forall x \\in \\mathbb{R},\\ (x > 2 \\Rightarrow x^2 > 4)$ is $\\exists x \\in \\mathbb{R},\\ (x > 2 \\wedge x^2 \\le 4)$.",
        "否定时，翻转量词并否定谓词：$\\neg(\\forall x,\\ P(x)) \\equiv \\exists x,\\ \\neg P(x)$。再用德摩根律和 $\\neg(A \\Rightarrow B) \\equiv A \\wedge \\neg B$ 化简谓词。$\\forall x \\in \\mathbb{R},\\ (x > 2 \\Rightarrow x^2 > 4)$ 的否定是 $\\exists x \\in \\mathbb{R},\\ (x > 2 \\wedge x^2 \\le 4)$。",
      ),
      generate(rng) {
        const q = rng.pick(["\\forall", "\\exists"]);
        const D = dom(rng.bool() ? "Z" : "R");
        const a = relation(rng, "x");
        const b = relation(rng, rng.pick(["x^2", "2x", "x + 1", "|x|"]));
        const shape = rng.int(0, 2);
        const body = [a.tex, `(${a.tex} \\wedge ${b.tex})`, `(${a.tex} \\Rightarrow ${b.tex})`][shape]!;
        const negBody = [a.neg, `(${a.neg} \\vee ${b.neg})`, `(${a.tex} \\wedge ${b.neg})`][shape]!;
        const badBody = [a.wrongNeg, `(${a.neg} \\wedge ${b.neg})`, `(${a.tex} \\Rightarrow ${b.neg})`][shape]!;
        const s = (qq: string, bb: string) => t(`$${qq} x \\in ${D},\\ ${bb}$`, `$${qq} x \\in ${D},\\ ${bb}$`);
        const nq = flipQ(q);
        return oneOf(
          rng,
          t(`What is the negation of $${q} x \\in ${D},\\ ${body}$?`, `$${q} x \\in ${D},\\ ${body}$ 的否定是什么？`),
          s(nq, negBody),
          [s(q, negBody), s(nq, badBody), s(nq, body)],
          t(
            `Flip $${q}$ to $${nq}$ and negate the predicate: $\\neg ${shape === 0 ? `(${body})` : body} \\equiv ${negBody}$.`,
            `把 $${q}$ 换成 $${nq}$，并否定谓词：$\\neg ${shape === 0 ? `(${body})` : body} \\equiv ${negBody}$。`,
          ),
        );
      },
    },
    {
      id: "negating-quantified-sentences",
      title: t("Negating sentences in words", "否定文字叙述的命题"),
      explanation: t(
        'The negation of "every prime number is odd" is "some prime number is not odd", not "every prime number is not odd". The negation of "some perfect square is even" is "every perfect square is not even", that is, "no perfect square is even".',
        "“每个质数都是奇数”的否定是“存在一个质数不是奇数”，而不是“每个质数都不是奇数”。“存在一个完全平方数是偶数”的否定是“每个完全平方数都不是偶数”，即“没有完全平方数是偶数”。",
      ),
      generate(rng) {
        const k = rng.int(3, 9);
        const a = rng.int(2, 20);
        const subject = rng.pick([
          t("prime number", "质数"),
          t(`multiple of $${k}$`, `$${k}$ 的倍数`),
          t(`integer greater than $${a}$`, `大于 $${a}$ 的整数`),
          t("perfect square", "完全平方数"),
        ]);
        const m = rng.int(2, 7);
        const b = rng.int(5, 40);
        const prop = rng.pick([
          [t("is odd", "是奇数"), t("is not odd", "不是奇数")],
          [t(`is divisible by $${m}$`, `能被 $${m}$ 整除`), t(`is not divisible by $${m}$`, `不能被 $${m}$ 整除`)],
          [t(`is less than $${b}$`, `小于 $${b}$`), t(`is at least $${b}$`, `不小于 $${b}$`)],
        ] as const);
        const [yes, no] = prop;
        const all = rng.bool();
        const every = (p: Text) => t(`Every ${subject.en} ${p.en}.`, `每个${subject["zh-CN"]}都${p["zh-CN"]}。`);
        const some = (p: Text) => t(`Some ${subject.en} ${p.en}.`, `存在一个${subject["zh-CN"]}${p["zh-CN"]}。`);
        const original = all ? every(yes) : some(yes);
        const right = all ? some(no) : every(no);
        return oneOf(
          rng,
          t(`What is the negation of "${original.en}"?`, `“${original["zh-CN"]}”的否定是什么？`),
          right,
          all ? [every(no), some(yes)] : [some(no), every(yes)],
          t(
            `Flip "${all ? "every" : "some"}" to "${all ? "some" : "every"}" and negate the property.`,
            `把“${all ? "每个" : "存在"}”换成“${all ? "存在" : "每个"}”，并否定性质。`,
          ),
        );
      },
    },
  ],
};

/** nestedClaim builds a statement with two quantifiers over ℤ or ℝ. */
function nestedClaim(rng: Rng, forallFirst: boolean): Claim {
  const d: Domain = rng.bool() ? "Z" : "R";
  const D = dom(d);
  const c = rng.int(2, 9);
  const pre = forallFirst ? `\\forall x \\in ${D},\\ \\exists y \\in ${D},\\ ` : `\\exists x \\in ${D},\\ \\forall y \\in ${D},\\ `;
  const kind = rng.int(0, 5);
  if (forallFirst) {
    switch (kind) {
      case 0:
        return { tex: `${pre}x + y = ${c}`, value: true, why: t(`Given $x$, take $y = ${c} - x$.`, `给定 $x$，取 $y = ${c} - x$。`) };
      case 1:
        return d === "R"
          ? { tex: `${pre}${c}y = x`, value: true, why: t(`Given $x$, take $y = x/${c}$.`, `给定 $x$，取 $y = x/${c}$。`) }
          : {
              tex: `${pre}${c}y = x`,
              value: false,
              why: t(`For $x = 1$, $y = 1/${c}$ is not an integer.`, `当 $x = 1$ 时，$y = 1/${c}$ 不是整数。`),
            };
      case 2:
        return {
          tex: `${pre}xy = ${c}`,
          value: false,
          why: t(`For $x = 0$, $xy = 0 \\ne ${c}$ for every $y$.`, `当 $x = 0$ 时，对每个 $y$ 都有 $xy = 0 \\ne ${c}$。`),
        };
      case 3:
        return d === "R"
          ? { tex: `${pre}y^3 = x + ${c}`, value: true, why: t(`Take $y = \\sqrt[3]{x + ${c}}$.`, `取 $y = \\sqrt[3]{x + ${c}}$。`) }
          : {
              tex: `${pre}y^3 = x + ${c}`,
              value: false,
              why: t(
                `For $x = ${2 - c}$, we would need $y^3 = 2$, and no integer cube is $2$.`,
                `当 $x = ${2 - c}$ 时需要 $y^3 = 2$，而没有整数的立方等于 $2$。`,
              ),
            };
      case 4:
        return {
          tex: `${pre}y^2 = x + ${c}`,
          value: false,
          why: t(`For $x = ${-c - 1}$, $y^2 = -1$ has no solution.`, `当 $x = ${-c - 1}$ 时，$y^2 = -1$ 无解。`),
        };
      default:
        return d === "R"
          ? { tex: `${pre}x < y < x + 1`, value: true, why: t("Take $y = x + \\tfrac{1}{2}$.", "取 $y = x + \\tfrac{1}{2}$。") }
          : {
              tex: `${pre}x < y < x + 1`,
              value: false,
              why: t("There is no integer strictly between $x$ and $x + 1$.", "$x$ 与 $x + 1$ 之间没有整数。"),
            };
    }
  }
  switch (kind) {
    case 0:
      return { tex: `${pre}x + y = y + ${c}`, value: true, why: t(`$x = ${c}$ works for every $y$.`, `$x = ${c}$ 对每个 $y$ 都成立。`) };
    case 1:
      return {
        tex: `${pre}x + y = ${c}`,
        value: false,
        why: t(`For any fixed $x$, the equation fails for $y = ${c + 1} - x$.`, `对任何固定的 $x$，当 $y = ${c + 1} - x$ 时等式不成立。`),
      };
    case 2:
      return { tex: `${pre}xy = 0`, value: true, why: t("$x = 0$ works for every $y$.", "$x = 0$ 对每个 $y$ 都成立。") };
    case 3:
      return {
        tex: `${pre}x \\le y^2 - ${c}`,
        value: true,
        why: t(`$x = -${c}$ works, since $y^2 \\ge 0$.`, `$x = -${c}$ 满足，因为 $y^2 \\ge 0$。`),
      };
    case 4:
      return {
        tex: `${pre}x \\le y + ${c}`,
        value: false,
        why: t(`For any fixed $x$, take $y = x - ${c + 1}$.`, `对任何固定的 $x$，取 $y = x - ${c + 1}$。`),
      };
    default:
      return { tex: `${pre}xy = ${c}y`, value: true, why: t(`$x = ${c}$ works for every $y$.`, `$x = ${c}$ 对每个 $y$ 都成立。`) };
  }
}

/** nestedQuantifiers evaluates statements with two quantifiers. */
export const nestedQuantifiers: TopicDef = {
  id: "nested-quantifiers",
  title: t("Nested Quantifiers", "嵌套量词"),
  summary: t(
    "In ∀x ∃y P(x, y), y may depend on x; in ∃x ∀y P(x, y), one x must work for every y.",
    "在 ∀x ∃y P(x, y) 中 y 可以依赖于 x；在 ∃x ∀y P(x, y) 中，必须有一个 x 对所有 y 都成立。",
  ),
  prerequisites: ["universal-and-existential-quantifiers"],
  encompasses: [{ topic: "universal-and-existential-quantifiers", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "for-all-there-exists-statements",
      title: t("For all … there exists …", "对所有……存在……"),
      explanation: t(
        "$\\forall x\\ \\exists y\\ P(x, y)$ is a challenge: for each $x$ someone gives you, you must find a $y$, which may depend on $x$. $\\forall x \\in \\mathbb{Z},\\ \\exists y \\in \\mathbb{Z},\\ x + y = 0$ is true: take $y = -x$.",
        "$\\forall x\\ \\exists y\\ P(x, y)$ 像一场挑战：别人给出任意 $x$，你都要找到一个 $y$，而 $y$ 可以依赖于 $x$。$\\forall x \\in \\mathbb{Z},\\ \\exists y \\in \\mathbb{Z},\\ x + y = 0$ 为真：取 $y = -x$。",
      ),
      generate(rng) {
        const c = nestedClaim(rng, true);
        return oneOf(
          rng,
          t(`Is the statement $${c.tex}$ true or false?`, `命题 $${c.tex}$ 是真还是假？`),
          truthOption(c.value),
          [truthOption(!c.value)],
          t(`${c.why.en} So the statement is ${c.value ? "true" : "false"}.`, `${c.why["zh-CN"]}所以该命题为${c.value ? "真" : "假"}。`),
        );
      },
    },
    {
      id: "there-exists-for-all-statements",
      title: t("There exists … for all …", "存在……对所有……"),
      explanation: t(
        "$\\exists x\\ \\forall y\\ P(x, y)$ is much stronger: a single $x$ must work against every $y$. $\\exists x \\in \\mathbb{R},\\ \\forall y \\in \\mathbb{R},\\ x + y = 0$ is false, because no one number cancels every $y$; but $\\exists x \\in \\mathbb{R},\\ \\forall y \\in \\mathbb{R},\\ x \\cdot y = 0$ is true with $x = 0$.",
        "$\\exists x\\ \\forall y\\ P(x, y)$ 要强得多：必须有一个 $x$ 对所有 $y$ 都成立。$\\exists x \\in \\mathbb{R},\\ \\forall y \\in \\mathbb{R},\\ x + y = 0$ 为假，因为没有一个数能抵消所有 $y$；但 $\\exists x \\in \\mathbb{R},\\ \\forall y \\in \\mathbb{R},\\ x \\cdot y = 0$ 为真，取 $x = 0$。",
      ),
      generate(rng) {
        const c = nestedClaim(rng, false);
        return oneOf(
          rng,
          t(`Is the statement $${c.tex}$ true or false?`, `命题 $${c.tex}$ 是真还是假？`),
          truthOption(c.value),
          [truthOption(!c.value)],
          t(`${c.why.en} So the statement is ${c.value ? "true" : "false"}.`, `${c.why["zh-CN"]}所以该命题为${c.value ? "真" : "假"}。`),
        );
      },
    },
  ],
};

/** Pattern is an order of two quantifiers. */
type Pattern = "AE" | "EA" | "AA" | "EE";

/** formal writes a two-quantifier statement in symbols. */
function formal(p: Pattern, D: string, body: string): string {
  if (p === "AE") return `\\forall x \\in ${D},\\ \\exists y \\in ${D},\\ ${body}`;
  if (p === "EA") return `\\exists y \\in ${D},\\ \\forall x \\in ${D},\\ ${body}`;
  if (p === "AA") return `\\forall x \\in ${D},\\ \\forall y \\in ${D},\\ ${body}`;
  return `\\exists x \\in ${D},\\ \\exists y \\in ${D},\\ ${body}`;
}

/** informal writes a two-quantifier statement in words. */
function informal(p: Pattern, d: Domain, body: string): Text {
  const [one, many, zhNoun] = d === "Z" ? ["integer", "integers", "整数"] : ["real number", "real numbers", "实数"];
  if (p === "AE")
    return t(
      `For every ${one} $x$ there is ${one === "integer" ? "an" : "a"} ${one} $y$ such that $${body}$.`,
      `对每个${zhNoun} $x$，都存在${zhNoun} $y$ 使 $${body}$。`,
    );
  if (p === "EA")
    return t(
      `There is ${one === "integer" ? "an" : "a"} ${one} $y$ such that $${body}$ for every ${one} $x$.`,
      `存在一个${zhNoun} $y$，使得对每个${zhNoun} $x$ 都有 $${body}$。`,
    );
  if (p === "AA") return t(`$${body}$ for all ${many} $x$ and $y$.`, `对所有${zhNoun} $x$ 和 $y$，都有 $${body}$。`);
  return t(`There are ${many} $x$ and $y$ such that $${body}$.`, `存在${zhNoun} $x$ 和 $y$ 使 $${body}$。`);
}

/** body picks a relation between x and y. */
function twoVariableBody(rng: Rng): string {
  const c = rng.int(1, 9);
  return rng.pick([`x + y = ${c}`, `xy = ${c}`, `y > x + ${c}`, `y^2 = x + ${c}`, `x - y = ${c}`, `y < ${c}x`, `x^2 + y^2 = ${c}`]);
}

/** formalAndInformalLanguage translates between words and symbols. */
export const formalAndInformalLanguage: TopicDef = {
  id: "formal-and-informal-language",
  title: t("Formal and Informal Language", "形式语言与非形式语言"),
  summary: t(
    "Translate quantified statements between words and symbols, keeping track of the order of the quantifiers.",
    "在文字与符号之间翻译量化命题，注意量词的顺序。",
  ),
  prerequisites: ["nested-quantifiers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "writing-statements-in-symbols",
      title: t("Words to symbols", "文字译成符号"),
      explanation: t(
        '"For every real number $x$ there is a real number $y$ with $x + y = 1$" is $\\forall x \\in \\mathbb{R},\\ \\exists y \\in \\mathbb{R},\\ x + y = 1$. "There is a $y$ such that … for every $x$" puts $\\exists y$ first: $\\exists y\\ \\forall x$.',
        "“对每个实数 $x$，都存在实数 $y$ 使 $x + y = 1$”写作 $\\forall x \\in \\mathbb{R},\\ \\exists y \\in \\mathbb{R},\\ x + y = 1$。“存在 $y$，使得对每个 $x$ 都……”把 $\\exists y$ 放在前面：$\\exists y\\ \\forall x$。",
      ),
      generate(rng) {
        const d: Domain = rng.bool() ? "Z" : "R";
        const body = twoVariableBody(rng);
        const p = rng.pick(["AE", "EA", "AA", "EE"] as const);
        const words = informal(p, d, body);
        const opt = (q: Pattern) => t(`$${formal(q, dom(d), body)}$`, `$${formal(q, dom(d), body)}$`);
        return oneOf(
          rng,
          t(`Which symbolic statement says "${words.en}"?`, `哪个符号命题表示“${words["zh-CN"]}”？`),
          opt(p),
          (["AE", "EA", "AA", "EE"] as const).filter((q) => q !== p).map(opt),
          t(`Read the quantifiers in order: $${formal(p, dom(d), body)}$.`, `按顺序读出量词：$${formal(p, dom(d), body)}$。`),
        );
      },
    },
    {
      id: "reading-symbols-in-words",
      title: t("Symbols to words", "符号译成文字"),
      explanation: t(
        'Read $\\exists y \\in \\mathbb{Z},\\ \\forall x \\in \\mathbb{Z},\\ xy = x$ as "there is an integer $y$ such that $xy = x$ for every integer $x$" (true, with $y = 1$). Swapping the quantifiers changes the meaning.',
        "$\\exists y \\in \\mathbb{Z},\\ \\forall x \\in \\mathbb{Z},\\ xy = x$ 读作“存在一个整数 $y$，使得对每个整数 $x$ 都有 $xy = x$”（为真，取 $y = 1$）。交换量词会改变含义。",
      ),
      generate(rng) {
        const d: Domain = rng.bool() ? "Z" : "R";
        const body = twoVariableBody(rng);
        const p = rng.pick(["AE", "EA", "AA", "EE"] as const);
        return oneOf(
          rng,
          t(`Which sentence says $${formal(p, dom(d), body)}$?`, `哪个句子表示 $${formal(p, dom(d), body)}$？`),
          informal(p, d, body),
          (["AE", "EA", "AA", "EE"] as const).filter((q) => q !== p).map((q) => informal(q, d, body)),
          t("Read the quantifiers in the order they appear.", "按量词出现的顺序读。"),
        );
      },
    },
  ],
};

/** negatingStatementsWithNestedQuantifiers negates statements with two quantifiers. */
export const negatingStatementsWithNestedQuantifiers: TopicDef = {
  id: "negating-statements-with-nested-quantifiers",
  title: t("Negating Statements With Nested Quantifiers", "否定含嵌套量词的命题"),
  summary: t(
    "To negate, flip every quantifier and negate the predicate: ¬(∀x ∃y P) ≡ ∃x ∀y ¬P.",
    "否定时翻转每个量词并否定谓词：¬(∀x ∃y P) ≡ ∃x ∀y ¬P。",
  ),
  prerequisites: ["formal-and-informal-language", "negating-quantified-statements"],
  encompasses: [{ topic: "negating-quantified-statements", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "negating-two-quantifiers",
      title: t("Negating two quantifiers", "否定两个量词"),
      explanation: t(
        "Negation passes through quantifiers one at a time, turning every for all into there exists and every there exists into for all. Push the negation through one quantifier at a time: $\\neg \\forall x\\ \\exists y\\ P \\equiv \\exists x\\ \\neg \\exists y\\ P \\equiv \\exists x\\ \\forall y\\ \\neg P$. The negation of $\\forall x\\ \\exists y,\\ y > x$ is $\\exists x\\ \\forall y,\\ y \\le x$.",
        "否定逐个穿过量词，把每个“对所有”变成“存在”，把每个“存在”变成“对所有”。让否定逐个穿过量词：$\\neg \\forall x\\ \\exists y\\ P \\equiv \\exists x\\ \\neg \\exists y\\ P \\equiv \\exists x\\ \\forall y\\ \\neg P$。$\\forall x\\ \\exists y,\\ y > x$ 的否定是 $\\exists x\\ \\forall y,\\ y \\le x$。",
      ),
      generate(rng) {
        const D = dom(rng.bool() ? "Z" : "R");
        const q1 = rng.pick(["\\forall", "\\exists"]);
        const q2 = rng.pick(["\\forall", "\\exists"]);
        const r = relation(rng, rng.pick(["x + y", "xy", "x - y", "x^2 + y", "x + 2y"]));
        const s = (a: string, b: string, body: string) =>
          t(`$${a} x \\in ${D},\\ ${b} y \\in ${D},\\ ${body}$`, `$${a} x \\in ${D},\\ ${b} y \\in ${D},\\ ${body}$`);
        return oneOf(
          rng,
          t(
            `What is the negation of $${q1} x \\in ${D},\\ ${q2} y \\in ${D},\\ ${r.tex}$?`,
            `$${q1} x \\in ${D},\\ ${q2} y \\in ${D},\\ ${r.tex}$ 的否定是什么？`,
          ),
          s(flipQ(q1), flipQ(q2), r.neg),
          [s(flipQ(q1), flipQ(q2), r.tex), s(q1, q2, r.neg), s(flipQ(q1), q2, r.neg), s(flipQ(q1), flipQ(q2), r.wrongNeg)],
          t(
            `Flip both quantifiers and negate the relation: $${r.tex}$ becomes $${r.neg}$.`,
            `翻转两个量词并否定关系：$${r.tex}$ 变为 $${r.neg}$。`,
          ),
        );
      },
    },
    {
      id: "negating-nested-sentences-in-words",
      title: t("Negating nested sentences", "否定嵌套语句"),
      explanation: t(
        'The negation of "for every real number $x$ there is a real number $y$ with $xy = 1$" is "there is a real number $x$ such that $xy \\ne 1$ for every real number $y$" — true, with $x = 0$.',
        "“对每个实数 $x$，都存在实数 $y$ 使 $xy = 1$”的否定是“存在一个实数 $x$，使得对每个实数 $y$ 都有 $xy \\ne 1$”——它为真，取 $x = 0$。",
      ),
      generate(rng) {
        const d: Domain = rng.bool() ? "Z" : "R";
        const c = rng.int(1, 9);
        const [rel, neg] = rng.pick([
          [`x + y = ${c}`, `x + y \\ne ${c}`],
          [`xy = ${c}`, `xy \\ne ${c}`],
          [`y > x + ${c}`, `y \\le x + ${c}`],
          [`y^2 = x + ${c}`, `y^2 \\ne x + ${c}`],
          [`y < ${c}x`, `y \\ge ${c}x`],
        ] as const);
        const [one, zh] = d === "Z" ? ["integer", "整数"] : ["real number", "实数"];
        const an = one === "integer" ? "an" : "a";
        const ae = (body: string) =>
          t(`For every ${one} $x$ there is ${an} ${one} $y$ with $${body}$.`, `对每个${zh} $x$，都存在${zh} $y$ 使 $${body}$。`);
        const ea = (body: string) =>
          t(
            `There is ${an} ${one} $x$ such that $${body}$ for every ${one} $y$.`,
            `存在一个${zh} $x$，使得对每个${zh} $y$ 都有 $${body}$。`,
          );
        const startAE = rng.bool();
        const original = startAE ? ae(rel) : ea(rel);
        const right = startAE ? ea(neg) : ae(neg);
        return oneOf(
          rng,
          t(`What is the negation of "${original.en}"?`, `“${original["zh-CN"]}”的否定是什么？`),
          right,
          startAE ? [ae(neg), ea(rel)] : [ea(neg), ae(rel)],
          t('Swap "for every" and "there is" for each variable, and negate the relation.', "对每个变量互换“对每个”与“存在”，并否定关系。"),
        );
      },
    },
  ],
};

/** quantified writes a quantified predicate such as "\forall x\, P(x)". */
const quantified = (q: string, x: string, p: string) => `${q} ${x}\\, ${p}(${x})`;

/** prenexNormalForm moves quantifiers to the front of a statement. */
export const prenexNormalForm: TopicDef = {
  id: "prenex-normal-form",
  title: t("Prenex Normal Form", "前束范式"),
  summary: t(
    "A statement is in prenex normal form when all its quantifiers come first, followed by a quantifier-free formula.",
    "若一个命题的所有量词都在最前面，后面是不含量词的公式，则称它为前束范式。",
  ),
  prerequisites: ["negating-statements-with-nested-quantifiers"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "pulling-quantifiers-out-of-conjunctions-and-disjunctions",
      title: t("Pulling quantifiers out of ∧ and ∨", "从 ∧ 与 ∨ 中提出量词"),
      explanation: t(
        "When $y$ does not occur in $P(x)$, $(\\forall x\\, P(x)) \\wedge (\\exists y\\, Q(y)) \\equiv \\forall x\\, \\exists y\\, (P(x) \\wedge Q(y))$, and the same holds with $\\vee$. A negation in front must first be pushed in: $\\neg \\forall x\\, P(x) \\equiv \\exists x\\, \\neg P(x)$.",
        "当 $y$ 不出现在 $P(x)$ 中时，$(\\forall x\\, P(x)) \\wedge (\\exists y\\, Q(y)) \\equiv \\forall x\\, \\exists y\\, (P(x) \\wedge Q(y))$，换成 $\\vee$ 也成立。前面若有否定，要先把它移入：$\\neg \\forall x\\, P(x) \\equiv \\exists x\\, \\neg P(x)$。",
      ),
      generate(rng) {
        const [P, Q] = rng.shuffle(["P", "Q", "R", "S"]);
        const q1 = rng.pick(["\\forall", "\\exists"]);
        const q2 = rng.pick(["\\forall", "\\exists"]);
        const op = rng.pick(["\\wedge", "\\vee"]);
        const negated = rng.bool();
        const left = negated ? `\\neg (${quantified(q1, "x", P!)})` : `(${quantified(q1, "x", P!)})`;
        const statement = `${left} ${op} (${quantified(q2, "y", Q!)})`;
        const outer = negated ? flipQ(q1) : q1;
        const inner = (lp: string) => `(${lp} ${op} ${Q}(y))`;
        const lp = negated ? `\\neg ${P}(x)` : `${P}(x)`;
        const form = (a: string, b: string, l: string) => t(`$${a} x\\, ${b} y\\, ${inner(l)}$`, `$${a} x\\, ${b} y\\, ${inner(l)}$`);
        return oneOf(
          rng,
          t(`Which is a prenex normal form of $${statement}$?`, `$${statement}$ 的前束范式是哪个？`),
          form(outer, q2, lp),
          [
            form(negated ? q1 : flipQ(q1), q2, lp),
            form(outer, flipQ(q2), lp),
            form(flipQ(outer), flipQ(q2), lp),
            ...(negated ? [form(q1, q2, `\\neg ${P}(x)`)] : []),
          ],
          t(
            `${negated ? `First push the negation in, which flips $${q1}$ to $${outer}$. ` : ""}Since each variable appears in only one part, both quantifiers ${negated ? "then " : ""}move out unchanged.`,
            `${negated ? `先把否定移入，$${q1}$ 变为 $${outer}$。` : ""}由于每个变量只出现在一个部分中，两个量词${negated ? "随后" : ""}可以原样提到前面。`,
          ),
        );
      },
    },
    {
      id: "pulling-quantifiers-out-of-implications",
      title: t("Pulling quantifiers out of implications", "从蕴涵中提出量词"),
      explanation: t(
        "Since $A \\Rightarrow B \\equiv \\neg A \\vee B$, a quantifier in the hypothesis flips when it moves out, while one in the conclusion does not: $(\\exists x\\, P(x)) \\Rightarrow (\\forall y\\, Q(y)) \\equiv \\forall x\\, \\forall y\\, (P(x) \\Rightarrow Q(y))$.",
        "由于 $A \\Rightarrow B \\equiv \\neg A \\vee B$，前提中的量词提出时要翻转，而结论中的量词不变：$(\\exists x\\, P(x)) \\Rightarrow (\\forall y\\, Q(y)) \\equiv \\forall x\\, \\forall y\\, (P(x) \\Rightarrow Q(y))$。",
      ),
      generate(rng) {
        const [P, Q] = rng.shuffle(["P", "Q", "R", "S"]);
        const q1 = rng.pick(["\\forall", "\\exists"]);
        const q2 = rng.pick(["\\forall", "\\exists"]);
        const statement = `(${quantified(q1, "x", P!)}) \\Rightarrow (${quantified(q2, "y", Q!)})`;
        const body = `(${P}(x) \\Rightarrow ${Q}(y))`;
        const form = (a: string, b: string) => t(`$${a} x\\, ${b} y\\, ${body}$`, `$${a} x\\, ${b} y\\, ${body}$`);
        return oneOf(
          rng,
          t(`Which is a prenex normal form of $${statement}$?`, `$${statement}$ 的前束范式是哪个？`),
          form(flipQ(q1), q2),
          [form(q1, q2), form(flipQ(q1), flipQ(q2)), form(q1, flipQ(q2))],
          t(
            `The quantifier $${q1}$ in the hypothesis flips to $${flipQ(q1)}$, because $A \\Rightarrow B \\equiv \\neg A \\vee B$; the quantifier $${q2}$ in the conclusion stays.`,
            `前提中的量词 $${q1}$ 翻转为 $${flipQ(q1)}$，因为 $A \\Rightarrow B \\equiv \\neg A \\vee B$；结论中的量词 $${q2}$ 不变。`,
          ),
        );
      },
    },
  ],
};

/** follows tells whether the conclusion is true in every row where all premises are true, and returns a counterexample row otherwise. */
export function follows(premises: readonly Formula[], conclusion: Formula) {
  const vars = varsOf(...premises, conclusion);
  for (const env of rows(vars)) {
    if (premises.every((p) => evaluate(p, env)) && !evaluate(conclusion, env)) return { valid: false, env, vars } as const;
  }
  return { valid: true, vars } as const;
}

/** argumentTex writes premises and a conclusion. */
const argumentTex = (premises: readonly Formula[], conclusion: Formula) =>
  t(
    `premises $${premises.map(tex).join("$, $")}$ and conclusion $${tex(conclusion)}$`,
    `前提 $${premises.map(tex).join("$、$")}$，结论 $${tex(conclusion)}$`,
  );

/** validityProblem asks whether an argument is valid and explains with a counterexample row. */
function validityProblem(rng: Rng, premises: readonly Formula[], conclusion: Formula, valid: Text): Problem {
  const r = follows(premises, conclusion);
  const arg = argumentTex(premises, conclusion);
  const row = r.valid ? null : r.vars.map((x) => `${x} = ${TF(r.env[x])}`).join(", ");
  return oneOf(
    rng,
    t(`Is the argument with ${arg.en} valid?`, `${arg["zh-CN"]}的论证有效吗？`),
    yesNo[r.valid ? 0 : 1]!,
    [yesNo[r.valid ? 1 : 0]!],
    r.valid
      ? valid
      : t(`No: with $${row}$ every premise is true but the conclusion is false.`, `无效：当 $${row}$ 时所有前提都为真，但结论为假。`),
  );
}

/** neg negates a literal without doubling negations. */
const neg = (f: Formula) => (f.k === "not" ? f.a : not(f));

/** literalPair picks two literals on distinct letters. */
const literalPair = (rng: Rng): [Formula, Formula] => {
  const [a, b] = twoLetters(rng);
  return [rng.int(0, 3) === 0 ? not(a) : a, rng.int(0, 3) === 0 ? not(b) : b];
};

/** implicationEliminationAndDenyingTheConsequent applies modus ponens and modus tollens. */
export const implicationEliminationAndDenyingTheConsequent: TopicDef = {
  id: "implication-elimination-and-denying-the-consequent",
  title: t("Implication Elimination and Denying the Consequent", "肯定前件与否定后件"),
  summary: t(
    "From p ⇒ q and p conclude q (modus ponens); from p ⇒ q and ¬q conclude ¬p (modus tollens).",
    "由 p ⇒ q 与 p 推出 q（肯定前件）；由 p ⇒ q 与 ¬q 推出 ¬p（否定后件）。",
  ),
  prerequisites: ["converse-inverse-and-contrapositive", "tautologies-and-contradictions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "drawing-conclusions-from-conditionals",
      title: t("Drawing conclusions", "得出结论"),
      explanation: t(
        "An argument is **valid** when the conclusion is true whenever all premises are. **Modus ponens:** from $p \\Rightarrow q$ and $p$, conclude $q$. **Modus tollens:** from $p \\Rightarrow q$ and $\\neg q$, conclude $\\neg p$, because $p \\Rightarrow q \\equiv \\neg q \\Rightarrow \\neg p$.",
        "若所有前提为真时结论必为真，则论证**有效**。**肯定前件：**由 $p \\Rightarrow q$ 与 $p$ 推出 $q$。**否定后件：**由 $p \\Rightarrow q$ 与 $\\neg q$ 推出 $\\neg p$，因为 $p \\Rightarrow q \\equiv \\neg q \\Rightarrow \\neg p$。",
      ),
      generate(rng) {
        const f = fact(rng);
        const not = (x: Text) => t(`it is not true that ${x.en}`, `${x["zh-CN"]}不成立`);
        const ponens = rng.bool();
        const second = ponens ? f.a : not(f.b);
        const right = ponens ? f.b : not(f.a);
        return oneOf(
          rng,
          t(
            `Suppose "if ${f.a.en}, then ${f.b.en}" is true and ${second.en}. What can you conclude?`,
            `已知“如果 ${f.a["zh-CN"]}，那么 ${f.b["zh-CN"]}”为真，且${second["zh-CN"]}。可以得出什么结论？`,
          ),
          t(`${right.en[0]!.toUpperCase()}${right.en.slice(1)}.`, `${right["zh-CN"]}。`),
          [
            t(`${(ponens ? not(f.b) : f.a).en.replace(/^./, (c) => c.toUpperCase())}.`, `${(ponens ? not(f.b) : f.a)["zh-CN"]}。`),
            t(`${(ponens ? not(f.a) : f.b).en.replace(/^./, (c) => c.toUpperCase())}.`, `${(ponens ? not(f.a) : f.b)["zh-CN"]}。`),
            t("Nothing can be concluded.", "无法得出任何结论。"),
          ],
          ponens
            ? t("The hypothesis holds, so by modus ponens the conclusion holds.", "前提成立，由肯定前件，结论成立。")
            : t("The conclusion fails, so by modus tollens the hypothesis fails.", "结论不成立，由否定后件，前提不成立。"),
        );
      },
    },
    {
      id: "recognizing-valid-and-invalid-forms",
      title: t("Valid and invalid forms", "有效与无效的形式"),
      explanation: t(
        "Two common fallacies look similar to valid forms. **Affirming the consequent:** from $p \\Rightarrow q$ and $q$, concluding $p$. **Denying the antecedent:** from $p \\Rightarrow q$ and $\\neg p$, concluding $\\neg q$. Both fail when $p$ is false and $q$ is true.",
        "有两种常见谬误看起来很像有效形式。**肯定后件：**由 $p \\Rightarrow q$ 与 $q$ 推出 $p$。**否定前件：**由 $p \\Rightarrow q$ 与 $\\neg p$ 推出 $\\neg q$。当 $p$ 假而 $q$ 真时，两者都不成立。",
      ),
      generate(rng) {
        const [a, b] = literalPair(rng);
        const form = rng.int(0, 3);
        const premise = imp(a, b);
        const [second, conclusion] = [
          [a, b],
          [neg(b), neg(a)],
          [b, a],
          [neg(a), neg(b)],
        ][form]! as [Formula, Formula];
        return validityProblem(
          rng,
          [premise, second],
          conclusion,
          t(
            form === 0 ? "Yes: this is modus ponens." : "Yes: this is modus tollens.",
            form === 0 ? "有效：这是肯定前件。" : "有效：这是否定后件。",
          ),
        );
      },
    },
  ],
};

/** disjunctiveSyllogismAndTransitivityOfImplication chains inferences. */
export const disjunctiveSyllogismAndTransitivityOfImplication: TopicDef = {
  id: "disjunctive-syllogism-and-transitivity-of-implication",
  title: t("Disjunctive Syllogism and Transitivity of Implication", "选言推理与蕴涵的传递性"),
  summary: t("From p ∨ q and ¬p conclude q; from p ⇒ q and q ⇒ r conclude p ⇒ r.", "由 p ∨ q 与 ¬p 推出 q；由 p ⇒ q 与 q ⇒ r 推出 p ⇒ r。"),
  prerequisites: ["implication-elimination-and-denying-the-consequent"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "applying-disjunctive-syllogism",
      title: t("Disjunctive syllogism", "选言推理"),
      explanation: t(
        "**Disjunctive syllogism:** from $p \\vee q$ and $\\neg p$, conclude $q$. If at least one of two statements is true and one of them is false, the other must be true.",
        "**选言推理：**由 $p \\vee q$ 与 $\\neg p$ 推出 $q$。若两个命题中至少有一个为真，而其中一个为假，则另一个必为真。",
      ),
      generate(rng) {
        const [a, b] = literalPair(rng);
        const denyFirst = rng.bool();
        const premises = [or(a, b), neg(denyFirst ? a : b)];
        const right = denyFirst ? b : a;
        const wrong = [neg(right), denyFirst ? a : b, and(a, b)];
        return oneOf(
          rng,
          t(
            `From the premises $${tex(premises[0]!)}$ and $${tex(premises[1]!)}$, which statement follows?`,
            `由前提 $${tex(premises[0]!)}$ 与 $${tex(premises[1]!)}$，可以推出哪个命题？`,
          ),
          math(right),
          wrong.map(math),
          t(
            `One of $${tex(a)}$, $${tex(b)}$ is true and $${tex(denyFirst ? a : b)}$ is false, so $${tex(right)}$ is true.`,
            `$${tex(a)}$、$${tex(b)}$ 中至少一个为真，而 $${tex(denyFirst ? a : b)}$ 为假，所以 $${tex(right)}$ 为真。`,
          ),
        );
      },
    },
    {
      id: "chaining-implications",
      title: t("Chaining implications", "串联蕴涵"),
      explanation: t(
        "**Transitivity:** from $p \\Rightarrow q$ and $q \\Rightarrow r$, conclude $p \\Rightarrow r$. Premises may be given in any order or in contrapositive form; rearrange them into a chain first.",
        "**传递性：**由 $p \\Rightarrow q$ 与 $q \\Rightarrow r$ 推出 $p \\Rightarrow r$。前提可能以任意顺序或以逆否形式给出；先把它们排成一条链。",
      ),
      generate(rng) {
        const letters = rng.shuffle(["p", "q", "r", "s"] as const).map((x) => (rng.int(0, 3) === 0 ? not(v(x)) : v(x)));
        const length = rng.int(2, 3);
        const chain = letters.slice(0, length + 1);
        let flipped = false;
        const premises = chain.slice(0, -1).map((x, i) => {
          const y = chain[i + 1]!;
          if (rng.int(0, 3) > 0) return imp(x, y);
          flipped = true;
          return imp(neg(y), neg(x));
        });
        const first = chain[0]!;
        const last = chain[length]!;
        const right = imp(first, last);
        const candidates = [imp(last, first), imp(neg(first), neg(last)), imp(first, neg(last)), and(first, last), imp(chain[1]!, first)];
        const wrong = candidates.filter((c) => !follows(premises, c).valid);
        const shuffled = rng.shuffle(premises);
        return oneOf(
          rng,
          t(
            `From the premises ${shuffled.map((p) => `$${tex(p)}$`).join(", ")}, which statement follows?`,
            `由前提 ${shuffled.map((p) => `$${tex(p)}$`).join("、")}，可以推出哪个命题？`,
          ),
          math(right),
          wrong.map(math),
          t(
            `Write the premises as a chain${flipped ? ", using contrapositives where needed" : ""}: $${chain.map(tex).join(" \\Rightarrow ")}$. By transitivity, $${tex(right)}$.`,
            `把前提排成一条链（必要时用逆否命题）：$${chain.map(tex).join(" \\Rightarrow ")}$。由传递性得 $${tex(right)}$。`,
          ),
        );
      },
    },
  ],
};

/** Rule is a named rule of inference. */
interface Rule {
  readonly name: Text;
  /** form is the rule's schema with the letters P, Q and R. */
  readonly form: Text;
  readonly make: (a: Formula, b: Formula, c: Formula) => { premises: Formula[]; conclusion: Formula };
}

/** inferenceRules are the named rules of inference. */
const inferenceRules: readonly Rule[] = [
  {
    name: t("Modus ponens", "肯定前件"),
    form: t("from $P \\Rightarrow Q$ and $P$, conclude $Q$", "由 $P \\Rightarrow Q$ 与 $P$ 推出 $Q$"),
    make: (a, b) => ({ premises: [imp(a, b), a], conclusion: b }),
  },
  {
    name: t("Modus tollens", "否定后件"),
    form: t("from $P \\Rightarrow Q$ and $\\neg Q$, conclude $\\neg P$", "由 $P \\Rightarrow Q$ 与 $\\neg Q$ 推出 $\\neg P$"),
    make: (a, b) => ({ premises: [imp(a, b), neg(b)], conclusion: neg(a) }),
  },
  {
    name: t("Disjunctive syllogism", "选言推理"),
    form: t("from $P \\lor Q$ and $\\neg P$, conclude $Q$", "由 $P \\lor Q$ 与 $\\neg P$ 推出 $Q$"),
    make: (a, b) => ({ premises: [or(a, b), neg(a)], conclusion: b }),
  },
  {
    name: t("Transitivity", "传递性"),
    form: t(
      "from $P \\Rightarrow Q$ and $Q \\Rightarrow R$, conclude $P \\Rightarrow R$",
      "由 $P \\Rightarrow Q$ 与 $Q \\Rightarrow R$ 推出 $P \\Rightarrow R$",
    ),
    make: (a, b, c) => ({ premises: [imp(a, b), imp(b, c)], conclusion: imp(a, c) }),
  },
  {
    name: t("Conjunction", "合取引入"),
    form: t("from $P$ and $Q$, conclude $P \\land Q$", "由 $P$ 与 $Q$ 推出 $P \\land Q$"),
    make: (a, b) => ({ premises: [a, b], conclusion: and(a, b) }),
  },
  {
    name: t("Simplification", "化简"),
    form: t("from $P \\land Q$, conclude $P$", "由 $P \\land Q$ 推出 $P$"),
    make: (a, b) => ({ premises: [and(a, b)], conclusion: a }),
  },
  {
    name: t("Addition", "附加"),
    form: t("from $P$, conclude $P \\lor Q$", "由 $P$ 推出 $P \\lor Q$"),
    make: (a, b) => ({ premises: [a], conclusion: or(a, b) }),
  },
  {
    name: t("Resolution", "消解"),
    form: t("from $P \\lor Q$ and $\\neg P \\lor R$, conclude $Q \\lor R$", "由 $P \\lor Q$ 与 $\\neg P \\lor R$ 推出 $Q \\lor R$"),
    make: (a, b, c) => ({ premises: [or(a, b), or(neg(a), c)], conclusion: or(b, c) }),
  },
];

/** additionalRulesOfLogicalInference names and checks rules of inference. */
export const additionalRulesOfLogicalInference: TopicDef = {
  id: "additional-rules-of-logical-inference",
  title: t("Additional Rules of Logical Inference", "更多逻辑推理规则"),
  summary: t(
    "Conjunction, simplification, addition and resolution join modus ponens, modus tollens, disjunctive syllogism and transitivity as rules of inference.",
    "合取引入、化简、附加和消解，与肯定前件、否定后件、选言推理和传递性一起构成推理规则。",
  ),
  prerequisites: ["disjunctive-syllogism-and-transitivity-of-implication"],
  encompasses: [{ topic: "disjunctive-syllogism-and-transitivity-of-implication", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "naming-rules-of-inference",
      title: t("Naming the rule", "说出规则"),
      explanation: t(
        "**Conjunction:** from $p$ and $q$, conclude $p \\wedge q$. **Simplification:** from $p \\wedge q$, conclude $p$. **Addition:** from $p$, conclude $p \\vee q$ for any $q$. **Resolution:** from $p \\vee q$ and $\\neg p \\vee r$, conclude $q \\vee r$.",
        "**合取引入：**由 $p$ 和 $q$ 推出 $p \\wedge q$。**化简：**由 $p \\wedge q$ 推出 $p$。**附加：**由 $p$ 推出 $p \\vee q$（$q$ 任意）。**消解：**由 $p \\vee q$ 与 $\\neg p \\vee r$ 推出 $q \\vee r$。",
      ),
      generate(rng) {
        const rule = rng.pick(inferenceRules);
        const [a, b] = literalPair(rng);
        const others = ["p", "q", "r", "s"].filter((x) => !varsOf(a, b).includes(x as Var)) as Var[];
        const c = v(rng.pick(others));
        const { premises, conclusion } = rule.make(a, b, c);
        return oneOf(
          rng,
          t(
            `Which rule of inference concludes $${tex(conclusion)}$ from ${premises.map((p) => `$${tex(p)}$`).join(" and ")}?`,
            `由 ${premises.map((p) => `$${tex(p)}$`).join(" 与 ")} 推出 $${tex(conclusion)}$ 用的是哪条推理规则？`,
          ),
          rule.name,
          rng.shuffle(inferenceRules.filter((r) => r !== rule)).map((r) => r.name),
          t(`This is ${rule.name.en.toLowerCase()}: ${rule.form.en}.`, `这是${rule.name["zh-CN"]}：${rule.form["zh-CN"]}。`),
        );
      },
    },
    {
      id: "checking-validity-with-truth-tables",
      title: t("Checking validity", "检验有效性"),
      explanation: t(
        "An argument is valid exactly when $(\\text{premises}) \\Rightarrow \\text{conclusion}$ is a tautology. To show it is invalid, find one row where every premise is true and the conclusion is false.",
        "论证有效，当且仅当 $(\\text{前提}) \\Rightarrow \\text{结论}$ 是永真式。要证明论证无效，只需找到一行使所有前提为真而结论为假。",
      ),
      generate(rng) {
        const wantValid = rng.bool();
        for (;;) {
          const premises = [
            randomFormula(rng, 1, ["p", "q", "r"], ["and", "or", "imp"]),
            randomFormula(rng, 1, ["p", "q", "r"], ["and", "or", "imp"]),
          ];
          const conclusion = randomFormula(rng, rng.int(0, 1), ["p", "q", "r"], ["and", "or", "imp"]);
          if (premises.some((p) => p.k === "var" || p.k === "not")) continue;
          if (tex(premises[0]!) === tex(premises[1]!)) continue;
          // The premises must be consistent, or every conclusion follows vacuously.
          if (!rows(varsOf(...premises)).some((env) => premises.every((p) => evaluate(p, env)))) continue;
          if (premises.some((p) => tex(p) === tex(conclusion))) continue;
          if (follows(premises, conclusion).valid !== wantValid) continue;
          return validityProblem(
            rng,
            premises,
            conclusion,
            t(
              "Yes: in every row of the truth table where all premises are true, the conclusion is true.",
              "有效：在真值表中所有前提都为真的每一行，结论也为真。",
            ),
          );
        }
      },
    },
  ],
};

/** methodsOfProofPredicateTopics are the topics of Methods of Proof modules 1.3–1.5. */
export const methodsOfProofPredicateTopics: readonly TopicDef[] = [
  truthSetsOfPredicates,
  theAndAndOrConnectivesWithPredicates,
  theNotConnectiveWithPredicates,
  simplifyingPredicateExpressionsUsingDeMorgansLaws,
  conditionalStatementsWithPredicates,
  necessaryAndSufficientConditions,
  grammaticalConstructionsForConditionalStatements,
  translatingBetweenLogicalAndSetOperations,
  universalAndExistentialQuantifiers,
  negatingQuantifiedStatements,
  nestedQuantifiers,
  formalAndInformalLanguage,
  negatingStatementsWithNestedQuantifiers,
  prenexNormalForm,
  implicationEliminationAndDenyingTheConsequent,
  disjunctiveSyllogismAndTransitivityOfImplication,
  additionalRulesOfLogicalInference,
];
