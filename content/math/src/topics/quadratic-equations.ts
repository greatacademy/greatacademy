import type { Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Coefficient, gcd, linear, num, poly, Q, type Surd, simplifyRadical, surd, surdLatex } from "@ga/subject-math";

import { choiceProblem, equationProblem, numberProblem, pointProblem, solutionsProblem, steps, yesNo } from "../problems.ts";

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** quad writes ax² + bx + c in the variable v. */
const quad = (a: Coefficient, b: Coefficient, c: Coefficient, v = "x") => poly([a, `${v}^{2}`], [b, v], [c, ""]);

/** lf writes the factor (px + q). */
const lf = (p: Coefficient, q: Coefficient, v = "x") => `(${linear(p, q, v)})`;

/** front writes a constant factor before parentheses: "", "-" or "3". */
const front = (k: number) => (k === 1 ? "" : k === -1 ? "-" : String(k));

/** tail writes a constant added after an expression: "", " + 3" or " - \frac{1}{2}". */
function tail(c: Coefficient): string {
  const v = toQ(c);
  return v.isZero() ? "" : v.sign() < 0 ? ` - ${num(v.neg())}` : ` + ${num(v)}`;
}

/** isSquare tells whether n is the square of an integer. */
const isSquare = (n: number) => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

/** sqrtSurd is √k for a rational k ≥ 0, in simplest form. */
function sqrtSurd(k: Q): Surd {
  if (k.isZero()) return surd(Q.zero);
  const [c, m] = simplifyRadical(Number(k.n * k.d));
  return surd(Q.zero, Q.of(c, k.d), BigInt(m));
}

/** pm lists center ± root in simplest form; one value when the root is 0. */
function pm(center: Q, root: Surd): string[] {
  if (root.m === 1n) {
    if (root.a.isZero()) return [num(center)];
    return [num(center.add(root.a)), num(center.sub(root.a))];
  }
  return [surdLatex(surd(center, root.b, root.m)), surdLatex(surd(center, root.b.neg(), root.m))];
}

/** rootsOf lists the real solutions of ax² + bx + c = 0 in simplest form. */
function rootsOf(a: number, b: number, c: number): string[] {
  const d = b * b - 4 * a * c;
  if (d < 0) return [];
  return pm(Q.of(-b, 2 * a), sqrtSurd(Q.of(d, 4 * a * a)));
}

/** pmLatex writes center ± root as a learner would: "-3 \\pm 2\\sqrt{2}", "\\frac{5 \\pm \\sqrt{13}}{2}", "\\pm 4". */
function pmLatex(center: Q, root: Surd): string {
  if (root.m === 1n) {
    if (root.a.isZero()) return num(center);
    return `${center.isZero() ? "" : `${num(center)} `}\\pm ${num(root.a.abs())}`;
  }
  const b = root.b.abs();
  const d = (center.d * b.d) / gcdBig(center.d, b.d);
  const p = (center.n * d) / center.d;
  const k = (b.n * d) / b.d;
  const rad = `${k === 1n ? "" : k}\\sqrt{${root.m}}`;
  if (d === 1n) return `${p === 0n ? "" : `${p} `}\\pm ${rad}`;
  return p === 0n ? `\\pm\\frac{${rad}}{${d}}` : `\\frac{${p} \\pm ${rad}}{${d}}`;
}

function gcdBig(a: bigint, b: bigint): bigint {
  let [x, y] = [a, b];
  while (y !== 0n) [x, y] = [y, x % y];
  return x;
}

/** solved writes a solution set in words: "$x = 2$ or $x = -3$", "$x = 5$", or that there is no real solution. */
function solved(values: readonly string[], v = "x"): Text {
  if (values.length === 0) return t("there is no real solution", "没有实数解");
  const en = values.map((x) => `$${v} = ${x}$`).join(" or ");
  const zh = values.map((x) => `$${v} = ${x}$`).join(" 或 ");
  return t(en, zh);
}

/** solvePrompt asks to solve an equation, optionally by a given method. */
function solvePrompt(eq: string, method?: Text): Text {
  return method ? t(`Solve $${eq}$ ${method.en}.`, `${method["zh-CN"]}解方程 $${eq}$。`) : t(`Solve $${eq}$.`, `解方程 $${eq}$。`);
}

const byFactoring = t("by factoring", "用因式分解法");
const byCompleting = t("by completing the square", "用配方法");
const byFormula = t("using the quadratic formula", "用求根公式");

/** drawRoots draws two distinct nonzero integer roots r and s with r + s ≠ 0. */
function drawRoots(rng: Rng, max = 10): [number, number] {
  let r: number;
  let s: number;
  do {
    r = rng.nonZero(-max, max);
    s = rng.nonZero(-max, max);
  } while (r === s || r + s === 0);
  return [r, s];
}

/** drawBinomials draws (px + q)(rx + s) with each factor primitive, p·r ≥ 2 and two distinct roots. */
function drawBinomials(rng: Rng, max = 9): [number, number, number, number] {
  let p: number;
  let q: number;
  let r: number;
  let s: number;
  do {
    p = rng.int(1, 5);
    r = rng.int(1, 5);
    q = rng.nonZero(-max, max);
    s = rng.nonZero(-max, max);
  } while (gcd(p, q) !== 1 || gcd(r, s) !== 1 || p * r < 2 || p * s + q * r === 0 || p * s === q * r);
  return [p, q, r, s];
}

export const introductionToQuadraticEquations: TopicDef = {
  id: "introduction-to-quadratic-equations",
  title: t("Introduction to Quadratic Equations", "一元二次方程简介"),
  summary: t(
    "Recognize quadratic equations, write them in standard form and check solutions.",
    "识别一元二次方程，把它写成一般形式，并检验解。",
  ),
  prerequisites: ["distributive-law-for-polynomials", "equations-with-variables-on-both-sides"],
  encompasses: [
    { topic: "simplifying-polynomials", weight: 0.3 },
    { topic: "evaluating-expressions", weight: 0.2 },
  ],
  xp: 10,
  standards: ["CCSS.HSA.REI.B.4"],
  knowledgePoints: [
    {
      id: "identifying",
      title: t("Recognizing quadratic equations", "识别一元二次方程"),
      explanation: t(
        "A **quadratic equation** is an equation that can be written in the **standard form**\n\n$$ax^{2} + bx + c = 0 \\qquad a \\ne 0$$\n\nAfter expanding and moving every term to one side, the highest power of $x$ must be exactly $2$. So $2x(x - 3) = 5$ is quadratic, since it becomes $2x^{2} - 6x - 5 = 0$. But $x^{2} + 3x = x^{2} - 5$ is not: the $x^{2}$ terms cancel and leave the linear equation $3x + 5 = 0$. An equation with $x^{3}$ is not quadratic either.",
        "**一元二次方程**是可以写成**一般形式**\n\n$$ax^{2} + bx + c = 0 \\qquad a \\ne 0$$\n\n的方程。展开并把所有项移到一边后，$x$ 的最高次幂必须恰好是 $2$。所以 $2x(x - 3) = 5$ 是一元二次方程，因为它化为 $2x^{2} - 6x - 5 = 0$。但 $x^{2} + 3x = x^{2} - 5$ 不是：$x^{2}$ 项相互抵消，剩下一元一次方程 $3x + 5 = 0$。含 $x^{3}$ 的方程也不是一元二次方程。",
      ),
      generate(rng) {
        const kind = rng.pick(["standard", "product", "linear", "cancel", "cubic"] as const);
        const a = rng.nonZero(-6, 6);
        const b = rng.int(-9, 9);
        const c = rng.nonZero(-12, 12);
        const n = rng.nonZero(-9, 9);
        let eq: string;
        let why: Text;
        switch (kind) {
          case "standard":
            eq = `${quad(a, b, 0)} = ${c}`;
            why = t(
              `It becomes $${quad(a, b, -c)} = 0$ with $a = ${a} \\ne 0$.`,
              `它化为 $${quad(a, b, -c)} = 0$，其中 $a = ${a} \\ne 0$。`,
            );
            break;
          case "product":
            eq = `${front(a)}x${lf(1, n)} = ${c}`;
            why = t(
              `Expanding gives $${quad(a, a * n, -c)} = 0$, with an $x^{2}$ term.`,
              `展开得 $${quad(a, a * n, -c)} = 0$，含有 $x^{2}$ 项。`,
            );
            break;
          case "linear":
            eq = `${linear(a, b)} = ${c}`;
            why = t("The highest power of $x$ is $1$: the equation is linear.", "$x$ 的最高次幂是 $1$：这是一元一次方程。");
            break;
          case "cancel":
            eq = `${quad(1, n, 0)} = ${quad(1, 0, c)}`;
            why = t(
              `Subtracting $x^{2}$ from both sides leaves $${linear(n, -c)} = 0$, a linear equation.`,
              `两边同时减去 $x^{2}$，剩下 $${linear(n, -c)} = 0$，是一元一次方程。`,
            );
            break;
          case "cubic":
            eq = `${poly([a, "x^{3}"], [b, "x"])} = ${c}`;
            why = t("The highest power of $x$ is $3$, not $2$.", "$x$ 的最高次幂是 $3$，不是 $2$。");
            break;
        }
        const yes = kind === "standard" || kind === "product";
        return choiceProblem({
          prompt: t(`Is $${eq}$ a quadratic equation?`, `$${eq}$ 是一元二次方程吗？`),
          options: yesNo,
          correct: yes ? 0 : 1,
          solution: t(`${yes ? "Yes" : "No"}. ${why.en}`, `${yes ? "是" : "不是"}。${why["zh-CN"]}`),
        });
      },
    },
    {
      id: "standard-form",
      title: t("Writing a quadratic equation in standard form", "化为一般形式"),
      explanation: t(
        "To write an equation in standard form, expand any products, then subtract every term on the right side from both sides, changing its sign, and combine like terms:\n\n$$3x^{2} - 5 = 2x(x - 1) + 4$$\n\n$$3x^{2} - 5 = 2x^{2} - 2x + 4$$\n\n$$3x^{2} - 2x^{2} + 2x - 5 - 4 = 0 \\quad\\Rightarrow\\quad x^{2} + 2x - 9 = 0$$\n\nSo $a = 1$, $b = 2$ and $c = -9$. A missing term has coefficient $0$.",
        "化为一般形式时，先展开乘积，再把右边的每一项移到左边（即两边同时减去它，符号改变），合并同类项：\n\n$$3x^{2} - 5 = 2x(x - 1) + 4$$\n\n$$3x^{2} - 5 = 2x^{2} - 2x + 4$$\n\n$$3x^{2} - 2x^{2} + 2x - 5 - 4 = 0 \\quad\\Rightarrow\\quad x^{2} + 2x - 9 = 0$$\n\n所以 $a = 1$，$b = 2$，$c = -9$。缺少的项系数为 $0$。",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        let r: number;
        let ra: number;
        let rb: number;
        let rc: number;
        let right: string;
        let expanded: string | undefined;
        const kind = rng.pick(["linear", "quadratic", "product"] as const);
        do {
          p = rng.nonZero(-6, 6);
          q = rng.int(-9, 9);
          r = rng.int(-12, 12);
          if (kind === "linear") {
            ra = 0;
            rb = rng.nonZero(-9, 9);
            rc = rng.int(-12, 12);
            right = linear(rb, rc);
          } else if (kind === "quadratic") {
            ra = rng.nonZero(-5, 5);
            rb = rng.bool() ? 0 : rng.nonZero(-9, 9);
            rc = rng.nonZero(-12, 12);
            right = quad(ra, rb, rc);
          } else {
            ra = rng.nonZero(-4, 4);
            const n = rng.nonZero(-6, 6);
            rb = ra * n;
            rc = rng.bool() ? 0 : rng.nonZero(-9, 9);
            right = `${front(ra)}x${lf(1, n)}${tail(rc)}`;
            expanded = quad(ra, rb, rc);
          }
        } while (p === ra || (q === rb && r === rc));
        const a = p - ra;
        const b = q - rb;
        const c = r - rc;
        const target = rng.pick(["a", "b", "b", "c", "c"] as const);
        const answer = { a, b, c }[target];
        const wrongSum = { a: p + ra, b: q + rb, c: r + rc }[target];
        const original = { a: p, b: q, c: r }[target];
        const left = quad(p, q, r);
        const lines = [`${left} = ${right}`, ...(expanded ? [`${left} = ${expanded}`] : []), `${quad(a, b, c)} = 0`];
        return numberProblem({
          prompt: t(
            `Write $${left} = ${right}$ in the form $ax^{2} + bx + c = 0$ by moving every term to the left side. What is $${target}$?`,
            `把所有项移到左边，将 $${left} = ${right}$ 写成 $ax^{2} + bx + c = 0$ 的形式。$${target}$ 是多少？`,
          ),
          answer,
          wrong: [wrongSum, -answer, original],
          solution: t(
            `Subtract each term of the right side from both sides and combine like terms:${steps(...lines)}So $${target} = ${answer}$.`,
            `两边同时减去右边的每一项，合并同类项：${steps(...lines)}所以 $${target} = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "checking-solutions",
      title: t("Checking solutions", "检验解"),
      explanation: t(
        "A **solution** of an equation is a value of $x$ that makes it true. To check a value, substitute it for every $x$ and evaluate. For $x^{2} - 5x + 6 = 0$:\n\n$$x = 3: \\quad 3^{2} - 5(3) + 6 = 9 - 15 + 6 = 0 \\quad \\checkmark$$\n\n$$x = -3: \\quad (-3)^{2} - 5(-3) + 6 = 9 + 15 + 6 = 30 \\ne 0$$\n\nPut a negative value in parentheses, so that it is squared together with its sign.",
        "方程的**解**是使方程成立的 $x$ 的值。检验一个值时，把它代入每一个 $x$ 并计算。对 $x^{2} - 5x + 6 = 0$：\n\n$$x = 3: \\quad 3^{2} - 5(3) + 6 = 9 - 15 + 6 = 0 \\quad \\checkmark$$\n\n$$x = -3: \\quad (-3)^{2} - 5(-3) + 6 = 9 + 15 + 6 = 30 \\ne 0$$\n\n代入负数时要加括号，使它连同符号一起平方。",
      ),
      generate(rng) {
        const [r, s] = drawRoots(rng, 9);
        const k = rng.pick([1, 1, 1, 2, -1]);
        const a = k;
        const b = -k * (r + s);
        const c = k * r * s;
        const eq = `${quad(a, b, c)} = 0`;
        const root = rng.bool() ? r : s;
        const others = [-r, -s, r + s, root + 1, root - 1, 2 * root, 0].filter((v) => v !== r && v !== s);
        const decoys = rng.sample([...new Set(others)], 3);
        const values = [...decoys, root].sort((x, y) => x - y);
        const value = (v: number) => (v < 0 ? `(${v})` : String(v));
        const term = (k: number, power: string, first: boolean) => {
          if (k === 0) return "";
          const coef = Math.abs(k) === 1 ? "" : `${Math.abs(k)} \\cdot `;
          const sign = k < 0 ? (first ? "-" : " - ") : first ? "" : " + ";
          return `${sign}${coef}${value(root)}${power}`;
        };
        const sub = `${term(a, "^{2}", true)}${term(b, "", false)}${tail(c)}`;
        return choiceProblem({
          prompt: t(`Which value of $x$ is a solution of $${eq}$?`, `下列哪个 $x$ 的值是方程 $${eq}$ 的解？`),
          options: values.map((v) => same(`$x = ${v}$`)),
          correct: values.indexOf(root),
          solution: t(
            `Substitute $x = ${root}$:${steps(`${sub} = 0`)}The other values do not give $0$.`,
            `代入 $x = ${root}$：${steps(`${sub} = 0`)}其他值代入后都不等于 $0$。`,
          ),
        });
      },
    },
  ],
};

export const solvingPerfectSquareQuadraticEquations: TopicDef = {
  id: "solving-perfect-square-quadratic-equations",
  title: t("Solving Perfect Square Quadratic Equations", "解完全平方型一元二次方程"),
  summary: t(
    "Solve $x^{2} = k$ and $(x + h)^{2} = k$ by taking square roots, including equations with one or no solutions.",
    "通过开平方解 $x^{2} = k$ 和 $(x + h)^{2} = k$，包括只有一个解或没有解的方程。",
  ),
  prerequisites: ["introduction-to-quadratic-equations", "solving-equations-with-square-roots"],
  encompasses: [{ topic: "solving-equations-with-square-roots", weight: 0.8 }],
  xp: 16,
  standards: ["CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "square-equals-a-number",
      title: t("Solving $x^{2} = k$", "解 $x^{2} = k$"),
      explanation: t(
        "If $x^{2} = k$ with $k > 0$, then $x$ is a number whose square is $k$. There are two: $x = \\sqrt{k}$ and $x = -\\sqrt{k}$, written together as $x = \\pm\\sqrt{k}$.\n\n$$x^{2} = 49 \\Rightarrow x = \\pm 7 \\qquad x^{2} = 12 \\Rightarrow x = \\pm\\sqrt{12} = \\pm 2\\sqrt{3}$$\n\nFirst isolate $x^{2}$: $3x^{2} - 5 = 70$ gives $3x^{2} = 75$, $x^{2} = 25$ and $x = \\pm 5$. Forgetting the negative solution is the most common mistake.",
        "如果 $x^{2} = k$ 且 $k > 0$，那么 $x$ 是平方等于 $k$ 的数。这样的数有两个：$x = \\sqrt{k}$ 和 $x = -\\sqrt{k}$，合写为 $x = \\pm\\sqrt{k}$。\n\n$$x^{2} = 49 \\Rightarrow x = \\pm 7 \\qquad x^{2} = 12 \\Rightarrow x = \\pm\\sqrt{12} = \\pm 2\\sqrt{3}$$\n\n先把 $x^{2}$ 单独留在一边：$3x^{2} - 5 = 70$ 得 $3x^{2} = 75$，$x^{2} = 25$，$x = \\pm 5$。漏掉负数解是最常见的错误。",
      ),
      generate(rng) {
        const kind = rng.pick(["square", "surd", "isolate", "fraction"] as const);
        let k: Q;
        let eq: string;
        let isolate: string | undefined;
        let slip: Q | undefined;
        if (kind === "square") {
          const n = rng.int(1, 15);
          k = Q.of(n * n);
          eq = `x^{2} = ${n * n}`;
        } else if (kind === "surd") {
          let m: number;
          do m = rng.int(2, 75);
          while (isSquare(m));
          k = Q.of(m);
          eq = `x^{2} = ${m}`;
        } else if (kind === "fraction") {
          let p: number;
          let q: number;
          do {
            p = rng.int(1, 9);
            q = rng.int(2, 7);
          } while (gcd(p, q) !== 1);
          k = Q.of(p * p, q * q);
          eq = `${q * q}x^{2} = ${p * p}`;
          isolate = `x^{2} = ${num(k)}`;
        } else {
          const a = rng.int(2, 5);
          const n = rng.int(1, 9);
          const c = rng.nonZero(-20, 20);
          k = Q.of(n * n);
          eq = `${a}x^{2}${tail(c)} = ${a * n * n + c}`;
          isolate = `${a}x^{2} = ${a * n * n}, \\quad x^{2} = ${n * n}`;
          slip = Q.of(a * n * n + 2 * c, a);
        }
        const root = sqrtSurd(k);
        const values = pm(Q.zero, root);
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [[values[0]!], [num(k), num(k.neg())], ...(slip && slip.sign() > 0 ? [pm(Q.zero, sqrtSurd(slip))] : [])],
          solution: t(
            `${isolate ? "Isolate $x^{2}$, then take" : "Take"} the square root of both sides, remembering the negative root:${steps(...(isolate ? [isolate] : []), `x = \\pm\\sqrt{${num(k)}} = ${pmLatex(Q.zero, root)}`)}`,
            `${isolate ? "先把 $x^{2}$ 单独留在一边，再" : ""}两边开平方，不要漏掉负的平方根：${steps(...(isolate ? [isolate] : []), `x = \\pm\\sqrt{${num(k)}} = ${pmLatex(Q.zero, root)}`)}`,
          ),
        });
      },
    },
    {
      id: "square-of-a-binomial",
      title: t("Solving $(x + h)^{2} = k$", "解 $(x + h)^{2} = k$"),
      explanation: t(
        "When a whole binomial is squared, take square roots first, then solve the two linear equations:\n\n$$(x - 3)^{2} = 25 \\Rightarrow x - 3 = \\pm 5 \\Rightarrow x = 3 \\pm 5, \\text{ so } x = 8 \\text{ or } x = -2$$\n\nWhen $k$ is not a perfect square, leave the root in simplest form: $(x + 1)^{2} = 8$ gives $x + 1 = \\pm 2\\sqrt{2}$, so $x = -1 \\pm 2\\sqrt{2}$. Isolate the square first: $2(x + 1)^{2} - 3 = 13$ gives $(x + 1)^{2} = 8$.",
        "整个二项式被平方时，先开平方，再解两个一次方程：\n\n$$(x - 3)^{2} = 25 \\Rightarrow x - 3 = \\pm 5 \\Rightarrow x = 3 \\pm 5, \\text{ 即 } x = 8 \\text{ 或 } x = -2$$\n\n当 $k$ 不是完全平方数时，根式化为最简：$(x + 1)^{2} = 8$ 得 $x + 1 = \\pm 2\\sqrt{2}$，所以 $x = -1 \\pm 2\\sqrt{2}$。先把平方项单独留在一边：$2(x + 1)^{2} - 3 = 13$ 得 $(x + 1)^{2} = 8$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-9, 9);
        let k: number;
        if (rng.bool(0.5)) k = rng.int(1, 10) ** 2;
        else {
          do k = rng.int(2, 50);
          while (isSquare(k));
        }
        const withCoef = rng.bool(0.35);
        const a = withCoef ? rng.int(2, 4) : 1;
        const c = withCoef ? rng.nonZero(-15, 15) : 0;
        const sq = `(${linear(1, h)})^{2}`;
        const eq = `${front(a)}${sq}${tail(c)} = ${a * k + c}`;
        const root = sqrtSurd(Q.of(k));
        const values = pm(Q.of(-h), root);
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [pm(Q.of(h), root), [values[0]!], pm(Q.of(-h), surd(Q.of(k)))],
          solution: t(
            `${withCoef ? "Isolate the square, then take" : "Take"} square roots of both sides, then solve for $x$:${steps(...(withCoef ? [`${front(a)}${sq} = ${a * k}, \\quad ${sq} = ${k}`] : []), `${linear(1, h)} = \\pm\\sqrt{${k}}`, `x = ${pmLatex(Q.of(-h), root)}`)}So ${solved(values).en}.`,
            `${withCoef ? "先把平方项单独留在一边，再" : ""}两边开平方，再解出 $x$：${steps(...(withCoef ? [`${front(a)}${sq} = ${a * k}, \\quad ${sq} = ${k}`] : []), `${linear(1, h)} = \\pm\\sqrt{${k}}`, `x = ${pmLatex(Q.of(-h), root)}`)}所以 ${solved(values)["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "number-of-solutions",
      title: t("How many solutions?", "有几个解？"),
      explanation: t(
        "A square is never negative. After isolating the square, $(x + h)^{2} = k$ has\n\n- **two** solutions when $k > 0$: $x = -h \\pm \\sqrt{k}$;\n- **one** solution when $k = 0$: $x + h = 0$, so $x = -h$;\n- **no** real solution when $k < 0$, since no real number squared is negative.\n\nSo $(x - 4)^{2} = 0$ has the single solution $x = 4$, and $-2(x + 1)^{2} + 3 = 11$, which gives $(x + 1)^{2} = -4$, has none.",
        "平方不可能是负数。把平方项单独留在一边后，$(x + h)^{2} = k$：\n\n- 当 $k > 0$ 时有**两个**解：$x = -h \\pm \\sqrt{k}$；\n- 当 $k = 0$ 时有**一个**解：$x + h = 0$，即 $x = -h$；\n- 当 $k < 0$ 时**没有**实数解，因为实数的平方不可能是负数。\n\n所以 $(x - 4)^{2} = 0$ 只有一个解 $x = 4$；而 $-2(x + 1)^{2} + 3 = 11$ 化为 $(x + 1)^{2} = -4$，没有实数解。",
      ),
      generate(rng) {
        const kind = rng.pick(["two", "one", "none"] as const);
        const h = rng.int(-9, 9);
        const k = kind === "two" ? rng.int(1, 30) : kind === "one" ? 0 : -rng.int(1, 30);
        const a = rng.pick([1, 1, 2, 3, -1, -2, -3]);
        const c = rng.bool(0.6) ? rng.nonZero(-15, 15) : 0;
        const base = h === 0 ? "x^{2}" : `(${linear(1, h)})^{2}`;
        const eq = `${front(a)}${base}${tail(c)} = ${a * k + c}`;
        const options = [t("No real solution", "没有实数解"), t("Exactly one solution", "恰有一个解"), t("Two solutions", "两个解")];
        const correct = kind === "none" ? 0 : kind === "one" ? 1 : 2;
        return choiceProblem({
          prompt: t(`How many real solutions does $${eq}$ have?`, `方程 $${eq}$ 有几个实数解？`),
          options,
          correct,
          solution: t(
            `Isolate the square: $${base} = ${k}$. ${k > 0 ? "A positive number has two square roots, so there are two solutions." : k === 0 ? `Only $0$ squares to $0$, so $${linear(1, h)} = 0$ and there is exactly one solution.` : "No real number squared is negative, so there is no real solution."}`,
            `把平方项单独留在一边：$${base} = ${k}$。${k > 0 ? "正数有两个平方根，所以有两个解。" : k === 0 ? `只有 $0$ 的平方是 $0$，所以 $${linear(1, h)} = 0$，恰有一个解。` : "实数的平方不可能是负数，所以没有实数解。"}`,
          ),
        });
      },
    },
    {
      id: "one-or-no-solutions",
      title: t("Equations with one or no solutions", "只有一个解或没有解的方程"),
      explanation: t(
        "Solve as before, but look at the sign of the number the square equals before taking roots. Write the empty set $\\varnothing$ when there is no real solution:\n\n$$3(x - 2)^{2} + 7 = 7 \\Rightarrow (x - 2)^{2} = 0 \\Rightarrow x = 2$$\n\n$$x^{2} + 9 = 0 \\Rightarrow x^{2} = -9 \\Rightarrow \\varnothing$$",
        "照常求解，但开平方之前先看平方项等于的数的符号。没有实数解时写空集 $\\varnothing$：\n\n$$3(x - 2)^{2} + 7 = 7 \\Rightarrow (x - 2)^{2} = 0 \\Rightarrow x = 2$$\n\n$$x^{2} + 9 = 0 \\Rightarrow x^{2} = -9 \\Rightarrow \\varnothing$$",
      ),
      generate(rng) {
        const kind = rng.pick(["one", "one", "none", "none", "two"] as const);
        const h = rng.int(-9, 9);
        const k = kind === "two" ? rng.int(1, 8) ** 2 : kind === "one" ? 0 : -rng.int(1, 30);
        const a = rng.pick([1, 1, 2, 3, -1, -2]);
        const c = rng.bool(0.6) ? rng.nonZero(-12, 12) : 0;
        const base = h === 0 ? "x^{2}" : `(${linear(1, h)})^{2}`;
        const eq = `${front(a)}${base}${tail(c)} = ${a * k + c}`;
        const values = k < 0 ? [] : pm(Q.of(-h), sqrtSurd(Q.of(k)));
        const wrong: string[][] =
          k < 0
            ? [pm(Q.of(-h), sqrtSurd(Q.of(-k))), [num(-h)]]
            : k === 0
              ? [[num(h)], ...(h === 0 ? [] : [[num(-h), num(h)]]), []]
              : [[], [values[0]!]];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong,
          solution: t(
            `Isolate the square: $${base} = ${k}$. ${k < 0 ? "A square cannot be negative, so there is no real solution: $\\varnothing$." : k === 0 ? `Only $0$ squares to $0$, so $${h === 0 ? "x" : linear(1, h)} = 0$ and $x = ${-h}$.` : `So $${h === 0 ? "x" : linear(1, h)} = \\pm ${Math.sqrt(k)}$, and ${solved(values).en}.`}`,
            `把平方项单独留在一边：$${base} = ${k}$。${k < 0 ? "平方不可能是负数，所以没有实数解：$\\varnothing$。" : k === 0 ? `只有 $0$ 的平方是 $0$，所以 $${h === 0 ? "x" : linear(1, h)} = 0$，$x = ${-h}$。` : `所以 $${h === 0 ? "x" : linear(1, h)} = \\pm ${Math.sqrt(k)}$，${solved(values)["zh-CN"]}。`}`,
          ),
        });
      },
    },
  ],
};

export const zeroProductRule: TopicDef = {
  id: "zero-product-rule",
  title: t("The Zero Product Rule", "零乘积法则"),
  summary: t(
    "Solve equations of the form $(x - r)(x - s) = 0$: a product is zero only when a factor is zero.",
    "解形如 $(x - r)(x - s) = 0$ 的方程：乘积为零当且仅当某个因式为零。",
  ),
  prerequisites: ["introduction-to-quadratic-equations"],
  encompasses: [{ topic: "two-step-equations", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "two-factors",
      title: t("Two linear factors", "两个一次因式"),
      explanation: t(
        "The **zero product rule**: if $AB = 0$, then $A = 0$ or $B = 0$. So a product of factors equals zero exactly when one of the factors does.\n\n$$(x - 3)(x + 5) = 0 \\Rightarrow x - 3 = 0 \\text{ or } x + 5 = 0 \\Rightarrow x = 3 \\text{ or } x = -5$$\n\nEach solution has the opposite sign of the number in its factor. The rule needs $0$ on one side: $(x - 3)(x + 5) = 7$ does not mean $x - 3 = 7$.",
        "**零乘积法则**：如果 $AB = 0$，那么 $A = 0$ 或 $B = 0$。所以几个因式的积等于零，当且仅当其中某个因式等于零。\n\n$$(x - 3)(x + 5) = 0 \\Rightarrow x - 3 = 0 \\text{ 或 } x + 5 = 0 \\Rightarrow x = 3 \\text{ 或 } x = -5$$\n\n每个解与它所在因式中的数符号相反。这个法则要求一边是 $0$：$(x - 3)(x + 5) = 7$ 并不意味着 $x - 3 = 7$。",
      ),
      generate(rng) {
        const [r, s] = drawRoots(rng, 12);
        const eq = `${lf(1, -r)}${lf(1, -s)} = 0`;
        const values = [num(r), num(s)];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [[num(-r), num(-s)], [num(r)], [num(r), num(-s)]],
          solution: t(
            `Set each factor equal to zero:${steps(`${linear(1, -r)} = 0 \\quad\\text{or}\\quad ${linear(1, -s)} = 0`)}So ${solved(values).en}.`,
            `令每个因式等于零：${steps(`${linear(1, -r)} = 0 \\quad\\text{或}\\quad ${linear(1, -s)} = 0`)}所以 ${solved(values)["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "factors-with-coefficients",
      title: t("Factors with coefficients", "带系数的因式"),
      explanation: t(
        "When a factor has a coefficient, solve the linear equation it gives; the solution may be a fraction. A lone factor $x$ gives the solution $x = 0$.\n\n$$x(2x - 7) = 0 \\Rightarrow x = 0 \\text{ or } 2x - 7 = 0 \\Rightarrow x = 0 \\text{ or } x = \\frac{7}{2}$$",
        "因式带系数时，解它给出的一次方程；解可能是分数。单独的因式 $x$ 给出解 $x = 0$。\n\n$$x(2x - 7) = 0 \\Rightarrow x = 0 \\text{ 或 } 2x - 7 = 0 \\Rightarrow x = 0 \\text{ 或 } x = \\frac{7}{2}$$",
      ),
      generate(rng) {
        const lone = rng.bool(0.3);
        let p: number;
        let q: number;
        let r: number;
        let s: number;
        do {
          p = rng.int(2, 7);
          q = rng.nonZero(-9, 9);
          r = lone ? 1 : rng.int(1, 5);
          s = lone ? 0 : rng.nonZero(-9, 9);
        } while (gcd(p, q) !== 1 || (!lone && gcd(r, s) !== 1) || Q.of(-q, p).eq(Q.of(-s, r)));
        const eq = lone ? `x${lf(p, q)} = 0` : `${lf(p, q)}${lf(r, s)} = 0`;
        const values = [num(Q.of(-s, r)), num(Q.of(-q, p))];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [
            [num(Q.of(s, r)), num(Q.of(q, p))],
            [num(-s), num(-q)],
            [num(Q.of(-s, r)), num(Q.of(-p, q))],
            ...(lone ? [[num(Q.of(-q, p))]] : []),
          ],
          solution: t(
            `Set each factor equal to zero and solve:${steps(`${lone ? "x" : linear(r, s)} = 0 \\quad\\text{or}\\quad ${linear(p, q)} = 0`)}So ${solved(values).en}.`,
            `令每个因式等于零并求解：${steps(`${lone ? "x" : linear(r, s)} = 0 \\quad\\text{或}\\quad ${linear(p, q)} = 0`)}所以 ${solved(values)["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "more-factors",
      title: t("Constant, repeated and extra factors", "常数因数、重复因式与更多因式"),
      explanation: t(
        "The rule works for any number of factors: $x(x - 2)(x + 4) = 0$ has three solutions, $0$, $2$ and $-4$.\n\nA nonzero constant factor gives no solution, since $3 \\ne 0$: $3(x - 1)(x + 6) = 0$ has the solutions $1$ and $-6$ only. A repeated factor gives its solution once: $(x - 5)^{2} = 0$ has the single solution $x = 5$.",
        "法则对任意多个因式都成立：$x(x - 2)(x + 4) = 0$ 有三个解：$0$、$2$ 和 $-4$。\n\n非零的常数因数不给出解，因为 $3 \\ne 0$：$3(x - 1)(x + 6) = 0$ 的解只有 $1$ 和 $-6$。重复的因式只给出一个解：$(x - 5)^{2} = 0$ 只有一个解 $x = 5$。",
      ),
      generate(rng) {
        const kind = rng.pick(["x-factor", "constant", "repeated"] as const);
        const [r, s] = drawRoots(rng, 9);
        const k = rng.int(2, 9);
        let eq: string;
        let values: string[];
        let wrong: string[][];
        if (kind === "x-factor") {
          eq = `${k}x${lf(1, -r)}${lf(1, -s)} = 0`;
          values = ["0", num(r), num(s)];
          wrong = [
            [num(r), num(s)],
            ["0", num(-r), num(-s)],
            [num(k), num(r), num(s)],
          ];
        } else if (kind === "constant") {
          eq = `${k}${lf(1, -r)}${lf(1, -s)} = 0`;
          values = [num(r), num(s)];
          wrong = [
            ["0", num(r), num(s)],
            [num(k), num(r), num(s)],
            [num(-r), num(-s)],
          ];
        } else {
          eq = rng.bool() ? `(${linear(1, -r)})^{2} = 0` : `(${linear(1, -r)})^{2}${lf(1, -s)} = 0`;
          values = eq.endsWith(")^{2} = 0") ? [num(r)] : [num(r), num(s)];
          wrong = [values.length === 1 ? [num(r), num(-r)] : [num(r), num(-r), num(s)], values.map((v) => num(Q.parse(v).neg()))];
        }
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong,
          solution: t(
            `${kind === "constant" ? `The constant factor $${k}$ is never $0$. ` : kind === "repeated" ? "A repeated factor gives the same solution twice, which counts once. " : `The constant $${k}$ is never $0$, but the factor $x$ gives $x = 0$. `}Set each factor containing $x$ equal to zero: ${solved(values).en}.`,
            `${kind === "constant" ? `常数因数 $${k}$ 不可能为 $0$。` : kind === "repeated" ? "重复的因式给出同一个解，只算一次。" : `常数 $${k}$ 不可能为 $0$，但因式 $x$ 给出 $x = 0$。`}令每个含 $x$ 的因式等于零：${solved(values)["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
};

export const solvingQuadraticEquationsUsingADifferenceOfSquares: TopicDef = {
  id: "solving-quadratic-equations-using-a-difference-of-squares",
  title: t("Solving Quadratic Equations Using a Difference of Squares", "用平方差公式解一元二次方程"),
  summary: t(
    "Solve equations such as $x^{2} - 49 = 0$ and $4x^{2} = 9$ by factoring a difference of squares.",
    "通过分解平方差解 $x^{2} - 49 = 0$、$4x^{2} = 9$ 这类方程。",
  ),
  prerequisites: ["zero-product-rule", "factoring-differences-of-squares"],
  encompasses: [
    { topic: "zero-product-rule", weight: 0.5 },
    { topic: "factoring-differences-of-squares", weight: 0.4 },
  ],
  xp: 10,
  standards: ["CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "monic",
      title: t("Solving $x^{2} - a^{2} = 0$", "解 $x^{2} - a^{2} = 0$"),
      explanation: t(
        "Factor the difference of squares, then use the zero product rule:\n\n$$x^{2} - 49 = 0 \\Rightarrow (x + 7)(x - 7) = 0 \\Rightarrow x = -7 \\text{ or } x = 7$$\n\nThe two solutions are opposites, $x = \\pm 7$, the same answer that taking square roots of $x^{2} = 49$ gives.",
        "先分解平方差，再用零乘积法则：\n\n$$x^{2} - 49 = 0 \\Rightarrow (x + 7)(x - 7) = 0 \\Rightarrow x = -7 \\text{ 或 } x = 7$$\n\n两个解互为相反数，即 $x = \\pm 7$，与对 $x^{2} = 49$ 开平方的结果相同。",
      ),
      generate(rng) {
        const a = rng.int(1, 15);
        const v = rng.pick(["x", "y", "t"]);
        const reversed = rng.bool(0.3);
        const eq = reversed ? `${a * a} - ${v}^{2} = 0` : `${v}^{2} - ${a * a} = 0`;
        const factored = reversed ? `(${a} + ${v})(${a} - ${v}) = 0` : `(${v} + ${a})(${v} - ${a}) = 0`;
        const values = [String(a), String(-a)];
        return solutionsProblem({
          prompt: solvePrompt(eq, byFactoring),
          variable: v,
          values,
          wrong: [[String(a)], [String(a * a), String(-a * a)], ...(a % 2 === 0 ? [[String(a / 2), String(-a / 2)]] : [])],
          solution: t(
            `Factor the difference of squares and set each factor equal to zero:${steps(factored)}So ${solved(values, v).en}.`,
            `分解平方差，令每个因式等于零：${steps(factored)}所以 ${solved(values, v)["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "coefficients",
      title: t("Squares with coefficients", "带系数的平方"),
      explanation: t(
        "With a coefficient on $x^{2}$, the solutions may be fractions:\n\n$$9x^{2} - 4 = 0 \\Rightarrow (3x + 2)(3x - 2) = 0 \\Rightarrow x = -\\frac{2}{3} \\text{ or } x = \\frac{2}{3}$$\n\nAn equation such as $9x^{2} = 4$ is solved the same way after subtracting $4$ from both sides.",
        "$x^{2}$ 带系数时，解可能是分数：\n\n$$9x^{2} - 4 = 0 \\Rightarrow (3x + 2)(3x - 2) = 0 \\Rightarrow x = -\\frac{2}{3} \\text{ 或 } x = \\frac{2}{3}$$\n\n$9x^{2} = 4$ 这样的方程，两边减去 $4$ 后同样求解。",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(2, 9);
          q = rng.int(1, 12);
        } while (gcd(p, q) !== 1);
        const eq = rng.bool(0.35) ? `${p * p}x^{2} = ${q * q}` : `${p * p}x^{2} - ${q * q} = 0`;
        const values = [num(Q.of(q, p)), num(Q.of(-q, p))];
        return solutionsProblem({
          prompt: solvePrompt(eq, byFactoring),
          values,
          wrong: [
            [String(q), String(-q)],
            [num(Q.of(p, q)), num(Q.of(-p, q))],
            [num(Q.of(q, p))],
            [num(Q.of(q * q, p * p)), num(Q.of(-q * q, p * p))],
          ],
          solution: t(
            `Write the equation as a difference of squares and factor:${steps(`(${p}x)^{2} - ${q}^{2} = 0`, `${lf(p, q)}${lf(p, -q)} = 0`)}So ${solved(values).en}.`,
            `把方程写成平方差并分解：${steps(`(${p}x)^{2} - ${q}^{2} = 0`, `${lf(p, q)}${lf(p, -q)} = 0`)}所以 ${solved(values)["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "common-factor-first",
      title: t("Common factors and rearranging", "提取公因数与移项"),
      explanation: t(
        "Move every term to one side, then take out any common factor; the constant factor does not give a solution:\n\n$$5x^{2} + 1 = 2x^{2} + 13 \\Rightarrow 3x^{2} - 12 = 0 \\Rightarrow 3(x + 2)(x - 2) = 0 \\Rightarrow x = \\pm 2$$",
        "先把所有项移到一边，再提出公因数；常数因数不给出解：\n\n$$5x^{2} + 1 = 2x^{2} + 13 \\Rightarrow 3x^{2} - 12 = 0 \\Rightarrow 3(x + 2)(x - 2) = 0 \\Rightarrow x = \\pm 2$$",
      ),
      generate(rng) {
        let p: number;
        let q: number;
        do {
          p = rng.int(1, 3);
          q = rng.int(1, 9);
        } while (gcd(p, q) !== 1);
        const k = rng.int(2, 5);
        const rearrange = rng.bool(0.5);
        const b = rng.int(1, 5);
        const c = rng.nonZero(-9, 9);
        const eq = rearrange ? `${quad(b + k * p * p, 0, c)} = ${quad(b, 0, c + k * q * q)}` : `${k * p * p}x^{2} - ${k * q * q} = 0`;
        const values = [num(Q.of(q, p)), num(Q.of(-q, p))];
        const lines = [
          ...(rearrange ? [`${k * p * p}x^{2} - ${k * q * q} = 0`] : []),
          `${k}(${quad(p * p, 0, -q * q)}) = 0`,
          `${k}${lf(p, q)}${lf(p, -q)} = 0`,
        ];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [[num(Q.of(q, p))], [num(Q.of(q * q, p * p)), num(Q.of(-q * q, p * p))], [num(k), num(Q.of(q, p)), num(Q.of(-q, p))]],
          solution: t(
            `${rearrange ? "Move every term to the left side, take" : "Take"} out the common factor $${k}$ and factor:${steps(...lines)}The factor $${k}$ is never zero, so ${solved(values).en}.`,
            `${rearrange ? "把所有项移到左边，" : ""}提出公因数 $${k}$ 并分解：${steps(...lines)}因数 $${k}$ 不为零，所以 ${solved(values)["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
};

export const solvingQuadraticEquationsWithNoConstantTerm: TopicDef = {
  id: "solving-quadratic-equations-with-no-constant-term",
  title: t("Solving Quadratic Equations With No Constant Term", "解不含常数项的一元二次方程"),
  summary: t(
    "Solve $ax^{2} + bx = 0$ by factoring out $x$, without losing the solution $x = 0$.",
    "提出 $x$ 解 $ax^{2} + bx = 0$，不丢掉解 $x = 0$。",
  ),
  prerequisites: ["zero-product-rule", "factoring-polynomials-using-gcfs"],
  encompasses: [
    { topic: "zero-product-rule", weight: 0.5 },
    { topic: "factoring-polynomials-using-gcfs", weight: 0.4 },
  ],
  xp: 10,
  standards: ["CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "monic",
      title: t("Solving $x^{2} + bx = 0$", "解 $x^{2} + bx = 0$"),
      explanation: t(
        "Every term contains $x$, so factor it out:\n\n$$x^{2} - 6x = 0 \\Rightarrow x(x - 6) = 0 \\Rightarrow x = 0 \\text{ or } x = 6$$\n\nDo not divide both sides by $x$: that loses the solution $x = 0$, since dividing by $x$ assumes $x \\ne 0$.",
        "每一项都含有 $x$，所以把它提出来：\n\n$$x^{2} - 6x = 0 \\Rightarrow x(x - 6) = 0 \\Rightarrow x = 0 \\text{ 或 } x = 6$$\n\n不要两边同时除以 $x$：那样会丢掉解 $x = 0$，因为除以 $x$ 已经假定了 $x \\ne 0$。",
      ),
      generate(rng) {
        const b = rng.nonZero(-20, 20);
        const v = rng.pick(["x", "x", "y", "t"]);
        const eq = rng.bool(0.3) ? `${v}^{2} = ${poly([-b, v])}` : `${quad(1, b, 0, v)} = 0`;
        const values = ["0", num(-b)];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          variable: v,
          values,
          wrong: [[num(-b)], ["0", num(b)], [num(b)]],
          solution: t(
            `Write the equation as $${quad(1, b, 0, v)} = 0$ and factor out $${v}$:${steps(`${v}${lf(1, b, v)} = 0`)}So ${solved(values, v).en}.`,
            `把方程写成 $${quad(1, b, 0, v)} = 0$，提出 $${v}$：${steps(`${v}${lf(1, b, v)} = 0`)}所以 ${solved(values, v)["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "leading-coefficients",
      title: t("Solving $ax^{2} + bx = 0$", "解 $ax^{2} + bx = 0$"),
      explanation: t(
        "Factor out $x$, together with any common factor of the coefficients; the second solution may be a fraction:\n\n$$6x^{2} + 9x = 0 \\Rightarrow 3x(2x + 3) = 0 \\Rightarrow x = 0 \\text{ or } x = -\\frac{3}{2}$$",
        "提出 $x$（连同各系数的公因数）；第二个解可能是分数：\n\n$$6x^{2} + 9x = 0 \\Rightarrow 3x(2x + 3) = 0 \\Rightarrow x = 0 \\text{ 或 } x = -\\frac{3}{2}$$",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.pick([2, 3, 4, 5, 6, 8, -2, -3, -4]);
          b = rng.nonZero(-18, 18);
        } while (Q.of(b, a).isInteger() && rng.bool(0.7));
        const g = gcd(a, b) * Math.sign(a);
        const eq = `${quad(a, b, 0)} = 0`;
        const root = Q.of(-b, a);
        const values = ["0", num(root)];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [[num(root)], ["0", num(root.neg())], ["0", num(Q.of(-a, b))], ["0", num(-b)]],
          solution: t(
            `Factor out $${poly([g, "x"])}$:${steps(`${poly([g, "x"])}${lf(a / g, b / g)} = 0`)}So $x = 0$ or $${linear(a / g, b / g)} = 0$, which gives $x = ${num(root)}$.`,
            `提出 $${poly([g, "x"])}$：${steps(`${poly([g, "x"])}${lf(a / g, b / g)} = 0`)}所以 $x = 0$ 或 $${linear(a / g, b / g)} = 0$，后者得 $x = ${num(root)}$。`,
          ),
        });
      },
    },
    {
      id: "rearranging",
      title: t("Rearranging first", "先移项"),
      explanation: t(
        "When $x$ terms are on both sides, move everything to one side so that the other side is $0$, then factor:\n\n$$4x^{2} = 10x \\Rightarrow 4x^{2} - 10x = 0 \\Rightarrow 2x(2x - 5) = 0 \\Rightarrow x = 0 \\text{ or } x = \\frac{5}{2}$$\n\n$$x(x + 3) = 5x \\Rightarrow x^{2} - 2x = 0 \\Rightarrow x = 0 \\text{ or } x = 2$$",
        "当两边都有含 $x$ 的项时，把所有项移到一边，使另一边为 $0$，再分解：\n\n$$4x^{2} = 10x \\Rightarrow 4x^{2} - 10x = 0 \\Rightarrow 2x(2x - 5) = 0 \\Rightarrow x = 0 \\text{ 或 } x = \\frac{5}{2}$$\n\n$$x(x + 3) = 5x \\Rightarrow x^{2} - 2x = 0 \\Rightarrow x = 0 \\text{ 或 } x = 2$$",
      ),
      generate(rng) {
        const kind = rng.pick(["ax2=bx", "both-sides", "product"] as const);
        let a: number;
        let b: number;
        let eq: string;
        if (kind === "ax2=bx") {
          a = rng.int(1, 6);
          const r = rng.nonZero(-15, 15);
          b = -r;
          eq = `${poly([a, "x^{2}"])} = ${poly([r, "x"])}`;
        } else if (kind === "both-sides") {
          a = rng.int(1, 5);
          const c = rng.nonZero(-9, 9);
          let d: number;
          do d = rng.nonZero(-9, 9);
          while (d === c);
          b = c - d;
          const extra = rng.int(0, 3);
          eq = `${quad(a + extra, c, 0)} = ${quad(extra, d, 0)}`;
        } else {
          a = 1;
          const p = rng.nonZero(-9, 9);
          let q: number;
          do q = rng.nonZero(-12, 12);
          while (q === p);
          b = p - q;
          eq = `x${lf(1, p)} = ${poly([q, "x"])}`;
        }
        const root = Q.of(-b, a);
        const values = ["0", num(root)];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [[num(root)], ["0", num(root.neg())]],
          solution: t(
            `Move every term to the left side:${steps(`${quad(a, b, 0)} = 0`, `x${lf(a, b)} = 0`)}So $x = 0$ or $${linear(a, b)} = 0$: ${solved(values).en}.`,
            `把所有项移到左边：${steps(`${quad(a, b, 0)} = 0`, `x${lf(a, b)} = 0`)}所以 $x = 0$ 或 $${linear(a, b)} = 0$：${solved(values)["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
};

/** factoringSolution writes the steps of solving by factoring: the standard form, its factorization, then the solutions. */
function factoringSolution(lines: readonly string[], values: readonly string[], note: Text = t("", "")): Text {
  return t(
    `${note.en}Factor and set each factor equal to zero:${steps(...lines)}So ${solved(values).en}.`,
    `${note["zh-CN"]}分解因式，令每个因式等于零：${steps(...lines)}所以 ${solved(values)["zh-CN"]}。`,
  );
}

export const solvingQuadraticEquationsByFactoring: TopicDef = {
  id: "solving-quadratic-equations-by-factoring",
  title: t("Solving Quadratic Equations by Factoring", "用因式分解法解一元二次方程"),
  summary: t(
    "Solve $x^{2} + bx + c = 0$ by factoring the trinomial and using the zero product rule.",
    "分解三项式并用零乘积法则解 $x^{2} + bx + c = 0$。",
  ),
  prerequisites: ["zero-product-rule", "factoring-trinomials-using-common-factors"],
  encompasses: [
    { topic: "zero-product-rule", weight: 0.6 },
    { topic: "factoring-trinomials", weight: 0.6 },
    { topic: "factoring-trinomials-using-common-factors", weight: 0.3 },
    { topic: "introduction-to-quadratic-equations", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSA.REI.B.4.B", "CCSS.HSA.SSE.B.3.A"],
  knowledgePoints: [
    {
      id: "standard-form",
      title: t("Equations in standard form", "一般形式的方程"),
      explanation: t(
        "With $0$ on one side, factor the trinomial and use the zero product rule:\n\n$$x^{2} - 2x - 15 = 0 \\Rightarrow (x + 3)(x - 5) = 0 \\Rightarrow x = -3 \\text{ or } x = 5$$\n\nCheck a solution by substituting it: $(-3)^{2} - 2(-3) - 15 = 9 + 6 - 15 = 0$.",
        "一边为 $0$ 时，分解三项式并用零乘积法则：\n\n$$x^{2} - 2x - 15 = 0 \\Rightarrow (x + 3)(x - 5) = 0 \\Rightarrow x = -3 \\text{ 或 } x = 5$$\n\n代入检验：$(-3)^{2} - 2(-3) - 15 = 9 + 6 - 15 = 0$。",
      ),
      keyPrerequisites: ["factoring-trinomials"],
      generate(rng) {
        const [r, s] = drawRoots(rng, 12);
        const eq = `${quad(1, -(r + s), r * s)} = 0`;
        const values = [num(r), num(s)];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [[num(-r), num(-s)], [num(r)], [num(r), num(-s)]],
          solution: factoringSolution([`${lf(1, -r)}${lf(1, -s)} = 0`], values),
        });
      },
    },
    {
      id: "rearranging",
      title: t("Rearranging first", "先移项"),
      explanation: t(
        "The zero product rule needs $0$ on one side. Move every term to one side first:\n\n$$x(x + 2) = 15 \\Rightarrow x^{2} + 2x - 15 = 0 \\Rightarrow (x + 5)(x - 3) = 0 \\Rightarrow x = -5 \\text{ or } x = 3$$\n\nSetting $x = 15$ and $x + 2 = 15$ is wrong: two numbers with product $15$ need not be $15$ themselves.",
        "零乘积法则要求一边为 $0$。先把所有项移到一边：\n\n$$x(x + 2) = 15 \\Rightarrow x^{2} + 2x - 15 = 0 \\Rightarrow (x + 5)(x - 3) = 0 \\Rightarrow x = -5 \\text{ 或 } x = 3$$\n\n令 $x = 15$ 且 $x + 2 = 15$ 是错误的：积为 $15$ 的两个数本身不一定是 $15$。",
      ),
      generate(rng) {
        const [r, s] = drawRoots(rng, 10);
        const b = -(r + s);
        const c = r * s;
        const kind = rng.pick(["x2=", "move-c", "product"] as const);
        const eq = kind === "x2=" ? `x^{2} = ${linear(-b, -c)}` : kind === "move-c" ? `${quad(1, b, 0)} = ${-c}` : `x${lf(1, b)} = ${-c}`;
        const values = [num(r), num(s)];
        const wrong: string[][] = [[num(-r), num(-s)], [num(r)]];
        if (kind === "product") wrong.push([num(-c), num(-c - b)]);
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong,
          solution: factoringSolution(
            [`${quad(1, b, c)} = 0`, `${lf(1, -r)}${lf(1, -s)} = 0`],
            values,
            t("Move every term to the left side. ", "把所有项移到左边。"),
          ),
        });
      },
    },
    {
      id: "common-factors-and-repeated-roots",
      title: t("Common factors and repeated solutions", "公因数与重根"),
      explanation: t(
        "Take out a common factor first; a constant factor gives no solution. A perfect square trinomial gives just one solution:\n\n$$2x^{2} - 2x - 24 = 0 \\Rightarrow 2(x + 3)(x - 4) = 0 \\Rightarrow x = -3 \\text{ or } x = 4$$\n\n$$x^{2} - 10x + 25 = 0 \\Rightarrow (x - 5)^{2} = 0 \\Rightarrow x = 5$$",
        "先提出公因数；常数因数不给出解。完全平方三项式只给出一个解：\n\n$$2x^{2} - 2x - 24 = 0 \\Rightarrow 2(x + 3)(x - 4) = 0 \\Rightarrow x = -3 \\text{ 或 } x = 4$$\n\n$$x^{2} - 10x + 25 = 0 \\Rightarrow (x - 5)^{2} = 0 \\Rightarrow x = 5$$",
      ),
      generate(rng) {
        if (rng.bool(0.4)) {
          const r = rng.nonZero(-12, 12);
          const k = rng.pick([1, 1, 2, 3, -1]);
          const eq = `${quad(k, -2 * k * r, k * r * r)} = 0`;
          const values = [num(r)];
          return solutionsProblem({
            prompt: solvePrompt(eq),
            values,
            wrong: [[num(r), num(-r)], [num(-r)]],
            solution: factoringSolution(
              [`${front(k)}(${linear(1, -r)})^{2} = 0`],
              values,
              t("The trinomial is a perfect square. ", "这个三项式是完全平方。"),
            ),
          });
        }
        const [r, s] = drawRoots(rng, 9);
        const k = rng.pick([2, 3, 4, 5, -1, -2, -3]);
        const eq = `${quad(k, -k * (r + s), k * r * s)} = 0`;
        const values = [num(r), num(s)];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [
            [num(-r), num(-s)],
            [num(k), num(r), num(s)],
            ["0", num(r), num(s)],
          ],
          solution: factoringSolution(
            [`${front(k)}(${quad(1, -(r + s), r * s)}) = 0`, `${front(k)}${lf(1, -r)}${lf(1, -s)} = 0`],
            values,
            t(`Take out the common factor $${k}$, which is never zero. `, `提出公因数 $${k}$，它不为零。`),
          ),
        });
      },
    },
  ],
};

export const solvingQuadraticEquationsWithLeadingCoefficientsByFactoring: TopicDef = {
  id: "solving-quadratic-equations-with-leading-coefficients-by-factoring",
  title: t("Solving Quadratic Equations With Leading Coefficients by Factoring", "用因式分解法解首项系数不为 1 的一元二次方程"),
  summary: t("Solve $ax^{2} + bx + c = 0$ by factoring into $(px + q)(rx + s)$.", "分解为 $(px + q)(rx + s)$，解 $ax^{2} + bx + c = 0$。"),
  prerequisites: ["solving-quadratic-equations-by-factoring", "further-factoring-trinomials-with-leading-coefficients"],
  encompasses: [
    { topic: "solving-quadratic-equations-by-factoring", weight: 0.5 },
    { topic: "factoring-trinomials-with-leading-coefficients", weight: 0.6 },
    { topic: "further-factoring-trinomials-with-leading-coefficients", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "standard-form",
      title: t("Equations in standard form", "一般形式的方程"),
      explanation: t(
        "Factor $ax^{2} + bx + c$ (for example with the $ac$ method), then solve each linear factor; the solutions are often fractions:\n\n$$2x^{2} + 5x - 3 = 0 \\Rightarrow (2x - 1)(x + 3) = 0 \\Rightarrow x = \\frac{1}{2} \\text{ or } x = -3$$",
        "分解 $ax^{2} + bx + c$（例如用 $ac$ 法），再解每个一次因式；解常常是分数：\n\n$$2x^{2} + 5x - 3 = 0 \\Rightarrow (2x - 1)(x + 3) = 0 \\Rightarrow x = \\frac{1}{2} \\text{ 或 } x = -3$$",
      ),
      generate(rng) {
        const [p, q, r, s] = drawBinomials(rng);
        const eq = `${quad(p * r, p * s + q * r, q * s)} = 0`;
        const values = [num(Q.of(-q, p)), num(Q.of(-s, r))];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [
            [num(Q.of(q, p)), num(Q.of(s, r))],
            [num(-q), num(-s)],
            [num(Q.of(-p, q)), num(Q.of(-r, s))],
          ],
          solution: factoringSolution([`${lf(p, q)}${lf(r, s)} = 0`], values),
        });
      },
    },
    {
      id: "rearranging",
      title: t("Rearranging first", "先移项"),
      explanation: t(
        "Move every term to one side so that the other side is $0$, with a positive leading coefficient:\n\n$$6x^{2} = 5x + 6 \\Rightarrow 6x^{2} - 5x - 6 = 0 \\Rightarrow (2x - 3)(3x + 2) = 0 \\Rightarrow x = \\frac{3}{2} \\text{ or } x = -\\frac{2}{3}$$",
        "把所有项移到一边，使另一边为 $0$，并使首项系数为正：\n\n$$6x^{2} = 5x + 6 \\Rightarrow 6x^{2} - 5x - 6 = 0 \\Rightarrow (2x - 3)(3x + 2) = 0 \\Rightarrow x = \\frac{3}{2} \\text{ 或 } x = -\\frac{2}{3}$$",
      ),
      generate(rng) {
        const [p, q, r, s] = drawBinomials(rng);
        const a = p * r;
        const b = p * s + q * r;
        const c = q * s;
        const eq = rng.bool() ? `${poly([a, "x^{2}"])} = ${linear(-b, -c)}` : `${quad(a, b, 0)} = ${-c}`;
        const values = [num(Q.of(-q, p)), num(Q.of(-s, r))];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [
            [num(Q.of(q, p)), num(Q.of(s, r))],
            [num(-q), num(-s)],
          ],
          solution: factoringSolution(
            [`${quad(a, b, c)} = 0`, `${lf(p, q)}${lf(r, s)} = 0`],
            values,
            t("Move every term to the left side. ", "把所有项移到左边。"),
          ),
        });
      },
    },
    {
      id: "common-and-negative-factors",
      title: t("Common factors and negative leading coefficients", "公因数与负的首项系数"),
      explanation: t(
        "Take out a common factor, or $-1$ when the leading coefficient is negative, before factoring; the constant factor gives no solution:\n\n$$-6x^{2} + x + 2 = 0 \\Rightarrow -(2x + 1)(3x - 2) = 0 \\Rightarrow x = -\\frac{1}{2} \\text{ or } x = \\frac{2}{3}$$",
        "分解之前先提出公因数，首项系数为负时提出 $-1$；常数因数不给出解：\n\n$$-6x^{2} + x + 2 = 0 \\Rightarrow -(2x + 1)(3x - 2) = 0 \\Rightarrow x = -\\frac{1}{2} \\text{ 或 } x = \\frac{2}{3}$$",
      ),
      generate(rng) {
        const [p, q, r, s] = drawBinomials(rng, 7);
        const k = rng.pick([2, 3, -1, -1, -2]);
        const eq = `${quad(k * p * r, k * (p * s + q * r), k * q * s)} = 0`;
        const values = [num(Q.of(-q, p)), num(Q.of(-s, r))];
        return solutionsProblem({
          prompt: solvePrompt(eq),
          values,
          wrong: [
            [num(Q.of(q, p)), num(Q.of(s, r))],
            [num(k), num(Q.of(-q, p)), num(Q.of(-s, r))],
          ],
          solution: factoringSolution(
            [`${front(k)}${lf(p, q)}${lf(r, s)} = 0`],
            values,
            t(`Take out $${k}$, which is never zero. `, `提出 $${k}$，它不为零。`),
          ),
        });
      },
    },
  ],
};

/** pqPrompt asks for p and q in the form a(x + p)² + q. */
function pqPrompt(expr: string, a = 1): Text {
  const form = `${front(a)}(x + p)^{2} + q`;
  return t(`Write $${expr}$ in the form $${form}$. Give $p$ and $q$.`, `把 $${expr}$ 写成 $${form}$ 的形式，求 $p$ 和 $q$。`);
}

/** completedForm writes a(x + p)² + q. */
const completedForm = (a: number, p: Q, q: Q) => `${front(a)}(${linear(1, p)})^{2}${tail(q)}`;

export const completingTheSquare: TopicDef = {
  id: "completing-the-square",
  title: t("Completing the Square", "配方"),
  summary: t(
    "Write $x^{2} + bx + c$ as $(x + p)^{2} + q$, with even or odd $b$.",
    "把 $x^{2} + bx + c$ 写成 $(x + p)^{2} + q$ 的形式（$b$ 为偶数或奇数）。",
  ),
  prerequisites: ["factoring-perfect-square-trinomials"],
  encompasses: [{ topic: "factoring-perfect-square-trinomials", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSA.SSE.B.3.B"],
  knowledgePoints: [
    {
      id: "missing-constant",
      title: t("The constant that completes the square", "配成完全平方的常数"),
      explanation: t(
        "Since $(x + p)^{2} = x^{2} + 2px + p^{2}$, the expression $x^{2} + bx$ becomes a perfect square when we add the square of **half** the coefficient of $x$:\n\n$$x^{2} + 10x + \\left(\\frac{10}{2}\\right)^{2} = x^{2} + 10x + 25 = (x + 5)^{2}$$\n\nWhen $b$ is odd, the number is a fraction: $x^{2} - 3x + \\frac{9}{4} = \\left(x - \\frac{3}{2}\\right)^{2}$.",
        "因为 $(x + p)^{2} = x^{2} + 2px + p^{2}$，所以给 $x^{2} + bx$ 加上 $x$ 的系数**一半**的平方，就得到完全平方：\n\n$$x^{2} + 10x + \\left(\\frac{10}{2}\\right)^{2} = x^{2} + 10x + 25 = (x + 5)^{2}$$\n\n当 $b$ 是奇数时，这个数是分数：$x^{2} - 3x + \\frac{9}{4} = \\left(x - \\frac{3}{2}\\right)^{2}$。",
      ),
      generate(rng) {
        const b = rng.bool(0.7) ? 2 * rng.nonZero(-10, 10) : 2 * rng.int(-8, 7) + 1;
        const v = rng.pick(["x", "x", "y"]);
        const half = Q.of(b, 2);
        const answer = half.mul(half);
        return numberProblem({
          prompt: t(
            `What number must be added to $${quad(1, b, 0, v)}$ to make a perfect square trinomial?`,
            `$${quad(1, b, 0, v)}$ 加上什么数才能成为完全平方三项式？`,
          ),
          answer,
          wrong: [half, half.abs(), Q.of(b * b), Q.of(b * b, 2), Q.of(b).abs()],
          solution: t(
            `Half the coefficient of $${v}$ is $${num(half)}$, and its square is $${num(answer)}$:${steps(`${quad(1, b, answer, v)} = (${linear(1, half, v)})^{2}`)}`,
            `$${v}$ 的系数的一半是 $${num(half)}$，它的平方是 $${num(answer)}$：${steps(`${quad(1, b, answer, v)} = (${linear(1, half, v)})^{2}`)}`,
          ),
        });
      },
    },
    {
      id: "even-linear-term",
      title: t("Writing $x^{2} + bx + c$ as $(x + p)^{2} + q$", "把 $x^{2} + bx + c$ 写成 $(x + p)^{2} + q$"),
      explanation: t(
        "To **complete the square**, add and subtract the square of half the coefficient of $x$, then factor the perfect square:\n\n$$x^{2} + 6x + 2 = (x^{2} + 6x + 9) - 9 + 2 = (x + 3)^{2} - 7$$\n\nSo $p = 3$ and $q = -7$. In general $p$ is half of $b$ and $q = c - p^{2}$. The number added inside must be taken away again, otherwise the value changes.",
        "**配方**时，加上再减去 $x$ 的系数一半的平方，然后把完全平方写成平方形式：\n\n$$x^{2} + 6x + 2 = (x^{2} + 6x + 9) - 9 + 2 = (x + 3)^{2} - 7$$\n\n所以 $p = 3$，$q = -7$。一般地，$p$ 是 $b$ 的一半，$q = c - p^{2}$。括号里加上的数必须再减去，否则值就变了。",
      ),
      generate(rng) {
        const p = rng.nonZero(-9, 9);
        const c = rng.int(-15, 15);
        const q = c - p * p;
        const expr = quad(1, 2 * p, c);
        return pointProblem({
          prompt: pqPrompt(expr),
          answer: [p, q],
          vars: ["p", "q"],
          wrong: [
            [p, c + p * p],
            [-p, q],
            [2 * p, c - 4 * p * p],
            [p, c],
          ],
          solution: t(
            `Half of $${2 * p}$ is $${p}$, and $${p < 0 ? `(${p})` : p}^{2} = ${p * p}$. Add and subtract it:${steps(`${expr} = (${quad(1, 2 * p, p * p)}) - ${p * p}${tail(c)} = ${completedForm(1, Q.of(p), Q.of(q))}`)}So $p = ${p}$ and $q = ${q}$.`,
            `$${2 * p}$ 的一半是 $${p}$，$${p < 0 ? `(${p})` : p}^{2} = ${p * p}$。加上再减去它：${steps(`${expr} = (${quad(1, 2 * p, p * p)}) - ${p * p}${tail(c)} = ${completedForm(1, Q.of(p), Q.of(q))}`)}所以 $p = ${p}$，$q = ${q}$。`,
          ),
        });
      },
    },
    {
      id: "odd-linear-term",
      title: t("Odd linear terms", "一次项系数为奇数"),
      explanation: t(
        "When $b$ is odd, $p = \\frac{b}{2}$ is a fraction, and so is $p^{2}$:\n\n$$x^{2} + 5x + 1 = \\left(x^{2} + 5x + \\frac{25}{4}\\right) - \\frac{25}{4} + 1 = \\left(x + \\frac{5}{2}\\right)^{2} - \\frac{21}{4}$$\n\nWrite $1 = \\frac{4}{4}$ to combine the constants.",
        "当 $b$ 是奇数时，$p = \\frac{b}{2}$ 是分数，$p^{2}$ 也是分数：\n\n$$x^{2} + 5x + 1 = \\left(x^{2} + 5x + \\frac{25}{4}\\right) - \\frac{25}{4} + 1 = \\left(x + \\frac{5}{2}\\right)^{2} - \\frac{21}{4}$$\n\n把 $1$ 写成 $\\frac{4}{4}$ 来合并常数。",
      ),
      keyPrerequisites: ["factoring-perfect-square-trinomials"],
      generate(rng) {
        const b = 2 * rng.int(-6, 5) + 1;
        const c = rng.int(-12, 12);
        const p = Q.of(b, 2);
        const p2 = p.mul(p);
        const q = Q.of(c).sub(p2);
        const expr = quad(1, b, c);
        return pointProblem({
          prompt: pqPrompt(expr),
          answer: [p, q],
          vars: ["p", "q"],
          wrong: [
            [p, Q.of(c).add(p2)],
            [p.neg(), q],
            [Q.of(b), Q.of(c - b * b)],
            [p, Q.of(c)],
          ],
          solution: t(
            `Half of $${b}$ is $${num(p)}$, and its square is $${num(p2)}$. Add and subtract it:${steps(`${expr} = \\left(${quad(1, b, p2)}\\right) - ${num(p2)}${tail(c)} = ${completedForm(1, p, q)}`)}So $p = ${num(p)}$ and $q = ${num(q)}$.`,
            `$${b}$ 的一半是 $${num(p)}$，它的平方是 $${num(p2)}$。加上再减去它：${steps(`${expr} = \\left(${quad(1, b, p2)}\\right) - ${num(p2)}${tail(c)} = ${completedForm(1, p, q)}`)}所以 $p = ${num(p)}$，$q = ${num(q)}$。`,
          ),
        });
      },
    },
  ],
};

/** leadingCompletion writes the steps of completing the square of ax² + bx + c: factor a out of the x terms, complete the square inside, then distribute. */
function leadingCompletion(a: number, b: number, c: number): { p: Q; q: Q; text: Text } {
  const p = Q.of(b, 2 * a);
  const p2 = p.mul(p);
  const q = Q.of(c).sub(p2.mul(Q.of(a)));
  const ba = Q.of(b, a);
  const lines = [
    `${quad(a, b, c)} = ${front(a)}\\left(${quad(1, ba, 0)}\\right)${tail(c)}`,
    `= ${front(a)}\\left(${quad(1, ba, p2)} - ${num(p2)}\\right)${tail(c)}`,
    `= ${front(a)}\\left(${linear(1, p)}\\right)^{2} ${Q.of(a).mul(p2).sign() < 0 ? "+" : "-"} ${num(Q.of(a).mul(p2).abs())}${tail(c)} = ${completedForm(a, p, q)}`,
  ];
  return {
    p,
    q,
    text: t(
      `Factor $${a}$ out of the $x$ terms, complete the square inside, and multiply the subtracted number by $${a}$:${steps(...lines)}So $p = ${num(p)}$ and $q = ${num(q)}$.`,
      `从含 $x$ 的项中提出 $${a}$，在括号内配方，再把减去的数乘以 $${a}$：${steps(...lines)}所以 $p = ${num(p)}$，$q = ${num(q)}$。`,
    ),
  };
}

export const completingTheSquareWithLeadingCoefficients: TopicDef = {
  id: "completing-the-square-with-leading-coefficients",
  title: t("Completing the Square With Leading Coefficients", "首项系数不为 1 的配方"),
  summary: t("Write $ax^{2} + bx + c$ as $a(x + p)^{2} + q$.", "把 $ax^{2} + bx + c$ 写成 $a(x + p)^{2} + q$ 的形式。"),
  prerequisites: ["completing-the-square"],
  encompasses: [{ topic: "completing-the-square", weight: 0.7 }],
  xp: 14,
  standards: ["CCSS.HSA.SSE.B.3.B"],
  knowledgePoints: [
    {
      id: "a-divides-b",
      title: t("Factoring out the leading coefficient", "提出首项系数"),
      explanation: t(
        "Factor the leading coefficient out of the $x^{2}$ and $x$ terms only, complete the square inside the parentheses, then multiply the number you subtracted by the leading coefficient as it comes out:\n\n$$2x^{2} + 12x + 5 = 2(x^{2} + 6x) + 5 = 2(x^{2} + 6x + 9 - 9) + 5 = 2(x + 3)^{2} - 18 + 5 = 2(x + 3)^{2} - 13$$\n\nForgetting to multiply by $2$ would give $-9 + 5 = -4$, which is wrong.",
        "只从 $x^{2}$ 项和 $x$ 项中提出首项系数，在括号内配方，然后把减去的数乘以首项系数移出括号：\n\n$$2x^{2} + 12x + 5 = 2(x^{2} + 6x) + 5 = 2(x^{2} + 6x + 9 - 9) + 5 = 2(x + 3)^{2} - 18 + 5 = 2(x + 3)^{2} - 13$$\n\n如果忘了乘以 $2$，会得到 $-9 + 5 = -4$，这是错误的。",
      ),
      generate(rng) {
        const a = rng.int(2, 5);
        const p0 = rng.nonZero(-6, 6);
        const c = rng.int(-20, 20);
        const b = 2 * a * p0;
        const { p, q, text } = leadingCompletion(a, b, c);
        return pointProblem({
          prompt: pqPrompt(quad(a, b, c), a),
          answer: [p, q],
          vars: ["p", "q"],
          wrong: [
            [p, Q.of(c - p0 * p0)],
            [Q.of(2 * p0), Q.of(c - 4 * a * p0 * p0)],
            [p.neg(), q],
            [Q.of(a * p0), Q.of(c - a * a * p0 * p0)],
          ],
          solution: text,
        });
      },
    },
    {
      id: "fractions",
      title: t("Fractions inside the square", "平方内出现分数"),
      explanation: t(
        "When the leading coefficient does not divide the coefficient of $x$, $p = \\frac{b}{2a}$ is a fraction:\n\n$$2x^{2} + 6x + 1 = 2(x^{2} + 3x) + 1 = 2\\left(x + \\frac{3}{2}\\right)^{2} - 2 \\cdot \\frac{9}{4} + 1 = 2\\left(x + \\frac{3}{2}\\right)^{2} - \\frac{7}{2}$$",
        "当首项系数不能整除 $x$ 的系数时，$p = \\frac{b}{2a}$ 是分数：\n\n$$2x^{2} + 6x + 1 = 2(x^{2} + 3x) + 1 = 2\\left(x + \\frac{3}{2}\\right)^{2} - 2 \\cdot \\frac{9}{4} + 1 = 2\\left(x + \\frac{3}{2}\\right)^{2} - \\frac{7}{2}$$",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        do {
          a = rng.int(2, 5);
          b = rng.nonZero(-12, 12);
        } while (b % (2 * a) === 0);
        const c = rng.int(-9, 9);
        const { p, q, text } = leadingCompletion(a, b, c);
        return pointProblem({
          prompt: pqPrompt(quad(a, b, c), a),
          answer: [p, q],
          vars: ["p", "q"],
          wrong: [
            [p, Q.of(c).sub(p.mul(p))],
            [Q.of(b, 2), Q.of(c).sub(Q.of(a * b * b, 4))],
            [p.neg(), q],
            [p, Q.of(c).add(p.mul(p).mul(Q.of(a)))],
          ],
          solution: text,
        });
      },
    },
    {
      id: "negative-leading-coefficient",
      title: t("A negative leading coefficient", "首项系数为负"),
      explanation: t(
        "With a negative leading coefficient, factor out the negative number. Subtracting inside the parentheses then **adds** outside:\n\n$$-x^{2} + 6x - 2 = -(x^{2} - 6x) - 2 = -(x^{2} - 6x + 9 - 9) - 2 = -(x - 3)^{2} + 9 - 2 = -(x - 3)^{2} + 7$$",
        "首项系数为负时，提出这个负数。括号内减去的数移到括号外就变成**加上**：\n\n$$-x^{2} + 6x - 2 = -(x^{2} - 6x) - 2 = -(x^{2} - 6x + 9 - 9) - 2 = -(x - 3)^{2} + 9 - 2 = -(x - 3)^{2} + 7$$",
      ),
      generate(rng) {
        const a = rng.pick([-1, -1, -2, -3]);
        const b = a === -1 ? 2 * rng.nonZero(-7, 7) : rng.nonZero(-12, 12);
        const c = rng.int(-12, 12);
        const { p, q, text } = leadingCompletion(a, b, c);
        const ap2 = p.mul(p).mul(Q.of(-a));
        return pointProblem({
          prompt: pqPrompt(quad(a, b, c), a),
          answer: [p, q],
          vars: ["p", "q"],
          wrong: [
            [p, Q.of(c).sub(ap2)],
            [p.neg(), q],
            [Q.of(-b, 2), Q.of(c).add(Q.of(b * b, 4))],
          ],
          solution: text,
        });
      },
    },
  ],
};

/** completingSolution writes the steps of solving x² + bx + c = 0 by completing the square. */
function completingSolution(b: number, c: number, lead: readonly string[] = []): Text {
  const p = Q.of(b, 2);
  const p2 = p.mul(p);
  const k = p2.sub(Q.of(c));
  const sq = `\\left(${linear(1, p)}\\right)^{2}`;
  const values = k.sign() < 0 ? [] : pm(p.neg(), sqrtSurd(k));
  const lines = [...lead, `${quad(1, b, 0)} = ${num(-c)}`, `${quad(1, b, p2)} = ${num(-c)} + ${num(p2)}`, `${sq} = ${num(k)}`];
  if (k.sign() >= 0) lines.push(`x = ${pmLatex(p.neg(), sqrtSurd(k))}`);
  return t(
    `Move the constant to the right side, add $${num(p2)}$, the square of half the coefficient of $x$, to both sides, and take square roots:${steps(...lines)}${k.sign() < 0 ? "A square cannot be negative, so there is no real solution." : `So ${solved(values).en}.`}`,
    `把常数项移到右边，两边加上 $x$ 的系数一半的平方 $${num(p2)}$，再开平方：${steps(...lines)}${k.sign() < 0 ? "平方不可能是负数，所以没有实数解。" : `所以 ${solved(values)["zh-CN"]}。`}`,
  );
}

export const solvingQuadraticEquationsByCompletingTheSquare: TopicDef = {
  id: "solving-quadratic-equations-by-completing-the-square",
  title: t("Solving Quadratic Equations by Completing the Square", "用配方法解一元二次方程"),
  summary: t("Solve $x^{2} + bx + c = 0$ by rewriting it as $(x + p)^{2} = k$.", "把 $x^{2} + bx + c = 0$ 化为 $(x + p)^{2} = k$ 来求解。"),
  prerequisites: ["completing-the-square", "solving-perfect-square-quadratic-equations"],
  encompasses: [
    { topic: "completing-the-square", weight: 0.6 },
    { topic: "solving-perfect-square-quadratic-equations", weight: 0.5 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.4.A", "CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "even-linear-term",
      title: t("Even coefficients of $x$", "$x$ 的系数为偶数"),
      explanation: t(
        "Any quadratic equation can be turned into a perfect square equation. Move the constant to the right, add the square of half the coefficient of $x$ to **both** sides, then take square roots:\n\n$$x^{2} + 6x - 2 = 0 \\Rightarrow x^{2} + 6x = 2 \\Rightarrow x^{2} + 6x + 9 = 11 \\Rightarrow (x + 3)^{2} = 11 \\Rightarrow x = -3 \\pm \\sqrt{11}$$",
        "任何一元二次方程都可以化为完全平方型方程。把常数项移到右边，**两边**都加上 $x$ 的系数一半的平方，再开平方：\n\n$$x^{2} + 6x - 2 = 0 \\Rightarrow x^{2} + 6x = 2 \\Rightarrow x^{2} + 6x + 9 = 11 \\Rightarrow (x + 3)^{2} = 11 \\Rightarrow x = -3 \\pm \\sqrt{11}$$",
      ),
      generate(rng) {
        const p = rng.nonZero(-8, 8);
        let k: number;
        do k = rng.int(1, 40);
        while (k === p * p || (isSquare(k) && rng.bool(0.6)));
        const c = p * p - k;
        const values = pm(Q.of(-p), sqrtSurd(Q.of(k)));
        const slip = p * p + c;
        return solutionsProblem({
          prompt: solvePrompt(`${quad(1, 2 * p, c)} = 0`, byCompleting),
          values,
          wrong: [pm(Q.of(p), sqrtSurd(Q.of(k))), [values[0]!], ...(slip > 0 ? [pm(Q.of(-p), sqrtSurd(Q.of(slip)))] : [])],
          solution: completingSolution(2 * p, c),
        });
      },
    },
    {
      id: "odd-linear-term",
      title: t("Odd coefficients of $x$", "$x$ 的系数为奇数"),
      explanation: t(
        "With an odd coefficient of $x$ the numbers are fractions; write the right side over $4$ before taking square roots:\n\n$$x^{2} + 3x - 1 = 0 \\Rightarrow x^{2} + 3x + \\frac{9}{4} = 1 + \\frac{9}{4} \\Rightarrow \\left(x + \\frac{3}{2}\\right)^{2} = \\frac{13}{4}$$\n\n$$x + \\frac{3}{2} = \\pm\\frac{\\sqrt{13}}{2} \\Rightarrow x = \\frac{-3 \\pm \\sqrt{13}}{2}$$",
        "$x$ 的系数为奇数时会出现分数；开平方之前把右边写成分母为 $4$ 的分数：\n\n$$x^{2} + 3x - 1 = 0 \\Rightarrow x^{2} + 3x + \\frac{9}{4} = 1 + \\frac{9}{4} \\Rightarrow \\left(x + \\frac{3}{2}\\right)^{2} = \\frac{13}{4}$$\n\n$$x + \\frac{3}{2} = \\pm\\frac{\\sqrt{13}}{2} \\Rightarrow x = \\frac{-3 \\pm \\sqrt{13}}{2}$$",
      ),
      generate(rng) {
        let b: number;
        let c: number;
        do {
          b = 2 * rng.int(-6, 5) + 1;
          c = rng.int(-15, 6);
        } while (b * b - 4 * c <= 0);
        const d = b * b - 4 * c;
        const values = rootsOf(1, b, c);
        return solutionsProblem({
          prompt: solvePrompt(`${quad(1, b, c)} = 0`, byCompleting),
          values,
          wrong: [pm(Q.of(b, 2), sqrtSurd(Q.of(d, 4))), pm(Q.of(-b), sqrtSurd(Q.of(d))), [values[0]!]],
          solution: completingSolution(b, c),
        });
      },
    },
    {
      id: "rearranging-and-no-solution",
      title: t("Rearranging, and equations with no solution", "移项与无解的方程"),
      explanation: t(
        "If the equation is not in standard form, first get $x^{2} + bx$ alone on one side. If completing the square leaves a negative number on the right, there is no real solution:\n\n$$x^{2} - 4x + 7 = 0 \\Rightarrow (x - 2)^{2} = -3 \\Rightarrow \\varnothing$$",
        "如果方程不是一般形式，先把 $x^{2} + bx$ 单独留在一边。如果配方后右边是负数，就没有实数解：\n\n$$x^{2} - 4x + 7 = 0 \\Rightarrow (x - 2)^{2} = -3 \\Rightarrow \\varnothing$$",
      ),
      generate(rng) {
        const p = rng.nonZero(-8, 8);
        const none = rng.bool(0.4);
        let k: number;
        do k = none ? -rng.int(1, 20) : rng.int(1, 40);
        while (k === p * p);
        const c = p * p - k;
        const kind = rng.pick(["move", "both-sides"] as const);
        const extra = rng.nonZero(-6, 6);
        const eq = kind === "move" ? `${quad(1, 2 * p, 0)} = ${-c}` : `${quad(1, 2 * p + extra, c)} = ${poly([extra, "x"])}`;
        const values = none ? [] : pm(Q.of(-p), sqrtSurd(Q.of(k)));
        const lead = kind === "move" ? [] : [`${quad(1, 2 * p, c)} = 0`];
        return solutionsProblem({
          prompt: solvePrompt(eq, byCompleting),
          values,
          wrong: none ? [pm(Q.of(-p), sqrtSurd(Q.of(-k)))] : [[], pm(Q.of(p), sqrtSurd(Q.of(k)))],
          solution: completingSolution(2 * p, c, lead),
        });
      },
    },
  ],
};

/** leadingSolution writes the steps of solving ax² + bx + c = 0 by dividing by a and completing the square. */
function leadingSolution(a: number, b: number, c: number): Text {
  const ba = Q.of(b, a);
  const ca = Q.of(c, a);
  const p = Q.of(b, 2 * a);
  const p2 = p.mul(p);
  const k = p2.sub(ca);
  const values = rootsOf(a, b, c);
  const lines = [
    `${quad(1, ba, 0)} = ${num(ca.neg())}`,
    `${quad(1, ba, p2)} = ${num(ca.neg())} + ${num(p2)}`,
    `\\left(${linear(1, p)}\\right)^{2} = ${num(k)}`,
  ];
  if (k.sign() >= 0) lines.push(`x = ${pmLatex(p.neg(), sqrtSurd(k))}`);
  return t(
    `Divide both sides by $${a}$, move the constant to the right, and complete the square:${steps(...lines)}${k.sign() < 0 ? "A square cannot be negative, so there is no real solution." : `So ${solved(values).en}.`}`,
    `两边同时除以 $${a}$，把常数项移到右边，再配方：${steps(...lines)}${k.sign() < 0 ? "平方不可能是负数，所以没有实数解。" : `所以 ${solved(values)["zh-CN"]}。`}`,
  );
}

/** drawPositiveDiscriminant draws ax² + bx + c with gcd(a, b, c) = 1 and b² − 4ac > 0, mostly not a perfect square. */
function drawPositiveDiscriminant(rng: Rng, as: readonly number[]): [number, number, number] {
  let a: number;
  let b: number;
  let c: number;
  do {
    a = rng.pick(as);
    b = rng.nonZero(-10, 10);
    c = rng.nonZero(-10, 10);
  } while (gcd(gcd(a, b), c) !== 1 || b * b - 4 * a * c <= 0 || (isSquare(b * b - 4 * a * c) && rng.bool(0.7)));
  return [a, b, c];
}

export const solvingQuadraticEquationsWithLeadingCoefficientsByCompletingTheSquare: TopicDef = {
  id: "solving-quadratic-equations-with-leading-coefficients-by-completing-the-square",
  title: t("Solving Quadratic Equations With Leading Coefficients by Completing the Square", "用配方法解首项系数不为 1 的一元二次方程"),
  summary: t(
    "Solve $ax^{2} + bx + c = 0$ by dividing by $a$ and completing the square.",
    "两边除以 $a$ 后配方，解 $ax^{2} + bx + c = 0$。",
  ),
  prerequisites: ["solving-quadratic-equations-by-completing-the-square", "completing-the-square-with-leading-coefficients"],
  encompasses: [{ topic: "solving-quadratic-equations-by-completing-the-square", weight: 0.7 }],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.4.A", "CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "a-divides-every-coefficient",
      title: t("Dividing by the leading coefficient", "两边除以首项系数"),
      explanation: t(
        "Completing the square needs $x^{2}$ with coefficient $1$. Divide both sides by the leading coefficient first:\n\n$$3x^{2} - 12x + 6 = 0 \\Rightarrow x^{2} - 4x + 2 = 0 \\Rightarrow (x - 2)^{2} = 2 \\Rightarrow x = 2 \\pm \\sqrt{2}$$",
        "配方需要 $x^{2}$ 的系数为 $1$。先两边同时除以首项系数：\n\n$$3x^{2} - 12x + 6 = 0 \\Rightarrow x^{2} - 4x + 2 = 0 \\Rightarrow (x - 2)^{2} = 2 \\Rightarrow x = 2 \\pm \\sqrt{2}$$",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, 5, -2, -3]);
        const p = rng.nonZero(-6, 6);
        let k: number;
        do k = rng.int(1, 30);
        while (k === p * p || isSquare(k));
        const c = p * p - k;
        const values = pm(Q.of(-p), sqrtSurd(Q.of(k)));
        const slip = p * p - a * c;
        return solutionsProblem({
          prompt: solvePrompt(`${quad(a, 2 * a * p, a * c)} = 0`, byCompleting),
          values,
          wrong: [
            ...(slip > 0 ? [pm(Q.of(-p), sqrtSurd(Q.of(slip)))] : []),
            pm(Q.of(p), sqrtSurd(Q.of(k))),
            pm(Q.of(-a * p), sqrtSurd(Q.of(a * a * p * p - a * a * c))),
          ],
          solution: leadingSolution(a, 2 * a * p, a * c),
        });
      },
    },
    {
      id: "fractions",
      title: t("Fractional coefficients after dividing", "除后出现分数系数"),
      explanation: t(
        "When the leading coefficient does not divide the other coefficients, dividing gives fractions. Keep them exact:\n\n$$2x^{2} + 6x - 1 = 0 \\Rightarrow x^{2} + 3x = \\frac{1}{2} \\Rightarrow \\left(x + \\frac{3}{2}\\right)^{2} = \\frac{1}{2} + \\frac{9}{4} = \\frac{11}{4}$$\n\n$$x = -\\frac{3}{2} \\pm \\frac{\\sqrt{11}}{2} = \\frac{-3 \\pm \\sqrt{11}}{2}$$",
        "当首项系数不能整除其他系数时，相除会得到分数。保持精确：\n\n$$2x^{2} + 6x - 1 = 0 \\Rightarrow x^{2} + 3x = \\frac{1}{2} \\Rightarrow \\left(x + \\frac{3}{2}\\right)^{2} = \\frac{1}{2} + \\frac{9}{4} = \\frac{11}{4}$$\n\n$$x = -\\frac{3}{2} \\pm \\frac{\\sqrt{11}}{2} = \\frac{-3 \\pm \\sqrt{11}}{2}$$",
      ),
      generate(rng) {
        const [a, b, c] = drawPositiveDiscriminant(rng, [2, 3, 4, 5]);
        const d = b * b - 4 * a * c;
        const values = rootsOf(a, b, c);
        return solutionsProblem({
          prompt: solvePrompt(`${quad(a, b, c)} = 0`, byCompleting),
          values,
          wrong: [pm(Q.of(-b, a), sqrtSurd(Q.of(d, a * a))), pm(Q.of(b, 2 * a), sqrtSurd(Q.of(d, 4 * a * a))), [values[0]!]],
          solution: leadingSolution(a, b, c),
        });
      },
    },
    {
      id: "negative-leading-coefficient",
      title: t("A negative leading coefficient", "首项系数为负"),
      explanation: t(
        "Dividing by a negative leading coefficient changes the sign of every term:\n\n$$-x^{2} + 4x + 1 = 0 \\Rightarrow x^{2} - 4x - 1 = 0 \\Rightarrow (x - 2)^{2} = 5 \\Rightarrow x = 2 \\pm \\sqrt{5}$$",
        "除以负的首项系数时，每一项都要变号：\n\n$$-x^{2} + 4x + 1 = 0 \\Rightarrow x^{2} - 4x - 1 = 0 \\Rightarrow (x - 2)^{2} = 5 \\Rightarrow x = 2 \\pm \\sqrt{5}$$",
      ),
      generate(rng) {
        const [a, b, c] = drawPositiveDiscriminant(rng, [-1, -1, -2, -3]);
        const d = b * b - 4 * a * c;
        const values = rootsOf(a, b, c);
        return solutionsProblem({
          prompt: solvePrompt(`${quad(a, b, c)} = 0`, byCompleting),
          values,
          wrong: [...(b * b + 4 * a * c > 0 ? [rootsOf(-a, b, c)] : []), pm(Q.of(b, 2 * a), sqrtSurd(Q.of(d, 4 * a * a))), [values[0]!]],
          solution: leadingSolution(a, b, c),
        });
      },
    },
  ],
};

/** formulaSolution writes the steps of the quadratic formula for ax² + bx + c = 0. */
function formulaSolution(a: number, b: number, c: number, lead: readonly string[] = []): Text {
  const d = b * b - 4 * a * c;
  const values = rootsOf(a, b, c);
  const paren = (n: number) => (n < 0 ? `(${n})` : String(n));
  const lines = [
    ...lead,
    `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
    `b^{2} - 4ac = ${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot ${paren(c)} = ${d}`,
  ];
  if (d >= 0) {
    const raw = `\\frac{${-b} \\pm \\sqrt{${d}}}{${2 * a}}`;
    const simple = isSquare(d) ? `\\frac{${-b} \\pm ${Math.sqrt(d)}}{${2 * a}}` : pmLatex(Q.of(-b, 2 * a), sqrtSurd(Q.of(d, 4 * a * a)));
    lines.push(simple === raw ? `x = ${raw}` : `x = ${raw} = ${simple}`);
  }
  return t(
    `Use $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$:${steps(...lines)}${d < 0 ? "The number under the root is negative, so there is no real solution." : `So ${solved(values).en}.`}`,
    `运用 $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$：${steps(...lines)}${d < 0 ? "根号下的数是负数，所以没有实数解。" : `所以 ${solved(values)["zh-CN"]}。`}`,
  );
}

/** formulaWrong lists the solution sets the usual slips with the quadratic formula produce: −b dropped, a instead of 2a, one root only. */
function formulaWrong(a: number, b: number, c: number): string[][] {
  const d = b * b - 4 * a * c;
  const values = rootsOf(a, b, c);
  if (d < 0) return [pm(Q.of(-b, 2 * a), sqrtSurd(Q.of(-d, 4 * a * a)))];
  return [pm(Q.of(b, 2 * a), sqrtSurd(Q.of(d, 4 * a * a))), pm(Q.of(-b, a), sqrtSurd(Q.of(d, a * a))), [values[0]!]];
}

export const theQuadraticFormula: TopicDef = {
  id: "the-quadratic-formula",
  title: t("The Quadratic Formula", "求根公式"),
  summary: t(
    "Solve any quadratic equation with $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$.",
    "用 $x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$ 解任意一元二次方程。",
  ),
  prerequisites: ["solving-quadratic-equations-with-leading-coefficients-by-completing-the-square"],
  encompasses: [
    { topic: "simplifying-square-roots", weight: 0.3 },
    { topic: "order-of-operations-with-integers", weight: 0.3 },
    { topic: "introduction-to-quadratic-equations", weight: 0.2 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.4.A", "CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "rational-solutions",
      title: t("Using the formula", "运用求根公式"),
      explanation: t(
        "Completing the square on $ax^{2} + bx + c = 0$ once and for all gives the **quadratic formula**:\n\n$$x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$$\n\nFor $2x^{2} - 5x - 3 = 0$: $a = 2$, $b = -5$, $c = -3$, so $b^{2} - 4ac = 25 + 24 = 49$ and\n\n$$x = \\frac{5 \\pm 7}{4}, \\text{ so } x = 3 \\text{ or } x = -\\frac{1}{2}$$\n\nTake the signs with the coefficients: $-b = 5$ here. The whole numerator is divided by $2a$, not just the root.",
        "对 $ax^{2} + bx + c = 0$ 一次性配方，就得到**求根公式**：\n\n$$x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$$\n\n对 $2x^{2} - 5x - 3 = 0$：$a = 2$，$b = -5$，$c = -3$，所以 $b^{2} - 4ac = 25 + 24 = 49$，\n\n$$x = \\frac{5 \\pm 7}{4}, \\text{ 即 } x = 3 \\text{ 或 } x = -\\frac{1}{2}$$\n\n系数要连同符号代入：这里 $-b = 5$。整个分子都除以 $2a$，而不只是根式。",
      ),
      generate(rng) {
        const [p, q, r, s] = drawBinomials(rng, 7);
        const k = rng.bool(0.3) ? -1 : 1;
        const [a, b, c] = [k * p * r, k * (p * s + q * r), k * q * s];
        return solutionsProblem({
          prompt: solvePrompt(`${quad(a, b, c)} = 0`, byFormula),
          values: rootsOf(a, b, c),
          wrong: formulaWrong(a, b, c),
          solution: formulaSolution(a, b, c),
        });
      },
    },
    {
      id: "irrational-solutions",
      title: t("Irrational solutions", "无理数解"),
      explanation: t(
        "When $b^{2} - 4ac$ is not a perfect square, simplify the root and then the fraction:\n\n$$x^{2} + 4x - 1 = 0: \\quad x = \\frac{-4 \\pm \\sqrt{20}}{2} = \\frac{-4 \\pm 2\\sqrt{5}}{2} = -2 \\pm \\sqrt{5}$$\n\nDivide **every** term of the numerator by the common factor, not just one of them.",
        "当 $b^{2} - 4ac$ 不是完全平方数时，先化简根式，再约分：\n\n$$x^{2} + 4x - 1 = 0: \\quad x = \\frac{-4 \\pm \\sqrt{20}}{2} = \\frac{-4 \\pm 2\\sqrt{5}}{2} = -2 \\pm \\sqrt{5}$$\n\n约分时分子的**每一项**都要除以公因数，而不只是其中一项。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        let c: number;
        do {
          [a, b, c] = drawPositiveDiscriminant(rng, [1, 1, 2, 3, 4, 5, -1, -2]);
        } while (isSquare(b * b - 4 * a * c));
        return solutionsProblem({
          prompt: solvePrompt(`${quad(a, b, c)} = 0`, byFormula),
          values: rootsOf(a, b, c),
          wrong: formulaWrong(a, b, c),
          solution: formulaSolution(a, b, c),
        });
      },
    },
    {
      id: "rearranging-and-no-solution",
      title: t("Standard form first", "先化为一般形式"),
      explanation: t(
        "The formula reads $a$, $b$ and $c$ from the standard form $ax^{2} + bx + c = 0$, so rearrange first: $3x^{2} = 2x + 4$ becomes $3x^{2} - 2x - 4 = 0$, with $b = -2$ and $c = -4$.\n\nIf $b^{2} - 4ac < 0$, the square root of a negative number is not real, and the equation has no real solution.",
        "公式中的 $a$、$b$、$c$ 取自一般形式 $ax^{2} + bx + c = 0$，所以要先移项：$3x^{2} = 2x + 4$ 化为 $3x^{2} - 2x - 4 = 0$，其中 $b = -2$，$c = -4$。\n\n如果 $b^{2} - 4ac < 0$，负数的平方根不是实数，方程没有实数解。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        let c: number;
        const none = rng.bool(0.3);
        do {
          a = rng.int(1, 5);
          b = rng.nonZero(-10, 10);
          c = rng.nonZero(-10, 10);
        } while (gcd(gcd(a, b), c) !== 1 || (none ? b * b - 4 * a * c >= 0 : b * b - 4 * a * c <= 0));
        const kind = rng.pick(["x2=", "move-c"] as const);
        const eq = kind === "x2=" ? `${poly([a, "x^{2}"])} = ${linear(-b, -c)}` : `${quad(a, b, 0)} = ${-c}`;
        const values = rootsOf(a, b, c);
        const slip = kind === "x2=" ? [a, -b, -c] : [a, b, -c];
        const [sa, sb, sc] = slip as [number, number, number];
        return solutionsProblem({
          prompt: solvePrompt(eq, byFormula),
          values,
          wrong: [
            ...formulaWrong(a, b, c),
            ...(sb * sb - 4 * sa * sc >= 0 ? [rootsOf(sa, sb, sc)] : []),
            ...(values.length > 0 ? [[]] : []),
          ],
          solution: formulaSolution(a, b, c, [`${quad(a, b, c)} = 0`]),
        });
      },
    },
  ],
};

const solutionCountOptions: readonly Text[] = [
  t("No real solution", "没有实数解"),
  t("Exactly one real solution", "恰有一个实数解"),
  t("Two real solutions", "两个实数解"),
];

/** discriminantText explains the number of solutions from b² − 4ac. */
function discriminantText(a: number, b: number, c: number, lead = ""): Text {
  const d = b * b - 4 * a * c;
  const paren = (n: number) => (n < 0 ? `(${n})` : String(n));
  const calc = `b^{2} - 4ac = ${paren(b)}^{2} - 4 \\cdot ${paren(a)} \\cdot ${paren(c)} = ${d}`;
  return t(
    `${lead}${steps(calc)}${d > 0 ? "The discriminant is positive, so there are two real solutions." : d === 0 ? "The discriminant is zero, so there is exactly one real solution." : "The discriminant is negative, so there is no real solution."}`,
    `${lead}${steps(calc)}${d > 0 ? "判别式为正，所以有两个实数解。" : d === 0 ? "判别式为零，所以恰有一个实数解。" : "判别式为负，所以没有实数解。"}`,
  );
}

/** drawBySign draws ax² + bx + c whose discriminant has the given sign. */
function drawBySign(rng: Rng, sign: -1 | 0 | 1): [number, number, number] {
  if (sign === 0) {
    let p: number;
    let q: number;
    do {
      p = rng.int(1, 4);
      q = rng.nonZero(-7, 7);
    } while (gcd(p, q) !== 1);
    const k = rng.pick([1, 1, 2, -1]);
    return [k * p * p, 2 * k * p * q, k * q * q];
  }
  let a: number;
  let b: number;
  let c: number;
  do {
    a = rng.nonZero(-5, 5);
    b = rng.int(-10, 10);
    c = rng.nonZero(-10, 10);
  } while (Math.sign(b * b - 4 * a * c) !== sign);
  return [a, b, c];
}

export const theDiscriminantOfAQuadraticEquation: TopicDef = {
  id: "the-discriminant-of-a-quadratic-equation",
  title: t("The Discriminant of a Quadratic Equation", "一元二次方程的判别式"),
  summary: t(
    "Compute $b^{2} - 4ac$ and use its sign to tell how many real solutions an equation has.",
    "计算 $b^{2} - 4ac$，并根据它的符号判断方程有几个实数解。",
  ),
  prerequisites: ["the-quadratic-formula"],
  encompasses: [
    { topic: "the-quadratic-formula", weight: 0.3 },
    { topic: "order-of-operations-with-integers", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "computing",
      title: t("Computing the discriminant", "计算判别式"),
      explanation: t(
        "The number under the root in the quadratic formula, $\\Delta = b^{2} - 4ac$, is the **discriminant**. For $3x^{2} - 4x - 2 = 0$:\n\n$$b^{2} - 4ac = (-4)^{2} - 4 \\cdot 3 \\cdot (-2) = 16 + 24 = 40$$\n\n$b^{2}$ is never negative, even when $b$ is: $(-4)^{2} = 16$.",
        "求根公式中根号下的数 $\\Delta = b^{2} - 4ac$ 叫做**判别式**。对 $3x^{2} - 4x - 2 = 0$：\n\n$$b^{2} - 4ac = (-4)^{2} - 4 \\cdot 3 \\cdot (-2) = 16 + 24 = 40$$\n\n即使 $b$ 是负数，$b^{2}$ 也不会是负数：$(-4)^{2} = 16$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-12, 12);
        const c = rng.nonZero(-12, 12);
        const scrambled = rng.bool(0.3);
        const eq = scrambled ? `${poly([b, "x"], [a, "x^{2}"], [c, ""])} = 0` : `${quad(a, b, c)} = 0`;
        const d = b * b - 4 * a * c;
        return numberProblem({
          prompt: t(`Find the discriminant of $${eq}$.`, `求方程 $${eq}$ 的判别式。`),
          answer: d,
          form: "integer",
          wrong: [b * b + 4 * a * c, -b * b - 4 * a * c, b - 4 * a * c, a * a - 4 * b * c],
          solution: discriminantText(a, b, c, `Here $a = ${a}$, $b = ${b}$ and $c = ${c}$:`),
        });
      },
    },
    {
      id: "number-of-solutions",
      title: t("The number of real solutions", "实数解的个数"),
      explanation: t(
        "Since the formula has $\\pm\\sqrt{b^{2} - 4ac}$, the sign of the discriminant tells how many real solutions there are:\n\n- $b^{2} - 4ac > 0$: two real solutions;\n- $b^{2} - 4ac = 0$: exactly one, $x = -\\frac{b}{2a}$;\n- $b^{2} - 4ac < 0$: no real solution.\n\nFor $4x^{2} - 12x + 9 = 0$: $144 - 144 = 0$, so there is one solution.",
        "因为公式中有 $\\pm\\sqrt{b^{2} - 4ac}$，判别式的符号决定了实数解的个数：\n\n- $b^{2} - 4ac > 0$：两个实数解；\n- $b^{2} - 4ac = 0$：恰有一个，$x = -\\frac{b}{2a}$；\n- $b^{2} - 4ac < 0$：没有实数解。\n\n对 $4x^{2} - 12x + 9 = 0$：$144 - 144 = 0$，所以只有一个解。",
      ),
      generate(rng) {
        const sign = rng.pick([-1, 0, 1] as const);
        const [a, b, c] = drawBySign(rng, sign);
        return choiceProblem({
          prompt: t(`How many real solutions does $${quad(a, b, c)} = 0$ have?`, `方程 $${quad(a, b, c)} = 0$ 有几个实数解？`),
          options: solutionCountOptions,
          correct: sign + 1,
          solution: discriminantText(a, b, c, "Compute the discriminant:"),
        });
      },
    },
    {
      id: "rearranging",
      title: t("Equations not in standard form", "非一般形式的方程"),
      explanation: t(
        "Write the equation in standard form before reading $a$, $b$ and $c$:\n\n$$x(x - 4) = -4 \\Rightarrow x^{2} - 4x + 4 = 0 \\Rightarrow b^{2} - 4ac = 16 - 16 = 0$$\n\nso it has exactly one real solution.",
        "先把方程化为一般形式，再读出 $a$、$b$、$c$：\n\n$$x(x - 4) = -4 \\Rightarrow x^{2} - 4x + 4 = 0 \\Rightarrow b^{2} - 4ac = 16 - 16 = 0$$\n\n所以恰有一个实数解。",
      ),
      generate(rng) {
        const sign = rng.pick([-1, 0, 1] as const);
        let a: number;
        let b: number;
        let c: number;
        do [a, b, c] = drawBySign(rng, sign);
        while (a < 0);
        const kind = rng.pick(["x2=", "move-c", "product"] as const);
        const eq =
          kind === "x2=" || (kind === "product" && a !== 1)
            ? `${poly([a, "x^{2}"])} = ${linear(-b, -c)}`
            : kind === "move-c"
              ? `${quad(a, 0, c)} = ${poly([-b, "x"])}`
              : `x${lf(1, b)} = ${-c}`;
        return choiceProblem({
          prompt: t(`How many real solutions does $${eq}$ have?`, `方程 $${eq}$ 有几个实数解？`),
          options: solutionCountOptions,
          correct: sign + 1,
          solution: discriminantText(a, b, c, `In standard form, $${quad(a, b, c)} = 0$:`),
        });
      },
    },
  ],
};

export const quadraticEquationsWithOneRealSolution: TopicDef = {
  id: "quadratic-equations-with-one-real-solution",
  title: t("Determining Unknown Parameters in Quadratic Equations With One Real Solution", "由只有一个实数解确定一元二次方程中的参数"),
  summary: t(
    "Find a coefficient for which a quadratic equation has exactly one real solution by setting $b^{2} - 4ac = 0$.",
    "令 $b^{2} - 4ac = 0$，求使一元二次方程恰有一个实数解的系数。",
  ),
  prerequisites: ["the-discriminant-of-a-quadratic-equation"],
  encompasses: [
    { topic: "the-discriminant-of-a-quadratic-equation", weight: 0.6 },
    { topic: "two-step-equations", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.REI.B.4.B"],
  knowledgePoints: [
    {
      id: "unknown-constant",
      title: t("An unknown constant term", "未知的常数项"),
      explanation: t(
        "An equation has exactly one real solution when its discriminant is $0$. Set $b^{2} - 4ac = 0$ and solve for the unknown:\n\n$$x^{2} + 10x + k = 0: \\quad 10^{2} - 4 \\cdot 1 \\cdot k = 0 \\Rightarrow 100 = 4k \\Rightarrow k = 25$$\n\nCheck: $x^{2} + 10x + 25 = (x + 5)^{2}$.",
        "判别式为 $0$ 时，方程恰有一个实数解。令 $b^{2} - 4ac = 0$，解出未知数：\n\n$$x^{2} + 10x + k = 0: \\quad 10^{2} - 4 \\cdot 1 \\cdot k = 0 \\Rightarrow 100 = 4k \\Rightarrow k = 25$$\n\n检验：$x^{2} + 10x + 25 = (x + 5)^{2}$。",
      ),
      generate(rng) {
        const a = rng.pick([1, 1, 1, 2, 3, 4, -1, -2]);
        const b = rng.nonZero(-12, 12);
        const answer = Q.of(b * b, 4 * a);
        return numberProblem({
          prompt: t(
            `For what value of $k$ does $${quad(a, b, 0)} + k = 0$ have exactly one real solution?`,
            `$k$ 取何值时，方程 $${quad(a, b, 0)} + k = 0$ 恰有一个实数解？`,
          ),
          answer,
          solveFor: "k",
          wrong: [answer.neg(), Q.of(b * b, 2 * a), Q.of(b, 2), Q.of(b * b, 4), Q.of(b * b)],
          solution: t(
            `Set the discriminant equal to $0$:${steps(`${b < 0 ? `(${b})` : b}^{2} - 4 \\cdot ${a < 0 ? `(${a})` : a} \\cdot k = 0`, `${b * b} = ${4 * a}k`, `k = ${num(answer)}`)}`,
            `令判别式等于 $0$：${steps(`${b < 0 ? `(${b})` : b}^{2} - 4 \\cdot ${a < 0 ? `(${a})` : a} \\cdot k = 0`, `${b * b} = ${4 * a}k`, `k = ${num(answer)}`)}`,
          ),
        });
      },
    },
    {
      id: "unknown-leading-coefficient",
      title: t("An unknown leading coefficient", "未知的首项系数"),
      explanation: t(
        "The same condition works when $a$ is unknown, as long as $a \\ne 0$ so that the equation stays quadratic:\n\n$$kx^{2} - 12x + 4 = 0: \\quad 144 - 16k = 0 \\Rightarrow k = 9$$",
        "当 $a$ 未知时同样适用，只要 $a \\ne 0$，方程仍是一元二次方程：\n\n$$kx^{2} - 12x + 4 = 0: \\quad 144 - 16k = 0 \\Rightarrow k = 9$$",
      ),
      generate(rng) {
        const b = rng.nonZero(-12, 12);
        const c = rng.nonZero(-9, 9);
        const answer = Q.of(b * b, 4 * c);
        return numberProblem({
          prompt: t(
            `For what value of $k$ does $kx^{2}${tail(b)
              .replace(/(\d+)$/, "$1x")
              .replace(/ ([+-]) $/, " $1 x")} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = 0$ have exactly one real solution?`,
            `$k$ 取何值时，方程 $kx^{2}${tail(b).replace(/(\d+)$/, "$1x")} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = 0$ 恰有一个实数解？`,
          ),
          answer,
          solveFor: "k",
          wrong: [answer.neg(), Q.of(b * b, 2 * c), Q.of(b * b, c), Q.of(4 * c, b * b)],
          solution: t(
            `Set the discriminant equal to $0$:${steps(`${b < 0 ? `(${b})` : b}^{2} - 4 \\cdot k \\cdot ${c < 0 ? `(${c})` : c} = 0`, `${b * b} = ${4 * c}k`, `k = ${num(answer)}`)}`,
            `令判别式等于 $0$：${steps(`${b < 0 ? `(${b})` : b}^{2} - 4 \\cdot k \\cdot ${c < 0 ? `(${c})` : c} = 0`, `${b * b} = ${4 * c}k`, `k = ${num(answer)}`)}`,
          ),
        });
      },
    },
    {
      id: "unknown-linear-coefficient",
      title: t("An unknown coefficient of $x$", "未知的一次项系数"),
      explanation: t(
        "When the coefficient of $x$ is unknown, the condition $k^{2} = 4ac$ has two solutions, $k = \\pm 2\\sqrt{ac}$:\n\n$$x^{2} + kx + 9 = 0: \\quad k^{2} - 36 = 0 \\Rightarrow k = 6 \\text{ or } k = -6$$\n\nGive both: $x^{2} + 6x + 9 = (x + 3)^{2}$ and $x^{2} - 6x + 9 = (x - 3)^{2}$.",
        "当 $x$ 的系数未知时，条件 $k^{2} = 4ac$ 有两个解 $k = \\pm 2\\sqrt{ac}$：\n\n$$x^{2} + kx + 9 = 0: \\quad k^{2} - 36 = 0 \\Rightarrow k = 6 \\text{ 或 } k = -6$$\n\n两个都要写：$x^{2} + 6x + 9 = (x + 3)^{2}$，$x^{2} - 6x + 9 = (x - 3)^{2}$。",
      ),
      generate(rng) {
        const w = rng.pick([1, 1, 2, 3]) * rng.sign();
        const m = rng.int(1, 4);
        const n = rng.int(1, 6);
        const a = w * m * m;
        const c = w * n * n;
        const k = 2 * Math.abs(w) * m * n;
        const eq = `${poly([a, "x^{2}"])} + kx ${c < 0 ? "-" : "+"} ${Math.abs(c)} = 0`;
        return solutionsProblem({
          prompt: t(
            `Find all values of $k$ for which $${eq}$ has exactly one real solution.`,
            `求使方程 $${eq}$ 恰有一个实数解的所有 $k$ 值。`,
          ),
          variable: "k",
          values: [String(k), String(-k)],
          wrong: [[String(k)], [String(k / 2), String(-k / 2)], [String(4 * a * c), String(-4 * a * c)]],
          solution: t(
            `Set the discriminant equal to $0$:${steps(`k^{2} - 4 \\cdot ${a < 0 ? `(${a})` : a} \\cdot ${c < 0 ? `(${c})` : c} = 0`, `k^{2} = ${4 * a * c}`, `k = \\pm ${k}`)}`,
            `令判别式等于 $0$：${steps(`k^{2} - 4 \\cdot ${a < 0 ? `(${a})` : a} \\cdot ${c < 0 ? `(${c})` : c} = 0`, `k^{2} = ${4 * a * c}`, `k = \\pm ${k}`)}`,
          ),
        });
      },
    },
  ],
};

export const modelingWithQuadraticEquations: TopicDef = {
  id: "modeling-with-quadratic-equations",
  title: t("Modeling With Quadratic Equations", "用一元二次方程建模"),
  summary: t(
    "Solve word problems about areas, numbers and falling objects with quadratic equations, rejecting solutions that do not fit the situation.",
    "用一元二次方程解关于面积、数和下落物体的应用题，并舍去不符合实际的解。",
  ),
  prerequisites: ["solving-quadratic-equations-by-factoring"],
  encompasses: [{ topic: "solving-quadratic-equations-by-factoring", weight: 0.5 }],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.1"],
  knowledgePoints: [
    {
      id: "rectangles",
      title: t("Areas of rectangles", "长方形的面积"),
      explanation: t(
        "Name the unknown, write the area as a product, and solve. A length must be positive, so reject a negative solution.\n\nThe length of a rectangle is $3$ m more than its width, and its area is $40$ m². With width $w$:\n\n$$w(w + 3) = 40 \\Rightarrow w^{2} + 3w - 40 = 0 \\Rightarrow (w + 8)(w - 5) = 0$$\n\nSo $w = 5$ (not $-8$): the width is $5$ m and the length $8$ m.",
        "设出未知数，把面积写成乘积，然后求解。长度必须是正数，所以舍去负数解。\n\n一个长方形的长比宽多 $3$ m，面积是 $40$ m²。设宽为 $w$：\n\n$$w(w + 3) = 40 \\Rightarrow w^{2} + 3w - 40 = 0 \\Rightarrow (w + 8)(w - 5) = 0$$\n\n所以 $w = 5$（舍去 $-8$）：宽是 $5$ m，长是 $8$ m。",
      ),
      generate(rng) {
        const w = rng.int(2, 15);
        const d = rng.int(1, 9);
        const twice = rng.bool(0.35);
        const length = twice ? 2 * w + d : w + d;
        const area = w * length;
        const unit = rng.pick(["m", "cm", "ft"]);
        const askLength = rng.bool(0.35);
        const rel = twice
          ? t(`$${d}$ ${unit} more than twice its width`, `比宽的 $2$ 倍多 $${d}$ ${unit}`)
          : t(`$${d}$ ${unit} more than its width`, `比宽多 $${d}$ ${unit}`);
        const eq = twice ? `w(2w + ${d}) = ${area}` : `w(w + ${d}) = ${area}`;
        const std = twice ? `${quad(2, d, -area, "w")} = 0` : `${quad(1, d, -area, "w")} = 0`;
        const other = twice ? Q.of(-length, 2) : Q.of(-length);
        const answer = askLength ? length : w;
        return numberProblem({
          prompt: t(
            `The length of a rectangle is ${rel.en}. Its area is $${area}$ ${unit}². Find its ${askLength ? "length" : "width"}.`,
            `一个长方形的长${rel["zh-CN"]}，面积是 $${area}$ ${unit}²。求它的${askLength ? "长" : "宽"}。`,
          ),
          answer,
          unit,
          wrong: [askLength ? w : length, other, area / 2 === Math.floor(area / 2) ? area / 2 : area],
          solution: t(
            `Let the width be $w$. Then${steps(eq, std)}The solutions are $w = ${w}$ and $w = ${num(other)}$; a width cannot be negative, so $w = ${w}$${askLength ? ` and the length is $${length}$ ${unit}` : ""}.`,
            `设宽为 $w$。则${steps(eq, std)}解得 $w = ${w}$ 或 $w = ${num(other)}$；宽不可能是负数，所以 $w = ${w}$${askLength ? `，长是 $${length}$ ${unit}` : ""}。`,
          ),
        });
      },
    },
    {
      id: "numbers",
      title: t("Number problems", "数的问题"),
      explanation: t(
        "Consecutive integers are $n$ and $n + 1$; consecutive even or odd integers are $n$ and $n + 2$. If the product of two consecutive positive integers is $132$:\n\n$$n(n + 1) = 132 \\Rightarrow n^{2} + n - 132 = 0 \\Rightarrow (n + 12)(n - 11) = 0$$\n\nThe integers are positive, so $n = 11$: the integers are $11$ and $12$.",
        "相邻整数是 $n$ 和 $n + 1$；相邻偶数或相邻奇数是 $n$ 和 $n + 2$。如果两个相邻正整数之积是 $132$：\n\n$$n(n + 1) = 132 \\Rightarrow n^{2} + n - 132 = 0 \\Rightarrow (n + 12)(n - 11) = 0$$\n\n这两个整数是正数，所以 $n = 11$：它们是 $11$ 和 $12$。",
      ),
      generate(rng) {
        const kind = rng.pick(["consecutive", "even", "odd"] as const);
        const step = kind === "consecutive" ? 1 : 2;
        let n = rng.int(3, 25);
        if (kind === "even" && n % 2 === 1) n += 1;
        if (kind === "odd" && n % 2 === 0) n += 1;
        const product = n * (n + step);
        const askLarger = rng.bool(0.4);
        const name = {
          consecutive: t("consecutive positive integers", "相邻正整数"),
          even: t("consecutive positive even integers", "相邻正偶数"),
          odd: t("consecutive positive odd integers", "相邻正奇数"),
        }[kind];
        const answer = askLarger ? n + step : n;
        return numberProblem({
          prompt: t(
            `The product of two ${name.en} is $${product}$. What is the ${askLarger ? "larger" : "smaller"} integer?`,
            `两个${name["zh-CN"]}的积是 $${product}$。${askLarger ? "较大" : "较小"}的数是多少？`,
          ),
          answer,
          form: "integer",
          wrong: [askLarger ? n : n + step, -(n + step), -n, Math.floor(product / 2)],
          solution: t(
            `Let the smaller integer be $n$; the larger is $n + ${step}$:${steps(`n(n + ${step}) = ${product}`, `${quad(1, step, -product, "n")} = 0`, `(n + ${n + step})(n - ${n}) = 0`)}The integers are positive, so $n = ${n}$ and the integers are $${n}$ and $${n + step}$.`,
            `设较小的数为 $n$，较大的数为 $n + ${step}$：${steps(`n(n + ${step}) = ${product}`, `${quad(1, step, -product, "n")} = 0`, `(n + ${n + step})(n - ${n}) = 0`)}这两个数是正数，所以 $n = ${n}$，两个数是 $${n}$ 和 $${n + step}$。`,
          ),
        });
      },
    },
    {
      id: "falling-objects",
      title: t("Objects thrown into the air", "抛出的物体"),
      explanation: t(
        "The height of an object thrown upward is often modeled by $h = -16t^{2} + v t + h_{0}$ in feet, or $h = -5t^{2} + v t + h_{0}$ in meters, $t$ seconds after it is thrown. It hits the ground when $h = 0$:\n\n$$-16t^{2} + 32t + 48 = 0 \\Rightarrow -16(t^{2} - 2t - 3) = 0 \\Rightarrow -16(t - 3)(t + 1) = 0$$\n\nTime after the throw is positive, so the object lands after $t = 3$ seconds.",
        "向上抛出的物体，在抛出 $t$ 秒后的高度常用 $h = -16t^{2} + vt + h_{0}$（单位：英尺）或 $h = -5t^{2} + vt + h_{0}$（单位：米）来描述。物体落地时 $h = 0$：\n\n$$-16t^{2} + 32t + 48 = 0 \\Rightarrow -16(t^{2} - 2t - 3) = 0 \\Rightarrow -16(t - 3)(t + 1) = 0$$\n\n抛出后的时间是正数，所以物体在 $t = 3$ 秒时落地。",
      ),
      generate(rng) {
        const big = rng.int(2, 8);
        const small = rng.int(1, big - 1);
        const feet = rng.bool();
        const g = feet ? 16 : 5;
        const v = g * (big - small);
        const h0 = g * big * small;
        const h = `${quad(-g, v, h0, "t")}`;
        const unitEn = feet ? "feet" : "meters";
        const unitZh = feet ? "英尺" : "米";
        return numberProblem({
          prompt: t(
            `A ball is thrown upward from a height of $${h0}$ ${unitEn}. Its height after $t$ seconds is $h = ${h}$ ${unitEn}. After how many seconds does it hit the ground?`,
            `一个球从 $${h0}$ ${unitZh}高处向上抛出，$t$ 秒后它的高度是 $h = ${h}$ ${unitZh}。它在多少秒后落地？`,
          ),
          answer: big,
          unit: "s",
          wrong: [-small, small, big - small],
          solution: t(
            `The ball hits the ground when $h = 0$:${steps(`${h} = 0`, `-${g}(${quad(1, small - big, -big * small, "t")}) = 0`, `-${g}(t - ${big})(t + ${small}) = 0`)}So $t = ${big}$ or $t = -${small}$. Time after the throw is positive, so the ball lands after $${big}$ seconds.`,
            `球落地时 $h = 0$：${steps(`${h} = 0`, `-${g}(${quad(1, small - big, -big * small, "t")}) = 0`, `-${g}(t - ${big})(t + ${small}) = 0`)}所以 $t = ${big}$ 或 $t = -${small}$。抛出后的时间是正数，所以球在 $${big}$ 秒后落地。`,
          ),
        });
      },
    },
  ],
};

export const equatingPolynomialCoefficients: TopicDef = {
  id: "equating-polynomial-coefficients",
  title: t("Equating Polynomial Coefficients", "比较多项式的系数"),
  summary: t(
    "Find unknown constants in a polynomial identity by equating the coefficients of like powers of $x$.",
    "比较 $x$ 的同次幂的系数，求多项式恒等式中的未知常数。",
  ),
  prerequisites: ["multiplying-binomials", "two-step-equations"],
  encompasses: [
    { topic: "multiplying-binomials", weight: 0.3 },
    { topic: "two-step-equations", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.APR.A.1"],
  knowledgePoints: [
    {
      id: "matching-coefficients",
      title: t("Matching coefficients", "对应系数相等"),
      explanation: t(
        "Two polynomials are equal **for every value of $x$** exactly when the coefficients of each power of $x$ are equal. So from\n\n$$(2a - 1)x^{2} + (b + 4)x - 3 = 5x^{2} - 2x - 3$$\n\nwe get $2a - 1 = 5$ and $b + 4 = -2$, so $a = 3$ and $b = -6$.",
        "两个多项式**对 $x$ 的每一个值**都相等，当且仅当 $x$ 的每个次幂的系数都相等。所以由\n\n$$(2a - 1)x^{2} + (b + 4)x - 3 = 5x^{2} - 2x - 3$$\n\n得 $2a - 1 = 5$，$b + 4 = -2$，所以 $a = 3$，$b = -6$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.nonZero(-9, 9);
        const m = rng.int(1, 4);
        const n = rng.nonZero(-9, 9);
        const u = rng.int(1, 3);
        const w = rng.nonZero(-9, 9);
        const c = rng.int(-9, 9);
        const A = m * a + n;
        const B = u * b + w;
        const left = `(${linear(m, n, "a")})x^{2} + (${linear(u, w, "b")})x${tail(c)}`;
        const right = quad(A, B, c);
        return pointProblem({
          prompt: t(
            `The equation $${left} = ${right}$ holds for every value of $x$. Find $a$ and $b$.`,
            `等式 $${left} = ${right}$ 对 $x$ 的每一个值都成立。求 $a$ 和 $b$。`,
          ),
          answer: [a, b],
          vars: ["a", "b"],
          wrong: [
            [Q.of(A + n, m), Q.of(B + w, u)],
            [b, a],
            [Q.of(A, m), Q.of(B, u)],
          ],
          solution: t(
            `Equate the coefficients of $x^{2}$ and of $x$:${steps(`${linear(m, n, "a")} = ${A} \\Rightarrow a = ${a}`, `${linear(u, w, "b")} = ${B} \\Rightarrow b = ${b}`)}`,
            `令 $x^{2}$ 的系数相等，$x$ 的系数相等：${steps(`${linear(m, n, "a")} = ${A} \\Rightarrow a = ${a}`, `${linear(u, w, "b")} = ${B} \\Rightarrow b = ${b}`)}`,
          ),
        });
      },
    },
    {
      id: "expanding-first",
      title: t("Expanding first", "先展开"),
      explanation: t(
        "When one side is a product, expand it first, then match coefficients:\n\n$$(x + a)(x + 3) = x^{2} + bx - 12$$\n\n$$x^{2} + (a + 3)x + 3a = x^{2} + bx - 12$$\n\nThe constant terms give $3a = -12$, so $a = -4$; the coefficients of $x$ give $b = a + 3 = -1$.",
        "当一边是乘积时，先展开，再比较系数：\n\n$$(x + a)(x + 3) = x^{2} + bx - 12$$\n\n$$x^{2} + (a + 3)x + 3a = x^{2} + bx - 12$$\n\n常数项给出 $3a = -12$，所以 $a = -4$；$x$ 的系数给出 $b = a + 3 = -1$。",
      ),
      generate(rng) {
        const q = rng.pick([1, 1, 2, 3]);
        const p = rng.nonZero(-9, 9);
        const a = rng.nonZero(-9, 9);
        const C = a * p;
        const b = q * p + a;
        const left = `(${q === 1 ? "" : q}x + a)${lf(1, p)}`;
        const right = `${poly([q, "x^{2}"])} + bx${tail(C)}`;
        const expanded = `${poly([q, "x^{2}"])} + (${q * p} + a)x ${p < 0 ? "-" : "+"} ${Math.abs(p) === 1 ? "" : Math.abs(p)}a`;
        return pointProblem({
          prompt: t(
            `The equation $${left} = ${right}$ holds for every value of $x$. Find $a$ and $b$.`,
            `等式 $${left} = ${right}$ 对 $x$ 的每一个值都成立。求 $a$ 和 $b$。`,
          ),
          answer: [a, b],
          vars: ["a", "b"],
          wrong: [
            [-a, q * p - a],
            [a, a + p],
            [C - p, q * p + C - p],
          ],
          solution: t(
            `Expand the left side:${steps(`${left} = ${expanded}`)}The constant terms give $${poly([p, "a"])} = ${C}$, so $a = ${a}$. The coefficients of $x$ give $b = ${q * p} + a = ${b}$.`,
            `展开左边：${steps(`${left} = ${expanded}`)}常数项给出 $${poly([p, "a"])} = ${C}$，所以 $a = ${a}$。$x$ 的系数给出 $b = ${q * p} + a = ${b}$。`,
          ),
        });
      },
    },
    {
      id: "three-unknowns",
      title: t("Three unknowns", "三个未知数"),
      explanation: t(
        "Each power of $x$ gives one equation. Solve the ones with a single unknown first:\n\n$$(ax + 2)(3x + b) = 6x^{2} + cx - 10$$\n\n$$3ax^{2} + (ab + 6)x + 2b = 6x^{2} + cx - 10$$\n\nSo $3a = 6$ and $2b = -10$: $a = 2$, $b = -5$, and then $c = ab + 6 = -4$.",
        "$x$ 的每个次幂给出一个方程。先解只含一个未知数的方程：\n\n$$(ax + 2)(3x + b) = 6x^{2} + cx - 10$$\n\n$$3ax^{2} + (ab + 6)x + 2b = 6x^{2} + cx - 10$$\n\n所以 $3a = 6$，$2b = -10$：$a = 2$，$b = -5$，于是 $c = ab + 6 = -4$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-5, 5);
        const b = rng.nonZero(-9, 9);
        const p = rng.nonZero(-7, 7);
        const q = rng.int(2, 5);
        const A = a * q;
        const B = p * b;
        const c = a * b + p * q;
        const left = `(ax${tail(p)})(${q}x + b)`;
        const right = `${poly([A, "x^{2}"])} + cx${tail(B)}`;
        return pointProblem({
          prompt: t(
            `The equation $${left} = ${right}$ holds for every value of $x$. Find $a$, $b$ and $c$.`,
            `等式 $${left} = ${right}$ 对 $x$ 的每一个值都成立。求 $a$、$b$ 和 $c$。`,
          ),
          answer: [a, b, c],
          vars: ["a", "b", "c"],
          wrong: [
            [a, b, a * b],
            [a, b, a * b - p * q],
            [a, b, a * q + p * b],
          ],
          solution: t(
            `Expand the left side:${steps(`${left} = ${poly([q, "ax^{2}"])} + (ab ${p * q < 0 ? "-" : "+"} ${Math.abs(p * q)})x ${p < 0 ? "-" : "+"} ${Math.abs(p)}b`)}So $${q}a = ${A}$ and $${p}b = ${B}$, which give $a = ${a}$ and $b = ${b}$. Then $c = ab ${p * q < 0 ? "-" : "+"} ${Math.abs(p * q)} = ${c}$.`,
            `展开左边：${steps(`${left} = ${poly([q, "ax^{2}"])} + (ab ${p * q < 0 ? "-" : "+"} ${Math.abs(p * q)})x ${p < 0 ? "-" : "+"} ${Math.abs(p)}b`)}所以 $${q}a = ${A}$，$${p}b = ${B}$，得 $a = ${a}$，$b = ${b}$。于是 $c = ab ${p * q < 0 ? "-" : "+"} ${Math.abs(p * q)} = ${c}$。`,
          ),
        });
      },
    },
  ],
};

export const vietasFormulas: TopicDef = {
  id: "vietas-formulas",
  title: t("Vieta's Formulas", "韦达定理"),
  summary: t(
    "Relate the sum and product of the solutions of $ax^{2} + bx + c = 0$ to its coefficients: $-\\frac{b}{a}$ and $\\frac{c}{a}$.",
    "把 $ax^{2} + bx + c = 0$ 的两根之和与两根之积与系数联系起来：$-\\frac{b}{a}$ 与 $\\frac{c}{a}$。",
  ),
  prerequisites: ["equating-polynomial-coefficients", "solving-quadratic-equations-by-factoring"],
  encompasses: [
    { topic: "equating-polynomial-coefficients", weight: 0.4 },
    { topic: "multiplying-binomials", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSA.APR.B.2"],
  knowledgePoints: [
    {
      id: "sum-and-product",
      title: t("The sum and the product of the solutions", "两根之和与两根之积"),
      explanation: t(
        "If $r$ and $s$ are the solutions of $ax^{2} + bx + c = 0$, then $ax^{2} + bx + c = a(x - r)(x - s) = ax^{2} - a(r + s)x + ars$. Equating coefficients gives **Vieta's formulas**:\n\n$$r + s = -\\frac{b}{a} \\qquad rs = \\frac{c}{a}$$\n\nFor $2x^{2} - 7x + 3 = 0$, the sum of the solutions is $\\frac{7}{2}$ and the product is $\\frac{3}{2}$, without solving the equation. Mind the minus sign in the sum.",
        "如果 $r$ 和 $s$ 是 $ax^{2} + bx + c = 0$ 的两个解，那么 $ax^{2} + bx + c = a(x - r)(x - s) = ax^{2} - a(r + s)x + ars$。比较系数就得到**韦达定理**：\n\n$$r + s = -\\frac{b}{a} \\qquad rs = \\frac{c}{a}$$\n\n对 $2x^{2} - 7x + 3 = 0$，不解方程就知道两根之和是 $\\frac{7}{2}$，两根之积是 $\\frac{3}{2}$。注意和中的负号。",
      ),
      generate(rng) {
        let a: number;
        let b: number;
        let c: number;
        do {
          a = rng.pick([1, 1, 2, 3, 4, 5, -1, -2]);
          b = rng.nonZero(-12, 12);
          c = rng.nonZero(-12, 12);
        } while (b * b - 4 * a * c <= 0);
        const askSum = rng.bool();
        const answer = askSum ? Q.of(-b, a) : Q.of(c, a);
        return numberProblem({
          prompt: t(
            `What is the ${askSum ? "sum" : "product"} of the solutions of $${quad(a, b, c)} = 0$?`,
            `方程 $${quad(a, b, c)} = 0$ 的两根之${askSum ? "和" : "积"}是多少？`,
          ),
          answer,
          wrong: askSum ? [Q.of(b, a), Q.of(-b), Q.of(c, a), Q.of(-a, b)] : [Q.of(-c, a), Q.of(c), Q.of(-b, a), Q.of(a, c)],
          solution: askSum
            ? t(
                `Here $a = ${a}$ and $b = ${b}$. By Vieta's formulas the sum is $-\\frac{b}{a} = ${num(answer)}$.`,
                `这里 $a = ${a}$，$b = ${b}$。由韦达定理，两根之和是 $-\\frac{b}{a} = ${num(answer)}$。`,
              )
            : t(
                `Here $a = ${a}$ and $c = ${c}$. By Vieta's formulas the product is $\\frac{c}{a} = ${num(answer)}$.`,
                `这里 $a = ${a}$，$c = ${c}$。由韦达定理，两根之积是 $\\frac{c}{a} = ${num(answer)}$。`,
              ),
        });
      },
    },
    {
      id: "the-other-solution",
      title: t("Finding the other solution", "求另一个根"),
      explanation: t(
        "If one solution is known, Vieta's formulas give the other, even when a coefficient is unknown. If $x^{2} + kx + 12 = 0$ has the solution $x = 3$, the product of the solutions is $12$, so the other is $\\frac{12}{3} = 4$ (and $k = -7$).\n\nIf instead the coefficient of $x$ is known, use the sum: $x^{2} - 5x + k = 0$ with solution $x = 7$ has the other solution $5 - 7 = -2$.",
        "如果已知一个解，即使某个系数未知，也能由韦达定理求出另一个解。如果 $x^{2} + kx + 12 = 0$ 有解 $x = 3$，两根之积是 $12$，所以另一个解是 $\\frac{12}{3} = 4$（且 $k = -7$）。\n\n如果已知的是 $x$ 的系数，就用两根之和：$x^{2} - 5x + k = 0$ 有解 $x = 7$，另一个解是 $5 - 7 = -2$。",
      ),
      generate(rng) {
        const [r, s] = drawRoots(rng, 9);
        const useProduct = rng.bool();
        const eq = useProduct ? `x^{2} + kx${tail(r * s)} = 0` : `${quad(1, -(r + s), 0)} + k = 0`;
        return numberProblem({
          prompt: t(
            `The equation $${eq}$ has the solution $x = ${r}$. Find its other solution.`,
            `方程 $${eq}$ 有一个解 $x = ${r}$。求它的另一个解。`,
          ),
          answer: s,
          solveFor: "x",
          wrong: useProduct ? [-s, r * s - r, Q.of(r, r * s)] : [-s, r + s + r, -(r + s) - r],
          solution: useProduct
            ? t(
                `The product of the solutions is $${r * s}$, so the other solution is $\\frac{${r * s}}{${r}} = ${s}$.`,
                `两根之积是 $${r * s}$，所以另一个解是 $\\frac{${r * s}}{${r}} = ${s}$。`,
              )
            : t(
                `The sum of the solutions is the opposite of the coefficient of $x$, $${r + s}$, so the other solution is $${r + s} - ${r < 0 ? `(${r})` : r} = ${s}$.`,
                `两根之和是 $x$ 的系数的相反数 $${r + s}$，所以另一个解是 $${r + s} - ${r < 0 ? `(${r})` : r} = ${s}$。`,
              ),
        });
      },
    },
    {
      id: "building-an-equation",
      title: t("An equation with given solutions", "由已知解写方程"),
      explanation: t(
        "An equation with solutions $r$ and $s$ is $(x - r)(x - s) = 0$, that is\n\n$$x^{2} - (r + s)x + rs = 0$$\n\nFor the solutions $3$ and $-5$: the sum is $-2$ and the product $-15$, so $x^{2} + 2x - 15 = 0$. For a fraction such as $\\frac{1}{2}$, use the factor $2x - 1$ to keep integer coefficients.",
        "以 $r$ 和 $s$ 为解的方程是 $(x - r)(x - s) = 0$，即\n\n$$x^{2} - (r + s)x + rs = 0$$\n\n对解 $3$ 和 $-5$：和是 $-2$，积是 $-15$，所以方程是 $x^{2} + 2x - 15 = 0$。对分数解，例如 $\\frac{1}{2}$，用因式 $2x - 1$ 使系数保持为整数。",
      ),
      generate(rng) {
        const fraction = rng.bool(0.35);
        let p: number;
        let d: number;
        let s: number;
        do {
          p = rng.nonZero(-9, 9);
          d = fraction ? rng.int(2, 5) : 1;
          s = rng.nonZero(-9, 9);
        } while (gcd(p, d) !== 1 || Q.of(p, d).eq(Q.of(s)) || (!fraction && p + s === 0));
        const r = Q.of(p, d);
        const a = d;
        const b = -(p + d * s);
        const c = p * s;
        const answer = `${quad(a, b, c)} = 0`;
        return equationProblem({
          prompt: t(
            `Write a quadratic equation in $x$ whose solutions are $x = ${num(r)}$ and $x = ${s}$.`,
            `写一个关于 $x$ 的一元二次方程，使它的解是 $x = ${num(r)}$ 和 $x = ${s}$。`,
          ),
          answer,
          wrong: [`${quad(a, -b, c)} = 0`, `${quad(a, b, -c)} = 0`, `${quad(a, -b, -c)} = 0`],
          solution: t(
            `Multiply the factors that give these solutions:${steps(`${lf(d, -p)}${lf(1, -s)} = 0`, answer)}`,
            `把给出这些解的因式相乘：${steps(`${lf(d, -p)}${lf(1, -s)} = 0`, answer)}`,
          ),
        });
      },
    },
  ],
};

/** quadraticEquationTopics are the topics of the quadratic equations module, in teaching order. */
export const quadraticEquationTopics: readonly TopicDef[] = [
  introductionToQuadraticEquations,
  solvingPerfectSquareQuadraticEquations,
  zeroProductRule,
  solvingQuadraticEquationsUsingADifferenceOfSquares,
  solvingQuadraticEquationsWithNoConstantTerm,
  solvingQuadraticEquationsByFactoring,
  solvingQuadraticEquationsWithLeadingCoefficientsByFactoring,
  completingTheSquare,
  completingTheSquareWithLeadingCoefficients,
  solvingQuadraticEquationsByCompletingTheSquare,
  solvingQuadraticEquationsWithLeadingCoefficientsByCompletingTheSquare,
  theQuadraticFormula,
  theDiscriminantOfAQuadraticEquation,
  quadraticEquationsWithOneRealSolution,
  modelingWithQuadraticEquations,
  equatingPolynomialCoefficients,
  vietasFormulas,
];
