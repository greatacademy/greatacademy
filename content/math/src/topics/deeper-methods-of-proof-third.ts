// Third knowledge points for thin topics of Methods of Proof, on logic, set operations and
// basic proof techniques: the reverse question, a harder case or a common trap.
// See `deeperMethodsOfProofThirdPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { poly } from "@ga/subject-math";

import { say, withMistakes } from "../problems.ts";
import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

/** gcd gives the greatest common divisor of two integers. */
export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
/** lcm gives the least common multiple of two positive integers. */
export const lcm = (a: number, b: number) => (a * b) / gcd(a, b);
/** LETTERS lists the statement letters used in logic questions. */
const LETTERS = ["p", "q", "r", "s"];
/** tf writes a truth value in English. */
const tf = (v: boolean) => (v ? "true" : "false");
/** zf writes a truth value in Chinese. */
const zf = (v: boolean) => (v ? "真" : "假");
/** row writes an assignment of truth values as a tuple. */
const row = (values: readonly boolean[]) => `(${values.map((v) => (v ? "\\text{T}" : "\\text{F}")).join(", ")})`;

const countTrueRows = point(
  "counting-the-rows-that-make-a-formula-true",
  ["Counting the rows that make a formula true", "计算使公式为真的行数"],
  [
    "A formula in three letters has eight rows, and the count can be found without writing them all. A conjunction with a literal needs that literal true, which halves the rows, and a disjunction fails only when both of its parts are false. For $(p \\wedge q) \\vee r$: the bracket is true for $1$ of the $4$ values of $p$ and $q$, so it is false for $3$; the disjunction fails when the bracket is false and $r$ is false, in $3$ rows, so it is true in $8 - 3 = 5$.\n\n> **Watch out.** Do not add the rows of the two parts of a disjunction: the rows where both parts are true would be counted twice. Count the rows where it fails instead.",
    "三个字母的公式有八行，不必全部写出也能计数。与一个文字作合取时，该文字必须为真，行数减半；而析取只有在两部分都为假时才不成立。对 $(p \\wedge q) \\vee r$：括号在 $p$、$q$ 的 $4$ 种取值中有 $1$ 种为真，所以有 $3$ 种为假；析取在括号为假且 $r$ 为假时不成立，共 $3$ 行，所以有 $8 - 3 = 5$ 行为真。\n\n> **注意。** 不要把析取两部分为真的行数相加：两部分都为真的行会被数两次。应改为数它不成立的行。",
  ],
  (rng) => {
    const [a, b, c] = rng.sample(LETTERS, 3) as [string, string, string];
    const lit = (v: string, negated: boolean) => (negated ? `\\neg ${v}` : v);
    const left = lit(a, rng.bool());
    const right = lit(b, rng.bool());
    const last = lit(c, rng.bool());
    const innerAnd = rng.bool();
    const outerAnd = rng.bool();
    const inner = innerAnd ? 1 : 3;
    const answer = outerAnd ? inner : 4 + inner;
    const bracket = `(${left} ${innerAnd ? "\\wedge" : "\\vee"} ${right})`;
    const formula = `${bracket} ${outerAnd ? "\\wedge" : "\\vee"} ${last}`;
    const otherOuter = outerAnd ? 4 + inner : inner;
    const otherInner = outerAnd ? 4 - inner : 8 - inner;
    return withMistakes(
      ask(
        [`In how many of the $8$ rows of the truth table is $${formula}$ true?`, `在真值表的 $8$ 行中，$${formula}$ 有多少行为真？`],
        answer,
        [1, 3, 5, 7].filter((v) => v !== answer),
        [
          `**Step 1: Count the bracket.** $${bracket}$ is ${innerAnd ? "a conjunction, true only when both literals are true" : "a disjunction, false only when both literals are false"}, so it is true for $${inner}$ of the $4$ values of its two letters, in $${2 * inner}$ of the $8$ rows.\n\n**Step 2: Bring in $${last}$.** ${
            outerAnd
              ? `The conjunction also needs $${last}$ true, which holds in half of those rows: $${inner}$.`
              : `The disjunction is false only when the bracket and $${last}$ are both false: $${4 - inner}$ ${inner === 3 ? "row" : "rows"}. So it is true in $8 - ${4 - inner} = ${answer}$.`
          }\n\n**Check.** ${
            outerAnd
              ? `Count directly: fix $${last}$ true, and the bracket's letters must take one of their $${inner}$ true values, so $${inner}$ rows.`
              : `Count directly: $${last}$ is true in $4$ rows, and with $${last}$ false the bracket must be true, in $${inner}$ more rows: $4 + ${inner} = ${answer}$.`
          }`,
          `**第一步：数括号。** $${bracket}$ 是${innerAnd ? "合取，只有两个文字都为真时才为真" : "析取，只有两个文字都为假时才为假"}，所以它在两个字母的 $4$ 种取值中有 $${inner}$ 种为真，即 $8$ 行中的 $${2 * inner}$ 行。\n\n**第二步：加入 $${last}$。** ${
            outerAnd
              ? `合取还要求 $${last}$ 为真，这在上述行中占一半：$${inner}$ 行。`
              : `析取只有在括号和 $${last}$ 都为假时才为假：$${4 - inner}$ 行。所以有 $8 - ${4 - inner} = ${answer}$ 行为真。`
          }\n\n**检验。** ${
            outerAnd
              ? `直接数：固定 $${last}$ 为真，括号的两个字母须取 $${inner}$ 种为真的取值之一，共 $${inner}$ 行。`
              : `直接数：$${last}$ 在 $4$ 行为真；$${last}$ 为假时括号须为真，又有 $${inner}$ 行：$4 + ${inner} = ${answer}$。`
          }`,
        ],
      ),
      [
        say(String(8 - answer), "That counts the rows where the formula is false.", "这是公式为假的行数。"),
        say(
          String(otherOuter),
          `That treats the outer connective as $${outerAnd ? "\\vee" : "\\wedge"}$.`,
          `这把外层联结词当成了 $${outerAnd ? "\\vee" : "\\wedge"}$。`,
        ),
        say(
          String(otherInner),
          `That treats the connective in the bracket as $${innerAnd ? "\\vee" : "\\wedge"}$.`,
          `这把括号里的联结词当成了 $${innerAnd ? "\\vee" : "\\wedge"}$。`,
        ),
      ],
    );
  },
);

const negatingBetween = point(
  "negating-a-double-inequality",
  ["Negating a double inequality", "否定双重不等式"],
  [
    'A double inequality is a conjunction of two conditions, so its negation is a disjunction. The number can fail on either side, and each strict inequality turns into a weak one, because the endpoints themselves are not between the two bounds. The negation of $2 < x < 5$ is $x \\le 2 \\vee x \\ge 5$: the number $2$ is not strictly between $2$ and $5$, so it must satisfy the negation, and it does.\n\n> **Watch out.** Joining the two parts with "and" describes nothing: no number is both at most $2$ and at least $5$. The negation of "and" is "or".',
    "双重不等式是两个条件的合取，所以它的否定是析取。这个数可以在任一侧不满足条件，并且每个严格不等式都变成非严格的，因为端点本身不在两个界之间。$2 < x < 5$ 的否定是 $x \\le 2 \\vee x \\ge 5$：数 $2$ 不严格位于 $2$ 与 $5$ 之间，所以它必须满足否定，而它确实满足。\n\n> **注意。** 用“且”连接两部分，描述的是空集：没有数既不大于 $2$ 又不小于 $5$。“且”的否定是“或”。",
  ],
  (rng) => {
    const a = rng.int(-20, 20);
    const b = a + rng.int(1, 20);
    const andForm = same(`x \\le ${a} \\wedge x \\ge ${b}`);
    const strict = same(`x < ${a} \\vee x > ${b}`);
    const chained = same(`${a} \\ge x \\ge ${b}`);
    return reasoned(
      choose(
        rng,
        [`Which statement is the negation of $${a} < x < ${b}$?`, `哪个命题是 $${a} < x < ${b}$ 的否定？`],
        same(`x \\le ${a} \\vee x \\ge ${b}`),
        [andForm, strict, chained],
        [
          `**Step 1: Split the double inequality.** $${a} < x < ${b}$ says $x > ${a}$ and $x < ${b}$: a conjunction.\n\n**Step 2: Negate it.** By De Morgan's law the negation of a conjunction is the disjunction of the negations. The negation of $x > ${a}$ is $x \\le ${a}$, and of $x < ${b}$ is $x \\ge ${b}$, so the negation is $x \\le ${a} \\vee x \\ge ${b}$.\n\n**Check.** Try $x = ${a}$: it is not strictly greater than $${a}$, so the original fails, and $x \\le ${a}$ holds, so the negation is true. Try $x = \\frac{${a + b}}{2}$, between the bounds: the original holds, and neither $x \\le ${a}$ nor $x \\ge ${b}$ does.`,
          `**第一步：拆开双重不等式。** $${a} < x < ${b}$ 是说 $x > ${a}$ 且 $x < ${b}$：一个合取。\n\n**第二步：取否定。** 由德摩根律，合取的否定是各部分否定的析取。$x > ${a}$ 的否定是 $x \\le ${a}$，$x < ${b}$ 的否定是 $x \\ge ${b}$，所以否定是 $x \\le ${a} \\vee x \\ge ${b}$。\n\n**检验。** 试 $x = ${a}$：它不严格大于 $${a}$，原命题不成立，而 $x \\le ${a}$ 成立，所以否定为真。再试两界之间的 $x = \\frac{${a + b}}{2}$：原命题成立，而 $x \\le ${a}$ 与 $x \\ge ${b}$ 都不成立。`,
        ],
      ),
      [
        [
          andForm[0],
          `No number is both at most $${a}$ and at least $${b}$, so this is never true; the negation of a conjunction is a disjunction.`,
          `没有数既不大于 $${a}$ 又不小于 $${b}$，所以它永远不成立；合取的否定是析取。`,
        ],
        [
          strict[0],
          `This leaves out $x = ${a}$ and $x = ${b}$, which are not strictly between the bounds and so belong to the negation.`,
          `这漏掉了 $x = ${a}$ 和 $x = ${b}$，它们不严格位于两界之间，所以属于否定。`,
        ],
        [
          chained[0],
          `This says $x \\le ${a}$ and $x \\ge ${b}$ at once, which no number satisfies; the two parts must be joined by "or".`,
          `这是说 $x \\le ${a}$ 且 $x \\ge ${b}$ 同时成立，没有数满足；两部分必须用“或”连接。`,
        ],
      ],
    );
  },
);

const mixedGrouping = point(
  "regrouping-across-different-connectives",
  ["Regrouping across different connectives", "跨不同联结词重新分组"],
  [
    "The associative laws let brackets move only when one connective is used throughout. With a mixed formula, moving the brackets can change the meaning, and a single assignment on which the two versions differ is enough to prove that they are not equivalent. For $(p \\wedge q) \\vee r$ and $p \\wedge (q \\vee r)$, take $p$ false and $r$ true: the first is true because of $r$, and the second is false because of $p$.\n\n> **Watch out.** An assignment on which the two formulas agree proves nothing about equivalence. Only one on which they differ settles the question.",
    "结合律只允许在全程使用同一个联结词时移动括号。对于混合的公式，移动括号可能改变含义，只要有一种赋值使两种写法不同，就足以证明它们不等价。对 $(p \\wedge q) \\vee r$ 和 $p \\wedge (q \\vee r)$，取 $p$ 为假、$r$ 为真：第一个因 $r$ 而为真，第二个因 $p$ 而为假。\n\n> **注意。** 两个公式取值相同的赋值，对是否等价什么也证明不了。只有使它们取值不同的赋值才能说明问题。",
  ],
  (rng) => {
    const [a, b, c] = rng.sample(LETTERS, 3) as [string, string, string];
    const andFirst = rng.bool();
    const mid = rng.bool();
    const left = andFirst ? `(${a} \\wedge ${b}) \\vee ${c}` : `(${a} \\vee ${b}) \\wedge ${c}`;
    const right = andFirst ? `${a} \\wedge (${b} \\vee ${c})` : `${a} \\vee (${b} \\wedge ${c})`;
    const leftValue = (x: boolean, y: boolean, z: boolean) => (andFirst ? (x && y) || z : (x || y) && z);
    const rightValue = (x: boolean, y: boolean, z: boolean) => (andFirst ? x && (y || z) : x || (y && z));
    const opt = (x: boolean, y: boolean, z: boolean) =>
      same(`${a} = ${x ? "\\text{T}" : "\\text{F}"},\\ ${b} = ${y ? "\\text{T}" : "\\text{F}"},\\ ${c} = ${z ? "\\text{T}" : "\\text{F}"}`);
    const wrong: (readonly [boolean, boolean, boolean])[] = andFirst
      ? [
          [true, true, true],
          [false, false, false],
          [true, false, true],
        ]
      : [
          [true, true, true],
          [false, false, false],
          [false, true, true],
        ];
    const reasons = wrong.map(([x, y, z]): Reason => {
      const v = leftValue(x, y, z);
      return [
        opt(x, y, z)[0],
        `Here both formulas are ${tf(v)}, so this assignment does not tell them apart.`,
        `这时两个公式都为${zf(v)}，所以这种赋值区分不了它们。`,
      ];
    });
    const [x0, z0] = andFirst ? [false, true] : [true, false];
    return reasoned(
      choose(
        rng,
        [`Which assignment shows that $${left}$ and $${right}$ are not equivalent?`, `哪种赋值说明 $${left}$ 与 $${right}$ 不等价？`],
        opt(x0, mid, z0),
        wrong.map(([x, y, z]) => opt(x, y, z)),
        [
          `**Step 1: Evaluate the first formula.** With $${a}$ ${tf(x0)} and $${c}$ ${tf(z0)}, $${left}$ is ${tf(andFirst)}: ${andFirst ? `the outer disjunction has $${c}$ true` : `the outer conjunction has $${c}$ false`}.\n\n**Step 2: Evaluate the second formula.** $${right}$ is ${tf(!andFirst)}: ${andFirst ? `the outer conjunction has $${a}$ false` : `the outer disjunction has $${a}$ true`}. The two values differ, so the formulas are not equivalent.\n\n**Check.** Neither step used $${b}$. With $${b}$ ${tf(!mid)} instead, the first formula is ${tf(leftValue(x0, !mid, z0))} and the second ${tf(rightValue(x0, !mid, z0))}, still different.`,
          `**第一步：计算第一个公式。** 当 $${a}$ 为${zf(x0)}、$${c}$ 为${zf(z0)}时，$${left}$ 为${zf(andFirst)}：${andFirst ? `外层析取中 $${c}$ 为真` : `外层合取中 $${c}$ 为假`}。\n\n**第二步：计算第二个公式。** $${right}$ 为${zf(!andFirst)}：${andFirst ? `外层合取中 $${a}$ 为假` : `外层析取中 $${a}$ 为真`}。两个值不同，所以两个公式不等价。\n\n**检验。** 两步都没有用到 $${b}$。改取 $${b}$ 为${zf(!mid)}，第一个公式为${zf(leftValue(x0, !mid, z0))}，第二个为${zf(rightValue(x0, !mid, z0))}，仍然不同。`,
        ],
      ),
      reasons,
    );
  },
);

const spottingAbsorption = point(
  "telling-absorption-from-its-lookalikes",
  ["Telling absorption from its lookalikes", "分辨吸收律与相似的形式"],
  [
    "Absorption needs the same letter both outside the bracket and inside it, with different connectives. Then the bracket adds nothing, and the whole formula reduces to that letter. Formulas that look similar but have a different letter inside the bracket do not simplify this way. So $p \\wedge (p \\vee q)$ is equivalent to $p$, but $p \\wedge (q \\vee r)$ is not: with $p$ true and $q$, $r$ false it is false while $p$ is true.\n\n> **Watch out.** The letter outside the bracket must appear again inside it. A different letter inside means there is nothing to absorb.",
    "吸收律要求同一个字母既在括号外又在括号内，且联结词不同。这时括号不起作用，整个公式化简为这个字母。外形相似但括号内字母不同的公式不能这样化简。所以 $p \\wedge (p \\vee q)$ 与 $p$ 等价，而 $p \\wedge (q \\vee r)$ 不是：$p$ 为真、$q$ 与 $r$ 为假时，它为假而 $p$ 为真。\n\n> **注意。** 括号外的字母必须在括号内再次出现。括号内是别的字母，就没有可吸收的。",
  ],
  (rng) => {
    const [a, b, c] = rng.sample(LETTERS, 3) as [string, string, string];
    const form = rng.int(0, 3);
    const formula = [
      `${a} \\wedge (${a} \\vee ${b})`,
      `${a} \\vee (${a} \\wedge ${b})`,
      `(${b} \\vee ${a}) \\wedge ${a}`,
      `(${b} \\wedge ${a}) \\vee ${a}`,
    ][form] as string;
    const conjunction = form % 2 === 0;
    const andOr = same(`${a} \\wedge (${b} \\vee ${c})`);
    const orAnd = same(`${a} \\vee (${b} \\wedge ${c})`);
    const swapped = same(`${b} \\wedge (${a} \\vee ${b})`);
    return reasoned(
      choose(
        rng,
        [`Which formula is logically equivalent to the single letter $${a}$?`, `哪个公式与单个字母 $${a}$ 逻辑等价？`],
        same(formula),
        [andOr, orAnd, swapped],
        [
          `**Step 1: Take $${a}$ true.** ${conjunction ? "The bracket is a disjunction containing a true letter, so it is true, and the conjunction is true." : "The outer disjunction contains a true letter, so it is true."}\n\n**Step 2: Take $${a}$ false.** ${conjunction ? "The outer conjunction contains a false letter, so it is false." : "The bracket is a conjunction containing a false letter, so it is false, and the disjunction is false."} In both cases $${formula}$ has the value of $${a}$, which is the absorption law.\n\n**Check.** Try $${a}$ true and $${b}$ false: $${formula}$ is true, the same as $${a}$.`,
          `**第一步：取 $${a}$ 为真。** ${conjunction ? "括号是含有真字母的析取，所以为真，合取也为真。" : "外层析取含有真字母，所以为真。"}\n\n**第二步：取 $${a}$ 为假。** ${conjunction ? "外层合取含有假字母，所以为假。" : "括号是含有假字母的合取，所以为假，析取也为假。"}两种情形下 $${formula}$ 都与 $${a}$ 取值相同，这就是吸收律。\n\n**检验。** 试 $${a}$ 为真、$${b}$ 为假：$${formula}$ 为真，与 $${a}$ 相同。`,
        ],
      ),
      [
        [
          andOr[0],
          `With $${a}$ true and $${b}$, $${c}$ false it is false while $${a}$ is true.`,
          `当 $${a}$ 为真、$${b}$ 与 $${c}$ 为假时，它为假而 $${a}$ 为真。`,
        ],
        [
          orAnd[0],
          `With $${a}$ false and $${b}$, $${c}$ true it is true while $${a}$ is false.`,
          `当 $${a}$ 为假、$${b}$ 与 $${c}$ 为真时，它为真而 $${a}$ 为假。`,
        ],
        [
          swapped[0],
          `This absorbs into $${b}$, not $${a}$: with $${a}$ true and $${b}$ false it is false.`,
          `它吸收成 $${b}$，而不是 $${a}$：当 $${a}$ 为真、$${b}$ 为假时，它为假。`,
        ],
      ],
    );
  },
);

const falsifyingRows = point(
  "counting-the-rows-that-falsify-an-implication",
  ["Counting the rows that falsify an implication", "计算使蕴涵为假的行数"],
  [
    "An implication is false only when its antecedent is true and its consequent is false, so only these rows need to be counted. If there are none, the implication is a tautology, which is a quick test that avoids writing the whole table. For $(p \\wedge q) \\Rightarrow r$ the antecedent is true only when $p$ and $q$ are, and then $r$ must be false: one row, $(\\text{T}, \\text{T}, \\text{F})$.\n\n> **Watch out.** A row with a false antecedent makes the implication true, not false. Count only the rows where the antecedent is true.",
    "蕴涵只有在前件为真且后件为假时才为假，所以只需计算这些行。如果一行也没有，这个蕴涵就是重言式，这种快速检验不必写出整张表。对 $(p \\wedge q) \\Rightarrow r$，前件只有 $p$、$q$ 都为真时才为真，这时 $r$ 须为假：只有一行 $(\\text{T}, \\text{T}, \\text{F})$。\n\n> **注意。** 前件为假的行使蕴涵为真，而不是为假。只数前件为真的行。",
  ],
  (rng) => {
    const [a, b, c] = rng.sample(LETTERS, 3) as [string, string, string];
    type F = readonly [string, (x: boolean, y: boolean, z: boolean) => boolean];
    const antecedents: F[] = [
      [`${a} \\wedge ${b}`, (x, y) => x && y],
      [`${a} \\vee ${b}`, (x, y) => x || y],
      [a, (x) => x],
    ];
    const consequents: F[] = [
      [c, (_x, _y, z) => z],
      [a, (x) => x],
      [`${b} \\vee ${c}`, (_x, y, z) => y || z],
      [`${a} \\vee ${c}`, (x, _y, z) => x || z],
    ];
    const [A, fa] = rng.pick(antecedents);
    const [B, fb] = rng.pick(consequents);
    const bad: boolean[][] = [];
    let antecedentFalse = 0;
    let bothTrue = 0;
    for (const x of [true, false])
      for (const y of [true, false])
        for (const z of [true, false]) {
          if (!fa(x, y, z)) antecedentFalse++;
          else if (fb(x, y, z)) bothTrue++;
          else bad.push([x, y, z]);
        }
    const answer = bad.length;
    const rows = bad.map(row).join(", ");
    const grouped = (part: string) => (part.includes(" ") ? `(${part})` : part);
    const antecedentTrue = 8 - antecedentFalse;
    return withMistakes(
      ask(
        [
          `In how many of the $8$ rows of the truth table is $${grouped(A)} \\Rightarrow ${grouped(B)}$ false?`,
          `在真值表的 $8$ 行中，$${grouped(A)} \\Rightarrow ${grouped(B)}$ 有多少行为假？`,
        ],
        answer,
        [8 - answer, answer + 1, answer === 0 ? 2 : answer - 1],
        [
          `**Step 1: Keep the rows with $${A}$ true.** An implication can be false only where its antecedent is true; $${A}$ is true in $${antecedentTrue}$ of the $8$ rows.\n\n**Step 2: Among them, find $${B}$ false.** ${
            answer === 0
              ? `Whenever $${A}$ is true, $${B}$ is true as well, so no row is false and the formula is a tautology.`
              : `In the order $(${a}, ${b}, ${c})$ these rows are $${rows}$, so there ${answer === 1 ? "is $1$" : `are $${answer}$`}.`
          }\n\n**Check.** Count the true rows instead: $${A}$ false in $${antecedentFalse}$ rows, and $${A}$, $${B}$ both true in $${bothTrue}$. Then $${antecedentFalse} + ${bothTrue} + ${answer} = 8$, every row counted once.`,
          `**第一步：保留 $${A}$ 为真的行。** 蕴涵只有在前件为真时才可能为假；$${A}$ 在 $8$ 行中有 $${antecedentTrue}$ 行为真。\n\n**第二步：在其中找 $${B}$ 为假的行。** ${
            answer === 0
              ? `每当 $${A}$ 为真时，$${B}$ 也为真，所以没有一行为假，这个公式是重言式。`
              : `按 $(${a}, ${b}, ${c})$ 的顺序，这些行是 $${rows}$，共 $${answer}$ 行。`
          }\n\n**检验。** 改数真行：$${A}$ 为假有 $${antecedentFalse}$ 行，$${A}$ 与 $${B}$ 都为真有 $${bothTrue}$ 行。$${antecedentFalse} + ${bothTrue} + ${answer} = 8$，每一行恰好数了一次。`,
        ],
      ),
      [
        say(String(8 - answer), "That counts the rows where the implication is true.", "这是蕴涵为真的行数。"),
        say(
          String(antecedentFalse),
          "That counts the rows where the antecedent is false; there the implication is true.",
          "这是前件为假的行数；那些行里蕴涵为真。",
        ),
      ],
    );
  },
);

const negatedConjunctionSet = point(
  "the-size-of-a-negated-conjunction",
  ["The size of a negated conjunction", "否定合取的真值集大小"],
  [
    "The truth set of a negation is the complement of the original truth set. So to count where a conjunction fails, count where it holds and subtract from the universe. This is usually shorter than working out the disjunction that the negation becomes. On $\\{1, \\dots, 10\\}$ with $P(x)$: $x > 6$ and $Q(x)$: $x$ is even, the conjunction holds for $8$ and $10$, so its negation holds for $10 - 2 = 8$ elements.\n\n> **Watch out.** $\\neg(P \\wedge Q)$ holds where at least one of $P$, $Q$ fails, not only where both fail: it is $\\neg P \\vee \\neg Q$, not $\\neg P \\wedge \\neg Q$.",
    "否定的真值集是原真值集的补集。所以要计算合取不成立的个数，可以先数它成立的个数，再从全集中减去。这通常比求出否定后的析取更简便。在 $\\{1, \\dots, 10\\}$ 上，取 $P(x)$：$x > 6$，$Q(x)$：$x$ 是偶数，合取对 $8$ 和 $10$ 成立，所以它的否定对 $10 - 2 = 8$ 个元素成立。\n\n> **注意。** $\\neg(P \\wedge Q)$ 在 $P$、$Q$ 至少有一个不成立时就成立，不只是两者都不成立时：它是 $\\neg P \\vee \\neg Q$，不是 $\\neg P \\wedge \\neg Q$。",
  ],
  (rng) => {
    const n = rng.int(12, 40);
    const a = rng.int(3, n - 4);
    const d = rng.int(2, 5);
    let both = 0;
    let greater = 0;
    let multiples = 0;
    for (let x = 1; x <= n; x++) {
      const p = x > a;
      const q = x % d === 0;
      if (p) greater++;
      if (q) multiples++;
      if (p && q) both++;
    }
    const answer = n - both;
    return withMistakes(
      ask(
        [
          `Let $U = \\{1, 2, \\dots, ${n}\\}$, $P(x)$ be "$x > ${a}$" and $Q(x)$ be "$x$ is a multiple of $${d}$". How many elements are in the truth set of $\\neg(P(x) \\wedge Q(x))$?`,
          `设 $U = \\{1, 2, \\dots, ${n}\\}$，$P(x)$ 为“$x > ${a}$”，$Q(x)$ 为“$x$ 是 $${d}$ 的倍数”。$\\neg(P(x) \\wedge Q(x))$ 的真值集有多少个元素？`,
        ],
        answer,
        [both, n - greater - multiples + both, n - greater],
        [
          `**Step 1: Count where the conjunction holds.** It holds for the multiples of $${d}$ above $${a}$: there are $${both}$ of them.\n\n**Step 2: Take the complement.** The negation holds for the other $${n} - ${both} = ${answer}$ elements.\n\n**Check.** Count $\\neg P \\vee \\neg Q$ directly: $\\neg P$ holds for the $${a}$ elements up to $${a}$, and among the $${greater}$ elements above $${a}$, $\\neg Q$ holds for $${greater} - ${both} = ${greater - both}$. Together $${a} + ${greater - both} = ${answer}$.`,
          `**第一步：数合取成立的元素。** 它对大于 $${a}$ 的 $${d}$ 的倍数成立：共 $${both}$ 个。\n\n**第二步：取补集。** 否定对其余 $${n} - ${both} = ${answer}$ 个元素成立。\n\n**检验。** 直接数 $\\neg P \\vee \\neg Q$：$\\neg P$ 对不超过 $${a}$ 的 $${a}$ 个元素成立；大于 $${a}$ 的 $${greater}$ 个元素中，$\\neg Q$ 对 $${greater} - ${both} = ${greater - both}$ 个成立。合计 $${a} + ${greater - both} = ${answer}$。`,
        ],
      ),
      [
        say(String(both), "That counts where the conjunction holds, not its negation.", "这数的是合取成立的元素，不是它的否定。"),
        say(
          String(n - greater - multiples + both),
          "That counts where both $P$ and $Q$ fail; the negation also holds where just one of them fails.",
          "这数的是 $P$ 与 $Q$ 都不成立的元素；只有一个不成立时否定也成立。",
        ),
        say(
          String(n - greater),
          "That counts only where $P$ fails; the negation also holds where $Q$ fails.",
          "这只数了 $P$ 不成立的元素；$Q$ 不成立时否定也成立。",
        ),
      ],
    );
  },
);

const necessarySufficient = point(
  "necessary-and-sufficient-in-symbols",
  ["Necessary and sufficient in symbols", "必要与充分的符号表示"],
  [
    'Sufficient conditions go in front of the arrow and necessary conditions behind it, which is easy to reverse. The phrase with only if marks the consequent, and the phrase with unless means that the stated condition holds whenever the other one fails. "A number is divisible by $4$ only if it is even" is "divisible by $4$" $\\Rightarrow$ "even": being even is necessary, being divisible by $4$ sufficient.\n\n> **Watch out.** "Only if" introduces the conclusion, not the hypothesis: "$p$ only if $q$" is $p \\Rightarrow q$, the same as "$q$ is necessary for $p$".',
    "充分条件放在箭头前面，必要条件放在箭头后面，这很容易弄反。“只有……才”标出的是必要条件，而“除非”的说法表示另一个条件不成立时所述条件成立。“只有是偶数，一个数才能被 $4$ 整除”就是“被 $4$ 整除”$\\Rightarrow$“是偶数”：是偶数是必要条件，被 $4$ 整除是充分条件。\n\n> **注意。** “只有 $q$，才 $p$”中 $q$ 是结论，不是前提：它是 $p \\Rightarrow q$，与“$q$ 是 $p$ 的必要条件”相同。",
  ],
  (rng) => {
    const [a, b] = rng.sample(LETTERS, 2) as [string, string];
    const forward = `${a} \\Rightarrow ${b}`;
    const backward = `${b} \\Rightarrow ${a}`;
    const unless = `\\neg ${b} \\Rightarrow ${a}`;
    const iff = `${a} \\Leftrightarrow ${b}`;
    const readForward: Pair = [
      `$${forward}$ says that $${a}$ cannot hold without $${b}$, and that $${a}$ alone is enough for $${b}$`,
      `$${forward}$ 是说没有 $${b}$ 就不会有 $${a}$，且单有 $${a}$ 就足以得到 $${b}$`,
    ];
    const readBackward: Pair = [
      `$${backward}$ says that $${b}$ cannot hold without $${a}$, and that $${b}$ alone is enough for $${a}$`,
      `$${backward}$ 是说没有 $${a}$ 就不会有 $${b}$，且单有 $${b}$ 就足以得到 $${a}$`,
    ];
    const cases: readonly (readonly [string, string, string, string, string, Pair])[] = [
      [
        `$${a}$ is necessary for $${b}$`,
        `$${a}$ 是 $${b}$ 的必要条件`,
        backward,
        `If $${b}$ holds, then the necessary condition $${a}$ must hold`,
        `如果 $${b}$ 成立，那么必要条件 $${a}$ 一定成立`,
        readBackward,
      ],
      [
        `$${a}$ is sufficient for $${b}$`,
        `$${a}$ 是 $${b}$ 的充分条件`,
        forward,
        `Having the sufficient condition $${a}$ already gives $${b}$`,
        `有了充分条件 $${a}$，就能得到 $${b}$`,
        readForward,
      ],
      [
        `$${a}$ only if $${b}$`,
        `只有 $${b}$，才 $${a}$`,
        forward,
        `If $${a}$ holds, it can only be because $${b}$ holds`,
        `如果 $${a}$ 成立，那只能是因为 $${b}$ 成立`,
        readForward,
      ],
      [
        `$${a}$ unless $${b}$`,
        `除非 $${b}$，否则 $${a}$`,
        unless,
        `The statement $${a}$ is guaranteed as soon as $${b}$ fails`,
        `只要 $${b}$ 不成立，$${a}$ 就成立`,
        [
          `$${unless}$ is equivalent to its contrapositive $\\neg ${a} \\Rightarrow ${b}$: $${a}$ can fail only when $${b}$ holds, which is what "unless" says`,
          `$${unless}$ 等价于它的逆否命题 $\\neg ${a} \\Rightarrow ${b}$：只有 $${b}$ 成立时 $${a}$ 才可能不成立，这正是“除非”的意思`,
        ],
      ],
      [
        `$${b}$ whenever $${a}$`,
        `只要 $${a}$，就 $${b}$`,
        forward,
        `Each time $${a}$ holds, $${b}$ holds as well`,
        `每当 $${a}$ 成立时，$${b}$ 也成立`,
        readForward,
      ],
      [
        `$${a}$ whenever $${b}$`,
        `只要 $${b}$，就 $${a}$`,
        backward,
        `Each time $${b}$ holds, $${a}$ holds as well`,
        `每当 $${b}$ 成立时，$${a}$ 也成立`,
        readBackward,
      ],
    ];
    const [en, zh, correct, why, zhWhy, check] = rng.pick(cases);
    const reasons: Reason[] = [
      [
        same(forward)[0],
        `That makes $${a}$ the hypothesis: it says $${a}$ is sufficient for $${b}$.`,
        `这把 $${a}$ 当作前提：它说的是 $${a}$ 是 $${b}$ 的充分条件。`,
      ],
      [
        same(backward)[0],
        `That makes $${b}$ the hypothesis: it says $${a}$ is necessary for $${b}$.`,
        `这把 $${b}$ 当作前提：它说的是 $${a}$ 是 $${b}$ 的必要条件。`,
      ],
      [
        same(unless)[0],
        `That says $${a}$ holds whenever $${b}$ fails, which is "$${a}$ unless $${b}$".`,
        `这说的是 $${b}$ 不成立时 $${a}$ 成立，即“除非 $${b}$，否则 $${a}$”。`,
      ],
      [same(iff)[0], "That claims both directions; the sentence states only one.", "这断言了两个方向；句子只说了一个方向。"],
    ];
    return reasoned(
      choose(
        rng,
        [`Which formula says "${en}"?`, `哪个公式表示“${zh}”？`],
        same(correct),
        [forward, backward, unless, iff].filter((f) => f !== correct).map(same),
        [
          `**Step 1: Find the hypothesis.** ${why}.\n\n**Step 2: Write the arrow.** The hypothesis goes in front, so the formula is $${correct}$.\n\n**Check.** Read the formula back: ${check[0]}, which matches "${en}".`,
          `**第一步：找出前提。** ${zhWhy}。\n\n**第二步：写出箭头。** 前提放在前面，所以公式是 $${correct}$。\n\n**检验。** 把公式读回去：${check[1]}，与“${zh}”相符。`,
        ],
      ),
      reasons,
    );
  },
);

const nestedNegation = point(
  "negating-two-nested-quantifiers",
  ["Negating two nested quantifiers", "否定两层嵌套量词"],
  [
    "To negate a statement with two quantifiers, flip each quantifier in turn and negate the inner condition. The order of the variables stays the same. The negation of $\\forall x\\, \\exists y,\\ y < 2x$ is $\\exists x\\, \\forall y,\\ y \\ge 2x$.\n\n> **Watch out.** Flip both quantifiers, not just one, and negate $<$ as $\\ge$, not $>$: the case of equality must land on one side or the other.",
    "否定含两个量词的命题时，要依次翻转每个量词，并否定内层条件。变量的顺序不变。$\\forall x\\, \\exists y,\\ y < 2x$ 的否定是 $\\exists x\\, \\forall y,\\ y \\ge 2x$。\n\n> **注意。** 两个量词都要翻转，不能只翻转一个；$<$ 的否定是 $\\ge$，不是 $>$：相等的情形必须落在某一边。",
  ],
  (rng) => {
    const k = rng.pick([-7, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
    const expr = poly([k, "x"]);
    const all = "\\forall x \\in \\mathbb{Z},\\ \\exists y \\in \\mathbb{Z},\\ ";
    const some = "\\exists x \\in \\mathbb{Z},\\ \\forall y \\in \\mathbb{Z},\\ ";
    const twoSame = "\\exists x \\in \\mathbb{Z},\\ \\exists y \\in \\mathbb{Z},\\ ";
    const twoAll = "\\forall x \\in \\mathbb{Z},\\ \\forall y \\in \\mathbb{Z},\\ ";
    const [rel, neg, opposite] = rng.pick([
      ["<", "\\ge", ">"],
      ["\\le", ">", "\\ge"],
      [">", "\\le", "<"],
      ["\\ge", "<", "\\le"],
    ] as const);
    const witness = (r: string) => (r === "<" ? `${expr} - 1` : r === ">" ? `${expr} + 1` : expr);
    const startAll = rng.bool();
    const start = startAll ? all : some;
    const flipped = startAll ? some : all;
    const noNegate = same(`${flipped}y ${rel} ${expr}`);
    const noFlip = same(`${start}y ${neg} ${expr}`);
    const half = same(`${startAll ? twoSame : twoAll}y ${neg} ${expr}`);
    const strict = same(`${flipped}y ${opposite} ${expr}`);
    return reasoned(
      choose(
        rng,
        [`What is the negation of $${start}y ${rel} ${expr}$?`, `$${start}y ${rel} ${expr}$ 的否定是什么？`],
        same(`${flipped}y ${neg} ${expr}`),
        [noNegate, noFlip, half, strict],
        [
          `**Step 1: Flip the quantifiers.** The negation passes through both quantifiers in turn, so $${startAll ? "\\forall x\\, \\exists y" : "\\exists x\\, \\forall y"}$ becomes $${startAll ? "\\exists x\\, \\forall y" : "\\forall x\\, \\exists y"}$, in the same order.\n\n**Step 2: Negate the condition.** $y ${rel} ${expr}$ becomes $y ${neg} ${expr}$.\n\n**Check.** ${
            startAll
              ? `The statement is true: for each $x$ take $y = ${witness(rel)}$. So the negation must be false, and it is: for any $x$, that same $y$ breaks $y ${neg} ${expr}$.`
              : `The statement is false: for any $x$, $y = ${witness(neg)}$ breaks it. So the negation must be true, and it is: for each $x$, that $y$ satisfies $y ${neg} ${expr}$.`
          }`,
          `**第一步：翻转量词。** 否定依次穿过两个量词，所以 $${startAll ? "\\forall x\\, \\exists y" : "\\exists x\\, \\forall y"}$ 变为 $${startAll ? "\\exists x\\, \\forall y" : "\\forall x\\, \\exists y"}$，次序不变。\n\n**第二步：否定条件。** $y ${rel} ${expr}$ 变为 $y ${neg} ${expr}$。\n\n**检验。** ${
            startAll
              ? `原命题为真：对每个 $x$ 取 $y = ${witness(rel)}$。所以否定必为假，确实如此：对任何 $x$，同一个 $y$ 使 $y ${neg} ${expr}$ 不成立。`
              : `原命题为假：对任何 $x$，$y = ${witness(neg)}$ 都使它不成立。所以否定必为真，确实如此：对每个 $x$，这个 $y$ 满足 $y ${neg} ${expr}$。`
          }`,
        ],
      ),
      [
        [noNegate[0], "That flips the quantifiers but does not negate the condition.", "这翻转了量词，却没有否定条件。"],
        [
          noFlip[0],
          "That negates the condition but keeps the quantifiers; both must flip.",
          "这否定了条件，却保留了量词；两个量词都要翻转。",
        ],
        [half[0], "That flips only one of the two quantifiers.", "这只翻转了两个量词中的一个。"],
        [
          strict[0],
          `The negation of $${rel}$ is $${neg}$, not $${opposite}$: equality belongs to the negation.`,
          `$${rel}$ 的否定是 $${neg}$，不是 $${opposite}$：相等的情形属于否定。`,
        ],
      ],
    );
  },
);

const quantifierOrder = point(
  "why-the-order-of-quantifiers-matters",
  ["Why the order of quantifiers matters", "量词顺序为何重要"],
  [
    'In $\\forall x\\, \\exists y$, the value of $y$ may change with $x$, but in $\\exists y\\, \\forall x$, one value of $y$ must work for every $x$. So the second statement is stronger: it implies the first, but the first may be true without it. Over the integers, $\\forall x\\, \\exists y,\\ x + y = 0$ is true with $y = -x$, while $\\exists y\\, \\forall x,\\ x + y = 0$ is false.\n\n> **Watch out.** Since the second statement implies the first, the answer "only the second is true" is never possible.',
    "在 $\\forall x\\, \\exists y$ 中，$y$ 的值可以随 $x$ 改变，但在 $\\exists y\\, \\forall x$ 中，同一个 $y$ 必须对所有 $x$ 都成立。所以后者更强：它蕴涵前者，但前者可以在它不成立时为真。在整数范围内，$\\forall x\\, \\exists y,\\ x + y = 0$ 为真，取 $y = -x$；而 $\\exists y\\, \\forall x,\\ x + y = 0$ 为假。\n\n> **注意。** 由于后者蕴涵前者，“只有第二个为真”是不可能的。",
  ],
  (rng) => {
    const k = rng.int(2, 30);
    const kind = rng.int(0, 5);
    const cond = [
      `${poly([1, "x"], [1, "y"])} = ${k}`,
      `y > ${poly([1, "x"], [k, ""])}`,
      `${k}xy = 0`,
      `x^{2} + y^{2} \\ge -${k}`,
      `xy = ${k}`,
      `x^{2} + y^{2} = ${k}`,
    ][kind] as string;
    const first: Pair = ["Only the first is true", "只有第一个为真"];
    const second: Pair = ["Only the second is true", "只有第二个为真"];
    const both: Pair = ["Both are true", "两个都为真"];
    const neither: Pair = ["Neither is true", "两个都不为真"];
    const option = kind < 2 ? first : kind < 4 ? both : neither;
    const steps: [Pair, Pair, Pair][] = [
      [
        [`For each $x$, $y = ${k} - x$ works, so the first is true.`, `对每个 $x$，$y = ${k} - x$ 都满足，所以第一个为真。`],
        [
          `A single $y$ would need $x + y = ${k}$ for every $x$, but $x = 0$ needs $y = ${k}$ and $x = 1$ needs $y = ${k - 1}$. So the second is false.`,
          `一个 $y$ 要对每个 $x$ 都满足 $x + y = ${k}$，但 $x = 0$ 需要 $y = ${k}$，$x = 1$ 需要 $y = ${k - 1}$。所以第二个为假。`,
        ],
        [
          `Try $y = ${k}$: it works for $x = 0$, but $x = 1$ gives $${k + 1} \\ne ${k}$.`,
          `试 $y = ${k}$：它对 $x = 0$ 成立，但 $x = 1$ 得 $${k + 1} \\ne ${k}$。`,
        ],
      ],
      [
        [`For each $x$, $y = x + ${k + 1}$ works, so the first is true.`, `对每个 $x$，$y = x + ${k + 1}$ 都满足，所以第一个为真。`],
        [
          `A single $y$ would have to exceed $x + ${k}$ for every $x$, but $x = y$ fails, since $y > y + ${k}$ is false. So the second is false.`,
          `一个 $y$ 要大于每个 $x$ 的 $x + ${k}$，但 $x = y$ 时不成立，因为 $y > y + ${k}$ 为假。所以第二个为假。`,
        ],
        [
          `Try $y = 100$: it is beaten by $x = 100$, since $100 > ${100 + k}$ is false.`,
          `试 $y = 100$：遇到 $x = 100$ 就不成立，因为 $100 > ${100 + k}$ 为假。`,
        ],
      ],
      [
        [
          `$y = 0$ gives $${k}x \\cdot 0 = 0$ for any $x$, so the first is true.`,
          `$y = 0$ 对任何 $x$ 都得 $${k}x \\cdot 0 = 0$，所以第一个为真。`,
        ],
        [
          `The same $y = 0$ works for every $x$ at once, so the second is true as well.`,
          `同一个 $y = 0$ 对所有 $x$ 都成立，所以第二个也为真。`,
        ],
        [`Try $x = 5$ and $x = -3$ with $y = 0$: both products are $0$.`, `取 $y = 0$，试 $x = 5$ 和 $x = -3$：两个积都是 $0$。`],
      ],
      [
        [
          `$x^{2} + y^{2} \\ge 0 > -${k}$ for all $x$ and $y$, so the first is true.`,
          `对所有 $x$、$y$ 都有 $x^{2} + y^{2} \\ge 0 > -${k}$，所以第一个为真。`,
        ],
        [
          `So any one $y$, such as $y = 0$, works for every $x$: the second is true as well.`,
          `所以任何一个 $y$，例如 $y = 0$，对每个 $x$ 都成立：第二个也为真。`,
        ],
        [`Try the smallest case $x = y = 0$: $0 \\ge -${k}$.`, `试最小的情形 $x = y = 0$：$0 \\ge -${k}$。`],
      ],
      [
        [
          `With $x = 0$, $xy = 0 \\ne ${k}$ for every $y$, so the first is false.`,
          `当 $x = 0$ 时，对每个 $y$ 都有 $xy = 0 \\ne ${k}$，所以第一个为假。`,
        ],
        [
          "The second implies the first: one $y$ that worked for every $x$ would work for $x = 0$. So the second is false too.",
          "第二个蕴涵第一个：对每个 $x$ 都成立的 $y$ 也会对 $x = 0$ 成立。所以第二个也为假。",
        ],
        [`Try $x = 0$ with $y = ${k}$: the product is $0$, not $${k}$.`, `取 $x = 0$，试 $y = ${k}$：积是 $0$，不是 $${k}$。`],
      ],
      [
        [
          `With $x = ${k}$, $x^{2} + y^{2} \\ge ${k * k} > ${k}$ for every $y$, so the first is false.`,
          `当 $x = ${k}$ 时，对每个 $y$ 都有 $x^{2} + y^{2} \\ge ${k * k} > ${k}$，所以第一个为假。`,
        ],
        [
          `The second implies the first: one $y$ that worked for every $x$ would work for $x = ${k}$. So the second is false too.`,
          `第二个蕴涵第一个：对每个 $x$ 都成立的 $y$ 也会对 $x = ${k}$ 成立。所以第二个也为假。`,
        ],
        [
          `Try $x = ${k}$ with the most favourable $y = 0$: $${k * k} \\ne ${k}$.`,
          `取 $x = ${k}$，试最有利的 $y = 0$：$${k * k} \\ne ${k}$。`,
        ],
      ],
    ];
    const [s1, s2, check] = steps[kind]!;
    const reasons: Reason[] = [
      [second[0], "The second implies the first, so it cannot be true alone.", "第二个蕴涵第一个，所以它不可能单独为真。"],
      ...(option === first
        ? ([
            [
              both[0],
              "The second needs one $y$ for every $x$, and no single $y$ works here.",
              "第二个需要一个对每个 $x$ 都成立的 $y$，这里没有这样的 $y$。",
            ],
            [neither[0], "The first is true: for each $x$ a suitable $y$ can be found.", "第一个为真：对每个 $x$ 都能找到合适的 $y$。"],
          ] as Reason[])
        : option === both
          ? ([
              [first[0], "The second is true as well: one $y$ works for every $x$.", "第二个也为真：有一个 $y$ 对每个 $x$ 都成立。"],
              [neither[0], "Both are true: a single $y$ works for every $x$.", "两个都为真：有一个 $y$ 对每个 $x$ 都成立。"],
            ] as Reason[])
          : ([
              [first[0], "The first fails: some $x$ has no suitable $y$ at all.", "第一个不成立：某个 $x$ 根本没有合适的 $y$。"],
              [
                both[0],
                "Some $x$ has no suitable $y$ at all, so the first fails, and the second with it.",
                "某个 $x$ 根本没有合适的 $y$，所以第一个不成立，第二个也随之不成立。",
              ],
            ] as Reason[])),
    ];
    return reasoned(
      choose(
        rng,
        [
          `Over the integers, consider the first statement $\\forall x\\, \\exists y,\\ ${cond}$ and the second statement $\\exists y\\, \\forall x,\\ ${cond}$. Which are true?`,
          `在整数范围内，考虑第一个命题 $\\forall x\\, \\exists y,\\ ${cond}$ 和第二个命题 $\\exists y\\, \\forall x,\\ ${cond}$。哪些为真？`,
        ],
        option,
        [first, second, both, neither].filter((o) => o !== option),
        [
          `**Step 1: Decide the first statement.** ${s1[0]}\n\n**Step 2: Decide the second statement.** ${s2[0]}\n\n**Check.** ${check[0]}`,
          `**第一步：判断第一个命题。** ${s1[1]}\n\n**第二步：判断第二个命题。** ${s2[1]}\n\n**检验。** ${check[1]}`,
        ],
      ),
      reasons,
    );
  },
);

const prenexRename = point(
  "renaming-a-repeated-bound-variable",
  ["Renaming a repeated bound variable", "重命名重复的约束变量"],
  [
    "When both parts of a formula bind the same letter, the two variables are unrelated, so one must be renamed before the quantifiers are pulled out. Merging them into one quantifier would wrongly force a single value to do both jobs. Over the integers, $(\\exists x,\\ x \\text{ is even}) \\wedge (\\exists x,\\ x \\text{ is odd})$ is true, but $\\exists x\\, (x \\text{ is even} \\wedge x \\text{ is odd})$ is false; renaming gives the correct $\\exists x\\, \\exists y\\, (x \\text{ is even} \\wedge y \\text{ is odd})$.\n\n> **Watch out.** The same letter in two separately quantified parts names two different variables. Rename one before pulling out; never merge them into one quantifier.",
    "当公式的两部分约束同一个字母时，这两个变量互不相关，所以在提出量词之前必须重命名其中一个。把它们合并成一个量词，会错误地要求同一个值同时承担两个作用。在整数范围内，$(\\exists x,\\ x \\text{ 是偶数}) \\wedge (\\exists x,\\ x \\text{ 是奇数})$ 为真，而 $\\exists x\\, (x \\text{ 是偶数} \\wedge x \\text{ 是奇数})$ 为假；重命名后得到正确的 $\\exists x\\, \\exists y\\, (x \\text{ 是偶数} \\wedge y \\text{ 是奇数})$。\n\n> **注意。** 在两个分别量化的部分中，同一个字母表示两个不同的变量。提出量词前先重命名其中一个；绝不能把它们合并成一个量词。",
  ],
  (rng) => {
    const [A, B] = rng.sample(["P", "Q", "R", "S", "T"], 2) as [string, string];
    const kind = rng.int(0, 3);
    const [formula, renamed, right, wrong, why, zhWhy, check, zhCheck] = [
      [
        `(\\exists x\\, ${A}(x)) \\wedge (\\exists x\\, ${B}(x))`,
        `(\\exists x\\, ${A}(x)) \\wedge (\\exists y\\, ${B}(y))`,
        `\\exists x\\, \\exists y\\, (${A}(x) \\wedge ${B}(y))`,
        `\\exists x\\, (${A}(x) \\wedge ${B}(x))`,
        "Both parts may have different witnesses",
        "两部分可以有不同的见证",
        `over the integers let $${A}(x)$ say "$x$ is even" and $${B}(x)$ say "$x$ is odd". The formula is true, and so is the answer, with $x = 2$, $y = 3$`,
        `在整数范围内，设 $${A}(x)$ 表示“$x$ 是偶数”，$${B}(x)$ 表示“$x$ 是奇数”。原式为真，答案也为真，取 $x = 2$，$y = 3$`,
      ],
      [
        `(\\forall x\\, ${A}(x)) \\vee (\\forall x\\, ${B}(x))`,
        `(\\forall x\\, ${A}(x)) \\vee (\\forall y\\, ${B}(y))`,
        `\\forall x\\, \\forall y\\, (${A}(x) \\vee ${B}(y))`,
        `\\forall x\\, (${A}(x) \\vee ${B}(x))`,
        "Each universal part ranges separately",
        "每个全称部分分别取值",
        `over the integers let $${A}(x)$ say "$x$ is even" and $${B}(x)$ say "$x$ is odd". The formula is false, since not every integer is even and not every one is odd, and so is the answer: $x = 1$, $y = 2$ breaks it`,
        `在整数范围内，设 $${A}(x)$ 表示“$x$ 是偶数”，$${B}(x)$ 表示“$x$ 是奇数”。原式为假，因为整数并非都是偶数，也并非都是奇数；答案也为假：$x = 1$，$y = 2$ 使它不成立`,
      ],
      [
        `(\\exists x\\, ${A}(x)) \\wedge (\\forall x\\, ${B}(x))`,
        `(\\exists x\\, ${A}(x)) \\wedge (\\forall y\\, ${B}(y))`,
        `\\exists x\\, \\forall y\\, (${A}(x) \\wedge ${B}(y))`,
        `\\exists x\\, (${A}(x) \\wedge ${B}(x))`,
        "The witness of the first part is unrelated to the second variable",
        "第一部分的见证与第二个变量无关",
        `over the integers let both $${A}(x)$ and $${B}(x)$ say "$x$ is even". The formula is false, since not every integer is even, and so is the answer: for any $x$, $y = 1$ breaks it`,
        `在整数范围内，设 $${A}(x)$ 与 $${B}(x)$ 都表示“$x$ 是偶数”。原式为假，因为整数并非都是偶数；答案也为假：对任何 $x$，$y = 1$ 都使它不成立`,
      ],
      [
        `(\\forall x\\, ${A}(x)) \\Rightarrow (\\exists x\\, ${B}(x))`,
        `(\\forall x\\, ${A}(x)) \\Rightarrow (\\exists y\\, ${B}(y))`,
        `\\exists x\\, \\exists y\\, (${A}(x) \\Rightarrow ${B}(y))`,
        `\\forall x\\, \\exists y\\, (${A}(x) \\Rightarrow ${B}(y))`,
        "A quantifier from the antecedent flips, and the two variables are separate",
        "前件中的量词要翻转，并且两个变量相互独立",
        `over the integers let $${A}(x)$ say "$x$ is even" and $${B}(x)$ say "$x^2 < 0$". The hypothesis is false, so the formula is true, and so is the answer, with $x = 1$, where $${A}(x)$ fails`,
        `在整数范围内，设 $${A}(x)$ 表示“$x$ 是偶数”，$${B}(x)$ 表示“$x^2 < 0$”。前提为假，所以原式为真；答案也为真，取 $x = 1$，此时 $${A}(x)$ 不成立`,
      ],
    ][kind] as [string, string, string, string, string, string, string, string];
    const swapped = same(`\\forall y\\, \\forall x\\, (${A}(x) \\wedge ${B}(y))`);
    const crossed = same(`\\exists y\\, \\forall x\\, (${A}(y) \\vee ${B}(x))`);
    const mismatch = "Renaming is allowed, but here the kinds of quantifiers or the connective no longer match the formula.";
    const zhMismatch = "重命名是允许的，但这里量词的种类或联结词与原式不再相符。";
    return reasoned(
      choose(
        rng,
        [`Which is a prenex normal form of $${formula}$?`, `哪个是 $${formula}$ 的前束范式？`],
        same(right),
        [same(wrong), swapped, crossed],
        [
          `**Step 1: Rename.** The two parts bind $x$ separately, so rename the second: $${renamed}$.\n\n**Step 2: Pull out the quantifiers.** ${why}, and each variable now appears in one part only, which gives $${right}$.\n\n**Check.** Try a case: ${check}.`,
          `**第一步：重命名。** 两部分分别约束 $x$，所以把第二个改名：$${renamed}$。\n\n**第二步：提出量词。** ${zhWhy}，而现在每个变量只出现在一个部分中，得 $${right}$。\n\n**检验。** 试一种情形：${zhCheck}。`,
        ],
      ),
      [
        kind === 3
          ? [
              same(wrong)[0],
              "That keeps the for all of the antecedent; a quantifier moved out of the hypothesis flips.",
              "这保留了前件中的“对所有”；从前提中提出的量词要翻转。",
            ]
          : [
              same(wrong)[0],
              "That merges the two variables into one, forcing a single value to do both jobs.",
              "这把两个变量合并成一个，要求同一个值承担两个作用。",
            ],
        [swapped[0], mismatch, zhMismatch],
        [crossed[0], mismatch, zhMismatch],
      ],
    );
  },
);

const chainStatus = point(
  "what-a-chain-of-conditionals-determines",
  ["What a chain of conditionals determines", "条件链能确定什么"],
  [
    "Affirming a statement in a chain carries truth forward along the arrows, and denying a statement carries falsity backward. Going in the other direction determines nothing: denying the antecedent and affirming the consequent are the two classic fallacies. From $p \\Rightarrow q$, $q \\Rightarrow r$ and $p$, the letter $r$ must be true; from the same arrows and $r$, nothing follows about $p$.\n\n> **Watch out.** Truth travels only forward and falsity only backward. A letter on the other side of the given one is left undetermined.",
    "在条件链中，肯定一个命题会使真沿箭头向前传递，否定一个命题会使假沿箭头向后传递。反方向则什么也确定不了：否定前件和肯定后件是两种经典的谬误。由 $p \\Rightarrow q$、$q \\Rightarrow r$ 和 $p$，$r$ 一定为真；由同样的箭头和 $r$，关于 $p$ 什么也推不出。\n\n> **注意。** 真只向前传，假只向后传。位于已知字母另一侧的字母无法确定。",
  ],
  (rng) => {
    const names = rng.sample(LETTERS, 3) as [string, string, string];
    const [a, b, c] = names;
    const fact = rng.int(0, 5);
    const [factIndex, factValue] = (
      [
        [0, true],
        [1, true],
        [2, true],
        [0, false],
        [1, false],
        [2, false],
      ] as const
    )[fact] as readonly [number, boolean];
    const rows: boolean[][] = [];
    for (const x of [true, false])
      for (const y of [true, false])
        for (const z of [true, false]) {
          const values = [x, y, z];
          if ((!x || y) && (!y || z) && values[factIndex] === factValue) rows.push(values);
        }
    const others = [0, 1, 2].filter((i) => i !== factIndex);
    const target = rng.pick(others);
    const values = rows.map((r) => r[target] as boolean);
    const always = values.every((v) => v);
    const never = values.every((v) => !v);
    const yes: Pair = ["It must be true", "它一定为真"];
    const no: Pair = ["It must be false", "它一定为假"];
    const open: Pair = ["It cannot be determined", "无法确定"];
    const option = always ? yes : never ? no : open;
    const factName = names[factIndex] as string;
    const targetName = names[target] as string;
    const given = factValue ? factName : `\\neg ${factName}`;
    const list = rows.map(row).join(", ");
    const withTrue = rows.find((r) => r[target]);
    const withFalse = rows.find((r) => !r[target]);
    const direction: Pair = factValue
      ? [
          `$${factName}$ is true, and the arrows carry truth forward, so every letter after $${factName}$ is true; they say nothing about the letters before it.`,
          `$${factName}$ 为真，箭头把真向前传，所以 $${factName}$ 之后的字母都为真；对它之前的字母则什么也没说。`,
        ]
      : [
          `$${factName}$ is false, and the arrows carry falsity backward, so every letter before $${factName}$ is false; they say nothing about the letters after it.`,
          `$${factName}$ 为假，箭头把假向后传，所以 $${factName}$ 之前的字母都为假；对它之后的字母则什么也没说。`,
        ];
    const check: Pair = always
      ? [
          `Suppose $${targetName}$ were false. Going backward along the arrows, $${factName}$ would be false as well, against $${given}$.`,
          `假设 $${targetName}$ 为假。沿箭头向后，$${factName}$ 也会为假，与 $${given}$ 矛盾。`,
        ]
      : never
        ? [
            `Suppose $${targetName}$ were true. Going forward along the arrows, $${factName}$ would be true as well, against $${given}$.`,
            `假设 $${targetName}$ 为真。沿箭头向前，$${factName}$ 也会为真，与 $${given}$ 矛盾。`,
          ]
        : [
            `The rows $${row(withTrue!)}$ and $${row(withFalse!)}$ both satisfy every premise, with $${targetName}$ true in one and false in the other.`,
            `$${row(withTrue!)}$ 与 $${row(withFalse!)}$ 这两行都满足所有前提，$${targetName}$ 在一行为真，在另一行为假。`,
          ];
    const fallacy: Pair = factValue
      ? [
          `Truth travels only forward; concluding something about a letter before $${factName}$ is affirming the consequent.`,
          `真只向前传；由此对 $${factName}$ 之前的字母下结论，是肯定后件的谬误。`,
        ]
      : [
          `Falsity travels only backward; concluding something about a letter after $${factName}$ is denying the antecedent.`,
          `假只向后传；由此对 $${factName}$ 之后的字母下结论，是否定前件的谬误。`,
        ];
    const reasons: Reason[] =
      option === open
        ? [
            [yes[0], ...fallacy],
            [no[0], ...fallacy],
          ]
        : option === yes
          ? [
              [
                no[0],
                `That goes against the chain: the truth of $${factName}$ is carried forward to $${targetName}$.`,
                `这与链条矛盾：$${factName}$ 的真沿箭头传到了 $${targetName}$。`,
              ],
              [
                open[0],
                `$${targetName}$ comes after $${factName}$, so the arrows decide it.`,
                `$${targetName}$ 在 $${factName}$ 之后，箭头确定了它。`,
              ],
            ]
          : [
              [
                yes[0],
                `That goes against the chain: if $${targetName}$ were true, the arrows would make $${factName}$ true.`,
                `这与链条矛盾：若 $${targetName}$ 为真，箭头会使 $${factName}$ 为真。`,
              ],
              [
                open[0],
                `$${targetName}$ comes before $${factName}$, so the arrows decide it.`,
                `$${targetName}$ 在 $${factName}$ 之前，箭头确定了它。`,
              ],
            ];
    return reasoned(
      choose(
        rng,
        [
          `Suppose $${a} \\Rightarrow ${b}$, $${b} \\Rightarrow ${c}$ and $${given}$ are all true. What can be said about $${targetName}$?`,
          `设 $${a} \\Rightarrow ${b}$，$${b} \\Rightarrow ${c}$ 和 $${given}$ 都为真。关于 $${targetName}$ 能得出什么结论？`,
        ],
        option,
        [yes, no, open].filter((o) => o !== option),
        [
          `**Step 1: Follow the arrows.** ${direction[0]}\n\n**Step 2: List the rows.** In the order $(${a}, ${b}, ${c})$, the rows that satisfy all three premises are: $${list}$. ${
            always
              ? `In each of them, $${targetName}$ is true.`
              : never
                ? `In each of them, $${targetName}$ is false.`
                : `$${targetName}$ takes both values among them.`
          }\n\n**Check.** ${check[0]}`,
          `**第一步：沿箭头推理。** ${direction[1]}\n\n**第二步：列出各行。** 按 $(${a}, ${b}, ${c})$ 的顺序，满足全部三个条件的行是：$${list}$。${
            always
              ? `在每一行中 $${targetName}$ 都为真。`
              : never
                ? `在每一行中 $${targetName}$ 都为假。`
                : `$${targetName}$ 在其中两种值都取到。`
          }\n\n**检验。** ${check[1]}`,
        ],
      ),
      reasons,
    );
  },
);

const combiningRules = point(
  "combining-several-rules-of-inference",
  ["Combining several rules of inference", "组合多条推理规则"],
  [
    "Real arguments use rules of inference in sequence: the conclusion of one step becomes a premise of the next. Checking which statement follows means building that chain from the premises, not just finding a statement that looks related to them. From $p \\vee q$, $\\neg p$ and $q \\Rightarrow r$: disjunctive syllogism gives $q$, and then modus ponens gives $r$.\n\n> **Watch out.** A letter that appears in the premises is not a conclusion just because it appears. It follows only if every way of making the premises true makes it true.",
    "实际论证按顺序使用推理规则：一步的结论成为下一步的前提。判断哪个命题能推出，意味着要从前提构建这条链，而不只是找一个看起来与前提相关的命题。由 $p \\vee q$、$\\neg p$ 和 $q \\Rightarrow r$：选言推理得 $q$，再由肯定前件得 $r$。\n\n> **注意。** 出现在前提中的字母，并不因为出现就是结论。只有使前提为真的每种方式都使它为真，它才能推出。",
  ],
  (rng) => {
    const [a, b, c] = rng.sample(LETTERS, 3) as [string, string, string];
    const kind = rng.int(0, 3);
    type Case = readonly [premises: string, right: string, steps: readonly [Pair, Pair, Pair], reasons: readonly Reason[]];
    const data: readonly Case[] = [
      [
        `${a} \\vee ${b},\\ \\neg ${a},\\ ${b} \\Rightarrow ${c}`,
        c,
        [
          [
            `From $${a} \\vee ${b}$ and $\\neg ${a}$, disjunctive syllogism gives $${b}$.`,
            `由 $${a} \\vee ${b}$ 与 $\\neg ${a}$，选言推理得 $${b}$。`,
          ],
          [
            `From $${b}$ and $${b} \\Rightarrow ${c}$, modus ponens gives $${c}$.`,
            `由 $${b}$ 与 $${b} \\Rightarrow ${c}$，肯定前件得 $${c}$。`,
          ],
          [
            `Make $${c}$ false: then $${b} \\Rightarrow ${c}$ forces $${b}$ false, and $${a} \\vee ${b}$ forces $${a}$ true, against $\\neg ${a}$.`,
            `令 $${c}$ 为假：则 $${b} \\Rightarrow ${c}$ 迫使 $${b}$ 为假，$${a} \\vee ${b}$ 又迫使 $${a}$ 为真，与 $\\neg ${a}$ 矛盾。`,
          ],
        ],
        [
          [`$${a}$`, `The premise $\\neg ${a}$ says $${a}$ is false.`, `前提 $\\neg ${a}$ 说明 $${a}$ 为假。`],
          [`$\\neg ${b}$`, `Disjunctive syllogism gives $${b}$, not its negation.`, `选言推理得到的是 $${b}$，不是它的否定。`],
          [
            `$\\neg ${c}$`,
            `Modus ponens gives $${c}$; its negation contradicts the premises.`,
            `肯定前件得到 $${c}$；它的否定与前提矛盾。`,
          ],
        ],
      ],
      [
        `${a} \\vee ${b},\\ ${a} \\Rightarrow ${c},\\ ${b} \\Rightarrow ${c}`,
        c,
        [
          [
            `If $${a}$ holds, $${a} \\Rightarrow ${c}$ gives $${c}$; if $${b}$ holds, $${b} \\Rightarrow ${c}$ gives $${c}$.`,
            `若 $${a}$ 成立，由 $${a} \\Rightarrow ${c}$ 得 $${c}$；若 $${b}$ 成立，由 $${b} \\Rightarrow ${c}$ 得 $${c}$。`,
          ],
          [
            `By $${a} \\vee ${b}$ one of the two cases holds, so $${c}$ follows: this is proof by cases.`,
            `由 $${a} \\vee ${b}$，两种情形必有一种成立，所以得 $${c}$：这是分情形证明。`,
          ],
          [
            `Make $${c}$ false: modus tollens makes both $${a}$ and $${b}$ false, against $${a} \\vee ${b}$.`,
            `令 $${c}$ 为假：由否定后件，$${a}$ 与 $${b}$ 都为假，与 $${a} \\vee ${b}$ 矛盾。`,
          ],
        ],
        [
          [
            `$${a}$`,
            "The disjunction does not say which case holds, so this part alone does not follow.",
            "析取没有说明哪种情形成立，所以单独这一部分推不出。",
          ],
          [
            `$${b}$`,
            "The disjunction does not say which case holds, so this part alone does not follow.",
            "析取没有说明哪种情形成立，所以单独这一部分推不出。",
          ],
          [
            `$\\neg ${c}$`,
            `$${c}$ holds in either case, so its negation contradicts the premises.`,
            `两种情形下 $${c}$ 都成立，所以它的否定与前提矛盾。`,
          ],
        ],
      ],
      [
        `${a} \\Rightarrow ${b},\\ \\neg ${b},\\ ${a} \\vee ${c}`,
        c,
        [
          [
            `From $${a} \\Rightarrow ${b}$ and $\\neg ${b}$, modus tollens gives $\\neg ${a}$.`,
            `由 $${a} \\Rightarrow ${b}$ 与 $\\neg ${b}$，否定后件得 $\\neg ${a}$。`,
          ],
          [
            `From $${a} \\vee ${c}$ and $\\neg ${a}$, disjunctive syllogism gives $${c}$.`,
            `由 $${a} \\vee ${c}$ 与 $\\neg ${a}$，选言推理得 $${c}$。`,
          ],
          [
            `Make $${c}$ false: then $${a} \\vee ${c}$ needs $${a}$, and $${a} \\Rightarrow ${b}$ gives $${b}$, against $\\neg ${b}$.`,
            `令 $${c}$ 为假：则 $${a} \\vee ${c}$ 要求 $${a}$ 为真，$${a} \\Rightarrow ${b}$ 又给出 $${b}$，与 $\\neg ${b}$ 矛盾。`,
          ],
        ],
        [
          [`$${a}$`, `Modus tollens gives $\\neg ${a}$, not $${a}$.`, `否定后件得到的是 $\\neg ${a}$，不是 $${a}$。`],
          [`$${b}$`, `The premise $\\neg ${b}$ says $${b}$ is false.`, `前提 $\\neg ${b}$ 说明 $${b}$ 为假。`],
          [
            `$\\neg ${c}$`,
            `$${c}$ follows by disjunctive syllogism; its negation contradicts the premises.`,
            `由选言推理得 $${c}$；它的否定与前提矛盾。`,
          ],
        ],
      ],
      [
        `${a} \\Rightarrow ${b},\\ ${b} \\Rightarrow ${c},\\ \\neg ${c}`,
        `\\neg ${a}`,
        [
          [
            `$${a} \\Rightarrow ${b}$ and $${b} \\Rightarrow ${c}$ chain to $${a} \\Rightarrow ${c}$.`,
            `$${a} \\Rightarrow ${b}$ 与 $${b} \\Rightarrow ${c}$ 串联得 $${a} \\Rightarrow ${c}$。`,
          ],
          [`With $\\neg ${c}$, modus tollens gives $\\neg ${a}$.`, `结合 $\\neg ${c}$，否定后件得 $\\neg ${a}$。`],
          [
            `Make $${a}$ true: the arrows give $${b}$ and then $${c}$, against $\\neg ${c}$.`,
            `令 $${a}$ 为真：箭头依次给出 $${b}$ 和 $${c}$，与 $\\neg ${c}$ 矛盾。`,
          ],
        ],
        [
          [`$${a}$`, `Modus tollens gives $\\neg ${a}$, not $${a}$.`, `否定后件得到的是 $\\neg ${a}$，不是 $${a}$。`],
          [
            `$${b}$`,
            `From $\\neg ${c}$ and $${b} \\Rightarrow ${c}$, $${b}$ is false.`,
            `由 $\\neg ${c}$ 与 $${b} \\Rightarrow ${c}$，$${b}$ 为假。`,
          ],
          [`$${c}$`, `The premise $\\neg ${c}$ says $${c}$ is false.`, `前提 $\\neg ${c}$ 说明 $${c}$ 为假。`],
        ],
      ],
    ];
    const [premises, right, [s1, s2, check], reasons] = data[kind]!;
    const wrong = reasons.map(([en]) => en.slice(1, -1));
    return reasoned(
      choose(rng, [`Which statement follows from $${premises}$?`, `由 $${premises}$ 能推出哪个命题？`], same(right), wrong.map(same), [
        `**Step 1: Take the first step.** ${s1[0]}\n\n**Step 2: Take the second step.** ${s2[0]}\n\n**Check.** ${check[0]}`,
        `**第一步：推出第一步。** ${s1[1]}\n\n**第二步：推出第二步。** ${s2[1]}\n\n**检验。** ${check[1]}`,
      ]),
      [...reasons],
    );
  },
);

const outsideBoth = point(
  "counting-outside-both-sets",
  ["Counting outside both sets", "计算两个集合之外的元素"],
  [
    "The elements outside both sets form $A^{c} \\cap B^{c}$, which De Morgan's law rewrites as $(A \\cup B)^{c}$. So the count is the size of the universe minus the size of the union, and the union must be found with inclusion and exclusion. With $|U| = 20$, $|A| = 8$, $|B| = 6$ and $|A \\cap B| = 3$, the union has $8 + 6 - 3 = 11$ elements, so $20 - 11 = 9$ lie outside both.\n\n> **Watch out.** $|U| - |A| - |B|$ removes the elements of $A \\cap B$ twice. Subtract the union, found by inclusion and exclusion, instead.",
    "两个集合之外的元素构成 $A^{c} \\cap B^{c}$，德摩根律把它改写为 $(A \\cup B)^{c}$。所以个数等于全集大小减去并集大小，而并集要用容斥原理求出。若 $|U| = 20$，$|A| = 8$，$|B| = 6$，$|A \\cap B| = 3$，则并集有 $8 + 6 - 3 = 11$ 个元素，所以两个集合之外有 $20 - 11 = 9$ 个。\n\n> **注意。** $|U| - |A| - |B|$ 把 $A \\cap B$ 的元素减了两次。应当减去用容斥原理求出的并集。",
  ],
  (rng) => {
    const both = rng.int(1, 15);
    const a = both + rng.int(1, 30);
    const b = both + rng.int(1, 30);
    const union = a + b - both;
    const outside = rng.int(1, 40);
    const U = union + outside;
    return withMistakes(
      ask(
        [
          `In a universe with $|U| = ${U}$, sets have $|A| = ${a}$, $|B| = ${b}$ and $|A \\cap B| = ${both}$. Find $|A^{c} \\cap B^{c}|$.`,
          `全集满足 $|U| = ${U}$，集合满足 $|A| = ${a}$，$|B| = ${b}$，$|A \\cap B| = ${both}$。求 $|A^{c} \\cap B^{c}|$。`,
        ],
        outside,
        [U - a - b, union, U - both],
        [
          `**Step 1: Apply De Morgan's law.** $A^{c} \\cap B^{c} = (A \\cup B)^{c}$.\n\n**Step 2: Find the union.** $|A \\cup B| = ${a} + ${b} - ${both} = ${union}$.\n\n**Step 3: Take the complement.** $|(A \\cup B)^{c}| = ${U} - ${union} = ${outside}$.\n\n**Check.** The four regions of the diagram fill $U$: $A$ only has $${a - both}$, $B$ only has $${b - both}$, both has $${both}$ and outside has $${outside}$, and $${a - both} + ${b - both} + ${both} + ${outside} = ${U}$.`,
          `**第一步：应用德摩根律。** $A^{c} \\cap B^{c} = (A \\cup B)^{c}$。\n\n**第二步：求并集。** $|A \\cup B| = ${a} + ${b} - ${both} = ${union}$。\n\n**第三步：取补集。** $|(A \\cup B)^{c}| = ${U} - ${union} = ${outside}$。\n\n**检验。** 图中四个区域合起来是 $U$：只属于 $A$ 的有 $${a - both}$ 个，只属于 $B$ 的有 $${b - both}$ 个，两者都属于的有 $${both}$ 个，两者之外的有 $${outside}$ 个，而 $${a - both} + ${b - both} + ${both} + ${outside} = ${U}$。`,
        ],
      ),
      [
        say(
          String(U - a - b),
          "That removes the elements of $A \\cap B$ twice, once with $A$ and once with $B$.",
          "这把 $A \\cap B$ 的元素减了两次：减 $A$ 时一次，减 $B$ 时一次。",
        ),
        say(
          String(union),
          "That is $|A \\cup B|$, the elements in at least one set; the elements outside both are asked for.",
          "这是 $|A \\cup B|$，即至少属于一个集合的元素；题目问的是两个集合之外的元素。",
        ),
        say(
          String(U - both),
          "That is $|(A \\cap B)^{c}|$, the elements missing at least one set; outside both means outside the union.",
          "这是 $|(A \\cap B)^{c}|$，即至少不属于一个集合的元素；两个集合之外是指在并集之外。",
        ),
      ],
    );
  },
);

const falseIdentity = point(
  "a-counterexample-to-a-set-identity",
  ["A counterexample to a set identity", "集合恒等式的反例"],
  [
    "A set identity that looks reasonable can still be false. An element chased through both sides reveals where the argument breaks, and one element in only one side is enough to disprove the equality. A true proof needs both inclusions, but a disproof needs only one failure. With $A = \\{1, 2\\}$ and $B = \\{2, 3\\}$, $(A \\cup B) \\setminus B = \\{1\\}$, which has lost the element $2$ of $A$.\n\n> **Watch out.** An element of $A$ outside $B$ passes through $(A \\cup B) \\setminus B$ unharmed. Only an element in both sets can break the claim, because removing $B$ removes it.",
    "看起来合理的集合恒等式仍可能不成立。追踪一个元素经过两边，就能看出论证在哪里失败，只要有一个元素只在一边，就足以否定等式。证明需要两个方向的包含，而否定只需一处不成立。取 $A = \\{1, 2\\}$，$B = \\{2, 3\\}$，则 $(A \\cup B) \\setminus B = \\{1\\}$，丢掉了 $A$ 的元素 $2$。\n\n> **注意。** $A$ 中不属于 $B$ 的元素经过 $(A \\cup B) \\setminus B$ 后仍然保留。只有同时属于两个集合的元素才会使等式不成立，因为去掉 $B$ 时它也被去掉了。",
  ],
  (rng) => {
    const values = rng.sample(
      [...Array(40).keys()].map((i) => i + 1),
      6,
    );
    const common = values[0] as number;
    const onlyA = [values[1], values[2]] as number[];
    const onlyB = [values[3], values[4]] as number[];
    const A = [common, ...onlyA].sort((x, y) => x - y);
    const B = [common, ...onlyB].sort((x, y) => x - y);
    const left = [...onlyA].sort((x, y) => x - y);
    const union = [...A, ...onlyB].sort((x, y) => x - y);
    return withMistakes(
      ask(
        [
          `Let $A = \\{${A.join(", ")}\\}$ and $B = \\{${B.join(", ")}\\}$. The claim $(A \\cup B) \\setminus B = A$ fails. Which element of $A$ is missing from the left side?`,
          `设 $A = \\{${A.join(", ")}\\}$，$B = \\{${B.join(", ")}\\}$。等式 $(A \\cup B) \\setminus B = A$ 不成立。$A$ 的哪个元素不在左边？`,
        ],
        common,
        [onlyA[0] as number, onlyB[0] as number, onlyA[1] as number],
        [
          `**Step 1: Form the union.** $A \\cup B = \\{${union.join(", ")}\\}$.\n\n**Step 2: Remove B.** Removing every element of $B$ leaves $(A \\cup B) \\setminus B = \\{${left.join(", ")}\\}$.\n\n**Step 3: Compare with A.** $A = \\{${A.join(", ")}\\}$ also has $${common}$, which the left side lacks.\n\n**Check.** Chase $${common}$: it is in $A \\cup B$, but it is also in $B$, so it is removed. Yet it is in $A$, so it lies in only one side of the claim.`,
          `**第一步：求并集。** $A \\cup B = \\{${union.join(", ")}\\}$。\n\n**第二步：去掉 B。** 去掉 $B$ 的每个元素，剩下 $(A \\cup B) \\setminus B = \\{${left.join(", ")}\\}$。\n\n**第三步：与 A 比较。** $A = \\{${A.join(", ")}\\}$ 还含有 $${common}$，而左边没有。\n\n**检验。** 追踪 $${common}$：它属于 $A \\cup B$，但也属于 $B$，所以被去掉了。而它属于 $A$，所以它只在等式的一边。`,
        ],
      ),
      [
        ...onlyA.map((x) =>
          say(
            String(x),
            `$${x}$ is in $A$ but not in $B$, so it stays in $(A \\cup B) \\setminus B$.`,
            `$${x}$ 属于 $A$ 但不属于 $B$，所以它留在 $(A \\cup B) \\setminus B$ 中。`,
          ),
        ),
        ...onlyB.map((x) =>
          say(String(x), `$${x}$ is not an element of $A$; the question asks for one.`, `$${x}$ 不是 $A$ 的元素；题目问的是 $A$ 的元素。`),
        ),
      ],
    );
  },
);

const threeSetDeMorgan = point(
  "de-morgans-laws-for-three-sets",
  ["De Morgan's laws for three sets", "三个集合的德摩根律"],
  [
    'De Morgan\'s laws extend to any number of sets, and the element argument is the same as for two. Being outside an intersection means missing at least one of the sets, and being outside a union means missing every one of them. With $A = \\{1, 2\\}$, $B = \\{2, 3\\}$ and $C = \\{4\\}$, the number $5$ is in none of them, so it is outside $A \\cup B \\cup C$; the number $2$ misses only $C$, which already puts it outside $A \\cap B \\cap C$.\n\n> **Watch out.** The complement of an intersection becomes an "or" and the complement of a union an "and", and every membership is negated as well.',
    "德摩根律可以推广到任意多个集合，元素论证与两个集合时相同。不在交集中意味着至少不属于其中一个集合，不在并集中意味着不属于其中每一个集合。取 $A = \\{1, 2\\}$，$B = \\{2, 3\\}$，$C = \\{4\\}$，数 $5$ 都不属于它们，所以在 $A \\cup B \\cup C$ 之外；数 $2$ 只不属于 $C$，这就已经使它在 $A \\cap B \\cap C$ 之外。\n\n> **注意。** 交集的补变成“或”，并集的补变成“且”，并且每个隶属关系也都要取否定。",
  ],
  (rng) => {
    const [a, b, c] = rng.sample(["A", "B", "C", "D", "E", "F"], 3) as [string, string, string];
    const isCap = rng.bool();
    const op = isCap ? "\\cap" : "\\cup";
    const set = `${a} ${op} ${b} ${op} ${c}`;
    const none = same(`x \\notin ${a},\\ x \\notin ${b}\\text{ and }x \\notin ${c}`);
    const atLeast = same(`x \\notin ${a},\\ x \\notin ${b}\\text{ or }x \\notin ${c}`);
    const inOne = same(`x \\in ${a},\\ x \\in ${b}\\text{ or }x \\in ${c}`);
    const inAll = same(`x \\in ${a},\\ x \\in ${b}\\text{ and }x \\in ${c}`);
    const right = isCap ? atLeast : none;
    const reasons: Reason[] = isCap
      ? [
          [
            none[0],
            `That says $x$ misses all three sets, which is being outside the union. To be outside the intersection, missing one set is enough.`,
            `这是说 $x$ 三个集合都不属于，即在并集之外。要在交集之外，只需不属于其中一个集合。`,
          ],
          [
            inOne[0],
            "An element in all three sets satisfies this, yet it is in the intersection, not in its complement.",
            "三个集合都属于的元素满足这一条，但它在交集中，不在其补集中。",
          ],
          [
            inAll[0],
            "That is membership in the intersection itself, the opposite of the complement.",
            "这是属于交集本身，与补集正好相反。",
          ],
        ]
      : [
          [
            atLeast[0],
            "Missing one set is not enough to be outside the union: $x$ could still be in the other two.",
            "只不属于一个集合，还不足以在并集之外：$x$ 仍可能属于另外两个。",
          ],
          [inOne[0], "That is membership in the union itself, the opposite of the complement.", "这是属于并集本身，与补集正好相反。"],
          [
            inAll[0],
            "That is membership in the intersection; an element outside the union is in none of the sets.",
            "这是属于交集；在并集之外的元素不属于任何一个集合。",
          ],
        ];
    return reasoned(
      choose(
        rng,
        [
          `In the proof of De Morgan's law for three sets, what does $x \\in (${set})^{c}$ mean?`,
          `在三个集合的德摩根律的证明中，$x \\in (${set})^{c}$ 是什么意思？`,
        ],
        right,
        [isCap ? none : atLeast, inOne, inAll],
        isCap
          ? [
              `**Step 1: Leave the complement.** $x \\in (${set})^{c}$ means $x \\notin ${set}$.\n\n**Step 2: Negate the membership.** Being in the intersection means $x \\in ${a}$, $x \\in ${b}$ and $x \\in ${c}$. Its negation, by De Morgan's law, is $x \\notin ${a}$, $x \\notin ${b}$ or $x \\notin ${c}$.\n\n**Check.** An element of $${a}$ and $${b}$ but not $${c}$ is outside $${set}$, and it satisfies the statement through $x \\notin ${c}$.`,
              `**第一步：去掉补集。** $x \\in (${set})^{c}$ 即 $x \\notin ${set}$。\n\n**第二步：否定隶属关系。** 属于交集是指 $x \\in ${a}$、$x \\in ${b}$ 且 $x \\in ${c}$。由德摩根律，它的否定是 $x \\notin ${a}$、$x \\notin ${b}$ 或 $x \\notin ${c}$。\n\n**检验。** 属于 $${a}$ 和 $${b}$ 但不属于 $${c}$ 的元素在 $${set}$ 之外，它通过 $x \\notin ${c}$ 满足这条命题。`,
            ]
          : [
              `**Step 1: Leave the complement.** $x \\in (${set})^{c}$ means $x \\notin ${set}$.\n\n**Step 2: Negate the membership.** Being in the union means $x \\in ${a}$, $x \\in ${b}$ or $x \\in ${c}$. Its negation, by De Morgan's law, is $x \\notin ${a}$, $x \\notin ${b}$ and $x \\notin ${c}$.\n\n**Check.** An element of $${a}$ only misses $${b}$ and $${c}$, yet it is in $${set}$, and indeed it fails the statement at $x \\notin ${a}$.`,
              `**第一步：去掉补集。** $x \\in (${set})^{c}$ 即 $x \\notin ${set}$。\n\n**第二步：否定隶属关系。** 属于并集是指 $x \\in ${a}$、$x \\in ${b}$ 或 $x \\in ${c}$。由德摩根律，它的否定是 $x \\notin ${a}$、$x \\notin ${b}$ 且 $x \\notin ${c}$。\n\n**检验。** 只属于 $${a}$ 的元素不属于 $${b}$ 和 $${c}$，但它在 $${set}$ 中；它也确实在 $x \\notin ${a}$ 处不满足这条命题。`,
            ],
      ),
      reasons,
    );
  },
);

/** Membership tells whether an element is in a set built from three sets, given whether it is in each of them. */
type Membership = (x: boolean, y: boolean, z: boolean) => boolean;

const differenceDistributes = point(
  "how-set-difference-distributes",
  ["How set difference distributes", "集合差如何分配"],
  [
    "Set difference distributes too, but the side matters. A union or intersection on the left of the minus sign keeps its operation. On the right, the operation flips, because removing a union means satisfying two conditions of not belonging. With $A = \\{1, 2, 3\\}$, $B = \\{1\\}$ and $C = \\{2\\}$, $A \\setminus (B \\cup C) = \\{3\\}$, and $(A \\setminus B) \\cap (A \\setminus C) = \\{2, 3\\} \\cap \\{1, 3\\} = \\{3\\}$.\n\n> **Watch out.** Only an operation on the right of the minus sign flips. The set on the left is kept in every difference: $A \\setminus (B \\cup C)$ is not $(A \\setminus B) \\cup C$.",
    "集合差也能分配，但要看在哪一边。减号左边的并或交保持原来的运算。在右边，运算要翻转，因为去掉一个并集意味着要同时满足两个不属于的条件。取 $A = \\{1, 2, 3\\}$，$B = \\{1\\}$，$C = \\{2\\}$，则 $A \\setminus (B \\cup C) = \\{3\\}$，而 $(A \\setminus B) \\cap (A \\setminus C) = \\{2, 3\\} \\cap \\{1, 3\\} = \\{3\\}$。\n\n> **注意。** 只有减号右边的运算才翻转。左边的集合在每个差中都要保留：$A \\setminus (B \\cup C)$ 不是 $(A \\setminus B) \\cup C$。",
  ],
  (rng) => {
    const [a, b, c] = rng.sample(["A", "B", "C", "D", "E", "F"], 3) as [string, string, string];
    const d = (x: string, y: string) => `(${x} \\setminus ${y})`;
    const kind = rng.int(0, 3);
    const [start, startIn, right, wrong, unpack, regroup] = (
      [
        [
          `${a} \\setminus (${b} \\cup ${c})`,
          (x, y, z) => x && !y && !z,
          `${d(a, b)} \\cap ${d(a, c)}`,
          [
            [`${d(a, b)} \\cup ${d(a, c)}`, (x, y, z) => x && (!y || !z)],
            [`${d(a, b)} \\cup ${c}`, (x, y, z) => (x && !y) || z],
            [`${a} \\setminus (${b} \\cap ${c})`, (x, y, z) => x && !(y && z)],
          ],
          [
            `$x \\in ${a}$ and $x \\notin ${b} \\cup ${c}$, that is $x \\in ${a}$, $x \\notin ${b}$ and $x \\notin ${c}$`,
            `$x \\in ${a}$ 且 $x \\notin ${b} \\cup ${c}$，即 $x \\in ${a}$、$x \\notin ${b}$ 且 $x \\notin ${c}$`,
          ],
          [
            `$x \\in ${a} \\setminus ${b}$ and $x \\in ${a} \\setminus ${c}$`,
            `$x \\in ${a} \\setminus ${b}$ 且 $x \\in ${a} \\setminus ${c}$`,
          ],
        ],
        [
          `${a} \\setminus (${b} \\cap ${c})`,
          (x, y, z) => x && !(y && z),
          `${d(a, b)} \\cup ${d(a, c)}`,
          [
            [`${d(a, b)} \\cap ${d(a, c)}`, (x, y, z) => x && !y && !z],
            [`${d(a, b)} \\cap ${c}`, (x, y, z) => x && !y && z],
            [`${a} \\setminus (${b} \\cup ${c})`, (x, y, z) => x && !y && !z],
          ],
          [
            `$x \\in ${a}$ and $x \\notin ${b} \\cap ${c}$, that is $x \\in ${a}$ and ($x \\notin ${b}$ or $x \\notin ${c}$)`,
            `$x \\in ${a}$ 且 $x \\notin ${b} \\cap ${c}$，即 $x \\in ${a}$ 且（$x \\notin ${b}$ 或 $x \\notin ${c}$）`,
          ],
          [
            `$x \\in ${a} \\setminus ${b}$ or $x \\in ${a} \\setminus ${c}$`,
            `$x \\in ${a} \\setminus ${b}$ 或 $x \\in ${a} \\setminus ${c}$`,
          ],
        ],
        [
          `(${a} \\cup ${b}) \\setminus ${c}`,
          (x, y, z) => (x || y) && !z,
          `${d(a, c)} \\cup ${d(b, c)}`,
          [
            [`${d(a, c)} \\cap ${d(b, c)}`, (x, y, z) => x && y && !z],
            [`${a} \\cup ${d(b, c)}`, (x, y, z) => x || (y && !z)],
            [`(${a} \\cap ${b}) \\setminus ${c}`, (x, y, z) => x && y && !z],
          ],
          [`($x \\in ${a}$ or $x \\in ${b}$) and $x \\notin ${c}$`, `（$x \\in ${a}$ 或 $x \\in ${b}$）且 $x \\notin ${c}$`],
          [
            `$x \\in ${a} \\setminus ${c}$ or $x \\in ${b} \\setminus ${c}$`,
            `$x \\in ${a} \\setminus ${c}$ 或 $x \\in ${b} \\setminus ${c}$`,
          ],
        ],
        [
          `(${a} \\cap ${b}) \\setminus ${c}`,
          (x, y, z) => x && y && !z,
          `${d(a, c)} \\cap ${d(b, c)}`,
          [
            [`${d(a, c)} \\cup ${d(b, c)}`, (x, y, z) => (x || y) && !z],
            [`${d(a, b)} \\cap ${c}`, (x, y, z) => x && !y && z],
            [`(${a} \\cup ${b}) \\setminus ${c}`, (x, y, z) => (x || y) && !z],
          ],
          [`$x \\in ${a}$, $x \\in ${b}$ and $x \\notin ${c}$`, `$x \\in ${a}$、$x \\in ${b}$ 且 $x \\notin ${c}$`],
          [
            `$x \\in ${a} \\setminus ${c}$ and $x \\in ${b} \\setminus ${c}$`,
            `$x \\in ${a} \\setminus ${c}$ 且 $x \\in ${b} \\setminus ${c}$`,
          ],
        ],
      ] as [string, Membership, string, [string, Membership][], Pair, Pair][]
    )[kind] as [string, Membership, string, [string, Membership][], Pair, Pair];
    const onRight = kind < 2;
    const bits = [false, true];
    const kinds = bits.flatMap((x) => bits.flatMap((y) => bits.map((z) => [x, y, z] as const)));
    const rel = (inside: boolean, s: string) => `x ${inside ? "\\in" : "\\notin"} ${s}`;
    const reasons = wrong.map(([w, wIn]): Reason => {
      const [x, y, z] = kinds.find(([p, q, r]) => wIn(p, q, r) !== startIn(p, q, r)) as readonly [boolean, boolean, boolean];
      const pattern = `$${rel(x, a)}$, $${rel(y, b)}$, $${rel(z, c)}$`;
      const patternZh = `$${rel(x, a)}$、$${rel(y, b)}$、$${rel(z, c)}$`;
      const inStart = startIn(x, y, z);
      return [
        `$${w}$`,
        `An element with ${pattern} is ${inStart ? "in" : "not in"} $${start}$ but ${inStart ? "not in" : "in"} $${w}$, so the two sets differ.`,
        `满足${patternZh}的元素${inStart ? "属于" : "不属于"} $${start}$，却${inStart ? "不属于" : "属于"} $${w}$，所以两个集合不同。`,
      ];
    });
    // Sets in which every way of belonging to the three sets occurs once.
    const U = [1, 2, 3, 4, 5, 6, 7, 8];
    const at = (n: number) => [(n - 1) % 2 === 1, Math.floor((n - 1) / 2) % 2 === 1, Math.floor((n - 1) / 4) % 2 === 1] as const;
    const list = (f: Membership) => `\\{${U.filter((n) => f(...at(n))).join(", ")}\\}`;
    const given = `${a} = \\{2, 4, 6, 8\\}, ${b} = \\{3, 4, 7, 8\\}, ${c} = \\{5, 6, 7, 8\\}`;
    return reasoned(
      choose(
        rng,
        [`Which set equals $${start}$ for all sets?`, `对所有集合，哪个集合等于 $${start}$？`],
        same(right),
        wrong.map(([w]) => same(w)),
        [
          `**Step 1: Unpack the membership.** $x \\in ${start}$ means ${unpack[0]}.\n\n**Step 2: Regroup it.** ${onRight ? "The operation on the right of the difference flips" : "The operation on the left of the difference stays"}: ${regroup[0]}, so the set is $${right}$.\n\n**Check.** With $${given}$, both $${start}$ and $${right}$ are $${list(startIn)}$.`,
          `**第一步：展开隶属关系。** $x \\in ${start}$ 即${unpack[1]}。\n\n**第二步：重新组合。** ${onRight ? "差的右边的运算要翻转" : "差的左边的运算保持不变"}：${regroup[1]}，所以这个集合是 $${right}$。\n\n**检验。** 取 $${given}$，$${start}$ 与 $${right}$ 都等于 $${list(startIn)}$。`,
        ],
      ),
      reasons,
    );
  },
);

const productUnionSize = point(
  "the-product-with-a-union-from-given-products",
  ["The product with a union from given products", "由已知乘积求与并集的乘积"],
  [
    "Since $A \\times (B \\cup C) = (A \\times B) \\cup (A \\times C)$ and the two products overlap in $A \\times (B \\cap C)$, inclusion and exclusion applies to the products themselves. Simply adding the two products would count the overlap twice. With $|A \\times B| = 6$, $|A \\times C| = 4$ and $|A \\times (B \\cap C)| = 2$, $|A \\times (B \\cup C)| = 6 + 4 - 2 = 8$.\n\n> **Watch out.** Subtract the overlap $A \\times (B \\cap C)$ once; adding it, or leaving it in, counts its pairs wrongly. Sizes of unions come from inclusion and exclusion, not from multiplying the given sizes.",
    "由于 $A \\times (B \\cup C) = (A \\times B) \\cup (A \\times C)$，且两个乘积的重叠部分是 $A \\times (B \\cap C)$，所以容斥原理可以直接用于乘积。简单地把两个乘积相加，会把重叠部分计算两次。若 $|A \\times B| = 6$，$|A \\times C| = 4$，$|A \\times (B \\cap C)| = 2$，则 $|A \\times (B \\cup C)| = 6 + 4 - 2 = 8$。\n\n> **注意。** 重叠部分 $A \\times (B \\cap C)$ 要减去一次；把它加上或不减，都会算错它的有序对。并集的大小用容斥原理求，不是把已知的大小相乘。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const i = rng.int(1, 6);
    const b = i + rng.int(1, 6);
    const c = i + rng.int(1, 6);
    const answer = a * (b + c - i);
    return withMistakes(
      ask(
        [
          `Sets satisfy $|A \\times B| = ${a * b}$, $|A \\times C| = ${a * c}$ and $|A \\times (B \\cap C)| = ${a * i}$. Find $|A \\times (B \\cup C)|$.`,
          `集合满足 $|A \\times B| = ${a * b}$，$|A \\times C| = ${a * c}$，$|A \\times (B \\cap C)| = ${a * i}$。求 $|A \\times (B \\cup C)|$。`,
        ],
        answer,
        [a * (b + c), a * (b + c) + a * i, a * b * c],
        [
          `**Step 1: Distribute.** $A \\times (B \\cup C) = (A \\times B) \\cup (A \\times C)$.\n\n**Step 2: Find the overlap.** $(A \\times B) \\cap (A \\times C) = A \\times (B \\cap C)$, with $${a * i}$ pairs.\n\n**Step 3: Apply inclusion and exclusion.** $${a * b} + ${a * c} - ${a * i} = ${answer}$.\n\n**Check.** Split into products that do not overlap: $A \\times (B \\setminus C)$ has $${a * b} - ${a * i} = ${a * (b - i)}$ pairs, $A \\times (C \\setminus B)$ has $${a * c} - ${a * i} = ${a * (c - i)}$, and $A \\times (B \\cap C)$ has $${a * i}$. Together $${a * (b - i)} + ${a * (c - i)} + ${a * i} = ${answer}$.`,
          `**第一步：分配。** $A \\times (B \\cup C) = (A \\times B) \\cup (A \\times C)$。\n\n**第二步：找出重叠部分。** $(A \\times B) \\cap (A \\times C) = A \\times (B \\cap C)$，有 $${a * i}$ 个有序对。\n\n**第三步：应用容斥原理。** $${a * b} + ${a * c} - ${a * i} = ${answer}$。\n\n**检验。** 拆成互不重叠的乘积：$A \\times (B \\setminus C)$ 有 $${a * b} - ${a * i} = ${a * (b - i)}$ 个有序对，$A \\times (C \\setminus B)$ 有 $${a * c} - ${a * i} = ${a * (c - i)}$ 个，$A \\times (B \\cap C)$ 有 $${a * i}$ 个。合计 $${a * (b - i)} + ${a * (c - i)} + ${a * i} = ${answer}$。`,
        ],
      ),
      [
        say(
          String(a * (b + c)),
          "That adds the two products, which counts the pairs of $A \\times (B \\cap C)$ twice.",
          "这把两个乘积相加，$A \\times (B \\cap C)$ 的有序对被算了两次。",
        ),
        say(String(a * (b + c) + a * i), "That adds the overlap instead of subtracting it.", "这把重叠部分加上了，而不是减去。"),
        say(
          String(a * b * c),
          "That multiplies the given sizes; the size of a union comes from inclusion and exclusion.",
          "这是把已知的大小相乘；并集的大小要用容斥原理求。",
        ),
      ],
    );
  },
);

const squareResidue = point(
  "a-direct-proof-with-a-remainder",
  ["A direct proof with a remainder", "带余数的直接证明"],
  [
    "A direct proof about remainders starts by writing $n = mk + r$. Expanding gives $n^{2} = m(mk^{2} + 2kr) + r^{2}$, so the remainder of $n^{2}$ depends only on $r^{2}$, which may still need reducing because it can be larger than $m$. If $n$ leaves $3$ on division by $5$, then $n^{2} = 5(5k^{2} + 6k) + 9$ and $9 = 5 + 4$, so $n^{2}$ leaves $4$.\n\n> **Watch out.** $r^{2}$ is not yet the remainder when it is $m$ or more: reduce it modulo $m$ as a last step.",
    "关于余数的直接证明从写出 $n = mk + r$ 开始。展开得 $n^{2} = m(mk^{2} + 2kr) + r^{2}$，所以 $n^{2}$ 的余数只取决于 $r^{2}$，而 $r^{2}$ 可能大于 $m$，这时还需要继续化简。若 $n$ 除以 $5$ 余 $3$，则 $n^{2} = 5(5k^{2} + 6k) + 9$，而 $9 = 5 + 4$，所以 $n^{2}$ 余 $4$。\n\n> **注意。** 当 $r^{2}$ 不小于 $m$ 时，它还不是余数：最后一步要把它模 $m$ 化简。",
  ],
  (rng) => {
    const m = rng.int(3, 15);
    const r = rng.int(1, m - 1);
    const answer = (r * r) % m;
    const big = (m + r) ** 2;
    return withMistakes(
      ask(
        [
          `Suppose $n$ leaves remainder $${r}$ on division by $${m}$. A direct proof shows that $n^{2}$ always leaves the same remainder on division by $${m}$. What is it?`,
          `设 $n$ 除以 $${m}$ 余 $${r}$。直接证明可以说明 $n^{2}$ 除以 $${m}$ 的余数总是相同的。这个余数是多少？`,
        ],
        answer,
        [r, r * r, (2 * r) % m],
        [
          `**Step 1: Write n with its remainder.** $n = ${m}k + ${r}$.\n\n**Step 2: Square.** $n^{2} = ${m}(${m}k^{2} + ${2 * r}k) + ${r * r}$.\n\n**Step 3: Reduce.** $${r * r} = ${m} \\cdot ${Math.floor((r * r) / m)} + ${answer}$, so $n^{2}$ leaves $${answer}$.\n\n**Check.** Take $n = ${m + r}$: $n^{2} = ${big} = ${m} \\cdot ${Math.floor(big / m)} + ${big % m}$.`,
          `**第一步：写出 n 与余数。** $n = ${m}k + ${r}$。\n\n**第二步：平方。** $n^{2} = ${m}(${m}k^{2} + ${2 * r}k) + ${r * r}$。\n\n**第三步：化简。** $${r * r} = ${m} \\cdot ${Math.floor((r * r) / m)} + ${answer}$，所以 $n^{2}$ 余 $${answer}$。\n\n**检验。** 取 $n = ${m + r}$：$n^{2} = ${big} = ${m} \\cdot ${Math.floor(big / m)} + ${big % m}$。`,
        ],
      ),
      [
        say(String(r), "That is the remainder of $n$; the question asks about $n^{2}$.", "这是 $n$ 的余数；题目问的是 $n^{2}$。"),
        say(
          String(r * r),
          `$${r * r}$ is at least $${m}$, so it still has to be reduced modulo $${m}$.`,
          `$${r * r}$ 不小于 $${m}$，还要模 $${m}$ 化简。`,
        ),
        say(String((2 * r) % m), "That doubles the remainder; squaring multiplies it by itself.", "这是把余数乘以 2；平方是把它乘以自身。"),
      ],
    );
  },
);

const smallestCounterexample = point(
  "the-smallest-counterexample-to-a-divisibility-claim",
  ["The smallest counterexample to a divisibility claim", "整除命题的最小反例"],
  [
    'The claim that divisibility by $a$ and $b$ implies divisibility by $ab$ holds only when $a$ and $b$ are coprime. If they share a factor, their least common multiple is divisible by both but not by the product, so it is the smallest counterexample. For "if $4 \\mid n$ and $6 \\mid n$, then $24 \\mid n$", $n = 12$ is divisible by $4$ and $6$ but not by $24$.\n\n> **Watch out.** A counterexample must satisfy the hypothesis, so it is a common multiple of $a$ and $b$. The smallest one is the least common multiple, not the greatest common divisor.',
    "“能被 $a$ 和 $b$ 整除就能被 $ab$ 整除”只在 $a$ 与 $b$ 互素时成立。如果它们有公因数，它们的最小公倍数能被两者整除，却不能被乘积整除，所以它是最小的反例。对“如果 $4 \\mid n$ 且 $6 \\mid n$，那么 $24 \\mid n$”，$n = 12$ 能被 $4$ 和 $6$ 整除，却不能被 $24$ 整除。\n\n> **注意。** 反例必须满足假设，所以它是 $a$ 和 $b$ 的公倍数。最小的是最小公倍数，而不是最大公因数。",
  ],
  (rng) => {
    const g = rng.int(2, 6);
    const x = rng.int(1, 7);
    let y = rng.int(1, 7);
    if (y === x) y = x + 1;
    const a = g * x;
    const b = g * y;
    const answer = lcm(a, b);
    const d = gcd(a, b);
    return withMistakes(
      ask(
        [
          `Find the smallest positive integer $n$ that disproves the claim "if $${a} \\mid n$ and $${b} \\mid n$, then $${a * b} \\mid n$".`,
          `求能否定命题“如果 $${a} \\mid n$ 且 $${b} \\mid n$，那么 $${a * b} \\mid n$”的最小正整数 $n$。`,
        ],
        answer,
        [a * b, d, a + b],
        [
          `**Step 1: Meet the hypothesis.** A counterexample must be a common multiple of $${a}$ and $${b}$.\n\n**Step 2: Take the smallest.** $\\operatorname{lcm}(${a}, ${b}) = ${a * b} / ${d} = ${answer}$.\n\n**Step 3: Break the conclusion.** $${answer} < ${a * b}$, so $${a * b} \\nmid ${answer}$.\n\n**Check.** $${answer} = ${a} \\cdot ${answer / a} = ${b} \\cdot ${answer / b}$, while $${a * b} = ${answer} \\cdot ${d}$.`,
          `**第一步：满足假设。** 反例必须是 $${a}$ 和 $${b}$ 的公倍数。\n\n**第二步：取最小的。** $\\operatorname{lcm}(${a}, ${b}) = ${a * b} / ${d} = ${answer}$。\n\n**第三步：推翻结论。** $${answer} < ${a * b}$，所以 $${a * b} \\nmid ${answer}$。\n\n**检验。** $${answer} = ${a} \\cdot ${answer / a} = ${b} \\cdot ${answer / b}$，而 $${a * b} = ${answer} \\cdot ${d}$。`,
        ],
      ),
      [
        say(String(a * b), `$${a * b}$ divides itself, so the claim holds there.`, `$${a * b}$ 能整除自身，所以命题在这里成立。`),
        say(
          String(d),
          `$${d}$ is not a multiple of $${a}$ and $${b}$, so the hypothesis fails there.`,
          `$${d}$ 不是 $${a}$ 和 $${b}$ 的倍数，所以假设在这里不成立。`,
        ),
        say(String(a + b), `$${a + b}$ is not a common multiple of $${a}$ and $${b}$.`, `$${a + b}$ 不是 $${a}$ 和 $${b}$ 的公倍数。`),
      ],
    );
  },
);

const threeThreshold = point(
  "a-threshold-for-three-numbers-by-contrapositive",
  ["A threshold for three numbers by contrapositive", "用逆否命题求三个数的阈值"],
  [
    "A claim of the form if the sum is large, then some number is large is proved by contrapositive: if every integer is below its bound, then the sum is at most the sum of the largest allowed values. One more than this maximum is the smallest threshold that works. For bounds $a \\ge 2$, $b \\ge 3$, $c \\ge 4$: the contrapositive allows $a \\le 1$, $b \\le 2$, $c \\le 3$, a sum of at most $6$, so $S = 7$.\n\n> **Watch out.** Below the bound means one less: $a < p$ is $a \\le p - 1$. The largest bad sum is $(p - 1) + (q - 1) + (r - 1)$, and the threshold is one more than that.",
    "“如果和很大，那么某个数很大”这种命题用逆否命题证明：如果每个整数都低于它的界，那么和至多为各允许最大值之和。比这个最大值多一就是有效的最小阈值。对于界 $a \\ge 2$，$b \\ge 3$，$c \\ge 4$：逆否命题允许 $a \\le 1$，$b \\le 2$，$c \\le 3$，和至多为 $6$，所以 $S = 7$。\n\n> **注意。** 低于界就是少一：$a < p$ 即 $a \\le p - 1$。不满足结论的最大和是 $(p - 1) + (q - 1) + (r - 1)$，阈值比它多一。",
  ],
  (rng) => {
    const p = rng.int(2, 15);
    const q = rng.int(2, 15);
    const r = rng.int(2, 15);
    const most = p + q + r - 3;
    const answer = most + 1;
    return withMistakes(
      ask(
        [
          `Find the smallest integer $S$ such that, for all integers $a, b, c$, if $a + b + c \\ge S$ then $a \\ge ${p}$ or $b \\ge ${q}$ or $c \\ge ${r}$.`,
          `求最小的整数 $S$，使得对所有整数 $a, b, c$，如果 $a + b + c \\ge S$，那么 $a \\ge ${p}$ 或 $b \\ge ${q}$ 或 $c \\ge ${r}$。`,
        ],
        answer,
        [most, p + q + r, p + q + r - 1],
        [
          `**Step 1: Take the contrapositive.** If $a \\le ${p - 1}$, $b \\le ${q - 1}$ and $c \\le ${r - 1}$, then $a + b + c < S$.\n\n**Step 2: Find the largest bad sum.** $${p - 1} + ${q - 1} + ${r - 1} = ${most}$, reached at $a = ${p - 1}, b = ${q - 1}, c = ${r - 1}$.\n\n**Step 3: Add one.** $S$ must exceed $${most}$, so the smallest threshold is $${answer}$.\n\n**Check.** At $(${p - 1}, ${q - 1}, ${r - 1})$ the sum is $${most} < ${answer}$ and no bound is met; raising any one number by $1$ makes the sum $${answer}$ and meets its bound.`,
          `**第一步：取逆否命题。** 如果 $a \\le ${p - 1}$，$b \\le ${q - 1}$，$c \\le ${r - 1}$，那么 $a + b + c < S$。\n\n**第二步：找出不满足结论的最大和。** $${p - 1} + ${q - 1} + ${r - 1} = ${most}$，在 $a = ${p - 1}, b = ${q - 1}, c = ${r - 1}$ 处取到。\n\n**第三步：加一。** $S$ 必须大于 $${most}$，所以最小的阈值是 $${answer}$。\n\n**检验。** 在 $(${p - 1}, ${q - 1}, ${r - 1})$ 处和为 $${most} < ${answer}$，且没有达到任何界；任意一个数加 $1$ 后和为 $${answer}$，并达到它的界。`,
        ],
      ),
      [
        say(
          String(most),
          `At $a = ${p - 1}, b = ${q - 1}, c = ${r - 1}$ the sum is $${most}$, yet no bound is met.`,
          `在 $a = ${p - 1}, b = ${q - 1}, c = ${r - 1}$ 处和为 $${most}$，却没有达到任何界。`,
        ),
        say(
          String(p + q + r),
          `That threshold works but is not the smallest: every bound is one more than the largest value allowed below it.`,
          `这个阈值可行但不是最小的：每个界都比它下面允许的最大值大一。`,
        ),
        say(
          String(p + q + r - 1),
          `That threshold works but is not the smallest: the largest bad sum is $${most}$.`,
          `这个阈值可行但不是最小的：不满足结论的最大和是 $${most}$。`,
        ),
      ],
    );
  },
);

const parityVerdict = point(
  "deciding-a-parity-claim-by-the-coefficients",
  ["Deciding a parity claim by the coefficients", "由系数判断奇偶性命题"],
  [
    'Not every parity claim is true, and the coefficients decide it. Test the contrapositive by substituting an odd $n$: only the parities of the coefficients matter. If the result can be odd, then $n = 1$ gives a counterexample to the claim. "If $3n + 5$ is odd, then $n$ is even" is true, since an odd $n$ makes $3n + 5$ odd plus odd, which is even. "If $3n + 4$ is odd, then $n$ is even" is false: $n = 1$ gives $7$.\n\n> **Watch out.** A counterexample must make the conclusion false, so it needs an odd $n$. An even $n$ such as $n = 2$ agrees with the conclusion "$n$ is even" and can never disprove the claim.',
    "并非每个奇偶性命题都成立，要由系数决定。代入奇数 $n$ 来检验逆否命题：只有系数的奇偶性起作用。如果结果可能为奇数，那么 $n = 1$ 就是这个命题的反例。“如果 $3n + 5$ 是奇数，那么 $n$ 是偶数”成立，因为奇数 $n$ 使 $3n + 5$ 成为奇数加奇数，是偶数。“如果 $3n + 4$ 是奇数，那么 $n$ 是偶数”不成立：$n = 1$ 时得 $7$。\n\n> **注意。** 反例必须使结论为假，所以需要奇数 $n$。像 $n = 2$ 这样的偶数满足结论“$n$ 是偶数”，永远不能否定这个命题。",
  ],
  (rng) => {
    const kind = rng.int(0, 2);
    const a = kind === 2 ? 2 * rng.int(1, 9) : 2 * rng.int(1, 9) + 1;
    const b = kind === 1 ? 2 * rng.int(1, 9) : 2 * rng.int(1, 9) + 1;
    const expr = poly([a, "n"], [b, ""]);
    const right: Pair = [`True: if $n$ is odd, then $${expr}$ is even`, `成立：如果 $n$ 是奇数，那么 $${expr}$ 是偶数`];
    const converse: Pair = [`True: if $n$ is even, then $${expr}$ is odd`, `成立：如果 $n$ 是偶数，那么 $${expr}$ 是奇数`];
    const one: Pair = ["False: $n = 1$ is a counterexample", "不成立：$n = 1$ 是反例"];
    const two: Pair = ["False: $n = 2$ is a counterexample", "不成立：$n = 2$ 是反例"];
    const option = kind === 0 ? right : one;
    const parity = (x: number) => (x % 2 === 0 ? ["even", "偶数"] : ["odd", "奇数"]);
    const [aEn, aZh] = parity(a);
    const [bEn, bZh] = parity(b);
    const reasons: Reason[] = [
      [converse[0], "That is the converse of the claim, which is not equivalent to it.", "这是原命题的逆命题，与原命题不等价。"],
      [
        two[0],
        "$n = 2$ is even, so it agrees with the conclusion and cannot be a counterexample.",
        "$n = 2$ 是偶数，满足结论，不可能是反例。",
      ],
      kind === 0
        ? [
            one[0],
            `At $n = 1$ the expression is $${a + b}$, which is even, so the hypothesis fails there.`,
            `$n = 1$ 时表达式等于 $${a + b}$，是偶数，所以假设在这里不成立。`,
          ]
        : [
            right[0],
            `At $n = 1$, which is odd, the expression is $${a + b}$, which is odd.`,
            `$n = 1$ 是奇数，此时表达式等于 $${a + b}$，是奇数。`,
          ],
    ];
    return reasoned(
      choose(
        rng,
        [`Decide the claim "if $${expr}$ is odd, then $n$ is even".`, `判断命题“如果 $${expr}$ 是奇数，那么 $n$ 是偶数”。`],
        option,
        [right, converse, one, two].filter((o) => o !== option),
        kind === 0
          ? [
              `**Step 1: Take the contrapositive.** If $n$ is odd, then $${expr}$ is even.\n\n**Step 2: Substitute an odd n.** $${a}n$ is odd times odd, which is odd, and adding the odd $${b}$ gives an even number. So the claim is true.\n\n**Check.** $n = 1$ gives $${a + b}$ and $n = 3$ gives $${3 * a + b}$, both even.`,
              `**第一步：取逆否命题。** 如果 $n$ 是奇数，那么 $${expr}$ 是偶数。\n\n**第二步：代入奇数 n。** $${a}n$ 是奇数乘奇数，是奇数，加上奇数 $${b}$ 得偶数。所以命题成立。\n\n**检验。** $n = 1$ 得 $${a + b}$，$n = 3$ 得 $${3 * a + b}$，都是偶数。`,
            ]
          : [
              `**Step 1: Take the contrapositive.** The claim is true only if every odd $n$ makes $${expr}$ even.\n\n**Step 2: Substitute an odd n.** $${a}$ is ${aEn} and $${b}$ is ${bEn}, so for odd $n$ the expression is odd. At $n = 1$ it is $${a + b}$. So the claim is false, and $n = 1$ is a counterexample.\n\n**Check.** At $n = 1$ the hypothesis holds, since $${a + b}$ is odd, and the conclusion fails, since $1$ is odd.`,
              `**第一步：取逆否命题。** 只有每个奇数 $n$ 都使 $${expr}$ 为偶数，命题才成立。\n\n**第二步：代入奇数 n。** $${a}$ 是${aZh}，$${b}$ 是${bZh}，所以 $n$ 为奇数时表达式是奇数。$n = 1$ 时它等于 $${a + b}$。所以命题不成立，$n = 1$ 是反例。\n\n**检验。** $n = 1$ 时假设成立，因为 $${a + b}$ 是奇数；结论不成立，因为 $1$ 是奇数。`,
            ],
      ),
      reasons,
    );
  },
);

const bothIndivisible = point(
  "when-two-non-multiples-add-to-a-multiple",
  ["When two non-multiples add to a multiple", "两个非倍数之和成为倍数"],
  [
    "A contradiction proof shows that a multiple plus a non-multiple is never a multiple. The same conclusion fails when both terms are non-multiples, because their remainders can add up to the divisor. So the hypothesis that one term is a multiple cannot be dropped. With divisor $5$ and $a = 7$, which leaves $2$, the choice $b = 3$ leaves $3$, and $7 + 3 = 10$.\n\n> **Watch out.** $b$ must supply the missing part of the divisor: if $a$ leaves $r$, then $b$ must leave $d - r$, not $r$.",
    "反证法说明倍数加非倍数永远不是倍数。当两项都是非倍数时，这个结论不成立，因为它们的余数相加可能等于除数。所以“有一项是倍数”这个假设不能去掉。除数为 $5$，$a = 7$ 余 $2$，取 $b = 3$ 余 $3$，而 $7 + 3 = 10$。\n\n> **注意。** $b$ 必须补足除数缺少的部分：若 $a$ 余 $r$，则 $b$ 必须余 $d - r$，而不是 $r$。",
  ],
  (rng) => {
    const d = rng.int(3, 13);
    const a = d * rng.int(1, 9) + rng.int(1, d - 1);
    const r = a % d;
    const answer = d - r;
    return withMistakes(
      ask(
        [
          `The claim "if $${d} \\nmid a$ and $${d} \\nmid b$, then $${d} \\nmid a + b$" is false. For $a = ${a}$, find the smallest positive $b$ that shows this.`,
          `命题“如果 $${d} \\nmid a$ 且 $${d} \\nmid b$，那么 $${d} \\nmid a + b$”不成立。对 $a = ${a}$，求能说明这一点的最小正整数 $b$。`,
        ],
        answer,
        [r, d, a],
        [
          `**Step 1: Find the remainder of a.** $${a} = ${d} \\cdot ${Math.floor(a / d)} + ${r}$.\n\n**Step 2: Complete the divisor.** $b$ must leave $${d} - ${r} = ${answer}$, so that the remainders add up to $${d}$.\n\n**Step 3: Take the smallest.** $b = ${answer}$, which is not a multiple of $${d}$, so it meets the hypothesis.\n\n**Check.** $${a} + ${answer} = ${a + answer} = ${d} \\cdot ${(a + answer) / d}$.`,
          `**第一步：求 a 的余数。** $${a} = ${d} \\cdot ${Math.floor(a / d)} + ${r}$。\n\n**第二步：补足除数。** $b$ 必须余 $${d} - ${r} = ${answer}$，使两个余数之和为 $${d}$。\n\n**第三步：取最小的。** $b = ${answer}$，它不是 $${d}$ 的倍数，所以满足假设。\n\n**检验。** $${a} + ${answer} = ${a + answer} = ${d} \\cdot ${(a + answer) / d}$。`,
        ],
      ),
      [
        say(
          String(r),
          `Then $a + b$ leaves $${(2 * r) % d}$, not $0$: $b$ must leave $${d} - ${r}$, not $${r}$.`,
          `这时 $a + b$ 余 $${(2 * r) % d}$，不是 $0$：$b$ 必须余 $${d} - ${r}$，而不是 $${r}$。`,
        ),
        say(
          String(d),
          `$${d}$ is a multiple of $${d}$, so it breaks the hypothesis $${d} \\nmid b$.`,
          `$${d}$ 是 $${d}$ 的倍数，不满足假设 $${d} \\nmid b$。`,
        ),
        say(
          String(a),
          (2 * r) % d === 0
            ? `$b = ${a}$ works, but a smaller $b$ does too.`
            : `$${a} + ${a} = ${2 * a}$ leaves $${(2 * r) % d}$ on division by $${d}$.`,
          (2 * r) % d === 0 ? `$b = ${a}$ 可行，但更小的 $b$ 也可行。` : `$${a} + ${a} = ${2 * a}$ 除以 $${d}$ 余 $${(2 * r) % d}$。`,
        ),
      ],
    );
  },
);

/** deeperMethodsOfProofThirdPoints maps topics of Methods of Proof, on logic, set operations and basic proof techniques, to a third knowledge point. */
export const deeperMethodsOfProofThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-and-and-or-connectives": [countTrueRows],
  "the-not-connective": [negatingBetween],
  "logical-associative-and-commutative-laws": [mixedGrouping],
  "the-absorption-laws": [spottingAbsorption],
  "tautologies-and-contradictions": [falsifyingRows],
  "the-not-connective-with-predicates": [negatedConjunctionSet],
  "grammatical-constructions-for-conditional-statements": [necessarySufficient],
  "negating-quantified-statements": [nestedNegation],
  "formal-and-informal-language": [quantifierOrder],
  "prenex-normal-form": [prenexRename],
  "implication-elimination-and-denying-the-consequent": [chainStatus],
  "additional-rules-of-logical-inference": [combiningRules],
  "elementary-properties-of-set-operations": [outsideBoth],
  "proving-elementary-properties-of-set-operations": [falseIdentity],
  "proving-de-morgans-laws-for-sets": [threeSetDeMorgan],
  "proving-distributive-properties-of-union-and-intersection": [differenceDistributes],
  "proving-distributive-properties-of-the-cartesian-product": [productUnionSize],
  "direct-proof": [squareResidue],
  "disproving-implications": [smallestCounterexample],
  "proof-by-contrapositive": [threeThreshold],
  "proving-parity-by-contrapositive": [parityVerdict],
  "proving-divisibility-by-contradiction": [bothIndivisible],
};
