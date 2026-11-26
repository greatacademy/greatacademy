import type { Rng, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";

import { numberProblem, why } from "../problems.ts";
import { walked } from "./calculus-i-differentiation.ts";
import { range } from "./methods-of-proof-common.ts";

// Discrete Mathematics unit 6: recurrence relations and generating functions.

/** term writes a signed multiple of a symbol, the first one without a leading plus. */
const term = (c: number | Q, sym: string, first = false) => {
  const q = typeof c === "number" ? Q.of(c) : c;
  if (q.isZero()) return "";
  const neg = q.sign() < 0;
  const abs = q.abs();
  const body = sym === "" ? abs.toLatex() : abs.eq(Q.of(1)) ? sym.replace(/^\\cdot /, "") : `${abs.toLatex()}${sym}`;
  return first ? `${neg ? "-" : ""}${body}` : ` ${neg ? "-" : "+"} ${body}`;
};

/** lin writes c₁s₁ + c₂s₂ + ⋯, skipping zero terms. */
const lin = (pairs: readonly (readonly [number | Q, string])[]) => {
  const nz = pairs.filter(([c]) => !(typeof c === "number" ? c === 0 : c.isZero()));
  return nz.length === 0 ? "0" : nz.map(([c, s], i) => term(c, s, i === 0)).join("");
};

/** pn writes an integer, in parentheses when negative. */
const pn = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** pq writes a rational, in parentheses when negative. */
const pq = (q: Q) => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());

/** asQ reads a number or a rational as a rational. */
const asQ = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v);

/** Mistake is a wrong value with what to say about it. */
type Mistake = ReturnType<typeof why>;

/** distinct keeps the first mistake for each value. */
const distinct = (ms: readonly Mistake[]) => ms.filter((m, i) => ms.findIndex((o) => asQ(o.value).eq(asQ(m.value))) === i);

/** cf writes a coefficient in front of a symbol: nothing for 1 and a minus sign for −1. */
const cf = (c: number) => (c === 1 ? "" : c === -1 ? "-" : `${c}`);

/** times writes c · body, dropping a coefficient of 1 or −1. */
const times = (c: number | Q, body: string) => {
  const q = asQ(c);
  if (body === "0") return "0";
  if (body === "1") return q.toLatex();
  if (body === "(-1)") return q.neg().toLatex();
  return q.eq(Q.of(1)) ? body : q.eq(Q.of(-1)) ? `-${body}` : `${q.toLatex()} \\cdot ${body}`;
};

/** minus writes a − b, and just a when b is 0. */
const minus = (a: number, b: number) => (b === 0 ? `${a}` : `${a} - ${pn(b)}`);

/** plus writes a + b with the sign of b folded in, and just a when b is 0. */
const plus = (a: number, b: number) => (b === 0 ? `${a}` : `${a} ${b < 0 ? "-" : "+"} ${Math.abs(b)}`);

/** by writes body · k, dropping a factor of 1 or −1. */
const by = (body: string, k: number | Q) => {
  const q = asQ(k);
  return q.eq(Q.of(1)) ? body : q.eq(Q.of(-1)) ? `-${body}` : `${body} \\cdot ${pq(q)}`;
};

/** chain joins the stages of a computation with equals signs, skipping a stage that repeats the one before. */
const chain = (...xs: readonly string[]) => xs.filter((x, i) => i === 0 || x !== xs[i - 1]).join(" = ");

/** signedN writes a number after a term, as " + 3" or " - 3", and nothing for 0. */
const signedN = (n: number | Q) => {
  const q = asQ(n);
  return q.isZero() ? "" : q.sign() < 0 ? ` - ${q.abs().toLatex()}` : ` + ${q.toLatex()}`;
};

/** pw writes a power of an integer, without an exponent of 1. */
const pw = (r: number, e: number) => (e === 1 ? pn(r) : `${pn(r)}^{${e}}`);

/** iterate computes a_N of a_n = p a_{n−1} + q a_{n−2} + f(n) from a₀ and a₁. */
const iterate = (a0: Q, a1: Q, p: number, q: number, f: (n: number) => Q, N: number) => {
  const a = [a0, a1];
  for (let n = 2; n <= N; n++)
    a.push(
      Q.of(p)
        .mul(a[n - 1]!)
        .add(Q.of(q).mul(a[n - 2]!))
        .add(f(n)),
    );
  return a;
};

/** iterate1 computes a₀, …, a_N of a_n = r a_{n−1} + f(n). */
const iterate1 = (a0: Q, r: number | Q, f: (n: number) => Q, N: number) => {
  const a = [a0];
  const rq = typeof r === "number" ? Q.of(r) : r;
  for (let n = 1; n <= N; n++) a.push(rq.mul(a[n - 1]!).add(f(n)));
  return a;
};

/** zero is the zero forcing term. */
const zero = () => Q.of(0);

/** RATIOS are nonzero integer ratios other than 1. */
const RATIOS = [-3, -2, -1, 2, 3, 4, 5] as const;

/** introductionToRecurrenceRelations computes terms of recurrences and reads their order. */
export const introductionToRecurrenceRelations: TopicDef = {
  id: "introduction-to-recurrence-relations",
  title: t("Introduction to Recurrence Relations", "递推关系简介"),
  summary: t(
    "A recurrence relation defines each term from earlier ones; its order is how far back it reaches. With enough initial terms, it determines the whole sequence.",
    "递推关系由前面的项确定每一项；它的阶是向前追溯的最远距离。给定足够的初始项，它就确定了整个数列。",
  ),
  intro: t(
    "The rule $a_n = 4a_{n-1} - a_{n-2}$ with $a_0 = 1$ and $a_1 = 5$ builds the sequence $1, 5, 19, 71, 265, \\dots$ one term at a time, each from the two before it.\n\nCheck: $4 \\cdot 71 - 19 = 284 - 19 = 265$, so the last term listed follows from the two before it.\n\nIn this lesson we compute terms of a sequence from a recurrence relation and its initial terms, and read off the order of a recurrence.",
    "规则 $a_n = 4a_{n-1} - a_{n-2}$ 配上 $a_0 = 1$、$a_1 = 5$，逐项生成数列 $1, 5, 19, 71, 265, \\dots$，每一项都由它前面两项得到。\n\n检验：$4 \\cdot 71 - 19 = 284 - 19 = 265$，所以列出的最后一项确实由它前面两项得到。\n\n本课我们由递推关系和初始项计算数列的各项，并读出递推关系的阶。",
  ),
  prerequisites: ["recursive-sequences"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "computing-terms-from-a-recurrence-relation",
      title: t("Computing terms", "计算各项"),
      explanation: t(
        "A recurrence gives each term from the ones before it, so start from the given initial terms and apply the rule one step at a time. If $a_n = 2a_{n-1} - a_{n-2} + 7$ with $a_0 = 1$, $a_1 = 2$, then $a_2 = 4 - 1 + 7 = 10$, $a_3 = 20 - 2 + 7 = 25$ and $a_4 = 50 - 10 + 7 = 47$.\n\n> **Watch out.** Each new term uses the two terms just before it: $a_3$ is built from $a_2$ and $a_1$, not from $a_1$ and $a_0$. Keep the list of terms and add one term at a time.",
        "递推关系由前面的项给出每一项，所以从给定的初始项开始，一步一步地应用这个规则。若 $a_n = 2a_{n-1} - a_{n-2} + 7$，$a_0 = 1$，$a_1 = 2$，则 $a_2 = 4 - 1 + 7 = 10$，$a_3 = 20 - 2 + 7 = 25$，$a_4 = 50 - 10 + 7 = 47$。\n\n> **注意。** 每个新项用的是紧挨在它前面的两项：$a_3$ 由 $a_2$ 和 $a_1$ 得到，而不是由 $a_1$ 和 $a_0$。把各项列成一行，每次只添一项。",
      ),
      generate(rng) {
        const p = rng.nonZero(-3, 3);
        const q = rng.nonZero(-3, 3);
        const c = rng.int(-4, 4);
        const a0 = rng.int(-3, 4);
        const a1 = rng.int(-3, 4);
        const N = rng.int(4, 5);
        const a = iterate(Q.of(a0), Q.of(a1), p, q, () => Q.of(c), N);
        const rec = lin([
          [p, "a_{n-1}"],
          [q, "a_{n-2}"],
          [c, ""],
        ]);
        const step = (n: number) =>
          `a_{${n}} = ${chain(
            lin([
              [p, `a_{${n - 1}}`],
              [q, `a_{${n - 2}}`],
              [c, ""],
            ]),
            lin([
              [a[n - 1]!.mul(Q.of(p)), ""],
              [a[n - 2]!.mul(Q.of(q)), ""],
              [c, ""],
            ]),
            a[n]!.toLatex(),
          )}`;
        const steps = range(2, N).map((n) => `$${step(n)}$`);
        const back = lin([
          [a[N]!, ""],
          [a[N - 1]!.mul(Q.of(-p)), ""],
          [-c, ""],
        ]);
        const undo = q === 1 ? back : q === -1 ? `-(${back})` : `\\frac{${back}}{${q}}`;
        return numberProblem({
          prompt: t(
            `A sequence satisfies $a_n = ${rec}$ for $n \\ge 2$, with $a_0 = ${a0}$ and $a_1 = ${a1}$. Find $a_{${N}}$.`,
            `数列满足 $a_n = ${rec}$（$n \\ge 2$），且 $a_0 = ${a0}$，$a_1 = ${a1}$。求 $a_{${N}}$。`,
          ),
          answer: a[N]!,
          mistakes: distinct([
            why(
              a[N - 1]!,
              `That is $a_{${N - 1}}$; the rule has to be applied once more to reach $a_{${N}}$.`,
              `那是 $a_{${N - 1}}$；还要再用一次递推才能得到 $a_{${N}}$。`,
            ),
            why(
              iterate(Q.of(a0), Q.of(a1), p, q, () => Q.of(c), N + 1)[N + 1]!,
              `That is $a_{${N + 1}}$: the rule was applied one time too many.`,
              `那是 $a_{${N + 1}}$：递推多用了一次。`,
            ),
            why(
              iterate(Q.of(a1), Q.of(a0), p, q, () => Q.of(c), N)[N]!,
              "That swaps $a_0$ and $a_1$, so every later term comes out wrong.",
              "那是把 $a_0$ 和 $a_1$ 交换了，于是后面每一项都错了。",
            ),
            why(
              iterate(Q.of(a0), Q.of(a1), p, q, zero, N)[N]!,
              "That leaves out the constant term, which is added at every step.",
              "那是漏掉了常数项，而它每一步都要加上。",
            ),
          ]),
          solution: walked(
            [
              [["Start from the initial terms", "从初始项开始"], t(`$a_0 = ${a0}$ and $a_1 = ${a1}$.`, `$a_0 = ${a0}$，$a_1 = ${a1}$。`)],
              [["Apply the rule one step at a time", "逐步应用递推"], t(`${steps.join("; ")}.`, `${steps.join("；")}。`)],
            ],
            t(
              `Going back from the last two terms, $${chain(undo, a[N - 2]!.toLatex())}$, which is $a_{${N - 2}}$ again.`,
              `由最后两项倒推，$${chain(undo, a[N - 2]!.toLatex())}$，又得到 $a_{${N - 2}}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-order-of-a-recurrence-relation",
      title: t("The order of a recurrence", "递推关系的阶"),
      explanation: t(
        "The order of a recurrence is how far back it reaches, which is also how many initial terms it needs. $a_n = a_{n-1} + 5a_{n-3}$ reaches back to $a_{n-3}$, so it has order $3$ and needs the three initial terms $a_0$, $a_1$ and $a_2$.\n\n> **Watch out.** Count how far back the earliest term lies, not how many terms there are: $a_n = a_{n-1} + 5a_{n-3}$ has two terms but order $3$. A constant or a multiple of $n$ does not change the order.",
        "递推关系的阶是它向前追溯的距离，也就是它需要的初始项个数。$a_n = a_{n-1} + 5a_{n-3}$ 追溯到 $a_{n-3}$，所以它是 $3$ 阶的，需要 $a_0$、$a_1$、$a_2$ 三个初始项。\n\n> **注意。** 要看最早一项追溯多远，而不是有几项：$a_n = a_{n-1} + 5a_{n-3}$ 只有两项，但阶是 $3$。常数项或 $n$ 的倍数不改变阶。",
      ),
      generate(rng) {
        const order = rng.int(1, 5);
        const others = rng.sample(range(1, order - 1), rng.int(0, Math.min(2, order - 1)));
        const lags = [...others, order].sort((a, b) => a - b);
        const cs = lags.map(() => rng.nonZero(-4, 4));
        const c = rng.int(-3, 6);
        const rec = lin([...lags.map((l, i) => [cs[i]!, `a_{n-${l}}`] as const), [c, rng.bool() ? "" : "n"]]);
        const askInitial = rng.bool();
        const used = lags.map((l) => `$a_{n-${l}}$`);
        const init = order === 1 ? "$a_0$" : order === 2 ? "$a_0$ and $a_1$" : `$a_0, \\dots, a_{${order - 1}}$`;
        const initZh = order === 1 ? "$a_0$" : order === 2 ? "$a_0$ 和 $a_1$" : `$a_0, \\dots, a_{${order - 1}}$`;
        return numberProblem({
          prompt: askInitial
            ? t(
                `How many initial terms are needed to determine every term of a sequence satisfying $a_n = ${rec}$?`,
                `满足 $a_n = ${rec}$ 的数列需要多少个初始项才能确定所有项？`,
              )
            : t(`What is the order of the recurrence relation $a_n = ${rec}$?`, `递推关系 $a_n = ${rec}$ 的阶是多少？`),
          answer: order,
          mistakes: distinct([
            why(
              lags.length,
              "That counts the terms of the sequence on the right; the order is how far back the earliest one lies.",
              "那是右边数列项的个数；阶是最早一项向前追溯的距离。",
            ),
            why(
              order + 1,
              `That counts one too many: $a_{n-${order}}$ is $${order}$ back from $a_n$, not $${order + 1}$.`,
              `多数了一个：$a_{n-${order}}$ 比 $a_n$ 早 $${order}$ 项，而不是 $${order + 1}$ 项。`,
            ),
            why(
              order - 1,
              `That stops one short of the earliest term $a_{n-${order}}$.`,
              `那是少数了一个，没有数到最早的一项 $a_{n-${order}}$。`,
            ),
            why(
              lags.length + (c === 0 ? 0 : 1),
              "That counts every term on the right, including the one that is not a term of the sequence.",
              "那是把右边所有的项都数进去了，连不是数列项的那一项也算上了。",
            ),
          ]),
          solution: walked(
            [
              [["List the terms used", "列出用到的项"], t(`The right side uses ${used.join(", ")}.`, `右边用到 ${used.join("、")}。`)],
              [
                ["Take the earliest one", "取最早的一项"],
                t(
                  `The earliest is $a_{n-${order}}$, so the order is $${order}$${askInitial ? `, and the initial terms ${init} must be given` : ""}.`,
                  `最早的是 $a_{n-${order}}$，所以阶为 $${order}$${askInitial ? `，必须给出初始项 ${initZh}` : ""}。`,
                ),
              ],
            ],
            t(
              `The rule first applies at $n = ${order}$, where $a_{n-${order}}$ is $a_0$; for a smaller $n$ it would need a term before $a_0$.`,
              `递推从 $n = ${order}$ 开始适用，此时 $a_{n-${order}}$ 就是 $a_0$；$n$ 更小时就要用到 $a_0$ 之前的项。`,
            ),
          ),
        });
      },
    },
  ],
};

/** firstOrderRecurrenceRelations solves aₙ = r aₙ₋₁ + d. */
export const firstOrderRecurrenceRelations: TopicDef = {
  id: "first-order-recurrence-relations",
  title: t("First-Order Recurrence Relations", "一阶递推关系"),
  summary: t(
    "aₙ = r aₙ₋₁ has solution aₙ = a₀rⁿ. For aₙ = r aₙ₋₁ + d with r ≠ 1, the constant p = d/(1 − r) is a fixed point and aₙ = (a₀ − p)rⁿ + p.",
    "aₙ = r aₙ₋₁ 的解为 aₙ = a₀rⁿ。对 aₙ = r aₙ₋₁ + d（r ≠ 1），常数 p = d/(1 − r) 是不动点，且 aₙ = (a₀ − p)rⁿ + p。",
  ),
  intro: t(
    "The recurrence $a_n = 6a_{n-1} - 5$ with $a_0 = 3$ has the fixed point $1$, since $1 = 6 \\cdot 1 - 5$. The distance from $1$ is multiplied by $6$ at each step, so $a_n = 2 \\cdot 6^n + 1$: the terms are $3, 13, 73, 433, \\dots$\n\nCheck: the rule gives $6 \\cdot 73 - 5 = 433$, and the formula gives $2 \\cdot 216 + 1 = 433$.\n\nIn this lesson we solve the first-order recurrences $a_n = ra_{n-1}$ and $a_n = ra_{n-1} + d$, and find where such a sequence ends up when $|r| < 1$.",
    "递推 $a_n = 6a_{n-1} - 5$，$a_0 = 3$，有不动点 $1$，因为 $1 = 6 \\cdot 1 - 5$。到 $1$ 的距离每一步都乘以 $6$，所以 $a_n = 2 \\cdot 6^n + 1$：各项是 $3, 13, 73, 433, \\dots$\n\n检验：由递推得 $6 \\cdot 73 - 5 = 433$，由公式得 $2 \\cdot 216 + 1 = 433$。\n\n本课我们解一阶递推 $a_n = ra_{n-1}$ 和 $a_n = ra_{n-1} + d$，并求 $|r| < 1$ 时这样的数列最终趋于何处。",
  ),
  prerequisites: ["introduction-to-recurrence-relations", "recursive-formulas-for-geometric-sequences"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "solving-homogeneous-first-order-recurrences",
      title: t("$a_n = r a_{n-1}$", "$a_n = r a_{n-1}$"),
      explanation: t(
        "Multiplying by the same ratio at each step makes the sequence geometric, so each term is the given term times a power of the ratio. $a_n = 7a_{n-1}$ with $a_0 = 2$ multiplies by $7$ at each step, so $a_n = 2 \\cdot 7^n$ and $a_4 = 2 \\cdot 2401 = 4802$.\n\n> **Watch out.** The exponent counts the steps from the given term: from $a_0$ to $a_4$ is $4$ steps, so the power is $7^4$, not $7^5$. If the given term is $a_1$, the exponent is $n - 1$.",
        "每一步都乘以相同的比，数列就是等比数列，所以每一项都是给定的项乘以比的幂。$a_n = 7a_{n-1}$，$a_0 = 2$，每一步乘以 $7$，所以 $a_n = 2 \\cdot 7^n$，$a_4 = 2 \\cdot 2401 = 4802$。\n\n> **注意。** 指数是从给定的项数起的步数：从 $a_0$ 到 $a_4$ 是 $4$ 步，所以幂是 $7^4$，不是 $7^5$。如果给定的是 $a_1$，指数就是 $n - 1$。",
      ),
      generate(rng) {
        const r = rng.pick(RATIOS);
        const a0 = rng.nonZero(-5, 5);
        const start = rng.int(0, 1);
        const N = rng.int(5, 9);
        const value = Q.of(a0).mul(Q.of(r).pow(N - start));
        const k = N - start;
        const prev = a0 * r ** (k - 1);
        const sign = r ** k > 0 ? ["positive", "正"] : ["negative", "负"];
        return numberProblem({
          prompt: t(
            `$a_n = ${term(r, "a_{n-1}", true)}$ for $n \\ge ${start + 1}$, and $a_{${start}} = ${a0}$. Find $a_{${N}}$.`,
            `$a_n = ${term(r, "a_{n-1}", true)}$（$n \\ge ${start + 1}$），且 $a_{${start}} = ${a0}$。求 $a_{${N}}$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              Q.of(a0).mul(Q.of(r).pow(k + 1)),
              `That uses one factor of $${r}$ too many: from $a_{${start}}$ to $a_{${N}}$ there are $${k}$ steps.`,
              `那是多乘了一个 $${r}$：从 $a_{${start}}$ 到 $a_{${N}}$ 共 $${k}$ 步。`,
            ),
            why(
              Q.of(a0).mul(Q.of(r).pow(k - 1)),
              `That uses one factor of $${r}$ too few: from $a_{${start}}$ to $a_{${N}}$ there are $${k}$ steps.`,
              `那是少乘了一个 $${r}$：从 $a_{${start}}$ 到 $a_{${N}}$ 共 $${k}$ 步。`,
            ),
            why(
              Q.of(a0 * r * k),
              `That multiplies by the ratio and by the number of steps; repeated multiplication is a power, $${pw(r, k)}$.`,
              `那是乘以比再乘以步数；反复相乘应该是幂 $${pw(r, k)}$。`,
            ),
            why(value.neg(), `The sign is off: $${pw(r, k)}$ is ${sign[0]}.`, `符号错了：$${pw(r, k)}$ 是${sign[1]}的。`),
          ]),
          solution: walked(
            [
              [
                ["Write the closed form", "写出通项"],
                t(
                  `Each step multiplies by $${r}$, so $a_n = ${times(a0, `${pn(r)}^{${start === 0 ? "n" : "n - 1"}}`)}$.`,
                  `每一步乘以 $${r}$，所以 $a_n = ${times(a0, `${pn(r)}^{${start === 0 ? "n" : "n - 1"}}`)}$。`,
                ),
              ],
              [
                [`Put $n = ${N}$`, `代入 $n = ${N}$`],
                t(
                  `$a_{${N}} = ${chain(times(a0, pw(r, k)), times(a0, pn(r ** k)), value.toLatex())}$.`,
                  `$a_{${N}} = ${chain(times(a0, pw(r, k)), times(a0, pn(r ** k)), value.toLatex())}$。`,
                ),
              ],
            ],
            t(
              `The term before is $a_{${N - 1}} = ${prev}$, and $${times(r, pn(prev))} = ${value.toLatex()}$ is one more step of the rule.`,
              `前一项是 $a_{${N - 1}} = ${prev}$，再用一次递推，$${times(r, pn(prev))} = ${value.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-first-order-recurrences-with-a-constant",
      title: t("$a_n = r a_{n-1} + d$", "$a_n = r a_{n-1} + d$"),
      explanation: t(
        "Shifting the sequence by its fixed point removes the constant, so the shifted sequence is geometric. For $a_n = 7a_{n-1} - 18$ with $a_0 = 5$, the fixed point solves $B = 7B - 18$, so $B = 3$. Then $a_n - 3 = 7(a_{n-1} - 3)$, and $a_n = 2 \\cdot 7^n + 3$.\n\n> **Watch out.** $B$ is the fixed point $\\frac{d}{1 - r}$, not $d$ itself. And $A = a_0 - B$, not $a_0$, because at $n = 0$ both parts of $A \\cdot r^n + B$ count.",
        "把数列减去它的不动点就去掉了常数项，于是平移后的数列是等比的。对 $a_n = 7a_{n-1} - 18$，$a_0 = 5$：不动点满足 $B = 7B - 18$，所以 $B = 3$。于是 $a_n - 3 = 7(a_{n-1} - 3)$，$a_n = 2 \\cdot 7^n + 3$。\n\n> **注意。** $B$ 是不动点 $\\frac{d}{1 - r}$，不是 $d$ 本身。而 $A = a_0 - B$，不是 $a_0$，因为 $n = 0$ 时 $A \\cdot r^n + B$ 的两部分都要算上。",
      ),
      generate(rng) {
        const r = rng.pick(RATIOS.filter((x) => x !== -1));
        const p = rng.int(-6, 6);
        const d = p * (1 - r);
        const A = rng.nonZero(-4, 4);
        const a0 = A + p;
        const askB = rng.bool();
        const rec = lin([
          [r, "a_{n-1}"],
          [d, ""],
        ]);
        const a1 = r * a0 + d;
        return numberProblem({
          prompt: t(
            `$a_n = ${rec}$ for $n \\ge 1$, with $a_0 = ${a0}$. The solution has the form $a_n = A \\cdot ${pn(r)}^n + B$. Find $${askB ? "B" : "A"}$.`,
            `$a_n = ${rec}$（$n \\ge 1$），$a_0 = ${a0}$。解的形式为 $a_n = A \\cdot ${pn(r)}^n + B$。求 $${askB ? "B" : "A"}$。`,
          ),
          answer: askB ? p : A,
          mistakes: distinct(
            askB
              ? [
                  why(
                    d,
                    "That is the constant $d$ itself; $B$ is the fixed point, which solves $B = rB + d$.",
                    "那是常数 $d$ 本身；$B$ 是不动点，满足 $B = rB + d$。",
                  ),
                  why(-p, "The sign is off: $B = rB + d$ gives $(1 - r)B = d$.", "符号错了：$B = rB + d$ 得 $(1 - r)B = d$。"),
                  why(a0, "That is $a_0$; $B$ is the value the shifted sequence is measured from.", "那是 $a_0$；$B$ 是平移所用的那个值。"),
                  why(A, "That is $A$, the coefficient of the power.", "那是幂前面的系数 $A$。"),
                ]
              : [
                  why(a0, "That is $a_0$; subtract the fixed point $B$ to get $A$.", "那是 $a_0$；要减去不动点 $B$ 才得到 $A$。"),
                  why(a0 + p, "That adds $B$ to $a_0$ instead of subtracting it.", "那是把 $B$ 加到 $a_0$ 上，而不是减去。"),
                  why(p, "That is $B$, the fixed point.", "那是不动点 $B$。"),
                  why(-A, "The sign is off; at $n = 0$, $A + B = a_0$.", "符号错了；$n = 0$ 时 $A + B = a_0$。"),
                ],
          ),
          solution: walked(
            [
              [
                ["Find the fixed point", "求不动点"],
                t(
                  `$B = ${term(r, "B", true)}${signedN(d)}$ gives $${term(1 - r, "B", true)} = ${d}$, so $B = ${p}$.`,
                  `由 $B = ${term(r, "B", true)}${signedN(d)}$ 得 $${term(1 - r, "B", true)} = ${d}$，所以 $B = ${p}$。`,
                ),
              ],
              [
                ["Use the initial value", "利用初值"],
                t(
                  `At $n = 0$, $A + B = ${a0}$, so $A = ${chain(minus(a0, p), String(A))}$.`,
                  `$n = 0$ 时 $A + B = ${a0}$，所以 $A = ${chain(minus(a0, p), String(A))}$。`,
                ),
              ],
            ],
            t(
              `The rule gives $a_1 = ${chain(`${times(r, pn(a0))}${signedN(d)}`, String(a1))}$, and the formula gives $${chain(`${times(A, pn(r))}${signedN(p)}`, String(a1))}$.`,
              `由递推得 $a_1 = ${chain(`${times(r, pn(a0))}${signedN(d)}`, String(a1))}$，由公式得 $${chain(`${times(A, pn(r))}${signedN(p)}`, String(a1))}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** firstOrderRecurrenceRelationsWithPolynomialForcing solves aₙ = r aₙ₋₁ + f(n) with f polynomial. */
export const firstOrderRecurrenceRelationsWithPolynomialForcing: TopicDef = {
  id: "first-order-recurrence-relations-with-polynomial-forcing",
  title: t("First-Order Recurrence Relations With Polynomial Forcing", "多项式强迫项的一阶递推关系"),
  summary: t(
    "For aₙ = r aₙ₋₁ + f(n) with f a polynomial and r ≠ 1, try a particular solution that is a polynomial of the same degree; the general solution adds Arⁿ. If r = 1, then aₙ = a₀ + Σₖ₌₁ⁿ f(k).",
    "对 aₙ = r aₙ₋₁ + f(n)（f 为多项式，r ≠ 1），设一个同次多项式作为特解；通解再加上 Arⁿ。若 r = 1，则 aₙ = a₀ + Σₖ₌₁ⁿ f(k)。",
  ),
  intro: t(
    "The recurrence $a_n = a_{n-1} + 6n$ with $a_0 = 0$ adds $6, 12, 18, 24, \\dots$ in turn, so $a_n = 6(1 + 2 + \\dots + n) = 3n(n + 1)$ and the terms are $0, 6, 18, 36, 60, \\dots$\n\nCheck: $36 + 6 \\cdot 4 = 60$, and the formula gives $3 \\cdot 4 \\cdot 5 = 60$.\n\nIn this lesson we solve first-order recurrences forced by a polynomial in $n$: we find polynomial particular solutions, add up the forcing when the ratio is $1$, and fix the remaining constant from the start.",
    "递推 $a_n = a_{n-1} + 6n$，$a_0 = 0$，依次加上 $6, 12, 18, 24, \\dots$，所以 $a_n = 6(1 + 2 + \\dots + n) = 3n(n + 1)$，各项是 $0, 6, 18, 36, 60, \\dots$\n\n检验：$36 + 6 \\cdot 4 = 60$，由公式得 $3 \\cdot 4 \\cdot 5 = 60$。\n\n本课我们解强迫项是 $n$ 的多项式的一阶递推：求多项式特解，在比为 $1$ 时把强迫项加起来，并由初值确定剩下的常数。",
  ),
  prerequisites: ["first-order-recurrence-relations", "finite-linear-series"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "polynomial-particular-solutions",
      title: t("Polynomial particular solutions", "多项式特解"),
      explanation: t(
        "When the forcing term is a polynomial, try a polynomial of the same degree and match the coefficients of each power of $n$. For $a_n = 5a_{n-1} + 8n + 2$, try $cn + e$: $cn + e = 5(c(n - 1) + e) + 8n + 2$. The $n$ terms give $c = 5c + 8$, so $c = -2$. The constants give $e = -5c + 5e + 2 = 5e + 12$, so $-4e = 12$ and $e = -3$.\n\n> **Watch out.** Expand $c(n - 1)$ before matching: the shift brings $-rc$ into the constants, so $e$ is not just the constant term divided by $1 - r$.",
        "当强迫项是多项式时，尝试同次数的多项式，再比较 $n$ 的各次幂的系数。对 $a_n = 5a_{n-1} + 8n + 2$，设 $cn + e$：$cn + e = 5(c(n - 1) + e) + 8n + 2$。比较 $n$ 的系数：$c = 5c + 8$，所以 $c = -2$。比较常数项：$e = -5c + 5e + 2 = 5e + 12$，所以 $-4e = 12$，$e = -3$。\n\n> **注意。** 比较之前先展开 $c(n - 1)$：这个平移把 $-rc$ 带进常数项，所以 $e$ 并不只是常数项除以 $1 - r$。",
      ),
      generate(rng) {
        const r = rng.pick([-3, -2, -1, 2, 3, 4]);
        const alpha = rng.nonZero(-6, 6);
        const beta = rng.int(-6, 6);
        const c = Q.of(alpha, 1 - r);
        const e = Q.of(beta)
          .sub(c.mul(Q.of(r)))
          .div(Q.of(1 - r));
        const askE = rng.bool();
        const rec = lin([
          [r, "a_{n-1}"],
          [alpha, "n"],
          [beta, ""],
        ]);
        const rhs = Q.of(beta).sub(c.mul(Q.of(r)));
        return numberProblem({
          prompt: t(
            `$a_n = ${rec}$ has a particular solution of the form $a_n = cn + e$. Find $${askE ? "e" : "c"}$.`,
            `$a_n = ${rec}$ 有形如 $a_n = cn + e$ 的特解。求 $${askE ? "e" : "c"}$。`,
          ),
          answer: askE ? e : c,
          mistakes: distinct(
            askE
              ? [
                  why(
                    Q.of(beta, 1 - r),
                    "That leaves out the $-rc$ that $r \\cdot c(n - 1)$ brings to the constants.",
                    "那是漏掉了 $r \\cdot c(n - 1)$ 带进常数项的 $-rc$。",
                  ),
                  why(
                    Q.of(beta)
                      .add(c.mul(Q.of(r)))
                      .div(Q.of(1 - r)),
                    "That takes the shifted term as $+rc$ in the constants; the $-1$ in $c(n - 1)$ makes it $-rc$.",
                    "那是把平移项在常数中算成了 $+rc$；$c(n - 1)$ 中的 $-1$ 使它成为 $-rc$。",
                  ),
                  why(e.neg(), "The sign is off; solve $(1 - r)e = \\beta - rc$ again.", "符号错了；重新解 $(1 - r)e = \\beta - rc$。"),
                ]
              : [
                  why(
                    Q.of(alpha, r - 1),
                    "The sign is off: $c = rc + \\alpha$ gives $(1 - r)c = \\alpha$.",
                    "符号错了：$c = rc + \\alpha$ 得 $(1 - r)c = \\alpha$。",
                  ),
                  why(Q.of(alpha).mul(Q.of(1 - r)), "That multiplies by $1 - r$ instead of dividing.", "那是乘以 $1 - r$，而不是除以它。"),
                  why(
                    Q.of(alpha),
                    "That is the coefficient of $n$ in the forcing term; $c$ must also balance the $rc$ from the shifted term.",
                    "那是强迫项中 $n$ 的系数；$c$ 还要抵消平移项带来的 $rc$。",
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Substitute the trial solution", "代入试探解"],
                t(
                  `$cn + e = ${r === -1 ? "-" : r}(c(n - 1) + e)${term(alpha, "n")}${term(beta, "")}$.`,
                  `$cn + e = ${r === -1 ? "-" : r}(c(n - 1) + e)${term(alpha, "n")}${term(beta, "")}$。`,
                ),
              ],
              [
                ["Match the coefficients of $n$", "比较 $n$ 的系数"],
                t(
                  `$c = ${term(r, "c", true)}${term(alpha, "")}$, so $${term(1 - r, "c", true)} = ${alpha}$ and $c = ${c.toLatex()}$.`,
                  `$c = ${term(r, "c", true)}${term(alpha, "")}$，所以 $${term(1 - r, "c", true)} = ${alpha}$，$c = ${c.toLatex()}$。`,
                ),
              ],
              [
                ["Match the constants", "比较常数项"],
                t(
                  `$e = ${lin([
                    [-r, "c"],
                    [r, "e"],
                    [beta, ""],
                  ])}$; with $c = ${c.toLatex()}$ this is $${term(1 - r, "e", true)} = ${rhs.toLatex()}$, so $e = ${e.toLatex()}$.`,
                  `$e = ${lin([
                    [-r, "c"],
                    [r, "e"],
                    [beta, ""],
                  ])}$；代入 $c = ${c.toLatex()}$ 得 $${term(1 - r, "e", true)} = ${rhs.toLatex()}$，所以 $e = ${e.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Take $a_0 = e = ${e.toLatex()}$: the rule gives $a_1 = ${chain(e.isZero() ? String(alpha + beta) : `${times(r, pq(e))}${signedN(alpha + beta)}`, c.add(e).toLatex())}$, which is $c + e$, as the trial solution needs.`,
              `取 $a_0 = e = ${e.toLatex()}$：由递推得 $a_1 = ${chain(e.isZero() ? String(alpha + beta) : `${times(r, pq(e))}${signedN(alpha + beta)}`, c.add(e).toLatex())}$，正是试探解要求的 $c + e$。`,
            ),
          ),
        });
      },
    },
    {
      id: "summing-a-polynomial-forcing-term",
      title: t("The case r = 1", "r = 1 的情形"),
      explanation: t(
        "When the ratio is one, each step just adds the forcing term, so the solution is the initial value plus the sum of those terms. $a_n = a_{n-1} + 6n + 1$ with $a_0 = 3$ adds $6k + 1$ at step $k$: $a_n = 3 + \\sum_{k=1}^{n}(6k + 1) = 3 + 3n(n + 1) + n$, so $a_{10} = 3 + 330 + 10 = 343$.\n\n> **Watch out.** The sum runs from $k = 1$ to $n$: there are $n$ steps from $a_0$ to $a_n$, so $\\sum_{k=1}^{n} k = \\frac{n(n + 1)}{2}$. Remember to add the starting value $a_0$.",
        "当比为 1 时，每一步只是加上强迫项，所以解就是初值加上这些项之和。$a_n = a_{n-1} + 6n + 1$，$a_0 = 3$，第 $k$ 步加 $6k + 1$：$a_n = 3 + \\sum_{k=1}^{n}(6k + 1) = 3 + 3n(n + 1) + n$，所以 $a_{10} = 3 + 330 + 10 = 343$。\n\n> **注意。** 求和从 $k = 1$ 到 $n$：从 $a_0$ 到 $a_n$ 共 $n$ 步，所以 $\\sum_{k=1}^{n} k = \\frac{n(n + 1)}{2}$。别忘了加上初值 $a_0$。",
      ),
      generate(rng) {
        const alpha = rng.nonZero(-4, 5);
        const beta = rng.int(-5, 5);
        const a0 = rng.int(-9, 9);
        const N = rng.int(10, 40);
        const value = a0 + (alpha * N * (N + 1)) / 2 + beta * N;
        const rec = lin([
          [1, "a_{n-1}"],
          [alpha, "n"],
          [beta, ""],
        ]);
        const S = (N * (N + 1)) / 2;
        const prev = a0 + (alpha * (N - 1) * N) / 2 + beta * (N - 1);
        const summand = lin([
          [alpha, "k"],
          [beta, ""],
        ]);
        const total = chain(
          lin([
            [a0, ""],
            [alpha, `\\cdot ${S}`],
            [beta, `\\cdot ${N}`],
          ]),
          String(value),
        );
        const added = lin([
          [alpha, `\\cdot ${N}`],
          [beta, ""],
        ]);
        return numberProblem({
          prompt: t(
            `$a_n = ${rec}$ for $n \\ge 1$, with $a_0 = ${a0}$. Find $a_{${N}}$.`,
            `$a_n = ${rec}$（$n \\ge 1$），$a_0 = ${a0}$。求 $a_{${N}}$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(value - a0, `That leaves out the starting value $a_0 = ${a0}$.`, `那是漏掉了初值 $a_0 = ${a0}$。`),
            why(
              a0 + (alpha * N * (N - 1)) / 2 + beta * N,
              `That sums $k$ only up to $${N - 1}$; the steps run from $k = 1$ to $k = ${N}$.`,
              `那是只把 $k$ 加到 $${N - 1}$；步数从 $k = 1$ 到 $k = ${N}$。`,
            ),
            why(
              a0 + alpha * N * N + beta * N,
              `That replaces $\\sum k$ by $${N}^2$; the sum of $1, 2, \\dots, ${N}$ is $\\frac{${N} \\cdot ${N + 1}}{2}$.`,
              `那是把 $\\sum k$ 换成了 $${N}^2$；$1, 2, \\dots, ${N}$ 的和是 $\\frac{${N} \\cdot ${N + 1}}{2}$。`,
            ),
            why(value + alpha * (N + 1), `That sums $k$ up to $${N + 1}$, one step too many.`, `那是把 $k$ 加到 $${N + 1}$，多了一步。`),
          ]),
          solution: walked(
            [
              [
                ["Add up the steps", "把各步加起来"],
                t(
                  `Each step adds the forcing term, so $a_{${N}} = ${a0} + \\sum_{k=1}^{${N}} (${summand})$.`,
                  `每一步加上强迫项，所以 $a_{${N}} = ${a0} + \\sum_{k=1}^{${N}} (${summand})$。`,
                ),
              ],
              [
                ["Use the sum formulas", "用求和公式"],
                t(
                  `$\\sum_{k=1}^{${N}} k = \\frac{${N} \\cdot ${N + 1}}{2} = ${S}$${beta === 0 ? "" : ` and $\\sum_{k=1}^{${N}} 1 = ${N}$`}, so $a_{${N}} = ${total}$.`,
                  `$\\sum_{k=1}^{${N}} k = \\frac{${N} \\cdot ${N + 1}}{2} = ${S}$${beta === 0 ? "" : `，$\\sum_{k=1}^{${N}} 1 = ${N}$`}，所以 $a_{${N}} = ${total}$。`,
                ),
              ],
            ],
            t(
              `The same formula gives $a_{${N - 1}} = ${prev}$, and $${value} - ${pn(prev)} = ${alpha * N + beta}$, which is $${added}$, the amount the rule adds at $n = ${N}$.`,
              `同一公式给出 $a_{${N - 1}} = ${prev}$，而 $${value} - ${pn(prev)} = ${alpha * N + beta}$，正是 $n = ${N}$ 时递推加上的 $${added}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** firstOrderRecurrenceRelationsWithExponentialForcing solves aₙ = r aₙ₋₁ + c sⁿ. */
export const firstOrderRecurrenceRelationsWithExponentialForcing: TopicDef = {
  id: "first-order-recurrence-relations-with-exponential-forcing",
  title: t("First-Order Recurrence Relations With Exponential Forcing", "指数强迫项的一阶递推关系"),
  summary: t(
    "For aₙ = r aₙ₋₁ + c sⁿ with s ≠ r, a particular solution is K sⁿ with K = cs/(s − r). If s = r, try K n rⁿ instead, which gives K = c.",
    "对 aₙ = r aₙ₋₁ + c sⁿ（s ≠ r），特解为 K sⁿ，K = cs/(s − r)。若 s = r，则改设 K n rⁿ，得 K = c。",
  ),
  intro: t(
    "For $a_n = 6a_{n-1} + 2 \\cdot 7^n$ with $a_0 = 15$, the guess $K \\cdot 7^n$ gives $7K = 6K + 14$, so $K = 14$. Adding a multiple of $6^n$ to match the start, the solution is $a_n = 6^n + 14 \\cdot 7^n$.\n\nCheck: the rule gives $a_1 = 6 \\cdot 15 + 2 \\cdot 7 = 104$, and the formula gives $6 + 98 = 104$.\n\nIn this lesson we find particular solutions of first-order recurrences forced by an exponential, including the case where its base equals the ratio, and fix the constant from the starting value.",
    "对 $a_n = 6a_{n-1} + 2 \\cdot 7^n$，$a_0 = 15$，设 $K \\cdot 7^n$ 得 $7K = 6K + 14$，所以 $K = 14$。再加上 $6^n$ 的倍数以符合初值，解为 $a_n = 6^n + 14 \\cdot 7^n$。\n\n检验：由递推得 $a_1 = 6 \\cdot 15 + 2 \\cdot 7 = 104$，由公式得 $6 + 98 = 104$。\n\n本课我们求强迫项为指数函数的一阶递推的特解，包括底数等于比的情形，并由初值确定常数。",
  ),
  prerequisites: ["first-order-recurrence-relations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "exponential-particular-solutions",
      title: t("Exponential particular solutions", "指数特解"),
      explanation: t(
        "When the forcing term is an exponential, try a constant times the same exponential and solve for the constant. For $a_n = 4a_{n-1} + 3 \\cdot 6^n$, try $K \\cdot 6^n$: $K \\cdot 6^n = 4K \\cdot 6^{n-1} + 3 \\cdot 6^n$. Dividing by $6^{n-1}$ gives $6K = 4K + 18$, so $K = 9$.\n\n> **Watch out.** Divide both sides by $s^{n-1}$: the forcing $c \\cdot s^n$ becomes $cs$, not $c$, so $K = \\frac{cs}{s - r}$.",
        "当强迫项是指数函数时，尝试同一指数函数的常数倍，再解出这个常数。对 $a_n = 4a_{n-1} + 3 \\cdot 6^n$，设 $K \\cdot 6^n$：$K \\cdot 6^n = 4K \\cdot 6^{n-1} + 3 \\cdot 6^n$。两边除以 $6^{n-1}$ 得 $6K = 4K + 18$，所以 $K = 9$。\n\n> **注意。** 两边都除以 $s^{n-1}$：强迫项 $c \\cdot s^n$ 变成 $cs$，不是 $c$，所以 $K = \\frac{cs}{s - r}$。",
      ),
      generate(rng) {
        const r = rng.pick([-3, -2, 2, 3, 4]);
        let s: number;
        do s = rng.pick([-3, -2, 2, 3, 4, 5]);
        while (s === r);
        const c = rng.nonZero(-5, 5);
        const value = Q.of(c * s, s - r);
        const rec = `${r}a_{n-1}${term(c, `\\cdot ${pn(s)}^n`)}`;
        return numberProblem({
          prompt: t(
            `$a_n = ${rec}$ has a particular solution of the form $K \\cdot ${pn(s)}^n$. Find $K$.`,
            `$a_n = ${rec}$ 有形如 $K \\cdot ${pn(s)}^n$ 的特解。求 $K$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              Q.of(c, s - r),
              "That turns $c \\cdot s^n$ into $c$ instead of $cs$ when dividing by $s^{n-1}$.",
              "那是除以 $s^{n-1}$ 时把 $c \\cdot s^n$ 变成了 $c$，而应是 $cs$。",
            ),
            why(
              Q.of(c * r, s - r),
              "That multiplies $c$ by the ratio $r$; dividing $c \\cdot s^n$ by $s^{n-1}$ leaves $cs$.",
              "那是把 $c$ 乘以比 $r$；$c \\cdot s^n$ 除以 $s^{n-1}$ 剩下 $cs$。",
            ),
            why(
              Q.of(c * s, r - s),
              "The sign is off: $sK - rK = (s - r)K$, so divide by $s - r$.",
              "符号错了：$sK - rK = (s - r)K$，所以要除以 $s - r$。",
            ),
            why(Q.of(c), "That is $c$ itself; the constant also depends on $r$ and $s$.", "那是 $c$ 本身；这个常数还与 $r$ 和 $s$ 有关。"),
          ]),
          solution: walked(
            [
              [
                ["Substitute the guess", "代入猜测"],
                t(
                  `$K \\cdot ${pn(s)}^n = ${r}K \\cdot ${pn(s)}^{n-1}${term(c, `\\cdot ${pn(s)}^n`)}$.`,
                  `$K \\cdot ${pn(s)}^n = ${r}K \\cdot ${pn(s)}^{n-1}${term(c, `\\cdot ${pn(s)}^n`)}$。`,
                ),
              ],
              [
                [`Divide by $${pn(s)}^{n-1}$`, `两边除以 $${pn(s)}^{n-1}$`],
                t(
                  `$${s}K = ${r}K${signedN(c * s)}$, so $${term(s - r, "K", true)} = ${c * s}$ and $K = ${value.toLatex()}$.`,
                  `$${s}K = ${r}K${signedN(c * s)}$，所以 $${term(s - r, "K", true)} = ${c * s}$，$K = ${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Putting $K = ${value.toLatex()}$ back, $${by(`(${s} - ${pn(r)})`, value)} = ${c * s}$, the constant the divided equation needs.`,
              `代回 $K = ${value.toLatex()}$，$${by(`(${s} - ${pn(r)})`, value)} = ${c * s}$，正是两边相除后的方程所要求的常数。`,
            ),
          ),
        });
      },
    },
    {
      id: "resonant-exponential-forcing",
      title: t("Forcing at the same base", "底数相同的强迫项"),
      explanation: t(
        "If the exponential already solves the homogeneous part, multiply the guess by $n$. For $a_n = 5a_{n-1} + 2 \\cdot 5^n$, $K \\cdot 5^n$ fails because it solves $a_n = 5a_{n-1}$. Try $Kn \\cdot 5^n$ and divide by $5^n$: $Kn = K(n - 1) + 2$, so $K = 2$ and $a_n = (a_0 + 2n)5^n$. With $a_0 = 1$, $a_2 = 5 \\cdot 25 = 125$.\n\n> **Watch out.** The factor $n$ goes with $K$ only: $a_n = (a_0 + Kn)r^n$, so at $n = N$ the bracket is $a_0 + KN$, and the power stays $r^N$.",
        "如果这个指数函数已经是齐次部分的解，就把猜测乘以 $n$。对 $a_n = 5a_{n-1} + 2 \\cdot 5^n$，$K \\cdot 5^n$ 不行，因为它满足 $a_n = 5a_{n-1}$。设 $Kn \\cdot 5^n$ 并除以 $5^n$：$Kn = K(n - 1) + 2$，所以 $K = 2$，$a_n = (a_0 + 2n)5^n$。当 $a_0 = 1$ 时，$a_2 = 5 \\cdot 25 = 125$。\n\n> **注意。** 因子 $n$ 只跟着 $K$：$a_n = (a_0 + Kn)r^n$，所以 $n = N$ 时括号是 $a_0 + KN$，幂仍是 $r^N$。",
      ),
      generate(rng) {
        const r = rng.pick([-3, -2, 2, 3]);
        const c = rng.nonZero(-4, 4);
        const a0 = rng.int(-5, 5);
        const N = rng.int(3, 7);
        const value = Q.of(a0 + c * N).mul(Q.of(r).pow(N));
        const rec = `${r}a_{n-1}${term(c, `\\cdot ${pn(r)}^n`)}`;
        const a1 = (a0 + c) * r;
        return numberProblem({
          prompt: t(
            `$a_n = ${rec}$ for $n \\ge 1$, with $a_0 = ${a0}$. Use the solution $a_n = (a_0 + Kn)${pn(r)}^n$ to find $a_{${N}}$.`,
            `$a_n = ${rec}$（$n \\ge 1$），$a_0 = ${a0}$。利用解 $a_n = (a_0 + Kn)${pn(r)}^n$ 求 $a_{${N}}$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              Q.of(a0 + c).mul(Q.of(r).pow(N)),
              `That adds $K$ only once; at $n = ${N}$ the bracket is $a_0 + ${N}K$.`,
              `那是只加了一次 $K$；$n = ${N}$ 时括号是 $a_0 + ${N}K$。`,
            ),
            why(Q.of(a0).mul(Q.of(r).pow(N)), "That leaves out the forcing term altogether.", "那是完全漏掉了强迫项。"),
            why(
              Q.of(a0 + c * (N - 1)).mul(Q.of(r).pow(N)),
              `That puts $${N - 1}$ in the bracket; at $n = ${N}$ it is $a_0 + ${N}K$.`,
              `那是在括号里用了 $${N - 1}$；$n = ${N}$ 时应是 $a_0 + ${N}K$。`,
            ),
            why(
              Q.of(a0 + c * N).mul(Q.of(r).pow(N - 1)),
              `That lowers the power to $${pw(r, N - 1)}$; the power is $${pw(r, N)}$.`,
              `那是把幂降成了 $${pw(r, N - 1)}$；应是 $${pw(r, N)}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Find $K$", "求 $K$"],
                t(
                  `Substituting $Kn \\cdot ${pn(r)}^n$ and dividing by $${pn(r)}^n$: $Kn = K(n - 1)${term(c, "")}$, so $K = ${c}$.`,
                  `代入 $Kn \\cdot ${pn(r)}^n$ 并除以 $${pn(r)}^n$：$Kn = K(n - 1)${term(c, "")}$，所以 $K = ${c}$。`,
                ),
              ],
              [
                [`Put $n = ${N}$`, `代入 $n = ${N}$`],
                t(
                  `$a_{${N}} = ${chain(
                    `(${lin([
                      [a0, ""],
                      [c, `\\cdot ${N}`],
                    ])}) \\cdot ${pw(r, N)}`,
                    times(a0 + c * N, pw(r, N)),
                    value.toLatex(),
                  )}$.`,
                  `$a_{${N}} = ${chain(
                    `(${lin([
                      [a0, ""],
                      [c, `\\cdot ${N}`],
                    ])}) \\cdot ${pw(r, N)}`,
                    times(a0 + c * N, pw(r, N)),
                    value.toLatex(),
                  )}$。`,
                ),
              ],
            ],
            t(
              `At $n = 1$ the rule gives $${chain(`${times(r, pn(a0))}${signedN(c * r)}`, String(a1))}$, and the formula gives $${chain(times(a0 + c, pn(r)), String(a1))}$.`,
              `$n = 1$ 时由递推得 $${chain(`${times(r, pn(a0))}${signedN(c * r)}`, String(a1))}$，由公式得 $${chain(times(a0 + c, pn(r)), String(a1))}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** Roots are two distinct nonzero integer roots, larger first. */
interface Roots {
  readonly r1: number;
  readonly r2: number;
  readonly p: number;
  readonly q: number;
}

/** randomRoots picks distinct integer roots and the recurrence aₙ = p aₙ₋₁ + q aₙ₋₂ they solve. */
function randomRoots(rng: Rng): Roots {
  let x: number;
  let y: number;
  do [x, y] = rng.sample([-3, -2, -1, 2, 3, 4, 5], 2) as [number, number];
  while (x + y === 0);
  const r1 = Math.max(x!, y!);
  const r2 = Math.min(x!, y!);
  return { r1, r2, p: r1 + r2, q: -r1 * r2 };
}

/** rec2 writes p aₙ₋₁ + q aₙ₋₂. */
const rec2 = (p: number, q: number) =>
  lin([
    [p, "a_{n-1}"],
    [q, "a_{n-2}"],
  ]);

/** charTex writes x² − px − q. */
const charTex = (p: number, q: number) =>
  lin([
    [1, "x^2"],
    [-p, "x"],
    [-q, ""],
  ]);

/** factor writes x − r. */
const factor = (r: number) => `x ${r < 0 ? "+" : "-"} ${Math.abs(r)}`;

/** secondOrderHomogeneousRecurrenceRelationsWithDistinctRealRoots solves aₙ = p aₙ₋₁ + q aₙ₋₂ when x² = px + q has distinct real roots. */
export const secondOrderHomogeneousRecurrenceRelationsWithDistinctRealRoots: TopicDef = {
  id: "second-order-homogeneous-recurrence-relations-with-distinct-real-roots",
  title: t(
    "Second-Order Homogeneous Recurrence Relations: Characteristic Equations With Distinct Real Roots",
    "二阶齐次递推关系：特征方程有两个不同实根",
  ),
  summary: t(
    "Trying aₙ = xⁿ in aₙ = p aₙ₋₁ + q aₙ₋₂ gives the characteristic equation x² = px + q. With distinct roots r₁, r₂, the solution is aₙ = A r₁ⁿ + B r₂ⁿ, with A and B fixed by a₀ and a₁.",
    "把 aₙ = xⁿ 代入 aₙ = p aₙ₋₁ + q aₙ₋₂ 得特征方程 x² = px + q。若有两个不同的根 r₁、r₂，则解为 aₙ = A r₁ⁿ + B r₂ⁿ，A 与 B 由 a₀ 和 a₁ 确定。",
  ),
  intro: t(
    "Trying $a_n = x^n$ in $a_n = 8a_{n-1} - 7a_{n-2}$ gives $x^2 - 8x + 7 = 0$, with roots $7$ and $1$, so $a_n = A \\cdot 7^n + B$. With $a_0 = 2$ and $a_1 = 8$, $A + B = 2$ and $7A + B = 8$, so $A = B = 1$ and $a_n = 7^n + 1$.\n\nCheck: the rule gives $a_2 = 8 \\cdot 8 - 7 \\cdot 2 = 50$, and the formula gives $49 + 1 = 50$.\n\nIn this lesson we find the characteristic roots of a second-order recurrence, rebuild a recurrence from its roots, and fit the constants of the solution to the initial terms.",
    "把 $a_n = x^n$ 代入 $a_n = 8a_{n-1} - 7a_{n-2}$，得 $x^2 - 8x + 7 = 0$，根为 $7$ 和 $1$，所以 $a_n = A \\cdot 7^n + B$。由 $a_0 = 2$，$a_1 = 8$ 得 $A + B = 2$，$7A + B = 8$，所以 $A = B = 1$，$a_n = 7^n + 1$。\n\n检验：由递推得 $a_2 = 8 \\cdot 8 - 7 \\cdot 2 = 50$，由公式得 $49 + 1 = 50$。\n\n本课我们求二阶递推的特征根，由特征根还原递推关系，并用初始项确定解中的常数。",
  ),
  prerequisites: ["first-order-recurrence-relations", "the-quadratic-formula"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "characteristic-roots-of-a-recurrence",
      title: t("The characteristic roots", "特征根"),
      explanation: t(
        "Trying $a_n = x^n$ turns the recurrence into a polynomial equation whose roots give the basic solutions. For $a_n = 5a_{n-1} + 6a_{n-2}$, dividing $x^n = 5x^{n-1} + 6x^{n-2}$ by $x^{n-2}$ gives $x^2 - 5x - 6 = 0$, that is, $(x - 6)(x + 1) = 0$. The roots are $6$ and $-1$, so $a_n = A \\cdot 6^n + B(-1)^n$.\n\n> **Watch out.** Move every term to one side first: $a_n = pa_{n-1} + qa_{n-2}$ gives $x^2 - px - q = 0$. Keeping the signs of $p$ and $q$ as they stand reverses the signs of the roots.",
        "尝试 $a_n = x^n$，就把递推关系变成一个多项式方程，它的根给出基本解。对 $a_n = 5a_{n-1} + 6a_{n-2}$，把 $x^n = 5x^{n-1} + 6x^{n-2}$ 除以 $x^{n-2}$ 得 $x^2 - 5x - 6 = 0$，即 $(x - 6)(x + 1) = 0$。根为 $6$ 和 $-1$，所以 $a_n = A \\cdot 6^n + B(-1)^n$。\n\n> **注意。** 先把所有项移到一边：$a_n = pa_{n-1} + qa_{n-2}$ 给出 $x^2 - px - q = 0$。如果照搬 $p$ 和 $q$ 的符号，根的符号就反了。",
      ),
      generate(rng) {
        const { r1, r2, p, q } = randomRoots(rng);
        const askLarger = rng.bool();
        const value = askLarger ? r1 : r2;
        const other = askLarger ? r2 : r1;
        return numberProblem({
          prompt: t(
            `Find the ${askLarger ? "larger" : "smaller"} root of the characteristic equation of $a_n = ${rec2(p, q)}$.`,
            `求 $a_n = ${rec2(p, q)}$ 的特征方程的${askLarger ? "较大" : "较小"}根。`,
          ),
          answer: value,
          mistakes: distinct([
            why(other, `That is the ${askLarger ? "smaller" : "larger"} root.`, `那是${askLarger ? "较小" : "较大"}的根。`),
            why(
              -value,
              `The sign is off: the factor $${factor(value)}$ gives the root $${value}$.`,
              `符号错了：因式 $${factor(value)}$ 给出的根是 $${value}$。`,
            ),
            why(-other, "That is the other root with its sign changed.", "那是另一个根，而且符号也反了。"),
            why(p, `That is $p = ${p}$, the sum of the roots.`, `那是两根之和 $p = ${p}$。`),
          ]),
          solution: walked(
            [
              [
                ["Write the characteristic equation", "写出特征方程"],
                t(
                  `Trying $a_n = x^n$ and dividing by $x^{n-2}$: $x^2 = ${lin([
                    [p, "x"],
                    [q, ""],
                  ])}$, so $${charTex(p, q)} = 0$.`,
                  `设 $a_n = x^n$ 并除以 $x^{n-2}$：$x^2 = ${lin([
                    [p, "x"],
                    [q, ""],
                  ])}$，所以 $${charTex(p, q)} = 0$。`,
                ),
              ],
              [
                ["Factor", "因式分解"],
                t(
                  `$(${factor(r1)})(${factor(r2)}) = 0$, so the roots are $${r1}$ and $${r2}$, and the ${askLarger ? "larger" : "smaller"} is $${value}$.`,
                  `$(${factor(r1)})(${factor(r2)}) = 0$，所以根为 $${r1}$ 和 $${r2}$，${askLarger ? "较大" : "较小"}的是 $${value}$。`,
                ),
              ],
            ],
            t(
              `The roots add to $${p}$ and multiply to $${-q}$, which rebuilds $${charTex(p, q)}$.`,
              `两根之和为 $${p}$，之积为 $${-q}$，正好还原出 $${charTex(p, q)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-with-initial-conditions",
      title: t("Using the initial conditions", "利用初始条件"),
      explanation: t(
        "The general solution has one constant for each root, and the initial terms give a system of equations that fixes them. For $a_n = 5a_{n-1} + 6a_{n-2}$ with $a_0 = 2$ and $a_1 = 5$: $A + B = 2$ and $6A - B = 5$, so $7A = 7$, $A = 1$, $B = 1$, and $a_n = 6^n + (-1)^n$.\n\n> **Watch out.** At $n = 1$ the constants are multiplied by the roots: $a_1 = Ar_1 + Br_2$, not $A + B$. Each constant belongs to its own root, so do not swap them.",
        "通解中每个根对应一个常数，初始项给出一个方程组来确定这些常数。对 $a_n = 5a_{n-1} + 6a_{n-2}$，$a_0 = 2$，$a_1 = 5$：$A + B = 2$，$6A - B = 5$，所以 $7A = 7$，$A = 1$，$B = 1$，$a_n = 6^n + (-1)^n$。\n\n> **注意。** $n = 1$ 时常数要乘以各自的根：$a_1 = Ar_1 + Br_2$，而不是 $A + B$。每个常数属于自己的根，不要交换。",
      ),
      generate(rng) {
        const { r1, r2, p, q } = randomRoots(rng);
        const A = rng.nonZero(-4, 4);
        const B = rng.nonZero(-4, 4);
        const a0 = A + B;
        const a1 = A * r1 + B * r2;
        const kind = rng.int(0, 2);
        const N = rng.int(6, 10);
        const aN = A * r1 ** N + B * r2 ** N;
        const a2 = A * r1 * r1 + B * r2 * r2;
        const parts: [[string, string], ReturnType<typeof t>][] = [
          [
            ["Set up the equations", "列方程"],
            t(
              `$a_0 = A + B = ${a0}$ and $a_1 = ${lin([
                [r1, "A"],
                [r2, "B"],
              ])} = ${a1}$.`,
              `$a_0 = A + B = ${a0}$，$a_1 = ${lin([
                [r1, "A"],
                [r2, "B"],
              ])} = ${a1}$。`,
            ),
          ],
          [
            ["Solve for the constants", "解出常数"],
            t(
              `Putting $B = ${a0 === 0 ? "-A" : `${a0} - A`}$ into the second equation: $${term(r1 - r2, "A", true)} = ${a1 - r2 * a0}$, so $A = ${A}$ and $B = ${B}$.`,
              `把 $B = ${a0 === 0 ? "-A" : `${a0} - A`}$ 代入第二个方程：$${term(r1 - r2, "A", true)} = ${a1 - r2 * a0}$，所以 $A = ${A}$，$B = ${B}$。`,
            ),
          ],
        ];
        if (kind === 2)
          parts.push([
            [`Evaluate $a_{${N}}$`, `计算 $a_{${N}}$`],
            t(
              `$a_{${N}} = ${chain(
                lin([
                  [A, `\\cdot ${pw(r1, N)}`],
                  [B, `\\cdot ${pw(r2, N)}`],
                ]),
                lin([
                  [A * r1 ** N, ""],
                  [B * r2 ** N, ""],
                ]),
                String(aN),
              )}$.`,
              `$a_{${N}} = ${chain(
                lin([
                  [A, `\\cdot ${pw(r1, N)}`],
                  [B, `\\cdot ${pw(r2, N)}`],
                ]),
                lin([
                  [A * r1 ** N, ""],
                  [B * r2 ** N, ""],
                ]),
                String(aN),
              )}$。`,
            ),
          ]);
        const ruleA2 = chain(
          lin([
            [p * a1, ""],
            [q * a0, ""],
          ]),
          String(a2),
        );
        const formulaA2 = chain(
          lin([
            [A * r1 * r1, ""],
            [B * r2 * r2, ""],
          ]),
          String(a2),
        );
        return numberProblem({
          prompt:
            kind === 2
              ? t(
                  `$a_n = ${rec2(p, q)}$ with $a_0 = ${a0}$ and $a_1 = ${a1}$. Find $a_{${N}}$ using the closed form.`,
                  `$a_n = ${rec2(p, q)}$，$a_0 = ${a0}$，$a_1 = ${a1}$。用通项公式求 $a_{${N}}$。`,
                )
              : t(
                  `$a_n = ${rec2(p, q)}$ with $a_0 = ${a0}$ and $a_1 = ${a1}$ has solution $a_n = A \\cdot ${pn(r1)}^n + B \\cdot ${pn(r2)}^n$. Find $${kind === 0 ? "A" : "B"}$.`,
                  `$a_n = ${rec2(p, q)}$，$a_0 = ${a0}$，$a_1 = ${a1}$ 的解为 $a_n = A \\cdot ${pn(r1)}^n + B \\cdot ${pn(r2)}^n$。求 $${kind === 0 ? "A" : "B"}$。`,
                ),
          answer: kind === 0 ? A : kind === 1 ? B : aN,
          mistakes: distinct(
            kind === 2
              ? [
                  why(
                    A * r1 ** (N - 1) + B * r2 ** (N - 1),
                    `That is $a_{${N - 1}}$; the exponents must be $${N}$.`,
                    `那是 $a_{${N - 1}}$；指数应是 $${N}$。`,
                  ),
                  why(
                    A * r1 ** N - B * r2 ** N,
                    "That subtracts the second term; the two terms are added.",
                    "那是减去了第二项；两项应相加。",
                  ),
                  why(
                    B * r1 ** N + A * r2 ** N,
                    "That swaps $A$ and $B$; each constant goes with its own root.",
                    "那是交换了 $A$ 和 $B$；每个常数跟着自己的根。",
                  ),
                ]
              : [
                  why(
                    kind === 0 ? B : A,
                    `That is $${kind === 0 ? "B" : "A"}$, the other constant.`,
                    `那是另一个常数 $${kind === 0 ? "B" : "A"}$。`,
                  ),
                  why(a0, "That is $a_0 = A + B$, the sum of the constants.", "那是两个常数之和 $a_0 = A + B$。"),
                  why(kind === 0 ? -A : -B, "The sign is off; solve the two equations again.", "符号错了；重新解这两个方程。"),
                  why(a1, "That is $a_1$; the constants come from solving both equations.", "那是 $a_1$；常数要由两个方程一起解出。"),
                ],
          ),
          solution: walked(
            parts,
            t(
              `The rule gives $a_2 = ${ruleA2}$, and the formula gives $${formulaA2}$.`,
              `由递推得 $a_2 = ${ruleA2}$，由公式得 $${formulaA2}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** secondOrderHomogeneousRecurrenceRelationsWithRepeatedRoots solves the case of a double characteristic root. */
export const secondOrderHomogeneousRecurrenceRelationsWithRepeatedRoots: TopicDef = {
  id: "second-order-homogeneous-recurrence-relations-with-repeated-roots",
  title: t(
    "Second-Order Homogeneous Recurrence Relations: Characteristic Equations With Repeated Roots",
    "二阶齐次递推关系：特征方程有重根",
  ),
  summary: t(
    "If the characteristic equation has a double root r, then rⁿ and nrⁿ both solve the recurrence, and aₙ = (A + Bn)rⁿ.",
    "若特征方程有二重根 r，则 rⁿ 与 nrⁿ 都是递推关系的解，aₙ = (A + Bn)rⁿ。",
  ),
  intro: t(
    "The recurrence $a_n = 16a_{n-1} - 64a_{n-2}$ has characteristic equation $(x - 8)^2 = 0$, a double root. Both $8^n$ and $n \\cdot 8^n$ solve it, and with $a_0 = 1$, $a_1 = 16$ the solution is $a_n = (1 + n)8^n$.\n\nCheck: the rule gives $a_2 = 16 \\cdot 16 - 64 \\cdot 1 = 192$, and the formula gives $3 \\cdot 64 = 192$.\n\nIn this lesson we solve second-order recurrences whose characteristic equation has a repeated root, find their constants and terms, and find the coefficient that makes a root repeated.",
    "递推 $a_n = 16a_{n-1} - 64a_{n-2}$ 的特征方程是 $(x - 8)^2 = 0$，有二重根。$8^n$ 和 $n \\cdot 8^n$ 都是它的解，由 $a_0 = 1$，$a_1 = 16$ 得解 $a_n = (1 + n)8^n$。\n\n检验：由递推得 $a_2 = 16 \\cdot 16 - 64 \\cdot 1 = 192$，由公式得 $3 \\cdot 64 = 192$。\n\n本课我们解特征方程有重根的二阶递推，求它的常数和各项，并求使特征根重复的系数。",
  ),
  prerequisites: ["second-order-homogeneous-recurrence-relations-with-distinct-real-roots"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "constants-for-a-repeated-root",
      title: t("Finding the constants", "求常数"),
      explanation: t(
        "A repeated root $r$ gives the two solutions $r^n$ and $nr^n$, and the initial terms fix their constants. $a_n = 18a_{n-1} - 81a_{n-2}$ has characteristic equation $(x - 9)^2 = 0$, so $a_n = (A + Bn)9^n$. With $a_0 = 1$ and $a_1 = 27$: $A = 1$ and $(A + B) \\cdot 9 = 27$, so $B = 2$ and $a_n = (1 + 2n)9^n$.\n\n> **Watch out.** At $n = 1$ the bracket is $A + B$, so $a_1 = (A + B)r$: divide $a_1$ by $r$ before subtracting $A$. Taking $B = a_1 - A$ forgets the factor $r$.",
        "重根 $r$ 给出 $r^n$ 和 $nr^n$ 两个解，初始项确定它们的常数。$a_n = 18a_{n-1} - 81a_{n-2}$ 的特征方程为 $(x - 9)^2 = 0$，所以 $a_n = (A + Bn)9^n$。由 $a_0 = 1$，$a_1 = 27$：$A = 1$，$(A + B) \\cdot 9 = 27$，所以 $B = 2$，$a_n = (1 + 2n)9^n$。\n\n> **注意。** $n = 1$ 时括号是 $A + B$，所以 $a_1 = (A + B)r$：先把 $a_1$ 除以 $r$，再减去 $A$。取 $B = a_1 - A$ 就漏掉了因子 $r$。",
      ),
      generate(rng) {
        const r = rng.pick([-3, -2, -1, 2, 3, 4]);
        const A = rng.int(-4, 4);
        const B = rng.nonZero(-4, 4);
        const a0 = A;
        const a1 = (A + B) * r;
        const a2 = (A + 2 * B) * r * r;
        return numberProblem({
          prompt: t(
            `$a_n = ${rec2(2 * r, -r * r)}$ with $a_0 = ${a0}$ and $a_1 = ${a1}$ has solution $a_n = (A + Bn)${pn(r)}^n$. Find $B$.`,
            `$a_n = ${rec2(2 * r, -r * r)}$，$a_0 = ${a0}$，$a_1 = ${a1}$ 的解为 $a_n = (A + Bn)${pn(r)}^n$。求 $B$。`,
          ),
          answer: B,
          mistakes: distinct([
            why(a1 / r, "That is $A + B$; subtract $A$ to get $B$.", "那是 $A + B$；还要减去 $A$ 才得到 $B$。"),
            why(a1 - A, `That forgets to divide $a_1$ by the root $${r}$.`, `那是忘了把 $a_1$ 除以根 $${r}$。`),
            why(A, "That is $A = a_0$, the other constant.", "那是另一个常数 $A = a_0$。"),
            why(a1 - A * r, `That is $Br$; divide it by $${r}$ to get $B$.`, `那是 $Br$；还要除以 $${r}$ 才得到 $B$。`),
          ]),
          solution: walked(
            [
              [
                ["Use $a_0$", "利用 $a_0$"],
                t(`$a_0 = (A + B \\cdot 0)${pn(r)}^0 = A$, so $A = ${A}$.`, `$a_0 = (A + B \\cdot 0)${pn(r)}^0 = A$，所以 $A = ${A}$。`),
              ],
              [
                ["Use $a_1$", "利用 $a_1$"],
                t(
                  `$a_1 = ${by("(A + B)", r)} = ${a1}$, so $A + B = ${A + B}$ and $B = ${chain(minus(A + B, A), String(B))}$.`,
                  `$a_1 = ${by("(A + B)", r)} = ${a1}$，所以 $A + B = ${A + B}$，$B = ${chain(minus(A + B, A), String(B))}$。`,
                ),
              ],
            ],
            t(
              `The rule gives $a_2 = ${chain(
                lin([
                  [2 * r * a1, ""],
                  [-r * r * a0, ""],
                ]),
                String(a2),
              )}$, and the formula gives $(A + 2B)${pn(r)}^2 = ${chain(
                by(
                  `(${lin([
                    [A, ""],
                    [2 * B, ""],
                  ])})`,
                  r * r,
                ),
                String(a2),
              )}$.`,
              `由递推得 $a_2 = ${chain(
                lin([
                  [2 * r * a1, ""],
                  [-r * r * a0, ""],
                ]),
                String(a2),
              )}$，由公式得 $(A + 2B)${pn(r)}^2 = ${chain(
                by(
                  `(${lin([
                    [A, ""],
                    [2 * B, ""],
                  ])})`,
                  r * r,
                ),
                String(a2),
              )}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "terms-from-a-repeated-root-solution",
      title: t("Finding a term", "求某一项"),
      explanation: t(
        "Substitute the index into the closed form; the extra factor $n$ makes the terms grow faster than the power alone. With $a_n = (3 - n)(-8)^n$: $a_4 = (3 - 4) \\cdot 4096 = -4096$, and from $n = 4$ on the bracket is negative.\n\n> **Watch out.** In $(A + Bn)r^n$ the index appears twice: multiply $B$ by $N$ and raise $r$ to the power $N$. A negative root also makes the odd powers negative.",
        "把下标代入封闭形式；额外的因子 $n$ 使各项比单纯的幂增长得更快。由 $a_n = (3 - n)(-8)^n$：$a_4 = (3 - 4) \\cdot 4096 = -4096$，从 $n = 4$ 起括号为负。\n\n> **注意。** 在 $(A + Bn)r^n$ 中下标出现两次：$B$ 要乘以 $N$，$r$ 要取 $N$ 次幂。负根还会使奇数次幂为负。",
      ),
      generate(rng) {
        const r = rng.pick([-3, -2, 2, 3]);
        const A = rng.int(-4, 4);
        const B = rng.nonZero(-4, 4);
        const N = rng.int(4, 8);
        const a1 = (A + B) * r;
        const value = (A + B * N) * r ** N;
        const a2 = (A + 2 * B) * r * r;
        return numberProblem({
          prompt: t(
            `$a_n = ${rec2(2 * r, -r * r)}$ with $a_0 = ${A}$ and $a_1 = ${a1}$. Find $a_{${N}}$.`,
            `$a_n = ${rec2(2 * r, -r * r)}$，$a_0 = ${A}$，$a_1 = ${a1}$。求 $a_{${N}}$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              (A + B) * r ** N,
              "That uses the bracket $A + B$, which belongs to $n = 1$ only.",
              "那是用了括号 $A + B$，它只属于 $n = 1$。",
            ),
            why(
              A * r ** N + B * r ** (N - 1),
              `That gives the $B$ term the power $${pw(r, N - 1)}$; it is $${N}B \\cdot ${pw(r, N)}$.`,
              `那是给 $B$ 项用了幂 $${pw(r, N - 1)}$；应是 $${N}B \\cdot ${pw(r, N)}$。`,
            ),
            why(
              (A + B * (N - 1)) * r ** N,
              `That puts $${N - 1}$ in the bracket; at $n = ${N}$ it is $A + ${N}B$.`,
              `那是在括号里用了 $${N - 1}$；$n = ${N}$ 时应是 $A + ${N}B$。`,
            ),
            why(
              (A * N + B) * r ** N,
              "That swaps the roles of $A$ and $B$: $B$ is the one multiplied by $n$.",
              "那是把 $A$ 和 $B$ 的作用交换了：乘以 $n$ 的是 $B$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the constants", "求常数"],
                t(
                  `The characteristic equation is $(${factor(r)})^2 = 0$, so $a_n = (A + Bn)${pn(r)}^n$. Then $a_0 = A = ${A}$, and $a_1 = ${by("(A + B)", r)} = ${a1}$ gives $B = ${B}$.`,
                  `特征方程为 $(${factor(r)})^2 = 0$，所以 $a_n = (A + Bn)${pn(r)}^n$。于是 $a_0 = A = ${A}$，由 $a_1 = ${by("(A + B)", r)} = ${a1}$ 得 $B = ${B}$。`,
                ),
              ],
              [
                [`Put $n = ${N}$`, `代入 $n = ${N}$`],
                t(
                  `$a_{${N}} = ${chain(
                    `(${lin([
                      [A, ""],
                      [B, `\\cdot ${N}`],
                    ])}) \\cdot ${pw(r, N)}`,
                    times(A + B * N, pn(r ** N)),
                    String(value),
                  )}$.`,
                  `$a_{${N}} = ${chain(
                    `(${lin([
                      [A, ""],
                      [B, `\\cdot ${N}`],
                    ])}) \\cdot ${pw(r, N)}`,
                    times(A + B * N, pn(r ** N)),
                    String(value),
                  )}$。`,
                ),
              ],
            ],
            t(
              `The rule gives $a_2 = ${chain(
                lin([
                  [2 * r * a1, ""],
                  [-r * r * A, ""],
                ]),
                String(a2),
              )}$, and the formula gives $${chain(
                by(
                  `(${lin([
                    [A, ""],
                    [2 * B, ""],
                  ])})`,
                  r * r,
                ),
                String(a2),
              )}$.`,
              `由递推得 $a_2 = ${chain(
                lin([
                  [2 * r * a1, ""],
                  [-r * r * A, ""],
                ]),
                String(a2),
              )}$，由公式得 $${chain(
                by(
                  `(${lin([
                    [A, ""],
                    [2 * B, ""],
                  ])})`,
                  r * r,
                ),
                String(a2),
              )}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** ComplexRoots are characteristic roots m(u ± vi) with a standard argument. */
interface ComplexRoots {
  readonly p: number;
  readonly q: number;
  readonly mu: number;
  readonly theta: number;
  readonly rho: string;
  readonly rhoSq: number;
  readonly rootTex: string;
}

/** randomComplexRoots picks roots m(u ± vi) whose argument is a multiple of 30° or 45°. */
function randomComplexRoots(rng: Rng): ComplexRoots {
  const m = rng.int(1, 3);
  const [u, v2, theta] = rng.pick([
    [1, 1, 45],
    [-1, 1, 135],
    [0, 1, 90],
    [1, 3, 60],
    [-1, 3, 120],
  ] as const);
  const rhoSq = m * m * (u * u + v2);
  const rho = v2 === 3 ? `${2 * m}` : u === 0 ? `${m}` : `${m === 1 ? "" : m}\\sqrt{2}`;
  const vTex = v2 === 3 ? `${m === 1 ? "" : m}\\sqrt{3}` : `${m === 1 ? "" : m}`;
  const rootTex = `${u === 0 ? "" : `${u * m} `}\\pm ${vTex}i`;
  return { p: 2 * m * u, q: -rhoSq, mu: m * u, theta, rho, rhoSq, rootTex };
}

/** polar writes ρ(cos θ ± i sin θ), without a modulus of 1. */
const polar = (c: ComplexRoots) => `${c.rho === "1" ? "" : c.rho}(\\cos ${c.theta}^\\circ \\pm i \\sin ${c.theta}^\\circ)`;

/** secondOrderHomogeneousRecurrenceRelationsWithComplexRoots solves the case of complex conjugate characteristic roots. */
export const secondOrderHomogeneousRecurrenceRelationsWithComplexRoots: TopicDef = {
  id: "second-order-homogeneous-recurrence-relations-with-complex-roots",
  title: t(
    "Second-Order Homogeneous Recurrence Relations: Characteristic Equations With Complex Roots",
    "二阶齐次递推关系：特征方程有复根",
  ),
  summary: t(
    "If the characteristic roots are ρ(cos θ ± i sin θ), then by De Moivre's theorem the real solutions are aₙ = ρⁿ(A cos nθ + B sin nθ).",
    "若特征根为 ρ(cos θ ± i sin θ)，则由 De Moivre 定理，实数解为 aₙ = ρⁿ(A cos nθ + B sin nθ)。",
  ),
  intro: t(
    "The recurrence $a_n = 6a_{n-1} - 25a_{n-2}$ has characteristic equation $x^2 - 6x + 25 = 0$, whose roots $3 \\pm 4i$ are complex. Their modulus is $5$, so the terms grow like $5^n$ while their signs swing back and forth with the angle of the roots.\n\nCheck: $(3 + 4i) + (3 - 4i) = 6$ and $(3 + 4i)(3 - 4i) = 9 + 16 = 25$, the coefficients of $x^2 - 6x + 25$.\n\nIn this lesson we write complex characteristic roots in polar form, use it to find terms of the sequence, and find far terms of a recurrence whose roots lie on the unit circle.",
    "递推 $a_n = 6a_{n-1} - 25a_{n-2}$ 的特征方程是 $x^2 - 6x + 25 = 0$，它的根 $3 \\pm 4i$ 是复数。它们的模是 $5$，所以各项按 $5^n$ 增长，同时符号随根的辐角来回变化。\n\n检验：$(3 + 4i) + (3 - 4i) = 6$，$(3 + 4i)(3 - 4i) = 9 + 16 = 25$，正是 $x^2 - 6x + 25$ 的系数。\n\n本课我们把复特征根写成极坐标形式，用它求数列的项，并求特征根在单位圆上的递推的远项。",
  ),
  prerequisites: [
    "second-order-homogeneous-recurrence-relations-with-distinct-real-roots",
    "de-moivres-theorem",
    "solving-quadratic-equations-with-complex-roots",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "modulus-and-argument-of-characteristic-roots",
      title: t("Modulus and argument", "模与辐角"),
      explanation: t(
        "Complex characteristic roots come in conjugate pairs, and their polar form shows how fast the terms grow and how they turn. $a_n = 8a_{n-1} - 32a_{n-2}$ has characteristic equation $x^2 - 8x + 32 = 0$, with roots $4 \\pm 4i = 4\\sqrt{2}(\\cos 45^\\circ \\pm i \\sin 45^\\circ)$. So $\\rho^2 = 32$, $\\theta = 45^\\circ$, and $a_n = (4\\sqrt{2})^n(A \\cos 45n^\\circ + B \\sin 45n^\\circ)$.\n\n> **Watch out.** $\\rho^2$ is the product of the two roots, the constant term $-q$ of $x^2 - px - q$, not $p$ or $p^2$. Measure $\\theta$ from the positive real axis: a root with negative real part has $\\theta$ above $90^\\circ$.",
        "复特征根成共轭对出现，它们的极坐标形式显示各项增长多快、如何旋转。$a_n = 8a_{n-1} - 32a_{n-2}$ 的特征方程为 $x^2 - 8x + 32 = 0$，根为 $4 \\pm 4i = 4\\sqrt{2}(\\cos 45^\\circ \\pm i \\sin 45^\\circ)$。所以 $\\rho^2 = 32$，$\\theta = 45^\\circ$，$a_n = (4\\sqrt{2})^n(A \\cos 45n^\\circ + B \\sin 45n^\\circ)$。\n\n> **注意。** $\\rho^2$ 是两根之积，即 $x^2 - px - q$ 的常数项 $-q$，不是 $p$ 或 $p^2$。$\\theta$ 从正实轴量起：实部为负的根，$\\theta$ 大于 $90^\\circ$。",
      ),
      generate(rng) {
        const c = randomComplexRoots(rng);
        const askRho = rng.bool();
        const re2 = c.mu * c.mu;
        return numberProblem({
          prompt: askRho
            ? t(
                `The characteristic roots of $a_n = ${rec2(c.p, c.q)}$ are $\\rho(\\cos \\theta \\pm i \\sin \\theta)$. Find $\\rho^2$.`,
                `$a_n = ${rec2(c.p, c.q)}$ 的特征根为 $\\rho(\\cos \\theta \\pm i \\sin \\theta)$。求 $\\rho^2$。`,
              )
            : t(
                `The characteristic roots of $a_n = ${rec2(c.p, c.q)}$ are $\\rho(\\cos \\theta \\pm i \\sin \\theta)$ with $0^\\circ < \\theta < 180^\\circ$. Find $\\theta$ in degrees.`,
                `$a_n = ${rec2(c.p, c.q)}$ 的特征根为 $\\rho(\\cos \\theta \\pm i \\sin \\theta)$，$0^\\circ < \\theta < 180^\\circ$。求 $\\theta$（以度为单位）。`,
              ),
          answer: askRho ? c.rhoSq : c.theta,
          mistakes: distinct(
            askRho
              ? [
                  why(
                    c.p,
                    `That is $p = ${c.p}$, the sum of the roots; $\\rho^2$ is their product.`,
                    `那是两根之和 $p = ${c.p}$；$\\rho^2$ 是两根之积。`,
                  ),
                  why(
                    c.p * c.p,
                    "That squares $p$; $\\rho^2$ is the product of the roots, not the square of their sum.",
                    "那是 $p$ 的平方；$\\rho^2$ 是两根之积，不是两根之和的平方。",
                  ),
                  why(-c.q * 2, "That doubles the product of the roots.", "那是把两根之积乘了 2。"),
                  why(
                    Math.abs(c.mu),
                    "That is the size of the real part only; $\\rho^2$ adds the squares of the real and imaginary parts.",
                    "那只是实部的大小；$\\rho^2$ 是实部与虚部的平方和。",
                  ),
                ]
              : [
                  why(180 - c.theta, "That measures the angle from the negative real axis.", "那是从负实轴量起的角。"),
                  why(90 - (c.theta % 90 || 45), "That measures the angle from the imaginary axis.", "那是从虚轴量起的角。"),
                  why(
                    360 - c.theta,
                    "That is the argument of the conjugate root measured the long way round; take the root with positive imaginary part.",
                    "那是共轭根绕远路量出的辐角；应取虚部为正的那个根。",
                  ),
                ],
          ),
          solution: walked(
            [
              [
                ["Solve the characteristic equation", "解特征方程"],
                t(`$${charTex(c.p, c.q)} = 0$ has the roots $${c.rootTex}$.`, `$${charTex(c.p, c.q)} = 0$ 的根为 $${c.rootTex}$。`),
              ],
              [
                ["Find the modulus", "求模"],
                t(
                  `Adding the squares of the real and imaginary parts, $\\rho^2 = ${re2} + ${c.rhoSq - re2} = ${c.rhoSq}$.`,
                  `把实部与虚部的平方相加，$\\rho^2 = ${re2} + ${c.rhoSq - re2} = ${c.rhoSq}$。`,
                ),
              ],
              [
                ["Find the argument", "求辐角"],
                t(
                  `$${c.rootTex} = ${polar(c)}$, so $\\theta = ${c.theta}^\\circ$.`,
                  `$${c.rootTex} = ${polar(c)}$，所以 $\\theta = ${c.theta}^\\circ$。`,
                ),
              ],
            ],
            t(
              `The product of the roots is $\\rho^2 = ${c.rhoSq}$, the constant term of $${charTex(c.p, c.q)}$, and their sum is twice the real part $${c.mu}$, which is $${c.p}$.`,
              `两根之积是 $\\rho^2 = ${c.rhoSq}$，正是 $${charTex(c.p, c.q)}$ 的常数项；两根之和是实部 $${c.mu}$ 的两倍，即 $${c.p}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "terms-from-a-complex-root-solution",
      title: t("Finding a term", "求某一项"),
      explanation: t(
        "With complex roots $\\rho(\\cos \\theta \\pm i \\sin \\theta)$ the real solution is $\\rho^n(A \\cos n\\theta + B \\sin n\\theta)$. For $a_n = 8a_{n-1} - 32a_{n-2}$ with $a_0 = 1$, $a_1 = 4$: $A = 1$, and $4\\sqrt{2}(\\cos 45^\\circ + B \\sin 45^\\circ) = 4 + 4B = 4$ gives $B = 0$. So $a_n = (4\\sqrt{2})^n \\cos 45n^\\circ$, and $a_4 = 1024 \\cos 180^\\circ = -1024$.\n\n> **Watch out.** Reduce the angle $n\\theta$ before taking its cosine: $\\cos 180^\\circ = -1$ flips the sign. An even power of $4\\sqrt{2}$ is a whole number, since $(4\\sqrt{2})^2 = 32$.",
        "对于复根 $\\rho(\\cos \\theta \\pm i \\sin \\theta)$，实数解为 $\\rho^n(A \\cos n\\theta + B \\sin n\\theta)$。对 $a_n = 8a_{n-1} - 32a_{n-2}$，$a_0 = 1$，$a_1 = 4$：$A = 1$，由 $4\\sqrt{2}(\\cos 45^\\circ + B \\sin 45^\\circ) = 4 + 4B = 4$ 得 $B = 0$。所以 $a_n = (4\\sqrt{2})^n \\cos 45n^\\circ$，$a_4 = 1024 \\cos 180^\\circ = -1024$。\n\n> **注意。** 取余弦前先化简角 $n\\theta$：$\\cos 180^\\circ = -1$ 会改变符号。$4\\sqrt{2}$ 的偶数次幂是整数，因为 $(4\\sqrt{2})^2 = 32$。",
      ),
      generate(rng) {
        const c = randomComplexRoots(rng);
        const k = rng.nonZero(-3, 3);
        const N = rng.int(4, 12);
        const a = iterate(Q.of(k), Q.of(k * c.mu), c.p, c.q, zero, N);
        const value = a[N]!;
        const rhoPow = (e: string) => (c.rho === "1" ? "" : `(${c.rho})^{${e}}`);
        return numberProblem({
          prompt: t(
            `$a_n = ${rec2(c.p, c.q)}$ with $a_0 = ${k}$ and $a_1 = ${k * c.mu}$. Find $a_{${N}}$.`,
            `$a_n = ${rec2(c.p, c.q)}$，$a_0 = ${k}$，$a_1 = ${k * c.mu}$。求 $a_{${N}}$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              value.neg(),
              "The sign is off; reduce the angle and check the sign of its cosine.",
              "符号错了；化简角度后检查它的余弦的符号。",
            ),
            why(a[N - 1]!, `That is $a_{${N - 1}}$.`, `那是 $a_{${N - 1}}$。`),
            why(Q.of(k).mul(Q.of(c.rhoSq).pow(Math.floor(N / 2))), "That leaves out the cosine factor.", "那是漏掉了余弦因子。"),
          ]),
          solution: walked(
            [
              [
                ["Write the roots in polar form", "把根写成极坐标形式"],
                t(
                  `The roots of $${charTex(c.p, c.q)} = 0$ are $${c.rootTex} = ${polar(c)}$, so $a_n = ${rhoPow("n")}(A \\cos ${c.theta}n^\\circ + B \\sin ${c.theta}n^\\circ)$.`,
                  `$${charTex(c.p, c.q)} = 0$ 的根为 $${c.rootTex} = ${polar(c)}$，所以 $a_n = ${rhoPow("n")}(A \\cos ${c.theta}n^\\circ + B \\sin ${c.theta}n^\\circ)$。`,
                ),
              ],
              [
                ["Find the constants", "求常数"],
                t(
                  `$a_0 = A = ${k}$. The cosine part alone gives $a_1 = ${c.mu === 0 ? "0" : `${cf(c.mu)}A`} = ${k * c.mu}$, since $${c.rho === "1" ? "" : c.rho}\\cos ${c.theta}^\\circ = ${c.mu}$, so $B = 0$.`,
                  `$a_0 = A = ${k}$。因为 $${c.rho === "1" ? "" : c.rho}\\cos ${c.theta}^\\circ = ${c.mu}$，余弦部分单独就给出 $a_1 = ${c.mu === 0 ? "0" : `${cf(c.mu)}A`} = ${k * c.mu}$，所以 $B = 0$。`,
                ),
              ],
              [
                [`Evaluate $a_{${N}}$`, `计算 $a_{${N}}$`],
                t(
                  `$a_{${N}} = ${chain(`${cf(k)}${rhoPow(String(N))} \\cos ${c.theta * N}^\\circ`, value.toLatex())}$.`,
                  `$a_{${N}} = ${chain(`${cf(k)}${rhoPow(String(N))} \\cos ${c.theta * N}^\\circ`, value.toLatex())}$。`,
                ),
              ],
            ],
            t(
              `The rule itself gives $a_2 = ${a[2]!.toLatex()}$, $a_3 = ${a[3]!.toLatex()}$ and so on, up to $a_{${N}} = ${value.toLatex()}$.`,
              `直接用递推得 $a_2 = ${a[2]!.toLatex()}$，$a_3 = ${a[3]!.toLatex()}$，依此类推，直到 $a_{${N}} = ${value.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** secondOrderRecurrenceRelationsWithPolynomialForcing finds polynomial particular solutions of second-order recurrences. */
export const secondOrderRecurrenceRelationsWithPolynomialForcing: TopicDef = {
  id: "second-order-recurrence-relations-with-polynomial-forcing",
  title: t("Second-Order Recurrence Relations With Polynomial Forcing", "多项式强迫项的二阶递推关系"),
  summary: t(
    "For aₙ = p aₙ₋₁ + q aₙ₋₂ + f(n) with f linear, try cn + e unless 1 is a characteristic root; if 1 is a simple root, a constant forcing term needs cn instead.",
    "对 aₙ = p aₙ₋₁ + q aₙ₋₂ + f(n)（f 为一次式），除非 1 是特征根，否则设 cn + e；若 1 是单特征根，常数强迫项需改设 cn。",
  ),
  intro: t(
    "The recurrence $a_n = 6a_{n-1} - 8a_{n-2} + 3$ has the constant particular solution $e = 1$, since $e = 6e - 8e + 3$ gives $3e = 3$. Its characteristic roots are $2$ and $4$, so every solution is $a_n = A \\cdot 2^n + B \\cdot 4^n + 1$.\n\nCheck: putting $a_n = 1$ into the rule gives $6 - 8 + 3 = 1$.\n\nIn this lesson we find polynomial particular solutions of second-order recurrences, including the case where $1$ is a characteristic root.",
    "递推 $a_n = 6a_{n-1} - 8a_{n-2} + 3$ 有常数特解 $e = 1$，因为由 $e = 6e - 8e + 3$ 得 $3e = 3$。它的特征根是 $2$ 和 $4$，所以每个解都是 $a_n = A \\cdot 2^n + B \\cdot 4^n + 1$。\n\n检验：把 $a_n = 1$ 代入递推得 $6 - 8 + 3 = 1$。\n\n本课我们求二阶递推的多项式特解，包括 $1$ 是特征根的情形。",
  ),
  prerequisites: [
    "second-order-homogeneous-recurrence-relations-with-distinct-real-roots",
    "first-order-recurrence-relations-with-polynomial-forcing",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "linear-particular-solutions-of-second-order-recurrences",
      title: t("Linear particular solutions", "一次特解"),
      explanation: t(
        "Try a linear expression $cn + e$ and match the coefficient of $n$ and the constant on both sides. For $a_n = 6a_{n-1} - 8a_{n-2} + 3n - 1$, the $n$ terms give $c = 6c - 8c + 3$, so $3c = 3$ and $c = 1$. The constants give $e = 6(e - c) - 8(e - 2c) - 1 = -2e + 10c - 1$, so $3e = 9$ and $e = 3$.\n\n> **Watch out.** The shifts bring constants with them: $c(n - 1)$ and $c(n - 2)$ add $-pc$ and $-2qc$ to the constant terms. Find $c$ first, then use it when matching the constants.",
        "尝试一次式 $cn + e$，再比较两边 $n$ 的系数和常数项。对 $a_n = 6a_{n-1} - 8a_{n-2} + 3n - 1$，比较 $n$ 的系数：$c = 6c - 8c + 3$，所以 $3c = 3$，$c = 1$。比较常数项：$e = 6(e - c) - 8(e - 2c) - 1 = -2e + 10c - 1$，所以 $3e = 9$，$e = 3$。\n\n> **注意。** 平移会带来常数：$c(n - 1)$ 和 $c(n - 2)$ 给常数项添上 $-pc$ 和 $-2qc$。先求 $c$，再在比较常数项时用上它。",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(-3, 4);
          q = rng.nonZero(-4, 4);
        } while (1 - p - q === 0);
        const alpha = rng.nonZero(-6, 6);
        const beta = rng.int(-6, 6);
        const D = 1 - p - q;
        const c = Q.of(alpha, D);
        const e = Q.of(beta)
          .sub(c.mul(Q.of(p + 2 * q)))
          .div(Q.of(D));
        const askE = rng.bool();
        const rec = `${rec2(p, q)}${term(alpha, "n")}${term(beta, "")}`;
        const substituted = `${poly([p, "(c(n - 1) + e)"], [q, "(c(n - 2) + e)"])}${term(alpha, "n")}${term(beta, "")}`;
        const constants = `${poly([D, "e"])} = ${poly([beta, ""], [-(p + 2 * q), "c"])}`;
        const nTerms = lin([
          [p, "c"],
          [q, "c"],
          [alpha, ""],
        ]);
        const constTerms = lin([
          [p + q, "e"],
          [-(p + 2 * q), "c"],
          [beta, ""],
        ]);
        const a1 = c.add(e);
        const a2 = c.mul(Q.of(2)).add(e);
        const ruleA2 = lin([
          [a1.mul(Q.of(p)), ""],
          [e.mul(Q.of(q)), ""],
          [2 * alpha + beta, ""],
        ]);
        return numberProblem({
          prompt: t(
            `$a_n = ${rec}$ has a particular solution of the form $a_n = cn + e$. Find $${askE ? "e" : "c"}$.`,
            `$a_n = ${rec}$ 有形如 $a_n = cn + e$ 的特解。求 $${askE ? "e" : "c"}$。`,
          ),
          answer: askE ? e : c,
          mistakes: distinct(
            askE
              ? [
                  why(
                    Q.of(beta, D),
                    "That leaves out the $-pc - 2qc$ that the shifted terms bring to the constants.",
                    "那是漏掉了平移项带进常数项的 $-pc - 2qc$。",
                  ),
                  why(
                    Q.of(beta)
                      .add(c.mul(Q.of(p + 2 * q)))
                      .div(Q.of(D)),
                    "That takes the shifted terms as $+pc + 2qc$; the $-1$ and $-2$ make them negative.",
                    "那是把平移项算成了 $+pc + 2qc$；其中的 $-1$ 和 $-2$ 使它们为负。",
                  ),
                  why(e.neg(), "The sign is off; solve the equation for $e$ again.", "符号错了；重新解关于 $e$ 的方程。"),
                ]
              : [
                  why(
                    Q.of(-alpha, D),
                    "The sign is off: move the $c$ terms to the left before dividing.",
                    "符号错了：先把含 $c$ 的项移到左边再相除。",
                  ),
                  why(Q.of(alpha).mul(Q.of(D)), `That multiplies by $${D}$ instead of dividing.`, `那是乘以 $${D}$，而不是除以它。`),
                  why(
                    Q.of(alpha),
                    "That is the coefficient of $n$ in the forcing term; the shifted terms change it.",
                    "那是强迫项中 $n$ 的系数；平移项会改变它。",
                  ),
                ],
          ),
          solution: walked(
            [
              [["Substitute the trial solution", "代入试探解"], t(`$cn + e = ${substituted}$.`, `$cn + e = ${substituted}$。`)],
              [
                ["Match the coefficients of $n$", "比较 $n$ 的系数"],
                t(
                  `$c = ${nTerms}$, so $${term(D, "c", true)} = ${alpha}$ and $c = ${c.toLatex()}$.`,
                  `$c = ${nTerms}$，所以 $${term(D, "c", true)} = ${alpha}$，$c = ${c.toLatex()}$。`,
                ),
              ],
              [
                ["Match the constants", "比较常数项"],
                t(
                  `$e = ${constTerms}$, so $${constants}$ and $e = ${e.toLatex()}$.`,
                  `$e = ${constTerms}$，所以 $${constants}$，$e = ${e.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The trial solution gives $a_0 = ${e.toLatex()}$, $a_1 = ${a1.toLatex()}$ and $a_2 = ${a2.toLatex()}$, and the rule gives $a_2 = ${chain(ruleA2, a2.toLatex())}$.`,
              `试探解给出 $a_0 = ${e.toLatex()}$，$a_1 = ${a1.toLatex()}$，$a_2 = ${a2.toLatex()}$；由递推得 $a_2 = ${chain(ruleA2, a2.toLatex())}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "constant-forcing-when-one-is-a-root",
      title: t("When 1 is a characteristic root", "当 1 是特征根时"),
      explanation: t(
        "When $1$ is a characteristic root, constants solve the homogeneous part, so multiply the guess by $n$. $a_n = 7a_{n-1} - 6a_{n-2} + 10$ has characteristic roots $1$ and $6$, so a constant particular solution fails. Try $cn$: $cn = 7c(n - 1) - 6c(n - 2) + 10 = cn + 5c + 10$, so $0 = 5c + 10$ and $c = -2$.\n\n> **Watch out.** After the $n$ terms cancel, what is left are the constants from the shifts, $-pc - 2qc$, and the forcing. Keep their signs: here $-7c + 12c = 5c$.",
        "当 $1$ 是特征根时，常数是齐次部分的解，所以要把猜测乘以 $n$。$a_n = 7a_{n-1} - 6a_{n-2} + 10$ 的特征根为 $1$ 和 $6$，所以常数特解不行。设 $cn$：$cn = 7c(n - 1) - 6c(n - 2) + 10 = cn + 5c + 10$，所以 $0 = 5c + 10$，$c = -2$。\n\n> **注意。** $n$ 的项抵消后，剩下的是平移带来的常数 $-pc - 2qc$ 和强迫项。注意它们的符号：这里 $-7c + 12c = 5c$。",
      ),
      generate(rng) {
        const s = rng.pick([-3, -2, -1, 2, 3, 4]);
        const p = 1 + s;
        const q = -s;
        const k = rng.nonZero(-8, 8);
        const value = Q.of(k, p + 2 * q);
        const a2 = lin([
          [value.mul(Q.of(p)), ""],
          [k, ""],
        ]);
        return numberProblem({
          prompt: t(
            `The characteristic roots of $a_n = ${rec2(p, q)}${term(k, "")}$ are $1$ and $${s}$. It has a particular solution of the form $a_n = cn$. Find $c$.`,
            `$a_n = ${rec2(p, q)}${term(k, "")}$ 的特征根为 $1$ 和 $${s}$。它有形如 $a_n = cn$ 的特解。求 $c$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              Q.of(k * s, 1 - s),
              "That brings in a factor of the other root; after the $n$ terms cancel, only the constants from the shifts balance the forcing.",
              "那是多出了另一个根的因子；$n$ 的项抵消后，只有平移带来的常数与强迫项相平衡。",
            ),
            why(Q.of(-k, p + 2 * q), "The sign is off; the shifts contribute $-(p + 2q)c$.", "符号错了；平移贡献的是 $-(p + 2q)c$。"),
            why(
              Q.of(k, s),
              "That divides by the other root; divide by $p + 2q$, from the constants the shifts leave.",
              "那是除以另一个根；应除以平移留下的常数 $p + 2q$。",
            ),
            why(Q.of(k), "That is the forcing constant itself.", "那是强迫项的常数本身。"),
          ]),
          solution: walked(
            [
              [
                ["Substitute $cn$", "代入 $cn$"],
                t(
                  `$cn = ${poly([p, "c(n - 1)"], [q, "c(n - 2)"])}${term(k, "")}$.`,
                  `$cn = ${poly([p, "c(n - 1)"], [q, "c(n - 2)"])}${term(k, "")}$。`,
                ),
              ],
              [
                ["Collect the terms", "合并同类项"],
                t(
                  `The $n$ terms cancel because $${plus(p, q)} = 1$, leaving $0 = ${lin([
                    [-(p + 2 * q), "c"],
                    [k, ""],
                  ])}$, so $c = ${value.toLatex()}$.`,
                  `因为 $${plus(p, q)} = 1$，$n$ 的项相互抵消，剩下 $0 = ${lin([
                    [-(p + 2 * q), "c"],
                    [k, ""],
                  ])}$，所以 $c = ${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `With $a_0 = 0$ and $a_1 = c = ${value.toLatex()}$, the rule gives $a_2 = ${chain(a2, value.mul(Q.of(2)).toLatex())}$, which is $2c$.`,
              `取 $a_0 = 0$，$a_1 = c = ${value.toLatex()}$，由递推得 $a_2 = ${chain(a2, value.mul(Q.of(2)).toLatex())}$，正是 $2c$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** secondOrderRecurrenceRelationsWithExponentialForcing finds exponential particular solutions of second-order recurrences. */
export const secondOrderRecurrenceRelationsWithExponentialForcing: TopicDef = {
  id: "second-order-recurrence-relations-with-exponential-forcing",
  title: t("Second-Order Recurrence Relations With Exponential Forcing", "指数强迫项的二阶递推关系"),
  summary: t(
    "For aₙ = p aₙ₋₁ + q aₙ₋₂ + k sⁿ, try K sⁿ, giving K = ks²/(s² − ps − q), unless s is a characteristic root; if s is a simple root, try Knsⁿ.",
    "对 aₙ = p aₙ₋₁ + q aₙ₋₂ + k sⁿ，设 K sⁿ，得 K = ks²/(s² − ps − q)，除非 s 是特征根；若 s 是单特征根，则设 Knsⁿ。",
  ),
  intro: t(
    "For $a_n = 5a_{n-1} - 6a_{n-2} + 6^n$, try $K \\cdot 6^n$ and divide by $6^{n-2}$: $36K = 30K - 6K + 36$, so $12K = 36$ and $K = 3$. The characteristic roots are $2$ and $3$, so every solution is $a_n = A \\cdot 2^n + B \\cdot 3^n + 3 \\cdot 6^n$.\n\nCheck: $5 \\cdot 3 \\cdot 6 - 6 \\cdot 3 + 36 = 90 - 18 + 36 = 108$, which is $3 \\cdot 6^2$.\n\nIn this lesson we find exponential particular solutions of second-order recurrences, including the case where the base is a characteristic root, and fit the constants of the solution.",
    "对 $a_n = 5a_{n-1} - 6a_{n-2} + 6^n$，设 $K \\cdot 6^n$ 并除以 $6^{n-2}$：$36K = 30K - 6K + 36$，所以 $12K = 36$，$K = 3$。特征根是 $2$ 和 $3$，所以每个解都是 $a_n = A \\cdot 2^n + B \\cdot 3^n + 3 \\cdot 6^n$。\n\n检验：$5 \\cdot 3 \\cdot 6 - 6 \\cdot 3 + 36 = 90 - 18 + 36 = 108$，正是 $3 \\cdot 6^2$。\n\n本课我们求二阶递推的指数特解，包括底数是特征根的情形，并确定解中的常数。",
  ),
  prerequisites: [
    "second-order-homogeneous-recurrence-relations-with-distinct-real-roots",
    "first-order-recurrence-relations-with-exponential-forcing",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "exponential-particular-solutions-of-second-order-recurrences",
      title: t("Exponential particular solutions", "指数特解"),
      explanation: t(
        "Try a constant times the forcing exponential, and divide by its lowest power to get one equation for the constant. For $a_n = a_{n-1} + 6a_{n-2} + 2 \\cdot 6^n$, try $K \\cdot 6^n$ and divide by $6^{n-2}$: $36K = 6K + 6K + 72$, so $24K = 72$ and $K = 3$.\n\n> **Watch out.** Dividing by $s^{n-2}$ turns the forcing $k \\cdot s^n$ into $ks^2$, not $k$. The bracket $s^2 - ps - q$ is the characteristic polynomial at $s$, which is not zero because $s$ is not a root.",
        "尝试强迫指数函数的常数倍，再除以它的最低次幂，得到关于常数的一个方程。对 $a_n = a_{n-1} + 6a_{n-2} + 2 \\cdot 6^n$，设 $K \\cdot 6^n$，两边除以 $6^{n-2}$：$36K = 6K + 6K + 72$，所以 $24K = 72$，$K = 3$。\n\n> **注意。** 除以 $s^{n-2}$ 后，强迫项 $k \\cdot s^n$ 变成 $ks^2$，不是 $k$。括号 $s^2 - ps - q$ 是特征多项式在 $s$ 处的值，因为 $s$ 不是根，它不为零。",
      ),
      generate(rng) {
        const { p, q, r1, r2 } = randomRoots(rng);
        let s: number;
        do s = rng.pick([-3, -2, 2, 3, 4, 5]);
        while (s === r1 || s === r2);
        const k = rng.nonZero(-4, 4);
        const D = s * s - p * s - q;
        const value = Q.of(k * s * s, D);
        return numberProblem({
          prompt: t(
            `$a_n = ${rec2(p, q)}${term(k, `\\cdot ${pn(s)}^n`)}$ has a particular solution of the form $K \\cdot ${pn(s)}^n$. Find $K$.`,
            `$a_n = ${rec2(p, q)}${term(k, `\\cdot ${pn(s)}^n`)}$ 有形如 $K \\cdot ${pn(s)}^n$ 的特解。求 $K$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              Q.of(k, D),
              "That forgets the factor $s^2$ that the forcing keeps after dividing by $s^{n-2}$.",
              "那是忘了除以 $s^{n-2}$ 后强迫项还保留的因子 $s^2$。",
            ),
            why(value.neg(), "The sign is off; the bracket is $s^2 - ps - q$.", "符号错了；括号是 $s^2 - ps - q$。"),
            why(
              Q.of(k * s, D),
              "That keeps only one factor of $s$; dividing $s^n$ by $s^{n-2}$ leaves $s^2$.",
              "那是只保留了一个 $s$；$s^n$ 除以 $s^{n-2}$ 剩下 $s^2$。",
            ),
            why(Q.of(k), "That is the coefficient of the forcing itself.", "那是强迫项本身的系数。"),
          ]),
          solution: walked(
            [
              [
                ["Substitute the guess", "代入猜测"],
                t(
                  `$K \\cdot ${pn(s)}^n = ${lin([
                    [p, `K \\cdot ${pn(s)}^{n-1}`],
                    [q, `K \\cdot ${pn(s)}^{n-2}`],
                  ])}${term(k, `\\cdot ${pn(s)}^n`)}$.`,
                  `$K \\cdot ${pn(s)}^n = ${lin([
                    [p, `K \\cdot ${pn(s)}^{n-1}`],
                    [q, `K \\cdot ${pn(s)}^{n-2}`],
                  ])}${term(k, `\\cdot ${pn(s)}^n`)}$。`,
                ),
              ],
              [
                [`Divide by $${pn(s)}^{n-2}$`, `两边除以 $${pn(s)}^{n-2}$`],
                t(
                  `$${s * s}K = ${lin([
                    [p * s, "K"],
                    [q, "K"],
                    [k * s * s, ""],
                  ])}$, so $${term(D, "K", true)} = ${k * s * s}$ and $K = ${value.toLatex()}$.`,
                  `$${s * s}K = ${lin([
                    [p * s, "K"],
                    [q, "K"],
                    [k * s * s, ""],
                  ])}$，所以 $${term(D, "K", true)} = ${k * s * s}$，$K = ${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The bracket is the characteristic polynomial at $x = ${s}$: $${s * s} - ${pn(p * s)} - ${pn(q)} = ${D}$, and $${by(pn(D), value)} = ${k * s * s}$.`,
              `括号是特征多项式在 $x = ${s}$ 处的值：$${s * s} - ${pn(p * s)} - ${pn(q)} = ${D}$，且 $${by(pn(D), value)} = ${k * s * s}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "exponential-forcing-at-a-characteristic-root",
      title: t("Forcing at a characteristic root", "强迫项的底数是特征根"),
      explanation: t(
        "When the forcing base is a characteristic root, multiply the guess by $n$; the terms containing $n$ then cancel. $a_n = 5a_{n-1} + 6a_{n-2} + 7 \\cdot 6^n$ has the root $6$, so try $Kn \\cdot 6^n$. Dividing by $6^{n-2}$: $36Kn = 30K(n - 1) + 6K(n - 2) + 252$. The $n$ terms cancel, leaving $42K = 252$, so $K = 6$.\n\n> **Watch out.** A plain $K \\cdot s^n$ cannot work when $s$ is a root, since it solves the homogeneous part. After the $n$ terms cancel, the constants left are $-psK - 2qK$, so watch their signs.",
        "当强迫项的底数是特征根时，把猜测乘以 $n$，含 $n$ 的项就会相互抵消。$a_n = 5a_{n-1} + 6a_{n-2} + 7 \\cdot 6^n$ 有特征根 $6$，所以设 $Kn \\cdot 6^n$。两边除以 $6^{n-2}$：$36Kn = 30K(n - 1) + 6K(n - 2) + 252$。$n$ 的项抵消，剩下 $42K = 252$，所以 $K = 6$。\n\n> **注意。** $s$ 是根时，单纯的 $K \\cdot s^n$ 不行，因为它是齐次部分的解。$n$ 的项抵消后，剩下的常数是 $-psK - 2qK$，注意它们的符号。",
      ),
      generate(rng) {
        let roots: Roots;
        do roots = randomRoots(rng);
        while (Math.abs(roots.r1) < 2 && Math.abs(roots.r2) < 2);
        const { p, q, r1, r2 } = roots;
        const s = Math.abs(r1) < 2 ? r2 : Math.abs(r2) < 2 ? r1 : rng.bool() ? r1 : r2;
        const other = s === r1 ? r2 : r1;
        const k = rng.nonZero(-4, 4);
        const value = Q.of(k * s, s - other);
        const left = p * s + 2 * q;
        return numberProblem({
          prompt: t(
            `The characteristic roots of $a_n = ${rec2(p, q)}${term(k, `\\cdot ${pn(s)}^n`)}$ are $${r1}$ and $${r2}$. It has a particular solution of the form $Kn \\cdot ${pn(s)}^n$. Find $K$.`,
            `$a_n = ${rec2(p, q)}${term(k, `\\cdot ${pn(s)}^n`)}$ 的特征根为 $${r1}$ 和 $${r2}$。它有形如 $Kn \\cdot ${pn(s)}^n$ 的特解。求 $K$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              Q.of(k, s - other),
              "That loses a factor of $s$: the forcing becomes $ks^2$ after dividing by $s^{n-2}$.",
              "那是丢了一个因子 $s$：除以 $s^{n-2}$ 后强迫项变成 $ks^2$。",
            ),
            why(Q.of(k * s, other - s), "The sign is off; the constants left are $-(ps + 2q)K$.", "符号错了；剩下的常数是 $-(ps + 2q)K$。"),
            why(
              Q.of(k * s * s, s - other),
              `That divides by $${s} - ${pn(other)}$ only; the constant left is $${left}K$, and $${left} = ${s}(${s} - ${pn(other)})$.`,
              `那是只除以了 $${s} - ${pn(other)}$；剩下的常数是 $${left}K$，而 $${left} = ${s}(${s} - ${pn(other)})$。`,
            ),
            why(Q.of(k), "That is the forcing coefficient itself.", "那是强迫项的系数本身。"),
          ]),
          solution: walked(
            [
              [
                [`Substitute $Kn \\cdot ${pn(s)}^n$`, `代入 $Kn \\cdot ${pn(s)}^n$`],
                t(
                  `Dividing by $${pn(s)}^{n-2}$: $${s * s}Kn = ${lin([
                    [p * s, "K(n - 1)"],
                    [q, "K(n - 2)"],
                    [k * s * s, ""],
                  ])}$.`,
                  `两边除以 $${pn(s)}^{n-2}$：$${s * s}Kn = ${lin([
                    [p * s, "K(n - 1)"],
                    [q, "K(n - 2)"],
                    [k * s * s, ""],
                  ])}$。`,
                ),
              ],
              [
                ["Cancel the $n$ terms", "消去含 $n$ 的项"],
                t(
                  `Since $${s}$ is a root, $${s * s} = ${lin([
                    [p * s, ""],
                    [q, ""],
                  ])}$, so the $n$ terms cancel and $${term(left, "K", true)} = ${k * s * s}$, giving $K = ${value.toLatex()}$.`,
                  `因为 $${s}$ 是根，$${s * s} = ${lin([
                    [p * s, ""],
                    [q, ""],
                  ])}$，所以 $n$ 的项抵消，$${term(left, "K", true)} = ${k * s * s}$，得 $K = ${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `Putting $K = ${value.toLatex()}$ back, $${by(pn(left), value)} = ${k * s * s}$, as needed.`,
              `代回 $K = ${value.toLatex()}$，$${by(pn(left), value)} = ${k * s * s}$，符合要求。`,
            ),
          ),
        });
      },
    },
  ],
};

/** oneMinus writes 1 − rx. */
const oneMinus = (r: number) => `1 ${r < 0 ? "+" : "-"} ${Math.abs(r) === 1 ? "" : Math.abs(r)}x`;

/** pieces writes c₁/(1 − r₁x) + c₂/(1 − r₂x) + ⋯ with each sign in front of its fraction, skipping zero terms. */
const pieces = (parts: readonly (readonly [number | Q, number])[]) => {
  let out = "";
  for (const [c, r] of parts) {
    const q = asQ(c);
    if (q.isZero()) continue;
    const a = q.abs();
    const bottom = a.d === 1n ? oneMinus(r) : `${a.d}(${oneMinus(r)})`;
    const sign = q.sign() < 0 ? (out === "" ? "-" : " - ") : out === "" ? "" : " + ";
    out += `${sign}\\frac{${a.n}}{${bottom}}`;
  }
  return out === "" ? "0" : out;
};

/** generatingFunctions reads coefficients of generating functions built from geometric series. */
export const generatingFunctions: TopicDef = {
  id: "generating-functions",
  title: t("Generating Functions", "生成函数"),
  summary: t(
    "The generating function of a₀, a₁, a₂, … is G(x) = Σ aₙxⁿ. Since 1/(1 − rx) = Σ rⁿxⁿ, the sequence c·rⁿ has generating function c/(1 − rx), and (n + 1)rⁿ has 1/(1 − rx)².",
    "数列 a₀, a₁, a₂, … 的生成函数为 G(x) = Σ aₙxⁿ。由 1/(1 − rx) = Σ rⁿxⁿ，数列 c·rⁿ 的生成函数为 c/(1 − rx)，(n + 1)rⁿ 的为 1/(1 − rx)²。",
  ),
  intro: t(
    "A generating function packs a whole sequence into one power series. The sequence $1, 7, 49, 343, \\dots$ of powers of $7$ has $G(x) = 1 + 7x + 49x^2 + \\dots = \\frac{1}{1 - 7x}$.\n\nCheck: multiplying $(1 - 7x)(1 + 7x + 49x^2 + 343x^3 + \\dots)$, each term $7^nx^n$ cancels against $-7x \\cdot 7^{n-1}x^{n-1}$, leaving just $1$.\n\nIn this lesson we read coefficients of generating functions built from geometric series and their squares, and count with products of finite sums.",
    "生成函数把整个数列装进一个幂级数。$7$ 的幂组成的数列 $1, 7, 49, 343, \\dots$ 的生成函数是 $G(x) = 1 + 7x + 49x^2 + \\dots = \\frac{1}{1 - 7x}$。\n\n检验：计算 $(1 - 7x)(1 + 7x + 49x^2 + 343x^3 + \\dots)$，每一项 $7^nx^n$ 都与 $-7x \\cdot 7^{n-1}x^{n-1}$ 抵消，只剩下 $1$。\n\n本课我们读出由几何级数及其平方构成的生成函数的系数，并用有限和的乘积来计数。",
  ),
  prerequisites: ["introduction-to-recurrence-relations", "representing-functions-as-power-series"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "coefficients-of-geometric-generating-functions",
      title: t("Coefficients of c/(1 − rx)", "c/(1 − rx) 的系数"),
      explanation: t(
        "A constant over $1 - rx$ is a geometric series, so its coefficients are the constant times powers of $r$. $\\frac{5}{1 + 7x} = 5\\sum (-7)^n x^n$, so the coefficient of $x^3$ is $5 \\cdot (-343) = -1715$.\n\n> **Watch out.** Read $r$ with its sign: $1 + 7x$ is $1 - (-7)x$, so $r = -7$ and the odd coefficients are negative. The coefficient of $x^n$ uses $r^n$, not $r^{n+1}$.",
        "常数除以 $1 - rx$ 是一个几何级数，所以它的系数是该常数乘以 $r$ 的幂。$\\frac{5}{1 + 7x} = 5\\sum (-7)^n x^n$，所以 $x^3$ 的系数为 $5 \\cdot (-343) = -1715$。\n\n> **注意。** 读 $r$ 时要带上符号：$1 + 7x$ 是 $1 - (-7)x$，所以 $r = -7$，奇数次项的系数为负。$x^n$ 的系数用 $r^n$，不是 $r^{n+1}$。",
      ),
      generate(rng) {
        const r = rng.pick(RATIOS);
        const c = rng.nonZero(-6, 6);
        const n = rng.int(2, 7);
        const value = c * r ** n;
        const prev = c * r ** (n - 1);
        return numberProblem({
          prompt: t(
            `$G(x) = \\frac{${c}}{${oneMinus(r)}}$ is the generating function of $a_0, a_1, a_2, \\dots$. Find $a_{${n}}$.`,
            `$G(x) = \\frac{${c}}{${oneMinus(r)}}$ 是数列 $a_0, a_1, a_2, \\dots$ 的生成函数。求 $a_{${n}}$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              c * (-r) ** n,
              `That drops the sign of the ratio: $${oneMinus(r)}$ is $1 - ${pn(r)}x$.`,
              `那是丢了比的符号：$${oneMinus(r)}$ 是 $1 - ${pn(r)}x$。`,
            ),
            why(c * r ** (n + 1), "That uses one power too many; $x^n$ goes with $r^n$.", "那是多了一次幂；$x^n$ 对应 $r^n$。"),
            why(c * r ** (n - 1), "That uses one power too few; $x^n$ goes with $r^n$.", "那是少了一次幂；$x^n$ 对应 $r^n$。"),
            why(
              c * r * n,
              `That multiplies by the ratio and by $${n}$; the coefficient uses the power $${pw(r, n)}$.`,
              `那是乘以比再乘以 $${n}$；系数用的是幂 $${pw(r, n)}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Expand the geometric series", "展开几何级数"],
                t(
                  `$\\frac{${c}}{${oneMinus(r)}} = ${cf(c)}\\sum ${pn(r)}^n x^n$.`,
                  `$\\frac{${c}}{${oneMinus(r)}} = ${cf(c)}\\sum ${pn(r)}^n x^n$。`,
                ),
              ],
              [
                ["Read off the coefficient", "读出系数"],
                t(
                  `$a_{${n}} = ${chain(times(c, pw(r, n)), times(c, pn(r ** n)), String(value))}$.`,
                  `$a_{${n}} = ${chain(times(c, pw(r, n)), times(c, pn(r ** n)), String(value))}$。`,
                ),
              ],
            ],
            t(
              `Dividing by the coefficient before it, $${value} \\div ${pn(prev)} = ${r}$, the ratio of the geometric series.`,
              `除以前一项的系数，$${value} \\div ${pn(prev)} = ${r}$，正是几何级数的公比。`,
            ),
          ),
        });
      },
    },
    {
      id: "coefficients-of-squared-geometric-generating-functions",
      title: t("Coefficients of $1/(1 - rx)^2$", "$1/(1 - rx)^2$ 的系数"),
      explanation: t(
        "Differentiating the geometric series gives the coefficients of its square. From $\\frac{1}{1 - x} = \\sum x^n$, differentiating gives $\\frac{1}{(1 - x)^2} = \\sum (n + 1)x^n$. Replacing $x$ by $7x$, the coefficient of $x^2$ in $\\frac{1}{(1 - 7x)^2}$ is $3 \\cdot 7^2 = 147$.\n\n> **Watch out.** The coefficient of $x^n$ in $\\frac{1}{(1 - rx)^2}$ is $(n + 1)r^n$, not $nr^n$. A factor $x$ in the numerator shifts every coefficient one place, so $x^n$ then takes $nr^{n-1}$.",
        "对几何级数求导就得到它的平方的系数。由 $\\frac{1}{1 - x} = \\sum x^n$，求导得 $\\frac{1}{(1 - x)^2} = \\sum (n + 1)x^n$。把 $x$ 换成 $7x$，$\\frac{1}{(1 - 7x)^2}$ 中 $x^2$ 的系数为 $3 \\cdot 7^2 = 147$。\n\n> **注意。** $\\frac{1}{(1 - rx)^2}$ 中 $x^n$ 的系数是 $(n + 1)r^n$，不是 $nr^n$。分子中的因子 $x$ 使每个系数后移一位，此时 $x^n$ 对应 $nr^{n-1}$。",
      ),
      generate(rng) {
        const r = rng.pick(RATIOS);
        const c = rng.nonZero(-3, 3);
        const n = rng.int(2, 6);
        const shift = rng.bool();
        const value = shift ? c * n * r ** (n - 1) : c * (n + 1) * r ** n;
        const num = shift ? (c === 1 ? "x" : c === -1 ? "-x" : `${c}x`) : `${c}`;
        const m = shift ? n - 1 : n;
        const xm = m === 1 ? "x" : `x^{${m}}`;
        return numberProblem({
          prompt: t(
            `$G(x) = \\frac{${num}}{(${oneMinus(r)})^2}$ is the generating function of $a_0, a_1, a_2, \\dots$. Find $a_{${n}}$.`,
            `$G(x) = \\frac{${num}}{(${oneMinus(r)})^2}$ 是数列 $a_0, a_1, a_2, \\dots$ 的生成函数。求 $a_{${n}}$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              c * r ** n,
              "That leaves out the factor $m + 1$ that squaring the geometric series brings.",
              "那是漏掉了几何级数平方带来的因子 $m + 1$。",
            ),
            why(
              c * n * r ** n,
              shift
                ? `That shifts the factor but not the power: with the extra $x$, $x^{${n}}$ comes from $m = ${n - 1}$, so the power is $${pw(r, n - 1)}$.`
                : `That uses the factor $${n}$; the coefficient of $x^{${n}}$ in the squared series takes the factor $${n + 1}$.`,
              shift
                ? `那是只移动了因子而没有移动幂：多了因子 $x$，$x^{${n}}$ 来自 $m = ${n - 1}$，所以幂是 $${pw(r, n - 1)}$。`
                : `那是用了因子 $${n}$；平方级数中 $x^{${n}}$ 的系数带因子 $${n + 1}$。`,
            ),
            why(
              c * (n + 1) * r ** (n - 1),
              shift
                ? `That shifts the power but not the factor: $m = ${n - 1}$ gives the factor $m + 1 = ${n}$.`
                : `That lowers the power by one; $x^{${n}}$ goes with $${pw(r, n)}$.`,
              shift
                ? `那是只移动了幂而没有移动因子：$m = ${n - 1}$ 给出因子 $m + 1 = ${n}$。`
                : `那是把幂降了一次；$x^{${n}}$ 对应 $${pw(r, n)}$。`,
            ),
            why(
              c * (n + 1) * (n + 1) * r ** n,
              "That squares the factor $n + 1$; it appears only once.",
              "那是把因子 $n + 1$ 平方了；它只出现一次。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate the geometric series", "对几何级数求导"],
                t(
                  `$\\frac{1}{(${oneMinus(r)})^2} = \\sum_{m \\ge 0} (m + 1)${pn(r)}^m x^m$.`,
                  `$\\frac{1}{(${oneMinus(r)})^2} = \\sum_{m \\ge 0} (m + 1)${pn(r)}^m x^m$。`,
                ),
              ],
              shift
                ? [
                    ["Shift by the factor $x$", "按因子 $x$ 平移"],
                    t(
                      `Multiplying by $${num}$, the term $x^{${n}}$ comes from $m = ${n - 1}$, so $a_{${n}} = ${chain(times(c, `${n} \\cdot ${pw(r, n - 1)}`), String(value))}$.`,
                      `乘以 $${num}$ 后，$x^{${n}}$ 项来自 $m = ${n - 1}$，所以 $a_{${n}} = ${chain(times(c, `${n} \\cdot ${pw(r, n - 1)}`), String(value))}$。`,
                    ),
                  ]
                : [
                    [`Take $m = ${n}$`, `取 $m = ${n}$`],
                    t(
                      `$a_{${n}} = ${chain(times(c, `${n + 1} \\cdot ${pw(r, n)}`), String(value))}$.`,
                      `$a_{${n}} = ${chain(times(c, `${n + 1} \\cdot ${pw(r, n)}`), String(value))}$。`,
                    ),
                  ],
            ],
            t(
              `Squaring $\\sum ${pn(r)}^i x^i$, the terms of $${xm}$ come from the $${m + 1}$ pairs with $i + j = ${m}$, each with coefficient $${pw(r, m)}$, so the factor $${m + 1}$ is right.`,
              `把 $\\sum ${pn(r)}^i x^i$ 平方，$${xm}$ 的项来自 $i + j = ${m}$ 的 $${m + 1}$ 对，每对的系数都是 $${pw(r, m)}$，所以因子 $${m + 1}$ 是对的。`,
            ),
          ),
        });
      },
    },
  ],
};

/** generatingFunctionsOfHomogeneousRecurrenceRelations turns recurrences into rational generating functions. */
export const generatingFunctionsOfHomogeneousRecurrenceRelations: TopicDef = {
  id: "generating-functions-of-homogeneous-recurrence-relations",
  title: t("Generating Functions of Homogeneous Recurrence Relations", "齐次递推关系的生成函数"),
  summary: t(
    "Multiplying aₙ = p aₙ₋₁ + q aₙ₋₂ by xⁿ and summing gives G(x)(1 − px − qx²) = a₀ + (a₁ − pa₀)x, so G(x) = (a₀ + (a₁ − pa₀)x)/(1 − px − qx²).",
    "把 aₙ = p aₙ₋₁ + q aₙ₋₂ 乘以 xⁿ 再求和，得 G(x)(1 − px − qx²) = a₀ + (a₁ − pa₀)x，所以 G(x) = (a₀ + (a₁ − pa₀)x)/(1 − px − qx²)。",
  ),
  intro: t(
    "For $a_n = 5a_{n-1} - 6a_{n-2}$ with $a_0 = 1$ and $a_1 = 7$, multiplying by $x^n$ and summing gives $G(x)(1 - 5x + 6x^2) = 1 + (7 - 5)x$, so $G(x) = \\frac{1 + 2x}{1 - 5x + 6x^2}$.\n\nCheck: the rule gives $a_2 = 35 - 6 = 29$, and the $x^2$ coefficient of $(1 - 5x + 6x^2)(1 + 7x + 29x^2 + \\dots)$ is $29 - 35 + 6 = 0$, as the numerator needs.\n\nIn this lesson we turn first- and second-order recurrences into rational generating functions, and evaluate them to sum series.",
    "对 $a_n = 5a_{n-1} - 6a_{n-2}$，$a_0 = 1$，$a_1 = 7$，乘以 $x^n$ 再求和，得 $G(x)(1 - 5x + 6x^2) = 1 + (7 - 5)x$，所以 $G(x) = \\frac{1 + 2x}{1 - 5x + 6x^2}$。\n\n检验：由递推得 $a_2 = 35 - 6 = 29$，而 $(1 - 5x + 6x^2)(1 + 7x + 29x^2 + \\dots)$ 中 $x^2$ 的系数为 $29 - 35 + 6 = 0$，与分子相符。\n\n本课我们把一阶和二阶递推变成有理生成函数，并通过求它们的值来求级数的和。",
  ),
  prerequisites: ["generating-functions", "second-order-homogeneous-recurrence-relations-with-distinct-real-roots"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "generating-functions-of-first-order-recurrences",
      title: t("First-order recurrences", "一阶递推关系"),
      explanation: t(
        "Multiplying the recurrence by $x^n$ and summing turns it into an equation for the generating function. If $a_n = 7a_{n-1}$ and $a_0 = 3$, then $G(x) - 3 = 7xG(x)$, so $G(x) = \\frac{3}{1 - 7x}$ and $G\\left(\\frac{1}{10}\\right) = \\frac{3}{3/10} = 10$.\n\n> **Watch out.** The sum $\\sum_{n \\ge 1} a_nx^n$ is $G(x) - a_0$, and $\\sum_{n \\ge 1} ra_{n-1}x^n$ is $rxG(x)$, so the denominator is $1 - rx$, not $1 + rx$. Then substitute the value of $x$ into the whole fraction.",
        "把递推式乘以 $x^n$ 再求和，就把它变成关于生成函数的方程。若 $a_n = 7a_{n-1}$，$a_0 = 3$，则 $G(x) - 3 = 7xG(x)$，所以 $G(x) = \\frac{3}{1 - 7x}$，$G\\left(\\frac{1}{10}\\right) = \\frac{3}{3/10} = 10$。\n\n> **注意。** $\\sum_{n \\ge 1} a_nx^n$ 是 $G(x) - a_0$，$\\sum_{n \\ge 1} ra_{n-1}x^n$ 是 $rxG(x)$，所以分母是 $1 - rx$，不是 $1 + rx$。然后把 $x$ 的值代入整个分式。",
      ),
      generate(rng) {
        const r = rng.pick(RATIOS);
        const a0 = rng.nonZero(-6, 6);
        let m: number;
        do m = rng.int(2, 12);
        while (Math.abs(r) >= m);
        const x = Q.of(1, m);
        const value = Q.of(a0).div(Q.of(1).sub(Q.of(r).mul(x)));
        const den = Q.of(1).sub(Q.of(r).mul(x));
        const ratio = Q.of(r, m);
        return numberProblem({
          prompt: t(
            `$a_n = ${term(r, "a_{n-1}", true)}$ for $n \\ge 1$, with $a_0 = ${a0}$. Its generating function is $G(x) = \\sum a_n x^n$. Find $G\\left(\\frac{1}{${m}}\\right)$.`,
            `$a_n = ${term(r, "a_{n-1}", true)}$（$n \\ge 1$），$a_0 = ${a0}$。其生成函数为 $G(x) = \\sum a_n x^n$。求 $G\\left(\\frac{1}{${m}}\\right)$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              Q.of(a0).div(Q.of(1).add(Q.of(r).mul(x))),
              "The sign is off: moving $rxG(x)$ to the left gives the factor $1 - rx$.",
              "符号错了：把 $rxG(x)$ 移到左边得到因子 $1 - rx$。",
            ),
            why(
              Q.of(1).div(Q.of(1).sub(Q.of(r).mul(x))),
              `That leaves out the starting value $a_0 = ${a0}$ in the numerator.`,
              `那是漏掉了分子中的初值 $a_0 = ${a0}$。`,
            ),
            why(
              Q.of(a0).mul(Q.of(1).sub(Q.of(r).mul(x))),
              "That multiplies by $1 - rx$ instead of dividing.",
              "那是乘以 $1 - rx$，而不是除以它。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Multiply by $x^n$ and sum", "乘以 $x^n$ 并求和"],
                t(
                  `Summing from $n = 1$: $G(x) - a_0 = ${cf(r)}xG(x)$, that is, $G(x) - ${pn(a0)} = ${cf(r)}xG(x)$.`,
                  `从 $n = 1$ 求和：$G(x) - a_0 = ${cf(r)}xG(x)$，即 $G(x) - ${pn(a0)} = ${cf(r)}xG(x)$。`,
                ),
              ],
              [["Solve for $G$", "解出 $G$"], t(`$G(x) = \\frac{${a0}}{${oneMinus(r)}}$.`, `$G(x) = \\frac{${a0}}{${oneMinus(r)}}$。`)],
              [
                [`Put $x = \\frac{1}{${m}}$`, `代入 $x = \\frac{1}{${m}}$`],
                t(
                  `$G\\left(\\frac{1}{${m}}\\right) = \\frac{${a0}}{1 ${r < 0 ? "+" : "-"} \\frac{${Math.abs(r)}}{${m}}} = \\frac{${a0}}{${den.toLatex()}} = ${value.toLatex()}$.`,
                  `$G\\left(\\frac{1}{${m}}\\right) = \\frac{${a0}}{1 ${r < 0 ? "+" : "-"} \\frac{${Math.abs(r)}}{${m}}} = \\frac{${a0}}{${den.toLatex()}} = ${value.toLatex()}$。`,
                ),
              ],
            ],
            t(
              `The series $\\sum_{n \\ge 0} \\frac{a_n}{${m}^n}$ is geometric with first term $${a0}$ and ratio $${ratio.toLatex()}$, so its sum is $\\frac{${a0}}{1 - ${pq(ratio)}} = ${value.toLatex()}$.`,
              `级数 $\\sum_{n \\ge 0} \\frac{a_n}{${m}^n}$ 是首项为 $${a0}$、公比为 $${ratio.toLatex()}$ 的几何级数，所以它的和是 $\\frac{${a0}}{1 - ${pq(ratio)}} = ${value.toLatex()}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "generating-functions-of-second-order-recurrences",
      title: t("Second-order recurrences", "二阶递推关系"),
      explanation: t(
        "Multiplying by $x^n$ and summing from $n = 2$ gives $G(x)(1 - px - qx^2) = a_0 + (a_1 - pa_0)x$: the early terms that the recurrence does not cover go into the numerator. For $a_n = 6a_{n-1} - 9a_{n-2}$ with $a_0 = 2$, $a_1 = 7$: $G(x)(1 - 6x + 9x^2) = 2 + (7 - 12)x$, so $G(x) = \\frac{2 - 5x}{1 - 6x + 9x^2}$.\n\n> **Watch out.** The $x$ coefficient of the numerator is $a_1 - pa_0$, not $a_1$: the sum $\\sum_{n \\ge 2} pa_{n-1}x^n$ is $px(G(x) - a_0)$, which leaves out $pa_0x$.",
        "乘以 $x^n$ 并从 $n = 2$ 求和，得 $G(x)(1 - px - qx^2) = a_0 + (a_1 - pa_0)x$：递推关系未覆盖的前几项进入分子。对 $a_n = 6a_{n-1} - 9a_{n-2}$，$a_0 = 2$，$a_1 = 7$：$G(x)(1 - 6x + 9x^2) = 2 + (7 - 12)x$，所以 $G(x) = \\frac{2 - 5x}{1 - 6x + 9x^2}$。\n\n> **注意。** 分子中 $x$ 的系数是 $a_1 - pa_0$，不是 $a_1$：和 $\\sum_{n \\ge 2} pa_{n-1}x^n$ 等于 $px(G(x) - a_0)$，少了 $pa_0x$。",
      ),
      generate(rng) {
        const p = rng.nonZero(-4, 4);
        const q = rng.nonZero(-4, 4);
        const a0 = rng.int(-5, 5);
        const a1 = rng.int(-5, 5);
        const value = a1 - p * a0;
        const den = lin([
          [1, ""],
          [-p, "x"],
          [-q, "x^2"],
        ]);
        const start = lin([
          [a0, ""],
          [a1, "x"],
        ]);
        return numberProblem({
          prompt: t(
            `$a_n = ${rec2(p, q)}$ for $n \\ge 2$, with $a_0 = ${a0}$ and $a_1 = ${a1}$. Its generating function is $G(x) = \\frac{${a0} + bx}{${den}}$. Find $b$.`,
            `$a_n = ${rec2(p, q)}$（$n \\ge 2$），$a_0 = ${a0}$，$a_1 = ${a1}$。其生成函数为 $G(x) = \\frac{${a0} + bx}{${den}}$。求 $b$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              a1,
              "That forgets to subtract $pa_0$; the sum of $pa_{n-1}x^n$ starts at $n = 2$.",
              "那是忘了减去 $pa_0$；$pa_{n-1}x^n$ 的和从 $n = 2$ 开始。",
            ),
            why(a1 + p * a0, "The sign is off: the numerator is $a_0 + (a_1 - pa_0)x$.", "符号错了：分子是 $a_0 + (a_1 - pa_0)x$。"),
            why(
              a1 - q * a0,
              "That uses $q$ in place of $p$; the $x^2$ term of the denominator does not reach the $x$ coefficient.",
              "那是用 $q$ 代替了 $p$；分母的 $x^2$ 项影响不到 $x$ 的系数。",
            ),
            why(a1 - p * a0 - q, "That subtracts $q$ as well; only $pa_0$ comes off.", "那是还减去了 $q$；只需减去 $pa_0$。"),
          ]),
          solution: walked(
            [
              [
                ["Write the sums", "写出各个和"],
                t(
                  "$\\sum_{n \\ge 2} a_nx^n = G(x) - a_0 - a_1x$, $\\sum_{n \\ge 2} a_{n-1}x^n = x(G(x) - a_0)$ and $\\sum_{n \\ge 2} a_{n-2}x^n = x^2G(x)$.",
                  "$\\sum_{n \\ge 2} a_nx^n = G(x) - a_0 - a_1x$，$\\sum_{n \\ge 2} a_{n-1}x^n = x(G(x) - a_0)$，$\\sum_{n \\ge 2} a_{n-2}x^n = x^2G(x)$。",
                ),
              ],
              [
                ["Collect $G$", "整理出 $G$"],
                t(
                  `$G(x) - a_0 - a_1x = ${lin([
                    [p, "x(G(x) - a_0)"],
                    [q, "x^2G(x)"],
                  ])}$, so $G(x)(${den}) = a_0 + (a_1 - pa_0)x$.`,
                  `$G(x) - a_0 - a_1x = ${lin([
                    [p, "x(G(x) - a_0)"],
                    [q, "x^2G(x)"],
                  ])}$，所以 $G(x)(${den}) = a_0 + (a_1 - pa_0)x$。`,
                ),
              ],
              [
                ["Find $b$", "求 $b$"],
                t(
                  `$b = a_1 - pa_0 = ${chain(minus(a1, p * a0), String(value))}$.`,
                  `$b = a_1 - pa_0 = ${chain(minus(a1, p * a0), String(value))}$。`,
                ),
              ],
            ],
            t(
              `The coefficient of $x$ in $(${den})(${start} + \\dots)$ is $${chain(`${a1}${signedN(-p * a0)}`, String(value))}$, as $b$ should be.`,
              `$(${den})(${start} + \\dots)$ 中 $x$ 的系数是 $${chain(`${a1}${signedN(-p * a0)}`, String(value))}$，与 $b$ 相符。`,
            ),
          ),
        });
      },
    },
  ],
};

/** PartialFractions is a generating function A/(1 − r₁x) + B/(1 − r₂x) with its combined form. */
interface PartialFractions {
  readonly r1: number;
  readonly r2: number;
  readonly A: number;
  readonly B: number;
  readonly tex: string;
}

/** randomPartialFractions builds (A + B − (Ar₂ + Br₁)x)/((1 − r₁x)(1 − r₂x)). */
function randomPartialFractions(rng: Rng): PartialFractions {
  const { r1, r2 } = randomRoots(rng);
  const A = rng.nonZero(-4, 4);
  const B = rng.nonZero(-4, 4);
  const num = lin([
    [A + B, ""],
    [-(A * r2 + B * r1), "x"],
  ]);
  return { r1, r2, A, B, tex: `\\frac{${num}}{(${oneMinus(r1)})(${oneMinus(r2)})}` };
}

/** numeratorCheck checks a₁ − (r₁ + r₂)a₀ against the x coefficient of the numerator. */
const numeratorCheck = (f: PartialFractions) => {
  const a0 = f.A + f.B;
  const a1 = f.A * f.r1 + f.B * f.r2;
  const x = -(f.A * f.r2 + f.B * f.r1);
  const head = `$a_0 = ${chain(
    lin([
      [f.A, ""],
      [f.B, ""],
    ]),
    String(a0),
  )}$ and $a_1 = ${chain(
    lin([
      [f.A * f.r1, ""],
      [f.B * f.r2, ""],
    ]),
    String(a1),
  )}$`;
  const tail = `$a_1 - (${plus(f.r1, f.r2)})a_0 = ${chain(minus(a1, (f.r1 + f.r2) * a0), String(x))}$`;
  return t(
    `${head}, so the constant term $${a0}$ of the numerator is right, and ${tail}, its $x$ coefficient.`,
    `${head.replace(" and ", "，")}，所以分子的常数项 $${a0}$ 是对的；又 ${tail}，正是它的 $x$ 系数。`,
  );
};

/** determiningTheGeneralTermOfASequenceFromItsGeneratingFunction uses partial fractions to read off aₙ. */
export const determiningTheGeneralTermOfASequenceFromItsGeneratingFunction: TopicDef = {
  id: "determining-the-general-term-of-a-sequence-from-its-generating-function",
  title: t("Determining the General Term of a Sequence Given Its Generating Function", "由生成函数确定数列的通项"),
  summary: t(
    "Split G(x) = N(x)/((1 − r₁x)(1 − r₂x)) into partial fractions A/(1 − r₁x) + B/(1 − r₂x); then aₙ = A r₁ⁿ + B r₂ⁿ.",
    "把 G(x) = N(x)/((1 − r₁x)(1 − r₂x)) 拆成部分分式 A/(1 − r₁x) + B/(1 − r₂x)；于是 aₙ = A r₁ⁿ + B r₂ⁿ。",
  ),
  intro: t(
    "Splitting $\\frac{3 - 13x}{(1 - 6x)(1 - x)} = \\frac{1}{1 - 6x} + \\frac{2}{1 - x}$ turns the generating function into two geometric series, so its coefficients are $a_n = 6^n + 2$.\n\nCheck: $\\frac{1}{1 - 6x} + \\frac{2}{1 - x} = \\frac{(1 - x) + 2(1 - 6x)}{(1 - 6x)(1 - x)} = \\frac{3 - 13x}{(1 - 6x)(1 - x)}$, the function we started from.\n\nIn this lesson we split rational generating functions into partial fractions, read off their general terms, and see which root sets the growth of the terms.",
    "把 $\\frac{3 - 13x}{(1 - 6x)(1 - x)}$ 拆成 $\\frac{1}{1 - 6x} + \\frac{2}{1 - x}$，生成函数就变成两个几何级数，所以它的系数是 $a_n = 6^n + 2$。\n\n检验：$\\frac{1}{1 - 6x} + \\frac{2}{1 - x} = \\frac{(1 - x) + 2(1 - 6x)}{(1 - 6x)(1 - x)} = \\frac{3 - 13x}{(1 - 6x)(1 - x)}$，正是原来的函数。\n\n本课我们把有理生成函数拆成部分分式，读出通项，并看哪个根决定各项的增长。",
  ),
  prerequisites: ["generating-functions", "expressing-rational-functions-as-sums-of-partial-fractions"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "partial-fractions-of-generating-functions",
      title: t("Partial fractions", "部分分式"),
      explanation: t(
        "Partial fractions split a rational generating function into geometric pieces with easy coefficients. $\\frac{3 - 5x}{(1 - 2x)(1 - x)} = \\frac{A}{1 - 2x} + \\frac{B}{1 - x}$ means $3 - 5x = A(1 - x) + B(1 - 2x)$. Putting $x = 1$ gives $-2 = -B$, so $B = 2$; putting $x = \\frac{1}{2}$ gives $\\frac{1}{2} = \\frac{A}{2}$, so $A = 1$. Then $a_n = 2^n + 2$.\n\n> **Watch out.** To remove a factor $1 - rx$, put $x = \\frac{1}{r}$, not $x = r$. Each constant stays with its own factor: here $A$ goes with $1 - 2x$.",
        "部分分式把有理生成函数拆成系数容易求的几何部分。$\\frac{3 - 5x}{(1 - 2x)(1 - x)} = \\frac{A}{1 - 2x} + \\frac{B}{1 - x}$ 意味着 $3 - 5x = A(1 - x) + B(1 - 2x)$。令 $x = 1$ 得 $-2 = -B$，所以 $B = 2$；令 $x = \\frac{1}{2}$ 得 $\\frac{1}{2} = \\frac{A}{2}$，所以 $A = 1$。于是 $a_n = 2^n + 2$。\n\n> **注意。** 要消去因式 $1 - rx$，应令 $x = \\frac{1}{r}$，而不是 $x = r$。每个常数跟着自己的因式：这里 $A$ 对应 $1 - 2x$。",
      ),
      generate(rng) {
        const f = randomPartialFractions(rng);
        const askA = rng.bool();
        const T = f.A + f.B;
        const S = f.A * f.r2 + f.B * f.r1;
        const num = lin([
          [T, ""],
          [-S, "x"],
        ]);
        return numberProblem({
          prompt: t(
            `$G(x) = ${f.tex}$ is the generating function of $a_n = A \\cdot ${pn(f.r1)}^n + B \\cdot ${pn(f.r2)}^n$. Find $${askA ? "A" : "B"}$.`,
            `$G(x) = ${f.tex}$ 是 $a_n = A \\cdot ${pn(f.r1)}^n + B \\cdot ${pn(f.r2)}^n$ 的生成函数。求 $${askA ? "A" : "B"}$。`,
          ),
          answer: askA ? f.A : f.B,
          mistakes: distinct([
            why(
              askA ? f.B : f.A,
              `That is $${askA ? "B" : "A"}$, the constant of the other factor.`,
              `那是另一个因式的常数 $${askA ? "B" : "A"}$。`,
            ),
            why(T, "That is $A + B$, the constant term of the numerator.", "那是分子的常数项 $A + B$。"),
            why(askA ? -f.A : -f.B, "The sign is off; solve the two equations again.", "符号错了；重新解这两个方程。"),
          ]),
          solution: walked(
            [
              [
                ["Clear the denominators", "去分母"],
                t(`$${num} = A(${oneMinus(f.r2)}) + B(${oneMinus(f.r1)})$.`, `$${num} = A(${oneMinus(f.r2)}) + B(${oneMinus(f.r1)})$。`),
              ],
              [
                ["Compare coefficients", "比较系数"],
                t(
                  `The constants give $A + B = ${T}$, and the $x$ terms give $${lin([
                    [f.r2, "A"],
                    [f.r1, "B"],
                  ])} = ${S}$.`,
                  `比较常数项得 $A + B = ${T}$，比较 $x$ 的项得 $${lin([
                    [f.r2, "A"],
                    [f.r1, "B"],
                  ])} = ${S}$。`,
                ),
              ],
              [
                ["Solve", "求解"],
                t(
                  `Putting $A = ${T === 0 ? "-B" : `${T} - B`}$ into the second equation: $${term(f.r1 - f.r2, "B", true)} = ${S - f.r2 * T}$, so $B = ${f.B}$ and $A = ${f.A}$.`,
                  `把 $A = ${T === 0 ? "-B" : `${T} - B`}$ 代入第二个方程：$${term(f.r1 - f.r2, "B", true)} = ${S - f.r2 * T}$，所以 $B = ${f.B}$，$A = ${f.A}$。`,
                ),
              ],
            ],
            numeratorCheck(f),
          ),
        });
      },
    },
    {
      id: "terms-from-a-rational-generating-function",
      title: t("Finding a term", "求某一项"),
      explanation: t(
        "Once the generating function is a sum of geometric pieces, each coefficient is the sum of the matching powers, with no long expansion. If $G(x) = \\frac{2}{1 - 6x} + \\frac{1}{1 + x}$, then $a_n = 2 \\cdot 6^n + (-1)^n$, and $a_5 = 15552 - 1 = 15551$.\n\n> **Watch out.** $\\frac{B}{1 + x}$ is $\\frac{B}{1 - (-1)x}$, so it gives $B(-1)^n$. Keep each constant with its own root when you add the two pieces.",
        "一旦生成函数写成几何部分之和，每个系数就是相应幂之和，不需要冗长的展开。若 $G(x) = \\frac{2}{1 - 6x} + \\frac{1}{1 + x}$，则 $a_n = 2 \\cdot 6^n + (-1)^n$，$a_5 = 15552 - 1 = 15551$。\n\n> **注意。** $\\frac{B}{1 + x}$ 是 $\\frac{B}{1 - (-1)x}$，所以它给出 $B(-1)^n$。把两部分相加时，每个常数要跟着自己的根。",
      ),
      generate(rng) {
        const f = randomPartialFractions(rng);
        const N = rng.int(5, 10);
        const value = f.A * f.r1 ** N + f.B * f.r2 ** N;
        return numberProblem({
          prompt: t(
            `$G(x) = ${f.tex}$ is the generating function of $a_0, a_1, a_2, \\dots$. Find $a_{${N}}$.`,
            `$G(x) = ${f.tex}$ 是数列 $a_0, a_1, a_2, \\dots$ 的生成函数。求 $a_{${N}}$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              f.B * f.r1 ** N + f.A * f.r2 ** N,
              "That swaps the constants; each one goes with its own root.",
              "那是交换了两个常数；每个常数跟着自己的根。",
            ),
            why(
              f.A * f.r1 ** (N - 1) + f.B * f.r2 ** (N - 1),
              `That is $a_{${N - 1}}$; the powers must be $${N}$.`,
              `那是 $a_{${N - 1}}$；幂次应是 $${N}$。`,
            ),
            why((f.A + f.B) * f.r1 ** N, "That puts both constants on the first root.", "那是把两个常数都放在了第一个根上。"),
          ]),
          solution: walked(
            [
              [
                ["Split into partial fractions", "拆成部分分式"],
                t(
                  `$${f.tex} = ${pieces([
                    [f.A, f.r1],
                    [f.B, f.r2],
                  ])}$.`,
                  `$${f.tex} = ${pieces([
                    [f.A, f.r1],
                    [f.B, f.r2],
                  ])}$。`,
                ),
              ],
              [
                ["Read off the general term", "读出通项"],
                t(
                  `$a_n = ${lin([
                    [f.A, `\\cdot ${pn(f.r1)}^n`],
                    [f.B, `\\cdot ${pn(f.r2)}^n`],
                  ])}$.`,
                  `$a_n = ${lin([
                    [f.A, `\\cdot ${pn(f.r1)}^n`],
                    [f.B, `\\cdot ${pn(f.r2)}^n`],
                  ])}$。`,
                ),
              ],
              [
                [`Put $n = ${N}$`, `代入 $n = ${N}$`],
                t(
                  `$a_{${N}} = ${chain(
                    lin([
                      [f.A * f.r1 ** N, ""],
                      [f.B * f.r2 ** N, ""],
                    ]),
                    String(value),
                  )}$.`,
                  `$a_{${N}} = ${chain(
                    lin([
                      [f.A * f.r1 ** N, ""],
                      [f.B * f.r2 ** N, ""],
                    ]),
                    String(value),
                  )}$。`,
                ),
              ],
            ],
            numeratorCheck(f),
          ),
        });
      },
    },
  ],
};

/** solvingHomogeneousRecurrenceRelationsUsingGeneratingFunctions combines the two previous steps. */
export const solvingHomogeneousRecurrenceRelationsUsingGeneratingFunctions: TopicDef = {
  id: "solving-homogeneous-recurrence-relations-using-generating-functions",
  title: t("Solving Homogeneous Recurrence Relations Using Generating Functions", "用生成函数解齐次递推关系"),
  summary: t(
    "Write the generating function of the recurrence, factor its denominator 1 − px − qx² = (1 − r₁x)(1 − r₂x), split into partial fractions and read off aₙ = A r₁ⁿ + B r₂ⁿ.",
    "写出递推关系的生成函数，把分母分解为 1 − px − qx² = (1 − r₁x)(1 − r₂x)，拆成部分分式，读出 aₙ = A r₁ⁿ + B r₂ⁿ。",
  ),
  intro: t(
    "For $a_n = 7a_{n-1} - 6a_{n-2}$ with $a_0 = 2$ and $a_1 = 7$, the generating function is $\\frac{2 - 7x}{1 - 7x + 6x^2} = \\frac{2 - 7x}{(1 - 6x)(1 - x)} = \\frac{1}{1 - 6x} + \\frac{1}{1 - x}$, so $a_n = 6^n + 1$.\n\nCheck: the rule gives $a_2 = 7 \\cdot 7 - 6 \\cdot 2 = 37$, and the formula gives $36 + 1 = 37$.\n\nIn this lesson we solve homogeneous recurrences with generating functions: factor the denominator, read the starting values from the numerator, and split into partial fractions.",
    "对 $a_n = 7a_{n-1} - 6a_{n-2}$，$a_0 = 2$，$a_1 = 7$，生成函数为 $\\frac{2 - 7x}{1 - 7x + 6x^2} = \\frac{2 - 7x}{(1 - 6x)(1 - x)} = \\frac{1}{1 - 6x} + \\frac{1}{1 - x}$，所以 $a_n = 6^n + 1$。\n\n检验：由递推得 $a_2 = 7 \\cdot 7 - 6 \\cdot 2 = 37$，由公式得 $36 + 1 = 37$。\n\n本课我们用生成函数解齐次递推：分解分母，由分子读出初值，再拆成部分分式。",
  ),
  prerequisites: [
    "generating-functions-of-homogeneous-recurrence-relations",
    "determining-the-general-term-of-a-sequence-from-its-generating-function",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "factoring-the-denominator",
      title: t("Factoring the denominator", "分解分母"),
      explanation: t(
        "The denominator $1 - px - qx^2$ factors as $(1 - r_1x)(1 - r_2x)$, where $r_1$ and $r_2$ are the roots of $x^2 - px - q = 0$: it is the characteristic polynomial with its coefficients reversed. For $a_n = 4a_{n-1} + 12a_{n-2}$, $1 - 4x - 12x^2 = (1 - 6x)(1 + 2x)$, and $6$ and $-2$ are the roots of $x^2 - 4x - 12$.\n\n> **Watch out.** The numbers in the factors are the roots $r$, not $\\frac{1}{r}$. And $1 + 2x$ means $1 - (-2)x$, so it gives $r = -2$.",
        "分母 $1 - px - qx^2$ 分解为 $(1 - r_1x)(1 - r_2x)$，其中 $r_1$、$r_2$ 是 $x^2 - px - q = 0$ 的根：它就是系数倒序排列的特征多项式。对 $a_n = 4a_{n-1} + 12a_{n-2}$，$1 - 4x - 12x^2 = (1 - 6x)(1 + 2x)$，而 $6$ 和 $-2$ 正是 $x^2 - 4x - 12$ 的根。\n\n> **注意。** 因式里的数是根 $r$，不是 $\\frac{1}{r}$。而 $1 + 2x$ 是 $1 - (-2)x$，所以它给出 $r = -2$。",
      ),
      generate(rng) {
        const { r1, r2, p, q } = randomRoots(rng);
        const den = lin([
          [1, ""],
          [-p, "x"],
          [-q, "x^2"],
        ]);
        const askLarger = rng.bool();
        const value = askLarger ? r1 : r2;
        const other = askLarger ? r2 : r1;
        return numberProblem({
          prompt: t(
            `The generating function of $a_n = ${rec2(p, q)}$ has denominator $${den} = (1 - r_1x)(1 - r_2x)$ with $r_1 > r_2$. Find $${askLarger ? "r_1" : "r_2"}$.`,
            `$a_n = ${rec2(p, q)}$ 的生成函数分母为 $${den} = (1 - r_1x)(1 - r_2x)$，$r_1 > r_2$。求 $${askLarger ? "r_1" : "r_2"}$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(other, `That is $${askLarger ? "r_2" : "r_1"}$, the other root.`, `那是另一个根 $${askLarger ? "r_2" : "r_1"}$。`),
            why(-other, "That is the other root with its sign changed.", "那是另一个根，而且符号也反了。"),
            why(-value, "The sign is off: a factor $1 + kx$ is $1 - (-k)x$.", "符号错了：因式 $1 + kx$ 是 $1 - (-k)x$。"),
          ]),
          solution: walked(
            [
              [
                ["Match the coefficients", "比较系数"],
                t(
                  `$(1 - r_1x)(1 - r_2x) = 1 - (r_1 + r_2)x + r_1r_2x^2$, so $r_1 + r_2 = ${p}$ and $r_1r_2 = ${-q}$.`,
                  `$(1 - r_1x)(1 - r_2x) = 1 - (r_1 + r_2)x + r_1r_2x^2$，所以 $r_1 + r_2 = ${p}$，$r_1r_2 = ${-q}$。`,
                ),
              ],
              [
                ["Find the two numbers", "求出这两个数"],
                t(
                  `They are the roots of $${charTex(p, q)} = 0$, namely $${r1}$ and $${r2}$, so $${den} = (${oneMinus(r1)})(${oneMinus(r2)})$.`,
                  `它们是 $${charTex(p, q)} = 0$ 的根，即 $${r1}$ 和 $${r2}$，所以 $${den} = (${oneMinus(r1)})(${oneMinus(r2)})$。`,
                ),
              ],
            ],
            t(
              `The two numbers add to $${plus(r1, r2)} = ${p}$ and multiply to $${-q}$, so expanding the product gives back $${den}$.`,
              `这两个数之和为 $${plus(r1, r2)} = ${p}$，之积为 $${-q}$，所以展开乘积又得到 $${den}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-a-recurrence-with-generating-functions",
      title: t("Solving a recurrence", "解递推关系"),
      explanation: t(
        "Find the generating function from the recurrence, split it into partial fractions, and read off the terms. For $a_n = 4a_{n-1} + 12a_{n-2}$ with $a_0 = 2$, $a_1 = 4$: $G(x) = \\frac{2 - 4x}{(1 - 6x)(1 + 2x)} = \\frac{1}{1 - 6x} + \\frac{1}{1 + 2x}$, so $a_n = 6^n + (-2)^n$.\n\n> **Watch out.** The numerator is $a_0 + (a_1 - pa_0)x$, not $a_0 + a_1x$. Each partial fraction $\\frac{A}{1 - rx}$ gives the term $Ar^n$, with the constant staying beside its own root.",
        "由递推式求出生成函数，用部分分式拆开，再读出各项。对 $a_n = 4a_{n-1} + 12a_{n-2}$，$a_0 = 2$，$a_1 = 4$：$G(x) = \\frac{2 - 4x}{(1 - 6x)(1 + 2x)} = \\frac{1}{1 - 6x} + \\frac{1}{1 + 2x}$，所以 $a_n = 6^n + (-2)^n$。\n\n> **注意。** 分子是 $a_0 + (a_1 - pa_0)x$，不是 $a_0 + a_1x$。每个部分分式 $\\frac{A}{1 - rx}$ 给出项 $Ar^n$，常数跟着自己的根。",
      ),
      generate(rng) {
        const { r1, r2, p, q } = randomRoots(rng);
        const A = rng.nonZero(-4, 4);
        const B = rng.nonZero(-4, 4);
        const a0 = A + B;
        const a1 = A * r1 + B * r2;
        const N = rng.int(5, 9);
        const value = A * r1 ** N + B * r2 ** N;
        const num = lin([
          [a0, ""],
          [a1 - p * a0, "x"],
        ]);
        const den = lin([
          [1, ""],
          [-p, "x"],
          [-q, "x^2"],
        ]);
        return numberProblem({
          prompt: t(
            `Use generating functions to solve $a_n = ${rec2(p, q)}$ with $a_0 = ${a0}$ and $a_1 = ${a1}$, and find $a_{${N}}$.`,
            `用生成函数解 $a_n = ${rec2(p, q)}$，$a_0 = ${a0}$，$a_1 = ${a1}$，并求 $a_{${N}}$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              B * r1 ** N + A * r2 ** N,
              "That swaps the constants; each one goes with its own root.",
              "那是交换了两个常数；每个常数跟着自己的根。",
            ),
            why(
              A * r1 ** (N - 1) + B * r2 ** (N - 1),
              `That is $a_{${N - 1}}$; the powers must be $${N}$.`,
              `那是 $a_{${N - 1}}$；幂次应是 $${N}$。`,
            ),
            why(
              a0 * r1 ** N,
              "That keeps only the first root, with all of $a_0$ as its constant.",
              "那是只保留了第一个根，并把整个 $a_0$ 当作它的常数。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the generating function", "求生成函数"],
                t(
                  `The numerator is $a_0 + (a_1 - pa_0)x$, so $G(x) = \\frac{${num}}{${den}}$.`,
                  `分子是 $a_0 + (a_1 - pa_0)x$，所以 $G(x) = \\frac{${num}}{${den}}$。`,
                ),
              ],
              [
                ["Factor and split", "分解并拆开"],
                t(
                  `$${den} = (${oneMinus(r1)})(${oneMinus(r2)})$. Writing $G(x) = \\frac{A}{${oneMinus(r1)}} + \\frac{B}{${oneMinus(r2)}}$ needs $A + B = ${a0}$ and $${lin(
                    [
                      [r1, "A"],
                      [r2, "B"],
                    ],
                  )} = ${a1}$, so $G(x) = ${pieces([
                    [A, r1],
                    [B, r2],
                  ])}$.`,
                  `$${den} = (${oneMinus(r1)})(${oneMinus(r2)})$。设 $G(x) = \\frac{A}{${oneMinus(r1)}} + \\frac{B}{${oneMinus(r2)}}$，需要 $A + B = ${a0}$，$${lin(
                    [
                      [r1, "A"],
                      [r2, "B"],
                    ],
                  )} = ${a1}$，所以 $G(x) = ${pieces([
                    [A, r1],
                    [B, r2],
                  ])}$。`,
                ),
              ],
              [
                [`Read off $a_{${N}}$`, `读出 $a_{${N}}$`],
                t(
                  `$a_{${N}} = ${chain(
                    lin([
                      [A, `\\cdot ${pw(r1, N)}`],
                      [B, `\\cdot ${pw(r2, N)}`],
                    ]),
                    lin([
                      [A * r1 ** N, ""],
                      [B * r2 ** N, ""],
                    ]),
                    String(value),
                  )}$.`,
                  `$a_{${N}} = ${chain(
                    lin([
                      [A, `\\cdot ${pw(r1, N)}`],
                      [B, `\\cdot ${pw(r2, N)}`],
                    ]),
                    lin([
                      [A * r1 ** N, ""],
                      [B * r2 ** N, ""],
                    ]),
                    String(value),
                  )}$。`,
                ),
              ],
            ],
            t(
              `The formula gives $a_0 = ${chain(
                lin([
                  [A, ""],
                  [B, ""],
                ]),
                String(a0),
              )}$ and $a_1 = ${chain(
                lin([
                  [A * r1, ""],
                  [B * r2, ""],
                ]),
                String(a1),
              )}$, the given starting values.`,
              `由公式得 $a_0 = ${chain(
                lin([
                  [A, ""],
                  [B, ""],
                ]),
                String(a0),
              )}$，$a_1 = ${chain(
                lin([
                  [A * r1, ""],
                  [B * r2, ""],
                ]),
                String(a1),
              )}$，正是给定的初值。`,
            ),
          ),
        });
      },
    },
  ],
};

/** generatingFunctionsForInhomogeneousRecurrenceRelations handles forcing terms with generating functions. */
export const generatingFunctionsForInhomogeneousRecurrenceRelations: TopicDef = {
  id: "generating-functions-for-inhomogeneous-recurrence-relations",
  title: t("Generating Functions for Inhomogeneous Recurrence Relations", "非齐次递推关系的生成函数"),
  summary: t(
    "A forcing term contributes its own generating function: for aₙ = r aₙ₋₁ + c, (1 − rx)G(x) = a₀ + cx/(1 − x); for aₙ = r aₙ₋₁ + sⁿ, (1 − rx)G(x) = a₀ + sx/(1 − sx). Partial fractions then give aₙ.",
    "强迫项贡献它自己的生成函数：对 aₙ = r aₙ₋₁ + c，(1 − rx)G(x) = a₀ + cx/(1 − x)；对 aₙ = r aₙ₋₁ + sⁿ，(1 − rx)G(x) = a₀ + sx/(1 − sx)。再用部分分式求出 aₙ。",
  ),
  intro: t(
    "For $a_n = 7a_{n-1} + 6$ with $a_0 = 0$, the forcing adds $\\frac{6x}{1 - x}$, so $(1 - 7x)G(x) = \\frac{6x}{1 - x}$ and $G(x) = \\frac{6x}{(1 - x)(1 - 7x)} = \\frac{1}{1 - 7x} - \\frac{1}{1 - x}$. So $a_n = 7^n - 1$.\n\nCheck: the rule gives $a_1 = 6$ and $a_2 = 7 \\cdot 6 + 6 = 48$, and the formula gives $7 - 1 = 6$ and $49 - 1 = 48$.\n\nIn this lesson we use generating functions to solve recurrences with a constant or an exponential forcing term, and read partial sums from a factor $1 - x$.",
    "对 $a_n = 7a_{n-1} + 6$，$a_0 = 0$，强迫项贡献 $\\frac{6x}{1 - x}$，所以 $(1 - 7x)G(x) = \\frac{6x}{1 - x}$，$G(x) = \\frac{6x}{(1 - x)(1 - 7x)} = \\frac{1}{1 - 7x} - \\frac{1}{1 - x}$。所以 $a_n = 7^n - 1$。\n\n检验：由递推得 $a_1 = 6$，$a_2 = 7 \\cdot 6 + 6 = 48$；由公式得 $7 - 1 = 6$，$49 - 1 = 48$。\n\n本课我们用生成函数解强迫项为常数或指数函数的递推，并由因式 $1 - x$ 读出部分和。",
  ),
  prerequisites: [
    "solving-homogeneous-recurrence-relations-using-generating-functions",
    "first-order-recurrence-relations-with-exponential-forcing",
  ],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "generating-functions-with-a-constant-forcing-term",
      title: t("A constant forcing term", "常数强迫项"),
      explanation: t(
        "A constant forcing term contributes a geometric series, which adds the factor $1 - x$ to the denominator. For $a_n = 6a_{n-1} + 5$ with $a_0 = 2$: $(1 - 6x)G(x) = 2 + \\frac{5x}{1 - x}$, so $G(x) = \\frac{2(1 - x) + 5x}{(1 - x)(1 - 6x)} = \\frac{2 + 3x}{(1 - x)(1 - 6x)}$.\n\n> **Watch out.** The forcing starts at $n = 1$, so it contributes $\\frac{cx}{1 - x}$, not $\\frac{c}{1 - x}$. Over the common denominator $a_0$ becomes $a_0(1 - x)$, which is where the $-a_0$ in the $x$ coefficient comes from.",
        "常数强迫项贡献一个几何级数，这给分母添上因子 $1 - x$。对 $a_n = 6a_{n-1} + 5$，$a_0 = 2$：$(1 - 6x)G(x) = 2 + \\frac{5x}{1 - x}$，所以 $G(x) = \\frac{2(1 - x) + 5x}{(1 - x)(1 - 6x)} = \\frac{2 + 3x}{(1 - x)(1 - 6x)}$。\n\n> **注意。** 强迫项从 $n = 1$ 开始，所以它贡献 $\\frac{cx}{1 - x}$，不是 $\\frac{c}{1 - x}$。通分后 $a_0$ 变成 $a_0(1 - x)$，$x$ 系数中的 $-a_0$ 就是从这里来的。",
      ),
      generate(rng) {
        const r = rng.pick(RATIOS);
        const c = rng.nonZero(-6, 6);
        const a0 = rng.int(-5, 5);
        const value = c - a0;
        const a1 = r * a0 + c;
        const cx = poly([c, "x"]);
        const bTex = a0 === 0 ? String(c) : `${c} - ${pn(a0)}`;
        const ruleA1 = a0 === 0 ? String(c) : `${times(r, pn(a0))}${signedN(c)}`;
        const back = minus(a1, (1 + r) * a0);
        return numberProblem({
          prompt: t(
            `$a_n = ${term(r, "a_{n-1}", true)}${term(c, "")}$ for $n \\ge 1$, with $a_0 = ${a0}$. Its generating function is $G(x) = \\frac{${a0} + bx}{(1 - x)(${oneMinus(r)})}$. Find $b$.`,
            `$a_n = ${term(r, "a_{n-1}", true)}${term(c, "")}$（$n \\ge 1$），$a_0 = ${a0}$。其生成函数为 $G(x) = \\frac{${a0} + bx}{(1 - x)(${oneMinus(r)})}$。求 $b$。`,
          ),
          answer: value,
          mistakes: distinct([
            why(
              c,
              "That forgets that $a_0(1 - x)$ puts $-a_0$ into the $x$ coefficient.",
              "那是忘了 $a_0(1 - x)$ 给 $x$ 的系数带来 $-a_0$。",
            ),
            why(c + a0, "The sign is off: $a_0(1 - x)$ contributes $-a_0x$.", "符号错了：$a_0(1 - x)$ 贡献的是 $-a_0x$。"),
            why(a0 - c, "That subtracts the wrong way round: the $x$ coefficient is $c - a_0$.", "那是减反了：$x$ 的系数是 $c - a_0$。"),
            why(
              c - r * a0,
              "That uses $ra_0$; the $x$ coefficient comes from $a_0(1 - x) + cx$.",
              "那是用了 $ra_0$；$x$ 的系数来自 $a_0(1 - x) + cx$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Multiply by $x^n$ and sum from $n = 1$", "乘以 $x^n$ 并从 $n = 1$ 求和"],
                t(
                  `$\\sum_{n \\ge 1} ${poly([c, "x^n"])} = \\frac{${cx}}{1 - x}$, so $(${oneMinus(r)})G(x) = ${a0 === 0 ? "" : `${a0} + `}\\frac{${cx}}{1 - x}$.`,
                  `$\\sum_{n \\ge 1} ${poly([c, "x^n"])} = \\frac{${cx}}{1 - x}$，所以 $(${oneMinus(r)})G(x) = ${a0 === 0 ? "" : `${a0} + `}\\frac{${cx}}{1 - x}$。`,
                ),
              ],
              [
                ["Combine over one denominator", "通分"],
                t(
                  `$G(x) = \\frac{${poly([a0, "(1 - x)"], [c, "x"])}}{(1 - x)(${oneMinus(r)})}$.`,
                  `$G(x) = \\frac{${poly([a0, "(1 - x)"], [c, "x"])}}{(1 - x)(${oneMinus(r)})}$。`,
                ),
              ],
              [
                ["Read off $b$", "读出 $b$"],
                t(
                  `The numerator is $${lin([
                    [a0, ""],
                    [c - a0, "x"],
                  ])}$, so $b = ${chain(bTex, String(value))}$.`,
                  `分子是 $${lin([
                    [a0, ""],
                    [c - a0, "x"],
                  ])}$，所以 $b = ${chain(bTex, String(value))}$。`,
                ),
              ],
            ],
            t(
              `The rule gives $a_1 = ${chain(ruleA1, String(a1))}$, and the $x$ coefficient of $G(x)(1 - x)(${oneMinus(r)})$ is $a_1 - (${plus(1, r)})a_0 = ${chain(back, String(value))}$.`,
              `由递推得 $a_1 = ${chain(ruleA1, String(a1))}$，而 $G(x)(1 - x)(${oneMinus(r)})$ 中 $x$ 的系数是 $a_1 - (${plus(1, r)})a_0 = ${chain(back, String(value))}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-exponentially-forced-recurrences-with-generating-functions",
      title: t("An exponential forcing term", "指数强迫项"),
      explanation: t(
        "An exponential forcing term adds its own geometric factor, so partial fractions produce a term with that base. For $a_n = 6a_{n-1} + 7^n$ with $a_0 = 1$: $(1 - 6x)G(x) = 1 + \\frac{7x}{1 - 7x} = \\frac{1}{1 - 7x}$, so $G(x) = \\frac{1}{(1 - 6x)(1 - 7x)} = -\\frac{6}{1 - 6x} + \\frac{7}{1 - 7x}$, and $a_n = 7^{n+1} - 6^{n+1}$.\n\n> **Watch out.** The forcing $s^n$ for $n \\ge 1$ contributes $\\frac{sx}{1 - sx}$, without its $n = 0$ term. The constants must satisfy $A + B = a_0$, and each stays with its own base.",
        "指数强迫项增加它自己的几何因子，所以部分分式会产生以该底数为底的项。对 $a_n = 6a_{n-1} + 7^n$，$a_0 = 1$：$(1 - 6x)G(x) = 1 + \\frac{7x}{1 - 7x} = \\frac{1}{1 - 7x}$，所以 $G(x) = \\frac{1}{(1 - 6x)(1 - 7x)} = -\\frac{6}{1 - 6x} + \\frac{7}{1 - 7x}$，$a_n = 7^{n+1} - 6^{n+1}$。\n\n> **注意。** $n \\ge 1$ 时的强迫项 $s^n$ 贡献 $\\frac{sx}{1 - sx}$，不含 $n = 0$ 的项。常数必须满足 $A + B = a_0$，且各自跟着自己的底数。",
      ),
      generate(rng) {
        const r = rng.pick([-2, 2, 3]);
        let s: number;
        do s = rng.pick([-2, 2, 3, 4]);
        while (s === r);
        const a0 = rng.int(-3, 4);
        const N = rng.int(4, 8);
        const a = iterate1(Q.of(a0), r, (n) => Q.of(s).pow(n), N);
        const B = Q.of(s, s - r);
        const A = Q.of(a0).sub(B);
        const a1 = a[1]!;
        return numberProblem({
          prompt: t(
            `Use generating functions to solve $a_n = ${r}a_{n-1} + ${pn(s)}^n$ with $a_0 = ${a0}$, and find $a_{${N}}$.`,
            `用生成函数解 $a_n = ${r}a_{n-1} + ${pn(s)}^n$，$a_0 = ${a0}$，并求 $a_{${N}}$。`,
          ),
          answer: a[N]!,
          mistakes: distinct([
            why(a[N - 1]!, `That is $a_{${N - 1}}$; one more step is needed.`, `那是 $a_{${N - 1}}$；还要再算一步。`),
            why(
              Q.of(a0).mul(Q.of(r).pow(N)).add(Q.of(s).pow(N)),
              "That adds the forcing only once; it enters at every step and builds up.",
              "那是只加了一次强迫项；它每一步都加入并不断累积。",
            ),
            why(
              A.mul(Q.of(s).pow(N)).add(B.mul(Q.of(r).pow(N))),
              "That swaps the bases: the constant of $\\frac{1}{1 - rx}$ goes with $r^n$.",
              "那是交换了底数：$\\frac{1}{1 - rx}$ 的常数对应 $r^n$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Find the generating function", "求生成函数"],
                t(
                  `Summing from $n = 1$: $(${oneMinus(r)})G(x) = ${a0 === 0 ? "" : `${a0} + `}\\frac{${s}x}{${oneMinus(s)}}$.`,
                  `从 $n = 1$ 求和：$(${oneMinus(r)})G(x) = ${a0 === 0 ? "" : `${a0} + `}\\frac{${s}x}{${oneMinus(s)}}$。`,
                ),
              ],
              [
                ["Split into partial fractions", "拆成部分分式"],
                t(
                  `$G(x) = ${pieces([
                    [A, r],
                    [B, s],
                  ])}$, whose constants add to $a_0 = ${a0}$.`,
                  `$G(x) = ${pieces([
                    [A, r],
                    [B, s],
                  ])}$，两个常数之和为 $a_0 = ${a0}$。`,
                ),
              ],
              [
                [`Read off $a_{${N}}$`, `读出 $a_{${N}}$`],
                t(
                  `$a_{${N}} = ${chain(
                    lin([
                      [A, `\\cdot ${pw(r, N)}`],
                      [B, `\\cdot ${pw(s, N)}`],
                    ]),
                    a[N]!.toLatex(),
                  )}$.`,
                  `$a_{${N}} = ${chain(
                    lin([
                      [A, `\\cdot ${pw(r, N)}`],
                      [B, `\\cdot ${pw(s, N)}`],
                    ]),
                    a[N]!.toLatex(),
                  )}$。`,
                ),
              ],
            ],
            t(
              `The rule gives $a_1 = ${chain(`${times(r, pn(a0))} + ${pn(s)}`, a1.toLatex())}$, and the formula gives $${chain(
                lin([
                  [A.mul(Q.of(r)), ""],
                  [B.mul(Q.of(s)), ""],
                ]),
                a1.toLatex(),
              )}$.`,
              `由递推得 $a_1 = ${chain(`${times(r, pn(a0))} + ${pn(s)}`, a1.toLatex())}$，由公式得 $${chain(
                lin([
                  [A.mul(Q.of(r)), ""],
                  [B.mul(Q.of(s)), ""],
                ]),
                a1.toLatex(),
              )}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** discreteMathematicsRecurrenceTopics are the new topics of Discrete Mathematics unit 6. */
export const discreteMathematicsRecurrenceTopics: readonly TopicDef[] = [
  introductionToRecurrenceRelations,
  firstOrderRecurrenceRelations,
  firstOrderRecurrenceRelationsWithPolynomialForcing,
  firstOrderRecurrenceRelationsWithExponentialForcing,
  secondOrderHomogeneousRecurrenceRelationsWithDistinctRealRoots,
  secondOrderHomogeneousRecurrenceRelationsWithRepeatedRoots,
  secondOrderHomogeneousRecurrenceRelationsWithComplexRoots,
  secondOrderRecurrenceRelationsWithPolynomialForcing,
  secondOrderRecurrenceRelationsWithExponentialForcing,
  generatingFunctions,
  generatingFunctionsOfHomogeneousRecurrenceRelations,
  determiningTheGeneralTermOfASequenceFromItsGeneratingFunction,
  solvingHomogeneousRecurrenceRelationsUsingGeneratingFunctions,
  generatingFunctionsForInhomogeneousRecurrenceRelations,
];
