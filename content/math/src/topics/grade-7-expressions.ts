import type { KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, num, paren, poly, Q } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";
import type { Pair, Walk } from "./early-grades-more-kit.ts";
import { chosenMath, expressed, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { areaGridFigure, stripsFigure, tapeFigure } from "./upper-grades-kit.ts";

// 7th Grade Math: rewriting linear expressions with the distributive law, subtracted groups and fractional
// coefficients, factoring numerical expressions, and evaluating rational expressions.

/** ccss is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

/** Term is a coefficient and a variable part: [3, "x"] is 3x, and [-5, ""] is the constant −5. */
type Term = readonly [Q | number, string];

/** variables are the letters used for unknowns; none of them reads as an English word. */
const variables = ["x", "y", "n", "m", "p", "k", "t", "w"] as const;

/** pickVar draws a variable letter. */
const pickVar = (rng: Rng) => rng.pick(variables);

/** twoVars draws two different variable letters in alphabetical order. */
function twoVars(rng: Rng): [string, string] {
  const [a, b] = rng.sample([...variables], 2) as [string, string];
  return a < b ? [a, b] : [b, a];
}

/** gcd is the greatest common divisor of two integers. */
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** toQ reads a coefficient as a rational number. */
const toQ = (c: Q | number): Q => (c instanceof Q ? c : Q.of(c));

/** scale multiplies every term by k. */
const scale = (k: Q | number, terms: readonly Term[]): Term[] => terms.map(([c, v]) => [toQ(c).mul(toQ(k)), v]);

/** factor writes a coefficient in front of parentheses: factor(-1, "x + 2") is "-(x + 2)". */
const factor = (a: number, inner: string) => `${a === 1 ? "" : a === -1 ? "-" : num(a)}(${inner})`;

/** termTimes writes k times one term as a product: termTimes(-3, [-2, "y"]) is "(-3) \cdot (-2y)". */
const termTimes = (k: Q | number, [c, v]: Term) => {
  const term = poly([c, v]);
  return `${paren(k)} \\cdot ${toQ(c).sign() < 0 ? `(${term})` : term}`;
};

/** products writes k times each term, joined by plus signs: the middle step of distributing. */
const products = (k: Q | number, terms: readonly Term[]) => terms.map((x) => termTimes(k, x)).join(" + ");

/** tail writes terms that continue an expression, with a leading sign: tail([-2, "x"]) is "- 2x". */
function tail(...terms: readonly Term[]): string {
  const s = poly(...terms);
  return s.startsWith("-") ? `- ${s.slice(1)}` : `+ ${s}`;
}

/** threeTerms draws two variable terms and a constant with nonzero coefficients, in random order. */
function threeTerms(rng: Rng): Term[] {
  const [u, w] = twoVars(rng);
  return rng.shuffle<Term>([
    [rng.nonZero(-9, 9), u],
    [rng.nonZero(-9, 9), w],
    [rng.nonZero(-12, 12), ""],
  ]);
}

// ---------------------------------------------------------------------------
// The distributive law

/** at evaluates terms with each variable replaced by its value. */
const at = (terms: readonly Term[], values: Readonly<Record<string, number>>): Q =>
  terms.reduce((s, [c, v]) => s.add(toQ(c).mul(Q.of(v === "" ? 1 : (values[v] ?? 0)))), Q.zero);

/** trial gives the letters of some terms small values for a check: 2 for the first letter, 3 for the next. */
function trial(...groups: readonly (readonly Term[])[]): Record<string, number> {
  const letters = [...new Set(groups.flat().map(([, v]) => v))].filter((v) => v !== "").sort();
  return Object.fromEntries(letters.map((v, i) => [v, i + 2]));
}

/** substitution checks a rewriting by putting the trial values into both forms. */
function substitution(
  before: string,
  beforeValue: Q,
  after: string,
  afterTerms: readonly Term[],
  values: Readonly<Record<string, number>>,
): Pair {
  const given = Object.entries(values)
    .map(([v, n]) => `${v} = ${n}`)
    .join(", ");
  const [b, a] = [beforeValue.toLatex(), at(afterTerms, values).toLatex()];
  return [
    `Put in $${given}$: $${before}$ becomes $${b}$, and $${after}$ becomes $${a}$ too.`,
    `代入 $${given}$：$${before}$ 得 $${b}$，$${after}$ 也得 $${a}$。`,
  ];
}

/** theDistributiveLawWithThreeTerms multiplies a factor into a group of three terms. */
export const theDistributiveLawWithThreeTerms = withIntro(
  topic(
    "the-distributive-law-with-three-terms",
    t("The Distributive Law With Three Terms", "含三项的乘法分配律"),
    t(
      "The distributive law works for any number of terms in the parentheses: $a(b + c + d) = ab + ac + ad$. The factor outside multiplies every term, so $4(2x - y + 3) = 8x - 4y + 12$, and a negative factor changes the sign of every term: $-2(3x + y - 5) = -6x - 2y + 10$.",
      "乘法分配律对括号内任意多项都成立：$a(b + c + d) = ab + ac + ad$。括号外的因数要乘以每一项，所以 $4(2x - y + 3) = 8x - 4y + 12$；负因数会改变每一项的符号：$-2(3x + y - 5) = -6x - 2y + 10$。",
    ),
    ["distributive-property"],
    ["7.EE.A.1"],
    [
      {
        ...lesson(
          "a-positive-factor",
          ["A positive factor", "正因数"],
          [
            [
              "Multiply the factor outside by each of the three terms, and keep each term's sign: $5(2a - 3b + 4) = 5 \\cdot 2a + 5 \\cdot (-3b) + 5 \\cdot 4 = 10a - 15b + 20$. Think of a rectangle $5$ tall whose width is cut into three parts: its area is the three smaller areas together.",
              "用括号外的因数分别乘三项中的每一项，并保留每一项的符号：$5(2a - 3b + 4) = 5 \\cdot 2a + 5 \\cdot (-3b) + 5 \\cdot 4 = 10a - 15b + 20$。可以想成一个高为 $5$ 的长方形，宽分成三段：它的面积就是三块小面积合起来。",
            ],
            [
              "Put in $a = 2$, $b = 3$: $5(4 - 9 + 4) = 5$, and $20 - 45 + 20 = 5$ too.",
              "代入 $a = 2$，$b = 3$：$5(4 - 9 + 4) = 5$，而 $20 - 45 + 20$ 也等于 $5$。",
            ],
            [
              "Multiply all three terms, not just the first one or two: the answer has as many terms as the parentheses.",
              "三项都要乘，不能只乘前一两项：结果的项数要和括号里一样多。",
            ],
          ],
          (rng) => {
            const k = rng.int(2, 9);
            const terms = threeTerms(rng);
            const [, b, c] = terms as [Term, Term, Term];
            const expr = `${k}(${poly(...terms)})`;
            const answer = poly(...scale(k, terms));
            const [ka, kb, kc] = scale(k, terms) as [Term, Term, Term];
            const values = trial(terms);
            return expressed(
              [`Expand $${expr}$.`, `展开 $${expr}$。`],
              answer,
              [
                [
                  ["Multiply each term", "逐项相乘"],
                  [`Multiply $${k}$ by every term in the parentheses:`, `用 $${k}$ 乘括号里的每一项：`],
                  [`${expr} = ${products(k, terms)}`],
                ],
                [
                  ["Simplify the products", "算出每个积"],
                  ["Work out each product:", "算出每个积："],
                  [`${products(k, terms)} = ${answer}`],
                ],
              ],
              substitution(expr, at(terms, values).mul(Q.of(k)), answer, scale(k, terms), values),
              [
                [
                  poly(ka, b, c),
                  `That multiplies only the first term; $${k}$ multiplies all three.`,
                  `这只乘了第一项；$${k}$ 要乘全部三项。`,
                ],
                [poly(ka, kb, c), "That leaves the last term unmultiplied.", "这是最后一项没有乘。"],
                [poly(ka, b, kc), "That skips the middle term.", "这是漏乘了中间一项。"],
              ],
              { simplified: true },
            );
          },
          areaGridFigure(["5"], ["2a", "-3b", "4"], [["10a", "-15b", "20"]]),
        ),
        keyPrerequisites: ["distributive-property"],
      },
      {
        ...lesson(
          "a-negative-factor",
          ["A negative factor", "负因数"],
          [
            [
              "A negative factor multiplies every term too, so every sign in the parentheses changes. Work term by term, using the sign rules: $-3(2x - y + 4) = (-3) \\cdot 2x + (-3) \\cdot (-y) + (-3) \\cdot 4 = -6x + 3y - 12$.",
              "负因数同样要乘每一项，所以括号里每一项的符号都改变。按符号法则逐项计算：$-3(2x - y + 4) = (-3) \\cdot 2x + (-3) \\cdot (-y) + (-3) \\cdot 4 = -6x + 3y - 12$。",
            ],
            [
              "Put in $x = 2$, $y = 3$: $-3(4 - 3 + 4) = -15$, and $-12 + 9 - 12 = -15$ too.",
              "代入 $x = 2$，$y = 3$：$-3(4 - 3 + 4) = -15$，而 $-12 + 9 - 12$ 也等于 $-15$。",
            ],
            ["A negative times a negative is positive: $(-3) \\cdot (-y)$ is $+3y$.", "负数乘负数得正数：$(-3) \\cdot (-y)$ 是 $+3y$。"],
          ],
          (rng) => {
            const k = -rng.int(2, 9);
            const terms = threeTerms(rng);
            const [, b, c] = terms as [Term, Term, Term];
            const expr = `${k}(${poly(...terms)})`;
            const answer = poly(...scale(k, terms));
            const [ka, kb] = scale(k, terms) as [Term, Term, Term];
            const [, mb, mc] = scale(-k, terms) as [Term, Term, Term];
            const values = trial(terms);
            return expressed(
              [`Expand $${expr}$.`, `展开 $${expr}$。`],
              answer,
              [
                [
                  ["Multiply each term", "逐项相乘"],
                  [`Multiply $${k}$ by every term in the parentheses:`, `用 $${k}$ 乘括号里的每一项：`],
                  [`${expr} = ${products(k, terms)}`],
                ],
                [
                  ["Use the sign rules", "用符号法则"],
                  ["A negative factor changes the sign of every term:", "负因数让每一项都变号："],
                  [`${products(k, terms)} = ${answer}`],
                ],
              ],
              substitution(expr, at(terms, values).mul(Q.of(k)), answer, scale(k, terms), values),
              [
                [
                  poly(ka, mb, mc),
                  `That gives the minus sign only to the first term; $${k}$ multiplies every term.`,
                  `这只让第一项变了号；$${k}$ 要乘每一项。`,
                ],
                [
                  poly(ka, b, c),
                  `That multiplies only the first term; $${k}$ multiplies all three.`,
                  `这只乘了第一项；$${k}$ 要乘全部三项。`,
                ],
                [
                  poly(...scale(-k, terms)),
                  "That drops the minus sign of the factor; every sign should change.",
                  "这是丢掉了因数的负号；每一项的符号都应该改变。",
                ],
                [poly(ka, kb, mc), "The sign of the last term is wrong.", "最后一项的符号错了。"],
              ],
              { simplified: true },
            );
          },
          areaGridFigure(["-3"], ["2x", "-y", "4"], [["-6x", "3y", "-12"]]),
        ),
        keyPrerequisites: ["multiplying-integers"],
      },
    ],
  ),
  ["What is $2(x + y + 1)$ without parentheses?", "$2(x + y + 1)$ 去掉括号是什么？"],
  [
    "$2x + 2y + 2$: the $2$ multiplies all three terms. For $x = 2$, $y = 3$ both give $12$.",
    "$2x + 2y + 2$：$2$ 要乘全部三项。当 $x = 2$，$y = 3$ 时两者都得 $12$。",
  ],
  ["multiply a positive or negative factor into a group of three terms.", "把正因数或负因数乘进含三项的括号。"],
);

/** groupTerms draws the terms of a group to be negated: one variable and a constant, or two variables and a constant. */
function groupTerms(rng: Rng): Term[] {
  if (rng.bool(0.4)) return threeTerms(rng);
  const v = pickVar(rng);
  const terms: Term[] = [
    [rng.nonZero(-9, 9), v],
    [rng.nonZero(-15, 15), ""],
  ];
  return rng.bool(0.3) ? [terms[1]!, terms[0]!] : terms;
}

/** distributingTheNegativeSignInALinearExpression removes a minus sign in front of parentheses. */
export const distributingTheNegativeSignInALinearExpression = withIntro(
  topic(
    "distributing-the-negative-sign-in-a-linear-expression",
    t("Distributing the Negative Sign in a Linear Expression", "去掉一次式括号前的负号"),
    t(
      "A negative sign in front of parentheses means multiplying by $-1$, so it changes the sign of every term inside: $-(3x - 2y + 5) = -3x + 2y - 5$. The result is the opposite of the expression in the parentheses: the two add to $0$.",
      "括号前的负号表示乘以 $-1$，所以括号内每一项都要变号：$-(3x - 2y + 5) = -3x + 2y - 5$。结果是括号内式子的相反式：两者相加得 $0$。",
    ),
    ["the-distributive-law-with-three-terms"],
    ["7.EE.A.1", "7.EE.A.2"],
    [
      {
        ...lesson(
          "removing-a-negative-sign",
          ["Removing a negative sign before parentheses", "去掉括号前的负号"],
          [
            [
              "A negative sign in front of parentheses is $-1$ times the group. Multiply every term by $-1$: every term changes sign, not only the first. $-(4n - 7) = -4n + 7$, and $-(-2x + y - 3) = 2x - y + 3$.",
              "括号前的负号就是 $-1$ 乘这组式子。用 $-1$ 乘每一项：每一项都变号，而不只是第一项。$-(4n - 7) = -4n + 7$，$-(-2x + y - 3) = 2x - y + 3$。",
            ],
            [
              "Add the two: $(4n - 7) + (-4n + 7) = 0$, so they are opposites.",
              "两式相加：$(4n - 7) + (-4n + 7) = 0$，所以它们互为相反式。",
            ],
            ["Change every sign: $-(4n - 7)$ is $-4n + 7$, not $-4n - 7$.", "每一项都要变号：$-(4n - 7)$ 是 $-4n + 7$，不是 $-4n - 7$。"],
          ],
          (rng) => {
            const terms = groupTerms(rng);
            const inside = poly(...terms);
            const expr = `-(${inside})`;
            const negated = scale(-1, terms);
            const answer = poly(...negated);
            const [first, ...rest] = terms as [Term, ...Term[]];
            const [nFirst, ...nRest] = negated as [Term, ...Term[]];
            return expressed(
              [`Simplify $${expr}$.`, `化简 $${expr}$。`],
              answer,
              [
                [
                  ["Multiply by -1", "乘 -1"],
                  [
                    "The minus sign is $-1$ times the group, so multiply every term by $-1$:",
                    "负号就是 $-1$ 乘这组式子，所以每一项都乘 $-1$：",
                  ],
                  [`${expr} = ${products(-1, terms)}`],
                ],
                [
                  ["Every sign changes", "每一项都变号"],
                  ["Each term becomes its opposite:", "每一项都变成它的相反数："],
                  [`${products(-1, terms)} = ${answer}`],
                ],
              ],
              [
                `Add the two: $(${inside}) + (${answer}) = 0$, so they are opposites.`,
                `两式相加：$(${inside}) + (${answer}) = 0$，所以它们互为相反式。`,
              ],
              [
                [
                  poly(nFirst, ...rest),
                  "That changes only the first sign; every term changes sign.",
                  "这只改变了第一项的符号；每一项都要变号。",
                ],
                [poly(first, ...nRest), "That leaves the first term unchanged; it changes sign too.", "这是第一项没有变号；它也要变号。"],
                [inside, "That drops the minus sign without changing any term.", "这是去掉了负号，却没有让任何一项变号。"],
              ],
              { simplified: true },
            );
          },
          areaGridFigure(["-1"], ["4n", "-7"], [["-4n", "7"]]),
        ),
        keyPrerequisites: ["distributive-property"],
      },
      lesson(
        "the-opposite-of-an-expression",
        ["The opposite of an expression", "式子的相反式"],
        [
          [
            "The opposite of an expression is the expression that adds to it to give $0$. Write it as $-(\\ldots)$ and remove the parentheses: the opposite of $5x - 2y + 1$ is $-(5x - 2y + 1) = -5x + 2y - 1$.",
            "与一个式子相加得 $0$ 的式子叫做它的相反式。把它写成 $-(\\ldots)$ 再去括号：$5x - 2y + 1$ 的相反式是 $-(5x - 2y + 1) = -5x + 2y - 1$。",
          ],
          [
            "Put in $x = 2$, $y = 3$: $5x - 2y + 1 = 5$ and $-5x + 2y - 1 = -5$, which add to $0$.",
            "代入 $x = 2$，$y = 3$：$5x - 2y + 1 = 5$，$-5x + 2y - 1 = -5$，两者相加得 $0$。",
          ],
          [
            "The opposite changes every sign, the constant too: it is not $-5x + 2y + 1$.",
            "相反式要改变每一项的符号，常数项也要变：不是 $-5x + 2y + 1$。",
          ],
        ],
        (rng) => {
          const terms = groupTerms(rng);
          const expr = poly(...terms);
          const negated = scale(-1, terms);
          const answer = poly(...negated);
          const [first, ...rest] = terms as [Term, ...Term[]];
          const [nFirst, ...nRest] = negated as [Term, ...Term[]];
          const asSum = rng.bool();
          const values = trial(terms);
          const value = at(terms, values);
          const given = Object.entries(values)
            .map(([v, n]) => `${v} = ${n}`)
            .join(", ");
          return expressed(
            asSum
              ? [
                  `What expression must be added to $${expr}$ to get $0$? Write it without parentheses.`,
                  `$${expr}$ 加上什么式子得 $0$？写出不含括号的结果。`,
                ]
              : [`Write the opposite of $${expr}$ without parentheses.`, `写出 $${expr}$ 的相反式（不含括号）。`],
            answer,
            [
              [
                ["Write the opposite", "写出相反式"],
                ["The opposite is $-1$ times the expression:", "相反式是 $-1$ 乘这个式子："],
                [`-(${expr})`],
              ],
              [
                ["Change every sign", "每一项都变号"],
                ["Remove the parentheses, changing the sign of each term:", "去括号，每一项都变号："],
                [`-(${expr}) = ${answer}`],
              ],
            ],
            [
              `Put in $${given}$: $${expr}$ becomes $${value.toLatex()}$ and $${answer}$ becomes $${value.neg().toLatex()}$, which add to $0$.`,
              `代入 $${given}$：$${expr}$ 得 $${value.toLatex()}$，$${answer}$ 得 $${value.neg().toLatex()}$，两者相加得 $0$。`,
            ],
            [
              [
                poly(nFirst, ...rest),
                "That changes only the first sign; every term changes sign.",
                "这只改变了第一项的符号；每一项都要变号。",
              ],
              [poly(first, ...nRest), "That leaves the first term unchanged; it changes sign too.", "这是第一项没有变号；它也要变号。"],
              [expr, "That is the expression itself; its opposite has every sign changed.", "这是原式本身；相反式要把每一项都变号。"],
            ],
            { simplified: true },
          );
        },
        areaGridFigure(["-1"], ["5x", "-2y", "1"], [["-5x", "2y", "-1"]]),
      ),
    ],
  ),
  ["What is $-(x - 4)$?", "$-(x - 4)$ 等于什么？"],
  ["$-x + 4$: both terms change sign. Adding, $(x - 4) + (-x + 4) = 0$.", "$-x + 4$：两项都变号。相加，$(x - 4) + (-x + 4) = 0$。"],
  ["remove a minus sign in front of parentheses by changing the sign of every term.", "去掉括号前的负号，把每一项都变号。"],
);

// ---------------------------------------------------------------------------
// Simplifying with the distributive law

/** simplifyingLinearExpressionsUsingTheDistributiveLaw expands groups and combines like terms. */
export const simplifyingLinearExpressionsUsingTheDistributiveLaw = withIntro(
  topic(
    "simplifying-linear-expressions-using-the-distributive-law",
    t("Simplifying Linear Expressions Using the Distributive Law", "用乘法分配律化简一次式"),
    t(
      "To simplify an expression with parentheses, first expand every group with the distributive law, then combine like terms: $2(3x + 4) + 5(x - 1) = 6x + 8 + 5x - 5 = 11x + 3$. Multiplication comes before addition, so in $7 + 2(x + 3)$ only the $2$ multiplies the group: $7 + 2x + 6 = 2x + 13$, not $9(x + 3)$.",
      "化简含括号的式子时，先用乘法分配律展开每一组括号，再合并同类项：$2(3x + 4) + 5(x - 1) = 6x + 8 + 5x - 5 = 11x + 3$。乘法先于加法，所以在 $7 + 2(x + 3)$ 中只有 $2$ 乘括号：$7 + 2x + 6 = 2x + 13$，而不是 $9(x + 3)$。",
    ),
    ["the-distributive-law-with-three-terms", "combining-like-terms"],
    ["7.EE.A.1"],
    [
      {
        ...lesson(
          "two-groups",
          ["Two groups of parentheses", "两组括号"],
          [
            [
              "Each factor multiplies only its own group, and a negative factor changes the sign of each term in its group. Expand each group, then collect the variable terms and the constants: $3(2x - 1) + 4(x + 5) = 6x - 3 + 4x + 20 = 10x + 17$.",
              "每个因数只乘它自己的那组括号；因数是负数时，那组括号里每一项都要变号。分别展开每组括号，再把含变量的项和常数项分别合并：$3(2x - 1) + 4(x + 5) = 6x - 3 + 4x + 20 = 10x + 17$。",
            ],
            [
              "Put in $x = 2$: $3 \\times 3 + 4 \\times 7 = 37$, and $10 \\times 2 + 17 = 37$ too.",
              "代入 $x = 2$：$3 \\times 3 + 4 \\times 7 = 37$，而 $10 \\times 2 + 17$ 也等于 $37$。",
            ],
            [
              "Multiply the constants too: $3(2x - 1)$ is $6x - 3$, not $6x - 1$.",
              "常数项也要乘：$3(2x - 1)$ 是 $6x - 3$，不是 $6x - 1$。",
            ],
          ],
          (rng) => {
            const v = pickVar(rng);
            const a = rng.sign() * rng.int(2, 6);
            const b = rng.nonZero(-5, 5);
            const c = rng.nonZero(-9, 9);
            const d = rng.int(2, 6);
            let e = rng.nonZero(-5, 5);
            while (a * b + d * e === 0) e = rng.nonZero(-5, 5);
            const f = rng.nonZero(-9, 9);
            const expr = `${factor(a, linear(b, c, v))} + ${factor(d, linear(e, f, v))}`;
            const expanded = poly([a * b, v], [a * c, ""], [d * e, v], [d * f, ""]);
            const answer = linear(a * b + d * e, a * c + d * f, v);
            const values = { [v]: 2 };
            const before = Q.of(a * (2 * b + c) + d * (2 * e + f));
            return expressed(
              [`Simplify $${expr}$.`, `化简 $${expr}$。`],
              answer,
              [
                [
                  ["Expand each group", "展开每组括号"],
                  ["Each factor multiplies both terms of its own group:", "每个因数乘它那组括号里的两项："],
                  [`${expr} = ${expanded}`],
                ],
                [
                  ["Combine like terms", "合并同类项"],
                  [`Collect the $${v}$-terms and the constants:`, `把含 $${v}$ 的项和常数项分别合并：`],
                  [`${expanded} = ${answer}`],
                ],
              ],
              substitution(
                expr,
                before,
                answer,
                [
                  [a * b + d * e, v],
                  [a * c + d * f, ""],
                ],
                values,
              ),
              [
                [
                  linear(a * b + d * e, c + f, v),
                  `That multiplies only the $${v}$-terms; each factor multiplies its constant too.`,
                  `这只乘了含 $${v}$ 的项；每个因数也要乘它的常数项。`,
                ],
                [
                  linear(a * b + e, a * c + f, v),
                  `That leaves the second group unmultiplied; $${d}$ multiplies both of its terms.`,
                  `这是第二组没有乘；$${d}$ 要乘它的两项。`,
                ],
                [
                  linear(b + d * e, c + d * f, v),
                  `That leaves the first group unmultiplied; $${a}$ multiplies both of its terms.`,
                  `这是第一组没有乘；$${a}$ 要乘它的两项。`,
                ],
                [
                  linear(a * b + d * e, a * c + f, v),
                  `That multiplies only the $${v}$-term of the second group; $${d}$ multiplies its constant too.`,
                  `这只乘了第二组中含 $${v}$ 的项；$${d}$ 也要乘它的常数项。`,
                ],
              ],
              { simplified: true },
            );
          },
          tapeFigure(
            [
              {
                total: "10x + 17",
                pieces: [
                  { size: 6, text: "6x" },
                  { size: 4, text: "4x" },
                  { size: 3, text: "20", lit: true },
                  { size: 1, text: "-3", dashed: true },
                ],
              },
            ],
            [
              "A bar for 3(2x - 1) + 4(x + 5): the parts 6x and 4x make 10x, and 20 with -3 makes 17.",
              "表示 3(2x - 1) + 4(x + 5) 的长条：6x 和 4x 合成 10x，20 和 -3 合成 17。",
            ],
          ),
        ),
        keyPrerequisites: ["the-distributive-law-with-three-terms", "combining-like-terms"],
      },
      lesson(
        "a-term-before-the-parentheses",
        ["A term before the parentheses", "括号前还有一项"],
        [
          [
            "In $7 + 2(x + 3)$ the $2$ multiplies the group, and the $7$ is added afterward, because multiplication comes before addition. Expand first, then combine: $7 + 2(x + 3) = 7 + 2x + 6 = 2x + 13$.",
            "在 $7 + 2(x + 3)$ 中，$2$ 乘括号，$7$ 是之后再加的，因为乘法先于加法。先展开，再合并：$7 + 2(x + 3) = 7 + 2x + 6 = 2x + 13$。",
          ],
          [
            "Put in $x = 2$: $7 + 2 \\times 5 = 17$, and $2 \\times 2 + 13 = 17$ too.",
            "代入 $x = 2$：$7 + 2 \\times 5 = 17$，而 $2 \\times 2 + 13$ 也等于 $17$。",
          ],
          ["Do not add $7 + 2$ first: $9(x + 3)$ is a different expression.", "不能先算 $7 + 2$：$9(x + 3)$ 是另一个式子。"],
        ],
        (rng) => {
          const v = pickVar(rng);
          const a = rng.int(2, 7);
          const b = rng.int(1, 6);
          const d = rng.nonZero(-9, 9);
          const inner = linear(b, d, v);
          const values = { [v]: 2 };
          const group = Q.of(a * (2 * b + d));
          if (rng.bool(0.6)) {
            const c = rng.int(2, 15);
            const expr = `${c} + ${a}(${inner})`;
            const expanded = poly([c, ""], [a * b, v], [a * d, ""]);
            const answer = linear(a * b, a * d + c, v);
            return expressed(
              [`Simplify $${expr}$.`, `化简 $${expr}$。`],
              answer,
              [
                [["Multiply first", "先算乘法"], [`Only $${a}$ multiplies the group:`, `只有 $${a}$ 乘括号：`], [`${expr} = ${expanded}`]],
                [["Then add", "再算加法"], ["Combine the constants:", "合并常数项："], [`${expanded} = ${answer}`]],
              ],
              substitution(
                expr,
                group.add(Q.of(c)),
                answer,
                [
                  [a * b, v],
                  [a * d + c, ""],
                ],
                values,
              ),
              [
                [
                  linear((c + a) * b, (c + a) * d, v),
                  `That adds $${c} + ${a}$ first; multiplication comes before addition.`,
                  `这是先算了 $${c} + ${a}$；乘法先于加法。`,
                ],
                [
                  linear(a * b, d + c, v),
                  `That multiplies only the $${v}$-term; $${a}$ multiplies the constant too.`,
                  `这只乘了含 $${v}$ 的项；$${a}$ 也要乘常数项。`,
                ],
                [
                  linear(a * b + c, a * d, v),
                  `That adds $${c}$ to the $${v}$-term; it is a constant.`,
                  `这是把 $${c}$ 加到了含 $${v}$ 的项上；它是常数项。`,
                ],
              ],
              { simplified: true },
            );
          }
          let c = rng.nonZero(-9, 9);
          while (c + a * b === 0) c = rng.nonZero(-9, 9);
          const expr = `${poly([c, v])} + ${a}(${inner})`;
          const expanded = poly([c, v], [a * b, v], [a * d, ""]);
          const answer = linear(c + a * b, a * d, v);
          return expressed(
            [`Simplify $${expr}$.`, `化简 $${expr}$。`],
            answer,
            [
              [
                ["Expand the group", "展开括号"],
                [`$${a}$ multiplies both terms of the group:`, `$${a}$ 乘括号里的两项：`],
                [`${expr} = ${expanded}`],
              ],
              [["Combine like terms", "合并同类项"], [`Combine the $${v}$-terms:`, `合并含 $${v}$ 的项：`], [`${expanded} = ${answer}`]],
            ],
            substitution(
              expr,
              group.add(Q.of(2 * c)),
              answer,
              [
                [c + a * b, v],
                [a * d, ""],
              ],
              values,
            ),
            [
              [
                linear(c + a * b, d, v),
                `That multiplies only the $${v}$-term; $${a}$ multiplies the constant too.`,
                `这只乘了含 $${v}$ 的项；$${a}$ 也要乘常数项。`,
              ],
              [linear(c + b, a * d, v), `That leaves the $${v}$-term in the group unmultiplied.`, `这是括号里含 $${v}$ 的项没有乘。`],
            ],
            { simplified: true },
          );
        },
        areaGridFigure(["2"], ["x", "3"], [["2x", "6"]]),
      ),
    ],
  ),
  ["What is $3(x + 1) + 2x$?", "$3(x + 1) + 2x$ 等于什么？"],
  [
    "Expand, then combine: $3x + 3 + 2x = 5x + 3$. For $x = 2$, both give $13$.",
    "先展开再合并：$3x + 3 + 2x = 5x + 3$。当 $x = 2$ 时，两者都得 $13$。",
  ],
  ["simplify expressions by expanding groups and combining like terms.", "展开括号、合并同类项来化简式子。"],
);

/** simplifyingLinearExpressionsWhenAGroupOfTermsIsSubtracted subtracts a group, or a multiple of one. */
export const simplifyingLinearExpressionsWhenAGroupOfTermsIsSubtracted = withIntro(
  topic(
    "simplifying-linear-expressions-when-a-group-of-terms-is-subtracted",
    t("Simplifying Linear Expressions When a Group of Terms Is Subtracted", "化简减去一组项的一次式"),
    t(
      "Subtracting a group means subtracting every term in it, so every sign in the group changes: $(5x + 3) - (2x - 6) = 5x + 3 - 2x + 6 = 3x + 9$. When a number multiplies the subtracted group, distribute the negative number: $4x - 3(x - 2) = 4x - 3x + 6 = x + 6$.",
      "减去一组项就是减去其中的每一项，所以这组项的每个符号都改变：$(5x + 3) - (2x - 6) = 5x + 3 - 2x + 6 = 3x + 9$。被减的一组前面还有因数时，把这个负数分配进去：$4x - 3(x - 2) = 4x - 3x + 6 = x + 6$。",
    ),
    ["simplifying-linear-expressions-using-the-distributive-law", "distributing-the-negative-sign-in-a-linear-expression"],
    ["7.EE.A.1"],
    [
      {
        ...lesson(
          "subtracting-a-group",
          ["Subtracting a group", "减去一组项"],
          [
            [
              "The minus sign in front of the parentheses applies to every term inside. Remove the parentheses by changing each sign, then combine like terms: $(7n - 2) - (3n - 5) = 7n - 2 - 3n + 5 = 4n + 3$.",
              "括号前的减号作用于括号里的每一项。去括号时把每一项都变号，再合并同类项：$(7n - 2) - (3n - 5) = 7n - 2 - 3n + 5 = 4n + 3$。",
            ],
            [
              "Put in $n = 2$: $12 - 1 = 11$, and $4 \\times 2 + 3 = 11$ too.",
              "代入 $n = 2$：$12 - 1 = 11$，而 $4 \\times 2 + 3$ 也等于 $11$。",
            ],
            ["Subtracting $-5$ adds $5$: the constant in the group changes sign too.", "减去 $-5$ 就是加 $5$：括号里的常数项也要变号。"],
          ],
          (rng) => {
            const v = pickVar(rng);
            const a = rng.nonZero(-9, 9);
            const b = rng.nonZero(-12, 12);
            let c = rng.nonZero(-9, 9);
            while (a === c) c = rng.nonZero(-9, 9);
            const d = rng.nonZero(-12, 12);
            const first = rng.bool() ? `(${linear(a, b, v)})` : linear(a, b, v);
            const expr = `${first} - (${linear(c, d, v)})`;
            const expanded = poly([a, v], [b, ""], [-c, v], [-d, ""]);
            const answer = linear(a - c, b - d, v);
            return expressed(
              [`Simplify $${expr}$.`, `化简 $${expr}$。`],
              answer,
              [
                [
                  ["Change every sign", "每一项都变号"],
                  ["Subtracting the group subtracts each of its terms:", "减去这组就是减去它的每一项："],
                  [`${expr} = ${expanded}`],
                ],
                [
                  ["Combine like terms", "合并同类项"],
                  [`Collect the $${v}$-terms and the constants:`, `把含 $${v}$ 的项和常数项分别合并：`],
                  [`${expanded} = ${answer}`],
                ],
              ],
              substitution(
                expr,
                Q.of(2 * a + b - (2 * c + d)),
                answer,
                [
                  [a - c, v],
                  [b - d, ""],
                ],
                { [v]: 2 },
              ),
              [
                [
                  linear(a - c, b + d, v),
                  "That leaves the sign of the constant in the group unchanged; it is subtracted too.",
                  "这是括号里的常数项没有变号；它也要减去。",
                ],
                [linear(a + c, b + d, v), "That adds the group instead of subtracting it.", "这是把这组加上了，应该减去。"],
                [
                  linear(a + c, b - d, v),
                  `That leaves the sign of the $${v}$-term in the group unchanged; it is subtracted too.`,
                  `这是括号里含 $${v}$ 的项没有变号；它也要减去。`,
                ],
              ],
              { simplified: true },
            );
          },
          areaGridFigure(["-1"], ["3n", "-5"], [["-3n", "5"]]),
        ),
        keyPrerequisites: ["distributing-the-negative-sign-in-a-linear-expression"],
      },
      lesson(
        "subtracting-a-multiple-of-a-group",
        ["Subtracting a multiple of a group", "减去一组项的倍数"],
        [
          [
            "In $10 - 3(x + 2)$ the factor is $-3$: it multiplies both terms in the group, and multiplication comes before subtraction. $10 - 3(x + 2) = 10 - 3x - 6 = -3x + 4$.",
            "在 $10 - 3(x + 2)$ 中，因数是 $-3$：它乘括号里的两项，而且乘法先于减法。$10 - 3(x + 2) = 10 - 3x - 6 = -3x + 4$。",
          ],
          [
            "Put in $x = 2$: $10 - 3 \\times 4 = -2$, and $-3 \\times 2 + 4 = -2$ too.",
            "代入 $x = 2$：$10 - 3 \\times 4 = -2$，而 $-3 \\times 2 + 4$ 也等于 $-2$。",
          ],
          [
            "Do not subtract $10 - 3$ first, and give the minus sign to both terms: not $7(x + 2)$, not $10 - 3x + 6$.",
            "不能先算 $10 - 3$，负号也要给两项：不是 $7(x + 2)$，也不是 $10 - 3x + 6$。",
          ],
        ],
        (rng) => {
          const v = pickVar(rng);
          const k = rng.int(2, 6);
          const c = rng.int(1, 6);
          const d = rng.nonZero(-9, 9);
          const b = rng.int(2, 20);
          const group = `${k}(${linear(c, d, v)})`;
          const distributed = `-${group} = ${poly([-k * c, v], [-k * d, ""])}`;
          const distribute: Walk = [
            ["Distribute the negative factor", "分配负因数"],
            [`The factor is $-${k}$; it multiplies both terms:`, `因数是 $-${k}$，它乘两项：`],
            [distributed],
          ];
          const sign: [string, string] = [
            `The sign of the last product is wrong: $-${k}$ times $${d}$ is $${-k * d}$.`,
            `最后一个积的符号错了：$-${k}$ 乘 $${d}$ 得 $${-k * d}$。`,
          ];
          const groupValue = k * (2 * c + d);
          if (rng.bool(0.4)) {
            const expr = `${b} - ${group}`;
            const answer = linear(-k * c, b - k * d, v);
            const expanded = poly([b, ""], [-k * c, v], [-k * d, ""]);
            return expressed(
              [`Simplify $${expr}$.`, `化简 $${expr}$。`],
              answer,
              [distribute, [["Combine", "合并"], ["Combine the constants:", "合并常数项："], [`${expr} = ${expanded} = ${answer}`]]],
              substitution(
                expr,
                Q.of(b - groupValue),
                answer,
                [
                  [-k * c, v],
                  [b - k * d, ""],
                ],
                { [v]: 2 },
              ),
              [
                [
                  linear((b - k) * c, (b - k) * d, v),
                  `That subtracts $${b} - ${k}$ first; multiplication comes before subtraction.`,
                  `这是先算了 $${b} - ${k}$；乘法先于减法。`,
                ],
                [linear(-k * c, b + k * d, v), ...sign],
                [
                  linear(-k * c, b - d, v),
                  `That multiplies only the $${v}$-term; $-${k}$ multiplies the constant too.`,
                  `这只乘了含 $${v}$ 的项；$-${k}$ 也要乘常数项。`,
                ],
              ],
              { simplified: true },
            );
          }
          let a = rng.nonZero(-9, 12);
          while (a === k * c) a = rng.nonZero(-9, 12);
          const bb = rng.nonZero(-12, 12);
          const expr = `${linear(a, bb, v)} - ${group}`;
          const expanded = poly([a, v], [bb, ""], [-k * c, v], [-k * d, ""]);
          const answer = linear(a - k * c, bb - k * d, v);
          return expressed(
            [`Simplify $${expr}$.`, `化简 $${expr}$。`],
            answer,
            [
              distribute,
              [
                ["Combine like terms", "合并同类项"],
                [`Collect the $${v}$-terms and the constants:`, `把含 $${v}$ 的项和常数项分别合并：`],
                [`${expr} = ${expanded} = ${answer}`],
              ],
            ],
            substitution(
              expr,
              Q.of(2 * a + bb - groupValue),
              answer,
              [
                [a - k * c, v],
                [bb - k * d, ""],
              ],
              { [v]: 2 },
            ),
            [
              [linear(a - k * c, bb + k * d, v), ...sign],
              [
                linear(a - k * c, bb - d, v),
                `That multiplies only the $${v}$-term; $-${k}$ multiplies the constant too.`,
                `这只乘了含 $${v}$ 的项；$-${k}$ 也要乘常数项。`,
              ],
              [linear(a + k * c, bb + k * d, v), "That adds the group instead of subtracting it.", "这是把这组加上了，应该减去。"],
            ],
            { simplified: true },
          );
        },
        areaGridFigure(["-3"], ["x", "2"], [["-3x", "-6"]]),
      ),
    ],
  ),
  ["What is $8 - (x + 3)$?", "$8 - (x + 3)$ 等于什么？"],
  [
    "$8 - x - 3 = -x + 5$: both terms of the group are subtracted. For $x = 2$, both give $3$.",
    "$8 - x - 3 = -x + 5$：这组的两项都要减去。当 $x = 2$ 时，两者都得 $3$。",
  ],
  ["subtract a group, or a multiple of a group, by changing the sign of every term in it.", "减去一组项或它的倍数时，把其中每一项都变号。"],
);

/** properFraction draws a fraction p/q in lowest terms that is not an integer, with q from 2 to maxDen. */
function properFraction(rng: Rng, maxDen: number, maxNum = 7): Q {
  const q = rng.int(2, maxDen);
  let p = rng.int(1, maxNum);
  while (p % q === 0 || gcd(p, q) !== 1) p = rng.int(1, maxNum);
  return Q.of(p, q);
}

/** simplifyingLinearExpressionsContainingFractions combines and distributes fractional coefficients. */
export const simplifyingLinearExpressionsContainingFractions = withIntro(
  topic(
    "simplifying-linear-expressions-containing-fractions",
    t("Simplifying Linear Expressions Containing Fractions", "化简含分数的一次式"),
    t(
      "Like terms with fractional coefficients are combined by adding the fractions with a common denominator: $\\frac{1}{2}x + \\frac{1}{3}x = \\frac{3}{6}x + \\frac{2}{6}x = \\frac{5}{6}x$. A fraction outside parentheses multiplies every term inside: $\\frac{2}{3}(6x - 9) = 4x - 6$.",
      "系数是分数的同类项，通分后把分数相加来合并：$\\frac{1}{2}x + \\frac{1}{3}x = \\frac{3}{6}x + \\frac{2}{6}x = \\frac{5}{6}x$。括号外的分数要乘以括号内的每一项：$\\frac{2}{3}(6x - 9) = 4x - 6$。",
    ),
    ["simplifying-linear-expressions-using-the-distributive-law", "operations-with-rational-numbers"],
    ["7.EE.A.1"],
    [
      {
        ...lesson(
          "fractional-coefficients",
          ["Combining terms with fractional coefficients", "合并分数系数的同类项"],
          [
            [
              "Group the like terms and add their coefficients over a common denominator; never add the denominators. $\\frac{3}{4}x + 2 - \\frac{1}{6}x + \\frac{1}{2} = \\left(\\frac{9}{12} - \\frac{2}{12}\\right)x + \\left(\\frac{4}{2} + \\frac{1}{2}\\right) = \\frac{7}{12}x + \\frac{5}{2}$.",
              "把同类项归在一起，通分后把系数相加；分母不能相加。$\\frac{3}{4}x + 2 - \\frac{1}{6}x + \\frac{1}{2} = \\left(\\frac{9}{12} - \\frac{2}{12}\\right)x + \\left(\\frac{4}{2} + \\frac{1}{2}\\right) = \\frac{7}{12}x + \\frac{5}{2}$。",
            ],
            [
              "Put in $x = 12$: $9 + 2 - 2 + \\frac{1}{2} = 9\\frac{1}{2}$, and $7 + \\frac{5}{2} = 9\\frac{1}{2}$ too.",
              "代入 $x = 12$：$9 + 2 - 2 + \\frac{1}{2} = 9\\frac{1}{2}$，而 $7 + \\frac{5}{2}$ 也等于 $9\\frac{1}{2}$。",
            ],
            [
              "Do not add the denominators: $\\frac{3}{4} - \\frac{1}{6}$ is $\\frac{7}{12}$, not $\\frac{2}{10}$.",
              "分母不能相加：$\\frac{3}{4} - \\frac{1}{6}$ 是 $\\frac{7}{12}$，不是 $\\frac{2}{10}$。",
            ],
          ],
          (rng) => {
            const v = pickVar(rng);
            const f1 = properFraction(rng, 6);
            let f2 = properFraction(rng, 6).mul(Q.of(rng.sign()));
            while (f1.add(f2).isZero() || f1.d === f2.d) f2 = properFraction(rng, 6).mul(Q.of(rng.sign()));
            const g1 = Q.of(rng.nonZero(-9, 9));
            const g2 = properFraction(rng, 4, 5).mul(Q.of(rng.sign()));
            const terms: Term[] = rng.bool()
              ? [
                  [f1, v],
                  [g1, ""],
                  [f2, v],
                  [g2, ""],
                ]
              : [
                  [g1, ""],
                  [f1, v],
                  [g2, ""],
                  [f2, v],
                ];
            const expr = poly(...terms);
            const x = f1.add(f2);
            const c = g1.add(g2);
            const answer = linear(x, c, v);
            const naive = (p: Q, q: Q) => Q.of(Number(p.n + q.n), Number(p.d + q.d));
            const lcm = Number(f1.d * f2.d) / gcd(Number(f1.d), Number(f2.d));
            const values = { [v]: lcm };
            return expressed(
              [`Simplify $${expr}$.`, `化简 $${expr}$。`],
              answer,
              [
                [
                  ["The variable terms", "含字母的项"],
                  [`Add the $${v}$-coefficients over a common denominator:`, `通分后把 $${v}$ 的系数相加：`],
                  [`${poly([f1, v], [f2, v])} = ${poly([x, v])}`],
                ],
                [
                  ["The constants", "常数项"],
                  ["Add the constants, then put the two parts together:", "把常数项相加，再把两部分合起来："],
                  [`${poly([g1, ""], [g2, ""])} = ${num(c)}`, `${expr} = ${answer}`],
                ],
              ],
              substitution(
                expr,
                at(terms, values),
                answer,
                [
                  [x, v],
                  [c, ""],
                ],
                values,
              ),
              [
                [
                  linear(naive(f1, f2), c, v),
                  "That adds the numerators and the denominators; add the coefficients over a common denominator.",
                  "这是把分子和分母分别相加了；应该通分后把系数相加。",
                ],
                [
                  linear(x, g1.sub(g2), v),
                  "The constant is wrong: add the two constants with their signs.",
                  "常数项错了：两个常数要带着符号相加。",
                ],
                [
                  linear(f1.sub(f2), c, v),
                  `The $${v}$-coefficient is wrong: add the two coefficients with their signs.`,
                  `$${v}$ 的系数错了：两个系数要带着符号相加。`,
                ],
              ],
              { simplified: true },
            );
          },
          stripsFigure([
            { parts: 12, shaded: 9, text: "3/4" },
            { parts: 12, shaded: 2, text: "1/6" },
            { parts: 12, shaded: 7, text: "7/12" },
          ]),
        ),
        keyPrerequisites: ["operations-with-rational-numbers", "combining-like-terms"],
      },
      {
        ...lesson(
          "distributing-a-fraction",
          ["Distributing a fraction", "分配一个分数"],
          [
            [
              "Multiply the fraction by each term in the parentheses, then combine like terms. Multiplying by $\\frac{3}{4}$ means multiplying by $3$ and dividing by $4$: $\\frac{3}{4}(8x - 2) + x = 6x - \\frac{3}{2} + x = 7x - \\frac{3}{2}$.",
              "用这个分数乘括号里的每一项，再合并同类项。乘 $\\frac{3}{4}$ 就是乘 $3$ 再除以 $4$：$\\frac{3}{4}(8x - 2) + x = 6x - \\frac{3}{2} + x = 7x - \\frac{3}{2}$。",
            ],
            [
              "Put in $x = 2$: $\\frac{3}{4} \\times 14 + 2 = 12\\frac{1}{2}$, and $14 - \\frac{3}{2} = 12\\frac{1}{2}$ too.",
              "代入 $x = 2$：$\\frac{3}{4} \\times 14 + 2 = 12\\frac{1}{2}$，而 $14 - \\frac{3}{2}$ 也等于 $12\\frac{1}{2}$。",
            ],
            [
              "Multiply both terms, the constant too: $\\frac{3}{4}(8x - 2)$ is $6x - \\frac{3}{2}$, not $6x - 2$.",
              "两项都要乘，常数项也要乘：$\\frac{3}{4}(8x - 2)$ 是 $6x - \\frac{3}{2}$，不是 $6x - 2$。",
            ],
          ],
          (rng) => {
            const v = pickVar(rng);
            const f = properFraction(rng, 5, 4).mul(Q.of(rng.bool(0.3) ? -1 : 1));
            const q = Number(f.d);
            const p = Number(f.n);
            const b = q * rng.nonZero(-4, 4);
            const c = rng.bool(0.7) ? q * rng.nonZero(-4, 4) : rng.nonZero(-9, 9);
            let d = rng.nonZero(-6, 6);
            while (f.mul(Q.of(b)).add(Q.of(d)).isZero()) d = rng.nonZero(-6, 6);
            const e = rng.nonZero(-9, 9);
            const fb = f.mul(Q.of(b));
            const fc = f.mul(Q.of(c));
            const lead = `${f.sign() < 0 ? "-" : ""}${f.abs().toLatex()}`;
            const group = `${lead}(${linear(b, c, v)})`;
            const expr = `${group} ${tail([d, v], [e, ""])}`;
            const expanded = poly([fb, v], [fc, ""], [d, v], [e, ""]);
            const answer = linear(fb.add(Q.of(d)), fc.add(Q.of(e)), v);
            const before = f.mul(Q.of(2 * b + c)).add(Q.of(2 * d + e));
            return expressed(
              [`Simplify $${expr}$.`, `化简 $${expr}$。`],
              answer,
              [
                [
                  ["Multiply each term", "逐项相乘"],
                  [`Multiply $${num(f)}$ by both terms in the parentheses:`, `用 $${num(f)}$ 乘括号里的两项：`],
                  [`${group} = ${poly([fb, v], [fc, ""])}`],
                ],
                [
                  ["Combine like terms", "合并同类项"],
                  [`Collect the $${v}$-terms and the constants:`, `把含 $${v}$ 的项和常数项分别合并：`],
                  [`${expr} = ${expanded} = ${answer}`],
                ],
              ],
              substitution(
                expr,
                before,
                answer,
                [
                  [fb.add(Q.of(d)), v],
                  [fc.add(Q.of(e)), ""],
                ],
                { [v]: 2 },
              ),
              [
                [
                  linear(fb.add(Q.of(d)), Q.of(c + e), v),
                  `That multiplies only the $${v}$-term; $${num(f)}$ multiplies the constant too.`,
                  `这只乘了含 $${v}$ 的项；$${num(f)}$ 也要乘常数项。`,
                ],
                [
                  linear(Q.of(p * b + d), Q.of(p * c + e), v),
                  `That multiplies by the numerator only; also divide by $${q}$.`,
                  `这只乘了分子；还要除以 $${q}$。`,
                ],
                [
                  linear(Q.of(b, q).add(Q.of(d)), Q.of(c, q).add(Q.of(e)), v),
                  `That divides by $${q}$ only; also multiply by the numerator.`,
                  `这只除以了 $${q}$；还要乘分子。`,
                ],
              ],
              { simplified: true },
            );
          },
          areaGridFigure(["3/4"], ["8x", "-2"], [["6x", "-3/2"]], [1], [4, 1.5]),
        ),
        keyPrerequisites: ["multiplying-fractions"],
      },
    ],
  ),
  ["What is $\\frac{1}{2}x + \\frac{1}{2}x$?", "$\\frac{1}{2}x + \\frac{1}{2}x$ 等于什么？"],
  [
    "$x$: two halves make one whole, $\\frac{1}{2} + \\frac{1}{2} = 1$. For $x = 4$, $2 + 2 = 4$.",
    "$x$：两个一半合成一个整体，$\\frac{1}{2} + \\frac{1}{2} = 1$。当 $x = 4$ 时，$2 + 2 = 4$。",
  ],
  ["combine terms with fractional coefficients and multiply a fraction into a group.", "合并分数系数的同类项，并把分数乘进括号。"],
);

// ---------------------------------------------------------------------------
// Factoring numerical expressions

/** composites are common factors with a smaller common factor of their own, so that a factor that is not the greatest exists. */
const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20] as const;

/** coprimePair draws two different whole numbers p, q ≥ 2 with no common factor, with p·g and q·g at most 100. */
function coprimePair(rng: Rng, g: number): [number, number] {
  const max = Math.floor(100 / g);
  let p = rng.int(2, max);
  let q = rng.int(2, max);
  while (p === q || gcd(p, q) !== 1) {
    p = rng.int(2, max);
    q = rng.int(2, max);
  }
  return [p, q];
}

/** smallestPrime is the smallest prime factor of n ≥ 2. */
function smallestPrime(n: number): number {
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return p;
  return n;
}

/** factoringNumericalExpressions writes a sum of numbers as their greatest common factor times a sum. */
export const factoringNumericalExpressions = withIntro(
  topic(
    "factoring-numerical-expressions",
    t("Factoring Numerical Expressions", "数的式子的因式分解"),
    t(
      "The distributive law also works backward: a sum of two numbers with a common factor can be written as that factor times a sum. Factoring out the greatest common factor leaves a sum of two numbers with no common factor: $36 + 54 = 18(2 + 3)$. Writing $6(6 + 9)$ is true, but $6$ is not the greatest common factor.",
      "乘法分配律也可以反过来用：两个有公因数的数的和，可以写成这个公因数乘一个和。提出最大公因数后，括号内的两个数没有公因数：$36 + 54 = 18(2 + 3)$。写成 $6(6 + 9)$ 虽然成立，但 $6$ 不是最大公因数。",
    ),
    ["greatest-common-factor", "distributive-property"],
    ["6.NS.B.4"],
    [
      {
        ...lesson(
          "factoring-out-the-gcf",
          ["Factoring out the greatest common factor", "提取最大公因数"],
          [
            [
              "Find the greatest common factor of the two numbers, then divide each number by it to find what goes in the parentheses. For $24 + 40$: the greatest common factor is $8$, $24 \\div 8 = 3$ and $40 \\div 8 = 5$, so $24 + 40 = 8(3 + 5)$.",
              "先求出两个数的最大公因数，再用它分别去除这两个数，得到括号里的数。对于 $24 + 40$：最大公因数是 $8$，$24 \\div 8 = 3$，$40 \\div 8 = 5$，所以 $24 + 40 = 8(3 + 5)$。",
            ],
            [
              "Expand: $8 \\cdot 3 + 8 \\cdot 5 = 24 + 40$, and $3$ and $5$ have no common factor.",
              "展开：$8 \\cdot 3 + 8 \\cdot 5 = 24 + 40$，而且 $3$ 与 $5$ 没有公因数。",
            ],
            [
              "$4(6 + 10)$ is true but not finished: $6$ and $10$ still share the factor $2$.",
              "$4(6 + 10)$ 虽然成立，但没有做完：$6$ 和 $10$ 还有公因数 $2$。",
            ],
          ],
          (rng) => {
            const g = rng.pick(composites);
            const [p, q] = coprimePair(rng, g);
            const [a, b] = [g * p, g * q];
            const s = smallestPrime(g);
            const correct = `${g}(${p} + ${q})`;
            return chosenMath(
              rng,
              [
                `Which shows $${a} + ${b}$ written as the greatest common factor of $${a}$ and $${b}$ times a sum?`,
                `把 $${a} + ${b}$ 写成 $${a}$ 与 $${b}$ 的最大公因数乘一个和，正确的是哪一个？`,
              ],
              correct,
              [
                [
                  `${s}(${a / s} + ${b / s})`,
                  `That is true, but $${s}$ is not the greatest common factor: $${a / s}$ and $${b / s}$ still share a factor.`,
                  `这虽然成立，但 $${s}$ 不是最大公因数：$${a / s}$ 和 $${b / s}$ 还有公因数。`,
                ],
                [
                  `${g}(${p} + ${b})`,
                  `That divides only the first number; divide both by $${g}$.`,
                  `这只除了第一个数；两个数都要除以 $${g}$。`,
                ],
                [
                  `${g}(${a - g} + ${b - g})`,
                  `That subtracts $${g}$ from each number; divide by it instead.`,
                  `这是把每个数减去了 $${g}$；应该除以它。`,
                ],
              ],
              [
                [
                  ["The greatest common factor", "最大公因数"],
                  [`The greatest number that divides both is $${g}$:`, `能同时整除两个数的最大的数是 $${g}$：`],
                  [`${a} = ${g} \\cdot ${p}`, `${b} = ${g} \\cdot ${q}`],
                ],
                [
                  ["Factor it out", "提出公因数"],
                  ["Write the factor outside and the quotients inside:", "把公因数写在外面，商写在括号里："],
                  [`${a} + ${b} = ${correct}`],
                ],
              ],
              [
                `Expand: $${g} \\cdot ${p} + ${g} \\cdot ${q} = ${a} + ${b}$, and $${p}$ and $${q}$ have no common factor.`,
                `展开：$${g} \\cdot ${p} + ${g} \\cdot ${q} = ${a} + ${b}$，而且 $${p}$ 与 $${q}$ 没有公因数。`,
              ],
            );
          },
          areaGridFigure(["8"], ["3", "5"], [["24", "40"]], [1], [3, 5]),
        ),
        keyPrerequisites: ["greatest-common-factor"],
      },
      lesson(
        "finding-the-missing-number",
        ["Finding the missing number", "求缺少的数"],
        [
          [
            "Each number on the left is the factor outside times its partner inside the parentheses. In $42 - 28 = 14(3 - \\square)$, the missing number is $28 \\div 14 = 2$. If the factor outside is missing, as in $45 + 75 = \\square(3 + 5)$, it is $45 \\div 3 = 15$.",
            "左边的每个数都等于括号外的因数乘括号里与它对应的数。在 $42 - 28 = 14(3 - \\square)$ 中，缺少的数是 $28 \\div 14 = 2$。如果缺少的是括号外的因数，例如 $45 + 75 = \\square(3 + 5)$，它是 $45 \\div 3 = 15$。",
          ],
          [
            "Expand: $15 \\cdot 3 = 45$ and $15 \\cdot 5 = 75$, the numbers on the left.",
            "展开：$15 \\cdot 3 = 45$，$15 \\cdot 5 = 75$，正是左边的数。",
          ],
          [
            "Divide, do not subtract: the box in $14(3 - \\square)$ is $28 \\div 14$, not $28 - 14$.",
            "要做除法，不是减法：$14(3 - \\square)$ 中的方框是 $28 \\div 14$，不是 $28 - 14$。",
          ],
        ],
        (rng) => {
          const g = rng.int(2, 15);
          const three = rng.bool(0.3);
          const nums: number[] = [];
          for (;;) {
            const max = Math.floor(100 / g);
            nums.length = 0;
            for (let i = 0; i < (three ? 3 : 2); i++) nums.push(rng.int(1, max));
            const distinct = new Set(nums).size === nums.length;
            if (distinct && nums.reduce((x, y) => gcd(x, y)) === 1) break;
          }
          const sub = !three && rng.bool(0.35);
          if (sub) nums.sort((x, y) => y - x);
          const op = (i: number) => (i === 0 ? "" : sub ? " - " : " + ");
          const outer = nums.map((n, i) => `${op(i)}${g * n}`).join("");
          const hide = rng.int(three ? 0 : -1, nums.length - 1);
          const inner = nums.map((n, i) => `${op(i)}${i === hide ? "\\square" : n}`).join("");
          const eq = `${outer} = ${hide === -1 ? "\\square" : g}(${inner})`;
          const answer = hide === -1 ? g : nums[hide]!;
          const partner = hide === -1 ? nums[0]! : g;
          const shown = hide === -1 ? g * nums[0]! : g * nums[hide]!;
          const expanded = nums.map((n) => `${g} \\cdot ${n} = ${g * n}`);
          return valued(
            [`What number goes in the box? $$${eq}$$`, `方框中应填什么数？$$${eq}$$`],
            answer,
            [
              [
                ["Match a pair", "找对应的一对"],
                [`$${shown}$ on the left is the box times $${partner}$:`, `左边的 $${shown}$ 等于方框乘 $${partner}$：`],
                [`\\square \\times ${partner} = ${shown}`],
              ],
              [
                ["Divide", "相除"],
                [`Divide $${shown}$ by $${partner}$:`, `用 $${shown}$ 除以 $${partner}$：`],
                [`\\square = ${shown} \\div ${partner} = ${answer}`],
              ],
            ],
            [`Expand: $${expanded.join(",\\ ")}$, the numbers on the left.`, `展开：$${expanded.join(",\\ ")}$，正是左边的数。`],
            hide === -1
              ? [
                  [shown - partner, "That subtracts instead of dividing.", "这是做了减法，应该做除法。"],
                  [
                    nums.reduce((x, y) => x * y),
                    "That multiplies the numbers in the parentheses; divide a number on the left by its partner.",
                    "这是把括号里的数相乘了；应该用左边的数除以它对应的数。",
                  ],
                ]
              : [
                  [shown - g, `That subtracts $${g}$; divide by it instead.`, `这是减去了 $${g}$；应该除以它。`],
                  [shown, `That copies the number on the left; divide it by $${g}$.`, `这是照抄了左边的数；还要除以 $${g}$。`],
                  [shown * g, `That multiplies by $${g}$; divide by it instead.`, `这是乘了 $${g}$；应该除以它。`],
                ],
          );
        },
        areaGridFigure(["15"], ["3", "5"], [["45", "75"]], [1], [3, 5]),
      ),
    ],
  ),
  ["Which number divides both $12$ and $18$ the most times?", "能同时整除 $12$ 和 $18$ 的最大的数是几？"],
  [
    "$6$: $12 = 6 \\cdot 2$ and $18 = 6 \\cdot 3$, so $12 + 18 = 6(2 + 3)$; expanding gives $12 + 18$ back.",
    "$6$：$12 = 6 \\cdot 2$，$18 = 6 \\cdot 3$，所以 $12 + 18 = 6(2 + 3)$；展开又回到 $12 + 18$。",
  ],
  ["write a sum of numbers as their greatest common factor times a sum.", "把几个数的和写成最大公因数乘一个和。"],
);

// ---------------------------------------------------------------------------
// Rational expressions

/** inParens writes a value substituted for a variable, in parentheses when it is negative. */
const inParens = (x: number) => (x < 0 ? `(${num(x)})` : num(x));

/** times writes a coefficient times a substituted value: times(3, -2) is "3(-2)", times(-1, 4) is "-4". */
const times = (a: number, x: number) => (a === 1 ? inParens(x) : a === -1 ? `-${inParens(x)}` : `${num(a)}(${num(x)})`);

/** substituted writes a·x + b with x replaced by its value: "3(-2) + 5". */
function substituted(a: number, x: number, b: number): string {
  return b === 0 ? times(a, x) : `${times(a, x)} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`;
}

/** plusTimes continues a sum with k times a substituted value: plusTimes(-4, 5) is "- 4(5)", plusTimes(1, -5) is "+ (-5)". */
const plusTimes = (k: number, y: number) => `${k < 0 ? "-" : "+"} ${times(Math.abs(k), y)}`;

/** fraction writes a LaTeX fraction. */
const fraction = (n: string, d: string) => `\\frac{${n}}{${d}}`;

export const evaluatingRationalExpressions = topic(
  "evaluating-rational-expressions",
  t("Evaluating Rational Expressions", "分式求值"),
  t(
    "A rational expression is a fraction whose numerator and denominator are expressions, such as $\\frac{3x + 4}{x - 2}$. To evaluate it, substitute the value into the numerator and the denominator, evaluate each, then divide: for $x = 5$, $\\frac{3(5) + 4}{5 - 2} = \\frac{19}{3}$. The fraction bar groups the numerator and the denominator, so you cannot cancel single terms across it.",
    "分子和分母都是式子的分数叫做分式，例如 $\\frac{3x + 4}{x - 2}$。求值时，把值分别代入分子和分母，分别算出结果，再相除：当 $x = 5$ 时，$\\frac{3(5) + 4}{5 - 2} = \\frac{19}{3}$。分数线把分子、分母各自看作一个整体，所以不能把分子和分母中的单项约掉。",
  ),
  ["evaluating-expressions", "operations-with-rational-numbers"],
  ["7.EE.B.3", "6.EE.A.2.C"],
  [
    {
      id: "linear-numerator-and-denominator",
      title: t("A linear numerator and denominator", "分子和分母都是一次式"),
      explanation: t(
        "Evaluate the numerator and the denominator separately, then simplify the fraction:\n\n$$x = -3: \\quad \\frac{2x - 4}{x + 5} = \\frac{2(-3) - 4}{(-3) + 5} = \\frac{-10}{2} = -5.$$\n\nIf the quotient is not a whole number, give it as a fraction in lowest terms.",
        "分别计算分子和分母，再化简分数：\n\n$$x = -3: \\quad \\frac{2x - 4}{x + 5} = \\frac{2(-3) - 4}{(-3) + 5} = \\frac{-10}{2} = -5.$$\n\n如果商不是整数，就写成最简分数。",
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        for (;;) {
          const v = pickVar(rng);
          const a = rng.nonZero(-6, 6);
          const b = rng.nonZero(-12, 12);
          const c = rng.bool(0.6) ? 1 : rng.nonZero(-4, 4);
          const d = rng.nonZero(-9, 9);
          const x = rng.nonZero(-8, 8);
          const top = a * x + b;
          const bottom = c * x + d;
          if (bottom === 0 || top === 0) continue;
          if (top % bottom !== 0 && rng.bool(0.6)) continue;
          const expr = fraction(linear(a, b, v), linear(c, d, v));
          const answer = Q.of(top, bottom);
          const flipped = -c * x + d;
          return numberProblem({
            prompt: t(`Evaluate $${expr}$ when $${v} = ${num(x)}$.`, `当 $${v} = ${num(x)}$ 时，求 $${expr}$ 的值。`),
            answer,
            wrong: [...(flipped !== 0 ? [Q.of(-a * x + b, flipped)] : []), Q.of(bottom, top), ...(c + d !== 0 ? [Q.of(a + b, c + d)] : [])],
            solution: t(
              `Substitute $${num(x)}$ for $${v}$ in the numerator and the denominator: ${steps(`${fraction(substituted(a, x, b), substituted(c, x, d))} = ${fraction(num(top), num(bottom))} = ${num(answer)}`)}`,
              `把分子和分母中的 $${v}$ 都换成 $${num(x)}$：${steps(`${fraction(substituted(a, x, b), substituted(c, x, d))} = ${fraction(num(top), num(bottom))} = ${num(answer)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "powers-and-two-variables",
      title: t("Powers and two variables", "乘方与两个变量"),
      explanation: t(
        "Substitute every variable in parentheses before computing; this matters most for squares of negative numbers. For $x = -2$ and $y = 3$:\n\n$$\\frac{x^2 + y}{2x - y} = \\frac{(-2)^2 + 3}{2(-2) - 3} = \\frac{7}{-7} = -1.$$",
        "代入时给每个变量的值加上括号再计算；负数的平方尤其要注意。当 $x = -2$，$y = 3$ 时：\n\n$$\\frac{x^2 + y}{2x - y} = \\frac{(-2)^2 + 3}{2(-2) - 3} = \\frac{7}{-7} = -1.$$",
      ),
      keyPrerequisites: ["powers-of-integers"],
      generate(rng) {
        for (;;) {
          const square = rng.bool(0.6);
          const x = square && rng.bool(0.7) ? -rng.int(1, 5) : rng.nonZero(-5, 5);
          const y = rng.nonZero(-6, 6);
          const a = rng.nonZero(-4, 4);
          const b = rng.nonZero(-4, 4);
          // Numerator x² + a·y or a·x + b·y; denominator x + b·y or x·y.
          const top = square ? x * x + a * y : a * x + b * y;
          const bottom = square ? x + b * y : x * y;
          if (bottom === 0 || top === 0) continue;
          if (top % bottom !== 0 && rng.bool(0.5)) continue;
          const numer = square ? poly([1, "x^2"], [a, "y"]) : poly([a, "x"], [b, "y"]);
          const denom = square ? poly([1, "x"], [b, "y"]) : "xy";
          const expr = fraction(numer, denom);
          const subTop = square ? `${inParens(x)}^2 ${plusTimes(a, y)}` : `${times(a, x)} ${plusTimes(b, y)}`;
          const subBottom = square ? `${inParens(x)} ${plusTimes(b, y)}` : `(${num(x)})(${num(y)})`;
          const answer = Q.of(top, bottom);
          const slip = square ? -x * x + a * y : a * x - b * y;
          const swapped = square ? y * y + a * x : a * y + b * x;
          const swappedBottom = square ? y + b * x : x * y;
          return numberProblem({
            prompt: t(
              `Evaluate $${expr}$ when $x = ${num(x)}$ and $y = ${num(y)}$.`,
              `当 $x = ${num(x)}$，$y = ${num(y)}$ 时，求 $${expr}$ 的值。`,
            ),
            answer,
            wrong: [
              ...(square ? [Q.of(slip, bottom), Q.of(2 * x + a * y, bottom)] : [Q.of(slip, bottom)]),
              ...(swappedBottom !== 0 ? [Q.of(swapped, swappedBottom)] : []),
              Q.of(bottom, top),
            ],
            solution: t(
              `Substitute both values, writing negative values in parentheses: ${steps(`${fraction(subTop, subBottom)} = ${fraction(num(top), num(bottom))} = ${num(answer)}`)}`,
              `代入两个值（负数要加括号）：${steps(`${fraction(subTop, subBottom)} = ${fraction(num(top), num(bottom))} = ${num(answer)}`)}`,
            ),
          });
        }
      },
    },
  ],
);

/** grade7ExpressionTopics lists the 7th grade topics on rewriting linear expressions and evaluating rational expressions. */
export const grade7ExpressionTopics: readonly TopicDef[] = [
  theDistributiveLawWithThreeTerms,
  distributingTheNegativeSignInALinearExpression,
  simplifyingLinearExpressionsUsingTheDistributiveLaw,
  simplifyingLinearExpressionsWhenAGroupOfTermsIsSubtracted,
  simplifyingLinearExpressionsContainingFractions,
  factoringNumericalExpressions,
  evaluatingRationalExpressions,
];
