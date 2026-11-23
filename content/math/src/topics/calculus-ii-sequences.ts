import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Interval, intervalLatex, linear, poly, Q } from "@ga/subject-math";

import { functionProblem, intervalProblem, numberProblem, pointLatex, pointProblem, withMistakes } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { gcd, type LimitValue, limitChoice, limitLatex, limitText, oneOf } from "./calculus-common.ts";
import { type Step, walked } from "./calculus-i-differentiation.ts";

// Calculus II unit 4: Sequences & Series, modules 4.17 (Sequences),
// 4.18 (Monotonic Sequences), 4.19 (Infinite Series) and 4.20 (Geometric Series).

/** limN writes the limit as n → ∞. */
const limN = "\\lim_{n \\to \\infty}";

/** term writes c·body, leaving out a coefficient of 1 and writing a dot before a body that starts with a digit. */
export function term(c: number, body: string): string {
  if (body === "") return `${c}`;
  if (c === 1) return body;
  if (c === -1) return `-${body}`;
  return /^[0-9]/.test(body) ? `${c} \\cdot ${body}` : `${c}${body}`;
}

/** plus joins terms with + and −. */
export const plus = (...terms: readonly string[]) =>
  terms.reduce((out, s) => (out === "" ? s : s.startsWith("-") ? `${out} - ${s.slice(1)}` : `${out} + ${s}`), "");

/** powN writes rⁿ (or another exponent), with parentheses around a negative or fractional ratio. */
export function powN(r: Q, e = "n"): string {
  const s = r.toLatex();
  return r.sign() > 0 && /^[0-9]+$/.test(s) ? `${s}^{${e}}` : `\\left(${s}\\right)^{${e}}`;
}

/** shift writes n + k, or n when k is 0. */
const shift = (k: number) => linear(1, k, "n");

/** fact writes (n + k)!, or n! when k is 0. */
const fact = (k: number) => (k === 0 ? "n!" : `(${shift(k)})!`);

/** limitWord says what a limit is in words for a solution. */
function limitWord(v: LimitValue): Text {
  if (v === "dne") return t("the limit does not exist", "极限不存在");
  return t(`the limit is $${limitLatex(v)}$`, `极限为 $${limitLatex(v)}$`);
}

/** step is a labelled step of a worked solution with its displayed lines. */
const step = (en: string, zh: string, said: Text, ...lines: string[]): Step => [[en, zh], said, lines];

/** none is a step that only displays lines. */
const none = t("", "");

/** Slip is a wrong number with its reason in English and Chinese. */
type Slip = readonly [value: number | Q, en: string, zh: string];

/** numberWorked asks for a number, explained in labelled steps with a check; each wrong number keeps its first reason. */
function numberWorked(
  prompt: Text,
  answer: number | Q,
  parts: readonly Step[],
  check: Text,
  slips: readonly Slip[],
  solveFor?: string,
): Problem {
  const q = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);
  const right = q(answer);
  const kept = slips.filter((s, i) => !q(s[0]).eq(right) && slips.findIndex((r) => q(r[0]).eq(q(s[0]))) === i);
  return numberProblem({
    prompt,
    answer: right,
    ...(solveFor ? { solveFor } : {}),
    mistakes: kept.map(([v, en, zh]) => ({ value: q(v), why: t(en, zh) })),
    solution: walked(parts, check),
  });
}

/** Choice is a wrong limit with why a learner might pick it. */
type Choice = readonly [value: LimitValue, en: string, zh: string];

/** limitAsk asks for a limit as limitChoice does, with a worked solution, and gives every option it can show its reason; ∞ and −∞ are always shown, so they need reasons too. */
function limitAsk(
  rng: Rng,
  prompt: Text,
  right: LimitValue,
  wrong: readonly Choice[],
  parts: readonly Step[],
  check: Text,
  dne = false,
): Problem {
  const numbers = wrong.flatMap((w) => (w[0] instanceof Q ? [w[0]] : []));
  const problem = limitChoice(rng, prompt, right, numbers, walked(parts, check), undefined, dne);
  return reasoned(
    problem,
    wrong.map(([v, en, zh]) => [limitText(v).en, en, zh] as const),
  );
}

/** Pick is a wrong option of a multiple-choice question with its reason. */
type Pick = readonly [option: Text, en: string, zh: string];

/** choose asks a multiple-choice question with a worked solution and a reason for every wrong option. */
function choose(rng: Rng, prompt: Text, right: Text, wrong: readonly Pick[], parts: readonly Step[], check: Text): Problem {
  return reasoned(
    oneOf(
      rng,
      prompt,
      right,
      wrong.map((w) => w[0]),
      walked(parts, check),
    ),
    wrong.map(([o, en, zh]) => [o.en, en, zh] as const),
  );
}

/** Form is a wrong expression in LaTeX with its reason. */
type Form = readonly [latex: string, en: string, zh: string];

/** functionWorked asks for an expression, explained in labelled steps with a check; only wrong forms the checker rejects get reasons. */
function functionWorked(
  p: { readonly prompt: Text; readonly answer: string; readonly variable: string; readonly prefix?: string },
  parts: readonly Step[],
  check: Text,
  wrong: readonly Form[],
): Problem {
  const problem = functionProblem({ ...p, wrong: wrong.map((w) => w[0]), solution: walked(parts, check) });
  const kept = new Set(problem.wrong ?? []);
  return withMistakes(
    problem,
    wrong.filter((w) => kept.has(w[0])).map(([w, en, zh]) => ({ response: w, why: t(en, zh) })),
  );
}

/** Slot is a wrong set of x-values with its reason. */
type Slot = readonly [set: Interval[], en: string, zh: string];

/** intervalWorked asks for an interval, explained in labelled steps with a check; each wrong interval keeps its first reason. */
function intervalWorked(prompt: Text, set: Interval[], parts: readonly Step[], check: Text, wrong: readonly Slot[]): Problem {
  const problem = intervalProblem({ prompt, set, form: "interval", wrong: wrong.map((w) => w[0]), solution: walked(parts, check) });
  const kept = new Set(problem.wrong ?? []);
  const seen = new Set<string>();
  return withMistakes(
    problem,
    wrong.flatMap(([s, en, zh]) => {
      const response = intervalLatex(s);
      if (!kept.has(response) || seen.has(response)) return [];
      seen.add(response);
      return [{ response, why: t(en, zh) }];
    }),
  );
}

/** approx writes a decimal approximation, in scientific notation when it is very large or very small. */
function approx(v: number): string {
  if (v === 0) return "0";
  const a = Math.abs(v);
  if (a >= 1e6 || a < 1e-3) {
    let e = Math.floor(Math.log10(a));
    let m = Number((v / 10 ** e).toFixed(2));
    if (Math.abs(m) >= 10) {
      m /= 10;
      e += 1;
    }
    return `${m.toFixed(2)} \\times 10^{${e}}`;
  }
  return String(Number(v.toFixed(4)));
}

/** near writes an exact value with its decimal approximation when it is not an integer. */
const near = (q: Q) => (q.isInteger() ? q.toLatex() : `${q.toLatex()} \\approx ${approx(q.toNumber())}`);

/** over writes c/d as a term of a sum, or nothing when c is 0. */
const over = (c: number, d: string) => (c === 0 ? "" : c < 0 ? `-\\frac{${-c}}{${d}}` : `\\frac{${c}}{${d}}`);

/** sum joins the non-empty terms with + and −, or writes 0. */
const sum = (...terms: readonly string[]) => plus(...terms.filter((s) => s !== "")) || "0";

/** paren writes a number in parentheses when it is negative. */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** rationalLimit finds the limit of a quotient of polynomials of equal degree. */
function rationalLimit(rng: Rng): Problem {
  const d = rng.int(1, 2);
  const p = rng.nonZero(-9, 9);
  const s = rng.int(1, 9);
  const q = rng.int(-9, 9);
  const u = rng.int(1, 9);
  const lead = d === 1 ? "n" : "n^{2}";
  const top = d === 1 ? poly([p, "n"], [q, ""]) : poly([p, "n^{2}"], [q, "n"]);
  const bottom = poly([s, lead], [u, ""]);
  const answer = Q.of(p, s);
  const N = 1000;
  const num = d === 1 ? p * N + q : p * N * N + q * N;
  const den = d === 1 ? s * N + u : s * N * N + u;
  return numberWorked(
    t(`Find $${limN} \\frac{${top}}{${bottom}}$.`, `求 $${limN} \\frac{${top}}{${bottom}}$。`),
    answer,
    [
      step(
        "Divide by the highest power",
        "同除以最高次幂",
        t(`Divide the numerator and the denominator by $${lead}$:`, `分子分母同除以 $${lead}$：`),
        `\\frac{${top}}{${bottom}} = \\frac{${sum(`${p}`, over(q, "n"))}}{${sum(`${s}`, over(u, lead))}}`,
      ),
      step(
        "Let n grow",
        "让 n 增大",
        t("Every fraction with $n$ in its denominator tends to $0$:", "分母含 $n$ 的分式都趋于 $0$："),
        `${limN} \\frac{${top}}{${bottom}} = \\frac{${p}}{${s}} = ${answer.toLatex()}`,
      ),
    ],
    t(
      `Put in a large $n$: $a_{${N}} = \\frac{${num}}{${den}} \\approx ${approx(num / den)}$, close to $${near(answer)}$.`,
      `代入一个大的 $n$：$a_{${N}} = \\frac{${num}}{${den}} \\approx ${approx(num / den)}$，接近 $${near(answer)}$。`,
    ),
    [
      [Q.of(s, p), "This flips the fraction: the numerator's leading coefficient goes on top", "分数颠倒了：分子的首项系数应在上面"],
      [
        Q.zero,
        "The limit is $0$ only when the denominator has the higher degree; here the degrees are equal",
        "只有分母次数更高时极限才是 $0$；这里次数相同",
      ],
      [Q.of(p), `This leaves out the denominator's leading coefficient $${s}$; divide by it`, `这里漏了分母的首项系数 $${s}$；要除以它`],
      ...(d === 1
        ? [
            [
              Q.of(q, u),
              "This is the ratio of the constant terms; for large $n$ the leading terms decide",
              "这是常数项之比；$n$ 很大时由首项决定",
            ] as const,
          ]
        : []),
    ],
  );
}

/** degreeLimit finds the limit of a quotient of polynomials of different degrees. */
function degreeLimit(rng: Rng): Problem {
  const dn = rng.int(1, 3);
  let dd = rng.int(1, 3);
  if (dd === dn) dd = dn === 3 ? 1 : dn + 1;
  const p = rng.nonZero(-9, 9);
  const s = rng.nonZero(-9, 9);
  const q = rng.int(1, 9);
  const u = rng.int(1, 9);
  const pw = (k: number) => (k === 1 ? "n" : `n^{${k}}`);
  const top = poly([p, pw(dn)], [q, ""]);
  const bottom = poly([s, pw(dd)], [u, ""]);
  const shrinks = dn < dd;
  const right: LimitValue = shrinks ? Q.zero : p * s > 0 ? "inf" : "-inf";
  const value = (n: number) => (p * n ** dn + q) / (s * n ** dd + u);
  const divided = shrinks
    ? `\\frac{${top}}{${bottom}} = \\frac{${sum(over(p, pw(dd - dn)), over(q, pw(dd)))}}{${sum(`${s}`, over(u, pw(dd)))}}`
    : `\\frac{${top}}{${bottom}} = \\frac{${sum(term(p, pw(dn - dd)), over(q, pw(dd)))}}{${sum(`${s}`, over(u, pw(dd)))}}`;
  const wrongInf = (v: "inf" | "-inf"): Choice =>
    shrinks
      ? [v, "The denominator has the higher degree, so the quotient shrinks; it does not grow", "分母次数更高，商会变小，不会无界增长"]
      : [
          v,
          `The sign is wrong: the leading coefficients give $\\frac{${p}}{${s}}$, which is ${p * s > 0 ? "positive" : "negative"}`,
          `符号错了：首项系数之比 $\\frac{${p}}{${s}}$ 为${p * s > 0 ? "正" : "负"}`,
        ];
  return limitAsk(
    rng,
    t(`Find $${limN} \\frac{${top}}{${bottom}}$.`, `求 $${limN} \\frac{${top}}{${bottom}}$。`),
    right,
    [
      [
        Q.of(p, s),
        "The ratio of the leading coefficients is the limit only when the degrees are equal",
        "只有次数相同时，极限才是首项系数之比",
      ],
      [
        Q.zero,
        "The limit is $0$ only when the denominator has the higher degree; here the numerator does",
        "只有分母次数更高时极限才是 $0$；这里分子次数更高",
      ],
      [
        Q.of(q, u),
        "This is the ratio of the constant terms; for large $n$ the leading terms decide",
        "这是常数项之比；$n$ 很大时由首项决定",
      ],
      wrongInf("inf"),
      wrongInf("-inf"),
    ],
    [
      step(
        "Compare the degrees",
        "比较次数",
        t(
          `The numerator has degree $${dn}$ and the denominator degree $${dd}$, so divide by $${pw(dd)}$, the highest power below:`,
          `分子次数为 $${dn}$，分母次数为 $${dd}$，所以同除以分母的最高次幂 $${pw(dd)}$：`,
        ),
        divided,
      ),
      step(
        "Let n grow",
        "让 n 增大",
        shrinks
          ? t(
              `The numerator tends to $0$ and the denominator to $${s}$, so ${limitWord(right).en}.`,
              `分子趋于 $0$，分母趋于 $${s}$，所以${limitWord(right)["zh-CN"]}。`,
            )
          : t(
              `The denominator tends to $${s}$ while $${term(p, pw(dn - dd))}$ grows without bound, so ${limitWord(right).en}.`,
              `分母趋于 $${s}$，而 $${term(p, pw(dn - dd))}$ 无界增长，所以${limitWord(right)["zh-CN"]}。`,
            ),
      ),
    ],
    t(
      `Put in large values: $a_{100} \\approx ${approx(value(100))}$ and $a_{1000} \\approx ${approx(value(1000))}$, ${shrinks ? "shrinking toward $0$" : "growing in size with a fixed sign"}.`,
      `代入大的值：$a_{100} \\approx ${approx(value(100))}$，$a_{1000} \\approx ${approx(value(1000))}$，${shrinks ? "向 $0$ 缩小" : "符号不变而绝对值不断增大"}。`,
    ),
  );
}

/** limitsOfSequences finds limits of sequences given by rational expressions in n. */
export const limitsOfSequences: TopicDef = {
  id: "limits-of-sequences",
  title: t("Limits of Sequences", "数列的极限"),
  summary: t(
    "A sequence converges to L when its terms get arbitrarily close to L as n grows; for a rational expression in n, compare the leading terms.",
    "当 n 增大时数列的项任意接近 L，就说数列收敛于 L；对 n 的有理式，比较首项即可。",
  ),
  intro: t(
    "A sequence converges to $L$ when its terms get as close to $L$ as we like for all large enough $n$. For a quotient of polynomials in $n$, divide by the highest power in the denominator:\n\n$$\\lim_{n \\to \\infty} \\frac{3n^{2} - n}{2n^{2} + 5} = \\lim_{n \\to \\infty} \\frac{3 - \\frac{1}{n}}{2 + \\frac{5}{n^{2}}} = \\frac{3}{2}.$$\n\nCheck: $a_{100} = \\frac{29900}{20005} \\approx 1.4946$, already close to $1.5$.\n\nIn this lesson we find limits of sequences given by quotients of polynomials, of equal and of different degrees.",
    "当 $n$ 足够大时，若数列的项能任意接近 $L$，就说数列收敛于 $L$。对 $n$ 的多项式之商，同除以分母的最高次幂：\n\n$$\\lim_{n \\to \\infty} \\frac{3n^{2} - n}{2n^{2} + 5} = \\lim_{n \\to \\infty} \\frac{3 - \\frac{1}{n}}{2 + \\frac{5}{n^{2}}} = \\frac{3}{2}$$\n\n检验：$a_{100} = \\frac{29900}{20005} \\approx 1.4946$，已经接近 $1.5$。\n\n本课我们求由多项式之商给出的数列的极限，包括次数相同与次数不同两种情形。",
  ),
  prerequisites: ["introduction-to-sequences", "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions"],
  encompasses: [{ topic: "limits-at-infinity-and-horizontal-asymptotes-of-rational-functions", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-rational-sequences",
      title: t("Sequences with leading terms of equal degree", "首项次数相同的数列"),
      explanation: t(
        "A sequence $a_n$ **converges** to $L$, written $\\lim_{n \\to \\infty} a_n = L$, when $a_n$ gets as close to $L$ as we like for all large enough $n$. If $a_n = f(n)$ and $\\lim_{x \\to \\infty} f(x) = L$, then $\\lim_{n \\to \\infty} a_n = L$. When the numerator and denominator have the same degree, the limit is the ratio of the leading coefficients:\n\n$$\\lim_{n \\to \\infty} \\frac{3n^{2} - n}{2n^{2} + 5} = \\lim_{n \\to \\infty} \\frac{3 - \\frac{1}{n}}{2 + \\frac{5}{n^{2}}} = \\frac{3}{2}.$$\n\nCheck: at $n = 100$, $a_{100} = \\frac{29900}{20005} \\approx 1.4946$, close to $\\frac{3}{2}$.\n\n> **Watch out.** Only the leading terms matter: the constant terms $0$ and $5$ would give $\\frac{0}{5} = 0$, which is not the limit.",
        "当 $n$ 足够大时，若 $a_n$ 能任意接近 $L$，就说数列 $a_n$ **收敛**于 $L$，记作 $\\lim_{n \\to \\infty} a_n = L$。若 $a_n = f(n)$ 且 $\\lim_{x \\to \\infty} f(x) = L$，则 $\\lim_{n \\to \\infty} a_n = L$。分子分母次数相同时，极限是首项系数之比：\n\n$$\\lim_{n \\to \\infty} \\frac{3n^{2} - n}{2n^{2} + 5} = \\lim_{n \\to \\infty} \\frac{3 - \\frac{1}{n}}{2 + \\frac{5}{n^{2}}} = \\frac{3}{2}$$\n\n检验：$n = 100$ 时 $a_{100} = \\frac{29900}{20005} \\approx 1.4946$，接近 $\\frac{3}{2}$。\n\n> **注意。** 只有首项起作用：常数项 $0$ 与 $5$ 给出 $\\frac{0}{5} = 0$，这不是极限。",
      ),
      generate: rationalLimit,
    },
    {
      id: "limits-of-sequences-with-different-degrees",
      title: t("Leading terms of different degrees", "首项次数不同"),
      explanation: t(
        "If the denominator has the higher degree, $a_n \\to 0$. If the numerator has the higher degree, $a_n$ grows without bound: it tends to $\\infty$ or $-\\infty$ by the sign of the ratio of the leading coefficients, and the sequence **diverges**. For example, $\\frac{4n}{n^{2} + 1} \\to 0$ and $\\frac{-n^{2}}{3n + 1} \\to -\\infty$.\n\nCheck: $\\frac{4 \\cdot 100}{100^{2} + 1} \\approx 0.04$, and $\\frac{-100^{2}}{301} \\approx -33.2$ keeps growing in size as $n$ grows.\n\n> **Watch out.** The sign of the infinite limit comes from both leading coefficients: $\\frac{-1}{3}$ is negative, so the limit is $-\\infty$.",
        "若分母次数更高，则 $a_n \\to 0$。若分子次数更高，$a_n$ 无界增长：按首项系数之比的符号趋于 $\\infty$ 或 $-\\infty$，数列**发散**。例如 $\\frac{4n}{n^{2} + 1} \\to 0$，$\\frac{-n^{2}}{3n + 1} \\to -\\infty$。\n\n检验：$\\frac{4 \\cdot 100}{100^{2} + 1} \\approx 0.04$；而 $\\frac{-100^{2}}{301} \\approx -33.2$，随 $n$ 增大绝对值不断变大。\n\n> **注意。** 无穷极限的符号由两个首项系数共同决定：$\\frac{-1}{3}$ 为负，所以极限是 $-\\infty$。",
      ),
      generate: degreeLimit,
    },
  ],
};

/** coefficientOf writes a coefficient in front of a power: "", "-" or the number. */
const coefficientOf = (c: number) => (c === 1 ? "" : c === -1 ? "-" : `${c}`);

/** geometricLimit is the limit of c·rⁿ for c ≠ 0. */
function geometricLimit(c: number, r: Q): LimitValue {
  const v = r.toNumber();
  return Math.abs(v) < 1 ? Q.zero : v === 1 ? Q.of(c) : v > 1 ? (c > 0 ? "inf" : "-inf") : "dne";
}

/** geometricReasons says why each limit other than the right one is wrong for c·rⁿ. */
function geometricReasons(c: number, r: Q): Choice[] {
  const v = r.toNumber();
  const rL = r.toLatex();
  const right = geometricLimit(c, r);
  const all: Choice[] = [
    [
      Q.of(c),
      `This is the coefficient $${c}$; it is the limit only when $r = 1$, and here $r = ${rL}$`,
      `这是系数 $${c}$；只有 $r = 1$ 时它才是极限，而这里 $r = ${rL}$`,
    ],
    [
      Q.zero,
      `Only $|r| < 1$ makes $r^{n} \\to 0$; here $|r| = ${r.abs().toLatex()}$`,
      `只有 $|r| < 1$ 时才有 $r^{n} \\to 0$；这里 $|r| = ${r.abs().toLatex()}$`,
    ],
    ...(["inf", "-inf"] as const).map((s): Choice => {
      const sym = s === "inf" ? "\\infty" : "-\\infty";
      if (Math.abs(v) < 1)
        return [
          s,
          `Since $|r| < 1$ the powers shrink, so the terms cannot grow to $${sym}$`,
          `因为 $|r| < 1$，幂越来越小，各项不会趋于 $${sym}$`,
        ];
      if (v === 1) return [s, `With $r = 1$ every term is $${c}$; nothing grows`, `$r = 1$ 时每一项都是 $${c}$，不会增长`];
      if (v > 1)
        return [
          s,
          `The terms grow in size with the sign of $c = ${c}$, so they tend to $${c > 0 ? "\\infty" : "-\\infty"}$`,
          `各项绝对值增大，符号与 $c = ${c}$ 相同，所以趋于 $${c > 0 ? "\\infty" : "-\\infty"}$`,
        ];
      return [
        s,
        `With $r = ${rL}$ the terms alternate in sign, so they do not all head toward $${sym}$`,
        `$r = ${rL}$ 时各项正负交替，不会一致趋于 $${sym}$`,
      ];
    }),
    [
      "dne",
      `The limit exists: only $r \\le -1$ makes the terms jump between signs without settling, and here $r = ${rL}$`,
      `极限存在：只有 $r \\le -1$ 时各项才正负跳动而不趋于定值，这里 $r = ${rL}$`,
    ],
  ];
  const key = (x: LimitValue) => (x instanceof Q ? x.toString() : x);
  return all.filter((w) => key(w[0]) !== key(right));
}

/** behaviour says how the powers rⁿ behave for a ratio r. */
function behaviour(r: Q, c: number): Text {
  const v = r.toNumber();
  if (Math.abs(v) < 1)
    return t(`$|r| = ${r.abs().toLatex()} < 1$, so $r^{n} \\to 0$`, `$|r| = ${r.abs().toLatex()} < 1$，所以 $r^{n} \\to 0$`);
  if (v === 1) return t(`$r = 1$, so every term equals $${c}$`, `$r = 1$，所以每一项都等于 $${c}$`);
  if (v > 1) return t(`$r = ${r.toLatex()} > 1$, so $r^{n} \\to \\infty$`, `$r = ${r.toLatex()} > 1$，所以 $r^{n} \\to \\infty$`);
  return t(
    `$r = ${r.toLatex()} \\le -1$, so the terms alternate in sign and do not shrink`,
    `$r = ${r.toLatex()} \\le -1$，所以各项正负交替且不变小`,
  );
}

/** termCheck works out the tenth and eleventh terms of c·rⁿ. */
function termCheck(c: number, r: Q): Text {
  const at = (n: number) => approx(c * r.toNumber() ** n);
  return t(
    `Work out two late terms: $a_{10} \\approx ${at(10)}$ and $a_{11} \\approx ${at(11)}$, which agrees.`,
    `算出两个靠后的项：$a_{10} \\approx ${at(10)}$，$a_{11} \\approx ${at(11)}$，与结论一致。`,
  );
}

/** geometricSequenceLimit finds the limit of c·rⁿ. */
function geometricSequenceLimit(rng: Rng): Problem {
  const c = rng.nonZero(-9, 9);
  const q = rng.int(1, 6);
  const p = rng.nonZero(-2 * q, 2 * q);
  const r = Q.of(p, q);
  const right = geometricLimit(c, r);
  const a = `${coefficientOf(c)}${powN(r)}`;
  const why = behaviour(r, c);
  return limitAsk(
    rng,
    t(`Find $${limN} ${a}$.`, `求 $${limN} ${a}$。`),
    right,
    geometricReasons(c, r),
    [
      step(
        "Read the ratio",
        "读出公比",
        t(
          `The sequence is $c \\cdot r^{n}$ with $c = ${c}$ and $r = ${r.toLatex()}$.`,
          `数列形如 $c \\cdot r^{n}$，其中 $c = ${c}$，$r = ${r.toLatex()}$。`,
        ),
      ),
      step(
        "Decide by the size of r",
        "由公比的大小判断",
        t(`Here ${why.en}; ${limitWord(right).en}.`, `这里 ${why["zh-CN"]}；${limitWord(right)["zh-CN"]}。`),
      ),
    ],
    termCheck(c, r),
    true,
  );
}

/** rewrittenLimit rewrites a quotient of powers as c·rⁿ and finds its limit. */
function rewrittenLimit(rng: Rng): Problem {
  const b = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7]);
  const d = rng.bool(0.15) ? Math.abs(b) : rng.int(2, 7);
  const s = rng.int(1, 2);
  const p = rng.nonZero(-4, 4);
  const c = p * b ** s;
  const r = Q.of(b, d);
  const right = geometricLimit(c, r);
  const base = b < 0 ? `(${b})` : `${b}`;
  const expr = `\\frac{${term(p, `${base}^{n + ${s}}`)}}{${d}^{n}}`;
  const rewritten = `${c} ${powN(r)}`;
  const a1 = Q.of(p * b ** (s + 1), d);
  const a2 = Q.of(p * b ** (s + 2), d * d);
  const pReason: Choice = [
    Q.of(p),
    `This is the number written in front; after rewriting, the coefficient is $${c}$ and the limit depends on $r = ${r.toLatex()}$`,
    `这是写在前面的系数；改写后系数是 $${c}$，极限取决于 $r = ${r.toLatex()}$`,
  ];
  return limitAsk(
    rng,
    t(`Find $${limN} ${expr}$.`, `求 $${limN} ${expr}$。`),
    right,
    [...geometricReasons(c, r), pReason],
    [
      step(
        "Rewrite as c times r to the n",
        "改写成 c 乘 r 的 n 次方",
        t(`Split off $${base}^{${s}}$ and combine the $n$th powers:`, `拆出 $${base}^{${s}}$，再把 $n$ 次幂合并：`),
        `${expr} = ${term(p, `${base}^{${s}}`)} \\cdot \\frac{${base}^{n}}{${d}^{n}} = ${rewritten}`,
      ),
      step(
        "Decide by the size of r",
        "由公比的大小判断",
        t(`Here ${behaviour(r, c).en}; ${limitWord(right).en}.`, `这里 ${behaviour(r, c)["zh-CN"]}；${limitWord(right)["zh-CN"]}。`),
      ),
    ],
    t(
      `From the original expression, $a_{1} = ${a1.toLatex()}$ and $a_{2} = ${a2.toLatex()}$, so $\\frac{a_{2}}{a_{1}} = ${a2.div(a1).toLatex()}$, the ratio found by rewriting.`,
      `由原式，$a_{1} = ${a1.toLatex()}$，$a_{2} = ${a2.toLatex()}$，所以 $\\frac{a_{2}}{a_{1}} = ${a2.div(a1).toLatex()}$，正是改写得到的公比。`,
    ),
    true,
  );
}

/** convergenceOfGeometricSequences finds the limit of c·rⁿ by the size of r. */
export const convergenceOfGeometricSequences: TopicDef = {
  id: "convergence-of-geometric-sequences",
  title: t("Convergence of Geometric Sequences", "等比数列的收敛性"),
  summary: t(
    "The geometric sequence c·rⁿ (c ≠ 0) converges to 0 when |r| < 1, to c when r = 1, and diverges otherwise.",
    "等比数列 c·rⁿ（c ≠ 0）在 |r| < 1 时收敛于 0，在 r = 1 时收敛于 c，其余情形发散。",
  ),
  intro: t(
    "Whether $c \\cdot r^{n}$ converges depends only on the ratio $r$. For $5\\left(-\\frac{2}{3}\\right)^{n}$, $\\left|-\\frac{2}{3}\\right| < 1$, so the powers shrink and\n\n$$\\lim_{n \\to \\infty} 5\\left(-\\frac{2}{3}\\right)^{n} = 0.$$\n\nCheck: $a_{10} = 5\\left(\\frac{2}{3}\\right)^{10} \\approx 0.087$ and $a_{11} \\approx -0.058$, already close to $0$.\n\nIn this lesson we find the limit of $c \\cdot r^{n}$ for every kind of ratio, and rewrite quotients of powers in this form.",
    "$c \\cdot r^{n}$ 是否收敛只取决于公比 $r$。对 $5\\left(-\\frac{2}{3}\\right)^{n}$，$\\left|-\\frac{2}{3}\\right| < 1$，幂越来越小，所以\n\n$$\\lim_{n \\to \\infty} 5\\left(-\\frac{2}{3}\\right)^{n} = 0$$\n\n检验：$a_{10} = 5\\left(\\frac{2}{3}\\right)^{10} \\approx 0.087$，$a_{11} \\approx -0.058$，已经接近 $0$。\n\n本课我们对各种公比求 $c \\cdot r^{n}$ 的极限，并把幂的商改写成这种形式。",
  ),
  prerequisites: ["limits-of-sequences", "nth-term-of-a-geometric-sequence"],
  encompasses: [{ topic: "limits-of-sequences", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-geometric-sequences",
      title: t("The limit of $c \\cdot r^n$", "$c \\cdot r^n$ 的极限"),
      explanation: t(
        "For $c \\neq 0$, the sequence $c \\cdot r^{n}$:\n\n- tends to $0$ when $-1 < r < 1$, since the powers shrink;\n- is constant, equal to $c$, when $r = 1$;\n- tends to $\\infty$ or $-\\infty$ (by the sign of $c$) when $r > 1$;\n- has no limit when $r \\le -1$, since its terms alternate in sign without settling.\n\nFor example, $5\\left(-\\frac{2}{3}\\right)^{n} \\to 0$, while $-2 \\cdot 3^{n} \\to -\\infty$.\n\nCheck: $-2 \\cdot 3^{10} = -118098$, already large and negative.\n\n> **Watch out.** $r = -1$ gives $-c, c, -c, \\ldots$: the terms do not grow, yet there is no limit.",
        "对 $c \\neq 0$，数列 $c \\cdot r^{n}$：\n\n- $-1 < r < 1$ 时趋于 $0$，因为幂越来越小；\n- $r = 1$ 时恒等于 $c$；\n- $r > 1$ 时按 $c$ 的符号趋于 $\\infty$ 或 $-\\infty$；\n- $r \\le -1$ 时没有极限，因为各项正负交替而不趋于定值。\n\n例如 $5\\left(-\\frac{2}{3}\\right)^{n} \\to 0$，而 $-2 \\cdot 3^{n} \\to -\\infty$。\n\n检验：$-2 \\cdot 3^{10} = -118098$，已经是很大的负数。\n\n> **注意。** $r = -1$ 时各项为 $-c, c, -c, \\ldots$：它们不增大，但仍然没有极限。",
      ),
      generate: geometricSequenceLimit,
    },
    {
      id: "rewriting-as-a-geometric-sequence",
      title: t("Rewriting a quotient of powers as $c \\cdot r^n$", "把幂的商改写成 $c \\cdot r^n$"),
      explanation: t(
        "A quotient of powers such as $\\frac{3^{n+1}}{4^{n}}$ is a geometric sequence once it is rewritten as $c \\cdot r^{n}$: $\\frac{3^{n+1}}{4^{n}} = 3 \\cdot \\left(\\frac{3}{4}\\right)^{n}$. Its ratio is $\\frac{3}{4}$, so it tends to $0$. Likewise $\\frac{2 \\cdot 5^{n+2}}{2^{n}} = 50 \\left(\\frac{5}{2}\\right)^{n} \\to \\infty$. Pull the extra factors of the base out first, then judge the ratio.\n\nCheck: the terms of $\\frac{3^{n+1}}{4^{n}}$ are $a_{1} = \\frac{9}{4}$ and $a_{2} = \\frac{27}{16}$, whose ratio is $\\frac{3}{4}$.\n\n> **Watch out.** The extra factor $3$ from $3^{n+1}$ changes the coefficient, not the ratio; the limit depends only on $\\frac{3}{4}$.",
        "像 $\\frac{3^{n+1}}{4^{n}}$ 这样的幂的商，改写成 $c \\cdot r^{n}$ 后就是等比数列：$\\frac{3^{n+1}}{4^{n}} = 3 \\cdot \\left(\\frac{3}{4}\\right)^{n}$。公比为 $\\frac{3}{4}$，所以趋于 $0$。同样，$\\frac{2 \\cdot 5^{n+2}}{2^{n}} = 50 \\left(\\frac{5}{2}\\right)^{n} \\to \\infty$。先把底数多出的因子提出来，再判断公比。\n\n检验：$\\frac{3^{n+1}}{4^{n}}$ 的项 $a_{1} = \\frac{9}{4}$，$a_{2} = \\frac{27}{16}$，两者之比为 $\\frac{3}{4}$。\n\n> **注意。** $3^{n+1}$ 多出的因子 $3$ 改变的是系数，不是公比；极限只取决于 $\\frac{3}{4}$。",
      ),
      generate: rewrittenLimit,
    },
  ],
};

/** exponentialQuotient divides a quotient of exponentials by the dominant one. */
function exponentialQuotient(rng: Rng): Problem {
  const b = rng.int(3, 7);
  const c = rng.int(2, b - 1);
  const d = rng.int(2, b - 1);
  const p = rng.nonZero(-9, 9);
  const r = rng.int(1, 9);
  const q = rng.nonZero(-9, 9);
  const s = rng.nonZero(-9, 9);
  const top = plus(term(p, `${b}^{n}`), term(q, `${c}^{n}`));
  const bottom = plus(term(r, `${b}^{n}`), term(s, `${d}^{n}`));
  const answer = Q.of(p, r);
  const ratio = (k: number) => `\\left(\\frac{${k}}{${b}}\\right)^{n}`;
  const at = (n: number) => (p + q * (c / b) ** n) / (r + s * (d / b) ** n);
  return numberWorked(
    t(`Find $${limN} \\frac{${top}}{${bottom}}$.`, `求 $${limN} \\frac{${top}}{${bottom}}$。`),
    answer,
    [
      step(
        "Divide by the fastest exponential",
        "除以增长最快的指数项",
        t(`The largest base is $${b}$, so divide every term by $${b}^{n}$:`, `最大的底数是 $${b}$，所以每一项都除以 $${b}^{n}$：`),
        `\\frac{${top}}{${bottom}} = \\frac{${plus(`${p}`, term(q, ratio(c)))}}{${plus(`${r}`, term(s, ratio(d)))}}`,
      ),
      step(
        "Let n grow",
        "让 n 增大",
        t(
          `Both powers have ratios $\\frac{${c}}{${b}}$ and $\\frac{${d}}{${b}}$ between $0$ and $1$, so they tend to $0$:`,
          `两个幂的公比 $\\frac{${c}}{${b}}$ 与 $\\frac{${d}}{${b}}$ 都在 $0$ 与 $1$ 之间，趋于 $0$：`,
        ),
        `${limN} \\frac{${top}}{${bottom}} = \\frac{${p} + 0}{${r} + 0} = ${answer.toLatex()}`,
      ),
    ],
    t(
      `Put in $n = 40$: the quotient is about $${approx(at(40))}$, close to $${near(answer)}$.`,
      `代入 $n = 40$：商约为 $${approx(at(40))}$，接近 $${near(answer)}$。`,
    ),
    [
      [
        Q.of(q, s),
        `This divides by the smaller exponentials; $${b}^{n}$ grows fastest and decides the limit`,
        `这里除以了较小的指数项；$${b}^{n}$ 增长最快，由它决定极限`,
      ],
      ...(r + s === 0
        ? []
        : [
            [
              Q.of(p + q, r + s),
              "This is the value at $n = 0$, where every power is $1$; the limit looks at large $n$",
              "这是 $n = 0$ 时的值，那时每个幂都等于 $1$；极限要看 $n$ 很大时",
            ] as const,
          ]),
      [Q.of(p), `This leaves out the denominator's coefficient $${r}$ of $${b}^{n}$`, `这里漏了分母中 $${b}^{n}$ 的系数 $${r}$`],
      [
        Q.zero,
        `The term $${b}^{n}$ is in both the numerator and the denominator, so it cancels to a nonzero ratio`,
        `$${b}^{n}$ 同时出现在分子和分母中，相除后得到非零的比值`,
      ],
    ],
  );
}

/** convergenceInterval finds the values of x for which (ax + b)ⁿ/kⁿ converges. */
function convergenceInterval(rng: Rng): Problem {
  const a = rng.int(1, 4);
  const b = rng.int(-9, 9);
  const k = rng.int(1, 9);
  const L = linear(a, b);
  const base = k === 1 ? `\\left(${L}\\right)^{n}` : `\\left(\\frac{${L}}{${k}}\\right)^{n}`;
  const lo = Q.of(-k - b, a);
  const hi = Q.of(k - b, a);
  const iv = (loClosed: boolean, hiClosed: boolean): Interval[] => [{ lo, hi, loClosed, hiClosed }];
  const middle = k === 1 ? L : `\\frac{${L}}{${k}}`;
  const ratioAt = (x: Q) =>
    `\\frac{${a === 1 ? "" : `${a} \\cdot `}${x.sign() < 0 ? `\\left(${x.toLatex()}\\right)` : x.toLatex()}${b === 0 ? "" : ` ${b < 0 ? "-" : "+"} ${Math.abs(b)}`}}{${k}}`;
  return intervalWorked(
    t(
      `For which values of $x$ does the sequence $a_n = ${base}$ converge? Give your answer in interval notation.`,
      `$x$ 取哪些值时数列 $a_n = ${base}$ 收敛？用区间表示。`,
    ),
    iv(false, true),
    [
      step(
        "Set up the condition",
        "列出条件",
        t("A geometric sequence $r^{n}$ converges exactly when $-1 < r \\le 1$:", "等比数列 $r^{n}$ 收敛当且仅当 $-1 < r \\le 1$："),
        `-1 < ${middle} \\le 1`,
      ),
      step(
        "Solve for x",
        "解出 x",
        k === 1 ? t("Solve for $x$:", "解出 $x$：") : t(`Multiply through by $${k}$, then solve for $x$:`, `各边乘以 $${k}$，再解出 $x$：`),
        `${-k} < ${L} \\le ${k}`,
        `${lo.toLatex()} < x \\le ${hi.toLatex()}`,
      ),
    ],
    t(
      `Substitute the ends. At $x = ${hi.toLatex()}$ the ratio is $${k === 1 ? "" : `${ratioAt(hi)} = `}1$ and every term is $1$, which converges; at $x = ${lo.toLatex()}$ the ratio is $${k === 1 ? "" : `${ratioAt(lo)} = `}-1$ and the terms alternate $-1, 1, -1, \\ldots$, which do not.`,
      `代入端点。$x = ${hi.toLatex()}$ 时公比为 $${k === 1 ? "" : `${ratioAt(hi)} = `}1$，每一项都是 $1$，收敛；$x = ${lo.toLatex()}$ 时公比为 $${k === 1 ? "" : `${ratioAt(lo)} = `}-1$，各项为 $-1, 1, -1, \\ldots$，不收敛。`,
    ),
    [
      [
        iv(false, false),
        `At $x = ${hi.toLatex()}$ the ratio is $1$ and the sequence is constant, so it converges; include that end`,
        `$x = ${hi.toLatex()}$ 时公比为 $1$，数列为常数，是收敛的；要包含这个端点`,
      ],
      [
        iv(true, true),
        `At $x = ${lo.toLatex()}$ the ratio is $-1$ and the terms alternate, so leave that end out`,
        `$x = ${lo.toLatex()}$ 时公比为 $-1$，各项正负交替，要去掉这个端点`,
      ],
      [
        iv(true, false),
        "The ends are the wrong way round: the ratio is $-1$ at the left end and $1$ at the right end",
        "两个端点弄反了：左端点处公比为 $-1$，右端点处为 $1$",
      ],
      [
        [{ lo: Q.of(-1 - b, a), hi: Q.of(1 - b, a), loClosed: false, hiClosed: true }],
        `This leaves out the denominator: multiply $-1 < ${middle} \\le 1$ through by $${k}$ first`,
        `这里漏了分母：要先把 $-1 < ${middle} \\le 1$ 各边乘以 $${k}$`,
      ],
    ],
  );
}

/** furtherConvergenceOfGeometricSequences handles sums of exponentials and ratios that depend on x. */
export const furtherConvergenceOfGeometricSequences: TopicDef = {
  id: "further-convergence-of-geometric-sequences",
  title: t("Further Convergence of Geometric Sequences", "等比数列收敛性进阶"),
  summary: t(
    "Divide by the dominant exponential to find limits of quotients of exponentials, and find the values of x for which a geometric sequence converges.",
    "除以占主导的指数项来求指数式之商的极限，并求使等比数列收敛的 x 的取值。",
  ),
  intro: t(
    "In a quotient of exponentials the largest base wins. Dividing every term by $5^{n}$:\n\n$$\\frac{2 \\cdot 5^{n} + 3^{n}}{5^{n} - 4^{n}} = \\frac{2 + \\left(\\frac{3}{5}\\right)^{n}}{1 - \\left(\\frac{4}{5}\\right)^{n}} \\to \\frac{2 + 0}{1 - 0} = 2.$$\n\nCheck: at $n = 30$, $\\left(\\frac{4}{5}\\right)^{30} \\approx 0.0012$ and $\\left(\\frac{3}{5}\\right)^{30} \\approx 2 \\times 10^{-7}$, so the quotient is about $\\frac{2}{0.9988} \\approx 2.002$.\n\nIn this lesson we find limits of quotients of exponentials and the values of $x$ for which a geometric sequence converges.",
    "在指数式之商中，底数最大的一项占优。每一项都除以 $5^{n}$：\n\n$$\\frac{2 \\cdot 5^{n} + 3^{n}}{5^{n} - 4^{n}} = \\frac{2 + \\left(\\frac{3}{5}\\right)^{n}}{1 - \\left(\\frac{4}{5}\\right)^{n}} \\to \\frac{2 + 0}{1 - 0} = 2$$\n\n检验：$n = 30$ 时 $\\left(\\frac{4}{5}\\right)^{30} \\approx 0.0012$，$\\left(\\frac{3}{5}\\right)^{30} \\approx 2 \\times 10^{-7}$，所以商约为 $\\frac{2}{0.9988} \\approx 2.002$。\n\n本课我们求指数式之商的极限，以及使等比数列收敛的 $x$ 的取值。",
  ),
  prerequisites: ["convergence-of-geometric-sequences"],
  encompasses: [{ topic: "convergence-of-geometric-sequences", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "quotients-of-exponentials",
      title: t("Quotients of exponentials", "指数式之商"),
      explanation: t(
        "Divide every term by the fastest-growing exponential. Each other term becomes a geometric sequence with ratio between $0$ and $1$, which tends to $0$:\n\n$$\\frac{2 \\cdot 5^{n} + 3^{n}}{5^{n} - 4^{n}} = \\frac{2 + \\left(\\frac{3}{5}\\right)^{n}}{1 - \\left(\\frac{4}{5}\\right)^{n}} \\to \\frac{2 + 0}{1 - 0} = 2.$$\n\nCheck: at $n = 30$ the quotient is about $2.002$.\n\n> **Watch out.** Putting in $n = 0$ gives $\\frac{3}{0}$, and dividing by $3^{n}$ leaves terms that grow; the limit comes from dividing by the fastest term, $5^{n}$.",
        "把每一项都除以增长最快的指数项。其余各项都变成公比在 $0$ 与 $1$ 之间的等比数列，趋于 $0$：\n\n$$\\frac{2 \\cdot 5^{n} + 3^{n}}{5^{n} - 4^{n}} = \\frac{2 + \\left(\\frac{3}{5}\\right)^{n}}{1 - \\left(\\frac{4}{5}\\right)^{n}} \\to \\frac{2 + 0}{1 - 0} = 2$$\n\n检验：$n = 30$ 时商约为 $2.002$。\n\n> **注意。** 代入 $n = 0$ 得到 $\\frac{3}{0}$，除以 $3^{n}$ 又会留下增长的项；极限要靠除以增长最快的 $5^{n}$ 求得。",
      ),
      generate: exponentialQuotient,
    },
    {
      id: "values-of-x-for-convergence",
      title: t("Values of x for which a geometric sequence converges", "使等比数列收敛的 x"),
      explanation: t(
        "A geometric sequence $r^{n}$ converges exactly when $-1 < r \\le 1$: to $0$ inside, and to $1$ at $r = 1$. When the ratio depends on $x$, solve this compound inequality. For $\\left(\\frac{x - 1}{3}\\right)^{n}$:\n\n$$-1 < \\frac{x - 1}{3} \\le 1 \\iff -3 < x - 1 \\le 3 \\iff -2 < x \\le 4,$$\n\nso the sequence converges for $x$ in $(-2, 4]$.\n\nCheck: at $x = 4$ the ratio is $1$ and every term is $1$; at $x = -2$ the ratio is $-1$ and the terms alternate.\n\n> **Watch out.** The two ends differ: $r = 1$ is included, $r = -1$ is not.",
        "等比数列 $r^{n}$ 收敛当且仅当 $-1 < r \\le 1$：区间内部收敛于 $0$，$r = 1$ 时收敛于 $1$。公比含 $x$ 时，解这个连不等式。对 $\\left(\\frac{x - 1}{3}\\right)^{n}$：\n\n$$-1 < \\frac{x - 1}{3} \\le 1 \\iff -3 < x - 1 \\le 3 \\iff -2 < x \\le 4$$\n\n所以当 $x$ 属于 $(-2, 4]$ 时数列收敛。\n\n检验：$x = 4$ 时公比为 $1$，每一项都是 $1$；$x = -2$ 时公比为 $-1$，各项正负交替。\n\n> **注意。** 两个端点不同：$r = 1$ 包含在内，$r = -1$ 不包含。",
      ),
      generate: convergenceInterval,
    },
  ],
};

/** cancelledFactorials cancels factorials that differ by a fixed amount. */
function cancelledFactorials(rng: Rng): Problem {
  const N = 1000;
  if (rng.bool()) {
    const m = rng.int(2, 5);
    const p = rng.int(1, 9);
    const q = rng.int(1, 9);
    const answer = Q.of(1, p);
    const bottom = poly([p, "n^{2}"], [q, ""]);
    const num = (N + m) * (N + m - 1);
    const den = p * N * N + q;
    return numberWorked(
      t(
        `Find $${limN} \\frac{${fact(m)}}{${fact(m - 2)} \\, (${bottom})}$.`,
        `求 $${limN} \\frac{${fact(m)}}{${fact(m - 2)} \\, (${bottom})}$。`,
      ),
      answer,
      [
        step(
          "Cancel the factorials",
          "约去阶乘",
          t(`$${fact(m)}$ is $${fact(m - 2)}$ times its two largest factors:`, `$${fact(m)}$ 等于 $${fact(m - 2)}$ 乘以它最大的两个因子：`),
          `\\frac{${fact(m)}}{${fact(m - 2)}} = (${shift(m)})(${shift(m - 1)})`,
        ),
        step(
          "Compare the leading terms",
          "比较首项",
          t(
            `The numerator is a quadratic with leading coefficient $1$, so divide by $n^{2}$:`,
            `分子是首项系数为 $1$ 的二次式，同除以 $n^{2}$：`,
          ),
          `\\frac{(${shift(m)})(${shift(m - 1)})}{${bottom}} \\to \\frac{1}{${p}}`,
        ),
      ],
      t(
        `Put in $n = ${N}$: $\\frac{${N + m} \\cdot ${N + m - 1}}{${den}} = \\frac{${num}}{${den}} \\approx ${approx(num / den)}$, close to $${near(answer)}$.`,
        `代入 $n = ${N}$：$\\frac{${N + m} \\cdot ${N + m - 1}}{${den}} = \\frac{${num}}{${den}} \\approx ${approx(num / den)}$，接近 $${near(answer)}$。`,
      ),
      [
        [Q.of(p), `This turns the fraction over: the limit is $\\frac{1}{${p}}$`, `分数颠倒了：极限是 $\\frac{1}{${p}}$`],
        [
          Q.zero,
          "After cancelling, the numerator and the denominator are both quadratics, so the limit is not $0$",
          "约分后分子分母都是二次式，极限不是 $0$",
        ],
        [Q.one, `This leaves out the coefficient $${p}$ of $n^{2}$ in the denominator`, `这里漏了分母中 $n^{2}$ 的系数 $${p}$`],
        [
          Q.of(m * (m - 1), q),
          "This is the ratio of the constant terms; for large $n$ the $n^{2}$ terms decide",
          "这是常数项之比；$n$ 很大时由 $n^{2}$ 项决定",
        ],
      ],
    );
  }
  const k = rng.nonZero(-9, 9);
  const j = rng.int(1, 9);
  const top = linear(k, j, "n");
  return numberWorked(
    t(`Find $${limN} \\frac{(${top}) \\, n!}{(n + 1)!}$.`, `求 $${limN} \\frac{(${top}) \\, n!}{(n + 1)!}$。`),
    k,
    [
      step(
        "Cancel the factorials",
        "约去阶乘",
        t("$(n + 1)! = (n + 1) \\cdot n!$, so", "$(n + 1)! = (n + 1) \\cdot n!$，所以"),
        `\\frac{(${top}) \\, n!}{(n + 1)!} = \\frac{${top}}{n + 1}`,
      ),
      step(
        "Compare the leading terms",
        "比较首项",
        t("Divide by $n$:", "同除以 $n$："),
        `\\frac{${sum(`${k}`, over(j, "n"))}}{1 + \\frac{1}{n}} \\to ${k}`,
      ),
    ],
    t(
      `Put in $n = ${N}$: $\\frac{${k * N + j}}{${N + 1}} \\approx ${approx((k * N + j) / (N + 1))}$, close to $${k}$.`,
      `代入 $n = ${N}$：$\\frac{${k * N + j}}{${N + 1}} \\approx ${approx((k * N + j) / (N + 1))}$，接近 $${k}$。`,
    ),
    [
      [j, "This is the ratio of the constant terms; for large $n$ the $n$ terms decide", "这是常数项之比；$n$ 很大时由 $n$ 项决定"],
      [
        0,
        "$(n + 1)!$ is only $n + 1$ times $n!$, and the linear numerator keeps pace with that",
        "$(n + 1)!$ 只是 $n!$ 的 $n + 1$ 倍，分子的一次式与之同阶",
      ],
      [Q.of(k + j, 2), "This is the first term $a_{1}$; the limit looks at large $n$", "这是第一项 $a_{1}$；极限要看 $n$ 很大时"],
      [Q.of(1, k), "This turns the ratio over: the coefficient of $n$ is on top", "比值颠倒了：$n$ 的系数在分子上"],
    ],
  );
}

/** factorialAgainstPower compares n! with an exponential. */
function factorialAgainstPower(rng: Rng): Problem {
  const c = rng.nonZero(-9, 9);
  const k = rng.int(2, 9);
  const flip = rng.bool();
  const exp = term(c, `${k}^{n}`);
  const expr = flip ? `\\frac{n!}{${exp}}` : `\\frac{${exp}}{n!}`;
  const right: LimitValue = flip ? (c > 0 ? "inf" : "-inf") : Q.zero;
  let factorial = 1;
  for (let i = 2; i <= 30; i++) factorial *= i;
  const a30 = flip ? factorial / (c * k ** 30) : (c * k ** 30) / factorial;
  const ratio = flip ? `\\frac{n + 1}{${k}}` : `\\frac{${k}}{n + 1}`;
  const infReason = (s: "inf" | "-inf"): Choice =>
    flip
      ? [s, `The sign is that of $${c}$, the coefficient below`, `符号与分母中的系数 $${c}$ 相同`]
      : [
          s,
          `Here $n!$ is in the denominator and outgrows $${k}^{n}$, so the quotient shrinks`,
          `这里 $n!$ 在分母中，增长快于 $${k}^{n}$，所以商趋于 $0$`,
        ];
  return limitAsk(
    rng,
    t(`Find $${limN} ${expr}$.`, `求 $${limN} ${expr}$。`),
    right,
    [
      [
        Q.of(c),
        `This is the coefficient $${c}$; the race between $n!$ and $${k}^{n}$ decides the limit`,
        `这是系数 $${c}$；极限由 $n!$ 与 $${k}^{n}$ 的快慢决定`,
      ],
      [
        Q.zero,
        `Here $n!$ is on top and outgrows $${k}^{n}$, so the quotient grows`,
        `这里 $n!$ 在分子上，增长快于 $${k}^{n}$，所以商无界增长`,
      ],
      [Q.of(1, c), "This divides out the coefficient but ignores how the factorial grows", "这只处理了系数，没有考虑阶乘的增长"],
      infReason("inf"),
      infReason("-inf"),
    ],
    [
      step(
        "Compare consecutive terms",
        "比较相邻两项",
        t("Each step multiplies the quotient by", "每走一步，商都乘以"),
        `\\frac{a_{n+1}}{a_n} = ${ratio}`,
      ),
      step(
        "Let n grow",
        "让 n 增大",
        flip
          ? t(
              `Once $n + 1 > ${k}$ this factor exceeds $1$ and keeps growing, so the size grows without bound with the sign of $${c}$; ${limitWord(right).en}.`,
              `一旦 $n + 1 > ${k}$，这个因子就大于 $1$ 且不断变大，所以绝对值无界增长，符号与 $${c}$ 相同；${limitWord(right)["zh-CN"]}。`,
            )
          : t(
              `Once $n + 1 > ${k}$ this factor is less than $1$ and keeps shrinking, so the terms shrink to $0$; ${limitWord(right).en}.`,
              `一旦 $n + 1 > ${k}$，这个因子就小于 $1$ 且越来越小，所以各项缩小到 $0$；${limitWord(right)["zh-CN"]}。`,
            ),
      ),
    ],
    t(`Put in $n = 30$: the quotient is about $${approx(a30)}$.`, `代入 $n = 30$：商约为 $${approx(a30)}$。`),
  );
}

/** limitsOfSequencesWithFactorials cancels factorials and compares them with exponentials. */
export const limitsOfSequencesWithFactorials: TopicDef = {
  id: "limits-of-sequences-with-factorials",
  title: t("Limits of Sequences With Factorials", "含阶乘的数列的极限"),
  summary: t(
    "Cancel factorials by writing the larger one as a product ending in the smaller one; n! grows faster than any exponential kⁿ.",
    "把较大的阶乘写成以较小阶乘结尾的乘积来约分；n! 比任何指数 kⁿ 增长得都快。",
  ),
  intro: t(
    "A larger factorial contains a smaller one, so a quotient of factorials often cancels to a polynomial:\n\n$$\\frac{(n + 2)!}{n! \\, (3n^{2} + 1)} = \\frac{(n + 2)(n + 1)}{3n^{2} + 1} \\to \\frac{1}{3}.$$\n\nCheck: at $n = 100$ the quotient is $\\frac{102 \\cdot 101}{30001} = \\frac{10302}{30001} \\approx 0.343$, close to $\\frac{1}{3}$.\n\nIn this lesson we cancel factorials and see that $n!$ outgrows every exponential $k^{n}$.",
    "较大的阶乘包含较小的阶乘，所以阶乘之商常常能约成多项式：\n\n$$\\frac{(n + 2)!}{n! \\, (3n^{2} + 1)} = \\frac{(n + 2)(n + 1)}{3n^{2} + 1} \\to \\frac{1}{3}$$\n\n检验：$n = 100$ 时商为 $\\frac{102 \\cdot 101}{30001} = \\frac{10302}{30001} \\approx 0.343$，接近 $\\frac{1}{3}$。\n\n本课我们约去阶乘，并看到 $n!$ 比任何指数 $k^{n}$ 增长得都快。",
  ),
  prerequisites: ["limits-of-sequences", "factorials-in-variable-expressions"],
  encompasses: [{ topic: "limits-of-sequences", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "cancelling-factorials",
      title: t("Cancelling factorials", "阶乘的约分"),
      explanation: t(
        "A larger factorial contains every factor of a smaller one, so write the larger one as a product ending in the smaller factorial and cancel. Since $(n + 1)! = (n + 1) \\cdot n!$ and $(n + 2)! = (n + 2)(n + 1) \\cdot n!$, a quotient of factorials that differ by a fixed amount is a polynomial:\n\n$$\\frac{(n + 2)!}{n! \\, (3n^{2} + 1)} = \\frac{(n + 2)(n + 1)}{3n^{2} + 1} \\to \\frac{1}{3}.$$\n\nCheck: at $n = 3$, $\\frac{5!}{3!} = \\frac{120}{6} = 20 = 5 \\cdot 4$.\n\n> **Watch out.** $\\frac{(n + 2)!}{n!}$ is not $2$ or $\\frac{n + 2}{n}$: two whole factors, $(n + 2)(n + 1)$, are left.",
        "较大的阶乘包含较小阶乘的所有因子，所以把较大的阶乘写成以较小阶乘结尾的乘积，再约分。由于 $(n + 1)! = (n + 1) \\cdot n!$，$(n + 2)! = (n + 2)(n + 1) \\cdot n!$，相差固定量的两个阶乘之商是多项式：\n\n$$\\frac{(n + 2)!}{n! \\, (3n^{2} + 1)} = \\frac{(n + 2)(n + 1)}{3n^{2} + 1} \\to \\frac{1}{3}$$\n\n检验：$n = 3$ 时 $\\frac{5!}{3!} = \\frac{120}{6} = 20 = 5 \\cdot 4$。\n\n> **注意。** $\\frac{(n + 2)!}{n!}$ 不是 $2$，也不是 $\\frac{n + 2}{n}$：剩下的是两个完整的因子 $(n + 2)(n + 1)$。",
      ),
      generate: cancelledFactorials,
    },
    {
      id: "factorials-against-exponentials",
      title: t("Factorials against exponentials", "阶乘与指数比较"),
      explanation: t(
        "For any fixed $k$, $n!$ eventually outgrows $k^{n}$: once $n > k$, each new factor of $n!$ exceeds $k$. So $\\frac{k^{n}}{n!} \\to 0$ and $\\frac{n!}{k^{n}} \\to \\infty$. For example, $\\frac{-3 \\cdot 5^{n}}{n!} \\to 0$ and $\\frac{n!}{-2 \\cdot 4^{n}} \\to -\\infty$.\n\nCheck: $\\frac{5^{20}}{20!} \\approx 4 \\times 10^{-5}$, and the ratio of consecutive terms $\\frac{5}{n + 1}$ is less than $1$ from $n = 5$ on.\n\n> **Watch out.** For small $n$ the exponential can be larger, as $\\frac{5^{3}}{3!} \\approx 20.8$ shows; the limit is about large $n$.",
        "对任意固定的 $k$，$n!$ 最终都会超过 $k^{n}$：一旦 $n > k$，$n!$ 每增加的一个因子都大于 $k$。所以 $\\frac{k^{n}}{n!} \\to 0$，$\\frac{n!}{k^{n}} \\to \\infty$。例如 $\\frac{-3 \\cdot 5^{n}}{n!} \\to 0$，$\\frac{n!}{-2 \\cdot 4^{n}} \\to -\\infty$。\n\n检验：$\\frac{5^{20}}{20!} \\approx 4 \\times 10^{-5}$，而相邻两项之比 $\\frac{5}{n + 1}$ 从 $n = 5$ 起小于 $1$。\n\n> **注意。** $n$ 较小时指数项可能更大，例如 $\\frac{5^{3}}{3!} \\approx 20.8$；极限看的是 $n$ 很大时。",
      ),
      generate: factorialAgainstPower,
    },
  ],
};

/** factorial is n! in floating point. */
function factorial(n: number): number {
  let f = 1;
  for (let i = 2; i <= n; i++) f *= i;
  return f;
}

/** Growth is a kind of term in the hierarchy ln n ≪ nᵏ ≪ bⁿ ≪ n! ≪ nⁿ. */
interface Growth {
  readonly rank: number;
  readonly tex: string;
  /** value evaluates the term at n in floating point. */
  readonly value: (n: number) => number;
}

/** growth picks a term of the given rank. */
function growth(rng: Rng, rank: number): Growth {
  if (rank === 0) return { rank, tex: "\\ln n", value: Math.log };
  if (rank === 1) {
    const k = rng.int(2, 5);
    return { rank, tex: `n^{${k}}`, value: (n) => n ** k };
  }
  if (rank === 2) {
    const b = rng.int(2, 6);
    return { rank, tex: `${b}^{n}`, value: (n) => b ** n };
  }
  if (rank === 3) return { rank, tex: "n!", value: factorial };
  return { rank, tex: "n^{n}", value: (n) => n ** n };
}

/** hierarchy states the order of growth. */
const hierarchy = "\\ln n \\ll n^{k} \\ll b^{n} \\ll n! \\ll n^{n}";

/** dominantQuotient divides a quotient by the term that dominates both its numerator and its denominator. */
function dominantQuotient(rng: Rng): Problem {
  const D = growth(rng, rng.int(1, 4));
  const lesser = () => growth(rng, rng.int(0, D.rank - 1));
  const x = lesser();
  const y = lesser();
  const p = rng.nonZero(-9, 9);
  const q = rng.int(1, 9);
  const u = rng.nonZero(-5, 5);
  const v = rng.nonZero(-5, 5);
  const top = plus(term(p, D.tex), term(u, x.tex));
  const bottom = plus(term(q, D.tex), term(v, y.tex));
  const answer = Q.of(p, q);
  const at = (n: number) => (p * D.value(n) + u * x.value(n)) / (q * D.value(n) + v * y.value(n));
  const part = (c: number, g: Growth) => term(c, `\\frac{${g.tex}}{${D.tex}}`);
  return numberWorked(
    t(`Find $${limN} \\frac{${top}}{${bottom}}$.`, `求 $${limN} \\frac{${top}}{${bottom}}$。`),
    answer,
    [
      step(
        "Find the dominant term",
        "找出主导项",
        t(
          `By $${hierarchy}$, the fastest-growing term above and below is $${D.tex}$.`,
          `由 $${hierarchy}$，分子分母中增长最快的项都是 $${D.tex}$。`,
        ),
      ),
      step(
        "Divide by it",
        "同除以主导项",
        t("Each slower term over the dominant one tends to $0$:", "每个较慢的项除以主导项都趋于 $0$："),
        `\\frac{${top}}{${bottom}} = \\frac{${plus(`${p}`, part(u, x))}}{${plus(`${q}`, part(v, y))}} \\to ${q === 1 ? `${p}` : `\\frac{${p}}{${q}}${answer.isInteger() || gcd(Math.abs(p), q) > 1 ? ` = ${answer.toLatex()}` : ""}`}`,
      ),
    ],
    t(
      `Put in $n = 100$: the quotient is about $${approx(at(100))}$, close to $${near(answer)}$.`,
      `代入 $n = 100$：商约为 $${approx(at(100))}$，接近 $${near(answer)}$。`,
    ),
    [
      [
        Q.of(u, v),
        "This is the ratio of the slower terms' coefficients; those terms become negligible",
        "这是较慢的项的系数之比；这些项最终可以忽略",
      ],
      [
        Q.of(q, p),
        `This turns the fraction over: the numerator's coefficient of $${D.tex}$ goes on top`,
        `分数颠倒了：分子中 $${D.tex}$ 的系数应在上面`,
      ],
      [
        Q.zero,
        `The same term $${D.tex}$ dominates above and below, so the quotient does not tend to $0$`,
        `分子分母的主导项都是 $${D.tex}$，商不会趋于 $0$`,
      ],
      [Q.of(p), `This leaves out the denominator's coefficient $${q}$`, `这里漏了分母的系数 $${q}$`],
    ],
  );
}

/** rootQuotient finds the limit of a square root over a polynomial-sized term. */
function rootQuotient(rng: Rng): Problem {
  const pw = (e: number) => (e === 1 ? "n" : `n^{${e}}`);
  const a = rng.int(1, 6);
  const k = rng.int(1, 3);
  const j = rng.int(0, 2 * k - 1);
  const q = rng.int(1, 9);
  const c = rng.nonZero(-9, 9);
  const e = rng.nonZero(-5, 5);
  const inside = plus(term(a * a, pw(2 * k)), term(c, j === 0 ? "" : pw(j)));
  const log = k === 1 || rng.bool();
  const lower = log ? "\\ln n" : pw(k - 1);
  const bottom = plus(term(q, pw(k)), term(e, lower));
  const answer = Q.of(a, q);
  const N = 1000;
  const value = Math.sqrt(a * a * N ** (2 * k) + c * N ** j) / (q * N ** k + e * (log ? Math.log(N) : N ** (k - 1)));
  const lowerOver = log ? term(e, `\\frac{\\ln n}{${pw(k)}}`) : over(e, "n");
  return numberWorked(
    t(`Find $${limN} \\frac{\\sqrt{${inside}}}{${bottom}}$.`, `求 $${limN} \\frac{\\sqrt{${inside}}}{${bottom}}$。`),
    answer,
    [
      step(
        "Take the dominant term out of the root",
        "把主导项提到根号外",
        t(
          `Inside the root $${a * a}${pw(2 * k)}$ dominates, and $\\sqrt{${pw(2 * k)}} = ${pw(k)}$:`,
          `根号内 $${a * a}${pw(2 * k)}$ 占主导，且 $\\sqrt{${pw(2 * k)}} = ${pw(k)}$：`,
        ),
        `\\sqrt{${inside}} = ${pw(k)} \\sqrt{${sum(`${a * a}`, over(c, pw(2 * k - j)))}}`,
      ),
      step(
        "Divide by the same power",
        "同除以这个幂",
        t(`Divide the numerator and the denominator by $${pw(k)}$:`, `分子分母同除以 $${pw(k)}$：`),
        `\\frac{\\sqrt{${sum(`${a * a}`, over(c, pw(2 * k - j)))}}}{${sum(`${q}`, lowerOver)}} \\to \\frac{\\sqrt{${a * a}}}{${q}} = ${answer.toLatex()}`,
      ),
    ],
    t(
      `Put in $n = ${N}$: the quotient is about $${approx(value)}$, close to $${near(answer)}$.`,
      `代入 $n = ${N}$：商约为 $${approx(value)}$，接近 $${near(answer)}$。`,
    ),
    [
      [
        Q.of(a * a, q),
        `This forgets the square root of the coefficient: $\\sqrt{${a * a}${pw(2 * k)}} = ${term(a, pw(k))}$`,
        `这里忘了对系数开方：$\\sqrt{${a * a}${pw(2 * k)}} = ${term(a, pw(k))}$`,
      ],
      [Q.of(q, a), "This turns the fraction over: the root's coefficient goes on top", "分数颠倒了：根号部分的系数应在上面"],
      [
        Q.zero,
        `Under the root $${pw(2 * k)}$ becomes $${pw(k)}$, the same power as below, so the limit is not $0$`,
        `根号下的 $${pw(2 * k)}$ 开方后是 $${pw(k)}$，与分母同阶，所以极限不是 $0$`,
      ],
    ],
  );
}

/** determiningLimitsOfSequencesUsingRelativeMagnitudes divides by the dominant term. */
export const determiningLimitsOfSequencesUsingRelativeMagnitudes: TopicDef = {
  id: "determining-limits-of-sequences-using-relative-magnitudes",
  title: t("Determining Limits of Sequences Using Relative Magnitudes", "利用相对量级求数列的极限"),
  summary: t(
    "As n → ∞, ln n ≪ nᵏ ≪ bⁿ ≪ n! ≪ nⁿ; dividing by the dominant term leaves the ratio of its coefficients.",
    "当 n → ∞ 时，ln n ≪ nᵏ ≪ bⁿ ≪ n! ≪ nⁿ；除以占主导的项后只剩其系数之比。",
  ),
  intro: t(
    `The usual kinds of terms grow at very different rates:\n\n$$${hierarchy}.$$\n\nWhen the same term dominates the numerator and the denominator, divide by it:\n\n$$\\frac{4 \\cdot 3^{n} + n^{5}}{2 \\cdot 3^{n} - \\ln n} = \\frac{4 + \\frac{n^{5}}{3^{n}}}{2 - \\frac{\\ln n}{3^{n}}} \\to 2.$$\n\nCheck: at $n = 30$, $\\frac{n^{5}}{3^{n}} \\approx 1.2 \\times 10^{-7}$, so the quotient is already about $2.0000$.\n\nIn this lesson we divide by the dominant term, also when it sits under a square root.`,
    `常见的几类项增长速度相差很大：\n\n$$${hierarchy}$$\n\n分子分母的主导项相同时，同除以它：\n\n$$\\frac{4 \\cdot 3^{n} + n^{5}}{2 \\cdot 3^{n} - \\ln n} = \\frac{4 + \\frac{n^{5}}{3^{n}}}{2 - \\frac{\\ln n}{3^{n}}} \\to 2$$\n\n检验：$n = 30$ 时 $\\frac{n^{5}}{3^{n}} \\approx 1.2 \\times 10^{-7}$，所以商已约为 $2.0000$。\n\n本课我们除以主导项来求极限，包括主导项在根号下的情形。`,
  ),
  prerequisites: [
    "limits-of-sequences-with-factorials",
    "further-convergence-of-geometric-sequences",
    "evaluating-limits-at-infinity-by-comparing-relative-magnitudes-of-functions",
  ],
  encompasses: [{ topic: "limits-of-sequences-with-factorials", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "dividing-by-the-dominant-term",
      title: t("Dividing by the dominant term", "除以主导项"),
      explanation: t(
        `For large $n$ the common kinds of terms are ordered by growth (with $k > 0$ and $b > 1$):\n\n$$${hierarchy}.$$\n\nEach is eventually negligible next to the next, so the quotient of any lower term by a higher one tends to $0$. When the numerator and the denominator share the same dominant term $D$, divide by $D$:\n\n$$\\frac{4 \\cdot 3^{n} + n^{5}}{2 \\cdot 3^{n} - \\ln n} = \\frac{4 + \\frac{n^{5}}{3^{n}}}{2 - \\frac{\\ln n}{3^{n}}} \\to 2.$$\n\nCheck: at $n = 30$, $3^{30} \\approx 2.06 \\times 10^{14}$ while $30^{5} \\approx 2.43 \\times 10^{7}$, so $n^{5}$ is already negligible.\n\n> **Watch out.** For small $n$ the slower term can be the larger one ($n^{5} > 3^{n}$ at $n = 10$); the order describes large $n$.`,
        `$n$ 很大时，常见的项按增长快慢排列（$k > 0$，$b > 1$）：\n\n$$${hierarchy}$$\n\n每一项最终都远小于后一项，所以较低的项除以较高的项趋于 $0$。分子分母的主导项 $D$ 相同时，同除以 $D$：\n\n$$\\frac{4 \\cdot 3^{n} + n^{5}}{2 \\cdot 3^{n} - \\ln n} = \\frac{4 + \\frac{n^{5}}{3^{n}}}{2 - \\frac{\\ln n}{3^{n}}} \\to 2$$\n\n检验：$n = 30$ 时 $3^{30} \\approx 2.06 \\times 10^{14}$，而 $30^{5} \\approx 2.43 \\times 10^{7}$，$n^{5}$ 已经可以忽略。\n\n> **注意。** $n$ 较小时较慢的项可能更大（$n = 10$ 时 $n^{5} > 3^{n}$）；这个顺序说的是 $n$ 很大时。`,
      ),
      generate: dominantQuotient,
    },
    {
      id: "a-dominant-term-under-a-root",
      title: t("A dominant term under a square root", "根号下的主导项"),
      explanation: t(
        "Under a square root, the dominant part is the square root of the dominant term inside: for large $n$, $\\sqrt{9n^{4} + 5n}$ behaves like $\\sqrt{9n^{4}} = 3n^{2}$. So $\\frac{\\sqrt{9n^{4} + 5n}}{2n^{2} - \\ln n}$ behaves like $\\frac{3n^{2}}{2n^{2}}$ and tends to $\\frac{3}{2}$. Dividing the numerator by $n^{2}$ is the same as dividing inside the root by $n^{4}$.\n\nCheck: at $n = 100$, $\\sqrt{9 \\cdot 10^{8} + 500} \\approx 30000.01$ and $2 \\cdot 10^{4} - \\ln 100 \\approx 19995.4$, a quotient of about $1.5003$.\n\n> **Watch out.** The coefficient comes out of the root too: $\\sqrt{9n^{4}} = 3n^{2}$, not $9n^{2}$.",
        "在根号下，占主导的部分是根号内主导项的平方根：$n$ 很大时，$\\sqrt{9n^{4} + 5n}$ 的表现与 $\\sqrt{9n^{4}} = 3n^{2}$ 相同。所以 $\\frac{\\sqrt{9n^{4} + 5n}}{2n^{2} - \\ln n}$ 的表现与 $\\frac{3n^{2}}{2n^{2}}$ 相同，趋于 $\\frac{3}{2}$。分子除以 $n^{2}$，相当于在根号内除以 $n^{4}$。\n\n检验：$n = 100$ 时 $\\sqrt{9 \\cdot 10^{8} + 500} \\approx 30000.01$，$2 \\cdot 10^{4} - \\ln 100 \\approx 19995.4$，商约为 $1.5003$。\n\n> **注意。** 系数也要开方：$\\sqrt{9n^{4}} = 3n^{2}$，不是 $9n^{2}$。",
      ),
      generate: rootQuotient,
    },
  ],
};

/** comparedQuotient finds the limit of a quotient whose numerator and denominator may be dominated by different terms. */
function comparedQuotient(rng: Rng): Problem {
  const rn = rng.int(1, 4);
  let rd = rng.int(1, 4);
  if (rd === rn && rng.int(1, 4) > 1) rd = rn === 4 ? 1 : rn + 1;
  const N = growth(rng, rn);
  // With the same rank the same term dominates both, so the limit is the ratio of their coefficients.
  const Dn = rd === rn ? N : growth(rng, rd);
  const x = growth(rng, rng.int(0, rn - 1));
  const y = growth(rng, rng.int(0, rd - 1));
  const p = rng.nonZero(-9, 9);
  const q = rng.nonZero(-9, 9);
  const u = rng.nonZero(-5, 5);
  const v = rng.nonZero(-5, 5);
  const top = plus(term(p, N.tex), term(u, x.tex));
  const bottom = plus(term(q, Dn.tex), term(v, y.tex));
  const right: LimitValue = rn < rd ? Q.zero : rn > rd ? (p * q > 0 ? "inf" : "-inf") : Q.of(p, q);
  const at = (n: number) => (p * N.value(n) + u * x.value(n)) / (q * Dn.value(n) + v * y.value(n));
  const why =
    rn < rd
      ? t(`$${Dn.tex}$ in the denominator grows faster than $${N.tex}$`, `分母中的 $${Dn.tex}$ 比 $${N.tex}$ 增长得快`)
      : rn > rd
        ? t(
            `$${N.tex}$ in the numerator grows faster than $${Dn.tex}$, and the sign is that of $\\frac{${p}}{${q}}$`,
            `分子中的 $${N.tex}$ 比 $${Dn.tex}$ 增长得快，符号与 $\\frac{${p}}{${q}}$ 相同`,
          )
        : t(
            `both are dominated by $${N.tex}$, so the limit is $\\frac{${p}}{${q}}$`,
            `分子分母的主导项都是 $${N.tex}$，极限为 $\\frac{${p}}{${q}}$`,
          );
  const infReason = (s: "inf" | "-inf"): Choice =>
    rn < rd
      ? [s, `The denominator's $${Dn.tex}$ grows faster, so the quotient shrinks`, `分母中的 $${Dn.tex}$ 增长更快，商会变小`]
      : rn === rd
        ? [
            s,
            `The same term $${N.tex}$ dominates above and below, so the quotient settles at $\\frac{${p}}{${q}}$`,
            `分子分母的主导项都是 $${N.tex}$，商趋于 $\\frac{${p}}{${q}}$`,
          ]
        : [
            s,
            `The sign is wrong: $\\frac{${p}}{${q}}$ is ${p * q > 0 ? "positive" : "negative"}`,
            `符号错了：$\\frac{${p}}{${q}}$ 为${p * q > 0 ? "正" : "负"}`,
          ];
  return limitAsk(
    rng,
    t(`Find $${limN} \\frac{${top}}{${bottom}}$.`, `求 $${limN} \\frac{${top}}{${bottom}}$。`),
    right,
    [
      [
        Q.of(p, q),
        `The ratio of the coefficients is the limit only when the same term dominates above and below; here they are $${N.tex}$ and $${Dn.tex}$`,
        `只有分子分母的主导项相同时，极限才是系数之比；这里分别是 $${N.tex}$ 与 $${Dn.tex}$`,
      ],
      rn > rd
        ? [
            Q.zero,
            `The numerator's $${N.tex}$ grows faster, so the quotient grows rather than shrinks`,
            `分子中的 $${N.tex}$ 增长更快，商会增大而不是变小`,
          ]
        : [
            Q.zero,
            `The same term $${N.tex}$ dominates above and below, so the quotient tends to $\\frac{${p}}{${q}}$, not $0$`,
            `分子分母的主导项都是 $${N.tex}$，商趋于 $\\frac{${p}}{${q}}$，不是 $0$`,
          ],
      infReason("inf"),
      infReason("-inf"),
    ],
    [
      step(
        "Find the dominant terms",
        "找出主导项",
        t(
          `By $${hierarchy}$, the numerator is dominated by $${term(p, N.tex)}$ and the denominator by $${term(q, Dn.tex)}$.`,
          `由 $${hierarchy}$，分子的主导项是 $${term(p, N.tex)}$，分母的主导项是 $${term(q, Dn.tex)}$。`,
        ),
      ),
      step("Compare them", "比较二者", t(`Here ${why.en}; ${limitWord(right).en}.`, `这里${why["zh-CN"]}；${limitWord(right)["zh-CN"]}。`)),
    ],
    t(`Put in $n = 100$: the quotient is about $${approx(at(100))}$.`, `代入 $n = 100$：商约为 $${approx(at(100))}$。`),
  );
}

/** sameKindQuotient compares two exponentials or two powers of n. */
function sameKindQuotient(rng: Rng): Problem {
  const exponential = rng.bool();
  const [b, c] = [rng.int(2, 7), rng.int(2, 7)];
  const p = rng.nonZero(-9, 9);
  const q = rng.nonZero(-9, 9);
  const u = rng.nonZero(-5, 5);
  const w = rng.int(1, 5);
  const lead = (v: number) => (exponential ? `${v}^{n}` : `n^{${v}}`);
  const top = plus(term(p, lead(b)), term(u, exponential ? "n^{2}" : "\\ln n"));
  const bottom = plus(term(q, lead(c)), term(w, exponential ? "n" : ""));
  const right: LimitValue = b < c ? Q.zero : b > c ? (p * q > 0 ? "inf" : "-inf") : Q.of(p, q);
  const val = (v: number, n: number) => (exponential ? v ** n : n ** v);
  const at = (n: number) => (p * val(b, n) + u * (exponential ? n * n : Math.log(n))) / (q * val(c, n) + w * (exponential ? n : 1));
  const kind = exponential
    ? t("exponentials, the larger base", "指数项中底数大的")
    : t("powers of $n$, the larger exponent", "$n$ 的幂中指数大的");
  const quotient = exponential
    ? `\\frac{${b}^{n}}{${c}^{n}} = \\left(\\frac{${b}}{${c}}\\right)^{n}`
    : `\\frac{n^{${b}}}{n^{${c}}} = ${b === c ? "1" : b > c ? `n^{${b - c}}` : `\\frac{1}{n^{${c - b}}}`}`;
  const infReason = (s: "inf" | "-inf"): Choice =>
    b < c
      ? [s, `The denominator's $${lead(c)}$ grows faster, so the quotient shrinks`, `分母中的 $${lead(c)}$ 增长更快，商会变小`]
      : b === c
        ? [
            s,
            `The same term $${lead(b)}$ dominates above and below, so the quotient settles at $\\frac{${p}}{${q}}$`,
            `分子分母的主导项都是 $${lead(b)}$，商趋于 $\\frac{${p}}{${q}}$`,
          ]
        : [
            s,
            `The sign is wrong: $\\frac{${p}}{${q}}$ is ${p * q > 0 ? "positive" : "negative"}`,
            `符号错了：$\\frac{${p}}{${q}}$ 为${p * q > 0 ? "正" : "负"}`,
          ];
  return limitAsk(
    rng,
    t(`Find $${limN} \\frac{${top}}{${bottom}}$.`, `求 $${limN} \\frac{${top}}{${bottom}}$。`),
    right,
    [
      [
        Q.of(p, q),
        `The ratio of the coefficients is the limit only when the dominant terms match; here they are $${lead(b)}$ and $${lead(c)}$`,
        `只有主导项相同时，极限才是系数之比；这里分别是 $${lead(b)}$ 与 $${lead(c)}$`,
      ],
      b > c
        ? [
            Q.zero,
            `The numerator's $${lead(b)}$ grows faster, so the quotient grows rather than shrinks`,
            `分子中的 $${lead(b)}$ 增长更快，商会增大而不是变小`,
          ]
        : [
            Q.zero,
            `The same term $${lead(b)}$ dominates above and below, so the quotient tends to $\\frac{${p}}{${q}}$, not $0$`,
            `分子分母的主导项都是 $${lead(b)}$，商趋于 $\\frac{${p}}{${q}}$，不是 $0$`,
          ],
      infReason("inf"),
      infReason("-inf"),
    ],
    [
      step(
        "Find the dominant terms",
        "找出主导项",
        t(
          `The dominant terms are $${term(p, lead(b))}$ above and $${term(q, lead(c))}$ below.`,
          `分子的主导项是 $${term(p, lead(b))}$，分母的是 $${term(q, lead(c))}$。`,
        ),
      ),
      step(
        "Compare them",
        "比较二者",
        t(
          `Among ${kind.en} grows faster: ${b < c ? "the denominator wins" : b > c ? `the numerator wins and the sign is that of $\\frac{${p}}{${q}}$` : `they match and the limit is the ratio $\\frac{${p}}{${q}}$`}; ${limitWord(right).en}.`,
          `${kind["zh-CN"]}增长更快：${b < c ? "分母占优" : b > c ? `分子占优，符号与 $\\frac{${p}}{${q}}$ 相同` : `两者相同，极限为系数之比 $\\frac{${p}}{${q}}$`}；${limitWord(right)["zh-CN"]}。`,
        ),
        quotient,
      ),
    ],
    t(`Put in $n = 100$: the quotient is about $${approx(at(100))}$.`, `代入 $n = 100$：商约为 $${approx(at(100))}$。`),
  );
}

/** furtherDeterminingLimitsOfSequencesUsingRelativeMagnitudes compares different dominant terms above and below. */
export const furtherDeterminingLimitsOfSequencesUsingRelativeMagnitudes: TopicDef = {
  id: "further-determining-limits-of-sequences-using-relative-magnitudes",
  title: t("Further Determining Limits of Sequences Using Relative Magnitudes", "利用相对量级求数列的极限进阶"),
  summary: t(
    "When the dominant terms above and below differ, the faster one decides: the limit is 0 or ±∞.",
    "分子分母的主导项不同时，增长更快的一方决定结果：极限为 0 或 ±∞。",
  ),
  intro: t(
    "When the numerator and the denominator are dominated by different terms, the faster one decides. In\n\n$$\\frac{n^{4} - 2^{n}}{3 \\cdot n! + n}$$\n\nthe numerator is dominated by $-2^{n}$ and the denominator by $3 \\cdot n!$, which grows faster, so the limit is $0$.\n\nCheck: at $n = 20$ the numerator is about $-8.9 \\times 10^{5}$ and the denominator about $7.3 \\times 10^{18}$, a quotient of about $-1.2 \\times 10^{-13}$.\n\nIn this lesson we compare dominant terms of different kinds, and terms of the same kind.",
    "分子分母的主导项不同时，增长更快的一方决定结果。在\n\n$$\\frac{n^{4} - 2^{n}}{3 \\cdot n! + n}$$\n\n中，分子的主导项是 $-2^{n}$，分母的主导项是增长更快的 $3 \\cdot n!$，所以极限为 $0$。\n\n检验：$n = 20$ 时分子约为 $-8.9 \\times 10^{5}$，分母约为 $7.3 \\times 10^{18}$，商约为 $-1.2 \\times 10^{-13}$。\n\n本课我们比较不同类的主导项，也比较同类的项。",
  ),
  prerequisites: ["determining-limits-of-sequences-using-relative-magnitudes"],
  encompasses: [{ topic: "determining-limits-of-sequences-using-relative-magnitudes", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "comparing-dominant-terms",
      title: t("Comparing the dominant terms above and below", "比较分子分母的主导项"),
      explanation: t(
        "Find the dominant term of the numerator and of the denominator. If the denominator's grows faster, the limit is $0$; if the numerator's grows faster, the sequence tends to $\\infty$ or $-\\infty$ by the sign of the ratio of their coefficients; if they are the same, the limit is that ratio. For example, $\\frac{n^{4} - 2^{n}}{3 \\cdot n! + n} \\to 0$ and $\\frac{-n!}{5^{n} + n^{2}} \\to -\\infty$.\n\nCheck: at $n = 20$, $\\frac{-20!}{5^{20} + 400} \\approx -2.6 \\times 10^{4}$, and it grows in size from there.\n\n> **Watch out.** The sign of an infinite limit comes from the dominant coefficients: $-n!$ over $+5^{n}$ gives $-\\infty$.",
        "分别找出分子和分母的主导项。若分母的增长更快，极限为 $0$；若分子的增长更快，数列按两者系数之比的符号趋于 $\\infty$ 或 $-\\infty$；若相同，极限就是该比值。例如 $\\frac{n^{4} - 2^{n}}{3 \\cdot n! + n} \\to 0$，$\\frac{-n!}{5^{n} + n^{2}} \\to -\\infty$。\n\n检验：$n = 20$ 时 $\\frac{-20!}{5^{20} + 400} \\approx -2.6 \\times 10^{4}$，之后绝对值还会继续增大。\n\n> **注意。** 无穷极限的符号由主导项的系数决定：$-n!$ 除以 $+5^{n}$ 得 $-\\infty$。",
      ),
      generate: comparedQuotient,
    },
    {
      id: "comparing-terms-of-the-same-kind",
      title: t("Comparing terms of the same kind", "比较同类的项"),
      explanation: t(
        "Terms of the same kind are ordered too. Among exponentials the larger base wins, since $\\frac{2^{n}}{3^{n}} = \\left(\\frac{2}{3}\\right)^{n} \\to 0$; among powers of $n$ the larger exponent wins, since $\\frac{n^{2}}{n^{3}} = \\frac{1}{n} \\to 0$. So $\\frac{5 \\cdot 4^{n} + n}{3^{n} + n^{2}} \\to \\infty$, while $\\frac{n^{2} + 1}{4n^{3} - \\ln n} \\to 0$.\n\nCheck: at $n = 20$, $\\frac{5 \\cdot 4^{20}}{3^{20}} = 5\\left(\\frac{4}{3}\\right)^{20} \\approx 1586$, and it keeps growing.\n\n> **Watch out.** $3^{n}$ and $4^{n}$ are the same kind, but they do not grow at the same rate: their quotient is a geometric sequence.",
        "同类的项之间也有快慢之分。指数项中底数大的增长更快，因为 $\\frac{2^{n}}{3^{n}} = \\left(\\frac{2}{3}\\right)^{n} \\to 0$；$n$ 的幂中指数大的增长更快，因为 $\\frac{n^{2}}{n^{3}} = \\frac{1}{n} \\to 0$。所以 $\\frac{5 \\cdot 4^{n} + n}{3^{n} + n^{2}} \\to \\infty$，而 $\\frac{n^{2} + 1}{4n^{3} - \\ln n} \\to 0$。\n\n检验：$n = 20$ 时 $\\frac{5 \\cdot 4^{20}}{3^{20}} = 5\\left(\\frac{4}{3}\\right)^{20} \\approx 1586$，而且还在增大。\n\n> **注意。** $3^{n}$ 与 $4^{n}$ 同类，但增长速度不同：它们的商是一个等比数列。",
      ),
      generate: sameKindQuotient,
    },
  ],
};

/** monotonicity names whether a sequence increases, decreases or neither. */
const monotonicity = [
  t("Increasing", "单调递增"),
  t("Decreasing", "单调递减"),
  t("Neither increasing nor decreasing", "既不递增也不递减"),
] as const;

/** linearQuotient is the sequence (pn + q)/(n + s) at n. */
const linearQuotient = (p: number, q: number, s: number, n: number) => Q.of(p * n + q, n + s);

/** differenceNumerator finds the constant K in aₙ₊₁ − aₙ = K/((n + s)(n + s + 1)). */
function differenceNumerator(rng: Rng): Problem {
  for (;;) {
    const p = rng.nonZero(-6, 6);
    const q = rng.int(-9, 9);
    const s = rng.int(0, 6);
    const K = p * s - q;
    if (K === 0) continue;
    const [a1, a2] = [linearQuotient(p, q, s, 1), linearQuotient(p, q, s, 2)];
    return numberWorked(
      t(
        `For $a_n = \\frac{${linear(p, q, "n")}}{${shift(s)}}$, the difference $a_{n+1} - a_n$ simplifies to $\\frac{K}{(${shift(s)})(${shift(s + 1)})}$. Find $K$.`,
        `对 $a_n = \\frac{${linear(p, q, "n")}}{${shift(s)}}$，差 $a_{n+1} - a_n$ 可化简为 $\\frac{K}{(${shift(s)})(${shift(s + 1)})}$。求 $K$。`,
      ),
      K,
      [
        step(
          "Write the next term",
          "写出下一项",
          t("Replace $n$ by $n + 1$:", "把 $n$ 换成 $n + 1$："),
          `a_{n+1} = \\frac{${linear(p, p + q, "n")}}{${shift(s + 1)}}`,
        ),
        step(
          "Subtract over a common denominator",
          "通分相减",
          t(
            "The $n^{2}$ and $n$ terms cancel in the numerator, leaving the constant terms:",
            "分子中 $n^{2}$ 项与 $n$ 项相消，只剩常数项：",
          ),
          `(${linear(p, p + q, "n")})(${shift(s)}) - (${linear(p, q, "n")})(${shift(s + 1)})`,
          `${paren(p + q)} \\cdot ${s} - ${paren(q)} \\cdot ${s + 1} = ${K}`,
        ),
      ],
      t(
        `Compare actual terms: $a_{1} = ${a1.toLatex()}$ and $a_{2} = ${a2.toLatex()}$, so $a_{2} - a_{1} = ${a2.sub(a1).toLatex()}$; the formula gives $\\frac{${K}}{${1 + s} \\cdot ${2 + s}} = ${Q.of(K, (1 + s) * (2 + s)).toLatex()}$.`,
        `用具体的项核对：$a_{1} = ${a1.toLatex()}$，$a_{2} = ${a2.toLatex()}$，所以 $a_{2} - a_{1} = ${a2.sub(a1).toLatex()}$；公式给出 $\\frac{${K}}{${1 + s} \\cdot ${2 + s}} = ${Q.of(K, (1 + s) * (2 + s)).toLatex()}$。`,
      ),
      [
        [-K, "The sign is reversed: this is $a_n - a_{n+1}$", "符号反了：这是 $a_n - a_{n+1}$"],
        [
          p * s + q,
          `This adds the second product; it is subtracted: $${paren(p + q)} \\cdot ${s} - ${paren(q)} \\cdot ${s + 1}$`,
          `这里把第二个乘积加上了；应当减去：$${paren(p + q)} \\cdot ${s} - ${paren(q)} \\cdot ${s + 1}$`,
        ],
        [
          p * s,
          `This multiplies $a_n$ by $${shift(s)}$ as well; over the common denominator it is multiplied by $${shift(s + 1)}$`,
          `这里把 $a_n$ 也乘了 $${shift(s)}$；通分时它应乘以 $${shift(s + 1)}$`,
        ],
        [
          p * (s + 1),
          `This multiplies $a_{n+1}$ by $${shift(s + 1)}$ as well; over the common denominator it is multiplied by $${shift(s)}$`,
          `这里把 $a_{n+1}$ 也乘了 $${shift(s + 1)}$；通分时它应乘以 $${shift(s)}$`,
        ],
      ],
    );
  }
}

/** classifiedSequence decides whether a sequence increases, decreases or neither. */
function classifiedSequence(rng: Rng): Problem {
  const prompt = (a: string) =>
    t(`Is the sequence $a_n = ${a}$ increasing, decreasing or neither?`, `数列 $a_n = ${a}$ 是单调递增、单调递减，还是都不是？`);
  const kind = rng.int(0, 2);
  if (kind === 0) {
    for (;;) {
      const p = rng.nonZero(-6, 6);
      const q = rng.int(-9, 9);
      const s = rng.int(0, 6);
      const K = p * s - q;
      if (K === 0) continue;
      const a = `\\frac{${linear(p, q, "n")}}{${shift(s)}}`;
      const up = K > 0;
      const terms = [1, 2, 3].map((n) => linearQuotient(p, q, s, n).toLatex());
      return choose(
        rng,
        prompt(a),
        monotonicity[up ? 0 : 1],
        [
          [
            monotonicity[up ? 1 : 0],
            `The difference has numerator $${K}$, which is ${up ? "positive" : "negative"}`,
            `差的分子是 $${K}$，为${up ? "正" : "负"}`,
          ],
          [
            monotonicity[2],
            "The difference has the same sign for every $n$: its numerator is a constant and its denominator is positive",
            "差对每个 $n$ 符号都相同：分子是常数，分母为正",
          ],
        ],
        [
          step("Find the difference", "求差", none, `a_{n+1} - a_n = \\frac{${K}}{(${shift(s)})(${shift(s + 1)})}`),
          step(
            "Read its sign",
            "看它的符号",
            t(
              `The denominator is positive, so the difference is ${up ? "positive" : "negative"} for every $n \\ge 1$: the sequence is ${up ? "increasing" : "decreasing"}.`,
              `分母为正，所以差对每个 $n \\ge 1$ 都${up ? "为正" : "为负"}：数列单调${up ? "递增" : "递减"}。`,
            ),
          ),
        ],
        t(
          `The first terms are $${terms.join(", ")}$, which ${up ? "rise" : "fall"} as expected.`,
          `前几项为 $${terms.join(", ")}$，确实在${up ? "增大" : "减小"}。`,
        ),
      );
    }
  }
  if (kind === 1) {
    const k = rng.int(-3, 12);
    const a = poly([1, "n^{2}"], [-k, "n"]);
    // a_{n+1} − a_n = 2n + 1 − k is positive for all n ≥ 1 exactly when k < 3.
    const inc = k < 3;
    const v = (n: number) => n * n - k * n;
    const late = Math.max(k, 2);
    return choose(
      rng,
      prompt(a),
      monotonicity[inc ? 0 : 2],
      [
        [
          monotonicity[1],
          `The difference $${linear(2, 1 - k, "n")}$ is positive for large $n$, so the terms cannot keep falling`,
          `差 $${linear(2, 1 - k, "n")}$ 在 $n$ 很大时为正，各项不会一直减小`,
        ],
        inc
          ? [
              monotonicity[2],
              `The difference $${linear(2, 1 - k, "n")}$ is already positive at $n = 1$ and only grows`,
              `差 $${linear(2, 1 - k, "n")}$ 在 $n = 1$ 时已为正，之后只会更大`,
            ]
          : [
              monotonicity[0],
              `At $n = 1$ the difference is $${3 - k} \\le 0$, so the terms do not rise from the start`,
              `$n = 1$ 时差为 $${3 - k} \\le 0$，各项并非一开始就增大`,
            ],
      ],
      [
        step(
          "Find the difference",
          "求差",
          none,
          `a_{n+1} - a_n = ${poly([1, "(n + 1)^{2}"], [-k, "(n + 1)"])} - (${a}) = ${linear(2, 1 - k, "n")}`,
        ),
        step(
          "Read its sign",
          "看它的符号",
          inc
            ? t("It is positive for every $n \\ge 1$, so the sequence is increasing.", "它对每个 $n \\ge 1$ 都为正，所以数列单调递增。")
            : t(
                `At $n = 1$ it is $${3 - k} \\le 0$, but it is positive for large $n$, so the sequence is neither.`,
                `$n = 1$ 时它等于 $${3 - k} \\le 0$，但 $n$ 很大时为正，所以既不递增也不递减。`,
              ),
        ),
      ],
      inc
        ? t(`The first terms are $${[1, 2, 3].map(v).join(", ")}$, rising.`, `前几项为 $${[1, 2, 3].map(v).join(", ")}$，在增大。`)
        : t(
            `Compare terms: $a_{1} = ${v(1)}$ and $a_{2} = ${v(2)}$, so $a_{2} \\le a_{1}$, while $a_{${late}} = ${v(late)}$ and $a_{${late + 1}} = ${v(late + 1)}$ rise.`,
            `比较各项：$a_{1} = ${v(1)}$，$a_{2} = ${v(2)}$，所以 $a_{2} \\le a_{1}$；而 $a_{${late}} = ${v(late)}$，$a_{${late + 1}} = ${v(late + 1)}$ 在增大。`,
          ),
    );
  }
  const c = rng.int(1, 9);
  const s = rng.int(0, 6);
  const a = `\\frac{(-1)^{n} \\, ${c}}{${shift(s)}}`;
  const terms = [1, 2, 3].map((n) => Q.of((-1) ** n * c, n + s).toLatex());
  return choose(
    rng,
    prompt(a),
    monotonicity[2],
    [
      [
        monotonicity[0],
        "The factor $(-1)^{n}$ makes every odd-numbered term negative, below the even-numbered one before it",
        "因子 $(-1)^{n}$ 使每个奇数项为负，比它前面的偶数项小",
      ],
      [
        monotonicity[1],
        "The factor $(-1)^{n}$ makes every even-numbered term positive, above the odd-numbered one before it",
        "因子 $(-1)^{n}$ 使每个偶数项为正，比它前面的奇数项大",
      ],
    ],
    [
      step(
        "Look at the signs",
        "看符号",
        t(
          "The factor $(-1)^{n}$ makes odd-numbered terms negative and even-numbered terms positive.",
          "因子 $(-1)^{n}$ 使奇数项为负、偶数项为正。",
        ),
      ),
      step(
        "Decide",
        "判断",
        t(
          "So the terms go up from each odd $n$ and down from each even $n$: the sequence is neither increasing nor decreasing.",
          "所以从奇数项到下一项上升，从偶数项到下一项下降：既不递增也不递减。",
        ),
      ),
    ],
    t(`The first terms are $${terms.join(", ")}$: up, then down.`, `前几项为 $${terms.join(", ")}$：先升后降。`),
  );
}

/** monotonicSequences decides monotonicity from the sign of aₙ₊₁ − aₙ. */
export const monotonicSequences: TopicDef = {
  id: "monotonic-sequences",
  title: t("Monotonic Sequences", "单调数列"),
  summary: t(
    "A sequence is increasing when aₙ₊₁ > aₙ for every n and decreasing when aₙ₊₁ < aₙ; check the sign of aₙ₊₁ − aₙ.",
    "若对每个 n 都有 aₙ₊₁ > aₙ，数列单调递增；若 aₙ₊₁ < aₙ，则单调递减；看 aₙ₊₁ − aₙ 的符号即可。",
  ),
  intro: t(
    "Whether a sequence rises or falls is decided by the sign of $a_{n+1} - a_n$. For $a_n = \\frac{2n + 1}{n + 3}$:\n\n$$a_{n+1} - a_n = \\frac{5}{(n + 3)(n + 4)} > 0,$$\n\nso the sequence is increasing.\n\nCheck: $a_{1} = \\frac{3}{4}$, $a_{2} = 1$ and $a_{3} = \\frac{7}{6}$ do rise.\n\nIn this lesson we simplify the difference of consecutive terms and use its sign to classify sequences as increasing, decreasing or neither.",
    "数列是升是降由 $a_{n+1} - a_n$ 的符号决定。对 $a_n = \\frac{2n + 1}{n + 3}$：\n\n$$a_{n+1} - a_n = \\frac{5}{(n + 3)(n + 4)} > 0$$\n\n所以数列单调递增。\n\n检验：$a_{1} = \\frac{3}{4}$，$a_{2} = 1$，$a_{3} = \\frac{7}{6}$，确实在增大。\n\n本课我们化简相邻两项之差，并用它的符号判断数列递增、递减还是都不是。",
  ),
  prerequisites: ["limits-of-sequences"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-difference-of-consecutive-terms",
      title: t("The difference of consecutive terms", "相邻两项之差"),
      explanation: t(
        "To decide whether $a_n$ is monotonic, simplify $a_{n+1} - a_n$. For $a_n = \\frac{2n + 1}{n + 3}$:\n\n$$a_{n+1} - a_n = \\frac{2n + 3}{n + 4} - \\frac{2n + 1}{n + 3} = \\frac{(2n + 3)(n + 3) - (2n + 1)(n + 4)}{(n + 3)(n + 4)} = \\frac{5}{(n + 3)(n + 4)}.$$\n\nThe difference is positive for every $n \\ge 1$, so the sequence is increasing.\n\nCheck: $a_{2} - a_{1} = 1 - \\frac{3}{4} = \\frac{1}{4}$, and the formula gives $\\frac{5}{4 \\cdot 5} = \\frac{1}{4}$.\n\n> **Watch out.** Each fraction is multiplied by the other's denominator: $2n + 3$ by $n + 3$, and $2n + 1$ by $n + 4$.",
        "判断 $a_n$ 是否单调，就化简 $a_{n+1} - a_n$。对 $a_n = \\frac{2n + 1}{n + 3}$：\n\n$$a_{n+1} - a_n = \\frac{2n + 3}{n + 4} - \\frac{2n + 1}{n + 3} = \\frac{(2n + 3)(n + 3) - (2n + 1)(n + 4)}{(n + 3)(n + 4)} = \\frac{5}{(n + 3)(n + 4)}$$\n\n对每个 $n \\ge 1$ 差都为正，所以数列单调递增。\n\n检验：$a_{2} - a_{1} = 1 - \\frac{3}{4} = \\frac{1}{4}$，公式给出 $\\frac{5}{4 \\cdot 5} = \\frac{1}{4}$。\n\n> **注意。** 每个分数乘的是另一个分数的分母：$2n + 3$ 乘 $n + 3$，$2n + 1$ 乘 $n + 4$。",
      ),
      generate: differenceNumerator,
    },
    {
      id: "classifying-monotonic-sequences",
      title: t("Classifying sequences as increasing or decreasing", "判断数列的增减"),
      explanation: t(
        "A sequence is **increasing** if $a_{n+1} > a_n$ for all $n \\ge 1$, **decreasing** if $a_{n+1} < a_n$ for all $n \\ge 1$, and **monotonic** if it is either. A sign that alternates, as with a factor $(-1)^{n}$, or a difference that changes sign, means it is neither. For $a_n = n^{2} - 5n$, $a_{n+1} - a_n = 2n - 4$ is negative at $n = 1$ and positive at $n = 3$, so the sequence is not monotonic.\n\nCheck: the terms are $-4, -6, -6, -4, 0$: down, level, then up.\n\n> **Watch out.** Rising for large $n$ is not enough: an increasing sequence rises at every step from $n = 1$.",
        "若对所有 $n \\ge 1$ 有 $a_{n+1} > a_n$，数列**单调递增**；若 $a_{n+1} < a_n$，则**单调递减**；两者之一成立就称为**单调**数列。若符号正负交替（如含因子 $(-1)^{n}$），或差会变号，则既不递增也不递减。对 $a_n = n^{2} - 5n$，$a_{n+1} - a_n = 2n - 4$ 在 $n = 1$ 时为负、在 $n = 3$ 时为正，所以数列不单调。\n\n检验：各项为 $-4, -6, -6, -4, 0$：先降，再持平，然后上升。\n\n> **注意。** 只在 $n$ 很大时上升还不够：递增数列要从 $n = 1$ 起每一步都上升。",
      ),
      generate: classifiedSequence,
    },
  ],
};

/** turningPoint finds where aₙ = f(n) starts to decrease, from the sign of f′. */
function turningPoint(rng: Rng): Problem {
  const later = (N: number): Slip[] => [
    [
      N + 1,
      `Already $a_{${N + 1}} < a_{${N}}$, so the decrease starts at $n = ${N}$`,
      `已经有 $a_{${N + 1}} < a_{${N}}$，所以从 $n = ${N}$ 起就递减`,
    ],
    ...(N >= 2
      ? [
          [
            N - 1,
            `At $n = ${N - 1}$ the next term is larger: $a_{${N}} > a_{${N - 1}}$`,
            `$n = ${N - 1}$ 时下一项更大：$a_{${N}} > a_{${N - 1}}$`,
          ] as const,
        ]
      : []),
  ];
  const turn = (N: number) =>
    step(
      "Read the sign of the derivative",
      "看导数的符号",
      t(
        `$f'(x)$ is positive for $0 < x < ${N}$ and negative for $x > ${N}$, so the terms increase up to $a_{${N}}$ and decrease after it: $N = ${N}$.`,
        `$f'(x)$ 在 $0 < x < ${N}$ 时为正，在 $x > ${N}$ 时为负，所以各项增大到 $a_{${N}}$，之后递减：$N = ${N}$。`,
      ),
    );
  if (rng.int(0, 2) > 0) {
    const p = rng.int(1, 3);
    const k = rng.int(1, 9);
    const N = p * k;
    const xp = p === 1 ? "x" : `x^{${p}}`;
    const np = p === 1 ? "n" : `n^{${p}}`;
    const ex = (v: string) => (k === 1 ? `e^{-${v}}` : `e^{-${v}/${k}}`);
    const kx = k === 1 ? "x" : `\\frac{x}{${k}}`;
    const front = p === 1 ? "" : p === 2 ? "x" : "x^{2}";
    const a = (n: number) => approx(n ** p * Math.exp(-n / k));
    const shown = N >= 2 ? [N - 1, N, N + 1] : [N, N + 1];
    return numberWorked(
      t(
        `Let $a_n = ${np} ${ex("n")}$. Using $f(x) = ${xp} ${ex("x")}$, find the smallest $N$ such that $a_{n+1} < a_n$ for every $n \\ge N$.`,
        `设 $a_n = ${np} ${ex("n")}$。利用 $f(x) = ${xp} ${ex("x")}$，求使得对每个 $n \\ge N$ 都有 $a_{n+1} < a_n$ 的最小 $N$。`,
      ),
      N,
      [
        step(
          "Differentiate",
          "求导",
          t("By the product rule,", "由乘积的求导法则，"),
          `f'(x) = ${front}${ex("x")}\\left(${p} - ${kx}\\right)`,
        ),
        turn(N),
      ],
      t(
        `Work out the terms near $n = ${N}$: ${shown.map((n) => `$a_{${n}} \\approx ${a(n)}$`).join(", ")}; they ${N >= 2 ? "rise to" : "start at"} the largest value at $n = ${N}$ and then fall.`,
        `算出 $n = ${N}$ 附近的项：${shown.map((n) => `$a_{${n}} \\approx ${a(n)}$`).join("，")}；它们在 $n = ${N}$ 处${N >= 2 ? "升到" : "就是"}最大值，之后下降。`,
      ),
      [
        ...later(N),
        ...(p > 1
          ? [
              [
                k,
                `This is only the divisor in the exponent; $f'$ changes sign at $x = ${p} \\cdot ${k}$`,
                `这只是指数中的除数；$f'$ 在 $x = ${p} \\cdot ${k}$ 处变号`,
              ] as const,
            ]
          : []),
        ...(k > 1
          ? [
              [
                p,
                `This is only the power of $n$; $f'$ changes sign at $x = ${p} \\cdot ${k}$`,
                `这只是 $n$ 的次数；$f'$ 在 $x = ${p} \\cdot ${k}$ 处变号`,
              ] as const,
            ]
          : []),
      ],
    );
  }
  const k = rng.int(2, 12);
  const a = (n: number) => Q.of(n, n * n + k * k);
  return numberWorked(
    t(
      `Let $a_n = \\frac{n}{n^{2} + ${k * k}}$. Using $f(x) = \\frac{x}{x^{2} + ${k * k}}$, find the smallest $N$ such that $a_{n+1} < a_n$ for every $n \\ge N$.`,
      `设 $a_n = \\frac{n}{n^{2} + ${k * k}}$。利用 $f(x) = \\frac{x}{x^{2} + ${k * k}}$，求使得对每个 $n \\ge N$ 都有 $a_{n+1} < a_n$ 的最小 $N$。`,
    ),
    k,
    [
      step(
        "Differentiate",
        "求导",
        t("By the quotient rule,", "由商的求导法则，"),
        `f'(x) = \\frac{(x^{2} + ${k * k}) - x \\cdot 2x}{(x^{2} + ${k * k})^{2}} = \\frac{${k * k} - x^{2}}{(x^{2} + ${k * k})^{2}}`,
      ),
      turn(k),
    ],
    t(
      `Compare the terms near $n = ${k}$: $a_{${k - 1}} = ${a(k - 1).toLatex()}$, $a_{${k}} = ${a(k).toLatex()}$ and $a_{${k + 1}} = ${a(k + 1).toLatex()}$, and indeed $a_{${k - 1}} < a_{${k}} > a_{${k + 1}}$.`,
      `比较 $n = ${k}$ 附近的项：$a_{${k - 1}} = ${a(k - 1).toLatex()}$，$a_{${k}} = ${a(k).toLatex()}$，$a_{${k + 1}} = ${a(k + 1).toLatex()}$，确实 $a_{${k - 1}} < a_{${k}} > a_{${k + 1}}$。`,
    ),
    [
      [
        k * k,
        `This is where $x^{2}$ equals $${k * k}$, so solve $x^{2} = ${k * k}$: $x = ${k}$`,
        `这是 $x^{2}$ 应等于的值；解 $x^{2} = ${k * k}$ 得 $x = ${k}$`,
      ],
      ...later(k),
    ],
  );
}

/** linearQuotientDirection decides whether (pn + q)/(rn + s) increases or decreases. */
function linearQuotientDirection(rng: Rng): Problem {
  let [p, q, r, s] = [0, 0, 0, 0];
  do [p, q, r, s] = [rng.int(1, 9), rng.nonZero(-9, 9), rng.int(1, 9), rng.int(1, 9)];
  while (p * s === q * r);
  const det = p * s - q * r;
  const an = `\\frac{${linear(p, q, "n")}}{${linear(r, s, "n")}}`;
  const increasing = t("It is increasing", "递增");
  const decreasing = t("It is decreasing", "递减");
  const terms = [1, 2, 3].map((n) => Q.of(p * n + q, r * n + s).toLatex());
  const never = [
    "The derivative never changes sign: its numerator is constant and its denominator is a square",
    "导数不会变号：它的分子是常数，分母是平方",
  ] as const;
  return choose(
    rng,
    t(`Is the sequence $a_n = ${an}$, $n \\ge 1$, increasing or decreasing?`, `数列 $a_n = ${an}$（$n \\ge 1$）是递增还是递减？`),
    det > 0 ? increasing : decreasing,
    [
      [
        det > 0 ? decreasing : increasing,
        `The numerator of $f'$ is the constant $${det}$, which is ${det > 0 ? "positive" : "negative"}`,
        `$f'$ 的分子是常数 $${det}$，为${det > 0 ? "正" : "负"}`,
      ],
      [t("It increases and then decreases", "先增后减"), ...never],
      [t("It decreases and then increases", "先减后增"), ...never],
    ],
    [
      step(
        "Differentiate",
        "求导",
        t(
          `With $f(x) = \\frac{${linear(p, q, "x")}}{${linear(r, s, "x")}}$, the quotient rule gives`,
          `设 $f(x) = \\frac{${linear(p, q, "x")}}{${linear(r, s, "x")}}$，由商的求导法则`,
        ),
        `f'(x) = \\frac{${p} \\cdot ${s} - ${paren(q)} \\cdot ${r}}{(${linear(r, s, "x")})^{2}} = \\frac{${det}}{(${linear(r, s, "x")})^{2}}`,
      ),
      step(
        "Read its sign",
        "看它的符号",
        t(
          `This is ${det > 0 ? "positive" : "negative"} for every $x \\ge 1$, so the sequence is ${det > 0 ? "increasing" : "decreasing"}.`,
          `它对每个 $x \\ge 1$ 都${det > 0 ? "为正" : "为负"}，所以数列${det > 0 ? "递增" : "递减"}。`,
        ),
      ),
    ],
    t(
      `The first terms are $${terms.join(", ")}$, which ${det > 0 ? "rise" : "fall"} toward the limit $${Q.of(p, r).toLatex()}$.`,
      `前几项为 $${terms.join(", ")}$，${det > 0 ? "逐渐增大" : "逐渐减小"}并趋于极限 $${Q.of(p, r).toLatex()}$。`,
    ),
  );
}

/** identifyingMonotonicSequencesUsingDifferentiation uses the sign of f′ for aₙ = f(n). */
export const identifyingMonotonicSequencesUsingDifferentiation: TopicDef = {
  id: "identifying-monotonic-sequences-using-differentiation",
  title: t("Identifying Monotonic Sequences Using Differentiation", "用导数判断数列的单调性"),
  summary: t(
    "If aₙ = f(n) and f′(x) < 0 for x ≥ N, the sequence is decreasing from n = N on.",
    "若 aₙ = f(n) 且当 x ≥ N 时 f′(x) < 0，则数列从 n = N 起单调递减。",
  ),
  intro: t(
    "When $a_n = f(n)$ for a differentiable $f$, the sign of $f'$ shows where the terms rise and fall. For $a_n = n e^{-n/3}$:\n\n$$f'(x) = e^{-x/3}\\left(1 - \\frac{x}{3}\\right),$$\n\nwhich is positive for $x < 3$ and negative for $x > 3$, so the sequence decreases from $n = 3$ on.\n\nCheck: $a_{2} \\approx 1.0268$, $a_{3} \\approx 1.1036$ and $a_{4} \\approx 1.0544$: the terms rise to $a_{3}$ and then fall.\n\nIn this lesson we use derivatives to find where a sequence starts to decrease and to decide whether a quotient of linear terms rises or falls.",
    "若 $a_n = f(n)$ 且 $f$ 可导，$f'$ 的符号说明各项在哪里增大、在哪里减小。对 $a_n = n e^{-n/3}$：\n\n$$f'(x) = e^{-x/3}\\left(1 - \\frac{x}{3}\\right)$$\n\n它在 $x < 3$ 时为正，在 $x > 3$ 时为负，所以数列从 $n = 3$ 起递减。\n\n检验：$a_{2} \\approx 1.0268$，$a_{3} \\approx 1.1036$，$a_{4} \\approx 1.0544$：各项增大到 $a_{3}$，然后减小。\n\n本课我们用导数找出数列从哪一项开始递减，并判断一次式之商是增是减。",
  ),
  prerequisites: ["monotonic-sequences", "determining-intervals-on-which-a-function-is-increasing-or-decreasing"],
  encompasses: [{ topic: "monotonic-sequences", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "eventually-decreasing-sequences",
      title: t("Where a sequence starts to decrease", "数列从哪一项开始递减"),
      explanation: t(
        "When $a_n = f(n)$ for a differentiable $f$, the sign of $f'(x)$ tells how the terms move: if $f' < 0$ on $[N, \\infty)$, then $a_N > a_{N+1} > a_{N+2} > \\cdots$. For $a_n = n e^{-n/3}$, $f'(x) = e^{-x/3}\\left(1 - \\frac{x}{3}\\right)$, which is positive for $x < 3$ and negative for $x > 3$. So $a_1 < a_2 < a_3$ and the sequence decreases from $n = 3$ on.\n\nCheck: $a_{3} = 3e^{-1} \\approx 1.104$ is larger than both $a_{2} \\approx 1.027$ and $a_{4} \\approx 1.054$.\n\n> **Watch out.** The answer is where $f'$ changes sign, $x = 3$, not where $f'$ is most negative or the first $n$ after the turn.",
        "若 $a_n = f(n)$ 且 $f$ 可导，$f'(x)$ 的符号说明了各项的变化：若在 $[N, \\infty)$ 上 $f' < 0$，则 $a_N > a_{N+1} > a_{N+2} > \\cdots$。对 $a_n = n e^{-n/3}$，$f'(x) = e^{-x/3}\\left(1 - \\frac{x}{3}\\right)$，在 $x < 3$ 时为正，在 $x > 3$ 时为负。所以 $a_1 < a_2 < a_3$，数列从 $n = 3$ 起递减。\n\n检验：$a_{3} = 3e^{-1} \\approx 1.104$ 比 $a_{2} \\approx 1.027$ 和 $a_{4} \\approx 1.054$ 都大。\n\n> **注意。** 答案是 $f'$ 变号的地方 $x = 3$，不是 $f'$ 最负的地方，也不是转折后的下一个 $n$。",
      ),
      generate: turningPoint,
    },
    {
      id: "monotonic-quotients-of-linear-terms",
      title: t("Quotients of linear terms", "一次式之商"),
      explanation: t(
        "For $a_n = \\frac{pn + q}{rn + s}$ with $rn + s > 0$, the quotient rule gives $f'(x) = \\frac{ps - qr}{(rx + s)^{2}}$. The denominator is positive, so the sign of $ps - qr$ decides for every $n$ at once: the sequence is increasing when $ps - qr > 0$ and decreasing when $ps - qr < 0$. For $\\frac{2n + 1}{n + 3}$, $ps - qr = 6 - 1 = 5 > 0$, so it increases toward its limit $2$.\n\nCheck: $a_{1} = \\frac{3}{4}$, $a_{2} = 1$ and $a_{3} = \\frac{7}{6}$ rise toward $2$.\n\n> **Watch out.** The order matters: it is $ps - qr$, not $pr - qs$; here $pr - qs = 2 - 3 = -1$ would give the wrong direction.",
        "对 $a_n = \\frac{pn + q}{rn + s}$（$rn + s > 0$），由商的求导法则 $f'(x) = \\frac{ps - qr}{(rx + s)^{2}}$。分母为正，所以 $ps - qr$ 的符号对所有 $n$ 一次性决定了结果：$ps - qr > 0$ 时数列递增，$ps - qr < 0$ 时数列递减。对 $\\frac{2n + 1}{n + 3}$，$ps - qr = 6 - 1 = 5 > 0$，所以它递增并趋于极限 $2$。\n\n检验：$a_{1} = \\frac{3}{4}$，$a_{2} = 1$，$a_{3} = \\frac{7}{6}$，逐渐增大并趋于 $2$。\n\n> **注意。** 顺序很重要：是 $ps - qr$，不是 $pr - qs$；这里 $pr - qs = 2 - 3 = -1$ 会给出相反的方向。",
      ),
      generate: linearQuotientDirection,
    },
  ],
};

/** ratioOfTerms simplifies aₙ₊₁/aₙ for a product of powers and factorials. */
function ratioOfTerms(rng: Rng): Problem {
  const k = rng.int(2, 9);
  const kQ = Q.of(k);
  const forms: readonly (readonly [string, string, readonly Form[], string, Q, Q])[] = [
    [
      `\\frac{${k}^{n}}{n!}`,
      `\\frac{${k}}{n + 1}`,
      [
        [`\\frac{${k}}{n}`, "$(n + 1)!$ is $n!$ times $n + 1$, not times $n$", "$(n + 1)!$ 是 $n!$ 乘 $n + 1$，不是乘 $n$"],
        [
          `\\frac{n + 1}{${k}}`,
          "This is $\\frac{a_n}{a_{n+1}}$: the later term goes on top",
          "这是 $\\frac{a_n}{a_{n+1}}$：后一项应在分子上",
        ],
      ],
      `\\frac{${k}^{n+1}}{(n + 1)!} \\cdot \\frac{n!}{${k}^{n}}`,
      kQ,
      Q.of(k * k, 2),
    ],
    [
      `\\frac{n!}{${k}^{n}}`,
      `\\frac{n + 1}{${k}}`,
      [
        [
          `\\frac{${k}}{n + 1}`,
          "This is $\\frac{a_n}{a_{n+1}}$: the later term goes on top",
          "这是 $\\frac{a_n}{a_{n+1}}$：后一项应在分子上",
        ],
        [`\\frac{n}{${k}}`, "$(n + 1)!$ is $n!$ times $n + 1$, not times $n$", "$(n + 1)!$ 是 $n!$ 乘 $n + 1$，不是乘 $n$"],
      ],
      `\\frac{(n + 1)!}{${k}^{n+1}} \\cdot \\frac{${k}^{n}}{n!}`,
      Q.of(1, k),
      Q.of(2, k * k),
    ],
    [
      `\\frac{${k}^{n}}{(2n)!}`,
      `\\frac{${k}}{(2n + 1)(2n + 2)}`,
      [
        [
          `\\frac{${k}}{2n + 1}`,
          "$(2n + 2)!$ has two more factors than $(2n)!$: both $2n + 1$ and $2n + 2$",
          "$(2n + 2)!$ 比 $(2n)!$ 多两个因子：$2n + 1$ 与 $2n + 2$",
        ],
        [
          `\\frac{${k}}{2n + 2}`,
          "$(2n + 2)!$ has two more factors than $(2n)!$: both $2n + 1$ and $2n + 2$",
          "$(2n + 2)!$ 比 $(2n)!$ 多两个因子：$2n + 1$ 与 $2n + 2$",
        ],
      ],
      `\\frac{${k}^{n+1}}{(2n + 2)!} \\cdot \\frac{(2n)!}{${k}^{n}}`,
      Q.of(k, 2),
      Q.of(k * k, 24),
    ],
    [
      `n \\cdot ${k}^{n}`,
      `\\frac{${k}(n + 1)}{n}`,
      [
        [`${k}`, "This leaves out the factor $\\frac{n + 1}{n}$ that comes from $n$", "这里漏了由 $n$ 带来的因子 $\\frac{n + 1}{n}$"],
        [
          `\\frac{n + 1}{n}`,
          `This leaves out the factor $${k}$ from $\\frac{${k}^{n+1}}{${k}^{n}}$`,
          `这里漏了 $\\frac{${k}^{n+1}}{${k}^{n}}$ 给出的因子 $${k}$`,
        ],
      ],
      `\\frac{(n + 1) \\cdot ${k}^{n+1}}{n \\cdot ${k}^{n}}`,
      kQ,
      Q.of(2 * k * k),
    ],
  ];
  const [a, answer, wrong, work, a1, a2] = rng.pick(forms);
  return functionWorked(
    {
      prompt: t(`For $a_n = ${a}$, simplify $\\frac{a_{n+1}}{a_n}$.`, `对 $a_n = ${a}$，化简 $\\frac{a_{n+1}}{a_n}$。`),
      answer,
      variable: "n",
      prefix: "\\frac{a_{n+1}}{a_n} =",
    },
    [
      step(
        "Divide by multiplying by the reciprocal",
        "把除法写成乘以倒数",
        t("Write $a_{n+1}$ and multiply by $\\frac{1}{a_n}$:", "写出 $a_{n+1}$，再乘以 $\\frac{1}{a_n}$："),
        `\\frac{a_{n+1}}{a_n} = ${work}`,
      ),
      step(
        "Cancel",
        "约分",
        t("The powers and factorials cancel except for the new factors:", "幂和阶乘约去后只剩新增的因子："),
        `\\frac{a_{n+1}}{a_n} = ${answer}`,
      ),
    ],
    t(
      `Take $n = 1$: $a_{1} = ${a1.toLatex()}$ and $a_{2} = ${a2.toLatex()}$, so $\\frac{a_{2}}{a_{1}} = ${a2.div(a1).toLatex()}$, which is what the answer gives at $n = 1$.`,
      `取 $n = 1$：$a_{1} = ${a1.toLatex()}$，$a_{2} = ${a2.toLatex()}$，所以 $\\frac{a_{2}}{a_{1}} = ${a2.div(a1).toLatex()}$，与答案在 $n = 1$ 时的值相同。`,
    ),
    wrong,
  );
}

/** ratioThreshold finds where the ratio of consecutive terms passes 1. */
function ratioThreshold(rng: Rng): Problem {
  if (rng.bool()) {
    const m = rng.int(0, 2);
    const k = rng.int(m + 2, 12);
    const N = k - m;
    return numberWorked(
      t(
        `Let $a_n = \\frac{${k}^{n}}{${fact(m)}}$. Find the smallest $N$ such that $a_{n+1} < a_n$ for every $n \\ge N$.`,
        `设 $a_n = \\frac{${k}^{n}}{${fact(m)}}$。求使得对每个 $n \\ge N$ 都有 $a_{n+1} < a_n$ 的最小 $N$。`,
      ),
      N,
      [
        step(
          "Find the ratio",
          "求比值",
          t("Most factors cancel:", "大部分因子约去："),
          `\\frac{a_{n+1}}{a_n} = \\frac{${k}}{${shift(m + 1)}}`,
        ),
        step(
          "Find where it is less than 1",
          "求它小于 1 的范围",
          t(
            `The terms are positive, so $a_{n+1} < a_n$ exactly when the ratio is less than $1$:`,
            `各项为正，所以 $a_{n+1} < a_n$ 当且仅当比值小于 $1$：`,
          ),
          `${shift(m + 1)} > ${k} \\iff n > ${N - 1} \\iff n \\ge ${N}`,
        ),
      ],
      t(
        `Substitute: at $n = ${N - 1}$ the ratio is $\\frac{${k}}{${N + m}} = 1$, so $a_{${N}} = a_{${N - 1}}$ and $n = ${N - 1}$ fails; at $n = ${N}$ it is $\\frac{${k}}{${N + m + 1}} < 1$.`,
        `代入检验：$n = ${N - 1}$ 时比值为 $\\frac{${k}}{${N + m}} = 1$，所以 $a_{${N}} = a_{${N - 1}}$，$n = ${N - 1}$ 不满足；$n = ${N}$ 时比值为 $\\frac{${k}}{${N + m + 1}} < 1$。`,
      ),
      [
        [
          N - 1,
          `At $n = ${N - 1}$ the ratio is exactly $1$, so $a_{${N}} = a_{${N - 1}}$; the next term must be strictly smaller`,
          `$n = ${N - 1}$ 时比值恰为 $1$，所以 $a_{${N}} = a_{${N - 1}}$；下一项必须严格更小`,
        ],
        [
          N + 1,
          `Already at $n = ${N}$ the ratio is $\\frac{${k}}{${N + m + 1}} < 1$`,
          `在 $n = ${N}$ 时比值已经是 $\\frac{${k}}{${N + m + 1}} < 1$`,
        ],
        ...(m > 0
          ? [
              [
                k,
                `This ignores the shift in $${fact(m)}$: the ratio is $\\frac{${k}}{${shift(m + 1)}}$`,
                `这里忽略了 $${fact(m)}$ 中的平移：比值是 $\\frac{${k}}{${shift(m + 1)}}$`,
              ] as const,
            ]
          : []),
      ],
    );
  }
  const k = rng.int(2, 12);
  return numberWorked(
    t(
      `Let $a_n = \\frac{n!}{${k}^{n}}$. Find the smallest $N$ such that $a_{n+1} > a_n$ for every $n \\ge N$.`,
      `设 $a_n = \\frac{n!}{${k}^{n}}$。求使得对每个 $n \\ge N$ 都有 $a_{n+1} > a_n$ 的最小 $N$。`,
    ),
    k,
    [
      step("Find the ratio", "求比值", t("Most factors cancel:", "大部分因子约去："), `\\frac{a_{n+1}}{a_n} = \\frac{n + 1}{${k}}`),
      step(
        "Find where it is greater than 1",
        "求它大于 1 的范围",
        t(
          `The terms are positive, so $a_{n+1} > a_n$ exactly when the ratio is greater than $1$:`,
          `各项为正，所以 $a_{n+1} > a_n$ 当且仅当比值大于 $1$：`,
        ),
        `n + 1 > ${k} \\iff n \\ge ${k}`,
      ),
    ],
    t(
      `Substitute: at $n = ${k - 1}$ the ratio is $\\frac{${k}}{${k}} = 1$, so $a_{${k}} = a_{${k - 1}}$ and $n = ${k - 1}$ fails; at $n = ${k}$ it is $\\frac{${k + 1}}{${k}} > 1$.`,
      `代入检验：$n = ${k - 1}$ 时比值为 $\\frac{${k}}{${k}} = 1$，所以 $a_{${k}} = a_{${k - 1}}$，$n = ${k - 1}$ 不满足；$n = ${k}$ 时比值为 $\\frac{${k + 1}}{${k}} > 1$。`,
    ),
    [
      [
        k - 1,
        `At $n = ${k - 1}$ the ratio is exactly $1$, so $a_{${k}} = a_{${k - 1}}$; the next term must be strictly larger`,
        `$n = ${k - 1}$ 时比值恰为 $1$，所以 $a_{${k}} = a_{${k - 1}}$；下一项必须严格更大`,
      ],
      [k + 1, `Already at $n = ${k}$ the ratio is $\\frac{${k + 1}}{${k}} > 1$`, `在 $n = ${k}$ 时比值已经是 $\\frac{${k + 1}}{${k}} > 1$`],
    ],
  );
}

/** identifyingMonotonicSequencesUsingRatios compares aₙ₊₁/aₙ with 1 for positive sequences. */
export const identifyingMonotonicSequencesUsingRatios: TopicDef = {
  id: "identifying-monotonic-sequences-using-ratios",
  title: t("Identifying Monotonic Sequences Using Ratios", "用比值判断数列的单调性"),
  summary: t(
    "For a sequence of positive terms, aₙ₊₁/aₙ < 1 means the next term is smaller; ratios suit factorials and powers.",
    "对正项数列，aₙ₊₁/aₙ < 1 表示下一项更小；比值法适合阶乘和幂。",
  ),
  intro: t(
    "For terms built from powers and factorials, the ratio of consecutive terms simplifies well. For $a_n = \\frac{3^{n}}{n!}$:\n\n$$\\frac{a_{n+1}}{a_n} = \\frac{3^{n+1}}{(n + 1)!} \\cdot \\frac{n!}{3^{n}} = \\frac{3}{n + 1},$$\n\nwhich is less than $1$ from $n = 3$ on, so the terms decrease from there.\n\nCheck: $a_{3} = \\frac{27}{6} = \\frac{9}{2}$ and $a_{4} = \\frac{81}{24} = \\frac{27}{8}$, with ratio $\\frac{27}{8} \\cdot \\frac{2}{9} = \\frac{3}{4} = \\frac{3}{3 + 1}$.\n\nIn this lesson we simplify ratios of consecutive terms and find where they pass $1$.",
    "对由幂和阶乘构成的项，相邻两项之比很容易化简。对 $a_n = \\frac{3^{n}}{n!}$：\n\n$$\\frac{a_{n+1}}{a_n} = \\frac{3^{n+1}}{(n + 1)!} \\cdot \\frac{n!}{3^{n}} = \\frac{3}{n + 1}$$\n\n它从 $n = 3$ 起小于 $1$，所以各项从那里开始递减。\n\n检验：$a_{3} = \\frac{27}{6} = \\frac{9}{2}$，$a_{4} = \\frac{81}{24} = \\frac{27}{8}$，比值为 $\\frac{27}{8} \\cdot \\frac{2}{9} = \\frac{3}{4} = \\frac{3}{3 + 1}$。\n\n本课我们化简相邻两项之比，并找出它在何处越过 $1$。",
  ),
  prerequisites: ["monotonic-sequences", "limits-of-sequences-with-factorials"],
  encompasses: [{ topic: "monotonic-sequences", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-ratio-of-consecutive-terms",
      title: t("The ratio of consecutive terms", "相邻两项之比"),
      explanation: t(
        "Dividing a term by the one before it cancels most factors when the terms are products of powers and factorials, leaving a simple expression in the index. When the terms are products, their ratio simplifies well. For $a_n = \\frac{3^{n}}{n!}$:\n\n$$\\frac{a_{n+1}}{a_n} = \\frac{3^{n+1}}{(n + 1)!} \\cdot \\frac{n!}{3^{n}} = \\frac{3}{n + 1}.$$\n\nCheck: $a_{1} = 3$ and $a_{2} = \\frac{9}{2}$, so $\\frac{a_{2}}{a_{1}} = \\frac{3}{2}$, which is $\\frac{3}{n + 1}$ at $n = 1$.\n\n> **Watch out.** $\\frac{n!}{(n + 1)!} = \\frac{1}{n + 1}$, not $\\frac{1}{n}$: the larger factorial has the one extra factor $n + 1$.",
        "当各项是幂与阶乘的积时，用一项除以前一项会约去大部分因子，只剩下关于下标的简单式子。各项是乘积时，比值很容易化简。对 $a_n = \\frac{3^{n}}{n!}$：\n\n$$\\frac{a_{n+1}}{a_n} = \\frac{3^{n+1}}{(n + 1)!} \\cdot \\frac{n!}{3^{n}} = \\frac{3}{n + 1}$$\n\n检验：$a_{1} = 3$，$a_{2} = \\frac{9}{2}$，所以 $\\frac{a_{2}}{a_{1}} = \\frac{3}{2}$，正是 $\\frac{3}{n + 1}$ 在 $n = 1$ 时的值。\n\n> **注意。** $\\frac{n!}{(n + 1)!} = \\frac{1}{n + 1}$，不是 $\\frac{1}{n}$：较大的阶乘多出的一个因子是 $n + 1$。",
      ),
      generate: ratioOfTerms,
    },
    {
      id: "monotonicity-from-the-ratio",
      title: t("Where the ratio drops below 1", "比值何时小于 1"),
      explanation: t(
        "For positive terms, $a_{n+1} < a_n$ exactly when $\\frac{a_{n+1}}{a_n} < 1$. For $a_n = \\frac{3^{n}}{n!}$ the ratio is $\\frac{3}{n + 1}$, which equals $1$ at $n = 2$ ($a_3 = a_2$) and is less than $1$ for $n \\ge 3$. So $a_{n+1} < a_n$ for every $n \\ge 3$.\n\nCheck: $a_{2} = a_{3} = \\frac{9}{2}$ and $a_{4} = \\frac{27}{8}$ is smaller.\n\n> **Watch out.** Where the ratio equals $1$ two terms are equal, so that $n$ does not count as decreasing.",
        "对正项数列，$a_{n+1} < a_n$ 当且仅当 $\\frac{a_{n+1}}{a_n} < 1$。对 $a_n = \\frac{3^{n}}{n!}$，比值为 $\\frac{3}{n + 1}$，在 $n = 2$ 时等于 $1$（$a_3 = a_2$），在 $n \\ge 3$ 时小于 $1$。所以对每个 $n \\ge 3$ 都有 $a_{n+1} < a_n$。\n\n检验：$a_{2} = a_{3} = \\frac{9}{2}$，而 $a_{4} = \\frac{27}{8}$ 更小。\n\n> **注意。** 比值等于 $1$ 时两项相等，这个 $n$ 不算递减。",
      ),
      generate: ratioThreshold,
    },
  ],
};

/** sigmaInf writes the sum of aₙ from n = k to ∞. */
const sigmaInf = (body: string, k = 1) => `\\sum_{n=${k}}^{\\infty} ${body}`;

/** parenQ writes a value in parentheses when it is negative. */
const parenQ = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());

/** partialSum adds the first N terms of a series. */
function partialSum(rng: Rng): Problem {
  const p = rng.nonZero(-4, 4);
  const q = rng.int(-9, 9);
  const N = rng.int(3, 6);
  const alt = rng.bool();
  const body = poly([p, "n^{2}"], [q, ""]);
  const a = alt ? `(-1)^{n}(${body})` : body;
  const at = (n: number) => (alt ? (-1) ** n : 1) * (p * n * n + q);
  const terms = Array.from({ length: N }, (_, i) => at(i + 1));
  const S = terms.reduce((x, y) => x + y, 0);
  const squares = (N * (N + 1) * (2 * N + 1)) / 6;
  const unsigned = p * squares + q * N;
  const altSquares = ((-1) ** N * N * (N + 1)) / 2;
  const altOnes = N % 2 === 1 ? -1 : 0;
  return numberWorked(
    t(`Find the partial sum $S_{${N}}$ of the series $${sigmaInf(a)}$.`, `求级数 $${sigmaInf(a)}$ 的部分和 $S_{${N}}$。`),
    S,
    [
      step(
        "Write out the first terms",
        "写出前几项",
        t(
          `Put $n = 1, \\ldots, ${N}$ into the term; $a_1, \\ldots, a_{${N}}$ are`,
          `把 $n = 1, \\ldots, ${N}$ 代入通项，$a_1, \\ldots, a_{${N}}$ 依次为`,
        ),
        terms.join(", "),
      ),
      step("Add them", "相加", none, `S_{${N}} = ${plus(...terms.map((x) => (x < 0 ? `(${x})` : `${x}`)))} = ${S}`),
    ],
    alt
      ? t(
          `Use the formulas $\\sum_{n=1}^{N} (-1)^{n} n^{2} = (-1)^{N} \\frac{N(N + 1)}{2}$, which is $${altSquares}$ here, and $\\sum_{n=1}^{${N}} (-1)^{n} = ${altOnes}$: $${p} \\cdot ${paren(altSquares)} + ${paren(q)} \\cdot ${paren(altOnes)} = ${S}$.`,
          `用公式 $\\sum_{n=1}^{N} (-1)^{n} n^{2} = (-1)^{N} \\frac{N(N + 1)}{2}$（这里等于 $${altSquares}$）以及 $\\sum_{n=1}^{${N}} (-1)^{n} = ${altOnes}$：$${p} \\cdot ${paren(altSquares)} + ${paren(q)} \\cdot ${paren(altOnes)} = ${S}$。`,
        )
      : t(
          `Use the formula $\\sum_{n=1}^{N} n^{2} = \\frac{N(N + 1)(2N + 1)}{6}$, which is $${squares}$ here: $${p} \\cdot ${squares} + ${paren(q)} \\cdot ${N} = ${S}$.`,
          `用公式 $\\sum_{n=1}^{N} n^{2} = \\frac{N(N + 1)(2N + 1)}{6}$（这里等于 $${squares}$）：$${p} \\cdot ${squares} + ${paren(q)} \\cdot ${N} = ${S}$。`,
        ),
    [
      [S - at(N), `This stops one term early: it is $S_{${N - 1}}$`, `这里少加了一项：这是 $S_{${N - 1}}$`],
      [S + at(N + 1), `This adds one term too many: it is $S_{${N + 1}}$`, `这里多加了一项：这是 $S_{${N + 1}}$`],
      [at(N), `This is only the term $a_{${N}}$, not the sum of the first $${N}$ terms`, `这只是一项 $a_{${N}}$，不是前 $${N}$ 项之和`],
      ...(alt
        ? [
            [
              unsigned,
              "This drops the factor $(-1)^{n}$, so every term is added with a plus sign",
              "这里漏了因子 $(-1)^{n}$，把每一项都当成正号相加",
            ] as const,
          ]
        : []),
    ],
  );
}

/** termFromSums recovers a term as the difference of consecutive partial sums. */
function termFromSums(rng: Rng): Problem {
  const c = rng.nonZero(-9, 9);
  const s = rng.int(1, 5);
  const m = rng.int(2, 6);
  const S = (n: number) => Q.of(c * n, n + s);
  const answer = S(m).sub(S(m - 1));
  const den = s === 1 ? "n(n + 1)" : `(${shift(s - 1)})(${shift(s)})`;
  return numberWorked(
    t(
      `The $n$th partial sum of the series $${sigmaInf("a_n")}$ is $S_n = \\frac{${term(c, "n")}}{${shift(s)}}$. Find $a_{${m}}$.`,
      `级数 $${sigmaInf("a_n")}$ 的第 $n$ 个部分和为 $S_n = \\frac{${term(c, "n")}}{${shift(s)}}$。求 $a_{${m}}$。`,
    ),
    answer,
    [
      step(
        "Use the difference of partial sums",
        "用部分和之差",
        t(
          `$S_{${m}}$ adds exactly one more term than $S_{${m - 1}}$, namely $a_{${m}}$:`,
          `$S_{${m}}$ 比 $S_{${m - 1}}$ 恰好多加了一项 $a_{${m}}$：`,
        ),
        `a_{${m}} = S_{${m}} - S_{${m - 1}}`,
      ),
      step("Substitute", "代入", none, `a_{${m}} = ${S(m).toLatex()} - ${parenQ(S(m - 1))} = ${answer.toLatex()}`),
    ],
    t(
      `Find the general term first: $a_n = S_n - S_{n-1} = \\frac{${c * s}}{${den}}$ for $n \\ge 2$; at $n = ${m}$ this is $\\frac{${c * s}}{${m + s - 1} \\cdot ${m + s}} = ${answer.toLatex()}$.`,
      `先求通项：$n \\ge 2$ 时 $a_n = S_n - S_{n-1} = \\frac{${c * s}}{${den}}$；在 $n = ${m}$ 处为 $\\frac{${c * s}}{${m + s - 1} \\cdot ${m + s}} = ${answer.toLatex()}$。`,
    ),
    [
      [
        S(m),
        `This is $S_{${m}}$, the sum of the first $${m}$ terms, not the term $a_{${m}}$`,
        `这是前 $${m}$ 项之和 $S_{${m}}$，不是第 $${m}$ 项`,
      ],
      [
        S(m - 1),
        `This is $S_{${m - 1}}$; the term is the difference $S_{${m}} - S_{${m - 1}}$`,
        `这是 $S_{${m - 1}}$；所求的项是差 $S_{${m}} - S_{${m - 1}}$`,
      ],
      [
        S(m + 1).sub(S(m)),
        `This is $S_{${m + 1}} - S_{${m}} = a_{${m + 1}}$, one term later`,
        `这是 $S_{${m + 1}} - S_{${m}} = a_{${m + 1}}$，晚了一项`,
      ],
    ],
  );
}

/** infiniteSeriesAndPartialSums computes partial sums and recovers terms from them. */
export const infiniteSeriesAndPartialSums: TopicDef = {
  id: "infinite-series-and-partial-sums",
  title: t("Infinite Series and Partial Sums", "无穷级数与部分和"),
  summary: t(
    "The nth partial sum Sₙ = a₁ + ⋯ + aₙ of a series; each term is the difference aₙ = Sₙ − Sₙ₋₁.",
    "级数的第 n 个部分和 Sₙ = a₁ + ⋯ + aₙ；每一项都是差 aₙ = Sₙ − Sₙ₋₁。",
  ),
  intro: t(
    "An infinite series adds the terms of a sequence one after another, and its partial sums record the running totals. For $a_n = n^{2} - 1$ the first terms are $0, 3, 8$, so\n\n$$S_3 = 0 + 3 + 8 = 11.$$\n\nCheck: with $\\sum_{n=1}^{3} n^{2} = \\frac{3 \\cdot 4 \\cdot 7}{6} = 14$, $S_3 = 14 - 3 = 11$.\n\nIn this lesson we compute partial sums and recover terms from a formula for the partial sums.",
    "无穷级数把数列的各项依次相加，部分和记录了累加到每一步的总和。对 $a_n = n^{2} - 1$，前几项为 $0, 3, 8$，所以\n\n$$S_3 = 0 + 3 + 8 = 11$$\n\n检验：由 $\\sum_{n=1}^{3} n^{2} = \\frac{3 \\cdot 4 \\cdot 7}{6} = 14$，$S_3 = 14 - 3 = 11$。\n\n本课我们计算部分和，并由部分和的公式求出各项。",
  ),
  prerequisites: ["sigma-notation", "limits-of-sequences"],
  encompasses: [{ topic: "sigma-notation", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "computing-partial-sums",
      title: t("Computing partial sums", "计算部分和"),
      explanation: t(
        "An **infinite series** $\\sum_{n=1}^{\\infty} a_n = a_1 + a_2 + a_3 + \\cdots$ adds the terms of a sequence. Its $N$th **partial sum** adds the first $N$ terms: $S_N = \\sum_{n=1}^{N} a_n$. For $a_n = n^{2} - 1$: $S_3 = 0 + 3 + 8 = 11$.\n\nCheck: $\\sum_{n=1}^{3} n^{2} = 14$ and $\\sum_{n=1}^{3} 1 = 3$, so $S_3 = 14 - 3 = 11$.\n\n> **Watch out.** $S_N$ adds the first $N$ terms; $a_N$ is only the last of them.",
        "**无穷级数** $\\sum_{n=1}^{\\infty} a_n = a_1 + a_2 + a_3 + \\cdots$ 把数列的各项相加。它的第 $N$ 个**部分和**是前 $N$ 项之和：$S_N = \\sum_{n=1}^{N} a_n$。对 $a_n = n^{2} - 1$：$S_3 = 0 + 3 + 8 = 11$。\n\n检验：$\\sum_{n=1}^{3} n^{2} = 14$，$\\sum_{n=1}^{3} 1 = 3$，所以 $S_3 = 14 - 3 = 11$。\n\n> **注意。** $S_N$ 是前 $N$ 项之和；$a_N$ 只是其中最后一项。",
      ),
      generate: partialSum,
    },
    {
      id: "terms-from-partial-sums",
      title: t("Recovering terms from partial sums", "由部分和求项"),
      explanation: t(
        "A partial sum adds one more term than the one before it, so the difference of two consecutive partial sums is exactly the newest term. Since $S_n = S_{n-1} + a_n$, each term is the difference of consecutive partial sums: $a_n = S_n - S_{n-1}$ for $n \\ge 2$, and $a_1 = S_1$. If $S_n = \\frac{2n}{n + 1}$, then $a_3 = S_3 - S_2 = \\frac{3}{2} - \\frac{4}{3} = \\frac{1}{6}$.\n\nCheck: adding it back, $S_2 + a_3 = \\frac{4}{3} + \\frac{1}{6} = \\frac{3}{2} = S_3$.\n\n> **Watch out.** $S_3$ is the sum of three terms, not the third term.",
        "每个部分和都比前一个多加一项，所以相邻两个部分和之差恰好是新加的那一项。由于 $S_n = S_{n-1} + a_n$，每一项都是相邻部分和之差：$n \\ge 2$ 时 $a_n = S_n - S_{n-1}$，且 $a_1 = S_1$。若 $S_n = \\frac{2n}{n + 1}$，则 $a_3 = S_3 - S_2 = \\frac{3}{2} - \\frac{4}{3} = \\frac{1}{6}$。\n\n检验：加回去，$S_2 + a_3 = \\frac{4}{3} + \\frac{1}{6} = \\frac{3}{2} = S_3$。\n\n> **注意。** $S_3$ 是三项之和，不是第三项。",
      ),
      generate: termFromSums,
    },
  ],
};

/** sumFromPartialSums takes the limit of a formula for the partial sums. */
function sumFromPartialSums(rng: Rng): Problem {
  const prompt = (S: string) =>
    t(
      `The $n$th partial sum of the series $${sigmaInf("a_n")}$ is $S_n = ${S}$. Find the sum of the series.`,
      `级数 $${sigmaInf("a_n")}$ 的第 $n$ 个部分和为 $S_n = ${S}$。求级数的和。`,
    );
  const define = step(
    "Use the definition",
    "用定义",
    t("The sum of a series is the limit of its partial sums:", "级数的和是部分和的极限："),
    `${sigmaInf("a_n")} = ${limN} S_n`,
  );
  const notTerms = [
    "The terms $a_n$ may tend to $0$, but the sum is the limit of $S_n$, not of $a_n$",
    "各项 $a_n$ 可能趋于 $0$，但级数的和是 $S_n$ 的极限，不是 $a_n$ 的极限",
  ] as const;
  if (rng.bool()) {
    const p = rng.nonZero(-9, 9);
    const q = rng.int(-9, 9);
    const r = rng.int(1, 6);
    const s = rng.int(1, 9);
    const answer = Q.of(p, r);
    return numberWorked(
      prompt(`\\frac{${linear(p, q, "n")}}{${linear(r, s, "n")}}`),
      answer,
      [
        define,
        step(
          "Divide by n",
          "同除以 n",
          t("Divide the numerator and the denominator by $n$:", "分子分母同除以 $n$："),
          `S_n = \\frac{${sum(`${p}`, over(q, "n"))}}{${sum(`${r}`, over(s, "n"))}} \\to ${over(p, `${r}`) || "0"}${answer.isInteger() || gcd(Math.abs(p), r) > 1 ? ` = ${answer.toLatex()}` : ""}`,
        ),
      ],
      t(
        `Put in $n = 1000$: $S_{1000} = \\frac{${1000 * p + q}}{${1000 * r + s}} \\approx ${approx((1000 * p + q) / (1000 * r + s))}$, close to $${near(answer)}$.`,
        `代入 $n = 1000$：$S_{1000} = \\frac{${1000 * p + q}}{${1000 * r + s}} \\approx ${approx((1000 * p + q) / (1000 * r + s))}$，接近 $${near(answer)}$。`,
      ),
      [
        [
          Q.of(p + q, r + s),
          "This is $S_1$, the first partial sum; the sum is the limit as $n \\to \\infty$",
          "这是第一个部分和 $S_1$；级数的和是 $n \\to \\infty$ 时的极限",
        ],
        [
          Q.of(q, s),
          "This puts in $n = 0$; the sum is the limit as $n \\to \\infty$",
          "这里代入了 $n = 0$；级数的和是 $n \\to \\infty$ 时的极限",
        ],
        [Q.zero, ...notTerms],
      ],
    );
  }
  const c = rng.nonZero(-9, 9);
  const d = rng.int(1, 9);
  const k = rng.int(2, 5);
  return numberWorked(
    prompt(`${c} - \\frac{${d}}{${k}^{n}}`),
    c,
    [
      define,
      step(
        "Take the limit",
        "求极限",
        t(
          `Since $${k} > 1$, $${k}^{n} \\to \\infty$ and $\\frac{${d}}{${k}^{n}} \\to 0$:`,
          `由于 $${k} > 1$，$${k}^{n} \\to \\infty$，$\\frac{${d}}{${k}^{n}} \\to 0$：`,
        ),
        `${limN} S_n = ${c} - 0 = ${c}`,
      ),
    ],
    t(
      `Put in $n = 10$: $S_{10} = ${c} - \\frac{${d}}{${k ** 10}} \\approx ${approx(c - d / k ** 10)}$, already close to $${c}$.`,
      `代入 $n = 10$：$S_{10} = ${c} - \\frac{${d}}{${k ** 10}} \\approx ${approx(c - d / k ** 10)}$，已经接近 $${c}$。`,
    ),
    [
      [c - d, "This puts in $n = 0$; the sum is the limit as $n \\to \\infty$", "这里代入了 $n = 0$；级数的和是 $n \\to \\infty$ 时的极限"],
      [
        Q.of(c * k - d, k),
        "This is $S_1$, the first partial sum; the sum is the limit as $n \\to \\infty$",
        "这是第一个部分和 $S_1$；级数的和是 $n \\to \\infty$ 时的极限",
      ],
      [0, ...notTerms],
    ],
  );
}

/** divergentPartialSums decides whether the partial sums have a finite limit. */
function divergentPartialSums(rng: Rng): Problem {
  const kind = rng.int(0, 2);
  const c = rng.nonZero(-9, 9);
  const s = rng.int(1, 9);
  const S = kind === 0 ? `\\frac{${term(c, "n^{2}")}}{${shift(s)}}` : kind === 1 ? `${c}(-1)^{n}` : `\\frac{${term(c, "n")}}{n^{2} + ${s}}`;
  const value = (n: number) => (kind === 0 ? (c * n * n) / (n + s) : kind === 1 ? c * (-1) ** n : (c * n) / (n * n + s));
  const right: LimitValue = kind === 0 ? (c > 0 ? "inf" : "-inf") : kind === 1 ? "dne" : Q.zero;
  const S1 = kind === 1 ? Q.of(-c) : Q.of(c, 1 + s);
  const first: Choice = [
    S1,
    "This is $S_1$, the first partial sum; the question is about $n \\to \\infty$",
    "这是第一个部分和 $S_1$；问的是 $n \\to \\infty$ 时的情况",
  ];
  const wrong: Choice[] =
    kind === 0
      ? [
          [
            Q.of(c),
            "The coefficient would be the limit only if the degrees matched; the numerator's degree is higher",
            "只有次数相同时系数之比才是极限；这里分子次数更高",
          ],
          [Q.zero, "The numerator has the higher degree, so $S_n$ grows without bound", "分子次数更高，$S_n$ 会无限增大"],
          first,
          [c > 0 ? "-inf" : "inf", `The sign is that of the coefficient $${c}$`, `符号与系数 $${c}$ 相同`],
          [
            "dne",
            `$S_n$ keeps moving in one direction, so its limit is $${c > 0 ? "\\infty" : "-\\infty"}$ rather than not existing`,
            `$S_n$ 一直朝一个方向变化，所以极限是 $${c > 0 ? "\\infty" : "-\\infty"}$，而不是不存在`,
          ],
        ]
      : kind === 1
        ? [
            [
              Q.of(c),
              `$S_n = ${c}$ only for even $n$; for odd $n$ it is $${-c}$`,
              `只有 $n$ 为偶数时 $S_n = ${c}$；$n$ 为奇数时是 $${-c}$`,
            ],
            [
              Q.zero,
              `$S_n$ jumps between $${c}$ and $${-c}$ and never comes near $0$`,
              `$S_n$ 在 $${c}$ 与 $${-c}$ 之间跳动，从不接近 $0$`,
            ],
            first,
            [
              "inf",
              `$S_n$ stays between $${-Math.abs(c)}$ and $${Math.abs(c)}$, so it cannot grow without bound`,
              `$S_n$ 始终在 $${-Math.abs(c)}$ 与 $${Math.abs(c)}$ 之间，不会无限增大`,
            ],
            [
              "-inf",
              `$S_n$ stays between $${-Math.abs(c)}$ and $${Math.abs(c)}$, so it cannot grow without bound`,
              `$S_n$ 始终在 $${-Math.abs(c)}$ 与 $${Math.abs(c)}$ 之间，不会无限增大`,
            ],
          ]
        : [
            [
              Q.of(c),
              "The coefficient would be the limit only if the degrees matched; the denominator's degree is higher",
              "只有次数相同时系数之比才是极限；这里分母次数更高",
            ],
            first,
            ["inf", "The denominator has the higher degree, so $S_n$ shrinks toward $0$", "分母次数更高，$S_n$ 趋于 $0$"],
            ["-inf", "The denominator has the higher degree, so $S_n$ shrinks toward $0$", "分母次数更高，$S_n$ 趋于 $0$"],
            ["dne", "$S_n$ settles at $0$, so the limit exists", "$S_n$ 趋于 $0$，极限存在"],
          ];
  const look =
    kind === 0
      ? t(
          "The numerator has degree $2$ and the denominator degree $1$, so $S_n$ grows in size without bound.",
          "分子是 $2$ 次，分母是 $1$ 次，所以 $S_n$ 的绝对值无限增大。",
        )
      : kind === 1
        ? t(
            `The factor $(-1)^{n}$ makes the partial sums alternate between $${-c}$ and $${c}$.`,
            `因子 $(-1)^{n}$ 使部分和在 $${-c}$ 与 $${c}$ 之间交替。`,
          )
        : t(
            "The numerator has degree $1$ and the denominator degree $2$, so $S_n$ shrinks toward $0$.",
            "分子是 $1$ 次，分母是 $2$ 次，所以 $S_n$ 趋于 $0$。",
          );
  return limitAsk(
    rng,
    t(
      `The $n$th partial sum of the series $${sigmaInf("a_n")}$ is $S_n = ${S}$. Find $${limN} S_n$, which is the sum of the series when it exists.`,
      `级数 $${sigmaInf("a_n")}$ 的第 $n$ 个部分和为 $S_n = ${S}$。求 $${limN} S_n$（若存在，它就是级数的和）。`,
    ),
    right,
    wrong,
    [
      step("Look at the partial sums", "观察部分和", look),
      step(
        "Conclude",
        "得出结论",
        t(
          `So ${limitWord(right).en}${kind === 2 ? ", and the series converges to $0$" : ", and the series diverges"}.`,
          `所以${limitWord(right)["zh-CN"]}${kind === 2 ? "，级数收敛于 $0$" : "，级数发散"}。`,
        ),
      ),
    ],
    t(
      `Put in $n = 100$ and $n = 101$: $S_{100} ${kind === 1 ? "=" : "\\approx"} ${approx(value(100))}$ and $S_{101} ${kind === 1 ? "=" : "\\approx"} ${approx(value(101))}$.`,
      `代入 $n = 100$ 与 $n = 101$：$S_{100} ${kind === 1 ? "=" : "\\approx"} ${approx(value(100))}$，$S_{101} ${kind === 1 ? "=" : "\\approx"} ${approx(value(101))}$。`,
    ),
    true,
  );
}

/** convergentAndDivergentInfiniteSeries defines the sum of a series as the limit of its partial sums. */
export const convergentAndDivergentInfiniteSeries: TopicDef = {
  id: "convergent-and-divergent-infinite-series",
  title: t("Convergent and Divergent Infinite Series", "收敛与发散的无穷级数"),
  summary: t(
    "A series converges to S when its partial sums Sₙ tend to S; otherwise it diverges.",
    "若部分和 Sₙ 趋于 S，级数收敛于 S；否则级数发散。",
  ),
  intro: t(
    "A series has a sum exactly when its partial sums settle at a number. If $S_n = 4 - \\frac{3}{2^{n}}$, then $\\frac{3}{2^{n}} \\to 0$ and\n\n$$\\sum_{n=1}^{\\infty} a_n = \\lim_{n \\to \\infty} S_n = 4.$$\n\nCheck: $S_{10} = 4 - \\frac{3}{1024} \\approx 3.9971$, already close to $4$.\n\nIn this lesson we find sums as limits of partial sums and recognise partial sums that diverge.",
    "级数有和，当且仅当它的部分和趋于一个数。若 $S_n = 4 - \\frac{3}{2^{n}}$，则 $\\frac{3}{2^{n}} \\to 0$，且\n\n$$\\sum_{n=1}^{\\infty} a_n = \\lim_{n \\to \\infty} S_n = 4$$\n\n检验：$S_{10} = 4 - \\frac{3}{1024} \\approx 3.9971$，已经接近 $4$。\n\n本课我们把级数的和求作部分和的极限，并识别发散的部分和。",
  ),
  prerequisites: ["infinite-series-and-partial-sums"],
  encompasses: [{ topic: "infinite-series-and-partial-sums", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sums-from-partial-sums",
      title: t("The sum as the limit of the partial sums", "和是部分和的极限"),
      explanation: t(
        "A series **converges** to $S$, and we write $\\sum_{n=1}^{\\infty} a_n = S$, when $\\lim_{n \\to \\infty} S_n = S$. If $S_n = 4 - \\frac{3}{2^{n}}$, the series converges and its sum is $\\lim_{n \\to \\infty} S_n = 4$.\n\nCheck: $S_{10} = 4 - \\frac{3}{1024} \\approx 3.9971$, close to $4$.\n\n> **Watch out.** The sum is the limit of $S_n$, not $S_1$ and not the limit of $a_n$.",
        "若 $\\lim_{n \\to \\infty} S_n = S$，就说级数**收敛**于 $S$，记作 $\\sum_{n=1}^{\\infty} a_n = S$。若 $S_n = 4 - \\frac{3}{2^{n}}$，级数收敛，其和为 $\\lim_{n \\to \\infty} S_n = 4$。\n\n检验：$S_{10} = 4 - \\frac{3}{1024} \\approx 3.9971$，接近 $4$。\n\n> **注意。** 级数的和是 $S_n$ 的极限，不是 $S_1$，也不是 $a_n$ 的极限。",
      ),
      generate: sumFromPartialSums,
    },
    {
      id: "divergent-partial-sums",
      title: t("Series whose partial sums diverge", "部分和发散的级数"),
      explanation: t(
        "If $S_n \\to \\infty$ or $S_n \\to -\\infty$, the series diverges to $\\infty$ or $-\\infty$. If $S_n$ has no limit at all, as when $S_n = (-1)^{n}$, the series diverges and has no sum. For example, $1 - 1 + 1 - 1 + \\cdots$ has partial sums $1, 0, 1, 0, \\ldots$, which never settle.\n\nCheck: $S_{100} = 0$ but $S_{101} = 1$, so the partial sums are still jumping far out.\n\n> **Watch out.** Partial sums that tend to $\\infty$ have a limit in the extended sense, but the series still diverges: it has no sum.",
        "若 $S_n \\to \\infty$ 或 $S_n \\to -\\infty$，级数发散到 $\\infty$ 或 $-\\infty$。若 $S_n$ 根本没有极限（例如 $S_n = (-1)^{n}$），级数发散且没有和。例如 $1 - 1 + 1 - 1 + \\cdots$ 的部分和为 $1, 0, 1, 0, \\ldots$，始终不趋于定值。\n\n检验：$S_{100} = 0$，而 $S_{101} = 1$，到很后面部分和仍在跳动。\n\n> **注意。** 部分和趋于 $\\infty$ 时，极限在广义上存在，但级数仍然发散：它没有和。",
      ),
      generate: divergentPartialSums,
    },
  ],
};

/** linearCombination applies linearity to two convergent series. */
function linearCombination(rng: Rng): Problem {
  const A = Q.of(rng.nonZero(-12, 12), rng.pick([1, 1, 2, 3]));
  const B = Q.of(rng.nonZero(-12, 12), rng.pick([1, 1, 2, 3]));
  const c = rng.nonZero(-6, 6);
  const d = rng.nonZero(-6, 6);
  const cA = A.mul(Q.of(c));
  const dB = B.mul(Q.of(d));
  const answer = cA.add(dB);
  const body = plus(term(c, "a_n"), term(d, "b_n"));
  return numberWorked(
    t(
      `Given that $${sigmaInf("a_n")} = ${A.toLatex()}$ and $${sigmaInf("b_n")} = ${B.toLatex()}$, find $${sigmaInf(`(${body})`)}$.`,
      `已知 $${sigmaInf("a_n")} = ${A.toLatex()}$，$${sigmaInf("b_n")} = ${B.toLatex()}$，求 $${sigmaInf(`(${body})`)}$。`,
    ),
    answer,
    [
      step(
        "Split the series",
        "拆开级数",
        t("Both series converge, so the combination splits:", "两个级数都收敛，所以组合可以拆开："),
        `${sigmaInf(`(${body})`)} = ${plus(term(c, sigmaInf("a_n")), term(d, sigmaInf("b_n")))}`,
      ),
      step("Substitute", "代入", none, `${c} \\cdot ${parenQ(A)} + ${paren(d)} \\cdot ${parenQ(B)} = ${answer.toLatex()}`),
    ],
    t(
      `Work backward: $${answer.toLatex()} - ${paren(c)} \\cdot ${parenQ(A)} = ${dB.toLatex()}$, and dividing by $${d}$ gives $${B.toLatex()}$, the given sum of $b_n$.`,
      `倒推检验：$${answer.toLatex()} - ${paren(c)} \\cdot ${parenQ(A)} = ${dB.toLatex()}$，再除以 $${d}$ 得 $${B.toLatex()}$，正是已知的 $b_n$ 之和。`,
    ),
    [
      [A.add(B), `This leaves out the multipliers $${c}$ and $${d}$`, `这里漏了倍数 $${c}$ 与 $${d}$`],
      [cA.sub(dB), `This flips the sign of $${term(d, "b_n")}$`, `这里把 $${term(d, "b_n")}$ 的符号弄反了`],
      [cA.add(B), `This leaves out the multiplier $${d}$ on $b_n$`, `这里漏了 $b_n$ 前的倍数 $${d}$`],
      [Q.of(c + d), "This adds the multipliers; they multiply the sums of the two series", "这里把倍数相加了；倍数应分别乘以两个级数的和"],
    ],
  );
}

/** recoveredSeries works linearity backward to find one series. */
function recoveredSeries(rng: Rng): Problem {
  const A = Q.of(rng.nonZero(-12, 12), rng.pick([1, 1, 2]));
  const B = Q.of(rng.nonZero(-12, 12), rng.pick([1, 1, 3]));
  const k = rng.pick([1, 2, 3, -1, -2]);
  const c = rng.pick([2, 3, 4, 5, -2, -3]);
  const S = A.add(B.mul(Q.of(k)));
  const answer = B.mul(Q.of(c));
  // A negative multiple goes in parentheses so the sum does not read as a negated sum.
  const times = (m: number) => (m < 0 ? `(${term(m, "b_n")})` : term(m, "b_n"));
  return numberWorked(
    t(
      `Given that $${sigmaInf(`(${plus("a_n", term(k, "b_n"))})`)} = ${S.toLatex()}$ and $${sigmaInf("a_n")} = ${A.toLatex()}$, find $${sigmaInf(times(c))}$.`,
      `已知 $${sigmaInf(`(${plus("a_n", term(k, "b_n"))})`)} = ${S.toLatex()}$，$${sigmaInf("a_n")} = ${A.toLatex()}$，求 $${sigmaInf(times(c))}$。`,
    ),
    answer,
    [
      step(
        "Subtract the known series",
        "减去已知的级数",
        none,
        `${sigmaInf(times(k))} = ${S.toLatex()} - ${parenQ(A)} = ${S.sub(A).toLatex()}`,
      ),
      step("Divide by the coefficient", "除以系数", none, `${sigmaInf("b_n")} = ${B.toLatex()}`),
      step("Scale to what is asked", "按所求的倍数放大", none, `${sigmaInf(times(c))} = ${c} \\cdot ${parenQ(B)} = ${answer.toLatex()}`),
    ],
    t(
      `Put the sums back: $${A.toLatex()} + ${paren(k)} \\cdot ${parenQ(B)} = ${S.toLatex()}$, as given.`,
      `把和代回去：$${A.toLatex()} + ${paren(k)} \\cdot ${parenQ(B)} = ${S.toLatex()}$，与已知一致。`,
    ),
    [
      [
        S.sub(A).mul(Q.of(c)),
        `This skips dividing by $${k}$: $${S.sub(A).toLatex()}$ is the sum of $${term(k, "b_n")}$, not of $b_n$`,
        `这里漏了除以 $${k}$：$${S.sub(A).toLatex()}$ 是 $${term(k, "b_n")}$ 的和，不是 $b_n$ 的和`,
      ],
      [S.add(A).div(Q.of(k)).mul(Q.of(c)), "This adds the sum of $a_n$; it has to be subtracted", "这里加上了 $a_n$ 的和；应当减去"],
      [B, `This is the sum of $b_n$; the question asks for $${times(c)}$`, `这是 $b_n$ 的和；题目问的是 $${times(c)}$`],
      [S.mul(Q.of(c)).div(Q.of(k)), "This forgets to subtract the sum of $a_n$ first", "这里忘了先减去 $a_n$ 的和"],
    ],
  );
}

/** propertiesOfInfiniteSeries applies linearity to convergent series. */
export const propertiesOfInfiniteSeries: TopicDef = {
  id: "properties-of-infinite-series",
  title: t("Properties of Infinite Series", "无穷级数的性质"),
  summary: t(
    "Convergent series can be added and multiplied by constants term by term: Σ(c·aₙ + d·bₙ) = cΣaₙ + dΣbₙ.",
    "收敛级数可以逐项相加和乘以常数：Σ(c·aₙ + d·bₙ) = cΣaₙ + dΣbₙ。",
  ),
  intro: t(
    "Convergent series combine like finite sums. If $\\sum a_n = 3$ and $\\sum b_n = -2$, then\n\n$$\\sum_{n=1}^{\\infty} (2a_n - 5b_n) = 2 \\cdot 3 - 5 \\cdot (-2) = 16.$$\n\nCheck: working backward, $16 - 2 \\cdot 3 = 10 = -5 \\cdot (-2)$.\n\nIn this lesson we combine convergent series and work the rule backward to find an unknown series.",
    "收敛级数可以像有限和一样组合。若 $\\sum a_n = 3$，$\\sum b_n = -2$，则\n\n$$\\sum_{n=1}^{\\infty} (2a_n - 5b_n) = 2 \\cdot 3 - 5 \\cdot (-2) = 16$$\n\n检验：倒推，$16 - 2 \\cdot 3 = 10 = -5 \\cdot (-2)$。\n\n本课我们组合收敛级数，并反过来用这一法则求出未知的级数。",
  ),
  prerequisites: ["convergent-and-divergent-infinite-series", "properties-of-finite-series"],
  encompasses: [{ topic: "convergent-and-divergent-infinite-series", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "linear-combinations-of-convergent-series",
      title: t("Linear combinations of convergent series", "收敛级数的线性组合"),
      explanation: t(
        "If $\\sum a_n = A$ and $\\sum b_n = B$ both converge, then for any constants $c$ and $d$,\n\n$$\\sum_{n=1}^{\\infty} (c \\, a_n + d \\, b_n) = cA + dB,$$\n\nbecause the partial sums satisfy the same rule and limits respect it. For $A = 3$ and $B = -2$: $\\sum (2a_n - 5b_n) = 6 + 10 = 16$.\n\nCheck: $16 - 2 \\cdot 3 = 10$, and $10 \\div (-5) = -2 = B$.\n\n> **Watch out.** The rule needs both series to converge; with a divergent series there is no $A$ or $B$ to use.",
        "若 $\\sum a_n = A$ 与 $\\sum b_n = B$ 都收敛，则对任意常数 $c$、$d$，\n\n$$\\sum_{n=1}^{\\infty} (c \\, a_n + d \\, b_n) = cA + dB$$\n\n因为部分和满足同样的法则，而极限保持这一法则。若 $A = 3$，$B = -2$：$\\sum (2a_n - 5b_n) = 6 + 10 = 16$。\n\n检验：$16 - 2 \\cdot 3 = 10$，$10 \\div (-5) = -2 = B$。\n\n> **注意。** 这一法则要求两个级数都收敛；若有一个发散，就没有 $A$ 或 $B$ 可用。",
      ),
      generate: linearCombination,
    },
    {
      id: "a-series-recovered-from-a-combination",
      title: t("A series recovered from a combination", "由线性组合求出某个级数"),
      explanation: t(
        "Linearity also runs backward. If $\\sum (a_n + 2b_n) = 7$ and $\\sum a_n = 3$ both converge, then $\\sum 2b_n = 7 - 3 = 4$, so $\\sum b_n = 2$ and, for instance, $\\sum 5b_n = 10$. Subtract the known series first, then divide by the coefficient, then scale to what is asked.\n\nCheck: $3 + 2 \\cdot 2 = 7$, as given.\n\n> **Watch out.** Subtract before dividing: $\\frac{7}{2} - 3$ is not $\\sum b_n$.",
        "线性性质也可以反过来用。若 $\\sum (a_n + 2b_n) = 7$ 与 $\\sum a_n = 3$ 都收敛，则 $\\sum 2b_n = 7 - 3 = 4$，所以 $\\sum b_n = 2$，例如 $\\sum 5b_n = 10$。先减去已知的级数，再除以系数，最后按所求的倍数放大。\n\n检验：$3 + 2 \\cdot 2 = 7$，与已知一致。\n\n> **注意。** 先减后除：$\\frac{7}{2} - 3$ 不是 $\\sum b_n$。",
      ),
      generate: recoveredSeries,
    },
  ],
};

/** convergence names what can be said about a series. */
const convergence = [t("It converges", "收敛"), t("It diverges", "发散"), t("It cannot be determined", "无法确定")] as const;

/** droppedTerms starts a known series at a later index. */
function droppedTerms(rng: Rng): Problem {
  const p = rng.int(1, 12);
  const k = rng.int(2, 4);
  const a = (n: number) => Q.of(p, n * (n + 1) * (n + 2));
  const body = `\\frac{${p}}{n(n + 1)(n + 2)}`;
  const dropped = Array.from({ length: k - 1 }, (_, i) => a(i + 1));
  const total = Q.of(p, 4);
  const answer = dropped.reduce((s, x) => s.sub(x), total);
  return numberWorked(
    t(
      `Given that $${sigmaInf(body)} = ${total.toLatex()}$, find $${sigmaInf(body, k)}$.`,
      `已知 $${sigmaInf(body)} = ${total.toLatex()}$，求 $${sigmaInf(body, k)}$。`,
    ),
    answer,
    [
      step(
        "List the terms left out",
        "列出被省略的项",
        t(
          `Starting at $n = ${k}$ leaves out ${k === 2 ? "$a_1$" : `$a_1, \\ldots, a_{${k - 1}}$`}:`,
          `从 $n = ${k}$ 开始，省略了 ${k === 2 ? "$a_1$" : `$a_1, \\ldots, a_{${k - 1}}$`}：`,
        ),
        dropped.map((x) => x.toLatex()).join(", "),
      ),
      step("Subtract them", "减去它们", none, `${total.toLatex()} - ${dropped.map((x) => x.toLatex()).join(" - ")} = ${answer.toLatex()}`),
    ],
    t(
      `Telescope instead: $\\frac{${p}}{n(n + 1)(n + 2)} = ${p === 2 ? "" : Q.of(p, 2).toLatex()}\\left(\\frac{1}{n(n + 1)} - \\frac{1}{(n + 1)(n + 2)}\\right)$, so the sum from $n = ${k}$ is $\\frac{${p}}{2 \\cdot ${k} \\cdot ${k + 1}} = ${answer.toLatex()}$.`,
      `改用裂项相消：$\\frac{${p}}{n(n + 1)(n + 2)} = ${p === 2 ? "" : Q.of(p, 2).toLatex()}\\left(\\frac{1}{n(n + 1)} - \\frac{1}{(n + 1)(n + 2)}\\right)$，所以从 $n = ${k}$ 起的和为 $\\frac{${p}}{2 \\cdot ${k} \\cdot ${k + 1}} = ${answer.toLatex()}$。`,
    ),
    [
      [total, "This is the sum from $n = 1$; the first terms still have to be taken out", "这是从 $n = 1$ 起的和；还要去掉开头的项"],
      [
        total.sub(a(k)),
        `This subtracts $a_{${k}}$, the first term kept, instead of the terms before it`,
        `这里减去的是保留下来的第一项 $a_{${k}}$，而不是它前面的项`,
      ],
      [
        answer.sub(a(k)),
        `This also removes $a_{${k}}$; the sum starts at $n = ${k}$, so $a_{${k}}$ stays`,
        `这里把 $a_{${k}}$ 也去掉了；和从 $n = ${k}$ 开始，$a_{${k}}$ 应保留`,
      ],
    ],
  );
}

/** mixedSeries decides what a combination of convergent and divergent series does. */
function mixedSeries(rng: Rng): Problem {
  const A = rng.nonZero(-12, 12);
  const c = rng.nonZero(-6, 6);
  const d = rng.nonZero(-6, 6);
  const kind = rng.int(0, 3);
  const given = [
    t(
      `$${sigmaInf("a_n")} = ${A}$ converges and $${sigmaInf("b_n")}$ diverges`,
      `$${sigmaInf("a_n")} = ${A}$ 收敛，$${sigmaInf("b_n")}$ 发散`,
    ),
    t(
      `$${sigmaInf("a_n")} = ${A}$ converges and $${sigmaInf("b_n")}$ diverges`,
      `$${sigmaInf("a_n")} = ${A}$ 收敛，$${sigmaInf("b_n")}$ 发散`,
    ),
    t(`$${sigmaInf("a_n")}$ and $${sigmaInf("b_n")}$ both diverge`, `$${sigmaInf("a_n")}$ 与 $${sigmaInf("b_n")}$ 都发散`),
    t(
      `$${sigmaInf("a_n")} = ${A}$ and $${sigmaInf("b_n")} = ${c}$ both converge`,
      `$${sigmaInf("a_n")} = ${A}$ 与 $${sigmaInf("b_n")} = ${c}$ 都收敛`,
    ),
  ][kind]!;
  const body = kind === 1 ? term(d, "b_n") : plus(term(c, "a_n"), term(d, "b_n"));
  const series = sigmaInf(`(${body})`);
  const right = kind === 2 ? 2 : kind === 3 ? 0 : 1;
  const value = c * A + d * c;
  const half = "\\left(\\frac{1}{2}\\right)^{n}";
  const geo = (v: number) => (v === 0 ? "0" : term(v, half));
  const why = [
    t(
      `If $${series}$ converged, then $${sigmaInf("b_n")} = \\frac{1}{${d}}\\left(${poly([1, series], [-c, sigmaInf("a_n")])}\\right)$ would converge too, which it does not.`,
      `若 $${series}$ 收敛，则 $${sigmaInf("b_n")} = \\frac{1}{${d}}\\left(${poly([1, series], [-c, sigmaInf("a_n")])}\\right)$ 也收敛，矛盾。`,
    ),
    t(
      `If $${sigmaInf(body)}$ converged, so would $\\frac{1}{${d}}$ times it, which is $${sigmaInf("b_n")}$.`,
      `若 $${sigmaInf(body)}$ 收敛，则它的 $\\frac{1}{${d}}$ 倍，即 $${sigmaInf("b_n")}$，也收敛，矛盾。`,
    ),
    t(
      "A combination of two divergent series may converge or diverge, so the information given is not enough.",
      "两个发散级数的组合可能收敛也可能发散，所以已知条件不足以判断。",
    ),
    t(
      `Both series converge, so the combination converges to $${c} \\cdot ${paren(A)} + ${paren(d)} \\cdot ${paren(c)} = ${value}$.`,
      `两个级数都收敛，所以组合收敛于 $${c} \\cdot ${paren(A)} + ${paren(d)} \\cdot ${paren(c)} = ${value}$。`,
    ),
  ][kind]!;
  const wrong: Pick[] =
    kind === 0
      ? [
          [
            convergence[0],
            "Subtracting the convergent part would then leave a convergent multiple of the divergent series",
            "那样减去收敛的部分后，发散级数的倍数就会收敛，矛盾",
          ],
          [
            convergence[2],
            "A convergent series plus a nonzero multiple of a divergent one always diverges",
            "收敛级数加上发散级数的非零倍数，一定发散",
          ],
        ]
      : kind === 1
        ? [
            [
              convergence[0],
              `Dividing by $${d}$ would then make the divergent series converge`,
              `那样除以 $${d}$ 后，发散的级数就会收敛，矛盾`,
            ],
            [convergence[2], "A nonzero multiple of a divergent series always diverges", "发散级数的非零倍数一定发散"],
          ]
        : kind === 2
          ? [
              c + d !== 0
                ? [
                    convergence[0],
                    `Two divergent series need not cancel: $a_n = b_n = 1$ make every term $${c + d}$, and that series diverges`,
                    `两个发散级数未必相消：取 $a_n = b_n = 1$，每一项都是 $${c + d}$，级数发散`,
                  ]
                : [
                    convergence[0],
                    `Two divergent series need not cancel: $a_n = 1$, $b_n = 2$ make every term $${c + 2 * d}$, and that series diverges`,
                    `两个发散级数未必相消：取 $a_n = 1$，$b_n = 2$，每一项都是 $${c + 2 * d}$，级数发散`,
                  ],
              [
                convergence[1],
                `Two divergent series can cancel: $a_n = ${d}$ and $b_n = ${-c}$ give $${c} \\cdot ${paren(d)} + ${paren(d)} \\cdot ${paren(-c)} = 0$ for every $n$`,
                `两个发散级数可能相消：取 $a_n = ${d}$，$b_n = ${-c}$，对每个 $n$ 都有 $${c} \\cdot ${paren(d)} + ${paren(d)} \\cdot ${paren(-c)} = 0$`,
              ],
            ]
          : [
              [convergence[1], "A combination of convergent series converges", "收敛级数的线性组合仍收敛"],
              [convergence[2], "Both sums are known, so the combination's sum can be found", "两个和都已知，组合的和可以求出"],
            ];
  const check =
    kind === 0
      ? t(
          `Try an example: $a_n = ${geo(A)}$ sums to $${A}$ and $b_n = 1$ diverges; then $${body}$ tends to $${d} \\ne 0$, so the series fails the term test and diverges.`,
          `举例验证：$a_n = ${geo(A)}$ 的和为 $${A}$，$b_n = 1$ 发散；这时 $${body}$ 趋于 $${d} \\ne 0$，不满足项趋于 $0$ 的必要条件，级数发散。`,
        )
      : kind === 1
        ? t(
            `Try an example: with $b_n = 1$, every term of $${sigmaInf(body)}$ is $${d} \\ne 0$, so it diverges.`,
            `举例验证：取 $b_n = 1$，$${sigmaInf(body)}$ 的每一项都是 $${d} \\ne 0$，所以发散。`,
          )
        : kind === 2
          ? c + d !== 0
            ? t(
                `Two examples: $a_n = ${d}$, $b_n = ${-c}$ give every term $0$, which converges; $a_n = b_n = 1$ give every term $${c + d} \\ne 0$, which diverges.`,
                `两个例子：$a_n = ${d}$，$b_n = ${-c}$ 使每一项都为 $0$，收敛；$a_n = b_n = 1$ 使每一项都为 $${c + d} \\ne 0$，发散。`,
              )
            : t(
                `Two examples: $a_n = b_n = 1$ give every term $0$, which converges; $a_n = 1$, $b_n = 2$ give every term $${c + 2 * d} \\ne 0$, which diverges.`,
                `两个例子：$a_n = b_n = 1$ 使每一项都为 $0$，收敛；$a_n = 1$，$b_n = 2$ 使每一项都为 $${c + 2 * d} \\ne 0$，发散。`,
              )
          : t(
              `Try an example: $a_n = ${geo(A)}$ and $b_n = ${geo(c)}$ have the given sums, and $${body} = ${geo(value)}$, a geometric series with sum $${value}$.`,
              `举例验证：$a_n = ${geo(A)}$ 与 $b_n = ${geo(c)}$ 的和符合已知，而 $${body} = ${geo(value)}$ 是和为 $${value}$ 的等比级数。`,
            );
  return choose(
    rng,
    t(`Suppose ${given.en}. What can be said about $${series}$?`, `设${given["zh-CN"]}。关于 $${series}$ 能得出什么结论？`),
    convergence[right]!,
    wrong,
    [
      step("Note what is known", "列出已知", t(`We know that ${given.en}.`, `已知${given["zh-CN"]}。`)),
      step("Reason about the combination", "分析组合", why),
    ],
    check,
  );
}

/** furtherPropertiesOfInfiniteSeries drops initial terms and combines convergent with divergent series. */
export const furtherPropertiesOfInfiniteSeries: TopicDef = {
  id: "further-properties-of-infinite-series",
  title: t("Further Properties of Infinite Series", "无穷级数的性质进阶"),
  summary: t(
    "Dropping finitely many terms changes the sum but not convergence; a convergent series plus a divergent one diverges.",
    "去掉有限项会改变级数的和，但不改变敛散性；收敛级数加发散级数仍发散。",
  ),
  intro: t(
    "Leaving out the first few terms of a convergent series takes their values out of the sum. Since $\\sum_{n=1}^{\\infty} \\frac{1}{n(n + 1)} = 1$,\n\n$$\\sum_{n=3}^{\\infty} \\frac{1}{n(n + 1)} = 1 - \\frac{1}{2} - \\frac{1}{6} = \\frac{1}{3}.$$\n\nCheck: telescoping $\\frac{1}{n} - \\frac{1}{n + 1}$ from $n = 3$ leaves just $\\frac{1}{3}$.\n\nIn this lesson we start series at later indices and decide what combinations of convergent and divergent series do.",
    "去掉收敛级数开头的几项，就从和中减去它们的值。由于 $\\sum_{n=1}^{\\infty} \\frac{1}{n(n + 1)} = 1$，\n\n$$\\sum_{n=3}^{\\infty} \\frac{1}{n(n + 1)} = 1 - \\frac{1}{2} - \\frac{1}{6} = \\frac{1}{3}$$\n\n检验：从 $n = 3$ 起把 $\\frac{1}{n} - \\frac{1}{n + 1}$ 裂项相消，只剩 $\\frac{1}{3}$。\n\n本课我们让级数从较后的下标开始，并判断收敛与发散级数的组合是否收敛。",
  ),
  prerequisites: ["properties-of-infinite-series"],
  encompasses: [{ topic: "properties-of-infinite-series", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "removing-initial-terms",
      title: t("Removing initial terms", "去掉开头的项"),
      explanation: t(
        "Starting the sum at a later index leaves out finitely many terms, which does not affect whether it converges but does change its value. Starting a series later subtracts the terms left out:\n\n$$\\sum_{n=k}^{\\infty} a_n = \\sum_{n=1}^{\\infty} a_n - (a_1 + \\cdots + a_{k-1}).$$\n\nIf $\\sum_{n=1}^{\\infty} \\frac{1}{n(n + 1)} = 1$, then $\\sum_{n=3}^{\\infty} \\frac{1}{n(n + 1)} = 1 - \\frac{1}{2} - \\frac{1}{6} = \\frac{1}{3}$.\n\nCheck: $\\sum_{n=3}^{\\infty} \\left(\\frac{1}{n} - \\frac{1}{n + 1}\\right)$ telescopes to $\\frac{1}{3}$.\n\n> **Watch out.** The sum from $n = k$ keeps $a_k$; only $a_1, \\ldots, a_{k-1}$ are removed.",
        "从较后的下标开始求和会去掉有限个项，这不影响是否收敛，但会改变和的值。从后面的项开始求和，就减去被省略的项：\n\n$$\\sum_{n=k}^{\\infty} a_n = \\sum_{n=1}^{\\infty} a_n - (a_1 + \\cdots + a_{k-1})$$\n\n若 $\\sum_{n=1}^{\\infty} \\frac{1}{n(n + 1)} = 1$，则 $\\sum_{n=3}^{\\infty} \\frac{1}{n(n + 1)} = 1 - \\frac{1}{2} - \\frac{1}{6} = \\frac{1}{3}$。\n\n检验：$\\sum_{n=3}^{\\infty} \\left(\\frac{1}{n} - \\frac{1}{n + 1}\\right)$ 裂项相消后为 $\\frac{1}{3}$。\n\n> **注意。** 从 $n = k$ 开始的和保留 $a_k$；去掉的只是 $a_1, \\ldots, a_{k-1}$。",
      ),
      generate: droppedTerms,
    },
    {
      id: "convergent-plus-divergent",
      title: t("Combining convergent and divergent series", "收敛与发散级数的组合"),
      explanation: t(
        "If $\\sum a_n$ converges and $\\sum b_n$ diverges, then $\\sum (a_n + b_n)$ diverges: otherwise $\\sum b_n = \\sum (a_n + b_n) - \\sum a_n$ would converge. A nonzero multiple of a divergent series diverges too. But the sum of two divergent series can go either way: $\\sum 1$ and $\\sum (-1)$ diverge while $\\sum (1 + (-1)) = 0$ converges.\n\nCheck: $a_n = \\left(\\frac{1}{2}\\right)^{n}$ converges and $b_n = 1$ diverges; $a_n + b_n \\to 1 \\ne 0$, so $\\sum (a_n + b_n)$ diverges.\n\n> **Watch out.** Two divergent series can add up to a convergent one; only convergent plus divergent is sure to diverge.",
        "若 $\\sum a_n$ 收敛而 $\\sum b_n$ 发散，则 $\\sum (a_n + b_n)$ 发散：否则 $\\sum b_n = \\sum (a_n + b_n) - \\sum a_n$ 就会收敛。发散级数的非零倍数也发散。但两个发散级数之和可能收敛也可能发散：$\\sum 1$ 与 $\\sum (-1)$ 都发散，而 $\\sum (1 + (-1)) = 0$ 收敛。\n\n检验：$a_n = \\left(\\frac{1}{2}\\right)^{n}$ 收敛，$b_n = 1$ 发散；$a_n + b_n \\to 1 \\ne 0$，所以 $\\sum (a_n + b_n)$ 发散。\n\n> **注意。** 两个发散级数相加可能收敛；只有收敛加发散才一定发散。",
      ),
      generate: mixedSeries,
    },
  ],
};

/** telescopingPartialSum finds a partial sum that collapses to two pieces. */
function telescopingPartialSum(rng: Rng): Problem {
  const c = rng.int(1, 9);
  const a = rng.int(0, 4);
  const N = rng.int(3, 12);
  const answer = Q.of(c, a + 1).sub(Q.of(c, N + a + 1));
  const den = a === 0 ? "n(n + 1)" : `(${shift(a)})(${shift(a + 1)})`;
  const a1 = Q.of(c, (a + 1) * (a + 2));
  const first = Q.of(c, a + 1).toLatex();
  const last = Q.of(c, N + a + 1).toLatex();
  return numberWorked(
    t(
      `Find the partial sum $S_{${N}}$ of the series $${sigmaInf(`\\frac{${c}}{${den}}`)}$.`,
      `求级数 $${sigmaInf(`\\frac{${c}}{${den}}`)}$ 的部分和 $S_{${N}}$。`,
    ),
    answer,
    [
      step(
        "Split by partial fractions",
        "拆成部分分式",
        none,
        `\\frac{${c}}{${den}} = \\frac{${c}}{${shift(a)}} - \\frac{${c}}{${shift(a + 1)}}`,
      ),
      step(
        "Let the middle cancel",
        "让中间的项相消",
        t(
          "Each negative piece cancels the next positive one, leaving the first and the last:",
          "每个负的部分与下一个正的部分相消，只剩首尾两部分：",
        ),
        `S_{${N}} = ${first} - ${last} = ${answer.toLatex()}`,
      ),
    ],
    t(
      `The formula $S_N = ${first} - \\frac{${c}}{N + ${a + 1}}$ at $N = 1$ gives $${first} - \\frac{${c}}{${a + 2}} = ${a1.toLatex()}$, which is the first term $a_1 = \\frac{${c}}{${a + 1} \\cdot ${a + 2}}$, so the pattern is right.`,
      `公式 $S_N = ${first} - \\frac{${c}}{N + ${a + 1}}$ 在 $N = 1$ 时为 $${first} - \\frac{${c}}{${a + 2}} = ${a1.toLatex()}$，正是首项 $a_1 = \\frac{${c}}{${a + 1} \\cdot ${a + 2}}$，可见规律正确。`,
    ),
    [
      [
        Q.of(c, a + 1),
        `This is the sum of the whole series; $S_{${N}}$ still has the last piece $-${last}$`,
        `这是整个级数的和；$S_{${N}}$ 还要减去最后一部分 $${last}$`,
      ],
      [
        Q.of(c, a + 1).sub(Q.of(c, N + a)),
        `The last piece comes from $n = ${N}$ in $\\frac{${c}}{${shift(a + 1)}}$, which is $${last}$`,
        `最后一部分来自 $\\frac{${c}}{${shift(a + 1)}}$ 在 $n = ${N}$ 时的值，即 $${last}$`,
      ],
      [
        Q.of(c, N + a + 1),
        `This keeps only the last piece; the first piece $${first}$ survives too`,
        `这里只保留了最后一部分；第一部分 $${first}$ 也留了下来`,
      ],
    ],
  );
}

/** telescopingSum sums a series whose pieces are k places apart. */
function telescopingSum(rng: Rng): Problem {
  const a = rng.int(0, 4);
  const k = rng.int(1, 3);
  const c = rng.int(1, 9);
  const head = Array.from({ length: k }, (_, j) => Q.of(1, a + j + 1));
  const H = head.reduce((s, x) => s.add(x), Q.zero);
  const coef = Q.of(c, k);
  const answer = H.mul(coef);
  const lead = coef.eq(Q.of(1)) ? "" : coef.toLatex();
  const den = `${a === 0 ? "n" : `(${shift(a)})`}(${shift(a + k)})`;
  const shifted = Array.from({ length: k }, (_, j) => Q.of(1, a + k + j + 1)).reduce((s, x) => s.add(x), Q.zero);
  let partial = 0;
  for (let n = 1; n <= 1000; n++) partial += c / ((n + a) * (n + a + k));
  return numberWorked(
    t(`Find $${sigmaInf(`\\frac{${c}}{${den}}`)}$.`, `求 $${sigmaInf(`\\frac{${c}}{${den}}`)}$。`),
    answer,
    [
      step(
        "Split by partial fractions",
        "拆成部分分式",
        k === 1
          ? t("The two factors differ by $1$:", "两个因式相差 $1$：")
          : t(
              `The two factors differ by $${k}$, so the coefficient is $\\frac{${c}}{${k}}$:`,
              `两个因式相差 $${k}$，所以系数为 $\\frac{${c}}{${k}}$：`,
            ),
        `\\frac{${c}}{${den}} = ${lead}\\left(\\frac{1}{${shift(a)}} - \\frac{1}{${shift(a + k)}}\\right)`,
      ),
      step(
        "Keep the surviving pieces",
        "保留剩下的部分",
        k === 1
          ? t(
              "The first positive piece is never cancelled, and the negative piece at the end tends to $0$:",
              "第一个正的部分不会被抵消，末尾的负的部分趋于 $0$：",
            )
          : t(
              `The first $${k}$ positive pieces are never cancelled, and the negative pieces at the end tend to $0$:`,
              `前 $${k}$ 个正的部分不会被抵消，末尾的负的部分趋于 $0$：`,
            ),
        k === 1
          ? `${coef.toLatex()} \\cdot ${head[0]!.toLatex()} = ${answer.toLatex()}`
          : `${lead}\\left(${head.map((x) => x.toLatex()).join(" + ")}\\right) = ${answer.toLatex()}`,
      ),
    ],
    t(
      `Add the terms numerically: $S_{1000} \\approx ${approx(partial)}$, close to $${near(answer)}$.`,
      `用数值相加：$S_{1000} \\approx ${approx(partial)}$，接近 $${near(answer)}$。`,
    ),
    [
      [
        Q.of(c, a + 1),
        `This keeps only the first surviving piece and forgets the factor $\\frac{1}{${k}}$`,
        `这里只保留了第一个剩下的部分，还漏了因子 $\\frac{1}{${k}}$`,
      ],
      [H.mul(Q.of(c)), `This forgets to divide by $${k}$, the gap between the factors`, `这里忘了除以两个因式之差 $${k}$`],
      [Q.of(c, k * (a + 1)), `This keeps only the first of the $${k}$ surviving pieces`, `这里只保留了 $${k}$ 个剩下的部分中的第一个`],
      [
        shifted.mul(coef),
        `These are pieces of $\\frac{1}{${shift(a + k)}}$, which cancel; the survivors come from $\\frac{1}{${shift(a)}}$`,
        `这些是 $\\frac{1}{${shift(a + k)}}$ 的部分，它们会被抵消；留下的来自 $\\frac{1}{${shift(a)}}$`,
      ],
      [Q.of(c, (a + 1) * (a + k + 1)), "This is only the first term $a_1$", "这只是首项 $a_1$"],
      ...(c > 1 ? [[H.div(Q.of(k)), `This leaves out the numerator $${c}$`, `这里漏了分子 $${c}$`] as const] : []),
    ],
  );
}

/** telescopingSeries sums series whose partial sums collapse. */
export const telescopingSeries: TopicDef = {
  id: "telescoping-series",
  title: t("Telescoping Series", "裂项级数"),
  summary: t(
    "Split each term into a difference by partial fractions; the partial sums collapse to a few terms.",
    "用部分分式把每一项拆成差，部分和就相消到只剩少数几项。",
  ),
  intro: t(
    "When each term splits into a difference, the partial sums collapse. Since $\\frac{1}{n(n + 1)} = \\frac{1}{n} - \\frac{1}{n + 1}$,\n\n$$S_N = \\left(1 - \\frac{1}{2}\\right) + \\left(\\frac{1}{2} - \\frac{1}{3}\\right) + \\cdots + \\left(\\frac{1}{N} - \\frac{1}{N + 1}\\right) = 1 - \\frac{1}{N + 1} \\to 1.$$\n\nCheck: adding directly, $S_2 = \\frac{1}{2} + \\frac{1}{6} = \\frac{2}{3}$, and the formula gives $1 - \\frac{1}{3} = \\frac{2}{3}$.\n\nIn this lesson we find partial sums and sums of telescoping series, also when the pieces are several places apart.",
    "当每一项都能拆成差时，部分和会相消。由于 $\\frac{1}{n(n + 1)} = \\frac{1}{n} - \\frac{1}{n + 1}$，\n\n$$S_N = \\left(1 - \\frac{1}{2}\\right) + \\left(\\frac{1}{2} - \\frac{1}{3}\\right) + \\cdots + \\left(\\frac{1}{N} - \\frac{1}{N + 1}\\right) = 1 - \\frac{1}{N + 1} \\to 1$$\n\n检验：直接相加，$S_2 = \\frac{1}{2} + \\frac{1}{6} = \\frac{2}{3}$，公式给出 $1 - \\frac{1}{3} = \\frac{2}{3}$。\n\n本课我们求裂项级数的部分和与和，包括两部分相隔几个位置的情形。",
  ),
  prerequisites: ["convergent-and-divergent-infinite-series", "expressing-rational-functions-as-sums-of-partial-fractions"],
  encompasses: [{ topic: "convergent-and-divergent-infinite-series", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "partial-sums-of-telescoping-series",
      title: t("Partial sums of telescoping series", "裂项级数的部分和"),
      explanation: t(
        "In a telescoping sum each term cancels part of the next one, so only the first and last pieces survive, and the limit is easy to find. When each term is a difference $b_n - b_{n+1}$, the middle terms cancel in pairs:\n\n$$S_N = (b_1 - b_2) + (b_2 - b_3) + \\cdots + (b_N - b_{N+1}) = b_1 - b_{N+1}.$$\n\nFor $\\frac{1}{n(n + 1)} = \\frac{1}{n} - \\frac{1}{n + 1}$: $S_N = 1 - \\frac{1}{N + 1}$, so $S_4 = \\frac{4}{5}$.\n\nCheck: $\\frac{1}{2} + \\frac{1}{6} + \\frac{1}{12} + \\frac{1}{20} = \\frac{30 + 10 + 5 + 3}{60} = \\frac{4}{5}$.\n\n> **Watch out.** The last surviving piece is $b_{N+1}$, not $b_N$.",
        "在裂项相消的和中，每一项都抵消下一项的一部分，只剩下首尾两部分，极限就很容易求了。当每一项都是差 $b_n - b_{n+1}$ 时，中间的项两两相消：\n\n$$S_N = (b_1 - b_2) + (b_2 - b_3) + \\cdots + (b_N - b_{N+1}) = b_1 - b_{N+1}$$\n\n对 $\\frac{1}{n(n + 1)} = \\frac{1}{n} - \\frac{1}{n + 1}$：$S_N = 1 - \\frac{1}{N + 1}$，所以 $S_4 = \\frac{4}{5}$。\n\n检验：$\\frac{1}{2} + \\frac{1}{6} + \\frac{1}{12} + \\frac{1}{20} = \\frac{30 + 10 + 5 + 3}{60} = \\frac{4}{5}$。\n\n> **注意。** 最后剩下的是 $b_{N+1}$，不是 $b_N$。",
      ),
      generate: telescopingPartialSum,
    },
    {
      id: "sums-of-telescoping-series",
      title: t("Sums of telescoping series", "裂项级数的和"),
      explanation: t(
        "When the two pieces are $k$ places apart, $k$ terms survive at the start:\n\n$$\\frac{2}{n(n + 2)} = \\frac{1}{n} - \\frac{1}{n + 2}, \\qquad S_N = 1 + \\frac{1}{2} - \\frac{1}{N + 1} - \\frac{1}{N + 2} \\to \\frac{3}{2}.$$\n\nThe terms at the end tend to $0$, so the sum is the sum of the surviving terms at the start.\n\nCheck: $S_3 = \\frac{2}{3} + \\frac{1}{4} + \\frac{2}{15} = 1.05$, and the formula gives $1 + \\frac{1}{2} - \\frac{1}{4} - \\frac{1}{5} = 1.05$.\n\n> **Watch out.** Partial fractions bring a factor $\\frac{1}{k}$: $\\frac{1}{n(n + 2)} = \\frac{1}{2}\\left(\\frac{1}{n} - \\frac{1}{n + 2}\\right)$.",
        "当两部分相隔 $k$ 个位置时，开头会留下 $k$ 项：\n\n$$\\frac{2}{n(n + 2)} = \\frac{1}{n} - \\frac{1}{n + 2}, \\qquad S_N = 1 + \\frac{1}{2} - \\frac{1}{N + 1} - \\frac{1}{N + 2} \\to \\frac{3}{2}$$\n\n末尾的项趋于 $0$，所以级数的和就是开头留下的各项之和。\n\n检验：$S_3 = \\frac{2}{3} + \\frac{1}{4} + \\frac{2}{15} = 1.05$，公式给出 $1 + \\frac{1}{2} - \\frac{1}{4} - \\frac{1}{5} = 1.05$。\n\n> **注意。** 部分分式会带来因子 $\\frac{1}{k}$：$\\frac{1}{n(n + 2)} = \\frac{1}{2}\\left(\\frac{1}{n} - \\frac{1}{n + 2}\\right)$。",
      ),
      generate: telescopingSum,
    },
  ],
};

/** GeometricSeries is a series a + ar + ar² + ⋯ with |r| < 1. */
interface GeometricSeries {
  readonly a: Q;
  readonly r: Q;
}

/** geometricSeries picks a convergent geometric series whose first terms are easy to read. */
function geometricSeries(rng: Rng): GeometricSeries {
  for (;;) {
    const q = rng.int(2, 5);
    const p = rng.nonZero(1 - q, q - 1);
    if (gcd(Math.abs(p), q) !== 1) continue;
    return { a: Q.of(rng.nonZero(-3, 3) * q * q), r: Q.of(p, q) };
  }
}

/** termsOf lists the first count terms of a geometric series. */
function termsOf(g: GeometricSeries, count: number): Q[] {
  const out: Q[] = [];
  let x = g.a;
  for (let i = 0; i < count; i++) {
    out.push(x);
    x = x.mul(g.r);
  }
  return out;
}

/** written writes the first four terms of a geometric series followed by ⋯. */
function written(g: GeometricSeries): string {
  return `${plus(...termsOf(g, 4).map((x) => x.toLatex()))} + \\cdots`;
}

/** geometricSum states S = a/(1 − r). */
const geometricSum = "S = \\frac{a}{1 - r}";

/** writtenSum sums a written-out geometric series. */
function writtenSum(rng: Rng): Problem {
  const g = geometricSeries(rng);
  const answer = g.a.div(Q.one.sub(g.r));
  const [a1, a2] = termsOf(g, 2) as [Q, Q];
  const partials: string[] = [];
  let s = Q.zero;
  for (const x of termsOf(g, 6)) {
    s = s.add(x);
    partials.push(approx(s.toNumber()));
  }
  return numberWorked(
    t(`Find the sum of the series $${written(g)}$.`, `求级数 $${written(g)}$ 的和。`),
    answer,
    [
      step(
        "Read the first term and the ratio",
        "读出首项和公比",
        t(
          `The first term is $a = ${a1.toLatex()}$; dividing the second term by the first gives the ratio, and $|r| < 1$:`,
          `首项 $a = ${a1.toLatex()}$；用第二项除以第一项得到公比，且 $|r| < 1$：`,
        ),
        `r = ${a2.toLatex()} \\div ${parenQ(a1)} = ${g.r.toLatex()}`,
      ),
      step("Apply the formula", "代入公式", none, `S = \\frac{${a1.toLatex()}}{1 - ${parenQ(g.r)}} = ${answer.toLatex()}`),
    ],
    t(
      `The partial sums $S_1, \\ldots, S_6$ are about $${partials.join(", ")}$, closing in on $${near(answer)}$.`,
      `部分和 $S_1, \\ldots, S_6$ 约为 $${partials.join(", ")}$，越来越接近 $${near(answer)}$。`,
    ),
    [
      [
        g.a.div(Q.one.add(g.r)),
        "This divides by $1 + r$; the formula is $\\frac{a}{1 - r}$",
        "这里除以了 $1 + r$；公式是 $\\frac{a}{1 - r}$",
      ],
      [
        g.a.mul(g.r).div(Q.one.sub(g.r)),
        `This uses the second term $${a2.toLatex()}$ as the first term`,
        `这里把第二项 $${a2.toLatex()}$ 当成了首项`,
      ],
      [
        Q.one.div(Q.one.sub(g.r)),
        `This leaves out the first term $${a1.toLatex()}$: it is the sum when $a = 1$`,
        `这里漏了首项 $${a1.toLatex()}$：这是 $a = 1$ 时的和`,
      ],
    ],
  );
}

/** missingTermOrRatio solves S = a/(1 − r) for a or for r. */
function missingTermOrRatio(rng: Rng): Problem {
  const den = rng.int(2, 6);
  const r = Q.of(rng.nonZero(1 - den, den - 1), den);
  const a = Q.of(rng.nonZero(-12, 12));
  const S = a.div(Q.one.sub(r));
  const back = t(
    `Substituting back gives the given sum: $\\frac{${a.toLatex()}}{1 - ${parenQ(r)}} = \\frac{${a.toLatex()}}{${Q.one.sub(r).toLatex()}} = ${S.toLatex()}$.`,
    `代回后正好得到已知的和：$\\frac{${a.toLatex()}}{1 - ${parenQ(r)}} = \\frac{${a.toLatex()}}{${Q.one.sub(r).toLatex()}} = ${S.toLatex()}$。`,
  );
  if (rng.bool()) {
    const aS = a.div(S);
    return numberWorked(
      t(
        `An infinite geometric series has first term $${a.toLatex()}$ and sum $${S.toLatex()}$. Find its common ratio $r$.`,
        `一个无穷等比级数的首项为 $${a.toLatex()}$，和为 $${S.toLatex()}$。求它的公比 $r$。`,
      ),
      r,
      [
        step(
          "Solve for 1 − r",
          "解出 1 − r",
          t(`From $${geometricSum}$, $1 - r = \\frac{a}{S}$:`, `由 $${geometricSum}$ 得 $1 - r = \\frac{a}{S}$：`),
          `1 - r = \\frac{${a.toLatex()}}{${S.toLatex()}} = ${aS.toLatex()}`,
        ),
        step(
          "Solve for r",
          "解出 r",
          t("Subtract from $1$; the result has $|r| < 1$, as it must:", "用 $1$ 减去它；结果满足 $|r| < 1$："),
          `r = 1 - ${parenQ(aS)} = ${r.toLatex()}`,
        ),
      ],
      back,
      [
        [aS, `This is $1 - r$; subtract it from $1$ to get $r$`, `这是 $1 - r$；还要用 $1$ 减去它才得到 $r$`],
        [
          Q.one.add(aS),
          "The sign is wrong: $r = 1 - \\frac{a}{S}$, not $1 + \\frac{a}{S}$",
          "符号错了：$r = 1 - \\frac{a}{S}$，不是 $1 + \\frac{a}{S}$",
        ],
        [S.div(a), "This is $\\frac{S}{a}$, the reciprocal of $1 - r$", "这是 $\\frac{S}{a}$，即 $1 - r$ 的倒数"],
      ],
      "r",
    );
  }
  return numberWorked(
    t(
      `An infinite geometric series has common ratio $${r.toLatex()}$ and sum $${S.toLatex()}$. Find its first term $a$.`,
      `一个无穷等比级数的公比为 $${r.toLatex()}$，和为 $${S.toLatex()}$。求它的首项 $a$。`,
    ),
    a,
    [
      step(
        "Solve for a",
        "解出 a",
        t(`Multiply both sides of $${geometricSum}$ by $1 - r$:`, `把 $${geometricSum}$ 两边同乘 $1 - r$：`),
        "a = S(1 - r)",
      ),
      step("Substitute", "代入", none, `a = ${S.toLatex()} \\cdot \\left(1 - ${parenQ(r)}\\right) = ${a.toLatex()}`),
    ],
    back,
    [
      [S.mul(Q.one.add(r)), "This multiplies by $1 + r$; the formula has $1 - r$", "这里乘以了 $1 + r$；公式中是 $1 - r$"],
      [S.mul(r), "This multiplies by $r$ instead of $1 - r$", "这里乘以了 $r$，应当乘以 $1 - r$"],
      [
        S.div(Q.one.sub(r)),
        "This divides by $1 - r$; to undo the division in the formula, multiply",
        "这里除以了 $1 - r$；要抵消公式中的除法，应当相乘",
      ],
    ],
    "a",
  );
}

/** findingTheSumOfAnInfiniteGeometricSeries applies S = a/(1 − r). */
export const findingTheSumOfAnInfiniteGeometricSeries: TopicDef = {
  id: "finding-the-sum-of-an-infinite-geometric-series",
  title: t("Finding the Sum of an Infinite Geometric Series", "求无穷等比级数的和"),
  summary: t(
    "When |r| < 1, a + ar + ar² + ⋯ = a/(1 − r), the limit of the finite sums a(1 − rⁿ)/(1 − r).",
    "当 |r| < 1 时，a + ar + ar² + ⋯ = a/(1 − r)，即有限和 a(1 − rⁿ)/(1 − r) 的极限。",
  ),
  intro: t(
    `When the ratio of a geometric series is between $-1$ and $1$, the series has a sum. For $12 - 6 + 3 - \\frac{3}{2} + \\cdots$, $a = 12$ and $r = -\\frac{1}{2}$, so\n\n$$S = \\frac{12}{1 - \\left(-\\frac{1}{2}\\right)} = 8.$$\n\nCheck: the partial sums $12, 6, 9, 7.5, 8.25$ swing around $8$ ever more closely.\n\nIn this lesson we sum geometric series and find a missing first term or ratio from the sum.`,
    `等比级数的公比介于 $-1$ 和 $1$ 之间时，级数有和。对 $12 - 6 + 3 - \\frac{3}{2} + \\cdots$，$a = 12$，$r = -\\frac{1}{2}$，所以\n\n$$S = \\frac{12}{1 - \\left(-\\frac{1}{2}\\right)} = 8$$\n\n检验：部分和 $12, 6, 9, 7.5, 8.25$ 在 $8$ 的两侧摆动，越来越接近 $8$。\n\n本课我们求等比级数的和，并由和求出未知的首项或公比。`,
  ),
  prerequisites: ["convergent-and-divergent-infinite-series", "the-sum-of-a-finite-geometric-series", "convergence-of-geometric-sequences"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "sums-of-written-out-geometric-series",
      title: t("Sums of written-out geometric series", "写出各项的等比级数之和"),
      explanation: t(
        `To sum a written-out geometric series, find its first term and the common ratio by dividing a term by the one before it, and check that the ratio is small enough. The partial sums of $a + ar + ar^{2} + \\cdots$ are $S_n = \\frac{a(1 - r^{n})}{1 - r}$. When $|r| < 1$, $r^{n} \\to 0$, so the series converges to\n\n$$${geometricSum}.$$\n\nFor $12 - 6 + 3 - \\frac{3}{2} + \\cdots$: $a = 12$, $r = -\\frac{1}{2}$, and $S = \\frac{12}{3/2} = 8$.\n\nCheck: $S_4 = 12 - 6 + 3 - 1.5 = 7.5$ and $S_5 = 8.25$, on either side of $8$.\n\n> **Watch out.** The formula needs $|r| < 1$: for $1 + 2 + 4 + \\cdots$ it would give $\\frac{1}{1 - 2} = -1$, but the series has no sum.`,
        `求写出各项的等比级数之和时，先找出首项，并用某一项除以前一项求出公比，再检查公比的绝对值是否小于 1。$a + ar + ar^{2} + \\cdots$ 的部分和为 $S_n = \\frac{a(1 - r^{n})}{1 - r}$。当 $|r| < 1$ 时 $r^{n} \\to 0$，所以级数收敛于\n\n$$${geometricSum}$$\n\n对 $12 - 6 + 3 - \\frac{3}{2} + \\cdots$：$a = 12$，$r = -\\frac{1}{2}$，$S = \\frac{12}{3/2} = 8$。\n\n检验：$S_4 = 12 - 6 + 3 - 1.5 = 7.5$，$S_5 = 8.25$，分别在 $8$ 的两侧。\n\n> **注意。** 公式要求 $|r| < 1$：对 $1 + 2 + 4 + \\cdots$，公式会给出 $\\frac{1}{1 - 2} = -1$，但这个级数没有和。`,
      ),
      generate: writtenSum,
    },
    {
      id: "a-missing-term-or-ratio-from-the-sum",
      title: t("A first term or ratio from the sum", "由和求首项或公比"),
      explanation: t(
        "Since $S = \\frac{a}{1 - r}$, knowing two of $S$, $a$ and $r$ gives the third. Solving for $r$: $1 - r = \\frac{a}{S}$, so $r = 1 - \\frac{a}{S}$. A geometric series with first term $6$ and sum $9$ has $r = 1 - \\frac{6}{9} = \\frac{1}{3}$. Solving for $a$: $a = S(1 - r)$.\n\nCheck: $\\frac{6}{1 - \\frac{1}{3}} = \\frac{6}{2/3} = 9$.\n\n> **Watch out.** Check that the ratio found has $|r| < 1$; otherwise no geometric series has that sum.",
        "由 $S = \\frac{a}{1 - r}$，已知 $S$、$a$、$r$ 中的两个就能求出第三个。解出 $r$：$1 - r = \\frac{a}{S}$，所以 $r = 1 - \\frac{a}{S}$。首项为 $6$、和为 $9$ 的等比级数 $r = 1 - \\frac{6}{9} = \\frac{1}{3}$。解出 $a$：$a = S(1 - r)$。\n\n检验：$\\frac{6}{1 - \\frac{1}{3}} = \\frac{6}{2/3} = 9$。\n\n> **注意。** 要检查求得的公比满足 $|r| < 1$；否则没有哪个等比级数的和是这个值。",
      ),
      generate: missingTermOrRatio,
    },
  ],
};

/** firstTermAndRatio reads a and r off a written-out series. */
function firstTermAndRatio(rng: Rng): Problem {
  const g = geometricSeries(rng);
  const [a1, a2] = termsOf(g, 2) as [Q, Q];
  const four = termsOf(g, 4).map((x) => x.toLatex());
  const wrong: readonly (readonly [readonly [Q, Q], string, string])[] = [
    [
      [g.a, Q.one.div(g.r)],
      "This divides each term by the next one; $r$ is a term divided by the one before it",
      "这里用每一项除以后一项；$r$ 应是某一项除以前一项",
    ],
    [
      [g.a.mul(g.r), g.r],
      `This takes the second term as $a$; at $n = 1$, $r^{n-1} = 1$, so $a$ is the first term $${a1.toLatex()}$`,
      `这里把第二项当成了 $a$；$n = 1$ 时 $r^{n-1} = 1$，所以 $a$ 是首项 $${a1.toLatex()}$`,
    ],
    [[g.r, g.a], "This swaps $a$ and $r$", "这里把 $a$ 与 $r$ 弄反了"],
  ];
  const problem = pointProblem({
    prompt: t(
      `Write $${written(g)}$ in the form $${sigmaInf("a r^{n-1}")}$. Give your answer as $(a, r)$.`,
      `把 $${written(g)}$ 写成 $${sigmaInf("a r^{n-1}")}$ 的形式，以 $(a, r)$ 作答。`,
    ),
    answer: [g.a, g.r],
    vars: ["a", "r"],
    wrong: wrong.map((w) => w[0]),
    solution: walked(
      [
        step(
          "Read the first term",
          "读出首项",
          t("At $n = 1$ the term is $a r^{0} = a$, so $a$ is the first term:", "$n = 1$ 时这一项是 $a r^{0} = a$，所以 $a$ 就是首项："),
          `a = ${a1.toLatex()}`,
        ),
        step(
          "Find the ratio",
          "求公比",
          t("Divide the second term by the first:", "用第二项除以第一项："),
          `r = ${a2.toLatex()} \\div ${parenQ(a1)} = ${g.r.toLatex()}`,
        ),
      ],
      t(
        `Put $n = 1, 2, 3, 4$ into $${g.a.toLatex()} \\cdot ${powN(g.r, "n-1")}$: this gives $${four.join(", ")}$, the terms written.`,
        `把 $n = 1, 2, 3, 4$ 代入 $${g.a.toLatex()} \\cdot ${powN(g.r, "n-1")}$：得到 $${four.join(", ")}$，正是写出的各项。`,
      ),
    ),
  });
  return withMistakes(
    problem,
    wrong.map(([v, en, zh]) => ({ response: pointLatex(v), why: t(en, zh) })),
  );
}

/** generalTermFromZero writes the general term of a series indexed from 0. */
function generalTermFromZero(rng: Rng): Problem {
  // The checker compares functions at non-integer n, where a negative ratio raised to n is undefined.
  const g0 = geometricSeries(rng);
  const g = { a: g0.a, r: g0.r.abs() };
  const r = g.r.toLatex();
  const a = g.a.toLatex();
  const answer = `${a}(${r})^{n}`;
  const [a1, a2, a3] = termsOf(g, 3) as [Q, Q, Q];
  return functionWorked(
    {
      prompt: t(
        `Write $${written(g)}$ as $\\sum_{n=0}^{\\infty} a_n$. Find the general term $a_n$.`,
        `把 $${written(g)}$ 写成 $\\sum_{n=0}^{\\infty} a_n$，求通项 $a_n$。`,
      ),
      answer,
      variable: "n",
      prefix: "a_n =",
    },
    [
      step(
        "Read the first term and the ratio",
        "读出首项和公比",
        t(
          `The first term is $${a}$, and dividing the second term by the first gives the ratio:`,
          `首项为 $${a}$，用第二项除以第一项得到公比：`,
        ),
        `r = ${a2.toLatex()} \\div ${parenQ(a1)} = ${r}`,
      ),
      step(
        "Match the starting index",
        "对齐起始下标",
        t(
          "With the index starting at $0$, the exponent is $n$, so that $n = 0$ gives $r^{0} = 1$:",
          "下标从 $0$ 开始，指数就是 $n$，这样 $n = 0$ 时 $r^{0} = 1$：",
        ),
        `a_n = ${answer}`,
      ),
    ],
    t(
      `Put in $n = 0, 1, 2$: the answer gives $${a1.toLatex()}, ${a2.toLatex()}, ${a3.toLatex()}$, the first three terms written.`,
      `代入 $n = 0, 1, 2$：答案给出 $${a1.toLatex()}, ${a2.toLatex()}, ${a3.toLatex()}$，正是写出的前三项。`,
    ),
    [
      [
        `${a}(${r})^{n-1}`,
        `This is the form for an index starting at $1$; at $n = 0$ it gives $${a1.div(g.r).toLatex()}$, not $${a}$`,
        `这是下标从 $1$ 开始时的形式；$n = 0$ 时它给出 $${a1.div(g.r).toLatex()}$，而不是 $${a}$`,
      ],
      [`${a}(${r})^{n+1}`, `At $n = 0$ this gives $${a2.toLatex()}$, the second term`, `$n = 0$ 时它给出第二项 $${a2.toLatex()}$`],
      [`${r}(${a})^{n}`, "This swaps the first term and the ratio", "这里把首项与公比弄反了"],
    ],
  );
}

/** writingAnInfiniteGeometricSeriesInSigmaNotation reads a and r off a series. */
export const writingAnInfiniteGeometricSeriesInSigmaNotation: TopicDef = {
  id: "writing-an-infinite-geometric-series-in-sigma-notation",
  title: t("Writing an Infinite Geometric Series in Sigma Notation", "用求和符号表示无穷等比级数"),
  summary: t(
    "$a + ar + ar^2 + \\cdots = \\sum_{n=1}^{\\infty} ar^{n-1} = \\sum_{n=0}^{\\infty} ar^n$.",
    "$a + ar + ar^2 + \\cdots = \\sum_{n=1}^{\\infty} ar^{n-1} = \\sum_{n=0}^{\\infty} ar^n$。",
  ),
  intro: t(
    "A written-out geometric series is fixed by its first term and its ratio. For $18 + 12 + 8 + \\cdots$, $a = 18$ and $r = \\frac{12}{18} = \\frac{2}{3}$, so\n\n$$18 + 12 + 8 + \\cdots = \\sum_{n=1}^{\\infty} 18\\left(\\frac{2}{3}\\right)^{n-1} = \\sum_{n=0}^{\\infty} 18\\left(\\frac{2}{3}\\right)^{n}.$$\n\nCheck: in the first form $n = 2$ gives $18 \\cdot \\frac{2}{3} = 12$, and in the second $n = 2$ gives $18 \\cdot \\frac{4}{9} = 8$, the matching terms.\n\nIn this lesson we read $a$ and $r$ off a series and write its general term for an index starting at $0$.",
    "写出各项的等比级数由首项和公比确定。对 $18 + 12 + 8 + \\cdots$，$a = 18$，$r = \\frac{12}{18} = \\frac{2}{3}$，所以\n\n$$18 + 12 + 8 + \\cdots = \\sum_{n=1}^{\\infty} 18\\left(\\frac{2}{3}\\right)^{n-1} = \\sum_{n=0}^{\\infty} 18\\left(\\frac{2}{3}\\right)^{n}$$\n\n检验：在第一种写法中 $n = 2$ 给出 $18 \\cdot \\frac{2}{3} = 12$，在第二种写法中 $n = 2$ 给出 $18 \\cdot \\frac{4}{9} = 8$，都与对应的项一致。\n\n本课我们从级数中读出 $a$ 与 $r$，并写出下标从 $0$ 开始的通项。",
  ),
  prerequisites: ["finding-the-sum-of-an-infinite-geometric-series", "writing-geometric-series-in-sigma-notation"],
  encompasses: [{ topic: "writing-geometric-series-in-sigma-notation", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "first-term-and-ratio",
      title: t("Finding a and r", "求 a 与 r"),
      explanation: t(
        "To write a geometric series as $\\sum_{n=1}^{\\infty} a r^{n-1}$, take $a$ as the first term and $r$ as the ratio of any term to the one before it. For $18 + 12 + 8 + \\frac{16}{3} + \\cdots$: $a = 18$ and $r = \\frac{12}{18} = \\frac{2}{3}$, so the series is $\\sum_{n=1}^{\\infty} 18\\left(\\frac{2}{3}\\right)^{n-1}$.\n\nCheck: $n = 4$ gives $18\\left(\\frac{2}{3}\\right)^{3} = \\frac{16}{3}$, the fourth term.\n\n> **Watch out.** $r$ is a term divided by the one before it: $\\frac{12}{18}$, not $\\frac{18}{12}$.",
        "要把等比级数写成 $\\sum_{n=1}^{\\infty} a r^{n-1}$，取首项为 $a$，取任一项与前一项之比为 $r$。对 $18 + 12 + 8 + \\frac{16}{3} + \\cdots$：$a = 18$，$r = \\frac{12}{18} = \\frac{2}{3}$，所以级数为 $\\sum_{n=1}^{\\infty} 18\\left(\\frac{2}{3}\\right)^{n-1}$。\n\n检验：$n = 4$ 时 $18\\left(\\frac{2}{3}\\right)^{3} = \\frac{16}{3}$，正是第四项。\n\n> **注意。** $r$ 是某一项除以前一项：$\\frac{12}{18}$，不是 $\\frac{18}{12}$。",
      ),
      generate: firstTermAndRatio,
    },
    {
      id: "the-general-term",
      title: t("The general term starting from n = 0", "从 n = 0 开始的通项"),
      explanation: t(
        "Starting the index at $0$ shifts the exponent: $a + ar + ar^{2} + \\cdots = \\sum_{n=0}^{\\infty} a r^{n}$, since the term with $n = 0$ is $a r^{0} = a$. For $18 + 12 + 8 + \\cdots$ the general term is $18\\left(\\frac{2}{3}\\right)^{n}$.\n\nCheck: $n = 0, 1, 2$ give $18, 12, 8$.\n\n> **Watch out.** With the index from $0$ the exponent is $n$; the exponent $n - 1$ belongs to an index from $1$.",
        "下标从 $0$ 开始时指数随之平移：$a + ar + ar^{2} + \\cdots = \\sum_{n=0}^{\\infty} a r^{n}$，因为 $n = 0$ 对应的项是 $a r^{0} = a$。对 $18 + 12 + 8 + \\cdots$，通项为 $18\\left(\\frac{2}{3}\\right)^{n}$。\n\n检验：$n = 0, 1, 2$ 分别给出 $18, 12, 8$。\n\n> **注意。** 下标从 $0$ 开始时指数是 $n$；指数 $n - 1$ 对应的是下标从 $1$ 开始。",
      ),
      generate: generalTermFromZero,
    },
  ],
};

/** startingIndexSum sums a geometric series that starts at a later index. */
function startingIndexSum(rng: Rng): Problem {
  const { r } = geometricSeries(rng);
  const c = rng.nonZero(-9, 9);
  const k = rng.int(0, 3);
  const skipped: Q[] = [];
  let first = Q.of(c);
  for (let j = 0; j < k; j++) {
    skipped.push(first);
    first = first.mul(r);
  }
  const answer = first.div(Q.one.sub(r));
  const whole = Q.of(c).div(Q.one.sub(r));
  const body = `${coefficientOf(c)}${powN(r)}`;
  return numberWorked(
    t(`Find $${sigmaInf(body, k)}$.`, `求 $${sigmaInf(body, k)}$。`),
    answer,
    [
      step(
        "Find the first term",
        "求首项",
        t(
          `The sum starts at $n = ${k}$, so the first term is the term at $n = ${k}$; the ratio is $r = ${r.toLatex()}$:`,
          `和从 $n = ${k}$ 开始，首项就是 $n = ${k}$ 的项；公比 $r = ${r.toLatex()}$：`,
        ),
        `a = ${c} \\cdot ${powN(r, `${k}`)} = ${first.toLatex()}`,
      ),
      step("Apply the formula", "代入公式", none, `S = \\frac{${first.toLatex()}}{1 - ${parenQ(r)}} = ${answer.toLatex()}`),
    ],
    k === 0
      ? t(
          `Multiply back: $${parenQ(answer)} \\cdot \\left(1 - ${parenQ(r)}\\right) = ${c}$, the first term.`,
          `乘回去检验：$${parenQ(answer)} \\cdot \\left(1 - ${parenQ(r)}\\right) = ${c}$，正是首项。`,
        )
      : t(
          `Taking away the skipped ${k === 1 ? "term" : "terms"} $${skipped.map((x) => x.toLatex()).join(", ")}$ from the sum from $n = 0$ leaves the answer: $\\frac{${c}}{1 - ${parenQ(r)}} - ${skipped.map(parenQ).join(" - ")} = ${answer.toLatex()}$.`,
          `从 $n = 0$ 开始的和减去被跳过的项 $${skipped.map((x) => x.toLatex()).join(", ")}$，正好得到答案：$\\frac{${c}}{1 - ${parenQ(r)}} - ${skipped.map(parenQ).join(" - ")} = ${answer.toLatex()}$。`,
        ),
    [
      [
        whole,
        `This uses $${c}$ as the first term; at $n = ${k}$ the first term is $${first.toLatex()}$`,
        `这里把 $${c}$ 当成了首项；$n = ${k}$ 时首项是 $${first.toLatex()}$`,
      ],
      [first.mul(r).div(Q.one.sub(r)), `This starts one term late, at $n = ${k + 1}$`, `这里晚了一项，从 $n = ${k + 1}$ 开始`],
      [
        first.div(Q.one.add(r)),
        "This divides by $1 + r$; the formula is $\\frac{a}{1 - r}$",
        "这里除以了 $1 + r$；公式是 $\\frac{a}{1 - r}$",
      ],
    ],
  );
}

/** twoGeometricSums splits a quotient into two geometric series. */
function twoGeometricSums(rng: Rng): Problem {
  const e = rng.int(3, 9);
  const b = rng.int(1, e - 1);
  let d = rng.int(1, e - 1);
  if (d === b) d = b === 1 ? 2 : b - 1;
  const minus = rng.bool();
  const op = minus ? "-" : "+";
  const piece = (x: number) => Q.of(e, e - x);
  const combine = (x: Q, y: Q) => (minus ? x.sub(y) : x.add(y));
  const answer = combine(piece(b), piece(d));
  const pw = (x: number) => (x === 1 ? "1" : `${x}^{n}`);
  const top = `${pw(b)} ${op} ${pw(d)}`;
  let total = 0;
  for (let n = 0; n <= 200; n++) total += (b / e) ** n + (minus ? -1 : 1) * (d / e) ** n;
  const ratio = (x: number) => `\\left(\\frac{${x}}{${e}}\\right)^{n}`;
  return numberWorked(
    t(`Find $${sigmaInf(`\\frac{${top}}{${e}^{n}}`, 0)}$.`, `求 $${sigmaInf(`\\frac{${top}}{${e}^{n}}`, 0)}$。`),
    answer,
    [
      step(
        "Split the quotient",
        "拆开商",
        t("Divide each power by the denominator:", "每个幂分别除以分母："),
        `\\frac{${top}}{${e}^{n}} = ${ratio(b)} ${op} ${ratio(d)}`,
      ),
      step(
        "Sum each series",
        "分别求和",
        t(
          `Both ratios are less than $1$ and each series starts with $1$ at $n = 0$:`,
          `两个公比都小于 $1$，每个级数在 $n = 0$ 时首项都是 $1$：`,
        ),
        `\\frac{1}{1 - \\frac{${b}}{${e}}} ${op} \\frac{1}{1 - \\frac{${d}}{${e}}} = ${piece(b).toLatex()} ${op} ${piece(d).toLatex()} = ${answer.toLatex()}`,
      ),
    ],
    t(
      `Add the terms numerically: the sum up to $n = 200$ is about $${approx(total)}$, matching $${near(answer)}$.`,
      `用数值相加：加到 $n = 200$ 约为 $${approx(total)}$，与 $${near(answer)}$ 一致。`,
    ),
    [
      [
        minus ? piece(b).add(piece(d)) : piece(b).sub(piece(d)),
        `This ${minus ? "adds" : "subtracts"} the second series; it is ${minus ? "subtracted" : "added"}`,
        `这里把第二个级数${minus ? "加上了" : "减去了"}；应当${minus ? "减去" : "加上"}`,
      ],
      [
        piece(b).mul(piece(d)),
        "This multiplies the two sums; the sums of the two series add",
        "这里把两个和相乘了；两个级数的和应当相加减",
      ],
      minus
        ? [
            Q.of(e, e - b + d),
            `This treats the terms as one geometric series with ratio $\\frac{${b} - ${d}}{${e}}$; $${b}^{n} - ${d}^{n}$ is not $(${b} - ${d})^{n}$`,
            `这里把各项当成了公比为 $\\frac{${b} - ${d}}{${e}}$ 的一个等比级数；$${b}^{n} - ${d}^{n}$ 不等于 $(${b} - ${d})^{n}$`,
          ]
        : [
            Q.of(b, e - b).add(Q.of(d, e - d)),
            "This starts both series at $n = 1$; at $n = 0$ each contributes a first term $1$",
            "这里让两个级数都从 $n = 1$ 开始；$n = 0$ 时每个级数都有首项 $1$",
          ],
    ],
  );
}

/** sumsOfInfiniteGeometricSeriesGivenInSigmaNotation finds the first term from the starting index. */
export const sumsOfInfiniteGeometricSeriesGivenInSigmaNotation: TopicDef = {
  id: "sums-of-infinite-geometric-series-given-in-sigma-notation",
  title: t("Sums of Infinite Geometric Series Given in Sigma Notation", "求和符号表示的无穷等比级数之和"),
  summary: t(
    "Read the first term from the starting index, then use S = a/(1 − r); split sums of geometric series.",
    "由起始下标读出首项，再用 S = a/(1 − r)；等比级数之和可以拆开求。",
  ),
  intro: t(
    "In sigma notation the first term comes from the starting index. In $\\sum_{n=2}^{\\infty} 4\\left(\\frac{1}{3}\\right)^{n}$ the first term is $4 \\cdot \\frac{1}{9} = \\frac{4}{9}$, so\n\n$$\\sum_{n=2}^{\\infty} 4\\left(\\frac{1}{3}\\right)^{n} = \\frac{4/9}{1 - \\frac{1}{3}} = \\frac{2}{3}.$$\n\nCheck: from $n = 0$ the sum would be $\\frac{4}{2/3} = 6$; taking away $4$ and $\\frac{4}{3}$ leaves $\\frac{2}{3}$.\n\nIn this lesson we sum geometric series written in sigma notation, also as sums of two geometric series.",
    "在求和符号中，首项由起始下标决定。在 $\\sum_{n=2}^{\\infty} 4\\left(\\frac{1}{3}\\right)^{n}$ 中，首项为 $4 \\cdot \\frac{1}{9} = \\frac{4}{9}$，所以\n\n$$\\sum_{n=2}^{\\infty} 4\\left(\\frac{1}{3}\\right)^{n} = \\frac{4/9}{1 - \\frac{1}{3}} = \\frac{2}{3}$$\n\n检验：若从 $n = 0$ 开始，和为 $\\frac{4}{2/3} = 6$；减去 $4$ 和 $\\frac{4}{3}$ 后得 $\\frac{2}{3}$。\n\n本课我们求用求和符号表示的等比级数之和，包括两个等比级数之和。",
  ),
  prerequisites: [
    "writing-an-infinite-geometric-series-in-sigma-notation",
    "sums-of-finite-geometric-series-given-in-sigma-notation",
    "properties-of-infinite-series",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-first-term-from-the-starting-index",
      title: t("The first term from the starting index", "由起始下标求首项"),
      explanation: t(
        "The formula for a geometric series uses its first term, so substitute the starting index to find that term before using the formula. In $\\sum_{n=k}^{\\infty} c \\, r^{n}$ the first term is $c \\, r^{k}$, not $c$. With $|r| < 1$:\n\n$$\\sum_{n=k}^{\\infty} c \\, r^{n} = \\frac{c \\, r^{k}}{1 - r}.$$\n\nFor example, $\\sum_{n=2}^{\\infty} 4\\left(\\frac{1}{3}\\right)^{n} = \\frac{4/9}{2/3} = \\frac{2}{3}$.\n\nCheck: $\\sum_{n=0}^{\\infty} 4\\left(\\frac{1}{3}\\right)^{n} = 6$, and $6 - 4 - \\frac{4}{3} = \\frac{2}{3}$.\n\n> **Watch out.** The first term is $c \\, r^{k}$, not $c$, unless the sum starts at $n = 0$.",
        "等比级数的求和公式用到首项，所以使用公式前要先代入起始下标求出首项。在 $\\sum_{n=k}^{\\infty} c \\, r^{n}$ 中，首项是 $c \\, r^{k}$ 而不是 $c$。当 $|r| < 1$ 时：\n\n$$\\sum_{n=k}^{\\infty} c \\, r^{n} = \\frac{c \\, r^{k}}{1 - r}$$\n\n例如 $\\sum_{n=2}^{\\infty} 4\\left(\\frac{1}{3}\\right)^{n} = \\frac{4/9}{2/3} = \\frac{2}{3}$。\n\n检验：$\\sum_{n=0}^{\\infty} 4\\left(\\frac{1}{3}\\right)^{n} = 6$，而 $6 - 4 - \\frac{4}{3} = \\frac{2}{3}$。\n\n> **注意。** 除非从 $n = 0$ 开始，首项是 $c \\, r^{k}$，不是 $c$。",
      ),
      generate: startingIndexSum,
    },
    {
      id: "sums-of-two-geometric-series",
      title: t("Splitting into two geometric series", "拆成两个等比级数"),
      explanation: t(
        "A quotient such as $\\frac{2^{n} + 3^{n}}{6^{n}}$ splits into two geometric terms, $\\left(\\frac{1}{3}\\right)^{n} + \\left(\\frac{1}{2}\\right)^{n}$. Each series converges, so the sum is the sum of the two sums:\n\n$$\\sum_{n=0}^{\\infty} \\frac{2^{n} + 3^{n}}{6^{n}} = \\frac{1}{1 - \\frac{1}{3}} + \\frac{1}{1 - \\frac{1}{2}} = \\frac{3}{2} + 2 = \\frac{7}{2}.$$\n\nCheck: the first terms $2 + \\frac{5}{6} + \\frac{13}{36} + \\frac{35}{216} \\approx 3.36$ are already close to $3.5$.\n\n> **Watch out.** The two sums add; they do not multiply: $\\frac{3}{2} \\cdot 2 = 3$ is not the sum.",
        "像 $\\frac{2^{n} + 3^{n}}{6^{n}}$ 这样的商可以拆成两个等比项 $\\left(\\frac{1}{3}\\right)^{n} + \\left(\\frac{1}{2}\\right)^{n}$。两个级数都收敛，所以总和等于两个和相加：\n\n$$\\sum_{n=0}^{\\infty} \\frac{2^{n} + 3^{n}}{6^{n}} = \\frac{1}{1 - \\frac{1}{3}} + \\frac{1}{1 - \\frac{1}{2}} = \\frac{3}{2} + 2 = \\frac{7}{2}$$\n\n检验：前几项 $2 + \\frac{5}{6} + \\frac{13}{36} + \\frac{35}{216} \\approx 3.36$，已经接近 $3.5$。\n\n> **注意。** 两个和相加，而不是相乘：$\\frac{3}{2} \\cdot 2 = 3$ 不是级数的和。",
      ),
      generate: twoGeometricSums,
    },
  ],
};

/** convergenceInterval finds where a geometric series in x converges. */
function seriesInterval(rng: Rng): Problem {
  const a = rng.int(1, 4);
  const b = rng.int(-9, 9);
  const k = rng.int(1, 9);
  const L = linear(a, b);
  const base = k === 1 ? `\\left(${L}\\right)^{n}` : `\\left(\\frac{${L}}{${k}}\\right)^{n}`;
  const lo = Q.of(-k - b, a);
  const hi = Q.of(k - b, a);
  const iv = (loClosed: boolean, hiClosed: boolean): Interval[] => [{ lo, hi, loClosed, hiClosed }];
  return intervalWorked(
    t(
      `For which values of $x$ does the series $${sigmaInf(base, 0)}$ converge? Give your answer in interval notation.`,
      `$x$ 取哪些值时级数 $${sigmaInf(base, 0)}$ 收敛？用区间表示。`,
    ),
    iv(false, false),
    [
      step(
        "Require |r| < 1",
        "要求 |r| < 1",
        t(
          "A geometric series converges exactly when its ratio has absolute value less than $1$:",
          "等比级数收敛当且仅当公比的绝对值小于 $1$：",
        ),
        `${-k} < ${L} < ${k}`,
      ),
      step(
        "Solve for x",
        "解出 x",
        t(
          a === 1 ? `Subtract $${b}$ throughout:` : `Subtract $${b}$ throughout, then divide by $${a}$:`,
          a === 1 ? `各部分同减 $${b}$：` : `各部分同减 $${b}$，再同除以 $${a}$：`,
        ),
        `${lo.toLatex()} < x < ${hi.toLatex()}`,
      ),
    ],
    t(
      `Test the ends: at $x = ${lo.toLatex()}$ the ratio is $-1$ and the terms are $(-1)^{n}$; at $x = ${hi.toLatex()}$ it is $1$ and every term is $1$. Neither tends to $0$, so both ends are excluded.`,
      `检验端点：$x = ${lo.toLatex()}$ 时公比为 $-1$，各项为 $(-1)^{n}$；$x = ${hi.toLatex()}$ 时公比为 $1$，每一项都是 $1$。两者都不趋于 $0$，所以两个端点都不包括。`,
    ),
    [
      [
        iv(false, true),
        `At $x = ${hi.toLatex()}$ the ratio is $1$ and every term is $1$, so the series diverges there`,
        `$x = ${hi.toLatex()}$ 时公比为 $1$，每一项都是 $1$，级数发散`,
      ],
      [
        iv(true, false),
        `At $x = ${lo.toLatex()}$ the ratio is $-1$; the terms $(-1)^{n}$ do not tend to $0$`,
        `$x = ${lo.toLatex()}$ 时公比为 $-1$；各项 $(-1)^{n}$ 不趋于 $0$`,
      ],
      [iv(true, true), "At both ends $|r| = 1$ and the terms do not tend to $0$", "两个端点处 $|r| = 1$，各项不趋于 $0$"],
      ...(k > 1
        ? [
            [
              [{ lo: Q.of(-1 - b, a), hi: Q.of(1 - b, a), loClosed: false, hiClosed: false }],
              `This forgets the divisor $${k}$: the ratio is $\\frac{${L}}{${k}}$`,
              `这里忘了除数 $${k}$：公比是 $\\frac{${L}}{${k}}$`,
            ] as Slot,
          ]
        : []),
    ],
  );
}

/** sumOfX writes the sum of a geometric series in x as a function of x. */
function sumOfX(rng: Rng): Problem {
  const c = rng.nonZero(-6, 6);
  const k = rng.int(2, 9);
  const start = rng.int(0, 1);
  const body = `${coefficientOf(c)}\\left(\\frac{x}{${k}}\\right)^{n}`;
  const answer = start === 0 ? `\\frac{${c * k}}{${k} - x}` : `\\frac{${term(c, "x")}}{${k} - x}`;
  const first = start === 0 ? `${c}` : term(c, `\\frac{x}{${k}}`);
  const half = k % 2 === 0 ? `${k / 2}` : `\\frac{${k}}{2}`;
  // At x = k/2 the ratio is 1/2, so the sum is twice the first term.
  const atHalf = start === 0 ? 2 * c : c;
  return functionWorked(
    {
      prompt: t(
        `For $-${k} < x < ${k}$, find the sum of $${sigmaInf(body, start)}$ as a function of $x$.`,
        `当 $-${k} < x < ${k}$ 时，求 $${sigmaInf(body, start)}$ 的和（表示为 $x$ 的函数）。`,
      ),
      answer,
      variable: "x",
    },
    [
      step(
        "Read the first term and the ratio",
        "读出首项和公比",
        t(
          `At $n = ${start}$ the first term is $${first}$, and the ratio is $r = \\frac{x}{${k}}$.`,
          `$n = ${start}$ 时首项为 $${first}$，公比 $r = \\frac{x}{${k}}$。`,
        ),
      ),
      step(
        "Apply the formula",
        "代入公式",
        t(`Multiply the numerator and the denominator by $${k}$:`, `分子分母同乘 $${k}$：`),
        `\\frac{${first}}{1 - \\frac{x}{${k}}} = ${answer}`,
      ),
    ],
    t(
      `Take $x = ${half}$, where the ratio is $\\frac{1}{2}$: the series is a geometric series with first term $${start === 0 ? c : Q.of(c, 2).toLatex()}$ and sum $${atHalf}$, and the answer gives $${atHalf}$ there too.`,
      `取 $x = ${half}$，此时公比为 $\\frac{1}{2}$：级数是首项为 $${start === 0 ? c : Q.of(c, 2).toLatex()}$ 的等比级数，和为 $${atHalf}$；答案在该处的值也是 $${atHalf}$。`,
    ),
    start === 0
      ? [
          [
            `\\frac{${c}}{${k} - x}`,
            `This leaves out the factor $${k}$ that comes from $1 - \\frac{x}{${k}} = \\frac{${k} - x}{${k}}$`,
            `这里漏了由 $1 - \\frac{x}{${k}} = \\frac{${k} - x}{${k}}$ 带来的因子 $${k}$`,
          ],
          [
            `\\frac{${c * k}}{${k} + x}`,
            "This divides by $1 + r$; the formula is $\\frac{a}{1 - r}$",
            "这里除以了 $1 + r$；公式是 $\\frac{a}{1 - r}$",
          ],
          [
            `\\frac{${term(c, "x")}}{${k} - x}`,
            `This is the sum from $n = 1$; from $n = 0$ the first term is $${c}$`,
            `这是从 $n = 1$ 开始的和；从 $n = 0$ 开始时首项是 $${c}$`,
          ],
        ]
      : [
          [
            `\\frac{${c * k}}{${k} - x}`,
            `This uses $${c}$ as the first term; at $n = 1$ the first term is $${first}$`,
            `这里把 $${c}$ 当成了首项；$n = 1$ 时首项是 $${first}$`,
          ],
          [
            `\\frac{${term(c, "x")}}{${k} + x}`,
            "This divides by $1 + r$; the formula is $\\frac{a}{1 - r}$",
            "这里除以了 $1 + r$；公式是 $\\frac{a}{1 - r}$",
          ],
        ],
  );
}

/** convergenceOfGeometricSeries finds where a geometric series in x converges and what it converges to. */
export const convergenceOfGeometricSeries: TopicDef = {
  id: "convergence-of-geometric-series",
  title: t("Convergence of Geometric Series", "等比级数的收敛性"),
  summary: t(
    "A geometric series converges exactly when |r| < 1; when r depends on x, this gives an interval of x and a sum that is a function of x.",
    "等比级数收敛当且仅当 |r| < 1；当 r 含 x 时，这给出 x 的一个区间，其和是 x 的函数。",
  ),
  intro: t(
    "When the ratio of a geometric series depends on $x$, the condition $|r| < 1$ picks out an interval of $x$. For $\\sum_{n=0}^{\\infty} \\left(\\frac{x + 1}{4}\\right)^{n}$, $-4 < x + 1 < 4$ gives $-5 < x < 3$, and there\n\n$$\\sum_{n=0}^{\\infty} \\left(\\frac{x + 1}{4}\\right)^{n} = \\frac{1}{1 - \\frac{x + 1}{4}} = \\frac{4}{3 - x}.$$\n\nCheck: at $x = 1$ the ratio is $\\frac{1}{2}$ and the series $1 + \\frac{1}{2} + \\frac{1}{4} + \\cdots$ sums to $2$, while $\\frac{4}{3 - 1} = 2$.\n\nIn this lesson we find where a geometric series in $x$ converges and write its sum as a function of $x$.",
    "当等比级数的公比含 $x$ 时，条件 $|r| < 1$ 确定了 $x$ 的一个区间。对 $\\sum_{n=0}^{\\infty} \\left(\\frac{x + 1}{4}\\right)^{n}$，由 $-4 < x + 1 < 4$ 得 $-5 < x < 3$，在此范围内\n\n$$\\sum_{n=0}^{\\infty} \\left(\\frac{x + 1}{4}\\right)^{n} = \\frac{1}{1 - \\frac{x + 1}{4}} = \\frac{4}{3 - x}$$\n\n检验：$x = 1$ 时公比为 $\\frac{1}{2}$，级数 $1 + \\frac{1}{2} + \\frac{1}{4} + \\cdots$ 的和为 $2$，而 $\\frac{4}{3 - 1} = 2$。\n\n本课我们求含 $x$ 的等比级数的收敛范围，并把它的和写成 $x$ 的函数。",
  ),
  prerequisites: ["sums-of-infinite-geometric-series-given-in-sigma-notation"],
  encompasses: [{ topic: "sums-of-infinite-geometric-series-given-in-sigma-notation", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "values-of-x-for-which-a-geometric-series-converges",
      title: t("Values of x for which a geometric series converges", "使等比级数收敛的 x"),
      explanation: t(
        "A geometric series $\\sum r^{n}$ converges when $|r| < 1$ and diverges when $|r| \\ge 1$ (its terms do not tend to $0$). Unlike the sequence $r^{n}$, the series diverges at $r = 1$. For $\\sum_{n=0}^{\\infty} \\left(\\frac{x + 1}{4}\\right)^{n}$: $-4 < x + 1 < 4$, so $-5 < x < 3$.\n\nCheck: at $x = 3$ every term is $1$, and at $x = -5$ the terms are $(-1)^{n}$; neither tends to $0$.\n\n> **Watch out.** Both ends are excluded, even $r = -1$, where the partial sums stay bounded but never settle.",
        "等比级数 $\\sum r^{n}$ 在 $|r| < 1$ 时收敛，在 $|r| \\ge 1$ 时发散（各项不趋于 $0$）。与数列 $r^{n}$ 不同，级数在 $r = 1$ 时发散。对 $\\sum_{n=0}^{\\infty} \\left(\\frac{x + 1}{4}\\right)^{n}$：$-4 < x + 1 < 4$，所以 $-5 < x < 3$。\n\n检验：$x = 3$ 时每一项都是 $1$，$x = -5$ 时各项为 $(-1)^{n}$；两者都不趋于 $0$。\n\n> **注意。** 两个端点都不包括，即使在 $r = -1$ 处部分和有界，它也不趋于定值。",
      ),
      generate: seriesInterval,
    },
    {
      id: "the-sum-as-a-function-of-x",
      title: t("The sum as a function of x", "和作为 x 的函数"),
      explanation: t(
        "For each value of the variable where the ratio is between minus one and one, the series converges, and its sum is given by the same formula in terms of the variable. Where it converges, a geometric series in $x$ has a sum given by $\\frac{a}{1 - r}$, which is a function of $x$:\n\n$$\\sum_{n=1}^{\\infty} 2\\left(\\frac{x}{3}\\right)^{n} = \\frac{2 \\cdot \\frac{x}{3}}{1 - \\frac{x}{3}} = \\frac{2x}{3 - x} \\quad \\text{for } -3 < x < 3.$$\n\nCheck: at $x = \\frac{3}{2}$ the series is $1 + \\frac{1}{2} + \\frac{1}{4} + \\cdots = 2$, and $\\frac{2 \\cdot 3/2}{3 - 3/2} = 2$.\n\n> **Watch out.** The formula holds only where the series converges: at $x = 6$ it gives $-4$, but the series diverges.",
        "对每个使公比介于 −1 和 1 之间的变量值，级数都收敛，它的和由同一个含变量的公式给出。在收敛的范围内，含 $x$ 的等比级数之和由 $\\frac{a}{1 - r}$ 给出，是 $x$ 的函数：\n\n$$\\sum_{n=1}^{\\infty} 2\\left(\\frac{x}{3}\\right)^{n} = \\frac{2 \\cdot \\frac{x}{3}}{1 - \\frac{x}{3}} = \\frac{2x}{3 - x}, \\quad -3 < x < 3$$\n\n检验：$x = \\frac{3}{2}$ 时级数为 $1 + \\frac{1}{2} + \\frac{1}{4} + \\cdots = 2$，而 $\\frac{2 \\cdot 3/2}{3 - 3/2} = 2$。\n\n> **注意。** 公式只在级数收敛的范围内成立：$x = 6$ 时它给出 $-4$，但级数发散。",
      ),
      generate: sumOfX,
    },
  ],
};

/** purelyRepeating converts a purely repeating decimal to a fraction. */
function purelyRepeating(rng: Rng): Problem {
  const k = rng.int(2, 3);
  const B = rng.int(1, 10 ** k - 2);
  const digits = String(B).padStart(k, "0");
  const den = 10 ** k - 1;
  const answer = Q.of(B, den);
  const reduced = answer.toLatex() === `\\frac{${B}}{${den}}` ? "" : ` = ${answer.toLatex()}`;
  return numberWorked(
    t(`Write $0.\\overline{${digits}}$ as a fraction in lowest terms.`, `把 $0.\\overline{${digits}}$ 写成最简分数。`),
    answer,
    [
      step(
        "Write it as a geometric series",
        "写成等比级数",
        t(
          `Each block of $${k}$ digits is $\\frac{1}{${10 ** k}}$ of the one before, so $a = \\frac{${B}}{${10 ** k}}$ and $r = \\frac{1}{${10 ** k}}$:`,
          `每个 $${k}$ 位的循环节是前一个的 $\\frac{1}{${10 ** k}}$，所以 $a = \\frac{${B}}{${10 ** k}}$，$r = \\frac{1}{${10 ** k}}$：`,
        ),
        `0.\\overline{${digits}} = \\frac{${B}}{10^{${k}}} + \\frac{${B}}{10^{${2 * k}}} + \\cdots`,
      ),
      step("Sum it", "求和", none, `\\frac{${B}/${10 ** k}}{1 - 1/${10 ** k}} = \\frac{${B}}{${den}}${reduced}`),
    ],
    t(
      `Shift the digits instead: if $x = 0.\\overline{${digits}}$, then $${10 ** k}x = ${B}.\\overline{${digits}}$, and subtracting gives $${den}x = ${B}$, so $x = \\frac{${B}}{${den}}${reduced}$.`,
      `改用移位相减：设 $x = 0.\\overline{${digits}}$，则 $${10 ** k}x = ${B}.\\overline{${digits}}$，相减得 $${den}x = ${B}$，所以 $x = \\frac{${B}}{${den}}${reduced}$。`,
    ),
    [
      [
        Q.of(B, 10 ** k),
        `This keeps only the first block $0.${digits}$; the digits repeat forever`,
        `这里只保留了第一个循环节 $0.${digits}$；这些数字是无限重复的`,
      ],
      [
        Q.of(10 * B, 9 * 10 ** k),
        `This uses the ratio $\\frac{1}{10}$; each block of $${k}$ digits is $\\frac{1}{${10 ** k}}$ of the one before`,
        `这里用了公比 $\\frac{1}{10}$；每个 $${k}$ 位的循环节是前一个的 $\\frac{1}{${10 ** k}}$`,
      ],
      [
        Q.of(B, 10 * den),
        `This is $0.0\\overline{${digits}}$: the repeat starts right after the decimal point`,
        `这是 $0.0\\overline{${digits}}$；循环节应紧接在小数点之后`,
      ],
    ],
  );
}

/** delayedRepeat converts a decimal whose repeat starts after one digit. */
function delayedRepeat(rng: Rng): Problem {
  const m = rng.int(1, 9);
  const k = rng.int(1, 2);
  let B = rng.int(1, 10 ** k - 2);
  if (k === 1 && B === m) B = m === 8 ? 7 : m + 1;
  const digits = String(B).padStart(k, "0");
  const tail = Q.of(B, 10 * (10 ** k - 1));
  const answer = Q.of(m, 10).add(tail);
  const big = 10 ** (k + 1);
  const whole = m * 10 ** k + B;
  return numberWorked(
    t(`Write $0.${m}\\overline{${digits}}$ as a fraction in lowest terms.`, `把 $0.${m}\\overline{${digits}}$ 写成最简分数。`),
    answer,
    [
      step(
        "Split off the digit before the repeat",
        "拆出循环节前的数字",
        none,
        `0.${m}\\overline{${digits}} = \\frac{${m}}{10} + 0.0\\overline{${digits}}`,
      ),
      step(
        "Sum the repeating part",
        "求循环部分的和",
        t(
          `It is geometric with $a = \\frac{${B}}{${big}}$ and $r = \\frac{1}{${10 ** k}}$:`,
          `它是 $a = \\frac{${B}}{${big}}$、$r = \\frac{1}{${10 ** k}}$ 的等比级数：`,
        ),
        `\\frac{${B}/${big}}{1 - 1/${10 ** k}} = ${tail.toLatex()}`,
      ),
      step("Add", "相加", none, `\\frac{${m}}{10} + ${tail.toLatex()} = ${answer.toLatex()}`),
    ],
    t(
      `Shift the digits instead: if $x = 0.${m}\\overline{${digits}}$, then $${big}x = ${whole}.\\overline{${digits}}$ and $10x = ${m}.\\overline{${digits}}$, so $${big - 10}x = ${whole} - ${m} = ${whole - m}$ and $x = \\frac{${whole - m}}{${big - 10}} = ${answer.toLatex()}$.`,
      `改用移位相减：设 $x = 0.${m}\\overline{${digits}}$，则 $${big}x = ${whole}.\\overline{${digits}}$，$10x = ${m}.\\overline{${digits}}$，所以 $${big - 10}x = ${whole} - ${m} = ${whole - m}$，$x = \\frac{${whole - m}}{${big - 10}} = ${answer.toLatex()}$。`,
    ),
    [
      [
        Q.of(whole, big - 1),
        `This repeats all the digits, as in $0.\\overline{${m}${digits}}$; only $${digits}$ repeats`,
        `这相当于 $0.\\overline{${m}${digits}}$，把所有数字都当成循环；只有 $${digits}$ 循环`,
      ],
      [
        Q.of(m, 10).add(Q.of(B, 10 ** k - 1)),
        `This adds $0.\\overline{${digits}}$; the repeating part is $0.0\\overline{${digits}}$, one place further right`,
        `这里加的是 $0.\\overline{${digits}}$；循环部分是 $0.0\\overline{${digits}}$，要再右移一位`,
      ],
      [
        Q.of(whole, big),
        `This keeps only $0.${m}${digits}$; the block $${digits}$ repeats forever`,
        `这里只保留了 $0.${m}${digits}$；循环节 $${digits}$ 是无限重复的`,
      ],
    ],
  );
}

/** repeatingDecimalsAsInfiniteGeometricSeries converts repeating decimals to fractions. */
export const repeatingDecimalsAsInfiniteGeometricSeries: TopicDef = {
  id: "repeating-decimals-as-infinite-geometric-series",
  title: t("Repeating Decimals as Infinite Geometric Series", "循环小数与无穷等比级数"),
  summary: t(
    "A repeating block of k digits is a geometric series with ratio 10⁻ᵏ, so every repeating decimal is a fraction.",
    "k 位的循环节构成公比为 10⁻ᵏ 的等比级数，所以每个循环小数都是分数。",
  ),
  intro: t(
    "A repeating decimal is an infinite geometric series in disguise:\n\n$$0.\\overline{27} = \\frac{27}{100} + \\frac{27}{100^{2}} + \\cdots = \\frac{27/100}{1 - 1/100} = \\frac{27}{99} = \\frac{3}{11}.$$\n\nCheck: dividing $3$ by $11$ gives $0.272727\\ldots$.\n\nIn this lesson we turn repeating decimals into fractions, also when the repeat starts after the first digit.",
    "循环小数其实是一个无穷等比级数：\n\n$$0.\\overline{27} = \\frac{27}{100} + \\frac{27}{100^{2}} + \\cdots = \\frac{27/100}{1 - 1/100} = \\frac{27}{99} = \\frac{3}{11}$$\n\n检验：$3$ 除以 $11$ 得 $0.272727\\ldots$。\n\n本课我们把循环小数化成分数，包括循环节不从第一位开始的情形。",
  ),
  prerequisites: ["finding-the-sum-of-an-infinite-geometric-series"],
  encompasses: [{ topic: "finding-the-sum-of-an-infinite-geometric-series", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "purely-repeating-decimals",
      title: t("Purely repeating decimals", "纯循环小数"),
      explanation: t(
        "A repeating decimal is a geometric series whose first term is the repeating block and whose ratio is a power of one tenth. $0.\\overline{27} = 0.27 + 0.0027 + 0.000027 + \\cdots$ is geometric with $a = \\frac{27}{100}$ and $r = \\frac{1}{100}$, so\n\n$$0.\\overline{27} = \\frac{27/100}{1 - 1/100} = \\frac{27}{99} = \\frac{3}{11}.$$\n\nIn general, a block of $k$ repeating digits $B$ gives $\\frac{B}{10^{k} - 1}$.\n\nCheck: $3 \\div 11 = 0.2727\\ldots$.\n\n> **Watch out.** The denominator is $99$, not $100$: $\\frac{27}{100} = 0.27$ keeps only the first block.",
        "循环小数是一个等比级数，首项是循环节，公比是十分之一的幂。$0.\\overline{27} = 0.27 + 0.0027 + 0.000027 + \\cdots$ 是 $a = \\frac{27}{100}$、$r = \\frac{1}{100}$ 的等比级数，所以\n\n$$0.\\overline{27} = \\frac{27/100}{1 - 1/100} = \\frac{27}{99} = \\frac{3}{11}$$\n\n一般地，$k$ 位循环节 $B$ 给出 $\\frac{B}{10^{k} - 1}$。\n\n检验：$3 \\div 11 = 0.2727\\ldots$。\n\n> **注意。** 分母是 $99$，不是 $100$：$\\frac{27}{100} = 0.27$ 只保留了第一个循环节。",
      ),
      generate: purelyRepeating,
    },
    {
      id: "decimals-with-a-delayed-repeat",
      title: t("Decimals whose repeat starts later", "循环节不从第一位开始的小数"),
      explanation: t(
        "Separate the digits that do not repeat, write the repeating part as a geometric series, and add the two fractions. Split off the digits before the repeat: $0.4\\overline{36} = \\frac{4}{10} + 0.0\\overline{36}$, and $0.0\\overline{36}$ is geometric with $a = \\frac{36}{1000}$ and $r = \\frac{1}{100}$:\n\n$$0.4\\overline{36} = \\frac{4}{10} + \\frac{36}{990} = \\frac{396 + 36}{990} = \\frac{24}{55}.$$\n\nCheck: $24 \\div 55 = 0.43636\\ldots$.\n\n> **Watch out.** Only $36$ repeats, so $\\frac{436}{999} = 0.\\overline{436}$ is a different number.",
        "把不循环的数字分出来，把循环部分写成等比级数，再把两个分数相加。先把循环节之前的数字拆出来：$0.4\\overline{36} = \\frac{4}{10} + 0.0\\overline{36}$，而 $0.0\\overline{36}$ 是 $a = \\frac{36}{1000}$、$r = \\frac{1}{100}$ 的等比级数：\n\n$$0.4\\overline{36} = \\frac{4}{10} + \\frac{36}{990} = \\frac{396 + 36}{990} = \\frac{24}{55}$$\n\n检验：$24 \\div 55 = 0.43636\\ldots$。\n\n> **注意。** 只有 $36$ 循环，所以 $\\frac{436}{999} = 0.\\overline{436}$ 是另一个数。",
      ),
      generate: delayedRepeat,
    },
  ],
};

/** calculusIISequenceTopics are the topics of Calculus II modules 4.17–4.20. */
export const calculusIISequenceTopics: readonly TopicDef[] = [
  limitsOfSequences,
  convergenceOfGeometricSequences,
  furtherConvergenceOfGeometricSequences,
  limitsOfSequencesWithFactorials,
  determiningLimitsOfSequencesUsingRelativeMagnitudes,
  furtherDeterminingLimitsOfSequencesUsingRelativeMagnitudes,
  monotonicSequences,
  identifyingMonotonicSequencesUsingDifferentiation,
  identifyingMonotonicSequencesUsingRatios,
  infiniteSeriesAndPartialSums,
  convergentAndDivergentInfiniteSeries,
  propertiesOfInfiniteSeries,
  furtherPropertiesOfInfiniteSeries,
  telescopingSeries,
  findingTheSumOfAnInfiniteGeometricSeries,
  writingAnInfiniteGeometricSeriesInSigmaNotation,
  sumsOfInfiniteGeometricSeriesGivenInSigmaNotation,
  convergenceOfGeometricSeries,
  repeatingDecimalsAsInfiniteGeometricSeries,
];
