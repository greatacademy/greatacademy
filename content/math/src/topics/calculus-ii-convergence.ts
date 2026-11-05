import type { Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, poly, Q } from "@ga/subject-math";

import { choiceProblem, inequalityProblem, numberProblem } from "../problems.ts";
import { oneOf } from "./calculus-common.ts";
import { term } from "./calculus-ii-sequences.ts";

// Calculus II unit 4: Sequences & Series, module 4.21 (Infinite Series Convergence Tests).

/** sigma writes the sum of a body from n = k to ∞. */
const sigma = (body: string, k = 1) => `\\sum_{n=${k}}^{\\infty} ${body}`;

/** shift writes n + k, or n when k is 0. */
const shift = (k: number) => linear(1, k, "n");

/** verdicts are the answers to "does this series converge?". */
const verdicts = [t("It converges.", "收敛。"), t("It diverges.", "发散。")] as const;

/** verdict asks whether a series converges, with the two verdicts as options. */
function verdict(rng: Rng, series: string, converges: boolean, solution: Text, how?: Text) {
  return oneOf(
    rng,
    t(
      `Does the series $${series}$ converge or diverge?${how ? ` ${how.en}` : ""}`,
      `级数 $${series}$ 收敛还是发散？${how ? how["zh-CN"] : ""}`,
    ),
    verdicts[converges ? 0 : 1],
    [verdicts[converges ? 1 : 0]],
    solution,
  );
}

/** nthTermOutcomes are the outcomes of the nth term test. */
const nthTermOutcomes = [
  t("The series diverges.", "级数发散。"),
  t("The test is inconclusive.", "判别法无法得出结论。"),
  t("The series converges.", "级数收敛。"),
] as const;

/** theNthTermTestForDivergence: if aₙ does not tend to 0, the series diverges. */
export const theNthTermTestForDivergence: TopicDef = {
  id: "the-nth-term-test-for-divergence",
  title: t("The Nth Term Test for Divergence", "发散的第 n 项判别法"),
  summary: t(
    "If lim aₙ ≠ 0 (or does not exist), Σaₙ diverges; if lim aₙ = 0, the test says nothing.",
    "若 lim aₙ ≠ 0（或不存在），则 Σaₙ 发散；若 lim aₙ = 0，此判别法无法得出结论。",
  ),
  prerequisites: ["convergent-and-divergent-infinite-series", "further-determining-limits-of-sequences-using-relative-magnitudes"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "applying-the-nth-term-test",
      title: t("Applying the nth term test", "应用第 n 项判别法"),
      explanation: t(
        "If $\\sum a_n$ converges, then $a_n = S_n - S_{n-1} \\to S - S = 0$. So if $\\lim_{n \\to \\infty} a_n \\neq 0$, or the limit does not exist, the series **diverges**. The converse is false: $\\frac{1}{n} \\to 0$, yet the harmonic series $\\sum \\frac{1}{n}$ diverges. When $a_n \\to 0$ the test is **inconclusive**. For example, $\\sum \\frac{2n}{3n + 1}$ diverges because its terms tend to $\\frac{2}{3}$.",
        "若 $\\sum a_n$ 收敛，则 $a_n = S_n - S_{n-1} \\to S - S = 0$。所以若 $\\lim_{n \\to \\infty} a_n \\neq 0$，或极限不存在，级数**发散**。反过来不成立：$\\frac{1}{n} \\to 0$，但调和级数 $\\sum \\frac{1}{n}$ 发散。当 $a_n \\to 0$ 时，此判别法**无法得出结论**。例如 $\\sum \\frac{2n}{3n + 1}$ 发散，因为其各项趋于 $\\frac{2}{3}$。",
      ),
      generate(rng) {
        const kind = rng.int(0, 4);
        const c = rng.int(1, 9);
        const s = rng.int(1, 9);
        let a: string;
        let limit: string;
        let diverges: boolean;
        if (kind === 0) {
          const p = rng.nonZero(-9, 9);
          a = `\\frac{${linear(p, rng.int(-9, 9), "n")}}{${linear(c, s, "n")}}`;
          limit = Q.of(p, c).toLatex();
          diverges = true;
        } else if (kind === 1) {
          a = rng.bool() ? `\\frac{${c}}{${shift(s)}}` : `\\frac{${term(c, "n")}}{n^{2} + ${s}}`;
          limit = "0";
          diverges = false;
        } else if (kind === 2) {
          const m = rng.int(2, 6);
          const k = rng.int(1, 9);
          if (k === m) return nthTermProblem(rng, `\\frac{${c}}{${shift(s)}}`, "0", false);
          a = `${c}\\left(\\frac{${k}}{${m}}\\right)^{n}`;
          limit = k < m ? "0" : "\\infty";
          diverges = k > m;
        } else if (kind === 3) {
          a = `\\frac{n!}{${c + 1}^{n}}`;
          limit = "\\infty";
          diverges = true;
        } else {
          a = `\\frac{${term(c, "n^{2}")}}{n^{2} + ${s}}`;
          limit = `${c}`;
          diverges = true;
        }
        return nthTermProblem(rng, a, limit, diverges);
      },
    },
    {
      id: "terms-that-need-a-standard-limit",
      title: t("Terms whose limit needs a standard limit", "需要用到常见极限的项"),
      explanation: t(
        "The $n$th term test needs only the limit of the terms, and finding it may take a standard limit. $n \\sin\\left(\\frac{3}{n}\\right) \\to 3$ because $\\frac{\\sin x}{x} \\to 1$; $\\left(1 + \\frac{2}{n}\\right)^{n} \\to e^{2}$; and $(-1)^{n} \\frac{n}{n + 1}$ swings between values near $-1$ and $1$, so it has no limit. Each of these series diverges. But $\\sqrt{n^{2} + 5} - n = \\frac{5}{\\sqrt{n^{2} + 5} + n} \\to 0$, so for that series the test says nothing.",
        "第 $n$ 项判别法只需要各项的极限，而求这个极限可能要用到常见极限。$n \\sin\\left(\\frac{3}{n}\\right) \\to 3$，因为 $\\frac{\\sin x}{x} \\to 1$；$\\left(1 + \\frac{2}{n}\\right)^{n} \\to e^{2}$；$(-1)^{n} \\frac{n}{n + 1}$ 在接近 $-1$ 和 $1$ 的值之间摆动，没有极限。这些级数都发散。但 $\\sqrt{n^{2} + 5} - n = \\frac{5}{\\sqrt{n^{2} + 5} + n} \\to 0$，所以对这个级数此判别法无法得出结论。",
      ),
      generate(rng) {
        const c = rng.int(2, 9);
        const s = rng.int(1, 9);
        const cases = [
          {
            a: `n \\sin\\left(\\frac{${c}}{n}\\right)`,
            limit: t(`$\\to ${c}$, since $\\frac{\\sin x}{x} \\to 1$`, `$\\to ${c}$，因为 $\\frac{\\sin x}{x} \\to 1$`),
            diverges: true,
          },
          { a: `\\left(1 + \\frac{${c}}{n}\\right)^{n}`, limit: t(`$\\to e^{${c}}$`, `$\\to e^{${c}}$`), diverges: true },
          { a: `\\cos\\left(\\frac{${c}}{n}\\right)`, limit: t("$\\to \\cos 0 = 1$", "$\\to \\cos 0 = 1$"), diverges: true },
          {
            a: `(-1)^{n} \\frac{${term(c, "n")}}{${shift(s)}}`,
            limit: t(
              `swings between values near $-${c}$ and $${c}$, so it has no limit`,
              `在接近 $-${c}$ 和 $${c}$ 的值之间摆动，没有极限`,
            ),
            diverges: true,
          },
          {
            a: `\\left(\\sqrt{n^{2} + ${s}} - n\\right)`,
            limit: t(`$= \\frac{${s}}{\\sqrt{n^{2} + ${s}} + n} \\to 0$`, `$= \\frac{${s}}{\\sqrt{n^{2} + ${s}} + n} \\to 0$`),
            diverges: false,
          },
          {
            a: `\\frac{\\ln n}{${term(c, "n")}}`,
            limit: t("$\\to 0$, since $\\ln n$ grows more slowly than $n$", "$\\to 0$，因为 $\\ln n$ 比 $n$ 增长得慢"),
            diverges: false,
          },
        ];
        const k = rng.pick(cases);
        return oneOf(
          rng,
          t(`What does the $n$th term test say about $${sigma(k.a)}$?`, `第 $n$ 项判别法对 $${sigma(k.a)}$ 能得出什么结论？`),
          nthTermOutcomes[k.diverges ? 0 : 1],
          nthTermOutcomes.filter((_, i) => i !== (k.diverges ? 0 : 1)),
          t(
            `The terms $a_n = ${k.a}$ ${k.limit.en}. ${k.diverges ? "They do not tend to $0$, so the series diverges." : "They tend to $0$, so the test is inconclusive and another test is needed."}`,
            `各项 $a_n = ${k.a}$ ${k.limit["zh-CN"]}。${k.diverges ? "它们不趋于 $0$，所以级数发散。" : "它们趋于 $0$，所以此判别法无法得出结论，需要用别的判别法。"}`,
          ),
        );
      },
    },
  ],
};

/** nthTermProblem asks what the nth term test says about Σaₙ given its limit. */
function nthTermProblem(rng: Rng, a: string, limit: string, diverges: boolean) {
  return oneOf(
    rng,
    t(`What does the $n$th term test say about $${sigma(a)}$?`, `第 $n$ 项判别法对 $${sigma(a)}$ 能得出什么结论？`),
    nthTermOutcomes[diverges ? 0 : 1],
    nthTermOutcomes.filter((_, i) => i !== (diverges ? 0 : 1)),
    diverges
      ? t(
          `$\\lim_{n \\to \\infty} a_n = ${limit} \\neq 0$, so the series diverges.`,
          `$\\lim_{n \\to \\infty} a_n = ${limit} \\neq 0$，所以级数发散。`,
        )
      : t(
          "$\\lim_{n \\to \\infty} a_n = 0$, so the test is inconclusive: the series may converge or diverge, and another test is needed.",
          "$\\lim_{n \\to \\infty} a_n = 0$，所以此判别法无法得出结论：级数可能收敛也可能发散，需要用别的判别法。",
        ),
  );
}

/** IntegralCase is a series Σ f(n) with the integral of f from its start to ∞. */
interface IntegralCase {
  readonly series: string;
  readonly converges: boolean;
  readonly work: Text;
}

/** integralCase picks a series that the integral test settles. */
function integralCase(rng: Rng): IntegralCase {
  const c = rng.int(1, 9);
  const a = rng.int(1, 9);
  const kind = rng.int(0, 4);
  if (kind === 0)
    return {
      series: sigma(`\\frac{${c}}{n \\ln n}`, 2),
      converges: false,
      work: t(
        `$\\int_{2}^{\\infty} \\frac{${c}}{x \\ln x} \\, dx = ${c} \\ln(\\ln x) \\Big|_{2}^{\\infty} = \\infty$ (with $u = \\ln x$)`,
        `$\\int_{2}^{\\infty} \\frac{${c}}{x \\ln x} \\, dx = ${c} \\ln(\\ln x) \\Big|_{2}^{\\infty} = \\infty$（令 $u = \\ln x$）`,
      ),
    };
  if (kind === 1)
    return {
      series: sigma(`\\frac{${c}}{n (\\ln n)^{2}}`, 2),
      converges: true,
      work: t(
        `$\\int_{2}^{\\infty} \\frac{${c}}{x (\\ln x)^{2}} \\, dx = -\\frac{${c}}{\\ln x} \\Big|_{2}^{\\infty} = \\frac{${c}}{\\ln 2}$, which is finite`,
        `$\\int_{2}^{\\infty} \\frac{${c}}{x (\\ln x)^{2}} \\, dx = -\\frac{${c}}{\\ln x} \\Big|_{2}^{\\infty} = \\frac{${c}}{\\ln 2}$，是有限值`,
      ),
    };
  if (kind === 2)
    return {
      series: sigma(`${c === 1 ? "" : c}n e^{-n^{2}}`),
      converges: true,
      work: t(
        `$\\int_{1}^{\\infty} ${c === 1 ? "" : c}x e^{-x^{2}} \\, dx = -\\frac{${c}}{2} e^{-x^{2}} \\Big|_{1}^{\\infty} = \\frac{${c}}{2e}$, which is finite`,
        `$\\int_{1}^{\\infty} ${c === 1 ? "" : c}x e^{-x^{2}} \\, dx = -\\frac{${c}}{2} e^{-x^{2}} \\Big|_{1}^{\\infty} = \\frac{${c}}{2e}$，是有限值`,
      ),
    };
  if (kind === 3)
    return {
      series: sigma(`\\frac{${c === 1 ? "" : c}\\ln n}{n}`),
      converges: false,
      work: t(
        `$\\int_{1}^{\\infty} \\frac{${c === 1 ? "" : c}\\ln x}{x} \\, dx = \\frac{${c}}{2} (\\ln x)^{2} \\Big|_{1}^{\\infty} = \\infty$`,
        `$\\int_{1}^{\\infty} \\frac{${c === 1 ? "" : c}\\ln x}{x} \\, dx = \\frac{${c}}{2} (\\ln x)^{2} \\Big|_{1}^{\\infty} = \\infty$`,
      ),
    };
  return {
    series: sigma(`\\frac{${c}}{${shift(a)}}`),
    converges: false,
    work: t(
      `$\\int_{1}^{\\infty} \\frac{${c}}{${linear(1, a)}} \\, dx = ${c} \\ln(${linear(1, a)}) \\Big|_{1}^{\\infty} = \\infty$`,
      `$\\int_{1}^{\\infty} \\frac{${c}}{${linear(1, a)}} \\, dx = ${c} \\ln(${linear(1, a)}) \\Big|_{1}^{\\infty} = \\infty$`,
    ),
  };
}

/** theIntegralTest compares a series of positive decreasing terms with an improper integral. */
export const theIntegralTest: TopicDef = {
  id: "the-integral-test",
  title: t("The Integral Test", "积分判别法"),
  summary: t(
    "If $f$ is positive, continuous and decreasing with $a_n = f(n)$, then $\\sum a_n$ and $\\int_1^{\\infty} f(x)\\,dx$ both converge or both diverge.",
    "若 $f$ 为正、连续且递减，$a_n = f(n)$，则 $\\sum a_n$ 与 $\\int_1^{\\infty} f(x)\\,dx$ 同时收敛或同时发散。",
  ),
  prerequisites: ["the-nth-term-test-for-divergence", "improper-integrals"],
  encompasses: [{ topic: "improper-integrals", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-the-comparison-integral",
      title: t("Evaluating the integral", "计算对应的积分"),
      explanation: t(
        "Let $a_n = f(n)$, where $f$ is positive, continuous and decreasing on $[1, \\infty)$. The terms are the heights of rectangles of width $1$ that lie under the graph from $n - 1$ to $n$ and over it from $n$ to $n + 1$, so\n\n$$\\int_{1}^{\\infty} f(x) \\, dx \\le \\sum_{n=1}^{\\infty} a_n \\le a_1 + \\int_{1}^{\\infty} f(x) \\, dx.$$\n\nHence the series and the integral **both converge or both diverge**. The integral is not the sum. For $\\sum \\frac{3}{(n + 1)^{2}}$: $\\int_{1}^{\\infty} \\frac{3}{(x + 1)^{2}} \\, dx = \\left[-\\frac{3}{x + 1}\\right]_{1}^{\\infty} = \\frac{3}{2}$, so the series converges.",
        "设 $a_n = f(n)$，$f$ 在 $[1, \\infty)$ 上为正、连续且递减。各项是宽为 $1$ 的矩形的高，这些矩形从 $n - 1$ 到 $n$ 位于图像下方，从 $n$ 到 $n + 1$ 位于图像上方，所以\n\n$$\\int_{1}^{\\infty} f(x) \\, dx \\le \\sum_{n=1}^{\\infty} a_n \\le a_1 + \\int_{1}^{\\infty} f(x) \\, dx。$$\n\n因此级数与积分**同时收敛或同时发散**。积分值并不等于级数的和。对 $\\sum \\frac{3}{(n + 1)^{2}}$：$\\int_{1}^{\\infty} \\frac{3}{(x + 1)^{2}} \\, dx = \\left[-\\frac{3}{x + 1}\\right]_{1}^{\\infty} = \\frac{3}{2}$，所以级数收敛。",
      ),
      generate(rng) {
        const c = rng.int(1, 12);
        const a = rng.int(1, 6);
        const kind = rng.int(0, 2);
        const xa = linear(1, a);
        const f =
          kind === 0
            ? `\\frac{${c}}{(${xa})^{2}}`
            : kind === 1
              ? `\\frac{${c}}{(${xa})^{3}}`
              : `\\frac{${term(c, "x")}}{(x^{2} + ${a + 1})^{2}}`;
        const answer = kind === 0 ? Q.of(c, 1 + a) : kind === 1 ? Q.of(c, 2 * (1 + a) ** 2) : Q.of(c, 2 * (a + 2));
        const F = kind === 0 ? `-\\frac{${c}}{${xa}}` : kind === 1 ? `-\\frac{${c}}{2(${xa})^{2}}` : `-\\frac{${c}}{2(x^{2} + ${a + 1})}`;
        return numberProblem({
          prompt: t(
            `To apply the integral test to $${sigma(f.replaceAll("x", "n"))}$, evaluate $\\int_{1}^{\\infty} ${f} \\, dx$.`,
            `为了对 $${sigma(f.replaceAll("x", "n"))}$ 应用积分判别法，计算 $\\int_{1}^{\\infty} ${f} \\, dx$。`,
          ),
          answer,
          wrong: [kind === 0 ? Q.of(c, a) : Q.of(c, 1 + a), answer.mul(Q.of(2)), Q.of(c)],
          solution: t(
            `An antiderivative is $${F}$, which tends to $0$ as $x \\to \\infty$. So the integral is $0 - \\left(${F.replaceAll("x", "1")}\\right) = ${answer.toLatex()}$. It is finite, so the series converges.`,
            `一个原函数是 $${F}$，当 $x \\to \\infty$ 时趋于 $0$。所以积分等于 $0 - \\left(${F.replaceAll("x", "1")}\\right) = ${answer.toLatex()}$。它是有限值，所以级数收敛。`,
          ),
        });
      },
    },
    {
      id: "deciding-convergence-with-the-integral-test",
      title: t("Deciding convergence with the integral test", "用积分判别法判断敛散性"),
      explanation: t(
        "Check that $f$ is positive and decreasing, then evaluate the improper integral. A finite value means the series converges; an infinite one means it diverges. For $\\sum_{n=2}^{\\infty} \\frac{1}{n \\ln n}$, the substitution $u = \\ln x$ gives $\\int_{2}^{\\infty} \\frac{dx}{x \\ln x} = \\ln(\\ln x) \\Big|_{2}^{\\infty} = \\infty$, so the series diverges.",
        "先检查 $f$ 为正且递减，再计算反常积分。积分有限则级数收敛，积分无穷则级数发散。对 $\\sum_{n=2}^{\\infty} \\frac{1}{n \\ln n}$，令 $u = \\ln x$，得 $\\int_{2}^{\\infty} \\frac{dx}{x \\ln x} = \\ln(\\ln x) \\Big|_{2}^{\\infty} = \\infty$，所以级数发散。",
      ),
      generate(rng) {
        const k = integralCase(rng);
        return verdict(
          rng,
          k.series,
          k.converges,
          t(
            `The terms are positive and decreasing, and ${k.work.en}. By the integral test, the series ${k.converges ? "converges" : "diverges"}.`,
            `各项为正且递减，且${k.work["zh-CN"]}。由积分判别法，级数${k.converges ? "收敛" : "发散"}。`,
          ),
          t("Use the integral test.", "用积分判别法。"),
        );
      },
    },
  ],
};

/** theRemainderEstimateForTheIntegralTest bounds the error Rₙ = S − Sₙ by an integral. */
export const theRemainderEstimateForTheIntegralTest: TopicDef = {
  id: "the-remainder-estimate-for-the-integral-test",
  title: t("The Remainder Estimate for the Integral Test", "积分判别法的余项估计"),
  summary: t(
    "For positive decreasing $f$, the remainder after $N$ terms satisfies $R_N \\le \\int_N^{\\infty} f(x)\\,dx$.",
    "对为正且递减的 $f$，前 $N$ 项之后的余项满足 $R_N \\le \\int_N^{\\infty} f(x)\\,dx$。",
  ),
  prerequisites: ["the-integral-test"],
  encompasses: [{ topic: "the-integral-test", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "bounding-the-remainder",
      title: t("Bounding the remainder", "估计余项的上界"),
      explanation: t(
        "The remainder $R_N = S - S_N = a_{N+1} + a_{N+2} + \\cdots$ is a sum of rectangles lying under the graph of $f$ from $N$ on, so\n\n$$R_N \\le \\int_{N}^{\\infty} f(x) \\, dx.$$\n\nFor $\\sum \\frac{1}{n^{2}}$ and $N = 10$: $R_{10} \\le \\int_{10}^{\\infty} \\frac{dx}{x^{2}} = \\frac{1}{10}$.",
        "余项 $R_N = S - S_N = a_{N+1} + a_{N+2} + \\cdots$ 是从 $N$ 起位于 $f$ 图像下方的矩形面积之和，所以\n\n$$R_N \\le \\int_{N}^{\\infty} f(x) \\, dx。$$\n\n对 $\\sum \\frac{1}{n^{2}}$ 且 $N = 10$：$R_{10} \\le \\int_{10}^{\\infty} \\frac{dx}{x^{2}} = \\frac{1}{10}$。",
      ),
      generate(rng) {
        const p = rng.int(2, 4);
        const c = rng.int(1, 9);
        const N = rng.int(2, 10);
        const answer = Q.of(c, (p - 1) * N ** (p - 1));
        return numberProblem({
          prompt: t(
            `Use the integral test remainder estimate to find an upper bound for $R_{${N}} = S - S_{${N}}$, where $S = ${sigma(`\\frac{${c}}{n^{${p}}}`)}$.`,
            `用积分判别法的余项估计，求 $R_{${N}} = S - S_{${N}}$ 的一个上界，其中 $S = ${sigma(`\\frac{${c}}{n^{${p}}}`)}$。`,
          ),
          answer,
          wrong: [Q.of(c, (p - 1) * (N + 1) ** (p - 1)), Q.of(c, N ** p), Q.of(c, N ** (p - 1))],
          solution: t(
            `$R_{${N}} \\le \\int_{${N}}^{\\infty} \\frac{${c}}{x^{${p}}} \\, dx = \\left[-\\frac{${c}}{${p === 2 ? "x" : `${p - 1}x^{${p - 1}}`}}\\right]_{${N}}^{\\infty} = \\frac{${c}}{${p === 2 ? N : `${p - 1} \\cdot ${N}^{${p - 1}}`}} = ${answer.toLatex()}$.`,
            `$R_{${N}} \\le \\int_{${N}}^{\\infty} \\frac{${c}}{x^{${p}}} \\, dx = \\left[-\\frac{${c}}{${p === 2 ? "x" : `${p - 1}x^{${p - 1}}`}}\\right]_{${N}}^{\\infty} = \\frac{${c}}{${p === 2 ? N : `${p - 1} \\cdot ${N}^{${p - 1}}`}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "terms-needed-for-an-accuracy",
      title: t("How many terms are needed", "需要多少项"),
      explanation: t(
        "To guarantee $R_N < \\varepsilon$, choose $N$ so that the bound $\\int_{N}^{\\infty} f(x) \\, dx$ is less than $\\varepsilon$. For $\\sum \\frac{1}{n^{2}}$ with $\\varepsilon = \\frac{1}{100}$: $\\frac{1}{N} < \\frac{1}{100}$ needs $N > 100$, so $N = 101$ terms suffice.",
        "要保证 $R_N < \\varepsilon$，就选 $N$ 使上界 $\\int_{N}^{\\infty} f(x) \\, dx$ 小于 $\\varepsilon$。对 $\\sum \\frac{1}{n^{2}}$，$\\varepsilon = \\frac{1}{100}$：$\\frac{1}{N} < \\frac{1}{100}$ 要求 $N > 100$，所以取 $N = 101$ 项即可。",
      ),
      generate(rng) {
        const p = rng.int(2, 3);
        const c = rng.int(1, 9);
        const m = rng.pick([10, 20, 50, 100, 200, 500, 1000]);
        // The bound c/((p − 1)N^{p−1}) is below 1/m exactly when c·m < (p − 1)N^{p−1}.
        let N = 1;
        while (c * m >= (p - 1) * N ** (p - 1)) N++;
        const bound = p === 2 ? `\\frac{${c}}{N}` : `\\frac{${c}}{2N^{2}}`;
        return numberProblem({
          prompt: t(
            `Find the smallest $N$ for which the integral test remainder estimate guarantees $R_N < \\frac{1}{${m}}$ for $${sigma(`\\frac{${c}}{n^{${p}}}`)}$.`,
            `对 $${sigma(`\\frac{${c}}{n^{${p}}}`)}$，求使积分判别法的余项估计能保证 $R_N < \\frac{1}{${m}}$ 的最小 $N$。`,
          ),
          answer: N,
          wrong: [N - 1, N + 1, c * m],
          solution: t(
            `$R_N \\le \\int_{N}^{\\infty} \\frac{${c}}{x^{${p}}} \\, dx = ${bound}$. We need $${bound} < \\frac{1}{${m}}$, that is $${p === 2 ? `N > ${c * m}` : `N^{2} > ${Q.of(c * m, 2).toLatex()}`}$. The smallest such integer is $N = ${N}$.`,
            `$R_N \\le \\int_{N}^{\\infty} \\frac{${c}}{x^{${p}}} \\, dx = ${bound}$。需要 $${bound} < \\frac{1}{${m}}$，即 $${p === 2 ? `N > ${c * m}` : `N^{2} > ${Q.of(c * m, 2).toLatex()}`}$。满足条件的最小整数是 $N = ${N}$。`,
          ),
        });
      },
    },
  ],
};

/** PowerForm is a term written with roots that equals 1/nᵖ. */
interface PowerForm {
  readonly tex: string;
  readonly p: Q;
  readonly work: string;
}

/** powerForm picks a term such as 1/(n²√n) or ∛n/n² that is a power of n. */
function powerForm(rng: Rng): PowerForm {
  const a = rng.int(1, 5);
  const r = rng.int(2, 3);
  const b = rng.int(1, r === 2 ? 1 : 2);
  const root = r === 2 ? "\\sqrt{n}" : b === 1 ? "\\sqrt[3]{n}" : "\\sqrt[3]{n^{2}}";
  const e = Q.of(b, r);
  const na = a === 1 ? "n" : `n^{${a}}`;
  if (rng.bool()) {
    const p = Q.of(a).add(e);
    return { tex: `\\frac{1}{${na}${root}}`, p, work: `${na}${root} = n^{${a}} \\cdot n^{${e.toLatex()}} = n^{${p.toLatex()}}` };
  }
  const p = Q.of(a).sub(e);
  return {
    tex: `\\frac{${root}}{${na}}`,
    p,
    work: `\\frac{${root}}{${na}} = \\frac{n^{${e.toLatex()}}}{n^{${a}}} = \\frac{1}{n^{${p.toLatex()}}}`,
  };
}

/** harmonicSeriesAndPSeries: Σ 1/nᵖ converges exactly when p > 1. */
export const harmonicSeriesAndPSeries: TopicDef = {
  id: "harmonic-series-and-p-series",
  title: t("Harmonic Series and p-Series", "调和级数与 p 级数"),
  summary: t(
    "The p-series Σ 1/nᵖ converges when p > 1 and diverges when p ≤ 1; the harmonic series Σ 1/n diverges.",
    "p 级数 Σ 1/nᵖ 在 p > 1 时收敛，在 p ≤ 1 时发散；调和级数 Σ 1/n 发散。",
  ),
  prerequisites: ["the-integral-test"],
  encompasses: [{ topic: "the-integral-test", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "writing-terms-as-powers-of-n",
      title: t("Writing terms as powers of n", "把各项写成 n 的幂"),
      explanation: t(
        "A **p-series** is $\\sum_{n=1}^{\\infty} \\frac{1}{n^{p}}$. To recognize one, write roots as fractional powers and combine them: $\\frac{1}{n\\sqrt{n}} = \\frac{1}{n^{1} \\cdot n^{1/2}} = \\frac{1}{n^{3/2}}$, so $p = \\frac{3}{2}$, and $\\frac{\\sqrt[3]{n}}{n^{2}} = \\frac{1}{n^{5/3}}$, so $p = \\frac{5}{3}$.",
        "**p 级数**是 $\\sum_{n=1}^{\\infty} \\frac{1}{n^{p}}$。要识别它，把根式写成分数指数再合并：$\\frac{1}{n\\sqrt{n}} = \\frac{1}{n^{1} \\cdot n^{1/2}} = \\frac{1}{n^{3/2}}$，所以 $p = \\frac{3}{2}$；$\\frac{\\sqrt[3]{n}}{n^{2}} = \\frac{1}{n^{5/3}}$，所以 $p = \\frac{5}{3}$。",
      ),
      generate(rng) {
        const f = powerForm(rng);
        return numberProblem({
          prompt: t(
            `The series $${sigma(f.tex)}$ is a $p$-series $${sigma("\\frac{1}{n^{p}}")}$. Find $p$.`,
            `级数 $${sigma(f.tex)}$ 是 $p$ 级数 $${sigma("\\frac{1}{n^{p}}")}$。求 $p$。`,
          ),
          answer: f.p,
          wrong: [f.p.neg(), Q.one.div(f.p), f.p.add(Q.one)],
          solution: t(`$${f.work}$, so $p = ${f.p.toLatex()}$.`, `$${f.work}$，所以 $p = ${f.p.toLatex()}$。`),
        });
      },
    },
    {
      id: "convergence-of-p-series",
      title: t("Convergence of p-series", "p 级数的敛散性"),
      explanation: t(
        "By the integral test, $\\int_{1}^{\\infty} \\frac{dx}{x^{p}}$ is finite exactly when $p > 1$. So the $p$-series **converges when $p > 1$** and **diverges when $p \\le 1$**. The case $p = 1$ is the **harmonic series** $\\sum \\frac{1}{n} = 1 + \\frac{1}{2} + \\frac{1}{3} + \\cdots$, which diverges even though its terms tend to $0$.",
        "由积分判别法，$\\int_{1}^{\\infty} \\frac{dx}{x^{p}}$ 有限当且仅当 $p > 1$。所以 $p$ 级数**在 $p > 1$ 时收敛**，**在 $p \\le 1$ 时发散**。$p = 1$ 的情形是**调和级数** $\\sum \\frac{1}{n} = 1 + \\frac{1}{2} + \\frac{1}{3} + \\cdots$，尽管各项趋于 $0$，它仍然发散。",
      ),
      generate(rng) {
        const f = powerForm(rng);
        const c = rng.int(1, 9);
        const series = sigma(c === 1 ? f.tex : `${c} \\cdot ${f.tex}`);
        const converges = f.p.toNumber() > 1;
        return verdict(
          rng,
          series,
          converges,
          t(
            `$${f.work}$, a $p$-series with $p = ${f.p.toLatex()} ${converges ? ">" : "\\le"} 1$${c === 1 ? "" : ` (a constant multiple of $${c}$ does not change convergence)`}. So it ${converges ? "converges" : "diverges"}.`,
            `$${f.work}$，是 $p = ${f.p.toLatex()} ${converges ? ">" : "\\le"} 1$ 的 $p$ 级数${c === 1 ? "" : `（乘以常数 $${c}$ 不改变敛散性）`}。所以它${converges ? "收敛" : "发散"}。`,
          ),
        );
      },
    },
  ],
};

/** ComparisonCase is a series settled by direct comparison. */
interface ComparisonCase {
  readonly series: string;
  readonly converges: boolean;
  readonly work: Text;
}

/** comparisonCase picks a series that a direct comparison settles. */
function comparisonCase(rng: Rng): ComparisonCase {
  const c = rng.int(1, 9);
  const k = rng.int(1, 9);
  const kind = rng.int(0, 4);
  if (kind === 0)
    return {
      series: sigma(`\\frac{${c}}{n^{2} + ${k}}`),
      converges: true,
      work: t(
        `$0 < \\frac{${c}}{n^{2} + ${k}} < \\frac{${c}}{n^{2}}$, and $\\sum \\frac{${c}}{n^{2}}$ converges ($p = 2$)`,
        `$0 < \\frac{${c}}{n^{2} + ${k}} < \\frac{${c}}{n^{2}}$，而 $\\sum \\frac{${c}}{n^{2}}$ 收敛（$p = 2$）`,
      ),
    };
  if (kind === 1)
    return {
      series: sigma(`\\frac{${k + 1} + \\cos n}{n}`),
      converges: false,
      work: t(
        `$\\frac{${k + 1} + \\cos n}{n} \\ge \\frac{${k}}{n}$, and $\\sum \\frac{${k}}{n}$ diverges (harmonic)`,
        `$\\frac{${k + 1} + \\cos n}{n} \\ge \\frac{${k}}{n}$，而 $\\sum \\frac{${k}}{n}$ 发散（调和级数）`,
      ),
    };
  if (kind === 2)
    return {
      series: sigma(`\\frac{${c}}{${k + 1}^{n} + ${k}}`),
      converges: true,
      work: t(
        `$0 < \\frac{${c}}{${k + 1}^{n} + ${k}} < ${c}\\left(\\frac{1}{${k + 1}}\\right)^{n}$, a convergent geometric series`,
        `$0 < \\frac{${c}}{${k + 1}^{n} + ${k}} < ${c}\\left(\\frac{1}{${k + 1}}\\right)^{n}$，是收敛的等比级数`,
      ),
    };
  if (kind === 3)
    return {
      series: sigma(`\\frac{${c === 1 ? "" : c}\\ln n}{n}`, 3),
      converges: false,
      work: t(
        `for $n \\ge 3$, $\\ln n > 1$, so $\\frac{${c === 1 ? "" : c}\\ln n}{n} > \\frac{${c}}{n}$, and $\\sum \\frac{${c}}{n}$ diverges`,
        `当 $n \\ge 3$ 时 $\\ln n > 1$，所以 $\\frac{${c === 1 ? "" : c}\\ln n}{n} > \\frac{${c}}{n}$，而 $\\sum \\frac{${c}}{n}$ 发散`,
      ),
    };
  return {
    series: sigma(`\\frac{\\sin^{2} n}{n^{2} + ${k}}`),
    converges: true,
    work: t(
      `$0 \\le \\frac{\\sin^{2} n}{n^{2} + ${k}} \\le \\frac{1}{n^{2}}$, and $\\sum \\frac{1}{n^{2}}$ converges`,
      `$0 \\le \\frac{\\sin^{2} n}{n^{2} + ${k}} \\le \\frac{1}{n^{2}}$，而 $\\sum \\frac{1}{n^{2}}$ 收敛`,
    ),
  };
}

/** theComparisonTest bounds a series by a known one. */
export const theComparisonTest: TopicDef = {
  id: "the-comparison-test",
  title: t("The Comparison Test", "比较判别法"),
  summary: t(
    "If 0 ≤ aₙ ≤ bₙ, then Σbₙ converging forces Σaₙ to converge, and Σaₙ diverging forces Σbₙ to diverge.",
    "若 0 ≤ aₙ ≤ bₙ，则 Σbₙ 收敛蕴含 Σaₙ 收敛，Σaₙ 发散蕴含 Σbₙ 发散。",
  ),
  prerequisites: ["harmonic-series-and-p-series", "convergence-of-geometric-series"],
  encompasses: [{ topic: "harmonic-series-and-p-series", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "applying-the-comparison-test",
      title: t("Applying the comparison test", "应用比较判别法"),
      explanation: t(
        "Suppose $0 \\le a_n \\le b_n$ for all $n$. If $\\sum b_n$ converges, its partial sums bound those of $\\sum a_n$, so $\\sum a_n$ converges. If $\\sum a_n$ diverges, so does $\\sum b_n$. Compare with a $p$-series or a geometric series, and make sure the inequality points the useful way: being smaller than a divergent series proves nothing. For example, $\\frac{1}{n^{2} + 5} < \\frac{1}{n^{2}}$, so $\\sum \\frac{1}{n^{2} + 5}$ converges.",
        "设对所有 $n$ 有 $0 \\le a_n \\le b_n$。若 $\\sum b_n$ 收敛，它的部分和就是 $\\sum a_n$ 部分和的上界，所以 $\\sum a_n$ 收敛。若 $\\sum a_n$ 发散，则 $\\sum b_n$ 也发散。通常与 $p$ 级数或等比级数比较，并注意不等式的方向要有用：比发散级数小什么也证明不了。例如 $\\frac{1}{n^{2} + 5} < \\frac{1}{n^{2}}$，所以 $\\sum \\frac{1}{n^{2} + 5}$ 收敛。",
      ),
      generate(rng) {
        const k = comparisonCase(rng);
        return verdict(
          rng,
          k.series,
          k.converges,
          t(
            `${k.work.en.charAt(0).toUpperCase()}${k.work.en.slice(1)}. By the comparison test, the series ${k.converges ? "converges" : "diverges"}.`,
            `${k.work["zh-CN"]}。由比较判别法，级数${k.converges ? "收敛" : "发散"}。`,
          ),
          t("Use the comparison test.", "用比较判别法。"),
        );
      },
    },
    {
      id: "an-inequality-that-settles-it",
      title: t("An inequality that settles the question", "能下结论的不等式"),
      explanation: t(
        "A comparison only settles the question when it points the useful way: below a convergent series, or above a divergent one. $\\frac{1}{n^{2} + 4} < \\frac{1}{n^{2}}$ proves convergence, but $\\frac{1}{n^{2} + 4} < \\frac{1}{n}$ proves nothing, since being smaller than a divergent series allows either outcome. Likewise $\\frac{n + 3}{n^{2}} > \\frac{1}{n}$ proves divergence, while $\\frac{n + 3}{n^{2}} \\le \\frac{4}{n}$ proves nothing.",
        "只有方向有用的比较才能下结论：小于一个收敛级数，或大于一个发散级数。$\\frac{1}{n^{2} + 4} < \\frac{1}{n^{2}}$ 能证明收敛，但 $\\frac{1}{n^{2} + 4} < \\frac{1}{n}$ 什么也证明不了，因为比发散级数小，两种结果都有可能。同样，$\\frac{n + 3}{n^{2}} > \\frac{1}{n}$ 能证明发散，而 $\\frac{n + 3}{n^{2}} \\le \\frac{4}{n}$ 什么也证明不了。",
      ),
      generate(rng) {
        const s = rng.int(1, 9);
        const kind = rng.int(0, 3);
        const say = (ineq: string, b: string, conv: boolean, verdictConv: boolean) =>
          t(
            `$a_n ${ineq} ${b}$ and $\\sum ${b}$ ${conv ? "converges" : "diverges"}, so the series ${verdictConv ? "converges" : "diverges"}.`,
            `$a_n ${ineq} ${b}$，且 $\\sum ${b}$ ${conv ? "收敛" : "发散"}，所以级数${verdictConv ? "收敛" : "发散"}。`,
          );
        let a: string;
        let right: Text;
        let wrong: Text[];
        if (kind < 2) {
          const p = kind === 0 ? rng.int(2, 4) : 0;
          const k = rng.int(2, 6);
          a = kind === 0 ? `\\frac{1}{n^{${p}} + ${s}}` : `\\frac{1}{${k}^{n} + ${s}}`;
          const b = kind === 0 ? `\\frac{1}{n^{${p}}}` : `\\left(\\frac{1}{${k}}\\right)^{n}`;
          right = say("<", b, true, true);
          wrong = [
            say("<", "\\frac{1}{n}", false, false),
            say("<", "\\frac{1}{n}", false, true),
            t("$a_n \\to 0$, so the series converges.", "$a_n \\to 0$，所以级数收敛。"),
          ];
        } else {
          a = kind === 2 ? `\\frac{n + ${s}}{n^{2}}` : `\\frac{\\sqrt{n} + ${s}}{n}`;
          const b = kind === 2 ? "\\frac{1}{n}" : "\\frac{1}{\\sqrt{n}}";
          const upper = kind === 2 ? `\\frac{${s + 1}}{n}` : `\\frac{${s + 1}}{\\sqrt{n}}`;
          right = say(">", b, false, false);
          wrong = [
            say("\\le", upper, false, false),
            t("$a_n \\to 0$, so the series converges.", "$a_n \\to 0$，所以级数收敛。"),
            t("The terms decrease, so the series converges.", "各项递减，所以级数收敛。"),
          ];
        }
        return oneOf(
          rng,
          t(`Which reasoning correctly decides whether $${sigma(a)}$ converges?`, `哪种推理能正确判断 $${sigma(a)}$ 是否收敛？`),
          right,
          wrong,
          t(
            `${right.en} The comparison is useful because it puts the terms ${kind < 2 ? "below a convergent series" : "above a divergent series"}; a bound in the other direction would prove nothing.`,
            `${right["zh-CN"]}这个比较有用，因为它把各项放在${kind < 2 ? "一个收敛级数之下" : "一个发散级数之上"}；反方向的界什么也证明不了。`,
          ),
        );
      },
    },
  ],
};

/** RationalTerm is a quotient of polynomials in n that behaves like c/n^d. */
interface RationalTerm {
  readonly tex: string;
  readonly ratio: Q;
  readonly d: number;
}

/** rationalTerm picks (p·nᵃ + q)/(r·nᵇ + s) with b > a. */
function rationalTerm(rng: Rng): RationalTerm {
  const a = rng.int(0, 2);
  const d = rng.int(1, 3);
  const b = a + d;
  const p = rng.int(1, 9);
  const r = rng.int(1, 9);
  const pw = (k: number) => (k === 0 ? "" : k === 1 ? "n" : `n^{${k}}`);
  const top = a === 0 ? `${p}` : poly([p, pw(a)], [rng.int(1, 9), ""]);
  const bottom = poly([r, pw(b)], [rng.int(1, 9), ""]);
  return { tex: `\\frac{${top}}{${bottom}}`, ratio: Q.of(p, r), d };
}

/** theLimitComparisonTest compares the growth of terms through the limit of their ratio. */
export const theLimitComparisonTest: TopicDef = {
  id: "the-limit-comparison-test",
  title: t("The Limit Comparison Test", "极限比较判别法"),
  summary: t(
    "If aₙ, bₙ > 0 and aₙ/bₙ → L with 0 < L < ∞, then Σaₙ and Σbₙ both converge or both diverge.",
    "若 aₙ, bₙ > 0 且 aₙ/bₙ → L，0 < L < ∞，则 Σaₙ 与 Σbₙ 同时收敛或同时发散。",
  ),
  prerequisites: ["the-comparison-test"],
  encompasses: [{ topic: "the-comparison-test", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-limit-of-the-ratio",
      title: t("The limit of the ratio", "比值的极限"),
      explanation: t(
        "For a rational term, compare with $b_n = \\frac{1}{n^{d}}$, where $d$ is the degree of the denominator minus the degree of the numerator. Then $\\frac{a_n}{b_n}$ tends to the ratio of the leading coefficients. For $a_n = \\frac{3n + 1}{2n^{3} + 5}$ and $b_n = \\frac{1}{n^{2}}$: $\\frac{a_n}{b_n} = \\frac{3n^{3} + n^{2}}{2n^{3} + 5} \\to \\frac{3}{2}$.",
        "对有理式的项，与 $b_n = \\frac{1}{n^{d}}$ 比较，其中 $d$ 是分母次数减去分子次数。这时 $\\frac{a_n}{b_n}$ 趋于首项系数之比。对 $a_n = \\frac{3n + 1}{2n^{3} + 5}$，$b_n = \\frac{1}{n^{2}}$：$\\frac{a_n}{b_n} = \\frac{3n^{3} + n^{2}}{2n^{3} + 5} \\to \\frac{3}{2}$。",
      ),
      generate(rng) {
        const a = rationalTerm(rng);
        const b = a.d === 1 ? "\\frac{1}{n}" : `\\frac{1}{n^{${a.d}}}`;
        return numberProblem({
          prompt: t(
            `To compare $${sigma(a.tex)}$ with $${sigma(b)}$, find $\\lim_{n \\to \\infty} \\frac{a_n}{b_n}$, where $a_n = ${a.tex}$ and $b_n = ${b}$.`,
            `为了比较 $${sigma(a.tex)}$ 与 $${sigma(b)}$，求 $\\lim_{n \\to \\infty} \\frac{a_n}{b_n}$，其中 $a_n = ${a.tex}$，$b_n = ${b}$。`,
          ),
          answer: a.ratio,
          wrong: [Q.one.div(a.ratio), Q.zero, Q.one],
          solution: t(
            `$\\frac{a_n}{b_n} = ${a.d === 1 ? "n" : `n^{${a.d}}`} \\cdot ${a.tex}$. The numerator and the denominator now have the same degree, so the limit is the ratio of the leading coefficients, $${a.ratio.toLatex()}$.`,
            `$\\frac{a_n}{b_n} = ${a.d === 1 ? "n" : `n^{${a.d}}`} \\cdot ${a.tex}$。现在分子分母次数相同，极限为首项系数之比 $${a.ratio.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "deciding-convergence-with-the-limit-comparison-test",
      title: t("Deciding convergence with the limit comparison test", "用极限比较判别法判断敛散性"),
      explanation: t(
        "When $\\frac{a_n}{b_n} \\to L$ with $0 < L < \\infty$, the terms are eventually between $\\frac{L}{2} b_n$ and $2L b_n$, so the two series behave alike. This settles cases the plain comparison test cannot: $\\frac{1}{n^{2} - 3}$ is larger than $\\frac{1}{n^{2}}$, but $\\frac{1/(n^{2} - 3)}{1/n^{2}} \\to 1$, so $\\sum_{n=2}^{\\infty} \\frac{1}{n^{2} - 3}$ converges.",
        "当 $\\frac{a_n}{b_n} \\to L$ 且 $0 < L < \\infty$ 时，各项最终介于 $\\frac{L}{2} b_n$ 与 $2L b_n$ 之间，所以两个级数表现相同。这能解决普通比较判别法处理不了的情形：$\\frac{1}{n^{2} - 3}$ 比 $\\frac{1}{n^{2}}$ 大，但 $\\frac{1/(n^{2} - 3)}{1/n^{2}} \\to 1$，所以 $\\sum_{n=2}^{\\infty} \\frac{1}{n^{2} - 3}$ 收敛。",
      ),
      generate(rng) {
        const a = rationalTerm(rng);
        const converges = a.d > 1;
        const b = a.d === 1 ? "\\frac{1}{n}" : `\\frac{1}{n^{${a.d}}}`;
        return verdict(
          rng,
          sigma(a.tex),
          converges,
          t(
            `Compare with $b_n = ${b}$: $\\frac{a_n}{b_n} \\to ${a.ratio.toLatex()}$, which is positive and finite. Since $\\sum ${b}$ ${converges ? `converges ($p = ${a.d} > 1$)` : "diverges (harmonic)"}, so does the series.`,
            `与 $b_n = ${b}$ 比较：$\\frac{a_n}{b_n} \\to ${a.ratio.toLatex()}$，是正的有限值。由于 $\\sum ${b}$ ${converges ? `收敛（$p = ${a.d} > 1$）` : "发散（调和级数）"}，原级数也${converges ? "收敛" : "发散"}。`,
          ),
          t("Use the limit comparison test.", "用极限比较判别法。"),
        );
      },
    },
  ],
};

/** AlternatingCase is an alternating series with whether it converges. */
interface AlternatingCase {
  readonly b: string;
  readonly converges: boolean;
  readonly work: Text;
}

/** alternatingCase picks bₙ for Σ(−1)ⁿbₙ. */
function alternatingCase(rng: Rng): AlternatingCase {
  const c = rng.int(1, 9);
  const k = rng.int(1, 9);
  const kind = rng.int(0, 4);
  const ok = (b: string) =>
    t(
      `$b_n = ${b}$ is positive, decreasing and tends to $0$, so the series converges by the alternating series test.`,
      `$b_n = ${b}$ 为正、递减且趋于 $0$，由交错级数判别法，级数收敛。`,
    );
  if (kind === 0) return { b: `\\frac{${c}}{${shift(k)}}`, converges: true, work: ok(`\\frac{${c}}{${shift(k)}}`) };
  if (kind === 1) return { b: `\\frac{${c}}{\\sqrt{${shift(k)}}}`, converges: true, work: ok(`\\frac{${c}}{\\sqrt{${shift(k)}}}`) };
  if (kind === 2) return { b: `\\frac{${c}}{\\ln(${shift(k + 1)})}`, converges: true, work: ok(`\\frac{${c}}{\\ln(${shift(k + 1)})}`) };
  const b = kind === 3 ? `\\frac{${term(c, "n")}}{${shift(k)}}` : `\\frac{${k + 1}^{n}}{${term(c, "n^{2}")}}`;
  const limit = kind === 3 ? `${c}` : "\\infty";
  return {
    b,
    converges: false,
    work: t(
      `$b_n = ${b} \\to ${limit}$, not $0$, so the terms $(-1)^{n} b_n$ do not tend to $0$ and the series diverges by the $n$th term test.`,
      `$b_n = ${b} \\to ${limit}$，不趋于 $0$，所以各项 $(-1)^{n} b_n$ 不趋于 $0$，由第 $n$ 项判别法，级数发散。`,
    ),
  };
}

/** theAlternatingSeriesTest: alternating terms that shrink to 0 give a convergent series. */
export const theAlternatingSeriesTest: TopicDef = {
  id: "the-alternating-series-test",
  title: t("The Alternating Series Test", "交错级数判别法"),
  summary: t("If bₙ > 0 is decreasing and bₙ → 0, then Σ(−1)ⁿbₙ converges.", "若 bₙ > 0 递减且 bₙ → 0，则 Σ(−1)ⁿbₙ 收敛。"),
  prerequisites: ["the-nth-term-test-for-divergence", "monotonic-sequences"],
  encompasses: [{ topic: "the-nth-term-test-for-divergence", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "applying-the-alternating-series-test",
      title: t("Applying the alternating series test", "应用交错级数判别法"),
      explanation: t(
        "An **alternating series** has the form $\\sum (-1)^{n} b_n$ with $b_n > 0$. If $b_n$ is decreasing and $b_n \\to 0$, the partial sums step back and forth by ever smaller amounts and close in on a limit, so the series **converges**. If $b_n$ does not tend to $0$, the series diverges by the $n$th term test. For example, $\\sum \\frac{(-1)^{n}}{n}$ converges, though $\\sum \\frac{1}{n}$ does not.",
        "**交错级数**的形式为 $\\sum (-1)^{n} b_n$，其中 $b_n > 0$。若 $b_n$ 递减且 $b_n \\to 0$，部分和来回摆动且幅度越来越小，逼近一个极限，所以级数**收敛**。若 $b_n$ 不趋于 $0$，由第 $n$ 项判别法级数发散。例如 $\\sum \\frac{(-1)^{n}}{n}$ 收敛，而 $\\sum \\frac{1}{n}$ 发散。",
      ),
      generate(rng) {
        const k = alternatingCase(rng);
        return verdict(rng, sigma(`(-1)^{n} ${k.b}`), k.converges, k.work);
      },
    },
    {
      id: "terms-that-decrease-eventually",
      title: t("Terms that decrease only eventually", "最终才递减的项"),
      explanation: t(
        "The alternating series test only needs $b_n$ to decrease from some point on, since the first few terms do not affect convergence. $b_n = \\frac{n}{n^{2} + 10}$ rises until $n = 3$ and then falls to $0$, so $\\sum (-1)^{n} \\frac{n}{n^{2} + 10}$ converges. Check eventual decrease with the derivative of $f(x)$, and check $b_n \\to 0$ separately: $\\frac{n^{2}}{n^{2} + 10}$ tends to $1$, not $0$, so that series diverges.",
        "交错级数判别法只要求 $b_n$ 从某一项起递减，因为开头有限项不影响敛散性。$b_n = \\frac{n}{n^{2} + 10}$ 在 $n = 3$ 之前增大，之后递减趋于 $0$，所以 $\\sum (-1)^{n} \\frac{n}{n^{2} + 10}$ 收敛。用 $f(x)$ 的导数检查最终是否递减，并单独检查 $b_n \\to 0$：$\\frac{n^{2}}{n^{2} + 10}$ 趋于 $1$ 而不是 $0$，所以那个级数发散。",
      ),
      generate(rng) {
        const k = rng.int(2, 40);
        const c = rng.int(1, 9);
        const kind = rng.int(0, 3);
        const cases = [
          {
            b: `\\frac{${term(c, "n")}}{n^{2} + ${k}}`,
            ok: true,
            why: t(
              `$f(x) = \\frac{${term(c, "x")}}{x^{2} + ${k}}$ has $f'(x) = \\frac{${c}(${k} - x^{2})}{(x^{2} + ${k})^{2}} < 0$ for $x > \\sqrt{${k}}$, so $b_n$ decreases eventually, and $b_n \\to 0$`,
              `$f(x) = \\frac{${term(c, "x")}}{x^{2} + ${k}}$ 满足当 $x > \\sqrt{${k}}$ 时 $f'(x) = \\frac{${c}(${k} - x^{2})}{(x^{2} + ${k})^{2}} < 0$，所以 $b_n$ 最终递减，且 $b_n \\to 0$`,
            ),
          },
          {
            b: `\\frac{\\sqrt{n}}{${shift(k)}}`,
            ok: true,
            why: t(
              `$f(x) = \\frac{\\sqrt{x}}{${linear(1, k, "x")}}$ has $f'(x) = \\frac{${k} - x}{2\\sqrt{x}(${linear(1, k, "x")})^{2}} < 0$ for $x > ${k}$, so $b_n$ decreases eventually, and $b_n \\to 0$`,
              `$f(x) = \\frac{\\sqrt{x}}{${linear(1, k, "x")}}$ 满足当 $x > ${k}$ 时 $f'(x) = \\frac{${k} - x}{2\\sqrt{x}(${linear(1, k, "x")})^{2}} < 0$，所以 $b_n$ 最终递减，且 $b_n \\to 0$`,
            ),
          },
          {
            b: `\\frac{${c} \\ln n}{n}`,
            ok: true,
            why: t(
              `$f(x) = \\frac{${c} \\ln x}{x}$ has $f'(x) = \\frac{${c}(1 - \\ln x)}{x^{2}} < 0$ for $x > e$, so $b_n$ decreases from $n = 3$ on, and $b_n \\to 0$`,
              `$f(x) = \\frac{${c} \\ln x}{x}$ 满足当 $x > e$ 时 $f'(x) = \\frac{${c}(1 - \\ln x)}{x^{2}} < 0$，所以 $b_n$ 从 $n = 3$ 起递减，且 $b_n \\to 0$`,
            ),
          },
          {
            b: `\\frac{${term(c, "n^{2}")}}{n^{2} + ${k}}`,
            ok: false,
            why: t(`$b_n \\to ${c} \\neq 0$, so the terms do not tend to $0$`, `$b_n \\to ${c} \\neq 0$，各项不趋于 $0$`),
          },
        ];
        const x = cases[kind]!;
        return verdict(
          rng,
          sigma(`(-1)^{n} ${x.b}`),
          x.ok,
          t(
            `${x.why.en}. ${x.ok ? "By the alternating series test, the series converges." : "By the $n$th term test, the series diverges."}`,
            `${x.why["zh-CN"]}。${x.ok ? "由交错级数判别法，级数收敛。" : "由第 $n$ 项判别法，级数发散。"}`,
          ),
        );
      },
    },
  ],
};

/** RatioCase is a series whose ratio-test limit is known. */
interface RatioCase {
  readonly a: string;
  readonly L: Q | "inf";
  readonly work: string;
}

/** ratioCase picks a term with powers and factorials. */
function ratioCase(rng: Rng): RatioCase {
  const kind = rng.int(0, 3);
  const k = rng.int(1, 9);
  const m = rng.int(2, 9);
  const p = rng.int(1, 4);
  if (kind === 0) {
    const L = Q.of(k, m);
    return {
      a: `\\frac{n^{${p}} \\cdot ${k}^{n}}{${m}^{n}}`,
      L,
      work: `\\frac{a_{n+1}}{a_n} = \\left(\\frac{n + 1}{n}\\right)^{${p}} \\cdot \\frac{${k}}{${m}} \\to ${L.toLatex()}`,
    };
  }
  if (kind === 1)
    return {
      a: `\\frac{${m}^{n}}{n!}`,
      L: Q.zero,
      work: `\\frac{a_{n+1}}{a_n} = \\frac{${m}}{n + 1} \\to 0`,
    };
  if (kind === 2) {
    const L = Q.of(k, 4);
    return {
      a: `\\frac{(n!)^{2} \\, ${k}^{n}}{(2n)!}`,
      L,
      work: `\\frac{a_{n+1}}{a_n} = \\frac{(n + 1)^{2} \\cdot ${k}}{(2n + 2)(2n + 1)} \\to \\frac{${k}}{4}${L.toLatex() === `\\frac{${k}}{4}` ? "" : ` = ${L.toLatex()}`}`,
    };
  }
  const L = Q.of(4, m);
  return {
    a: `\\frac{(2n)!}{(n!)^{2} \\, ${m}^{n}}`,
    L,
    work: `\\frac{a_{n+1}}{a_n} = \\frac{(2n + 2)(2n + 1)}{(n + 1)^{2} \\cdot ${m}} \\to \\frac{4}{${m}}${L.toLatex() === `\\frac{4}{${m}}` ? "" : ` = ${L.toLatex()}`}`,
  };
}

/** ratioOutcomes are the conclusions of the ratio and root tests. */
const ratioOutcomes = [
  t("The series converges.", "级数收敛。"),
  t("The series diverges.", "级数发散。"),
  t("The test is inconclusive.", "判别法无法得出结论。"),
] as const;

/** ratioOutcome is the conclusion for a limit L. */
const ratioOutcome = (L: Q) => (L.toNumber() < 1 ? 0 : L.toNumber() > 1 ? 1 : 2);

/** outcomeWord says what L tells. */
function outcomeWord(L: Q): Text {
  const o = ratioOutcome(L);
  if (o === 0) return t(`$L = ${L.toLatex()} < 1$, so the series converges`, `$L = ${L.toLatex()} < 1$，所以级数收敛`);
  if (o === 1) return t(`$L = ${L.toLatex()} > 1$, so the series diverges`, `$L = ${L.toLatex()} > 1$，所以级数发散`);
  return t("$L = 1$, so the test is inconclusive", "$L = 1$，所以判别法无法得出结论");
}

/** theRatioTest compares consecutive terms. */
export const theRatioTest: TopicDef = {
  id: "the-ratio-test",
  title: t("The Ratio Test", "比值判别法"),
  summary: t(
    "If |aₙ₊₁/aₙ| → L, the series converges absolutely when L < 1, diverges when L > 1, and the test is inconclusive when L = 1.",
    "若 |aₙ₊₁/aₙ| → L，则 L < 1 时级数绝对收敛，L > 1 时发散，L = 1 时无法判断。",
  ),
  prerequisites: ["the-nth-term-test-for-divergence", "identifying-monotonic-sequences-using-ratios", "convergence-of-geometric-series"],
  encompasses: [{ topic: "convergence-of-geometric-series", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-ratio-test-limit",
      title: t("The ratio test limit", "比值判别法的极限"),
      explanation: t(
        "Let $L = \\lim_{n \\to \\infty} \\left|\\frac{a_{n+1}}{a_n}\\right|$. If $L < 1$, the terms eventually shrink at least as fast as a convergent geometric series and $\\sum a_n$ converges; if $L > 1$, the terms grow and the series diverges; if $L = 1$, the test gives no answer. For $a_n = \\frac{n \\cdot 2^{n}}{3^{n}}$: $\\frac{a_{n+1}}{a_n} = \\frac{n + 1}{n} \\cdot \\frac{2}{3} \\to \\frac{2}{3}$.",
        "设 $L = \\lim_{n \\to \\infty} \\left|\\frac{a_{n+1}}{a_n}\\right|$。若 $L < 1$，各项最终至少和一个收敛的等比级数缩小得一样快，$\\sum a_n$ 收敛；若 $L > 1$，各项增大，级数发散；若 $L = 1$，判别法无法给出答案。对 $a_n = \\frac{n \\cdot 2^{n}}{3^{n}}$：$\\frac{a_{n+1}}{a_n} = \\frac{n + 1}{n} \\cdot \\frac{2}{3} \\to \\frac{2}{3}$。",
      ),
      generate(rng) {
        const k = ratioCase(rng);
        const L = k.L as Q;
        return numberProblem({
          prompt: t(
            `For $${sigma(k.a)}$, find $L = \\lim_{n \\to \\infty} \\left|\\frac{a_{n+1}}{a_n}\\right|$.`,
            `对 $${sigma(k.a)}$，求 $L = \\lim_{n \\to \\infty} \\left|\\frac{a_{n+1}}{a_n}\\right|$。`,
          ),
          answer: L,
          wrong: [L.isZero() ? Q.one : Q.one.div(L), Q.one, L.mul(Q.of(2))],
          solution: t(`$${k.work}$.`, `$${k.work}$。`),
        });
      },
    },
    {
      id: "conclusions-from-the-ratio-test",
      title: t("Conclusions from the ratio test", "比值判别法的结论"),
      explanation: t(
        "The ratio test suits terms with factorials and exponentials. It fails ($L = 1$) for every $p$-series and every rational term: for $\\frac{1}{n^{2}}$, $\\frac{n^{2}}{(n + 1)^{2}} \\to 1$, although the series converges, and for $\\frac{1}{n}$, $\\frac{n}{n + 1} \\to 1$, although it diverges.",
        "比值判别法适合含阶乘和指数的项。对所有 $p$ 级数和有理式的项，它都失效（$L = 1$）：对 $\\frac{1}{n^{2}}$，$\\frac{n^{2}}{(n + 1)^{2}} \\to 1$，但级数收敛；对 $\\frac{1}{n}$，$\\frac{n}{n + 1} \\to 1$，但级数发散。",
      ),
      generate(rng) {
        if (rng.int(0, 3) === 0) {
          const a = rationalTerm(rng);
          return choiceProblem({
            prompt: t(`What does the ratio test say about $${sigma(a.tex)}$?`, `比值判别法对 $${sigma(a.tex)}$ 能得出什么结论？`),
            options: ratioOutcomes,
            correct: 2,
            solution: t(
              "The ratio of consecutive terms of a rational expression in $n$ tends to $1$, so $L = 1$ and the test is inconclusive. (The limit comparison test settles this series.)",
              "关于 $n$ 的有理式，相邻两项之比趋于 $1$，所以 $L = 1$，判别法无法得出结论。（这个级数可以用极限比较判别法判断。）",
            ),
          });
        }
        const k = ratioCase(rng);
        const L = k.L as Q;
        return choiceProblem({
          prompt: t(`What does the ratio test say about $${sigma(k.a)}$?`, `比值判别法对 $${sigma(k.a)}$ 能得出什么结论？`),
          options: ratioOutcomes,
          correct: ratioOutcome(L),
          solution: t(`$${k.work}$, and ${outcomeWord(L).en}.`, `$${k.work}$，${outcomeWord(L)["zh-CN"]}。`),
        });
      },
    },
  ],
};

/** RootCase is a term that suits the root test. */
interface RootCase {
  readonly a: string;
  readonly L: Q;
  readonly work: string;
}

/** rootCase picks an nth power or a term with n in the exponent. */
function rootCase(rng: Rng): RootCase {
  if (rng.int(0, 2) > 0) {
    const p = rng.nonZero(-9, 9);
    const r = rng.int(1, 9);
    const top = linear(p, rng.int(-9, 9), "n");
    const bottom = linear(r, rng.int(1, 9), "n");
    const L = Q.of(Math.abs(p), r);
    return {
      a: `\\left(\\frac{${top}}{${bottom}}\\right)^{n}`,
      L,
      work: `\\sqrt[n]{|a_n|} = \\left|\\frac{${top}}{${bottom}}\\right| \\to ${L.toLatex()}`,
    };
  }
  const k = rng.int(2, 9);
  const p = rng.int(1, 5);
  const L = Q.of(1, k);
  return {
    a: `\\frac{n^{${p}}}{${k}^{n}}`,
    L,
    work: `\\sqrt[n]{a_n} = \\frac{(\\sqrt[n]{n})^{${p}}}{${k}} \\to \\frac{1}{${k}}`,
  };
}

/** theRootTest takes nth roots of the terms. */
export const theRootTest: TopicDef = {
  id: "the-root-test",
  title: t("The Root Test", "根值判别法"),
  summary: t(
    "If ⁿ√|aₙ| → L, the series converges when L < 1, diverges when L > 1, and the test is inconclusive when L = 1.",
    "若 ⁿ√|aₙ| → L，则 L < 1 时级数收敛，L > 1 时发散，L = 1 时无法判断。",
  ),
  prerequisites: ["the-ratio-test"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-root-test-limit",
      title: t("The root test limit", "根值判别法的极限"),
      explanation: t(
        "Let $L = \\lim_{n \\to \\infty} \\sqrt[n]{|a_n|}$. The conclusions are those of the ratio test: $L < 1$ converges, $L > 1$ diverges, $L = 1$ is inconclusive. The root test suits terms that are $n$th powers: for $a_n = \\left(\\frac{2n + 1}{5n - 3}\\right)^{n}$, $\\sqrt[n]{a_n} = \\frac{2n + 1}{5n - 3} \\to \\frac{2}{5}$. It uses $\\sqrt[n]{n} \\to 1$, so for $a_n = \\frac{n^{3}}{2^{n}}$, $\\sqrt[n]{a_n} = \\frac{(\\sqrt[n]{n})^{3}}{2} \\to \\frac{1}{2}$.",
        "设 $L = \\lim_{n \\to \\infty} \\sqrt[n]{|a_n|}$。结论与比值判别法相同：$L < 1$ 收敛，$L > 1$ 发散，$L = 1$ 无法判断。根值判别法适合本身是 $n$ 次幂的项：对 $a_n = \\left(\\frac{2n + 1}{5n - 3}\\right)^{n}$，$\\sqrt[n]{a_n} = \\frac{2n + 1}{5n - 3} \\to \\frac{2}{5}$。它会用到 $\\sqrt[n]{n} \\to 1$，所以对 $a_n = \\frac{n^{3}}{2^{n}}$，$\\sqrt[n]{a_n} = \\frac{(\\sqrt[n]{n})^{3}}{2} \\to \\frac{1}{2}$。",
      ),
      generate(rng) {
        const k = rootCase(rng);
        return numberProblem({
          prompt: t(
            `For $${sigma(k.a)}$, find $L = \\lim_{n \\to \\infty} \\sqrt[n]{|a_n|}$.`,
            `对 $${sigma(k.a)}$，求 $L = \\lim_{n \\to \\infty} \\sqrt[n]{|a_n|}$。`,
          ),
          answer: k.L,
          wrong: [Q.one.div(k.L), Q.one, Q.zero],
          solution: t(`$${k.work}$.`, `$${k.work}$。`),
        });
      },
    },
    {
      id: "conclusions-from-the-root-test",
      title: t("Conclusions from the root test", "根值判别法的结论"),
      explanation: t(
        "If the limit of the root of the terms is below one, the terms shrink like a convergent geometric series; above one they do not shrink, and exactly one gives no conclusion. Compare $L$ with $1$. For $\\sum \\left(\\frac{3n}{n + 4}\\right)^{n}$, $L = 3 > 1$, so the series diverges; for $\\sum \\left(\\frac{n}{3n + 4}\\right)^{n}$, $L = \\frac{1}{3} < 1$, so it converges.",
        "如果项的方根的极限小于 1，各项像收敛的等比级数那样缩小；大于 1 时不缩小；恰好等于 1 时无法判断。把 $L$ 与 $1$ 比较。对 $\\sum \\left(\\frac{3n}{n + 4}\\right)^{n}$，$L = 3 > 1$，级数发散；对 $\\sum \\left(\\frac{n}{3n + 4}\\right)^{n}$，$L = \\frac{1}{3} < 1$，级数收敛。",
      ),
      generate(rng) {
        const k = rootCase(rng);
        return choiceProblem({
          prompt: t(`What does the root test say about $${sigma(k.a)}$?`, `根值判别法对 $${sigma(k.a)}$ 能得出什么结论？`),
          options: ratioOutcomes,
          correct: ratioOutcome(k.L),
          solution: t(`$${k.work}$, and ${outcomeWord(k.L).en}.`, `$${k.work}$，${outcomeWord(k.L)["zh-CN"]}。`),
        });
      },
    },
  ],
};

/** kinds of convergence for a series with terms of both signs. */
const modes = [
  t("It converges absolutely.", "绝对收敛。"),
  t("It converges conditionally.", "条件收敛。"),
  t("It diverges.", "发散。"),
] as const;

/** absoluteAndConditionalConvergence separates absolute from conditional convergence. */
export const absoluteAndConditionalConvergence: TopicDef = {
  id: "absolute-and-conditional-convergence",
  title: t("Absolute and Conditional Convergence", "绝对收敛与条件收敛"),
  summary: t(
    "Σaₙ converges absolutely when Σ|aₙ| converges, and conditionally when it converges but Σ|aₙ| does not.",
    "若 Σ|aₙ| 收敛，则 Σaₙ 绝对收敛；若 Σaₙ 收敛而 Σ|aₙ| 发散，则称条件收敛。",
  ),
  prerequisites: ["the-alternating-series-test", "harmonic-series-and-p-series"],
  encompasses: [{ topic: "the-alternating-series-test", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "classifying-convergence",
      title: t("Classifying convergence", "判断收敛的类型"),
      explanation: t(
        "If $\\sum |a_n|$ converges, then $\\sum a_n$ converges too; it **converges absolutely**. If $\\sum a_n$ converges but $\\sum |a_n|$ diverges, it **converges conditionally**. Check $\\sum |a_n|$ first, then the alternating series test. For example, $\\sum \\frac{(-1)^{n}}{n^{2}}$ converges absolutely, $\\sum \\frac{(-1)^{n}}{\\sqrt{n}}$ converges conditionally, and $\\sum (-1)^{n} \\frac{n}{n + 1}$ diverges.",
        "若 $\\sum |a_n|$ 收敛，则 $\\sum a_n$ 也收敛，称为**绝对收敛**。若 $\\sum a_n$ 收敛而 $\\sum |a_n|$ 发散，称为**条件收敛**。先检查 $\\sum |a_n|$，再用交错级数判别法。例如 $\\sum \\frac{(-1)^{n}}{n^{2}}$ 绝对收敛，$\\sum \\frac{(-1)^{n}}{\\sqrt{n}}$ 条件收敛，$\\sum (-1)^{n} \\frac{n}{n + 1}$ 发散。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const c = rng.int(1, 9);
        if (kind === 0) {
          const f = powerForm(rng);
          const abs = f.p.toNumber() > 1;
          return oneOf(
            rng,
            t(`How does $${sigma(`(-1)^{n} ${f.tex}`)}$ behave?`, `$${sigma(`(-1)^{n} ${f.tex}`)}$ 的敛散性如何？`),
            modes[abs ? 0 : 1],
            [modes[abs ? 1 : 0], modes[2]],
            t(
              `$|a_n| = ${f.tex} = \\frac{1}{n^{${f.p.toLatex()}}}$, a $p$-series with $p = ${f.p.toLatex()}$. ${abs ? "Since $p > 1$, $\\sum |a_n|$ converges: the series converges absolutely." : "Since $p \\le 1$, $\\sum |a_n|$ diverges, but $|a_n|$ decreases to $0$, so the series converges by the alternating series test: it converges conditionally."}`,
              `$|a_n| = ${f.tex} = \\frac{1}{n^{${f.p.toLatex()}}}$，是 $p = ${f.p.toLatex()}$ 的 $p$ 级数。${abs ? "由于 $p > 1$，$\\sum |a_n|$ 收敛：级数绝对收敛。" : "由于 $p \\le 1$，$\\sum |a_n|$ 发散，但 $|a_n|$ 递减趋于 $0$，由交错级数判别法级数收敛：条件收敛。"}`,
            ),
          );
        }
        if (kind === 1) {
          const a = rationalTerm(rng);
          const abs = a.d > 1;
          return oneOf(
            rng,
            t(`How does $${sigma(`(-1)^{n} ${a.tex}`)}$ behave?`, `$${sigma(`(-1)^{n} ${a.tex}`)}$ 的敛散性如何？`),
            modes[abs ? 0 : 1],
            [modes[abs ? 1 : 0], modes[2]],
            t(
              `$|a_n| = ${a.tex}$ behaves like $\\frac{${a.ratio.toLatex()}}{n^{${a.d}}}$. ${abs ? `By limit comparison with $p = ${a.d} > 1$, $\\sum |a_n|$ converges: the series converges absolutely.` : "By limit comparison with the harmonic series, $\\sum |a_n|$ diverges, but $|a_n|$ eventually decreases to $0$, so the series converges by the alternating series test: it converges conditionally."}`,
              `$|a_n| = ${a.tex}$ 的表现类似 $\\frac{${a.ratio.toLatex()}}{n^{${a.d}}}$。${abs ? `与 $p = ${a.d} > 1$ 的 $p$ 级数作极限比较，$\\sum |a_n|$ 收敛：级数绝对收敛。` : "与调和级数作极限比较，$\\sum |a_n|$ 发散，但 $|a_n|$ 最终递减趋于 $0$，由交错级数判别法级数收敛：条件收敛。"}`,
            ),
          );
        }
        const k = rng.int(1, 9);
        const b = `\\frac{${term(c, "n")}}{${shift(k)}}`;
        return oneOf(
          rng,
          t(`How does $${sigma(`(-1)^{n} ${b}`)}$ behave?`, `$${sigma(`(-1)^{n} ${b}`)}$ 的敛散性如何？`),
          modes[2],
          [modes[0], modes[1]],
          t(
            `$|a_n| = ${b} \\to ${c} \\neq 0$, so the terms do not tend to $0$ and the series diverges by the $n$th term test.`,
            `$|a_n| = ${b} \\to ${c} \\neq 0$，各项不趋于 $0$，由第 $n$ 项判别法级数发散。`,
          ),
        );
      },
    },
    {
      id: "signs-that-are-not-strictly-alternating",
      title: t("Signs given by trigonometric or negative bases", "由三角函数或负底数给出的符号"),
      explanation: t(
        "Absolute convergence settles series whose signs do not simply alternate. Since $|\\sin(3n)| \\le 1$, $\\left|\\frac{\\sin(3n)}{n^{2}}\\right| \\le \\frac{1}{n^{2}}$, so $\\sum \\frac{\\sin(3n)}{n^{2}}$ converges absolutely. A factor $\\cos(n\\pi)$ is just $(-1)^{n}$, so $\\sum \\frac{\\cos(n\\pi)}{\\sqrt{n}}$ converges conditionally. And $\\sum \\frac{(-2)^{n}}{5^{n}}$ is geometric with $|r| = \\frac{2}{5} < 1$, so it converges absolutely.",
        "绝对收敛可以处理符号并非简单交错的级数。由于 $|\\sin(3n)| \\le 1$，$\\left|\\frac{\\sin(3n)}{n^{2}}\\right| \\le \\frac{1}{n^{2}}$，所以 $\\sum \\frac{\\sin(3n)}{n^{2}}$ 绝对收敛。因子 $\\cos(n\\pi)$ 就是 $(-1)^{n}$，所以 $\\sum \\frac{\\cos(n\\pi)}{\\sqrt{n}}$ 条件收敛。而 $\\sum \\frac{(-2)^{n}}{5^{n}}$ 是 $|r| = \\frac{2}{5} < 1$ 的等比级数，所以绝对收敛。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const c = rng.int(2, 9);
        if (kind === 0) {
          const p = rng.int(2, 4);
          const trig = rng.pick(["\\sin", "\\cos"]);
          const a = `\\frac{${trig}(${c}n)}{n^{${p}}}`;
          return oneOf(
            rng,
            t(`How does $${sigma(a)}$ behave?`, `$${sigma(a)}$ 的敛散性如何？`),
            modes[0],
            [modes[1], modes[2]],
            t(
              `$|${trig}(${c}n)| \\le 1$, so $|a_n| \\le \\frac{1}{n^{${p}}}$, and $\\sum \\frac{1}{n^{${p}}}$ converges since $${p} > 1$. By comparison $\\sum |a_n|$ converges: the series converges absolutely.`,
              `$|${trig}(${c}n)| \\le 1$，所以 $|a_n| \\le \\frac{1}{n^{${p}}}$，而 $${p} > 1$，$\\sum \\frac{1}{n^{${p}}}$ 收敛。由比较判别法 $\\sum |a_n|$ 收敛：级数绝对收敛。`,
            ),
          );
        }
        if (kind === 1) {
          const f = powerForm(rng);
          const abs = f.p.toNumber() > 1;
          const a = `\\cos(n\\pi) \\cdot ${f.tex}`;
          return oneOf(
            rng,
            t(`How does $${sigma(a)}$ behave?`, `$${sigma(a)}$ 的敛散性如何？`),
            modes[abs ? 0 : 1],
            [modes[abs ? 1 : 0], modes[2]],
            t(
              `$\\cos(n\\pi) = (-1)^{n}$, so the series is alternating with $|a_n| = ${f.tex} = \\frac{1}{n^{${f.p.toLatex()}}}$. ${abs ? "Since $p > 1$, $\\sum |a_n|$ converges: the series converges absolutely." : "Since $p \\le 1$, $\\sum |a_n|$ diverges, but $|a_n|$ decreases to $0$, so the series converges conditionally."}`,
              `$\\cos(n\\pi) = (-1)^{n}$，所以这是交错级数，$|a_n| = ${f.tex} = \\frac{1}{n^{${f.p.toLatex()}}}$。${abs ? "由于 $p > 1$，$\\sum |a_n|$ 收敛：级数绝对收敛。" : "由于 $p \\le 1$，$\\sum |a_n|$ 发散，但 $|a_n|$ 递减趋于 $0$，所以级数条件收敛。"}`,
            ),
          );
        }
        const k = rng.int(2, 9);
        const m = rng.int(2, 9);
        const a = `\\frac{(-${k})^{n}}{${m}^{n}}`;
        const conv = k < m;
        return oneOf(
          rng,
          t(`How does $${sigma(a)}$ behave?`, `$${sigma(a)}$ 的敛散性如何？`),
          modes[conv ? 0 : 2],
          [modes[1], modes[conv ? 2 : 0]],
          t(
            `This is a geometric series with $r = -\\frac{${k}}{${m}}$. ${conv ? `Since $|r| < 1$, $\\sum |a_n|$ is geometric with ratio $\\frac{${k}}{${m}} < 1$ and converges: the series converges absolutely.` : "Since $|r| \\ge 1$, the terms do not tend to $0$ and the series diverges."}`,
            `这是 $r = -\\frac{${k}}{${m}}$ 的等比级数。${conv ? `由于 $|r| < 1$，$\\sum |a_n|$ 是公比 $\\frac{${k}}{${m}} < 1$ 的等比级数，收敛：级数绝对收敛。` : "由于 $|r| \\ge 1$，各项不趋于 $0$，级数发散。"}`,
          ),
        );
      },
    },
  ],
};

/** ErrorTerm is bₙ for an alternating series, with its value at a given n. */
interface ErrorTerm {
  readonly tex: string;
  readonly at: (n: number) => Q;
  readonly at1: (n: number) => string;
}

/** factorial computes n!. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

/** errorTerm picks bₙ = c/n², c/n³, c/n! or c/(n·2ⁿ). */
function errorTerm(rng: Rng): ErrorTerm {
  const c = rng.int(1, 9);
  const kind = rng.int(0, 3);
  if (kind === 0) return { tex: `\\frac{${c}}{n^{2}}`, at: (n) => Q.of(c, n * n), at1: (n) => `\\frac{${c}}{${n}^{2}}` };
  if (kind === 1) return { tex: `\\frac{${c}}{n^{3}}`, at: (n) => Q.of(c, n ** 3), at1: (n) => `\\frac{${c}}{${n}^{3}}` };
  if (kind === 2) return { tex: `\\frac{${c}}{n!}`, at: (n) => Q.of(c, factorial(n)), at1: (n) => `\\frac{${c}}{${n}!}` };
  return { tex: `\\frac{${c}}{n \\cdot 2^{n}}`, at: (n) => Q.of(c, n * 2 ** n), at1: (n) => `\\frac{${c}}{${n} \\cdot 2^{${n}}}` };
}

/** theAlternatingSeriesErrorBound: the error after N terms is at most the first omitted term. */
export const theAlternatingSeriesErrorBound: TopicDef = {
  id: "the-alternating-series-error-bound",
  title: t("The Alternating Series Error Bound", "交错级数的误差界"),
  summary: t(
    "For a series that passes the alternating series test, $|S - S_N| \\le b_{N+1}$, the first term left out.",
    "对满足交错级数判别法条件的级数，$|S - S_N| \\le b_{N+1}$，即第一个被省略的项。",
  ),
  prerequisites: ["the-alternating-series-test"],
  encompasses: [{ topic: "the-alternating-series-test", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "bounding-the-error",
      title: t("Bounding the error", "误差的上界"),
      explanation: t(
        "The sum $S$ of an alternating series that passes the test always lies between consecutive partial sums, so stopping after $N$ terms errs by at most the next term:\n\n$$|S - S_N| \\le b_{N+1}.$$\n\nFor $\\sum \\frac{(-1)^{n+1}}{n^{2}}$ and $N = 4$: $|S - S_4| \\le \\frac{1}{25}$.",
        "满足判别法条件的交错级数，其和 $S$ 总位于相邻两个部分和之间，所以取前 $N$ 项时误差不超过下一项：\n\n$$|S - S_N| \\le b_{N+1}。$$\n\n对 $\\sum \\frac{(-1)^{n+1}}{n^{2}}$ 且 $N = 4$：$|S - S_4| \\le \\frac{1}{25}$。",
      ),
      generate(rng) {
        const b = errorTerm(rng);
        const N = rng.int(2, 7);
        const answer = b.at(N + 1);
        return numberProblem({
          prompt: t(
            `Use the alternating series error bound to find an upper bound for $|S - S_{${N}}|$, where $S = ${sigma(`(-1)^{n+1} ${b.tex}`)}$.`,
            `用交错级数的误差界，求 $|S - S_{${N}}|$ 的一个上界，其中 $S = ${sigma(`(-1)^{n+1} ${b.tex}`)}$。`,
          ),
          answer,
          wrong: [b.at(N), b.at(N + 2), answer.mul(Q.of(2))],
          solution: t(
            `The terms $b_n = ${b.tex}$ decrease to $0$, so $|S - S_{${N}}| \\le b_{${N + 1}} = ${b.at1(N + 1)} = ${answer.toLatex()}$.`,
            `各项 $b_n = ${b.tex}$ 递减趋于 $0$，所以 $|S - S_{${N}}| \\le b_{${N + 1}} = ${b.at1(N + 1)} = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "terms-needed-for-an-alternating-series",
      title: t("How many terms are needed", "需要多少项"),
      explanation: t(
        "To guarantee $|S - S_N| < \\varepsilon$, find the first $N$ with $b_{N+1} < \\varepsilon$. For $\\sum \\frac{(-1)^{n+1}}{n!}$ and $\\varepsilon = \\frac{1}{1000}$: $\\frac{1}{6!} = \\frac{1}{720}$ is too large but $\\frac{1}{7!} = \\frac{1}{5040}$ is small enough, so $N + 1 = 7$ and $N = 6$.",
        "要保证 $|S - S_N| < \\varepsilon$，就找使 $b_{N+1} < \\varepsilon$ 的第一个 $N$。对 $\\sum \\frac{(-1)^{n+1}}{n!}$，$\\varepsilon = \\frac{1}{1000}$：$\\frac{1}{6!} = \\frac{1}{720}$ 还太大，而 $\\frac{1}{7!} = \\frac{1}{5040}$ 足够小，所以 $N + 1 = 7$，$N = 6$。",
      ),
      generate(rng) {
        const b = errorTerm(rng);
        const m = rng.pick([10, 50, 100, 500, 1000, 5000, 10000]);
        let N = 1;
        while (b.at(N + 1).toNumber() >= 1 / m) N++;
        return numberProblem({
          prompt: t(
            `Find the smallest $N$ for which the alternating series error bound guarantees $|S - S_N| < \\frac{1}{${m}}$, where $S = ${sigma(`(-1)^{n+1} ${b.tex}`)}$.`,
            `求使交错级数的误差界能保证 $|S - S_N| < \\frac{1}{${m}}$ 的最小 $N$，其中 $S = ${sigma(`(-1)^{n+1} ${b.tex}`)}$。`,
          ),
          answer: N,
          wrong: [N + 1, N - 1],
          solution: t(
            `We need $b_{N+1} < \\frac{1}{${m}}$. Here $b_{${N}} = ${b.at(N).toLatex()} \\ge \\frac{1}{${m}}$ but $b_{${N + 1}} = ${b.at(N + 1).toLatex()} < \\frac{1}{${m}}$, so $N + 1 = ${N + 1}$ and $N = ${N}$.`,
            `需要 $b_{N+1} < \\frac{1}{${m}}$。这里 $b_{${N}} = ${b.at(N).toLatex()} \\ge \\frac{1}{${m}}$，而 $b_{${N + 1}} = ${b.at(N + 1).toLatex()} < \\frac{1}{${m}}$，所以 $N + 1 = ${N + 1}$，$N = ${N}$。`,
          ),
        });
      },
    },
  ],
};

/** determiningConvergenceParametersForInfiniteSeries finds the parameter values for which a series converges. */
export const determiningConvergenceParametersForInfiniteSeries: TopicDef = {
  id: "determining-convergence-parameters-for-infinite-series",
  title: t("Determining Convergence Parameters for Infinite Series", "确定无穷级数收敛的参数范围"),
  summary: t(
    "Reduce a series with a parameter to a p-series or a geometric series, then solve the condition for convergence.",
    "把含参数的级数化为 p 级数或等比级数，再解收敛的条件。",
  ),
  prerequisites: ["the-limit-comparison-test", "the-ratio-test"],
  encompasses: [{ topic: "the-limit-comparison-test", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "parameters-in-p-series",
      title: t("Parameters in p-series", "p 级数中的参数"),
      explanation: t(
        "Write the term as $\\frac{1}{n^{e}}$, where the exponent $e$ depends on the parameter, and solve $e > 1$. For $\\sum \\frac{n^{2}}{n^{3p}}$: $\\frac{n^{2}}{n^{3p}} = \\frac{1}{n^{3p - 2}}$, which converges when $3p - 2 > 1$, that is $p > 1$.",
        "把各项写成 $\\frac{1}{n^{e}}$，其中指数 $e$ 依赖于参数，再解 $e > 1$。对 $\\sum \\frac{n^{2}}{n^{3p}}$：$\\frac{n^{2}}{n^{3p}} = \\frac{1}{n^{3p - 2}}$，当 $3p - 2 > 1$ 即 $p > 1$ 时收敛。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const b = rng.int(1, 4);
        const pos = rng.bool();
        const value = Q.of(a + 1, b);
        const bp = b === 1 ? "p" : `${b}p`;
        const tex = pos ? `\\frac{${a === 1 ? "n" : `n^{${a}}`}}{n^{${bp}}}` : `\\frac{n^{${bp}}}{${a === 1 ? "n" : `n^{${a}}`}}`;
        const e = pos ? `${bp} - ${a}` : `${a} - ${bp}`;
        const solved = pos ? `p > ${value.toLatex()}` : `p < ${Q.of(a - 1, b).toLatex()}`;
        return inequalityProblem({
          prompt: t(
            `For which values of $p$ does $${sigma(tex)}$ converge? Give an inequality for $p$.`,
            `$p$ 取哪些值时 $${sigma(tex)}$ 收敛？写出关于 $p$ 的不等式。`,
          ),
          variable: "p",
          op: pos ? ">" : "<",
          value: pos ? value : Q.of(a - 1, b),
          wrong: pos
            ? [
                [">=", value],
                [">", Q.of(a, b)],
              ]
            : [
                ["<=", Q.of(a - 1, b)],
                [">", Q.of(a - 1, b)],
              ],
          solution: t(
            `The term is $\\frac{1}{n^{${e}}}$, a $p$-series with exponent $${e}$. It converges when $${e} > 1$, that is $${solved}$.`,
            `各项为 $\\frac{1}{n^{${e}}}$，是指数为 $${e}$ 的 $p$ 级数。当 $${e} > 1$ 即 $${solved}$ 时收敛。`,
          ),
        });
      },
    },
    {
      id: "parameters-in-geometric-series",
      title: t("Parameters in geometric series", "等比级数中的参数"),
      explanation: t(
        "Write the term as $c \\cdot r^{n}$, where the ratio $r$ depends on the parameter, and solve $|r| < 1$. For $p > 0$, $\\sum \\left(\\frac{3}{p}\\right)^{n}$ has $r = \\frac{3}{p}$, which is less than $1$ when $p > 3$. And $\\sum \\frac{p^{n}}{5^{n + 1}} = \\sum \\frac{1}{5}\\left(\\frac{p}{5}\\right)^{n}$ converges for $0 < p < 5$. At the boundary $r = 1$ the terms do not shrink, so the boundary is excluded.",
        "把各项写成 $c \\cdot r^{n}$，其中公比 $r$ 依赖于参数，再解 $|r| < 1$。对 $p > 0$，$\\sum \\left(\\frac{3}{p}\\right)^{n}$ 的公比 $r = \\frac{3}{p}$，当 $p > 3$ 时小于 $1$。而 $\\sum \\frac{p^{n}}{5^{n + 1}} = \\sum \\frac{1}{5}\\left(\\frac{p}{5}\\right)^{n}$ 在 $0 < p < 5$ 时收敛。在边界 $r = 1$ 处各项不变小，所以边界不包括在内。",
      ),
      generate(rng) {
        const k = rng.int(2, 12);
        const m = rng.int(1, 4);
        const below = rng.bool();
        const value = Q.of(k, m);
        const mp = m === 1 ? "p" : `${m}p`;
        const tex = below ? `\\left(\\frac{${k}}{${mp}}\\right)^{n}` : `\\frac{(${mp})^{n}}{${k}^{n + 1}}`;
        const r = below ? `\\frac{${k}}{${mp}}` : `\\frac{${mp}}{${k}}`;
        return inequalityProblem({
          prompt: t(
            `For which positive values of $p$ does $${sigma(tex)}$ converge? Give an inequality for $p$.`,
            `$p$ 取哪些正数值时 $${sigma(tex)}$ 收敛？写出关于 $p$ 的不等式。`,
          ),
          variable: "p",
          op: below ? ">" : "<",
          value,
          wrong: [
            [below ? ">=" : "<=", value],
            [below ? "<" : ">", value],
            [below ? ">" : "<", Q.of(k)],
          ],
          solution: t(
            `This is a geometric series with ratio $r = ${r}$, which is positive. It converges when $${r} < 1$, that is $${below ? `p > ${value.toLatex()}` : `p < ${value.toLatex()}`}$.`,
            `这是公比 $r = ${r}$ 的等比级数，公比为正。当 $${r} < 1$，即 $${below ? `p > ${value.toLatex()}` : `p < ${value.toLatex()}`}$ 时收敛。`,
          ),
        });
      },
    },
  ],
};

/** methods are the tests to choose from. */
const methods = {
  geometric: t("Recognize a geometric series", "识别为等比级数"),
  p: t("Recognize a p-series", "识别为 p 级数"),
  nth: t("The nth term test for divergence", "发散的第 n 项判别法"),
  ratio: t("The ratio test", "比值判别法"),
  alternating: t("The alternating series test", "交错级数判别法"),
  telescoping: t("Telescoping", "裂项相消"),
} as const;

/** selectingProceduresForAnalyzingInfiniteSeries chooses the most efficient test. */
export const selectingProceduresForAnalyzingInfiniteSeries: TopicDef = {
  id: "selecting-procedures-for-analyzing-infinite-series",
  title: t("Selecting Procedures for Analyzing Infinite Series", "选择分析无穷级数的方法"),
  summary: t(
    "Match the form of the terms to a test: geometric and p-series by sight, the nth term test when terms do not shrink, ratios for factorials, the alternating series test for signs that alternate.",
    "按项的形式选判别法：等比级数和 p 级数一眼识别，项不趋于 0 时用第 n 项判别法，有阶乘用比值判别法，正负交替用交错级数判别法。",
  ),
  prerequisites: ["the-root-test", "absolute-and-conditional-convergence", "the-limit-comparison-test", "telescoping-series"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "choosing-a-test",
      title: t("Choosing a test", "选择判别法"),
      explanation: t(
        "Look at the form of the terms first:\n\n- $c \\, r^{n}$: a **geometric series**, convergent exactly when $|r| < 1$.\n- $\\frac{1}{n^{p}}$, possibly with roots: a **$p$-series**, convergent exactly when $p > 1$.\n- terms that do not tend to $0$: the **$n$th term test** shows divergence.\n- factorials or $n$ in an exponent: the **ratio test**.\n- $(-1)^{n} b_n$ with $b_n \\to 0$: the **alternating series test**.\n- $\\frac{1}{(n + a)(n + b)}$: partial fractions and **telescoping** give the sum itself.",
        "先看项的形式：\n\n- $c \\, r^{n}$：**等比级数**，当且仅当 $|r| < 1$ 时收敛。\n- $\\frac{1}{n^{p}}$（可能含根式）：**$p$ 级数**，当且仅当 $p > 1$ 时收敛。\n- 项不趋于 $0$：用**第 $n$ 项判别法**说明发散。\n- 含阶乘或指数中含 $n$：**比值判别法**。\n- $(-1)^{n} b_n$ 且 $b_n \\to 0$：**交错级数判别法**。\n- $\\frac{1}{(n + a)(n + b)}$：部分分式后**裂项相消**，直接求出和。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const k = rng.int(2, 9);
        const kind = rng.int(0, 5);
        const cases: readonly (readonly [string, Text, Text])[] = [
          [
            `\\frac{${c}}{${k}^{n}}`,
            methods.geometric,
            t(
              `The terms are $${c}\\left(\\frac{1}{${k}}\\right)^{n}$, geometric with ratio $\\frac{1}{${k}}$.`,
              `各项为 $${c}\\left(\\frac{1}{${k}}\\right)^{n}$，是公比为 $\\frac{1}{${k}}$ 的等比数列。`,
            ),
          ],
          [
            `\\frac{${c}}{n^{${k}}}`,
            methods.p,
            t(
              `The terms are a multiple of $\\frac{1}{n^{${k}}}$, a $p$-series with $p = ${k}$.`,
              `各项是 $\\frac{1}{n^{${k}}}$ 的倍数，是 $p = ${k}$ 的 $p$ 级数。`,
            ),
          ],
          [
            `\\frac{${term(c, "n")}}{${shift(k)}}`,
            methods.nth,
            t(
              `The terms tend to $${c} \\neq 0$, so the $n$th term test shows divergence at once.`,
              `各项趋于 $${c} \\neq 0$，第 $n$ 项判别法立即说明发散。`,
            ),
          ],
          [
            `\\frac{${k}^{n}}{n!}`,
            methods.ratio,
            t(
              "Factorials cancel well in $\\frac{a_{n+1}}{a_n}$, so the ratio test is the natural choice.",
              "阶乘在 $\\frac{a_{n+1}}{a_n}$ 中容易约去，所以比值判别法最合适。",
            ),
          ],
          [
            `\\frac{(-1)^{n}}{${shift(k)}}`,
            methods.alternating,
            t(
              `The signs alternate and $\\frac{1}{${shift(k)}}$ decreases to $0$, so the alternating series test applies.`,
              `符号正负交替，且 $\\frac{1}{${shift(k)}}$ 递减趋于 $0$，所以适用交错级数判别法。`,
            ),
          ],
          [
            `\\frac{${c}}{(${shift(k)})(${shift(k + 1)})}`,
            methods.telescoping,
            t(
              `$\\frac{${c}}{(${shift(k)})(${shift(k + 1)})} = \\frac{${c}}{${shift(k)}} - \\frac{${c}}{${shift(k + 1)}}$, so the partial sums telescope.`,
              `$\\frac{${c}}{(${shift(k)})(${shift(k + 1)})} = \\frac{${c}}{${shift(k)}} - \\frac{${c}}{${shift(k + 1)}}$，部分和裂项相消。`,
            ),
          ],
        ];
        const [series, right, why] = cases[kind]!;
        const others = rng.shuffle(Object.values(methods).filter((m) => m !== right)).slice(0, 3);
        return oneOf(
          rng,
          t(
            `Which method settles the convergence of $${sigma(series)}$ most directly?`,
            `哪种方法最直接地判断 $${sigma(series)}$ 的敛散性？`,
          ),
          right,
          others,
          why,
        );
      },
    },
    {
      id: "choosing-among-comparison-root-and-integral-tests",
      title: t("Choosing among comparison, root and integral tests", "在比较、根值和积分判别法中选择"),
      explanation: t(
        "Some forms call for the remaining tests:\n\n- a quotient of polynomials, such as $\\frac{n + 1}{n^{3} + 5}$: **limit comparison** with $\\frac{1}{n^{2}}$.\n- a bounded factor over a $p$-series term, such as $\\frac{\\sin^{2} n}{n^{2}}$: direct **comparison**.\n- a whole expression raised to the $n$th power, such as $\\left(\\frac{2n}{3n + 1}\\right)^{n}$: the **root test**.\n- a term that is easy to integrate, such as $\\frac{1}{n (\\ln n)^{2}}$: the **integral test**.",
        "有些形式要用其余的判别法：\n\n- 多项式之商，如 $\\frac{n + 1}{n^{3} + 5}$：与 $\\frac{1}{n^{2}}$ 作**极限比较**。\n- 有界因子乘以 $p$ 级数的项，如 $\\frac{\\sin^{2} n}{n^{2}}$：直接**比较**。\n- 整个式子的 $n$ 次幂，如 $\\left(\\frac{2n}{3n + 1}\\right)^{n}$：**根值判别法**。\n- 容易积分的项，如 $\\frac{1}{n (\\ln n)^{2}}$：**积分判别法**。",
      ),
      generate(rng) {
        const more = {
          limit: t("The limit comparison test", "极限比较判别法"),
          comparison: t("The direct comparison test", "直接比较判别法"),
          root: t("The root test", "根值判别法"),
          integral: t("The integral test", "积分判别法"),
        } as const;
        const c = rng.int(1, 9);
        const k = rng.int(2, 9);
        const m = rng.int(2, 9);
        const cases: readonly (readonly [string, Text, Text])[] = [
          [
            `\\frac{${linear(c, k, "n")}}{n^{3} + ${m}}`,
            more.limit,
            t(
              "The terms are a quotient of polynomials that behaves like $\\frac{1}{n^{2}}$ but is not simply smaller or larger, so compare limits with $\\frac{1}{n^{2}}$.",
              "各项是多项式之商，表现类似 $\\frac{1}{n^{2}}$，但不能直接比大小，所以与 $\\frac{1}{n^{2}}$ 作极限比较。",
            ),
          ],
          [
            `\\frac{\\sin^{2}(${k}n)}{n^{${rng.int(2, 4)}}}`,
            more.comparison,
            t(
              "The factor $\\sin^{2}$ lies between $0$ and $1$, so the terms sit directly below a convergent $p$-series term.",
              "因子 $\\sin^{2}$ 在 $0$ 与 $1$ 之间，所以各项直接小于一个收敛 $p$ 级数的项。",
            ),
          ],
          [
            `\\left(\\frac{${term(c, "n")}}{${linear(k, m, "n")}}\\right)^{n}`,
            more.root,
            t(
              "The whole term is raised to the $n$th power, so its $n$th root is simply the expression inside.",
              "整个项是 $n$ 次幂，所以它的 $n$ 次方根就是括号里的式子。",
            ),
          ],
          [
            `\\frac{${c}}{n (\\ln n)^{${k}}}`,
            more.integral,
            t(
              `With $u = \\ln x$, $\\int \\frac{${c}}{x (\\ln x)^{${k}}} \\, dx$ is easy to evaluate, so the integral test settles it.`,
              `令 $u = \\ln x$，$\\int \\frac{${c}}{x (\\ln x)^{${k}}} \\, dx$ 容易计算，所以用积分判别法。`,
            ),
          ],
        ];
        const [series, right, why] = rng.pick(cases);
        const others = rng.shuffle([...Object.values(more), methods.ratio, methods.geometric].filter((x) => x !== right)).slice(0, 3);
        return oneOf(
          rng,
          t(
            `Which method settles the convergence of $${sigma(series, series.includes("\\ln") ? 2 : 1)}$ most directly?`,
            `哪种方法最直接地判断 $${sigma(series, series.includes("\\ln") ? 2 : 1)}$ 的敛散性？`,
          ),
          right,
          others,
          why,
        );
      },
    },
  ],
};

/** calculusIIConvergenceTopics are the topics of Calculus II module 4.21. */
export const calculusIIConvergenceTopics: readonly TopicDef[] = [
  theNthTermTestForDivergence,
  theIntegralTest,
  theRemainderEstimateForTheIntegralTest,
  harmonicSeriesAndPSeries,
  theComparisonTest,
  theLimitComparisonTest,
  theAlternatingSeriesTest,
  theRatioTest,
  theRootTest,
  absoluteAndConditionalConvergence,
  theAlternatingSeriesErrorBound,
  determiningConvergenceParametersForInfiniteSeries,
  selectingProceduresForAnalyzingInfiniteSeries,
];
