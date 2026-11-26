// Third knowledge points for thin topics of Linear Algebra, from sets and elimination to
// eigenvectors: the reverse question, a harder case or a common trap.
// See `deeperLinearAlgebraThirdPoints`.

import type { KnowledgePointDef, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { numberProblem, say, why, withMistakes } from "../problems.ts";
import { ask, choose, type Pair, point } from "../university-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** nz picks a nonzero integer from -r to r. */
const nz = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** mat writes a matrix given as rows. */
const mat = (rows: readonly (readonly (number | string)[])[]) =>
  `\\begin{pmatrix} ${rows.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
/** vec writes a column vector. */
const vec = (...entries: readonly (number | string)[]) => mat(entries.map((entry) => [entry]));
/** wrap puts parentheses around a negative number. */
/** text turns an English and Chinese pair into a text. */
const text = ([en, zh]: Pair): Text => t(en, zh);

const wrap = (n: number) => (n < 0 ? `(${n})` : `${n}`);

const squaresBounded = point(
  "counting-integers-with-a-bounded-square",
  ["Counting integers with a bounded square", "数平方有界的整数"],
  [
    "When a set is described inside the integers, negative numbers count as well. A condition such as $x^{2} \\le k$ allows both signs and zero, so the set has one element for zero and two for each positive integer up to the square root of $k$.\n\n> **Watch out.** Zero and the negative integers belong too. $\\{x \\in \\mathbb{Z} \\mid x^{2} \\le 10\\} = \\{-3, -2, -1, 0, 1, 2, 3\\}$ has $7$ elements, not $3$.",
    "当集合在整数中描述时，负数也要计入。像 $x^{2} \\le k$ 这样的条件允许正负两种符号以及零，所以集合中零占一个元素，不超过 $k$ 的平方根的每个正整数占两个元素。\n\n> **注意。** 零和负整数也属于这个集合。$\\{x \\in \\mathbb{Z} \\mid x^{2} \\le 10\\} = \\{-3, -2, -1, 0, 1, 2, 3\\}$ 有 $7$ 个元素，而不是 $3$ 个。",
  ],
  (rng) => {
    const k = rng.int(2, 150);
    const s = Math.floor(Math.sqrt(k));
    const answer = 2 * s + 1;
    return withMistakes(
      ask(
        [
          `How many elements does $\\{x \\in \\mathbb{Z} \\mid x^{2} \\le ${k}\\}$ have?`,
          `$\\{x \\in \\mathbb{Z} \\mid x^{2} \\le ${k}\\}$ 有多少个元素？`,
        ],
        answer,
        [s, 2 * s, s + 1],
        [
          `**Step 1: Find the largest allowed integer.** $${s}^{2} = ${s * s} \\le ${k}$ but $${s + 1}^{2} = ${(s + 1) ** 2} > ${k}$, so the positive elements are $1, \\dots, ${s}$.\n\n**Step 2: Count both signs and zero.** $(-x)^{2} = x^{2}$, so the set is $\\{${-s}, \\dots, ${s}\\}$: $${s}$ negative integers, zero and $${s}$ positive ones, $2 \\cdot ${s} + 1 = ${answer}$ in all.\n\n**Check.** From $${-s}$ to $${s}$ there are $${s} - (${-s}) + 1 = ${answer}$ integers, and $\\pm ${s + 1}$ are left out since their square $${(s + 1) ** 2}$ exceeds $${k}$.`,
          `**第一步：找出允许的最大整数。** $${s}^{2} = ${s * s} \\le ${k}$，而 $${s + 1}^{2} = ${(s + 1) ** 2} > ${k}$，所以正的元素是 $1, \\dots, ${s}$。\n\n**第二步：计入两种符号和零。** $(-x)^{2} = x^{2}$，所以集合是 $\\{${-s}, \\dots, ${s}\\}$：$${s}$ 个负整数、零和 $${s}$ 个正整数，共 $2 \\cdot ${s} + 1 = ${answer}$ 个。\n\n**检验。** 从 $${-s}$ 到 $${s}$ 共有 $${s} - (${-s}) + 1 = ${answer}$ 个整数；$\\pm ${s + 1}$ 不在其中，因为它们的平方 $${(s + 1) ** 2}$ 超过 $${k}$。`,
        ],
      ),
      [
        say(
          String(s),
          "That counts only the positive integers; negative integers have the same squares, and zero belongs too.",
          "这只数了正整数；负整数有相同的平方，而且零也属于这个集合。",
        ),
        say(String(2 * s), "Zero is missing: $0^{2} = 0$ satisfies the condition.", "漏了零：$0^{2} = 0$ 满足条件。"),
        say(
          String(s + 1),
          "That counts zero and the positive integers; each negative integer $-x$ has the same square as $x$.",
          "这数了零和正整数；每个负整数 $-x$ 与 $x$ 的平方相同。",
        ),
      ],
    );
  },
);

const negation = point(
  "negating-a-quantified-statement",
  ["Negating a quantified statement", "否定带量词的命题"],
  [
    "To negate a quantified statement, change the quantifier and negate the predicate: not for all becomes there exists, and not there exists becomes for all. Negating an inequality includes the boundary, so the negation of $>$ is $\\le$, not $<$.\n\n> **Watch out.** Both changes are needed, and the boundary goes to the negation. The negation of $\\forall x,\\ x^{2} > 4$ is $\\exists x,\\ x^{2} \\le 4$: at $x = 2$, $x^{2} > 4$ is false, so $x^{2} = 4$ must satisfy the negated predicate.",
    "否定带量词的命题时，要改变量词并否定谓词：并非对所有变成存在，并非存在变成对所有。否定不等式时要包括边界，所以 $>$ 的否定是 $\\le$，而不是 $<$。\n\n> **注意。** 两处改变都需要，而且边界归否定的一方。$\\forall x,\\ x^{2} > 4$ 的否定是 $\\exists x,\\ x^{2} \\le 4$：在 $x = 2$ 处 $x^{2} > 4$ 为假，所以 $x^{2} = 4$ 必须满足否定后的谓词。",
  ],
  (rng) => {
    const k = rng.int(1, 25);
    const R = "x \\in \\mathbb{R}";
    if (rng.bool()) {
      return reasoned(
        choose(
          rng,
          [`Which statement is the negation of $\\forall ${R},\\ x^{2} > ${k}$?`, `哪个命题是 $\\forall ${R},\\ x^{2} > ${k}$ 的否定？`],
          [`$\\exists ${R},\\ x^{2} \\le ${k}$`, `$\\exists ${R},\\ x^{2} \\le ${k}$`],
          [
            [`$\\exists ${R},\\ x^{2} < ${k}$`, `$\\exists ${R},\\ x^{2} < ${k}$`],
            [`$\\forall ${R},\\ x^{2} \\le ${k}$`, `$\\forall ${R},\\ x^{2} \\le ${k}$`],
            [`$\\exists ${R},\\ x^{2} > ${k}$`, `$\\exists ${R},\\ x^{2} > ${k}$`],
          ],
          [
            `**Step 1: Change the quantifier.** "Not for every $x$" means "for some $x$", so $\\forall$ becomes $\\exists$.\n\n**Step 2: Negate the predicate.** $x^{2} > ${k}$ fails exactly when $x^{2} \\le ${k}$, equality included. The negation is $\\exists ${R},\\ x^{2} \\le ${k}$.\n\n**Check.** At $x = 0$ the original fails, since $0 > ${k}$ is false, and the negation holds, since $0 \\le ${k}$: the two have opposite truth values, as a statement and its negation must.`,
            `**第一步：改变量词。** “并非对每个 $x$”意思是“对某个 $x$”，所以 $\\forall$ 变为 $\\exists$。\n\n**第二步：否定谓词。** $x^{2} > ${k}$ 不成立恰好是 $x^{2} \\le ${k}$，包括等号。否定是 $\\exists ${R},\\ x^{2} \\le ${k}$。\n\n**检验。** 在 $x = 0$ 处原命题不成立，因为 $0 > ${k}$ 为假；而否定成立，因为 $0 \\le ${k}$：两者真假相反，命题与其否定本应如此。`,
          ],
        ),
        [
          [
            `$\\exists ${R},\\ x^{2} < ${k}$`,
            `$x^{2} = ${k}$ also makes $x^{2} > ${k}$ false, so the negated predicate must include equality.`,
            `$x^{2} = ${k}$ 也使 $x^{2} > ${k}$ 为假，所以否定后的谓词必须包括等号。`,
          ],
          [
            `$\\forall ${R},\\ x^{2} \\le ${k}$`,
            "The quantifier must change as well: the negation of a statement about every $x$ is a statement about some $x$.",
            "量词也必须改变：关于每个 $x$ 的命题，其否定是关于某个 $x$ 的命题。",
          ],
          [
            `$\\exists ${R},\\ x^{2} > ${k}$`,
            "Only the quantifier changed; the predicate must be negated too.",
            "只改变了量词；谓词也必须否定。",
          ],
        ],
      );
    }
    return reasoned(
      choose(
        rng,
        [`Which statement is the negation of $\\exists ${R},\\ x^{2} < ${k}$?`, `哪个命题是 $\\exists ${R},\\ x^{2} < ${k}$ 的否定？`],
        [`$\\forall ${R},\\ x^{2} \\ge ${k}$`, `$\\forall ${R},\\ x^{2} \\ge ${k}$`],
        [
          [`$\\forall ${R},\\ x^{2} > ${k}$`, `$\\forall ${R},\\ x^{2} > ${k}$`],
          [`$\\exists ${R},\\ x^{2} \\ge ${k}$`, `$\\exists ${R},\\ x^{2} \\ge ${k}$`],
          [`$\\forall ${R},\\ x^{2} < ${k}$`, `$\\forall ${R},\\ x^{2} < ${k}$`],
        ],
        [
          `**Step 1: Change the quantifier.** "There is no $x$ with the property" means "every $x$ lacks it", so $\\exists$ becomes $\\forall$.\n\n**Step 2: Negate the predicate.** $x^{2} < ${k}$ fails exactly when $x^{2} \\ge ${k}$, equality included. The negation is $\\forall ${R},\\ x^{2} \\ge ${k}$.\n\n**Check.** At $x = 0$ the original holds, since $0 < ${k}$, and the negation fails, since $0 \\ge ${k}$ is false: the two have opposite truth values, as a statement and its negation must.`,
          `**第一步：改变量词。** “不存在具有该性质的 $x$”意思是“每个 $x$ 都不具有它”，所以 $\\exists$ 变为 $\\forall$。\n\n**第二步：否定谓词。** $x^{2} < ${k}$ 不成立恰好是 $x^{2} \\ge ${k}$，包括等号。否定是 $\\forall ${R},\\ x^{2} \\ge ${k}$。\n\n**检验。** 在 $x = 0$ 处原命题成立，因为 $0 < ${k}$；而否定不成立，因为 $0 \\ge ${k}$ 为假：两者真假相反，命题与其否定本应如此。`,
        ],
      ),
      [
        [
          `$\\forall ${R},\\ x^{2} > ${k}$`,
          `$x^{2} = ${k}$ also makes $x^{2} < ${k}$ false, so the negated predicate must include equality.`,
          `$x^{2} = ${k}$ 也使 $x^{2} < ${k}$ 为假，所以否定后的谓词必须包括等号。`,
        ],
        [
          `$\\exists ${R},\\ x^{2} \\ge ${k}$`,
          "The quantifier must change as well: the negation of a statement about some $x$ is a statement about every $x$.",
          "量词也必须改变：关于某个 $x$ 的命题，其否定是关于每个 $x$ 的命题。",
        ],
        [
          `$\\forall ${R},\\ x^{2} < ${k}$`,
          "Only the quantifier changed; the predicate must be negated too.",
          "只改变了量词；谓词也必须否定。",
        ],
      ],
    );
  },
);

const imageSet = point(
  "a-constructed-set-with-hidden-repeats",
  ["A constructed set with hidden repeats", "隐含重复元素的构造集合"],
  [
    "A set built by applying a formula lists each value once, even if several inputs produce it. Squaring sends $x$ and $-x$ to the same number, so the size of the set can be much smaller than the number of inputs, and it depends on the larger end of the range.\n\n> **Watch out.** Count the values, not the inputs. $\\{x^{2} \\mid x \\in \\mathbb{Z},\\ -2 \\le x \\le 3\\}$ has $6$ inputs but only the $4$ values $0, 1, 4, 9$.",
    "用公式构造的集合中，每个值只列一次，即使有多个输入产生它。平方把 $x$ 和 $-x$ 送到同一个数，所以集合的大小可能远小于输入的个数，并且取决于范围中较大的一端。\n\n> **注意。** 数的是值，不是输入。$\\{x^{2} \\mid x \\in \\mathbb{Z},\\ -2 \\le x \\le 3\\}$ 有 $6$ 个输入，却只有 $0, 1, 4, 9$ 这 $4$ 个值。",
  ],
  (rng) => {
    const a = rng.int(1, 9);
    const b = a + rng.int(0, 5);
    const answer = b + 1;
    return withMistakes(
      ask(
        [
          `How many elements does $\\{x^{2} \\mid x \\in \\mathbb{Z},\\ ${-a} \\le x \\le ${b}\\}$ have?`,
          `$\\{x^{2} \\mid x \\in \\mathbb{Z},\\ ${-a} \\le x \\le ${b}\\}$ 有多少个元素？`,
        ],
        answer,
        [a + b + 1, b, 2 * b + 1],
        [
          `**Step 1: Match the negative inputs.** $(-x)^{2} = x^{2}$, and each negative input $-x \\ge ${-a}$ has its partner $x \\le ${a} \\le ${b}$ in the range, so it adds no new value.\n\n**Step 2: Count the distinct values.** The values are $0^{2}, 1^{2}, \\dots, ${b}^{2}$, which is $${b} + 1 = ${answer}$ numbers.\n\n**Check.** The squares $0 < 1 < 4 < \\dots < ${b * b}$ increase strictly, so they are all different; there are $${a + b + 1}$ inputs but only $${answer}$ values.`,
          `**第一步：配对负的输入。** $(-x)^{2} = x^{2}$，而每个负输入 $-x \\ge ${-a}$ 在范围内都有对应的 $x \\le ${a} \\le ${b}$，所以不产生新的值。\n\n**第二步：数不同的值。** 值是 $0^{2}, 1^{2}, \\dots, ${b}^{2}$，共 $${b} + 1 = ${answer}$ 个数。\n\n**检验。** 平方 $0 < 1 < 4 < \\dots < ${b * b}$ 严格递增，所以互不相同；共有 $${a + b + 1}$ 个输入，却只有 $${answer}$ 个值。`,
        ],
      ),
      [
        say(
          String(a + b + 1),
          `$${a + b + 1}$ is the number of inputs; $x$ and $-x$ give the same square, so the set lists it once.`,
          `$${a + b + 1}$ 是输入的个数；$x$ 与 $-x$ 的平方相同，集合中只列一次。`,
        ),
        say(String(b), "The value $0^{2} = 0$ is missing.", "漏了值 $0^{2} = 0$。"),
        say(
          String(2 * b + 1),
          `That counts the inputs from $${-b}$ to $${b}$; the range starts at $${-a}$, and in any case each square is listed once.`,
          `这数的是从 $${-b}$ 到 $${b}$ 的输入；范围从 $${-a}$ 开始，而且每个平方都只列一次。`,
        ),
      ].filter((m, i, all) => m.response !== String(answer) && all.findIndex((x) => x.response === m.response) === i),
    );
  },
);

const residuesInInterval = point(
  "counting-a-residue-set-in-an-interval",
  ["Counting a residue set in an interval", "数区间内的同余集元素"],
  [
    "The elements of $\\{mk + r\\}$ in an interval are equally spaced by $m$. So find the first element at or above the lower end and the last at or below the upper end, and count the steps between them, adding one for the starting element.\n\n> **Watch out.** Start from the first element of the set, not from the end of the interval. In $[0, 20]$ the elements of $\\{6k + 2\\}$ are $2, 8, 14, 20$: $3$ steps of $6$ from $2$ to $20$, so $4$ elements.",
    "$\\{mk + r\\}$ 在区间内的元素以 $m$ 为间隔等距分布。所以先找不小于下端的第一个元素和不大于上端的最后一个元素，再数它们之间的步数，并加上起始元素这一个。\n\n> **注意。** 从集合的第一个元素开始，而不是从区间的端点开始。在 $[0, 20]$ 中，$\\{6k + 2\\}$ 的元素是 $2, 8, 14, 20$：从 $2$ 到 $20$ 走了 $3$ 步，每步 $6$，所以有 $4$ 个元素。",
  ],
  (rng) => {
    const m = rng.int(3, 9);
    const r = rng.int(0, m - 1);
    const L = rng.int(-30, 0);
    const U = L + m + rng.int(0, 30);
    const low = Math.ceil((L - r) / m);
    const high = Math.floor((U - r) / m);
    const answer = high - low + 1;
    const [first, last] = [m * low + r, m * high + r];
    return withMistakes(
      ask(
        [
          `How many elements of $\\{${poly([m, "k"], [r, ""])} \\mid k \\in \\mathbb{Z}\\}$ lie in the interval $[${L}, ${U}]$?`,
          `$\\{${poly([m, "k"], [r, ""])} \\mid k \\in \\mathbb{Z}\\}$ 有多少个元素在区间 $[${L}, ${U}]$ 内？`,
        ],
        answer,
        [answer + 1, answer - 1 === 0 ? answer + 2 : answer - 1, U - L + 1],
        [
          `**Step 1: Find the first and last elements.** The smallest $k$ with $${m}k + ${r} \\ge ${L}$ is $k = ${low}$, giving $${first}$; the largest with $${m}k + ${r} \\le ${U}$ is $k = ${high}$, giving $${last}$.\n\n**Step 2: Count.** $k$ runs from $${low}$ to $${high}$, so there are $${high} - ${wrap(low)} + 1 = ${answer}$ elements.\n\n**Check.** The neighbours $${first - m}$ and $${last + m}$ lie outside $[${L}, ${U}]$, and $\\frac{${last} - ${wrap(first)}}{${m}} + 1 = ${answer}$.`,
          `**第一步：找出第一个与最后一个元素。** 满足 $${m}k + ${r} \\ge ${L}$ 的最小 $k$ 是 $${low}$，给出 $${first}$；满足 $${m}k + ${r} \\le ${U}$ 的最大 $k$ 是 $${high}$，给出 $${last}$。\n\n**第二步：计数。** $k$ 从 $${low}$ 到 $${high}$，共 $${high} - ${wrap(low)} + 1 = ${answer}$ 个元素。\n\n**检验。** 相邻的 $${first - m}$ 和 $${last + m}$ 都在 $[${L}, ${U}]$ 之外，且 $\\frac{${last} - ${wrap(first)}}{${m}} + 1 = ${answer}$。`,
        ],
      ),
      [
        say(
          String(answer - 1),
          `That is the number of steps from $${first}$ to $${last}$; add one for the starting element.`,
          `这是从 $${first}$ 到 $${last}$ 的步数；还要加上起始元素。`,
        ),
        say(
          String(answer + 1),
          `One element too many: $${first - m}$ and $${last + m}$ lie outside the interval.`,
          `多了一个元素：$${first - m}$ 和 $${last + m}$ 在区间之外。`,
        ),
        say(
          String(U - L + 1),
          `That counts every integer in the interval; only every $${m}$th one is in the set.`,
          `这数的是区间内的所有整数；只有每隔 $${m}$ 个的那些在集合中。`,
        ),
      ].filter(
        (x, i, all) => x.response !== String(answer) && Number(x.response) > 0 && all.findIndex((y) => y.response === x.response) === i,
      ),
    );
  },
);

const listingIntegers = point(
  "the-position-of-an-integer-in-a-listing",
  ["The position of an integer in a listing", "整数在列表中的位置"],
  [
    "A set is countably infinite if a list reaches every element. The integers are listed by alternating signs as $0, -1, 1, -2, 2, \\dots$, even though they extend in both directions. Each integer has an exact position, and the formula differs for the two signs.\n\n> **Watch out.** The list starts at $n = 0$, and the signs alternate. $f(0) = 0$, $f(1) = -1$, $f(2) = 1$, so the integer $1$ sits at $n = 2$, not at $n = 1$.",
    "如果一个列表能到达集合的每个元素，这个集合就是可数无穷的。整数可以用正负交替的方式列为 $0, -1, 1, -2, 2, \\dots$，尽管它们向两个方向延伸。每个整数都有确定的位置，两种符号的公式不同。\n\n> **注意。** 列表从 $n = 0$ 开始，正负交替。$f(0) = 0$，$f(1) = -1$，$f(2) = 1$，所以整数 $1$ 位于 $n = 2$，而不是 $n = 1$。",
  ],
  (rng) => {
    const m = nz(rng, 30);
    const answer = m > 0 ? 2 * m : -2 * m - 1;
    const f = "\\begin{cases} \\frac{n}{2}, & n \\text{ even} \\\\ -\\frac{n + 1}{2}, & n \\text{ odd} \\end{cases}";
    const other = m > 0 ? 2 * m - 1 : -2 * m;
    return withMistakes(
      ask(
        [
          `The function $f(n) = ${f}$, $n = 0, 1, 2, \\dots$, lists all the integers. Find the $n$ with $f(n) = ${m}$.`,
          `函数 $f(n) = ${f}$，$n = 0, 1, 2, \\dots$，列出全部整数。求满足 $f(n) = ${m}$ 的 $n$。`,
        ],
        answer,
        [Math.abs(m), other, answer + 1],
        m > 0
          ? [
              `**Step 1: Choose the branch.** The odd branch $-\\frac{n + 1}{2}$ is always negative, so the positive value $${m}$ comes from an even $n$.\n\n**Step 2: Solve.** $\\frac{n}{2} = ${m}$ gives $n = ${answer}$.\n\n**Check.** $${answer}$ is even and $f(${answer}) = \\frac{${answer}}{2} = ${m}$.`,
              `**第一步：选择分支。** 奇数分支 $-\\frac{n + 1}{2}$ 总是负的，所以正值 $${m}$ 来自偶数 $n$。\n\n**第二步：求解。** $\\frac{n}{2} = ${m}$，得 $n = ${answer}$。\n\n**检验。** $${answer}$ 是偶数，$f(${answer}) = \\frac{${answer}}{2} = ${m}$。`,
            ]
          : [
              `**Step 1: Choose the branch.** The even branch $\\frac{n}{2}$ is never negative, so the negative value $${m}$ comes from an odd $n$.\n\n**Step 2: Solve.** $-\\frac{n + 1}{2} = ${m}$ gives $n + 1 = ${-2 * m}$, so $n = ${answer}$.\n\n**Check.** $${answer}$ is odd and $f(${answer}) = -\\frac{${answer} + 1}{2} = -\\frac{${answer + 1}}{2} = ${m}$.`,
              `**第一步：选择分支。** 偶数分支 $\\frac{n}{2}$ 从不为负，所以负值 $${m}$ 来自奇数 $n$。\n\n**第二步：求解。** $-\\frac{n + 1}{2} = ${m}$，得 $n + 1 = ${-2 * m}$，所以 $n = ${answer}$。\n\n**检验。** $${answer}$ 是奇数，$f(${answer}) = -\\frac{${answer} + 1}{2} = -\\frac{${answer + 1}}{2} = ${m}$。`,
            ],
      ),
      [
        say(
          String(Math.abs(m)),
          `The position is not the size of the integer: the list alternates signs, so $${m}$ sits further along.`,
          `位置不是整数的大小：列表正负交替，所以 $${m}$ 排得更靠后。`,
        ),
        say(
          String(other),
          `$f(${other})$ uses the ${other % 2 === 0 ? "even" : "odd"} branch, which gives $${other % 2 === 0 ? other / 2 : -(other + 1) / 2}$, not $${m}$.`,
          `$f(${other})$ 用的是${other % 2 === 0 ? "偶数" : "奇数"}分支，得 $${other % 2 === 0 ? other / 2 : -(other + 1) / 2}$，而不是 $${m}$。`,
        ),
        say(
          String(answer + 1),
          `$f(${answer + 1}) = ${(answer + 1) % 2 === 0 ? (answer + 1) / 2 : -(answer + 2) / 2}$; the list starts at $n = 0$, not $n = 1$.`,
          `$f(${answer + 1}) = ${(answer + 1) % 2 === 0 ? (answer + 1) / 2 : -(answer + 2) / 2}$；列表从 $n = 0$ 开始，而不是 $n = 1$。`,
        ),
      ].filter((x, i, all) => x.response !== String(answer) && all.findIndex((y) => y.response === x.response) === i),
    );
  },
);

const detEffect = point(
  "how-a-row-operation-changes-the-determinant",
  ["How a row operation changes the determinant", "行运算如何改变行列式"],
  [
    "The three row operations act differently on the determinant. A swap changes its sign, scaling a row multiplies it by the scale factor, and adding a multiple of one row to another leaves it unchanged, which is why elimination can be used to compute determinants. From $\\det A = 5$: a swap gives $-5$, tripling a row gives $15$, and $R_2 + 4R_1 \\to R_2$ keeps $5$.\n\n> **Watch out.** Adding a multiple of a row never changes the determinant, whatever the multiple. A scaling multiplies by its factor; it does not add it.",
    "三种行运算对行列式的作用不同。交换两行使它变号，把一行乘以常数使它乘以这个常数，把一行的倍数加到另一行则不改变它，这就是可以用消元计算行列式的原因。由 $\\det A = 5$：交换得 $-5$，某行乘以 $3$ 得 $15$，$R_2 + 4R_1 \\to R_2$ 仍为 $5$。\n\n> **注意。** 把一行的倍数加到另一行，不论倍数多少，行列式都不变。数乘是乘以因子，不是加上它。",
  ],
  (rng) => {
    const d = nz(rng, 12);
    const c = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
    const kind = rng.int(0, 2);
    const op = ["R_{1} \\leftrightarrow R_{3}", `${c}R_{2} \\to R_{2}`, `${poly([1, "R_{3}"], [c, "R_{1}"])} \\to R_{3}`][kind] as string;
    const answer = [-d, c * d, d][kind] as number;
    const factor = [-1, c, 1][kind] as number;
    const name = (
      [
        ["The operation swaps two rows, which multiplies the determinant by $-1$.", "该运算交换两行，使行列式乘以 $-1$。"],
        [
          `The operation scales row $2$ by $${c}$, which multiplies the determinant by $${c}$.`,
          `该运算把第 $2$ 行乘以 $${c}$，使行列式乘以 $${c}$。`,
        ],
        [
          "The operation adds a multiple of row $1$ to row $3$, which multiplies the determinant by $1$.",
          "该运算把第 $1$ 行的倍数加到第 $3$ 行，使行列式乘以 $1$。",
        ],
      ] as const
    )[kind] as Pair;
    const undo = (
      [
        [`Swapping rows $1$ and $3$ back turns $${answer}$ into $${d}$ again.`, `再交换第 $1$、$3$ 行，$${answer}$ 又变回 $${d}$。`],
        [
          `Scaling row $2$ by $\\frac{1}{${c}}$ turns $${answer}$ back into $${d}$.`,
          `把第 $2$ 行乘以 $\\frac{1}{${c}}$，$${answer}$ 又变回 $${d}$。`,
        ],
        [
          `Subtracting the same multiple again restores the matrix, and the determinant stays $${d}$ throughout.`,
          `再减去同样的倍数就还原了矩阵，行列式始终是 $${d}$。`,
        ],
      ] as const
    )[kind] as Pair;
    return numberProblem({
      prompt: text([
        `A $3 \\times 3$ matrix has determinant $${d}$. Find the determinant after the operation $${op}$.`,
        `一个 $3 \\times 3$ 矩阵的行列式是 $${d}$。求进行运算 $${op}$ 后的行列式。`,
      ]),
      answer,
      mistakes: [
        why(
          d,
          "This operation changes the determinant; only adding a multiple of a row leaves it unchanged.",
          "这个运算会改变行列式；只有加上一行的倍数才不改变它。",
        ),
        why(-d, "Only a swap changes the sign; this operation is not a swap.", "只有交换才改变符号；这个运算不是交换。"),
        why(
          c * d,
          `Only scaling a row multiplies the determinant by $${c}$; here $${c}$ is not a scale factor.`,
          `只有数乘一行才使行列式乘以 $${c}$；这里 $${c}$ 不是数乘因子。`,
        ),
        why(
          c + d,
          `No row operation adds $${c}$ to the determinant: a scaling multiplies, and a row addition changes nothing.`,
          `没有哪种行运算会给行列式加上 $${c}$：数乘是相乘，行倍加则不改变。`,
        ),
      ].filter((w, x, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === x),
      solution: walked(
        [
          [["Name the operation", "认出运算类型"], text(name)],
          [
            ["Apply the factor", "乘上因子"],
            t(`$${wrap(factor)} \\cdot ${wrap(d)} = ${answer}$.`, `$${wrap(factor)} \\cdot ${wrap(d)} = ${answer}$。`),
          ],
        ],
        text(undo),
      ),
    });
  },
);

const columnClear = point(
  "clearing-an-entry-with-a-column-operation",
  ["Clearing an entry with a column operation", "用列运算消去元素"],
  [
    "Zeros can be created with column operations as well as row operations. The operation $C_{2} - mC_{1} \\to C_{2}$ clears the $(1, 2)$ entry when $m$ is that entry divided by the $(1, 1)$ entry, and it also changes the entry below by $m$ times the entry to its left. In $\\begin{pmatrix} 2 & 6 \\\\ 1 & 5 \\end{pmatrix}$, $m = 3$ and the new $(2, 2)$ entry is $5 - 3 \\cdot 1 = 2$.\n\n> **Watch out.** A column operation works down the columns: the $(2, 2)$ entry loses $m$ times the $(2, 1)$ entry, the one to its left, not the $(1, 1)$ entry above.",
    "零元素既可以用行运算产生，也可以用列运算产生。当 $m$ 等于 $(1, 2)$ 元素除以 $(1, 1)$ 元素时，运算 $C_{2} - mC_{1} \\to C_{2}$ 消去 $(1, 2)$ 元素，同时下面的元素要减去 $m$ 乘以它左边的元素。在 $\\begin{pmatrix} 2 & 6 \\\\ 1 & 5 \\end{pmatrix}$ 中，$m = 3$，新的 $(2, 2)$ 元素为 $5 - 3 \\cdot 1 = 2$。\n\n> **注意。** 列运算是沿列进行的：$(2, 2)$ 元素减去的是 $m$ 乘以 $(2, 1)$ 元素，即它左边的元素，而不是上面的 $(1, 1)$ 元素。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const m = nz(rng, 5);
    const c = nz(rng, 7);
    const d = nz(rng, 9);
    const answer = d - m * c;
    const M = mat([
      [a, m * a],
      [c, d],
    ]);
    return numberProblem({
      prompt: text([
        `A column operation $C_{2} - mC_{1} \\to C_{2}$ clears the $(1, 2)$ entry of $${M}$. Find the new $(2, 2)$ entry.`,
        `列运算 $C_{2} - mC_{1} \\to C_{2}$ 消去 $${M}$ 的 $(1, 2)$ 元素。求新的 $(2, 2)$ 元素。`,
      ]),
      answer,
      mistakes: [
        why(d + m * c, "The sign is wrong: the operation subtracts $m$ times column $1$.", "符号错了：该运算减去的是第 $1$ 列的 $m$ 倍。"),
        why(
          d,
          "The operation changes the whole of column $2$, so the $(2, 2)$ entry changes too.",
          "该运算改变整个第 $2$ 列，所以 $(2, 2)$ 元素也会改变。",
        ),
        why(
          d - m * a,
          "That subtracts $m$ times the $(1, 1)$ entry; in row $2$ the entry of column $1$ is the $(2, 1)$ entry.",
          "这减去的是 $m$ 乘以 $(1, 1)$ 元素；第 $2$ 行中第 $1$ 列的元素是 $(2, 1)$ 元素。",
        ),
      ].filter((w, x, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === x),
      solution: walked(
        [
          [["Find $m$", "求 $m$"], t("", ""), [`m = \\frac{${m * a}}{${a}} = ${m}`]],
          [["Change the entry below", "改变下方的元素"], t("", ""), [`${d} - ${wrap(m)} \\cdot ${wrap(c)} = ${answer}`]],
        ],
        t(
          `The $(1, 2)$ entry becomes $${m * a} - ${wrap(m)} \\cdot ${wrap(a)} = 0$, so $m = ${m}$ is the right multiplier.`,
          `$(1, 2)$ 元素变为 $${m * a} - ${wrap(m)} \\cdot ${wrap(a)} = 0$，所以 $m = ${m}$ 是正确的乘数。`,
        ),
      ),
    });
  },
);

const breakdownK = point(
  "the-coefficient-that-makes-the-second-pivot-vanish",
  ["The coefficient that makes the second pivot vanish", "使第二个主元消失的系数"],
  [
    "Elimination on a $2 \\times 2$ system gives a second pivot that depends on the entries. Elimination breaks down exactly when this pivot is zero, which means the second row of the coefficient matrix is a multiple of the first, whatever the right-hand side is. For $x + 2y = 1$, $3x + ky = 0$, the second pivot is $k - 6$, which vanishes at $k = 6$.\n\n> **Watch out.** The second pivot is $k$ minus the multiplier times the first row's $y$-coefficient, so $k$ is a product, not a sum. The right-hand sides play no part.",
    "对 $2 \\times 2$ 方程组消元，得到的第二个主元依赖于各个元素。当且仅当这个主元为零时消元失败，这意味着系数矩阵的第二行是第一行的倍数，与右端无关。对 $x + 2y = 1$，$3x + ky = 0$，第二个主元是 $k - 6$，在 $k = 6$ 时为零。\n\n> **注意。** 第二个主元是 $k$ 减去乘数与第一行 $y$ 系数之积，所以 $k$ 是积而不是和。右端常数不起作用。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const c = nz(rng, 6);
    const b = rng.int(-9, 9);
    const d = rng.int(-9, 9);
    const answer = a * c;
    return numberProblem({
      prompt: text([
        `For which $k$ does Gaussian elimination on $\\begin{cases} ${poly([1, "x"], [a, "y"])} = ${b} \\\\ ${poly([c, "x"], [1, "ky"])} = ${d} \\end{cases}$ give a second pivot of zero?`,
        `当 $k$ 为何值时，对 $\\begin{cases} ${poly([1, "x"], [a, "y"])} = ${b} \\\\ ${poly([c, "x"], [1, "ky"])} = ${d} \\end{cases}$ 做高斯消元时第二个主元为零？`,
      ]),
      answer,
      solveFor: "k",
      mistakes: [
        why(
          -answer,
          "The sign is flipped: the second pivot is $k$ minus the product, so $k$ equals the product.",
          "符号反了：第二个主元是 $k$ 减去该积，所以 $k$ 等于这个积。",
        ),
        why(
          a + c,
          "That adds the entries; the multiplier multiplies the $y$-coefficient of row $1$.",
          "这是把元素相加；乘数要乘以第 $1$ 行的 $y$ 系数。",
        ),
        why(
          a,
          "That is the $y$-coefficient of row $1$ alone; it must be multiplied by the multiplier.",
          "这只是第 $1$ 行的 $y$ 系数；还要乘以乘数。",
        ),
      ].filter((w, x, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === x),
      solution: walked(
        [
          [
            ["Clear the $x$-term", "消去 $x$ 项"],
            t(
              `Use $${poly([1, "R_{2}"], [-c, "R_{1}"])} \\to R_{2}$; the multiplier is $${c}$.`,
              `用 $${poly([1, "R_{2}"], [-c, "R_{1}"])} \\to R_{2}$；乘数是 $${c}$。`,
            ),
          ],
          [
            ["Set the second pivot to zero", "令第二个主元为零"],
            t("", ""),
            [`k - ${wrap(c)} \\cdot ${wrap(a)} = 0 \\implies k = ${answer}`],
          ],
        ],
        t(
          `With $k = ${answer}$, row $2$ of the coefficients is $(${c}, ${answer}) = ${wrap(c)} \\cdot (1, ${a})$, a multiple of row $1$, so elimination leaves no pivot.`,
          `$k = ${answer}$ 时，系数的第 $2$ 行为 $(${c}, ${answer}) = ${wrap(c)} \\cdot (1, ${a})$，是第 $1$ 行的倍数，所以消元后没有主元。`,
        ),
      ),
    });
  },
);

const lineOfSolutions = point(
  "reading-a-point-on-the-solution-line",
  ["Reading a point on the solution line", "读取解直线上的点"],
  [
    "When a singular system is consistent, elimination leaves one equation, and one variable is free. Each choice of the free variable gives a solution, and the other variable is then determined, so the solutions form a line rather than a single point. For $x + 2y = 5$ drawn twice, $y = 1$ gives $x = 3$ and $y = 2$ gives $x = 1$.\n\n> **Watch out.** Divide out the common factor first so that the equation reads $x + ay = b$, then move $ay$ across with its sign: $x = b - ay$.",
    "当奇异方程组相容时，消元后只剩一个方程，有一个变量是自由的。自由变量的每种取值都给出一个解，另一个变量随之确定，所以解构成一条直线，而不是一个点。对重复出现的 $x + 2y = 5$，$y = 1$ 给出 $x = 3$，$y = 2$ 给出 $x = 1$。\n\n> **注意。** 先约去公因子，使方程成为 $x + ay = b$，再把 $ay$ 连同符号移过去：$x = b - ay$。",
  ],
  (rng) => {
    const p = nz(rng, 4);
    const q = nz(rng, 3) * p;
    const a = nz(rng, 6);
    const b = rng.int(-9, 9);
    const Y = nz(rng, 6);
    const answer = b - a * Y;
    return numberProblem({
      prompt: text([
        `The system $\\begin{cases} ${poly([p, "x"], [p * a, "y"])} = ${p * b} \\\\ ${poly([q, "x"], [q * a, "y"])} = ${q * b} \\end{cases}$ has infinitely many solutions. Find $x$ in the solution with $y = ${Y}$.`,
        `方程组 $\\begin{cases} ${poly([p, "x"], [p * a, "y"])} = ${p * b} \\\\ ${poly([q, "x"], [q * a, "y"])} = ${q * b} \\end{cases}$ 有无穷多解。求 $y = ${Y}$ 的那个解中的 $x$。`,
      ]),
      answer,
      mistakes: [
        why(b + a * Y, "The term with $y$ was moved across without changing its sign.", "含 $y$ 的项移过去时没有变号。"),
        why(
          b - Y,
          `The coefficient of $y$ is missing: after dividing by $${p}$ it is $${a}$, not $1$.`,
          `漏了 $y$ 的系数：除以 $${p}$ 后它是 $${a}$，不是 $1$。`,
        ),
        why(
          Y,
          "That is the value of $y$ given in the question; $x$ comes from the remaining equation.",
          "这是题目给出的 $y$ 值；$x$ 要由剩下的方程求出。",
        ),
        why(
          p * b - p * a * Y,
          `The common factor $${p}$ was not divided out of the first equation.`,
          `没有从第一个方程中约去公因子 $${p}$。`,
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Reduce to one equation", "化为一个方程"],
            t(
              `The second equation is $${q / p}$ times the first, so elimination leaves one equation. Dividing the first by $${p}$ gives $${poly([1, "x"], [a, "y"])} = ${b}$.`,
              `第二个方程是第一个的 $${q / p}$ 倍，所以消元后只剩一个方程。把第一个方程除以 $${p}$，得 $${poly([1, "x"], [a, "y"])} = ${b}$。`,
            ),
          ],
          [["Substitute the free variable", "代入自由变量"], t("", ""), [`x = ${b} - ${wrap(a)} \\cdot ${wrap(Y)} = ${answer}`]],
        ],
        t(
          `In the second equation, $${q} \\cdot ${wrap(answer)} + ${wrap(q * a)} \\cdot ${wrap(Y)} = ${q * b}$.`,
          `代入第二个方程：$${q} \\cdot ${wrap(answer)} + ${wrap(q * a)} \\cdot ${wrap(Y)} = ${q * b}$。`,
        ),
      ),
    });
  },
);

const pairSums = point(
  "three-unknowns-from-their-pairwise-sums",
  ["Three unknowns from their pairwise sums", "由两两之和求三个未知数"],
  [
    "If the sums of three unknowns in pairs are known, elimination gives each unknown. Each appears in two of the equations, so adding all three gives twice the total, and subtracting the equation that omits a variable isolates that variable. From $x + y = 5$, $y + z = 7$, $x + z = 6$: the total is $\\frac{18}{2} = 9$, so $x = 9 - 7 = 2$.\n\n> **Watch out.** Adding the three equations counts each unknown twice, so halve the sum before subtracting. Then subtract the equation that leaves out the unknown you want.",
    "如果已知三个未知数的两两之和，消元就能得到每个未知数。每个未知数出现在两个方程中，所以三个方程相加得到总和的两倍，再减去不含某变量的方程，就能分离出这个变量。由 $x + y = 5$，$y + z = 7$，$x + z = 6$：总和为 $\\frac{18}{2} = 9$，所以 $x = 9 - 7 = 2$。\n\n> **注意。** 三个方程相加时每个未知数都算了两次，所以先除以 $2$ 再相减。然后减去不含所求未知数的那个方程。",
  ],
  (rng) => {
    const x = rng.int(-9, 9);
    const y = rng.int(-9, 9);
    const z = rng.int(-9, 9);
    const a = x + y;
    const b = y + z;
    const c = x + z;
    const which = rng.int(0, 2);
    const answer = [x, y, z][which] as number;
    const other = [b, c, a][which] as number;
    const name = ["x", "y", "z"][which] as string;
    const half = Q.of(a + b + c, 2);
    return numberProblem({
      prompt: text([
        `Solve $x + y = ${a}$, $y + z = ${b}$, $x + z = ${c}$. Find $${name}$.`,
        `解方程组 $x + y = ${a}$，$y + z = ${b}$，$x + z = ${c}$。求 $${name}$。`,
      ]),
      answer,
      mistakes: [
        why(
          a + b + c - other,
          "The sum of the three equations is twice $x + y + z$; halve it before subtracting.",
          "三个方程之和是 $x + y + z$ 的两倍；相减之前要先除以 $2$。",
        ),
        why(
          half,
          "That is the total $x + y + z$; subtract the equation without the unknown you want.",
          "这是总和 $x + y + z$；还要减去不含所求未知数的方程。",
        ),
        why(
          2 * answer,
          "That is twice the unknown: the halving was skipped or done twice.",
          "这是未知数的两倍：漏了除以 $2$，或多除了一次。",
        ),
      ].filter(
        (w, i, all) =>
          !Q.of(answer).eq(typeof w.value === "number" ? Q.of(w.value) : w.value) &&
          all.findIndex((o) => `${o.value}` === `${w.value}`) === i,
      ),
      solution: walked(
        [
          [
            ["Add all three equations", "三个方程相加"],
            t(
              `Each unknown appears twice: $2(x + y + z) = ${a} + ${wrap(b)} + ${wrap(c)} = ${a + b + c}$, so $x + y + z = ${half.toLatex()}$.`,
              `每个未知数出现两次：$2(x + y + z) = ${a} + ${wrap(b)} + ${wrap(c)} = ${a + b + c}$，所以 $x + y + z = ${half.toLatex()}$。`,
            ),
          ],
          [
            [`Remove the pair without $${name}$`, `减去不含 $${name}$ 的一对`],
            t("", ""),
            [`${name} = ${half.toLatex()} - ${wrap(other)} = ${answer}`],
          ],
        ],
        t(
          `The other two unknowns follow the same way: $x = ${x}$, $y = ${y}$, $z = ${z}$, and then $x + y = ${a}$, $y + z = ${b}$, $x + z = ${c}$ as given.`,
          `另外两个未知数同样求出：$x = ${x}$，$y = ${y}$，$z = ${z}$，于是 $x + y = ${a}$，$y + z = ${b}$，$x + z = ${c}$，与题设一致。`,
        ),
      ),
    });
  },
);

const pivotAfterReducing = point(
  "pivot-columns-of-a-matrix-not-in-echelon-form",
  ["Pivot columns of a matrix not in echelon form", "非阶梯形矩阵的主元列"],
  [
    "The pivot columns of a matrix are found by reducing it, and the leading entries of the original rows do not show them. A column that is a multiple of an earlier column can never hold a pivot, since it reduces to the same multiple of the reduced column. In $\\begin{pmatrix} 1 & 2 & 1 \\\\ 2 & 4 & 5 \\end{pmatrix}$, $R_2 - 2R_1$ gives $(0, 0, 3)$, so the second pivot is in column $3$, not column $2$.\n\n> **Watch out.** Eliminate below the first pivot before looking for the next one. A nonzero entry in the original matrix may become zero, so the next pivot is the leftmost column that is still nonzero below row $1$.",
    "矩阵的主元列要通过化简才能找到，原来各行的首元并不能说明它们。是前面某列倍数的列不可能含主元，因为它化简后仍是化简后那一列的同一倍数。在 $\\begin{pmatrix} 1 & 2 & 1 \\\\ 2 & 4 & 5 \\end{pmatrix}$ 中，$R_2 - 2R_1$ 得 $(0, 0, 3)$，所以第二个主元在第 $3$ 列，而不在第 $2$ 列。\n\n> **注意。** 先消去第一个主元下方的元素，再找下一个主元。原矩阵中的非零元素可能变成零，所以下一个主元在第 $1$ 行以下仍非零的最左边一列。",
  ],
  (rng) => {
    const m = nz(rng, 4);
    const p = nz(rng, 3);
    const q = rng.int(-4, 4);
    const e = rng.int(-4, 4);
    const f = rng.int(-4, 4);
    const s = nz(rng, 3);
    const u = nz(rng, 3);
    const v = nz(rng, 2);
    const column = rng.int(2, 4);
    const w = [
      [0, 1, e, f],
      [0, 0, 1, f],
      [0, 0, 0, 1],
    ][column - 2] as number[];
    const r1 = [1, m, p, q];
    const row = (k: number, l: number) => r1.map((entry, i) => k * entry + l * (w[i] as number));
    const r2 = row(s, 1);
    const r3 = row(u, v);
    const vw = w.map((x) => v * x);
    return numberProblem({
      prompt: text([
        `$A = ${mat([r1, r2, r3])}$ has rank $2$. Column $1$ is a pivot column. Which column is the second pivot column?`,
        `$A = ${mat([r1, r2, r3])}$ 的秩是 $2$。第 $1$ 列是主元列。第二个主元列是哪一列？`,
      ]),
      answer: column,
      mistakes: [
        why(1, "Column $1$ holds the first pivot; the question asks for the second.", "第 $1$ 列含第一个主元；题目问的是第二个。"),
        ...[2, 3, 4]
          .filter((c) => c !== column)
          .map((c) =>
            c < column
              ? why(
                  c,
                  `After eliminating below the first pivot, column $${c}$ has only zeros in rows $2$ and $3$, so it holds no pivot.`,
                  `消去第一个主元下方的元素后，第 $${c}$ 列在第 $2$、$3$ 行全是零，所以不含主元。`,
                )
              : why(
                  c,
                  `A column further left is already nonzero below row $1$ after elimination, and the next pivot takes the leftmost such column.`,
                  `消元后更靠左的一列在第 $1$ 行以下已经非零，下一个主元取最左边的这样一列。`,
                ),
          ),
      ],
      solution: walked(
        [
          [
            ["Eliminate below the first pivot", "消去第一个主元下方的元素"],
            t(
              `$${poly([1, "R_{2}"], [-s, "R_{1}"])} \\to R_{2}$ and $${poly([1, "R_{3}"], [-u, "R_{1}"])} \\to R_{3}$ leave rows $(${w.join(", ")})$ and $(${vw.join(", ")})$.`,
              `$${poly([1, "R_{2}"], [-s, "R_{1}"])} \\to R_{2}$ 与 $${poly([1, "R_{3}"], [-u, "R_{1}"])} \\to R_{3}$ 留下行 $(${w.join(", ")})$ 与 $(${vw.join(", ")})$。`,
            ),
          ],
          [
            ["Find the next leading entry", "找下一个首元"],
            t(
              `The first nonzero entry of $(${w.join(", ")})$ is in column $${column}$, so the second pivot column is column $${column}$.`,
              `$(${w.join(", ")})$ 的第一个非零元素在第 $${column}$ 列，所以第二个主元列是第 $${column}$ 列。`,
            ),
          ],
        ],
        t(
          `$${poly([1, "R_{3}"], [-v, "R_{2}"])} \\to R_{3}$ then clears row $3$ completely, leaving two nonzero rows: rank $2$, as stated.`,
          `再做 $${poly([1, "R_{3}"], [-v, "R_{2}"])} \\to R_{3}$，第 $3$ 行全部消为零，剩下两个非零行：秩为 $2$，与题设一致。`,
        ),
      ),
    });
  },
);

const rankDecides = point(
  "comparing-the-two-ranks-of-a-system",
  ["Comparing the two ranks of a system", "比较方程组的两个秩"],
  [
    "The number of solutions of a linear system follows from three numbers: the rank of $A$, the rank of the augmented matrix and the number of unknowns. Different ranks mean no solution. Equal ranks give one solution when they equal the number of unknowns and infinitely many otherwise. With $4$ unknowns and both ranks $3$, one variable is free: infinitely many solutions.\n\n> **Watch out.** Compare the common rank with the number of unknowns, not with the number of equations. Extra equations can be redundant and change nothing.",
    "线性方程组解的个数由三个数决定：$A$ 的秩、增广矩阵的秩和未知数的个数。两个秩不同表示无解。秩相同时，若等于未知数个数则有唯一解，否则有无穷多解。$4$ 个未知数、两个秩都是 $3$ 时，有一个自由变量：无穷多解。\n\n> **注意。** 要把共同的秩与未知数个数比较，而不是与方程个数比较。多出来的方程可能是多余的，什么也不改变。",
  ],
  (rng) => {
    const m = rng.int(2, 7);
    const kind = rng.int(0, 2);
    let n: number;
    let r: number;
    let r2: number;
    if (kind === 0) {
      n = rng.int(2, 7);
      r = rng.int(1, Math.min(m - 1, n));
      r2 = r + 1;
    } else if (kind === 1) {
      n = rng.int(2, m);
      r = n;
      r2 = r;
    } else {
      n = rng.int(2, 7);
      r = rng.int(1, Math.min(m, n - 1));
      r2 = r;
    }
    const options: Pair[] = [
      ["No solution", "无解"],
      ["Exactly one solution", "恰有一个解"],
      ["Infinitely many solutions", "无穷多解"],
    ];
    const correct = options[kind] as Pair;
    const wrongs = [...options.filter((o) => o !== correct), ["Exactly two solutions", "恰有两个解"] as Pair];
    const whys: Pair[] = [
      [
        `The ranks differ, $${r} \\ne ${r2}$, so the last pivot lies in the right-hand column and the system is inconsistent.`,
        `两个秩不同，$${r} \\ne ${r2}$，所以最后一个主元在右端列，方程组不相容。`,
      ],
      [
        `Both ranks equal $${r}$, the number of unknowns, so no variable is free and the solution is unique.`,
        `两个秩都等于未知数个数 $${r}$，没有自由变量，解唯一。`,
      ],
      [
        `Both ranks equal $${r}$, less than the $${n}$ unknowns, so $${n - r}$ variables are free.`,
        `两个秩都等于 $${r}$，小于未知数个数 $${n}$，所以有 $${n - r}$ 个自由变量。`,
      ],
    ];
    const compare: Pair =
      r === r2
        ? [`The two ranks are equal, both $${r}$, so the system is consistent.`, `两个秩相等，都是 $${r}$，所以方程组相容。`]
        : [`The ranks differ: $${r} \\ne ${r2}$.`, `两个秩不同：$${r} \\ne ${r2}$。`];
    const checks: Pair[] = [
      [
        `$\\operatorname{rank}([A \\mid \\mathbf{b}])$ exceeds $\\operatorname{rank}(A)$ by one, which happens only when elimination leaves a row $[0 \\ \\cdots \\ 0 \\mid c]$ with $c \\ne 0$.`,
        `$\\operatorname{rank}([A \\mid \\mathbf{b}])$ 比 $\\operatorname{rank}(A)$ 大 $1$，只有消元留下 $c \\ne 0$ 的行 $[0 \\ \\cdots \\ 0 \\mid c]$ 时才会这样。`,
      ],
      [`$${n} - ${r} = 0$ free variables, so the solution has no parameter.`, `自由变量个数为 $${n} - ${r} = 0$，所以解中没有参数。`],
      [
        `$${n} - ${r} = ${n - r}$ free variable${n - r === 1 ? "" : "s"}, each of which can take any value.`,
        `自由变量个数为 $${n} - ${r} = ${n - r}$，每个都可以任意取值。`,
      ],
    ];
    const said = whys[kind] as Pair;
    const check = checks[kind] as Pair;
    const choice = choose(
      rng,
      [
        `A system of $${m}$ equations in $${n}$ unknowns has $\\operatorname{rank}(A) = ${r}$ and $\\operatorname{rank}([A \\mid \\mathbf{b}]) = ${r2}$. How many solutions does it have?`,
        `一个有 $${m}$ 个方程、$${n}$ 个未知数的方程组满足 $\\operatorname{rank}(A) = ${r}$，$\\operatorname{rank}([A \\mid \\mathbf{b}]) = ${r2}$。它有多少个解？`,
      ],
      correct,
      wrongs,
      [
        `**Step 1: Compare the ranks.** ${compare[0]}\n\n**Step 2: Decide.** ${said[0]}\n\n**Check.** ${check[0]}`,
        `**第一步：比较两个秩。** ${compare[1]}\n\n**第二步：下结论。** ${said[1]}\n\n**检验。** ${check[1]}`,
      ],
    );
    return reasoned(choice, [
      ["No solution", "The two ranks are equal, so elimination leaves no contradictory row.", "两个秩相等，所以消元不会留下矛盾的行。"],
      [
        "Exactly one solution",
        r === r2
          ? `The rank $${r}$ is less than the $${n}$ unknowns, so some variables are free.`
          : "The ranks differ, so the system has no solution at all.",
        r === r2 ? `秩 $${r}$ 小于未知数个数 $${n}$，所以有自由变量。` : "两个秩不同，所以方程组根本无解。",
      ],
      [
        "Infinitely many solutions",
        r === r2
          ? `The rank equals the $${n}$ unknowns, so no variable is free.`
          : "The ranks differ, so the system has no solution at all.",
        r === r2 ? `秩等于未知数个数 $${n}$，所以没有自由变量。` : "两个秩不同，所以方程组根本无解。",
      ],
      [
        "Exactly two solutions",
        "A linear system never has exactly two solutions: with two, every point of the line through them would be a solution too.",
        "线性方程组不可能恰有两个解：若有两个解，过它们的直线上每一点都是解。",
      ],
    ]);
  },
);

const detOfElementary = point(
  "the-determinant-of-an-elementary-matrix",
  ["The determinant of an elementary matrix", "初等矩阵的行列式"],
  [
    "An elementary matrix comes from doing one row operation on the identity, so its determinant records the effect of the operation. A shear has determinant $1$, a scaling has the scale factor, and a swap has $-1$, and in every case this is nonzero, so the matrix is invertible. For example, $\\begin{pmatrix} 1 & 0 \\\\ 0 & 4 \\end{pmatrix}$ has determinant $4$ and $\\begin{pmatrix} 1 & 4 \\\\ 0 & 1 \\end{pmatrix}$ has determinant $1$.\n\n> **Watch out.** The multiplier of a shear sits off the diagonal and does not change the determinant; only a scaling puts its factor into $\\det E$.",
    "初等矩阵由对单位矩阵做一次行运算得到，所以它的行列式记录了这个运算的效果。剪切的行列式是 $1$，缩放的行列式是缩放因子，交换的行列式是 $-1$，而且都不为零，所以矩阵可逆。例如 $\\begin{pmatrix} 1 & 0 \\\\ 0 & 4 \\end{pmatrix}$ 的行列式是 $4$，$\\begin{pmatrix} 1 & 4 \\\\ 0 & 1 \\end{pmatrix}$ 的行列式是 $1$。\n\n> **注意。** 剪切的乘数在对角线之外，不改变行列式；只有缩放才把它的因子带进 $\\det E$。",
  ],
  (rng) => {
    const c = rng.pick([-9, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
    const kind = rng.int(0, 4);
    const E = [
      mat([
        [1, 0],
        [c, 1],
      ]),
      mat([
        [1, c],
        [0, 1],
      ]),
      mat([
        [c, 0],
        [0, 1],
      ]),
      mat([
        [1, 0],
        [0, c],
      ]),
      mat([
        [0, 1],
        [1, 0],
      ]),
    ][kind] as string;
    const answer = [1, 1, c, c, -1][kind] as number;
    const group = [0, 0, 1, 1, 2][kind] as number;
    const namings: Pair[] = [
      ["This matrix adds a multiple of one row to the other, a shear.", "这个矩阵把一行的倍数加到另一行，是剪切。"],
      [`This matrix scales one row by $${c}$.`, `这个矩阵把一行乘以 $${c}$。`],
      ["This matrix swaps the two rows.", "这个矩阵交换两行。"],
    ];
    const effects: Pair[] = [
      ["A shear leaves the determinant of $I$ unchanged, so the determinant is $1$.", "剪切不改变 $I$ 的行列式，所以行列式是 $1$。"],
      [`Scaling a row by $${c}$ multiplies the determinant by $${c}$.`, `一行乘以 $${c}$ 使行列式乘以 $${c}$。`],
      ["Swapping two rows reverses the sign, so the determinant is $-1$.", "交换两行使行列式变号，所以行列式是 $-1$。"],
    ];
    const named = namings[group] as Pair;
    const product = [
      kind === 0 ? `1 \\cdot 1 - 0 \\cdot ${wrap(c)} = 1` : `1 \\cdot 1 - ${wrap(c)} \\cdot 0 = 1`,
      kind === 2 ? `${wrap(c)} \\cdot 1 - 0 \\cdot 0 = ${c}` : `1 \\cdot ${wrap(c)} - 0 \\cdot 0 = ${c}`,
      `0 \\cdot 0 - 1 \\cdot 1 = -1`,
    ][group] as string;
    const mistakes = [
      [
        why(
          c,
          "The multiplier is off the diagonal; the determinant of a triangular matrix is the product of its diagonal, $1 \\cdot 1$.",
          "乘数在对角线之外；三角矩阵的行列式是对角元素之积 $1 \\cdot 1$。",
        ),
        why(
          0,
          "The diagonal entries are both $1$, so the determinant is $1$, not $0$.",
          "对角元素都是 $1$，所以行列式是 $1$，而不是 $0$。",
        ),
        why(-1, "Only a swap changes the sign; a shear keeps it.", "只有交换改变符号；剪切不改变。"),
      ],
      [
        why(
          1,
          `The diagonal holds $${c}$, so the product of the diagonal is $${c}$, not $1$.`,
          `对角线上有 $${c}$，所以对角元素之积是 $${c}$，而不是 $1$。`,
        ),
        why(-c, "Scaling a row does not bring in a sign change.", "数乘一行不会带来符号变化。"),
      ],
      [
        why(1, "A swap reverses the sign of $\\det I = 1$.", "交换使 $\\det I = 1$ 变号。"),
        why(
          0,
          "The diagonal is zero but the matrix is not triangular: $ad - bc = 0 - 1$.",
          "对角线为零，但矩阵不是三角矩阵：$ad - bc = 0 - 1$。",
        ),
      ],
    ][group] as ReturnType<typeof why>[];
    return numberProblem({
      prompt: text([`Find the determinant of the elementary matrix $${E}$.`, `求初等矩阵 $${E}$ 的行列式。`]),
      answer,
      mistakes: mistakes.filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [["Name the row operation", "说出行运算"], text(named)],
          [["Read off its effect", "读出它的效果"], text(effects[group] as Pair)],
        ],
        t(`By $ad - bc$: $${product}$.`, `用 $ad - bc$：$${product}$。`),
      ),
    });
  },
);

const rightMultiply = point(
  "multiplying-on-the-right-acts-on-columns",
  ["Multiplying on the right acts on columns", "右乘作用于列"],
  [
    "Multiplying by an elementary matrix on the left performs a row operation, and multiplying on the right performs a column operation. So $AE$ with $E = \\begin{pmatrix} 1 & 0 \\\\ c & 1 \\end{pmatrix}$ adds $c$ times column $2$ to column $1$ of $A$, which changes the first row too. With $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$ and $c = 3$, column $1$ of $AE$ is $(1 + 3 \\cdot 2, 3 + 3 \\cdot 4) = (7, 15)$.\n\n> **Watch out.** On the right, the entry $c$ in row $2$, column $1$ of $E$ adds column $2$ to column $1$, the reverse of what the same $E$ does to rows on the left.",
    "左乘初等矩阵做行运算，右乘初等矩阵做列运算。所以当 $E = \\begin{pmatrix} 1 & 0 \\\\ c & 1 \\end{pmatrix}$ 时，$AE$ 把 $A$ 的第 $2$ 列的 $c$ 倍加到第 $1$ 列，这也会改变第一行。取 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$，$c = 3$，$AE$ 的第 $1$ 列为 $(1 + 3 \\cdot 2, 3 + 3 \\cdot 4) = (7, 15)$。\n\n> **注意。** 右乘时，$E$ 第 $2$ 行第 $1$ 列的 $c$ 把第 $2$ 列加到第 $1$ 列，与同一个 $E$ 左乘时对行的作用方向相反。",
  ],
  (rng) => {
    const a = nz(rng, 7);
    const b = nz(rng, 7);
    const p = rng.int(-7, 7);
    const q = rng.int(-7, 7);
    const c = nz(rng, 5);
    const answer = a + c * b;
    const A = mat([
      [a, b],
      [p, q],
    ]);
    const E = mat([
      [1, 0],
      [c, 1],
    ]);
    const AE = mat([
      [answer, b],
      [p + c * q, q],
    ]);
    return numberProblem({
      prompt: text([`$A = ${A}$ and $E = ${E}$. Find the $(1, 1)$ entry of $AE$.`, `$A = ${A}$，$E = ${E}$。求 $AE$ 的 $(1, 1)$ 元素。`]),
      answer,
      mistakes: [
        why(
          a,
          "That treats $E$ as a row operation on row $2$, which would leave row $1$ alone. On the right, $E$ changes column $1$, row $1$ included.",
          "这是把 $E$ 当成对第 $2$ 行的行运算，那样第 $1$ 行不变。右乘时 $E$ 改变的是第 $1$ 列，包括第 $1$ 行。",
        ),
        why(
          c * a + b,
          `That is the $(1, 2)$ entry of $AE^{T}$: column $1$ added to column $2$. Here $${c}$ times column $2$ is added to column $1$.`,
          `这是 $AE^{T}$ 的 $(1, 2)$ 元素：把第 $1$ 列加到第 $2$ 列。这里是把第 $2$ 列的 $${c}$ 倍加到第 $1$ 列。`,
        ),
        why(a + b, `The multiplier $${c}$ is missing: column $2$ is added $${c}$ times.`, `漏了乘数 $${c}$：第 $2$ 列要加 $${c}$ 倍。`),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Read $E$ as a column operation", "把 $E$ 读作列运算"],
            text([
              `On the right, $E$ acts on columns: column $1$ of $AE$ is column $1$ of $A$ plus $${c}$ times column $2$.`,
              `右乘时 $E$ 作用于列：$AE$ 的第 $1$ 列是 $A$ 的第 $1$ 列加上第 $2$ 列的 $${c}$ 倍。`,
            ]),
          ],
          [
            ["Row 1 of $A$ times column 1 of $E$", "$A$ 的第 1 行乘 $E$ 的第 1 列"],
            t("", ""),
            [`${a} \\cdot 1 + ${wrap(b)} \\cdot ${wrap(c)} = ${answer}`, `AE = ${AE}`],
          ],
        ],
        t(
          `$\\det E = 1$, so $\\det(AE)$ must equal $\\det A = ${a * q - b * p}$: indeed $${wrap(answer)} \\cdot ${wrap(q)} - ${wrap(b)} \\cdot ${wrap(p + c * q)} = ${a * q - b * p}$.`,
          `$\\det E = 1$，所以 $\\det(AE)$ 应等于 $\\det A = ${a * q - b * p}$：确实 $${wrap(answer)} \\cdot ${wrap(q)} - ${wrap(b)} \\cdot ${wrap(p + c * q)} = ${a * q - b * p}$。`,
        ),
      ),
    });
  },
);

const productNotInverse = point(
  "a-product-of-eliminations-picks-up-an-extra-term",
  ["A product of eliminations picks up an extra term", "消元矩阵之积多出一项"],
  [
    "The inverse of a product of elimination matrices just collects the multipliers, which is why $L$ is easy to write. The product itself does not: the row subtracted later has already been changed, so an extra term appears when one operation builds on another. After $R_2 - 2R_1$, $R_3 - R_1$ and $R_3 - 3R_2$, the $(3, 1)$ entry of the product is $-1 + (-3)(-2) = 5$.\n\n> **Watch out.** The answer is not just $-b$: by the time $R_3 - cR_2$ acts, row $2$ already holds $-a$ times row $1$, which adds $ac$.",
    "消元矩阵之积的逆矩阵只是把乘数收集起来，所以 $L$ 很容易写出。乘积本身却不是这样：后面减去的行已经被改变，所以当一个运算以另一个为基础时，会多出一项。经过 $R_2 - 2R_1$、$R_3 - R_1$、$R_3 - 3R_2$ 后，乘积的 $(3, 1)$ 元素为 $-1 + (-3)(-2) = 5$。\n\n> **注意。** 答案不只是 $-b$：$R_3 - cR_2$ 作用时，第 $2$ 行已含第 $1$ 行的 $-a$ 倍，于是多出 $ac$。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = nz(rng, 5);
    const c = nz(rng, 5);
    const answer = a * c - b;
    return numberProblem({
      prompt: text([
        `$E_{1}$, $E_{2}$, $E_{3}$ perform $${poly([1, "R_{2}"], [-a, "R_{1}"])} \\to R_{2}$, then $${poly([1, "R_{3}"], [-b, "R_{1}"])} \\to R_{3}$, then $${poly([1, "R_{3}"], [-c, "R_{2}"])} \\to R_{3}$. Find the $(3, 1)$ entry of $E_{3}E_{2}E_{1}$.`,
        `$E_{1}$、$E_{2}$、$E_{3}$ 依次进行 $${poly([1, "R_{2}"], [-a, "R_{1}"])} \\to R_{2}$、$${poly([1, "R_{3}"], [-b, "R_{1}"])} \\to R_{3}$、$${poly([1, "R_{3}"], [-c, "R_{2}"])} \\to R_{3}$。求 $E_{3}E_{2}E_{1}$ 的 $(3, 1)$ 元素。`,
      ]),
      answer,
      mistakes: [
        why(
          -b,
          `That counts only $E_{2}$. When $E_{3}$ subtracts row $2$, that row already holds $${-a}$ times row $1$, which adds $${wrap(-c)} \\cdot ${wrap(-a)} = ${a * c}$.`,
          `这只算了 $E_{2}$。$E_{3}$ 减去第 $2$ 行时，这一行已含第 $1$ 行的 $${-a}$ 倍，于是多出 $${wrap(-c)} \\cdot ${wrap(-a)} = ${a * c}$。`,
        ),
        why(
          -b - a * c,
          `The extra term has the wrong sign: $${wrap(-c)} \\cdot ${wrap(-a)} = ${a * c}$.`,
          `多出的一项符号错了：$${wrap(-c)} \\cdot ${wrap(-a)} = ${a * c}$。`,
        ),
        why(
          b,
          "That is the $(3, 1)$ entry of the inverse $L$, which only collects the multipliers.",
          "这是逆矩阵 $L$ 的 $(3, 1)$ 元素，逆矩阵只是收集乘数。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Apply $E_{1}$ and $E_{2}$ to $I$", "对 $I$ 做 $E_{1}$ 与 $E_{2}$"],
            text([
              `Row $2$ becomes $(${-a}, 1, 0)$ and row $3$ becomes $(${-b}, 0, 1)$.`,
              `第 $2$ 行变为 $(${-a}, 1, 0)$，第 $3$ 行变为 $(${-b}, 0, 1)$。`,
            ]),
          ],
          [
            ["Apply $E_{3}$", "再做 $E_{3}$"],
            text([`Row $3$ minus $${wrap(c)}$ times the new row $2$:`, `第 $3$ 行减去新第 $2$ 行的 $${wrap(c)}$ 倍：`]),
            [`${wrap(-b)} - ${wrap(c)} \\cdot ${wrap(-a)} = ${answer}`],
          ],
        ],
        t(
          `$L = (E_{3}E_{2}E_{1})^{-1}$ has $${a}$, $${b}$, $${c}$ below the diagonal. Row $3$ of the product, $(${answer}, ${-c}, 1)$, times column $1$ of $L$, $(1, ${a}, ${b})$, is $${answer} + ${wrap(-c)} \\cdot ${wrap(a)} + ${wrap(b)} = 0$, as $I$ requires.`,
          `$L = (E_{3}E_{2}E_{1})^{-1}$ 对角线下方为 $${a}$、$${b}$、$${c}$。乘积的第 $3$ 行 $(${answer}, ${-c}, 1)$ 乘 $L$ 的第 $1$ 列 $(1, ${a}, ${b})$，得 $${answer} + ${wrap(-c)} \\cdot ${wrap(a)} + ${wrap(b)} = 0$，符合 $I$。`,
        ),
      ),
    });
  },
);

const nullVectorOfSingular = point(
  "a-nonzero-solution-of-a-singular-system",
  ["A nonzero solution of a singular system", "奇异方程组的非零解"],
  [
    "A $2 \\times 2$ matrix fails to be invertible exactly when $A\\mathbf{x} = \\mathbf{0}$ has a nonzero solution. When one column is a multiple of the other, this multiple gives such a solution directly, so the determinant does not need to be computed first. In $\\begin{pmatrix} 1 & -3 \\\\ 2 & -6 \\end{pmatrix}$ column $2$ is $-3$ times column $1$, so $3 \\cdot \\text{column } 1 + 1 \\cdot \\text{column } 2 = \\mathbf{0}$ and $(3, 1)$ is a solution.\n\n> **Watch out.** If column $2$ is $-k$ times column $1$, the solution $(t, 1)$ has $t = k$, with the sign flipped: the two columns must cancel.",
    "$2 \\times 2$ 矩阵不可逆，当且仅当 $A\\mathbf{x} = \\mathbf{0}$ 有非零解。当一列是另一列的倍数时，这个倍数直接给出这样的解，所以不必先计算行列式。在 $\\begin{pmatrix} 1 & -3 \\\\ 2 & -6 \\end{pmatrix}$ 中第 $2$ 列是第 $1$ 列的 $-3$ 倍，所以 $3 \\cdot$ 第 $1$ 列 $+ 1 \\cdot$ 第 $2$ 列 $= \\mathbf{0}$，$(3, 1)$ 是一个解。\n\n> **注意。** 若第 $2$ 列是第 $1$ 列的 $-k$ 倍，解 $(t, 1)$ 中 $t = k$，符号相反：两列必须相互抵消。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const c = nz(rng, 6);
    const k = nz(rng, 6);
    const A = mat([
      [a, -a * k],
      [c, -c * k],
    ]);
    return numberProblem({
      prompt: text([
        `$A = ${A}$ is singular. Find $t$ so that $${vec("t", 1)}$ solves $A\\mathbf{x} = \\mathbf{0}$.`,
        `$A = ${A}$ 是奇异矩阵。求 $t$，使 $${vec("t", 1)}$ 是 $A\\mathbf{x} = \\mathbf{0}$ 的解。`,
      ]),
      answer: k,
      mistakes: [
        why(
          -k,
          `Column 2 is $${-k}$ times column 1, so column 1 must be taken $${k}$ times to cancel it; the sign flips.`,
          `第 2 列是第 1 列的 $${-k}$ 倍，所以要取第 1 列的 $${k}$ 倍才能抵消；符号相反。`,
        ),
        why(
          a,
          "That is the $(1, 1)$ entry of $A$; solve the first equation for $t$.",
          "这是 $A$ 的 $(1, 1)$ 元素；要从第一个方程解出 $t$。",
        ),
        why(
          c,
          "That is the $(2, 1)$ entry of $A$; solve the first equation for $t$.",
          "这是 $A$ 的 $(2, 1)$ 元素；要从第一个方程解出 $t$。",
        ),
      ].filter((w, i, all) => w.value !== k && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Write the first equation", "写出第一个方程"],
            text([`Row 1 of $A$ times $(t, 1)$ must be $0$:`, `$A$ 的第 1 行乘 $(t, 1)$ 必须为 $0$：`]),
            [`${poly([a, "t"], [-a * k, ""])} = 0`],
          ],
          [["Solve for $t$", "解出 $t$"], t("", ""), [`t = \\frac{${a * k}}{${a}} = ${k}`]],
        ],
        t(
          `The second equation agrees: $${c} \\cdot ${wrap(k)} + ${wrap(-c * k)} \\cdot 1 = 0$, since the rows are proportional.`,
          `第二个方程也成立：$${c} \\cdot ${wrap(k)} + ${wrap(-c * k)} \\cdot 1 = 0$，因为两行成比例。`,
        ),
      ),
    });
  },
);

const blockInverse = point(
  "the-inverse-of-a-block-diagonal-matrix",
  ["The inverse of a block diagonal matrix", "分块对角矩阵的逆"],
  [
    "When a matrix has a block in the upper left and a separate entry at the lower right, row operations never mix them. So the inverse is found block by block, with the usual $2 \\times 2$ formula for the first block, and no full reduction of $[A \\mid I]$ is needed. For $\\begin{pmatrix} 2 & 1 & 0 \\\\ 1 & 1 & 0 \\\\ 0 & 0 & 4 \\end{pmatrix}$ the inverse has the block $\\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$ and the corner $\\frac{1}{4}$.\n\n> **Watch out.** Divide by the determinant of the $2 \\times 2$ block only; the lone entry $e$ affects just the corner $\\frac{1}{e}$.",
    "当矩阵左上角有一个块、右下角有一个单独元素时，行运算不会把它们混在一起。所以逆矩阵可以逐块求出，第一块用通常的 $2 \\times 2$ 公式，不需要完整化简 $[A \\mid I]$。对 $\\begin{pmatrix} 2 & 1 & 0 \\\\ 1 & 1 & 0 \\\\ 0 & 0 & 4 \\end{pmatrix}$，逆矩阵的块为 $\\begin{pmatrix} 1 & -1 \\\\ -1 & 2 \\end{pmatrix}$，角上为 $\\frac{1}{4}$。\n\n> **注意。** 只除以 $2 \\times 2$ 块的行列式；单独的元素 $e$ 只影响角上的 $\\frac{1}{e}$。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = nz(rng, 5);
    const c = nz(rng, 5);
    const d0 = nz(rng, 5);
    const d = a * d0 === b * c ? d0 + 1 : d0;
    const e = nz(rng, 6);
    const det = a * d - b * c;
    const first = rng.bool();
    const answer = first ? Q.of(-b, det) : Q.of(-c, det);
    const where = first ? "(1, 2)" : "(2, 1)";
    const A = mat([
      [a, b, 0],
      [c, d, 0],
      [0, 0, e],
    ]);
    const adj = mat([
      [d, -b],
      [-c, a],
    ]);
    const asQ = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
    return numberProblem({
      prompt: text([`Find the $${where}$ entry of $A^{-1}$ for $A = ${A}$.`, `对 $A = ${A}$，求 $A^{-1}$ 的 $${where}$ 元素。`]),
      answer,
      mistakes: [
        why(
          answer.neg(),
          "The off-diagonal entries of a $2 \\times 2$ inverse change sign; this keeps the original sign.",
          "$2 \\times 2$ 逆矩阵的非对角元素要变号；这里保留了原来的符号。",
        ),
        why(Q.of(first ? -b : -c), `The division by the block's determinant $${det}$ is missing.`, `漏了除以该块的行列式 $${det}$。`),
        why(
          Q.of(first ? -c : -b, det),
          `That is the other off-diagonal entry; the $${where}$ entry comes from $${first ? b : c}$.`,
          `这是另一个非对角元素；$${where}$ 元素来自 $${first ? b : c}$。`,
        ),
        why(
          Q.of(1, e),
          "That is the $(3, 3)$ entry of $A^{-1}$, from the lone block $e$.",
          "这是 $A^{-1}$ 的 $(3, 3)$ 元素，来自单独的块 $e$。",
        ),
      ].filter((w, i, all) => !asQ(w.value).eq(answer) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === i),
      solution: walked(
        [
          [
            ["Split into blocks", "分块"],
            text([
              `Row operations never mix the upper left block $B = ${mat([
                [a, b],
                [c, d],
              ])}$ with the entry $${e}$, so the $${where}$ entry of $A^{-1}$ is that of $B^{-1}$.`,
              `行运算不会把左上角的块 $B = ${mat([
                [a, b],
                [c, d],
              ])}$ 与元素 $${e}$ 混在一起，所以 $A^{-1}$ 的 $${where}$ 元素就是 $B^{-1}$ 的。`,
            ]),
          ],
          [
            ["Invert the block", "求块的逆"],
            text([
              `$\\det B = ${a} \\cdot ${wrap(d)} - ${wrap(b)} \\cdot ${wrap(c)} = ${det}$, so`,
              `$\\det B = ${a} \\cdot ${wrap(d)} - ${wrap(b)} \\cdot ${wrap(c)} = ${det}$，所以`,
            ]),
            [`B^{-1} = \\frac{1}{${det}}${adj}`, `\\frac{${first ? -b : -c}}{${det}} = ${answer.toLatex()}`],
          ],
        ],
        first
          ? t(
              `Row 1 of $B$ times column 2 of $B^{-1}$ must be $0$: $\\frac{1}{${det}}\\left(${a} \\cdot ${wrap(-b)} + ${wrap(b)} \\cdot ${wrap(a)}\\right) = 0$.`,
              `$B$ 的第 1 行乘 $B^{-1}$ 的第 2 列必须为 $0$：$\\frac{1}{${det}}\\left(${a} \\cdot ${wrap(-b)} + ${wrap(b)} \\cdot ${wrap(a)}\\right) = 0$。`,
            )
          : t(
              `Row 2 of $B$ times column 1 of $B^{-1}$ must be $0$: $\\frac{1}{${det}}\\left(${c} \\cdot ${wrap(d)} + ${wrap(d)} \\cdot ${wrap(-c)}\\right) = 0$.`,
              `$B$ 的第 2 行乘 $B^{-1}$ 的第 1 列必须为 $0$：$\\frac{1}{${det}}\\left(${c} \\cdot ${wrap(d)} + ${wrap(d)} \\cdot ${wrap(-c)}\\right) = 0$。`,
            ),
      ),
    });
  },
);

const triangularTrace = point(
  "the-trace-of-the-inverse-of-a-triangular-matrix",
  ["The trace of the inverse of a triangular matrix", "三角矩阵的逆的迹"],
  [
    "The inverse of an invertible triangular matrix is triangular as well, and each of its diagonal entries is the reciprocal of the corresponding entry. So the trace of the inverse needs only the diagonal, and entries off the diagonal play no part. For example, a triangular matrix with diagonal $2, 4, -1$ has an inverse with trace $\\frac{1}{2} + \\frac{1}{4} - 1 = -\\frac{1}{4}$.\n\n> **Watch out.** The trace of $U^{-1}$ adds the reciprocals; it is neither the trace of $U$ nor the reciprocal of $\\det U$.",
    "可逆三角矩阵的逆矩阵也是三角矩阵，它的每个对角元素都是相应元素的倒数。所以逆矩阵的迹只需要对角元素，对角线外的元素不起作用。例如对角元素为 $2, 4, -1$ 的三角矩阵，其逆的迹为 $\\frac{1}{2} + \\frac{1}{4} - 1 = -\\frac{1}{4}$。\n\n> **注意。** $U^{-1}$ 的迹是各倒数之和；它既不是 $U$ 的迹，也不是 $\\det U$ 的倒数。",
  ],
  (rng) => {
    const pool = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
    const d1 = rng.pick(pool);
    const d2 = rng.pick(pool);
    const d3 = rng.pick(pool);
    const answer = Q.of(1, d1).add(Q.of(1, d2)).add(Q.of(1, d3));
    const U = mat([
      [d1, nz(rng, 5), nz(rng, 5)],
      [0, d2, nz(rng, 5)],
      [0, 0, d3],
    ]);
    const asQ = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
    const recips = [d1, d2, d3].map((d) => Q.of(1, d).toLatex());
    const wrapped = recips.map((s) => (s.startsWith("-") ? `\\left(${s}\\right)` : s));
    return numberProblem({
      prompt: text([`Find the trace of $U^{-1}$ for $U = ${U}$.`, `对 $U = ${U}$，求 $U^{-1}$ 的迹。`]),
      answer,
      mistakes: [
        why(
          d1 + d2 + d3,
          "That is the trace of $U$; the diagonal of $U^{-1}$ holds the reciprocals.",
          "这是 $U$ 的迹；$U^{-1}$ 的对角线上是倒数。",
        ),
        why(
          Q.of(1, d1 * d2 * d3),
          "That is $\\det U^{-1}$, the product of the reciprocals; the trace adds them.",
          "这是 $\\det U^{-1}$，即倒数之积；迹是把它们相加。",
        ),
        why(
          answer.neg(),
          "The sign is wrong: each reciprocal keeps the sign of its diagonal entry.",
          "符号错了：每个倒数保持对应对角元素的符号。",
        ),
      ].filter((w, i, all) => !asQ(w.value).eq(answer) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === i),
      solution: walked(
        [
          [
            ["Read the diagonal of $U^{-1}$", "读出 $U^{-1}$ 的对角线"],
            text([
              `$U^{-1}$ is upper triangular, and its diagonal entries are the reciprocals of $${d1}$, $${d2}$, $${d3}$:`,
              `$U^{-1}$ 是上三角矩阵，其对角元素是 $${d1}$、$${d2}$、$${d3}$ 的倒数：`,
            ]),
            [recips.join(", \\quad ")],
          ],
          [["Add them", "相加"], t("", ""), [`${recips.join(" + ").replace(/\+ -/g, "- ")} = ${answer.toLatex()}`]],
        ],
        t(
          `The diagonal of $UU^{-1}$ is $${d1} \\cdot ${wrapped[0]}$, $${d2} \\cdot ${wrapped[1]}$, $${d3} \\cdot ${wrapped[2]}$, each equal to $1$, as the diagonal of $I$ must be.`,
          `$UU^{-1}$ 的对角线为 $${d1} \\cdot ${wrapped[0]}$、$${d2} \\cdot ${wrapped[1]}$、$${d3} \\cdot ${wrapped[2]}$，都等于 $1$，正如 $I$ 的对角线。`,
        ),
      ),
    });
  },
);

const recoverFromLu = point(
  "an-entry-of-a-from-its-factors",
  ["An entry of A from its factors", "由因子求 A 的元素"],
  [
    "Since $L$ is lower triangular and $U$ is upper triangular, the sum for an entry of $A = LU$ stops early. The $(3, 2)$ entry uses only the first two columns of row $3$ of $L$, so it is $l_{31}u_{12} + l_{32}u_{22}$. For example, $l_{31} = 2$, $u_{12} = 3$, $l_{32} = -1$ and $u_{22} = 4$ give $6 - 4 = 2$.\n\n> **Watch out.** Both terms are needed: the $1$ on the diagonal of $L$ meets $u_{32} = 0$, but $l_{31}$ and $l_{32}$ each contribute.",
    "由于 $L$ 是下三角矩阵，$U$ 是上三角矩阵，$A = LU$ 的元素的和式会提前终止。$(3, 2)$ 元素只用到 $L$ 第 $3$ 行的前两列，所以等于 $l_{31}u_{12} + l_{32}u_{22}$。例如 $l_{31} = 2$，$u_{12} = 3$，$l_{32} = -1$，$u_{22} = 4$，得 $6 - 4 = 2$。\n\n> **注意。** 两项都不能少：$L$ 对角线上的 $1$ 遇到的是 $u_{32} = 0$，但 $l_{31}$ 与 $l_{32}$ 各有贡献。",
  ],
  (rng) => {
    const l21 = nz(rng, 4);
    const l31 = nz(rng, 4);
    const l32 = nz(rng, 4);
    const u11 = nz(rng, 5);
    const u12 = nz(rng, 5);
    const u13 = nz(rng, 5);
    const u22 = nz(rng, 5);
    const u23 = nz(rng, 5);
    const u33 = nz(rng, 5);
    const answer = l31 * u12 + l32 * u22;
    return numberProblem({
      prompt: text([
        `$L = ${mat([
          [1, 0, 0],
          [l21, 1, 0],
          [l31, l32, 1],
        ])}$ and $U = ${mat([
          [u11, u12, u13],
          [0, u22, u23],
          [0, 0, u33],
        ])}$. Find the $(3, 2)$ entry of $A = LU$.`,
        `$L = ${mat([
          [1, 0, 0],
          [l21, 1, 0],
          [l31, l32, 1],
        ])}$，$U = ${mat([
          [u11, u12, u13],
          [0, u22, u23],
          [0, 0, u33],
        ])}$。求 $A = LU$ 的 $(3, 2)$ 元素。`,
      ]),
      answer,
      mistakes: [
        why(
          l32 * u22,
          `The term $l_{31}u_{12} = ${wrap(l31)} \\cdot ${wrap(u12)}$ is missing.`,
          `漏了 $l_{31}u_{12} = ${wrap(l31)} \\cdot ${wrap(u12)}$ 这一项。`,
        ),
        why(
          l31 * u12,
          `The term $l_{32}u_{22} = ${wrap(l32)} \\cdot ${wrap(u22)}$ is missing.`,
          `漏了 $l_{32}u_{22} = ${wrap(l32)} \\cdot ${wrap(u22)}$ 这一项。`,
        ),
        why(
          l31 * u13 + l32 * u23,
          "That uses column 3 of $U$; the $(3, 2)$ entry needs column 2.",
          "这用的是 $U$ 的第 3 列；$(3, 2)$ 元素要用第 2 列。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Pick the row and column", "选出行与列"],
            text([
              `The $(3, 2)$ entry is row $3$ of $L$, $(${l31}, ${l32}, 1)$, times column $2$ of $U$, $(${u12}, ${u22}, 0)$.`,
              `$(3, 2)$ 元素是 $L$ 的第 $3$ 行 $(${l31}, ${l32}, 1)$ 乘 $U$ 的第 $2$ 列 $(${u12}, ${u22}, 0)$。`,
            ]),
          ],
          [
            ["Multiply and add", "相乘再相加"],
            t("", ""),
            [`${wrap(l31)} \\cdot ${wrap(u12)} + ${wrap(l32)} \\cdot ${wrap(u22)} + 1 \\cdot 0 = ${answer}`],
          ],
        ],
        t(
          `Row 3 of $A$ is $${l31}$ times row 1 of $U$ plus $${wrap(l32)}$ times row 2 of $U$ plus row 3 of $U$; its second entries give $${wrap(l31)} \\cdot ${wrap(u12)} + ${wrap(l32)} \\cdot ${wrap(u22)} + 0 = ${answer}$.`,
          `$A$ 的第 3 行等于 $U$ 第 1 行的 $${l31}$ 倍加第 2 行的 $${wrap(l32)}$ 倍再加第 3 行；取第二个元素得 $${wrap(l31)} \\cdot ${wrap(u12)} + ${wrap(l32)} \\cdot ${wrap(u22)} + 0 = ${answer}$。`,
        ),
      ),
    });
  },
);

const pivotFromMinors = point(
  "a-pivot-from-leading-minors",
  ["A pivot from leading minors", "由顺序主子式求主元"],
  [
    "With $L$ unit lower triangular, the determinant of the leading $k \\times k$ block of $A$ is the product of the first $k$ pivots. So each pivot is a ratio of consecutive leading minors, and LU without row swaps exists only when these minors are nonzero. For example, leading minors $2$, $6$ and $-12$ give pivots $2$, $\\frac{6}{2} = 3$ and $\\frac{-12}{6} = -2$.\n\n> **Watch out.** Divide consecutive minors, the larger size on top; a difference of minors is not a pivot.",
    "当 $L$ 是单位下三角矩阵时，$A$ 的前 $k \\times k$ 块的行列式等于前 $k$ 个主元之积。所以每个主元都是相邻顺序主子式之比，只有这些主子式都不为零时，才存在不做行交换的 LU 分解。例如顺序主子式 $2$、$6$、$-12$ 给出主元 $2$、$\\frac{6}{2} = 3$、$\\frac{-12}{6} = -2$。\n\n> **注意。** 要用相邻主子式相除，阶数大的作分子；主子式之差不是主元。",
  ],
  (rng) => {
    const d1 = nz(rng, 9);
    const d2 = nz(rng, 12);
    const d3 = nz(rng, 20);
    const answer = Q.of(d3, d2);
    const asQ = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
    const u22 = Q.of(d2, d1);
    return numberProblem({
      prompt: text([
        `$A = LU$ with $L$ unit lower triangular. The leading minors of sizes $1$, $2$, $3$ are $${d1}$, $${d2}$ and $${d3}$. Find $u_{33}$.`,
        `$A = LU$，其中 $L$ 是单位下三角矩阵。$1$、$2$、$3$ 阶顺序主子式分别是 $${d1}$、$${d2}$ 和 $${d3}$。求 $u_{33}$。`,
      ]),
      answer,
      mistakes: [
        why(
          d3,
          "That is the $3 \\times 3$ minor, the product of all three pivots; divide by the $2 \\times 2$ minor.",
          "这是 $3$ 阶主子式，即三个主元之积；还要除以 $2$ 阶主子式。",
        ),
        why(
          d3 - d2,
          "The minors are products of pivots, so consecutive minors are divided, not subtracted.",
          "主子式是主元之积，所以相邻主子式要相除而不是相减。",
        ),
        why(Q.of(d2, d3), "The fraction is upside down: the larger minor goes on top.", "分数颠倒了：阶数大的主子式作分子。"),
      ].filter((w, i, all) => !asQ(w.value).eq(answer) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === i),
      solution: walked(
        [
          [
            ["Write the minors as products", "把主子式写成乘积"],
            text([
              "Since $\\det L = 1$ for each leading block, the leading minors are $u_{11}$, $u_{11}u_{22}$ and $u_{11}u_{22}u_{33}$:",
              "由于各前块的 $\\det L = 1$，顺序主子式为 $u_{11}$、$u_{11}u_{22}$ 和 $u_{11}u_{22}u_{33}$：",
            ]),
            [`u_{11} = ${d1}, \\quad u_{11}u_{22} = ${d2}, \\quad u_{11}u_{22}u_{33} = ${d3}`],
          ],
          [["Divide consecutive minors", "相邻主子式相除"], t("", ""), [`u_{33} = \\frac{${d3}}{${d2}} = ${answer.toLatex()}`]],
        ],
        t(
          `The pivots are $${d1}$, $u_{22} = \\frac{${d2}}{${d1}} = ${u22.toLatex()}$ and $${answer.toLatex()}$, and their product is $${Q.of(d1).mul(u22).mul(answer).toLatex()} = ${d3}$.`,
          `三个主元为 $${d1}$、$u_{22} = \\frac{${d2}}{${d1}} = ${u22.toLatex()}$ 与 $${answer.toLatex()}$，其乘积为 $${Q.of(d1).mul(u22).mul(answer).toLatex()} = ${d3}$。`,
        ),
      ),
    });
  },
);

const transposeSolve = point(
  "solving-with-the-transpose-using-the-same-factors",
  ["Solving with the transpose using the same factors", "用同样的因子解转置方程组"],
  [
    "If $A = LU$, then $A^{T} = U^{T}L^{T}$, so the same factors also solve $A^{T}\\mathbf{x} = \\mathbf{b}$. Now the order changes: first solve $U^{T}\\mathbf{z} = \\mathbf{b}$, which is lower triangular, and then $L^{T}\\mathbf{x} = \\mathbf{z}$, which is upper triangular. For example, with $U = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$ and $\\mathbf{b} = (4, 5)$, the first stage gives $z_1 = 2$ and $z_2 = \\frac{5 - 2}{3} = 1$.\n\n> **Watch out.** Transposing reverses the order of the factors, so $U^{T}$ is solved first, and $\\mathbf{z}$ is only the intermediate vector, not $\\mathbf{x}$.",
    "如果 $A = LU$，则 $A^{T} = U^{T}L^{T}$，所以同样的因子也能解 $A^{T}\\mathbf{x} = \\mathbf{b}$。此时顺序改变：先解下三角的 $U^{T}\\mathbf{z} = \\mathbf{b}$，再解上三角的 $L^{T}\\mathbf{x} = \\mathbf{z}$。例如 $U = \\begin{pmatrix} 2 & 1 \\\\ 0 & 3 \\end{pmatrix}$，$\\mathbf{b} = (4, 5)$，第一步得 $z_1 = 2$，$z_2 = \\frac{5 - 2}{3} = 1$。\n\n> **注意。** 转置会颠倒因子的顺序，所以先解 $U^{T}$；$\\mathbf{z}$ 只是中间向量，不是 $\\mathbf{x}$。",
  ],
  (rng) => {
    const l = nz(rng, 4);
    const a = nz(rng, 4);
    const b = nz(rng, 4);
    const d = nz(rng, 4);
    const x1 = rng.int(-6, 6);
    const x2 = rng.int(-6, 6);
    const z1 = x1 + l * x2;
    const z2 = x2;
    const b1 = a * z1;
    const b2 = b * z1 + d * z2;
    return numberProblem({
      prompt: text([
        `$A = LU$ with $L = ${mat([
          [1, 0],
          [l, 1],
        ])}$ and $U = ${mat([
          [a, b],
          [0, d],
        ])}$. Solve $A^{T}\\mathbf{x} = ${vec(b1, b2)}$ and find $x_{1}$.`,
        `$A = LU$，其中 $L = ${mat([
          [1, 0],
          [l, 1],
        ])}$，$U = ${mat([
          [a, b],
          [0, d],
        ])}$。解 $A^{T}\\mathbf{x} = ${vec(b1, b2)}$，求 $x_{1}$。`,
      ]),
      answer: x1,
      solveFor: "x_1",
      mistakes: [
        why(x2, "That is $x_2$; the question asks for $x_1$.", "这是 $x_2$；题目求的是 $x_1$。"),
        why(
          z1,
          `That is $z_1$ from the first stage; $L^{T}\\mathbf{x} = \\mathbf{z}$ still subtracts $${wrap(l)} \\cdot x_2$.`,
          `这是第一步的 $z_1$；$L^{T}\\mathbf{x} = \\mathbf{z}$ 还要减去 $${wrap(l)} \\cdot x_2$。`,
        ),
        why(-x1, `The sign is wrong: $x_1 = z_1 - ${wrap(l)} \\cdot x_2$.`, `符号错了：$x_1 = z_1 - ${wrap(l)} \\cdot x_2$。`),
      ].filter((w, i, all) => w.value !== x1 && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Solve $U^{T}\\mathbf{z} = \\mathbf{b}$", "解 $U^{T}\\mathbf{z} = \\mathbf{b}$"],
            text([
              `$A^{T} = U^{T}L^{T}$ with $U^{T} = ${mat([
                [a, 0],
                [b, d],
              ])}$, lower triangular, so solve from the top:`,
              `$A^{T} = U^{T}L^{T}$，其中 $U^{T} = ${mat([
                [a, 0],
                [b, d],
              ])}$ 是下三角矩阵，所以从上往下解：`,
            ]),
            [`z_1 = \\frac{${b1}}{${a}} = ${z1}, \\quad z_2 = \\frac{${b2} - ${wrap(b)} \\cdot ${wrap(z1)}}{${d}} = ${z2}`],
          ],
          [
            ["Solve $L^{T}\\mathbf{x} = \\mathbf{z}$", "解 $L^{T}\\mathbf{x} = \\mathbf{z}$"],
            text([
              `$L^{T} = ${mat([
                [1, l],
                [0, 1],
              ])}$ is upper triangular, so solve from the bottom:`,
              `$L^{T} = ${mat([
                [1, l],
                [0, 1],
              ])}$ 是上三角矩阵，所以从下往上解：`,
            ]),
            [`x_2 = ${x2}, \\quad x_1 = ${z1} - ${wrap(l)} \\cdot ${wrap(x2)} = ${x1}`],
          ],
        ],
        t(
          `Row 1 of $A^{T}$ is column 1 of $A = LU$, namely $(${a}, ${l * a})$, and $${a} \\cdot ${wrap(x1)} + ${wrap(l * a)} \\cdot ${wrap(x2)} = ${b1}$.`,
          `$A^{T}$ 的第 1 行是 $A = LU$ 的第 1 列，即 $(${a}, ${l * a})$，且 $${a} \\cdot ${wrap(x1)} + ${wrap(l * a)} \\cdot ${wrap(x2)} = ${b1}$。`,
        ),
      ),
    });
  },
);

const subspaceK = point(
  "the-value-that-makes-a-plane-a-subspace",
  ["The value that makes a plane a subspace", "使平面成为子空间的值"],
  [
    "Every subspace contains the zero vector, so a plane $ax + by + cz = d$ can be a subspace only when $d = 0$. A parameter on the right-hand side therefore has exactly one good value, namely the one that makes the right-hand side vanish. For example, $2x - y + z = k + 4$ is a subspace exactly when $k + 4 = 0$, that is $k = -4$.\n\n> **Watch out.** It is the whole right-hand side that must be $0$, not $k$ itself.",
    "每个子空间都含零向量，所以平面 $ax + by + cz = d$ 只有在 $d = 0$ 时才可能是子空间。因此右端的参数恰有一个合适的值，就是使右端为零的那个值。例如 $2x - y + z = k + 4$ 是子空间，当且仅当 $k + 4 = 0$，即 $k = -4$。\n\n> **注意。** 必须为 $0$ 的是整个右端，而不是 $k$ 本身。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const b = nz(rng, 5);
    const c = nz(rng, 5);
    const m = nz(rng, 12);
    const lhs = poly([a, "x"], [b, "y"], [c, "z"]);
    const rhs = poly([1, "k"], [-m, ""]);
    return numberProblem({
      prompt: text([
        `For which $k$ is $\\{(x, y, z) \\mid ${lhs} = ${rhs}\\}$ a subspace of $\\mathbb{R}^{3}$?`,
        `当 $k$ 为何值时，$\\{(x, y, z) \\mid ${lhs} = ${rhs}\\}$ 是 $\\mathbb{R}^{3}$ 的子空间？`,
      ]),
      answer: m,
      form: "integer",
      mistakes: [
        why(
          0,
          `With $k = 0$ the right-hand side is $${-m}$, so the origin is not on the plane; the whole right-hand side must be $0$.`,
          `$k = 0$ 时右端为 $${-m}$，原点不在平面上；必须为 $0$ 的是整个右端。`,
        ),
        why(-m, "The sign is flipped: move the constant across the equals sign carefully.", "符号反了：把常数移到等号另一边时要小心。"),
        why(
          a + b + c,
          "That puts the point $(1, 1, 1)$ into the equation; the test point is the origin.",
          "这是把点 $(1, 1, 1)$ 代入方程；应检验的点是原点。",
        ),
      ].filter((w, i, all) => w.value !== m && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Put in the zero vector", "代入零向量"],
            text(["A subspace contains $(0, 0, 0)$, where the left-hand side is $0$:", "子空间含 $(0, 0, 0)$，在该处左端为 $0$："]),
            [`0 = ${rhs}`],
          ],
          [["Solve for $k$", "解出 $k$"], text(["", ""]), [`k = ${m}`]],
        ],
        text([
          `With $k = ${m}$ the equation is $${lhs} = 0$: sums of solutions give $0 + 0 = 0$ and multiples give $c \\cdot 0 = 0$, so the plane is a subspace.`,
          `$k = ${m}$ 时方程为 $${lhs} = 0$：解的和给出 $0 + 0 = 0$，倍数给出 $c \\cdot 0 = 0$，所以平面是子空间。`,
        ]),
      ),
    });
  },
);

const inColumnSpace = point(
  "the-value-that-puts-a-vector-in-the-column-space",
  ["The value that puts a vector in the column space", "使向量落入列空间的值"],
  [
    "If the second column of a $2 \\times 2$ matrix is a multiple of the first, the column space is a line through the origin. A vector lies in it only when it is a multiple of the first column, and this condition on the entries determines the unknown. For example, the columns $(2, 3)$ and $(4, 6)$ span the line through $(2, 3)$, so $(6, k)$ is in the column space when $(6, k) = 3(2, 3)$, that is $k = 9$.\n\n> **Watch out.** Find the factor from the known entry first; $k$ is that factor times the second entry of the column, not the factor itself.",
    "如果 $2 \\times 2$ 矩阵的第二列是第一列的倍数，列空间就是一条过原点的直线。向量位于其中，当且仅当它是第一列的倍数，这个关于元素的条件确定了未知数。例如列 $(2, 3)$ 与 $(4, 6)$ 张成过 $(2, 3)$ 的直线，所以当 $(6, k) = 3(2, 3)$，即 $k = 9$ 时，$(6, k)$ 在列空间中。\n\n> **注意。** 先由已知元素求出倍数；$k$ 是这个倍数乘以列的第二个元素，而不是倍数本身。",
  ],
  (rng) => {
    const a = nz(rng, 5);
    const c = nz(rng, 5);
    const m = nz(rng, 4);
    const s = nz(rng, 6);
    const answer = c * s;
    const A = mat([
      [a, m * a],
      [c, m * c],
    ]);
    return numberProblem({
      prompt: text([
        `Find $k$ so that $${vec(a * s, "k")}$ lies in the column space of $${A}$.`,
        `求 $k$，使 $${vec(a * s, "k")}$ 位于 $${A}$ 的列空间中。`,
      ]),
      answer,
      form: "integer",
      mistakes: [
        why(
          s,
          "That is the factor; $k$ is the factor times the second entry of the first column.",
          "这是倍数；$k$ 是倍数乘以第一列的第二个元素。",
        ),
        why(
          c,
          "That is the second entry of the first column; it still has to be multiplied by the factor.",
          "这是第一列的第二个元素；还要乘以倍数。",
        ),
        why(
          -answer,
          "The sign is flipped; recheck the signs of the factor and of the column entry.",
          "符号反了；请重新检查倍数与列元素的符号。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Find the column space", "求出列空间"],
            text([
              `Column 2 is $${m}$ times column 1, so the column space is the line through $${vec(a, c)}$.`,
              `第 2 列是第 1 列的 $${m}$ 倍，所以列空间是过 $${vec(a, c)}$ 的直线。`,
            ]),
          ],
          [
            ["Find the factor", "求出倍数"],
            text(["The first entries must match:", "第一个元素必须相等："]),
            [`${poly([a, "s"])} = ${a * s}`, `s = ${s}`],
          ],
          [["Find $k$", "求出 $k$"], text(["", ""]), [`k = ${wrap(s)} \\cdot ${wrap(c)} = ${answer}`]],
        ],
        text([
          `$${s}${vec(a, c)} = ${vec(a * s, answer)}$, which matches the vector with $k = ${answer}$.`,
          `$${s}${vec(a, c)} = ${vec(a * s, answer)}$，与 $k = ${answer}$ 时的向量相同。`,
        ]),
      ),
    });
  },
);

const nullReverse = point(
  "an-entry-from-a-null-space-vector",
  ["An entry from a null space vector", "由零空间向量求元素"],
  [
    "A vector in the null space is orthogonal to every row of the matrix. So a known null space vector gives one equation for each row, and this can be used in reverse to find an unknown entry in the matrix from its null space. For example, if $(1, 3, 1)$ is in the null space of $(2, -1, k)$, then $2 - 3 + k = 0$, so $k = 1$.\n\n> **Watch out.** The other two products move across the equals sign, so $k$ is minus their sum.",
    "零空间中的向量与矩阵的每一行都正交。所以已知的零空间向量给每一行提供一个方程，反过来可以由零空间求矩阵中的未知元素。例如若 $(1, 3, 1)$ 在 $(2, -1, k)$ 的零空间中，则 $2 - 3 + k = 0$，所以 $k = 1$。\n\n> **注意。** 另外两个乘积移到等号另一边，所以 $k$ 是它们之和的相反数。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const b = nz(rng, 6);
    const u = nz(rng, 5);
    const v = nz(rng, 5);
    const answer = -(a * u + b * v);
    return numberProblem({
      prompt: text([
        `$${vec(u, v, 1)}$ lies in the null space of $A = ${mat([[a, b, "k"]])}$. Find $k$.`,
        `$${vec(u, v, 1)}$ 位于 $A = ${mat([[a, b, "k"]])}$ 的零空间中。求 $k$。`,
      ]),
      answer,
      form: "integer",
      mistakes: [
        why(
          -answer,
          "The sign is flipped: the two known products change sign when they move across.",
          "符号反了：两个已知乘积移项时要变号。",
        ),
        why(
          -(a * u),
          `The product $${wrap(b)} \\cdot ${wrap(v)}$ from the second entry was left out.`,
          `漏掉了第二个分量的乘积 $${wrap(b)} \\cdot ${wrap(v)}$。`,
        ),
        why(
          -(a + b),
          "The entries of the row must be multiplied by the entries of the vector before adding.",
          "行的元素要先乘以向量的分量再相加。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Multiply the row by the vector", "行乘向量"],
            text(["A null space vector gives a zero product:", "零空间中的向量使乘积为零："]),
            [`${wrap(a)} \\cdot ${wrap(u)} + ${wrap(b)} \\cdot ${wrap(v)} + k \\cdot 1 = 0`, `${a * u + b * v} + k = 0`],
          ],
          [["Solve for $k$", "解出 $k$"], text(["", ""]), [`k = ${answer}`]],
        ],
        text([
          `$${wrap(a)} \\cdot ${wrap(u)} + ${wrap(b)} \\cdot ${wrap(v)} + ${wrap(answer)} = ${a * u} + ${wrap(b * v)} + ${wrap(answer)} = 0$.`,
          `$${wrap(a)} \\cdot ${wrap(u)} + ${wrap(b)} \\cdot ${wrap(v)} + ${wrap(answer)} = ${a * u} + ${wrap(b * v)} + ${wrap(answer)} = 0$。`,
        ]),
      ),
    });
  },
);

const scaledBasis = point(
  "coordinates-after-scaling-a-basis",
  ["Coordinates after scaling a basis", "缩放基之后的坐标"],
  [
    "Coordinates change in the opposite way to the basis. If a basis vector is multiplied by $c$, the same vector needs $\\frac{1}{c}$ as much of it, so the coordinate is divided by $c$. Multiplying the coordinate instead would change the vector. For example, $\\mathbf{x} = 6\\mathbf{b}_1 - 4\\mathbf{b}_2$ has coordinates $(3, 2)$ in the basis $\\{2\\mathbf{b}_1, -2\\mathbf{b}_2\\}$, since $3(2\\mathbf{b}_1) + 2(-2\\mathbf{b}_2) = 6\\mathbf{b}_1 - 4\\mathbf{b}_2$.\n\n> **Watch out.** A longer basis vector needs a smaller coordinate: divide by the factor, and keep track of its sign.",
    "坐标的变化与基相反。如果基向量乘以 $c$，同一个向量只需要它的 $\\frac{1}{c}$，所以坐标要除以 $c$。若把坐标也乘以 $c$，向量就变了。例如 $\\mathbf{x} = 6\\mathbf{b}_1 - 4\\mathbf{b}_2$ 在基 $\\{2\\mathbf{b}_1, -2\\mathbf{b}_2\\}$ 下的坐标为 $(3, 2)$，因为 $3(2\\mathbf{b}_1) + 2(-2\\mathbf{b}_2) = 6\\mathbf{b}_1 - 4\\mathbf{b}_2$。\n\n> **注意。** 基向量变长，坐标就变小：要除以倍数，并注意倍数的符号。",
  ],
  (rng) => {
    const pool = [-5, -4, -3, -2, 2, 3, 4, 5];
    const c = rng.pick(pool);
    const d = rng.pick(pool);
    const p = nz(rng, 12);
    const q = nz(rng, 12);
    const first = rng.bool();
    const answer = first ? Q.of(p, c) : Q.of(q, d);
    const name: Pair = first ? ["first", "第一"] : ["second", "第二"];
    const [coef, factor, index] = first ? [p, c, 1] : [q, d, 2];
    const asQ = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
    return numberProblem({
      prompt: text([
        `The coordinates of $\\mathbf{x}$ in the basis $\\{\\mathbf{b}_{1}, \\mathbf{b}_{2}\\}$ are $(${p}, ${q})$. Find the ${name[0]} coordinate of $\\mathbf{x}$ in the basis $\\{${c}\\mathbf{b}_{1}, ${d}\\mathbf{b}_{2}\\}$.`,
        `$\\mathbf{x}$ 在基 $\\{\\mathbf{b}_{1}, \\mathbf{b}_{2}\\}$ 下的坐标是 $(${p}, ${q})$。求 $\\mathbf{x}$ 在基 $\\{${c}\\mathbf{b}_{1}, ${d}\\mathbf{b}_{2}\\}$ 下的${name[1]}个坐标。`,
      ]),
      answer,
      mistakes: [
        why(
          coef * factor,
          "The coordinate was multiplied by the factor; a longer basis vector needs a smaller coordinate, so divide.",
          "坐标乘以了倍数；基向量变长，坐标要变小，所以应除以倍数。",
        ),
        why(coef, "That is the old coordinate; it changes when its basis vector is scaled.", "这是旧坐标；基向量缩放后它会改变。"),
        why(
          answer.neg(),
          `The sign is flipped; the factor $${factor}$ keeps its sign in the division.`,
          `符号反了；除法中倍数 $${factor}$ 保留它的符号。`,
        ),
      ].filter((w, i, all) => !asQ(w.value).eq(answer) && all.findIndex((o) => asQ(o.value).eq(asQ(w.value))) === i),
      solution: walked(
        [
          [
            ["Write x in the old basis", "用旧基表示 x"],
            text(["", ""]),
            [`\\mathbf{x} = ${poly([p, "\\mathbf{b}_{1}"], [q, "\\mathbf{b}_{2}"])}`],
          ],
          [
            ["Rewrite with the new vector", "用新向量改写"],
            text([
              `Since $\\mathbf{b}_{${index}} = \\frac{1}{${factor}}(${factor}\\mathbf{b}_{${index}})$:`,
              `由于 $\\mathbf{b}_{${index}} = \\frac{1}{${factor}}(${factor}\\mathbf{b}_{${index}})$：`,
            ]),
            [
              `${coef}\\mathbf{b}_{${index}} = \\frac{${coef}}{${factor}}(${factor}\\mathbf{b}_{${index}}) = ${answer.toLatex()}(${factor}\\mathbf{b}_{${index}})`,
            ],
          ],
        ],
        text([
          `$${answer.toLatex()} \\cdot ${wrap(factor)} = ${coef}$, so this coordinate rebuilds the original $${coef}\\mathbf{b}_{${index}}$.`,
          `$${answer.toLatex()} \\cdot ${wrap(factor)} = ${coef}$，所以这个坐标还原出原来的 $${coef}\\mathbf{b}_{${index}}$。`,
        ]),
      ),
    });
  },
);

const betweenBases = point(
  "from-one-basis-to-another",
  ["From one basis to another", "从一个基到另一个基"],
  [
    "To change between two nonstandard bases, go through the standard coordinates. First use the old basis to rebuild the actual vector, and then solve for the coordinates in the new basis. The coordinates in the old basis cannot simply be reused. For example, coordinates $(1, 2)$ in $\\{(1, 1), (1, -1)\\}$ give the vector $(3, -1)$, and in $\\{(1, 0), (1, 1)\\}$ this is $4(1, 0) + (-1)(1, 1)$, so the new coordinates are $(4, -1)$.\n\n> **Watch out.** Neither the old coordinates nor the entries of the vector are the new coordinates; solve the new system.",
    "在两个非标准基之间转换时，要经过标准坐标。先用旧基还原出实际的向量，再求它在新基下的坐标。旧基下的坐标不能直接拿来用。例如在 $\\{(1, 1), (1, -1)\\}$ 下的坐标 $(1, 2)$ 给出向量 $(3, -1)$，在 $\\{(1, 0), (1, 1)\\}$ 下它是 $4(1, 0) + (-1)(1, 1)$，所以新坐标为 $(4, -1)$。\n\n> **注意。** 旧坐标和向量的分量都不是新坐标；要解新的方程组。",
  ],
  (rng) => {
    const a = nz(rng, 4);
    const b = nz(rng, 4);
    const c = nz(rng, 4);
    const d0 = nz(rng, 4);
    const d = a * d0 === b * c ? d0 + 1 : d0;
    const p = nz(rng, 5);
    const q = nz(rng, 5);
    const x1 = p * a + q * c;
    const x2 = p * b + q * d;
    const first = rng.bool();
    const answer = first ? x1 - x2 : x2;
    const name: Pair = first ? ["first", "第一"] : ["second", "第二"];
    return numberProblem({
      prompt: text([
        `$\\mathbf{x}$ has coordinates $(${p}, ${q})$ in the basis $\\mathcal{B} = \\left\\{${vec(a, b)}, ${vec(c, d)}\\right\\}$. Find its ${name[0]} coordinate in the basis $\\mathcal{C} = \\left\\{${vec(1, 0)}, ${vec(1, 1)}\\right\\}$.`,
        `$\\mathbf{x}$ 在基 $\\mathcal{B} = \\left\\{${vec(a, b)}, ${vec(c, d)}\\right\\}$ 下的坐标是 $(${p}, ${q})$。求它在基 $\\mathcal{C} = \\left\\{${vec(1, 0)}, ${vec(1, 1)}\\right\\}$ 下的${name[1]}个坐标。`,
      ]),
      answer,
      form: "integer",
      mistakes: [
        why(
          first ? p : q,
          "That is the old coordinate in $\\mathcal{B}$; rebuild the vector and solve in $\\mathcal{C}$.",
          "这是 $\\mathcal{B}$ 下的旧坐标；要还原出向量，再在 $\\mathcal{C}$ 下求解。",
        ),
        first
          ? why(
              x1,
              "That is the first entry of the vector; in $\\mathcal{C}$ the second vector also has first entry $1$, so subtract $y_{2}$.",
              "这是向量的第一个分量；在 $\\mathcal{C}$ 中第二个向量的第一个分量也是 $1$，所以要减去 $y_{2}$。",
            )
          : why(
              x1 - x2,
              "That is the first coordinate in $\\mathcal{C}$; the question asks for the second.",
              "这是 $\\mathcal{C}$ 下的第一个坐标；题目求的是第二个。",
            ),
        why(-answer, "The sign is flipped; recheck the subtraction.", "符号反了；请重新检查减法。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Rebuild the vector", "还原向量"],
            text(["", ""]),
            [`\\mathbf{x} = ${p}${vec(a, b)} + ${wrap(q)}${vec(c, d)} = ${vec(x1, x2)}`],
          ],
          [
            ["Solve in C", "在 C 下求解"],
            text([
              "Coordinates $y_{1}, y_{2}$ in $\\mathcal{C}$ satisfy $y_{1}(1, 0) + y_{2}(1, 1) = \\mathbf{x}$:",
              "$\\mathcal{C}$ 下的坐标 $y_{1}, y_{2}$ 满足 $y_{1}(1, 0) + y_{2}(1, 1) = \\mathbf{x}$：",
            ]),
            [`y_{2} = ${x2}`, `y_{1} = ${x1} - ${wrap(x2)} = ${x1 - x2}`],
          ],
        ],
        text([
          `$${x1 - x2}${vec(1, 0)} + ${wrap(x2)}${vec(1, 1)} = ${vec(x1, x2)}$, so the ${name[0]} coordinate is $${answer}$.`,
          `$${x1 - x2}${vec(1, 0)} + ${wrap(x2)}${vec(1, 1)} = ${vec(x1, x2)}$，所以${name[1]}个坐标为 $${answer}$。`,
        ]),
      ),
    });
  },
);

const solvableDimension = point(
  "the-dimension-of-the-reachable-right-hand-sides",
  ["The dimension of the reachable right-hand sides", "可达右端的维数"],
  [
    "The right-hand sides $\\mathbf{b}$ for which $A\\mathbf{x} = \\mathbf{b}$ is solvable form the column space, whose dimension is the rank. By rank-nullity, a nonzero null space shrinks it, so a singular square matrix cannot reach every right-hand side. For example, a $4 \\times 4$ matrix with a $1$-dimensional null space has rank $4 - 1 = 3$, so the reachable $\\mathbf{b}$ form a $3$-dimensional subspace of $\\mathbb{R}^4$.\n\n> **Watch out.** The null space lives among the inputs $\\mathbf{x}$, the reachable $\\mathbf{b}$ among the outputs; the answer is the rank, not the nullity.",
    "使 $A\\mathbf{x} = \\mathbf{b}$ 有解的右端 $\\mathbf{b}$ 构成列空间，其维数是秩。由秩-零化度定理，非零的零空间会使它缩小，所以奇异方阵不能达到每个右端。例如零空间为 $1$ 维的 $4 \\times 4$ 矩阵的秩是 $4 - 1 = 3$，所以可达的 $\\mathbf{b}$ 构成 $\\mathbb{R}^4$ 的 $3$ 维子空间。\n\n> **注意。** 零空间位于输入 $\\mathbf{x}$ 之中，可达的 $\\mathbf{b}$ 位于输出之中；答案是秩，而不是零化度。",
  ],
  (rng) => {
    const n = rng.int(3, 12);
    const p = rng.int(1, n - 1);
    const answer = n - p;
    return numberProblem({
      prompt: text([
        `$A$ is a square matrix of size $${n} \\times ${n}$ with $\\dim \\operatorname{Null}(A) = ${p}$. Find the dimension of the set of all $\\mathbf{b}$ for which $A\\mathbf{x} = \\mathbf{b}$ has a solution.`,
        `$A$ 是 $${n} \\times ${n}$ 矩阵，$\\dim \\operatorname{Null}(A) = ${p}$。求使 $A\\mathbf{x} = \\mathbf{b}$ 有解的所有 $\\mathbf{b}$ 构成的集合的维数。`,
      ]),
      answer,
      form: "integer",
      mistakes: [
        why(
          p,
          "That is the nullity, a dimension among the inputs; the reachable $\\mathbf{b}$ form the column space, of dimension the rank.",
          "这是零化度，是输入一侧的维数；可达的 $\\mathbf{b}$ 构成列空间，维数是秩。",
        ),
        why(
          n,
          "A nonzero null space makes $A$ singular, so not every $\\mathbf{b}$ in $\\mathbb{R}^n$ is reachable.",
          "非零的零空间使 $A$ 奇异，所以并非 $\\mathbb{R}^n$ 中每个 $\\mathbf{b}$ 都可达。",
        ),
        why(
          n + p,
          "Rank and nullity add up to $n$, so subtract the nullity rather than add it.",
          "秩与零化度之和是 $n$，所以要减去零化度，而不是加上。",
        ),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Name the set", "说出这个集合"],
            text([
              "$A\\mathbf{x}$ is a combination of the columns of $A$, so the reachable $\\mathbf{b}$ form the column space, of dimension $\\operatorname{rank} A$.",
              "$A\\mathbf{x}$ 是 $A$ 各列的组合，所以可达的 $\\mathbf{b}$ 构成列空间，维数为 $\\operatorname{rank} A$。",
            ]),
          ],
          [["Apply rank-nullity", "用秩-零化度定理"], text(["", ""]), [`\\operatorname{rank} A = ${n} - ${p} = ${answer}`]],
        ],
        text([
          `Rank plus nullity is $${answer} + ${p} = ${n}$, the number of columns, and $${answer} < ${n}$ shows that some $\\mathbf{b}$ cannot be reached.`,
          `秩加零化度为 $${answer} + ${p} = ${n}$，正是列数；而 $${answer} < ${n}$ 说明有些 $\\mathbf{b}$ 不可达。`,
        ]),
      ),
    });
  },
);

const shiftedSpace = point(
  "the-zero-and-inverses-of-a-shifted-vector-space",
  ["The zero and inverses of a shifted vector space", "平移向量空间的零元和逆元"],
  [
    "With unusual operations, the zero vector need not be the number $0$. It is whichever element leaves every other element unchanged under the given addition. The additive inverse of an element is then whatever adds to it to give this zero, not to give $0$. For example, with $x \\oplus y = x + y - 3$, the zero is $3$, since $x \\oplus 3 = x$, and the inverse of $5$ is $1$, since $5 \\oplus 1 = 3$.\n\n> **Watch out.** Solve $x \\oplus z = x$ with the new addition; the ordinary $0$ and the ordinary $-x$ are usually wrong here.",
    "在非常规运算下，零向量不一定是数 $0$。它是在给定加法下使其他元素都不变的那个元素。元素的加法逆元则是与它相加得到这个零元的元素，而不是得到 $0$。例如在 $x \\oplus y = x + y - 3$ 下，零元是 $3$，因为 $x \\oplus 3 = x$；$5$ 的逆元是 $1$，因为 $5 \\oplus 1 = 3$。\n\n> **注意。** 要用新的加法解 $x \\oplus z = x$；通常的 $0$ 和通常的 $-x$ 在这里一般是错的。",
  ],
  (rng) => {
    const k = nz(rng, 9);
    const a = rng.int(-12, 12);
    const op = `x \\oplus y = ${poly([1, "x"], [1, "y"], [-k, ""])}`;
    if (rng.bool()) {
      return numberProblem({
        prompt: text([
          `$\\mathbb{R}$ is made into a vector space with the addition $${op}$. Find its zero vector.`,
          `用加法 $${op}$ 把 $\\mathbb{R}$ 变成向量空间。求它的零向量。`,
        ]),
        answer: k,
        form: "integer",
        mistakes: [
          why(
            0,
            `$x \\oplus 0 = ${poly([1, "x"], [-k, ""])}$, which is not $x$; the zero must be found with the new addition.`,
            `$x \\oplus 0 = ${poly([1, "x"], [-k, ""])}$，不等于 $x$；零元要用新的加法来求。`,
          ),
          why(-k, `The sign is flipped: $z - ${wrap(k)} = 0$ gives $z = ${k}$.`, `符号反了：$z - ${wrap(k)} = 0$ 给出 $z = ${k}$。`),
          why(
            2 * k,
            `$x \\oplus ${wrap(2 * k)} = ${poly([1, "x"], [k, ""])}$, which is not $x$.`,
            `$x \\oplus ${wrap(2 * k)} = ${poly([1, "x"], [k, ""])}$，不等于 $x$。`,
          ),
        ].filter((w, i, all) => w.value !== k && all.findIndex((o) => o.value === w.value) === i),
        solution: walked(
          [
            [
              ["Write the condition", "写出条件"],
              text(["The zero vector $z$ needs $x \\oplus z = x$ for every $x$:", "零向量 $z$ 要对每个 $x$ 满足 $x \\oplus z = x$："]),
              [`${poly([1, "x"], [1, "z"], [-k, ""])} = x`],
            ],
            [
              ["Solve for $z$", "解出 $z$"],
              text(["Subtract $x$ from both sides:", "两边减去 $x$："]),
              [`${poly([1, "z"], [-k, ""])} = 0`, `z = ${k}`],
            ],
          ],
          text([
            `$x \\oplus ${wrap(k)} = x + ${wrap(k)} - ${wrap(k)} = x$ for every $x$.`,
            `对每个 $x$，$x \\oplus ${wrap(k)} = x + ${wrap(k)} - ${wrap(k)} = x$。`,
          ]),
        ),
      });
    }
    const answer = 2 * k - a;
    return numberProblem({
      prompt: text([
        `$\\mathbb{R}$ is made into a vector space with the addition $${op}$. Find the additive inverse of $${a}$.`,
        `用加法 $${op}$ 把 $\\mathbb{R}$ 变成向量空间。求 $${a}$ 的加法逆元。`,
      ]),
      answer,
      form: "integer",
      mistakes: [
        why(
          -a,
          `That is the ordinary inverse; here $${a} \\oplus ${wrap(-a)} = ${-k}$, not the zero vector $${k}$.`,
          `这是通常的逆元；这里 $${a} \\oplus ${wrap(-a)} = ${-k}$，不是零向量 $${k}$。`,
        ),
        why(
          k - a,
          `That makes $${a} \\oplus y$ equal to the number $0$; it must equal the zero vector, $${k}$.`,
          `这使 $${a} \\oplus y$ 等于数 $0$；它应当等于零向量 $${k}$。`,
        ),
        why(a - 2 * k, "The sign is flipped; solve for $y$ again.", "符号反了；请重新解出 $y$。"),
      ].filter((w, i, all) => w.value !== answer && all.findIndex((o) => o.value === w.value) === i),
      solution: walked(
        [
          [
            ["Find the zero vector", "求零向量"],
            text([
              `$x \\oplus z = x$ means $x + z - ${wrap(k)} = x$, so the zero vector is $${k}$.`,
              `$x \\oplus z = x$ 即 $x + z - ${wrap(k)} = x$，所以零向量是 $${k}$。`,
            ]),
          ],
          [
            ["Solve for the inverse", "解出逆元"],
            text([`The inverse $y$ needs $${a} \\oplus y = ${k}$:`, `逆元 $y$ 要满足 $${a} \\oplus y = ${k}$：`]),
            [`${a} + y - ${wrap(k)} = ${k}`, `y = ${answer}`],
          ],
        ],
        text([
          `$${a} \\oplus ${wrap(answer)} = ${a} + ${wrap(answer)} - ${wrap(k)} = ${k}$, the zero vector.`,
          `$${a} \\oplus ${wrap(answer)} = ${a} + ${wrap(answer)} - ${wrap(k)} = ${k}$，正是零向量。`,
        ]),
      ),
    });
  },
);

const useBasisMatrix = point(
  "using-a-matrix-relative-to-a-basis",
  ["Using a matrix relative to a basis", "使用相对于基的矩阵"],
  [
    "The columns of $[T]_{\\mathcal{B}}$ are the coordinates of $T(\\mathbf{b}_{j})$ in the basis, so the matrix acts on coordinates and returns coordinates. To get an actual vector, the output must be turned back into a combination of the basis vectors.",
    "$[T]_{\\mathcal{B}}$ 的各列是 $T(\\mathbf{b}_{j})$ 在基下的坐标，所以矩阵作用于坐标并返回坐标。要得到实际的向量，必须把输出还原成基向量的线性组合。",
  ],
  (rng) => {
    const b11 = nz(rng, 4);
    const b21 = nz(rng, 4);
    const b12 = nz(rng, 4);
    const b20 = nz(rng, 4);
    const b22 = b11 * b20 === b12 * b21 ? b20 + 1 : b20;
    const p = nz(rng, 5);
    const q = nz(rng, 5);
    const r = nz(rng, 5);
    const s = nz(rng, 5);
    const answer = (p + q) * b11 + (r + s) * b12;
    return ask(
      [
        `$[T]_{\\mathcal{B}} = ${mat([
          [p, q],
          [r, s],
        ])}$ in the basis $\\mathbf{b}_{1} = ${vec(b11, b21)}$, $\\mathbf{b}_{2} = ${vec(b12, b22)}$. Find the first entry of $T(\\mathbf{b}_{1} + \\mathbf{b}_{2})$.`,
        `在基 $\\mathbf{b}_{1} = ${vec(b11, b21)}$，$\\mathbf{b}_{2} = ${vec(b12, b22)}$ 下，$[T]_{\\mathcal{B}} = ${mat([
          [p, q],
          [r, s],
        ])}$。求 $T(\\mathbf{b}_{1} + \\mathbf{b}_{2})$ 的第一个元素。`,
      ],
      answer,
      [(p + r) * b11 + (q + s) * b12, p + q + r + s, -answer],
      [
        `The coordinates of $\\mathbf{b}_{1} + \\mathbf{b}_{2}$ are $(1, 1)$, so the output has coordinates $(${p + q}, ${r + s})$. Its first entry is $${wrap(p + q)} \\cdot ${wrap(b11)} + ${wrap(r + s)} \\cdot ${wrap(b12)} = ${answer}$.`,
        `$\\mathbf{b}_{1} + \\mathbf{b}_{2}$ 的坐标是 $(1, 1)$，所以输出的坐标是 $(${p + q}, ${r + s})$。它的第一个元素是 $${wrap(p + q)} \\cdot ${wrap(b11)} + ${wrap(r + s)} \\cdot ${wrap(b12)} = ${answer}$。`,
      ],
    );
  },
);

const derivativeShifted = point(
  "the-derivative-with-a-shifted-target-basis",
  ["The derivative with a shifted target basis", "目标基平移后的导数矩阵"],
  [
    "Each column of a matrix relative to two bases holds the coordinates of an image in the target basis. With the target basis $\\{1, x - c\\}$, the polynomial $2x$ must first be rewritten as $2(x - c) + 2c$, so a constant appears that the standard basis does not show.",
    "相对于两个基的矩阵，每一列都是像在目标基下的坐标。目标基是 $\\{1, x - c\\}$ 时，多项式 $2x$ 必须先改写成 $2(x - c) + 2c$，于是出现一个在标准基下看不到的常数。",
  ],
  (rng) => {
    const c = nz(rng, 9);
    const k = nz(rng, 5);
    const answer = 2 * k * c;
    return ask(
      [
        `$T: P_{2} \\to P_{1}$ is $T(p) = ${poly([k, "p'"])}$, with bases $\\{1, x, x^{2}\\}$ and $\\{1, ${poly([1, "x"], [-c, ""])}\\}$. Find the $(1, 3)$ entry of its matrix.`,
        `$T: P_{2} \\to P_{1}$ 是 $T(p) = ${poly([k, "p'"])}$，基分别是 $\\{1, x, x^{2}\\}$ 和 $\\{1, ${poly([1, "x"], [-c, ""])}\\}$。求它的矩阵的 $(1, 3)$ 元素。`,
      ],
      answer,
      [2 * k, -answer, 2 * c],
      [
        `$T(x^{2}) = ${poly([2 * k, "x"])} = ${poly([2 * k, ""])}(${poly([1, "x"], [-c, ""])}) + ${wrap(answer)}$. The coefficient of $1$ is the first entry of the column, so the entry is $${answer}$.`,
        `$T(x^{2}) = ${poly([2 * k, "x"])} = ${poly([2 * k, ""])}(${poly([1, "x"], [-c, ""])}) + ${wrap(answer)}$。$1$ 的系数是这一列的第一个元素，所以该元素是 $${answer}$。`,
      ],
    );
  },
);

const entryFromEigenvector = point(
  "a-matrix-entry-from-an-eigenvector",
  ["A matrix entry from an eigenvector", "由特征向量求矩阵元素"],
  [
    "A known eigenvector gives two equations, one for each row. If one row is fully known, it gives the eigenvalue directly, and then the other row determines an unknown entry. The eigenvalue does not need to be given in advance.",
    "已知的特征向量给出两个方程，每行一个。如果有一行完全已知，它直接给出特征值，另一行就能确定未知元素。特征值不需要事先给出。",
  ],
  (rng) => {
    const a = nz(rng, 6);
    const b = nz(rng, 5);
    const m = nz(rng, 4);
    const k = nz(rng, 9);
    const lambda = a + b * m;
    const c = lambda * m - k * m;
    return ask(
      [
        `$${vec(1, m)}$ is an eigenvector of $${mat([
          [a, b],
          [c, "t"],
        ])}$. Find $t$.`,
        `$${vec(1, m)}$ 是 $${mat([
          [a, b],
          [c, "t"],
        ])}$ 的特征向量。求 $t$。`,
      ],
      k,
      [lambda, -k, lambda === a ? a + 1 : a],
      [
        `The first row gives $\\lambda = ${a} + ${wrap(b)} \\cdot ${wrap(m)} = ${lambda}$. The second row gives $${poly([m, "t"], [c, ""])} = ${lambda * m}$, so $t = ${k}$.`,
        `第一行给出 $\\lambda = ${a} + ${wrap(b)} \\cdot ${wrap(m)} = ${lambda}$。第二行给出 $${poly([m, "t"], [c, ""])} = ${lambda * m}$，所以 $t = ${k}$。`,
      ],
    );
  },
);

const lastEigenvector = point(
  "the-last-eigenvector-of-a-triangular-matrix",
  ["The last eigenvector of a triangular matrix", "三角矩阵的最后一个特征向量"],
  [
    "For an upper triangular matrix, the eigenvector of the last diagonal entry has every component in play. Set the last component to $1$ and work upward: each row then gives one component, which depends on those below it found earlier.",
    "对上三角矩阵，最后一个对角元素的特征向量的所有分量都起作用。令最后一个分量为 $1$，然后向上计算：每一行给出一个分量，它依赖于前面已求出的下方的分量。",
  ],
  (rng) => {
    const a11 = rng.int(-6, 6);
    const a22 = rng.pick([-7, -5, -3, -1, 2, 4, 6].filter((v) => v !== a11));
    const a33 = rng.pick([-8, -4, -2, 1, 3, 5, 7, 8].filter((v) => v !== a11 && v !== a22));
    const x1 = nz(rng, 5);
    const x2 = nz(rng, 5);
    const a12 = nz(rng, 4);
    const a23 = (a33 - a22) * x2;
    const a13 = (a33 - a11) * x1 - a12 * x2;
    return ask(
      [
        `$${vec("x_{1}", "x_{2}", 1)}$ is an eigenvector of $${mat([
          [a11, a12, a13],
          [0, a22, a23],
          [0, 0, a33],
        ])}$ for $\\lambda = ${a33}$. Find $x_{1}$.`,
        `$${vec("x_{1}", "x_{2}", 1)}$ 是 $${mat([
          [a11, a12, a13],
          [0, a22, a23],
          [0, 0, a33],
        ])}$ 关于 $\\lambda = ${a33}$ 的特征向量。求 $x_{1}$。`,
      ],
      x1,
      [x2, -x1, a13],
      [
        `Row $2$ of $A - ${wrap(a33)}I$ gives $${poly([a22 - a33, "x_{2}"], [a23, ""])} = 0$, so $x_{2} = ${x2}$. Row $1$ then gives $${poly([a11 - a33, "x_{1}"], [a12 * x2 + a13, ""])} = 0$, so $x_{1} = ${x1}$.`,
        `$A - ${wrap(a33)}I$ 的第 $2$ 行给出 $${poly([a22 - a33, "x_{2}"], [a23, ""])} = 0$，所以 $x_{2} = ${x2}$。第 $1$ 行再给出 $${poly([a11 - a33, "x_{1}"], [a12 * x2 + a13, ""])} = 0$，所以 $x_{1} = ${x1}$。`,
      ],
    );
  },
);

const geometricMult = point(
  "a-single-entry-decides-the-geometric-multiplicity",
  ["A single entry decides the geometric multiplicity", "一个元素决定几何重数"],
  [
    "A repeated eigenvalue may have fewer independent eigenvectors than its multiplicity. The geometric multiplicity is $3$ minus the rank of $A - \\lambda I$. In a triangular matrix, one entry above the diagonal can raise that rank and remove an eigenvector.",
    "重特征值的线性无关特征向量可能少于其重数。几何重数等于 $3$ 减去 $A - \\lambda I$ 的秩。在三角矩阵中，对角线上方的一个元素就能提高这个秩，并减少一个特征向量。",
  ],
  (rng) => {
    const l = nz(rng, 6);
    const mu = rng.pick([-7, -5, -2, 1, 3, 4, 7, 8].filter((v) => v !== l));
    const zero = rng.bool();
    const a = zero ? 0 : nz(rng, 5);
    const b = nz(rng, 5);
    const k = nz(rng, 5);
    const answer = zero ? 2 : 1;
    return ask(
      [
        `Find the geometric multiplicity of the eigenvalue $${l}$ of $${mat([
          [l, a, b],
          [0, l, k],
          [0, 0, mu],
        ])}$.`,
        `求 $${mat([
          [l, a, b],
          [0, l, k],
          [0, 0, mu],
        ])}$ 的特征值 $${l}$ 的几何重数。`,
      ],
      answer,
      [3, zero ? 1 : 2, 0],
      zero
        ? [
            "In $A - \\lambda I$ the first two columns are zero, and all the rows are multiples of one row. So the rank is $1$ and the geometric multiplicity is $2$.",
            "在 $A - \\lambda I$ 中，前两列为零，各行都是同一行的倍数。所以秩是 $1$，几何重数是 $2$。",
          ]
        : [
            "In $A - \\lambda I$ the nonzero $(1, 2)$ entry and the nonzero $(3, 3)$ entry give two pivots. So the rank is $2$ and the geometric multiplicity is $1$.",
            "在 $A - \\lambda I$ 中，非零的 $(1, 2)$ 元素和非零的 $(3, 3)$ 元素给出两个主元。所以秩是 $2$，几何重数是 $1$。",
          ],
    );
  },
);

const powerOnCombination = point(
  "a-matrix-power-on-a-combination-of-eigenvectors",
  ["A matrix power on a combination of eigenvectors", "矩阵幂作用于特征向量的组合"],
  [
    "Diagonalization makes matrix powers simple: when a vector is written in the eigenvector basis, $A^{n}$ multiplies each coefficient by the $n$th power of its eigenvalue. Each eigenvector stays separate, and the coefficient itself is not raised to the power.",
    "对角化使矩阵的幂变得简单：把向量写成特征向量基的组合后，$A^{n}$ 把每个系数乘以相应特征值的 $n$ 次幂。各特征向量彼此独立，系数本身不取幂。",
  ],
  (rng) => {
    const l1 = rng.pick([-3, -2, 1, 2, 3]);
    const l2 = rng.pick([-4, -1, 4]);
    const l3 = rng.pick([5, -5]);
    const c1 = nz(rng, 5);
    const c2 = nz(rng, 5);
    const c3 = nz(rng, 5);
    const n = rng.int(2, 3);
    const answer = c2 * l2 ** n;
    return ask(
      [
        `$\\mathbf{v}_{1}, \\mathbf{v}_{2}, \\mathbf{v}_{3}$ are eigenvectors of $A$ for the eigenvalues $${l1}$, $${l2}$, $${l3}$, and $\\mathbf{x} = ${poly([c1, "\\mathbf{v}_{1}"], [c2, "\\mathbf{v}_{2}"], [c3, "\\mathbf{v}_{3}"])}$. Find the coefficient of $\\mathbf{v}_{2}$ in $A^{${n}}\\mathbf{x}$.`,
        `$\\mathbf{v}_{1}, \\mathbf{v}_{2}, \\mathbf{v}_{3}$ 是 $A$ 关于特征值 $${l1}$、$${l2}$、$${l3}$ 的特征向量，$\\mathbf{x} = ${poly([c1, "\\mathbf{v}_{1}"], [c2, "\\mathbf{v}_{2}"], [c3, "\\mathbf{v}_{3}"])}$。求 $A^{${n}}\\mathbf{x}$ 中 $\\mathbf{v}_{2}$ 的系数。`,
      ],
      answer,
      [c2 * l2, l2 ** n, n * c2 * l2],
      [
        `$A^{${n}}\\mathbf{v}_{2} = ${wrap(l2)}^{${n}}\\mathbf{v}_{2}$, and the coefficient $${c2}$ is kept. So the coefficient is $${wrap(c2)} \\cdot ${wrap(l2 ** n)} = ${answer}$.`,
        `$A^{${n}}\\mathbf{v}_{2} = ${wrap(l2)}^{${n}}\\mathbf{v}_{2}$，系数 $${c2}$ 保留。所以结果是 $${wrap(c2)} \\cdot ${wrap(l2 ** n)} = ${answer}$。`,
      ],
    );
  },
);

/** deeperLinearAlgebraThirdPoints maps topics of Linear Algebra, from sets and elimination to eigenvectors, to a third knowledge point. */
export const deeperLinearAlgebraThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "special-sets": [squaresBounded],
  "statements-and-predicates": [negation],
  "the-constructive-definition-of-a-set": [imageSet],
  "describing-sets-using-set-builder-notation": [residuesInInterval],
  "infinite-sets": [listingIntegers],
  "elementary-row-operations": [detEffect],
  "creating-rows-or-columns-containing-zeros-using-gaussian-elimination": [columnClear],
  "solving-2x2-systems-of-equations-using-gaussian-elimination": [breakdownK],
  "solving-2x2-singular-systems-of-equations-using-gaussian-elimination": [lineOfSolutions],
  "solving-3x3-systems-of-equations-using-gaussian-elimination": [pairSums],
  "identifying-the-pivot-columns-of-a-matrix": [pivotAfterReducing],
  "gaussian-elimination-for-nxm-systems-of-equations": [rankDecides],
  "elementary-2x2-matrices": [detOfElementary],
  "row-operations-on-2x2-matrices-as-products-of-elementary-matrices": [rightMultiply],
  "row-operations-on-3x3-matrices-as-products-of-elementary-matrices": [productNotInverse],
  "the-invertible-matrix-theorem-in-terms-of-2x2-systems-of-equations": [nullVectorOfSingular],
  "finding-the-inverse-of-a-3x3-matrix-using-row-operations": [blockInverse],
  "triangular-matrices": [triangularTrace],
  "lu-factorization-of-3x3-matrices": [recoverFromLu],
  "lu-factorization-of-nxn-matrices": [pivotFromMinors],
  "solving-systems-of-equations-using-lu-factorization": [transposeSolve],
  "subspaces-of-n-dimensional-space": [subspaceK],
  "finding-a-basis-of-the-column-space-of-a-matrix": [inColumnSpace],
  "finding-a-basis-of-the-null-space-of-a-matrix": [nullReverse],
  "expressing-the-coordinates-of-a-vector-in-a-given-basis": [scaledBasis],
  "writing-vectors-in-different-bases": [betweenBases],
  "the-invertible-matrix-theorem-in-terms-of-dimension-rank-and-nullity": [solvableDimension],
  "defining-abstract-vector-spaces": [shiftedSpace],
  "matrix-of-a-linear-transformation-relative-to-a-basis": [useBasisMatrix],
  "matrix-of-a-linear-map-relative-to-two-bases": [derivativeShifted],
  "calculating-the-eigenvectors-of-a-2x2-matrix": [entryFromEigenvector],
  "calculating-the-eigenvectors-of-a-3x3-matrix-with-distinct-eigenvalues": [lastEigenvector],
  "calculating-the-eigenvectors-of-a-3x3-matrix-in-the-general-case": [geometricMult],
  "diagonalizing-a-3x3-matrix-with-distinct-eigenvalues": [powerOnCombination],
};
