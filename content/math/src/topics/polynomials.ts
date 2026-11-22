import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { gcd, num, poly, svgDocument } from "@ga/subject-math";

import { choiceProblem, type ExpressionProblem, expressionProblem, numberProblem, say, steps, why, yesNo } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";

/** Term is a monomial c·xᵃ·yᵇ with an integer coefficient. */
interface Term {
  readonly c: number;
  readonly x: number;
  readonly y: number;
}

const term = (c: number, x = 0, y = 0): Term => ({ c, x, y });

/** pw writes a power of a variable: "", "x" or "x^{3}". */
const pw = (v: string, e: number) => (e === 0 ? "" : e === 1 ? v : `${v}^{${e}}`);

/** vars writes the variable part of a term: "x^{2}y". */
const vars = (m: Term) => `${pw("x", m.x)}${pw("y", m.y)}`;

/** write writes terms as a sum, in the order given, with no "+ -", "1x" or "-1x". */
function write(ts: readonly Term[]): string {
  return poly(...ts.map((m) => [m.c, vars(m)] as const));
}

/** mono writes one term. */
const mono = (m: Term) => write([m]);

/** wrap writes terms in parentheses. */
const wrap = (ts: readonly Term[]) => `(${write(ts)})`;

/** front writes a monomial factor before parentheses: "", "-", "3" or "-2x^{2}". */
function front(m: Term): string {
  if (m.x === 0 && m.y === 0) return m.c === 1 ? "" : m.c === -1 ? "-" : String(m.c);
  return mono(m);
}

const degreeOf = (m: Term) => m.x + m.y;
const neg = (m: Term) => term(-m.c, m.x, m.y);
const mul = (a: Term, b: Term) => term(a.c * b.c, a.x + b.x, a.y + b.y);
const scale = (ts: readonly Term[], k: number) => ts.map((m) => term(k * m.c, m.x, m.y));

/** collect combines like terms and sorts them in standard form: decreasing degree, then decreasing power of x. */
function collect(ts: readonly Term[]): Term[] {
  const sums = new Map<string, Term>();
  for (const m of ts) {
    const key = `${m.x},${m.y}`;
    const prev = sums.get(key);
    sums.set(key, term((prev?.c ?? 0) + m.c, m.x, m.y));
  }
  return [...sums.values()].filter((m) => m.c !== 0).sort((a, b) => degreeOf(b) - degreeOf(a) || b.x - a.x);
}

/** products lists every term of a times every term of b, uncombined. */
const products = (a: readonly Term[], b: readonly Term[]) => a.flatMap((p) => b.map((q) => mul(p, q)));

/** times multiplies two polynomials and writes the result in standard form. */
const times = (a: readonly Term[], b: readonly Term[]) => collect(products(a, b));

/** signed writes a term after another, with its sign as the operator: "- 3x", "+ 5". */
const signed = (s: string) => (s.startsWith("-") ? `- ${s.slice(1)}` : `+ ${s}`);

/** scramble shuffles terms so that the term of highest degree does not come first. */
function scramble(rng: Rng, ts: readonly Term[]): Term[] {
  const out = rng.shuffle(ts);
  const top = Math.max(...ts.map(degreeOf));
  if (out.length > 1 && degreeOf(out[0]!) === top) out.push(out.shift()!);
  return out;
}

/** choose is the binomial coefficient C(n, k). */
function choose(n: number, k: number): number {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

/** binomialPower expands (a + b)ⁿ for two terms, with the coefficients given (normally the row of Pascal's triangle). */
function binomialPower(a: Term, b: Term, n: number, coef = (i: number) => choose(n, i), bc = (i: number) => b.c ** i): Term[] {
  const ts: Term[] = [];
  for (let i = 0; i <= n; i++) ts.push(term(coef(i) * a.c ** (n - i) * bc(i), a.x * (n - i) + b.x * i, a.y * (n - i) + b.y * i));
  return collect(ts);
}

/** factorPower writes a factor raised to a power for a worked solution: "", "x^{3}", "(2x)", "(-3)^{2}". */
function factorPower(m: Term, e: number): string {
  if (e === 0) return "";
  const base = m.c === 1 && degreeOf(m) === 1 ? vars(m) : `(${mono(m)})`;
  return e === 1 ? base : `${base}^{${e}}`;
}

/** binomialSteps writes the expansion of (a + b)ⁿ term by term: "(x)^{3} + 3(x)^{2}(-2) + …". */
function binomialSteps(a: Term, b: Term, n: number): string {
  const parts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const c = choose(n, i);
    parts.push(`${c === 1 ? "" : c}${factorPower(a, n - i)}${factorPower(b, i)}`);
  }
  return parts.join(" + ");
}

/** expandProblem builds a problem whose answer is a polynomial in simplest form. */
const expandProblem = (p: Omit<ExpressionProblem, "simplified">): Problem => expressionProblem({ ...p, simplified: true });

/** substituted writes a polynomial with values substituted for x and y: "3(-2)^{2} - 5(-2) + 1"; plain leaves a lone positive value unbracketed: "2 + 6". */
function substituted(ts: readonly Term[], v: number, w = 1, plain = false): string {
  let out = "";
  for (const m of ts) {
    const a = Math.abs(m.c);
    const power = (u: number, e: number) => (e === 0 ? "" : `(${num(u)})${e === 1 ? "" : `^{${e}}`}`);
    const factors = `${power(v, m.x)}${power(w, m.y)}`;
    const bare = plain && a === 1 && degreeOf(m) === 1 && (m.x === 1 ? v : w) > 0;
    const body = factors === "" ? String(a) : bare ? num(m.x === 1 ? v : w) : `${a === 1 ? "" : a}${factors}`;
    out += out === "" ? (m.c < 0 ? `-${body}` : body) : m.c < 0 ? ` - ${body}` : ` + ${body}`;
  }
  return out;
}

/** valueAt evaluates a polynomial in x at v. */
const valueAt = (ts: readonly Term[], v: number) => ts.reduce((s, m) => s + m.c * v ** m.x, 0);

/** groups writes the like terms of ts in parentheses, in standard order: "(4x^{2} - x^{2}) + (-3x + 5x)". */
function groups(ts: readonly Term[]): string {
  return collect(ts.map((m) => term(1, m.x, m.y)))
    .map((k) => ts.filter((m) => m.x === k.x && m.y === k.y))
    .map((g, i) => (g.length > 1 || (i > 0 && g[0]!.c < 0) ? `(${write(g)})` : write(g)))
    .join(" + ");
}

/** coefficientNote explains a hidden coefficient of 1 or -1: ", where the minus sign alone stands for the coefficient $-1$". */
function coefficientNote(m: Term): Text {
  if (Math.abs(m.c) !== 1 || degreeOf(m) === 0) return t("", "");
  return m.c > 0
    ? t(", with no number written: the coefficient is then $1$", "，没有写出数，这时系数是 $1$")
    : t(", where the minus sign alone stands for the coefficient $-1$", "，单独的负号表示系数 $-1$");
}

/** stepLabel writes the bold start of step i with its title in each locale: "**Step 2: Combine.**" / "**第二步：合并。**". */
function stepLabel(i: number, en: string, zh: string): Text {
  return t(`**Step ${i}: ${en}.**`, `**第${["一", "二", "三", "四", "五"][i - 1]}步：${zh}。**`);
}

/** paragraphs joins texts into the paragraphs of a solution, leaving out empty ones. */
function paragraphs(...parts: readonly Text[]): Text {
  const join = (key: "en" | "zh-CN") =>
    parts
      .map((p) => p[key].trim())
      .filter((p) => p !== "")
      .join("\n\n");
  return t(join("en"), join("zh-CN"));
}

/** evalAt evaluates a polynomial at x = v and y = w. */
const evalAt = (ts: readonly Term[], v: number, w = 1) => ts.reduce((s, m) => s + m.c * v ** m.x * w ** m.y, 0);

/** chain writes a = b = c, leaving out a step equal to the one before it. */
const chain = (...xs: readonly string[]) => xs.filter((x, i) => i === 0 || x !== xs[i - 1]).join(" = ");

/** Part is a signed product of polynomials, one part of an expression such as m(p) − k(q). */
interface Part {
  readonly sign: 1 | -1;
  readonly factors: readonly (readonly Term[])[];
}

/** plus builds a part of an expression added to the rest. */
const plus = (...factors: readonly (readonly Term[])[]): Part => ({ sign: 1, factors });

/** minus builds a part of an expression subtracted from the rest. */
const minus = (...factors: readonly (readonly Term[])[]): Part => ({ sign: -1, factors });

/** unit drops the constant factors 1 and -1 of a part, moving a -1 into its sign. */
function unit(p: Part): Part {
  const ones = p.factors.filter((f) => f.length === 1 && degreeOf(f[0]!) === 0 && Math.abs(f[0]!.c) === 1);
  const rest = p.factors.filter((f) => !ones.includes(f));
  const sign = ones.reduce((s, f) => s * f[0]!.c, p.sign as number);
  return { sign: sign < 0 ? -1 : 1, factors: rest.length > 0 ? rest : [[term(1)]] };
}

/** partsAt writes the value of an expression at x = v, y = w: the substitution, the value of each factor, the result. */
function partsAt(parts: readonly Part[], v: number, w: number): string {
  const lead = (p: Part, i: number) => (i === 0 ? (p.sign < 0 ? "-" : "") : p.sign < 0 ? " - " : " + ");
  const lone = parts.length === 1 && parts[0]!.factors.length === 1 && parts[0]!.sign > 0;
  if (lone) return answerAt(parts[0]!.factors[0]!, v, w);
  const wrapped = (f: readonly Term[]) =>
    !lone && (f.length > 1 || f[0]!.c < 0) ? `(${substituted(f, v, w, true)})` : substituted(f, v, w, true);
  const shown = parts.map((p, i) => `${lead(p, i)}${p.factors.map(wrapped).join("")}`).join("");
  const values = parts
    .map((p, i) => {
      const vs = p.factors.map((f, j) => {
        const x = evalAt(f, v, w);
        return x < 0 && !(i === 0 && p.sign > 0 && j === 0) ? `(${x})` : String(x);
      });
      return `${lead(p, i)}${vs.join(" \\cdot ")}`;
    })
    .join("");
  const value = parts.reduce((s, p) => s + p.sign * p.factors.reduce((r, f) => r * evalAt(f, v, w), 1), 0);
  return chain(shown, values, num(value));
}

/** answerAt writes the value of a polynomial at x = v, y = w: the substitution, the value of each term, the result. */
function answerAt(ts: readonly Term[], v: number, w: number): string {
  return chain(substituted(ts, v, w, true), poly(...ts.map((m) => [m.c * v ** m.x * w ** m.y, ""] as const)), num(evalAt(ts, v, w)));
}

/** point names the values put in for a check, only for the variables that occur: "$x = 2$ and $y = -1$". */
function point(ts: readonly Term[], v: number, w: number): Text {
  const hasX = ts.some((m) => m.x > 0);
  const hasY = ts.some((m) => m.y > 0);
  if (hasX && hasY) return t(`$x = ${num(v)}$ and $y = ${num(w)}$`, `$x = ${num(v)}$、$y = ${num(w)}$`);
  return hasY ? t(`$y = ${num(w)}$`, `$y = ${num(w)}$`) : t(`$x = ${num(v)}$`, `$x = ${num(v)}$`);
}

/** check writes the check that an expression and its expanded or simplified form agree at a small value of x (and y). */
function check(given: readonly Part[], answer: readonly Term[]): Text {
  const parts = given.map(unit);
  const factors = parts.flatMap((p) => p.factors);
  const all = [...factors, answer];
  const two = all.some((f) => f.some((m) => m.y > 0));
  const candidates: readonly (readonly [number, number])[] = two
    ? [
        [2, -1],
        [-1, 2],
        [2, 1],
        [1, 2],
        [1, 1],
      ]
    : [
        [2, 1],
        [-1, 1],
        [3, 1],
        [-2, 1],
        [1, 1],
      ];
  const fits = ([v, w]: readonly [number, number]) =>
    factors.every((f) => evalAt(f, v, w) !== 0) && all.every((f) => f.every((m) => Math.abs(m.c * v ** m.x * w ** m.y) <= 2000));
  const [v, w] = candidates.find(fits) ?? [1, 1];
  const where = point(all.flat(), v, w);
  const left = partsAt(parts, v, w);
  const right = answerAt(answer, v, w);
  return t(
    `**Check.** Put ${where.en} into both forms. The question gives $${left}$, and the answer gives $${right}$. They agree.`,
    `**检验。** 把 ${where["zh-CN"]} 代入两种形式。原式得 $${left}$，结果得 $${right}$，两者相同。`,
  );
}

/** termList writes the terms of a polynomial as a list in each locale: "$4x^{3}$, $-x^{2}$ and $-5$". */
function termList(ts: readonly Term[]): Text {
  const items = ts.map((m) => `$${mono(m)}$`);
  const en = items.length === 1 ? items[0]! : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
  return t(en, items.join("、"));
}

/** areaGrid draws a rectangle split into cells: the column labels above, the row labels at the left, each cell's product inside. */
function areaGrid(
  cols: readonly string[],
  rows: readonly string[],
  cells: readonly (readonly string[])[],
  alt: Text,
  size?: { readonly w?: readonly number[]; readonly h?: readonly number[]; readonly width?: number; readonly height?: number },
): Figure {
  const ws = size?.w ?? cols.map(() => 1);
  const hs = size?.h ?? rows.map(() => 1);
  const [sw, sh] = [ws.reduce((a, b) => a + b, 0), hs.reduce((a, b) => a + b, 0)];
  const [W, H] = [size?.width ?? 230, size?.height ?? Math.min(60 * rows.length, 150)];
  const [left, top] = [Math.max(54, (320 - W) / 2 + 12), 26];
  const edges = (sizes: readonly number[], total: number, length: number, start: number) => {
    const out = [start];
    for (const z of sizes) out.push(out[out.length - 1]! + (z / total) * length);
    return out;
  };
  const xs = edges(ws, sw, W, left);
  const ys = edges(hs, sh, H, top);
  const r = (n: number) => Math.round(n * 10) / 10;
  const label = (x: number, y: number, s: string, cls = "") =>
    `<text${cls && ` class="${cls}"`} x="${r(x)}" y="${r(y)}" stroke="none" fill="currentColor">${s}</text>`;
  let body = `<rect class="accent" x="${left}" y="${top}" width="${W}" height="${H}"/>`;
  for (const x of xs.slice(1, -1)) body += `<line x1="${r(x)}" y1="${top}" x2="${r(x)}" y2="${top + H}"/>`;
  for (const y of ys.slice(1, -1)) body += `<line x1="${left}" y1="${r(y)}" x2="${left + W}" y2="${r(y)}"/>`;
  cols.forEach((c, i) => {
    body += label((xs[i]! + xs[i + 1]!) / 2, top - 8, c);
  });
  rows.forEach((c, j) => {
    body += label(left - 22, (ys[j]! + ys[j + 1]!) / 2 + 4, c);
    cols.forEach((_, i) => {
      body += label((xs[i]! + xs[i + 1]!) / 2, (ys[j]! + ys[j + 1]!) / 2 + 4, cells[j]![i]!, "result");
    });
  });
  return { svg: svgDocument(top + H + 10, body), alt };
}

export const introductionToPolynomials: TopicDef = {
  id: "introduction-to-polynomials",
  title: t("Introduction to Polynomials", "多项式简介"),
  summary: t(
    "Recognize polynomials, name their terms, coefficients and constant term, and evaluate them.",
    "识别多项式，说出它的项、系数和常数项，并求多项式的值。",
  ),
  prerequisites: ["evaluating-expressions"],
  encompasses: [{ topic: "evaluating-expressions", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSA.SSE.A.1.A"],
  intro: t(
    `You can evaluate an expression such as $3x + 2$ by putting a number in place of $x$. Many of the expressions algebra works with are built the same way, from numbers and one variable, using only multiplication and addition: the area $x^{2} + 3x$ of a rectangle $x$ wide and $x + 3$ long, the height $20t - 5t^{2}$ of a ball thrown upward, or $4x^{3} - x^{2} + 7x - 5$. Such an expression is a **polynomial**. Because every polynomial is made of the same few pieces, we can name the pieces once and work with all polynomials in the same way.

Read $4x^{3} - x^{2} + 7x - 5$ as a sum of four pieces, $4x^{3}$, $-x^{2}$, $7x$ and $-5$, each a number times a power of $x$. At $x = 2$ each piece is worked out on its own and the results are added:

$$4(2)^{3} - (2)^{2} + 7(2) - 5 = 32 - 4 + 14 - 5 = 37$$

In this lesson we name the pieces of a polynomial, its terms, coefficients and constant term, tell polynomials from other expressions, and evaluate them.`,
    `我们会把一个数代入 $3x + 2$ 中的 $x$ 求值。代数中的许多式子都是这样构成的：由数和一个变量，只用乘法和加法组成。例如宽为 $x$、长为 $x + 3$ 的长方形的面积 $x^{2} + 3x$，向上抛出的球的高度 $20t - 5t^{2}$，或者 $4x^{3} - x^{2} + 7x - 5$。这样的式子叫做**多项式**。所有多项式都由同样几种部分组成，所以只要给这些部分起一次名字，就能用同一种方法处理所有多项式。

把 $4x^{3} - x^{2} + 7x - 5$ 看成四部分之和：$4x^{3}$、$-x^{2}$、$7x$ 和 $-5$，每一部分都是一个数乘以 $x$ 的幂。当 $x = 2$ 时，分别算出每一部分，再相加：

$$4(2)^{3} - (2)^{2} + 7(2) - 5 = 32 - 4 + 14 - 5 = 37$$

这节课我们给多项式的各部分命名：项、系数和常数项；分辨多项式与其他式子；并求多项式的值。`,
  ),
  knowledgePoints: [
    {
      id: "terms-and-coefficients",
      title: t("Terms, coefficients and the constant term", "项、系数与常数项"),
      explanation: t(
        `A **polynomial** is a sum of **terms**, each a number times a power of the variable with a whole-number exponent, such as $4x^{3} - x^{2} + 7x - 5$. Reading it as a sum shows where the signs go: $4x^{3} - x^{2} + 7x - 5 = 4x^{3} + (-x^{2}) + 7x + (-5)$, so the sign in front of a term belongs to that term. The terms here are $4x^{3}$, $-x^{2}$, $7x$ and $-5$.

The number multiplying the variable in a term is its **coefficient**: the coefficient of $x^{3}$ is $4$ and the coefficient of $x$ is $7$. When no number is written, the coefficient is $1$ or $-1$: $-x^{2}$ means $(-1)x^{2}$, so the coefficient of $x^{2}$ is $-1$. The term with no variable, here $-5$, is the **constant term**. In a polynomial such as $2x^{2} + x$, where every term contains the variable, the constant term is $0$.

> **Watch out.** A term keeps its sign: in $4x^{3} - x^{2} + 7x - 5$ the constant term is $-5$, not $5$, and the coefficient of $x^{2}$ is $-1$, not $1$. The exponent is not the coefficient either: the coefficient of $x^{3}$ is $4$, not $3$.`,
        `**多项式**是若干**项**的和，每一项都是一个数乘以变量的自然数次幂，例如 $4x^{3} - x^{2} + 7x - 5$。把它看成和，就知道符号的归属：$4x^{3} - x^{2} + 7x - 5 = 4x^{3} + (-x^{2}) + 7x + (-5)$，所以项前面的符号属于这一项。这里的项是 $4x^{3}$、$-x^{2}$、$7x$ 和 $-5$。

一项中乘在变量前面的数叫做这一项的**系数**：$x^{3}$ 的系数是 $4$，$x$ 的系数是 $7$。没有写出数时，系数是 $1$ 或 $-1$：$-x^{2}$ 表示 $(-1)x^{2}$，所以 $x^{2}$ 的系数是 $-1$。不含变量的项（这里是 $-5$）叫做**常数项**。像 $2x^{2} + x$ 这样每一项都含有变量的多项式，常数项是 $0$。

> **注意。** 每一项都带着自己的符号：在 $4x^{3} - x^{2} + 7x - 5$ 中，常数项是 $-5$ 而不是 $5$，$x^{2}$ 的系数是 $-1$ 而不是 $1$。指数也不是系数：$x^{3}$ 的系数是 $4$，不是 $3$。`,
      ),
      generate(rng) {
        const askConstant = rng.bool(0.35);
        const powers = rng.sample([1, 2, 3, 4, 5], rng.int(2, 3));
        if (rng.bool(askConstant ? 0.8 : 0.6)) powers.push(0);
        const ts = collect(powers.map((e) => term(rng.bool(0.25) ? rng.sign() : rng.nonZero(-9, 9), e)));
        const shown = rng.shuffle(ts);
        const expr = write(shown);
        const lead = ts[0]!;
        if (askConstant) {
          const c0 = ts.find((m) => m.x === 0)?.c ?? 0;
          return numberProblem({
            prompt: t(`What is the constant term of $${expr}$?`, `$${expr}$ 的常数项是多少？`),
            answer: c0,
            wrong: [-c0, lead.c, ts.length, shown[shown.length - 1]!.c],
            solution: paragraphs(
              t(
                `**Step 1: Split into terms.** Each term takes the sign in front of it, so the terms of $${expr}$ are ${termList(shown).en}.`,
                `**第一步：拆成项。** 每一项都带着它前面的符号，所以 $${expr}$ 的项是 ${termList(shown)["zh-CN"]}。`,
              ),
              c0 === 0
                ? t(
                    `**Step 2: Find the term with no variable.** Every term contains $x$, so no constant term is written: the constant term is $0$.`,
                    `**第二步：找不含变量的项。** 每一项都含有 $x$，没有写出常数项，所以常数项是 $0$。`,
                  )
                : t(
                    `**Step 2: Find the term with no variable.** It is $${num(c0)}$, and its sign belongs to it, so the constant term is $${num(c0)}$.`,
                    `**第二步：找不含变量的项。** 它是 $${num(c0)}$，符号属于这一项，所以常数项是 $${num(c0)}$。`,
                  ),
              c0 === 0
                ? t("", "")
                : t(
                    `**Check.** The other terms, ${termList(ts.filter((m) => m.x > 0)).en}, all contain $x$, so $${num(c0)}$ is the only term that does not change when $x$ changes.`,
                    `**检验。** 其余各项 ${termList(ts.filter((m) => m.x > 0))["zh-CN"]} 都含有 $x$，所以只有 $${num(c0)}$ 这一项不随 $x$ 变化。`,
                  ),
            ),
          });
        }
        const target = rng.pick(ts.filter((m) => m.x > 0));
        const other = rng.pick(ts.filter((m) => m !== target));
        const note = coefficientNote(target);
        return numberProblem({
          prompt: t(`What is the coefficient of $${vars(target)}$ in $${expr}$?`, `在 $${expr}$ 中，$${vars(target)}$ 的系数是多少？`),
          answer: target.c,
          wrong: [-target.c, target.x, other.c],
          solution: paragraphs(
            t(
              `**Step 1: Split into terms.** Each term takes the sign in front of it, so the terms of $${expr}$ are ${termList(shown).en}.`,
              `**第一步：拆成项。** 每一项都带着它前面的符号，所以 $${expr}$ 的项是 ${termList(shown)["zh-CN"]}。`,
            ),
            t(
              `**Step 2: Read the coefficient.** The term containing $${vars(target)}$ is $${mono(target)}$${note.en}. The number multiplying $${vars(target)}$, sign included, is $${num(target.c)}$.`,
              `**第二步：读出系数。** 含 $${vars(target)}$ 的项是 $${mono(target)}$${note["zh-CN"]}。乘在 $${vars(target)}$ 前面的数（连同符号）是 $${num(target.c)}$。`,
            ),
            t(
              `**Check.** Multiplying $${vars(target)}$ by $${num(target.c)}$ gives back the term $${mono(target)}$ of the polynomial.`,
              `**检验。** 用 $${num(target.c)}$ 乘 $${vars(target)}$，正好得到多项式中的项 $${mono(target)}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "identifying-polynomials",
      title: t("Recognizing polynomials", "识别多项式"),
      explanation: t(
        `A polynomial is built only by multiplying numbers and the variable and adding the results, so every power of the variable in it has a whole-number exponent ($0, 1, 2, \\dots$). The coefficients may be any numbers, fractions and roots of numbers included: $\\frac{x^{2}}{3} = \\frac{1}{3}x^{2}$ and $\\sqrt{2}x$ are terms of a polynomial, because the fraction and the root apply to numbers only.

Dividing by the variable or taking a root of it is different. $\\frac{4}{x} = 4x^{-1}$ has a negative exponent and $\\sqrt{x} = x^{\\frac{1}{2}}$ a fractional one, so neither is a term of a polynomial; nor is $5x^{-2}$, nor $2^{x}$, where the variable is in the exponent. One such term is enough to make an expression not a polynomial.

> **Watch out.** Look at what happens to the variable, not to the numbers: $\\frac{x}{2}$ is a term of a polynomial but $\\frac{2}{x}$ is not, and $\\sqrt{3}x$ is but $\\sqrt{3x}$ is not.`,
        `多项式只由数与变量相乘、再把结果相加构成，所以其中变量的每个幂，指数都是自然数（$0, 1, 2, \\dots$）。系数可以是任意数，包括分数和数的方根：$\\frac{x^{2}}{3} = \\frac{1}{3}x^{2}$ 和 $\\sqrt{2}x$ 都是多项式的项，因为分数和根号只作用在数上。

用变量作除数或对变量开方就不同了。$\\frac{4}{x} = 4x^{-1}$ 的指数是负数，$\\sqrt{x} = x^{\\frac{1}{2}}$ 的指数是分数，所以它们都不是多项式的项；$5x^{-2}$ 不是，变量在指数上的 $2^{x}$ 也不是。只要有一项这样的项，式子就不是多项式。

> **注意。** 要看变量受到了什么运算，而不是数：$\\frac{x}{2}$ 是多项式的项，$\\frac{2}{x}$ 不是；$\\sqrt{3}x$ 是，$\\sqrt{3x}$ 不是。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const m = rng.int(2, 5);
        const b = rng.nonZero(-12, 12);
        const k = rng.int(1, 3);
        const c = rng.int(2, 9);
        const isPoly = rng.bool();
        const kind = isPoly
          ? rng.pick(["fraction", "fractionCoef", "rootCoef"] as const)
          : rng.pick(["negative", "denominator", "root", "exponent"] as const);
        let p = 1;
        let q = 2;
        do {
          q = rng.int(2, 9);
          p = rng.int(1, q - 1);
        } while (gcd(p, q) !== 1);
        const r = rng.pick([2, 3, 5, 6, 7]);
        const special: string = {
          negative: `${c}x^{-${k}}`,
          denominator: `\\frac{${c}}{${pw("x", k)}}`,
          root: `${c}\\sqrt{x}`,
          exponent: `${c}^{x}`,
          fraction: `\\frac{${pw("x", k)}}{${c}}`,
          fractionCoef: `\\frac{${p}}{${q}}${pw("x", k)}`,
          rootCoef: `\\sqrt{${r}}${pw("x", k)}`,
        }[kind];
        const reason: Text = {
          negative: t(`$${special}$ has a negative exponent`, `$${special}$ 的指数是负数`),
          denominator: t(
            `$${special}$ has the variable in the denominator: it equals $${c}x^{-${k}}$`,
            `$${special}$ 的分母含有变量：它等于 $${c}x^{-${k}}$`,
          ),
          root: t(`$${special}$ contains a root of the variable`, `$${special}$ 含有变量的方根`),
          exponent: t(`$${special}$ has the variable in the exponent`, `$${special}$ 的变量在指数上`),
          fraction: t(
            `$${special} = \\frac{1}{${c}}${pw("x", k)}$ has the coefficient $\\frac{1}{${c}}$`,
            `$${special} = \\frac{1}{${c}}${pw("x", k)}$ 的系数是 $\\frac{1}{${c}}$`,
          ),
          fractionCoef: t(`$${special}$ has the coefficient $\\frac{${p}}{${q}}$`, `$${special}$ 的系数是 $\\frac{${p}}{${q}}$`),
          rootCoef: t(
            `$\\sqrt{${r}}$ is a number, so $${special}$ has the coefficient $\\sqrt{${r}}$`,
            `$\\sqrt{${r}}$ 是一个数，所以 $${special}$ 的系数是 $\\sqrt{${r}}$`,
          ),
        }[kind];
        const parts = [mono(term(a, m)), rng.bool() ? `-${special}` : special, String(b)];
        const order = rng.pick([
          [0, 1, 2],
          [1, 0, 2],
          [0, 2, 1],
          [1, 2, 0],
        ]);
        const expr = order.map((i, j) => (j === 0 ? parts[i]! : signed(parts[i]!))).join(" ");
        return choiceProblem({
          prompt: t(`Is $${expr}$ a polynomial?`, `$${expr}$ 是多项式吗？`),
          options: yesNo,
          correct: isPoly ? 0 : 1,
          solution: isPoly
            ? paragraphs(
                t(
                  `${reason.en}. The fraction or root belongs to the coefficient, a number, while the power of $x$ has the whole-number exponent $${k}$.`,
                  `${reason["zh-CN"]}。分数或根号属于系数，是一个数；而 $x$ 的幂的指数是自然数 $${k}$。`,
                ),
                t(
                  `$${mono(term(a, m))}$ is a number times $${pw("x", m)}$, and $${b}$ is a constant. Every term is a number times a whole-number power of $x$, so the expression is a polynomial.`,
                  `$${mono(term(a, m))}$ 是一个数乘 $${pw("x", m)}$，$${b}$ 是常数。每一项都是一个数乘以 $x$ 的自然数次幂，所以它是多项式。`,
                ),
              )
            : paragraphs(
                t(`${reason.en}.`, `${reason["zh-CN"]}。`),
                t(
                  `In a polynomial every power of the variable has a whole-number exponent, and one term that breaks this is enough: the expression is not a polynomial, even though $${mono(term(a, m))}$ and $${b}$ could be terms of one.`,
                  `多项式中变量的每个幂，指数都是自然数；只要有一项不符合，式子就不是多项式，尽管 $${mono(term(a, m))}$ 和 $${b}$ 都可以是多项式的项。`,
                ),
              ),
        });
      },
    },
    {
      id: "evaluating-polynomials",
      title: t("Evaluating a polynomial", "求多项式的值"),
      explanation: t(
        `To evaluate a polynomial, replace the variable by its value and work out the number. Write the value **in parentheses**, because each power must apply to the whole value, sign included. Then follow the order of operations: powers first, then products, then the sum. For $x = -2$:

$$3x^{2} - 5x + 1 = 3(-2)^{2} - 5(-2) + 1 = 12 + 10 + 1 = 23$$

The square comes first, $(-2)^{2} = 4$, and only then the coefficient: $3 \\cdot 4 = 12$. And $-5(-2) = 10$, since the product of two negative numbers is positive.

> **Watch out.** Without parentheses, $-2^{2}$ means $-(2^{2}) = -4$, while $(-2)^{2} = 4$: leaving them out flips the sign of every even power of a negative value. Do not multiply the exponent by the value either: $(-2)^{2}$ is $4$, not $2 \\cdot (-2)$.`,
        `求多项式的值时，把变量换成它的值，算出结果。代入的值要**加上括号**，因为乘方要作用在整个值上，包括符号。然后按运算顺序计算：先乘方，再乘法，最后加减。当 $x = -2$ 时：

$$3x^{2} - 5x + 1 = 3(-2)^{2} - 5(-2) + 1 = 12 + 10 + 1 = 23$$

先算平方 $(-2)^{2} = 4$，再乘系数：$3 \\cdot 4 = 12$。而 $-5(-2) = 10$，因为两个负数的积是正数。

> **注意。** 不加括号时，$-2^{2}$ 表示 $-(2^{2}) = -4$，而 $(-2)^{2} = 4$：漏掉括号，负数的每个偶次幂都会变号。也不要把指数与值相乘：$(-2)^{2}$ 是 $4$，不是 $2 \\cdot (-2)$。`,
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const cubic = rng.bool(0.4);
        const ts = cubic
          ? collect([term(rng.nonZero(-3, 3), 3), term(rng.nonZero(-6, 6), rng.pick([2, 1])), term(rng.nonZero(-9, 9), 0)])
          : collect([term(rng.nonZero(-5, 5), 2), term(rng.nonZero(-9, 9), 1), term(rng.nonZero(-9, 9), 0)]);
        const v = cubic ? rng.nonZero(-3, 3) : rng.nonZero(-5, 5);
        const expr = write(ts);
        const value = valueAt(ts, v);
        const values = poly(...ts.map((m) => [m.c * v ** m.x, ""] as const));
        const exps = [...new Set(ts.map((m) => m.x).filter((e) => e >= 2))];
        const powerList = exps.map((e) => `(${num(v)})^{${e}} = ${num(v ** e)}`).join(", \\; ");
        const powers = exps.length === 0 ? t("", "") : t(`The powers come first: $${powerList}$. `, `先算乘方：$${powerList}$。`);
        return numberProblem({
          prompt: t(`Evaluate $${expr}$ when $x = ${num(v)}$.`, `当 $x = ${num(v)}$ 时，求 $${expr}$ 的值。`),
          answer: value,
          wrong: [
            ts.reduce((s, m) => s + m.c * (m.x % 2 === 0 && m.x > 0 ? -(Math.abs(v) ** m.x) : v ** m.x), 0),
            ts.reduce((s, m) => s + m.c * (m.x === 0 ? 1 : m.x * v), 0),
            ts.reduce((s, m) => s + m.c * (m.x === 1 ? -v : v ** m.x), 0),
          ],
          solution: paragraphs(
            t(
              `**Step 1: Substitute.** Write $${num(v)}$ in parentheses wherever $x$ appears:${steps(`${expr} = ${substituted(ts, v)}`)}`,
              `**第一步：代入。** 凡是出现 $x$ 的地方都写成带括号的 $${num(v)}$：${steps(`${expr} = ${substituted(ts, v)}`)}`,
            ),
            t(
              `**Step 2: Powers, then products.** ${powers.en}Multiplying by the coefficients gives the value of each term:${steps(`= ${values}`)}`,
              `**第二步：先乘方，再乘法。** ${powers["zh-CN"]}再乘以系数，得到每一项的值：${steps(`= ${values}`)}`,
            ),
            t(`**Step 3: Add.** $${values} = ${num(value)}$.`, `**第三步：相加。** $${values} = ${num(value)}$。`),
          ),
        });
      },
    },
  ],
};

export const degreeOfAPolynomial: TopicDef = {
  id: "degree-of-a-polynomial",
  title: t("The Degree of a Polynomial", "多项式的次数"),
  summary: t(
    "Find the degree of a monomial and of a polynomial in one or several variables.",
    "求单项式的次数，以及一元或多元多项式的次数。",
  ),
  prerequisites: ["introduction-to-polynomials"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSA.SSE.A.1.A"],
  intro: t(
    `A polynomial is a sum of terms, each a number times powers of variables. The terms do not all matter equally: when $x$ is large, the term with the most factors of $x$ outweighs all the others. At $x = 10$,

$$2x^{3} + 5x^{2} + 9 = 2000 + 500 + 9 = 2509$$

and $2x^{3}$ already gives most of the value; at $x = 100$ it gives almost all of it. The number of variable factors in a term is its **degree**, and the greatest degree among the terms is the **degree of the polynomial**. It says at a glance what kind of polynomial we have: degree $1$ for the expressions of lines, degree $2$ for those of parabolas.

In this lesson we find the degree of a monomial, and of a polynomial in one or several variables.`,
    `多项式是若干项的和，每一项都是一个数乘以变量的幂。各项的作用并不相同：$x$ 很大时，含 $x$ 因数最多的项会压倒其余各项。当 $x = 10$ 时，

$$2x^{3} + 5x^{2} + 9 = 2000 + 500 + 9 = 2509$$

$2x^{3}$ 已经占了值的大部分；当 $x = 100$ 时，它几乎占了全部。一项中变量因数的个数叫做这一项的**次数**，各项次数中最大的叫做**多项式的次数**。它让我们一眼看出多项式的类型：直线的式子是一次的，抛物线的式子是二次的。

这节课我们求单项式的次数，以及一元或多元多项式的次数。`,
  ),
  knowledgePoints: [
    {
      id: "degree-of-a-monomial",
      title: t("The degree of a monomial", "单项式的次数"),
      explanation: t(
        `A polynomial with a single term is a **monomial**. Its **degree** counts its variable factors: $-4x^{3}y^{2} = -4 \\cdot x \\cdot x \\cdot x \\cdot y \\cdot y$ has five, so its degree is $3 + 2 = 5$. That is why the degree is the **sum** of the exponents of the variables, and why the coefficient plays no part. A variable written without an exponent has exponent $1$: $7xy$ has degree $1 + 1 = 2$.

A nonzero constant such as $9$ has no variable factor, so its degree is $0$. This fits $9 = 9x^{0}$.

> **Watch out.** Add the exponents: do not take only the greatest one, do not multiply them, and do not count the coefficient. The degree of $-4x^{3}y^{2}$ is $5$, not $3$, $6$ or $4$.`,
        `只有一项的多项式叫做**单项式**。单项式的**次数**是它所含变量因数的个数：$-4x^{3}y^{2} = -4 \\cdot x \\cdot x \\cdot x \\cdot y \\cdot y$ 有五个，所以次数是 $3 + 2 = 5$。这就是为什么次数是各变量指数的**和**，而系数不起作用。不写指数的变量，指数是 $1$：$7xy$ 的次数是 $1 + 1 = 2$。

不为零的常数（例如 $9$）没有变量因数，所以次数是 $0$。这与 $9 = 9x^{0}$ 一致。

> **注意。** 要把指数相加：不要只取最大的指数，不要把指数相乘，也不要把系数算进去。$-4x^{3}y^{2}$ 的次数是 $5$，不是 $3$、$6$ 或 $4$。`,
      ),
      generate(rng) {
        if (rng.bool(0.1)) {
          const c = rng.nonZero(-20, 20);
          return numberProblem({
            prompt: t(`What is the degree of the monomial $${c}$?`, `单项式 $${c}$ 的次数是多少？`),
            answer: 0,
            wrong: [c, 1],
            solution: paragraphs(
              t(
                `**Step 1: Look for variables.** $${c}$ is a nonzero constant: it has no variable factor.`,
                `**第一步：找变量。** $${c}$ 是不为零的常数，没有变量因数。`,
              ),
              t(`**Step 2: Count.** With no variable factors, the degree is $0$.`, `**第二步：计数。** 没有变量因数，所以次数是 $0$。`),
              t(
                `**Check.** $${c} = ${c}x^{0}$, since $x^{0} = 1$, and the exponent there is $0$.`,
                `**检验。** $${c} = ${c}x^{0}$，因为 $x^{0} = 1$，这里的指数是 $0$。`,
              ),
            ),
          });
        }
        const count = rng.pick([1, 2, 2, 3]);
        const exps = [rng.int(1, 9), count >= 2 ? rng.int(1, 6) : 0, count === 3 ? rng.int(1, 4) : 0];
        const c = rng.pick([1, -1, rng.nonZero(-12, 12), rng.nonZero(-12, 12)]);
        const body = `${pw("x", exps[0]!)}${pw("y", exps[1]!)}${pw("z", exps[2]!)}`;
        const s = `${c === 1 ? "" : c === -1 ? "-" : c}${body}`;
        const used = exps.filter((e) => e > 0);
        const d = used.reduce((x, y) => x + y, 0);
        const names = ["x", "y", "z"].filter((_, i) => exps[i]! > 0);
        const factors = names.flatMap((v, i) => Array.from({ length: used[i]! }, () => v)).join(" \\cdot ");
        const plain = (e: number) => (e === 1 ? t(" (no exponent written)", "（没有写出指数）") : t("", ""));
        const read = t(
          names
            .map((v, i) => `$${v}$ has exponent $${used[i]}$${plain(used[i]!).en}`)
            .join(", ")
            .replace(/, ([^,]*)$/, " and $1"),
          names.map((v, i) => `$${v}$ 的指数是 $${used[i]}$${plain(used[i]!)["zh-CN"]}`).join("，"),
        );
        return numberProblem({
          prompt: t(`What is the degree of the monomial $${s}$?`, `单项式 $${s}$ 的次数是多少？`),
          answer: d,
          wrong: [Math.max(...used), Math.abs(c), used.reduce((x, y) => x * y, 1)],
          solution: paragraphs(
            t(
              `**Step 1: Read the exponents.** The coefficient${Math.abs(c) === 1 ? "" : ` $${c}$`} does not count. ${read.en}.`,
              `**第一步：读出指数。** 系数${Math.abs(c) === 1 ? "" : ` $${c}$ `}不算在内。${read["zh-CN"]}。`,
            ),
            used.length === 1
              ? t(
                  `**Step 2: Add them.** There is only one variable, so the degree is its exponent, $${d}$.`,
                  `**第二步：相加。** 只有一个变量，所以次数就是它的指数 $${d}$。`,
                )
              : t(
                  `**Step 2: Add them.** $${used.join(" + ")} = ${d}$, so the degree is $${d}$.`,
                  `**第二步：相加。** $${used.join(" + ")} = ${d}$，所以次数是 $${d}$。`,
                ),
            d > 8
              ? t("", "")
              : t(
                  `**Check.** Written as a product, $${body} = ${factors}$ has $${d}$ variable factors.`,
                  `**检验。** 写成乘积，$${body} = ${factors}$，共有 $${d}$ 个变量因数。`,
                ),
          ),
        });
      },
    },
    {
      id: "degree-in-one-variable",
      title: t("The degree of a polynomial", "多项式的次数"),
      explanation: t(
        `The **degree** of a polynomial is the greatest degree among its terms: that term grows fastest as $x$ grows, so it decides how the polynomial behaves for large $x$. In one variable the degree of a term is its exponent, so the degree of the polynomial is its greatest exponent. Terms are not always written in order, so look at every term:

$$3x^{2} - x^{5} + 4 \\text{ has terms of degree } 2, 5, 0, \\text{ so its degree is } 5$$

> **Watch out.** The degree is not the exponent of the first term written, nor the number of terms, nor the largest coefficient: for $3x^{2} - x^{5} + 4$ it is $5$, not $2$, $3$ or $4$.`,
        `多项式的**次数**是它各项次数中最大的一个：$x$ 增大时这一项增长得最快，所以 $x$ 很大时由它决定多项式的大小。一元多项式中，一项的次数就是它的指数，所以多项式的次数就是最大的指数。各项不一定按顺序书写，所以要查看每一项：

$$3x^{2} - x^{5} + 4 \\text{ 各项的次数是 } 2, 5, 0, \\text{ 所以它的次数是 } 5$$

> **注意。** 次数不是写在最前面那一项的指数，不是项数，也不是最大的系数：$3x^{2} - x^{5} + 4$ 的次数是 $5$，不是 $2$、$3$ 或 $4$。`,
      ),
      generate(rng) {
        const powers = rng.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], rng.int(3, 4));
        const ts = powers.map((e) => term(rng.nonZero(-9, 9), e));
        const shown = scramble(rng, ts);
        const d = Math.max(...powers);
        const expr = write(shown);
        const list = shown.map((m) => m.x).join(", ");
        return numberProblem({
          prompt: t(`What is the degree of $${expr}$?`, `$${expr}$ 的次数是多少？`),
          answer: d,
          wrong: [shown[0]!.x, ts.length, Math.max(...ts.map((m) => Math.abs(m.c)))],
          solution: paragraphs(
            t(
              `**Step 1: Find the degree of each term.** In order, the terms of $${expr}$ have degrees $${list}$${powers.includes(0) ? " (the constant term has degree $0$)" : ""}.`,
              `**第一步：求每一项的次数。** $${expr}$ 各项的次数依次是 $${list}$${powers.includes(0) ? "（常数项的次数是 $0$）" : ""}。`,
            ),
            t(
              `**Step 2: Take the greatest.** The greatest is $${d}$, so the polynomial has degree $${d}$.`,
              `**第二步：取最大的。** 最大的是 $${d}$，所以多项式的次数是 $${d}$。`,
            ),
            t(
              `**Check.** In standard form the term of highest degree comes first: $${write(collect(ts))}$ starts with $${mono(collect(ts)[0]!)}$.`,
              `**检验。** 写成标准形式时次数最高的项在最前面：$${write(collect(ts))}$ 以 $${mono(collect(ts)[0]!)}$ 开头。`,
            ),
          ),
        });
      },
    },
    {
      id: "degree-in-several-variables",
      title: t("Polynomials in several variables", "多元多项式的次数"),
      explanation: t(
        `When a polynomial has several variables, find the degree of each term by adding its exponents, then take the greatest. Each term is measured as a whole, by its count of variable factors:

$$x^{4} + 3x^{2}y^{3} - y$$

has terms of degree $4$, $2 + 3 = 5$ and $1$, so its degree is $5$, although no single exponent is $5$.

> **Watch out.** Do not take the greatest single exponent ($4$ here), and do not add the exponents of all the terms together ($4 + 2 + 3 + 1 = 10$): add within one term at a time, then compare the terms.`,
        `多项式含有多个变量时，先把每一项的指数相加得到这一项的次数，再取最大的。每一项作为一个整体，按它的变量因数个数计算：

$$x^{4} + 3x^{2}y^{3} - y$$

各项的次数是 $4$、$2 + 3 = 5$ 和 $1$，所以它的次数是 $5$，尽管没有哪个指数是 $5$。

> **注意。** 不要取单个指数中最大的那个（这里是 $4$），也不要把所有项的指数都加起来（$4 + 2 + 3 + 1 = 10$）：在每一项内部相加，再比较各项。`,
      ),
      generate(rng) {
        const i = rng.int(2, 4);
        const j = rng.int(2, 4);
        const e = rng.int(Math.max(i, j) + 1, i + j - 1);
        const a = term(rng.nonZero(-9, 9), i, j);
        const b = rng.bool() ? term(rng.nonZero(-9, 9), e, 0) : term(rng.nonZero(-9, 9), 0, e);
        const c = rng.pick([
          term(rng.nonZero(-9, 9), 1, 1),
          term(rng.nonZero(-9, 9), 1, 0),
          term(rng.nonZero(-9, 9), 0, 1),
          term(rng.nonZero(-12, 12)),
        ]);
        const shown = rng.shuffle([a, b, c]);
        const expr = write(shown);
        const list = shown.map((m) => (m.x > 0 && m.y > 0 ? `${m.x} + ${m.y} = ${degreeOf(m)}` : String(degreeOf(m)))).join(", \\; ");
        return numberProblem({
          prompt: t(`What is the degree of $${expr}$?`, `$${expr}$ 的次数是多少？`),
          answer: i + j,
          wrong: [e, shown.reduce((s, m) => s + m.x + m.y, 0), degreeOf(shown[0]!)],
          solution: paragraphs(
            t(
              `**Step 1: Find the degree of each term.** Add the exponents within each term. In order, the degrees are $${list}$.`,
              `**第一步：求每一项的次数。** 在每一项内部把指数相加。各项的次数依次是 $${list}$。`,
            ),
            t(
              `**Step 2: Take the greatest.** The greatest is $${i + j}$, from $${mono(a)}$, so the polynomial has degree $${i + j}$.`,
              `**第二步：取最大的。** 最大的是 $${i + j}$，来自 $${mono(a)}$，所以多项式的次数是 $${i + j}$。`,
            ),
            t(
              `**Check.** The term $${mono(b)}$ has the largest single exponent, $${e}$, but as a whole it has degree $${e}$, less than the $${i + j}$ of $${mono(a)}$.`,
              `**检验。** $${mono(b)}$ 含有最大的单个指数 $${e}$，但它整体的次数是 $${e}$，小于 $${mono(a)}$ 的次数 $${i + j}$。`,
            ),
          ),
        });
      },
    },
  ],
};

export const simplifyingPolynomials: TopicDef = {
  id: "simplifying-polynomials",
  title: t("Simplifying Polynomials", "化简多项式"),
  summary: t(
    "Combine like terms and write polynomials in standard form, in order of decreasing powers.",
    "合并同类项，并按降幂排列把多项式写成标准形式。",
  ),
  prerequisites: ["degree-of-a-polynomial", "combining-like-terms"],
  encompasses: [
    { topic: "combining-like-terms", weight: 0.7 },
    { topic: "degree-of-a-polynomial", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.SSE.A.1.A"],
  intro: t(
    `Combining like terms turns $3x + 5x$ into $8x$: both are counts of $x$, so by the distributive law $3x + 5x = (3 + 5)x$. A polynomial can hold several kinds of like terms at once, some $x^{2}$, some $x$ and some numbers, and each kind combines on its own:

$$4x^{2} - 3x + 2 - x^{2} + 5x - 7 = (4 - 1)x^{2} + (-3 + 5)x + (2 - 7) = 3x^{2} + 2x - 5$$

The result is written with the powers in decreasing order, which is called **standard form**. Then two polynomials are easy to compare term by term, and the term of highest degree stands in front. In this lesson we write polynomials in standard form and simplify them, in one variable and in several.`,
    `合并同类项把 $3x + 5x$ 化成 $8x$：两者都是若干个 $x$，由分配律，$3x + 5x = (3 + 5)x$。一个多项式中可以同时有几类同类项，有 $x^{2}$ 项、$x$ 项和常数项，每一类各自合并：

$$4x^{2} - 3x + 2 - x^{2} + 5x - 7 = (4 - 1)x^{2} + (-3 + 5)x + (2 - 7) = 3x^{2} + 2x - 5$$

结果按指数从大到小排列，叫做**标准形式**。这样两个多项式容易逐项比较，次数最高的项也排在最前面。这节课我们把多项式写成标准形式，并化简一元和多元多项式。`,
  ),
  knowledgePoints: [
    {
      id: "standard-form",
      title: t("Standard form and the leading coefficient", "标准形式与首项系数"),
      explanation: t(
        `A polynomial in one variable is in **standard form** when its terms are written in order of decreasing exponents, with the constant term last. A sum can be added in any order, so moving the terms does not change the polynomial, as long as each term keeps its sign:

$$-2x + 5x^{3} + 7 - x^{2} = 5x^{3} - x^{2} - 2x + 7$$

In standard form the first term is the **leading term**, the term of highest degree, and its coefficient is the **leading coefficient**: here $5x^{3}$ and $5$.

> **Watch out.** The leading term is the term of highest power, not the term written first: in $-2x + 5x^{3} + 7 - x^{2}$ the leading coefficient is $5$, not $-2$, and not the degree $3$. A term also moves with its own sign: $-x^{2}$ stays $-x^{2}$ wherever it goes.`,
        `一元多项式的各项按指数从大到小排列、常数项放在最后时，叫做**标准形式**（降幂排列）。加法可以按任意顺序进行，所以只要每一项带着自己的符号，移动各项不会改变多项式：

$$-2x + 5x^{3} + 7 - x^{2} = 5x^{3} - x^{2} - 2x + 7$$

在标准形式中，第一项是次数最高的项，叫做**首项**，它的系数叫做**首项系数**：这里分别是 $5x^{3}$ 和 $5$。

> **注意。** 首项是次数最高的项，不是写在最前面的项：$-2x + 5x^{3} + 7 - x^{2}$ 的首项系数是 $5$，不是 $-2$，也不是次数 $3$。每一项移动时都带着自己的符号：$-x^{2}$ 移到哪里都是 $-x^{2}$。`,
      ),
      generate(rng) {
        const powers = rng.sample([0, 1, 2, 3, 4, 5, 6], rng.int(3, 4));
        const ts = collect(powers.map((e) => term(rng.nonZero(-9, 9), e)));
        const shown = scramble(rng, ts);
        const expr = write(shown);
        const standard = write(ts);
        const lead = ts[0]!;
        const last = ts[ts.length - 1]!;
        if (rng.bool(0.4)) {
          return numberProblem({
            prompt: t(`What is the leading coefficient of $${expr}$?`, `$${expr}$ 的首项系数是多少？`),
            answer: lead.c,
            mistakes: [
              why(
                shown[0]!.c,
                "That is the first coefficient as written. Put the terms in order first: the leading term has the highest power.",
                "这是写在最前面的系数。应先排好顺序：首项是次数最高的项。",
              ),
              why(
                lead.x,
                "That is the degree of the leading term. The question asks for its coefficient.",
                "这是首项的次数，题目问的是它的系数。",
              ),
              why(
                last.c,
                "That belongs to the term of lowest power. The leading term has the highest power.",
                "这是次数最低的项的系数。首项是次数最高的项。",
              ),
            ],
            solution: paragraphs(
              t(
                `**Step 1: Put the terms in order.** Order the terms by decreasing exponent, each with its own sign:${steps(`${expr} = ${standard}`)}`,
                `**第一步：排列各项。** 把各项按指数从大到小排列，每一项带着自己的符号：${steps(`${expr} = ${standard}`)}`,
              ),
              t(
                `**Step 2: Read the leading coefficient.** The leading term is $${mono(lead)}$, the term of highest power, so the leading coefficient is $${num(lead.c)}$.`,
                `**第二步：读出首项系数。** 首项是次数最高的项 $${mono(lead)}$，所以首项系数是 $${num(lead.c)}$。`,
              ),
              t(
                `**Check.** No other term has an exponent above $${lead.x}$: the exponents are $${ts.map((m) => m.x).join(", ")}$.`,
                `**检验。** 没有哪一项的指数超过 $${lead.x}$：各项的指数是 $${ts.map((m) => m.x).join(", ")}$。`,
              ),
            ),
          });
        }
        const options = rng.shuffle([
          standard,
          write([...ts].reverse()),
          write([neg(lead), ...ts.slice(1)]),
          write([...ts.slice(0, -1), neg(last)]),
        ]);
        return choiceProblem({
          prompt: t(`Which is $${expr}$ written in standard form?`, `把 $${expr}$ 写成标准形式，是下面哪一个？`),
          options: options.map((o) => same(`$${o}$`)),
          correct: options.indexOf(standard),
          solution: paragraphs(
            t(
              `**Step 1: Read the exponents.** The terms of $${expr}$ have exponents $${shown.map((m) => m.x).join(", ")}$.`,
              `**第一步：读出指数。** $${expr}$ 各项的指数是 $${shown.map((m) => m.x).join(", ")}$。`,
            ),
            t(
              `**Step 2: Order the terms.** Write them by decreasing exponent, each with its own sign: $${standard}$.`,
              `**第二步：排列各项。** 按指数从大到小书写，每一项带着自己的符号：$${standard}$。`,
            ),
            t(
              `**Check.** The exponents now read $${ts.map((m) => m.x).join(", ")}$, decreasing, and every term of the question appears once with its sign.`,
              `**检验。** 现在指数依次是 $${ts.map((m) => m.x).join(", ")}$，从大到小，原式的每一项都带着符号出现了一次。`,
            ),
          ),
        });
      },
    },
    {
      id: "combining-like-terms-in-polynomials",
      title: t("Combining like terms", "合并同类项"),
      explanation: t(
        `To simplify a polynomial, combine its **like terms**, the terms with the same variable raised to the same power. Like terms are counts of the same thing, so the distributive law adds their coefficients: $4x^{2} - x^{2} = (4 - 1)x^{2} = 3x^{2}$. Terms that are not alike, such as $x^{2}$ and $x$, stay apart. Then write the result in standard form:

$$4x^{2} - 3x + 2 - x^{2} + 5x - 7 = (4x^{2} - x^{2}) + (-3x + 5x) + (2 - 7) = 3x^{2} + 2x - 5$$

> **Watch out.** Each term carries its sign into its group: $-x^{2}$ goes in as $-x^{2}$, so $4x^{2} - x^{2} = 3x^{2}$, not $5x^{2}$. And only like terms combine: $3x^{2} + 2x$ cannot become $5x^{2}$.`,
        `化简多项式时，要合并**同类项**，即变量相同、指数也相同的项。同类项是同一种东西的个数，所以由分配律把它们的系数相加：$4x^{2} - x^{2} = (4 - 1)x^{2} = 3x^{2}$。不是同类项的，例如 $x^{2}$ 和 $x$，不能合并。最后把结果写成标准形式：

$$4x^{2} - 3x + 2 - x^{2} + 5x - 7 = (4x^{2} - x^{2}) + (-3x + 5x) + (2 - 7) = 3x^{2} + 2x - 5$$

> **注意。** 每一项都带着符号进入它的组：$-x^{2}$ 以 $-x^{2}$ 进入，所以 $4x^{2} - x^{2} = 3x^{2}$，不是 $5x^{2}$。而且只有同类项才能合并：$3x^{2} + 2x$ 不能变成 $5x^{2}$。`,
      ),
      keyPrerequisites: ["combining-like-terms"],
      generate(rng) {
        let ts: Term[];
        let answer: Term[];
        let d: number;
        do {
          d = rng.int(2, 3);
          ts = [];
          for (let e = d; e >= 0; e--) {
            const n = e === d || rng.bool(0.6) ? 2 : 1;
            for (let i = 0; i < n; i++) ts.push(term(rng.nonZero(-9, 9), e));
          }
          answer = collect(ts);
        } while (answer.length < 2 || answer[0]!.x !== d);
        const shown = rng.shuffle(ts);
        const expr = write(shown);
        const k = rng.int(0, shown.length - 1);
        const nonConstant = ts.filter((m) => m.x > 0).reduce((s, m) => s + m.c, 0);
        return expandProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer: write(answer),
          wrong: [
            write(collect([term(nonConstant, d), ...ts.filter((m) => m.x === 0)])),
            write(collect(shown.map((m, i) => (i === k ? neg(m) : m)))),
            expr,
          ],
          solution: paragraphs(
            t(
              `**Step 1: Group the like terms.** Collect the terms with the same powers, each with its own sign:${steps(`${expr} = ${groups(shown)}`)}`,
              `**第一步：把同类项归在一起。** 把各变量指数都相同的项放在一起，每一项带着自己的符号：${steps(`${expr} = ${groups(shown)}`)}`,
            ),
            t(
              `**Step 2: Combine each group.** Add the coefficients in each group; the powers stay the same:${steps(`= ${write(answer)}`)}`,
              `**第二步：合并每一组。** 把每组的系数相加，变量的幂不变：${steps(`= ${write(answer)}`)}`,
            ),
            check([plus(shown)], answer),
          ),
        });
      },
    },
    {
      id: "like-terms-in-several-variables",
      title: t("Like terms in several variables", "多元多项式的同类项"),
      explanation: t(
        `With several variables, like terms have the same power of **every** variable, since only then are they counts of the same product. $3x^{2}y$ and $-x^{2}y$ are like terms, both counts of $x \\cdot x \\cdot y$. But $x^{2}y$ and $xy^{2}$ are not: $x^{2}y = x \\cdot x \\cdot y$, while $xy^{2} = x \\cdot y \\cdot y$.

$$5x^{2}y - 2xy^{2} - 3x^{2}y + 6xy^{2} = (5x^{2}y - 3x^{2}y) + (-2xy^{2} + 6xy^{2}) = 2x^{2}y + 4xy^{2}$$

> **Watch out.** Terms of the same degree are not like terms unless every exponent matches: $2x^{2}y + 4xy^{2}$ does not combine into $6x^{2}y$. And keep each sign with its term when you group.`,
        `多个变量时，同类项中**每个**变量的指数都要相同，因为只有这样它们才是同一个乘积的个数。$3x^{2}y$ 和 $-x^{2}y$ 是同类项，都是 $x \\cdot x \\cdot y$ 的个数。但 $x^{2}y$ 和 $xy^{2}$ 不是：$x^{2}y = x \\cdot x \\cdot y$，而 $xy^{2} = x \\cdot y \\cdot y$。

$$5x^{2}y - 2xy^{2} - 3x^{2}y + 6xy^{2} = (5x^{2}y - 3x^{2}y) + (-2xy^{2} + 6xy^{2}) = 2x^{2}y + 4xy^{2}$$

> **注意。** 次数相同的项，只有每个指数都相同才是同类项：$2x^{2}y + 4xy^{2}$ 不能合并成 $6x^{2}y$。归组时每一项都要带着自己的符号。`,
      ),
      generate(rng) {
        const others: readonly (readonly [number, number])[] = [
          [1, 1],
          [2, 0],
          [0, 2],
          [1, 0],
          [0, 1],
          [0, 0],
        ];
        let ts: Term[];
        let answer: Term[];
        do {
          const [ox, oy] = rng.pick(others);
          ts = [
            term(rng.nonZero(-9, 9), 2, 1),
            term(rng.nonZero(-9, 9), 2, 1),
            term(rng.nonZero(-9, 9), 1, 2),
            term(rng.nonZero(-9, 9), 1, 2),
            term(rng.nonZero(-9, 9), ox, oy),
          ];
          if (rng.bool()) ts.push(term(rng.nonZero(-9, 9), ox, oy));
          answer = collect(ts);
        } while (!answer.some((m) => m.x === 2 && m.y === 1) || !answer.some((m) => m.x === 1 && m.y === 2));
        const shown = rng.shuffle(ts);
        const expr = write(shown);
        const k = rng.int(0, shown.length - 1);
        const merged = ts.filter((m) => m.x + m.y === 3).reduce((s, m) => s + m.c, 0);
        return expandProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer: write(answer),
          wrong: [
            write(collect([term(merged, 2, 1), ...ts.filter((m) => m.x + m.y !== 3)])),
            write(collect(shown.map((m, i) => (i === k ? neg(m) : m)))),
            expr,
          ],
          solution: paragraphs(
            t(
              `**Step 1: Group the like terms.** Collect the terms with the same powers, each with its own sign:${steps(`${expr} = ${groups(shown)}`)}`,
              `**第一步：把同类项归在一起。** 把各变量指数都相同的项放在一起，每一项带着自己的符号：${steps(`${expr} = ${groups(shown)}`)}`,
            ),
            t(
              `**Step 2: Combine each group.** Add the coefficients in each group; the powers stay the same:${steps(`= ${write(answer)}`)}`,
              `**第二步：合并每一组。** 把每组的系数相加，变量的幂不变：${steps(`= ${write(answer)}`)}`,
            ),
            check([plus(shown)], answer),
          ),
        });
      },
    },
  ],
};

export const distributiveLawForPolynomials: TopicDef = {
  id: "distributive-law-for-polynomials",
  title: t("The Distributive Law for Polynomials", "单项式乘多项式"),
  summary: t(
    "Multiply a polynomial by a number or a monomial, and simplify sums of such products.",
    "用一个数或单项式乘多项式，并化简这类乘积的和。",
  ),
  prerequisites: ["simplifying-polynomials", "simplifying-expressions", "product-and-quotient-rules"],
  encompasses: [
    { topic: "simplifying-expressions", weight: 0.5 },
    { topic: "product-and-quotient-rules", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.A.1"],
  intro: t(
    `The distributive property says $a(b + c) = ab + ac$: to multiply a sum, multiply each of its parts. A polynomial is a sum of terms, so the same law multiplies it by a number or by a monomial. Picture $3x(2x + 5)$ as a rectangle $3x$ tall and $2x + 5$ wide. It splits into a $3x$ by $2x$ piece and a $3x$ by $5$ piece:

{{figure 0}}

so $3x(2x + 5) = 6x^{2} + 15x$. Each piece is a product of two monomials, found with the product rule: $3x \\cdot 2x = 6x^{2}$ and $3x \\cdot 5 = 15x$.

In this lesson we multiply a polynomial by a number and by a monomial, in one or several variables, and simplify sums of such products.`,
    `分配律告诉我们 $a(b + c) = ab + ac$：一个数乘一个和，就是乘这个和的每一部分。多项式是若干项的和，所以用一个数或一个单项式乘多项式，也用这个规律。把 $3x(2x + 5)$ 想象成高 $3x$、宽 $2x + 5$ 的长方形。它可以分成 $3x$ 乘 $2x$ 和 $3x$ 乘 $5$ 两块：

{{figure 0}}

所以 $3x(2x + 5) = 6x^{2} + 15x$。每一块都是两个单项式的积，用同底数幂的乘法求出：$3x \\cdot 2x = 6x^{2}$，$3x \\cdot 5 = 15x$。

这节课我们用一个数或单项式乘多项式（一元或多元），并化简这类乘积的和。`,
  ),
  introFigures: [
    areaGrid(
      ["2x", "5"],
      ["3x"],
      [["6x²", "15x"]],
      t(
        "A rectangle 3x tall and 2x + 5 wide, split into a 3x by 2x piece of area 6x² and a 3x by 5 piece of area 15x.",
        "高 3x、宽 2x + 5 的长方形，分成面积为 6x² 的 3x 乘 2x 一块和面积为 15x 的 3x 乘 5 一块。",
      ),
      { w: [2, 1.3] },
    ),
  ],
  knowledgePoints: [
    {
      id: "number-times-polynomial",
      title: t("A number times a polynomial", "数乘多项式"),
      explanation: t(
        `The distributive law works for polynomials with any number of terms: $k(a + b + c) = ka + kb + kc$, because taking a sum $k$ times takes each of its parts $k$ times. So the factor outside multiplies **every** term inside, each with its sign:

$$-3(2x^{2} - 5x + 4) = (-3)(2x^{2}) + (-3)(-5x) + (-3)(4) = -6x^{2} + 15x - 12$$

> **Watch out.** Multiply every term, the last one included, and keep the sign of the factor: a negative factor changes the sign of every term. $-3(2x^{2} - 5x + 4)$ is not $-6x^{2} - 5x + 4$, and not $-6x^{2} - 15x - 12$.`,
        `分配律对任意多项的多项式都成立：$k(a + b + c) = ka + kb + kc$，因为把一个和取 $k$ 倍，就是把它的每一部分都取 $k$ 倍。所以括号外的因数要乘以括号内的**每一项**，每一项都带着自己的符号：

$$-3(2x^{2} - 5x + 4) = (-3)(2x^{2}) + (-3)(-5x) + (-3)(4) = -6x^{2} + 15x - 12$$

> **注意。** 每一项都要乘，包括最后一项，并且要带上因数的符号：负的因数会改变每一项的符号。$-3(2x^{2} - 5x + 4)$ 不是 $-6x^{2} - 5x + 4$，也不是 $-6x^{2} - 15x - 12$。`,
      ),
      keyPrerequisites: ["distributive-property"],
      generate(rng) {
        const k = rng.bool(0.15) ? -1 : rng.sign() * rng.int(2, 9);
        const p = collect(rng.sample([0, 1, 2, 3, 4], 3).map((e) => term(rng.nonZero(-9, 9), e)));
        const expr = `${front(term(k))}${wrap(p)}`;
        const answer = write(scale(p, k));
        const shown = p.map((m) => `(${num(k)})(${mono(m)})`).join(" + ");
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([mul(term(k), p[0]!), ...p.slice(1)]),
            write([mul(term(k), p[0]!), ...scale(p.slice(1), Math.abs(k))]),
            write(scale(p, -k)),
          ],
          solution: paragraphs(
            t(
              `**Step 1: Multiply each term by $${num(k)}$.** The factor outside multiplies every term inside, each with its sign:${steps(`${expr} = ${shown}`)}`,
              `**第一步：用 $${num(k)}$ 乘每一项。** 括号外的因数乘括号内的每一项，每一项带着自己的符号：${steps(`${expr} = ${shown}`)}`,
            ),
            t(
              `**Step 2: Work out each product.** Multiply the coefficients, signs included; the powers of $x$ stay as they are:${steps(`= ${answer}`)}`,
              `**第二步：算出每个乘积。** 系数连同符号相乘，$x$ 的幂不变：${steps(`= ${answer}`)}`,
            ),
            check([plus([term(k)], p)], scale(p, k)),
          ),
        });
      },
    },
    {
      id: "monomial-times-polynomial",
      title: t("A monomial times a polynomial", "单项式乘多项式"),
      explanation: t(
        `To multiply a polynomial by a monomial, multiply each term by the monomial. Each of these is a product of two monomials: multiply the coefficients and **add** the exponents, since $x^{m} \\cdot x^{n}$ has $m + n$ factors of $x$.

$$2x^{3}(4x^{2} - x + 5) = 2x^{3} \\cdot 4x^{2} + 2x^{3} \\cdot (-x) + 2x^{3} \\cdot 5 = 8x^{5} - 2x^{4} + 10x^{3}$$

> **Watch out.** Add the exponents, do not multiply them: $2x^{3} \\cdot 4x^{2} = 8x^{5}$, not $8x^{6}$. The constant term is multiplied by the power of $x$ too: $2x^{3} \\cdot 5 = 10x^{3}$, not $10$.`,
        `单项式乘多项式时，用单项式乘以每一项。每一个都是两个单项式的积：系数相乘，指数**相加**，因为 $x^{m} \\cdot x^{n}$ 中共有 $m + n$ 个 $x$ 因数。

$$2x^{3}(4x^{2} - x + 5) = 2x^{3} \\cdot 4x^{2} + 2x^{3} \\cdot (-x) + 2x^{3} \\cdot 5 = 8x^{5} - 2x^{4} + 10x^{3}$$

> **注意。** 指数相加，不是相乘：$2x^{3} \\cdot 4x^{2} = 8x^{5}$，不是 $8x^{6}$。常数项也要乘以 $x$ 的幂：$2x^{3} \\cdot 5 = 10x^{3}$，不是 $10$。`,
      ),
      keyPrerequisites: ["product-and-quotient-rules"],
      generate(rng) {
        const m = term(rng.bool(0.15) ? rng.sign() : rng.nonZero(-6, 6), rng.int(1, 4));
        const powers = rng.sample([1, 2, 3], rng.int(1, 2));
        powers.push(0);
        const p = collect(powers.map((e) => term(rng.nonZero(-9, 9), e)));
        const expr = `${front(m)}${wrap(p)}`;
        const answer = write(times([m], p));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write(collect(p.map((q) => term(m.c * q.c, m.x * q.x)))),
            write(p.map((q) => (q.x === 0 ? term(m.c * q.c) : mul(m, q)))),
            write([mul(m, p[0]!), ...p.slice(1)]),
          ],
          solution: paragraphs(
            t(
              `**Step 1: Multiply each term by $${mono(m)}$.**${steps(`${expr} = ${p.map((q) => `(${mono(m)})(${mono(q)})`).join(" + ")}`)}`,
              `**第一步：用 $${mono(m)}$ 乘每一项。**${steps(`${expr} = ${p.map((q) => `(${mono(m)})(${mono(q)})`).join(" + ")}`)}`,
            ),
            t(
              `**Step 2: Multiply the coefficients and add the exponents.** In each product, multiply the coefficients, signs included, and add the exponents of $x$:${steps(...p.map((q) => `(${mono(m)})(${mono(q)}) = ${mono(mul(m, q))}`))}So the product is $${answer}$.`,
              `**第二步：系数相乘，指数相加。** 每个乘积中，系数连同符号相乘，$x$ 的指数相加：${steps(...p.map((q) => `(${mono(m)})(${mono(q)}) = ${mono(mul(m, q))}`))}所以乘积是 $${answer}$。`,
            ),
            check([plus([m], p)], times([m], p)),
          ),
        });
      },
    },
    {
      id: "several-variables",
      title: t("Monomials in several variables", "多元单项式乘多项式"),
      explanation: t(
        `With several variables, the product rule applies to each variable on its own: multiply the coefficients, add the exponents of $x$, and separately add the exponents of $y$. A variable missing from a term has exponent $0$ there, so the monomial's power of it carries over unchanged. For example, $-2xy \\cdot 3x = -6x^{2}y$: the exponents of $x$ add to $2$, and $y$ keeps its exponent $1$.

$$-2xy(3x - 4y + 1) = -6x^{2}y + 8xy^{2} - 2xy$$

> **Watch out.** Multiply the variables as well as the coefficients, and keep the signs: $-2xy \\cdot (-4y) = 8xy^{2}$, positive, not $8y$ or $-8xy^{2}$. Every term is multiplied, the constant included: $-2xy \\cdot 1 = -2xy$.`,
        `多个变量时，同底数幂的乘法对每个变量分别使用：系数相乘，$x$ 的指数相加，$y$ 的指数另外相加。某一项不含某个变量，就相当于这个变量的指数是 $0$，单项式中它的幂原样保留。例如 $-2xy \\cdot 3x = -6x^{2}y$：$x$ 的指数相加得 $2$，$y$ 的指数仍是 $1$。

$$-2xy(3x - 4y + 1) = -6x^{2}y + 8xy^{2} - 2xy$$

> **注意。** 变量和系数都要相乘，符号也要保留：$-2xy \\cdot (-4y) = 8xy^{2}$，是正的，不是 $8y$ 或 $-8xy^{2}$。每一项都要乘，包括常数项：$-2xy \\cdot 1 = -2xy$。`,
      ),
      generate(rng) {
        let i: number;
        let j: number;
        let m: Term;
        let p: Term[];
        do {
          i = rng.int(0, 2);
          j = rng.int(0, 2);
          m = term(rng.bool(0.2) ? rng.sign() : rng.nonZero(-6, 6), i, j);
          const keys = rng.pick([
            [
              [2, 0],
              [1, 1],
              [0, 2],
            ],
            [
              [1, 0],
              [0, 1],
              [0, 0],
            ],
            [
              [1, 0],
              [0, 1],
            ],
            [
              [2, 0],
              [0, 1],
            ],
            [
              [1, 1],
              [0, 0],
            ],
          ] as const);
          p = collect(keys.map(([a, b]) => term(rng.nonZero(-9, 9), a, b)));
        } while (i + j === 0);
        const expr = `${front(m)}${wrap(p)}`;
        const answer = write(times([m], p));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [write([mul(m, p[0]!), ...p.slice(1)]), write(scale(p, m.c)), write(times([term(Math.abs(m.c), i, j)], p))],
          solution: paragraphs(
            t(
              `**Step 1: Multiply each term by $${mono(m)}$.**${steps(`${expr} = ${p.map((q) => `(${mono(m)})(${mono(q)})`).join(" + ")}`)}`,
              `**第一步：用 $${mono(m)}$ 乘每一项。**${steps(`${expr} = ${p.map((q) => `(${mono(m)})(${mono(q)})`).join(" + ")}`)}`,
            ),
            t(
              `**Step 2: Multiply the coefficients and add the exponents.** In each product, multiply the coefficients, signs included, and add the exponents of each variable separately:${steps(...p.map((q) => `(${mono(m)})(${mono(q)}) = ${mono(mul(m, q))}`))}So the product is $${answer}$.`,
              `**第二步：系数相乘，指数相加。** 每个乘积中，系数连同符号相乘，每个变量的指数分别相加：${steps(...p.map((q) => `(${mono(m)})(${mono(q)}) = ${mono(mul(m, q))}`))}所以乘积是 $${answer}$。`,
            ),
            check([plus([m], p)], times([m], p)),
          ),
        });
      },
    },
    {
      id: "expanding-and-simplifying",
      title: t("Expanding, then simplifying", "先展开，再化简"),
      explanation: t(
        `When an expression has several products, expand each one, then combine like terms. A minus sign in front of a product belongs to its factor: in $-2(x^{2} + 4x - 1)$ every term is multiplied by $-2$, so all three signs change.

$$x(3x - 2) - 2(x^{2} + 4x - 1) = 3x^{2} - 2x - 2x^{2} - 8x + 2 = x^{2} - 10x + 2$$

> **Watch out.** The negative factor reaches every term in its parentheses, not just the first: $-2(x^{2} + 4x - 1)$ is $-2x^{2} - 8x + 2$, not $-2x^{2} + 8x - 2$ and not $-2x^{2} + 4x - 1$. Expanding is not the end either: combine the like terms.`,
        `式子中有几个乘积时，先把每个乘积展开，再合并同类项。乘积前面的减号属于它的因数：在 $-2(x^{2} + 4x - 1)$ 中，每一项都乘以 $-2$，所以三项都变号。

$$x(3x - 2) - 2(x^{2} + 4x - 1) = 3x^{2} - 2x - 2x^{2} - 8x + 2 = x^{2} - 10x + 2$$

> **注意。** 负的因数要乘到括号内的每一项，不只是第一项：$-2(x^{2} + 4x - 1)$ 是 $-2x^{2} - 8x + 2$，不是 $-2x^{2} + 8x - 2$，也不是 $-2x^{2} + 4x - 1$。展开之后还没完：要合并同类项。`,
      ),
      keyPrerequisites: ["simplifying-expressions"],
      generate(rng) {
        let m: Term;
        let p: Term[];
        let k: number;
        let q: Term[];
        let answer: Term[];
        do {
          m = term(rng.nonZero(-5, 5), 1);
          p = [term(rng.nonZero(-6, 6), 1), term(rng.nonZero(-9, 9))];
          k = rng.nonZero(-6, 6);
          q = [term(rng.pick([1, 1, 2, 3, -1]), 2), term(rng.nonZero(-9, 9), 1), term(rng.nonZero(-9, 9))];
          answer = collect([...products([m], p), ...scale(q, k)]);
        } while (answer.length < 2 || answer[0]!.x !== 2);
        const expr = `${front(m)}${wrap(p)} ${k < 0 ? "-" : "+"} ${Math.abs(k) === 1 ? "" : Math.abs(k)}${wrap(q)}`;
        const expanded = write([...products([m], p), ...scale(q, k)]);
        return expandProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer: write(answer),
          wrong: [
            write(collect([...products([m], p), mul(term(k), q[0]!), ...scale(q.slice(1), Math.abs(k))])),
            write(collect([...products([m], p), mul(term(k), q[0]!), ...q.slice(1)])),
            expanded,
          ],
          solution: paragraphs(
            t(
              `**Step 1: Expand each product.** Multiply $${mono(m)}$ into the first parentheses and $${num(k)}$ into the second, every term with its sign:${steps(`${expr} = ${expanded}`)}`,
              `**第一步：展开每个乘积。** 用 $${mono(m)}$ 乘第一个括号，用 $${num(k)}$ 乘第二个括号，每一项都带着符号：${steps(`${expr} = ${expanded}`)}`,
            ),
            t(
              `**Step 2: Combine like terms.** Group the terms with the same power and add their coefficients:${steps(`= ${groups([...products([m], p), ...scale(q, k)])}`, `= ${write(answer)}`)}`,
              `**第二步：合并同类项。** 把同次幂的项归在一起，系数相加：${steps(`= ${groups([...products([m], p), ...scale(q, k)])}`, `= ${write(answer)}`)}`,
            ),
            check([plus([m], p), k < 0 ? minus([term(-k)], q) : plus([term(k)], q)], answer),
          ),
        });
      },
    },
  ],
};

/** quadraticKeys are the monomials of a quadratic in x and y. */
const quadraticKeys: readonly (readonly [number, number])[] = [
  [2, 0],
  [1, 1],
  [0, 2],
];

/** somePolynomial draws a polynomial in x with the given number of terms and degree, in standard form. */
function somePolynomial(rng: Rng, d: number, count: number): Term[] {
  const lower = rng.sample(
    Array.from({ length: d }, (_, i) => i),
    Math.min(count - 1, d),
  );
  return collect([d, ...lower].map((e) => term(rng.nonZero(-9, 9), e)));
}

export const addingAndSubtractingPolynomials: TopicDef = {
  id: "adding-and-subtracting-polynomials",
  title: t("Adding and Subtracting Polynomials", "多项式的加减"),
  summary: t("Add and subtract polynomials in one or several variables.", "一元或多元多项式的加法与减法。"),
  prerequisites: ["distributive-law-for-polynomials"],
  encompasses: [{ topic: "simplifying-polynomials", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSA.APR.A.1"],
  intro: t(
    `Adding and subtracting polynomials needs nothing new: remove the parentheses, then combine like terms. The care is all in the signs. A plus sign in front of parentheses leaves the terms as they are. A minus sign is a factor of $-1$, so by the distributive law it changes the sign of every term inside:

$$-(2x^{2} - 4x + 6) = -2x^{2} + 4x - 6$$

So $(5x^{2} - 3x + 1) - (2x^{2} - 4x + 6) = 5x^{2} - 3x + 1 - 2x^{2} + 4x - 6 = 3x^{2} + x - 5$. Putting $x = 1$ into both sides checks it: $3 - 4 = -1$ and $3 + 1 - 5 = -1$.

In this lesson we add and subtract polynomials in one and in several variables.`,
    `多项式的加减不需要新方法：去掉括号，再合并同类项。要小心的全在符号上。括号前是加号时，各项保持不变。括号前的减号相当于因数 $-1$，由分配律，括号内每一项都要变号：

$$-(2x^{2} - 4x + 6) = -2x^{2} + 4x - 6$$

所以 $(5x^{2} - 3x + 1) - (2x^{2} - 4x + 6) = 5x^{2} - 3x + 1 - 2x^{2} + 4x - 6 = 3x^{2} + x - 5$。把 $x = 1$ 代入两边检验：$3 - 4 = -1$，$3 + 1 - 5 = -1$。

这节课我们做一元和多元多项式的加法与减法。`,
  ),
  knowledgePoints: [
    {
      id: "adding-polynomials",
      title: t("Adding polynomials", "多项式相加"),
      explanation: t(
        `To add polynomials, remove the parentheses, which changes nothing after a plus sign, and combine like terms. Combining adds only the coefficients; the exponents stay, because $x^{2} + x^{2}$ is two copies of $x^{2}$, that is $2x^{2}$.

$$(3x^{2} - 2x + 5) + (x^{2} + 4x - 7) = (3x^{2} + x^{2}) + (-2x + 4x) + (5 - 7) = 4x^{2} + 2x - 2$$

> **Watch out.** Adding like terms never changes the exponent: $3x^{2} + x^{2} = 4x^{2}$, not $4x^{4}$. And each term keeps its sign when you remove the parentheses: $5 + (-7) = -2$, not $12$.`,
        `多项式相加时，去掉括号（加号后面的括号去掉后各项不变），再合并同类项。合并时只有系数相加，指数不变，因为 $x^{2} + x^{2}$ 是两个 $x^{2}$，即 $2x^{2}$。

$$(3x^{2} - 2x + 5) + (x^{2} + 4x - 7) = (3x^{2} + x^{2}) + (-2x + 4x) + (5 - 7) = 4x^{2} + 2x - 2$$

> **注意。** 合并同类项不改变指数：$3x^{2} + x^{2} = 4x^{2}$，不是 $4x^{4}$。去掉括号时每一项都带着自己的符号：$5 + (-7) = -2$，不是 $12$。`,
      ),
      generate(rng) {
        let p: Term[];
        let q: Term[];
        let answer: Term[];
        do {
          const d = rng.int(2, 3);
          p = somePolynomial(rng, d, rng.int(3, 4));
          q = somePolynomial(rng, rng.int(1, d), 3);
          answer = collect([...p, ...q]);
        } while (answer.length < 2);
        const expr = `${wrap(p)} + ${wrap(q)}`;
        const shared = (m: Term) => p.some((a) => a.x === m.x) && q.some((b) => b.x === m.x);
        return expandProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer: write(answer),
          wrong: [
            write(collect(answer.map((m) => (shared(m) && m.x > 0 ? term(m.c, 2 * m.x) : m)))),
            write(collect([...p, ...q.map((m) => (m.x === 0 ? neg(m) : m))])),
            write(collect([...p, ...scale(q, -1)])),
          ],
          solution: paragraphs(
            t(
              `**Step 1: Remove the parentheses.** After a plus sign every term stays as it is:${steps(`${expr} = ${write([...p, ...q])}`)}`,
              `**第一步：去掉括号。** 加号后面的括号去掉后，各项不变：${steps(`${expr} = ${write([...p, ...q])}`)}`,
            ),
            t(
              `**Step 2: Combine like terms.** Group the terms with the same power and add their coefficients; the exponents do not change:${steps(`= ${groups([...p, ...q])}`, `= ${write(answer)}`)}`,
              `**第二步：合并同类项。** 把同次幂的项归在一起，系数相加，指数不变：${steps(`= ${groups([...p, ...q])}`, `= ${write(answer)}`)}`,
            ),
            check([plus(p), plus(q)], answer),
          ),
        });
      },
    },
    {
      id: "subtracting-polynomials",
      title: t("Subtracting polynomials", "多项式相减"),
      explanation: t(
        `To subtract a polynomial, subtract **every** one of its terms. The minus sign in front of the parentheses is a factor of $-1$, and the distributive law multiplies each term inside by it, so every sign changes:

$$(5x^{2} - 3x + 1) - (2x^{2} - 4x + 6) = 5x^{2} - 3x + 1 - 2x^{2} + 4x - 6 = 3x^{2} + x - 5$$

Subtracting $-4x$ is adding $4x$, and subtracting $6$ gives $-6$.

> **Watch out.** Change the sign of every term of the second polynomial, not just the first: $-(2x^{2} - 4x + 6)$ is $-2x^{2} + 4x - 6$, not $-2x^{2} - 4x + 6$. And keep the order: $A - B$ is not $B - A$.`,
        `减去一个多项式，就要减去它的**每一项**。括号前的减号相当于因数 $-1$，由分配律，它乘以括号内的每一项，所以每一项都变号：

$$(5x^{2} - 3x + 1) - (2x^{2} - 4x + 6) = 5x^{2} - 3x + 1 - 2x^{2} + 4x - 6 = 3x^{2} + x - 5$$

减去 $-4x$ 就是加上 $4x$，减去 $6$ 得 $-6$。

> **注意。** 第二个多项式的每一项都要变号，不只是第一项：$-(2x^{2} - 4x + 6)$ 是 $-2x^{2} + 4x - 6$，不是 $-2x^{2} - 4x + 6$。顺序也不能颠倒：$A - B$ 不是 $B - A$。`,
      ),
      generate(rng) {
        let p: Term[];
        let q: Term[];
        let answer: Term[];
        do {
          const d = rng.int(2, 3);
          p = somePolynomial(rng, d, rng.int(3, 4));
          q = somePolynomial(rng, rng.int(2, d), 3);
          answer = collect([...p, ...scale(q, -1)]);
        } while (answer.length < 2);
        const expr = `${wrap(p)} - ${wrap(q)}`;
        const removed = write([...p, ...scale(q, -1)]);
        return expandProblem({
          prompt: t(`Simplify $${expr}$.`, `化简 $${expr}$。`),
          answer: write(answer),
          wrong: [write(collect([...p, neg(q[0]!), ...q.slice(1)])), write(collect([...p, ...q])), write(collect([...q, ...scale(p, -1)]))],
          solution: paragraphs(
            t(
              `**Step 1: Distribute the minus sign.** The minus sign multiplies every term of $${write(q)}$ by $-1$, so each one changes sign:${steps(`${expr} = ${removed}`)}`,
              `**第一步：去掉减号后的括号。** 减号把 $${write(q)}$ 的每一项都乘以 $-1$，所以每一项都变号：${steps(`${expr} = ${removed}`)}`,
            ),
            t(
              `**Step 2: Combine like terms.** Group the terms with the same power and add their coefficients:${steps(`= ${groups([...p, ...scale(q, -1)])}`, `= ${write(answer)}`)}`,
              `**第二步：合并同类项。** 把同次幂的项归在一起，系数相加：${steps(`= ${groups([...p, ...scale(q, -1)])}`, `= ${write(answer)}`)}`,
            ),
            check([plus(p), minus(q)], answer),
          ),
        });
      },
    },
    {
      id: "subtracting-from",
      title: t("Subtracting from a polynomial in several variables", "从多元多项式中减去多项式"),
      explanation: t(
        `"Subtract $B$ from $A$" means start with $A$ and take $B$ away: $A - B$, with the polynomial after "from" written first. Then subtract as before, changing the sign of every term of $B$. Polynomials in several variables follow the same rules; like terms have the same power of every variable. Subtracting $x^{2} + 3xy$ from $4x^{2} - xy + y^{2}$:

$$(4x^{2} - xy + y^{2}) - (x^{2} + 3xy) = 4x^{2} - xy + y^{2} - x^{2} - 3xy = 3x^{2} - 4xy + y^{2}$$

> **Watch out.** The order is the reverse of the words: "subtract $B$ from $A$" is $A - B$, not $B - A$, which would give the opposite of every term. And every term of $B$ changes sign, not just the first.`,
        `"从 $A$ 中减去 $B$"表示从 $A$ 开始，拿走 $B$：即 $A - B$。然后照常做减法，把 $B$ 的每一项都变号。多元多项式也遵循同样的规则；同类项中每个变量的指数都相同。从 $4x^{2} - xy + y^{2}$ 中减去 $x^{2} + 3xy$：

$$(4x^{2} - xy + y^{2}) - (x^{2} + 3xy) = 4x^{2} - xy + y^{2} - x^{2} - 3xy = 3x^{2} - 4xy + y^{2}$$

> **注意。** "从 $A$ 中减去 $B$"是 $A - B$，不是 $B - A$，后者会使每一项都变成相反数。而且 $B$ 的每一项都要变号，不只是第一项。`,
      ),
      generate(rng) {
        let p: Term[];
        let q: Term[];
        let answer: Term[];
        do {
          p = collect(quadraticKeys.map(([a, b]) => term(rng.nonZero(-9, 9), a, b)));
          q = collect(rng.sample(quadraticKeys, rng.int(2, 3)).map(([a, b]) => term(rng.nonZero(-9, 9), a, b)));
          if (rng.bool(0.4)) q.push(term(rng.nonZero(-9, 9)));
          answer = collect([...p, ...scale(q, -1)]);
        } while (answer.length < 2);
        const from = write(p);
        const sub = write(q);
        const expr = `${wrap(p)} - ${wrap(q)}`;
        return expandProblem({
          prompt: t(`Subtract $${sub}$ from $${from}$.`, `从 $${from}$ 中减去 $${sub}$。`),
          answer: write(answer),
          wrong: [write(collect([...q, ...scale(p, -1)])), write(collect([...p, ...q])), write(collect([...p, neg(q[0]!), ...q.slice(1)]))],
          solution: paragraphs(
            t(
              `**Step 1: Write the subtraction.** We start from $${from}$ and take $${sub}$ away:${steps(expr)}`,
              `**第一步：写出减法算式。** 从 $${from}$ 开始，减去 $${sub}$：${steps(expr)}`,
            ),
            t(
              `**Step 2: Distribute the minus sign.** Every term of $${sub}$ changes sign:${steps(`= ${write([...p, ...scale(q, -1)])}`)}`,
              `**第二步：去掉括号。** $${sub}$ 的每一项都变号：${steps(`= ${write([...p, ...scale(q, -1)])}`)}`,
            ),
            t(
              `**Step 3: Combine like terms.** Like terms have the same power of every variable:${steps(`= ${groups([...p, ...scale(q, -1)])}`, `= ${write(answer)}`)}`,
              `**第三步：合并同类项。** 同类项中每个变量的指数都相同：${steps(`= ${groups([...p, ...scale(q, -1)])}`, `= ${write(answer)}`)}`,
            ),
            check([plus(p), minus(q)], answer),
          ),
        });
      },
    },
  ],
};

/** termNames are the names of polynomials by number of terms, with "none of these" for four or more. */
const termNames: readonly Text[] = [
  t("Monomial", "单项式"),
  t("Binomial", "二项式"),
  t("Trinomial", "三项式"),
  t("None of these", "以上都不是"),
];

/** termName writes the name of a polynomial with n terms in a sentence. */
function termName(n: number): Text {
  return [
    t("a monomial", "单项式"),
    t("a binomial", "二项式"),
    t("a trinomial", "三项式"),
    t("none of these: it has four terms", "以上都不是：它有四项"),
  ][Math.min(n, 4) - 1]!;
}

/** degreeNames are the names of polynomials in one variable by degree. */
const degreeNames: readonly Text[] = [
  t("Constant", "常数（零次）"),
  t("Linear", "一次"),
  t("Quadratic", "二次"),
  t("Cubic", "三次"),
  t("Quartic", "四次"),
  t("Quintic", "五次"),
];

export const monomialsBinomialsAndTrinomials: TopicDef = {
  id: "monomials-binomials-and-trinomials",
  title: t("Monomials, Binomials and Trinomials", "单项式、二项式与三项式"),
  summary: t("Name polynomials by their number of terms and by their degree.", "按项数和次数给多项式命名。"),
  prerequisites: ["adding-and-subtracting-polynomials"],
  encompasses: [{ topic: "adding-and-subtracting-polynomials", weight: 0.2 }],
  xp: 10,
  standards: ["CCSS.HSA.SSE.A.1.A"],
  intro: t(
    `Names save words. Instead of "a polynomial with two terms" we say a **binomial**, and instead of "a polynomial of degree $2$" we say a **quadratic**. Both names come from things we can already count: the number of terms and the degree. For example, $x^{2} - 9$ has two terms and degree $2$, so it is a quadratic binomial, while $5x^{3}$ has one term and degree $3$, so it is a cubic monomial.

In this lesson we name polynomials by their number of terms and by their degree, simplifying first when like terms can combine.`,
    `名称可以省去许多话。我们不说"有两项的多项式"，而说**二项式**；不说"次数为 $2$ 的多项式"，而说**二次**多项式。两种名称都来自我们已经会数的东西：项数和次数。例如 $x^{2} - 9$ 有两项、次数是 $2$，所以是二次二项式；$5x^{3}$ 有一项、次数是 $3$，所以是三次单项式。

这节课我们按项数和次数给多项式命名，能合并同类项时先化简。`,
  ),
  knowledgePoints: [
    {
      id: "naming-by-number-of-terms",
      title: t("Naming by the number of terms", "按项数命名"),
      explanation: t(
        `A polynomial with one term is a **monomial**, with two terms a **binomial**, and with three terms a **trinomial**: the prefixes mono-, bi- and tri- mean one, two and three. Terms are separated by plus and minus signs, so a product of numbers and variables, however long, is a single term. Thus $-7x^{3}y^{2}$ is a monomial, $x^{4} - 9$ a binomial and $2x^{2} + xy - y^{2}$ a trinomial. With four or more terms there is no special name.

> **Watch out.** Count terms, not variables or factors: $-7x^{3}y^{2}$ has two variables but is one term, a monomial. Only a plus or minus sign between terms starts a new term.`,
        `只有一项的多项式叫做**单项式**，有两项的叫做**二项式**，有三项的叫做**三项式**。各项之间由加号和减号隔开，所以数与变量的乘积无论多长，都只是一项。于是 $-7x^{3}y^{2}$ 是单项式，$x^{4} - 9$ 是二项式，$2x^{2} + xy - y^{2}$ 是三项式。四项或更多项的多项式没有专门的名称。

> **注意。** 要数项，不是数变量或因数：$-7x^{3}y^{2}$ 含两个变量，但只有一项，是单项式。只有项与项之间的加号或减号才开始新的一项。`,
      ),
      generate(rng) {
        const n = rng.pick([1, 1, 2, 2, 3, 3, 4]);
        const keys: [number, number][] = [];
        for (let i = 0; i <= 4; i++) for (let j = 0; j <= 3; j++) if (i + j <= 5) keys.push([i, j]);
        const ts = rng.sample(keys, n).map(([a, b]) => term(rng.bool(0.25) ? rng.sign() : rng.nonZero(-9, 9), a, b));
        const expr = write(ts);
        const name = termName(n);
        return reasoned(
          choiceProblem({
            prompt: t(`Is $${expr}$ a monomial, a binomial or a trinomial?`, `$${expr}$ 是单项式、二项式还是三项式？`),
            options: termNames,
            correct: n - 1,
            solution: paragraphs(
              n === 1
                ? t(
                    `$${expr}$ is a product of a number and variables, with no plus or minus sign between parts: it is a single term.`,
                    `$${expr}$ 是一个数与变量的乘积，中间没有加号或减号：它只有一项。`,
                  )
                : t(
                    `Plus and minus signs split $${expr}$ into the terms ${termList(ts).en}.`,
                    `加号和减号把 $${expr}$ 分成各项：${termList(ts)["zh-CN"]}。`,
                  ),
              t(
                `${n === 1 ? "One term" : `That makes ${["", "", "two", "three", "four"][n]} terms`}, so it is ${name.en}.`,
                `${n === 1 ? "只有一项" : `共 ${n} 项`}，所以它是${name["zh-CN"]}。`,
              ),
            ),
          }),
          [
            [termNames[0]!.en, `A monomial has one term, and this has $${n}$.`, `单项式只有一项，而它有 $${n}$ 项。`],
            [termNames[1]!.en, `A binomial has two terms, and this has $${n}$.`, `二项式有两项，而它有 $${n}$ 项。`],
            [termNames[2]!.en, `A trinomial has three terms, and this has $${n}$.`, `三项式有三项，而它有 $${n}$ 项。`],
            [
              termNames[3]!.en,
              `One of the three names fits: count the terms, $${n}$ of them.`,
              `三个名称中有一个符合：数一数项数，共 $${n}$ 项。`,
            ],
          ],
        );
      },
    },
    {
      id: "naming-by-degree",
      title: t("Naming by degree", "按次数命名"),
      explanation: t(
        `Polynomials in one variable are also named by their degree, the greatest exponent of the variable, since the degree decides most of how a polynomial behaves:

| Degree | Name |
| :--- | :--- |
| $0$ | constant |
| $1$ | linear |
| $2$ | quadratic |
| $3$ | cubic |
| $4$ | quartic |
| $5$ | quintic |

The two kinds of names combine: $5 - 3x^{2} + x$ is a quadratic trinomial, and $x^{3} - 8$ a cubic binomial.

> **Watch out.** The name comes from the greatest exponent, wherever that term is written, not from the first term or the number of terms: $5 - 3x^{2} + x$ is quadratic, not constant and not cubic.`,
        `一元多项式也按次数（变量的最大指数）命名，因为次数在很大程度上决定了多项式的性质：

| 次数 | 名称 |
| :--- | :--- |
| $0$ | 常数（零次） |
| $1$ | 一次 |
| $2$ | 二次 |
| $3$ | 三次 |
| $4$ | 四次 |
| $5$ | 五次 |

两种名称可以合用：$5 - 3x^{2} + x$ 是二次三项式，$x^{3} - 8$ 是三次二项式。

> **注意。** 名称由最大的指数决定，不管这一项写在哪里，也与第一项或项数无关：$5 - 3x^{2} + x$ 是二次的，不是常数，也不是三次。`,
      ),
      generate(rng) {
        const d = rng.pick([0, 1, 1, 2, 2, 2, 3, 3, 4, 5]);
        const ts =
          d === 0
            ? [term(rng.nonZero(-20, 20))]
            : [
                d,
                ...rng.sample(
                  Array.from({ length: d }, (_, i) => i),
                  rng.int(0, Math.min(d, 2)),
                ),
              ].map((e) => term(rng.nonZero(-9, 9), e));
        const shown = ts.length > 1 ? scramble(rng, ts) : ts;
        const expr = write(shown);
        const name = degreeNames[d]!;
        return choiceProblem({
          prompt: t(`Classify $${expr}$ by its degree.`, `按次数给 $${expr}$ 分类。`),
          options: degreeNames,
          correct: d,
          solution:
            d === 0
              ? paragraphs(
                  t(`$${expr}$ has no variable, so its degree is $0$.`, `$${expr}$ 不含变量，所以次数是 $0$。`),
                  t(`A polynomial of degree $0$ is a constant.`, `次数为 $0$ 的多项式是常数。`),
                )
              : paragraphs(
                  t(
                    `The exponents of $x$ in $${expr}$ are $${shown.map((m) => m.x).join(", ")}$. The greatest is $${d}$, so the degree is $${d}$.`,
                    `$${expr}$ 中 $x$ 的指数是 $${shown.map((m) => m.x).join(", ")}$，最大的是 $${d}$，所以次数是 $${d}$。`,
                  ),
                  t(
                    `A polynomial of degree $${d}$ is called ${name.en.toLowerCase()}.`,
                    `次数为 $${d}$ 的多项式叫做${name["zh-CN"]}多项式。`,
                  ),
                  t(
                    `**Check.** In standard form, $${write(collect(ts))}$, the first term $${mono(collect(ts)[0]!)}$ has exponent $${d}$.`,
                    `**检验。** 写成标准形式 $${write(collect(ts))}$，首项 $${mono(collect(ts)[0]!)}$ 的指数是 $${d}$。`,
                  ),
                ),
        });
      },
    },
    {
      id: "simplifying-before-naming",
      title: t("Simplifying before naming", "先化简，再命名"),
      explanation: t(
        `Name a polynomial by its number of terms only after simplifying it, because like terms combine and may cancel completely:

$$(2x^{2} + 3x - 1) - (2x^{2} - x + 4) = 2x^{2} - 2x^{2} + 3x + x - 1 - 4 = 4x - 5$$

The result has two terms, so it is a binomial, even though each polynomial in the expression has three.

> **Watch out.** Do not count the terms of the question: here $2x^{2} - 2x^{2} = 0$ removes a term altogether. Simplify, then count.`,
        `要先化简，再按项数命名，因为同类项会合并，甚至完全抵消：

$$(2x^{2} + 3x - 1) - (2x^{2} - x + 4) = 2x^{2} - 2x^{2} + 3x + x - 1 - 4 = 4x - 5$$

结果有两项，所以是二项式，尽管式子中的两个多项式各有三项。

> **注意。** 不要数题目中式子的项数：这里 $2x^{2} - 2x^{2} = 0$ 让一项完全消失了。先化简，再数项。`,
      ),
      generate(rng) {
        let n: number;
        let r: Term[];
        let q: Term[];
        let p: Term[];
        let plus: boolean;
        do {
          n = rng.int(1, 3);
          r = collect(rng.sample([0, 1, 2, 3], n).map((e) => term(rng.nonZero(-9, 9), e)));
          q = collect(rng.sample([0, 1, 2, 3], rng.int(2, 3)).map((e) => term(rng.nonZero(-9, 9), e)));
          plus = rng.bool();
          p = collect([...r, ...scale(q, plus ? -1 : 1)]);
        } while (p.length < 2 || p.length + q.length < n + 3);
        const expr = `${wrap(p)} ${plus ? "+" : "-"} ${wrap(q)}`;
        const name = termName(n);
        return choiceProblem({
          prompt: t(
            `Simplify $${expr}$. Is the result a monomial, a binomial or a trinomial?`,
            `化简 $${expr}$。结果是单项式、二项式还是三项式？`,
          ),
          options: termNames,
          correct: n - 1,
          solution: paragraphs(
            t(
              `**Step 1: Simplify.** ${plus ? "Remove the parentheses" : "Change the sign of every term of the second polynomial"}, then combine like terms:${steps(`${expr} = ${write([...p, ...scale(q, plus ? 1 : -1)])}`, `= ${groups([...p, ...scale(q, plus ? 1 : -1)])}`, `= ${write(r)}`)}`,
              `**第一步：化简。** ${plus ? "去掉括号" : "把第二个多项式的每一项都变号"}，再合并同类项：${steps(`${expr} = ${write([...p, ...scale(q, plus ? 1 : -1)])}`, `= ${groups([...p, ...scale(q, plus ? 1 : -1)])}`, `= ${write(r)}`)}`,
            ),
            t(
              `**Step 2: Count the terms.** The result has ${n === 1 ? "one term" : `${["", "", "two", "three"][n]} terms`}, so it is ${name.en}.`,
              `**第二步：数项数。** 结果有 ${n} 项，所以它是${name["zh-CN"]}。`,
            ),
            check(
              [
                { sign: 1, factors: [p] },
                { sign: plus ? 1 : -1, factors: [q] },
              ],
              r,
            ),
          ),
        });
      },
    },
  ],
};

/** termTimes writes step i of multiplying every term of q by the term f. */
function termTimes(i: number, f: Term, q: readonly Term[]): Text {
  const label = stepLabel(i, `Multiply by $${mono(f)}$`, `乘以 $${mono(f)}$`);
  const line = `${front(f)}${wrap(q)} = ${write(products([f], q))}`;
  if (f.c === 1 && degreeOf(f) === 0) {
    return t(
      `${label.en} Multiplying by $1$ leaves every term of $${write(q)}$ as it is.`,
      `${label["zh-CN"]}乘以 $1$，$${write(q)}$ 的每一项都不变。`,
    );
  }
  if (f.c === -1 && degreeOf(f) === 0) {
    return t(
      `${label.en} Multiplying by $-1$ changes the sign of every term of $${write(q)}$:${steps(line)}`,
      `${label["zh-CN"]}乘以 $-1$，$${write(q)}$ 的每一项都变号：${steps(line)}`,
    );
  }
  return t(
    `${label.en} Multiply $${mono(f)}$ by each term of $${write(q)}$:${steps(line)}`,
    `${label["zh-CN"]}用 $${mono(f)}$ 乘 $${write(q)}$ 的每一项：${steps(line)}`,
  );
}

/** binomialSolution writes the solution of expanding a product of two polynomials: every product, then like terms combined, then the check. */
function binomialSolution(expr: string, first: readonly Term[], second: readonly Term[]): Text {
  const par = (m: Term) => (m.c < 0 ? `(${mono(m)})` : mono(m));
  const each = first.flatMap((a) => second.map((b) => `${par(a)} \\cdot ${par(b)}`)).join(" + ");
  const all = products(first, second);
  return paragraphs(
    t(
      `**Step 1: Multiply every term by every term.** Each term of $${write(first)}$ multiplies each term of $${write(second)}$; in each product multiply the coefficients and add the exponents:${steps(`${expr} = ${each}`, `= ${write(all)}`)}`,
      `**第一步：逐项相乘。** $${write(first)}$ 的每一项都乘 $${write(second)}$ 的每一项；每个乘积中系数相乘，指数相加：${steps(`${expr} = ${each}`, `= ${write(all)}`)}`,
    ),
    t(
      `**Step 2: Combine like terms.** Group the products with the same powers:${steps(`= ${groups(all)}`, `= ${write(collect(all))}`)}`,
      `**第二步：合并同类项。** 把幂相同的乘积归在一起：${steps(`= ${groups(all)}`, `= ${write(collect(all))}`)}`,
    ),
    check([plus(first, second)], collect(all)),
  );
}

export const multiplyingBinomials: TopicDef = {
  id: "multiplying-binomials",
  title: t("Multiplying Binomials", "二项式乘二项式"),
  summary: t("Multiply two binomials by multiplying every term by every term.", "用逐项相乘的方法计算两个二项式的积。"),
  prerequisites: ["distributive-law-for-polynomials"],
  encompasses: [{ topic: "distributive-law-for-polynomials", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSA.APR.A.1"],
  intro: t(
    `Multiplying a polynomial by a monomial uses the distributive law once; multiplying two binomials uses it twice. In $(x + 3)(x + 5)$, first treat $x + 5$ as a single number and distribute it over $x + 3$, then distribute again:

$$(x + 3)(x + 5) = x(x + 5) + 3(x + 5) = x^{2} + 5x + 3x + 15$$

A rectangle $x + 3$ tall and $x + 5$ wide shows the same four pieces:

{{figure 0}}

Adding them, and combining the like terms $5x$ and $3x$, gives $x^{2} + 8x + 15$. Every term of one binomial meets every term of the other exactly once: two times two makes four products.

In this lesson we multiply two binomials, with and without leading coefficients, and in two variables.`,
    `单项式乘多项式用一次分配律；两个二项式相乘要用两次。在 $(x + 3)(x + 5)$ 中，先把 $x + 5$ 看成一个数，分配到 $x + 3$ 上，再分配一次：

$$(x + 3)(x + 5) = x(x + 5) + 3(x + 5) = x^{2} + 5x + 3x + 15$$

高 $x + 3$、宽 $x + 5$ 的长方形显示的正是这四块：

{{figure 0}}

把它们相加，合并同类项 $5x$ 和 $3x$，得 $x^{2} + 8x + 15$。一个二项式的每一项都与另一个的每一项恰好相乘一次：二乘二，共四个乘积。

这节课我们计算两个二项式的积，包括首项系数不为 1 的情形和含两个变量的情形。`,
  ),
  introFigures: [
    areaGrid(
      ["x", "5"],
      ["x", "3"],
      [
        ["x²", "5x"],
        ["3x", "15"],
      ],
      t(
        "A rectangle x + 3 tall and x + 5 wide, split into four pieces: x², 5x, 3x and 15.",
        "高 x + 3、宽 x + 5 的长方形，分成四块：x²、5x、3x 和 15。",
      ),
      { w: [2, 1.4], h: [2, 1.2] },
    ),
  ],
  knowledgePoints: [
    {
      id: "monic-binomials",
      title: t("Products such as $(x + a)(x + b)$", "形如 $(x + a)(x + b)$ 的积"),
      explanation: t(
        `To multiply two binomials, multiply **each term of the first by each term of the second** and add the four products. The distributive law, used twice, says exactly this: $(a + b)(c + d) = a(c + d) + b(c + d) = ac + ad + bc + bd$. Then combine like terms. One way to remember the four products is **FOIL**: First, Outer, Inner, Last.

$$(x + 3)(x - 5) = x^{2} - 5x + 3x - 15 = x^{2} - 2x - 15$$

The two middle products, $-5x$ and $3x$, are like terms, so the answer has three terms.

> **Watch out.** Do not multiply only first by first and last by last: $(x + 3)(x - 5)$ is not $x^{2} - 15$. Keep the roles and the signs: the constant is the product $3 \\cdot (-5) = -15$ and the coefficient of $x$ is the sum $3 + (-5) = -2$, not the other way round.`,
        `两个二项式相乘时，用第一个二项式的**每一项**乘以第二个二项式的**每一项**，把四个乘积相加。用两次分配律正好得到这一点：$(a + b)(c + d) = a(c + d) + b(c + d) = ac + ad + bc + bd$。然后合并同类项。

$$(x + 3)(x - 5) = x^{2} - 5x + 3x - 15 = x^{2} - 2x - 15$$

中间的两个乘积 $-5x$ 和 $3x$ 是同类项，所以结果有三项。

> **注意。** 不要只算首项乘首项、末项乘末项：$(x + 3)(x - 5)$ 不是 $x^{2} - 15$。各数的作用和符号也要分清：常数项是积 $3 \\cdot (-5) = -15$，$x$ 的系数是和 $3 + (-5) = -2$，不能弄反。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.nonZero(-9, 9);
        const p = [term(1, 1), term(a)];
        const q = [term(1, 1), term(b)];
        const expr = `${wrap(p)}${wrap(q)}`;
        const answer = write(times(p, q));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          mistakes: [
            say(
              write([term(1, 2), term(a * b)]),
              "The middle terms are missing. You multiplied only first by first and last by last; each term must multiply both terms of the other binomial.",
              "缺了中间项。你只算了首项乘首项、末项乘末项；每一项都要乘另一个二项式的两项。",
            ),
          ],
          wrong: [write(collect([term(1, 2), term(a + b, 1), term(-a * b)])), write(collect([term(1, 2), term(a * b, 1), term(a + b)]))],
          solution: binomialSolution(expr, p, q),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("Binomials with leading coefficients", "首项系数不为 1 的二项式"),
      explanation: t(
        `The method is the same when the terms have coefficients. Each of the four products is a product of monomials, so multiply the coefficients and add the exponents:

$$(2x - 3)(4x + 1) = 8x^{2} + 2x - 12x - 3 = 8x^{2} - 10x - 3$$

Here the outer product is $2x \\cdot 1 = 2x$ and the inner one is $(-3) \\cdot 4x = -12x$: each middle product uses a different pair of terms.

> **Watch out.** Both middle products are needed: $(2x - 3)(4x + 1)$ is not $8x^{2} + 2x - 3$, which leaves out the inner product. And the last product keeps its sign: $(-3) \\cdot 1 = -3$, so the answer is not $8x^{2} - 10x + 3$.`,
        `各项带有系数时方法相同。四个乘积都是单项式的积，所以系数相乘、指数相加：

$$(2x - 3)(4x + 1) = 8x^{2} + 2x - 12x - 3 = 8x^{2} - 10x - 3$$

这里外侧两项之积是 $2x \\cdot 1 = 2x$，内侧两项之积是 $(-3) \\cdot 4x = -12x$：两个中间乘积用的是不同的两对项。

> **注意。** 中间的两个乘积都不能少：$(2x - 3)(4x + 1)$ 不是 $8x^{2} + 2x - 3$，那样漏掉了内侧的乘积。最后一个乘积也要保留符号：$(-3) \\cdot 1 = -3$，所以结果不是 $8x^{2} - 10x + 3$。`,
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5, -2, -3]);
        const c = rng.pick([1, 2, 3, 4, 5, -1, -2]);
        const b = rng.nonZero(-9, 9);
        const d = rng.nonZero(-9, 9);
        const p = [term(a, 1), term(b)];
        const q = [term(c, 1), term(d)];
        const pShown = rng.bool(0.25) && b > 0 ? [p[1]!, p[0]!] : p;
        const [first, second] = rng.bool() ? [pShown, q] : [q, pShown];
        const expr = `${wrap(first)}${wrap(second)}`;
        const answer = write(times(p, q));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          mistakes: [
            say(
              write([term(a * c, 2), term(b * d)]),
              "The middle terms are missing. You multiplied only first by first and last by last; each term must multiply both terms of the other binomial.",
              "缺了中间项。你只算了首项乘首项、末项乘末项；每一项都要乘另一个二项式的两项。",
            ),
          ],
          wrong: [
            write(collect([term(a * c, 2), term(a * d, 1), term(b * d)])),
            write(collect([term(a * c, 2), term(a * d + b * c, 1), term(-b * d)])),
          ],
          solution: binomialSolution(expr, first, second),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Binomials in two variables", "含两个变量的二项式"),
      explanation: t(
        `With two variables the method is the same. The first product contains $x^{2}$ and the last contains $y^{2}$, while the outer and inner products both contain $xy$, so they are like terms:

$$(x + 2y)(3x - y) = 3x^{2} - xy + 6xy - 2y^{2} = 3x^{2} + 5xy - 2y^{2}$$

A grid with one row for each term of the first binomial and one column for each term of the second holds the four products:

{{figure 0}}

> **Watch out.** $x \\cdot y$ and $y \\cdot x$ are the same term $xy$, so $-xy$ and $6xy$ combine into $5xy$. Do not drop the $xy$ terms: the answer is not $3x^{2} - 2y^{2}$.`,
        `含两个变量时方法相同。第一个乘积含 $x^{2}$，最后一个含 $y^{2}$，外侧和内侧的两个乘积都含 $xy$，是同类项：

$$(x + 2y)(3x - y) = 3x^{2} - xy + 6xy - 2y^{2} = 3x^{2} + 5xy - 2y^{2}$$

用一个表格，每行对应第一个二项式的一项，每列对应第二个二项式的一项，就能装下四个乘积：

{{figure 0}}

> **注意。** $x \\cdot y$ 和 $y \\cdot x$ 是同一项 $xy$，所以 $-xy$ 和 $6xy$ 合并成 $5xy$。不要丢掉含 $xy$ 的项：结果不是 $3x^{2} - 2y^{2}$。`,
      ),
      figures: [
        areaGrid(
          ["3x", "−y"],
          ["x", "2y"],
          [
            ["3x²", "−xy"],
            ["6xy", "−2y²"],
          ],
          t(
            "A grid for (x + 2y)(3x − y): rows x and 2y, columns 3x and −y, holding the products 3x², −xy, 6xy and −2y².",
            "(x + 2y)(3x − y) 的表格：行是 x 和 2y，列是 3x 和 −y，格中是乘积 3x²、−xy、6xy 和 −2y²。",
          ),
        ),
      ],
      generate(rng) {
        let a: number;
        let b: number;
        let c: number;
        let d: number;
        do {
          a = rng.nonZero(-5, 5);
          b = rng.nonZero(-6, 6);
          c = rng.nonZero(-5, 5);
          d = rng.nonZero(-6, 6);
        } while (a * d + b * c === 0);
        const p = [term(a, 1), term(b, 0, 1)];
        const q = [term(c, 1), term(d, 0, 1)];
        const expr = `${wrap(p)}${wrap(q)}`;
        const answer = write(times(p, q));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([term(a * c, 2), term(b * d, 0, 2)]),
            write(collect([term(a * c, 2), term(a * d, 1, 1), term(b * d, 0, 2)])),
            write(collect([term(a * c, 2), term(a * d + b * c, 1, 1), term(-b * d, 0, 2)])),
          ],
          solution: binomialSolution(expr, p, q),
        });
      },
    },
  ],
};

export const multiplyingPolynomials: TopicDef = {
  id: "multiplying-polynomials",
  title: t("Multiplying Polynomials", "多项式乘多项式"),
  summary: t("Multiply a binomial by a trinomial, and multiply three binomials.", "计算二项式乘三项式，以及三个二项式的积。"),
  prerequisites: ["multiplying-binomials"],
  encompasses: [
    { topic: "multiplying-binomials", weight: 0.7 },
    { topic: "product-and-quotient-rules", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.APR.A.1"],
  intro: t(
    `To multiply two binomials we multiplied every term of one by every term of the other. Nothing in that reasoning needs the factors to have two terms: by the distributive law, $(a + b)(c + d + e) = a(c + d + e) + b(c + d + e)$, which makes $2 \\times 3 = 6$ products. A grid keeps them in order, one row for each term of the binomial:

{{figure 0}}

so $(x + 2)(x^{2} - 3x + 4) = x^{3} - 3x^{2} + 4x + 2x^{2} - 6x + 8 = x^{3} - x^{2} - 2x + 8$. In the grid, like terms sit next to each other on the diagonals: $-3x^{2}$ beside $2x^{2}$, and $4x$ beside $-6x$.

In this lesson we multiply a binomial by a trinomial, with and without leading coefficients, and multiply three binomials.`,
    `两个二项式相乘时，我们用一个的每一项乘另一个的每一项。这个道理并不要求因式只有两项：由分配律，$(a + b)(c + d + e) = a(c + d + e) + b(c + d + e)$，共 $2 \\times 3 = 6$ 个乘积。用表格可以把它们排得整整齐齐，二项式的每一项占一行：

{{figure 0}}

所以 $(x + 2)(x^{2} - 3x + 4) = x^{3} - 3x^{2} + 4x + 2x^{2} - 6x + 8 = x^{3} - x^{2} - 2x + 8$。表格中同类项沿对角线相邻：$-3x^{2}$ 与 $2x^{2}$，$4x$ 与 $-6x$。

这节课我们计算二项式乘三项式（包括首项系数不为 1 的情形），以及三个二项式的积。`,
  ),
  introFigures: [
    areaGrid(
      ["x²", "−3x", "4"],
      ["x", "2"],
      [
        ["x³", "−3x²", "4x"],
        ["2x²", "−6x", "8"],
      ],
      t(
        "A grid for (x + 2)(x² − 3x + 4): rows x and 2, columns x², −3x and 4, holding x³, −3x², 4x in the first row and 2x², −6x, 8 in the second.",
        "(x + 2)(x² − 3x + 4) 的表格：行是 x 和 2，列是 x²、−3x 和 4；第一行是 x³、−3x²、4x，第二行是 2x²、−6x、8。",
      ),
    ),
  ],
  knowledgePoints: [
    {
      id: "binomial-times-trinomial",
      title: t("A binomial times a trinomial", "二项式乘三项式"),
      explanation: t(
        `To multiply any two polynomials, multiply every term of the first by every term of the second, then combine like terms. A binomial times a trinomial gives $2 \\times 3 = 6$ products. Work through them in order: the first term of the binomial times each term of the trinomial, then the second term:

$$(x + 2)(x^{2} - 3x + 4) = x^{3} - 3x^{2} + 4x + 2x^{2} - 6x + 8 = x^{3} - x^{2} - 2x + 8$$

> **Watch out.** Count the products before combining: there must be six. Giving the $2$ only to $x^{2}$, or multiplying only first by first and last by last, leaves terms out. And keep the sign of each term: $(x + 2)$ is not $(x - 2)$.`,
        `任意两个多项式相乘，都是用第一个的每一项乘以第二个的每一项，再合并同类项。二项式乘三项式共有 $2 \\times 3 = 6$ 个乘积。按顺序计算：先用二项式的第一项乘三项式的每一项，再用第二项去乘：

$$(x + 2)(x^{2} - 3x + 4) = x^{3} - 3x^{2} + 4x + 2x^{2} - 6x + 8 = x^{3} - x^{2} - 2x + 8$$

> **注意。** 合并之前先数一数乘积：必须有六个。只让 $2$ 乘 $x^{2}$，或者只算首乘首、末乘末，都会漏项。每一项的符号也要保留：$(x + 2)$ 不是 $(x - 2)$。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const p = [term(1, 1), term(a)];
        const q = [term(rng.pick([1, 1, 2, 3, -1]), 2), term(rng.nonZero(-9, 9), 1), term(rng.nonZero(-9, 9))];
        const expr = `${wrap(p)}${wrap(q)}`;
        const answer = write(times(p, q));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write(collect([...times([p[0]!], q), mul(p[1]!, q[0]!)])),
            write([mul(p[0]!, q[0]!), mul(p[1]!, q[2]!)]),
            write(times([term(1, 1), term(-a)], q)),
          ],
          solution: paragraphs(
            termTimes(1, p[0]!, q),
            termTimes(2, p[1]!, q),
            t(
              `**Step 3: Add and combine like terms.** All six products together, then grouped by power:${steps(`${expr} = ${write(products(p, q))}`, `= ${groups(products(p, q))}`, `= ${answer}`)}`,
              `**第三步：相加并合并同类项。** 把六个乘积加在一起，再按幂分组：${steps(`${expr} = ${write(products(p, q))}`, `= ${groups(products(p, q))}`, `= ${answer}`)}`,
            ),
            check([plus(p, q)], times(p, q)),
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("Polynomials with leading coefficients", "首项系数不为 1 的多项式"),
      explanation: t(
        `Coefficients change nothing in the method: each product multiplies the coefficients and adds the exponents. Take the terms of the binomial one at a time, so that no product is missed:

$$(2x - 1)(3x^{2} + x - 4) = 6x^{3} + 2x^{2} - 8x - 3x^{2} - x + 4 = 6x^{3} - x^{2} - 9x + 4$$

The second group of products comes from the term $-1$, which changes the sign of every term of the trinomial: $-3x^{2}$, $-x$ and $4$.

> **Watch out.** The second term of the binomial multiplies all three terms of the trinomial, with its sign: in $(2x - 1)(3x^{2} + x - 4)$ the $-1$ gives $-3x^{2} - x + 4$, not just $-3x^{2}$, and not $3x^{2} + x - 4$.`,
        `系数不改变方法：每个乘积都是系数相乘、指数相加。逐个用二项式的项去乘，就不会遗漏：

$$(2x - 1)(3x^{2} + x - 4) = 6x^{3} + 2x^{2} - 8x - 3x^{2} - x + 4 = 6x^{3} - x^{2} - 9x + 4$$

第二组乘积来自 $-1$ 这一项，它使三项式的每一项都变号：$-3x^{2}$、$-x$ 和 $4$。

> **注意。** 二项式的第二项要带着符号乘三项式的全部三项：在 $(2x - 1)(3x^{2} + x - 4)$ 中，$-1$ 给出 $-3x^{2} - x + 4$，不只是 $-3x^{2}$，也不是 $3x^{2} + x - 4$。`,
      ),
      generate(rng) {
        const p = [term(rng.pick([2, 3, 4, -2, -3]), 1), term(rng.nonZero(-6, 6))];
        const q = [term(rng.nonZero(-4, 4), 2), term(rng.nonZero(-7, 7), 1), term(rng.nonZero(-7, 7))];
        const [first, second] = rng.bool(0.7) ? [p, q] : [q, p];
        const expr = `${wrap(first)}${wrap(second)}`;
        const answer = write(times(p, q));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write(collect([...times([p[0]!], q), mul(p[1]!, q[0]!)])),
            write(collect([...times([p[0]!], q), ...scale(q.slice(1), p[1]!.c)])),
            write(times([p[0]!, neg(p[1]!)], q)),
          ],
          solution: paragraphs(
            termTimes(1, p[0]!, q),
            termTimes(2, p[1]!, q),
            t(
              `**Step 3: Add and combine like terms.** All six products together, then grouped by power:${steps(`${expr} = ${write(products(p, q))}`, `= ${groups(products(p, q))}`, `= ${answer}`)}`,
              `**第三步：相加并合并同类项。** 把六个乘积加在一起，再按幂分组：${steps(`${expr} = ${write(products(p, q))}`, `= ${groups(products(p, q))}`, `= ${answer}`)}`,
            ),
            check([plus(p, q)], times(p, q)),
          ),
        });
      },
    },
    {
      id: "three-binomials",
      title: t("A product of three binomials", "三个二项式的积"),
      explanation: t(
        `A product can be grouped in any way, so to multiply three binomials, multiply two of them first, then multiply the result, a trinomial, by the third:

$$(x + 1)(x - 2)(x + 3) = (x^{2} - x - 2)(x + 3) = x^{3} + 3x^{2} - x^{2} - 3x - 2x - 6 = x^{3} + 2x^{2} - 5x - 6$$

> **Watch out.** Expand in two full stages rather than guessing the pattern: the answer is not $x^{3} - 6$, and its constant term is the product of the three constants $1$, $-2$ and $3$, sign included, so $-6$ and not $6$.`,
        `乘法可以任意结合，所以三个二项式相乘时，先把其中两个相乘，再用得到的三项式乘以第三个：

$$(x + 1)(x - 2)(x + 3) = (x^{2} - x - 2)(x + 3) = x^{3} + 3x^{2} - x^{2} - 3x - 2x - 6 = x^{3} + 2x^{2} - 5x - 6$$

> **注意。** 要分两步完整展开，不要猜规律：结果不是 $x^{3} - 6$；常数项是三个常数 $1$、$-2$、$3$ 连同符号的积，即 $-6$，不是 $6$。`,
      ),
      generate(rng) {
        const [a, b, c] = [rng.nonZero(-5, 5), rng.nonZero(-5, 5), rng.nonZero(-5, 5)];
        const f = (k: number) => [term(1, 1), term(k)];
        const expr = `${wrap(f(a))}${wrap(f(b))}${wrap(f(c))}`;
        const ab = times(f(a), f(b));
        const answer = write(times(ab, f(c)));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([term(1, 3), term(a * b * c)]),
            write(collect([term(1, 3), term(a + b + c, 2), term(a * b * c)])),
            write(collect([term(1, 3), term(a + b + c, 2), term(a * b + b * c + c * a, 1), term(-a * b * c)])),
          ],
          solution: paragraphs(
            t(
              `**Step 1: Multiply the first two.** Multiply every term by every term and combine like terms:${steps(`${wrap(f(a))}${wrap(f(b))} = ${write(products(f(a), f(b)))}`, `= ${write(ab)}`)}`,
              `**第一步：先乘前两个。** 逐项相乘，再合并同类项：${steps(`${wrap(f(a))}${wrap(f(b))} = ${write(products(f(a), f(b)))}`, `= ${write(ab)}`)}`,
            ),
            t(
              `**Step 2: Multiply by the third.** Multiply every term of $${write(ab)}$ by every term of $${write(f(c))}$, then combine like terms:${steps(`${wrap(ab)}${wrap(f(c))} = ${write(products(ab, f(c)))}`, `= ${groups(products(ab, f(c)))}`, `= ${answer}`)}`,
              `**第二步：再乘第三个。** 用 $${write(ab)}$ 的每一项乘 $${write(f(c))}$ 的每一项，再合并同类项：${steps(`${wrap(ab)}${wrap(f(c))} = ${write(products(ab, f(c)))}`, `= ${groups(products(ab, f(c)))}`, `= ${answer}`)}`,
            ),
            check([plus(f(a), f(b), f(c))], times(ab, f(c))),
          ),
        });
      },
    },
  ],
};

/** squareSteps writes (a + b)² = (a)² + 2(a)(b) + (b)². */
function squareSteps(a: Term, b: Term): string {
  const sq = (m: Term) => (m.c === 1 && degreeOf(m) === 1 ? `${vars(m)}^{2}` : `(${mono(m)})^{2}`);
  return `${sq(a)} + 2(${mono(a)})(${mono(b)}) + ${sq(b)}`;
}

export const squaringBinomials: TopicDef = {
  id: "squaring-binomials",
  title: t("Squaring Binomials", "二项式的平方"),
  summary: t(
    "Expand $(a + b)^{2}$ and $(a - b)^{2}$ with the perfect square formulas.",
    "用完全平方公式展开 $(a + b)^{2}$ 和 $(a - b)^{2}$。",
  ),
  prerequisites: ["multiplying-binomials", "power-rules"],
  encompasses: [
    { topic: "multiplying-binomials", weight: 0.6 },
    { topic: "power-rules", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.APR.A.1", "CCSS.HSA.SSE.A.2"],
  intro: t(
    `$(a + b)^{2}$ is $(a + b)(a + b)$, a product of two binomials, so we can already expand it. The pattern is worth knowing by heart, though, and a picture shows it. A square of side $a + b$ splits into a square $a$ by $a$, a square $b$ by $b$, and two rectangles $a$ by $b$:

{{figure 0}}

so $(a + b)^{2} = a^{2} + 2ab + b^{2}$. For example, $(x + 5)^{2} = x^{2} + 10x + 25$: the two rectangles of area $5x$ make the middle term $10x$. Squaring the parts alone, $x^{2} + 25$, would leave the two rectangles out.

In this lesson we square sums and differences, terms with coefficients, and binomials in two variables.`,
    `$(a + b)^{2}$ 就是 $(a + b)(a + b)$，是两个二项式的积，我们已经会展开。不过这个规律值得记牢，而且一幅图就能看出来。边长为 $a + b$ 的正方形可以分成边长为 $a$ 的正方形、边长为 $b$ 的正方形，以及两个 $a$ 乘 $b$ 的长方形：

{{figure 0}}

所以 $(a + b)^{2} = a^{2} + 2ab + b^{2}$。例如 $(x + 5)^{2} = x^{2} + 10x + 25$：两个面积为 $5x$ 的长方形组成中间项 $10x$。只把两部分各自平方得 $x^{2} + 25$，就漏掉了这两个长方形。

这节课我们计算和与差的平方、带系数的项的平方，以及含两个变量的二项式的平方。`,
  ),
  introFigures: [
    areaGrid(
      ["a", "b"],
      ["a", "b"],
      [
        ["a²", "ab"],
        ["ab", "b²"],
      ],
      t(
        "A square of side a + b split into a square a², a square b² and two rectangles of area ab.",
        "边长为 a + b 的正方形，分成正方形 a²、正方形 b² 和两个面积为 ab 的长方形。",
      ),
      { w: [2, 1.2], h: [2, 1.2], width: 150, height: 150 },
    ),
  ],
  knowledgePoints: [
    {
      id: "square-of-a-sum-or-difference",
      title: t("The square of a sum or a difference", "和与差的平方"),
      explanation: t(
        `$(a + b)^{2}$ means $(a + b)(a + b)$. Multiplying every term by every term gives $a^{2} + ab + ba + b^{2}$, and the two middle products are equal, so they add up to $2ab$. The same reasoning with $-b$ in place of $b$ gives the square of a difference:

$$(a + b)^{2} = a^{2} + 2ab + b^{2} \\qquad (a - b)^{2} = a^{2} - 2ab + b^{2}$$

So $(x - 6)^{2} = x^{2} - 2 \\cdot 6x + 6^{2} = x^{2} - 12x + 36$. The last term is positive either way, since it is a square.

> **Watch out.** $(x + 5)^{2}$ is not $x^{2} + 25$: squaring does not pass separately onto the two terms, and the middle term $2 \\cdot 5x = 10x$ is the one most often forgotten. Double it, too: $x^{2} + 5x + 25$ has only one of the two rectangles. And in $(x - 5)^{2}$ the last term is $+25$, not $-25$.`,
        `$(a + b)^{2}$ 表示 $(a + b)(a + b)$。逐项相乘得 $a^{2} + ab + ba + b^{2}$，中间两个乘积相等，合起来是 $2ab$。把 $b$ 换成 $-b$，同样的推理给出差的平方：

$$(a + b)^{2} = a^{2} + 2ab + b^{2} \\qquad (a - b)^{2} = a^{2} - 2ab + b^{2}$$

所以 $(x - 6)^{2} = x^{2} - 2 \\cdot 6x + 6^{2} = x^{2} - 12x + 36$。无论哪种情形，最后一项都是正的，因为它是一个平方。

> **注意。** $(x + 5)^{2}$ 不是 $x^{2} + 25$：平方不能分别作用到两项上，中间项 $2 \\cdot 5x = 10x$ 最容易被遗漏。还要乘 $2$：$x^{2} + 5x + 25$ 只算了两个长方形中的一个。在 $(x - 5)^{2}$ 中，最后一项是 $+25$，不是 $-25$。`,
      ),
      generate(rng) {
        const a = rng.nonZero(-15, 15);
        const v = rng.bool() ? term(1, 1) : term(1, 0, 1);
        const b = term(a);
        const expr = `${wrap([v, b])}^{2}`;
        const answer = write(binomialPower(v, b, 2));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([mul(v, v), term(a * a)]),
            write([mul(v, v), mul(v, b), term(a * a)]),
            write([mul(v, v), mul(v, term(2 * a)), term(-a * a)]),
            write([mul(v, v), term(-a * a)]),
          ],
          solution: paragraphs(
            t(
              `**Step 1: Use the square of a binomial.** By $(p + q)^{2} = p^{2} + 2pq + q^{2}$ with $p = ${mono(v)}$ and $q = ${mono(b)}$, signs included:${steps(`${expr} = ${squareSteps(v, b)}`)}`,
              `**第一步：运用完全平方公式。** 由 $(p + q)^{2} = p^{2} + 2pq + q^{2}$，取 $p = ${mono(v)}$，$q = ${mono(b)}$（连同符号）：${steps(`${expr} = ${squareSteps(v, b)}`)}`,
            ),
            t(
              `**Step 2: Work out each part.** Square each whole term, coefficient included, and double the product of the two: $${mono(mul(v, v))}$, $${mono(mul(term(2), mul(v, b)))}$ and $${mono(mul(b, b))}$:${steps(`= ${answer}`)}`,
              `**第二步：算出每一部分。** 每一项整体（包括系数）平方，两项之积乘 $2$：$${mono(mul(v, v))}$、$${mono(mul(term(2), mul(v, b)))}$ 和 $${mono(mul(b, b))}$：${steps(`= ${answer}`)}`,
            ),
            check([plus([v, b], [v, b])], binomialPower(v, b, 2)),
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("Squaring with coefficients", "带系数的二项式平方"),
      explanation: t(
        `When a term has a coefficient, the formula still applies with the whole term in the place of $a$: square the whole term, coefficient included, and double the product of the two terms.

$$(3x - 4)^{2} = (3x)^{2} + 2(3x)(-4) + (-4)^{2} = 9x^{2} - 24x + 16$$

> **Watch out.** Square the coefficient as well as the variable: $(3x)^{2} = 9x^{2}$, not $3x^{2}$. And the middle term is twice the product, $2(3x)(-4) = -24x$, not $-12x$; leaving it out gives $9x^{2} + 16$, which is wrong.`,
        `项带有系数时，公式照样适用，只是把整项放在 $a$ 的位置：整项（包括系数）都要平方，中间项是两项之积的两倍。

$$(3x - 4)^{2} = (3x)^{2} + 2(3x)(-4) + (-4)^{2} = 9x^{2} - 24x + 16$$

> **注意。** 系数也要平方：$(3x)^{2} = 9x^{2}$，不是 $3x^{2}$。中间项是两项之积的两倍：$2(3x)(-4) = -24x$，不是 $-12x$；漏掉它得 $9x^{2} + 16$，是错的。`,
      ),
      keyPrerequisites: ["power-rules"],
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5, 6, -2, -3]);
        const c = rng.nonZero(-9, 9);
        const p = term(a, 1);
        const q = term(c);
        const shown = c > 0 && rng.bool(0.3) ? [q, p] : [p, q];
        const expr = `${wrap(shown)}^{2}`;
        const answer = write(binomialPower(p, q, 2));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([term(a, 2), term(2 * a * c, 1), term(c * c)]),
            write([term(a * a, 2), term(c * c)]),
            write([term(a * a, 2), term(a * c, 1), term(c * c)]),
          ],
          solution: paragraphs(
            t(
              `**Step 1: Use the square of a binomial.** By $(p + q)^{2} = p^{2} + 2pq + q^{2}$ with $p = ${mono(shown[0]!)}$ and $q = ${mono(shown[1]!)}$, signs included:${steps(`${expr} = ${squareSteps(shown[0]!, shown[1]!)}`)}`,
              `**第一步：运用完全平方公式。** 由 $(p + q)^{2} = p^{2} + 2pq + q^{2}$，取 $p = ${mono(shown[0]!)}$，$q = ${mono(shown[1]!)}$（连同符号）：${steps(`${expr} = ${squareSteps(shown[0]!, shown[1]!)}`)}`,
            ),
            t(
              `**Step 2: Work out each part.** Square each whole term, coefficient included, and double the product of the two: $${mono(mul(shown[0]!, shown[0]!))}$, $${mono(mul(term(2), mul(shown[0]!, shown[1]!)))}$ and $${mono(mul(shown[1]!, shown[1]!))}$:${steps(`= ${answer}`)}`,
              `**第二步：算出每一部分。** 每一项整体（包括系数）平方，两项之积乘 $2$：$${mono(mul(shown[0]!, shown[0]!))}$、$${mono(mul(term(2), mul(shown[0]!, shown[1]!)))}$ 和 $${mono(mul(shown[1]!, shown[1]!))}$：${steps(`= ${answer}`)}`,
            ),
            check([plus(shown, shown)], binomialPower(p, q, 2)),
          ),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Squaring a binomial in two variables", "含两个变量的二项式平方"),
      explanation: t(
        `The square of a binomial is the square of the first term, plus or minus twice the product of the terms, plus the square of the last term. The formulas hold for any two terms, so with $a = 2x$ and $b = 5y$:

$$(2x - 5y)^{2} = (2x)^{2} - 2(2x)(5y) + (5y)^{2} = 4x^{2} - 20xy + 25y^{2}$$

> **Watch out.** Every part of each term is squared: $(5y)^{2} = 25y^{2}$, not $5y^{2}$. The middle term contains both variables, $-20xy$, and it is twice the product, not $-10xy$; leaving it out gives $4x^{2} + 25y^{2}$, which is wrong.`,
        `二项式的平方等于首项的平方，加上或减去两项乘积的两倍，再加上末项的平方。公式对任意两项都成立，所以取 $a = 2x$，$b = 5y$：

$$(2x - 5y)^{2} = (2x)^{2} - 2(2x)(5y) + (5y)^{2} = 4x^{2} - 20xy + 25y^{2}$$

> **注意。** 每一项的各部分都要平方：$(5y)^{2} = 25y^{2}$，不是 $5y^{2}$。中间项同时含两个变量，是 $-20xy$，是乘积的两倍而不是 $-10xy$；漏掉它得 $4x^{2} + 25y^{2}$，是错的。`,
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 2, 3, 4, 5]);
        const b = rng.nonZero(-7, 7);
        const p = term(a, 1);
        const q = term(b, 0, 1);
        const expr = `${wrap([p, q])}^{2}`;
        const answer = write(binomialPower(p, q, 2));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([term(a * a, 2), term(b * b, 0, 2)]),
            write([term(a * a, 2), term(a * b, 1, 1), term(b * b, 0, 2)]),
            write([term(a, 2), term(2 * a * b, 1, 1), term(b, 0, 2)]),
          ],
          solution: paragraphs(
            t(
              `**Step 1: Use the square of a binomial.** By $(p + q)^{2} = p^{2} + 2pq + q^{2}$ with $p = ${mono(p)}$ and $q = ${mono(q)}$, signs included:${steps(`${expr} = ${squareSteps(p, q)}`)}`,
              `**第一步：运用完全平方公式。** 由 $(p + q)^{2} = p^{2} + 2pq + q^{2}$，取 $p = ${mono(p)}$，$q = ${mono(q)}$（连同符号）：${steps(`${expr} = ${squareSteps(p, q)}`)}`,
            ),
            t(
              `**Step 2: Work out each part.** Square each whole term, coefficient included, and double the product of the two: $${mono(mul(p, p))}$, $${mono(mul(term(2), mul(p, q)))}$ and $${mono(mul(q, q))}$:${steps(`= ${answer}`)}`,
              `**第二步：算出每一部分。** 每一项整体（包括系数）平方，两项之积乘 $2$：$${mono(mul(p, p))}$、$${mono(mul(term(2), mul(p, q)))}$ 和 $${mono(mul(q, q))}$：${steps(`= ${answer}`)}`,
            ),
            check([plus([p, q], [p, q])], binomialPower(p, q, 2)),
          ),
        });
      },
    },
  ],
};

/** pascalSumFigure draws rows 0 to 5 of Pascal's triangle, with lines from 4 and 6 in row 4 down to their sum 10 in row 5. */
const pascalSumFigure: Figure = (() => {
  const [cx, dx, dy, top] = [160, 34, 30, 20];
  const at = (n: number, k: number) => [cx + (k - n / 2) * dx, top + n * dy] as const;
  const [a, b, c] = [at(4, 1), at(4, 2), at(5, 2)];
  let body = `<line class="accent" x1="${a[0]}" y1="${a[1] + 7}" x2="${c[0]}" y2="${c[1] - 11}" stroke-width="1.5"/>`;
  body += `<line class="accent" x1="${b[0]}" y1="${b[1] + 7}" x2="${c[0]}" y2="${c[1] - 11}" stroke-width="1.5"/>`;
  let row = [1];
  for (let n = 0; n <= 5; n++) {
    row.forEach((v, k) => {
      const [x, y] = at(n, k);
      body += `<text x="${x}" y="${y + 4}" stroke="none" fill="currentColor">${v}</text>`;
    });
    row = [1, ...row.slice(1).map((v, k) => v + row[k]!), 1];
  }
  return {
    svg: svgDocument(top + 5 * dy + 16, body),
    alt: t(
      "Rows 0 to 5 of Pascal's triangle: 1; 1 1; 1 2 1; 1 3 3 1; 1 4 6 4 1; 1 5 10 10 5 1. Lines join 4 and 6 in row 4 to the 10 below them, their sum.",
      "杨辉三角的第 0 到第 5 行：1；1 1；1 2 1；1 3 3 1；1 4 6 4 1；1 5 10 10 5 1。连线把第 4 行的 4 和 6 连到它们下方的和 10。",
    ),
  };
})();
/** pascalRow writes row n of Pascal's triangle: "1, 4, 6, 4, 1". */
const pascalRow = (n: number, sep = ", ") => Array.from({ length: n + 1 }, (_, i) => choose(n, i)).join(sep);

/** powerSolution writes the steps of expanding (a + b)ⁿ with row n of Pascal's triangle, and checks the result. */
function powerSolution(expr: string, shown: readonly Term[], a: Term, b: Term, n: number): Text {
  const answer = binomialPower(a, b, n);
  return paragraphs(
    t(
      `**Step 1: Use row $${pascalRow(n)}$.** In $(a + b)^{${n}}$ the powers of $a$ go down from $${n}$ while the powers of $b$ go up. Put $a = ${mono(a)}$ and $b = ${mono(b)}$, each with its coefficient and sign:${steps(`${expr} = ${binomialSteps(a, b, n)}`)}`,
      `**第一步：用 $${pascalRow(n)}$ 这一行。** 在 $(a + b)^{${n}}$ 中，$a$ 的指数逐项递减，$b$ 的指数逐项递增。取 $a = ${mono(a)}$，$b = ${mono(b)}$，连同系数和符号：${steps(`${expr} = ${binomialSteps(a, b, n)}`)}`,
    ),
    t(
      `**Step 2: Work out each term.** Raise each bracket to its power, coefficient and sign included, and multiply by the number from the row:${steps(`= ${write(answer)}`)}`,
      `**第二步：算出每一项。** 把每个括号连同系数和符号乘方，再乘以这一行中对应的数：${steps(`= ${write(answer)}`)}`,
    ),
    powerCheck(shown, n, answer),
  );
}

/** powerCheck writes the check that (shown)ⁿ and its expansion agree at a small value of x (and y). */
function powerCheck(shown: readonly Term[], n: number, answer: readonly Term[]): Text {
  const two = [...shown, ...answer].some((m) => m.y > 0);
  const candidates: readonly (readonly [number, number])[] = two
    ? [
        [2, -1],
        [-1, 2],
        [2, 1],
        [1, 2],
        [1, 1],
      ]
    : [
        [2, 1],
        [-1, 1],
        [1, 1],
      ];
  const fits = ([v, w]: readonly [number, number]) =>
    evalAt(shown, v, w) !== 0 && answer.every((m) => Math.abs(m.c * v ** m.x * w ** m.y) <= 2000);
  const [v, w] = candidates.find(fits) ?? [1, 1];
  const base = evalAt(shown, v, w);
  const where = point([...shown, ...answer], v, w);
  const left = chain(`(${substituted(shown, v, w, true)})^{${n}}`, `${base < 0 ? `(${base})` : base}^{${n}}`, num(base ** n));
  const right = answerAt(answer, v, w);
  return t(
    `**Check.** Put ${where.en} into both forms. The question gives $${left}$, and the answer gives $${right}$. They agree.`,
    `**检验。** 把 ${where["zh-CN"]} 代入两种形式。原式得 $${left}$，结果得 $${right}$，两者相同。`,
  );
}

export const expandingBinomialsUsingPascalsTriangle: TopicDef = {
  id: "expanding-binomials-using-pascals-triangle",
  title: t("Expanding Binomials Using Pascal's Triangle", "用杨辉三角展开二项式"),
  summary: t(
    "Expand $(a + b)^{n}$ with the coefficients from Pascal's triangle, and find one coefficient of an expansion.",
    "用杨辉三角中的系数展开 $(a + b)^{n}$，并求展开式中某一项的系数。",
  ),
  prerequisites: ["squaring-binomials", "multiplying-polynomials"],
  encompasses: [{ topic: "power-rules", weight: 0.2 }],
  xp: 16,
  standards: ["CCSS.HSA.APR.C.5"],
  intro: t(
    `Squaring a binomial takes one multiplication: $(a + b)^{2} = a^{2} + 2ab + b^{2}$. Higher powers can be expanded the same way, one factor at a time, but $(x + 2)^{5}$ would take four rounds of multiplying and collecting. There is a shortcut. Multiplying $(a + b)^{2}$ by one more $a + b$ gives

$$(a + b)^{3} = a^{3} + 3a^{2}b + 3ab^{2} + b^{3}$$

and the coefficients $1, 2, 1$ have become $1, 3, 3, 1$: each new number is the sum of the two above it. Stacked into a triangle, these rows form **Pascal's triangle**, and row $n$ gives all the coefficients of $(a + b)^{n}$ at once.

In this lesson we build the triangle, use it to expand cubes and higher powers, and find one coefficient without expanding everything.`,
    `二项式的平方只需乘一次：$(a + b)^{2} = a^{2} + 2ab + b^{2}$。更高次幂也可以一次乘一个因式地展开，但 $(x + 2)^{5}$ 要乘四轮、合并四轮。有一条捷径。把 $(a + b)^{2}$ 再乘一个 $a + b$，得

$$(a + b)^{3} = a^{3} + 3a^{2}b + 3ab^{2} + b^{3}$$

系数从 $1, 2, 1$ 变成了 $1, 3, 3, 1$：每个新数都是它上方两个数之和。把这些行叠成三角形，就是**杨辉三角**（帕斯卡三角形），第 $n$ 行一下子给出 $(a + b)^{n}$ 的全部系数。

这节课我们构造这个三角形，用它展开立方和更高次幂，并且不必全部展开就求出某一项的系数。`,
  ),
  knowledgePoints: [
    {
      id: "pascals-triangle",
      title: t("Pascal's triangle", "杨辉三角"),
      explanation: t(
        `Multiply $(a + b)^{2} = a^{2} + 2ab + b^{2}$ by $a + b$. Multiplying by $a$ and by $b$ gives two rows, the second shifted one place along:

$$\\begin{aligned} a(a^{2} + 2ab + b^{2}) &= a^{3} + 2a^{2}b + ab^{2} \\\\ b(a^{2} + 2ab + b^{2}) &= a^{2}b + 2ab^{2} + b^{3} \\end{aligned}$$

Adding them, like terms meet: the coefficients are $1$, $2 + 1$, $1 + 2$ and $1$, that is $1, 3, 3, 1$. Every power works this way, so each row starts and ends with $1$ and every other number is the sum of the two numbers above it. These rows are **Pascal's triangle**; the top row, $1$, is row $0$, since $(a + b)^{0} = 1$:

$$\\begin{array}{c} 1 \\\\ 1 \\quad 1 \\\\ 1 \\quad 2 \\quad 1 \\\\ 1 \\quad 3 \\quad 3 \\quad 1 \\\\ 1 \\quad 4 \\quad 6 \\quad 4 \\quad 1 \\\\ 1 \\quad 5 \\quad 10 \\quad 10 \\quad 5 \\quad 1 \\end{array}$$

For $(a + b)^{n}$ use row $n$, the row that begins $1, n$. The powers of $a$ go down from $n$ to $0$ while the powers of $b$ go up from $0$ to $n$, so the exponents of each term add up to $n$. In $(a + b)^{4}$, row $4$ is $1, 4, 6, 4, 1$, and the third term is $6a^{2}b^{2}$:

$$(a + b)^{4} = a^{4} + 4a^{3}b + 6a^{2}b^{2} + 4ab^{3} + b^{4}$$

> **Watch out.** Count the rows from $0$: the row $1, 4, 6, 4, 1$ is row $4$, and row $3$ is $1, 3, 3, 1$. Count the terms from the highest power of $a$: in $(a + b)^{5}$, the term $a^{3}b^{2}$ is the third term, with coefficient $10$, not the second, with $5$. The coefficient is a number from the row, not the exponent $n$ or $k$.`,
        `把 $(a + b)^{2} = a^{2} + 2ab + b^{2}$ 乘以 $a + b$。分别乘 $a$ 和乘 $b$，得到两行，第二行错开一位：

$$\\begin{aligned} a(a^{2} + 2ab + b^{2}) &= a^{3} + 2a^{2}b + ab^{2} \\\\ b(a^{2} + 2ab + b^{2}) &= a^{2}b + 2ab^{2} + b^{3} \\end{aligned}$$

相加时同类项对齐：系数是 $1$、$2 + 1$、$1 + 2$、$1$，即 $1, 3, 3, 1$。每次乘方都是这样，所以每行首尾都是 $1$，其余每个数都是它上方两个数之和。这些行组成**杨辉三角**；最上面的 $1$ 是第 $0$ 行，因为 $(a + b)^{0} = 1$：

$$\\begin{array}{c} 1 \\\\ 1 \\quad 1 \\\\ 1 \\quad 2 \\quad 1 \\\\ 1 \\quad 3 \\quad 3 \\quad 1 \\\\ 1 \\quad 4 \\quad 6 \\quad 4 \\quad 1 \\\\ 1 \\quad 5 \\quad 10 \\quad 10 \\quad 5 \\quad 1 \\end{array}$$

展开 $(a + b)^{n}$ 用第 $n$ 行，也就是以 $1, n$ 开头的那一行。$a$ 的指数从 $n$ 递减到 $0$，$b$ 的指数从 $0$ 递增到 $n$，所以每一项的指数之和都是 $n$。在 $(a + b)^{4}$ 中，第 $4$ 行是 $1, 4, 6, 4, 1$，第三项是 $6a^{2}b^{2}$：

$$(a + b)^{4} = a^{4} + 4a^{3}b + 6a^{2}b^{2} + 4ab^{3} + b^{4}$$

> **注意。** 行从第 $0$ 行数起：$1, 4, 6, 4, 1$ 是第 $4$ 行，第 $3$ 行是 $1, 3, 3, 1$。项从 $a$ 的最高次幂数起：在 $(a + b)^{5}$ 中，$a^{3}b^{2}$ 是第三项，系数是 $10$，不是第二项的 $5$。系数是这一行中的数，不是指数 $n$ 或 $k$。`,
      ),
      figure: pascalSumFigure,
      generate(rng) {
        const n = rng.int(4, 9);
        const k = rng.int(1, n - 1);
        const [u, v] = rng.pick([
          ["x", "y"],
          ["a", "b"],
        ] as const);
        const target = `${pw(u, k)}${pw(v, n - k)}`;
        const c = choose(n, k);
        return numberProblem({
          prompt: t(
            `What is the coefficient of $${target}$ in the expansion of $(${u} + ${v})^{${n}}$?`,
            `$(${u} + ${v})^{${n}}$ 的展开式中，$${target}$ 的系数是多少？`,
          ),
          answer: c,
          wrong: [n, k, choose(n, k - 1), choose(n - 1, k)],
          solution: paragraphs(
            t(
              `**Step 1: Find row $${n}$.** Each number is the sum of the two above it. Row $${n - 1}$ is $${pascalRow(n - 1)}$, so row $${n}$ is $${pascalRow(n)}$.`,
              `**第一步：找出第 $${n}$ 行。** 每个数都是它上方两个数之和。第 $${n - 1}$ 行是 $${pascalRow(n - 1)}$，所以第 $${n}$ 行是 $${pascalRow(n)}$。`,
            ),
            t(
              `**Step 2: Find the term.** The powers of $${u}$ go down from $${n}$: the first term has $${pw(u, n)}$, the second $${pw(u, n - 1)}${v}$, and so on. The term $${target}$ has $${pw(u, k)}$, so it is term number $${n - k + 1}$, and that place of the row holds $${c}$.`,
              `**第二步：找出这一项。** $${u}$ 的指数从 $${n}$ 开始递减：第一项含 $${pw(u, n)}$，第二项含 $${pw(u, n - 1)}${v}$，依此类推。$${target}$ 含 $${pw(u, k)}$，所以是第 $${n - k + 1}$ 项，这一行的这个位置是 $${c}$。`,
            ),
            t(
              `**Check.** Putting $${u} = ${v} = 1$ into $(${u} + ${v})^{${n}}$ gives $2^{${n}} = ${2 ** n}$, so row $${n}$ must add up to $${2 ** n}$: $${pascalRow(n, " + ")} = ${2 ** n}$. It does.`,
              `**检验。** 把 $${u} = ${v} = 1$ 代入 $(${u} + ${v})^{${n}}$ 得 $2^{${n}} = ${2 ** n}$，所以第 $${n}$ 行的和应为 $${2 ** n}$：$${pascalRow(n, " + ")} = ${2 ** n}$，正确。`,
            ),
          ),
        });
      },
    },
    {
      id: "cubing-binomials",
      title: t("Cubing a binomial", "二项式的立方"),
      explanation: t(
        `Row $3$ of Pascal's triangle is $1, 3, 3, 1$, so

$$(a + b)^{3} = a^{3} + 3a^{2}b + 3ab^{2} + b^{3}$$

This holds for any two terms, because $a$ and $b$ stand for whatever the binomial contains. Put each term in brackets, with its coefficient and sign, and raise the whole bracket to its power. For $(2x - 1)^{3}$, take $a = 2x$ and $b = -1$:

$$(2x - 1)^{3} = (2x)^{3} + 3(2x)^{2}(-1) + 3(2x)(-1)^{2} + (-1)^{3} = 8x^{3} - 12x^{2} + 6x - 1$$

> **Watch out.** $(2x - 1)^{3}$ is not $8x^{3} - 1$: the two middle terms are what the cubes alone leave out. Raise the coefficient with its term: $(2x)^{2} = 4x^{2}$ and $(-1)^{2} = 1$, not $2x^{2}$ and $-1$. And keep the coefficients $3, 3$ of the row; without them the expansion is wrong.`,
        `杨辉三角的第 $3$ 行是 $1, 3, 3, 1$，所以

$$(a + b)^{3} = a^{3} + 3a^{2}b + 3ab^{2} + b^{3}$$

$a$ 和 $b$ 代表二项式中的任意两项，所以公式对任意两项都成立。把每一项连同系数和符号放进括号，整个括号乘方。对 $(2x - 1)^{3}$，取 $a = 2x$，$b = -1$：

$$(2x - 1)^{3} = (2x)^{3} + 3(2x)^{2}(-1) + 3(2x)(-1)^{2} + (-1)^{3} = 8x^{3} - 12x^{2} + 6x - 1$$

> **注意。** $(2x - 1)^{3}$ 不是 $8x^{3} - 1$：只算两个立方会漏掉中间两项。系数要随项一起乘方：$(2x)^{2} = 4x^{2}$，$(-1)^{2} = 1$，不是 $2x^{2}$ 和 $-1$。还要保留这一行中的系数 $3, 3$，漏掉就错了。`,
      ),
      generate(rng) {
        const p = rng.pick([1, 1, 2, 3]);
        const q = p === 1 ? rng.nonZero(-5, 5) : rng.nonZero(-3, 3);
        const a = term(p, 1);
        const b = term(q);
        const shown = q > 0 && rng.bool(0.3) ? [b, a] : [a, b];
        const expr = `${wrap(shown)}^{3}`;
        const answer = write(binomialPower(a, b, 3));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([term(p ** 3, 3), term(q ** 3)]),
            write(binomialPower(a, b, 3, undefined, (i) => (i === 0 ? 1 : i === 3 ? q ** 3 : q))),
            write(binomialPower(a, b, 3, () => 1)),
          ],
          solution: powerSolution(expr, shown, a, b, 3),
        });
      },
    },
    {
      id: "higher-powers",
      title: t("Fourth and higher powers", "四次及更高次幂"),
      explanation: t(
        `Higher powers work the same way with a longer row. With row $1, 4, 6, 4, 1$ and $a = x$, $b = -2y$:

$$(x - 2y)^{4} = x^{4} + 4x^{3}(-2y) + 6x^{2}(-2y)^{2} + 4x(-2y)^{3} + (-2y)^{4} = x^{4} - 8x^{3}y + 24x^{2}y^{2} - 32xy^{3} + 16y^{4}$$

When the second term is negative, its odd powers are negative and its even powers positive, so the signs of the expansion alternate.

> **Watch out.** Raise the coefficient $-2$ to each power too: $(-2y)^{3} = -8y^{3}$, not $-2y^{3}$. Keep the sign inside the bracket; dropping it gives all plus signs, $x^{4} + 8x^{3}y + \\dots$, which is the expansion of $(x + 2y)^{4}$. And use the numbers of the row, not $1$ for every term.`,
        `更高次幂的方法相同，只是用更长的一行。用 $1, 4, 6, 4, 1$ 这一行，取 $a = x$，$b = -2y$：

$$(x - 2y)^{4} = x^{4} + 4x^{3}(-2y) + 6x^{2}(-2y)^{2} + 4x(-2y)^{3} + (-2y)^{4} = x^{4} - 8x^{3}y + 24x^{2}y^{2} - 32xy^{3} + 16y^{4}$$

第二项为负时，它的奇次幂为负，偶次幂为正，所以展开式各项的符号正负交替。

> **注意。** 系数 $-2$ 也要乘方：$(-2y)^{3} = -8y^{3}$，不是 $-2y^{3}$。符号要留在括号里；丢掉它会得到全是加号的 $x^{4} + 8x^{3}y + \\dots$，那是 $(x + 2y)^{4}$ 的展开式。还要用这一行中的数，不能每一项都取 $1$。`,
      ),
      generate(rng) {
        const n = rng.pick([4, 4, 5, 5, 6]);
        const p = n === 4 ? rng.pick([1, 2]) : 1;
        const q = n === 6 ? rng.pick([1, -1]) : rng.pick([1, -1, 2, -2]);
        const a = term(p, 1);
        const b = rng.bool() ? term(q) : term(q, 0, 1);
        const shown = q > 0 && rng.bool(0.3) ? [b, a] : [a, b];
        const expr = `${wrap(shown)}^{${n}}`;
        const answer = write(binomialPower(a, b, n));
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write(binomialPower(a, b, n, undefined, (i) => (i === 0 ? 1 : q))),
            write(binomialPower(a, b, n, () => 1)),
            write(binomialPower(a, term(Math.abs(q), b.x, b.y), n)),
          ],
          solution: powerSolution(expr, shown, a, b, n),
        });
      },
    },
    {
      id: "one-coefficient",
      title: t("Finding one coefficient", "求展开式中某一项的系数"),
      explanation: t(
        `Every term of $(a + b)^{n}$ has the form $Ca^{k}b^{n - k}$, with $C$ from row $n$ of Pascal's triangle. In $(px + q)^{n}$, only $a = px$ carries $x$, so exactly one term contains $x^{k}$: the one with $(px)^{k}q^{n - k}$. There is no need to expand the rest. In $(2x - 3)^{4}$, row $4$ is $1, 4, 6, 4, 1$; the $x^{3}$ term is the second, with $C = 4$:

$$4(2x)^{3}(-3) = 4 \\cdot 8 \\cdot (-3)x^{3} = -96x^{3}$$

so the coefficient of $x^{3}$ is $-96$.

> **Watch out.** The coefficient is more than the number from the row: $4$ alone forgets $(2x)^{3}$ and $(-3)$. Raise $p$ and $q$ to their powers, $2^{3} = 8$, not $2$, and keep the sign of $q$: here one factor of $-3$ makes the coefficient negative. Leaving out $q$, or its sign, gives $32$ or $96$.`,
        `$(a + b)^{n}$ 的每一项都形如 $Ca^{k}b^{n - k}$，$C$ 取自杨辉三角的第 $n$ 行。在 $(px + q)^{n}$ 中只有 $a = px$ 含 $x$，所以恰好有一项含 $x^{k}$，就是含 $(px)^{k}q^{n - k}$ 的那一项，其余各项不必展开。在 $(2x - 3)^{4}$ 中，第 $4$ 行是 $1, 4, 6, 4, 1$；含 $x^{3}$ 的是第二项，$C = 4$：

$$4(2x)^{3}(-3) = 4 \\cdot 8 \\cdot (-3)x^{3} = -96x^{3}$$

所以 $x^{3}$ 的系数是 $-96$。

> **注意。** 系数不只是这一行中的数：只写 $4$ 就漏了 $(2x)^{3}$ 和 $(-3)$。$p$ 和 $q$ 都要乘方，$2^{3} = 8$，不是 $2$；还要保留 $q$ 的符号：这里一个 $-3$ 使系数为负。漏掉 $q$ 或它的符号，会得到 $32$ 或 $96$。`,
      ),
      generate(rng) {
        const n = rng.int(3, 6);
        const k = rng.int(1, n - 1);
        const p = rng.pick([1, 2, 2, 3]);
        const q = rng.pick([1, -1, 2, -2, 3, -3]);
        const c = choose(n, k);
        const answer = c * p ** k * q ** (n - k);
        const a = term(p, 1);
        const b = term(q);
        const expr = `${wrap([a, b])}^{${n}}`;
        const piece = `${c}${factorPower(a, k)}${factorPower(b, n - k)}`;
        const product = [c, p ** k, q ** (n - k)]
          .filter((m) => m !== 1)
          .map((m) => (m < 0 ? `(${m})` : String(m)))
          .join(" \\cdot ");
        const odd = (n - k) % 2 === 1;
        const positives = listed([c, p, q].filter((m) => m !== 1).map((m) => `$${m}$`));
        return numberProblem({
          prompt: t(
            `What is the coefficient of $${pw("x", k)}$ in the expansion of $${expr}$?`,
            `$${expr}$ 的展开式中，$${pw("x", k)}$ 的系数是多少？`,
          ),
          answer,
          wrong: [c, c * p * q, -answer, c * p ** k],
          solution: paragraphs(
            t(
              `**Step 1: Pick out the term.** Row $${n}$ of Pascal's triangle is $${pascalRow(n)}$. With $a = ${mono(a)}$ and $b = ${q}$, the term containing $${pw("x", k)}$ is the one with $a^{${k}}$, so $b$ is raised to the power $${n} - ${k} = ${n - k}$, and its number in the row is $${c}$:${steps(piece)}`,
              `**第一步：找出这一项。** 杨辉三角的第 $${n}$ 行是 $${pascalRow(n)}$。取 $a = ${mono(a)}$，$b = ${q}$，含 $${pw("x", k)}$ 的项含 $a^{${k}}$，所以 $b$ 的指数是 $${n} - ${k} = ${n - k}$，它在这一行中对应的数是 $${c}$：${steps(piece)}`,
            ),
            t(
              `**Step 2: Multiply the numbers.** Work out each power, then multiply:${steps(chain(piece, `${product}${pw("x", k)}`, mono(term(answer, k))))}So the coefficient of $${pw("x", k)}$ is $${answer}$.`,
              `**第二步：把数相乘。** 先算出每个乘方，再相乘：${steps(chain(piece, `${product}${pw("x", k)}`, mono(term(answer, k))))}所以 $${pw("x", k)}$ 的系数是 $${answer}$。`,
            ),
            q > 0
              ? t(
                  `**Check.** Every number in the term, ${positives.en}, is positive, so the coefficient must be positive, and $${answer}$ is.`,
                  `**检验。** 这一项中的数 ${positives["zh-CN"]} 都是正数，所以系数必为正，$${answer}$ 是正数。`,
                )
              : t(
                  `**Check.** Only $b = ${q}$ is negative, and it is raised to the power $${n - k}$, which is ${odd ? "odd" : "even"}, so the coefficient must be ${odd ? "negative" : "positive"}, and $${answer}$ is.`,
                  `**检验。** 只有 $b = ${q}$ 是负数，它的指数 $${n - k}$ 是${odd ? "奇数" : "偶数"}，所以系数必为${odd ? "负" : "正"}，$${answer}$ 正是如此。`,
                ),
          ),
        });
      },
    },
  ],
};

/** squared writes the square of a term for a worked solution: "x^{2}", "5^{2}", "(3x)^{2}". */
const squared = (m: Term) =>
  m.c === 1 && degreeOf(m) === 1 ? `${vars(m)}^{2}` : degreeOf(m) === 0 && m.c > 0 ? `${m.c}^{2}` : `(${mono(m)})^{2}`;

export const differenceOfSquaresFormula: TopicDef = {
  id: "difference-of-squares-formula",
  title: t("The Difference of Squares Formula", "平方差公式"),
  summary: t(
    "Multiply $(a + b)(a - b) = a^{2} - b^{2}$, and use it for mental arithmetic.",
    "用 $(a + b)(a - b) = a^{2} - b^{2}$ 计算乘积，并用于速算。",
  ),
  prerequisites: ["squaring-binomials"],
  encompasses: [{ topic: "multiplying-binomials", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSA.APR.A.1", "CCSS.HSA.SSE.A.2"],
  intro: t(
    `Multiplying binomials term by term, $(x + 7)(x - 7) = x^{2} - 7x + 7x - 49 = x^{2} - 49$. The two middle products cancel, because one binomial adds $7$ and the other subtracts it. That happens whenever a sum is multiplied by the difference of the same two terms, so such a product can be written down at once:

$$(a + b)(a - b) = a^{2} - b^{2}$$

The result is a difference of two squares, with no middle term. The same pattern also makes some products of numbers easy: $49 \\times 51 = (50 - 1)(50 + 1) = 2500 - 1 = 2499$.

In this lesson we use the formula with variables, with terms that have coefficients and powers, and for mental arithmetic.`,
    `逐项相乘，$(x + 7)(x - 7) = x^{2} - 7x + 7x - 49 = x^{2} - 49$。中间的两个乘积相互抵消，因为一个二项式加 $7$，另一个减 $7$。只要两个数的和乘以这两个数的差，就会这样，所以这种乘积可以直接写出：

$$(a + b)(a - b) = a^{2} - b^{2}$$

结果是两个平方的差，没有中间项。同样的规律还能让一些数的乘法变简单：$49 \\times 51 = (50 - 1)(50 + 1) = 2500 - 1 = 2499$。

这节课我们把公式用于含变量的式子、带系数和幂的项，以及速算。`,
  ),
  knowledgePoints: [
    {
      id: "sum-times-difference",
      title: t("A sum times a difference", "和与差的积"),
      explanation: t(
        `When a sum is multiplied by the difference of the same two terms, the middle products are $-ab$ and $+ab$, and they cancel:

$$(a + b)(a - b) = a^{2} - ab + ab - b^{2} = a^{2} - b^{2}$$

The result is a **difference of squares**: the square of the term with the same sign in both brackets, minus the square of the term whose sign changes. For example, $(x + 7)(x - 7) = x^{2} - 49$, and the order of the brackets does not matter: $(y - 3)(y + 3) = y^{2} - 9$.

> **Watch out.** There is no middle term: $(x + 7)(x - 7)$ is not $x^{2} - 14x - 49$. The square of $7$ is subtracted, so the answer is $x^{2} - 49$, not $x^{2} + 49$; and the number is squared, $-49$, not $-7$.`,
        `两个数的和乘以这两个数的差时，中间的两个乘积是 $-ab$ 和 $+ab$，相互抵消：

$$(a + b)(a - b) = a^{2} - ab + ab - b^{2} = a^{2} - b^{2}$$

结果是**平方差**：两个括号中符号相同的那一项的平方，减去符号相反的那一项的平方。例如 $(x + 7)(x - 7) = x^{2} - 49$；两个括号的顺序无关紧要：$(y - 3)(y + 3) = y^{2} - 9$。

> **注意。** 没有中间项：$(x + 7)(x - 7)$ 不是 $x^{2} - 14x - 49$。$7$ 的平方是被减去的，所以结果是 $x^{2} - 49$，不是 $x^{2} + 49$；而且数要平方，是 $-49$，不是 $-7$。`,
      ),
      generate(rng) {
        const a = rng.int(1, 15);
        const v = rng.bool() ? term(1, 1) : term(1, 0, 1);
        const sum = [v, term(a)];
        const diff = [v, term(-a)];
        const sumFirst = rng.bool();
        const expr = sumFirst ? `${wrap(sum)}${wrap(diff)}` : `${wrap(diff)}${wrap(sum)}`;
        const answerTerms = [mul(v, v), term(-a * a)];
        const answer = write(answerTerms);
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [write([mul(v, v), term(a * a)]), write([mul(v, v), mul(v, term(-2 * a)), term(-a * a)]), write([mul(v, v), term(-a)])],
          solution: paragraphs(
            t(
              `**Step 1: Spot the pattern.** Both brackets contain $${mono(v)}$ and $${a}$; one adds $${a}$ and the other subtracts it. So this is $(a + b)(a - b)$ with $a = ${mono(v)}$ and $b = ${a}$.`,
              `**第一步：看出规律。** 两个括号都含 $${mono(v)}$ 和 $${a}$，一个加 $${a}$，一个减 $${a}$。所以这是 $(a + b)(a - b)$，其中 $a = ${mono(v)}$，$b = ${a}$。`,
            ),
            t(
              `**Step 2: Write the difference of squares.** The middle products cancel, leaving $a^{2} - b^{2}$:${steps(`${expr} = ${squared(v)} - ${a}^{2} = ${answer}`)}`,
              `**第二步：写出平方差。** 中间的乘积相互抵消，剩下 $a^{2} - b^{2}$：${steps(`${expr} = ${squared(v)} - ${a}^{2} = ${answer}`)}`,
            ),
            check([sumFirst ? plus(sum, diff) : plus(diff, sum)], answerTerms),
          ),
        });
      },
    },
    {
      id: "squares-of-terms",
      title: t("Terms with coefficients and powers", "带系数和幂的项"),
      explanation: t(
        `The formula holds for any two terms, since $a$ and $b$ stand for whole terms. Square each whole term, coefficient included, and subtract the square of the term that changes sign. In $(5 - 3x)(5 + 3x)$ the term $5$ keeps its sign and $3x$ changes it, so $a = 5$ and $b = 3x$:

$$(5 - 3x)(5 + 3x) = 5^{2} - (3x)^{2} = 25 - 9x^{2}$$

A power doubles its exponent when squared: $(2x^{2} + y)(2x^{2} - y) = (2x^{2})^{2} - y^{2} = 4x^{4} - y^{2}$.

> **Watch out.** Square the coefficient as well as the variable: $(3x)^{2} = 9x^{2}$, not $3x^{2}$. The middle products still cancel, so there is no $-30x$ term. And subtract the square of the term that changes sign: $(5 - 3x)(5 + 3x)$ is $25 - 9x^{2}$, not $25 + 9x^{2}$.`,
        `$a$ 和 $b$ 代表整项，所以公式对任意两项都成立。把每一项整体（包括系数）平方，再减去改变符号的那一项的平方。在 $(5 - 3x)(5 + 3x)$ 中，$5$ 的符号不变，$3x$ 的符号改变，所以 $a = 5$，$b = 3x$：

$$(5 - 3x)(5 + 3x) = 5^{2} - (3x)^{2} = 25 - 9x^{2}$$

幂平方时指数加倍：$(2x^{2} + y)(2x^{2} - y) = (2x^{2})^{2} - y^{2} = 4x^{4} - y^{2}$。

> **注意。** 系数和变量都要平方：$(3x)^{2} = 9x^{2}$，不是 $3x^{2}$。中间的乘积仍然抵消，所以没有 $-30x$ 这一项。减去的是改变符号的那一项的平方：$(5 - 3x)(5 + 3x)$ 是 $25 - 9x^{2}$，不是 $25 + 9x^{2}$。`,
      ),
      keyPrerequisites: ["power-rules"],
      generate(rng) {
        const p = rng.int(2, 9);
        const q = rng.int(1, 9);
        const [a, b] = rng.pick([
          [term(p, 1), term(q)],
          [term(p, 1), term(q, 0, 1)],
          [term(q + 1), term(p, 1)],
          [term(rng.int(1, 3), 2), term(q)],
          [term(rng.int(1, 3), 2), term(rng.int(1, 5), 0, 1)],
        ] as const);
        const sum = [a, b];
        const diff = [a, neg(b)];
        const sumFirst = rng.bool();
        const expr = sumFirst ? `${wrap(sum)}${wrap(diff)}` : `${wrap(diff)}${wrap(sum)}`;
        const answerTerms = [mul(a, a), neg(mul(b, b))];
        const answer = write(answerTerms);
        return expandProblem({
          prompt: t(`Expand $${expr}$.`, `展开 $${expr}$。`),
          answer,
          wrong: [
            write([mul(a, a), mul(b, b)]),
            write([term(a.c, 2 * a.x, 2 * a.y), term(-b.c, 2 * b.x, 2 * b.y)]),
            write([mul(a, a), mul(term(-2), mul(a, b)), neg(mul(b, b))]),
          ],
          solution: paragraphs(
            t(
              `**Step 1: Name the two terms.** $${mono(a)}$ has the same sign in both brackets, and $${mono(b)}$ changes sign, so this is $(a + b)(a - b)$ with $a = ${mono(a)}$ and $b = ${mono(b)}$.`,
              `**第一步：确定两项。** $${mono(a)}$ 在两个括号中符号相同，$${mono(b)}$ 的符号改变，所以这是 $(a + b)(a - b)$，其中 $a = ${mono(a)}$，$b = ${mono(b)}$。`,
            ),
            t(
              `**Step 2: Square each whole term and subtract.** The coefficients are squared too, and exponents double:${steps(`${expr} = ${squared(a)} - ${squared(b)} = ${answer}`)}`,
              `**第二步：整项平方再相减。** 系数也要平方，指数加倍：${steps(`${expr} = ${squared(a)} - ${squared(b)} = ${answer}`)}`,
            ),
            check([sumFirst ? plus(sum, diff) : plus(diff, sum)], answerTerms),
          ),
        });
      },
    },
    {
      id: "mental-arithmetic",
      title: t("Mental arithmetic", "用平方差公式速算"),
      explanation: t(
        `The formula turns some products into an easy subtraction. When two numbers are the same distance below and above a round number, write them as $c - d$ and $c + d$; their product is $c^{2} - d^{2}$, and squaring a round number is quick:

$$47 \\times 53 = (50 - 3)(50 + 3) = 50^{2} - 3^{2} = 2500 - 9 = 2491$$

> **Watch out.** Subtract the square of the distance: $2500 - 9$, not $2500 - 3$ or $2500 - 6$. The result is less than $50^{2}$, not more, so it is not $2500 + 9$. And $50^{2}$ alone, $2500$, forgets the $-3^{2}$.`,
        `平方差公式可以把一些乘法变成简单的减法。两个数比某个整十（或整百）数一个少、一个多同样多时，把它们写成 $c - d$ 和 $c + d$；它们的积是 $c^{2} - d^{2}$，而整十数的平方很好算：

$$47 \\times 53 = (50 - 3)(50 + 3) = 50^{2} - 3^{2} = 2500 - 9 = 2491$$

> **注意。** 减去的是相差的数的平方：$2500 - 9$，不是 $2500 - 3$ 或 $2500 - 6$。结果比 $50^{2}$ 小而不是大，所以不是 $2500 + 9$。只写 $50^{2}$ 即 $2500$，就漏掉了 $-3^{2}$。`,
      ),
      generate(rng) {
        const c = rng.pick([20, 30, 40, 50, 60, 70, 80, 90, 100, 200]);
        const d = rng.int(1, 9);
        const [m, n] = rng.bool() ? [c - d, c + d] : [c + d, c - d];
        const answer = c * c - d * d;
        const lastDigits = (m % 10) * (n % 10);
        return numberProblem({
          prompt: t(`Use the difference of squares formula to compute $${m} \\times ${n}$.`, `用平方差公式计算 $${m} \\times ${n}$。`),
          answer,
          form: "integer",
          wrong: [c * c, c * c + d * d, c * c - d, c * c - 2 * d],
          solution: paragraphs(
            t(
              `**Step 1: Write the numbers around $${c}$.** $${m}$ and $${n}$ are both $${d}$ away from $${c}$, one below and one above:${steps(`${m} \\times ${n} = (${c} ${m < n ? "-" : "+"} ${d})(${c} ${m < n ? "+" : "-"} ${d})`)}`,
              `**第一步：围绕 $${c}$ 改写。** $${m}$ 和 $${n}$ 与 $${c}$ 都相差 $${d}$，一个小、一个大：${steps(`${m} \\times ${n} = (${c} ${m < n ? "-" : "+"} ${d})(${c} ${m < n ? "+" : "-"} ${d})`)}`,
            ),
            t(
              `**Step 2: Use the difference of squares.** Square $${c}$, square $${d}$, and subtract:${steps(`= ${c}^{2} - ${d}^{2} = ${c * c} - ${d * d} = ${answer}`)}`,
              `**第二步：运用平方差公式。** 分别求 $${c}$ 和 $${d}$ 的平方，再相减：${steps(`= ${c}^{2} - ${d}^{2} = ${c * c} - ${d * d} = ${answer}`)}`,
            ),
            t(
              `**Check.** The last digit of a product depends only on the last digits of the factors: $${m % 10} \\times ${n % 10} = ${lastDigits}$ ends in $${lastDigits % 10}$, and so does $${answer}$.`,
              `**检验。** 积的个位只取决于两个因数的个位：$${m % 10} \\times ${n % 10} = ${lastDigits}$ 的个位是 $${lastDigits % 10}$，$${answer}$ 的个位也是 $${lastDigits % 10}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** gcfOf finds the greatest common factor of monomials: the positive gcd of the coefficients and the smaller power of each variable. */
function gcfOf(ms: readonly Term[]): Term {
  return term(
    ms.reduce((g, m) => gcd(g, m.c), 0),
    Math.min(...ms.map((m) => m.x)),
    Math.min(...ms.map((m) => m.y)),
  );
}

/** listed joins items as a list in each locale: "a, b and c" and "a、b、c". */
function listed(items: readonly string[]): Text {
  const en = items.length === 1 ? items[0]! : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
  return t(en, items.join("、"));
}

/** gcfSolution writes the steps of finding the greatest common factor of monomials, and checks it by dividing it out. */
function gcfSolution(ms: readonly Term[]): Text {
  const g = gcfOf(ms);
  const cs = ms.map((m) => Math.abs(m.c));
  const signs = ms.some((m) => m.c < 0)
    ? t(" Signs do not matter: the greatest common factor is taken positive.", "符号不影响结果：最大公因式取正的。")
    : t("", "");
  const coefficients =
    g.c === 1
      ? t(
          `**Step 1: The coefficients.** ${listed(cs.map((c) => `$${c}$`)).en} have no common factor greater than $1$, so the coefficient of the greatest common factor is $1$, which is not written.${signs.en}`,
          `**第一步：系数。** ${listed(cs.map((c) => `$${c}$`))["zh-CN"]} 没有大于 $1$ 的公因数，所以最大公因式的系数是 $1$，不必写出。${signs["zh-CN"]}`,
        )
      : (() => {
          const items = t(
            listed(cs.map((c) => (c === g.c ? `$${c}$ itself` : `$${c} = ${g.c} \\cdot ${c / g.c}$`))).en,
            listed(cs.map((c) => (c === g.c ? `$${c}$ 本身` : `$${c} = ${g.c} \\cdot ${c / g.c}$`)))["zh-CN"],
          );
          return t(
            `**Step 1: The coefficients.** Write each coefficient as a multiple of $${g.c}$: ${items.en}. What is left shares no factor greater than $1$, so the greatest common factor of the coefficients is $${g.c}$.${signs.en}`,
            `**第一步：系数。** 把每个系数写成 $${g.c}$ 的倍数：${items["zh-CN"]}。剩下的数没有大于 $1$ 的公因数，所以系数的最大公因数是 $${g.c}$。${signs["zh-CN"]}`,
          );
        })();
  const variable = (v: "x" | "y", e: (m: Term) => number): Text | undefined => {
    if (!ms.some((m) => e(m) > 0)) return undefined;
    const missing = ms.filter((m) => e(m) === 0);
    if (missing.length > 0) {
      const which = listed(missing.map((m) => `$${mono(m)}$`));
      return t(`$${v}$ is not in ${which.en}, so it is not a common factor`, `$${v}$ 不在 ${which["zh-CN"]} 中，所以不是公因式`);
    }
    const powers = listed(ms.map((m) => `$${pw(v, e(m))}$`));
    const least = pw(v, Math.min(...ms.map(e)));
    return t(
      `the powers of $${v}$ are ${powers.en}, and the smallest, $${least}$, divides every one of them`,
      `$${v}$ 的幂是 ${powers["zh-CN"]}，其中最小的 $${least}$ 能整除每一个`,
    );
  };
  const parts = [variable("x", (m) => m.x), variable("y", (m) => m.y)].filter((p): p is Text => p !== undefined);
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const variables = t(
    `**Step 2: The variables.** Take each variable to its smallest power. ${parts.map((p) => cap(p.en)).join(". ")}. Together, the greatest common factor is $${mono(g)}$.`,
    `**第二步：变量。** 每个变量取最小次幂。${parts.map((p) => p["zh-CN"]).join("；")}。合起来，最大公因式是 $${mono(g)}$。`,
  );
  const quotients = ms.map((m) => term(m.c / g.c, m.x - g.x, m.y - g.y));
  const factored = ms.map((m, i) => {
    const q = quotients[i]!;
    if (q.c === 1 && degreeOf(q) === 0) return t(`$${mono(m)}$ is $${mono(g)}$ itself`, `$${mono(m)}$ 就是 $${mono(g)}$ 本身`);
    const shown = q.c < 0 ? `(${mono(q)})` : mono(q);
    return t(`$${mono(m)} = ${mono(g)} \\cdot ${shown}$`, `$${mono(m)} = ${mono(g)} \\cdot ${shown}$`);
  });
  const left = listed(quotients.map((q) => `$${mono(q)}$`));
  const check = t(
    `**Check.** Divide each monomial by $${mono(g)}$: ${listed(factored.map((f) => f.en)).en}. What is left, ${left.en}, has no common factor: no number greater than $1$ divides all the coefficients, and no variable is in every one. So nothing more can be taken out.`,
    `**检验。** 用 $${mono(g)}$ 去除每个单项式：${factored.map((f) => f["zh-CN"]).join("，")}。剩下的 ${left["zh-CN"]} 没有公因式：没有大于 $1$ 的数能整除所有系数，也没有变量出现在每一项中。所以不能再提出更多。`,
  );
  return paragraphs(coefficients, variables, check);
}

/** coprimeMultiples draws k coefficients g·pᵢ with pᵢ in [1, 7] and gcd of the pᵢ equal to 1, so their gcd is g. */
function coprimeMultiples(rng: Rng, g: number, k: number): number[] {
  let ps: number[];
  do {
    ps = Array.from({ length: k }, () => rng.int(1, 7));
  } while (ps.reduce((a, b) => gcd(a, b), 0) !== 1 || new Set(ps).size < 2);
  return ps.map((p) => g * p);
}

export const greatestCommonFactorOfMonomials: TopicDef = {
  id: "greatest-common-factor-of-monomials",
  title: t("The Greatest Common Factor of Two Monomials", "两个单项式的最大公因式"),
  summary: t("Find the greatest common factor of two or three monomials.", "求两个或三个单项式的最大公因式。"),
  prerequisites: ["product-and-quotient-rules"],
  encompasses: [{ topic: "greatest-common-factor", weight: 0.5 }],
  xp: 10,
  standards: ["CCSS.HSA.SSE.A.2"],
  intro: t(
    `Factoring a polynomial starts by taking out a factor common to every term, and the most useful one to take out is the greatest. For whole numbers we already know how to find it: the greatest common factor of $12$ and $18$ is $6$. Monomials work the same way, with the variables counted too. By the product rule, $x^{5} = x^{3} \\cdot x^{2}$, so $12x^{5}$ and $18x^{3}$ both contain $6$ and three factors of $x$:

$$12x^{5} = 6x^{3} \\cdot 2x^{2} \\qquad 18x^{3} = 6x^{3} \\cdot 3$$

and their greatest common factor is $6x^{3}$.

In this lesson we find the greatest common factor of two monomials in one variable, of monomials in two variables, and of three monomials.`,
    `因式分解多项式，第一步是提出每一项都有的公因式，而最有用的是最大的那一个。对整数我们已经会求：$12$ 和 $18$ 的最大公因数是 $6$。单项式也一样，只是还要考虑变量。由同底数幂的乘法，$x^{5} = x^{3} \\cdot x^{2}$，所以 $12x^{5}$ 和 $18x^{3}$ 都含有 $6$ 和三个 $x$：

$$12x^{5} = 6x^{3} \\cdot 2x^{2} \\qquad 18x^{3} = 6x^{3} \\cdot 3$$

它们的最大公因式是 $6x^{3}$。

这节课我们求两个一元单项式、含两个变量的单项式，以及三个单项式的最大公因式。`,
  ),
  knowledgePoints: [
    {
      id: "one-variable",
      title: t("Two monomials in one variable", "两个一元单项式"),
      explanation: t(
        `The **greatest common factor** (GCF) of two monomials is the greatest monomial that divides both. It has two parts. Its coefficient is the greatest common factor of the coefficients. Its power of the variable is the **smaller** of the two exponents: $x^{5}$ and $x^{3}$ both contain at least three factors of $x$, but $x^{3}$ has no fourth. So for $12x^{5}$ and $18x^{3}$:

$$12x^{5} = 6x^{3} \\cdot 2x^{2} \\qquad 18x^{3} = 6x^{3} \\cdot 3$$

and the GCF is $6x^{3}$. What is left, $2x^{2}$ and $3$, has no common factor, which shows $6x^{3}$ is the greatest.

> **Watch out.** Take the smaller exponent, not the larger: $x^{5}$ does not divide $x^{3}$, so $6x^{5}$ is not a common factor. Not the difference of the exponents either: $6x^{2}$ divides both, but $6x^{3}$ is greater. And the coefficient is the greatest common factor of $12$ and $18$, which is $6$, not their product or a multiple of them.`,
        `两个单项式的**最大公因式**是能同时整除它们的最大的单项式。它由两部分组成：系数是各系数的最大公因数；变量的指数取两个指数中**较小**的一个：$x^{5}$ 和 $x^{3}$ 都至少含三个 $x$，而 $x^{3}$ 没有第四个。所以对 $12x^{5}$ 和 $18x^{3}$：

$$12x^{5} = 6x^{3} \\cdot 2x^{2} \\qquad 18x^{3} = 6x^{3} \\cdot 3$$

最大公因式是 $6x^{3}$。剩下的 $2x^{2}$ 和 $3$ 没有公因式，这说明 $6x^{3}$ 是最大的。

> **注意。** 指数取较小的，不是较大的：$x^{5}$ 不能整除 $x^{3}$，所以 $6x^{5}$ 不是公因式。也不是两个指数之差：$6x^{2}$ 能整除两者，但 $6x^{3}$ 更大。系数是 $12$ 和 $18$ 的最大公因数 $6$，不是它们的乘积或倍数。`,
      ),
      keyPrerequisites: ["greatest-common-factor"],
      generate(rng) {
        const g = rng.int(1, 9);
        const [a, b] = coprimeMultiples(rng, g, 2);
        let m: number;
        let n: number;
        do {
          m = rng.int(1, 8);
          n = rng.int(1, 8);
        } while (m === n);
        const ms = [term(a!, m), term(b!, n)];
        const answer = mono(gcfOf(ms));
        return expandProblem({
          prompt: t(
            `Find the greatest common factor of $${mono(ms[0]!)}$ and $${mono(ms[1]!)}$.`,
            `求 $${mono(ms[0]!)}$ 和 $${mono(ms[1]!)}$ 的最大公因式。`,
          ),
          answer,
          wrong: [mono(term(g, Math.max(m, n))), mono(term((a! * b!) / g, Math.max(m, n))), mono(term(g, Math.abs(m - n)))],
          solution: gcfSolution(ms),
        });
      },
    },
    {
      id: "two-variables",
      title: t("Monomials in two variables", "含两个变量的单项式"),
      explanation: t(
        `With several variables, treat each variable on its own and take its smaller exponent. A variable has to be in **every** monomial to be a common factor: $-12x^{4}$ has no $y$, so $y$ is not a factor of it. Signs do not change what divides what, and the GCF is taken positive. So the GCF of $8x^{2}y^{3}$ and $-12x^{4}$ is $4x^{2}$:

$$8x^{2}y^{3} = 4x^{2} \\cdot 2y^{3} \\qquad -12x^{4} = 4x^{2} \\cdot (-3x^{2})$$

> **Watch out.** Leave out a variable missing from one monomial: $4x^{2}y^{3}$ does not divide $-12x^{4}$. Take the smaller exponent of each variable, not the larger. And give the GCF positive, $4x^{2}$, not $-4x^{2}$, even when a monomial is negative.`,
        `多个变量时，每个变量分别考虑，取较小的指数。变量必须出现在**每一个**单项式中才是公因式：$-12x^{4}$ 不含 $y$，所以 $y$ 不是它的因式。符号不影响整除关系，最大公因式取正的。所以 $8x^{2}y^{3}$ 和 $-12x^{4}$ 的最大公因式是 $4x^{2}$：

$$8x^{2}y^{3} = 4x^{2} \\cdot 2y^{3} \\qquad -12x^{4} = 4x^{2} \\cdot (-3x^{2})$$

> **注意。** 某个单项式不含的变量要去掉：$4x^{2}y^{3}$ 不能整除 $-12x^{4}$。每个变量取较小的指数，不是较大的。即使有单项式是负的，最大公因式也取正的 $4x^{2}$，不是 $-4x^{2}$。`,
      ),
      generate(rng) {
        const g = rng.int(1, 9);
        const [a, b] = coprimeMultiples(rng, g, 2);
        let i: number;
        let k: number;
        do {
          i = rng.int(1, 6);
          k = rng.int(1, 6);
        } while (i === k && rng.bool(0.8));
        const j = rng.bool(0.25) ? 0 : rng.int(1, 5);
        const l = j === 0 ? rng.int(1, 5) : rng.bool(0.2) ? 0 : rng.int(1, 5);
        const s = rng.bool(0.25) ? -1 : 1;
        const ms = rng.shuffle([term(s * a!, i, j), term(b!, k, l)]);
        const gcf = gcfOf(ms);
        return expandProblem({
          prompt: t(
            `Find the greatest common factor of $${mono(ms[0]!)}$ and $${mono(ms[1]!)}$.`,
            `求 $${mono(ms[0]!)}$ 和 $${mono(ms[1]!)}$ 的最大公因式。`,
          ),
          answer: mono(gcf),
          wrong: [
            mono(term(g, Math.max(i, k), Math.max(j, l))),
            mono(term(g, gcf.x, Math.max(j, l))),
            mono(term(-g, gcf.x, gcf.y)),
            mono(term(g, gcf.x)),
          ],
          solution: gcfSolution(ms),
        });
      },
    },
    {
      id: "three-monomials",
      title: t("Three monomials", "三个单项式"),
      explanation: t(
        `For three monomials, the GCF has to divide all three. Take the greatest common factor of the three coefficients and, for each variable that is in all three, its smallest exponent. For $6x^{4}y^{2}$, $9x^{2}y^{5}$ and $15x^{3}y$: the coefficients $6$, $9$ and $15$ share $3$; the smallest power of $x$ is $x^{2}$, and of $y$ it is $y$. So the GCF is $3x^{2}y$:

$$6x^{4}y^{2} = 3x^{2}y \\cdot 2x^{2}y \\qquad 9x^{2}y^{5} = 3x^{2}y \\cdot 3y^{4} \\qquad 15x^{3}y = 3x^{2}y \\cdot 5x$$

> **Watch out.** The GCF of the first two monomials may not divide the third: $6x^{4}y^{2}$ and $9x^{2}y^{5}$ share $3x^{2}y^{2}$, but $y^{2}$ does not divide $15x^{3}y$. Look at all three at once, and take the smallest exponents, not the largest. Do not forget the variables: the coefficient alone, $3$, is a common factor but not the greatest.`,
        `三个单项式的最大公因式必须同时整除这三个单项式。取三个系数的最大公因数，对三个单项式都含有的每个变量取最小的指数。对 $6x^{4}y^{2}$、$9x^{2}y^{5}$ 和 $15x^{3}y$：系数 $6$、$9$、$15$ 的公因数是 $3$；$x$ 的最小次幂是 $x^{2}$，$y$ 的是 $y$。所以最大公因式是 $3x^{2}y$：

$$6x^{4}y^{2} = 3x^{2}y \\cdot 2x^{2}y \\qquad 9x^{2}y^{5} = 3x^{2}y \\cdot 3y^{4} \\qquad 15x^{3}y = 3x^{2}y \\cdot 5x$$

> **注意。** 前两个单项式的最大公因式不一定能整除第三个：$6x^{4}y^{2}$ 和 $9x^{2}y^{5}$ 的最大公因式是 $3x^{2}y^{2}$，但 $y^{2}$ 不能整除 $15x^{3}y$。要同时看三个，取最小的指数而不是最大的。也不要漏掉变量：只取系数 $3$ 是公因式，但不是最大的。`,
      ),
      generate(rng) {
        const g = rng.int(1, 6);
        const cs = coprimeMultiples(rng, g, 3);
        const ms = cs.map((c) => term(c, rng.int(1, 6), rng.bool(0.15) ? 0 : rng.int(1, 5)));
        const gcf = gcfOf(ms);
        const firstTwo = gcfOf(ms.slice(0, 2));
        return expandProblem({
          prompt: t(
            `Find the greatest common factor of $${mono(ms[0]!)}$, $${mono(ms[1]!)}$ and $${mono(ms[2]!)}$.`,
            `求 $${mono(ms[0]!)}$、$${mono(ms[1]!)}$ 和 $${mono(ms[2]!)}$ 的最大公因式。`,
          ),
          answer: mono(gcf),
          wrong: [mono(firstTwo), mono(term(g, Math.max(...ms.map((m) => m.x)), Math.max(...ms.map((m) => m.y)))), mono(term(g))],
          solution: gcfSolution(ms),
        });
      },
    },
  ],
};

/** polynomialTopics are the topics of the polynomials unit, in teaching order. */
export const polynomialTopics: readonly TopicDef[] = [
  introductionToPolynomials,
  degreeOfAPolynomial,
  simplifyingPolynomials,
  distributiveLawForPolynomials,
  addingAndSubtractingPolynomials,
  monomialsBinomialsAndTrinomials,
  multiplyingBinomials,
  multiplyingPolynomials,
  squaringBinomials,
  expandingBinomialsUsingPascalsTriangle,
  differenceOfSquaresFormula,
  greatestCommonFactorOfMonomials,
];
