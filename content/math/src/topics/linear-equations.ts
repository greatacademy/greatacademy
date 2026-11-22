import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, linear, num, poly, Q, relSymbol } from "@ga/subject-math";

import {
  article,
  choiceProblem,
  type ExpressionProblem,
  expressionProblem,
  type InequalityOp,
  inequalityLatex,
  inequalityProblem,
  numberProblem,
  steps,
  why,
} from "../problems.ts";

/** frac is the exact quotient a / b, for the values that mistakes produce. */
const frac = (a: number, b: number) => Q.of(a, b);

/** over writes a fraction of two LaTeX expressions. */
const over = (n: string | number, d: string | number) => `\\frac{${n}}{${d}}`;

/** signedOver writes k / d for an integer k with the sign in front: "-\frac{7}{a}". */
const signedOver = (k: number, d: string) => (k < 0 ? `-${over(-k, d)}` : over(k, d));

/** signed writes an integer as a term after another: "+ 5", "- 3". */
const signed = (n: number) => (n < 0 ? `- ${-n}` : `+ ${n}`);

/** paren writes an integer, in parentheses when it is negative: "5", "(-3)". */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

/** wrapped puts LaTeX in parentheses when it starts with a minus sign. */
const wrapped = (s: string) => (s.startsWith("-") ? `\\left(${s}\\right)` : s);

/** solveFor builds an expression problem whose field is preceded by "v =". */
function solveFor(variable: string, p: ExpressionProblem): Problem {
  return expressionProblem({ ...p, prefix: `${variable} =` });
}

/** equation writes an equation with its sides in either order. */
const equation = (rng: Rng, left: string, right: string) => (rng.bool() ? `${left} = ${right}` : `${right} = ${left}`);

/** moveConstant says how to remove the constant b from the side of the variable. */
const moveConstant = (b: number): Text =>
  b > 0 ? t(`subtract $${b}$ from both sides`, `两边同时减去 $${b}$`) : t(`add $${-b}$ to both sides`, `两边同时加上 $${-b}$`);

/** pick picks a multiple of step in [min, max]. */
const pickStep = (rng: Rng, [min, max, step]: readonly [number, number, number]) => min + step * rng.int(0, Math.floor((max - min) / step));

/** coefficientLetters are the letters used for unknown coefficients; x is the unknown. */
const coefficientLetters = ["a", "b", "c", "k", "m", "n", "p", "q", "r", "s"] as const;

/** letterTriples are sets of three letters for equations whose every coefficient is unknown. */
const letterTriples = [
  ["a", "b", "c"],
  ["m", "n", "p"],
  ["p", "q", "r"],
  ["k", "m", "n"],
  ["a", "b", "d"],
  ["r", "s", "t"],
  ["u", "v", "w"],
  ["a", "c", "d"],
] as const;

/** letterPool are the letters sampled for many-variable equations. */
const letterPool = ["a", "b", "c", "d", "h", "k", "m", "n", "p", "q", "r", "s", "t", "u", "v", "w"] as const;

/** letters samples n distinct letters; only the first n entries of the tuple are defined. */
const letters = (rng: Rng, n: number, pool: readonly string[] = letterPool) => rng.sample(pool, n) as [string, string, string, string];

const ops: readonly InequalityOp[] = ["<", "<=", ">", ">="];
const flip: Record<InequalityOp, InequalityOp> = { "<": ">", ">": "<", "<=": ">=", ">=": "<=" };

const solveText = (eq: string, assumption?: Text): Text =>
  assumption
    ? t(`Solve $${eq}$ for $x$. ${assumption.en}`, `解关于 $x$ 的方程 $${eq}$。${assumption["zh-CN"]}`)
    : t(`Solve $${eq}$ for $x$.`, `解关于 $x$ 的方程 $${eq}$。`);

const nonzero = (letters: string): Text => t(`Assume $${letters} \\ne 0$.`, `假设 $${letters} \\ne 0$。`);

const oneSolution = t("Assume the equation has exactly one solution.", "假设方程恰有一个解。");

export const linearEquationsWithUnknownCoefficients: TopicDef = {
  id: "linear-equations-with-unknown-coefficients",
  title: t("Solving Linear Equations With Unknown Coefficients", "解含字母系数的一元一次方程"),
  summary: t(
    "Solve linear equations such as $ax + b = c$ for $x$, writing the solution in terms of the other letters.",
    "解 $ax + b = c$ 这类关于 $x$ 的一次方程，用其他字母表示解。",
  ),
  prerequisites: ["equations-with-parentheses"],
  encompasses: [{ topic: "two-step-equations", weight: 0.6 }],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.3"],
  intro: t(
    `You can already solve $3x + 5 = 11$: subtract $5$ from both sides to get $3x = 6$, then divide by $3$ to get $x = 2$. Each step does the same thing to both sides, so the two sides stay equal.

Now suppose the $3$ is replaced by a letter, $ax + 5 = 11$, where $a$ stands for a number that is fixed but not told to us. We cannot get a single number for $x$, but we can still say exactly what $x$ is **in terms of** $a$. The same two steps work, because they never needed to know what $3$ was:

$$ax + 5 = 11 \\;\\Rightarrow\\; ax = 6 \\;\\Rightarrow\\; x = \\frac{6}{a}.$$

This one answer solves a whole family of equations at once. With $a = 3$ it gives $x = \\frac{6}{3} = 2$, the solution we found before; with $a = 2$ it gives $x = 3$, and indeed $2 \\cdot 3 + 5 = 11$.

There is one condition: we divided by $a$, and dividing by zero is impossible, so the answer holds when $a \\ne 0$. Equations like this appear whenever a formula is used with its letters still in place. In this lesson we solve them with one unknown coefficient, then with letters as constants, and finally with every coefficient a letter.`,
    `你已经会解 $3x + 5 = 11$：两边同时减去 $5$，得 $3x = 6$；再两边同时除以 $3$，得 $x = 2$。每一步都对两边做同样的运算，所以两边始终相等。

现在把 $3$ 换成一个字母：$ax + 5 = 11$，其中 $a$ 表示一个确定但没有告诉我们的数。我们得不到 $x$ 的具体数值，但仍然可以准确地**用 $a$ 表示** $x$。同样的两步依然有效，因为它们从来不需要知道 $3$ 是多少：

$$ax + 5 = 11 \\;\\Rightarrow\\; ax = 6 \\;\\Rightarrow\\; x = \\frac{6}{a}.$$

这一个答案一次解出了一整族方程。取 $a = 3$，得 $x = \\frac{6}{3} = 2$，正是前面的解；取 $a = 2$，得 $x = 3$，而确实 $2 \\cdot 3 + 5 = 11$。

有一个条件：我们除以了 $a$，而零不能作除数，所以这个答案在 $a \\ne 0$ 时成立。只要公式里的字母还没有换成数，就会遇到这样的方程。这节课先解只有一个字母系数的方程，再解常数是字母的方程，最后解所有系数都是字母的方程。`,
  ),
  knowledgePoints: [
    {
      id: "an-unknown-coefficient",
      title: t("An unknown coefficient", "字母系数"),
      explanation: t(
        `A letter other than $x$ stands for a fixed number that we are not told. Every rule for solving equations works for any number, so it works for this one too: treat the letter exactly as you would treat $3$ or $7$, and the solution comes out as an expression in that letter.

Take $ax + 5 = 12$. The operations done to $x$ are "multiply by $a$", then "add $5$". Undo them in the reverse order:

$$ax + 5 = 12 \\;\\Rightarrow\\; ax = 7 \\;\\Rightarrow\\; x = \\frac{7}{a} \\quad (a \\ne 0).$$

The second step divides by $a$, which is only possible when $a \\ne 0$; that is why the problem says so. If $x$ is **divided** by the letter instead, as in $\\frac{x}{a} - 3 = 4$, the last step is the opposite: add $3$ to get $\\frac{x}{a} = 7$, then multiply by $a$ to get $x = 7a$.

> **Watch out.** Move the constant with the opposite operation: from $ax + 5 = 12$, subtract $5$ to get $ax = 7$; adding it gives the wrong $ax = 17$. And undo what is really done to $x$: $ax$ is undone by dividing by $a$, but $\\frac{x}{a}$ by multiplying by $a$. The answers $\\frac{7}{a}$ and $7a$ are different numbers.`,
        `$x$ 以外的字母表示一个确定但没有告诉我们的数。解方程的每条规则对任何数都成立，所以对它也成立：像对待 $3$ 或 $7$ 一样对待这个字母，解就是一个含这个字母的式子。

以 $ax + 5 = 12$ 为例。作用在 $x$ 上的运算依次是"乘以 $a$"、"加上 $5$"。按相反的顺序抵消它们：

$$ax + 5 = 12 \\;\\Rightarrow\\; ax = 7 \\;\\Rightarrow\\; x = \\frac{7}{a} \\quad (a \\ne 0).$$

第二步要除以 $a$，只有 $a \\ne 0$ 时才能这样做，所以题目要求它不为零。如果 $x$ 是**被字母除**，比如 $\\frac{x}{a} - 3 = 4$，最后一步就相反：先两边加 $3$ 得 $\\frac{x}{a} = 7$，再两边乘以 $a$ 得 $x = 7a$。

> **注意。** 移走常数要用相反的运算：由 $ax + 5 = 12$ 应两边减去 $5$，得 $ax = 7$；加上 $5$ 会得到错误的 $ax = 17$。还要看清 $x$ 实际受到的运算：$ax$ 要除以 $a$ 来抵消，$\\frac{x}{a}$ 却要乘以 $a$ 来抵消。$\\frac{7}{a}$ 和 $7a$ 是不同的数。`,
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const a = rng.pick(coefficientLetters);
        const b = rng.nonZero(-15, 15);
        let c = rng.int(-20, 20);
        if (c === b) c = b + rng.nonZero(-9, 9);
        const d = c - b;
        const form = rng.int(0, 2);
        const move = moveConstant(b);
        const constant =
          b > 0
            ? t(`$${b}$ is added to the term with $x$`, `含 $x$ 的项加上了 $${b}$`)
            : t(`$${-b}$ is subtracted from the term with $x$`, `含 $x$ 的项减去了 $${-b}$`);
        const step1 = (line: string) =>
          t(
            `**Step 1: remove the constant.** On the side with $x$, ${constant.en}. To undo that, ${move.en}:${steps(line)}`,
            `**第一步：移走常数。** 在含 $x$ 的一边，${constant["zh-CN"]}。为了抵消它，${move["zh-CN"]}：${steps(line)}`,
          );
        if (form === 0) {
          const answer = signedOver(d, a);
          const eq = equation(rng, poly([1, `${a}x`], [b, ""]), num(c));
          const s1 = step1(`${a}x = ${num(d)}`);
          return solveFor("x", {
            prompt: solveText(eq, nonzero(a)),
            answer,
            wrong: [signedOver(c + b, a), poly([d, a]), `${over(num(c), a)} ${b > 0 ? "-" : "+"} ${Math.abs(b)}`, signedOver(-d, a)],
            solution: t(
              `${s1.en}**Step 2: divide by $${a}$.** Now $x$ is multiplied by $${a}$, which is not zero, so dividing both sides by $${a}$ leaves $x$ alone:${steps(`x = ${answer}`)}**Check.** Put $x = ${answer}$ into the side with $x$: $${a} \\cdot ${wrapped(answer)} ${signed(b)} = ${num(d)} ${signed(b)} = ${num(c)}$, which is the other side.`,
              `${s1["zh-CN"]}**第二步：除以 $${a}$。** 现在 $x$ 乘以了 $${a}$，而 $${a}$ 不为零，所以两边同时除以 $${a}$，$x$ 就单独留下：${steps(`x = ${answer}`)}**检验。** 把 $x = ${answer}$ 代入含 $x$ 的一边：$${a} \\cdot ${wrapped(answer)} ${signed(b)} = ${num(d)} ${signed(b)} = ${num(c)}$，等于另一边。`,
            ),
          });
        }
        if (form === 1) {
          const answer = signedOver(-d, a);
          const eq = equation(rng, poly([b, ""], [-1, `${a}x`]), num(c));
          const lone = t(`the number $${b}$ stands next to $-${a}x$`, `数 $${b}$ 和 $-${a}x$ 在一起`);
          return solveFor("x", {
            prompt: solveText(eq, nonzero(a)),
            answer,
            wrong: [signedOver(d, a), signedOver(b + c, a), poly([-d, a])],
            solution: t(
              `**Step 1: remove the constant.** On the side with $x$, ${lone.en}. To remove it, ${move.en}:${steps(`-${a}x = ${num(d)}`)}**Step 2: divide by $-${a}$.** The coefficient of $x$ is $-${a}$, not $${a}$: the minus sign in front of $${a}x$ belongs to it. Divide both sides by $-${a}$:${steps(`x = ${answer}`)}**Check.** With $x = ${answer}$, the term $${a}x$ is $${num(-d)}$, so the side with $x$ is $${num(b)} - ${paren(-d)} = ${num(c)}$, which is the other side.`,
              `**第一步：移走常数。** 在含 $x$ 的一边，${lone["zh-CN"]}。为了移走它，${move["zh-CN"]}：${steps(`-${a}x = ${num(d)}`)}**第二步：除以 $-${a}$。** $x$ 的系数是 $-${a}$，不是 $${a}$：$${a}x$ 前面的负号属于系数。两边同时除以 $-${a}$：${steps(`x = ${answer}`)}**检验。** 当 $x = ${answer}$ 时，$${a}x = ${num(-d)}$，所以含 $x$ 的一边是 $${num(b)} - ${paren(-d)} = ${num(c)}$，等于另一边。`,
            ),
          });
        }
        const answer = poly([d, a]);
        const eq = equation(rng, `\\frac{x}{${a}} ${b > 0 ? "+" : "-"} ${Math.abs(b)}`, num(c));
        const s1 = step1(`\\frac{x}{${a}} = ${num(d)}`);
        return solveFor("x", {
          prompt: solveText(eq, nonzero(a)),
          answer,
          wrong: [signedOver(d, a), poly([c + b, a]), poly([c, a], [-b, ""])],
          solution: t(
            `${s1.en}**Step 2: multiply by $${a}$.** Here $x$ is divided by $${a}$, and multiplying is the opposite of dividing, so multiply both sides by $${a}$:${steps(`x = ${answer}`)}**Check.** Put $x = ${answer}$ into the side with $x$: $\\frac{${answer}}{${a}} ${signed(b)} = ${num(d)} ${signed(b)} = ${num(c)}$, which is the other side.`,
            `${s1["zh-CN"]}**第二步：乘以 $${a}$。** 这里 $x$ 被 $${a}$ 除，乘法是除法的逆运算，所以两边同时乘以 $${a}$：${steps(`x = ${answer}`)}**检验。** 把 $x = ${answer}$ 代入含 $x$ 的一边：$\\frac{${answer}}{${a}} ${signed(b)} = ${num(d)} ${signed(b)} = ${num(c)}$，等于另一边。`,
          ),
        });
      },
    },
    {
      id: "unknown-constants",
      title: t("Unknown constants", "字母常数"),
      explanation: t(
        `When the constants are letters, they cannot be combined: $c - b$ is already as simple as it gets, because we do not know what $c$ and $b$ are. So the solution keeps them together as a sum or a difference.

Solve $3x + b = c$. Subtracting $b$ from both sides gives $3x = c - b$. Now $x$ is multiplied by $3$, so divide both sides by $3$. The right side is the **whole** quantity $c - b$, so all of it is divided:

$$3x + b = c \\;\\Rightarrow\\; 3x = c - b \\;\\Rightarrow\\; x = \\frac{c - b}{3}.$$

When $x$ sits inside parentheses, as in $3(x + b) = c$, the multiplication by $3$ is the last thing done, so it is undone first: $x + b = \\frac{c}{3}$, and then $x = \\frac{c}{3} - b$.

> **Watch out.** In $3x = c - b$, dividing only $c$ by $3$ gives $\\frac{c}{3} - b$, which is wrong: both terms must be divided, $\\frac{c - b}{3}$. Also watch the sign of the letter you move: from $3x + b = c$, it is $c - b$, not $c + b$.`,
        `常数是字母时，它们不能合并：$c - b$ 已经是最简的形式，因为我们不知道 $c$ 和 $b$ 是多少。所以解中把它们保留为和或差。

解 $3x + b = c$。两边同时减去 $b$，得 $3x = c - b$。现在 $x$ 乘以了 $3$，所以两边同时除以 $3$。右边是**整个** $c - b$，所以要把它整体除以 $3$：

$$3x + b = c \\;\\Rightarrow\\; 3x = c - b \\;\\Rightarrow\\; x = \\frac{c - b}{3}.$$

如果 $x$ 在括号里，比如 $3(x + b) = c$，乘以 $3$ 是最后做的运算，所以要先抵消它：$x + b = \\frac{c}{3}$，再得 $x = \\frac{c}{3} - b$。

> **注意。** 在 $3x = c - b$ 中，只把 $c$ 除以 $3$ 会得到 $\\frac{c}{3} - b$，这是错的：两项都要除，应为 $\\frac{c - b}{3}$。另外要注意移走的字母的符号：由 $3x + b = c$ 得 $c - b$，不是 $c + b$。`,
      ),
      generate(rng) {
        const [, b, c] = rng.pick(letterTriples);
        const k = rng.sign() * rng.int(2, 9);
        const kx = poly([k, "x"]);
        /** quotient writes (s·c + u·b) / k with a positive denominator. */
        const quotient = (sc: number, sb: number) => {
          const [pc, pb] = k < 0 ? [-sc, -sb] : [sc, sb];
          const top = pc > 0 ? poly([pc, c], [pb, b]) : poly([pb, b], [pc, c]);
          return over(top, Math.abs(k));
        };
        const form = rng.int(0, 2);
        if (form === 2) {
          const part = `${k < 0 ? "-" : ""}${over(c, Math.abs(k))}`;
          const answer = `${part} - ${b}`;
          const eq = equation(rng, `${k}(x + ${b})`, c);
          return solveFor("x", {
            prompt: solveText(eq),
            answer,
            wrong: [quotient(1, -1), `${over(c, k)} + ${b}`, poly([1, c], [-k, b])],
            solution: t(
              `**Step 1: divide by $${k}$.** The parentheses are multiplied by $${k}$, and that is the last thing done to $x$, so undo it first by dividing both sides by $${k}$:${steps(`x + ${b} = ${part}`)}**Step 2: subtract $${b}$.** Now $${b}$ is added to $x$, so subtract $${b}$ from both sides. The letters $${c}$ and $${b}$ cannot be combined, so the answer keeps both:${steps(`x = ${answer}`)}**Check.** Inside the parentheses, $${answer} + ${b} = ${part}$, and $${k} \\cdot ${wrapped(part)} = ${c}$, as required.`,
              `**第一步：除以 $${k}$。** 括号乘以了 $${k}$，这是作用在 $x$ 上的最后一个运算，所以先两边同时除以 $${k}$ 来抵消它：${steps(`x + ${b} = ${part}`)}**第二步：减去 $${b}$。** 现在 $x$ 加上了 $${b}$，所以两边同时减去 $${b}$。字母 $${c}$ 和 $${b}$ 不能合并，答案中两个都保留：${steps(`x = ${answer}`)}**检验。** 括号里 $${answer} + ${b} = ${part}$，而 $${k} \\cdot ${wrapped(part)} = ${c}$，符合要求。`,
            ),
          });
        }
        const sign = form === 0 ? 1 : -1;
        const answer = quotient(1, -sign);
        const lhs = `${kx} ${sign > 0 ? "+" : "-"} ${b}`;
        const eq = equation(rng, lhs, c);
        const moved = poly([1, c], [-sign, b]);
        const negative =
          k < 0
            ? t(
                ` Dividing by $${k}$ changes the sign of each term on top, so the answer is written with the positive denominator $${-k}$.`,
                `除以 $${k}$ 会改变分子每一项的符号，所以答案写成分母为正数 $${-k}$ 的形式。`,
              )
            : t("", "");
        return solveFor("x", {
          prompt: solveText(eq),
          answer,
          wrong: [quotient(1, sign), `${over(c, k)} ${sign > 0 ? "-" : "+"} ${b}`, `${k}(${moved})`, over(moved, -k)],
          solution: t(
            `**Step 1: move $${b}$.** On the side with $x$, $${b}$ is ${sign > 0 ? "added" : "subtracted"}, so ${sign > 0 ? `subtract $${b}$ from` : `add $${b}$ to`} both sides. The letters $${c}$ and $${b}$ cannot be combined:${steps(`${kx} = ${moved}`)}**Step 2: divide by $${k}$.** $x$ is multiplied by $${k}$, so divide the **whole** right side by $${k}$.${negative.en}${steps(`x = ${answer}`)}**Check.** Multiplying the answer by $${k}$ gives back $${moved}$, so the side with $x$ becomes $${moved} ${sign > 0 ? "+" : "-"} ${b} = ${c}$, which is the other side.`,
            `**第一步：移走 $${b}$。** 在含 $x$ 的一边${sign > 0 ? "加" : "减"}了 $${b}$，所以两边同时${sign > 0 ? `减去 $${b}$` : `加上 $${b}$`}。字母 $${c}$ 和 $${b}$ 不能合并：${steps(`${kx} = ${moved}`)}**第二步：除以 $${k}$。** $x$ 乘以了 $${k}$，所以把右边**整体**除以 $${k}$。${negative["zh-CN"]}${steps(`x = ${answer}`)}**检验。** 答案乘以 $${k}$ 就回到 $${moved}$，所以含 $x$ 的一边变成 $${moved} ${sign > 0 ? "+" : "-"} ${b} = ${c}$，等于另一边。`,
          ),
        });
      },
    },
    {
      id: "all-coefficients-unknown",
      title: t("Every coefficient unknown", "系数全是字母"),
      explanation: t(
        `With letters everywhere, the method does not change: look at what is done to $x$, in order, and undo it in the **reverse** order, doing the same to both sides each time. The last operation applied to $x$ is the first one to undo, just as the last thing you put on, a coat over a sweater, is the first thing you take off.

In $ax - b = c$, $x$ is first multiplied by $a$, then $b$ is subtracted. So add $b$ first, then divide by $a$:

$$ax - b = c \\;\\Rightarrow\\; ax = c + b \\;\\Rightarrow\\; x = \\frac{b + c}{a}.$$

In $a(x + b) = c$, the order is the other way round: $b$ is added first, and the sum is multiplied by $a$. So divide by $a$ first, then subtract $b$:

$$a(x + b) = c \\;\\Rightarrow\\; x + b = \\frac{c}{a} \\;\\Rightarrow\\; x = \\frac{c}{a} - b.$$

Whatever we divide by is assumed not to be zero.

> **Watch out.** Undo the operations in the reverse order of how they were done. From $a(x + b) = c$, subtracting $b$ first and writing $\\frac{c - b}{a}$ is wrong: $b$ is inside the parentheses, so it is multiplied by $a$ too. Put your answer back into the equation to catch this.`,
        `到处都是字母时，方法不变：看清 $x$ 依次受到哪些运算，再按**相反**的顺序抵消它们，每次都对两边做同样的运算。最后作用在 $x$ 上的运算最先抵消，就像最后穿上的外套要最先脱下。

在 $ax - b = c$ 中，$x$ 先乘以 $a$，再减去 $b$。所以先两边加 $b$，再除以 $a$：

$$ax - b = c \\;\\Rightarrow\\; ax = c + b \\;\\Rightarrow\\; x = \\frac{b + c}{a}.$$

在 $a(x + b) = c$ 中，顺序反过来：先加上 $b$，再把和乘以 $a$。所以先除以 $a$，再减去 $b$：

$$a(x + b) = c \\;\\Rightarrow\\; x + b = \\frac{c}{a} \\;\\Rightarrow\\; x = \\frac{c}{a} - b.$$

假设所除的数都不为零。

> **注意。** 要按运算顺序的相反顺序来抵消。由 $a(x + b) = c$ 先减去 $b$、写成 $\\frac{c - b}{a}$ 是错的：$b$ 在括号里，它也被乘以了 $a$。把答案代回方程就能发现这类错误。`,
      ),
      generate(rng) {
        const [a, b, c] = rng.pick(letterTriples);
        const sub = (v: string) => t(`subtract $${v}$ from both sides`, `两边同时减去 $${v}$`);
        const add = (v: string) => t(`add $${v}$ to both sides`, `两边同时加上 $${v}$`);
        const div = (v: string) => t(`divide both sides by $${v}$`, `两边同时除以 $${v}$`);
        const mul = (v: string) => t(`multiply both sides by $${v}$`, `两边同时乘以 $${v}$`);
        const forms = [
          {
            eq: `${a}x + ${b}`,
            answer: over(`${c} - ${b}`, a),
            wrong: [over(`${c} + ${b}`, a), `${over(c, a)} - ${b}`, over(a, `${c} - ${b}`)],
            order: t(`$x$ is multiplied by $${a}$, then $${b}$ is added`, `$x$ 先乘以 $${a}$，再加上 $${b}$`),
            first: sub(b),
            work: `${a}x = ${c} - ${b}`,
            second: div(a),
            check: `${a} \\cdot ${over(`${c} - ${b}`, a)} + ${b} = (${c} - ${b}) + ${b} = ${c}`,
            nz: a,
          },
          {
            eq: `${a}x - ${b}`,
            answer: over(`${b} + ${c}`, a),
            wrong: [over(`${c} - ${b}`, a), `${over(c, a)} + ${b}`, `${a}(${b} + ${c})`],
            order: t(`$x$ is multiplied by $${a}$, then $${b}$ is subtracted`, `$x$ 先乘以 $${a}$，再减去 $${b}$`),
            first: add(b),
            work: `${a}x = ${c} + ${b}`,
            second: div(a),
            check: `${a} \\cdot ${over(`${b} + ${c}`, a)} - ${b} = (${b} + ${c}) - ${b} = ${c}`,
            nz: a,
          },
          {
            eq: `${b} - ${a}x`,
            answer: over(`${b} - ${c}`, a),
            wrong: [over(`${c} - ${b}`, a), over(`${b} + ${c}`, a), `${b} - ${over(c, a)}`],
            order: t(
              `$x$ is multiplied by $${a}$, then the product is subtracted from $${b}$`,
              `$x$ 先乘以 $${a}$，再用 $${b}$ 减去这个积`,
            ),
            first: sub(b),
            work: `-${a}x = ${c} - ${b}`,
            second: t(
              `divide both sides by $-${a}$; dividing $${c} - ${b}$ by $-${a}$ changes the sign of both terms`,
              `两边同时除以 $-${a}$；$${c} - ${b}$ 除以 $-${a}$ 时两项都变号`,
            ),
            check: `${b} - ${a} \\cdot ${over(`${b} - ${c}`, a)} = ${b} - (${b} - ${c}) = ${c}`,
            nz: a,
          },
          {
            eq: `${a}(x + ${b})`,
            answer: `${over(c, a)} - ${b}`,
            wrong: [over(`${c} - ${b}`, a), `${over(c, a)} + ${b}`, `${c} - ${a}${b}`],
            order: t(`$${b}$ is added to $x$, then the sum is multiplied by $${a}$`, `$x$ 先加上 $${b}$，再把和乘以 $${a}$`),
            first: div(a),
            work: `x + ${b} = ${over(c, a)}`,
            second: sub(b),
            check: `${a}\\left(${over(c, a)} - ${b} + ${b}\\right) = ${a} \\cdot ${over(c, a)} = ${c}`,
            nz: a,
          },
          {
            eq: `\\frac{x}{${a}} + ${b}`,
            answer: `${a}(${c} - ${b})`,
            wrong: [over(`${c} - ${b}`, a), `${a}${c} - ${b}`, `${a}(${c} + ${b})`],
            order: t(`$x$ is divided by $${a}$, then $${b}$ is added`, `$x$ 先除以 $${a}$，再加上 $${b}$`),
            first: sub(b),
            work: `\\frac{x}{${a}} = ${c} - ${b}`,
            second: mul(a),
            check: `\\frac{${a}(${c} - ${b})}{${a}} + ${b} = (${c} - ${b}) + ${b} = ${c}`,
            nz: a,
          },
          {
            eq: `\\frac{${a}x}{${b}}`,
            answer: over(`${b}${c}`, a),
            wrong: [over(`${a}${c}`, b), over(`${a}${b}`, c), over(c, `${a}${b}`)],
            order: t(`$x$ is multiplied by $${a}$, then divided by $${b}$`, `$x$ 先乘以 $${a}$，再除以 $${b}$`),
            first: mul(b),
            work: `${a}x = ${b}${c}`,
            second: div(a),
            check: `\\frac{${a} \\cdot ${over(`${b}${c}`, a)}}{${b}} = \\frac{${b}${c}}{${b}} = ${c}`,
            nz: `${a}, ${b}`,
          },
        ];
        const f = rng.pick(forms);
        const eq = equation(rng, f.eq, c);
        return solveFor("x", {
          prompt: solveText(eq, nonzero(f.nz)),
          answer: f.answer,
          wrong: f.wrong,
          solution: t(
            `In $${f.eq}$, ${f.order.en}. Undo these in the reverse order.

**Step 1: undo the last operation.** ${f.first.en[0]!.toUpperCase()}${f.first.en.slice(1)}:${steps(f.work)}**Step 2: undo the first operation.** ${f.second.en[0]!.toUpperCase()}${f.second.en.slice(1)}:${steps(`x = ${f.answer}`)}**Check.** Put the answer back into the side with $x$: $${f.check}$, as required.`,
            `在 $${f.eq}$ 中，${f.order["zh-CN"]}。按相反的顺序抵消它们。

**第一步：抵消最后的运算。** ${f.first["zh-CN"]}：${steps(f.work)}**第二步：抵消最先的运算。** ${f.second["zh-CN"]}：${steps(`x = ${f.answer}`)}**检验。** 把答案代回含 $x$ 的一边：$${f.check}$，符合要求。`,
          ),
        });
      },
    },
  ],
};

export const unknownCoefficientsByFactoring: TopicDef = {
  id: "unknown-coefficients-by-factoring",
  title: t("Solving Linear Equations With Unknown Coefficients by Factoring", "用提取公因式解含字母系数的方程"),
  summary: t(
    "Collect the terms with $x$, factor $x$ out, and divide: $ax + bx = c$ gives $x = \\frac{c}{a + b}$.",
    "把含 $x$ 的项移到一边，提出 $x$ 再相除：由 $ax + bx = c$ 得 $x = \\frac{c}{a + b}$。",
  ),
  prerequisites: ["linear-equations-with-unknown-coefficients"],
  encompasses: [
    { topic: "linear-equations-with-unknown-coefficients", weight: 0.5 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.4 },
    { topic: "distributive-property", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.3"],
  intro: t(
    `So far $x$ appeared in a single term, such as $ax$, and dividing by its coefficient finished the job. Now $x$ appears in two terms whose coefficients are letters, as in $ax + bx = c$. With numbers, $3x + 5x = 16$ is easy: combine the terms into $8x = 16$, so $x = 2$. With letters, we cannot add $a$ and $b$ into one number, because we do not know them.

The distributive property gives a way round this. It says $x(a + b) = ax + bx$; read from right to left, it lets us pull the common factor $x$ out of both terms. The sum $a + b$ then plays the part that $8$ played:

$$ax + bx = c \\;\\Rightarrow\\; x(a + b) = c \\;\\Rightarrow\\; x = \\frac{c}{a + b}.$$

With $a = 3$, $b = 5$ and $c = 16$, this gives $x = \\frac{16}{8} = 2$, the same answer as before.

The division needs $a + b \\ne 0$. When the factor is zero, the equation has no solution or every number is a solution, so these problems say that the equation has exactly one solution. In this lesson we factor $x$ out directly, then after collecting the terms with $x$ on one side, and finally after expanding parentheses.`,
    `前面 $x$ 只出现在一项中，比如 $ax$，除以它的系数就解完了。现在 $x$ 出现在两项中，而且系数都是字母，比如 $ax + bx = c$。如果是数，$3x + 5x = 16$ 很简单：合并成 $8x = 16$，所以 $x = 2$。换成字母后，$a$ 和 $b$ 不能加成一个数，因为我们不知道它们是多少。

分配律提供了办法。它说 $x(a + b) = ax + bx$；从右往左读，就能把两项的公因式 $x$ 提出来。这时和 $a + b$ 起到了 $8$ 的作用：

$$ax + bx = c \\;\\Rightarrow\\; x(a + b) = c \\;\\Rightarrow\\; x = \\frac{c}{a + b}.$$

取 $a = 3$，$b = 5$，$c = 16$，得 $x = \\frac{16}{8} = 2$，与前面的答案相同。

相除要求 $a + b \\ne 0$。这个因式为零时，方程要么无解，要么任何数都是解，所以这类题目都说明方程恰有一个解。这节课先直接提出 $x$，再练习先把含 $x$ 的项移到一边再提，最后练习先展开括号再提。`,
  ),
  knowledgePoints: [
    {
      id: "factoring-out-x",
      title: t("Factoring out $x$", "提出 $x$"),
      explanation: t(
        `When $x$ appears in two terms on the same side, such as $ax + bx$, the coefficients $a$ and $b$ cannot be added into a single number. But both terms contain $x$, and the distributive property, read backwards, takes it out: $ax + bx = x(a + b)$. Now $x$ is in one place, multiplied by the factor $a + b$, and dividing by that factor finishes:

$$ax + bx = c \\;\\Rightarrow\\; x(a + b) = c \\;\\Rightarrow\\; x = \\frac{c}{a + b}.$$

The same works when one coefficient is a number. For $ax - 3x = 5$, factoring gives $x(a - 3) = 5$, so $x = \\frac{5}{a - 3}$. To see that factoring changed nothing, expand $x(a - 3)$: it is $ax - 3x$ again.

Dividing needs the factor to be nonzero, which is exactly what "the equation has exactly one solution" guarantees.

> **Watch out.** The term $bx$ contains $x$, so it is not a constant to move to the other side: writing $ax = c - b$ loses the $x$ in $bx$. And the factor left after taking out $x$ is the **sum** $a + b$, not the product $ab$; keep the sign of each term too, so $ax - 3x$ gives $a - 3$, not $a + 3$.`,
        `当 $x$ 出现在同一边的两项中，比如 $ax + bx$，系数 $a$ 和 $b$ 不能加成一个数。但两项都含有 $x$，把分配律倒过来用，就能把它提出来：$ax + bx = x(a + b)$。现在 $x$ 只出现在一处，乘以因式 $a + b$，再除以这个因式就解完了：

$$ax + bx = c \\;\\Rightarrow\\; x(a + b) = c \\;\\Rightarrow\\; x = \\frac{c}{a + b}.$$

其中一个系数是数时也一样。对于 $ax - 3x = 5$，提公因式得 $x(a - 3) = 5$，所以 $x = \\frac{5}{a - 3}$。要确认提公因式没有改变什么，把 $x(a - 3)$ 展开：又得到 $ax - 3x$。

相除要求这个因式不为零，"方程恰有一个解"正好保证了这一点。

> **注意。** $bx$ 含有 $x$，所以它不是可以移到另一边的常数：写成 $ax = c - b$ 就丢掉了 $bx$ 中的 $x$。提出 $x$ 后剩下的因式是**和** $a + b$，不是积 $ab$；每一项的符号也要保留，$ax - 3x$ 得到 $a - 3$，不是 $a + 3$。`,
      ),
      keyPrerequisites: ["distributive-property"],
      generate(rng) {
        const [a, b, c] = rng.pick(letterTriples);
        const s = rng.sign();
        const letter = rng.bool();
        const n = rng.nonZero(-9, 9);
        const second = letter ? `${s > 0 ? "+" : "-"} ${b}x` : `${n > 0 ? "+" : "-"} ${poly([Math.abs(n), "x"])}`;
        const secondAbs = letter ? b : String(Math.abs(n));
        const sv = letter ? s : Math.sign(n);
        const den = letter ? poly([1, a], [s, b]) : poly([1, a], [n, ""]);
        const flipped = letter ? poly([1, a], [-s, b]) : poly([1, a], [-n, ""]);
        const product = letter ? `${s < 0 ? "-" : ""}${a}${b}` : poly([n, a]);
        const m = rng.nonZero(-20, 20);
        const rhs = rng.bool() ? c : num(m);
        const answer = rhs === c || m > 0 ? over(rhs, den) : `-${over(-m, den)}`;
        const eq = equation(rng, `${a}x ${second}`, rhs);
        return solveFor("x", {
          prompt: solveText(eq, oneSolution),
          answer,
          wrong: [over(`${rhs} ${sv > 0 ? "-" : "+"} ${secondAbs}`, a), over(rhs, flipped), over(rhs, product)],
          solution: t(
            `**Step 1: factor out $x$.** Both terms of $${a}x ${second}$ contain $x$, but their coefficients cannot be added into one number. By the distributive property, take $x$ out, keeping the sign of each coefficient:${steps(`x(${den}) = ${rhs}`)}**Step 2: divide by the factor.** Now $x$ is multiplied by $${den}$, which is not zero because the equation has exactly one solution. Divide both sides by it:${steps(`x = ${answer}`)}**Check.** The side with $x$ is $x(${den})$, and $(${den}) \\cdot ${wrapped(answer)} = ${rhs}$, which is the other side.`,
            `**第一步：提出 $x$。** $${a}x ${second}$ 的两项都含有 $x$，但它们的系数不能加成一个数。由分配律把 $x$ 提出来，保留每个系数的符号：${steps(`x(${den}) = ${rhs}`)}**第二步：除以因式。** 现在 $x$ 乘以了 $${den}$，因为方程恰有一个解，它不为零。两边同时除以它：${steps(`x = ${answer}`)}**检验。** 含 $x$ 的一边是 $x(${den})$，而 $(${den}) \\cdot ${wrapped(answer)} = ${rhs}$，等于另一边。`,
          ),
        });
      },
    },
    {
      id: "collecting-then-factoring",
      title: t("Collecting, then factoring", "先移项，再提公因式"),
      explanation: t(
        `When $x$ appears on both sides, factoring cannot start yet: the terms with $x$ must first be on the **same** side. So the work has three steps:

1. Move every term with $x$ to one side and every other term to the other side, by subtracting or adding the same term on both sides.
2. Factor $x$ out of the side with $x$.
3. Divide by the factor that is left.

For $ax + b = cx + d$: subtract $cx$ and $b$ from both sides, so that $x$ is only on the left, then factor and divide:

$$ax + b = cx + d \\;\\Rightarrow\\; ax - cx = d - b \\;\\Rightarrow\\; x(a - c) = d - b \\;\\Rightarrow\\; x = \\frac{d - b}{a - c}.$$

With numbers in place of the letters, say $5x + 1 = 2x + 7$, the same steps give $3x = 6$ and $x = 2$, and $\\frac{7 - 1}{5 - 2} = 2$ agrees.

> **Watch out.** A term changes sign when it moves to the other side: $cx$ on the right becomes $-cx$ on the left, so the factor is $a - c$, not $a + c$. In the same way $b$ becomes $-b$, so the top is $d - b$, not $d + b$ or $b - d$.`,
        `当 $x$ 出现在两边时，还不能马上提公因式：必须先让含 $x$ 的项都在**同一**边。所以分三步：

1. 两边同时减去或加上同一项，把所有含 $x$ 的项移到一边，其余的项移到另一边。
2. 从含 $x$ 的一边提出 $x$。
3. 除以剩下的因式。

对于 $ax + b = cx + d$：两边同时减去 $cx$ 和 $b$，让 $x$ 只在左边，再提公因式、相除：

$$ax + b = cx + d \\;\\Rightarrow\\; ax - cx = d - b \\;\\Rightarrow\\; x(a - c) = d - b \\;\\Rightarrow\\; x = \\frac{d - b}{a - c}.$$

把字母换成数，比如 $5x + 1 = 2x + 7$，同样的步骤得 $3x = 6$，$x = 2$，而 $\\frac{7 - 1}{5 - 2} = 2$ 也吻合。

> **注意。** 一项移到另一边时要变号：右边的 $cx$ 到左边变成 $-cx$，所以因式是 $a - c$，不是 $a + c$。同样，$b$ 变成 $-b$，所以分子是 $d - b$，不是 $d + b$ 或 $b - d$。`,
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const [a, b, c, d] = letters(rng, 4);
          const answer = over(`${d} - ${b}`, `${a} - ${c}`);
          const eq = equation(rng, `${a}x + ${b}`, `${c}x + ${d}`);
          return solveFor("x", {
            prompt: solveText(eq, oneSolution),
            answer,
            wrong: [over(`${d} - ${b}`, `${a} + ${c}`), over(`${d} + ${b}`, `${a} - ${c}`), over(`${b} - ${d}`, `${a} - ${c}`)],
            solution: t(
              `**Step 1: collect.** Bring the terms with $x$ to the side of $${a}x$ and the others to the side of $${d}$: subtract $${c}x$ and $${b}$ from both sides. Each term changes sign as it crosses:${steps(`${a}x - ${c}x = ${d} - ${b}`)}**Step 2: factor.** Both terms on the left contain $x$; take it out:${steps(`x(${a} - ${c}) = ${d} - ${b}`)}**Step 3: divide.** The factor $${a} - ${c}$ is not zero, since the equation has exactly one solution:${steps(`x = ${answer}`)}**Check.** The side with $${a}x$ minus the side with $${c}x$ is $(${a} - ${c})x + ${b} - ${d}$. With the answer, $(${a} - ${c})x = ${d} - ${b}$, so the difference is $${d} - ${b} + ${b} - ${d} = 0$: the two sides are equal.`,
              `**第一步：移项。** 把含 $x$ 的项移到 $${a}x$ 所在的一边，其余的项移到 $${d}$ 所在的一边：两边同时减去 $${c}x$ 和 $${b}$。每一项移过去都要变号：${steps(`${a}x - ${c}x = ${d} - ${b}`)}**第二步：提公因式。** 左边两项都含有 $x$，把它提出来：${steps(`x(${a} - ${c}) = ${d} - ${b}`)}**第三步：相除。** 因为方程恰有一个解，因式 $${a} - ${c}$ 不为零：${steps(`x = ${answer}`)}**检验。** 含 $${a}x$ 的一边减去含 $${c}x$ 的一边，得 $(${a} - ${c})x + ${b} - ${d}$。代入答案，$(${a} - ${c})x = ${d} - ${b}$，所以差是 $${d} - ${b} + ${b} - ${d} = 0$：两边相等。`,
            ),
          });
        }
        if (kind === 1) {
          const a = rng.pick(coefficientLetters);
          const n = rng.nonZero(-9, 9);
          const b = rng.nonZero(-12, 12);
          let c = rng.int(-15, 15);
          if (c === b) c = b + rng.nonZero(-6, 6);
          const d = c - b;
          const den = poly([1, a], [-n, ""]);
          const answer = d > 0 ? over(d, den) : over(-d, poly([n, ""], [-1, a]));
          const eq = equation(rng, poly([1, `${a}x`], [b, ""]), poly([n, "x"], [c, ""]));
          const nx = poly([n, "x"]);
          const negative =
            d < 0
              ? t(
                  ` To keep the top positive, multiply the top and the bottom by $-1$; that does not change the fraction.`,
                  `为了让分子为正，分子分母同时乘以 $-1$，分数的值不变。`,
                )
              : t("", "");
          return solveFor("x", {
            prompt: solveText(eq, oneSolution),
            answer,
            wrong: [signedOver(d, poly([1, a], [n, ""])), signedOver(c + b, den), signedOver(-d, den)],
            solution: t(
              `**Step 1: collect.** Subtract $${nx}$ from both sides so that $x$ is only on the side of $${a}x$, and ${moveConstant(b).en}, so that the numbers are on the other side:${steps(`${a}x ${n > 0 ? "-" : "+"} ${poly([Math.abs(n), "x"])} = ${num(d)}`)}**Step 2: factor.** Take $x$ out of both terms; the coefficient $${-n}$ of the second term goes into the parentheses with its sign:${steps(`x(${den}) = ${num(d)}`)}**Step 3: divide** by $${den}$, which is not zero because the equation has exactly one solution.${negative.en}${steps(`x = ${answer}`)}**Check.** The side with $${a}x$ minus the side with $${nx}$ is $(${den})x ${signed(-d)}$. With the answer, $(${den})x = ${num(d)}$, so the difference is $${num(d)} ${signed(-d)} = 0$: the two sides are equal.`,
              `**第一步：移项。** 两边同时减去 $${nx}$，让 $x$ 只在 $${a}x$ 所在的一边；再${moveConstant(b)["zh-CN"]}，让数都在另一边：${steps(`${a}x ${n > 0 ? "-" : "+"} ${poly([Math.abs(n), "x"])} = ${num(d)}`)}**第二步：提公因式。** 从两项中提出 $x$；第二项的系数 $${-n}$ 连同符号放进括号：${steps(`x(${den}) = ${num(d)}`)}**第三步：相除。** 除以 $${den}$；因为方程恰有一个解，它不为零。${negative["zh-CN"]}${steps(`x = ${answer}`)}**检验。** 含 $${a}x$ 的一边减去含 $${nx}$ 的一边，得 $(${den})x ${signed(-d)}$。代入答案，$(${den})x = ${num(d)}$，所以差是 $${num(d)} ${signed(-d)} = 0$：两边相等。`,
            ),
          });
        }
        const [a, b, c] = letters(rng, 3);
        const answer = over(b, `${a} + ${c}`);
        const eq = equation(rng, `${a}x`, `${b} - ${c}x`);
        return solveFor("x", {
          prompt: solveText(eq, oneSolution),
          answer,
          wrong: [over(b, `${a} - ${c}`), over(`${b} - ${c}`, a), over(b, `${a}${c}`)],
          solution: t(
            `**Step 1: collect.** The term $-${c}x$ is on the other side from $${a}x$. Add $${c}x$ to both sides to bring it over:${steps(`${a}x + ${c}x = ${b}`)}**Step 2: factor.** Take $x$ out of both terms:${steps(`x(${a} + ${c}) = ${b}`)}**Step 3: divide** by $${a} + ${c}$, which is not zero because the equation has exactly one solution:${steps(`x = ${answer}`)}**Check.** With the answer, $${a}x + ${c}x = (${a} + ${c}) \\cdot ${answer} = ${b}$, so $${a}x = ${b} - ${c}x$, which is the equation.`,
            `**第一步：移项。** $-${c}x$ 与 $${a}x$ 不在同一边。两边同时加上 $${c}x$，把它移过来：${steps(`${a}x + ${c}x = ${b}`)}**第二步：提公因式。** 从两项中提出 $x$：${steps(`x(${a} + ${c}) = ${b}`)}**第三步：相除。** 除以 $${a} + ${c}$；因为方程恰有一个解，它不为零：${steps(`x = ${answer}`)}**检验。** 代入答案，$${a}x + ${c}x = (${a} + ${c}) \\cdot ${answer} = ${b}$，所以 $${a}x = ${b} - ${c}x$，正是原方程。`,
          ),
        });
      },
    },
    {
      id: "expanding-then-factoring",
      title: t("Expanding, then factoring", "先展开，再提公因式"),
      explanation: t(
        `If $x$ is inside parentheses, the terms with $x$ cannot be collected yet, because $x$ is tied to the other terms in the parentheses. So expand first with the distributive property; then the method is the one you know: collect the terms with $x$ on one side, factor out $x$, and divide by the factor that is left.

Solve $a(x + 2) = 5x + b$ for $x$. Expanding gives $ax + 2a$. Then subtract $5x$ and $2a$ from both sides:

$$a(x + 2) = 5x + b \\;\\Rightarrow\\; ax + 2a = 5x + b \\;\\Rightarrow\\; ax - 5x = b - 2a \\;\\Rightarrow\\; x(a - 5) = b - 2a \\;\\Rightarrow\\; x = \\frac{b - 2a}{a - 5}.$$

Notice that $2a$ contains no $x$: it is a constant, even though it contains a letter, so it goes to the side without $x$.

> **Watch out.** Multiply **every** term in the parentheses: $a(x + 2)$ is $ax + 2a$, not $ax + 2$. Forgetting this gives $\\frac{b - 2}{a - 5}$. And when $2a$ moves across, it becomes $-2a$, so the top is $b - 2a$, not $b + 2a$.`,
        `如果 $x$ 在括号里，含 $x$ 的项还不能移到一起，因为 $x$ 和括号里的其他项连在一起。所以先用分配律展开；之后就是熟悉的方法：把含 $x$ 的项移到一边，提出 $x$，再除以剩下的因式。

从 $a(x + 2) = 5x + b$ 中解出 $x$。展开得 $ax + 2a$。再两边同时减去 $5x$ 和 $2a$：

$$a(x + 2) = 5x + b \\;\\Rightarrow\\; ax + 2a = 5x + b \\;\\Rightarrow\\; ax - 5x = b - 2a \\;\\Rightarrow\\; x(a - 5) = b - 2a \\;\\Rightarrow\\; x = \\frac{b - 2a}{a - 5}.$$

注意 $2a$ 中没有 $x$：虽然含有字母，它仍是常数，所以要移到不含 $x$ 的一边。

> **注意。** 括号里的**每一项**都要乘：$a(x + 2)$ 是 $ax + 2a$，不是 $ax + 2$。漏乘会得到 $\\frac{b - 2}{a - 5}$。$2a$ 移到另一边时变成 $-2a$，所以分子是 $b - 2a$，不是 $b + 2a$。`,
      ),
      generate(rng) {
        if (rng.bool()) {
          const [a, b, c] = letters(rng, 3);
          const s = rng.sign();
          // a(x + s·b) = cx  ⇒  x(a - c) = -s·ab
          const answer = s > 0 ? over(`${a}${b}`, `${c} - ${a}`) : over(`${a}${b}`, `${a} - ${c}`);
          const wrongDen = s > 0 ? `${a} - ${c}` : `${c} - ${a}`;
          const eq = equation(rng, `${a}(x ${s > 0 ? "+" : "-"} ${b})`, `${c}x`);
          const rhs = `${s > 0 ? "-" : ""}${a}${b}`;
          const tidy =
            s > 0
              ? t(
                  ` Multiplying the top and the bottom by $-1$ removes the minus sign: $\\frac{-${a}${b}}{${a} - ${c}} = ${answer}$.`,
                  `分子分母同时乘以 $-1$，去掉负号：$\\frac{-${a}${b}}{${a} - ${c}} = ${answer}$。`,
                )
              : t("", "");
          return solveFor("x", {
            prompt: solveText(eq, oneSolution),
            answer,
            wrong: [over(`${a}${b}`, wrongDen), over(b, s > 0 ? `${c} - ${a}` : `${a} - ${c}`), over(`${a}${b}`, `${a} + ${c}`)],
            solution: t(
              `**Step 1: expand.** Multiply both terms in the parentheses by $${a}$:${steps(`${a}x ${s > 0 ? "+" : "-"} ${a}${b} = ${c}x`)}**Step 2: collect and factor.** Subtract $${c}x$ from both sides and ${s > 0 ? `subtract $${a}${b}$` : `add $${a}${b}$`}, so that only the terms with $x$ are on the left; then take $x$ out:${steps(`x(${a} - ${c}) = ${rhs}`)}**Step 3: divide** by $${a} - ${c}$, which is not zero because the equation has exactly one solution.${tidy.en}${steps(`x = ${answer}`)}**Check.** The left side minus the right side is $(${a} - ${c})x ${s > 0 ? "+" : "-"} ${a}${b}$. With the answer, $(${a} - ${c})x = ${rhs}$, so the difference is $0$: the two sides are equal.`,
              `**第一步：展开。** 括号里的两项都乘以 $${a}$：${steps(`${a}x ${s > 0 ? "+" : "-"} ${a}${b} = ${c}x`)}**第二步：移项并提公因式。** 两边同时减去 $${c}x$，并${s > 0 ? `减去 $${a}${b}$` : `加上 $${a}${b}$`}，让左边只剩含 $x$ 的项；再提出 $x$：${steps(`x(${a} - ${c}) = ${rhs}`)}**第三步：相除。** 除以 $${a} - ${c}$；因为方程恰有一个解，它不为零。${tidy["zh-CN"]}${steps(`x = ${answer}`)}**检验。** 左边减去右边得 $(${a} - ${c})x ${s > 0 ? "+" : "-"} ${a}${b}$。代入答案，$(${a} - ${c})x = ${rhs}$，所以差是 $0$：两边相等。`,
            ),
          });
        }
        const [a, b] = letters(rng, 2);
        const n = rng.nonZero(-9, 9);
        const m = rng.nonZero(-9, 9);
        // a(x + n) = mx + b  ⇒  x(a - m) = b - na
        const top = poly([1, b], [-n, a]);
        const den = poly([1, a], [-m, ""]);
        const answer = over(top, den);
        const eq = equation(rng, `${a}(${linear(1, n)})`, poly([m, "x"], [1, b]));
        const na = `${n > 0 ? "+" : "-"} ${poly([Math.abs(n), a])}`;
        const mx = poly([m, "x"]);
        return solveFor("x", {
          prompt: solveText(eq, oneSolution),
          answer,
          wrong: [over(poly([1, b], [-n, ""]), den), over(poly([1, b], [n, a]), den), over(top, poly([1, a], [m, ""]))],
          solution: t(
            `**Step 1: expand.** Multiply both terms in the parentheses by $${a}$; the number $${n}$ becomes $${poly([n, a])}$:${steps(`${a}x ${na} = ${poly([m, "x"], [1, b])}`)}**Step 2: collect.** Subtract $${mx}$ from both sides, and move $${poly([n, a])}$ to the right, where it changes sign. It has no $x$, so it belongs with $${b}$:${steps(`${a}x ${m > 0 ? "-" : "+"} ${poly([Math.abs(m), "x"])} = ${top}`)}**Step 3: factor and divide.** Take $x$ out, then divide by $${den}$, which is not zero because the equation has exactly one solution:${steps(`x(${den}) = ${top}`, `x = ${answer}`)}**Check.** The left side minus the right side is $(${den})x ${na} - ${b}$. With the answer, $(${den})x = ${top}$, so the difference is $${top} ${na} - ${b} = 0$: the two sides are equal.`,
            `**第一步：展开。** 括号里的两项都乘以 $${a}$，数 $${n}$ 变成 $${poly([n, a])}$：${steps(`${a}x ${na} = ${poly([m, "x"], [1, b])}`)}**第二步：移项。** 两边同时减去 $${mx}$，并把 $${poly([n, a])}$ 移到右边，移过去要变号。它不含 $x$，所以和 $${b}$ 放在一起：${steps(`${a}x ${m > 0 ? "-" : "+"} ${poly([Math.abs(m), "x"])} = ${top}`)}**第三步：提公因式并相除。** 提出 $x$，再除以 $${den}$；因为方程恰有一个解，它不为零：${steps(`x(${den}) = ${top}`, `x = ${answer}`)}**检验。** 左边减去右边得 $(${den})x ${na} - ${b}$。代入答案，$(${den})x = ${top}$，所以差是 $${top} ${na} - ${b} = 0$：两边相等。`,
          ),
        });
      },
    },
  ],
};

const givenSign = (k: string, positive: boolean): Text =>
  t(`Given $${k} ${positive ? ">" : "<"} 0$`, `已知 $${k} ${positive ? ">" : "<"} 0$`);

/** inside picks a number one unit inside the solution set of x op bound. */
const inside = (op: InequalityOp, bound: number) => (op === ">" || op === ">=" ? bound + 1 : bound - 1);

/** holds says in words that a comparison of two numbers is true. */
const holds = (left: number, op: InequalityOp, right: number): Text =>
  t(`$${left} ${relSymbol(op)} ${right}$ is true`, `$${left} ${relSymbol(op)} ${right}$ 成立`);

export const linearInequalitiesWithParameters: TopicDef = {
  id: "linear-inequalities-with-parameters",
  title: t("Solving Linear Inequalities With Unknown Parameters", "解含参数的一元一次不等式"),
  summary: t(
    "Solve inequalities with a letter coefficient whose sign is known, reversing the symbol when it is negative.",
    "解字母系数符号已知的不等式；系数为负时改变不等号方向。",
  ),
  prerequisites: ["linear-equations-with-unknown-coefficients", "solving-multi-step-inequalities"],
  encompasses: [
    { topic: "solving-multi-step-inequalities", weight: 0.5 },
    { topic: "linear-equations-with-unknown-coefficients", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.REI.B.3"],
  intro: t(
    `Two things you already know meet in this topic. Equations with a letter coefficient are solved by treating the letter as a number. Inequalities are solved like equations, except that multiplying or dividing both sides by a **negative** number reverses the symbol: from $2 < 5$, multiplying by $-1$ gives $-2 > -5$.

Put the two together in $kx > 6$. To get $x$ alone we divide by $k$, but whether the symbol stays or reverses depends on the sign of $k$, which a letter does not show. Try two values:

- with $k = 2$: $2x > 6$ gives $x > 3$;
- with $k = -2$: $-2x > 6$ gives $x < -3$.

The direction of the answer changes with the sign of $k$. So an inequality with a parameter can only be solved when we know whether the parameter is positive or negative, and problems tell us: "given $k > 0$" leads to $x > \\frac{6}{k}$, "given $k < 0$" to $x < \\frac{6}{k}$.

In this lesson the parameter first cancels out, then stays in the boundary of the answer, and finally the coefficient is an expression such as $a - 3$, whose sign follows from what is given.`,
    `这个课题把你学过的两件事结合起来。含字母系数的方程，把字母当作数来解。不等式和方程的解法相同，只是两边同时乘以或除以**负数**时，不等号要改变方向：由 $2 < 5$ 两边乘以 $-1$，得 $-2 > -5$。

把两者合起来看 $kx > 6$。要让 $x$ 单独留下，就要除以 $k$，但不等号方向变不变取决于 $k$ 的符号，而字母本身看不出符号。试两个值：

- 取 $k = 2$：由 $2x > 6$ 得 $x > 3$；
- 取 $k = -2$：由 $-2x > 6$ 得 $x < -3$。

答案的方向随 $k$ 的符号改变。所以只有知道参数是正还是负，才能解含参数的不等式，题目会告诉我们这一点："已知 $k > 0$"得 $x > \\frac{6}{k}$，"已知 $k < 0$"得 $x < \\frac{6}{k}$。

这节课先练习参数能约去的情形，再练习参数留在解的边界中的情形，最后练习系数是 $a - 3$ 这类式子、其符号由已知条件决定的情形。`,
  ),
  knowledgePoints: [
    {
      id: "dividing-by-a-parameter",
      title: t("Dividing by a parameter of known sign", "除以符号已知的参数"),
      explanation: t(
        `Dividing both sides of an inequality by a positive number keeps the symbol; dividing by a negative number reverses it, because it turns larger numbers into smaller ones: $6 > 4$, but $\\frac{6}{-2} = -3$ is less than $\\frac{4}{-2} = -2$. So before dividing by a letter, look at what is given about its sign.

Solve $kx - 2k > 5k$ given $k < 0$. Adding $2k$ to both sides is safe, since adding never changes the symbol: $kx > 7k$. Now divide by $k$. It is negative, so the symbol reverses, and $\\frac{7k}{k} = 7$:

$$kx - 2k > 5k \\;\\Rightarrow\\; kx > 7k \\;\\Rightarrow\\; x < 7.$$

If instead $k > 0$, the same steps keep the symbol and give $x > 7$. Here the parameter cancels, so the answer is a plain number; only its direction depends on $k$.

> **Watch out.** Reverse the symbol only when you divide or multiply by a negative number, and then always: given $k < 0$, writing $x > 7$ above would be wrong. Adding or subtracting, such as moving $-2k$, never reverses it, but it does need the right sign: $kx > 5k + 2k$, not $5k - 2k$.`,
        `不等式两边同时除以正数，不等号方向不变；除以负数，方向改变，因为它把较大的数变成较小的数：$6 > 4$，但 $\\frac{6}{-2} = -3$ 小于 $\\frac{4}{-2} = -2$。所以除以一个字母之前，先看已知条件给出的它的符号。

已知 $k < 0$，解 $kx - 2k > 5k$。两边同时加上 $2k$ 没有问题，因为加法从不改变不等号方向：$kx > 7k$。再除以 $k$。它是负数，所以不等号方向改变，而 $\\frac{7k}{k} = 7$：

$$kx - 2k > 5k \\;\\Rightarrow\\; kx > 7k \\;\\Rightarrow\\; x < 7.$$

若 $k > 0$，同样的步骤不改变方向，得 $x > 7$。这里参数约去了，所以答案是一个具体的数，只有方向取决于 $k$。

> **注意。** 只有乘以或除以负数时才改变不等号方向，而且这时一定要改变：已知 $k < 0$ 时，上面写成 $x > 7$ 就错了。加减运算（比如移走 $-2k$）从不改变方向，但符号要对：应是 $kx > 5k + 2k$，不是 $5k - 2k$。`,
      ),
      keyPrerequisites: ["solving-multi-step-inequalities"],
      generate(rng) {
        const k = rng.pick(["a", "k", "m", "p", "r"]);
        const positive = rng.bool();
        const op = rng.pick(ops);
        const answerOp = positive ? op : flip[op];
        const v = rng.int(-9, 9);
        const e = rng.nonZero(-9, 9);
        const c = v + e;
        const factored = rng.bool();
        const lhs = factored ? `${k}(${linear(1, e)})` : poly([1, `${k}x`], [e, k]);
        const ineq = `${lhs} ${relSymbol(op)} ${poly([c, k])}`;
        const divide = positive
          ? t(`$${k}$ is positive, so the symbol stays`, `$${k}$ 是正数，所以不等号方向不变`)
          : t(`$${k}$ is negative, so the symbol reverses`, `$${k}$ 是负数，所以不等号方向改变`);
        const kv = positive ? 2 : -2;
        const x = inside(answerOp, v);
        const left = kv * (x + e);
        const right = kv * c;
        const sub = factored ? `${kv}(${x} ${signed(e)})` : `${kv} \\cdot ${paren(x)} ${signed(e * kv)}`;
        const check = t(
          `**Check.** Try numbers that fit: take $${k} = ${kv}$, which is ${positive ? "positive" : "negative"}, and $x = ${x}$, which the answer allows. The left side is $${sub} = ${left}$ and the right side is $${paren(c)} \\cdot ${paren(kv)} = ${right}$, and ${holds(left, op, right).en}.`,
          `**检验。** 取符合条件的数：$${k} = ${kv}$ 是${positive ? "正数" : "负数"}，$x = ${x}$ 在答案范围内。左边是 $${sub} = ${left}$，右边是 $${paren(c)} \\cdot ${paren(kv)} = ${right}$，${holds(left, op, right)["zh-CN"]}。`,
        );
        const solution = factored
          ? t(
              `**Step 1: divide by $${k}$.** Both sides are multiples of $${k}$. Dividing by $${k}$: ${divide.en}, and $\\frac{${poly([c, k])}}{${k}} = ${num(c)}$:${steps(`${linear(1, e)} ${relSymbol(answerOp)} ${num(c)}`)}**Step 2: move the constant.** ${moveConstant(e).en[0]!.toUpperCase()}${moveConstant(e).en.slice(1)}; adding or subtracting does not change the symbol:${steps(inequalityLatex("x", answerOp, v))}${check.en}`,
              `**第一步：除以 $${k}$。** 两边都是 $${k}$ 的倍数。两边同时除以 $${k}$：${divide["zh-CN"]}，而 $\\frac{${poly([c, k])}}{${k}} = ${num(c)}$：${steps(`${linear(1, e)} ${relSymbol(answerOp)} ${num(c)}`)}**第二步：移走常数。** ${moveConstant(e)["zh-CN"]}；加减运算不改变不等号方向：${steps(inequalityLatex("x", answerOp, v))}${check["zh-CN"]}`,
            )
          : t(
              `**Step 1: move the term without $x$.** ${e > 0 ? `Subtract $${poly([e, k])}$ from` : `Add $${poly([-e, k])}$ to`} both sides; adding or subtracting does not change the symbol:${steps(`${k}x ${relSymbol(op)} ${poly([v, k])}`)}**Step 2: divide by $${k}$.** ${divide.en[0]!.toUpperCase()}${divide.en.slice(1)}, and $\\frac{${poly([v, k])}}{${k}} = ${num(v)}$:${steps(inequalityLatex("x", answerOp, v))}${check.en}`,
              `**第一步：移走不含 $x$ 的项。** 两边同时${e > 0 ? `减去 $${poly([e, k])}$` : `加上 $${poly([-e, k])}$`}；加减运算不改变不等号方向：${steps(`${k}x ${relSymbol(op)} ${poly([v, k])}`)}**第二步：除以 $${k}$。** ${divide["zh-CN"]}，而 $\\frac{${poly([v, k])}}{${k}} = ${num(v)}$：${steps(inequalityLatex("x", answerOp, v))}${check["zh-CN"]}`,
            );
        return inequalityProblem({
          prompt: t(
            `${givenSign(k, positive).en}, solve $${ineq}$ for $x$.`,
            `${givenSign(k, positive)["zh-CN"]}，解关于 $x$ 的不等式 $${ineq}$。`,
          ),
          op: answerOp,
          value: v,
          wrong: [
            [flip[answerOp], v],
            [answerOp, -v],
          ],
          solution,
        });
      },
    },
    {
      id: "a-boundary-with-a-parameter",
      title: t("A boundary in terms of a parameter", "用参数表示的边界"),
      explanation: t(
        `When the parameter does not cancel, it stays in the answer: the boundary of the solution is an expression such as $\\frac{8}{a}$, a number we cannot write in digits until $a$ is known. The steps are the same as with numbers, and the sign of $a$ decides the direction, just as before.

Solve $ax + 3 \\le 11$ given $a < 0$. Subtracting $3$ gives $ax \\le 8$; subtracting does not touch the symbol. Then divide by $a$, which is negative, so the symbol reverses:

$$ax + 3 \\le 11 \\;\\Rightarrow\\; ax \\le 8 \\;\\Rightarrow\\; x \\ge \\frac{8}{a}.$$

To see that this is right, try $a = -1$: the answer says $x \\ge -8$, and indeed $x = -7$ gives $-1 \\cdot (-7) + 3 = 10 \\le 11$.

> **Watch out.** Two separate things can go wrong. The direction: reverse only because $a$ is negative, never because of the subtraction. And the boundary: move $3$ with the opposite operation, so it is $\\frac{11 - 3}{a} = \\frac{8}{a}$, not $\\frac{11 + 3}{a}$.`,
        `参数不能约去时，它会留在答案中：解的边界是 $\\frac{8}{a}$ 这样的式子，在知道 $a$ 之前，无法把它写成具体的数。步骤和数字系数时一样，方向也照样由 $a$ 的符号决定。

已知 $a < 0$，解 $ax + 3 \\le 11$。两边减去 $3$，得 $ax \\le 8$；减法不影响不等号。再除以 $a$，它是负数，所以不等号方向改变：

$$ax + 3 \\le 11 \\;\\Rightarrow\\; ax \\le 8 \\;\\Rightarrow\\; x \\ge \\frac{8}{a}.$$

验证一下：取 $a = -1$，答案是 $x \\ge -8$，而确实取 $x = -7$ 时，$-1 \\cdot (-7) + 3 = 10 \\le 11$。

> **注意。** 有两处容易出错。一是方向：改变方向只是因为 $a$ 是负数，与减法无关。二是边界：移走 $3$ 要用相反的运算，所以边界是 $\\frac{11 - 3}{a} = \\frac{8}{a}$，不是 $\\frac{11 + 3}{a}$。`,
      ),
      generate(rng) {
        const a = rng.pick(["a", "k", "m", "p", "r"]);
        const positive = rng.bool();
        const op = rng.pick(ops);
        const answerOp = positive ? op : flip[op];
        const b = rng.nonZero(-12, 12);
        let c = rng.int(-15, 15);
        if (c === b) c = b + rng.nonZero(-6, 6);
        const d = c - b;
        const bound = signedOver(d, a);
        const other = c + b !== 0 ? signedOver(c + b, a) : poly([d, a]);
        const choices = [
          `x ${relSymbol(answerOp)} ${bound}`,
          `x ${relSymbol(flip[answerOp])} ${bound}`,
          `x ${relSymbol(answerOp)} ${other}`,
          `x ${relSymbol(flip[answerOp])} ${other}`,
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        const ineq = `${poly([1, `${a}x`], [b, ""])} ${relSymbol(op)} ${num(c)}`;
        const move = moveConstant(b);
        const av = positive ? 1 : -1;
        const x = inside(answerOp, d * av);
        const left = av * x + b;
        const divide = positive
          ? t(`$${a}$ is positive, so the symbol stays`, `$${a}$ 是正数，所以不等号方向不变`)
          : t(`$${a}$ is negative, so the symbol reverses`, `$${a}$ 是负数，所以不等号方向改变`);
        return choiceProblem({
          prompt: t(
            `${givenSign(a, positive).en}, solve $${ineq}$ for $x$.`,
            `${givenSign(a, positive)["zh-CN"]}，解关于 $x$ 的不等式 $${ineq}$。`,
          ),
          options: order.map((i) => t(`$${choices[i]}$`, `$${choices[i]}$`)),
          correct: order.indexOf(0),
          solution: t(
            `**Step 1: move the constant.** ${move.en[0]!.toUpperCase()}${move.en.slice(1)}; this does not change the symbol:${steps(`${a}x ${relSymbol(op)} ${num(d)}`)}**Step 2: divide by $${a}$.** ${divide.en[0]!.toUpperCase()}${divide.en.slice(1)}. The parameter does not cancel, so it stays in the boundary:${steps(choices[0]!)}**Check.** Try $${a} = ${av}$, which is ${positive ? "positive" : "negative"}. Then the answer reads $x ${relSymbol(answerOp)} ${d * av}$, and $x = ${x}$ fits it. In the inequality, the left side is $${av} \\cdot ${paren(x)} ${signed(b)} = ${left}$, and ${holds(left, op, c).en}.`,
            `**第一步：移走常数。** ${move["zh-CN"]}；这不改变不等号方向：${steps(`${a}x ${relSymbol(op)} ${num(d)}`)}**第二步：除以 $${a}$。** ${divide["zh-CN"]}。参数没有约去，所以留在边界中：${steps(choices[0]!)}**检验。** 取 $${a} = ${av}$，它是${positive ? "正数" : "负数"}。这时答案是 $x ${relSymbol(answerOp)} ${d * av}$，$x = ${x}$ 符合它。代入不等式，左边是 $${av} \\cdot ${paren(x)} ${signed(b)} = ${left}$，${holds(left, op, c)["zh-CN"]}。`,
          ),
        });
      },
    },
    {
      id: "the-sign-of-an-expression",
      title: t("The sign of an expression in the parameter", "含参数式子的符号"),
      explanation: t(
        `Sometimes the coefficient of $x$ is not a single letter but an expression such as $a - 3$. Its sign follows from what is given: if $a < 3$, then subtracting $3$ from both sides of $a < 3$ gives $a - 3 < 0$. So $a - 3$ is negative, even though we do not know $a$.

Solve $ax > 3x + 5$ given $a < 3$. Subtract $3x$ to bring the terms with $x$ together, and factor $x$ out:

$$ax > 3x + 5 \\;\\Rightarrow\\; ax - 3x > 5 \\;\\Rightarrow\\; (a - 3)x > 5.$$

Dividing by $a - 3$ means dividing by a negative number, so the symbol reverses: $x < \\frac{5}{a - 3}$. With $a > 3$ instead, $a - 3$ would be positive and the answer $x > \\frac{5}{a - 3}$.

> **Watch out.** Decide the sign of the whole coefficient, $a - 3$, from the given: "$a < 3$" says it is negative, so reverse. And keep the coefficient as it comes out of factoring: $ax - 3x$ is $(a - 3)x$, so the boundary is $\\frac{5}{a - 3}$, not $\\frac{5}{3 - a}$, which has the opposite sign.`,
        `有时 $x$ 的系数不是单个字母，而是 $a - 3$ 这样的式子。它的符号由已知条件决定：若 $a < 3$，在 $a < 3$ 两边同时减去 $3$，得 $a - 3 < 0$。所以虽然不知道 $a$，但 $a - 3$ 是负数。

已知 $a < 3$，解 $ax > 3x + 5$。两边减去 $3x$，把含 $x$ 的项放到一起，再提出 $x$：

$$ax > 3x + 5 \\;\\Rightarrow\\; ax - 3x > 5 \\;\\Rightarrow\\; (a - 3)x > 5.$$

除以 $a - 3$ 就是除以负数，所以不等号方向改变：$x < \\frac{5}{a - 3}$。如果 $a > 3$，$a - 3$ 是正数，答案就是 $x > \\frac{5}{a - 3}$。

> **注意。** 要由已知条件判断整个系数 $a - 3$ 的符号："$a < 3$"说明它是负数，所以要改变方向。系数要保持提公因式得到的样子：$ax - 3x$ 是 $(a - 3)x$，所以边界是 $\\frac{5}{a - 3}$，不是符号相反的 $\\frac{5}{3 - a}$。`,
      ),
      generate(rng) {
        const a = rng.pick(["a", "k", "m", "p", "r"]);
        const n = rng.int(1, 9);
        const above = rng.bool();
        const op = rng.pick(ops);
        const answerOp = above ? op : flip[op];
        const c = rng.nonZero(-20, 20);
        const den = poly([1, a], [-n, ""]);
        const bound = signedOver(c, den);
        const other = signedOver(c, poly([n, ""], [-1, a]));
        const choices = [
          `x ${relSymbol(answerOp)} ${bound}`,
          `x ${relSymbol(flip[answerOp])} ${bound}`,
          `x ${relSymbol(answerOp)} ${other}`,
          `x ${relSymbol(flip[answerOp])} ${other}`,
        ];
        const order = rng.shuffle([0, 1, 2, 3]);
        const split = rng.bool();
        const ineq = split ? `${a}x ${relSymbol(op)} ${poly([n, "x"], [c, ""])}` : `(${den})x ${relSymbol(op)} ${num(c)}`;
        const given = `${a} ${above ? ">" : "<"} ${num(n)}`;
        const av = above ? n + 1 : n - 1;
        const dv = av - n;
        const x = inside(answerOp, c * dv);
        const [left, right] = split ? [av * x, n * x + c] : [dv * x, c];
        const leftWork = split ? `${av} \\cdot ${paren(x)} = ${left}` : `(${av} - ${n}) \\cdot ${paren(x)} = ${left}`;
        const rightWork = split ? `$${poly([n, ""])} \\cdot ${paren(x)} ${signed(c)} = ${right}$` : `$${right}$`;
        const collect = split
          ? t(
              `**Step 1: collect and factor.** Subtract $${poly([n, "x"])}$ from both sides, which does not change the symbol, and take $x$ out:${steps(`${a}x - ${poly([n, "x"])} ${relSymbol(op)} ${num(c)}`, `(${den})x ${relSymbol(op)} ${num(c)}`)}`,
              `**第一步：移项并提公因式。** 两边同时减去 $${poly([n, "x"])}$，不改变不等号方向，再提出 $x$：${steps(`${a}x - ${poly([n, "x"])} ${relSymbol(op)} ${num(c)}`, `(${den})x ${relSymbol(op)} ${num(c)}`)}`,
            )
          : t(
              `**Step 1: look at the coefficient.** The inequality is already $(${den})x ${relSymbol(op)} ${num(c)}$: $x$ is multiplied by $${den}$.\n\n`,
              `**第一步：看系数。** 不等式已经是 $(${den})x ${relSymbol(op)} ${num(c)}$ 的形式：$x$ 乘以了 $${den}$。\n\n`,
            );
        return choiceProblem({
          prompt: t(`Given $${given}$, solve $${ineq}$ for $x$.`, `已知 $${given}$，解关于 $x$ 的不等式 $${ineq}$。`),
          options: order.map((i) => t(`$${choices[i]}$`, `$${choices[i]}$`)),
          correct: order.indexOf(0),
          solution: t(
            `${collect.en}**Step 2: the sign of $${den}$.** Subtracting $${n}$ from both sides of $${given}$ gives $${den} ${above ? ">" : "<"} 0$: the coefficient is ${above ? "positive" : "negative"}.

**Step 3: divide by $${den}$.** ${above ? "Dividing by a positive number keeps the symbol" : "Dividing by a negative number reverses the symbol"}:${steps(choices[0]!)}**Check.** Try $${a} = ${av}$, which fits $${given}$. Then $${den} = ${dv}$ and the answer reads $x ${relSymbol(answerOp)} ${c * dv}$, so take $x = ${x}$. The left side is $${leftWork}$, the right side is ${rightWork}, and ${holds(left, op, right).en}.`,
            `${collect["zh-CN"]}**第二步：判断 $${den}$ 的符号。** 在 $${given}$ 两边同时减去 $${n}$，得 $${den} ${above ? ">" : "<"} 0$：系数是${above ? "正数" : "负数"}。

**第三步：除以 $${den}$。** ${above ? "除以正数，不等号方向不变" : "除以负数，不等号方向改变"}：${steps(choices[0]!)}**检验。** 取 $${a} = ${av}$，符合 $${given}$。这时 $${den} = ${dv}$，答案是 $x ${relSymbol(answerOp)} ${c * dv}$，取 $x = ${x}$。左边是 $${leftWork}$，右边是 ${rightWork}，${holds(left, op, right)["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
};

export const manyVariableEquations: TopicDef = {
  id: "many-variable-equations",
  title: t("Solving Many-Variable Equations", "解多元方程中的一个变量"),
  summary: t(
    "Solve an equation with several variables for one of them, treating the others as numbers.",
    "把其他变量当作数，从含多个变量的方程中解出其中一个。",
  ),
  prerequisites: ["linear-equations-with-unknown-coefficients"],
  encompasses: [{ topic: "linear-equations-with-unknown-coefficients", weight: 0.6 }],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.4"],
  intro: t(
    `In equations such as $ax + 5 = 12$ we solved for $x$ and treated the other letter as a fixed number. Nothing forces the letter we solve for to be called $x$, or the others to be called coefficients. An equation like $3x + 2y = 12$ links two quantities, and **solving it for $y$** means rewriting it so that $y$ stands alone on one side:

$$3x + 2y = 12 \\;\\Rightarrow\\; 2y = 12 - 3x \\;\\Rightarrow\\; y = 6 - \\frac{3}{2}x.$$

Both equations say the same thing, but the second one is ready to use: for any $x$ it gives $y$ directly. With $x = 2$ it gives $y = 6 - 3 = 3$, and indeed $3 \\cdot 2 + 2 \\cdot 3 = 12$.

The rule is the one you know: treat every letter except the one you want as a number, and undo the operations on the wanted letter in the reverse order. In this lesson we solve two-variable equations for one variable, then equations with several letters for any of them.`,
    `在 $ax + 5 = 12$ 这样的方程中，我们解出 $x$，把另一个字母当作确定的数。其实要解出的字母不一定叫 $x$，其他字母也不一定是系数。像 $3x + 2y = 12$ 这样的方程联系着两个量，**解出 $y$** 就是把它改写成 $y$ 单独在一边的形式：

$$3x + 2y = 12 \\;\\Rightarrow\\; 2y = 12 - 3x \\;\\Rightarrow\\; y = 6 - \\frac{3}{2}x.$$

两个方程表达的意思相同，但第二个可以直接用：给出任意 $x$，就能直接得到 $y$。取 $x = 2$，得 $y = 6 - 3 = 3$，而确实 $3 \\cdot 2 + 2 \\cdot 3 = 12$。

规则还是熟悉的那条：把要解出的字母以外的字母都当作数，按相反的顺序抵消作用在这个字母上的运算。这节课先从二元方程中解出一个变量，再从含多个字母的方程中解出任意一个。`,
  ),
  knowledgePoints: [
    {
      id: "solving-for-y",
      title: t("Solving a two-variable equation for one variable", "从二元方程中解出一个变量"),
      explanation: t(
        `To **solve for** $y$ means to get $y$ alone on one side; the other side may contain $x$, which we treat as a number. Two steps do it:

1. Move the $x$ term to the other side, by subtracting it from both sides (or adding, if it is subtracted).
2. Divide both sides by the coefficient of $y$. The other side is now a sum of two terms, so **each** term is divided.

For $3x + 2y = 12$: subtracting $3x$ gives $2y = 12 - 3x$, and dividing both terms by $2$ gives

$$y = \\frac{12}{2} - \\frac{3x}{2} = 6 - \\frac{3}{2}x.$$

> **Watch out.** Divide every term by the coefficient of $y$, not just the number: $y = 6 - 3x$ forgets to divide $3x$ by $2$, and $y = 12 - 3x$ forgets the division altogether. And moving $3x$ changes its sign: it becomes $-3x$ on the other side.`,
        `**解出** $y$ 就是让 $y$ 单独在一边；另一边可以含有 $x$，把它当作数。分两步：

1. 两边同时减去含 $x$ 的项（如果它是被减去的，就加上），把它移到另一边。
2. 两边同时除以 $y$ 的系数。这时另一边是两项的和，所以**每一项**都要除。

对于 $3x + 2y = 12$：两边减去 $3x$ 得 $2y = 12 - 3x$，两项都除以 $2$ 得

$$y = \\frac{12}{2} - \\frac{3x}{2} = 6 - \\frac{3}{2}x.$$

> **注意。** 每一项都要除以 $y$ 的系数，不能只除常数：$y = 6 - 3x$ 忘了把 $3x$ 除以 $2$，$y = 12 - 3x$ 则完全没有除。另外，$3x$ 移到另一边要变号，变成 $-3x$。`,
      ),
      generate(rng) {
        const forY = rng.bool();
        const [u, w] = forY ? ["y", "x"] : ["x", "y"];
        const cu = rng.sign() * rng.int(2, 9);
        const cw = rng.nonZero(-9, 9);
        const c = rng.nonZero(-24, 24);
        const lhs = rng.bool() ? poly([cw, w], [cu, u]) : poly([cu, u], [cw, w]);
        const answer = poly([frac(-cw, cu), w], [frac(c, cu), ""]);
        const rest = poly([c, ""], [-cw, w]);
        const wTerm = poly([cw, w]);
        return solveFor(u, {
          prompt: t(`Solve $${lhs} = ${num(c)}$ for $${u}$.`, `从方程 $${lhs} = ${num(c)}$ 中解出 $${u}$。`),
          answer,
          wrong: [poly([-cw, w], [c, ""]), poly([-cw, w], [frac(c, cu), ""]), poly([frac(cw, cu), w], [frac(c, cu), ""])],
          solution: t(
            `**Step 1: move the $${w}$ term.** ${cw > 0 ? `Subtract $${wTerm}$ from` : `Add $${poly([-cw, w])}$ to`} both sides, so that only the $${u}$ term is left on the left; on the right the term appears with the opposite sign:${steps(`${poly([cu, u])} = ${rest}`)}**Step 2: divide by $${num(cu)}$.** $${u}$ is multiplied by $${num(cu)}$, so divide both sides by it. The right side has two terms, and each one is divided:${steps(`${u} = ${answer}`)}**Check.** Multiplying the answer by $${num(cu)}$ gives back $${rest}$, and adding the $${w}$ term again gives $${rest} ${cw > 0 ? "+" : "-"} ${poly([Math.abs(cw), w])} = ${num(c)}$, the right side of the equation.`,
            `**第一步：移走含 $${w}$ 的项。** 两边同时${cw > 0 ? `减去 $${wTerm}$` : `加上 $${poly([-cw, w])}$`}，让左边只剩含 $${u}$ 的项；移到右边的项符号相反：${steps(`${poly([cu, u])} = ${rest}`)}**第二步：除以 $${num(cu)}$。** $${u}$ 乘以了 $${num(cu)}$，所以两边同时除以它。右边有两项，每一项都要除：${steps(`${u} = ${answer}`)}**检验。** 答案乘以 $${num(cu)}$ 回到 $${rest}$，再把含 $${w}$ 的项加回来，得 $${rest} ${cw > 0 ? "+" : "-"} ${poly([Math.abs(cw), w])} = ${num(c)}$，正是方程的右边。`,
          ),
        });
      },
    },
    {
      id: "solving-for-a-letter",
      title: t("Solving for any letter", "解出任意一个字母"),
      explanation: t(
        `Any letter can be the one you solve for. Treat all the other letters as numbers, look at what is done to the chosen letter, in order, and undo it in the reverse order.

Solve $\\frac{p + q}{r} = s$ for $q$. Reading the left side as a calculation: $q$ is added to $p$, then the sum is divided by $r$. So undo the division first, by multiplying both sides by $r$, then undo the addition, by subtracting $p$:

$$\\frac{p + q}{r} = s \\;\\Rightarrow\\; p + q = rs \\;\\Rightarrow\\; q = rs - p.$$

To check, put $q = rs - p$ back: $\\frac{p + rs - p}{r} = \\frac{rs}{r} = s$.

> **Watch out.** Undo the operations in the reverse order of how they were done. In $\\frac{p + q}{r} = s$, subtracting $p$ first and writing $q = \\frac{s}{r} - p$ or $q = r(s - p)$ is wrong: $p$ is inside the fraction, so it is divided by $r$ too.`,
        `任何一个字母都可以作为要解出的未知数。把其他字母都当作数，看清这个字母依次受到哪些运算，再按相反的顺序抵消它们。

从 $\\frac{p + q}{r} = s$ 中解出 $q$。把左边看作一串运算：$q$ 先与 $p$ 相加，再把和除以 $r$。所以先两边乘以 $r$ 抵消除法，再两边减去 $p$ 抵消加法：

$$\\frac{p + q}{r} = s \\;\\Rightarrow\\; p + q = rs \\;\\Rightarrow\\; q = rs - p.$$

检验：把 $q = rs - p$ 代回，$\\frac{p + rs - p}{r} = \\frac{rs}{r} = s$。

> **注意。** 要按运算顺序的相反顺序来抵消。在 $\\frac{p + q}{r} = s$ 中，先减去 $p$、写成 $q = \\frac{s}{r} - p$ 或 $q = r(s - p)$ 都是错的：$p$ 在分数里，它也被 $r$ 除了。`,
      ),
      generate(rng) {
        const [p, q, r, s] = letters(rng, 4);
        const k = rng.int(2, 9);
        const sub = (v: string) => t(`subtract $${v}$ from both sides`, `两边同时减去 $${v}$`);
        const add = (v: string) => t(`add $${v}$ to both sides`, `两边同时加上 $${v}$`);
        const div = (v: string) => t(`divide both sides by $${v}$`, `两边同时除以 $${v}$`);
        const mul = (v: string) => t(`multiply both sides by $${v}$`, `两边同时乘以 $${v}$`);
        const forms = [
          {
            eq: `${p}${q} + ${r} = ${s}`,
            v: q,
            first: sub(r),
            work: `${p}${q} = ${s} - ${r}`,
            second: div(p),
            answer: over(`${s} - ${r}`, p),
            wrong: [over(`${s} + ${r}`, p), `${over(s, p)} - ${r}`, `${p}(${s} - ${r})`],
            check: `${p} \\cdot ${over(`${s} - ${r}`, p)} + ${r} = (${s} - ${r}) + ${r} = ${s}`,
          },
          {
            eq: `${k}${p} - ${q}${r} = ${s}`,
            v: r,
            first: sub(`${k}${p}`),
            work: `-${q}${r} = ${s} - ${k}${p}`,
            second: t(
              `divide both sides by $-${q}$, which changes the sign of both terms on the right`,
              `两边同时除以 $-${q}$，右边两项都变号`,
            ),
            answer: over(`${k}${p} - ${s}`, q),
            wrong: [over(`${s} - ${k}${p}`, q), over(`${k}${p} + ${s}`, q), `${k}${p} - ${over(s, q)}`],
            check: `${k}${p} - ${q} \\cdot ${over(`${k}${p} - ${s}`, q)} = ${k}${p} - (${k}${p} - ${s}) = ${s}`,
          },
          {
            eq: `\\frac{${p} + ${q}}{${r}} = ${s}`,
            v: q,
            first: mul(r),
            work: `${p} + ${q} = ${r}${s}`,
            second: sub(p),
            answer: `${r}${s} - ${p}`,
            wrong: [`${over(s, r)} - ${p}`, `${r}${s} + ${p}`, `${r}(${s} - ${p})`],
            check: `\\frac{${p} + ${r}${s} - ${p}}{${r}} = \\frac{${r}${s}}{${r}} = ${s}`,
          },
          {
            eq: `${p}(${q} + ${r}) = ${s}`,
            v: r,
            first: div(p),
            work: `${q} + ${r} = ${over(s, p)}`,
            second: sub(q),
            answer: `${over(s, p)} - ${q}`,
            wrong: [over(`${s} - ${q}`, p), `${s} - ${p}${q}`, `${over(s, p)} + ${q}`],
            check: `${p}\\left(${q} + ${over(s, p)} - ${q}\\right) = ${p} \\cdot ${over(s, p)} = ${s}`,
          },
          {
            eq: `\\frac{${p}}{${q}} - ${r} = ${s}`,
            v: p,
            first: add(r),
            work: `\\frac{${p}}{${q}} = ${s} + ${r}`,
            second: mul(q),
            answer: `${q}(${s} + ${r})`,
            wrong: [`${q}${s} + ${r}`, `${q}(${s} - ${r})`, over(`${s} + ${r}`, q)],
            check: `\\frac{${q}(${s} + ${r})}{${q}} - ${r} = (${s} + ${r}) - ${r} = ${s}`,
          },
          {
            eq: `${k}${p} + ${q}${r} = ${s}${r}`,
            v: p,
            first: sub(`${q}${r}`),
            work: `${k}${p} = ${s}${r} - ${q}${r}`,
            second: div(String(k)),
            answer: over(`${s}${r} - ${q}${r}`, k),
            wrong: [`${over(`${s}${r}`, k)} - ${q}${r}`, over(`${s}${r} + ${q}${r}`, k), `${s}${r} - ${q}${r} - ${k}`],
            check: `${k} \\cdot ${over(`${s}${r} - ${q}${r}`, k)} + ${q}${r} = (${s}${r} - ${q}${r}) + ${q}${r} = ${s}${r}`,
          },
        ];
        const f = rng.pick(forms);
        const [left, right] = f.eq.split(" = ") as [string, string];
        const eq = equation(rng, left, right);
        const cap = (s: string) => `${s[0]!.toUpperCase()}${s.slice(1)}`;
        return solveFor(f.v, {
          prompt: t(
            `Solve $${eq}$ for $${f.v}$. Assume no variable you divide by is zero.`,
            `从方程 $${eq}$ 中解出 $${f.v}$。假设作为除数的变量都不为零。`,
          ),
          answer: f.answer,
          wrong: f.wrong,
          solution: t(
            `Treat every letter except $${f.v}$ as a number, and undo the operations on $${f.v}$ starting with the last one.

**Step 1.** ${cap(f.first.en)}:${steps(f.work)}**Step 2.** ${cap(f.second.en)}:${steps(`${f.v} = ${f.answer}`)}**Check.** Put the answer back into the side with $${f.v}$: $${f.check}$, as required.`,
            `把 $${f.v}$ 以外的字母都当作数，从最后一个运算开始，抵消作用在 $${f.v}$ 上的运算。

**第一步。** ${f.first["zh-CN"]}：${steps(f.work)}**第二步。** ${f.second["zh-CN"]}：${steps(`${f.v} = ${f.answer}`)}**检验。** 把答案代回含 $${f.v}$ 的一边：$${f.check}$，符合要求。`,
          ),
        });
      },
    },
  ],
};

/** ProductFormula is a formula L = k · v₁v₂…, with k = num/den. */
interface ProductFormula {
  readonly lhs: string;
  readonly vars: readonly string[];
  readonly k?: readonly [number, number];
}

const productFormulas: readonly ProductFormula[] = [
  { lhs: "d", vars: ["r", "t"] },
  { lhs: "A", vars: ["l", "w"] },
  { lhs: "V", vars: ["l", "w", "h"] },
  { lhs: "I", vars: ["P", "r", "t"] },
  { lhs: "A", vars: ["b", "h"], k: [1, 2] },
  { lhs: "V", vars: ["B", "h"], k: [1, 3] },
  { lhs: "V", vars: ["B", "h"] },
  { lhs: "F", vars: ["m", "a"] },
  { lhs: "W", vars: ["F", "d"] },
  { lhs: "p", vars: ["m", "v"] },
  { lhs: "E", vars: ["P", "t"] },
  { lhs: "P", vars: ["s"], k: [4, 1] },
];

/** QuotientFormula is a formula L = n / d. */
const quotientFormulas: readonly (readonly [string, string, string])[] = [
  ["s", "d", "t"],
  ["D", "m", "V"],
  ["P", "F", "A"],
];

/** FormulaCase is a formula solved for one of its letters, with the lines between and the answer put back. */
interface FormulaCase {
  readonly left: string;
  readonly right: string;
  readonly v: string;
  readonly answer: string;
  readonly wrong: readonly string[];
  /** work are the equations written before the answer. */
  readonly work: readonly string[];
  /** check substitutes the answer into the formula. */
  readonly check: string;
}

const formulaPrompt = (eq: string, v: string): Text =>
  t(`Solve the formula $${eq}$ for $${v}$. Assume every quantity is positive.`, `从公式 $${eq}$ 中解出 $${v}$。假设所有的量都是正数。`);

/** formulaProblem builds a formula problem whose solution explains the plan, works it line by line and puts the answer back. */
function formulaProblem(rng: Rng, c: FormulaCase, how: Text): Problem {
  const eq = equation(rng, c.left, c.right);
  const work = steps(...c.work, `${c.v} = ${c.answer}`);
  return solveFor(c.v, {
    prompt: formulaPrompt(eq, c.v),
    answer: c.answer,
    wrong: c.wrong,
    solution: t(
      `Start from $${c.left} = ${c.right}$ and treat every letter except $${c.v}$ as a number. ${how.en}${work}**Check.** Put $${c.v} = ${c.answer}$ back into the right side: $${c.check}$, which is the left side.`,
      `从 $${c.left} = ${c.right}$ 出发，把 $${c.v}$ 以外的字母都当作数。${how["zh-CN"]}${work}**检验。** 把 $${c.v} = ${c.answer}$ 代回右边：$${c.check}$，正是左边。`,
    ),
  });
}

const twoStepFormulas: readonly FormulaCase[] = [
  {
    left: "P",
    right: "2l + 2w",
    v: "w",
    answer: "\\frac{P - 2l}{2}",
    wrong: ["P - 2l", "\\frac{P}{2} - 2l", "\\frac{P + 2l}{2}"],
    work: ["P - 2l = 2w"],
    check: "2l + 2 \\cdot \\frac{P - 2l}{2} = 2l + (P - 2l) = P",
  },
  {
    left: "P",
    right: "2l + 2w",
    v: "l",
    answer: "\\frac{P - 2w}{2}",
    wrong: ["P - 2w", "\\frac{P}{2} - 2w", "\\frac{P + 2w}{2}"],
    work: ["P - 2w = 2l"],
    check: "2 \\cdot \\frac{P - 2w}{2} + 2w = (P - 2w) + 2w = P",
  },
  {
    left: "y",
    right: "mx + b",
    v: "x",
    answer: "\\frac{y - b}{m}",
    wrong: ["\\frac{y}{m} - b", "\\frac{y + b}{m}", "m(y - b)"],
    work: ["y - b = mx"],
    check: "m \\cdot \\frac{y - b}{m} + b = (y - b) + b = y",
  },
  {
    left: "y",
    right: "mx + b",
    v: "m",
    answer: "\\frac{y - b}{x}",
    wrong: ["\\frac{y}{x} - b", "\\frac{y + b}{x}", "x(y - b)"],
    work: ["y - b = mx"],
    check: "\\frac{y - b}{x} \\cdot x + b = (y - b) + b = y",
  },
  {
    left: "y",
    right: "mx + b",
    v: "b",
    answer: "y - mx",
    wrong: ["mx - y", "y + mx", "\\frac{y}{mx}"],
    work: [],
    check: "mx + (y - mx) = y",
  },
  {
    left: "F",
    right: "\\frac{9}{5}C + 32",
    v: "C",
    answer: "\\frac{5}{9}(F - 32)",
    wrong: ["\\frac{5}{9}F - 32", "\\frac{9}{5}(F - 32)", "\\frac{5}{9}(F + 32)"],
    work: ["F - 32 = \\frac{9}{5}C"],
    check: "\\frac{9}{5} \\cdot \\frac{5}{9}(F - 32) + 32 = (F - 32) + 32 = F",
  },
  {
    left: "v",
    right: "u + at",
    v: "a",
    answer: "\\frac{v - u}{t}",
    wrong: ["\\frac{v}{t} - u", "\\frac{v + u}{t}", "t(v - u)"],
    work: ["v - u = at"],
    check: "u + \\frac{v - u}{t} \\cdot t = u + (v - u) = v",
  },
  {
    left: "v",
    right: "u + at",
    v: "t",
    answer: "\\frac{v - u}{a}",
    wrong: ["\\frac{v}{a} - u", "\\frac{v + u}{a}", "a(v - u)"],
    work: ["v - u = at"],
    check: "u + a \\cdot \\frac{v - u}{a} = u + (v - u) = v",
  },
  {
    left: "v",
    right: "u + at",
    v: "u",
    answer: "v - at",
    wrong: ["at - v", "v + at", "\\frac{v}{at}"],
    work: [],
    check: "(v - at) + at = v",
  },
  {
    left: "A",
    right: "\\frac{1}{2}(a + b)h",
    v: "a",
    answer: "\\frac{2A}{h} - b",
    wrong: ["\\frac{A}{2h} - b", "\\frac{2A - b}{h}", "2Ah - b"],
    work: ["2A = (a + b)h", "\\frac{2A}{h} = a + b"],
    check: "\\frac{1}{2}\\left(\\frac{2A}{h} - b + b\\right)h = \\frac{1}{2} \\cdot \\frac{2A}{h} \\cdot h = A",
  },
  {
    left: "A",
    right: "\\frac{1}{2}(a + b)h",
    v: "h",
    answer: "\\frac{2A}{a + b}",
    wrong: ["\\frac{A}{2(a + b)}", "\\frac{2A}{a} - b", "2A - a - b"],
    work: ["2A = (a + b)h"],
    check: "\\frac{1}{2}(a + b) \\cdot \\frac{2A}{a + b} = \\frac{1}{2} \\cdot 2A = A",
  },
  {
    left: "M",
    right: "\\frac{a + b}{2}",
    v: "b",
    answer: "2M - a",
    wrong: ["\\frac{M}{2} - a", "2M + a", "2(M - a)"],
    work: ["2M = a + b"],
    check: "\\frac{a + (2M - a)}{2} = \\frac{2M}{2} = M",
  },
  {
    left: "L",
    right: "a + (n - 1)d",
    v: "d",
    answer: "\\frac{L - a}{n - 1}",
    wrong: ["\\frac{L - a}{n} - 1", "\\frac{L + a}{n - 1}", "\\frac{L}{n - 1} - a"],
    work: ["L - a = (n - 1)d"],
    check: "a + (n - 1) \\cdot \\frac{L - a}{n - 1} = a + (L - a) = L",
  },
  {
    left: "L",
    right: "a + (n - 1)d",
    v: "n",
    answer: "\\frac{L - a}{d} + 1",
    wrong: ["\\frac{L - a}{d} - 1", "\\frac{L - a + 1}{d}", "\\frac{L}{d} - a + 1"],
    work: ["L - a = (n - 1)d", "\\frac{L - a}{d} = n - 1"],
    check: "a + \\left(\\frac{L - a}{d} + 1 - 1\\right)d = a + (L - a) = L",
  },
  {
    left: "S",
    right: "\\frac{n(a + L)}{2}",
    v: "a",
    answer: "\\frac{2S}{n} - L",
    wrong: ["\\frac{S}{2n} - L", "\\frac{2S - L}{n}", "2Sn - L"],
    work: ["2S = n(a + L)", "\\frac{2S}{n} = a + L"],
    check: "\\frac{n\\left(\\frac{2S}{n} - L + L\\right)}{2} = \\frac{n \\cdot \\frac{2S}{n}}{2} = \\frac{2S}{2} = S",
  },
  {
    left: "c",
    right: "ax + by",
    v: "y",
    answer: "\\frac{c - ax}{b}",
    wrong: ["c - ax", "\\frac{c}{b} - ax", "\\frac{c + ax}{b}"],
    work: ["c - ax = by"],
    check: "ax + b \\cdot \\frac{c - ax}{b} = ax + (c - ax) = c",
  },
  {
    left: "c",
    right: "ax + by",
    v: "a",
    answer: "\\frac{c - by}{x}",
    wrong: ["c - by", "\\frac{c}{x} - by", "\\frac{c + by}{x}"],
    work: ["c - by = ax"],
    check: "\\frac{c - by}{x} \\cdot x + by = (c - by) + by = c",
  },
];

const factoringFormulas: readonly FormulaCase[] = [
  {
    left: "A",
    right: "P + Prt",
    v: "P",
    answer: "\\frac{A}{1 + rt}",
    wrong: ["\\frac{A}{rt}", "A - rt", "\\frac{A}{1 - rt}"],
    work: ["A = P(1 + rt)"],
    check: "\\frac{A}{1 + rt} + \\frac{A}{1 + rt} \\cdot rt = \\frac{A}{1 + rt} \\cdot (1 + rt) = A",
  },
  {
    left: "S",
    right: "2lw + 2lh + 2wh",
    v: "h",
    answer: "\\frac{S - 2lw}{2l + 2w}",
    wrong: ["\\frac{S - 2lw}{4lw}", "\\frac{S + 2lw}{2l + 2w}", "\\frac{S}{2l + 2w} - 2lw"],
    work: ["S - 2lw = 2lh + 2wh", "S - 2lw = h(2l + 2w)"],
    check: "2lw + h(2l + 2w) = 2lw + (S - 2lw) = S",
  },
  {
    left: "S",
    right: "2lw + 2lh + 2wh",
    v: "w",
    answer: "\\frac{S - 2lh}{2l + 2h}",
    wrong: ["\\frac{S - 2lh}{4lh}", "\\frac{S + 2lh}{2l + 2h}", "\\frac{S}{2l + 2h} - 2lh"],
    work: ["S - 2lh = 2lw + 2wh", "S - 2lh = w(2l + 2h)"],
    check: "w(2l + 2h) + 2lh = (S - 2lh) + 2lh = S",
  },
  {
    left: "S",
    right: "2lw + 2lh + 2wh",
    v: "l",
    answer: "\\frac{S - 2wh}{2w + 2h}",
    wrong: ["\\frac{S - 2wh}{4wh}", "\\frac{S + 2wh}{2w + 2h}", "\\frac{S}{2w + 2h} - 2wh"],
    work: ["S - 2wh = 2lw + 2lh", "S - 2wh = l(2w + 2h)"],
    check: "l(2w + 2h) + 2wh = (S - 2wh) + 2wh = S",
  },
  {
    left: "E",
    right: "mgh + \\frac{1}{2}mv^2",
    v: "m",
    answer: "\\frac{E}{gh + \\frac{1}{2}v^2}",
    wrong: ["\\frac{E}{gh} - \\frac{1}{2}v^2", "\\frac{E}{ghv^2}", "\\frac{2E}{gh + v^2}"],
    work: ["E = m\\left(gh + \\frac{1}{2}v^2\\right)"],
    check: "m\\left(gh + \\frac{1}{2}v^2\\right) = \\frac{E}{gh + \\frac{1}{2}v^2} \\cdot \\left(gh + \\frac{1}{2}v^2\\right) = E",
  },
];

export const rearrangingFormulas: TopicDef = {
  id: "rearranging-formulas",
  title: t("Rearranging Formulas", "公式变形"),
  summary: t(
    "Solve formulas such as $A = \\frac{1}{2}bh$ and $P = 2l + 2w$ for any of their letters.",
    "从 $A = \\frac{1}{2}bh$、$P = 2l + 2w$ 等公式中解出其中任意一个字母。",
  ),
  prerequisites: ["many-variable-equations", "unknown-coefficients-by-factoring"],
  encompasses: [
    { topic: "many-variable-equations", weight: 0.6 },
    { topic: "unknown-coefficients-by-factoring", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.4"],
  intro: t(
    `A formula is an equation that relates several quantities, such as $d = rt$: distance is rate times time. As written it answers one question, "how far?". But often we know the distance and the rate and want the time. Instead of substituting numbers and solving every time, we can solve the formula once for $t$, exactly as in the last topic, treating $d$ and $r$ as numbers:

$$d = rt \\;\\Rightarrow\\; t = \\frac{d}{r}.$$

The new formula answers "how long?" directly. For $120$ km at $40$ km/h it gives $t = \\frac{120}{40} = 3$ hours, and $40 \\cdot 3 = 120$ confirms it.

Rearranging is the same skill as solving: undo the operations on the wanted letter in the reverse order. In this lesson we rearrange formulas made of products and quotients, then formulas with sums, and finally formulas where the wanted letter appears twice and must be factored out.`,
    `公式是表示几个量之间关系的等式，比如 $d = rt$：路程等于速度乘以时间。按原样写，它回答的是"多远"。但我们常常知道路程和速度，想求时间。与其每次代入数再解方程，不如把公式一次性地解出 $t$，方法和上一个课题完全相同，把 $d$ 和 $r$ 当作数：

$$d = rt \\;\\Rightarrow\\; t = \\frac{d}{r}.$$

新公式直接回答"多久"。以 $40$ 千米/时行驶 $120$ 千米，得 $t = \\frac{120}{40} = 3$ 小时，而 $40 \\cdot 3 = 120$ 验证了它。

公式变形与解方程是同一种本领：按相反的顺序抵消作用在所求字母上的运算。这节课先变形由乘除构成的公式，再变形含加减的公式，最后变形所求字母出现两次、需要提公因式的公式。`,
  ),
  knowledgePoints: [
    {
      id: "products-and-quotients",
      title: t("Formulas with products and quotients", "乘除形式的公式"),
      explanation: t(
        `When the wanted letter is multiplied by other letters, divide both sides by **all** of them at once. In $V = lwh$, $h$ is multiplied by $l$ and by $w$, so dividing by $lw$ frees it: $h = \\frac{V}{lw}$. A product is undone by a division, whatever the factors are called.

A number in front is part of the product too. In $A = \\frac{1}{2}bh$, multiplying by $\\frac{1}{2}$ is undone by multiplying by $2$, its reciprocal; then divide by $b$:

$$A = \\frac{1}{2}bh \\;\\Rightarrow\\; 2A = bh \\;\\Rightarrow\\; h = \\frac{2A}{b}.$$

When the wanted letter is in a denominator, as $t$ in $s = \\frac{d}{t}$, clear the fraction first by multiplying both sides by $t$: $st = d$. Now $t$ is multiplied by $s$, so $t = \\frac{d}{s}$.

> **Watch out.** Dividing is the opposite of multiplying, so to free $h$ from $V = lwh$ you divide: $h = \\frac{V}{lw}$, not $Vlw$, and not the upside-down $\\frac{lw}{V}$. For a fraction such as $\\frac{1}{2}$, multiply by $2$; dividing by $2$ gives the wrong $\\frac{A}{2b}$.`,
        `当所求字母与其他字母相乘时，两边同时除以**所有**这些字母。在 $V = lwh$ 中，$h$ 乘以了 $l$ 和 $w$，所以除以 $lw$ 就把它解出来：$h = \\frac{V}{lw}$。无论因数叫什么名字，乘法都用除法抵消。

前面的数也是乘积的一部分。在 $A = \\frac{1}{2}bh$ 中，乘以 $\\frac{1}{2}$ 要用乘以它的倒数 $2$ 来抵消，再除以 $b$：

$$A = \\frac{1}{2}bh \\;\\Rightarrow\\; 2A = bh \\;\\Rightarrow\\; h = \\frac{2A}{b}.$$

当所求字母在分母中，比如 $s = \\frac{d}{t}$ 中的 $t$，先两边乘以 $t$ 去掉分数：$st = d$。现在 $t$ 乘以了 $s$，所以 $t = \\frac{d}{s}$。

> **注意。** 除法是乘法的逆运算，所以要从 $V = lwh$ 中解出 $h$，应该除：$h = \\frac{V}{lw}$，不是 $Vlw$，也不是倒过来的 $\\frac{lw}{V}$。对于 $\\frac{1}{2}$ 这样的分数，要乘以 $2$；除以 $2$ 会得到错误的 $\\frac{A}{2b}$。`,
      ),
      keyPrerequisites: ["many-variable-equations"],
      generate(rng) {
        if (rng.bool(0.25)) {
          const [l, n, d] = rng.pick(quotientFormulas);
          const forNumerator = rng.bool();
          const c: FormulaCase = forNumerator
            ? {
                left: l,
                right: over(n, d),
                v: n,
                answer: `${l}${d}`,
                wrong: [over(l, d), over(d, l)],
                work: [],
                check: `\\frac{${l}${d}}{${d}} = ${l}`,
              }
            : {
                left: l,
                right: over(n, d),
                v: d,
                answer: over(n, l),
                wrong: [`${l}${n}`, over(l, n)],
                work: [`${l}${d} = ${n}`],
                check: `${n} \\div ${over(n, l)} = ${n} \\cdot \\frac{${l}}{${n}} = ${l}`,
              };
          return formulaProblem(
            rng,
            c,
            forNumerator
              ? t(
                  `Here $${n}$ is divided by $${d}$, and multiplying undoes dividing, so multiply both sides by $${d}$:`,
                  `这里 $${n}$ 被 $${d}$ 除，乘法抵消除法，所以两边同时乘以 $${d}$：`,
                )
              : t(
                  `The wanted letter $${d}$ is in the denominator. Multiply both sides by $${d}$ to clear the fraction; then $${d}$ is multiplied by $${l}$, so divide both sides by $${l}$:`,
                  `所求字母 $${d}$ 在分母中。先两边同时乘以 $${d}$ 去掉分数；这时 $${d}$ 乘以了 $${l}$，所以再两边同时除以 $${l}$：`,
                ),
          );
        }
        const f = rng.pick(productFormulas);
        const [kn, kd] = f.k ?? [1, 1];
        const v = rng.pick(f.vars);
        const others = f.vars.filter((x) => x !== v).join("");
        const kLatex = kd === 1 ? (kn === 1 ? "" : String(kn)) : over(kn, kd);
        const top = `${kd === 1 ? "" : kd}${f.lhs}`;
        const bottom = `${kn === 1 ? "" : kn}${others}`;
        const answer = bottom === "" ? top : over(top, bottom);
        const wrong = [`${f.lhs}${others}`, over(bottom === "" ? 1 : bottom, top)];
        if (f.k) wrong.push(others === "" ? `${kn}${f.lhs}` : over(f.lhs, others));
        const divide = bottom === "" ? "" : bottom;
        const work = kd === 1 ? [] : [`${kd}${f.lhs} = ${kn === 1 ? "" : kn}${f.vars.join("")}`];
        const check = `${kLatex}${others}${others === "" && kLatex === "" ? "" : " \\cdot "}${answer} = ${f.lhs}`;
        return formulaProblem(
          rng,
          { left: f.lhs, right: `${kLatex}${f.vars.join("")}`, v, answer, wrong, work, check },
          kd === 1
            ? t(
                `On the right, $${v}$ is multiplied by $${divide}$. Division undoes multiplication, so divide both sides by $${divide}$:`,
                `在右边，$${v}$ 乘以了 $${divide}$。除法抵消乘法，所以两边同时除以 $${divide}$：`,
              )
            : t(
                `On the right, $${v}$ is multiplied by $${kLatex}$${others === "" ? "" : ` and by $${others}$`}. Multiplying by $${kLatex}$ is undone by multiplying by its reciprocal $${kd}$; then divide both sides by $${divide}$:`,
                `在右边，$${v}$ 乘以了 $${kLatex}$${others === "" ? "" : `和 $${others}$`}。乘以 $${kLatex}$ 要用乘以它的倒数 $${kd}$ 来抵消；再两边同时除以 $${divide}$：`,
              ),
        );
      },
    },
    {
      id: "two-step-formulas",
      title: t("Formulas with sums", "含加减的公式"),
      explanation: t(
        `When the wanted letter is in one term of a sum, it cannot be freed while something is still added to it. So first move the other terms to the other side, and only then undo what multiplies or divides the letter. Because the other side is now a sum or a difference, divide it as a **whole**.

Solve $P = 2l + 2w$ for $w$. Subtract $2l$ from both sides, then divide both sides by $2$:

$$P = 2l + 2w \\;\\Rightarrow\\; P - 2l = 2w \\;\\Rightarrow\\; w = \\frac{P - 2l}{2}.$$

With $P = 20$ and $l = 6$ this gives $w = \\frac{20 - 12}{2} = 4$, and indeed $2 \\cdot 6 + 2 \\cdot 4 = 20$.

If the letter is inside parentheses or a fraction, undo the outer operations first: $A = \\frac{1}{2}(a + b)h$ gives $2A = (a + b)h$, then $\\frac{2A}{h} = a + b$, so $a = \\frac{2A}{h} - b$.

> **Watch out.** Divide the whole side, not one term: $\\frac{P}{2} - 2l$ divides only $P$ by $2$, and $P - 2l$ forgets the division. Moving a term changes its sign, so it is $P - 2l$, not $P + 2l$.`,
        `当所求字母在和的某一项中时，只要还有东西加在它上面，就不能把它单独解出。所以先把其他项移到另一边，然后才抵消与这个字母相乘或相除的量。因为另一边此时是和或差，要把它**整体**相除。

从 $P = 2l + 2w$ 中解出 $w$。两边同时减去 $2l$，再同时除以 $2$：

$$P = 2l + 2w \\;\\Rightarrow\\; P - 2l = 2w \\;\\Rightarrow\\; w = \\frac{P - 2l}{2}.$$

取 $P = 20$，$l = 6$，得 $w = \\frac{20 - 12}{2} = 4$，而确实 $2 \\cdot 6 + 2 \\cdot 4 = 20$。

如果字母在括号或分数里，先抵消外层的运算：由 $A = \\frac{1}{2}(a + b)h$ 得 $2A = (a + b)h$，再得 $\\frac{2A}{h} = a + b$，所以 $a = \\frac{2A}{h} - b$。

> **注意。** 要整体相除，不能只除一项：$\\frac{P}{2} - 2l$ 只把 $P$ 除以了 $2$，$P - 2l$ 则忘了相除。移项要变号，所以是 $P - 2l$，不是 $P + 2l$。`,
      ),
      generate(rng) {
        const c = rng.pick(twoStepFormulas);
        return formulaProblem(
          rng,
          c,
          t(
            `Nothing can free $${c.v}$ while other terms are added to it, so first move the terms without $${c.v}$ to the other side, changing their signs. Then undo what multiplies or divides $${c.v}$, applying it to the whole other side:`,
            `只要还有其他项加在 $${c.v}$ 上，就无法把它单独解出，所以先把不含 $${c.v}$ 的项移到另一边，并改变符号。再抵消与 $${c.v}$ 相乘或相除的量，作用于另一边的整体：`,
          ),
        );
      },
    },
    {
      id: "formulas-that-need-factoring",
      title: t("Formulas that need factoring", "需要提公因式的公式"),
      explanation: t(
        `If the wanted letter appears in more than one term, no single division can free it: dividing by one coefficient leaves the letter in the other term. Instead, collect the terms with the letter on one side, and factor it out with the distributive property, so that it appears only once:

$$A = P + Prt \\;\\Rightarrow\\; A = P(1 + rt) \\;\\Rightarrow\\; P = \\frac{A}{1 + rt}.$$

Notice the $1$: $P$ is $P \\cdot 1$, so factoring $P$ out of $P$ leaves $1$, not $0$. Expanding $P(1 + rt)$ gives back $P + Prt$, which confirms the factoring.

> **Watch out.** Factoring $P$ out of $P + Prt$ leaves $1 + rt$, so the answer is $\\frac{A}{1 + rt}$, not $\\frac{A}{rt}$, which forgets the $1$. And the terms that do not contain the letter are moved before factoring: from $S = 2lw + 2lh + 2wh$, the term $2lw$ goes to the other side first, so $h = \\frac{S - 2lw}{2l + 2w}$.`,
        `如果所求字母出现在不止一项中，任何一次除法都无法把它解出：除以一个系数后，这个字母仍留在另一项中。应该把含这个字母的项移到同一边，再用分配律把它提出来，让它只出现一次：

$$A = P + Prt \\;\\Rightarrow\\; A = P(1 + rt) \\;\\Rightarrow\\; P = \\frac{A}{1 + rt}.$$

注意那个 $1$：$P$ 就是 $P \\cdot 1$，所以从 $P$ 中提出 $P$ 后剩下 $1$，不是 $0$。把 $P(1 + rt)$ 展开又得到 $P + Prt$，说明提公因式是对的。

> **注意。** 从 $P + Prt$ 中提出 $P$ 剩下 $1 + rt$，所以答案是 $\\frac{A}{1 + rt}$，不是漏掉 $1$ 的 $\\frac{A}{rt}$。不含所求字母的项要在提公因式之前移走：在 $S = 2lw + 2lh + 2wh$ 中，先把 $2lw$ 移到另一边，所以 $h = \\frac{S - 2lw}{2l + 2w}$。`,
      ),
      keyPrerequisites: ["unknown-coefficients-by-factoring"],
      generate(rng) {
        if (rng.bool(0.4)) {
          const c = rng.pick(factoringFormulas);
          return formulaProblem(
            rng,
            c,
            t(
              `The letter $${c.v}$ appears in more than one term. Move the terms without $${c.v}$ to the other side, factor $${c.v}$ out of the terms that contain it, then divide by the factor that is left:`,
              `字母 $${c.v}$ 出现在不止一项中。先把不含 $${c.v}$ 的项移到另一边，再从含 $${c.v}$ 的项中提出 $${c.v}$，最后除以剩下的因式：`,
            ),
          );
        }
        const [a, b, c, s] = letters(
          rng,
          4,
          letterPool.filter((l) => l !== "t"),
        );
        const v = "t";
        const kind = rng.int(0, 2);
        const cases: FormulaCase[] = [
          {
            left: s,
            right: `${a}${v} + ${b}${v} + ${c}`,
            v,
            answer: over(`${s} - ${c}`, `${a} + ${b}`),
            wrong: [over(`${s} - ${c}`, `${a}${b}`), over(`${s} + ${c}`, `${a} + ${b}`), `${over(s, `${a} + ${b}`)} - ${c}`],
            work: [`${s} - ${c} = ${a}${v} + ${b}${v}`, `${s} - ${c} = ${v}(${a} + ${b})`],
            check: `(${a} + ${b}) \\cdot ${over(`${s} - ${c}`, `${a} + ${b}`)} + ${c} = (${s} - ${c}) + ${c} = ${s}`,
          },
          {
            left: `${a}${v} - ${c}`,
            right: `${b}${v}`,
            v,
            answer: over(c, `${a} - ${b}`),
            wrong: [over(c, `${a} + ${b}`), over(c, `${b} - ${a}`), over(`${c} - ${b}`, a)],
            work: [`${a}${v} - ${b}${v} = ${c}`, `${v}(${a} - ${b}) = ${c}`],
            check: `${a}${v} - ${b}${v} = (${a} - ${b}) \\cdot ${over(c, `${a} - ${b}`)} = ${c}`,
          },
          {
            left: `${a}${v}`,
            right: `${b}(${v} + ${c})`,
            v,
            answer: over(`${b}${c}`, `${a} - ${b}`),
            wrong: [over(c, `${a} - ${b}`), over(`${b}${c}`, `${b} - ${a}`), over(`${b}${c}`, `${a} + ${b}`)],
            work: [`${a}${v} = ${b}${v} + ${b}${c}`, `${a}${v} - ${b}${v} = ${b}${c}`, `${v}(${a} - ${b}) = ${b}${c}`],
            check: `${a}${v} - ${b}${v} = (${a} - ${b}) \\cdot ${over(`${b}${c}`, `${a} - ${b}`)} = ${b}${c}`,
          },
        ];
        const f = cases[kind]!;
        const eq = equation(rng, f.left, f.right);
        const plan = [
          t(
            `**Step 1: move the term without $${v}$.** Subtract $${c}$ from both sides.`,
            `**第一步：移走不含 $${v}$ 的项。** 两边同时减去 $${c}$。`,
          ),
          t(
            `**Step 1: collect.** Subtract $${b}${v}$ from both sides and add $${c}$, so that the terms with $${v}$ are together.`,
            `**第一步：移项。** 两边同时减去 $${b}${v}$ 并加上 $${c}$，让含 $${v}$ 的项在一起。`,
          ),
          t(
            `**Step 1: expand and collect.** Multiply out $${b}(${v} + ${c})$, then subtract $${b}${v}$ from both sides.`,
            `**第一步：展开并移项。** 先展开 $${b}(${v} + ${c})$，再两边同时减去 $${b}${v}$。`,
          ),
        ][kind]!;
        const back = ["", `${a}${v} - ${c} = ${b}${v}`, `${a}${v} = ${b}${v} + ${b}${c} = ${b}(${v} + ${c})`][kind]!;
        const finish = kind === 0 ? "" : ` Moving the terms back gives $${back}$, the equation.`;
        const finishZh = kind === 0 ? "" : `把各项移回去得 $${back}$，正是原方程。`;
        return solveFor(v, {
          prompt: t(
            `Solve $${eq}$ for $${v}$. Assume the equation has exactly one solution.`,
            `从方程 $${eq}$ 中解出 $${v}$。假设方程恰有一个解。`,
          ),
          answer: f.answer,
          wrong: f.wrong,
          solution: t(
            `${plan.en} Then factor $${v}$ out of the terms that contain it:${steps(...f.work)}**Step 2: divide** by the factor that is left; it is not zero because the equation has exactly one solution:${steps(`${v} = ${f.answer}`)}**Check.** Put the answer back: $${f.check}$.${finish}`,
            `${plan["zh-CN"]}再从含 $${v}$ 的项中提出 $${v}$：${steps(...f.work)}**第二步：相除。** 除以剩下的因式；因为方程恰有一个解，它不为零：${steps(`${v} = ${f.answer}`)}**检验。** 把答案代回：$${f.check}$。${finishZh}`,
          ),
        });
      },
    },
  ],
};

/** LinearContext is a situation described by a starting amount that changes at a constant rate. */
interface LinearContext {
  readonly v: string;
  /** grows tells whether the quantity increases with v. */
  readonly grows: boolean;
  /** fixed and rate are ranges [min, max, step]; they never overlap, so the two numbers differ. */
  readonly fixed: readonly [number, number, number];
  readonly rate: readonly [number, number, number];
  /** count is the range of v in modeling problems. */
  readonly count: readonly [number, number];
  readonly quantity: Text;
  readonly unit: Text;
  readonly fixedMeaning: Text;
  readonly rateMeaning: Text;
  readonly vMeaning: Text;
  readonly totalMeaning: Text;
  readonly describe: (f: number, r: number) => Text;
  readonly findV: (total: number) => Text;
}

const dollars = t("dollars", "元");

const linearContexts: readonly LinearContext[] = [
  {
    v: "m",
    grows: true,
    fixed: [6, 12, 1],
    rate: [2, 5, 1],
    count: [3, 25],
    quantity: t("the cost, in dollars, of a taxi ride of $m$ kilometers", "乘出租车行驶 $m$ 千米的费用（单位：元）"),
    unit: dollars,
    fixedMeaning: t("the fixed charge for every ride", "每次乘车的起步价"),
    rateMeaning: t("the cost per kilometer", "每千米的费用"),
    vMeaning: t("the number of kilometers", "行驶的千米数"),
    totalMeaning: t("the total cost of the ride", "这次乘车的总费用"),
    describe: (f, r) =>
      t(
        `A taxi charges $\\$${f}$ for every ride plus $\\$${r}$ per kilometer.`,
        `出租车每次乘车收费 $${f}$ 元，另外每千米收费 $${r}$ 元。`,
      ),
    findV: (n) => t(`A ride cost $\\$${n}$. How many kilometers long was it?`, `某次乘车共花费 $${n}$ 元。这次行驶了多少千米？`),
  },
  {
    v: "n",
    grows: true,
    fixed: [50, 150, 10],
    rate: [15, 45, 5],
    count: [2, 24],
    quantity: t("the total cost, in dollars, of a gym membership for $n$ months", "健身房会员 $n$ 个月的总费用（单位：元）"),
    unit: dollars,
    fixedMeaning: t("the sign-up fee", "入会费"),
    rateMeaning: t("the fee for each month", "每个月的月费"),
    vMeaning: t("the number of months", "会员的月数"),
    totalMeaning: t("the total cost of the membership", "会员的总费用"),
    describe: (f, r) =>
      t(
        `A gym charges ${article(f)} $\\$${f}$ sign-up fee plus $\\$${r}$ per month.`,
        `一家健身房收取 $${f}$ 元入会费，另外每月收费 $${r}$ 元。`,
      ),
    findV: (n) =>
      t(`Leo has paid $\\$${n}$ in total. For how many months has he been a member?`, `小李一共付了 $${n}$ 元。他当了几个月的会员？`),
  },
  {
    v: "h",
    grows: true,
    fixed: [60, 120, 5],
    rate: [25, 55, 5],
    count: [1, 9],
    quantity: t("the bill, in dollars, for a repair that takes $h$ hours", "一次耗时 $h$ 小时的维修的账单（单位：元）"),
    unit: dollars,
    fixedMeaning: t("the call-out fee charged for every visit", "每次上门收取的出车费"),
    rateMeaning: t("the charge for each hour of work", "每小时工作的收费"),
    vMeaning: t("the number of hours of work", "工作的小时数"),
    totalMeaning: t("the total bill", "账单的总额"),
    describe: (f, r) =>
      t(
        `A plumber charges ${article(f)} $\\$${f}$ call-out fee plus $\\$${r}$ per hour of work.`,
        `一位水管工每次上门收取 $${f}$ 元出车费，另外每工作一小时收费 $${r}$ 元。`,
      ),
    findV: (n) =>
      t(`A repair bill came to $\\$${n}$. How many hours did the repair take?`, `一次维修的账单是 $${n}$ 元。这次维修用了几个小时？`),
  },
  {
    v: "w",
    grows: false,
    fixed: [600, 1500, 50],
    rate: [20, 60, 5],
    count: [2, 9],
    quantity: t("the amount, in dollars, left in Mia's account after $w$ weeks", "$w$ 周后小美账户里剩下的钱（单位：元）"),
    unit: dollars,
    fixedMeaning: t("the amount in the account at the start", "账户里最初的钱数"),
    rateMeaning: t("the amount withdrawn each week", "每周取出的钱数"),
    vMeaning: t("the number of weeks", "周数"),
    totalMeaning: t("the amount left after $w$ weeks", "$w$ 周后剩下的钱数"),
    describe: (f, r) =>
      t(`Mia has $\\$${f}$ in her account and withdraws $\\$${r}$ every week.`, `小美的账户里有 $${f}$ 元，她每周取出 $${r}$ 元。`),
    findV: (n) => t(`After how many weeks will $\\$${n}$ be left?`, `几周后账户里会剩下 $${n}$ 元？`),
  },
  {
    v: "t",
    grows: false,
    fixed: [24, 40, 2],
    rate: [2, 4, 1],
    count: [2, 5],
    quantity: t("the height, in centimeters, of a burning candle $t$ hours after it is lit", "蜡烛点燃 $t$ 小时后的高度（单位：厘米）"),
    unit: t("centimeters", "厘米"),
    fixedMeaning: t("the height of the candle before it is lit", "蜡烛点燃前的高度"),
    rateMeaning: t("how many centimeters the candle burns down each hour", "蜡烛每小时燃烧掉的厘米数"),
    vMeaning: t("the number of hours the candle has burned", "蜡烛燃烧的小时数"),
    totalMeaning: t("the height of the candle after $t$ hours", "$t$ 小时后蜡烛的高度"),
    describe: (f, r) =>
      t(`A candle is $${f}$ cm tall and burns down $${r}$ cm every hour.`, `一支蜡烛高 $${f}$ 厘米，每小时燃烧掉 $${r}$ 厘米。`),
    findV: (n) => t(`After how many hours will the candle be $${n}$ cm tall?`, `几小时后蜡烛高 $${n}$ 厘米？`),
  },
  {
    v: "d",
    grows: true,
    fixed: [10, 40, 1],
    rate: [2, 6, 1],
    count: [3, 20],
    quantity: t(
      "the height, in millimeters, of a seedling $d$ days after it is first measured",
      "幼苗第一次测量后第 $d$ 天的高度（单位：毫米）",
    ),
    unit: t("millimeters", "毫米"),
    fixedMeaning: t("the height of the seedling when it was first measured", "第一次测量时幼苗的高度"),
    rateMeaning: t("how many millimeters the seedling grows each day", "幼苗每天长高的毫米数"),
    vMeaning: t("the number of days since the first measurement", "第一次测量后经过的天数"),
    totalMeaning: t("the height of the seedling after $d$ days", "$d$ 天后幼苗的高度"),
    describe: (f, r) => t(`A seedling is $${f}$ mm tall and grows $${r}$ mm every day.`, `一株幼苗高 $${f}$ 毫米，每天长高 $${r}$ 毫米。`),
    findV: (n) => t(`After how many days will it be $${n}$ mm tall?`, `几天后它高 $${n}$ 毫米？`),
  },
  {
    v: "t",
    grows: false,
    fixed: [400, 900, 20],
    rate: [5, 25, 5],
    count: [3, 15],
    quantity: t(
      "the volume, in liters, of water in a tank $t$ minutes after it starts draining",
      "水箱开始放水 $t$ 分钟后箱中水的体积（单位：升）",
    ),
    unit: t("liters", "升"),
    fixedMeaning: t("the volume of water when draining starts", "开始放水时水的体积"),
    rateMeaning: t("the number of liters drained each minute", "每分钟放出的升数"),
    vMeaning: t("the number of minutes of draining", "放水的分钟数"),
    totalMeaning: t("the volume of water left after $t$ minutes", "$t$ 分钟后剩下的水的体积"),
    describe: (f, r) =>
      t(
        `A tank holds $${f}$ liters of water. It drains at $${r}$ liters per minute.`,
        `一个水箱装有 $${f}$ 升水，以每分钟 $${r}$ 升的速度放水。`,
      ),
    findV: (n) => t(`After how many minutes will $${n}$ liters be left?`, `几分钟后水箱里剩下 $${n}$ 升水？`),
  },
  {
    v: "g",
    grows: true,
    fixed: [15, 40, 5],
    rate: [2, 8, 1],
    count: [2, 15],
    quantity: t("the monthly phone bill, in dollars, when $g$ gigabytes of data are used", "使用 $g$ GB 流量时每月的话费（单位：元）"),
    unit: dollars,
    fixedMeaning: t("the basic monthly charge", "每月的基本费用"),
    rateMeaning: t("the charge per gigabyte of data", "每 GB 流量的费用"),
    vMeaning: t("the number of gigabytes used", "使用的流量（GB）"),
    totalMeaning: t("the total monthly bill", "每月的总话费"),
    describe: (f, r) =>
      t(
        `A phone plan costs $\\$${f}$ per month plus $\\$${r}$ per gigabyte of data.`,
        `一种手机套餐每月基本费用 $${f}$ 元，另外每 GB 流量收费 $${r}$ 元。`,
      ),
    findV: (n) => t(`One month's bill was $\\$${n}$. How many gigabytes were used?`, `某个月的话费是 $${n}$ 元。这个月用了多少 GB 流量？`),
  },
];

/** contextExpression writes the expression of a context: "25m + 40", "40 + 25m" or "1200 - 75w". */
function contextExpression(rng: Rng, c: LinearContext, f: number, r: number): string {
  if (!c.grows) return `${f} - ${r}${c.v}`;
  return rng.bool() ? `${r}${c.v} + ${f}` : `${f} + ${r}${c.v}`;
}

/** contextValue is the value of a context's expression at v. */
const contextValue = (c: LinearContext, f: number, r: number, v: number) => (c.grows ? f + r * v : f - r * v);

/** contextAt writes the expression of a context evaluated at v: "40 + 25 \cdot 2 = 90". */
const contextAt = (c: LinearContext, f: number, r: number, v: number) =>
  `${f} ${c.grows ? "+" : "-"} ${r} \\cdot ${v} = ${contextValue(c, f, r, v)}`;

export const interpretingLinearExpressions: TopicDef = {
  id: "interpreting-linear-expressions",
  title: t("Interpreting Linear Expressions", "理解一次式的含义"),
  summary: t(
    "Explain what the terms and coefficients of a linear expression mean in a real situation, and write such expressions.",
    "说明实际情境中一次式的各项和系数的含义，并写出这样的式子。",
  ),
  prerequisites: ["evaluating-expressions", "unit-rates"],
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSA.SSE.A.1"],
  intro: t(
    `You know how to evaluate an expression by substituting a number, and what a unit rate is: an amount per one unit, such as dollars per month. Put the two together and an expression becomes a description of a situation.

A gym charges a one-time fee of $\\$40$ and then $\\$25$ a month. After $m$ months the total cost is $40 + 25m$ dollars. Evaluate it for a few months:

- $m = 0$: $40 + 25 \\cdot 0 = 40$, the fee alone;
- $m = 1$: $40 + 25 \\cdot 1 = 65$;
- $m = 2$: $40 + 25 \\cdot 2 = 90$.

Each part of the expression has a job. The $40$ is there before any month has passed; the $25$ is added once for every month, so it is the rate. Reading an expression this way lets you see at a glance what a situation costs to start, how fast it changes, and what changes when the variable does.

In this lesson we say what the constant and the coefficient mean, write such expressions from a description, and work out how much the expression changes when the variable increases.`,
    `你会把数代入式子求值，也知道单位率是什么：每一个单位对应的量，比如每月多少元。把两者结合起来，一个式子就成了对实际情境的描述。

一家健身房收取一次性入会费 $40$ 元，之后每月 $25$ 元。$m$ 个月后的总费用是 $40 + 25m$ 元。对几个月份求值：

- $m = 0$：$40 + 25 \\cdot 0 = 40$，只有入会费；
- $m = 1$：$40 + 25 \\cdot 1 = 65$；
- $m = 2$：$40 + 25 \\cdot 2 = 90$。

式子的每一部分都有自己的作用。$40$ 在一个月都没过时就已经有了；$25$ 每过一个月加一次，所以它是变化率。这样读式子，一眼就能看出这个情境的起始量、变化的快慢，以及变量改变时会发生什么。

这节课先说明常数项和系数的含义，再根据描述写出这样的式子，最后求出变量增加时式子的变化量。`,
  ),
  knowledgePoints: [
    {
      id: "meaning-of-terms",
      title: t("The meaning of the constant and the coefficient", "常数项与系数的含义"),
      explanation: t(
        `In an expression such as $40 + 25m$ for the cost of $m$ months at a gym, each number means something, and you can find out what by asking how it behaves when $m$ changes.

- The **constant** $40$ does not depend on $m$. It is the value when $m = 0$: the starting amount, here the one-time fee.
- The **coefficient** $25$ multiplies $m$, so it is counted once for every month: it is the **rate**, the change for each additional month.

You can see both in the values: $m = 0$ gives $40$, $m = 1$ gives $65$, $m = 2$ gives $90$. The values start at $40$ and go up by $25$ each time.

In $1200 - 75w$, the amount starts at $1200$ and **decreases** by $75$ for each $w$: the minus sign says that the rate takes away.

> **Watch out.** Do not mix up the two numbers: the one multiplied by the variable is the rate, the one standing alone is the starting amount. And neither of them is the total, which is the value of the whole expression, nor the variable itself, which counts the units.`,
        `在表示健身房 $m$ 个月费用的式子 $40 + 25m$ 中，每个数都有含义，只要看 $m$ 变化时它怎样变化，就能知道它的含义。

- **常数项** $40$ 与 $m$ 无关。它是 $m = 0$ 时的值：起始量，这里是一次性的入会费。
- **系数** $25$ 与 $m$ 相乘，所以每过一个月就计算一次：它是**变化率**，即每多一个月增加的量。

从数值中可以同时看出这两点：$m = 0$ 得 $40$，$m = 1$ 得 $65$，$m = 2$ 得 $90$。数值从 $40$ 开始，每次增加 $25$。

在 $1200 - 75w$ 中，数量从 $1200$ 开始，$w$ 每增加 $1$ 就**减少** $75$：减号表示变化率是减去的。

> **注意。** 不要把两个数弄混：与变量相乘的是变化率，单独的那个是起始量。它们都不是总量（总量是整个式子的值），也不是变量本身（变量表示单位的个数）。`,
      ),
      generate(rng) {
        const c = rng.pick(linearContexts);
        const f = pickStep(rng, c.fixed);
        const r = pickStep(rng, c.rate);
        const expr = contextExpression(rng, c, f, r);
        const askRate = rng.bool();
        const meanings = [askRate ? c.rateMeaning : c.fixedMeaning, askRate ? c.fixedMeaning : c.rateMeaning, c.totalMeaning, c.vMeaning];
        const order = rng.shuffle([0, 1, 2, 3]);
        const asked = askRate ? r : f;
        const values = [0, 1, 2].map((v) => contextValue(c, f, r, v));
        return choiceProblem({
          prompt: t(
            `The expression $${expr}$ gives ${c.quantity.en}. What does $${asked}$ represent?`,
            `式子 $${expr}$ 表示${c.quantity["zh-CN"]}。其中 $${asked}$ 表示什么？`,
          ),
          options: order.map((i) => meanings[i]!),
          correct: order.indexOf(0),
          solution: askRate
            ? t(
                `$${r}$ multiplies $${c.v}$, so it is counted once for every unit of $${c.v}$: each increase of $1$ in $${c.v}$ ${c.grows ? "adds" : "takes away"} $${r}$. A number that tells how much changes per unit is a rate: it is ${c.rateMeaning.en}.

**Check.** Evaluate the expression at $${c.v} = 0, 1, 2$: it gives $${values[0]}$, $${values[1]}$, $${values[2]}$. Each step ${c.grows ? "up" : "down"} is $${r}$.`,
                `$${r}$ 与 $${c.v}$ 相乘，所以 $${c.v}$ 每有一个单位就计算一次：$${c.v}$ 每增加 $1$，就${c.grows ? "增加" : "减少"} $${r}$。表示每个单位变化多少的数是变化率：它是${c.rateMeaning["zh-CN"]}。

**检验。** 求 $${c.v} = 0, 1, 2$ 时式子的值：得 $${values[0]}$、$${values[1]}$、$${values[2]}$，每次${c.grows ? "增加" : "减少"}的都是 $${r}$。`,
              )
            : t(
                `$${f}$ is not multiplied by $${c.v}$, so it does not change when $${c.v}$ changes. It is the value of the expression when $${c.v} = 0$, before any unit has been counted: it is ${c.fixedMeaning.en}.

**Check.** At $${c.v} = 0$ the expression is $${contextAt(c, f, r, 0)}$: only $${f}$ is left.`,
                `$${f}$ 没有与 $${c.v}$ 相乘，所以 $${c.v}$ 变化时它不变。它是 $${c.v} = 0$ 时式子的值，也就是还没有计入任何单位时的量：它是${c.fixedMeaning["zh-CN"]}。

**检验。** 当 $${c.v} = 0$ 时，式子的值是 $${contextAt(c, f, r, 0)}$：只剩下 $${f}$。`,
              ),
        });
      },
    },
    {
      id: "writing-linear-expressions",
      title: t("Writing a linear expression", "写出一次式"),
      explanation: t(
        `A quantity that starts at some amount and changes by the same amount for each unit is written as

$$\\text{start} + \\text{rate} \\times \\text{number of units},$$

or **start − rate × number** when it decreases. The reason is that each unit contributes the rate once, so $m$ units contribute $m$ times the rate, and the start is there regardless.

A taxi charges $\\$8$ for every ride plus $\\$3$ per kilometer. For $m$ kilometers the kilometers cost $3m$, and the fixed $\\$8$ is added once:

$$8 + 3m \\text{ dollars for } m \\text{ kilometers}.$$

Test it on a case you can work out in your head: a $2$ km ride costs $8 + 3 + 3 = 14$, and $8 + 3 \\cdot 2 = 14$.

> **Watch out.** The rate goes with the variable, the fixed amount stands alone: $8m + 3$ would charge $\\$8$ per kilometer. The two numbers cannot be added either: $11m$ charges the fixed fee again for every kilometer. For a decrease, subtract the rate from the start, $1200 - 75w$, not $75w - 1200$.`,
        `从某个起始量开始、每增加一个单位就变化相同数量的量，写成

$$\\text{起始量} + \\text{变化率} \\times \\text{单位数},$$

减少时写成**起始量 − 变化率 × 单位数**。原因是每个单位贡献一次变化率，所以 $m$ 个单位贡献 $m$ 倍的变化率，而起始量无论如何都在。

出租车每次乘车收费 $8$ 元，另外每千米 $3$ 元。行驶 $m$ 千米，里程费是 $3m$，固定的 $8$ 元只加一次：

$$8 + 3m \\text{ 元}.$$

用一个能心算的情形检验：行驶 $2$ 千米花 $8 + 3 + 3 = 14$ 元，而 $8 + 3 \\cdot 2 = 14$。

> **注意。** 变化率跟着变量，固定的量单独写：$8m + 3$ 表示每千米收 $8$ 元。两个数也不能相加：$11m$ 相当于每千米都再收一次起步价。减少时用起始量减去变化率，写成 $1200 - 75w$，不是 $75w - 1200$。`,
      ),
      generate(rng) {
        const c = rng.pick(linearContexts);
        const f = pickStep(rng, c.fixed);
        const r = pickStep(rng, c.rate);
        const answer = c.grows ? poly([r, c.v], [f, ""]) : poly([f, ""], [-r, c.v]);
        const wrong = c.grows
          ? [poly([f, c.v], [r, ""]), poly([r + f, c.v]), poly([r, c.v], [-f, ""])]
          : [poly([r, c.v], [-f, ""]), poly([f, ""], [r, c.v]), poly([f, c.v], [-r, ""])];
        const two = contextValue(c, f, r, 2);
        const byWords = `${f} ${c.grows ? "+" : "-"} ${r} ${c.grows ? "+" : "-"} ${r} = ${two}`;
        return expressionProblem({
          prompt: t(
            `${c.describe(f, r).en} Write an expression for ${c.quantity.en}.`,
            `${c.describe(f, r)["zh-CN"]}写出表示${c.quantity["zh-CN"]}的式子。`,
          ),
          answer,
          wrong,
          solution: t(
            `**Step 1: the starting amount.** Before any unit of $${c.v}$ is counted, the amount is $${f}$; it does not depend on $${c.v}$, so it stands alone.

**Step 2: the rate.** Each unit ${c.grows ? "adds" : "takes away"} $${r}$, so $${c.v}$ units ${c.grows ? "add" : "take away"} $${r}${c.v}$. ${c.grows ? "Add it to" : "Subtract it from"} the starting amount:${steps(answer)}**Check.** With $${c.v} = 2$, the description gives $${byWords}$, and the expression gives $${contextAt(c, f, r, 2)}$ as well.`,
            `**第一步：起始量。** 还没有计入 $${c.v}$ 的任何单位时，量是 $${f}$；它与 $${c.v}$ 无关，所以单独写。

**第二步：变化率。** 每个单位${c.grows ? "增加" : "减少"} $${r}$，所以 $${c.v}$ 个单位${c.grows ? "增加" : "减少"} $${r}${c.v}$。${c.grows ? "把它加到起始量上" : "从起始量中减去它"}：${steps(answer)}**检验。** 当 $${c.v} = 2$ 时，按描述得 $${byWords}$，用式子也得 $${contextAt(c, f, r, 2)}$。`,
          ),
        });
      },
    },
    {
      id: "effect-of-a-change",
      title: t("The effect of a change", "变化带来的影响"),
      explanation: t(
        `The coefficient is the change in the expression for each increase of $1$ in the variable. So when the variable increases by $k$, the expression changes by $k$ times the coefficient, whatever value the variable started from. The constant plays no part: it is in both values and cancels when you take the difference.

In $40 + 25m$, compare $m$ months with $m + 3$ months:

$$\\bigl(40 + 25(m + 3)\\bigr) - (40 + 25m) = 25 \\cdot 3 = 75.$$

So three more months always cost $75$ dollars more: from $1$ to $4$ months the cost goes from $65$ to $140$, and from $10$ to $13$ months from $290$ to $365$.

> **Watch out.** The answer is the coefficient times the change, $3 \\cdot 25$. The change in the variable alone, $3$, or the rate alone, $25$, is not it, and the starting amount $40$ does not belong in a change at all.`,
        `系数是变量每增加 $1$ 时式子的变化量。所以变量增加 $k$ 时，式子变化系数的 $k$ 倍，与变量原来的值无关。常数项不起作用：两个值里都有它，相减时就抵消了。

在 $40 + 25m$ 中，比较 $m$ 个月和 $m + 3$ 个月：

$$\\bigl(40 + 25(m + 3)\\bigr) - (40 + 25m) = 25 \\cdot 3 = 75.$$

所以多三个月总是多花 $75$ 元：从 $1$ 个月到 $4$ 个月，费用从 $65$ 变为 $140$；从 $10$ 个月到 $13$ 个月，从 $290$ 变为 $365$。

> **注意。** 答案是系数乘以变化量，即 $3 \\cdot 25$。只写变量的变化量 $3$ 或只写变化率 $25$ 都不对，起始量 $40$ 更不应该出现在变化量里。`,
      ),
      generate(rng) {
        const c = rng.pick(linearContexts);
        const f = pickStep(rng, c.fixed);
        const r = pickStep(rng, c.rate);
        const k = rng.int(2, 6);
        const expr = contextExpression(rng, c, f, r);
        const from = contextValue(c, f, r, 0);
        const to = contextValue(c, f, r, k);
        return numberProblem({
          prompt: t(
            `The expression $${expr}$ gives ${c.quantity.en}. By how many ${c.unit.en} does it ${c.grows ? "increase" : "decrease"} when $${c.v}$ increases by $${k}$?`,
            `式子 $${expr}$ 表示${c.quantity["zh-CN"]}。当 $${c.v}$ 增加 $${k}$ 时，它${c.grows ? "增加" : "减少"}多少${c.unit["zh-CN"]}？`,
          ),
          answer: r * k,
          wrong: [k, r + k, f + r * k, r],
          solution: t(
            `The coefficient of $${c.v}$ is $${r}$, so each increase of $1$ in $${c.v}$ ${c.grows ? "adds" : "takes away"} $${r}$. The constant $${f}$ is the same before and after, so it does not affect the change. An increase of $${k}$ is $${k}$ such steps:${steps(`${k} \\cdot ${r} = ${r * k}`)}**Check.** Try $${c.v} = 0$ and $${c.v} = ${k}$: the expression gives $${contextAt(c, f, r, 0)}$ and $${contextAt(c, f, r, k)}$, and $${Math.max(from, to)} - ${Math.min(from, to)} = ${r * k}$.`,
            `$${c.v}$ 的系数是 $${r}$，所以 $${c.v}$ 每增加 $1$，式子就${c.grows ? "增加" : "减少"} $${r}$。常数 $${f}$ 前后不变，不影响变化量。增加 $${k}$ 就是 $${k}$ 个这样的步长：${steps(`${k} \\cdot ${r} = ${r * k}`)}**检验。** 取 $${c.v} = 0$ 和 $${c.v} = ${k}$：式子的值分别是 $${contextAt(c, f, r, 0)}$ 和 $${contextAt(c, f, r, k)}$，而 $${Math.max(from, to)} - ${Math.min(from, to)} = ${r * k}$。`,
          ),
        });
      },
    },
  ],
};

export const modelingWithLinearEquations: TopicDef = {
  id: "modeling-with-linear-equations",
  title: t("Modeling With Linear Equations", "用一次方程建模"),
  summary: t("Write a linear equation for a situation and solve it.", "为实际情境列出一次方程并求解。"),
  prerequisites: ["interpreting-linear-expressions", "equations-with-parentheses"],
  encompasses: [
    { topic: "two-step-equations", weight: 0.6 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.1"],
  intro: t(
    `In the last topic, expressions described situations: a plumber who charges $\\$60$ per visit plus $\\$45$ per hour bills $60 + 45h$ dollars for $h$ hours. Given the hours, we could work out the bill. Real questions often go the other way: the bill was $\\$285$; how long did the job take?

The expression still describes the bill, and the bill is now known, so the two must be equal. Writing that down gives an **equation**, and solving it answers the question:

$$60 + 45h = 285 \\;\\Rightarrow\\; 45h = 225 \\;\\Rightarrow\\; h = 5.$$

The job took $5$ hours, and $60 + 45 \\cdot 5 = 285$ confirms it.

Every problem in this topic follows the same three moves: name the unknown with a variable, write an equation that says what the words say, and solve it, checking the answer against the words. We use them for a start and a rate, for a total split into two parts, for sentences about a number, and for two plans that cost the same.`,
    `在上一个课题中，式子描述了实际情境：水管工每次上门收 $60$ 元，另外每小时收 $45$ 元，工作 $h$ 小时的账单是 $60 + 45h$ 元。知道小时数，就能算出账单。实际问题常常反过来问：账单是 $285$ 元，这次工作用了多久？

式子仍然表示账单，而账单现在已知，所以两者必须相等。把这一点写下来就是一个**方程**，解方程就回答了问题：

$$60 + 45h = 285 \\;\\Rightarrow\\; 45h = 225 \\;\\Rightarrow\\; h = 5.$$

这次工作用了 $5$ 小时，而 $60 + 45 \\cdot 5 = 285$ 验证了它。

这个课题中的每道题都按同样的三步来做：用一个变量表示未知量，写出与文字意思相同的方程，解方程并对照文字检验答案。我们把它们用于起始量与变化率、把总量分成两部分、关于一个数的句子，以及两种费用相同的方案。`,
  ),
  knowledgePoints: [
    {
      id: "start-plus-rate",
      title: t("A starting amount and a rate", "起始量与变化率"),
      explanation: t(
        `To answer a question about a situation:

1. Name the unknown with a variable, saying what it counts.
2. Write an equation that says the same thing as the words.
3. Solve it, and check that the answer fits the words.

When a quantity starts at an amount and changes at a constant rate, step 2 is always "start ± rate × variable = the value we were told", because that expression is exactly how the value is made.

A plumber charges $\\$60$ plus $\\$45$ per hour, and a bill is $\\$285$. Let $h$ be the hours of work. Then $60 + 45h = 285$. Subtract the fixed $60$ first, because it is in the bill however long the job takes: $45h = 225$. Then divide by the rate: $h = 5$ hours. Check: $60 + 45 \\cdot 5 = 285$.

> **Watch out.** Take the starting amount out before dividing by the rate: $285 \\div 45$ ignores the $\\$60$ fee, and adding it, $(285 + 60) \\div 45$, moves it the wrong way. Do not divide by the rate and the fee together, $285 \\div 105$, either: the fee is paid once, not every hour.`,
        `回答实际情境中的问题时：

1. 用一个变量表示未知量，并说明它表示什么。
2. 写出与文字意思相同的方程。
3. 解方程，并检验答案是否符合文字。

如果一个量从某个起始量开始、以固定的变化率变化，第二步总是"起始量 ± 变化率 × 变量 = 已知的值"，因为这个值正是这样算出来的。

水管工收费 $60$ 元加每小时 $45$ 元，某次账单是 $285$ 元。设工作 $h$ 小时，则 $60 + 45h = 285$。先减去固定的 $60$ 元，因为无论工作多久账单里都有它：$45h = 225$。再除以变化率：$h = 5$ 小时。检验：$60 + 45 \\cdot 5 = 285$。

> **注意。** 除以变化率之前要先去掉起始量：$285 \\div 45$ 忽略了 $60$ 元出车费，$(285 + 60) \\div 45$ 则把它移错了方向。也不能把费用和变化率合在一起除，$285 \\div 105$ 是错的：出车费只收一次，不是每小时都收。`,
      ),
      keyPrerequisites: ["two-step-equations", "interpreting-linear-expressions"],
      generate(rng) {
        const c = rng.pick(linearContexts);
        const f = pickStep(rng, c.fixed);
        const r = pickStep(rng, c.rate);
        const n = rng.int(c.count[0], c.count[1]);
        const total = c.grows ? f + r * n : f - r * n;
        const eq = c.grows ? `${f} + ${r}${c.v} = ${total}` : `${f} - ${r}${c.v} = ${total}`;
        const solve = c.grows
          ? t(
              `subtract the starting amount $${f}$ from both sides, then divide by the rate $${r}$:${steps(`${r}${c.v} = ${total - f}`, `${c.v} = ${n}`)}`,
              `两边同时减去起始量 $${f}$，再除以变化率 $${r}$：${steps(`${r}${c.v} = ${total - f}`, `${c.v} = ${n}`)}`,
            )
          : t(
              `subtract the starting amount $${f}$ from both sides, which leaves a negative number on each side; multiply both sides by $-1$ to make them positive, and divide by the rate $${r}$:${steps(`-${r}${c.v} = ${total - f}`, `${r}${c.v} = ${f - total}`, `${c.v} = ${n}`)}`,
              `两边同时减去起始量 $${f}$，这时两边都是负数；两边同时乘以 $-1$ 变成正数，再除以变化率 $${r}$：${steps(`-${r}${c.v} = ${total - f}`, `${r}${c.v} = ${f - total}`, `${c.v} = ${n}`)}`,
            );
        return numberProblem({
          prompt: t(`${c.describe(f, r).en} ${c.findV(total).en}`, `${c.describe(f, r)["zh-CN"]}${c.findV(total)["zh-CN"]}`),
          answer: n,
          wrong: c.grows ? [frac(total, r), frac(total + f, r), frac(total, f + r)] : [frac(total, r), frac(f + total, r), -n],
          solution: t(
            `**Step 1: name the unknown.** Let $${c.v}$ be ${c.vMeaning.en}.

**Step 2: write the equation.** The amount starts at $${f}$ and ${c.grows ? "grows" : "falls"} by $${r}$ for each unit of $${c.v}$, so it is $${f} ${c.grows ? "+" : "-"} ${r}${c.v}$. We are told it is $${total}$:${steps(eq)}**Step 3: solve.** To get $${c.v}$ alone, ${solve.en}**Check.** $${contextAt(c, f, r, n)}$, as the question says.`,
            `**第一步：设未知数。** 设$${c.v}$为${c.vMeaning["zh-CN"]}。

**第二步：列方程。** 这个量从 $${f}$ 开始，$${c.v}$ 每增加一个单位就${c.grows ? "增加" : "减少"} $${r}$，所以它是 $${f} ${c.grows ? "+" : "-"} ${r}${c.v}$。已知它等于 $${total}$：${steps(eq)}**第三步：解方程。** 为了让 $${c.v}$ 单独留下，${solve["zh-CN"]}**检验。** $${contextAt(c, f, r, n)}$，与题目一致。`,
          ),
        });
      },
    },
    {
      id: "splitting-a-total",
      title: t("Splitting a total", "分配总量"),
      explanation: t(
        `When a total is split into two parts and one part is described in terms of the other, use **one** variable for both. Let $x$ be the part the other is described from, here the smaller one, and write the other part as an expression in $x$. Then "the parts make the total" is an equation in $x$ alone.

A $50$ m rope is cut into two pieces, one $8$ m longer than the other. Let $x$ be the shorter piece; the longer one is $x + 8$. Together they make $50$:

$$x + (x + 8) = 50 \\;\\Rightarrow\\; 2x + 8 = 50 \\;\\Rightarrow\\; 2x = 42 \\;\\Rightarrow\\; x = 21.$$

The pieces are $21$ m and $29$ m. Check both conditions: $29$ is $8$ more than $21$, and $21 + 29 = 50$.

> **Watch out.** The parts are not equal, so halving the total, $50 \\div 2 = 25$, is wrong. Take the $8$ out before dividing: $(50 - 8) \\div 2$, not $50 \\div 2 - 8$. And answer the part the question asks for: here the shorter piece is $21$, not $29$.`,
        `当总量被分成两部分、且一部分用另一部分来描述时，只用**一个**变量表示两部分。设作为参照的那部分（这里是较小的部分）为 $x$，把另一部分写成含 $x$ 的式子。这样"两部分合起来是总量"就是只含 $x$ 的方程。

一根 $50$ 米长的绳子剪成两段，一段比另一段长 $8$ 米。设较短的一段为 $x$，较长的一段就是 $x + 8$。两段合起来是 $50$：

$$x + (x + 8) = 50 \\;\\Rightarrow\\; 2x + 8 = 50 \\;\\Rightarrow\\; 2x = 42 \\;\\Rightarrow\\; x = 21.$$

两段分别长 $21$ 米和 $29$ 米。检验两个条件：$29$ 比 $21$ 多 $8$，而 $21 + 29 = 50$。

> **注意。** 两部分不相等，所以把总量平分，$50 \\div 2 = 25$，是错的。相除之前要先去掉 $8$：应是 $(50 - 8) \\div 2$，不是 $50 \\div 2 - 8$。还要回答题目问的那部分：这里较短的一段是 $21$，不是 $29$。`,
      ),
      generate(rng) {
        const money = rng.bool();
        const x = rng.int(5, 40);
        const kind = rng.int(0, 2);
        const k = rng.int(2, 4);
        const d = kind === 1 ? 0 : kind === 0 ? rng.int(1, 15) : rng.bool() ? rng.int(1, 12) : -rng.int(1, 4);
        const kk = kind === 0 ? 1 : k;
        const other = kk * x + d;
        const total = x + other;
        const otherLatex = poly([kk, "x"], [d, ""]);
        const relEn =
          kind === 0
            ? `$${d}$ ${money ? "dollars more than" : "m longer than"}`
            : kind === 1
              ? `$${k}$ times ${money ? "as much as" : "as long as"}`
              : `$${Math.abs(d)}$ ${money ? "dollars" : "m"} ${d > 0 ? "more" : "less"} than $${k}$ times`;
        const relZh =
          kind === 0
            ? money
              ? `比小安多 $${d}$ 元`
              : `比另一段长 $${d}$ 米`
            : kind === 1
              ? money
                ? `是小安的 $${k}$ 倍`
                : `是另一段的 $${k}$ 倍`
              : money
                ? `比小安的 $${k}$ 倍${d > 0 ? "多" : "少"} $${Math.abs(d)}$ 元`
                : `比另一段的 $${k}$ 倍${d > 0 ? "多" : "少"} $${Math.abs(d)}$ 米`;
        const prompt = money
          ? t(
              `Ana and Ben share $\\$${total}$. Ben gets ${relEn} ${kind === 2 ? "Ana's share" : "Ana"}. How many dollars does Ana get?`,
              `小安和小本分 $${total}$ 元，小本分到的钱${relZh}。小安分到多少元？`,
            )
          : t(
              `A rope $${total}$ m long is cut into two pieces. One piece is ${relEn} the other. How long, in meters, is the shorter piece?`,
              `一根长 $${total}$ 米的绳子被剪成两段，其中一段${relZh}。较短的一段长多少米？`,
            );
        const wrong =
          kind === 0
            ? [frac(total, 2), other, total - d]
            : kind === 1
              ? [frac(total, k), other]
              : [frac(total - d, k), frac(total + d, k + 1), other];
        const part = money ? t("Ana's share", "小安分到的钱") : t("the shorter piece", "较短的一段");
        const otherPart = money ? t("Ben's share", "小本分到的钱") : t("the longer piece", "较长的一段");
        const sum = `x + ${otherLatex.includes(" ") ? `(${otherLatex})` : otherLatex}`;
        const lines = [
          `${sum} = ${total}`,
          ...(d === 0
            ? [`${poly([kk + 1, "x"])} = ${total}`]
            : [`${poly([kk + 1, "x"], [d, ""])} = ${total}`, `${poly([kk + 1, "x"])} = ${total - d}`]),
          `x = ${x}`,
        ];
        const otherAt = `${kk === 1 ? `${x}` : `${kk} \\cdot ${x}`}${d === 0 ? "" : ` ${signed(d)}`} = ${other}`;
        const solveEn =
          d === 0
            ? `Combine the terms with $x$ and divide by $${kk + 1}$:`
            : `Combine the terms with $x$, ${d > 0 ? `subtract $${d}$ from` : `add $${-d}$ to`} both sides, and divide by $${kk + 1}$:`;
        const solveZh =
          d === 0
            ? `合并含 $x$ 的项，再除以 $${kk + 1}$：`
            : `合并含 $x$ 的项，两边同时${d > 0 ? `减去 $${d}$` : `加上 $${-d}$`}，再除以 $${kk + 1}$：`;
        return numberProblem({
          prompt,
          answer: x,
          wrong,
          solution: t(
            `**Step 1: one variable for both parts.** Let $x$ be ${part.en}. The description of the other part turns into $${otherLatex}$.

**Step 2: the parts make the total.** ${solveEn}${steps(...lines)}**Check.** ${otherPart.en[0]!.toUpperCase()}${otherPart.en.slice(1)} is $${otherAt}$, and $${x} + ${other} = ${total}$, the total.`,
            `**第一步：用一个变量表示两部分。** 设${part["zh-CN"]}为 $x$。另一部分按题意写成 $${otherLatex}$。

**第二步：两部分合起来是总量。** ${solveZh}${steps(...lines)}**检验。** ${otherPart["zh-CN"]}是 $${otherAt}$，而 $${x} + ${other} = ${total}$，正是总量。`,
          ),
        });
      },
    },
    {
      id: "number-sentences",
      title: t("Translating a sentence about a number", "把关于数的句子译成方程"),
      explanation: t(
        `A sentence about an unknown number becomes an equation when you translate it piece by piece, with a letter for the number. Each phrase has a fixed meaning: "$3$ times a number" is $3n$, "$5$ more than" adds $5$, "$13$ less than" subtracts $13$, and "is" is $=$.

"$5$ more than $3$ times a number is $13$ less than $6$ times the number" becomes

$$3n + 5 = 6n - 13.$$

Now solve as usual. Subtract $3n$ from both sides to get the variable on one side, and add $13$ to get the numbers on the other: $18 = 3n$, so $n = 6$. Check in the sentence: $3 \\cdot 6 + 5 = 23$ and $6 \\cdot 6 - 13 = 23$.

> **Watch out.** "$13$ less than $6n$" means start from $6n$ and take $13$ away: $6n - 13$, not $13 - 6n$. When you move a term, do the same to both sides and keep its sign: subtracting $3n$ from both sides leaves $3n$ on the right, not $9n$.`,
        `关于一个未知数的句子，用一个字母表示这个数、逐段翻译，就变成了方程。每个短语都有确定的含义："一个数的 $3$ 倍"是 $3n$，"加上 $5$"是加 $5$，"减去 $13$"是减 $13$，"等于"是 $=$。

"一个数的 $3$ 倍加上 $5$，等于这个数的 $6$ 倍减去 $13$"译成

$$3n + 5 = 6n - 13.$$

然后照常求解。两边同时减去 $3n$，让变量在一边；再同时加上 $13$，让数在另一边：$18 = 3n$，所以 $n = 6$。代回句子检验：$3 \\cdot 6 + 5 = 23$，$6 \\cdot 6 - 13 = 23$。

> **注意。** "$6n$ 减去 $13$"是从 $6n$ 开始拿走 $13$：$6n - 13$，不是 $13 - 6n$。移项时两边要做同样的运算并保留符号：两边同时减去 $3n$ 后，右边剩 $3n$，不是 $9n$。`,
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        const a = rng.int(2, 9);
        let c = rng.int(2, 9);
        if (c === a) c = a === 9 ? 2 : a + 1;
        const n = rng.nonZero(-10, 15);
        const b = rng.nonZero(-20, 20);
        const d = c * n - a * n - b;
        const leftEn = `$${Math.abs(b)}$ ${b > 0 ? "more" : "less"} than $${a}$ times a number`;
        const rightEn = d === 0 ? `$${c}$ times the number` : `$${Math.abs(d)}$ ${d > 0 ? "less" : "more"} than $${c}$ times the number`;
        const leftZh = `一个数的 $${a}$ 倍${b > 0 ? "加上" : "减去"} $${Math.abs(b)}$`;
        const rightZh = d === 0 ? `这个数的 $${c}$ 倍` : `这个数的 $${c}$ 倍${d > 0 ? "减去" : "加上"} $${Math.abs(d)}$`;
        const eq = `${linear(a, b, "n")} = ${linear(c, -d, "n")}`;
        const moveD =
          d === 0
            ? t("", "")
            : d > 0
              ? t(`, and add $${d}$ to both sides`, `，再同时加上 $${d}$`)
              : t(`, and subtract $${-d}$ from both sides`, `，再同时减去 $${-d}$`);
        const value = a * n + b;
        return numberProblem({
          prompt: t(
            `${leftEn[0]!.toUpperCase()}${leftEn.slice(1)} is ${rightEn}. Find the number.`,
            `${leftZh}，等于${rightZh}。求这个数。`,
          ),
          answer: n,
          wrong: [-n, frac(b + d, a + c)],
          mistakes: [
            why(
              frac(b - d, c - a),
              "Watch which side each term moves to. Subtract the same term from both sides, and keep track of its sign.",
              "注意每一项移到哪一边。两边同时减去同一项，并留意它的符号。",
            ),
          ],
          solution: t(
            `**Step 1: translate.** Let $n$ be the number. The first part of the sentence is $${linear(a, b, "n")}$, "is" is $=$, and the second part is $${linear(c, -d, "n")}$:${steps(eq)}**Step 2: solve.** Subtract $${a}n$ from both sides, so that $n$ is only on the right${moveD.en}, so that the numbers are on the left. Then divide by $${c - a}$:${steps(`${num(b + d)} = ${poly([c - a, "n"])}`, `n = ${num(n)}`)}**Check.** In the sentence: $${a} \\cdot ${paren(n)} ${signed(b)} = ${value}$ and $${c} \\cdot ${paren(n)}${d === 0 ? "" : ` ${signed(-d)}`} = ${value}$. Both sides are equal.`,
            `**第一步：翻译。** 设这个数为 $n$。句子的前半部分是 $${linear(a, b, "n")}$，"等于"是 $=$，后半部分是 $${linear(c, -d, "n")}$：${steps(eq)}**第二步：解方程。** 两边同时减去 $${a}n$，让 $n$ 只在右边${moveD["zh-CN"]}，让数都在左边。再除以 $${c - a}$：${steps(`${num(b + d)} = ${poly([c - a, "n"])}`, `n = ${num(n)}`)}**检验。** 代回句子：$${a} \\cdot ${paren(n)} ${signed(b)} = ${value}$，$${c} \\cdot ${paren(n)}${d === 0 ? "" : ` ${signed(-d)}`} = ${value}$，两边相等。`,
          ),
        });
      },
    },
    {
      id: "comparing-two-plans",
      title: t("When two plans cost the same", "两种方案费用相同"),
      explanation: t(
        `When two quantities both change at constant rates, they are equal at the value of the variable where their expressions are equal. So write each one, set them equal, and solve.

Plan A costs $20 + 8d$ and plan B costs $50 + 5d$ for $d$ days. They cost the same when

$$20 + 8d = 50 + 5d \\;\\Rightarrow\\; 3d = 30 \\;\\Rightarrow\\; d = 10.$$

The step from the first equation to the second shows the idea: subtracting $5d$ and $20$ leaves the **difference of the rates**, $3$ a day, on one side and the **difference of the fees**, $30$, on the other. Plan A starts $\\$30$ cheaper but costs $\\$3$ more each day, so after $10$ days the head start is used up. Check: $20 + 80 = 100$ and $50 + 50 = 100$. For fewer than $10$ days plan A is cheaper; for more, plan B.

> **Watch out.** Subtract, do not add: the fees differ by $50 - 20$, and the rates by $8 - 5$. Using the sum of the rates, or one rate alone, answers a different question.`,
        `当两个量都以固定的变化率变化时，令它们的式子相等，求出的变量值就是它们相等的时候。所以分别写出两个式子，令它们相等，再求解。

方案甲 $d$ 天的费用是 $20 + 8d$，方案乙是 $50 + 5d$。两者费用相同时

$$20 + 8d = 50 + 5d \\;\\Rightarrow\\; 3d = 30 \\;\\Rightarrow\\; d = 10.$$

从第一个方程到第二个方程的这一步体现了思路：两边减去 $5d$ 和 $20$ 后，一边是**单价之差**，每天 $3$ 元，另一边是**固定费用之差** $30$ 元。方案甲起步便宜 $30$ 元，但每天多花 $3$ 元，所以 $10$ 天后这个优势就用完了。检验：$20 + 80 = 100$，$50 + 50 = 100$。少于 $10$ 天时方案甲便宜，多于 $10$ 天时方案乙便宜。

> **注意。** 要相减，不要相加：固定费用相差 $50 - 20$，单价相差 $8 - 5$。用单价之和或只用一个单价，回答的就是另一个问题了。`,
      ),
      generate(rng) {
        const plans = [
          { v: "d", en: "day", ens: "days", zh: "天", what: t("Two car rental companies", "两家租车公司") },
          { v: "c", en: "class", ens: "classes", zh: "节课", what: t("Two dance studios", "两家舞蹈室") },
          { v: "g", en: "gigabyte", ens: "gigabytes", zh: "GB", what: t("Two phone plans", "两种手机套餐") },
          { v: "h", en: "hour", ens: "hours", zh: "小时", what: t("Two bike rental shops", "两家自行车租赁店") },
        ] as const;
        const p = rng.pick(plans);
        const r2 = rng.int(2, 12);
        const r1 = r2 + rng.int(1, 8);
        const n = rng.int(2, 20);
        const f1 = 5 * rng.int(0, 10);
        const f2 = f1 + (r1 - r2) * n;
        const cost = f1 + r1 * n;
        const work = steps(
          `${poly([f1, ""], [r1, p.v])} = ${f2} + ${r2}${p.v}`,
          ...(r1 - r2 === 1 ? [] : [`${poly([r1 - r2, p.v])} = ${f2 - f1}`]),
          `${p.v} = ${n}`,
        );
        const divide =
          r1 - r2 === 1
            ? t(" The rates differ by $1$, so that is already the answer:", "单价相差 $1$，所以这已经是答案：")
            : t(` Then divide by $${r1 - r2}$:`, `再除以 $${r1 - r2}$：`);
        const moveF1 = f1 === 0 ? t("", "") : t(` and subtract $${f1}$ from both sides`, `，再同时减去 $${f1}$`);
        return numberProblem({
          prompt: t(
            `${p.what.en} charge differently: the first charges $\\$${f1}$ plus $\\$${r1}$ per ${p.en}, the second $\\$${f2}$ plus $\\$${r2}$ per ${p.en}. For how many ${p.ens} do they cost the same?`,
            `${p.what["zh-CN"]}的收费不同：第一家收 $${f1}$ 元，另外每${p.zh}收 $${r1}$ 元；第二家收 $${f2}$ 元，另外每${p.zh}收 $${r2}$ 元。多少${p.zh}时两者费用相同？`,
          ),
          answer: n,
          mistakes: [
            why(
              frac(f2 - f1, r1 + r2),
              "You added the rates. Set the two costs equal: the difference of the fees is divided by the difference of the rates.",
              "你把单价相加了。令两个费用相等：固定费用之差除以单价之差。",
            ),
            why(
              frac(f2 + f1, r1 - r2),
              "You added the fees. Set the two costs equal: the difference of the fees is divided by the difference of the rates.",
              "你把固定费用相加了。令两个费用相等：固定费用之差除以单价之差。",
            ),
            why(
              frac(f2 - f1, r1),
              "You used only one rate. Both plans change with the amount, so use the difference of the rates.",
              "你只用了一个单价。两种方案都随数量变化，所以要用单价之差。",
            ),
          ],
          solution: t(
            `**Step 1: write both costs.** Let $${p.v}$ be the number of ${p.ens}. The first costs $${poly([f1, ""], [r1, p.v])}$ dollars and the second $${f2} + ${r2}${p.v}$ dollars.

**Step 2: set them equal and solve.** Subtract $${r2}${p.v}$${moveF1.en}: what is left is the difference of the rates on one side and the difference of the fees on the other.${divide.en}${work}**Check.** For $${n}$ ${p.ens}, the first costs $${f1} + ${r1} \\cdot ${n} = ${cost}$ and the second $${f2} + ${r2} \\cdot ${n} = ${cost}$: the same.`,
            `**第一步：写出两种费用。** 设共 $${p.v}$ ${p.zh}。第一家的费用是 $${poly([f1, ""], [r1, p.v])}$ 元，第二家是 $${f2} + ${r2}${p.v}$ 元。

**第二步：令两者相等并求解。** 两边同时减去 $${r2}${p.v}$${moveF1["zh-CN"]}：一边剩下单价之差，另一边剩下固定费用之差。${divide["zh-CN"]}${work}**检验。** $${n}$ ${p.zh}时，第一家的费用是 $${f1} + ${r1} \\cdot ${n} = ${cost}$，第二家是 $${f2} + ${r2} \\cdot ${n} = ${cost}$：相同。`,
          ),
        });
      },
    },
  ],
};

/** IntegerKind is the kind of consecutive integers: step 1, or step 2 starting from an even or an odd number. */
const integerKinds = [
  { step: 1, parity: -1, en: "consecutive integers", zh: "连续整数" },
  { step: 2, parity: 0, en: "consecutive even integers", zh: "连续偶数" },
  { step: 2, parity: 1, en: "consecutive odd integers", zh: "连续奇数" },
] as const;

const ends = (k: number) =>
  k === 2 ? { small: t("smaller", "较小"), large: t("larger", "较大") } : { small: t("smallest", "最小"), large: t("largest", "最大") };

/** listed writes integers as a sum, with negative ones in parentheses: "(-2) + (-1) + 0". */
const listed = (values: readonly number[]) => values.map(paren).join(" + ");

export const consecutiveIntegerProblems: TopicDef = {
  id: "consecutive-integer-problems",
  title: t("Consecutive Integer Problems", "连续整数问题"),
  summary: t(
    "Write and solve equations about consecutive, consecutive even and consecutive odd integers.",
    "列方程解决连续整数、连续偶数和连续奇数问题。",
  ),
  prerequisites: ["modeling-with-linear-equations"],
  encompasses: [
    { topic: "modeling-with-linear-equations", weight: 0.4 },
    { topic: "two-step-equations", weight: 0.5 },
    { topic: "combining-like-terms", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.1"],
  intro: t(
    `In modeling with linear equations, a total split into two parts was written with **one** variable: the second part was an expression in the first. The same idea solves puzzles about integers that come one after another.

Suppose three integers in a row add up to $54$. They are not known, but each is $1$ more than the one before, so once the first is called $n$, the others are $n + 1$ and $n + 2$. Now the sum is an equation in $n$ alone:

$$n + (n + 1) + (n + 2) = 54 \\;\\Rightarrow\\; 3n + 3 = 54 \\;\\Rightarrow\\; n = 17.$$

The integers are $17$, $18$ and $19$, and $17 + 18 + 19 = 54$.

In this topic we do this for consecutive integers, for consecutive even and odd integers, which go up by $2$, and for other conditions that relate the smallest and the largest.`,
    `在用一次方程建模中，分成两部分的总量只用**一个**变量来表示：第二部分写成含第一部分的式子。同样的思路可以解决一个接一个的整数的问题。

假设三个相邻的整数之和是 $54$。它们都未知，但每个都比前一个大 $1$，所以设第一个为 $n$，另外两个就是 $n + 1$ 和 $n + 2$。这样和就成了只含 $n$ 的方程：

$$n + (n + 1) + (n + 2) = 54 \\;\\Rightarrow\\; 3n + 3 = 54 \\;\\Rightarrow\\; n = 17.$$

这三个整数是 $17$、$18$、$19$，而 $17 + 18 + 19 = 54$。

这个课题对连续整数、每次增加 $2$ 的连续偶数和连续奇数，以及联系最小数与最大数的其他条件，都这样来做。`,
  ),
  knowledgePoints: [
    {
      id: "consecutive-integers",
      title: t("Consecutive integers", "连续整数"),
      explanation: t(
        `**Consecutive integers** follow each other, each $1$ more than the one before. So if the smallest is $n$, the next ones are $n + 1$, $n + 2$, …, and $k$ of them end at $n + (k - 1)$. Writing them all with $n$ turns a condition on all of them into an equation with one unknown.

If three consecutive integers add up to $54$:

$$n + (n + 1) + (n + 2) = 54.$$

The $n$'s add up to $3n$ and the extra amounts to $1 + 2 = 3$, so $3n + 3 = 54$. Subtract $3$ and divide by $3$: $n = 17$. The integers are $17$, $18$ and $19$; check: $17 + 18 + 19 = 54$.

> **Watch out.** $54 \\div 3 = 18$ is the middle integer, not the smallest: dividing the sum by the count gives the average. Answer the integer the question asks for, the smallest $n$ or the largest $n + (k - 1)$, and do not step one past the end.`,
        `**连续整数**一个接一个，每个都比前一个大 $1$。所以如果最小的是 $n$，后面的依次是 $n + 1$、$n + 2$、……，$k$ 个连续整数的最后一个是 $n + (k - 1)$。把它们都用 $n$ 表示，关于它们全体的条件就成了只含一个未知数的方程。

如果三个连续整数的和是 $54$：

$$n + (n + 1) + (n + 2) = 54.$$

三个 $n$ 合起来是 $3n$，多出来的部分是 $1 + 2 = 3$，所以 $3n + 3 = 54$。减去 $3$ 再除以 $3$：$n = 17$。这三个整数是 $17$、$18$、$19$；检验：$17 + 18 + 19 = 54$。

> **注意。** $54 \\div 3 = 18$ 是中间的数，不是最小的数：和除以个数得到的是平均数。要回答题目问的那个数，最小的 $n$ 或最大的 $n + (k - 1)$，也不要多数一个。`,
      ),
      generate(rng) {
        const k = rng.int(2, 5);
        const n = rng.int(-30, 60);
        const tri = (k * (k - 1)) / 2;
        const sum = k * n + tri;
        const largest = rng.bool();
        const answer = largest ? n + k - 1 : n;
        const e = ends(k);
        const terms = Array.from({ length: k }, (_, i) => (i === 0 ? "n" : `(n + ${i})`)).join(" + ");
        const values = Array.from({ length: k }, (_, i) => n + i);
        const extra = Array.from({ length: k - 1 }, (_, i) => `${i + 1}`).join(" + ");
        return numberProblem({
          prompt: t(
            `The sum of $${k}$ consecutive integers is $${sum}$. What is the ${largest ? e.large.en : e.small.en} of them?`,
            `$${k}$ 个连续整数的和是 $${sum}$。其中${largest ? e.large["zh-CN"] : e.small["zh-CN"]}的数是多少？`,
          ),
          answer,
          wrong: [largest ? n : n + k - 1, frac(sum, k), largest ? n + k : n - 1],
          solution: t(
            `**Step 1: write the integers with one variable.** Let the smallest be $n$. Each of the others is $1$ more than the one before, so they are ${Array.from({ length: k - 1 }, (_, i) => `$n + ${i + 1}$`).join(", ")}.

**Step 2: the sum.** The $${k}$ copies of $n$ give $${k}n$, and the extra amounts give $${extra} = ${tri}$:${steps(`${terms} = ${num(sum)}`, `${k}n + ${tri} = ${num(sum)}`)}**Step 3: solve.** Subtract $${tri}$ and divide by $${k}$:${steps(`${k}n = ${num(sum - tri)}`, `n = ${num(n)}`)}The integers are ${values.map((v) => `$${num(v)}$`).join(", ")}, so the ${largest ? e.large.en : e.small.en} is $${num(answer)}$.

**Check.** $${listed(values)} = ${num(sum)}$, the given sum.`,
            `**第一步：用一个变量表示这些整数。** 设最小的数为 $n$。其余每个数都比前一个大 $1$，所以依次是 ${Array.from({ length: k - 1 }, (_, i) => `$n + ${i + 1}$`).join("、")}。

**第二步：求和。** $${k}$ 个 $n$ 合起来是 $${k}n$，多出来的部分是 $${extra} = ${tri}$：${steps(`${terms} = ${num(sum)}`, `${k}n + ${tri} = ${num(sum)}`)}**第三步：解方程。** 减去 $${tri}$，再除以 $${k}$：${steps(`${k}n = ${num(sum - tri)}`, `n = ${num(n)}`)}这些整数是 ${values.map((v) => `$${num(v)}$`).join("、")}，所以${largest ? e.large["zh-CN"] : e.small["zh-CN"]}的数是 $${num(answer)}$。

**检验。** $${listed(values)} = ${num(sum)}$，正是已知的和。`,
          ),
        });
      },
    },
    {
      id: "consecutive-even-and-odd",
      title: t("Consecutive even and odd integers", "连续偶数与连续奇数"),
      explanation: t(
        `Consecutive **even** integers, such as $8, 10, 12$, skip the odd ones between them, so each is $2$ more than the one before. Consecutive **odd** integers, such as $7, 9, 11$, also go up by $2$. So in both cases they are $n$, $n + 2$, $n + 4$, …; the equation is the same, and whether $n$ comes out even or odd says which kind they are.

If three consecutive odd integers add up to $81$:

$$n + (n + 2) + (n + 4) = 81 \\;\\Rightarrow\\; 3n + 6 = 81 \\;\\Rightarrow\\; 3n = 75 \\;\\Rightarrow\\; n = 25.$$

The integers are $25$, $27$, $29$: all odd, and $25 + 27 + 29 = 81$.

> **Watch out.** The steps are $2$, not $1$: writing $n + 1$ and $n + 2$ describes consecutive integers, and gives the wrong extra amount. The extra amounts are $2 + 4 = 6$ here. And as before, the sum divided by the count is the middle number, not the smallest.`,
        `连续**偶数**（如 $8, 10, 12$）跳过了中间的奇数，所以每个都比前一个大 $2$。连续**奇数**（如 $7, 9, 11$）也每次增加 $2$。所以两种情况都写成 $n$、$n + 2$、$n + 4$、……；方程是一样的，求出的 $n$ 是偶数还是奇数说明了是哪一种。

如果三个连续奇数的和是 $81$：

$$n + (n + 2) + (n + 4) = 81 \\;\\Rightarrow\\; 3n + 6 = 81 \\;\\Rightarrow\\; 3n = 75 \\;\\Rightarrow\\; n = 25.$$

这三个整数是 $25$、$27$、$29$：都是奇数，而 $25 + 27 + 29 = 81$。

> **注意。** 每次增加 $2$，不是 $1$：写成 $n + 1$、$n + 2$ 表示的是连续整数，多出来的部分也就算错了。这里多出来的部分是 $2 + 4 = 6$。和前面一样，和除以个数得到的是中间的数，不是最小的数。`,
      ),
      generate(rng) {
        const kind = integerKinds[rng.int(1, 2)]!;
        const k = rng.int(2, 4);
        const n = 2 * rng.int(-15, 30) + kind.parity;
        const tri = k * (k - 1);
        const sum = k * n + tri;
        const largest = rng.bool();
        const answer = largest ? n + 2 * (k - 1) : n;
        const stepOne = frac(sum - tri / 2, k);
        const e = ends(k);
        const terms = Array.from({ length: k }, (_, i) => (i === 0 ? "n" : `(n + ${2 * i})`)).join(" + ");
        const values = Array.from({ length: k }, (_, i) => n + 2 * i);
        const extra = Array.from({ length: k - 1 }, (_, i) => `${2 * (i + 1)}`).join(" + ");
        const parity = kind.parity === 0 ? t("even", "偶数") : t("odd", "奇数");
        return numberProblem({
          prompt: t(
            `The sum of $${k}$ ${kind.en} is $${sum}$. What is the ${largest ? e.large.en : e.small.en} of them?`,
            `$${k}$ 个${kind.zh}的和是 $${sum}$。其中${largest ? e.large["zh-CN"] : e.small["zh-CN"]}的数是多少？`,
          ),
          answer,
          wrong: [largest ? n : n + 2 * (k - 1), largest ? stepOne.add(Q.of(k - 1)) : stepOne, frac(sum, k)],
          solution: t(
            `**Step 1: write the integers with one variable.** Let the smallest be $n$. ${kind.en[0]!.toUpperCase()}${kind.en.slice(1)} are $2$ apart, so the others are ${Array.from({ length: k - 1 }, (_, i) => `$n + ${2 * (i + 1)}$`).join(", ")}.

**Step 2: the sum.** The $${k}$ copies of $n$ give $${k}n$, and the extra amounts give $${extra} = ${tri}$:${steps(`${terms} = ${num(sum)}`, `${k}n + ${tri} = ${num(sum)}`)}**Step 3: solve.** Subtract $${tri}$ and divide by $${k}$:${steps(`${k}n = ${num(sum - tri)}`, `n = ${num(n)}`)}The integers are ${values.map((v) => `$${num(v)}$`).join(", ")}, so the ${largest ? e.large.en : e.small.en} is $${num(answer)}$.

**Check.** $${num(n)}$ is ${parity.en}, as it must be, and $${listed(values)} = ${num(sum)}$, the given sum.`,
            `**第一步：用一个变量表示这些整数。** 设最小的数为 $n$。${kind.zh}每两个相差 $2$，所以其余的依次是 ${Array.from({ length: k - 1 }, (_, i) => `$n + ${2 * (i + 1)}$`).join("、")}。

**第二步：求和。** $${k}$ 个 $n$ 合起来是 $${k}n$，多出来的部分是 $${extra} = ${tri}$：${steps(`${terms} = ${num(sum)}`, `${k}n + ${tri} = ${num(sum)}`)}**第三步：解方程。** 减去 $${tri}$，再除以 $${k}$：${steps(`${k}n = ${num(sum - tri)}`, `n = ${num(n)}`)}这些整数是 ${values.map((v) => `$${num(v)}$`).join("、")}，所以${largest ? e.large["zh-CN"] : e.small["zh-CN"]}的数是 $${num(answer)}$。

**检验。** $${num(n)}$ 是${parity["zh-CN"]}，符合要求，而 $${listed(values)} = ${num(sum)}$，正是已知的和。`,
          ),
        });
      },
    },
    {
      id: "relations-between-consecutive-integers",
      title: t("Relations between consecutive integers", "连续整数之间的关系"),
      explanation: t(
        `Conditions other than a sum are translated the same way: write every integer the condition mentions in terms of the smallest, $n$, and the condition becomes an equation in $n$. With a step of $s$ ($1$ for consecutive integers, $2$ for even or odd ones), the largest of $k$ integers is $n + (k - 1)s$.

For three consecutive even integers $n$, $n + 2$, $n + 4$, "three times the smallest is $10$ more than the largest" says

$$3n = (n + 4) + 10 \\;\\Rightarrow\\; 2n = 14 \\;\\Rightarrow\\; n = 7.$$

But $7$ is odd, so no three consecutive even integers have this property. The equation only knows the steps between the numbers, not that they must be even; the check has to supply that.

> **Watch out.** The largest is $n + (k - 1)s$: three even integers end at $n + 4$, not $n + 2$, and consecutive integers end at $n + 2$, not $n + 4$. Using the wrong step is the usual mistake. Then check the answer against every condition, the kind of integer included.`,
        `和以外的条件也用同样的方法翻译：把条件中提到的每个整数都用最小的数 $n$ 表示，条件就成了关于 $n$ 的方程。设相邻两数相差 $s$（连续整数为 $1$，连续偶数或奇数为 $2$），$k$ 个整数中最大的是 $n + (k - 1)s$。

三个连续偶数 $n$、$n + 2$、$n + 4$ 中，"最小数的 $3$ 倍比最大数多 $10$"是

$$3n = (n + 4) + 10 \\;\\Rightarrow\\; 2n = 14 \\;\\Rightarrow\\; n = 7.$$

但 $7$ 是奇数，所以没有满足这个条件的三个连续偶数。方程只知道数之间相差多少，不知道它们必须是偶数；这要靠检验来补上。

> **注意。** 最大的数是 $n + (k - 1)s$：三个连续偶数的最后一个是 $n + 4$，不是 $n + 2$；三个连续整数的最后一个是 $n + 2$，不是 $n + 4$。用错相差的数是常见的错误。求出答案后要对照每个条件检验，包括整数的种类。`,
      ),
      generate(rng) {
        const kind = rng.pick(integerKinds);
        const k = rng.int(2, 3);
        const s = kind.step;
        const n = kind.parity < 0 ? rng.int(1, 40) : 2 * rng.int(1, 20) + kind.parity;
        const last = n + (k - 1) * s;
        const e = ends(k);
        const otherStep = s === 1 ? 2 : 1;
        const gap = (k - 1) * s;
        const kindCheck =
          kind.parity < 0
            ? t("", "")
            : kind.parity === 0
              ? t(` $${n}$ is even, as it must be.`, `$${n}$ 是偶数，符合要求。`)
              : t(` $${n}$ is odd, as it must be.`, `$${n}$ 是奇数，符合要求。`);
        const why1 = t(
          `**Step 1: write both integers with one variable.** Let the ${e.small.en} be $n$. The integers go up by $${s}$, and the ${e.large.en} is $${k - 1}$ step${k === 2 ? "" : "s"} further, so it is $n + ${gap}$.`,
          `**第一步：用一个变量表示两个数。** 设${e.small["zh-CN"]}的数为 $n$。这些整数每次增加 $${s}$，${e.large["zh-CN"]}的数在 $${k - 1}$ 步之后，所以是 $n + ${gap}$。`,
        );
        if (rng.bool()) {
          const p = rng.int(2, 5);
          const c = p * n - last;
          const relEn = c === 0 ? "equal to" : `$${Math.abs(c)}$ ${c > 0 ? "more" : "less"} than`;
          const relZh = c === 0 ? "等于" : `比${e.large["zh-CN"]}的数${c > 0 ? "多" : "少"} $${Math.abs(c)}$`;
          const right = c === 0 ? `n + ${gap}` : `n + ${gap} ${c > 0 ? "+" : "-"} ${Math.abs(c)}`;
          return numberProblem({
            prompt: t(
              `For $${k}$ ${kind.en}, $${p}$ times the ${e.small.en} is ${relEn} the ${e.large.en}. Find the ${e.small.en}.`,
              `有 $${k}$ 个${kind.zh}，${e.small["zh-CN"]}的数的 $${p}$ 倍${c === 0 ? `等于${e.large["zh-CN"]}的数` : relZh}。求${e.small["zh-CN"]}的数。`,
            ),
            answer: n,
            wrong: [last, frac(c + (k - 1) * otherStep, p - 1), frac(c, p - 1)],
            solution: t(
              `${why1.en}

**Step 2: translate and solve.** "$${p}$ times the ${e.small.en}" is $${p}n$, and "is ${c === 0 ? "equal to" : `$${Math.abs(c)}$ ${c > 0 ? "more" : "less"} than`} the ${e.large.en}" is $${right}$. Subtract $n$ from both sides${p === 2 ? "" : ` and divide by $${p - 1}$`}:${steps(`${p}n = ${right}`, ...(p === 2 ? [] : [`${p - 1}n = ${gap + c}`]), `n = ${n}`)}**Check.** The ${e.large.en} is $${last}$, and $${p} \\cdot ${n} = ${p * n}$${c === 0 ? ", the same number" : ` is $${last} ${signed(c)}$`}.${kindCheck.en}`,
              `${why1["zh-CN"]}

**第二步：翻译并求解。** "${e.small["zh-CN"]}的数的 $${p}$ 倍"是 $${p}n$，"${c === 0 ? "等于" : `比${e.large["zh-CN"]}的数${c > 0 ? "多" : "少"} $${Math.abs(c)}$`}"是 $${right}$。两边同时减去 $n$${p === 2 ? "" : `，再除以 $${p - 1}$`}：${steps(`${p}n = ${right}`, ...(p === 2 ? [] : [`${p - 1}n = ${gap + c}`]), `n = ${n}`)}**检验。** ${e.large["zh-CN"]}的数是 $${last}$，而 $${p} \\cdot ${n} = ${p * n}$${c === 0 ? `，等于它` : `，正是 $${last} ${signed(c)}$`}。${kindCheck["zh-CN"]}`,
            ),
          });
        }
        const p = rng.int(2, 4);
        const total = n + p * last;
        return numberProblem({
          prompt: t(
            `For $${k}$ ${kind.en}, the sum of the ${e.small.en} and $${p}$ times the ${e.large.en} is $${total}$. Find the ${e.small.en}.`,
            `有 $${k}$ 个${kind.zh}，${e.small["zh-CN"]}的数与${e.large["zh-CN"]}的数的 $${p}$ 倍之和是 $${total}$。求${e.small["zh-CN"]}的数。`,
          ),
          answer: n,
          wrong: [last, frac(total - (k - 1) * s, p + 1), frac(total - p * (k - 1) * otherStep, p + 1)],
          solution: t(
            `${why1.en}

**Step 2: translate.** The ${e.small.en} plus $${p}$ times the ${e.large.en} is $n + ${p}(n + ${gap})$. Multiply out the parentheses, so that every $n$ is counted, and collect the $n$'s:${steps(`n + ${p}(n + ${gap}) = ${total}`, `${p + 1}n + ${p * gap} = ${total}`)}**Step 3: solve.** Subtract $${p * gap}$ and divide by $${p + 1}$:${steps(`${p + 1}n = ${total - p * gap}`, `n = ${n}`)}**Check.** The ${e.large.en} is $${last}$, and $${n} + ${p} \\cdot ${last} = ${total}$.${kindCheck.en}`,
            `${why1["zh-CN"]}

**第二步：翻译。** ${e.small["zh-CN"]}的数加上${e.large["zh-CN"]}的数的 $${p}$ 倍是 $n + ${p}(n + ${gap})$。去括号，让每个 $n$ 都计算在内，再合并含 $n$ 的项：${steps(`n + ${p}(n + ${gap}) = ${total}`, `${p + 1}n + ${p * gap} = ${total}`)}**第三步：解方程。** 减去 $${p * gap}$，再除以 $${p + 1}$：${steps(`${p + 1}n = ${total - p * gap}`, `n = ${n}`)}**检验。** ${e.large["zh-CN"]}的数是 $${last}$，而 $${n} + ${p} \\cdot ${last} = ${total}$。${kindCheck["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

/** movers travel at r = 6k km/h for k in the given range, so that times in minutes give terminating decimals. */
const movers = [
  { en: "A runner", zh: "一位跑步者", k: [1, 3] },
  { en: "A cyclist", zh: "一位骑车人", k: [2, 6] },
  { en: "A bus", zh: "一辆公交车", k: [5, 12] },
  { en: "A train", zh: "一列火车", k: [8, 15] },
] as const;

const minuteChoices = [10, 15, 20, 25, 30, 40, 45, 50, 75, 90] as const;

/** harmonicPairs are pairs of different speeds whose harmonic mean 2ab/(a+b) is an integer. */
const harmonicPairs: readonly (readonly [number, number])[] = (() => {
  const out: [number, number][] = [];
  for (let a = 10; a <= 90; a += 5) {
    for (let b = a + 5; b <= 90; b += 5) {
      if ((2 * a * b) % (a + b) === 0) out.push([a, b]);
    }
  }
  return out;
})();

/** boatSpeeds are still-water speeds b and current speeds c with (b² − c²)/b an integer. */
const boatSpeeds: readonly (readonly [number, number])[] = (() => {
  const out: [number, number][] = [];
  for (let b = 6; b <= 30; b++) {
    for (let c = 1; c < b / 2; c++) {
      if ((c * c) % b === 0) out.push([b, c]);
    }
  }
  return out;
})();

const halves = (rng: Rng, min: number, max: number) => frac(rng.int(2 * min, 2 * max), 2);

/** lcmOf is the least common multiple of two positive integers. */
const lcmOf = (a: number, b: number) => {
  let x = a;
  let y = b;
  while (y !== 0) [x, y] = [y, x % y];
  return (a / x) * b;
};

export const speedDistanceTime: TopicDef = {
  id: "speed-distance-time",
  title: t("Speed, Distance, Time Problems", "速度、路程与时间问题"),
  summary: t(
    "Use $d = rt$ with consistent units, trips in two parts and average speed.",
    "使用单位一致的 $d = rt$，解决分两段的行程和平均速度问题。",
  ),
  prerequisites: ["modeling-with-linear-equations", "adding-and-subtracting-fractions"],
  encompasses: [{ topic: "unit-rates", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.HSA.CED.A.1", "CCSS.HSN.Q.A.1"],
  intro: t(
    `A speed is a unit rate: $60$ km/h means $60$ kilometers for every hour. In modeling with linear equations, a rate times a number of units gave a total; for motion, that total is the distance. So a car at $60$ km/h covers $60t$ km in $t$ hours, and

$$d = rt: \\quad \\text{distance} = \\text{rate} \\times \\text{time}.$$

The formula answers three questions, depending on which two quantities are known. A bus covers $150$ km in $2.5$ hours: its speed is $150 \\div 2.5 = 60$ km/h. At that speed, $210$ km takes $210 \\div 60 = 3.5$ hours.

In this topic we use $d = rt$ with units that match, set up equations for trips in two parts at different speeds, and work out the average speed of a whole trip, which is not the average of the speeds.`,
    `速度是一种单位率：$60$ 千米/时表示每小时行驶 $60$ 千米。在用一次方程建模中，变化率乘以单位数得到总量；对于运动，这个总量就是路程。所以速度为 $60$ 千米/时的汽车在 $t$ 小时内行驶 $60t$ 千米，即

$$d = rt: \\quad \\text{路程} = \\text{速度} \\times \\text{时间}.$$

根据已知的是哪两个量，这个公式能回答三种问题。一辆公交车 $2.5$ 小时行驶 $150$ 千米：它的速度是 $150 \\div 2.5 = 60$ 千米/时。以这个速度，行驶 $210$ 千米需要 $210 \\div 60 = 3.5$ 小时。

这个课题中，我们在单位一致的前提下使用 $d = rt$，为速度不同的两段行程列方程，并求出全程的平均速度，它并不是各速度的平均数。`,
  ),
  knowledgePoints: [
    {
      id: "distance-rate-time",
      title: t("Distance, rate and time", "路程、速度与时间"),
      explanation: t(
        `Distance equals rate times time, $d = rt$, because the rate is the distance for each unit of time and the time counts the units. Dividing both sides by $t$ or by $r$ gives the other two forms, $r = \\frac{d}{t}$ and $t = \\frac{d}{r}$.

The rate's units decide the time's units: with a speed in kilometers **per hour**, the time must be in **hours**. Change minutes to hours by dividing by $60$, since an hour has $60$ minutes. $40$ minutes is $\\frac{40}{60} = \\frac{2}{3}$ hour, so at $27$ km/h a cyclist covers

$$27 \\cdot \\frac{2}{3} = 18 \\text{ km}.$$

Check with the other form: $18 \\div \\frac{2}{3} = 27$ km/h.

> **Watch out.** Do not put minutes into a formula with km/h: $27 \\cdot 40 = 1080$ km is the distance for $40$ **hours**. Change minutes to hours by dividing by $60$, not by $100$, and turn hours back into minutes by multiplying by $60$. And check which form you need: speed is distance divided by time, not time divided by distance.`,
        `路程等于速度乘以时间，$d = rt$，因为速度是每单位时间的路程，而时间表示有多少个单位。两边同时除以 $t$ 或 $r$，就得到另外两种形式：$r = \\frac{d}{t}$，$t = \\frac{d}{r}$。

速度的单位决定时间的单位：速度以千米**每小时**为单位时，时间必须以**小时**为单位。一小时有 $60$ 分钟，所以分钟数除以 $60$ 就化成小时。$40$ 分钟是 $\\frac{40}{60} = \\frac{2}{3}$ 小时，所以以 $27$ 千米/时的速度骑行，路程是

$$27 \\cdot \\frac{2}{3} = 18 \\text{ 千米}.$$

用另一种形式检验：$18 \\div \\frac{2}{3} = 27$ 千米/时。

> **注意。** 不要把分钟直接代入以千米/时为单位的公式：$27 \\cdot 40 = 1080$ 千米是 $40$ **小时**的路程。分钟化小时要除以 $60$，不是除以 $100$；小时化回分钟要乘以 $60$。还要看清用哪种形式：速度是路程除以时间，不是时间除以路程。`,
      ),
      keyPrerequisites: ["unit-rates"],
      generate(rng) {
        const m = rng.pick(movers);
        const k = rng.int(m.k[0], m.k[1]);
        const r = 6 * k;
        const minutes = rng.pick(minuteChoices);
        const d = frac(k * minutes, 10);
        const hours = frac(minutes, 60);
        const kind = rng.int(0, 2);
        const h = hours.toLatex();
        const convert = t(
          `**Step 1: change the time to hours.** The speed is per hour, so the time must be in hours. An hour has $60$ minutes:${steps(`${minutes} \\text{ min} = \\frac{${minutes}}{60} \\text{ h} = ${h} \\text{ h}`)}`,
          `**第一步：把时间化成小时。** 速度是每小时的路程，所以时间必须以小时为单位。一小时有 $60$ 分钟：${steps(`${minutes} \\text{ 分钟} = \\frac{${minutes}}{60} \\text{ 小时} = ${h} \\text{ 小时}`)}`,
        );
        if (kind === 0) {
          return numberProblem({
            prompt: t(
              `${m.en} travels $${dec(d)}$ km in $${minutes}$ minutes. What is its average speed in kilometers per hour?`,
              `${m.zh}在 $${minutes}$ 分钟内行进了 $${dec(d)}$ 千米。它的平均速度是每小时多少千米？`,
            ),
            answer: r,
            wrong: [frac(r, 60), 10 * k, d.mul(Q.of(minutes))],
            solution: t(
              `${convert.en}**Step 2: divide.** Speed is distance per unit of time, so divide the distance by the time in hours:${steps(`r = \\frac{d}{t} = ${dec(d)} \\div ${h} = ${r}`)}**Check.** At $${r}$ km/h for $${h}$ hour, the distance is $${r} \\cdot ${h} = ${dec(d)}$ km, as given.`,
              `${convert["zh-CN"]}**第二步：相除。** 速度是单位时间内的路程，所以用路程除以以小时为单位的时间：${steps(`r = \\frac{d}{t} = ${dec(d)} \\div ${h} = ${r}`)}**检验。** 以 $${r}$ 千米/时行进 $${h}$ 小时，路程是 $${r} \\cdot ${h} = ${dec(d)}$ 千米，与已知一致。`,
            ),
          });
        }
        if (kind === 1) {
          return numberProblem({
            prompt: t(
              `${m.en} travels at $${r}$ km/h. How many minutes does it take to cover $${dec(d)}$ km?`,
              `${m.zh}的速度是 $${r}$ 千米/时。行进 $${dec(d)}$ 千米需要多少分钟？`,
            ),
            answer: minutes,
            wrong: [hours, frac(5 * minutes, 3), frac(3600, minutes)],
            solution: t(
              `**Step 1: the time in hours.** From $d = rt$, the time is the distance divided by the speed. The speed is in km/h, so this gives hours:${steps(`t = \\frac{d}{r} = \\frac{${dec(d)}}{${r}} = ${h} \\text{ h}`)}**Step 2: change to minutes.** The question asks for minutes, and each hour is $60$ minutes:${steps(`${h} \\cdot 60 = ${minutes}`)}**Check.** In $${minutes}$ minutes, which is $${h}$ hour, the distance is $${r} \\cdot ${h} = ${dec(d)}$ km.`,
              `**第一步：以小时为单位的时间。** 由 $d = rt$，时间等于路程除以速度。速度以千米/时为单位，所以得到的是小时：${steps(`t = \\frac{d}{r} = \\frac{${dec(d)}}{${r}} = ${h} \\text{ 小时}`)}**第二步：化成分钟。** 题目问的是分钟数，每小时 $60$ 分钟：${steps(`${h} \\cdot 60 = ${minutes}`)}**检验。** $${minutes}$ 分钟即 $${h}$ 小时，路程是 $${r} \\cdot ${h} = ${dec(d)}$ 千米。`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `${m.en} travels at $${r}$ km/h for $${minutes}$ minutes. How many kilometers does it cover?`,
            `${m.zh}以 $${r}$ 千米/时的速度行进 $${minutes}$ 分钟。它行进了多少千米？`,
          ),
          answer: d,
          wrong: [r * minutes, frac(r * minutes, 100), frac(r, minutes)],
          solution: t(
            `${convert.en}**Step 2: multiply.** Each hour adds $${r}$ km, so the distance is the rate times the time:${steps(`d = rt = ${r} \\cdot ${h} = ${dec(d)}`)}**Check.** Dividing back, $${dec(d)} \\div ${r} = ${h}$ hour, which is $${minutes}$ minutes.`,
            `${convert["zh-CN"]}**第二步：相乘。** 每小时行进 $${r}$ 千米，所以路程等于速度乘以时间：${steps(`d = rt = ${r} \\cdot ${h} = ${dec(d)}`)}**检验。** 反过来相除，$${dec(d)} \\div ${r} = ${h}$ 小时，即 $${minutes}$ 分钟。`,
          ),
        });
      },
    },
    {
      id: "trips-in-two-parts",
      title: t("Trips in two parts", "分两段的行程"),
      explanation: t(
        `When a trip has two parts at different speeds, there are two unknown times, but they add up to the total time. So use one variable: let $t$ be the time of one part; the other part takes the rest, total minus $t$. Then the distances of the parts, each rate times its time, add up to the whole distance.

Sam drives $260$ km in $4$ hours, partly at $80$ km/h and partly at $50$ km/h. Let $t$ be the hours at $80$ km/h; the rest took $4 - t$ hours:

$$80t + 50(4 - t) = 260 \\;\\Rightarrow\\; 30t + 200 = 260 \\;\\Rightarrow\\; 30t = 60 \\;\\Rightarrow\\; t = 2.$$

Check: $2$ hours at $80$ is $160$ km, $2$ hours at $50$ is $100$ km, and $160 + 100 = 260$.

> **Watch out.** Do not add the speeds and divide, $260 \\div 130$: the two speeds are not driven at the same time. Multiply out $50(4 - t)$ fully, which gives $-50t$ too. And answer the part asked for: $t$ is the time at the speed you named it for, and the other part took the total minus $t$.`,
        `当行程分两段、速度不同时，有两个未知的时间，但它们的和是总时间。所以只用一个变量：设其中一段用时为 $t$，另一段用时就是总时间减去 $t$。这样两段的路程（各自的速度乘以时间）加起来就是全程。

小山用 $4$ 小时开了 $260$ 千米，一部分速度是 $80$ 千米/时，其余是 $50$ 千米/时。设以 $80$ 千米/时开了 $t$ 小时，其余用了 $4 - t$ 小时：

$$80t + 50(4 - t) = 260 \\;\\Rightarrow\\; 30t + 200 = 260 \\;\\Rightarrow\\; 30t = 60 \\;\\Rightarrow\\; t = 2.$$

检验：以 $80$ 开 $2$ 小时是 $160$ 千米，以 $50$ 开 $2$ 小时是 $100$ 千米，而 $160 + 100 = 260$。

> **注意。** 不要把两个速度相加再相除，$260 \\div 130$ 是错的：两个速度并不是同时行驶的。$50(4 - t)$ 要完整展开，其中也有 $-50t$。还要回答题目问的那一段：$t$ 是你设定的那一段的时间，另一段是总时间减去 $t$。`,
      ),
      generate(rng) {
        const r1 = 10 * rng.int(4, 12);
        let r2 = 10 * rng.int(3, 10);
        if (r2 === r1) r2 = r1 - 10;
        const t1 = halves(rng, 1, 4);
        const t2 = halves(rng, 1, 4);
        const total = t1.add(t2);
        const dist = t1.mul(Q.of(r1)).add(t2.mul(Q.of(r2)));
        const rest = total.mul(Q.of(r2));
        const left = dist.sub(rest);
        const d1 = t1.mul(Q.of(r1));
        const d2 = t2.mul(Q.of(r2));
        return numberProblem({
          prompt: t(
            `Sam drove $${dec(dist)}$ km in $${dec(total)}$ hours, at $${r1}$ km/h on the highway and at $${r2}$ km/h on the rest of the trip. How many of the hours were on the highway?`,
            `小山用 $${dec(total)}$ 小时开了 $${dec(dist)}$ 千米，高速公路上的速度是 $${r1}$ 千米/时，其余路段的速度是 $${r2}$ 千米/时。其中在高速公路上开了多少小时？`,
          ),
          answer: t1,
          wrong: [t2, dist.div(Q.of(r1 + r2)), total.div(Q.of(2))],
          solution: t(
            `**Step 1: one variable for both times.** Let $t$ be the hours on the highway. The two times add up to $${dec(total)}$, so the rest took $${dec(total)} - t$ hours.

**Step 2: the distances make the whole.** Each part's distance is its speed times its time:${steps(`${r1}t + ${r2}(${dec(total)} - t) = ${dec(dist)}`)}**Step 3: solve.** Multiply out the parentheses, collect the terms with $t$, subtract $${dec(rest)}$, and divide by $${r1 - r2}$:${steps(`${poly([r1 - r2, "t"])} + ${dec(rest)} = ${dec(dist)}`, `${poly([r1 - r2, "t"])} = ${dec(left)}`, `t = ${dec(t1)}`)}**Check.** $${dec(t1)}$ hours at $${r1}$ km/h is $${dec(d1)}$ km, and the other $${dec(t2)}$ hours at $${r2}$ km/h are $${dec(d2)}$ km. Together: $${dec(d1)} + ${dec(d2)} = ${dec(dist)}$ km.`,
            `**第一步：用一个变量表示两段时间。** 设在高速公路上开了 $t$ 小时。两段时间之和是 $${dec(total)}$，所以其余路段用了 $${dec(total)} - t$ 小时。

**第二步：两段路程合起来是全程。** 每段的路程等于速度乘以时间：${steps(`${r1}t + ${r2}(${dec(total)} - t) = ${dec(dist)}`)}**第三步：解方程。** 去括号，合并含 $t$ 的项，减去 $${dec(rest)}$，再除以 $${r1 - r2}$：${steps(`${poly([r1 - r2, "t"])} + ${dec(rest)} = ${dec(dist)}`, `${poly([r1 - r2, "t"])} = ${dec(left)}`, `t = ${dec(t1)}`)}**检验。** 以 $${r1}$ 千米/时开 $${dec(t1)}$ 小时是 $${dec(d1)}$ 千米，其余 $${dec(t2)}$ 小时以 $${r2}$ 千米/时开了 $${dec(d2)}$ 千米。合计：$${dec(d1)} + ${dec(d2)} = ${dec(dist)}$ 千米。`,
          ),
        });
      },
    },
    {
      id: "average-speed",
      title: t("Average speed", "平均速度"),
      explanation: t(
        `The average speed of a trip is the speed that would cover the same distance in the same time, so it is **total distance divided by total time**. It is not the average of the speeds, because the parts usually take different times, and the part that takes longer counts for more.

Driving $120$ km at $40$ km/h takes $3$ hours, and driving back at $60$ km/h takes $2$ hours. That is $240$ km in $5$ hours:

$$\\frac{240}{5} = 48 \\text{ km/h}, \\text{ not } \\frac{40 + 60}{2} = 50.$$

The slow part lasted longer, so the average is nearer to $40$. Check: $48$ km/h for $5$ hours is $240$ km.

> **Watch out.** Averaging the speeds, $\\frac{40 + 60}{2}$, gives the right answer only when the two parts take equal times. Divide by the total **time**, not by the number of parts, and use the total distance, both ways for a round trip.`,
        `一段行程的平均速度，是在相同时间内走完相同路程所需的速度，所以它等于**总路程除以总时间**。它不是各速度的平均数，因为各段用时通常不同，用时较长的那段所占的分量更大。

以 $40$ 千米/时开 $120$ 千米用 $3$ 小时，以 $60$ 千米/时开回来用 $2$ 小时。共 $5$ 小时行驶 $240$ 千米：

$$\\frac{240}{5} = 48 \\text{ 千米/时},\\quad\\text{而不是 } \\frac{40 + 60}{2} = 50.$$

较慢的一段用时更长，所以平均速度更接近 $40$。检验：以 $48$ 千米/时行驶 $5$ 小时是 $240$ 千米。

> **注意。** 把速度平均，$\\frac{40 + 60}{2}$，只有两段用时相等时才对。要除以总**时间**，不是除以段数；往返时要用来回的总路程。`,
      ),
      generate(rng) {
        if (rng.bool()) {
          const [a, b] = rng.pick(harmonicPairs);
          const [r1, r2] = rng.bool() ? [a, b] : [b, a];
          const avg = frac(2 * r1 * r2, r1 + r2);
          const L = lcmOf(r1, r2);
          return numberProblem({
            prompt: t(
              `Lena drives from her home to a lake at $${r1}$ km/h and back along the same road at $${r2}$ km/h. What is her average speed for the round trip, in km/h?`,
              `小莲从家开车去湖边，速度是 $${r1}$ 千米/时，沿原路返回的速度是 $${r2}$ 千米/时。往返的平均速度是多少千米/时？`,
            ),
            answer: avg,
            wrong: [frac(r1 + r2, 2), frac(r1 * r2, r1 + r2)],
            solution: t(
              `**Step 1: the total time.** The distance is not given, so let $d$ be the one-way distance. Each way takes the distance divided by that way's speed, so the round trip takes${steps(`\\frac{d}{${r1}} + \\frac{d}{${r2}} = \\frac{${r2}d + ${r1}d}{${r1 * r2}} = \\frac{${r1 + r2}d}{${r1 * r2}}`)}**Step 2: total distance over total time.** The total distance is $2d$. Dividing by a fraction is multiplying by its reciprocal, and the $d$ cancels, so the answer does not depend on the distance:${steps(`\\text{average speed} = 2d \\cdot \\frac{${r1 * r2}}{${r1 + r2}d} = \\frac{${2 * r1 * r2}}{${r1 + r2}} = ${avg.toLatex()}`)}**Check.** Try a one-way distance of $${L}$ km: going takes $${L / r1}$ hours and returning $${L / r2}$ hours, so $${2 * L}$ km take $${L / r1 + L / r2}$ hours, and $${2 * L} \\div ${L / r1 + L / r2} = ${avg.toLatex()}$ km/h.`,
              `**第一步：总时间。** 题目没有给出距离，所以设单程距离为 $d$。每个方向的用时等于距离除以这个方向的速度，所以往返用时${steps(`\\frac{d}{${r1}} + \\frac{d}{${r2}} = \\frac{${r2}d + ${r1}d}{${r1 * r2}} = \\frac{${r1 + r2}d}{${r1 * r2}}`)}**第二步：总路程除以总时间。** 总路程是 $2d$。除以一个分数等于乘以它的倒数，$d$ 被约去，所以答案与距离无关：${steps(`\\text{平均速度} = 2d \\cdot \\frac{${r1 * r2}}{${r1 + r2}d} = \\frac{${2 * r1 * r2}}{${r1 + r2}} = ${avg.toLatex()}`)}**检验。** 取单程 $${L}$ 千米：去时用 $${L / r1}$ 小时，回时用 $${L / r2}$ 小时，$${2 * L}$ 千米共用 $${L / r1 + L / r2}$ 小时，而 $${2 * L} \\div ${L / r1 + L / r2} = ${avg.toLatex()}$ 千米/时。`,
            ),
          });
        }
        const r1 = 5 * rng.int(4, 18);
        let r2 = 5 * rng.int(4, 18);
        if (r2 === r1) r2 = r1 + 5;
        const t1 = rng.int(1, 4);
        let t2 = rng.int(1, 4);
        if (t2 === t1) t2 = t1 === 4 ? 1 : t1 + 1;
        const dist = r1 * t1 + r2 * t2;
        const avg = frac(dist, t1 + t2);
        const written = `\\frac{${dist}}{${t1 + t2}}`;
        const quotient = avg.toLatex() === written ? written : `${written} = ${avg.toLatex()}`;
        return numberProblem({
          prompt: t(
            `A truck drives for $${t1}$ hour${t1 === 1 ? "" : "s"} at $${r1}$ km/h, then for $${t2}$ hour${t2 === 1 ? "" : "s"} at $${r2}$ km/h. What is its average speed for the whole trip, in km/h?`,
            `一辆卡车以 $${r1}$ 千米/时的速度行驶 $${t1}$ 小时，再以 $${r2}$ 千米/时的速度行驶 $${t2}$ 小时。全程的平均速度是多少千米/时？`,
          ),
          answer: avg,
          wrong: [frac(r1 + r2, 2), frac(dist, 2)],
          solution: t(
            `**Step 1: the total distance.** Each part's distance is its speed times its time:${steps(`${r1} \\cdot ${t1} + ${r2} \\cdot ${t2} = ${r1 * t1} + ${r2 * t2} = ${dist}`)}**Step 2: divide by the total time.** The trip took $${t1} + ${t2} = ${t1 + t2}$ hours:${steps(quotient)}The average is closer to $${t1 > t2 ? r1 : r2}$ km/h, the speed driven for longer.

**Check.** At $${avg.toLatex()}$ km/h for $${t1 + t2}$ hours the truck would cover $${avg.toLatex()} \\cdot ${t1 + t2} = ${dist}$ km, the same distance.`,
            `**第一步：总路程。** 每段的路程等于速度乘以时间：${steps(`${r1} \\cdot ${t1} + ${r2} \\cdot ${t2} = ${r1 * t1} + ${r2 * t2} = ${dist}`)}**第二步：除以总时间。** 全程用时 $${t1} + ${t2} = ${t1 + t2}$ 小时：${steps(quotient)}平均速度更接近行驶时间较长的 $${t1 > t2 ? r1 : r2}$ 千米/时。

**检验。** 以 $${avg.toLatex()}$ 千米/时行驶 $${t1 + t2}$ 小时，路程是 $${avg.toLatex()} \\cdot ${t1 + t2} = ${dist}$ 千米，相同。`,
          ),
        });
      },
    },
  ],
};

export const furtherSpeedDistanceTime: TopicDef = {
  id: "further-speed-distance-time",
  title: t("Further Speed, Distance, Time Problems", "速度、路程与时间问题进阶"),
  summary: t(
    "Solve problems about two movers approaching or catching up with each other, and round trips at different speeds.",
    "解决两个物体相向而行、追及以及不同速度往返的问题。",
  ),
  prerequisites: ["speed-distance-time"],
  encompasses: [{ topic: "speed-distance-time", weight: 0.6 }],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.1"],
  intro: t(
    `With one mover, $d = rt$ links distance, rate and time. Many questions involve **two** movers: two cars driving toward each other, a car chasing a truck, or one boat going downstream and back. Each mover still obeys $d = rt$, so we write a distance for each and look for what links them.

Two towns are $210$ km apart, and cars leave both at once toward each other, at $60$ and $45$ km/h. After $t$ hours the first has gone $60t$ km and the second $45t$ km. They meet when the two distances together fill the gap:

$$60t + 45t = 210 \\;\\Rightarrow\\; 105t = 210 \\;\\Rightarrow\\; t = 2.$$

They meet after $2$ hours, when the first has gone $120$ km and the second $90$ km.

In this topic the link is a sum of distances for movers approaching each other, equal distances for catching up, and equal distances with different times for round trips.`,
    `对于一个运动的物体，$d = rt$ 联系着路程、速度和时间。许多问题涉及**两个**运动的物体：两辆相向而行的车、一辆追赶卡车的小汽车，或者一艘顺流而下再返回的船。每个物体仍然满足 $d = rt$，所以分别写出各自的路程，再找出它们之间的联系。

两城相距 $210$ 千米，两辆车同时从两城出发相向而行，速度分别是 $60$ 和 $45$ 千米/时。$t$ 小时后，第一辆行驶了 $60t$ 千米，第二辆行驶了 $45t$ 千米。两段路程合起来等于两城的距离时，它们相遇：

$$60t + 45t = 210 \\;\\Rightarrow\\; 105t = 210 \\;\\Rightarrow\\; t = 2.$$

它们 $2$ 小时后相遇，这时第一辆行驶了 $120$ 千米，第二辆行驶了 $90$ 千米。

这个课题中，相向而行时的联系是路程之和，追及时是路程相等，往返时是路程相等而时间不同。`,
  ),
  knowledgePoints: [
    {
      id: "moving-toward-each-other",
      title: t("Moving toward each other", "相向而行"),
      explanation: t(
        `Two movers that head toward each other each cover part of the gap, and they meet when their two distances add up to the whole gap. After $t$ hours at speeds $r_1$ and $r_2$ they have covered $r_1 t + r_2 t = (r_1 + r_2)t$ together, so the gap closes at the **sum** of the speeds.

Towns $210$ km apart, cars at $60$ and $45$ km/h:

$$60t + 45t = 210 \\;\\Rightarrow\\; 105t = 210 \\;\\Rightarrow\\; t = 2 \\text{ hours}.$$

Check: $120 + 90 = 210$. The same holds for two movers leaving one place in opposite directions: the distance between them grows at the sum of the speeds. To find **where** they meet, multiply one mover's speed by the meeting time.

> **Watch out.** Use the sum of the speeds, not the difference: the difference is for one mover chasing another in the same direction. The meeting point is not halfway unless the speeds are equal, and a question about a distance is not answered by the time.`,
        `两个物体相向而行时，各自走完距离的一部分，两段路程加起来等于全部距离时相遇。以速度 $r_1$ 和 $r_2$ 行进 $t$ 小时后，它们一共走了 $r_1 t + r_2 t = (r_1 + r_2)t$，所以距离以速度之**和**缩短。

两城相距 $210$ 千米，两辆车速度分别是 $60$ 和 $45$ 千米/时：

$$60t + 45t = 210 \\;\\Rightarrow\\; 105t = 210 \\;\\Rightarrow\\; t = 2 \\text{ 小时}.$$

检验：$120 + 90 = 210$。两个物体从同一地点向相反方向出发时也一样：它们之间的距离以速度之和增加。要求在**哪里**相遇，就用一个物体的速度乘以相遇时间。

> **注意。** 要用速度之和，不是速度之差：速度之差用于同方向的追及。除非速度相等，相遇点不在中点；问的是距离时，不能用时间来回答。`,
      ),
      generate(rng) {
        const r1 = 5 * rng.int(2, 16);
        let r2 = 5 * rng.int(2, 16);
        if (r2 === r1) r2 = r1 + 5;
        const time = halves(rng, 1, 4);
        const dist = time.mul(Q.of(r1 + r2));
        const kind = rng.int(0, 2);
        const d1 = time.mul(Q.of(r1));
        const d2 = time.mul(Q.of(r2));
        const sumCheck = `${r1} \\cdot ${dec(time)} + ${r2} \\cdot ${dec(time)} = ${dec(d1)} + ${dec(d2)} = ${dec(dist)}`;
        if (kind === 2) {
          return numberProblem({
            prompt: t(
              `Towns A and B are $${dec(dist)}$ km apart. A car leaves A for B at $${r1}$ km/h, and at the same time a truck leaves B for A at $${r2}$ km/h. How far from A, in km, do they meet?`,
              `甲、乙两城相距 $${dec(dist)}$ 千米。一辆小汽车以 $${r1}$ 千米/时的速度从甲城开往乙城，同时一辆卡车以 $${r2}$ 千米/时的速度从乙城开往甲城。它们在离甲城多少千米处相遇？`,
            ),
            answer: d1,
            wrong: [dist.div(Q.of(2)), d2, time],
            solution: t(
              `**Step 1: the meeting time.** Let $t$ be the hours until they meet. The car covers $${r1}t$ km and the truck $${r2}t$ km, and together they cover the whole $${dec(dist)}$ km:${steps(`${r1}t + ${r2}t = ${dec(dist)}`, `${r1 + r2}t = ${dec(dist)}`, `t = ${dec(time)}`)}**Step 2: the meeting point.** The distance from A is how far the car, which started at A, has gone:${steps(`${r1} \\cdot ${dec(time)} = ${dec(d1)}`)}**Check.** The truck has gone $${r2} \\cdot ${dec(time)} = ${dec(d2)}$ km from B, and $${dec(d1)} + ${dec(d2)} = ${dec(dist)}$, the distance between the towns.`,
              `**第一步：相遇时间。** 设 $t$ 小时后相遇。小汽车行驶 $${r1}t$ 千米，卡车行驶 $${r2}t$ 千米，合起来是全程 $${dec(dist)}$ 千米：${steps(`${r1}t + ${r2}t = ${dec(dist)}`, `${r1 + r2}t = ${dec(dist)}`, `t = ${dec(time)}`)}**第二步：相遇地点。** 离甲城的距离就是从甲城出发的小汽车行驶的路程：${steps(`${r1} \\cdot ${dec(time)} = ${dec(d1)}`)}**检验。** 卡车从乙城行驶了 $${r2} \\cdot ${dec(time)} = ${dec(d2)}$ 千米，而 $${dec(d1)} + ${dec(d2)} = ${dec(dist)}$，正是两城的距离。`,
            ),
          });
        }
        const toward = kind === 0;
        return numberProblem({
          prompt: toward
            ? t(
                `Two cyclists are $${dec(dist)}$ km apart and ride toward each other, one at $${r1}$ km/h and the other at $${r2}$ km/h. After how many hours do they meet?`,
                `两位骑车人相距 $${dec(dist)}$ 千米，相向而行，速度分别是 $${r1}$ 千米/时和 $${r2}$ 千米/时。多少小时后他们相遇？`,
              )
            : t(
                `Two trains leave the same station at the same time in opposite directions, one at $${r1}$ km/h and the other at $${r2}$ km/h. After how many hours are they $${dec(dist)}$ km apart?`,
                `两列火车同时从同一车站向相反方向出发，速度分别是 $${r1}$ 千米/时和 $${r2}$ 千米/时。多少小时后它们相距 $${dec(dist)}$ 千米？`,
              ),
          answer: time,
          wrong: [dist.div(Q.of(Math.abs(r1 - r2))), time.mul(Q.of(2)), dist.div(Q.of(r1))],
          solution: t(
            `**Step 1: write each distance.** Let $t$ be the number of hours. In that time one covers $${r1}t$ km and the other $${r2}t$ km. ${toward ? "They ride toward each other, so they meet when the two distances together fill the gap" : "They move apart from the same point, so the distance between them is the sum of the two distances"}:${steps(`${r1}t + ${r2}t = ${dec(dist)}`)}**Step 2: solve.** The distance between them changes at $${r1} + ${r2} = ${r1 + r2}$ km/h. Divide by it:${steps(`${r1 + r2}t = ${dec(dist)}`, `t = ${dec(time)}`)}**Check.** $${sumCheck}$ km.`,
            `**第一步：写出各自的路程。** 设经过 $t$ 小时。这段时间里一方行进 $${r1}t$ 千米，另一方行进 $${r2}t$ 千米。${toward ? "他们相向而行，两段路程合起来等于原来的距离时相遇" : "它们从同一地点向相反方向出发，所以它们之间的距离是两段路程之和"}：${steps(`${r1}t + ${r2}t = ${dec(dist)}`)}**第二步：解方程。** 它们之间的距离以 $${r1} + ${r2} = ${r1 + r2}$ 千米/时变化。两边除以它：${steps(`${r1 + r2}t = ${dec(dist)}`, `t = ${dec(time)}`)}**检验。** $${sumCheck}$ 千米。`,
          ),
        });
      },
    },
    {
      id: "catching-up",
      title: t("Catching up", "追及问题"),
      explanation: t(
        `When a faster mover follows a slower one along the same route from the same start, it catches up at the moment both have covered the **same distance**. The slower one has been moving longer, by its head start, so the two times differ and the two distances are written with them.

A truck leaves at $50$ km/h; $2$ hours later a car follows at $75$ km/h. If the car drives $t$ hours, the truck has driven $t + 2$ hours:

$$75t = 50(t + 2) \\;\\Rightarrow\\; 75t = 50t + 100 \\;\\Rightarrow\\; 25t = 100 \\;\\Rightarrow\\; t = 4.$$

The $25t = 100$ line shows the idea: the truck's lead is $50 \\cdot 2 = 100$ km, and the car gains on it at $75 - 50 = 25$ km/h, the **difference** of the speeds. Check: $75 \\cdot 4 = 300$ and $50 \\cdot 6 = 300$.

> **Watch out.** The gap closes at the difference of the speeds, not their sum, since both move the same way. The head start is measured in hours, so the lead in kilometers is the slower speed times the head start. And say which time you mean: $t$ counts from when the faster one leaves, not from the first start.`,
        `较快的物体从同一起点沿同一路线追赶较慢的物体时，两者走过的**路程相同**的那一刻追上。较慢的物体多走了先出发的那段时间，所以两者的时间不同，路程也要用各自的时间来写。

一辆卡车以 $50$ 千米/时出发，$2$ 小时后一辆小汽车以 $75$ 千米/时沿同一路线追赶。若小汽车开了 $t$ 小时，卡车就开了 $t + 2$ 小时：

$$75t = 50(t + 2) \\;\\Rightarrow\\; 75t = 50t + 100 \\;\\Rightarrow\\; 25t = 100 \\;\\Rightarrow\\; t = 4.$$

$25t = 100$ 这一行体现了思路：卡车领先 $50 \\cdot 2 = 100$ 千米，小汽车每小时追近 $75 - 50 = 25$ 千米，即速度之**差**。检验：$75 \\cdot 4 = 300$，$50 \\cdot 6 = 300$。

> **注意。** 两者同向而行，距离以速度之差缩短，不是速度之和。先出发的时间以小时计，所以领先的千米数是较慢的速度乘以这段时间。还要说清是哪段时间：$t$ 是从较快的一方出发时算起，不是从最先出发时算起。`,
      ),
      generate(rng) {
        // A truck stays under 90 km/h, however the head start and the gap fall out.
        let time = rng.int(1, 6);
        const gap = 5 * rng.int(1, 4);
        if (gap * time > 90) time = rng.int(1, 4);
        const head = rng.pick([1, 2, 3].filter((h) => (gap * time) % h === 0));
        const r1 = (gap * time) / head;
        const r2 = r1 + gap;
        const walking = r1 <= 6;
        const cycling = !walking && r1 <= 20;
        const lead = r1 * head;
        return numberProblem({
          prompt: walking
            ? t(
                `Mo leaves home on foot at $${r1}$ km/h. $${head}$ hour${head === 1 ? "" : "s"} later his sister follows the same route by bike at $${r2}$ km/h. How many hours after she leaves does she catch up with him?`,
                `小默以 $${r1}$ 千米/时的速度从家步行出发。$${head}$ 小时后，他姐姐骑自行车以 $${r2}$ 千米/时的速度沿同一路线追赶。姐姐出发后多少小时追上他？`,
              )
            : cycling
              ? t(
                  `A cyclist leaves a town at $${r1}$ km/h. $${head}$ hour${head === 1 ? "" : "s"} later a motorcyclist leaves the same town along the same road at $${r2}$ km/h. How many hours after the motorcyclist leaves does the motorcyclist catch up with the cyclist?`,
                  `一名骑车人以 $${r1}$ 千米/时的速度从镇上出发。$${head}$ 小时后，一名摩托车手以 $${r2}$ 千米/时的速度从同一地点沿同一条路出发。摩托车手出发后多少小时追上骑车人？`,
                )
              : t(
                  `A truck leaves a depot at $${r1}$ km/h. $${head}$ hour${head === 1 ? "" : "s"} later a car leaves the same depot along the same road at $${r2}$ km/h. How many hours after the car leaves does it catch up with the truck?`,
                  `一辆卡车以 $${r1}$ 千米/时的速度从车场出发。$${head}$ 小时后，一辆小汽车以 $${r2}$ 千米/时的速度从同一车场沿同一条路出发。小汽车出发后多少小时追上卡车？`,
                ),
          answer: time,
          wrong: [frac(r1 * head, r1 + r2), time + head, frac(r2 * head, gap)],
          solution: t(
            `**Step 1: the two times.** Let $t$ be the hours after the second one leaves. The first left $${head}$ hour${head === 1 ? "" : "s"} earlier, so it has been moving for $t + ${head}$ hours.

**Step 2: equal distances.** At the moment of catching up both have covered the same distance from the start:${steps(`${r2}t = ${r1}(t + ${head})`)}**Step 3: solve.** Multiply out, subtract $${r1}t$ from both sides, and divide by $${gap}$, the difference of the speeds:${steps(`${r2}t = ${r1}t + ${lead}`, `${gap}t = ${lead}`, `t = ${time}`)}**Check.** The second covers $${r2} \\cdot ${time} = ${r2 * time}$ km, and the first, in $${time + head}$ hours, covers $${r1} \\cdot ${time + head} = ${r1 * (time + head)}$ km: the same.`,
            `**第一步：两段时间。** 设后出发者出发后经过 $t$ 小时。先出发者早 $${head}$ 小时出发，所以它已行进 $t + ${head}$ 小时。

**第二步：路程相等。** 追上的那一刻，两者离起点的路程相同：${steps(`${r2}t = ${r1}(t + ${head})`)}**第三步：解方程。** 去括号，两边同时减去 $${r1}t$，再除以速度之差 $${gap}$：${steps(`${r2}t = ${r1}t + ${lead}`, `${gap}t = ${lead}`, `t = ${time}`)}**检验。** 后出发者行进了 $${r2} \\cdot ${time} = ${r2 * time}$ 千米，先出发者在 $${time + head}$ 小时内行进了 $${r1} \\cdot ${time + head} = ${r1 * (time + head)}$ 千米：相同。`,
          ),
        });
      },
    },
    {
      id: "round-trips",
      title: t("Round trips at different speeds", "不同速度的往返"),
      explanation: t(
        `On a round trip the distance is the same both ways, but at different speeds the times differ. Each time is distance over speed, so with a one-way distance $d$ the total time is $\\frac{d}{r_1} + \\frac{d}{r_2}$, and setting it equal to the given time gives an equation in $d$. Multiplying both sides by a common denominator clears the fractions.

Going at $30$ km/h and returning at $20$ km/h takes $5$ hours in all:

$$\\frac{d}{30} + \\frac{d}{20} = 5.$$

Multiply both sides by $60$: $2d + 3d = 300$, so $5d = 300$ and $d = 60$ km. Check: $60 \\div 30 = 2$ hours and $60 \\div 20 = 3$ hours, $5$ in all.

A boat going downstream is carried by the current, so it moves at its own speed **plus** the current; upstream it works against it, at its speed **minus** the current.

> **Watch out.** $d$ is one way: the total time is not $\\frac{2d}{r_1 + r_2}$, and the answer is not the round-trip distance $2d$. Do not use the average of the two speeds either, since the slower way takes longer. For a boat, use the speed in still water only to find the two real speeds.`,
        `往返时两个方向的路程相同，但速度不同，用时也不同。每段的时间等于路程除以速度，所以设单程距离为 $d$，总时间是 $\\frac{d}{r_1} + \\frac{d}{r_2}$；令它等于已知的时间，就得到关于 $d$ 的方程。两边同时乘以公分母可以去掉分母。

去时 $30$ 千米/时、回时 $20$ 千米/时，共用 $5$ 小时：

$$\\frac{d}{30} + \\frac{d}{20} = 5.$$

两边同时乘以 $60$：$2d + 3d = 300$，所以 $5d = 300$，$d = 60$ 千米。检验：$60 \\div 30 = 2$ 小时，$60 \\div 20 = 3$ 小时，共 $5$ 小时。

船顺流而下时被水流推着走，速度是船速**加**水速；逆流而上时要克服水流，速度是船速**减**水速。

> **注意。** $d$ 是单程：总时间不是 $\\frac{2d}{r_1 + r_2}$，答案也不是往返的路程 $2d$。也不能用两个速度的平均数，因为较慢的方向用时更长。对于船，静水速度只用来求出两个实际速度。`,
      ),
      generate(rng) {
        const time = halves(rng, 2, 6);
        if (rng.bool()) {
          const [a, b] = rng.pick(harmonicPairs);
          const [r1, r2] = rng.bool() ? [a, b] : [b, a];
          const d = time.mul(Q.of(r1 * r2)).div(Q.of(r1 + r2));
          const L = lcmOf(r1, r2);
          const go = d.div(Q.of(r1));
          const back = d.div(Q.of(r2));
          return numberProblem({
            prompt: t(
              `A courier rides to a village at $${r1}$ km/h and returns along the same road at $${r2}$ km/h. The round trip takes $${dec(time)}$ hours. How far, in km, is the village?`,
              `一位快递员以 $${r1}$ 千米/时的速度骑车去一个村子，再以 $${r2}$ 千米/时的速度沿原路返回，往返共用 $${dec(time)}$ 小时。村子有多远（千米）？`,
            ),
            answer: d,
            wrong: [time.mul(Q.of(r1 + r2)).div(Q.of(4)), d.mul(Q.of(2)), time.mul(Q.of(r1 + r2)).div(Q.of(2))],
            solution: t(
              `**Step 1: write the two times.** Let $d$ be the distance to the village. Each way takes the distance divided by that way's speed, and the two times add up to the whole trip:${steps(`\\frac{d}{${r1}} + \\frac{d}{${r2}} = ${dec(time)}`)}**Step 2: clear the fractions.** Multiply both sides by $${L}$, a common multiple of $${r1}$ and $${r2}$, then collect and divide:${steps(`${L / r1}d + ${L / r2}d = ${time.mul(Q.of(L)).toLatex()}`, `${L / r1 + L / r2}d = ${time.mul(Q.of(L)).toLatex()}`, `d = ${d.toLatex()}`)}**Check.** Going takes $${d.toLatex()} \\div ${r1} = ${go.toLatex()}$ hours and returning $${d.toLatex()} \\div ${r2} = ${back.toLatex()}$ hours; together $${go.toLatex()} + ${back.toLatex()} = ${dec(time)}$.`,
              `**第一步：写出两段时间。** 设到村子的距离为 $d$。每个方向的用时等于距离除以这个方向的速度，两段时间之和是往返的总时间：${steps(`\\frac{d}{${r1}} + \\frac{d}{${r2}} = ${dec(time)}`)}**第二步：去分母。** 两边同时乘以 $${r1}$ 和 $${r2}$ 的公倍数 $${L}$，再合并、相除：${steps(`${L / r1}d + ${L / r2}d = ${time.mul(Q.of(L)).toLatex()}`, `${L / r1 + L / r2}d = ${time.mul(Q.of(L)).toLatex()}`, `d = ${d.toLatex()}`)}**检验。** 去时用 $${d.toLatex()} \\div ${r1} = ${go.toLatex()}$ 小时，回时用 $${d.toLatex()} \\div ${r2} = ${back.toLatex()}$ 小时；合计 $${go.toLatex()} + ${back.toLatex()} = ${dec(time)}$。`,
            ),
          });
        }
        const [b, c] = rng.pick(boatSpeeds);
        const down = b + c;
        const up = b - c;
        const d = time.mul(Q.of(down * up)).div(Q.of(2 * b));
        const go = d.div(Q.of(down));
        const back = d.div(Q.of(up));
        const right = time.mul(Q.of(down * up));
        return numberProblem({
          prompt: t(
            `A boat moves at $${b}$ km/h in still water, and the river's current flows at $${c}$ km/h. The boat goes downstream to a dock and comes back upstream in $${dec(time)}$ hours in all. How far, in km, is the dock?`,
            `一艘船在静水中的速度是 $${b}$ 千米/时，河水的流速是 $${c}$ 千米/时。船顺流而下到一个码头，再逆流返回，共用 $${dec(time)}$ 小时。码头有多远（千米）？`,
          ),
          answer: d,
          wrong: [time.mul(Q.of(b)).div(Q.of(2)), d.mul(Q.of(2)), time.mul(Q.of(down)).div(Q.of(2))],
          solution: t(
            `**Step 1: the two speeds.** Downstream the current helps, so the boat moves at $${b} + ${c} = ${down}$ km/h; upstream it works against the current, at $${b} - ${c} = ${up}$ km/h.

**Step 2: the two times.** Let $d$ be the distance to the dock. The times down and back add up to the whole trip:${steps(`\\frac{d}{${down}} + \\frac{d}{${up}} = ${dec(time)}`)}**Step 3: clear the fractions.** Multiply both sides by $${down} \\cdot ${up} = ${down * up}$, then collect and divide by $${2 * b}$:${steps(`${up}d + ${down}d = ${right.toLatex()}`, `${2 * b}d = ${right.toLatex()}`, `d = ${d.toLatex()}`)}**Check.** Down takes $${d.toLatex()} \\div ${down} = ${go.toLatex()}$ hours and back $${d.toLatex()} \\div ${up} = ${back.toLatex()}$ hours; together $${go.toLatex()} + ${back.toLatex()} = ${dec(time)}$.`,
            `**第一步：两个速度。** 顺流时水流帮助船前进，速度是 $${b} + ${c} = ${down}$ 千米/时；逆流时要克服水流，速度是 $${b} - ${c} = ${up}$ 千米/时。

**第二步：两段时间。** 设到码头的距离为 $d$。顺流和逆流的时间之和是往返的总时间：${steps(`\\frac{d}{${down}} + \\frac{d}{${up}} = ${dec(time)}`)}**第三步：去分母。** 两边同时乘以 $${down} \\cdot ${up} = ${down * up}$，再合并，除以 $${2 * b}$：${steps(`${up}d + ${down}d = ${right.toLatex()}`, `${2 * b}d = ${right.toLatex()}`, `d = ${d.toLatex()}`)}**检验。** 顺流用 $${d.toLatex()} \\div ${down} = ${go.toLatex()}$ 小时，逆流用 $${d.toLatex()} \\div ${up} = ${back.toLatex()}$ 小时；合计 $${go.toLatex()} + ${back.toLatex()} = ${dec(time)}$。`,
          ),
        });
      },
    },
  ],
};

const workers = [
  { a: t("Ana", "安娜"), b: t("Ben", "本"), task: t("paint a fence", "粉刷一道篱笆") },
  { a: t("Pipe A", "甲管"), b: t("pipe B", "乙管"), task: t("fill a pool", "注满一个水池") },
  { a: t("Printer A", "甲打印机"), b: t("printer B", "乙打印机"), task: t("print a batch of flyers", "打印一批传单") },
  { a: t("Mei", "小美"), b: t("Raj", "小杰"), task: t("mow a lawn", "修剪一片草坪") },
] as const;

/** sharedTimes are pairs of different solo times a, b whose time together ab/(a+b) is a whole or half number of hours. */
const sharedTimes: readonly (readonly [number, number])[] = (() => {
  const out: [number, number][] = [];
  for (let a = 2; a <= 30; a++) {
    for (let b = 2; b <= 30; b++) {
      if (a !== b && (2 * a * b) % (a + b) === 0) out.push([a, b]);
    }
  }
  return out;
})();

export const workProblems: TopicDef = {
  id: "work-problems",
  title: t("Modeling Work Problems", "工作问题建模"),
  summary: t(
    "Add rates of work to solve problems about people or machines working together.",
    "把工作效率相加，解决多人或多台机器合作的问题。",
  ),
  prerequisites: ["modeling-with-linear-equations", "adding-and-subtracting-fractions"],
  encompasses: [{ topic: "adding-and-subtracting-fractions", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.1"],
  intro: t(
    `Speed is distance per hour, and $d = rt$. Work has a rate too: the part of a job done per hour. If Ana paints a fence in $3$ hours, she paints $\\frac{1}{3}$ of it each hour, and in $t$ hours she paints $\\frac{t}{3}$ of it. The whole job is $1$.

Rates of work add, the way two cars approaching each other close the gap at the sum of their speeds. If Ben paints the same fence in $6$ hours, together they paint $\\frac{1}{3} + \\frac{1}{6} = \\frac{1}{2}$ of it each hour, so they finish in $2$ hours:

$$\\frac{t}{3} + \\frac{t}{6} = 1 \\;\\Rightarrow\\; 2t + t = 6 \\;\\Rightarrow\\; t = 2.$$

The times themselves do not add: $3 + 6 = 9$ hours would be longer than either alone. In this topic we find the time together, one worker's time from the time together, the time when one worker undoes the job, and the time when one worker starts alone.`,
    `速度是每小时的路程，$d = rt$。工作也有效率：每小时完成工作的几分之几。如果安娜 $3$ 小时刷完一道篱笆，她每小时刷 $\\frac{1}{3}$，$t$ 小时刷 $\\frac{t}{3}$。全部工作量是 $1$。

工作效率可以相加，就像两辆相向而行的车以速度之和缩短距离一样。如果本 $6$ 小时刷完同一道篱笆，两人合作每小时刷 $\\frac{1}{3} + \\frac{1}{6} = \\frac{1}{2}$，所以 $2$ 小时刷完：

$$\\frac{t}{3} + \\frac{t}{6} = 1 \\;\\Rightarrow\\; 2t + t = 6 \\;\\Rightarrow\\; t = 2.$$

时间本身不能相加：$3 + 6 = 9$ 小时比任何一人单独做的时间都长。这个课题中，我们求合作的时间，由合作时间求一方的时间，求一方起相反作用时的时间，以及一方先单独做时的时间。`,
  ),
  knowledgePoints: [
    {
      id: "working-together",
      title: t("Working together", "合作完成"),
      explanation: t(
        `A worker who finishes a job in $a$ hours does $\\frac{1}{a}$ of it each hour, so in $t$ hours does $\\frac{t}{a}$ of it. Working together, each does a part, and the parts add up to the whole job, $1$. So add the **parts** (or the rates), not the times.

Ana paints a fence in $3$ hours and Ben in $6$. In $t$ hours together:

$$\\frac{t}{3} + \\frac{t}{6} = 1.$$

Multiply both sides by $6$ to clear the fractions: $2t + t = 6$, so $3t = 6$ and $t = 2$ hours. Check: in $2$ hours Ana paints $\\frac{2}{3}$ and Ben $\\frac{2}{6} = \\frac{1}{3}$ of the fence, and $\\frac{2}{3} + \\frac{1}{3} = 1$.

> **Watch out.** The time together is shorter than either time alone, so it is neither the sum of the times, $3 + 6$, nor their average, $4.5$. And $\\frac{1}{3} + \\frac{1}{6} = \\frac{1}{2}$ is the rate together; the time is its reciprocal, $2$, not $\\frac{1}{2}$.`,
        `一个人 $a$ 小时完成一项工作，每小时就完成 $\\frac{1}{a}$，$t$ 小时完成 $\\frac{t}{a}$。合作时各自完成一部分，这些部分加起来是全部工作量 $1$。所以相加的是**工作量**（或效率），而不是时间。

安娜 $3$ 小时刷完篱笆，本要 $6$ 小时。两人合作 $t$ 小时：

$$\\frac{t}{3} + \\frac{t}{6} = 1.$$

两边同时乘以 $6$ 去分母：$2t + t = 6$，所以 $3t = 6$，$t = 2$ 小时。检验：$2$ 小时里安娜刷了 $\\frac{2}{3}$，本刷了 $\\frac{2}{6} = \\frac{1}{3}$，而 $\\frac{2}{3} + \\frac{1}{3} = 1$。

> **注意。** 合作的时间比任何一方单独做的时间都短，所以它既不是时间之和 $3 + 6$，也不是平均数 $4.5$。$\\frac{1}{3} + \\frac{1}{6} = \\frac{1}{2}$ 是合作的效率，时间是它的倒数 $2$，不是 $\\frac{1}{2}$。`,
      ),
      keyPrerequisites: ["adding-and-subtracting-fractions"],
      generate(rng) {
        const w = rng.pick(workers);
        const a = rng.int(2, 12);
        let b = rng.int(2, 15);
        if (b === a) b = a + rng.int(1, 3);
        const together = frac(a * b, a + b);
        const partA = together.div(Q.of(a));
        const partB = together.div(Q.of(b));
        return numberProblem({
          prompt: t(
            `${w.a.en} can ${w.task.en} alone in $${a}$ hours, and ${w.b.en} can do it alone in $${b}$ hours. How many hours does it take them working together?`,
            `${w.a["zh-CN"]}单独${w.task["zh-CN"]}需要 $${a}$ 小时，${w.b["zh-CN"]}单独完成需要 $${b}$ 小时。两者合作需要多少小时？`,
          ),
          answer: together,
          wrong: [frac(a + b, 2), a + b, frac(a + b, a * b)],
          solution: t(
            `**Step 1: the parts of the job.** Let $t$ be the hours together. ${w.a.en} does $\\frac{1}{${a}}$ of the job per hour, so $\\frac{t}{${a}}$ in $t$ hours; ${w.b.en} does $\\frac{t}{${b}}$. The two parts make the whole job:${steps(`\\frac{t}{${a}} + \\frac{t}{${b}} = 1`)}**Step 2: clear the fractions and solve.** Multiply both sides by $${a} \\cdot ${b} = ${a * b}$, collect the terms with $t$, and divide by $${a + b}$:${steps(`${b}t + ${a}t = ${a * b}`, `${a + b}t = ${a * b}`, `t = ${together.toLatex()}`)}**Check.** In $${together.toLatex()}$ hours, ${w.a.en} does $${partA.toLatex()}$ of the job and ${w.b.en} $${partB.toLatex()}$, and $${partA.toLatex()} + ${partB.toLatex()} = 1$.`,
            `**第一步：各自完成的工作量。** 设合作 $t$ 小时。${w.a["zh-CN"]}每小时完成 $\\frac{1}{${a}}$，$t$ 小时完成 $\\frac{t}{${a}}$；${w.b["zh-CN"]}完成 $\\frac{t}{${b}}$。两部分合起来是全部工作：${steps(`\\frac{t}{${a}} + \\frac{t}{${b}} = 1`)}**第二步：去分母并求解。** 两边同时乘以 $${a} \\cdot ${b} = ${a * b}$，合并含 $t$ 的项，再除以 $${a + b}$：${steps(`${b}t + ${a}t = ${a * b}`, `${a + b}t = ${a * b}`, `t = ${together.toLatex()}`)}**检验。** $${together.toLatex()}$ 小时里，${w.a["zh-CN"]}完成 $${partA.toLatex()}$，${w.b["zh-CN"]}完成 $${partB.toLatex()}$，而 $${partA.toLatex()} + ${partB.toLatex()} = 1$。`,
          ),
        });
      },
    },
    {
      id: "finding-one-rate",
      title: t("Finding one worker's time", "求其中一方的时间"),
      explanation: t(
        `If the time together and one worker's time are known, the other worker's time is the unknown. The equation is the same as before, "the parts make the whole job", with the unknown now in a denominator. Work out the known worker's part first; the rest of the job is the other worker's part.

Together $4$ hours, Ana alone $6$ hours. In $4$ hours Ana does $\\frac{4}{6} = \\frac{2}{3}$ of the job, so Ben does the other $\\frac{1}{3}$. If Ben alone takes $b$ hours, he does $\\frac{4}{b}$ in $4$ hours:

$$\\frac{4}{6} + \\frac{4}{b} = 1 \\;\\Rightarrow\\; \\frac{4}{b} = \\frac{1}{3} \\;\\Rightarrow\\; b = 12.$$

The same result comes from the rates: Ben's rate is the **difference** $\\frac{1}{4} - \\frac{1}{6} = \\frac{1}{12}$. Check: $\\frac{1}{6} + \\frac{1}{12} = \\frac{1}{4}$, the rate together.

> **Watch out.** Times do not subtract: $6 - 4 = 2$ hours is not Ben's time. Neither is twice the time together minus Ana's, which would be right only for equal workers. Ben must be slower than the pair, so his time is longer than $4$ hours.`,
        `已知合作时间和其中一方的时间，另一方的时间就是未知数。方程和前面一样："各自的工作量合起来是全部工作"，只是未知数现在在分母里。先求出已知一方的工作量，剩下的就是另一方的工作量。

合作 $4$ 小时，安娜单独 $6$ 小时。$4$ 小时里安娜完成 $\\frac{4}{6} = \\frac{2}{3}$，所以本完成另外的 $\\frac{1}{3}$。设本单独需要 $b$ 小时，他 $4$ 小时完成 $\\frac{4}{b}$：

$$\\frac{4}{6} + \\frac{4}{b} = 1 \\;\\Rightarrow\\; \\frac{4}{b} = \\frac{1}{3} \\;\\Rightarrow\\; b = 12.$$

用效率也得到同样的结果：本的效率是两个效率之**差**，$\\frac{1}{4} - \\frac{1}{6} = \\frac{1}{12}$。检验：$\\frac{1}{6} + \\frac{1}{12} = \\frac{1}{4}$，正是合作的效率。

> **注意。** 时间不能相减：$6 - 4 = 2$ 小时不是本的时间。合作时间的两倍减去安娜的时间也不对，那只在两人一样快时成立。本一定比两人合作慢，所以他的时间比 $4$ 小时长。`,
      ),
      generate(rng) {
        const w = rng.pick(workers);
        const [a, b] = rng.pick(sharedTimes);
        const together = frac(a * b, a + b);
        const T = dec(together);
        const partA = together.div(Q.of(a));
        const rest = Q.one.sub(partA);
        const rateSum = Q.one.div(together);
        return numberProblem({
          prompt: t(
            `Working together, ${w.a.en} and ${w.b.en} ${w.task.en} in $${T}$ hours. ${w.a.en} alone takes $${a}$ hours. How many hours does ${w.b.en} take alone?`,
            `${w.a["zh-CN"]}和${w.b["zh-CN"]}合作 $${T}$ 小时能${w.task["zh-CN"]}。${w.a["zh-CN"]}单独完成需要 $${a}$ 小时。${w.b["zh-CN"]}单独完成需要多少小时？`,
          ),
          answer: b,
          wrong: [together.mul(Q.of(2)).sub(Q.of(a)), Q.of(a).sub(together), together.mul(Q.of(a)).div(together.add(Q.of(a)))],
          solution: t(
            `**Step 1: the parts of the job.** Let $b$ be the hours ${w.b.en} takes alone. In the $${T}$ hours together, ${w.a.en} does $\\frac{${T}}{${a}}$ of the job and ${w.b.en} $\\frac{${T}}{b}$, and the parts make the whole job:${steps(`\\frac{${T}}{${a}} + \\frac{${T}}{b} = 1`)}**Step 2: the known part.** ${w.a.en}'s part is $\\frac{${T}}{${a}} = ${partA.toLatex()}$. Subtract it from both sides; what is left is ${w.b.en}'s part:${steps(`\\frac{${T}}{b} = ${rest.toLatex()}`)}**Step 3: solve for $b$.** If $${T}$ hours do $${rest.toLatex()}$ of the job, the whole job takes $${T}$ divided by $${rest.toLatex()}$:${steps(`b = ${T} \\div ${rest.toLatex()} = ${b}`)}**Check.** The rates add up to the rate together: $\\frac{1}{${a}} + \\frac{1}{${b}} = ${rateSum.toLatex()}$, which is $1 \\div ${T}$.`,
            `**第一步：各自完成的工作量。** 设${w.b["zh-CN"]}单独完成需要 $b$ 小时。合作的 $${T}$ 小时里，${w.a["zh-CN"]}完成 $\\frac{${T}}{${a}}$，${w.b["zh-CN"]}完成 $\\frac{${T}}{b}$，合起来是全部工作：${steps(`\\frac{${T}}{${a}} + \\frac{${T}}{b} = 1`)}**第二步：已知的部分。** ${w.a["zh-CN"]}的工作量是 $\\frac{${T}}{${a}} = ${partA.toLatex()}$。两边同时减去它，剩下的是${w.b["zh-CN"]}的工作量：${steps(`\\frac{${T}}{b} = ${rest.toLatex()}`)}**第三步：求 $b$。** $${T}$ 小时完成 $${rest.toLatex()}$，完成全部就需要 $${T}$ 除以 $${rest.toLatex()}$：${steps(`b = ${T} \\div ${rest.toLatex()} = ${b}`)}**检验。** 两个效率之和等于合作的效率：$\\frac{1}{${a}} + \\frac{1}{${b}} = ${rateSum.toLatex()}$，正是 $1 \\div ${T}$。`,
          ),
        });
      },
    },
    {
      id: "filling-and-draining",
      title: t("Filling and draining", "注水与放水"),
      explanation: t(
        `Work that undoes the job counts with a **negative** rate: while the inlet adds water, the drain takes some away, so the part the drain does is subtracted. The tank is full when what goes in minus what goes out is one whole tank.

A pipe fills a tank in $3$ hours ($+\\frac{1}{3}$ of the tank per hour) and a drain empties it in $5$ hours ($-\\frac{1}{5}$ per hour). With both open, in $t$ hours:

$$\\frac{t}{3} - \\frac{t}{5} = 1 \\;\\Rightarrow\\; 5t - 3t = 15 \\;\\Rightarrow\\; 2t = 15 \\;\\Rightarrow\\; t = 7.5 \\text{ hours}.$$

Check: in $7.5$ hours the pipe lets in $2.5$ tanks and the drain removes $1.5$, leaving $1$ tank.

> **Watch out.** Subtract the drain's part, do not add it: adding gives the time for two pipes that both fill. The answer is longer than the inlet's time alone, not the difference of the two times, $5 - 3$, nor their average.`,
        `起相反作用的工作，效率记为**负数**：进水管注水的同时排水口放水，所以排水口的工作量要减去。进去的水减去流出的水等于一整箱时，水箱就满了。

一根水管 $3$ 小时注满水箱（每小时 $+\\frac{1}{3}$ 箱），一个排水口 $5$ 小时放空水箱（每小时 $-\\frac{1}{5}$ 箱）。两者同时打开，$t$ 小时后：

$$\\frac{t}{3} - \\frac{t}{5} = 1 \\;\\Rightarrow\\; 5t - 3t = 15 \\;\\Rightarrow\\; 2t = 15 \\;\\Rightarrow\\; t = 7.5 \\text{ 小时}.$$

检验：$7.5$ 小时里水管注入 $2.5$ 箱，排水口放出 $1.5$ 箱，剩下 $1$ 箱。

> **注意。** 排水口的工作量要减去，不能加上：相加得到的是两根都注水的水管所需的时间。答案比进水管单独注水的时间长，既不是两个时间之差 $5 - 3$，也不是它们的平均数。`,
      ),
      generate(rng) {
        const a = rng.int(2, 10);
        const b = a + rng.int(1, 10);
        const time = frac(a * b, b - a);
        const inflow = time.div(Q.of(a));
        const outflow = time.div(Q.of(b));
        return numberProblem({
          prompt: t(
            `An inlet pipe fills an empty tank in $${a}$ hours. A drain empties a full tank in $${b}$ hours. If the tank is empty and both are open, how many hours does it take to fill the tank?`,
            `一根进水管 $${a}$ 小时能注满空水箱，一个排水口 $${b}$ 小时能放空满水箱。水箱是空的，如果两者同时打开，需要多少小时注满水箱？`,
          ),
          answer: time,
          wrong: [frac(a * b, a + b), b - a, frac(a + b, 2)],
          solution: t(
            `**Step 1: in minus out.** Let $t$ be the hours. The inlet lets in $\\frac{t}{${a}}$ of a tank and the drain removes $\\frac{t}{${b}}$, so the water in the tank is the difference. The tank is full when that is $1$:${steps(`\\frac{t}{${a}} - \\frac{t}{${b}} = 1`)}**Step 2: clear the fractions and solve.** Multiply both sides by $${a} \\cdot ${b} = ${a * b}$, collect the terms with $t$, and divide by $${b - a}$:${steps(`${b}t - ${a}t = ${a * b}`, `${poly([b - a, "t"])} = ${a * b}`, `t = ${time.toLatex()}`)}**Check.** In $${time.toLatex()}$ hours the inlet lets in $${inflow.toLatex()}$ tanks and the drain removes $${outflow.toLatex()}$, and $${inflow.toLatex()} - ${outflow.toLatex()} = 1$ tank.`,
            `**第一步：注入减去放出。** 设需要 $t$ 小时。进水管注入 $\\frac{t}{${a}}$ 箱，排水口放出 $\\frac{t}{${b}}$ 箱，水箱里的水是两者之差。它等于 $1$ 时水箱满了：${steps(`\\frac{t}{${a}} - \\frac{t}{${b}} = 1`)}**第二步：去分母并求解。** 两边同时乘以 $${a} \\cdot ${b} = ${a * b}$，合并含 $t$ 的项，再除以 $${b - a}$：${steps(`${b}t - ${a}t = ${a * b}`, `${poly([b - a, "t"])} = ${a * b}`, `t = ${time.toLatex()}`)}**检验。** $${time.toLatex()}$ 小时里进水管注入 $${inflow.toLatex()}$ 箱，排水口放出 $${outflow.toLatex()}$ 箱，而 $${inflow.toLatex()} - ${outflow.toLatex()} = 1$ 箱。`,
          ),
        });
      },
    },
    {
      id: "starting-alone",
      title: t("Starting alone, finishing together", "先单独做，再合作完成"),
      explanation: t(
        `When one worker starts alone and the other joins later, the two work for different lengths of time. Let $t$ be the time they work together; the one who started first works its head start **plus** $t$. Then, as always, the parts add up to the whole job.

Ana ($6$ hours alone) works $2$ hours, then Ben ($3$ hours alone) joins. If they then work together for $t$ hours, Ana works $2 + t$ hours in all and Ben $t$ hours:

$$\\frac{2 + t}{6} + \\frac{t}{3} = 1.$$

Multiply by $6$: $2 + t + 2t = 6$, so $3t = 4$ and $t = \\frac{4}{3}$ hours. Check: Ana works $\\frac{10}{3}$ hours and does $\\frac{10}{18} = \\frac{5}{9}$ of the job; Ben does $\\frac{4}{9}$; together $1$.

> **Watch out.** Ana's head start counts: her part is $\\frac{2 + t}{6}$, not $\\frac{t}{6}$. Do not just subtract the head start from the time together either: what is left after $2$ hours is less than the whole job, and both finish it at the combined rate. The question asks for the extra time, $t$, not Ana's total.`,
        `一方先单独做、另一方后来加入时，两人工作的时间不同。设合作的时间为 $t$；先开始的一方工作了先做的时间**加上** $t$。然后像往常一样，各自的工作量加起来是全部工作。

安娜（单独 $6$ 小时）先做 $2$ 小时，然后本（单独 $3$ 小时）加入。若之后两人合作 $t$ 小时，安娜一共做了 $2 + t$ 小时，本做了 $t$ 小时：

$$\\frac{2 + t}{6} + \\frac{t}{3} = 1.$$

两边乘以 $6$：$2 + t + 2t = 6$，所以 $3t = 4$，$t = \\frac{4}{3}$ 小时。检验：安娜工作了 $\\frac{10}{3}$ 小时，完成 $\\frac{10}{18} = \\frac{5}{9}$；本完成 $\\frac{4}{9}$；合起来是 $1$。

> **注意。** 安娜先做的时间要算上：她的工作量是 $\\frac{2 + t}{6}$，不是 $\\frac{t}{6}$。也不能只从合作时间里减去先做的时间：$2$ 小时后剩下的工作不到全部，由两人以合作的效率完成。题目问的是之后还需要的时间 $t$，不是安娜的总时间。`,
      ),
      generate(rng) {
        const w = rng.pick(workers);
        const a = rng.int(4, 12);
        const h = rng.int(1, a - 2);
        const b = rng.int(2, 12);
        const time = frac((a - h) * b, a + b);
        const partA = Q.of(h).add(time).div(Q.of(a));
        const partB = time.div(Q.of(b));
        return numberProblem({
          prompt: t(
            `${w.a.en} can ${w.task.en} alone in $${a}$ hours, and ${w.b.en} can do it alone in $${b}$ hours. ${w.a.en} works alone for $${h}$ hour${h === 1 ? "" : "s"}, then ${w.b.en} joins in. How many more hours does it take to finish?`,
            `${w.a["zh-CN"]}单独${w.task["zh-CN"]}需要 $${a}$ 小时，${w.b["zh-CN"]}单独完成需要 $${b}$ 小时。${w.a["zh-CN"]}先单独做 $${h}$ 小时，然后${w.b["zh-CN"]}加入。还需要多少小时才能完成？`,
          ),
          answer: time,
          wrong: [frac(a * b, a + b), frac(a * b, a + b).sub(Q.of(h)), a - h],
          solution: t(
            `**Step 1: the two working times.** Let $t$ be the hours they work together. ${w.a.en} also worked the first $${h}$ hour${h === 1 ? "" : "s"}, so $${h} + t$ hours in all; ${w.b.en} works $t$ hours.

**Step 2: the parts make the whole job.** Each part is the working time divided by the time alone:${steps(`\\frac{${h} + t}{${a}} + \\frac{t}{${b}} = 1`)}**Step 3: clear the fractions and solve.** Multiply both sides by $${a} \\cdot ${b} = ${a * b}$, multiply out, subtract $${b * h}$, and divide by $${a + b}$:${steps(`${b}(${h} + t) + ${a}t = ${a * b}`, `${b * h} + ${a + b}t = ${a * b}`, `${a + b}t = ${(a - h) * b}`, `t = ${time.toLatex()}`)}**Check.** ${w.a.en} works $${Q.of(h).add(time).toLatex()}$ hours and does $${partA.toLatex()}$ of the job; ${w.b.en} does $${partB.toLatex()}$. Together: $${partA.toLatex()} + ${partB.toLatex()} = 1$.`,
            `**第一步：两人各自的工作时间。** 设两人合作 $t$ 小时。${w.a["zh-CN"]}还先做了 $${h}$ 小时，一共 $${h} + t$ 小时；${w.b["zh-CN"]}做了 $t$ 小时。

**第二步：各自的工作量合起来是全部工作。** 每人的工作量等于工作时间除以单独完成的时间：${steps(`\\frac{${h} + t}{${a}} + \\frac{t}{${b}} = 1`)}**第三步：去分母并求解。** 两边同时乘以 $${a} \\cdot ${b} = ${a * b}$，去括号，减去 $${b * h}$，再除以 $${a + b}$：${steps(`${b}(${h} + t) + ${a}t = ${a * b}`, `${b * h} + ${a + b}t = ${a * b}`, `${a + b}t = ${(a - h) * b}`, `t = ${time.toLatex()}`)}**检验。** ${w.a["zh-CN"]}工作了 $${Q.of(h).add(time).toLatex()}$ 小时，完成 $${partA.toLatex()}$；${w.b["zh-CN"]}完成 $${partB.toLatex()}$。合计：$${partA.toLatex()} + ${partB.toLatex()} = 1$。`,
          ),
        });
      },
    },
  ],
};

const solutions = [
  { en: "acid solution", zh: "酸溶液", pure: t("pure acid", "纯酸") },
  { en: "alcohol solution", zh: "酒精溶液", pure: t("pure alcohol", "纯酒精") },
  { en: "bleach solution", zh: "漂白剂溶液", pure: t("pure bleach", "纯漂白剂") },
  { en: "antifreeze solution", zh: "防冻液", pure: t("pure antifreeze", "纯防冻剂") },
] as const;

/** mixTwo are [p, q, r, V, x]: x liters at p% added to V liters at q% give r%. */
const mixTwo: readonly (readonly [number, number, number, number, number])[] = (() => {
  const out: [number, number, number, number, number][] = [];
  for (let p = 5; p <= 60; p += 5) {
    for (let q = p + 10; q <= 90; q += 5) {
      for (let r = p + 5; r < q; r += 5) {
        for (let v = 10; v <= 60; v += 10) {
          const x = (v * (q - r)) / (r - p);
          if (Number.isInteger(x) && x <= 120 && x !== v) out.push([p, q, r, v, x]);
        }
      }
    }
  }
  return out;
})();

/** mixTotal are [p, q, r, T, x]: x liters at p% and T − x liters at q% make T liters at r%. */
const mixTotal: readonly (readonly [number, number, number, number, number])[] = (() => {
  const out: [number, number, number, number, number][] = [];
  for (let p = 5; p <= 60; p += 5) {
    for (let q = p + 10; q <= 90; q += 5) {
      for (let r = p + 5; r < q; r += 5) {
        for (let total = 10; total <= 100; total += 10) {
          const x = (total * (q - r)) / (q - p);
          if (Number.isInteger(x) && 2 * x !== total) out.push([p, q, r, total, x]);
        }
      }
    }
  }
  return out;
})();

/** dilutions are [p, r, V, x]: x liters of water added to V liters at p% give r%. */
const dilutions: readonly (readonly [number, number, number, number])[] = (() => {
  const out: [number, number, number, number][] = [];
  for (let p = 10; p <= 60; p += 5) {
    for (let r = 5; r < p; r += 5) {
      for (let v = 10; v <= 60; v += 5) {
        const x = (v * (p - r)) / r;
        if (Number.isInteger(x) && x <= 150) out.push([p, r, v, x]);
      }
    }
  }
  return out;
})();

/** concentrations are [p, r, V, x]: x liters of pure substance added to V liters at p% give r%. */
const concentrations: readonly (readonly [number, number, number, number])[] = (() => {
  const out: [number, number, number, number][] = [];
  for (let p = 5; p <= 50; p += 5) {
    for (let r = p + 5; r <= 80; r += 5) {
      for (let v = 10; v <= 60; v += 5) {
        const x = (v * (r - p)) / (100 - r);
        if (Number.isInteger(x) && x <= 60) out.push([p, r, v, x]);
      }
    }
  }
  return out;
})();

/** liters writes p% of v liters as a decimal number of liters. */
const liters = (p: number, v: number) => dec(frac(p * v, 100));

export const mixtureProblems: TopicDef = {
  id: "mixture-problems",
  title: t("Modeling Mixture Problems", "混合问题建模"),
  summary: t(
    "Solve problems about mixing solutions of different concentrations and mixing items of different values.",
    "解决不同浓度溶液混合以及不同单价物品混合的问题。",
  ),
  prerequisites: ["modeling-with-linear-equations", "percent-of-a-number"],
  encompasses: [
    { topic: "equations-with-parentheses", weight: 0.5 },
    { topic: "percent-of-a-number", weight: 0.4 },
    { topic: "modeling-with-linear-equations", weight: 0.4 },
  ],
  xp: 18,
  standards: ["CCSS.HSA.CED.A.1"],
  intro: t(
    `You can take a percent of a number: $40\\%$ of $20$ is $0.40 \\cdot 20 = 8$. A solution's concentration is such a percent. In $20$ liters of $40\\%$ acid solution, $40\\%$ of the liquid is acid, so it holds $8$ liters of pure acid.

When two solutions are poured together, the concentration does not simply add, but two things do: the volumes, and the amounts of pure acid. Pour $20$ liters of $40\\%$ acid into $20$ liters of $10\\%$ acid: the acid is $8 + 2 = 10$ liters in $40$ liters, which is $25\\%$.

That gives an equation whenever one amount is unknown: the pure substance in the parts equals the pure substance in the mixture. In this topic we use it to mix two solutions, to add water or pure substance, and, with money instead of acid, to mix items of different prices.`,
    `你会求一个数的百分之几：$20$ 的 $40\\%$ 是 $0.40 \\cdot 20 = 8$。溶液的浓度就是这样的百分数。$20$ 升浓度为 $40\\%$ 的酸溶液中，$40\\%$ 是酸，所以含有 $8$ 升纯酸。

两种溶液倒在一起时，浓度并不是简单相加，但有两样东西相加：体积，以及纯酸的量。把 $20$ 升 $40\\%$ 的酸溶液倒进 $20$ 升 $10\\%$ 的酸溶液：$40$ 升中有 $8 + 2 = 10$ 升酸，浓度是 $25\\%$。

只要有一个量未知，这就给出一个方程：各部分中纯物质的量之和等于混合物中纯物质的量。这个课题中，我们用它来混合两种溶液、加水或加纯物质，并把酸换成钱，解决不同单价物品的混合问题。`,
  ),
  knowledgePoints: [
    {
      id: "mixing-two-solutions",
      title: t("Mixing two solutions", "两种溶液混合"),
      explanation: t(
        `Track the **amount of the pure substance**: in $V$ liters of a $p\\%$ solution there are $\\frac{p}{100}V$ liters of it. Mixing does not create or destroy any, so the amounts in the parts add up to the amount in the mixture, and the volumes add up too.

Adding $x$ liters of $10\\%$ acid to $20$ liters of $40\\%$ acid makes $x + 20$ liters at $25\\%$:

$$0.10x + 0.40 \\cdot 20 = 0.25(x + 20).$$

Multiply both sides by $100$ so that the percents become whole numbers: $10x + 800 = 25x + 500$. Subtract $10x$ and $500$: $300 = 15x$, so $x = 20$. Check: $2 + 8 = 10$ liters of acid in $40$ liters, and $25\\%$ of $40$ is $10$.

> **Watch out.** Concentrations do not average unless the volumes are equal, and they never simply add. The mixture's volume is $x + 20$, not $20$: the target percent applies to everything in the container. When the total is given, the second part is the total **minus** $x$, and answer for the solution the question asks about.`,
        `追踪**纯物质的量**：$V$ 升浓度为 $p\\%$ 的溶液中含有 $\\frac{p}{100}V$ 升纯物质。混合既不会产生也不会减少纯物质，所以各部分中纯物质的量之和等于混合物中的量，体积也相加。

把 $x$ 升 $10\\%$ 的酸溶液加入 $20$ 升 $40\\%$ 的酸溶液，得到 $x + 20$ 升 $25\\%$ 的酸溶液：

$$0.10x + 0.40 \\cdot 20 = 0.25(x + 20).$$

两边同时乘以 $100$，让百分数变成整数：$10x + 800 = 25x + 500$。两边减去 $10x$ 和 $500$：$300 = 15x$，所以 $x = 20$。检验：$40$ 升中有 $2 + 8 = 10$ 升酸，而 $40$ 的 $25\\%$ 是 $10$。

> **注意。** 除非体积相等，浓度不能取平均数，更不能直接相加。混合后的体积是 $x + 20$，不是 $20$：目标浓度针对容器里的全部溶液。已知总量时，第二部分是总量**减去** $x$；还要回答题目问的那种溶液。`,
      ),
      keyPrerequisites: ["percent-of-a-number"],
      generate(rng) {
        const s = rng.pick(solutions);
        if (rng.bool()) {
          const [p, q, r, v, x] = rng.pick(mixTwo);
          return numberProblem({
            prompt: t(
              `How many liters of ${article(p)} $${p}\\%$ ${s.en} must be added to $${v}$ liters of ${article(q)} $${q}\\%$ ${s.en} to make ${article(r)} $${r}\\%$ ${s.en}?`,
              `需要在 $${v}$ 升浓度为 $${q}\\%$ 的${s.zh}中加入多少升浓度为 $${p}\\%$ 的${s.zh}，才能得到浓度为 $${r}\\%$ 的${s.zh}？`,
            ),
            answer: x,
            wrong: [frac(v * (r - p), q - r), v, frac(v * (q - r), q - p)],
            solution: t(
              `**Step 1: the pure substance in each part.** Let $x$ be the liters added. They hold $${p}\\%$ of $x$, the $${v}$ liters hold $${q}\\%$ of $${v}$, and the mixture is $x + ${v}$ liters at $${r}\\%$. The pure substance before and after mixing is the same; multiplying both sides by $100$ keeps the percents whole:${steps(`${p}x + ${q} \\cdot ${v} = ${r}(x + ${v})`)}**Step 2: solve.** Multiply out, subtract $${p}x$ and $${r * v}$ from both sides, and divide by $${r - p}$:${steps(`${p}x + ${q * v} = ${r}x + ${r * v}`, `${q * v - r * v} = ${r - p}x`, `x = ${x}`)}**Check.** The parts hold $${liters(p, x)} + ${liters(q, v)} = ${liters(r, x + v)}$ liters of ${s.pure.en}, and $${r}\\%$ of the $${x + v}$ liters is $${liters(r, x + v)}$ liters.`,
              `**第一步：各部分中的纯物质。** 设加入 $x$ 升。它含有 $x$ 的 $${p}\\%$，原来的 $${v}$ 升含有 $${v}$ 的 $${q}\\%$，混合后是 $x + ${v}$ 升、浓度 $${r}\\%$。混合前后纯物质的量相同；两边同时乘以 $100$，让百分数保持为整数：${steps(`${p}x + ${q} \\cdot ${v} = ${r}(x + ${v})`)}**第二步：解方程。** 去括号，两边同时减去 $${p}x$ 和 $${r * v}$，再除以 $${r - p}$：${steps(`${p}x + ${q * v} = ${r}x + ${r * v}`, `${q * v - r * v} = ${r - p}x`, `x = ${x}`)}**检验。** 两部分共含${s.pure["zh-CN"]} $${liters(p, x)} + ${liters(q, v)} = ${liters(r, x + v)}$ 升，而 $${x + v}$ 升的 $${r}\\%$ 正是 $${liters(r, x + v)}$ 升。`,
            ),
          });
        }
        const [p, q, r, total, x] = rng.pick(mixTotal);
        return numberProblem({
          prompt: t(
            `A chemist mixes ${article(p)} $${p}\\%$ ${s.en} with ${article(q)} $${q}\\%$ ${s.en} to make $${total}$ liters of ${article(r)} $${r}\\%$ ${s.en}. How many liters of the $${p}\\%$ ${s.en} does she use?`,
            `一位化学家把浓度为 $${p}\\%$ 和 $${q}\\%$ 的${s.zh}混合，配成 $${total}$ 升浓度为 $${r}\\%$ 的${s.zh}。她用了多少升浓度为 $${p}\\%$ 的${s.zh}？`,
          ),
          answer: x,
          wrong: [total - x, frac(total, 2), frac(total * (r - p), q - r)],
          solution: t(
            `**Step 1: one variable for both parts.** Let $x$ be the liters at $${p}\\%$. The two parts make $${total}$ liters, so the rest, $${total} - x$ liters, is at $${q}\\%$.

**Step 2: the pure substance.** The parts hold $${p}\\%$ of $x$ and $${q}\\%$ of $${total} - x$; the mixture holds $${r}\\%$ of $${total}$. Multiply both sides by $100$ to keep the percents whole:${steps(`${p}x + ${q}(${total} - x) = ${r} \\cdot ${total}`)}**Step 3: solve.** Multiply out, then move the terms with $x$ to the right and the numbers to the left, and divide by $${q - p}$:${steps(`${p}x + ${q * total} - ${q}x = ${r * total}`, `${q * total - r * total} = ${q - p}x`, `x = ${x}`)}**Check.** $${x}$ liters at $${p}\\%$ and $${total - x}$ liters at $${q}\\%$ hold $${liters(p, x)} + ${liters(q, total - x)} = ${liters(r, total)}$ liters, which is $${r}\\%$ of $${total}$.`,
            `**第一步：用一个变量表示两部分。** 设浓度为 $${p}\\%$ 的用了 $x$ 升。两部分合起来是 $${total}$ 升，所以其余 $${total} - x$ 升浓度为 $${q}\\%$。

**第二步：纯物质的量。** 两部分分别含有 $x$ 的 $${p}\\%$ 和 $${total} - x$ 的 $${q}\\%$；混合物含有 $${total}$ 的 $${r}\\%$。两边同时乘以 $100$，让百分数保持为整数：${steps(`${p}x + ${q}(${total} - x) = ${r} \\cdot ${total}`)}**第三步：解方程。** 去括号，把含 $x$ 的项移到右边、数移到左边，再除以 $${q - p}$：${steps(`${p}x + ${q * total} - ${q}x = ${r * total}`, `${q * total - r * total} = ${q - p}x`, `x = ${x}`)}**检验。** $${x}$ 升 $${p}\\%$ 和 $${total - x}$ 升 $${q}\\%$ 的溶液共含 $${liters(p, x)} + ${liters(q, total - x)} = ${liters(r, total)}$ 升纯物质，正是 $${total}$ 的 $${r}\\%$。`,
          ),
        });
      },
    },
    {
      id: "adding-water-or-pure-substance",
      title: t("Adding water or pure substance", "加水或加纯物质"),
      explanation: t(
        `Water is a $0\\%$ solution and a pure substance is a $100\\%$ solution, so these are mixtures too. Adding water changes the volume but not the amount of substance; adding pure substance adds the same number of liters to both.

Add $x$ liters of water to $30$ liters of $20\\%$ salt solution to dilute it to $12\\%$. The salt stays the same, $20\\%$ of $30$, and is now $12\\%$ of $30 + x$ liters:

$$0.20 \\cdot 30 = 0.12(30 + x) \\;\\Rightarrow\\; 600 = 360 + 12x \\;\\Rightarrow\\; 240 = 12x \\;\\Rightarrow\\; x = 20.$$

Check: $6$ liters of salt in $50$ liters is $12\\%$.

> **Watch out.** The new percent applies to the new volume, $30 + x$, not to the water added alone. Pure substance is $100\\%$, so it adds $x$ liters of substance, not $0$; water adds $0$. Do not just subtract the percents and take that share of the volume: the answer comes from the equation.`,
        `水是浓度为 $0\\%$ 的溶液，纯物质是浓度为 $100\\%$ 的溶液，所以它们也是混合。加水改变体积但不改变纯物质的量；加纯物质则让两者增加同样的升数。

在 $30$ 升浓度为 $20\\%$ 的盐水中加入 $x$ 升水，稀释为 $12\\%$。盐的量不变，是 $30$ 的 $20\\%$，而现在它是 $30 + x$ 升的 $12\\%$：

$$0.20 \\cdot 30 = 0.12(30 + x) \\;\\Rightarrow\\; 600 = 360 + 12x \\;\\Rightarrow\\; 240 = 12x \\;\\Rightarrow\\; x = 20.$$

检验：$50$ 升中有 $6$ 升盐，浓度是 $12\\%$。

> **注意。** 新的浓度针对新的体积 $30 + x$，不是只针对加入的水。纯物质的浓度是 $100\\%$，所以它带来 $x$ 升纯物质，而不是 $0$；水带来 $0$。也不要把两个百分数相减再乘以体积：答案要由方程求出。`,
      ),
      generate(rng) {
        const s = rng.pick(solutions);
        if (rng.bool()) {
          const [p, r, v, x] = rng.pick(dilutions);
          return numberProblem({
            prompt: t(
              `How many liters of water must be added to $${v}$ liters of ${article(p)} $${p}\\%$ ${s.en} to dilute it to $${r}\\%$?`,
              `需要在 $${v}$ 升浓度为 $${p}\\%$ 的${s.zh}中加入多少升水，才能把浓度稀释为 $${r}\\%$？`,
            ),
            answer: x,
            wrong: [frac(v * p, r), frac(v * (p - r), 100), frac(v * (p - r), p)],
            solution: t(
              `**Step 1: what stays the same.** Let $x$ be the liters of water. Water holds no ${s.pure.en}, so the amount stays $${p}\\%$ of $${v}$; after adding the water it is $${r}\\%$ of $${v} + x$ liters. Multiply both sides by $100$:${steps(`${p} \\cdot ${v} = ${r}(${v} + x)`)}**Step 2: solve.** Multiply out, subtract $${r * v}$ from both sides, and divide by $${r}$:${steps(`${p * v} = ${r * v} + ${r}x`, `${p * v - r * v} = ${r}x`, `x = ${x}`)}**Check.** The ${s.pure.en} is $${liters(p, v)}$ liters, and $${r}\\%$ of $${v + x}$ liters is $${liters(r, v + x)}$ liters: the same.`,
              `**第一步：不变的量。** 设加入 $x$ 升水。水里没有${s.pure["zh-CN"]}，所以它的量仍是 $${v}$ 的 $${p}\\%$；加水后它是 $${v} + x$ 升的 $${r}\\%$。两边同时乘以 $100$：${steps(`${p} \\cdot ${v} = ${r}(${v} + x)`)}**第二步：解方程。** 去括号，两边同时减去 $${r * v}$，再除以 $${r}$：${steps(`${p * v} = ${r * v} + ${r}x`, `${p * v - r * v} = ${r}x`, `x = ${x}`)}**检验。** ${s.pure["zh-CN"]}有 $${liters(p, v)}$ 升，而 $${v + x}$ 升的 $${r}\\%$ 是 $${liters(r, v + x)}$ 升：相同。`,
            ),
          });
        }
        const [p, r, v, x] = rng.pick(concentrations);
        return numberProblem({
          prompt: t(
            `How many liters of ${s.pure.en} must be added to $${v}$ liters of ${article(p)} $${p}\\%$ ${s.en} to raise the concentration to $${r}\\%$?`,
            `需要在 $${v}$ 升浓度为 $${p}\\%$ 的${s.zh}中加入多少升${s.pure["zh-CN"]}，才能把浓度提高到 $${r}\\%$？`,
          ),
          answer: x,
          wrong: [frac(v * (r - p), 100), frac(v * (r - p), 100 - p), frac(v * (r - p), r)],
          solution: t(
            `**Step 1: the pure substance.** Let $x$ be the liters of ${s.pure.en}. It is $100\\%$ substance, so it adds $x$ liters to the $${p}\\%$ of $${v}$ already there, and the mixture is $${r}\\%$ of $${v} + x$ liters. Multiply both sides by $100$:${steps(`${p} \\cdot ${v} + 100x = ${r}(${v} + x)`)}**Step 2: solve.** Multiply out, subtract $${r}x$ and $${p * v}$ from both sides, and divide by $${100 - r}$:${steps(`${p * v} + 100x = ${r * v} + ${r}x`, `${100 - r}x = ${r * v - p * v}`, `x = ${x}`)}**Check.** The mixture holds $${liters(p, v)} + ${x} = ${liters(r, v + x)}$ liters of ${s.pure.en}, and $${r}\\%$ of $${v + x}$ liters is $${liters(r, v + x)}$.`,
            `**第一步：纯物质的量。** 设加入 $x$ 升${s.pure["zh-CN"]}。它的浓度是 $100\\%$，所以在原有的 $${v}$ 的 $${p}\\%$ 之外又加了 $x$ 升，混合后是 $${v} + x$ 升的 $${r}\\%$。两边同时乘以 $100$：${steps(`${p} \\cdot ${v} + 100x = ${r}(${v} + x)`)}**第二步：解方程。** 去括号，两边同时减去 $${r}x$ 和 $${p * v}$，再除以 $${100 - r}$：${steps(`${p * v} + 100x = ${r * v} + ${r}x`, `${100 - r}x = ${r * v - p * v}`, `x = ${x}`)}**检验。** 混合后含${s.pure["zh-CN"]} $${liters(p, v)} + ${x} = ${liters(r, v + x)}$ 升，而 $${v + x}$ 升的 $${r}\\%$ 是 $${liters(r, v + x)}$ 升。`,
          ),
        });
      },
    },
    {
      id: "value-mixtures",
      title: t("Mixtures of values", "不同单价的混合"),
      explanation: t(
        `The same idea works with money: the value of each part is its number times its price, and the values of the parts add up to the total value. When the total number is known, one variable describes both parts, as in splitting a total.

$200$ tickets were sold, adult tickets at $\\$12$ and child tickets at $\\$5$, for $\\$1814$. With $a$ adult tickets there are $200 - a$ child tickets:

$$12a + 5(200 - a) = 1814 \\;\\Rightarrow\\; 7a + 1000 = 1814 \\;\\Rightarrow\\; 7a = 814 \\;\\Rightarrow\\; a = 116.$$

The $7$ is the price difference: each adult ticket instead of a child ticket adds $\\$7$. Check: $116 \\cdot 12 + 84 \\cdot 5 = 1392 + 420 = 1814$.

> **Watch out.** Multiply $5$ by the whole $200 - a$, including the $-a$. Do not divide the total value by one price, or by the sum of the prices: each part has its own price. Use one unit throughout (cents for coins), and answer the part asked for.`,
        `同样的想法也适用于钱：每部分的价值是数量乘以单价，各部分的价值之和等于总价值。已知总数量时，像分配总量一样，用一个变量表示两部分。

售出 $200$ 张票，成人票每张 $12$ 元，儿童票每张 $5$ 元，共收入 $1814$ 元。设成人票 $a$ 张，儿童票就是 $200 - a$ 张：

$$12a + 5(200 - a) = 1814 \\;\\Rightarrow\\; 7a + 1000 = 1814 \\;\\Rightarrow\\; 7a = 814 \\;\\Rightarrow\\; a = 116.$$

$7$ 是单价之差：每把一张儿童票换成成人票，就多收 $7$ 元。检验：$116 \\cdot 12 + 84 \\cdot 5 = 1392 + 420 = 1814$。

> **注意。** $5$ 要乘以整个 $200 - a$，包括 $-a$。不要用总价值除以其中一个单价或单价之和：每部分有自己的单价。全程使用同一个单位（硬币用美分），并回答题目问的那部分。`,
      ),
      keyPrerequisites: ["equations-with-parentheses"],
      generate(rng) {
        if (rng.bool()) {
          const adult = rng.int(8, 20);
          const child = rng.int(3, adult - 2);
          const total = 10 * rng.int(5, 30);
          const a = rng.int(10, total - 10);
          const revenue = adult * a + child * (total - a);
          return numberProblem({
            prompt: t(
              `A theater sold $${total}$ tickets: adult tickets at $\\$${adult}$ and child tickets at $\\$${child}$. The tickets brought in $\\$${revenue}$. How many adult tickets were sold?`,
              `一家剧院卖出 $${total}$ 张票，成人票每张 $${adult}$ 元，儿童票每张 $${child}$ 元，共收入 $${revenue}$ 元。卖出了多少张成人票？`,
            ),
            answer: a,
            wrong: [total - a, frac(revenue, adult), frac(revenue - child * total, adult + child)],
            solution: t(
              `**Step 1: one variable for both kinds.** Let $a$ be the number of adult tickets. There are $${total}$ tickets in all, so $${total} - a$ are child tickets.

**Step 2: the values add up.** Each kind brings in its number times its price:${steps(`${adult}a + ${child}(${total} - a) = ${revenue}`)}**Step 3: solve.** Multiply out, collect the terms with $a$, subtract $${child * total}$, and divide by $${adult - child}$, the difference of the prices:${steps(`${adult - child}a + ${child * total} = ${revenue}`, `${adult - child}a = ${revenue - child * total}`, `a = ${a}`)}**Check.** $${a}$ adult and $${total - a}$ child tickets bring in $${adult} \\cdot ${a} + ${child} \\cdot ${total - a} = ${adult * a} + ${child * (total - a)} = ${revenue}$ dollars.`,
              `**第一步：用一个变量表示两种票。** 设成人票 $a$ 张。共 $${total}$ 张票，所以儿童票是 $${total} - a$ 张。

**第二步：价值相加。** 每种票的收入等于张数乘以单价：${steps(`${adult}a + ${child}(${total} - a) = ${revenue}`)}**第三步：解方程。** 去括号，合并含 $a$ 的项，减去 $${child * total}$，再除以单价之差 $${adult - child}$：${steps(`${adult - child}a + ${child * total} = ${revenue}`, `${adult - child}a = ${revenue - child * total}`, `a = ${a}`)}**检验。** $${a}$ 张成人票和 $${total - a}$ 张儿童票收入 $${adult} \\cdot ${a} + ${child} \\cdot ${total - a} = ${adult * a} + ${child * (total - a)} = ${revenue}$ 元。`,
            ),
          });
        }
        const n = rng.int(10, 40);
        const q = rng.int(1, n - 1);
        const cents = 25 * q + 10 * (n - q);
        const value = frac(cents, 100);
        return numberProblem({
          prompt: t(
            `A jar holds $${n}$ coins, all dimes ($10$¢) and quarters ($25$¢), worth $\\$${dec(value)}$ in all. How many quarters are there?`,
            `一个罐子里有 $${n}$ 枚硬币，都是 $10$ 美分和 $25$ 美分的，共值 $${dec(value)}$ 美元。$25$ 美分的硬币有多少枚？`,
          ),
          answer: q,
          wrong: [n - q, frac(cents, 25), frac(cents - 10 * n, 35)],
          solution: t(
            `**Step 1: one unit and one variable.** Work in cents, so every number is whole: $\\$${dec(value)}$ is $${cents}$ cents. Let $q$ be the number of quarters; the other $${n} - q$ coins are dimes.

**Step 2: the values add up.** Quarters are worth $25$ cents each and dimes $10$:${steps(`25q + 10(${n} - q) = ${cents}`)}**Step 3: solve.** Multiply out, collect the terms with $q$, subtract $${10 * n}$, and divide by $15$:${steps(`15q + ${10 * n} = ${cents}`, `15q = ${cents - 10 * n}`, `q = ${q}`)}**Check.** $${q}$ quarters and $${n - q}$ dimes are $${25 * q} + ${10 * (n - q)} = ${cents}$ cents, which is $\\$${dec(value)}$.`,
            `**第一步：统一单位，设一个变量。** 以美分为单位，所有数都是整数：$${dec(value)}$ 美元是 $${cents}$ 美分。设 $25$ 美分的硬币有 $q$ 枚，其余 $${n} - q$ 枚是 $10$ 美分的。

**第二步：价值相加。** 每枚 $25$ 美分的硬币值 $25$ 美分，每枚 $10$ 美分的值 $10$ 美分：${steps(`25q + 10(${n} - q) = ${cents}`)}**第三步：解方程。** 去括号，合并含 $q$ 的项，减去 $${10 * n}$，再除以 $15$：${steps(`15q + ${10 * n} = ${cents}`, `15q = ${cents - 10 * n}`, `q = ${q}`)}**检验。** $${q}$ 枚 $25$ 美分和 $${n - q}$ 枚 $10$ 美分共 $${25 * q} + ${10 * (n - q)} = ${cents}$ 美分，即 $${dec(value)}$ 美元。`,
          ),
        });
      },
    },
  ],
};

/** linearEquationTopics are the topics on linear equations with letters and on modeling with linear equations, in teaching order. */
export const linearEquationTopics: readonly TopicDef[] = [
  linearEquationsWithUnknownCoefficients,
  unknownCoefficientsByFactoring,
  linearInequalitiesWithParameters,
  manyVariableEquations,
  rearrangingFormulas,
  interpretingLinearExpressions,
  modelingWithLinearEquations,
  consecutiveIntegerProblems,
  speedDistanceTime,
  furtherSpeedDistanceTime,
  workProblems,
  mixtureProblems,
];
