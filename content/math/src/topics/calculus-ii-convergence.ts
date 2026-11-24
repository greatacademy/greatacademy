import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, poly, Q } from "@ga/subject-math";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";

import { explainedChoice, type InequalityOp, inequalityLatex, inequalityProblem, withMistakes } from "../problems.ts";
import { oneOf } from "./calculus-common.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";
import { type Mistake, slip, worked } from "./calculus-ii-parametric.ts";
import { term } from "./calculus-ii-sequences.ts";

// Calculus II unit 4: Sequences & Series, module 4.21 (Infinite Series Convergence Tests).

/** sigma writes the sum of a body from n = k to ∞. */
const sigma = (body: string, k = 1) => `\\sum_{n=${k}}^{\\infty} ${body}`;

/** shift writes n + k, or n when k is 0. */
const shift = (k: number) => linear(1, k, "n");

/** k1 writes a positive integer coefficient, leaving 1 out. */
const k1 = (k: number) => (k === 1 ? "" : `${k}`);

/** dec writes a decimal approximation with the given number of places. */
const dec = (x: number, places = 3) => x.toFixed(places);

/** frac writes n/d as a fraction, or as n when d is 1. */
const frac = (n: number | string, d: number | string) => (`${d}` === "1" ? `${n}` : `\\frac{${n}}{${d}}`);

/** eq writes a raw expression followed by its value when the two differ. */
const eq = (raw: string, q: Q) => (raw === q.toLatex() ? raw : `${raw} = ${q.toLatex()}`);

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

/** nthTermChoice asks what the nth term test says, explains it in steps with a check, and says why each other outcome is wrong. */
function nthTermChoice(rng: Rng, series: string, parts: readonly Step[], check: Text, diverges: boolean): Problem {
  const [div, none, conv] = nthTermOutcomes;
  const wrong = diverges
    ? [
        {
          option: none,
          why: t(
            "The test is inconclusive only when the terms tend to $0$. These terms do not, and that alone shows divergence.",
            "只有各项趋于 $0$ 时这个判别法才无法下结论。这里各项不趋于 $0$，仅此一点就说明级数发散。",
          ),
        },
        {
          option: conv,
          why: t(
            "Terms that do not tend to $0$ cannot add up to a finite sum, and the $n$th term test never proves convergence.",
            "不趋于 $0$ 的项加起来不可能得到有限的和，而且第 $n$ 项判别法从来不能证明收敛。",
          ),
        },
      ]
    : [
        {
          option: div,
          why: t(
            "The test shows divergence only when the terms do not tend to $0$. These terms do tend to $0$.",
            "只有各项不趋于 $0$ 时这个判别法才说明发散。这里各项确实趋于 $0$。",
          ),
        },
        {
          option: conv,
          why: t(
            "The $n$th term test never proves convergence. The terms of the harmonic series $\\sum \\frac{1}{n}$ also tend to $0$, and it diverges.",
            "第 $n$ 项判别法从来不能证明收敛。调和级数 $\\sum \\frac{1}{n}$ 的各项也趋于 $0$，而它发散。",
          ),
        },
      ];
  return explainedChoice(rng, {
    prompt: t(`What does the $n$th term test say about $${series}$?`, `第 $n$ 项判别法对 $${series}$ 能得出什么结论？`),
    correct: diverges ? div : none,
    wrong,
    solution: walked(parts, check),
  });
}

/** compareStep compares the limit of the terms with 0. */
const compareStep = (limit: string, diverges: boolean): Step => [
  ["Compare the limit with 0", "把极限与 0 比较"],
  diverges
    ? t(`The terms tend to $${limit}$, not to $0$, so the series diverges.`, `各项趋于 $${limit}$，不趋于 $0$，所以级数发散。`)
    : t(
        "The terms tend to $0$, so the test is inconclusive: the series may converge or diverge, and another test is needed.",
        "各项趋于 $0$，所以这个判别法无法得出结论：级数可能收敛也可能发散，需要用别的判别法。",
      ),
];

/** limitStep finds the limit of the terms. */
const limitStep = (say: Text, lines: readonly string[]): Step => [["Find the limit of the terms", "求各项的极限"], say, lines];

/** knownBoth checks an inconclusive verdict against two known series whose terms also tend to 0. */
const knownBoth = (extra: Text): Text =>
  t(
    `Compare with two known series whose terms also tend to $0$: $\\sum \\frac{1}{n}$ diverges and $\\sum \\frac{1}{n^{2}}$ converges. A limit of $0$ fits both, so it cannot decide. ${extra.en}`,
    `与两个各项也趋于 $0$ 的已知级数比较：$\\sum \\frac{1}{n}$ 发散，$\\sum \\frac{1}{n^{2}}$ 收敛。极限为 $0$ 对两者都成立，所以它无法下结论。${extra["zh-CN"]}`,
  );

/** nthTermProblem picks a series and asks what the nth term test says about it. */
function nthTermProblem(rng: Rng): Problem {
  const kind = rng.int(0, 4);
  const c = rng.int(1, 9);
  const s = rng.int(1, 9);
  if (kind === 0) {
    const p = rng.nonZero(-9, 9);
    const q = rng.int(-9, 9);
    const a = `\\frac{${linear(p, q, "n")}}{${linear(c, s, "n")}}`;
    const L = Q.of(p, c).toLatex();
    const top = q === 0 ? `${p}` : `${p} ${q > 0 ? "+" : "-"} \\frac{${Math.abs(q)}}{n}`;
    return nthTermChoice(
      rng,
      sigma(a),
      [
        limitStep(t("Divide the numerator and the denominator by $n$:", "分子分母同除以 $n$："), [
          `\\lim_{n \\to \\infty} ${a} = \\lim_{n \\to \\infty} \\frac{${top}}{${c} + \\frac{${s}}{n}} = ${L}`,
        ]),
        compareStep(L, true),
      ],
      t(
        `Look at a term far out. At $n = 1000$ the term is $${frac(1000 * p + q, 1000 * c + s)} \\approx ${dec((1000 * p + q) / (1000 * c + s), 4)}$, close to $${L}$ and far from $0$. Each new term changes the partial sums by about $${L}$, so they cannot settle.`,
        `看一个很靠后的项。在 $n = 1000$ 处，这一项为 $${frac(1000 * p + q, 1000 * c + s)} \\approx ${dec((1000 * p + q) / (1000 * c + s), 4)}$，接近 $${L}$，离 $0$ 很远。每加一项，部分和都改变约 $${L}$，所以部分和不会稳定下来。`,
      ),
      true,
    );
  }
  if (kind === 1) {
    const plain = rng.bool();
    const a = plain ? `\\frac{${c}}{${shift(s)}}` : `\\frac{${term(c, "n")}}{n^{2} + ${s}}`;
    return nthTermChoice(
      rng,
      sigma(a),
      [
        plain
          ? limitStep(t("The numerator is fixed while the denominator grows without bound:", "分子固定，而分母无限增大："), [
              `\\lim_{n \\to \\infty} ${a} = 0`,
            ])
          : limitStep(t("Divide the numerator and the denominator by $n^{2}$:", "分子分母同除以 $n^{2}$："), [
              `\\lim_{n \\to \\infty} ${a} = \\lim_{n \\to \\infty} \\frac{\\frac{${c}}{n}}{1 + \\frac{${s}}{n^{2}}} = 0`,
            ]),
        compareStep("0", false),
      ],
      knownBoth(
        t(
          `This series in fact diverges: compared with $\\sum \\frac{1}{n}$, the ratio of the terms tends to $${c}$. That takes the limit comparison test, not the $n$th term test.`,
          `这个级数其实发散：与 $\\sum \\frac{1}{n}$ 相比，两者各项之比趋于 $${c}$。但这要用极限比较判别法，而不是第 $n$ 项判别法。`,
        ),
      ),
      false,
    );
  }
  if (kind === 2) {
    const m = rng.int(2, 6);
    let k = rng.int(1, 9);
    if (k === m) k = m + 1;
    const r = Q.of(k, m);
    const base = r.isInteger() ? `${r.toLatex()}^{n}` : `\\left(${r.toLatex()}\\right)^{n}`;
    const a = term(c, base);
    const small = k < m;
    return nthTermChoice(
      rng,
      sigma(a),
      [
        limitStep(
          t(
            `The base $${r.toLatex()}$ is ${small ? "less" : "greater"} than $1$, so its powers ${small ? "shrink to $0$" : "grow without bound"}:`,
            `底数 $${r.toLatex()}$ ${small ? "小于" : "大于"} $1$，所以它的幂${small ? "趋于 $0$" : "无限增大"}：`,
          ),
          [`\\lim_{n \\to \\infty} ${a} = ${small ? "0" : "\\infty"}`],
        ),
        compareStep("\\infty", !small),
      ],
      small
        ? t(
            `Read the series another way: it is geometric with ratio $${r.toLatex()} < 1$, so it converges. That agrees: a limit of $0$ allowed convergence without proving it.`,
            `换一种看法：这是公比为 $${r.toLatex()} < 1$ 的等比级数，所以收敛。这与上面一致：极限为 $0$ 只是允许收敛，并没有证明收敛。`,
          )
        : t(
            `Read the series another way: it is geometric with ratio $${r.toLatex()} > 1$, and a geometric series converges only when the ratio is between $-1$ and $1$. So it diverges, as the $n$th term test said.`,
            `换一种看法：这是公比为 $${r.toLatex()} > 1$ 的等比级数，而等比级数只有在公比介于 $-1$ 与 $1$ 之间时才收敛。所以它发散，与第 $n$ 项判别法一致。`,
          ),
      !small,
    );
  }
  if (kind === 3) {
    const b = c + 1;
    const a = `\\frac{n!}{${b}^{n}}`;
    return nthTermChoice(
      rng,
      sigma(a),
      [
        limitStep(
          t(
            `Write the term as a product of $n$ fractions. The factors from $\\frac{${b + 1}}{${b}}$ on are greater than $1$ and keep growing:`,
            `把这一项写成 $n$ 个分数之积。从 $\\frac{${b + 1}}{${b}}$ 起的各个因子都大于 $1$，而且越来越大：`,
          ),
          [`\\frac{n!}{${b}^{n}} = \\frac{1}{${b}} \\cdot \\frac{2}{${b}} \\cdots \\frac{n}{${b}} \\to \\infty`],
        ),
        compareStep("\\infty", true),
      ],
      t(
        `Use the ratio of consecutive terms instead. The ratio is $\\frac{a_{n+1}}{a_n} = \\frac{n + 1}{${b}}$. It grows without bound, so the ratio test also says the series diverges.`,
        `改用相邻两项之比：$\\frac{a_{n+1}}{a_n} = \\frac{n + 1}{${b}}$，它无限增大。所以比值判别法也说明级数发散。`,
      ),
      true,
    );
  }
  const a = `\\frac{${term(c, "n^{2}")}}{n^{2} + ${s}}`;
  return nthTermChoice(
    rng,
    sigma(a),
    [
      limitStep(t("Divide the numerator and the denominator by $n^{2}$:", "分子分母同除以 $n^{2}$："), [
        `\\lim_{n \\to \\infty} ${a} = \\lim_{n \\to \\infty} \\frac{${c}}{1 + \\frac{${s}}{n^{2}}} = ${c}`,
      ]),
      compareStep(`${c}`, true),
    ],
    t(
      `Bound every term from below instead. Since $n^{2} \\ge 1$, $\\frac{n^{2}}{n^{2} + ${s}} \\ge \\frac{1}{${1 + s}}$, so every term is at least $${frac(c, 1 + s)}$. Terms that never drop below a positive number cannot tend to $0$.`,
      `改为给每一项一个下界。由于 $n^{2} \\ge 1$，$\\frac{n^{2}}{n^{2} + ${s}} \\ge \\frac{1}{${1 + s}}$，所以每一项都至少为 $${frac(c, 1 + s)}$。始终不低于某个正数的项不可能趋于 $0$。`,
    ),
    true,
  );
}

/** standardLimitProblem asks about a series whose terms need a standard limit. */
function standardLimitProblem(rng: Rng): Problem {
  const c = rng.int(2, 9);
  const s = rng.int(1, 9);
  const kind = rng.int(0, 5);
  if (kind === 0) {
    const a = `n \\sin\\left(\\frac{${c}}{n}\\right)`;
    return nthTermChoice(
      rng,
      sigma(a),
      [
        limitStep(
          t(
            `Put $x = \\frac{${c}}{n}$, which tends to $0$, and use $\\frac{\\sin x}{x} \\to 1$:`,
            `令 $x = \\frac{${c}}{n}$，它趋于 $0$，再用 $\\frac{\\sin x}{x} \\to 1$：`,
          ),
          [`n \\sin\\left(\\frac{${c}}{n}\\right) = ${c} \\cdot \\frac{\\sin x}{x} \\to ${c}`],
        ),
        compareStep(`${c}`, true),
      ],
      t(
        `Compute two terms far out. The first is $a_{100} = 100 \\sin(${dec(c / 100, 2)}) \\approx ${dec(100 * Math.sin(c / 100), 4)}$. The second is $a_{1000} = 1000 \\sin(${dec(c / 1000, 3)}) \\approx ${dec(1000 * Math.sin(c / 1000), 4)}$. They settle at $${c}$, not at $0$.`,
        `计算靠后的项：$a_{100} = 100 \\sin(${dec(c / 100, 2)}) \\approx ${dec(100 * Math.sin(c / 100), 4)}$，$a_{1000} = 1000 \\sin(${dec(c / 1000, 3)}) \\approx ${dec(1000 * Math.sin(c / 1000), 4)}$。它们稳定在 $${c}$ 附近，而不是 $0$。`,
      ),
      true,
    );
  }
  if (kind === 1) {
    const a = `\\left(1 + \\frac{${c}}{n}\\right)^{n}`;
    return nthTermChoice(
      rng,
      sigma(a),
      [
        limitStep(t("This is the standard limit that defines powers of $e$:", "这是定义 $e$ 的幂的常见极限："), [
          `\\lim_{n \\to \\infty} \\left(1 + \\frac{${c}}{n}\\right)^{n} = e^{${c}}`,
        ]),
        compareStep(`e^{${c}}`, true),
      ],
      t(
        `Take logarithms instead. Put $x = \\frac{${c}}{n}$, which tends to $0$. Since $\\frac{\\ln(1 + x)}{x} \\to 1$, we get $\\ln a_n = n \\ln(1 + x) = ${c} \\cdot \\frac{\\ln(1 + x)}{x} \\to ${c}$. So $a_n \\to e^{${c}}$ again, which is not $0$.`,
        `改为取对数。令 $x = \\frac{${c}}{n} \\to 0$，则 $\\ln a_n = n \\ln(1 + x) = ${c} \\cdot \\frac{\\ln(1 + x)}{x} \\to ${c}$，因为 $\\frac{\\ln(1 + x)}{x} \\to 1$。所以仍有 $a_n \\to e^{${c}}$，不是 $0$。`,
      ),
      true,
    );
  }
  if (kind === 2) {
    const a = `\\cos\\left(\\frac{${c}}{n}\\right)`;
    return nthTermChoice(
      rng,
      sigma(a),
      [
        limitStep(
          t(`The angle $\\frac{${c}}{n}$ tends to $0$, and cosine is continuous:`, `角 $\\frac{${c}}{n}$ 趋于 $0$，而余弦是连续的：`),
          [`\\lim_{n \\to \\infty} \\cos\\left(\\frac{${c}}{n}\\right) = \\cos 0 = 1`],
        ),
        compareStep("1", true),
      ],
      t(
        `Bound the terms instead. For $n \\ge ${c}$ the angle $\\frac{${c}}{n}$ lies in $(0, 1]$, and cosine decreases on $[0, \\pi]$, so every such term is at least $\\cos 1 \\approx 0.540$. Terms that stay above $0.5$ cannot tend to $0$.`,
        `改为估计各项。当 $n \\ge ${c}$ 时，角 $\\frac{${c}}{n}$ 在 $(0, 1]$ 内，而余弦在 $[0, \\pi]$ 上递减，所以这些项都至少为 $\\cos 1 \\approx 0.540$。始终大于 $0.5$ 的项不可能趋于 $0$。`,
      ),
      true,
    );
  }
  if (kind === 3) {
    const a = `(-1)^{n} \\frac{${term(c, "n")}}{${shift(s)}}`;
    return nthTermChoice(
      rng,
      sigma(a),
      [
        limitStep(
          t(
            `The size $\\frac{${term(c, "n")}}{${shift(s)}}$ tends to $${c}$, and the sign alternates. So even terms approach $${c}$ and odd terms approach $-${c}$:`,
            `大小 $\\frac{${term(c, "n")}}{${shift(s)}}$ 趋于 $${c}$，而符号交替。所以偶数项趋于 $${c}$，奇数项趋于 $-${c}$：`,
          ),
          [`a_{2m} \\to ${c}, \\quad a_{2m+1} \\to -${c}`],
        ),
        [
          ["Compare the limit with 0", "把极限与 0 比较"],
          t(
            "The terms have no limit at all, so they do not tend to $0$, and the series diverges.",
            "各项根本没有极限，所以不趋于 $0$，级数发散。",
          ),
        ],
      ],
      t(
        `Look at the sizes alone. Since $n \\ge 1$, they are bounded below: $|a_n| = \\frac{${c}n}{${shift(s)}} \\ge \\frac{${c}}{${1 + s}}$. So no term is within $${frac(c, 1 + s)}$ of $0$, and $a_n$ cannot tend to $0$.`,
        `只看大小。由于 $n \\ge 1$，$|a_n| = \\frac{${c}n}{${shift(s)}} \\ge \\frac{${c}}{${1 + s}}$，所以没有一项与 $0$ 的距离小于 $${frac(c, 1 + s)}$。因此 $a_n$ 不可能趋于 $0$。`,
      ),
      true,
    );
  }
  if (kind === 4) {
    const a = `\\left(\\sqrt{n^{2} + ${s}} - n\\right)`;
    return nthTermChoice(
      rng,
      sigma(a),
      [
        limitStep(t(`Multiply and divide by the conjugate $\\sqrt{n^{2} + ${s}} + n$:`, `乘以再除以共轭式 $\\sqrt{n^{2} + ${s}} + n$：`), [
          `\\sqrt{n^{2} + ${s}} - n = \\frac{${s}}{\\sqrt{n^{2} + ${s}} + n} \\to 0`,
        ]),
        compareStep("0", false),
      ],
      t(
        `Squeeze the terms instead. Expanding a square gives $\\left(n + \\frac{${s}}{2n}\\right)^{2} = n^{2} + ${s} + \\frac{${s * s}}{4n^{2}} > n^{2} + ${s}$. Taking square roots, $0 < a_n < \\frac{${s}}{2n}$, and this bound tends to $0$. So the limit is $0$, and the test says nothing. (The series in fact diverges, like $\\sum \\frac{${s}}{2n}$, but showing that takes the limit comparison test.)`,
        `改用夹逼。由于 $\\left(n + \\frac{${s}}{2n}\\right)^{2} = n^{2} + ${s} + \\frac{${s * s}}{4n^{2}} > n^{2} + ${s}$，有 $0 < a_n < \\frac{${s}}{2n}$，它趋于 $0$。所以极限是 $0$，判别法无法下结论。（这个级数其实与 $\\sum \\frac{${s}}{2n}$ 一样发散，但要用极限比较判别法才能说明。）`,
      ),
      false,
    );
  }
  const a = `\\frac{\\ln n}{${c}n}`;
  return nthTermChoice(
    rng,
    sigma(a),
    [
      limitStep(
        t(
          `Both parts grow without bound, so use L'Hôpital's rule on $\\frac{\\ln x}{${c}x}$:`,
          `分子分母都无限增大，所以对 $\\frac{\\ln x}{${c}x}$ 用洛必达法则：`,
        ),
        [`\\lim_{x \\to \\infty} \\frac{\\ln x}{${c}x} = \\lim_{x \\to \\infty} \\frac{1/x}{${c}} = 0`],
      ),
      compareStep("0", false),
    ],
    t(
      `Bound the logarithm instead. The function $\\sqrt{x} - \\ln x$ is smallest at $x = 4$, where it is $2 - \\ln 4 > 0$, so $\\ln n < \\sqrt{n}$. Then the terms are squeezed: $0 < a_n < \\frac{\\sqrt{n}}{${c}n} = \\frac{1}{${c}\\sqrt{n}}$. The bound tends to $0$, so the limit is $0$, and the test says nothing.`,
      `改为估计对数。函数 $\\sqrt{x} - \\ln x$ 在 $x = 4$ 处最小，值为 $2 - \\ln 4 > 0$，所以 $\\ln n < \\sqrt{n}$。于是 $0 < a_n < \\frac{\\sqrt{n}}{${c}n} = \\frac{1}{${c}\\sqrt{n}}$，它趋于 $0$。极限为 $0$，判别法无法下结论。`,
    ),
    false,
  );
}

/** theNthTermTestForDivergence: if aₙ does not tend to 0, the series diverges. */
export const theNthTermTestForDivergence: TopicDef = {
  id: "the-nth-term-test-for-divergence",
  title: t("The Nth Term Test for Divergence", "发散的第 n 项判别法"),
  summary: t(
    "If lim aₙ ≠ 0 (or does not exist), Σaₙ diverges; if lim aₙ = 0, the test says nothing.",
    "若 lim aₙ ≠ 0（或不存在），则 Σaₙ 发散；若 lim aₙ = 0，此判别法无法得出结论。",
  ),
  intro: t(
    "The terms of $\\sum \\frac{n}{n + 1}$ are $\\frac{1}{2}, \\frac{2}{3}, \\frac{3}{4}, \\ldots$, which tend to $1$. Each one is at least $\\frac{1}{2}$, so the partial sums keep growing:\n\n$$S_n \\ge \\frac{n}{2}$$\n\nThey cannot settle on a finite sum, and the series diverges.\n\nCheck: $S_4 = \\frac{1}{2} + \\frac{2}{3} + \\frac{3}{4} + \\frac{4}{5} = \\frac{163}{60} \\approx 2.72$, which is indeed at least $\\frac{4}{2} = 2$.\n\nIn this lesson we use the limit of the terms to spot divergence, and see why terms that tend to $0$ prove nothing.",
    "$\\sum \\frac{n}{n + 1}$ 的各项为 $\\frac{1}{2}, \\frac{2}{3}, \\frac{3}{4}, \\ldots$，趋于 $1$。每一项都至少为 $\\frac{1}{2}$，所以部分和不断增大：\n\n$$S_n \\ge \\frac{n}{2}$$\n\n部分和不可能稳定在一个有限的和上，级数发散。\n\n检验：$S_4 = \\frac{1}{2} + \\frac{2}{3} + \\frac{3}{4} + \\frac{4}{5} = \\frac{163}{60} \\approx 2.72$，确实至少为 $\\frac{4}{2} = 2$。\n\n这节课我们用各项的极限来识别发散，并看清为什么趋于 $0$ 的项什么也证明不了。",
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
        "If $\\sum a_n$ converges to $S$, then $a_n = S_n - S_{n-1} \\to S - S = 0$. Turned around:\n\n$$\\lim_{n \\to \\infty} a_n \\neq 0 \\text{ (or no limit)} \\implies \\sum a_n \\text{ diverges}$$\n\nWhen $a_n \\to 0$ the test is **inconclusive**. For example, $\\sum \\frac{2n}{3n + 1}$ diverges, because dividing by $n$ gives $\\frac{2}{3 + 1/n} \\to \\frac{2}{3}$.\n\nCheck: at $n = 1000$ the term is $\\frac{2000}{3001} \\approx 0.6664$, close to $\\frac{2}{3}$. Adding about $0.67$ at every step, the partial sums grow without bound.\n\n> **Watch out.** The test never proves convergence. The terms of the harmonic series $\\sum \\frac{1}{n}$ tend to $0$, yet it diverges.",
        "若 $\\sum a_n$ 收敛到 $S$，则 $a_n = S_n - S_{n-1} \\to S - S = 0$。反过来说：\n\n$$\\lim_{n \\to \\infty} a_n \\neq 0 \\text{（或极限不存在）} \\implies \\sum a_n \\text{ 发散}$$\n\n当 $a_n \\to 0$ 时，此判别法**无法得出结论**。例如 $\\sum \\frac{2n}{3n + 1}$ 发散，因为分子分母同除以 $n$ 得 $\\frac{2}{3 + 1/n} \\to \\frac{2}{3}$。\n\n检验：在 $n = 1000$ 处这一项为 $\\frac{2000}{3001} \\approx 0.6664$，接近 $\\frac{2}{3}$。每一步都加上约 $0.67$，部分和无限增大。\n\n> **注意。** 这个判别法从来不能证明收敛。调和级数 $\\sum \\frac{1}{n}$ 的各项趋于 $0$，但它发散。",
      ),
      generate: nthTermProblem,
    },
    {
      id: "terms-that-need-a-standard-limit",
      title: t("Terms whose limit needs a standard limit", "需要用到常见极限的项"),
      explanation: t(
        "The $n$th term test needs only the limit of the terms, and finding it may take a standard limit such as\n\n$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\qquad \\lim_{n \\to \\infty} \\left(1 + \\frac{c}{n}\\right)^{n} = e^{c}$$\n\nFor example, with $x = \\frac{3}{n}$, $n \\sin\\left(\\frac{3}{n}\\right) = 3 \\cdot \\frac{\\sin x}{x} \\to 3$, so $\\sum n \\sin\\left(\\frac{3}{n}\\right)$ diverges.\n\nCheck: $a_{1000} = 1000 \\sin(0.003) \\approx 2.99999$, already very close to $3$.\n\n> **Watch out.** $\\sqrt{n^{2} + 5} - n$ is not about $n - n = 0$ by luck: it is $\\frac{5}{\\sqrt{n^{2} + 5} + n} \\to 0$, so for that series the test says nothing, rather than proving convergence.",
        "第 $n$ 项判别法只需要各项的极限，而求这个极限可能要用到常见极限，例如\n\n$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\qquad \\lim_{n \\to \\infty} \\left(1 + \\frac{c}{n}\\right)^{n} = e^{c}$$\n\n例如，令 $x = \\frac{3}{n}$，$n \\sin\\left(\\frac{3}{n}\\right) = 3 \\cdot \\frac{\\sin x}{x} \\to 3$，所以 $\\sum n \\sin\\left(\\frac{3}{n}\\right)$ 发散。\n\n检验：$a_{1000} = 1000 \\sin(0.003) \\approx 2.99999$，已经非常接近 $3$。\n\n> **注意。** $\\sqrt{n^{2} + 5} - n$ 趋于 $0$ 不是碰巧的 $n - n = 0$：它等于 $\\frac{5}{\\sqrt{n^{2} + 5} + n} \\to 0$。所以对这个级数判别法无法下结论，而不是证明了收敛。",
      ),
      generate: standardLimitProblem,
    },
  ],
};

/** IntegralCase is a series Σ f(n) settled by the integral test, with a second route to the same verdict. */
interface IntegralCase {
  readonly series: string;
  readonly converges: boolean;
  readonly decreasing: Text;
  readonly integral: string;
  readonly check: Text;
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
      decreasing: t(
        "The terms are positive, and $x \\ln x$ increases for $x \\ge 2$, so they decrease.",
        "各项为正，且 $x \\ln x$ 在 $x \\ge 2$ 时递增，所以各项递减。",
      ),
      integral: `\\int_{2}^{\\infty} \\frac{${c}}{x \\ln x} \\, dx = \\lim_{b \\to \\infty} \\left[${k1(c)}\\ln(\\ln x)\\right]_{2}^{b} = \\infty`,
      check: t(
        `Group the terms in blocks from $n = 2^{k}$ to $n = 2^{k+1} - 1$. A block has $2^{k}$ terms, each at least $\\frac{${c}}{2^{k+1} (k + 1) \\ln 2}$, so the block adds at least\n\n$$2^{k} \\cdot \\frac{${c}}{2^{k+1} (k + 1) \\ln 2} = \\frac{${c}}{2 \\ln 2} \\cdot \\frac{1}{k + 1}$$\n\nThese amounts are a multiple of the terms of the harmonic series, so the partial sums grow without bound.`,
        `把各项按 $n = 2^{k}$ 到 $n = 2^{k+1} - 1$ 分组。每组有 $2^{k}$ 项，每项至少为 $\\frac{${c}}{2^{k+1} (k + 1) \\ln 2}$，所以每组至少加上\n\n$$2^{k} \\cdot \\frac{${c}}{2^{k+1} (k + 1) \\ln 2} = \\frac{${c}}{2 \\ln 2} \\cdot \\frac{1}{k + 1}$$\n\n这些量是调和级数各项的倍数，所以部分和无限增大。`,
      ),
    };
  if (kind === 1)
    return {
      series: sigma(`\\frac{${c}}{n (\\ln n)^{2}}`, 2),
      converges: true,
      decreasing: t(
        "The terms are positive, and $x (\\ln x)^{2}$ increases for $x \\ge 2$, so they decrease.",
        "各项为正，且 $x (\\ln x)^{2}$ 在 $x \\ge 2$ 时递增，所以各项递减。",
      ),
      integral: `\\int_{2}^{\\infty} \\frac{${c}}{x (\\ln x)^{2}} \\, dx = \\lim_{b \\to \\infty} \\left[-\\frac{${c}}{\\ln x}\\right]_{2}^{b} = \\frac{${c}}{\\ln 2}`,
      check: t(
        `Group the terms in blocks from $n = 2^{k}$ to $n = 2^{k+1} - 1$. A block has $2^{k}$ terms, each at most $\\frac{${c}}{2^{k} (k \\ln 2)^{2}}$, so the block adds at most\n\n$$2^{k} \\cdot \\frac{${c}}{2^{k} (k \\ln 2)^{2}} = \\frac{${c}}{(\\ln 2)^{2}} \\cdot \\frac{1}{k^{2}}$$\n\nThese amounts are a multiple of the terms of the convergent $p$-series $\\sum \\frac{1}{k^{2}}$, so the partial sums stay bounded and the series converges.`,
        `把各项按 $n = 2^{k}$ 到 $n = 2^{k+1} - 1$ 分组。每组有 $2^{k}$ 项，每项至多为 $\\frac{${c}}{2^{k} (k \\ln 2)^{2}}$，所以每组至多加上\n\n$$2^{k} \\cdot \\frac{${c}}{2^{k} (k \\ln 2)^{2}} = \\frac{${c}}{(\\ln 2)^{2}} \\cdot \\frac{1}{k^{2}}$$\n\n这些量是收敛的 $p$ 级数 $\\sum \\frac{1}{k^{2}}$ 各项的倍数，所以部分和有界，级数收敛。`,
      ),
    };
  if (kind === 2)
    return {
      series: sigma(`${k1(c)}n e^{-n^{2}}`),
      converges: true,
      decreasing: t(
        `The terms are positive, and the derivative of $${k1(c)}x e^{-x^{2}}$ is $${c}e^{-x^{2}}(1 - 2x^{2}) < 0$ for $x \\ge 1$, so they decrease.`,
        `各项为正，且 $${k1(c)}x e^{-x^{2}}$ 的导数 $${c}e^{-x^{2}}(1 - 2x^{2})$ 在 $x \\ge 1$ 时小于 $0$，所以各项递减。`,
      ),
      integral: `\\int_{1}^{\\infty} ${k1(c)}x e^{-x^{2}} \\, dx = \\lim_{b \\to \\infty} \\left[-\\frac{${c}}{2} e^{-x^{2}}\\right]_{1}^{b} = \\frac{${c}}{2e}`,
      check: t(
        "Use the ratio test instead. Since $e^{-(n+1)^{2}} = e^{-n^{2}} \\cdot e^{-(2n + 1)}$,\n\n$$\\frac{a_{n+1}}{a_n} = \\frac{n + 1}{n} \\cdot e^{-(2n + 1)} \\to 0$$\n\nThe limit is less than $1$, so the ratio test also gives convergence.",
        "改用比值判别法。由于 $e^{-(n+1)^{2}} = e^{-n^{2}} \\cdot e^{-(2n + 1)}$，\n\n$$\\frac{a_{n+1}}{a_n} = \\frac{n + 1}{n} \\cdot e^{-(2n + 1)} \\to 0$$\n\n极限小于 $1$，所以比值判别法也给出收敛。",
      ),
    };
  if (kind === 3)
    return {
      series: sigma(`\\frac{${k1(c)}\\ln n}{n}`, 3),
      converges: false,
      decreasing: t(
        `The terms are positive, and the derivative of $\\frac{${k1(c)}\\ln x}{x}$ is $\\frac{${c}(1 - \\ln x)}{x^{2}} < 0$ for $x \\ge 3 > e$, so they decrease.`,
        `各项为正，且 $\\frac{${k1(c)}\\ln x}{x}$ 的导数 $\\frac{${c}(1 - \\ln x)}{x^{2}}$ 在 $x \\ge 3 > e$ 时小于 $0$，所以各项递减。`,
      ),
      integral: `\\int_{3}^{\\infty} \\frac{${k1(c)}\\ln x}{x} \\, dx = \\lim_{b \\to \\infty} \\left[\\frac{${c}}{2} (\\ln x)^{2}\\right]_{3}^{b} = \\infty`,
      check: t(
        `Use the comparison test instead. For $n \\ge 3$, $\\ln n > 1$, so $\\frac{${k1(c)}\\ln n}{n} > \\frac{${c}}{n}$. The series $\\sum \\frac{${c}}{n}$ is a multiple of the harmonic series and diverges, so the larger series diverges too.`,
        `改用比较判别法。当 $n \\ge 3$ 时 $\\ln n > 1$，所以 $\\frac{${k1(c)}\\ln n}{n} > \\frac{${c}}{n}$。级数 $\\sum \\frac{${c}}{n}$ 是调和级数的倍数，发散，所以更大的级数也发散。`,
      ),
    };
  return {
    series: sigma(`\\frac{${c}}{${shift(a)}}`),
    converges: false,
    decreasing: t(
      `The terms are positive, and $${linear(1, a)}$ increases, so they decrease.`,
      `各项为正，且 $${linear(1, a)}$ 递增，所以各项递减。`,
    ),
    integral: `\\int_{1}^{\\infty} \\frac{${c}}{${linear(1, a)}} \\, dx = \\lim_{b \\to \\infty} \\left[${k1(c)}\\ln(${linear(1, a)})\\right]_{1}^{b} = \\infty`,
    check: t(
      `Use the limit comparison test with the harmonic series instead:\n\n$$\\frac{${c}/(${shift(a)})}{1/n} = \\frac{${c}n}{${shift(a)}} \\to ${c}$$\n\nThe limit is positive and finite, and $\\sum \\frac{1}{n}$ diverges, so the series diverges too.`,
      `改为与调和级数作极限比较：\n\n$$\\frac{${c}/(${shift(a)})}{1/n} = \\frac{${c}n}{${shift(a)}} \\to ${c}$$\n\n极限是正的有限值，而 $\\sum \\frac{1}{n}$ 发散，所以原级数也发散。`,
    ),
  };
}

/** comparisonIntegral asks for the improper integral that the integral test compares a series with. */
function comparisonIntegral(rng: Rng): Problem {
  const c = rng.int(1, 12);
  const a = rng.int(1, 6);
  const kind = rng.int(0, 2);
  const xa = linear(1, a);
  const f =
    kind === 0 ? `\\frac{${c}}{(${xa})^{2}}` : kind === 1 ? `\\frac{${c}}{(${xa})^{3}}` : `\\frac{${term(c, "x")}}{(x^{2} + ${a + 1})^{2}}`;
  const answer = kind === 0 ? Q.of(c, 1 + a) : kind === 1 ? Q.of(c, 2 * (1 + a) ** 2) : Q.of(c, 2 * (a + 2));
  const F = kind === 0 ? `-\\frac{${c}}{${xa}}` : kind === 1 ? `-\\frac{${c}}{2(${xa})^{2}}` : `-\\frac{${c}}{2(x^{2} + ${a + 1})}`;
  const atOne =
    kind === 0 ? `-\\frac{${c}}{${1 + a}}` : kind === 1 ? `-\\frac{${c}}{2 \\cdot ${1 + a}^{2}}` : `-\\frac{${c}}{2 \\cdot ${a + 2}}`;
  const find: Step =
    kind === 2
      ? [
          ["Find an antiderivative", "求原函数"],
          t(
            `Substitute $u = x^{2} + ${a + 1}$, so $du = 2x \\, dx$ and the integrand becomes $\\frac{${c}}{2u^{2}}$:`,
            `令 $u = x^{2} + ${a + 1}$，则 $du = 2x \\, dx$，被积函数化为 $\\frac{${c}}{2u^{2}}$：`,
          ),
          [`\\int ${f} \\, dx = -\\frac{${c}}{2u} + C = ${F} + C`],
        ]
      : [
          ["Find an antiderivative", "求原函数"],
          t(`By the power rule for $(${xa})^{${kind === 0 ? -2 : -3}}$:`, `对 $(${xa})^{${kind === 0 ? -2 : -3}}$ 用幂法则：`),
          [`\\int ${f} \\, dx = ${F} + C`],
        ];
  const mistakes: Mistake[] =
    kind === 0
      ? [
          slip(
            Q.of(c, a),
            "This puts $x = 0$ into the antiderivative, but the integral starts at $x = 1$.",
            "这里把 $x = 0$ 代入原函数，但积分从 $x = 1$ 开始。",
          ),
          slip(
            Q.of(c, (1 + a) ** 2),
            "This is the integrand at $x = 1$, not the antiderivative.",
            "这是被积函数在 $x = 1$ 处的值，不是原函数的值。",
          ),
        ]
      : kind === 1
        ? [
            slip(
              Q.of(c, (1 + a) ** 2),
              "This leaves out the factor $\\frac{1}{2}$ that the power rule gives for $(x + a)^{-3}$.",
              "这里漏掉了幂法则对 $(x + a)^{-3}$ 给出的因子 $\\frac{1}{2}$。",
            ),
            slip(
              Q.of(c, 2 * a * a),
              "This puts $x = 0$ into the antiderivative, but the integral starts at $x = 1$.",
              "这里把 $x = 0$ 代入原函数，但积分从 $x = 1$ 开始。",
            ),
            slip(
              Q.of(c, (1 + a) ** 3),
              "This is the integrand at $x = 1$, not the antiderivative.",
              "这是被积函数在 $x = 1$ 处的值，不是原函数的值。",
            ),
          ]
        : [
            slip(
              Q.of(c, a + 2),
              "This leaves out the $\\frac{1}{2}$ that comes from $du = 2x \\, dx$.",
              "这里漏掉了由 $du = 2x \\, dx$ 得到的 $\\frac{1}{2}$。",
            ),
            slip(
              Q.of(c, 2 * (a + 1)),
              "This puts $x = 0$ into the antiderivative, but the integral starts at $x = 1$.",
              "这里把 $x = 0$ 代入原函数，但积分从 $x = 1$ 开始。",
            ),
            slip(
              Q.of(c, (a + 2) ** 2),
              "This is the integrand at $x = 1$, not the antiderivative.",
              "这是被积函数在 $x = 1$ 处的值，不是原函数的值。",
            ),
          ];
  const check =
    kind === 2
      ? t(
          `Differentiate the antiderivative back. The derivative of $${F}$ is the integrand: $\\frac{${c} \\cdot 2x}{2(x^{2} + ${a + 1})^{2}} = ${f}$. The antiderivative is $${atOne}$ at $x = 1$ and tends to $0$, so the integral is $${answer.toLatex()}$.`,
          `把原函数求导回去：$${F}$ 的导数是 $\\frac{${c} \\cdot 2x}{2(x^{2} + ${a + 1})^{2}} = ${f}$，正是被积函数。它在 $x = 1$ 处为 $${atOne}$，且趋于 $0$，所以积分为 $${answer.toLatex()}$。`,
        )
      : t(
          `Substitute $u = ${xa}$ instead, which moves the lower limit to $u = ${1 + a}$:\n\n$$\\int_{${1 + a}}^{\\infty} \\frac{${c}}{u^{${kind + 2}}} \\, du = \\left[-\\frac{${c}}{${kind === 0 ? "u" : "2u^{2}"}}\\right]_{${1 + a}}^{\\infty} = ${answer.toLatex()}$$\n\nThe value is the same.`,
          `改用换元 $u = ${xa}$，下限变为 $u = ${1 + a}$：\n\n$$\\int_{${1 + a}}^{\\infty} \\frac{${c}}{u^{${kind + 2}}} \\, du = \\left[-\\frac{${c}}{${kind === 0 ? "u" : "2u^{2}"}}\\right]_{${1 + a}}^{\\infty} = ${answer.toLatex()}$$\n\n结果相同。`,
        );
  return worked(
    t(
      `To apply the integral test to $${sigma(f.replaceAll("x", "n"))}$, evaluate $\\int_{1}^{\\infty} ${f} \\, dx$.`,
      `为了对 $${sigma(f.replaceAll("x", "n"))}$ 应用积分判别法，计算 $\\int_{1}^{\\infty} ${f} \\, dx$。`,
    ),
    answer,
    [
      find,
      [
        ["Take the limit", "取极限"],
        t(
          `As $x \\to \\infty$ the antiderivative tends to $0$. Subtract its value at $x = 1$:`,
          `当 $x \\to \\infty$ 时原函数趋于 $0$。减去它在 $x = 1$ 处的值：`,
        ),
        [`\\int_{1}^{\\infty} ${f} \\, dx = 0 - \\left(${atOne}\\right) = ${answer.toLatex()}`],
      ],
      [
        ["Read the test", "读出判别结果"],
        t("The integral is finite, so by the integral test the series converges.", "积分是有限值，所以由积分判别法，级数收敛。"),
      ],
    ],
    check,
    mistakes,
  );
}

/** theIntegralTest compares a series of positive decreasing terms with an improper integral. */
export const theIntegralTest: TopicDef = {
  id: "the-integral-test",
  title: t("The Integral Test", "积分判别法"),
  summary: t(
    "If $f$ is positive, continuous and decreasing with $a_n = f(n)$, then $\\sum a_n$ and $\\int_1^{\\infty} f(x)\\,dx$ both converge or both diverge.",
    "若 $f$ 为正、连续且递减，$a_n = f(n)$，则 $\\sum a_n$ 与 $\\int_1^{\\infty} f(x)\\,dx$ 同时收敛或同时发散。",
  ),
  intro: t(
    "Draw rectangles of width $1$ and heights $\\frac{1}{2^{2}}, \\frac{1}{3^{2}}, \\ldots$ under the graph of $y = \\frac{1}{x^{2}}$ from $x = 1$ on. Their total area is at most the area under the curve, so\n\n$$S_N \\le 1 + \\int_{1}^{\\infty} \\frac{dx}{x^{2}} = 2$$\n\nThe partial sums of $\\sum \\frac{1}{n^{2}}$ increase and stay below $2$, so the series converges.\n\nCheck: $S_4 = 1 + \\frac{1}{4} + \\frac{1}{9} + \\frac{1}{16} = \\frac{205}{144} \\approx 1.42$, below $2$.\n\nIn this lesson we compare a series of positive, decreasing terms with an improper integral, and let the integral decide.",
    "在 $y = \\frac{1}{x^{2}}$ 的图像下方，从 $x = 1$ 起画宽为 $1$、高为 $\\frac{1}{2^{2}}, \\frac{1}{3^{2}}, \\ldots$ 的矩形。它们的总面积不超过曲线下方的面积，所以\n\n$$S_N \\le 1 + \\int_{1}^{\\infty} \\frac{dx}{x^{2}} = 2$$\n\n$\\sum \\frac{1}{n^{2}}$ 的部分和递增且小于 $2$，所以级数收敛。\n\n检验：$S_4 = 1 + \\frac{1}{4} + \\frac{1}{9} + \\frac{1}{16} = \\frac{205}{144} \\approx 1.42$，小于 $2$。\n\n这节课我们把各项为正且递减的级数与反常积分比较，让积分来判断。",
  ),
  prerequisites: ["the-nth-term-test-for-divergence", "improper-integrals"],
  encompasses: [{ topic: "improper-integrals", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-the-comparison-integral",
      figure: calculusDrawings5["the-integral-test#evaluating-the-comparison-integral"],
      title: t("Evaluating the integral", "计算对应的积分"),
      explanation: t(
        "Let $a_n = f(n)$, where $f$ is positive, continuous and decreasing on $[1, \\infty)$. The terms are heights of rectangles of width $1$ that lie under the graph from $n - 1$ to $n$ and over it from $n$ to $n + 1$, so\n\n$$\\int_{1}^{\\infty} f(x) \\, dx \\le \\sum_{n=1}^{\\infty} a_n \\le a_1 + \\int_{1}^{\\infty} f(x) \\, dx$$\n\nHence the series and the integral **both converge or both diverge**. For $\\sum \\frac{3}{(n + 1)^{2}}$, an antiderivative is $-\\frac{3}{x + 1}$, so $\\int_{1}^{\\infty} \\frac{3}{(x + 1)^{2}} \\, dx = 0 - \\left(-\\frac{3}{2}\\right) = \\frac{3}{2}$, and the series converges.\n\nCheck: with $u = x + 1$ the integral is $\\int_{2}^{\\infty} \\frac{3}{u^{2}} \\, du = \\frac{3}{2}$ again.\n\n> **Watch out.** The integral is not the sum. Here the sum is about $1.93$: it lies between $\\frac{3}{2}$ and $a_1 + \\frac{3}{2} = \\frac{9}{4}$, but it is not $\\frac{3}{2}$.",
        "设 $a_n = f(n)$，$f$ 在 $[1, \\infty)$ 上为正、连续且递减。各项是宽为 $1$ 的矩形的高，这些矩形从 $n - 1$ 到 $n$ 位于图像下方，从 $n$ 到 $n + 1$ 位于图像上方，所以\n\n$$\\int_{1}^{\\infty} f(x) \\, dx \\le \\sum_{n=1}^{\\infty} a_n \\le a_1 + \\int_{1}^{\\infty} f(x) \\, dx$$\n\n因此级数与积分**同时收敛或同时发散**。对 $\\sum \\frac{3}{(n + 1)^{2}}$，一个原函数是 $-\\frac{3}{x + 1}$，所以 $\\int_{1}^{\\infty} \\frac{3}{(x + 1)^{2}} \\, dx = 0 - \\left(-\\frac{3}{2}\\right) = \\frac{3}{2}$，级数收敛。\n\n检验：令 $u = x + 1$，积分为 $\\int_{2}^{\\infty} \\frac{3}{u^{2}} \\, du = \\frac{3}{2}$，结果相同。\n\n> **注意。** 积分值不是级数的和。这里级数的和约为 $1.93$：它介于 $\\frac{3}{2}$ 与 $a_1 + \\frac{3}{2} = \\frac{9}{4}$ 之间，但不等于 $\\frac{3}{2}$。",
      ),
      generate: comparisonIntegral,
    },
    {
      id: "deciding-convergence-with-the-integral-test",
      title: t("Deciding convergence with the integral test", "用积分判别法判断敛散性"),
      explanation: t(
        "Check that $f$ is positive and decreasing, then evaluate the improper integral. A finite value means the series converges; an infinite one means it diverges. For $\\sum_{n=2}^{\\infty} \\frac{1}{n \\ln n}$, the substitution $u = \\ln x$ gives\n\n$$\\int_{2}^{\\infty} \\frac{dx}{x \\ln x} = \\lim_{b \\to \\infty} \\left[\\ln(\\ln x)\\right]_{2}^{b} = \\infty$$\n\nSo the series diverges.\n\nCheck: the terms from $n = 2^{k}$ to $2^{k+1} - 1$ add up to at least $\\frac{1}{2 \\ln 2} \\cdot \\frac{1}{k + 1}$, a multiple of the harmonic series, so the partial sums grow without bound.\n\n> **Watch out.** The test needs decreasing terms. $\\frac{\\ln x}{x}$ rises until $x = e$, so for $\\sum \\frac{\\ln n}{n}$ start the integral at $x = 3$, where it already falls.",
        "先检查 $f$ 为正且递减，再计算反常积分。积分有限则级数收敛，积分无穷则级数发散。对 $\\sum_{n=2}^{\\infty} \\frac{1}{n \\ln n}$，令 $u = \\ln x$，得\n\n$$\\int_{2}^{\\infty} \\frac{dx}{x \\ln x} = \\lim_{b \\to \\infty} \\left[\\ln(\\ln x)\\right]_{2}^{b} = \\infty$$\n\n所以级数发散。\n\n检验：从 $n = 2^{k}$ 到 $2^{k+1} - 1$ 的各项之和至少为 $\\frac{1}{2 \\ln 2} \\cdot \\frac{1}{k + 1}$，是调和级数的倍数，所以部分和无限增大。\n\n> **注意。** 这个判别法要求各项递减。$\\frac{\\ln x}{x}$ 在 $x = e$ 之前是增大的，所以对 $\\sum \\frac{\\ln n}{n}$，积分要从已经递减的 $x = 3$ 开始。",
      ),
      generate(rng) {
        const k = integralCase(rng);
        return verdict(
          rng,
          k.series,
          k.converges,
          walked(
            [
              [["Check the conditions", "检查条件"], k.decreasing],
              [["Evaluate the integral", "计算积分"], t("The improper integral is", "反常积分为"), [k.integral]],
              [
                ["Read the test", "读出判别结果"],
                k.converges
                  ? t("The integral is finite, so by the integral test the series converges.", "积分有限，所以由积分判别法，级数收敛。")
                  : t("The integral is infinite, so by the integral test the series diverges.", "积分为无穷，所以由积分判别法，级数发散。"),
              ],
            ],
            k.check,
          ),
          t("Use the integral test.", "用积分判别法。"),
        );
      },
    },
  ],
};

/** integralBound writes the integral test bound c/((p − 1)N^{p−1}) for N given as a number or as "N". */
const integralBound = (c: number, p: number, N: number | string) =>
  p === 2 ? `\\frac{${c}}{${N}}` : typeof N === "number" ? `\\frac{${c}}{2 \\cdot ${N}^{2}}` : `\\frac{${c}}{2N^{2}}`;

/** telescopingBound checks the integral test bound for Σ c/nᵖ against a telescoping series. */
function telescopingBound(c: number, p: number, N: number, answer: Q): Text {
  if (p === 2)
    return t(
      `Bound the terms by a telescoping series instead. For $n \\ge 2$, each term lies below a difference: $\\frac{1}{n^{2}} < \\frac{1}{(n - 1)n} = \\frac{1}{n - 1} - \\frac{1}{n}$. These differences telescope:\n\n$$R_{${N}} < ${k1(c)}\\left[\\left(\\frac{1}{${N}} - \\frac{1}{${N + 1}}\\right) + \\left(\\frac{1}{${N + 1}} - \\frac{1}{${N + 2}}\\right) + \\cdots\\right] = ${answer.toLatex()}$$\n\nThe same bound.`,
      `改用裂项相消的级数来估计各项。当 $n \\ge 2$ 时，$\\frac{1}{n^{2}} < \\frac{1}{(n - 1)n} = \\frac{1}{n - 1} - \\frac{1}{n}$，所以\n\n$$R_{${N}} < ${k1(c)}\\left[\\left(\\frac{1}{${N}} - \\frac{1}{${N + 1}}\\right) + \\left(\\frac{1}{${N + 1}} - \\frac{1}{${N + 2}}\\right) + \\cdots\\right] = ${answer.toLatex()}$$\n\n得到同样的界。`,
    );
  const sharper = Q.of(c, 2 * N * (N + 1));
  return t(
    `Bound the terms by a telescoping series instead. For $n \\ge 2$, $\\frac{1}{n^{3}} < \\frac{1}{(n - 1)n(n + 1)} = \\frac{1}{2}\\left(\\frac{1}{(n - 1)n} - \\frac{1}{n(n + 1)}\\right)$. Summing from $n = ${N + 1}$, everything after the first difference cancels:\n\n$$R_{${N}} < \\frac{${c}}{2} \\cdot \\frac{1}{${N} \\cdot ${N + 1}} = ${sharper.toLatex()}$$\n\nThis is a little smaller than $${answer.toLatex()}$, as it should be: both are upper bounds for the same remainder.`,
    `改用裂项相消的级数来估计各项。当 $n \\ge 2$ 时，$\\frac{1}{n^{3}} < \\frac{1}{(n - 1)n(n + 1)} = \\frac{1}{2}\\left(\\frac{1}{(n - 1)n} - \\frac{1}{n(n + 1)}\\right)$。从 $n = ${N + 1}$ 起求和，除第一个差以外全部抵消：\n\n$$R_{${N}} < \\frac{${c}}{2} \\cdot \\frac{1}{${N} \\cdot ${N + 1}} = ${sharper.toLatex()}$$\n\n它比 $${answer.toLatex()}$ 略小，这是应该的：两者都是同一个余项的上界。`,
  );
}

/** theRemainderEstimateForTheIntegralTest bounds the error Rₙ = S − Sₙ by an integral. */
export const theRemainderEstimateForTheIntegralTest: TopicDef = {
  id: "the-remainder-estimate-for-the-integral-test",
  title: t("The Remainder Estimate for the Integral Test", "积分判别法的余项估计"),
  summary: t(
    "For positive decreasing $f$, the remainder after $N$ terms satisfies $R_N \\le \\int_N^{\\infty} f(x)\\,dx$.",
    "对为正且递减的 $f$，前 $N$ 项之后的余项满足 $R_N \\le \\int_N^{\\infty} f(x)\\,dx$。",
  ),
  intro: t(
    "After the first $10$ terms of $\\sum \\frac{1}{n^{2}}$, the rest $\\frac{1}{11^{2}} + \\frac{1}{12^{2}} + \\cdots$ is the area of rectangles lying under $y = \\frac{1}{x^{2}}$ from $x = 10$ on, so\n\n$$R_{10} \\le \\int_{10}^{\\infty} \\frac{dx}{x^{2}} = \\frac{1}{10}$$\n\nCheck: $\\frac{1}{n^{2}} < \\frac{1}{n - 1} - \\frac{1}{n}$, and these differences from $n = 11$ on telescope to $\\frac{1}{10}$, the same bound.\n\nIn this lesson we bound the error of a partial sum by an integral, and choose how many terms make the error small.",
    "取 $\\sum \\frac{1}{n^{2}}$ 的前 $10$ 项后，剩下的 $\\frac{1}{11^{2}} + \\frac{1}{12^{2}} + \\cdots$ 是从 $x = 10$ 起位于 $y = \\frac{1}{x^{2}}$ 下方的矩形面积，所以\n\n$$R_{10} \\le \\int_{10}^{\\infty} \\frac{dx}{x^{2}} = \\frac{1}{10}$$\n\n检验：$\\frac{1}{n^{2}} < \\frac{1}{n - 1} - \\frac{1}{n}$，这些差从 $n = 11$ 起裂项相消，和为 $\\frac{1}{10}$，得到同样的界。\n\n这节课我们用积分估计部分和的误差，并决定取多少项能使误差足够小。",
  ),
  prerequisites: ["the-integral-test"],
  encompasses: [{ topic: "the-integral-test", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "bounding-the-remainder",
      figure: calculusDrawings5["the-remainder-estimate-for-the-integral-test#bounding-the-remainder"],
      title: t("Bounding the remainder", "估计余项的上界"),
      explanation: t(
        "The remainder $R_N = S - S_N = a_{N+1} + a_{N+2} + \\cdots$ is a sum of rectangles lying under the graph of $f$ from $N$ on, so\n\n$$R_N \\le \\int_{N}^{\\infty} f(x) \\, dx$$\n\nFor $\\sum \\frac{1}{n^{3}}$ and $N = 5$: $R_{5} \\le \\int_{5}^{\\infty} \\frac{dx}{x^{3}} = \\left[-\\frac{1}{2x^{2}}\\right]_{5}^{\\infty} = \\frac{1}{50}$.\n\nCheck: the first term left out is $a_{6} = \\frac{1}{216}$, and the remainder is a little more than that, well within $\\frac{1}{50} = 0.02$: in fact $R_{5} \\approx 0.0118$.\n\n> **Watch out.** The integral starts at $N$, not at $N + 1$. The integral from $N + 1$ is smaller than the remainder: it is a lower bound, not an upper one.",
        "余项 $R_N = S - S_N = a_{N+1} + a_{N+2} + \\cdots$ 是从 $N$ 起位于 $f$ 图像下方的矩形面积之和，所以\n\n$$R_N \\le \\int_{N}^{\\infty} f(x) \\, dx$$\n\n对 $\\sum \\frac{1}{n^{3}}$ 且 $N = 5$：$R_{5} \\le \\int_{5}^{\\infty} \\frac{dx}{x^{3}} = \\left[-\\frac{1}{2x^{2}}\\right]_{5}^{\\infty} = \\frac{1}{50}$。\n\n检验：第一个被省略的项是 $a_{6} = \\frac{1}{216}$，余项比它稍大，远在 $\\frac{1}{50} = 0.02$ 之内：实际上 $R_{5} \\approx 0.0118$。\n\n> **注意。** 积分从 $N$ 开始，而不是从 $N + 1$ 开始。从 $N + 1$ 开始的积分比余项小：它是下界，不是上界。",
      ),
      generate(rng) {
        const p = rng.int(2, 3);
        const c = rng.int(1, 9);
        const N = rng.int(2, 10);
        const answer = Q.of(c, (p - 1) * N ** (p - 1));
        const F = p === 2 ? `-\\frac{${c}}{x}` : `-\\frac{${c}}{2x^{2}}`;
        return worked(
          t(
            `Use the integral test remainder estimate to find an upper bound for $R_{${N}} = S - S_{${N}}$, where $S = ${sigma(`\\frac{${c}}{n^{${p}}}`)}$.`,
            `用积分判别法的余项估计，求 $R_{${N}} = S - S_{${N}}$ 的一个上界，其中 $S = ${sigma(`\\frac{${c}}{n^{${p}}}`)}$。`,
          ),
          answer,
          [
            [
              ["Set up the bound", "写出上界"],
              t(
                `The terms are positive and decreasing, and the remainder lies under the graph from $x = ${N}$ on:`,
                `各项为正且递减，余项位于从 $x = ${N}$ 起的图像下方：`,
              ),
              [`R_{${N}} \\le \\int_{${N}}^{\\infty} \\frac{${c}}{x^{${p}}} \\, dx`],
            ],
            [
              ["Integrate", "积分"],
              t(`An antiderivative is $${F}$, which tends to $0$:`, `一个原函数是 $${F}$，它趋于 $0$：`),
              [
                `\\int_{${N}}^{\\infty} \\frac{${c}}{x^{${p}}} \\, dx = \\left[${F}\\right]_{${N}}^{\\infty} = ${eq(integralBound(c, p, N), answer)}`,
              ],
            ],
          ],
          telescopingBound(c, p, N, answer),
          [
            slip(
              Q.of(c, (p - 1) * (N + 1) ** (p - 1)),
              `This integrates from $${N + 1}$. That integral is smaller than the remainder, so it is a lower bound, not an upper one.`,
              `这里从 $${N + 1}$ 开始积分。这个积分比余项小，所以是下界，不是上界。`,
            ),
            slip(
              Q.of(c, N ** p),
              `This is the term $a_{${N}}$, the last term kept, not a bound for all the terms after it.`,
              `这是保留的最后一项 $a_{${N}}$，不是其后所有项之和的上界。`,
            ),
            slip(
              Q.of(c, N ** (p - 1)),
              `This leaves out the factor $\\frac{1}{${p - 1}}$ that the power rule gives for $x^{-${p}}$.`,
              `这里漏掉了幂法则对 $x^{-${p}}$ 给出的因子 $\\frac{1}{${p - 1}}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "terms-needed-for-an-accuracy",
      title: t("How many terms are needed", "需要多少项"),
      explanation: t(
        "To guarantee $R_N < \\varepsilon$, choose $N$ so that the bound is less than $\\varepsilon$:\n\n$$\\int_{N}^{\\infty} f(x) \\, dx < \\varepsilon$$\n\nFor $\\sum \\frac{1}{n^{2}}$ with $\\varepsilon = \\frac{1}{100}$, the bound is $\\frac{1}{N}$, and $\\frac{1}{N} < \\frac{1}{100}$ needs $N > 100$. So the smallest $N$ is $101$.\n\nCheck: at $N = 101$ the bound is $\\frac{1}{101} < \\frac{1}{100}$, while at $N = 100$ it is $\\frac{1}{100}$, not less.\n\n> **Watch out.** The inequality is strict. When the bound equals $\\varepsilon$ exactly, as at $N = 100$ here, that $N$ is not enough.",
        "要保证 $R_N < \\varepsilon$，就选 $N$ 使上界小于 $\\varepsilon$：\n\n$$\\int_{N}^{\\infty} f(x) \\, dx < \\varepsilon$$\n\n对 $\\sum \\frac{1}{n^{2}}$，$\\varepsilon = \\frac{1}{100}$，上界为 $\\frac{1}{N}$，而 $\\frac{1}{N} < \\frac{1}{100}$ 要求 $N > 100$。所以最小的 $N$ 是 $101$。\n\n检验：$N = 101$ 时上界为 $\\frac{1}{101} < \\frac{1}{100}$；$N = 100$ 时上界为 $\\frac{1}{100}$，并不小于 $\\frac{1}{100}$。\n\n> **注意。** 这是严格不等式。上界恰好等于 $\\varepsilon$ 时，例如这里的 $N = 100$，这个 $N$ 还不够。",
      ),
      generate(rng) {
        const p = rng.int(2, 3);
        const c = rng.int(1, 9);
        const m = rng.pick([10, 20, 50, 100, 200, 500, 1000]);
        // The bound c/((p − 1)N^{p−1}) is below 1/m exactly when c·m < (p − 1)N^{p−1}.
        let N = 1;
        while (c * m >= (p - 1) * N ** (p - 1)) N++;
        const bound = (n: number) => Q.of(c, (p - 1) * n ** (p - 1));
        const need = Q.of(c * m, 2);
        return worked(
          t(
            `Find the smallest $N$ for which the integral test remainder estimate guarantees $R_N < \\frac{1}{${m}}$ for $${sigma(`\\frac{${c}}{n^{${p}}}`)}$.`,
            `对 $${sigma(`\\frac{${c}}{n^{${p}}}`)}$，求使积分判别法的余项估计能保证 $R_N < \\frac{1}{${m}}$ 的最小 $N$。`,
          ),
          Q.of(N),
          [
            [
              ["Bound the remainder", "估计余项"],
              t("The remainder after $N$ terms is at most the integral from $N$:", "前 $N$ 项之后的余项不超过从 $N$ 开始的积分："),
              [`R_N \\le \\int_{N}^{\\infty} \\frac{${c}}{x^{${p}}} \\, dx = ${integralBound(c, p, "N")}`],
            ],
            [
              ["Solve for N", "解出 N"],
              t(`Make the bound less than $\\frac{1}{${m}}$:`, `令上界小于 $\\frac{1}{${m}}$：`),
              [
                p === 2
                  ? `\\frac{${c}}{N} < \\frac{1}{${m}} \\iff N > ${c * m}`
                  : `\\frac{${c}}{2N^{2}} < \\frac{1}{${m}} \\iff N^{2} > ${need.toLatex()} \\iff N > ${Number.isInteger(Math.sqrt((c * m) / 2)) ? Math.sqrt((c * m) / 2) : `${dec(Math.sqrt((c * m) / 2), 2)}\\ldots`}`,
              ],
            ],
            [
              ["Take the smallest integer", "取最小的整数"],
              t(`The smallest whole number that works is $N = ${N}$.`, `满足条件的最小整数是 $N = ${N}$。`),
            ],
          ],
          t(
            `Put the numbers back into the bound. At $N = ${N}$ it is $${bound(N).toLatex()} < \\frac{1}{${m}}$, while at $N = ${N - 1}$ it is $${bound(N - 1).toLatex()} \\ge \\frac{1}{${m}}$. So $${N}$ is the first that works.`,
            `把数代回上界。$N = ${N}$ 时上界为 $${bound(N).toLatex()} < \\frac{1}{${m}}$，而 $N = ${N - 1}$ 时上界为 $${bound(N - 1).toLatex()} \\ge \\frac{1}{${m}}$。所以 $${N}$ 是第一个满足条件的值。`,
          ),
          [
            slip(
              N - 1,
              `At $N = ${N - 1}$ the bound is $${bound(N - 1).toLatex()}$, which is not less than $\\frac{1}{${m}}$.`,
              `$N = ${N - 1}$ 时上界为 $${bound(N - 1).toLatex()}$，并不小于 $\\frac{1}{${m}}$。`,
            ),
            slip(
              N + 1,
              `This works, but $N = ${N}$ already does, so it is not the smallest.`,
              `这个值可以，但 $N = ${N}$ 已经满足，所以它不是最小的。`,
            ),
            slip(
              c * m,
              `This solves $N > ${c * m}$, leaving out the factor $\\frac{1}{2}$ and the square in the bound $\\frac{${c}}{2N^{2}}$.`,
              `这里解的是 $N > ${c * m}$，漏掉了上界 $\\frac{${c}}{2N^{2}}$ 中的因子 $\\frac{1}{2}$ 和平方。`,
            ),
          ],
        );
      },
    },
  ],
};

/** PowerForm is a term written with roots that equals 1/nᵖ, with the pieces it is made of. */
interface PowerForm {
  readonly tex: string;
  readonly p: Q;
  readonly work: string;
  readonly a: number;
  readonly e: Q;
  readonly under: boolean;
  readonly sixE: number;
}

/** powerForm picks a term such as 1/(n²√n) or ∛n/n² that is a power of n. */
function powerForm(rng: Rng): PowerForm {
  const a = rng.int(1, 5);
  const r = rng.int(2, 3);
  const b = rng.int(1, r === 2 ? 1 : 2);
  const root = r === 2 ? "\\sqrt{n}" : b === 1 ? "\\sqrt[3]{n}" : "\\sqrt[3]{n^{2}}";
  const e = Q.of(b, r);
  const sixE = (6 * b) / r;
  const na = a === 1 ? "n" : `n^{${a}}`;
  if (rng.bool()) {
    const p = Q.of(a).add(e);
    return {
      tex: `\\frac{1}{${na}${root}}`,
      p,
      work: `${na}${root} = ${na} \\cdot n^{${e.toLatex()}} = n^{${p.toLatex()}}`,
      a,
      e,
      under: true,
      sixE,
    };
  }
  const p = Q.of(a).sub(e);
  return {
    tex: `\\frac{${root}}{${na}}`,
    p,
    work: `\\frac{${root}}{${na}} = \\frac{n^{${e.toLatex()}}}{${na}} = \\frac{1}{n^{${p.toLatex()}}}`,
    a,
    e,
    under: false,
    sixE,
  };
}

/** atSixtyFour checks a power form by evaluating both sides at n = 64 = 2⁶, where every root is a power of 2. */
function atSixtyFour(f: PowerForm): Text {
  const six = 6 * f.a;
  const exp = f.under ? six + f.sixE : six - f.sixE;
  const rootValue = `2^{${f.sixE}}`;
  const left = f.under ? `\\frac{1}{2^{${six}} \\cdot ${rootValue}}` : `\\frac{${rootValue}}{2^{${six}}}`;
  return t(
    `Evaluate both forms at $n = 64 = 2^{6}$, where the root is $${rootValue}$. The term is $${left} = 2^{-${exp}}$, and $\\frac{1}{64^{p}} = 2^{-6p} = 2^{-6 \\cdot ${f.p.toLatex()}} = 2^{-${exp}}$. The two agree.`,
    `在 $n = 64 = 2^{6}$ 处计算两种写法，此时根式等于 $${rootValue}$。这一项为 $${left} = 2^{-${exp}}$，而 $\\frac{1}{64^{p}} = 2^{-6p} = 2^{-6 \\cdot ${f.p.toLatex()}} = 2^{-${exp}}$。两者一致。`,
  );
}

/** rootStep rewrites the root of a power form as a fractional power. */
const rootStep = (f: PowerForm): Step => [
  ["Write the root as a power", "把根式写成幂"],
  t(`A root is a fractional power: here the root is $n^{${f.e.toLatex()}}$.`, `根式是分数次幂：这里的根式是 $n^{${f.e.toLatex()}}$。`),
];

/** combineStep combines the powers of a power form. */
const combineStep = (f: PowerForm): Step => [
  ["Combine the powers", "合并幂"],
  f.under
    ? t("Powers multiplied together add their exponents:", "同底数幂相乘，指数相加：")
    : t("Dividing powers subtracts the exponents:", "同底数幂相除，指数相减："),
  [f.work],
];

/** harmonicSeriesAndPSeries: Σ 1/nᵖ converges exactly when p > 1. */
export const harmonicSeriesAndPSeries: TopicDef = {
  id: "harmonic-series-and-p-series",
  title: t("Harmonic Series and p-Series", "调和级数与 p 级数"),
  summary: t(
    "The p-series Σ 1/nᵖ converges when p > 1 and diverges when p ≤ 1; the harmonic series Σ 1/n diverges.",
    "p 级数 Σ 1/nᵖ 在 p > 1 时收敛，在 p ≤ 1 时发散；调和级数 Σ 1/n 发散。",
  ),
  intro: t(
    "Group the terms of the harmonic series $\\sum \\frac{1}{n}$ in blocks that double in length:\n\n$$1 + \\frac{1}{2} + \\left(\\frac{1}{3} + \\frac{1}{4}\\right) + \\left(\\frac{1}{5} + \\cdots + \\frac{1}{8}\\right) + \\cdots$$\n\nEach block adds at least $\\frac{1}{2}$, so $S_{2^{k}} \\ge 1 + \\frac{k}{2}$, and the partial sums grow without bound even though the terms tend to $0$.\n\nCheck: $S_4 = 1 + \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{4} = \\frac{25}{12} \\approx 2.08$, which is at least $1 + \\frac{2}{2} = 2$.\n\nIn this lesson we see exactly which powers $p$ make $\\sum \\frac{1}{n^{p}}$ converge, and recognize such series when they are written with roots.",
    "把调和级数 $\\sum \\frac{1}{n}$ 的各项按长度加倍的方式分组：\n\n$$1 + \\frac{1}{2} + \\left(\\frac{1}{3} + \\frac{1}{4}\\right) + \\left(\\frac{1}{5} + \\cdots + \\frac{1}{8}\\right) + \\cdots$$\n\n每组至少加上 $\\frac{1}{2}$，所以 $S_{2^{k}} \\ge 1 + \\frac{k}{2}$。尽管各项趋于 $0$，部分和仍无限增大。\n\n检验：$S_4 = 1 + \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{4} = \\frac{25}{12} \\approx 2.08$，至少为 $1 + \\frac{2}{2} = 2$。\n\n这节课我们弄清究竟哪些幂 $p$ 使 $\\sum \\frac{1}{n^{p}}$ 收敛，并识别用根式写出的这类级数。",
  ),
  prerequisites: ["the-integral-test"],
  encompasses: [{ topic: "the-integral-test", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "writing-terms-as-powers-of-n",
      title: t("Writing terms as powers of n", "把各项写成 n 的幂"),
      explanation: t(
        "A **p-series** is $\\sum_{n=1}^{\\infty} \\frac{1}{n^{p}}$. To recognize one, write roots as fractional powers and combine them:\n\n$$\\frac{1}{n\\sqrt{n}} = \\frac{1}{n^{1} \\cdot n^{1/2}} = \\frac{1}{n^{3/2}}$$\n\nSo $p = \\frac{3}{2}$. Likewise $\\frac{\\sqrt[3]{n}}{n^{2}} = \\frac{n^{1/3}}{n^{2}} = \\frac{1}{n^{5/3}}$, so $p = \\frac{5}{3}$.\n\nCheck: at $n = 4$, $\\frac{1}{4\\sqrt{4}} = \\frac{1}{8}$ and $\\frac{1}{4^{3/2}} = \\frac{1}{8}$ as well.\n\n> **Watch out.** A root in the numerator lowers the power: $\\frac{\\sqrt{n}}{n^{2}}$ has $p = 2 - \\frac{1}{2} = \\frac{3}{2}$, not $2 + \\frac{1}{2}$.",
        "**p 级数**是 $\\sum_{n=1}^{\\infty} \\frac{1}{n^{p}}$。要识别它，把根式写成分数指数再合并：\n\n$$\\frac{1}{n\\sqrt{n}} = \\frac{1}{n^{1} \\cdot n^{1/2}} = \\frac{1}{n^{3/2}}$$\n\n所以 $p = \\frac{3}{2}$。同样 $\\frac{\\sqrt[3]{n}}{n^{2}} = \\frac{n^{1/3}}{n^{2}} = \\frac{1}{n^{5/3}}$，所以 $p = \\frac{5}{3}$。\n\n检验：在 $n = 4$ 处，$\\frac{1}{4\\sqrt{4}} = \\frac{1}{8}$，而 $\\frac{1}{4^{3/2}}$ 也等于 $\\frac{1}{8}$。\n\n> **注意。** 分子里的根式使幂降低：$\\frac{\\sqrt{n}}{n^{2}}$ 的 $p = 2 - \\frac{1}{2} = \\frac{3}{2}$，而不是 $2 + \\frac{1}{2}$。",
      ),
      generate(rng) {
        const f = powerForm(rng);
        const swapped = f.under ? Q.of(f.a).sub(f.e) : Q.of(f.a).add(f.e);
        return worked(
          t(
            `The series $${sigma(f.tex)}$ is a $p$-series $${sigma("\\frac{1}{n^{p}}")}$. Find $p$.`,
            `级数 $${sigma(f.tex)}$ 是 $p$ 级数 $${sigma("\\frac{1}{n^{p}}")}$。求 $p$。`,
          ),
          f.p,
          [rootStep(f), combineStep(f), [["Read off p", "读出 p"], t(`So $p = ${f.p.toLatex()}$.`, `所以 $p = ${f.p.toLatex()}$。`)]],
          atSixtyFour(f),
          [
            slip(f.a, "This leaves the root out, as if it were not a power of $n$.", "这里把根式漏掉了，好像它不是 $n$ 的幂。"),
            slip(
              swapped,
              f.under
                ? "This subtracts the root's exponent, but the root is in the denominator with the other power, so the exponents add."
                : "This adds the root's exponent, but the root is in the numerator, so its exponent is subtracted from the denominator's.",
              f.under
                ? "这里减去了根式的指数，但根式和另一个幂一起在分母里，指数应当相加。"
                : "这里加上了根式的指数，但根式在分子里，它的指数应从分母的指数中减去。",
            ),
            slip(
              Q.of(f.a).mul(f.e),
              "This multiplies the exponents. Multiplying powers of $n$ adds exponents; only a power of a power multiplies them.",
              "这里把指数相乘了。$n$ 的幂相乘时指数相加，只有幂的幂才把指数相乘。",
            ),
            slip(
              f.p.neg(),
              "This is the exponent of $n$ in the term itself, $n^{-p}$, not $p$.",
              "这是这一项本身 $n^{-p}$ 中 $n$ 的指数，不是 $p$。",
            ),
          ],
        );
      },
    },
    {
      id: "convergence-of-p-series",
      title: t("Convergence of p-series", "p 级数的敛散性"),
      explanation: t(
        "By the integral test, compare with\n\n$$\\int_{1}^{\\infty} \\frac{dx}{x^{p}} = \\begin{cases} \\frac{1}{p - 1} & p > 1 \\\\ \\infty & p \\le 1 \\end{cases}$$\n\nSo the $p$-series **converges when $p > 1$** and **diverges when $p \\le 1$**. The case $p = 1$ is the **harmonic series** $\\sum \\frac{1}{n}$, which diverges even though its terms tend to $0$. For example, $\\sum \\frac{1}{\\sqrt{n}}$ has $p = \\frac{1}{2} \\le 1$, so it diverges.\n\nCheck: $\\frac{1}{\\sqrt{n}} \\ge \\frac{1}{n}$ for every $n$, so it lies above the divergent harmonic series and must diverge too.\n\n> **Watch out.** The boundary $p = 1$ diverges. Only powers strictly greater than $1$ give convergence.",
        "由积分判别法，与下面的积分比较：\n\n$$\\int_{1}^{\\infty} \\frac{dx}{x^{p}} = \\begin{cases} \\frac{1}{p - 1} & p > 1 \\\\ \\infty & p \\le 1 \\end{cases}$$\n\n所以 $p$ 级数**在 $p > 1$ 时收敛**，**在 $p \\le 1$ 时发散**。$p = 1$ 的情形是**调和级数** $\\sum \\frac{1}{n}$，尽管各项趋于 $0$，它仍然发散。例如 $\\sum \\frac{1}{\\sqrt{n}}$ 的 $p = \\frac{1}{2} \\le 1$，所以发散。\n\n检验：对每个 $n$ 都有 $\\frac{1}{\\sqrt{n}} \\ge \\frac{1}{n}$，它位于发散的调和级数之上，所以也必定发散。\n\n> **注意。** 边界 $p = 1$ 是发散的。只有严格大于 $1$ 的幂才收敛。",
      ),
      generate(rng) {
        const f = powerForm(rng);
        const c = rng.int(1, 9);
        const series = sigma(c === 1 ? f.tex : `${c} \\cdot ${f.tex}`);
        const converges = f.p.toNumber() > 1;
        const gap = f.p.sub(Q.one);
        return verdict(
          rng,
          series,
          converges,
          walked(
            [
              combineStep(f),
              [
                ["Compare p with 1", "把 p 与 1 比较"],
                t(
                  `This is a $p$-series with $p = ${f.p.toLatex()} ${converges ? ">" : "<"} 1$${c === 1 ? "" : `, multiplied by the constant $${c}$, which does not change convergence`}. So it ${converges ? "converges" : "diverges"}.`,
                  `这是 $p = ${f.p.toLatex()} ${converges ? ">" : "<"} 1$ 的 $p$ 级数${c === 1 ? "" : `，乘以常数 $${c}$ 不改变敛散性`}。所以它${converges ? "收敛" : "发散"}。`,
                ),
              ],
            ],
            converges
              ? t(
                  `Use the integral test directly: $\\int_{1}^{\\infty} x^{-${f.p.toLatex()}} \\, dx = \\left[\\frac{x^{-${gap.toLatex()}}}{-${gap.toLatex()}}\\right]_{1}^{\\infty} = \\frac{1}{${gap.toLatex()}}$. The integral is finite, so the series converges.`,
                  `直接用积分判别法：$\\int_{1}^{\\infty} x^{-${f.p.toLatex()}} \\, dx = \\left[\\frac{x^{-${gap.toLatex()}}}{-${gap.toLatex()}}\\right]_{1}^{\\infty} = \\frac{1}{${gap.toLatex()}}$，是有限值。所以级数收敛。`,
                )
              : t(
                  `Use the comparison test: since $p < 1$, $n^{p} \\le n$, so $\\frac{1}{n^{p}} \\ge \\frac{1}{n}$. The terms lie above those of the divergent harmonic series, so the series diverges.`,
                  `改用比较判别法：由于 $p < 1$，$n^{p} \\le n$，所以 $\\frac{1}{n^{p}} \\ge \\frac{1}{n}$。各项位于发散的调和级数各项之上，所以级数发散。`,
                ),
          ),
        );
      },
    },
  ],
};

/** ComparisonCase is a series settled by direct comparison, with the known series and a second route. */
interface ComparisonCase {
  readonly series: string;
  readonly converges: boolean;
  readonly bound: Text;
  readonly line: string;
  readonly known: Text;
  readonly check: Text;
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
      line: `0 < \\frac{${c}}{n^{2} + ${k}} < \\frac{${c}}{n^{2}}`,
      bound: t(`Making the denominator smaller makes the fraction larger:`, `分母变小，分数变大：`),
      known: t(
        `$\\sum \\frac{${c}}{n^{2}}$ is a multiple of the $p$-series with $p = 2 > 1$, so it converges.`,
        `$\\sum \\frac{${c}}{n^{2}}$ 是 $p = 2 > 1$ 的 $p$ 级数的倍数，所以收敛。`,
      ),
      check: t(
        `Use the limit comparison test with $\\frac{1}{n^{2}}$ instead: $\\frac{${c}/(n^{2} + ${k})}{1/n^{2}} = \\frac{${c}n^{2}}{n^{2} + ${k}} \\to ${c}$. This limit is positive and finite, so the series converges like $\\sum \\frac{1}{n^{2}}$.`,
        `改为与 $\\frac{1}{n^{2}}$ 作极限比较：$\\frac{${c}/(n^{2} + ${k})}{1/n^{2}} = \\frac{${c}n^{2}}{n^{2} + ${k}} \\to ${c}$，是正的有限值，所以级数与 $\\sum \\frac{1}{n^{2}}$ 一样收敛。`,
      ),
    };
  if (kind === 1)
    return {
      series: sigma(`\\frac{${k + 1} + \\cos n}{n}`),
      converges: false,
      line: `\\frac{${k + 1} + \\cos n}{n} \\ge \\frac{${k}}{n}`,
      bound: t(`Since $\\cos n \\ge -1$, the numerator is at least $${k}$:`, `由于 $\\cos n \\ge -1$，分子至少为 $${k}$：`),
      known: t(
        `$\\sum \\frac{${k}}{n}$ is a multiple of the harmonic series, so it diverges.`,
        `$\\sum \\frac{${k}}{n}$ 是调和级数的倍数，所以发散。`,
      ),
      check: t(
        `Group the terms instead. The $2^{m}$ terms from $n = 2^{m} + 1$ to $n = 2^{m+1}$ are each at least $\\frac{${k}}{2^{m+1}}$, so each group adds at least $\\frac{${k}}{2}$. The partial sums gain at least $\\frac{${k}}{2}$ again and again, so they grow without bound.`,
        `改为分组。从 $n = 2^{m} + 1$ 到 $n = 2^{m+1}$ 的 $2^{m}$ 项每项至少为 $\\frac{${k}}{2^{m+1}}$，所以每组至少加上 $\\frac{${k}}{2}$。部分和一次又一次地至少增加 $\\frac{${k}}{2}$，所以无限增大。`,
      ),
    };
  if (kind === 2) {
    const r = Q.of(1, k + 1).toLatex();
    return {
      series: sigma(`\\frac{${c}}{${k + 1}^{n} + ${k}}`),
      converges: true,
      line: `0 < \\frac{${c}}{${k + 1}^{n} + ${k}} < \\frac{${c}}{${k + 1}^{n}} = ${term(c, `\\left(${r}\\right)^{n}`)}`,
      bound: t(`Dropping the $+ ${k}$ makes the denominator smaller and the fraction larger:`, `去掉 $+ ${k}$，分母变小，分数变大：`),
      known: t(
        `$\\sum ${term(c, `\\left(${r}\\right)^{n}`)}$ is geometric with ratio $${r} < 1$, so it converges.`,
        `$\\sum ${term(c, `\\left(${r}\\right)^{n}`)}$ 是公比为 $${r} < 1$ 的等比级数，所以收敛。`,
      ),
      check: t(
        `Use the ratio test instead. Dividing top and bottom by $${k + 1}^{n+1}$ gives $\\frac{a_{n+1}}{a_n} = \\frac{${k + 1}^{n} + ${k}}{${k + 1}^{n+1} + ${k}} \\to ${r}$. The limit is less than $1$, so the series converges.`,
        `改用比值判别法：分子分母同除以 $${k + 1}^{n+1}$ 后，$\\frac{a_{n+1}}{a_n} = \\frac{${k + 1}^{n} + ${k}}{${k + 1}^{n+1} + ${k}} \\to ${r}$。极限小于 $1$，所以级数收敛。`,
      ),
    };
  }
  if (kind === 3)
    return {
      series: sigma(`\\frac{${k1(c)}\\ln n}{n}`, 3),
      converges: false,
      line: `\\frac{${k1(c)}\\ln n}{n} > \\frac{${c}}{n}`,
      bound: t(`For $n \\ge 3$, $\\ln n > 1$, so`, `当 $n \\ge 3$ 时 $\\ln n > 1$，所以`),
      known: t(
        `$\\sum \\frac{${c}}{n}$ is a multiple of the harmonic series, so it diverges.`,
        `$\\sum \\frac{${c}}{n}$ 是调和级数的倍数，所以发散。`,
      ),
      check: t(
        `Use the integral test instead. The terms decrease from $n = 3$ on, and the integral diverges: $\\int_{3}^{\\infty} \\frac{${k1(c)}\\ln x}{x} \\, dx = \\lim_{b \\to \\infty} \\left[\\frac{${c}}{2}(\\ln x)^{2}\\right]_{3}^{b} = \\infty$. So the series diverges too.`,
        `改用积分判别法。各项从 $n = 3$ 起递减，且 $\\int_{3}^{\\infty} \\frac{${k1(c)}\\ln x}{x} \\, dx = \\lim_{b \\to \\infty} \\left[\\frac{${c}}{2}(\\ln x)^{2}\\right]_{3}^{b} = \\infty$，所以级数发散。`,
      ),
    };
  return {
    series: sigma(`\\frac{\\sin^{2} n}{n^{2} + ${k}}`),
    converges: true,
    line: `0 \\le \\frac{\\sin^{2} n}{n^{2} + ${k}} \\le \\frac{1}{n^{2}}`,
    bound: t(
      `Since $0 \\le \\sin^{2} n \\le 1$ and $n^{2} + ${k} > n^{2}$,`,
      `由于 $0 \\le \\sin^{2} n \\le 1$，且 $n^{2} + ${k} > n^{2}$，`,
    ),
    known: t(
      "$\\sum \\frac{1}{n^{2}}$ is the $p$-series with $p = 2 > 1$, so it converges.",
      "$\\sum \\frac{1}{n^{2}}$ 是 $p = 2 > 1$ 的 $p$ 级数，所以收敛。",
    ),
    check: t(
      "Bound the partial sums directly. For $n \\ge 2$, $\\frac{1}{n^{2}} < \\frac{1}{n - 1} - \\frac{1}{n}$, and these differences telescope, so every partial sum is less than $1 + 1 = 2$. The terms are not negative, so the partial sums increase and stay below $2$: the series converges.",
      "直接估计部分和。当 $n \\ge 2$ 时，$\\frac{1}{n^{2}} < \\frac{1}{n - 1} - \\frac{1}{n}$，这些差裂项相消，所以每个部分和都小于 $1 + 1 = 2$。各项不为负，部分和递增且小于 $2$，所以级数收敛。",
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
  intro: t(
    "Each term of $\\sum \\frac{1}{2^{n} + 1}$ is smaller than the matching term of a geometric series:\n\n$$\\frac{1}{2^{n} + 1} < \\frac{1}{2^{n}}, \\qquad \\sum_{n=1}^{\\infty} \\frac{1}{2^{n}} = 1$$\n\nThe partial sums of the first series increase and stay below $1$, so it converges.\n\nCheck: $S_3 = \\frac{1}{3} + \\frac{1}{5} + \\frac{1}{9} = \\frac{29}{45} \\approx 0.64$, below the geometric partial sum $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} = \\frac{7}{8}$.\n\nIn this lesson we settle a series by placing its terms below a convergent series or above a divergent one.",
    "$\\sum \\frac{1}{2^{n} + 1}$ 的每一项都小于一个等比级数的对应项：\n\n$$\\frac{1}{2^{n} + 1} < \\frac{1}{2^{n}}, \\qquad \\sum_{n=1}^{\\infty} \\frac{1}{2^{n}} = 1$$\n\n第一个级数的部分和递增且小于 $1$，所以它收敛。\n\n检验：$S_3 = \\frac{1}{3} + \\frac{1}{5} + \\frac{1}{9} = \\frac{29}{45} \\approx 0.64$，小于等比级数的部分和 $\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} = \\frac{7}{8}$。\n\n这节课我们把级数的各项放在一个收敛级数之下或一个发散级数之上，从而判断它的敛散性。",
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
        "Suppose $0 \\le a_n \\le b_n$ for all $n$. Then\n\n$$\\sum b_n \\text{ converges} \\implies \\sum a_n \\text{ converges}, \\qquad \\sum a_n \\text{ diverges} \\implies \\sum b_n \\text{ diverges}$$\n\nCompare with a $p$-series or a geometric series. For example, $\\frac{1}{n^{2} + 5} < \\frac{1}{n^{2}}$, and $\\sum \\frac{1}{n^{2}}$ converges, so $\\sum \\frac{1}{n^{2} + 5}$ converges.\n\nCheck: $\\frac{1/(n^{2} + 5)}{1/n^{2}} = \\frac{n^{2}}{n^{2} + 5} \\to 1$, so the limit comparison test gives the same verdict.\n\n> **Watch out.** The inequality must point the useful way. Being smaller than a divergent series, or larger than a convergent one, proves nothing.",
        "设对所有 $n$ 有 $0 \\le a_n \\le b_n$。则\n\n$$\\sum b_n \\text{ 收敛} \\implies \\sum a_n \\text{ 收敛}, \\qquad \\sum a_n \\text{ 发散} \\implies \\sum b_n \\text{ 发散}$$\n\n通常与 $p$ 级数或等比级数比较。例如 $\\frac{1}{n^{2} + 5} < \\frac{1}{n^{2}}$，而 $\\sum \\frac{1}{n^{2}}$ 收敛，所以 $\\sum \\frac{1}{n^{2} + 5}$ 收敛。\n\n检验：$\\frac{1/(n^{2} + 5)}{1/n^{2}} = \\frac{n^{2}}{n^{2} + 5} \\to 1$，所以极限比较判别法给出同样的结论。\n\n> **注意。** 不等式的方向必须有用。比发散级数小，或比收敛级数大，什么也证明不了。",
      ),
      generate(rng) {
        const k = comparisonCase(rng);
        return verdict(
          rng,
          k.series,
          k.converges,
          walked(
            [
              [["Compare the terms", "比较各项"], k.bound, [k.line]],
              [["Settle the known series", "判断已知级数"], k.known],
              [
                ["Conclude", "得出结论"],
                k.converges
                  ? t(
                      "The terms lie below those of a convergent series, so by the comparison test the series converges.",
                      "各项位于一个收敛级数的各项之下，所以由比较判别法，级数收敛。",
                    )
                  : t(
                      "The terms lie above those of a divergent series, so by the comparison test the series diverges.",
                      "各项位于一个发散级数的各项之上，所以由比较判别法，级数发散。",
                    ),
              ],
            ],
            k.check,
          ),
          t("Use the comparison test.", "用比较判别法。"),
        );
      },
    },
    {
      id: "an-inequality-that-settles-it",
      title: t("An inequality that settles the question", "能下结论的不等式"),
      explanation: t(
        "A comparison settles the question only when it points the useful way:\n\n$$a_n \\le b_n,\\ \\sum b_n \\text{ converges} \\qquad \\text{or} \\qquad a_n \\ge b_n,\\ \\sum b_n \\text{ diverges}$$\n\nSo $\\frac{1}{n^{2} + 4} < \\frac{1}{n^{2}}$ proves convergence, while $\\frac{1}{n^{2} + 4} < \\frac{1}{n}$ proves nothing. Likewise $\\frac{n + 3}{n^{2}} > \\frac{1}{n}$ proves divergence.\n\nCheck: $\\frac{(n + 3)/n^{2}}{1/n} = \\frac{n + 3}{n} \\to 1$, so the limit comparison test also says $\\sum \\frac{n + 3}{n^{2}}$ diverges.\n\n> **Watch out.** $\\frac{n + 3}{n^{2}} \\le \\frac{4}{n}$ is true but useless: lying below a divergent series allows either outcome.",
        "只有方向有用的比较才能下结论：\n\n$$a_n \\le b_n,\\ \\sum b_n \\text{ 收敛} \\qquad \\text{或} \\qquad a_n \\ge b_n,\\ \\sum b_n \\text{ 发散}$$\n\n所以 $\\frac{1}{n^{2} + 4} < \\frac{1}{n^{2}}$ 能证明收敛，而 $\\frac{1}{n^{2} + 4} < \\frac{1}{n}$ 什么也证明不了。同样，$\\frac{n + 3}{n^{2}} > \\frac{1}{n}$ 能证明发散。\n\n检验：$\\frac{(n + 3)/n^{2}}{1/n} = \\frac{n + 3}{n} \\to 1$，所以极限比较判别法也说明 $\\sum \\frac{n + 3}{n^{2}}$ 发散。\n\n> **注意。** $\\frac{n + 3}{n^{2}} \\le \\frac{4}{n}$ 虽然成立却没有用：位于发散级数之下，两种结果都有可能。",
      ),
      generate(rng) {
        const s = rng.int(1, 9);
        const kind = rng.int(0, 3);
        const say = (ineq: string, b: string, conv: boolean, verdictConv: boolean) =>
          t(
            `$a_n ${ineq} ${b}$ and $\\sum ${b}$ ${conv ? "converges" : "diverges"}, so the series ${verdictConv ? "converges" : "diverges"}.`,
            `$a_n ${ineq} ${b}$，且 $\\sum ${b}$ ${conv ? "收敛" : "发散"}，所以级数${verdictConv ? "收敛" : "发散"}。`,
          );
        const toZero = {
          option: t("$a_n \\to 0$, so the series converges.", "$a_n \\to 0$，所以级数收敛。"),
          why: t(
            "Terms tending to $0$ never prove convergence: the terms of the harmonic series tend to $0$ and it diverges.",
            "各项趋于 $0$ 从来不能证明收敛：调和级数的各项趋于 $0$，但它发散。",
          ),
        };
        if (kind < 2) {
          const p = rng.int(2, 4);
          const k = rng.int(2, 6);
          const a = kind === 0 ? `\\frac{1}{n^{${p}} + ${s}}` : `\\frac{1}{${k}^{n} + ${s}}`;
          const b = kind === 0 ? `\\frac{1}{n^{${p}}}` : `\\left(\\frac{1}{${k}}\\right)^{n}`;
          const known =
            kind === 0
              ? t(
                  `$\\sum ${b}$ is a $p$-series with $p = ${p} > 1$, so it converges.`,
                  `$\\sum ${b}$ 是 $p = ${p} > 1$ 的 $p$ 级数，所以收敛。`,
                )
              : t(
                  `$\\sum ${b}$ is geometric with ratio $\\frac{1}{${k}} < 1$, so it converges.`,
                  `$\\sum ${b}$ 是公比为 $\\frac{1}{${k}} < 1$ 的等比级数，所以收敛。`,
                );
          return explainedChoice(rng, {
            prompt: t(`Which reasoning correctly decides whether $${sigma(a)}$ converges?`, `哪种推理能正确判断 $${sigma(a)}$ 是否收敛？`),
            correct: say("<", b, true, true),
            wrong: [
              {
                option: say("<", "\\frac{1}{n}", false, false),
                why: t(
                  "Lying below a divergent series allows either outcome, so it does not prove divergence.",
                  "位于发散级数之下，两种结果都有可能，所以不能证明发散。",
                ),
              },
              {
                option: say("<", "\\frac{1}{n}", false, true),
                why: t(
                  "Lying below a divergent series proves nothing, so the conclusion does not follow.",
                  "位于发散级数之下什么也证明不了，所以结论推不出来。",
                ),
              },
              toZero,
            ],
            solution: walked(
              [
                [
                  ["Pick the comparison series", "选取比较级数"],
                  t(`Dropping the $+ ${s}$ makes the denominator smaller and the fraction larger:`, `去掉 $+ ${s}$，分母变小，分数变大：`),
                  [`${a} < ${b}`],
                ],
                [
                  ["Check the direction", "检查方向"],
                  t(
                    `${known.en} The terms lie below a convergent series, so the series converges.`,
                    `${known["zh-CN"]}各项位于一个收敛级数之下，所以级数收敛。`,
                  ),
                ],
              ],
              t(
                `Use the limit comparison test with the same $b_n$: $\\frac{a_n}{b_n} = \\frac{${kind === 0 ? `n^{${p}}` : `${k}^{n}`}}{${kind === 0 ? `n^{${p}}` : `${k}^{n}`} + ${s}} \\to 1$. This limit is positive and finite, so $\\sum a_n$ converges like $\\sum b_n$.`,
                `用同一个 $b_n$ 作极限比较：$\\frac{a_n}{b_n} = \\frac{${kind === 0 ? `n^{${p}}` : `${k}^{n}`}}{${kind === 0 ? `n^{${p}}` : `${k}^{n}`} + ${s}} \\to 1$，是正的有限值，所以 $\\sum a_n$ 与 $\\sum b_n$ 一样收敛。`,
              ),
            ),
          });
        }
        const a = kind === 2 ? `\\frac{n + ${s}}{n^{2}}` : `\\frac{\\sqrt{n} + ${s}}{n}`;
        const b = kind === 2 ? "\\frac{1}{n}" : "\\frac{1}{\\sqrt{n}}";
        const upper = kind === 2 ? `\\frac{${s + 1}}{n}` : `\\frac{${s + 1}}{\\sqrt{n}}`;
        const known =
          kind === 2
            ? t("$\\sum \\frac{1}{n}$ is the harmonic series, so it diverges.", "$\\sum \\frac{1}{n}$ 是调和级数，所以发散。")
            : t(
                "$\\sum \\frac{1}{\\sqrt{n}}$ is a $p$-series with $p = \\frac{1}{2} \\le 1$, so it diverges.",
                "$\\sum \\frac{1}{\\sqrt{n}}$ 是 $p = \\frac{1}{2} \\le 1$ 的 $p$ 级数，所以发散。",
              );
        return explainedChoice(rng, {
          prompt: t(`Which reasoning correctly decides whether $${sigma(a)}$ converges?`, `哪种推理能正确判断 $${sigma(a)}$ 是否收敛？`),
          correct: say(">", b, false, false),
          wrong: [
            {
              option: say("\\le", upper, false, false),
              why: t(
                "The inequality is true, but lying below a divergent series allows either outcome, so it proves nothing.",
                "这个不等式成立，但位于发散级数之下两种结果都有可能，所以什么也证明不了。",
              ),
            },
            toZero,
            {
              option: t("The terms decrease, so the series converges.", "各项递减，所以级数收敛。"),
              why: t(
                "Decreasing terms alone prove nothing: the terms of the harmonic series decrease and it diverges.",
                "仅有各项递减什么也证明不了：调和级数的各项递减，但它发散。",
              ),
            },
          ],
          solution: walked(
            [
              [
                ["Pick the comparison series", "选取比较级数"],
                t(`Dropping the $+ ${s}$ in the numerator makes the fraction smaller:`, `去掉分子中的 $+ ${s}$，分数变小：`),
                [`${a} > ${kind === 2 ? "\\frac{n}{n^{2}}" : "\\frac{\\sqrt{n}}{n}"} = ${b}`],
              ],
              [
                ["Check the direction", "检查方向"],
                t(
                  `${known.en} The terms lie above a divergent series, so the series diverges.`,
                  `${known["zh-CN"]}各项位于一个发散级数之上，所以级数发散。`,
                ),
              ],
            ],
            t(
              `Use the limit comparison test with the same $b_n$: $\\frac{a_n}{b_n} = \\frac{${kind === 2 ? "n" : "\\sqrt{n}"} + ${s}}{${kind === 2 ? "n" : "\\sqrt{n}"}} \\to 1$. This limit is positive and finite, so $\\sum a_n$ diverges like $\\sum b_n$.`,
              `用同一个 $b_n$ 作极限比较：$\\frac{a_n}{b_n} = \\frac{${kind === 2 ? "n" : "\\sqrt{n}"} + ${s}}{${kind === 2 ? "n" : "\\sqrt{n}"}} \\to 1$，是正的有限值，所以 $\\sum a_n$ 与 $\\sum b_n$ 一样发散。`,
            ),
          ),
        });
      },
    },
  ],
};

/** RationalTerm is a quotient (p·nᵃ + q)/(r·nᵇ + s) that behaves like (p/r)/nᵈ with d = b − a. */
interface RationalTerm {
  readonly tex: string;
  readonly ratio: Q;
  readonly d: number;
  readonly a: number;
  readonly b: number;
  readonly p: number;
  readonly q: number;
  readonly r: number;
  readonly s: number;
}

/** pw writes nᵏ, leaving out n⁰ and the exponent 1. */
const pw = (k: number) => (k === 0 ? "" : k === 1 ? "n" : `n^{${k}}`);

/** rationalTerm picks (p·nᵃ + q)/(r·nᵇ + s) with b > a. */
function rationalTerm(rng: Rng): RationalTerm {
  const a = rng.int(0, 2);
  const d = rng.int(1, 3);
  const b = a + d;
  const p = rng.int(1, 9);
  const r = rng.int(1, 9);
  const q = a === 0 ? 0 : rng.int(1, 9);
  const s = rng.int(1, 9);
  const top = a === 0 ? `${p}` : poly([p, pw(a)], [q, ""]);
  const bottom = poly([r, pw(b)], [s, ""]);
  return { tex: `\\frac{${top}}{${bottom}}`, ratio: Q.of(p, r), d, a, b, p, q, r, s };
}

/** compareWith writes the p-series term 1/nᵈ. */
const compareWith = (d: number) => (d === 1 ? "\\frac{1}{n}" : `\\frac{1}{n^{${d}}}`);

/** ratioOfTerms writes aₙ/bₙ = nᵈ·aₙ as one fraction. */
const ratioOfTerms = (x: RationalTerm) => `\\frac{${poly([x.p, pw(x.b)], [x.q, pw(x.d)])}}{${poly([x.r, pw(x.b)], [x.s, ""])}}`;

/** theLimitComparisonTest compares the growth of terms through the limit of their ratio. */
export const theLimitComparisonTest: TopicDef = {
  id: "the-limit-comparison-test",
  title: t("The Limit Comparison Test", "极限比较判别法"),
  summary: t(
    "If aₙ, bₙ > 0 and aₙ/bₙ → L with 0 < L < ∞, then Σaₙ and Σbₙ both converge or both diverge.",
    "若 aₙ, bₙ > 0 且 aₙ/bₙ → L，0 < L < ∞，则 Σaₙ 与 Σbₙ 同时收敛或同时发散。",
  ),
  intro: t(
    "The terms of $\\sum \\frac{1}{2n - 1}$ are larger than $\\frac{1}{2n}$, but compare them with $\\frac{1}{n}$ through a limit:\n\n$$\\frac{1/(2n - 1)}{1/n} = \\frac{n}{2n - 1} \\to \\frac{1}{2}$$\n\nFar out, each term is about half of $\\frac{1}{n}$, so the series behaves like half the harmonic series and diverges.\n\nCheck: directly, $\\frac{1}{2n - 1} > \\frac{1}{2n}$, and $\\sum \\frac{1}{2n} = \\frac{1}{2} \\sum \\frac{1}{n}$ diverges, so the comparison test agrees.\n\nIn this lesson we compare two series through the limit of the ratio of their terms, which works even when a plain inequality points the wrong way.",
    "$\\sum \\frac{1}{2n - 1}$ 的各项大于 $\\frac{1}{2n}$，不过可以通过极限把它们与 $\\frac{1}{n}$ 比较：\n\n$$\\frac{1/(2n - 1)}{1/n} = \\frac{n}{2n - 1} \\to \\frac{1}{2}$$\n\n很靠后的每一项约为 $\\frac{1}{n}$ 的一半，所以级数表现得像调和级数的一半，发散。\n\n检验：直接看，$\\frac{1}{2n - 1} > \\frac{1}{2n}$，而 $\\sum \\frac{1}{2n} = \\frac{1}{2} \\sum \\frac{1}{n}$ 发散，所以比较判别法给出同样的结论。\n\n这节课我们通过两级数各项之比的极限来比较它们，即使普通不等式的方向不对也能用。",
  ),
  prerequisites: ["the-comparison-test"],
  encompasses: [{ topic: "the-comparison-test", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-limit-of-the-ratio",
      title: t("The limit of the ratio", "比值的极限"),
      explanation: t(
        "For a rational term, compare with $b_n = \\frac{1}{n^{d}}$, where $d$ is the degree of the denominator minus the degree of the numerator. Then $\\frac{a_n}{b_n} = n^{d} a_n$ has numerator and denominator of the same degree, and tends to the ratio of the leading coefficients. For $a_n = \\frac{3n + 1}{2n^{3} + 5}$ and $b_n = \\frac{1}{n^{2}}$:\n\n$$\\frac{a_n}{b_n} = \\frac{3n^{3} + n^{2}}{2n^{3} + 5} \\to \\frac{3}{2}$$\n\nCheck: at $n = 1000$ the ratio is $\\frac{3\\,001\\,000\\,000}{2\\,000\\,000\\,005} \\approx 1.5005$, close to $1.5$.\n\n> **Watch out.** The ratio is $\\frac{a_n}{b_n}$, not $\\frac{b_n}{a_n}$. Upside down it tends to $\\frac{2}{3}$; either way the limit is positive and finite, but the value asked for is $\\frac{3}{2}$.",
        "对有理式的项，与 $b_n = \\frac{1}{n^{d}}$ 比较，其中 $d$ 是分母次数减去分子次数。这时 $\\frac{a_n}{b_n} = n^{d} a_n$ 的分子分母次数相同，趋于首项系数之比。对 $a_n = \\frac{3n + 1}{2n^{3} + 5}$，$b_n = \\frac{1}{n^{2}}$：\n\n$$\\frac{a_n}{b_n} = \\frac{3n^{3} + n^{2}}{2n^{3} + 5} \\to \\frac{3}{2}$$\n\n检验：在 $n = 1000$ 处，这个比值为 $\\frac{3\\,001\\,000\\,000}{2\\,000\\,000\\,005} \\approx 1.5005$，接近 $1.5$。\n\n> **注意。** 比值是 $\\frac{a_n}{b_n}$，不是 $\\frac{b_n}{a_n}$。倒过来它趋于 $\\frac{2}{3}$；两者都是正的有限值，但所求的值是 $\\frac{3}{2}$。",
      ),
      generate(rng) {
        const x = rationalTerm(rng);
        const b = compareWith(x.d);
        const at = (x.p + x.q * 1000 ** (x.d - x.b)) / (x.r + x.s * 1000 ** -x.b);
        return worked(
          t(
            `To compare $${sigma(x.tex)}$ with $${sigma(b)}$, find $\\lim_{n \\to \\infty} \\frac{a_n}{b_n}$, where $a_n = ${x.tex}$ and $b_n = ${b}$.`,
            `为了比较 $${sigma(x.tex)}$ 与 $${sigma(b)}$，求 $\\lim_{n \\to \\infty} \\frac{a_n}{b_n}$，其中 $a_n = ${x.tex}$，$b_n = ${b}$。`,
          ),
          x.ratio,
          [
            [
              ["Form the ratio", "写出比值"],
              t(`Dividing by $${b}$ multiplies by $${pw(x.d)}$:`, `除以 $${b}$ 就是乘以 $${pw(x.d)}$：`),
              [`\\frac{a_n}{b_n} = ${pw(x.d)} \\cdot ${x.tex} = ${ratioOfTerms(x)}`],
            ],
            [
              ["Take the limit", "取极限"],
              t(
                `The numerator and the denominator both have degree $${x.b}$, so the limit is the ratio of the leading coefficients:`,
                `分子分母次数都是 $${x.b}$，所以极限是首项系数之比：`,
              ),
              [`\\lim_{n \\to \\infty} \\frac{a_n}{b_n} = ${x.r === 1 ? x.ratio.toLatex() : eq(`\\frac{${x.p}}{${x.r}}`, x.ratio)}`],
            ],
          ],
          t(
            `Evaluate the ratio far out: at $n = 1000$ it is about $${dec(at, 4)}$, close to $${x.ratio.toLatex()} \\approx ${dec(x.ratio.toNumber(), 4)}$.`,
            `在很靠后的位置计算这个比值：在 $n = 1000$ 处它约为 $${dec(at, 4)}$，接近 $${x.ratio.toLatex()} \\approx ${dec(x.ratio.toNumber(), 4)}$。`,
          ),
          [
            slip(
              Q.of(x.r, x.p),
              "This is the limit of $\\frac{b_n}{a_n}$: the ratio is upside down.",
              "这是 $\\frac{b_n}{a_n}$ 的极限：比值倒过来了。",
            ),
            slip(
              0,
              "This is the limit of $a_n$ alone. Dividing by $b_n$ is what keeps the limit from being $0$.",
              "这是 $a_n$ 本身的极限。正是除以 $b_n$ 才使极限不为 $0$。",
            ),
            slip(
              1,
              "This ignores the leading coefficients: the limit is their ratio, not $1$.",
              "这里忽略了首项系数：极限是它们之比，而不是 $1$。",
            ),
          ],
        );
      },
    },
    {
      id: "deciding-convergence-with-the-limit-comparison-test",
      title: t("Deciding convergence with the limit comparison test", "用极限比较判别法判断敛散性"),
      explanation: t(
        "When $\\frac{a_n}{b_n} \\to L$ with $0 < L < \\infty$, the terms are eventually between $\\frac{L}{2} b_n$ and $2L b_n$, so\n\n$$\\sum a_n \\text{ and } \\sum b_n \\text{ both converge or both diverge}$$\n\nThis settles cases the plain comparison test cannot. $\\frac{1}{n^{2} - 3}$ is larger than $\\frac{1}{n^{2}}$, but $\\frac{1/(n^{2} - 3)}{1/n^{2}} = \\frac{n^{2}}{n^{2} - 3} \\to 1$, so $\\sum_{n=2}^{\\infty} \\frac{1}{n^{2} - 3}$ converges.\n\nCheck: for $n \\ge 3$, $n^{2} - 3 \\ge \\frac{n^{2}}{2}$, so $\\frac{1}{n^{2} - 3} \\le \\frac{2}{n^{2}}$, and the plain comparison test gives convergence too.\n\n> **Watch out.** The limit must be positive and finite. A limit of $0$ or $\\infty$ only works in one direction and can leave the question open.",
        "当 $\\frac{a_n}{b_n} \\to L$ 且 $0 < L < \\infty$ 时，各项最终介于 $\\frac{L}{2} b_n$ 与 $2L b_n$ 之间，所以\n\n$$\\sum a_n \\text{ 与 } \\sum b_n \\text{ 同时收敛或同时发散}$$\n\n这能解决普通比较判别法处理不了的情形。$\\frac{1}{n^{2} - 3}$ 比 $\\frac{1}{n^{2}}$ 大，但 $\\frac{1/(n^{2} - 3)}{1/n^{2}} = \\frac{n^{2}}{n^{2} - 3} \\to 1$，所以 $\\sum_{n=2}^{\\infty} \\frac{1}{n^{2} - 3}$ 收敛。\n\n检验：当 $n \\ge 3$ 时 $n^{2} - 3 \\ge \\frac{n^{2}}{2}$，所以 $\\frac{1}{n^{2} - 3} \\le \\frac{2}{n^{2}}$，普通比较判别法也给出收敛。\n\n> **注意。** 极限必须是正的有限值。极限为 $0$ 或 $\\infty$ 时只在一个方向上有用，可能无法下结论。",
      ),
      generate(rng) {
        const x = rationalTerm(rng);
        const converges = x.d > 1;
        const b = compareWith(x.d);
        const check = converges
          ? t(
              `Compare directly instead. Making the numerator larger and dropping the $+ ${x.s}$ below gives $a_n \\le \\frac{${x.p + x.q}}{${term(x.r, pw(x.d))}}$, a multiple of the convergent $\\sum ${b}$. So the comparison test also gives convergence.`,
              `改为直接比较。把分子放大并去掉分母中的 $+ ${x.s}$，得 $a_n \\le \\frac{${x.p + x.q}}{${term(x.r, pw(x.d))}}$，是收敛级数 $\\sum ${b}$ 的倍数。所以比较判别法也给出收敛。`,
            )
          : t(
              `Compare directly instead. Since $${pw(x.b)} \\ge 1$, the denominator is at most $${x.r + x.s}${pw(x.b)}$, ${x.q === 0 ? "so" : `and dropping $+ ${x.q}$ makes the numerator smaller, so`} $a_n \\ge \\frac{${x.p}}{${x.r + x.s}n}$, a multiple of the divergent harmonic series. So the comparison test also gives divergence.`,
              `改为直接比较。由于 $${pw(x.b)} \\ge 1$，分母至多为 $${x.r + x.s}${pw(x.b)}$${x.q === 0 ? "" : `，去掉 $+ ${x.q}$ 使分子变小`}，所以 $a_n \\ge \\frac{${x.p}}{${x.r + x.s}n}$，是发散的调和级数的倍数。所以比较判别法也给出发散。`,
            );
        return verdict(
          rng,
          sigma(x.tex),
          converges,
          walked(
            [
              [
                ["Choose the comparison series", "选取比较级数"],
                t(
                  `The degrees differ by $${x.b} - ${x.a} = ${x.d}$, so compare with $b_n = ${b}$.`,
                  `次数相差 $${x.b} - ${x.a} = ${x.d}$，所以与 $b_n = ${b}$ 比较。`,
                ),
              ],
              [
                ["Find the limit", "求极限"],
                t("The ratio tends to the ratio of the leading coefficients:", "比值趋于首项系数之比："),
                [`\\frac{a_n}{b_n} = ${ratioOfTerms(x)} \\to ${x.ratio.toLatex()}`],
              ],
              [
                ["Conclude", "得出结论"],
                t(
                  `The limit is positive and finite, and $\\sum ${b}$ ${converges ? `converges ($p = ${x.d} > 1$)` : "diverges (harmonic)"}, so the series ${converges ? "converges" : "diverges"} too.`,
                  `极限是正的有限值，且 $\\sum ${b}$ ${converges ? `收敛（$p = ${x.d} > 1$）` : "发散（调和级数）"}，所以原级数也${converges ? "收敛" : "发散"}。`,
                ),
              ],
            ],
            check,
          ),
          t("Use the limit comparison test.", "用极限比较判别法。"),
        );
      },
    },
  ],
};

/** AlternatingCase is an alternating series Σ(−1)ⁿbₙ with its value of bₙ at n and whether it converges. */
interface AlternatingCase {
  readonly b: string;
  readonly at: (n: number) => number;
  readonly converges: boolean;
  readonly decrease: Text;
  readonly limit: string;
  readonly check?: Text;
}

/** alternatingCase picks bₙ for Σ(−1)ⁿbₙ. */
function alternatingCase(rng: Rng): AlternatingCase {
  const c = rng.int(1, 9);
  const k = rng.int(1, 9);
  const kind = rng.int(0, 4);
  const grows = t(
    "The denominator increases with $n$ and the numerator is fixed, so $b_n$ is positive and decreasing.",
    "分母随 $n$ 增大而分子固定，所以 $b_n$ 为正且递减。",
  );
  if (kind === 0) return { b: `\\frac{${c}}{${shift(k)}}`, at: (n) => c / (n + k), converges: true, decrease: grows, limit: "0" };
  if (kind === 1)
    return { b: `\\frac{${c}}{\\sqrt{${shift(k)}}}`, at: (n) => c / Math.sqrt(n + k), converges: true, decrease: grows, limit: "0" };
  if (kind === 2)
    return { b: `\\frac{${c}}{\\ln(${shift(k + 1)})}`, at: (n) => c / Math.log(n + k + 1), converges: true, decrease: grows, limit: "0" };
  if (kind === 3)
    return {
      b: `\\frac{${term(c, "n")}}{${shift(k)}}`,
      at: (n) => (c * n) / (n + k),
      converges: false,
      decrease: t("Divide the numerator and the denominator by $n$:", "分子分母同除以 $n$："),
      limit: `${c}`,
      check: t(
        `Look at a term far out. It is close to $${c}$: $b_{1000} = \\frac{${1000 * c}}{${1000 + k}} \\approx ${dec((1000 * c) / (1000 + k), 3)}$. The terms $(-1)^{n} b_n$ keep jumping between about $${c}$ and $-${c}$, so the partial sums cannot settle.`,
        `看一个很靠后的项：$b_{1000} = \\frac{${1000 * c}}{${1000 + k}} \\approx ${dec((1000 * c) / (1000 + k), 3)}$，接近 $${c}$。各项 $(-1)^{n} b_n$ 一直在约 $${c}$ 与 $-${c}$ 之间跳动，所以部分和不会稳定下来。`,
      ),
    };
  return {
    b: `\\frac{${k + 1}^{n}}{${term(c, "n^{2}")}}`,
    at: (n) => (k + 1) ** n / (c * n * n),
    converges: false,
    decrease: t("An exponential grows faster than any power of $n$:", "指数函数比 $n$ 的任何幂增长得都快："),
    limit: "\\infty",
    check: t(
      `Use the ratio of consecutive sizes instead: $\\frac{b_{n+1}}{b_n} = ${k + 1} \\cdot \\frac{n^{2}}{(n + 1)^{2}} \\to ${k + 1} > 1$. So the sizes eventually grow by a factor near $${k + 1}$ each step and cannot tend to $0$.`,
      `改用相邻两项大小之比：$\\frac{b_{n+1}}{b_n} = ${k + 1} \\cdot \\frac{n^{2}}{(n + 1)^{2}} \\to ${k + 1} > 1$。所以各项大小最终每一步都放大约 $${k + 1}$ 倍，不可能趋于 $0$。`,
    ),
  };
}

/** partialSums checks a convergent alternating series by its first four partial sums. */
function partialSums(x: AlternatingCase): Text {
  let total = 0;
  const sums: string[] = [];
  for (let n = 1; n <= 4; n++) {
    total += (-1) ** n * x.at(n);
    sums.push(dec(total));
  }
  return t(
    `Compute the first partial sums: $S_1 \\approx ${sums[0]}$, $S_2 \\approx ${sums[1]}$, $S_3 \\approx ${sums[2]}$, $S_4 \\approx ${sums[3]}$. They move down and up by shrinking steps, each new sum landing between the two before it, so they close in on one value.`,
    `计算前几个部分和：$S_1 \\approx ${sums[0]}$，$S_2 \\approx ${sums[1]}$，$S_3 \\approx ${sums[2]}$，$S_4 \\approx ${sums[3]}$。它们以越来越小的步子上下摆动，每个新的和都落在前两个之间，所以逼近同一个值。`,
  );
}

/** theAlternatingSeriesTest: alternating terms that shrink to 0 give a convergent series. */
export const theAlternatingSeriesTest: TopicDef = {
  id: "the-alternating-series-test",
  title: t("The Alternating Series Test", "交错级数判别法"),
  summary: t("If bₙ > 0 is decreasing and bₙ → 0, then Σ(−1)ⁿbₙ converges.", "若 bₙ > 0 递减且 bₙ → 0，则 Σ(−1)ⁿbₙ 收敛。"),
  intro: t(
    "The alternating harmonic series $1 - \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{4} + \\cdots$ steps forward and back by shrinking amounts. Its partial sums are\n\n$$1, \\quad \\frac{1}{2}, \\quad \\frac{5}{6}, \\quad \\frac{7}{12}, \\quad \\ldots$$\n\nEach step is smaller than the one before, so the sums close in on a limit, which is $\\ln 2 \\approx 0.693$.\n\nCheck: the sums lie alternately above and below $0.693$: $1 > 0.693$, $0.5 < 0.693$, $0.833 > 0.693$, $0.583 < 0.693$.\n\nIn this lesson we use the alternating series test, which proves convergence for series whose signs alternate and whose sizes shrink to $0$.",
    "交错调和级数 $1 - \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{4} + \\cdots$ 以越来越小的步子前进又后退。它的部分和为\n\n$$1, \\quad \\frac{1}{2}, \\quad \\frac{5}{6}, \\quad \\frac{7}{12}, \\quad \\ldots$$\n\n每一步都比前一步小，所以部分和逼近一个极限，即 $\\ln 2 \\approx 0.693$。\n\n检验：这些和交替位于 $0.693$ 的上方和下方：$1 > 0.693$，$0.5 < 0.693$，$0.833 > 0.693$，$0.583 < 0.693$。\n\n这节课我们使用交错级数判别法：符号交替且大小趋于 $0$ 的级数是收敛的。",
  ),
  prerequisites: ["the-nth-term-test-for-divergence", "monotonic-sequences"],
  encompasses: [{ topic: "the-nth-term-test-for-divergence", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "applying-the-alternating-series-test",
      title: t("Applying the alternating series test", "应用交错级数判别法"),
      explanation: t(
        "An **alternating series** has the form $\\sum (-1)^{n} b_n$ with $b_n > 0$. The test says\n\n$$b_n \\text{ decreasing and } b_n \\to 0 \\implies \\sum (-1)^{n} b_n \\text{ converges}$$\n\nThe partial sums step back and forth by ever smaller amounts and close in on a limit. If $b_n$ does not tend to $0$, the series diverges by the $n$th term test. For example, $\\sum \\frac{(-1)^{n}}{n}$ converges, though $\\sum \\frac{1}{n}$ does not.\n\nCheck: its partial sums $-1, -0.5, -0.833, -0.583$ swing by shrinking amounts around $-\\ln 2 \\approx -0.693$.\n\n> **Watch out.** The test never proves divergence. If $b_n$ tends to $0$ but does not decrease, the test simply does not apply, and another argument is needed.",
        "**交错级数**的形式为 $\\sum (-1)^{n} b_n$，其中 $b_n > 0$。判别法说\n\n$$b_n \\text{ 递减且 } b_n \\to 0 \\implies \\sum (-1)^{n} b_n \\text{ 收敛}$$\n\n部分和来回摆动且幅度越来越小，逼近一个极限。若 $b_n$ 不趋于 $0$，由第 $n$ 项判别法级数发散。例如 $\\sum \\frac{(-1)^{n}}{n}$ 收敛，而 $\\sum \\frac{1}{n}$ 发散。\n\n检验：它的部分和 $-1, -0.5, -0.833, -0.583$ 围绕 $-\\ln 2 \\approx -0.693$ 摆动，幅度越来越小。\n\n> **注意。** 这个判别法从来不能证明发散。若 $b_n$ 趋于 $0$ 但不递减，判别法就不适用，需要别的论证。",
      ),
      generate(rng) {
        const x = alternatingCase(rng);
        const parts: Step[] = x.converges
          ? [
              [["Check that the sizes decrease", "检查大小递减"], x.decrease],
              [
                ["Check the limit", "检查极限"],
                t("The denominator grows without bound, so", "分母无限增大，所以"),
                [`\\lim_{n \\to \\infty} ${x.b} = 0`],
              ],
              [
                ["Conclude", "得出结论"],
                t(
                  "Both conditions hold, so by the alternating series test the series converges.",
                  "两个条件都满足，所以由交错级数判别法，级数收敛。",
                ),
              ],
            ]
          : [
              [["Find the limit of the sizes", "求大小的极限"], x.decrease, [`\\lim_{n \\to \\infty} ${x.b} = ${x.limit}`]],
              [
                ["Conclude", "得出结论"],
                t(
                  `Since $b_n \\to ${x.limit}$, the terms $(-1)^{n} b_n$ do not tend to $0$, so the series diverges by the $n$th term test.`,
                  `由于 $b_n \\to ${x.limit}$，各项 $(-1)^{n} b_n$ 不趋于 $0$，所以由第 $n$ 项判别法，级数发散。`,
                ),
              ],
            ];
        return verdict(rng, sigma(`(-1)^{n} ${x.b}`), x.converges, walked(parts, x.check ?? partialSums(x)));
      },
    },
    {
      id: "terms-that-decrease-eventually",
      title: t("Terms that decrease only eventually", "最终才递减的项"),
      explanation: t(
        "The alternating series test only needs $b_n$ to decrease from some point on, since the first few terms do not affect convergence. For $b_n = \\frac{n}{n^{2} + 10}$, take $f(x) = \\frac{x}{x^{2} + 10}$:\n\n$$f'(x) = \\frac{10 - x^{2}}{(x^{2} + 10)^{2}} < 0 \\text{ for } x > \\sqrt{10}$$\n\nSo $b_n$ rises until $n = 3$ and then falls to $0$, and $\\sum (-1)^{n} \\frac{n}{n^{2} + 10}$ converges.\n\nCheck: $b_3 = \\frac{3}{19} \\approx 0.158$, $b_4 = \\frac{4}{26} \\approx 0.154$, $b_5 = \\frac{5}{35} \\approx 0.143$, falling from $n = 3$ on.\n\n> **Watch out.** Check $b_n \\to 0$ separately. $\\frac{n^{2}}{n^{2} + 10}$ eventually behaves well in every other way, but it tends to $1$, so that series diverges.",
        "交错级数判别法只要求 $b_n$ 从某一项起递减，因为开头有限项不影响敛散性。对 $b_n = \\frac{n}{n^{2} + 10}$，取 $f(x) = \\frac{x}{x^{2} + 10}$：\n\n$$f'(x) = \\frac{10 - x^{2}}{(x^{2} + 10)^{2}} < 0 \\text{（当 } x > \\sqrt{10}\\text{ 时）}$$\n\n所以 $b_n$ 在 $n = 3$ 之前增大，之后递减趋于 $0$，$\\sum (-1)^{n} \\frac{n}{n^{2} + 10}$ 收敛。\n\n检验：$b_3 = \\frac{3}{19} \\approx 0.158$，$b_4 = \\frac{4}{26} \\approx 0.154$，$b_5 = \\frac{5}{35} \\approx 0.143$，从 $n = 3$ 起递减。\n\n> **注意。** 要单独检查 $b_n \\to 0$。$\\frac{n^{2}}{n^{2} + 10}$ 在别的方面最终都没问题，但它趋于 $1$，所以那个级数发散。",
      ),
      generate(rng) {
        const k = rng.int(2, 40);
        const c = rng.int(1, 9);
        const kind = rng.int(0, 3);
        // The first n with n(n + 1) ≥ m, from which consecutive sizes stop rising.
        const from = (m: number) => {
          let n = 1;
          while (n * (n + 1) < m) n++;
          return n;
        };
        const conclude = (ok: boolean): Step => [
          ["Conclude", "得出结论"],
          ok
            ? t(
                "The sizes decrease eventually and tend to $0$, so by the alternating series test the series converges.",
                "大小最终递减且趋于 $0$，所以由交错级数判别法，级数收敛。",
              )
            : t(
                "The terms do not tend to $0$, so by the $n$th term test the series diverges.",
                "各项不趋于 $0$，所以由第 $n$ 项判别法，级数发散。",
              ),
        ];
        const limitZero = (b: string, why: Text): Step => [["Check the limit", "检查极限"], why, [`\\lim_{n \\to \\infty} ${b} = 0`]];
        if (kind === 0) {
          const b = `\\frac{${term(c, "n")}}{n^{2} + ${k}}`;
          const n0 = from(k);
          return verdict(
            rng,
            sigma(`(-1)^{n} ${b}`),
            true,
            walked(
              [
                [
                  ["Check that the sizes decrease eventually", "检查大小最终递减"],
                  t(
                    `Take $f(x) = \\frac{${term(c, "x")}}{x^{2} + ${k}}$. By the quotient rule its derivative, below, is negative for $x > \\sqrt{${k}}$:`,
                    `取 $f(x) = \\frac{${term(c, "x")}}{x^{2} + ${k}}$。由商的求导法则，它的导数如下，当 $x > \\sqrt{${k}}$ 时为负：`,
                  ),
                  [`f'(x) = \\frac{${c}(${k} - x^{2})}{(x^{2} + ${k})^{2}}`],
                ],
                limitZero(b, t("Divide the numerator and the denominator by $n^{2}$:", "分子分母同除以 $n^{2}$：")),
                conclude(true),
              ],
              t(
                `Compare consecutive sizes exactly instead. Cross-multiplying, $b_{n+1} \\le b_n$ becomes $(n + 1)(n^{2} + ${k}) \\le n\\left((n + 1)^{2} + ${k}\\right)$, which simplifies to $n(n + 1) \\ge ${k}$. That holds from $n = ${n0}$ on, so the sizes do decrease eventually.`,
                `改为精确比较相邻两项。交叉相乘后，$b_{n+1} \\le b_n$ 化为 $(n + 1)(n^{2} + ${k}) \\le n\\left((n + 1)^{2} + ${k}\\right)$，化简得 $n(n + 1) \\ge ${k}$。它从 $n = ${n0}$ 起成立，所以大小确实最终递减。`,
              ),
            ),
          );
        }
        if (kind === 1) {
          const b = `\\frac{\\sqrt{n}}{${shift(k)}}`;
          const n0 = from(k * k);
          return verdict(
            rng,
            sigma(`(-1)^{n} ${b}`),
            true,
            walked(
              [
                [
                  ["Check that the sizes decrease eventually", "检查大小最终递减"],
                  t(
                    `Take $f(x) = \\frac{\\sqrt{x}}{${linear(1, k)}}$. By the quotient rule its derivative, below, is negative for $x > ${k}$:`,
                    `取 $f(x) = \\frac{\\sqrt{x}}{${linear(1, k)}}$。由商的求导法则，它的导数如下，当 $x > ${k}$ 时为负：`,
                  ),
                  [`f'(x) = \\frac{${k} - x}{2\\sqrt{x}(${linear(1, k)})^{2}}`],
                ],
                limitZero(b, t("Divide the numerator and the denominator by $n$:", "分子分母同除以 $n$：")),
                conclude(true),
              ],
              t(
                `Compare consecutive sizes exactly instead. Squaring and cross-multiplying, $b_{n+1} \\le b_n$ becomes $(n + 1)(n + ${k})^{2} \\le n(n + ${k + 1})^{2}$, which simplifies to $n(n + 1) \\ge ${k * k}$. That holds from $n = ${n0}$ on, so the sizes do decrease eventually.`,
                `改为精确比较相邻两项。平方并交叉相乘后，$b_{n+1} \\le b_n$ 化为 $(n + 1)(n + ${k})^{2} \\le n(n + ${k + 1})^{2}$，化简得 $n(n + 1) \\ge ${k * k}$。它从 $n = ${n0}$ 起成立，所以大小确实最终递减。`,
              ),
            ),
          );
        }
        if (kind === 2) {
          const b = `\\frac{${k1(c)}\\ln n}{n}`;
          return verdict(
            rng,
            sigma(`(-1)^{n} ${b}`, 2),
            true,
            walked(
              [
                [
                  ["Check that the sizes decrease eventually", "检查大小最终递减"],
                  t(
                    `Take $f(x) = \\frac{${k1(c)}\\ln x}{x}$. By the quotient rule its derivative, below, is negative for $x > e$:`,
                    `取 $f(x) = \\frac{${k1(c)}\\ln x}{x}$。由商的求导法则，它的导数如下，当 $x > e$ 时为负：`,
                  ),
                  [`f'(x) = \\frac{${c}(1 - \\ln x)}{x^{2}}`],
                ],
                limitZero(
                  b,
                  t(
                    "By L'Hôpital's rule, $\\frac{\\ln x}{x}$ has the same limit as the ratio of the derivatives, $\\frac{1}{x}$, so",
                    "由洛必达法则，$\\frac{\\ln x}{x}$ 与导数之比 $\\frac{1}{x}$ 极限相同，所以",
                  ),
                ),
                conclude(true),
              ],
              t(
                "Compare consecutive sizes exactly instead. $b_{n+1} \\le b_n$ means $n \\ln(n + 1) \\le (n + 1) \\ln n$, that is $\\left(1 + \\frac{1}{n}\\right)^{n} \\le n$. The left side is always less than $e < 3$, so this holds for every $n \\ge 3$.",
                "改为精确比较相邻两项。$b_{n+1} \\le b_n$ 即 $n \\ln(n + 1) \\le (n + 1) \\ln n$，也就是 $\\left(1 + \\frac{1}{n}\\right)^{n} \\le n$。左边总小于 $e < 3$，所以对每个 $n \\ge 3$ 都成立。",
              ),
            ),
          );
        }
        const b = `\\frac{${term(c, "n^{2}")}}{n^{2} + ${k}}`;
        return verdict(
          rng,
          sigma(`(-1)^{n} ${b}`),
          false,
          walked(
            [
              [
                ["Check the limit", "检查极限"],
                t("Divide the numerator and the denominator by $n^{2}$:", "分子分母同除以 $n^{2}$："),
                [`\\lim_{n \\to \\infty} ${b} = ${c} \\neq 0`],
              ],
              conclude(false),
            ],
            t(
              `Bound the sizes from below instead. Since $${k}n^{2} \\ge ${k}$, we have $(1 + ${k})n^{2} \\ge n^{2} + ${k}$, so $b_n \\ge ${frac(c, 1 + k)}$ for every $n$. Sizes that never drop below a positive number cannot tend to $0$.`,
              `改为给大小一个下界。由于 $${k}n^{2} \\ge ${k}$，有 $(1 + ${k})n^{2} \\ge n^{2} + ${k}$，所以对每个 $n$ 都有 $b_n \\ge ${frac(c, 1 + k)}$。始终不低于某个正数的大小不可能趋于 $0$。`,
            ),
          ),
        );
      },
    },
  ],
};

/** RatioCase is a series whose ratio-test limit is known, with the ratio worked out, a second route and likely mistakes. */
interface RatioCase {
  readonly a: string;
  readonly L: Q;
  readonly ratio: string;
  readonly say: Text;
  readonly check: Text;
  readonly atOne: Text;
  readonly mistakes: readonly Mistake[];
}

/** central writes the bounds of the central binomial coefficient used to check ratio-test limits. */
const central = t(
  "The middle coefficient $\\binom{2n}{n} = \\frac{(2n)!}{(n!)^{2}}$ is the largest of the $2n + 1$ coefficients in $(1 + 1)^{2n} = 4^{n}$, so $\\frac{4^{n}}{2n + 1} \\le \\binom{2n}{n} \\le 4^{n}$.",
  "中间的系数 $\\binom{2n}{n} = \\frac{(2n)!}{(n!)^{2}}$ 是 $(1 + 1)^{2n} = 4^{n}$ 的 $2n + 1$ 个系数中最大的，所以 $\\frac{4^{n}}{2n + 1} \\le \\binom{2n}{n} \\le 4^{n}$。",
);

/** ratioCase picks a term with powers and factorials. */
function ratioCase(rng: Rng): RatioCase {
  const kind = rng.int(0, 3);
  const k = rng.int(2, 9);
  const m = rng.int(2, 9);
  const p = rng.int(1, 4);
  if (kind === 0) {
    const L = Q.of(k, m);
    const grow = p === 1 ? "\\frac{n + 1}{n}" : `\\left(\\frac{n + 1}{n}\\right)^{${p}}`;
    const root = p === 1 ? "\\sqrt[n]{n}" : `\\left(\\sqrt[n]{n}\\right)^{${p}}`;
    return {
      a: `\\frac{${pw(p)} \\cdot ${k}^{n}}{${m}^{n}}`,
      L,
      ratio: `\\frac{a_{n+1}}{a_n} = ${grow} \\cdot \\frac{${k}}{${m}} \\to ${L.toLatex()}`,
      say: t(
        `The powers of $${k}$ and $${m}$ each lose one factor, and $\\frac{n + 1}{n} \\to 1$:`,
        `$${k}$ 和 $${m}$ 的幂各约去一个因子，且 $\\frac{n + 1}{n} \\to 1$：`,
      ),
      check: t(
        `Use the root test instead. Since $\\sqrt[n]{n} \\to 1$, it gives the same limit: $\\sqrt[n]{a_n} = ${root} \\cdot \\frac{${k}}{${m}} \\to ${L.toLatex()}$.`,
        `改用根值判别法：$\\sqrt[n]{a_n} = ${root} \\cdot \\frac{${k}}{${m}} \\to ${L.toLatex()}$，因为 $\\sqrt[n]{n} \\to 1$。极限相同。`,
      ),
      atOne: t(
        `With equal bases the term is $${pw(p)}$, which grows without bound, so the series diverges by the $n$th term test.`,
        `两个底数相等时这一项就是 $${pw(p)}$，它无限增大，所以由第 $n$ 项判别法，级数发散。`,
      ),
      mistakes: [
        slip(
          Q.of(m, k),
          "This is the limit of $\\frac{a_n}{a_{n+1}}$: the ratio is upside down.",
          "这是 $\\frac{a_n}{a_{n+1}}$ 的极限：比值倒过来了。",
        ),
        slip(
          1,
          `This keeps only the factor $${grow}$, which tends to $1$, and drops $\\frac{${k}}{${m}}$.`,
          `这里只保留了趋于 $1$ 的因子 $${grow}$，丢掉了 $\\frac{${k}}{${m}}$。`,
        ),
      ],
    };
  }
  if (kind === 1)
    return {
      a: `\\frac{${m}^{n}}{n!}`,
      L: Q.zero,
      ratio: `\\frac{a_{n+1}}{a_n} = \\frac{${m}^{n+1}}{(n + 1)!} \\cdot \\frac{n!}{${m}^{n}} = \\frac{${m}}{n + 1} \\to 0`,
      say: t(
        `The powers leave one factor $${m}$ and the factorials leave $\\frac{1}{n + 1}$:`,
        `幂约去后剩下一个因子 $${m}$，阶乘约去后剩下 $\\frac{1}{n + 1}$：`,
      ),
      check: t(
        `Recognize the series instead. The exponential series gives $\\sum_{n=0}^{\\infty} \\frac{${m}^{n}}{n!} = e^{${m}}$. So the series from $n = 1$ adds up to $e^{${m}} - 1$, a finite number. That fits $L = 0 < 1$.`,
        `改为认出这个级数：$\\sum_{n=0}^{\\infty} \\frac{${m}^{n}}{n!} = e^{${m}}$，所以从 $n = 1$ 起的级数之和为 $e^{${m}} - 1$，是有限数。这与 $L = 0 < 1$ 一致。`,
      ),
      atOne: t("", ""),
      mistakes: [
        slip(
          m,
          `This keeps the factor $${m}$ but forgets the $\\frac{1}{n + 1}$ from the factorials, which sends the ratio to $0$.`,
          `这里保留了因子 $${m}$，却忘了阶乘给出的 $\\frac{1}{n + 1}$，正是它使比值趋于 $0$。`,
        ),
        slip(1, "Factorials grow much faster than powers; the ratio does not tend to $1$.", "阶乘比幂增长快得多，比值不趋于 $1$。"),
      ],
    };
  if (kind === 2) {
    const L = Q.of(k, 4);
    return {
      a: `\\frac{(n!)^{2} \\, ${k}^{n}}{(2n)!}`,
      L,
      ratio: `\\frac{a_{n+1}}{a_n} = \\frac{(n + 1)^{2} \\cdot ${k}}{(2n + 2)(2n + 1)} \\to ${eq(`\\frac{${k}}{4}`, L)}`,
      say: t(
        "$(n + 1)!$ is $(n + 1) \\cdot n!$, and $(2n + 2)!$ is $(2n + 2)(2n + 1) \\cdot (2n)!$. Both sides of the resulting fraction have degree $2$:",
        "$(n + 1)! = (n + 1) \\cdot n!$，$(2n + 2)! = (2n + 2)(2n + 1) \\cdot (2n)!$。约去后的分数分子分母都是 $2$ 次：",
      ),
      check: t(
        `${central.en} So $a_n = \\frac{${k}^{n}}{\\binom{2n}{n}}$ lies between $\\left(${L.toLatex()}\\right)^{n}$ and $(2n + 1)\\left(${L.toLatex()}\\right)^{n}$, and the $n$th root of either bound tends to $${L.toLatex()}$.`,
        `${central["zh-CN"]}所以 $a_n = \\frac{${k}^{n}}{\\binom{2n}{n}}$ 介于 $\\left(${L.toLatex()}\\right)^{n}$ 与 $(2n + 1)\\left(${L.toLatex()}\\right)^{n}$ 之间，两个界的 $n$ 次方根都趋于 $${L.toLatex()}$。`,
      ),
      atOne: t(
        `${central.en} With $${k} = 4$ the term is $\\frac{4^{n}}{\\binom{2n}{n}} \\ge 1$, so the terms do not tend to $0$ and the series diverges.`,
        `${central["zh-CN"]}当 $${k} = 4$ 时这一项为 $\\frac{4^{n}}{\\binom{2n}{n}} \\ge 1$，各项不趋于 $0$，级数发散。`,
      ),
      mistakes: [
        slip(
          k,
          "This forgets the factorial part, $\\frac{(n + 1)^{2}}{(2n + 2)(2n + 1)}$, which tends to $\\frac{1}{4}$.",
          "这里忘了阶乘部分 $\\frac{(n + 1)^{2}}{(2n + 2)(2n + 1)}$，它趋于 $\\frac{1}{4}$。",
        ),
        slip(
          Q.of(k, 2),
          "This takes $(2n + 2)!$ as $(2n + 2) \\cdot (2n)!$, missing the factor $2n + 1$.",
          "这里把 $(2n + 2)!$ 当成了 $(2n + 2) \\cdot (2n)!$，漏掉了因子 $2n + 1$。",
        ),
        slip(
          Q.of(4, k),
          "This is the limit of $\\frac{a_n}{a_{n+1}}$: the ratio is upside down.",
          "这是 $\\frac{a_n}{a_{n+1}}$ 的极限：比值倒过来了。",
        ),
      ],
    };
  }
  const L = Q.of(4, m);
  return {
    a: `\\frac{(2n)!}{(n!)^{2} \\, ${m}^{n}}`,
    L,
    ratio: `\\frac{a_{n+1}}{a_n} = \\frac{(2n + 2)(2n + 1)}{(n + 1)^{2} \\cdot ${m}} \\to ${eq(`\\frac{4}{${m}}`, L)}`,
    say: t(
      "$(2n + 2)!$ is $(2n + 2)(2n + 1) \\cdot (2n)!$, and $(n + 1)!$ is $(n + 1) \\cdot n!$. Both sides of the resulting fraction have degree $2$:",
      "$(2n + 2)! = (2n + 2)(2n + 1) \\cdot (2n)!$，$(n + 1)! = (n + 1) \\cdot n!$。约去后的分数分子分母都是 $2$ 次：",
    ),
    check: t(
      `${central.en} So $a_n = \\frac{\\binom{2n}{n}}{${m}^{n}}$ lies between $\\frac{1}{2n + 1}\\left(${L.toLatex()}\\right)^{n}$ and $\\left(${L.toLatex()}\\right)^{n}$, and the $n$th root of either bound tends to $${L.toLatex()}$.`,
      `${central["zh-CN"]}所以 $a_n = \\frac{\\binom{2n}{n}}{${m}^{n}}$ 介于 $\\frac{1}{2n + 1}\\left(${L.toLatex()}\\right)^{n}$ 与 $\\left(${L.toLatex()}\\right)^{n}$ 之间，两个界的 $n$ 次方根都趋于 $${L.toLatex()}$。`,
    ),
    atOne: t(
      `${central.en} With $${m} = 4$ the term is $\\frac{\\binom{2n}{n}}{4^{n}} \\ge \\frac{1}{2n + 1}$, so the series diverges by comparison with $\\sum \\frac{1}{2n + 1}$, which behaves like half the harmonic series.`,
      `${central["zh-CN"]}当 $${m} = 4$ 时这一项为 $\\frac{\\binom{2n}{n}}{4^{n}} \\ge \\frac{1}{2n + 1}$，与表现如同调和级数一半的 $\\sum \\frac{1}{2n + 1}$ 比较，级数发散。`,
    ),
    mistakes: [
      slip(
        Q.of(1, m),
        "This forgets the factorial part, $\\frac{(2n + 2)(2n + 1)}{(n + 1)^{2}}$, which tends to $4$.",
        "这里忘了阶乘部分 $\\frac{(2n + 2)(2n + 1)}{(n + 1)^{2}}$，它趋于 $4$。",
      ),
      slip(
        Q.of(m, 4),
        "This is the limit of $\\frac{a_n}{a_{n+1}}$: the ratio is upside down.",
        "这是 $\\frac{a_n}{a_{n+1}}$ 的极限：比值倒过来了。",
      ),
    ],
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

/** outcomeStep compares L with 1. */
function outcomeStep(L: Q, test: Text): Step {
  const o = ratioOutcome(L);
  return [
    ["Compare L with 1", "把 L 与 1 比较"],
    o === 0
      ? t(
          `$L = ${L.toLatex()} < 1$, so by the ${test.en} the series converges.`,
          `$L = ${L.toLatex()} < 1$，所以由${test["zh-CN"]}，级数收敛。`,
        )
      : o === 1
        ? t(
            `$L = ${L.toLatex()} > 1$, so by the ${test.en} the series diverges.`,
            `$L = ${L.toLatex()} > 1$，所以由${test["zh-CN"]}，级数发散。`,
          )
        : t(`$L = 1$, so the ${test.en} is inconclusive.`, `$L = 1$，所以${test["zh-CN"]}无法得出结论。`),
  ];
}

/** outcomeChoice asks what the ratio or root test says, with a reason for each wrong outcome. */
function outcomeChoice(rng: Rng, prompt: Text, L: Q, solution: Text): Problem {
  const o = ratioOutcome(L);
  const reasons = [
    t(
      "Convergence needs $L < 1$, which makes the terms shrink at least as fast as a convergent geometric series.",
      "收敛需要 $L < 1$，那时各项至少和一个收敛的等比级数缩小得一样快。",
    ),
    t("Divergence needs $L > 1$, which makes the terms grow instead of tending to $0$.", "发散需要 $L > 1$，那时各项增大而不趋于 $0$。"),
    t(
      "Only $L = 1$ leaves the question open. Here $L \\neq 1$, so the test does decide.",
      "只有 $L = 1$ 时才无法判断。这里 $L \\neq 1$，所以判别法能下结论。",
    ),
  ];
  const atOne = t(
    "With $L = 1$ either outcome is possible: $\\sum \\frac{1}{n^{2}}$ converges and $\\sum \\frac{1}{n}$ diverges, and both have $L = 1$.",
    "$L = 1$ 时两种结果都有可能：$\\sum \\frac{1}{n^{2}}$ 收敛，$\\sum \\frac{1}{n}$ 发散，而两者的 $L$ 都是 $1$。",
  );
  const wrong = [0, 1, 2]
    .filter((i) => i !== o)
    .map((i) => {
      const option = ratioOutcomes[i] as Text;
      const why = o === 2 ? atOne : (reasons[i] as Text);
      return { option, why };
    });
  return explainedChoice(rng, { prompt, correct: ratioOutcomes[o] as Text, wrong, solution });
}

/** theRatioTest compares consecutive terms. */
export const theRatioTest: TopicDef = {
  id: "the-ratio-test",
  title: t("The Ratio Test", "比值判别法"),
  summary: t(
    "If |aₙ₊₁/aₙ| → L, the series converges absolutely when L < 1, diverges when L > 1, and the test is inconclusive when L = 1.",
    "若 |aₙ₊₁/aₙ| → L，则 L < 1 时级数绝对收敛，L > 1 时发散，L = 1 时无法判断。",
  ),
  intro: t(
    "For $\\sum \\frac{n}{2^{n}}$, each term is a fixed fraction of the one before, once $n$ is large:\n\n$$\\frac{a_{n+1}}{a_n} = \\frac{n + 1}{2n} \\to \\frac{1}{2}$$\n\nFar out the terms shrink like a geometric series with ratio about $\\frac{1}{2}$, so the series converges.\n\nCheck: the partial sums $0.5, 1, 1.375, 1.625, 1.78125$ increase more and more slowly; the sum is in fact $2$.\n\nIn this lesson we compare consecutive terms through the limit of their ratio, which suits terms built from powers and factorials.",
    "对 $\\sum \\frac{n}{2^{n}}$，当 $n$ 很大时，每一项都约是前一项的一个固定比例：\n\n$$\\frac{a_{n+1}}{a_n} = \\frac{n + 1}{2n} \\to \\frac{1}{2}$$\n\n很靠后的项像公比约为 $\\frac{1}{2}$ 的等比级数那样缩小，所以级数收敛。\n\n检验：部分和 $0.5, 1, 1.375, 1.625, 1.78125$ 增加得越来越慢；这个级数的和其实是 $2$。\n\n这节课我们通过相邻两项之比的极限来比较它们，这适合由幂和阶乘构成的项。",
  ),
  prerequisites: ["the-nth-term-test-for-divergence", "identifying-monotonic-sequences-using-ratios", "convergence-of-geometric-series"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-ratio-test-limit",
      title: t("The ratio test limit", "比值判别法的极限"),
      explanation: t(
        "Let\n\n$$L = \\lim_{n \\to \\infty} \\left|\\frac{a_{n+1}}{a_n}\\right|$$\n\nIf $L < 1$, the terms eventually shrink at least as fast as a convergent geometric series and $\\sum a_n$ converges. If $L > 1$, the terms grow and the series diverges. If $L = 1$, the test gives no answer. For $a_n = \\frac{n \\cdot 2^{n}}{3^{n}}$: $\\frac{a_{n+1}}{a_n} = \\frac{n + 1}{n} \\cdot \\frac{2}{3} \\to \\frac{2}{3}$.\n\nCheck: the root test gives the same limit, since $\\sqrt[n]{a_n} = \\sqrt[n]{n} \\cdot \\frac{2}{3} \\to \\frac{2}{3}$.\n\n> **Watch out.** Put $a_{n+1}$ on top. The upside-down ratio tends to $\\frac{1}{L}$, and reading it as $L$ reverses the verdict.",
        "设\n\n$$L = \\lim_{n \\to \\infty} \\left|\\frac{a_{n+1}}{a_n}\\right|$$\n\n若 $L < 1$，各项最终至少和一个收敛的等比级数缩小得一样快，$\\sum a_n$ 收敛。若 $L > 1$，各项增大，级数发散。若 $L = 1$，判别法无法给出答案。对 $a_n = \\frac{n \\cdot 2^{n}}{3^{n}}$：$\\frac{a_{n+1}}{a_n} = \\frac{n + 1}{n} \\cdot \\frac{2}{3} \\to \\frac{2}{3}$。\n\n检验：根值判别法给出同样的极限，因为 $\\sqrt[n]{a_n} = \\sqrt[n]{n} \\cdot \\frac{2}{3} \\to \\frac{2}{3}$。\n\n> **注意。** 要把 $a_{n+1}$ 放在分子上。倒过来的比值趋于 $\\frac{1}{L}$，把它当成 $L$ 会把结论弄反。",
      ),
      generate(rng) {
        const k = ratioCase(rng);
        return worked(
          t(
            `For $${sigma(k.a)}$, find $L = \\lim_{n \\to \\infty} \\left|\\frac{a_{n+1}}{a_n}\\right|$.`,
            `对 $${sigma(k.a)}$，求 $L = \\lim_{n \\to \\infty} \\left|\\frac{a_{n+1}}{a_n}\\right|$。`,
          ),
          k.L,
          [
            [["Simplify the ratio", "化简比值"], k.say, [k.ratio]],
            [["Read off L", "读出 L"], t(`The terms are positive, so $L = ${k.L.toLatex()}$.`, `各项为正，所以 $L = ${k.L.toLatex()}$。`)],
          ],
          k.check,
          k.mistakes,
        );
      },
    },
    {
      id: "conclusions-from-the-ratio-test",
      title: t("Conclusions from the ratio test", "比值判别法的结论"),
      explanation: t(
        'The ratio test suits terms with factorials and exponentials. It fails, with $L = 1$, for every $p$-series and every rational term:\n\n$$\\frac{1/(n + 1)^{2}}{1/n^{2}} = \\frac{n^{2}}{(n + 1)^{2}} \\to 1, \\qquad \\frac{1/(n + 1)}{1/n} = \\frac{n}{n + 1} \\to 1$$\n\nThe first series converges and the second diverges, so $L = 1$ cannot decide. For $\\sum \\frac{3^{n}}{n!}$, $L = \\lim \\frac{3}{n + 1} = 0 < 1$, so it converges.\n\nCheck: $\\sum_{n=0}^{\\infty} \\frac{3^{n}}{n!} = e^{3}$, a finite sum, as the test says.\n\n> **Watch out.** For a rational term, do not stop at "inconclusive" when asked whether the series converges: use the limit comparison test.',
        "比值判别法适合含阶乘和指数的项。对所有 $p$ 级数和有理式的项，它都失效，$L = 1$：\n\n$$\\frac{1/(n + 1)^{2}}{1/n^{2}} = \\frac{n^{2}}{(n + 1)^{2}} \\to 1, \\qquad \\frac{1/(n + 1)}{1/n} = \\frac{n}{n + 1} \\to 1$$\n\n第一个级数收敛，第二个发散，所以 $L = 1$ 无法判断。对 $\\sum \\frac{3^{n}}{n!}$，$L = \\lim \\frac{3}{n + 1} = 0 < 1$，所以收敛。\n\n检验：$\\sum_{n=0}^{\\infty} \\frac{3^{n}}{n!} = e^{3}$，是有限的和，与判别法一致。\n\n> **注意。** 对有理式的项，若问的是级数是否收敛，不要停在“无法判断”：改用极限比较判别法。",
      ),
      generate(rng) {
        const prompt = (a: string) => t(`What does the ratio test say about $${sigma(a)}$?`, `比值判别法对 $${sigma(a)}$ 能得出什么结论？`);
        const test = t("ratio test", "比值判别法");
        if (rng.int(0, 3) === 0) {
          const x = rationalTerm(rng);
          const b = compareWith(x.d);
          return outcomeChoice(
            rng,
            prompt(x.tex),
            Q.one,
            walked(
              [
                [
                  ["Find L", "求 L"],
                  t(
                    "In $\\frac{a_{n+1}}{a_n}$, replacing $n$ by $n + 1$ does not change the leading terms of the numerator or the denominator, so",
                    "在 $\\frac{a_{n+1}}{a_n}$ 中，把 $n$ 换成 $n + 1$ 不改变分子和分母的首项，所以",
                  ),
                  ["L = \\lim_{n \\to \\infty} \\frac{a_{n+1}}{a_n} = 1"],
                ],
                outcomeStep(Q.one, test),
              ],
              t(
                `Settle the series another way: compared with $${b}$, $\\frac{a_n}{${b}} \\to ${x.ratio.toLatex()}$, so by the limit comparison test it ${x.d > 1 ? `converges, like the $p$-series with $p = ${x.d}$` : "diverges, like the harmonic series"}. The ratio test could not see this.`,
                `换一种方法判断：与 $${b}$ 比较，$\\frac{a_n}{${b}} \\to ${x.ratio.toLatex()}$，所以由极限比较判别法它${x.d > 1 ? `像 $p = ${x.d}$ 的 $p$ 级数一样收敛` : "像调和级数一样发散"}。比值判别法看不出这一点。`,
              ),
            ),
          );
        }
        const k = ratioCase(rng);
        return outcomeChoice(
          rng,
          prompt(k.a),
          k.L,
          walked([[["Find L", "求 L"], k.say, [k.ratio]], outcomeStep(k.L, test)], ratioOutcome(k.L) === 2 ? k.atOne : k.check),
        );
      },
    },
  ],
};

/** RootCase is a term that suits the root test, with its root worked out, a second route and likely mistakes. */
interface RootCase {
  readonly a: string;
  readonly L: Q;
  readonly root: string;
  readonly say: Text;
  readonly check: Text;
  readonly settle: Text;
  readonly mistakes: readonly Mistake[];
}

/** rootCase picks an nth power or a term with n in the exponent. */
function rootCase(rng: Rng): RootCase {
  if (rng.int(0, 2) > 0) {
    const p = rng.nonZero(-9, 9);
    const r = rng.int(1, 9);
    const q = rng.int(-9, 9);
    const s = rng.int(1, 9);
    const top = linear(p, q, "n");
    const bottom = linear(r, s, "n");
    const L = Q.of(Math.abs(p), r);
    const at = Math.abs((1000 * p + q) / (1000 * r + s));
    const o = ratioOutcome(L);
    const sigmaSign = p > 0 ? 1 : -1;
    const num = sigmaSign * q - s;
    const power = Q.of(num, r);
    const near = num === 0 ? "1" : `1 ${num > 0 ? "+" : "-"} \\frac{${Math.abs(num)}}{${linear(r, s, "n")}}`;
    const rho = L.add(Q.one).div(Q.of(2));
    const settle =
      o === 1
        ? t(
            `Use the $n$th term test instead. The base tends to $${L.toLatex()} > 1$, so from some point on its size is above $1$, and then $|a_n| \\ge 1$. The terms do not tend to $0$, so the series diverges.`,
            `改用第 $n$ 项判别法。底数的大小趋于 $${L.toLatex()} > 1$，所以从某一项起它大于 $1$，于是 $|a_n| \\ge 1$。各项不趋于 $0$，所以级数发散。`,
          )
        : o === 0
          ? t(
              `Compare with a geometric series instead. At $n = 1000$ the size of the base is about $${dec(at, 4)}$, already close to $${L.toLatex()}$. From some point on it stays below $${rho.toLatex()}$, so $|a_n| < \\left(${rho.toLatex()}\\right)^{n}$, the terms of a convergent geometric series.`,
              `改为与等比级数比较。在 $n = 1000$ 处底数的大小约为 $${dec(at, 4)}$，已经接近 $${L.toLatex()}$。从某一项起它始终小于 $${rho.toLatex()}$，所以 $|a_n| < \\left(${rho.toLatex()}\\right)^{n}$，是收敛的等比级数的项。`,
            )
          : t(
              `The test leaves the series open, so look at the size of the terms. Far out the base has size exactly $${near}$, so $|a_n| \\to ${power.isZero() ? "1" : power.eq(Q.one) ? "e" : `e^{${power.toLatex()}}`}$, which is not $0$. The series diverges by the $n$th term test.`,
              `判别法无法下结论，所以看各项的大小。在很靠后的位置，底数的大小恰为 $${near}$，所以 $|a_n| \\to ${power.isZero() ? "1" : power.eq(Q.one) ? "e" : `e^{${power.toLatex()}}`}$，不为 $0$。由第 $n$ 项判别法，级数发散。`,
            );
    const mistakes: Mistake[] = [
      slip(
        Q.of(r, Math.abs(p)),
        "This is the reciprocal: the base is the numerator over the denominator.",
        "这是倒数：底数是分子除以分母。",
      ),
      slip(
        0,
        "The $n$th root undoes the power $n$; it does not send the base to $0$.",
        "$n$ 次方根抵消了 $n$ 次幂，并不会使底数趋于 $0$。",
      ),
      slip(
        1,
        "This treats the base as tending to $1$, but its limit is the ratio of the leading coefficients.",
        "这里把底数当成趋于 $1$，但它的极限是首项系数之比。",
      ),
    ];
    if (p < 0)
      mistakes.push(
        slip(Q.of(p, r), "The root test uses $|a_n|$, so $L$ cannot be negative.", "根值判别法用的是 $|a_n|$，所以 $L$ 不可能为负。"),
      );
    return {
      a: `\\left(\\frac{${top}}{${bottom}}\\right)^{n}`,
      L,
      root: `\\sqrt[n]{|a_n|} = \\left|\\frac{${top}}{${bottom}}\\right| \\to ${L.toLatex()}`,
      say: t(
        "The $n$th root undoes the power $n$, leaving the size of the base, which tends to the ratio of the leading coefficients:",
        "$n$ 次方根抵消了 $n$ 次幂，只剩底数的大小，它趋于首项系数之比：",
      ),
      check: t(
        `Evaluate the base far out: at $n = 1000$ its size is $\\left|\\frac{${1000 * p + q}}{${1000 * r + s}}\\right| \\approx ${dec(at, 4)}$, close to $${L.toLatex()} \\approx ${dec(L.toNumber(), 4)}$.`,
        `在很靠后的位置计算底数：在 $n = 1000$ 处它的大小为 $\\left|\\frac{${1000 * p + q}}{${1000 * r + s}}\\right| \\approx ${dec(at, 4)}$，接近 $${L.toLatex()} \\approx ${dec(L.toNumber(), 4)}$。`,
      ),
      settle,
      mistakes,
    };
  }
  const k = rng.int(2, 9);
  const p = rng.int(1, 5);
  const L = Q.of(1, k);
  const root = p === 1 ? "\\sqrt[n]{n}" : `\\left(\\sqrt[n]{n}\\right)^{${p}}`;
  const grow = p === 1 ? "\\frac{n + 1}{n}" : `\\left(\\frac{n + 1}{n}\\right)^{${p}}`;
  const ratio = t(
    `Use the ratio test instead. It gives the same limit: $\\frac{a_{n+1}}{a_n} = ${grow} \\cdot \\frac{1}{${k}} \\to \\frac{1}{${k}}$.`,
    `改用比值判别法：$\\frac{a_{n+1}}{a_n} = ${grow} \\cdot \\frac{1}{${k}} \\to \\frac{1}{${k}}$，极限相同。`,
  );
  return {
    a: `\\frac{${pw(p)}}{${k}^{n}}`,
    L,
    root: `\\sqrt[n]{a_n} = \\frac{${root}}{${k}} \\to \\frac{1}{${k}}`,
    say: t(`The root of $${k}^{n}$ is $${k}$, and $\\sqrt[n]{n} \\to 1$:`, `$${k}^{n}$ 的 $n$ 次方根是 $${k}$，且 $\\sqrt[n]{n} \\to 1$：`),
    check: ratio,
    settle: t(
      `${ratio.en} It is less than $1$, so the ratio test also gives convergence.`,
      `${ratio["zh-CN"]}它小于 $1$，所以比值判别法也给出收敛。`,
    ),
    mistakes: [
      slip(k, `This is the reciprocal: the power of ${k} is in the denominator.`, `这是倒数：$${k}$ 的幂在分母里。`),
      slip(
        0,
        `$\\sqrt[n]{n^{${p}}} = \\left(\\sqrt[n]{n}\\right)^{${p}}$ tends to $1$, not to $0$ or to infinity.`,
        `$\\sqrt[n]{n^{${p}}} = \\left(\\sqrt[n]{n}\\right)^{${p}}$ 趋于 $1$，既不趋于 $0$ 也不趋于无穷。`,
      ),
      slip(
        1,
        `This keeps only $\\sqrt[n]{n^{${p}}} \\to 1$ and forgets the root of $${k}^{n}$.`,
        `这里只保留了 $\\sqrt[n]{n^{${p}}} \\to 1$，忘了 $${k}^{n}$ 的方根。`,
      ),
    ],
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
  intro: t(
    "Each term of $\\sum \\left(\\frac{n}{2n + 1}\\right)^{n}$ is an $n$th power, and its base is always less than $\\frac{1}{2}$:\n\n$$\\left(\\frac{n}{2n + 1}\\right)^{n} < \\left(\\frac{1}{2}\\right)^{n}$$\n\nSo the series lies below a convergent geometric series and converges.\n\nCheck: the $n$th root of a term is the base, $\\frac{n}{2n + 1} \\to \\frac{1}{2} < 1$, which the root test reads as convergence.\n\nIn this lesson we take the $n$th root of the terms and compare its limit with $1$.",
    "$\\sum \\left(\\frac{n}{2n + 1}\\right)^{n}$ 的每一项都是 $n$ 次幂，底数总小于 $\\frac{1}{2}$：\n\n$$\\left(\\frac{n}{2n + 1}\\right)^{n} < \\left(\\frac{1}{2}\\right)^{n}$$\n\n所以这个级数位于一个收敛的等比级数之下，收敛。\n\n检验：一项的 $n$ 次方根就是底数，$\\frac{n}{2n + 1} \\to \\frac{1}{2} < 1$，根值判别法据此给出收敛。\n\n这节课我们取各项的 $n$ 次方根，并把它的极限与 $1$ 比较。",
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
        "Let\n\n$$L = \\lim_{n \\to \\infty} \\sqrt[n]{|a_n|}$$\n\nThe conclusions are those of the ratio test: $L < 1$ converges, $L > 1$ diverges, $L = 1$ is inconclusive. The root test suits terms that are $n$th powers: for $a_n = \\left(\\frac{2n + 1}{5n - 3}\\right)^{n}$, $\\sqrt[n]{a_n} = \\frac{2n + 1}{5n - 3} \\to \\frac{2}{5}$. It often uses $\\sqrt[n]{n} \\to 1$: for $a_n = \\frac{n^{3}}{2^{n}}$, $\\sqrt[n]{a_n} = \\frac{(\\sqrt[n]{n})^{3}}{2} \\to \\frac{1}{2}$.\n\nCheck: the ratio test on $\\frac{n^{3}}{2^{n}}$ gives $\\left(\\frac{n + 1}{n}\\right)^{3} \\cdot \\frac{1}{2} \\to \\frac{1}{2}$ as well.\n\n> **Watch out.** $\\sqrt[n]{n^{3}}$ tends to $1$, not to $0$: a fixed power of $n$ disappears under an $n$th root.",
        "设\n\n$$L = \\lim_{n \\to \\infty} \\sqrt[n]{|a_n|}$$\n\n结论与比值判别法相同：$L < 1$ 收敛，$L > 1$ 发散，$L = 1$ 无法判断。根值判别法适合本身是 $n$ 次幂的项：对 $a_n = \\left(\\frac{2n + 1}{5n - 3}\\right)^{n}$，$\\sqrt[n]{a_n} = \\frac{2n + 1}{5n - 3} \\to \\frac{2}{5}$。它常用到 $\\sqrt[n]{n} \\to 1$：对 $a_n = \\frac{n^{3}}{2^{n}}$，$\\sqrt[n]{a_n} = \\frac{(\\sqrt[n]{n})^{3}}{2} \\to \\frac{1}{2}$。\n\n检验：对 $\\frac{n^{3}}{2^{n}}$ 用比值判别法，也得到 $\\left(\\frac{n + 1}{n}\\right)^{3} \\cdot \\frac{1}{2} \\to \\frac{1}{2}$。\n\n> **注意。** $\\sqrt[n]{n^{3}}$ 趋于 $1$，而不是 $0$：$n$ 的固定次幂在 $n$ 次方根下消失。",
      ),
      generate(rng) {
        const k = rootCase(rng);
        return worked(
          t(
            `For $${sigma(k.a)}$, find $L = \\lim_{n \\to \\infty} \\sqrt[n]{|a_n|}$.`,
            `对 $${sigma(k.a)}$，求 $L = \\lim_{n \\to \\infty} \\sqrt[n]{|a_n|}$。`,
          ),
          k.L,
          [
            [["Take the nth root", "取 n 次方根"], k.say, [k.root]],
            [["Read off L", "读出 L"], t(`So $L = ${k.L.toLatex()}$.`, `所以 $L = ${k.L.toLatex()}$。`)],
          ],
          k.check,
          k.mistakes,
        );
      },
    },
    {
      id: "conclusions-from-the-root-test",
      title: t("Conclusions from the root test", "根值判别法的结论"),
      explanation: t(
        "If the limit of the roots is below $1$, the terms shrink like a convergent geometric series; above $1$ they do not shrink; exactly $1$ gives no conclusion:\n\n$$L < 1 \\text{: converges}, \\qquad L > 1 \\text{: diverges}, \\qquad L = 1 \\text{: no conclusion}$$\n\nFor $\\sum \\left(\\frac{3n}{n + 4}\\right)^{n}$, $L = 3 > 1$, so the series diverges; for $\\sum \\left(\\frac{n}{3n + 4}\\right)^{n}$, $L = \\frac{1}{3} < 1$, so it converges.\n\nCheck: $\\frac{3n}{n + 4} \\ge \\frac{3}{2}$ once $n \\ge 4$, so those terms are at least $\\left(\\frac{3}{2}\\right)^{n}$ and grow, and the $n$th term test agrees.\n\n> **Watch out.** $L = 1$ does not mean divergence. $\\left(\\frac{n}{n + 1}\\right)^{n} \\to \\frac{1}{e}$ diverges, but $\\frac{1}{n^{2}}$ also has $L = 1$ and converges.",
        "如果各项方根的极限小于 $1$，各项像收敛的等比级数那样缩小；大于 $1$ 时不缩小；恰好等于 $1$ 时无法判断：\n\n$$L < 1 \\text{：收敛}, \\qquad L > 1 \\text{：发散}, \\qquad L = 1 \\text{：无法判断}$$\n\n对 $\\sum \\left(\\frac{3n}{n + 4}\\right)^{n}$，$L = 3 > 1$，级数发散；对 $\\sum \\left(\\frac{n}{3n + 4}\\right)^{n}$，$L = \\frac{1}{3} < 1$，级数收敛。\n\n检验：当 $n \\ge 4$ 时 $\\frac{3n}{n + 4} \\ge \\frac{3}{2}$，所以那些项至少为 $\\left(\\frac{3}{2}\\right)^{n}$，不断增大，第 $n$ 项判别法给出同样的结论。\n\n> **注意。** $L = 1$ 不等于发散。$\\left(\\frac{n}{n + 1}\\right)^{n} \\to \\frac{1}{e}$ 的级数发散，但 $\\frac{1}{n^{2}}$ 的 $L$ 也是 $1$，却收敛。",
      ),
      generate(rng) {
        const k = rootCase(rng);
        return outcomeChoice(
          rng,
          t(`What does the root test say about $${sigma(k.a)}$?`, `根值判别法对 $${sigma(k.a)}$ 能得出什么结论？`),
          k.L,
          walked([[["Find L", "求 L"], k.say, [k.root]], outcomeStep(k.L, t("root test", "根值判别法"))], k.settle),
        );
      },
    },
  ],
};

/** modes are the kinds of convergence for a series with terms of both signs. */
const modes = [
  t("It converges absolutely.", "绝对收敛。"),
  t("It converges conditionally.", "条件收敛。"),
  t("It diverges.", "发散。"),
] as const;

/** modeChoice asks how a series behaves, with a reason for each wrong kind of convergence. */
function modeChoice(rng: Rng, series: string, correct: 0 | 1 | 2, reasons: readonly Text[], solution: Text): Problem {
  const wrong = [0, 1, 2].filter((i) => i !== correct).map((i, j) => ({ option: modes[i] as Text, why: reasons[j] as Text }));
  return explainedChoice(rng, {
    prompt: t(`How does $${sigma(series)}$ behave?`, `$${sigma(series)}$ 的敛散性如何？`),
    correct: modes[correct] as Text,
    wrong,
    solution,
  });
}

/** absReasons explain why the other kinds are wrong for an absolutely convergent series. */
const absReasons = [
  t("Conditional convergence means $\\sum |a_n|$ diverges, but here it converges.", "条件收敛意味着 $\\sum |a_n|$ 发散，但这里它收敛。"),
  t("A series whose absolute values add up to a finite sum converges; it cannot diverge.", "绝对值之和有限的级数一定收敛，不可能发散。"),
];

/** conditionalReasons explain why the other kinds are wrong for a conditionally convergent series. */
const conditionalReasons = [
  t("Absolute convergence needs $\\sum |a_n|$ to converge, but here it diverges.", "绝对收敛需要 $\\sum |a_n|$ 收敛，但这里它发散。"),
  t(
    "The sizes decrease to $0$ and the signs alternate, so the alternating series test gives convergence.",
    "大小递减趋于 $0$ 且符号交替，所以由交错级数判别法，级数收敛。",
  ),
];

/** pIntegral checks a p-series verdict by the integral test. */
function pIntegral(p: Q): Text {
  const gap = p.sub(Q.one);
  return p.toNumber() > 1
    ? t(
        `Check the absolute series by the integral test: $\\int_{1}^{\\infty} x^{-${p.toLatex()}} \\, dx = \\frac{1}{${gap.toLatex()}}$. The integral is finite, so $\\sum |a_n|$ converges.`,
        `用积分判别法检验绝对值级数：$\\int_{1}^{\\infty} x^{-${p.toLatex()}} \\, dx = \\frac{1}{${gap.toLatex()}}$，是有限值，所以 $\\sum |a_n|$ 收敛。`,
      )
    : t(
        `Check the absolute series by the integral test. The integral up to $b$ grows without bound: $\\int_{1}^{b} x^{-${p.toLatex()}} \\, dx = \\frac{b^{${gap.neg().toLatex()}} - 1}{${gap.neg().toLatex()}}$. So $\\sum |a_n|$ diverges. The alternating sums still settle, because each size is smaller than the one before.`,
        `用积分判别法检验绝对值级数：$\\int_{1}^{b} x^{-${p.toLatex()}} \\, dx = \\frac{b^{${gap.neg().toLatex()}} - 1}{${gap.neg().toLatex()}}$ 无限增大，所以 $\\sum |a_n|$ 发散。而交错的部分和仍会稳定，因为每一项的大小都比前一项小。`,
      );
}

/** powerSteps classifies an alternating p-series in steps. */
function powerSteps(f: PowerForm, sizes: Text): Step[] {
  const abs = f.p.toNumber() > 1;
  return [
    [["Test the absolute series", "检验绝对值级数"], sizes, [`|a_n| = ${f.tex} = \\frac{1}{n^{${f.p.toLatex()}}}`]],
    [
      ["Classify", "判断类型"],
      abs
        ? t(
            `This is a $p$-series with $p = ${f.p.toLatex()} > 1$, so $\\sum |a_n|$ converges: the series converges absolutely.`,
            `这是 $p = ${f.p.toLatex()} > 1$ 的 $p$ 级数，所以 $\\sum |a_n|$ 收敛：级数绝对收敛。`,
          )
        : t(
            `This is a $p$-series with $p = ${f.p.toLatex()} < 1$, so $\\sum |a_n|$ diverges. But the sizes decrease to $0$ and the signs alternate, so the series converges by the alternating series test: it converges conditionally.`,
            `这是 $p = ${f.p.toLatex()} < 1$ 的 $p$ 级数，所以 $\\sum |a_n|$ 发散。但大小递减趋于 $0$ 且符号交替，由交错级数判别法级数收敛：条件收敛。`,
          ),
    ],
  ];
}

/** absoluteAndConditionalConvergence separates absolute from conditional convergence. */
export const absoluteAndConditionalConvergence: TopicDef = {
  id: "absolute-and-conditional-convergence",
  title: t("Absolute and Conditional Convergence", "绝对收敛与条件收敛"),
  summary: t(
    "Σaₙ converges absolutely when Σ|aₙ| converges, and conditionally when it converges but Σ|aₙ| does not.",
    "若 Σ|aₙ| 收敛，则 Σaₙ 绝对收敛；若 Σaₙ 收敛而 Σ|aₙ| 发散，则称条件收敛。",
  ),
  intro: t(
    "Both of these series converge by the alternating series test:\n\n$$\\sum \\frac{(-1)^{n+1}}{n}, \\qquad \\sum \\frac{(-1)^{n+1}}{n^{2}}$$\n\nDrop the signs, though, and they part ways: $\\sum \\frac{1}{n}$ diverges while $\\sum \\frac{1}{n^{2}}$ converges. The first needs its signs to converge; the second does not.\n\nCheck: the partial sums of $\\sum \\frac{1}{n}$ pass $2$ by $n = 4$ ($\\frac{25}{12}$) and keep growing, while those of $\\sum \\frac{1}{n^{2}}$ stay below $2$.\n\nIn this lesson we sort convergent series into those that converge absolutely and those that converge only conditionally.",
    "这两个级数都由交错级数判别法收敛：\n\n$$\\sum \\frac{(-1)^{n+1}}{n}, \\qquad \\sum \\frac{(-1)^{n+1}}{n^{2}}$$\n\n但去掉符号后它们就不同了：$\\sum \\frac{1}{n}$ 发散，而 $\\sum \\frac{1}{n^{2}}$ 收敛。第一个要靠符号才收敛，第二个不需要。\n\n检验：$\\sum \\frac{1}{n}$ 的部分和到 $n = 4$ 就超过 $2$（$\\frac{25}{12}$），并继续增大；而 $\\sum \\frac{1}{n^{2}}$ 的部分和始终小于 $2$。\n\n这节课我们把收敛级数分为绝对收敛和仅条件收敛两类。",
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
        "If $\\sum |a_n|$ converges, then $\\sum a_n$ converges too; it **converges absolutely**. If $\\sum a_n$ converges but $\\sum |a_n|$ diverges, it **converges conditionally**:\n\n$$\\sum |a_n| \\text{ converges} \\implies \\sum a_n \\text{ converges}$$\n\nCheck $\\sum |a_n|$ first, then the alternating series test. For example, $\\sum \\frac{(-1)^{n}}{\\sqrt{n}}$ converges conditionally: $\\sum \\frac{1}{\\sqrt{n}}$ is a $p$-series with $p = \\frac{1}{2}$ and diverges, while $\\frac{1}{\\sqrt{n}}$ decreases to $0$.\n\nCheck: $\\int_{1}^{b} \\frac{dx}{\\sqrt{x}} = 2\\sqrt{b} - 2$ grows without bound, so the integral test also says $\\sum \\frac{1}{\\sqrt{n}}$ diverges.\n\n> **Watch out.** A series whose terms do not tend to $0$ diverges outright, such as $\\sum (-1)^{n} \\frac{n}{n + 1}$; it is not conditionally convergent.",
        "若 $\\sum |a_n|$ 收敛，则 $\\sum a_n$ 也收敛，称为**绝对收敛**。若 $\\sum a_n$ 收敛而 $\\sum |a_n|$ 发散，称为**条件收敛**：\n\n$$\\sum |a_n| \\text{ 收敛} \\implies \\sum a_n \\text{ 收敛}$$\n\n先检查 $\\sum |a_n|$，再用交错级数判别法。例如 $\\sum \\frac{(-1)^{n}}{\\sqrt{n}}$ 条件收敛：$\\sum \\frac{1}{\\sqrt{n}}$ 是 $p = \\frac{1}{2}$ 的 $p$ 级数，发散，而 $\\frac{1}{\\sqrt{n}}$ 递减趋于 $0$。\n\n检验：$\\int_{1}^{b} \\frac{dx}{\\sqrt{x}} = 2\\sqrt{b} - 2$ 无限增大，所以积分判别法也说明 $\\sum \\frac{1}{\\sqrt{n}}$ 发散。\n\n> **注意。** 各项不趋于 $0$ 的级数直接发散，例如 $\\sum (-1)^{n} \\frac{n}{n + 1}$；它不是条件收敛。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const c = rng.int(1, 9);
        if (kind === 0) {
          const f = powerForm(rng);
          const abs = f.p.toNumber() > 1;
          return modeChoice(
            rng,
            `(-1)^{n} ${f.tex}`,
            abs ? 0 : 1,
            abs ? absReasons : conditionalReasons,
            walked(
              powerSteps(f, t("Drop the signs and write the sizes as a power of $n$:", "去掉符号，把大小写成 $n$ 的幂：")),
              pIntegral(f.p),
            ),
          );
        }
        if (kind === 1) {
          const x = rationalTerm(rng);
          const abs = x.d > 1;
          const b = compareWith(x.d);
          return modeChoice(
            rng,
            `(-1)^{n} ${x.tex}`,
            abs ? 0 : 1,
            abs ? absReasons : conditionalReasons,
            walked(
              [
                [
                  ["Test the absolute series", "检验绝对值级数"],
                  t(`Compare $|a_n| = ${x.tex}$ with $${b}$:`, `把 $|a_n| = ${x.tex}$ 与 $${b}$ 比较：`),
                  [`\\frac{|a_n|}{${b}} \\to ${x.ratio.toLatex()}`],
                ],
                [
                  ["Classify", "判断类型"],
                  abs
                    ? t(
                        `By limit comparison with the $p$-series with $p = ${x.d} > 1$, $\\sum |a_n|$ converges: the series converges absolutely.`,
                        `与 $p = ${x.d} > 1$ 的 $p$ 级数作极限比较，$\\sum |a_n|$ 收敛：级数绝对收敛。`,
                      )
                    : t(
                        "By limit comparison with the harmonic series, $\\sum |a_n|$ diverges. But the sizes eventually decrease to $0$ and the signs alternate, so the series converges by the alternating series test: it converges conditionally.",
                        "与调和级数作极限比较，$\\sum |a_n|$ 发散。但大小最终递减趋于 $0$ 且符号交替，由交错级数判别法级数收敛：条件收敛。",
                      ),
                ],
              ],
              abs
                ? t(
                    `Compare directly instead: $|a_n| \\le \\frac{${x.p + x.q}}{${term(x.r, pw(x.d))}}$, because the numerator is at most $${x.p + x.q}${pw(x.a)}$ and the denominator is more than $${term(x.r, pw(x.b))}$. That is a multiple of the convergent $\\sum ${b}$.`,
                    `改为直接比较：$|a_n| \\le \\frac{${x.p + x.q}}{${term(x.r, pw(x.d))}}$，因为分子至多为 $${x.p + x.q}${pw(x.a)}$，而分母大于 $${term(x.r, pw(x.b))}$。这是收敛级数 $\\sum ${b}$ 的倍数。`,
                  )
                : t(
                    `Compare directly instead: the denominator is at most $${x.r + x.s}${pw(x.b)}$, so $|a_n| \\ge \\frac{${x.p}}{${x.r + x.s}n}$, a multiple of the divergent harmonic series. So $\\sum |a_n|$ indeed diverges.`,
                    `改为直接比较：分母至多为 $${x.r + x.s}${pw(x.b)}$，所以 $|a_n| \\ge \\frac{${x.p}}{${x.r + x.s}n}$，是发散的调和级数的倍数。所以 $\\sum |a_n|$ 确实发散。`,
                  ),
            ),
          );
        }
        const k = rng.int(1, 9);
        const b = `\\frac{${term(c, "n")}}{${shift(k)}}`;
        return modeChoice(
          rng,
          `(-1)^{n} ${b}`,
          2,
          [
            t(
              `Absolute convergence needs $\\sum |a_n|$ to converge, but its terms tend to $${c}$, not $0$.`,
              `绝对收敛需要 $\\sum |a_n|$ 收敛，但它的各项趋于 $${c}$，不趋于 $0$。`,
            ),
            t(
              "Conditional convergence still needs the series to converge, and terms that do not tend to $0$ rule that out.",
              "条件收敛仍要求级数收敛，而不趋于 $0$ 的项排除了这一点。",
            ),
          ],
          walked(
            [
              [
                ["Find the limit of the sizes", "求大小的极限"],
                t("Divide the numerator and the denominator by $n$:", "分子分母同除以 $n$："),
                [`|a_n| = ${b} \\to ${c} \\neq 0`],
              ],
              [
                ["Classify", "判断类型"],
                t(
                  "The terms do not tend to $0$, so the series diverges by the $n$th term test.",
                  "各项不趋于 $0$，所以由第 $n$ 项判别法，级数发散。",
                ),
              ],
            ],
            t(
              `Bound the sizes from below instead. Since $n \\ge 1$, every size is at least the same number: $|a_n| = \\frac{${c}n}{${shift(k)}} \\ge ${frac(c, 1 + k)}$. So the terms never come near $0$.`,
              `改为给大小一个下界：由于 $n \\ge 1$，对每个 $n$ 都有 $|a_n| = \\frac{${c}n}{${shift(k)}} \\ge ${frac(c, 1 + k)}$，所以各项从不接近 $0$。`,
            ),
          ),
        );
      },
    },
    {
      id: "signs-that-are-not-strictly-alternating",
      title: t("Signs given by trigonometric or negative bases", "由三角函数或负底数给出的符号"),
      explanation: t(
        "Absolute convergence settles series whose signs do not simply alternate. Since $|\\sin(3n)| \\le 1$,\n\n$$\\left|\\frac{\\sin(3n)}{n^{2}}\\right| \\le \\frac{1}{n^{2}}$$\n\nSo $\\sum \\frac{\\sin(3n)}{n^{2}}$ converges absolutely. A factor $\\cos(n\\pi)$ is just $(-1)^{n}$, and $\\sum \\frac{(-2)^{n}}{5^{n}}$ is geometric with $|r| = \\frac{2}{5} < 1$, so it converges absolutely.\n\nCheck: the geometric sum is $\\frac{r}{1 - r} = \\frac{-2/5}{7/5} = -\\frac{2}{7}$, a finite number.\n\n> **Watch out.** The signs of $\\sin(3n)$ follow no pattern, so the alternating series test cannot be used; absolute convergence is the way in.",
        "绝对收敛可以处理符号并非简单交错的级数。由于 $|\\sin(3n)| \\le 1$，\n\n$$\\left|\\frac{\\sin(3n)}{n^{2}}\\right| \\le \\frac{1}{n^{2}}$$\n\n所以 $\\sum \\frac{\\sin(3n)}{n^{2}}$ 绝对收敛。因子 $\\cos(n\\pi)$ 就是 $(-1)^{n}$；而 $\\sum \\frac{(-2)^{n}}{5^{n}}$ 是 $|r| = \\frac{2}{5} < 1$ 的等比级数，所以绝对收敛。\n\n检验：这个等比级数的和为 $\\frac{r}{1 - r} = \\frac{-2/5}{7/5} = -\\frac{2}{7}$，是有限数。\n\n> **注意。** $\\sin(3n)$ 的符号没有规律，所以不能用交错级数判别法；要从绝对收敛入手。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const c = rng.int(2, 9);
        if (kind === 0) {
          const p = rng.int(2, 4);
          const trig = rng.pick(["\\sin", "\\cos"]);
          const a = `\\frac{${trig}(${c}n)}{n^{${p}}}`;
          return modeChoice(
            rng,
            a,
            0,
            absReasons,
            walked(
              [
                [
                  ["Bound the sizes", "估计大小"],
                  t(`Since $|${trig}(${c}n)| \\le 1$,`, `由于 $|${trig}(${c}n)| \\le 1$，`),
                  [`|a_n| \\le \\frac{1}{n^{${p}}}`],
                ],
                [
                  ["Classify", "判断类型"],
                  t(
                    `The $p$-series with $p = ${p} > 1$ converges, so by comparison $\\sum |a_n|$ converges: the series converges absolutely.`,
                    `$p = ${p} > 1$ 的 $p$ 级数收敛，所以由比较判别法 $\\sum |a_n|$ 收敛：级数绝对收敛。`,
                  ),
                ],
              ],
              t(
                `Bound the partial sums directly. By the integral test, $\\sum \\frac{1}{n^{${p}}} \\le 1 + \\int_{1}^{\\infty} \\frac{dx}{x^{${p}}} = ${Q.of(p, p - 1).toLatex()}$. So every partial sum of $\\sum |a_n|$ is at most $${Q.of(p, p - 1).toLatex()}$. Increasing and bounded, they converge.`,
                `直接估计部分和：由积分判别法，$\\sum \\frac{1}{n^{${p}}} \\le 1 + \\int_{1}^{\\infty} \\frac{dx}{x^{${p}}} = ${Q.of(p, p - 1).toLatex()}$，所以 $\\sum |a_n|$ 的每个部分和都不超过 $${Q.of(p, p - 1).toLatex()}$。递增且有界，所以收敛。`,
              ),
            ),
          );
        }
        if (kind === 1) {
          const f = powerForm(rng);
          const abs = f.p.toNumber() > 1;
          return modeChoice(
            rng,
            `\\cos(n\\pi) \\cdot ${f.tex}`,
            abs ? 0 : 1,
            abs ? absReasons : conditionalReasons,
            walked(
              powerSteps(
                f,
                t(
                  "Since $\\cos(n\\pi) = (-1)^{n}$, the signs alternate. Drop them and write the sizes as a power of $n$:",
                  "由于 $\\cos(n\\pi) = (-1)^{n}$，符号交替。去掉符号，把大小写成 $n$ 的幂：",
                ),
              ),
              pIntegral(f.p),
            ),
          );
        }
        const k = rng.int(2, 9);
        const m = rng.int(2, 9);
        const a = `\\frac{(-${k})^{n}}{${m}^{n}}`;
        const conv = k < m;
        const r = Q.of(k, m);
        return modeChoice(
          rng,
          a,
          conv ? 0 : 2,
          conv
            ? [
                t(
                  `Conditional convergence means $\\sum |a_n|$ diverges, but it is geometric with ratio $${r.toLatex()} < 1$ and converges.`,
                  `条件收敛意味着 $\\sum |a_n|$ 发散，但它是公比为 $${r.toLatex()} < 1$ 的等比级数，收敛。`,
                ),
                absReasons[1] as Text,
              ]
            : [
                t(
                  `$\\sum |a_n|$ is geometric with ratio $${r.toLatex()} \\ge 1$, so it diverges.`,
                  `$\\sum |a_n|$ 是公比为 $${r.toLatex()} \\ge 1$ 的等比级数，所以发散。`,
                ),
                t(
                  "Conditional convergence still needs the series to converge, and terms that do not tend to $0$ rule that out.",
                  "条件收敛仍要求级数收敛，而不趋于 $0$ 的项排除了这一点。",
                ),
              ],
          walked(
            [
              [
                ["Identify the series", "认出级数"],
                t("Both powers have exponent $n$, so the series is geometric:", "两个幂的指数都是 $n$，所以这是等比级数："),
                [`a_n = \\left(-${r.toLatex()}\\right)^{n}`],
              ],
              [
                ["Classify", "判断类型"],
                conv
                  ? t(
                      `$|r| = ${r.toLatex()} < 1$, so $\\sum |a_n|$ converges: the series converges absolutely.`,
                      `$|r| = ${r.toLatex()} < 1$，所以 $\\sum |a_n|$ 收敛：级数绝对收敛。`,
                    )
                  : t(
                      `$|r| = ${r.toLatex()} \\ge 1$, so the terms do not tend to $0$ and the series diverges.`,
                      `$|r| = ${r.toLatex()} \\ge 1$，所以各项不趋于 $0$，级数发散。`,
                    ),
              ],
            ],
            conv
              ? t(
                  `Sum it instead. With $r = -${r.toLatex()}$, the geometric sum is a finite number: $\\sum_{n=1}^{\\infty} r^{n} = \\frac{r}{1 - r} = ${Q.of(-k, m + k).toLatex()}$.`,
                  `改为直接求和：$r = -${r.toLatex()}$，$\\sum_{n=1}^{\\infty} r^{n} = \\frac{r}{1 - r} = ${Q.of(-k, m + k).toLatex()}$，是有限数。`,
                )
              : t(
                  `Look at the sizes instead: $|a_n| = \\left(${r.toLatex()}\\right)^{n} \\ge 1$ for every $n$, so no term is close to $0$.`,
                  `改为看大小：对每个 $n$ 都有 $|a_n| = \\left(${r.toLatex()}\\right)^{n} \\ge 1$，所以没有一项接近 $0$。`,
                ),
          ),
        );
      },
    },
  ],
};

/** ErrorTerm is bₙ for an alternating series Σ(−1)ⁿ⁺¹bₙ, with its value at a given n and the known sum. */
interface ErrorTerm {
  readonly tex: string;
  readonly at: (n: number) => Q;
  readonly at1: (n: number) => string;
  readonly sum: number;
  readonly sumTex: string;
}

/** factorial computes n!. */
const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

/** errorTerm picks bₙ = c/n², c/n³, c/n! or c/(n·2ⁿ), whose alternating sums are known. */
function errorTerm(rng: Rng): ErrorTerm {
  const c = rng.int(1, 9);
  const kind = rng.int(0, 3);
  const times = (s: string) => (c === 1 ? s : `${c} \\cdot ${s}`);
  if (kind === 0)
    return {
      tex: `\\frac{${c}}{n^{2}}`,
      at: (n) => Q.of(c, n * n),
      at1: (n) => `\\frac{${c}}{${n}^{2}}`,
      sum: (c * Math.PI ** 2) / 12,
      sumTex: times("\\frac{\\pi^{2}}{12}"),
    };
  if (kind === 1)
    return {
      tex: `\\frac{${c}}{n^{3}}`,
      at: (n) => Q.of(c, n ** 3),
      at1: (n) => `\\frac{${c}}{${n}^{3}}`,
      sum: c * 0.9015426773696957,
      sumTex: times("\\frac{3}{4}\\zeta(3)"),
    };
  if (kind === 2)
    return {
      tex: `\\frac{${c}}{n!}`,
      at: (n) => Q.of(c, factorial(n)),
      at1: (n) => `\\frac{${c}}{${n}!}`,
      sum: c * (1 - Math.exp(-1)),
      sumTex: times("\\left(1 - \\frac{1}{e}\\right)"),
    };
  return {
    tex: `\\frac{${c}}{n \\cdot 2^{n}}`,
    at: (n) => Q.of(c, n * 2 ** n),
    at1: (n) => `\\frac{${c}}{${n} \\cdot 2^{${n}}}`,
    sum: c * Math.log(1.5),
    sumTex: times("\\ln \\frac{3}{2}"),
  };
}

/** partialSum adds the first N terms of Σ(−1)ⁿ⁺¹bₙ as a decimal. */
const partialSum = (b: ErrorTerm, N: number) => {
  let s = 0;
  for (let n = 1; n <= N; n++) s += (-1) ** (n + 1) * b.at(n).toNumber();
  return s;
};

/** sig writes a small positive number with three significant figures. */
const sig = (x: number) => x.toPrecision(3);

/** knownError checks an alternating error bound against the known sum. */
function knownError(b: ErrorTerm, N: number): Text {
  const S = b.sum;
  const SN = partialSum(b, N);
  const bound = b.at(N + 1).toNumber();
  return t(
    `Compare with the known sum, $S = ${b.sumTex} \\approx ${dec(S, 7)}$. Then $S_{${N}} \\approx ${dec(SN, 7)}$, so the actual error is about $${sig(Math.abs(S - SN))}$, which is indeed at most $b_{${N + 1}} \\approx ${sig(bound)}$.`,
    `与已知的和比较：$S = ${b.sumTex} \\approx ${dec(S, 7)}$。而 $S_{${N}} \\approx ${dec(SN, 7)}$，所以实际误差约为 $${sig(Math.abs(S - SN))}$，确实不超过 $b_{${N + 1}} \\approx ${sig(bound)}$。`,
  );
}

/** conditionsStep checks the alternating series test for an error term. */
const conditionsStep = (b: ErrorTerm): Step => [
  ["Check the conditions", "检查条件"],
  t(
    `The sizes $b_n = ${b.tex}$ are positive, decrease and tend to $0$, so the series passes the alternating series test and the error bound applies.`,
    `大小 $b_n = ${b.tex}$ 为正、递减且趋于 $0$，所以级数满足交错级数判别法的条件，误差界适用。`,
  ),
];

/** theAlternatingSeriesErrorBound: the error after N terms is at most the first omitted term. */
export const theAlternatingSeriesErrorBound: TopicDef = {
  id: "the-alternating-series-error-bound",
  title: t("The Alternating Series Error Bound", "交错级数的误差界"),
  summary: t(
    "For a series that passes the alternating series test, $|S - S_N| \\le b_{N+1}$, the first term left out.",
    "对满足交错级数判别法条件的级数，$|S - S_N| \\le b_{N+1}$，即第一个被省略的项。",
  ),
  intro: t(
    "The series $\\sum \\frac{(-1)^{n+1}}{n!} = 1 - \\frac{1}{2} + \\frac{1}{6} - \\frac{1}{24} + \\cdots$ adds up to $1 - \\frac{1}{e} \\approx 0.63212$. Stopping after three terms gives\n\n$$S_3 = 1 - \\frac{1}{2} + \\frac{1}{6} = \\frac{2}{3} \\approx 0.66667$$\n\nThe error is about $0.0345$, less than the first term left out, $\\frac{1}{24} \\approx 0.0417$.\n\nCheck: the sum lies between $S_3 \\approx 0.66667$ and $S_4 = \\frac{5}{8} = 0.625$, and these two differ by exactly $\\frac{1}{24}$.\n\nIn this lesson we bound the error of a partial sum of an alternating series by the first term left out.",
    "级数 $\\sum \\frac{(-1)^{n+1}}{n!} = 1 - \\frac{1}{2} + \\frac{1}{6} - \\frac{1}{24} + \\cdots$ 的和为 $1 - \\frac{1}{e} \\approx 0.63212$。取前三项得\n\n$$S_3 = 1 - \\frac{1}{2} + \\frac{1}{6} = \\frac{2}{3} \\approx 0.66667$$\n\n误差约为 $0.0345$，小于第一个被省略的项 $\\frac{1}{24} \\approx 0.0417$。\n\n检验：和位于 $S_3 \\approx 0.66667$ 与 $S_4 = \\frac{5}{8} = 0.625$ 之间，而这两个数恰好相差 $\\frac{1}{24}$。\n\n这节课我们用第一个被省略的项来估计交错级数部分和的误差。",
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
        "The sum $S$ of an alternating series that passes the test always lies between consecutive partial sums, so stopping after $N$ terms errs by at most the next term:\n\n$$|S - S_N| \\le b_{N+1}$$\n\nFor $\\sum \\frac{(-1)^{n+1}}{n^{2}}$ and $N = 4$: $|S - S_4| \\le \\frac{1}{25} = 0.04$.\n\nCheck: the sum is $\\frac{\\pi^{2}}{12} \\approx 0.82247$ and $S_4 = \\frac{115}{144} \\approx 0.79861$, so the actual error is about $0.0239$, within $0.04$.\n\n> **Watch out.** The bound is the first term left out, $b_{N+1}$, not the last term kept, $b_N$.",
        "满足判别法条件的交错级数，其和 $S$ 总位于相邻两个部分和之间，所以取前 $N$ 项时误差不超过下一项：\n\n$$|S - S_N| \\le b_{N+1}$$\n\n对 $\\sum \\frac{(-1)^{n+1}}{n^{2}}$ 且 $N = 4$：$|S - S_4| \\le \\frac{1}{25} = 0.04$。\n\n检验：这个级数的和为 $\\frac{\\pi^{2}}{12} \\approx 0.82247$，而 $S_4 = \\frac{115}{144} \\approx 0.79861$，所以实际误差约为 $0.0239$，在 $0.04$ 之内。\n\n> **注意。** 误差界是第一个被省略的项 $b_{N+1}$，而不是保留的最后一项 $b_N$。",
      ),
      generate(rng) {
        const b = errorTerm(rng);
        const N = rng.int(2, 7);
        const answer = b.at(N + 1);
        return worked(
          t(
            `Use the alternating series error bound to find an upper bound for $|S - S_{${N}}|$, where $S = ${sigma(`(-1)^{n+1} ${b.tex}`)}$.`,
            `用交错级数的误差界，求 $|S - S_{${N}}|$ 的一个上界，其中 $S = ${sigma(`(-1)^{n+1} ${b.tex}`)}$。`,
          ),
          answer,
          [
            conditionsStep(b),
            [
              ["Take the first term left out", "取第一个被省略的项"],
              t(`After $${N}$ terms, the next one is $b_{${N + 1}}$:`, `取前 $${N}$ 项后，下一项是 $b_{${N + 1}}$：`),
              [`|S - S_{${N}}| \\le b_{${N + 1}} = ${eq(b.at1(N + 1), answer)}`],
            ],
          ],
          knownError(b, N),
          [
            slip(
              b.at(N),
              `This is $b_{${N}}$, the last term kept. The error is bounded by the first term left out.`,
              `这是保留的最后一项 $b_{${N}}$。误差的上界是第一个被省略的项。`,
            ),
            slip(
              b.at(N + 2),
              `This is $b_{${N + 2}}$, one term too far: it bounds the error of $S_{${N + 1}}$, not of $S_{${N}}$.`,
              `这是 $b_{${N + 2}}$，多走了一项：它是 $S_{${N + 1}}$ 的误差界，不是 $S_{${N}}$ 的。`,
            ),
          ],
        );
      },
    },
    {
      id: "terms-needed-for-an-alternating-series",
      title: t("How many terms are needed", "需要多少项"),
      explanation: t(
        "To guarantee $|S - S_N| < \\varepsilon$, find the first $N$ with\n\n$$b_{N+1} < \\varepsilon$$\n\nFor $\\sum \\frac{(-1)^{n+1}}{n!}$ and $\\varepsilon = \\frac{1}{1000}$: $\\frac{1}{6!} = \\frac{1}{720}$ is too large but $\\frac{1}{7!} = \\frac{1}{5040}$ is small enough, so $N + 1 = 7$ and $N = 6$.\n\nCheck: $S_6 = \\frac{91}{144} \\approx 0.631944$, and $1 - \\frac{1}{e} \\approx 0.632121$, an actual error of about $0.00018$, below $0.001$.\n\n> **Watch out.** The condition is on $b_{N+1}$, so the answer is one less than the index of the first small enough term.",
        "要保证 $|S - S_N| < \\varepsilon$，就找满足下式的第一个 $N$：\n\n$$b_{N+1} < \\varepsilon$$\n\n对 $\\sum \\frac{(-1)^{n+1}}{n!}$，$\\varepsilon = \\frac{1}{1000}$：$\\frac{1}{6!} = \\frac{1}{720}$ 还太大，而 $\\frac{1}{7!} = \\frac{1}{5040}$ 足够小，所以 $N + 1 = 7$，$N = 6$。\n\n检验：$S_6 = \\frac{91}{144} \\approx 0.631944$，而 $1 - \\frac{1}{e} \\approx 0.632121$，实际误差约为 $0.00018$，小于 $0.001$。\n\n> **注意。** 条件是关于 $b_{N+1}$ 的，所以答案比第一个足够小的项的下标少 $1$。",
      ),
      generate(rng) {
        const b = errorTerm(rng);
        const m = rng.pick([10, 50, 100, 500, 1000, 5000, 10000]);
        let N = 1;
        while (b.at(N + 1).toNumber() >= 1 / m) N++;
        const SN = partialSum(b, N);
        return worked(
          t(
            `Find the smallest $N$ for which the alternating series error bound guarantees $|S - S_N| < \\frac{1}{${m}}$, where $S = ${sigma(`(-1)^{n+1} ${b.tex}`)}$.`,
            `求使交错级数的误差界能保证 $|S - S_N| < \\frac{1}{${m}}$ 的最小 $N$，其中 $S = ${sigma(`(-1)^{n+1} ${b.tex}`)}$。`,
          ),
          Q.of(N),
          [
            conditionsStep(b),
            [
              ["Set the condition", "写出条件"],
              t("The error after $N$ terms is at most $b_{N+1}$, so we need", "取前 $N$ 项的误差不超过 $b_{N+1}$，所以需要"),
              [`b_{N+1} < \\frac{1}{${m}}`],
            ],
            [
              ["Test the terms", "逐项检验"],
              t(
                `The sizes decrease, so find the first one below $\\frac{1}{${m}}$:`,
                `大小递减，所以找第一个小于 $\\frac{1}{${m}}$ 的项：`,
              ),
              [
                `b_{${N}} = ${eq(b.at1(N), b.at(N))} \\ge \\frac{1}{${m}}, \\qquad b_{${N + 1}} = ${eq(b.at1(N + 1), b.at(N + 1))} < \\frac{1}{${m}}`,
              ],
            ],
            [["Read off N", "读出 N"], t(`So $N + 1 = ${N + 1}$ and $N = ${N}$.`, `所以 $N + 1 = ${N + 1}$，$N = ${N}$。`)],
          ],
          t(
            `Compare with the known sum, $S = ${b.sumTex} \\approx ${dec(b.sum, 7)}$. With $N = ${N}$, $S_{${N}} \\approx ${dec(SN, 7)}$, an actual error of about $${sig(Math.abs(b.sum - SN))}$, below $\\frac{1}{${m}} = ${1 / m}$.`,
            `与已知的和比较：$S = ${b.sumTex} \\approx ${dec(b.sum, 7)}$。取 $N = ${N}$ 时 $S_{${N}} \\approx ${dec(SN, 7)}$，实际误差约为 $${sig(Math.abs(b.sum - SN))}$，小于 $\\frac{1}{${m}} = ${1 / m}$。`,
          ),
          [
            slip(
              N + 1,
              `This is the index of the first small enough term, $b_{${N + 1}}$. The partial sum stops one term earlier, at $N = ${N}$.`,
              `这是第一个足够小的项 $b_{${N + 1}}$ 的下标。部分和要在它前一项停下，即 $N = ${N}$。`,
            ),
            slip(
              N - 1,
              `With $N = ${N - 1}$ the bound is $b_{${N}} = ${b.at(N).toLatex()}$, which is not less than $\\frac{1}{${m}}$.`,
              `取 $N = ${N - 1}$ 时误差界为 $b_{${N}} = ${b.at(N).toLatex()}$，并不小于 $\\frac{1}{${m}}$。`,
            ),
          ],
        );
      },
    },
  ],
};

/** InequalitySlip is a wrong relation with the reason it is wrong. */
type InequalitySlip = readonly [InequalityOp, Q, string, string];

/** reasonedInequality asks for an inequality for p, explains it in steps with a check, and answers each wrong relation with its reason. */
function reasonedInequality(
  prompt: Text,
  op: InequalityOp,
  value: Q,
  parts: readonly Step[],
  check: Text,
  slips: readonly InequalitySlip[],
): Problem {
  const kept = slips.filter(([o, v]) => o !== op || !v.eq(value));
  return withMistakes(
    inequalityProblem({ prompt, variable: "p", op, value, wrong: kept.map(([o, v]) => [o, v] as const), solution: walked(parts, check) }),
    kept.map(([o, v, en, zh]) => ({ response: inequalityLatex("p", o, v), why: t(en, zh) })),
  );
}

/** determiningConvergenceParametersForInfiniteSeries finds the parameter values for which a series converges. */
export const determiningConvergenceParametersForInfiniteSeries: TopicDef = {
  id: "determining-convergence-parameters-for-infinite-series",
  title: t("Determining Convergence Parameters for Infinite Series", "确定无穷级数收敛的参数范围"),
  summary: t(
    "Reduce a series with a parameter to a p-series or a geometric series, then solve the condition for convergence.",
    "把含参数的级数化为 p 级数或等比级数，再解收敛的条件。",
  ),
  intro: t(
    "The series $\\sum \\frac{1}{n^{2p}}$ is a $p$-series with exponent $2p$. It converges exactly when the exponent is greater than $1$:\n\n$$2p > 1 \\iff p > \\frac{1}{2}$$\n\nCheck: at $p = 1$ the series is $\\sum \\frac{1}{n^{2}}$, which converges, and at the boundary $p = \\frac{1}{2}$ it is the harmonic series, which diverges.\n\nIn this lesson we find the values of a parameter that make a series converge.",
    "级数 $\\sum \\frac{1}{n^{2p}}$ 是指数为 $2p$ 的 $p$ 级数。它收敛当且仅当指数大于 $1$：\n\n$$2p > 1 \\iff p > \\frac{1}{2}$$\n\n检验：$p = 1$ 时级数为 $\\sum \\frac{1}{n^{2}}$，收敛；在边界 $p = \\frac{1}{2}$ 处它是调和级数，发散。\n\n这节课我们求使级数收敛的参数取值。",
  ),
  prerequisites: ["the-limit-comparison-test", "the-ratio-test"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "parameters-in-p-series",
      title: t("Parameters in p-series", "p 级数中的参数"),
      explanation: t(
        "Write the term as $\\frac{1}{n^{e}}$, where the exponent $e$ depends on the parameter, and solve $e > 1$. For $\\sum \\frac{n^{2}}{n^{3p}}$:\n\n$$\\frac{n^{2}}{n^{3p}} = \\frac{1}{n^{3p - 2}}$$\n\nIt converges when $3p - 2 > 1$, that is $p > 1$.\n\nCheck: at $p = 1$ the term is $\\frac{1}{n}$, the divergent harmonic series, so the boundary is excluded; at $p = 2$ it is $\\frac{1}{n^{4}}$, which converges.\n\n> **Watch out.** Solve $e > 1$, not $e > 0$. With $0 < e \\le 1$ the terms still tend to $0$, but the series diverges.",
        "把各项写成 $\\frac{1}{n^{e}}$，其中指数 $e$ 依赖于参数，再解 $e > 1$。对 $\\sum \\frac{n^{2}}{n^{3p}}$：\n\n$$\\frac{n^{2}}{n^{3p}} = \\frac{1}{n^{3p - 2}}$$\n\n当 $3p - 2 > 1$ 即 $p > 1$ 时收敛。\n\n检验：$p = 1$ 时各项为 $\\frac{1}{n}$，是发散的调和级数，所以边界不包括在内；$p = 2$ 时各项为 $\\frac{1}{n^{4}}$，收敛。\n\n> **注意。** 要解 $e > 1$，而不是 $e > 0$。当 $0 < e \\le 1$ 时各项仍趋于 $0$，但级数发散。",
      ),
      generate(rng) {
        const a = rng.int(1, 5);
        const b = rng.int(1, 4);
        const pos = rng.bool();
        const value = pos ? Q.of(a + 1, b) : Q.of(a - 1, b);
        const inside = pos ? Q.of(a + 2, b) : Q.of(a - 2, b);
        const bp = b === 1 ? "p" : `${b}p`;
        const na = a === 1 ? "n" : `n^{${a}}`;
        const tex = pos ? `\\frac{${na}}{n^{${bp}}}` : `\\frac{n^{${bp}}}{${na}}`;
        const e = pos ? `${bp} - ${a}` : `${a} - ${bp}`;
        const solve = pos
          ? `${bp} - ${a} > 1 \\iff ${bp} > ${a + 1} \\iff p > ${value.toLatex()}`
          : `${a} - ${bp} > 1 \\iff ${bp} < ${a - 1} \\iff p < ${value.toLatex()}`;
        return reasonedInequality(
          t(
            `For which values of $p$ does $${sigma(tex)}$ converge? Give an inequality for $p$.`,
            `$p$ 取哪些值时 $${sigma(tex)}$ 收敛？写出关于 $p$ 的不等式。`,
          ),
          pos ? ">" : "<",
          value,
          [
            [
              ["Combine the powers", "合并幂"],
              t("Dividing powers of $n$ subtracts the exponents:", "$n$ 的幂相除，指数相减："),
              [`${tex} = \\frac{1}{n^{${e}}}`],
            ],
            [
              ["Apply the p-series condition", "用 p 级数的条件"],
              t("A $p$-series converges exactly when its exponent is greater than $1$:", "$p$ 级数收敛当且仅当指数大于 $1$："),
              [solve],
            ],
          ],
          t(
            `Test the boundary and a value inside. At $p = ${value.toLatex()}$ the exponent is $1$, the divergent harmonic series, so the boundary is excluded. At $p = ${inside.toLatex()}$ the exponent is $2$, and $\\sum \\frac{1}{n^{2}}$ converges.`,
            `检验边界和区间内的一个值。$p = ${value.toLatex()}$ 时指数为 $1$，是发散的调和级数，所以不含边界。$p = ${inside.toLatex()}$ 时指数为 $2$，$\\sum \\frac{1}{n^{2}}$ 收敛。`,
          ),
          pos
            ? [
                [
                  ">=",
                  value,
                  `At $p = ${value.toLatex()}$ the exponent is exactly $1$, the harmonic series, which diverges.`,
                  `$p = ${value.toLatex()}$ 时指数恰为 $1$，是调和级数，发散。`,
                ],
                [
                  ">",
                  Q.of(a, b),
                  "This solves exponent $> 0$, which only makes the terms tend to $0$. Convergence needs exponent $> 1$.",
                  "这里解的是指数 $> 0$，那只能使各项趋于 $0$。收敛需要指数 $> 1$。",
                ],
              ]
            : [
                [
                  "<=",
                  value,
                  `At $p = ${value.toLatex()}$ the exponent is exactly $1$, the harmonic series, which diverges.`,
                  `$p = ${value.toLatex()}$ 时指数恰为 $1$，是调和级数，发散。`,
                ],
                [
                  ">",
                  value,
                  `The exponent $${e}$ gets smaller as $p$ grows, so it exceeds $1$ for small $p$: the inequality is reversed.`,
                  `指数 $${e}$ 随 $p$ 增大而减小，所以在 $p$ 较小时才大于 $1$：不等号方向反了。`,
                ],
              ],
        );
      },
    },
    {
      id: "parameters-in-geometric-series",
      title: t("Parameters in geometric series", "等比级数中的参数"),
      explanation: t(
        "Write the term as $c \\cdot r^{n}$, where the ratio $r$ depends on the parameter, and solve $|r| < 1$. For $p > 0$, $\\sum \\left(\\frac{3}{p}\\right)^{n}$ has $r = \\frac{3}{p}$, so\n\n$$\\frac{3}{p} < 1 \\iff p > 3$$\n\nAnd $\\sum \\frac{p^{n}}{5^{n + 1}} = \\sum \\frac{1}{5}\\left(\\frac{p}{5}\\right)^{n}$ converges for $0 < p < 5$.\n\nCheck: at $p = 6$, $\\sum \\left(\\frac{1}{2}\\right)^{n} = 1$, a finite sum; at $p = 3$ every term is $1$, and the series diverges.\n\n> **Watch out.** At the boundary $r = 1$ the terms do not shrink, so the boundary is excluded.",
        "把各项写成 $c \\cdot r^{n}$，其中公比 $r$ 依赖于参数，再解 $|r| < 1$。对 $p > 0$，$\\sum \\left(\\frac{3}{p}\\right)^{n}$ 的公比 $r = \\frac{3}{p}$，所以\n\n$$\\frac{3}{p} < 1 \\iff p > 3$$\n\n而 $\\sum \\frac{p^{n}}{5^{n + 1}} = \\sum \\frac{1}{5}\\left(\\frac{p}{5}\\right)^{n}$ 在 $0 < p < 5$ 时收敛。\n\n检验：$p = 6$ 时 $\\sum \\left(\\frac{1}{2}\\right)^{n} = 1$，是有限的和；$p = 3$ 时每一项都是 $1$，级数发散。\n\n> **注意。** 在边界 $r = 1$ 处各项不变小，所以边界不包括在内。",
      ),
      generate(rng) {
        const k = rng.int(2, 12);
        const m = rng.int(1, 4);
        const below = rng.bool();
        const value = Q.of(k, m);
        const mp = m === 1 ? "p" : `${m}p`;
        const tex = below ? `\\left(\\frac{${k}}{${mp}}\\right)^{n}` : `\\frac{(${mp})^{n}}{${k}^{n + 1}}`;
        const r = below ? `\\frac{${k}}{${mp}}` : `\\frac{${mp}}{${k}}`;
        const inside = below ? value.mul(Q.of(2)) : value.div(Q.of(2));
        const slips: InequalitySlip[] = [
          [
            below ? ">=" : "<=",
            value,
            `At $p = ${value.toLatex()}$ the ratio is exactly $1$, so every term is the same and the series diverges.`,
            `$p = ${value.toLatex()}$ 时公比恰为 $1$，每一项都相同，级数发散。`,
          ],
          [
            below ? "<" : ">",
            value,
            below
              ? `The ratio $${r}$ gets smaller as $p$ grows, so it is below $1$ for large $p$: the inequality is reversed.`
              : `The ratio $${r}$ grows with $p$, so it is below $1$ for small $p$: the inequality is reversed.`,
            below
              ? `公比 $${r}$ 随 $p$ 增大而减小，所以 $p$ 较大时才小于 $1$：不等号方向反了。`
              : `公比 $${r}$ 随 $p$ 增大而增大，所以 $p$ 较小时才小于 $1$：不等号方向反了。`,
          ],
        ];
        if (m > 1)
          slips.push([
            below ? ">" : "<",
            Q.of(k),
            `This leaves out the coefficient $${m}$ of $p$ when solving.`,
            `解的时候漏掉了 $p$ 的系数 $${m}$。`,
          ]);
        return reasonedInequality(
          t(
            `For which positive values of $p$ does $${sigma(tex)}$ converge? Give an inequality for $p$.`,
            `$p$ 取哪些正数值时 $${sigma(tex)}$ 收敛？写出关于 $p$ 的不等式。`,
          ),
          below ? ">" : "<",
          value,
          [
            [
              ["Find the ratio", "求公比"],
              below
                ? t("Each term is the previous one times the same factor:", "每一项都是前一项乘以同一个因子：")
                : t(`Write $${k}^{n + 1} = ${k} \\cdot ${k}^{n}$:`, `把 $${k}^{n + 1}$ 写成 $${k} \\cdot ${k}^{n}$：`),
              [below ? `r = ${r}` : `${tex} = \\frac{1}{${k}}\\left(${r}\\right)^{n}, \\qquad r = ${r}`],
            ],
            [
              ["Solve |r| < 1", "解 |r| < 1"],
              t("For positive $p$ the ratio is positive, so solve", "当 $p$ 为正时公比为正，所以解"),
              [`${r} < 1 \\iff ${below ? `p > ${value.toLatex()}` : `p < ${value.toLatex()}`}`],
            ],
          ],
          below
            ? t(
                `Test the boundary and a value inside. At $p = ${inside.toLatex()}$ the ratio is $\\frac{1}{2}$, and the sum is finite: $\\sum \\left(\\frac{1}{2}\\right)^{n} = 1$. At $p = ${value.toLatex()}$ every term is $1$, and the series diverges.`,
                `检验边界和区间内的一个值。$p = ${inside.toLatex()}$ 时公比为 $\\frac{1}{2}$，$\\sum \\left(\\frac{1}{2}\\right)^{n} = 1$，是有限的和。$p = ${value.toLatex()}$ 时每一项都是 $1$，级数发散。`,
              )
            : t(
                `Test the boundary and a value inside. At $p = ${inside.toLatex()}$ the ratio is $\\frac{1}{2}$, and the sum is finite: $\\frac{1}{${k}} \\sum \\left(\\frac{1}{2}\\right)^{n} = \\frac{1}{${k}}$. At $p = ${value.toLatex()}$ every term is $\\frac{1}{${k}}$, and the series diverges.`,
                `检验边界和区间内的一个值。$p = ${inside.toLatex()}$ 时公比为 $\\frac{1}{2}$，和为 $\\frac{1}{${k}} \\sum \\left(\\frac{1}{2}\\right)^{n} = \\frac{1}{${k}}$，有限。$p = ${value.toLatex()}$ 时每一项都是 $\\frac{1}{${k}}$，级数发散。`,
              ),
          slips,
        );
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

/** MethodName names a method of methods. */
type MethodName = keyof typeof methods;

/** notThis says why a method does not settle a series of a given kind most directly. */
function notThis(method: MethodName, kind: MethodName): Text {
  const ratioOne = t(
    "The ratio of consecutive terms tends to $1$ here, so the ratio test is inconclusive.",
    "这里相邻两项之比趋于 $1$，所以比值判别法无法下结论。",
  );
  const reasons: Record<MethodName, Text> = {
    geometric: t(
      "The terms are not a constant times $r^{n}$, so this is not a geometric series.",
      "各项不是常数乘以 $r^{n}$，所以不是等比级数。",
    ),
    p: t(
      "The terms are not a constant times $\\frac{1}{n^{p}}$, so this is not a $p$-series.",
      "各项不是常数乘以 $\\frac{1}{n^{p}}$，所以不是 $p$ 级数。",
    ),
    nth: t("The terms tend to $0$, so the $n$th term test is inconclusive here.", "各项趋于 $0$，所以第 $n$ 项判别法在这里无法下结论。"),
    ratio:
      kind === "geometric"
        ? t(
            "The ratio test works, but it only rediscovers the common ratio; recognizing the geometric series is more direct.",
            "比值判别法可以用，但它只是重新求出公比；直接识别为等比级数更直接。",
          )
        : ratioOne,
    alternating: t("The terms are all positive, so the series is not alternating.", "各项都为正，所以不是交错级数。"),
    telescoping: t(
      "The terms are not a difference of consecutive values of one expression, so nothing cancels.",
      "各项不是同一个式子相邻两个值之差，所以不能相消。",
    ),
  };
  return reasons[method];
}

/** moreMethods are the remaining tests for the second choice. */
const moreMethods = {
  limit: t("The limit comparison test", "极限比较判别法"),
  comparison: t("The direct comparison test", "直接比较判别法"),
  root: t("The root test", "根值判别法"),
  integral: t("The integral test", "积分判别法"),
  ratio: methods.ratio,
  geometric: methods.geometric,
} as const;

/** MoreName names a method of moreMethods. */
type MoreName = keyof typeof moreMethods;

/** selectingProceduresForAnalyzingInfiniteSeries chooses the most efficient test. */
export const selectingProceduresForAnalyzingInfiniteSeries: TopicDef = {
  id: "selecting-procedures-for-analyzing-infinite-series",
  title: t("Selecting Procedures for Analyzing Infinite Series", "选择分析无穷级数的方法"),
  summary: t(
    "Match the form of the terms to a test: geometric and p-series by sight, the nth term test when terms do not shrink, ratios for factorials, the alternating series test for signs that alternate.",
    "按项的形式选判别法：等比级数和 p 级数一眼识别，项不趋于 0 时用第 n 项判别法，有阶乘用比值判别法，正负交替用交错级数判别法。",
  ),
  intro: t(
    "The terms of $\\sum \\frac{2^{n}}{n!}$ contain a factorial, which cancels neatly in a ratio of consecutive terms:\n\n$$\\frac{a_{n+1}}{a_n} = \\frac{2}{n + 1} \\to 0 < 1$$\n\nSo the ratio test shows at once that the series converges. A comparison or the integral test would be far harder here.\n\nCheck: $\\sum_{n=0}^{\\infty} \\frac{2^{n}}{n!} = e^{2}$, so the series from $n = 1$ adds up to $e^{2} - 1 \\approx 6.39$, a finite number.\n\nIn this lesson we read the form of the terms to choose the test that settles a series most directly.",
    "$\\sum \\frac{2^{n}}{n!}$ 的各项含阶乘，在相邻两项之比中能干净地约去：\n\n$$\\frac{a_{n+1}}{a_n} = \\frac{2}{n + 1} \\to 0 < 1$$\n\n所以比值判别法立即说明级数收敛。这里用比较或积分判别法会困难得多。\n\n检验：$\\sum_{n=0}^{\\infty} \\frac{2^{n}}{n!} = e^{2}$，所以从 $n = 1$ 起的级数之和为 $e^{2} - 1 \\approx 6.39$，是有限数。\n\n这节课我们根据项的形式，选出最直接地判断级数敛散性的判别法。",
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
        "Look at the form of the terms first:\n\n- $c \\, r^{n}$: a **geometric series**, convergent exactly when $|r| < 1$.\n- $\\frac{1}{n^{p}}$, possibly with roots: a **$p$-series**, convergent exactly when $p > 1$.\n- terms that do not tend to $0$: the **$n$th term test** shows divergence.\n- factorials or $n$ in an exponent: the **ratio test**.\n- $(-1)^{n} b_n$ with $b_n \\to 0$: the **alternating series test**.\n- $\\frac{1}{(n + a)(n + a + 1)}$: partial fractions and **telescoping** give the sum itself.\n\nFor example, $\\sum \\frac{3}{(n + 1)(n + 2)}$ telescopes: $\\frac{3}{n + 1} - \\frac{3}{n + 2}$ leaves $S_N = \\frac{3}{2} - \\frac{3}{N + 2} \\to \\frac{3}{2}$.\n\nCheck: $S_2 = \\frac{3}{6} + \\frac{3}{12} = \\frac{3}{4}$, and the formula gives $\\frac{3}{2} - \\frac{3}{4} = \\frac{3}{4}$ too.\n\n> **Watch out.** The tests overlap, but the most direct one uses the form you can see. The ratio test on a $p$-series gives $L = 1$ and settles nothing.",
        "先看项的形式：\n\n- $c \\, r^{n}$：**等比级数**，当且仅当 $|r| < 1$ 时收敛。\n- $\\frac{1}{n^{p}}$（可能含根式）：**$p$ 级数**，当且仅当 $p > 1$ 时收敛。\n- 项不趋于 $0$：用**第 $n$ 项判别法**说明发散。\n- 含阶乘或指数中含 $n$：**比值判别法**。\n- $(-1)^{n} b_n$ 且 $b_n \\to 0$：**交错级数判别法**。\n- $\\frac{1}{(n + a)(n + a + 1)}$：部分分式后**裂项相消**，直接求出和。\n\n例如 $\\sum \\frac{3}{(n + 1)(n + 2)}$ 可以裂项相消：$\\frac{3}{n + 1} - \\frac{3}{n + 2}$ 使 $S_N = \\frac{3}{2} - \\frac{3}{N + 2} \\to \\frac{3}{2}$。\n\n检验：$S_2 = \\frac{3}{6} + \\frac{3}{12} = \\frac{3}{4}$，公式也给出 $\\frac{3}{2} - \\frac{3}{4} = \\frac{3}{4}$。\n\n> **注意。** 这些判别法有重叠，但最直接的是用你看得见的形式。对 $p$ 级数用比值判别法得到 $L = 1$，什么也判断不了。",
      ),
      generate(rng) {
        const c = rng.int(1, 9);
        const k = rng.int(2, 9);
        const kind = rng.pick(Object.keys(methods) as MethodName[]);
        const cases: Record<MethodName, readonly [string, Text, Text]> = {
          geometric: [
            `\\frac{${c}}{${k}^{n}}`,
            t(
              `The terms are $${term(c, `\\left(\\frac{1}{${k}}\\right)^{n}`)}$, geometric with ratio $\\frac{1}{${k}} < 1$, so the series converges.`,
              `各项为 $${term(c, `\\left(\\frac{1}{${k}}\\right)^{n}`)}$，是公比为 $\\frac{1}{${k}} < 1$ 的等比级数，所以收敛。`,
            ),
            t(
              `Use the ratio test instead. The ratio is below $1$: $\\frac{a_{n+1}}{a_n} = \\frac{1}{${k}} < 1$. So the series converges, and its sum is $\\frac{${c}/${k}}{1 - 1/${k}} = ${Q.of(c, k - 1).toLatex()}$.`,
              `改用比值判别法：$\\frac{a_{n+1}}{a_n} = \\frac{1}{${k}} < 1$，所以级数收敛，它的和为 $\\frac{${c}/${k}}{1 - 1/${k}} = ${Q.of(c, k - 1).toLatex()}$。`,
            ),
          ],
          p: [
            `\\frac{${c}}{n^{${k}}}`,
            t(
              `The terms are a multiple of $\\frac{1}{n^{${k}}}$, a $p$-series with $p = ${k} > 1$, so the series converges.`,
              `各项是 $\\frac{1}{n^{${k}}}$ 的倍数，是 $p = ${k} > 1$ 的 $p$ 级数，所以收敛。`,
            ),
            t(
              `Use the integral test instead: $\\int_{1}^{\\infty} \\frac{${c}}{x^{${k}}} \\, dx = ${Q.of(c, k - 1).toLatex()}$. The integral is finite, so the series converges.`,
              `改用积分判别法：$\\int_{1}^{\\infty} \\frac{${c}}{x^{${k}}} \\, dx = ${Q.of(c, k - 1).toLatex()}$，是有限值，所以级数收敛。`,
            ),
          ],
          nth: [
            `\\frac{${term(c, "n")}}{${shift(k)}}`,
            t(
              `The terms tend to $${c} \\neq 0$, so the $n$th term test shows divergence at once.`,
              `各项趋于 $${c} \\neq 0$，第 $n$ 项判别法立即说明发散。`,
            ),
            t(
              `Bound the terms instead: since $n \\ge 1$, $\\frac{${c}n}{${shift(k)}} \\ge ${frac(c, 1 + k)}$, so the partial sums grow by at least $${frac(c, 1 + k)}$ at every step and cannot settle.`,
              `改为估计各项：由于 $n \\ge 1$，$\\frac{${c}n}{${shift(k)}} \\ge ${frac(c, 1 + k)}$，所以部分和每一步至少增加 $${frac(c, 1 + k)}$，不会稳定下来。`,
            ),
          ],
          ratio: [
            `\\frac{${k}^{n}}{n!}`,
            t(
              `Factorials cancel well, and the ratio tends to $0$: $\\frac{a_{n+1}}{a_n} = \\frac{${k}}{n + 1} \\to 0 < 1$. So the ratio test shows convergence.`,
              `阶乘容易约去：$\\frac{a_{n+1}}{a_n} = \\frac{${k}}{n + 1} \\to 0 < 1$，所以比值判别法说明收敛。`,
            ),
            t(
              `Recognize the exponential series instead: $\\sum_{n=0}^{\\infty} \\frac{${k}^{n}}{n!} = e^{${k}}$. So this series adds up to $e^{${k}} - 1$, a finite number.`,
              `改为认出指数级数：$\\sum_{n=0}^{\\infty} \\frac{${k}^{n}}{n!} = e^{${k}}$，所以这个级数的和为 $e^{${k}} - 1$，是有限数。`,
            ),
          ],
          alternating: [
            `\\frac{(-1)^{n}}{${shift(k)}}`,
            t(
              `The signs alternate and $\\frac{1}{${shift(k)}}$ decreases to $0$, so the alternating series test shows convergence.`,
              `符号正负交替，且 $\\frac{1}{${shift(k)}}$ 递减趋于 $0$，所以交错级数判别法说明收敛。`,
            ),
            t(
              `Pair the terms instead: terms $2m - 1$ and $2m$ add up to $-\\frac{1}{(2m - 1 + ${k})(2m + ${k})}$, whose size is at most $\\frac{1}{4m^{2}}$. The paired sums converge by comparison with $\\sum \\frac{1}{m^{2}}$, and the single terms tend to $0$, so the series converges.`,
              `改为两两配对：第 $2m - 1$ 项与第 $2m$ 项之和为 $-\\frac{1}{(2m - 1 + ${k})(2m + ${k})}$，其大小不超过 $\\frac{1}{4m^{2}}$。与 $\\sum \\frac{1}{m^{2}}$ 比较，配对后的和收敛，而单独的项趋于 $0$，所以级数收敛。`,
            ),
          ],
          telescoping: [
            `\\frac{${c}}{(${shift(k)})(${shift(k + 1)})}`,
            t(
              `Partial fractions give $\\frac{${c}}{${shift(k)}} - \\frac{${c}}{${shift(k + 1)}}$, so $S_N = \\frac{${c}}{${1 + k}} - \\frac{${c}}{N + ${k + 1}} \\to ${Q.of(c, 1 + k).toLatex()}$.`,
              `部分分式得 $\\frac{${c}}{${shift(k)}} - \\frac{${c}}{${shift(k + 1)}}$，所以 $S_N = \\frac{${c}}{${1 + k}} - \\frac{${c}}{N + ${k + 1}} \\to ${Q.of(c, 1 + k).toLatex()}$。`,
            ),
            t(
              `Check the first partial sum, $S_1 = \\frac{${c}}{${(1 + k) * (2 + k)}}$. The formula gives the same value: $\\frac{${c}}{${1 + k}} - \\frac{${c}}{${2 + k}} = ${Q.of(c, (1 + k) * (2 + k)).toLatex()}$.`,
              `检验第一个部分和：$S_1 = \\frac{${c}}{${(1 + k) * (2 + k)}}$，公式给出 $\\frac{${c}}{${1 + k}} - \\frac{${c}}{${2 + k}} = ${Q.of(c, (1 + k) * (2 + k)).toLatex()}$，相同。`,
            ),
          ],
        };
        const [series, why, check] = cases[kind];
        const others = rng.shuffle((Object.keys(methods) as MethodName[]).filter((m) => m !== kind)).slice(0, 3);
        return explainedChoice(rng, {
          prompt: t(
            `Which method settles the convergence of $${sigma(series)}$ most directly?`,
            `哪种方法最直接地判断 $${sigma(series)}$ 的敛散性？`,
          ),
          correct: methods[kind],
          wrong: others.map((m) => ({ option: methods[m], why: notThis(m, kind) })),
          solution: walked(
            [
              [["Read the form of the terms", "看项的形式"], t(`The terms are $${series}$.`, `各项为 $${series}$。`)],
              [["Apply the method", "应用方法"], why],
            ],
            check,
          ),
        });
      },
    },
    {
      id: "choosing-among-comparison-root-and-integral-tests",
      title: t("Choosing among comparison, root and integral tests", "在比较、根值和积分判别法中选择"),
      explanation: t(
        "Some forms call for the remaining tests:\n\n- a quotient of polynomials, such as $\\frac{n + 1}{n^{3} + 5}$: **limit comparison** with $\\frac{1}{n^{2}}$.\n- a bounded factor over a $p$-series term, such as $\\frac{\\sin^{2} n}{n^{2}}$: direct **comparison**.\n- a whole expression raised to the $n$th power, such as $\\left(\\frac{2n}{3n + 1}\\right)^{n}$: the **root test**.\n- a term that is easy to integrate, such as $\\frac{1}{n (\\ln n)^{2}}$: the **integral test**.\n\nFor example, $\\left(\\frac{2n}{3n + 1}\\right)^{n}$ has $n$th root $\\frac{2n}{3n + 1} \\to \\frac{2}{3} < 1$, so that series converges.\n\nCheck: $\\frac{2n}{3n + 1} < \\frac{2}{3}$ for every $n$, so the terms lie below $\\left(\\frac{2}{3}\\right)^{n}$, a convergent geometric series.\n\n> **Watch out.** The ratio and root tests give $L = 1$ for every rational term and every $\\frac{1}{n(\\ln n)^{k}}$, so they settle none of those.",
        "有些形式要用其余的判别法：\n\n- 多项式之商，如 $\\frac{n + 1}{n^{3} + 5}$：与 $\\frac{1}{n^{2}}$ 作**极限比较**。\n- 有界因子乘以 $p$ 级数的项，如 $\\frac{\\sin^{2} n}{n^{2}}$：直接**比较**。\n- 整个式子的 $n$ 次幂，如 $\\left(\\frac{2n}{3n + 1}\\right)^{n}$：**根值判别法**。\n- 容易积分的项，如 $\\frac{1}{n (\\ln n)^{2}}$：**积分判别法**。\n\n例如 $\\left(\\frac{2n}{3n + 1}\\right)^{n}$ 的 $n$ 次方根为 $\\frac{2n}{3n + 1} \\to \\frac{2}{3} < 1$，所以那个级数收敛。\n\n检验：对每个 $n$ 都有 $\\frac{2n}{3n + 1} < \\frac{2}{3}$，所以各项位于收敛的等比级数 $\\left(\\frac{2}{3}\\right)^{n}$ 之下。\n\n> **注意。** 对每个有理式的项以及每个 $\\frac{1}{n(\\ln n)^{k}}$，比值和根值判别法都给出 $L = 1$，都判断不了。",
      ),
      generate(rng) {
        let c = rng.int(1, 9);
        const k = rng.int(2, 9);
        const m = rng.int(2, 9);
        const p = rng.int(2, 4);
        const kind = rng.pick(["limit", "comparison", "root", "integral"] as const);
        if (kind === "root" && c === k) c = k - 1;
        const notGeometric = t(
          "The terms are not a constant times a fixed ratio to the power $n$, so this is not a geometric series.",
          "各项不是常数乘以固定公比的 $n$ 次幂，所以不是等比级数。",
        );
        const ratioOne = t(
          "The ratio of consecutive terms tends to $1$ here, so the ratio test is inconclusive.",
          "这里相邻两项之比趋于 $1$，所以比值判别法无法下结论。",
        );
        const rootOne = t(
          "The $n$th roots of these terms tend to $1$, so the root test is inconclusive.",
          "这些项的 $n$ 次方根趋于 $1$，所以根值判别法无法下结论。",
        );
        const L = Q.of(c, k);
        const cases: Record<
          "limit" | "comparison" | "root" | "integral",
          { series: string; start: number; parts: Step[]; check: Text; why: Partial<Record<MoreName, Text>> }
        > = {
          limit: {
            series: `\\frac{${linear(c, k, "n")}}{n^{3} + ${m}}`,
            start: 1,
            parts: [
              [
                ["Read the form of the terms", "看项的形式"],
                t(
                  "The terms are a quotient of polynomials whose degrees differ by $2$, so compare with $\\frac{1}{n^{2}}$:",
                  "各项是次数相差 $2$ 的多项式之商，所以与 $\\frac{1}{n^{2}}$ 比较：",
                ),
                [`\\frac{a_n}{1/n^{2}} = \\frac{${poly([c, "n^{3}"], [k, "n^{2}"])}}{n^{3} + ${m}} \\to ${c}`],
              ],
              [
                ["Apply the method", "应用方法"],
                t(
                  "The limit is positive and finite and $\\sum \\frac{1}{n^{2}}$ converges, so the series converges.",
                  "极限是正的有限值，且 $\\sum \\frac{1}{n^{2}}$ 收敛，所以级数收敛。",
                ),
              ],
            ],
            check: t(
              `Compare directly instead: the numerator is at most $${c + k}n$ and the denominator is more than $n^{3}$, so $a_n \\le \\frac{${c + k}}{n^{2}}$, a multiple of a convergent $p$-series.`,
              `改为直接比较：分子至多为 $${c + k}n$，分母大于 $n^{3}$，所以 $a_n \\le \\frac{${c + k}}{n^{2}}$，是收敛的 $p$ 级数的倍数。`,
            ),
            why: {
              comparison: t(
                "A direct comparison works only after building a bound by hand for the numerator; the limit comparison test needs no bound.",
                "直接比较要先自己构造分子的界才能用；极限比较判别法不需要。",
              ),
              root: rootOne,
              integral: t(
                "Integrating this rational function needs partial fractions, far more work than one limit.",
                "积分这个有理函数需要部分分式，比求一个极限费事得多。",
              ),
              ratio: ratioOne,
              geometric: notGeometric,
            },
          },
          comparison: {
            series: `\\frac{\\sin^{2}(${k}n)}{n^{${p}}}`,
            start: 1,
            parts: [
              [
                ["Read the form of the terms", "看项的形式"],
                t("The factor $\\sin^{2}$ lies between $0$ and $1$, so", "因子 $\\sin^{2}$ 在 $0$ 与 $1$ 之间，所以"),
                [`0 \\le \\frac{\\sin^{2}(${k}n)}{n^{${p}}} \\le \\frac{1}{n^{${p}}}`],
              ],
              [
                ["Apply the method", "应用方法"],
                t(
                  `The $p$-series with $p = ${p} > 1$ converges, so by direct comparison the series converges.`,
                  `$p = ${p} > 1$ 的 $p$ 级数收敛，所以由直接比较，级数收敛。`,
                ),
              ],
            ],
            check: t(
              `Bound the partial sums instead. By the integral test, $\\sum \\frac{1}{n^{${p}}} \\le 1 + \\int_{1}^{\\infty} \\frac{dx}{x^{${p}}} = ${Q.of(p, p - 1).toLatex()}$. So the partial sums increase and stay below $${Q.of(p, p - 1).toLatex()}$.`,
              `改为估计部分和：由积分判别法，$\\sum \\frac{1}{n^{${p}}} \\le 1 + \\int_{1}^{\\infty} \\frac{dx}{x^{${p}}} = ${Q.of(p, p - 1).toLatex()}$，所以部分和递增且小于 $${Q.of(p, p - 1).toLatex()}$。`,
            ),
            why: {
              limit: t(
                "The ratio to $\\frac{1}{n^{" +
                  p +
                  "}}$ is $\\sin^{2}(" +
                  k +
                  "n)$, which has no limit, so the limit comparison test cannot be used.",
                `与 $\\frac{1}{n^{${p}}}$ 之比为 $\\sin^{2}(${k}n)$，没有极限，所以不能用极限比较判别法。`,
              ),
              root: t(
                "The $n$th roots do not settle below $1$, so the root test gives no conclusion.",
                "各项的 $n$ 次方根不会稳定在 $1$ 以下，所以根值判别法得不出结论。",
              ),
              integral: t(
                `The function $\\frac{\\sin^{2}(${k}x)}{x^{${p}}}$ is not decreasing, so the integral test does not apply.`,
                `函数 $\\frac{\\sin^{2}(${k}x)}{x^{${p}}}$ 不是递减的，所以积分判别法不适用。`,
              ),
              ratio: t(
                "The ratio of consecutive terms jumps around with $\\sin^{2}$ and has no limit.",
                "相邻两项之比随 $\\sin^{2}$ 跳动，没有极限。",
              ),
              geometric: notGeometric,
            },
          },
          root: {
            series: `\\left(\\frac{${term(c, "n")}}{${linear(k, m, "n")}}\\right)^{n}`,
            start: 1,
            parts: [
              [
                ["Read the form of the terms", "看项的形式"],
                t("The whole term is an $n$th power, so its $n$th root is the base:", "整个项是 $n$ 次幂，所以它的 $n$ 次方根就是底数："),
                [`\\sqrt[n]{a_n} = \\frac{${term(c, "n")}}{${linear(k, m, "n")}} \\to ${L.toLatex()}`],
              ],
              [
                ["Apply the method", "应用方法"],
                c < k
                  ? t(
                      `$L = ${L.toLatex()} < 1$, so by the root test the series converges.`,
                      `$L = ${L.toLatex()} < 1$，所以由根值判别法，级数收敛。`,
                    )
                  : t(
                      `$L = ${L.toLatex()} > 1$, so by the root test the series diverges.`,
                      `$L = ${L.toLatex()} > 1$，所以由根值判别法，级数发散。`,
                    ),
              ],
            ],
            check:
              c < k
                ? t(
                    `Compare with a geometric series instead: $\\frac{${c}n}{${linear(k, m, "n")}} < ${L.toLatex()}$ for every $n$, so $a_n < \\left(${L.toLatex()}\\right)^{n}$, the terms of a convergent geometric series.`,
                    `改为与等比级数比较：对每个 $n$ 都有 $\\frac{${c}n}{${linear(k, m, "n")}} < ${L.toLatex()}$，所以 $a_n < \\left(${L.toLatex()}\\right)^{n}$，是收敛的等比级数的项。`,
                  )
                : t(
                    `Use the $n$th term test instead: the base tends to $${L.toLatex()} > 1$, so from some point on it is above $1$ and $a_n \\ge 1$. The terms do not tend to $0$, so the series diverges.`,
                    `改用第 $n$ 项判别法：底数趋于 $${L.toLatex()} > 1$，所以从某一项起它大于 $1$，$a_n \\ge 1$。各项不趋于 $0$，所以级数发散。`,
                  ),
            why: {
              limit: t(
                "There is no simple $p$-series to compare with: the terms change geometrically, like a power of a fixed number.",
                "没有简单的 $p$ 级数可以比较：各项像一个固定数的幂那样按几何方式变化。",
              ),
              comparison: t(
                "A geometric bound could be built by hand, but the root test finds it at once.",
                "可以自己构造一个等比的界，但根值判别法一步就能得到。",
              ),
              integral: t(
                `The function $\\left(\\frac{${term(c, "x")}}{${linear(k, m)}}\\right)^{x}$ has no elementary antiderivative.`,
                `函数 $\\left(\\frac{${term(c, "x")}}{${linear(k, m)}}\\right)^{x}$ 没有初等原函数。`,
              ),
              ratio: t(
                "In the ratio of consecutive terms both the base and the power change, which is messy; the root test removes the power.",
                "相邻两项之比中底数和幂都在变，很繁琐；根值判别法直接去掉了幂。",
              ),
              geometric: t("The base changes with $n$, so there is no fixed ratio.", "底数随 $n$ 变化，所以没有固定的公比。"),
            },
          },
          integral: {
            series: `\\frac{${c}}{n (\\ln n)^{${k}}}`,
            start: 2,
            parts: [
              [
                ["Read the form of the terms", "看项的形式"],
                t("With $u = \\ln x$ the matching integral is easy:", "令 $u = \\ln x$，对应的积分很容易计算："),
                [
                  `\\int_{2}^{\\infty} \\frac{${c}}{x (\\ln x)^{${k}}} \\, dx = \\left[-\\frac{${c}}{${k - 1 === 1 ? "" : k - 1}${k - 1 === 1 ? "\\ln x" : `(\\ln x)^{${k - 1}}`}}\\right]_{2}^{\\infty} = \\frac{${c}}{${k - 1 === 1 ? "" : k - 1}${k - 1 === 1 ? "\\ln 2" : `(\\ln 2)^{${k - 1}}`}}`,
                ],
              ],
              [
                ["Apply the method", "应用方法"],
                t(
                  "The terms are positive and decreasing and the integral is finite, so by the integral test the series converges.",
                  "各项为正且递减，积分有限，所以由积分判别法，级数收敛。",
                ),
              ],
            ],
            check: t(
              `Group the terms instead: the $2^{j}$ terms from $n = 2^{j}$ to $2^{j+1} - 1$ are each at most $\\frac{${c}}{2^{j} (j \\ln 2)^{${k}}}$, so the group adds at most $\\frac{${c}}{(\\ln 2)^{${k}}} \\cdot \\frac{1}{j^{${k}}}$, the terms of a convergent $p$-series.`,
              `改为分组：从 $n = 2^{j}$ 到 $2^{j+1} - 1$ 的 $2^{j}$ 项每项至多为 $\\frac{${c}}{2^{j} (j \\ln 2)^{${k}}}$，所以每组至多加上 $\\frac{${c}}{(\\ln 2)^{${k}}} \\cdot \\frac{1}{j^{${k}}}$，是收敛的 $p$ 级数的项。`,
            ),
            why: {
              limit: t(
                "No $p$-series matches: far out these terms are smaller than $\\frac{1}{n}$ but larger than $\\frac{1}{n^{q}}$ for every $q > 1$.",
                "没有匹配的 $p$ 级数：在很靠后的位置，这些项比 $\\frac{1}{n}$ 小，却比任何 $q > 1$ 的 $\\frac{1}{n^{q}}$ 大。",
              ),
              comparison: t(
                "No $p$-series bound works: far out these terms are larger than $\\frac{1}{n^{q}}$ for every $q > 1$.",
                "没有可用的 $p$ 级数作界：在很靠后的位置，这些项比任何 $q > 1$ 的 $\\frac{1}{n^{q}}$ 都大。",
              ),
              root: rootOne,
              ratio: ratioOne,
              geometric: notGeometric,
            },
          },
        };
        const x = cases[kind];
        const others = rng.shuffle((Object.keys(moreMethods) as MoreName[]).filter((name) => name !== kind)).slice(0, 3);
        return explainedChoice(rng, {
          prompt: t(
            `Which method settles the convergence of $${sigma(x.series, x.start)}$ most directly?`,
            `哪种方法最直接地判断 $${sigma(x.series, x.start)}$ 的敛散性？`,
          ),
          correct: moreMethods[kind],
          wrong: others.map((name) => ({ option: moreMethods[name], why: x.why[name] as Text })),
          solution: walked(x.parts, x.check),
        });
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
