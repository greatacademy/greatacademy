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
    "The truth set of a negation is the complement of the original truth set. So to count where a conjunction fails, count where it holds and subtract from the universe. This is usually shorter than working out the disjunction that the negation becomes.",
    "否定的真值集是原真值集的补集。所以要计算合取不成立的个数，可以先数它成立的个数，再从全集中减去。这通常比求出否定后的析取更简便。",
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
    return ask(
      [
        `Let $U = \\{1, 2, \\dots, ${n}\\}$, $P(x)$ be "$x > ${a}$" and $Q(x)$ be "$x$ is a multiple of $${d}$". How many elements are in the truth set of $\\neg(P(x) \\wedge Q(x))$?`,
        `设 $U = \\{1, 2, \\dots, ${n}\\}$，$P(x)$ 为“$x > ${a}$”，$Q(x)$ 为“$x$ 是 $${d}$ 的倍数”。$\\neg(P(x) \\wedge Q(x))$ 的真值集有多少个元素？`,
      ],
      answer,
      [both, n - greater - multiples + both, n - greater],
      [
        `There are $${both}$ multiples of $${d}$ above $${a}$, and those are the elements where the conjunction holds. The complement has $${n} - ${both} = ${answer}$ elements.`,
        `大于 $${a}$ 的 $${d}$ 的倍数有 $${both}$ 个，这些就是合取成立的元素。补集有 $${n} - ${both} = ${answer}$ 个元素。`,
      ],
    );
  },
);

const necessarySufficient = point(
  "necessary-and-sufficient-in-symbols",
  ["Necessary and sufficient in symbols", "必要与充分的符号表示"],
  [
    "Sufficient conditions go in front of the arrow and necessary conditions behind it, which is easy to reverse. The phrase with only if marks the consequent, and the phrase with unless means that the stated condition holds whenever the other one fails.",
    "充分条件放在箭头前面，必要条件放在箭头后面，这很容易弄反。“只有……才”标出的是必要条件，而“除非”的说法表示另一个条件不成立时所述条件成立。",
  ],
  (rng) => {
    const [a, b] = rng.sample(LETTERS, 2) as [string, string];
    const forward = `${a} \\Rightarrow ${b}`;
    const backward = `${b} \\Rightarrow ${a}`;
    const unless = `\\neg ${b} \\Rightarrow ${a}`;
    const iff = `${a} \\Leftrightarrow ${b}`;
    const cases: readonly (readonly [string, string, string, string, string])[] = [
      [
        `$${a}$ is necessary for $${b}$`,
        `$${a}$ 是 $${b}$ 的必要条件`,
        backward,
        `If $${b}$ holds, then the necessary condition $${a}$ must hold`,
        `如果 $${b}$ 成立，那么必要条件 $${a}$ 一定成立`,
      ],
      [
        `$${a}$ is sufficient for $${b}$`,
        `$${a}$ 是 $${b}$ 的充分条件`,
        forward,
        `Having the sufficient condition $${a}$ already gives $${b}$`,
        `有了充分条件 $${a}$，就能得到 $${b}$`,
      ],
      [
        `$${a}$ only if $${b}$`,
        `只有 $${b}$，才 $${a}$`,
        forward,
        `If $${a}$ holds, it can only be because $${b}$ holds`,
        `如果 $${a}$ 成立，那只能是因为 $${b}$ 成立`,
      ],
      [
        `$${a}$ unless $${b}$`,
        `除非 $${b}$，否则 $${a}$`,
        unless,
        `The statement $${a}$ is guaranteed as soon as $${b}$ fails`,
        `只要 $${b}$ 不成立，$${a}$ 就成立`,
      ],
      [
        `$${b}$ whenever $${a}$`,
        `只要 $${a}$，就 $${b}$`,
        forward,
        `Each time $${a}$ holds, $${b}$ holds as well`,
        `每当 $${a}$ 成立时，$${b}$ 也成立`,
      ],
      [
        `$${a}$ whenever $${b}$`,
        `只要 $${b}$，就 $${a}$`,
        backward,
        `Each time $${b}$ holds, $${a}$ holds as well`,
        `每当 $${b}$ 成立时，$${a}$ 也成立`,
      ],
    ];
    const [en, zh, correct, why, zhWhy] = rng.pick(cases);
    return choose(
      rng,
      [`Which formula says "${en}"?`, `哪个公式表示“${zh}”？`],
      same(correct),
      [forward, backward, unless, iff].filter((f) => f !== correct).map(same),
      [`${why}, so the formula is $${correct}$.`, `${zhWhy}，所以公式是 $${correct}$。`],
    );
  },
);

const nestedNegation = point(
  "negating-two-nested-quantifiers",
  ["Negating two nested quantifiers", "否定两层嵌套量词"],
  [
    "To negate a statement with two quantifiers, flip each quantifier in turn and negate the inner condition. The order of the variables stays the same. A common mistake is to flip just one quantifier, or to negate $<$ as $>$, when the negation of $<$ is $\\ge$.",
    "否定含两个量词的命题时，要依次翻转每个量词，并否定内层条件。变量的顺序不变。常见的错误是只翻转一个量词，或者把 $<$ 否定成 $>$，而 $<$ 的否定其实是 $\\ge$。",
  ],
  (rng) => {
    const k = rng.pick([-7, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
    const expr = poly([k, "x"]);
    const all = "\\forall x \\in \\mathbb{Z},\\ \\exists y \\in \\mathbb{Z},\\ ";
    const some = "\\exists x \\in \\mathbb{Z},\\ \\forall y \\in \\mathbb{Z},\\ ";
    const twoSame = "\\exists x \\in \\mathbb{Z},\\ \\exists y \\in \\mathbb{Z},\\ ";
    const twoAll = "\\forall x \\in \\mathbb{Z},\\ \\forall y \\in \\mathbb{Z},\\ ";
    const [rel, neg] = rng.pick([
      ["<", "\\ge"],
      ["\\le", ">"],
      [">", "\\le"],
      ["\\ge", "<"],
    ] as const);
    const startAll = rng.bool();
    const start = startAll ? all : some;
    const flipped = startAll ? some : all;
    return choose(
      rng,
      [`What is the negation of $${start}y ${rel} ${expr}$?`, `$${start}y ${rel} ${expr}$ 的否定是什么？`],
      same(`${flipped}y ${neg} ${expr}`),
      [same(`${flipped}y ${rel} ${expr}`), same(`${start}y ${neg} ${expr}`), same(`${startAll ? twoSame : twoAll}y ${neg} ${expr}`)],
      [
        `Each quantifier flips, in the same order, and the condition $y ${rel} ${expr}$ becomes $y ${neg} ${expr}$.`,
        `每个量词都翻转，顺序不变，条件 $y ${rel} ${expr}$ 变为 $y ${neg} ${expr}$。`,
      ],
    );
  },
);

const quantifierOrder = point(
  "why-the-order-of-quantifiers-matters",
  ["Why the order of quantifiers matters", "量词顺序为何重要"],
  [
    "In $\\forall x\\, \\exists y$, the value of $y$ may change with $x$, but in $\\exists y\\, \\forall x$, one value of $y$ must work for every $x$. So the second statement is stronger: it implies the first, but the first may be true without it.",
    "在 $\\forall x\\, \\exists y$ 中，$y$ 的值可以随 $x$ 改变，但在 $\\exists y\\, \\forall x$ 中，同一个 $y$ 必须对所有 $x$ 都成立。所以后者更强：它蕴涵前者，但前者可以在它不成立时为真。",
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
    const whys: Pair[] = [
      [
        `For each $x$, $y = ${k} - x$ works, but no single $y$ works for all $x$.`,
        `对每个 $x$，$y = ${k} - x$ 都满足，但没有一个 $y$ 对所有 $x$ 都满足。`,
      ],
      [
        `For each $x$, a large enough $y$ works, but no single $y$ exceeds all of the values $x + ${k}$.`,
        `对每个 $x$，足够大的 $y$ 都满足，但没有一个 $y$ 大于所有的 $x + ${k}$。`,
      ],
      [`The value $y = 0$ works for every $x$, so both statements are true.`, `$y = 0$ 对每个 $x$ 都满足，所以两个命题都为真。`],
      [
        `The left side is never negative, so every $y$ works for every $x$, and both statements are true.`,
        `左边永远不为负，所以每个 $y$ 对每个 $x$ 都满足，两个命题都为真。`,
      ],
      [
        `With $x = 0$ the product is $0$, not $${k}$, so no $y$ works for that $x$, and both statements fail.`,
        `当 $x = 0$ 时积为 $0$，不等于 $${k}$，所以对这个 $x$ 没有 $y$ 满足，两个命题都不成立。`,
      ],
      [
        `With $x^{2} > ${k}$ the left side is too large for every $y$, so no $y$ works for that $x$, and both statements fail.`,
        `当 $x^{2} > ${k}$ 时，对每个 $y$ 左边都太大，所以对这个 $x$ 没有 $y$ 满足，两个命题都不成立。`,
      ],
    ];
    return choose(
      rng,
      [
        `Over the integers, consider the first statement $\\forall x\\, \\exists y,\\ ${cond}$ and the second statement $\\exists y\\, \\forall x,\\ ${cond}$. Which are true?`,
        `在整数范围内，考虑第一个命题 $\\forall x\\, \\exists y,\\ ${cond}$ 和第二个命题 $\\exists y\\, \\forall x,\\ ${cond}$。哪些为真？`,
      ],
      option,
      [first, second, both, neither].filter((o) => o !== option),
      whys[kind] as Pair,
    );
  },
);

const prenexRename = point(
  "renaming-a-repeated-bound-variable",
  ["Renaming a repeated bound variable", "重命名重复的约束变量"],
  [
    "When both parts of a formula bind the same letter, the two variables are unrelated, so one must be renamed before the quantifiers are pulled out. Merging them into one quantifier would wrongly force a single value to do both jobs.",
    "当公式的两部分约束同一个字母时，这两个变量互不相关，所以在提出量词之前必须重命名其中一个。把它们合并成一个量词，会错误地要求同一个值同时承担两个作用。",
  ],
  (rng) => {
    const [A, B] = rng.sample(["P", "Q", "R", "S", "T"], 2) as [string, string];
    const kind = rng.int(0, 3);
    const [formula, right, wrong, why, zhWhy] = [
      [
        `(\\exists x\\, ${A}(x)) \\wedge (\\exists x\\, ${B}(x))`,
        `\\exists x\\, \\exists y\\, (${A}(x) \\wedge ${B}(y))`,
        `\\exists x\\, (${A}(x) \\wedge ${B}(x))`,
        "Both parts may have different witnesses",
        "两部分可以有不同的见证",
      ],
      [
        `(\\forall x\\, ${A}(x)) \\vee (\\forall x\\, ${B}(x))`,
        `\\forall x\\, \\forall y\\, (${A}(x) \\vee ${B}(y))`,
        `\\forall x\\, (${A}(x) \\vee ${B}(x))`,
        "Each universal part ranges separately",
        "每个全称部分分别取值",
      ],
      [
        `(\\exists x\\, ${A}(x)) \\wedge (\\forall x\\, ${B}(x))`,
        `\\exists x\\, \\forall y\\, (${A}(x) \\wedge ${B}(y))`,
        `\\exists x\\, (${A}(x) \\wedge ${B}(x))`,
        "The witness of the first part is unrelated to the second variable",
        "第一部分的见证与第二个变量无关",
      ],
      [
        `(\\forall x\\, ${A}(x)) \\Rightarrow (\\exists x\\, ${B}(x))`,
        `\\exists x\\, \\exists y\\, (${A}(x) \\Rightarrow ${B}(y))`,
        `\\forall x\\, \\exists y\\, (${A}(x) \\Rightarrow ${B}(y))`,
        "A quantifier from the antecedent flips, and the two variables are separate",
        "前件中的量词要翻转，并且两个变量相互独立",
      ],
    ][kind] as [string, string, string, string, string];
    return choose(
      rng,
      [`Which is a prenex normal form of $${formula}$?`, `哪个是 $${formula}$ 的前束范式？`],
      same(right),
      [
        same(wrong),
        same(`\\forall y\\, \\forall x\\, (${A}(x) \\wedge ${B}(y))`),
        same(`\\exists y\\, \\forall x\\, (${A}(y) \\vee ${B}(x))`),
      ],
      [`${why}, so the second variable is renamed $y$, which gives $${right}$.`, `${zhWhy}，所以把第二个变量改名为 $y$，得 $${right}$。`],
    );
  },
);

const chainStatus = point(
  "what-a-chain-of-conditionals-determines",
  ["What a chain of conditionals determines", "条件链能确定什么"],
  [
    "Affirming a statement in a chain carries truth forward along the arrows, and denying a statement carries falsity backward. Going in the other direction determines nothing: denying the antecedent and affirming the consequent are the two classic fallacies.",
    "在条件链中，肯定一个命题会使真沿箭头向前传递，否定一个命题会使假沿箭头向后传递。反方向则什么也确定不了：否定前件和肯定后件是两种经典的谬误。",
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
    return choose(
      rng,
      [
        `Suppose $${a} \\Rightarrow ${b}$, $${b} \\Rightarrow ${c}$ and $${given}$ are all true. What can be said about $${targetName}$?`,
        `设 $${a} \\Rightarrow ${b}$，$${b} \\Rightarrow ${c}$ 和 $${given}$ 都为真。关于 $${targetName}$ 能得出什么结论？`,
      ],
      option,
      [yes, no, open].filter((o) => o !== option),
      [
        `In the order $(${a}, ${b}, ${c})$, the rows that satisfy all three premises are: $${list}$. ${
          always
            ? `In each of them, $${targetName}$ is true.`
            : never
              ? `In each of them, $${targetName}$ is false.`
              : `$${targetName}$ takes both values among them.`
        }`,
        `按 $(${a}, ${b}, ${c})$ 的顺序，满足全部三个条件的行是：$${list}$。${
          always
            ? `在每一行中 $${targetName}$ 都为真。`
            : never
              ? `在每一行中 $${targetName}$ 都为假。`
              : `$${targetName}$ 在其中两种值都取到。`
        }`,
      ],
    );
  },
);

const combiningRules = point(
  "combining-several-rules-of-inference",
  ["Combining several rules of inference", "组合多条推理规则"],
  [
    "Real arguments use rules of inference in sequence: the conclusion of one step becomes a premise of the next. Checking which statement follows means building that chain from the premises, not just finding a statement that looks related to them.",
    "实际论证按顺序使用推理规则：一步的结论成为下一步的前提。判断哪个命题能推出，意味着要从前提构建这条链，而不只是找一个看起来与前提相关的命题。",
  ],
  (rng) => {
    const [a, b, c] = rng.sample(LETTERS, 3) as [string, string, string];
    const kind = rng.int(0, 3);
    const data: readonly (readonly [string, string, readonly string[], string, string])[] = [
      [
        `${a} \\vee ${b},\\ \\neg ${a},\\ ${b} \\Rightarrow ${c}`,
        c,
        [a, `\\neg ${b}`, `\\neg ${c}`],
        `Disjunctive syllogism gives $${b}$, and then modus ponens gives $${c}$`,
        `析取三段论得 $${b}$，再由肯定前件得 $${c}$`,
      ],
      [
        `${a} \\vee ${b},\\ ${a} \\Rightarrow ${c},\\ ${b} \\Rightarrow ${c}`,
        c,
        [a, b, `\\neg ${c}`],
        `In either case of the disjunction, $${c}$ follows, so this is proof by cases`,
        `析取的两种情形都能推出 $${c}$，所以这是分情形证明`,
      ],
      [
        `${a} \\Rightarrow ${b},\\ \\neg ${b},\\ ${a} \\vee ${c}`,
        c,
        [a, b, `\\neg ${c}`],
        `Modus tollens gives $\\neg ${a}$, and then disjunctive syllogism gives $${c}$`,
        `否定后件得 $\\neg ${a}$，再由析取三段论得 $${c}$`,
      ],
      [
        `${a} \\Rightarrow ${b},\\ ${b} \\Rightarrow ${c},\\ \\neg ${c}`,
        `\\neg ${a}`,
        [a, b, c],
        `The chain gives $${a} \\Rightarrow ${c}$, and then modus tollens gives $\\neg ${a}$`,
        `由链得 $${a} \\Rightarrow ${c}$，再由否定后件得 $\\neg ${a}$`,
      ],
    ];
    const [premises, right, wrong, why, zhWhy] = data[kind] as (typeof data)[number];
    return choose(rng, [`Which statement follows from $${premises}$?`, `由 $${premises}$ 能推出哪个命题？`], same(right), wrong.map(same), [
      `${why}.`,
      `${zhWhy}。`,
    ]);
  },
);

const outsideBoth = point(
  "counting-outside-both-sets",
  ["Counting outside both sets", "计算两个集合之外的元素"],
  [
    "The elements outside both sets form $A^{c} \\cap B^{c}$, which De Morgan's law rewrites as $(A \\cup B)^{c}$. So the count is the size of the universe minus the size of the union, and the union must be found with inclusion and exclusion.",
    "两个集合之外的元素构成 $A^{c} \\cap B^{c}$，德摩根律把它改写为 $(A \\cup B)^{c}$。所以个数等于全集大小减去并集大小，而并集要用容斥原理求出。",
  ],
  (rng) => {
    const both = rng.int(1, 15);
    const a = both + rng.int(1, 30);
    const b = both + rng.int(1, 30);
    const union = a + b - both;
    const outside = rng.int(1, 40);
    const U = union + outside;
    return ask(
      [
        `In a universe with $|U| = ${U}$, sets have $|A| = ${a}$, $|B| = ${b}$ and $|A \\cap B| = ${both}$. Find $|A^{c} \\cap B^{c}|$.`,
        `全集满足 $|U| = ${U}$，集合满足 $|A| = ${a}$，$|B| = ${b}$，$|A \\cap B| = ${both}$。求 $|A^{c} \\cap B^{c}|$。`,
      ],
      outside,
      [U - a - b, union, U - both],
      [
        `By De Morgan's law this is $|(A \\cup B)^{c}|$. The union has $${a} + ${b} - ${both} = ${union}$ elements, which leaves $${U} - ${union} = ${outside}$.`,
        `由德摩根律，这等于 $|(A \\cup B)^{c}|$。并集有 $${a} + ${b} - ${both} = ${union}$ 个元素，所以剩下 $${U} - ${union} = ${outside}$。`,
      ],
    );
  },
);

const falseIdentity = point(
  "a-counterexample-to-a-set-identity",
  ["A counterexample to a set identity", "集合恒等式的反例"],
  [
    "A set identity that looks reasonable can still be false. An element chased through both sides reveals where the argument breaks, and one element in only one side is enough to disprove the equality. A true proof needs both inclusions, but a disproof needs only one failure.",
    "看起来合理的集合恒等式仍可能不成立。追踪一个元素经过两边，就能看出论证在哪里失败，只要有一个元素只在一边，就足以否定等式。证明需要两个方向的包含，而否定只需一处不成立。",
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
    return ask(
      [
        `Let $A = \\{${A.join(", ")}\\}$ and $B = \\{${B.join(", ")}\\}$. The claim $(A \\cup B) \\setminus B = A$ fails. Which element of $A$ is missing from the left side?`,
        `设 $A = \\{${A.join(", ")}\\}$，$B = \\{${B.join(", ")}\\}$。等式 $(A \\cup B) \\setminus B = A$ 不成立。$A$ 的哪个元素不在左边？`,
      ],
      common,
      [onlyA[0] as number, onlyB[0] as number, onlyA[1] as number],
      [
        `Removing $B$ removes every element of $B$, so the left side is $\\{${left.join(", ")}\\}$. The element $${common}$ lies in both sets, so it is lost.`,
        `去掉 $B$ 会去掉 $B$ 的每个元素，所以左边是 $\\{${left.join(", ")}\\}$。元素 $${common}$ 同时在两个集合中，所以被去掉了。`,
      ],
    );
  },
);

const threeSetDeMorgan = point(
  "de-morgans-laws-for-three-sets",
  ["De Morgan's laws for three sets", "三个集合的德摩根律"],
  [
    "De Morgan's laws extend to any number of sets, and the element argument is the same as for two. Being outside an intersection means missing at least one of the sets, and being outside a union means missing every one of them.",
    "德摩根律可以推广到任意多个集合，元素论证与两个集合时相同。不在交集中意味着至少不属于其中一个集合，不在并集中意味着不属于其中每一个集合。",
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
    return choose(
      rng,
      [
        `In the proof of De Morgan's law for three sets, what does $x \\in (${set})^{c}$ mean?`,
        `在三个集合的德摩根律的证明中，$x \\in (${set})^{c}$ 是什么意思？`,
      ],
      right,
      [isCap ? none : atLeast, inOne, inAll],
      isCap
        ? [
            `An element outside an intersection misses at least one of the sets, so the statement is an "or".`,
            `不在交集中的元素至少不属于其中一个集合，所以这是一个“或”命题。`,
          ]
        : [
            `An element outside a union belongs to none of the sets, so the statement is an "and".`,
            `不在并集中的元素不属于其中任何一个集合，所以这是一个“且”命题。`,
          ],
    );
  },
);

const differenceDistributes = point(
  "how-set-difference-distributes",
  ["How set difference distributes", "集合差如何分配"],
  [
    "Set difference distributes too, but the side matters. A union or intersection on the left of the minus sign keeps its operation. On the right, the operation flips, because removing a union means satisfying two conditions of not belonging.",
    "集合差也能分配，但要看在哪一边。减号左边的并或交保持原来的运算。在右边，运算要翻转，因为去掉一个并集意味着要同时满足两个不属于的条件。",
  ],
  (rng) => {
    const [a, b, c] = rng.sample(["A", "B", "C", "D", "E", "F"], 3) as [string, string, string];
    const d = (x: string, y: string) => `(${x} \\setminus ${y})`;
    const kind = rng.int(0, 3);
    const [start, right, wrong] = [
      [
        `${a} \\setminus (${b} \\cup ${c})`,
        `${d(a, b)} \\cap ${d(a, c)}`,
        [`${d(a, b)} \\cup ${d(a, c)}`, `${d(a, b)} \\cup ${c}`, `${a} \\setminus (${b} \\cap ${c})`],
      ],
      [
        `${a} \\setminus (${b} \\cap ${c})`,
        `${d(a, b)} \\cup ${d(a, c)}`,
        [`${d(a, b)} \\cap ${d(a, c)}`, `${d(a, b)} \\cap ${c}`, `${a} \\setminus (${b} \\cup ${c})`],
      ],
      [
        `(${a} \\cup ${b}) \\setminus ${c}`,
        `${d(a, c)} \\cup ${d(b, c)}`,
        [`${d(a, c)} \\cap ${d(b, c)}`, `${a} \\cup ${d(b, c)}`, `(${a} \\cap ${b}) \\setminus ${c}`],
      ],
      [
        `(${a} \\cap ${b}) \\setminus ${c}`,
        `${d(a, c)} \\cap ${d(b, c)}`,
        [`${d(a, c)} \\cup ${d(b, c)}`, `${d(a, b)} \\cap ${c}`, `(${a} \\cup ${b}) \\setminus ${c}`],
      ],
    ][kind] as [string, string, string[]];
    const onRight = kind < 2;
    return choose(
      rng,
      [`Which set equals $${start}$ for all sets?`, `对所有集合，哪个集合等于 $${start}$？`],
      same(right),
      wrong.map(same),
      onRight
        ? [
            `Here the operation is on the right of the difference, so it flips, and the result is $${right}$.`,
            `这里的运算在差的右边，所以要翻转，结果是 $${right}$。`,
          ]
        : [
            `Here the operation is on the left of the difference, so it stays the same, and the result is $${right}$.`,
            `这里的运算在差的左边，所以保持不变，结果是 $${right}$。`,
          ],
    );
  },
);

const productUnionSize = point(
  "the-product-with-a-union-from-given-products",
  ["The product with a union from given products", "由已知乘积求与并集的乘积"],
  [
    "Since $A \\times (B \\cup C) = (A \\times B) \\cup (A \\times C)$ and the two products overlap in $A \\times (B \\cap C)$, inclusion and exclusion applies to the products themselves. Simply adding the two products would count the overlap twice.",
    "由于 $A \\times (B \\cup C) = (A \\times B) \\cup (A \\times C)$，且两个乘积的重叠部分是 $A \\times (B \\cap C)$，所以容斥原理可以直接用于乘积。简单地把两个乘积相加，会把重叠部分计算两次。",
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const i = rng.int(1, 6);
    const b = i + rng.int(1, 6);
    const c = i + rng.int(1, 6);
    const answer = a * (b + c - i);
    return ask(
      [
        `Sets satisfy $|A \\times B| = ${a * b}$, $|A \\times C| = ${a * c}$ and $|A \\times (B \\cap C)| = ${a * i}$. Find $|A \\times (B \\cup C)|$.`,
        `集合满足 $|A \\times B| = ${a * b}$，$|A \\times C| = ${a * c}$，$|A \\times (B \\cap C)| = ${a * i}$。求 $|A \\times (B \\cup C)|$。`,
      ],
      answer,
      [a * (b + c), a * (b + c) + a * i, a * b * c],
      [
        `The two products overlap in exactly $A \\times (B \\cap C)$, so the size is $${a * b} + ${a * c} - ${a * i} = ${answer}$.`,
        `两个乘积的重叠部分正好是 $A \\times (B \\cap C)$，所以大小是 $${a * b} + ${a * c} - ${a * i} = ${answer}$。`,
      ],
    );
  },
);

const squareResidue = point(
  "a-direct-proof-with-a-remainder",
  ["A direct proof with a remainder", "带余数的直接证明"],
  [
    "A direct proof about remainders starts by writing $n = mk + r$. Expanding gives $n^{2} = m(mk^{2} + 2kr) + r^{2}$, so the remainder of $n^{2}$ depends only on $r^{2}$, which may still need reducing because it can be larger than $m$.",
    "关于余数的直接证明从写出 $n = mk + r$ 开始。展开得 $n^{2} = m(mk^{2} + 2kr) + r^{2}$，所以 $n^{2}$ 的余数只取决于 $r^{2}$，而 $r^{2}$ 可能大于 $m$，这时还需要继续化简。",
  ],
  (rng) => {
    const m = rng.int(3, 15);
    const r = rng.int(1, m - 1);
    const answer = (r * r) % m;
    return ask(
      [
        `Suppose $n$ leaves remainder $${r}$ on division by $${m}$. A direct proof shows that $n^{2}$ always leaves the same remainder on division by $${m}$. What is it?`,
        `设 $n$ 除以 $${m}$ 余 $${r}$。直接证明可以说明 $n^{2}$ 除以 $${m}$ 的余数总是相同的。这个余数是多少？`,
      ],
      answer,
      [r, r * r, (2 * r) % m],
      [
        `Writing $n = ${m}k + ${r}$ gives $n^{2} = ${m}(${m}k^{2} + ${2 * r}k) + ${r * r}$. Reducing $${r * r}$ modulo $${m}$ gives $${answer}$.`,
        `写成 $n = ${m}k + ${r}$，得 $n^{2} = ${m}(${m}k^{2} + ${2 * r}k) + ${r * r}$。把 $${r * r}$ 模 $${m}$ 化简，得 $${answer}$。`,
      ],
    );
  },
);

const smallestCounterexample = point(
  "the-smallest-counterexample-to-a-divisibility-claim",
  ["The smallest counterexample to a divisibility claim", "整除命题的最小反例"],
  [
    "The claim that divisibility by $a$ and $b$ implies divisibility by $ab$ holds only when $a$ and $b$ are coprime. If they share a factor, their least common multiple is divisible by both but not by the product, so it is the smallest counterexample.",
    "“能被 $a$ 和 $b$ 整除就能被 $ab$ 整除”只在 $a$ 与 $b$ 互素时成立。如果它们有公因数，它们的最小公倍数能被两者整除，却不能被乘积整除，所以它是最小的反例。",
  ],
  (rng) => {
    const g = rng.int(2, 6);
    const x = rng.int(1, 7);
    let y = rng.int(1, 7);
    if (y === x) y = x + 1;
    const a = g * x;
    const b = g * y;
    const answer = lcm(a, b);
    return ask(
      [
        `Find the smallest positive integer $n$ that disproves the claim "if $${a} \\mid n$ and $${b} \\mid n$, then $${a * b} \\mid n$".`,
        `求能否定命题“如果 $${a} \\mid n$ 且 $${b} \\mid n$，那么 $${a * b} \\mid n$”的最小正整数 $n$。`,
      ],
      answer,
      [a * b, gcd(a, b), a + b],
      [
        `A counterexample must be a common multiple of $${a}$ and $${b}$. The smallest is $${answer}$, and it is less than $${a * b}$, so $${a * b}$ does not divide it.`,
        `反例必须是 $${a}$ 和 $${b}$ 的公倍数。最小的是 $${answer}$，它小于 $${a * b}$，所以不能被 $${a * b}$ 整除。`,
      ],
    );
  },
);

const threeThreshold = point(
  "a-threshold-for-three-numbers-by-contrapositive",
  ["A threshold for three numbers by contrapositive", "用逆否命题求三个数的阈值"],
  [
    "A claim of the form if the sum is large, then some number is large is proved by contrapositive: if every integer is below its bound, then the sum is at most the sum of the largest allowed values. One more than this maximum is the smallest threshold that works.",
    "“如果和很大，那么某个数很大”这种命题用逆否命题证明：如果每个整数都低于它的界，那么和至多为各允许最大值之和。比这个最大值多一就是有效的最小阈值。",
  ],
  (rng) => {
    const p = rng.int(2, 15);
    const q = rng.int(2, 15);
    const r = rng.int(2, 15);
    const most = p + q + r - 3;
    const answer = most + 1;
    return ask(
      [
        `Find the smallest integer $S$ such that, for all integers $a, b, c$, if $a + b + c \\ge S$ then $a \\ge ${p}$ or $b \\ge ${q}$ or $c \\ge ${r}$.`,
        `求最小的整数 $S$，使得对所有整数 $a, b, c$，如果 $a + b + c \\ge S$，那么 $a \\ge ${p}$ 或 $b \\ge ${q}$ 或 $c \\ge ${r}$。`,
      ],
      answer,
      [most, p + q + r, p + q + r - 1],
      [
        `The contrapositive assumes $a \\le ${p - 1}$, $b \\le ${q - 1}$ and $c \\le ${r - 1}$, so the sum is at most $${most}$ and can equal it. The smallest threshold is $${answer}$.`,
        `逆否命题假设 $a \\le ${p - 1}$，$b \\le ${q - 1}$，$c \\le ${r - 1}$，所以和至多为 $${most}$，并且可以取到。最小的阈值是 $${answer}$。`,
      ],
    );
  },
);

const parityVerdict = point(
  "deciding-a-parity-claim-by-the-coefficients",
  ["Deciding a parity claim by the coefficients", "由系数判断奇偶性命题"],
  [
    "Not every parity claim is true, and the coefficients decide it. Test the contrapositive by substituting an odd $n$: only the parities of the coefficients matter. If the result can be odd, then $n = 1$ gives a counterexample to the claim.",
    "并非每个奇偶性命题都成立，要由系数决定。代入奇数 $n$ 来检验逆否命题：只有系数的奇偶性起作用。如果结果可能为奇数，那么 $n = 1$ 就是这个命题的反例。",
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
    return choose(
      rng,
      [`Decide the claim "if $${expr}$ is odd, then $n$ is even".`, `判断命题“如果 $${expr}$ 是奇数，那么 $n$ 是偶数”。`],
      option,
      [right, converse, one, two].filter((o) => o !== option),
      kind === 0
        ? [
            `The contrapositive assumes $n$ odd. Then $${a}n$ is odd and adding the odd $${b}$ gives an even number, so the claim is true.`,
            `逆否命题假设 $n$ 是奇数。这时 $${a}n$ 是奇数，加上奇数 $${b}$ 得偶数，所以命题成立。`,
          ]
        : [
            `With $n = 1$, the expression is $${a + b}$, which is odd, although $n$ is odd. So the claim is false.`,
            `当 $n = 1$ 时，表达式等于 $${a + b}$，它是奇数，但 $n$ 是奇数。所以命题不成立。`,
          ],
    );
  },
);

const bothIndivisible = point(
  "when-two-non-multiples-add-to-a-multiple",
  ["When two non-multiples add to a multiple", "两个非倍数之和成为倍数"],
  [
    "A contradiction proof shows that a multiple plus a non-multiple is never a multiple. The same conclusion fails when both terms are non-multiples, because their remainders can add up to the divisor. So the hypothesis that one term is a multiple cannot be dropped.",
    "反证法说明倍数加非倍数永远不是倍数。当两项都是非倍数时，这个结论不成立，因为它们的余数相加可能等于除数。所以“有一项是倍数”这个假设不能去掉。",
  ],
  (rng) => {
    const d = rng.int(3, 13);
    const a = d * rng.int(1, 9) + rng.int(1, d - 1);
    const r = a % d;
    const answer = d - r;
    return ask(
      [
        `The claim "if $${d} \\nmid a$ and $${d} \\nmid b$, then $${d} \\nmid a + b$" is false. For $a = ${a}$, find the smallest positive $b$ that shows this.`,
        `命题“如果 $${d} \\nmid a$ 且 $${d} \\nmid b$，那么 $${d} \\nmid a + b$”不成立。对 $a = ${a}$，求能说明这一点的最小正整数 $b$。`,
      ],
      answer,
      [r, d, a],
      [
        `$a$ leaves remainder $${r}$ on division by $${d}$, so $b$ must leave remainder $${answer}$. The smallest such $b$ is $${answer}$, and $${a} + ${answer} = ${a + answer}$ is a multiple of $${d}$.`,
        `$a$ 除以 $${d}$ 余 $${r}$，所以 $b$ 除以 $${d}$ 必须余 $${answer}$。这样的最小 $b$ 是 $${answer}$，且 $${a} + ${answer} = ${a + answer}$ 是 $${d}$ 的倍数。`,
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
