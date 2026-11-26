import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { poly, Q } from "@ga/subject-math";
import { choiceProblem, lowestTerms, numberProblem, steps, why, yesNo } from "../problems.ts";
import { reasoned } from "../wrong-reasons.ts";
import { walked } from "./calculus-i-differentiation.ts";

/** par wraps a negative number in parentheses for use as a factor. */
const par = (n: number): string => (n < 0 ? `(${n})` : String(n));

/** signed writes a number as a following term: "+ 3" or "- 3". */
const signed = (n: number): string => (n < 0 ? `- ${-n}` : `+ ${n}`);

/** parQ wraps a negative rational number in parentheses for use as a factor. */
const parQ = (q: Q): string => (q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex());

/** Mistake is a wrong value with what to say about it. */
type Mistake = { readonly value: number | Q; readonly why: Text };

/** apart drops the mistakes whose value is the answer or repeats an earlier one. */
const apart = (answer: number | Q, mistakes: readonly Mistake[]): Mistake[] => {
  const key = (v: number | Q) => (typeof v === "number" ? Q.of(v) : v).toLatex();
  return mistakes.filter((m, i, all) => key(m.value) !== key(answer) && all.findIndex((x) => key(x.value) === key(m.value)) === i);
};

/** pw writes a power of x, leaving out an exponent of 1 and writing x^0 as 1. */
const pw = (k: number): string => (k === 0 ? "1" : k === 1 ? "x" : `x^{${k}}`);

/** ex writes e to a multiple of x, leaving out a coefficient of 1. */
const ex = (r: number): string => (r === 1 ? "e^{x}" : r === -1 ? "e^{-x}" : `e^{${r}x}`);

/** cf writes a whole-number coefficient in front of a letter, leaving out 1 and writing -1 as a minus sign. */
const cf = (n: number): string => (n === 1 ? "" : n === -1 ? "-" : `${n}`);

/** over writes a quotient, leaving out a denominator of 1. */
const over = (num: string | number, den: number): string => (den === 1 ? `${num}` : `\\frac{${num}}{${den}}`);

// ---------------------------------------------------------------------------
// 3.8 Theory of Solutions to Linear ODEs
// ---------------------------------------------------------------------------

/** differentialOperators introduces polynomial operators P(D). */
export const differentialOperators: TopicDef = {
  id: "differential-operators",
  title: t("Differential Operators", "微分算子"),
  summary: t(
    "A differential operator writes differentiation as an algebraic symbol $D = \\frac{d}{dx}$; a polynomial operator satisfies $P(D)e^{rx} = P(r)e^{rx}$.",
    "微分算子把求导记为代数符号 $D = \\frac{d}{dx}$；多项式微分算子满足 $P(D)e^{rx} = P(r)e^{rx}$。",
  ),
  intro: t(
    "Apply $D^{2} + 3D + 2$ to $e^{2x}$, where $D = \\frac{d}{dx}$. Each $D$ brings down a factor $2$: $De^{2x} = 2e^{2x}$ and $D^{2}e^{2x} = 4e^{2x}$. So $(D^{2} + 3D + 2)e^{2x} = (4 + 6 + 2)e^{2x} = 12e^{2x}$, which is $P(2)e^{2x}$ for $P(r) = r^{2} + 3r + 2$.\n\nCheck: with $y = e^{2x}$, $y'' + 3y' + 2y = 4e^{2x} + 6e^{2x} + 2e^{2x} = 12e^{2x}$.\n\nIn this lesson we apply polynomial differential operators to exponentials, where they act as multiplication by $P(r)$, and to powers, where each term gives a different power of $x$.",
    "把 $D^{2} + 3D + 2$ 作用于 $e^{2x}$，其中 $D = \\frac{d}{dx}$。每个 $D$ 带下一个因子 $2$：$De^{2x} = 2e^{2x}$，$D^{2}e^{2x} = 4e^{2x}$。所以 $(D^{2} + 3D + 2)e^{2x} = (4 + 6 + 2)e^{2x} = 12e^{2x}$，这就是 $P(r) = r^{2} + 3r + 2$ 时的 $P(2)e^{2x}$。\n\n检验：令 $y = e^{2x}$，则 $y'' + 3y' + 2y = 4e^{2x} + 6e^{2x} + 2e^{2x} = 12e^{2x}$。\n\n本课我们把多项式微分算子作用于指数函数（此时它相当于乘以 $P(r)$），也作用于幂函数（此时各项给出不同次数的 $x$）。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "action-of-differential-operators",
      title: t("Action of polynomial differential operators on exponentials", "多项式微分算子作用于指数函数"),
      explanation: t(
        "A differential operator applied to an exponential simply multiplies it by the polynomial evaluated at the rate, which is why exponentials are natural trial solutions. For a differential operator $P(D) = D^2 + b D + c$, applying it to $y = e^{rx}$ yields $P(D)e^{rx} = P(r)e^{rx} = (r^2 + br + c)e^{rx}$. For $(D^{2} + 3D + 2)e^{2x}$ this is $(4 + 6 + 2)e^{2x} = 12e^{2x}$.\n\n> **Watch out.** $D^{2}$ brings down the rate twice, giving $r^{2}$, not $2r$; and $bD$ gives $br$, not just $b$.",
        "微分算子作用于指数函数时，只是把它乘以多项式在增长率处的值，所以指数函数是自然的试探解。对于二次微分算子 $P(D) = D^2 + b D + c$，作用于指数函数 $y = e^{rx}$ 得到 $P(D)e^{rx} = P(r)e^{rx} = (r^2 + br + c)e^{rx}$。对 $(D^{2} + 3D + 2)e^{2x}$，结果是 $(4 + 6 + 2)e^{2x} = 12e^{2x}$。\n\n> **注意。** $D^{2}$ 把增长率带下两次，得到 $r^{2}$，而不是 $2r$；$bD$ 给出 $br$，而不只是 $b$。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.int(1, 8);
        const c = rng.int(1, 15);
        const r = rng.int(2, 6);
        const ans = r * r + b * r + c;
        const op = poly([1, "D^2"], [b, "D"], [c, ""]);
        return numberProblem({
          prompt: t(
            `Let $D = \\frac{d}{dx}$ denote the differential operator. Evaluate the constant $\\lambda$ such that $(${op})(e^{${r}x}) = \\lambda e^{${r}x}$.`,
            `记 $D = \\frac{d}{dx}$ 为微分算子。求常数 $\\lambda$，使得 $(${op})(e^{${r}x}) = \\lambda e^{${r}x}$ 成立。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(r * r + c, `That leaves out the term $${poly([b, "D"])}$.`, `这里漏掉了 $${poly([b, "D"])}$ 这一项。`),
            why(
              r * r + b + c,
              `That takes $${poly([b, "D"])}e^{${r}x}$ as $${b}e^{${r}x}$; each $D$ brings down the rate $${r}$.`,
              `这是把 $${poly([b, "D"])}e^{${r}x}$ 当成 $${b}e^{${r}x}$；每个 $D$ 都会带下增长率 $${r}$。`,
            ),
            why(
              2 * r + b * r + c,
              `That takes $D^{2}e^{${r}x}$ as $${2 * r}e^{${r}x}$; differentiating twice gives $${r}^{2} = ${r * r}$.`,
              `这是把 $D^{2}e^{${r}x}$ 当成 $${2 * r}e^{${r}x}$；求两次导得到 $${r}^{2} = ${r * r}$。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Differentiate the exponential", "对指数函数求导"],
                t("Each $D$ multiplies by the rate:", "每个 $D$ 都乘上增长率："),
                [`De^{${r}x} = ${r}e^{${r}x}`, `D^{2}e^{${r}x} = ${r * r}e^{${r}x}`],
              ],
              [
                ["Combine the terms", "合并各项"],
                t("", ""),
                [`(${op})e^{${r}x} = (${r * r} + ${b} \\cdot ${r} + ${c})e^{${r}x} = ${ans}e^{${r}x}`, `\\lambda = ${ans}`],
              ],
            ],
            t(
              `$P(r) = ${poly([1, "r^2"], [b, "r"], [c, ""])}$ at $r = ${r}$ is $${r * r} + ${b * r} + ${c} = ${ans}$, the same value.`,
              `$P(r) = ${poly([1, "r^2"], [b, "r"], [c, ""])}$ 在 $r = ${r}$ 处为 $${r * r} + ${b * r} + ${c} = ${ans}$，结果相同。`,
            ),
          ),
        });
      },
    },
    {
      id: "applying-an-operator-to-a-power",
      title: t("Applying an operator to a power", "把算子作用于幂函数"),
      explanation: t(
        "A polynomial operator $P(D) = D^2 + aD + b$ acts term by term: differentiate twice, differentiate once and multiply by $a$, multiply by $b$, then add. On a power,\n\n$$(D^2 + aD + b)\\,x^n = n(n - 1)x^{n - 2} + anx^{n - 1} + bx^n.$$\n\nUnlike $e^{rx}$, a power does not come back as a multiple of itself, so each term has a different power of $x$ until you substitute a value. For $(D^{2} + D - 2)x^{3} = 6x + 3x^{2} - 2x^{3}$, the value at $x = 1$ is $7$.\n\n> **Watch out.** Do not use the shortcut for exponentials here: $P(n)x^{n}$ is wrong, because $Dx^{n} = nx^{n - 1}$ lowers the power instead of keeping it.",
        "多项式算子 $P(D) = D^2 + aD + b$ 逐项作用：求两次导，求一次导再乘 $a$，乘 $b$，然后相加。作用在幂函数上，\n\n$$(D^2 + aD + b)\\,x^n = n(n - 1)x^{n - 2} + anx^{n - 1} + bx^n.$$\n\n与 $e^{rx}$ 不同，幂函数不会变回自身的倍数，所以在代入数值之前，各项含有不同次数的 $x$。对 $(D^{2} + D - 2)x^{3} = 6x + 3x^{2} - 2x^{3}$，在 $x = 1$ 处的值是 $7$。\n\n> **注意。** 这里不能用指数函数的捷径：$P(n)x^{n}$ 是错的，因为 $Dx^{n} = nx^{n - 1}$ 会降低次数，而不是保持次数。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-6, 6) || 2;
        const b = rng.int(-9, 9) || -3;
        const n = rng.int(2, 5);
        const x0 = rng.pick([1, -1, 2]);
        const d2 = n * (n - 1) * x0 ** (n - 2);
        const d1 = n * x0 ** (n - 1);
        const d0 = x0 ** n;
        const ans = d2 + a * d1 + b * d0;
        const op = poly([1, "D^2"], [a, "D"], [b, ""]);
        const low = (k: number) => (k === 0 ? "" : pw(k));
        const expanded = poly([n * (n - 1), low(n - 2)], [a * n, low(n - 1)], [b, `x^{${n}}`]);
        return numberProblem({
          prompt: t(
            `Let $D = \\frac{d}{dx}$. Find the value of $(${op})\\,x^{${n}}$ at $x = ${x0}$.`,
            `设 $D = \\frac{d}{dx}$。求 $(${op})\\,x^{${n}}$ 在 $x = ${x0}$ 处的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              (n * n + a * n + b) * d0,
              `That uses the exponential shortcut $P(${n})x^{${n}}$; differentiating a power lowers its exponent.`,
              `这是用了指数函数的捷径 $P(${n})x^{${n}}$；对幂函数求导会降低次数。`,
            ),
            why(a * d1 + b * d0, "That leaves out the term from $D^{2}$.", "这里漏掉了 $D^{2}$ 那一项。"),
            why(d2 + d1 + b * d0, `That forgets to multiply the first derivative by $${a}$.`, `这里忘了把一阶导数乘以 $${a}$。`),
          ]),
          solution: walked(
            [
              [["Apply the operator term by term", "逐项作用"], t("", ""), [`(${op})\\,x^{${n}} = ${expanded}`]],
              [["Evaluate", "求值"], t(`At $x = ${x0}$ this is $${ans}$.`, `在 $x = ${x0}$ 处值为 $${ans}$。`)],
            ],
            t(
              `At $x = ${x0}$: $(x^{${n}})'' = ${d2}$, $(x^{${n}})' = ${d1}$ and $x^{${n}} = ${d0}$, so the value is $${d2} + ${par(a)} \\cdot ${par(d1)} + ${par(b)} \\cdot ${par(d0)} = ${ans}$.`,
              `在 $x = ${x0}$ 处：$(x^{${n}})'' = ${d2}$，$(x^{${n}})' = ${d1}$，$x^{${n}} = ${d0}$，所以值为 $${d2} + ${par(a)} \\cdot ${par(d1)} + ${par(b)} \\cdot ${par(d0)} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** linearDifferentialOperators explores linearity and factoring of constant coefficient operators. */
export const linearDifferentialOperators: TopicDef = {
  id: "linear-differential-operators",
  title: t("Linear Differential Operators", "线性微分算子"),
  summary: t(
    "Constant-coefficient linear operators commute and factor: $(D - r_1)(D - r_2) = D^2 - (r_1 + r_2)D + r_1 r_2$.",
    "常系数线性微分算子可交换、可因式分解：$(D - r_1)(D - r_2) = D^2 - (r_1 + r_2)D + r_1 r_2$。",
  ),
  intro: t(
    "Expand $(D - 2)(D - 3)$. Constant-coefficient operators multiply like polynomials, so it is $D^{2} - 5D + 6$. Applied to $e^{2x}$ it gives $(4 - 10 + 6)e^{2x} = 0$: the factor $D - 2$ removes $e^{2x}$.\n\nCheck: apply the factors one at a time. $(D - 3)e^{2x} = 2e^{2x} - 3e^{2x} = -e^{2x}$, and $(D - 2)(-e^{2x}) = -2e^{2x} + 2e^{2x} = 0$.\n\nIn this lesson we multiply and factor constant-coefficient operators, decide whether an operator is linear, and find operators that remove a given function.",
    "展开 $(D - 2)(D - 3)$。常系数算子像多项式一样相乘，所以它是 $D^{2} - 5D + 6$。作用于 $e^{2x}$ 得 $(4 - 10 + 6)e^{2x} = 0$：因子 $D - 2$ 消去了 $e^{2x}$。\n\n检验：逐个作用因子。$(D - 3)e^{2x} = 2e^{2x} - 3e^{2x} = -e^{2x}$，$(D - 2)(-e^{2x}) = -2e^{2x} + 2e^{2x} = 0$。\n\n本课我们对常系数算子作乘法和因式分解，判断算子是否线性，并求出能消去给定函数的算子。",
  ),
  prerequisites: ["differential-operators"],
  encompasses: [{ topic: "differential-operators", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "linearity-and-composition-of-operators",
      title: t("Factoring constant-coefficient differential operators", "常系数微分算子的因式分解"),
      explanation: t(
        "Constant coefficient operators multiply like polynomials, so they can be factored and applied in any order. Factoring the operator $(D - r_1)(D - r_2)$ gives $D^2 - (r_1 + r_2)D + r_1 r_2$. The constant term is $r_1 r_2$. For $(D - 2)(D - 5)$ this is $D^{2} - 7D + 10$.\n\n> **Watch out.** The constant term is the product $(-r_{1})(-r_{2}) = r_{1}r_{2}$, which is positive; the sum $r_{1} + r_{2}$ belongs to the term in $D$.",
        "常系数算子像多项式一样相乘，所以可以因式分解，并按任意顺序作用。展开微分算子乘积 $(D - r_1)(D - r_2)$ 可得 $D^2 - (r_1 + r_2)D + r_1 r_2$，其常数项为两根乘积 $r_1 r_2$。对 $(D - 2)(D - 5)$，结果是 $D^{2} - 7D + 10$。\n\n> **注意。** 常数项是乘积 $(-r_{1})(-r_{2}) = r_{1}r_{2}$，为正数；和 $r_{1} + r_{2}$ 属于 $D$ 那一项。",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.int(2, 12);
        const r2 = rng.int(r1 + 1, r1 + 10);
        const ans = r1 * r2;
        const b = r1 + r2;
        return numberProblem({
          prompt: t(
            `Expand the composition of linear differential operators $(D - ${r1})(D - ${r2})$ into standard form $D^2 - b D + c$. Find the constant coefficient $c$.`,
            `将线性微分算子的复合运算 $(D - ${r1})(D - ${r2})$ 展开为标准形式 $D^2 - b D + c$。求常数项系数 $c$ 的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              b,
              `That is $b = ${r1} + ${r2}$, the coefficient of $D$; $c$ is the product.`,
              `这是 $D$ 的系数 $b = ${r1} + ${r2}$；$c$ 是乘积。`,
            ),
            why(-ans, "The sign is flipped; the product of two negative numbers is positive.", "符号反了；两个负数的乘积是正数。"),
            why(-b, "That is the coefficient of $D$ with its sign; $c$ is the constant term.", "这是带符号的 $D$ 的系数；$c$ 是常数项。"),
          ]),
          solution: walked(
            [
              [
                ["Multiply like polynomials", "像多项式一样相乘"],
                t("The coefficients are constants, so the operators multiply term by term:", "系数是常数，所以算子可以逐项相乘："),
                [`(D - ${r1})(D - ${r2}) = D^{2} - ${r2}D - ${r1}D + ${r1} \\cdot ${r2}`, `= D^{2} - ${b}D + ${ans}`],
              ],
              [["Read off the constant", "读出常数项"], t(`So $b = ${b}$ and $c = ${ans}$.`, `所以 $b = ${b}$，$c = ${ans}$。`)],
            ],
            t(
              `$(D - ${r1})$ removes $e^{${r1}x}$, so $D^{2} - ${b}D + ${ans}$ must too: $${r1 * r1} - ${b} \\cdot ${r1} + ${ans} = 0$.`,
              `$(D - ${r1})$ 消去 $e^{${r1}x}$，所以 $D^{2} - ${b}D + ${ans}$ 也必须如此：$${r1 * r1} - ${b} \\cdot ${r1} + ${ans} = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "recognizing-a-linear-operator",
      title: t("Recognizing a linear operator", "判断算子是否线性"),
      explanation: t(
        "An operator $L$ is linear when $L[c_1y_1 + c_2y_2] = c_1L[y_1] + c_2L[y_2]$ for all functions and constants. Coefficients may depend on $x$, as in $x^2y'' + e^xy$, but the unknown $y$ and its derivatives must appear only to the first power and never inside another function. A product such as $yy'$, a power such as $y^2$, a function such as $\\sin y$, or an added constant breaks linearity; an added constant fails because $L[0] \\ne 0$. For example $L[y] = y'' + y^{2}$ gives $L[2y] = 2y'' + 4y^{2} \\ne 2L[y]$.\n\n> **Watch out.** Look at how $y$ appears, not at the coefficients: $\\sin(x)\\,y'$ is linear, while $\\sin y$ is not.",
        "若对所有函数和常数都有 $L[c_1y_1 + c_2y_2] = c_1L[y_1] + c_2L[y_2]$，则算子 $L$ 是线性的。系数可以依赖于 $x$，例如 $x^2y'' + e^xy$，但未知函数 $y$ 及其导数只能以一次方出现，且不能出现在其他函数里面。乘积 $yy'$、幂 $y^2$、函数 $\\sin y$ 或附加常数都会破坏线性；附加常数之所以不行，是因为 $L[0] \\ne 0$。例如 $L[y] = y'' + y^{2}$ 给出 $L[2y] = 2y'' + 4y^{2} \\ne 2L[y]$。\n\n> **注意。** 要看 $y$ 是怎样出现的，而不是看系数：$\\sin(x)\\,y'$ 是线性的，而 $\\sin y$ 不是。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 9);
        const forms: readonly (readonly [string, boolean, string, string])[] = [
          [`y'' + ${c}xy`, true, `$L[2y] = 2y'' + ${2 * c}xy = 2L[y]$`, `$L[2y] = 2y'' + ${2 * c}xy = 2L[y]$`],
          [`x^2y'' + ${c}e^xy`, true, `$L[2y] = 2x^{2}y'' + ${2 * c}e^{x}y = 2L[y]$`, `$L[2y] = 2x^{2}y'' + ${2 * c}e^{x}y = 2L[y]$`],
          [
            `y'' + ${c}\\sin(x)\\,y'`,
            true,
            `$L[2y] = 2y'' + ${2 * c}\\sin(x)\\,y' = 2L[y]$`,
            `$L[2y] = 2y'' + ${2 * c}\\sin(x)\\,y' = 2L[y]$`,
          ],
          [`${c}y''' - x^${c}y`, true, `$L[2y] = ${2 * c}y''' - 2x^{${c}}y = 2L[y]$`, `$L[2y] = ${2 * c}y''' - 2x^{${c}}y = 2L[y]$`],
          [`y'' + ${c}\\ln(x)\\,y`, true, `$L[2y] = 2y'' + ${2 * c}\\ln(x)\\,y = 2L[y]$`, `$L[2y] = 2y'' + ${2 * c}\\ln(x)\\,y = 2L[y]$`],
          [
            `y'' + ${c}y^2`,
            false,
            `$L[2y] = 2y'' + ${4 * c}y^{2}$, while $2L[y] = 2y'' + ${2 * c}y^{2}$`,
            `$L[2y] = 2y'' + ${4 * c}y^{2}$，而 $2L[y] = 2y'' + ${2 * c}y^{2}$`,
          ],
          [
            `y'' + ${c}yy'`,
            false,
            `$L[2y] = 2y'' + ${4 * c}yy'$, while $2L[y] = 2y'' + ${2 * c}yy'$`,
            `$L[2y] = 2y'' + ${4 * c}yy'$，而 $2L[y] = 2y'' + ${2 * c}yy'$`,
          ],
          [
            `y'' + ${c}\\sin y`,
            false,
            `$L[2y] = 2y'' + ${c}\\sin 2y$, while $2L[y] = 2y'' + ${2 * c}\\sin y$`,
            `$L[2y] = 2y'' + ${c}\\sin 2y$，而 $2L[y] = 2y'' + ${2 * c}\\sin y$`,
          ],
          [`y' + ${c}`, false, `$L[0] = ${c}$, but a linear operator sends $0$ to $0$`, `$L[0] = ${c}$，而线性算子把 $0$ 映到 $0$`],
          [
            `(y')^2 + ${c}y`,
            false,
            `$L[2y] = 4(y')^{2} + ${2 * c}y$, while $2L[y] = 2(y')^{2} + ${2 * c}y$`,
            `$L[2y] = 4(y')^{2} + ${2 * c}y$，而 $2L[y] = 2(y')^{2} + ${2 * c}y$`,
          ],
        ];
        const [form, lin, testEn, testZh] = rng.pick(forms);
        const problem = choiceProblem({
          prompt: t(`Is the operator $L[y] = ${form}$ linear?`, `算子 $L[y] = ${form}$ 是线性的吗？`),
          options: yesNo,
          correct: lin ? 0 : 1,
          solution: walked(
            [
              [
                ["Look at how y appears", "看 y 的出现方式"],
                lin
                  ? t(
                      "Every term is $y$ or one of its derivatives, to the first power, multiplied by a function of $x$ alone.",
                      "每一项都是 $y$ 或它的某个导数的一次方，乘以只含 $x$ 的函数。",
                    )
                  : t(
                      "One term is not of the form (function of $x$) times $y$ or a derivative of $y$.",
                      "有一项不是“$x$ 的函数乘以 $y$ 或 $y$ 的导数”的形式。",
                    ),
              ],
              [
                ["Decide", "判断"],
                lin ? t("So $L$ is linear.", "所以 $L$ 是线性的。") : t("So $L$ is not linear.", "所以 $L$ 不是线性的。"),
              ],
            ],
            t(`Scaling $y$ by $2$: ${testEn}.`, `把 $y$ 换成 $2y$：${testZh}。`),
          ),
        });
        return reasoned(
          problem,
          lin
            ? [
                [
                  "No",
                  "Coefficients that depend on $x$ are allowed; check whether $y$ itself ever appears squared, multiplied by itself or inside a function.",
                  "系数可以依赖于 $x$；检查 $y$ 本身是否出现平方、自乘或出现在函数里面。",
                ],
              ]
            : [
                [
                  "Yes",
                  "Test the rule with $L[2y]$ and $2L[y]$; for this operator they differ.",
                  "用 $L[2y]$ 与 $2L[y]$ 检验这条规则；对这个算子它们不相等。",
                ],
              ],
        );
      },
    },
  ],
};

/** introductionToSecondOrderLinearOdes sets up the initial acceleration in second-order ODEs. */
export const introductionToSecondOrderLinearOdes: TopicDef = {
  id: "introduction-to-second-order-linear-odes",
  title: t("Introduction to Second-Order Linear ODEs", "二阶线性微分方程简介"),
  summary: t(
    "A second-order linear ODE $y'' + P(x)y' + Q(x)y = g(x)$ determines $y''(x_0)$ from the initial values $y(x_0)$ and $y'(x_0)$.",
    "二阶线性常微分方程 $y'' + P(x)y' + Q(x)y = g(x)$ 由初值 $y(x_0)$ 和 $y'(x_0)$ 确定 $y''(x_0)$。",
  ),
  intro: t(
    "Take $y'' + 3y' + 2y = 0$ with $y(0) = 1$ and $y'(0) = 2$. The equation gives $y'' = -3y' - 2y$, so $y''(0) = -3 \\cdot 2 - 2 \\cdot 1 = -8$, without solving anything.\n\nCheck: the solution is $y = 4e^{-x} - 3e^{-2x}$, with $y(0) = 1$, $y'(0) = -4 + 6 = 2$ and $y''(0) = 4 - 12 = -8$.\n\nIn this lesson we read second-order linear equations, use them to get the initial second derivative, and find the interval on which a solution is guaranteed to exist.",
    "考虑 $y'' + 3y' + 2y = 0$，$y(0) = 1$，$y'(0) = 2$。方程给出 $y'' = -3y' - 2y$，所以 $y''(0) = -3 \\cdot 2 - 2 \\cdot 1 = -8$，不必求解。\n\n检验：解为 $y = 4e^{-x} - 3e^{-2x}$，$y(0) = 1$，$y'(0) = -4 + 6 = 2$，$y''(0) = 4 - 12 = -8$。\n\n本课我们认识二阶线性方程，用它求初始二阶导数，并求出保证解存在的区间。",
  ),
  prerequisites: ["linear-differential-operators"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "standard-form-of-second-order-linear-odes",
      title: t("Initial acceleration in second-order homogeneous ODEs", "二阶齐次微分方程的初始二阶导数值"),
      explanation: t(
        "The equation itself gives the second derivative in terms of the function and its first derivative, so substituting the initial conditions gives the initial acceleration. From $y'' + p y' + q y = 0$, evaluating at $x = 0$ gives $y''(0) = -p y'(0) - q y(0)$. For $y'' + 2y' + 3y = 0$ with $y(0) = 1$ and $y'(0) = 4$, $y''(0) = -8 - 3 = -11$.\n\n> **Watch out.** Moving $py'$ and $qy$ across changes both signs, and $p$ goes with $y'(0)$ while $q$ goes with $y(0)$.",
        "方程本身用函数及其一阶导数表示了二阶导数，所以代入初始条件就得到初始加速度。由方程 $y'' + p y' + q y = 0$ 在 $x = 0$ 处求值，可得初始二阶导数为 $y''(0) = -p y'(0) - q y(0)$。对 $y'' + 2y' + 3y = 0$，$y(0) = 1$，$y'(0) = 4$，得 $y''(0) = -8 - 3 = -11$。\n\n> **注意。** 把 $py'$ 和 $qy$ 移项时两项都要变号，并且 $p$ 与 $y'(0)$ 相乘，$q$ 与 $y(0)$ 相乘。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(1, 6);
        const q = rng.int(1, 6);
        const y0 = rng.int(1, 5);
        const y1 = rng.int(1, 5);
        const ans = -p * y1 - q * y0;
        const eq = poly([1, "y''"], [p, "y'"], [q, "y"]);
        return numberProblem({
          prompt: t(
            `Consider the second-order homogeneous differential equation $${eq} = 0$ subject to initial conditions $y(0) = ${y0}$ and $y'(0) = ${y1}$. Find the initial second derivative $y''(0)$.`,
            `考虑二阶齐次微分方程 $${eq} = 0$，初始条件为 $y(0) = ${y0}$ 和 $y'(0) = ${y1}$。求初始二阶导数值 $y''(0)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              -ans,
              "The sign is flipped; moving the other terms across the equals sign makes them negative.",
              "符号反了；把其他项移到等号另一边后它们变为负。",
            ),
            why(
              -p * y0 - q * y1,
              `That pairs the coefficients with the wrong values; $${p}$ multiplies $y'(0)$ and $${q}$ multiplies $y(0)$.`,
              `这是把系数和值配错了；$${p}$ 乘 $y'(0)$，$${q}$ 乘 $y(0)$。`,
            ),
            why(
              -p * y1 + q * y0,
              `Only one term changed sign; $${poly([q, "y"])}$ moves across too.`,
              `只有一项变了号；$${poly([q, "y"])}$ 也要移项。`,
            ),
          ]),
          solution: walked(
            [
              [["Solve for the second derivative", "解出二阶导数"], t("", ""), [`y'' = ${poly([-p, "y'"], [-q, "y"])}`]],
              [["Substitute the initial values", "代入初值"], t("", ""), [`y''(0) = -${p} \\cdot ${y1} - ${q} \\cdot ${y0} = ${ans}`]],
            ],
            t(
              `Putting the values back into the equation: $${ans} + ${p} \\cdot ${y1} + ${q} \\cdot ${y0} = ${ans} + ${p * y1 + q * y0} = 0$.`,
              `把这些值代回方程：$${ans} + ${p} \\cdot ${y1} + ${q} \\cdot ${y0} = ${ans} + ${p * y1 + q * y0} = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-interval-of-guaranteed-existence",
      title: t("The interval of guaranteed existence", "保证解存在的区间"),
      explanation: t(
        "Divide $a_2(x)y'' + a_1(x)y' + a_0(x)y = g(x)$ by $a_2(x)$ to reach the standard form $y'' + p(x)y' + q(x)y = f(x)$. If $p$, $q$ and $f$ are continuous on an open interval containing $x_0$, the initial value problem with $y(x_0)$ and $y'(x_0)$ has a unique solution on that whole interval. So the interval runs from $x_0$ out to the nearest zeros of $a_2$ on either side. For $(x + 1)(x - 4)y'' + y = 0$ with conditions at $x_0 = 1$, the interval is $(-1, 4)$, of length $5$.\n\n> **Watch out.** The interval stops at a zero of $a_2$ on each side of $x_0$, so its length is the distance between those two zeros, not the distance from $x_0$ to one of them.",
        "把 $a_2(x)y'' + a_1(x)y' + a_0(x)y = g(x)$ 除以 $a_2(x)$，化为标准形式 $y'' + p(x)y' + q(x)y = f(x)$。若 $p$、$q$、$f$ 在包含 $x_0$ 的开区间上连续，则给定 $y(x_0)$ 与 $y'(x_0)$ 的初值问题在整个区间上有唯一解。所以区间从 $x_0$ 向两侧延伸到 $a_2$ 最近的零点。对 $(x + 1)(x - 4)y'' + y = 0$，条件给在 $x_0 = 1$，区间是 $(-1, 4)$，长度为 $5$。\n\n> **注意。** 区间在 $x_0$ 两侧各停在 $a_2$ 的一个零点处，所以长度是这两个零点之间的距离，而不是 $x_0$ 到其中一个零点的距离。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-8, 2);
        const b = a + rng.int(2, 9);
        const x0 = rng.int(a + 1, b - 1);
        const pad = (r: number) => (r < 0 ? `x + ${-r}` : r === 0 ? "x" : `x - ${r}`);
        const lead = a === 0 ? `x(${pad(b)})` : b === 0 ? `x(${pad(a)})` : `(${pad(a)})(${pad(b)})`;
        const ans = b - a;
        return numberProblem({
          prompt: t(
            `Find the length of the largest open interval on which $${lead}y'' + xy' + y = 0$ with $y(${x0}) = 1$, $y'(${x0}) = 0$ is guaranteed a unique solution.`,
            `对 $${lead}y'' + xy' + y = 0$，$y(${x0}) = 1$，$y'(${x0}) = 0$，求保证唯一解存在的最大开区间的长度。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              x0 - a,
              `That measures only from $${a}$ to $x_0 = ${x0}$; the interval continues to $${b}$.`,
              `这只量了从 $${a}$ 到 $x_0 = ${x0}$；区间还延伸到 $${b}$。`,
            ),
            why(
              b - x0,
              `That measures only from $x_0 = ${x0}$ to $${b}$; the interval continues to $${a}$.`,
              `这只量了从 $x_0 = ${x0}$ 到 $${b}$；区间还延伸到 $${a}$。`,
            ),
            ...(a < 0 && b > 0
              ? [
                  why(
                    b,
                    `That measures from $0$ to $${b}$; the interval is bounded by the zeros $${a}$ and $${b}$.`,
                    `这是从 $0$ 量到 $${b}$；区间的端点是零点 $${a}$ 和 $${b}$。`,
                  ),
                ]
              : []),
          ]),
          solution: walked(
            [
              [
                ["Write the standard form", "写出标准形式"],
                t(`Divide by the leading coefficient $${lead}$:`, `除以首项系数 $${lead}$：`),
                [`y'' + \\frac{x}{${lead}}y' + \\frac{1}{${lead}}y = 0`],
              ],
              [
                ["Find where the coefficients break down", "找出系数失效的点"],
                t(
                  `The coefficients are continuous except where $${lead} = 0$, at $x = ${a}$ and $x = ${b}$. The interval containing $x_0 = ${x0}$ is $(${a}, ${b})$, of length $${ans}$.`,
                  `系数除了在 $${lead} = 0$ 处（即 $x = ${a}$ 和 $x = ${b}$）外都连续。包含 $x_0 = ${x0}$ 的区间是 $(${a}, ${b})$，长度为 $${ans}$。`,
                ),
              ],
            ],
            t(
              `$${a} < ${x0} < ${b}$, so $x_0$ lies inside $(${a}, ${b})$, and the length is $${b} - ${par(a)} = ${ans}$.`,
              `$${a} < ${x0} < ${b}$，所以 $x_0$ 在 $(${a}, ${b})$ 内，长度为 $${b} - ${par(a)} = ${ans}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** theSuperpositionPrinciple combines fundamental solutions to satisfy initial conditions. */
export const theSuperpositionPrinciple: TopicDef = {
  id: "the-superposition-principle",
  title: t("The Superposition Principle", "叠加原理"),
  summary: t(
    "If $y_1$ and $y_2$ solve the homogeneous linear ODE $L[y] = 0$, then every linear combination $c_1 y_1 + c_2 y_2$ is also a solution.",
    "若 $y_1$ 与 $y_2$ 是齐次线性微分方程 $L[y] = 0$ 的解，则任意线性组合 $c_1 y_1 + c_2 y_2$ 仍是解。",
  ),
  intro: t(
    "Both $\\cos x$ and $\\sin x$ solve $y'' + y = 0$. By superposition so does $y = 3\\cos x + 2\\sin x$, and it has $y(0) = 3$ and $y'(0) = 2$: the coefficients are exactly the initial value and the initial slope.\n\nCheck: $y'' = -3\\cos x - 2\\sin x = -y$, so $y'' + y = 0$.\n\nIn this lesson we combine solutions of linear equations to meet initial conditions, and combine responses to the pieces of a forcing.",
    "$\\cos x$ 与 $\\sin x$ 都是 $y'' + y = 0$ 的解。由叠加原理，$y = 3\\cos x + 2\\sin x$ 也是解，且 $y(0) = 3$，$y'(0) = 2$：系数恰好就是初值和初始斜率。\n\n检验：$y'' = -3\\cos x - 2\\sin x = -y$，所以 $y'' + y = 0$。\n\n本课我们组合线性方程的解以满足初始条件，并组合对强迫项各部分的响应。",
  ),
  prerequisites: ["introduction-to-second-order-linear-odes"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "linear-superposition-of-homogeneous-solutions",
      title: t("Superposition of normalized initial value solutions", "规范化初值解的线性叠加"),
      explanation: t(
        "Because the equation is linear, a combination of solutions is again a solution, and solutions with simple initial conditions combine to match any initial conditions. If $y_1$ satisfies $y_1(0) = 1, y_1'(0) = 0$ and $y_2$ satisfies $y_2(0) = 0, y_2'(0) = 1$, then the solution with $y(0) = A$ and $y'(0) = B$ is $y = A y_1 + B y_2$. For $y(0) = 4$ and $y'(0) = -1$ it is $4y_{1} - y_{2}$.\n\n> **Watch out.** $y_{1}$ carries the value and $y_{2}$ the slope, so $c_{1} = y(0)$ and $c_{2} = y'(0)$: they are not swapped, and nothing is multiplied together.",
        "由于方程是线性的，解的组合仍然是解，具有简单初始条件的解可以组合出任意初始条件。若 $y_1$ 满足 $y_1(0) = 1, y_1'(0) = 0$ 且 $y_2$ 满足 $y_2(0) = 0, y_2'(0) = 1$，则满足初值 $y(0) = A, y'(0) = B$ 的特解为 $y = A y_1 + B y_2$。对 $y(0) = 4$，$y'(0) = -1$，它是 $4y_{1} - y_{2}$。\n\n> **注意。** $y_{1}$ 负责函数值，$y_{2}$ 负责斜率，所以 $c_{1} = y(0)$，$c_{2} = y'(0)$：不要对调，也不要相乘。",
      ),
      generate(rng: Rng): Problem {
        const A = rng.int(2, 9);
        const B = rng.int(2, 9);
        const ans = A + B;
        return numberProblem({
          prompt: t(
            `Suppose $y_1(x)$ and $y_2(x)$ are two solutions to a linear homogeneous ODE $L[y] = 0$ satisfying $y_1(0) = 1, y_1'(0) = 0$ and $y_2(0) = 0, y_2'(0) = 1$. The solution satisfying $y(0) = ${A}$ and $y'(0) = ${B}$ is given by $y(x) = c_1 y_1(x) + c_2 y_2(x)$. Find the sum $c_1 + c_2$.`,
            `设 $y_1(x)$ 与 $y_2(x)$ 是齐次线性微分方程 $L[y] = 0$ 的两个解，且分别满足 $y_1(0) = 1, y_1'(0) = 0$ 和 $y_2(0) = 0, y_2'(0) = 1$。满足初始条件 $y(0) = ${A}$ 与 $y'(0) = ${B}$ 的解表示为 $y(x) = c_1 y_1(x) + c_2 y_2(x)$。求系数和 $c_1 + c_2$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(A * B, "That multiplies the two constants; the question asks for their sum.", "这是把两个常数相乘；题目要的是它们的和。"),
            why(A, "That is $c_{1}$ alone; add $c_{2}$ as well.", "这只是 $c_{1}$；还要加上 $c_{2}$。"),
            why(B, "That is $c_{2}$ alone; add $c_{1}$ as well.", "这只是 $c_{2}$；还要加上 $c_{1}$。"),
          ]),
          solution: walked(
            [
              [["Use the value at 0", "用 0 处的函数值"], t("", ""), [`y(0) = c_{1} \\cdot 1 + c_{2} \\cdot 0 = c_{1} = ${A}`]],
              [
                ["Use the slope at 0", "用 0 处的斜率"],
                t("", ""),
                [`y'(0) = c_{1} \\cdot 0 + c_{2} \\cdot 1 = c_{2} = ${B}`, `c_{1} + c_{2} = ${A} + ${B} = ${ans}`],
              ],
            ],
            t(
              `$y = ${A}y_{1} + ${B}y_{2}$ solves the equation by linearity, and has $y(0) = ${A}$ and $y'(0) = ${B}$, as required.`,
              `由线性，$y = ${A}y_{1} + ${B}y_{2}$ 是方程的解，且 $y(0) = ${A}$，$y'(0) = ${B}$，符合要求。`,
            ),
          ),
        });
      },
    },
    {
      id: "superposing-responses-to-separate-forcings",
      title: t("Superposing responses to separate forcings", "叠加对不同强迫项的响应"),
      explanation: t(
        "If $L$ is linear, $L[y_1] = g_1$ and $L[y_2] = g_2$, then\n\n$$L[\\alpha y_1 + \\beta y_2] = \\alpha g_1 + \\beta g_2.$$\n\nSo a forcing built from pieces is answered by the same combination of the responses to the pieces. The coefficients carry over exactly, including their signs, and every value of the combined solution is the same combination of the values of $y_1$ and $y_2$. For $L[y] = y'' + 2y$, $L[e^{x}] = 3e^{x}$ and $L[1] = 2$, so $L[y] = 6e^{x} + 4$ is solved by $y = 2e^{x} + 2$.\n\n> **Watch out.** To answer the forcing $\\alpha e^{rx}$ you divide $\\alpha$ by the factor that $L$ puts on $e^{rx}$; multiplying by that factor goes the wrong way.",
        "若 $L$ 线性，$L[y_1] = g_1$，$L[y_2] = g_2$，则\n\n$$L[\\alpha y_1 + \\beta y_2] = \\alpha g_1 + \\beta g_2.$$\n\n所以由若干部分组成的强迫项，其响应就是各部分响应的同样组合。系数连同符号原样保留，组合解的每个值都是 $y_1$ 与 $y_2$ 相应值的同样组合。对 $L[y] = y'' + 2y$，$L[e^{x}] = 3e^{x}$，$L[1] = 2$，所以 $L[y] = 6e^{x} + 4$ 的解是 $y = 2e^{x} + 2$。\n\n> **注意。** 要响应强迫项 $\\alpha e^{rx}$，就用 $L$ 作用在 $e^{rx}$ 上产生的因子去除 $\\alpha$；乘以这个因子就弄反了。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 9);
        const r = rng.int(1, 3);
        const al = rng.int(-5, 5) || 2;
        const be = rng.int(-5, 5) || -3;
        const k = r * r + c;
        const p = Q.of(al, k);
        const q = Q.of(be, c);
        const ans = p.add(q);
        const er = ex(r);
        const yp = poly([p, er], [q, ""]);
        return numberProblem({
          prompt: t(
            `For $L[y] = y'' + ${c}y$: $L[${er}] = ${k}${er}$ and $L[1] = ${c}$. Find the constant-plus-exponential solution $y_p$ of $L[y] = ${poly([al, er], [be, ""])}$ and give $y_p(0)$.`,
            `对 $L[y] = y'' + ${c}y$：$L[${er}] = ${k}${er}$，$L[1] = ${c}$。求 $L[y] = ${poly([al, er], [be, ""])}$ 的“常数加指数”形式的解 $y_p$，并给出 $y_p(0)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(al + be),
              "That uses the coefficients of the forcing as they are; each must be divided by the factor $L$ puts on its piece.",
              "这是直接用了强迫项的系数；每个系数都要除以 $L$ 作用在相应部分上产生的因子。",
            ),
            why(
              Q.of(al * k + be * c),
              "That multiplies by the factors; to undo $L$ you divide by them.",
              "这是乘以这些因子；要抵消 $L$ 的作用应当除以它们。",
            ),
            why(
              p.sub(q),
              "The sign of the constant part is flipped; the coefficients carry over with their signs.",
              "常数部分的符号反了；系数要连同符号一起保留。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Answer each piece", "分别响应各部分"],
                t(
                  `$L\\left[\\frac{${er}}{${k}}\\right] = ${er}$ and $L\\left[\\frac{1}{${c}}\\right] = 1$, so by superposition`,
                  `$L\\left[\\frac{${er}}{${k}}\\right] = ${er}$，$L\\left[\\frac{1}{${c}}\\right] = 1$，所以由叠加原理`,
                ),
                [`y_p = ${yp}`],
              ],
              [
                ["Evaluate at 0", "在 0 处求值"],
                t("", ""),
                [
                  `y_p(0) = ${p.toLatex()} ${q.sign() < 0 ? "-" : "+"} ${q.sign() < 0 ? q.neg().toLatex() : q.toLatex()} = ${ans.toLatex()}`,
                ],
              ],
            ],
            t(
              `$L[y_p] = ${parQ(p)} \\cdot ${k}${er} + ${parQ(q)} \\cdot ${c} = ${poly([al, er], [be, ""])}$, the given forcing.`,
              `$L[y_p] = ${parQ(p)} \\cdot ${k}${er} + ${parQ(q)} \\cdot ${c} = ${poly([al, er], [be, ""])}$，正是所给的强迫项。`,
            ),
          ),
        });
      },
    },
  ],
};

/** reductionOfOrder derives a second solution given one known solution. */
export const reductionOfOrder: TopicDef = {
  id: "reduction-of-order",
  title: t("Reduction of Order", "降阶法"),
  summary: t(
    "Given one solution $y_1$ of $y'' + P(x)y' + Q(x)y = 0$, setting $y_2 = u(x)y_1$ reduces the ODE to a first-order equation for $v = u'$.",
    "已知 $y'' + P(x)y' + Q(x)y = 0$ 的一个解 $y_1$，设 $y_2 = u(x)y_1$ 可将方程降为关于 $v = u'$ 的一阶方程。",
  ),
  intro: t(
    "$y_1 = e^{3x}$ solves $y'' - 6y' + 9y = 0$. Put $y = ue^{3x}$: then $y' = (u' + 3u)e^{3x}$ and $y'' = (u'' + 6u' + 9u)e^{3x}$, and substituting leaves $u''e^{3x} = 0$. So $u = c_1 + c_2x$, and the second solution is $y_2 = xe^{3x}$.\n\nCheck: for $y = xe^{3x}$, $y' = (1 + 3x)e^{3x}$ and $y'' = (6 + 9x)e^{3x}$, so $y'' - 6y' + 9y = (6 + 9x - 6 - 18x + 9x)e^{3x} = 0$.\n\nIn this lesson we use one known solution to find a second, independent one, and fit the resulting general solution to initial conditions.",
    "$y_1 = e^{3x}$ 是 $y'' - 6y' + 9y = 0$ 的解。设 $y = ue^{3x}$：则 $y' = (u' + 3u)e^{3x}$，$y'' = (u'' + 6u' + 9u)e^{3x}$，代入后只剩 $u''e^{3x} = 0$。所以 $u = c_1 + c_2x$，第二个解是 $y_2 = xe^{3x}$。\n\n检验：对 $y = xe^{3x}$，$y' = (1 + 3x)e^{3x}$，$y'' = (6 + 9x)e^{3x}$，所以 $y'' - 6y' + 9y = (6 + 9x - 6 - 18x + 9x)e^{3x} = 0$。\n\n本课我们用一个已知解求出第二个线性无关的解，并让所得通解满足初始条件。",
  ),
  prerequisites: ["the-superposition-principle"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "finding-a-second-solution-via-reduction-of-order",
      title: t("Finding a second solution via reduction of order", "利用降阶法求二阶齐次方程的第二个特解"),
      explanation: t(
        "Multiplying the known solution by an unknown function and substituting gives a simpler equation for that function, whose solution yields a second independent solution. For $y'' - 2a y' + a^2 y = 0$ with known solution $y_1 = e^{ax}$, the substitution $y = u e^{ax}$ yields $u'' = 0 \\implies u(x) = x$, giving the second independent solution $y_2 = x e^{ax}$. With $y = (c_1 + c_2x)e^{ax}$, the conditions give $c_1 = y(0)$ and $c_2 + ac_1 = y'(0)$; for $a = 2$, $y(0) = 1$, $y'(0) = 5$ this is $c_2 = 3$.\n\n> **Watch out.** $y'(0)$ is not $c_2$: the product rule also differentiates $e^{ax}$, which adds $ac_1$.",
        "把已知解乘以一个未知函数再代入，得到关于这个函数的更简单的方程，解出它就得到第二个线性无关的解。对于微分方程 $y'' - 2a y' + a^2 y = 0$，已知特解为 $y_1 = e^{ax}$。代换 $y = u e^{ax}$ 可降阶得 $u'' = 0 \\implies u(x) = x$，从而得到第二个线性无关解 $y_2 = x e^{ax}$。对 $y = (c_1 + c_2x)e^{ax}$，条件给出 $c_1 = y(0)$，$c_2 + ac_1 = y'(0)$；当 $a = 2$，$y(0) = 1$，$y'(0) = 5$ 时 $c_2 = 3$。\n\n> **注意。** $y'(0)$ 不等于 $c_2$：乘积法则还要对 $e^{ax}$ 求导，这会加上 $ac_1$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 9);
        const p = rng.nonZero(-5, 5);
        const ans = rng.nonZero(-6, 6);
        const q = ans + a * p;
        return numberProblem({
          prompt: t(
            `$y_1 = e^{${a}x}$ is a solution of $y'' - ${2 * a}y' + ${a * a}y = 0$. Use reduction of order with $y = u(x) e^{${a}x}$ to find the general solution $y = (c_1 + c_2 x)e^{${a}x}$, and find $c_2$ for the solution with $y(0) = ${p}$ and $y'(0) = ${q}$.`,
            `$y_1 = e^{${a}x}$ 是方程 $y'' - ${2 * a}y' + ${a * a}y = 0$ 的一个解。用降阶法设 $y = u(x) e^{${a}x}$，求出通解 $y = (c_1 + c_2 x)e^{${a}x}$，并对满足 $y(0) = ${p}$，$y'(0) = ${q}$ 的解求 $c_2$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              q,
              `That takes $y'(0)$ as $c_2$; the product rule adds $${a}c_1$.`,
              `这是把 $y'(0)$ 当成 $c_2$；乘积法则还会加上 $${a}c_1$。`,
            ),
            why(q + a * p, `That adds $${a}c_1$ instead of subtracting it.`, `这是加上 $${a}c_1$，而不是减去它。`),
            why(p, "That is $c_1 = y(0)$; the question asks for $c_2$.", "这是 $c_1 = y(0)$；题目要的是 $c_2$。"),
          ]),
          solution: walked(
            [
              [
                ["Reduce the order", "降阶"],
                t(
                  `Substitute $y = u e^{${a}x}$. The terms in $u'$ and $u$ cancel, which leaves $u'' = 0$, so $u = c_1 + c_2 x$.`,
                  `代入 $y = u e^{${a}x}$。含 $u'$ 与 $u$ 的项相互抵消，剩下 $u'' = 0$，所以 $u = c_1 + c_2 x$。`,
                ),
                [`y' = (u' + ${a}u) e^{${a}x}`, `y'' = (u'' + ${2 * a}u' + ${a * a}u) e^{${a}x}`],
              ],
              [
                ["Apply the conditions", "代入条件"],
                t("", ""),
                [`y(0) = c_1 = ${p}`, `y'(0) = c_2 + ${a}c_1 = ${q}`, `c_2 = ${q} - ${a} \\cdot ${par(p)} = ${ans}`],
              ],
            ],
            t(
              `With $c_1 = ${p}$ and $c_2 = ${ans}$: $y(0) = ${p}$ and $y'(0) = ${ans} + ${a} \\cdot ${par(p)} = ${q}$.`,
              `取 $c_1 = ${p}$，$c_2 = ${ans}$：$y(0) = ${p}$，$y'(0) = ${ans} + ${a} \\cdot ${par(p)} = ${q}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "reduction-of-order-for-a-cauchy-euler-equation",
      title: t("Reduction of order for a Cauchy-Euler equation", "柯西-欧拉方程的降阶法"),
      explanation: t(
        "Given one solution $y_1$ of $y'' + p(x)y' + q(x)y = 0$, substitute $y = uy_1$. The terms without derivatives of $u$ cancel, leaving a first-order equation for $u'$ with solution\n\n$$u' = \\frac{C}{y_1^2}\\,e^{-\\int p\\,dx}.$$\n\nFor $x^2y'' - bxy' + by = 0$ with $y_1 = x$, the standard form has $p = -\\frac{b}{x}$, so $e^{-\\int p\\,dx} = x^b$ and $u' = Cx^{b - 2}$. With $b = 4$ this is $u' = Cx^{2}$, so $u$ is a multiple of $x^{3}$ and $y_2 = x^{4}$.\n\n> **Watch out.** Divide by $y_1^{2} = x^{2}$, not by $y_1$; and mind the sign in $e^{-\\int p\\,dx}$, which turns $p = -\\frac{b}{x}$ into $x^{b}$.",
        "已知 $y'' + p(x)y' + q(x)y = 0$ 的一个解 $y_1$，代入 $y = uy_1$。不含 $u$ 的导数的项相互抵消，剩下关于 $u'$ 的一阶方程，其解为\n\n$$u' = \\frac{C}{y_1^2}\\,e^{-\\int p\\,dx}.$$\n\n对 $x^2y'' - bxy' + by = 0$ 与 $y_1 = x$，标准形式中 $p = -\\frac{b}{x}$，所以 $e^{-\\int p\\,dx} = x^b$，$u' = Cx^{b - 2}$。当 $b = 4$ 时 $u' = Cx^{2}$，所以 $u$ 是 $x^{3}$ 的倍数，$y_2 = x^{4}$。\n\n> **注意。** 要除以 $y_1^{2} = x^{2}$，而不是 $y_1$；还要注意 $e^{-\\int p\\,dx}$ 中的负号，它把 $p = -\\frac{b}{x}$ 变成 $x^{b}$。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.pick([-4, -3, -2, -1, 2, 3, 4, 5, 6, 7, 8]);
        const lead = rng.int(1, 3);
        const ans = b - 2;
        const pStr = b > 0 ? `-\\frac{${b}}{x}` : `\\frac{${-b}}{x}`;
        const cx = (k: number) => (k === 0 ? "C" : `C${pw(k)}`);
        const eq = poly([lead, "x^2y''"], [-b * lead, "xy'"], [b * lead, "y"]);
        return numberProblem({
          prompt: t(
            `$y_1 = x$ solves $${eq} = 0$ for $x > 0$. Substituting $y = ux$ gives $u' = Cx^k$. Find $k$.`,
            `$y_1 = x$ 是 $${eq} = 0$（$x > 0$）的解。代入 $y = ux$ 得 $u' = Cx^k$。求 $k$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(b, "That leaves out the division by $y_1^{2} = x^{2}$.", "这里漏掉了除以 $y_1^{2} = x^{2}$。"),
            why(
              b - 1,
              "That divides by $y_1 = x$ once; the formula divides by $y_1^{2}$.",
              "这是只除以一次 $y_1 = x$；公式要除以 $y_1^{2}$。",
            ),
            why(
              -b - 2,
              "The sign of the exponent is off; $e^{-\\int p\\,dx}$ carries a minus sign.",
              "指数的符号错了；$e^{-\\int p\\,dx}$ 里带有负号。",
            ),
            why(b + 2, "That multiplies by $x^{2}$ instead of dividing by it.", "这是乘以 $x^{2}$，而不是除以它。"),
          ]),
          solution: walked(
            [
              [
                ["Write the standard form", "化为标准形式"],
                t(`Divide by $${lead === 1 ? "" : lead}x^{2}$:`, `除以 $${lead === 1 ? "" : lead}x^{2}$：`),
                [
                  `y'' ${b > 0 ? "-" : "+"} \\frac{${Math.abs(b)}}{x}y' ${b > 0 ? "+" : "-"} \\frac{${Math.abs(b)}}{x^{2}}y = 0`,
                  `p(x) = ${pStr}`,
                ],
              ],
              [
                ["Apply the formula", "套用公式"],
                t("", ""),
                [`e^{-\\int p\\,dx} = x^{${b}}`, `u' = \\frac{C}{x^{2}} \\cdot x^{${b}} = ${cx(ans)}`, `k = ${ans}`],
              ],
            ],
            t(
              `Then $y_2 = ux$ is a multiple of $x^{${b}}$, and putting $y = x^{${b}}$ into the equation leaves $x^{${b}}$ times $${lead === 1 ? "" : `${lead}\\left(`}${b} \\cdot ${par(b - 1)} - ${par(b)} \\cdot ${par(b)} ${signed(b)}${lead === 1 ? "" : "\\right)"} = 0$.`,
              `于是 $y_2 = ux$ 是 $x^{${b}}$ 的倍数；把 $y = x^{${b}}$ 代入方程，剩下 $x^{${b}}$ 乘以 $${lead === 1 ? "" : `${lead}\\left(`}${b} \\cdot ${par(b - 1)} - ${par(b)} \\cdot ${par(b)} ${signed(b)}${lead === 1 ? "" : "\\right)"} = 0$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** linearIndependenceOfSolutionsToHomogeneousOdes uses the Wronskian determinant. */
export const linearIndependenceOfSolutionsToHomogeneousOdes: TopicDef = {
  id: "linear-independence-of-solutions-to-homogeneous-odes",
  title: t("Linear Independence of Solutions to Homogeneous ODEs", "齐次常微分方程解的线性相关性与无关性"),
  summary: t(
    "Solutions $y_1, y_2$ are linearly independent on an interval if and only if their Wronskian $W(y_1, y_2) = y_1 y_2' - y_1' y_2$ is non-zero.",
    "区间上的解 $y_1, y_2$ 线性无关当且仅当朗斯基行列式 $W(y_1, y_2) = y_1 y_2' - y_1' y_2$ 不为零。",
  ),
  intro: t(
    "Are $e^{x}$ and $e^{2x}$ independent? Their Wronskian is $W = e^{x} \\cdot 2e^{2x} - e^{x} \\cdot e^{2x} = e^{3x}$, which is never zero, so neither is a constant multiple of the other.\n\nCheck: at $x = 0$ the determinant of $\\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$ is $2 - 1 = 1 = e^{0}$.\n\nIn this lesson we compute Wronskians and use them to decide whether two solutions are linearly independent.",
    "$e^{x}$ 与 $e^{2x}$ 线性无关吗？它们的朗斯基行列式为 $W = e^{x} \\cdot 2e^{2x} - e^{x} \\cdot e^{2x} = e^{3x}$，它永不为零，所以两者都不是对方的常数倍。\n\n检验：在 $x = 0$ 处，$\\begin{pmatrix} 1 & 1 \\\\ 1 & 2 \\end{pmatrix}$ 的行列式为 $2 - 1 = 1 = e^{0}$。\n\n本课我们计算朗斯基行列式，并用它判断两个解是否线性无关。",
  ),
  prerequisites: ["the-superposition-principle"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "the-wronskian-determinant",
      title: t("The Wronskian determinant", "朗斯基行列式"),
      explanation: t(
        "The Wronskian is the determinant formed from two solutions and their derivatives, and it is nonzero exactly when the solutions are independent. For $y_1 = \\cos(\\omega x)$ and $y_2 = \\sin(\\omega x)$, the Wronskian is $W(y_1, y_2) = (\\cos \\omega x)(\\omega \\cos \\omega x) - (-\\omega \\sin \\omega x)(\\sin \\omega x) = \\omega(\\cos^2 \\omega x + \\sin^2 \\omega x) = \\omega$. For $\\cos 3x$ and $\\sin 3x$ it is $3$.\n\n> **Watch out.** The order matters: $W = y_1y_2' - y_1'y_2$, and swapping the two products flips the sign. The chain rule puts a factor $\\omega$ on each derivative.",
        "朗斯基行列式由两个解及其导数构成，当且仅当这两个解线性无关时它不为零。对于 $y_1 = \\cos(\\omega x)$ 和 $y_2 = \\sin(\\omega x)$，朗斯基行列式为 $W(y_1, y_2) = (\\cos \\omega x)(\\omega \\cos \\omega x) - (-\\omega \\sin \\omega x)(\\sin \\omega x) = \\omega(\\cos^2 \\omega x + \\sin^2 \\omega x) = \\omega$。对 $\\cos 3x$ 与 $\\sin 3x$，结果是 $3$。\n\n> **注意。** 顺序很重要：$W = y_1y_2' - y_1'y_2$，交换两个乘积会改变符号。链式法则使每个导数都带一个因子 $\\omega$。",
      ),
      generate(rng: Rng): Problem {
        const omega = rng.int(2, 40);
        const ans = omega;
        return numberProblem({
          prompt: t(
            `Calculate the value of the Wronskian $W(y_1, y_2)(x)$ for the functions $y_1(x) = \\cos(${omega}x)$ and $y_2(x) = \\sin(${omega}x)$.`,
            `计算函数 $y_1(x) = \\cos(${omega}x)$ 与 $y_2(x) = \\sin(${omega}x)$ 的朗斯基行列式 $W(y_1, y_2)(x)$ 的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              1,
              `That leaves out the chain-rule factor $${omega}$ in the derivatives.`,
              `这里漏掉了导数中由链式法则产生的因子 $${omega}$。`,
            ),
            why(-omega, "That computes $y_1'y_2 - y_1y_2'$; the order is reversed.", "这是计算了 $y_1'y_2 - y_1y_2'$；顺序反了。"),
            why(
              omega * omega,
              `The factor $${omega}$ appears once in each product, not twice.`,
              `每个乘积中因子 $${omega}$ 只出现一次，而不是两次。`,
            ),
          ]),
          solution: walked(
            [
              [["Differentiate", "求导"], t("", ""), [`y_1' = -${omega}\\sin(${omega}x)`, `y_2' = ${omega}\\cos(${omega}x)`]],
              [
                ["Form the determinant", "写出行列式"],
                t("", ""),
                [
                  `W = \\cos(${omega}x) \\cdot ${omega}\\cos(${omega}x) - \\left(-${omega}\\sin(${omega}x)\\right)\\sin(${omega}x)`,
                  `= ${omega}\\left(\\cos^{2}(${omega}x) + \\sin^{2}(${omega}x)\\right) = ${ans}`,
                ],
              ],
            ],
            t(
              `At $x = 0$: $y_1 = 1$, $y_2 = 0$, $y_1' = 0$ and $y_2' = ${omega}$, so $W = 1 \\cdot ${omega} - 0 \\cdot 0 = ${omega}$.`,
              `在 $x = 0$ 处：$y_1 = 1$，$y_2 = 0$，$y_1' = 0$，$y_2' = ${omega}$，所以 $W = 1 \\cdot ${omega} - 0 \\cdot 0 = ${omega}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-wronskian-of-two-powers",
      title: t("The Wronskian of two powers", "两个幂函数的朗斯基行列式"),
      explanation: t(
        "The Wronskian of $y_1$ and $y_2$ is $W = y_1y_2' - y_1'y_2$; if it is nonzero at one point of an interval, the functions are linearly independent there. For powers,\n\n$$W(x^m, x^n) = x^m \\cdot nx^{n - 1} - mx^{m - 1} \\cdot x^n = (n - m)x^{m + n - 1}.$$\n\nIt vanishes identically only when $m = n$, so different powers are always independent for $x > 0$. For example $W(x, x^{3}) = 2x^{3}$, which is $16$ at $x = 2$.\n\n> **Watch out.** The exponent is $m + n - 1$, because exactly one factor in each product has been differentiated; and the coefficient is $n - m$, the second exponent minus the first.",
        "$y_1$ 与 $y_2$ 的朗斯基行列式为 $W = y_1y_2' - y_1'y_2$；若它在区间内某一点不为零，则这两个函数在该区间上线性无关。对幂函数，\n\n$$W(x^m, x^n) = x^m \\cdot nx^{n - 1} - mx^{m - 1} \\cdot x^n = (n - m)x^{m + n - 1}.$$\n\n只有 $m = n$ 时它才恒为零，所以不同的幂函数在 $x > 0$ 上总是线性无关的。例如 $W(x, x^{3}) = 2x^{3}$，在 $x = 2$ 处为 $16$。\n\n> **注意。** 指数是 $m + n - 1$，因为每个乘积中恰有一个因子被求导；系数是 $n - m$，即第二个指数减第一个指数。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(-2, 4);
        const n = rng.pick([-3, -1, 1, 2, 3, 5, 6].filter((k) => k !== m));
        const two = (k: number) => Q.of(2).pow(k);
        const ans = Q.of(n - m).mul(two(m + n - 1));
        const term = (k: number) => (k === 0 ? "" : pw(k));
        const a1 = two(m);
        const a2 = Q.of(n).mul(two(n - 1));
        const b1 = Q.of(m).mul(two(m - 1));
        const b2 = two(n);
        return numberProblem({
          prompt: t(
            `Evaluate the Wronskian $W(${pw(m)}, ${pw(n)})$ at $x = 2$.`,
            `求朗斯基行列式 $W(${pw(m)}, ${pw(n)})$ 在 $x = 2$ 处的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(ans.neg(), "That computes $y_1'y_2 - y_1y_2'$; the order is reversed.", "这是计算了 $y_1'y_2 - y_1y_2'$；顺序反了。"),
            why(
              Q.of(n - m),
              "That stops at the coefficient; the power of $x$ must be evaluated at $x = 2$ too.",
              "这只算到系数；$x$ 的幂也要在 $x = 2$ 处求值。",
            ),
            why(
              Q.of(n - m).mul(two(m + n)),
              "The exponent is one too large; each product has one factor differentiated, which lowers the total power by one.",
              "指数大了一；每个乘积中有一个因子被求导，总次数降低一。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Form the Wronskian", "写出朗斯基行列式"],
                t("", ""),
                [`W = ${pw(m)} \\cdot (${pw(n)})' - (${pw(m)})' \\cdot ${pw(n)} = ${poly([n - m, term(m + n - 1)])}`],
              ],
              [["Evaluate", "求值"], t("", ""), [`W(2) = ${n - m} \\cdot 2^{${m + n - 1}} = ${ans.toLatex()}`]],
            ],
            t(
              `Directly at $x = 2$: $y_1 = ${a1.toLatex()}$, $y_2' = ${a2.toLatex()}$, $y_1' = ${b1.toLatex()}$, $y_2 = ${b2.toLatex()}$, and $${a1.toLatex()} \\cdot ${parQ(a2)} - ${parQ(b1)} \\cdot ${b2.toLatex()} = ${ans.toLatex()}$.`,
              `直接在 $x = 2$ 处计算：$y_1 = ${a1.toLatex()}$，$y_2' = ${a2.toLatex()}$，$y_1' = ${b1.toLatex()}$，$y_2 = ${b2.toLatex()}$，$${a1.toLatex()} \\cdot ${parQ(a2)} - ${parQ(b1)} \\cdot ${b2.toLatex()} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** generalSolutionsOfLinearOdes establishes y = y_h + y_p. */
export const generalSolutionsOfLinearOdes: TopicDef = {
  id: "general-solutions-of-linear-odes",
  title: t("General Solutions of Linear ODEs", "线性微分方程的通解结构"),
  summary: t(
    "The general solution of an inhomogeneous linear ODE is $y = c_1 y_1 + c_2 y_2 + y_p$: the homogeneous general solution plus any particular solution $y_p$.",
    "非齐次线性常微分方程的通解为 $y = c_1 y_1 + c_2 y_2 + y_p$：齐次通解加上任一特解 $y_p$。",
  ),
  intro: t(
    "The constant $y_p = 2$ solves $y'' - y = -2$, and $e^{x}$, $e^{-x}$ solve $y'' - y = 0$. So every solution is $y = c_1e^{x} + c_2e^{-x} + 2$. For $y(0) = 5$ and $y'(0) = 1$: $c_1 + c_2 = 3$ and $c_1 - c_2 = 1$, so $c_1 = 2$ and $c_2 = 1$.\n\nCheck: $y = 2e^{x} + e^{-x} + 2$ has $y(0) = 5$, $y'(0) = 2 - 1 = 1$, and $y'' - y = -2$.\n\nIn this lesson we build general solutions from a homogeneous part and a particular part, and fit them to initial conditions.",
    "常数 $y_p = 2$ 是 $y'' - y = -2$ 的解，$e^{x}$、$e^{-x}$ 是 $y'' - y = 0$ 的解。所以每个解都是 $y = c_1e^{x} + c_2e^{-x} + 2$。对 $y(0) = 5$，$y'(0) = 1$：$c_1 + c_2 = 3$，$c_1 - c_2 = 1$，所以 $c_1 = 2$，$c_2 = 1$。\n\n检验：$y = 2e^{x} + e^{-x} + 2$ 满足 $y(0) = 5$，$y'(0) = 2 - 1 = 1$，且 $y'' - y = -2$。\n\n本课我们用齐次部分与特解部分构造通解，并让它满足初始条件。",
  ),
  prerequisites: ["linear-independence-of-solutions-to-homogeneous-odes"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "structure-of-general-solutions-homogeneous-and-particular",
      title: t("Particular and homogeneous solution structure", "通解结构与特解初值问题"),
      explanation: t(
        "For an inhomogeneous equation with known particular constant solution $y_p = C_0$ and homogeneous solutions $y_1 = e^x, y_2 = e^{-x}$, the general solution is $y(x) = c_1 e^x + c_2 e^{-x} + C_0$. The initial value includes $C_0$, so $c_1 + c_2 = y(0) - C_0$, while the constant drops out of the derivative: $c_1 - c_2 = y'(0)$. With $C_0 = 3$, $y(0) = 7$ and $y'(0) = 2$: $c_1 + c_2 = 4$, $c_1 - c_2 = 2$, so $c_1 = 3$.\n\n> **Watch out.** Subtract $C_0$ from $y(0)$ before solving; the particular part is part of the value at $0$.",
        "对于已知常数特解 $y_p = C_0$ 且对应齐次通解为 $c_1 e^x + c_2 e^{-x}$ 的方程，全通解为 $y(x) = c_1 e^x + c_2 e^{-x} + C_0$。初值中包含 $C_0$，所以 $c_1 + c_2 = y(0) - C_0$；而常数在导数中消失：$c_1 - c_2 = y'(0)$。当 $C_0 = 3$，$y(0) = 7$，$y'(0) = 2$ 时：$c_1 + c_2 = 4$，$c_1 - c_2 = 2$，所以 $c_1 = 3$。\n\n> **注意。** 求解前先从 $y(0)$ 中减去 $C_0$；特解部分也是 $0$ 处函数值的一部分。",
      ),
      generate(rng: Rng): Problem {
        const C0 = rng.int(2, 15);
        const c1 = rng.int(1, 6);
        const c2 = rng.int(1, 6);
        const y0 = c1 + c2 + C0;
        const d = c1 - c2;
        const ans = c1;
        return numberProblem({
          prompt: t(
            `An inhomogeneous second-order linear ODE has general solution $y(x) = c_1 e^x + c_2 e^{-x} + ${C0}$. If $y(0) = ${y0}$ and $y'(0) = ${d}$, find the value of $c_1$.`,
            `某非齐次二阶线性微分方程的通解为 $y(x) = c_1 e^x + c_2 e^{-x} + ${C0}$。已知初值 $y(0) = ${y0}$ 且 $y'(0) = ${d}$。求常数 $c_1$ 的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(y0 + d, 2),
              `That forgets the particular part: $y(0)$ includes the constant $${C0}$.`,
              `这里忘了特解部分：$y(0)$ 中包含常数 $${C0}$。`,
            ),
            why(
              c2,
              "That subtracts the two equations, which gives $2c_2$; adding them isolates $c_1$.",
              "这是两式相减，得到的是 $2c_2$；两式相加才能分离出 $c_1$。",
            ),
            why(
              c1 + c2,
              "That is $c_1 + c_2$; solve the pair of equations for $c_1$ alone.",
              "这是 $c_1 + c_2$；要解方程组单独求出 $c_1$。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Use both conditions", "使用两个条件"],
                t("", ""),
                [`y(0) = c_1 + c_2 + ${C0} = ${y0} \\implies c_1 + c_2 = ${y0 - C0}`, `y'(0) = c_1 - c_2 = ${d}`],
              ],
              [["Add the equations", "两式相加"], t("", ""), [`2c_1 = ${y0 - C0} + ${par(d)} = ${2 * c1}`, `c_1 = ${ans}`]],
            ],
            t(
              `Then $c_2 = ${c2}$, and $y(0) = ${c1} + ${c2} + ${C0} = ${y0}$, $y'(0) = ${c1} - ${c2} = ${d}$.`,
              `于是 $c_2 = ${c2}$，$y(0) = ${c1} + ${c2} + ${C0} = ${y0}$，$y'(0) = ${c1} - ${c2} = ${d}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "fitting-a-general-solution-with-a-particular-part",
      title: t("Fitting a general solution with a particular part", "确定含特解部分的通解"),
      explanation: t(
        "The general solution of a linear inhomogeneous equation is $y = c_1y_1 + c_2y_2 + y_p$. The initial conditions apply to the whole of it, particular part included:\n\n$$c_1y_1(0) + c_2y_2(0) + y_p(0) = y(0), \\qquad c_1y_1'(0) + c_2y_2'(0) + y_p'(0) = y'(0).$$\n\nMove the known values of $y_p$ to the right before solving for the constants. For $y = c_1e^{x} + c_2e^{2x} + 3x$ with $y(0) = 1$ and $y'(0) = 6$: $c_1 + c_2 = 1$ and $c_1 + 2c_2 = 6 - 3 = 3$, so $c_2 = 2$.\n\n> **Watch out.** $y_p = kx$ is $0$ at $x = 0$ but its slope is $k$, so it changes the equation for $y'(0)$.",
        "线性非齐次方程的通解为 $y = c_1y_1 + c_2y_2 + y_p$。初始条件作用于整个通解，包括特解部分：\n\n$$c_1y_1(0) + c_2y_2(0) + y_p(0) = y(0), \\qquad c_1y_1'(0) + c_2y_2'(0) + y_p'(0) = y'(0).$$\n\n先把 $y_p$ 的已知值移到右边，再求常数。对 $y = c_1e^{x} + c_2e^{2x} + 3x$，$y(0) = 1$，$y'(0) = 6$：$c_1 + c_2 = 1$，$c_1 + 2c_2 = 6 - 3 = 3$，所以 $c_2 = 2$。\n\n> **注意。** $y_p = kx$ 在 $x = 0$ 处为 $0$，但它的斜率是 $k$，所以会改变关于 $y'(0)$ 的方程。",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.nonZero(-4, 3);
        const r2 = r1 + rng.int(1, 3);
        const k = rng.int(-4, 4) || 2;
        const c1 = rng.int(-5, 5);
        const c2 = rng.int(-5, 5) || 1;
        const p = c1 + c2;
        const q = r1 * c1 + r2 * c2 + k;
        const e = (r: number) => (r === 0 ? "" : ex(r));
        const tail = poly([k, "x"]);
        const gen = `c_1${e(r1)} + c_2${e(r2)} ${k < 0 ? "-" : "+"} ${tail.replace(/^-/, "")}`;
        return numberProblem({
          prompt: t(
            `The general solution of an equation is $y = ${gen}$. Find $c_2$ when $y(0) = ${p}$ and $y'(0) = ${q}$.`,
            `某方程的通解为 $y = ${gen}$。当 $y(0) = ${p}$，$y'(0) = ${q}$ 时求 $c_2$。`,
          ),
          answer: c2,
          mistakes: apart(c2, [
            why(
              Q.of(q - r1 * p, r2 - r1),
              `That leaves out the slope $${k}$ of the particular part in $y'(0)$.`,
              `这里在 $y'(0)$ 中漏掉了特解部分的斜率 $${k}$。`,
            ),
            why(c1, "That is $c_1$; the question asks for $c_2$.", "这是 $c_1$；题目要的是 $c_2$。"),
            why(
              Q.of(q + k - r1 * p, r2 - r1),
              `That adds the slope $${k}$ to $y'(0)$; it has to be subtracted.`,
              `这是把斜率 $${k}$ 加到 $y'(0)$ 上；应当减去它。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the two conditions", "写出两个条件"],
                t("", ""),
                [`y(0) = c_1 + c_2 = ${p}`, `y'(0) = ${poly([r1, "c_1"], [r2, "c_2"], [k, ""])} = ${q}`],
              ],
              [
                ["Eliminate c1", "消去 c1"],
                t(`Subtract $${par(r1)}$ times the first equation from the second:`, `从第二式减去第一式的 $${par(r1)}$ 倍：`),
                [`${poly([r2 - r1, "c_2"])} = ${q} - ${par(k)} - ${par(r1)} \\cdot ${par(p)} = ${q - k - r1 * p}`, `c_2 = ${c2}`],
              ],
            ],
            t(
              `With $c_1 = ${c1}$ and $c_2 = ${c2}$: $c_1 + c_2 = ${p}$ and $${par(r1)} \\cdot ${par(c1)} + ${par(r2)} \\cdot ${par(c2)} + ${par(k)} = ${q}$.`,
              `取 $c_1 = ${c1}$，$c_2 = ${c2}$：$c_1 + c_2 = ${p}$，$${par(r1)} \\cdot ${par(c1)} + ${par(r2)} \\cdot ${par(c2)} + ${par(k)} = ${q}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** abelsIdentity calculates Wronskian evolution W'(x) + P(x)W(x) = 0. */
export const abelsIdentity: TopicDef = {
  id: "abels-identity",
  title: t("Abel's Identity", "阿贝尔恒等式"),
  summary: t(
    "Abel's identity: the Wronskian of two solutions of $y'' + P(x)y' + Q(x)y = 0$ is $W(x) = W(x_0)\\exp\\left(-\\int_{x_0}^{x} P(t)\\,dt\\right)$.",
    "阿贝尔恒等式：$y'' + P(x)y' + Q(x)y = 0$ 的两个解的朗斯基行列式为 $W(x) = W(x_0)\\exp\\left(-\\int_{x_0}^{x} P(t)\\,dt\\right)$。",
  ),
  intro: t(
    "Two solutions of $y'' + 3y' + 2y = 0$ have $W(0) = 4$. Abel's identity gives $W(x) = 4e^{-3x}$ without solving the equation: only the coefficient of $y'$ matters.\n\nCheck: $e^{-x}$ and $e^{-2x}$ solve the equation and have $W = e^{-x}(-2e^{-2x}) - (-e^{-x})e^{-2x} = -e^{-3x}$, which also decays like $e^{-3x}$.\n\nIn this lesson we use Abel's identity to find how the Wronskian of two solutions changes, for constant and for variable coefficients.",
    "$y'' + 3y' + 2y = 0$ 的两个解满足 $W(0) = 4$。阿贝尔恒等式不必求解方程就给出 $W(x) = 4e^{-3x}$：只有 $y'$ 的系数起作用。\n\n检验：$e^{-x}$ 与 $e^{-2x}$ 是方程的解，其 $W = e^{-x}(-2e^{-2x}) - (-e^{-x})e^{-2x} = -e^{-3x}$，同样按 $e^{-3x}$ 衰减。\n\n本课我们用阿贝尔恒等式求两个解的朗斯基行列式如何变化，包括常系数和变系数的情形。",
  ),
  prerequisites: ["linear-independence-of-solutions-to-homogeneous-odes"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "abels-formula-for-the-wronskian",
      title: t("Abel's formula for the Wronskian", "阿贝尔微分公式与朗斯基行列式"),
      explanation: t(
        "Abel's formula shows that the Wronskian satisfies its own first order equation, so it is either never zero or always zero. For $y'' + a y' + b y = 0$ with constant coefficient $a$, the Wronskian satisfies $\\frac{dW}{dx} = -a W$. Thus $\\frac{W'(0)}{W(0)} = -a$. For $y'' + 5y' + 6y = 0$ the ratio is $-5$, whatever the two solutions are.\n\n> **Watch out.** Only the coefficient of $y'$ enters, with a minus sign; the coefficient of $y$ plays no part.",
        "阿贝尔公式说明朗斯基行列式满足一个一阶方程，所以它要么永不为零，要么恒为零。对于常系数齐次方程 $y'' + a y' + b y = 0$，朗斯基行列式满足微分方程 $\\frac{dW}{dx} = -a W$，因此导数相对变化率为 $\\frac{W'(0)}{W(0)} = -a$。对 $y'' + 5y' + 6y = 0$，无论取哪两个解，比值都是 $-5$。\n\n> **注意。** 只有 $y'$ 的系数起作用，并且带负号；$y$ 的系数不起作用。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 30);
        const ans = -a;
        return numberProblem({
          prompt: t(
            `Let $y_1$ and $y_2$ be two solutions of the differential equation $y'' + ${a}y' + 12y = 0$ with non-zero Wronskian $W(x)$. Using Abel's identity, calculate the ratio $\\frac{W'(0)}{W(0)}$.`,
            `设 $y_1$ 与 $y_2$ 是常微分方程 $y'' + ${a}y' + 12y = 0$ 的两个解，其朗斯基行列式 $W(x) \\neq 0$。利用阿贝尔恒等式，计算比值 $\\frac{W'(0)}{W(0)}$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(a, "The sign is lost; Abel's identity reads $W' = -PW$.", "丢了负号；阿贝尔恒等式是 $W' = -PW$。"),
            why(
              -12,
              "That uses the coefficient of $y$; only the coefficient of $y'$ enters.",
              "这是用了 $y$ 的系数；只有 $y'$ 的系数起作用。",
            ),
            why(12, "That uses the coefficient of $y$, and without the minus sign.", "这是用了 $y$ 的系数，而且没有负号。"),
          ]),
          solution: walked(
            [
              [
                ["Write Abel's equation", "写出阿贝尔方程"],
                t(`Here the coefficient of $y'$ is $P = ${a}$, so`, `这里 $y'$ 的系数是 $P = ${a}$，所以`),
                [`W'(x) + ${a}W(x) = 0`],
              ],
              [["Divide by W", "除以 W"], t("", ""), [`\\frac{W'(x)}{W(x)} = -${a}`, `\\frac{W'(0)}{W(0)} = ${ans}`]],
            ],
            t(
              `Abel's identity gives $W(x) = W(0)e^{-${a}x}$, whose derivative is $-${a}W(0)e^{-${a}x}$; at $0$ the ratio is $-${a}$.`,
              `阿贝尔恒等式给出 $W(x) = W(0)e^{-${a}x}$，其导数为 $-${a}W(0)e^{-${a}x}$；在 $0$ 处比值为 $-${a}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "abels-identity-with-a-variable-coefficient",
      title: t("Abel's identity with a variable coefficient", "变系数情形的阿贝尔恒等式"),
      explanation: t(
        "For $y'' + p(x)y' + q(x)y = 0$, Abel's identity gives the Wronskian of any two solutions without finding them:\n\n$$W(x) = W(x_0)\\exp\\left(-\\int_{x_0}^{x} p(s)\\,ds\\right).$$\n\nWith $p(x) = \\frac{k}{x}$ on $x > 0$ the integral is $k\\ln\\frac{x}{x_0}$, so $W(x) = W(x_0)\\left(\\frac{x_0}{x}\\right)^{k}$. Bring the equation to standard form first, since $p$ is the coefficient of $y'$ after dividing by the coefficient of $y''$. For $2xy'' + 4y' + xy = 0$, $p = \\frac{2}{x}$, so $W(2) = W(1) \\cdot \\frac{1}{4}$.\n\n> **Watch out.** Divide by the coefficient of $y''$ before reading off $k$, and keep the minus sign: $p = \\frac{k}{x}$ makes $W$ behave like $x^{-k}$.",
        "对 $y'' + p(x)y' + q(x)y = 0$，阿贝尔恒等式不求解就给出任意两个解的朗斯基行列式：\n\n$$W(x) = W(x_0)\\exp\\left(-\\int_{x_0}^{x} p(s)\\,ds\\right).$$\n\n当 $x > 0$ 上 $p(x) = \\frac{k}{x}$ 时，积分为 $k\\ln\\frac{x}{x_0}$，所以 $W(x) = W(x_0)\\left(\\frac{x_0}{x}\\right)^{k}$。要先化为标准形式，因为 $p$ 是除以 $y''$ 的系数之后 $y'$ 的系数。对 $2xy'' + 4y' + xy = 0$，$p = \\frac{2}{x}$，所以 $W(2) = W(1) \\cdot \\frac{1}{4}$。\n\n> **注意。** 读出 $k$ 之前要先除以 $y''$ 的系数，并保留负号：$p = \\frac{k}{x}$ 使 $W$ 像 $x^{-k}$ 一样变化。",
      ),
      generate(rng: Rng): Problem {
        const lead = rng.int(1, 3);
        const k = rng.pick([-3, -2, -1, 1, 2, 3]);
        const w1 = rng.int(1, 8) * rng.pick([-1, 1]);
        const qq = rng.int(-5, 5) || 1;
        const ans = Q.of(w1).mul(Q.of(2).pow(-k));
        const eq = poly([lead, "xy''"], [k * lead, "y'"], [qq, "xy"]);
        const pStr = k === 1 ? "\\frac{1}{x}" : k === -1 ? "-\\frac{1}{x}" : k < 0 ? `-\\frac{${-k}}{x}` : `\\frac{${k}}{x}`;
        return numberProblem({
          prompt: t(
            `Two solutions of $${eq} = 0$ on $x > 0$ have Wronskian $W(1) = ${w1}$. Find $W(2)$.`,
            `$${eq} = 0$ 在 $x > 0$ 上的两个解满足 $W(1) = ${w1}$。求 $W(2)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(w1).mul(Q.of(2).pow(k)),
              "The sign of the exponent is off; $W$ carries $e^{-\\int p}$.",
              "指数的符号错了；$W$ 中是 $e^{-\\int p}$。",
            ),
            why(
              Q.of(w1).mul(Q.of(2).pow(-k * lead)),
              `That reads $p$ before dividing by the coefficient $${lead}x$ of $y''$.`,
              `这是在除以 $y''$ 的系数 $${lead}x$ 之前就读出了 $p$。`,
            ),
            why(
              Q.of(w1),
              "That keeps $W$ constant; it changes unless the coefficient of $y'$ is zero.",
              "这是把 $W$ 当作常数；除非 $y'$ 的系数为零，否则它会变化。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Write the standard form", "化为标准形式"],
                t(
                  `Divide by $${lead === 1 ? "" : lead}x$; the coefficient of $y'$ becomes`,
                  `除以 $${lead === 1 ? "" : lead}x$，$y'$ 的系数变为`,
                ),
                [`p(x) = ${pStr}`],
              ],
              [
                ["Apply Abel's identity", "应用阿贝尔恒等式"],
                t("", ""),
                [`W(2) = W(1)\\exp\\left(-\\int_{1}^{2} p\\,ds\\right) = ${w1} \\cdot 2^{${-k}} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `$W(x) = ${poly([w1, pw(-k)])}$ gives $W(1) = ${w1}$, and $xW' = ${poly([-k, "W"])}$, which is $W' + pW = 0$.`,
              `$W(x) = ${poly([w1, pw(-k)])}$ 给出 $W(1) = ${w1}$，且 $xW' = ${poly([-k, "W"])}$，即 $W' + pW = 0$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 3.9 Second-Order Linear ODEs With Constant Coefficients
// ---------------------------------------------------------------------------

/** secondOrderHomogeneousOdesCharacteristicEquationsWithDistinctRealRoots solves distinct roots. */
export const secondOrderHomogeneousOdesCharacteristicEquationsWithDistinctRealRoots: TopicDef = {
  id: "second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots",
  title: t(
    "Second-Order Homogeneous ODEs: Characteristic Equations With Distinct Real Roots",
    "二阶齐次常微分方程：具有不同实根的特征方程",
  ),
  summary: t(
    "When the characteristic equation $r^2 + br + c = 0$ has distinct real roots $r_1 \\ne r_2$, the general solution is $y = c_1 e^{r_1 x} + c_2 e^{r_2 x}$.",
    "当特征方程 $r^2 + br + c = 0$ 有两个不同实根 $r_1 \\ne r_2$ 时，通解为 $y = c_1 e^{r_1 x} + c_2 e^{r_2 x}$。",
  ),
  intro: t(
    "Solve $y'' - 5y' + 6y = 0$. Trying $y = e^{rx}$ gives the characteristic equation $r^{2} - 5r + 6 = (r - 2)(r - 3) = 0$, so $r = 2$ or $r = 3$, and the general solution is $y = c_1e^{2x} + c_2e^{3x}$.\n\nCheck: for $y = e^{3x}$, $y'' - 5y' + 6y = (9 - 15 + 6)e^{3x} = 0$.\n\nIn this lesson we find the characteristic roots of constant-coefficient equations with two distinct real roots, write the general solution, and fit it to initial conditions.",
    "解 $y'' - 5y' + 6y = 0$。代入 $y = e^{rx}$ 得特征方程 $r^{2} - 5r + 6 = (r - 2)(r - 3) = 0$，所以 $r = 2$ 或 $r = 3$，通解为 $y = c_1e^{2x} + c_2e^{3x}$。\n\n检验：对 $y = e^{3x}$，$y'' - 5y' + 6y = (9 - 15 + 6)e^{3x} = 0$。\n\n本课我们求有两个不同实根的常系数方程的特征根，写出通解，并让它满足初始条件。",
  ),
  prerequisites: ["general-solutions-of-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "distinct-real-characteristic-roots",
      title: t("Distinct real characteristic roots", "互异实特征根与指数通解"),
      explanation: t(
        "Each real root of the characteristic equation gives an exponential solution, and two different roots give two independent solutions. If the characteristic polynomial factors as $(r - r_1)(r - r_2) = 0$ with $r_1 \\ne r_2$, the characteristic roots are $r_1$ and $r_2$. For $y'' - 7y' + 10y = 0$, $r^{2} - 7r + 10 = (r - 2)(r - 5)$, so the roots are $2$ and $5$.\n\n> **Watch out.** The factor $r - 5$ gives the root $+5$; and the roots multiply to the constant term and add to minus the coefficient of $r$, they are not those coefficients themselves.",
        "特征方程的每个实根给出一个指数解，两个不同的根给出两个线性无关的解。若特征多项式分解为 $(r - r_1)(r - r_2) = 0$（$r_1 \\ne r_2$），则特征根为 $r_1$ 和 $r_2$。对 $y'' - 7y' + 10y = 0$，$r^{2} - 7r + 10 = (r - 2)(r - 5)$，所以根是 $2$ 和 $5$。\n\n> **注意。** 因子 $r - 5$ 给出的根是 $+5$；两根之积等于常数项，两根之和等于 $r$ 的系数的相反数，而不是这些系数本身。",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.int(1, 8);
        const r2 = rng.int(r1 + 1, r1 + 10);
        const b = -(r1 + r2);
        const c = r1 * r2;
        const ans = r2;
        return numberProblem({
          prompt: t(
            `Find the larger characteristic root $r$ of the differential equation $${poly([1, "y''"], [b, "y'"], [c, "y"])} = 0$.`,
            `求微分方程 $${poly([1, "y''"], [b, "y'"], [c, "y"])} = 0$ 中较大的特征根 $r$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(r1, "That is the smaller root.", "这是较小的根。"),
            why(
              -r2,
              `The sign is flipped; the factor $r - ${r2}$ is zero at $r = ${r2}$.`,
              `符号反了；因子 $r - ${r2}$ 在 $r = ${r2}$ 处为零。`,
            ),
            why(r1 + r2, "That is the sum of the roots, read from the coefficient of $y'$.", "这是由 $y'$ 的系数读出的两根之和。"),
          ]),
          solution: walked(
            [
              [
                ["Write the characteristic equation", "写出特征方程"],
                t("Substituting $y = e^{rx}$ gives", "代入 $y = e^{rx}$ 得"),
                [`${poly([1, "r^2"], [b, "r"], [c, ""])} = 0`],
              ],
              [
                ["Factor", "因式分解"],
                t(`The roots are $${r1}$ and $${r2}$; the larger is $${ans}$.`, `两根为 $${r1}$ 与 $${r2}$；较大的是 $${ans}$。`),
                [`(r - ${r1})(r - ${r2}) = 0`],
              ],
            ],
            t(
              `$${r2}^{2} - ${-b} \\cdot ${r2} + ${c} = ${r2 * r2} - ${-b * r2} + ${c} = 0$.`,
              `$${r2}^{2} - ${-b} \\cdot ${r2} + ${c} = ${r2 * r2} - ${-b * r2} + ${c} = 0$。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-an-ivp-with-distinct-real-roots",
      title: t("Solving an initial value problem with distinct real roots", "求解特征根为互异实根的初值问题"),
      explanation: t(
        "When the characteristic equation $r^2 + br + c = 0$ has distinct real roots $r_1$, $r_2$, the general solution is $y = c_1e^{r_1x} + c_2e^{r_2x}$. The initial conditions give\n\n$$c_1 + c_2 = y(0), \\qquad r_1c_1 + r_2c_2 = y'(0),$$\n\na two-by-two linear system for the constants. For $y'' - 3y' + 2y = 0$ with $y(0) = 3$, $y'(0) = 4$: $c_1 + c_2 = 3$ and $c_1 + 2c_2 = 4$, so $c_1 = 2$ and $c_2 = 1$.\n\n> **Watch out.** In the second equation each constant is multiplied by its own root; keep $c_1$ with $r_1$ and $c_2$ with $r_2$.",
        "当特征方程 $r^2 + br + c = 0$ 有互异实根 $r_1$、$r_2$ 时，通解为 $y = c_1e^{r_1x} + c_2e^{r_2x}$。初始条件给出\n\n$$c_1 + c_2 = y(0), \\qquad r_1c_1 + r_2c_2 = y'(0),$$\n\n这是关于两个常数的二元线性方程组。对 $y'' - 3y' + 2y = 0$，$y(0) = 3$，$y'(0) = 4$：$c_1 + c_2 = 3$，$c_1 + 2c_2 = 4$，所以 $c_1 = 2$，$c_2 = 1$。\n\n> **注意。** 在第二个方程中每个常数乘以它自己的根；$c_1$ 配 $r_1$，$c_2$ 配 $r_2$。",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.nonZero(-5, 4);
        const r2 = r1 + rng.int(1, 4) || r1 + 5;
        const c1 = rng.int(-5, 5) || 3;
        const c2 = rng.int(-5, 5) || -2;
        const p = c1 + c2;
        const q = r1 * c1 + r2 * c2;
        const which = rng.int(1, 2);
        const ans = which === 1 ? c1 : c2;
        const other = which === 1 ? c2 : c1;
        const eq = poly([1, "y''"], [-(r1 + r2), "y'"], [r1 * r2, "y"]);
        return numberProblem({
          prompt: t(
            `Solve $${eq} = 0$ with $y(0) = ${p}$, $y'(0) = ${q}$. Find the coefficient of $${ex(which === 1 ? r1 : r2)}$.`,
            `解 $${eq} = 0$，$y(0) = ${p}$，$y'(0) = ${q}$。求 $${ex(which === 1 ? r1 : r2)}$ 的系数。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              other,
              "That is the coefficient of the other exponential; the roots were paired with the wrong constants.",
              "这是另一个指数函数的系数；根与常数配错了。",
            ),
            why(
              -ans,
              "The sign is flipped; recheck the subtraction that eliminates the other constant.",
              "符号反了；重新检查消去另一个常数时的减法。",
            ),
            why(p, "That is $y(0)$, the sum of both constants.", "这是 $y(0)$，即两个常数之和。"),
          ]),
          solution: walked(
            [
              [
                ["Find the roots", "求特征根"],
                t(`The characteristic roots are $${r1}$ and $${r2}$, so`, `特征根为 $${r1}$ 与 $${r2}$，所以`),
                [`y = c_1${ex(r1)} + c_2${ex(r2)}`],
              ],
              [
                ["Solve for the constants", "求常数"],
                t("", ""),
                [`c_1 + c_2 = ${p}`, `${poly([r1, "c_1"], [r2, "c_2"])} = ${q}`, `c_1 = ${c1}, \\quad c_2 = ${c2}`],
              ],
            ],
            t(
              `$${c1} + ${par(c2)} = ${p}$ and $${par(r1)} \\cdot ${par(c1)} + ${par(r2)} \\cdot ${par(c2)} = ${q}$.`,
              `$${c1} + ${par(c2)} = ${p}$，$${par(r1)} \\cdot ${par(c1)} + ${par(r2)} \\cdot ${par(c2)} = ${q}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** secondOrderHomogeneousOdesCharacteristicEquationsWithRepeatedRoots solves double root. */
export const secondOrderHomogeneousOdesCharacteristicEquationsWithRepeatedRoots: TopicDef = {
  id: "second-order-homogeneous-odes-characteristic-equations-with-repeated-roots",
  title: t("Second-Order Homogeneous ODEs: Characteristic Equations With Repeated Roots", "二阶齐次常微分方程：具有重根的特征方程"),
  summary: t(
    "When the characteristic equation has a repeated root $r$, the general solution is $y = (c_1 + c_2 x)e^{rx}$.",
    "当特征方程有二重实根 $r$ 时，通解为 $y = (c_1 + c_2 x)e^{rx}$。",
  ),
  intro: t(
    "Solve $y'' - 4y' + 4y = 0$. The characteristic equation $r^{2} - 4r + 4 = (r - 2)^{2} = 0$ has only the root $2$, so $e^{2x}$ is one solution and $xe^{2x}$ is the second: $y = (c_1 + c_2x)e^{2x}$.\n\nCheck: for $y = xe^{2x}$, $y' = (1 + 2x)e^{2x}$ and $y'' = (4 + 4x)e^{2x}$, so $y'' - 4y' + 4y = (4 + 4x - 4 - 8x + 4x)e^{2x} = 0$.\n\nIn this lesson we recognize a repeated characteristic root, write the general solution with the extra factor $x$, and fit it to initial conditions.",
    "解 $y'' - 4y' + 4y = 0$。特征方程 $r^{2} - 4r + 4 = (r - 2)^{2} = 0$ 只有根 $2$，所以 $e^{2x}$ 是一个解，$xe^{2x}$ 是第二个解：$y = (c_1 + c_2x)e^{2x}$。\n\n检验：对 $y = xe^{2x}$，$y' = (1 + 2x)e^{2x}$，$y'' = (4 + 4x)e^{2x}$，所以 $y'' - 4y' + 4y = (4 + 4x - 4 - 8x + 4x)e^{2x} = 0$。\n\n本课我们识别特征方程的重根，写出带有额外因子 $x$ 的通解，并让它满足初始条件。",
  ),
  prerequisites: ["second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots"],
  encompasses: [
    {
      topic: "second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "repeated-characteristic-roots",
      title: t("Repeated characteristic roots", "二重实特征根与通解构造"),
      explanation: t(
        "A repeated root gives only one exponential, so the second solution is that exponential multiplied by the variable. For $(r - a)^2 = 0$, the repeated root is $r = a$. The general solution is $y(x) = (c_1 + c_2 x)e^{ax}$. For $y'' - 6y' + 9y = 0$, $r^{2} - 6r + 9 = (r - 3)^{2}$, so the root is $3$.\n\n> **Watch out.** The root is half of the coefficient of $y'$, with the opposite sign, and the square root of the constant term; it is not either coefficient itself.",
        "重根只给出一个指数函数，所以第二个解是这个指数函数乘以自变量。对于 $(r - a)^2 = 0$，二重特征根为 $r = a$。通解为 $y(x) = (c_1 + c_2 x)e^{ax}$。对 $y'' - 6y' + 9y = 0$，$r^{2} - 6r + 9 = (r - 3)^{2}$，所以根是 $3$。\n\n> **注意。** 根等于 $y'$ 的系数的一半再取相反数，也等于常数项的平方根；它不是任何一个系数本身。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 30);
        const b = 2 * a;
        const c = a * a;
        const ans = a;
        return numberProblem({
          prompt: t(
            `Find the repeated characteristic root $r$ of the differential equation $y'' - ${b}y' + ${c}y = 0$.`,
            `求微分方程 $y'' - ${b}y' + ${c}y = 0$ 的二重特征根 $r$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(b, "That is the sum of the two equal roots; halve it.", "这是两个相等根之和；要除以二。"),
            why(c, "That is the product of the two equal roots; take its square root.", "这是两个相等根之积；要开平方。"),
            why(-a, `The sign is flipped; $(r - ${a})^{2}$ is zero at $r = ${a}$.`, `符号反了；$(r - ${a})^{2}$ 在 $r = ${a}$ 处为零。`),
          ]),
          solution: walked(
            [
              [["Write the characteristic equation", "写出特征方程"], t("", ""), [`r^{2} - ${b}r + ${c} = 0`]],
              [
                ["Recognize the square", "识别完全平方"],
                t(`The repeated root is $r = ${ans}$.`, `二重根为 $r = ${ans}$。`),
                [`(r - ${a})^{2} = 0`],
              ],
            ],
            t(
              `The discriminant is $${b}^{2} - 4 \\cdot ${c} = ${b * b} - ${4 * c} = 0$, so the root is repeated, and it is $\\frac{${b}}{2} = ${a}$.`,
              `判别式为 $${b}^{2} - 4 \\cdot ${c} = ${b * b} - ${4 * c} = 0$，所以是重根，且等于 $\\frac{${b}}{2} = ${a}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-an-ivp-with-a-repeated-root",
      title: t("Solving an initial value problem with a repeated root", "求解特征根为重根的初值问题"),
      explanation: t(
        "A repeated root $r$ gives the general solution $y = (c_1 + c_2x)e^{rx}$. At $x = 0$, $y(0) = c_1$, and differentiating,\n\n$$y'(0) = rc_1 + c_2, \\qquad c_2 = y'(0) - r\\,y(0).$$\n\nThe coefficient of $xe^{rx}$ is not $y'(0)$ itself: the derivative of $c_1e^{rx}$ also contributes. For $r = 2$, $y(0) = 3$ and $y'(0) = 1$, $c_2 = 1 - 6 = -5$.\n\n> **Watch out.** Subtract $r\\,y(0)$, do not add it; and use the root $r$, not the coefficient $-2r$ of $y'$.",
        "重根 $r$ 给出通解 $y = (c_1 + c_2x)e^{rx}$。在 $x = 0$ 时 $y(0) = c_1$，求导得\n\n$$y'(0) = rc_1 + c_2, \\qquad c_2 = y'(0) - r\\,y(0).$$\n\n$xe^{rx}$ 的系数并不就是 $y'(0)$：$c_1e^{rx}$ 的导数也有贡献。当 $r = 2$，$y(0) = 3$，$y'(0) = 1$ 时，$c_2 = 1 - 6 = -5$。\n\n> **注意。** 要减去 $r\\,y(0)$，而不是加上；并且用根 $r$，而不是 $y'$ 的系数 $-2r$。",
      ),
      generate(rng: Rng): Problem {
        const r = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
        const p = rng.int(-5, 5) || 2;
        const q = rng.int(-8, 8);
        const ans = q - r * p;
        const er = ex(r);
        const eq = poly([1, "y''"], [-2 * r, "y'"], [r * r, "y"]);
        return numberProblem({
          prompt: t(
            `Solve $${eq} = 0$ with $y(0) = ${p}$, $y'(0) = ${q}$. Find the coefficient of $x${er}$.`,
            `解 $${eq} = 0$，$y(0) = ${p}$，$y'(0) = ${q}$。求 $x${er}$ 的系数。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              q,
              `That takes $y'(0)$ as $c_2$; the derivative of $c_1${er}$ adds $${r}c_1$.`,
              `这是把 $y'(0)$ 当成 $c_2$；$c_1${er}$ 的导数会加上 $${r}c_1$。`,
            ),
            why(
              q + r * p,
              `That adds $${par(r)} \\cdot y(0)$ instead of subtracting it.`,
              `这是加上 $${par(r)} \\cdot y(0)$，而不是减去它。`,
            ),
            why(p, "That is $c_1 = y(0)$, the coefficient of the plain exponential.", "这是 $c_1 = y(0)$，即单独指数函数的系数。"),
          ]),
          solution: walked(
            [
              [
                ["Write the general solution", "写出通解"],
                t(`$r = ${r}$ is a repeated root, so`, `$r = ${r}$ 是重根，所以`),
                [`y = (c_1 + c_2x)${er}`, `y' = \\left(c_2 + ${par(r)}(c_1 + c_2x)\\right)${er}`],
              ],
              [
                ["Apply the conditions", "代入条件"],
                t("", ""),
                [`c_1 = y(0) = ${p}`, `c_2 = y'(0) - ${par(r)} \\cdot ${par(p)} = ${q} - ${par(r * p)} = ${ans}`],
              ],
            ],
            t(
              `$y'(0) = c_2 + ${par(r)}c_1 = ${ans} + ${par(r * p)} = ${q}$, as given.`,
              `$y'(0) = c_2 + ${par(r)}c_1 = ${ans} + ${par(r * p)} = ${q}$，与所给一致。`,
            ),
          ),
        });
      },
    },
  ],
};

/** secondOrderHomogeneousOdesCharacteristicEquationsWithComplexRoots solves complex roots. */
export const secondOrderHomogeneousOdesCharacteristicEquationsWithComplexRoots: TopicDef = {
  id: "second-order-homogeneous-odes-characteristic-equations-with-complex-roots",
  title: t("Second-Order Homogeneous ODEs: Characteristic Equations With Complex Roots", "二阶齐次常微分方程：具有复数根的特征方程"),
  summary: t(
    "When the characteristic roots are $\\alpha \\pm i\\beta$, the solutions oscillate inside an exponential envelope: $y = e^{\\alpha x}(c_1 \\cos \\beta x + c_2 \\sin \\beta x)$.",
    "当特征根为共轭复根 $\\alpha \\pm i\\beta$ 时，通解是带指数包络的振荡：$y = e^{\\alpha x}(c_1 \\cos \\beta x + c_2 \\sin \\beta x)$。",
  ),
  intro: t(
    "Solve $y'' + 2y' + 5y = 0$. The characteristic equation $r^{2} + 2r + 5 = 0$ gives $(r + 1)^{2} = -4$, so $r = -1 \\pm 2i$. The real part $-1$ sets the decay and the imaginary part $2$ sets the frequency: $y = e^{-x}(c_1\\cos 2x + c_2\\sin 2x)$.\n\nCheck: $(-1 + 2i)^{2} + 2(-1 + 2i) + 5 = (-3 - 4i) + (-2 + 4i) + 5 = 0$.\n\nIn this lesson we find complex characteristic roots, write the real oscillating solutions, and fit them to initial conditions.",
    "解 $y'' + 2y' + 5y = 0$。特征方程 $r^{2} + 2r + 5 = 0$ 给出 $(r + 1)^{2} = -4$，所以 $r = -1 \\pm 2i$。实部 $-1$ 决定衰减，虚部 $2$ 决定频率：$y = e^{-x}(c_1\\cos 2x + c_2\\sin 2x)$。\n\n检验：$(-1 + 2i)^{2} + 2(-1 + 2i) + 5 = (-3 - 4i) + (-2 + 4i) + 5 = 0$。\n\n本课我们求复特征根，写出实值的振荡解，并让它满足初始条件。",
  ),
  prerequisites: ["second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots"],
  encompasses: [
    {
      topic: "second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "complex-conjugate-characteristic-roots",
      title: t("Complex conjugate characteristic roots", "共轭复特征根与振荡角频率"),
      explanation: t(
        "Complex roots produce oscillating solutions: the real part sets the growth or decay and the imaginary part sets the frequency of the sine and cosine. For $r = \\alpha \\pm i \\beta$, the angular frequency in the trigonometric arguments is $\\beta = \\sqrt{c - \\alpha^2}$. For $y'' - 4y' + 13y = 0$, $\\alpha = 2$ and $\\beta = \\sqrt{13 - 4} = 3$.\n\n> **Watch out.** Completing the square gives $(r - \\alpha)^{2} = -\\beta^{2}$, so take the square root of $c - \\alpha^{2}$; and the quadratic formula has a $2$ in the denominator that halves $\\sqrt{4c - b^{2}}$.",
        "复根产生振荡的解：实部决定增长或衰减，虚部决定正弦和余弦的频率。特征根为 $r = \\alpha \\pm i \\beta$ 时，三角函数中的振荡角频率为虚部 $\\beta = \\sqrt{c - \\alpha^2}$。对 $y'' - 4y' + 13y = 0$，$\\alpha = 2$，$\\beta = \\sqrt{13 - 4} = 3$。\n\n> **注意。** 配方得 $(r - \\alpha)^{2} = -\\beta^{2}$，所以要对 $c - \\alpha^{2}$ 开平方；求根公式的分母中有 $2$，它会把 $\\sqrt{4c - b^{2}}$ 减半。",
      ),
      generate(rng: Rng): Problem {
        const alpha = rng.int(1, 6);
        const beta = rng.int(2, 10);
        const b = 2 * alpha;
        const c = alpha * alpha + beta * beta;
        const ans = beta;
        return numberProblem({
          prompt: t(
            `The characteristic equation of $y'' - ${b}y' + ${c}y = 0$ has complex conjugate roots $\\alpha \\pm i\\beta$ with $\\beta > 0$. Find the imaginary part $\\beta$.`,
            `微分方程 $y'' - ${b}y' + ${c}y = 0$ 的特征方程具有共轭复根 $\\alpha \\pm i\\beta$（$\\beta > 0$）。求其虚部 $\\beta$ 的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(alpha, "That is the real part $\\alpha$.", "这是实部 $\\alpha$。"),
            why(beta * beta, "That is $\\beta^{2}$; take the square root.", "这是 $\\beta^{2}$；还要开平方。"),
            why(
              2 * beta,
              "That is $\\sqrt{4c - b^{2}}$; the quadratic formula divides it by $2$.",
              "这是 $\\sqrt{4c - b^{2}}$；求根公式还要除以 $2$。",
            ),
          ]),
          solution: walked(
            [
              [["Complete the square", "配方"], t("", ""), [`r^{2} - ${b}r + ${c} = (r - ${alpha})^{2} + ${beta * beta} = 0`]],
              [
                ["Solve", "求解"],
                t(`So $\\beta = ${ans}$.`, `所以 $\\beta = ${ans}$。`),
                [`(r - ${alpha})^{2} = -${beta * beta}`, `r = ${alpha} \\pm ${beta}i`],
              ],
            ],
            t(
              `The roots multiply to $\\alpha^{2} + \\beta^{2} = ${alpha * alpha} + ${beta * beta} = ${c}$ and add to $2\\alpha = ${b}$, matching the coefficients.`,
              `两根之积为 $\\alpha^{2} + \\beta^{2} = ${alpha * alpha} + ${beta * beta} = ${c}$，两根之和为 $2\\alpha = ${b}$，与系数一致。`,
            ),
          ),
        });
      },
    },
    {
      id: "solving-an-ivp-with-complex-roots",
      title: t("Solving an initial value problem with complex roots", "求解特征根为复根的初值问题"),
      explanation: t(
        "Complex roots $\\alpha \\pm \\beta i$ give $y = e^{\\alpha x}(A\\cos \\beta x + B\\sin \\beta x)$. At $x = 0$, $y(0) = A$, and the product rule gives\n\n$$y'(0) = \\alpha A + \\beta B, \\qquad B = \\frac{y'(0) - \\alpha\\,y(0)}{\\beta}.$$\n\nThe growth factor $e^{\\alpha x}$ contributes to the derivative, so $B$ is not simply $y'(0)/\\beta$ unless $\\alpha = 0$. For roots $-1 \\pm 2i$ with $y(0) = 1$ and $y'(0) = 3$, $B = \\frac{3 + 1}{2} = 2$.\n\n> **Watch out.** Subtract $\\alpha\\,y(0)$ first, then divide by $\\beta$; skipping either step gives a wrong $B$.",
        "复根 $\\alpha \\pm \\beta i$ 给出 $y = e^{\\alpha x}(A\\cos \\beta x + B\\sin \\beta x)$。在 $x = 0$ 时 $y(0) = A$，由乘积法则得\n\n$$y'(0) = \\alpha A + \\beta B, \\qquad B = \\frac{y'(0) - \\alpha\\,y(0)}{\\beta}.$$\n\n增长因子 $e^{\\alpha x}$ 对导数也有贡献，所以除非 $\\alpha = 0$，$B$ 并不简单地等于 $y'(0)/\\beta$。对根 $-1 \\pm 2i$，$y(0) = 1$，$y'(0) = 3$，$B = \\frac{3 + 1}{2} = 2$。\n\n> **注意。** 先减去 $\\alpha\\,y(0)$，再除以 $\\beta$；少了任何一步 $B$ 都会错。",
      ),
      generate(rng: Rng): Problem {
        const al = rng.pick([-3, -2, -1, 1, 2, 3]);
        const be = rng.int(1, 5);
        const p = rng.int(-5, 5) || 1;
        const q = rng.int(-8, 8);
        const ans = Q.of(q - al * p, be);
        const ea = ex(al);
        const bx = be === 1 ? "x" : `${be}x`;
        const eq = poly([1, "y''"], [-2 * al, "y'"], [al * al + be * be, "y"]);
        return numberProblem({
          prompt: t(
            `Solve $${eq} = 0$ with $y(0) = ${p}$, $y'(0) = ${q}$, written as $y = ${ea}(A\\cos ${bx} + B\\sin ${bx})$. Find $B$.`,
            `解 $${eq} = 0$，$y(0) = ${p}$，$y'(0) = ${q}$，写成 $y = ${ea}(A\\cos ${bx} + B\\sin ${bx})$。求 $B$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(q, be),
              `That leaves out the contribution $${al}A$ of the factor $${ea}$ to $y'(0)$.`,
              `这里漏掉了因子 $${ea}$ 对 $y'(0)$ 的贡献 $${al}A$。`,
            ),
            why(
              Q.of(q + al * p, be),
              `That adds $${par(al)} \\cdot y(0)$ instead of subtracting it.`,
              `这是加上 $${par(al)} \\cdot y(0)$，而不是减去它。`,
            ),
            why(Q.of(q - al * p), `That forgets to divide by $\\beta = ${be}$.`, `这里忘了除以 $\\beta = ${be}$。`),
          ]),
          solution: walked(
            [
              [
                ["Read off the roots", "读出特征根"],
                t(
                  `The roots are $${al} \\pm ${be === 1 ? "" : be}i$, and $A = y(0) = ${p}$.`,
                  `特征根为 $${al} \\pm ${be === 1 ? "" : be}i$，且 $A = y(0) = ${p}$。`,
                ),
              ],
              [
                ["Use the slope", "用斜率"],
                t("", ""),
                [`y'(0) = ${cf(al)}A + ${cf(be)}B = ${q}`, `B = ${over(`${q} - ${par(al * p)}`, be)} = ${ans.toLatex()}`],
              ],
            ],
            t(
              `$${par(al)} \\cdot ${par(p)} + ${be} \\cdot ${parQ(ans)} = ${al * p} ${signed(q - al * p)} = ${q}$.`,
              `$${par(al)} \\cdot ${par(p)} + ${be} \\cdot ${parQ(ans)} = ${al * p} ${signed(q - al * p)} = ${q}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** secondOrderHomogeneousInitialValueProblems solves constant-coefficient IVPs. */
export const secondOrderHomogeneousInitialValueProblems: TopicDef = {
  id: "second-order-homogeneous-initial-value-problems",
  title: t("Second-Order Homogeneous Initial Value Problems", "二阶齐次常微分方程的初值问题"),
  summary: t(
    "The initial conditions $y(0) = y_0$ and $y'(0) = y_1$ determine the constants $c_1$ and $c_2$ in the solution of $y'' + by' + cy = 0$.",
    "初值条件 $y(0) = y_0$ 与 $y'(0) = y_1$ 唯一确定 $y'' + by' + cy = 0$ 通解中的常数 $c_1$ 与 $c_2$。",
  ),
  intro: t(
    "Solve $y'' + 9y = 0$ with $y(0) = 2$ and $y'(0) = 6$. The roots are $\\pm 3i$, so $y = A\\cos 3x + B\\sin 3x$. Then $y(0) = A = 2$ and $y'(0) = 3B = 6$, so $B = 2$ and $y = 2\\cos 3x + 2\\sin 3x$.\n\nCheck: $y'' = -18\\cos 3x - 18\\sin 3x = -9y$, and $y'(0) = 3 \\cdot 2 = 6$.\n\nIn this lesson we solve second-order homogeneous initial value problems from start to finish and evaluate the solutions.",
    "解 $y'' + 9y = 0$，$y(0) = 2$，$y'(0) = 6$。特征根为 $\\pm 3i$，所以 $y = A\\cos 3x + B\\sin 3x$。于是 $y(0) = A = 2$，$y'(0) = 3B = 6$，所以 $B = 2$，$y = 2\\cos 3x + 2\\sin 3x$。\n\n检验：$y'' = -18\\cos 3x - 18\\sin 3x = -9y$，且 $y'(0) = 3 \\cdot 2 = 6$。\n\n本课我们完整地求解二阶齐次初值问题，并对解求值。",
  ),
  prerequisites: ["second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots"],
  encompasses: [
    {
      topic: "second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "solving-second-order-homogeneous-ivp",
      title: t("Solving second-order homogeneous initial value problems", "求解二阶齐次线性初值问题"),
      explanation: t(
        "Write the general solution with two unknown constants, then use the two initial conditions to find both constants. For $y'' + \\omega^2 y = 0$ with $y(0) = y_0$ and $y'(0) = y_1$, the solution is $y(x) = y_0 \\cos(\\omega x) + \\frac{y_1}{\\omega} \\sin(\\omega x)$. For $y'' + 4y = 0$ with $y(0) = 1$ and $y'(0) = 6$ this is $y = \\cos 2x + 3\\sin 2x$.\n\n> **Watch out.** The derivative of $B\\sin(\\omega x)$ at $0$ is $\\omega B$, so $B$ is $y'(0)$ divided by $\\omega$, not $y'(0)$ itself.",
        "写出含两个未知常数的通解，再用两个初始条件求出这两个常数。对于简谐振动方程 $y'' + \\omega^2 y = 0$（初值 $y(0) = y_0, y'(0) = y_1$），特解为 $y(x) = y_0 \\cos(\\omega x) + \\frac{y_1}{\\omega} \\sin(\\omega x)$。对 $y'' + 4y = 0$，$y(0) = 1$，$y'(0) = 6$，解为 $y = \\cos 2x + 3\\sin 2x$。\n\n> **注意。** $B\\sin(\\omega x)$ 在 $0$ 处的导数是 $\\omega B$，所以 $B$ 等于 $y'(0)$ 除以 $\\omega$，而不是 $y'(0)$ 本身。",
      ),
      generate(rng: Rng): Problem {
        const omega = rng.int(2, 10);
        const y0 = rng.int(1, 8);
        const coeffSin = rng.int(1, 8);
        const y1 = coeffSin * omega;
        const ans = coeffSin;
        return numberProblem({
          prompt: t(
            `Solve the initial value problem $y'' + ${omega * omega}y = 0$ with $y(0) = ${y0}$ and $y'(0) = ${y1}$. The solution has the form $y(x) = A\\cos(${omega}x) + B\\sin(${omega}x)$. Find the coefficient $B$.`,
            `求解初值问题 $y'' + ${omega * omega}y = 0$，初值为 $y(0) = ${y0}$ 和 $y'(0) = ${y1}$。解具有形式 $y(x) = A\\cos(${omega}x) + B\\sin(${omega}x)$。求系数 $B$ 的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(y0, "That is $A = y(0)$, the cosine coefficient.", "这是余弦系数 $A = y(0)$。"),
            why(
              y1,
              `That takes $B$ as $y'(0)$; differentiating $\\sin(${omega}x)$ brings down a factor $${omega}$.`,
              `这是把 $B$ 当成 $y'(0)$；对 $\\sin(${omega}x)$ 求导会带下因子 $${omega}$。`,
            ),
            why(y1 * omega, `That multiplies $y'(0)$ by $${omega}$; divide by it instead.`, `这是把 $y'(0)$ 乘以 $${omega}$；应当除以它。`),
          ]),
          solution: walked(
            [
              [
                ["Differentiate the general solution", "对通解求导"],
                t("", ""),
                [`y' = -${omega}A\\sin(${omega}x) + ${omega}B\\cos(${omega}x)`],
              ],
              [["Use the slope at 0", "用 0 处的斜率"], t("", ""), [`y'(0) = ${omega}B = ${y1}`, `B = \\frac{${y1}}{${omega}} = ${ans}`]],
            ],
            t(
              `$y = ${y0 === 1 ? "" : y0}\\cos(${omega}x) + ${ans === 1 ? "" : ans}\\sin(${omega}x)$ has $y(0) = ${y0}$, $y'(0) = ${omega} \\cdot ${ans} = ${y1}$, and $y'' = -${omega * omega}y$.`,
              `$y = ${y0 === 1 ? "" : y0}\\cos(${omega}x) + ${ans === 1 ? "" : ans}\\sin(${omega}x)$ 满足 $y(0) = ${y0}$，$y'(0) = ${omega} \\cdot ${ans} = ${y1}$，且 $y'' = -${omega * omega}y$。`,
            ),
          ),
        });
      },
    },
    {
      id: "evaluating-the-solution-of-a-second-order-ivp",
      title: t("Evaluating the solution of a second-order initial value problem", "求二阶初值问题的解在某点的值"),
      explanation: t(
        "Solving an initial value problem ends with a function you can evaluate. Find the characteristic roots, fit the constants to $y(0)$ and $y'(0)$, and substitute. At $x = \\ln 2$ the exponentials turn into powers of two,\n\n$$e^{r\\ln 2} = 2^r,$$\n\nso $y(\\ln 2) = c_1 2^{r_1} + c_2 2^{r_2}$ is an exact rational number. For $y = 3e^{x} - e^{-x}$, $y(\\ln 2) = 6 - \\frac{1}{2} = \\frac{11}{2}$.\n\n> **Watch out.** $e^{r\\ln 2}$ is $2^{r}$, not $2^{-r}$; and keep each constant with its own root when you substitute.",
        "解初值问题的结果是一个可以求值的函数。先求特征根，再用 $y(0)$ 与 $y'(0)$ 确定常数，最后代入。在 $x = \\ln 2$ 处指数变成 $2$ 的幂，\n\n$$e^{r\\ln 2} = 2^r,$$\n\n所以 $y(\\ln 2) = c_1 2^{r_1} + c_2 2^{r_2}$ 是一个精确的有理数。对 $y = 3e^{x} - e^{-x}$，$y(\\ln 2) = 6 - \\frac{1}{2} = \\frac{11}{2}$。\n\n> **注意。** $e^{r\\ln 2}$ 是 $2^{r}$，而不是 $2^{-r}$；代入时每个常数要配它自己的根。",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.int(-3, 1);
        const r2 = r1 + rng.int(1, 3);
        const c1 = rng.int(-4, 4) || 2;
        const c2 = rng.int(-4, 4) || 1;
        const p = c1 + c2;
        const q = r1 * c1 + r2 * c2;
        const two = Q.of(2);
        const ans = Q.of(c1)
          .mul(two.pow(r1))
          .add(Q.of(c2).mul(two.pow(r2)));
        const e0 = (r: number) => (r === 0 ? "" : ex(r));
        const eq = poly([1, "y''"], [-(r1 + r2), "y'"], [r1 * r2, "y"]);
        return numberProblem({
          prompt: t(
            `Solve $${eq} = 0$ with $y(0) = ${p}$, $y'(0) = ${q}$, and find $y(\\ln 2)$.`,
            `解 $${eq} = 0$，$y(0) = ${p}$，$y'(0) = ${q}$，并求 $y(\\ln 2)$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(c2)
                .mul(two.pow(r1))
                .add(Q.of(c1).mul(two.pow(r2))),
              "That swaps the constants; each constant goes with its own root.",
              "这是把常数对调了；每个常数要配它自己的根。",
            ),
            why(
              Q.of(c1)
                .mul(two.pow(-r1))
                .add(Q.of(c2).mul(two.pow(-r2))),
              "That uses $2^{-r}$; $e^{r\\ln 2} = 2^{r}$.",
              "这是用了 $2^{-r}$；$e^{r\\ln 2} = 2^{r}$。",
            ),
            why(Q.of(p), "That is $y(0)$; the exponentials change the value at $\\ln 2$.", "这是 $y(0)$；指数函数会改变 $\\ln 2$ 处的值。"),
          ]),
          solution: walked(
            [
              [
                ["Fit the constants", "确定常数"],
                t(`The roots are $${r1}$ and $${r2}$, and the conditions give`, `特征根为 $${r1}$ 与 $${r2}$，条件给出`),
                [`c_1 + c_2 = ${p}`, `${poly([r1, "c_1"], [r2, "c_2"])} = ${q}`, `c_1 = ${c1}, \\quad c_2 = ${c2}`],
              ],
              [
                ["Evaluate at ln 2", "在 ln 2 处求值"],
                t("", ""),
                [
                  `y = ${poly([c1, e0(r1)], [c2, e0(r2)])}`,
                  `y(\\ln 2) = ${c1} \\cdot 2^{${r1}} + ${par(c2)} \\cdot 2^{${r2}} = ${ans.toLatex()}`,
                ],
              ],
            ],
            t(
              `$y(0) = ${c1} + ${par(c2)} = ${p}$ and $y'(0) = ${par(r1)} \\cdot ${par(c1)} + ${par(r2)} \\cdot ${par(c2)} = ${q}$, so the constants fit.`,
              `$y(0) = ${c1} + ${par(c2)} = ${p}$，$y'(0) = ${par(r1)} \\cdot ${par(c1)} + ${par(r2)} \\cdot ${par(c2)} = ${q}$，所以常数正确。`,
            ),
          ),
        });
      },
    },
  ],
};

/** secondOrderInhomogeneousOdesWithPolynomialForcing finds polynomial yp. */
export const secondOrderInhomogeneousOdesWithPolynomialForcing: TopicDef = {
  id: "second-order-inhomogeneous-odes-with-polynomial-forcing",
  title: t("Second-Order Inhomogeneous ODEs With Polynomial Forcing", "多项式激励下的二阶非齐次常微分方程"),
  summary: t(
    "For $y'' + by' + cy = P(x)$ with $c \\ne 0$, undetermined coefficients seeks a particular solution of the same degree: $y_p = A_n x^n + \\cdots + A_0$.",
    "当 $c \\ne 0$ 时，对 $y'' + by' + cy = P(x)$，待定系数法设同次多项式特解 $y_p = A_n x^n + \\cdots + A_0$。",
  ),
  intro: t(
    "Find a particular solution of $y'' + y' + 2y = 4x$. Try $y_p = Ax + B$: then $y_p'' + y_p' + 2y_p = A + 2Ax + 2B$. Matching $x$ terms gives $2A = 4$, so $A = 2$, and matching constants gives $A + 2B = 0$, so $B = -1$. Thus $y_p = 2x - 1$.\n\nCheck: $y_p'' = 0$, $y_p' = 2$ and $2y_p = 4x - 2$, which add to $4x$.\n\nIn this lesson we find polynomial particular solutions by undetermined coefficients, including the case where the equation has no $y$ term.",
    "求 $y'' + y' + 2y = 4x$ 的一个特解。设 $y_p = Ax + B$：则 $y_p'' + y_p' + 2y_p = A + 2Ax + 2B$。比较 $x$ 项得 $2A = 4$，所以 $A = 2$；比较常数项得 $A + 2B = 0$，所以 $B = -1$。于是 $y_p = 2x - 1$。\n\n检验：$y_p'' = 0$，$y_p' = 2$，$2y_p = 4x - 2$，相加得 $4x$。\n\n本课我们用待定系数法求多项式特解，包括方程不含 $y$ 项的情形。",
  ),
  prerequisites: ["second-order-homogeneous-initial-value-problems"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "undetermined-coefficients-polynomial",
      title: t("Undetermined coefficients for polynomial forcing", "多项式右端项的待定系数法"),
      explanation: t(
        "For a polynomial forcing term, guess a polynomial of the same degree, substitute it, and match the coefficients of each power. For $y'' + b y' + c y = K x$ with $c \\ne 0$, setting $y_p = A x + B$ gives $c A = K \\implies A = K / c$. For $y'' + 3y' + 4y = 8x$, $A = 2$, and the constants give $3A + 4B = 0$, so $B = -\\frac{3}{2}$.\n\n> **Watch out.** Only $cy_p$ produces an $x$ term, so $A$ is $K$ divided by the coefficient of $y$; the $y'$ term only affects $B$.",
        "对于多项式强迫项，猜测一个同次的多项式，代入后比较各次幂的系数。对于 $y'' + b y' + c y = K x$（$c \\ne 0$），设 $y_p = A x + B$ 代入可得最高次项系数满足 $c A = K \\implies A = K / c$。对 $y'' + 3y' + 4y = 8x$，$A = 2$，常数项给出 $3A + 4B = 0$，所以 $B = -\\frac{3}{2}$。\n\n> **注意。** 只有 $cy_p$ 产生 $x$ 项，所以 $A$ 等于 $K$ 除以 $y$ 的系数；$y'$ 项只影响 $B$。",
      ),
      generate(rng: Rng): Problem {
        const c = rng.int(2, 10);
        const A = rng.int(2, 12);
        const K = A * c;
        const b = rng.int(1, 6);
        const ans = A;
        const B = Q.of(-b * A, c);
        const eq = poly([1, "y''"], [b, "y'"], [c, "y"]);
        return numberProblem({
          prompt: t(
            `Find the coefficient $A$ of the linear term in the particular solution $y_p(x) = A x + B$ to the inhomogeneous ODE $${eq} = ${K}x$.`,
            `对于非齐次微分方程 $${eq} = ${K}x$，设其一次多项式特解为 $y_p(x) = A x + B$。求线性项系数 $A$ 的值。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              K,
              `That is the forcing coefficient itself; it equals $${c}A$, not $A$.`,
              `这是强迫项系数本身；它等于 $${c}A$，而不是 $A$。`,
            ),
            why(
              Q.of(K, b),
              "That divides by the coefficient of $y'$; the $x$ term comes from the $y$ term.",
              "这是除以 $y'$ 的系数；$x$ 项来自 $y$ 项。",
            ),
            why(Q.of(K, b + c), "That divides by $b + c$; the $y'$ term gives only a constant.", "这是除以 $b + c$；$y'$ 项只产生常数。"),
          ]),
          solution: walked(
            [
              [
                ["Substitute the trial", "代入试探解"],
                t("With $y_p' = A$ and $y_p'' = 0$:", "由 $y_p' = A$，$y_p'' = 0$："),
                [`0 + ${b === 1 ? "" : b}A + ${c}(Ax + B) = ${K}x`],
              ],
              [["Match the x terms", "比较 x 项"], t("", ""), [`${c}A = ${K}`, `A = \\frac{${K}}{${c}} = ${ans}`]],
            ],
            t(
              `The constants give $${b === 1 ? "" : b}A + ${c}B = 0$, so $B = ${B.toLatex()}$, and $y_p = ${poly([A, "x"], [B, ""])}$ gives $${b} \\cdot ${A} + ${c}\\left(${poly([A, "x"], [B, ""])}\\right) = ${K}x$.`,
              `常数项给出 $${b === 1 ? "" : b}A + ${c}B = 0$，所以 $B = ${B.toLatex()}$；$y_p = ${poly([A, "x"], [B, ""])}$ 给出 $${b} \\cdot ${A} + ${c}\\left(${poly([A, "x"], [B, ""])}\\right) = ${K}x$。`,
            ),
          ),
        });
      },
    },
    {
      id: "polynomial-forcing-without-a-y-term",
      title: t("Polynomial forcing without a y term", "缺少 y 项时的多项式强迫"),
      explanation: t(
        "If the equation has no $y$ term, as in $y'' + by' = mx + n$, then constants solve the homogeneous equation and a trial $Ax + B$ cannot work. Multiply the trial by $x$: $y_p = Ax^2 + Bx$. Then $y_p'' + by_p' = 2bAx + (2A + bB)$, and matching coefficients gives\n\n$$A = \\frac{m}{2b}, \\qquad B = \\frac{n - 2A}{b}.$$\n\nFor $y'' + 2y' = 4x + 6$: $4A = 4$, so $A = 1$, and $2 + 2B = 6$, so $B = 2$.\n\n> **Watch out.** $y_p'' = 2A$ also lands in the constant terms, so subtract $2A$ from $n$ before dividing by $b$.",
        "若方程不含 $y$ 项，例如 $y'' + by' = mx + n$，则常数是齐次方程的解，试探解 $Ax + B$ 行不通。把试探解乘以 $x$：$y_p = Ax^2 + Bx$。于是 $y_p'' + by_p' = 2bAx + (2A + bB)$，比较系数得\n\n$$A = \\frac{m}{2b}, \\qquad B = \\frac{n - 2A}{b}.$$\n\n对 $y'' + 2y' = 4x + 6$：$4A = 4$，所以 $A = 1$；$2 + 2B = 6$，所以 $B = 2$。\n\n> **注意。** $y_p'' = 2A$ 也落在常数项里，所以要先从 $n$ 中减去 $2A$，再除以 $b$。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        const m = rng.int(-8, 8) || 4;
        const n = rng.int(-8, 8);
        const A = Q.of(m, 2 * b);
        const B = Q.of(n)
          .sub(A.mul(Q.of(2)))
          .div(Q.of(b));
        const askA = rng.int(0, 1) === 0;
        const eq = poly([1, "y''"], [b, "y'"]);
        const rhs = poly([m, "x"], [n, ""]);
        return numberProblem({
          prompt: t(
            `Find the particular solution $y_p = Ax^2 + Bx$ of $${eq} = ${rhs}$ and give $${askA ? "A" : "B"}$.`,
            `求 $${eq} = ${rhs}$ 形如 $y_p = Ax^2 + Bx$ 的特解，并给出 $${askA ? "A" : "B"}$。`,
          ),
          answer: askA ? A : B,
          mistakes: askA
            ? apart(A, [
                why(Q.of(m, b), "That forgets the factor $2$ from differentiating $Ax^{2}$.", "这里忘了对 $Ax^{2}$ 求导产生的因子 $2$。"),
                why(
                  A.neg(),
                  "The sign is flipped; match $2bA$ with the coefficient of $x$ as it stands.",
                  "符号反了；要让 $2bA$ 直接等于 $x$ 的系数。",
                ),
                why(Q.of(m, 2), `That forgets to divide by $b = ${b}$.`, `这里忘了除以 $b = ${b}$。`),
              ])
            : apart(B, [
                why(Q.of(n, b), "That forgets the constant $2A$ that $y_p''$ contributes.", "这里忘了 $y_p''$ 贡献的常数 $2A$。"),
                why(
                  Q.of(n)
                    .add(A.mul(Q.of(2)))
                    .div(Q.of(b)),
                  "That adds $2A$ to the constant term; it has to be subtracted.",
                  "这是把 $2A$ 加到常数项上；应当减去它。",
                ),
                why(B.neg(), "The sign is flipped; recheck the division by $b$.", "符号反了；重新检查除以 $b$ 这一步。"),
              ]),
          solution: walked(
            [
              [
                ["Substitute the trial", "代入试探解"],
                t("With $y_p' = 2Ax + B$ and $y_p'' = 2A$:", "由 $y_p' = 2Ax + B$，$y_p'' = 2A$："),
                [`${poly([2 * b, "Ax"])} + \\left(${poly([2, "A"], [b, "B"])}\\right) = ${rhs}`],
              ],
              [
                ["Match coefficients", "比较系数"],
                t("", ""),
                [
                  `${2 * b}A = ${m} \\implies A = ${A.toLatex()}`,
                  `${poly([b, "B"])} = ${n} - 2 \\cdot ${parQ(A)} \\implies B = ${B.toLatex()}`,
                ],
              ],
            ],
            t(
              `$${2 * b} \\cdot ${parQ(A)} = ${m}$ and $2 \\cdot ${parQ(A)} + ${par(b)} \\cdot ${parQ(B)} = ${n}$, matching $${rhs}$.`,
              `$${2 * b} \\cdot ${parQ(A)} = ${m}$，$2 \\cdot ${parQ(A)} + ${par(b)} \\cdot ${parQ(B)} = ${n}$，与 $${rhs}$ 一致。`,
            ),
          ),
        });
      },
    },
  ],
};

/** secondOrderInhomogeneousOdesWithExponentialForcing finds exponential yp. */
export const secondOrderInhomogeneousOdesWithExponentialForcing: TopicDef = {
  id: "second-order-inhomogeneous-odes-with-exponential-forcing",
  title: t("Second-Order Inhomogeneous ODEs With Exponential Forcing", "指数激励下的二阶非齐次常微分方程"),
  summary: t(
    "For $y'' + by' + cy = Ke^{mx}$ where $m$ is not a characteristic root, the particular solution is $y_p = Ae^{mx}$ with $A = \\frac{K}{P(m)}$.",
    "对 $y'' + by' + cy = Ke^{mx}$，当 $m$ 不是特征根时，特解为 $y_p = Ae^{mx}$，其中 $A = \\frac{K}{P(m)}$。",
  ),
  intro: t(
    "Find a particular solution of $y'' - y = 6e^{2x}$. Try $y_p = Ae^{2x}$: then $y_p'' - y_p = (4 - 1)Ae^{2x} = 3Ae^{2x}$, so $3A = 6$ and $A = 2$.\n\nCheck: $y_p = 2e^{2x}$ gives $8e^{2x} - 2e^{2x} = 6e^{2x}$.\n\nIn this lesson we find exponential particular solutions, and see what to do when the exponent is a root of the characteristic equation.",
    "求 $y'' - y = 6e^{2x}$ 的一个特解。设 $y_p = Ae^{2x}$：则 $y_p'' - y_p = (4 - 1)Ae^{2x} = 3Ae^{2x}$，所以 $3A = 6$，$A = 2$。\n\n检验：$y_p = 2e^{2x}$ 给出 $8e^{2x} - 2e^{2x} = 6e^{2x}$。\n\n本课我们求指数型特解，并看看当指数是特征方程的根时该怎么办。",
  ),
  prerequisites: ["second-order-inhomogeneous-odes-with-polynomial-forcing"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "undetermined-coefficients-exponential",
      title: t("Undetermined coefficients for exponential forcing", "指数右端项的待定系数法"),
      explanation: t(
        "The operator turns the exponential guess into the polynomial value times the exponential, so the coefficient is the forcing constant divided by that value. Applying $P(D)$ to $A e^{mx}$ gives $A P(m) e^{mx} = K e^{mx} \\implies A = \\frac{K}{P(m)}$. For $y'' + y' + 2y = 16e^{2x}$, $P(2) = 4 + 2 + 2 = 8$, so $A = 2$.\n\n> **Watch out.** $P(m)$ includes every term, $m^{2} + bm + c$; dropping $bm$ or forgetting to divide $K$ by $P(m)$ gives the wrong amplitude.",
        "算子把指数型猜测变成多项式的值乘以指数函数，所以系数等于强迫常数除以这个值。将特征算子 $P(D)$ 作用于 $A e^{mx}$ 得 $A P(m) e^{mx} = K e^{mx} \\implies A = \\frac{K}{P(m)}$。对 $y'' + y' + 2y = 16e^{2x}$，$P(2) = 4 + 2 + 2 = 8$，所以 $A = 2$。\n\n> **注意。** $P(m)$ 包含所有项 $m^{2} + bm + c$；漏掉 $bm$ 或忘了用 $P(m)$ 去除 $K$，都会得到错误的振幅。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(1, 4);
        const b = rng.int(1, 5);
        const c = rng.int(1, 6);
        const Pm = m * m + b * m + c;
        const A = rng.int(2, 10);
        const K = A * Pm;
        const ans = A;
        const em = ex(m);
        const eq = poly([1, "y''"], [b, "y'"], [c, "y"]);
        return numberProblem({
          prompt: t(
            `Find the amplitude $A$ of the particular solution $y_p(x) = A${em}$ to the differential equation $${eq} = ${K}${em}$.`,
            `求微分方程 $${eq} = ${K}${em}$ 的特解 $y_p(x) = A${em}$ 的振幅系数 $A$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(K, `That is the forcing constant; it still has to be divided by $P(${m})$.`, `这是强迫常数；还要除以 $P(${m})$。`),
            why(Pm, `That is $P(${m})$ itself; $A$ is the forcing constant divided by it.`, `这是 $P(${m})$ 本身；$A$ 是强迫常数除以它。`),
            why(
              Q.of(K, m * m + c),
              `That leaves the term $${b} \\cdot ${m}$ out of $P(${m})$.`,
              `这是在 $P(${m})$ 中漏掉了 $${b} \\cdot ${m}$ 这一项。`,
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute the trial", "代入试探解"],
                t(
                  `With $y_p' = ${m === 1 ? "" : m}A${em}$ and $y_p'' = ${m * m === 1 ? "" : m * m}A${em}$:`,
                  `由 $y_p' = ${m === 1 ? "" : m}A${em}$，$y_p'' = ${m * m === 1 ? "" : m * m}A${em}$：`,
                ),
                [`(${m * m} + ${b} \\cdot ${m} + ${c})A${em} = ${K}${em}`],
              ],
              [["Divide", "相除"], t("", ""), [`P(${m}) = ${Pm}`, `A = \\frac{${K}}{${Pm}} = ${ans}`]],
            ],
            t(
              `$${ans} \\cdot ${Pm} = ${K}$, so $y_p = ${ans}${em}$ produces exactly $${K}${em}$.`,
              `$${ans} \\cdot ${Pm} = ${K}$，所以 $y_p = ${ans}${em}$ 恰好产生 $${K}${em}$。`,
            ),
          ),
        });
      },
    },
    {
      id: "exponential-forcing-at-a-characteristic-root",
      title: t("Exponential forcing at a characteristic root", "强迫项指数等于特征根"),
      explanation: t(
        "For $y'' + by' + cy = ke^{rx}$ the trial $Ae^{rx}$ gives $A\\,P(r) = k$ with $P(r) = r^2 + br + c$. When $r$ is a simple root of $P$ this fails, because $e^{rx}$ solves the homogeneous equation. Use $y_p = Axe^{rx}$ instead; substituting leaves\n\n$$A\\,P'(r) = k, \\qquad A = \\frac{k}{2r + b}.$$\n\nFor $y'' - 3y' + 2y = 5e^{2x}$, $r = 2$ is a root and $P'(2) = 4 - 3 = 1$, so $A = 5$.\n\n> **Watch out.** $P'(r) = 2r + b$ keeps the coefficient $b$ with its sign; using $2r$ alone, or flipping the sign of $b$, gives a wrong $A$.",
        "对 $y'' + by' + cy = ke^{rx}$，试探解 $Ae^{rx}$ 给出 $A\\,P(r) = k$，其中 $P(r) = r^2 + br + c$。当 $r$ 是 $P$ 的单根时这行不通，因为 $e^{rx}$ 是齐次方程的解。改用 $y_p = Axe^{rx}$；代入后剩下\n\n$$A\\,P'(r) = k, \\qquad A = \\frac{k}{2r + b}.$$\n\n对 $y'' - 3y' + 2y = 5e^{2x}$，$r = 2$ 是根，$P'(2) = 4 - 3 = 1$，所以 $A = 5$。\n\n> **注意。** $P'(r) = 2r + b$ 中系数 $b$ 要带着符号；只用 $2r$，或把 $b$ 的符号弄反，都会得到错误的 $A$。",
      ),
      generate(rng: Rng): Problem {
        const r = rng.pick([-3, -2, -1, 1, 2, 3]);
        const s = rng.pick([-4, -2, -1, 0, 1, 3, 4].filter((v) => v !== r));
        const k = rng.int(-9, 9) || 6;
        const ans = Q.of(k, r - s);
        const er = ex(r);
        const bb = -(r + s);
        const fac = (v: number) => (v === 0 ? "r" : v < 0 ? `(r + ${-v})` : `(r - ${v})`);
        const eq = poly([1, "y''"], [bb, "y'"], [r * s, "y"]);
        return numberProblem({
          prompt: t(
            `Find $A$ in the particular solution $y_p = Ax${er}$ of $${eq} = ${poly([k, er])}$.`,
            `求 $${eq} = ${poly([k, er])}$ 的特解 $y_p = Ax${er}$ 中的 $A$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              Q.of(k, 2 * r),
              `That uses $P'(${r}) = ${2 * r}$ and leaves out the coefficient $${bb}$ of $y'$.`,
              `这是用了 $P'(${r}) = ${2 * r}$，漏掉了 $y'$ 的系数 $${bb}$。`,
            ),
            why(ans.neg(), "The sign is flipped; recheck $P'(r) = 2r + b$.", "符号反了；重新检查 $P'(r) = 2r + b$。"),
            ...(2 * r - bb !== 0
              ? [why(Q.of(k, 2 * r - bb), "That uses $2r - b$; the derivative of $br$ is $+b$.", "这是用了 $2r - b$；$br$ 的导数是 $+b$。")]
              : []),
          ]),
          solution: walked(
            [
              [
                ["See why the plain trial fails", "看出普通试探解为何失效"],
                t(
                  `$P(r) = ${poly([1, "r^2"], [bb, "r"], [r * s, ""])} = ${fac(r)}${fac(s)}$ has the root $${r}$, so $${er}$ solves the homogeneous equation.`,
                  `$P(r) = ${poly([1, "r^2"], [bb, "r"], [r * s, ""])} = ${fac(r)}${fac(s)}$ 以 $${r}$ 为根，所以 $${er}$ 是齐次方程的解。`,
                ),
              ],
              [
                ["Use the derivative of P", "用 P 的导数"],
                t("", ""),
                [
                  `P'(${r}) = ${2 * r} ${signed(bb)} = ${r - s}`,
                  r - s === 1 ? `A = ${k}` : `A = \\frac{${k}}{${r - s}}${lowestTerms(k, r - s)}`,
                ],
              ],
            ],
            t(
              `Substituting $y_p = Ax${er}$ gives $A\\left(P'(${r}) + xP(${r})\\right)${er}$; the $x$ term vanishes because $P(${r}) = 0$, leaving $${cf(r - s)}A = ${k}$.`,
              `代入 $y_p = Ax${er}$ 得 $A\\left(P'(${r}) + xP(${r})\\right)${er}$；因为 $P(${r}) = 0$，$x$ 项消失，剩下 $${cf(r - s)}A = ${k}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** secondOrderInhomogeneousOdesWithSinusoidalForcing finds sinusoidal yp. */
export const secondOrderInhomogeneousOdesWithSinusoidalForcing: TopicDef = {
  id: "second-order-inhomogeneous-odes-with-sinusoidal-forcing",
  title: t("Second-Order Inhomogeneous ODEs With Sinusoidal Forcing", "正弦激励下的二阶非齐次常微分方程"),
  summary: t(
    "For $y'' + \\omega_0^2 y = F_0 \\cos \\omega x$ with $\\omega \\ne \\omega_0$, the particular solution is $y_p = \\frac{F_0}{\\omega_0^2 - \\omega^2} \\cos \\omega x$.",
    "对 $y'' + \\omega_0^2 y = F_0 \\cos \\omega x$（$\\omega \\ne \\omega_0$），特解为 $y_p = \\frac{F_0}{\\omega_0^2 - \\omega^2} \\cos \\omega x$。",
  ),
  intro: t(
    "Find a particular solution of $y'' + 4y = 6\\cos x$. Try $y_p = A\\cos x$: then $y_p'' = -A\\cos x$, so $(-1 + 4)A\\cos x = 6\\cos x$, giving $A = 2$.\n\nCheck: $y_p = 2\\cos x$ gives $-2\\cos x + 8\\cos x = 6\\cos x$.\n\nIn this lesson we find sinusoidal particular solutions, first without damping and then with a $y'$ term, which brings in a sine part.",
    "求 $y'' + 4y = 6\\cos x$ 的一个特解。设 $y_p = A\\cos x$：则 $y_p'' = -A\\cos x$，所以 $(-1 + 4)A\\cos x = 6\\cos x$，得 $A = 2$。\n\n检验：$y_p = 2\\cos x$ 给出 $-2\\cos x + 8\\cos x = 6\\cos x$。\n\n本课我们求正弦型特解，先看无阻尼的情形，再看带 $y'$ 项的情形，此时会出现正弦部分。",
  ),
  prerequisites: ["second-order-inhomogeneous-odes-with-exponential-forcing"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "undetermined-coefficients-sinusoidal",
      title: t("Undetermined coefficients for sinusoidal forcing", "正弦三角函数右端项的待定系数法"),
      explanation: t(
        "A sinusoidal forcing term calls for a sinusoidal guess at the same frequency, and without damping a cosine guess alone is enough. For $y'' + \\omega_0^2 y = F_0 \\cos(\\omega x)$, substituting $y_p = A \\cos(\\omega x)$ yields $(-\\omega^2 + \\omega_0^2) A = F_0 \\implies A = \\frac{F_0}{\\omega_0^2 - \\omega^2}$. For $y'' + 9y = 10\\cos 2x$, $A = \\frac{10}{9 - 4} = 2$.\n\n> **Watch out.** Differentiating a cosine twice gives $-\\omega^{2}$, so the denominator is $\\omega_0^{2} - \\omega^{2}$, a difference, not a sum.",
        "正弦型强迫项要求猜测同频率的正弦型解，在无阻尼时只需猜测余弦即可。对于 $y'' + \\omega_0^2 y = F_0 \\cos(\\omega x)$，代入 $y_p = A \\cos(\\omega x)$ 得 $(-\\omega^2 + \\omega_0^2) A = F_0 \\implies A = \\frac{F_0}{\\omega_0^2 - \\omega^2}$。对 $y'' + 9y = 10\\cos 2x$，$A = \\frac{10}{9 - 4} = 2$。\n\n> **注意。** 余弦求两次导得到 $-\\omega^{2}$，所以分母是差 $\\omega_0^{2} - \\omega^{2}$，而不是和。",
      ),
      generate(rng: Rng): Problem {
        const omega = rng.int(1, 4);
        const omega0 = rng.int(omega + 1, omega + 5);
        const denom = omega0 * omega0 - omega * omega;
        const A = rng.int(2, 10);
        const F0 = A * denom;
        const ans = A;
        const wx = poly([omega, "x"]);
        return numberProblem({
          prompt: t(
            `Find the amplitude $A$ of the particular solution $y_p(x) = A \\cos(${wx})$ to the differential equation $y'' + ${omega0 * omega0}y = ${F0}\\cos(${wx})$.`,
            `求微分方程 $y'' + ${omega0 * omega0}y = ${F0}\\cos(${wx})$ 的特解 $y_p(x) = A \\cos(${wx})$ 的振幅系数 $A$。`,
          ),
          answer: ans,
          mistakes: apart(ans, [
            why(
              F0,
              `That is the forcing amplitude; it still has to be divided by $${omega0 * omega0} - ${omega * omega}$.`,
              `这是强迫振幅；还要除以 $${omega0 * omega0} - ${omega * omega}$。`,
            ),
            why(
              denom,
              `That is the factor $${omega0 * omega0} - ${omega * omega}$ itself; $A$ is the forcing amplitude divided by it.`,
              `这是因子 $${omega0 * omega0} - ${omega * omega}$ 本身；$A$ 是强迫振幅除以它。`,
            ),
            why(
              Q.of(F0, omega0 * omega0 + omega * omega),
              "That treats $y_p''$ as $+\\omega^{2}y_p$; differentiating a cosine twice changes the sign.",
              "这是把 $y_p''$ 当成 $+\\omega^{2}y_p$；余弦求两次导会变号。",
            ),
          ]),
          solution: walked(
            [
              [
                ["Substitute the trial", "代入试探解"],
                t("", ""),
                [
                  `y_p'' = ${poly([-omega * omega, "A"])}\\cos(${wx})`,
                  `(${-omega * omega} + ${omega0 * omega0})A\\cos(${wx}) = ${F0}\\cos(${wx})`,
                ],
              ],
              [["Divide", "相除"], t("", ""), [`${denom}A = ${F0}`, `A = \\frac{${F0}}{${denom}} = ${ans}`]],
            ],
            t(
              `$y_p = ${ans}\\cos(${wx})$ gives $${-ans * omega * omega}\\cos(${wx}) + ${ans * omega0 * omega0}\\cos(${wx}) = ${F0}\\cos(${wx})$.`,
              `$y_p = ${ans}\\cos(${wx})$ 给出 $${-ans * omega * omega}\\cos(${wx}) + ${ans * omega0 * omega0}\\cos(${wx}) = ${F0}\\cos(${wx})$。`,
            ),
          ),
        });
      },
    },
    {
      id: "the-sine-coefficient-under-damped-forcing",
      title: t("The sine coefficient under damped forcing", "有阻尼时强迫响应的正弦系数"),
      explanation: t(
        "With a $y'$ term, a cosine forcing produces both a cosine and a sine. For $y'' + by' + cy = k\\cos \\omega x$, try $y_p = A\\cos \\omega x + B\\sin \\omega x$ and match the cosine and sine terms:\n\n$$(c - \\omega^2)A + b\\omega B = k, \\qquad -b\\omega A + (c - \\omega^2)B = 0.$$\n\nSolving, $A = \\frac{k(c - \\omega^2)}{(c - \\omega^2)^2 + b^2\\omega^2}$ and $B = \\frac{kb\\omega}{(c - \\omega^2)^2 + b^2\\omega^2}$. For $y'' + 2y' + 2y = 5\\cos x$: $c - \\omega^{2} = 1$, $b\\omega = 2$, the denominator is $5$, so $A = 1$ and $B = 2$.\n\n> **Watch out.** The denominator is a sum of two squares, $(c - \\omega^{2})^{2} + (b\\omega)^{2}$; dividing $k$ by $b\\omega$ alone ignores the coupling between the two equations.",
        "有 $y'$ 项时，余弦强迫会同时产生余弦和正弦。对 $y'' + by' + cy = k\\cos \\omega x$，设 $y_p = A\\cos \\omega x + B\\sin \\omega x$，比较余弦项与正弦项：\n\n$$(c - \\omega^2)A + b\\omega B = k, \\qquad -b\\omega A + (c - \\omega^2)B = 0.$$\n\n解得 $A = \\frac{k(c - \\omega^2)}{(c - \\omega^2)^2 + b^2\\omega^2}$，$B = \\frac{kb\\omega}{(c - \\omega^2)^2 + b^2\\omega^2}$。对 $y'' + 2y' + 2y = 5\\cos x$：$c - \\omega^{2} = 1$，$b\\omega = 2$，分母为 $5$，所以 $A = 1$，$B = 2$。\n\n> **注意。** 分母是两个平方之和 $(c - \\omega^{2})^{2} + (b\\omega)^{2}$；只用 $b\\omega$ 去除 $k$ 就忽略了两个方程之间的耦合。",
      ),
      generate(rng: Rng): Problem {
        const b = rng.int(1, 4);
        const w = rng.int(1, 3);
        const c = rng.int(1, 12);
        const k = rng.int(1, 9) * 5;
        const d = c - w * w;
        const den = d * d + b * b * w * w;
        const askB = rng.int(0, 1) === 0;
        const A = Q.of(k * d, den);
        const B = Q.of(k * b * w, den);
        const wx = w === 1 ? "x" : `${w}x`;
        const eq = poly([1, "y''"], [b, "y'"], [c, "y"]);
        const ans = askB ? B : A;
        return numberProblem({
          prompt: t(
            `Find $${askB ? "B" : "A"}$ in the particular solution $y_p = A\\cos ${wx} + B\\sin ${wx}$ of $${eq} = ${k}\\cos ${wx}$.`,
            `求 $${eq} = ${k}\\cos ${wx}$ 的特解 $y_p = A\\cos ${wx} + B\\sin ${wx}$ 中的 $${askB ? "B" : "A"}$。`,
          ),
          answer: ans,
          mistakes: askB
            ? apart(B, [
                why(A, "That is the cosine coefficient $A$.", "这是余弦系数 $A$。"),
                why(
                  B.neg(),
                  "The sign is flipped; recheck the sign of $-b\\omega A$ in the sine equation.",
                  "符号反了；重新检查正弦方程中 $-b\\omega A$ 的符号。",
                ),
                why(
                  Q.of(k, b * w),
                  "That divides $k$ by $b\\omega$ alone; the two equations are coupled.",
                  "这是只用 $b\\omega$ 去除 $k$；两个方程是耦合的。",
                ),
              ])
            : apart(A, [
                why(B, "That is the sine coefficient $B$.", "这是正弦系数 $B$。"),
                ...(d !== 0
                  ? [
                      why(
                        Q.of(k, d),
                        "That ignores the damping term; the $y'$ term couples $A$ to $B$.",
                        "这是忽略了阻尼项；$y'$ 项使 $A$ 与 $B$ 耦合。",
                      ),
                    ]
                  : []),
                why(A.neg(), "The sign is flipped; recheck $c - \\omega^{2}$.", "符号反了；重新检查 $c - \\omega^{2}$。"),
              ]),
          solution: walked(
            [
              [
                ["Match the cosine and sine terms", "比较余弦项与正弦项"],
                t(`Here $c - \\omega^2 = ${d}$ and $b\\omega = ${b * w}$:`, `这里 $c - \\omega^2 = ${d}$，$b\\omega = ${b * w}$：`),
                [`${poly([d, "A"], [b * w, "B"])} = ${k}`, `${poly([-b * w, "A"], [d, "B"])} = 0`],
              ],
              [
                ["Solve the system", "解方程组"],
                t(`The denominator is $${par(d)}^{2} + ${b * w}^{2} = ${den}$.`, `分母为 $${par(d)}^{2} + ${b * w}^{2} = ${den}$。`),
                [`A = ${over(`${k} \\cdot ${par(d)}`, den)} = ${A.toLatex()}`, `B = ${over(`${k} \\cdot ${b * w}`, den)} = ${B.toLatex()}`],
              ],
            ],
            t(
              `$${par(d)} \\cdot ${parQ(A)} + ${b * w} \\cdot ${parQ(B)} = ${k}$ and $${-b * w} \\cdot ${parQ(A)} + ${par(d)} \\cdot ${parQ(B)} = 0$.`,
              `$${par(d)} \\cdot ${parQ(A)} + ${b * w} \\cdot ${parQ(B)} = ${k}$，$${-b * w} \\cdot ${parQ(A)} + ${par(d)} \\cdot ${parQ(B)} = 0$。`,
            ),
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 3.10 The Cauchy-Euler Equations
// ---------------------------------------------------------------------------

/** cauchyEulerEquationsCharacteristicEquationsWithDistinctRealRoots solves distinct m. */
export const cauchyEulerEquationsCharacteristicEquationsWithDistinctRealRoots: TopicDef = {
  id: "cauchy-euler-equations-characteristic-equations-with-distinct-real-roots",
  title: t("Cauchy-Euler Equations: Characteristic Equations With Distinct Real Roots", "柯西-欧拉方程：具有不同实根的特征方程"),
  summary: t(
    "Substituting $y = x^m$ into $x^2 y'' + axy' + by = 0$ gives $m(m - 1) + am + b = 0$ and power solutions $y = c_1 x^{m_1} + c_2 x^{m_2}$.",
    "将 $y = x^m$ 代入 $x^2 y'' + axy' + by = 0$ 得 $m(m - 1) + am + b = 0$，从而得到幂函数通解 $y = c_1 x^{m_1} + c_2 x^{m_2}$。",
  ),
  prerequisites: ["second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots"],
  encompasses: [
    {
      topic: "second-order-homogeneous-odes-characteristic-equations-with-distinct-real-roots",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "cauchy-euler-distinct-real-roots",
      title: t("Indicial equation with distinct real roots", "柯西-欧拉方程的互异实指标根"),
      explanation: t(
        "In a Cauchy Euler equation each power of the variable matches the order of the derivative, so a power of the variable is the natural trial solution. For $x^2 y'' + a x y' + b y = 0$, the indicial equation is $m^2 + (a - 1)m + b = 0$.",
        "在柯西-欧拉方程中，变量的幂次与导数的阶数相对应，所以变量的幂是自然的试探解。对于柯西-欧拉方程 $x^2 y'' + a x y' + b y = 0$，指标特征方程为 $m^2 + (a - 1)m + b = 0$。",
      ),
      generate(rng: Rng): Problem {
        const m1 = rng.int(1, 6);
        const m2 = rng.int(m1 + 1, m1 + 8);
        // m^2 + (a - 1)m + b = (m - m1)(m - m2) = m^2 - (m1 + m2)m + m1*m2
        // so a - 1 = -(m1 + m2) => a = 1 - (m1 + m2)
        // or pick roots of m^2 + A m + B with positive coefficients
        // Let m1, m2 be positive, let indicial eq be (m - m1)(m - m2) = m^2 - (m1+m2)m + m1*m2
        // Then a = 1 - (m1 + m2), b = m1 * m2
        const aCoeff = 1 - (m1 + m2);
        const bCoeff = m1 * m2;
        const ans = m2; // larger root

        const prompt = t(
          `Find the larger power exponent $m$ in the fundamental solutions $y = x^m$ to the Cauchy-Euler differential equation $x^2 y'' ${aCoeff < 0 ? `- ${-aCoeff}` : `+ ${aCoeff}`}x y' + ${bCoeff}y = 0$ (for $x > 0$).`,
          `求柯西-欧拉微分方程 $x^2 y'' ${aCoeff < 0 ? `- ${-aCoeff}` : `+ ${aCoeff}`}x y' + ${bCoeff}y = 0$（$x > 0$）的基本解 $y = x^m$ 中较大的幂指数 $m$。`,
        );
        const solution = t(
          steps(
            `Substitute $y = x^m$: $y' = m x^{m-1}$ and $y'' = m(m-1)x^{m-2}$.`,
            `Plug into the equation: $x^2 [m(m-1)x^{m-2}] + (${aCoeff})x [m x^{m-1}] + ${bCoeff}x^m = 0$.`,
            `Divide by $x^m$: $m(m-1) + (${aCoeff})m + ${bCoeff} = 0 \\implies m^2 - ${m1 + m2}m + ${bCoeff} = 0$.`,
            `Factor: $(m - ${m1})(m - ${m2}) = 0$, giving roots $m = ${m1}$ and $m = ${m2}$.`,
            `The larger exponent is $m = ${ans}$.`,
          ),
          steps(
            `代入解的形式 $y = x^m$：$y' = m x^{m-1}$，$y'' = m(m-1)x^{m-2}$。`,
            `代入方程：$x^2 [m(m-1)x^{m-2}] + (${aCoeff})x [m x^{m-1}] + ${bCoeff}x^m = 0$。`,
            `同除以 $x^m$：$m(m-1) + (${aCoeff})m + ${bCoeff} = 0 \\implies m^2 - ${m1 + m2}m + ${bCoeff} = 0$。`,
            `因式分解：$(m - ${m1})(m - ${m2}) = 0$，解得指标根 $m = ${m1}$ 与 $m = ${m2}$。`,
            `其中较大的幂指数为 $m = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [m1, m1 + m2, bCoeff],
        });
      },
    },
    {
      id: "evaluating-a-cauchy-euler-initial-value-problem",
      title: t("Evaluating a Cauchy-Euler initial value problem", "求柯西-欧拉初值问题的解在某点的值"),
      explanation: t(
        "For $x^2y'' + axy' + by = 0$ the trial $y = x^m$ gives the indicial equation $m(m - 1) + am + b = 0$. With distinct real roots, $y = c_1x^{m_1} + c_2x^{m_2}$. Initial conditions are usually given at $x = 1$, where every power equals $1$:\n\n$$c_1 + c_2 = y(1), \\qquad m_1c_1 + m_2c_2 = y'(1).$$",
        "对 $x^2y'' + axy' + by = 0$，试探解 $y = x^m$ 给出指标方程 $m(m - 1) + am + b = 0$。当它有互异实根时，$y = c_1x^{m_1} + c_2x^{m_2}$。初始条件通常在 $x = 1$ 处给出，那里每个幂都等于 $1$：\n\n$$c_1 + c_2 = y(1), \\qquad m_1c_1 + m_2c_2 = y'(1).$$",
      ),
      generate(rng: Rng): Problem {
        const m1 = rng.int(-3, 1);
        const m2 = m1 + rng.int(1, 3);
        const c1 = rng.int(-4, 4) || 3;
        const c2 = rng.int(-4, 4) || -1;
        const a = 1 - m1 - m2;
        const b = m1 * m2;
        const p = c1 + c2;
        const q = m1 * c1 + m2 * c2;
        const two = Q.of(2);
        const ans = Q.of(c1)
          .mul(two.pow(m1))
          .add(Q.of(c2).mul(two.pow(m2)));
        return numberProblem({
          prompt: t(
            `Solve $${poly([1, "x^2y''"], [a, "xy'"], [b, "y"])} = 0$ for $x > 0$ with $y(1) = ${p}$, $y'(1) = ${q}$, and find $y(2)$.`,
            `在 $x > 0$ 上解 $${poly([1, "x^2y''"], [a, "xy'"], [b, "y"])} = 0$，$y(1) = ${p}$，$y'(1) = ${q}$，并求 $y(2)$。`,
          ),
          answer: ans,
          wrong: [
            Q.of(c2)
              .mul(two.pow(m1))
              .add(Q.of(c1).mul(two.pow(m2))),
            Q.of(p),
            Q.of(c1 * 2 * m1 + c2 * 2 * m2),
          ],
          solution: t(
            steps(
              `The indicial equation $${poly([1, "m^2"], [a - 1, "m"], [b, ""])} = 0$ has roots $${m1}$ and $${m2}$.`,
              `$c_1 + c_2 = ${p}$ and $${poly([m1, "c_1"], [m2, "c_2"])} = ${q}$ give $c_1 = ${c1}$, $c_2 = ${c2}$, so $y(2) = ${c1} \\cdot 2^{${m1}} + ${par(c2)} \\cdot 2^{${m2}} = ${ans.toLatex()}$.`,
            ),
            steps(
              `指标方程 $${poly([1, "m^2"], [a - 1, "m"], [b, ""])} = 0$ 的根为 $${m1}$ 与 $${m2}$。`,
              `由 $c_1 + c_2 = ${p}$ 与 $${poly([m1, "c_1"], [m2, "c_2"])} = ${q}$ 得 $c_1 = ${c1}$，$c_2 = ${c2}$，所以 $y(2) = ${c1} \\cdot 2^{${m1}} + ${par(c2)} \\cdot 2^{${m2}} = ${ans.toLatex()}$。`,
            ),
          ),
        });
      },
    },
  ],
};

/** cauchyEulerEquationsCharacteristicEquationsWithRepeatedRoots solves double m. */
export const cauchyEulerEquationsCharacteristicEquationsWithRepeatedRoots: TopicDef = {
  id: "cauchy-euler-equations-characteristic-equations-with-repeated-roots",
  title: t("Cauchy-Euler Equations: Characteristic Equations With Repeated Roots", "柯西-欧拉方程：具有重根的特征方程"),
  summary: t(
    "When the indicial equation has a repeated root $m$, the general solution is $y = (c_1 + c_2 \\ln x)x^m$.",
    "当指标方程有二重根 $m$ 时，通解为 $y = (c_1 + c_2 \\ln x)x^m$。",
  ),
  prerequisites: ["cauchy-euler-equations-characteristic-equations-with-distinct-real-roots"],
  encompasses: [
    {
      topic: "cauchy-euler-equations-characteristic-equations-with-distinct-real-roots",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "cauchy-euler-repeated-roots",
      title: t("Indicial equation with repeated roots", "柯西-欧拉方程的二重指标根"),
      explanation: t(
        "With a repeated root, the second solution is the first one multiplied by the logarithm of the variable. For $(m - k)^2 = 0$, the repeated root is $m = k$. The second independent solution incorporates a logarithmic factor: $y_2 = x^k \\ln x$.",
        "当有重根时，第二个解是第一个解乘以变量的对数。对于 $(m - k)^2 = 0$，二重指标根为 $m = k$。第二个线性无关解引入对数因子：$y_2 = x^k \\ln x$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(1, 35);
        // (m - k)^2 = m^2 - 2k m + k^2
        // a - 1 = -2k => a = 1 - 2k
        const aCoeff = 1 - 2 * k;
        const bCoeff = k * k;
        const ans = k;

        const prompt = t(
          `Find the repeated power root $m$ of the indicial equation for $x^2 y'' ${aCoeff < 0 ? `- ${-aCoeff}` : `+ ${aCoeff}`}x y' + ${bCoeff}y = 0$.`,
          `求柯西-欧拉微分方程 $x^2 y'' ${aCoeff < 0 ? `- ${-aCoeff}` : `+ ${aCoeff}`}x y' + ${bCoeff}y = 0$ 的指标特征方程二重根 $m$。`,
        );
        const solution = t(
          steps(
            `The indicial equation is $m(m-1) + (${aCoeff})m + ${bCoeff} = 0$.`,
            `Simplify: $m^2 - ${2 * k}m + ${bCoeff} = (m - ${k})^2 = 0$.`,
            `The repeated root is $m = ${ans}$.`,
          ),
          steps(
            `写出指标特征方程：$m(m-1) + (${aCoeff})m + ${bCoeff} = 0$。`,
            `整理化简：$m^2 - ${2 * k}m + ${bCoeff} = (m - ${k})^2 = 0$。`,
            `求得二重指标根为 $m = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [2 * k, bCoeff, ans + 1],
        });
      },
    },
    {
      id: "solving-a-cauchy-euler-ivp-with-a-repeated-root",
      title: t("Solving a Cauchy-Euler initial value problem with a repeated root", "求解指标方程有重根的柯西-欧拉初值问题"),
      explanation: t(
        "A repeated indicial root $m$ gives $y = x^m(c_1 + c_2\\ln x)$. At $x = 1$, $\\ln 1 = 0$, so $y(1) = c_1$. Differentiating,\n\n$$y' = mx^{m - 1}(c_1 + c_2\\ln x) + c_2x^{m - 1}, \\qquad y'(1) = mc_1 + c_2.$$\n\nSo the coefficient of $x^m\\ln x$ is $c_2 = y'(1) - m\\,y(1)$. The logarithm plays the part that the extra factor $x$ plays for a repeated root of a constant-coefficient equation, because the substitution $x = e^t$ turns $\\ln x$ into $t$.",
        "指标方程的重根 $m$ 给出 $y = x^m(c_1 + c_2\\ln x)$。在 $x = 1$ 处 $\\ln 1 = 0$，所以 $y(1) = c_1$。求导得\n\n$$y' = mx^{m - 1}(c_1 + c_2\\ln x) + c_2x^{m - 1}, \\qquad y'(1) = mc_1 + c_2.$$\n\n所以 $x^m\\ln x$ 的系数为 $c_2 = y'(1) - m\\,y(1)$。对数所起的作用，相当于常系数方程重根时多出的因子 $x$，因为代换 $x = e^t$ 把 $\\ln x$ 变成 $t$。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
        const p = rng.int(-5, 5) || 2;
        const q = rng.int(-8, 8);
        const ans = q - m * p;
        const xm = m === 1 ? "x" : `x^{${m}}`;
        return numberProblem({
          prompt: t(
            `Solve $${poly([1, "x^2y''"], [1 - 2 * m, "xy'"], [m * m, "y"])} = 0$ for $x > 0$ with $y(1) = ${p}$, $y'(1) = ${q}$. Find the coefficient of $${xm}\\ln x$.`,
            `在 $x > 0$ 上解 $${poly([1, "x^2y''"], [1 - 2 * m, "xy'"], [m * m, "y"])} = 0$，$y(1) = ${p}$，$y'(1) = ${q}$。求 $${xm}\\ln x$ 的系数。`,
          ),
          answer: ans,
          wrong: [q, q + m * p, p],
          solution: t(
            `The indicial equation is $(m ${signed(-m)})^2 = 0$, so $y = ${xm}(c_1 + c_2\\ln x)$ with $c_1 = ${p}$ and $c_2 = ${q} - ${par(m)} \\cdot ${par(p)} = ${ans}$.`,
            `指标方程为 $(m ${signed(-m)})^2 = 0$，所以 $y = ${xm}(c_1 + c_2\\ln x)$，其中 $c_1 = ${p}$，$c_2 = ${q} - ${par(m)} \\cdot ${par(p)} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

/** cauchyEulerEquationsCharacteristicEquationsWithComplexRoots solves complex m. */
export const cauchyEulerEquationsCharacteristicEquationsWithComplexRoots: TopicDef = {
  id: "cauchy-euler-equations-characteristic-equations-with-complex-roots",
  title: t("Cauchy-Euler Equations: Characteristic Equations With Complex Roots", "柯西-欧拉方程：具有复数根的特征方程"),
  summary: t(
    "When the indicial roots are $\\alpha \\pm i\\beta$, the general solution is $y = x^{\\alpha}[c_1 \\cos(\\beta \\ln x) + c_2 \\sin(\\beta \\ln x)]$.",
    "当指标方程的根为 $\\alpha \\pm i\\beta$ 时，通解为 $y = x^{\\alpha}[c_1 \\cos(\\beta \\ln x) + c_2 \\sin(\\beta \\ln x)]$。",
  ),
  prerequisites: ["cauchy-euler-equations-characteristic-equations-with-distinct-real-roots"],
  encompasses: [
    {
      topic: "cauchy-euler-equations-characteristic-equations-with-distinct-real-roots",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "cauchy-euler-complex-roots",
      title: t("Indicial equation with complex roots", "柯西-欧拉方程的复数指标根"),
      explanation: t(
        "Complex roots give powers with imaginary exponents, which are rewritten as cosines and sines of the logarithm of the variable. For $x^2 y'' + x y' + \\beta^2 y = 0$, the indicial equation is $m^2 + \\beta^2 = 0 \\implies m = \\pm i\\beta$, giving solutions $\\cos(\\beta \\ln x)$ and $\\sin(\\beta \\ln x)$.",
        "复根给出指数为虚数的幂，它们被改写成变量对数的余弦和正弦。对于 $x^2 y'' + x y' + \\beta^2 y = 0$，指标特征方程为 $m(m-1) + m + \\beta^2 = m^2 + \\beta^2 = 0 \\implies m = \\pm i\\beta$，对应解为 $\\cos(\\beta \\ln x)$ 和 $\\sin(\\beta \\ln x)$。",
      ),
      generate(rng: Rng): Problem {
        const beta = rng.int(2, 35);
        const betaSq = beta * beta;
        const ans = beta;

        const prompt = t(
          `Find the frequency parameter $\\beta > 0$ in the trigonometric arguments $\\cos(\\beta \\ln x)$ of the general solution to $x^2 y'' + x y' + ${betaSq}y = 0$ (for $x > 0$).`,
          `求柯西-欧拉微分方程 $x^2 y'' + x y' + ${betaSq}y = 0$（$x > 0$）的通解三角函数部分 $\\cos(\\beta \\ln x)$ 中的频率参数 $\\beta > 0$。`,
        );
        const solution = t(
          steps(
            `The indicial equation is $m(m-1) + 1\\cdot m + ${betaSq} = 0$.`,
            `Simplify: $m^2 - m + m + ${betaSq} = 0 \\implies m^2 + ${betaSq} = 0$.`,
            `Solve for $m$: $m = \\pm ${beta}i$.`,
            `The frequency parameter in the logarithmic argument is $\\beta = ${ans}$.`,
          ),
          steps(
            `写出指标特征方程：$m(m-1) + 1\\cdot m + ${betaSq} = 0$。`,
            `化简展开：$m^2 - m + m + ${betaSq} = 0 \\implies m^2 + ${betaSq} = 0$。`,
            `解得共轭纯虚根：$m = \\pm ${beta}i$。`,
            `因此对数自变量的频率系数为 $\\beta = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [betaSq, Math.round(betaSq / 2), ans + 1],
        });
      },
    },
    {
      id: "solving-a-cauchy-euler-ivp-with-complex-roots",
      title: t("Solving a Cauchy-Euler initial value problem with complex roots", "求解指标方程有复根的柯西-欧拉初值问题"),
      explanation: t(
        "Complex indicial roots $\\alpha \\pm \\beta i$ give $y = x^{\\alpha}\\big(A\\cos(\\beta\\ln x) + B\\sin(\\beta\\ln x)\\big)$. At $x = 1$ the logarithm is $0$, so $y(1) = A$, and the chain rule gives\n\n$$y'(1) = \\alpha A + \\beta B, \\qquad B = \\frac{y'(1) - \\alpha\\,y(1)}{\\beta}.$$\n\nThe power $x^{\\alpha}$ contributes to the derivative just as $e^{\\alpha x}$ does for constant coefficients, so subtract its share before dividing by $\\beta$.",
        "指标方程的复根 $\\alpha \\pm \\beta i$ 给出 $y = x^{\\alpha}\\big(A\\cos(\\beta\\ln x) + B\\sin(\\beta\\ln x)\\big)$。在 $x = 1$ 处对数为 $0$，所以 $y(1) = A$，由链式法则得\n\n$$y'(1) = \\alpha A + \\beta B, \\qquad B = \\frac{y'(1) - \\alpha\\,y(1)}{\\beta}.$$\n\n幂 $x^{\\alpha}$ 对导数的贡献，与常系数情形中 $e^{\\alpha x}$ 的贡献一样，所以要先减去这一部分，再除以 $\\beta$。",
      ),
      generate(rng: Rng): Problem {
        const al = rng.int(-2, 3);
        const be = rng.int(1, 4);
        const p = rng.int(-5, 5) || 3;
        const q = rng.int(-8, 8);
        const ans = Q.of(q - al * p, be);
        const xa = al === 0 ? "" : al === 1 ? "x" : `x^{${al}}`;
        const bl = be === 1 ? "\\ln x" : `${be}\\ln x`;
        return numberProblem({
          prompt: t(
            `Solve $${poly([1, "x^2y''"], [1 - 2 * al, "xy'"], [al * al + be * be, "y"])} = 0$ for $x > 0$ with $y(1) = ${p}$, $y'(1) = ${q}$, written as $y = ${xa}\\big(A\\cos(${bl}) + B\\sin(${bl})\\big)$. Find $B$.`,
            `在 $x > 0$ 上解 $${poly([1, "x^2y''"], [1 - 2 * al, "xy'"], [al * al + be * be, "y"])} = 0$，$y(1) = ${p}$，$y'(1) = ${q}$，写成 $y = ${xa}\\big(A\\cos(${bl}) + B\\sin(${bl})\\big)$。求 $B$。`,
          ),
          answer: ans,
          wrong: [Q.of(q, be), Q.of(q + al * p, be), Q.of(q - al * p)],
          solution: t(
            `The indicial roots are $${al} \\pm ${be === 1 ? "" : be}i$. $A = ${p}$ and $${al} \\cdot ${par(p)} + ${be}B = ${q}$, so $B = ${ans.toLatex()}$.`,
            `指标根为 $${al} \\pm ${be === 1 ? "" : be}i$。$A = ${p}$，且 $${al} \\cdot ${par(p)} + ${be}B = ${q}$，所以 $B = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** cauchyEulerEquationsWithForcing transforms via x = e^t. */
export const cauchyEulerEquationsWithForcing: TopicDef = {
  id: "cauchy-euler-equations-with-forcing",
  title: t("Cauchy-Euler Equations With Forcing", "带外力激励的柯西-欧拉方程"),
  summary: t(
    "The substitution $x = e^t$ turns a Cauchy-Euler equation with forcing into a constant-coefficient equation in $t$.",
    "代换 $x = e^t$ 把非齐次柯西-欧拉方程化为关于 $t$ 的常系数方程。",
  ),
  prerequisites: [
    "cauchy-euler-equations-characteristic-equations-with-distinct-real-roots",
    "second-order-inhomogeneous-odes-with-polynomial-forcing",
  ],
  encompasses: [
    {
      topic: "cauchy-euler-equations-characteristic-equations-with-distinct-real-roots",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "transformation-to-constant-coefficients",
      title: t("Transformation to constant coefficients via logarithmic substitution", "对数代换化柯西-欧拉方程为常系数微分方程"),
      explanation: t(
        "Substituting the variable as an exponential of a new variable turns the Cauchy Euler equation into one with constant coefficients. Under $x = e^t$, $x \\frac{dy}{dx} = \\frac{dy}{dt}$ and $x^2 \\frac{d^2y}{dx^2} = \\frac{d^2y}{dt^2} - \\frac{dy}{dt}$. Thus $x^2 y'' + a x y' + b y = f(e^t)$ becomes $\\frac{d^2y}{dt^2} + (a - 1)\\frac{dy}{dt} + b y = f(e^t)$.",
        "把自变量换成新变量的指数函数，就把柯西-欧拉方程化为常系数方程。在变量代换 $x = e^t$ 下，$x \\frac{dy}{dx} = \\frac{dy}{dt}$，且 $x^2 \\frac{d^2y}{dx^2} = \\frac{d^2y}{dt^2} - \\frac{dy}{dt}$。方程 $x^2 y'' + a x y' + b y = f(e^t)$ 转化为 $\\frac{d^2y}{dt^2} + (a - 1)\\frac{dy}{dt} + b y = f(e^t)$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(2, 20);
        const b = rng.int(2, 15);
        const ans = a - 1;

        const prompt = t(
          `Under the substitution $x = e^t$, the Cauchy-Euler equation $x^2 y'' + ${a}x y' + ${b}y = x$ transforms into a constant-coefficient equation $\\frac{d^2y}{dt^2} + P \\frac{dy}{dt} + ${b}y = e^t$. Find the coefficient $P$.`,
          `通过变量代换 $x = e^t$，柯西-欧拉微分方程 $x^2 y'' + ${a}x y' + ${b}y = x$ 转化为关于 $t$ 的常系数微分方程 $\\frac{d^2y}{dt^2} + P \\frac{dy}{dt} + ${b}y = e^t$。求一次导数系数 $P$ 的值。`,
        );
        const solution = t(
          steps(
            `With $t = \\ln x$, the chain rule gives $x y' = \\frac{dy}{dt}$ and $x^2 y'' = \\frac{d^2y}{dt^2} - \\frac{dy}{dt}$.`,
            `Substitute these expressions: $\\left(\\frac{d^2y}{dt^2} - \\frac{dy}{dt}\\right) + ${a}\\frac{dy}{dt} + ${b}y = e^t$.`,
            `Combine the first-derivative terms: $\\frac{d^2y}{dt^2} + (${a} - 1)\\frac{dy}{dt} + ${b}y = e^t$.`,
            `Therefore, $P = ${a} - 1 = ${ans}$.`,
          ),
          steps(
            `令 $t = \\ln x$，由复合求导链式法则知 $x y' = \\frac{dy}{dt}$，且 $x^2 y'' = \\frac{d^2y}{dt^2} - \\frac{dy}{dt}$。`,
            `代入原方程：$\\left(\\frac{d^2y}{dt^2} - \\frac{dy}{dt}\\right) + ${a}\\frac{dy}{dt} + ${b}y = e^t$。`,
            `合并一阶导数项：$\\frac{d^2y}{dt^2} + (${a} - 1)\\frac{dy}{dt} + ${b}y = e^t$。`,
            `因此，系数 $P = ${a} - 1 = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [a, a + 1, b],
        });
      },
    },
    {
      id: "a-power-particular-solution-of-a-cauchy-euler-equation",
      title: t("A power particular solution of a Cauchy-Euler equation", "柯西-欧拉方程的幂函数特解"),
      explanation: t(
        "A Cauchy-Euler operator maps a power to a multiple of the same power:\n\n$$x^2(x^r)'' + ax(x^r)' + bx^r = \\big(r(r - 1) + ar + b\\big)x^r.$$\n\nSo for the forcing $kx^r$, the trial $y_p = Ax^r$ works directly with $A = \\frac{k}{r(r - 1) + ar + b}$, provided $r$ is not a root of the indicial equation.",
        "柯西-欧拉算子把幂函数映为同一幂的倍数：\n\n$$x^2(x^r)'' + ax(x^r)' + bx^r = \\big(r(r - 1) + ar + b\\big)x^r.$$\n\n所以对强迫项 $kx^r$，只要 $r$ 不是指标方程的根，试探解 $y_p = Ax^r$ 直接可用，$A = \\frac{k}{r(r - 1) + ar + b}$。",
      ),
      generate(rng: Rng): Problem {
        let [a, b, r, den] = [0, 0, 0, 0];
        do {
          a = rng.int(-5, 5);
          b = rng.int(-8, 8);
          r = rng.pick([-2, -1, 2, 3, 4]);
          den = r * (r - 1) + a * r + b;
        } while (den === 0);
        const k = rng.int(-9, 9) || 4;
        const ans = Q.of(k, den);
        const xr = `x^{${r}}`;
        return numberProblem({
          prompt: t(
            `Find $A$ in the particular solution $y_p = A${xr}$ of $${poly([1, "x^2y''"], [a, "xy'"], [b, "y"])} = ${poly([k, xr])}$.`,
            `求 $${poly([1, "x^2y''"], [a, "xy'"], [b, "y"])} = ${poly([k, xr])}$ 的特解 $y_p = A${xr}$ 中的 $A$。`,
          ),
          answer: ans,
          wrong: [Q.of(k, r * r + a * r + b || 11), Q.of(k, r * (r - 1) + a + b || 13), ans.neg()],
          solution: t(
            `Substituting gives $(${r * (r - 1)} ${signed(a * r)} ${signed(b)})A = ${k}$, so $A = \\frac{${k}}{${den}}${lowestTerms(k, den)}$.`,
            `代入得 $(${r * (r - 1)} ${signed(a * r)} ${signed(b)})A = ${k}$，所以 $A = \\frac{${k}}{${den}}${lowestTerms(k, den)}$。`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 3.11 Variation of Parameters
// ---------------------------------------------------------------------------

/** variationOfParametersForFirstOrderLinearOdes derives v(x). */
export const variationOfParametersForFirstOrderLinearOdes: TopicDef = {
  id: "variation-of-parameters-for-first-order-linear-odes",
  title: t("Variation of Parameters for First-Order Linear ODEs", "一阶线性常微分方程的常数变易法"),
  summary: t(
    "Setting $y = u(x)y_h(x)$ in $y' + P(x)y = f(x)$ gives $u' = \\frac{f}{y_h}$, which produces the particular solution directly.",
    "在 $y' + P(x)y = f(x)$ 中设 $y = u(x)y_h(x)$，得 $u' = \\frac{f}{y_h}$，由此直接得到特解。",
  ),
  prerequisites: ["general-solutions-of-first-order-linear-odes"],
  encompasses: [{ topic: "general-solutions-of-first-order-linear-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "variation-of-parameters-first-order",
      title: t("Variation of parameters derivative formula for first-order ODEs", "一阶微分方程常数变易法的导数公式"),
      explanation: t(
        "Replace the constant in the homogeneous solution by an unknown function, substitute, and the equation reduces to a simple formula for that function's derivative. For $y' + a y = K e^{-a x}$, homogeneous solution is $y_h = e^{-a x}$. Setting $y = u(x) e^{-a x}$ gives $u'(x) = K$.",
        "把齐次解中的常数换成一个未知函数并代入，方程就化为该函数导数的简单公式。对于 $y' + a y = K e^{-a x}$，对应齐次解为 $y_h = e^{-a x}$。设 $y = u(x) e^{-a x}$ 代入可得 $u'(x) = K$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(1, 8);
        const K = rng.int(2, 12);
        const y0 = rng.nonZero(-6, 6);
        const T = rng.int(2, 5);
        const ans = K * T + y0;

        const prompt = t(
          `Apply variation of parameters to $y' + ${poly([a, "y"])} = ${K}e^{-${poly([a, "x"])}}$, $y(0) = ${y0}$, by setting $y(x) = u(x) e^{-${poly([a, "x"])}}$. Find $u(${T})$.`,
          `利用常数变易法求解 $y' + ${poly([a, "y"])} = ${K}e^{-${poly([a, "x"])}}$，$y(0) = ${y0}$，设 $y(x) = u(x) e^{-${poly([a, "x"])}}$。求 $u(${T})$。`,
        );
        const solution = t(
          steps(
            `Compute $y'(x) = u'(x)e^{-${poly([a, "x"])}} - ${a}u(x)e^{-${poly([a, "x"])}}$.`,
            `Substitute into the equation: the terms in $u$ cancel, which leaves $u'(x)e^{-${poly([a, "x"])}} = ${K}e^{-${poly([a, "x"])}}$, so $u'(x) = ${K}$.`,
            `Integrate: $u(x) = ${K}x + C$. Since $e^{0} = 1$, $u(0) = y(0)$, so $C = ${y0}$.`,
            `Therefore $u(${T}) = ${K} \\cdot ${T} ${signed(y0)} = ${ans}$.`,
          ),
          steps(
            `求导：$y'(x) = u'(x)e^{-${poly([a, "x"])}} - ${a}u(x)e^{-${poly([a, "x"])}}$。`,
            `代入方程：含 $u$ 的项相互抵消，剩下 $u'(x)e^{-${poly([a, "x"])}} = ${K}e^{-${poly([a, "x"])}}$，所以 $u'(x) = ${K}$。`,
            `积分：$u(x) = ${K}x + C$。因为 $e^{0} = 1$，所以 $u(0) = y(0)$，$C = ${y0}$。`,
            `因此 $u(${T}) = ${K} \\cdot ${T} ${signed(y0)} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [K * T, K + y0, K * T - y0, a * K * T + y0],
        });
      },
    },
    {
      id: "variation-of-parameters-with-a-power-times-exponential",
      title: t("Variation of parameters with a power times an exponential", "强迫项为幂乘指数时的参数变易法"),
      explanation: t(
        "For $y' + ay = g(x)$ the homogeneous solution is $e^{-ax}$. Setting $y = u(x)e^{-ax}$ cancels the $a$ term and leaves $u' = e^{ax}g(x)$. When $g(x) = kx^ne^{-ax}$ the exponentials cancel:\n\n$$u' = kx^n, \\qquad u = \\frac{k}{n + 1}x^{n + 1} + C.$$\n\nThe initial value fixes $C = y(0)$, and $y = \\left(C + \\frac{k}{n + 1}x^{n + 1}\\right)e^{-ax}$.",
        "对 $y' + ay = g(x)$，齐次解为 $e^{-ax}$。设 $y = u(x)e^{-ax}$，$a$ 项抵消，剩下 $u' = e^{ax}g(x)$。当 $g(x) = kx^ne^{-ax}$ 时指数相消：\n\n$$u' = kx^n, \\qquad u = \\frac{k}{n + 1}x^{n + 1} + C.$$\n\n初值确定 $C = y(0)$，于是 $y = \\left(C + \\frac{k}{n + 1}x^{n + 1}\\right)e^{-ax}$。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.pick([-3, -2, -1, 1, 2, 3, 4]);
        const n = rng.int(1, 4);
        const k = rng.int(-9, 9) || 6;
        const y0 = rng.int(-5, 5);
        const ans = Q.of(k, n + 1);
        const ea = a === 1 ? "e^{-x}" : a === -1 ? "e^{x}" : `e^{${-a}x}`;
        const xn = n === 1 ? "x" : `x^{${n}}`;
        return numberProblem({
          prompt: t(
            `Solve $${poly([1, "y'"], [a, "y"])} = ${poly([k, `${xn}${ea}`])}$ with $y(0) = ${y0}$ by setting $y = u(x)${ea}$. Find the coefficient of $x^{${n + 1}}${ea}$ in $y$.`,
            `设 $y = u(x)${ea}$，解 $${poly([1, "y'"], [a, "y"])} = ${poly([k, `${xn}${ea}`])}$，$y(0) = ${y0}$。求 $y$ 中 $x^{${n + 1}}${ea}$ 的系数。`,
          ),
          answer: ans,
          wrong: [Q.of(k), Q.of(k, n), Q.of(k * (n + 1)), Q.of(y0 + k, n + 1)],
          solution: t(
            `$u' = ${poly([k, xn])}$, so $u = ${poly([ans, `x^{${n + 1}}`], [y0, ""])}$ and the coefficient is $${ans.toLatex()}$.`,
            `$u' = ${poly([k, xn])}$，所以 $u = ${poly([ans, `x^{${n + 1}}`], [y0, ""])}$，系数为 $${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** variationOfParametersForSecondOrderOdes sets up u1' and u2' formulas. */
export const variationOfParametersForSecondOrderOdes: TopicDef = {
  id: "variation-of-parameters-for-second-order-odes",
  title: t("Variation of Parameters for Second-Order ODEs", "二阶常微分方程的常数变易法原理"),
  summary: t(
    "For $y'' + P(x)y' + Q(x)y = g(x)$, setting $y_p = u_1 y_1 + u_2 y_2$ with $u_1' y_1 + u_2' y_2 = 0$ gives $u_1' = -\\frac{y_2 g}{W}$ and $u_2' = \\frac{y_1 g}{W}$.",
    "对 $y'' + P(x)y' + Q(x)y = g(x)$，设 $y_p = u_1 y_1 + u_2 y_2$ 并附加条件 $u_1' y_1 + u_2' y_2 = 0$，得 $u_1' = -\\frac{y_2 g}{W}$、$u_2' = \\frac{y_1 g}{W}$。",
  ),
  prerequisites: ["variation-of-parameters-for-first-order-linear-odes", "linear-independence-of-solutions-to-homogeneous-odes"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    {
      id: "second-order-variation-of-parameters-system",
      title: t("Linear system for parameter derivatives", "待定变易参数导数的代数线性方程组"),
      explanation: t(
        "The extra condition makes the derivatives of the parameters satisfy a linear system, which Cramer's rule solves with the Wronskian in the denominator. The variation of parameters system is $u_1' y_1 + u_2' y_2 = 0$ and $u_1' y_1' + u_2' y_2' = g(x)$. By Cramer's rule, $u_2' = \\frac{y_1 g}{W}$.",
        "附加条件使参数的导数满足一个线性方程组，用克拉默法则求解时分母是朗斯基行列式。常数变易法联立代数方程组为 $u_1' y_1 + u_2' y_2 = 0$ 与 $u_1' y_1' + u_2' y_2' = g(x)$。由克莱姆法则解得 $u_2' = \\frac{y_1 g}{W}$。",
      ),
      generate(rng: Rng): Problem {
        for (;;) {
          const a = rng.nonZero(-5, 6);
          const b = rng.nonZero(-4, 4);
          const c = rng.nonZero(-4, 4);
          const d = rng.nonZero(-4, 5);
          const g = rng.nonZero(-6, 6);
          const W = a * d - b * c;
          const flipped = a * d + b * c;
          if (W === 0 || flipped === 0) continue;
          const ans = Q.of(a * g, W);

          const prompt = t(
            `Solve $y'' + P(x)y' + Q(x)y = g(x)$ by variation of parameters, with $y = u_1 y_1 + u_2 y_2$. At $x = 0$: $y_1 = ${a}$, $y_1' = ${b}$, $y_2 = ${c}$, $y_2' = ${d}$, and $g = ${g}$. Find $u_2'(0)$.`,
            `用常数变易法求解 $y'' + P(x)y' + Q(x)y = g(x)$，设 $y = u_1 y_1 + u_2 y_2$。在 $x = 0$ 处：$y_1 = ${a}$，$y_1' = ${b}$，$y_2 = ${c}$，$y_2' = ${d}$，$g = ${g}$。求 $u_2'(0)$。`,
          );
          const solution = t(
            steps(
              `The parameters satisfy $u_1' y_1 + u_2' y_2 = 0$ and $u_1' y_1' + u_2' y_2' = g$, and Cramer's rule gives $u_2' = \\frac{y_1 g}{W}$ with $W = y_1 y_2' - y_1' y_2$.`,
              `$W(0) = ${par(a)} \\cdot ${par(d)} - ${par(b)} \\cdot ${par(c)} = ${W}$.`,
              `$u_2'(0) = \\frac{${par(a)} \\cdot ${par(g)}}{${W}} = ${ans.toLatex()}$.`,
            ),
            steps(
              `变易参数满足 $u_1' y_1 + u_2' y_2 = 0$ 与 $u_1' y_1' + u_2' y_2' = g$，由克莱姆法则得 $u_2' = \\frac{y_1 g}{W}$，其中 $W = y_1 y_2' - y_1' y_2$。`,
              `$W(0) = ${par(a)} \\cdot ${par(d)} - ${par(b)} \\cdot ${par(c)} = ${W}$。`,
              `$u_2'(0) = \\frac{${par(a)} \\cdot ${par(g)}}{${W}} = ${ans.toLatex()}$。`,
            ),
          );

          return numberProblem({
            prompt,
            solution,
            answer: ans,
            wrong: [Q.of(-c * g, W), Q.of(-a * g, W), Q.of(a * g, flipped), Q.of(a * g)],
          });
        }
      },
    },
    {
      id: "the-parameter-derivatives-for-exponential-solutions",
      title: t("The parameter derivatives for exponential solutions", "指数解情形的参数导数"),
      explanation: t(
        "For $y'' + py' + qy = g$ with homogeneous solutions $y_1$, $y_2$, variation of parameters sets $y_p = u_1y_1 + u_2y_2$ with\n\n$$u_1' = -\\frac{y_2\\,g}{W}, \\qquad u_2' = \\frac{y_1\\,g}{W}, \\qquad W = y_1y_2' - y_1'y_2.$$\n\nFor $y_1 = e^{r_1x}$ and $y_2 = e^{r_2x}$, $W = (r_2 - r_1)e^{(r_1 + r_2)x}$, so with $g = ke^{sx}$ the parameter derivatives are again exponentials.",
        "对 $y'' + py' + qy = g$，设齐次解为 $y_1$、$y_2$，参数变易法取 $y_p = u_1y_1 + u_2y_2$，其中\n\n$$u_1' = -\\frac{y_2\\,g}{W}, \\qquad u_2' = \\frac{y_1\\,g}{W}, \\qquad W = y_1y_2' - y_1'y_2.$$\n\n对 $y_1 = e^{r_1x}$，$y_2 = e^{r_2x}$，$W = (r_2 - r_1)e^{(r_1 + r_2)x}$，所以当 $g = ke^{sx}$ 时，参数导数仍是指数函数。",
      ),
      generate(rng: Rng): Problem {
        const r1 = rng.int(-3, 2);
        const r2 = r1 + rng.int(1, 3);
        const s = rng.int(-3, 4);
        const k = rng.int(-9, 9) || 4;
        const first = rng.int(0, 1) === 0;
        const ans = first ? Q.of(-k, r2 - r1) : Q.of(k, r2 - r1);
        const e = (r: number) => (r === 0 ? "1" : r === 1 ? "e^{x}" : r === -1 ? "e^{-x}" : `e^{${r}x}`);
        const g = s === 0 ? String(k) : poly([k, e(s)]);
        const out = first ? s - r1 : s - r2;
        return numberProblem({
          prompt: t(
            `For $${poly([1, "y''"], [-(r1 + r2), "y'"], [r1 * r2, "y"])} = ${g}$ take $y_1 = ${e(r1)}$, $y_2 = ${e(r2)}$. Then $u_{${first ? 1 : 2}}' = C${out === 0 ? "" : e(out)}$. Find $C$.`,
            `对 $${poly([1, "y''"], [-(r1 + r2), "y'"], [r1 * r2, "y"])} = ${g}$ 取 $y_1 = ${e(r1)}$，$y_2 = ${e(r2)}$。则 $u_{${first ? 1 : 2}}' = C${out === 0 ? "" : e(out)}$。求 $C$。`,
          ),
          answer: ans,
          wrong: [ans.neg(), Q.of(k), Q.of(k, r1 - r2 - 1)],
          solution: t(
            `$W = ${r2 - r1}${e(r1 + r2) === "1" ? "" : e(r1 + r2)}$, so $u_{${first ? 1 : 2}}' = ${first ? "-" : ""}\\frac{${first ? "y_2" : "y_1"} \\cdot (${g})}{W}$ and $C = ${ans.toLatex()}$.`,
            `$W = ${r2 - r1}${e(r1 + r2) === "1" ? "" : e(r1 + r2)}$，所以 $u_{${first ? 1 : 2}}' = ${first ? "-" : ""}\\frac{${first ? "y_2" : "y_1"} \\cdot (${g})}{W}$，$C = ${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** solvingSecondOrderOdesUsingVariationOfParameters applies the full method to sec x. */
export const solvingSecondOrderOdesUsingVariationOfParameters: TopicDef = {
  id: "solving-second-order-odes-using-variation-of-parameters",
  title: t("Solving Second-Order ODEs Using Variation of Parameters", "应用常数变易法求解二阶常微分方程"),
  summary: t(
    "Variation of parameters solves equations such as $y'' + y = \\tan x$, where undetermined coefficients fails, through $u_1 = -\\int \\frac{y_2 g}{W}\\,dx$ and $u_2 = \\int \\frac{y_1 g}{W}\\,dx$.",
    "常数变易法可求解待定系数法失效的方程（如 $y'' + y = \\tan x$），通过 $u_1 = -\\int \\frac{y_2 g}{W}\\,dx$ 与 $u_2 = \\int \\frac{y_1 g}{W}\\,dx$ 得到解。",
  ),
  prerequisites: ["variation-of-parameters-for-second-order-odes"],
  encompasses: [{ topic: "variation-of-parameters-for-second-order-odes", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "variation-of-parameters-secant-forcing",
      title: t("Particular solution with secant forcing", "正割函数右端项的常数变易法特解"),
      explanation: t(
        "Undetermined coefficients cannot handle a secant forcing term, but variation of parameters works for any continuous forcing function. For $y'' + y = \\sec x$, fundamental solutions are $y_1 = \\cos x, y_2 = \\sin x$ with $W = 1$. Then $u_2' = \\cos x \\sec x = 1 \\implies u_2(x) = x$. For $\\cos\\omega x$ and $\\sin\\omega x$, $W = \\omega$.",
        "待定系数法无法处理正割型强迫项，但常数变易法适用于任何连续的强迫函数。对于 $y'' + y = \\sec x$，基本齐次解为 $y_1 = \\cos x, y_2 = \\sin x$（$W = 1$）。由公式得 $u_2' = \\cos x \\sec x = 1 \\implies u_2(x) = x$。 对 $\\cos\\omega x$ 与 $\\sin\\omega x$，$W = \\omega$。",
      ),
      generate(rng: Rng): Problem {
        const omega = rng.int(2, 6);
        const k = rng.int(2, 30);
        const ans = Q.of(k, omega);

        const prompt = t(
          `When solving $y'' + ${omega * omega}y = ${k}\\sec ${omega}x$ using variation of parameters with $y_1 = \\cos ${omega}x$ and $y_2 = \\sin ${omega}x$, the second parameter derivative is a constant: $u_2'(x) = C$. Find $C$.`,
          `利用常数变易法求解 $y'' + ${omega * omega}y = ${k}\\sec ${omega}x$（其中 $y_1 = \\cos ${omega}x$，$y_2 = \\sin ${omega}x$），第二个变易参数的导数为常数 $u_2'(x) = C$。求 $C$。`,
        );
        const solution = t(
          steps(
            `The Wronskian is $W = y_1 y_2' - y_1' y_2 = ${omega}\\cos^2 ${omega}x + ${omega}\\sin^2 ${omega}x = ${omega}$.`,
            `Then $u_2'(x) = \\frac{y_1 g}{W} = \\frac{(\\cos ${omega}x)(${k}\\sec ${omega}x)}{${omega}}$.`,
            `Since $\\cos ${omega}x \\sec ${omega}x = 1$, we obtain $C = \\frac{${k}}{${omega}}${lowestTerms(k, omega)}$.`,
          ),
          steps(
            `朗斯基行列式为 $W = y_1 y_2' - y_1' y_2 = ${omega}\\cos^2 ${omega}x + ${omega}\\sin^2 ${omega}x = ${omega}$。`,
            `于是 $u_2'(x) = \\frac{y_1 g}{W} = \\frac{(\\cos ${omega}x)(${k}\\sec ${omega}x)}{${omega}}$。`,
            `因为 $\\cos ${omega}x \\sec ${omega}x = 1$，所以 $C = \\frac{${k}}{${omega}}${lowestTerms(k, omega)}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [Q.of(k), Q.of(k * omega), Q.of(-k, omega), Q.of(omega, k)],
        });
      },
    },
    {
      id: "the-particular-solution-for-secant-forcing",
      title: t("The particular solution for secant forcing", "正割强迫项的特解"),
      explanation: t(
        "Undetermined coefficients cannot handle $\\sec \\omega x$, but variation of parameters can. For $y'' + \\omega^2y = k\\sec \\omega x$ take $y_1 = \\cos \\omega x$, $y_2 = \\sin \\omega x$, $W = \\omega$:\n\n$$u_1' = -\\frac{k}{\\omega}\\tan \\omega x, \\qquad u_2' = \\frac{k}{\\omega}.$$\n\nIntegrating, $u_1 = \\frac{k}{\\omega^2}\\ln|\\cos \\omega x|$ and $u_2 = \\frac{k}{\\omega}x$, so\n\n$$y_p = \\frac{k}{\\omega^2}\\cos \\omega x\\,\\ln|\\cos \\omega x| + \\frac{k}{\\omega}x\\sin \\omega x.$$\n\nThe logarithm comes from integrating the tangent, and the factor $x$ from integrating a constant. Both coefficients scale with $k$, but they are divided by different powers of $\\omega$.",
        "待定系数法处理不了 $\\sec \\omega x$，参数变易法却可以。对 $y'' + \\omega^2y = k\\sec \\omega x$，取 $y_1 = \\cos \\omega x$，$y_2 = \\sin \\omega x$，$W = \\omega$：\n\n$$u_1' = -\\frac{k}{\\omega}\\tan \\omega x, \\qquad u_2' = \\frac{k}{\\omega}.$$\n\n积分得 $u_1 = \\frac{k}{\\omega^2}\\ln|\\cos \\omega x|$，$u_2 = \\frac{k}{\\omega}x$，所以\n\n$$y_p = \\frac{k}{\\omega^2}\\cos \\omega x\\,\\ln|\\cos \\omega x| + \\frac{k}{\\omega}x\\sin \\omega x.$$\n\n对数来自对正切的积分，因子 $x$ 来自对常数的积分。两个系数都与 $k$ 成正比，但分别除以 $\\omega$ 的不同次幂。",
      ),
      generate(rng: Rng): Problem {
        const w = rng.int(1, 4);
        const k = rng.int(1, 12) * rng.pick([-1, 1]);
        const log = rng.int(0, 1) === 0;
        const ans = log ? Q.of(k, w * w) : Q.of(k, w);
        const wx = w === 1 ? "x" : `${w}x`;
        return numberProblem({
          prompt: t(
            `Variation of parameters gives a particular solution of $y'' + ${w * w === 1 ? "" : w * w}y = ${poly([k, `\\sec ${wx}`])}$ as a combination of $\\cos ${wx}\\,\\ln|\\cos ${wx}|$ and $x\\sin ${wx}$. Find the coefficient of $${log ? `\\cos ${wx}\\,\\ln|\\cos ${wx}|` : `x\\sin ${wx}`}$.`,
            `参数变易法给出 $y'' + ${w * w === 1 ? "" : w * w}y = ${poly([k, `\\sec ${wx}`])}$ 的一个特解，它是 $\\cos ${wx}\\,\\ln|\\cos ${wx}|$ 与 $x\\sin ${wx}$ 的组合。求 $${log ? `\\cos ${wx}\\,\\ln|\\cos ${wx}|` : `x\\sin ${wx}`}$ 的系数。`,
          ),
          answer: ans,
          wrong: log ? [Q.of(k, w), Q.of(-k, w * w), Q.of(k)] : [Q.of(k, w * w), Q.of(-k, w), Q.of(k * w)],
          solution: t(
            `$W = ${w}$, $u_1' = ${Q.of(-k, w).toLatex()}\\tan ${wx}$ and $u_2' = ${Q.of(k, w).toLatex()}$, so $u_1 = ${Q.of(k, w * w).toLatex()}\\ln|\\cos ${wx}|$ and $u_2 = ${Q.of(k, w).toLatex()}x$. The coefficient is $${ans.toLatex()}$.`,
            `$W = ${w}$，$u_1' = ${Q.of(-k, w).toLatex()}\\tan ${wx}$，$u_2' = ${Q.of(k, w).toLatex()}$，所以 $u_1 = ${Q.of(k, w * w).toLatex()}\\ln|\\cos ${wx}|$，$u_2 = ${Q.of(k, w).toLatex()}x$。系数为 $${ans.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** variationOfParametersWithHigherOrderOdes generalizes to order n. */
export const variationOfParametersWithHigherOrderOdes: TopicDef = {
  id: "variation-of-parameters-with-higher-order-odes",
  title: t("Variation of Parameters With Higher-Order ODEs", "高阶常微分方程的常数变易法"),
  summary: t(
    "For an $n$th-order linear ODE, variation of parameters gives $u_k' = \\frac{W_k}{W} g$, where $W_k$ replaces column $k$ of the Wronskian with $(0, \\dots, 0, 1)^T$.",
    "对 $n$ 阶线性方程，常数变易法给出 $u_k' = \\frac{W_k}{W} g$，其中 $W_k$ 是把朗斯基行列式第 $k$ 列换成 $(0, \\dots, 0, 1)^T$ 所得。",
  ),
  prerequisites: ["solving-second-order-odes-using-variation-of-parameters"],
  encompasses: [
    {
      topic: "solving-second-order-odes-using-variation-of-parameters",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "higher-order-variation-of-parameters",
      title: t("Cramer's rule for n-th order variation of parameters", "高阶常数变易法的克莱姆法则"),
      explanation: t(
        "In an $n$-th order ODE, the parameter derivatives satisfy Cramer's rule $u_k'(x) = \\frac{W_k(x) g(x)}{W(x)}$. For fundamental solutions $1, x, x^k$, the Wronskian at $x = 1$ is $W(1, x, x^k)(1) = k(k-1)$.",
        "在 $n$ 阶线性方程中，参数导数由克莱姆法则确定为 $u_k'(x) = \\frac{W_k(x) g(x)}{W(x)}$。对于基本解组 $1, x, x^k$，在 $x = 1$ 处的朗斯基行列式为 $W(1, x, x^k)(1) = k(k-1)$。",
      ),
      generate(rng: Rng): Problem {
        const k = rng.int(2, 35);
        const ans = k * (k - 1);

        const prompt = t(
          `Calculate the value of the Wronskian determinant $W(1, x, x^{${k}})$ at $x = 1$, which arises when applying variation of parameters to a third-order differential equation.`,
          `计算对三阶微分方程应用常数变易法时在 $x = 1$ 处的朗斯基行列式 $W(1, x, x^{${k}})(1)$ 的值。`,
        );
        const solution = t(
          steps(
            `The Wronskian of $y_1 = 1, y_2 = x, y_3 = x^{${k}}$ is the determinant of the functions and their first two derivatives: $\\begin{pmatrix} 1 & x & x^{${k}} \\\\ 0 & 1 & ${k}x^{${k}-1} \\\\ 0 & 0 & ${k * (k - 1)}x^{${k}-2} \\end{pmatrix}$.`,
            `Evaluating at $x = 1$, the matrix is upper triangular: $\\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 1 & ${k} \\\\ 0 & 0 & ${k * (k - 1)} \\end{pmatrix}$.`,
            `The determinant is the product of diagonal elements: $1 \\times 1 \\times ${k * (k - 1)} = ${ans}$.`,
          ),
          steps(
            `函数组 $y_1 = 1, y_2 = x, y_3 = x^{${k}}$ 的朗斯基行列式由函数及一、二阶导数构成：$\\begin{pmatrix} 1 & x & x^{${k}} \\\\ 0 & 1 & ${k}x^{${k}-1} \\\\ 0 & 0 & ${k * (k - 1)}x^{${k}-2} \\end{pmatrix}$。`,
            `在 $x = 1$ 处求值得到上三角矩阵：$\\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 1 & ${k} \\\\ 0 & 0 & ${k * (k - 1)} \\end{pmatrix}$。`,
            `上三角行列式等于对角线元素之积：$1 \\times 1 \\times ${k * (k - 1)} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [k, k * k, ans + 2],
        });
      },
    },
    {
      id: "the-wronskian-of-three-exponentials",
      title: t("The Wronskian of three exponentials", "三个指数函数的朗斯基行列式"),
      explanation: t(
        "Variation of parameters for a third-order equation divides by the Wronskian $W(y_1, y_2, y_3)$, the determinant of the functions and their first two derivatives. For $e^{ax}$, $e^{bx}$, $e^{cx}$ at $x = 0$ the rows are $(1, 1, 1)$, $(a, b, c)$ and $(a^2, b^2, c^2)$, a Vandermonde determinant:\n\n$$W(0) = (b - a)(c - a)(c - b).$$\n\nIt is nonzero exactly when the three rates are distinct.",
        "三阶方程的参数变易法要除以朗斯基行列式 $W(y_1, y_2, y_3)$，即由函数及其一阶、二阶导数组成的行列式。对 $e^{ax}$、$e^{bx}$、$e^{cx}$，在 $x = 0$ 处各行为 $(1, 1, 1)$、$(a, b, c)$、$(a^2, b^2, c^2)$，这是范德蒙德行列式：\n\n$$W(0) = (b - a)(c - a)(c - b).$$\n\n它不为零当且仅当三个速率互不相同。",
      ),
      generate(rng: Rng): Problem {
        const a = rng.int(-3, 1);
        const b = a + rng.int(1, 3);
        const c = b + rng.int(1, 3);
        const ans = (b - a) * (c - a) * (c - b);
        const e = (r: number) => (r === 0 ? "1" : r === 1 ? "e^{x}" : r === -1 ? "e^{-x}" : `e^{${r}x}`);
        return numberProblem({
          prompt: t(
            `Evaluate the Wronskian $W(${e(a)}, ${e(b)}, ${e(c)})$ at $x = 0$.`,
            `求朗斯基行列式 $W(${e(a)}, ${e(b)}, ${e(c)})$ 在 $x = 0$ 处的值。`,
          ),
          answer: ans,
          wrong: [-ans, (b - a) * (c - b), a * b * c, b - a + (c - a) + (c - b)],
          solution: t(
            `The rows at $0$ are $(1, 1, 1)$, $(${a}, ${b}, ${c})$, $(${a * a}, ${b * b}, ${c * c})$, so $W(0) = (${b} - ${par(a)})(${c} - ${par(a)})(${c} - ${par(b)}) = ${ans}$.`,
            `在 $0$ 处各行为 $(1, 1, 1)$、$(${a}, ${b}, ${c})$、$(${a * a}, ${b * b}, ${c * c})$，所以 $W(0) = (${b} - ${par(a)})(${c} - ${par(a)})(${c} - ${par(b)}) = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 3.12 Modeling With Second-Order ODEs
// ---------------------------------------------------------------------------

/** simpleHarmonicOscillators models m y'' + k y = 0. */
export const simpleHarmonicOscillators: TopicDef = {
  id: "simple-harmonic-oscillators",
  title: t("Simple Harmonic Oscillators", "简谐振动模型"),
  summary: t(
    "An undamped mass-spring system satisfies $my'' + ky = 0$ and oscillates with natural angular frequency $\\omega_0 = \\sqrt{k/m}$.",
    "无阻尼弹簧振子满足 $my'' + ky = 0$，以固有角频率 $\\omega_0 = \\sqrt{k/m}$ 振动。",
  ),
  prerequisites: ["second-order-homogeneous-initial-value-problems"],
  encompasses: [
    {
      topic: "second-order-homogeneous-initial-value-problems",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "natural-frequency-of-harmonic-oscillator",
      title: t("Natural angular frequency of a harmonic oscillator", "简谐振子的固有角频率"),
      explanation: t(
        "A stiffer spring pulls back harder and a heavier mass responds more slowly, so the natural frequency grows with stiffness and shrinks with mass. The natural angular frequency of a mass $m$ attached to a spring with stiffness constant $k$ is $\\omega_0 = \\sqrt{\\frac{k}{m}}$.",
        "弹簧越硬，回复力越大；质量越大，响应越慢；所以固有频率随刚度增大而增大，随质量增大而减小。质量为 $m$、劲度系数为 $k$ 的弹簧振子的固有角频率为 $\\omega_0 = \\sqrt{\\frac{k}{m}}$。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(1, 8);
        const omega0 = rng.int(2, 15);
        const k = m * omega0 * omega0;
        const ans = omega0;

        const prompt = t(
          `A mass of $m = ${m}\\text{ kg}$ is attached to a spring with spring constant $k = ${k}\\text{ N/m}$. Find the natural angular frequency $\\omega_0$ in $\\text{rad/s}$.`,
          `一个质量为 $m = ${m}\\text{ 千克}$ 的物体连接在劲度系数为 $k = ${k}\\text{ 牛/米}$ 的弹簧上。求系统的固有角频率 $\\omega_0$（单位：$\\text{弧度/秒}$）。`,
        );
        const solution = t(
          steps(
            `The equation of motion is $m y'' + k y = 0 \\implies y'' + \\frac{k}{m}y = 0$.`,
            `The natural frequency squared is $\\omega_0^2 = \\frac{k}{m} = \\frac{${k}}{${m}} = ${omega0 * omega0}$.`,
            `Take the square root: $\\omega_0 = \\sqrt{${omega0 * omega0}} = ${ans}\\text{ rad/s}$.`,
          ),
          steps(
            `运动微分方程为 $m y'' + k y = 0 \\implies y'' + \\frac{k}{m}y = 0$。`,
            `固有角频率平方为 $\\omega_0^2 = \\frac{k}{m} = \\frac{${k}}{${m}} = ${omega0 * omega0}$。`,
            `开平方计算：$\\omega_0 = \\sqrt{${omega0 * omega0}} = ${ans}\\text{ 弧度/秒}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [omega0 * omega0, Math.round(k / m), ans * 2],
        });
      },
    },
    {
      id: "the-amplitude-from-initial-conditions",
      title: t("The amplitude from initial conditions", "由初始条件求振幅"),
      explanation: t(
        "The solution of $y'' + \\omega^2y = 0$ with $y(0) = y_0$ and $y'(0) = v_0$ is $y = y_0\\cos \\omega t + \\frac{v_0}{\\omega}\\sin \\omega t$. Written as one cosine $R\\cos(\\omega t - \\delta)$, its amplitude is\n\n$$R = \\sqrt{y_0^2 + \\left(\\frac{v_0}{\\omega}\\right)^2}.$$\n\nThe initial velocity is divided by $\\omega$ before it is combined with the initial displacement.",
        "$y'' + \\omega^2y = 0$ 满足 $y(0) = y_0$，$y'(0) = v_0$ 的解为 $y = y_0\\cos \\omega t + \\frac{v_0}{\\omega}\\sin \\omega t$。写成单个余弦 $R\\cos(\\omega t - \\delta)$，振幅为\n\n$$R = \\sqrt{y_0^2 + \\left(\\frac{v_0}{\\omega}\\right)^2}.$$\n\n初速度要先除以 $\\omega$，再与初位移合成。",
      ),
      generate(rng: Rng): Problem {
        const [u, v, R] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [6, 8, 10],
          [8, 6, 10],
          [8, 15, 17],
        ] as const);
        const w = rng.int(1, 5);
        const y0 = u * rng.pick([-1, 1]);
        const v0 = v * w * rng.pick([-1, 1]);
        return numberProblem({
          prompt: t(
            `A spring satisfies $y'' + ${w * w === 1 ? "" : w * w}y = 0$ with $y(0) = ${y0}$ and $y'(0) = ${v0}$. Find the amplitude of the motion.`,
            `弹簧满足 $y'' + ${w * w === 1 ? "" : w * w}y = 0$，$y(0) = ${y0}$，$y'(0) = ${v0}$。求运动的振幅。`,
          ),
          answer: R,
          wrong: [u + v, Math.abs(y0) + Math.abs(v0), ...(w === 1 ? [] : [Math.round(Math.sqrt(u * u + v0 * v0))])],
          solution: t(
            `$\\omega = ${w}$, so $R = \\sqrt{${par(y0)}^2 + \\left(\\frac{${v0}}{${w}}\\right)^2} = \\sqrt{${u * u} + ${v * v}} = ${R}$.`,
            `$\\omega = ${w}$，所以 $R = \\sqrt{${par(y0)}^2 + \\left(\\frac{${v0}}{${w}}\\right)^2} = \\sqrt{${u * u} + ${v * v}} = ${R}$。`,
          ),
        });
      },
    },
  ],
};

/** dampedOscillators determines critical damping c_crit = 2 √(mk). */
export const dampedOscillators: TopicDef = {
  id: "damped-oscillators",
  title: t("Damped Oscillators", "阻尼振动模型"),
  summary: t(
    "In $my'' + cy' + ky = 0$, the sign of $c^2 - 4mk$ classifies the motion as overdamped ($> 0$), critically damped ($= 0$) or underdamped ($< 0$); critical damping is $c = 2\\sqrt{mk}$.",
    "在 $my'' + cy' + ky = 0$ 中，$c^2 - 4mk$ 的符号把运动分为过阻尼（$> 0$）、临界阻尼（$= 0$）与欠阻尼（$< 0$）；临界阻尼系数为 $c = 2\\sqrt{mk}$。",
  ),
  prerequisites: ["simple-harmonic-oscillators"],
  encompasses: [{ topic: "simple-harmonic-oscillators", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "critical-damping-coefficient",
      title: t("Critical damping coefficient", "临界阻尼系数计算"),
      explanation: t(
        "Critical damping is the boundary between oscillating and not oscillating, which is where the characteristic equation has a repeated root. Critical damping occurs when the characteristic discriminant vanishes: $c_{\\text{crit}}^2 - 4mk = 0 \\implies c_{\\text{crit}} = 2\\sqrt{mk}$.",
        "临界阻尼是振荡与不振荡之间的分界，此时特征方程有重根。当特征方程判别式为零时系统处于临界阻尼状态：$c_{\\text{crit}}^2 - 4mk = 0 \\implies c_{\\text{crit}} = 2\\sqrt{mk}$。",
      ),
      generate(rng: Rng): Problem {
        const p = rng.int(2, 35);
        const mass = 1;
        const springK = p * p;
        const ans = 2 * p;

        const prompt = t(
          `A mass-spring-damper system has mass $m = ${mass}\\text{ kg}$ and spring stiffness $k = ${springK}\\text{ N/m}$. Find the critical damping coefficient $c_{\\text{crit}}$ in $\\text{N}\\cdot\\text{s/m}$.`,
          `质量-弹簧-阻尼系统具有质量 $m = ${mass}\\text{ 千克}$ 和弹簧劲度系数 $k = ${springK}\\text{ 牛/米}$。求系统的临界阻尼系数 $c_{\\text{crit}}$（单位：$\\text{牛}\\cdot\\text{秒/米}$）。`,
        );
        const solution = t(
          steps(
            `The characteristic equation for $m y'' + c y' + k y = 0$ is $m r^2 + c r + k = 0$.`,
            `The discriminant is $\\Delta = c^2 - 4mk$. Critical damping occurs when $\\Delta = 0 \\implies c = 2\\sqrt{mk}$.`,
            `Substitute $m = ${mass}$ and $k = ${springK}$: $c_{\\text{crit}} = 2\\sqrt{${mass} \\times ${springK}} = 2\\sqrt{${springK}} = 2(${p}) = ${ans}\\text{ N}\\cdot\\text{s/m}$.`,
          ),
          steps(
            `阻尼振动方程 $m y'' + c y' + k y = 0$ 的特征方程为 $m r^2 + c r + k = 0$。`,
            `特征方程判别式为 $\\Delta = c^2 - 4mk$。发生临界阻尼时判别式为零：$c = 2\\sqrt{mk}$。`,
            `代入 $m = ${mass}$ 与 $k = ${springK}$：$c_{\\text{crit}} = 2\\sqrt{${mass} \\times ${springK}} = 2\\sqrt{${springK}} = 2(${p}) = ${ans}\\text{ 牛}\\cdot\\text{秒/米}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [p, 4 * p, springK],
        });
      },
    },
    {
      id: "classifying-the-damping-of-an-oscillator",
      title: t("Classifying the damping of an oscillator", "判别振子的阻尼类型"),
      explanation: t(
        "For $my'' + cy' + ky = 0$ the characteristic roots are $\\frac{-c \\pm \\sqrt{c^2 - 4mk}}{2m}$, so the discriminant $c^2 - 4mk$ decides the motion. If it is negative the system is underdamped and oscillates with decaying amplitude. If it is zero the system is critically damped, and if it is positive it is overdamped; in both of these cases it returns to rest without oscillating.",
        "对 $my'' + cy' + ky = 0$，特征根为 $\\frac{-c \\pm \\sqrt{c^2 - 4mk}}{2m}$，所以判别式 $c^2 - 4mk$ 决定运动类型。若它为负，系统欠阻尼，振幅衰减地振荡。若它为零，系统临界阻尼；若为正，系统过阻尼；后两种情形下系统都不振荡地回到静止。",
      ),
      generate(rng: Rng): Problem {
        const m = rng.int(1, 5);
        const kind = rng.int(0, 2);
        const r = rng.int(1, 6);
        const k = kind === 1 ? m * r * r : rng.int(2, 40);
        const c =
          kind === 1
            ? 2 * m * r
            : kind === 0
              ? rng.int(1, Math.max(1, Math.ceil(2 * Math.sqrt(m * k)) - 1))
              : Math.floor(2 * Math.sqrt(m * k)) + rng.int(1, 6);
        const disc = c * c - 4 * m * k;
        const correct = disc < 0 ? 0 : disc === 0 ? 1 : 2;
        return choiceProblem({
          prompt: t(
            `A mass of $${m}\\text{ kg}$ on a spring with $k = ${k}\\text{ N/m}$ has damping $c = ${c}\\text{ N}\\cdot\\text{s/m}$. Classify the damping.`,
            `质量为 $${m}\\text{ kg}$ 的物体挂在 $k = ${k}\\text{ N/m}$ 的弹簧上，阻尼 $c = ${c}\\text{ N}\\cdot\\text{s/m}$。判断阻尼类型。`,
          ),
          options: [t("Underdamped", "欠阻尼"), t("Critically damped", "临界阻尼"), t("Overdamped", "过阻尼")],
          correct,
          solution: t(
            `$c^2 - 4mk = ${c * c} - ${4 * m * k} = ${disc}$, which is ${disc < 0 ? "negative: underdamped" : disc === 0 ? "zero: critically damped" : "positive: overdamped"}.`,
            `$c^2 - 4mk = ${c * c} - ${4 * m * k} = ${disc}$，${disc < 0 ? "为负：欠阻尼" : disc === 0 ? "为零：临界阻尼" : "为正：过阻尼"}。`,
          ),
        });
      },
    },
  ],
};

/** forcedOscillators analyzes steady-state sinusoidal response. */
export const forcedOscillators: TopicDef = {
  id: "forced-oscillators",
  title: t("Forced Oscillators", "受迫振动模型"),
  summary: t(
    "In $my'' + cy' + ky = F_0 \\cos \\omega t$, damping makes the transient homogeneous response die out, leaving the periodic steady-state response.",
    "在 $my'' + cy' + ky = F_0 \\cos \\omega t$ 中，阻尼使齐次瞬态解衰减，最终只留下周期稳态解。",
  ),
  prerequisites: ["damped-oscillators"],
  encompasses: [{ topic: "damped-oscillators", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "steady-state-forced-oscillation",
      title: t("Steady-state forced oscillation response", "受迫振动的稳态响应与衰减"),
      explanation: t(
        "For an underdamped oscillator with $c > 0$, the roots of $m r^2 + c r + k = 0$ have negative real part $-\\frac{c}{2m}$, so the homogeneous transient solution decays exponentially to zero as $t \\to \\infty$.",
        "对于阻尼系数 $c > 0$ 的欠阻尼系统，特征根具有负实部 $-\\frac{c}{2m}$，因此当 $t \\to \\infty$ 时齐次瞬态解按指数规律衰减趋于零。",
      ),
      generate(rng: Rng): Problem {
        const decayRate = rng.int(1, 12);
        const beta = rng.int(1, 12);
        const c = 2 * decayRate;
        const k = decayRate * decayRate + beta * beta;
        const ans = decayRate;

        const prompt = t(
          `In a damped forced oscillator $y'' + ${c}y' + ${k}y = 10\\cos(3t)$, the transient homogeneous solution decays proportional to $e^{-\\gamma t}$. Find the decay coefficient $\\gamma$.`,
          `在阻尼受迫振子系统 $y'' + ${c}y' + ${k}y = 10\\cos(3t)$ 中，齐次瞬态响应解按 $e^{-\\gamma t}$ 规律衰减。求衰减系数 $\\gamma$ 的值。`,
        );
        const solution = t(
          steps(
            `The characteristic equation of the homogeneous system is $r^2 + ${c}r + ${k} = 0$.`,
            `The roots are $r = -\\frac{${c}}{2} \\pm \\sqrt{${decayRate * decayRate} - ${k}} = -${decayRate} \\pm ${beta}i$.`,
            `The homogeneous solution has exponential factor $e^{-${decayRate}t}$.`,
            `Therefore, the decay coefficient is $\\gamma = ${ans}$.`,
          ),
          steps(
            `齐次部分的特征方程为 $r^2 + ${c}r + ${k} = 0$。`,
            `求根公式：$r = -\\frac{${c}}{2} \\pm \\sqrt{${decayRate * decayRate} - ${k}} = -${decayRate} \\pm ${beta}i$。`,
            `齐次解包含指数包络因子 $e^{-${decayRate}t}$。`,
            `因此，衰减系数为 $\\gamma = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [c, beta, k],
        });
      },
    },
    {
      id: "the-steady-state-amplitude-of-a-forced-oscillator",
      title: t("The steady-state amplitude of a forced oscillator", "受迫振子的稳态振幅"),
      explanation: t(
        "For $y'' + cy' + ky = F\\cos \\omega t$ with $c > 0$ the transient dies out and the motion settles into the steady state $A\\cos \\omega t + B\\sin \\omega t$. Its amplitude is\n\n$$\\sqrt{A^2 + B^2} = \\frac{F}{\\sqrt{(k - \\omega^2)^2 + c^2\\omega^2}}.$$\n\nThe denominator combines the mismatch $k - \\omega^2$ between the natural and the driving frequency with the damping term $c\\omega$.",
        "对 $y'' + cy' + ky = F\\cos \\omega t$（$c > 0$），暂态消失，运动趋于稳态 $A\\cos \\omega t + B\\sin \\omega t$。其振幅为\n\n$$\\sqrt{A^2 + B^2} = \\frac{F}{\\sqrt{(k - \\omega^2)^2 + c^2\\omega^2}}.$$\n\n分母把固有频率与驱动频率的失配 $k - \\omega^2$ 和阻尼项 $c\\omega$ 结合在一起。",
      ),
      generate(rng: Rng): Problem {
        const w = rng.int(1, 4);
        const u = rng.int(1, 2);
        const [p0, q] = rng.pick([
          [3, 4],
          [4, 3],
          [-3, 4],
          [-4, 3],
        ] as const);
        const p = w * w + p0 * w * u > 0 ? p0 : -p0;
        const c = q * u;
        const k = w * w + p * w * u;
        const F = rng.int(1, 12) * 5;
        const ans = Q.of(F, 5 * w * u);
        const wt = w === 1 ? "t" : `${w}t`;
        return numberProblem({
          prompt: t(
            `Find the steady-state amplitude of $${poly([1, "y''"], [c, "y'"], [k, "y"])} = ${F}\\cos ${wt}$.`,
            `求 $${poly([1, "y''"], [c, "y'"], [k, "y"])} = ${F}\\cos ${wt}$ 的稳态振幅。`,
          ),
          answer: ans,
          wrong: [Q.of(F, Math.abs(k - w * w) + c * w), Q.of(F, k), Q.of(F, 25 * w * w * u * u)],
          solution: t(
            `$k - \\omega^2 = ${k - w * w}$ and $c\\omega = ${c * w}$, so the amplitude is $\\frac{${F}}{\\sqrt{${(k - w * w) ** 2} + ${(c * w) ** 2}}} = \\frac{${F}}{${5 * w * u}}${lowestTerms(F, 5 * w * u)}$.`,
            `$k - \\omega^2 = ${k - w * w}$，$c\\omega = ${c * w}$，所以振幅为 $\\frac{${F}}{\\sqrt{${(k - w * w) ** 2} + ${(c * w) ** 2}}} = \\frac{${F}}{${5 * w * u}}${lowestTerms(F, 5 * w * u)}$。`,
          ),
        });
      },
    },
  ],
};

/** resonanceInVibratingSystems models pure resonance. */
export const resonanceInVibratingSystems: TopicDef = {
  id: "resonance-in-vibrating-systems",
  title: t("Resonance in Vibrating Systems", "振动系统中的共振现象"),
  summary: t(
    "Driving an undamped system at its natural frequency ($\\omega = \\omega_0$) causes pure resonance: $y_p = \\frac{F_0}{2m\\omega_0} t \\sin \\omega_0 t$, whose amplitude grows linearly.",
    "以固有频率（$\\omega = \\omega_0$）驱动无阻尼系统会发生纯共振：$y_p = \\frac{F_0}{2m\\omega_0} t \\sin \\omega_0 t$，振幅线性增长。",
  ),
  prerequisites: ["forced-oscillators"],
  encompasses: [{ topic: "forced-oscillators", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "pure-resonance-amplitude-growth",
      title: t("Linear amplitude growth rate in pure resonance", "纯共振下的线性振幅增长速率"),
      explanation: t(
        "When the forcing matches the natural frequency exactly and there is no damping, each push adds to the motion, so the amplitude grows steadily in time. For $y'' + \\omega_0^2 y = F_0 \\cos(\\omega_0 t)$, the particular solution is $y_p(t) = \\frac{F_0}{2\\omega_0} t \\sin(\\omega_0 t)$, where the amplitude envelope grows at rate $\\frac{F_0}{2\\omega_0}$.",
        "当强迫频率恰好等于固有频率且没有阻尼时，每一次推动都会加强运动，所以振幅随时间稳定增长。对于纯共振方程 $y'' + \\omega_0^2 y = F_0 \\cos(\\omega_0 t)$，特解为 $y_p(t) = \\frac{F_0}{2\\omega_0} t \\sin(\\omega_0 t)$，振幅包络按速率 $\\frac{F_0}{2\\omega_0}$ 随时间线性发散。",
      ),
      generate(rng: Rng): Problem {
        const omega0 = rng.int(2, 8);
        const rate = rng.int(2, 10);
        const F0 = rate * 2 * omega0;
        const ans = rate;

        const prompt = t(
          `An undamped vibrating system satisfies $y'' + ${omega0 * omega0}y = ${F0}\\cos(${omega0}t)$. The resonating particular solution has the form $y_p(t) = K t \\sin(${omega0}t)$. Find the constant $K$.`,
          `一个无阻尼振动系统满足 $y'' + ${omega0 * omega0}y = ${F0}\\cos(${omega0}t)$。共振特解具有形式 $y_p(t) = K t \\sin(${omega0}t)$。求常数 $K$ 的值。`,
        );
        const solution = t(
          steps(
            `Since the driving frequency matches the natural frequency $\\omega_0 = ${omega0}$, resonance occurs.`,
            `The particular solution has the form $y_p(t) = K t \\sin(${omega0}t)$.`,
            `Differentiate and substitute into $y'' + ${omega0 * omega0}y$: $2(${omega0}) K \\cos(${omega0}t) = ${F0}\\cos(${omega0}t)$.`,
            `Solve for $K$: $K = \\frac{${F0}}{2(${omega0})} = \\frac{${F0}}{${2 * omega0}} = ${ans}$.`,
          ),
          steps(
            `由于激励频率与固有频率 $\\omega_0 = ${omega0}$ 一致，系统发生共振。`,
            `共振特解形式为 $y_p(t) = K t \\sin(${omega0}t)$。`,
            `求导并代入微分方程化简得：$2(${omega0}) K \\cos(${omega0}t) = ${F0}\\cos(${omega0}t)$。`,
            `解出系数 $K$：$K = \\frac{${F0}}{2(${omega0})} = \\frac{${F0}}{${2 * omega0}} = ${ans}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [F0, ans * 2, omega0],
        });
      },
    },
    {
      id: "the-practical-resonance-frequency",
      title: t("The practical resonance frequency", "实际共振频率"),
      explanation: t(
        "With damping, the steady-state amplitude $\\frac{F}{\\sqrt{(k - \\omega^2)^2 + c^2\\omega^2}}$ of $y'' + cy' + ky = F\\cos \\omega t$ stays finite. It is largest where the expression under the root is smallest; differentiating in $\\omega^2$ gives\n\n$$\\omega_r^2 = k - \\frac{c^2}{2},$$\n\nwhen this is positive. The peak sits below the natural frequency $\\sqrt{k}$, and with heavy damping ($c^2 \\ge 2k$) there is no resonance peak at all.",
        "有阻尼时，$y'' + cy' + ky = F\\cos \\omega t$ 的稳态振幅 $\\frac{F}{\\sqrt{(k - \\omega^2)^2 + c^2\\omega^2}}$ 保持有限。根号下的式子最小时振幅最大；对 $\\omega^2$ 求导得\n\n$$\\omega_r^2 = k - \\frac{c^2}{2},$$\n\n前提是它为正。峰值位于固有频率 $\\sqrt{k}$ 之下；阻尼很大（$c^2 \\ge 2k$）时根本没有共振峰。",
      ),
      generate(rng: Rng): Problem {
        const wr = rng.int(1, 7);
        const v = rng.int(1, 4);
        const c = 2 * v;
        const k = wr * wr + 2 * v * v;
        const F = rng.int(2, 9);
        return numberProblem({
          prompt: t(
            `For $${poly([1, "y''"], [c, "y'"], [k, "y"])} = ${F}\\cos \\omega t$, find the driving frequency $\\omega > 0$ that maximizes the steady-state amplitude.`,
            `对 $${poly([1, "y''"], [c, "y'"], [k, "y"])} = ${F}\\cos \\omega t$，求使稳态振幅最大的驱动频率 $\\omega > 0$。`,
          ),
          answer: wr,
          wrong: [wr * wr, ...(Number.isInteger(Math.sqrt(k)) ? [Math.sqrt(k)] : []), k - c],
          solution: t(
            `$\\omega_r^2 = ${k} - \\frac{${c}^2}{2} = ${k} - ${2 * v * v} = ${wr * wr}$, so $\\omega_r = ${wr}$.`,
            `$\\omega_r^2 = ${k} - \\frac{${c}^2}{2} = ${k} - ${2 * v * v} = ${wr * wr}$，所以 $\\omega_r = ${wr}$。`,
          ),
        });
      },
    },
  ],
};

/** modelingCapacitorChargeInRclCircuitsWithSecondOrderOdes models L q'' + R q' + q/C = E(t). */
export const modelingCapacitorChargeInRclCircuitsWithSecondOrderOdes: TopicDef = {
  id: "modeling-capacitor-charge-in-rcl-circuits-with-second-order-odes",
  title: t("Modeling Capacitor Charge in RCL Circuits With Second-Order ODEs", "二阶常微分方程建模 RCL 电路中的电容器电荷"),
  summary: t(
    "Kirchhoff's law for a series RCL circuit gives $Lq'' + Rq' + \\frac{1}{C}q = E(t)$ for the capacitor charge, with resonant frequency $\\omega_0 = \\frac{1}{\\sqrt{LC}}$.",
    "串联 RCL 电路的基尔霍夫定律给出电容器电荷方程 $Lq'' + Rq' + \\frac{1}{C}q = E(t)$，共振频率为 $\\omega_0 = \\frac{1}{\\sqrt{LC}}$。",
  ),
  prerequisites: ["simple-harmonic-oscillators"],
  encompasses: [{ topic: "simple-harmonic-oscillators", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    {
      id: "rcl-natural-frequency",
      title: t("Resonant natural frequency of an LC circuit", "LC 谐振回路的固有振荡频率"),
      explanation: t(
        "A circuit with an inductor and a capacitor obeys the same equation as a mass on a spring, with inductance playing the role of mass. In an ideal LC circuit ($R = 0$), charge satisfies $L q'' + \\frac{1}{C} q = 0$, oscillating at natural frequency $\\omega_0 = \\frac{1}{\\sqrt{LC}}$.",
        "含电感和电容的电路与弹簧上的物体满足同样的方程，电感起着质量的作用。在理想无阻尼 LC 电路（$R = 0$）中，电荷满足 $L q'' + \\frac{1}{C} q = 0$，固有自由振荡角频率为 $\\omega_0 = \\frac{1}{\\sqrt{LC}}$。",
      ),
      generate(rng: Rng): Problem {
        const omega0 = rng.int(2, 40);
        const omega0Sq = omega0 * omega0;
        const ans = omega0;

        const prompt = t(
          `An LC circuit contains an inductor and capacitor with parameter ratio $\\frac{1}{LC} = ${omega0Sq}\\text{ s}^{-2}$. Find the undamped natural frequency $\\omega_0$ in $\\text{rad/s}$.`,
          `一个 LC 回路中电感与电容参数满足 $\\frac{1}{LC} = ${omega0Sq}\\text{ 秒}^{-2}$。求其无阻尼固有角频率 $\\omega_0$（单位：$\\text{弧度/秒}$）。`,
        );
        const solution = t(
          steps(
            `The differential equation for the charge is $L q'' + \\frac{1}{C}q = 0 \\implies q'' + \\frac{1}{LC}q = 0$.`,
            `The natural frequency satisfies $\\omega_0^2 = \\frac{1}{LC} = ${omega0Sq}$.`,
            `Take the square root: $\\omega_0 = \\sqrt{${omega0Sq}} = ${ans}\\text{ rad/s}$.`,
          ),
          steps(
            `电荷量的微分方程为 $L q'' + \\frac{1}{C}q = 0 \\implies q'' + \\frac{1}{LC}q = 0$。`,
            `固有振荡角频率满足 $\\omega_0^2 = \\frac{1}{LC} = ${omega0Sq}$。`,
            `开平方求得：$\\omega_0 = \\sqrt{${omega0Sq}} = ${ans}\\text{ 弧度/秒}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [omega0Sq, ans * 2, Math.round(omega0 / 2)],
        });
      },
    },
    {
      id: "the-damped-frequency-of-capacitor-charge",
      title: t("The damped frequency of capacitor charge", "电容电荷的阻尼振荡频率"),
      explanation: t(
        "The charge in a series RCL circuit satisfies $Lq'' + Rq' + \\frac{1}{C}q = E(t)$. Its characteristic roots are\n\n$$-\\frac{R}{2L} \\pm i\\sqrt{\\frac{1}{LC} - \\frac{R^2}{4L^2}}$$\n\nwhen $R^2 < \\frac{4L}{C}$. Then the charge oscillates with the damped angular frequency $\\omega_d = \\sqrt{\\frac{1}{LC} - \\frac{R^2}{4L^2}}$, which is lower than the undamped $\\frac{1}{\\sqrt{LC}}$.",
        "串联 RCL 电路中的电荷满足 $Lq'' + Rq' + \\frac{1}{C}q = E(t)$。当 $R^2 < \\frac{4L}{C}$ 时，其特征根为\n\n$$-\\frac{R}{2L} \\pm i\\sqrt{\\frac{1}{LC} - \\frac{R^2}{4L^2}}.$$\n\n此时电荷以阻尼角频率 $\\omega_d = \\sqrt{\\frac{1}{LC} - \\frac{R^2}{4L^2}}$ 振荡，它低于无阻尼频率 $\\frac{1}{\\sqrt{LC}}$。",
      ),
      generate(rng: Rng): Problem {
        const L = rng.int(1, 4);
        const al = rng.int(1, 5);
        const be = rng.int(1, 8);
        const R = 2 * L * al;
        const n = L * (al * al + be * be);
        const E = rng.int(1, 12) * 10;
        return numberProblem({
          prompt: t(
            `A series circuit has $L = ${L}\\text{ H}$, $R = ${R}\\ \\Omega$, $C = \\frac{1}{${n}}\\text{ F}$ and $E = ${E}\\text{ V}$. Find the damped angular frequency $\\omega_d$ of the charge in $\\text{rad/s}$.`,
            `串联电路中 $L = ${L}\\text{ H}$，$R = ${R}\\ \\Omega$，$C = \\frac{1}{${n}}\\text{ F}$，$E = ${E}\\text{ V}$。求电荷的阻尼角频率 $\\omega_d$（单位 $\\text{rad/s}$）。`,
          ),
          answer: be,
          wrong: [be * be, al, al * al + be * be],
          solution: t(
            `$\\frac{1}{LC} = ${al * al + be * be}$ and $\\frac{R}{2L} = ${al}$, so $\\omega_d = \\sqrt{${al * al + be * be} - ${al * al}} = ${be}$.`,
            `$\\frac{1}{LC} = ${al * al + be * be}$，$\\frac{R}{2L} = ${al}$，所以 $\\omega_d = \\sqrt{${al * al + be * be} - ${al * al}} = ${be}$。`,
          ),
        });
      },
    },
  ],
};

/** modelingCurrentInRclCircuitsWithSecondOrderOdes models L i'' + R i' + (1/C) i = E'(t). */
export const modelingCurrentInRclCircuitsWithSecondOrderOdes: TopicDef = {
  id: "modeling-current-in-rcl-circuits-with-second-order-odes",
  title: t("Modeling Current in RCL Circuits With Second-Order ODEs", "二阶常微分方程建模 RCL 电路中的电流"),
  summary: t(
    "Differentiating the charge equation with i = dq/dt yields the current equation: L i'' + R i' + (1/C) i = E'(t).",
    "利用电流定义 i = dq/dt 对电荷方程逐项求导，得到回路电流满足的二阶微分方程：L i'' + R i' + (1/C) i = E'(t)。",
  ),
  prerequisites: ["modeling-capacitor-charge-in-rcl-circuits-with-second-order-odes"],
  encompasses: [
    {
      topic: "modeling-capacitor-charge-in-rcl-circuits-with-second-order-odes",
      weight: 0.3,
    },
  ],
  xp: 10,
  knowledgePoints: [
    {
      id: "rcl-current-differential-equation",
      title: t("Forcing term in the current differential equation", "电流微分方程中的激励导数项"),
      explanation: t(
        "Differentiating the charge equation once turns it into an equation for the current, and the forcing term becomes the derivative of the voltage. Differentiating $L q'' + R q' + \\frac{1}{C} q = E(t)$ with $i = q'$ yields $L i'' + R i' + \\frac{1}{C} i = E'(t)$. For $E(t) = E_0 \\sin(\\omega t)$, the forcing term is $E'(t) = \\omega E_0 \\cos(\\omega t)$.",
        "把电荷方程求导一次，就变成关于电流的方程，强迫项变为电压的导数。对回路方程 $L q'' + R q' + \\frac{1}{C} q = E(t)$ 求导，得 $L i'' + R i' + \\frac{1}{C} i = E'(t)$。当电源为正弦交流电 $E(t) = E_0 \\sin(\\omega t)$ 时，电流方程的激励项为 $E'(t) = \\omega E_0 \\cos(\\omega t)$。",
      ),
      generate(rng: Rng): Problem {
        const E0 = rng.int(5, 50);
        const omega = rng.int(2, 10);
        const ans = omega * E0;

        const prompt = t(
          `In an RCL circuit driven by an alternating voltage $E(t) = ${E0}\\sin(${omega}t)\\text{ V}$, the current $i(t)$ satisfies $L i'' + R i' + \\frac{1}{C}i = E'(t)$. Find the amplitude of the forcing term $E'(t)$ in $\\text{V/s}$.`,
          `在由交流电源 $E(t) = ${E0}\\sin(${omega}t)\\text{ 伏}$ 驱动的 RCL 电路中，电流 $i(t)$ 满足方程 $L i'' + R i' + \\frac{1}{C}i = E'(t)$。求激励源导数项 $E'(t)$ 的幅值大小（单位：$\\text{伏/秒}$）。`,
        );
        const solution = t(
          steps(
            `Differentiate $E(t) = ${E0}\\sin(${omega}t)$ with respect to $t$: $E'(t) = ${E0} \\times ${omega} \\cos(${omega}t) = ${ans}\\cos(${omega}t)$.`,
            `The amplitude of $E'(t)$ is $\\omega E_0 = ${ans}\\text{ V/s}$.`,
          ),
          steps(
            `对电源电压 $E(t) = ${E0}\\sin(${omega}t)$ 关于时间 $t$ 求导：$E'(t) = ${E0} \\times ${omega} \\cos(${omega}t) = ${ans}\\cos(${omega}t)$。`,
            `激励项的幅值为 $\\omega E_0 = ${ans}\\text{ 伏/秒}$。`,
          ),
        );

        return numberProblem({
          prompt,
          solution,
          answer: ans,
          wrong: [E0, omega, ans * 2],
        });
      },
    },
    {
      id: "the-steady-state-current-amplitude",
      title: t("The steady-state current amplitude", "稳态电流振幅"),
      explanation: t(
        "Driven by $E(t) = E_0\\sin \\omega t$, a series RCL circuit settles into a sinusoidal current whose amplitude is the voltage amplitude divided by the impedance:\n\n$$I = \\frac{E_0}{Z}, \\qquad Z = \\sqrt{R^2 + X^2}, \\qquad X = \\omega L - \\frac{1}{\\omega C}.$$\n\nThe reactance $X$ can be negative when the capacitor dominates; only its square enters $Z$. When $X = 0$ the current amplitude is largest, $E_0/R$.",
        "在 $E(t) = E_0\\sin \\omega t$ 驱动下，串联 RCL 电路趋于正弦电流，其振幅等于电压振幅除以阻抗：\n\n$$I = \\frac{E_0}{Z}, \\qquad Z = \\sqrt{R^2 + X^2}, \\qquad X = \\omega L - \\frac{1}{\\omega C}.$$\n\n电容占主导时电抗 $X$ 可以为负；进入 $Z$ 的只是它的平方。当 $X = 0$ 时电流振幅最大，为 $E_0/R$。",
      ),
      generate(rng: Rng): Problem {
        const s = rng.int(1, 4);
        const [rf, xf] = rng.pick([
          [3, 4],
          [4, 3],
          [3, -4],
          [4, -3],
          [6, 8],
          [8, -6],
        ] as const);
        const R = rf * s;
        const X = xf * s;
        const Z = Math.sqrt(R * R + X * X);
        const w = rng.int(2, 10);
        const lo = Math.max(1, Math.ceil((X + 1) / w));
        const L = rng.int(lo, lo + 3);
        const cap = w * L - X;
        const E0 = rng.int(1, 12) * 10;
        const ans = Q.of(E0, Z);
        return numberProblem({
          prompt: t(
            `A series circuit with $R = ${R}\\ \\Omega$, $L = ${L}\\text{ H}$ and $C = \\frac{1}{${w * cap}}\\text{ F}$ is driven by $E(t) = ${E0}\\sin ${w}t\\text{ V}$. Find the steady-state current amplitude in amperes.`,
            `串联电路中 $R = ${R}\\ \\Omega$，$L = ${L}\\text{ H}$，$C = \\frac{1}{${w * cap}}\\text{ F}$，由 $E(t) = ${E0}\\sin ${w}t\\text{ V}$ 驱动。求稳态电流振幅（单位安培）。`,
          ),
          answer: ans,
          wrong: [Q.of(E0, R), Q.of(E0, R + Math.abs(X)), Q.of(E0 * w, Z)],
          solution: t(
            `$\\omega L = ${w * L}$ and $\\frac{1}{\\omega C} = ${cap}$, so $X = ${X}$ and $Z = \\sqrt{${R * R} + ${X * X}} = ${Z}$. Then $I = \\frac{${E0}}{${Z}}${lowestTerms(E0, Z)}$.`,
            `$\\omega L = ${w * L}$，$\\frac{1}{\\omega C} = ${cap}$，所以 $X = ${X}$，$Z = \\sqrt{${R * R} + ${X * X}} = ${Z}$。于是 $I = \\frac{${E0}}{${Z}}${lowestTerms(E0, Z)}$。`,
          ),
        });
      },
    },
  ],
};

/** differentialEquationsLinearTopics gathers all 29 Unit 3 topics. */
export const differentialEquationsLinearTopics: TopicDef[] = [
  differentialOperators,
  linearDifferentialOperators,
  introductionToSecondOrderLinearOdes,
  theSuperpositionPrinciple,
  reductionOfOrder,
  linearIndependenceOfSolutionsToHomogeneousOdes,
  generalSolutionsOfLinearOdes,
  abelsIdentity,
  secondOrderHomogeneousOdesCharacteristicEquationsWithDistinctRealRoots,
  secondOrderHomogeneousOdesCharacteristicEquationsWithRepeatedRoots,
  secondOrderHomogeneousOdesCharacteristicEquationsWithComplexRoots,
  secondOrderHomogeneousInitialValueProblems,
  secondOrderInhomogeneousOdesWithPolynomialForcing,
  secondOrderInhomogeneousOdesWithExponentialForcing,
  secondOrderInhomogeneousOdesWithSinusoidalForcing,
  cauchyEulerEquationsCharacteristicEquationsWithDistinctRealRoots,
  cauchyEulerEquationsCharacteristicEquationsWithRepeatedRoots,
  cauchyEulerEquationsCharacteristicEquationsWithComplexRoots,
  cauchyEulerEquationsWithForcing,
  variationOfParametersForFirstOrderLinearOdes,
  variationOfParametersForSecondOrderOdes,
  solvingSecondOrderOdesUsingVariationOfParameters,
  variationOfParametersWithHigherOrderOdes,
  simpleHarmonicOscillators,
  dampedOscillators,
  forcedOscillators,
  resonanceInVibratingSystems,
  modelingCapacitorChargeInRclCircuitsWithSecondOrderOdes,
  modelingCurrentInRclCircuitsWithSecondOrderOdes,
];
