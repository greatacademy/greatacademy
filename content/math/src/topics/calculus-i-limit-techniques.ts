import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, poly, Q, radical } from "@ga/subject-math";
import { calculusDrawings1 } from "../explanation-drawings-calculus-1.ts";
import { functionProblem, isTerminating, numberProblem, steps, why, withMistakes } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { bare, fac, infL, type LimitValue, lim, limitChoice, limitText, range, table } from "./calculus-common.ts";

// Calculus I unit 2: Limits, modules 2.5 (Determining Limits Using Algebraic
// Manipulation) and 2.6 (Special Limits). Topics 2.5.8 and 2.5.9 are the
// existing vertical-asymptotes-of-rational-functions and
// infinite-limits-of-rational-functions.

/** cx writes the multiple k of a term: "x", "-x", "3x". */
const cx = (k: number, body: string) => (k === 1 ? body : k === -1 ? `-${body}` : `${k}${body}`);

/** inv is the reciprocal of q, or 0 when q is 0. */
const inv = (q: Q) => (q.isZero() ? Q.zero : Q.one.div(q));

/** frac is n/d, or 0 when d is 0, for wrong answers that may divide by zero. */
const frac = (n: number, d: number) => (d === 0 ? Q.zero : Q.of(n, d));

/** quad writes (x − p)(x − q) expanded, times k. */
const quad = (k: number, p: number, q: number) => poly([k, "x^{2}"], [-k * (p + q), "x"], [k * p * q, ""]);

/** paren writes a number in parentheses when negative. */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** Step is one labelled step of a solution: its title in each locale, what it says, and the lines it displays. */
type Step = readonly [title: readonly [string, string], say: Text, lines?: readonly string[]];

/** walked writes labelled steps, each with its displayed lines, followed by a check that takes a second route. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(([[en, zh], say, lines = []], i) => {
        const gap = locale === "en" && say[locale] !== "" ? " " : "";
        return `${stepLabel(i + 1, en, zh)[locale]}${gap}${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`;
      })
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。**${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** say is the same words with no displayed lines, for a step that only explains. */
const none = t("", "");

/** fmt writes a value to four decimal places without trailing zeros, or as m × 10^k when it is very large or very small. */
function fmt(v: number): string {
  const a = Math.abs(v);
  if (a >= 1e6 || (a > 0 && a < 1e-4)) {
    let k = Math.floor(Math.log10(a));
    let m = Math.round((v / 10 ** k) * 100) / 100;
    if (Math.abs(m) >= 10) {
      m /= 10;
      k += 1;
    }
    return `${m} \\times 10^{${k}}`;
  }
  return dec(Q.of(Math.round(v * 10000) || 0, 10000));
}

/** near are the x-values a − 0.01, a − 0.001, a + 0.001 and a + 0.01. */
const near = (a: number) => [-0.01, -0.001, 0.001, 0.01].map((d) => Math.round((a + d) * 1000) / 1000);

/** far are the x-values 100, 1000 and 10000 on the side s (negative on the left). */
const far = (s: number, from = 100) => [from, from * 10, from * 100].map((x) => s * x);

/** about writes a limit value, with a decimal next to it when it does not terminate. */
const about = (q: Q) => (isTerminating(q) ? q.toLatex() : `${q.toLatex()} \\approx ${fmt(q.toNumber())}`);

/** tabled checks a limit from a table of values of the expression, here called f(x), and says where the values go. */
function tabled(xs: readonly number[], f: (x: number) => number, ends: Text): Text {
  const rows = table(["$x$", ...xs.map((x) => `$${fmt(x)}$`)], ["$f(x)$", ...xs.map((x) => `$${fmt(f(x))}$`)]);
  return t(
    `Call the expression $f(x)$ and work out a few values:\n\n${rows}\n\n${ends.en}`,
    `把这个式子记作 $f(x)$，算出几个函数值：\n\n${rows}\n\n${ends["zh-CN"]}`,
  );
}

/** towards says the values of a table approach a number. */
const towards = (q: Q) => t(`The values approach $${about(q)}$.`, `这些值趋近 $${about(q)}$。`);

/** Mistake is a wrong value with what to say about it. */
type Mistake = ReturnType<typeof why>;

/** firsts keeps the first mistake for each value, so no response gets two reasons. */
function firsts(ms: readonly Mistake[]): Mistake[] {
  const key = (m: Mistake) => (typeof m.value === "number" ? Q.of(m.value) : Q.parse(String(m.value))).toString();
  return ms.filter((m, i) => ms.findIndex((n) => key(n) === key(m)) === i);
}

/** Choice is a wrong limit value with why a learner might pick it. */
type Choice = readonly [value: LimitValue, en: string, zh: string];

/** limitAsk asks for a limit as limitChoice does and gives every wrong option its reason; ∞ and −∞, which limitChoice always offers, need reasons among the choices too. */
function limitAsk(rng: Rng, prompt: Text, right: LimitValue, wrong: readonly Choice[], solution: Text, dne = false): Problem {
  const problem = limitChoice(
    rng,
    prompt,
    right,
    wrong.map((w) => w[0]),
    solution,
    undefined,
    dne,
  );
  return reasoned(
    problem,
    wrong.map(([v, en, zh]) => [limitText(v).en, en, zh] as const),
  );
}

/** calculatingLimitsOfRationalFunctionsByFactoring removes a common factor before substituting. */
export const calculatingLimitsOfRationalFunctionsByFactoring: TopicDef = {
  id: "calculating-limits-of-rational-functions-by-factoring",
  title: t("Calculating Limits of Rational Functions by Factoring", "用因式分解求分式函数的极限"),
  summary: t(
    "Evaluate limits of the form 0/0 by factoring and cancelling the common factor.",
    "通过因式分解并约去公因式，求 0/0 型的极限。",
  ),
  intro: t(
    "Put $x = 3$ into $\\frac{x^{2} - 9}{x - 3}$ and you get $\\frac{0}{0}$, which says nothing yet. But $x^{2} - 9 = (x - 3)(x + 3)$, so for every $x \\ne 3$ the fraction equals $x + 3$, and the limit at $3$ is $3 + 3 = 6$.\n\nCheck: at $x = 2.99$ the fraction is $5.99$, and at $x = 3.01$ it is $6.01$.\n\nIn this lesson we find limits of the form $\\frac{0}{0}$ by factoring and cancelling, first with one linear factor, then with quadratics and cubes in both parts.",
    "把 $x = 3$ 代入 $\\frac{x^{2} - 9}{x - 3}$ 得 $\\frac{0}{0}$，这还说明不了什么。但 $x^{2} - 9 = (x - 3)(x + 3)$，所以对每个 $x \\ne 3$，这个分式都等于 $x + 3$，在 $3$ 处的极限是 $3 + 3 = 6$。\n\n检验：$x = 2.99$ 时分式的值是 $5.99$，$x = 3.01$ 时是 $6.01$。\n\n本课我们通过因式分解并约分来求 $\\frac{0}{0}$ 型的极限，先处理一个一次公因式，再处理分子分母中的二次式和立方式。",
  ),
  prerequisites: ["the-product-and-quotient-rules-for-limits", "simplifying-rational-expressions-by-factoring"],
  encompasses: [
    { topic: "the-product-and-quotient-rules-for-limits", weight: 0.3 },
    { topic: "simplifying-rational-expressions-by-factoring", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "cancelling-a-common-linear-factor",
      title: t("Cancelling a common factor", "约去公因式"),
      explanation: t(
        "Substituting $x = a$ into a rational function may give $\\frac{0}{0}$. This says nothing about the limit yet: both numerator and denominator have the factor $(x - a)$. Factor, cancel, then substitute:\n\n$$\\lim_{x \\to 3} \\frac{x^{2} - x - 6}{x - 3} = \\lim_{x \\to 3} \\frac{(x - 3)(x + 2)}{x - 3} = \\lim_{x \\to 3} (x + 2) = 5.$$\n\nCancelling is allowed because the limit only uses $x \\ne 3$.\n\nCheck: at $x = 2.999$ the fraction is $4.999$, and at $x = 3.001$ it is $5.001$.\n\n> **Watch out.** $\\frac{0}{0}$ does not mean the limit is $0$, or $1$, or that it does not exist. It means there is a common factor to cancel first.",
        "把 $x = a$ 代入分式函数可能得到 $\\frac{0}{0}$。这还不能说明极限是什么：分子和分母都含有因式 $(x - a)$。先分解、约分，再代入：\n\n$$\\lim_{x \\to 3} \\frac{x^{2} - x - 6}{x - 3} = \\lim_{x \\to 3} \\frac{(x - 3)(x + 2)}{x - 3} = \\lim_{x \\to 3} (x + 2) = 5.$$\n\n可以约分，是因为求极限时只考虑 $x \\ne 3$。\n\n检验：$x = 2.999$ 时分式的值是 $4.999$，$x = 3.001$ 时是 $5.001$。\n\n> **注意。** $\\frac{0}{0}$ 不表示极限是 $0$ 或 $1$，也不表示极限不存在。它说明有公因式，要先约去。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const r = rng.pick(range(-6, 6).filter((v) => v !== a));
        const flip = rng.bool(0.35);
        const top = quad(1, a, r);
        const den = bare(a);
        const answer = flip ? Q.of(1, a - r) : Q.of(a - r);
        const left = flip ? `\\frac{1}{${bare(r)}}` : bare(r);
        const f = (x: number) => (flip ? 1 / (x - r) : x - r);
        return numberProblem({
          prompt: t(
            `Find $${lim(a)} ${flip ? `\\frac{${den}}{${top}}` : `\\frac{${top}}{${den}}`}$.`,
            `求 $${lim(a)} ${flip ? `\\frac{${den}}{${top}}` : `\\frac{${top}}{${den}}`}$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              Q.zero,
              "This reads $\\frac{0}{0}$ as $0$. It only says that a common factor must be cancelled first.",
              "这把 $\\frac{0}{0}$ 当成了 $0$。它只说明要先约去公因式。",
            ),
            ...(a + r === 0
              ? []
              : [
                  why(
                    flip ? Q.of(1, a + r) : Q.of(a + r),
                    `This gives the other factor the wrong sign. The factor is $${bare(r)}$, which is $${a - r}$ at $x = ${a}$.`,
                    `这把另一个因式的符号弄反了。这个因式是 $${bare(r)}$，在 $x = ${a}$ 处等于 $${a - r}$。`,
                  ),
                ]),
            why(
              answer.neg(),
              `This has the wrong sign: substitute into $${bare(r)}$, not into $${poly([-1, "x"], [r, ""])}$.`,
              `这符号错了：要代入 $${bare(r)}$，而不是 $${poly([-1, "x"], [r, ""])}$。`,
            ),
            why(
              inv(answer),
              flip
                ? `This leaves out the $1$ over the factor. After cancelling, $${bare(r)}$ is still in the denominator.`
                : `This is the reciprocal. After cancelling, $${bare(r)}$ is on top, not underneath.`,
              flip ? `这漏掉了因式上面的 $1$。约分后，$${bare(r)}$ 仍在分母中。` : `这是倒数。约分后，$${bare(r)}$ 在分子上，不在分母中。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute first", "先代入"],
                t(`At $x = ${a}$ the top and the bottom are both $0$:`, `在 $x = ${a}$ 处，分子和分母都是 $0$：`),
                ["\\frac{0}{0}"],
              ],
              [
                ["Factor and cancel", "分解并约分"],
                t(
                  `The top factors as $${top} = ${fac(a)}${fac(r)}$. Cancel $${fac(a)}$:`,
                  `分子分解为 $${top} = ${fac(a)}${fac(r)}$。约去 $${fac(a)}$：`,
                ),
                [`${lim(a)} ${left}`],
              ],
              [
                ["Substitute again", "再代入"],
                none,
                [
                  `${flip ? `\\frac{1}{${a} ${r < 0 ? "+" : "-"} ${Math.abs(r)}}` : `${a} ${r < 0 ? "+" : "-"} ${Math.abs(r)}`} = ${answer.toLatex()}`,
                ],
              ],
            ],
            tabled(near(a), f, towards(answer)),
          ),
        });
      },
    },
    {
      id: "factoring-numerator-and-denominator",
      title: t("Factoring the numerator and denominator", "分解分子与分母"),
      explanation: t(
        "When both numerator and denominator are quadratics, or a difference of cubes appears, factor both fully before cancelling:\n\n$$\\lim_{x \\to 2} \\frac{x^{2} - 4}{x^{2} - 5x + 6} = \\lim_{x \\to 2} \\frac{(x - 2)(x + 2)}{(x - 2)(x - 3)} = \\frac{4}{-1} = -4,$$\n\n$$\\lim_{x \\to a} \\frac{x^{3} - a^{3}}{x - a} = \\lim_{x \\to a} (x^{2} + ax + a^{2}) = 3a^{2}.$$\n\nCheck: at $x = 1.999$ the first fraction is about $-3.995$, and at $x = 2.001$ about $-4.005$.\n\n> **Watch out.** Substitute only after cancelling, and factor the cube correctly: $x^{3} - a^{3} = (x - a)(x^{2} + ax + a^{2})$ has three terms in the second factor, so the limit is $3a^{2}$, not $a^{2}$.",
        "当分子和分母都是二次式，或出现立方差时，先把二者完全分解再约分：\n\n$$\\lim_{x \\to 2} \\frac{x^{2} - 4}{x^{2} - 5x + 6} = \\lim_{x \\to 2} \\frac{(x - 2)(x + 2)}{(x - 2)(x - 3)} = \\frac{4}{-1} = -4,$$\n\n$$\\lim_{x \\to a} \\frac{x^{3} - a^{3}}{x - a} = \\lim_{x \\to a} (x^{2} + ax + a^{2}) = 3a^{2}.$$\n\n检验：$x = 1.999$ 时第一个分式约为 $-3.995$，$x = 2.001$ 时约为 $-4.005$。\n\n> **注意。** 约分之后才能代入；立方差要分解对：$x^{3} - a^{3} = (x - a)(x^{2} + ax + a^{2})$ 的第二个因式有三项，所以极限是 $3a^{2}$，不是 $a^{2}$。",
      ),
      generate(rng) {
        if (rng.bool(0.25)) {
          const a = rng.nonZero(-4, 4);
          const k = rng.pick([1, 1, 2, 3, -1]);
          const top = poly([k, "x^{3}"], [-k * a ** 3, ""]);
          const answer = 3 * k * a * a;
          const second = `x^{2} ${a < 0 ? "-" : "+"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}x + ${a * a}`;
          const k3 = k === 1 ? "" : k === -1 ? "-" : `${k}`;
          return numberProblem({
            prompt: t(`Find $${lim(a)} \\frac{${top}}{${bare(a)}}$.`, `求 $${lim(a)} \\frac{${top}}{${bare(a)}}$。`),
            answer,
            mistakes: firsts([
              why(0, "This reads $\\frac{0}{0}$ as $0$. Factor and cancel first.", "这把 $\\frac{0}{0}$ 当成了 $0$。要先分解、约分。"),
              why(
                k * a * a,
                `This keeps only $x^{2}$ from the second factor. All three terms of $${second}$ count: at $x = ${a}$ they give $3 \\cdot ${a * a}$.`,
                `这只保留了第二个因式中的 $x^{2}$。$${second}$ 的三项都要算：在 $x = ${a}$ 处共为 $3 \\cdot ${a * a}$。`,
              ),
              why(
                3 * k * a,
                `This uses $3a$ instead of $3a^{2}$. Each term of $${second}$ is $${a * a}$ at $x = ${a}$.`,
                `这用了 $3a$，而不是 $3a^{2}$。在 $x = ${a}$ 处，$${second}$ 的每一项都是 $${a * a}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Factor the difference of cubes", "分解立方差"],
                  none,
                  [`${top} = ${k3}${k === 1 ? "" : "("}x^{3} - ${paren(a)}^{3}${k === 1 ? "" : ")"} = ${k3}${fac(a)}(${second})`],
                ],
                [
                  ["Cancel and substitute", "约分后代入"],
                  t(`Cancel $${fac(a)}$ and put $x = ${a}$:`, `约去 $${fac(a)}$，再代入 $x = ${a}$：`),
                  [`${k3}${k === 1 ? "" : "("}${a * a} ${a < 0 ? "-" : "+"} ${a * a} + ${a * a}${k === 1 ? "" : ")"} = ${answer}`],
                ],
              ],
              tabled(near(a), (x) => (k * (x ** 3 - a ** 3)) / (x - a), towards(Q.of(answer))),
            ),
          });
        }
        const a = rng.int(-4, 4);
        const [r, s] = rng.sample(
          range(-5, 5).filter((v) => v !== a),
          2,
        ) as [number, number];
        const p = rng.pick([1, 1, 2, 3, -1, -2]);
        const q = rng.pick([1, 1, 2, 3, -1]);
        const top = quad(p, a, r);
        const den = quad(q, a, s);
        const answer = Q.of(p * (a - r), q * (a - s));
        return numberProblem({
          prompt: t(`Find $${lim(a)} \\frac{${top}}{${den}}$.`, `求 $${lim(a)} \\frac{${top}}{${den}}$。`),
          answer,
          mistakes: firsts([
            why(
              Q.zero,
              "This reads $\\frac{0}{0}$ as $0$. Factor both parts and cancel first.",
              "这把 $\\frac{0}{0}$ 当成了 $0$。要先把分子分母都分解并约分。",
            ),
            why(
              Q.of(p, q),
              "This is the ratio of the leading coefficients, the limit as $x \\to \\infty$. Here $x$ approaches a number.",
              "这是首项系数之比，是 $x \\to \\infty$ 时的极限。这里 $x$ 趋于一个数。",
            ),
            ...(q * (a + s) === 0
              ? []
              : [
                  why(
                    Q.of(p * (a + r), q * (a + s)),
                    `This gives the remaining factors the wrong signs. They are $${bare(r)}$ and $${bare(s)}$.`,
                    `这把剩下的因式符号弄反了。它们是 $${bare(r)}$ 和 $${bare(s)}$。`,
                  ),
                ]),
            why(
              inv(answer),
              "This turns the fraction upside down. Keep the top factor on top.",
              "这把分式颠倒了。分子的因式要留在分子上。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute first", "先代入"],
                t(
                  `At $x = ${a}$ both parts are $0$, so there is a common factor $${fac(a)}$.`,
                  `在 $x = ${a}$ 处分子分母都是 $0$，所以有公因式 $${fac(a)}$。`,
                ),
              ],
              [
                ["Factor both parts", "分解分子与分母"],
                none,
                [`\\frac{${top}}{${den}} = \\frac{${cx(p, `${fac(a)}${fac(r)}`)}}{${cx(q, `${fac(a)}${fac(s)}`)}}`],
              ],
              [
                ["Cancel and substitute", "约分后代入"],
                t(`Cancel $${fac(a)}$ and put $x = ${a}$:`, `约去 $${fac(a)}$，再代入 $x = ${a}$：`),
                [`\\frac{${p * (a - r)}}{${q * (a - s)}} = ${answer.toLatex()}`],
              ],
            ],
            tabled(near(a), (x) => (p * (x - r)) / (q * (x - s)), towards(answer)),
          ),
        });
      },
    },
  ],
};

/** limitsOfAbsoluteValueFunctions finds limits of functions containing |x − a|. */
export const limitsOfAbsoluteValueFunctions: TopicDef = {
  id: "limits-of-absolute-value-functions",
  title: t("Limits of Absolute Value Functions", "绝对值函数的极限"),
  summary: t(
    "Find limits of functions containing absolute values, splitting into one-sided limits where the expression inside changes sign.",
    "求含绝对值的函数的极限；在绝对值内的式子变号处分成单侧极限讨论。",
  ),
  intro: t(
    "The graph of $|x - 2|$ has a corner at $x = 2$ but no break. Near $x = 5$ the inside is positive, so $|x - 2| = x - 2$ there and $\\lim_{x \\to 5} |x - 2| = 3$. Near $x = 2$ the inside changes sign: $|x - 2|$ is $x - 2$ on the right and $-(x - 2)$ on the left.\n\nCheck: $|4.99 - 2| = 2.99$ and $|5.01 - 2| = 3.01$, both close to $3$.\n\nIn this lesson we find limits of absolute value functions by substitution, and where the inside changes sign we find each one-sided limit.",
    "$|x - 2|$ 的图象在 $x = 2$ 处有一个尖角，但没有断开。在 $x = 5$ 附近，绝对值里面是正的，所以那里 $|x - 2| = x - 2$，$\\lim_{x \\to 5} |x - 2| = 3$。在 $x = 2$ 附近里面的式子变号：右侧 $|x - 2| = x - 2$，左侧 $|x - 2| = -(x - 2)$。\n\n检验：$|4.99 - 2| = 2.99$，$|5.01 - 2| = 3.01$，都接近 $3$。\n\n本课我们用代入法求绝对值函数的极限；在绝对值里面变号的地方，分别求两个单侧极限。",
  ),
  prerequisites: [
    "finding-the-existence-of-a-limit-using-one-sided-limits",
    "calculating-limits-of-rational-functions-by-factoring",
    "absolute-value-graphs",
  ],
  encompasses: [{ topic: "finding-the-existence-of-a-limit-using-one-sided-limits", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "absolute-value-limits-by-substitution",
      title: t("Limits by substitution", "代入法求极限"),
      explanation: t(
        "An absolute value function has no breaks, so a limit of $|g(x)|$ plus a polynomial is found by substituting, keeping the absolute value:\n\n$$\\lim_{x \\to 1} \\left(2|x - 4| + 3x\\right) = 2|{-3}| + 3 = 9.$$\n\nCheck: at $x = 0.99$ the expression is $6.02 + 2.97 = 8.99$, and at $x = 1.01$ it is $5.98 + 3.03 = 9.01$.\n\n> **Watch out.** Work out the number inside first, then take its absolute value: $|1 - 4| = |{-3}| = 3$, not $-3$. An absolute value is never negative.",
        "绝对值函数没有间断，所以 $|g(x)|$ 加上多项式的极限可直接代入求得，注意保留绝对值：\n\n$$\\lim_{x \\to 1} \\left(2|x - 4| + 3x\\right) = 2|{-3}| + 3 = 9.$$\n\n检验：$x = 0.99$ 时式子的值是 $6.02 + 2.97 = 8.99$，$x = 1.01$ 时是 $5.98 + 3.03 = 9.01$。\n\n> **注意。** 先算出绝对值里面的数，再取绝对值：$|1 - 4| = |{-3}| = 3$，不是 $-3$。绝对值永远不是负数。",
      ),
      generate(rng) {
        const a = rng.int(-5, 5);
        const b = rng.pick(range(-6, 6).filter((v) => v !== a));
        const k = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
        const c = rng.int(-4, 4);
        const expr = poly([k, `|${bare(a)}|`], [c, "x"]);
        const answer = k * Math.abs(b - a) + c * b;
        const sign = t(
          `This gives $|${b - a}|$ the wrong sign. An absolute value is never negative: $|${b - a}| = ${Math.abs(b - a)}$.`,
          `这把 $|${b - a}|$ 的符号弄错了。绝对值永远不是负数：$|${b - a}| = ${Math.abs(b - a)}$。`,
        );
        return numberProblem({
          prompt: t(`Find $${lim(b)} \\left(${expr}\\right)$.`, `求 $${lim(b)} \\left(${expr}\\right)$。`),
          answer,
          mistakes: firsts([
            why(k * (b - a) + c * b, sign.en, sign["zh-CN"]),
            why(k * (a - b) + c * b, sign.en, sign["zh-CN"]),
            why(
              k * Math.abs(b + a) + c * b,
              `This adds $${a}$ inside the absolute value. The inside is $${bare(a)}$, which is $${b - a}$ at $x = ${b}$.`,
              `这在绝对值里加上了 $${a}$。里面是 $${bare(a)}$，在 $x = ${b}$ 处等于 $${b - a}$。`,
            ),
            why(
              k * Math.abs(b - a) - c * b,
              `This changes the sign of the $${cx(c, "x")}$ term. At $x = ${b}$ it is $${c * b}$.`,
              `这把 $${cx(c, "x")}$ 一项的符号弄反了。在 $x = ${b}$ 处它等于 $${c * b}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Work out the inside", "先算绝对值里面"],
                t(
                  `The function has no break at $x = ${b}$, so substitute. Inside the absolute value:`,
                  `函数在 $x = ${b}$ 处没有间断，所以直接代入。绝对值里面是：`,
                ),
                [`${b} ${a < 0 ? "+" : "-"} ${Math.abs(a)} = ${b - a}, \\quad |${b - a}| = ${Math.abs(b - a)}`],
              ],
              [["Finish the substitution", "完成代入"], none, [`${poly([k, `|${b - a}|`], [c, `(${b})`])} = ${answer}`]],
            ],
            tabled(near(b), (x) => k * Math.abs(x - a) + c * x, towards(Q.of(answer))),
          ),
        });
      },
    },
    {
      id: "absolute-value-limits-at-a-sign-change",
      title: t("Limits where the expression changes sign", "在式子变号处的极限"),
      explanation: t(
        "Near $x = a$, $|x - a| = x - a$ for $x > a$ and $|x - a| = -(x - a)$ for $x < a$. So\n\n$$\\lim_{x \\to a^{+}} \\frac{|x - a|}{x - a} = 1, \\qquad \\lim_{x \\to a^{-}} \\frac{|x - a|}{x - a} = -1,$$\n\nand the two-sided limit does not exist. Replace the absolute value by the right expression on each side, then simplify.\n\nCheck: with $a = 2$, at $x = 2.001$ the fraction is $\\frac{0.001}{0.001} = 1$, and at $x = 1.999$ it is $\\frac{0.001}{-0.001} = -1$.\n\n> **Watch out.** $|x - a|$ is not $x - a$ on both sides: on the left it is $-(x - a)$. A two-sided limit needs both sides to agree, so one side alone is not enough.",
        "在 $x = a$ 附近，$x > a$ 时 $|x - a| = x - a$，$x < a$ 时 $|x - a| = -(x - a)$。所以\n\n$$\\lim_{x \\to a^{+}} \\frac{|x - a|}{x - a} = 1, \\qquad \\lim_{x \\to a^{-}} \\frac{|x - a|}{x - a} = -1,$$\n\n双侧极限不存在。在每一侧把绝对值换成相应的式子，再化简。\n\n检验：取 $a = 2$，$x = 2.001$ 时分式是 $\\frac{0.001}{0.001} = 1$，$x = 1.999$ 时是 $\\frac{0.001}{-0.001} = -1$。\n\n> **注意。** $|x - a|$ 并不是在两侧都等于 $x - a$：在左侧它等于 $-(x - a)$。双侧极限要求两侧一致，只看一侧是不够的。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const side = rng.pick([-1, 1, 0] as const);
        const form = rng.int(0, 1);
        const at = side === 0 ? lim(a) : lim(a, side);
        const bounded = (hi: number, lo: number): Choice[] => [
          [
            "inf",
            `Near $x = ${a}$ the function stays close to $${hi}$ on the right and $${lo}$ on the left, so it does not grow without bound.`,
            `在 $x = ${a}$ 附近，函数在右侧接近 $${hi}$，在左侧接近 $${lo}$，并不会无限增大。`,
          ],
          [
            "-inf",
            `Near $x = ${a}$ the function stays close to $${hi}$ or $${lo}$, so it does not fall without bound.`,
            `在 $x = ${a}$ 附近，函数接近 $${hi}$ 或 $${lo}$，并不会无限减小。`,
          ],
        ];
        const sideReasons = (hi: number, lo: number): Choice[] => [
          [
            Q.of(hi),
            side === 0
              ? `This is only the right-sided limit. The left-sided limit is $${lo}$, so the two-sided limit does not exist.`
              : `This is the right-sided limit, for $x > ${a}$. The question asks for the left side.`,
            side === 0 ? `这只是右极限。左极限是 $${lo}$，所以双侧极限不存在。` : `这是右极限（$x > ${a}$）。题目问的是左侧。`,
          ],
          [
            Q.of(lo),
            side === 0
              ? `This is only the left-sided limit. The right-sided limit is $${hi}$, so the two-sided limit does not exist.`
              : `This is the left-sided limit, for $x < ${a}$. The question asks for the right side.`,
            side === 0 ? `这只是左极限。右极限是 $${hi}$，所以双侧极限不存在。` : `这是左极限（$x < ${a}$）。题目问的是右侧。`,
          ],
          [
            "dne",
            "The one-sided limit asked for exists: on one side the absolute value has a single formula.",
            "所问的单侧极限存在：在一侧，绝对值只有一个式子。",
          ],
        ];
        const verdict = (hi: number, lo: number) =>
          side === 0
            ? t(
                `The one-sided limits are $${hi}$ and $${lo}$. They differ, so the limit does not exist.`,
                `两个单侧极限是 $${hi}$ 和 $${lo}$，不相等，所以极限不存在。`,
              )
            : side > 0
              ? t(`The question asks for the right side, so the limit is $${hi}$.`, `题目问的是右侧，所以极限是 $${hi}$。`)
              : t(`The question asks for the left side, so the limit is $${lo}$.`, `题目问的是左侧，所以极限是 $${lo}$。`);
        const ends = (hi: number, lo: number) =>
          t(
            `Just right of $${a}$ the values are near $${hi}$; just left of it they are near $${lo}$.`,
            `在 $${a}$ 右侧附近，函数值接近 $${hi}$；在左侧附近，接近 $${lo}$。`,
          );
        if (form === 0) {
          const k = rng.nonZero(-5, 5);
          const c = rng.int(-4, 4);
          const expr = `\\frac{${cx(k, `|${bare(a)}|`)}}{${bare(a)}}${c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`}`;
          const hi = c + k;
          const lo = c - k;
          const answer: LimitValue = side > 0 ? Q.of(hi) : side < 0 ? Q.of(lo) : "dne";
          const plus = (v: number) => (c === 0 ? `${v}` : `${v} ${c > 0 ? "+" : "-"} ${Math.abs(c)} = ${v + c}`);
          return limitAsk(
            rng,
            t(`Find $${at} ${expr}$.`, `求 $${at} ${expr}$。`),
            answer,
            [
              ...sideReasons(hi, lo),
              [
                Q.of(c),
                `This drops the fraction. It does not tend to $0$: it is $${k}$ on the right and $${-k}$ on the left.`,
                `这把分式丢掉了。分式不趋于 $0$：它在右侧等于 $${k}$，在左侧等于 $${-k}$。`,
              ],
              ...bounded(hi, lo),
            ],
            walked(
              [
                [
                  ["The right side", "右侧"],
                  t(
                    `For $x > ${a}$, $|${bare(a)}| = ${bare(a)}$, so the fraction is $${k}$:`,
                    `当 $x > ${a}$ 时 $|${bare(a)}| = ${bare(a)}$，分式等于 $${k}$：`,
                  ),
                  [`${lim(a, 1)} \\left(${expr}\\right) = ${plus(k)}`],
                ],
                [
                  ["The left side", "左侧"],
                  t(
                    `For $x < ${a}$, $|${bare(a)}| = -${fac(a)}$, so the fraction is $${-k}$:`,
                    `当 $x < ${a}$ 时 $|${bare(a)}| = -${fac(a)}$，分式等于 $${-k}$：`,
                  ),
                  [`${lim(a, -1)} \\left(${expr}\\right) = ${plus(-k)}`],
                ],
                [["Answer the question", "回答问题"], verdict(hi, lo)],
              ],
              tabled(near(a), (x) => (k * Math.abs(x - a)) / (x - a) + c, ends(hi, lo)),
            ),
            true,
          );
        }
        const expr = `\\frac{${poly([1, "x^{2}"], [-a * a, ""])}}{|${bare(a)}|}`;
        const hi = 2 * a;
        const lo = -2 * a;
        const answer: LimitValue = side > 0 ? Q.of(hi) : side < 0 ? Q.of(lo) : "dne";
        return limitAsk(
          rng,
          t(`Find $${at} ${expr}$.`, `求 $${at} ${expr}$。`),
          answer,
          [
            ...sideReasons(hi, lo),
            [
              Q.zero,
              `This is the top at $x = ${a}$. The bottom is $0$ there too, so cancel first: the quotient is $\\pm${fac(-a)}$.`,
              `这是分子在 $x = ${a}$ 处的值。那里分母也是 $0$，要先约分：商是 $\\pm${fac(-a)}$。`,
            ],
            ...bounded(hi, lo),
          ],
          walked(
            [
              [
                ["The right side", "右侧"],
                t(
                  `Factor the top: $x^{2} - ${a * a} = ${fac(a)}${fac(-a)}$. For $x > ${a}$, $|${bare(a)}| = ${bare(a)}$:`,
                  `分解分子：$x^{2} - ${a * a} = ${fac(a)}${fac(-a)}$。当 $x > ${a}$ 时 $|${bare(a)}| = ${bare(a)}$：`,
                ),
                [`${lim(a, 1)} ${fac(-a)} = ${hi}`],
              ],
              [
                ["The left side", "左侧"],
                t(
                  `For $x < ${a}$, $|${bare(a)}| = -${fac(a)}$, so the quotient is $-${fac(-a)}$:`,
                  `当 $x < ${a}$ 时 $|${bare(a)}| = -${fac(a)}$，商等于 $-${fac(-a)}$：`,
                ),
                [`${lim(a, -1)} \\left(-${fac(-a)}\\right) = ${lo}`],
              ],
              [["Answer the question", "回答问题"], verdict(hi, lo)],
            ],
            tabled(near(a), (x) => (x * x - a * a) / Math.abs(x - a), ends(hi, lo)),
          ),
          true,
        );
      },
    },
  ],
};

/** calculatingLimitsOfRadicalFunctionsUsingConjugateMultiplication resolves 0/0 with a conjugate. */
export const calculatingLimitsOfRadicalFunctionsUsingConjugateMultiplication: TopicDef = {
  id: "calculating-limits-of-radical-functions-using-conjugate-multiplication",
  title: t("Calculating Limits of Radical Functions Using Conjugate Multiplication", "用共轭相乘求根式函数的极限"),
  summary: t(
    "Evaluate limits of the form 0/0 containing a square root by multiplying by the conjugate.",
    "对含平方根的 0/0 型极限，乘以共轭式后求值。",
  ),
  intro: t(
    "At $x = 4$, $\\frac{\\sqrt{x} - 2}{x - 4}$ is $\\frac{0}{0}$, and there is nothing to factor. Multiply top and bottom by $\\sqrt{x} + 2$: the top becomes $(\\sqrt{x})^{2} - 2^{2} = x - 4$, which cancels, leaving $\\frac{1}{\\sqrt{x} + 2} \\to \\frac{1}{4}$.\n\nCheck: at $x = 4.01$ the fraction is about $0.2498$, and at $x = 3.99$ about $0.2502$, both close to $0.25$.\n\nIn this lesson we multiply by the conjugate to remove a square root, with the root in the numerator or in the denominator, and then cancel the common factor.",
    "在 $x = 4$ 处，$\\frac{\\sqrt{x} - 2}{x - 4}$ 是 $\\frac{0}{0}$，又没有可以直接分解的式子。分子分母同乘 $\\sqrt{x} + 2$：分子变为 $(\\sqrt{x})^{2} - 2^{2} = x - 4$，可以约去，剩下 $\\frac{1}{\\sqrt{x} + 2} \\to \\frac{1}{4}$。\n\n检验：$x = 4.01$ 时分式约为 $0.2498$，$x = 3.99$ 时约为 $0.2502$，都接近 $0.25$。\n\n本课我们乘以共轭式去掉平方根（根式在分子或在分母），再约去公因式。",
  ),
  prerequisites: ["calculating-limits-of-rational-functions-by-factoring", "rationalizing-two-term-denominators"],
  encompasses: [
    { topic: "calculating-limits-of-rational-functions-by-factoring", weight: 0.3 },
    { topic: "rationalizing-two-term-denominators", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "conjugate-multiplication-in-the-numerator",
      title: t("A root in the numerator", "分子含根式"),
      explanation: t(
        "If $\\sqrt{g(x)} - r$ tends to $0$, multiply top and bottom by the conjugate $\\sqrt{g(x)} + r$; the difference of squares removes the root:\n\n$$\\lim_{x \\to 5} \\frac{\\sqrt{x + 4} - 3}{x - 5} = \\lim_{x \\to 5} \\frac{(x + 4) - 9}{(x - 5)(\\sqrt{x + 4} + 3)} = \\lim_{x \\to 5} \\frac{1}{\\sqrt{x + 4} + 3} = \\frac{1}{6}.$$\n\nCheck: at $x = 5.01$ the fraction is about $0.1666$, and $\\frac{1}{6} \\approx 0.1667$.\n\n> **Watch out.** The conjugate changes only the sign between the two terms: for $\\sqrt{x + 4} - 3$ it is $\\sqrt{x + 4} + 3$. After cancelling, the conjugate is still there, and at $x = 5$ it is $3 + 3 = 6$, not $3$.",
        "若 $\\sqrt{g(x)} - r$ 趋于 $0$，分子分母同乘共轭式 $\\sqrt{g(x)} + r$，平方差会消去根号：\n\n$$\\lim_{x \\to 5} \\frac{\\sqrt{x + 4} - 3}{x - 5} = \\lim_{x \\to 5} \\frac{(x + 4) - 9}{(x - 5)(\\sqrt{x + 4} + 3)} = \\lim_{x \\to 5} \\frac{1}{\\sqrt{x + 4} + 3} = \\frac{1}{6}.$$\n\n检验：$x = 5.01$ 时分式约为 $0.1666$，而 $\\frac{1}{6} \\approx 0.1667$。\n\n> **注意。** 共轭式只改变两项之间的符号：$\\sqrt{x + 4} - 3$ 的共轭式是 $\\sqrt{x + 4} + 3$。约分后共轭式还在，它在 $x = 5$ 处等于 $3 + 3 = 6$，不是 $3$。",
      ),
      generate(rng) {
        const r = rng.int(1, 6);
        const p = rng.pick([1, 1, 2, 3]);
        const a = rng.int(-4, 6);
        const b = r * r - p * a;
        const inner = poly([p, "x"], [b, ""]);
        const flip = rng.bool(0.35);
        const top = `\\sqrt{${inner}} - ${r}`;
        const den = bare(a);
        const answer = flip ? Q.of(2 * r, p) : Q.of(p, 2 * r);
        const f = (x: number) => {
          const v = (Math.sqrt(p * x + b) - r) / (x - a);
          return flip ? 1 / v : v;
        };
        const left = flip ? `\\frac{\\sqrt{${inner}} + ${r}}{${p}}` : `\\frac{${p}}{\\sqrt{${inner}} + ${r}}`;
        return numberProblem({
          prompt: t(
            `Find $${lim(a)} ${flip ? `\\frac{${den}}{${top}}` : `\\frac{${top}}{${den}}`}$.`,
            `求 $${lim(a)} ${flip ? `\\frac{${den}}{${top}}` : `\\frac{${top}}{${den}}`}$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              Q.zero,
              "This reads $\\frac{0}{0}$ as $0$. Multiply by the conjugate and cancel first.",
              "这把 $\\frac{0}{0}$ 当成了 $0$。要先乘共轭式再约分。",
            ),
            why(
              inv(answer),
              flip
                ? "This turns the answer upside down: the conjugate ends up on top."
                : "This turns the answer upside down: the conjugate ends up underneath.",
              flip ? "这把结果颠倒了：共轭式最后在分子上。" : "这把结果颠倒了：共轭式最后在分母中。",
            ),
            why(
              flip ? Q.of(r, p) : Q.of(p, r),
              `This takes the conjugate as $${r}$. At $x = ${a}$ it is $\\sqrt{${r * r}} + ${r} = ${2 * r}$.`,
              `这把共轭式当成了 $${r}$。在 $x = ${a}$ 处它等于 $\\sqrt{${r * r}} + ${r} = ${2 * r}$。`,
            ),
            why(
              flip ? Q.of(2 * r) : Q.of(1, 2 * r),
              `This drops the coefficient $${p}$ of $x$ under the root. The root difference becomes $${cx(p, fac(a))}$.`,
              `这漏掉了根号下 $x$ 的系数 $${p}$。根式之差变为 $${cx(p, fac(a))}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Multiply by the conjugate", "乘以共轭式"],
                t(
                  `Multiply top and bottom by $\\sqrt{${inner}} + ${r}$. The root difference becomes`,
                  `分子分母同乘 $\\sqrt{${inner}} + ${r}$。根式之差变为`,
                ),
                [`(${inner}) - ${r * r} = ${cx(p, fac(a))}`],
              ],
              [["Cancel", "约分"], t(`Cancel $${fac(a)}$:`, `约去 $${fac(a)}$：`), [`${lim(a)} ${left}`]],
              [
                ["Substitute", "代入"],
                t(
                  `At $x = ${a}$ the conjugate is $\\sqrt{${r * r}} + ${r} = ${2 * r}$:`,
                  `在 $x = ${a}$ 处共轭式等于 $\\sqrt{${r * r}} + ${r} = ${2 * r}$：`,
                ),
                [`${flip ? `\\frac{${2 * r}}{${p}}` : `\\frac{${p}}{${2 * r}}`} = ${answer.toLatex()}`],
              ],
            ],
            tabled(near(a), f, towards(answer)),
          ),
        });
      },
    },
    {
      id: "conjugate-multiplication-with-a-quadratic",
      title: t("Conjugates with a quadratic factor", "共轭与二次因式"),
      explanation: t(
        "Multiplying by the conjugate removes the radical from the denominator, and then factoring the quadratic reveals the common factor that causes zero over zero. After multiplying by the conjugate, factor what remains before cancelling:\n\n$$\\lim_{x \\to 1} \\frac{x^{2} + 2x - 3}{\\sqrt{x + 3} - 2} = \\lim_{x \\to 1} \\frac{(x - 1)(x + 3)(\\sqrt{x + 3} + 2)}{x - 1} = 4 \\cdot 4 = 16.$$\n\nCheck: at $x = 0.99$ the fraction is about $15.95$, and at $x = 1.01$ about $16.05$.\n\n> **Watch out.** The conjugate $\\sqrt{x + 3} + 2$ moves to the top, and it stays there. At $x = 1$ it is $4$, which is why the answer is $16$ and not $4$.",
        "乘以共轭式可以去掉分母中的根式，再把二次式因式分解，就能找到造成零比零的公因式。乘以共轭式后，先把剩余部分分解再约分：\n\n$$\\lim_{x \\to 1} \\frac{x^{2} + 2x - 3}{\\sqrt{x + 3} - 2} = \\lim_{x \\to 1} \\frac{(x - 1)(x + 3)(\\sqrt{x + 3} + 2)}{x - 1} = 4 \\cdot 4 = 16.$$\n\n检验：$x = 0.99$ 时分式约为 $15.95$，$x = 1.01$ 时约为 $16.05$。\n\n> **注意。** 共轭式 $\\sqrt{x + 3} + 2$ 移到了分子上，并且一直留在那里。它在 $x = 1$ 处等于 $4$，所以答案是 $16$，不是 $4$。",
      ),
      generate(rng) {
        const r = rng.int(1, 5);
        const a = rng.int(-4, 5);
        const b = r * r - a;
        const s = rng.pick(range(-5, 5).filter((v) => v !== a));
        const top = quad(1, a, s);
        const answer = (a - s) * 2 * r;
        const inner = poly([1, "x"], [b, ""]);
        return numberProblem({
          prompt: t(
            `Find $${lim(a)} \\frac{${top}}{\\sqrt{${inner}} - ${r}}$.`,
            `求 $${lim(a)} \\frac{${top}}{\\sqrt{${inner}} - ${r}}$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              0,
              "This reads $\\frac{0}{0}$ as $0$. Multiply by the conjugate and cancel first.",
              "这把 $\\frac{0}{0}$ 当成了 $0$。要先乘共轭式再约分。",
            ),
            why(
              a - s,
              `This drops the conjugate. It moves to the top and is $${r} + ${r} = ${2 * r}$ at $x = ${a}$.`,
              `这漏掉了共轭式。它移到分子上，在 $x = ${a}$ 处等于 $${r} + ${r} = ${2 * r}$。`,
            ),
            why(
              Q.of(a - s, 2 * r),
              `This divides by the conjugate. Multiplying the bottom by it moves it to the top, where it multiplies.`,
              `这除以了共轭式。分母乘以共轭式后，它出现在分子上，是乘而不是除。`,
            ),
            why(
              (a + s) * 2 * r,
              `This gives the other factor the wrong sign. It is $${bare(s)}$, which is $${a - s}$ at $x = ${a}$.`,
              `这把另一个因式的符号弄反了。它是 $${bare(s)}$，在 $x = ${a}$ 处等于 $${a - s}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Multiply by the conjugate", "乘以共轭式"],
                t(
                  `Multiply top and bottom by $\\sqrt{${inner}} + ${r}$. The bottom becomes`,
                  `分子分母同乘 $\\sqrt{${inner}} + ${r}$。分母变为`,
                ),
                [`(${inner}) - ${r * r} = ${bare(a)}`],
              ],
              [
                ["Factor and cancel", "分解并约分"],
                t(
                  `The top factors as $${top} = ${fac(a)}${fac(s)}$. Cancel $${fac(a)}$:`,
                  `分子分解为 $${top} = ${fac(a)}${fac(s)}$。约去 $${fac(a)}$：`,
                ),
                [`${lim(a)} ${fac(s)}\\left(\\sqrt{${inner}} + ${r}\\right)`],
              ],
              [["Substitute", "代入"], none, [`(${a - s})(${r} + ${r}) = ${answer}`]],
            ],
            tabled(near(a), (x) => ((x - a) * (x - s)) / (Math.sqrt(x + b) - r), towards(Q.of(answer))),
          ),
        });
      },
    },
  ],
};

/** IdentityForm is a trigonometric quotient that simplifies by an identity, with the angles where it is 0/0, its value there and the angle as a number. */
interface IdentityForm {
  readonly top: string;
  readonly bottom: string;
  readonly simplified: string;
  readonly f: (x: number) => number;
  readonly g: (x: number) => number;
  readonly at: readonly (readonly [string, number, number])[];
}

const { sin, cos, PI } = Math;

const pythagoreanForms: readonly IdentityForm[] = [
  {
    top: "\\sin^{2} x",
    bottom: "1 - \\cos x",
    simplified: "1 + \\cos x",
    f: (x) => sin(x) ** 2,
    g: (x) => 1 - cos(x),
    at: [
      ["0", 2, 0],
      ["2\\pi", 2, 2 * PI],
    ],
  },
  {
    top: "\\sin^{2} x",
    bottom: "1 + \\cos x",
    simplified: "1 - \\cos x",
    f: (x) => sin(x) ** 2,
    g: (x) => 1 + cos(x),
    at: [
      ["\\pi", 2, PI],
      ["-\\pi", 2, -PI],
    ],
  },
  {
    top: "\\cos^{2} x",
    bottom: "1 - \\sin x",
    simplified: "1 + \\sin x",
    f: (x) => cos(x) ** 2,
    g: (x) => 1 - sin(x),
    at: [["\\frac{\\pi}{2}", 2, PI / 2]],
  },
  {
    top: "\\cos^{2} x",
    bottom: "1 + \\sin x",
    simplified: "1 - \\sin x",
    f: (x) => cos(x) ** 2,
    g: (x) => 1 + sin(x),
    at: [
      ["-\\frac{\\pi}{2}", 2, -PI / 2],
      ["\\frac{3\\pi}{2}", 2, (3 * PI) / 2],
    ],
  },
  {
    top: "1 - \\cos x",
    bottom: "\\sin^{2} x",
    simplified: "\\frac{1}{1 + \\cos x}",
    f: (x) => 1 - cos(x),
    g: (x) => sin(x) ** 2,
    at: [
      ["0", 0.5, 0],
      ["2\\pi", 0.5, 2 * PI],
    ],
  },
  {
    top: "1 - \\sin x",
    bottom: "\\cos^{2} x",
    simplified: "\\frac{1}{1 + \\sin x}",
    f: (x) => 1 - sin(x),
    g: (x) => cos(x) ** 2,
    at: [["\\frac{\\pi}{2}", 0.5, PI / 2]],
  },
  {
    top: "1 + \\sin x",
    bottom: "\\cos^{2} x",
    simplified: "\\frac{1}{1 - \\sin x}",
    f: (x) => 1 + sin(x),
    g: (x) => cos(x) ** 2,
    at: [["-\\frac{\\pi}{2}", 0.5, -PI / 2]],
  },
];

const doubleAngleForms: readonly IdentityForm[] = [
  {
    top: "\\sin 2x",
    bottom: "\\sin x",
    simplified: "2\\cos x",
    f: (x) => sin(2 * x),
    g: (x) => sin(x),
    at: [
      ["0", 2, 0],
      ["\\pi", -2, PI],
    ],
  },
  {
    top: "\\sin 2x",
    bottom: "\\cos x",
    simplified: "2\\sin x",
    f: (x) => sin(2 * x),
    g: (x) => cos(x),
    at: [
      ["\\frac{\\pi}{2}", 2, PI / 2],
      ["-\\frac{\\pi}{2}", -2, -PI / 2],
    ],
  },
  {
    top: "\\cos 2x",
    bottom: "\\cos x - \\sin x",
    simplified: "\\cos x + \\sin x",
    f: (x) => cos(2 * x),
    g: (x) => cos(x) - sin(x),
    at: [
      ["\\frac{\\pi}{4}", Math.SQRT2, PI / 4],
      ["\\frac{5\\pi}{4}", -Math.SQRT2, (5 * PI) / 4],
    ],
  },
  {
    top: "\\cos 2x",
    bottom: "\\cos x + \\sin x",
    simplified: "\\cos x - \\sin x",
    f: (x) => cos(2 * x),
    g: (x) => cos(x) + sin(x),
    at: [
      ["-\\frac{\\pi}{4}", Math.SQRT2, -PI / 4],
      ["\\frac{3\\pi}{4}", -Math.SQRT2, (3 * PI) / 4],
    ],
  },
  {
    top: "1 - \\cos 2x",
    bottom: "\\sin^{2} x",
    simplified: "2",
    f: (x) => 1 - cos(2 * x),
    g: (x) => sin(x) ** 2,
    at: [
      ["0", 2, 0],
      ["\\pi", 2, PI],
    ],
  },
];

/** identityLimit draws a form, an angle where it is 0/0 and a ratio k/q of multiples, and states the limit. */
function identityLimit(rng: Rng, forms: readonly IdentityForm[], identity: { en: string; zh: string }) {
  const form = rng.pick(forms);
  const [at, value, x0] = rng.pick(form.at);
  const k = rng.pick([1, 1, 2, 3, 4, -1, -2, 5]);
  const q = rng.pick([1, 1, 1, 2, 3, -1]);
  const ratio = Q.of(k, q);
  const rootTwo = Math.abs(Math.abs(value) - Math.SQRT2) < 1e-9;
  const scaled = rootTwo ? ratio.mul(Q.of(Math.sign(value))) : ratio.mul(Q.of(Math.round(value * 2), 2));
  const answer = rootTwo ? radical(scaled, 2) : scaled.toLatex();
  const negated = rootTwo ? radical(scaled.neg(), 2) : scaled.neg().toLatex();
  const top =
    k === 1 ? form.top : `${k}(${form.top})`.replace(/^(-?\d+)\((\\[a-z]+(?:\^\{2\})? ?\d?x)\)$/, "$1$2").replace(/^-1(?=[(\\])/, "-");
  const bottom =
    q === 1
      ? form.bottom
      : `${q}(${form.bottom})`.replace(/^(-?\d+)\((\\[a-z]+(?:\^\{2\})? ?\d?x)\)$/, "$1$2").replace(/^-1(?=[(\\])/, "-");
  const expr = `\\frac{${top}}{${bottom}}`;
  const v = rootTwo ? radical(Q.of(Math.sign(value)), 2) : Q.of(Math.round(value * 2), 2).toLatex();
  const vp = value < 0 && !ratio.eq(Q.one) ? `\\left(${v}\\right)` : v;
  const h = (x: number) => (k * form.f(x)) / (q * form.g(x));
  const target = ratio.toNumber() * value;
  const near = (d: number) => fmt(h(x0 + d));
  const shown = rootTwo ? `${answer} \\approx ${fmt(target)}` : about(scaled);
  const mistakes = [
    {
      response: "0",
      why: t("This reads $\\frac{0}{0}$ as $0$. Simplify with the identity first.", "这把 $\\frac{0}{0}$ 当成了 $0$。要先用恒等式化简。"),
    },
    {
      response: negated,
      why: t(
        `This has the wrong sign. At $x = ${at}$, $${form.simplified} = ${v}$.`,
        `这符号错了。在 $x = ${at}$ 处，$${form.simplified} = ${v}$。`,
      ),
    },
    {
      response: ratio.toLatex(),
      why: t(
        `This keeps only the constant $${ratio.toLatex()}$. The simplified quotient $${form.simplified}$ is $${v}$ at $x = ${at}$, and it multiplies the constant.`,
        `这只保留了常数 $${ratio.toLatex()}$。化简后的 $${form.simplified}$ 在 $x = ${at}$ 处等于 $${v}$，还要乘上这个常数。`,
      ),
    },
  ].filter((m, i, all) => m.response !== answer && all.findIndex((n) => n.response === m.response) === i);
  return withMistakes(
    functionProblem({
      prompt: t(`Find $${lim(at)} ${expr}$.`, `求 $${lim(at)} ${expr}$。`),
      answer,
      wrong: mistakes.map((m) => m.response),
      solution: walked(
        [
          [
            ["Substitute first", "先代入"],
            t(
              `At $x = ${at}$ the top and the bottom are both $0$, so simplify first.`,
              `在 $x = ${at}$ 处分子分母都是 $0$，所以要先化简。`,
            ),
          ],
          [["Simplify", "化简"], t(`${identity.en}`, `${identity.zh}`), [`\\frac{${form.top}}{${form.bottom}} = ${form.simplified}`]],
          [["Substitute", "代入"], none, [`${ratio.eq(Q.one) ? "" : `${ratio.toLatex()} \\cdot `}${vp} = ${answer}`]],
        ],
        t(
          `Estimate numerically. At $x = ${at} - 0.001$ the expression is about $${near(-0.001)}$, and at $x = ${at} + 0.001$ about $${near(0.001)}$. Both are close to $${shown}$.`,
          `用数值估计。$x = ${at} - 0.001$ 时式子约为 $${near(-0.001)}$，$x = ${at} + 0.001$ 时约为 $${near(0.001)}$，都接近 $${shown}$。`,
        ),
      ),
    }),
    mistakes,
  );
}

/** calculatingLimitsUsingTrigonometricIdentities resolves 0/0 with trigonometric identities. */
export const calculatingLimitsUsingTrigonometricIdentities: TopicDef = {
  id: "calculating-limits-using-trigonometric-identities",
  title: t("Calculating Limits Using Trigonometric Identities", "用三角恒等式求极限"),
  summary: t(
    "Evaluate trigonometric limits of the form 0/0 by simplifying with the Pythagorean and double-angle identities.",
    "用勾股恒等式和二倍角公式化简，求 0/0 型三角函数极限。",
  ),
  intro: t(
    "At $x = \\frac{\\pi}{2}$, $\\frac{\\cos^{2} x}{1 - \\sin x}$ is $\\frac{0}{0}$. But $\\cos^{2} x = 1 - \\sin^{2} x = (1 - \\sin x)(1 + \\sin x)$, so near $\\frac{\\pi}{2}$ the fraction equals $1 + \\sin x$, and the limit is $1 + 1 = 2$.\n\nCheck: at $x = \\frac{\\pi}{2} + 0.01$ the fraction is about $1.99995$, close to $2$.\n\nIn this lesson we turn $\\frac{0}{0}$ trigonometric limits into ones we can substitute into, using the Pythagorean identity and the double-angle formulas.",
    "在 $x = \\frac{\\pi}{2}$ 处，$\\frac{\\cos^{2} x}{1 - \\sin x}$ 是 $\\frac{0}{0}$。但 $\\cos^{2} x = 1 - \\sin^{2} x = (1 - \\sin x)(1 + \\sin x)$，所以在 $\\frac{\\pi}{2}$ 附近分式等于 $1 + \\sin x$，极限是 $1 + 1 = 2$。\n\n检验：$x = \\frac{\\pi}{2} + 0.01$ 时分式约为 $1.99995$，接近 $2$。\n\n本课我们用勾股恒等式和二倍角公式，把 $\\frac{0}{0}$ 型的三角函数极限化成可以直接代入的形式。",
  ),
  prerequisites: [
    "limits-of-trigonometric-functions",
    "calculating-limits-of-rational-functions-by-factoring",
    "the-double-angle-formula-for-cosine",
  ],
  encompasses: [
    { topic: "limits-of-trigonometric-functions", weight: 0.3 },
    { topic: "alternate-forms-of-the-pythagorean-identity", weight: 0.2 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "trigonometric-limits-with-the-pythagorean-identity",
      title: t("Using the Pythagorean identity", "利用勾股恒等式"),
      explanation: t(
        "When direct substitution gives zero over zero, rewrite a squared function with the Pythagorean identity so that a common factor appears and can be cancelled. Write $\\sin^{2} x = 1 - \\cos^{2} x = (1 - \\cos x)(1 + \\cos x)$, and similarly $\\cos^{2} x = (1 - \\sin x)(1 + \\sin x)$, then cancel:\n\n$$\\lim_{x \\to 0} \\frac{\\sin^{2} x}{1 - \\cos x} = \\lim_{x \\to 0} \\frac{(1 - \\cos x)(1 + \\cos x)}{1 - \\cos x} = \\lim_{x \\to 0} (1 + \\cos x) = 2.$$\n\nCheck: at $x = 0.1$, $\\sin^{2} x \\approx 0.009967$ and $1 - \\cos x \\approx 0.004996$, and their quotient is about $1.995$, close to $2$.\n\n> **Watch out.** The identity is $\\sin^{2} x = 1 - \\cos^{2} x$, with a square on the cosine. Factor it as a difference of squares, cancel, and only then substitute.",
        "当直接代入得到零比零时，用勾股恒等式改写平方项，使公因式出现，然后约去。把 $\\sin^{2} x$ 写成 $1 - \\cos^{2} x = (1 - \\cos x)(1 + \\cos x)$，同理 $\\cos^{2} x = (1 - \\sin x)(1 + \\sin x)$，然后约分：\n\n$$\\lim_{x \\to 0} \\frac{\\sin^{2} x}{1 - \\cos x} = \\lim_{x \\to 0} \\frac{(1 - \\cos x)(1 + \\cos x)}{1 - \\cos x} = \\lim_{x \\to 0} (1 + \\cos x) = 2.$$\n\n检验：$x = 0.1$ 时 $\\sin^{2} x \\approx 0.009967$，$1 - \\cos x \\approx 0.004996$，二者之商约为 $1.995$，接近 $2$。\n\n> **注意。** 恒等式是 $\\sin^{2} x = 1 - \\cos^{2} x$，余弦上有平方。先按平方差分解、约分，然后再代入。",
      ),
      generate(rng) {
        return identityLimit(rng, pythagoreanForms, {
          en: "By the Pythagorean identity and the difference of squares,",
          zh: "由勾股恒等式和平方差公式，",
        });
      },
    },
    {
      id: "trigonometric-limits-with-double-angle-formulas",
      figure: calculusDrawings1["calculating-limits-using-trigonometric-identities#trigonometric-limits-with-double-angle-formulas"],
      title: t("Using the double-angle formulas", "利用二倍角公式"),
      explanation: t(
        "Expanding the double angle often produces a factor that matches the denominator, and cancelling it removes the zero over zero form. Rewrite $\\sin 2x = 2\\sin x\\cos x$ and $\\cos 2x = \\cos^{2} x - \\sin^{2} x = (\\cos x - \\sin x)(\\cos x + \\sin x)$, then cancel:\n\n$$\\lim_{x \\to \\pi/4} \\frac{\\cos 2x}{\\cos x - \\sin x} = \\lim_{x \\to \\pi/4} (\\cos x + \\sin x) = \\sqrt{2}.$$\n\nCheck: at $x = \\frac{\\pi}{4} + 0.01$ the fraction is about $1.41414$, and $\\sqrt{2} \\approx 1.41421$.\n\n> **Watch out.** $\\cos 2x$ is not $2\\cos x$, and $\\sin 2x$ is not $2\\sin x$. Use the formulas, and substitute into what is left: it can be negative, as $2\\cos x = -2$ at $x = \\pi$.",
        "展开二倍角往往会产生与分母相同的因式，约去它就消除了零比零的形式。把 $\\sin 2x$ 写成 $2\\sin x\\cos x$，$\\cos 2x$ 写成 $\\cos^{2} x - \\sin^{2} x = (\\cos x - \\sin x)(\\cos x + \\sin x)$，然后约分：\n\n$$\\lim_{x \\to \\pi/4} \\frac{\\cos 2x}{\\cos x - \\sin x} = \\lim_{x \\to \\pi/4} (\\cos x + \\sin x) = \\sqrt{2}.$$\n\n检验：$x = \\frac{\\pi}{4} + 0.01$ 时分式约为 $1.41414$，而 $\\sqrt{2} \\approx 1.41421$。\n\n> **注意。** $\\cos 2x$ 不等于 $2\\cos x$，$\\sin 2x$ 也不等于 $2\\sin x$。要用二倍角公式，再代入剩下的式子：结果可能是负数，例如 $x = \\pi$ 时 $2\\cos x = -2$。",
      ),
      generate(rng) {
        return identityLimit(rng, doubleAngleForms, { en: "By the double-angle formulas,", zh: "由二倍角公式，" });
      },
    },
  ],
};

/** Polynomial is a polynomial written in LaTeX together with its values. */
interface Polynomial {
  readonly latex: string;
  readonly f: (x: number) => number;
}

/** leading writes a polynomial of degree n with leading coefficient a and random lower terms. */
function leading(rng: Rng, n: number, a: number): Polynomial {
  const terms: [number, number][] = [[a, n]];
  for (let d = n - 1; d >= 0; d--) if (rng.bool(0.6)) terms.push([rng.int(-9, 9), d]);
  return {
    latex: poly(...terms.map(([c, d]) => [c, d === 0 ? "" : d === 1 ? "x" : `x^{${d}}`] as [number, string])),
    f: (x) => terms.reduce((s, [c, d]) => s + c * x ** d, 0),
  };
}

/** xn writes x to the power n. */
const xn = (n: number) => (n === 0 ? "1" : n === 1 ? "x" : `x^{${n}}`);

/** limitsAtInfinityAndHorizontalAsymptotesOfRationalFunctions finds limits of rational functions at ±∞. */
export const limitsAtInfinityAndHorizontalAsymptotesOfRationalFunctions: TopicDef = {
  id: "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions",
  title: t("Limits at Infinity and Horizontal Asymptotes of Rational Functions", "分式函数在无穷远处的极限与水平渐近线"),
  summary: t(
    "Find limits of rational functions as x → ±∞ by dividing by the highest power of x, and relate them to horizontal asymptotes.",
    "通过除以 x 的最高次幂，求分式函数在 x → ±∞ 时的极限，并把它与水平渐近线联系起来。",
  ),
  intro: t(
    "What happens to $\\frac{2x + 1}{x}$ when $x$ is huge? Divide top and bottom by $x$: the fraction is $2 + \\frac{1}{x}$, and $\\frac{1}{x} \\to 0$. So the limit as $x \\to \\infty$ is $2$, and $y = 2$ is a horizontal asymptote.\n\nCheck: at $x = 1000$ the fraction is $2.001$, and at $x = 1\\,000\\,000$ it is $2.000001$.\n\nIn this lesson we find limits at infinity of rational functions by dividing by the highest power of $x$: equal degrees give the ratio of the leading coefficients, and unequal degrees give $0$ or an infinite limit.",
    "当 $x$ 非常大时，$\\frac{2x + 1}{x}$ 会怎样？分子分母同除以 $x$：分式等于 $2 + \\frac{1}{x}$，而 $\\frac{1}{x} \\to 0$。所以 $x \\to \\infty$ 时极限是 $2$，$y = 2$ 是水平渐近线。\n\n检验：$x = 1000$ 时分式是 $2.001$，$x = 1\\,000\\,000$ 时是 $2.000001$。\n\n本课我们通过除以 $x$ 的最高次幂求分式函数在无穷远处的极限：次数相等时得首项系数之比，次数不等时得 $0$ 或无穷极限。",
  ),
  prerequisites: ["limits-at-infinity-of-polynomials", "limits-of-reciprocal-functions", "horizontal-asymptotes-of-rational-functions"],
  encompasses: [
    { topic: "limits-at-infinity-of-polynomials", weight: 0.3 },
    { topic: "horizontal-asymptotes-of-rational-functions", weight: 0.4 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "rational-limits-at-infinity-with-equal-degrees",
      figure:
        calculusDrawings1[
          "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions#rational-limits-at-infinity-with-equal-degrees"
        ],
      title: t("Equal degrees", "次数相等"),
      explanation: t(
        "Divide every term by the highest power of $x$ in the denominator. Terms like $\\frac{5}{x}$ tend to $0$, so when the degrees are equal the limit is the ratio of the leading coefficients:\n\n$$\\lim_{x \\to \\infty} \\frac{6x^{2} - x}{3x^{2} + 4} = \\lim_{x \\to \\infty} \\frac{6 - \\frac{1}{x}}{3 + \\frac{4}{x^{2}}} = 2.$$\n\nThe line $y = 2$ is a horizontal asymptote.\n\nCheck: at $x = 1000$ the fraction is $\\frac{5\\,999\\,000}{3\\,000\\,004} \\approx 1.9997$.\n\n> **Watch out.** Compare the leading coefficients, not the constant terms: the limit is $\\frac{6}{3}$, not $\\frac{0}{4}$. Keep their signs, and the same power of $x$ cancels even as $x \\to -\\infty$.",
        "把每一项都除以分母中 $x$ 的最高次幂。像 $\\frac{5}{x}$ 这样的项趋于 $0$，所以次数相等时，极限是首项系数之比：\n\n$$\\lim_{x \\to \\infty} \\frac{6x^{2} - x}{3x^{2} + 4} = \\lim_{x \\to \\infty} \\frac{6 - \\frac{1}{x}}{3 + \\frac{4}{x^{2}}} = 2.$$\n\n直线 $y = 2$ 是水平渐近线。\n\n检验：$x = 1000$ 时分式是 $\\frac{5\\,999\\,000}{3\\,000\\,004} \\approx 1.9997$。\n\n> **注意。** 比较的是首项系数，不是常数项：极限是 $\\frac{6}{3}$，不是 $\\frac{0}{4}$。系数的符号要保留；即使 $x \\to -\\infty$，相同的 $x$ 的幂也会约掉。",
      ),
      generate(rng) {
        const n = rng.int(1, 3);
        const a = rng.nonZero(-8, 8);
        const b = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
        const top = leading(rng, n, a);
        const bottom = leading(rng, n, b);
        const toPlus = rng.bool();
        const target = toPlus ? "\\infty" : "-\\infty";
        const answer = Q.of(a, b);
        return numberProblem({
          prompt: t(
            `Find $${lim(target)} \\frac{${top.latex}}{${bottom.latex}}$.`,
            `求 $${lim(target)} \\frac{${top.latex}}{${bottom.latex}}$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              Q.zero,
              "A limit at infinity is $0$ when the denominator has the higher degree. Here the degrees are equal.",
              "分母次数更高时，无穷远处的极限才是 $0$。这里次数相等。",
            ),
            why(
              inv(answer),
              "This turns the ratio upside down. The top's leading coefficient goes on top.",
              "这把比颠倒了。分子的首项系数应在分子上。",
            ),
            why(
              answer.neg(),
              `This has the wrong sign. Both parts contain $${xn(n)}$, so its sign cancels; the limit has the sign of $\\frac{${a}}{${b}}$.`,
              `这符号错了。分子分母都含 $${xn(n)}$，它的符号会约掉；极限的符号与 $\\frac{${a}}{${b}}$ 相同。`,
            ),
            why(
              Q.one,
              `This cancels the whole leading terms. Only $${xn(n)}$ cancels; the coefficients $${a}$ and $${b}$ stay.`,
              `这把首项整个约掉了。只有 $${xn(n)}$ 能约掉，系数 $${a}$ 和 $${b}$ 要保留。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Divide by the highest power", "同除以最高次幂"],
                t(
                  `Both parts have degree $${n}$. Divide every term by $${xn(n)}$; every term except the leading ones tends to $0$.`,
                  `分子分母次数都是 $${n}$。每一项都除以 $${xn(n)}$；除首项外，其余各项都趋于 $0$。`,
                ),
              ],
              [["Take the ratio", "取比值"], none, [`${lim(target)} \\frac{${top.latex}}{${bottom.latex}} = ${ratio(a, b)}`]],
            ],
            tabled(far(toPlus ? 1 : -1), (x) => top.f(x) / bottom.f(x), towards(answer)),
          ),
        });
      },
    },
    {
      id: "rational-limits-at-infinity-with-unequal-degrees",
      title: t("Unequal degrees", "次数不等"),
      explanation: t(
        "If the denominator has the higher degree, the limit is $0$. If the numerator has the higher degree, the function behaves like the ratio of the leading terms, which tends to $\\infty$ or $-\\infty$:\n\n$$\\lim_{x \\to -\\infty} \\frac{2x^{3} + 1}{x - 4} = \\lim_{x \\to -\\infty} 2x^{2} = \\infty.$$\n\nCheck: at $x = -1000$ the fraction is about $1.99 \\times 10^{6}$, and at $x = -10\\,000$ about $2.00 \\times 10^{8}$: positive and growing.\n\n> **Watch out.** The sign depends on the direction. As $x \\to -\\infty$, even powers such as $x^{2}$ are positive but odd powers such as $x$ and $x^{3}$ are negative, so work out the sign of the ratio of leading terms first.",
        "若分母次数更高，极限为 $0$。若分子次数更高，函数的表现与首项之比一致，趋于 $\\infty$ 或 $-\\infty$：\n\n$$\\lim_{x \\to -\\infty} \\frac{2x^{3} + 1}{x - 4} = \\lim_{x \\to -\\infty} 2x^{2} = \\infty.$$\n\n检验：$x = -1000$ 时分式约为 $1.99 \\times 10^{6}$，$x = -10\\,000$ 时约为 $2.00 \\times 10^{8}$：是正数，并且越来越大。\n\n> **注意。** 符号取决于趋近的方向。当 $x \\to -\\infty$ 时，偶次幂（如 $x^{2}$）是正的，奇次幂（如 $x$、$x^{3}$）是负的，所以先确定首项之比的符号。",
      ),
      generate(rng) {
        const [n, m] = rng.pick([
          [1, 2],
          [1, 3],
          [2, 3],
          [0, 2],
          [2, 1],
          [3, 1],
          [3, 2],
          [4, 2],
        ] as const);
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-5, 5);
        const top = leading(rng, n, a);
        const bottom = leading(rng, m, b);
        const toPlus = rng.bool();
        const target = toPlus ? "\\infty" : "-\\infty";
        const f = (x: number) => top.f(x) / bottom.f(x);
        const xs = far(toPlus ? 1 : -1);
        const prompt = t(
          `Find $${lim(target)} \\frac{${top.latex}}{${bottom.latex}}$.`,
          `求 $${lim(target)} \\frac{${top.latex}}{${bottom.latex}}$。`,
        );
        const lead = `\\frac{${cx(a, xn(n)).replace(/^(-?\d*)1$/, (_, c) => (c === "" ? "1" : c === "-" ? "-1" : c))}}{${cx(b, xn(m))}}`;
        if (n < m) {
          return limitAsk(
            rng,
            prompt,
            Q.zero,
            [
              [
                Q.of(a, b),
                "The ratio of the leading coefficients is the limit only when the degrees are equal. Here the denominator's degree is higher.",
                "只有次数相等时，极限才是首项系数之比。这里分母次数更高。",
              ],
              [
                "inf",
                "An infinite limit needs the numerator to have the higher degree. Here the denominator grows faster.",
                "分子次数更高时才会出现无穷极限。这里分母增长得更快。",
              ],
              [
                "-inf",
                "An infinite limit needs the numerator to have the higher degree. Here the denominator grows faster.",
                "分子次数更高时才会出现无穷极限。这里分母增长得更快。",
              ],
            ],
            walked(
              [
                [
                  ["Compare the degrees", "比较次数"],
                  t(
                    `The top has degree $${n}$ and the bottom degree $${m}$, which is higher.`,
                    `分子次数是 $${n}$，分母次数是 $${m}$，分母更高。`,
                  ),
                ],
                [
                  ["Divide by the highest power", "同除以最高次幂"],
                  t(
                    `Divide every term by $${xn(m)}$. The top tends to $0$ and the bottom to $${b}$:`,
                    `每一项都除以 $${xn(m)}$。分子趋于 $0$，分母趋于 $${b}$：`,
                  ),
                  [`\\frac{0}{${b}} = 0`],
                ],
              ],
              tabled(xs, f, t("The values shrink towards $0$.", "这些值越来越接近 $0$。")),
            ),
          );
        }
        const sign = Math.sign(a * b) * (toPlus || (n - m) % 2 === 0 ? 1 : -1);
        const answer: LimitValue = sign > 0 ? "inf" : "-inf";
        const ratioTerm = poly([Q.of(a, b), n - m === 1 ? "x" : `x^{${n - m}}`]);
        const wrongSide: Choice = [
          sign > 0 ? "-inf" : "inf",
          `This has the wrong sign. As $x \\to ${target}$, $${ratioTerm}$ is ${sign > 0 ? "positive" : "negative"}.`,
          `这符号错了。当 $x \\to ${target}$ 时，$${ratioTerm}$ 是${sign > 0 ? "正" : "负"}的。`,
        ];
        return limitAsk(
          rng,
          prompt,
          answer,
          [
            [
              Q.zero,
              "The limit is $0$ only when the denominator has the higher degree. Here the numerator does.",
              "只有分母次数更高时极限才是 $0$。这里分子次数更高。",
            ],
            [
              Q.of(a, b),
              "The ratio of the leading coefficients is the limit only when the degrees are equal. Here the numerator's degree is higher.",
              "只有次数相等时，极限才是首项系数之比。这里分子次数更高。",
            ],
            wrongSide,
          ],
          walked(
            [
              [
                ["Compare the degrees", "比较次数"],
                t(`The top has degree $${n}$, higher than the bottom's degree $${m}$.`, `分子次数是 $${n}$，比分母次数 $${m}$ 高。`),
              ],
              [
                ["Keep the leading terms", "保留首项"],
                t(
                  "For large $|x|$ the fraction behaves like the ratio of the leading terms:",
                  "当 $|x|$ 很大时，分式的表现与首项之比一致：",
                ),
                [`${lead} = ${ratioTerm}`],
              ],
              [
                ["Find the sign", "确定符号"],
                t(
                  `As $x \\to ${target}$, $${ratioTerm}$ is ${sign > 0 ? "positive" : "negative"} and grows in size, so the limit is $${infL(sign)}$.`,
                  `当 $x \\to ${target}$ 时，$${ratioTerm}$ 是${sign > 0 ? "正" : "负"}的，并且绝对值不断增大，所以极限是 $${infL(sign)}$。`,
                ),
              ],
            ],
            tabled(
              xs,
              f,
              sign > 0
                ? t("The values are positive and keep growing.", "这些值是正的，并且不断增大。")
                : t("The values are negative and keep falling.", "这些值是负的，并且不断减小。"),
            ),
          ),
        );
      },
    },
  ],
};

/** growthClasses are functions in increasing order of growth as x → ∞, with their values. */
const growthClasses = ["\\ln x", "\\sqrt{x}", "x", "x^{2}", "x^{5}", "2^{x}", "e^{x}", "3^{x}", "e^{2x}"] as const;
const growthValues: readonly ((x: number) => number)[] = [
  Math.log,
  Math.sqrt,
  (x) => x,
  (x) => x ** 2,
  (x) => x ** 5,
  (x) => 2 ** x,
  Math.exp,
  (x) => 3 ** x,
  (x) => Math.exp(2 * x),
];

/** grow is the value of growth class i at x. */
const grow = (i: number, x: number) => growthValues[i]!(x);

/** dot puts a multiplication dot between a coefficient and a numeric base: "5 \\cdot 3^{x}". */
const dot = (s: string) => s.replace(/(\d)([23]\^\{x\})/g, "$1 \\cdot $2");

/** evaluatingLimitsAtInfinityByComparingRelativeMagnitudesOfFunctions compares the growth of logarithms, powers and exponentials. */
export const evaluatingLimitsAtInfinityByComparingRelativeMagnitudesOfFunctions: TopicDef = {
  id: "evaluating-limits-at-infinity-by-comparing-relative-magnitudes-of-functions",
  title: t("Evaluating Limits at Infinity by Comparing Relative Magnitudes of Functions", "比较函数的增长速度求无穷远处的极限"),
  summary: t(
    "Use the growth order of logarithms, powers and exponentials to find limits at infinity.",
    "利用对数、幂函数和指数函数的增长快慢求无穷远处的极限。",
  ),
  intro: t(
    "Compare $x^{3}$ and $2^{x}$. At $x = 10$ they are $1000$ and $1024$, nearly equal. At $x = 20$ they are $8000$ and $1\\,048\\,576$. The exponential pulls away, so $\\lim_{x \\to \\infty} \\frac{x^{3}}{2^{x}} = 0$.\n\nCheck: at $x = 30$ the quotient is $\\frac{27\\,000}{1\\,073\\,741\\,824} \\approx 0.000025$, smaller still.\n\nIn this lesson we rank logarithms, powers and exponentials by how fast they grow, and use the ranking to find limits of quotients and of sums dominated by one term.",
    "比较 $x^{3}$ 与 $2^{x}$。$x = 10$ 时它们是 $1000$ 和 $1024$，差不多。$x = 20$ 时是 $8000$ 和 $1\\,048\\,576$。指数函数越甩越远，所以 $\\lim_{x \\to \\infty} \\frac{x^{3}}{2^{x}} = 0$。\n\n检验：$x = 30$ 时商是 $\\frac{27\\,000}{1\\,073\\,741\\,824} \\approx 0.000025$，更小了。\n\n本课我们按增长快慢给对数、幂函数和指数函数排序，并用这个顺序求商的极限，以及由某一项主导的和式的极限。",
  ),
  prerequisites: [
    "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions",
    "limits-of-exponential-functions",
    "limits-of-logarithmic-functions",
  ],
  encompasses: [
    { topic: "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions", weight: 0.2 },
    { topic: "limits-of-exponential-functions", weight: 0.2 },
    { topic: "limits-of-logarithmic-functions", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "comparing-growth-rates",
      title: t("Comparing growth rates", "比较增长速度"),
      explanation: t(
        "As $x \\to \\infty$, these functions all tend to $\\infty$, but at very different rates:\n\n$$\\ln x \\ll \\sqrt{x} \\ll x \\ll x^{2} \\ll x^{5} \\ll 2^{x} \\ll e^{x} \\ll 3^{x}.$$\n\nAny power of $x$ beats a logarithm, and any exponential $b^{x}$ with $b > 1$ beats any power. In a quotient, if the faster function is on top the limit is $\\infty$; if it is underneath, the limit is $0$. Positive constant multiples do not change this.\n\nCheck: $\\frac{\\ln x}{\\sqrt{x}}$ is about $0.46$ at $x = 100$ and about $0.092$ at $x = 10\\,000$, heading to $0$.\n\n> **Watch out.** A big constant does not change the winner: $\\frac{1000x^{2}}{e^{x}} \\to 0$, even though $1000x^{2}$ is larger for small $x$. And $\\frac{\\infty}{\\infty}$ is not $1$: compare the growth.",
        "当 $x \\to \\infty$ 时，这些函数都趋于 $\\infty$，但速度差别很大：\n\n$$\\ln x \\ll \\sqrt{x} \\ll x \\ll x^{2} \\ll x^{5} \\ll 2^{x} \\ll e^{x} \\ll 3^{x}.$$\n\n$x$ 的任意正次幂都比对数增长快，底数 $b > 1$ 的指数函数 $b^{x}$ 比任意幂函数增长快。在商中，若增长更快的函数在分子，极限为 $\\infty$；若在分母，极限为 $0$。正的常数倍不改变结论。\n\n检验：$\\frac{\\ln x}{\\sqrt{x}}$ 在 $x = 100$ 时约为 $0.46$，在 $x = 10\\,000$ 时约为 $0.092$，趋向 $0$。\n\n> **注意。** 很大的常数也改变不了谁更快：$\\frac{1000x^{2}}{e^{x}} \\to 0$，尽管 $x$ 较小时 $1000x^{2}$ 更大。$\\frac{\\infty}{\\infty}$ 也不等于 $1$，要比较增长速度。",
      ),
      generate(rng) {
        const [i, j] = rng.sample(range(0, growthClasses.length - 1), 2) as [number, number];
        const c = rng.pick([1, 1, 2, 3, 5, 10, 100]);
        const d = rng.pick([1, 1, 2, 4, 7, 1000]);
        const top = dot(cx(c, growthClasses[i]!));
        const bottom = dot(cx(d, growthClasses[j]!));
        const up = i > j;
        const answer: LimitValue = up ? "inf" : Q.zero;
        const [fast, slow] = up ? [growthClasses[i]!, growthClasses[j]!] : [growthClasses[j]!, growthClasses[i]!];
        const xs = Math.max(i, j) >= 5 ? [10, 50, 100] : [100, 10000, 1000000];
        return limitAsk(
          rng,
          t(`Find $${lim("\\infty")} \\frac{${top}}{${bottom}}$.`, `求 $${lim("\\infty")} \\frac{${top}}{${bottom}}$。`),
          answer,
          [
            [
              Q.zero,
              `The limit is $0$ when the faster function is underneath. Here the faster one, $${fast}$, is on top.`,
              `增长更快的函数在分母时极限才是 $0$。这里更快的 $${fast}$ 在分子上。`,
            ],
            [
              Q.of(c, d),
              "This is the ratio of the constants. Constants do not decide a limit at infinity; the faster-growing function does.",
              "这是两个常数之比。常数决定不了无穷远处的极限，起决定作用的是增长更快的函数。",
            ],
            [
              Q.one,
              "Both parts tend to $\\infty$, but $\\frac{\\infty}{\\infty}$ is not $1$. Compare how fast they grow.",
              "分子分母都趋于 $\\infty$，但 $\\frac{\\infty}{\\infty}$ 不等于 $1$。要比较增长速度。",
            ],
            [
              "inf",
              `The limit is $\\infty$ when the faster function is on top. Here the faster one, $${fast}$, is underneath.`,
              `增长更快的函数在分子时极限才是 $\\infty$。这里更快的 $${fast}$ 在分母中。`,
            ],
            [
              "-inf",
              "Both parts are positive for large $x$, so the quotient is positive and cannot tend to $-\\infty$.",
              "当 $x$ 很大时分子分母都是正的，商为正，不可能趋于 $-\\infty$。",
            ],
          ],
          walked(
            [
              [
                ["Rank the two functions", "比较两个函数"],
                t(
                  `In the growth order, $${fast}$ grows faster than $${slow}$. The constants $${c}$ and $${d}$ do not change that.`,
                  `按增长顺序，$${fast}$ 比 $${slow}$ 增长得快。常数 $${c}$ 和 $${d}$ 不改变这一点。`,
                ),
              ],
              [
                ["Read off the limit", "得出极限"],
                up
                  ? t(
                      `The faster function is on top, so the quotient tends to $\\infty$.`,
                      `增长更快的函数在分子上，所以商趋于 $\\infty$。`,
                    )
                  : t(`The faster function is underneath, so the quotient tends to $0$.`, `增长更快的函数在分母中，所以商趋于 $0$。`),
              ],
            ],
            tabled(
              xs,
              (x) => (c * grow(i, x)) / (d * grow(j, x)),
              up ? t("The values grow without bound.", "这些值无限增大。") : t("The values shrink towards $0$.", "这些值越来越接近 $0$。"),
            ),
          ),
        );
      },
    },
    {
      id: "limits-dominated-by-one-term",
      title: t("Limits dominated by one term", "由主导项决定的极限"),
      explanation: t(
        "In a sum, the fastest-growing term dominates. Divide top and bottom by it; every slower term then tends to $0$:\n\n$$\\lim_{x \\to \\infty} \\frac{3e^{x} + x^{5}}{2e^{x} - \\ln x} = \\lim_{x \\to \\infty} \\frac{3 + \\frac{x^{5}}{e^{x}}}{2 - \\frac{\\ln x}{e^{x}}} = \\frac{3}{2}.$$\n\nCheck: at $x = 20$ the fraction is about $1.5033$, and at $x = 30$ about $1.5000$.\n\n> **Watch out.** Divide by the fastest term in the whole fraction, here $e^{x}$, not by the highest power of $x$. Then only its coefficients count: $\\frac{3}{2}$, not $\\frac{3 + 1}{2 - 1}$.",
        "在和式中，增长最快的项起主导作用。分子分母同除以它，其余增长较慢的项都趋于 $0$：\n\n$$\\lim_{x \\to \\infty} \\frac{3e^{x} + x^{5}}{2e^{x} - \\ln x} = \\lim_{x \\to \\infty} \\frac{3 + \\frac{x^{5}}{e^{x}}}{2 - \\frac{\\ln x}{e^{x}}} = \\frac{3}{2}.$$\n\n检验：$x = 20$ 时分式约为 $1.5033$，$x = 30$ 时约为 $1.5000$。\n\n> **注意。** 要除以整个分式中增长最快的项（这里是 $e^{x}$），而不是 $x$ 的最高次幂。之后只有它的系数起作用：结果是 $\\frac{3}{2}$，不是 $\\frac{3 + 1}{2 - 1}$。",
      ),
      generate(rng) {
        const k = rng.int(2, growthClasses.length - 1);
        const dominant = growthClasses[k]!;
        const a = rng.nonZero(-6, 6);
        const b = rng.pick([1, 2, 3, 4, 5, -1, -2]);
        const [s1, s2] = [rng.int(0, k - 1), rng.int(0, k - 1)];
        const p = rng.nonZero(-5, 5);
        const q = rng.nonZero(-5, 5);
        const top = dot(poly([a, dominant], [p, growthClasses[s1]!]));
        const bottom = dot(rng.bool() ? poly([b, dominant], [q, growthClasses[s2]!]) : poly([q, growthClasses[s2]!], [b, dominant]));
        const answer = Q.of(a, b);
        const f = (x: number) => (a * grow(k, x) + p * grow(s1, x)) / (b * grow(k, x) + q * grow(s2, x));
        const xs = k >= 5 ? [50, 100, 200] : [1000, 1000000, 1000000000];
        return numberProblem({
          prompt: t(`Find $${lim("\\infty")} \\frac{${top}}{${bottom}}$.`, `求 $${lim("\\infty")} \\frac{${top}}{${bottom}}$。`),
          answer,
          mistakes: firsts([
            why(
              Q.of(p, q),
              `This uses the coefficients of the slower terms. Divided by $${dominant}$, those terms tend to $0$.`,
              `这用了增长较慢那两项的系数。除以 $${dominant}$ 后，这些项都趋于 $0$。`,
            ),
            why(
              Q.zero,
              `Top and bottom both grow like $${dominant}$, so the limit is not $0$.`,
              `分子分母都像 $${dominant}$ 那样增长，所以极限不是 $0$。`,
            ),
            why(
              inv(answer),
              "This turns the ratio upside down. The top's coefficient goes on top.",
              "这把比颠倒了。分子的系数应在分子上。",
            ),
            ...(b + q === 0
              ? []
              : [
                  why(
                    Q.of(a + p, b + q),
                    "This adds the coefficients of different functions. Only the coefficients of the fastest term count.",
                    "这把不同函数的系数加在了一起。只有增长最快那一项的系数起作用。",
                  ),
                ]),
          ]),
          solution: walked(
            [
              [
                ["Find the fastest term", "找出增长最快的项"],
                t(`Of the functions in the fraction, $${dominant}$ grows fastest.`, `分式中的函数里，$${dominant}$ 增长最快。`),
              ],
              [
                ["Divide by it", "同除以它"],
                t(
                  `Divide top and bottom by $${dominant}$. Every other term tends to $0$:`,
                  `分子分母同除以 $${dominant}$。其余各项都趋于 $0$：`,
                ),
                [`\\frac{${a} + 0}{${b} + 0} = ${ratio(a, b)}`],
              ],
            ],
            tabled(xs, f, towards(answer)),
          ),
        });
      },
    },
  ],
};

/** evaluatingLimitsAtInfinityOfRadicalFunctions finds limits at infinity of functions with square roots. */
export const evaluatingLimitsAtInfinityOfRadicalFunctions: TopicDef = {
  id: "evaluating-limits-at-infinity-of-radical-functions",
  title: t("Evaluating Limits at Infinity of Radical Functions", "求根式函数在无穷远处的极限"),
  summary: t(
    "Find limits at ±∞ of quotients and differences containing square roots, using √(x²) = |x| and conjugates.",
    "利用 √(x²) = |x| 和共轭式，求含平方根的商与差在 ±∞ 处的极限。",
  ),
  intro: t(
    "For large $|x|$, $\\sqrt{4x^{2} + 1}$ is almost $\\sqrt{4x^{2}} = 2|x|$. So $\\frac{\\sqrt{4x^{2} + 1}}{x}$ is close to $2$ when $x$ is large and positive, and close to $-2$ when $x$ is large and negative, because then $|x| = -x$.\n\nCheck: at $x = 100$ the fraction is $\\frac{\\sqrt{40\\,001}}{100} \\approx 2.0000$, and at $x = -100$ it is about $-2.0000$.\n\nIn this lesson we find limits at $\\pm\\infty$ of quotients with roots, using $\\sqrt{x^{2}} = |x|$, and of differences with roots, using the conjugate.",
    "当 $|x|$ 很大时，$\\sqrt{4x^{2} + 1}$ 几乎等于 $\\sqrt{4x^{2}} = 2|x|$。所以 $x$ 为很大的正数时，$\\frac{\\sqrt{4x^{2} + 1}}{x}$ 接近 $2$；$x$ 为绝对值很大的负数时接近 $-2$，因为这时 $|x| = -x$。\n\n检验：$x = 100$ 时分式是 $\\frac{\\sqrt{40\\,001}}{100} \\approx 2.0000$，$x = -100$ 时约为 $-2.0000$。\n\n本课我们利用 $\\sqrt{x^{2}} = |x|$ 求含根式的商在 $\\pm\\infty$ 处的极限，并利用共轭式求含根式的差的极限。",
  ),
  prerequisites: [
    "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions",
    "calculating-limits-of-radical-functions-using-conjugate-multiplication",
  ],
  encompasses: [
    { topic: "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions", weight: 0.3 },
    { topic: "calculating-limits-of-radical-functions-using-conjugate-multiplication", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "quotients-with-roots-at-infinity",
      title: t("Quotients with roots", "含根式的商"),
      explanation: t(
        "For very large inputs, only the highest power under the root matters, but the square root of a square is an absolute value, so the sign depends on the direction. For large $|x|$, $\\sqrt{k^{2}x^{2} + bx + c} \\approx \\sqrt{k^{2}x^{2}} = k|x|$. As $x \\to \\infty$, $|x| = x$; as $x \\to -\\infty$, $|x| = -x$. So\n\n$$\\lim_{x \\to \\infty} \\frac{\\sqrt{9x^{2} + 1}}{2x - 5} = \\frac{3}{2}, \\qquad \\lim_{x \\to -\\infty} \\frac{\\sqrt{9x^{2} + 1}}{2x - 5} = -\\frac{3}{2}.$$\n\nCheck: at $x = 10\\,000$ the fraction is about $1.5004$, and at $x = -10\\,000$ about $-1.4996$.\n\n> **Watch out.** $\\sqrt{x^{2}} = |x|$, not $x$. The root itself is never negative, so as $x \\to -\\infty$ the sign of the quotient comes from the other part.",
        "当自变量很大时，根号下只有最高次项起作用，但平方的平方根是绝对值，所以符号取决于趋近的方向。当 $|x|$ 很大时，$\\sqrt{k^{2}x^{2} + bx + c} \\approx \\sqrt{k^{2}x^{2}} = k|x|$。当 $x \\to \\infty$ 时 $|x| = x$；当 $x \\to -\\infty$ 时 $|x| = -x$。所以\n\n$$\\lim_{x \\to \\infty} \\frac{\\sqrt{9x^{2} + 1}}{2x - 5} = \\frac{3}{2}, \\qquad \\lim_{x \\to -\\infty} \\frac{\\sqrt{9x^{2} + 1}}{2x - 5} = -\\frac{3}{2}.$$\n\n检验：$x = 10\\,000$ 时分式约为 $1.5004$，$x = -10\\,000$ 时约为 $-1.4996$。\n\n> **注意。** $\\sqrt{x^{2}} = |x|$，不是 $x$。根式本身永远不是负数，所以 $x \\to -\\infty$ 时商的符号由另一部分决定。",
      ),
      generate(rng) {
        const k = rng.int(1, 6);
        const m = rng.nonZero(-5, 5);
        const b = rng.int(-6, 6);
        const c = rng.int(1, 9);
        const d = rng.int(-7, 7);
        const root = `\\sqrt{${poly([k * k, "x^{2}"], [b, "x"], [c, ""])}}`;
        const line = poly([m, "x"], [d, ""]);
        const toPlus = rng.bool();
        const flip = rng.bool(0.3);
        const s = toPlus ? 1 : -1;
        const answer = flip ? Q.of(s * m, k) : Q.of(s * k, m);
        const target = toPlus ? "\\infty" : "-\\infty";
        const f = (x: number) => {
          const v = Math.sqrt(k * k * x * x + b * x + c) / (m * x + d);
          return flip ? 1 / v : v;
        };
        const kAbs = `${k === 1 ? "" : k}|x|`;
        const kSigned = toPlus ? cx(k, "x") : cx(-k, "x");
        return numberProblem({
          prompt: t(
            `Find $${lim(target)} ${flip ? `\\frac{${line}}{${root}}` : `\\frac{${root}}{${line}}`}$.`,
            `求 $${lim(target)} ${flip ? `\\frac{${line}}{${root}}` : `\\frac{${root}}{${line}}`}$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              answer.neg(),
              toPlus
                ? "This has the wrong sign. As $x \\to \\infty$, $|x| = x$, and the root is positive."
                : "This takes $\\sqrt{x^{2}}$ as $x$. As $x \\to -\\infty$, $|x| = -x$, so the sign flips.",
              toPlus
                ? "这符号错了。当 $x \\to \\infty$ 时 $|x| = x$，根式是正的。"
                : "这把 $\\sqrt{x^{2}}$ 当成了 $x$。当 $x \\to -\\infty$ 时 $|x| = -x$，符号要变。",
            ),
            why(inv(answer), "This turns the ratio upside down. Keep the root where it is.", "这把比颠倒了。根式在哪里就留在哪里。"),
            why(Q.zero, "Top and bottom both grow like $|x|$, so the limit is not $0$.", "分子分母都像 $|x|$ 那样增长，所以极限不是 $0$。"),
            why(
              flip ? Q.of(s * m, k * k) : Q.of(s * k * k, m),
              `This forgets the square root of $${k * k}$: $\\sqrt{${k * k}x^{2}} = ${kAbs}$.`,
              `这忘了对 $${k * k}$ 开平方：$\\sqrt{${k * k}x^{2}} = ${kAbs}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Keep the highest power under the root", "保留根号下的最高次项"],
                t(
                  `For large $|x|$ the root is about $\\sqrt{${k * k}x^{2}} = ${kAbs}$, and $|x| = ${toPlus ? "x" : "-x"}$ as $x \\to ${target}$:`,
                  `当 $|x|$ 很大时，根式约为 $\\sqrt{${k * k}x^{2}} = ${kAbs}$，而当 $x \\to ${target}$ 时 $|x| = ${toPlus ? "x" : "-x"}$：`,
                ),
                [`${root} \\approx ${kSigned}`],
              ],
              [
                ["Divide", "相除"],
                t(`The line is about $${cx(m, "x")}$, so`, `一次式约为 $${cx(m, "x")}$，所以`),
                [
                  flip
                    ? `\\frac{${cx(m, "x")}}{${kSigned}} = ${answer.toLatex()}`
                    : `\\frac{${kSigned}}{${cx(m, "x")}} = ${answer.toLatex()}`,
                ],
              ],
            ],
            tabled(far(s), f, towards(answer)),
          ),
        });
      },
    },
    {
      id: "differences-with-roots-at-infinity",
      title: t("Differences with roots", "含根式的差"),
      explanation: t(
        "A difference of two large quantities can hide a finite limit, and multiplying by the conjugate turns it into a quotient whose limit is easy to read. $\\sqrt{x^{2} + 6x} - x$ has the form $\\infty - \\infty$. Multiply and divide by the conjugate:\n\n$$\\sqrt{x^{2} + 6x} - x = \\frac{6x}{\\sqrt{x^{2} + 6x} + x} = \\frac{6}{\\sqrt{1 + \\frac{6}{x}} + 1} \\to \\frac{6}{2} = 3.$$\n\nIn general, $\\sqrt{k^{2}x^{2} + bx + c} - kx \\to \\frac{b}{2k}$ as $x \\to \\infty$.\n\nCheck: at $x = 1000$ the difference is about $2.9955$, and at $x = 10\\,000$ about $2.9996$.\n\n> **Watch out.** $\\infty - \\infty$ is not $0$. After multiplying by the conjugate, the bottom is about $2kx$, not $kx$, so the limit is $\\frac{b}{2k}$, not $\\frac{b}{k}$.",
        "两个很大的量之差可能隐藏着有限的极限，乘以共轭式把它变成商后，极限就容易看出了。$\\sqrt{x^{2} + 6x} - x$ 是 $\\infty - \\infty$ 型。乘以并除以共轭式：\n\n$$\\sqrt{x^{2} + 6x} - x = \\frac{6x}{\\sqrt{x^{2} + 6x} + x} = \\frac{6}{\\sqrt{1 + \\frac{6}{x}} + 1} \\to \\frac{6}{2} = 3.$$\n\n一般地，当 $x \\to \\infty$ 时，$\\sqrt{k^{2}x^{2} + bx + c} - kx \\to \\frac{b}{2k}$。\n\n检验：$x = 1000$ 时这个差约为 $2.9955$，$x = 10\\,000$ 时约为 $2.9996$。\n\n> **注意。** $\\infty - \\infty$ 不等于 $0$。乘以共轭式后，分母约为 $2kx$，不是 $kx$，所以极限是 $\\frac{b}{2k}$，不是 $\\frac{b}{k}$。",
      ),
      generate(rng) {
        const k = rng.int(1, 4);
        const b = rng.nonZero(-12, 12);
        const c = rng.int(-9, 9);
        const d = rng.int(-4, 4);
        const root = `\\sqrt{${poly([k * k, "x^{2}"], [b, "x"], [c, ""])}}`;
        const rest = poly([-k, "x"], [-d, ""]);
        const half = Q.of(b, 2 * k);
        const answer = half.sub(Q.of(d));
        const parts: Step[] = [
          [
            ["Multiply by the conjugate", "乘以共轭式"],
            t(
              `Multiply and divide $${root} - ${cx(k, "x")}$ by $${root} + ${cx(k, "x")}$. The $${k * k}x^{2}$ terms cancel:`,
              `把 $${root} - ${cx(k, "x")}$ 乘以并除以 $${root} + ${cx(k, "x")}$。$${k * k}x^{2}$ 项抵消：`,
            ),
            [`${root} - ${cx(k, "x")} = \\frac{${poly([b, "x"], [c, ""])}}{${root} + ${cx(k, "x")}}`],
          ],
          [
            ["Divide by x", "同除以 x"],
            t(
              `For large $x$ the bottom is about $${cx(k, "x")} + ${cx(k, "x")} = ${cx(2 * k, "x")}$, so`,
              `当 $x$ 很大时分母约为 $${cx(k, "x")} + ${cx(k, "x")} = ${cx(2 * k, "x")}$，所以`,
            ),
            [
              `\\frac{${poly([b, "x"], [c, ""])}}{${cx(2 * k, "x")}} \\to \\frac{${b}}{${2 * k}}${half.toLatex() === `\\frac{${b}}{${2 * k}}` ? "" : ` = ${half.toLatex()}`}`,
            ],
          ],
        ];
        if (d !== 0)
          parts.push([
            ["Add the constant", "加上常数"],
            t(`The expression also has $${d > 0 ? `-${d}` : `+${-d}`}$:`, `式子中还有 $${d > 0 ? `-${d}` : `+${-d}`}$：`),
            [`${half.toLatex()} ${d > 0 ? "-" : "+"} ${Math.abs(d)} = ${answer.toLatex()}`],
          ]);
        return numberProblem({
          prompt: t(
            `Find $${lim("\\infty")} \\left(${root} ${rest.startsWith("-") ? `- ${rest.slice(1)}` : `+ ${rest}`}\\right)$.`,
            `求 $${lim("\\infty")} \\left(${root} ${rest.startsWith("-") ? `- ${rest.slice(1)}` : `+ ${rest}`}\\right)$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              Q.zero,
              "This reads $\\infty - \\infty$ as $0$. Multiply by the conjugate to see what is left.",
              "这把 $\\infty - \\infty$ 当成了 $0$。要乘共轭式，看剩下什么。",
            ),
            why(
              Q.of(b, k).sub(Q.of(d)),
              `This takes the bottom as $${cx(k, "x")}$. It is the root plus $${cx(k, "x")}$, about $${cx(2 * k, "x")}$.`,
              `这把分母当成了 $${cx(k, "x")}$。分母是根式加 $${cx(k, "x")}$，约为 $${cx(2 * k, "x")}$。`,
            ),
            ...(d === 0
              ? []
              : [
                  why(
                    half,
                    `This leaves out the constant $${d > 0 ? `-${d}` : `+${-d}`}$ outside the root.`,
                    `这漏掉了根号外的常数 $${d > 0 ? `-${d}` : `+${-d}`}$。`,
                  ),
                ]),
            why(
              Q.of(c, 2 * k).sub(Q.of(d)),
              `This uses the constant $${c}$ under the root. It drops out, since $\\frac{${c}}{x} \\to 0$; the coefficient $${b}$ of $x$ decides.`,
              `这用了根号下的常数 $${c}$。它会消失，因为 $\\frac{${c}}{x} \\to 0$；起作用的是 $x$ 的系数 $${b}$。`,
            ),
          ]),
          solution: walked(
            parts,
            tabled(far(1, 1000), (x) => Math.sqrt(k * k * x * x + b * x + c) - k * x - d, towards(answer)),
          ),
        });
      },
    },
  ],
};

/** theSqueezeTheorem finds limits by trapping a function between two others. */
export const theSqueezeTheorem: TopicDef = {
  id: "the-squeeze-theorem",
  title: t("The Squeeze Theorem", "夹逼定理"),
  summary: t(
    "Find a limit by trapping a function between two functions with the same limit, including oscillating functions times something that tends to zero.",
    "把函数夹在两个极限相同的函数之间来求极限，包括振荡函数乘以趋于零的因子的情形。",
  ),
  intro: t(
    "Suppose $1 - x^{2} \\le f(x) \\le 1 + x^{2}$ for $x$ near $0$. Both bounds equal $1$ at $x = 0$, and $f$ is trapped between them, so it has nowhere to go: $\\lim_{x \\to 0} f(x) = 1$.\n\nCheck: at $x = 0.1$ the bounds are $0.99$ and $1.01$, so $f(0.1)$ is within $0.01$ of $1$; at $x = 0.01$ it is within $0.0001$.\n\nIn this lesson we use the squeeze theorem with two given bounds, and with $-1 \\le \\sin u \\le 1$ to find limits of oscillating functions.",
    "设在 $0$ 附近 $1 - x^{2} \\le f(x) \\le 1 + x^{2}$。两个界在 $x = 0$ 处都等于 $1$，$f$ 被夹在中间，无处可去：$\\lim_{x \\to 0} f(x) = 1$。\n\n检验：$x = 0.1$ 时两个界是 $0.99$ 和 $1.01$，所以 $f(0.1)$ 与 $1$ 相差不超过 $0.01$；$x = 0.01$ 时相差不超过 $0.0001$。\n\n本课我们用两个给定的界运用夹逼定理，并利用 $-1 \\le \\sin u \\le 1$ 求振荡函数的极限。",
  ),
  prerequisites: ["limits-of-trigonometric-functions", "the-sum-rule-for-limits"],
  encompasses: [{ topic: "the-sum-rule-for-limits", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "squeezing-between-two-functions",
      title: t("Squeezing between two functions", "夹在两个函数之间"),
      explanation: t(
        "**The squeeze theorem:** if $g(x) \\le f(x) \\le h(x)$ for $x$ near $a$, and $\\lim_{x \\to a} g(x) = \\lim_{x \\to a} h(x) = L$, then $\\lim_{x \\to a} f(x) = L$.\n\nFind the limits of the two bounds; if they agree, $f$ is squeezed to the same value. For example, if $3 - (x - 2)^{2} \\le f(x) \\le 3 + (x - 2)^{2}$, both bounds tend to $3$ at $x = 2$, so $f(x) \\to 3$.\n\nCheck: at $x = 2.1$ the bounds are $2.99$ and $3.01$, so $f(2.1)$ is within $0.01$ of $3$.\n\n> **Watch out.** Both bounds must have the same limit; if they tend to different numbers, the theorem says nothing. Find their limits at $x = a$, the point asked about.",
        "**夹逼定理：**若在 $a$ 附近 $g(x) \\le f(x) \\le h(x)$，且 $\\lim_{x \\to a} g(x) = \\lim_{x \\to a} h(x) = L$，则 $\\lim_{x \\to a} f(x) = L$。\n\n求出两个界的极限；若二者相等，$f$ 就被夹到同一个值。例如，若 $3 - (x - 2)^{2} \\le f(x) \\le 3 + (x - 2)^{2}$，两个界在 $x = 2$ 处都趋于 $3$，所以 $f(x) \\to 3$。\n\n检验：$x = 2.1$ 时两个界是 $2.99$ 和 $3.01$，所以 $f(2.1)$ 与 $3$ 相差不超过 $0.01$。\n\n> **注意。** 两个界的极限必须相同；若趋于不同的数，定理什么也说明不了。要在所问的点 $x = a$ 处求它们的极限。",
      ),
      generate(rng) {
        const a = rng.int(-3, 3);
        const L = rng.int(-8, 8);
        const m = rng.int(-3, 3);
        const p = rng.pick([1, 2, 3]);
        const q = rng.pick([1, 2, 4]);
        // g = L + m(x − a) − p(x − a)², h = L + m(x − a) + q(x − a)², expanded.
        const expand = (s: number) => poly([s, "x^{2}"], [m - 2 * s * a, "x"], [L - m * a + s * a * a, ""]);
        const g = expand(-p);
        const h = expand(q);
        const at = (s: number, x: number) => L + m * (x - a) + s * (x - a) ** 2;
        const x1 = a + 0.1;
        return numberProblem({
          prompt: t(
            `For all $x$ near $${a}$, $$${g} \\le f(x) \\le ${h}.$$ Find $${lim(a)} f(x)$.`,
            `对 $${a}$ 附近的所有 $x$，$$${g} \\le f(x) \\le ${h}.$$ 求 $${lim(a)} f(x)$。`,
          ),
          answer: L,
          mistakes: firsts([
            why(
              L - m * a + q * a * a,
              `This is the upper bound at $x = 0$. Substitute $x = ${a}$, the point asked about.`,
              `这是上界在 $x = 0$ 处的值。要代入所问的点 $x = ${a}$。`,
            ),
            why(
              L - m * a - p * a * a,
              `This is the lower bound at $x = 0$. Substitute $x = ${a}$, the point asked about.`,
              `这是下界在 $x = 0$ 处的值。要代入所问的点 $x = ${a}$。`,
            ),
            why(
              0,
              `The bounds tend to $${L}$, so $f$ is squeezed to $${L}$, not to $0$.`,
              `两个界都趋于 $${L}$，所以 $f$ 被夹到 $${L}$，而不是 $0$。`,
            ),
            why(
              a,
              `This is the point $x = ${a}$ itself. The limit is the value the bounds approach.`,
              `这是点 $x = ${a}$ 本身。极限是两个界所趋近的值。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["The lower bound", "下界"],
                t(`It is a polynomial, so substitute $x = ${a}$:`, `下界是多项式，直接代入 $x = ${a}$：`),
                [`${lim(a)} \\left(${g}\\right) = ${L}`],
              ],
              [["The upper bound", "上界"], none, [`${lim(a)} \\left(${h}\\right) = ${L}`]],
              [
                ["Squeeze", "夹逼"],
                t(
                  `Both bounds tend to $${L}$, so by the squeeze theorem $${lim(a)} f(x) = ${L}$.`,
                  `两个界都趋于 $${L}$，由夹逼定理 $${lim(a)} f(x) = ${L}$。`,
                ),
              ],
            ],
            t(
              `Near $x = ${a}$ the bounds pinch together. At $x = ${fmt(x1)}$ they are $${fmt(at(-p, x1))}$ and $${fmt(at(q, x1))}$, and at $x = ${fmt(a + 0.01)}$ they are $${fmt(at(-p, a + 0.01))}$ and $${fmt(at(q, a + 0.01))}$, closing in on $${L}$.`,
              `在 $x = ${a}$ 附近两个界越夹越紧。$x = ${fmt(x1)}$ 时它们是 $${fmt(at(-p, x1))}$ 和 $${fmt(at(q, x1))}$，$x = ${fmt(a + 0.01)}$ 时是 $${fmt(at(-p, a + 0.01))}$ 和 $${fmt(at(q, a + 0.01))}$，向 $${L}$ 靠拢。`,
            ),
          ),
        });
      },
    },
    {
      id: "squeezing-oscillating-functions",
      title: t("Oscillating functions", "振荡函数"),
      explanation: t(
        "If a function is trapped between two functions that approach the same limit, it is forced to approach that limit too, however much it oscillates. Since $-1 \\le \\sin u \\le 1$, a bounded oscillation times something that tends to $0$ also tends to $0$:\n\n$$-x^{2} \\le x^{2}\\sin\\frac{1}{x} \\le x^{2} \\quad\\Rightarrow\\quad \\lim_{x \\to 0} x^{2}\\sin\\frac{1}{x} = 0.$$\n\nLikewise $\\frac{\\cos x}{x} \\to 0$ as $x \\to \\infty$, so $\\lim_{x \\to \\infty} \\frac{3x + \\cos x}{x} = 3$.\n\nCheck: at $x = 0.01$, $x^{2}\\sin\\frac{1}{x} \\approx -0.00005$, which lies between $-0.0001$ and $0.0001$.\n\n> **Watch out.** Do not use $\\sin u \\approx u$ here: $\\frac{1}{x}$ does not tend to $0$, so $\\sin\\frac{1}{x}$ keeps swinging between $-1$ and $1$. The limit comes from the factor that tends to $0$.",
        "如果一个函数被夹在两个趋于同一极限的函数之间，无论它怎样振荡，都必然趋于这个极限。因为 $-1 \\le \\sin u \\le 1$，有界的振荡乘以趋于 $0$ 的量也趋于 $0$：\n\n$$-x^{2} \\le x^{2}\\sin\\frac{1}{x} \\le x^{2} \\quad\\Rightarrow\\quad \\lim_{x \\to 0} x^{2}\\sin\\frac{1}{x} = 0.$$\n\n同样，当 $x \\to \\infty$ 时 $\\frac{\\cos x}{x} \\to 0$，所以 $\\lim_{x \\to \\infty} \\frac{3x + \\cos x}{x} = 3$。\n\n检验：$x = 0.01$ 时 $x^{2}\\sin\\frac{1}{x} \\approx -0.00005$，在 $-0.0001$ 与 $0.0001$ 之间。\n\n> **注意。** 这里不能用 $\\sin u \\approx u$：$\\frac{1}{x}$ 并不趋于 $0$，所以 $\\sin\\frac{1}{x}$ 一直在 $-1$ 与 $1$ 之间摆动。极限来自趋于 $0$ 的那个因子。",
      ),
      generate(rng) {
        const fn = rng.pick(["\\sin", "\\cos"]);
        const trig = fn === "\\sin" ? Math.sin : Math.cos;
        const c = rng.int(-6, 6);
        const form = rng.int(0, 2);
        const plusC = c === 0 ? "" : c > 0 ? ` + ${c}` : ` - ${-c}`;
        if (form === 0) {
          const n = rng.int(1, 3);
          const k = rng.pick([1, 2, 3, 5]);
          const a = rng.pick([1, 2, 3, -1, -4]);
          const pw = `x${n === 1 ? "" : `^{${n}}`}`;
          const expr = `${cx(a, pw)}${fn}\\left(\\frac{${k}}{x}\\right)${plusC}`;
          const bound = `|${cx(Math.abs(a), pw)}|`;
          return numberProblem({
            prompt: t(`Find $${lim(0)} \\left(${expr}\\right)$.`, `求 $${lim(0)} \\left(${expr}\\right)$。`),
            answer: c,
            mistakes: firsts([
              why(
                c + a,
                `This takes $${fn}\\left(\\frac{${k}}{x}\\right)$ as $1$. It keeps swinging, but it is multiplied by $${cx(a, pw)}$, which tends to $0$.`,
                `这把 $${fn}\\left(\\frac{${k}}{x}\\right)$ 当成了 $1$。它一直在摆动，但乘的是趋于 $0$ 的 $${cx(a, pw)}$。`,
              ),
              why(
                c + a * k,
                `This uses $\\sin u \\approx u$, which needs $u \\to 0$. Here $u = \\frac{${k}}{x}$ grows without bound.`,
                `这用了 $\\sin u \\approx u$，但它要求 $u \\to 0$。这里 $u = \\frac{${k}}{x}$ 无限增大。`,
              ),
              ...(c === 0
                ? []
                : [why(0, `The product tends to $0$, but the constant $${c}$ remains.`, `乘积趋于 $0$，但常数 $${c}$ 还在。`)]),
            ]),
            solution: walked(
              [
                [
                  ["Bound the oscillating part", "给振荡部分找界"],
                  t(
                    `Since $-1 \\le ${fn}\\left(\\frac{${k}}{x}\\right) \\le 1$,`,
                    `因为 $-1 \\le ${fn}\\left(\\frac{${k}}{x}\\right) \\le 1$，`,
                  ),
                  [`-${bound} \\le ${cx(a, pw)}${fn}\\left(\\frac{${k}}{x}\\right) \\le ${bound}`],
                ],
                [
                  ["Squeeze", "夹逼"],
                  t(
                    `Both bounds tend to $0$, so the product tends to $0$, and the limit is $0${plusC} = ${c}$.`,
                    `两个界都趋于 $0$，所以乘积趋于 $0$，极限是 $0${plusC} = ${c}$。`,
                  ),
                ],
              ],
              tabled([-0.01, -0.001, 0.001, 0.01], (x) => a * x ** n * trig(k / x) + c, towards(Q.of(c))),
            ),
          });
        }
        const p = rng.nonZero(-6, 6);
        const q = rng.pick([1, 2, 3, 4, -2]);
        const k = rng.pick([1, 2, 3]);
        const osc = `${fn} ${cx(k, "x")}`;
        const expr = form === 1 ? `\\frac{${cx(p, "x")} + ${osc}}{${cx(q, "x")}}` : `\\frac{${osc}}{${cx(q, "x")}}${plusC}`;
        const answer = form === 1 ? Q.of(p, q) : Q.of(c);
        const base = form === 1 ? Q.of(p, q) : Q.of(c);
        const f = (x: number) => (form === 1 ? (p * x + trig(k * x)) / (q * x) : trig(k * x) / (q * x) + c);
        const squeeze = `-\\frac{1}{${cx(Math.abs(q), "x")}} \\le \\frac{${osc}}{${cx(q, "x")}} \\le \\frac{1}{${cx(Math.abs(q), "x")}}`;
        return numberProblem({
          prompt: t(
            `Find $${lim("\\infty")} ${form === 1 ? expr : `\\left(${expr}\\right)`}$.`,
            `求 $${lim("\\infty")} ${form === 1 ? expr : `\\left(${expr}\\right)`}$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              base.add(Q.of(k, q)),
              `This uses $\\frac{\\sin ${cx(k, "x")}}{x} \\to ${k}$, which is a limit at $0$. As $x \\to \\infty$, $${osc}$ stays between $-1$ and $1$ while $x$ grows.`,
              `这用了 $\\frac{\\sin ${cx(k, "x")}}{x} \\to ${k}$，那是 $x \\to 0$ 时的极限。当 $x \\to \\infty$ 时，$${osc}$ 始终在 $-1$ 与 $1$ 之间，而 $x$ 不断增大。`,
            ),
            why(
              base.add(Q.of(1, q)),
              `This takes $${osc}$ as $1$. It keeps oscillating, and divided by $${cx(q, "x")}$ it tends to $0$.`,
              `这把 $${osc}$ 当成了 $1$。它一直在振荡，除以 $${cx(q, "x")}$ 后趋于 $0$。`,
            ),
            why(
              Q.zero,
              form === 1
                ? `Only the oscillating part tends to $0$. The part $\\frac{${cx(p, "x")}}{${cx(q, "x")}}$ is $${Q.of(p, q).toLatex()}$.`
                : `The fraction tends to $0$, but the constant $${c}$ remains.`,
              form === 1
                ? `只有振荡部分趋于 $0$。$\\frac{${cx(p, "x")}}{${cx(q, "x")}}$ 这部分等于 $${Q.of(p, q).toLatex()}$。`
                : `分式趋于 $0$，但常数 $${c}$ 还在。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Bound the oscillating part", "给振荡部分找界"],
                t(`Since $-1 \\le ${osc} \\le 1$, for large $x$`, `因为 $-1 \\le ${osc} \\le 1$，当 $x$ 很大时`),
                [squeeze],
              ],
              [
                ["Squeeze", "夹逼"],
                form === 1
                  ? t(
                      `Both bounds tend to $0$. Split the fraction as $\\frac{${cx(p, "x")}}{${cx(q, "x")}} + \\frac{${osc}}{${cx(q, "x")}}$: the limit is $${Q.of(p, q).toLatex()} + 0 = ${answer.toLatex()}$.`,
                      `两个界都趋于 $0$。把分式拆成 $\\frac{${cx(p, "x")}}{${cx(q, "x")}} + \\frac{${osc}}{${cx(q, "x")}}$：极限是 $${Q.of(p, q).toLatex()} + 0 = ${answer.toLatex()}$。`,
                    )
                  : t(`Both bounds tend to $0$, so the limit is $0${plusC} = ${c}$.`, `两个界都趋于 $0$，所以极限是 $0${plusC} = ${c}$。`),
              ],
            ],
            tabled([100, 1000, 10000], f, towards(answer)),
          ),
        });
      },
    },
  ],
};

/** kx writes the argument kx: "x", "-x", "3x". */
const kx = (k: number) => cx(k, "x");

/** ta writes the argument kx of a trigonometric function, in parentheses when negative: "3x", "(-2x)". */
const ta = (k: number) => (k < 0 ? `(${kx(k)})` : kx(k));

/** ratio writes a/b and its simplest form when they differ. */
function ratio(a: number, b: number): string {
  const raw = `\\frac{${a}}{${b}}`;
  const simple = Q.of(a, b).toLatex();
  return raw === simple ? raw : `${raw} = ${simple}`;
}

/** atZero are the x-values −0.01, −0.001, 0.001 and 0.01. */
const atZero = near(0);

/** specialLimitsInvolvingSine uses sin x / x → 1. */
export const specialLimitsInvolvingSine: TopicDef = {
  id: "special-limits-involving-sine",
  title: t("Special Limits Involving Sine", "与正弦有关的特殊极限"),
  summary: t(
    "Use lim sin x / x = 1 to find limits of quotients of sines, tangents and multiples of x.",
    "利用 lim sin x / x = 1 求正弦、正切与 x 的倍数之商的极限。",
  ),
  intro: t(
    "Put $x = 0.01$ (in radians) into $\\frac{\\sin x}{x}$: $\\frac{0.0099998}{0.01} = 0.99998$. The closer $x$ is to $0$, the closer the quotient is to $1$. So $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$: for small $x$, $\\sin x \\approx x$.\n\nCheck: at $x = -0.1$ the quotient is $\\frac{-0.0998}{-0.1} \\approx 0.998$, the same as at $x = 0.1$, since $\\sin x$ and $x$ change sign together.\n\nIn this lesson we use this limit to find limits of $\\frac{\\sin ax}{bx}$ and of quotients of sines and tangents.",
    "把 $x = 0.01$（弧度）代入 $\\frac{\\sin x}{x}$：$\\frac{0.0099998}{0.01} = 0.99998$。$x$ 越接近 $0$，商越接近 $1$。所以 $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$：当 $x$ 很小时，$\\sin x \\approx x$。\n\n检验：$x = -0.1$ 时商是 $\\frac{-0.0998}{-0.1} \\approx 0.998$，与 $x = 0.1$ 时相同，因为 $\\sin x$ 和 $x$ 同时变号。\n\n本课我们用这个极限求 $\\frac{\\sin ax}{bx}$ 以及正弦、正切之商的极限。",
  ),
  prerequisites: ["the-squeeze-theorem", "the-product-and-quotient-rules-for-limits"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-sin-ax-over-bx",
      title: t("Limits of sin ax over bx", "sin ax 与 bx 之商的极限"),
      explanation: t(
        "Multiply and divide so that the argument of the sine also appears below it, use the basic limit of sine over its argument, and keep the leftover constant ratio. By the squeeze theorem (with $\\cos x \\le \\frac{\\sin x}{x} \\le 1$ near $0$),\n\n$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1.$$\n\nFor $\\frac{\\sin ax}{bx}$, make the argument appear underneath: $\\frac{\\sin ax}{bx} = \\frac{a}{b} \\cdot \\frac{\\sin ax}{ax} \\to \\frac{a}{b}$. Likewise $\\frac{bx}{\\sin ax} \\to \\frac{b}{a}$.\n\nCheck: $\\frac{\\sin 3x}{2x}$ at $x = 0.01$ is $\\frac{\\sin 0.03}{0.02} \\approx 1.4998$, close to $\\frac{3}{2}$.\n\n> **Watch out.** The limit $1$ needs the same argument above and below: $\\frac{\\sin 3x}{2x}$ is not $\\frac{\\sin 3x}{3x}$, so its limit is $\\frac{3}{2}$, not $1$.",
        "通过乘除使分母中也出现正弦的自变量，利用正弦与自变量之比的基本极限，再保留剩下的常数比。由夹逼定理（在 $0$ 附近 $\\cos x \\le \\frac{\\sin x}{x} \\le 1$），\n\n$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1.$$\n\n对于 $\\frac{\\sin ax}{bx}$，在分母凑出相同的自变量：$\\frac{\\sin ax}{bx} = \\frac{a}{b} \\cdot \\frac{\\sin ax}{ax} \\to \\frac{a}{b}$。同理 $\\frac{bx}{\\sin ax} \\to \\frac{b}{a}$。\n\n检验：$\\frac{\\sin 3x}{2x}$ 在 $x = 0.01$ 时是 $\\frac{\\sin 0.03}{0.02} \\approx 1.4998$，接近 $\\frac{3}{2}$。\n\n> **注意。** 极限为 $1$ 要求分子分母的自变量相同：$\\frac{\\sin 3x}{2x}$ 不是 $\\frac{\\sin 3x}{3x}$，所以它的极限是 $\\frac{3}{2}$，不是 $1$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-7, 7);
        const b = rng.pick(range(-6, 6).filter((v) => v !== 0 && v !== a));
        const flip = rng.bool(0.3);
        const s = `\\sin ${ta(a)}`;
        const answer = flip ? Q.of(b, a) : Q.of(a, b);
        const f = (x: number) => (flip ? (b * x) / Math.sin(a * x) : Math.sin(a * x) / (b * x));
        return numberProblem({
          prompt: t(
            `Find $${lim(0)} ${flip ? `\\frac{${kx(b)}}{${s}}` : `\\frac{${s}}{${kx(b)}}`}$.`,
            `求 $${lim(0)} ${flip ? `\\frac{${kx(b)}}{${s}}` : `\\frac{${s}}{${kx(b)}}`}$。`,
          ),
          answer,
          mistakes: firsts([
            why(
              Q.one,
              `This treats the whole quotient as $\\frac{\\sin u}{u}$. The argument is $${kx(a)}$, but the other part is $${kx(b)}$.`,
              `这把整个商当成了 $\\frac{\\sin u}{u}$。正弦的自变量是 $${kx(a)}$，另一部分却是 $${kx(b)}$。`,
            ),
            why(
              Q.zero,
              "Substituting gives $\\frac{0}{0}$, not $0$. Use the standard limit.",
              "代入得到的是 $\\frac{0}{0}$，不是 $0$。要用标准极限。",
            ),
            why(inv(answer), "This turns the ratio upside down.", "这把比颠倒了。"),
            why(
              answer.neg(),
              `This loses a sign: $\\sin(-u) = -\\sin u$, so the sign of $${a}$ stays.`,
              `这丢了符号：$\\sin(-u) = -\\sin u$，所以 $${a}$ 的符号要保留。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Match the argument", "凑出相同的自变量"],
                t(`Make $${kx(a)}$ appear with the sine:`, `让 $${kx(a)}$ 与正弦配对：`),
                [
                  `${flip ? `\\frac{${kx(b)}}{${s}}` : `\\frac{${s}}{${kx(b)}}`} = \\frac{${flip ? b : a}}{${flip ? a : b}} \\cdot ${flip ? `\\frac{${kx(a)}}{${s}}` : `\\frac{${s}}{${kx(a)}}`}`,
                ],
              ],
              [
                ["Use the standard limit", "利用标准极限"],
                t("The second factor tends to $1$:", "第二个因子趋于 $1$："),
                [`${ratio(flip ? b : a, flip ? a : b)}`],
              ],
            ],
            tabled(atZero, f, towards(answer)),
          ),
        });
      },
    },
    {
      id: "limits-of-quotients-of-sines-and-tangents",
      title: t("Quotients of sines and tangents", "正弦与正切之商"),
      explanation: t(
        "Near zero, sine and tangent of a small multiple of the variable both behave like that multiple, so the limit of their quotient is the ratio of the multiples. Since $\\tan x = \\frac{\\sin x}{\\cos x}$ and $\\cos x \\to 1$, also $\\frac{\\tan x}{x} \\to 1$. For a quotient of two such functions, divide top and bottom by $x$:\n\n$$\\lim_{x \\to 0} \\frac{\\sin 5x}{\\tan 2x} = \\lim_{x \\to 0} \\frac{5 \\cdot \\frac{\\sin 5x}{5x}}{2 \\cdot \\frac{\\tan 2x}{2x}} = \\frac{5}{2}.$$\n\nCheck: at $x = 0.01$ the quotient is $\\frac{\\sin 0.05}{\\tan 0.02} \\approx 2.4986$, close to $2.5$.\n\n> **Watch out.** Near $0$, $\\tan x$ behaves like $x$, not like $1$. A coefficient in front multiplies the multiple: $2\\sin 3x \\approx 6x$.",
        "在零附近，变量的小倍数的正弦和正切都近似等于这个倍数，所以它们商的极限是两个倍数之比。因为 $\\tan x = \\frac{\\sin x}{\\cos x}$ 且 $\\cos x \\to 1$，所以 $\\frac{\\tan x}{x} \\to 1$。对于这类函数之商，分子分母同除以 $x$：\n\n$$\\lim_{x \\to 0} \\frac{\\sin 5x}{\\tan 2x} = \\lim_{x \\to 0} \\frac{5 \\cdot \\frac{\\sin 5x}{5x}}{2 \\cdot \\frac{\\tan 2x}{2x}} = \\frac{5}{2}.$$\n\n检验：$x = 0.01$ 时商是 $\\frac{\\sin 0.05}{\\tan 0.02} \\approx 2.4986$，接近 $2.5$。\n\n> **注意。** 在 $0$ 附近，$\\tan x$ 近似于 $x$，不是近似于 $1$。前面的系数要乘到倍数上：$2\\sin 3x \\approx 6x$。",
      ),
      generate(rng) {
        const [a, b] = rng.sample([1, 2, 3, 4, 5, 6, 7, 9], 2) as [number, number];
        const sa = rng.bool(0.3) ? -a : a;
        const topFn = rng.pick(["\\sin", "\\tan"]);
        const top = `${topFn} ${ta(sa)}`;
        const bottomFn = rng.pick(["\\sin", "\\tan", "x"]);
        const c = rng.pick([1, 1, 2, 3]);
        const bottom = bottomFn === "x" ? kx(b) : `${c === 1 ? "" : c}${bottomFn} ${ta(b)}`;
        const below = bottomFn === "x" ? b : c * b;
        const answer = Q.of(sa, below);
        const fn = (name: string) => (name === "\\sin" ? Math.sin : Math.tan);
        const f = (x: number) => fn(topFn)(sa * x) / (bottomFn === "x" ? b * x : c * fn(bottomFn)(b * x));
        return numberProblem({
          prompt: t(`Find $${lim(0)} \\frac{${top}}{${bottom}}$.`, `求 $${lim(0)} \\frac{${top}}{${bottom}}$。`),
          answer,
          mistakes: firsts([
            why(
              Q.one,
              "This treats the quotient as $\\frac{\\sin u}{u}$. Top and bottom have different multiples of $x$.",
              "这把商当成了 $\\frac{\\sin u}{u}$。分子分母中 $x$ 的倍数不同。",
            ),
            why(inv(answer), "This turns the ratio upside down.", "这把比颠倒了。"),
            why(
              Q.zero,
              "Substituting gives $\\frac{0}{0}$, not $0$. Replace each part by its multiple of $x$.",
              "代入得到的是 $\\frac{0}{0}$，不是 $0$。要把每部分换成 $x$ 的倍数。",
            ),
            why(answer.neg(), `This loses a sign: $${topFn}(-u) = -${topFn} u$.`, `这丢了符号：$${topFn}(-u) = -${topFn} u$。`),
            ...(c === 1 || bottomFn === "x"
              ? []
              : [
                  why(
                    Q.of(sa, b),
                    `This leaves out the coefficient $${c}$ in front of $${bottomFn} ${ta(b)}$.`,
                    `这漏掉了 $${bottomFn} ${ta(b)}$ 前面的系数 $${c}$。`,
                  ),
                ]),
          ]),
          solution: walked(
            [
              [
                ["Replace each part by its multiple of x", "把每部分换成 x 的倍数"],
                t(
                  "Near $0$, $\\frac{\\sin u}{u} \\to 1$ and $\\frac{\\tan u}{u} \\to 1$, so",
                  "在 $0$ 附近，$\\frac{\\sin u}{u} \\to 1$，$\\frac{\\tan u}{u} \\to 1$，所以",
                ),
                [`${top} \\approx ${kx(sa)}${bottomFn === "x" ? "" : `, \\quad ${bottom} \\approx ${kx(below)}`}`],
              ],
              [["Divide", "相除"], t("The $x$'s cancel:", "$x$ 约掉："), [`\\frac{${kx(sa)}}{${kx(below)}} = ${answer.toLatex()}`]],
            ],
            tabled(atZero, f, towards(answer)),
          ),
        });
      },
    },
  ],
};

/** evaluatingSpecialLimitsInvolvingSineUsingASubstitution applies sin u / u → 1 with u → 0 away from x = 0. */
export const evaluatingSpecialLimitsInvolvingSineUsingASubstitution: TopicDef = {
  id: "evaluating-special-limits-involving-sine-using-a-substitution",
  title: t("Evaluating Special Limits Involving Sine Using a Substitution", "用换元法求与正弦有关的特殊极限"),
  summary: t(
    "Use a substitution u = g(x) with u → 0 to apply lim sin u / u = 1 at points other than 0.",
    "用换元 u = g(x)（u → 0），在 0 以外的点运用 lim sin u / u = 1。",
  ),
  intro: t(
    "As $x \\to 2$, the quantity $u = x - 2$ tends to $0$. So $\\frac{\\sin(x - 2)}{x - 2}$ is just $\\frac{\\sin u}{u}$ in disguise, and $\\lim_{x \\to 2} \\frac{\\sin(x - 2)}{x - 2} = \\lim_{u \\to 0} \\frac{\\sin u}{u} = 1$.\n\nCheck: at $x = 2.01$ the quotient is $\\frac{\\sin 0.01}{0.01} \\approx 0.99998$.\n\nIn this lesson we use a substitution to move a limit to $u \\to 0$, first with a shifted argument and then together with factoring.",
    "当 $x \\to 2$ 时，$u = x - 2$ 趋于 $0$。所以 $\\frac{\\sin(x - 2)}{x - 2}$ 其实就是 $\\frac{\\sin u}{u}$，$\\lim_{x \\to 2} \\frac{\\sin(x - 2)}{x - 2} = \\lim_{u \\to 0} \\frac{\\sin u}{u} = 1$。\n\n检验：$x = 2.01$ 时商是 $\\frac{\\sin 0.01}{0.01} \\approx 0.99998$。\n\n本课我们用换元把极限化成 $u \\to 0$ 的情形，先处理平移后的自变量，再与因式分解结合。",
  ),
  prerequisites: ["special-limits-involving-sine", "calculating-limits-of-rational-functions-by-factoring"],
  encompasses: [
    { topic: "special-limits-involving-sine", weight: 0.4 },
    { topic: "calculating-limits-of-rational-functions-by-factoring", weight: 0.2 },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "substituting-a-shifted-argument",
      title: t("A shifted argument", "平移后的自变量"),
      explanation: t(
        "A substitution moves the point of interest to zero, where the standard limit of sine over its argument can be used directly. If $u = x - a$, then $u \\to 0$ as $x \\to a$, so\n\n$$\\lim_{x \\to a} \\frac{\\sin(x - a)}{x - a} = \\lim_{u \\to 0} \\frac{\\sin u}{u} = 1.$$\n\nWith multiples: $\\lim_{x \\to 2} \\frac{\\sin(3x - 6)}{x - 2} = \\lim_{u \\to 0} \\frac{\\sin 3u}{u} = 3$.\n\nCheck: at $x = 2.01$ that quotient is $\\frac{\\sin 0.03}{0.01} \\approx 2.9996$.\n\n> **Watch out.** The standard limit needs its argument to tend to $0$. Factor the argument first, $3x - 6 = 3(x - 2)$, and use the multiple $3$, not the constant $6$.",
        "换元把所关心的点移到零处，这样就可以直接使用正弦与自变量之比的标准极限。令 $u = x - a$，则 $x \\to a$ 时 $u \\to 0$，所以\n\n$$\\lim_{x \\to a} \\frac{\\sin(x - a)}{x - a} = \\lim_{u \\to 0} \\frac{\\sin u}{u} = 1.$$\n\n带倍数时：$\\lim_{x \\to 2} \\frac{\\sin(3x - 6)}{x - 2} = \\lim_{u \\to 0} \\frac{\\sin 3u}{u} = 3$。\n\n检验：$x = 2.01$ 时这个商是 $\\frac{\\sin 0.03}{0.01} \\approx 2.9996$。\n\n> **注意。** 标准极限要求自变量趋于 $0$。先把自变量分解，$3x - 6 = 3(x - 2)$，用倍数 $3$，而不是常数 $6$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const k = rng.nonZero(-5, 5);
        const m = rng.pick([1, 1, 2, 3, 4, -1, -2]);
        const top = `\\sin(${poly([k, "x"], [-k * a, ""])})`;
        const bottom = poly([m, "x"], [-m * a, ""]);
        const answer = Q.of(k, m);
        return numberProblem({
          prompt: t(`Find $${lim(a)} \\frac{${top}}{${bottom}}$.`, `求 $${lim(a)} \\frac{${top}}{${bottom}}$。`),
          answer,
          mistakes: firsts([
            why(
              Q.one,
              `This treats the quotient as $\\frac{\\sin u}{u}$. With $u = ${bare(a)}$ it is $\\frac{\\sin ${ta(k).replace("x", "u")}}{${kx(m).replace("x", "u")}}$.`,
              `这把商当成了 $\\frac{\\sin u}{u}$。令 $u = ${bare(a)}$，它是 $\\frac{\\sin ${ta(k).replace("x", "u")}}{${kx(m).replace("x", "u")}}$。`,
            ),
            why(
              Q.zero,
              "Substituting gives $\\frac{0}{0}$, not $0$. Substitute $u$ and use the standard limit.",
              "代入得到的是 $\\frac{0}{0}$，不是 $0$。要换元并利用标准极限。",
            ),
            why(inv(answer), "This turns the ratio upside down.", "这把比颠倒了。"),
            why(
              Q.of(k * a, m),
              `This uses the constant $${k * a}$ in the argument. The argument is $${k}(${bare(a)})$, so the multiple is $${k}$.`,
              `这用了自变量中的常数 $${k * a}$。自变量是 $${k}(${bare(a)})$，倍数是 $${k}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute", "换元"],
                t(
                  `Let $u = ${bare(a)}$, so $u \\to 0$ as $x \\to ${a}$. The argument is $${poly([k, "x"], [-k * a, ""])} = ${kx(k).replace("x", "u")}$ and the bottom is $${kx(m).replace("x", "u")}$:`,
                  `令 $u = ${bare(a)}$，则 $x \\to ${a}$ 时 $u \\to 0$。自变量 $${poly([k, "x"], [-k * a, ""])} = ${kx(k).replace("x", "u")}$，分母是 $${kx(m).replace("x", "u")}$：`,
                ),
                [`${lim(0, undefined, "u")} \\frac{\\sin ${ta(k).replace("x", "u")}}{${kx(m).replace("x", "u")}}`],
              ],
              [
                ["Use the standard limit", "利用标准极限"],
                t(
                  `$\\sin ${ta(k).replace("x", "u")} \\approx ${kx(k).replace("x", "u")}$ near $0$:`,
                  `在 $0$ 附近 $\\sin ${ta(k).replace("x", "u")} \\approx ${kx(k).replace("x", "u")}$：`,
                ),
                [ratio(k, m)],
              ],
            ],
            tabled(near(a), (x) => Math.sin(k * (x - a)) / (m * (x - a)), towards(answer)),
          ),
        });
      },
    },
    {
      id: "substituting-with-a-factored-denominator",
      title: t("Factoring around the substitution", "结合因式分解换元"),
      explanation: t(
        "Factor the denominator so that one factor matches the argument of the sine; that part gives the standard limit, and the other factor is found by substitution. Split off the factor that matches the sine's argument:\n\n$$\\lim_{x \\to 3} \\frac{\\sin(x - 3)}{x^{2} - x - 6} = \\lim_{x \\to 3} \\frac{\\sin(x - 3)}{x - 3} \\cdot \\frac{1}{x + 2} = 1 \\cdot \\frac{1}{5} = \\frac{1}{5}.$$\n\nSimilarly $\\frac{\\sin(x^{2} - 9)}{x - 3} = \\frac{\\sin(x^{2} - 9)}{x^{2} - 9} \\cdot (x + 3) \\to 6$.\n\nCheck: at $x = 3.01$ the first quotient is about $0.1996$, close to $\\frac{1}{5} = 0.2$.\n\n> **Watch out.** Only the factor that matches the argument goes with the sine. Substitute $x = 3$ into the other factor: it is $x + 2 = 5$, which stays in the answer.",
        "把分母因式分解，使其中一个因式与正弦的自变量相同；这部分给出标准极限，另一个因式用代入法求值。拆出与正弦的自变量相同的因式：\n\n$$\\lim_{x \\to 3} \\frac{\\sin(x - 3)}{x^{2} - x - 6} = \\lim_{x \\to 3} \\frac{\\sin(x - 3)}{x - 3} \\cdot \\frac{1}{x + 2} = 1 \\cdot \\frac{1}{5} = \\frac{1}{5}.$$\n\n同理 $\\frac{\\sin(x^{2} - 9)}{x - 3} = \\frac{\\sin(x^{2} - 9)}{x^{2} - 9} \\cdot (x + 3) \\to 6$。\n\n检验：$x = 3.01$ 时第一个商约为 $0.1996$，接近 $\\frac{1}{5} = 0.2$。\n\n> **注意。** 只有与自变量相同的那个因式和正弦配对。另一个因式要代入 $x = 3$：它是 $x + 2 = 5$，要留在答案里。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        if (rng.bool(0.35)) {
          const top = `\\sin(${poly([1, "x^{2}"], [-a * a, ""])})`;
          const answer = 2 * a;
          return numberProblem({
            prompt: t(`Find $${lim(a)} \\frac{${top}}{${bare(a)}}$.`, `求 $${lim(a)} \\frac{${top}}{${bare(a)}}$。`),
            answer,
            mistakes: firsts([
              why(
                1,
                `This leaves out the factor $${fac(-a)}$, which is $${2 * a}$ at $x = ${a}$.`,
                `这漏掉了因式 $${fac(-a)}$，它在 $x = ${a}$ 处等于 $${2 * a}$。`,
              ),
              why(0, "Substituting gives $\\frac{0}{0}$, not $0$.", "代入得到的是 $\\frac{0}{0}$，不是 $0$。"),
              why(
                a,
                `This puts $x = ${a}$ into $x$ alone. The factor is $${fac(-a)}$, so it gives $${a} ${a < 0 ? "-" : "+"} ${Math.abs(a)} = ${2 * a}$.`,
                `这只把 $x = ${a}$ 代入了 $x$。因式是 $${fac(-a)}$，所以得 $${a} ${a < 0 ? "-" : "+"} ${Math.abs(a)} = ${2 * a}$。`,
              ),
              why(
                a * a,
                `This uses $x^{2} = ${a * a}$. The leftover factor is $${fac(-a)}$, which gives $${2 * a}$.`,
                `这用了 $x^{2} = ${a * a}$。剩下的因式是 $${fac(-a)}$，得 $${2 * a}$。`,
              ),
            ]),
            solution: walked(
              [
                [
                  ["Match the argument", "凑出相同的自变量"],
                  t(
                    `Multiply and divide by $x^{2} - ${a * a} = ${fac(a)}${fac(-a)}$:`,
                    `乘以并除以 $x^{2} - ${a * a} = ${fac(a)}${fac(-a)}$：`,
                  ),
                  [`\\frac{${top}}{${bare(a)}} = \\frac{${top}}{x^{2} - ${a * a}} \\cdot ${fac(-a)}`],
                ],
                [
                  ["Take each limit", "分别求极限"],
                  t(
                    `As $x \\to ${a}$ the first factor tends to $1$ and the second to $${2 * a}$:`,
                    `当 $x \\to ${a}$ 时第一个因子趋于 $1$，第二个趋于 $${2 * a}$：`,
                  ),
                  [`1 \\cdot ${paren(2 * a)} = ${answer}`],
                ],
              ],
              tabled(near(a), (x) => Math.sin(x * x - a * a) / (x - a), towards(Q.of(answer))),
            ),
          });
        }
        const r = rng.pick(range(-6, 6).filter((v) => v !== a));
        const k = rng.pick([1, 1, 2, 3, -1]);
        const top = `\\sin(${poly([k, "x"], [-k * a, ""])})`;
        const bottom = quad(1, a, r);
        const answer = Q.of(k, a - r);
        return numberProblem({
          prompt: t(`Find $${lim(a)} \\frac{${top}}{${bottom}}$.`, `求 $${lim(a)} \\frac{${top}}{${bottom}}$。`),
          answer,
          mistakes: firsts([
            why(
              Q.of(k),
              `This leaves out the other factor $\\frac{1}{${bare(r)}}$, which is $${Q.of(1, a - r).toLatex()}$ at $x = ${a}$.`,
              `这漏掉了另一个因子 $\\frac{1}{${bare(r)}}$，它在 $x = ${a}$ 处等于 $${Q.of(1, a - r).toLatex()}$。`,
            ),
            why(Q.zero, "Substituting gives $\\frac{0}{0}$, not $0$.", "代入得到的是 $\\frac{0}{0}$，不是 $0$。"),
            why(
              Q.of(a - r, k),
              "This turns the answer upside down: the other factor is in the denominator.",
              "这把结果颠倒了：另一个因式在分母中。",
            ),
            ...(a + r === 0
              ? []
              : [
                  why(
                    frac(k, a + r),
                    `This gives the other factor the wrong sign. It is $${bare(r)}$, which is $${a - r}$ at $x = ${a}$.`,
                    `这把另一个因式的符号弄反了。它是 $${bare(r)}$，在 $x = ${a}$ 处等于 $${a - r}$。`,
                  ),
                ]),
          ]),
          solution: walked(
            [
              [
                ["Factor and split", "分解并拆开"],
                t(
                  `$${bottom} = ${fac(a)}${fac(r)}$, and $${fac(a)}$ matches the argument:`,
                  `$${bottom} = ${fac(a)}${fac(r)}$，其中 $${fac(a)}$ 与自变量相配：`,
                ),
                [`\\frac{${top}}{${bottom}} = \\frac{${top}}{${bare(a)}} \\cdot \\frac{1}{${bare(r)}}`],
              ],
              [
                ["Take each limit", "分别求极限"],
                t(
                  `The first factor tends to $${k}$ and the second to $${Q.of(1, a - r).toLatex()}$:`,
                  `第一个因子趋于 $${k}$，第二个趋于 $${Q.of(1, a - r).toLatex()}$：`,
                ),
                [`${k} \\cdot ${Q.of(1, a - r).toLatex()} = ${answer.toLatex()}`],
              ],
            ],
            tabled(near(a), (x) => Math.sin(k * (x - a)) / ((x - a) * (x - r)), towards(answer)),
          ),
        });
      },
    },
  ],
};

/** specialLimitsInvolvingCosine uses (1 − cos x)/x → 0 and (1 − cos x)/x² → 1/2. */
export const specialLimitsInvolvingCosine: TopicDef = {
  id: "special-limits-involving-cosine",
  title: t("Special Limits Involving Cosine", "与余弦有关的特殊极限"),
  summary: t(
    "Use lim (1 − cos x)/x = 0 and lim (1 − cos x)/x² = 1/2 to find limits involving cosine.",
    "利用 lim (1 − cos x)/x = 0 与 lim (1 − cos x)/x² = 1/2 求含余弦的极限。",
  ),
  intro: t(
    "At $x = 0.1$, $1 - \\cos x \\approx 0.0049958$, almost exactly half of $x^{2} = 0.01$. At $x = 0.01$, $1 - \\cos x \\approx 0.00005$, again half of $x^{2} = 0.0001$. So $\\frac{1 - \\cos x}{x^{2}} \\to \\frac{1}{2}$, while $\\frac{1 - \\cos x}{x}$, about $\\frac{x}{2}$, tends to $0$.\n\nCheck: multiplying by $1 + \\cos x$ gives $\\frac{1 - \\cos x}{x^{2}} = \\left(\\frac{\\sin x}{x}\\right)^{2} \\cdot \\frac{1}{1 + \\cos x} \\to 1 \\cdot \\frac{1}{2}$.\n\nIn this lesson we use these two limits, and combine them with $\\sin x \\approx x$, to find limits involving cosine.",
    "$x = 0.1$ 时，$1 - \\cos x \\approx 0.0049958$，几乎恰好是 $x^{2} = 0.01$ 的一半。$x = 0.01$ 时，$1 - \\cos x \\approx 0.00005$，又是 $x^{2} = 0.0001$ 的一半。所以 $\\frac{1 - \\cos x}{x^{2}} \\to \\frac{1}{2}$，而 $\\frac{1 - \\cos x}{x}$ 约为 $\\frac{x}{2}$，趋于 $0$。\n\n检验：乘以 $1 + \\cos x$ 得 $\\frac{1 - \\cos x}{x^{2}} = \\left(\\frac{\\sin x}{x}\\right)^{2} \\cdot \\frac{1}{1 + \\cos x} \\to 1 \\cdot \\frac{1}{2}$。\n\n本课我们运用这两个极限，并与 $\\sin x \\approx x$ 结合，求含余弦的极限。",
  ),
  prerequisites: ["special-limits-involving-sine", "calculating-limits-using-trigonometric-identities"],
  encompasses: [{ topic: "calculating-limits-using-trigonometric-identities", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-one-minus-cosine",
      figure: calculusDrawings1["special-limits-involving-cosine#limits-of-one-minus-cosine"],
      title: t("Limits of 1 − cos ax", "1 − cos ax 的极限"),
      explanation: t(
        "One minus cosine shrinks like the square of a small angle, so divided by the angle itself it goes to zero, and divided by the square it goes to a half. Multiplying by $1 + \\cos x$ gives $\\frac{1 - \\cos x}{x} = \\frac{\\sin x}{x} \\cdot \\frac{\\sin x}{1 + \\cos x} \\to 1 \\cdot 0 = 0$, and\n\n$$\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^{2}} = \\lim_{x \\to 0} \\left(\\frac{\\sin x}{x}\\right)^{2} \\frac{1}{1 + \\cos x} = \\frac{1}{2}.$$\n\nWith $ax$ in place of $x$: $\\frac{1 - \\cos ax}{bx^{2}} \\to \\frac{a^{2}}{2b}$.\n\nCheck: at $x = 0.1$, $\\frac{1 - \\cos x}{x^{2}} \\approx 0.4996$ and $\\frac{1 - \\cos x}{x} \\approx 0.0500$; at $x = 0.01$ they are about $0.5000$ and $0.0050$.\n\n> **Watch out.** Square the multiple: $1 - \\cos ax$ behaves like $\\frac{a^{2}x^{2}}{2}$, not $\\frac{ax^{2}}{2}$. Divided by $x$ rather than $x^{2}$, the limit is $0$.",
        "1 减余弦像小角的平方那样趋于零，所以除以角本身时趋于零，除以角的平方时趋于二分之一。乘以 $1 + \\cos x$ 得 $\\frac{1 - \\cos x}{x} = \\frac{\\sin x}{x} \\cdot \\frac{\\sin x}{1 + \\cos x} \\to 1 \\cdot 0 = 0$，以及\n\n$$\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^{2}} = \\lim_{x \\to 0} \\left(\\frac{\\sin x}{x}\\right)^{2} \\frac{1}{1 + \\cos x} = \\frac{1}{2}.$$\n\n把 $x$ 换成 $ax$：$\\frac{1 - \\cos ax}{bx^{2}} \\to \\frac{a^{2}}{2b}$。\n\n检验：$x = 0.1$ 时 $\\frac{1 - \\cos x}{x^{2}} \\approx 0.4996$，$\\frac{1 - \\cos x}{x} \\approx 0.0500$；$x = 0.01$ 时分别约为 $0.5000$ 和 $0.0050$。\n\n> **注意。** 倍数要平方：$1 - \\cos ax$ 近似于 $\\frac{a^{2}x^{2}}{2}$，不是 $\\frac{ax^{2}}{2}$。若除以的是 $x$ 而不是 $x^{2}$，极限是 $0$。",
      ),
      generate(rng) {
        const a = rng.int(1, 6);
        const b = rng.nonZero(-5, 5);
        const flip = rng.bool();
        const top = flip ? `\\cos ${ta(a)} - 1` : `1 - \\cos ${ta(a)}`;
        const square = rng.bool(0.75);
        const bottom = cx(b, square ? "x^{2}" : "x");
        const sg = flip ? -1 : 1;
        const answer = square ? Q.of(sg * a * a, 2 * b) : Q.zero;
        const f = (x: number) => (sg * (1 - Math.cos(a * x))) / (b * (square ? x * x : x));
        const approx = `${flip ? "-" : ""}\\frac{${cx(a * a, "x^{2}")}}{2}`;
        return numberProblem({
          prompt: t(`Find $${lim(0)} \\frac{${top}}{${bottom}}$.`, `求 $${lim(0)} \\frac{${top}}{${bottom}}$。`),
          answer,
          mistakes: firsts([
            why(
              Q.of(sg * a, 2 * b),
              `This does not square the multiple: $${top}$ behaves like $${approx}$.`,
              `这没有把倍数平方：$${top}$ 近似于 $${approx}$。`,
            ),
            why(
              Q.of(sg * a * a, b),
              `This drops the $\\frac{1}{2}$: $${top}$ behaves like $${approx}$.`,
              `这漏掉了 $\\frac{1}{2}$：$${top}$ 近似于 $${approx}$。`,
            ),
            why(
              Q.of(1, 2),
              `This is the limit of $\\frac{1 - \\cos x}{x^{2}}$ alone. The multiples $${a}$ and $${b}$ change it.`,
              `这只是 $\\frac{1 - \\cos x}{x^{2}}$ 的极限。倍数 $${a}$ 和 $${b}$ 会改变结果。`,
            ),
            square
              ? why(
                  Q.zero,
                  "The top shrinks like $x^{2}$, as fast as the bottom, so the limit is not $0$.",
                  "分子像 $x^{2}$ 那样趋于零，与分母一样快，所以极限不是 $0$。",
                )
              : why(
                  Q.of(sg * a * a, 2 * b),
                  "This would be the limit over $x^{2}$. Over $x$, the top shrinks faster than the bottom, so the limit is $0$.",
                  "这是除以 $x^{2}$ 时的极限。除以 $x$ 时，分子比分母更快趋于零，所以极限是 $0$。",
                ),
            why(
              answer.neg(),
              `This has the wrong sign: near $0$, $${top}$ is ${flip ? "negative" : "positive"}.`,
              `这符号错了：在 $0$ 附近 $${top}$ 是${flip ? "负" : "正"}的。`,
            ),
          ]),
          solution: square
            ? walked(
                [
                  [
                    ["Replace the cosine part", "替换余弦部分"],
                    t(
                      `With $u = ${kx(a)}$, $\\frac{1 - \\cos u}{u^{2}} \\to \\frac{1}{2}$, so near $0$`,
                      `取 $u = ${kx(a)}$，$\\frac{1 - \\cos u}{u^{2}} \\to \\frac{1}{2}$，所以在 $0$ 附近`,
                    ),
                    [`${top} \\approx ${approx}`],
                  ],
                  [
                    ["Divide", "相除"],
                    t(`Divide by $${bottom}$; the $x^{2}$'s cancel:`, `除以 $${bottom}$，$x^{2}$ 约掉：`),
                    [`${flip ? "-" : ""}\\frac{${a * a}}{2 \\cdot ${paren(b)}} = ${answer.toLatex()}`],
                  ],
                ],
                tabled(atZero, f, towards(answer)),
              )
            : walked(
                [
                  [
                    ["Replace the cosine part", "替换余弦部分"],
                    t(
                      `Near $0$, $${top} \\approx ${approx}$, which shrinks like $x^{2}$.`,
                      `在 $0$ 附近 $${top} \\approx ${approx}$，像 $x^{2}$ 那样趋于零。`,
                    ),
                  ],
                  [
                    ["Divide", "相除"],
                    t(
                      `Divide by $${bottom}$: what is left is a multiple of $x$, which tends to $0$:`,
                      `除以 $${bottom}$：剩下的是 $x$ 的倍数，趋于 $0$：`,
                    ),
                    [`${flip ? "-" : ""}\\frac{${a * a}x}{2 \\cdot ${paren(b)}} \\to 0`],
                  ],
                ],
                tabled(atZero, f, t("The values shrink towards $0$.", "这些值越来越接近 $0$。")),
              ),
        });
      },
    },
    {
      id: "combining-cosine-and-sine-limits",
      title: t("Combining with sine limits", "与正弦极限结合"),
      explanation: t(
        "Replacing each factor by the simplest expression it behaves like near zero turns a complicated quotient into a ratio of powers that can be simplified. Replace each factor by its behavior near $0$: $1 - \\cos ax \\approx \\frac{a^{2}x^{2}}{2}$, $\\sin bx \\approx bx$ and $1 - \\cos bx \\approx \\frac{b^{2}x^{2}}{2}$. So\n\n$$\\lim_{x \\to 0} \\frac{1 - \\cos 4x}{x \\sin 2x} = \\frac{16/2}{2} = 4, \\qquad \\lim_{x \\to 0} \\frac{1 - \\cos 3x}{1 - \\cos x} = 9.$$\n\nCheck: at $x = 0.01$ the first quotient is about $3.9997$.\n\n> **Watch out.** Give each part its right size: $\\sin bx \\approx bx$, but $1 - \\cos ax \\approx \\frac{a^{2}x^{2}}{2}$, with a square and a half. Do not replace $1 - \\cos ax$ by $ax$.",
        "把每个因式换成它在零附近近似等于的最简单式子，就能把复杂的商变成可以化简的幂之比。把每个因子换成它在 $0$ 附近的近似：$1 - \\cos ax \\approx \\frac{a^{2}x^{2}}{2}$，$\\sin bx \\approx bx$，$1 - \\cos bx \\approx \\frac{b^{2}x^{2}}{2}$。所以\n\n$$\\lim_{x \\to 0} \\frac{1 - \\cos 4x}{x \\sin 2x} = \\frac{16/2}{2} = 4, \\qquad \\lim_{x \\to 0} \\frac{1 - \\cos 3x}{1 - \\cos x} = 9.$$\n\n检验：$x = 0.01$ 时第一个商约为 $3.9997$。\n\n> **注意。** 每部分的大小要对：$\\sin bx \\approx bx$，但 $1 - \\cos ax \\approx \\frac{a^{2}x^{2}}{2}$，有平方，还有二分之一。不要把 $1 - \\cos ax$ 换成 $ax$。",
      ),
      generate(rng) {
        const [a, b] = rng.sample([1, 2, 3, 4, 5, 6], 2) as [number, number];
        const form = rng.int(0, 2);
        const top = `1 - \\cos ${ta(a)}`;
        const bottom = form === 0 ? `x \\sin ${ta(b)}` : form === 1 ? `\\sin^{2} ${kx(b)}` : `1 - \\cos ${ta(b)}`;
        const answer = form === 0 ? Q.of(a * a, 2 * b) : form === 1 ? Q.of(a * a, 2 * b * b) : Q.of(a * a, b * b);
        const approx = form === 0 ? cx(b, "x^{2}") : form === 1 ? cx(b * b, "x^{2}") : `\\frac{${cx(b * b, "x^{2}")}}{2}`;
        const g = (x: number) => (form === 0 ? x * Math.sin(b * x) : form === 1 ? Math.sin(b * x) ** 2 : 1 - Math.cos(b * x));
        const topApprox = `\\frac{${cx(a * a, "x^{2}")}}{2}`;
        return numberProblem({
          prompt: t(`Find $${lim(0)} \\frac{${top}}{${bottom}}$.`, `求 $${lim(0)} \\frac{${top}}{${bottom}}$。`),
          answer,
          mistakes: firsts([
            why(
              Q.of(a, b),
              `This replaces each part by its plain multiple. $${top}$ behaves like $${topApprox}$, with a square and a half.`,
              `这把每部分都换成了简单的倍数。$${top}$ 近似于 $${topApprox}$，有平方，还有二分之一。`,
            ),
            why(
              Q.zero,
              "Top and bottom both shrink like $x^{2}$, so the limit is not $0$.",
              "分子分母都像 $x^{2}$ 那样趋于零，所以极限不是 $0$。",
            ),
            why(inv(answer), "This turns the ratio upside down.", "这把比颠倒了。"),
            form === 0
              ? why(Q.of(a * a, b), `This drops the $\\frac{1}{2}$ in $${topApprox}$.`, `这漏掉了 $${topApprox}$ 中的 $\\frac{1}{2}$。`)
              : form === 1
                ? why(
                    Q.of(a * a, 2 * b),
                    `This does not square $${b}$: $\\sin^{2} ${kx(b)} \\approx ${cx(b * b, "x^{2}")}$.`,
                    `这没有把 $${b}$ 平方：$\\sin^{2} ${kx(b)} \\approx ${cx(b * b, "x^{2}")}$。`,
                  )
                : why(
                    Q.of(a * a, 2 * b * b),
                    "This halves only the top. Both parts have a $\\frac{1}{2}$, and they cancel.",
                    "这只给分子乘了二分之一。分子分母都有 $\\frac{1}{2}$，会约掉。",
                  ),
          ]),
          solution: walked(
            [
              [["The top", "分子"], t("Near $0$,", "在 $0$ 附近，"), [`${top} \\approx ${topApprox}`]],
              [["The bottom", "分母"], none, [`${bottom} \\approx ${approx}`]],
              [["Divide", "相除"], t("The $x^{2}$'s cancel:", "$x^{2}$ 约掉："), [`\\frac{${topApprox}}{${approx}} = ${answer.toLatex()}`]],
            ],
            tabled(atZero, (x) => (1 - Math.cos(a * x)) / g(x), towards(answer)),
          ),
        });
      },
    },
  ],
};

/** ePower writes e to a rational power: "e", "e^{3}", "e^{-\\frac{1}{2}}". */
const ePower = (q: Q) => (q.eq(Q.one) ? "e" : `e^{${q.toLatex()}}`);

/** logTable checks a limit of the form e^L by tabulating the logarithm of the expression, which should approach L. */
function logTable(xs: readonly number[], lnf: (x: number) => number, power: Q): Text {
  const rows = table(["$x$", ...xs.map((x) => `$${fmt(x)}$`)], ["$\\ln f(x)$", ...xs.map((x) => `$${fmt(lnf(x))}$`)]);
  return t(
    `Call the expression $f(x)$ and take its logarithm, which brings the exponent down:\n\n${rows}\n\nThe logarithms approach $${about(power)}$, so $f(x)$ approaches $${ePower(power)}$.`,
    `把这个式子记作 $f(x)$，取对数把指数拿下来：\n\n${rows}\n\n对数值趋近 $${about(power)}$，所以 $f(x)$ 趋近 $${ePower(power)}$。`,
  );
}

/** limitsInvolvingTheExponentialFunction finds limits of the form (1 + a/x)^{bx}. */
export const limitsInvolvingTheExponentialFunction: TopicDef = {
  id: "limits-involving-the-exponential-function",
  title: t("Limits Involving the Exponential Function", "与指数函数有关的极限"),
  summary: t(
    "Use $\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e$ to find limits of the form $\\left(1 + \\frac{a}{x}\\right)^{bx}$ and $(1 + ax)^{b/x}$.",
    "利用 $\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e$ 求形如 $\\left(1 + \\frac{a}{x}\\right)^{bx}$ 与 $(1 + ax)^{b/x}$ 的极限。",
  ),
  intro: t(
    "A bank pays $100\\%$ interest a year, compounded $n$ times: one dollar grows to $\\left(1 + \\frac{1}{n}\\right)^{n}$. For $n = 10$ that is $2.5937$, for $n = 1000$ it is $2.7169$, and for $n = 1\\,000\\,000$ it is $2.71828$. The amounts approach $e \\approx 2.71828$.\n\nCheck: the logarithm of $\\left(1 + \\frac{1}{n}\\right)^{n}$ is $n \\ln\\left(1 + \\frac{1}{n}\\right)$; at $n = 1000$ it is $0.9995$, close to $\\ln e = 1$.\n\nIn this lesson we use this limit to find limits of the form $\\left(1 + \\frac{a}{x}\\right)^{bx}$ as $x \\to \\infty$ and $(1 + ax)^{b/x}$ as $x \\to 0$.",
    "银行按年利率 $100\\%$ 付息，一年复利 $n$ 次：一元钱变为 $\\left(1 + \\frac{1}{n}\\right)^{n}$ 元。$n = 10$ 时是 $2.5937$，$n = 1000$ 时是 $2.7169$，$n = 1\\,000\\,000$ 时是 $2.71828$。这些金额趋近 $e \\approx 2.71828$。\n\n检验：$\\left(1 + \\frac{1}{n}\\right)^{n}$ 的对数是 $n \\ln\\left(1 + \\frac{1}{n}\\right)$；$n = 1000$ 时它是 $0.9995$，接近 $\\ln e = 1$。\n\n本课我们用这个极限求 $x \\to \\infty$ 时 $\\left(1 + \\frac{a}{x}\\right)^{bx}$ 的极限，以及 $x \\to 0$ 时 $(1 + ax)^{b/x}$ 的极限。",
  ),
  prerequisites: ["limits-of-exponential-functions", "continuously-compounded-interest"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-one-plus-a-over-x",
      title: t("Limits of (1 + a/x)^(bx)", "(1 + a/x)^(bx) 的极限"),
      explanation: t(
        "This limit defines the number $e$, and a substitution shows that changing the constants changes the answer to $e$ raised to their product. The number $e$ is the limit\n\n$$e = \\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^{x}.$$\n\nSubstituting $x = au$ gives $\\left(1 + \\frac{a}{x}\\right)^{x} \\to e^{a}$, and raising to the power $b$: $\\lim_{x \\to \\infty} \\left(1 + \\frac{a}{x}\\right)^{bx} = e^{ab}$.\n\nCheck: for $\\left(1 + \\frac{2}{x}\\right)^{3x}$ the logarithm is $3x \\ln\\left(1 + \\frac{2}{x}\\right)$, which is about $5.994$ at $x = 1000$, close to $6$; so the limit is $e^{6}$.\n\n> **Watch out.** The answer is $e^{ab}$: multiply $a$ and $b$, do not add or divide them. And the base tending to $1$ does not make the limit $1$, because the exponent grows at the same time.",
        "这个极限定义了数 $e$，换元可以说明改变常数后，答案变为 $e$ 的它们乘积次幂。数 $e$ 定义为极限\n\n$$e = \\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^{x}.$$\n\n代换 $x = au$ 得 $\\left(1 + \\frac{a}{x}\\right)^{x} \\to e^{a}$，再取 $b$ 次方：$\\lim_{x \\to \\infty} \\left(1 + \\frac{a}{x}\\right)^{bx} = e^{ab}$。\n\n检验：$\\left(1 + \\frac{2}{x}\\right)^{3x}$ 的对数是 $3x \\ln\\left(1 + \\frac{2}{x}\\right)$，$x = 1000$ 时约为 $5.994$，接近 $6$；所以极限是 $e^{6}$。\n\n> **注意。** 答案是 $e^{ab}$：$a$ 和 $b$ 要相乘，不是相加或相除。底数趋于 $1$ 并不意味着极限是 $1$，因为指数同时在增大。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.pick([1, 2, 3, 4, -1, -2]);
        const c = rng.pick([1, 1, 2, 3]);
        const answer = Q.of(a * b, c);
        const fr = c === 1 ? `\\frac{${Math.abs(a)}}{x}` : `\\frac{${Math.abs(a)}}{${c}x}`;
        const inner = `\\left(1 ${a < 0 ? "-" : "+"} ${fr}\\right)`;
        const base = `${inner}^{${kx(b)}}`;
        const mistakes = [
          {
            response: "1",
            why: t(
              "The base tends to $1$, but the exponent grows without bound, so the limit is not $1$.",
              "底数趋于 $1$，但指数无限增大，所以极限不是 $1$。",
            ),
          },
          {
            response: ePower(Q.of(a, c * b)),
            why: t(
              `This divides by $${b}$. Raising to the power $${b}$ multiplies the exponent by $${b}$.`,
              `这除以了 $${b}$。取 $${b}$ 次方是把指数乘以 $${b}$。`,
            ),
          },
          {
            response: ePower(Q.of(a + b, c)),
            why: t(
              `This adds $${a}$ and $${b}$. The exponents multiply: $e^{ab}$.`,
              `这把 $${a}$ 和 $${b}$ 相加了。指数要相乘：$e^{ab}$。`,
            ),
          },
          {
            response: ePower(answer.neg()),
            why: t(
              `This has the wrong sign in the exponent: it is $${a} \\cdot ${paren(b)}${c === 1 ? "" : ` \\div ${c}`} = ${answer.toLatex()}$.`,
              `这指数的符号错了：指数是 $${a} \\cdot ${paren(b)}${c === 1 ? "" : ` \\div ${c}`} = ${answer.toLatex()}$。`,
            ),
          },
        ].filter((m, i, all) => m.response !== ePower(answer) && all.findIndex((n) => n.response === m.response) === i);
        return withMistakes(
          functionProblem({
            prompt: t(`Find $${lim("\\infty")} ${base}$.`, `求 $${lim("\\infty")} ${base}$。`),
            answer: ePower(answer),
            wrong: mistakes.map((m) => m.response),
            solution: walked(
              [
                [
                  ["The inner limit", "里面的极限"],
                  t(
                    `By $\\left(1 + \\frac{k}{x}\\right)^{x} \\to e^{k}$ with $k = ${Q.of(a, c).toLatex()}$:`,
                    `由 $\\left(1 + \\frac{k}{x}\\right)^{x} \\to e^{k}$，取 $k = ${Q.of(a, c).toLatex()}$：`,
                  ),
                  [`${lim("\\infty")} ${inner}^{x} = ${ePower(Q.of(a, c))}`],
                ],
                [
                  ["Raise to the power", "取乘方"],
                  t(`The expression is that to the power $${b}$:`, `原式是它的 $${b}$ 次方：`),
                  [`\\left(${ePower(Q.of(a, c))}\\right)^{${b}} = ${ePower(answer)}`],
                ],
              ],
              logTable([100, 1000, 10000], (x) => b * x * Math.log(1 + a / (c * x)), answer),
            ),
          }),
          mistakes,
        );
      },
    },
    {
      id: "limits-of-one-plus-ax-to-the-b-over-x",
      title: t("Limits of (1 + ax)^(b/x)", "(1 + ax)^(b/x) 的极限"),
      explanation: t(
        "This form is the same as the limit that defines e, written with a small quantity instead of a large one, so the answer is again a power of e. Substituting $u = \\frac{1}{x}$ turns $\\lim_{x \\to \\infty}$ into $\\lim_{u \\to 0^{+}}$, and the limit also holds from the left:\n\n$$\\lim_{x \\to 0} (1 + x)^{1/x} = e, \\qquad \\lim_{x \\to 0} (1 + ax)^{b/x} = e^{ab}.$$\n\nCheck: for $(1 + 2x)^{3/x}$ the logarithm is $\\frac{3}{x} \\ln(1 + 2x)$, which is about $5.994$ at $x = 0.001$, close to $6$.\n\n> **Watch out.** Here $x \\to 0$, and the exponent $\\frac{b}{x}$ blows up. The rule is the same, $e^{ab}$; the limit is not $1$, and it is not $e^{b}$: the $a$ in the base counts.",
        "这种形式与定义 e 的极限相同，只是用一个小量代替了一个大量，所以答案仍是 e 的幂。代换 $u = \\frac{1}{x}$ 把 $\\lim_{x \\to \\infty}$ 化为 $\\lim_{u \\to 0^{+}}$，而从左侧趋近时结论同样成立：\n\n$$\\lim_{x \\to 0} (1 + x)^{1/x} = e, \\qquad \\lim_{x \\to 0} (1 + ax)^{b/x} = e^{ab}.$$\n\n检验：$(1 + 2x)^{3/x}$ 的对数是 $\\frac{3}{x} \\ln(1 + 2x)$，$x = 0.001$ 时约为 $5.994$，接近 $6$。\n\n> **注意。** 这里 $x \\to 0$，指数 $\\frac{b}{x}$ 无限增大。规律相同，是 $e^{ab}$；极限不是 $1$，也不是 $e^{b}$：底数中的 $a$ 也要算进去。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-4, 4);
        const c = rng.pick([1, 1, 2, 3]);
        const answer = Q.of(a * b, c);
        const inner = `\\left(1 ${a < 0 ? "-" : "+"} ${cx(Math.abs(a), "x")}\\right)`;
        const expr = `${inner}^{\\frac{${b}}{${c === 1 ? "" : c}x}}`;
        const mistakes = [
          {
            response: "1",
            why: t(
              "The base tends to $1$, but the exponent blows up, so the limit is not $1$.",
              "底数趋于 $1$，但指数无限增大，所以极限不是 $1$。",
            ),
          },
          {
            response: ePower(Q.of(b, c)),
            why: t(
              `This drops the $${a}$ in the base: $${inner}^{1/x} \\to ${ePower(Q.of(a))}$, not $e$.`,
              `这漏掉了底数中的 $${a}$：$${inner}^{1/x} \\to ${ePower(Q.of(a))}$，不是 $e$。`,
            ),
          },
          {
            response: ePower(Q.of(a + b, c)),
            why: t(
              `This adds $${a}$ and $${b}$. The exponents multiply: $e^{ab}$.`,
              `这把 $${a}$ 和 $${b}$ 相加了。指数要相乘：$e^{ab}$。`,
            ),
          },
          {
            response: ePower(answer.neg()),
            why: t(
              `This has the wrong sign in the exponent: it is $${answer.toLatex()}$.`,
              `这指数的符号错了：指数是 $${answer.toLatex()}$。`,
            ),
          },
        ].filter((m, i, all) => m.response !== ePower(answer) && all.findIndex((n) => n.response === m.response) === i);
        return withMistakes(
          functionProblem({
            prompt: t(`Find $${lim(0)} ${expr}$.`, `求 $${lim(0)} ${expr}$。`),
            answer: ePower(answer),
            wrong: mistakes.map((m) => m.response),
            solution: walked(
              [
                [
                  ["The basic limit", "基本极限"],
                  t(`By $(1 + kx)^{1/x} \\to e^{k}$ with $k = ${a}$:`, `由 $(1 + kx)^{1/x} \\to e^{k}$，取 $k = ${a}$：`),
                  [`${lim(0)} ${inner}^{1/x} = ${ePower(Q.of(a))}`],
                ],
                [
                  ["Raise to the power", "取乘方"],
                  t(
                    `The exponent is $\\frac{${b}}{${c === 1 ? "" : c}x} = ${Q.of(b, c).toLatex()} \\cdot \\frac{1}{x}$, so`,
                    `指数 $\\frac{${b}}{${c === 1 ? "" : c}x} = ${Q.of(b, c).toLatex()} \\cdot \\frac{1}{x}$，所以`,
                  ),
                  [`\\left(${ePower(Q.of(a))}\\right)^{${Q.of(b, c).toLatex()}} = ${ePower(answer)}`],
                ],
              ],
              logTable(atZero, (x) => (b / (c * x)) * Math.log(1 + a * x), answer),
            ),
          }),
          mistakes,
        );
      },
    },
  ],
};

/** furtherLimitsInvolvingTheExponentialFunction uses (e^x − 1)/x → 1. */
export const furtherLimitsInvolvingTheExponentialFunction: TopicDef = {
  id: "further-limits-involving-the-exponential-function",
  title: t("Further Limits Involving the Exponential Function", "与指数函数有关的进一步极限"),
  summary: t(
    "Use $\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1$ to find limits of quotients containing $e^{ax} - 1$.",
    "利用 $\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1$ 求含 $e^{ax} - 1$ 的商的极限。",
  ),
  intro: t(
    "At $x = 0.01$, $e^{x} - 1 \\approx 0.010050$, very nearly $x$ itself. So $\\frac{e^{x} - 1}{x} \\to 1$: near $0$, $e^{x} - 1 \\approx x$. Geometrically, the curve $y = e^{x}$ has slope $1$ where it crosses the $y$-axis.\n\nCheck: from the other side, at $x = -0.01$, $\\frac{e^{-0.01} - 1}{-0.01} \\approx 0.99502$, also close to $1$.\n\nIn this lesson we use $e^{ax} - 1 \\approx ax$ to find limits of quotients, alone and together with $\\sin x \\approx x$ and $\\tan x \\approx x$.",
    "$x = 0.01$ 时，$e^{x} - 1 \\approx 0.010050$，几乎就等于 $x$。所以 $\\frac{e^{x} - 1}{x} \\to 1$：在 $0$ 附近 $e^{x} - 1 \\approx x$。从几何上看，曲线 $y = e^{x}$ 在与 $y$ 轴的交点处斜率为 $1$。\n\n检验：从另一侧看，$x = -0.01$ 时 $\\frac{e^{-0.01} - 1}{-0.01} \\approx 0.99502$，也接近 $1$。\n\n本课我们利用 $e^{ax} - 1 \\approx ax$ 求商的极限，单独使用，或与 $\\sin x \\approx x$、$\\tan x \\approx x$ 结合使用。",
  ),
  prerequisites: ["limits-involving-the-exponential-function", "special-limits-involving-sine"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-e-to-the-ax-minus-one",
      title: t("Limits of (e^(ax) − 1)/(bx)", "(e^(ax) − 1)/(bx) 的极限"),
      explanation: t(
        "This standard limit says the exponential curve has slope one at zero, so near zero the exponential minus one behaves like its exponent. A standard limit is\n\n$$\\lim_{x \\to 0} \\frac{e^{x} - 1}{x} = 1,$$\n\nso near $0$, $e^{ax} - 1 \\approx ax$. Hence $\\frac{e^{ax} - 1}{bx} \\to \\frac{a}{b}$ and $\\frac{e^{ax} - e^{bx}}{cx} = \\frac{(e^{ax} - 1) - (e^{bx} - 1)}{cx} \\to \\frac{a - b}{c}$.\n\nCheck: $\\frac{e^{3x} - 1}{2x}$ at $x = 0.001$ is about $1.5023$, close to $\\frac{3}{2}$.\n\n> **Watch out.** The multiple stays: $e^{3x} - 1 \\approx 3x$, so $\\frac{e^{3x} - 1}{x} \\to 3$, not $1$. For $e^{ax} - e^{bx}$, subtract the multiples, $a - b$.",
        "这个标准极限说明指数曲线在零处的斜率为 1，所以在零附近，指数式减 1 近似等于它的指数。一个标准极限是\n\n$$\\lim_{x \\to 0} \\frac{e^{x} - 1}{x} = 1,$$\n\n所以在 $0$ 附近 $e^{ax} - 1 \\approx ax$。因此 $\\frac{e^{ax} - 1}{bx} \\to \\frac{a}{b}$，$\\frac{e^{ax} - e^{bx}}{cx} = \\frac{(e^{ax} - 1) - (e^{bx} - 1)}{cx} \\to \\frac{a - b}{c}$。\n\n检验：$\\frac{e^{3x} - 1}{2x}$ 在 $x = 0.001$ 时约为 $1.5023$，接近 $\\frac{3}{2}$。\n\n> **注意。** 倍数要保留：$e^{3x} - 1 \\approx 3x$，所以 $\\frac{e^{3x} - 1}{x} \\to 3$，不是 $1$。对于 $e^{ax} - e^{bx}$，要把倍数相减，得 $a - b$。",
      ),
      generate(rng) {
        const [a, b] = rng.sample([-4, -3, -2, -1, 1, 2, 3, 4, 5], 2) as [number, number];
        const c = rng.nonZero(-5, 5);
        const two = rng.bool(0.4);
        const top = two ? `e^{${kx(a)}} - e^{${kx(b)}}` : `e^{${kx(a)}} - 1`;
        const answer = two ? Q.of(a - b, c) : Q.of(a, c);
        const f = (x: number) => (two ? Math.exp(a * x) - Math.exp(b * x) : Math.exp(a * x) - 1) / (c * x);
        return numberProblem({
          prompt: t(`Find $${lim(0)} \\frac{${top}}{${kx(c)}}$.`, `求 $${lim(0)} \\frac{${top}}{${kx(c)}}$。`),
          answer,
          mistakes: firsts([
            why(Q.zero, "Substituting gives $\\frac{0}{0}$, not $0$.", "代入得到的是 $\\frac{0}{0}$，不是 $0$。"),
            why(
              Q.one,
              `This uses $\\frac{e^{u} - 1}{u} \\to 1$ without the multiples. Near $0$, $e^{${kx(a)}} - 1 \\approx ${kx(a)}$.`,
              `这用了 $\\frac{e^{u} - 1}{u} \\to 1$，却没有考虑倍数。在 $0$ 附近 $e^{${kx(a)}} - 1 \\approx ${kx(a)}$。`,
            ),
            why(inv(answer), "This turns the ratio upside down.", "这把比颠倒了。"),
            two
              ? why(
                  Q.of(a + b, c),
                  `This adds the multiples. The second exponential is subtracted, so the top is about $(${a} - ${paren(b)})x$.`,
                  `这把倍数相加了。第二个指数式是减去的，所以分子约为 $(${a} - ${paren(b)})x$。`,
                )
              : why(
                  Q.of(a - 1, c),
                  `This subtracts $1$ from the multiple. It is $e^{${kx(a)}} - 1 \\approx ${kx(a)}$, with the $1$ already used up.`,
                  `这从倍数中减去了 $1$。实际上 $e^{${kx(a)}} - 1 \\approx ${kx(a)}$，减去的 $1$ 已经用掉了。`,
                ),
          ]),
          solution: two
            ? walked(
                [
                  [["Split the top", "拆开分子"], none, [`${top} = (e^{${kx(a)}} - 1) - (e^{${kx(b)}} - 1)`]],
                  [
                    ["Replace each part", "替换每一部分"],
                    t("Near $0$, $e^{u} - 1 \\approx u$:", "在 $0$ 附近 $e^{u} - 1 \\approx u$："),
                    [`${kx(a)} - ${b < 0 ? `(${kx(b)})` : kx(b)} = ${kx(a - b)}`],
                  ],
                  [["Divide", "相除"], none, [`\\frac{${kx(a - b)}}{${kx(c)}} = ${answer.toLatex()}`]],
                ],
                tabled(
                  near(0).map((x) => x / 10),
                  f,
                  towards(answer),
                ),
              )
            : walked(
                [
                  [
                    ["Replace the top", "替换分子"],
                    t(
                      `Near $0$, $e^{u} - 1 \\approx u$ with $u = ${kx(a)}$:`,
                      `在 $0$ 附近，取 $u = ${kx(a)}$，有 $e^{u} - 1 \\approx u$：`,
                    ),
                    [`e^{${kx(a)}} - 1 \\approx ${kx(a)}`],
                  ],
                  [["Divide", "相除"], none, [`\\frac{${kx(a)}}{${kx(c)}} = ${ratio(a, c)}`]],
                ],
                tabled(
                  near(0).map((x) => x / 10),
                  f,
                  towards(answer),
                ),
              ),
        });
      },
    },
    {
      id: "combining-exponential-and-sine-limits",
      title: t("Combining with other special limits", "与其他特殊极限结合"),
      explanation: t(
        "Each factor that goes to zero behaves like a simple multiple of the variable, so the limit of the whole quotient is the ratio of those multiples. Replace each factor by its linear approximation near $0$: $e^{ax} - 1 \\approx ax$, $\\sin bx \\approx bx$, $\\tan bx \\approx bx$. So\n\n$$\\lim_{x \\to 0} \\frac{e^{6x} - 1}{\\sin 2x} = \\frac{6}{2} = 3, \\qquad \\lim_{x \\to 0} \\frac{e^{2x} - 1}{e^{5x} - 1} = \\frac{2}{5}.$$\n\nCheck: at $x = 0.001$ the first quotient is about $3.009$, and at $x = 0.0001$ closer still.\n\n> **Watch out.** Divide the multiples, do not multiply them: $\\frac{6x}{2x} = 3$, not $12$. And the quotient is not $1$ just because both parts tend to $0$.",
        "每个趋于零的因式都近似于变量的一个简单倍数，所以整个商的极限就是这些倍数之比。把每个因子换成它在 $0$ 附近的线性近似：$e^{ax} - 1 \\approx ax$，$\\sin bx \\approx bx$，$\\tan bx \\approx bx$。所以\n\n$$\\lim_{x \\to 0} \\frac{e^{6x} - 1}{\\sin 2x} = \\frac{6}{2} = 3, \\qquad \\lim_{x \\to 0} \\frac{e^{2x} - 1}{e^{5x} - 1} = \\frac{2}{5}.$$\n\n检验：$x = 0.001$ 时第一个商约为 $3.009$，$x = 0.0001$ 时更接近 $3$。\n\n> **注意。** 倍数要相除，不是相乘：$\\frac{6x}{2x} = 3$，不是 $12$。分子分母都趋于 $0$，也不能说明商是 $1$。",
      ),
      generate(rng) {
        const [a, b] = rng.sample([-3, -2, -1, 1, 2, 3, 4, 5, 6, 7], 2) as [number, number];
        const bottomFn = rng.pick(["\\sin", "\\tan", "e"]);
        const bottom = bottomFn === "e" ? `e^{${kx(b)}} - 1` : `${bottomFn} ${ta(b)}`;
        const answer = Q.of(a, b);
        const g = (x: number) => (bottomFn === "e" ? Math.exp(b * x) - 1 : bottomFn === "\\sin" ? Math.sin(b * x) : Math.tan(b * x));
        return numberProblem({
          prompt: t(`Find $${lim(0)} \\frac{e^{${kx(a)}} - 1}{${bottom}}$.`, `求 $${lim(0)} \\frac{e^{${kx(a)}} - 1}{${bottom}}$。`),
          answer,
          mistakes: firsts([
            why(Q.zero, "Substituting gives $\\frac{0}{0}$, not $0$.", "代入得到的是 $\\frac{0}{0}$，不是 $0$。"),
            why(
              Q.one,
              "Both parts tend to $0$, but that does not make the quotient $1$. Compare their multiples of $x$.",
              "分子分母都趋于 $0$，并不说明商是 $1$。要比较它们 $x$ 的倍数。",
            ),
            why(inv(answer), "This turns the ratio upside down.", "这把比颠倒了。"),
            why(
              answer.neg(),
              `This loses a sign. The multiples are $${a}$ and $${b}$, with their signs.`,
              `这丢了符号。倍数是 $${a}$ 和 $${b}$，要带着符号。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Replace each part by its multiple of x", "把每部分换成 x 的倍数"],
                t(
                  "Near $0$, $e^{u} - 1 \\approx u$, $\\sin u \\approx u$ and $\\tan u \\approx u$:",
                  "在 $0$ 附近，$e^{u} - 1 \\approx u$，$\\sin u \\approx u$，$\\tan u \\approx u$：",
                ),
                [`e^{${kx(a)}} - 1 \\approx ${kx(a)}, \\quad ${bottom} \\approx ${kx(b)}`],
              ],
              [["Divide", "相除"], t("The $x$'s cancel:", "$x$ 约掉："), [`\\frac{${kx(a)}}{${kx(b)}} = ${ratio(a, b)}`]],
            ],
            tabled(
              near(0).map((x) => x / 10),
              (x) => (Math.exp(a * x) - 1) / g(x),
              towards(answer),
            ),
          ),
        });
      },
    },
  ],
};

/** calculusILimitTechniqueTopics are the topics of Calculus I modules 2.5 and 2.6. */
export const calculusILimitTechniqueTopics: readonly TopicDef[] = [
  calculatingLimitsOfRationalFunctionsByFactoring,
  limitsOfAbsoluteValueFunctions,
  calculatingLimitsOfRadicalFunctionsUsingConjugateMultiplication,
  calculatingLimitsUsingTrigonometricIdentities,
  limitsAtInfinityAndHorizontalAsymptotesOfRationalFunctions,
  evaluatingLimitsAtInfinityByComparingRelativeMagnitudesOfFunctions,
  evaluatingLimitsAtInfinityOfRadicalFunctions,
  theSqueezeTheorem,
  specialLimitsInvolvingSine,
  evaluatingSpecialLimitsInvolvingSineUsingASubstitution,
  specialLimitsInvolvingCosine,
  limitsInvolvingTheExponentialFunction,
  furtherLimitsInvolvingTheExponentialFunction,
];
