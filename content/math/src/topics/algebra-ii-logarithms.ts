import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Coefficient, dec, gcd, linear, num, paren, poly, Q, rationalRoot } from "@ga/subject-math";

import { choiceProblem, expressionProblem, type NumberProblem, numberProblem, solutionsProblem, steps } from "../problems.ts";
import { chain, stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** wrapArg writes the argument of a logarithm, in parentheses unless it is a number, a letter, a fraction or a root. */
function wrapArg(x: string): string {
  return /^(\d+(\.\d+)?|[a-z]|\\frac\{\d+\}\{\d+\}|\\sqrt(\[\d\])?\{[^{}]*\})$/.test(x) ? x : `(${x})`;
}

/** logL writes a logarithm to a base: "\log_{2} 8", "\log_{3}(2x + 1)". */
const logL = (b: Coefficient | string, x: string) => `\\log_{${typeof b === "string" ? b : num(b)}} ${wrapArg(x)}`;

/** lnL writes a natural logarithm: "\ln 5", "\ln(x - 4)". */
const lnL = (x: string) => `\\ln ${wrapArg(x)}`;

/** lgL writes a common logarithm: "\log 1000". */
const lgL = (x: string) => `\\log ${wrapArg(x)}`;

/** baseL writes a base for a power, with fractions in parentheses: "2", "\left(\frac{1}{2}\right)". */
const baseL = (b: Coefficient) => (toQ(b).isInteger() && toQ(b).sign() > 0 ? num(b) : `\\left(${num(b)}\\right)`);

/** powL writes b to an exponent given in LaTeX. */
const powL = (b: Coefficient, e: Coefficient | string) => `${baseL(b)}^{${typeof e === "string" ? e : num(e)}}`;

/** coefL writes a coefficient in front of a power or logarithm: "", "-", "3", "\frac{1}{2}". */
function coefL(a: Coefficient): string {
  const v = toQ(a);
  return v.eq(Q.one) ? "" : v.eq(Q.of(-1)) ? "-" : v.toLatex();
}

/** plusK writes "+ k" or "- k" after a term, or nothing for 0. */
const plusK = (k: Coefficient) => {
  const v = toQ(k);
  return v.isZero() ? "" : v.sign() > 0 ? ` + ${v.toLatex()}` : ` - ${v.abs().toLatex()}`;
};

/** qlog is log_b x when it is rational with a small denominator, or undefined. */
function qlog(b: Q, x: Q): Q | undefined {
  if (x.sign() <= 0 || b.sign() <= 0 || b.eq(Q.one)) return undefined;
  for (let d = 1; d <= 6; d++) {
    for (let n = -24; n <= 24; n++) {
      if (gcd(Math.abs(n), d) !== 1 && !(n === 0 && d === 1)) continue;
      if (b.pow(n).eq(x.pow(d))) return Q.of(n, d);
    }
  }
  return undefined;
}

/** rpow is b^c for a rational c when it is rational, or undefined. */
function rpow(b: Q, c: Q): Q | undefined {
  return rationalRoot(b.pow(Number(c.n)), Number(c.d));
}

/** roundTo rounds a number to the given number of decimal places, halves away from zero. */
function roundTo(v: Q, places: number): Q {
  const s = 10n ** BigInt(places);
  const a = v.abs();
  const r = Q.of((2n * a.n * s + a.d) / (2n * a.d), s);
  return v.sign() < 0 ? r.neg() : r;
}

/** approx is x rounded to the given number of decimal places, as an exact rational. */
const approx = (x: number, places = 4) => Q.of(Math.round(x * 10 ** places), 10 ** places);

/**
 * stable tells whether v, computed from rounded values, rounds to the same
 * number as the true value, with the true value well away from a rounding boundary,
 * so that a learner with a calculator gets the same answer.
 */
function stable(v: Q, truth: number, places: number): boolean {
  const scaled = Math.abs(truth) * 10 ** places;
  if (Math.abs(scaled - Math.floor(scaled) - 0.5) < 0.15) return false;
  const exact = Q.of(Math.sign(truth) * Math.round(scaled), 10 ** places);
  return roundTo(v, places).eq(exact);
}

/** lnQ is ln x rounded to four decimal places. */
const lnQ = (x: number) => approx(Math.log(x));

/** prefixed builds a number problem with a prefix such as "\log_{2}" shown before the field. */
function prefixed(p: NumberProblem, prefix: string): Problem {
  const base = numberProblem(p);
  return { ...base, answer: { ...base.answer, input: { kind: "math", prefix } } };
}

/** OneOf describes a multiple-choice problem whose options are shuffled. */
interface OneOf {
  readonly prompt: Text;
  readonly right: Text;
  readonly wrong: readonly Text[];
  readonly solution: Text;
  readonly figure?: Figure;
}

/** oneOf builds a choice problem from the right option and up to three distinct wrong ones, shuffled. */
function oneOf(rng: Rng, p: OneOf): Problem {
  const seen = new Set([p.right.en]);
  const wrong = p.wrong.filter((w) => !seen.has(w.en) && seen.add(w.en)).slice(0, 3);
  const options = [p.right, ...wrong];
  const order = rng.shuffle(options.map((_, i) => i));
  const problem = choiceProblem({
    prompt: p.prompt,
    options: order.map((i) => options[i]!),
    correct: order.indexOf(0),
    solution: p.solution,
  });
  return p.figure ? { ...problem, figure: p.figure } : problem;
}

/** m writes LaTeX as a text that is the same in every locale. */
const m = (latex: string) => same(`$${latex}$`);

/** Step is one step of a solution: its title in English and Chinese, what it does, and the lines it displays. */
type Step = readonly [title: readonly [en: string, zh: string], say: Text, lines?: readonly string[]];

/** walked writes a solution as labelled steps (one step goes unlabelled) followed by a check, in each locale. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(([[en, zh], say, lines = []], i) => {
        const head = parts.length > 1 ? `${stepLabel(i + 1, en, zh)[locale]} ` : "";
        return `${head}${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`;
      })
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** rootL writes the n-th root of a LaTeX radicand: "\sqrt{9}", "\sqrt[3]{8}". */
const rootL = (n: number, x: string) => `\\sqrt${n === 2 ? "" : `[${n}]`}{${x}}`;

/** powerValue works out a rational power b^c with a rational value, as a chain: "3^{4} = 3 \cdot 3 \cdot 3 \cdot 3 = 81", "4^{-2} = \frac{1}{4^{2}} = \frac{1}{16}". */
function powerValue(b: Q, c: Q): string {
  const x = rpow(b, c);
  if (!x) throw new Error("powerValue needs a rational power");
  const head = powL(b, c);
  if (!c.isInteger()) {
    const p = Number(c.d);
    const q = Number(c.n);
    const r = rpow(b, Q.of(1, p));
    if (!r) throw new Error("powerValue needs a rational root");
    const root = rootL(p, num(b));
    return q === 1 ? `${head} = ${root} = ${num(x)}` : `${head} = \\left(${root}\\right)^{${q}} = ${powL(r, q)} = ${num(x)}`;
  }
  const n = Number(c.n);
  if (n === 0 || n === 1) return `${head} = ${num(x)}`;
  if (n < 0) {
    if (!b.isInteger()) return `${head} = ${powValueOf(Q.one.div(b), -n)}`;
    return n === -1 ? `${head} = ${num(x)}` : `${head} = \\frac{1}{${powL(b, -n)}} = ${num(x)}`;
  }
  return `${head} = ${powValueOf(b, n)}`;
}

/** powValueOf writes a positive whole power b^n as a product when it is short: "3^{2} = 3 \cdot 3 = 9", else "2^{7} = 128". */
function powValueOf(b: Q, n: number): string {
  const x = b.pow(n);
  if (n === 1) return num(x);
  const product = b.isInteger() && n <= 5 ? ` = ${Array(n).fill(num(b)).join(" \\cdot ")}` : "";
  return `${powL(b, n)}${product} = ${num(x)}`;
}

/** sayPower tells how a power with exponent c is worked out. */
function sayPower(c: Q): Text {
  if (!c.isInteger())
    return c.sign() < 0
      ? t("A fractional exponent is a root, and its minus sign gives a reciprocal:", "分数指数表示开方，负号表示取倒数：")
      : t("A fractional exponent is a root:", "分数指数表示开方：");
  if (c.sign() < 0) return t("A negative exponent gives a reciprocal:", "负指数表示取倒数：");
  if (c.isZero()) return t("Any nonzero number to the power $0$ is $1$:", "任何非零数的 $0$ 次幂都是 $1$：");
  if (c.eq(Q.one)) return t("A number to the first power is itself:", "一个数的一次幂就是它本身：");
  return t("Multiply out the power:", "把幂乘出来：");
}

/** PowerOf is a power b^c = x of a rational base with a rational result. */
interface PowerOf {
  readonly b: Q;
  readonly c: Q;
  readonly x: Q;
}

/** integerPower draws b^c = x with an integer base from 2 to 10 and a small integer exponent, x at most 1000 in size. */
function integerPower(rng: Rng, cMin: number, cMax: number): PowerOf {
  for (;;) {
    const b = rng.int(2, 10);
    const c = rng.int(cMin, cMax);
    const x = Q.of(b).pow(c);
    if (x.n > 1000n || x.d > 1000n) continue;
    return { b: Q.of(b), c: Q.of(c), x };
  }
}

/** rootFamilies are bases written as powers of a common root: 4 = 2², 8 = 2³, 9 = 3², 27 = 3³, 25 = 5². */
const rootFamilies = [
  { r: 2, top: 4 },
  { r: 3, top: 3 },
  { r: 5, top: 2 },
  { r: 6, top: 2 },
  { r: 7, top: 2 },
];

/** fractionalPower draws b = r^p and x = r^q with log_b x = q/p not an integer. */
function fractionalPower(rng: Rng): PowerOf & { r: number; p: number; q: number } {
  for (;;) {
    const { r, top } = rng.pick(rootFamilies);
    const p = rng.int(2, top);
    const q = rng.int(-top, top + 1);
    if (q === 0 || q % p === 0) continue;
    const b = Q.of(r).pow(p);
    const x = Q.of(r).pow(q);
    if (x.n > 2000n || x.d > 2000n) continue;
    return { b, c: Q.of(q, p), x, r, p, q };
  }
}

/** isolate is the step that solves a·u + d = v for a quantity u written in LaTeX, such as "\log x", with a ≠ 1 or d ≠ 0. */
function isolate(
  a: number,
  d: number,
  v: number,
  u: string,
  title: readonly [en: string, zh: string] = ["Isolate the logarithm", "把对数单独留在一边"],
): Step {
  const en: string[] = [];
  const zh: string[] = [];
  const au = a === 1 ? u : `${coefL(a)}${/^\d/.test(u) ? " \\cdot " : ""}${u}`;
  const lines = [`${au}${plusK(d)} = ${v}`];
  if (d !== 0) {
    en.push(d > 0 ? `subtract $${d}$ from both sides` : `add $${-d}$ to both sides`);
    zh.push(d > 0 ? `两边同时减去 $${d}$` : `两边同时加上 $${-d}$`);
    lines.push(`${au} = ${v - d}`);
  }
  if (a !== 1) {
    en.push(`divide both sides by $${a}$`);
    zh.push(`两边同时除以 $${a}$`);
    lines.push(`${u} = ${(v - d) / a}`);
  }
  return [title, t(`Treat $${u}$ as one quantity and ${en.join(", then ")}:`, `把 $${u}$ 看作一个整体，${zh.join("，再")}：`), lines];
}

/** rootNames names the n-th roots for n from 2 to 4 in English and Chinese. */
const rootNames: Record<number, readonly [string, string]> = { 2: ["square", "平方"], 3: ["cube", "立方"], 4: ["fourth", "四次方"] };

/** undoBase is the step that solves b^c = x for a positive base b, for a whole, negative or unit-fraction exponent c. */
function undoBase(c: Q, x: Q, b: number): Step {
  if (!c.isInteger()) {
    const n = Number(c.d);
    return [
      ["Raise both sides to a power", "两边同时乘方"],
      t(`Raise both sides to the power $${n}$, which undoes the exponent $${num(c)}$:`, `两边同时 $${n}$ 次方，消去指数 $${num(c)}$：`),
      [`b = ${num(x)}^{${n}} = ${b}`],
    ];
  }
  const n = Math.abs(Number(c.n));
  const [en, zh] = rootNames[n] ?? [`${n}th`, `${n} 次方`];
  if (c.sign() > 0) {
    return [
      ["Take the root", "开方"],
      t(
        `Take the ${en} root of both sides. A base is positive, so only the positive root counts:`,
        `两边开${zh}。底数是正数，所以只取正根：`,
      ),
      [`b = ${rootL(n, num(x))} = ${b}`],
    ];
  }
  const flipped = Q.one.div(x);
  return n === 1
    ? [
        ["Flip both sides", "两边取倒数"],
        t(
          `A negative exponent is a reciprocal: $b^{-1} = \\frac{1}{b}$. So flip both sides:`,
          `负指数表示倒数：$b^{-1} = \\frac{1}{b}$。所以两边取倒数：`,
        ),
        [`b = ${num(flipped)}`],
      ]
    : [
        ["Flip both sides, then take the root", "两边取倒数，再开方"],
        t(
          `A negative exponent is a reciprocal: $b^{${-n}} = \\frac{1}{b^{${n}}}$. So flip both sides, then take the ${en} root, keeping the positive root:`,
          `负指数表示倒数：$b^{${-n}} = \\frac{1}{b^{${n}}}$。所以两边取倒数，再开${zh}，只取正根：`,
        ),
        [`b^{${n}} = ${num(flipped)}`, `b = ${rootL(n, num(flipped))} = ${b}`],
      ];
}

// Introduction to logarithms.

export const convertingBetweenExponentialAndLogarithmicForm: TopicDef = {
  id: "converting-between-exponential-and-logarithmic-form",
  title: t("Converting Between Exponential and Logarithmic Form", "指数式与对数式的互化"),
  summary: t(
    "Read $\\log_{b} x = c$ as $b^{c} = x$, convert between the two forms, and find a missing argument or base.",
    "把 $\\log_{b} x = c$ 读作 $b^{c} = x$，在两种形式之间互化，并求未知的真数或底数。",
  ),
  prerequisites: ["exponential-functions", "writing-radicals-using-fractional-exponents"],
  encompasses: [{ topic: "zero-and-negative-exponents", weight: 0.2 }],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.5", "CCSS.HSF.LE.A.4"],
  intro: t(
    `An exponential function takes an exponent and gives a power: $5^{3} = 125$. Often the question runs the other way. We know the base $5$ and the result $125$, and want the exponent that connects them. A **logarithm** is the name for that exponent: $\\log_{5} 125$ is the power of $5$ that gives $125$, so

$$\\log_{5} 125 = 3 \\quad \\text{because} \\quad 5^{3} = 125.$$

The two equations hold the same three numbers in different places, so each can be rewritten as the other. That rewriting also answers related questions: the number whose logarithm to base $5$ is $3$ is $5^{3} = 125$, and the base that turns $125$ into an exponent of $3$ is $\\sqrt[3]{125} = 5$.

In this lesson we convert between the two forms, then use the conversion to find a missing argument or a missing base.`,
    `指数函数由指数得到幂：$5^{3} = 125$。很多时候问题是反过来的：已知底数 $5$ 和结果 $125$，求连接它们的指数。**对数**就是这个指数的名字：$\\log_{5} 125$ 是 $5$ 的几次幂等于 $125$ 的那个指数，所以

$$\\log_{5} 125 = 3 \\quad \\text{因为} \\quad 5^{3} = 125$$

两个等式含有同样的三个数，只是位置不同，所以可以互相改写。这种改写还能回答相关的问题：以 $5$ 为底、对数是 $3$ 的数是 $5^{3} = 125$；把 $125$ 变成指数 $3$ 的底数是 $\\sqrt[3]{125} = 5$。

这节课我们在两种形式之间互化，再用互化求未知的真数或底数。`,
  ),
  knowledgePoints: [
    {
      id: "exponential-to-logarithmic-form",
      title: t("From exponential to logarithmic form", "指数式化为对数式"),
      explanation: t(
        `A **logarithm** is an exponent. For a base $b > 0$ with $b \\ne 1$ and a number $x > 0$,

$$\\log_{b} x = c \\quad \\text{means} \\quad b^{c} = x.$$

Read $\\log_{b} x$ as "the exponent that turns $b$ into $x$". Both equations state the same fact about the same three numbers, so converting only moves each number to its new place: the base stays the base (the small subscript), the exponent becomes the value of the logarithm, and the result of the power becomes the **argument**, written after $\\log$.

Take $2^{5} = 32$. The base is $2$, the exponent $5$ and the result $32$. So $2$ goes in the subscript, $32$ after the $\\log$, and $5$ on the other side:

$$2^{5} = 32 \\iff \\log_{2} 32 = 5$$

Negative and fractional exponents move the same way: $10^{-2} = \\frac{1}{100}$ becomes $\\log_{10} \\frac{1}{100} = -2$.

> **Watch out.** The exponent never goes inside the logarithm, and the base never goes on the other side: $\\log_{5} 32 = 2$, $\\log_{32} 2 = 5$ and $\\log_{2} 5 = 32$ all mix up the places. Read your answer back as a power to catch this, and keep the sign of a negative exponent.`,
        `**对数**就是指数。对于底数 $b > 0$、$b \\ne 1$ 和正数 $x$，

$$\\log_{b} x = c \\quad \\text{的意思是} \\quad b^{c} = x$$

$\\log_{b} x$ 读作"把 $b$ 变成 $x$ 的那个指数"。两个等式说的是同样三个数之间的同一件事，所以互化只是把每个数放到新的位置：底数仍是底数（写在右下角），指数变成对数的值，乘方的结果变成**真数**，写在 $\\log$ 后面。

看 $2^{5} = 32$。底数是 $2$，指数是 $5$，结果是 $32$。所以 $2$ 写在右下角，$32$ 写在 $\\log$ 后面，$5$ 写在等号另一边：

$$2^{5} = 32 \\iff \\log_{2} 32 = 5$$

负指数和分数指数也一样：$10^{-2} = \\frac{1}{100}$ 写成 $\\log_{10} \\frac{1}{100} = -2$。

> **注意。** 指数不会跑到对数的真数位置，底数也不会跑到等号另一边：$\\log_{5} 32 = 2$、$\\log_{32} 2 = 5$、$\\log_{2} 5 = 32$ 都放错了位置。把答案读回成幂就能发现这类错误；指数是负数时别丢了负号。`,
      ),
      generate(rng) {
        for (;;) {
          const { b, c, x } = rng.bool(0.25) ? fractionalPower(rng) : integerPower(rng, -3, 5);
          if (c.isZero() || c.eq(Q.one)) continue;
          const [B, C, X] = [num(b), num(c), num(x)];
          const right = `${logL(B, X)} = ${C}`;
          const wrong = [`${logL(C, X)} = ${B}`, `${logL(X, B)} = ${C}`, `${logL(B, C)} = ${X}`];
          if (c.sign() < 0) wrong[0] = `${logL(B, X)} = ${num(c.neg())}`;
          if (new Set([right, ...wrong]).size < 4) continue;
          return reasoned(
            oneOf(rng, {
              prompt: t(
                `Which equation is $${powL(b, c)} = ${X}$ written in logarithmic form?`,
                `把 $${powL(b, c)} = ${X}$ 写成对数式，是下面哪个等式？`,
              ),
              right: m(right),
              wrong: wrong.map(m),
              solution: walked(
                [
                  [
                    ["Name the three numbers", "找出三个数"],
                    t(
                      `In $${powL(b, c)} = ${X}$ the base is $${B}$, the exponent is $${C}$ and the result is $${X}$.`,
                      `在 $${powL(b, c)} = ${X}$ 中，底数是 $${B}$，指数是 $${C}$，结果是 $${X}$。`,
                    ),
                  ],
                  [
                    ["Put them in place", "放到对应位置"],
                    t(
                      "The base stays the base, the exponent becomes the value of the logarithm, and the result becomes the argument:",
                      "底数仍是底数，指数变成对数的值，结果变成真数：",
                    ),
                    [right],
                  ],
                ],
                t(
                  `Read $${right}$ back as a power: $${B}$ to the power $${C}$ gives $${X}$, which is $${powL(b, c)} = ${X}$, the equation we started from.`,
                  `把 $${right}$ 读回成幂：$${B}$ 的 $${C}$ 次幂等于 $${X}$，即 $${powL(b, c)} = ${X}$，正是原来的等式。`,
                ),
              ),
            }),
            [
              [
                m(wrong[0]!).en,
                c.sign() < 0
                  ? "This loses the sign of the exponent: the logarithm's value is the exponent, negative here."
                  : "The base and the exponent are swapped: the base of the power stays the base of the logarithm.",
                c.sign() < 0 ? "这里丢了指数的负号：对数的值就是指数，这里是负的。" : "底数和指数弄反了：幂的底数仍是对数的底数。",
              ],
              [
                m(wrong[1]!).en,
                "The base and the argument are swapped: the result of the power goes inside the logarithm.",
                "底数和真数弄反了：幂的结果才是对数的真数。",
              ],
              [
                m(wrong[2]!).en,
                "The exponent and the result are swapped: a logarithm equals an exponent.",
                "指数和结果弄反了：对数的值是指数。",
              ],
            ],
          );
        }
      },
    },
    {
      id: "logarithmic-to-exponential-form",
      title: t("From logarithmic to exponential form", "对数式化为指数式"),
      explanation: t(
        `A logarithm names an exponent, so turning it back into a power says what that exponent does. In $\\log_{b} x = c$, the base $b$ raised to the value $c$ gives the argument $x$:

$$\\log_{b} x = c \\iff b^{c} = x$$

Take $\\log_{6} 36 = 2$. The subscript $6$ is the base of the power, the value $2$ is its exponent, and the argument $36$ is what the power equals: $6^{2} = 36$. Computing $6 \\cdot 6 = 36$ confirms it. A fractional value works the same way: $\\log_{9} 3 = \\frac{1}{2}$ becomes $9^{\\frac{1}{2}} = 3$, and indeed $\\sqrt{9} = 3$.

> **Watch out.** The subscript is the base of the power, not its exponent, and the argument is the result, not the base: $2^{6} = 36$, $36^{2} = 6$ and $6^{36} = 2$ are all wrong. Evaluate the power you wrote; if it does not give the argument, the numbers are in the wrong places.`,
        `对数给指数起了名字，所以把它变回幂，就是说出这个指数的作用。在 $\\log_{b} x = c$ 中，底数 $b$ 的 $c$ 次幂等于真数 $x$：

$$\\log_{b} x = c \\iff b^{c} = x$$

看 $\\log_{6} 36 = 2$。右下角的 $6$ 是幂的底数，值 $2$ 是指数，真数 $36$ 是幂的结果：$6^{2} = 36$。算一下 $6 \\cdot 6 = 36$ 就能确认。对数值是分数时也一样：$\\log_{9} 3 = \\frac{1}{2}$ 写成 $9^{\\frac{1}{2}} = 3$，确实 $\\sqrt{9} = 3$。

> **注意。** 右下角的数是幂的底数，不是指数；真数是结果，不是底数：$2^{6} = 36$、$36^{2} = 6$、$6^{36} = 2$ 都不对。算一算你写出的幂，如果它不等于真数，就是数放错了位置。`,
      ),
      generate(rng) {
        for (;;) {
          const { b, c, x } = rng.bool(0.25) ? fractionalPower(rng) : integerPower(rng, -3, 5);
          if (c.isZero() || c.eq(Q.one) || c.sign() < 0) continue;
          const [B, C, X] = [num(b), num(c), num(x)];
          const right = `${powL(b, c)} = ${X}`;
          const wrong = [`${powL(c, b)} = ${X}`, `${powL(x, c)} = ${B}`, `${powL(b, x)} = ${C}`];
          if (new Set([right, ...wrong]).size < 4) continue;
          return reasoned(
            oneOf(rng, {
              prompt: t(
                `Which equation is $${logL(B, X)} = ${C}$ written in exponential form?`,
                `把 $${logL(B, X)} = ${C}$ 写成指数式，是下面哪个等式？`,
              ),
              right: m(right),
              wrong: wrong.map(m),
              solution: walked(
                [
                  [
                    ["Name the three numbers", "找出三个数"],
                    t(
                      `In $${logL(B, X)} = ${C}$ the base is $${B}$, the value of the logarithm is $${C}$ and the argument is $${X}$.`,
                      `在 $${logL(B, X)} = ${C}$ 中，底数是 $${B}$，对数的值是 $${C}$，真数是 $${X}$。`,
                    ),
                  ],
                  [
                    ["Write the power", "写成幂"],
                    t("The base raised to the value gives the argument:", "底数的这个次幂等于真数："),
                    [right],
                  ],
                ],
                t(`Compute the power: $${powerValue(b, c)}$, the argument.`, `计算这个幂：$${powerValue(b, c)}$，正是真数。`),
              ),
            }),
            [
              [
                m(wrong[0]!).en,
                "The base and the exponent are swapped: the logarithm's base is the base of the power.",
                "底数和指数弄反了：对数的底数就是幂的底数。",
              ],
              [
                m(wrong[1]!).en,
                "The base and the result are swapped: the argument is what the power equals.",
                "底数和结果弄反了：真数才是幂的结果。",
              ],
              [
                m(wrong[2]!).en,
                "The exponent and the result are swapped: the logarithm's value is the exponent.",
                "指数和结果弄反了：对数的值才是指数。",
              ],
            ],
          );
        }
      },
    },
    {
      id: "finding-the-argument",
      title: t("Finding the argument", "求真数"),
      explanation: t(
        `The equation $\\log_{b} x = c$ says that $c$ is the exponent that turns $b$ into $x$. So $x$ is simply that power of $b$: write the equation in exponential form and evaluate the power.

Take $\\log_{3} x = 4$. In exponential form, $x = 3^{4} = 3 \\cdot 3 \\cdot 3 \\cdot 3 = 81$. A negative value works the same way, with the rules of exponents: $\\log_{4} x = -2$ gives $x = 4^{-2} = \\frac{1}{4^{2}} = \\frac{1}{16}$. A fractional value gives a root: $\\log_{25} x = \\frac{1}{2}$ gives $x = 25^{\\frac{1}{2}} = \\sqrt{25} = 5$.

> **Watch out.** $x$ is a power of the base, not the product of the base and the value: $\\log_{3} x = 4$ gives $81$, not $12$. A negative value of the logarithm gives an argument between $0$ and $1$, never a negative argument and never a large one: $4^{-2}$ is $\\frac{1}{16}$, not $-\\frac{1}{16}$ or $16$.`,
        `方程 $\\log_{b} x = c$ 表示 $c$ 是把 $b$ 变成 $x$ 的指数。所以 $x$ 就是 $b$ 的这个幂：把方程写成指数式，再计算幂。

看 $\\log_{3} x = 4$。写成指数式，$x = 3^{4} = 3 \\cdot 3 \\cdot 3 \\cdot 3 = 81$。对数值是负数时，用指数运算法则同样处理：$\\log_{4} x = -2$ 得 $x = 4^{-2} = \\frac{1}{4^{2}} = \\frac{1}{16}$。对数值是分数时得到根式：$\\log_{25} x = \\frac{1}{2}$ 得 $x = 25^{\\frac{1}{2}} = \\sqrt{25} = 5$。

> **注意。** $x$ 是底数的幂，不是底数与对数值的积：$\\log_{3} x = 4$ 的解是 $81$，不是 $12$。对数值为负时，真数在 $0$ 和 $1$ 之间，既不是负数也不是大数：$4^{-2}$ 是 $\\frac{1}{16}$，不是 $-\\frac{1}{16}$，也不是 $16$。`,
      ),
      generate(rng) {
        for (;;) {
          const { b, c, x } = rng.bool(0.2) ? fractionalPower(rng) : integerPower(rng, -3, 4);
          if (c.isZero()) continue;
          const [B, C] = [num(b), num(c)];
          return numberProblem({
            prompt: t(`Solve $${logL(B, "x")} = ${C}$.`, `解方程 $${logL(B, "x")} = ${C}$。`),
            answer: x,
            solveFor: "x",
            wrong: [
              b.mul(c),
              ...(c.isInteger() && c.sign() > 0 ? [c.pow(Number(b.n))] : []),
              x.neg(),
              ...(c.sign() < 0 ? [b.pow(-Number(c.n))] : []),
            ],
            solution: walked(
              [
                [
                  ["Write the exponential form", "写成指数式"],
                  t(
                    `$${logL(B, "x")} = ${C}$ says that $${C}$ is the exponent that turns $${B}$ into $x$:`,
                    `$${logL(B, "x")} = ${C}$ 表示 $${C}$ 是把 $${B}$ 变成 $x$ 的指数：`,
                  ),
                  [`x = ${powL(b, c)}`],
                ],
                [["Evaluate the power", "计算幂"], sayPower(c), [powerValue(b, c)]],
              ],
              t(
                `$${logL(B, num(x))}$ asks which power of $${B}$ gives $${num(x)}$, and Step 2 shows it is the power $${C}$. So $${logL(B, num(x))} = ${C}$, and the argument $${num(x)}$ is positive, as it must be.`,
                `$${logL(B, num(x))}$ 问的是 $${B}$ 的几次幂等于 $${num(x)}$，第二步表明是 $${C}$ 次幂。所以 $${logL(B, num(x))} = ${C}$，而且真数 $${num(x)}$ 是正数，符合要求。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "finding-the-base",
      title: t("Finding the base", "求底数"),
      explanation: t(
        `In $\\log_{b} x = c$ the unknown can be the base. Exponential form gives $b^{c} = x$: the base is raised to a known power, and a power is undone by the matching root. A base must be positive and not $1$, so only the positive root counts.

Take $\\log_{b} 125 = 3$. Then $b^{3} = 125$, and the cube root gives $b = \\sqrt[3]{125} = 5$. For a negative value, flip both sides first: $b^{-2} = \\frac{1}{36}$ means $\\frac{1}{b^{2}} = \\frac{1}{36}$, so $b^{2} = 36$ and $b = 6$. For a fractional value, raise both sides to the reciprocal power: $b^{\\frac{1}{3}} = 4$ gives $b = 4^{3} = 64$.

> **Watch out.** Undo a power with a root, not by dividing or multiplying: $b^{3} = 125$ gives $5$, not $\\frac{125}{3}$ or $375$. And a negative number is never a base, even when $(-6)^{2} = 36$.`,
        `在 $\\log_{b} x = c$ 中，未知数也可以是底数。写成指数式得 $b^{c} = x$：底数的已知次幂，而乘方要用对应的开方来消去。底数必须是正数且不等于 $1$，所以只取正根。

看 $\\log_{b} 125 = 3$。于是 $b^{3} = 125$，开立方得 $b = \\sqrt[3]{125} = 5$。对数值是负数时，先把两边取倒数：$b^{-2} = \\frac{1}{36}$ 即 $\\frac{1}{b^{2}} = \\frac{1}{36}$，所以 $b^{2} = 36$，$b = 6$。对数值是分数时，两边同时乘方，次数取倒数：$b^{\\frac{1}{3}} = 4$ 得 $b = 4^{3} = 64$。

> **注意。** 乘方要用开方消去，不能用除法或乘法：$b^{3} = 125$ 得 $5$，不是 $\\frac{125}{3}$，也不是 $375$。负数永远不能作底数，即使 $(-6)^{2} = 36$。`,
      ),
      generate(rng) {
        for (;;) {
          const c = rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(-1), Q.of(-2), Q.of(-3), Q.of(1, 2), Q.of(1, 3)]);
          const b = c.isInteger() ? rng.int(2, 9) : rng.int(2, c.d === 2n ? 9 : 5) ** Number(c.d);
          const x = rpow(Q.of(b), c);
          if (!x || x.n > 1000n || x.d > 1000n) continue;
          const C = num(c);
          return numberProblem({
            prompt: t(`Solve $${logL("b", num(x))} = ${C}$ for the base $b$.`, `解方程 $${logL("b", num(x))} = ${C}$，求底数 $b$。`),
            answer: b,
            solveFor: "b",
            wrong: [x.div(c), x.mul(c), ...(c.isInteger() ? [x.pow(Number(c.n))] : []), Q.of(b).neg()],
            solution: walked(
              [
                [
                  ["Write the exponential form", "写成指数式"],
                  t(
                    `$${logL("b", num(x))} = ${C}$ says that $b$ raised to the power $${C}$ gives $${num(x)}$:`,
                    `$${logL("b", num(x))} = ${C}$ 表示 $b$ 的 $${C}$ 次幂等于 $${num(x)}$：`,
                  ),
                  [`b^{${C}} = ${num(x)}`],
                ],
                undoBase(c, x, b),
              ],
              t(
                `Put $b = ${b}$ back: $${powerValue(Q.of(b), c)}$, so $${logL(b, num(x))} = ${C}$.`,
                `把 $b = ${b}$ 代回：$${powerValue(Q.of(b), c)}$，所以 $${logL(b, num(x))} = ${C}$。`,
              ),
            ),
          });
        }
      },
    },
  ],
  diagnostic: "finding-the-argument",
};

/** logValueProblem asks for the value of a logarithm written in LaTeX. */
function logValueProblem(expr: string, answer: Q, wrong: readonly Coefficient[], solution: Text): Problem {
  return numberProblem({
    prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
    answer,
    wrong,
    solution,
  });
}

export const evaluatingLogarithms: TopicDef = {
  id: "evaluating-logarithms",
  title: t("Evaluating Logarithms", "求对数的值"),
  summary: t(
    "Evaluate logarithms such as $\\log_{2} 32$, $\\log_{3} \\frac{1}{9}$ and $\\log_{4} 8$ by writing the argument as a power of the base.",
    "把真数写成底数的幂，求 $\\log_{2} 32$、$\\log_{3} \\frac{1}{9}$、$\\log_{4} 8$ 这样的对数的值。",
  ),
  prerequisites: ["converting-between-exponential-and-logarithmic-form", "solving-exponential-equations-with-fractional-solutions"],
  encompasses: [
    { topic: "converting-between-exponential-and-logarithmic-form", weight: 0.5 },
    { topic: "solving-exponential-equations-with-fractional-solutions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.5"],
  intro: t(
    `A logarithm is an exponent, so evaluating one means finding an exponent. For $\\log_{2} 16$ we need the power of $2$ that gives $16$. Keep doubling from $2$: $2, 4, 8, 16$. That took four factors of $2$, so $16 = 2^{4}$ and

$$\\log_{2} 16 = 4.$$

Checking is the same conversion run backwards: $\\log_{2} 16 = 4$ says $2^{4} = 16$, and indeed $2 \\cdot 2 \\cdot 2 \\cdot 2 = 16$.

Not every argument is a whole power of the base. Arguments below $1$ need negative exponents, and arguments that fall between two whole powers need fractional ones: $\\log_{4} 2 = \\frac{1}{2}$, since $4^{\\frac{1}{2}} = \\sqrt{4} = 2$. In this lesson we evaluate all three kinds by writing the argument as a power of the base.`,
    `对数就是指数，所以求对数的值就是求一个指数。求 $\\log_{2} 16$，要找 $2$ 的几次幂等于 $16$。从 $2$ 开始不断乘 $2$：$2, 4, 8, 16$。一共用了四个因数 $2$，所以 $16 = 2^{4}$，

$$\\log_{2} 16 = 4$$

检验就是反过来互化：$\\log_{2} 16 = 4$ 表示 $2^{4} = 16$，而 $2 \\cdot 2 \\cdot 2 \\cdot 2 = 16$ 确实成立。

并不是每个真数都是底数的整数次幂。小于 $1$ 的真数需要负指数，落在两个整数次幂之间的真数需要分数指数：$\\log_{4} 2 = \\frac{1}{2}$，因为 $4^{\\frac{1}{2}} = \\sqrt{4} = 2$。这节课我们通过把真数写成底数的幂，求这三类对数的值。`,
  ),
  knowledgePoints: [
    {
      id: "whole-number-logarithms",
      title: t("Whole-number logarithms", "整数值的对数"),
      explanation: t(
        `To evaluate $\\log_{b} x$, ask which power of $b$ equals $x$. The definition answers it: if $x = b^{c}$, then $\\log_{b} x = \\log_{b} b^{c} = c$, because the logarithm to base $b$ undoes raising $b$ to a power. So the work is writing the argument as a power of the base, multiplying the base by itself until the argument appears.

Take $\\log_{4} 64$. Multiply fours: $4 \\cdot 4 = 16$ and $16 \\cdot 4 = 64$, three fours in all. So $64 = 4^{3}$ and

$$\\log_{4} 64 = \\log_{4} 4^{3} = 3.$$

Two values hold for every base: $\\log_{b} 1 = 0$, because $b^{0} = 1$, and $\\log_{b} b = 1$, because $b^{1} = b$.

> **Watch out.** The answer is the number of factors, not the result of dividing once: $\\log_{4} 64$ is $3$, not $\\frac{64}{4} = 16$. Count the factors carefully, since one too many or one too few is an easy slip, and remember that $\\log_{b} 1$ is $0$, not $1$.`,
        `求 $\\log_{b} x$ 时，问：$b$ 的几次幂等于 $x$？定义给出了答案：如果 $x = b^{c}$，那么 $\\log_{b} x = \\log_{b} b^{c} = c$，因为以 $b$ 为底的对数抵消了 $b$ 的乘方。所以要做的就是把真数写成底数的幂：把底数一个个乘起来，直到得到真数。

看 $\\log_{4} 64$。连乘 $4$：$4 \\cdot 4 = 16$，$16 \\cdot 4 = 64$，一共三个 $4$。所以 $64 = 4^{3}$，

$$\\log_{4} 64 = \\log_{4} 4^{3} = 3$$

对任何底数都有两个值：$\\log_{b} 1 = 0$，因为 $b^{0} = 1$；$\\log_{b} b = 1$，因为 $b^{1} = b$。

> **注意。** 答案是因数的个数，不是除一次的结果：$\\log_{4} 64$ 是 $3$，不是 $\\frac{64}{4} = 16$。数因数时要仔细，多数一个或少数一个都很容易发生；还要记住 $\\log_{b} 1$ 是 $0$，不是 $1$。`,
      ),
      generate(rng) {
        const { b, c, x } = integerPower(rng, rng.bool(0.15) ? 0 : 1, 6);
        return logValueProblem(
          logL(b, num(x)),
          c,
          [x.div(b), c.add(Q.one), c.sub(Q.one), ...(c.isZero() ? [Q.one] : [])],
          walked(
            [
              [
                ["Write the argument as a power of the base", "把真数写成底数的幂"],
                c.isZero()
                  ? t(`Any base to the power $0$ is $1$:`, `任何底数的 $0$ 次幂都是 $1$：`)
                  : c.eq(Q.one)
                    ? t(`Every number is its own first power:`, `每个数都是它自己的一次幂：`)
                    : t(`Ask which power of $${num(b)}$ gives $${num(x)}$:`, `问：$${num(b)}$ 的几次幂等于 $${num(x)}$？`),
                [
                  c.isZero() || c.eq(Q.one)
                    ? `${num(x)} = ${powL(b, c)}`
                    : `${num(x)} = ${Array(Number(c.n)).fill(num(b)).join(" \\cdot ")} = ${powL(b, c)}`,
                ],
              ],
              [
                ["Read off the exponent", "读出指数"],
                t("The logarithm undoes the power of its own base and leaves the exponent:", "对数抵消同底数的乘方，剩下指数："),
                [`${logL(b, num(x))} = \\log_{${num(b)}} ${powL(b, c)} = ${num(c)}`],
              ],
            ],
            t(
              `Convert back: $${logL(b, num(x))} = ${num(c)}$ means $${powerValue(b, c)}$, the argument.`,
              `反过来互化：$${logL(b, num(x))} = ${num(c)}$ 表示 $${powerValue(b, c)}$，正是真数。`,
            ),
          ),
        );
      },
    },
    {
      id: "logarithms-of-fractions",
      title: t("Logarithms of fractions", "分数的对数"),
      explanation: t(
        `A fraction such as $\\frac{1}{8}$ is a power with a negative exponent: $\\frac{1}{8} = \\frac{1}{2^{3}} = 2^{-3}$. Since the logarithm reads off the exponent, the logarithm of a number between $0$ and $1$ is negative:

$$\\log_{2} \\frac{1}{8} = \\log_{2} 2^{-3} = -3$$

The base can be a fraction too. Then a whole-number argument needs a negative exponent, because flipping the base flips the power: $\\left(\\frac{1}{3}\\right)^{-2} = 3^{2} = 9$, so $\\log_{\\frac{1}{3}} 9 = -2$.

> **Watch out.** The sign makes the whole difference: $\\log_{2} \\frac{1}{8}$ is $-3$, not $3$, and it is not the reciprocal $\\frac{1}{3}$ or $-\\frac{1}{3}$ either. Check by computing the power: $2^{-3} = \\frac{1}{8}$, while $2^{3} = 8$.`,
        `像 $\\frac{1}{8}$ 这样的分数是负指数幂：$\\frac{1}{8} = \\frac{1}{2^{3}} = 2^{-3}$。对数读出的是指数，所以 $0$ 和 $1$ 之间的数的对数是负数：

$$\\log_{2} \\frac{1}{8} = \\log_{2} 2^{-3} = -3$$

底数也可以是分数。这时真数是整数就需要负指数，因为把底数取倒数，幂也随之取倒数：$\\left(\\frac{1}{3}\\right)^{-2} = 3^{2} = 9$，所以 $\\log_{\\frac{1}{3}} 9 = -2$。

> **注意。** 区别全在符号上：$\\log_{2} \\frac{1}{8}$ 是 $-3$，不是 $3$，也不是倒数 $\\frac{1}{3}$ 或 $-\\frac{1}{3}$。算一算幂来检验：$2^{-3} = \\frac{1}{8}$，而 $2^{3} = 8$。`,
      ),
      generate(rng) {
        const { b, c, x } = integerPower(rng, 1, 5);
        if (rng.bool(0.35)) {
          const B = Q.one.div(b);
          return logValueProblem(
            logL(B, num(x)),
            c.neg(),
            [c, Q.one.div(c), x.mul(B)],
            walked(
              [
                [
                  ["Write the argument as a power of the base", "把真数写成底数的幂"],
                  t(
                    `$${num(x)}$ is a power of $${num(b)}$, and $${num(b)}$ is the reciprocal of the base $${num(B)}$, so the exponent changes sign:`,
                    `$${num(x)}$ 是 $${num(b)}$ 的幂，而 $${num(b)}$ 是底数 $${num(B)}$ 的倒数，所以指数要变号：`,
                  ),
                  [`${num(x)} = ${powL(b, c)} = ${powL(B, c.neg())}`],
                ],
                [
                  ["Read off the exponent", "读出指数"],
                  t("The logarithm leaves the exponent:", "对数剩下指数："),
                  [`${logL(B, num(x))} = \\log_{${num(B)}} ${powL(B, c.neg())} = ${num(c.neg())}`],
                ],
              ],
              t(`Compute the power: $${powerValue(B, c.neg())}$, the argument.`, `计算这个幂：$${powerValue(B, c.neg())}$，正是真数。`),
            ),
          );
        }
        const X = Q.one.div(x);
        return logValueProblem(
          logL(b, num(X)),
          c.neg(),
          [c, Q.one.div(c).neg(), X.div(b)],
          walked(
            [
              [
                ["Write the argument as a power of the base", "把真数写成底数的幂"],
                t(
                  `$${num(X)}$ is the reciprocal of $${num(x)}$, a power of $${num(b)}$, and a reciprocal is a negative power:`,
                  `$${num(X)}$ 是 $${num(x)}$ 的倒数，而 $${num(x)}$ 是 $${num(b)}$ 的幂；倒数就是负指数幂：`,
                ),
                [c.eq(Q.one) ? `${num(X)} = ${powL(b, -1)}` : `${num(X)} = \\frac{1}{${powL(b, c)}} = ${powL(b, c.neg())}`],
              ],
              [
                ["Read off the exponent", "读出指数"],
                t("The logarithm leaves the exponent:", "对数剩下指数："),
                [`${logL(b, num(X))} = \\log_{${num(b)}} ${powL(b, c.neg())} = ${num(c.neg())}`],
              ],
            ],
            t(`Compute the power: $${powerValue(b, c.neg())}$, the argument.`, `计算这个幂：$${powerValue(b, c.neg())}$，正是真数。`),
          ),
        );
      },
    },
    {
      id: "fractional-logarithms",
      title: t("Fractional logarithms", "分数值的对数"),
      explanation: t(
        `When the argument is not a whole power of the base, the logarithm is a fraction. Write both numbers as powers of a common root, then compare exponents: equal powers of the same base have equal exponents.

Take $\\log_{4} 8 = c$, so $4^{c} = 8$. Both are powers of $2$: $4 = 2^{2}$ and $8 = 2^{3}$. So $\\left(2^{2}\\right)^{c} = 2^{3}$, that is $2^{2c} = 2^{3}$. Hence $2c = 3$ and $c = \\frac{3}{2}$.

Roots are fractional powers, so they work the same way: $\\sqrt{5} = 5^{\\frac{1}{2}}$ gives $\\log_{5} \\sqrt{5} = \\frac{1}{2}$, and $\\sqrt[3]{4} = \\sqrt[3]{2^{2}} = 2^{\\frac{2}{3}}$ gives $\\log_{2} \\sqrt[3]{4} = \\frac{2}{3}$.

> **Watch out.** Divide in the right order: $2c = 3$ gives $c = \\frac{3}{2}$, the exponent of the argument over the exponent of the base, not $\\frac{2}{3}$. For a root, the index goes in the denominator: $\\log_{5} \\sqrt{5}$ is $\\frac{1}{2}$, not $2$.`,
        `真数不是底数的整数次幂时，对数是分数。把两个数写成同一个数的幂，再比较指数：同底数的幂相等，指数就相等。

看 $\\log_{4} 8 = c$，即 $4^{c} = 8$。两个数都是 $2$ 的幂：$4 = 2^{2}$，$8 = 2^{3}$。所以 $\\left(2^{2}\\right)^{c} = 2^{3}$，即 $2^{2c} = 2^{3}$。于是 $2c = 3$，$c = \\frac{3}{2}$。

根式是分数指数幂，处理方法相同：$\\sqrt{5} = 5^{\\frac{1}{2}}$，所以 $\\log_{5} \\sqrt{5} = \\frac{1}{2}$；$\\sqrt[3]{4} = \\sqrt[3]{2^{2}} = 2^{\\frac{2}{3}}$，所以 $\\log_{2} \\sqrt[3]{4} = \\frac{2}{3}$。

> **注意。** 除的顺序不能反：$2c = 3$ 得 $c = \\frac{3}{2}$，是真数的指数除以底数的指数，不是 $\\frac{2}{3}$。对于根式，根指数在分母上：$\\log_{5} \\sqrt{5}$ 是 $\\frac{1}{2}$，不是 $2$。`,
      ),
      generate(rng) {
        if (rng.bool(0.25)) {
          const b = rng.int(2, 12);
          const n = rng.int(2, 4);
          const k = rng.int(1, n - 1);
          const arg = `\\sqrt${n === 2 ? "" : `[${n}]`}{${k === 1 ? b : `${b}^{${k}}`}}`;
          const answer = Q.of(k, n);
          return logValueProblem(
            logL(b, arg),
            answer,
            [Q.of(n, k), Q.of(n), Q.of(k).add(Q.of(n))],
            walked(
              [
                [
                  ["Write the root as a power", "把根式写成幂"],
                  t(
                    `A root is a fractional power: the index $${n}$ goes in the denominator and the power $${k}$ under the root in the numerator:`,
                    `根式是分数指数幂：根指数 $${n}$ 作分母，根号下的指数 $${k}$ 作分子：`,
                  ),
                  [`${arg} = ${b}^{\\frac{${k}}{${n}}}${gcd(k, n) > 1 ? ` = ${b}^{${num(answer)}}` : ""}`],
                ],
                [
                  ["Read off the exponent", "读出指数"],
                  t("The logarithm leaves the exponent:", "对数剩下指数："),
                  [`${logL(b, arg)} = \\log_{${b}} ${b}^{${num(answer)}} = ${num(answer)}`],
                ],
              ],
              t(
                `Raise both to the power $${n}$ and they agree: $\\left(${b}^{${num(answer)}}\\right)^{${n}} = ${k === 1 ? b : `${b}^{${k}}`}$, and $\\left(${arg}\\right)^{${n}} = ${k === 1 ? b : `${b}^{${k}}`}$.`,
                `两者同时 $${n}$ 次方，结果相同：$\\left(${b}^{${num(answer)}}\\right)^{${n}} = ${k === 1 ? b : `${b}^{${k}}`}$，$\\left(${arg}\\right)^{${n}} = ${k === 1 ? b : `${b}^{${k}}`}$。`,
              ),
            ),
          );
        }
        const { b, c, x, r, p, q } = fractionalPower(rng);
        return logValueProblem(
          logL(b, num(x)),
          c,
          [Q.of(p, q), Q.of(q - p), c.neg()],
          walked(
            [
              [
                [`Write both as powers of $${r}$`, `都写成 $${r}$ 的幂`],
                t(
                  `Call the logarithm $c$, so $${powL(b, "c")} = ${num(x)}$. Both numbers are powers of $${r}$: $${num(b)} = ${r}^{${p}}$ and $${num(x)} = ${powL(r, q)}$. So`,
                  `设这个对数为 $c$，则 $${powL(b, "c")} = ${num(x)}$。两个数都是 $${r}$ 的幂：$${num(b)} = ${r}^{${p}}$，$${num(x)} = ${powL(r, q)}$。所以`,
                ),
                [`\\left(${r}^{${p}}\\right)^{c} = ${powL(r, q)}`, `${r}^{${p}c} = ${powL(r, q)}`],
              ],
              [
                ["Set the exponents equal", "令指数相等"],
                t("Equal powers of the same base have equal exponents:", "同底数的幂相等，指数就相等："),
                [`${p}c = ${q}`, `c = ${num(c)}`],
              ],
            ],
            t(`Compute the power: $${powerValue(b, c)}$, the argument.`, `计算这个幂：$${powerValue(b, c)}$，正是真数。`),
          ),
        );
      },
    },
  ],
};

export const commonLogarithm: TopicDef = {
  id: "common-logarithm",
  title: t("The Common Logarithm", "常用对数"),
  summary: t(
    "Evaluate base-10 logarithms, solve $\\log x = c$, and place $\\log x$ between consecutive integers.",
    "求以 10 为底的对数，解 $\\log x = c$，并判断 $\\log x$ 在哪两个相邻整数之间。",
  ),
  prerequisites: ["evaluating-logarithms", "scientific-notation"],
  encompasses: [{ topic: "evaluating-logarithms", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.LE.A.4"],
  intro: t(
    `Our number system is built on powers of ten, and scientific notation writes every number as a power of ten times a factor. So base $10$ is the most useful base of all, and its logarithm gets its own short name: the **common logarithm**, written $\\log x$ with no base, means $\\log_{10} x$.

For a power of ten it counts places. $100000$ is a $1$ followed by five zeros, so $100000 = 10^{5}$ and $\\log 100000 = 5$. Converting back checks it: $10^{5} = 100000$.

For other numbers it tells the size. $40000$ lies between $10^{4} = 10000$ and $10^{5} = 100000$, so its logarithm lies between $4$ and $5$; a calculator gives $\\log 40000 \\approx 4.60$.

In this lesson we evaluate common logarithms of powers of ten, solve equations such as $\\log x = 3$, and place $\\log x$ between two consecutive integers.`,
    `我们的数系建立在 $10$ 的幂之上，科学记数法也把每个数写成一个因数乘 $10$ 的幂。所以以 $10$ 为底最常用，它的对数有一个简写：**常用对数** $\\log x$ 不写底数，表示 $\\log_{10} x$。

对于 $10$ 的幂，常用对数数的是位数。$100000$ 是 $1$ 后面跟五个 $0$，所以 $100000 = 10^{5}$，$\\log 100000 = 5$。反过来互化就能检验：$10^{5} = 100000$。

对于其他的数，常用对数表示数的大小。$40000$ 在 $10^{4} = 10000$ 和 $10^{5} = 100000$ 之间，所以它的对数在 $4$ 和 $5$ 之间；用计算器算得 $\\log 40000 \\approx 4.60$。

这节课我们求 $10$ 的幂的常用对数，解 $\\log x = 3$ 这样的方程，并判断 $\\log x$ 在哪两个相邻整数之间。`,
  ),
  knowledgePoints: [
    {
      id: "evaluating-common-logarithms",
      title: t("Evaluating common logarithms", "求常用对数的值"),
      explanation: t(
        `The **common logarithm** has base $10$ and is written without a base: $\\log x$ means $\\log_{10} x$. Since we write numbers in powers of ten, the common logarithm of a power of ten can be read from the way the number is written: in $10^{c}$, the exponent counts how many places the digit $1$ has moved from the units place.

Take $\\log 10000$. The $1$ is followed by four zeros, so $10000 = 10^{4}$ and $\\log 10000 = 4$. A decimal moves the other way: in $0.001$ the $1$ is three places after the point, so $0.001 = \\frac{1}{1000} = 10^{-3}$ and $\\log 0.001 = -3$. Roots give fractions: $\\sqrt[3]{10} = 10^{\\frac{1}{3}}$, so $\\log \\sqrt[3]{10} = \\frac{1}{3}$.

> **Watch out.** For a decimal, count the places from the point to the $1$, the $1$ included: $0.001$ has three, so its logarithm is $-3$, not $-2$ (the number of zeros) and not $3$. And a root of $10^{k}$ with index $n$ gives the fraction $\\frac{k}{n}$, not its reciprocal $\\frac{n}{k}$.`,
        `**常用对数**以 $10$ 为底，书写时省略底数：$\\log x$ 表示 $\\log_{10} x$。我们用 $10$ 的幂来写数，所以 $10$ 的幂的常用对数可以从数的写法直接读出：在 $10^{c}$ 中，指数表示数字 $1$ 离开个位移动了几位。

看 $\\log 10000$。$1$ 后面有四个 $0$，所以 $10000 = 10^{4}$，$\\log 10000 = 4$。小数则向另一个方向移动：$0.001$ 中的 $1$ 在小数点后第三位，所以 $0.001 = \\frac{1}{1000} = 10^{-3}$，$\\log 0.001 = -3$。根式得到分数：$\\sqrt[3]{10} = 10^{\\frac{1}{3}}$，所以 $\\log \\sqrt[3]{10} = \\frac{1}{3}$。

> **注意。** 对于小数，从小数点数到 $1$，$1$ 本身也算：$0.001$ 是三位，所以它的对数是 $-3$，不是 $-2$（$0$ 的个数），也不是 $3$。$10^{k}$ 开 $n$ 次方得到的分数是 $\\frac{k}{n}$，不是它的倒数 $\\frac{n}{k}$。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        if (kind === 3) {
          const n = rng.int(2, 5);
          const k = rng.int(1, n - 1);
          const ten = k === 1 ? "10" : `10^{${k}}`;
          const arg = rng.bool()
            ? `\\sqrt${n === 2 ? "" : `[${n}]`}{${k === 1 ? "10" : String(10 ** k)}}`
            : `\\sqrt${n === 2 ? "" : `[${n}]`}{${ten}}`;
          const answer = Q.of(k, n);
          return logValueProblem(
            lgL(arg),
            answer,
            [Q.of(n, k), Q.of(10 ** k, n)],
            walked(
              [
                [
                  ["Write the root as a power of $10$", "把根式写成 $10$ 的幂"],
                  t(
                    `A root is a fractional power: the index $${n}$ goes in the denominator, the power of $10$ under the root in the numerator:`,
                    `根式是分数指数幂：根指数 $${n}$ 作分母，根号下 $10$ 的指数作分子：`,
                  ),
                  [chain(arg, rootL(n, ten), `10^{\\frac{${k}}{${n}}}`, `10^{${num(answer)}}`)],
                ],
                [
                  ["Read off the exponent", "读出指数"],
                  t("The common logarithm leaves the exponent:", "常用对数剩下指数："),
                  [`${lgL(arg)} = \\log 10^{${num(answer)}} = ${num(answer)}`],
                ],
              ],
              t(
                `Raise $10^{${num(answer)}}$ to the power $${n}$: $\\left(10^{${num(answer)}}\\right)^{${n}} = ${ten}$, the number under the root. So $10^{${num(answer)}} = ${arg}$.`,
                `把 $10^{${num(answer)}}$ 乘 $${n}$ 次方：$\\left(10^{${num(answer)}}\\right)^{${n}} = ${ten}$，正是根号下的数。所以 $10^{${num(answer)}} = ${arg}$。`,
              ),
            ),
          );
        }
        const c = kind === 0 ? rng.int(1, 7) : -rng.int(1, 5);
        const x = Q.of(10).pow(c);
        const shown = kind === 2 ? num(x) : dec(x);
        return logValueProblem(
          lgL(shown),
          Q.of(c),
          [c > 0 ? c + 1 : c - 1, -c, c > 0 ? x.div(Q.of(10)) : c + 1],
          walked(
            [
              [
                ["Write the argument as a power of $10$", "把真数写成 $10$ 的幂"],
                c > 0
                  ? t(`The $1$ is followed by ${c === 1 ? "one zero" : `$${c}$ zeros`}:`, `$1$ 后面有 $${c}$ 个 $0$：`)
                  : kind === 1
                    ? t(
                        `The $1$ is ${c === -1 ? "one place" : `$${-c}$ places`} after the decimal point, so the number is $1$ divided by $${-c}$ factor${c === -1 ? "" : "s"} of $10$:`,
                        `$1$ 在小数点后第 $${-c}$ 位，所以这个数是 $1$ 除以 $${-c}$ 个 $10$：`,
                      )
                    : t(
                        `The denominator is a power of $10$, and a reciprocal is a negative power:`,
                        `分母是 $10$ 的幂，而倒数就是负指数幂：`,
                      ),
                [
                  c > 0
                    ? `${shown} = 10^{${c}}`
                    : kind === 1
                      ? `${shown} = ${num(x)} = 10^{${c}}`
                      : `${shown} = \\frac{1}{10^{${-c}}} = 10^{${c}}`,
                ],
              ],
              [
                ["Read off the exponent", "读出指数"],
                t("The common logarithm leaves the exponent:", "常用对数剩下指数："),
                [`${lgL(shown)} = \\log 10^{${c}} = ${c}`],
              ],
            ],
            t(
              `Convert back: $${lgL(shown)} = ${c}$ means $10^{${c}} = ${shown}$, the argument.`,
              `反过来互化：$${lgL(shown)} = ${c}$ 表示 $10^{${c}} = ${shown}$，正是真数。`,
            ),
          ),
        );
      },
    },
    {
      id: "solving-common-logarithm-equations",
      title: t("Solving $\\log x = c$", "解 $\\log x = c$"),
      explanation: t(
        `An equation such as $2\\log x + 5 = 11$ has the unknown inside a logarithm. Treat $\\log x$ as a single quantity and isolate it with the usual inverse operations: here $2\\log x = 6$, so $\\log x = 3$. Then use the meaning of the logarithm: $\\log x = 3$ says $10^{3} = x$, so $x = 1000$.

The value can be negative or zero too: $\\log x = -2$ gives $x = 10^{-2} = \\frac{1}{100}$, and $\\log x = 0$ gives $x = 10^{0} = 1$.

> **Watch out.** Isolate $\\log x$ completely before converting: from $2\\log x + 5 = 11$ the solution is $10^{3}$, not $10^{11}$. And $\\log x = 3$ means $x = 10^{3}$, not $x = 10 \\cdot 3 = 30$, not $10^{4}$, and not $x = 3$.`,
        `像 $2\\log x + 5 = 11$ 这样的方程，未知数在对数里面。把 $\\log x$ 看作一个整体，用常规的逆运算把它单独留在一边：这里 $2\\log x = 6$，所以 $\\log x = 3$。再用对数的意义：$\\log x = 3$ 表示 $10^{3} = x$，所以 $x = 1000$。

对数值也可以是负数或零：$\\log x = -2$ 得 $x = 10^{-2} = \\frac{1}{100}$，$\\log x = 0$ 得 $x = 10^{0} = 1$。

> **注意。** 先把 $\\log x$ 完全单独留在一边，再互化：由 $2\\log x + 5 = 11$ 得到的解是 $10^{3}$，不是 $10^{11}$。$\\log x = 3$ 表示 $x = 10^{3}$，不是 $x = 10 \\cdot 3 = 30$，不是 $10^{4}$，也不是 $x = 3$。`,
      ),
      generate(rng) {
        const c = rng.int(-3, 5);
        const a = rng.pick([1, 1, 2, 3, 4, 5]);
        const d = rng.int(-9, 9);
        const rhs = a * c + d;
        const lhs = `${coefL(a)}\\log x${plusK(d)}`;
        const x = Q.of(10).pow(c);
        return numberProblem({
          prompt: t(`Solve $${lhs} = ${rhs}$.`, `解方程 $${lhs} = ${rhs}$。`),
          answer: x,
          solveFor: "x",
          wrong: [Q.of(10 * c), Q.of(10).pow(c + 1), ...(rhs !== c ? [Q.of(10).pow(rhs)] : []), Q.of(c)],
          solution: walked(
            [
              ...(a !== 1 || d !== 0 ? [isolate(a, d, rhs, "\\log x")] : []),
              [
                ["Write the exponential form", "写成指数式"],
                t(`$\\log x = ${c}$ means $10^{${c}} = x$:`, `$\\log x = ${c}$ 表示 $10^{${c}} = x$：`),
                [`x = 10^{${c}} = ${num(x)}`],
              ],
            ],
            a === 1 && d === 0
              ? t(
                  `$10^{${c}} = ${num(x)}$, so $${lgL(num(x))} = ${c}$, as the equation requires.`,
                  `$10^{${c}} = ${num(x)}$，所以 $${lgL(num(x))} = ${c}$，符合方程。`,
                )
              : t(
                  `Since $${lgL(num(x))} = ${c}$, the left side is $${a === 1 ? c : `${a} \\cdot ${paren(c)}`}${plusK(d)} = ${rhs}$, the right side.`,
                  `因为 $${lgL(num(x))} = ${c}$，左边等于 $${a === 1 ? c : `${a} \\cdot ${paren(c)}`}${plusK(d)} = ${rhs}$，正是右边。`,
                ),
          ),
        });
      },
    },
    {
      id: "estimating-common-logarithms",
      title: t("Estimating common logarithms", "估计常用对数"),
      explanation: t(
        `The common logarithm increases: a larger argument has a larger logarithm. So if a number lies between two consecutive powers of ten, its logarithm lies between their exponents.

Take $\\log 4600$. Since $1000 < 4600 < 10000$, that is $10^{3} < 4600 < 10^{4}$, we get $3 < \\log 4600 < 4$. For a number between $0$ and $1$ the powers have negative exponents: $0.01 < 0.07 < 0.1$ means $10^{-2} < 0.07 < 10^{-1}$, so $-2 < \\log 0.07 < -1$.

> **Watch out.** $n$ is the exponent of the lower power of ten, not the number of digits: $4600$ has four digits, but $n = 3$. Below $1$ the lower power is the more negative one: for $0.07$, $n$ is $-2$, not $-1$, and not $2$.`,
        `常用对数是增函数：真数越大，对数越大。所以一个数在两个相邻的 $10$ 的幂之间时，它的对数就在这两个指数之间。

看 $\\log 4600$。因为 $1000 < 4600 < 10000$，即 $10^{3} < 4600 < 10^{4}$，所以 $3 < \\log 4600 < 4$。对于 $0$ 和 $1$ 之间的数，这两个幂的指数是负数：$0.01 < 0.07 < 0.1$ 即 $10^{-2} < 0.07 < 10^{-1}$，所以 $-2 < \\log 0.07 < -1$。

> **注意。** $n$ 是较小的那个 $10$ 的幂的指数，不是数的位数：$4600$ 是四位数，但 $n = 3$。小于 $1$ 时，较小的幂是指数更负的那个：对于 $0.07$，$n$ 是 $-2$，不是 $-1$，也不是 $2$。`,
      ),
      generate(rng) {
        const n = rng.int(-3, 4);
        const mantissa = rng.int(2, 9) * 10 + rng.pick([0, 0, 5]);
        const x = Q.of(mantissa, 10).mul(Q.of(10).pow(n));
        const shown = dec(x);
        const digits = shown.replace(/\..*/, "").replace("-", "").length;
        return numberProblem({
          prompt: t(
            `The number $${lgL(shown)}$ lies between two consecutive integers $n$ and $n + 1$. What is $n$?`,
            `$${lgL(shown)}$ 在两个相邻整数 $n$ 与 $n + 1$ 之间。$n$ 是多少？`,
          ),
          answer: n,
          solveFor: "n",
          wrong: [n + 1, digits, -n],
          solution: walked(
            [
              [
                ["Find the powers of ten around it", "找出两边的 $10$ 的幂"],
                t(`$${shown}$ lies between consecutive powers of ten:`, `$${shown}$ 在相邻的两个 $10$ 的幂之间：`),
                [`${dec(Q.of(10).pow(n))} < ${shown} < ${dec(Q.of(10).pow(n + 1))}`, `10^{${n}} < ${shown} < 10^{${n + 1}}`],
              ],
              [
                ["Take common logarithms", "取常用对数"],
                t(
                  `The common logarithm increases, so it keeps the order, and the logarithm of each power of ten is its exponent. So $n = ${n}$:`,
                  `常用对数是增函数，不改变不等号的方向，而每个 $10$ 的幂的对数就是它的指数。所以 $n = ${n}$：`,
                ),
                [`${n} < ${lgL(shown)} < ${n + 1}`],
              ],
            ],
            t(
              `A calculator gives $${lgL(shown)} \\approx ${dec(approx(Math.log10(Number(x.n) / Number(x.d)), 2))}$, which is indeed between $${n}$ and $${n + 1}$.`,
              `用计算器算得 $${lgL(shown)} \\approx ${dec(approx(Math.log10(Number(x.n) / Number(x.d)), 2))}$，确实在 $${n}$ 和 $${n + 1}$ 之间。`,
            ),
          ),
        });
      },
    },
  ],
};

export const naturalLogarithm: TopicDef = {
  id: "natural-logarithm",
  title: t("The Natural Logarithm", "自然对数"),
  summary: t(
    "Meet the number $e$, evaluate natural logarithms of powers of $e$, and solve $\\ln x = c$ exactly.",
    "认识数 $e$，求 $e$ 的幂的自然对数，并精确地解 $\\ln x = c$。",
  ),
  prerequisites: ["evaluating-logarithms"],
  encompasses: [{ topic: "evaluating-logarithms", weight: 0.3 }],
  xp: 13,
  standards: ["CCSS.HSF.LE.A.4"],
  intro: t(
    `Besides $10$, one other base appears everywhere in mathematics and science: the number $e \\approx 2.71828$. It comes from growth. If $1$ dollar earns $100\\%$ interest a year, paid in $n$ equal parts, it grows to $\\left(1 + \\frac{1}{n}\\right)^{n}$ dollars, and as $n$ grows this approaches $e$: $n = 1$ gives $2$, $n = 12$ gives about $2.613$, and $n = 1000$ gives about $2.717$.

The logarithm to base $e$ is the **natural logarithm**, written $\\ln$. It follows the same rules as every logarithm. For example $e^{2} \\approx 7.389$, so

$$\\ln 7.389 \\approx 2, \\qquad \\ln e^{2} = 2 \\text{ exactly}.$$

In this lesson we evaluate natural logarithms of powers of $e$, solve $\\ln x = c$ exactly, and use the fact that $e^{x}$ and $\\ln x$ undo each other.`,
    `除了 $10$，还有一个底数在数学和科学中随处可见：数 $e \\approx 2.71828$。它来自增长。如果 $1$ 元钱按年利率 $100\\%$ 计息，一年分 $n$ 次等额计息，它会变成 $\\left(1 + \\frac{1}{n}\\right)^{n}$ 元；$n$ 越大，这个值越接近 $e$：$n = 1$ 得 $2$，$n = 12$ 约得 $2.613$，$n = 1000$ 约得 $2.717$。

以 $e$ 为底的对数叫做**自然对数**，记作 $\\ln$。它遵循所有对数共有的规则。例如 $e^{2} \\approx 7.389$，所以

$$\\ln 7.389 \\approx 2, \\qquad \\ln e^{2} = 2 \\text{（精确值）}$$

这节课我们求 $e$ 的幂的自然对数，精确地解 $\\ln x = c$，并利用 $e^{x}$ 与 $\\ln x$ 互相抵消的性质。`,
  ),
  knowledgePoints: [
    {
      id: "logarithms-of-powers-of-e",
      title: t("Natural logarithms of powers of $e$", "$e$ 的幂的自然对数"),
      explanation: t(
        `The number $e \\approx 2.71828$ is the value that $\\left(1 + \\frac{1}{n}\\right)^{n}$ approaches as $n$ grows; like $\\pi$, it is irrational. The **natural logarithm** is the logarithm with base $e$, written $\\ln$: $\\ln x = \\log_{e} x$. It obeys the rule of every logarithm, $\\ln e^{u} = u$, so to evaluate one, use the rules of exponents to write the argument as a single power of $e$, then read off the exponent.

Take $\\ln \\frac{1}{e^{5}}$. A reciprocal is a negative power, so $\\frac{1}{e^{5}} = e^{-5}$ and $\\ln \\frac{1}{e^{5}} = -5$. A root is a fractional power: $\\sqrt[3]{e^{2}} = e^{\\frac{2}{3}}$, so $\\ln \\sqrt[3]{e^{2}} = \\frac{2}{3}$. A product of powers adds the exponents: $e^{4} \\cdot e^{-1} = e^{3}$, so its natural logarithm is $3$. And $\\ln 1 = 0$, since $e^{0} = 1$.

> **Watch out.** Keep the sign and the shape of the exponent: $\\ln \\frac{1}{e^{5}}$ is $-5$, not $5$ and not $\\frac{1}{5}$. For a product of powers add the exponents; do not multiply them, and do not add an extra $1$ for the base.`,
        `数 $e \\approx 2.71828$ 是 $n$ 越来越大时 $\\left(1 + \\frac{1}{n}\\right)^{n}$ 趋近的值，它和 $\\pi$ 一样是无理数。以 $e$ 为底的对数叫做**自然对数**，记作 $\\ln$：$\\ln x = \\log_{e} x$。它遵循所有对数的规则 $\\ln e^{u} = u$，所以求值时先用指数运算法则把真数写成 $e$ 的一个幂，再读出指数。

看 $\\ln \\frac{1}{e^{5}}$。倒数就是负指数幂，所以 $\\frac{1}{e^{5}} = e^{-5}$，$\\ln \\frac{1}{e^{5}} = -5$。根式是分数指数幂：$\\sqrt[3]{e^{2}} = e^{\\frac{2}{3}}$，所以 $\\ln \\sqrt[3]{e^{2}} = \\frac{2}{3}$。同底数幂相乘，指数相加：$e^{4} \\cdot e^{-1} = e^{3}$，所以它的自然对数是 $3$。还有 $\\ln 1 = 0$，因为 $e^{0} = 1$。

> **注意。** 指数的符号和形式都要保留：$\\ln \\frac{1}{e^{5}}$ 是 $-5$，不是 $5$，也不是 $\\frac{1}{5}$。同底数幂相乘时指数相加，不要相乘，也不要为底数多加一个 $1$。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        let arg: string;
        let answer: Q;
        let how: Text;
        let back: Text;
        let work: string[] = [];
        if (kind === 0) {
          answer = Q.of(rng.int(2, 12));
          arg = `e^{${num(answer)}}`;
          how = t("The argument is already a power of $e$.", "真数已经是 $e$ 的幂。");
          back = how;
        } else if (kind === 1) {
          answer = Q.of(-rng.int(1, 9));
          arg = answer.eq(Q.of(-1)) ? "\\frac{1}{e}" : `\\frac{1}{e^{${num(answer.neg())}}}`;
          how = t("A reciprocal is a negative power:", "倒数就是负指数幂：");
          work = [`${arg} = e^{${num(answer)}}`];
          back = t(`since a negative exponent means a reciprocal`, `因为负指数表示倒数`);
        } else if (kind === 2) {
          const n = rng.int(2, 5);
          const k = rng.pick([1, 1, 2, 3, 5, 7].filter((j) => gcd(n, j) === 1));
          answer = Q.of(k, n);
          arg = `\\sqrt${n === 2 ? "" : `[${n}]`}{${k === 1 ? "e" : `e^{${k}}`}}`;
          work = [`${arg} = e^{${num(answer)}}`];
          how = t(
            `A root is a fractional power: the index $${n}$ goes in the denominator and the power $${k}$ under the root in the numerator:`,
            `根式是分数指数幂：根指数 $${n}$ 作分母，根号下的指数 $${k}$ 作分子：`,
          );
          back = t(
            `since $\\left(e^{${num(answer)}}\\right)^{${n}} = ${k === 1 ? "e" : `e^{${k}}`}$, the number under the root`,
            `因为 $\\left(e^{${num(answer)}}\\right)^{${n}} = ${k === 1 ? "e" : `e^{${k}}`}$，正是根号下的数`,
          );
        } else {
          const p = rng.int(2, 6);
          const q = rng.nonZero(-5, 5);
          answer = Q.of(p + q);
          arg = `e^{${p}} \\cdot e^{${q}}`;
          how = t("Multiplying powers of the same base adds the exponents:", "同底数幂相乘，指数相加：");
          work = [`${arg} = e^{${p} + ${paren(q)}} = e^{${num(answer)}}`];
          back =
            q > 0
              ? t(
                  `since $e^{${p}} \\cdot e^{${q}}$ is $${p}$ factors of $e$ times $${q}$ more, $${p + q}$ in all`,
                  `因为 $e^{${p}} \\cdot e^{${q}}$ 是 $${p}$ 个 $e$ 再乘 $${q}$ 个 $e$，一共 $${p + q}$ 个`,
                )
              : t(
                  `since $e^{${q}} = \\frac{1}{${q === -1 ? "e" : `e^{${-q}}`}}$, and dividing $e^{${p}}$ by $${q === -1 ? "e" : `e^{${-q}}`}$ subtracts the exponents: $${p} - ${-q} = ${p + q}$`,
                  `因为 $e^{${q}} = \\frac{1}{${q === -1 ? "e" : `e^{${-q}}`}}$，而 $e^{${p}}$ 除以 $${q === -1 ? "e" : `e^{${-q}}`}$ 时指数相减：$${p} - ${-q} = ${p + q}$`,
                );
        }
        const A = num(answer);
        return logValueProblem(
          lnL(arg),
          answer,
          [answer.neg(), Q.one.div(answer.isZero() ? Q.one : answer), answer.add(Q.one)],
          walked(
            [
              ...(kind === 0 ? [] : ([[["Write the argument as a power of $e$", "把真数写成 $e$ 的幂"], how, work]] as Step[])),
              [
                ["Read off the exponent", "读出指数"],
                t(
                  "$\\ln$ is the logarithm to base $e$, so it undoes the power and leaves the exponent:",
                  "$\\ln$ 是以 $e$ 为底的对数，它抵消乘方，剩下指数：",
                ),
                [`${lnL(arg)} = \\ln e^{${A}} = ${A}`],
              ],
            ],
            kind === 0
              ? t(
                  `$${arg}$ is $${A}$ factors of $e$, so $${A}$ is the power of $e$ that gives it. A calculator agrees: $${arg} \\approx ${dec(approx(Math.exp(Number(answer.n)), 1))}$ and $\\ln ${dec(approx(Math.exp(Number(answer.n)), 1))} \\approx ${A}$.`,
                  `$${arg}$ 是 $${A}$ 个 $e$ 相乘，所以 $e$ 的 $${A}$ 次幂得到它。用计算器验证：$${arg} \\approx ${dec(approx(Math.exp(Number(answer.n)), 1))}$，而 $\\ln ${dec(approx(Math.exp(Number(answer.n)), 1))} \\approx ${A}$。`,
                )
              : t(
                  `Convert back: $${lnL(arg)} = ${A}$ means $e^{${A}} = ${arg}$, ${back.en}.`,
                  `反过来互化：$${lnL(arg)} = ${A}$ 表示 $e^{${A}} = ${arg}$，${back["zh-CN"]}。`,
                ),
          ),
        );
      },
    },
    {
      id: "solving-natural-logarithm-equations",
      title: t("Solving $\\ln x = c$", "解 $\\ln x = c$"),
      explanation: t(
        `Since $\\ln x = c$ means $e^{c} = x$, the exact solution of an equation in $\\ln x$ is a power of $e$. As with any equation, first treat $\\ln x$ as one quantity and isolate it, then convert to exponential form.

Take $3\\ln x - 4 = 11$. Add $4$ to both sides: $3\\ln x = 15$. Divide by $3$: $\\ln x = 5$. In exponential form, $x = e^{5}$. This is the exact solution; a calculator gives $e^{5} \\approx 148.4$ when a decimal is needed. A negative value is fine too: $\\ln x = -2$ gives $x = e^{-2}$, a positive number less than $1$.

> **Watch out.** Leave the answer as the power $e^{5}$: it is not $5e$, and not $10^{5}$, because the base of $\\ln$ is $e$, not $10$. Isolate $\\ln x$ fully before converting, or you get $e^{11}$ instead of $e^{5}$, and keep the sign of the exponent.`,
        `因为 $\\ln x = c$ 表示 $e^{c} = x$，含 $\\ln x$ 的方程的精确解是 $e$ 的幂。和解任何方程一样，先把 $\\ln x$ 看作一个整体，把它单独留在一边，再写成指数式。

看 $3\\ln x - 4 = 11$。两边同时加上 $4$：$3\\ln x = 15$。两边同时除以 $3$：$\\ln x = 5$。写成指数式，$x = e^{5}$。这就是精确解；需要小数时，用计算器算得 $e^{5} \\approx 148.4$。对数值为负也可以：$\\ln x = -2$ 得 $x = e^{-2}$，是一个小于 $1$ 的正数。

> **注意。** 答案写成幂 $e^{5}$：它不是 $5e$，也不是 $10^{5}$，因为 $\\ln$ 的底数是 $e$，不是 $10$。互化之前先把 $\\ln x$ 完全单独留在一边，否则会得到 $e^{11}$ 而不是 $e^{5}$；指数的符号也不能丢。`,
      ),
      generate(rng) {
        const c = rng.nonZero(-4, 6);
        const a = rng.pick([1, 1, 2, 3, 4]);
        const d = rng.int(-8, 8);
        const lhs = `${coefL(a)}\\ln x${plusK(d)}`;
        const rhs = a * c + d;
        const answer = c === 1 ? "e" : `e^{${c}}`;
        return expressionProblem({
          prompt: t(`Solve $${lhs} = ${rhs}$. Give the exact solution.`, `解方程 $${lhs} = ${rhs}$，给出精确解。`),
          answer,
          prefix: "x =",
          wrong: [`${c}e`, `e^{${rhs}}`, `10^{${c}}`, `e^{${-c}}`],
          solution: walked(
            [
              ...(a !== 1 || d !== 0 ? [isolate(a, d, rhs, "\\ln x")] : []),
              [
                ["Write the exponential form", "写成指数式"],
                t(
                  `$\\ln$ has base $e$, so $\\ln x = ${c}$ means $e^{${c}} = x$. Leave the exact power:`,
                  `$\\ln$ 的底数是 $e$，所以 $\\ln x = ${c}$ 表示 $e^{${c}} = x$。保留精确的幂：`,
                ),
                [`x = ${answer}`],
              ],
            ],
            t(
              `$\\ln ${answer} = ${c}$, so the left side is $${a === 1 ? c : `${a} \\cdot ${paren(c)}`}${plusK(d)} = ${rhs}$, the right side.`,
              `$\\ln ${answer} = ${c}$，所以左边等于 $${a === 1 ? c : `${a} \\cdot ${paren(c)}`}${plusK(d)} = ${rhs}$，正是右边。`,
            ),
          ),
        });
      },
    },
    {
      id: "inverse-properties-of-the-natural-logarithm",
      title: t("$e$ and $\\ln$ undo each other", "$e$ 与 $\\ln$ 互相抵消"),
      explanation: t(
        `The natural logarithm is the inverse of the function $e^{x}$: $\\ln$ asks for the exponent that turns $e$ into a number, and $e^{\\square}$ raises $e$ to an exponent. Doing one and then the other returns where we started:

$$\\ln e^{u} = u \\quad \\text{for every } u, \\qquad e^{\\ln x} = x \\quad \\text{for } x > 0.$$

The first holds because the exponent that turns $e$ into $e^{u}$ is $u$ itself. The second holds because $\\ln x$ is, by definition, the exponent that turns $e$ into $x$. So $3e^{\\ln 5} - 2 = 3 \\cdot 5 - 2 = 13$, and $\\ln e^{4x + 1} - 6 = 4x + 1 - 6 = 4x - 5$.

> **Watch out.** Only the power of $e$ and the logarithm cancel; numbers outside stay: in $3e^{\\ln 5} - 2$ the $3$ multiplies and the $-2$ is subtracted afterwards, giving $13$, not $3 + 5 - 2$ or $15$. In $\\ln e^{4x + 1} - 6$ the result is the plain expression $4x - 5$, with no $e$ left and the $-6$ added to the constant, not to the $x$ term.`,
        `自然对数是函数 $e^{x}$ 的反函数：$\\ln$ 求的是把 $e$ 变成某个数的指数，而 $e^{\\square}$ 是求 $e$ 的乘方。先做一个再做另一个，就回到原处：

$$\\ln e^{u} = u \\quad \\text{（对任意 } u\\text{）}, \\qquad e^{\\ln x} = x \\quad \\text{（} x > 0\\text{）}$$

第一个式子成立，因为把 $e$ 变成 $e^{u}$ 的指数就是 $u$ 本身。第二个式子成立，因为按定义，$\\ln x$ 就是把 $e$ 变成 $x$ 的指数。所以 $3e^{\\ln 5} - 2 = 3 \\cdot 5 - 2 = 13$，$\\ln e^{4x + 1} - 6 = 4x + 1 - 6 = 4x - 5$。

> **注意。** 互相抵消的只有 $e$ 的乘方和对数，外面的数要保留：在 $3e^{\\ln 5} - 2$ 中，$3$ 是乘上去的，$-2$ 是最后减去的，结果是 $13$，不是 $3 + 5 - 2$，也不是 $15$。$\\ln e^{4x + 1} - 6$ 的结果是普通的式子 $4x - 5$，不再有 $e$，而且 $-6$ 要合并到常数项上，不是合并到 $x$ 项上。`,
      ),
      generate(rng) {
        if (rng.bool()) {
          const a = rng.int(2, 9);
          const c = rng.int(-9, 9);
          const n = rng.int(2, 30);
          const expr = `${a}e^{\\ln ${n}}${plusK(c)}`;
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
            answer: a * n + c,
            wrong: [a + n + c, a * n, a * c + n],
            solution: walked(
              [
                [
                  ["Undo the logarithm", "抵消对数"],
                  t(
                    `$\\ln ${n}$ is the exponent that turns $e$ into $${n}$, so raising $e$ to it gives back $${n}$:`,
                    `$\\ln ${n}$ 是把 $e$ 变成 $${n}$ 的指数，所以 $e$ 的这个次幂就是 $${n}$：`,
                  ),
                  [`e^{\\ln ${n}} = ${n}`],
                ],
                [
                  ["Do the arithmetic", "计算"],
                  t("The numbers outside stay: multiply, then add or subtract.", "外面的数保留：先乘，再加减。"),
                  [`${expr} = ${a} \\cdot ${n}${plusK(c)} = ${a * n + c}`],
                ],
              ],
              t(
                `With a calculator, $\\ln ${n} \\approx ${dec(lnQ(n))}$ and $e^{${dec(lnQ(n))}} \\approx ${n}$, so the first step holds.`,
                `用计算器算得 $\\ln ${n} \\approx ${dec(lnQ(n))}$，而 $e^{${dec(lnQ(n))}} \\approx ${n}$，第一步成立。`,
              ),
            ),
          });
        }
        const p = rng.nonZero(-5, 6);
        const q = rng.int(-9, 9);
        const u = linear(p, q);
        const k = rng.int(-6, 6);
        const expr = `\\ln e^{${u}}${plusK(k)}`;
        const answer = linear(p, q + k);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [linear(p, q), `e^{${answer}}`, linear(p + k, q)],
          solution: walked(
            [
              [
                ["Undo the power", "抵消乘方"],
                t("$\\ln$ undoes raising $e$ to a power, whatever the exponent is:", "无论指数是什么，$\\ln$ 都抵消 $e$ 的乘方："),
                [`\\ln e^{${u}} = ${u}`],
              ],
              [
                ["Combine the constants", "合并常数"],
                t("The number outside joins the constant term:", "外面的数合并到常数项上："),
                [chain(expr, `${u}${plusK(k)}`, answer)],
              ],
            ],
            t(
              `Put $x = 1$ into both: the original gives $\\ln e^{${p + q}}${plusK(k)} = ${p + q + k}$, and $${answer}$ gives $${p + q + k}$ too.`,
              `把 $x = 1$ 代入两边：原式得 $\\ln e^{${p + q}}${plusK(k)} = ${p + q + k}$，$${answer}$ 也得 $${p + q + k}$。`,
            ),
          ),
        });
      },
    },
  ],
  diagnostic: "solving-natural-logarithm-equations",
};

/** LogBase is the base of a logarithm: a number, 10 written as "\log", or e written as "\ln". */
interface LogBase {
  /** of writes the logarithm of an argument. */
  readonly of: (x: string) => string;
  /** power writes the base to an exponent. */
  readonly power: (e: string) => string;
  /** name is the base in LaTeX. */
  readonly name: string;
  /** prefix is the logarithm without its argument, shown before an answer field. */
  readonly prefix: string;
}

/** numberBase is a logarithm base written with a subscript. */
const numberBase = (b: number): LogBase => ({
  of: (x) => logL(b, x),
  power: (e) => `${b}^{${e}}`,
  name: String(b),
  prefix: `\\log_{${b}}`,
});
const tenBase: LogBase = { of: lgL, power: (e) => `10^{${e}}`, name: "10", prefix: "\\log" };
const eBase: LogBase = { of: lnL, power: (e) => `e^{${e}}`, name: "e", prefix: "\\ln" };

/** approxLogQ is the logarithm of x to a base, rounded to the given number of decimal places. */
function approxLogQ(base: LogBase, x: number, places = 3): Q {
  const b = base.name === "e" ? Math.E : Number(base.name);
  return approx(Math.log(x) / Math.log(b), places);
}

/** approxLog is the logarithm of x to a base, rounded to the given number of decimal places, in LaTeX. */
const approxLog = (base: LogBase, x: number, places = 3) => dec(approxLogQ(base, x, places));

/** roundedSum writes rounded logarithms of the arguments added up: "0.936 + 0.862 = 1.798", or "0.936 - 0.862 = 0.074" with signs. */
function roundedSum(base: LogBase, args: readonly number[], signs: readonly number[] = args.map(() => 1)): string {
  const parts = args.map((x) => approxLogQ(base, x));
  const total = parts.reduce((acc, v, i) => acc.add(v.mul(Q.of(signs[i] ?? 1))), Q.zero);
  const shown = parts.map((v, i) =>
    i === 0 ? (signs[0]! < 0 ? `-${paren(v)}` : dec(v)) : `${signs[i]! < 0 ? "-" : "+"} ${v.sign() < 0 ? `(${dec(v)})` : dec(v)}`,
  );
  return `${shown.join(" ")} = ${dec(total)}`;
}

/** anyBase draws a base for rules that hold for every base: usually a number, sometimes 10 or e. */
function anyBase(rng: Rng): LogBase {
  const k = rng.int(0, 9);
  return k === 0 ? tenBase : k === 1 ? eBase : numberBase(rng.pick([2, 3, 4, 5, 6, 7, 8, 9]));
}

export const simplifyingLogarithmicExpressions: TopicDef = {
  id: "simplifying-logarithmic-expressions",
  title: t("Simplifying Logarithmic Expressions", "化简对数式"),
  summary: t(
    "Use $\\log_{b} b^{u} = u$ and $b^{\\log_{b} x} = x$ to simplify expressions, and evaluate sums of logarithms.",
    "用 $\\log_{b} b^{u} = u$ 和 $b^{\\log_{b} x} = x$ 化简式子，并计算对数的和差。",
  ),
  prerequisites: ["common-logarithm", "natural-logarithm"],
  encompasses: [
    { topic: "common-logarithm", weight: 0.3 },
    { topic: "natural-logarithm", weight: 0.3 },
    { topic: "evaluating-logarithms", weight: 0.3 },
  ],
  xp: 13,
  standards: ["CCSS.HSF.BF.B.5"],
  intro: t(
    `A logarithm and a power of the same base undo each other, in whichever order they come. Take base $7$. The exponent that turns $7$ into $7^{3}$ is $3$, so $\\log_{7} 7^{3} = 3$. And $\\log_{7} 2$ is the exponent that turns $7$ into $2$, so raising $7$ to it gives $2$: $7^{\\log_{7} 2} = 2$.

We met this for $e$ and $\\ln$; it holds for every base:

$$\\log_{b} b^{u} = u, \\qquad b^{\\log_{b} x} = x \\quad (x > 0).$$

Both rules let us simplify without a calculator. For example $\\log_{7} 7^{3} + 7^{\\log_{7} 2} = 3 + 2 = 5$; check by converting back, $7^{3}$ is indeed the power of $7$ with exponent $3$.

In this lesson we simplify expressions with these two rules and evaluate sums and differences of logarithms with different bases.`,
    `同底数的对数和乘方互相抵消，不论先后顺序。以 $7$ 为底：把 $7$ 变成 $7^{3}$ 的指数是 $3$，所以 $\\log_{7} 7^{3} = 3$。而 $\\log_{7} 2$ 是把 $7$ 变成 $2$ 的指数，所以 $7$ 的这个次幂等于 $2$：$7^{\\log_{7} 2} = 2$。

我们在 $e$ 和 $\\ln$ 中见过这一点；它对每个底数都成立：

$$\\log_{b} b^{u} = u, \\qquad b^{\\log_{b} x} = x \\quad (x > 0)$$

这两条规则让我们不用计算器就能化简。例如 $\\log_{7} 7^{3} + 7^{\\log_{7} 2} = 3 + 2 = 5$；反过来互化来检验：$7^{3}$ 确实是 $7$ 的 $3$ 次幂。

这节课我们用这两条规则化简式子，并计算底数不同的对数的和与差。`,
  ),
  knowledgePoints: [
    {
      id: "logarithm-of-a-power-of-the-base",
      title: t("The logarithm of a power of the base", "底数的幂的对数"),
      explanation: t(
        `A logarithm undoes raising its base to a power:

$$\\log_{b} b^{u} = u$$

because the exponent that turns $b$ into $b^{u}$ is $u$ itself. This holds for every exponent, expressions in $x$ included, and for the common and natural logarithms, whose bases are $10$ and $e$.

Take $\\log_{5} 5^{3x - 2} + 7$. The logarithm and the power cancel and leave the exponent $3x - 2$; the $7$ outside then joins the constant: $3x - 2 + 7 = 3x + 5$. In the same way $\\log 10^{x + 4} = x + 4$ and $\\ln e^{-2x} = -2x$.

> **Watch out.** The cancelling needs matching bases, and it removes the base completely: $\\log_{5} 5^{3x - 2}$ is $3x - 2$, not $5(3x - 2)$. Add the constant outside to the constant term, not to the coefficient of $x$: the answer above is $3x + 5$, not $10x - 2$, and the $7$ must not be dropped.`,
        `对数抵消对其底数的乘方：

$$\\log_{b} b^{u} = u$$

因为把 $b$ 变成 $b^{u}$ 的指数就是 $u$ 本身。这对任何指数都成立，包括含 $x$ 的式子，也适用于底数为 $10$ 和 $e$ 的常用对数与自然对数。

看 $\\log_{5} 5^{3x - 2} + 7$。对数和乘方抵消，剩下指数 $3x - 2$；外面的 $7$ 再合并到常数项上：$3x - 2 + 7 = 3x + 5$。同样，$\\log 10^{x + 4} = x + 4$，$\\ln e^{-2x} = -2x$。

> **注意。** 抵消要求底数相同，而且底数会完全消失：$\\log_{5} 5^{3x - 2}$ 是 $3x - 2$，不是 $5(3x - 2)$。外面的常数要合并到常数项上，不是合并到 $x$ 的系数上：上面的结果是 $3x + 5$，不是 $10x - 2$，也不能把 $7$ 丢掉。`,
      ),
      generate(rng) {
        const base = anyBase(rng);
        const p = rng.nonZero(-5, 6);
        const q = rng.int(-9, 9);
        const k = rng.int(-6, 6);
        const u = linear(p, q);
        const expr = `${base.of(base.power(u))}${plusK(k)}`;
        const answer = linear(p, q + k);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer,
          simplified: true,
          wrong: [u, linear(p + k, q), ...(base.name !== "e" ? [poly([p * Number(base.name), "x"], [q * Number(base.name) + k, ""])] : [])],
          solution: walked(
            [
              [
                ["Cancel the logarithm and the power", "抵消对数和乘方"],
                t("The logarithm has the same base as the power, so it leaves the exponent:", "对数与乘方的底数相同，所以剩下指数："),
                [`${base.of(base.power(u))} = ${u}`],
              ],
              ...(k === 0
                ? []
                : ([
                    [
                      ["Combine the constants", "合并常数"],
                      t("The number outside joins the constant term:", "外面的数合并到常数项上："),
                      [chain(expr, `${u}${plusK(k)}`, answer)],
                    ],
                  ] as Step[])),
            ],
            t(
              `Put $x = 1$ into both: the original is $${base.of(base.power(String(p + q)))}${plusK(k)} = ${p + q + k}$, and $${answer}$ gives $${p + q + k}$ too.`,
              `把 $x = 1$ 代入两边：原式是 $${base.of(base.power(String(p + q)))}${plusK(k)} = ${p + q + k}$，$${answer}$ 也得 $${p + q + k}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "base-raised-to-a-logarithm",
      title: t("The base raised to a logarithm", "底数的对数次幂"),
      explanation: t(
        `Raising the base to a logarithm undoes the logarithm:

$$b^{\\log_{b} x} = x \\quad (x > 0)$$

because $\\log_{b} x$ is, by definition, exactly the exponent that turns $b$ into $x$. Raising $b$ to that exponent therefore produces $x$.

Take $4 \\cdot 3^{\\log_{3} 7} - 5$. The power $3^{\\log_{3} 7}$ is $7$, so the expression is $4 \\cdot 7 - 5 = 23$. The same holds for the other bases: $10^{\\log 6} = 6$ and $e^{\\ln 2} = 2$.

> **Watch out.** The power gives the argument alone, not the base times the argument: $3^{\\log_{3} 7}$ is $7$, not $21$. The numbers outside still act in order: multiply by $4$, then subtract $5$. Adding the $4$ instead gives $6$, and forgetting the $-5$ gives $28$.`,
        `底数的对数次幂抵消对数：

$$b^{\\log_{b} x} = x \\quad (x > 0)$$

因为按定义，$\\log_{b} x$ 正是把 $b$ 变成 $x$ 的那个指数，所以 $b$ 的这个次幂就是 $x$。

看 $4 \\cdot 3^{\\log_{3} 7} - 5$。幂 $3^{\\log_{3} 7}$ 等于 $7$，所以整个式子是 $4 \\cdot 7 - 5 = 23$。其他底数也一样：$10^{\\log 6} = 6$，$e^{\\ln 2} = 2$。

> **注意。** 这个幂只等于真数，不是底数乘真数：$3^{\\log_{3} 7}$ 是 $7$，不是 $21$。外面的数仍按顺序运算：先乘 $4$，再减 $5$。把 $4$ 加上去会得到 $6$，忘了 $-5$ 会得到 $28$。`,
      ),
      generate(rng) {
        const base = anyBase(rng);
        const a = rng.int(2, 9);
        const n = rng.int(2, 25);
        const c = rng.int(-12, 12);
        const power = base.power(base.of(String(n)));
        const expr = `${a} \\cdot ${power}${plusK(c)}`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
          answer: a * n + c,
          wrong: [a + n + c, a * n, ...(base.name !== "e" ? [a * Number(base.name) * n + c] : [])],
          solution: walked(
            [
              [
                ["Undo the logarithm", "抵消对数"],
                t(
                  `$${base.of(String(n))}$ is the exponent that turns $${base.name}$ into $${n}$, so the power gives back $${n}$:`,
                  `$${base.of(String(n))}$ 是把 $${base.name}$ 变成 $${n}$ 的指数，所以这个幂就是 $${n}$：`,
                ),
                [`${power} = ${n}`],
              ],
              [
                ["Do the arithmetic", "计算"],
                t("The numbers outside stay: multiply first, then add or subtract.", "外面的数保留：先乘，再加减。"),
                [`${expr} = ${a} \\cdot ${n}${plusK(c)} = ${a * n + c}`],
              ],
            ],
            t(
              `With a calculator, $${base.of(String(n))} \\approx ${dec(approx(Math.log(n) / Math.log(base.name === "e" ? Math.E : Number(base.name))))}$ and $${base.power(dec(approx(Math.log(n) / Math.log(base.name === "e" ? Math.E : Number(base.name)))))} \\approx ${n}$, so the first step holds.`,
              `用计算器算得 $${base.of(String(n))} \\approx ${dec(approx(Math.log(n) / Math.log(base.name === "e" ? Math.E : Number(base.name))))}$，而 $${base.power(dec(approx(Math.log(n) / Math.log(base.name === "e" ? Math.E : Number(base.name)))))} \\approx ${n}$，第一步成立。`,
            ),
          ),
        });
      },
    },
    {
      id: "arithmetic-with-logarithms",
      title: t("Arithmetic with logarithms", "对数的运算"),
      explanation: t(
        `Each logarithm in an expression is just a number: the exponent that turns its base into its argument. So once each one is evaluated, an expression with several logarithms is ordinary arithmetic, and the bases may differ from term to term.

Take $3\\log_{2} 16 - \\log 100 - \\ln \\frac{1}{e}$. Evaluate each logarithm by itself: $\\log_{2} 16 = 4$ since $2^{4} = 16$, $\\log 100 = 2$ since $10^{2} = 100$, and $\\ln \\frac{1}{e} = -1$ since $e^{-1} = \\frac{1}{e}$. Then follow the order of operations:

$$3 \\cdot 4 - 2 - (-1) = 11$$

> **Watch out.** A coefficient multiplies the value of its own logarithm, and a minus sign in front of a logarithm subtracts its whole value: above, $-\\ln \\frac{1}{e}$ subtracts $-1$, which adds $1$. Dropping the coefficient or turning that minus sign into a plus are the usual slips.`,
        `式子中的每个对数都只是一个数：把底数变成真数的那个指数。所以分别求出每个对数之后，含有几个对数的式子就是普通的运算，各项的底数可以不同。

看 $3\\log_{2} 16 - \\log 100 - \\ln \\frac{1}{e}$。分别求出每个对数：$\\log_{2} 16 = 4$，因为 $2^{4} = 16$；$\\log 100 = 2$，因为 $10^{2} = 100$；$\\ln \\frac{1}{e} = -1$，因为 $e^{-1} = \\frac{1}{e}$。再按运算顺序计算：

$$3 \\cdot 4 - 2 - (-1) = 11$$

> **注意。** 系数只乘它自己那个对数的值；对数前面的减号减去的是这个对数的整个值：上面的 $-\\ln \\frac{1}{e}$ 减去 $-1$，相当于加 $1$。丢掉系数或者把这个减号当成加号，是常见的错误。`,
      ),
      generate(rng) {
        const term = (): { latex: string; value: Q; why: string } => {
          const k = rng.int(0, 4);
          if (k === 0) {
            const c = rng.int(-3, 6);
            return { latex: lgL(dec(Q.of(10).pow(c))), value: Q.of(c), why: `10^{${c}} = ${dec(Q.of(10).pow(c))}` };
          }
          if (k === 1) {
            const c = rng.nonZero(-4, 8);
            return { latex: lnL(`e^{${c}}`), value: Q.of(c), why: "" };
          }
          if (k === 2) {
            const { b, c, x } = fractionalPower(rng);
            return { latex: logL(b, num(x)), value: c, why: powerValue(b, c) };
          }
          const { b, c, x } = integerPower(rng, -3, 5);
          return { latex: logL(b, num(x)), value: c, why: powerValue(b, c) };
        };
        const [u, v, w] = [term(), term(), term()];
        const a = rng.int(2, 4);
        const s = rng.sign();
        const au = u.value.mul(Q.of(a));
        const auv = au.add(v.value.mul(Q.of(s)));
        const expr = `${a}${u.latex} ${s > 0 ? "+" : "-"} ${v.latex} - ${w.latex}`;
        const answer = u.value
          .mul(Q.of(a))
          .add(v.value.mul(Q.of(s)))
          .sub(w.value);
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
          answer,
          wrong: [
            u.value.add(v.value.mul(Q.of(s))).sub(w.value),
            u.value
              .mul(Q.of(a))
              .add(v.value.mul(Q.of(s)))
              .add(w.value),
          ],
          solution: walked(
            [
              [
                ["Evaluate each logarithm", "分别求出每个对数"],
                t("Each logarithm is the exponent that turns its base into its argument:", "每个对数都是把底数变成真数的指数："),
                [...new Set([u, v, w].map((term) => `${term.latex} = ${num(term.value)}`))],
              ],
              [
                ["Do the arithmetic", "计算"],
                t("Put the values in and follow the order of operations:", "代入这些值，按运算顺序计算："),
                [`${expr} = ${a} \\cdot ${paren(u.value)} ${s > 0 ? "+" : "-"} ${paren(v.value)} - ${paren(w.value)} = ${num(answer)}`],
              ],
            ],
            t(
              `${u.why ? `Converting back confirms the first value: $${u.why}$. ` : ""}Redo the arithmetic one operation at a time: $${a} \\cdot ${paren(u.value)} = ${num(au)}$, then $${num(au)} ${s > 0 ? "+" : "-"} ${paren(v.value)} = ${num(auv)}$, then $${num(auv)} - ${paren(w.value)} = ${num(answer)}$.`,
              `${u.why ? `反过来互化可确认第一个值：$${u.why}$。` : ""}一次只做一步运算：$${a} \\cdot ${paren(u.value)} = ${num(au)}$，再 $${num(au)} ${s > 0 ? "+" : "-"} ${paren(v.value)} = ${num(auv)}$，再 $${num(auv)} - ${paren(w.value)} = ${num(answer)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** nonPowers are arguments that are not powers of a small base, so their logarithms are not rational. */
const nonPowers = [3, 5, 6, 7, 10, 11, 12, 13, 14, 15, 17, 19, 20, 21, 22, 23];

/** ExactProduct is a product M·N = b^c with M and N not powers of b. */
interface ExactProduct {
  readonly b: number;
  readonly c: number;
  readonly M: number;
  readonly N: number;
}

/** exactProducts lists products of two whole numbers above 1 that are powers of 2 to 15, with neither factor a power of the base. */
const exactProducts: readonly ExactProduct[] = (() => {
  const out: ExactProduct[] = [];
  for (let b = 2; b <= 15; b++) {
    for (let c = 1; c <= 4; c++) {
      const v = b ** c;
      if (v > 1000) break;
      for (let M = 2; M * M <= v; M++) {
        const N = v / M;
        if (!Number.isInteger(N)) continue;
        if (qlog(Q.of(b), Q.of(M)) || qlog(Q.of(b), Q.of(N))) continue;
        out.push({ b, c, M, N });
      }
    }
  }
  return out;
})();

export const productRuleForLogarithms: TopicDef = {
  id: "product-rule-for-logarithms",
  title: t("The Product Rule for Logarithms", "对数的积的法则"),
  summary: t(
    "Use $\\log_{b} (MN) = \\log_{b} M + \\log_{b} N$ to combine, evaluate and expand logarithms.",
    "用 $\\log_{b} (MN) = \\log_{b} M + \\log_{b} N$ 合并、计算和展开对数。",
  ),
  prerequisites: ["simplifying-logarithmic-expressions"],
  encompasses: [{ topic: "evaluating-logarithms", weight: 0.3 }],
  xp: 13,
  standards: ["CCSS.HSF.LE.A.4"],
  intro: t(
    `A logarithm is an exponent, so every rule for exponents gives a rule for logarithms. The first is about products. Multiplying powers of the same base adds the exponents: $4 \\cdot 8 = 2^{2} \\cdot 2^{3} = 2^{5}$. In logarithms this reads

$$\\log_{2} (4 \\cdot 8) = \\log_{2} 32 = 5 = 2 + 3 = \\log_{2} 4 + \\log_{2} 8.$$

The logarithm of the product is the sum of the logarithms. The same holds for any positive numbers, powers of the base or not, because every positive number is some power of the base.

In this lesson we use this **product rule** in both directions: to combine a sum of logarithms into one, to evaluate sums whose terms are not nice numbers, and to expand the logarithm of a product.`,
    `对数就是指数，所以每条指数运算法则都对应一条对数运算法则。第一条是关于积的。同底数幂相乘，指数相加：$4 \\cdot 8 = 2^{2} \\cdot 2^{3} = 2^{5}$。用对数来写就是

$$\\log_{2} (4 \\cdot 8) = \\log_{2} 32 = 5 = 2 + 3 = \\log_{2} 4 + \\log_{2} 8$$

积的对数等于对数的和。对任何正数都是如此，不论它是不是底数的幂，因为每个正数都是底数的某个次幂。

这节课我们从两个方向使用这条**积的法则**：把对数的和合并成一个对数，计算各项都不是简单数的和，以及展开积的对数。`,
  ),
  knowledgePoints: [
    {
      id: "condensing-a-sum",
      title: t("Combining a sum of logarithms", "合并对数的和"),
      explanation: t(
        `Multiplying powers adds exponents, $b^{m} \\cdot b^{n} = b^{m + n}$, and logarithms are exponents. Write $M = b^{m}$ and $N = b^{n}$, so that $\\log_{b} M = m$ and $\\log_{b} N = n$. Then $MN = b^{m + n}$, so $\\log_{b} (MN) = m + n$:

$$\\log_{b} (MN) = \\log_{b} M + \\log_{b} N$$

Read from right to left, the rule combines a sum into one logarithm. Take $\\log_{3} 5 + \\log_{3} 7$. Both terms have base $3$, so the arguments multiply: $\\log_{3} (5 \\cdot 7) = \\log_{3} 35$. Three or more terms combine the same way: $\\log 2 + \\log 3 + \\log 5 = \\log 30$.

> **Watch out.** A sum of logarithms is the logarithm of a **product**, never of a sum or a difference: $\\log_{3} 5 + \\log_{3} 7$ is $\\log_{3} 35$, not $\\log_{3} 12$ or $\\log_{3} 2$. With three terms, multiply all three arguments. The rule needs the same base in every term.`,
        `同底数幂相乘，指数相加：$b^{m} \\cdot b^{n} = b^{m + n}$，而对数就是指数。设 $M = b^{m}$，$N = b^{n}$，则 $\\log_{b} M = m$，$\\log_{b} N = n$。于是 $MN = b^{m + n}$，所以 $\\log_{b} (MN) = m + n$：

$$\\log_{b} (MN) = \\log_{b} M + \\log_{b} N$$

从右往左用，这条法则把和合并成一个对数。看 $\\log_{3} 5 + \\log_{3} 7$。两项的底数都是 $3$，所以真数相乘：$\\log_{3} (5 \\cdot 7) = \\log_{3} 35$。三项或更多项也一样合并：$\\log 2 + \\log 3 + \\log 5 = \\log 30$。

> **注意。** 对数的和是**积**的对数，不是和或差的对数：$\\log_{3} 5 + \\log_{3} 7$ 是 $\\log_{3} 35$，不是 $\\log_{3} 12$，也不是 $\\log_{3} 2$。有三项时，三个真数都要相乘。这条法则要求每一项的底数都相同。`,
      ),
      generate(rng) {
        const base = anyBase(rng);
        const [M, N] = rng.sample(nonPowers.slice(0, 10), 2) as [number, number];
        const K = rng.bool(0.3) ? rng.pick([2, 3, 5]) : 1;
        const terms = [base.of(String(M)), base.of(String(N)), ...(K > 1 ? [base.of(String(K))] : [])];
        const expr = terms.join(" + ");
        const answer = M * N * K;
        return prefixed(
          {
            prompt: t(`Write $${expr}$ as a single logarithm.`, `把 $${expr}$ 写成一个对数。`),
            answer,
            wrong: K > 1 ? [M + N + K, M * N, M * N + K] : [M + N, Math.abs(M - N)],
            solution: walked(
              [
                [
                  ["Check the bases", "检查底数"],
                  t(
                    `Every term has base $${base.name}$, so the product rule applies.`,
                    `每一项的底数都是 $${base.name}$，所以可以用积的法则。`,
                  ),
                ],
                [
                  ["Multiply the arguments", "真数相乘"],
                  t("A sum of logarithms is the logarithm of the product of the arguments:", "对数的和等于真数之积的对数："),
                  [`${expr} = ${base.of([M, N, ...(K > 1 ? [K] : [])].join(" \\cdot "))} = ${base.of(String(answer))}`],
                ],
              ],
              t(
                `With a calculator, $${expr} \\approx ${roundedSum(base, [M, N, ...(K > 1 ? [K] : [])])}$ and $${base.of(String(answer))} \\approx ${approxLog(base, answer)}$: equal up to rounding.`,
                `用计算器算得 $${expr} \\approx ${roundedSum(base, [M, N, ...(K > 1 ? [K] : [])])}$，而 $${base.of(String(answer))} \\approx ${approxLog(base, answer)}$：在误差范围内相等。`,
              ),
            ),
          },
          base.prefix,
        );
      },
    },
    {
      id: "evaluating-with-the-product-rule",
      title: t("Evaluating with the product rule", "用积的法则求值"),
      explanation: t(
        `The product rule, $\\log_{b} M + \\log_{b} N = \\log_{b} (MN)$, merges two logarithms with the same base into one. That helps when neither logarithm is a nice number but the product of the arguments is a power of the base.

Take $\\log_{6} 4 + \\log_{6} 9$. Neither $4$ nor $9$ is a power of $6$, but $4 \\cdot 9 = 36 = 6^{2}$:

$$\\log_{6} 4 + \\log_{6} 9 = \\log_{6} 36 = 2$$

> **Watch out.** Combine first, then evaluate, and give the exponent, not the product: the answer is $2$, not $36$. Count the power carefully, since $3$ would be one too many. Multiply the arguments: adding them gives $\\log_{6} 13$, which is not a whole number, and the product of the arguments is not the answer either.`,
        `积的法则 $\\log_{b} M + \\log_{b} N = \\log_{b} (MN)$ 把同底的两个对数合并成一个。当两个对数都不是简单的数，而真数之积是底数的幂时，这很有用。

看 $\\log_{6} 4 + \\log_{6} 9$。$4$ 和 $9$ 都不是 $6$ 的幂，但 $4 \\cdot 9 = 36 = 6^{2}$：

$$\\log_{6} 4 + \\log_{6} 9 = \\log_{6} 36 = 2$$

> **注意。** 先合并，再求值，答案是指数而不是乘积：答案是 $2$，不是 $36$。数幂的次数要仔细，$3$ 就多了一次。真数要相乘：相加得到 $\\log_{6} 13$，不是整数；真数之积本身也不是答案。`,
      ),
      generate(rng) {
        const { b, c, M, N } = rng.pick(exactProducts);
        const base = b === 10 && rng.bool() ? tenBase : numberBase(b);
        const [A, B] = rng.bool() ? [M, N] : [N, M];
        const expr = `${base.of(String(A))} + ${base.of(String(B))}`;
        return numberProblem({
          prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
          answer: c,
          wrong: [b ** c, c + 1, A * B],
          solution: walked(
            [
              [
                ["Combine into one logarithm", "合并成一个对数"],
                t(
                  `Both logarithms have base $${base.name}$, so multiply the arguments:`,
                  `两个对数的底数都是 $${base.name}$，所以真数相乘：`,
                ),
                [`${expr} = ${base.of(`${A} \\cdot ${B}`)} = ${base.of(String(b ** c))}`],
              ],
              [
                ["Evaluate", "求值"],
                t(
                  `$${powerValue(Q.of(b), Q.of(c))}$, so the logarithm is $${c}$:`,
                  `$${powerValue(Q.of(b), Q.of(c))}$，所以这个对数是 $${c}$：`,
                ),
                [`${base.of(String(b ** c))} = ${c}`],
              ],
            ],
            t(
              `With a calculator, $${base.of(String(A))} \\approx ${approxLog(base, A, 4)}$ and $${base.of(String(B))} \\approx ${approxLog(base, B, 4)}$, which add to $${c}$ up to rounding.`,
              `用计算器算得 $${base.of(String(A))} \\approx ${approxLog(base, A, 4)}$，$${base.of(String(B))} \\approx ${approxLog(base, B, 4)}$，两者之和在误差范围内等于 $${c}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "expanding-a-product",
      title: t("Expanding the logarithm of a product", "展开积的对数"),
      explanation: t(
        `Read from left to right, the product rule splits the logarithm of a product into a sum of logarithms, one for each factor. A factor that is a power of the base then evaluates to a number.

Take $\\log_{3} (27y)$. The argument is the product of $27$ and $y$, and $27 = 3^{3}$, so

$$\\log_{3} (27y) = \\log_{3} 27 + \\log_{3} y = 3 + \\log_{3} y.$$

With two letters, each gets its own logarithm: $\\log_{2} (4xy) = 2 + \\log_{2} x + \\log_{2} y$.

> **Watch out.** The number is **added** to the other logarithms, not multiplied: $3 + \\log_{3} y$, not $3\\log_{3} y$. Replace $\\log_{3} 27$ by its value $3$, not by $27$ or $4$, and never turn the sum into a product of logarithms.`,
        `从左往右用，积的法则把积的对数拆成对数的和，每个因数一个对数。底数的幂作为因数时，它的对数是一个数。

看 $\\log_{3} (27y)$。真数是 $27$ 与 $y$ 的积，而 $27 = 3^{3}$，所以

$$\\log_{3} (27y) = \\log_{3} 27 + \\log_{3} y = 3 + \\log_{3} y$$

有两个字母时，每个字母各有一个对数：$\\log_{2} (4xy) = 2 + \\log_{2} x + \\log_{2} y$。

> **注意。** 这个数与其他对数是**相加**，不是相乘：$3 + \\log_{3} y$，不是 $3\\log_{3} y$。$\\log_{3} 27$ 要换成它的值 $3$，不是 $27$，也不是 $4$；也不要把和变成对数的积。`,
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 4, 5, 10]);
        const n = rng.int(1, b === 10 ? 4 : b === 2 ? 6 : 3);
        const base = b === 10 && rng.bool(0.6) ? tenBase : numberBase(b);
        const k = b ** n;
        const v = rng.pick(["x", "y", "a", "t"]);
        const two = rng.bool(0.4);
        const w = v === "y" ? "x" : "y";
        const arg = `${k}${v}${two ? w : ""}`;
        const rest = `${base.of(v)}${two ? ` + ${base.of(w)}` : ""}`;
        const wrong = [
          `${n}${base.of(v)}${two ? ` + ${base.of(w)}` : ""}`,
          `${k} + ${rest}`,
          `${base.of(String(k))} \\cdot ${base.of(v)}${two ? ` \\cdot ${base.of(w)}` : ""}`,
          `${n + 1} + ${rest}`,
        ];
        return reasoned(
          oneOf(rng, {
            prompt: t(`Which expression equals $${base.of(arg)}$?`, `下列哪个式子等于 $${base.of(arg)}$？`),
            right: m(`${n} + ${rest}`),
            wrong: wrong.map(m),
            solution: walked(
              [
                [
                  ["Split the product", "拆开乘积"],
                  t(
                    "The argument is a product, so its logarithm is the sum of the logarithms of the factors:",
                    "真数是乘积，所以它的对数等于各因数的对数之和：",
                  ),
                  [`${base.of(arg)} = ${base.of(String(k))} + ${rest}`],
                ],
                [
                  ["Evaluate the number", "求出数的对数"],
                  t(
                    `$${powerValue(Q.of(b), Q.of(n))}$, so $${base.of(String(k))} = ${n}$:`,
                    `$${powerValue(Q.of(b), Q.of(n))}$，所以 $${base.of(String(k))} = ${n}$：`,
                  ),
                  [`${base.of(arg)} = ${n} + ${rest}`],
                ],
              ],
              t(
                `Try $${v} = ${b}$${two ? ` and $${w} = 1$` : ""}. The left side is $${base.of(String(k * b))} = ${n + 1}$, since $${k * b} = ${powL(b, n + 1)}$, and the right side is $${n} + 1${two ? " + 0" : ""} = ${n + 1}$.`,
                `试取 $${v} = ${b}$${two ? `、$${w} = 1$` : ""}。左边是 $${base.of(String(k * b))} = ${n + 1}$，因为 $${k * b} = ${powL(b, n + 1)}$；右边是 $${n} + 1${two ? " + 0" : ""} = ${n + 1}$。`,
              ),
            ),
          }),
          [
            [
              m(wrong[0]!).en,
              "The number is added, not multiplied: the product rule turns a product into a sum.",
              "这个数是加上去的，不是乘上去的：积的法则把积变成和。",
            ],
            [
              m(wrong[1]!).en,
              `$${base.of(String(k))}$ is $${n}$, not $${k}$: replace the logarithm by its value.`,
              `$${base.of(String(k))}$ 等于 $${n}$，不是 $${k}$：要用这个对数的值代替它。`,
            ],
            [
              m(wrong[2]!).en,
              "The logarithm of a product is a sum of logarithms, not a product of them.",
              "积的对数是对数的和，不是对数的积。",
            ],
            [
              m(wrong[3]!).en,
              `$${powL(b, n)} = ${k}$, so $${base.of(String(k))} = ${n}$, not $${n + 1}$.`,
              `$${powL(b, n)} = ${k}$，所以 $${base.of(String(k))} = ${n}$，不是 $${n + 1}$。`,
            ],
          ],
        );
      },
    },
  ],
};

export const quotientRuleForLogarithms: TopicDef = {
  id: "quotient-rule-for-logarithms",
  title: t("The Quotient Rule for Logarithms", "对数的商的法则"),
  summary: t(
    "Use $\\log_{b} \\frac{M}{N} = \\log_{b} M - \\log_{b} N$ to combine, evaluate and expand logarithms.",
    "用 $\\log_{b} \\frac{M}{N} = \\log_{b} M - \\log_{b} N$ 合并、计算和展开对数。",
  ),
  prerequisites: ["product-rule-for-logarithms"],
  encompasses: [{ topic: "evaluating-logarithms", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.LE.A.4"],
  intro: t(
    `The product rule came from adding exponents when powers multiply. Division works the same way with subtraction: dividing powers of the same base subtracts the exponents, $\\frac{64}{4} = \\frac{2^{6}}{2^{2}} = 2^{4}$. In logarithms this reads

$$\\log_{2} \\frac{64}{4} = \\log_{2} 16 = 4 = 6 - 2 = \\log_{2} 64 - \\log_{2} 4.$$

The logarithm of a quotient is the logarithm of the numerator minus the logarithm of the denominator. The order matters, as it does for any subtraction: $\\log_{2} \\frac{4}{64} = \\log_{2} \\frac{1}{16} = -4$.

In this lesson we use this **quotient rule** to combine a difference of logarithms, to evaluate differences, and to expand the logarithm of a quotient.`,
    `积的法则来自幂相乘时指数相加。除法也一样，只是变成减法：同底数幂相除，指数相减，$\\frac{64}{4} = \\frac{2^{6}}{2^{2}} = 2^{4}$。用对数来写就是

$$\\log_{2} \\frac{64}{4} = \\log_{2} 16 = 4 = 6 - 2 = \\log_{2} 64 - \\log_{2} 4$$

商的对数等于分子的对数减去分母的对数。和所有减法一样，顺序很重要：$\\log_{2} \\frac{4}{64} = \\log_{2} \\frac{1}{16} = -4$。

这节课我们用这条**商的法则**合并对数的差、计算差的值，以及展开商的对数。`,
  ),
  knowledgePoints: [
    {
      id: "condensing-a-difference",
      title: t("Combining a difference of logarithms", "合并对数的差"),
      explanation: t(
        `Dividing powers subtracts exponents, $\\frac{b^{m}}{b^{n}} = b^{m - n}$. With $M = b^{m}$ and $N = b^{n}$, so that $\\log_{b} M = m$ and $\\log_{b} N = n$, this says the logarithm of a quotient is the difference of the logarithms:

$$\\log_{b} \\frac{M}{N} = \\log_{b} M - \\log_{b} N$$

Read from right to left, the rule combines a difference into one logarithm, and the logarithm being subtracted gives the denominator. Take $\\log_{5} 12 - \\log_{5} 3$: it is $\\log_{5} \\frac{12}{3} = \\log_{5} 4$, after simplifying the fraction. When the first argument is smaller, a fraction remains: $\\log_{2} 3 - \\log_{2} 7 = \\log_{2} \\frac{3}{7}$.

> **Watch out.** A difference of logarithms is the logarithm of a **quotient**, not of a difference and not of a product: $\\log_{5} 12 - \\log_{5} 3$ is neither $\\log_{5} 9$ nor $\\log_{5} 36$. Keep the order: the first argument goes on top, so $\\log_{2} 3 - \\log_{2} 7$ is $\\log_{2} \\frac{3}{7}$, not $\\log_{2} \\frac{7}{3}$.`,
        `同底数幂相除，指数相减：$\\frac{b^{m}}{b^{n}} = b^{m - n}$。设 $M = b^{m}$，$N = b^{n}$，则 $\\log_{b} M = m$，$\\log_{b} N = n$，于是商的对数等于对数的差：

$$\\log_{b} \\frac{M}{N} = \\log_{b} M - \\log_{b} N$$

从右往左用，这条法则把差合并成一个对数，被减去的对数的真数放在分母。看 $\\log_{5} 12 - \\log_{5} 3$：它等于 $\\log_{5} \\frac{12}{3}$，约分后是 $\\log_{5} 4$。第一个真数较小时，结果是分数：$\\log_{2} 3 - \\log_{2} 7 = \\log_{2} \\frac{3}{7}$。

> **注意。** 对数的差是**商**的对数，不是差的对数，也不是积的对数：$\\log_{5} 12 - \\log_{5} 3$ 既不是 $\\log_{5} 9$，也不是 $\\log_{5} 36$。顺序不能变：第一个真数放在分子，所以 $\\log_{2} 3 - \\log_{2} 7$ 是 $\\log_{2} \\frac{3}{7}$，不是 $\\log_{2} \\frac{7}{3}$。`,
      ),
      generate(rng) {
        const base = anyBase(rng);
        const [M, N] = rng.sample([2, 3, 5, 6, 7, 10, 11, 12, 14, 15, 18, 20, 21, 24, 28, 30, 35, 36, 40], 2) as [number, number];
        const expr = `${base.of(String(M))} - ${base.of(String(N))}`;
        const answer = Q.of(M, N);
        return prefixed(
          {
            prompt: t(`Write $${expr}$ as a single logarithm.`, `把 $${expr}$ 写成一个对数。`),
            answer,
            wrong: [M - N, Q.of(N, M), M * N],
            solution: walked(
              [
                [
                  ["Check the bases", "检查底数"],
                  t(
                    `Both terms have base $${base.name}$, so the quotient rule applies, with the first argument on top.`,
                    `两项的底数都是 $${base.name}$，所以可以用商的法则，第一个真数放在分子。`,
                  ),
                ],
                [
                  ["Divide the arguments", "真数相除"],
                  gcd(M, N) > 1
                    ? t("Write the quotient of the arguments and simplify the fraction:", "写出真数的商，再约分：")
                    : t("Write the quotient of the arguments:", "写出真数的商："),
                  [chain(expr, base.of(`\\frac{${M}}{${N}}`), base.of(num(answer)))],
                ],
              ],
              t(
                `With a calculator, $${expr} \\approx ${roundedSum(base, [M, N], [1, -1])}$ and $${base.of(num(answer))} \\approx ${approxLog(base, M / N)}$: equal up to rounding.`,
                `用计算器算得 $${expr} \\approx ${roundedSum(base, [M, N], [1, -1])}$，而 $${base.of(num(answer))} \\approx ${approxLog(base, M / N)}$：在误差范围内相等。`,
              ),
            ),
          },
          base.prefix,
        );
      },
    },
    {
      id: "evaluating-with-the-quotient-rule",
      title: t("Evaluating with the quotient rule", "用商的法则求值"),
      explanation: t(
        `The quotient rule, $\\log_{b} M - \\log_{b} N = \\log_{b} \\frac{M}{N}$, merges a difference of two logarithms with the same base into one. As with sums, the quotient can be a power of the base even when neither argument is.

Take $\\log_{2} 40 - \\log_{2} 5$. Combine: $\\log_{2} \\frac{40}{5} = \\log_{2} 8 = 3$. If the larger argument is the one subtracted, the quotient is a fraction and the answer is negative: $\\log_{3} 2 - \\log_{3} 18 = \\log_{3} \\frac{2}{18} = \\log_{3} \\frac{1}{9} = -2$.

> **Watch out.** Keep the order of the subtraction in the fraction: the first argument goes on top. Swapping them flips the sign of the answer, $2$ instead of $-2$. And give the exponent, not the quotient: $\\log_{2} 8$ is $3$, not $8$, and not $4$.`,
        `商的法则 $\\log_{b} M - \\log_{b} N = \\log_{b} \\frac{M}{N}$ 把同底的两个对数之差合并成一个。和求和一样，即使两个真数都不是底数的幂，它们的商也可能是。

看 $\\log_{2} 40 - \\log_{2} 5$。合并：$\\log_{2} \\frac{40}{5} = \\log_{2} 8 = 3$。如果被减去的是较大的真数，商是分数，答案是负数：$\\log_{3} 2 - \\log_{3} 18 = \\log_{3} \\frac{2}{18} = \\log_{3} \\frac{1}{9} = -2$。

> **注意。** 分数要保持减法的顺序：第一个真数放在分子。把它们对调，答案的符号就反了，得到 $2$ 而不是 $-2$。答案是指数而不是商：$\\log_{2} 8$ 是 $3$，不是 $8$，也不是 $4$。`,
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 4, 5, 6, 10]);
          const c = rng.int(1, b === 2 ? 5 : 3);
          const N = rng.pick(nonPowers);
          if (qlog(Q.of(b), Q.of(N))) continue;
          const M = N * b ** c;
          if (M > 2000) continue;
          const base = b === 10 && rng.bool() ? tenBase : numberBase(b);
          const flip = rng.bool(0.35);
          const [A, B] = flip ? [N, M] : [M, N];
          const answer = flip ? -c : c;
          const expr = `${base.of(String(A))} - ${base.of(String(B))}`;
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
            answer,
            wrong: [-answer, b ** c, answer + 1],
            solution: walked(
              [
                [
                  ["Combine into one logarithm", "合并成一个对数"],
                  t(
                    `Both logarithms have base $${base.name}$, so divide the arguments, the first over the second:`,
                    `两个对数的底数都是 $${base.name}$，所以真数相除，第一个作分子，第二个作分母：`,
                  ),
                  [chain(expr, base.of(`\\frac{${A}}{${B}}`), base.of(num(Q.of(A, B))))],
                ],
                [
                  ["Evaluate", "求值"],
                  t(
                    `$${powerValue(Q.of(b), Q.of(answer))}$, so the logarithm is $${answer}$:`,
                    `$${powerValue(Q.of(b), Q.of(answer))}$，所以这个对数是 $${answer}$：`,
                  ),
                  [`${base.of(num(Q.of(A, B)))} = ${answer}`],
                ],
              ],
              t(
                `With a calculator, $${expr} \\approx ${roundedSum(base, [A, B], [1, -1])}$, which is $${answer}$ up to rounding.`,
                `用计算器算得 $${expr} \\approx ${roundedSum(base, [A, B], [1, -1])}$，在误差范围内等于 $${answer}$。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "expanding-a-quotient",
      title: t("Expanding the logarithm of a quotient", "展开商的对数"),
      explanation: t(
        `Read from left to right, the quotient rule splits the logarithm of a quotient into a difference: the logarithm of the numerator minus the logarithm of the denominator. A number that is a power of the base then becomes its exponent.

Take $\\log_{5} \\frac{x}{125}$. Since $125 = 5^{3}$,

$$\\log_{5} \\frac{x}{125} = \\log_{5} x - \\log_{5} 125 = \\log_{5} x - 3.$$

With the number on top the order flips: $\\log_{5} \\frac{125}{x} = 3 - \\log_{5} x$.

> **Watch out.** It is numerator minus denominator, in that order, and a minus, not a plus: $\\log_{5} \\frac{x}{125}$ is $\\log_{5} x - 3$, not $3 - \\log_{5} x$ or $\\log_{5} x + 3$. The rule gives a difference, not a fraction of logarithms such as $\\frac{\\log_{5} x}{3}$, and $\\log_{5} 125$ becomes $3$, not $125$.`,
        `从左往右用，商的法则把商的对数拆成差：分子的对数减去分母的对数。底数的幂这样的数随后变成它的指数。

看 $\\log_{5} \\frac{x}{125}$。因为 $125 = 5^{3}$，

$$\\log_{5} \\frac{x}{125} = \\log_{5} x - \\log_{5} 125 = \\log_{5} x - 3$$

数在分子上时顺序相反：$\\log_{5} \\frac{125}{x} = 3 - \\log_{5} x$。

> **注意。** 是分子减分母，顺序不能反，而且是减号不是加号：$\\log_{5} \\frac{x}{125}$ 是 $\\log_{5} x - 3$，不是 $3 - \\log_{5} x$，也不是 $\\log_{5} x + 3$。这条法则得到的是差，不是像 $\\frac{\\log_{5} x}{3}$ 这样的对数之商；$\\log_{5} 125$ 要变成 $3$，不是 $125$。`,
      ),
      generate(rng) {
        const b = rng.pick([2, 3, 4, 5, 10]);
        const n = rng.int(1, b === 10 ? 4 : b === 2 ? 6 : 3);
        const base = b === 10 && rng.bool(0.6) ? tenBase : numberBase(b);
        const k = b ** n;
        const v = rng.pick(["x", "y", "a", "t"]);
        const over = rng.bool();
        const arg = over ? `\\frac{${v}}{${k}}` : `\\frac{${k}}{${v}}`;
        const L = base.of(v);
        const right = over ? `${L} - ${n}` : `${n} - ${L}`;
        const wrong = [
          over ? `${n} - ${L}` : `${L} - ${n}`,
          over ? `\\frac{${L}}{${n}}` : `\\frac{${n}}{${L}}`,
          over ? `${L} - ${k}` : `${k} - ${L}`,
          over ? `${L} + ${n}` : `${n} + ${L}`,
        ];
        return reasoned(
          oneOf(rng, {
            prompt: t(`Which expression equals $${base.of(arg)}$?`, `下列哪个式子等于 $${base.of(arg)}$？`),
            right: m(right),
            wrong: wrong.map(m),
            solution: walked(
              [
                [
                  ["Split the quotient", "拆开商"],
                  t(
                    "The logarithm of a quotient is the logarithm of the numerator minus the logarithm of the denominator:",
                    "商的对数等于分子的对数减去分母的对数：",
                  ),
                  [`${base.of(arg)} = ${over ? `${L} - ${base.of(String(k))}` : `${base.of(String(k))} - ${L}`}`],
                ],
                [
                  ["Evaluate the number", "求出数的对数"],
                  t(
                    `$${powerValue(Q.of(b), Q.of(n))}$, so $${base.of(String(k))} = ${n}$:`,
                    `$${powerValue(Q.of(b), Q.of(n))}$，所以 $${base.of(String(k))} = ${n}$：`,
                  ),
                  [`${base.of(arg)} = ${right}`],
                ],
              ],
              t(
                `Try $${v} = ${k * b}$, so that $${base.of(v)} = ${n + 1}$, because $${k * b} = ${powL(b, n + 1)}$. The left side is $${base.of(over ? String(b) : `\\frac{1}{${b}}`)} = ${over ? 1 : -1}$, and the right side is $${over ? `${n + 1} - ${n}` : `${n} - ${n + 1}`} = ${over ? 1 : -1}$.`,
                `试取 $${v} = ${k * b}$，则 $${base.of(v)} = ${n + 1}$，因为 $${k * b} = ${powL(b, n + 1)}$。左边是 $${base.of(over ? String(b) : `\\frac{1}{${b}}`)} = ${over ? 1 : -1}$，右边是 $${over ? `${n + 1} - ${n}` : `${n} - ${n + 1}`} = ${over ? 1 : -1}$。`,
              ),
            ),
          }),
          [
            [
              m(wrong[0]!).en,
              "The order is reversed: it is the logarithm of the numerator minus the logarithm of the denominator.",
              "顺序反了：应该是分子的对数减去分母的对数。",
            ],
            [
              m(wrong[1]!).en,
              "The quotient rule gives a difference of logarithms, not a quotient of them.",
              "商的法则得到的是对数的差，不是对数的商。",
            ],
            [
              m(wrong[2]!).en,
              `$${base.of(String(k))}$ is $${n}$, not $${k}$: replace the logarithm by its value.`,
              `$${base.of(String(k))}$ 等于 $${n}$，不是 $${k}$：要用这个对数的值代替它。`,
            ],
            [
              m(wrong[3]!).en,
              "A quotient gives a difference, not a sum: the logarithm of the denominator is subtracted.",
              "商得到的是差，不是和：分母的对数要减去。",
            ],
          ],
        );
      },
    },
  ],
};

export const powerRuleForLogarithms: TopicDef = {
  id: "power-rule-for-logarithms",
  title: t("The Power Rule for Logarithms", "对数的幂的法则"),
  summary: t(
    "Use $\\log_{b} M^{k} = k \\log_{b} M$ to evaluate logarithms of powers and roots and to move coefficients into the argument.",
    "用 $\\log_{b} M^{k} = k \\log_{b} M$ 计算幂和根式的对数，并把系数移到真数里。",
  ),
  prerequisites: ["product-rule-for-logarithms"],
  encompasses: [
    { topic: "evaluating-logarithms", weight: 0.3 },
    { topic: "writing-radicals-using-fractional-exponents", weight: 0.2 },
  ],
  xp: 13,
  standards: ["CCSS.HSF.LE.A.4"],
  intro: t(
    `Raising a power to a power multiplies the exponents: $(2^{3})^{4} = 2^{12}$, because four factors of $2^{3}$ hold twelve factors of $2$. In logarithms this reads

$$\\log_{2} 8^{4} = \\log_{2} 2^{12} = 12 = 4 \\cdot 3 = 4 \\log_{2} 8.$$

So an exponent on the argument comes out in front as a factor:

$$\\log_{b} M^{k} = k \\log_{b} M.$$

Roots are powers too, with fractional exponents, and reciprocals have negative exponents, so the rule covers them as well.

In this lesson we use this **power rule** to evaluate logarithms of powers and roots, to move a coefficient into the argument, and to find logarithms of powers of an unknown.`,
    `幂的乘方，指数相乘：$(2^{3})^{4} = 2^{12}$，因为四个 $2^{3}$ 相乘共有十二个因数 $2$。用对数来写就是

$$\\log_{2} 8^{4} = \\log_{2} 2^{12} = 12 = 4 \\cdot 3 = 4 \\log_{2} 8$$

所以真数的指数可以作为因数提到对数前面：

$$\\log_{b} M^{k} = k \\log_{b} M$$

根式也是幂，指数是分数；倒数是负指数幂，所以这条法则对它们同样适用。

这节课我们用这条**幂的法则**计算幂和根式的对数，把系数移到真数里，并求未知数的幂的对数。`,
  ),
  knowledgePoints: [
    {
      id: "logarithms-of-powers",
      title: t("Logarithms of powers", "幂的对数"),
      explanation: t(
        `Why the rule holds: if $\\log_{b} M = m$, then $M = b^{m}$, and $M^{k} = (b^{m})^{k} = b^{mk}$, since raising a power to a power multiplies exponents. So

$$\\log_{b} M^{k} = mk = k \\log_{b} M.$$

Take $\\log_{3} 9^{5}$. Bring the exponent in front, $5 \\log_{3} 9$, and evaluate: $9 = 3^{2}$, so this is $5 \\cdot 2 = 10$. A root is a fractional power, $\\sqrt{125} = 125^{\\frac{1}{2}}$, so $\\log_{5} \\sqrt{125} = \\frac{1}{2} \\log_{5} 125 = \\frac{1}{2} \\cdot 3 = \\frac{3}{2}$.

> **Watch out.** The exponent **multiplies** the logarithm: $\\log_{3} 9^{5}$ is $5 \\cdot 2 = 10$, not $5 + 2 = 7$ and not $2^{5} = 32$. A square root multiplies by $\\frac{1}{2}$, so $\\log_{5} \\sqrt{125}$ is $\\frac{3}{2}$, not $3 \\cdot 2 = 6$.`,
        `法则成立的原因：若 $\\log_{b} M = m$，则 $M = b^{m}$，而 $M^{k} = (b^{m})^{k} = b^{mk}$，因为幂的乘方指数相乘。所以

$$\\log_{b} M^{k} = mk = k \\log_{b} M$$

看 $\\log_{3} 9^{5}$。把指数提到前面得 $5 \\log_{3} 9$，再求值：$9 = 3^{2}$，所以结果是 $5 \\cdot 2 = 10$。根式是分数指数幂，$\\sqrt{125} = 125^{\\frac{1}{2}}$，所以 $\\log_{5} \\sqrt{125} = \\frac{1}{2} \\log_{5} 125 = \\frac{1}{2} \\cdot 3 = \\frac{3}{2}$。

> **注意。** 指数与对数是**相乘**的关系：$\\log_{3} 9^{5}$ 是 $5 \\cdot 2 = 10$，不是 $5 + 2 = 7$，也不是 $2^{5} = 32$。平方根是乘以 $\\frac{1}{2}$，所以 $\\log_{5} \\sqrt{125}$ 是 $\\frac{3}{2}$，不是 $3 \\cdot 2 = 6$。`,
      ),
      generate(rng) {
        let power: PowerOf;
        do power = rng.bool(0.4) ? fractionalPower(rng) : integerPower(rng, 1, 4);
        while (power.x.d !== 1n || power.x.n > 400n);
        const { b, c, x } = power;
        const root = rng.bool(0.3);
        const k = root ? Q.of(1, rng.int(2, 3)) : Q.of(rng.int(2, 9));
        const arg = root ? `\\sqrt${k.d === 2n ? "" : "[3]"}{${num(x)}}` : `${num(x)}^{${num(k)}}`;
        const answer = c.mul(k);
        return logValueProblem(
          logL(b, arg),
          answer,
          [c.add(k), ...(c.isInteger() && k.isInteger() ? [c.pow(Number(k.n))] : []), c.div(k)],
          walked(
            [
              [
                ["Bring the exponent in front", "把指数提到前面"],
                root
                  ? t(
                      `A ${k.d === 2n ? "square" : "cube"} root is the power $${num(k)}$, and the power rule brings that exponent in front as a factor:`,
                      `${k.d === 2n ? "平方根" : "立方根"}就是 $${num(k)}$ 次幂，幂的法则把这个指数作为因数提到前面：`,
                    )
                  : t(
                      `The power rule brings the exponent $${num(k)}$ in front as a factor:`,
                      `幂的法则把指数 $${num(k)}$ 作为因数提到前面：`,
                    ),
                [
                  root
                    ? chain(logL(b, arg), `\\log_{${num(b)}} ${num(x)}^{${num(k)}}`, `${num(k)} ${logL(b, num(x))}`)
                    : `${logL(b, arg)} = ${num(k)} ${logL(b, num(x))}`,
                ],
              ],
              [
                ["Evaluate and multiply", "求值再相乘"],
                t(
                  `$${powerValue(b, c)}$, so $${logL(b, num(x))} = ${num(c)}$:`,
                  `$${powerValue(b, c)}$，所以 $${logL(b, num(x))} = ${num(c)}$：`,
                ),
                [`${num(k)} ${logL(b, num(x))} = ${num(k)} \\cdot ${paren(c)} = ${num(answer)}`],
              ],
            ],
            t(
              `Multiply exponents instead: $${num(x)} = ${powL(b, c)}$, so $${arg} = \\left(${powL(b, c)}\\right)^{${num(k)}} = ${powL(b, answer)}$, whose logarithm to base $${num(b)}$ is $${num(answer)}$.`,
              `换一种方法，指数相乘：$${num(x)} = ${powL(b, c)}$，所以 $${arg} = \\left(${powL(b, c)}\\right)^{${num(k)}} = ${powL(b, answer)}$，它以 $${num(b)}$ 为底的对数是 $${num(answer)}$。`,
            ),
          ),
        );
      },
    },
    {
      id: "moving-coefficients-into-the-argument",
      title: t("Moving a coefficient into the argument", "把系数移到真数里"),
      explanation: t(
        `The power rule is an equation, so it can be read from right to left: $k \\log_{b} M = \\log_{b} M^{k}$. A coefficient in front of a logarithm becomes the exponent of its argument. This is the first step whenever logarithms are to be combined into one, because the product and quotient rules only work on logarithms without coefficients.

Take $3 \\log_{2} 5$. The coefficient $3$ becomes an exponent: $\\log_{2} 5^{3} = \\log_{2} 125$. A fractional coefficient becomes a root: $\\frac{1}{2} \\log_{7} 36 = \\log_{7} 36^{\\frac{1}{2}} = \\log_{7} \\sqrt{36} = \\log_{7} 6$.

> **Watch out.** The coefficient becomes a **power**, not a factor and not an addend: $3 \\log_{2} 5$ is $\\log_{2} 125$, not $\\log_{2} 15$, not $\\log_{2} 8$, and not $\\log_{2} 3^{5}$. A coefficient $\\frac{1}{2}$ takes a square root, so $\\frac{1}{2} \\log_{7} 36$ is $\\log_{7} 6$, not $\\log_{7} 18$.`,
        `幂的法则是一个等式，所以也可以从右往左读：$k \\log_{b} M = \\log_{b} M^{k}$。对数前面的系数变成真数的指数。要把几个对数合并成一个时，这总是第一步，因为积和商的法则只适用于没有系数的对数。

看 $3 \\log_{2} 5$。系数 $3$ 变成指数：$\\log_{2} 5^{3} = \\log_{2} 125$。分数系数变成开方：$\\frac{1}{2} \\log_{7} 36 = \\log_{7} 36^{\\frac{1}{2}} = \\log_{7} \\sqrt{36} = \\log_{7} 6$。

> **注意。** 系数变成**指数**，不是因数，也不是加数：$3 \\log_{2} 5$ 是 $\\log_{2} 125$，不是 $\\log_{2} 15$，不是 $\\log_{2} 8$，也不是 $\\log_{2} 3^{5}$。系数 $\\frac{1}{2}$ 表示开平方，所以 $\\frac{1}{2} \\log_{7} 36$ 是 $\\log_{7} 6$，不是 $\\log_{7} 18$。`,
      ),
      generate(rng) {
        const base = anyBase(rng);
        if (rng.bool(0.35)) {
          const n = rng.int(2, rng.pick([3, 12]));
          const r = rng.int(2, n === 2 ? 30 : 5);
          const arg = r ** n;
          const k = Q.of(1, n);
          const expr = `${num(k)}${base.of(String(arg))}`;
          return prefixed(
            {
              prompt: t(`Write $${expr}$ as a single logarithm.`, `把 $${expr}$ 写成一个对数。`),
              answer: r,
              wrong: [Q.of(arg, n), arg, r * n],
              solution: walked(
                [
                  [
                    ["Move the coefficient into the exponent", "把系数移到指数上"],
                    t(
                      `The power rule read backwards makes the coefficient $${num(k)}$ the exponent of the argument:`,
                      `把幂的法则反过来用，系数 $${num(k)}$ 变成真数的指数：`,
                    ),
                    [`${expr} = ${base.of(`${arg}^{${num(k)}}`)}`],
                  ],
                  [
                    ["Take the root", "开方"],
                    t(
                      `A power of $${num(k)}$ is the ${n === 2 ? "square" : n === 3 ? "cube" : `${n}th`} root, and $${powValueOf(Q.of(r), n)}$:`,
                      `$${num(k)}$ 次幂就是开 ${n === 2 ? "平方" : n === 3 ? "立方" : `${n} 次方`}，而 $${powValueOf(Q.of(r), n)}$：`,
                    ),
                    [`${base.of(`${arg}^{${num(k)}}`)} = ${base.of(rootL(n, String(arg)))} = ${base.of(String(r))}`],
                  ],
                ],
                t(
                  `With a calculator, $${expr} \\approx ${num(k)} \\cdot ${approxLog(base, arg)} \\approx ${dec(roundTo(approxLogQ(base, arg).mul(k), 3))}$ and $${base.of(String(r))} \\approx ${approxLog(base, r)}$: equal up to rounding.`,
                  `用计算器算得 $${expr} \\approx ${num(k)} \\cdot ${approxLog(base, arg)} \\approx ${dec(roundTo(approxLogQ(base, arg).mul(k), 3))}$，而 $${base.of(String(r))} \\approx ${approxLog(base, r)}$：在误差范围内相等。`,
                ),
              ),
            },
            base.prefix,
          );
        }
        const k = rng.int(2, 4);
        const M = rng.int(2, k === 2 ? 15 : k === 3 ? 8 : 5);
        const expr = `${k}${base.of(String(M))}`;
        return prefixed(
          {
            prompt: t(`Write $${expr}$ as a single logarithm.`, `把 $${expr}$ 写成一个对数。`),
            answer: M ** k,
            wrong: [k * M, k ** M, M + k],
            solution: walked(
              [
                [
                  ["Move the coefficient into the exponent", "把系数移到指数上"],
                  t(
                    `The power rule read backwards makes the coefficient $${k}$ the exponent of the argument:`,
                    `把幂的法则反过来用，系数 $${k}$ 变成真数的指数：`,
                  ),
                  [`${expr} = ${base.of(`${M}^{${k}}`)}`],
                ],
                [
                  ["Work out the power", "算出幂"],
                  t(`$${powValueOf(Q.of(M), k)}$:`, `$${powValueOf(Q.of(M), k)}$：`),
                  [`${base.of(`${M}^{${k}}`)} = ${base.of(String(M ** k))}`],
                ],
              ],
              t(
                `With a calculator, $${expr} \\approx ${k} \\cdot ${approxLog(base, M)} = ${dec(approxLogQ(base, M).mul(Q.of(k)))}$ and $${base.of(String(M ** k))} \\approx ${approxLog(base, M ** k)}$: equal up to rounding.`,
                `用计算器算得 $${expr} \\approx ${k} \\cdot ${approxLog(base, M)} = ${dec(approxLogQ(base, M).mul(Q.of(k)))}$，而 $${base.of(String(M ** k))} \\approx ${approxLog(base, M ** k)}$：在误差范围内相等。`,
              ),
            ),
          },
          base.prefix,
        );
      },
    },
    {
      id: "power-rule-with-unknown-arguments",
      title: t("Logarithms of powers of an unknown", "未知数的幂的对数"),
      explanation: t(
        `The power rule, $\\log_{b} M^{k} = k \\log_{b} M$, works for any positive $M$, known or not. So once $\\log_{b} x$ is known, the logarithm of every power of $x$ follows from one multiplication. Roots and reciprocals are powers too: $\\sqrt{x} = x^{\\frac{1}{2}}$, $\\frac{1}{x^{2}} = x^{-2}$ and $\\sqrt[3]{x^{2}} = x^{\\frac{2}{3}}$.

Suppose $\\log_{b} x = 6$. First write each argument as a power of $x$, then multiply its exponent by $6$:

$$\\log_{b} x^{3} = 3 \\cdot 6 = 18, \\qquad \\log_{b} \\sqrt[3]{x} = \\frac{1}{3} \\cdot 6 = 2, \\qquad \\log_{b} \\frac{1}{x^{2}} = -2 \\cdot 6 = -12.$$

> **Watch out.** Multiply the exponent by the given logarithm; do not add them ($3 + 6$) or raise one to the other ($6^{3}$). A cube root multiplies by $\\frac{1}{3}$, which is dividing by $3$, not multiplying by $3$. And a reciprocal makes the exponent negative.`,
        `幂的法则 $\\log_{b} M^{k} = k \\log_{b} M$ 对任何正数 $M$ 都成立，不论 $M$ 是否已知。所以一旦知道 $\\log_{b} x$，$x$ 的任何次幂的对数只需一次乘法就能得到。根式和倒数也是幂：$\\sqrt{x} = x^{\\frac{1}{2}}$，$\\frac{1}{x^{2}} = x^{-2}$，$\\sqrt[3]{x^{2}} = x^{\\frac{2}{3}}$。

设 $\\log_{b} x = 6$。先把每个真数写成 $x$ 的幂，再用它的指数乘以 $6$：

$$\\log_{b} x^{3} = 3 \\cdot 6 = 18, \\qquad \\log_{b} \\sqrt[3]{x} = \\frac{1}{3} \\cdot 6 = 2, \\qquad \\log_{b} \\frac{1}{x^{2}} = -2 \\cdot 6 = -12$$

> **注意。** 用指数乘以已知的对数，不要相加（$3 + 6$），也不要乘方（$6^{3}$）。立方根是乘以 $\\frac{1}{3}$，也就是除以 $3$，不是乘以 $3$。倒数使指数变成负数。`,
      ),
      generate(rng) {
        const L = Q.of(rng.nonZero(-6, 9));
        const kind = rng.int(0, 3);
        const [arg, k] =
          kind === 0
            ? (() => {
                const e = rng.int(2, 7);
                return [`x^{${e}}`, Q.of(e)] as const;
              })()
            : kind === 1
              ? (() => {
                  const n = rng.int(2, 3);
                  return [`\\sqrt${n === 2 ? "" : "[3]"}{x}`, Q.of(1, n)] as const;
                })()
              : kind === 2
                ? (() => {
                    const e = rng.int(1, 4);
                    return [`\\frac{1}{${e === 1 ? "x" : `x^{${e}}`}}`, Q.of(-e)] as const;
                  })()
                : (() => {
                    const e = rng.int(2, 5);
                    const n = rng.pick([2, 3].filter((d) => gcd(d, e) === 1));
                    return [`\\sqrt${n === 2 ? "" : `[${n}]`}{x^{${e}}}`, Q.of(e, n)] as const;
                  })();
        const base = rng.pick(["b", "2", "5", "10"]);
        const log = (x: string) => (base === "10" ? lgL(x) : logL(base, x));
        const answer = L.mul(k);
        return numberProblem({
          prompt: t(`Given that $${log("x")} = ${num(L)}$, find $${log(arg)}$.`, `已知 $${log("x")} = ${num(L)}$，求 $${log(arg)}$。`),
          answer,
          wrong: [L.add(k), ...(k.isInteger() && k.sign() > 0 ? [L.pow(Number(k.n))] : []), L.div(k)],
          solution: walked(
            [
              [
                ["Write the argument as a power of x", "把真数写成 x 的幂"],
                kind === 0
                  ? t(`The argument is already a power of $x$, with exponent $${num(k)}$.`, `真数已经是 $x$ 的幂，指数是 $${num(k)}$。`)
                  : kind === 1
                    ? t(
                        `A ${k.d === 2n ? "square" : "cube"} root is a power with exponent $${num(k)}$:`,
                        `${k.d === 2n ? "平方根" : "立方根"}是指数为 $${num(k)}$ 的幂：`,
                      )
                    : kind === 2
                      ? t("The reciprocal of a power is a power with a negative exponent:", "幂的倒数是负指数幂：")
                      : t(
                          "A root of a power is a power with a fractional exponent, the power over the root:",
                          "幂的方根是分数指数幂，分子是幂的指数，分母是根指数：",
                        ),
                kind === 0 ? [] : [`${arg} = x^{${num(k)}}`],
              ],
              [
                ["Bring the exponent in front", "把指数提到前面"],
                t(
                  "The power rule turns the exponent into a factor; then put in the given value of the logarithm of $x$:",
                  "幂的法则把指数变成因数，再代入 $x$ 的对数的已知值：",
                ),
                [`${log(arg)} = ${coefL(k)}${log("x")} = ${num(k)} \\cdot ${paren(L)} = ${num(answer)}`],
              ],
            ],
            t(
              `Undo the logarithm: $${log("x")} = ${num(L)}$ means $x = ${base}^{${num(L)}}$, so $${kind === 0 ? "" : `${arg} = `}x^{${num(k)}} = ${base}^{${num(L)} \\cdot ${paren(k)}} = ${base}^{${num(answer)}}$, whose logarithm is $${num(answer)}$.`,
              `反过来互化：$${log("x")} = ${num(L)}$ 表示 $x = ${base}^{${num(L)}}$，所以 $${kind === 0 ? "" : `${arg} = `}x^{${num(k)}} = ${base}^{${num(L)} \\cdot ${paren(k)}} = ${base}^{${num(answer)}}$，它的对数是 $${num(answer)}$。`,
            ),
          ),
        });
      },
    },
  ],
};

export const combiningLawsOfLogarithms: TopicDef = {
  id: "combining-laws-of-logarithms",
  title: t("Combining the Laws of Logarithms", "综合运用对数运算法则"),
  summary: t(
    "Combine the product, quotient and power rules to condense, evaluate and expand logarithmic expressions.",
    "综合运用积、商、幂的法则，合并、计算和展开对数式。",
  ),
  prerequisites: ["quotient-rule-for-logarithms", "power-rule-for-logarithms"],
  encompasses: [
    { topic: "quotient-rule-for-logarithms", weight: 0.5 },
    { topic: "power-rule-for-logarithms", weight: 0.5 },
    { topic: "product-rule-for-logarithms", weight: 0.4 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.LE.A.4"],
  intro: t(
    `We now have three laws, one for each way of building a number:

$$\\log_{b} (MN) = \\log_{b} M + \\log_{b} N, \\qquad \\log_{b} \\frac{M}{N} = \\log_{b} M - \\log_{b} N, \\qquad \\log_{b} M^{k} = k \\log_{b} M.$$

Together they work in both directions. Condensing, take $2 \\log_{2} 6 - \\log_{2} 9$: the coefficient goes into the argument first, $\\log_{2} 36 - \\log_{2} 9$, and then the difference becomes a quotient, $\\log_{2} \\frac{36}{9} = \\log_{2} 4 = 2$. Expanding, take $\\log_{2} (8x^{3})$: the product splits, $\\log_{2} 8 + \\log_{2} x^{3}$, and the exponent comes out, $3 + 3 \\log_{2} x$.

In this lesson we combine all three laws to condense expressions into one logarithm, evaluate them, and expand logarithms into simple pieces.`,
    `现在我们有三条法则，分别对应构成一个数的三种方式：

$$\\log_{b} (MN) = \\log_{b} M + \\log_{b} N, \\qquad \\log_{b} \\frac{M}{N} = \\log_{b} M - \\log_{b} N, \\qquad \\log_{b} M^{k} = k \\log_{b} M$$

它们合在一起，两个方向都能用。合并时，看 $2 \\log_{2} 6 - \\log_{2} 9$：先把系数移到真数里，得 $\\log_{2} 36 - \\log_{2} 9$，再把差变成商，$\\log_{2} \\frac{36}{9} = \\log_{2} 4 = 2$。展开时，看 $\\log_{2} (8x^{3})$：先拆开积，得 $\\log_{2} 8 + \\log_{2} x^{3}$，再把指数提出来，得 $3 + 3 \\log_{2} x$。

这节课我们综合运用这三条法则，把式子合并成一个对数、求出它们的值，以及把对数展开成简单的部分。`,
  ),
  knowledgePoints: [
    {
      id: "condensing-expressions",
      title: t("Condensing into one logarithm", "合并成一个对数"),
      explanation: t(
        `The product and quotient rules combine only logarithms with coefficient $1$: $\\log_{b} M + \\log_{b} N$ becomes $\\log_{b} (MN)$, but $2 \\log_{b} M + \\log_{b} N$ does not become $\\log_{b} (2MN)$. So the power rule goes first and moves every coefficient into its argument as an exponent. Then every added logarithm puts its argument in the numerator and every subtracted one puts its argument in the denominator.

Take $2 \\log_{3} 5 + \\log_{3} 4 - \\log_{3} 10$. The coefficient first: $2 \\log_{3} 5 = \\log_{3} 25$. Then combine and simplify:

$$\\log_{3} 25 + \\log_{3} 4 - \\log_{3} 10 = \\log_{3} \\frac{25 \\cdot 4}{10} = \\log_{3} 10.$$

> **Watch out.** A coefficient becomes an exponent, not a factor: $2 \\log_{3} 5$ is $\\log_{3} 25$, not $\\log_{3} 10$. Logarithms combine into products and quotients of their arguments, never into sums and differences such as $\\log_{3} (25 + 4 - 10)$. And the subtracted argument goes in the denominator, not into the product.`,
        `积和商的法则只能合并系数为 $1$ 的对数：$\\log_{b} M + \\log_{b} N$ 可以变成 $\\log_{b} (MN)$，但 $2 \\log_{b} M + \\log_{b} N$ 不能变成 $\\log_{b} (2MN)$。所以先用幂的法则，把每个系数移到真数上作指数。然后，加上的对数的真数放在分子，减去的对数的真数放在分母。

看 $2 \\log_{3} 5 + \\log_{3} 4 - \\log_{3} 10$。先处理系数：$2 \\log_{3} 5 = \\log_{3} 25$。再合并、约分：

$$\\log_{3} 25 + \\log_{3} 4 - \\log_{3} 10 = \\log_{3} \\frac{25 \\cdot 4}{10} = \\log_{3} 10$$

> **注意。** 系数变成指数，而不是因数：$2 \\log_{3} 5$ 是 $\\log_{3} 25$，不是 $\\log_{3} 10$。对数合并成真数的积和商，绝不是像 $\\log_{3} (25 + 4 - 10)$ 那样的和与差。减去的对数的真数放在分母，不能乘进分子。`,
      ),
      generate(rng) {
        const base = anyBase(rng);
        const k = rng.int(2, 3);
        const M = rng.int(2, k === 2 ? 9 : 5);
        const N = rng.pick([2, 3, 5, 6, 7, 10]);
        const P = rng.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]);
        const answer = Q.of(M ** k * N, P);
        const expr = `${k}${base.of(String(M))} + ${base.of(String(N))} - ${base.of(String(P))}`;
        return prefixed(
          {
            prompt: t(`Write $${expr}$ as a single logarithm.`, `把 $${expr}$ 写成一个对数。`),
            answer,
            wrong: [Q.of(k * M * N, P), Q.of(M ** k + N - P), Q.of(M ** k * N * P), Q.of(k * M + N - P)],
            solution: walked(
              [
                [
                  ["Move the coefficient into the argument", "把系数移到真数上"],
                  t(
                    `The product and quotient rules need coefficient $1$, so the power rule goes first: $${k}${base.of(String(M))} = ${base.of(`${M}^{${k}}`)} = ${base.of(String(M ** k))}$.`,
                    `积和商的法则要求系数为 $1$，所以先用幂的法则：$${k}${base.of(String(M))} = ${base.of(`${M}^{${k}}`)} = ${base.of(String(M ** k))}$。`,
                  ),
                  [`${expr} = ${base.of(String(M ** k))} + ${base.of(String(N))} - ${base.of(String(P))}`],
                ],
                [
                  ["Combine", "合并"],
                  gcd(M ** k * N, P) > 1
                    ? t(
                        "The added logarithms put their arguments in the numerator and the subtracted one puts its argument in the denominator; then simplify:",
                        "加上的对数的真数放在分子，减去的对数的真数放在分母，再约分：",
                      )
                    : t(
                        "The added logarithms put their arguments in the numerator and the subtracted one puts its argument in the denominator:",
                        "加上的对数的真数放在分子，减去的对数的真数放在分母：",
                      ),
                  [chain(base.of(`\\frac{${M ** k} \\cdot ${N}}{${P}}`), base.of(num(answer)))],
                ],
              ],
              t(
                `With a calculator, $${expr} \\approx ${k} \\cdot ${approxLog(base, M)} + ${approxLog(base, N)} - ${approxLog(base, P)} = ${dec(approxLogQ(base, M).mul(Q.of(k)).add(approxLogQ(base, N)).sub(approxLogQ(base, P)))}$ and $${base.of(num(answer))} \\approx ${approxLog(base, (M ** k * N) / P)}$: equal up to rounding.`,
                `用计算器算得 $${expr} \\approx ${k} \\cdot ${approxLog(base, M)} + ${approxLog(base, N)} - ${approxLog(base, P)} = ${dec(approxLogQ(base, M).mul(Q.of(k)).add(approxLogQ(base, N)).sub(approxLogQ(base, P)))}$，而 $${base.of(num(answer))} \\approx ${approxLog(base, (M ** k * N) / P)}$：在误差范围内相等。`,
              ),
            ),
          },
          base.prefix,
        );
      },
    },
    {
      id: "evaluating-combinations",
      title: t("Evaluating combinations of logarithms", "计算对数的组合"),
      explanation: t(
        `Each logarithm in an expression can be an awkward decimal while the whole expression is a whole number: the decimals cancel once the arguments are combined. So instead of evaluating each logarithm, condense first, with coefficients into exponents and then sums into products and differences into quotients, and look for a power of the base.

Take $2 \\log_{6} 3 + \\log_{6} 4$. Neither $\\log_{6} 3$ nor $\\log_{6} 4$ is a nice number, but

$$2 \\log_{6} 3 + \\log_{6} 4 = \\log_{6} 9 + \\log_{6} 4 = \\log_{6} (9 \\cdot 4) = \\log_{6} 36 = 2,$$

since $6^{2} = 36$. A difference can give a fraction and a negative answer: $2 \\log_{2} 3 - \\log_{2} 36 = \\log_{2} \\frac{9}{36} = \\log_{2} \\frac{1}{4} = -2$.

> **Watch out.** The answer is the exponent, not the combined argument: $\\log_{6} 36$ is $2$, not $36$. A fraction below $1$ gives a negative logarithm, so do not drop the sign. And the coefficient still becomes a power first: $2 \\log_{6} 3$ is $\\log_{6} 9$, not $\\log_{6} 6$.`,
        `式子中每个对数单独看可能是不好算的小数，而整个式子却是整数：把真数合并后，小数部分互相抵消。所以不要逐个计算对数，而是先合并：系数移到指数上，和变成积，差变成商，再看结果是不是底数的幂。

看 $2 \\log_{6} 3 + \\log_{6} 4$。$\\log_{6} 3$ 和 $\\log_{6} 4$ 都不是简单的数，但

$$2 \\log_{6} 3 + \\log_{6} 4 = \\log_{6} 9 + \\log_{6} 4 = \\log_{6} (9 \\cdot 4) = \\log_{6} 36 = 2$$

因为 $6^{2} = 36$。差可能得到分数和负的答案：$2 \\log_{2} 3 - \\log_{2} 36 = \\log_{2} \\frac{9}{36} = \\log_{2} \\frac{1}{4} = -2$。

> **注意。** 答案是指数，不是合并后的真数：$\\log_{6} 36$ 是 $2$，不是 $36$。小于 $1$ 的分数的对数是负数，不要丢掉负号。系数仍然要先变成指数：$2 \\log_{6} 3$ 是 $\\log_{6} 9$，不是 $\\log_{6} 6$。`,
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 5, 6, 10, 12, 15]);
          const c = rng.int(-2, 3);
          const M = rng.int(2, 6);
          const k = rng.int(2, 3);
          if (qlog(Q.of(b), Q.of(M))) continue;
          const Mk = M ** k;
          const target = Q.of(b).pow(c);
          const plus = rng.bool();
          const other = plus ? target.div(Q.of(Mk)) : Q.of(Mk).div(target);
          if (!other.isInteger() || other.cmp(Q.one) <= 0 || other.n > 500n || qlog(Q.of(b), other)) continue;
          const base = b === 10 && rng.bool() ? tenBase : numberBase(b);
          const expr = `${k}${base.of(String(M))} ${plus ? "+" : "-"} ${base.of(num(other))}`;
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
            answer: c,
            wrong: [c + 1, ...(c !== 0 ? [-c] : []), num(target) === String(c) ? 0 : target],
            solution: walked(
              [
                [
                  ["Move the coefficient into the argument", "把系数移到真数上"],
                  t(
                    `The power rule makes $${k}$ an exponent: $${M}^{${k}} = ${Mk}$.`,
                    `幂的法则把 $${k}$ 变成指数：$${M}^{${k}} = ${Mk}$。`,
                  ),
                  [`${expr} = ${base.of(String(Mk))} ${plus ? "+" : "-"} ${base.of(num(other))}`],
                ],
                [
                  ["Combine", "合并"],
                  plus
                    ? t("A sum of logarithms is the logarithm of the product:", "对数的和是积的对数：")
                    : t(
                        "A difference of logarithms is the logarithm of the quotient, first argument on top:",
                        "对数的差是商的对数，第一个真数作分子：",
                      ),
                  [
                    `${base.of(String(Mk))} ${plus ? "+" : "-"} ${base.of(num(other))} = ${base.of(plus ? `${Mk} \\cdot ${num(other)}` : `\\frac{${Mk}}{${num(other)}}`)} = ${base.of(num(target))}`,
                  ],
                ],
                [
                  ["Evaluate", "求值"],
                  t(
                    `$${powerValue(Q.of(b), Q.of(c))}$, so the logarithm is $${c}$:`,
                    `$${powerValue(Q.of(b), Q.of(c))}$，所以这个对数是 $${c}$：`,
                  ),
                  [`${base.of(num(target))} = ${c}`],
                ],
              ],
              t(
                `With a calculator, $${expr} \\approx ${k} \\cdot ${approxLog(base, M)} ${plus ? "+" : "-"} ${approxLog(base, Number(other.n))} = ${dec(
                  approxLogQ(base, M)
                    .mul(Q.of(k))
                    .add(approxLogQ(base, Number(other.n)).mul(Q.of(plus ? 1 : -1))),
                )}$, which is $${c}$ up to rounding.`,
                `用计算器算得 $${expr} \\approx ${k} \\cdot ${approxLog(base, M)} ${plus ? "+" : "-"} ${approxLog(base, Number(other.n))} = ${dec(
                  approxLogQ(base, M)
                    .mul(Q.of(k))
                    .add(approxLogQ(base, Number(other.n)).mul(Q.of(plus ? 1 : -1))),
                )}$，在误差范围内等于 $${c}$。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "in-terms-of-given-logarithms",
      title: t("Writing logarithms in terms of given ones", "用已知对数表示"),
      explanation: t(
        `Every number made from $2$ and $3$ by multiplying, dividing and raising to powers is a product of powers, $2^{i} 3^{j}$. The product rule splits it into $\\log_{b} 2^{i} + \\log_{b} 3^{j}$, and the power rule brings the exponents out: $i \\log_{b} 2 + j \\log_{b} 3$. So if $\\log_{b} 2 = p$ and $\\log_{b} 3 = q$, its logarithm is $ip + jq$. Division gives negative exponents, and a factor of $b$ itself adds $\\log_{b} b = 1$.

Take $\\log_{b} \\frac{9}{4}$. Factor: $\\frac{9}{4} = 2^{-2} \\cdot 3^{2}$. Expand:

$$\\log_{b} \\frac{9}{4} = -2 \\log_{b} 2 + 2 \\log_{b} 3 = -2p + 2q.$$

> **Watch out.** Each exponent belongs to its own prime: $\\frac{9}{4}$ gives $-2p + 2q$, not $2p - 2q$. The exponents multiply $p$ and $q$; the numbers themselves do not ($\\log_{b} 9$ is $2q$, not $9q$). The logarithm of a product is a sum, not a product such as $pq$, and a factor of $b$ must not be forgotten.`,
        `由 $2$ 和 $3$ 经过乘、除、乘方得到的数，都是幂的积 $2^{i} 3^{j}$。积的法则把它拆成 $\\log_{b} 2^{i} + \\log_{b} 3^{j}$，幂的法则再把指数提出来：$i \\log_{b} 2 + j \\log_{b} 3$。所以若 $\\log_{b} 2 = p$，$\\log_{b} 3 = q$，它的对数就是 $ip + jq$。除法对应负指数，因数 $b$ 本身贡献 $\\log_{b} b = 1$。

看 $\\log_{b} \\frac{9}{4}$。分解：$\\frac{9}{4} = 2^{-2} \\cdot 3^{2}$。展开：

$$\\log_{b} \\frac{9}{4} = -2 \\log_{b} 2 + 2 \\log_{b} 3 = -2p + 2q$$

> **注意。** 每个指数属于它自己的质数：$\\frac{9}{4}$ 得 $-2p + 2q$，不是 $2p - 2q$。乘 $p$ 和 $q$ 的是指数，不是这些数本身（$\\log_{b} 9$ 是 $2q$，不是 $9q$）。积的对数是和，不是 $pq$ 这样的积；也不要漏掉因数 $b$。`,
      ),
      generate(rng) {
        const [P, R] = rng.pick([
          [2, 3],
          [2, 5],
          [3, 5],
          [2, 7],
        ] as const);
        for (;;) {
          const i = rng.int(-2, 4);
          const j = rng.int(-2, 3);
          const withB = rng.bool(0.25);
          if (i === 0 || j === 0 || (i === 1 && j === 1 && !withB)) continue;
          const value = Q.of(P).pow(i).mul(Q.of(R).pow(j));
          if (value.n > 500n || value.d > 500n) continue;
          const arg = withB
            ? `${value.isInteger() ? num(value) : `\\frac{${value.n}b}{${value.d}}`}${value.isInteger() ? "b" : ""}`
            : num(value);
          const answer = poly([i, "p"], [j, "q"], [withB ? 1 : 0, ""]);
          const pw = (n: number, e: number) => (e === 1 ? String(n) : `${n}^{${e}}`);
          const factored = `${pw(P, i)} \\cdot ${pw(R, j)}${withB ? " \\cdot b" : ""}`;
          return expressionProblem({
            prompt: t(
              `Let $${logL("b", String(P))} = p$ and $${logL("b", String(R))} = q$. Write $${logL("b", arg)}$ in terms of $p$ and $q$.`,
              `设 $${logL("b", String(P))} = p$，$${logL("b", String(R))} = q$。用 $p$ 和 $q$ 表示 $${logL("b", arg)}$。`,
            ),
            answer,
            simplified: true,
            wrong: [
              poly([j, "p"], [i, "q"], [withB ? 1 : 0, ""]),
              poly([i * j, "pq"], [withB ? 1 : 0, ""]),
              poly([i, "p"], [j, "q"]),
              poly([P ** Math.abs(i), "p"], [R ** Math.abs(j), "q"]),
            ],
            solution: walked(
              [
                [
                  ["Factor the argument", "分解真数"],
                  t(
                    `Write $${arg}$ as a product of powers of $${P}$ and $${R}$${withB ? " and $b$" : ""}, with negative exponents for factors in a denominator:`,
                    `把 $${arg}$ 写成 $${P}$ 与 $${R}$${withB ? "以及 $b$" : ""} 的幂的积，分母中的因数用负指数：`,
                  ),
                  [`${arg} = ${factored}`],
                ],
                [
                  ["Expand", "展开"],
                  t(
                    "The product rule splits the product into a sum, and the power rule brings each exponent in front:",
                    "积的法则把积拆成和，幂的法则把每个指数提到前面：",
                  ),
                  [
                    `${logL("b", arg)} = \\log_{b} ${pw(P, i)} + \\log_{b} ${pw(R, j)}${withB ? " + \\log_{b} b" : ""}`,
                    `= ${coefL(i)}${logL("b", String(P))} ${j < 0 ? "-" : "+"} ${coefL(Math.abs(j))}${logL("b", String(R))}${withB ? ` + ${logL("b", "b")}` : ""}`,
                  ],
                ],
                [
                  ["Substitute", "代入"],
                  withB
                    ? t(
                        `Replace $${logL("b", String(P))}$ by $p$, $${logL("b", String(R))}$ by $q$, and $${logL("b", "b")}$ by $1$:`,
                        `用 $p$ 代替 $${logL("b", String(P))}$，用 $q$ 代替 $${logL("b", String(R))}$，用 $1$ 代替 $${logL("b", "b")}$：`,
                      )
                    : t(
                        `Replace $${logL("b", String(P))}$ by $p$ and $${logL("b", String(R))}$ by $q$:`,
                        `用 $p$ 代替 $${logL("b", String(P))}$，用 $q$ 代替 $${logL("b", String(R))}$：`,
                      ),
                  [`${logL("b", arg)} = ${answer}`],
                ],
              ],
              t(
                `Try base $10$: $p = ${lgL(String(P))} \\approx ${approxLog(tenBase, P)}$ and $q = ${lgL(String(R))} \\approx ${approxLog(tenBase, R)}$, so $${answer} \\approx ${dec(
                  approxLogQ(tenBase, P)
                    .mul(Q.of(i))
                    .add(approxLogQ(tenBase, R).mul(Q.of(j)))
                    .add(Q.of(withB ? 1 : 0)),
                )}$, and $${lgL(num(value.mul(Q.of(withB ? 10 : 1))))} \\approx ${approxLog(tenBase, (Number(value.n) / Number(value.d)) * (withB ? 10 : 1))}$: equal up to rounding.`,
                `取底数 $10$ 试一试：$p = ${lgL(String(P))} \\approx ${approxLog(tenBase, P)}$，$q = ${lgL(String(R))} \\approx ${approxLog(tenBase, R)}$，所以 $${answer} \\approx ${dec(
                  approxLogQ(tenBase, P)
                    .mul(Q.of(i))
                    .add(approxLogQ(tenBase, R).mul(Q.of(j)))
                    .add(Q.of(withB ? 1 : 0)),
                )}$，而 $${lgL(num(value.mul(Q.of(withB ? 10 : 1))))} \\approx ${approxLog(tenBase, (Number(value.n) / Number(value.d)) * (withB ? 10 : 1))}$：在误差范围内相等。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "expanding-expressions",
      title: t("Expanding into simple logarithms", "展开成简单的对数"),
      explanation: t(
        `Expanding undoes condensing, so the laws run in the opposite order: first split the argument, with factors on top added and factors in the denominator subtracted, then bring each exponent in front with the power rule. A root is a fractional power, $\\sqrt[3]{y} = y^{\\frac{1}{3}}$.

Take $\\log_{b} \\frac{x \\sqrt[3]{y}}{z^{2}}$, with $A = \\log_{b} x$, $B = \\log_{b} y$ and $C = \\log_{b} z$. Split, then bring out the exponents:

$$\\log_{b} \\frac{x \\sqrt[3]{y}}{z^{2}} = \\log_{b} x + \\log_{b} y^{\\frac{1}{3}} - \\log_{b} z^{2} = A + \\frac{1}{3} B - 2C.$$

> **Watch out.** A factor in the denominator is subtracted: $-2C$, not $+2C$. Exponents stay as coefficients; dropping them gives $A + B - C$. A cube root is the power $\\frac{1}{3}$, not $3$. And every exponent multiplies a logarithm: $-2C$, not a loose $-2$.`,
        `展开是合并的逆过程，所以法则的使用顺序相反：先拆开真数，分子上的因数相加，分母上的因数相减；再用幂的法则把每个指数提到前面。根式是分数指数幂，$\\sqrt[3]{y} = y^{\\frac{1}{3}}$。

看 $\\log_{b} \\frac{x \\sqrt[3]{y}}{z^{2}}$，设 $A = \\log_{b} x$，$B = \\log_{b} y$，$C = \\log_{b} z$。先拆开，再提出指数：

$$\\log_{b} \\frac{x \\sqrt[3]{y}}{z^{2}} = \\log_{b} x + \\log_{b} y^{\\frac{1}{3}} - \\log_{b} z^{2} = A + \\frac{1}{3} B - 2C$$

> **注意。** 分母上的因数要减去：是 $-2C$，不是 $+2C$。指数要保留为系数，丢掉它们就得到 $A + B - C$。立方根是 $\\frac{1}{3}$ 次幂，不是 $3$ 次幂。每个指数都乘在对数上：是 $-2C$，不是单独的 $-2$。`,
      ),
      generate(rng) {
        const i = rng.int(1, 5);
        const yRoot = rng.bool(0.4);
        const j = yRoot ? Q.of(1, rng.int(2, 3)) : Q.of(rng.int(1, 4));
        const k = rng.int(1, 4);
        const pw = (v: string, e: number) => (e === 1 ? v : `${v}^{${e}}`);
        const yPart = yRoot ? `\\sqrt${j.d === 2n ? "" : "[3]"}{y}` : pw("y", Number(j.n));
        const zTop = rng.bool(0.3);
        const top = `${pw("x", i)}${yPart}${zTop ? pw("z", k) : ""}`;
        const arg = zTop ? top : `\\frac{${top}}{${pw("z", k)}}`;
        const sk = zTop ? k : -k;
        const answer = poly([i, "A"], [j, "B"], [sk, "C"]);
        return expressionProblem({
          prompt: t(
            `Let $A = ${logL("b", "x")}$, $B = ${logL("b", "y")}$ and $C = ${logL("b", "z")}$. Write $${logL("b", arg)}$ in terms of $A$, $B$ and $C$.`,
            `设 $A = ${logL("b", "x")}$，$B = ${logL("b", "y")}$，$C = ${logL("b", "z")}$。用 $A$、$B$、$C$ 表示 $${logL("b", arg)}$。`,
          ),
          answer,
          simplified: true,
          wrong: [
            poly([i, "A"], [j, "B"], [-sk, "C"]),
            poly([1, "A"], [1, "B"], [sk > 0 ? 1 : -1, "C"]),
            ...(yRoot ? [poly([i, "A"], [Number(j.d), "B"], [sk, "C"])] : []),
            poly([i, "A"], [j, "B"], [sk, ""]),
          ],
          solution: walked(
            [
              [
                ["Split the argument", "拆开真数"],
                zTop
                  ? t("The argument is a product, so its logarithm is a sum:", "真数是积，所以它的对数是和：")
                  : t("Factors on top are added and the factor in the denominator is subtracted:", "分子上的因数相加，分母上的因数相减："),
                [`${logL("b", arg)} = \\log_{b} ${pw("x", i)} + \\log_{b} ${yPart} ${zTop ? "+" : "-"} \\log_{b} ${pw("z", k)}`],
              ],
              [
                ["Bring the exponents in front", "把指数提到前面"],
                yRoot
                  ? t(
                      `The root is the power $${yPart} = y^{${num(j)}}$; the power rule brings every exponent in front:`,
                      `根式是幂 $${yPart} = y^{${num(j)}}$；幂的法则把每个指数提到前面：`,
                    )
                  : t("The power rule brings every exponent in front:", "幂的法则把每个指数提到前面："),
                [
                  `= ${coefL(i)}${logL("b", "x")} + ${coefL(j)}${logL("b", "y")} ${sk > 0 ? "+" : "-"} ${coefL(k)}${logL("b", "z")}`,
                  `= ${answer}`,
                ],
              ],
            ],
            t(
              `Try $x = b$, $y = ${yRoot ? `b^{${j.d}}` : "b"}$ and $z = b$, so that $A = 1$, $B = ${yRoot ? j.d : 1}$ and $C = 1$. The argument is $b^{${i}} \\cdot b^{${yRoot ? 1 : num(j)}} ${zTop ? "\\cdot" : "\\div"} b^{${k}} = b^{${i + (yRoot ? 1 : Number(j.n)) + sk}}$, with logarithm $${i + (yRoot ? 1 : Number(j.n)) + sk}$, and the expansion gives $${i} + ${num(j)} \\cdot ${yRoot ? j.d : 1} ${sk > 0 ? "+" : "-"} ${k} = ${i + (yRoot ? 1 : Number(j.n)) + sk}$.`,
              `取 $x = b$，$y = ${yRoot ? `b^{${j.d}}` : "b"}$，$z = b$，则 $A = 1$，$B = ${yRoot ? j.d : 1}$，$C = 1$。真数是 $b^{${i}} \\cdot b^{${yRoot ? 1 : num(j)}} ${zTop ? "\\cdot" : "\\div"} b^{${k}} = b^{${i + (yRoot ? 1 : Number(j.n)) + sk}}$，它的对数是 $${i + (yRoot ? 1 : Number(j.n)) + sk}$；展开式给出 $${i} + ${num(j)} \\cdot ${yRoot ? j.d : 1} ${sk > 0 ? "+" : "-"} ${k} = ${i + (yRoot ? 1 : Number(j.n)) + sk}$。`,
            ),
          ),
        });
      },
    },
  ],
  diagnostic: "condensing-expressions",
};

/** lnTable writes the given approximations of natural logarithms: "\ln 2 \approx 0.6931". */
const lnGiven = (...ns: readonly number[]) => ns.map((n) => `${lnL(String(n))} \\approx ${dec(lnQ(n))}`).join(", \\quad ");

export const changeOfBaseFormula: TopicDef = {
  id: "change-of-base-formula",
  title: t("The Change of Base Formula for Logarithms", "对数的换底公式"),
  summary: t(
    "Rewrite $\\log_{a} x$ as $\\frac{\\log_{b} x}{\\log_{b} a}$ to evaluate products of logarithms and approximate any logarithm with natural logarithms.",
    "把 $\\log_{a} x$ 写成 $\\frac{\\log_{b} x}{\\log_{b} a}$，计算对数的积，并用自然对数求任意对数的近似值。",
  ),
  prerequisites: ["combining-laws-of-logarithms"],
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.4"],
  intro: t(
    `A calculator has keys for only two logarithms, $\\log$ and $\\ln$. To find a logarithm to any other base, we rewrite it in a base we can use. Take $\\log_{8} 32$, and call it $c$, so that $8^{c} = 32$. Both numbers are powers of $2$, so take $\\log_{2}$ of both sides and use the power rule:

$$c \\log_{2} 8 = \\log_{2} 32, \\qquad c = \\frac{\\log_{2} 32}{\\log_{2} 8} = \\frac{5}{3}.$$

Nothing here depended on $2$: for any base $b$,

$$\\log_{a} x = \\frac{\\log_{b} x}{\\log_{b} a}.$$

In this lesson we use this **change of base formula** to rewrite logarithms, to evaluate products of logarithms, and to approximate any logarithm with natural logarithms.`,
    `计算器上只有两种对数的键：$\\log$ 和 $\\ln$。要求其他底数的对数，就要把它改写成能用的底数。看 $\\log_{8} 32$，记它为 $c$，则 $8^{c} = 32$。两个数都是 $2$ 的幂，所以两边取 $\\log_{2}$，再用幂的法则：

$$c \\log_{2} 8 = \\log_{2} 32, \\qquad c = \\frac{\\log_{2} 32}{\\log_{2} 8} = \\frac{5}{3}$$

这里并不依赖于 $2$：对任意底数 $b$，

$$\\log_{a} x = \\frac{\\log_{b} x}{\\log_{b} a}$$

这节课我们用这个**换底公式**改写对数、计算对数的积，并用自然对数求任意对数的近似值。`,
  ),
  knowledgePoints: [
    {
      id: "writing-the-change-of-base",
      title: t("The change of base formula", "换底公式"),
      explanation: t(
        `Why the formula holds: let $c = \\log_{a} x$, so $a^{c} = x$. Take $\\log_{b}$ of both sides, for any base $b$, and use the power rule: $c \\log_{b} a = \\log_{b} x$. Dividing by $\\log_{b} a$ gives

$$\\log_{a} x = \\frac{\\log_{b} x}{\\log_{b} a}.$$

The argument goes on top and the old base at the bottom. Take $\\log_{7} 20$. With natural logarithms it is $\\frac{\\ln 20}{\\ln 7}$, and with common logarithms $\\frac{\\log 20}{\\log 7}$; both are about $1.54$, which fits, since $7 < 20 < 49$ puts $\\log_{7} 20$ between $1$ and $2$.

> **Watch out.** Do not turn the fraction upside down: $\\frac{\\ln 7}{\\ln 20}$ is $\\log_{20} 7$. A quotient of logarithms is not the logarithm of a quotient, $\\ln \\frac{20}{7}$, and not a difference, $\\ln 20 - \\ln 7$. The old base goes through the logarithm too: the bottom is $\\ln 7$, not $7$.`,
        `公式成立的原因：设 $c = \\log_{a} x$，则 $a^{c} = x$。两边取任意底数 $b$ 的对数 $\\log_{b}$，用幂的法则得 $c \\log_{b} a = \\log_{b} x$。两边除以 $\\log_{b} a$，得

$$\\log_{a} x = \\frac{\\log_{b} x}{\\log_{b} a}$$

真数在分子，原来的底数在分母。看 $\\log_{7} 20$。用自然对数是 $\\frac{\\ln 20}{\\ln 7}$，用常用对数是 $\\frac{\\log 20}{\\log 7}$；两者都约等于 $1.54$。这是合理的，因为 $7 < 20 < 49$，所以 $\\log_{7} 20$ 在 $1$ 和 $2$ 之间。

> **注意。** 分数不要上下颠倒：$\\frac{\\ln 7}{\\ln 20}$ 是 $\\log_{20} 7$。对数的商不是商的对数 $\\ln \\frac{20}{7}$，也不是差 $\\ln 20 - \\ln 7$。原来的底数也要取对数：分母是 $\\ln 7$，不是 $7$。`,
      ),
      generate(rng) {
        const [a, x] = rng.sample([2, 3, 5, 6, 7, 11, 12, 13, 15, 17, 19, 20, 30], 2) as [number, number];
        const useLn = rng.bool();
        const L = (v: number) => (useLn ? lnL(String(v)) : lgL(String(v)));
        const frac = (p: string, q: string) => `\\frac{${p}}{${q}}`;
        const n = Math.floor(Math.log(x) / Math.log(a) + 1e-9);
        const name = useLn ? t("natural", "自然") : t("common", "常用");
        return reasoned(
          oneOf(rng, {
            prompt: t(`Which expression equals $${logL(a, String(x))}$?`, `下列哪个式子等于 $${logL(a, String(x))}$？`),
            right: m(frac(L(x), L(a))),
            wrong: [
              m(frac(L(a), L(x))),
              m(useLn ? lnL(frac(String(x), String(a))) : lgL(frac(String(x), String(a)))),
              m(`${L(x)} - ${L(a)}`),
              m(frac(L(x), String(a))),
            ],
            solution: walked(
              [
                [
                  ["Name the exponent", "设出指数"],
                  t(
                    `Call the logarithm $c$, so $c = ${logL(a, String(x))}$ means $${a}^{c} = ${x}$.`,
                    `把这个对数记为 $c$，$c = ${logL(a, String(x))}$ 表示 $${a}^{c} = ${x}$。`,
                  ),
                ],
                [
                  ["Take logarithms of both sides", "两边取对数"],
                  t(
                    `Take the ${name.en} logarithm of both sides; the power rule brings $c$ in front:`,
                    `两边取${name["zh-CN"]}对数，幂的法则把 $c$ 提到前面：`,
                  ),
                  [`c ${L(a)} = ${L(x)}`],
                ],
                [
                  ["Divide", "相除"],
                  t(
                    `Divide by $${L(a)}$: so the argument ends up on top and the old base at the bottom:`,
                    `两边除以 $${L(a)}$：于是真数在分子，原来的底数在分母：`,
                  ),
                  [`${logL(a, String(x))} = c = ${frac(L(x), L(a))}`],
                ],
              ],
              t(
                `A calculator gives $${frac(L(x), L(a))} \\approx ${dec(approx(Math.log(x) / Math.log(a), 2))}$. Since $${a}^{${n}} = ${a ** n} < ${x} < ${a ** (n + 1)} = ${a}^{${n + 1}}$, $${logL(a, String(x))}$ must lie between $${n}$ and $${n + 1}$, and it does.`,
                `用计算器算得 $${frac(L(x), L(a))} \\approx ${dec(approx(Math.log(x) / Math.log(a), 2))}$。因为 $${a}^{${n}} = ${a ** n} < ${x} < ${a ** (n + 1)} = ${a}^{${n + 1}}$，$${logL(a, String(x))}$ 一定在 $${n}$ 和 $${n + 1}$ 之间，确实如此。`,
              ),
            ),
          }),
          [
            [
              m(frac(L(a), L(x))).en,
              "This is upside down: the argument goes on top and the old base on the bottom.",
              "上下颠倒了：真数在分子，原来的底数在分母。",
            ],
            [
              m(useLn ? lnL(frac(String(x), String(a))) : lgL(frac(String(x), String(a)))).en,
              "A logarithm of a quotient is a difference of logarithms, and it is not this quotient of logarithms.",
              "商的对数等于对数的差，并不等于这里的对数之商。",
            ],
            [
              m(`${L(x)} - ${L(a)}`).en,
              "A difference of logarithms is the logarithm of a quotient: change of base divides the logarithms.",
              "对数的差是商的对数：换底公式是把两个对数相除。",
            ],
            [
              m(frac(L(x), String(a))).en,
              "The old base must also go through the logarithm: the bottom is its logarithm, not the base itself.",
              "原来的底数也要取对数：分母是它的对数，不是底数本身。",
            ],
          ],
        );
      },
    },
    {
      id: "products-of-logarithms",
      title: t("Products of logarithms", "对数的积"),
      explanation: t(
        `In a product such as $\\log_{a} m \\cdot \\log_{m} c$, the argument of the first logarithm is the base of the second. Write both with natural logarithms: the first is $\\frac{\\ln m}{\\ln a}$ and the second is $\\frac{\\ln c}{\\ln m}$, so $\\ln m$ cancels and

$$\\log_{a} m \\cdot \\log_{m} c = \\frac{\\ln m}{\\ln a} \\cdot \\frac{\\ln c}{\\ln m} = \\frac{\\ln c}{\\ln a} = \\log_{a} c.$$

Take $\\log_{4} 7 \\cdot \\log_{7} 32$. The $7$ cancels, leaving $\\log_{4} 32$. Since $4 = 2^{2}$ and $32 = 2^{5}$, $\\log_{4} 32 = \\frac{5 \\ln 2}{2 \\ln 2} = \\frac{5}{2}$. In particular $\\log_{a} b \\cdot \\log_{b} a = 1$.

> **Watch out.** What remains is $\\log_{a} c$, the first base with the last argument, not $\\log_{c} a$: here $\\frac{5}{2}$, not $\\frac{2}{5}$. Divide the two exponents, $\\frac{5}{2}$, rather than giving only the exponent of $32$. And keep the sign when the last argument is a fraction below $1$.`,
        `在 $\\log_{a} m \\cdot \\log_{m} c$ 这样的积中，第一个对数的真数是第二个对数的底数。把两者都写成自然对数：第一个是 $\\frac{\\ln m}{\\ln a}$，第二个是 $\\frac{\\ln c}{\\ln m}$，于是 $\\ln m$ 约掉，

$$\\log_{a} m \\cdot \\log_{m} c = \\frac{\\ln m}{\\ln a} \\cdot \\frac{\\ln c}{\\ln m} = \\frac{\\ln c}{\\ln a} = \\log_{a} c$$

看 $\\log_{4} 7 \\cdot \\log_{7} 32$。$7$ 约掉，剩下 $\\log_{4} 32$。因为 $4 = 2^{2}$，$32 = 2^{5}$，所以 $\\log_{4} 32 = \\frac{5 \\ln 2}{2 \\ln 2} = \\frac{5}{2}$。特别地，$\\log_{a} b \\cdot \\log_{b} a = 1$。

> **注意。** 剩下的是 $\\log_{a} c$，即第一个底数和最后一个真数，不是 $\\log_{c} a$：这里是 $\\frac{5}{2}$，不是 $\\frac{2}{5}$。要把两个指数相除得 $\\frac{5}{2}$，而不是只写出 $32$ 的指数。最后的真数是小于 $1$ 的分数时，不要丢掉负号。`,
      ),
      generate(rng) {
        for (;;) {
          const { r, top } = rng.pick(rootFamilies);
          const p = rng.int(1, top);
          const q = rng.nonZero(-top, top + 2);
          const a = Q.of(r).pow(p);
          const c = Q.of(r).pow(q);
          if (c.n > 2000n || c.d > 2000n) continue;
          const mid = rng.pick([2, 3, 5, 6, 7, 10, 11]);
          if (qlog(Q.of(r), Q.of(mid))) continue;
          const answer = Q.of(q, p);
          const expr = `${logL(a, String(mid))} \\cdot ${logL(mid, num(c))}`;
          return numberProblem({
            prompt: t(`Evaluate $${expr}$.`, `求 $${expr}$ 的值。`),
            answer,
            wrong: [Q.of(p, q), Q.of(q), answer.neg()],
            solution: walked(
              [
                [
                  ["Change to natural logarithms", "换成自然对数"],
                  t(
                    `Write both factors with the change of base formula. The argument $${mid}$ of the first is the base of the second, so $${lnL(String(mid))}$ cancels:`,
                    `用换底公式改写两个因式。第一个的真数 $${mid}$ 是第二个的底数，所以 $${lnL(String(mid))}$ 约掉：`,
                  ),
                  [
                    chain(
                      expr,
                      `\\frac{${lnL(String(mid))}}{${lnL(num(a))}} \\cdot \\frac{${lnL(num(c))}}{${lnL(String(mid))}}`,
                      `\\frac{${lnL(num(c))}}{${lnL(num(a))}}`,
                      logL(a, num(c)),
                    ),
                  ],
                ],
                [
                  ["Evaluate", "求值"],
                  t(
                    `$${powerValue(a, answer)}$, so $${logL(a, num(c))} = ${num(answer)}$.`,
                    `$${powerValue(a, answer)}$，所以 $${logL(a, num(c))} = ${num(answer)}$。`,
                  ),
                ],
              ],
              t(
                `Write both numbers as powers of $${r}$: $${num(a)} = ${powL(r, p)}$ and $${num(c)} = ${powL(r, q)}$, so by the power rule $\\frac{${lnL(num(c))}}{${lnL(num(a))}} = \\frac{${q} ${lnL(String(r))}}{${p} ${lnL(String(r))}} = ${num(answer)}$.`,
                `把两个数都写成 $${r}$ 的幂：$${num(a)} = ${powL(r, p)}$，$${num(c)} = ${powL(r, q)}$，由幂的法则，$\\frac{${lnL(num(c))}}{${lnL(num(a))}} = \\frac{${q} ${lnL(String(r))}}{${p} ${lnL(String(r))}} = ${num(answer)}$。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "approximating-logarithms",
      title: t("Approximating logarithms", "求对数的近似值"),
      explanation: t(
        `A calculator has $\\ln$ and $\\log$ keys but usually no key for other bases, so the change of base formula turns any logarithm into a division of two values it can give:

$$\\log_{a} x = \\frac{\\ln x}{\\ln a}.$$

Take $\\log_{5} 40$. With $\\ln 40 \\approx 3.6889$ and $\\ln 5 \\approx 1.6094$, it is $\\frac{3.6889}{1.6094} \\approx 2.29$. A quick check: $5^{2} = 25 < 40 < 125 = 5^{3}$, so the answer must lie between $2$ and $3$.

> **Watch out.** The argument's logarithm goes on top: $\\frac{\\ln 5}{\\ln 40} \\approx 0.44$ is $\\log_{40} 5$. Divide the logarithms; do not subtract them ($3.6889 - 1.6094$), and do not divide the numbers themselves ($\\frac{40}{5} = 8$). Round only at the end.`,
        `计算器上有 $\\ln$ 键和 $\\log$ 键，但通常没有其他底数的键，所以换底公式把任何对数都变成两个能算出的值相除：

$$\\log_{a} x = \\frac{\\ln x}{\\ln a}$$

看 $\\log_{5} 40$。由 $\\ln 40 \\approx 3.6889$，$\\ln 5 \\approx 1.6094$，得 $\\frac{3.6889}{1.6094} \\approx 2.29$。检查：$5^{2} = 25 < 40 < 125 = 5^{3}$，所以答案一定在 $2$ 和 $3$ 之间。

> **注意。** 真数的对数在分子：$\\frac{\\ln 5}{\\ln 40} \\approx 0.44$ 是 $\\log_{40} 5$。要把两个对数相除，不要相减（$3.6889 - 1.6094$），也不要把两个数本身相除（$\\frac{40}{5} = 8$）。只在最后一步取近似。`,
      ),
      generate(rng) {
        for (;;) {
          const [a, x] = rng.sample([2, 3, 5, 6, 7, 11, 12, 13, 15, 17, 19, 20, 30, 50], 2) as [number, number];
          const v = lnQ(x).div(lnQ(a));
          const truth = Math.log(x) / Math.log(a);
          if (qlog(Q.of(a), Q.of(x)) || !stable(v, truth, 2)) continue;
          const n = Math.floor(truth + 1e-9);
          const answer = roundTo(v, 2);
          return numberProblem({
            prompt: t(
              `Use $${lnGiven(a, x)}$ to find $${logL(a, String(x))}$ to the nearest hundredth.`,
              `利用 $${lnGiven(a, x)}$，求 $${logL(a, String(x))}$ 的值（精确到百分位）。`,
            ),
            answer,
            form: "decimal",
            wrong: [roundTo(lnQ(a).div(lnQ(x)), 2), roundTo(lnQ(x).sub(lnQ(a)), 2), roundTo(Q.of(x, a), 2)],
            solution: walked(
              [
                [
                  ["Change to natural logarithms", "换成自然对数"],
                  t("The argument's logarithm goes on top and the base's at the bottom:", "真数的对数作分子，底数的对数作分母："),
                  [`${logL(a, String(x))} = \\frac{${lnL(String(x))}}{${lnL(String(a))}}`],
                ],
                [
                  ["Divide and round", "相除再取近似"],
                  t(
                    "Put in the given values, divide, and round to the nearest hundredth only at the end:",
                    "代入已知的值，相除，最后再精确到百分位：",
                  ),
                  [`\\frac{${lnL(String(x))}}{${lnL(String(a))}} \\approx \\frac{${dec(lnQ(x))}}{${dec(lnQ(a))}} \\approx ${dec(answer)}`],
                ],
              ],
              t(
                `Since $${a}^{${n}} = ${a ** n} < ${x} < ${a ** (n + 1)} = ${a}^{${n + 1}}$, $${logL(a, String(x))}$ must lie between $${n}$ and $${n + 1}$, and $${dec(answer)}$ does.`,
                `因为 $${a}^{${n}} = ${a ** n} < ${x} < ${a ** (n + 1)} = ${a}^{${n + 1}}$，$${logL(a, String(x))}$ 一定在 $${n}$ 和 $${n + 1}$ 之间，$${dec(answer)}$ 确实如此。`,
              ),
            ),
          });
        }
      },
    },
  ],
};

// Exponential equations.

/** cpoly writes a sum of terms like poly, with "\cdot" between a coefficient and a term that starts with a digit: "4^{x} - 6 \cdot 2^{x} + 8". */
function cpoly(...terms: readonly (readonly [Coefficient, string])[]): string {
  let out = "";
  for (const [c, v] of terms) {
    const k = toQ(c);
    if (k.isZero()) continue;
    const abs = k.abs();
    const body = v === "" ? abs.toLatex() : abs.eq(Q.one) ? v : `${abs.toLatex()}${/^\d/.test(v) ? " \\cdot " : ""}${v}`;
    out += out === "" ? (k.sign() < 0 ? `-${body}` : body) : k.sign() < 0 ? ` - ${body}` : ` + ${body}`;
  }
  return out === "" ? "0" : out;
}

/** nonPowerOf draws a whole number from 2 to max that is not a rational power of b. */
function nonPowerOf(rng: Rng, b: number, max = 30): number {
  for (;;) {
    const n = rng.int(2, max);
    if (!qlog(Q.of(b), Q.of(n))) return n;
  }
}

export const solvingExponentialEquationsUsingLogarithms: TopicDef = {
  id: "solving-exponential-equations-using-logarithms",
  title: t("Solving Exponential Equations Using Logarithms", "用对数解指数方程"),
  summary: t(
    "Solve equations such as $3 \\cdot 2^{x} = 15$ by isolating the power and taking a logarithm, exactly and approximately.",
    "把幂单独留在一边再取对数，精确地或近似地解 $3 \\cdot 2^{x} = 15$ 这样的方程。",
  ),
  prerequisites: ["change-of-base-formula"],
  encompasses: [
    { topic: "converting-between-exponential-and-logarithmic-form", weight: 0.3 },
    { topic: "change-of-base-formula", weight: 0.3 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.LE.A.4", "CCSS.HSA.REI.B.3"],
  intro: t(
    `Some exponential equations can be solved by writing both sides as powers of the same base: $2^{x} = 8$ gives $x = 3$. But $2^{x} = 10$ cannot, because $10$ is not a power of $2$: $2^{3} = 8$ is too small and $2^{4} = 16$ too big. The solution is still a definite number between $3$ and $4$, and it has a name: the exponent that turns $2$ into $10$ is $\\log_{2} 10$. So

$$2^{x} = 10 \\iff x = \\log_{2} 10 = \\frac{\\ln 10}{\\ln 2} \\approx 3.32.$$

In this lesson we solve exponential equations by isolating the power and taking a logarithm, write the exact solutions as logarithms, and approximate them with natural logarithms.`,
    `有些指数方程可以把两边写成同底数的幂来解：由 $2^{x} = 8$ 得 $x = 3$。但 $2^{x} = 10$ 不行，因为 $10$ 不是 $2$ 的幂：$2^{3} = 8$ 太小，$2^{4} = 16$ 太大。方程的解仍然是 $3$ 和 $4$ 之间一个确定的数，而且它有名字：把 $2$ 变成 $10$ 的指数就是 $\\log_{2} 10$。所以

$$2^{x} = 10 \\iff x = \\log_{2} 10 = \\frac{\\ln 10}{\\ln 2} \\approx 3.32$$

这节课我们把幂单独留在一边再取对数来解指数方程，用对数写出精确解，并用自然对数求近似解。`,
  ),
  knowledgePoints: [
    {
      id: "solution-as-a-logarithm",
      title: t("The solution as a logarithm", "用对数表示解"),
      explanation: t(
        `A logarithm is an exponent: $b^{x} = N$ means exactly $x = \\log_{b} N$. So once the power stands alone on one side, the solution can be read off as a logarithm. Anything else on that side, a coefficient or an added number, has to be removed first, in the reverse order of operations: undo the addition, then the multiplication.

Take $2 \\cdot 5^{x} - 3 = 11$. Add $3$ to both sides, $2 \\cdot 5^{x} = 14$, then divide by $2$:

$$5^{x} = 7 \\implies x = \\log_{5} 7.$$

This is the exact solution; it lies between $1$ and $2$, since $5 < 7 < 25$.

> **Watch out.** Take the logarithm only after the power is alone: $x = \\log_{5} 14$ forgets to divide by $2$, and $x = \\log_{5} 11$ ignores both steps. Undo the added number with the opposite operation: adding $3$ here, not subtracting it.`,
        `对数就是指数：$b^{x} = N$ 恰好表示 $x = \\log_{b} N$。所以一旦幂单独在一边，就能把解写成对数。这一边的其他部分，比如系数或加上的数，要先去掉，顺序与运算顺序相反：先消去加减，再消去乘除。

看 $2 \\cdot 5^{x} - 3 = 11$。两边加上 $3$，得 $2 \\cdot 5^{x} = 14$，再两边除以 $2$：

$$5^{x} = 7 \\implies x = \\log_{5} 7$$

这就是精确解；因为 $5 < 7 < 25$，它在 $1$ 和 $2$ 之间。

> **注意。** 幂单独在一边之后才能取对数：$x = \\log_{5} 14$ 忘了除以 $2$，$x = \\log_{5} 11$ 两步都没做。用相反的运算消去加上的数：这里是加上 $3$，不是减去 $3$。`,
      ),
      generate(rng) {
        const b = rng.int(2, 9);
        const N = nonPowerOf(rng, b, 20);
        const a = rng.int(1, 6);
        const c = rng.int(-12, 12);
        const d = a * N + c;
        const lhs = `${cpoly([a, `${b}^{x}`])}${plusK(c)}`;
        return prefixed(
          {
            prompt: t(`Solve $${lhs} = ${d}$. Write the exact solution as a logarithm.`, `解方程 $${lhs} = ${d}$，把精确解写成对数。`),
            answer: N,
            wrong: [d - c, Q.of(d, a), N + c, a * N],
            solution: walked(
              [
                ...(a === 1 && c === 0 ? [] : [isolate(a, c, d, `${b}^{x}`, ["Isolate the power", "把幂单独留在一边"])]),
                [
                  ["Convert to logarithmic form", "化为对数式"],
                  t(
                    `The solution is the exponent that turns $${b}$ into $${N}$, which is the logarithm:`,
                    `解就是把 $${b}$ 变成 $${N}$ 的指数，也就是对数：`,
                  ),
                  [`${b}^{x} = ${N} \\iff x = ${logL(b, String(N))}`],
                ],
              ],
              t(
                `Substitute: $${b}^{${logL(b, String(N))}} = ${N}$, so the left side is $${a === 1 ? "" : `${a} \\cdot `}${N}${plusK(c)} = ${d}$.`,
                `代入原方程：$${b}^{${logL(b, String(N))}} = ${N}$，所以左边是 $${a === 1 ? "" : `${a} \\cdot `}${N}${plusK(c)} = ${d}$。`,
              ),
            ),
          },
          `x = \\log_{${b}}`,
        );
      },
    },
    {
      id: "linear-exponents",
      title: t("Exponents with several terms", "指数是多项式"),
      explanation: t(
        `Converting to logarithmic form works whatever the exponent is: $b^{u} = N$ means $u = \\log_{b} N$, so when the exponent is an expression such as $2x + 1$, the whole expression equals the logarithm. What is left is a linear equation, with $\\log_{b} N$ playing the part of a number.

Take $3^{2x + 1} = 8$. Convert, then solve:

$$2x + 1 = \\log_{3} 8 \\implies 2x = \\log_{3} 8 - 1 \\implies x = \\frac{\\log_{3} 8 - 1}{2}.$$

> **Watch out.** The constant comes off the logarithm, not out of its argument: $\\log_{3} 8 - 1$, not $\\log_{3} 7$. Undo $+1$ by subtracting, not adding. Divide the whole right side by $2$, not only the logarithm. And the base stays the base: $\\log_{3} 8$, not $\\log_{8} 3$.`,
        `不论指数是什么，都可以化为对数式：$b^{u} = N$ 表示 $u = \\log_{b} N$，所以指数是 $2x + 1$ 这样的代数式时，整个代数式等于这个对数。剩下的是一个一次方程，$\\log_{b} N$ 在其中就像一个数。

看 $3^{2x + 1} = 8$。先化为对数式，再解方程：

$$2x + 1 = \\log_{3} 8 \\implies 2x = \\log_{3} 8 - 1 \\implies x = \\frac{\\log_{3} 8 - 1}{2}$$

> **注意。** 常数是从对数上减去，不是从真数里减去：是 $\\log_{3} 8 - 1$，不是 $\\log_{3} 7$。消去 $+1$ 要减，不是加。要把整个右边除以 $2$，不能只除对数。底数仍是底数：是 $\\log_{3} 8$，不是 $\\log_{8} 3$。`,
      ),
      generate(rng) {
        const b = rng.int(2, 9);
        const N = nonPowerOf(rng, b, 25);
        const k = rng.pick([1, 1, 2, 3, 4]);
        const h = rng.nonZero(-6, 6);
        const L = logL(b, String(N));
        const top = (s: number) => `${L}${plusK(-s)}`;
        const over = (s: string) => (k === 1 ? s : `\\frac{${s}}{${k}}`);
        const wrong = [
          `x = ${over(top(-h))}`,
          `x = ${over(`${logL(b, String(N - h))}`)}`,
          k === 1 ? `x = ${logL(N, String(b))}${plusK(-h)}` : `x = \\frac{${L}}{${k}}${plusK(-h)}`,
          `x = ${over(`${logL(N, String(b))}${plusK(-h)}`)}`,
        ];
        return reasoned(
          oneOf(rng, {
            prompt: t(`Solve $${b}^{${linear(k, h)}} = ${N}$.`, `解方程 $${b}^{${linear(k, h)}} = ${N}$。`),
            right: m(`x = ${over(top(h))}`),
            wrong: wrong.map(m),
            solution: walked(
              [
                [
                  ["Convert to logarithmic form", "化为对数式"],
                  t(
                    `The whole exponent $${linear(k, h)}$ is the power of $${b}$ that gives $${N}$, so it equals the logarithm:`,
                    `整个指数 $${linear(k, h)}$ 是使 $${b}$ 变成 $${N}$ 的指数，所以它等于这个对数：`,
                  ),
                  [`${linear(k, h)} = ${L}`],
                ],
                [
                  ["Solve for x", "解出 x"],
                  k === 1
                    ? t(
                        `${h > 0 ? `Subtract $${h}$ from` : `Add $${-h}$ to`} both sides:`,
                        `两边同时${h > 0 ? `减去 $${h}$` : `加上 $${-h}$`}：`,
                      )
                    : t(
                        `${h > 0 ? `Subtract $${h}$ from` : `Add $${-h}$ to`} both sides, then divide the whole right side by $${k}$:`,
                        `两边同时${h > 0 ? `减去 $${h}$` : `加上 $${-h}$`}，再把整个右边除以 $${k}$：`,
                      ),
                  [...(k === 1 ? [] : [`${k}x = ${top(h)}`]), `x = ${over(top(h))}`],
                ],
              ],
              t(
                `Substitute: the exponent becomes $${k === 1 ? `(${top(h)})` : `${k} \\cdot ${over(top(h))}`}${plusK(h)} = ${L}$, and $${b}^{${L}} = ${N}$.`,
                `代入原方程：指数变成 $${k === 1 ? `(${top(h)})` : `${k} \\cdot ${over(top(h))}`}${plusK(h)} = ${L}$，而 $${b}^{${L}} = ${N}$。`,
              ),
            ),
          }),
          [
            [
              m(wrong[0]!).en,
              "The constant moved to the other side with the wrong sign: undo it with the opposite operation.",
              "常数移到另一边时符号错了：要用相反的运算消去它。",
            ],
            [m(wrong[1]!).en, "The constant comes off the logarithm, not out of its argument.", "常数要从对数上减去，而不是从真数里减去。"],
            [
              m(wrong[2]!).en,
              k === 1
                ? "The base and the argument are swapped: the base of the power stays the base of the logarithm."
                : "Only the logarithm was divided: the whole right side, constant included, must be divided.",
              k === 1 ? "底数和真数颠倒了：幂的底数仍是对数的底数。" : "只把对数除了：整个右边连同常数都要除。",
            ],
            [
              m(wrong[3]!).en,
              "The base and the argument are swapped: the base of the power stays the base of the logarithm.",
              "底数和真数颠倒了：幂的底数仍是对数的底数。",
            ],
          ],
        );
      },
    },
    {
      id: "approximating-solutions",
      title: t("Approximate solutions", "近似解"),
      explanation: t(
        `An exact solution such as $x = \\log_{2} 7$ does not say how big $x$ is. To approximate it, change to natural logarithms, which a calculator gives: $\\log_{b} N = \\frac{\\ln N}{\\ln b}$. Taking $\\ln$ of both sides of $b^{x} = N$ leads to the same place, since the power rule gives $x \\ln b = \\ln N$.

Take $5 \\cdot 2^{x} = 35$. Divide by $5$, then take natural logarithms:

$$2^{x} = 7 \\implies x = \\frac{\\ln 7}{\\ln 2} \\approx \\frac{1.9459}{0.6931} \\approx 2.81.$$

It fits, since $2^{2} = 4 < 7 < 8 = 2^{3}$.

> **Watch out.** Isolate the power before taking logarithms: $\\frac{\\ln 35}{\\ln 2}$ leaves the $5$ inside. Keep the argument's logarithm on top: $\\frac{\\ln 2}{\\ln 7}$ is upside down. And divide the logarithms, not the numbers: $\\frac{7}{2}$ is not the answer.`,
        `像 $x = \\log_{2} 7$ 这样的精确解，看不出 $x$ 有多大。要求近似值，就换成计算器能算的自然对数：$\\log_{b} N = \\frac{\\ln N}{\\ln b}$。对 $b^{x} = N$ 两边取 $\\ln$ 也得到同样的结果，因为由幂的法则得 $x \\ln b = \\ln N$。

看 $5 \\cdot 2^{x} = 35$。两边除以 $5$，再取自然对数：

$$2^{x} = 7 \\implies x = \\frac{\\ln 7}{\\ln 2} \\approx \\frac{1.9459}{0.6931} \\approx 2.81$$

这是合理的，因为 $2^{2} = 4 < 7 < 8 = 2^{3}$。

> **注意。** 先把幂单独留在一边，再取对数：$\\frac{\\ln 35}{\\ln 2}$ 把 $5$ 留在了里面。真数的对数要在分子：$\\frac{\\ln 2}{\\ln 7}$ 上下颠倒了。要把对数相除，而不是把数相除：$\\frac{7}{2}$ 不是答案。`,
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 5, 6, 7]);
          const N = nonPowerOf(rng, b, 40);
          const a = rng.int(1, 8);
          const v = lnQ(N).div(lnQ(b));
          if (!stable(v, Math.log(N) / Math.log(b), 2)) continue;
          const answer = roundTo(v, 2);
          const lhs = cpoly([a, `${b}^{x}`]);
          return numberProblem({
            prompt: t(
              `Solve $${lhs} = ${a * N}$. Use $${lnGiven(b, N)}$ and give $x$ to the nearest hundredth.`,
              `解方程 $${lhs} = ${a * N}$。利用 $${lnGiven(b, N)}$，求 $x$（精确到百分位）。`,
            ),
            answer,
            form: "decimal",
            solveFor: "x",
            wrong: [roundTo(lnQ(b).div(lnQ(N)), 2), roundTo(lnQ(a * N).div(lnQ(b)), 2), roundTo(Q.of(N, b), 2)],
            solution: walked(
              [
                ...(a === 1
                  ? []
                  : [
                      [
                        ["Isolate the power", "把幂单独留在一边"],
                        t(`Divide both sides by $${a}$:`, `两边同时除以 $${a}$：`),
                        [`${lhs} = ${a * N}`, `${b}^{x} = ${N}`],
                      ] as const,
                    ]),
                [
                  ["Take natural logarithms", "取自然对数"],
                  t(
                    "Take $\\ln$ of both sides; the power rule brings $x$ in front, then divide:",
                    "两边取 $\\ln$，幂的法则把 $x$ 提到前面，再相除：",
                  ),
                  [`x ${lnL(String(b))} = ${lnL(String(N))}`, `x = \\frac{${lnL(String(N))}}{${lnL(String(b))}}`],
                ],
                [
                  ["Divide and round", "相除再取近似"],
                  t("Put in the given values and round to the nearest hundredth at the end:", "代入已知的值，最后精确到百分位："),
                  [`x \\approx \\frac{${dec(lnQ(N))}}{${dec(lnQ(b))}} \\approx ${dec(answer)}`],
                ],
              ],
              t(
                `With a calculator, $${b}^{${dec(answer)}} \\approx ${dec(approx(b ** (Number(answer.n) / Number(answer.d)), 2))}$, close to $${N}$, as it should be with $x$ rounded.`,
                `用计算器算得 $${b}^{${dec(answer)}} \\approx ${dec(approx(b ** (Number(answer.n) / Number(answer.d)), 2))}$，接近 $${N}$；$x$ 是近似值，所以只是接近。`,
              ),
            ),
          });
        }
      },
    },
  ],
  diagnostic: "solution-as-a-logarithm",
};

export const solvingEquationsContainingTheExponentialFunction: TopicDef = {
  id: "solving-equations-containing-the-exponential-function",
  title: t("Solving Equations Containing the Exponential Function", "解含 $e^{x}$ 的方程"),
  summary: t(
    "Solve equations with powers of $e$, by equating exponents or by taking natural logarithms.",
    "解含 $e$ 的幂的方程：令指数相等，或取自然对数。",
  ),
  prerequisites: ["solving-exponential-equations-using-logarithms"],
  encompasses: [
    { topic: "solving-exponential-equations-using-logarithms", weight: 0.5 },
    { topic: "natural-logarithm", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.LE.A.4"],
  intro: t(
    `The function $e^{x}$ is called the **exponential function**. Equations containing it are solved the same way as other exponential equations, with the natural logarithm as the tool, since $\\ln e^{x} = x$.

There are two cases. If both sides are powers of $e$, the exponents must be equal: $e^{x + 2} = e^{5}$ gives $x + 2 = 5$, so $x = 3$. If the other side is not a power of $e$, take $\\ln$ of both sides: $e^{x} = 5$ gives $x = \\ln 5 \\approx 1.61$. Check: $e^{1.61} \\approx 5.00$.

In this lesson we solve equations with powers of $e$ by setting exponents equal, by taking natural logarithms, and approximately.`,
    `函数 $e^{x}$ 叫做**指数函数**。含它的方程和其他指数方程的解法一样，工具是自然对数，因为 $\\ln e^{x} = x$。

分两种情况。如果两边都是 $e$ 的幂，指数一定相等：由 $e^{x + 2} = e^{5}$ 得 $x + 2 = 5$，所以 $x = 3$。如果另一边不是 $e$ 的幂，就两边取 $\\ln$：由 $e^{x} = 5$ 得 $x = \\ln 5 \\approx 1.61$。检验：$e^{1.61} \\approx 5.00$。

这节课我们通过令指数相等、取自然对数来解含 $e$ 的幂的方程，并求近似解。`,
  ),
  knowledgePoints: [
    {
      id: "equal-powers-of-e",
      title: t("Equal powers of $e$", "$e$ 的幂相等"),
      explanation: t(
        `The function $e^{x}$, the **exponential function**, is a power with base $e$. It is always increasing, so two different exponents never give the same value: if $e^{u} = e^{v}$, then $u = v$. So write both sides as powers of $e$, set the exponents equal and solve the linear equation. Two facts help: $1 = e^{0}$ and $\\frac{1}{e^{k}} = e^{-k}$.

Take $e^{2x - 3} = \\frac{1}{e}$. The right side is $e^{-1}$, so

$$2x - 3 = -1 \\implies 2x = 2 \\implies x = 1.$$

> **Watch out.** $1$ is $e^{0}$, not $e^{1}$, and $\\frac{1}{e}$ is $e^{-1}$: a reciprocal makes the exponent negative. When moving the constant across, change its sign: here $2x = -1 + 3$, not $-1 - 3$.`,
        `函数 $e^{x}$ 叫做**指数函数**，它是以 $e$ 为底的幂。它总是递增的，所以两个不同的指数不会得到相同的值：若 $e^{u} = e^{v}$，则 $u = v$。所以把两边写成 $e$ 的幂，令指数相等，再解一次方程。有两个事实很有用：$1 = e^{0}$，$\\frac{1}{e^{k}} = e^{-k}$。

看 $e^{2x - 3} = \\frac{1}{e}$。右边是 $e^{-1}$，所以

$$2x - 3 = -1 \\implies 2x = 2 \\implies x = 1$$

> **注意。** $1$ 是 $e^{0}$，不是 $e^{1}$；$\\frac{1}{e}$ 是 $e^{-1}$：取倒数使指数变成负数。常数移项时要变号：这里是 $2x = -1 + 3$，不是 $-1 - 3$。`,
      ),
      generate(rng) {
        for (;;) {
          const a1 = rng.nonZero(-4, 5);
          const c1 = rng.int(-9, 9);
          const kind = rng.int(0, 2);
          const a2 = kind === 0 ? rng.int(-4, 5) : 0;
          if (a1 === a2) continue;
          const c2 = kind === 2 ? 0 : rng.int(-9, 9);
          if (kind === 1 && c2 >= 0) continue;
          const x = Q.of(c2 - c1, a1 - a2);
          if (x.d > 6n) continue;
          const rhs = kind === 0 ? `e^{${linear(a2, c2)}}` : kind === 1 ? (c2 === -1 ? "\\frac{1}{e}" : `\\frac{1}{e^{${-c2}}}`) : "1";
          return numberProblem({
            prompt: t(`Solve $e^{${linear(a1, c1)}} = ${rhs}$.`, `解方程 $e^{${linear(a1, c1)}} = ${rhs}$。`),
            answer: x,
            solveFor: "x",
            wrong: [Q.of(c2 + c1, a1 - a2), Q.of(-c2 - c1, a1 - a2), x.neg(), ...(kind === 2 ? [Q.of(1 - c1, a1)] : [])],
            solution: walked(
              [
                [
                  ["Write both sides as powers of e", "把两边写成 e 的幂"],
                  kind === 0
                    ? t("Both sides are already powers of $e$.", "两边已经都是 $e$ 的幂。")
                    : kind === 1
                      ? t("A reciprocal of a power of $e$ has a negative exponent:", "$e$ 的幂的倒数是负指数幂：")
                      : t(
                          "Any nonzero number to the power $0$ is $1$, so $1 = e^{0}$:",
                          "任何非零数的 $0$ 次幂都是 $1$，所以 $1 = e^{0}$：",
                        ),
                  kind === 0 ? [] : [`e^{${linear(a1, c1)}} = e^{${linear(a2, c2)}}`],
                ],
                [
                  ["Set the exponents equal", "令指数相等"],
                  t(
                    "The function $e^{x}$ is increasing, so equal powers of $e$ have equal exponents:",
                    "函数 $e^{x}$ 是递增的，所以 $e$ 的幂相等时指数相等：",
                  ),
                  [`${linear(a1, c1)} = ${linear(a2, c2)}`],
                ],
                [
                  ["Solve for x", "解出 x"],
                  a1 - a2 === 1
                    ? t("Collect the terms in $x$ on the left and the numbers on the right:", "把含 $x$ 的项移到左边，数移到右边：")
                    : t(
                        `Collect the terms in $x$ on the left and the numbers on the right, then divide by $${a1 - a2}$:`,
                        `把含 $x$ 的项移到左边，数移到右边，再除以 $${a1 - a2}$：`,
                      ),
                  a1 - a2 === 1 ? [`x = ${c2 - c1}`] : [`${linear(a1 - a2, 0)} = ${c2 - c1}`, `x = ${num(x)}`],
                ],
              ],
              t(
                `Substitute $x = ${num(x)}$: the left exponent is $${a1} \\cdot ${paren(x)}${plusK(c1)} = ${num(Q.of(a1).mul(x).add(Q.of(c1)))}$, ${a2 === 0 ? `and the right exponent is $${c2}$` : `and the right exponent is $${a2} \\cdot ${paren(x)}${plusK(c2)} = ${num(Q.of(a2).mul(x).add(Q.of(c2)))}$`}.`,
                `代入 $x = ${num(x)}$：左边的指数是 $${a1} \\cdot ${paren(x)}${plusK(c1)} = ${num(Q.of(a1).mul(x).add(Q.of(c1)))}$，${a2 === 0 ? `右边的指数是 $${c2}$` : `右边的指数是 $${a2} \\cdot ${paren(x)}${plusK(c2)} = ${num(Q.of(a2).mul(x).add(Q.of(c2)))}$`}。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "taking-natural-logarithms",
      title: t("Taking natural logarithms", "取自然对数"),
      explanation: t(
        `The natural logarithm undoes $e$: $\\ln e^{x} = x$. So once $e^{x}$ stands alone, taking $\\ln$ of both sides gives $x$ directly, and the exact solution is a natural logarithm. Whatever else is on that side has to go first, in reverse order: undo the addition, then the multiplication.

Take $3e^{x} + 4 = 25$. Subtract $4$, then divide by $3$:

$$3e^{x} = 21 \\implies e^{x} = 7 \\implies x = \\ln 7.$$

> **Watch out.** Take the logarithm only after $e^{x}$ is alone: $\\ln 21$ forgets to divide by $3$, and $\\ln \\frac{25}{3}$ forgets to subtract $4$. Undo the added number with the opposite operation: subtract $4$, do not add it.`,
        `自然对数抵消 $e$：$\\ln e^{x} = x$。所以一旦 $e^{x}$ 单独在一边，两边取 $\\ln$ 就直接得到 $x$，精确解是一个自然对数。这一边的其他部分要先去掉，顺序相反：先消去加减，再消去乘除。

看 $3e^{x} + 4 = 25$。两边减去 $4$，再除以 $3$：

$$3e^{x} = 21 \\implies e^{x} = 7 \\implies x = \\ln 7$$

> **注意。** $e^{x}$ 单独在一边之后才能取对数：$\\ln 21$ 忘了除以 $3$，$\\ln \\frac{25}{3}$ 忘了减去 $4$。用相反的运算消去加上的数：减去 $4$，而不是加上。`,
      ),
      generate(rng) {
        const N = rng.int(2, 30);
        const a = rng.int(1, 7);
        const c = rng.int(-15, 15);
        const lhs = `${coefL(a)}e^{x}${plusK(c)}`;
        const d = a * N + c;
        return prefixed(
          {
            prompt: t(`Solve $${lhs} = ${d}$. Give the exact solution.`, `解方程 $${lhs} = ${d}$，给出精确解。`),
            answer: N,
            wrong: [d - c, Q.of(d, a), N + c, Q.of(d + c, a)],
            solution: walked(
              [
                ...(a === 1 && c === 0 ? [] : [isolate(a, c, d, "e^{x}", ["Isolate the power", "把幂单独留在一边"])]),
                [
                  ["Take natural logarithms", "取自然对数"],
                  t(`Take $\\ln$ of both sides; $\\ln e^{x} = x$:`, `两边取 $\\ln$；$\\ln e^{x} = x$：`),
                  [`\\ln e^{x} = ${lnL(String(N))}`, `x = ${lnL(String(N))}`],
                ],
              ],
              t(
                `Substitute: $e^{${lnL(String(N))}} = ${N}$, so the left side is $${a === 1 ? "" : `${a} \\cdot `}${N}${plusK(c)} = ${d}$.`,
                `代入原方程：$e^{${lnL(String(N))}} = ${N}$，所以左边是 $${a === 1 ? "" : `${a} \\cdot `}${N}${plusK(c)} = ${d}$。`,
              ),
            ),
          },
          "x = \\ln",
        );
      },
    },
    {
      id: "approximate-solutions-with-e",
      title: t("Approximate solutions", "近似解"),
      explanation: t(
        `When the exponent is $kx$, taking $\\ln$ gives $kx$, not $x$: $\\ln e^{kx} = kx$. So there is one more step, dividing by $k$. A reciprocal on the right gives a negative logarithm, since $\\ln \\frac{1}{N} = -\\ln N$.

Take $2e^{3x} = 10$. Divide by $2$, take $\\ln$, then divide by $3$:

$$e^{3x} = 5 \\implies 3x = \\ln 5 \\implies x = \\frac{\\ln 5}{3} \\approx \\frac{1.6094}{3} \\approx 0.54.$$

With a reciprocal: $e^{-2x} = \\frac{1}{5}$ gives $-2x = -\\ln 5$, so $x = \\frac{\\ln 5}{2} \\approx 0.80$.

> **Watch out.** Divide the logarithm by $k$; do not multiply ($3 \\ln 5$) and do not take the logarithm of $\\frac{5}{3}$. Watch the signs: a negative $k$ or a reciprocal each flips the sign once.`,
        `指数是 $kx$ 时，取 $\\ln$ 得到的是 $kx$ 而不是 $x$：$\\ln e^{kx} = kx$。所以还要多一步：除以 $k$。右边是倒数时对数是负的，因为 $\\ln \\frac{1}{N} = -\\ln N$。

看 $2e^{3x} = 10$。两边除以 $2$，取 $\\ln$，再除以 $3$：

$$e^{3x} = 5 \\implies 3x = \\ln 5 \\implies x = \\frac{\\ln 5}{3} \\approx \\frac{1.6094}{3} \\approx 0.54$$

右边是倒数时：由 $e^{-2x} = \\frac{1}{5}$ 得 $-2x = -\\ln 5$，所以 $x = \\frac{\\ln 5}{2} \\approx 0.80$。

> **注意。** 是用对数除以 $k$；不要相乘（$3 \\ln 5$），也不要求 $\\frac{5}{3}$ 的对数。注意符号：负的 $k$ 和倒数各使符号改变一次。`,
      ),
      generate(rng) {
        for (;;) {
          const N = rng.pick([2, 3, 5, 6, 7, 10, 11, 12, 13, 15, 20]);
          const k = rng.pick([2, 3, 4, 5, -1, -2, -3]);
          const a = rng.int(1, 6);
          const recip = k < 0 && rng.bool();
          const v = lnQ(N).div(Q.of(k));
          if (!stable(v, Math.log(N) / k, 2)) continue;
          const answer = roundTo(v, 2);
          const value = recip ? `\\frac{${a}}{${N}}` : String(a * N);
          const solveTo = recip ? `\\frac{1}{${N}}` : String(N);
          const lnTarget = recip ? `-${lnL(String(N))}` : lnL(String(N));
          return numberProblem({
            prompt: t(
              `Solve $${coefL(a)}e^{${linear(k, 0)}} = ${value}$. Use $${lnGiven(N)}$ and give $x$ to the nearest hundredth.`,
              `解方程 $${coefL(a)}e^{${linear(k, 0)}} = ${value}$。利用 $${lnGiven(N)}$，求 $x$（精确到百分位）。`,
            ),
            answer: recip ? answer.neg() : answer,
            form: "decimal",
            solveFor: "x",
            wrong: [
              roundTo(lnQ(N).mul(Q.of(k)), 2),
              recip ? answer : answer.neg(),
              roundTo(Q.of(Math.round(Math.log(Math.abs(N / k)) * 1e4), 1e4), 2),
            ],
            solution: walked(
              [
                ...(a === 1
                  ? []
                  : [
                      [
                        ["Isolate the power", "把幂单独留在一边"],
                        t(`Divide both sides by $${a}$:`, `两边同时除以 $${a}$：`),
                        [`${coefL(a)}e^{${linear(k, 0)}} = ${value}`, `e^{${linear(k, 0)}} = ${solveTo}`],
                      ] as const,
                    ]),
                [
                  ["Take natural logarithms", "取自然对数"],
                  recip
                    ? t(
                        `Take $\\ln$ of both sides. The left side becomes the exponent, and $${lnL(`\\frac{1}{${N}}`)} = -${lnL(String(N))}$:`,
                        `两边取 $\\ln$。左边变成指数，而 $${lnL(`\\frac{1}{${N}}`)} = -${lnL(String(N))}$：`,
                      )
                    : t("Take $\\ln$ of both sides; the left side becomes the exponent:", "两边取 $\\ln$，左边变成指数："),
                  [`${linear(k, 0)} = ${lnTarget}`],
                ],
                [
                  ["Divide and round", "相除再取近似"],
                  t(`Divide by $${k}$, put in the given value and round:`, `两边除以 $${k}$，代入已知的值再取近似：`),
                  [
                    `x = \\frac{${lnTarget}}{${k}} \\approx \\frac{${recip ? "-" : ""}${dec(lnQ(N))}}{${k}} \\approx ${dec(recip ? answer.neg() : answer)}`,
                  ],
                ],
              ],
              t(
                `The exponent at $x = ${dec(recip ? answer.neg() : answer)}$ is $${k} \\cdot ${recip !== k < 0 ? `(${dec(recip ? answer.neg() : answer)})` : dec(recip ? answer.neg() : answer)} = ${dec((recip ? answer.neg() : answer).mul(Q.of(k)))}$, close to $${lnTarget} \\approx ${recip ? "-" : ""}${dec(lnQ(N))}$, as it should be with $x$ rounded.`,
                `$x = ${dec(recip ? answer.neg() : answer)}$ 时指数是 $${k} \\cdot ${recip !== k < 0 ? `(${dec(recip ? answer.neg() : answer)})` : dec(recip ? answer.neg() : answer)} = ${dec((recip ? answer.neg() : answer).mul(Q.of(k)))}$，接近 $${lnTarget} \\approx ${recip ? "-" : ""}${dec(lnQ(N))}$；$x$ 是近似值，所以只是接近。`,
              ),
            ),
          });
        }
      },
    },
  ],
  diagnostic: "taking-natural-logarithms",
};

/** lnTerm writes c·ln b with the coefficient in front: "\ln 3", "-\ln 3", "2\ln 3". */
const lnTerm = (c: number, b: number) => `${coefL(c)}${lnL(String(b))}`;

export const solvingExponentialEquationsWithDifferentBasesUsingLogarithms: TopicDef = {
  id: "solving-exponential-equations-with-different-bases-using-logarithms",
  title: t("Solving Exponential Equations With Different Bases Using Logarithms", "用对数解不同底数的指数方程"),
  summary: t(
    "Solve equations such as $2^{x} = 3^{x - 1}$ by taking logarithms of both sides and collecting the terms in $x$.",
    "两边取对数并合并含 $x$ 的项，解 $2^{x} = 3^{x - 1}$ 这样的方程。",
  ),
  prerequisites: ["solving-exponential-equations-using-logarithms", "linear-equations-with-unknown-coefficients"],
  encompasses: [
    { topic: "solving-exponential-equations-using-logarithms", weight: 0.5 },
    { topic: "linear-equations-with-unknown-coefficients", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.LE.A.4"],
  intro: t(
    `In $3^{x} = 2^{x + 1}$ the unknown is in both exponents, and the bases cannot be rewritten as powers of one another. Taking $\\ln$ of both sides brings both exponents down with the power rule, and the equation becomes linear in $x$:

$$x \\ln 3 = (x + 1) \\ln 2 \\implies x \\ln 3 - x \\ln 2 = \\ln 2 \\implies x = \\frac{\\ln 2}{\\ln 3 - \\ln 2} \\approx 1.71.$$

Check: $3^{1.71} \\approx 6.54$ and $2^{2.71} \\approx 6.54$.

In this lesson we solve exponential equations with different bases by taking logarithms of both sides, exactly and approximately, also when the powers have coefficients.`,
    `在 $3^{x} = 2^{x + 1}$ 中，两个指数里都有未知数，而且两个底数不能互相写成对方的幂。两边取 $\\ln$，用幂的法则把两个指数都移下来，方程就变成关于 $x$ 的一次方程：

$$x \\ln 3 = (x + 1) \\ln 2 \\implies x \\ln 3 - x \\ln 2 = \\ln 2 \\implies x = \\frac{\\ln 2}{\\ln 3 - \\ln 2} \\approx 1.71$$

检验：$3^{1.71} \\approx 6.54$，$2^{2.71} \\approx 6.54$。

这节课我们两边取对数来解不同底数的指数方程，求精确解和近似解，也处理幂前面有系数的情况。`,
  ),
  knowledgePoints: [
    {
      id: "logarithms-of-both-sides",
      title: t("Taking logarithms of both sides", "两边取对数"),
      explanation: t(
        `Taking a logarithm of both sides keeps an equation true, and the power rule turns each exponent into a factor: $\\ln a^{u} = u \\ln a$. The logarithms $\\ln a$ and $\\ln b$ are just numbers, so what is left is a linear equation in $x$. Collect the terms in $x$ on one side, factor out $x$, and divide.

Take $2^{x} = 3^{x - 1}$:

$$x \\ln 2 = (x - 1) \\ln 3 = x \\ln 3 - \\ln 3 \\implies x \\ln 2 - x \\ln 3 = -\\ln 3$$

$$x (\\ln 2 - \\ln 3) = -\\ln 3 \\implies x = \\frac{-\\ln 3}{\\ln 2 - \\ln 3}.$$

> **Watch out.** Collect the terms in $x$ on the left, so the denominator is $\\ln 2 - \\ln 3$ with the left base first; the other order gives the opposite sign. The constant $-1$ multiplies $\\ln 3$, the logarithm of its own base, and stays a logarithm: $-\\ln 3$, not $-1$. Do not forget the $x$ on the right: dividing by $\\ln 2$ alone is wrong.`,
        `两边取对数，等式仍然成立，而幂的法则把每个指数变成因数：$\\ln a^{u} = u \\ln a$。$\\ln a$ 和 $\\ln b$ 只是数，所以剩下的是关于 $x$ 的一次方程。把含 $x$ 的项移到一边，提出 $x$，再相除。

看 $2^{x} = 3^{x - 1}$：

$$x \\ln 2 = (x - 1) \\ln 3 = x \\ln 3 - \\ln 3 \\implies x \\ln 2 - x \\ln 3 = -\\ln 3$$

$$x (\\ln 2 - \\ln 3) = -\\ln 3 \\implies x = \\frac{-\\ln 3}{\\ln 2 - \\ln 3}$$

> **注意。** 把含 $x$ 的项移到左边，分母是 $\\ln 2 - \\ln 3$，左边的底数在前；顺序反了符号就反了。常数 $-1$ 乘的是它自己那个底数的对数 $\\ln 3$，而且仍是对数：是 $-\\ln 3$，不是 $-1$。不要忘了右边的 $x$：只除以 $\\ln 2$ 是错的。`,
      ),
      generate(rng) {
        const [a, b] = rng.sample([2, 3, 5, 6, 7, 10], 2) as [number, number];
        const c = rng.nonZero(-4, 4);
        const right = `x = \\frac{${lnTerm(c, b)}}{${lnL(String(a))} - ${lnL(String(b))}}`;
        return reasoned(
          oneOf(rng, {
            prompt: t(`Solve $${a}^{x} = ${b}^{${linear(1, c)}}$.`, `解方程 $${a}^{x} = ${b}^{${linear(1, c)}}$。`),
            right: m(right),
            wrong: [
              m(`x = \\frac{${lnTerm(c, b)}}{${lnL(String(b))} - ${lnL(String(a))}}`),
              m(`x = \\frac{${lnTerm(c, a)}}{${lnL(String(a))} - ${lnL(String(b))}}`),
              m(`x = \\frac{${lnTerm(c, b)}}{${lnL(String(a))}}`),
              m(`x = \\frac{${c}}{${lnL(String(a))} - ${lnL(String(b))}}`),
            ],
            solution: walked(
              [
                [
                  ["Take logarithms of both sides", "两边取对数"],
                  t(
                    "Take $\\ln$ of both sides; the power rule brings each exponent down as a factor:",
                    "两边取 $\\ln$，幂的法则把每个指数作为因数移下来：",
                  ),
                  [`x${lnL(String(a))} = (${linear(1, c)})${lnL(String(b))}`],
                ],
                [
                  ["Collect the terms in x", "合并含 x 的项"],
                  t("Multiply out the right side, then move its term in $x$ to the left:", "展开右边，再把右边含 $x$ 的项移到左边："),
                  [
                    `x${lnL(String(a))} = x${lnL(String(b))} ${c > 0 ? "+" : "-"} ${lnTerm(Math.abs(c), b)}`,
                    `x${lnL(String(a))} - x${lnL(String(b))} = ${lnTerm(c, b)}`,
                  ],
                ],
                [
                  ["Factor and divide", "提出 x 再相除"],
                  t(
                    `Factor out $x$ and divide by $${lnL(String(a))} - ${lnL(String(b))}$:`,
                    `提出 $x$，再除以 $${lnL(String(a))} - ${lnL(String(b))}$：`,
                  ),
                  [`x(${lnL(String(a))} - ${lnL(String(b))}) = ${lnTerm(c, b)}`, right],
                ],
              ],
              t(
                `A calculator gives $x \\approx ${dec(approx((c * Math.log(b)) / (Math.log(a) - Math.log(b)), 2))}$, and then both $x${lnL(String(a))}$ and $(${linear(1, c)})${lnL(String(b))}$ come to about $${dec(approx(((c * Math.log(b)) / (Math.log(a) - Math.log(b))) * Math.log(a), 2))}$.`,
                `用计算器算得 $x \\approx ${dec(approx((c * Math.log(b)) / (Math.log(a) - Math.log(b)), 2))}$，这时 $x${lnL(String(a))}$ 和 $(${linear(1, c)})${lnL(String(b))}$ 都约等于 $${dec(approx(((c * Math.log(b)) / (Math.log(a) - Math.log(b))) * Math.log(a), 2))}$。`,
              ),
            ),
          }),
          [
            [
              m(`x = \\frac{${lnTerm(c, b)}}{${lnL(String(b))} - ${lnL(String(a))}}`).en,
              "The denominator has the wrong sign: collecting the terms in $x$ on the left gives the logarithm of the left base first.",
              "分母的符号错了：把含 $x$ 的项移到左边，应是左边底数的对数在前。",
            ],
            [
              m(`x = \\frac{${lnTerm(c, a)}}{${lnL(String(a))} - ${lnL(String(b))}}`).en,
              "The constant in the exponent belongs to the right side, so it multiplies the logarithm of that side's base.",
              "指数中的常数属于右边，所以它乘的是右边底数的对数。",
            ],
            [
              m(`x = \\frac{${lnTerm(c, b)}}{${lnL(String(a))}}`).en,
              "This forgets that $x$ also appears on the right: both terms in $x$ must be collected.",
              "这里忘了右边也有 $x$：两个含 $x$ 的项都要合并。",
            ],
            [
              m(`x = \\frac{${c}}{${lnL(String(a))} - ${lnL(String(b))}}`).en,
              "The logarithm is lost from the top: the constant still multiplies the logarithm of the right base.",
              "分子丢了对数：常数仍要乘以右边底数的对数。",
            ],
          ],
        );
      },
    },
    {
      id: "approximating-with-different-bases",
      title: t("Approximate solutions", "近似解"),
      explanation: t(
        `The exact solution is a fraction of logarithms; a calculator, or given values of the logarithms, turns it into a decimal. Work out the numerator and the denominator separately, then divide, and round only at the end, since rounding early can change the last digit.

Take $5^{x} = 3^{x + 2}$. Taking $\\ln$ and collecting gives $x (\\ln 5 - \\ln 3) = 2 \\ln 3$, so

$$x = \\frac{2 \\ln 3}{\\ln 5 - \\ln 3} \\approx \\frac{2 \\cdot 1.0986}{1.6094 - 1.0986} = \\frac{2.1972}{0.5108} \\approx 4.30.$$

> **Watch out.** The denominator is a difference, worked out first and with its sign: $\\ln 5 - \\ln 3 = 0.5108$. The constant multiplies the logarithm of its own base, $2 \\ln 3$, not $2 \\ln 5$. Dividing by $\\ln 5$ alone forgets the $x$ on the right, and swapping the two logarithms in the denominator flips the sign of the answer.`,
        `精确解是对数构成的分数；用计算器或已知的对数值可以把它化成小数。分别算出分子和分母，再相除，最后才取近似，因为过早取近似可能改变最后一位。

看 $5^{x} = 3^{x + 2}$。两边取 $\\ln$ 并合并，得 $x (\\ln 5 - \\ln 3) = 2 \\ln 3$，所以

$$x = \\frac{2 \\ln 3}{\\ln 5 - \\ln 3} \\approx \\frac{2 \\cdot 1.0986}{1.6094 - 1.0986} = \\frac{2.1972}{0.5108} \\approx 4.30$$

> **注意。** 分母是差，要先算出来并保留符号：$\\ln 5 - \\ln 3 = 0.5108$。常数乘的是它自己那个底数的对数 $2 \\ln 3$，不是 $2 \\ln 5$。只除以 $\\ln 5$ 是忘了右边的 $x$，把分母中两个对数对调会使答案变号。`,
      ),
      generate(rng) {
        for (;;) {
          const [a, b] = rng.sample([2, 3, 5, 7, 11], 2) as [number, number];
          const c = rng.nonZero(-3, 3);
          const v = Q.of(c)
            .mul(lnQ(b))
            .div(lnQ(a).sub(lnQ(b)));
          const truth = (c * Math.log(b)) / (Math.log(a) - Math.log(b));
          if (!stable(v, truth, 2)) continue;
          const answer = roundTo(v, 2);
          return numberProblem({
            prompt: t(
              `Solve $${a}^{x} = ${b}^{${linear(1, c)}}$. Use $${lnGiven(a, b)}$ and give $x$ to the nearest hundredth.`,
              `解方程 $${a}^{x} = ${b}^{${linear(1, c)}}$。利用 $${lnGiven(a, b)}$，求 $x$（精确到百分位）。`,
            ),
            answer,
            form: "decimal",
            solveFor: "x",
            wrong: [
              answer.neg(),
              roundTo(
                Q.of(c)
                  .mul(lnQ(a))
                  .div(lnQ(a).sub(lnQ(b))),
                2,
              ),
              roundTo(Q.of(c).mul(lnQ(b)).div(lnQ(a)), 2),
            ],
            solution: walked(
              [
                [
                  ["Take logarithms of both sides", "两边取对数"],
                  t(
                    "Take $\\ln$ of both sides; the power rule brings each exponent down as a factor:",
                    "两边取 $\\ln$，幂的法则把每个指数作为因数移下来：",
                  ),
                  [`x${lnL(String(a))} = (${linear(1, c)})${lnL(String(b))}`],
                ],
                [
                  ["Solve for x", "解出 x"],
                  t(
                    "Multiply out, collect the terms in $x$ on the left, factor out $x$ and divide:",
                    "展开，把含 $x$ 的项移到左边，提出 $x$ 再相除：",
                  ),
                  [
                    `x${lnL(String(a))} - x${lnL(String(b))} = ${lnTerm(c, b)}`,
                    `x = \\frac{${lnTerm(c, b)}}{${lnL(String(a))} - ${lnL(String(b))}}`,
                  ],
                ],
                [
                  ["Substitute and divide", "代入再相除"],
                  t(
                    "Put in the given values, work out the numerator and the denominator, then divide and round:",
                    "代入已知的值，算出分子和分母，再相除并取近似：",
                  ),
                  [
                    `x \\approx \\frac{${c === 1 ? "" : c === -1 ? "-" : `${c} \\cdot `}${dec(lnQ(b))}}{${dec(lnQ(a))} - ${dec(lnQ(b))}} = \\frac{${dec(Q.of(c).mul(lnQ(b)))}}{${dec(lnQ(a).sub(lnQ(b)))}} \\approx ${dec(answer)}`,
                  ],
                ],
              ],
              t(
                `With $x \\approx ${dec(answer)}$: $x${lnL(String(a))} \\approx ${dec(answer)} \\cdot ${dec(lnQ(a))} \\approx ${dec(roundTo(answer.mul(lnQ(a)), 2))}$ and $(${linear(1, c)})${lnL(String(b))} \\approx ${dec(answer.add(Q.of(c)))} \\cdot ${dec(lnQ(b))} \\approx ${dec(roundTo(answer.add(Q.of(c)).mul(lnQ(b)), 2))}$: nearly equal, as they should be with $x$ rounded.`,
                `取 $x \\approx ${dec(answer)}$：$x${lnL(String(a))} \\approx ${dec(answer)} \\cdot ${dec(lnQ(a))} \\approx ${dec(roundTo(answer.mul(lnQ(a)), 2))}$，$(${linear(1, c)})${lnL(String(b))} \\approx ${dec(answer.add(Q.of(c)))} \\cdot ${dec(lnQ(b))} \\approx ${dec(roundTo(answer.add(Q.of(c)).mul(lnQ(b)), 2))}$：两者几乎相等；$x$ 是近似值，所以只是几乎相等。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "coefficients-and-different-bases",
      title: t("Coefficients and different bases", "系数与不同底数"),
      explanation: t(
        `A coefficient in front of a power is not part of the power, so it cannot be brought down by the power rule. Divide it away first. Then divide by one of the powers: powers with the same exponent combine, $\\frac{b^{x}}{d^{x}} = \\left(\\frac{b}{d}\\right)^{x}$, which leaves a single power equal to a number.

Take $2 \\cdot 5^{x} = 7 \\cdot 3^{x}$. Divide both sides by $2$ and by $3^{x}$, then take $\\ln$ and use the quotient rule:

$$\\left(\\frac{5}{3}\\right)^{x} = \\frac{7}{2} \\implies x (\\ln 5 - \\ln 3) = \\ln 7 - \\ln 2 \\implies x = \\frac{\\ln 7 - \\ln 2}{\\ln 5 - \\ln 3} \\approx \\frac{1.2528}{0.5108} \\approx 2.45.$$

> **Watch out.** Each coefficient stays with its own side: dividing by $2$ gives $\\frac{7}{2}$, and $\\frac{2}{7}$ would flip the sign of the answer. The logarithm of a quotient is a difference, $\\ln \\frac{7}{2} = \\ln 7 - \\ln 2$, not $\\frac{\\ln 7}{\\ln 2}$.`,
        `幂前面的系数不是幂的一部分，所以不能用幂的法则移下来，要先除掉。再除以其中一个幂：指数相同的幂可以合并，$\\frac{b^{x}}{d^{x}} = \\left(\\frac{b}{d}\\right)^{x}$，于是只剩一个幂等于一个数。

看 $2 \\cdot 5^{x} = 7 \\cdot 3^{x}$。两边同时除以 $2$ 和 $3^{x}$，再取 $\\ln$ 并用商的法则：

$$\\left(\\frac{5}{3}\\right)^{x} = \\frac{7}{2} \\implies x (\\ln 5 - \\ln 3) = \\ln 7 - \\ln 2 \\implies x = \\frac{\\ln 7 - \\ln 2}{\\ln 5 - \\ln 3} \\approx \\frac{1.2528}{0.5108} \\approx 2.45$$

> **注意。** 每个系数留在自己那一边：除以 $2$ 得 $\\frac{7}{2}$，写成 $\\frac{2}{7}$ 会使答案变号。商的对数是差，$\\ln \\frac{7}{2} = \\ln 7 - \\ln 2$，不是 $\\frac{\\ln 7}{\\ln 2}$。`,
      ),
      generate(rng) {
        for (;;) {
          const [a, c] = rng.sample([2, 3, 5, 7], 2) as [number, number];
          const [b, d] = rng.sample([2, 3, 5, 7, 11], 2) as [number, number];
          const v = lnQ(c)
            .sub(lnQ(a))
            .div(lnQ(b).sub(lnQ(d)));
          const truth = (Math.log(c) - Math.log(a)) / (Math.log(b) - Math.log(d));
          if (!stable(v, truth, 2)) continue;
          const answer = roundTo(v, 2);
          const used = [...new Set([a, b, c, d])].sort((x, y) => x - y);
          return numberProblem({
            prompt: t(
              `Solve $${a} \\cdot ${b}^{x} = ${c} \\cdot ${d}^{x}$. Use $${lnGiven(...used)}$ and give $x$ to the nearest hundredth.`,
              `解方程 $${a} \\cdot ${b}^{x} = ${c} \\cdot ${d}^{x}$。利用 $${lnGiven(...used)}$，求 $x$（精确到百分位）。`,
            ),
            answer,
            form: "decimal",
            solveFor: "x",
            wrong: [
              answer.neg(),
              roundTo(
                lnQ(a)
                  .sub(lnQ(c))
                  .div(lnQ(d).sub(lnQ(b)))
                  .neg(),
                2,
              ),
              roundTo(
                lnQ(c)
                  .div(lnQ(a))
                  .div(lnQ(b).div(lnQ(d))),
                2,
              ),
            ],
            solution: walked(
              [
                [
                  ["Gather the powers", "把幂集中到一边"],
                  t(
                    `Divide both sides by $${a}$ and by $${d}^{x}$; powers with the same exponent combine:`,
                    `两边同时除以 $${a}$ 和 $${d}^{x}$；指数相同的幂可以合并：`,
                  ),
                  [`\\frac{${b}^{x}}{${d}^{x}} = \\frac{${c}}{${a}}`, `\\left(\\frac{${b}}{${d}}\\right)^{x} = \\frac{${c}}{${a}}`],
                ],
                [
                  ["Take logarithms of both sides", "两边取对数"],
                  t(
                    "Take $\\ln$ of both sides; the power rule brings $x$ down and the quotient rule splits each logarithm:",
                    "两边取 $\\ln$；幂的法则把 $x$ 移下来，商的法则把每个对数拆开：",
                  ),
                  [
                    `x${lnL(`\\frac{${b}}{${d}}`)} = ${lnL(`\\frac{${c}}{${a}}`)}`,
                    `x(${lnL(String(b))} - ${lnL(String(d))}) = ${lnL(String(c))} - ${lnL(String(a))}`,
                  ],
                ],
                [
                  ["Divide and substitute", "相除再代入"],
                  t("Divide, put in the given values, and round at the end:", "相除，代入已知的值，最后取近似："),
                  [
                    `x = \\frac{${lnL(String(c))} - ${lnL(String(a))}}{${lnL(String(b))} - ${lnL(String(d))}}`,
                    `x \\approx \\frac{${dec(lnQ(c))} - ${dec(lnQ(a))}}{${dec(lnQ(b))} - ${dec(lnQ(d))}} = \\frac{${dec(lnQ(c).sub(lnQ(a)))}}{${dec(lnQ(b).sub(lnQ(d)))}} \\approx ${dec(answer)}`,
                  ],
                ],
              ],
              t(
                `Take $\\ln$ of the original sides with $x \\approx ${dec(answer)}$: $${lnL(String(a))} + x${lnL(String(b))} \\approx ${dec(roundTo(lnQ(a).add(answer.mul(lnQ(b))), 2))}$ and $${lnL(String(c))} + x${lnL(String(d))} \\approx ${dec(roundTo(lnQ(c).add(answer.mul(lnQ(d))), 2))}$: nearly equal, as they should be with $x$ rounded.`,
                `取 $x \\approx ${dec(answer)}$，求原方程两边的 $\\ln$：$${lnL(String(a))} + x${lnL(String(b))} \\approx ${dec(roundTo(lnQ(a).add(answer.mul(lnQ(b))), 2))}$，$${lnL(String(c))} + x${lnL(String(d))} \\approx ${dec(roundTo(lnQ(c).add(answer.mul(lnQ(d))), 2))}$：两者几乎相等；$x$ 是近似值，所以只是几乎相等。`,
              ),
            ),
          });
        }
      },
    },
  ],
  diagnostic: "logarithms-of-both-sides",
};

export const solvingExponentialEquationsUsingTheZeroProductProperty: TopicDef = {
  id: "solving-exponential-equations-using-the-zero-product-property",
  title: t("Solving Exponential Equations Using the Zero-Product Property", "用零积性质解指数方程"),
  summary: t(
    "Factor exponential equations such as $x \\cdot 2^{x} - 8x = 0$ and $4^{x} - 6 \\cdot 2^{x} + 8 = 0$, and reject impossible factors.",
    "对 $x \\cdot 2^{x} - 8x = 0$、$4^{x} - 6 \\cdot 2^{x} + 8 = 0$ 这样的指数方程因式分解，并舍去不可能的因式。",
  ),
  prerequisites: ["solving-exponential-equations", "solving-quadratic-equations-by-factoring"],
  encompasses: [
    { topic: "solving-exponential-equations", weight: 0.4 },
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.SSE.A.2", "CCSS.HSA.REI.B.4"],
  intro: t(
    `If a product is $0$, at least one of its factors is $0$. This **zero-product property** splits a hard equation into easy ones. In $(x - 1)(2^{x} - 4) = 0$, either $x - 1 = 0$, so $x = 1$, or $2^{x} = 4 = 2^{2}$, so $x = 2$.

Exponential equations often become products after factoring. Since $4^{x} = (2^{x})^{2}$, the equation $4^{x} - 3 \\cdot 2^{x} - 4 = 0$ is a quadratic in $u = 2^{x}$: $u^{2} - 3u - 4 = (u - 4)(u + 1) = 0$. So $2^{x} = 4$, giving $x = 2$, or $2^{x} = -1$, which is impossible because a power of $2$ is always positive.

In this lesson we solve exponential equations by taking out common factors, by treating them as quadratics in a power, and by rejecting the factors that can never be $0$.`,
    `积为 $0$ 时，至少有一个因式为 $0$。这条**零积性质**把一个难的方程拆成几个简单的方程。在 $(x - 1)(2^{x} - 4) = 0$ 中，要么 $x - 1 = 0$，得 $x = 1$；要么 $2^{x} = 4 = 2^{2}$，得 $x = 2$。

指数方程因式分解后常常变成积。因为 $4^{x} = (2^{x})^{2}$，方程 $4^{x} - 3 \\cdot 2^{x} - 4 = 0$ 是关于 $u = 2^{x}$ 的二次方程：$u^{2} - 3u - 4 = (u - 4)(u + 1) = 0$。所以 $2^{x} = 4$，得 $x = 2$；或 $2^{x} = -1$，这不可能，因为 $2$ 的幂总是正数。

这节课我们通过提取公因式、把方程看作关于幂的二次方程、舍去永远不为 $0$ 的因式来解指数方程。`,
  ),
  knowledgePoints: [
    {
      id: "common-factors",
      title: t("Common factors", "提取公因式"),
      explanation: t(
        `If a product is $0$, one of its factors is $0$, because a product of nonzero numbers is never $0$. So when every term contains the same factor, take it out and set each factor equal to $0$ in turn.

Take $x \\cdot 3^{x} - 9x = 0$. Both terms contain $x$:

$$x(3^{x} - 9) = 0 \\implies x = 0 \\text{ or } 3^{x} = 9 = 3^{2}.$$

So $x = 0$ or $x = 2$.

> **Watch out.** Do not divide both sides by $x$: that loses the solution $x = 0$. The second solution is the exponent $2$, not the number $9$. And a factor $x - p$ is $0$ at $x = p$, not at $x = -p$.`,
        `积为 $0$ 时，至少有一个因式为 $0$，因为非零数的积不会是 $0$。所以各项含有相同的因式时，把它提出来，再依次令每个因式等于 $0$。

看 $x \\cdot 3^{x} - 9x = 0$。两项都含 $x$：

$$x(3^{x} - 9) = 0 \\implies x = 0 \\text{ 或 } 3^{x} = 9 = 3^{2}$$

所以 $x = 0$ 或 $x = 2$。

> **注意。** 不要两边同除以 $x$，那样会丢掉解 $x = 0$。第二个解是指数 $2$，不是数 $9$。因式 $x - p$ 在 $x = p$ 时为 $0$，不是 $x = -p$。`,
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 4, 5, 10]);
          const mExp = rng.int(-2, b === 2 ? 5 : 3);
          if (mExp === 0) continue;
          const N = Q.of(b).pow(mExp);
          const p = rng.bool(0.5) ? 0 : rng.nonZero(-5, 5);
          if (p === mExp) continue;
          const eq =
            p === 0
              ? `x \\cdot ${b}^{x} - ${N.isInteger() ? `${num(N)}x` : `${num(N)}x`} = 0`
              : `(${linear(1, -p)})(${b}^{x} - ${num(N)}) = 0`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: [String(p), String(mExp)],
            wrong: [[String(mExp)], [String(p), num(N)], [String(-p), String(mExp)]],
            solution: walked(
              [
                [
                  ["Factor", "因式分解"],
                  p === 0
                    ? t(
                        "Both terms contain $x$, so take it out; do not divide by it, or the solution $x = 0$ is lost:",
                        "两项都含 $x$，把它提出来；不要除以 $x$，否则会丢掉解 $x = 0$：",
                      )
                    : t("The left side is already a product of two factors.", "左边已经是两个因式的积。"),
                  p === 0 ? [`x(${b}^{x} - ${num(N)}) = 0`] : [],
                ],
                [
                  ["Set each factor equal to 0", "令每个因式等于 0"],
                  t("A product is $0$ only when one of its factors is $0$:", "积为 $0$ 时，必有一个因式为 $0$："),
                  [`${p === 0 ? "x = 0" : `${linear(1, -p)} = 0`} \\quad \\text{or} \\quad ${b}^{x} = ${num(N)}`],
                ],
                [
                  ["Solve each equation", "分别求解"],
                  t(
                    `$${powerValue(Q.of(b), Q.of(mExp))}$, so the second equation gives $x = ${mExp}$:`,
                    `$${powerValue(Q.of(b), Q.of(mExp))}$，所以第二个方程得 $x = ${mExp}$：`,
                  ),
                  [`x = ${p} \\quad \\text{or} \\quad x = ${mExp}`],
                ],
              ],
              t(
                `At $x = ${p}$ the factor $${p === 0 ? "x" : linear(1, -p)}$ is $0$, and at $x = ${mExp}$ the factor $${b}^{${mExp}} - ${num(N)}$ is $0$; either way the product is $0$.`,
                `$x = ${p}$ 时因式 $${p === 0 ? "x" : linear(1, -p)}$ 为 $0$；$x = ${mExp}$ 时因式 $${b}^{${mExp}} - ${num(N)}$ 为 $0$。两种情况下积都是 $0$。`,
              ),
            ),
          });
        }
      },
    },
    {
      id: "quadratic-in-form",
      title: t("Equations quadratic in a power", "关于幂的二次方程"),
      explanation: t(
        `A power of a power multiplies exponents, so $(2^{x})^{2} = 2^{2x} = 4^{x}$. When an equation contains $b^{x}$ and its square, $b^{2x}$ or $(b^{2})^{x}$, calling $u = b^{x}$ turns it into a quadratic in $u$, which factors as usual. Each value of $u$ then gives an exponential equation for $x$.

Take $9^{x} - 12 \\cdot 3^{x} + 27 = 0$. With $u = 3^{x}$, $9^{x} = u^{2}$:

$$u^{2} - 12u + 27 = 0 \\implies (u - 3)(u - 9) = 0 \\implies u = 3 \\text{ or } u = 9.$$

Then $3^{x} = 3$ or $3^{x} = 9$, so $x = 1$ or $x = 2$.

> **Watch out.** The values of $u$ are not the answers: $3$ and $9$ are values of $3^{x}$, and the solutions are $x = 1$ and $x = 2$. Each factor gives its own solution; do not add the exponents or keep only one of them.`,
        `幂的乘方，指数相乘，所以 $(2^{x})^{2} = 2^{2x} = 4^{x}$。方程中含有 $b^{x}$ 和它的平方 $b^{2x}$ 或 $(b^{2})^{x}$ 时，设 $u = b^{x}$，就把它变成关于 $u$ 的二次方程，照常因式分解。$u$ 的每个值再给出一个关于 $x$ 的指数方程。

看 $9^{x} - 12 \\cdot 3^{x} + 27 = 0$。设 $u = 3^{x}$，则 $9^{x} = u^{2}$：

$$u^{2} - 12u + 27 = 0 \\implies (u - 3)(u - 9) = 0 \\implies u = 3 \\text{ 或 } u = 9$$

于是 $3^{x} = 3$ 或 $3^{x} = 9$，所以 $x = 1$ 或 $x = 2$。

> **注意。** $u$ 的值不是答案：$3$ 和 $9$ 是 $3^{x}$ 的值，解是 $x = 1$ 和 $x = 2$。每个因式给出它自己的解；不要把指数相加，也不要只保留其中一个。`,
      ),
      generate(rng) {
        const b = rng.pick([2, 2, 3, 3, 5]);
        const [mm, nn] = rng.sample(b === 2 ? [-1, 0, 1, 2, 3, 4] : [-1, 0, 1, 2], 2) as [number, number];
        const [u1, u2] = [Q.of(b).pow(mm), Q.of(b).pow(nn)];
        const S = u1.add(u2);
        const P = u1.mul(u2);
        const big = rng.bool() ? `${b * b}^{x}` : `${b}^{2x}`;
        const eq = `${cpoly([1, big], [S.neg(), `${b}^{x}`], [P, ""])} = 0`;
        const quad = `${cpoly([1, "u^{2}"], [S.neg(), "u"], [P, ""])} = 0`;
        return solutionsProblem({
          prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
          values: [String(mm), String(nn)],
          wrong: [[num(u1), num(u2)], [String(mm + nn)], [String(Math.max(mm, nn))]],
          solution: walked(
            [
              [
                ["Substitute", "换元"],
                t(
                  `Let $u = ${b}^{x}$. Then $${big} = (${b}^{x})^{2} = u^{2}$, since a power of a power multiplies exponents:`,
                  `设 $u = ${b}^{x}$。因为幂的乘方指数相乘，$${big} = (${b}^{x})^{2} = u^{2}$：`,
                ),
                [quad],
              ],
              [
                ["Factor", "因式分解"],
                t(
                  `Two numbers with product $${num(P)}$ and sum $${num(S)}$ are $${num(u1)}$ and $${num(u2)}$:`,
                  `积为 $${num(P)}$、和为 $${num(S)}$ 的两个数是 $${num(u1)}$ 和 $${num(u2)}$：`,
                ),
                [`(u${plusK(u1.neg())})(u${plusK(u2.neg())}) = 0`, `u = ${num(u1)} \\quad \\text{or} \\quad u = ${num(u2)}`],
              ],
              [
                ["Go back to x", "回到 x"],
                t(
                  `The values of $u$ are values of $${b}^{x}$; write them as powers of $${b}$:`,
                  `$u$ 的值是 $${b}^{x}$ 的值，把它们写成 $${b}$ 的幂：`,
                ),
                [
                  `${b}^{x} = ${b}^{${mm}} \\quad \\text{or} \\quad ${b}^{x} = ${b}^{${nn}}`,
                  `x = ${mm} \\quad \\text{or} \\quad x = ${nn}`,
                ],
              ],
            ],
            t(
              `At $x = ${mm}$, $u = ${num(u1)}$ and the left side is $${num(u1.pow(2))} - ${num(S.mul(u1))} + ${num(P)} = 0$; at $x = ${nn}$, $u = ${num(u2)}$ and it is $${num(u2.pow(2))} - ${num(S.mul(u2))} + ${num(P)} = 0$.`,
              `$x = ${mm}$ 时 $u = ${num(u1)}$，左边是 $${num(u1.pow(2))} - ${num(S.mul(u1))} + ${num(P)} = 0$；$x = ${nn}$ 时 $u = ${num(u2)}$，左边是 $${num(u2.pow(2))} - ${num(S.mul(u2))} + ${num(P)} = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "rejecting-impossible-factors",
      title: t("Rejecting impossible factors", "舍去不可能的因式"),
      explanation: t(
        `A power with a positive base is always positive: $b^{x} > 0$ for every $x$. So after substituting $u = b^{x}$ and factoring, a factor that needs $u$ to be negative or zero gives no solution and is rejected. If every factor is like that, the equation has no solution at all.

Take $4^{x} + 2 \\cdot 2^{x} - 8 = 0$. With $u = 2^{x}$:

$$u^{2} + 2u - 8 = 0 \\implies (u - 2)(u + 4) = 0.$$

$2^{x} = -4$ is impossible, so only $2^{x} = 2$ is left, and $x = 1$.

> **Watch out.** Do not turn the impossible factor into an answer: $-4$ is neither a value of $x$ nor a possible value of $2^{x}$. The answer is $x = 1$, not $u = 2$. And when all the factors are impossible, the answer is "no solution", not the negative values of $u$.`,
        `正底数的幂总是正数：对每个 $x$ 都有 $b^{x} > 0$。所以设 $u = b^{x}$ 并因式分解后，要求 $u$ 为负数或零的因式没有解，要舍去。如果每个因式都是这样，方程就无解。

看 $4^{x} + 2 \\cdot 2^{x} - 8 = 0$。设 $u = 2^{x}$：

$$u^{2} + 2u - 8 = 0 \\implies (u - 2)(u + 4) = 0$$

$2^{x} = -4$ 不可能成立，所以只剩 $2^{x} = 2$，得 $x = 1$。

> **注意。** 不要把不可能的因式当成解：$-4$ 既不是 $x$ 的值，也不可能是 $2^{x}$ 的值。答案是 $x = 1$，不是 $u = 2$。如果所有因式都不可能为 $0$，答案是"无解"，而不是 $u$ 的那些负值。`,
      ),
      generate(rng) {
        for (;;) {
          const b = rng.pick([2, 3, 5]);
          const mm = rng.int(-1, b === 2 ? 4 : 2);
          const u1 = Q.of(b).pow(mm);
          const c = rng.int(1, 9);
          const none = rng.bool(0.15);
          const roots = none ? [Q.of(-c), Q.of(-rng.int(1, 9))] : [u1, Q.of(-c)];
          const S = roots[0]!.add(roots[1]!);
          const P = roots[0]!.mul(roots[1]!);
          if (S.isZero() || roots[0]!.eq(roots[1]!)) continue;
          const big = `${b * b}^{x}`;
          const eq = `${cpoly([1, big], [S.neg(), `${b}^{x}`], [P, ""])} = 0`;
          return solutionsProblem({
            prompt: t(`Solve $${eq}$.`, `解方程 $${eq}$。`),
            values: none ? [] : [String(mm)],
            wrong: none ? [[num(roots[0]!), num(roots[1]!)]] : [[String(mm), String(-c)], [num(u1)], []],
            solution: walked(
              [
                [
                  ["Substitute and factor", "换元并因式分解"],
                  t(`Let $u = ${b}^{x}$, so $${big} = u^{2}$, and factor:`, `设 $u = ${b}^{x}$，则 $${big} = u^{2}$，再因式分解：`),
                  [`${cpoly([1, "u^{2}"], [S.neg(), "u"], [P, ""])} = 0`, `${roots.map((r) => `(u${plusK(r.neg())})`).join("")} = 0`],
                ],
                none
                  ? [
                      ["Reject the impossible factors", "舍去不可能的因式"],
                      t(
                        `Both factors need $u = ${b}^{x}$ to be negative, $${num(roots[0]!)}$ or $${num(roots[1]!)}$, but a power of $${b}$ is always positive. There is no solution.`,
                        `两个因式都要求 $u = ${b}^{x}$ 为负数 $${num(roots[0]!)}$ 或 $${num(roots[1]!)}$，但 $${b}$ 的幂总是正数。方程无解。`,
                      ),
                    ]
                  : [
                      ["Reject the impossible factor", "舍去不可能的因式"],
                      t(
                        `$${b}^{x} = ${-c}$ is impossible, since a power of $${b}$ is always positive. The other factor gives $${powerValue(Q.of(b), Q.of(mm))}$:`,
                        `$${b}^{x} = ${-c}$ 不可能成立，因为 $${b}$ 的幂总是正数。另一个因式给出 $${powerValue(Q.of(b), Q.of(mm))}$：`,
                      ),
                      [`${b}^{x} = ${num(u1)} = ${b}^{${mm}}`, `x = ${mm}`],
                    ],
              ],
              none
                ? t(
                    `For every $x$ the terms $${big}$, $${num(S.neg())} \\cdot ${b}^{x}$ and $${num(P)}$ are all positive, so their sum is never $0$.`,
                    `对每个 $x$，$${big}$、$${num(S.neg())} \\cdot ${b}^{x}$ 和 $${num(P)}$ 都是正数，所以它们的和永远不为 $0$。`,
                  )
                : t(
                    `At $x = ${mm}$, $u = ${num(u1)}$ and the left side is $${num(u1.pow(2))} ${S.sign() > 0 ? "-" : "+"} ${num(S.mul(u1).abs())} - ${num(P.abs())} = 0$.`,
                    `$x = ${mm}$ 时 $u = ${num(u1)}$，左边是 $${num(u1.pow(2))} ${S.sign() > 0 ? "-" : "+"} ${num(S.mul(u1).abs())} - ${num(P.abs())} = 0$。`,
                  ),
            ),
          });
        }
      },
    },
  ],
};

// TOPICS-END

/** algebraIILogarithmTopics are the topics of the exponentials and logarithms unit of Algebra II, in teaching order. */
export const algebraIILogarithmTopics: readonly TopicDef[] = [
  convertingBetweenExponentialAndLogarithmicForm,
  evaluatingLogarithms,
  commonLogarithm,
  naturalLogarithm,
  simplifyingLogarithmicExpressions,
  productRuleForLogarithms,
  quotientRuleForLogarithms,
  powerRuleForLogarithms,
  combiningLawsOfLogarithms,
  changeOfBaseFormula,
  solvingExponentialEquationsUsingLogarithms,
  solvingEquationsContainingTheExponentialFunction,
  solvingExponentialEquationsWithDifferentBasesUsingLogarithms,
  solvingExponentialEquationsUsingTheZeroProductProperty,
];
