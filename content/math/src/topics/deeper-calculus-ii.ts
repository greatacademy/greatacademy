// Further knowledge points for topics of Calculus II, each a skill the topic's own
// points leave out. See `deeperCalculusIIPoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { calculusDrawings4 } from "../explanation-drawings-calculus-4.ts";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";

import { numberProblem, steps } from "../problems.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";

/** nonzero picks a nonzero integer from -r to r. */
const nonzero = (rng: Rng, r: number) => rng.pick([...Array(2 * r + 1).keys()].map((i) => i - r).filter((i) => i !== 0));
/** inParens puts a negative number in parentheses, for use inside a sum. */
const inParens = (n: number) => (n < 0 ? `(${n})` : `${n}`);
/** different picks an integer from lo to hi other than the one given. */
const different = (rng: Rng, lo: number, hi: number, other: number) =>
  rng.pick([...Array(hi - lo + 1).keys()].map((i) => i + lo).filter((i) => i !== other));

/** WalkStep is one labelled step of a worked solution: its title and what it says in both languages, and the lines it displays. */
type WalkStep = readonly [title: readonly [string, string], say: readonly [string, string], lines?: readonly string[]];

/** walkThrough writes labelled steps, each with its displayed lines, followed by a check that takes a second route. */
const walkThrough = (parts: readonly WalkStep[], check: readonly [string, string]) => {
  const write = (zh: boolean) =>
    parts
      .map(([[en, zhTitle], say, lines = []], i) => {
        const label = zh ? `**第${["一", "二", "三", "四", "五"][i]}步：${zhTitle}。**` : `**Step ${i + 1}: ${en}.**`;
        return `${label} ${say[zh ? 1 : 0]}${lines.length > 0 ? steps(...lines) : "\n\n"}`;
      })
      .join("") + (zh ? `**检验。** ${check[1]}` : `**Check.** ${check[0]}`);
  return t(write(false), write(true));
};
/** parQ writes a rational number, in parentheses when it is negative. */
const parQ = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());
/** coefQ writes a rational coefficient before a symbol, leaving out 1 and keeping the sign of -1. */
const coefQ = (q: Q) => (q.eq(Q.one) ? "" : q.eq(Q.one.neg()) ? "-" : q.toLatex());
/** piTimes writes a rational multiple of pi. */
const piTimes = (q: Q) => `${coefQ(q)}\\pi`;
/** dTheta writes a constant times dθ, leaving out 1. */
const dTheta = (q: Q) => (q.eq(Q.one) ? "d\\theta" : `${q.toLatex()}\\,d\\theta`);

const scaledKnownIntegral: KnowledgePointDef = {
  id: "a-known-integral-with-a-scaled-argument",
  title: t("A known integral with a scaled argument", "自变量伸缩后的已知积分"),
  explanation: t(
    "Substitution works even when $f$ has no formula. With $u = kx$, the integral of $f(kx)$ becomes the integral of $f(u)$ divided by $k$, and the limits are multiplied by $k$. So a known integral of $f$ over the new limits gives the answer directly. For example, if $\\int_0^{6} f(x)\\,dx$ is $12$, then $\\int_0^{2} f(3x)\\,dx$ is $\\frac{12}{3}$, which is $4$.\n\nCheck: if $f$ is the constant $2$, then $\\int_0^{6} 2\\,dx$ is $12$ and $\\int_0^{2} 2\\,dx$ is $4$, as predicted.\n\n> **Watch out.** Divide by $k$, do not multiply. The interval $[0, b]$ is $k$ times shorter than $[0, kb]$, so the integral shrinks by the factor $k$.",
    "即使 $f$ 没有公式，换元也可以用。令 $u = kx$，$f(kx)$ 的积分变成 $f(u)$ 的积分除以 $k$，积分限都乘以 $k$。所以已知 $f$ 在新积分限上的积分，就能直接得到答案。例如，若 $\\int_0^{6} f(x)\\,dx$ 等于 $12$，则 $\\int_0^{2} f(3x)\\,dx$ 等于 $\\frac{12}{3}$，即 $4$。\n\n检验：若 $f$ 是常数 $2$，则 $\\int_0^{6} 2\\,dx$ 等于 $12$，$\\int_0^{2} 2\\,dx$ 等于 $4$，与预期一致。\n\n> **注意。** 要除以 $k$，而不是乘以 $k$。区间 $[0, b]$ 比 $[0, kb]$ 短 $k$ 倍，所以积分缩小为原来的 $\\frac{1}{k}$。",
  ),
  generate(rng) {
    const k = rng.int(2, 6);
    const b = rng.int(1, 5);
    const v = nonzero(rng, 12);
    const answer = Q.of(v, k);
    const level = Q.of(v, k * b);
    return numberProblem({
      prompt: t(
        `$\\int_0^{${k * b}} f(x)\\,dx = ${v}$. Find $\\int_0^{${b}} f(${k}x)\\,dx$.`,
        `$\\int_0^{${k * b}} f(x)\\,dx = ${v}$。求 $\\int_0^{${b}} f(${k}x)\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(v), Q.of(k * v), Q.of(v, k * b)],
      solution: walkThrough(
        [
          [
            ["Substitute", "换元"],
            [
              `Let $u = ${k}x$. Then $du = ${k}\\,dx$, and the limits $x = 0$ and $x = ${b}$ become $u = 0$ and $u = ${k * b}$:`,
              `令 $u = ${k}x$，则 $du = ${k}\\,dx$，积分限 $x = 0$ 和 $x = ${b}$ 变成 $u = 0$ 和 $u = ${k * b}$：`,
            ],
            [`dx = \\frac{1}{${k}}\\,du`],
          ],
          [
            ["Use the known integral", "用已知的积分"],
            ["The integral in $u$ is the one given:", "关于 $u$ 的积分正是已知的那个："],
            [
              `\\int_0^{${b}} f(${k}x)\\,dx = \\frac{1}{${k}}\\int_0^{${k * b}} f(u)\\,du = \\frac{1}{${k}} \\cdot ${inParens(v)} = ${answer.toLatex()}`,
            ],
          ],
        ],
        [
          `Try the constant function $f = c$ with the given integral. Then $${k * b}c = ${v}$, so $c$ is $${level.toLatex()}$, and $\\int_0^{${b}} c\\,dx$ is $${b} \\cdot ${parQ(level)}$, which is $${answer.toLatex()}$ again.`,
          `取满足已知积分的常函数 $f = c$。则 $${k * b}c = ${v}$，所以 $c$ 等于 $${level.toLatex()}$，而 $\\int_0^{${b}} c\\,dx$ 等于 $${b} \\cdot ${parQ(level)}$，同样是 $${answer.toLatex()}$。`,
        ],
      ),
    });
  },
};

const partsFromValues: KnowledgePointDef = {
  id: "integration-by-parts-from-given-values",
  title: t("Integration by parts from given values", "由给定的值分部积分"),
  explanation: t(
    "Integration by parts also applies to a function known only through some values. Taking $u = x$ and $dv = f'(x)\\,dx$ gives $\\int_a^b xf'(x)\\,dx = \\big[xf(x)\\big]_a^b - \\int_a^b f(x)\\,dx$. The boundary term needs only the values of $f$ at the ends. For example, if $f(1) = 2$, $f(3) = 5$ and $\\int_1^3 f(x)\\,dx = 4$, then $\\int_1^3 xf'(x)\\,dx = (3 \\cdot 5 - 1 \\cdot 2) - 4 = 9$.\n\nCheck: with $f(x) = x$ on $[0, 1]$, $\\int_0^1 x \\cdot 1\\,dx = \\frac{1}{2}$, and the formula gives $(1 \\cdot 1 - 0) - \\frac{1}{2} = \\frac{1}{2}$.\n\n> **Watch out.** The boundary term is $bf(b) - af(a)$, with the factor $x$ kept, not $f(b) - f(a)$. And the given integral is subtracted.",
    "只知道函数的某些值时，也可以分部积分。取 $u = x$，$dv = f'(x)\\,dx$，得 $\\int_a^b xf'(x)\\,dx = \\big[xf(x)\\big]_a^b - \\int_a^b f(x)\\,dx$。边界项只需要 $f$ 在两端的值。例如，若 $f(1) = 2$，$f(3) = 5$，$\\int_1^3 f(x)\\,dx = 4$，则 $\\int_1^3 xf'(x)\\,dx = (3 \\cdot 5 - 1 \\cdot 2) - 4 = 9$。\n\n检验：在 $[0, 1]$ 上取 $f(x) = x$，$\\int_0^1 x \\cdot 1\\,dx = \\frac{1}{2}$，而公式给出 $(1 \\cdot 1 - 0) - \\frac{1}{2} = \\frac{1}{2}$。\n\n> **注意。** 边界项是 $bf(b) - af(a)$，要保留因子 $x$，不是 $f(b) - f(a)$。而且已知的积分是减去的。",
  ),
  generate(rng) {
    const a = rng.int(0, 3);
    const b = a + rng.int(1, 5);
    const fa = nonzero(rng, 9);
    const fb = nonzero(rng, 9);
    const I = nonzero(rng, 12);
    const boundary = b * fb - a * fa;
    const answer = boundary - I;
    return numberProblem({
      prompt: t(
        `$f(${a}) = ${fa}$, $f(${b}) = ${fb}$ and $\\int_{${a}}^{${b}} f(x)\\,dx = ${I}$. Find $\\int_{${a}}^{${b}} xf'(x)\\,dx$.`,
        `$f(${a}) = ${fa}$，$f(${b}) = ${fb}$，$\\int_{${a}}^{${b}} f(x)\\,dx = ${I}$。求 $\\int_{${a}}^{${b}} xf'(x)\\,dx$。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        {
          value: boundary + I,
          why: t("The formula subtracts $\\int f(x)\\,dx$; here it was added.", "公式要减去 $\\int f(x)\\,dx$；这里把它加上了。"),
        },
        {
          value: boundary,
          why: t(
            "This is only the boundary term; the given integral $\\int f(x)\\,dx$ still has to be subtracted.",
            "这只是边界项；还要减去已知的积分 $\\int f(x)\\,dx$。",
          ),
        },
        {
          value: fb - fa - I,
          why: t(
            "The boundary term is $\\big[xf(x)\\big]$, which keeps the factor $x$: $bf(b) - af(a)$, not $f(b) - f(a)$.",
            "边界项是 $\\big[xf(x)\\big]$，要保留因子 $x$：是 $bf(b) - af(a)$，不是 $f(b) - f(a)$。",
          ),
        },
      ],
      solution: walkThrough(
        [
          [
            ["Integrate by parts", "分部积分"],
            [
              "Take $u = x$ and $dv = f'(x)\\,dx$, so $du = dx$ and $v = f(x)$:",
              "取 $u = x$，$dv = f'(x)\\,dx$，则 $du = dx$，$v = f(x)$：",
            ],
            [`\\int_{${a}}^{${b}} xf'(x)\\,dx = \\big[xf(x)\\big]_{${a}}^{${b}} - \\int_{${a}}^{${b}} f(x)\\,dx`],
          ],
          [
            ["Put in the values", "代入数值"],
            ["Use the given values of $f$ and of its integral:", "代入 $f$ 的已知值和已知的积分："],
            [`= ${b}(${fb}) - ${a}(${fa}) - ${inParens(I)}`, `= ${boundary} - ${inParens(I)} = ${answer}`],
          ],
        ],
        [
          `Read the formula backwards: the answer plus the given integral must be the boundary term. Indeed $${answer} + ${inParens(I)} = ${boundary}$, and $${b} \\cdot ${inParens(fb)} - ${a} \\cdot ${inParens(fa)} = ${boundary}$.`,
          `把公式倒过来读：答案加上已知的积分应等于边界项。确实 $${answer} + ${inParens(I)} = ${boundary}$，而 $${b} \\cdot ${inParens(fb)} - ${a} \\cdot ${inParens(fa)} = ${boundary}$。`,
        ],
      ),
    });
  },
};

const coverUp: KnowledgePointDef = {
  id: "the-cover-up-method-with-three-factors",
  title: t("The cover-up method with three factors", "三个因式的掩盖法"),
  explanation: t(
    "To find the coefficient over a distinct linear factor $x - a$, multiply both sides by that factor and set $x = a$. Every other partial fraction is then multiplied by $x - a$, which is $0$ there, so only the coefficient is left. In practice, cover the factor and substitute $x = a$ into what remains, with no system of equations to solve. For example, the coefficient over $x - 1$ in $\\frac{6}{(x - 1)(x - 2)(x - 3)}$ is\n\n$$A = \\frac{6}{(1 - 2)(1 - 3)} = 3$$\n\nCheck: the cover-up also gives $-6$ over $x - 2$ and $3$ over $x - 3$. At $x = 0$ the three fractions are $-3$, $3$ and $-1$, which add up to $-1$, and the original fraction at $0$ is $\\frac{6}{-6}$, also $-1$.\n\n> **Watch out.** Substitute the root of the covered factor into the other factors, each written as the root minus that factor's own root. A slip in one sign flips the answer.",
    "要求一次因式 $x - a$ 上的系数，两边同乘这个因式，再令 $x = a$。其他部分分式都乘上了 $x - a$，在这一点为 $0$，于是只剩下这个系数。实际做法就是盖住这个因式，把 $x = a$ 代入剩下的部分，不用解方程组。例如，$\\frac{6}{(x - 1)(x - 2)(x - 3)}$ 中 $x - 1$ 上的系数是\n\n$$A = \\frac{6}{(1 - 2)(1 - 3)} = 3$$\n\n检验：用掩盖法还可得 $x - 2$ 上的系数为 $-6$，$x - 3$ 上的系数为 $3$。在 $x = 0$ 处三个分式分别是 $-3$、$3$ 和 $-1$，和为 $-1$；原分式在 $0$ 处是 $\\frac{6}{-6}$，也是 $-1$。\n\n> **注意。** 要把被盖住因式的根代入其他因式，每个因式都写成这个根减去它自己的根。一个符号出错，答案就变号。",
  ),
  generate(rng) {
    const a = rng.int(-4, 4);
    const b = different(rng, -4, 4, a);
    const c = rng.pick([-4, -3, -2, -1, 0, 1, 2, 3, 4].filter((x) => x !== a && x !== b));
    const n = rng.int(1, 12);
    const answer = Q.of(n, (a - b) * (a - c));
    const B = Q.of(n, (b - a) * (b - c));
    const C = Q.of(n, (c - a) * (c - b));
    const fa = poly([1, "x"], [-a, ""]);
    const fb = poly([1, "x"], [-b, ""]);
    const fc = poly([1, "x"], [-c, ""]);
    return numberProblem({
      prompt: t(
        `In the partial fraction decomposition of $\\frac{${n}}{(${fb})(${fa})(${fc})}$, find the coefficient $A$ of $\\frac{A}{${fa}}$.`,
        `在 $\\frac{${n}}{(${fb})(${fa})(${fc})}$ 的部分分式分解中，求 $\\frac{A}{${fa}}$ 的系数 $A$。`,
      ),
      answer,
      wrong: [Q.of(n), answer.neg(), Q.of(n, (a + b) * (a + c) || 1)],
      solution: walkThrough(
        [
          [
            ["Cover the factor", "盖住因式"],
            [
              `Multiply both sides by $${fa}$. The other two fractions keep a factor $${fa}$, which is $0$ at $x = ${a}$, so at that point only $A$ is left:`,
              `两边同乘 $${fa}$。另外两个分式仍带有因式 $${fa}$，它在 $x = ${a}$ 处为 $0$，所以在这一点只剩下 $A$：`,
            ],
            [`A = \\left.\\frac{${n}}{(${fb})(${fc})}\\right|_{x = ${a}}`],
          ],
          [
            ["Substitute the root", "代入根"],
            [`Put $x = ${a}$ into the two remaining factors:`, `把 $x = ${a}$ 代入剩下的两个因式：`],
            [
              `A = \\frac{${n}}{(${a} - ${inParens(b)})(${a} - ${inParens(c)})}`,
              `= \\frac{${n}}{(${a - b})(${a - c})} = ${answer.toLatex()}`,
            ],
          ],
        ],
        [
          `The numerator has no $x^{2}$ term, and clearing denominators shows that the $x^{2}$ coefficient is $A + B + C$, so the three coefficients add up to $0$. The cover-up gives $B = ${B.toLatex()}$ over $${fb}$ and $C = ${C.toLatex()}$ over $${fc}$:${steps(`${answer.toLatex()} + ${parQ(B)} + ${parQ(C)} = 0`).trimEnd()}`,
          `分子没有 $x^{2}$ 项，而去分母后 $x^{2}$ 的系数是 $A + B + C$，所以三个系数之和为 $0$。用掩盖法得 $${fb}$ 上的 $B = ${B.toLatex()}$，$${fc}$ 上的 $C = ${C.toLatex()}$：${steps(`${answer.toLatex()} + ${parQ(B)} + ${parQ(C)} = 0`).trimEnd()}`,
        ],
      ),
    });
  },
};

const exponentFromImproper: KnowledgePointDef = {
  id: "the-exponent-from-the-value-of-an-improper-integral",
  title: t("The exponent from the value of an improper integral", "由反常积分的值求指数"),
  explanation: t(
    "For $p > 1$,\n\n$$\\int_1^\\infty \\frac{k}{x^{p}}\\,dx = \\frac{k}{p - 1}$$\n\nThe value shrinks as $p$ grows, so each value belongs to one exponent. Given the value, set $\\frac{k}{p - 1}$ equal to it and solve for $p$. For example, if $\\int_1^\\infty \\frac{6}{x^{p}}\\,dx$ is $2$, then $p - 1 = 3$, so $p = 4$.\n\nCheck: with $p = 4$, $\\int_1^t 6x^{-4}\\,dx$ is $2 - \\frac{2}{t^{3}}$, which tends to $2$.\n\n> **Watch out.** The value gives $p - 1$ first; $1$ still has to be added to reach $p$.",
    "当 $p > 1$ 时，\n\n$$\\int_1^\\infty \\frac{k}{x^{p}}\\,dx = \\frac{k}{p - 1}$$\n\n$p$ 越大积分值越小，所以每个值只对应一个指数。已知积分值时，令 $\\frac{k}{p - 1}$ 等于它，解出 $p$。例如，若 $\\int_1^\\infty \\frac{6}{x^{p}}\\,dx$ 等于 $2$，则 $p - 1 = 3$，所以 $p = 4$。\n\n检验：$p = 4$ 时，$\\int_1^t 6x^{-4}\\,dx$ 等于 $2 - \\frac{2}{t^{3}}$，趋于 $2$。\n\n> **注意。** 由积分值先得到的是 $p - 1$，还要加上 $1$ 才是 $p$。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const p = rng.int(2, 7);
    const v = Q.of(k, p - 1);
    return numberProblem({
      prompt: t(
        `For which $p > 1$ does $\\int_1^\\infty \\frac{${k}}{x^p}\\,dx = ${v.toLatex()}$?`,
        `$p > 1$ 取何值时 $\\int_1^\\infty \\frac{${k}}{x^p}\\,dx = ${v.toLatex()}$？`,
      ),
      answer: p,
      solveFor: "p",
      wrong: [p - 1, p + 1, k],
      solution: walkThrough(
        [
          [
            ["Evaluate the integral in terms of p", "用 p 表示积分"],
            [
              "For $p > 1$, the integral up to $t$ contains $t^{1 - p}$, which tends to $0$ as $t \\to \\infty$:",
              "当 $p > 1$ 时，积到 $t$ 的积分含有 $t^{1 - p}$，它在 $t \\to \\infty$ 时趋于 $0$：",
            ],
            [`\\int_1^\\infty \\frac{${k}}{x^p}\\,dx = \\frac{${k}}{p - 1}`],
          ],
          [
            ["Solve for p", "解出 p"],
            ["Set this equal to the given value:", "令它等于已知的值："],
            [`\\frac{${k}}{p - 1} = ${v.toLatex()}`, `p - 1 = ${p - 1}`, `p = ${p}`],
          ],
        ],
        [
          `Put $p = ${p}$ back into the formula; it gives the value in the question:${steps(`\\frac{${k}}{${p} - 1} = ${v.toLatex()}`).trimEnd()}`,
          `把 $p = ${p}$ 代回公式，得到题中的值：${steps(`\\frac{${k}}{${p} - 1} = ${v.toLatex()}`).trimEnd()}`,
        ],
      ),
    });
  },
};

const peakAmount: KnowledgePointDef = {
  id: "the-largest-amount-from-a-rate",
  title: t("The largest amount from a rate", "由变化率求最大量"),
  explanation: t(
    "An amount grows while its rate is positive and shrinks once the rate is negative, so it is largest at the moment the rate crosses zero. The size of the peak is the starting amount plus the integral of the rate up to that moment. For example, a tank holds $10$ L and water enters at $r(t) = 6 - 2t$ L/min. The rate is zero at $t = 3$, and $\\int_0^3 (6 - 2t)\\,dt = 18 - 9 = 9$, so the largest amount is $10 + 9 = 19$ L.\n\nCheck: the graph of $r$ from $t = 0$ to $t = 3$ cuts off a triangle of base $3$ and height $6$, of area $\\frac{1}{2} \\cdot 3 \\cdot 6 = 9$.\n\n> **Watch out.** The amount is largest where the rate is zero, not where the rate is largest. And the starting amount counts: the integral gives only what was gained.",
    "变化率为正时量在增加，变化率为负时量在减少，所以在变化率穿过零的时刻量最大。峰值等于初始量加上变化率到那一刻的积分。例如，水箱中有 $10$ L 水，水以 $r(t) = 6 - 2t$ L/min 的速率流入。变化率在 $t = 3$ 时为零，$\\int_0^3 (6 - 2t)\\,dt = 18 - 9 = 9$，所以最大水量是 $10 + 9 = 19$ L。\n\n检验：$r$ 的图像在 $t = 0$ 到 $t = 3$ 之间围成底为 $3$、高为 $6$ 的三角形，面积为 $\\frac{1}{2} \\cdot 3 \\cdot 6 = 9$。\n\n> **注意。** 量在变化率为零处最大，而不是在变化率最大处。初始量也要算上：积分只给出增加的部分。",
  ),
  generate(rng) {
    const A = rng.int(5, 60);
    const a = rng.int(2, 20);
    const b = rng.int(1, 4);
    const gain = Q.of(a * a, 2 * b);
    const answer = gain.add(Q.of(A));
    const peak = Q.of(a, b);
    const rate = poly([a, ""], [-b, "t"]);
    return numberProblem({
      prompt: t(
        `A tank holds ${A} L at time $t = 0$, and water enters at $r(t) = ${rate}$ L/min, where a negative rate means water is leaving. What is the largest amount of water in the tank, in litres?`,
        `水箱在 $t = 0$ 时有 ${A} L 水，水以 $r(t) = ${rate}$ L/min 的速率流入，速率为负表示水在流出。水箱中水量的最大值是多少升？`,
      ),
      answer,
      mistakes: [
        {
          value: gain,
          why: t(
            `This is only the water gained; the ${A} L already in the tank must be added.`,
            `这只是增加的水量；还要加上水箱里原有的 ${A} L。`,
          ),
        },
        {
          value: Q.of(a * a, b).add(Q.of(A)),
          why: t(
            `This leaves out the integral of the $-${b === 1 ? "" : b}t$ term, $-${coefQ(Q.of(b, 2))}t^2$, which takes away the water lost to the falling rate.`,
            `这里漏掉了 $-${b === 1 ? "" : b}t$ 项的积分 $-${coefQ(Q.of(b, 2))}t^2$，它扣除了速率下降少流入的水。`,
          ),
        },
        {
          value: Q.of(A).add(peak),
          why: t(
            `This adds the time $t = ${peak.toLatex()}$ at which the rate is zero; add the water gained by then, the integral of the rate.`,
            `这里加上的是变化率为零的时刻 $t = ${peak.toLatex()}$；应加上到那时增加的水量，即变化率的积分。`,
          ),
        },
        {
          value: Q.of(A + a),
          why: t(
            `This adds the starting rate, ${a} L/min, which is a rate, not an amount of water.`,
            `这里加上的是初始速率 ${a} L/min，它是速率，不是水量。`,
          ),
        },
      ],
      solution: walkThrough(
        [
          [
            ["Find when the rate is zero", "求变化率为零的时刻"],
            [
              "The amount grows while $r(t) > 0$ and shrinks afterwards, so it peaks where:",
              "$r(t) > 0$ 时水量增加，之后减少，所以峰值出现在：",
            ],
            [`${rate} = 0 \\implies t = ${peak.toLatex()}`],
          ],
          [
            ["Integrate up to that moment", "积分到那一刻"],
            ["The water gained by then is:", "到那时增加的水量是："],
            [
              `\\int_0^{${peak.toLatex()}} (${rate})\\,dt = \\Big[${a}t - ${coefQ(Q.of(b, 2))}t^2\\Big]_0^{${peak.toLatex()}} = ${gain.toLatex()}`,
            ],
          ],
          [
            ["Add the starting amount", "加上初始量"],
            ["So the largest amount is:", "所以最大水量是："],
            [`${A} + ${gain.toLatex()} = ${answer.toLatex()}`],
          ],
        ],
        [
          `The graph of $r$ from $t = 0$ to $t = ${peak.toLatex()}$ cuts off a triangle of base $${peak.toLatex()}$ and height $${a}$, so the gain is $\\frac{1}{2} \\cdot ${peak.toLatex()} \\cdot ${a} = ${gain.toLatex()}$, and $${A} + ${gain.toLatex()} = ${answer.toLatex()}$.`,
          `$r$ 的图像在 $t = 0$ 到 $t = ${peak.toLatex()}$ 之间围成底为 $${peak.toLatex()}$、高为 $${a}$ 的三角形，所以增加量为 $\\frac{1}{2} \\cdot ${peak.toLatex()} \\cdot ${a} = ${gain.toLatex()}$，而 $${A} + ${gain.toLatex()} = ${answer.toLatex()}$。`,
        ],
      ),
    });
  },
};

const averageOverAdjacentIntervals: KnowledgePointDef = {
  id: "the-average-value-over-adjacent-intervals",
  title: t("The average value over adjacent intervals", "相邻区间上的平均值"),
  explanation: t(
    "An average value times the length of its interval is the integral over that interval. To combine two adjacent intervals, add these integrals and divide by the total length. For example, if $f$ averages $2$ on $[0, 1]$ and $5$ on $[1, 4]$, the integrals are $2 \\cdot 1 = 2$ and $5 \\cdot 3 = 15$, so the average on $[0, 4]$ is $\\frac{2 + 15}{4} = \\frac{17}{4}$.\n\nCheck: weight each average by the share of the length it covers: $\\frac{1}{4} \\cdot 2 + \\frac{3}{4} \\cdot 5 = \\frac{17}{4}$, which lies between $2$ and $5$.\n\n> **Watch out.** This is a weighted average. The plain average $\\frac{2 + 5}{2} = \\frac{7}{2}$ is correct only when the two lengths are equal.",
    "平均值乘以区间长度就是该区间上的积分。要合并两个相邻区间，把这些积分相加，再除以总长度。例如，若 $f$ 在 $[0, 1]$ 上的平均值是 $2$，在 $[1, 4]$ 上是 $5$，两段积分为 $2 \\cdot 1 = 2$ 和 $5 \\cdot 3 = 15$，所以在 $[0, 4]$ 上的平均值是 $\\frac{2 + 15}{4} = \\frac{17}{4}$。\n\n检验：按每段所占长度的比例加权：$\\frac{1}{4} \\cdot 2 + \\frac{3}{4} \\cdot 5 = \\frac{17}{4}$，它介于 $2$ 与 $5$ 之间。\n\n> **注意。** 这是加权平均。简单平均 $\\frac{2 + 5}{2} = \\frac{7}{2}$ 只有在两段长度相等时才正确。",
  ),
  generate(rng) {
    const a = rng.int(0, 4);
    const b = a + rng.int(1, 5);
    const c = b + rng.int(1, 6);
    const u = nonzero(rng, 9);
    const v = different(rng, -9, 9, u);
    const total = u * (b - a) + v * (c - b);
    const answer = Q.of(total, c - a);
    return numberProblem({
      prompt: t(
        `$f$ has average value $${u}$ on $[${a}, ${b}]$ and average value $${v}$ on $[${b}, ${c}]$. Find its average value on $[${a}, ${c}]$.`,
        `$f$ 在 $[${a}, ${b}]$ 上的平均值是 $${u}$，在 $[${b}, ${c}]$ 上的平均值是 $${v}$。求它在 $[${a}, ${c}]$ 上的平均值。`,
      ),
      answer,
      mistakes: [
        {
          value: Q.of(u + v, 2),
          why: t(
            `This is the plain average of $${u}$ and $${v}$; the intervals have lengths $${b - a}$ and $${c - b}$, so each value must be weighted by its length.`,
            `这是 $${u}$ 与 $${v}$ 的简单平均；两段长度分别为 $${b - a}$ 和 $${c - b}$，每个值要按长度加权。`,
          ),
        },
        {
          value: Q.of(total),
          why: t(
            `This is the integral over $[${a}, ${c}]$; divide it by the length $${c - a}$.`,
            `这是 $[${a}, ${c}]$ 上的积分；还要除以长度 $${c - a}$。`,
          ),
        },
        {
          value: Q.of(u * (c - b) + v * (b - a), c - a),
          why: t(
            "This weights each average by the length of the other interval; each value goes with the length of its own interval.",
            "这里每个平均值乘的是另一段的长度；每个值应乘以它自己那一段的长度。",
          ),
        },
      ],
      solution: walkThrough(
        [
          [
            ["Turn the averages into integrals", "把平均值化为积分"],
            ["Each average times the length of its interval is the integral over it:", "每个平均值乘以其区间长度，就是该区间上的积分："],
            [
              `\\int_{${a}}^{${b}} f(x)\\,dx = ${u} \\cdot ${b - a} = ${u * (b - a)}`,
              `\\int_{${b}}^{${c}} f(x)\\,dx = ${v} \\cdot ${c - b} = ${v * (c - b)}`,
            ],
          ],
          [
            ["Divide by the whole length", "除以总长度"],
            [`Add the integrals and divide by $${c} - ${a} = ${c - a}$:`, `把积分相加，再除以 $${c} - ${a} = ${c - a}$：`],
            [`\\frac{${u * (b - a)} + ${inParens(v * (c - b))}}{${c - a}} = ${answer.toLatex()}`],
          ],
        ],
        [
          `Weight each average by the share of the length it covers: $${Q.of(b - a, c - a).toLatex()} \\cdot ${inParens(u)} + ${Q.of(c - b, c - a).toLatex()} \\cdot ${inParens(v)} = ${answer.toLatex()}$, which lies between $${u}$ and $${v}$.`,
          `按每段所占长度的比例加权：$${Q.of(b - a, c - a).toLatex()} \\cdot ${inParens(u)} + ${Q.of(c - b, c - a).toLatex()} \\cdot ${inParens(v)} = ${answer.toLatex()}$，它介于 $${u}$ 与 $${v}$ 之间。`,
        ],
      ),
    });
  },
};

const slopeFromEnclosedArea: KnowledgePointDef = {
  id: "the-slope-of-a-line-from-an-enclosed-area",
  title: t("The slope of a line from an enclosed area", "由围成的面积求直线斜率"),
  explanation: t(
    "A parameter in a curve moves the points of intersection, and therefore the limits of integration. Find the limits in terms of the parameter, integrate the difference of the curves, and set the result equal to the given area. This produces an equation for the parameter. For example, $y = mx$ and $y = x^2$ meet at $x = 0$ and $x = m$, and $\\int_0^m (mx - x^2)\\,dx = \\frac{m^3}{2} - \\frac{m^3}{3} = \\frac{m^3}{6}$. If the area is $36$, then $m^3 = 216$ and $m = 6$.\n\nCheck: with $m = 6$ the region has width $6$ and greatest gap $18 - 9 = 9$ at $x = 3$; a region between a parabola and a chord fills $\\frac{2}{3}$ of that rectangle, and $\\frac{2}{3} \\cdot 6 \\cdot 9 = 36$.\n\n> **Watch out.** The upper limit depends on $m$, so the area is a cubic in $m$: solve with a cube root, not by dividing.",
    "曲线中的参数会改变交点，也就改变积分限。先用参数表示积分限，再对两条曲线之差积分，令结果等于给定的面积，就得到参数的方程。例如，$y = mx$ 与 $y = x^2$ 交于 $x = 0$ 和 $x = m$，$\\int_0^m (mx - x^2)\\,dx = \\frac{m^3}{2} - \\frac{m^3}{3} = \\frac{m^3}{6}$。若面积为 $36$，则 $m^3 = 216$，$m = 6$。\n\n检验：$m = 6$ 时区域宽 $6$，最大间距在 $x = 3$ 处，为 $18 - 9 = 9$；抛物线与弦之间的区域占外接矩形的 $\\frac{2}{3}$，而 $\\frac{2}{3} \\cdot 6 \\cdot 9 = 36$。\n\n> **注意。** 上限依赖于 $m$，所以面积是 $m$ 的三次式：要开立方，而不是做除法。",
  ),
  generate(rng) {
    const a = rng.int(1, 3);
    const m = rng.int(1, 9);
    const area = Q.of(m * m * m, 6 * a * a);
    const curve = poly([a, "x^2"]);
    const meet = a === 1 ? "m" : `\\frac{m}{${a}}`;
    const [width, gap] = [Q.of(m, a), Q.of(m * m, 4 * a)];
    return numberProblem({
      prompt: t(
        `The line $y = mx$, with $m > 0$, and the parabola $y = ${curve}$ enclose an area of $${area.toLatex()}$. Find $m$.`,
        `直线 $y = mx$（$m > 0$）与抛物线 $y = ${curve}$ 围成的面积是 $${area.toLatex()}$。求 $m$。`,
      ),
      answer: m,
      solveFor: "m",
      mistakes: [
        {
          value: Q.of(m ** 3),
          why: t(`This is $m^3$; take its cube root to find $m$.`, `这是 $m^3$；还要开立方才得到 $m$。`),
        },
        {
          value: Q.of(-m),
          why: t(
            "This integrates the parabola minus the line, which comes out negative and gives a negative $m$; the line is on top between the crossings, and $m > 0$.",
            "这是对抛物线减直线积分，结果为负，得到负的 $m$；在两交点之间直线在上方，且 $m > 0$。",
          ),
        },
        {
          value: Q.of(m, a),
          why: t(
            `This is the $x$-coordinate of the second crossing, $${meet}$, not the slope $m$.`,
            `这是第二个交点的横坐标 $${meet}$，不是斜率 $m$。`,
          ),
        },
      ],
      solution: walkThrough(
        [
          [
            ["Find the crossings in terms of m", "用 m 表示交点"],
            ["Set the line equal to the parabola:", "令直线与抛物线相等："],
            [`mx = ${curve} \\implies x = 0 \\text{ or } x = ${meet}`],
          ],
          [
            ["Integrate the difference", "对差积分"],
            ["The line is on top between the crossings:", "在两交点之间直线在上方："],
            [
              `\\int_0^{${meet}} (mx - ${curve})\\,dx = \\Big[\\frac{m}{2}x^2 - ${coefQ(Q.of(a, 3))}x^3\\Big]_0^{${meet}} = \\frac{m^3}{${6 * a * a}}`,
            ],
          ],
          [
            ["Solve for m", "解出 m"],
            ["Set this equal to the area:", "令它等于面积："],
            [`\\frac{m^3}{${6 * a * a}} = ${area.toLatex()} \\implies m^3 = ${m ** 3} \\implies m = ${m}`],
          ],
        ],
        [
          `With $m = ${m}$ the region has width $${width.toLatex()}$ and its greatest gap, at the middle, is $${gap.toLatex()}$. A region between a parabola and a chord fills $\\frac{2}{3}$ of that rectangle: $\\frac{2}{3} \\cdot ${width.toLatex()} \\cdot ${gap.toLatex()} = ${area.toLatex()}$, the given area.`,
          `$m = ${m}$ 时区域宽 $${width.toLatex()}$，最大间距在中点处，为 $${gap.toLatex()}$。抛物线与弦之间的区域占外接矩形的 $\\frac{2}{3}$：$\\frac{2}{3} \\cdot ${width.toLatex()} \\cdot ${gap.toLatex()} = ${area.toLatex()}$，正是给定的面积。`,
        ],
      ),
    });
  },
};

const limitFromVolume: KnowledgePointDef = {
  id: "an-unknown-limit-from-a-volume-of-revolution",
  title: t("An unknown limit from a volume of revolution", "由旋转体体积求未知积分限"),
  explanation: t(
    "The disc method gives a volume as a function of a limit of integration. When the volume is known, set up the same integral with the limit as a letter, evaluate it, and solve the resulting equation. The factor $\\pi$ appears on both sides and cancels. For the region under $y = \\sqrt{x}$ from $x = 0$ to $x = k$,\n\n$$V(k) = \\pi\\int_{0}^{k} x \\, dx = \\frac{k^{2}}{2}\\pi$$\n\nIf the volume is $8\\pi$, then $k^{2} = 16$ and $k = 4$.\n\nCheck: with $k = 4$ the solid is a paraboloid of radius $2$ and length $4$, half of the cylinder $\\pi \\cdot 2^{2} \\cdot 4 = 16\\pi$, which is $8\\pi$.\n\n> **Watch out.** The equation gives $k^{2}$ first. Take the square root, and keep the positive one, since $k > 0$.",
    "圆盘法把体积表示成积分限的函数。已知体积时，用字母表示积分限，列出同样的积分并求值，再解所得的方程。两边都有因子 $\\pi$，可以约去。对 $y = \\sqrt{x}$ 下方从 $x = 0$ 到 $x = k$ 的区域，\n\n$$V(k) = \\pi\\int_{0}^{k} x \\, dx = \\frac{k^{2}}{2}\\pi$$\n\n若体积为 $8\\pi$，则 $k^{2} = 16$，$k = 4$。\n\n检验：$k = 4$ 时这个立体是半径为 $2$、长为 $4$ 的旋转抛物体，是圆柱 $\\pi \\cdot 2^{2} \\cdot 4 = 16\\pi$ 的一半，即 $8\\pi$。\n\n> **注意。** 方程先给出 $k^{2}$。还要开平方，并取正的那个，因为 $k > 0$。",
  ),
  generate(rng) {
    const c = rng.int(1, 4);
    const k = rng.int(1, 12);
    const V = Q.of(c * c * k * k, 2);
    const curve = `${c === 1 ? "" : c}\\sqrt{x}`;
    const half = Q.of(c * c, 2);
    const cylinder = Q.of(c * c * k * k);
    return numberProblem({
      prompt: t(
        `The region under $y = ${curve}$ from $x = 0$ to $x = k$, with $k > 0$, is rotated about the $x$-axis. The volume is $${piTimes(V)}$. Find $k$.`,
        `$y = ${curve}$ 下方从 $x = 0$ 到 $x = k$（$k > 0$）的区域绕 $x$ 轴旋转，体积是 $${piTimes(V)}$。求 $k$。`,
      ),
      answer: k,
      solveFor: "k",
      mistakes: [
        {
          value: Q.of(k * k),
          why: t("This is $k^{2}$; take its square root to find $k$.", "这是 $k^{2}$；还要开平方才得到 $k$。"),
        },
      ],
      solution: walkThrough(
        [
          [
            ["Write the volume in terms of k", "用 k 表示体积"],
            [
              `A disc at $x$ has radius $${curve}$, so its area is $\\pi\\left(${curve}\\right)^{2} = ${c * c === 1 ? "" : c * c}\\pi x$. Add up the discs from $0$ to $k$:`,
              `$x$ 处的圆盘半径为 $${curve}$，面积是 $\\pi\\left(${curve}\\right)^{2} = ${c * c === 1 ? "" : c * c}\\pi x$。把从 $0$ 到 $k$ 的圆盘加起来：`,
            ],
            [`V = \\pi\\int_{0}^{k} ${c * c === 1 ? "" : c * c}x \\, dx = ${coefQ(half)}k^{2}\\pi`],
          ],
          [
            ["Solve for k", "解出 k"],
            ["Set this equal to the given volume and cancel $\\pi$:", "令它等于给定的体积，约去 $\\pi$："],
            [`${coefQ(half)}k^{2} = ${V.toLatex()}`, `k^{2} = ${k * k}`, `k = ${k}`],
          ],
        ],
        [
          `With $k = ${k}$ the solid is a paraboloid whose radius squared at the end is $${c * c * k}$ and whose length is $${k}$. It fills half of the cylinder around it, whose volume is $${piTimes(cylinder)}$, and half of that is $${piTimes(V)}$, the given volume.`,
          `$k = ${k}$ 时这个立体是旋转抛物体，端面半径的平方为 $${c * c * k}$，长为 $${k}$。它占外接圆柱的一半，圆柱体积为 $${piTimes(cylinder)}$，一半是 $${piTimes(V)}$，正是给定的体积。`,
        ],
      ),
    });
  },
};

const shellsAboutAnotherLine: KnowledgePointDef = {
  id: "shells-about-a-line-other-than-the-y-axis",
  figure: calculusDrawings4["the-shell-method-rotation-about-the-y-axis#shells-about-a-line-other-than-the-y-axis"],
  title: t("Shells about a line other than the $y$-axis", "绕 $y$ 轴以外的直线的柱壳"),
  explanation: t(
    "The radius of a shell is the distance from the axis of rotation, which is not always $x$. For rotation about the line $x = -h$ of a region to its right, the radius is $x + h$, while the height of the shell stays the same:\n\n$$V = 2\\pi\\int_{a}^{b} (x + h)f(x) \\, dx$$\n\nFor example, the region under $y = x^{2}$ from $x = 0$ to $x = 1$ rotated about $x = -1$ has\n\n$$V = 2\\pi\\int_{0}^{1} (x^{3} + x^{2}) \\, dx = 2\\pi\\left(\\frac{1}{4} + \\frac{1}{3}\\right) = \\frac{7}{6}\\pi$$\n\nCheck: with washers, a slice at height $y$ runs from $x = \\sqrt{y}$ to $x = 1$, so its radii are $2$ and $1 + \\sqrt{y}$, and\n\n$$\\pi\\int_{0}^{1} \\left(3 - 2\\sqrt{y} - y\\right) dy = \\pi\\left(3 - \\frac{4}{3} - \\frac{1}{2}\\right) = \\frac{7}{6}\\pi$$\n\n> **Watch out.** Do not keep the radius $x$. That rotates about the $y$-axis and gives $\\frac{1}{2}\\pi$ here, which is too small.",
    "柱壳的半径是到旋转轴的距离，不一定是 $x$。区域在直线 $x = -h$ 右侧并绕它旋转时，半径是 $x + h$，柱壳的高不变：\n\n$$V = 2\\pi\\int_{a}^{b} (x + h)f(x) \\, dx$$\n\n例如，$y = x^{2}$ 下方从 $x = 0$ 到 $x = 1$ 的区域绕 $x = -1$ 旋转，\n\n$$V = 2\\pi\\int_{0}^{1} (x^{3} + x^{2}) \\, dx = 2\\pi\\left(\\frac{1}{4} + \\frac{1}{3}\\right) = \\frac{7}{6}\\pi$$\n\n检验：用垫圈法，高度 $y$ 处的切片从 $x = \\sqrt{y}$ 到 $x = 1$，两个半径是 $2$ 和 $1 + \\sqrt{y}$，\n\n$$\\pi\\int_{0}^{1} \\left(3 - 2\\sqrt{y} - y\\right) dy = \\pi\\left(3 - \\frac{4}{3} - \\frac{1}{2}\\right) = \\frac{7}{6}\\pi$$\n\n> **注意。** 不要沿用半径 $x$。那是绕 $y$ 轴旋转，这里得 $\\frac{1}{2}\\pi$，偏小。",
  ),
  generate(rng) {
    const b = rng.int(1, 6);
    const h = rng.int(1, 9);
    const base = Q.of(b ** 4, 2);
    const extra = Q.of(2 * h * b ** 3, 3);
    const answer = base.add(extra);
    const hx = `${h === 1 ? "" : h}x^{2}`;
    const twoH = h === 1 ? "2\\pi" : `2\\pi \\cdot ${h}`;
    return numberProblem({
      prompt: t(
        `The region under $y = x^2$ from $x = 0$ to $x = ${b}$ is rotated about the line $x = -${h}$. The volume is $c\\pi$. Find $c$.`,
        `$y = x^2$ 下方从 $x = 0$ 到 $x = ${b}$ 的区域绕直线 $x = -${h}$ 旋转，体积是 $c\\pi$。求 $c$。`,
      ),
      answer,
      mistakes: [
        {
          value: base,
          why: t(
            `This uses the radius $x$, which is the distance to the $y$-axis. The axis is $x = -${h}$, so the radius is $x + ${h}$.`,
            `这里用的半径是 $x$，那是到 $y$ 轴的距离。旋转轴是 $x = -${h}$，半径应是 $x + ${h}$。`,
          ),
        },
        {
          value: base.sub(extra),
          why: t(
            `This uses the radius $x - ${h}$, as if the axis were $x = ${h}$. The region lies to the right of $x = -${h}$, so the radius is $x + ${h}$.`,
            `这里用的半径是 $x - ${h}$，好像旋转轴是 $x = ${h}$。区域在 $x = -${h}$ 右侧，半径应是 $x + ${h}$。`,
          ),
        },
        {
          value: answer.div(Q.of(2)),
          why: t(
            "This is half the volume. A shell of radius $r$ and height $f(x)$ has area $2\\pi r f(x)$, so the factor is $2\\pi$, not $\\pi$.",
            "这是体积的一半。半径 $r$、高 $f(x)$ 的柱壳面积是 $2\\pi r f(x)$，因子是 $2\\pi$，不是 $\\pi$。",
          ),
        },
        {
          value: base.add(Q.of(h * b ** 3, 3)),
          why: t(
            "Here only the first part was doubled. The factor $2\\pi$ multiplies the whole integral, the shift as well.",
            "这里只把第一部分乘了 $2$。因子 $2\\pi$ 乘的是整个积分，平移的那部分也要乘。",
          ),
        },
      ].filter((m, i, all) => all.findIndex((n) => n.value.eq(m.value)) === i),
      solution: walkThrough(
        [
          [
            ["Find the radius and the height", "求半径和高"],
            [
              `A shell at $x$ is at distance $x + ${h}$ from the line $x = -${h}$, and its height is $x^{2}$:`,
              `$x$ 处的柱壳到直线 $x = -${h}$ 的距离是 $x + ${h}$，高是 $x^{2}$：`,
            ],
            [`V = 2\\pi\\int_{0}^{${b}} (x + ${h})x^{2} \\, dx = 2\\pi\\int_{0}^{${b}} \\left(x^{3} + ${hx}\\right) dx`],
          ],
          [
            ["Integrate", "积分"],
            ["Evaluate the antiderivative at the limits:", "把原函数代入上下限："],
            [
              `V = 2\\pi\\left[\\frac{x^{4}}{4} + ${h === 3 ? "" : Q.of(h, 3).toLatex()}x^{3}\\right]_{0}^{${b}} = 2\\pi\\left(${Q.of(b ** 4, 4).toLatex()} + ${Q.of(h * b ** 3, 3).toLatex()}\\right) = ${piTimes(answer)}`,
            ],
          ],
        ],
        [
          `Split the radius into $x$ and $${h}$. The radius $x$ alone gives the solid about the $y$-axis, $2\\pi\\int_{0}^{${b}} x^{3} \\, dx = ${piTimes(base)}$. The extra $${h}$ adds $${twoH}\\int_{0}^{${b}} x^{2} \\, dx = ${piTimes(extra)}$. Together they give $${piTimes(answer)}$, so $c = ${answer.toLatex()}$.`,
          `把半径拆成 $x$ 和 $${h}$。只用半径 $x$ 得到绕 $y$ 轴的立体，$2\\pi\\int_{0}^{${b}} x^{3} \\, dx = ${piTimes(base)}$。多出的 $${h}$ 加上 $${twoH}\\int_{0}^{${b}} x^{2} \\, dx = ${piTimes(extra)}$。合起来是 $${piTimes(answer)}$，所以 $c = ${answer.toLatex()}$。`,
        ],
      ),
    });
  },
};

/** motionSlips keeps each wrong value of a motion problem once, with its first reason, and drops any that equals the answer. */
const motionSlips = (answer: Q, list: readonly (readonly [Q, string, string])[]) =>
  list.filter(([v], i) => !v.eq(answer) && list.findIndex(([w]) => w.eq(v)) === i).map(([value, en, zh]) => ({ value, why: t(en, zh) }));

const averageSpeed: KnowledgePointDef = {
  id: "average-speed-when-the-direction-changes",
  title: t("Average speed when the direction changes", "方向改变时的平均速率"),
  explanation: t(
    "Average velocity is displacement divided by time, while average speed is total distance divided by time. They differ when an object turns around, because backward motion cancels in displacement and adds in distance. To find the distance, integrate the absolute value of the velocity, splitting at the turning point. For example, $v(t) = t - 2$ on $[0, 4]$ turns at $t = 2$; it covers $2$ m each way, so the distance is $4$ m and the average speed is $\\frac{4}{4} = 1$ m/s, while the average velocity is $0$.\n\nCheck: the graph of $|v|$ is two triangles, each of area $\\frac{1}{2} \\cdot 2 \\cdot 2 = 2$.\n\n> **Watch out.** Average speed is not the size of the average velocity: here that is $0$, because the two legs cancel.",
    "平均速度是位移除以时间，平均速率是总路程除以时间。物体掉头时二者不同，因为反向运动在位移中抵消，在路程中却累加。要求路程，就对速度的绝对值积分，并在掉头的时刻分段。例如 $[0, 4]$ 上的 $v(t) = t - 2$ 在 $t = 2$ 时掉头；往返各走 $2$ 米，路程是 $4$ 米，平均速率是 $\\frac{4}{4} = 1$ 米/秒，而平均速度是 $0$。\n\n检验：$|v|$ 的图像是两个三角形，面积都是 $\\frac{1}{2} \\cdot 2 \\cdot 2 = 2$。\n\n> **注意。** 平均速率不是平均速度的大小：这里平均速度是 $0$，因为两段相互抵消。",
  ),
  generate(rng) {
    const p = rng.int(1, 5);
    const T = p + rng.int(1, 5);
    const a = rng.int(1, 4);
    const [before, after] = [Q.of(a * p * p, 2), Q.of(a * (T - p) ** 2, 2)];
    const distance = before.add(after);
    const answer = distance.div(Q.of(T));
    const displacement = Q.of(a * (T * T - 2 * p * T), 2);
    const velocity = displacement.div(Q.of(T));
    const v = poly([a, "t"], [-a * p, ""]);
    return numberProblem({
      prompt: t(
        `A particle has velocity $v(t) = ${v}$ m/s. Find its average speed from $t = 0$ to $t = ${T}$, in m/s.`,
        `质点的速度是 $v(t) = ${v}$ 米/秒。求它从 $t = 0$ 到 $t = ${T}$ 的平均速率（米/秒）。`,
      ),
      answer,
      mistakes: motionSlips(answer, [
        [
          velocity,
          "This is the average velocity, the displacement over the time; the leg walked back cancels in it. Average speed uses the distance.",
          "这是平均速度，即位移除以时间；走回头路的那段在其中抵消了。平均速率要用路程。",
        ],
        [distance, `This is the total distance; divide it by the time, $${T}$ s.`, `这是总路程；还要除以时间 $${T}$ 秒。`],
        [
          Q.of(a * (T - p)),
          `This is the speed at the end, $|v(${T})|$; the average speed is the distance over the time.`,
          `这是终点时的速率 $|v(${T})|$；平均速率是路程除以时间。`,
        ],
      ]),
      solution: walkThrough(
        [
          [["Find the turn", "找出掉头的时刻"], ["The velocity is zero at", "速度为零的时刻是"], [`${v} = 0 \\implies t = ${p}`]],
          [
            ["Add the two legs", "把两段相加"],
            [
              `With the antiderivative $S(t) = \\frac{${a}}{2}t^2 - ${a * p}t$, integrate $|v|$ on each side of $t = ${p}$:`,
              `用原函数 $S(t) = \\frac{${a}}{2}t^2 - ${a * p}t$，在 $t = ${p}$ 两侧分别对 $|v|$ 积分：`,
            ],
            [`|S(${p}) - S(0)| + |S(${T}) - S(${p})| = ${before.toLatex()} + ${after.toLatex()} = ${distance.toLatex()}`],
          ],
          [
            ["Divide by the time", "除以时间"],
            [`The trip lasts $${T}$ s:`, `全程用时 $${T}$ 秒：`],
            [`${distance.isInteger() ? `\\frac{${distance.toLatex()}}{${T}}` : `${distance.toLatex()} \\div ${T}`} = ${answer.toLatex()}`],
          ],
        ],
        [
          `The graph of $|v|$ is two triangles with apex heights $|v(0)| = ${a * p}$ and $|v(${T})| = ${a * (T - p)}$: $\\frac{1}{2} \\cdot ${p} \\cdot ${a * p} + \\frac{1}{2} \\cdot ${T - p} \\cdot ${a * (T - p)} = ${distance.toLatex()}$. Dividing by $${T}$ gives $${answer.toLatex()}$.`,
          `$|v|$ 的图像是两个三角形，高分别为 $|v(0)| = ${a * p}$ 和 $|v(${T})| = ${a * (T - p)}$：$\\frac{1}{2} \\cdot ${p} \\cdot ${a * p} + \\frac{1}{2} \\cdot ${T - p} \\cdot ${a * (T - p)} = ${distance.toLatex()}$。除以 $${T}$ 得 $${answer.toLatex()}$。`,
        ],
      ),
    });
  },
};

const returnTime: KnowledgePointDef = {
  id: "when-a-particle-returns-to-its-start",
  title: t("When a particle returns to its start", "质点何时回到起点"),
  explanation: t(
    "A particle is back at its starting point when its displacement since the start is zero, not when its velocity is zero. Zero velocity marks only the turning point. So integrate the velocity from $0$ to $T$, set the result to zero, and solve for the positive $T$. For example, $v(t) = 6 - 2t$ gives displacement $6T - T^2 = T(6 - T)$, which is zero again at $T = 6$.\n\nCheck: the particle turns at $t = 3$, and the triangles between the velocity graph and the axis on $[0, 3]$ and $[3, 6]$ both have area $9$, so they cancel.\n\n> **Watch out.** $v(t) = 0$ at $t = 3$ is where the particle turns, not where it is back; it is then $9$ m from the start.",
    "质点回到起点的条件是从起点算起的位移为零，而不是速度为零。速度为零只说明它在掉头。所以把速度从 $0$ 积分到 $T$，令结果为零，再解出正的 $T$。例如 $v(t) = 6 - 2t$ 的位移是 $6T - T^2 = T(6 - T)$，它在 $T = 6$ 时再次为零。\n\n检验：质点在 $t = 3$ 时掉头，速度图像与横轴在 $[0, 3]$ 和 $[3, 6]$ 上围成的三角形面积都是 $9$，正好抵消。\n\n> **注意。** $t = 3$ 时 $v(t) = 0$，那是质点掉头的时刻，不是回到起点的时刻；此时它离起点 $9$ 米。",
  ),
  generate(rng) {
    const a = rng.int(1, 20);
    const b = rng.int(1, 6);
    const answer = Q.of(2 * a, b);
    const turn = Q.of(a, b);
    const v = poly([a, ""], [-b, "t"]);
    const peak = Q.of(a * a, 2 * b);
    const half = coefQ(Q.of(b, 2));
    return numberProblem({
      prompt: t(
        `A particle has velocity $v(t) = ${v}$ m/s. At what time $t > 0$, in seconds, is it back at its position at $t = 0$?`,
        `质点的速度是 $v(t) = ${v}$ 米/秒。在什么时刻 $t > 0$（秒）它回到 $t = 0$ 时的位置？`,
      ),
      answer,
      mistakes: motionSlips(answer, [
        [
          turn,
          `This is where $v(t) = 0$, the turning point; there the particle is $${peak.toLatex()}$ m from the start.`,
          `这是 $v(t) = 0$ 的时刻，即掉头的时刻；此时质点离起点 $${peak.toLatex()}$ 米。`,
        ],
        [
          Q.of(a, 2 * b),
          `This halves the turning time; the trip back takes as long as the trip out, so double it.`,
          `这里把掉头时刻减半了；返程与去程用时相同，应当加倍。`,
        ],
        [
          Q.of(b, a),
          `This turns the fraction upside down; $${a}T - ${half}T^2 = 0$ gives $T = \\frac{2 \\cdot ${a}}{${b}}$.`,
          `这里把分数颠倒了；由 $${a}T - ${half}T^2 = 0$ 得 $T = \\frac{2 \\cdot ${a}}{${b}}$。`,
        ],
      ]),
      solution: walkThrough(
        [
          [
            ["Find the displacement", "求位移"],
            ["Integrate the velocity from $0$ to $T$:", "把速度从 $0$ 积分到 $T$："],
            [`\\int_0^T (${v})\\,dt = ${poly([a, "T"])} - ${half}T^2 = T\\left(${a} - ${half}T\\right)`],
          ],
          [
            ["Set it to zero", "令它为零"],
            ["Leave out $T = 0$, the start:", "舍去起点 $T = 0$："],
            [`${a} - ${half}T = 0 \\implies T = ${answer.toLatex()}`],
          ],
        ],
        [
          `The velocity is a line through zero at $t = ${turn.toLatex()}$, so the triangle above the axis on $[0, ${turn.toLatex()}]$ and the one below it on $[${turn.toLatex()}, ${answer.toLatex()}]$ are mirror images, each of area $${peak.toLatex()}$. They cancel, and $${answer.toLatex()}$ is twice the turning time.`,
          `速度图像是一条直线，在 $t = ${turn.toLatex()}$ 处为零，所以 $[0, ${turn.toLatex()}]$ 上横轴上方的三角形和 $[${turn.toLatex()}, ${answer.toLatex()}]$ 上横轴下方的三角形互为镜像，面积都是 $${peak.toLatex()}$。二者抵消，而 $${answer.toLatex()}$ 正是掉头时刻的两倍。`,
        ],
      ),
    });
  },
};

const selfCrossing: KnowledgePointDef = {
  id: "tangents-where-a-parametric-curve-crosses-itself",
  title: t("Tangents where a parametric curve crosses itself", "参数曲线自交处的切线"),
  explanation: t(
    "A parametric curve can pass through the same point at two values of the parameter. Find these by solving $x(t) = x_0$ and $y(t) = y_0$ together. Each value gives its own $\\frac{dy}{dx}$, so a self-crossing has two tangent lines rather than one.",
    "参数曲线可以在两个参数值处经过同一点。联立 $x(t) = x_0$ 和 $y(t) = y_0$ 就能找到它们。每个参数值都有自己的 $\\frac{dy}{dx}$，所以自交点处有两条切线，而不是一条。",
  ),
  generate(rng) {
    const a = rng.int(1, 6);
    const m = rng.int(1, 6);
    const answer = a * m;
    const x = poly([1, "t^2"], [-a * a, ""]);
    const y = poly([m, "t^3"], [-m * a * a, "t"]);
    return numberProblem({
      prompt: t(
        `The curve $x = ${x}$, $y = ${y}$ passes through the origin twice. Find the positive slope among its two tangent lines there.`,
        `曲线 $x = ${x}$，$y = ${y}$ 两次经过原点。求那里两条切线中为正的斜率。`,
      ),
      answer,
      form: "integer",
      wrong: [2 * answer, a, m],
      solution: t(
        `Both coordinates vanish at $t = \\pm ${a}$. The slope is $\\frac{dy}{dx} = \\frac{${poly([3 * m, "t^2"], [-m * a * a, ""])}}{2t}$, which equals $\\pm ${answer}$ at these values. The positive slope is $${answer}$.`,
        `两个坐标都在 $t = \\pm ${a}$ 时为零。斜率 $\\frac{dy}{dx} = \\frac{${poly([3 * m, "t^2"], [-m * a * a, ""])}}{2t}$，在这两个值处等于 $\\pm ${answer}$。为正的斜率是 $${answer}$。`,
      ),
    });
  },
};

const smallestSpeed: KnowledgePointDef = {
  id: "the-smallest-speed-in-the-plane",
  title: t("The smallest speed in the plane", "平面运动的最小速率"),
  explanation: t(
    "Speed is the length of the velocity vector, and it contains a square root. Its smallest value occurs at the same time as the smallest value of its square, which is usually a polynomial. So minimize the squared speed by differentiating, and take the root only if the speed itself is needed.",
    "速率是速度向量的长度，含有平方根。它与自身的平方在同一时刻取最小值，而平方通常是多项式。所以通过求导使速率的平方最小，只有需要速率本身时才开方。",
  ),
  generate(rng) {
    const p = rng.int(1, 9);
    const q = different(rng, 1, 9, p);
    const answer = 2 * (p - q) ** 2;
    const middle = Q.of(p + q, 2);
    return numberProblem({
      prompt: t(
        `A particle moves with $x(t) = ${poly([1, "t^2"], [-2 * p, "t"])}$ and $y(t) = ${poly([1, "t^2"], [-2 * q, "t"])}$. Find the smallest value of the square of its speed.`,
        `质点的运动满足 $x(t) = ${poly([1, "t^2"], [-2 * p, "t"])}$，$y(t) = ${poly([1, "t^2"], [-2 * q, "t"])}$。求其速率平方的最小值。`,
      ),
      answer,
      form: "integer",
      wrong: [(p - q) ** 2, 4 * (p - q) ** 2, Math.abs(p - q)],
      solution: t(
        `The squared speed is $4(t - ${p})^2 + 4(t - ${q})^2$, which is smallest at $t = ${middle.toLatex()}$, midway between $${p}$ and $${q}$. There each square is $\\frac{(${p} - ${q})^2}{4}$, so the value is $2(${p} - ${q})^2 = ${answer}$.`,
        `速率的平方是 $4(t - ${p})^2 + 4(t - ${q})^2$，在 $${p}$ 与 $${q}$ 正中间的 $t = ${middle.toLatex()}$ 处最小。此时每个平方都是 $\\frac{(${p} - ${q})^2}{4}$，所以最小值是 $2(${p} - ${q})^2 = ${answer}$。`,
      ),
    });
  },
};

const rangeOfAProjectile: KnowledgePointDef = {
  id: "the-range-of-a-projectile",
  title: t("The range of a projectile", "抛射体的射程"),
  explanation: t(
    "Integrating the acceleration twice gives each component of the position. The two components share only the time. So find the landing time from the vertical component, by setting the height to zero, and substitute it into the horizontal component to get the range.",
    "把加速度积分两次，得到位置的每个分量。两个分量只共用时间。所以先由竖直分量令高度为零求出落地时间，再代入水平分量，得到射程。",
  ),
  generate(rng) {
    const u = rng.int(1, 30);
    const w = rng.int(1, 30);
    const answer = Q.of(u * w, 5);
    const time = Q.of(w, 5);
    return numberProblem({
      prompt: t(
        `A projectile leaves the ground with velocity $\\langle ${u}, ${w} \\rangle$ m/s and has acceleration $\\langle 0, -10 \\rangle$ m/s². How far from its starting point does it land, in metres?`,
        `抛射体以速度 $\\langle ${u}, ${w} \\rangle$ m/s 离开地面，加速度是 $\\langle 0, -10 \\rangle$ m/s²。它落在离起点多远处（米）？`,
      ),
      answer,
      wrong: [Q.of(u * w, 10), time, Q.of(2 * u * w, 5)],
      solution: t(
        `The height is $${w}t - 5t^2$, which is zero again at $t = ${time.toLatex()}$. The horizontal position is $${u}t$, so the range is $${u} \\cdot ${time.toLatex()} = ${answer.toLatex()}$.`,
        `高度是 $${w}t - 5t^2$，在 $t = ${time.toLatex()}$ 时再次为零。水平位置是 $${u}t$，所以射程是 $${u} \\cdot ${time.toLatex()} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const limitOfLinearRecursion: KnowledgePointDef = {
  id: "the-limit-of-a-linear-recursive-sequence",
  title: t("The limit of a linear recursive sequence", "线性递推数列的极限"),
  explanation: t(
    "If a recursive sequence converges to $L$, then both $a_n$ and $a_{n+1}$ tend to $L$, so $L$ must satisfy the recursion with both replaced by $L$. Solving this equation gives the limit. The starting value does not appear in the answer when the multiplier is smaller than $1$ in size.",
    "如果递推数列收敛于 $L$，$a_n$ 和 $a_{n+1}$ 都趋于 $L$，所以把递推式中二者都换成 $L$ 后等式仍成立。解这个方程就得到极限。当乘数的绝对值小于 $1$ 时，答案与初始值无关。",
  ),
  generate(rng) {
    const s = rng.int(2, 6);
    const r = rng.int(1, s - 1);
    const q = nonzero(rng, 9);
    const a1 = rng.int(0, 9);
    const answer = Q.of(q * s, s - r);
    const ratio = Q.of(r, s);
    return numberProblem({
      prompt: t(
        `A sequence has $a_1 = ${a1}$ and $a_{n+1} = ${ratio.toLatex()}a_n ${q < 0 ? "-" : "+"} ${Math.abs(q)}$. Find its limit.`,
        `数列满足 $a_1 = ${a1}$，$a_{n+1} = ${ratio.toLatex()}a_n ${q < 0 ? "-" : "+"} ${Math.abs(q)}$。求它的极限。`,
      ),
      answer,
      wrong: [Q.of(q), Q.of(q * s, r), Q.of(q * s, s + r)],
      solution: t(
        `The limit satisfies $L = ${ratio.toLatex()}L + ${inParens(q)}$, so $${Q.of(s - r, s).toLatex()}L = ${q}$ and $L = ${answer.toLatex()}$. The starting value makes no difference.`,
        `极限满足 $L = ${ratio.toLatex()}L + ${inParens(q)}$，所以 $${Q.of(s - r, s).toLatex()}L = ${q}$，$L = ${answer.toLatex()}$。初始值不影响结果。`,
      ),
    });
  },
};

const limitOfNestedRoot: KnowledgePointDef = {
  id: "the-limit-of-a-monotonic-sequence-of-roots",
  title: t("The limit of a monotonic sequence of roots", "单调根式数列的极限"),
  explanation: t(
    "A bounded monotonic sequence converges, and its limit can then be found from the recursion. Replacing every term by $L$ gives an equation, and squaring removes the root. Squaring may add a false solution, so keep the root that fits: the terms here are positive, and so is their limit.",
    "有界单调数列收敛，于是可以由递推式求极限。把每一项都换成 $L$ 得到方程，平方后根号消失。平方可能引入增根，所以要留下合适的根：这里各项都是正的，极限也是正的。",
  ),
  generate(rng) {
    const c = rng.int(1, 5);
    const m = c + rng.int(1, 6);
    const k = m * m - c * m;
    const other = c - m;
    return numberProblem({
      prompt: t(
        `A sequence has $a_1 = 1$ and $a_{n+1} = \\sqrt{${poly([k, ""], [c, "a_n"])}}$. It is monotonic and bounded. Find its limit.`,
        `数列满足 $a_1 = 1$，$a_{n+1} = \\sqrt{${poly([k, ""], [c, "a_n"])}}$。它单调有界。求它的极限。`,
      ),
      answer: m,
      form: "integer",
      wrong: [other, k, m + 1],
      solution: t(
        `The limit satisfies $L^2 = ${poly([k, ""], [c, "L"])}$, whose roots are $${m}$ and $${other}$. All the terms are positive, so the limit is $${m}$.`,
        `极限满足 $L^2 = ${poly([k, ""], [c, "L"])}$，两根是 $${m}$ 和 $${other}$。各项都是正的，所以极限是 $${m}$。`,
      ),
    });
  },
};

const telescopingFromLaterIndex: KnowledgePointDef = {
  id: "a-telescoping-series-from-a-later-index",
  title: t("A telescoping series from a later index", "从较后一项开始的裂项级数"),
  explanation: t(
    "The sum of a telescoping series is what survives at the start. Since $\\frac{1}{n(n+1)} = \\frac{1}{n} - \\frac{1}{n+1}$, a series starting at $n = m$ leaves only the piece $\\frac{1}{m}$. The starting index therefore decides the sum, and the sum need not be the value for $n = 1$.",
    "裂项级数的和就是开头留下的部分。由于 $\\frac{1}{n(n+1)} = \\frac{1}{n} - \\frac{1}{n+1}$，从 $n = m$ 开始的级数只留下 $\\frac{1}{m}$。所以起始下标决定了和，不一定等于从 $n = 1$ 开始的值。",
  ),
  generate(rng) {
    const m = rng.int(2, 9);
    const c = rng.int(1, 9);
    const answer = Q.of(c, m);
    return numberProblem({
      prompt: t(`Find $\\sum_{n=${m}}^{\\infty} \\frac{${c}}{n(n+1)}$.`, `求 $\\sum_{n=${m}}^{\\infty} \\frac{${c}}{n(n+1)}$。`),
      answer,
      wrong: [Q.of(c), Q.of(c, m + 1), Q.of(1, m)],
      solution: t(
        `Each term is $${c}\\left(\\frac{1}{n} - \\frac{1}{n+1}\\right)$. All pieces cancel except the first, $\\frac{${c}}{${m}}$, so the sum is $${answer.toLatex()}$.`,
        `每一项是 $${c}\\left(\\frac{1}{n} - \\frac{1}{n+1}\\right)$。除第一部分 $\\frac{${c}}{${m}}$ 外全部抵消，所以和是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const productOfSeries: KnowledgePointDef = {
  id: "a-coefficient-from-a-product-of-series",
  title: t("A coefficient from a product of series", "级数之积的系数"),
  explanation: t(
    "Power series multiply like long polynomials. To find one coefficient of a product, there is no need for the whole product: collect the pairs of terms whose powers add up to the wanted power. This is usually far quicker than differentiating the product repeatedly.",
    "幂级数可以像很长的多项式一样相乘。要求乘积的一个系数，不必算出整个乘积，只要收集幂次之和等于所求幂次的各对项。这通常比反复对乘积求导快得多。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const b = nonzero(rng, 4);
    const half = Q.of(a * a, 2);
    const answer = half.add(Q.of(a * b + b * b));
    const exponent = poly([a, "x"]);
    return numberProblem({
      prompt: t(
        `Find the coefficient of $x^2$ in the Maclaurin series of $\\frac{e^{${exponent}}}{${poly([1, ""], [-b, "x"])}}$.`,
        `求 $\\frac{e^{${exponent}}}{${poly([1, ""], [-b, "x"])}}$ 的麦克劳林级数中 $x^2$ 的系数。`,
      ),
      answer,
      wrong: [half.add(Q.of(b * b)), Q.of(a * a + a * b + b * b), Q.of(a * b)],
      solution: t(
        `The series are $1 + ${a}x + ${half.toLatex()}x^2 + \\cdots$ and $1 + ${inParens(b)}x + ${b * b}x^2 + \\cdots$. The $x^2$ terms come from three pairs: $${b * b} + ${inParens(a * b)} + ${half.toLatex()} = ${answer.toLatex()}$.`,
        `两个级数是 $1 + ${a}x + ${half.toLatex()}x^2 + \\cdots$ 和 $1 + ${inParens(b)}x + ${b * b}x^2 + \\cdots$。$x^2$ 项来自三对：$${b * b} + ${inParens(a * b)} + ${half.toLatex()} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const limitFromExponentialSeries: KnowledgePointDef = {
  id: "a-limit-from-the-exponential-series",
  title: t("A limit from the exponential series", "由指数级数求极限"),
  explanation: t(
    "A series can replace repeated use of L'Hopital's rule. Write the function by its series around the limit point, and cancel what the numerator subtracts. The first term that survives decides the limit, since every later term has a higher power of $x$ and vanishes after dividing.",
    "级数可以代替反复使用洛必达法则。把函数在极限点附近写成级数，消去分子减掉的部分。留下的第一项决定极限，因为后面的项 $x$ 的幂次更高，相除后都趋于零。",
  ),
  generate(rng) {
    const a = nonzero(rng, 9);
    const b = rng.int(1, 6);
    const answer = Q.of(a * a, 2 * b);
    return numberProblem({
      prompt: t(
        `Find $\\lim_{x \\to 0} \\frac{e^{${poly([a, "x"])}} - 1 ${a < 0 ? "+" : "-"} ${poly([Math.abs(a), "x"])}}{${poly([b, "x^2"])}}$.`,
        `求 $\\lim_{x \\to 0} \\frac{e^{${poly([a, "x"])}} - 1 ${a < 0 ? "+" : "-"} ${poly([Math.abs(a), "x"])}}{${poly([b, "x^2"])}}$。`,
      ),
      answer,
      wrong: [Q.of(a * a, b), Q.of(a, 2 * b), Q.of(0)],
      solution: t(
        `The series begins $1 + ${inParens(a)}x + \\frac{${a * a}}{2}x^2 + \\cdots$, so the numerator begins with $\\frac{${a * a}}{2}x^2$. Dividing by $${poly([b, "x^2"])}$ gives the limit $${answer.toLatex()}$.`,
        `级数开头是 $1 + ${inParens(a)}x + \\frac{${a * a}}{2}x^2 + \\cdots$，所以分子以 $\\frac{${a * a}}{2}x^2$ 开头。除以 $${poly([b, "x^2"])}$ 得极限 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const limitFromSineSeries: KnowledgePointDef = {
  id: "a-limit-from-the-sine-series",
  title: t("A limit from the sine series", "由正弦级数求极限"),
  explanation: t(
    "The series of sine begins $u - \\frac{u^3}{6} + \\cdots$, so $\\sin u$ differs from $u$ by about $\\frac{u^3}{6}$ for small $u$. This settles limits in which the first term cancels. Remember that the coefficient of $u^3$ is negative, and that the substitution raises any constant in $u$ to the third power.",
    "正弦的级数开头是 $u - \\frac{u^3}{6} + \\cdots$，所以 $u$ 很小时，$\\sin u$ 与 $u$ 相差约 $\\frac{u^3}{6}$。这可以解决第一项被抵消的极限。注意 $u^3$ 的系数是负的，而且代入后 $u$ 中的常数也要取三次方。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const b = rng.int(1, 6);
    const answer = Q.of(-(a ** 3), 6 * b);
    const u = poly([a, "x"]);
    return numberProblem({
      prompt: t(
        `Find $\\lim_{x \\to 0} \\frac{\\sin(${u}) - ${u}}{${poly([b, "x^3"])}}$.`,
        `求 $\\lim_{x \\to 0} \\frac{\\sin(${u}) - ${u}}{${poly([b, "x^3"])}}$。`,
      ),
      answer,
      wrong: [answer.neg(), Q.of(-(a ** 3), 2 * b), Q.of(0)],
      solution: t(
        `$\\sin(${u}) = ${u} - \\frac{${a ** 3}x^3}{6} + \\cdots$, so the numerator begins with $-\\frac{${a ** 3}}{6}x^3$. Dividing by $${poly([b, "x^3"])}$ gives $${answer.toLatex()}$.`,
        `$\\sin(${u}) = ${u} - \\frac{${a ** 3}x^3}{6} + \\cdots$，所以分子以 $-\\frac{${a ** 3}}{6}x^3$ 开头。除以 $${poly([b, "x^3"])}$ 得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

/** DeReason is a wrong value of a differential-equation question with its reason in English and Chinese. */
type DeReason = readonly [value: number | Q, en: string, zh: string];

/** deStepOf is a labelled step of a worked solution with what it says and its displayed lines. */
const deStepOf = (title: readonly [string, string], en: string, zh: string, ...lines: string[]): Step => [
  [title[0], title[1]],
  t(en, zh),
  lines,
];

/** deNumber asks for a number, explains it in labelled steps with a check, and keeps the first reason for each wrong value. */
function deNumber(
  prompt: readonly [string, string],
  answer: number | Q,
  parts: readonly Step[],
  check: readonly [string, string],
  reasons: readonly DeReason[],
  form?: "integer",
) {
  const q = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
  const right = q(answer);
  const kept = reasons.filter((r, i) => !q(r[0]).eq(right) && reasons.findIndex((s) => q(s[0]).eq(q(r[0]))) === i);
  return numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer: right,
    ...(form ? { form } : {}),
    mistakes: kept.map(([value, en, zh]) => ({ value: q(value), why: t(en, zh) })),
    solution: walked(parts, t(check[0], check[1])),
  });
}

const separableWithSquares: KnowledgePointDef = {
  id: "an-initial-value-problem-with-squares",
  title: t("An initial value problem with squares", "含平方的初值问题"),
  explanation: t(
    "Separating $\\frac{dy}{dx} = \\pm\\frac{x}{y}$ gives $y\\,dy = \\pm x\\,dx$, and integrating gives squares: $y^2 = \\pm x^2 + C$. The initial value fixes $C$. The solution is then a root, and the initial value also shows which sign of the root to take. For $\\frac{dy}{dx} = \\frac{x}{y}$ with $y(0) = 3$: $y^{2} = x^{2} + 9$, so $y(4) = \\sqrt{25} = 5$.\n\nCheck: $y = \\sqrt{x^{2} + 9}$ has $y' = \\frac{x}{\\sqrt{x^{2} + 9}} = \\frac{x}{y}$ and $y(0) = 3$.\n\n> **Watch out.** The squares add, not the values: $y(4)$ is $\\sqrt{9 + 16}$, not $3 + 4$.",
    "分离 $\\frac{dy}{dx} = \\pm\\frac{x}{y}$ 得 $y\\,dy = \\pm x\\,dx$，积分后出现平方：$y^2 = \\pm x^2 + C$。初值确定 $C$。解是一个根式，初值同时说明根式取哪个符号。对 $\\frac{dy}{dx} = \\frac{x}{y}$，$y(0) = 3$：$y^{2} = x^{2} + 9$，所以 $y(4) = \\sqrt{25} = 5$。\n\n检验：$y = \\sqrt{x^{2} + 9}$ 满足 $y' = \\frac{x}{\\sqrt{x^{2} + 9}} = \\frac{x}{y}$，且 $y(0) = 3$。\n\n> **注意。** 相加的是平方而不是数值：$y(4)$ 是 $\\sqrt{9 + 16}$，而不是 $3 + 4$。",
  ),
  generate(rng) {
    const [p, q, r] = rng.pick([
      [3, 4, 5],
      [4, 3, 5],
      [5, 12, 13],
      [12, 5, 13],
      [8, 15, 17],
      [15, 8, 17],
      [7, 24, 25],
      [24, 7, 25],
    ] as const);
    const s = rng.int(1, 3);
    const grow = rng.int(0, 1) === 0;
    const x = p * s;
    const start = grow ? q * s : r * s;
    const answer = grow ? r * s : q * s;
    const right = grow ? "\\frac{x}{y}" : "-\\frac{x}{y}";
    const sign = grow ? "+" : "-";
    const root = `\\sqrt{${start * start} ${sign} x^{2}}`;
    return deNumber(
      [
        `Solve $\\frac{dy}{dx} = ${right}$ with $y(0) = ${start}$, and find $y(${x})$.`,
        `解 $\\frac{dy}{dx} = ${right}$，$y(0) = ${start}$，并求 $y(${x})$。`,
      ],
      answer,
      [
        deStepOf(
          ["Separate and integrate", "分离变量并积分"],
          "Multiply by $y\\,dx$, integrate, and put in $y(0)$:",
          "两边乘以 $y\\,dx$，积分，再代入 $y(0)$：",
          `y\\,dy = ${grow ? "" : "-"}x\\,dx \\quad\\Rightarrow\\quad y^{2} = ${start * start} ${sign} x^{2}`,
        ),
        deStepOf(
          ["Evaluate and choose the root", "求值并选根"],
          `At $x = ${x}$, $y^{2} = ${start * start} ${sign} ${x * x} = ${answer * answer}$. Since $y(0) = ${start} > 0$, take the positive root:`,
          `在 $x = ${x}$ 处，$y^{2} = ${start * start} ${sign} ${x * x} = ${answer * answer}$。由于 $y(0) = ${start} > 0$，取正根：`,
          `y(${x}) = \\sqrt{${answer * answer}} = ${answer}`,
        ),
      ],
      [
        `Substitute back $y = ${root}$: $y' = \\frac{${grow ? "" : "-"}x}{${root}} = ${right}$, the equation, and $y(0) = \\sqrt{${start * start}} = ${start}$.`,
        `代回检验 $y = ${root}$：$y' = \\frac{${grow ? "" : "-"}x}{${root}} = ${right}$，正是原方程，且 $y(0) = \\sqrt{${start * start}} = ${start}$。`,
      ],
      [
        [
          grow ? start + x : start - x,
          `This ${grow ? "adds" : "subtracts"} the values; the solution ${grow ? "adds" : "subtracts"} the squares, $y^{2} = ${start * start} ${sign} x^{2}$`,
          `这里${grow ? "加" : "减"}的是数值；解中${grow ? "相加" : "相减"}的是平方，$y^{2} = ${start * start} ${sign} x^{2}$`,
        ],
        [start, "This is the initial value; $y$ changes as $x$ moves away from $0$", "这是初值；$x$ 离开 $0$ 后 $y$ 会变化"],
        [x, `$${x}$ is the value of $x$, not of $y$`, `$${x}$ 是 $x$ 的值，不是 $y$ 的值`],
        [
          -answer,
          `The negative root has $y(0) = -${start}$, but here $y(0) = ${start}$`,
          `负根满足 $y(0) = -${start}$，而这里 $y(0) = ${start}$`,
        ],
      ],
      "integer",
    );
  },
};

const coolingWithAHalfTime: KnowledgePointDef = {
  id: "cooling-with-a-fixed-halving-time",
  title: t("Cooling with a fixed halving time", "温差减半时间固定的冷却"),
  explanation: t(
    "Newton's law of cooling, $\\frac{dT}{dt} = -k(T - E)$, says the difference from the surroundings decays exponentially. It is the difference that halves in a fixed time, not the temperature. So halve the difference the right number of times, then add the temperature of the surroundings back. For a drink at $80$ °C in a room at $20$ °C whose difference halves every $10$ minutes, the difference $60$ becomes $15$ after $20$ minutes, so the drink is at $35$ °C.\n\nCheck: $35 - 20 = 15 = \\frac{60}{4}$, two halvings of the difference.\n\n> **Watch out.** Halving the temperature itself, $80 \\to 40 \\to 20$, ignores the room: the drink can never fall below $20$ °C.",
    "牛顿冷却定律 $\\frac{dT}{dt} = -k(T - E)$ 说明，与环境的温差按指数衰减。在固定时间内减半的是温差，而不是温度。所以把温差减半相应的次数，再加回环境温度。一杯 $80$ °C 的饮料放在 $20$ °C 的房间里，温差每 $10$ 分钟减半，$20$ 分钟后温差 $60$ 变成 $15$，所以饮料是 $35$ °C。\n\n检验：$35 - 20 = 15 = \\frac{60}{4}$，正是温差减半两次。\n\n> **注意。** 把温度本身减半，$80 \\to 40 \\to 20$，就忽略了室温：饮料永远不会低于 $20$ °C。",
  ),
  generate(rng) {
    const E = rng.int(15, 25);
    const d = rng.int(20, 80);
    const H = rng.pick([5, 6, 8, 10, 12]);
    const n = rng.int(1, 4);
    const left = Q.of(d, 2 ** n);
    const answer = left.add(Q.of(E));
    const T0 = E + d;
    return deNumber(
      [
        `A drink at ${T0} °C cools in a room at ${E} °C according to Newton's law of cooling. Its difference from room temperature halves every ${H} minutes. What is its temperature after ${n * H} minutes, in °C?`,
        `一杯 ${T0} °C 的饮料在 ${E} °C 的房间中按牛顿冷却定律降温。它与室温的温差每 ${H} 分钟减半。${n * H} 分钟后它的温度是多少 °C？`,
      ],
      answer,
      [
        deStepOf(
          ["Halve the difference", "把温差减半"],
          `The difference starts at $${T0} - ${E} = ${d}$, and $${n * H}$ minutes is $${n}$ halving time${n === 1 ? "" : "s"}:`,
          `温差起初是 $${T0} - ${E} = ${d}$，$${n * H}$ 分钟是 $${n}$ 个减半时间：`,
          `\\frac{${d}}{2^{${n}}} = ${left.toLatex()}`,
        ),
        deStepOf(
          ["Add the room temperature back", "加回室温"],
          "The temperature is the room temperature plus the difference that is left:",
          "温度等于室温加上剩下的温差：",
          `T = ${E} + ${left.toLatex()} = ${answer.toLatex()}`,
        ),
      ],
      [
        `Substitute back: $T = ${E} + ${d}\\left(\\frac{1}{2}\\right)^{t/${H}}$ has $T' = -\\frac{\\ln 2}{${H}}(T - ${E})$, Newton's law with $k = \\frac{\\ln 2}{${H}}$, and $T(0) = ${E} + ${d} = ${T0}$. At $t = ${n * H}$ it gives $${E} + \\frac{${d}}{${2 ** n}} = ${answer.toLatex()}$.`,
        `代回检验：$T = ${E} + ${d}\\left(\\frac{1}{2}\\right)^{t/${H}}$ 满足 $T' = -\\frac{\\ln 2}{${H}}(T - ${E})$，即 $k = \\frac{\\ln 2}{${H}}$ 的牛顿冷却定律，且 $T(0) = ${E} + ${d} = ${T0}$。在 $t = ${n * H}$ 时它给出 $${E} + \\frac{${d}}{${2 ** n}} = ${answer.toLatex()}$。`,
      ],
      [
        [left, `This is the difference from the room; add the room temperature $${E}$ back`, `这是与室温的温差；还要加回室温 $${E}$`],
        [
          Q.of(T0, 2 ** n),
          "This halves the temperature itself; it is the difference from the room that halves",
          "这里把温度本身减半了；减半的是与室温的温差",
        ],
        [
          Q.of(d, 2 * n).add(Q.of(E)),
          `This divides the difference by $2 \\cdot ${n}$; ${n} halvings divide it by $2^{${n}}$`,
          `这里用 $2 \\cdot ${n}$ 去除温差；减半 ${n} 次应除以 $2^{${n}}$`,
        ],
        [E, "The drink only approaches room temperature as time goes on; it never reaches it", "饮料只是随时间趋于室温，永远达不到"],
      ],
    );
  },
};

const stepSizeFromEuler: KnowledgePointDef = {
  id: "the-step-size-from-one-step-of-eulers-method",
  title: t("The step size from one step of Euler's method", "由欧拉法的一步求步长"),
  explanation: t(
    "One step of Euler's method is $y_1 = y_0 + h\\,f(x_0, y_0)$. This relation can be read in any direction: if the two values and the slope are known, the change $y_1 - y_0$ divided by the slope gives the step size $h$. For $y' = 2y$ from $y(0) = 3$ with estimate $4.2$: the slope is $6$ and the change is $1.2$, so $h = 1.2 \\div 6 = 0.2$.\n\nCheck: $3 + 0.2 \\cdot 6 = 4.2$.\n\n> **Watch out.** Divide the change $y_1 - y_0$, not the new value $y_1$.",
    "欧拉法的一步是 $y_1 = y_0 + h\\,f(x_0, y_0)$。这个关系可以朝任何方向读：如果已知两个值和斜率，变化量 $y_1 - y_0$ 除以斜率就是步长 $h$。对 $y' = 2y$，从 $y(0) = 3$ 出发，估计值为 $4.2$：斜率是 $6$，变化量是 $1.2$，所以 $h = 1.2 \\div 6 = 0.2$。\n\n检验：$3 + 0.2 \\cdot 6 = 4.2$。\n\n> **注意。** 要除的是变化量 $y_1 - y_0$，而不是新值 $y_1$。",
  ),
  generate(rng) {
    const y0 = rng.int(1, 9);
    const k = rng.int(1, 5);
    const s = rng.pick([2, 4, 5, 10]);
    const x0 = rng.int(0, 3);
    const h = Q.of(1, s);
    const y1 = Q.of(y0).add(h.mul(Q.of(k * y0)));
    const change = y1.sub(Q.of(y0));
    const slope = k * y0;
    return deNumber(
      [
        `One step of Euler's method for $y' = ${poly([k, "y"])}$ with $y(${x0}) = ${y0}$ gives the estimate $${y1.toLatex()}$. What is the step size?`,
        `对 $y' = ${poly([k, "y"])}$，$y(${x0}) = ${y0}$，欧拉法的一步给出估计值 $${y1.toLatex()}$。步长是多少？`,
      ],
      h,
      [
        deStepOf(
          ["Find the slope at the start", "求起点处的斜率"],
          "Euler's method uses the slope at the starting point:",
          "欧拉法用的是起点处的斜率：",
          `f(${x0}, ${y0}) = ${k === 1 ? "" : `${k} \\cdot `}${y0} = ${slope}`,
        ),
        deStepOf(
          ["Divide the change by the slope", "用变化量除以斜率"],
          `The estimate rose by $${y1.toLatex()} - ${y0} = ${change.toLatex()}$:`,
          `估计值上升了 $${y1.toLatex()} - ${y0} = ${change.toLatex()}$：`,
          `h = ${change.toLatex()} \\div ${slope} = ${h.toLatex()}`,
        ),
      ],
      [
        `Take the step: $${y0} + ${h.toLatex()} \\cdot ${slope} = ${y1.toLatex()}$, the estimate given.`,
        `走一步：$${y0} + ${h.toLatex()} \\cdot ${slope} = ${y1.toLatex()}$，正是给出的估计值。`,
      ],
      [
        [
          change,
          `$${change.toLatex()}$ is the change in $y$; divide it by the slope $${slope}$`,
          `$${change.toLatex()}$ 是 $y$ 的变化量；还要除以斜率 $${slope}$`,
        ],
        [
          Q.of(k, s),
          `This divides the change by $${y0}$ only; the slope is $${k} \\cdot ${y0} = ${slope}$`,
          `这里只除以了 $${y0}$；斜率是 $${k} \\cdot ${y0} = ${slope}$`,
        ],
        [
          y1.div(Q.of(slope)),
          "This divides the estimate itself; divide the change $y_1 - y_0$",
          "这里除的是估计值本身；应当除变化量 $y_1 - y_0$",
        ],
        [
          Q.of(1, s * k),
          `This divides by $${k}$ again after dividing by the slope $${slope}$`,
          `这里除以斜率 $${slope}$ 之后又除了一次 $${k}$`,
        ],
      ],
    );
  },
};

const evenPowerOfSecant: KnowledgePointDef = {
  id: "even-powers-of-secant",
  title: t("Even powers of secant", "正割的偶次幂"),
  explanation: t(
    "An even power of secant can give up one factor of $\\sec^2 x$ to serve as the differential of $\\tan x$. The rest is rewritten with $\\sec^2 x = 1 + \\tan^2 x$. So $\\int \\sec^4 x\\,dx$ becomes $\\int (1 + u^2)\\,du$ with $u = \\tan x$, and it is a polynomial integral. For example, $\\int_0^{\\pi/4} \\sec^4 x\\,dx = \\int_0^1 (1 + u^2)\\,du = \\frac{4}{3}$.\n\nCheck: $\\frac{d}{dx}\\left(\\tan x + \\frac{\\tan^3 x}{3}\\right) = \\sec^2 x + \\tan^2 x\\sec^2 x = \\sec^4 x$, and this antiderivative is $\\frac{4}{3}$ at $\\frac{\\pi}{4}$ and $0$ at $0$.\n\n> **Watch out.** Change the limits with the substitution: $\\tan 0 = 0$ and $\\tan \\frac{\\pi}{4} = 1$. And the saved $\\sec^2 x\\,dx$ becomes $du$; it is not converted.",
    "正割的偶次幂可以拿出一个因子 $\\sec^2 x$ 作为 $\\tan x$ 的微分，其余部分用 $\\sec^2 x = 1 + \\tan^2 x$ 改写。于是令 $u = \\tan x$，$\\int \\sec^4 x\\,dx$ 变成 $\\int (1 + u^2)\\,du$，这是多项式积分。例如，$\\int_0^{\\pi/4} \\sec^4 x\\,dx = \\int_0^1 (1 + u^2)\\,du = \\frac{4}{3}$。\n\n检验：$\\frac{d}{dx}\\left(\\tan x + \\frac{\\tan^3 x}{3}\\right) = \\sec^2 x + \\tan^2 x\\sec^2 x = \\sec^4 x$，这个原函数在 $\\frac{\\pi}{4}$ 处为 $\\frac{4}{3}$，在 $0$ 处为 $0$。\n\n> **注意。** 换元时要同时换积分限：$\\tan 0 = 0$，$\\tan \\frac{\\pi}{4} = 1$。留出的 $\\sec^2 x\\,dx$ 变成 $du$，不要再转换它。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = nonzero(rng, 9);
    const answer = Q.of(4 * a, 3).add(Q.of(b));
    const integrand = poly([a, "\\sec^4 x"], [b, "\\sec^2 x"]);
    return numberProblem({
      prompt: t(`Find $\\int_0^{\\pi/4} (${integrand})\\,dx$.`, `求 $\\int_0^{\\pi/4} (${integrand})\\,dx$。`),
      answer,
      mistakes: [
        {
          value: Q.of(a + b),
          why: t(
            "This takes $\\int_0^{\\pi/4} \\sec^4 x\\,dx$ as $1$, like the integral of $\\sec^2 x$; the extra $\\tan^2 x$ part adds $\\frac{1}{3}$.",
            "这是把 $\\int_0^{\\pi/4} \\sec^4 x\\,dx$ 当成 $1$，和 $\\sec^2 x$ 的积分一样；多出的 $\\tan^2 x$ 部分还要加上 $\\frac{1}{3}$。",
          ),
        },
        {
          value: Q.of(a, 3).add(Q.of(b)),
          why: t(
            "This keeps only the $\\frac{u^3}{3}$ part; $\\int_0^1 (1 + u^2)\\,du$ also has the $1$ from the constant term.",
            "这里只保留了 $\\frac{u^3}{3}$ 部分；$\\int_0^1 (1 + u^2)\\,du$ 还有常数项积分出的 $1$。",
          ),
        },
        {
          value: Q.of(4 * a + b),
          why: t(
            "$4$ is the value of $\\sec^4 x$ at $\\frac{\\pi}{4}$, not its integral; integrate $1 + u^2$ from $0$ to $1$.",
            "$4$ 是 $\\sec^4 x$ 在 $\\frac{\\pi}{4}$ 处的值，不是它的积分；要把 $1 + u^2$ 从 $0$ 积到 $1$。",
          ),
        },
      ],
      solution: walkThrough(
        [
          [
            ["Save one factor of sec²x", "留出一个 sec²x"],
            [
              "Write $\\sec^4 x = (1 + \\tan^2 x)\\sec^2 x$ and let $u = \\tan x$, so $du = \\sec^2 x\\,dx$ and the limits become $0$ and $1$:",
              "写成 $\\sec^4 x = (1 + \\tan^2 x)\\sec^2 x$，令 $u = \\tan x$，则 $du = \\sec^2 x\\,dx$，积分限变成 $0$ 和 $1$：",
            ],
            ["\\int_0^{\\pi/4} \\sec^4 x\\,dx = \\int_0^1 (1 + u^2)\\,du = 1 + \\frac{1}{3} = \\frac{4}{3}"],
          ],
          [
            ["Add the other term", "加上另一项"],
            [
              "$\\int_0^{\\pi/4} \\sec^2 x\\,dx = \\tan \\frac{\\pi}{4} - \\tan 0 = 1$, so:",
              "$\\int_0^{\\pi/4} \\sec^2 x\\,dx = \\tan \\frac{\\pi}{4} - \\tan 0 = 1$，所以：",
            ],
            [`\\int_0^{\\pi/4} (${integrand})\\,dx = ${a} \\cdot \\frac{4}{3} + ${inParens(b)} \\cdot 1 = ${answer.toLatex()}`],
          ],
        ],
        [
          `Use the antiderivative $F(x) = ${a === 1 ? "" : a}\\left(\\tan x + \\frac{\\tan^3 x}{3}\\right) ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}\\tan x$; differentiating $\\tan x + \\frac{\\tan^3 x}{3}$ gives $\\sec^2 x(1 + \\tan^2 x) = \\sec^4 x$. Then $F\\left(\\frac{\\pi}{4}\\right) - F(0) = ${a} \\cdot \\frac{4}{3} + ${inParens(b)} - 0 = ${answer.toLatex()}$.`,
          `用原函数 $F(x) = ${a === 1 ? "" : a}\\left(\\tan x + \\frac{\\tan^3 x}{3}\\right) ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}\\tan x$；对 $\\tan x + \\frac{\\tan^3 x}{3}$ 求导得 $\\sec^2 x(1 + \\tan^2 x) = \\sec^4 x$。于是 $F\\left(\\frac{\\pi}{4}\\right) - F(0) = ${a} \\cdot \\frac{4}{3} + ${inParens(b)} - 0 = ${answer.toLatex()}$。`,
        ],
      ),
    });
  },
};

const orthogonalSines: KnowledgePointDef = {
  id: "the-integral-of-a-squared-sum-of-sines",
  title: t("The integral of a squared sum of sines", "正弦之和平方的积分"),
  explanation: t(
    "For different positive integers $m$ and $n$, the integral of $\\sin mx\\sin nx$ over a full period $[0, 2\\pi]$ is zero, by the product-to-sum identities. The square of a sum therefore keeps only its squared terms, and each $\\int_0^{2\\pi} \\sin^2 mx\\,dx$ equals $\\pi$. This is the idea behind Fourier series. For example, $\\int_0^{2\\pi} (\\sin x + 2\\sin 3x)^2\\,dx = (1 + 4)\\pi = 5\\pi$.\n\nCheck: $\\sin^2 mx$ has average value $\\frac{1}{2}$ over a period, and $\\frac{1}{2} \\cdot 2\\pi = \\pi$.\n\n> **Watch out.** Do not square the sum of the coefficients: $(a + b)^2$ counts the cross term $2ab\\sin mx\\sin nx$, whose integral is $0$.",
    "当 $m$、$n$ 是不同的正整数时，由积化和差公式，$\\sin mx\\sin nx$ 在一个完整周期 $[0, 2\\pi]$ 上的积分为零。所以和的平方只留下平方项，而每个 $\\int_0^{2\\pi} \\sin^2 mx\\,dx$ 都等于 $\\pi$。这正是傅里叶级数的思想。例如，$\\int_0^{2\\pi} (\\sin x + 2\\sin 3x)^2\\,dx = (1 + 4)\\pi = 5\\pi$。\n\n检验：$\\sin^2 mx$ 在一个周期上的平均值是 $\\frac{1}{2}$，而 $\\frac{1}{2} \\cdot 2\\pi = \\pi$。\n\n> **注意。** 不要把系数之和平方：$(a + b)^2$ 计入了交叉项 $2ab\\sin mx\\sin nx$，而它的积分是 $0$。",
  ),
  generate(rng) {
    const m = rng.int(1, 6);
    const n = different(rng, 1, 6, m);
    const a = nonzero(rng, 6);
    const b = nonzero(rng, 6);
    const answer = a * a + b * b;
    const sine = (j: number) => `\\sin ${j === 1 ? "" : j}x`;
    const square = (j: number) => `\\sin^2 ${j === 1 ? "" : j}x`;
    const integrand = poly([a, sine(m)], [b, sine(n)]);
    const expanded = poly([a * a, square(m)], [2 * a * b, `${sine(m)}${sine(n)}`], [b * b, square(n)]);
    return numberProblem({
      prompt: t(`$\\int_0^{2\\pi} (${integrand})^2\\,dx = c\\pi$. Find $c$.`, `$\\int_0^{2\\pi} (${integrand})^2\\,dx = c\\pi$。求 $c$。`),
      answer,
      form: "integer",
      mistakes: [
        {
          value: (a + b) ** 2,
          why: t(
            `The cross term $${poly([2 * a * b, `${sine(m)}${sine(n)}`])}$ integrates to $0$ over a full period, so it adds nothing.`,
            `交叉项 $${poly([2 * a * b, `${sine(m)}${sine(n)}`])}$ 在一个完整周期上的积分为 $0$，不应计入。`,
          ),
        },
        {
          value: 2 * answer,
          why: t(
            "Each $\\int_0^{2\\pi} \\sin^2 jx\\,dx$ is $\\pi$, not $2\\pi$: the average of $\\sin^2$ is $\\frac{1}{2}$.",
            "每个 $\\int_0^{2\\pi} \\sin^2 jx\\,dx$ 等于 $\\pi$，不是 $2\\pi$：$\\sin^2$ 的平均值是 $\\frac{1}{2}$。",
          ),
        },
        {
          value: a * a,
          why: t(
            `The term $${poly([b * b, square(n)])}$ also contributes $${piTimes(Q.of(b * b))}$; only the cross term vanishes.`,
            `$${poly([b * b, square(n)])}$ 这一项也贡献 $${piTimes(Q.of(b * b))}$；只有交叉项为零。`,
          ),
        },
      ],
      solution: walkThrough(
        [
          [["Expand the square", "展开平方"], ["Square the sum:", "把和平方："], [`(${integrand})^2 = ${expanded}`]],
          [
            ["Integrate each term", "逐项积分"],
            [
              `Over $[0, 2\\pi]$ each $\\sin^2 jx$ integrates to $\\pi$, and the cross term integrates to $0$ because $${sine(m)}${sine(n)} = \\frac{1}{2}\\left(\\cos ${Math.abs(m - n) === 1 ? "" : Math.abs(m - n)}x - \\cos ${m + n}x\\right)$:`,
              `在 $[0, 2\\pi]$ 上每个 $\\sin^2 jx$ 积分为 $\\pi$，交叉项积分为 $0$，因为 $${sine(m)}${sine(n)} = \\frac{1}{2}\\left(\\cos ${Math.abs(m - n) === 1 ? "" : Math.abs(m - n)}x - \\cos ${m + n}x\\right)$：`,
            ],
            [`\\int_0^{2\\pi} (${integrand})^2\\,dx = ${piTimes(Q.of(a * a))} + 0 + ${piTimes(Q.of(b * b))} = ${piTimes(Q.of(answer))}`],
          ],
        ],
        [
          `Use average values instead: over a period each $\\sin^2$ averages $\\frac{1}{2}$ and the cross term averages $0$, so the integrand averages $\\frac{${a * a} + ${b * b}}{2}$. Times the length $2\\pi$ this is $${answer}\\pi$, so $c = ${answer}$.`,
          `改用平均值：在一个周期上每个 $\\sin^2$ 的平均值是 $\\frac{1}{2}$，交叉项的平均值是 $0$，所以被积函数的平均值是 $\\frac{${a * a} + ${b * b}}{2}$。乘以长度 $2\\pi$ 得 $${answer}\\pi$，所以 $c = ${answer}$。`,
        ],
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Second pass
// ---------------------------------------------------------------------------

/** coefficientOf writes a positive number before a symbol, leaving out 1. */
const coefficientOf = (n: number) => (n === 1 ? "" : `${n}`);
/** fractionBefore writes a fraction before a symbol, leaving out 1. */
const fractionBefore = (n: number, d: number) => (n === d ? "" : Q.of(n, d).toLatex());
/** factorial multiplies the whole numbers from 1 to n. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
/** pythagorean picks the legs and hypotenuse of a right triangle with whole sides. */
const pythagorean = (rng: Rng) => {
  const [a, b, h] = rng.pick([
    [3, 4, 5],
    [5, 12, 13],
    [8, 15, 17],
    [6, 8, 10],
    [7, 24, 25],
    [20, 21, 29],
    [9, 12, 15],
  ]) as [number, number, number];
  return rng.pick([true, false]) ? { a, b, h } : { a: b, b: a, h };
};

const changedLimits: KnowledgePointDef = {
  id: "a-definite-integral-with-changed-limits",
  title: t("A definite integral with changed limits", "换限的定积分"),
  explanation: t(
    "In a definite integral, a substitution changes the limits as well as the integrand. Once the limits are written in terms of $u$, there is no need to return to $x$ at the end. For $\\int x\\sqrt{x^2 + a^2}\\,dx$, take $u = x^2 + a^2$, so that the lower limit $x = 0$ becomes $u = a^2$. For example, $\\int_0^{4} x\\sqrt{x^2 + 9}\\,dx$ becomes $\\frac{1}{2}\\int_9^{25} \\sqrt{u}\\,du$, which is $\\frac{1}{3}(125 - 27)$, or $\\frac{98}{3}$.\n\nCheck: in $x$, the antiderivative $\\frac{1}{3}(x^2 + 9)^{3/2}$ is $\\frac{125}{3}$ at $x = 4$ and $\\frac{27}{3}$ at $x = 0$, which gives $\\frac{98}{3}$ as well.\n\n> **Watch out.** Do not keep the old limits with the new variable. After $u = x^2 + a^2$ the integral starts at $u = a^2$, not at $0$.",
    "在定积分中，换元既改变被积函数，也改变积分限。积分限一旦写成 $u$ 的值，最后就不必再换回 $x$。对 $\\int x\\sqrt{x^2 + a^2}\\,dx$，取 $u = x^2 + a^2$，于是下限 $x = 0$ 变成 $u = a^2$。例如，$\\int_0^{4} x\\sqrt{x^2 + 9}\\,dx$ 变成 $\\frac{1}{2}\\int_9^{25} \\sqrt{u}\\,du$，即 $\\frac{1}{3}(125 - 27)$，也就是 $\\frac{98}{3}$。\n\n检验：用 $x$ 计算，原函数 $\\frac{1}{3}(x^2 + 9)^{3/2}$ 在 $x = 4$ 处为 $\\frac{125}{3}$，在 $x = 0$ 处为 $\\frac{27}{3}$，差同样是 $\\frac{98}{3}$。\n\n> **注意。** 不要让新变量沿用旧的积分限。换元 $u = x^2 + a^2$ 后，积分从 $u = a^2$ 开始，而不是从 $0$ 开始。",
  ),
  generate(rng) {
    const { a, b, h } = pythagorean(rng);
    const k = rng.int(1, 6);
    const difference = h ** 3 - a ** 3;
    const answer = Q.of(k * difference, 3);
    const third = Q.of(k, 3);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^{${b}} ${coefficientOf(k)}x\\sqrt{x^2 + ${a * a}}\\,dx$.`,
        `计算 $\\int_0^{${b}} ${coefficientOf(k)}x\\sqrt{x^2 + ${a * a}}\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(k * h ** 3, 3), Q.of(2 * k * difference, 3), Q.of(k * (h * h - a * a), 2)],
      solution: walkThrough(
        [
          [
            ["Change the variable and the limits", "换元并换限"],
            [
              `Let $u = x^2 + ${a * a}$. Then $du = 2x\\,dx$, and $u$ runs from $${a * a}$ at $x = 0$ to $${h * h}$ at $x = ${b}$:`,
              `令 $u = x^2 + ${a * a}$，则 $du = 2x\\,dx$，$u$ 从 $x = 0$ 时的 $${a * a}$ 变到 $x = ${b}$ 时的 $${h * h}$：`,
            ],
            [`${coefficientOf(k)}x\\,dx = \\frac{${k}}{2}\\,du`],
          ],
          [
            ["Integrate in u", "对 u 积分"],
            ["The integral is a power of $u$ between the new limits:", "积分是 $u$ 的幂在新积分限之间的积分："],
            [
              `\\frac{${k}}{2}\\int_{${a * a}}^{${h * h}} u^{1/2}\\,du = \\frac{${k}}{3}\\left[u^{3/2}\\right]_{${a * a}}^{${h * h}}`,
              `\\frac{${k}}{3}\\left(${h}^3 - ${a}^3\\right) = ${answer.toLatex()}`,
            ],
          ],
        ],
        [
          `Stay in $x$ instead. An antiderivative is $${third.toLatex()}(x^2 + ${a * a})^{3/2}$, which is $${third.toLatex()} \\cdot ${h ** 3}$ at $x = ${b}$ and $${third.toLatex()} \\cdot ${a ** 3}$ at $x = 0$. Their difference is $${answer.toLatex()}$ again.`,
          `改用 $x$ 计算。一个原函数是 $${third.toLatex()}(x^2 + ${a * a})^{3/2}$，它在 $x = ${b}$ 处为 $${third.toLatex()} \\cdot ${h ** 3}$，在 $x = 0$ 处为 $${third.toLatex()} \\cdot ${a ** 3}$。两者之差同样是 $${answer.toLatex()}$。`,
        ],
      ),
    });
  },
};

const limitWithLogarithm: KnowledgePointDef = {
  id: "an-exponential-integral-with-a-logarithm-in-the-limit",
  title: t("An exponential integral with a logarithm in the limit", "积分限含对数的指数积分"),
  explanation: t(
    "After the substitution $u = x^2$, the integral of $xe^{x^2}$ is $\\frac{1}{2}e^{x^2}$. Limits are sometimes chosen so that the exponential simplifies. Since $e^{\\ln c} = c$, an upper limit of $\\sqrt{\\ln c}$ makes the antiderivative a plain number, and an answer that looks irrational turns out to be rational. For example, $\\int_0^{\\sqrt{\\ln 5}} xe^{x^2}\\,dx$ is $\\frac{1}{2}(5 - 1)$, which is $2$.\n\nCheck: at the upper limit, $x^2$ is $\\ln 5$, so $e^{x^2}$ is $e^{\\ln 5}$, which is $5$, and at $0$ it is $1$.\n\n> **Watch out.** Square the limit before exponentiating. At $x = \\sqrt{\\ln c}$ the exponent $x^2$ is $\\ln c$, so $e^{x^2}$ is $c$, not $e^{\\sqrt{\\ln c}}$.",
    "经过换元 $u = x^2$，$xe^{x^2}$ 的积分是 $\\frac{1}{2}e^{x^2}$。积分限有时是特意选取的，以使指数化简。由于 $e^{\\ln c} = c$，上限取 $\\sqrt{\\ln c}$ 时，原函数的值就是一个普通的数，看起来超越的答案其实是有理数。例如，$\\int_0^{\\sqrt{\\ln 5}} xe^{x^2}\\,dx$ 等于 $\\frac{1}{2}(5 - 1)$，即 $2$。\n\n检验：在上限处 $x^2$ 等于 $\\ln 5$，所以 $e^{x^2}$ 等于 $e^{\\ln 5}$，即 $5$；在 $0$ 处它等于 $1$。\n\n> **注意。** 先把积分限平方，再取指数。在 $x = \\sqrt{\\ln c}$ 处，指数 $x^2$ 是 $\\ln c$，所以 $e^{x^2}$ 等于 $c$，而不是 $e^{\\sqrt{\\ln c}}$。",
  ),
  generate(rng) {
    const c = rng.int(2, 12);
    const k = rng.int(1, 9);
    const answer = Q.of(k * (c - 1), 2);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^{\\sqrt{\\ln ${c}}} ${coefficientOf(k)}xe^{x^2}\\,dx$.`,
        `计算 $\\int_0^{\\sqrt{\\ln ${c}}} ${coefficientOf(k)}xe^{x^2}\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(k * (c - 1)), Q.of(k * c, 2), Q.of(k * (c - 1), 4)],
      solution: walkThrough(
        [
          [
            ["Substitute", "换元"],
            [
              `Let $u = x^2$. Then $du = 2x\\,dx$, and $u$ runs from $0$ to $(\\sqrt{\\ln ${c}})^2$, which is $\\ln ${c}$:`,
              `令 $u = x^2$，则 $du = 2x\\,dx$，$u$ 从 $0$ 变到 $(\\sqrt{\\ln ${c}})^2$，即 $\\ln ${c}$：`,
            ],
            [`\\int_0^{\\sqrt{\\ln ${c}}} ${coefficientOf(k)}xe^{x^2}\\,dx = \\frac{${k}}{2}\\int_0^{\\ln ${c}} e^{u}\\,du`],
          ],
          [
            ["Evaluate", "求值"],
            [`Since $e^{\\ln ${c}}$ is $${c}$ and $e^{0}$ is $1$:`, `由于 $e^{\\ln ${c}}$ 等于 $${c}$，$e^{0}$ 等于 $1$：`],
            [`\\frac{${k}}{2}\\left(e^{\\ln ${c}} - e^{0}\\right) = \\frac{${k}}{2}(${c} - 1) = ${answer.toLatex()}`],
          ],
        ],
        [
          `Stay in $x$ instead. The derivative of $${Q.of(k, 2).toLatex()}e^{x^2}$ is $${coefficientOf(k)}xe^{x^2}$, so it is an antiderivative. At the upper limit $x^2$ is $\\ln ${c}$, so its value is $${Q.of(k * c, 2).toLatex()}$, and at $0$ it is $${Q.of(k, 2).toLatex()}$. The difference is $${answer.toLatex()}$ again.`,
          `改用 $x$ 计算。$${Q.of(k, 2).toLatex()}e^{x^2}$ 的导数是 $${coefficientOf(k)}xe^{x^2}$，所以它是一个原函数。在上限处 $x^2$ 等于 $\\ln ${c}$，所以它的值是 $${Q.of(k * c, 2).toLatex()}$；在 $0$ 处它的值是 $${Q.of(k, 2).toLatex()}$。差同样是 $${answer.toLatex()}$。`,
        ],
      ),
    });
  },
};

const logLimits: KnowledgePointDef = {
  id: "a-definite-integral-of-a-power-of-ln-x-over-x",
  title: t("A definite integral of a power of $\\ln x$ over $x$", "$\\ln x$ 的幂除以 $x$ 的定积分"),
  explanation: t(
    "With $u = \\ln x$, the factor $\\frac{dx}{x}$ becomes $du$, and the limits transform as well: $x = 1$ gives $u = 0$, and $x = e^n$ gives $u = n$. What remains is the integral of a plain power of $u$. Limits that are powers of $e$ are therefore a strong signal to use this substitution. For example, $\\int_1^{e^{2}} \\frac{(\\ln x)^2}{x}\\,dx$ becomes $\\int_0^{2} u^2\\,du$, which is $\\frac{8}{3}$.\n\nCheck: the antiderivative $\\frac{(\\ln x)^3}{3}$ is $\\frac{8}{3}$ at $x = e^2$ and $0$ at $x = 1$, which gives $\\frac{8}{3}$ again.\n\n> **Watch out.** The lower limit $x = 1$ becomes $u = 0$, not $u = 1$, since $\\ln 1$ is $0$.",
    "令 $u = \\ln x$，因子 $\\frac{dx}{x}$ 变成 $du$，积分限也随之变化：$x = 1$ 对应 $u = 0$，$x = e^n$ 对应 $u = n$。剩下的就是 $u$ 的普通幂函数的积分。所以积分限是 $e$ 的幂时，就是使用这个换元的明显信号。例如，$\\int_1^{e^{2}} \\frac{(\\ln x)^2}{x}\\,dx$ 变成 $\\int_0^{2} u^2\\,du$，即 $\\frac{8}{3}$。\n\n检验：原函数 $\\frac{(\\ln x)^3}{3}$ 在 $x = e^2$ 处为 $\\frac{8}{3}$，在 $x = 1$ 处为 $0$，差同样是 $\\frac{8}{3}$。\n\n> **注意。** 下限 $x = 1$ 变成 $u = 0$，而不是 $u = 1$，因为 $\\ln 1$ 等于 $0$。",
  ),
  generate(rng) {
    const n = rng.int(2, 5);
    const m = rng.int(1, 4);
    const k = rng.int(1, 6);
    const answer = Q.of(k * n ** (m + 1), m + 1);
    const power = m === 1 ? "\\ln x" : `(\\ln x)^{${m}}`;
    const um = m === 1 ? "u" : `u^{${m}}`;
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_1^{e^{${n}}} \\frac{${coefficientOf(k)}${power}}{x}\\,dx$.`,
        `计算 $\\int_1^{e^{${n}}} \\frac{${coefficientOf(k)}${power}}{x}\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(k * n ** m, m), Q.of(k * n ** (m + 1)), Q.of(k * n ** (m + 1), m + 2)],
      solution: walkThrough(
        [
          [
            ["Substitute", "换元"],
            [
              `Let $u = \\ln x$, so $du = \\frac{dx}{x}$. The limits $x = 1$ and $x = e^{${n}}$ become $u = 0$ and $u = ${n}$:`,
              `令 $u = \\ln x$，则 $du = \\frac{dx}{x}$。积分限 $x = 1$ 和 $x = e^{${n}}$ 变成 $u = 0$ 和 $u = ${n}$：`,
            ],
            [`\\int_1^{e^{${n}}} \\frac{${coefficientOf(k)}${power}}{x}\\,dx = ${coefficientOf(k)}\\int_0^{${n}} ${um}\\,du`],
          ],
          [
            ["Integrate the power", "对幂积分"],
            ["Raise the power by one and divide by the new power:", "幂次加一，再除以新的幂次："],
            [`${coefficientOf(k)}\\int_0^{${n}} ${um}\\,du = \\frac{${k} \\cdot ${n}^{${m + 1}}}{${m + 1}} = ${answer.toLatex()}`],
          ],
        ],
        [
          `Stay in $x$ instead. An antiderivative is $\\frac{${k}(\\ln x)^{${m + 1}}}{${m + 1}}$. At $x = e^{${n}}$, $\\ln x$ is $${n}$, and at $x = 1$ it is $0$, so the value is $${answer.toLatex()}$ again.`,
          `改用 $x$ 计算。一个原函数是 $\\frac{${k}(\\ln x)^{${m + 1}}}{${m + 1}}$。在 $x = e^{${n}}$ 处 $\\ln x$ 等于 $${n}$，在 $x = 1$ 处等于 $0$，所以值同样是 $${answer.toLatex()}$。`,
        ],
      ),
    });
  },
};

const powerOverQuarterTurn: KnowledgePointDef = {
  id: "a-power-of-sine-or-cosine-over-a-quarter-turn",
  title: t("A power of sine or cosine over a quarter turn", "正弦或余弦的幂在四分之一周期上的积分"),
  explanation: t(
    "When a single factor of cosine sits beside a power of sine, take $u = \\sin x$, and the cosine is absorbed into $du$. Over $[0, \\frac{\\pi}{2}]$, $u$ runs from 0 to 1 in either version of the integral, whether sine or cosine carries the power. So the answer is simply one over one more than the power. For example, $\\int_0^{\\pi/2} \\sin^{3} x\\cos x\\,dx$ is $\\int_0^{1} u^{3}\\,du$, which is $\\frac{1}{4}$.\n\nCheck: for $\\cos^{3} x\\sin x$ take $u = \\cos x$. Then $du = -\\sin x\\,dx$ and $u$ runs from $1$ down to $0$; the two reversals cancel, and the value is $\\frac{1}{4}$ again.\n\n> **Watch out.** With $u = \\cos x$ the limits come out reversed. Dropping the minus sign of $du$ while keeping the reversed limits changes the sign of the answer.",
    "一个余弦因子紧挨着正弦的幂时，取 $u = \\sin x$，余弦就被吸收进 $du$。在 $[0, \\frac{\\pi}{2}]$ 上，无论幂在正弦还是余弦上，$u$ 都是在 0 与 1 之间变化。所以答案就是幂次加一的倒数。例如，$\\int_0^{\\pi/2} \\sin^{3} x\\cos x\\,dx$ 等于 $\\int_0^{1} u^{3}\\,du$，即 $\\frac{1}{4}$。\n\n检验：对 $\\cos^{3} x\\sin x$ 取 $u = \\cos x$，则 $du = -\\sin x\\,dx$，$u$ 从 $1$ 减到 $0$；两次反向相互抵消，值同样是 $\\frac{1}{4}$。\n\n> **注意。** 取 $u = \\cos x$ 时积分限是反过来的。如果丢掉 $du$ 的负号却保留反向的积分限，答案的符号就错了。",
  ),
  generate(rng) {
    const n = rng.int(2, 9);
    const k = rng.int(1, 12);
    const answer = Q.of(k, n + 1);
    const sine = rng.pick([true, false]);
    const integrand = sine ? `\\sin^{${n}} x\\cos x` : `\\cos^{${n}} x\\sin x`;
    const ck = coefficientOf(k);
    const inU = `${ck}\\int_0^{1} u^{${n}}\\,du`;
    return numberProblem({
      prompt: t(`Evaluate $\\int_0^{\\pi/2} ${ck}${integrand}\\,dx$.`, `计算 $\\int_0^{\\pi/2} ${ck}${integrand}\\,dx$。`),
      answer,
      wrong: [Q.of(k, n), Q.of(k), answer.neg()],
      solution: walkThrough(
        [
          sine
            ? [
                ["Substitute", "换元"],
                [
                  "Let $u = \\sin x$, so $du = \\cos x\\,dx$, and $u$ runs from $0$ to $1$:",
                  "令 $u = \\sin x$，则 $du = \\cos x\\,dx$，$u$ 从 $0$ 变到 $1$：",
                ],
                [`\\int_0^{\\pi/2} ${ck}${integrand}\\,dx = ${inU}`],
              ]
            : [
                ["Substitute", "换元"],
                [
                  "Let $u = \\cos x$, so $du = -\\sin x\\,dx$, and $u$ runs from $1$ down to $0$. The minus sign turns the limits back around:",
                  "令 $u = \\cos x$，则 $du = -\\sin x\\,dx$，$u$ 从 $1$ 减到 $0$。负号把积分限再翻转回来：",
                ],
                [`\\int_0^{\\pi/2} ${ck}${integrand}\\,dx = -${ck}\\int_1^{0} u^{${n}}\\,du = ${inU}`],
              ],
          [
            ["Integrate the power", "对幂积分"],
            ["Raise the power by one and evaluate from $0$ to $1$:", "幂次加一，再从 $0$ 到 $1$ 求值："],
            [`${inU} = ${ck}\\left[\\frac{u^{${n + 1}}}{${n + 1}}\\right]_0^1 = ${answer.toLatex()}`],
          ],
        ],
        sine
          ? [
              `Stay in $x$ instead. An antiderivative is $${answer.toLatex()}\\sin^{${n + 1}} x$, which is $${answer.toLatex()}$ at $\\frac{\\pi}{2}$ and $0$ at $0$, so the value is $${answer.toLatex()}$ again.`,
              `改用 $x$ 计算。一个原函数是 $${answer.toLatex()}\\sin^{${n + 1}} x$，它在 $\\frac{\\pi}{2}$ 处为 $${answer.toLatex()}$，在 $0$ 处为 $0$，所以值同样是 $${answer.toLatex()}$。`,
            ]
          : [
              `Stay in $x$ instead. An antiderivative is $-${answer.toLatex()}\\cos^{${n + 1}} x$, which is $0$ at $\\frac{\\pi}{2}$ and $-${answer.toLatex()}$ at $0$, so the value is $${answer.toLatex()}$ again.`,
              `改用 $x$ 计算。一个原函数是 $-${answer.toLatex()}\\cos^{${n + 1}} x$，它在 $\\frac{\\pi}{2}$ 处为 $0$，在 $0$ 处为 $-${answer.toLatex()}$，所以值同样是 $${answer.toLatex()}$。`,
            ],
      ),
    });
  },
};

const sinhCoshLimit: KnowledgePointDef = {
  id: "a-hyperbolic-integral-with-a-logarithm-in-the-limit",
  title: t("A hyperbolic integral with a logarithm in the limit", "积分限含对数的双曲积分"),
  explanation: t(
    "The substitution $u = \\sinh x$ gives $\\int \\sinh x\\cosh x\\,dx = \\frac{1}{2}\\sinh^2 x + C$. To evaluate at a limit such as $\\ln a$, return to the exponential definition:\n\n$$\\sinh(\\ln a) = \\frac{1}{2}\\left(a - \\frac{1}{a}\\right).$$\n\nThe exponentials and logarithm then cancel, so the result is a rational number whenever $a$ is rational. For example, $\\sinh(\\ln 3)$ is $\\frac{1}{2}\\left(3 - \\frac{1}{3}\\right)$, which is $\\frac{4}{3}$.\n\nCheck: $e^{\\ln 3}$ is $3$ and $e^{-\\ln 3}$ is $\\frac{1}{3}$, so half their difference is $\\frac{4}{3}$, as found.\n\n> **Watch out.** $\\sinh(\\ln a)$ is not $a$. Only $e^{\\ln a}$ simplifies to $a$; the hyperbolic sine also contains $e^{-\\ln a}$, which is $\\frac{1}{a}$.",
    "换元 $u = \\sinh x$ 给出 $\\int \\sinh x\\cosh x\\,dx = \\frac{1}{2}\\sinh^2 x + C$。在 $\\ln a$ 这样的积分限处求值时，要回到指数定义：\n\n$$\\sinh(\\ln a) = \\frac{1}{2}\\left(a - \\frac{1}{a}\\right)$$\n\n指数和对数相互抵消，所以只要 $a$ 是有理数，结果就是有理数。例如，$\\sinh(\\ln 3)$ 等于 $\\frac{1}{2}\\left(3 - \\frac{1}{3}\\right)$，即 $\\frac{4}{3}$。\n\n检验：$e^{\\ln 3}$ 等于 $3$，$e^{-\\ln 3}$ 等于 $\\frac{1}{3}$，二者之差的一半是 $\\frac{4}{3}$，与上面一致。\n\n> **注意。** $\\sinh(\\ln a)$ 不等于 $a$。只有 $e^{\\ln a}$ 化简为 $a$；双曲正弦里还有 $e^{-\\ln a}$，它等于 $\\frac{1}{a}$。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const k = rng.int(1, 12);
    const top = a * a - 1;
    const answer = Q.of(k * top * top, 8 * a * a);
    const sinhValue = Q.of(top, 2 * a);
    const coshValue = Q.of(a * a + 1, 2 * a);
    const ck = coefficientOf(k);
    return numberProblem({
      prompt: t(`Evaluate $\\int_0^{\\ln ${a}} ${ck}\\sinh x\\cosh x\\,dx$.`, `计算 $\\int_0^{\\ln ${a}} ${ck}\\sinh x\\cosh x\\,dx$。`),
      answer,
      wrong: [Q.of(k * top * top, 4 * a * a), Q.of(k * top, 2 * a), Q.of(k * top * top, 2 * a * a)],
      solution: walkThrough(
        [
          [
            ["Substitute", "换元"],
            [
              `Let $u = \\sinh x$, so $du = \\cosh x\\,dx$. The limits become $u = 0$ and $u = \\sinh(\\ln ${a})$:`,
              `令 $u = \\sinh x$，则 $du = \\cosh x\\,dx$。积分限变成 $u = 0$ 和 $u = \\sinh(\\ln ${a})$：`,
            ],
            [
              `\\int_0^{\\ln ${a}} ${ck}\\sinh x\\cosh x\\,dx = ${ck}\\int_0^{\\sinh(\\ln ${a})} u\\,du = \\frac{${k}}{2}\\sinh^2(\\ln ${a})`,
            ],
          ],
          [
            ["Evaluate the hyperbolic sine", "求双曲正弦的值"],
            ["From the exponential definition, with $e^{\\ln a} = a$:", "由指数定义，并用 $e^{\\ln a} = a$："],
            [
              `\\sinh(\\ln ${a}) = \\frac{1}{2}\\left(${a} - \\frac{1}{${a}}\\right) = ${sinhValue.toLatex()}`,
              `\\frac{${k}}{2}\\left(${sinhValue.toLatex()}\\right)^2 = ${answer.toLatex()}`,
            ],
          ],
        ],
        [
          `Use $u = \\cosh x$ instead, which gives $\\frac{${k}}{2}\\cosh^2 x$ as the antiderivative. Here $\\cosh(\\ln ${a})$ is $${coshValue.toLatex()}$ and $\\cosh 0$ is $1$:${steps(`\\frac{${k}}{2}\\left(\\left(${coshValue.toLatex()}\\right)^2 - 1\\right) = ${answer.toLatex()}`).trimEnd()}`,
          `改用 $u = \\cosh x$，原函数是 $\\frac{${k}}{2}\\cosh^2 x$。这里 $\\cosh(\\ln ${a})$ 等于 $${coshValue.toLatex()}$，$\\cosh 0$ 等于 $1$：${steps(`\\frac{${k}}{2}\\left(\\left(${coshValue.toLatex()}\\right)^2 - 1\\right) = ${answer.toLatex()}`).trimEnd()}`,
        ],
      ),
    });
  },
};

const inverseTrigDefinite: KnowledgePointDef = {
  id: "definite-integrals-giving-a-rational-multiple-of-pi",
  title: t("Definite integrals giving a rational multiple of $\\pi$", "结果为 $\\pi$ 的有理数倍的定积分"),
  explanation: t(
    "Inverse trigonometric antiderivatives evaluate to angles at familiar limits. Since $\\arcsin\\frac{1}{2}$ is $\\frac{\\pi}{6}$ and $\\arctan 1$ is $\\frac{\\pi}{4}$, integrals with these limits come out as rational multiples of $\\pi$. Remember that the arcsine form carries no extra factor from $a$, whereas the arctangent form has a factor of $\\frac{1}{a}$ in front. For example:\n\n$$\\int_0^{2} \\frac{dx}{x^2 + 4} = \\frac{1}{2}\\arctan 1 = \\frac{\\pi}{8}.$$\n\nCheck: $\\tan\\frac{\\pi}{4}$ is $1$ and $\\sin\\frac{\\pi}{6}$ is $\\frac{1}{2}$, so the two angles are right.\n\n> **Watch out.** Forgetting the factor $\\frac{1}{a}$ of the arctangent form gives $\\frac{\\pi}{4}$ instead of $\\frac{\\pi}{8}$ in the example.",
    "反三角原函数在常见积分限处的值是角度。由于 $\\arcsin\\frac{1}{2}$ 等于 $\\frac{\\pi}{6}$，$\\arctan 1$ 等于 $\\frac{\\pi}{4}$，这样的定积分结果是 $\\pi$ 的有理数倍。要记住，反正弦形式没有来自 $a$ 的额外因子，而反正切形式前面有因子 $\\frac{1}{a}$。例如：\n\n$$\\int_0^{2} \\frac{dx}{x^2 + 4} = \\frac{1}{2}\\arctan 1 = \\frac{\\pi}{8}$$\n\n检验：$\\tan\\frac{\\pi}{4}$ 等于 $1$，$\\sin\\frac{\\pi}{6}$ 等于 $\\frac{1}{2}$，所以这两个角是对的。\n\n> **注意。** 忘了反正切形式的因子 $\\frac{1}{a}$，上例就会得到 $\\frac{\\pi}{4}$，而不是 $\\frac{\\pi}{8}$。",
  ),
  generate(rng) {
    const k = rng.int(1, 12);
    const half = rng.int(1, 6);
    const a = 2 * half;
    const sine = rng.pick([true, false]);
    const integrand = sine ? `\\frac{${k}}{\\sqrt{${a * a} - x^2}}` : `\\frac{${k}}{x^2 + ${half * half}}`;
    const top = half;
    const answer = sine ? Q.of(k, 6) : Q.of(k, 4 * half);
    const ck = coefficientOf(k);
    const readOff: WalkStep = [
      ["Read off c", "读出 c"],
      [
        `The value is $${piTimes(answer)}$, so $c = ${answer.toLatex()}$.`,
        `积分值是 $${piTimes(answer)}$，所以 $c = ${answer.toLatex()}$。`,
      ],
    ];
    return numberProblem({
      prompt: t(
        `The integral $\\int_0^{${top}} ${integrand}\\,dx$ equals $c\\pi$. Find $c$.`,
        `积分 $\\int_0^{${top}} ${integrand}\\,dx$ 等于 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: sine ? [Q.of(k, 3), Q.of(k, 6 * a), Q.of(k, 4)] : [Q.of(k, 4), Q.of(k, 2 * half), Q.of(k, 6 * half)],
      solution: sine
        ? walkThrough(
            [
              [
                ["Find an antiderivative", "求原函数"],
                [
                  `The root holds $${a * a} - x^2$, so this is the arcsine form with $a = ${a}$, which has no factor $\\frac{1}{a}$:`,
                  `根号下是 $${a * a} - x^2$，所以这是 $a = ${a}$ 的反正弦形式，没有因子 $\\frac{1}{a}$：`,
                ],
                [`\\int ${integrand}\\,dx = ${ck}\\arcsin\\frac{x}{${a}} + C`],
              ],
              [
                ["Evaluate", "求值"],
                [
                  `At $x = ${top}$ the argument is $\\frac{${top}}{${a}}$, which is $\\frac{1}{2}$, and at $x = 0$ it is $0$:`,
                  `在 $x = ${top}$ 处，自变量是 $\\frac{${top}}{${a}}$，即 $\\frac{1}{2}$；在 $x = 0$ 处是 $0$：`,
                ],
                [
                  `${ck}\\left(\\arcsin\\frac{1}{2} - \\arcsin 0\\right) = ${k === 1 ? "" : `${k} \\cdot `}\\frac{\\pi}{6} = ${piTimes(answer)}`,
                ],
              ],
              readOff,
            ],
            [
              `Substitute $x = ${a}\\sin\\theta$ instead. Then $\\sqrt{${a * a} - x^2}$ is $${a}\\cos\\theta$ and $dx$ is $${a}\\cos\\theta\\,d\\theta$, so the integrand becomes $${dTheta(Q.of(k))}$. As $x$ goes from $0$ to $${top}$, $\\theta$ goes from $0$ to $\\frac{\\pi}{6}$, which gives $${piTimes(answer)}$ again.`,
              `改用代换 $x = ${a}\\sin\\theta$。则 $\\sqrt{${a * a} - x^2}$ 等于 $${a}\\cos\\theta$，$dx$ 等于 $${a}\\cos\\theta\\,d\\theta$，被积式变成 $${dTheta(Q.of(k))}$。$x$ 从 $0$ 到 $${top}$ 时，$\\theta$ 从 $0$ 到 $\\frac{\\pi}{6}$，结果同样是 $${piTimes(answer)}$。`,
            ],
          )
        : walkThrough(
            [
              [
                ["Find an antiderivative", "求原函数"],
                [
                  `The denominator is $x^2 + ${half * half}$, the arctangent form with $a = ${half}$, which has the factor $\\frac{1}{${half}}$:`,
                  `分母是 $x^2 + ${half * half}$，这是 $a = ${half}$ 的反正切形式，带有因子 $\\frac{1}{${half}}$：`,
                ],
                [`\\int ${integrand}\\,dx = ${fractionBefore(k, half)}\\arctan${half === 1 ? " x" : `\\frac{x}{${half}}`} + C`],
              ],
              [
                ["Evaluate", "求值"],
                [`At $x = ${top}$ the argument is $1$, and at $x = 0$ it is $0$:`, `在 $x = ${top}$ 处自变量是 $1$，在 $x = 0$ 处是 $0$：`],
                [
                  `${fractionBefore(k, half)}\\left(\\arctan 1 - \\arctan 0\\right) = ${Q.of(k, half).toLatex() === "1" ? "" : `${Q.of(k, half).toLatex()} \\cdot `}\\frac{\\pi}{4} = ${piTimes(answer)}`,
                ],
              ],
              readOff,
            ],
            [
              `Substitute $x = ${coefficientOf(half)}\\tan\\theta$ instead. Then $x^2 + ${half * half}$ is $${coefficientOf(half * half)}\\sec^2\\theta$ and $dx$ is $${coefficientOf(half)}\\sec^2\\theta\\,d\\theta$, so the integrand becomes $${dTheta(Q.of(k, half))}$. As $x$ goes from $0$ to $${top}$, $\\theta$ goes from $0$ to $\\frac{\\pi}{4}$, which gives $${piTimes(answer)}$ again.`,
              `改用代换 $x = ${coefficientOf(half)}\\tan\\theta$。则 $x^2 + ${half * half}$ 等于 $${coefficientOf(half * half)}\\sec^2\\theta$，$dx$ 等于 $${coefficientOf(half)}\\sec^2\\theta\\,d\\theta$，被积式变成 $${dTheta(Q.of(k, half))}$。$x$ 从 $0$ 到 $${top}$ 时，$\\theta$ 从 $0$ 到 $\\frac{\\pi}{4}$，结果同样是 $${piTimes(answer)}$。`,
            ],
          ),
    });
  },
};

const doubleAngleTwice: KnowledgePointDef = {
  id: "applying-a-double-angle-formula-twice",
  figure: calculusDrawings4["integration-using-the-double-angle-formulas#applying-a-double-angle-formula-twice"],
  title: t("Applying a double angle formula twice", "两次使用二倍角公式"),
  explanation: t(
    "A fourth power of sine or cosine needs the double angle formula twice: square the half-angle form, then reduce the $\\cos^2 2x$ that appears. Over a whole period every oscillating cosine term vanishes, so only the constant term survives. A product $\\sin^2 x\\cos^2 x$ reduces the same way, by way of $\\frac{1}{4}\\sin^2 2x$. For example, $\\sin^4 x = \\frac{1}{4} - \\frac{1}{2}\\cos 2x + \\frac{1}{4}\\cos^2 2x = \\frac{3}{8} - \\frac{1}{2}\\cos 2x + \\frac{1}{8}\\cos 4x$, so $\\int_0^{2\\pi} \\sin^4 x\\,dx = \\frac{3}{8} \\cdot 2\\pi = \\frac{3\\pi}{4}$.\n\nCheck: at $x = 0$ the reduced form gives $\\frac{3}{8} - \\frac{1}{2} + \\frac{1}{8} = 0 = \\sin^4 0$.\n\n> **Watch out.** $\\cos^2 2x$ is not a cosine term that vanishes: it averages $\\frac{1}{2}$, so $\\frac{1}{4}\\cos^2 2x$ adds $\\frac{1}{8}$ to the constant.",
    "正弦或余弦的四次幂需要两次使用二倍角公式：先把半角形式平方，再化简出现的 $\\cos^2 2x$。在一个完整周期上，每个振荡的余弦项都消失，只有常数项留下。乘积 $\\sin^2 x\\cos^2 x$ 也同样化简，先写成 $\\frac{1}{4}\\sin^2 2x$。例如，$\\sin^4 x = \\frac{1}{4} - \\frac{1}{2}\\cos 2x + \\frac{1}{4}\\cos^2 2x = \\frac{3}{8} - \\frac{1}{2}\\cos 2x + \\frac{1}{8}\\cos 4x$，所以 $\\int_0^{2\\pi} \\sin^4 x\\,dx = \\frac{3}{8} \\cdot 2\\pi = \\frac{3\\pi}{4}$。\n\n检验：在 $x = 0$ 处，化简后的式子给出 $\\frac{3}{8} - \\frac{1}{2} + \\frac{1}{8} = 0 = \\sin^4 0$。\n\n> **注意。** $\\cos^2 2x$ 不是会消失的余弦项：它的平均值是 $\\frac{1}{2}$，所以 $\\frac{1}{4}\\cos^2 2x$ 给常数项加上 $\\frac{1}{8}$。",
  ),
  generate(rng) {
    const k = rng.int(1, 40);
    const kind = rng.pick([
      {
        latex: "\\sin^4 x",
        value: Q.of(3 * k, 4),
        constant: "\\frac{3}{8}",
        first: "\\left(\\frac{1 - \\cos 2x}{2}\\right)^2 = \\frac{1}{4} - \\frac{1}{2}\\cos 2x + \\frac{1}{4}\\cos^2 2x",
        again: ["Replace $\\cos^2 2x$ by $\\frac{1 + \\cos 4x}{2}$:", "把 $\\cos^2 2x$ 换成 $\\frac{1 + \\cos 4x}{2}$："],
        reduced: "\\frac{3}{8} - \\frac{1}{2}\\cos 2x + \\frac{1}{8}\\cos 4x",
        atZero: ["\\frac{3}{8} - \\frac{1}{2} + \\frac{1}{8} = 0", "0"],
        fourth: true,
      },
      {
        latex: "\\cos^4 x",
        value: Q.of(3 * k, 4),
        constant: "\\frac{3}{8}",
        first: "\\left(\\frac{1 + \\cos 2x}{2}\\right)^2 = \\frac{1}{4} + \\frac{1}{2}\\cos 2x + \\frac{1}{4}\\cos^2 2x",
        again: ["Replace $\\cos^2 2x$ by $\\frac{1 + \\cos 4x}{2}$:", "把 $\\cos^2 2x$ 换成 $\\frac{1 + \\cos 4x}{2}$："],
        reduced: "\\frac{3}{8} + \\frac{1}{2}\\cos 2x + \\frac{1}{8}\\cos 4x",
        atZero: ["\\frac{3}{8} + \\frac{1}{2} + \\frac{1}{8} = 1", "1"],
        fourth: true,
      },
      {
        latex: "\\sin^2 x\\cos^2 x",
        value: Q.of(k, 4),
        constant: "\\frac{1}{8}",
        first: "\\left(\\frac{\\sin 2x}{2}\\right)^2 = \\frac{1}{4}\\sin^2 2x",
        again: ["Replace $\\sin^2 2x$ by $\\frac{1 - \\cos 4x}{2}$:", "把 $\\sin^2 2x$ 换成 $\\frac{1 - \\cos 4x}{2}$："],
        reduced: "\\frac{1}{8} - \\frac{1}{8}\\cos 4x",
        atZero: ["\\frac{1}{8} - \\frac{1}{8} = 0", "0"],
        fourth: false,
      },
    ] as const);
    const reason = (en: string, zh: string) => t(en, zh);
    const mistakes = kind.fourth
      ? [
          {
            value: Q.of(k, 2),
            why: reason(
              "This uses only the constant $\\frac{1}{4}$ from the first step; $\\frac{1}{4}\\cos^2 2x$ does not average to $0$ and adds $\\frac{1}{8}$.",
              "这里只用了第一步的常数 $\\frac{1}{4}$；$\\frac{1}{4}\\cos^2 2x$ 的平均值不是 $0$，还要加上 $\\frac{1}{8}$。",
            ),
          },
          {
            value: Q.of(3 * k, 8),
            why: reason(
              "The constant $\\frac{3}{8}$ must be multiplied by the length $2\\pi$ of the interval; the factor $2$ is missing.",
              "常数 $\\frac{3}{8}$ 要乘以区间长度 $2\\pi$；漏掉了因子 $2$。",
            ),
          },
          {
            value: Q.of(k),
            why: reason(
              "This uses the average $\\frac{1}{2}$ of a square; a fourth power averages $\\frac{3}{8}$.",
              "这是用了平方的平均值 $\\frac{1}{2}$；四次幂的平均值是 $\\frac{3}{8}$。",
            ),
          },
          {
            value: Q.of(k, 8),
            why: reason(
              "This keeps only the $\\frac{1}{8}$ that comes from $\\cos^2 2x$ and also forgets the length $2\\pi$.",
              "这里只保留了来自 $\\cos^2 2x$ 的 $\\frac{1}{8}$，还漏乘了长度 $2\\pi$。",
            ),
          },
        ]
      : [
          {
            value: Q.of(k, 2),
            why: reason(
              "This uses the $\\frac{1}{4}$ of $\\frac{1}{4}\\sin^2 2x$ as the constant; $\\sin^2 2x$ averages $\\frac{1}{2}$, so the constant is $\\frac{1}{8}$.",
              "这是把 $\\frac{1}{4}\\sin^2 2x$ 中的 $\\frac{1}{4}$ 当作常数项；$\\sin^2 2x$ 的平均值是 $\\frac{1}{2}$，所以常数项是 $\\frac{1}{8}$。",
            ),
          },
          {
            value: Q.of(3 * k, 8),
            why: reason(
              "$\\frac{3}{8}$ is the constant of a fourth power such as $\\sin^4 x$; for $\\sin^2 x\\cos^2 x$ it is $\\frac{1}{8}$.",
              "$\\frac{3}{8}$ 是 $\\sin^4 x$ 这类四次幂的常数项；$\\sin^2 x\\cos^2 x$ 的常数项是 $\\frac{1}{8}$。",
            ),
          },
          {
            value: Q.of(k),
            why: reason(
              "This treats $\\sin^2 x\\cos^2 x$ as if it averaged $\\frac{1}{2}$, like $\\sin^2 x$; the product averages only $\\frac{1}{8}$.",
              "这是把 $\\sin^2 x\\cos^2 x$ 当成平均值为 $\\frac{1}{2}$，像 $\\sin^2 x$ 一样；这个乘积的平均值只有 $\\frac{1}{8}$。",
            ),
          },
          {
            value: Q.of(k, 8),
            why: reason(
              "The constant $\\frac{1}{8}$ must be multiplied by the length $2\\pi$; the factor $2$ is missing.",
              "常数 $\\frac{1}{8}$ 要乘以长度 $2\\pi$；漏掉了因子 $2$。",
            ),
          },
        ];
    return numberProblem({
      prompt: t(
        `The integral $\\int_0^{2\\pi} ${coefficientOf(k)}${kind.latex}\\,dx$ equals $c\\pi$. Find $c$.`,
        `积分 $\\int_0^{2\\pi} ${coefficientOf(k)}${kind.latex}\\,dx$ 等于 $c\\pi$。求 $c$。`,
      ),
      answer: kind.value,
      mistakes,
      solution: walkThrough(
        [
          [
            ["Use the formula once", "第一次用公式"],
            ["Write the integrand with the double angle:", "用二倍角改写被积函数："],
            [`${kind.latex} = ${kind.first}`],
          ],
          [["Use it again", "再用一次"], kind.again, [`${kind.latex} = ${kind.reduced}`]],
          [
            ["Integrate over the period", "在整个周期上积分"],
            [
              "Every cosine term integrates to $0$ over $[0, 2\\pi]$, so only the constant counts:",
              "每个余弦项在 $[0, 2\\pi]$ 上积分为 $0$，所以只有常数项有贡献：",
            ],
            [
              `\\int_0^{2\\pi} ${coefficientOf(k)}${kind.latex}\\,dx = ${k} \\cdot ${kind.constant} \\cdot 2\\pi = ${kind.value.toLatex()}\\pi`,
            ],
          ],
        ],
        [
          `Test the reduced form at $x = 0$: it gives $${kind.atZero[0]}$, and $${kind.latex}$ at $0$ is also $${kind.atZero[1]}$. The constant $${kind.constant}$ is the average value, so $c = 2 \\cdot ${k} \\cdot ${kind.constant} = ${kind.value.toLatex()}$.`,
          `在 $x = 0$ 处检验化简后的式子：得 $${kind.atZero[0]}$，而 $${kind.latex}$ 在 $0$ 处也是 $${kind.atZero[1]}$。常数 $${kind.constant}$ 就是平均值，所以 $c = 2 \\cdot ${k} \\cdot ${kind.constant} = ${kind.value.toLatex()}$。`,
        ],
      ),
    });
  },
};

const cyclicImproper: KnowledgePointDef = {
  id: "a-cyclic-integral-over-an-infinite-interval",
  title: t("A cyclic integral over an infinite interval", "无穷区间上的循环积分"),
  explanation: t(
    "Integrating by parts twice brings the original integral back, which gives an equation to solve. When the exponential decays, the boundary terms at infinity vanish and only those at zero remain. The result is $\\int_0^\\infty e^{-ax}\\sin bx\\,dx = \\frac{b}{a^2 + b^2}$, and the same with a numerator of $a$ when cosine replaces sine. For example, $\\int_0^\\infty e^{-x}\\sin 2x\\,dx = \\frac{2}{5}$.\n\nCheck: as $b \\to 0$, $\\int_0^\\infty e^{-ax}\\cos bx\\,dx$ tends to $\\int_0^\\infty e^{-ax}\\,dx = \\frac{1}{a}$, and the formula gives $\\frac{a}{a^2} = \\frac{1}{a}$.\n\n> **Watch out.** Only the boundary terms at $0$ survive: $\\sin 0 = 0$ kills one and $\\cos 0 = 1$ keeps the other. Mixing them up swaps the numerators $a$ and $b$.",
    "分部积分两次后原积分又出现，于是得到一个可解的方程。指数衰减时，无穷远处的边界项消失，只留下零处的边界项。结果是 $\\int_0^\\infty e^{-ax}\\sin bx\\,dx = \\frac{b}{a^2 + b^2}$；把正弦换成余弦，分子就变成 $a$。例如，$\\int_0^\\infty e^{-x}\\sin 2x\\,dx = \\frac{2}{5}$。\n\n检验：当 $b \\to 0$ 时，$\\int_0^\\infty e^{-ax}\\cos bx\\,dx$ 趋于 $\\int_0^\\infty e^{-ax}\\,dx = \\frac{1}{a}$，而公式给出 $\\frac{a}{a^2} = \\frac{1}{a}$。\n\n> **注意。** 只有 $0$ 处的边界项留下：$\\sin 0 = 0$ 消去一个，$\\cos 0 = 1$ 保留另一个。弄混了就会把分子 $a$ 和 $b$ 对调。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = rng.int(2, 9);
    const sum = a * a + b * b;
    const sine = rng.pick([true, false]);
    const answer = Q.of(sine ? b : a, sum);
    const other = Q.of(sine ? a : b, sum);
    const trig = sine ? `\\sin ${b}x` : `\\cos ${b}x`;
    const e = `e^{-${coefficientOf(a)}x}`;
    const ratio = Q.of(b * b, a * a).toLatex();
    const rhs = sine ? Q.of(b, a * a).toLatex() : Q.of(1, a).toLatex();
    const [Is, Ic] = [Q.of(b, sum), Q.of(a, sum)];
    return numberProblem({
      prompt: t(`Evaluate $\\int_0^\\infty ${e}${trig}\\,dx$.`, `计算 $\\int_0^\\infty ${e}${trig}\\,dx$。`),
      answer,
      mistakes: [
        {
          value: other,
          why: sine
            ? t(
                `With $\\sin ${b}x$ the boundary term at $0$ vanishes, because $\\sin 0 = 0$, and the numerator is $b = ${b}$; $a$ belongs to the cosine integral.`,
                `对 $\\sin ${b}x$，$0$ 处的边界项因 $\\sin 0 = 0$ 而消失，分子是 $b = ${b}$；分子 $a$ 属于余弦的积分。`,
              )
            : t(
                `With $\\cos ${b}x$ the boundary term at $0$ is $\\frac{1}{a}$, because $\\cos 0 = 1$, and the numerator is $a = ${a}$; $b$ belongs to the sine integral.`,
                `对 $\\cos ${b}x$，$0$ 处的边界项因 $\\cos 0 = 1$ 而等于 $\\frac{1}{a}$，分子是 $a = ${a}$；分子 $b$ 属于正弦的积分。`,
              ),
        },
        {
          value: Q.of(1, sum),
          why: t(
            `Solving for $I$ leaves the numerator $${sine ? b : a}$ over $a^2 + b^2 = ${sum}$, not $1$.`,
            `解出 $I$ 后分子是 $${sine ? b : a}$，分母是 $a^2 + b^2 = ${sum}$，分子不是 $1$。`,
          ),
        },
        {
          value: Q.of(sine ? b : a, a + b),
          why: t(
            "The denominator is $a^2 + b^2$, not $a + b$: it comes from $1 + \\frac{b^2}{a^2}$.",
            "分母是 $a^2 + b^2$，不是 $a + b$：它来自 $1 + \\frac{b^2}{a^2}$。",
          ),
        },
      ],
      solution: walkThrough(
        [
          [
            ["First round", "第一次分部积分"],
            sine
              ? [
                  `Take $u = \\sin ${b}x$ and $dv = ${e}\\,dx$. The boundary term vanishes at both ends, since $${e} \\to 0$ at infinity and $\\sin 0 = 0$:`,
                  `取 $u = \\sin ${b}x$，$dv = ${e}\\,dx$。边界项在两端都为零，因为在无穷远处 $${e} \\to 0$，而 $\\sin 0 = 0$：`,
                ]
              : [
                  `Take $u = \\cos ${b}x$ and $dv = ${e}\\,dx$. At infinity the boundary term vanishes; at $0$ it is $\\frac{1}{${a}}$, since $\\cos 0 = 1$:`,
                  `取 $u = \\cos ${b}x$，$dv = ${e}\\,dx$。无穷远处的边界项为零；$0$ 处的边界项是 $\\frac{1}{${a}}$，因为 $\\cos 0 = 1$：`,
                ],
            [
              sine
                ? `I = ${Q.of(b, a).toLatex()}\\int_0^\\infty ${e}\\cos ${b}x\\,dx`
                : `I = ${Q.of(1, a).toLatex()} - ${Q.of(b, a).toLatex()}\\int_0^\\infty ${e}\\sin ${b}x\\,dx`,
            ],
          ],
          [
            ["Second round", "第二次分部积分"],
            ["Integrate by parts again in the same way; the original integral returns:", "用同样的方法再分部积分一次，原积分又出现了："],
            [`I = ${rhs} - ${ratio}I`],
          ],
          [
            ["Solve for I", "解出 I"],
            [`Add $${ratio}I$ to both sides and divide:`, `两边加上 $${ratio}I$，再相除：`],
            [`\\left(1 + ${ratio}\\right)I = ${rhs}`, `I = \\frac{${sine ? b : a}}{${sum}} = ${answer.toLatex()}`],
          ],
        ],
        [
          `One round of parts on the cosine integral gives $aI_{\\cos} + bI_{\\sin} = 1$. With $I_{\\sin} = ${Is.toLatex()}$ and $I_{\\cos} = ${Ic.toLatex()}$: $${a} \\cdot ${Ic.toLatex()} + ${b} \\cdot ${Is.toLatex()} = \\frac{${a * a} + ${b * b}}{${sum}} = 1$.`,
          `对余弦的积分做一次分部积分，得 $aI_{\\cos} + bI_{\\sin} = 1$。代入 $I_{\\sin} = ${Is.toLatex()}$，$I_{\\cos} = ${Ic.toLatex()}$：$${a} \\cdot ${Ic.toLatex()} + ${b} \\cdot ${Is.toLatex()} = \\frac{${a * a} + ${b * b}}{${sum}} = 1$。`,
        ],
      ),
    });
  },
};

const tabularValue: KnowledgePointDef = {
  id: "the-polynomial-factor-of-a-tabular-integral",
  title: t("The polynomial factor of a tabular integral", "表格法积分的多项式因子"),
  explanation: t(
    "For $\\int x^ne^x\\,dx$, the tabular method keeps differentiating the power while the exponential stays unchanged, with alternating signs. So the result is $e^x$ times the polynomial $x^n - nx^{n-1} + n(n-1)x^{n-2} - \\dots$, the terms being successive derivatives of $x^n$. A question about one value of this polynomial tests the entire table. For example, $\\int x^3e^x\\,dx = e^x(x^3 - 3x^2 + 6x - 6) + C$.\n\nCheck: $\\frac{d}{dx}\\left(e^xP(x)\\right) = e^x\\left(P(x) + P'(x)\\right)$, and here $P + P' = x^3$, since the other terms cancel in pairs.\n\n> **Watch out.** The signs alternate, and the table runs until the derivative is a constant: the last term is $\\pm n!$.",
    "对 $\\int x^ne^x\\,dx$，表格法不断对幂函数求导，指数函数保持不变，符号交替。所以结果是 $e^x$ 乘以多项式 $x^n - nx^{n-1} + n(n-1)x^{n-2} - \\dots$，各项是 $x^n$ 的逐阶导数。问这个多项式的一个值，就是在检验整张表。例如，$\\int x^3e^x\\,dx = e^x(x^3 - 3x^2 + 6x - 6) + C$。\n\n检验：$\\frac{d}{dx}\\left(e^xP(x)\\right) = e^x\\left(P(x) + P'(x)\\right)$，这里 $P + P' = x^3$，其余各项两两相消。\n\n> **注意。** 符号交替，而且表格要做到导数为常数为止：最后一项是 $\\pm n!$。",
  ),
  generate(rng) {
    const n = rng.int(2, 4);
    const m = nonzero(rng, 6);
    const coefficients = [...Array(n + 1).keys()].map((j) => factorial(n) / factorial(n - j));
    const signedValue = coefficients.reduce((sum, c, j) => sum + (j % 2 === 0 ? c : -c) * m ** (n - j), 0);
    const plainValue = coefficients.reduce((sum, c, j) => sum + c * m ** (n - j), 0);
    const derivativeValue = coefficients.reduce(
      (sum, c, j) => sum + (n - j === 0 ? 0 : (j % 2 === 0 ? c : -c) * (n - j) * m ** (n - j - 1)),
      0,
    );
    const last = (n % 2 === 0 ? 1 : -1) * factorial(n);
    const xPower = (e: number) => (e === 0 ? "" : e === 1 ? "x" : `x^${e}`);
    const terms = coefficients.map((c, j): [number, string] => [j % 2 === 0 ? c : -c, xPower(n - j)]);
    const P = poly(...terms);
    const rows = coefficients.map((c, j) => `$${poly([c, xPower(n - j)])}$`).join(", ");
    const substituted = coefficients
      .map((c, j) => {
        const e = n - j;
        const body = e === 0 ? `${c}` : `${c === 1 ? "" : `${c} \\cdot `}${inParens(m)}${e === 1 ? "" : `^{${e}}`}`;
        return j === 0 ? body : `${j % 2 === 0 ? "+" : "-"} ${body}`;
      })
      .join(" ");
    return numberProblem({
      prompt: t(
        `Write $\\int x^{${n}}e^x\\,dx = e^xP(x) + C$, where $P$ is a polynomial. Find $P(${m})$.`,
        `写成 $\\int x^{${n}}e^x\\,dx = e^xP(x) + C$，其中 $P$ 是多项式。求 $P(${m})$。`,
      ),
      answer: signedValue,
      form: "integer",
      mistakes: [
        {
          value: plainValue,
          why: t(
            "The signs must alternate, $+, -, +, \\dots$; here every term was added.",
            "符号必须交替为 $+, -, +, \\dots$；这里每一项都加上了。",
          ),
        },
        {
          value: m ** n,
          why: t(
            `This keeps only the first term $x^{${n}}$; the other rows of the table add the lower terms.`,
            `这里只保留了第一项 $x^{${n}}$；表格的其他各行还会给出较低次的项。`,
          ),
        },
        {
          value: signedValue - last,
          why: t(
            `The table stopped one row early: the constant term $${last}$, which is $${n % 2 === 0 ? "" : "-"}${n}!$, is missing.`,
            `表格少做了一行：漏掉了常数项 $${last}$，即 $${n % 2 === 0 ? "" : "-"}${n}!$。`,
          ),
        },
      ],
      solution: walkThrough(
        [
          [
            ["Build the table", "列表"],
            [
              `Differentiate $x^{${n}}$ down to a constant: ${rows}. Every integral of $e^x$ is $e^x$.`,
              `把 $x^{${n}}$ 逐次求导到常数：${rows}。$e^x$ 的每次积分都是 $e^x$。`,
            ],
          ],
          [["Add with alternating signs", "交替符号相加"], ["The diagonals give:", "对角线乘积相加得："], [`P(x) = ${P}`]],
          [["Substitute", "代入"], [`Put in $x = ${m}$:`, `代入 $x = ${m}$：`], [`P(${m}) = ${substituted} = ${signedValue}`]],
        ],
        [
          `Since $\\frac{d}{dx}(e^xP) = e^x(P + P')$, we need $P + P' = x^{${n}}$. At $x = ${m}$: $P'(${m}) = ${derivativeValue}$, and $${signedValue} + ${inParens(derivativeValue)} = ${m ** n}$, which is $${inParens(m)}^{${n}}$.`,
          `由于 $\\frac{d}{dx}(e^xP) = e^x(P + P')$，应有 $P + P' = x^{${n}}$。在 $x = ${m}$ 处：$P'(${m}) = ${derivativeValue}$，而 $${signedValue} + ${inParens(derivativeValue)} = ${m ** n}$，正是 $${inParens(m)}^{${n}}$。`,
        ],
      ),
    });
  },
};

const improperPartialFractions: KnowledgePointDef = {
  id: "an-improper-integral-by-partial-fractions",
  title: t("An improper integral by partial fractions", "用部分分式求反常积分"),
  explanation: t(
    "Each partial fraction alone gives a logarithm that diverges at infinity, so combine them before taking the limit. The partial fractions are\n\n$$\\frac{1}{x(x + a)} = \\frac{1}{a}\\left(\\frac{1}{x} - \\frac{1}{x + a}\\right)$$\n\nSo an antiderivative is $\\frac{1}{a}\\ln\\frac{x}{x + a}$, and $\\frac{x}{x + a} \\to 1$, so its value at infinity is $\\ln 1$, which is $0$. For example, $\\int_1^\\infty \\frac{1}{x(x + 1)}\\,dx$ is $0 - \\ln\\frac{1}{2}$, which is $\\ln 2$.\n\nCheck: $\\frac{1}{x(x + 1)} < \\frac{1}{x^{2}}$ for $x \\ge 1$, and $\\int_1^\\infty x^{-2}\\,dx$ is $1$, so the value must be below $1$; $\\ln 2$ is about $0.69$.\n\n> **Watch out.** Do not split the improper integral into $\\int_1^\\infty \\frac{1}{x}\\,dx$ minus $\\int_1^\\infty \\frac{1}{x + a}\\,dx$: both diverge, and a difference of two infinite quantities has no value.",
    "每个部分分式单独积分都得到在无穷远处发散的对数，所以要先合并，再取极限。由\n\n$$\\frac{1}{x(x + a)} = \\frac{1}{a}\\left(\\frac{1}{x} - \\frac{1}{x + a}\\right)$$\n\n原函数为 $\\frac{1}{a}\\ln\\frac{x}{x + a}$，而 $\\frac{x}{x + a} \\to 1$，所以它在无穷远处的值是 $\\ln 1$，即 $0$。例如 $\\int_1^\\infty \\frac{1}{x(x + 1)}\\,dx$ 等于 $0 - \\ln\\frac{1}{2}$，即 $\\ln 2$。\n\n检验：当 $x \\ge 1$ 时 $\\frac{1}{x(x + 1)} < \\frac{1}{x^{2}}$，而 $\\int_1^\\infty x^{-2}\\,dx$ 等于 $1$，所以积分值应小于 $1$；$\\ln 2$ 约为 $0.69$。\n\n> **注意。** 不能把反常积分拆成 $\\int_1^\\infty \\frac{1}{x}\\,dx$ 减去 $\\int_1^\\infty \\frac{1}{x + a}\\,dx$：两者都发散，两个无穷大之差没有确定的值。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const k = rng.int(1, 9);
    const answer = Q.of(k, a);
    const front = coefQ(answer);
    const f = `\\frac{${k}}{x(x + ${a})}`;
    const back =
      k === a
        ? t("which is the integrand.", "正是被积函数。")
        : t(`and multiplying by $${answer.toLatex()}$ gives back $${f}$.`, `乘以 $${answer.toLatex()}$ 就得到 $${f}$。`);
    return numberProblem({
      prompt: t(
        `The integral $\\int_1^\\infty \\frac{${k}}{x(x + ${a})}\\,dx$ equals $c\\ln ${a + 1}$. Find $c$.`,
        `积分 $\\int_1^\\infty \\frac{${k}}{x(x + ${a})}\\,dx$ 等于 $c\\ln ${a + 1}$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(k), answer.neg(), Q.of(k, a + 1)],
      solution: walkThrough(
        [
          [
            ["Split into partial fractions", "拆成部分分式"],
            ["The cover-up gives the two coefficients:", "用掩盖法得到两个系数："],
            [`${f} = ${front}\\left(\\frac{1}{x} - \\frac{1}{x + ${a}}\\right)`],
          ],
          [
            ["Integrate up to t", "积到 t"],
            ["Combine the two logarithms into one before going further:", "先把两个对数合并成一个："],
            [
              `\\int_1^t ${f}\\,dx = ${front}\\left[\\ln\\frac{x}{x + ${a}}\\right]_1^t`,
              `= ${front}\\left(\\ln\\frac{t}{t + ${a}} - \\ln\\frac{1}{${a + 1}}\\right)`,
            ],
          ],
          [
            ["Take the limit", "取极限"],
            [
              `As $t \\to \\infty$, $\\frac{t}{t + ${a}} \\to 1$, so its logarithm tends to $0$, and $-\\ln\\frac{1}{${a + 1}}$ is $\\ln ${a + 1}$:`,
              `当 $t \\to \\infty$ 时，$\\frac{t}{t + ${a}} \\to 1$，它的对数趋于 $0$，而 $-\\ln\\frac{1}{${a + 1}}$ 等于 $\\ln ${a + 1}$：`,
            ],
            [`\\int_1^\\infty ${f}\\,dx = ${front}\\ln ${a + 1}`, `c = ${answer.toLatex()}`],
          ],
        ],
        [
          `Differentiate the antiderivative. The derivative of $\\ln\\frac{x}{x + ${a}}$ is $\\frac{1}{x} - \\frac{1}{x + ${a}}$, which is $\\frac{${a}}{x(x + ${a})}$, ${back.en}`,
          `对原函数求导。$\\ln\\frac{x}{x + ${a}}$ 的导数是 $\\frac{1}{x} - \\frac{1}{x + ${a}}$，即 $\\frac{${a}}{x(x + ${a})}$，${back["zh-CN"]}`,
        ],
      ),
    });
  },
};

const overCubedFactor: KnowledgePointDef = {
  id: "a-numerator-over-a-cubed-linear-factor",
  title: t("A numerator over a cubed linear factor", "分母为线性因子立方的积分"),
  explanation: t(
    "A linear factor repeated three times normally gives partial fractions up to the third power. When the numerator is $x$, writing it as $(x + a) - a$ gives the decomposition at once:\n\n$$\\frac{x}{(x + a)^{3}} = \\frac{1}{(x + a)^{2}} - \\frac{a}{(x + a)^{3}}$$\n\nBoth pieces are negative powers of $x + a$ and integrate with no logarithms. From $0$ to $\\infty$ they give $\\frac{1}{a}$ and $\\frac{1}{2a}$, so the integral of $\\frac{x}{(x + a)^{3}}$ over $[0, \\infty)$ is $\\frac{1}{2a}$. For example, with $a = 1$ the value is $\\frac{1}{2}$.\n\nCheck: with $a = 1$, $\\int_0^\\infty (x + 1)^{-2}\\,dx$ is $1$ and $\\int_0^\\infty (x + 1)^{-3}\\,dx$ is $\\frac{1}{2}$; their difference is $\\frac{1}{2}$.\n\n> **Watch out.** The second piece keeps the factor $a$ in its numerator: $\\int_0^\\infty \\frac{a}{(x + a)^{3}}\\,dx$ is $a \\cdot \\frac{1}{2a^{2}}$, which is $\\frac{1}{2a}$, not $\\frac{1}{2a^{2}}$.",
    "重复三次的线性因子，一般分解出直到三次幂的部分分式。分子是 $x$ 时，把它写成 $(x + a) - a$，就立刻得到分解：\n\n$$\\frac{x}{(x + a)^{3}} = \\frac{1}{(x + a)^{2}} - \\frac{a}{(x + a)^{3}}$$\n\n两部分都是 $x + a$ 的负幂，积分时完全不出现对数。从 $0$ 积到 $\\infty$，它们分别得 $\\frac{1}{a}$ 和 $\\frac{1}{2a}$，所以 $\\frac{x}{(x + a)^{3}}$ 在 $[0, \\infty)$ 上的积分是 $\\frac{1}{2a}$。例如 $a = 1$ 时积分值为 $\\frac{1}{2}$。\n\n检验：$a = 1$ 时，$\\int_0^\\infty (x + 1)^{-2}\\,dx$ 等于 $1$，$\\int_0^\\infty (x + 1)^{-3}\\,dx$ 等于 $\\frac{1}{2}$，两者之差为 $\\frac{1}{2}$。\n\n> **注意。** 第二部分的分子保留因子 $a$：$\\int_0^\\infty \\frac{a}{(x + a)^{3}}\\,dx$ 等于 $a \\cdot \\frac{1}{2a^{2}}$，即 $\\frac{1}{2a}$，而不是 $\\frac{1}{2a^{2}}$。",
  ),
  generate(rng) {
    const a = rng.int(1, 12);
    const k = rng.int(1, 9);
    const answer = Q.of(k, 2 * a);
    const first = Q.of(1, a).toLatex();
    const second = Q.of(1, 2 * a).toLatex();
    const K = coefficientOf(k);
    const split = `\\frac{1}{(x + ${a})^{2}} - \\frac{${a}}{(x + ${a})^{3}}`;
    const byU = [
      `\\int_{${a}}^{\\infty} \\frac{u - ${a}}{u^{3}}\\,du = \\left[-\\frac{1}{u} + \\frac{${a}}{2u^{2}}\\right]_{${a}}^{\\infty} = ${second}`,
    ];
    if (k !== 1) byU.push(`${k} \\cdot ${second} = ${answer.toLatex()}`);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^\\infty \\frac{${K}x}{(x + ${a})^3}\\,dx$.`,
        `计算 $\\int_0^\\infty \\frac{${K}x}{(x + ${a})^3}\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(k, a), Q.of(k, 2 * a * a), Q.of(k, 3 * a)],
      solution: walkThrough(
        [
          [
            ["Split the fraction", "拆开分式"],
            [`Write $x$ as $(x + ${a}) - ${a}$:`, `把 $x$ 写成 $(x + ${a}) - ${a}$：`],
            [`\\frac{${K}x}{(x + ${a})^{3}} = ${k === 1 ? split : `${K}\\left(${split}\\right)`}`],
          ],
          [
            ["Integrate each piece", "分别积分"],
            [
              `Each piece is a power of $x + ${a}$, and both antiderivatives tend to $0$ as $x \\to \\infty$:`,
              `每一部分都是 $x + ${a}$ 的幂，两个原函数在 $x \\to \\infty$ 时都趋于 $0$：`,
            ],
            [
              `\\int_0^\\infty \\frac{1}{(x + ${a})^{2}}\\,dx = \\left[-\\frac{1}{x + ${a}}\\right]_0^\\infty = ${first}`,
              `\\int_0^\\infty \\frac{${a}}{(x + ${a})^{3}}\\,dx = \\left[-\\frac{${a}}{2(x + ${a})^{2}}\\right]_0^\\infty = ${second}`,
            ],
          ],
          [
            ["Combine", "合并"],
            k === 1
              ? ["Subtract the second from the first:", "用第一部分减去第二部分："]
              : ["Subtract the second from the first and multiply by the constant in front:", "用第一部分减去第二部分，再乘以前面的常数："],
            [k === 1 ? `${first} - ${second} = ${answer.toLatex()}` : `${K}\\left(${first} - ${second}\\right) = ${answer.toLatex()}`],
          ],
        ],
        [
          `Substitute $u = x + ${a}$ instead, so $x = u - ${a}$ and $u$ runs from $${a}$ to $\\infty$:${steps(...byU).trimEnd()}`,
          `改用代换 $u = x + ${a}$，则 $x = u - ${a}$，$u$ 从 $${a}$ 变到 $\\infty$：${steps(...byU).trimEnd()}`,
        ],
      ),
    });
  },
};

const evenOverRealLine: KnowledgePointDef = {
  id: "doubling-an-even-integrand-over-the-real-line",
  title: t("Doubling an even integrand over the real line", "实轴上偶函数积分加倍"),
  explanation: t(
    "An integral over the whole real line is split at a finite point, and for an even integrand the two halves are equal:\n\n$$\\int_{-\\infty}^{\\infty} f(x)\\,dx = 2\\int_{0}^{\\infty} f(x)\\,dx$$\n\nOn the positive half $|x| = x$, so the absolute value disappears, and a substitution such as $u = ax^{2}$ finishes the calculation. For example, $\\int_{-\\infty}^{\\infty} |x|e^{-x^{2}}\\,dx$ is $2 \\cdot \\frac{1}{2}$, which is $1$.\n\nCheck: $\\int_0^t xe^{-x^{2}}\\,dx$ is $\\frac{1}{2} - \\frac{1}{2}e^{-t^{2}}$, which tends to $\\frac{1}{2}$, the value of each half.\n\n> **Watch out.** Do not drop the absolute value and integrate $xe^{-ax^{2}}$ over the whole line: that integrand is odd and gives $0$, while $|x|e^{-ax^{2}}$ is never negative.",
    "实轴上的积分要在某个有限点分开；对偶函数，两半相等：\n\n$$\\int_{-\\infty}^{\\infty} f(x)\\,dx = 2\\int_{0}^{\\infty} f(x)\\,dx$$\n\n在正半轴上 $|x| = x$，绝对值就去掉了，再用 $u = ax^{2}$ 这样的换元就能算完。例如 $\\int_{-\\infty}^{\\infty} |x|e^{-x^{2}}\\,dx$ 等于 $2 \\cdot \\frac{1}{2}$，即 $1$。\n\n检验：$\\int_0^t xe^{-x^{2}}\\,dx$ 等于 $\\frac{1}{2} - \\frac{1}{2}e^{-t^{2}}$，趋于 $\\frac{1}{2}$，正是每一半的值。\n\n> **注意。** 不能去掉绝对值后在整条实轴上积分 $xe^{-ax^{2}}$：那个被积函数是奇函数，积分为 $0$，而 $|x|e^{-ax^{2}}$ 从不为负。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const k = rng.int(1, 12);
    const answer = Q.of(k, a);
    const half = Q.of(k, 2 * a);
    const K = coefficientOf(k);
    const A = coefficientOf(a);
    const derivative = `\\frac{d}{dx}\\left[${coefQ(half.neg())}e^{-${A}x^{2}}\\right] = ${K}xe^{-${A}x^{2}}`;
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_{-\\infty}^\\infty ${K}|x|e^{-${A}x^2}\\,dx$.`,
        `计算 $\\int_{-\\infty}^\\infty ${K}|x|e^{-${A}x^2}\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(2 * k, a), Q.of(k, 2 * a), Q.of(0)],
      solution: walkThrough(
        [
          [
            ["Use the symmetry", "利用对称性"],
            ["The integrand is even, and $|x| = x$ for $x \\ge 0$:", "被积函数是偶函数，且当 $x \\ge 0$ 时 $|x| = x$："],
            [`\\int_{-\\infty}^\\infty ${K}|x|e^{-${A}x^2}\\,dx = 2\\int_0^\\infty ${K}xe^{-${A}x^2}\\,dx`],
          ],
          [
            ["Substitute", "换元"],
            [
              `Let $u = ${A}x^{2}$, so $du = ${2 * a}x\\,dx$ and $u$ runs from $0$ to $\\infty$:`,
              `令 $u = ${A}x^{2}$，则 $du = ${2 * a}x\\,dx$，$u$ 从 $0$ 变到 $\\infty$：`,
            ],
            [`\\int_0^\\infty ${K}xe^{-${A}x^2}\\,dx = ${coefQ(half)}\\int_0^\\infty e^{-u}\\,du = ${half.toLatex()}`],
          ],
          [
            ["Double the half", "把一半加倍"],
            ["The two halves are equal:", "两半相等："],
            [`2 \\cdot ${half.toLatex()} = ${answer.toLatex()}`],
          ],
        ],
        [
          `On $[0, \\infty)$ an antiderivative is $${coefQ(half.neg())}e^{-${A}x^{2}}$, as differentiating shows; it rises from $-${half.toLatex()}$ at $0$ to $0$ at infinity, so each half is $${half.toLatex()}$:${steps(derivative).trimEnd()}`,
          `在 $[0, \\infty)$ 上，原函数是 $${coefQ(half.neg())}e^{-${A}x^{2}}$，求导即可验证；它从 $0$ 处的 $-${half.toLatex()}$ 增加到无穷远处的 $0$，所以每一半都是 $${half.toLatex()}$：${steps(derivative).trimEnd()}`,
        ],
      ),
    });
  },
};

const unboundedAtTop: KnowledgePointDef = {
  id: "an-integrand-unbounded-at-the-upper-limit",
  title: t("An integrand unbounded at the upper limit", "在上限处无界的被积函数"),
  explanation: t(
    "An integrand may blow up at the upper limit rather than the lower one, and then the limit is taken from the left:\n\n$$\\int_{0}^{a} f(x)\\,dx = \\lim_{t \\to a^{-}} \\int_{0}^{t} f(x)\\,dx$$\n\nFor $\\frac{x}{\\sqrt{a^{2} - x^{2}}}$ the numerator is what the substitution $u = a^{2} - x^{2}$ needs, and the antiderivative $-\\sqrt{a^{2} - x^{2}}$ stays finite as $x \\to a^{-}$, so the integral converges. For example, $\\int_0^{3} \\frac{x}{\\sqrt{9 - x^{2}}}\\,dx$ is $0 - (-3)$, which is $3$.\n\nCheck: the derivative of $-\\sqrt{9 - x^{2}}$ is $\\frac{x}{\\sqrt{9 - x^{2}}}$, the integrand.\n\n> **Watch out.** The integrand is not defined at $x = a$, so the integral is a limit from the left. Plugging $x = a$ into the antiderivative gives the right number here only because the antiderivative is continuous there.",
    "被积函数也可能在上限而不是下限处趋于无穷，这时从左侧取极限：\n\n$$\\int_{0}^{a} f(x)\\,dx = \\lim_{t \\to a^{-}} \\int_{0}^{t} f(x)\\,dx$$\n\n对 $\\frac{x}{\\sqrt{a^{2} - x^{2}}}$，分子恰好是换元 $u = a^{2} - x^{2}$ 所需要的，原函数 $-\\sqrt{a^{2} - x^{2}}$ 在 $x \\to a^{-}$ 时保持有限，所以积分收敛。例如 $\\int_0^{3} \\frac{x}{\\sqrt{9 - x^{2}}}\\,dx$ 等于 $0 - (-3)$，即 $3$。\n\n检验：$-\\sqrt{9 - x^{2}}$ 的导数是 $\\frac{x}{\\sqrt{9 - x^{2}}}$，正是被积函数。\n\n> **注意。** 被积函数在 $x = a$ 处没有定义，所以积分是从左侧取的极限。这里把 $x = a$ 代入原函数能得到正确的数，只是因为原函数在那里连续。",
  ),
  generate(rng) {
    const a = rng.int(1, 12);
    const k = rng.int(1, 9);
    const answer = k * a;
    const K = coefficientOf(k);
    const f = `\\frac{${K}x}{\\sqrt{${a * a} - x^2}}`;
    const I = `\\int_0^{${a}} ${f}\\,dx`;
    const A = coefficientOf(a);
    return numberProblem({
      prompt: t(`Evaluate $${I}$.`, `计算 $${I}$。`),
      answer,
      form: "integer",
      wrong: [k * a * a, 2 * k * a, k],
      solution: walkThrough(
        [
          [
            ["Write the integral as a limit", "把积分写成极限"],
            [
              `The integrand is unbounded as $x \\to ${a}^{-}$, so stop at $t < ${a}$ and let $t \\to ${a}^{-}$:`,
              `被积函数在 $x \\to ${a}^{-}$ 时无界，所以积到 $t < ${a}$，再令 $t \\to ${a}^{-}$：`,
            ],
            [`${I} = \\lim_{t \\to ${a}^{-}} \\int_0^{t} ${f}\\,dx`],
          ],
          [
            ["Find an antiderivative", "求原函数"],
            [
              `With $u = ${a * a} - x^{2}$, $du = -2x\\,dx$, and the integral of $u^{-1/2}$ is $2u^{1/2}$:`,
              `令 $u = ${a * a} - x^{2}$，则 $du = -2x\\,dx$，而 $u^{-1/2}$ 的积分是 $2u^{1/2}$：`,
            ],
            [`\\int ${f}\\,dx = -${K}\\sqrt{${a * a} - x^{2}} + C`],
          ],
          [
            ["Take the limit", "取极限"],
            [
              `At $x = 0$ the antiderivative is $-${answer}$, and as $t \\to ${a}^{-}$ the root tends to $0$:`,
              `原函数在 $x = 0$ 处为 $-${answer}$；当 $t \\to ${a}^{-}$ 时，根号趋于 $0$：`,
            ],
            [`${I} = \\lim_{t \\to ${a}^{-}}\\left(-${K}\\sqrt{${a * a} - t^{2}} + ${answer}\\right) = ${answer}`],
          ],
        ],
        [
          `Substitute $x = ${A}\\sin\\theta$ instead. Then $\\sqrt{${a * a} - x^{2}} = ${A}\\cos\\theta$ and $dx = ${A}\\cos\\theta\\,d\\theta$, and $\\theta$ runs from $0$ to $\\frac{\\pi}{2}$:${steps(`${I} = \\int_0^{\\pi/2} ${coefficientOf(answer)}\\sin\\theta\\,d\\theta = ${answer}`).trimEnd()}`,
          `改用代换 $x = ${A}\\sin\\theta$。则 $\\sqrt{${a * a} - x^{2}} = ${A}\\cos\\theta$，$dx = ${A}\\cos\\theta\\,d\\theta$，$\\theta$ 从 $0$ 变到 $\\frac{\\pi}{2}$：${steps(`${I} = \\int_0^{\\pi/2} ${coefficientOf(answer)}\\sin\\theta\\,d\\theta = ${answer}`).trimEnd()}`,
        ],
      ),
    });
  },
};

const massShare: KnowledgePointDef = {
  id: "the-point-that-cuts-off-a-share-of-the-mass",
  title: t("The point that cuts off a share of the mass", "截取一定比例质量的位置"),
  explanation: t(
    "On a rod with density $kx$, the mass from 0 to $m$ is $\\frac{km^2}{2}$, which grows with the square of the position. So the share of the mass up to $m$ is $\\left(\\frac{m}{L}\\right)^2$, and the constant $k$ cancels. To cut off a given share, take a square root rather than dividing the rod in proportion. For example, a rod on $[0, 10]$ with density $2x$ has mass $100$, and $[0, m]$ holds $m^2$; for a quarter of the mass, $m^2 = 25$ and $m = 5$.\n\nCheck: $\\int_0^5 2x\\,dx = 25$, which is $\\frac{1}{4}$ of $100$.\n\n> **Watch out.** Half the length does not hold half the mass: with density $kx$ the first half of the rod holds only $\\frac{1}{4}$ of it.",
    "在密度为 $kx$ 的杆上，从 0 到 $m$ 的质量是 $\\frac{km^2}{2}$，随位置的平方增长。所以到 $m$ 为止的质量比例是 $\\left(\\frac{m}{L}\\right)^2$，常数 $k$ 被约去。要截取给定比例，就要开平方，而不是按比例分割杆。例如，$[0, 10]$ 上密度为 $2x$ 的杆质量为 $100$，$[0, m]$ 上的质量为 $m^2$；要截取四分之一的质量，$m^2 = 25$，$m = 5$。\n\n检验：$\\int_0^5 2x\\,dx = 25$，正是 $100$ 的 $\\frac{1}{4}$。\n\n> **注意。** 一半的长度并不含一半的质量：密度为 $kx$ 时，杆的前一半只含 $\\frac{1}{4}$ 的质量。",
  ),
  generate(rng) {
    const q = rng.int(2, 5);
    const p = rng.int(1, q - 1);
    const n = rng.int(1, 6);
    const k = rng.int(2, 9);
    const L = q * n;
    const answer = p * n;
    const share = Q.of(p * p, q * q);
    const [part, whole] = [Q.of(k * answer * answer, 2), Q.of(k * L * L, 2)];
    return numberProblem({
      prompt: t(
        `A rod on $[0, ${L}]$ has density $${k}x$. At what position $m$ does $[0, m]$ hold $${share.toLatex()}$ of the rod's mass?`,
        `$[0, ${L}]$ 上的杆，密度是 $${k}x$。在什么位置 $m$，$[0, m]$ 含有杆的质量的 $${share.toLatex()}$？`,
      ),
      answer,
      mistakes: [
        {
          value: Q.of(L * p * p, q * q),
          why: t(
            "This divides the rod in proportion to the share, as if the density were constant; the mass up to $m$ grows with $m^2$.",
            "这是按比例分割杆，好像密度是常数；到 $m$ 为止的质量随 $m^2$ 增长。",
          ),
        },
        {
          value: Q.of(L, 2),
          why: t(
            `This is the midpoint; the density grows along the rod, so $[0, ${Q.of(L, 2).toLatex()}]$ holds only $\\frac{1}{4}$ of the mass.`,
            `这是中点；密度沿杆增大，所以 $[0, ${Q.of(L, 2).toLatex()}]$ 只含 $\\frac{1}{4}$ 的质量。`,
          ),
        },
        {
          value: Q.of(L - answer),
          why: t(
            `This measures $${answer}$ back from the heavy end at $x = ${L}$; the share is of $[0, m]$, measured from $x = 0$.`,
            `这是从重的一端 $x = ${L}$ 往回量 $${answer}$；所求的是 $[0, m]$ 的比例，要从 $x = 0$ 量起。`,
          ),
        },
      ],
      solution: walkThrough(
        [
          [
            ["Write the masses", "写出质量"],
            ["The mass up to $m$ and the whole mass are:", "到 $m$ 为止的质量和总质量为："],
            [`\\int_0^m ${k}x\\,dx = ${coefQ(Q.of(k, 2))}m^2, \\quad \\int_0^{${L}} ${k}x\\,dx = ${whole.toLatex()}`],
          ],
          [
            ["Set the share and take the root", "令比例相等并开方"],
            [
              `Their ratio is $\\left(\\frac{m}{${L}}\\right)^2$, and $${k}$ cancels:`,
              `二者之比为 $\\left(\\frac{m}{${L}}\\right)^2$，$${k}$ 约去了：`,
            ],
            [
              `\\left(\\frac{m}{${L}}\\right)^2 = ${share.toLatex()} \\implies \\frac{m}{${L}} = ${Q.of(p, q).toLatex()} \\implies m = ${answer}`,
            ],
          ],
        ],
        [
          `The mass on $[0, ${answer}]$ is $\\int_0^{${answer}} ${k}x\\,dx = ${part.toLatex()}$ out of $${whole.toLatex()}$, and $\\frac{${part.toLatex()}}{${whole.toLatex()}} = ${share.toLatex()}$.`,
          `$[0, ${answer}]$ 上的质量是 $\\int_0^{${answer}} ${k}x\\,dx = ${part.toLatex()}$，总质量是 $${whole.toLatex()}$，而 $\\frac{${part.toLatex()}}{${whole.toLatex()}} = ${share.toLatex()}$。`,
        ],
      ),
    });
  },
};

const pappusVolume: KnowledgePointDef = {
  id: "the-volume-of-a-torus-from-the-theorem-of-pappus",
  figure:
    calculusDrawings4[
      "volumes-of-revolution-using-the-washer-method-rotation-about-other-axes#the-volume-of-a-torus-from-the-theorem-of-pappus"
    ],
  title: t("The volume of a torus from the theorem of Pappus", "用帕普斯定理求环体的体积"),
  explanation: t(
    "The theorem of Pappus says that rotating a region about an outside axis gives a volume equal to the region's area times the distance travelled by its centroid. A disk's centroid is its centre, so a disk of radius $r$ whose centre is at distance $R$ from the axis sweeps out a torus of volume\n\n$$V = \\pi r^{2} \\cdot 2\\pi R = 2Rr^{2}\\pi^{2}$$\n\nFor example, the disk $x^{2} + y^{2} \\le 1$ rotated about $x = 2$ has area $\\pi$, and its centre travels $2\\pi \\cdot 2 = 4\\pi$, so $V = 4\\pi^{2}$.\n\nCheck: with washers, the slice at height $y$ has radii $2 + \\sqrt{1 - y^{2}}$ and $2 - \\sqrt{1 - y^{2}}$, whose squares differ by $8\\sqrt{1 - y^{2}}$. The integral of $\\sqrt{1 - y^{2}}$ from $-1$ to $1$ is half the disk, $\\frac{1}{2}\\pi$, so $V = 8\\pi \\cdot \\frac{1}{2}\\pi = 4\\pi^{2}$.\n\n> **Watch out.** Multiply the area by the distance the centre travels, $2\\pi R$, not by $R$ itself or by half a turn.",
    "帕普斯定理说，把区域绕区域外的轴旋转，体积等于区域面积乘以形心走过的距离。圆盘的形心就是圆心，所以半径为 $r$、圆心到轴的距离为 $R$ 的圆盘旋转成的环体体积是\n\n$$V = \\pi r^{2} \\cdot 2\\pi R = 2Rr^{2}\\pi^{2}$$\n\n例如，圆盘 $x^{2} + y^{2} \\le 1$ 绕 $x = 2$ 旋转，面积是 $\\pi$，圆心走过 $2\\pi \\cdot 2 = 4\\pi$，所以 $V = 4\\pi^{2}$。\n\n检验：用垫圈法，高度 $y$ 处切片的两个半径是 $2 + \\sqrt{1 - y^{2}}$ 和 $2 - \\sqrt{1 - y^{2}}$，平方差是 $8\\sqrt{1 - y^{2}}$。$\\sqrt{1 - y^{2}}$ 从 $-1$ 到 $1$ 的积分是半个圆盘的面积 $\\frac{1}{2}\\pi$，所以 $V = 8\\pi \\cdot \\frac{1}{2}\\pi = 4\\pi^{2}$。\n\n> **注意。** 面积要乘以圆心走过的距离 $2\\pi R$，不是乘以 $R$ 本身，也不是半圈。",
  ),
  generate(rng) {
    const R = rng.int(2, 12);
    const r = rng.int(1, R - 1);
    const answer = 2 * R * r * r;
    const area = `${r === 1 ? "" : r * r}\\pi`;
    const root = `\\sqrt{${r * r} - y^{2}}`;
    return numberProblem({
      prompt: t(
        `The disk $x^2 + y^2 \\le ${r * r}$ is rotated about the line $x = ${R}$. The volume is $c\\pi^2$. Find $c$.`,
        `圆盘 $x^2 + y^2 \\le ${r * r}$ 绕直线 $x = ${R}$ 旋转。体积是 $c\\pi^2$。求 $c$。`,
      ),
      answer,
      form: "integer",
      mistakes: [
        {
          value: R * r * r,
          why: t(
            "This is half the volume. The centre goes once around the axis, a distance of $2\\pi R$, not $\\pi R$.",
            "这是体积的一半。圆心绕轴转一整圈，走过的距离是 $2\\pi R$，不是 $\\pi R$。",
          ),
        },
        {
          value: 2 * R * R * r,
          why: t(
            `The two radii are swapped here. The disk has radius $${r}$, and its centre is at distance $${R}$ from the axis.`,
            `这里把两个半径弄反了。圆盘半径是 $${r}$，圆心到轴的距离是 $${R}$。`,
          ),
        },
        {
          value: 2 * R * r,
          why: t("The area of the disk is $\\pi r^{2}$; this uses $\\pi r$.", "圆盘面积是 $\\pi r^{2}$；这里用了 $\\pi r$。"),
        },
        {
          value: 4 * R * r,
          why: t(
            "This multiplies the circumference $2\\pi r$ of the disk by $2\\pi R$, which gives the surface area of the torus. The volume uses the area $\\pi r^{2}$.",
            "这里用圆盘的周长 $2\\pi r$ 乘以 $2\\pi R$，得到的是环面的面积。体积要用圆盘面积 $\\pi r^{2}$。",
          ),
        },
      ].filter((m, i, all) => all.findIndex((n) => n.value === m.value) === i),
      solution: walkThrough(
        [
          [
            ["Find the area", "求面积"],
            [`The disk has radius $${r}$, so its area is $${area}$.`, `圆盘半径是 $${r}$，面积是 $${area}$。`],
          ],
          [
            ["Find the distance the centre travels", "求圆心走过的距离"],
            [
              `The centre $(0, 0)$ is at distance $${R}$ from the line $x = ${R}$, so in one turn it travels a circle of radius $${R}$:`,
              `圆心 $(0, 0)$ 到直线 $x = ${R}$ 的距离是 $${R}$，转一圈走过半径为 $${R}$ 的圆周：`,
            ],
            [`2\\pi \\cdot ${R} = ${2 * R}\\pi`],
          ],
          [["Multiply", "相乘"], ["By the theorem of Pappus,", "由帕普斯定理，"], [`V = ${area} \\cdot ${2 * R}\\pi = ${answer}\\pi^{2}`]],
        ],
        [
          `Use washers about $x = ${R}$. At height $y$ the disk runs from $x = -${root}$ to $x = ${root}$, so the radii are $${R} + ${root}$ and $${R} - ${root}$, whose squares differ by $${4 * R}${root}$. The integral of $${root}$ from $-${r}$ to $${r}$ is the area of half the disk, $${Q.of(r * r, 2).toLatex()}\\pi$, so $V = ${4 * R}\\pi \\cdot ${Q.of(r * r, 2).toLatex()}\\pi = ${answer}\\pi^{2}$ and $c = ${answer}$.`,
          `用绕 $x = ${R}$ 的垫圈。高度 $y$ 处圆盘从 $x = -${root}$ 到 $x = ${root}$，两个半径是 $${R} + ${root}$ 和 $${R} - ${root}$，平方差是 $${4 * R}${root}$。$${root}$ 从 $-${r}$ 到 $${r}$ 的积分是半个圆盘的面积 $${Q.of(r * r, 2).toLatex()}\\pi$，所以 $V = ${4 * R}\\pi \\cdot ${Q.of(r * r, 2).toLatex()}\\pi = ${answer}\\pi^{2}$，$c = ${answer}$。`,
        ],
      ),
    });
  },
};

const distanceGap: KnowledgePointDef = {
  id: "the-gap-between-distance-and-displacement",
  figure: calculusDrawings5["calculating-the-total-distance-traveled-by-a-particle#the-gap-between-distance-and-displacement"],
  title: t("The gap between distance and displacement", "路程与位移之差"),
  explanation: t(
    "Distance and the size of the displacement agree when a particle never turns around. When it reverses, the shorter of the two legs is walked back, and it counts for the distance but cancels in the displacement. The gap is therefore twice the shorter leg. Comparing the two areas between the velocity graph and the axis shows this. For example, $v(t) = t - 1$ on $[0, 3]$ has areas $\\frac{1}{2}$ before $t = 1$ and $2$ after, so the gap is $2 \\cdot \\frac{1}{2} = 1$.\n\nCheck: the distance is $\\frac{1}{2} + 2 = \\frac{5}{2}$ and the displacement is $2 - \\frac{1}{2} = \\frac{3}{2}$, and $\\frac{5}{2} - \\frac{3}{2} = 1$.\n\n> **Watch out.** The gap is twice the shorter leg, not the shorter leg itself: that leg is counted once in the distance and taken away once in the displacement.",
    "质点不折返时，路程和位移的大小相同。折返时，较短的那一段走回头路，它计入路程，却在位移中抵消。所以差是较短那段的两倍。比较速度图像与横轴之间的两块面积就能看出这一点。例如 $[0, 3]$ 上的 $v(t) = t - 1$，在 $t = 1$ 之前的面积是 $\\frac{1}{2}$，之后是 $2$，所以差是 $2 \\cdot \\frac{1}{2} = 1$。\n\n检验：路程是 $\\frac{1}{2} + 2 = \\frac{5}{2}$，位移是 $2 - \\frac{1}{2} = \\frac{3}{2}$，而 $\\frac{5}{2} - \\frac{3}{2} = 1$。\n\n> **注意。** 差是较短那段的两倍，不是那一段本身：它在路程中算了一次，在位移中又被抵掉一次。",
  ),
  generate(rng) {
    const k = rng.int(1, 6);
    const a = rng.int(1, 6);
    const b = rng.int(1, 6);
    const T = a + b;
    const shorter = Math.min(a, b);
    const answer = Q.of(k * shorter * shorter);
    const [first, second] = [Q.of(k * a * a, 2), Q.of(k * b * b, 2)];
    const distance = first.add(second);
    const displacement = second.sub(first).abs();
    const v = poly([k, "t"], [-k * a, ""]);
    return numberProblem({
      prompt: t(
        `A particle has velocity $v(t) = ${v}$ for $0 \\le t \\le ${T}$. By how much does its total distance exceed the size of its displacement?`,
        `质点的速度是 $v(t) = ${v}$，$0 \\le t \\le ${T}$。它的总路程比位移的大小多多少？`,
      ),
      answer,
      form: "integer",
      mistakes: motionSlips(answer, [
        [
          distance,
          "This is the total distance itself; subtract the size of the displacement from it.",
          "这是总路程本身；还要减去位移的大小。",
        ],
        [
          displacement,
          "This is the size of the displacement; the question asks how much the distance exceeds it.",
          "这是位移的大小；题目问的是路程比它多多少。",
        ],
        [
          Q.of(k * shorter * shorter, 2),
          "This is the shorter leg once; it counts in the distance and cancels in the displacement, so the gap is twice it.",
          "这只是较短的那段；它计入路程，又在位移中抵消，所以差是它的两倍。",
        ],
      ]),
      solution: walkThrough(
        [
          [
            ["Split at the turn", "在掉头处分段"],
            [
              `The velocity is zero at $t = ${a}$. The triangles between the graph and the axis have areas`,
              `速度在 $t = ${a}$ 时为零。图像与横轴之间的两个三角形面积为`,
            ],
            [
              `\\frac{1}{2} \\cdot ${a} \\cdot ${k * a} = ${first.toLatex()}, \\quad \\frac{1}{2} \\cdot ${b} \\cdot ${k * b} = ${second.toLatex()}`,
            ],
          ],
          [
            ["Compare distance and displacement", "比较路程与位移"],
            ["The distance adds the areas; the displacement subtracts them:", "路程把两块面积相加，位移把它们相减："],
            [`${distance.toLatex()} - ${displacement.toLatex()} = ${answer.toLatex()}`],
          ],
        ],
        [
          `The gap is twice the shorter leg: $2 \\cdot \\frac{1}{2} \\cdot ${k} \\cdot ${shorter}^2 = ${answer.toLatex()}$.`,
          `差是较短那段的两倍：$2 \\cdot \\frac{1}{2} \\cdot ${k} \\cdot ${shorter}^2 = ${answer.toLatex()}$。`,
        ],
      ),
    });
  },
};

const stoppingTime: KnowledgePointDef = {
  id: "the-time-to-stop-after-speeding-up",
  title: t("The time to stop after speeding up", "加速后到停止的时间"),
  explanation: t(
    "When the acceleration is given in stages, integrate one stage at a time, using the final velocity of each stage as the starting velocity of the next. The constant of integration carries that information across. A vehicle that speeds up and then slows down stops at the moment its velocity function returns to zero. For example, with acceleration $6$ for $2$ seconds and then $-3$, the velocity reaches $12$ and falls back to zero $\\frac{12}{3} = 4$ seconds later, at $t = 6$.\n\nCheck: the cart starts and ends at rest, so the integral of the acceleration over the whole trip is zero: $6 \\cdot 2 - 3 \\cdot 4 = 0$.\n\n> **Watch out.** The answer is measured from the start: add the time of the first stage to the time spent slowing down.",
    "加速度分阶段给出时，要逐段积分，每一段的末速度就是下一段的初速度。积分常数正是把这个信息传递下去。先加速再减速的车辆，在速度函数回到零的时刻停下来。例如以加速度 $6$ 运动 $2$ 秒，再以 $-3$ 运动，速度先达到 $12$，再过 $\\frac{12}{3} = 4$ 秒降回零，即在 $t = 6$ 时停下。\n\n检验：小车从静止出发又停下，所以全程加速度的积分为零：$6 \\cdot 2 - 3 \\cdot 4 = 0$。\n\n> **注意。** 答案从出发时算起：要把第一阶段的时间加上减速所用的时间。",
  ),
  generate(rng) {
    const d = rng.int(1, 6);
    const m = rng.int(1, 5);
    const up = d * m;
    const t1 = rng.int(1, 12);
    const peak = up * t1;
    const answer = t1 * (1 + m);
    return numberProblem({
      prompt: t(
        `A cart starts from rest with acceleration ${up} for ${t1} ${t1 === 1 ? "second" : "seconds"}, and then has acceleration $-${d}$ until it stops. At what time, in seconds after the start, does it stop?`,
        `小车从静止出发，以加速度 ${up} 运动 ${t1} 秒，然后以加速度 $-${d}$ 运动直到停止。它在出发后多少秒停下？`,
      ),
      answer,
      form: "integer",
      mistakes: motionSlips(Q.of(answer), [
        [
          Q.of(t1 * m),
          `This is only the time spent slowing down; add the first $${t1}$ s.`,
          `这只是减速所用的时间；还要加上最初的 $${t1}$ 秒。`,
        ],
        [Q.of(peak), "This is the top velocity, not a time.", "这是最大速度，不是时间。"],
        [
          Q.of(t1 + m),
          `This divides the first acceleration by the second, $${up} \\div ${d}$; the time to stop is the top velocity $${peak}$ divided by $${d}$.`,
          `这里用第一段的加速度除以第二段的，$${up} \\div ${d}$；停下所需的时间应是最大速度 $${peak}$ 除以 $${d}$。`,
        ],
      ]),
      solution: walkThrough(
        [
          [
            ["Integrate the first stage", "对第一阶段积分"],
            [`Starting from rest, $v(t) = ${up}t$ until $t = ${t1}$:`, `从静止出发，在 $t = ${t1}$ 之前 $v(t) = ${up}t$：`],
            [`v(${t1}) = ${up} \\cdot ${t1} = ${peak}`],
          ],
          [
            ["Integrate the second stage", "对第二阶段积分"],
            [
              `The velocity $${peak}$ becomes the starting value: $v(t) = ${peak} - ${d}(t - ${t1})$. Set it to zero:`,
              `速度 $${peak}$ 成为新的初值：$v(t) = ${peak} - ${d}(t - ${t1})$。令它为零：`,
            ],
            [`t - ${t1} = \\frac{${peak}}{${d}} = ${t1 * m} \\implies t = ${answer}`],
          ],
        ],
        [
          `The cart starts and ends at rest, so the integral of the acceleration over $[0, ${answer}]$ must be zero: $${up} \\cdot ${t1} - ${d} \\cdot ${t1 * m} = ${peak} - ${peak} = 0$.`,
          `小车从静止出发又停下，所以加速度在 $[0, ${answer}]$ 上的积分必为零：$${up} \\cdot ${t1} - ${d} \\cdot ${t1 * m} = ${peak} - ${peak} = 0$。`,
        ],
      ),
    });
  },
};

const astroidLength: KnowledgePointDef = {
  id: "the-length-of-an-astroid",
  title: t("The length of an astroid", "星形线的长度"),
  explanation: t(
    "The astroid $x = a\\cos^3 t$, $y = a\\sin^3 t$ has speed $3a|\\sin t\\cos t|$. The absolute value means that a direct integral over the whole turn would give zero if the bars were dropped. So use symmetry: integrate over a quarter of the curve, where the sine and cosine are both positive, and multiply by four.",
    "星形线 $x = a\\cos^3 t$，$y = a\\sin^3 t$ 的速率是 $3a|\\sin t\\cos t|$。如果去掉绝对值，直接在一整圈上积分会得到零。所以要利用对称性：在四分之一条曲线上积分，这里正弦和余弦都是正的，再乘以四。",
  ),
  generate(rng) {
    const a = rng.int(1, 30);
    const answer = 6 * a;
    return numberProblem({
      prompt: t(
        `Find the length of the curve $x = ${coefficientOf(a)}\\cos^3 t$, $y = ${coefficientOf(a)}\\sin^3 t$, $0 \\le t \\le 2\\pi$.`,
        `求曲线 $x = ${coefficientOf(a)}\\cos^3 t$，$y = ${coefficientOf(a)}\\sin^3 t$（$0 \\le t \\le 2\\pi$）的长度。`,
      ),
      answer,
      form: "integer",
      wrong: [0, 3 * a, 12 * a],
      solution: t(
        `On a quarter of the curve the length is $\\int_0^{\\pi/2} ${3 * a}\\sin t\\cos t\\,dt = ${Q.of(3 * a, 2).toLatex()}$. Four of these give $${answer}$.`,
        `四分之一条曲线的长度是 $\\int_0^{\\pi/2} ${3 * a}\\sin t\\cos t\\,dt = ${Q.of(3 * a, 2).toLatex()}$。四段合计 $${answer}$。`,
      ),
    });
  },
};

const astroidArea: KnowledgePointDef = {
  id: "the-area-inside-an-astroid",
  figure: calculusDrawings5["calculating-areas-bounded-by-parametric-functions#the-area-inside-an-astroid"],
  title: t("The area inside an astroid", "星形线围成的面积"),
  explanation: t(
    "The area inside a closed parametric curve is the integral of $y\\,dx$ with suitable orientation. For the astroid this gives a constant times $\\int \\sin^4 t\\cos^2 t\\,dt$, which reduces by the double angle formulas. Using symmetry, take one quarter of the region, where the integrand has a single sign, and multiply by four.",
    "参数曲线围成的面积，是取合适方向的 $y\\,dx$ 的积分。对星形线，这给出常数乘以 $\\int \\sin^4 t\\cos^2 t\\,dt$，可以用二倍角公式化简。利用对称性，取区域的四分之一，这里被积函数符号不变，再乘以四。",
  ),
  generate(rng) {
    const a = rng.int(1, 30);
    const answer = Q.of(3 * a * a, 8);
    return numberProblem({
      prompt: t(
        `The region enclosed by $x = ${coefficientOf(a)}\\cos^3 t$, $y = ${coefficientOf(a)}\\sin^3 t$ has area $c\\pi$. Find $c$.`,
        `曲线 $x = ${coefficientOf(a)}\\cos^3 t$，$y = ${coefficientOf(a)}\\sin^3 t$ 围成的区域面积是 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(3 * a * a, 4), Q.of(a * a, 2), Q.of(3 * a * a, 16)],
      solution: t(
        `A quarter of the area is $3 \\cdot ${a * a} \\cdot \\int_0^{\\pi/2} \\sin^4 t\\cos^2 t\\,dt = 3 \\cdot ${a * a} \\cdot \\frac{\\pi}{32}$. Multiplying by four gives $c = ${answer.toLatex()}$.`,
        `四分之一的面积是 $3 \\cdot ${a * a} \\cdot \\int_0^{\\pi/2} \\sin^4 t\\cos^2 t\\,dt = 3 \\cdot ${a * a} \\cdot \\frac{\\pi}{32}$。乘以四，得 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const roseArea: KnowledgePointDef = {
  id: "the-total-area-of-a-rose-curve",
  title: t("The total area of a rose curve", "玫瑰线的总面积"),
  explanation: t(
    "A rose $r = a\\cos n\\theta$ has $n$ petals when $n$ is odd and $2n$ when $n$ is even. When $n$ is odd, the curve is traced twice over $[0, 2\\pi]$, so one must integrate only over $[0, \\pi]$. As a result, the total area is $\\frac{\\pi a^2}{4}$ for odd $n$ and $\\frac{\\pi a^2}{2}$ for even $n$, whatever $n$ is.",
    "玫瑰线 $r = a\\cos n\\theta$ 在 $n$ 为奇数时有 $n$ 片花瓣，为偶数时有 $2n$ 片。$n$ 为奇数时，曲线在 $[0, 2\\pi]$ 上被描了两遍，所以只应在 $[0, \\pi]$ 上积分。因此总面积在 $n$ 为奇数时是 $\\frac{\\pi a^2}{4}$，为偶数时是 $\\frac{\\pi a^2}{2}$，与 $n$ 的具体值无关。",
  ),
  generate(rng) {
    const n = rng.int(2, 7);
    const a = rng.int(1, 9);
    const odd = n % 2 === 1;
    const answer = Q.of(a * a, odd ? 4 : 2);
    const other = Q.of(a * a, odd ? 2 : 4);
    const petals = odd ? n : 2 * n;
    return numberProblem({
      prompt: t(
        `The total area enclosed by all the petals of $r = ${coefficientOf(a)}\\cos ${n}\\theta$ is $c\\pi$. Find $c$.`,
        `$r = ${coefficientOf(a)}\\cos ${n}\\theta$ 所有花瓣围成的总面积是 $c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [other, Q.of(a * a), Q.of(n * a * a, 4)],
      solution: t(
        `The rose has ${petals} petals, each of area $\\frac{${a === 1 ? "" : a * a}\\pi}{${4 * n}}$. Their total gives $c = ${answer.toLatex()}$.`,
        `这条玫瑰线有 ${petals} 片花瓣，每片的面积是 $\\frac{${a === 1 ? "" : a * a}\\pi}{${4 * n}}$。它们的总和给出 $c = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const conjugateLimit: KnowledgePointDef = {
  id: "the-limit-of-a-root-minus-n",
  title: t("The limit of a root minus $n$", "根式减 $n$ 的极限"),
  explanation: t(
    "In $\\sqrt{n^2 + an + b} - n$, both terms grow without bound, and comparing their dominant terms alone suggests a limit of zero, which is wrong. Multiplying by the conjugate gives the quotient $\\frac{an + b}{\\sqrt{n^2 + an + b} + n}$. Its dominant terms are $an$ over $2n$, so the limit is $\\frac{a}{2}$, and $b$ plays no part.",
    "在 $\\sqrt{n^2 + an + b} - n$ 中，两项都无限增大，只比较主导项会以为极限是零，这是错的。乘以共轭式得到商 $\\frac{an + b}{\\sqrt{n^2 + an + b} + n}$。它的主导项是 $an$ 比 $2n$，所以极限是 $\\frac{a}{2}$，$b$ 不起作用。",
  ),
  generate(rng) {
    const a = nonzero(rng, 12);
    const b = rng.int(1, 12);
    const answer = Q.of(a, 2);
    return numberProblem({
      prompt: t(
        `Find $\\lim_{n \\to \\infty} \\left(\\sqrt{${poly([1, "n^2"], [a, "n"], [b, ""])}} - n\\right)$.`,
        `求 $\\lim_{n \\to \\infty} \\left(\\sqrt{${poly([1, "n^2"], [a, "n"], [b, ""])}} - n\\right)$。`,
      ),
      answer,
      wrong: [Q.of(a), Q.of(0), Q.of(b, 2)],
      solution: t(
        `Multiplying by the conjugate gives $\\frac{${poly([a, "n"], [b, ""])}}{\\sqrt{${poly([1, "n^2"], [a, "n"], [b, ""])}} + n}$. The dominant terms give $${a % 2 === 0 ? `\\frac{${a}}{2} = ` : ""}${answer.toLatex()}$.`,
        `乘以共轭式得 $\\frac{${poly([a, "n"], [b, ""])}}{\\sqrt{${poly([1, "n^2"], [a, "n"], [b, ""])}} + n}$。主导项给出 $${a % 2 === 0 ? `\\frac{${a}}{2} = ` : ""}${answer.toLatex()}$。`,
      ),
    });
  },
};

const telescopingWithGap: KnowledgePointDef = {
  id: "a-telescoping-series-with-a-gap",
  title: t("A telescoping series with a gap", "有间隔的裂项级数"),
  explanation: t(
    "Partial fractions write $\\frac{1}{n(n + a)}$ as $\\frac{1}{a}\\left(\\frac{1}{n} - \\frac{1}{n + a}\\right)$. In the partial sums, each negative term cancels a positive term $a$ places later. So the first $a$ positive terms survive, while the remaining terms tend to zero. The sum is therefore $\\frac{1}{a}$ times the sum of the reciprocals from 1 to $a$.",
    "部分分式把 $\\frac{1}{n(n + a)}$ 写成 $\\frac{1}{a}\\left(\\frac{1}{n} - \\frac{1}{n + a}\\right)$。在部分和中，每个负项抵消 $a$ 个位置之后的一个正项。所以前 $a$ 个正项留下，其余的项趋于零。因此和是 $\\frac{1}{a}$ 乘以从 1 到 $a$ 的倒数之和。",
  ),
  generate(rng) {
    const a = rng.int(1, 4);
    const k = rng.int(1, 12);
    const reciprocals = [...Array(a).keys()].map((i) => Q.of(1, i + 1));
    const harmonic = reciprocals.reduce((sum, r) => sum.add(r), Q.of(0));
    const answer = Q.of(k, a).mul(harmonic);
    return numberProblem({
      prompt: t(`Find $\\sum_{n=1}^\\infty \\frac{${k}}{n(n + ${a})}$.`, `求 $\\sum_{n=1}^\\infty \\frac{${k}}{n(n + ${a})}$。`),
      answer,
      wrong: [Q.of(k, a), Q.of(k), Q.of(k, a + 1), Q.of(2 * k)],
      solution: t(
        `Split the term: $\\frac{${k}}{n(n + ${a})} = ${Q.of(k, a).toLatex()}\\left(\\frac{1}{n} - \\frac{1}{n + ${a}}\\right)$. Each negative term cancels a positive term ${a} places later, so only the first ${a} positive terms stay:${steps(`${Q.of(k, a).toLatex()}\\left(${reciprocals.map((r) => r.toLatex()).join(" + ")}\\right) = ${answer.toLatex()}`)}`,
        `把通项拆开：$\\frac{${k}}{n(n + ${a})} = ${Q.of(k, a).toLatex()}\\left(\\frac{1}{n} - \\frac{1}{n + ${a}}\\right)$。每个负项与 ${a} 个位置之后的正项抵消，只留下前 ${a} 个正项：${steps(`${Q.of(k, a).toLatex()}\\left(${reciprocals.map((r) => r.toLatex()).join(" + ")}\\right) = ${answer.toLatex()}`)}`,
      ),
    });
  },
};

const bouncingBall: KnowledgePointDef = {
  id: "the-total-distance-of-a-bouncing-ball",
  title: t("The total distance of a bouncing ball", "弹跳小球的总路程"),
  explanation: t(
    "A ball that loses a fixed share of its height on every bounce travels a geometric total. The first drop happens only once, but each later height is covered twice, going up and coming down. So the total is the initial height plus twice a geometric series that starts from the first rebound, not from the initial drop.",
    "每次弹跳都损失固定比例高度的小球，走过的总路程是一个几何级数。第一次下落只发生一次，但之后的每个高度都走两遍，上去一次，下来一次。所以总路程是初始高度加上两倍的几何级数，这个级数从第一次反弹开始，而不是从初始下落开始。",
  ),
  generate(rng) {
    const [p, q] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [2, 5],
      [3, 5],
    ]) as [number, number];
    const h = rng.int(1, 12) * (q - p);
    const answer = Q.of(h * (q + p), q - p);
    const rebound = Q.of(h * p, q - p);
    const ratio = Q.of(p, q);
    return numberProblem({
      prompt: t(
        `A ball is dropped from a height of ${h} metres, and each bounce rises to $${ratio.toLatex()}$ of the previous height. Find the total vertical distance it travels, in metres.`,
        `小球从 ${h} 米高处落下，每次弹起的高度是前一次的 $${ratio.toLatex()}$。求它走过的总竖直路程（单位：米）。`,
      ),
      answer,
      wrong: [Q.of(h * q, q - p), Q.of(2 * h * q, q - p), rebound],
      solution: t(
        `The rebound heights add up to $\\frac{${h} \\cdot ${ratio.toLatex()}}{1 - ${ratio.toLatex()}} = ${rebound.toLatex()}$. Each is travelled twice, so the total is $${h} + 2 \\cdot ${rebound.toLatex()} = ${answer.toLatex()}$.`,
        `各次弹起的高度之和是 $\\frac{${h} \\cdot ${ratio.toLatex()}}{1 - ${ratio.toLatex()}} = ${rebound.toLatex()}$。每段都走两遍，所以总路程是 $${h} + 2 \\cdot ${rebound.toLatex()} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const taylorBySubstitution: KnowledgePointDef = {
  id: "a-taylor-coefficient-by-substitution",
  title: t("A Taylor coefficient by substitution", "用代入法求泰勒系数"),
  explanation: t(
    "Computing many derivatives of $e^{ax^2}$ would be painful, but its series comes straight from that of $e^u$ with $u = ax^2$. Only even powers of $x$ appear, and the term in $x^{2m}$ is the term in $u^m$. So the coefficient is $\\frac{a^m}{m!}$. The factorial belongs to $m$, not to the power $2m$.",
    "计算 $e^{ax^2}$ 的多阶导数很麻烦，但它的级数可以直接由 $e^u$ 的级数令 $u = ax^2$ 得到。只出现 $x$ 的偶次幂，$x^{2m}$ 项就是 $u^m$ 项。所以系数是 $\\frac{a^m}{m!}$。阶乘属于 $m$，而不是幂次 $2m$。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const m = rng.int(2, 5);
    const answer = Q.of(a ** m, factorial(m));
    return numberProblem({
      prompt: t(
        `Find the coefficient of $x^{${2 * m}}$ in the Taylor series of $e^{${poly([a, "x^2"])}}$ about 0.`,
        `求 $e^{${poly([a, "x^2"])}}$ 在 0 处的泰勒级数中 $x^{${2 * m}}$ 的系数。`,
      ),
      answer,
      wrong: [Q.of(a ** m, factorial(2 * m)), Q.of(a ** m), Q.of(a, factorial(m))],
      solution: t(
        `With $u = ${poly([a, "x^2"])}$, the term in $x^{${2 * m}}$ comes from $\\frac{u^{${m}}}{${m}!}$. Its coefficient is $\\frac{${a < 0 ? `(${a})` : a}^{${m}}}{${factorial(m)}} = ${answer.toLatex()}$.`,
        `令 $u = ${poly([a, "x^2"])}$，$x^{${2 * m}}$ 项来自 $\\frac{u^{${m}}}{${m}!}$。它的系数是 $\\frac{${a < 0 ? `(${a})` : a}^{${m}}}{${factorial(m)}} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const geometricSubstitution: KnowledgePointDef = {
  id: "a-coefficient-of-a-geometric-series-in-x-squared",
  title: t("A coefficient of a geometric series in $x^2$", "关于 $x^2$ 的几何级数的系数"),
  explanation: t(
    "The fraction $\\frac{k}{1 + ax^2}$ is a geometric series with first term $k$ and ratio $-ax^2$. Keep the minus sign with the ratio, because it makes the coefficients alternate. The term in $x^{2m}$ uses the ratio $m$ times, and so its coefficient is $k(-a)^m$. Odd powers of $x$ have coefficient zero.",
    "分式 $\\frac{k}{1 + ax^2}$ 是首项为 $k$、公比为 $-ax^2$ 的几何级数。负号要留在公比里，正是它使系数正负交替。$x^{2m}$ 项用了 $m$ 次公比，所以系数是 $k(-a)^m$。$x$ 的奇次幂系数为零。",
  ),
  generate(rng) {
    const a = rng.int(1, 4);
    const k = rng.int(1, 6);
    const m = rng.int(2, 5);
    const answer = k * (-a) ** m;
    return numberProblem({
      prompt: t(
        `Find the coefficient of $x^{${2 * m}}$ in the power series of $\\frac{${k}}{1 + ${coefficientOf(a)}x^2}$ about 0.`,
        `求 $\\frac{${k}}{1 + ${coefficientOf(a)}x^2}$ 在 0 处的幂级数中 $x^{${2 * m}}$ 的系数。`,
      ),
      answer,
      form: "integer",
      wrong: [-answer, k * (-a) ** (2 * m), k * (-a) ** (m + 1), k * a * m],
      solution: t(
        `The ratio is $-${coefficientOf(a)}x^2$, used ${m} times, so the coefficient is $${k} \\cdot (-${a})^{${m}} = ${answer}$.`,
        `公比是 $-${coefficientOf(a)}x^2$，用了 ${m} 次，所以系数是 $${k} \\cdot (-${a})^{${m}} = ${answer}$。`,
      ),
    });
  },
};

const highDerivativeOfProduct: KnowledgePointDef = {
  id: "a-high-derivative-of-a-product-from-its-series",
  title: t("A high derivative of a product from its series", "由级数求乘积的高阶导数"),
  explanation: t(
    "Multiplying a series by $x^2$ shifts every term up by two places. So the coefficient of $x^n$ in $x^2e^{ax}$ is the coefficient of $x^{n-2}$ in $e^{ax}$. The derivative at 0 is then $n!$ times that coefficient. This avoids differentiating a product $n$ times, which would be slow and prone to mistakes.",
    "把级数乘以 $x^2$，每一项都上移两位。所以 $x^2e^{ax}$ 中 $x^n$ 的系数，就是 $e^{ax}$ 中 $x^{n-2}$ 的系数。在 0 处的导数就是 $n!$ 乘以这个系数。这样就不用对乘积求 $n$ 次导，那样既慢又容易出错。",
  ),
  generate(rng) {
    const a = nonzero(rng, 3);
    const n = rng.int(4, 8);
    const power = a ** (n - 2);
    const answer = n * (n - 1) * power;
    return numberProblem({
      prompt: t(
        `Let $f(x) = x^2e^{${poly([a, "x"])}}$. Find $f^{(${n})}(0)$.`,
        `设 $f(x) = x^2e^{${poly([a, "x"])}}$。求 $f^{(${n})}(0)$。`,
      ),
      answer,
      form: "integer",
      wrong: [power, n * power, n * (n - 1) * a ** n],
      solution: t(
        `The coefficient of $x^{${n}}$ is $\\frac{${inParens(a)}^{${n - 2}}}{${n - 2}!}$. Multiplying by $${n}!$ gives $${n} \\cdot ${n - 1} \\cdot ${inParens(a)}^{${n - 2}} = ${answer}$.`,
        `$x^{${n}}$ 的系数是 $\\frac{${inParens(a)}^{${n - 2}}}{${n - 2}!}$。乘以 $${n}!$，得 $${n} \\cdot ${n - 1} \\cdot ${inParens(a)}^{${n - 2}} = ${answer}$。`,
      ),
    });
  },
};

const evenPowersRadius: KnowledgePointDef = {
  id: "the-radius-of-a-series-in-even-powers",
  title: t("The radius of a series in even powers", "偶次幂级数的收敛半径"),
  explanation: t(
    "A series with only even powers of $x$ skips terms, so the usual ratio of coefficients does not give the radius directly. Treat it as a geometric series in $x^2$ instead. It converges when the ratio has size less than one, which bounds $x^2$. Then take a square root, and this is the step most easily forgotten.",
    "只含 $x$ 偶次幂的级数跳过了一些项，所以通常的系数之比不能直接给出半径。可以把它看作关于 $x^2$ 的几何级数。公比的大小小于一时收敛，这就限定了 $x^2$。然后要开平方，这是最容易忘记的一步。",
  ),
  generate(rng) {
    const s = rng.int(2, 9);
    const u = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== s));
    const answer = Q.of(s, u);
    const top = u === 1 ? "" : `${u * u}^n`;
    return numberProblem({
      prompt: t(
        `Find the radius of convergence of $\\sum_{n=0}^\\infty \\frac{${top}x^{2n}}{${s * s}^n}$.`,
        `求 $\\sum_{n=0}^\\infty \\frac{${top}x^{2n}}{${s * s}^n}$ 的收敛半径。`,
      ),
      answer,
      wrong: [Q.of(s * s, u * u), Q.of(u, s), Q.of(s * s, u)],
      solution: t(
        `The ratio is $${Q.of(u * u, s * s).toLatex()}x^2$, and it has size below 1 when $x^2 < ${Q.of(s * s, u * u).toLatex()}$. The square root gives $${answer.toLatex()}$.`,
        `公比是 $${Q.of(u * u, s * s).toLatex()}x^2$，当 $x^2 < ${Q.of(s * s, u * u).toLatex()}$ 时它的大小小于 1。开平方得 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const circularForce: KnowledgePointDef = {
  id: "the-size-of-the-force-in-circular-motion",
  title: t("The size of the force in circular motion", "圆周运动中力的大小"),
  explanation: t(
    "A particle moving as $\\mathbf{r}(t) = \\langle A\\cos\\omega t, A\\sin\\omega t \\rangle$ has acceleration $-\\omega^2\\mathbf{r}$, which points toward the centre. By Newton's second law, the force has size $mA\\omega^2$ at every moment. The size is constant even though the direction changes, and doubling the angular speed multiplies the force by four.",
    "按 $\\mathbf{r}(t) = \\langle A\\cos\\omega t, A\\sin\\omega t \\rangle$ 运动的质点，加速度是 $-\\omega^2\\mathbf{r}$，指向圆心。由牛顿第二定律，力的大小在每一时刻都是 $mA\\omega^2$。尽管方向变化，大小却不变；角速度加倍，力就变为四倍。",
  ),
  generate(rng) {
    const m = rng.int(1, 9);
    const A = rng.int(1, 9);
    const w = rng.int(2, 5);
    const answer = m * A * w * w;
    return numberProblem({
      prompt: t(
        `A particle of mass ${m} has position $\\mathbf{r}(t) = \\langle ${coefficientOf(A)}\\cos ${w}t, ${coefficientOf(A)}\\sin ${w}t \\rangle$. Find the magnitude of the force on it.`,
        `质量为 ${m} 的质点，位置是 $\\mathbf{r}(t) = \\langle ${coefficientOf(A)}\\cos ${w}t, ${coefficientOf(A)}\\sin ${w}t \\rangle$。求它受到的力的大小。`,
      ),
      answer,
      form: "integer",
      wrong: [m * A * w, A * w * w, m * w * w],
      solution: t(
        `The acceleration has magnitude $${A} \\cdot ${w}^2 = ${A * w * w}$. Multiplying by the mass ${m} gives $${answer}$.`,
        `加速度的大小是 $${A} \\cdot ${w}^2 = ${A * w * w}$。乘以质量 ${m}，得 $${answer}$。`,
      ),
    });
  },
};

const projectileSpeed: KnowledgePointDef = {
  id: "the-speed-of-a-projectile-at-a-given-time",
  title: t("The speed of a projectile at a given time", "抛体在给定时刻的速率"),
  explanation: t(
    "Integrating a constant acceleration $\\langle 0, -g \\rangle$ leaves the horizontal velocity alone and reduces the vertical velocity at a steady rate. So at time $T$ the velocity is $\\langle v_x, v_y - gT \\rangle$. The speed is the magnitude of this vector, and neither the initial speed nor the height is needed to calculate it.",
    "对常加速度 $\\langle 0, -g \\rangle$ 积分，水平速度不变，竖直速度匀速减小。所以在时刻 $T$，速度是 $\\langle v_x, v_y - gT \\rangle$。速率是这个向量的大小，计算时既不需要初速率，也不需要高度。",
  ),
  generate(rng) {
    const { a, b, h } = pythagorean(rng);
    const sign = rng.pick([1, -1]);
    const g = rng.int(2, 10);
    const T = rng.int(1, 6);
    const vertical = sign * b;
    const start = vertical + g * T;
    return numberProblem({
      prompt: t(
        `A projectile has acceleration $\\langle 0, -${g} \\rangle$ and initial velocity $\\langle ${a}, ${start} \\rangle$. Find its speed at $t = ${T}$.`,
        `抛体的加速度是 $\\langle 0, -${g} \\rangle$，初速度是 $\\langle ${a}, ${start} \\rangle$。求它在 $t = ${T}$ 时的速率。`,
      ),
      answer: h,
      form: "integer",
      wrong: [a + b, g * T, a],
      solution: t(
        `The velocity at $t = ${T}$ is $\\langle ${a}, ${start} - ${g * T} \\rangle = \\langle ${a}, ${vertical} \\rangle$. Its magnitude is $\\sqrt{${a}^2 + ${inParens(vertical)}^2} = ${h}$.`,
        `$t = ${T}$ 时的速度是 $\\langle ${a}, ${start} - ${g * T} \\rangle = \\langle ${a}, ${vertical} \\rangle$。它的大小是 $\\sqrt{${a}^2 + ${inParens(vertical)}^2} = ${h}$。`,
      ),
    });
  },
};

// ---------------------------------------------------------------------------
// Third pass
// ---------------------------------------------------------------------------

/** signedCoefficient writes a nonzero number before a symbol, leaving out 1 and keeping the sign of -1. */
const signedCoefficient = (n: number) => (n === 1 ? "" : n === -1 ? "-" : `${n}`);

const upperLimitFromLogarithm: KnowledgePointDef = {
  id: "the-upper-limit-from-a-logarithmic-value",
  title: t("The upper limit from a logarithmic value", "由对数值求积分上限"),
  explanation: t(
    "The integral of a linear function's derivative over that function is a difference of logarithms, which is the logarithm of a ratio. So when the value is $\\ln m$, the linear function must grow by the factor $m$ between the two limits. That turns the question about an integral into a linear equation for the unknown limit. For example, $\\int_0^{b} \\frac{2}{2x + 3}\\,dx$ is $\\ln\\frac{2b + 3}{3}$. For this to be $\\ln 2$, $2b + 3$ must be $6$, so $b$ is $\\frac{3}{2}$.\n\nCheck: with $b = \\frac{3}{2}$ the integral is $\\ln 6 - \\ln 3$, which is $\\ln 2$.\n\n> **Watch out.** The value at the lower limit is $\\ln c$, not $0$. Forgetting it gives the equation $ab + c = m$ instead of $ab + c = cm$.",
    "线性函数的导数除以该函数，积分是对数之差，也就是比值的对数。所以积分值为 $\\ln m$ 时，线性函数从下限到上限必须增大到 $m$ 倍。这样，积分问题就变成了关于未知积分限的一次方程。例如，$\\int_0^{b} \\frac{2}{2x + 3}\\,dx$ 等于 $\\ln\\frac{2b + 3}{3}$。要使它等于 $\\ln 2$，$2b + 3$ 必须是 $6$，所以 $b$ 等于 $\\frac{3}{2}$。\n\n检验：$b = \\frac{3}{2}$ 时，积分等于 $\\ln 6 - \\ln 3$，即 $\\ln 2$。\n\n> **注意。** 下限处的值是 $\\ln c$，不是 $0$。忘了它，就会得到方程 $ab + c = m$，而不是 $ab + c = cm$。",
  ),
  generate(rng) {
    const a = rng.int(2, 6);
    const c = rng.int(2, 9);
    const m = rng.int(2, 6);
    const answer = Q.of(c * (m - 1), a);
    const denominator = poly([a, "x"], [c, ""]);
    return numberProblem({
      prompt: t(
        `For which $b > 0$ is $\\int_0^b \\frac{${a}}{${denominator}}\\,dx = \\ln ${m}$?`,
        `$b > 0$ 取何值时 $\\int_0^b \\frac{${a}}{${denominator}}\\,dx = \\ln ${m}$？`,
      ),
      answer,
      solveFor: "b",
      wrong: [Q.of(c * (m - 1)), Q.of(c * m, a), Q.of(m - 1, a), Q.of(c * (m + 1), a)],
      solution: walkThrough(
        [
          [
            ["Integrate", "积分"],
            [
              `With $u = ${denominator}$, $du = ${a}\\,dx$, so the integral is a difference of logarithms. Both values of $u$ are positive for $b > 0$:`,
              `令 $u = ${denominator}$，则 $du = ${a}\\,dx$，所以积分是对数之差。$b > 0$ 时 $u$ 的两个值都是正的：`,
            ],
            [`\\int_0^b \\frac{${a}}{${denominator}}\\,dx = \\ln(${a}b + ${c}) - \\ln ${c}`],
          ],
          [
            ["Solve for b", "解出 b"],
            [
              `Setting this equal to $\\ln ${m}$ means $${a}b + ${c}$ is $${m}$ times $${c}$:`,
              `令它等于 $\\ln ${m}$，就是说 $${a}b + ${c}$ 是 $${c}$ 的 $${m}$ 倍：`,
            ],
            [`${a}b + ${c} = ${c * m}`, `b = ${answer.toLatex()}`],
          ],
        ],
        [
          `Put $b = ${answer.toLatex()}$ back. Then $${a}b + ${c}$ is $${c * m}$, and $\\ln ${c * m} - \\ln ${c}$ is $\\ln ${m}$, as required.`,
          `把 $b = ${answer.toLatex()}$ 代回。则 $${a}b + ${c}$ 等于 $${c * m}$，而 $\\ln ${c * m} - \\ln ${c}$ 等于 $\\ln ${m}$，符合要求。`,
        ],
      ),
    });
  },
};

const xTimesFOfXSquared: KnowledgePointDef = {
  id: "an-integral-of-x-times-f-of-x-squared",
  title: t("An integral of x times f of x squared", "x 乘以 x 平方的函数的积分"),
  explanation: t(
    "Substitution needs no formula for the outer function, only that the derivative of the inner one is present. In $\\int xf(x^2)\\,dx$, the choice $u = x^2$ gives $du = 2x\\,dx$, so the factor $x\\,dx$ becomes $\\frac{du}{2}$. The limits are squared as well, and a known integral of $f$ then finishes the work, even though $f$ itself stays unknown. For example, if $\\int_0^{9} f(u)\\,du$ is $10$, then $\\int_0^{3} xf(x^2)\\,dx$ is half of it, $5$.\n\nCheck: take $f(u) = 1$. Then $\\int_0^{3} x\\,dx$ is $\\frac{9}{2}$, and half of $\\int_0^{9} 1\\,du$ is $\\frac{9}{2}$ too.\n\n> **Watch out.** Square the limits as well. The upper limit $x = 3$ becomes $u = 9$, not $u = 3$.",
    "换元不需要外层函数的公式，只要内层函数的导数出现在被积式中。在 $\\int xf(x^2)\\,dx$ 中，取 $u = x^2$，则 $du = 2x\\,dx$，所以 $x\\,dx$ 变成 $\\frac{du}{2}$。积分限也要平方，再用已知的 $f$ 的积分就能得到结果，即使 $f$ 本身仍然未知。例如，若 $\\int_0^{9} f(u)\\,du$ 等于 $10$，则 $\\int_0^{3} xf(x^2)\\,dx$ 是它的一半，即 $5$。\n\n检验：取 $f(u) = 1$。则 $\\int_0^{3} x\\,dx$ 等于 $\\frac{9}{2}$，而 $\\int_0^{9} 1\\,du$ 的一半也是 $\\frac{9}{2}$。\n\n> **注意。** 积分限也要平方。上限 $x = 3$ 变成 $u = 9$，而不是 $u = 3$。",
  ),
  generate(rng) {
    const b = rng.int(2, 7);
    const k = rng.int(1, 6);
    const v = nonzero(rng, 12);
    const answer = Q.of(k * v, 2);
    const level = Q.of(v, b * b);
    const ck = coefficientOf(k);
    return numberProblem({
      prompt: t(
        `$\\int_0^{${b * b}} f(u)\\,du = ${v}$. Find $\\int_0^{${b}} ${ck}xf(x^2)\\,dx$.`,
        `$\\int_0^{${b * b}} f(u)\\,du = ${v}$。求 $\\int_0^{${b}} ${ck}xf(x^2)\\,dx$。`,
      ),
      answer,
      wrong: [Q.of(k * v), Q.of(2 * k * v), Q.of(k * v, b), Q.of(k * v, b * b)],
      solution: walkThrough(
        [
          [
            ["Substitute", "换元"],
            [
              `Let $u = x^2$. Then $du = 2x\\,dx$, and the limits $0$ and $${b}$ become $0$ and $${b * b}$:`,
              `令 $u = x^2$，则 $du = 2x\\,dx$，积分限 $0$ 和 $${b}$ 变成 $0$ 和 $${b * b}$：`,
            ],
            [`${ck}x\\,dx = \\frac{${k}}{2}\\,du`],
          ],
          [
            ["Use the known integral", "用已知的积分"],
            ["The integral in $u$ is the one given:", "关于 $u$ 的积分正是已知的那个："],
            [
              `\\int_0^{${b}} ${ck}xf(x^2)\\,dx = \\frac{${k}}{2}\\int_0^{${b * b}} f(u)\\,du = \\frac{${k}}{2} \\cdot ${inParens(v)} = ${answer.toLatex()}`,
            ],
          ],
        ],
        [
          `Try the constant function $f = c$ with the given integral. Then $${b * b}c = ${v}$, so $c$ is $${level.toLatex()}$. The integral is $c$ times $\\int_0^{${b}} ${ck}x\\,dx$, which is $${Q.of(k * b * b, 2).toLatex()} \\cdot ${parQ(level)}$, or $${answer.toLatex()}$ again.`,
          `取满足已知积分的常函数 $f = c$。则 $${b * b}c = ${v}$，所以 $c$ 等于 $${level.toLatex()}$。积分等于 $c$ 乘以 $\\int_0^{${b}} ${ck}x\\,dx$，即 $${Q.of(k * b * b, 2).toLatex()} \\cdot ${parQ(level)}$，同样是 $${answer.toLatex()}$。`,
        ],
      ),
    });
  },
};

const xSquaredInTermsOfU: KnowledgePointDef = {
  id: "rewriting-x-squared-in-terms-of-u",
  title: t("Rewriting x squared in terms of u", "把 x 的平方写成 u 的式子"),
  explanation: t(
    "When $u = x - a$, a factor of $x^2$ outside the power must also be converted. Since $x = u + a$, the square expands into three terms, each a power of $u$ with its own coefficient. Multiplying them by the power of $u$ leaves a polynomial that can be integrated term by term, with the limits changed to values of $u$. For example, with $u = x - 1$, the integral $\\int_1^{2} x^2(x - 1)^{3}\\,dx$ becomes $\\int_0^{1} (u^2 + 2u + 1)u^{3}\\,du$, which is $\\frac{1}{6} + \\frac{2}{5} + \\frac{1}{4}$.\n\nCheck: $(u + 1)^2$ expands to $u^2 + 2u + 1$, and putting back $u = x - 1$ turns $u + 1$ into $x$, so the square is $x^2$.\n\n> **Watch out.** Change the limits with the substitution. With $u = x - a$, the limits $x = a$ and $x = a + 1$ become $u = 0$ and $u = 1$; keeping the old limits gives a different number.",
    "令 $u = x - a$ 时，幂外面的因子 $x^2$ 也必须转换。因为 $x = u + a$，平方展开成三项，每项都是 $u$ 的幂，各有系数。再乘以 $u$ 的幂，就得到可以逐项积分的多项式，积分限也要换成 $u$ 的值。例如，令 $u = x - 1$，积分 $\\int_1^{2} x^2(x - 1)^{3}\\,dx$ 变成 $\\int_0^{1} (u^2 + 2u + 1)u^{3}\\,du$，即 $\\frac{1}{6} + \\frac{2}{5} + \\frac{1}{4}$。\n\n检验：$(u + 1)^2$ 展开得 $u^2 + 2u + 1$，代回 $u = x - 1$ 后 $u + 1$ 变成 $x$，所以这个平方就是 $x^2$。\n\n> **注意。** 积分限要随换元一起改变。令 $u = x - a$，积分限 $x = a$ 和 $x = a + 1$ 变成 $u = 0$ 和 $u = 1$；沿用旧的积分限会得到不同的数。",
  ),
  generate(rng) {
    const a = nonzero(rng, 5);
    const n = rng.int(2, 5);
    const inner = poly([1, "x"], [-a, ""]);
    const one = Q.of(1, n + 3);
    const two = Q.of(2 * a, n + 2);
    const three = Q.of(a * a, n + 1);
    const answer = one.add(two).add(three);
    const expanded = poly([1, `u^${n + 2}`], [2 * a, `u^${n + 1}`], [a * a, `u^${n}`]);
    const square = poly([1, "u^2"], [2 * a, "u"], [a * a, ""]);
    const sum = poly([one, ""], [two, ""], [three, ""]);
    const x = poly([1, "u"], [a, ""]);
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_{${a}}^{${a + 1}} x^2(${inner})^{${n}}\\,dx$.`,
        `计算 $\\int_{${a}}^{${a + 1}} x^2(${inner})^{${n}}\\,dx$。`,
      ),
      answer,
      wrong: [one.add(three), one.add(Q.of(a, n + 2)).add(three), Q.of((a + 1) * (a + 1), n + 1), one],
      solution: walkThrough(
        [
          [
            ["Substitute", "换元"],
            [
              `Let $u = ${inner}$. Then $x = ${x}$, $du = dx$, and the limits $x = ${a}$ and $x = ${a + 1}$ become $u = 0$ and $u = 1$. The square becomes:`,
              `令 $u = ${inner}$，则 $x = ${x}$，$du = dx$，积分限 $x = ${a}$ 和 $x = ${a + 1}$ 变成 $u = 0$ 和 $u = 1$。平方变成：`,
            ],
            [`x^2 = (${x})^2 = ${square}`],
          ],
          [
            ["Expand", "展开"],
            [`Multiply by $u^{${n}}$:`, `乘以 $u^{${n}}$：`],
            [`\\int_{${a}}^{${a + 1}} x^2(${inner})^{${n}}\\,dx = \\int_0^1 \\left(${expanded}\\right)du`],
          ],
          [
            ["Integrate term by term", "逐项积分"],
            [
              "Over $[0, 1]$, each power $u^{p}$ integrates to one over $p + 1$:",
              "在 $[0, 1]$ 上，每个幂 $u^{p}$ 的积分是 $p + 1$ 的倒数：",
            ],
            [`${sum} = ${answer.toLatex()}`],
          ],
        ],
        [
          `Test the expansion at $u = 1$, where $x$ is $${a + 1}$. There $x^2$ is $${(a + 1) ** 2}$, and $${square}$ is $1 + ${inParens(2 * a)} + ${a * a}$, which is $${(a + 1) ** 2}$ as well. So the integrand was rewritten correctly, and each term was integrated by the power rule.`,
          `在 $u = 1$ 处检验展开式，这时 $x$ 等于 $${a + 1}$。$x^2$ 等于 $${(a + 1) ** 2}$，而 $${square}$ 等于 $1 + ${inParens(2 * a)} + ${a * a}$，同样是 $${(a + 1) ** 2}$。所以被积式改写正确，每一项都按幂法则积分。`,
        ],
      ),
    });
  },
};

const arsinhAsLogarithm: KnowledgePointDef = {
  id: "an-inverse-hyperbolic-integral-as-a-logarithm",
  title: t("An inverse hyperbolic integral as a logarithm", "把反双曲积分写成对数"),
  explanation: t(
    "An inverse hyperbolic function is a logarithm in disguise, which is how a definite integral producing one gets a closed value. From $\\operatorname{arsinh} z = \\ln\\left(z + \\sqrt{z^2 + 1}\\right)$, the value of the antiderivative at a limit becomes a single logarithm. It is cleanest when the root is rational, as it is for the sides of a right triangle with whole sides. For example, $\\int_0^{4} \\frac{dx}{\\sqrt{x^2 + 9}}$ is $\\operatorname{arsinh}\\frac{4}{3}$; with $z = \\frac{4}{3}$ the root $\\sqrt{z^2 + 1}$ is $\\frac{5}{3}$, so the value is $\\ln 3$.\n\nCheck: $\\sinh(\\ln 3)$ is $\\frac{1}{2}\\left(3 - \\frac{1}{3}\\right)$, which is $\\frac{4}{3}$, so $\\operatorname{arsinh}\\frac{4}{3}$ is indeed $\\ln 3$.\n\n> **Watch out.** The argument is $\\frac{x}{a}$, not $x$. If you use $\\ln\\left(x + \\sqrt{x^2 + a^2}\\right)$ instead, subtract its value $\\ln a$ at the lower limit.",
    "反双曲函数其实就是对数，所以结果含反双曲函数的定积分可以化成确定的值。由 $\\operatorname{arsinh} z = \\ln\\left(z + \\sqrt{z^2 + 1}\\right)$，原函数在积分限处的值就是一个对数。当根式是有理数时最简洁，比如边长都是整数的直角三角形的情形。例如，$\\int_0^{4} \\frac{dx}{\\sqrt{x^2 + 9}}$ 等于 $\\operatorname{arsinh}\\frac{4}{3}$；取 $z = \\frac{4}{3}$，根式 $\\sqrt{z^2 + 1}$ 等于 $\\frac{5}{3}$，所以积分值是 $\\ln 3$。\n\n检验：$\\sinh(\\ln 3)$ 等于 $\\frac{1}{2}\\left(3 - \\frac{1}{3}\\right)$，即 $\\frac{4}{3}$，所以 $\\operatorname{arsinh}\\frac{4}{3}$ 确实等于 $\\ln 3$。\n\n> **注意。** 自变量是 $\\frac{x}{a}$，不是 $x$。如果改用 $\\ln\\left(x + \\sqrt{x^2 + a^2}\\right)$，就要减去它在下限处的值 $\\ln a$。",
  ),
  generate(rng) {
    const { a, b, h } = pythagorean(rng);
    const s = rng.int(1, 3);
    const A = s * a;
    const B = s * b;
    const H = s * h;
    const answer = Q.of(B + H, A);
    const z = Q.of(B, A).toLatex();
    const root = Q.of(H, A).toLatex();
    return numberProblem({
      prompt: t(
        `$\\int_0^{${B}} \\frac{dx}{\\sqrt{x^2 + ${A * A}}} = \\ln c$. Find $c$.`,
        `$\\int_0^{${B}} \\frac{dx}{\\sqrt{x^2 + ${A * A}}} = \\ln c$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(B + H), Q.of(H, A), Q.of(B, A), Q.of(A + H, B)],
      solution: walkThrough(
        [
          [
            ["Find the value as an arsinh", "写成 arsinh 的值"],
            [
              `This is the arsinh form with $a = ${A}$. The antiderivative $\\operatorname{arsinh}\\frac{x}{${A}}$ is $0$ at $x = 0$:`,
              `这是 $a = ${A}$ 的 arsinh 形式。原函数 $\\operatorname{arsinh}\\frac{x}{${A}}$ 在 $x = 0$ 处为 $0$：`,
            ],
            [`\\int_0^{${B}} \\frac{dx}{\\sqrt{x^2 + ${A * A}}} = \\operatorname{arsinh}\\left(${z}\\right)`],
          ],
          [
            ["Write it as a logarithm", "写成对数"],
            [
              `With $z = ${z}$, the root $\\sqrt{z^2 + 1}$ is $${root}$, so the value is a single logarithm and $c$ is the sum inside it:`,
              `取 $z = ${z}$，根式 $\\sqrt{z^2 + 1}$ 等于 $${root}$，所以积分值是一个对数，$c$ 就是对数里的和：`,
            ],
            [`\\ln\\left(${z} + ${root}\\right) = \\ln ${answer.toLatex()}`],
          ],
        ],
        [
          `Use the antiderivative $\\ln\\left(x + \\sqrt{x^2 + ${A * A}}\\right)$ instead. At $x = ${B}$ it is $\\ln(${B} + ${H})$ and at $x = 0$ it is $\\ln ${A}$, so the value is $\\ln\\frac{${B + H}}{${A}}$, the same $c$.`,
          `改用原函数 $\\ln\\left(x + \\sqrt{x^2 + ${A * A}}\\right)$。它在 $x = ${B}$ 处为 $\\ln(${B} + ${H})$，在 $x = 0$ 处为 $\\ln ${A}$，所以积分值是 $\\ln\\frac{${B + H}}{${A}}$，$c$ 相同。`,
        ],
      ),
    });
  },
};

const constantRemovingLogarithm: KnowledgePointDef = {
  id: "the-constant-that-removes-the-logarithm",
  title: t("The constant that removes the logarithm", "消去对数项的常数"),
  explanation: t(
    "Dividing a quadratic by $x - a$ leaves a polynomial quotient and a constant remainder $R$. The quotient integrates to a polynomial, and only the fraction $\\frac{R}{x - a}$ produces a logarithm. So an antiderivative free of logarithms means the remainder is zero, and the remainder theorem gives it as the value of the numerator at $x = a$. For example, $\\frac{x^2 + x + k}{x - 2}$ has the quotient $x + 3$ and the remainder $6 + k$, so $k = -6$ removes the logarithm.\n\nCheck: with $k = -6$ the numerator $x^2 + x - 6$ factors as $(x - 2)(x + 3)$, so the fraction is just $x + 3$.\n\n> **Watch out.** The remainder is the numerator's value at $x = a$, not at $x = -a$. For the divisor $x - 2$, evaluate at $2$.",
    "二次式除以 $x - a$，得到多项式商和常数余数 $R$。商积分后仍是多项式，只有分式 $\\frac{R}{x - a}$ 才产生对数。所以原函数不含对数就意味着余数为零，而由余数定理，余数就是分子在 $x = a$ 处的值。例如，$\\frac{x^2 + x + k}{x - 2}$ 的商是 $x + 3$，余数是 $6 + k$，所以 $k = -6$ 时对数消失。\n\n检验：$k = -6$ 时，分子 $x^2 + x - 6$ 分解为 $(x - 2)(x + 3)$，所以这个分式就是 $x + 3$。\n\n> **注意。** 余数是分子在 $x = a$ 处的值，而不是在 $x = -a$ 处的值。除式是 $x - 2$ 时，要在 $2$ 处求值。",
  ),
  generate(rng) {
    const a = nonzero(rng, 6);
    const b = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter((v) => v !== -a));
    const answer = -a * (a + b);
    const denominator = poly([1, "x"], [-a, ""]);
    const numerator = poly([1, "x^2"], [b, "x"]);
    const quotient = poly([1, "x"], [a + b, ""]);
    const remainder = `${a * a} + ${inParens(a * b)} + k`;
    return numberProblem({
      prompt: t(
        `The antiderivative of $\\frac{${numerator} + k}{${denominator}}$ contains no logarithm. Find $k$.`,
        `$\\frac{${numerator} + k}{${denominator}}$ 的原函数不含对数。求 $k$。`,
      ),
      answer,
      form: "integer",
      wrong: [a * (a + b), a * a - a * b, a * b, -(a * a) - b],
      solution: walkThrough(
        [
          [
            ["Divide", "做除法"],
            [
              `Dividing by $${denominator}$ gives the quotient $${quotient}$ and a constant remainder, which is the numerator's value at $x = ${a}$:`,
              `除以 $${denominator}$，商是 $${quotient}$，余数是常数，等于分子在 $x = ${a}$ 处的值：`,
            ],
            [`R = ${remainder}`],
          ],
          [
            ["Remove the logarithm", "消去对数"],
            [
              `Only the term $\\frac{R}{${denominator}}$ integrates to a logarithm, so the remainder must be $0$:`,
              `只有 $\\frac{R}{${denominator}}$ 这一项积分后是对数，所以余数必须为 $0$：`,
            ],
            [`${remainder} = 0`, `k = ${answer}`],
          ],
        ],
        [
          `With $k = ${answer}$, the numerator is $${poly([1, "x^2"], [b, "x"], [answer, ""])}$, which factors as $(${denominator})(${quotient})$. The fraction is then just $${quotient}$, whose antiderivative has no logarithm.`,
          `$k = ${answer}$ 时，分子是 $${poly([1, "x^2"], [b, "x"], [answer, ""])}$，可以分解为 $(${denominator})(${quotient})$。于是分式就是 $${quotient}$，它的原函数不含对数。`,
        ],
      ),
    });
  },
};

const linearOverCompletedSquare: KnowledgePointDef = {
  id: "a-linear-numerator-over-a-completed-square",
  title: t("A linear numerator over a completed square", "配方后分子为一次式的积分"),
  explanation: t(
    "When the numerator contains $x$, split it before completing the square. One part is a multiple of the derivative of the denominator, and it integrates to a logarithm. What remains is a constant over the completed square, and it integrates to an arctangent. The coefficient of the arctangent depends on the constant left over after the split, not on the original constant. For example:\n\n$$\\frac{x + 3}{x^2 - 2x + 5} = \\frac{1}{2} \\cdot \\frac{2x - 2}{x^2 - 2x + 5} + \\frac{4}{(x - 1)^2 + 4}.$$\n\nThe last term integrates to $2\\arctan\\frac{x - 1}{2}$.\n\nCheck: the two numerators add back to the original, since $\\frac{1}{2}(2x - 2) + 4$ is $x + 3$.\n\n> **Watch out.** The arctangent coefficient uses the leftover constant $4$, not the original $3$, and it is divided by $a = 2$.",
    "分子含 $x$ 时，先把它拆开，再配方。一部分是分母导数的倍数，积分得到对数。剩下的是常数除以配方后的式子，积分得到反正切。反正切的系数取决于拆分后剩下的常数，而不是原来的常数项。例如：\n\n$$\\frac{x + 3}{x^2 - 2x + 5} = \\frac{1}{2} \\cdot \\frac{2x - 2}{x^2 - 2x + 5} + \\frac{4}{(x - 1)^2 + 4}$$\n\n最后一项积分得 $2\\arctan\\frac{x - 1}{2}$。\n\n检验：两部分的分子加起来就是原分子，因为 $\\frac{1}{2}(2x - 2) + 4$ 等于 $x + 3$。\n\n> **注意。** 反正切的系数用的是剩下的常数 $4$，而不是原来的 $3$，还要除以 $a = 2$。",
  ),
  generate(rng) {
    const m = rng.int(1, 4);
    const p = nonzero(rng, 4);
    const a = rng.int(1, 4);
    const n = rng.pick([-7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7].filter((v) => v + m * p !== 0));
    const rest = n + m * p;
    const answer = Q.of(rest, a);
    const numerator = poly([m, "x"], [n, ""]);
    const denominator = poly([1, "x^2"], [-2 * p, "x"], [p * p + a * a, ""]);
    const inner = poly([1, "x"], [-p, ""]);
    const arc = a === 1 ? `\\arctan(${inner})` : `\\arctan\\frac{${inner}}{${a}}`;
    const half = fractionBefore(m, 2);
    const form = `${half}\\ln(${denominator}) + K${arc} + C`;
    const split = `${half}(${poly([2, "x"], [-2 * p, ""])}) ${rest < 0 ? "-" : "+"} ${Math.abs(rest)}`;
    const square = `(${inner})^2 + ${a * a}`;
    const constant = `${rest < 0 ? "-" : ""}\\frac{${Math.abs(rest)}}{${square}}`;
    return numberProblem({
      prompt: t(
        `An antiderivative of $\\frac{${numerator}}{${denominator}}$ has the form $${form}$. Find $K$.`,
        `$\\frac{${numerator}}{${denominator}}$ 的原函数形如 $${form}$。求 $K$。`,
      ),
      answer,
      wrong: [Q.of(n, a), Q.of(n - m * p, a), Q.of(rest), Q.of(rest, 2 * a), answer.neg()],
      solution: walkThrough(
        [
          [
            ["Split the numerator", "拆开分子"],
            [
              `The derivative of the denominator is $${poly([2, "x"], [-2 * p, ""])}$. Write the numerator as a multiple of it plus a constant; that multiple gives the logarithm:`,
              `分母的导数是 $${poly([2, "x"], [-2 * p, ""])}$。把分子写成它的倍数加一个常数，这个倍数给出对数：`,
            ],
            [`${numerator} = ${split}`],
          ],
          [
            ["Complete the square", "配方"],
            ["The leftover constant goes over the completed square:", "剩下的常数放在配方后的式子上："],
            [`${denominator} = ${square}`],
          ],
          [
            ["Integrate the constant term", "积分常数项"],
            [
              `The arctangent form has the factor $\\frac{1}{${a}}$, so the coefficient is the leftover constant divided by $${a}$:`,
              `反正切形式带有因子 $\\frac{1}{${a}}$，所以系数是剩下的常数除以 $${a}$：`,
            ],
            [`\\int ${constant}\\,dx = ${coefQ(answer)}${arc} + C`, `K = ${answer.toLatex()}`],
          ],
        ],
        [
          `Differentiate the arctangent term. The result should be the constant term:${steps(`\\frac{d}{dx}\\left[${coefQ(answer)}${arc}\\right] = ${answer.toLatex()} \\cdot \\frac{${a}}{${square}} = ${constant}`).trimEnd()}`,
          `对反正切项求导，结果应当等于常数项：${steps(`\\frac{d}{dx}\\left[${coefQ(answer)}${arc}\\right] = ${answer.toLatex()} \\cdot \\frac{${a}}{${square}} = ${constant}`).trimEnd()}`,
        ],
      ),
    });
  },
};

const powerOfCoshAndSinh: KnowledgePointDef = {
  id: "powers-of-cosh-plus-or-minus-sinh",
  title: t("Powers of cosh plus or minus sinh", "cosh 加减 sinh 的幂"),
  explanation: t(
    "Adding and subtracting the definitions of the hyperbolic functions gives two short identities: $\\cosh x + \\sinh x = e^x$ and $\\cosh x - \\sinh x = e^{-x}$. A power of either is therefore a single exponential, with no need to expand the bracket. A logarithm in the limit then cancels the exponential when the result is evaluated. For example, $\\int_0^{\\ln 2} (\\cosh x + \\sinh x)^2\\,dx = \\int_0^{\\ln 2} e^{2x}\\,dx = \\frac{4 - 1}{2} = \\frac{3}{2}$.\n\nCheck: at $x = 0$, $\\cosh 0 + \\sinh 0 = 1 = e^0$ and $\\cosh 0 - \\sinh 0 = 1 = e^{-0}$, as the identities say.\n\n> **Watch out.** $e^{n\\ln a} = a^n$, and integrating $e^{nx}$ divides by $n$. With the minus sign the exponential is $e^{-nx}$, whose antiderivative is $-\\frac{e^{-nx}}{n}$.",
    "把双曲函数的定义相加、相减，得到两个简单的恒等式：$\\cosh x + \\sinh x = e^x$，$\\cosh x - \\sinh x = e^{-x}$。所以它们的幂都只是一个指数函数，不必展开括号。求值时，积分限中的对数会与指数相互抵消。例如，$\\int_0^{\\ln 2} (\\cosh x + \\sinh x)^2\\,dx = \\int_0^{\\ln 2} e^{2x}\\,dx = \\frac{4 - 1}{2} = \\frac{3}{2}$。\n\n检验：在 $x = 0$ 处，$\\cosh 0 + \\sinh 0 = 1 = e^0$，$\\cosh 0 - \\sinh 0 = 1 = e^{-0}$，与恒等式一致。\n\n> **注意。** $e^{n\\ln a} = a^n$，积分 $e^{nx}$ 要除以 $n$。取减号时指数函数是 $e^{-nx}$，它的原函数是 $-\\frac{e^{-nx}}{n}$。",
  ),
  generate(rng) {
    const plus = rng.pick([true, false]);
    const n = rng.int(1, 3);
    const a = rng.int(2, 5);
    const k = rng.int(1, 6);
    const power = a ** n;
    const bracket = `(\\cosh x ${plus ? "+" : "-"} \\sinh x)${n === 1 ? "" : `^{${n}}`}`;
    const up = Q.of(k * (power - 1), n);
    const down = Q.of(k * (power - 1), n * power);
    const answer = plus ? up : down;
    const exponent = `${plus ? "" : "-"}${coefficientOf(n)}x`;
    const work = plus ? `${fractionBefore(k, n)}(${power} - 1)` : `${fractionBefore(k, n)}\\left(1 - ${Q.of(1, power).toLatex()}\\right)`;
    const ePower = `e^{${exponent}}`;
    const evaluated = plus ? `\\left[e^{${exponent}}\\right]_0^{\\ln ${a}}` : `\\left[-e^{${exponent}}\\right]_0^{\\ln ${a}}`;
    const why = (value: Q, en: string, zh: string) => ({ value, why: t(en, zh) });
    const skipped = why(
      plus ? Q.of(k * (power - 1)) : Q.of(k * (power - 1), power),
      `Integrating $${ePower}$ divides by $${n}$; this skips the division.`,
      `积分 $${ePower}$ 要除以 $${n}$；这里漏掉了除法。`,
    );
    const mistakes = plus
      ? [
          skipped,
          why(Q.of(k * power, n), "The lower limit gives $e^0 = 1$, which must be subtracted.", "下限给出 $e^0 = 1$，要把它减去。"),
          why(
            down,
            "This uses $e^{-x}$, which is $\\cosh x - \\sinh x$; with a plus sign the bracket is $e^{x}$.",
            "这里用的是 $e^{-x}$，即 $\\cosh x - \\sinh x$；取加号时括号是 $e^{x}$。",
          ),
          why(Q.of(k * (power + 1), n), "At the lower limit $e^0 = 1$ is subtracted, not added.", "下限处的 $e^0 = 1$ 要减去，不是加上。"),
        ]
      : [
          skipped,
          why(
            Q.of(k, n * power),
            "This uses only the value at the upper limit, with its sign changed; the value at $x = 0$ also counts.",
            "这里只用了上限处的值并改了符号；$x = 0$ 处的值也要计入。",
          ),
          why(
            up,
            "This uses $e^{x}$, which is $\\cosh x + \\sinh x$; with a minus sign the bracket is $e^{-x}$.",
            "这里用的是 $e^{x}$，即 $\\cosh x + \\sinh x$；取减号时括号是 $e^{-x}$。",
          ),
          why(
            Q.of(k * (power + 1), n * power),
            `The values at the two limits are subtracted, $F(\\ln ${a}) - F(0)$, not added.`,
            `两个积分限处的值要相减，即 $F(\\ln ${a}) - F(0)$，不是相加。`,
          ),
          why(
            down.neg(),
            `The antiderivative of $${ePower}$ is $-\\frac{${ePower}}{${n}}$; with its minus sign the result is positive.`,
            `$${ePower}$ 的原函数是 $-\\frac{${ePower}}{${n}}$；算上这个负号，结果是正的。`,
          ),
        ];
    return numberProblem({
      prompt: t(
        `Evaluate $\\int_0^{\\ln ${a}} ${coefficientOf(k)}${bracket}\\,dx$.`,
        `计算 $\\int_0^{\\ln ${a}} ${coefficientOf(k)}${bracket}\\,dx$。`,
      ),
      answer,
      mistakes,
      solution: walkThrough(
        [
          [
            ["Use the identity", "用恒等式"],
            [
              `$\\cosh x ${plus ? "+" : "-"} \\sinh x = e^{${plus ? "" : "-"}x}$, so the power is one exponential:`,
              `$\\cosh x ${plus ? "+" : "-"} \\sinh x = e^{${plus ? "" : "-"}x}$，所以这个幂就是一个指数函数：`,
            ],
            [`${bracket} = ${ePower}`],
          ],
          [
            ["Integrate", "积分"],
            [
              `Use $e^{${plus ? "" : "-"}${n}\\ln ${a}} = ${plus ? power : Q.of(1, power).toLatex()}$:`,
              `利用 $e^{${plus ? "" : "-"}${n}\\ln ${a}} = ${plus ? power : Q.of(1, power).toLatex()}$：`,
            ],
            [
              `\\int_0^{\\ln ${a}} ${coefficientOf(k)}${ePower}\\,dx = ${fractionBefore(k, n)}${evaluated}`,
              `= ${work} = ${answer.toLatex()}`,
            ],
          ],
        ],
        [
          `Check the identity at the upper limit with the definitions: $\\cosh(\\ln ${a}) = \\frac{${a} + ${Q.of(1, a).toLatex()}}{2}$ and $\\sinh(\\ln ${a}) = \\frac{${a} - ${Q.of(1, a).toLatex()}}{2}$, so their ${plus ? "sum" : "difference"} is $${plus ? a : Q.of(1, a).toLatex()}$, which is $e^{${plus ? "" : "-"}\\ln ${a}}$. The integrand is right, and its antiderivative gives $${answer.toLatex()}$.`,
          `用定义在上限处检验恒等式：$\\cosh(\\ln ${a}) = \\frac{${a} + ${Q.of(1, a).toLatex()}}{2}$，$\\sinh(\\ln ${a}) = \\frac{${a} - ${Q.of(1, a).toLatex()}}{2}$，二者之${plus ? "和" : "差"}是 $${plus ? a : Q.of(1, a).toLatex()}$，正是 $e^{${plus ? "" : "-"}\\ln ${a}}$。被积函数无误，它的原函数给出 $${answer.toLatex()}$。`,
        ],
      ),
    });
  },
};

const evenPowerOfSech: KnowledgePointDef = {
  id: "an-even-power-of-sech",
  title: t("An even power of sech", "sech 的偶次幂"),
  explanation: t(
    "The derivative of $\\tanh x$ is $\\operatorname{sech}^2 x$, so one factor of $\\operatorname{sech}^2 x$ can be saved for the differential. The rest is converted by the identity $\\operatorname{sech}^2 x = 1 - \\tanh^2 x$. With $u = \\tanh x$, the integrand is then a polynomial in $u$. For example, if $\\tanh b = \\frac{1}{2}$, then $\\int_0^b \\operatorname{sech}^4 x\\,dx = \\int_0^{1/2} (1 - u^2)\\,du = \\frac{1}{2} - \\frac{1}{24} = \\frac{11}{24}$.\n\nCheck: $\\operatorname{sech}^4 x \\le \\operatorname{sech}^2 x$, so the integral is at most $\\int_0^b \\operatorname{sech}^2 x\\,dx = \\tanh b = \\frac{1}{2}$; indeed $\\frac{11}{24} < \\frac{1}{2}$.\n\n> **Watch out.** The identity has a minus sign, $\\operatorname{sech}^2 x = 1 - \\tanh^2 x$, unlike $\\sec^2 x = 1 + \\tan^2 x$. And $u$ runs from $\\tanh 0 = 0$ to $\\tanh b$.",
    "$\\tanh x$ 的导数是 $\\operatorname{sech}^2 x$，所以可以留出一个 $\\operatorname{sech}^2 x$ 作微分。其余部分用恒等式 $\\operatorname{sech}^2 x = 1 - \\tanh^2 x$ 转换。令 $u = \\tanh x$，被积函数就成为 $u$ 的多项式。例如，若 $\\tanh b = \\frac{1}{2}$，则 $\\int_0^b \\operatorname{sech}^4 x\\,dx = \\int_0^{1/2} (1 - u^2)\\,du = \\frac{1}{2} - \\frac{1}{24} = \\frac{11}{24}$。\n\n检验：$\\operatorname{sech}^4 x \\le \\operatorname{sech}^2 x$，所以积分至多是 $\\int_0^b \\operatorname{sech}^2 x\\,dx = \\tanh b = \\frac{1}{2}$；确实 $\\frac{11}{24} < \\frac{1}{2}$。\n\n> **注意。** 恒等式带减号：$\\operatorname{sech}^2 x = 1 - \\tanh^2 x$，与 $\\sec^2 x = 1 + \\tan^2 x$ 不同。而且 $u$ 从 $\\tanh 0 = 0$ 变到 $\\tanh b$。",
  ),
  generate(rng) {
    const [p, q] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [1, 5],
      [3, 5],
      [4, 5],
    ]) as [number, number];
    const k = rng.int(1, 6);
    const T = Q.of(p, q);
    const times = Q.of(k);
    const cubeThird = T.pow(3).div(Q.of(3));
    const answer = T.sub(cubeThird).mul(times);
    const K = coefficientOf(k);
    return numberProblem({
      prompt: t(
        `$\\tanh b = ${T.toLatex()}$ with $b > 0$. Evaluate $\\int_0^b ${K}\\operatorname{sech}^4 x\\,dx$.`,
        `$\\tanh b = ${T.toLatex()}$，$b > 0$。计算 $\\int_0^b ${K}\\operatorname{sech}^4 x\\,dx$。`,
      ),
      answer,
      mistakes: [
        {
          value: T.mul(times),
          why: t(
            "This integrates $\\operatorname{sech}^4 x$ as if it were $\\operatorname{sech}^2 x$; the factor $1 - \\tanh^2 x$ takes away $\\frac{u^3}{3}$.",
            "这是把 $\\operatorname{sech}^4 x$ 当成 $\\operatorname{sech}^2 x$ 来积分；因子 $1 - \\tanh^2 x$ 还要减去 $\\frac{u^3}{3}$。",
          ),
        },
        {
          value: T.add(cubeThird).mul(times),
          why: t(
            "The identity is $\\operatorname{sech}^2 x = 1 - \\tanh^2 x$, with a minus sign; $1 + \\tan^2 x$ is the identity for ordinary secant.",
            "恒等式是 $\\operatorname{sech}^2 x = 1 - \\tanh^2 x$，带减号；$1 + \\tan^2 x$ 是普通正割的恒等式。",
          ),
        },
        {
          value: cubeThird.mul(times),
          why: t(
            "This integrates only the $u^2$ part of $1 - u^2$; the $1$ gives the main term $u$, and the $u^2$ part is subtracted.",
            "这里只积分了 $1 - u^2$ 中的 $u^2$ 部分；其中的 $1$ 给出主要的一项 $u$，$u^2$ 部分是减去的。",
          ),
        },
        {
          value: T.sub(T.pow(3)).mul(times),
          why: t(
            "$\\int u^2\\,du = \\frac{u^3}{3}$; the division by $3$ is missing.",
            "$\\int u^2\\,du = \\frac{u^3}{3}$；漏掉了除以 $3$。",
          ),
        },
      ],
      solution: walkThrough(
        [
          [
            ["Save one factor of sech²x", "留出一个 sech²x"],
            [
              "Convert the rest with $\\operatorname{sech}^2 x = 1 - \\tanh^2 x$:",
              "其余部分用 $\\operatorname{sech}^2 x = 1 - \\tanh^2 x$ 转换：",
            ],
            ["\\operatorname{sech}^4 x = (1 - \\tanh^2 x)\\operatorname{sech}^2 x"],
          ],
          [
            ["Substitute", "换元"],
            [
              `Let $u = \\tanh x$, so $du = \\operatorname{sech}^2 x\\,dx$ and $u$ runs from $0$ to $${T.toLatex()}$:`,
              `令 $u = \\tanh x$，则 $du = \\operatorname{sech}^2 x\\,dx$，$u$ 从 $0$ 变到 $${T.toLatex()}$：`,
            ],
            [
              `\\int_0^b ${K}\\operatorname{sech}^4 x\\,dx = ${K}\\int_0^{${T.toLatex()}} (1 - u^2)\\,du = ${K}\\left[u - \\frac{u^3}{3}\\right]_0^{${T.toLatex()}}`,
              `= ${k === 1 ? "" : `${k}\\left(`}${T.toLatex()} - ${cubeThird.toLatex()}${k === 1 ? "" : "\\right)"} = ${answer.toLatex()}`,
            ],
          ],
        ],
        [
          `Differentiate $F(x) = \\tanh x - \\frac{\\tanh^3 x}{3}$: $F'(x) = \\operatorname{sech}^2 x - \\tanh^2 x\\operatorname{sech}^2 x = \\operatorname{sech}^4 x$. Also the answer must lie below ${k === 1 ? "" : `$${k}$ times `}$\\tanh b = ${T.toLatex()}$, since $\\operatorname{sech}^4 x \\le \\operatorname{sech}^2 x$, and $${answer.toLatex()}$ does.`,
          `对 $F(x) = \\tanh x - \\frac{\\tanh^3 x}{3}$ 求导：$F'(x) = \\operatorname{sech}^2 x - \\tanh^2 x\\operatorname{sech}^2 x = \\operatorname{sech}^4 x$。另外，由于 $\\operatorname{sech}^4 x \\le \\operatorname{sech}^2 x$，答案应小于${k === 1 ? "" : ` $${k}$ 乘以`} $\\tanh b = ${T.toLatex()}$，而 $${answer.toLatex()}$ 确实如此。`,
        ],
      ),
    });
  },
};

const fourthPowerOfHyperbolic: KnowledgePointDef = {
  id: "a-fourth-power-of-sinh-or-cosh",
  title: t("A fourth power of sinh or cosh", "sinh 或 cosh 的四次幂"),
  explanation: t(
    "One double angle formula turns a fourth power into the square of a sum, and that square contains $\\cosh^2 2x$, which needs the formula a second time. Only then is every term a constant or a single hyperbolic cosine, ready to integrate. The sign of the middle term depends on whether the starting function was $\\sinh$ or $\\cosh$. For example, $\\cosh^4 x = \\left(\\frac{\\cosh 2x + 1}{2}\\right)^2 = \\frac{1}{4}\\cosh^2 2x + \\frac{1}{2}\\cosh 2x + \\frac{1}{4} = \\frac{3}{8} + \\frac{1}{2}\\cosh 2x + \\frac{1}{8}\\cosh 4x$.\n\nCheck: at $x = 0$ both sides equal $1$: $\\frac{3}{8} + \\frac{1}{2} + \\frac{1}{8} = 1$.\n\n> **Watch out.** $\\cosh^2 2x = \\frac{\\cosh 4x + 1}{2}$ adds $\\frac{1}{8}$ to the constant, and integrating $\\cosh 4x$ divides by $4$.",
    "用一次二倍角公式，四次幂变成一个和的平方，而这个平方中含有 $\\cosh^2 2x$，需要再用一次公式。这样每一项才都是常数或单个双曲余弦，可以积分。中间一项的符号取决于开始时是 $\\sinh$ 还是 $\\cosh$。例如，$\\cosh^4 x = \\left(\\frac{\\cosh 2x + 1}{2}\\right)^2 = \\frac{1}{4}\\cosh^2 2x + \\frac{1}{2}\\cosh 2x + \\frac{1}{4} = \\frac{3}{8} + \\frac{1}{2}\\cosh 2x + \\frac{1}{8}\\cosh 4x$。\n\n检验：在 $x = 0$ 处两边都等于 $1$：$\\frac{3}{8} + \\frac{1}{2} + \\frac{1}{8} = 1$。\n\n> **注意。** $\\cosh^2 2x = \\frac{\\cosh 4x + 1}{2}$ 给常数项加上 $\\frac{1}{8}$，而积分 $\\cosh 4x$ 要除以 $4$。",
  ),
  generate(rng) {
    const cosh = rng.pick([true, false]);
    const k = nonzero(rng, 8);
    const letter = rng.pick(["A", "B", "D"]);
    const sign = cosh ? 1 : -1;
    const fn = cosh ? "\\cosh" : "\\sinh";
    const answer = letter === "A" ? Q.of(3 * k, 8) : letter === "B" ? Q.of(sign * k, 4) : Q.of(k, 32);
    const why = (value: Q, en: string, zh: string) => ({ value, why: t(en, zh) });
    const mistakes =
      letter === "A"
        ? [
            why(
              Q.of(k, 4),
              "This stops after one use of the formula: the square has the constant $\\frac{1}{4}$, but $\\frac{1}{4}\\cosh^2 2x$ adds another $\\frac{1}{8}$.",
              "这里只用了一次公式：平方给出常数 $\\frac{1}{4}$，但 $\\frac{1}{4}\\cosh^2 2x$ 还要再加 $\\frac{1}{8}$。",
            ),
            why(
              Q.of(3 * k, 4),
              "The constant $\\frac{3}{8}$ integrates to $\\frac{3}{8}x$; this is twice the value.",
              "常数 $\\frac{3}{8}$ 积分得 $\\frac{3}{8}x$；这是它的两倍。",
            ),
            why(
              Q.of(k, 8),
              "$\\frac{1}{8}$ is only the part that comes from $\\frac{1}{4}\\cosh^2 2x$; the $\\frac{1}{4}$ of the first step must be added to it.",
              "$\\frac{1}{8}$ 只是来自 $\\frac{1}{4}\\cosh^2 2x$ 的部分；还要加上第一步的 $\\frac{1}{4}$。",
            ),
            why(
              Q.of(k, 2),
              "Lowering $\\cosh^2 2x$ gives $\\frac{\\cosh 4x + 1}{2}$; without the division by $2$ the constant becomes $\\frac{1}{2}$.",
              "降幂得 $\\cosh^2 2x = \\frac{\\cosh 4x + 1}{2}$；漏掉除以 $2$，常数就变成了 $\\frac{1}{2}$。",
            ),
          ]
        : letter === "B"
          ? [
              why(
                Q.of(-sign * k, 4),
                cosh
                  ? "$\\cosh^2 x = \\frac{\\cosh 2x + 1}{2}$, so the cross term $\\frac{1}{2}\\cosh 2x$ is positive."
                  : "$\\sinh^2 x = \\frac{\\cosh 2x - 1}{2}$, so the cross term $-\\frac{1}{2}\\cosh 2x$ is negative.",
                cosh
                  ? "$\\cosh^2 x = \\frac{\\cosh 2x + 1}{2}$，所以交叉项 $\\frac{1}{2}\\cosh 2x$ 为正。"
                  : "$\\sinh^2 x = \\frac{\\cosh 2x - 1}{2}$，所以交叉项 $-\\frac{1}{2}\\cosh 2x$ 为负。",
              ),
              why(
                Q.of(sign * k, 2),
                "$\\frac{1}{2}\\cosh 2x$ integrates to $\\frac{1}{4}\\sinh 2x$: the division by $2$ from the chain rule is missing.",
                "$\\frac{1}{2}\\cosh 2x$ 积分得 $\\frac{1}{4}\\sinh 2x$：漏掉了链式法则带来的除以 $2$。",
              ),
              why(
                Q.of(sign * k, 8),
                "The cross term of the square is $\\pm\\frac{1}{2}\\cosh 2x$, not $\\pm\\frac{1}{4}\\cosh 2x$: the factor $2$ in $2ab$ is missing.",
                "平方的交叉项是 $\\pm\\frac{1}{2}\\cosh 2x$，不是 $\\pm\\frac{1}{4}\\cosh 2x$：漏掉了 $2ab$ 中的因子 $2$。",
              ),
              why(
                Q.of(k, 32),
                "$\\frac{1}{32}$ belongs to $D$, the coefficient of $\\sinh 4x$, not of $\\sinh 2x$.",
                "$\\frac{1}{32}$ 属于 $D$，是 $\\sinh 4x$ 的系数，不是 $\\sinh 2x$ 的。",
              ),
            ]
          : [
              why(
                Q.of(k, 8),
                "$\\frac{1}{8}$ is the coefficient of $\\cosh 4x$; integrating it divides by $4$.",
                "$\\frac{1}{8}$ 是 $\\cosh 4x$ 的系数；积分时还要除以 $4$。",
              ),
              why(Q.of(k, 16), "Integrating $\\cosh 4x$ divides by $4$, not by $2$.", "积分 $\\cosh 4x$ 要除以 $4$，不是除以 $2$。"),
              why(
                Q.of(k, 4),
                "$\\frac{1}{4}$ is the size of $B$, the coefficient of $\\sinh 2x$, not of $\\sinh 4x$.",
                "$\\frac{1}{4}$ 是 $B$ 的大小，即 $\\sinh 2x$ 的系数，不是 $\\sinh 4x$ 的。",
              ),
              why(Q.of(3 * k, 8), "$\\frac{3}{8}$ is $A$, the coefficient of $x$.", "$\\frac{3}{8}$ 是 $A$，即 $x$ 的系数。"),
            ];
    const squared = poly([Q.of(1, 4), "\\cosh^2 2x"], [Q.of(sign, 2), "\\cosh 2x"], [Q.of(1, 4), ""]);
    const lowered = poly([Q.of(3, 8), ""], [Q.of(sign, 2), "\\cosh 2x"], [Q.of(1, 8), "\\cosh 4x"]);
    const integrated = poly([Q.of(3, 8), "x"], [Q.of(sign, 4), "\\sinh 2x"], [Q.of(1, 32), "\\sinh 4x"]);
    const scaled = poly([Q.of(3 * k, 8), "x"], [Q.of(sign * k, 4), "\\sinh 2x"], [Q.of(k, 32), "\\sinh 4x"]);
    return numberProblem({
      prompt: t(
        `$\\int ${signedCoefficient(k)}${fn}^4 x\\,dx = Ax + B\\sinh 2x + D\\sinh 4x + C$. Find $${letter}$.`,
        `$\\int ${signedCoefficient(k)}${fn}^4 x\\,dx = Ax + B\\sinh 2x + D\\sinh 4x + C$。求 $${letter}$。`,
      ),
      answer,
      mistakes,
      solution: walkThrough(
        [
          [
            ["Use the formula once", "第一次用公式"],
            [
              `Write $${fn}^2 x = \\frac{\\cosh 2x ${cosh ? "+" : "-"} 1}{2}$ and square:`,
              `写成 $${fn}^2 x = \\frac{\\cosh 2x ${cosh ? "+" : "-"} 1}{2}$ 再平方：`,
            ],
            [`${fn}^4 x = \\left(\\frac{\\cosh 2x ${cosh ? "+" : "-"} 1}{2}\\right)^2 = ${squared}`],
          ],
          [
            ["Use it again", "再用一次"],
            ["Replace $\\cosh^2 2x$ by $\\frac{\\cosh 4x + 1}{2}$:", "把 $\\cosh^2 2x$ 换成 $\\frac{\\cosh 4x + 1}{2}$："],
            [`${fn}^4 x = ${lowered}`],
          ],
          [
            ["Integrate", "积分"],
            [
              `Integrate each term${k === 1 ? "" : ` and multiply by $${k}$`}, then read off $${letter}$:`,
              `逐项积分${k === 1 ? "" : `，再乘以 $${k}$`}，然后读出 $${letter}$：`,
            ],
            [`\\int ${signedCoefficient(k)}${fn}^4 x\\,dx = ${scaled} + C`, `${letter} = ${answer.toLatex()}`],
          ],
        ],
        [
          `Differentiate $${integrated}$: it gives $${lowered}$, which at $x = 0$ is $\\frac{3}{8} ${cosh ? "+" : "-"} \\frac{1}{2} + \\frac{1}{8} = ${cosh ? 1 : 0}$, the value of $${fn}^4 0$.`,
          `对 $${integrated}$ 求导，得 $${lowered}$，它在 $x = 0$ 处为 $\\frac{3}{8} ${cosh ? "+" : "-"} \\frac{1}{2} + \\frac{1}{8} = ${cosh ? 1 : 0}$，正是 $${fn}^4 0$ 的值。`,
        ],
      ),
    });
  },
};

const convenientConstantInV: KnowledgePointDef = {
  id: "a-convenient-constant-in-v",
  title: t("A convenient constant in v", "选取 v 中方便的常数"),
  explanation: t(
    "In integration by parts, $v$ can be any antiderivative of $dv$, so a constant may be added to it freely. For $\\int \\ln(ax + b)\\,dx$, the plain choice $v = x$ leaves a quotient that needs division. Choosing the constant so that $v$ is a multiple of $ax + b$ cancels the denominator of $du$, and the remaining integral is immediate. For example, with $v = x + \\frac{3}{2} = \\frac{2x + 3}{2}$, $\\int \\ln(2x + 3)\\,dx = \\left(x + \\frac{3}{2}\\right)\\ln(2x + 3) - x + C$.\n\nCheck: differentiating gives $\\ln(2x + 3) + \\left(x + \\frac{3}{2}\\right)\\frac{2}{2x + 3} - 1 = \\ln(2x + 3) + 1 - 1$.\n\n> **Watch out.** The constant is $\\frac{b}{a}$, not $b$: $v$ must equal $\\frac{ax + b}{a}$, so that it also cancels the $a$ in $du$.",
    "分部积分时，$v$ 可以是 $dv$ 的任何一个原函数，所以可以随意加一个常数。对 $\\int \\ln(ax + b)\\,dx$，直接取 $v = x$ 会留下需要做除法的分式。选取常数使 $v$ 成为 $ax + b$ 的倍数，就能约去 $du$ 的分母，剩下的积分立刻可得。例如，取 $v = x + \\frac{3}{2} = \\frac{2x + 3}{2}$，得 $\\int \\ln(2x + 3)\\,dx = \\left(x + \\frac{3}{2}\\right)\\ln(2x + 3) - x + C$。\n\n检验：求导得 $\\ln(2x + 3) + \\left(x + \\frac{3}{2}\\right)\\frac{2}{2x + 3} - 1 = \\ln(2x + 3) + 1 - 1$。\n\n> **注意。** 常数是 $\\frac{b}{a}$，不是 $b$：$v$ 必须等于 $\\frac{ax + b}{a}$，这样才能同时约去 $du$ 中的 $a$。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(1, 9);
    const answer = Q.of(b, a);
    const inner = poly([a, "x"], [b, ""]);
    const p = answer.toLatex();
    return numberProblem({
      prompt: t(
        `$\\int \\ln(${inner})\\,dx = (x + p)\\ln(${inner}) - x + C$. Find $p$.`,
        `$\\int \\ln(${inner})\\,dx = (x + p)\\ln(${inner}) - x + C$。求 $p$。`,
      ),
      answer,
      mistakes: [
        {
          value: Q.of(b),
          why: t(
            `With $p = ${b}$, $v\\,du$ is not $dx$; $v$ must be $\\frac{${inner}}{${a}}$, so $p = \\frac{b}{a}$.`,
            `取 $p = ${b}$ 时 $v\\,du$ 不是 $dx$；$v$ 必须是 $\\frac{${inner}}{${a}}$，所以 $p = \\frac{b}{a}$。`,
          ),
        },
        {
          value: Q.of(a, b),
          why: t(
            "This inverts the fraction: $p$ is $\\frac{b}{a}$, the constant in $x + \\frac{b}{a} = \\frac{ax + b}{a}$.",
            "分数颠倒了：$p$ 是 $\\frac{b}{a}$，即 $x + \\frac{b}{a} = \\frac{ax + b}{a}$ 中的常数。",
          ),
        },
        {
          value: answer.neg(),
          why: t(
            "The constant has the same sign as in $ax + b$: $x + \\frac{b}{a}$.",
            "这个常数与 $ax + b$ 中的符号相同：$x + \\frac{b}{a}$。",
          ),
        },
        {
          value: Q.of(b, 2 * a),
          why: t(
            `There is no factor $\\frac{1}{2}$: $v = x + p$ must equal $\\frac{${inner}}{${a}}$ exactly.`,
            `没有因子 $\\frac{1}{2}$：$v = x + p$ 必须恰好等于 $\\frac{${inner}}{${a}}$。`,
          ),
        },
      ],
      solution: walkThrough(
        [
          [
            ["Choose u and v", "选择 u 与 v"],
            [
              `Take $u = \\ln(${inner})$, so $du = \\frac{${a}}{${inner}}\\,dx$, and $v = x + p$, an antiderivative of $dv = dx$ for every $p$.`,
              `取 $u = \\ln(${inner})$，则 $du = \\frac{${a}}{${inner}}\\,dx$；取 $v = x + p$，对任何 $p$ 它都是 $dv = dx$ 的原函数。`,
            ],
          ],
          [
            ["Make v du simple", "让 v du 变简单"],
            [`$v\\,du$ is just $dx$ when $v = \\frac{${inner}}{${a}}$:`, `当 $v = \\frac{${inner}}{${a}}$ 时，$v\\,du$ 就是 $dx$：`],
            [`x + p = \\frac{${inner}}{${a}} = x + ${p}`],
          ],
          [
            ["Write the integral", "写出积分"],
            ["Then the remaining integral is $\\int dx$:", "于是剩下的积分是 $\\int dx$："],
            [`\\int \\ln(${inner})\\,dx = \\left(x + ${p}\\right)\\ln(${inner}) - x + C`, `p = ${p}`],
          ],
        ],
        [
          `Differentiate the result: $\\ln(${inner}) + \\left(x + ${p}\\right)\\frac{${a}}{${inner}} - 1 = \\ln(${inner}) + 1 - 1 = \\ln(${inner})$, since $${a}\\left(x + ${p}\\right) = ${inner}$.`,
          `对结果求导：$\\ln(${inner}) + \\left(x + ${p}\\right)\\frac{${a}}{${inner}} - 1 = \\ln(${inner}) + 1 - 1 = \\ln(${inner})$，因为 $${a}\\left(x + ${p}\\right) = ${inner}$。`,
        ],
      ),
    });
  },
};

const reductionForPowerTimesExponential: KnowledgePointDef = {
  id: "a-reduction-formula-for-a-power-times-an-exponential",
  title: t("A reduction formula for a power times an exponential", "幂乘指数函数的递推公式"),
  explanation: t(
    "Repeating integration by parts on a high power is long, but one step can be done in general. Let $I_n = \\int_0^1 x^ne^x\\,dx$. Parts with $u = x^n$ gives a relation between $I_n$ and $I_{n-1}$, which lowers the power by one each time. Starting from $I_0$, the value climbs step by step to any power needed. Here $I_n = e - nI_{n-1}$ and $I_0 = e - 1$, so $I_1 = e - I_0 = 1$ and $I_2 = e - 2I_1 = e - 2$.\n\nCheck: directly, $I_1 = \\int_0^1 xe^x\\,dx = \\big[(x - 1)e^x\\big]_0^1 = 0 - (-1) = 1$.\n\n> **Watch out.** The boundary term is $\\big[x^ne^x\\big]_0^1 = e$, and the factor $n$ multiplies $I_{n-1}$ with a minus sign: $I_n = e - nI_{n-1}$.",
    "对高次幂反复分部积分很长，但可以一般地做一步。设 $I_n = \\int_0^1 x^ne^x\\,dx$。取 $u = x^n$ 分部积分，得到 $I_n$ 与 $I_{n-1}$ 的关系，每次把幂降低一次。从 $I_0$ 出发，一步一步就能算到需要的幂。这里 $I_n = e - nI_{n-1}$，$I_0 = e - 1$，所以 $I_1 = e - I_0 = 1$，$I_2 = e - 2I_1 = e - 2$。\n\n检验：直接计算，$I_1 = \\int_0^1 xe^x\\,dx = \\big[(x - 1)e^x\\big]_0^1 = 0 - (-1) = 1$。\n\n> **注意。** 边界项是 $\\big[x^ne^x\\big]_0^1 = e$，而因子 $n$ 乘在 $I_{n-1}$ 上，并带负号：$I_n = e - nI_{n-1}$。",
  ),
  generate(rng) {
    const n = rng.int(3, 6);
    const k = rng.int(1, 5);
    const askA = rng.pick([true, false]);
    let A = 1;
    let B = -1;
    let previousA = 1;
    let previousB = -1;
    const chain: string[] = [];
    for (let i = 1; i <= n; i++) {
      previousA = A;
      previousB = B;
      A = 1 - i * previousA;
      B = -i * previousB;
      chain.push(`I_${i} = ${poly([A, "e"], [B, ""])}`);
    }
    const value = askA ? k * A : k * B;
    const letter = askA ? "A" : "B";
    const approx = A * Math.E + B;
    const four = (v: number) => (Math.round(v * 10000) / 10000).toString();
    const why = (v: number, en: string, zh: string) => ({ value: v, why: t(en, zh) });
    const sign = why(
      -value,
      "The sign is wrong: each step of $I_n = e - nI_{n-1}$ multiplies by $-n$, so follow every minus sign.",
      "符号错了：$I_n = e - nI_{n-1}$ 的每一步都乘以 $-n$，每个负号都要跟上。",
    );
    const short = why(
      k * (askA ? previousA : previousB),
      `This is the coefficient for $I_{${n - 1}}$; one more step of the recursion is needed.`,
      `这是 $I_{${n - 1}}$ 的系数；还要再递推一步。`,
    );
    const mistakes = askA
      ? [sign, why(k * B, "This is $B$, the constant term; $A$ is the coefficient of $e$.", "这是常数项 $B$；$A$ 是 $e$ 的系数。"), short]
      : [
          sign,
          why(k * A, "This is $A$, the coefficient of $e$; $B$ is the constant term.", "这是 $e$ 的系数 $A$；$B$ 是常数项。"),
          short,
          why(
            (k * B) / n,
            `The last step multiplies the constant by $-${n}$: $B_{${n}} = -${n}B_{${n - 1}}$; the factor $${n}$ is missing.`,
            `最后一步要把常数乘以 $-${n}$：$B_{${n}} = -${n}B_{${n - 1}}$；漏掉了因子 $${n}$。`,
          ),
        ];
    return numberProblem({
      prompt: t(
        `$\\int_0^1 ${coefficientOf(k)}x^{${n}}e^x\\,dx = Ae + B$ for integers $A$ and $B$. Find $${letter}$.`,
        `$\\int_0^1 ${coefficientOf(k)}x^{${n}}e^x\\,dx = Ae + B$，其中 $A$、$B$ 是整数。求 $${letter}$。`,
      ),
      answer: value,
      form: "integer",
      mistakes,
      solution: walkThrough(
        [
          [
            ["Find the reduction formula", "求递推公式"],
            [
              "Take $u = x^n$ and $dv = e^x\\,dx$, so $du = nx^{n-1}\\,dx$ and $v = e^x$:",
              "取 $u = x^n$，$dv = e^x\\,dx$，则 $du = nx^{n-1}\\,dx$，$v = e^x$：",
            ],
            ["I_n = \\big[x^ne^x\\big]_0^1 - n\\int_0^1 x^{n-1}e^x\\,dx = e - nI_{n-1}"],
          ],
          [
            ["Climb from I₀", "从 I₀ 递推"],
            ["Start from $I_0 = \\int_0^1 e^x\\,dx = e - 1$:", "从 $I_0 = \\int_0^1 e^x\\,dx = e - 1$ 出发："],
            [chain.join(", \\; ")],
          ],
          [
            ["Read off the coefficient", "读出系数"],
            [
              k === 1 ? `Read off $${letter}$:` : `Multiply by $${k}$ and read off $${letter}$:`,
              k === 1 ? `读出 $${letter}$：` : `乘以 $${k}$ 后读出 $${letter}$：`,
            ],
            [`${letter} = ${value}`],
          ],
        ],
        [
          `Numerically, $I_{${n}} = ${poly([A, "e"], [B, ""])} \\approx ${four(approx)}$. Since $1 \\le e^x \\le e$ on $[0, 1]$, $I_{${n}}$ must lie between $\\frac{1}{${n + 1}} \\approx ${four(1 / (n + 1))}$ and $\\frac{e}{${n + 1}} \\approx ${four(Math.E / (n + 1))}$, and it does.`,
          `数值上，$I_{${n}} = ${poly([A, "e"], [B, ""])} \\approx ${four(approx)}$。由于在 $[0, 1]$ 上 $1 \\le e^x \\le e$，$I_{${n}}$ 应介于 $\\frac{1}{${n + 1}} \\approx ${four(1 / (n + 1))}$ 与 $\\frac{e}{${n + 1}} \\approx ${four(Math.E / (n + 1))}$ 之间，确实如此。`,
        ],
      ),
    });
  },
};

const twoRepeatedFactors: KnowledgePointDef = {
  id: "two-repeated-factors-by-differentiating",
  title: t("Two repeated factors by differentiating", "用求导处理两个重因式"),
  explanation: t(
    "Substituting a root only gives the coefficient over the highest power of a factor. For the coefficient $A$ over the first power of $x + a$, multiply both sides by $(x + a)^{2}$:\n\n$$\\frac{N(x)}{(x + b)^{2}} = A(x + a) + B + (x + a)^{2}(\\cdots)$$\n\nDifferentiating removes $B$, and setting $x = -a$ removes every term that still contains $x + a$, leaving $A$. For example, for $\\frac{x + 3}{(x + 1)^{2}(x + 2)^{2}}$ the left side is $\\frac{x + 3}{(x + 2)^{2}}$, with derivative $\\frac{1}{(x + 2)^{2}} - \\frac{2(x + 3)}{(x + 2)^{3}}$; at $x = -1$ this is $1 - 4$, so $A = -3$.\n\nCheck: the same steps at $x = -2$ give $C = 1 + 2$, which is $3$. The numerator has degree below $3$, so for large $x$ the fraction is much smaller than $\\frac{1}{x}$, and the coefficients over the first powers must add to $0$: $-3 + 3 = 0$.\n\n> **Watch out.** The derivative of $\\frac{N(x)}{(x + b)^{2}}$ has two terms. Dropping the second one, $-\\frac{2N(x)}{(x + b)^{3}}$, is the usual mistake.",
    "代入根只能得到因式最高次幂上的系数。要求 $x + a$ 一次幂上的系数 $A$，先两边同乘 $(x + a)^{2}$：\n\n$$\\frac{N(x)}{(x + b)^{2}} = A(x + a) + B + (x + a)^{2}(\\cdots)$$\n\n求导消去 $B$，再令 $x = -a$，仍含 $x + a$ 的各项都变成零，只剩下 $A$。例如，对 $\\frac{x + 3}{(x + 1)^{2}(x + 2)^{2}}$，左边是 $\\frac{x + 3}{(x + 2)^{2}}$，导数为 $\\frac{1}{(x + 2)^{2}} - \\frac{2(x + 3)}{(x + 2)^{3}}$；在 $x = -1$ 处它等于 $1 - 4$，所以 $A = -3$。\n\n检验：在 $x = -2$ 处做同样的步骤，得 $C = 1 + 2$，即 $3$。分子次数低于 $3$，所以 $x$ 很大时分式远小于 $\\frac{1}{x}$，一次幂上的系数之和必须为 $0$：$-3 + 3 = 0$。\n\n> **注意。** $\\frac{N(x)}{(x + b)^{2}}$ 的导数有两项。漏掉第二项 $-\\frac{2N(x)}{(x + b)^{3}}$ 是常见的错误。",
  ),
  generate(rng) {
    const a = nonzero(rng, 4);
    const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4].filter((v) => v !== a));
    const p = nonzero(rng, 5);
    let q = nonzero(rng, 9);
    const d = b - a;
    while (q - p * a === 0 || p * d === 2 * (q - p * a)) q += 1;
    const atRoot = q - p * a;
    const first = Q.of(p, d * d);
    const second = Q.of(2 * atRoot, d * d * d);
    const answer = first.sub(second);
    const atOther = q - p * b;
    const other = Q.of(p, d * d).sub(Q.of(2 * atOther, -d * d * d));
    const f1 = poly([1, "x"], [a, ""]);
    const f2 = poly([1, "x"], [b, ""]);
    const numerator = poly([p, "x"], [q, ""]);
    const form = `\\frac{A}{${f1}} + \\frac{B}{(${f1})^2} + \\frac{C}{${f2}} + \\frac{D}{(${f2})^2}`;
    return numberProblem({
      prompt: t(
        `Write $\\frac{${numerator}}{(${f1})^2(${f2})^2}$ in the form $${form}$. Find $A$.`,
        `把 $\\frac{${numerator}}{(${f1})^2(${f2})^2}$ 写成 $${form}$ 的形式，求 $A$。`,
      ),
      answer,
      wrong: [first, first.add(second), Q.of(atRoot, d * d), answer.neg(), second],
      solution: walkThrough(
        [
          [
            ["Multiply by the squared factor", "乘以因式的平方"],
            [`Multiply both sides by $(${f1})^{2}$:`, `两边同乘 $(${f1})^{2}$：`],
            [`\\frac{${numerator}}{(${f2})^{2}} = A(${f1}) + B + (${f1})^{2}(\\cdots)`],
          ],
          [
            ["Differentiate", "求导"],
            [
              `On the right, $B$ disappears, and every other term except $A$ still contains $${f1}$. On the left, use the quotient rule:`,
              `右边 $B$ 消失，除 $A$ 以外的各项仍含 $${f1}$。左边用商的求导法则：`,
            ],
            [
              `\\frac{d}{dx}\\left[\\frac{${numerator}}{(${f2})^{2}}\\right] = \\frac{${p}}{(${f2})^{2}} - \\frac{2(${numerator})}{(${f2})^{3}}`,
            ],
          ],
          [
            ["Set x to the root", "令 x 取根"],
            [
              `At $x = ${-a}$, $${f2}$ equals $${d}$ and the numerator equals $${atRoot}$, and the right side is $A$:`,
              `在 $x = ${-a}$ 处，$${f2}$ 等于 $${d}$，分子等于 $${atRoot}$，右边等于 $A$：`,
            ],
            [
              `A = \\frac{${p}}{${inParens(d)}^{2}} - \\frac{2 \\cdot ${inParens(atRoot)}}{${inParens(d)}^{3}}`,
              `= ${first.toLatex()} - ${parQ(second)} = ${answer.toLatex()}`,
            ],
          ],
        ],
        [
          `Do the same at $x = ${-b}$ for $C$, where $${f1}$ equals $${-d}$ and the numerator equals $${atOther}$. The numerator has degree below $3$, so the coefficients over the first powers add to $0$:${steps(
            `C = \\frac{${p}}{${inParens(-d)}^{2}} - \\frac{2 \\cdot ${inParens(atOther)}}{${inParens(-d)}^{3}} = ${other.toLatex()}`,
            `A + C = ${answer.toLatex()} + ${parQ(other)} = 0`,
          ).trimEnd()}`,
          `在 $x = ${-b}$ 处用同样的步骤求 $C$，此时 $${f1}$ 等于 $${-d}$，分子等于 $${atOther}$。分子次数低于 $3$，所以一次幂上的系数之和为 $0$：${steps(
            `C = \\frac{${p}}{${inParens(-d)}^{2}} - \\frac{2 \\cdot ${inParens(atOther)}}{${inParens(-d)}^{3}} = ${other.toLatex()}`,
            `A + C = ${answer.toLatex()} + ${parQ(other)} = 0`,
          ).trimEnd()}`,
        ],
      ),
    });
  },
};

const xSquaredAsOneVariable: KnowledgePointDef = {
  id: "two-quadratic-factors-with-x-squared-as-one-variable",
  title: t("Two quadratic factors with x squared as one variable", "把 x 的平方看作一个变量的两个二次因式"),
  explanation: t(
    "When a fraction contains $x$ only through $x^{2}$, the general numerators $Bx + C$ are more than it needs, since the linear terms must all vanish. Treat $y = x^{2}$ as a single variable:\n\n$$\\frac{px^{2} + q}{(x^{2} + a)(x^{2} + b)} = \\frac{py + q}{(y + a)(y + b)}$$\n\nThe right side has two distinct linear factors in $y$, so covering one and substituting its root gives its coefficient at once. For example, for $\\frac{x^{2} + 5}{(x^{2} + 1)(x^{2} + 3)}$, cover $y + 1$ and set $y = -1$: $C = \\frac{4}{2}$, which is $2$.\n\nCheck: covering $y + 3$ and setting $y = -3$ gives $D = \\frac{2}{-2}$, which is $-1$. For large $y$ the fraction is close to $\\frac{1}{y}$, so $C + D$ must be $1$, and $2 + (-1) = 1$.\n\n> **Watch out.** The root of $y + a$ is $y = -a$, a negative number. It cannot come from any real $x$, but the identity in $y$ holds for every $y$, so substituting it is allowed.",
    "分式只通过 $x^{2}$ 含有 $x$ 时，不需要一般的分子 $Bx + C$，因为一次项全都为零。把 $y = x^{2}$ 看作一个变量：\n\n$$\\frac{px^{2} + q}{(x^{2} + a)(x^{2} + b)} = \\frac{py + q}{(y + a)(y + b)}$$\n\n右边是含 $y$ 的两个不同一次因式，盖住一个并代入它的根，就能立刻得到它的系数。例如，对 $\\frac{x^{2} + 5}{(x^{2} + 1)(x^{2} + 3)}$，盖住 $y + 1$ 并令 $y = -1$：$C = \\frac{4}{2}$，即 $2$。\n\n检验：盖住 $y + 3$ 并令 $y = -3$，得 $D = \\frac{2}{-2}$，即 $-1$。$y$ 很大时分式接近 $\\frac{1}{y}$，所以 $C + D$ 应等于 $1$，而 $2 + (-1) = 1$。\n\n> **注意。** $y + a$ 的根是 $y = -a$，是负数。它不对应任何实数 $x$，但关于 $y$ 的恒等式对所有 $y$ 都成立，所以可以代入。",
  ),
  generate(rng) {
    const a = rng.int(1, 9);
    const b = different(rng, 1, 9, a);
    const p = nonzero(rng, 6);
    let q = nonzero(rng, 12);
    while (q - p * a === 0 || q - p * b === 0) q += 1;
    const answer = Q.of(q - p * a, b - a);
    const other = Q.of(q - p * b, a - b);
    const covered = (name: string, top: number, bottom: number, value: Q) =>
      bottom === 1 ? `${name} = ${value.toLatex()}` : `${name} = \\frac{${top}}{${bottom}} = ${value.toLatex()}`;
    const numerator = poly([p, "x^2"], [q, ""]);
    const inY = poly([p, "y"], [q, ""]);
    const form = `\\frac{C}{x^2 + ${a}} + \\frac{D}{x^2 + ${b}}`;
    return numberProblem({
      prompt: t(
        `Write $\\frac{${numerator}}{(x^2 + ${a})(x^2 + ${b})}$ in the form $${form}$. Find $C$.`,
        `把 $\\frac{${numerator}}{(x^2 + ${a})(x^2 + ${b})}$ 写成 $${form}$ 的形式，求 $C$。`,
      ),
      answer,
      wrong: [Q.of(q + p * a, b - a), answer.neg(), Q.of(q - p * b, a - b), Q.of(q, b - a)],
      solution: walkThrough(
        [
          [
            ["Treat x squared as one variable", "把 x 的平方看作一个变量"],
            ["The fraction contains $x$ only through $x^{2}$, so let $y = x^{2}$:", "分式只通过 $x^{2}$ 含有 $x$，令 $y = x^{2}$："],
            [`\\frac{${numerator}}{(x^2 + ${a})(x^2 + ${b})} = \\frac{${inY}}{(y + ${a})(y + ${b})}`],
          ],
          [
            ["Cover up", "掩盖"],
            [
              `Cover $y + ${a}$ and set $y = ${-a}$: the numerator becomes $${q - p * a}$ and the other factor $${b - a}$:`,
              `盖住 $y + ${a}$，令 $y = ${-a}$：分子变成 $${q - p * a}$，另一个因式变成 $${b - a}$：`,
            ],
            [covered("C", q - p * a, b - a, answer)],
          ],
        ],
        [
          `Cover $y + ${b}$ and set $y = ${-b}$ to get $D$. For large $y$ the fraction is close to $\\frac{${p}}{y}$, so $C + D$ must be $${p}$:${steps(
            covered("D", q - p * b, a - b, other),
            `C + D = ${answer.toLatex()} + ${parQ(other)} = ${p}`,
          ).trimEnd()}`,
          `盖住 $y + ${b}$，令 $y = ${-b}$，得 $D$。$y$ 很大时分式接近 $\\frac{${p}}{y}$，所以 $C + D$ 应等于 $${p}$：${steps(
            covered("D", q - p * b, a - b, other),
            `C + D = ${answer.toLatex()} + ${parQ(other)} = ${p}`,
          ).trimEnd()}`,
        ],
      ),
    });
  },
};

const twoQuadraticsOverHalfLine: KnowledgePointDef = {
  id: "two-quadratic-factors-over-an-infinite-interval",
  figure:
    calculusDrawings4["integrating-rational-functions-with-irreducible-quadratic-factors#two-quadratic-factors-over-an-infinite-interval"],
  title: t("Two quadratic factors over an infinite interval", "无穷区间上的两个二次因式"),
  explanation: t(
    "A product of two quadratics splits into a difference of two simple fractions:\n\n$$\\frac{1}{(x^{2} + a^{2})(x^{2} + b^{2})} = \\frac{1}{b^{2} - a^{2}}\\left(\\frac{1}{x^{2} + a^{2}} - \\frac{1}{x^{2} + b^{2}}\\right)$$\n\nEach piece has an arctangent antiderivative, and over $[0, \\infty)$ the arctangent rises by a right angle, so $\\int_0^\\infty \\frac{dx}{x^{2} + s^{2}}$ is $\\frac{\\pi}{2s}$. For example, with $a = 1$ and $b = 2$ the pieces give $\\frac{\\pi}{2}$ and $\\frac{\\pi}{4}$, and $\\frac{1}{3}$ of their difference is $\\frac{\\pi}{12}$.\n\nCheck: simplifying in general gives $\\frac{\\pi}{2ab(a + b)}$, and with $a = 1$ and $b = 2$ the denominator $2ab(a + b)$ is $12$.\n\n> **Watch out.** The fraction in front is $\\frac{1}{b^{2} - a^{2}}$, with the squares, not $\\frac{1}{b - a}$.",
    "两个二次式的乘积可以拆成两个简单分式之差：\n\n$$\\frac{1}{(x^{2} + a^{2})(x^{2} + b^{2})} = \\frac{1}{b^{2} - a^{2}}\\left(\\frac{1}{x^{2} + a^{2}} - \\frac{1}{x^{2} + b^{2}}\\right)$$\n\n每一部分的原函数都是反正切，而在 $[0, \\infty)$ 上反正切增加一个直角，所以 $\\int_0^\\infty \\frac{dx}{x^{2} + s^{2}}$ 等于 $\\frac{\\pi}{2s}$。例如 $a = 1$、$b = 2$ 时，两部分分别得 $\\frac{\\pi}{2}$ 和 $\\frac{\\pi}{4}$，它们之差的 $\\frac{1}{3}$ 是 $\\frac{\\pi}{12}$。\n\n检验：一般地化简得 $\\frac{\\pi}{2ab(a + b)}$；$a = 1$、$b = 2$ 时分母 $2ab(a + b)$ 等于 $12$。\n\n> **注意。** 前面的分数是 $\\frac{1}{b^{2} - a^{2}}$，带平方，而不是 $\\frac{1}{b - a}$。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const b = rng.int(a + 1, 6);
    const n = rng.int(1, 12);
    const answer = Q.of(n, 2 * a * b * (a + b));
    const front = fractionBefore(n, b * b - a * a);
    const scaled = (inner: string) => (front === "" ? inner : `${front}\\left(${inner}\\right)`);
    const f = `\\frac{${n}}{(x^2 + ${a * a})(x^2 + ${b * b})}`;
    return numberProblem({
      prompt: t(
        `$\\int_0^\\infty \\frac{${n}}{(x^2 + ${a * a})(x^2 + ${b * b})}\\,dx = c\\pi$. Find $c$.`,
        `$\\int_0^\\infty \\frac{${n}}{(x^2 + ${a * a})(x^2 + ${b * b})}\\,dx = c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(n, a * b * (a + b)), Q.of(n, 2 * (b * b - a * a)), Q.of(n, 2 * a * b * (b - a)), Q.of(n, 2 * a * b), Q.of(n, a + b)],
      solution: walkThrough(
        [
          [
            ["Split the fraction", "拆开分式"],
            [`The two constants differ by $${b * b - a * a}$, so:`, `两个常数相差 $${b * b - a * a}$，所以：`],
            [`${f} = ${scaled(`\\frac{1}{x^2 + ${a * a}} - \\frac{1}{x^2 + ${b * b}}`)}`],
          ],
          [
            ["Integrate each piece", "分别积分"],
            ["Each arctangent rises from $0$ to $\\frac{\\pi}{2}$:", "每个反正切都从 $0$ 增加到 $\\frac{\\pi}{2}$："],
            [
              `\\int_0^\\infty \\frac{dx}{x^2 + ${a * a}} = \\frac{\\pi}{${2 * a}}`,
              `\\int_0^\\infty \\frac{dx}{x^2 + ${b * b}} = \\frac{\\pi}{${2 * b}}`,
            ],
          ],
          [
            ["Combine", "合并"],
            front === "" ? ["Take the difference:", "取差："] : ["Take the difference and scale it:", "取差，再乘以前面的分数："],
            [
              `\\int_0^\\infty ${f}\\,dx = ${scaled(`\\frac{\\pi}{${2 * a}} - \\frac{\\pi}{${2 * b}}`)} = ${piTimes(answer)}`,
              `c = ${answer.toLatex()}`,
            ],
          ],
        ],
        [
          `Simplifying in general gives $\\frac{n\\pi}{2ab(a + b)}$ for numerator $n$. Here $2ab(a + b)$ is $${2 * a * b * (a + b)}$:${steps(`\\frac{${coefficientOf(n)}\\pi}{${2 * a * b * (a + b)}} = ${piTimes(answer)}`).trimEnd()}`,
          `一般地化简，分子为 $n$ 时积分等于 $\\frac{n\\pi}{2ab(a + b)}$。这里 $2ab(a + b)$ 等于 $${2 * a * b * (a + b)}$：${steps(`\\frac{${coefficientOf(n)}\\pi}{${2 * a * b * (a + b)}} = ${piTimes(answer)}`).trimEnd()}`,
        ],
      ),
    });
  },
};

const exponentialFractionImproper: KnowledgePointDef = {
  id: "an-improper-integral-of-an-exponential-fraction",
  title: t("An improper integral of an exponential fraction", "指数分式的反常积分"),
  explanation: t(
    "An integrand need not look like a decaying exponential to converge. When the numerator is the derivative of the expression inside the square, up to a constant, the substitution $u = e^{mx} + c$ reduces the integral to a power of $u$:\n\n$$\\int_0^\\infty \\frac{e^{mx}}{(e^{mx} + c)^{2}}\\,dx = \\frac{1}{m}\\int_{1 + c}^\\infty u^{-2}\\,du$$\n\nThe upper limit moves to infinity with $x$, and $\\int_{1 + c}^\\infty u^{-2}\\,du$ is $\\frac{1}{1 + c}$. For example, with $m = 1$ and $c = 1$ the value is $\\frac{1}{2}$.\n\nCheck: an antiderivative in $x$ is $-\\frac{1}{e^{x} + 1}$, which rises from $-\\frac{1}{2}$ at $0$ to $0$ at infinity, a change of $\\frac{1}{2}$.\n\n> **Watch out.** The lower limit for $u$ is the value at $x = 0$, and $e^{0} = 1$, so it is $1 + c$, not $c$.",
    "被积函数不一定要像衰减的指数函数才收敛。分子只差一个常数就是平方内式子的导数时，换元 $u = e^{mx} + c$ 把积分化成 $u$ 的幂：\n\n$$\\int_0^\\infty \\frac{e^{mx}}{(e^{mx} + c)^{2}}\\,dx = \\frac{1}{m}\\int_{1 + c}^\\infty u^{-2}\\,du$$\n\n上限随 $x$ 趋于无穷，而 $\\int_{1 + c}^\\infty u^{-2}\\,du$ 等于 $\\frac{1}{1 + c}$。例如 $m = 1$、$c = 1$ 时积分值为 $\\frac{1}{2}$。\n\n检验：关于 $x$ 的原函数是 $-\\frac{1}{e^{x} + 1}$，它从 $0$ 处的 $-\\frac{1}{2}$ 增加到无穷远处的 $0$，变化量为 $\\frac{1}{2}$。\n\n> **注意。** $u$ 的下限是 $x = 0$ 时的值，而 $e^{0} = 1$，所以下限是 $1 + c$，不是 $c$。",
  ),
  generate(rng) {
    const m = rng.int(1, 4);
    const c = rng.int(1, 9);
    const k = rng.int(1, 9);
    const answer = Q.of(k, m * (1 + c));
    const power = `e^{${coefficientOf(m)}x}`;
    const lead = fractionBefore(k, m);
    const I = `\\int_0^\\infty \\frac{${coefficientOf(k)}${power}}{(${power} + ${c})^2}\\,dx`;
    const inner = `\\int_{${1 + c}}^\\infty u^{-2}\\,du`;
    const base = Q.of(1, 1 + c).toLatex();
    const ratio = Q.of(k, m);
    const below = ratio.d === 1n ? `${power} + ${c}` : `${ratio.d}(${power} + ${c})`;
    const parts: WalkStep[] = [
      [
        ["Substitute", "换元"],
        [
          `Let $u = ${power} + ${c}$, so $du = ${coefficientOf(m)}${power}\\,dx$. At $x = 0$, $u = ${1 + c}$, and $u \\to \\infty$ as $x \\to \\infty$:`,
          `令 $u = ${power} + ${c}$，则 $du = ${coefficientOf(m)}${power}\\,dx$。$x = 0$ 时 $u = ${1 + c}$，$x \\to \\infty$ 时 $u \\to \\infty$：`,
        ],
        [`${I} = ${lead}${inner}`],
      ],
      [
        ["Integrate", "积分"],
        ["The antiderivative $-\\frac{1}{u}$ tends to $0$ at infinity:", "原函数 $-\\frac{1}{u}$ 在无穷远处趋于 $0$："],
        [`${inner} = \\left[-\\frac{1}{u}\\right]_{${1 + c}}^\\infty = ${base}`],
      ],
    ];
    if (lead !== "") {
      parts.push([
        ["Multiply by the constant", "乘以常数"],
        [`Multiply by $${lead}$:`, `乘以 $${lead}$：`],
        [`${lead} \\cdot ${base} = ${answer.toLatex()}`],
      ]);
    }
    const bracket = `\\left[-\\frac{${ratio.n}}{${below}}\\right]_0^\\infty = 0 - \\left(-${answer.toLatex()}\\right) = ${answer.toLatex()}`;
    return numberProblem({
      prompt: t(`Evaluate $${I}$.`, `计算 $${I}$。`),
      answer,
      wrong: [Q.of(k, 1 + c), Q.of(k, m * c), Q.of(k, m * (1 + c) * (1 + c)), Q.of(k * m, 1 + c), Q.of(k * (1 + c), m)],
      solution: walkThrough(parts, [
        `Work in $x$ instead. By the chain rule, the derivative of $-\\frac{${ratio.n}}{${below}}$ is the integrand, so:${steps(bracket).trimEnd()}`,
        `改为直接对 $x$ 计算。由链式法则，$-\\frac{${ratio.n}}{${below}}$ 的导数正是被积函数，所以：${steps(bracket).trimEnd()}`,
      ]),
    });
  },
};

const realLineCompletedSquare: KnowledgePointDef = {
  id: "the-real-line-after-completing-the-square",
  figure: calculusDrawings4["improper-integrals-involving-arctangent#the-real-line-after-completing-the-square"],
  title: t("The real line after completing the square", "配方后在整条实轴上积分"),
  explanation: t(
    "Over the whole real line, shifting the variable does not change the limits. So after completing the square, the center $p$ of the quadratic plays no part in the value:\n\n$$\\int_{-\\infty}^{\\infty} \\frac{k}{(x - p)^{2} + a^{2}}\\,dx = \\int_{-\\infty}^{\\infty} \\frac{k}{u^{2} + a^{2}}\\,du = \\frac{k\\pi}{a}$$\n\nThe antiderivative $\\frac{k}{a}\\arctan\\frac{u}{a}$ runs from one horizontal asymptote to the other, a total change of $\\frac{k}{a}\\pi$. For example, $x^{2} - 2x + 5$ is $(x - 1)^{2} + 4$, so $\\int_{-\\infty}^{\\infty} \\frac{1}{x^{2} - 2x + 5}\\,dx$ is $\\frac{\\pi}{2}$.\n\nCheck: there $\\frac{1}{2}\\arctan\\frac{u}{2}$ runs from $-\\frac{\\pi}{4}$ to $\\frac{\\pi}{4}$, a change of $\\frac{\\pi}{2}$.\n\n> **Watch out.** The factor in front of the arctangent is $\\frac{1}{a}$, not $\\frac{1}{a^{2}}$, where $a^{2}$ is the constant left after completing the square.",
    "在整条实轴上，平移变量不改变积分限。所以配方之后，二次式的中心 $p$ 对积分值没有影响：\n\n$$\\int_{-\\infty}^{\\infty} \\frac{k}{(x - p)^{2} + a^{2}}\\,dx = \\int_{-\\infty}^{\\infty} \\frac{k}{u^{2} + a^{2}}\\,du = \\frac{k\\pi}{a}$$\n\n原函数 $\\frac{k}{a}\\arctan\\frac{u}{a}$ 从一条水平渐近线变到另一条，总变化是 $\\frac{k}{a}\\pi$。例如 $x^{2} - 2x + 5$ 等于 $(x - 1)^{2} + 4$，所以 $\\int_{-\\infty}^{\\infty} \\frac{1}{x^{2} - 2x + 5}\\,dx$ 等于 $\\frac{\\pi}{2}$。\n\n检验：这时 $\\frac{1}{2}\\arctan\\frac{u}{2}$ 从 $-\\frac{\\pi}{4}$ 变到 $\\frac{\\pi}{4}$，变化量为 $\\frac{\\pi}{2}$。\n\n> **注意。** 反正切前面的因子是 $\\frac{1}{a}$，不是 $\\frac{1}{a^{2}}$，其中 $a^{2}$ 是配方后剩下的常数。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const a = rng.int(2, 6);
    const p = nonzero(rng, 6);
    const answer = Q.of(k, a);
    const denominator = poly([1, "x^2"], [-2 * p, "x"], [p * p + a * a, ""]);
    const shift = poly([1, "x"], [-p, ""]);
    const lead = fractionBefore(k, a);
    const scaled = (inner: string) => (lead === "" ? inner : `${lead}\\left(${inner}\\right)`);
    const half = Q.of(k, 2 * a);
    return numberProblem({
      prompt: t(
        `$\\int_{-\\infty}^\\infty \\frac{${k}}{${denominator}}\\,dx = c\\pi$. Find $c$.`,
        `$\\int_{-\\infty}^\\infty \\frac{${k}}{${denominator}}\\,dx = c\\pi$。求 $c$。`,
      ),
      answer,
      wrong: [Q.of(k, 2 * a), Q.of(k), Q.of(k, a * a), Q.of(2 * k, a), Q.of(k, 4 * a)],
      solution: walkThrough(
        [
          [
            ["Complete the square", "配方"],
            [`Half the coefficient of $x$ is $${-p}$:`, `$x$ 的系数的一半是 $${-p}$：`],
            [`${denominator} = (${shift})^2 + ${a * a}`],
          ],
          [
            ["Substitute", "换元"],
            [
              `Let $u = ${shift}$. Shifting does not move $\\pm\\infty$, so the limits stay the same:`,
              `令 $u = ${shift}$。平移不改变 $\\pm\\infty$，所以积分限不变：`,
            ],
            [`\\int_{-\\infty}^\\infty \\frac{${k}}{${denominator}}\\,dx = \\int_{-\\infty}^\\infty \\frac{${k}}{u^2 + ${a * a}}\\,du`],
          ],
          [
            ["Evaluate", "求值"],
            [
              `An antiderivative is $${lead}\\arctan\\frac{u}{${a}}$, and the arctangent runs from $-\\frac{\\pi}{2}$ to $\\frac{\\pi}{2}$:`,
              `原函数是 $${lead}\\arctan\\frac{u}{${a}}$，反正切从 $-\\frac{\\pi}{2}$ 变到 $\\frac{\\pi}{2}$：`,
            ],
            [
              `\\int_{-\\infty}^\\infty \\frac{${k}}{u^2 + ${a * a}}\\,du = ${scaled("\\frac{\\pi}{2} - \\left(-\\frac{\\pi}{2}\\right)")} = ${piTimes(answer)}`,
              `c = ${answer.toLatex()}`,
            ],
          ],
        ],
        [
          `The integrand in $u$ is even, so the integral is twice the integral over $[0, \\infty)$, where the arctangent rises from $0$ to $\\frac{\\pi}{2}$ and each half is $${piTimes(half)}$:${steps(`2 \\cdot ${piTimes(half)} = ${piTimes(answer)}`).trimEnd()}`,
          `关于 $u$ 的被积函数是偶函数，所以积分是 $[0, \\infty)$ 上积分的两倍；在那里反正切从 $0$ 增加到 $\\frac{\\pi}{2}$，每一半等于 $${piTimes(half)}$：${steps(`2 \\cdot ${piTimes(half)} = ${piTimes(answer)}`).trimEnd()}`,
        ],
      ),
    });
  },
};

const absoluteValueUnderRoot: KnowledgePointDef = {
  id: "an-absolute-value-under-a-root-at-an-interior-point",
  title: t("An absolute value under a root at an interior point", "内点处根号下的绝对值"),
  explanation: t(
    "An integrand with $|x - c|$ under a root blows up at $x = c$, so an interval containing $c$ must be split there into two improper integrals. On each side, $u = |x - c|$ turns the piece into an integral of $u^{-1/2}$ from $0$ to the distance $s^{2}$ between $c$ and that end:\n\n$$\\int_{0}^{s^{2}} u^{-1/2}\\,du = 2s$$\n\nEach piece converges because the power $-\\frac{1}{2}$ is greater than $-1$. For example, $\\int_{-1}^{4} \\frac{1}{\\sqrt{|x|}}\\,dx$ splits at $0$ into pieces of $2$ and $4$, so it is $6$.\n\nCheck: $2\\sqrt{x}$ for $x \\ge 0$ and $-2\\sqrt{-x}$ for $x < 0$ join into one continuous antiderivative, and its values at $4$ and $-1$ are $4$ and $-2$, whose difference is $6$.\n\n> **Watch out.** The two pieces do not cancel: the absolute value opens differently on each side, and both pieces are areas above the axis, so they add.",
    "根号下含 $|x - c|$ 的被积函数在 $x = c$ 处趋于无穷，所以包含 $c$ 的区间必须在那里分成两个反常积分。在每一侧，令 $u = |x - c|$，这一段化为 $u^{-1/2}$ 从 $0$ 到 $s^{2}$ 的积分，其中 $s^{2}$ 是 $c$ 到这一端的距离：\n\n$$\\int_{0}^{s^{2}} u^{-1/2}\\,du = 2s$$\n\n因为幂 $-\\frac{1}{2}$ 大于 $-1$，每一段都收敛。例如 $\\int_{-1}^{4} \\frac{1}{\\sqrt{|x|}}\\,dx$ 在 $0$ 处分开，两段分别是 $2$ 和 $4$，所以积分值为 $6$。\n\n检验：$x \\ge 0$ 时的 $2\\sqrt{x}$ 与 $x < 0$ 时的 $-2\\sqrt{-x}$ 连成一个连续的原函数，它在 $4$ 和 $-1$ 处的值是 $4$ 和 $-2$，差为 $6$。\n\n> **注意。** 两段不会抵消：两侧绝对值的去法不同，但两段都是轴上方的面积，所以要相加。",
  ),
  generate(rng) {
    const c = nonzero(rng, 5);
    const a = rng.int(1, 5);
    const b = different(rng, 1, 5, a);
    const k = rng.int(1, 6);
    const answer = 2 * k * (a + b);
    const inner = poly([1, "x"], [-c, ""]);
    const lo = c - a * a;
    const hi = c + b * b;
    const f = `\\frac{${k}}{\\sqrt{|${inner}|}}`;
    const K = coefficientOf(k);
    return numberProblem({
      prompt: t(`Evaluate $\\int_{${lo}}^{${hi}} ${f}\\,dx$.`, `计算 $\\int_{${lo}}^{${hi}} ${f}\\,dx$。`),
      answer,
      form: "integer",
      wrong: [2 * k * Math.abs(b - a), k * (a + b), 2 * k * (a * a + b * b), 2 * k * b],
      solution: walkThrough(
        [
          [
            ["Split at the bad point", "在无界点处分开"],
            [
              `The integrand is unbounded at $x = ${c}$, which lies inside the interval:`,
              `被积函数在 $x = ${c}$ 处无界，而这个点在区间内部：`,
            ],
            [`\\int_{${lo}}^{${hi}} ${f}\\,dx = \\int_{${lo}}^{${c}} ${f}\\,dx + \\int_{${c}}^{${hi}} ${f}\\,dx`],
          ],
          [
            ["Substitute in each piece", "分别换元"],
            [
              `Let $u = |${inner}|$. On the left $u$ runs from $${a * a}$ down to $0$, on the right from $0$ up to $${b * b}$, and $2\\sqrt{u}$ is an antiderivative of $u^{-1/2}$:`,
              `令 $u = |${inner}|$。左边一段 $u$ 从 $${a * a}$ 减到 $0$，右边一段从 $0$ 增到 $${b * b}$，而 $2\\sqrt{u}$ 是 $u^{-1/2}$ 的原函数：`,
            ],
            [
              `\\int_{${lo}}^{${c}} ${f}\\,dx = ${K}\\int_0^{${a * a}} u^{-1/2}\\,du = ${2 * k * a}`,
              `\\int_{${c}}^{${hi}} ${f}\\,dx = ${K}\\int_0^{${b * b}} u^{-1/2}\\,du = ${2 * k * b}`,
            ],
          ],
          [["Add the pieces", "两段相加"], ["Both pieces are positive:", "两段都是正的："], [`${2 * k * a} + ${2 * k * b} = ${answer}`]],
        ],
        [
          `The functions $${2 * k}\\sqrt{${inner}}$ to the right of $${c}$ and $-${2 * k}\\sqrt{${poly([-1, "x"], [c, ""])}}$ to the left join into one continuous antiderivative, so take its values at the two ends:${steps(`${2 * k}\\sqrt{${b * b}} - \\left(-${2 * k}\\sqrt{${a * a}}\\right) = ${answer}`).trimEnd()}`,
          `$${c}$ 右侧的 $${2 * k}\\sqrt{${inner}}$ 与左侧的 $-${2 * k}\\sqrt{${poly([-1, "x"], [c, ""])}}$ 连成一个连续的原函数，取它在两端的值：${steps(`${2 * k}\\sqrt{${b * b}} - \\left(-${2 * k}\\sqrt{${a * a}}\\right) = ${answer}`).trimEnd()}`,
        ],
      ),
    });
  },
};

const lengthOfCatenary: KnowledgePointDef = {
  id: "the-length-of-a-catenary",
  figure: calculusDrawings4["the-arc-length-of-a-planar-curve#the-length-of-a-catenary"],
  title: t("The length of a catenary", "悬链线的长度"),
  explanation: t(
    "A hanging chain follows the curve $y = a\\cosh\\frac{x}{a}$, and its arc length has a simple form. The derivative is a hyperbolic sine, and the identity $1 + \\sinh^2 z = \\cosh^2 z$ removes the root in the length formula. The integrand is then a hyperbolic cosine, and a logarithm in the limit is evaluated through the exponential definition of $\\sinh$. For example, $y = \\cosh x$ from $x = 0$ to $x = \\ln 2$ has length $\\sinh(\\ln 2) = \\frac{1}{2}\\left(2 - \\frac{1}{2}\\right) = \\frac{3}{4}$.\n\nCheck: at the end the height is $\\cosh(\\ln 2) = \\frac{1}{2}\\left(2 + \\frac{1}{2}\\right) = \\frac{5}{4}$, and since $\\cosh^2 - \\sinh^2 = 1$, $\\left(\\frac{5}{4}\\right)^2 - 1 = \\frac{9}{16} = \\left(\\frac{3}{4}\\right)^2$.\n\n> **Watch out.** The antiderivative of $\\cosh\\frac{x}{a}$ is $a\\sinh\\frac{x}{a}$, with the factor $a$. And $\\sinh(\\ln m) = \\frac{1}{2}\\left(m - \\frac{1}{m}\\right)$, with the half.",
    "悬挂的链条沿曲线 $y = a\\cosh\\frac{x}{a}$ 分布，它的弧长形式很简单。导数是双曲正弦，恒等式 $1 + \\sinh^2 z = \\cosh^2 z$ 消去弧长公式中的根号。被积函数于是成为双曲余弦，积分限中的对数则用 $\\sinh$ 的指数定义求值。例如，$y = \\cosh x$ 从 $x = 0$ 到 $x = \\ln 2$ 的长度是 $\\sinh(\\ln 2) = \\frac{1}{2}\\left(2 - \\frac{1}{2}\\right) = \\frac{3}{4}$。\n\n检验：终点处高度为 $\\cosh(\\ln 2) = \\frac{1}{2}\\left(2 + \\frac{1}{2}\\right) = \\frac{5}{4}$，由于 $\\cosh^2 - \\sinh^2 = 1$，$\\left(\\frac{5}{4}\\right)^2 - 1 = \\frac{9}{16} = \\left(\\frac{3}{4}\\right)^2$。\n\n> **注意。** $\\cosh\\frac{x}{a}$ 的原函数是 $a\\sinh\\frac{x}{a}$，带因子 $a$。而 $\\sinh(\\ln m) = \\frac{1}{2}\\left(m - \\frac{1}{m}\\right)$，有二分之一。",
  ),
  generate(rng) {
    const a = rng.int(2, 9);
    const m = rng.int(2, 6);
    const answer = Q.of(a * (m * m - 1), 2 * m);
    const height = Q.of(a * (m * m + 1), 2 * m);
    const end = `${a}\\ln ${m}`;
    return numberProblem({
      prompt: t(
        `Find the arc length of the catenary $y = ${a}\\cosh\\frac{x}{${a}}$ from $x = 0$ to $x = ${end}$.`,
        `求悬链线 $y = ${a}\\cosh\\frac{x}{${a}}$ 从 $x = 0$ 到 $x = ${end}$ 的弧长。`,
      ),
      answer,
      mistakes: [
        {
          value: height,
          why: t(
            `This is $${a}\\cosh(\\ln ${m})$, the height of the chain at the end; the antiderivative of $\\cosh$ is $\\sinh$.`,
            `这是 $${a}\\cosh(\\ln ${m})$，即链条终点的高度；$\\cosh$ 的原函数是 $\\sinh$。`,
          ),
        },
        {
          value: Q.of(m * m - 1, 2 * m),
          why: t(
            `The antiderivative of $\\cosh\\frac{x}{${a}}$ is $${a}\\sinh\\frac{x}{${a}}$; the factor $${a}$ is missing.`,
            `$\\cosh\\frac{x}{${a}}$ 的原函数是 $${a}\\sinh\\frac{x}{${a}}$；漏掉了因子 $${a}$。`,
          ),
        },
        {
          value: Q.of(a * (m * m - 1), m),
          why: t(
            "$\\sinh z = \\frac{e^z - e^{-z}}{2}$; the division by $2$ is missing.",
            "$\\sinh z = \\frac{e^z - e^{-z}}{2}$；漏掉了除以 $2$。",
          ),
        },
        {
          value: Q.of(a * (m - 1)),
          why: t(
            `This takes $\\sinh(\\ln ${m})$ as $${m} - 1$; in fact $\\sinh(\\ln ${m}) = \\frac{1}{2}\\left(${m} - \\frac{1}{${m}}\\right)$.`,
            `这是把 $\\sinh(\\ln ${m})$ 当作 $${m} - 1$；实际上 $\\sinh(\\ln ${m}) = \\frac{1}{2}\\left(${m} - \\frac{1}{${m}}\\right)$。`,
          ),
        },
      ],
      solution: walkThrough(
        [
          [
            ["Simplify the root", "化简根式"],
            ["Differentiate and use $1 + \\sinh^2 z = \\cosh^2 z$:", "求导并用 $1 + \\sinh^2 z = \\cosh^2 z$："],
            [`y' = \\sinh\\frac{x}{${a}}, \\quad \\sqrt{1 + \\sinh^2\\frac{x}{${a}}} = \\cosh\\frac{x}{${a}}`],
          ],
          [
            ["Integrate", "积分"],
            ["The antiderivative is $0$ at $x = 0$:", "原函数在 $x = 0$ 处为 $0$："],
            [`L = \\int_0^{${end}} \\cosh\\frac{x}{${a}}\\,dx = \\Big[${a}\\sinh\\frac{x}{${a}}\\Big]_0^{${end}} = ${a}\\sinh(\\ln ${m})`],
          ],
          [
            ["Evaluate the hyperbolic sine", "求双曲正弦的值"],
            [
              `Use $\\sinh z = \\frac{e^z - e^{-z}}{2}$ with $e^{\\ln ${m}} = ${m}$:`,
              `用 $\\sinh z = \\frac{e^z - e^{-z}}{2}$，且 $e^{\\ln ${m}} = ${m}$：`,
            ],
            [`${a}\\sinh(\\ln ${m}) = ${a} \\cdot \\frac{1}{2}\\left(${m} - \\frac{1}{${m}}\\right) = ${answer.toLatex()}`],
          ],
        ],
        [
          `At the end the chain's height is $${a}\\cosh(\\ln ${m}) = ${a} \\cdot \\frac{1}{2}\\left(${m} + \\frac{1}{${m}}\\right) = ${height.toLatex()}$. Since $\\cosh^2 - \\sinh^2 = 1$, the length satisfies $L^2 = y^2 - ${a}^2$: $\\left(${height.toLatex()}\\right)^2 - ${a * a} = ${height
            .mul(height)
            .sub(Q.of(a * a))
            .toLatex()} = \\left(${answer.toLatex()}\\right)^2$.`,
          `终点处链条的高度是 $${a}\\cosh(\\ln ${m}) = ${a} \\cdot \\frac{1}{2}\\left(${m} + \\frac{1}{${m}}\\right) = ${height.toLatex()}$。由于 $\\cosh^2 - \\sinh^2 = 1$，长度满足 $L^2 = y^2 - ${a}^2$：$\\left(${height.toLatex()}\\right)^2 - ${a * a} = ${height
            .mul(height)
            .sub(Q.of(a * a))
            .toLatex()} = \\left(${answer.toLatex()}\\right)^2$。`,
        ],
      ),
    });
  },
};

const wedgeFromCylinder: KnowledgePointDef = {
  id: "the-wedge-cut-from-a-cylinder",
  figure: calculusDrawings4["volumes-of-solids-with-triangular-cross-sections#the-wedge-cut-from-a-cylinder"],
  title: t("The wedge cut from a cylinder", "从圆柱上切下的楔形"),
  explanation: t(
    "A plane through a diameter of a cylinder's base cuts off a wedge. Sliced perpendicular to that diameter, the wedge shows right triangles whose legs are both proportional to the distance from the diameter to the circle. So the area of a slice is a multiple of $r^2 - x^2$, and the volume is the integral of this across the whole diameter. For example, with $r = 1$ and a plane at $45^\\circ$, both legs equal $y = \\sqrt{1 - x^2}$, the area is $\\frac{1}{2}(1 - x^2)$, and $V = \\frac{1}{2}\\int_{-1}^{1} (1 - x^2)\\,dx = \\frac{1}{2} \\cdot \\frac{4}{3} = \\frac{2}{3}$.\n\nCheck: slice the other way, perpendicular to the $y$-axis. At height $y$ the slice is a rectangle of width $2\\sqrt{1 - y^2}$ and height $y$, and $\\int_0^1 2y\\sqrt{1 - y^2}\\,dy = \\frac{2}{3}$.\n\n> **Watch out.** The slices run across the whole diameter, from $x = -r$ to $x = r$, and a triangle's area has the factor $\\frac{1}{2}$.",
    "过圆柱底面直径的平面切下一个楔形。垂直于这条直径切开，截面是直角三角形，它的两条直角边都与直径到圆周的距离成正比。所以截面积是 $r^2 - x^2$ 的倍数，体积就是它在整条直径上的积分。例如，$r = 1$、平面倾角为 $45^\\circ$ 时，两条直角边都等于 $y = \\sqrt{1 - x^2}$，截面积为 $\\frac{1}{2}(1 - x^2)$，$V = \\frac{1}{2}\\int_{-1}^{1} (1 - x^2)\\,dx = \\frac{1}{2} \\cdot \\frac{4}{3} = \\frac{2}{3}$。\n\n检验：换个方向，垂直于 $y$ 轴切片。高度 $y$ 处的截面是宽 $2\\sqrt{1 - y^2}$、高 $y$ 的矩形，而 $\\int_0^1 2y\\sqrt{1 - y^2}\\,dy = \\frac{2}{3}$。\n\n> **注意。** 截面跨越整条直径，从 $x = -r$ 到 $x = r$；三角形面积有因子 $\\frac{1}{2}$。",
  ),
  generate(rng) {
    const r = rng.int(1, 9);
    const m = rng.int(2, 6);
    const answer = Q.of(2 * m * r ** 3, 3);
    const half = fractionBefore(m, 2);
    return numberProblem({
      prompt: t(
        `The base of a solid is the half disc $x^2 + y^2 \\le ${r * r}$, $y \\ge 0$. Cross sections perpendicular to the $x$-axis are right triangles with one leg in the base and the other leg ${m} times as long. Find the volume.`,
        `一个立体的底面是半圆盘 $x^2 + y^2 \\le ${r * r}$，$y \\ge 0$。垂直于 $x$ 轴的截面是直角三角形，一条直角边在底面内，另一条是它的 ${m} 倍。求体积。`,
      ),
      answer,
      mistakes: [
        {
          value: Q.of(4 * m * r ** 3, 3),
          why: t("This leaves out the $\\frac{1}{2}$ in the area of a triangle.", "这里漏掉了三角形面积中的 $\\frac{1}{2}$。"),
        },
        {
          value: Q.of(m * r ** 3, 3),
          why: t(
            `This integrates only from $x = 0$ to $x = ${r}$; the base runs from $x = -${r}$ to $x = ${r}$.`,
            `这里只从 $x = 0$ 积到 $x = ${r}$；底面从 $x = -${r}$ 延伸到 $x = ${r}$。`,
          ),
        },
        {
          value: Q.of(m * r ** 3),
          why: t(
            `$\\int_{-${r}}^{${r}} (${r * r} - x^2)\\,dx = ${2 * r ** 3} - ${Q.of(2 * r ** 3, 3).toLatex()}$; the integral of $x^2$ was left out.`,
            `$\\int_{-${r}}^{${r}} (${r * r} - x^2)\\,dx = ${2 * r ** 3} - ${Q.of(2 * r ** 3, 3).toLatex()}$；漏掉了 $x^2$ 的积分。`,
          ),
        },
        {
          value: Q.of(2 * m * m * r ** 3, 3),
          why: t(
            `This takes both legs as $${m}y$; one leg is $y$, in the base, and only the other is ${m} times as long.`,
            `这是把两条直角边都当作 $${m}y$；一条直角边是底面内的 $y$，只有另一条是它的 ${m} 倍。`,
          ),
        },
      ],
      solution: walkThrough(
        [
          [
            ["Write the area of a slice", "写出截面积"],
            ["The leg in the base reaches the circle:", "底面内的直角边延伸到圆周："],
            [`y = \\sqrt{${r * r} - x^2}, \\quad A(x) = \\frac{1}{2} \\cdot y \\cdot ${m}y = ${half}(${r * r} - x^2)`],
          ],
          [
            ["Integrate across the diameter", "沿直径积分"],
            [`The slices run from $x = -${r}$ to $x = ${r}$:`, `截面从 $x = -${r}$ 到 $x = ${r}$：`],
            [
              `V = ${half}\\int_{-${r}}^{${r}} (${r * r} - x^2)\\,dx = ${half}\\left(${2 * r ** 3} - ${Q.of(2 * r ** 3, 3).toLatex()}\\right) = ${answer.toLatex()}`,
            ],
          ],
        ],
        [
          `Slice the other way, perpendicular to the $y$-axis. At height $y$ the slice is a rectangle of width $2\\sqrt{${r * r} - y^2}$ and height $${m}y$, so $V = \\int_0^{${r}} ${2 * m}y\\sqrt{${r * r} - y^2}\\,dy = ${2 * m}\\Big[-\\frac{1}{3}(${r * r} - y^2)^{3/2}\\Big]_0^{${r}} = ${2 * m} \\cdot \\frac{${r ** 3}}{3} = ${answer.toLatex()}$.`,
          `换个方向，垂直于 $y$ 轴切片。高度 $y$ 处的截面是宽 $2\\sqrt{${r * r} - y^2}$、高 $${m}y$ 的矩形，所以 $V = \\int_0^{${r}} ${2 * m}y\\sqrt{${r * r} - y^2}\\,dy = ${2 * m}\\Big[-\\frac{1}{3}(${r * r} - y^2)^{3/2}\\Big]_0^{${r}} = ${2 * m} \\cdot \\frac{${r ** 3}}{3} = ${answer.toLatex()}$。`,
        ],
      ),
    });
  },
};

const napkinRing: KnowledgePointDef = {
  id: "the-volume-of-a-napkin-ring",
  figure: calculusDrawings4["volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes#the-volume-of-a-napkin-ring"],
  title: t("The volume of a napkin ring", "餐巾环的体积"),
  explanation: t(
    "Drilling a cylindrical hole through the center of a sphere leaves a ring. With the hole along an axis, each slice perpendicular to it is a washer whose outer radius comes from the sphere and whose inner radius is the hole. The slices stop where the two radii meet, at $y = \\pm B$ with $B^{2} = R^{2} - A^{2}$, and in the difference of squares the radius of the sphere drops out:\n\n$$V = \\pi\\int_{-B}^{B} \\left(R^{2} - y^{2} - A^{2}\\right) dy = \\pi\\int_{-B}^{B} \\left(B^{2} - y^{2}\\right) dy = \\frac{4}{3}B^{3}\\pi$$\n\nFor example, a hole of radius $3$ through a sphere of radius $5$ gives $B = 4$ and\n\n$$V = \\pi\\left(128 - \\frac{128}{3}\\right) = \\frac{256}{3}\\pi$$\n\nCheck: the graph of $16 - y^{2}$ is a parabola over $[-4, 4]$ with top $16$, and a parabola fills $\\frac{2}{3}$ of its rectangle, so the integral is\n\n$$\\frac{2}{3} \\cdot 8 \\cdot 16 = \\frac{256}{3}$$\n\n> **Watch out.** Do not subtract a smaller sphere or a plain cylinder from the ball. The hole is a cylinder with a cap at each end, and the washers account for both.",
    "沿球心钻一个圆柱形的孔，剩下的是一个环。让孔沿坐标轴放置，垂直于轴的每个截面都是垫圈，外半径来自球面，内半径就是孔的半径。截面在两个半径相等处终止，即 $y = \\pm B$，其中 $B^{2} = R^{2} - A^{2}$；在平方差中，球的半径消去了：\n\n$$V = \\pi\\int_{-B}^{B} \\left(R^{2} - y^{2} - A^{2}\\right) dy = \\pi\\int_{-B}^{B} \\left(B^{2} - y^{2}\\right) dy = \\frac{4}{3}B^{3}\\pi$$\n\n例如，在半径为 $5$ 的球上钻半径为 $3$ 的孔，$B = 4$，\n\n$$V = \\pi\\left(128 - \\frac{128}{3}\\right) = \\frac{256}{3}\\pi$$\n\n检验：$16 - y^{2}$ 的图像是 $[-4, 4]$ 上顶点高 $16$ 的抛物线，抛物线占它所在矩形的 $\\frac{2}{3}$，所以积分是\n\n$$\\frac{2}{3} \\cdot 8 \\cdot 16 = \\frac{256}{3}$$\n\n> **注意。** 不要从球中减去一个小球或一个单纯的圆柱。孔是两端各带一个球冠的圆柱，垫圈法把两者都算进去了。",
  ),
  generate(rng) {
    const { a, b, h } = pythagorean(rng);
    const s = rng.int(1, 2);
    const A = s * a;
    const B = s * b;
    const R = s * h;
    const answer = Q.of(4 * B ** 3, 3);
    return numberProblem({
      prompt: t(
        `A cylindrical hole of radius $${A}$ is drilled through the center of a sphere of radius $${R}$. The volume of the solid that remains is $c\\pi$. Find $c$.`,
        `沿半径为 $${R}$ 的球的球心钻一个半径为 $${A}$ 的圆柱形孔。剩下的立体的体积是 $c\\pi$。求 $c$。`,
      ),
      answer,
      mistakes: [
        {
          value: Q.of(4 * R ** 3, 3),
          why: t("This is the whole sphere; the hole has not been taken out.", "这是整个球的体积，孔还没有去掉。"),
        },
        {
          value: Q.of(4 * (R ** 3 - A ** 3), 3),
          why: t(
            `This takes a sphere of radius $${A}$ out of the ball. The hole is a cylinder with two caps, so use washers instead.`,
            `这是从球中去掉了半径为 $${A}$ 的小球。孔是带两个球冠的圆柱，应该用垫圈法。`,
          ),
        },
        {
          value: Q.of(2 * B ** 3, 3),
          why: t(
            `This is only the half above $y = 0$. The washers run from $y = -${B}$ to $y = ${B}$.`,
            `这只是 $y = 0$ 上方的一半。垫圈从 $y = -${B}$ 一直到 $y = ${B}$。`,
          ),
        },
        {
          value: Q.of(4 * A ** 3, 3),
          why: t(
            `This uses the radius of the hole, $${A}$, as the half-height. The slices stop at $y = \\pm${B}$, where $y^{2} = ${R * R} - ${A * A}$.`,
            `这里把孔的半径 $${A}$ 当成了半高。截面在 $y = \\pm${B}$ 处终止，那里 $y^{2} = ${R * R} - ${A * A}$。`,
          ),
        },
      ],
      solution: walkThrough(
        [
          [
            ["Write the washer", "写出垫圈"],
            [
              `Take the hole along the $y$-axis. At height $y$ the outer radius squared is $${R * R} - y^{2}$ and the inner radius squared is $${A * A}$:`,
              `让孔沿 $y$ 轴。高度 $y$ 处外半径的平方是 $${R * R} - y^{2}$，内半径的平方是 $${A * A}$：`,
            ],
            [`\\left(${R * R} - y^{2}\\right) - ${A * A} = ${B * B} - y^{2}`],
          ],
          [
            ["Find the limits", "求积分限"],
            [
              `The washers exist while the outer radius is larger than the hole, that is while $y^{2} \\le ${B * B}$, so $y$ runs from $-${B}$ to $${B}$.`,
              `外半径大于孔的半径时才有垫圈，即 $y^{2} \\le ${B * B}$，所以 $y$ 从 $-${B}$ 到 $${B}$。`,
            ],
          ],
          [
            ["Integrate", "积分"],
            ["Add up the washers:", "把垫圈加起来："],
            [
              `V = \\pi\\int_{-${B}}^{${B}} \\left(${B * B} - y^{2}\\right) dy = \\pi\\left(${2 * B ** 3} - ${Q.of(2 * B ** 3, 3).toLatex()}\\right) = ${piTimes(answer)}`,
            ],
          ],
        ],
        [
          `The graph of $${B * B} - y^{2}$ is a parabola over $[-${B}, ${B}]$ with top $${B * B}$, and a parabola fills $\\frac{2}{3}$ of its rectangle: $\\frac{2}{3} \\cdot ${2 * B} \\cdot ${B * B} = ${answer.toLatex()}$. So $c = ${answer.toLatex()}$.`,
          `$${B * B} - y^{2}$ 的图像是 $[-${B}, ${B}]$ 上顶点高 $${B * B}$ 的抛物线，抛物线占它所在矩形的 $\\frac{2}{3}$：$\\frac{2}{3} \\cdot ${2 * B} \\cdot ${B * B} = ${answer.toLatex()}$。所以 $c = ${answer.toLatex()}$。`,
        ],
      ),
    });
  },
};

const squaresOverEllipse: KnowledgePointDef = {
  id: "squares-over-an-elliptical-base",
  figure: calculusDrawings4["volumes-of-solids-with-square-cross-sections#squares-over-an-elliptical-base"],
  title: t("Squares over an elliptical base", "椭圆底面上的正方形截面"),
  explanation: t(
    "On a base bounded by a closed curve, the side of a cross section is the full chord across the region, which is twice the height of the upper half when the base is symmetric. Solving the equation of the ellipse for $y^2$ gives the area of a square directly, with no root left to handle, as a quadratic in $x$ to integrate. For example, over the disc $x^2 + y^2 \\le 1$ the side is $2y$, the area is $4y^2 = 4(1 - x^2)$, and $V = 4\\int_{-1}^{1} (1 - x^2)\\,dx = 4\\left(2 - \\frac{2}{3}\\right) = \\frac{16}{3}$.\n\nCheck: $A(x) = 4(1 - x^2)$ is a parabola, largest $4$ at $x = 0$ and zero at $x = \\pm 1$, so the integral fills $\\frac{2}{3}$ of the rectangle $2 \\times 4$: $\\frac{2}{3} \\cdot 8 = \\frac{16}{3}$.\n\n> **Watch out.** The side is the whole chord $2y$, so the area is $4y^2$, not $y^2$.",
    "底面由闭曲线围成时，截面的边长是穿过区域的整条弦；底面对称时，它等于上半部分高度的两倍。从椭圆方程解出 $y^2$，就直接得到正方形的面积，不必处理根号，它是 $x$ 的二次式，可以直接积分。例如，在圆盘 $x^2 + y^2 \\le 1$ 上，边长为 $2y$，面积为 $4y^2 = 4(1 - x^2)$，$V = 4\\int_{-1}^{1} (1 - x^2)\\,dx = 4\\left(2 - \\frac{2}{3}\\right) = \\frac{16}{3}$。\n\n检验：$A(x) = 4(1 - x^2)$ 是抛物线，在 $x = 0$ 处最大为 $4$，在 $x = \\pm 1$ 处为零，所以积分占 $2 \\times 4$ 矩形的 $\\frac{2}{3}$：$\\frac{2}{3} \\cdot 8 = \\frac{16}{3}$。\n\n> **注意。** 边长是整条弦 $2y$，所以面积是 $4y^2$，不是 $y^2$。",
  ),
  generate(rng) {
    const a = rng.int(2, 7);
    const b = rng.int(2, 7);
    const answer = Q.of(16 * a * b * b, 3);
    const ellipse = `\\frac{x^2}{${a * a}} + \\frac{y^2}{${b * b}} = 1`;
    const area = `${4 * b * b}\\left(1 - \\frac{x^2}{${a * a}}\\right)`;
    return numberProblem({
      prompt: t(
        `The base of a solid is the region inside the ellipse $${ellipse}$. Cross sections perpendicular to the $x$-axis are squares with one side in the base. Find the volume.`,
        `一个立体的底面是椭圆 $${ellipse}$ 内部的区域。垂直于 $x$ 轴的截面是正方形，一条边在底面内。求体积。`,
      ),
      answer,
      mistakes: [
        {
          value: Q.of(16 * a * a * b, 3),
          why: t(
            `This swaps the semi-axes: the ellipse reaches $x = \\pm ${a}$ across and $y = \\pm ${b}$ up and down.`,
            `这里把两个半轴弄反了：椭圆横向到 $x = \\pm ${a}$，纵向到 $y = \\pm ${b}$。`,
          ),
        },
        {
          value: Q.of(8 * a * b * b, 3),
          why: t(
            `This integrates only from $x = 0$ to $x = ${a}$; the base runs from $x = -${a}$ to $x = ${a}$.`,
            `这里只从 $x = 0$ 积到 $x = ${a}$；底面从 $x = -${a}$ 延伸到 $x = ${a}$。`,
          ),
        },
        {
          value: Q.of(4 * a * b * b, 3),
          why: t(
            "This uses $y$ as the side; the side is the whole chord $2y$, so the area is $4y^2$.",
            "这里把 $y$ 当作边长；边长是整条弦 $2y$，所以面积是 $4y^2$。",
          ),
        },
        {
          value: Q.of(8 * a * b * b),
          why: t(
            `This leaves out the integral of the $\\frac{x^2}{${a * a}}$ term; the area shrinks to zero at the ends of the ellipse.`,
            `这里漏掉了 $\\frac{x^2}{${a * a}}$ 项的积分；面积在椭圆两端缩小到零。`,
          ),
        },
      ],
      solution: walkThrough(
        [
          [
            ["Find the side of a square", "求正方形的边长"],
            ["Solve the ellipse for $y^2$; the side is the chord from $-y$ to $y$:", "从椭圆方程解出 $y^2$；边长是从 $-y$ 到 $y$ 的弦："],
            [`y^2 = ${b * b}\\left(1 - \\frac{x^2}{${a * a}}\\right), \\quad s = 2y`],
          ],
          [["Write the area", "写出面积"], ["The area of a square is $s^2$:", "正方形的面积为 $s^2$："], [`A(x) = 4y^2 = ${area}`]],
          [
            ["Integrate", "积分"],
            [`The squares run from $x = -${a}$ to $x = ${a}$:`, `正方形从 $x = -${a}$ 到 $x = ${a}$：`],
            [
              `V = \\int_{-${a}}^{${a}} ${area}\\,dx = ${4 * b * b}\\left(${2 * a} - ${Q.of(2 * a, 3).toLatex()}\\right) = ${answer.toLatex()}`,
            ],
          ],
        ],
        [
          `$A(x)$ is a parabola in $x$, largest, $${4 * b * b}$, at $x = 0$ and zero at $x = \\pm ${a}$. Its integral fills $\\frac{2}{3}$ of the rectangle $${2 * a} \\times ${4 * b * b}$: $\\frac{2}{3} \\cdot ${2 * a} \\cdot ${4 * b * b} = ${answer.toLatex()}$.`,
          `$A(x)$ 是 $x$ 的抛物线，在 $x = 0$ 处最大，为 $${4 * b * b}$，在 $x = \\pm ${a}$ 处为零。它的积分占 $${2 * a} \\times ${4 * b * b}$ 矩形的 $\\frac{2}{3}$：$\\frac{2}{3} \\cdot ${2 * a} \\cdot ${4 * b * b} = ${answer.toLatex()}$。`,
        ],
      ),
    });
  },
};

const parametricConcavityChange: KnowledgePointDef = {
  id: "where-a-parametric-curve-changes-concavity",
  title: t("Where a parametric curve changes concavity", "参数曲线改变凹凸性的位置"),
  explanation: t(
    "For a parametric curve, $\\frac{d^{2}y}{dx^{2}}$ is the $t$-derivative of $\\frac{dy}{dx}$ divided by $\\frac{dx}{dt}$. Concavity changes where this quotient changes sign. Keep the result as a single fraction in $t$ rather than evaluating it at a point: the sign of the denominator is often fixed on the given range of $t$, so only the zeros of the numerator matter.",
    "对参数曲线，$\\frac{d^{2}y}{dx^{2}}$ 等于 $\\frac{dy}{dx}$ 对 $t$ 的导数除以 $\\frac{dx}{dt}$。这个商改变符号的地方，就是凹凸性改变的地方。把结果保留为 $t$ 的一个分式，而不是代入某一点：分母的符号在给定的 $t$ 范围内常常是固定的，所以只需看分子的零点。",
  ),
  generate(rng) {
    const m = rng.int(1, 6);
    const alpha = rng.int(1, 4);
    const beta = nonzero(rng, 3);
    const y = poly([beta, "t^3"], [3 * beta * m * m, "t"]);
    const numerator = 6 * alpha * beta;
    return numberProblem({
      prompt: t(
        `A curve is given by $x = ${coefficientOf(alpha)}t^2, \\; y = ${y}$ for $t > 0$. At which value of $t$ does $\\frac{d^{2}y}{dx^{2}}$ change sign?`,
        `曲线由 $x = ${coefficientOf(alpha)}t^2, \\; y = ${y}$（$t > 0$）给出。$\\frac{d^{2}y}{dx^{2}}$ 在 $t$ 取何值时改变符号？`,
      ),
      answer: m,
      form: "integer",
      wrong: [m * m, 3 * m * m, m + 1, 6 * m * m],
      solution: t(
        `$\\frac{dy}{dx} = \\frac{${poly([3 * beta, "t^2"], [3 * beta * m * m, ""])}}{${2 * alpha}t}$. Differentiating in $t$ and dividing by $${2 * alpha}t$ gives $\\frac{d^{2}y}{dx^{2}} = \\frac{${numerator}(t^2 - ${m * m})}{${8 * alpha ** 3}t^3}$. For $t > 0$ the denominator is positive, so the sign changes only at $t = ${m}$.`,
        `$\\frac{dy}{dx} = \\frac{${poly([3 * beta, "t^2"], [3 * beta * m * m, ""])}}{${2 * alpha}t}$。对 $t$ 求导再除以 $${2 * alpha}t$，得 $\\frac{d^{2}y}{dx^{2}} = \\frac{${numerator}(t^2 - ${m * m})}{${8 * alpha ** 3}t^3}$。$t > 0$ 时分母为正，所以只在 $t = ${m}$ 处改变符号。`,
      ),
    });
  },
};

const whenTwoPointsMeet: KnowledgePointDef = {
  id: "when-two-moving-points-meet",
  title: t("When two moving points meet", "两个运动的点何时相遇"),
  explanation: t(
    "Two vector-valued functions describe points at the same place only when every component agrees at the same value of $t$. Equal second components alone are not enough, since the points may then be separated horizontally. So solve the simplest component equation first, then test the candidates in the other component, and keep only a time that satisfies both.",
    "两个向量值函数表示的点在同一位置，当且仅当在同一个 $t$ 处所有分量都相等。只有第二个分量相等还不够，因为这时两点可能在水平方向上分开。所以先解最简单的分量方程，再把解代入另一个分量检验，只保留同时满足两者的时刻。",
  ),
  generate(rng) {
    const T = rng.int(1, 6);
    const alpha = nonzero(rng, 5);
    const beta = nonzero(rng, 5);
    const m = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => v !== 2 * T));
    const r1 = `\\langle ${poly([1, "t"], [alpha, ""])}, ${poly([1, "t^2"], [beta, ""])} \\rangle`;
    const r2 = `\\langle ${poly([2, "t"], [alpha - T, ""])}, ${poly([m, "t"], [beta + T * T - m * T, ""])} \\rangle`;
    return numberProblem({
      prompt: t(
        `Two points move along $\\mathbf{r}_1(t) = ${r1}$ and $\\mathbf{r}_2(t) = ${r2}$. At which time $t > 0$ are they at the same place?`,
        `两个点分别沿 $\\mathbf{r}_1(t) = ${r1}$ 和 $\\mathbf{r}_2(t) = ${r2}$ 运动。在哪个时刻 $t > 0$ 它们位于同一位置？`,
      ),
      answer: T,
      form: "integer",
      wrong: [m - T, m, T * T, T + 1, T + 3],
      solution: t(
        `The first components agree only when $${poly([1, "t"], [alpha, ""])} = ${poly([2, "t"], [alpha - T, ""])}$, that is at $t = ${T}$. There both second components equal $${T * T + beta}$, so the points meet. The second components also agree at $t = ${m - T}$, but the first components differ there.`,
        `第一个分量只在 $${poly([1, "t"], [alpha, ""])} = ${poly([2, "t"], [alpha - T, ""])}$ 时相等，即 $t = ${T}$。此时两个第二分量都等于 $${T * T + beta}$，所以两点相遇。第二分量在 $t = ${m - T}$ 处也相等，但那里第一分量不同。`,
      ),
    });
  },
};

const lengthOfLogarithmicSpiral: KnowledgePointDef = {
  id: "the-length-of-a-logarithmic-spiral",
  figure: calculusDrawings5["the-arc-length-of-a-polar-curve#the-length-of-a-logarithmic-spiral"],
  title: t("The length of a logarithmic spiral", "对数螺线的长度"),
  explanation: t(
    "On the spiral $r = e^{k\\theta}$, the derivative of $r$ is $k$ times $r$, so $r^2 + \\left(\\frac{dr}{d\\theta}\\right)^2$ has $r^2$ as a factor and the root in the length formula simplifies. Changing variable from $\\theta$ to $r$ then shows that length is proportional to the change in distance from the pole, so the angle never needs to be found.",
    "在螺线 $r = e^{k\\theta}$ 上，$r$ 的导数是 $r$ 的 $k$ 倍，所以 $r^2 + \\left(\\frac{dr}{d\\theta}\\right)^2$ 含有因子 $r^2$，弧长公式中的根号得以化简。再把变量从 $\\theta$ 换成 $r$，可以看到长度与到极点距离的变化量成正比，所以根本不需要求出角度。",
  ),
  generate(rng) {
    const { a, b, h } = pythagorean(rng);
    const p = rng.int(1, 4);
    const q = rng.int(p + 1, 9);
    const k = Q.of(a, b);
    const factor = Q.of(h, a);
    const answer = factor.mul(Q.of(q - p));
    return numberProblem({
      prompt: t(
        `Find the length of the spiral $r = e^{${k.toLatex()}\\theta}$ from the point where $r = ${p}$ to the point where $r = ${q}$.`,
        `求螺线 $r = e^{${k.toLatex()}\\theta}$ 从 $r = ${p}$ 的点到 $r = ${q}$ 的点的长度。`,
      ),
      answer,
      wrong: [Q.of(h * (q - p), b), Q.of(a * (q - p), h), Q.of(q - p), Q.of(h * (q * q - p * p), 2 * a)],
      solution: t(
        `Here $k = ${k.toLatex()}$ and $\\frac{dr}{d\\theta} = kr$, so $ds = r\\sqrt{1 + k^2}\\,d\\theta$ with $\\sqrt{1 + k^2} = ${Q.of(h, b).toLatex()}$. Since $dr = kr\\,d\\theta$, this is $ds = ${factor.toLatex()}\\,dr$. So the length is $${factor.toLatex()} \\cdot ${q - p} = ${answer.toLatex()}$.`,
        `这里 $k = ${k.toLatex()}$，$\\frac{dr}{d\\theta} = kr$，所以 $ds = r\\sqrt{1 + k^2}\\,d\\theta$，其中 $\\sqrt{1 + k^2} = ${Q.of(h, b).toLatex()}$。因为 $dr = kr\\,d\\theta$，所以 $ds = ${factor.toLatex()}\\,dr$。于是长度是 $${factor.toLatex()} \\cdot ${q - p} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const tailFromPartialSum: KnowledgePointDef = {
  id: "a-tail-sum-from-the-partial-sum-formula",
  title: t("A tail sum from the partial sum formula", "由部分和公式求尾部和"),
  explanation: t(
    "A formula for the partial sums contains everything about a series. Its limit as $n$ grows is the sum of the whole series. The partial sum at a given index is the total of the terms up to that index. So the sum from a later index onward is the limit minus the partial sum that stops just before that index, with no individual terms needed.",
    "部分和公式包含了级数的全部信息。它在 $n$ 增大时的极限就是整个级数的和。某一项处的部分和就是到那一项为止各项的总和。所以从后面某一项开始的和，等于极限减去恰好停在那一项之前的部分和，不需要逐项计算。",
  ),
  generate(rng) {
    const p = nonzero(rng, 9);
    const q = rng.int(1, 6);
    const m = rng.int(3, 8);
    const removed = Q.of(p * (m - 1), m - 1 + q);
    const answer = Q.of(p).sub(removed);
    const shown = removed.sign() < 0 ? `\\left(${removed.toLatex()}\\right)` : removed.toLatex();
    return numberProblem({
      prompt: t(
        `The $n$th partial sum of $\\sum_{n=1}^{\\infty} a_n$ is $S_n = \\frac{${signedCoefficient(p)}n}{n + ${q}}$. Find $\\sum_{n=${m}}^{\\infty} a_n$.`,
        `$\\sum_{n=1}^{\\infty} a_n$ 的第 $n$ 个部分和是 $S_n = \\frac{${signedCoefficient(p)}n}{n + ${q}}$。求 $\\sum_{n=${m}}^{\\infty} a_n$。`,
      ),
      answer,
      wrong: [Q.of(p), removed, Q.of(p * q, m + q), Q.of(p * m, m + q)],
      solution: t(
        `The whole series has sum $\\lim_{n \\to \\infty} S_n = ${p}$. The terms before $n = ${m}$ add up to $S_{${m - 1}} = ${removed.toLatex()}$. So the sum asked for is $${p} - ${shown} = ${answer.toLatex()}$.`,
        `整个级数的和是 $\\lim_{n \\to \\infty} S_n = ${p}$。$n = ${m}$ 之前的各项之和是 $S_{${m - 1}} = ${removed.toLatex()}$。所以所求的和是 $${p} - ${shown} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const widthOfIntegralBounds: KnowledgePointDef = {
  id: "the-width-of-the-integral-test-bounds",
  title: t("The width of the integral test bounds", "积分判别法上下界的宽度"),
  explanation: t(
    "The remainder after $N$ terms lies between two improper integrals: one starting at $N + 1$ and one starting at $N$. Adding $S_N$ traps the true sum between a lower and an upper bound. The partial sum is common to both, so the distance between the bounds depends only on the two integrals, and it can be found without computing $S_N$.",
    "前 $N$ 项之后的余项介于两个反常积分之间：一个从 $N + 1$ 开始，另一个从 $N$ 开始。加上 $S_N$，就把真正的和夹在下界和上界之间。两个界都含部分和，所以它们之间的距离只取决于这两个积分，不必计算 $S_N$ 就能求出。",
  ),
  generate(rng) {
    const k = rng.int(1, 9);
    const p = rng.int(2, 3);
    const N = rng.int(3, 12);
    const tail = (start: number) => Q.of(k, (p - 1) * start ** (p - 1));
    const answer = tail(N).sub(tail(N + 1));
    return numberProblem({
      prompt: t(
        `For $S = \\sum_{n=1}^{\\infty} \\frac{${k}}{n^{${p}}}$, the integral test traps $S$ between a lower and an upper bound that both use $S_{${N}}$. How far apart are the two bounds?`,
        `对 $S = \\sum_{n=1}^{\\infty} \\frac{${k}}{n^{${p}}}$，积分判别法把 $S$ 夹在都用到 $S_{${N}}$ 的下界和上界之间。这两个界相距多远？`,
      ),
      answer,
      wrong: [tail(N), tail(N + 1), tail(N).add(tail(N + 1)), Q.of(k, N ** p)],
      solution: t(
        `The bounds are $S_{${N}} + \\int_{${N + 1}}^\\infty f$ and $S_{${N}} + \\int_{${N}}^\\infty f$, where $f(x) = \\frac{${k}}{x^{${p}}}$. These integrals are $${tail(N + 1).toLatex()}$ and $${tail(N).toLatex()}$. The partial sum cancels, so the distance is $${tail(N).toLatex()} - ${tail(N + 1).toLatex()} = ${answer.toLatex()}$.`,
        `两个界是 $S_{${N}} + \\int_{${N + 1}}^\\infty f$ 和 $S_{${N}} + \\int_{${N}}^\\infty f$，其中 $f(x) = \\frac{${k}}{x^{${p}}}$。这两个积分分别是 $${tail(N + 1).toLatex()}$ 和 $${tail(N).toLatex()}$。部分和相互抵消，所以距离是 $${tail(N).toLatex()} - ${tail(N + 1).toLatex()} = ${answer.toLatex()}$。`,
      ),
    });
  },
};

const degreeForAccuracy: KnowledgePointDef = {
  id: "the-degree-needed-for-an-accuracy",
  title: t("The degree needed for an accuracy", "达到给定精度所需的次数"),
  explanation: t(
    "The Lagrange bound can be read backwards. Every derivative of sine and cosine is at most $1$ in size, so the error of the polynomial of degree $n$ is bounded by a power of $|x|$ over a factorial, both with index $n + 1$. The factorial eventually wins, so try successive values of $n$ until the bound falls below the required accuracy.",
    "拉格朗日界可以反过来用。正弦和余弦的各阶导数的绝对值都不超过 $1$，所以 $n$ 次多项式的误差不超过 $|x|$ 的幂除以阶乘，两者的指标都是 $n + 1$。阶乘最终占优，所以逐个试 $n$，直到这个界小于所要求的精度。",
  ),
  generate(rng) {
    const sine = rng.pick([true, false]);
    const x = rng.pick([Q.of(1, 2), Q.of(1), Q.of(3, 2), Q.of(2), Q.of(3)]);
    const power = rng.int(1, 4);
    const accuracy = Q.of(1, 10 ** power);
    const bound = (n: number) => x.pow(n + 1).div(Q.of(factorial(n + 1)));
    let n = 0;
    while (bound(n).cmp(accuracy) >= 0) n += 1;
    const fn = sine ? "\\sin" : "\\cos";
    return numberProblem({
      prompt: t(
        `Find the smallest degree $n$ for which the Lagrange error bound guarantees that the Taylor polynomial of degree $n$ for $${fn} x$ centered at $0$ has error less than $${accuracy.toLatex()}$ at $x = ${x.toLatex()}$.`,
        `求最小的次数 $n$，使拉格朗日误差界能保证 $${fn} x$ 在 $0$ 处的 $n$ 次泰勒多项式在 $x = ${x.toLatex()}$ 处的误差小于 $${accuracy.toLatex()}$。`,
      ),
      answer: n,
      form: "integer",
      wrong: [n + 1, n - 1, n + 2, n + 3],
      solution: t(
        `Every derivative of $${fn} x$ is at most $1$ in size, so the error is at most $\\frac{|x|^{n+1}}{(n+1)!}$. At degree $${n - 1}$ this is $${bound(n - 1).toLatex()}$, which is not below the accuracy. At degree $${n}$ it is $${bound(n).toLatex()}$, which is. So $n = ${n}$.`,
        `$${fn} x$ 的各阶导数的绝对值都不超过 $1$，所以误差不超过 $\\frac{|x|^{n+1}}{(n+1)!}$。次数为 $${n - 1}$ 时它等于 $${bound(n - 1).toLatex()}$，没有小于所要求的精度。次数为 $${n}$ 时它等于 $${bound(n).toLatex()}$，小于精度。所以 $n = ${n}$。`,
      ),
    });
  },
};

const sumWithNSquared: KnowledgePointDef = {
  id: "a-sum-with-n-squared-by-differentiating-twice",
  title: t("A sum with n squared by differentiating twice", "两次求导求含 n 平方的和"),
  explanation: t(
    "Differentiating a power series and multiplying by $x$ puts one factor of $n$ into each term. Doing this to the geometric series gives the sum of $nx^n$, and doing it once more gives the sum of $n^2x^n$. Each round is a quotient rule on a closed form, and the result holds inside the interval of convergence, so a number can then be substituted.",
    "对幂级数求导再乘以 $x$，每一项就多一个因子 $n$。对等比级数这样做一次，得到 $nx^n$ 的和；再做一次，得到 $n^2x^n$ 的和。每一轮都是对闭式用商法则，结果在收敛区间内成立，所以可以代入具体的数。",
  ),
  generate(rng) {
    const b = rng.int(2, 9);
    const k = rng.int(1, 6);
    const alternating = rng.pick([true, false]);
    const x = Q.of(alternating ? -1 : 1, b);
    const one = Q.of(1);
    const sign = Q.of(alternating ? -k : k);
    const closed = x.mul(one.add(x)).div(one.sub(x).pow(3));
    const answer = sign.mul(closed);
    const signPart = alternating ? "(-1)^{n+1} " : "";
    const note = alternating ? ", and $(-1)^{n+1} = -(-1)^n$ puts a minus sign in front" : "";
    const factor = k === 1 ? "" : `, multiplied by $${k}$`;
    const factorZh = k === 1 ? "" : `，再乘以 $${k}$`;
    const noteZh = alternating ? "，而 $(-1)^{n+1} = -(-1)^n$ 使前面多一个负号" : "";
    return numberProblem({
      prompt: t(
        `Find the sum of $\\sum_{n=1}^{\\infty} \\frac{${signPart}${coefficientOf(k)}n^2}{${b}^n}$.`,
        `求 $\\sum_{n=1}^{\\infty} \\frac{${signPart}${coefficientOf(k)}n^2}{${b}^n}$ 的和。`,
      ),
      answer,
      wrong: [
        sign.mul(x).div(one.sub(x).pow(2)),
        sign.mul(one.add(x)).div(one.sub(x).pow(3)),
        sign.mul(x).div(one.sub(x).pow(3)),
        answer.neg(),
      ],
      solution: t(
        `From $\\sum_{n=1}^{\\infty} nx^n = \\frac{x}{(1 - x)^2}$, differentiating and multiplying by $x$ gives $\\sum_{n=1}^{\\infty} n^2x^n = \\frac{x(1 + x)}{(1 - x)^3}$. Here $x = ${x.toLatex()}$${note}${factor}. The sum is $${answer.toLatex()}$.`,
        `由 $\\sum_{n=1}^{\\infty} nx^n = \\frac{x}{(1 - x)^2}$，求导再乘以 $x$，得 $\\sum_{n=1}^{\\infty} n^2x^n = \\frac{x(1 + x)}{(1 - x)^3}$。这里 $x = ${x.toLatex()}$${noteZh}${factorZh}。和是 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const errorOfSeriesIntegral: KnowledgePointDef = {
  id: "the-error-of-a-series-estimate-of-an-integral",
  title: t("The error of a series estimate of an integral", "用级数估计积分的误差"),
  explanation: t(
    "Integrating a Maclaurin series term by term gives a numerical series for the integral. When that series alternates and its terms shrink, the error of stopping early is at most the size of the first term left out. So the accuracy of the estimate can be read from one more term of the series, without knowing the exact value of the integral.",
    "把麦克劳林级数逐项积分，就得到积分值的数项级数。当这个级数交错且各项递减时，提前停止的误差不超过第一个被舍去项的大小。所以只要多算一项，就能知道估计的精度，不必知道积分的精确值。",
  ),
  generate(rng) {
    const [c, a] = rng.pick([
      [1, Q.of(1, 2)],
      [2, Q.of(1, 2)],
      [3, Q.of(1, 2)],
      [1, Q.of(1, 3)],
      [2, Q.of(1, 3)],
      [3, Q.of(1, 3)],
      [4, Q.of(1, 3)],
      [5, Q.of(1, 3)],
      [1, Q.of(1, 4)],
      [2, Q.of(1, 4)],
      [3, Q.of(1, 4)],
      [4, Q.of(1, 4)],
      [5, Q.of(1, 4)],
      [2, Q.of(2, 3)],
      [1, Q.of(3, 4)],
      [1, Q.of(2, 3)],
    ]) as [number, Q];
    const m = rng.int(2, 3);
    const size = (n: number) => Q.of(c ** n, factorial(n) * (2 * n + 1)).mul(a.pow(2 * n + 1));
    const answer = size(m);
    const upper = a.toLatex();
    const growth = c === 1 ? "" : `${c}^n `;
    return numberProblem({
      prompt: t(
        `Use the first ${m} nonzero terms of a Maclaurin series to approximate $\\int_0^{${upper}} e^{-${coefficientOf(c)}t^2}\\,dt$. The series alternates and its terms decrease in size. Find the bound on the error given by the alternating series error bound.`,
        `用麦克劳林级数的前 ${m} 个非零项近似 $\\int_0^{${upper}} e^{-${coefficientOf(c)}t^2}\\,dt$。这个级数交错，各项的大小递减。求交错级数误差界给出的误差上界。`,
      ),
      answer,
      wrong: [
        size(m - 1),
        Q.of(c ** m, factorial(m)).mul(a.pow(2 * m + 1)),
        Q.of(c ** m, 2 * m + 1).mul(a.pow(2 * m + 1)),
        Q.of(c ** m, factorial(m)).mul(a.pow(2 * m)),
      ],
      solution: t(
        `Integrating term by term gives terms of size $\\frac{${growth}\\left(${upper}\\right)^{2n+1}}{n!(2n+1)}$ for $n = 0, 1, 2, \\dots$. The terms kept stop at $n = ${m - 1}$, so the bound is the term with $n = ${m}$, which is $${answer.toLatex()}$.`,
        `逐项积分，各项的大小是 $\\frac{${growth}\\left(${upper}\\right)^{2n+1}}{n!(2n+1)}$，$n = 0, 1, 2, \\dots$。保留的项到 $n = ${m - 1}$ 为止，所以误差界是 $n = ${m}$ 的项，等于 $${answer.toLatex()}$。`,
      ),
    });
  },
};

const xFromSeriesSum: KnowledgePointDef = {
  id: "the-value-of-x-from-the-sum-of-a-series",
  title: t("The value of x from the sum of a series", "由级数的和求 x"),
  explanation: t(
    "A geometric series with ratio containing $x$ has a sum that is a function of $x$, so a given sum is an equation for $x$. Write the closed form with attention to the starting index, which decides the numerator, and solve for the ratio. Then check that the ratio is below $1$ in size, since otherwise the series does not converge to that sum at all.",
    "公比含 $x$ 的等比级数，它的和是 $x$ 的函数，所以已知和就是关于 $x$ 的方程。写出闭式时要注意起始下标，它决定分子，然后解出公比。还要检验公比的绝对值小于 $1$，否则级数根本不收敛到这个和。",
  ),
  generate(rng) {
    const start = rng.int(0, 1);
    const k = rng.int(2, 9);
    const s = rng.int(2, 7);
    const fromZero = Q.of(s - 1, s);
    const fromOne = Q.of(s, s + 1);
    const ratio = start === 0 ? fromZero : fromOne;
    const answer = ratio.mul(Q.of(k));
    return numberProblem({
      prompt: t(
        `Find the value of $x$ for which $\\sum_{n=${start}}^{\\infty} \\left(\\frac{x}{${k}}\\right)^n = ${s}$.`,
        `求使 $\\sum_{n=${start}}^{\\infty} \\left(\\frac{x}{${k}}\\right)^n = ${s}$ 的 $x$ 值。`,
      ),
      answer,
      solveFor: "x",
      wrong:
        start === 0
          ? [fromOne.mul(Q.of(k)), Q.of(k * s), Q.of(k, s), Q.of(k * (s + 1), s)]
          : [fromZero.mul(Q.of(k)), Q.of(k * s), Q.of(k, s + 1), Q.of(k * (s + 1), s)],
      solution: t(
        `With ratio $r = \\frac{x}{${k}}$, the sum is $${start === 0 ? "\\frac{1}{1 - r}" : "\\frac{r}{1 - r}"}$. Setting this equal to $${s}$ gives $r = ${ratio.toLatex()}$, which is below $1$ in size, so the series converges. Then $x = ${k}r = ${answer.toLatex()}$.`,
        `设公比 $r = \\frac{x}{${k}}$，和是 $${start === 0 ? "\\frac{1}{1 - r}" : "\\frac{r}{1 - r}"}$。令它等于 $${s}$，得 $r = ${ratio.toLatex()}$，绝对值小于 $1$，所以级数收敛。于是 $x = ${k}r = ${answer.toLatex()}$。`,
      ),
    });
  },
};

/** deeperCalculusIIPoints gives, by topic id, the knowledge points added after a Calculus II topic's own. */
export const deeperCalculusIIPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "calculating-definite-integrals-using-substitution": [scaledKnownIntegral],
  "introduction-to-integration-by-parts": [partsFromValues],
  "expressing-rational-functions-as-sums-of-partial-fractions": [coverUp],
  "improper-integrals": [exponentFromImproper],
  "integrating-rates-of-change": [peakAmount],
  "the-average-value-of-a-function": [averageOverAdjacentIntervals],
  "the-area-between-curves-expressed-as-functions-of-x": [slopeFromEnclosedArea],
  "volumes-of-revolution-using-the-disc-method-rotation-about-the-coordinate-axes": [limitFromVolume],
  "the-shell-method-rotation-about-the-y-axis": [shellsAboutAnotherLine],
  "average-position-velocity-and-acceleration": [averageSpeed],
  "calculating-the-displacement-of-a-particle-using-integration": [returnTime],
  "differentiating-parametric-curves": [selfCrossing],
  "calculating-velocity-for-plane-motion-using-differentiation": [smallestSpeed],
  "finding-displacement-vectors-in-two-dimensions-using-integration": [rangeOfAProjectile],
  "limits-of-sequences": [limitOfLinearRecursion],
  "monotonic-sequences": [limitOfNestedRoot],
  "telescoping-series": [telescopingFromLaterIndex],
  "maclaurin-series": [productOfSeries],
  "recognizing-standard-maclaurin-series": [limitFromExponentialSeries],
  "recognizing-standard-maclaurin-series-for-trigonometric-functions": [limitFromSineSeries],
  "solving-first-order-ivps-using-separation-of-variables": [separableWithSquares],
  "further-modeling-with-first-order-odes": [coolingWithAHalfTime],
  "eulers-method-calculating-one-step": [stepSizeFromEuler],
  "integration-using-the-pythagorean-identities": [evenPowerOfSecant],
  "integrating-products-of-trigonometric-functions": [orthogonalSines],
  "integrating-algebraic-functions-using-substitution": [changedLimits],
  "integrating-exponential-functions-using-substitution": [limitWithLogarithm],
  "integrating-logarithmic-functions-using-substitution": [logLimits],
  "integrating-trigonometric-functions-using-substitution": [powerOverQuarterTurn],
  "integrating-hyperbolic-functions-using-substitution": [sinhCoshLimit],
  "integration-by-substitution-with-inverse-trigonometric-functions": [inverseTrigDefinite],
  "integration-using-the-double-angle-formulas": [doubleAngleTwice],
  "integration-by-parts-in-cyclic-cases": [cyclicImproper],
  "the-tabular-method-of-integration-by-parts": [tabularValue],
  "integrating-rational-functions-using-partial-fractions": [improperPartialFractions],
  "integrating-rational-functions-with-repeated-factors": [overCubedFactor],
  "improper-integrals-over-the-real-line": [evenOverRealLine],
  "improper-integrals-of-the-second-kind": [unboundedAtTop],
  "integrating-density-functions": [massShare],
  "volumes-of-revolution-using-the-washer-method-rotation-about-other-axes": [pappusVolume],
  "calculating-the-total-distance-traveled-by-a-particle": [distanceGap],
  "calculating-velocity-using-integration": [stoppingTime],
  "the-arc-length-of-a-parametric-curve": [astroidLength],
  "calculating-areas-bounded-by-parametric-functions": [astroidArea],
  "finding-the-area-of-a-polar-region": [roseArea],
  "further-determining-limits-of-sequences-using-relative-magnitudes": [conjugateLimit],
  "convergent-and-divergent-infinite-series": [telescopingWithGap],
  "finding-the-sum-of-an-infinite-geometric-series": [bouncingBall],
  "taylor-series": [taylorBySubstitution],
  "representing-functions-as-power-series": [geometricSubstitution],
  "higher-degree-taylor-polynomials": [highDerivativeOfProduct],
  "radius-of-convergence-of-power-series-centered-at-the-origin": [evenPowersRadius],
  "applying-newtons-second-law-in-the-plane": [circularForce],
  "finding-velocity-vectors-in-two-dimensions-using-integration": [projectileSpeed],
  "integrating-linear-rational-functions-using-substitution": [upperLimitFromLogarithm],
  "integration-using-substitution": [xTimesFOfXSquared],
  "further-integration-of-algebraic-functions-using-substitution": [xSquaredInTermsOfU],
  "integration-by-substitution-with-inverse-hyperbolic-functions": [arsinhAsLogarithm],
  "integrating-functions-using-polynomial-division": [constantRemovingLogarithm],
  "integrating-functions-by-completing-the-square": [linearOverCompletedSquare],
  "integration-using-basic-hyperbolic-identities": [powerOfCoshAndSinh],
  "integration-using-the-hyperbolic-pythagorean-identities": [evenPowerOfSech],
  "integration-using-the-hyperbolic-double-angle-formulas": [fourthPowerOfHyperbolic],
  "using-integration-by-parts-to-calculate-integrals-with-logarithms": [convenientConstantInV],
  "applying-the-integration-by-parts-twice": [reductionForPowerTimesExponential],
  "expressing-rational-functions-with-repeated-factors-as-sums-of-partial-fractions": [twoRepeatedFactors],
  "expressing-rational-functions-with-irreducible-quadratic-factors-as-sums-of-partial-fractions": [xSquaredAsOneVariable],
  "integrating-rational-functions-with-irreducible-quadratic-factors": [twoQuadraticsOverHalfLine],
  "improper-integrals-involving-exponential-functions": [exponentialFractionImproper],
  "improper-integrals-involving-arctangent": [realLineCompletedSquare],
  "improper-integrals-of-the-second-kind-discontinuities-at-interior-points": [absoluteValueUnderRoot],
  "the-arc-length-of-a-planar-curve": [lengthOfCatenary],
  "volumes-of-solids-with-triangular-cross-sections": [wedgeFromCylinder],
  "volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes": [napkinRing],
  "volumes-of-solids-with-square-cross-sections": [squaresOverEllipse],
  "second-derivatives-of-parametric-equations": [parametricConcavityChange],
  "defining-vector-valued-functions": [whenTwoPointsMeet],
  "the-arc-length-of-a-polar-curve": [lengthOfLogarithmicSpiral],
  "infinite-series-and-partial-sums": [tailFromPartialSum],
  "the-remainder-estimate-for-the-integral-test": [widthOfIntegralBounds],
  "the-lagrange-error-bound": [degreeForAccuracy],
  "differentiating-taylor-series": [sumWithNSquared],
  "approximating-integrals-using-taylor-series": [errorOfSeriesIntegral],
  "convergence-of-geometric-series": [xFromSeriesSum],
};
