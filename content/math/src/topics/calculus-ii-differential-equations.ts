import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, type PlaneMark, plane, poly, Q } from "@ga/subject-math";
import { calculusDrawings5 } from "../explanation-drawings-calculus-5.ts";

import { explainedChoice, numberProblem, say, verdictChoice } from "../problems.ts";
import { functionWith, type Said, type Step, walked } from "./calculus-i-differentiation.ts";

// Calculus II unit 5: Differential Equations, modules 5.24–5.28.

/** neg wraps a negative number in parentheses for substitution. */
const neg = (v: number | Q) => {
  const q = v instanceof Q ? v : Q.of(v);
  return q.sign() < 0 ? `\\left(${q.toLatex()}\\right)` : q.toLatex();
};

/** plus writes " + n" or " - n" after another term, or nothing for 0. */
const plus = (n: number) => (n === 0 ? "" : n > 0 ? ` + ${n}` : ` - ${-n}`);

/** factors writes (y − a)(y − b) for roots a < b, putting a bare y first when a root is 0. */
const factors = (a: number, b: number, v = "y") => {
  const one = (r: number) => (r === 0 ? v : `(${linear(1, -r, v)})`);
  return b === 0 ? `${one(b)}${one(a)}` : `${one(a)}${one(b)}`;
};

/** derivativeName writes y, y', y'', y''' or y⁽ⁿ⁾. */
const derivativeName = (k: number) => (k === 0 ? "y" : k <= 3 ? `y${"'".repeat(k)}` : `y^{(${k})}`);

/** rightSides are functions of x for the right side of an equation. */
const rightSides = ["x^{2}", "\\sin x", "e^{x}", "0", "3x - 1", "\\cos 2x"] as const;

/** Mistake is a wrong number with what to say about it. */
type Mistake = { readonly value: Q; readonly why: Text };

/** slip is a wrong number with its reason in English and Chinese. */
const slip = (value: Q | number, en: string, zh: string): Mistake => ({
  value: typeof value === "number" ? Q.of(value) : value,
  why: t(en, zh),
});

/** step is a labelled step of a worked solution with its displayed lines. */
const step = (en: string, zh: string, said: Text, ...lines: string[]): Step => [[en, zh], said, lines];

/** worked asks for a number and explains it in labelled steps with a check; each wrong value keeps its first reason. */
function worked(prompt: Text, answer: Q | number, parts: readonly Step[], check: Text, mistakes: readonly Mistake[]): Problem {
  const right = typeof answer === "number" ? Q.of(answer) : answer;
  const kept = mistakes.filter((m, i) => !m.value.eq(right) && mistakes.findIndex((n) => n.value.eq(m.value)) === i);
  return numberProblem({ prompt, answer: right, mistakes: kept, solution: walked(parts, check) });
}

/** Exact is what an expression question asks: its prompt, answer and how the field is shown. */
interface Exact {
  readonly prompt: Text;
  readonly answer: string;
  readonly prefix: string;
  readonly variable?: string;
  readonly antiderivative?: boolean;
}

/** exact asks for an expression and explains it in labelled steps with a check; each wrong response has its reason. */
function exact(p: Exact, parts: readonly Step[], check: Text, mistakes: readonly Said[]): Problem {
  return functionWith(
    { ...p, solution: walked(parts, check) },
    mistakes.filter((m) => m.response !== p.answer),
  );
}

/** Option is a wrong option of a choice with what is wrong with it. */
type Option = { readonly option: Text; readonly why: Text };

/** because pairs a wrong option with its reason. */
const because = (option: Text, en: string, zh: string): Option => ({ option, why: t(en, zh) });

/** opt shows a formula as an option. */
const opt = (s: string) => t(`$${s}$`, `$${s}$`);

/** choose asks a choice whose wrong options are explained, with a worked solution. */
function choose(rng: Rng, prompt: Text, correct: Text, wrong: readonly Option[], parts: readonly Step[], check: Text, figure?: Figure) {
  return explainedChoice(rng, { prompt, correct, wrong, solution: walked(parts, check), ...(figure && { figure }) });
}

/** leibniz writes the k-th derivative in Leibniz notation. */
const leibniz = (k: number) => (k === 0 ? "y" : k === 1 ? "\\frac{dy}{dx}" : `\\frac{d^{${k}}y}{dx^{${k}}}`);

/** LinearityCase is one equation for the linear-or-nonlinear question, with what makes it so. */
interface LinearityCase {
  readonly left: string;
  readonly linear: boolean;
  readonly look: Text;
  readonly form: Text;
}

/** linearityCase picks a linear or a nonlinear equation. */
function linearityCase(rng: Rng): LinearityCase {
  const a = rng.int(2, 9);
  const b = rng.int(2, 9);
  const kind = rng.int(0, 5);
  const linearLook = (terms: string) =>
    t(
      `The terms with $y$ are ${terms}: each is $y$ or one of its derivatives, to the first power, times a function of $x$ alone.`,
      `含 $y$ 的项是 ${terms}：每一项都是 $y$ 或它的某阶导数的一次方，乘以只含 $x$ 的函数。`,
    );
  const linearForm = (coefficients: string) =>
    t(
      `It has the linear form $a_n(x)y^{(n)} + \\dots + a_1(x)y' + a_0(x)y = g(x)$ with ${coefficients}.`,
      `它具有线性形式 $a_n(x)y^{(n)} + \\dots + a_1(x)y' + a_0(x)y = g(x)$，其中 ${coefficients}。`,
    );
  const nonlinearForm = (term: string) =>
    t(
      `In the linear form $a_n(x)y^{(n)} + \\dots + a_0(x)y = g(x)$ each term is a function of $x$ times $y$ or one derivative; $${term}$ cannot be written that way.`,
      `在线性形式 $a_n(x)y^{(n)} + \\dots + a_0(x)y = g(x)$ 中，每一项都是关于 $x$ 的函数乘以 $y$ 或某一阶导数；$${term}$ 写不成这样。`,
    );
  if (kind === 0)
    return {
      left: `y'' + ${a}xy' - ${b}y`,
      linear: true,
      look: linearLook(`$y''$, $${a}xy'$ and $-${b}y$`),
      form: linearForm(`$a_2 = 1$, $a_1 = ${a}x$, $a_0 = -${b}$`),
    };
  if (kind === 1)
    return {
      left: `x^{${a}}y' + ${b}y`,
      linear: true,
      look: linearLook(`$x^{${a}}y'$ and $${b}y$`),
      form: linearForm(`$a_1 = x^{${a}}$, $a_0 = ${b}$`),
    };
  if (kind === 2)
    return {
      left: `y''' - ${a}y' + e^{x}y`,
      linear: true,
      look: linearLook(`$y'''$, $-${a}y'$ and $e^{x}y$`),
      form: linearForm(`$a_3 = 1$, $a_1 = -${a}$, $a_0 = e^{x}$`),
    };
  if (kind === 3)
    return {
      left: `y'' + ${a}yy'`,
      linear: false,
      look: t(`The term $${a}yy'$ multiplies $y$ by its own derivative.`, `项 $${a}yy'$ 把 $y$ 与它自己的导数相乘。`),
      form: nonlinearForm(`${a}yy'`),
    };
  if (kind === 4)
    return {
      left: `(y')^{${a}} - ${b}y`,
      linear: false,
      look: t(`The term $(y')^{${a}}$ raises the derivative to the power $${a}$.`, `项 $(y')^{${a}}$ 把导数取了 $${a}$ 次方。`),
      form: nonlinearForm(`(y')^{${a}}`),
    };
  return {
    left: `y' + ${b}\\sin y`,
    linear: false,
    look: t(`The term $${b}\\sin y$ puts $y$ inside the sine.`, `项 $${b}\\sin y$ 把 $y$ 放进了正弦函数里。`),
    form: nonlinearForm(`${b}\\sin y`),
  };
}

/** introductionToDifferentialEquations defines differential equations and their order. */
export const introductionToDifferentialEquations: TopicDef = {
  id: "introduction-to-differential-equations",
  title: t("Introduction to Differential Equations", "微分方程简介"),
  summary: t(
    "A differential equation relates a function to its derivatives; its order is the highest derivative that appears.",
    "微分方程把函数与它的导数联系起来；方程的阶是其中出现的最高阶导数的阶数。",
  ),
  intro: t(
    "A differential equation is an equation for an unknown function that involves its derivatives. For example, $y'' + y = 0$ says that the second derivative of $y$ is the negative of $y$. The function $y = \\sin x$ satisfies it:\n\n$$y'' = -\\sin x, \\qquad y'' + y = -\\sin x + \\sin x = 0 \\text{ for every } x.$$\n\nThe highest derivative in the equation is $y''$, so the equation has order $2$, and it is linear because $y$ and $y''$ appear only to the first power.\n\nCheck: differentiate one step at a time: $y' = \\cos x$ and $y'' = -\\sin x$, which is $-y$.\n\nIn this lesson we read the order of a differential equation from its highest derivative and tell linear equations from nonlinear ones.",
    "微分方程是关于未知函数、并含有它的导数的方程。例如 $y'' + y = 0$ 说的是 $y$ 的二阶导数等于 $y$ 的相反数。函数 $y = \\sin x$ 满足它：\n\n$$y'' = -\\sin x, \\qquad y'' + y = -\\sin x + \\sin x = 0 \\text{ 对每个 } x \\text{ 成立}$$\n\n方程中最高阶的导数是 $y''$，所以方程是 $2$ 阶的；$y$ 和 $y''$ 都只以一次方出现，所以它是线性的。\n\n检验：逐次求导：$y' = \\cos x$，$y'' = -\\sin x$，正好是 $-y$。\n\n本课我们根据最高阶导数读出微分方程的阶，并区分线性方程与非线性方程。",
  ),
  prerequisites: ["second-and-higher-order-derivatives"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-order-of-a-differential-equation",
      title: t("The order of a differential equation", "微分方程的阶"),
      explanation: t(
        "A **differential equation** is an equation involving an unknown function $y$ and its derivatives, such as $y'' + 4y = 0$. A **solution** is a function that makes it true. The **order** is the order of the highest derivative, not the highest power: $(y')^{3} + y = x$ has order $1$, and $y''' - 2(y')^{4} = 0$ has order $3$.\n\nCheck: in Leibniz notation $y'''$ is $\\frac{d^{3}y}{dx^{3}}$, and the $3$ counts how many times $y$ is differentiated, so the order is $3$.\n\n> **Watch out.** A power on a derivative does not raise the order: $(y')^{4}$ is still a first derivative, multiplied by itself.",
        "**微分方程**是含有未知函数 $y$ 及其导数的方程，例如 $y'' + 4y = 0$。使方程成立的函数叫做它的**解**。方程的**阶**是最高阶导数的阶数，而不是最高的幂次：$(y')^{3} + y = x$ 是 $1$ 阶的，$y''' - 2(y')^{4} = 0$ 是 $3$ 阶的。\n\n检验：用莱布尼茨记号，$y'''$ 就是 $\\frac{d^{3}y}{dx^{3}}$，其中的 $3$ 数的是 $y$ 被求导的次数，所以阶为 $3$。\n\n> **注意。** 导数上的幂次不会提高阶：$(y')^{4}$ 仍然是一阶导数，只是自乘了几次。",
      ),
      generate(rng) {
        const n = rng.int(1, 4);
        const low = rng.int(0, n - 1);
        const p = rng.int(2, 5);
        const c = rng.nonZero(-6, 6);
        const lowTerm = low === 0 ? `y^{${p}}` : `(${derivativeName(low)})^{${p}}`;
        const terms = rng.shuffle([derivativeName(n), poly([c, lowTerm])]);
        const left = `${terms[0]}${terms[1]!.startsWith("-") ? ` - ${terms[1]!.slice(1)}` : ` + ${terms[1]}`}`;
        const equation = `${left} = ${rng.pick(rightSides)}`;
        const lowSays =
          low === 0
            ? t(`$y$ itself, not differentiated, raised to the power $${p}$`, `未求导的 $y$ 本身，取 $${p}$ 次方`)
            : t(`a derivative of order $${low}$ raised to the power $${p}$`, `一个 $${low}$ 阶导数，取 $${p}$ 次方`);
        return worked(
          t(`What is the order of the differential equation $${equation}$?`, `微分方程 $${equation}$ 的阶是多少？`),
          n,
          [
            step(
              "List the derivatives",
              "列出导数",
              t(
                `The equation contains $${derivativeName(n)}$, a derivative of order $${n}$, and $${lowTerm}$, which is ${lowSays.en}.`,
                `方程含有 $${derivativeName(n)}$，这是 $${n}$ 阶导数；还含有 $${lowTerm}$，它是${lowSays["zh-CN"]}。`,
              ),
            ),
            step(
              "Take the highest",
              "取最高阶",
              t(
                `The order is that of the highest derivative, $${derivativeName(n)}$: the order is $${n}$. The power $${p}$ says how many times a term is multiplied by itself, not how many times $y$ is differentiated.`,
                `阶由最高阶导数 $${derivativeName(n)}$ 决定：阶为 $${n}$。幂次 $${p}$ 表示某一项自乘的次数，而不是 $y$ 被求导的次数。`,
              ),
            ),
          ],
          t(
            `In Leibniz notation the highest derivative is $${leibniz(n)}$: $y$ differentiated ${n === 1 ? "once" : `$${n}$ times`}, so the order is $${n}$.`,
            `用莱布尼茨记号，最高阶导数是 $${leibniz(n)}$：$y$ 被求导 $${n}$ 次，所以阶为 $${n}$。`,
          ),
          [
            slip(
              p,
              `$${p}$ is the power on $${low === 0 ? "y" : derivativeName(low)}$; a power is not a derivative, so it does not set the order.`,
              `$${p}$ 是 $${low === 0 ? "y" : derivativeName(low)}$ 上的幂次；幂次不是导数，不决定阶。`,
            ),
            slip(
              low,
              low === 0
                ? `$y^{${p}}$ has no derivative at all; the order comes from the highest derivative, $${derivativeName(n)}$.`
                : `$${derivativeName(low)}$ is the lower derivative; the order comes from the highest one, $${derivativeName(n)}$.`,
              low === 0
                ? `$y^{${p}}$ 根本没有求导；阶由最高阶导数 $${derivativeName(n)}$ 决定。`
                : `$${derivativeName(low)}$ 是较低阶的导数；阶由最高阶的 $${derivativeName(n)}$ 决定。`,
            ),
            slip(
              n + low,
              `This adds the orders of both derivatives; the order is the highest single derivative, $${n}$.`,
              `这是把两个导数的阶加了起来；阶是单个最高阶导数的阶，即 $${n}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "linear-and-nonlinear-differential-equations",
      title: t("Linear and nonlinear equations", "线性与非线性方程"),
      explanation: t(
        "A differential equation is **linear** when $y$ and its derivatives appear only to the first power, are not multiplied together and are not inside other functions; the coefficients may depend on $x$. So $x^{2}y'' + 3y' - y = \\sin x$ is linear, while $yy' = x$, $(y')^{2} = y$ and $y' = \\sin y$ are **nonlinear**.\n\nCheck: a linear equation can be written as $a_n(x)y^{(n)} + \\dots + a_1(x)y' + a_0(x)y = g(x)$; for $x^{2}y'' + 3y' - y = \\sin x$ the coefficients are $x^{2}$, $3$ and $-1$.\n\n> **Watch out.** A coefficient such as $x^{2}$ or $e^{x}$ does not make an equation nonlinear; only what is done to $y$ and its derivatives matters.",
        "若 $y$ 及其导数都只以一次方出现、彼此不相乘、也不出现在其他函数内部，微分方程就是**线性**的；系数可以依赖于 $x$。所以 $x^{2}y'' + 3y' - y = \\sin x$ 是线性的，而 $yy' = x$、$(y')^{2} = y$、$y' = \\sin y$ 都是**非线性**的。\n\n检验：线性方程可以写成 $a_n(x)y^{(n)} + \\dots + a_1(x)y' + a_0(x)y = g(x)$；对 $x^{2}y'' + 3y' - y = \\sin x$，系数是 $x^{2}$、$3$ 和 $-1$。\n\n> **注意。** $x^{2}$、$e^{x}$ 这样的系数不会让方程变成非线性；要看的只是 $y$ 及其导数受到了什么运算。",
      ),
      generate(rng) {
        const c = linearityCase(rng);
        const equation = `${c.left} = ${rng.pick(rightSides)}`;
        return verdictChoice(rng, {
          prompt: t(`Is the differential equation $${equation}$ linear?`, `微分方程 $${equation}$ 是线性的吗？`),
          holds: c.linear,
          yes: t(
            "$y$ and its derivatives appear only to the first power, each multiplied by a function of $x$ alone",
            "$y$ 及其导数都只以一次方出现，且各自只乘以关于 $x$ 的函数",
          ),
          no: t(
            "a term raises $y$ or a derivative to a power, multiplies them together or puts one inside another function",
            "某一项把 $y$ 或其导数取了幂、彼此相乘，或放进了别的函数里",
          ),
          yesWrong: t("the right side is a function of $x$ alone", "右边只是关于 $x$ 的函数"),
          noWrong: t("a coefficient depends on $x$", "某个系数依赖于 $x$"),
          solution: walked(
            [
              step("Look at each term with y", "逐项看含 y 的项", c.look),
              step(
                "Decide",
                "下结论",
                c.linear
                  ? t("So the equation is linear.", "所以方程是线性的。")
                  : t("So the equation is nonlinear.", "所以方程是非线性的。"),
              ),
            ],
            c.form,
          ),
        });
      },
    },
  ],
};

/** verifyingSolutionsOfDifferentialEquations substitutes a function into an equation. */
export const verifyingSolutionsOfDifferentialEquations: TopicDef = {
  id: "verifying-solutions-of-differential-equations",
  title: t("Verifying Solutions of Differential Equations", "验证微分方程的解"),
  summary: t(
    "Differentiate the candidate, substitute it and its derivatives into the equation, and check that both sides agree for every x.",
    "对候选函数求导，把它及其导数代入方程，检查两边对所有 x 都相等。",
  ),
  intro: t(
    "To find out whether a function solves a differential equation, substitute it. Is $y = 3e^{-2x}$ a solution of $y' + 2y = 0$? Differentiate and substitute:\n\n$$y' = -6e^{-2x}, \\qquad y' + 2y = -6e^{-2x} + 6e^{-2x} = 0.$$\n\nThe left side is $0$ for every $x$, so it is a solution.\n\nCheck: the equation says $y' = -2y$, and indeed $\\frac{y'}{y} = \\frac{-6e^{-2x}}{3e^{-2x}} = -2$.\n\nIn this lesson we verify proposed solutions by substitution and find the rates $r$ for which $y = e^{rx}$ solves an equation.",
    "要知道一个函数是不是微分方程的解，就把它代进去。$y = 3e^{-2x}$ 是 $y' + 2y = 0$ 的解吗？求导后代入：\n\n$$y' = -6e^{-2x}, \\qquad y' + 2y = -6e^{-2x} + 6e^{-2x} = 0$$\n\n左边对每个 $x$ 都等于 $0$，所以它是解。\n\n检验：方程说的是 $y' = -2y$，而确实 $\\frac{y'}{y} = \\frac{-6e^{-2x}}{3e^{-2x}} = -2$。\n\n本课我们用代入法验证候选解，并求出使 $y = e^{rx}$ 成为解的 $r$。",
  ),
  prerequisites: ["introduction-to-differential-equations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "checking-a-proposed-solution",
      title: t("Checking a proposed solution", "检验一个候选解"),
      explanation: t(
        "To check whether $y = 3e^{-2x}$ solves $y' + 2y = 0$: $y' = -6e^{-2x}$, so $y' + 2y = -6e^{-2x} + 6e^{-2x} = 0$. It is a solution. The equation must hold for **every** $x$, not just one value.\n\nCheck: the equation says $y' = -2y$, and the ratio $\\frac{y'}{y} = \\frac{-6e^{-2x}}{3e^{-2x}} = -2$ agrees.\n\n> **Watch out.** A function can satisfy an equation at one point and fail elsewhere: simplify the left side for a general $x$ instead of trying one value.",
        "检验 $y = 3e^{-2x}$ 是否是 $y' + 2y = 0$ 的解：$y' = -6e^{-2x}$，所以 $y' + 2y = -6e^{-2x} + 6e^{-2x} = 0$。它是解。方程必须对**每一个** $x$ 都成立，而不只是某一个值。\n\n检验：方程说的是 $y' = -2y$，而比值 $\\frac{y'}{y} = \\frac{-6e^{-2x}}{3e^{-2x}} = -2$ 与之相符。\n\n> **注意。** 一个函数可能在某一点满足方程而在别处不满足：要对一般的 $x$ 化简左边，而不是只试一个值。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        const works = rng.bool();
        const c = rng.int(2, 9);
        const k = rng.int(2, 5);
        let prompt: Text;
        let parts: Step[];
        let check: Text;
        if (kind === 0) {
          const s = rng.pick([-1, 1]);
          const e = poly([s * k, "x"]);
          const coef = works ? -s * k : s * k;
          const equation = `y' ${coef < 0 ? "-" : "+"} ${Math.abs(coef)}y = 0`;
          const total = (s * k + coef) * c;
          prompt = t(`Is $y = ${c}e^{${e}}$ a solution of $${equation}$?`, `$y = ${c}e^{${e}}$ 是 $${equation}$ 的解吗？`);
          parts = [
            step("Differentiate", "求导", t("By the chain rule:", "由链式法则："), `y' = ${s * c * k}e^{${e}}`),
            step(
              "Substitute",
              "代入",
              works
                ? t("The left side is $0$ for every $x$:", "左边对每个 $x$ 都等于 $0$：")
                : t("The left side is not $0$:", "左边不等于 $0$："),
              `y' ${coef < 0 ? "-" : "+"} ${Math.abs(coef)}y = ${s * c * k}e^{${e}} ${coef < 0 ? "-" : "+"} ${Math.abs(coef * c)}e^{${e}} = ${total === 0 ? "0" : `${total}e^{${e}}`}`,
            ),
          ];
          check = t(
            `The equation says $y' = ${-coef}y$. For $y = ${c}e^{${e}}$ the ratio is $\\frac{y'}{y} = ${s * k}$, which ${works ? "agrees" : `is not $${-coef}$`}.`,
            `方程说的是 $y' = ${-coef}y$。对 $y = ${c}e^{${e}}$，比值 $\\frac{y'}{y} = ${s * k}$，${works ? "与之相符" : `不等于 $${-coef}$`}。`,
          );
        } else if (kind === 1) {
          const fn = rng.bool() ? "\\sin" : "\\cos";
          const sign = works ? "+" : "-";
          const equation = `y'' ${sign} ${k * k}y = 0`;
          const y1 = fn === "\\sin" ? `${c * k}\\cos ${k}x` : `${-c * k}\\sin ${k}x`;
          const y2 = `${-c * k * k}${fn} ${k}x`;
          prompt = t(`Is $y = ${c}${fn} ${k}x$ a solution of $${equation}$?`, `$y = ${c}${fn} ${k}x$ 是 $${equation}$ 的解吗？`);
          parts = [
            step("Differentiate twice", "求两次导", t("By the chain rule:", "由链式法则："), `y' = ${y1}`, `y'' = ${y2}`),
            step(
              "Substitute",
              "代入",
              works
                ? t("The left side is $0$ for every $x$:", "左边对每个 $x$ 都等于 $0$：")
                : t("The left side is not $0$ for every $x$:", "左边并不对每个 $x$ 都等于 $0$："),
              `y'' ${sign} ${k * k}y = ${y2} ${sign} ${c * k * k}${fn} ${k}x = ${works ? "0" : `${-2 * c * k * k}${fn} ${k}x`}`,
            ),
          ];
          check = t(
            `The equation says $y'' = ${works ? -k * k : k * k}y$. For $y = ${c}${fn} ${k}x$ the ratio is $\\frac{y''}{y} = ${-k * k}$, which ${works ? "agrees" : `is not $${k * k}$`}.`,
            `方程说的是 $y'' = ${works ? -k * k : k * k}y$。对 $y = ${c}${fn} ${k}x$，比值 $\\frac{y''}{y} = ${-k * k}$，${works ? "与之相符" : `不等于 $${k * k}$`}。`,
          );
        } else {
          const m = works ? k : k + 1;
          prompt = t(`Is $y = ${c}x^{${k}}$ a solution of $xy' = ${m}y$?`, `$y = ${c}x^{${k}}$ 是 $xy' = ${m}y$ 的解吗？`);
          parts = [
            step("Differentiate", "求导", t("By the power rule:", "由幂函数求导法则："), `y' = ${c * k}${k === 2 ? "x" : `x^{${k - 1}}`}`),
            step(
              "Substitute into both sides",
              "代入两边",
              works ? t("The two sides agree for every $x$:", "两边对每个 $x$ 都相等：") : t("The two sides differ:", "两边不相等："),
              `xy' = x \\cdot ${c * k}${k === 2 ? "x" : `x^{${k - 1}}`} = ${c * k}x^{${k}}`,
              `${m}y = ${c * m}x^{${k}}`,
            ),
          ];
          check = t(
            `The equation says $\\frac{xy'}{y} = ${m}$. For $y = ${c}x^{${k}}$ the ratio is $\\frac{x \\cdot ${c * k}x^{${k - 1}}}{${c}x^{${k}}} = ${k}$, which ${works ? "agrees" : `is not $${m}$`}.`,
            `方程说的是 $\\frac{xy'}{y} = ${m}$。对 $y = ${c}x^{${k}}$，比值 $\\frac{x \\cdot ${c * k}x^{${k - 1}}}{${c}x^{${k}}} = ${k}$，${works ? "与之相符" : `不等于 $${m}$`}。`,
          );
        }
        return verdictChoice(rng, {
          prompt,
          holds: works,
          yes: t("substituting it makes the two sides equal for every $x$", "代入后两边对每个 $x$ 都相等"),
          no: t("substituting it leaves two sides that are not equal for every $x$", "代入后两边并不对每个 $x$ 都相等"),
          yesWrong: t("its derivative has the same form as the function itself", "它的导数与它本身形式相同"),
          noWrong: t("a solution must contain an arbitrary constant $C$", "解必须含有任意常数 $C$"),
          solution: walked(parts, check),
        });
      },
    },
    {
      id: "exponential-solutions-with-an-unknown-rate",
      title: t("Exponential solutions with an unknown rate", "求指数解中的未知常数"),
      explanation: t(
        "Guessing an exponential solution turns the differential equation into an ordinary quadratic for the rate, because the exponential factor is never zero. Substituting $y = e^{rx}$ into $y'' + by' + cy = 0$ gives $e^{rx}(r^{2} + br + c) = 0$, and $e^{rx}$ is never $0$, so $r^{2} + br + c = 0$. For $y'' - y' - 6y = 0$: $r^{2} - r - 6 = (r - 3)(r + 2) = 0$, so $r = 3$ or $r = -2$.\n\nCheck: for $r = 3$, $y = e^{3x}$ gives $y'' - y' - 6y = (9 - 3 - 6)e^{3x} = 0$.\n\n> **Watch out.** The roots are the values that make each factor zero: the factor $(r + 2)$ gives $r = -2$, not $2$.",
        "猜测解是指数函数，就能把微分方程变成关于增长率的普通二次方程，因为指数因子永不为零。把 $y = e^{rx}$ 代入 $y'' + by' + cy = 0$ 得 $e^{rx}(r^{2} + br + c) = 0$，而 $e^{rx}$ 永不为 $0$，所以 $r^{2} + br + c = 0$。对 $y'' - y' - 6y = 0$：$r^{2} - r - 6 = (r - 3)(r + 2) = 0$，所以 $r = 3$ 或 $r = -2$。\n\n检验：取 $r = 3$，$y = e^{3x}$ 给出 $y'' - y' - 6y = (9 - 3 - 6)e^{3x} = 0$。\n\n> **注意。** 根是使各因子为零的值：因子 $(r + 2)$ 给出 $r = -2$，而不是 $2$。",
      ),
      generate(rng) {
        // Nonzero roots keep both factors in the form (r − c).
        const roots = rng.shuffle([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]).slice(0, 2);
        const r1 = Math.min(...roots);
        const r2 = Math.max(...roots);
        const b = -(r1 + r2);
        const c = r1 * r2;
        const equation = `${poly([1, "y''"], [b, "y'"], [c, "y"])} = 0`;
        const characteristic = poly([1, "r^{2}"], [b, "r"], [c, ""]);
        return worked(
          t(
            `$y = e^{rx}$ is a solution of $${equation}$ for two values of $r$. Find the larger one.`,
            `对 $r$ 的两个值，$y = e^{rx}$ 是 $${equation}$ 的解。求其中较大的那个。`,
          ),
          r2,
          [
            step(
              "Substitute the exponential",
              "代入指数函数",
              t(
                "With $y = e^{rx}$, $y' = re^{rx}$ and $y'' = r^{2}e^{rx}$, so the equation becomes",
                "设 $y = e^{rx}$，则 $y' = re^{rx}$，$y'' = r^{2}e^{rx}$，方程变为",
              ),
              `e^{rx}\\left(${characteristic}\\right) = 0`,
            ),
            step(
              "Solve for r",
              "解出 r",
              t("$e^{rx}$ is never $0$, so the quadratic is $0$:", "$e^{rx}$ 永不为 $0$，所以二次式为 $0$："),
              `${characteristic} = (${linear(1, -r1, "r")})(${linear(1, -r2, "r")}) = 0`,
              `r = ${r1}, \\quad r = ${r2}`,
            ),
          ],
          t(
            `Substitute $y = e^{${r2}x}$: $${equation.slice(0, -4)} = (${r2 * r2}${plus(b * r2)}${plus(c)})e^{${r2}x} = 0$, so the larger value is $${r2}$.`,
            `代入 $y = e^{${r2}x}$：$${equation.slice(0, -4)} = (${r2 * r2}${plus(b * r2)}${plus(c)})e^{${r2}x} = 0$，所以较大的值是 $${r2}$。`,
          ),
          [
            slip(r1, `$${r1}$ is the smaller root; the question asks for the larger one.`, `$${r1}$ 是较小的根；题目要的是较大的那个。`),
            slip(
              -r2,
              `The sign is flipped: the factor $(${linear(1, -r2, "r")})$ is zero at $r = ${r2}$.`,
              `符号反了：因子 $(${linear(1, -r2, "r")})$ 在 $r = ${r2}$ 时为零。`,
            ),
            slip(
              -r1,
              `The sign is flipped: the factor $(${linear(1, -r1, "r")})$ is zero at $r = ${r1}$, and the larger root is $${r2}$.`,
              `符号反了：因子 $(${linear(1, -r1, "r")})$ 在 $r = ${r1}$ 时为零，而较大的根是 $${r2}$。`,
            ),
            slip(
              r1 + r2,
              "This is the sum of the two roots, $-b$; find each root by factoring.",
              "这是两根之和 $-b$；要通过因式分解求出每个根。",
            ),
          ],
        );
      },
    },
  ],
};

/** plusC writes an antiderivative from its terms, ending in "+ C". */
const plusC = (...terms: (readonly [Q | number, string])[]) => `${poly(...terms)} + C`;

/** solvingFirstOrderOdesUsingDirectIntegration integrates dy/dx = f(x). */
export const solvingFirstOrderOdesUsingDirectIntegration: TopicDef = {
  id: "solving-first-order-odes-using-direct-integration",
  title: t("Solving First-Order ODEs Using Direct Integration", "用直接积分法解一阶常微分方程"),
  summary: t(
    "The solutions of dy/dx = f(x) are y = ∫ f(x) dx + C; an initial condition fixes C.",
    "dy/dx = f(x) 的解为 y = ∫ f(x) dx + C；初始条件确定 C。",
  ),
  intro: t(
    "When the derivative is given as a function of $x$ alone, the solution is an antiderivative. For $\\frac{dy}{dx} = 6x^{2} - 4$,\n\n$$y = \\int (6x^{2} - 4) \\, dx = 2x^{3} - 4x + C.$$\n\nEach value of $C$ gives one solution curve. If also $y(0) = 1$, then $1 = 0 - 0 + C$, so $C = 1$ and $y = 2x^{3} - 4x + 1$.\n\nCheck: $y' = 6x^{2} - 4$, which is the equation, and $y(0) = 1$.\n\nIn this lesson we find general solutions of $\\frac{dy}{dx} = f(x)$ by integration and use an initial condition to pick out one solution.",
    "当导数只是 $x$ 的函数时，解就是原函数。对 $\\frac{dy}{dx} = 6x^{2} - 4$，\n\n$$y = \\int (6x^{2} - 4) \\, dx = 2x^{3} - 4x + C$$\n\n每个 $C$ 的值给出一条解曲线。若还有 $y(0) = 1$，则 $1 = 0 - 0 + C$，所以 $C = 1$，$y = 2x^{3} - 4x + 1$。\n\n检验：$y' = 6x^{2} - 4$，正是原方程，而且 $y(0) = 1$。\n\n本课我们用积分求 $\\frac{dy}{dx} = f(x)$ 的通解，并用初始条件选出一个解。",
  ),
  prerequisites: ["introduction-to-differential-equations", "the-sum-rule-for-indefinite-integrals"],
  encompasses: [{ topic: "the-sum-rule-for-indefinite-integrals", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "general-solutions-by-integration",
      title: t("General solutions by integration", "积分求通解"),
      explanation: t(
        "If $\\frac{dy}{dx} = f(x)$, then $y$ is an antiderivative of $f$: $y = \\int f(x) \\, dx + C$. This **general solution** is a family of curves, one for each $C$. For $\\frac{dy}{dx} = 6x^{2} - 4$: $y = 2x^{3} - 4x + C$.\n\nCheck: differentiating $2x^{3} - 4x + C$ gives $6x^{2} - 4$ for every $C$.\n\n> **Watch out.** Integrate, do not differentiate: each power goes up by one and is divided by the new power.",
        "若 $\\frac{dy}{dx} = f(x)$，则 $y$ 是 $f$ 的原函数：$y = \\int f(x) \\, dx + C$。这个**通解**是一族曲线，每个 $C$ 对应一条。对 $\\frac{dy}{dx} = 6x^{2} - 4$：$y = 2x^{3} - 4x + C$。\n\n检验：对 $2x^{3} - 4x + C$ 求导，无论 $C$ 是多少都得到 $6x^{2} - 4$。\n\n> **注意。** 要积分而不是求导：每个幂次加一，再除以新的幂次。",
      ),
      generate(rng) {
        const a = rng.nonZero(-9, 9);
        const b = rng.int(-9, 9);
        const c = rng.nonZero(-9, 9);
        const n = rng.int(2, 4);
        const rhs = poly([a, `x^{${n}}`], [b, "x"], [c, ""]);
        const terms = [
          [Q.of(a, n + 1), `x^{${n + 1}}`],
          [Q.of(b, 2), "x^{2}"],
          [Q.of(c), "x"],
        ] as const;
        const answer = plusC(...terms);
        const lines = [
          `\\int ${poly([a, `x^{${n}}`])} \\, dx = ${poly([Q.of(a, n + 1), `x^{${n + 1}}`])}`,
          ...(b === 0 ? [] : [`\\int ${poly([b, "x"])} \\, dx = ${poly([Q.of(b, 2), "x^{2}"])}`]),
          `\\int ${c} \\, dx = ${poly([c, "x"])}`,
        ];
        return exact(
          {
            prompt: t(`Find the general solution of $\\frac{dy}{dx} = ${rhs}$.`, `求 $\\frac{dy}{dx} = ${rhs}$ 的通解。`),
            answer,
            prefix: "y =",
            antiderivative: true,
          },
          [
            step(
              "Integrate each term",
              "逐项积分",
              t("Raise each power by one and divide by the new power:", "每个幂次加一，再除以新的幂次："),
              ...lines,
            ),
            step(
              "Add the constant",
              "加上常数",
              t("One constant $C$ covers all the integrals and gives the whole family:", "一个常数 $C$ 涵盖所有积分，给出整个解族："),
              `y = ${answer}`,
            ),
          ],
          t(
            `Differentiate: $\\frac{d}{dx}\\left(${poly(...terms)}\\right) = ${rhs}$, the right side of the equation, whatever $C$ is.`,
            `求导：$\\frac{d}{dx}\\left(${poly(...terms)}\\right) = ${rhs}$，正是方程右边，与 $C$ 无关。`,
          ),
          [
            say(
              plusC([a * n, n === 2 ? "x" : `x^{${n - 1}}`], [b, ""]),
              "This differentiates the right side; the solution is its antiderivative.",
              "这是对右边求导；解应当是它的原函数。",
            ),
            say(
              plusC([a, `x^{${n + 1}}`], [b, "x^{2}"], [c, "x"]),
              "The powers went up, but each term must also be divided by its new power.",
              "幂次加了一，但每一项还要除以新的幂次。",
            ),
            say(
              plusC([Q.of(a, n), `x^{${n + 1}}`], [b, "x^{2}"], [c, "x"]),
              "Divide by the new power, not the old one: $x^{n}$ integrates to $\\frac{x^{n+1}}{n+1}$.",
              "要除以新的幂次，而不是原来的幂次：$x^{n}$ 的积分是 $\\frac{x^{n+1}}{n+1}$。",
            ),
          ],
        );
      },
    },
    {
      id: "initial-value-problems-by-integration",
      title: t("Initial value problems by integration", "用积分解初值问题"),
      explanation: t(
        "An **initial value problem** adds a condition $y(x_0) = y_0$, which picks one curve from the family. For $\\frac{dy}{dx} = 2x + 1$ with $y(1) = 5$: $y = x^{2} + x + C$, and $5 = 1 + 1 + C$ gives $C = 3$, so $y = x^{2} + x + 3$ and $y(2) = 9$.\n\nCheck: $y' = 2x + 1$ and $y(1) = 5$; by the net change theorem too, $y(2) = 5 + \\int_{1}^{2} (2x + 1) \\, dx = 5 + 4 = 9$.\n\n> **Watch out.** $C$ is not $y_0$ unless the antiderivative is $0$ at $x_0$: solve $y_0 = F(x_0) + C$.",
        "**初值问题**附加一个条件 $y(x_0) = y_0$，从曲线族中选出一条。对 $\\frac{dy}{dx} = 2x + 1$，$y(1) = 5$：$y = x^{2} + x + C$，由 $5 = 1 + 1 + C$ 得 $C = 3$，所以 $y = x^{2} + x + 3$，$y(2) = 9$。\n\n检验：$y' = 2x + 1$ 且 $y(1) = 5$；用净变化定理也有 $y(2) = 5 + \\int_{1}^{2} (2x + 1) \\, dx = 5 + 4 = 9$。\n\n> **注意。** 除非原函数在 $x_0$ 处为 $0$，否则 $C$ 不等于 $y_0$：要解 $y_0 = F(x_0) + C$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-6, 6);
        const b = rng.int(-9, 9);
        const x0 = rng.int(-3, 3);
        const y0 = rng.int(-9, 9);
        const x1 = rng.pick([-4, -3, -2, -1, 0, 1, 2, 3, 4].filter((v) => v !== x0));
        const F = (x: number) => Q.of(a * x * x, 2).add(Q.of(b * x));
        const C = Q.of(y0).sub(F(x0));
        const answer = F(x1).add(C);
        const y = poly([Q.of(a, 2), "x^{2}"], [b, "x"]);
        const solved = poly([Q.of(a, 2), "x^{2}"], [b, "x"], [C, ""]) || "0";
        const f = linear(a, b);
        return worked(
          t(
            `Solve $\\frac{dy}{dx} = ${f}$ with $y(${x0}) = ${y0}$, and find $y(${x1})$.`,
            `解 $\\frac{dy}{dx} = ${f}$，$y(${x0}) = ${y0}$，并求 $y(${x1})$。`,
          ),
          answer,
          [
            step("Integrate", "积分", t("Integrate the right side:", "对右边积分："), `y = ${y} + C`),
            step(
              "Use the initial condition",
              "用初始条件",
              t(`Put $x = ${x0}$ and $y = ${y0}$:`, `代入 $x = ${x0}$，$y = ${y0}$：`),
              `${y0} = ${F(x0).toLatex()} + C`,
              `C = ${C.toLatex()}`,
            ),
            step(
              "Evaluate at the new point",
              "在新的点求值",
              t(`So $y = ${solved}$, and`, `所以 $y = ${solved}$，于是`),
              `y(${x1}) = ${F(x1).toLatex()} + ${neg(C)} = ${answer.toLatex()}`,
            ),
          ],
          t(
            `$y = ${solved}$ has $y' = ${f}$, which is the equation, and $y(${x0}) = ${F(x0).toLatex()} + ${neg(C)} = ${y0}$. By the net change theorem as well, $y(${x1}) = ${y0} + \\int_{${x0}}^{${x1}} (${f}) \\, dx = ${y0} + ${neg(F(x1).sub(F(x0)))} = ${answer.toLatex()}$.`,
            `$y = ${solved}$ 满足 $y' = ${f}$，正是原方程，且 $y(${x0}) = ${F(x0).toLatex()} + ${neg(C)} = ${y0}$。再用净变化定理：$y(${x1}) = ${y0} + \\int_{${x0}}^{${x1}} (${f}) \\, dx = ${y0} + ${neg(F(x1).sub(F(x0)))} = ${answer.toLatex()}$。`,
          ),
          [
            slip(
              F(x1),
              `This leaves out the constant: the condition $y(${x0}) = ${y0}$ gives $C = ${C.toLatex()}$.`,
              `这里漏掉了常数：条件 $y(${x0}) = ${y0}$ 给出 $C = ${C.toLatex()}$。`,
            ),
            slip(
              F(x1).add(Q.of(y0)),
              `This takes $C = ${y0}$, but $C = ${y0} - F(${x0}) = ${C.toLatex()}$.`,
              `这里取了 $C = ${y0}$，但其实 $C = ${y0} - F(${x0}) = ${C.toLatex()}$。`,
            ),
            slip(
              Q.of(y0 + a * x1 + b),
              `This adds the slope $${f}$ at $x = ${x1}$ to $${y0}$; integrate it instead.`,
              `这是把 $x = ${x1}$ 处的斜率 $${f}$ 加到 $${y0}$ 上；应当对它积分。`,
            ),
            slip(
              F(x1).add(Q.of(y0)).add(F(x0)),
              `A sign slip: $${y0} = ${F(x0).toLatex()} + C$ gives $C = ${y0} - ${neg(F(x0))}$.`,
              `符号错了：由 $${y0} = ${F(x0).toLatex()} + C$ 得 $C = ${y0} - ${neg(F(x0))}$。`,
            ),
          ],
        );
      },
    },
  ],
};

/** factorsOfX are functions of x for separable equations, with their reciprocals. */
const factorsOfX = ["x", "x^{2}", "\\cos x", "e^{x}", "\\sqrt{x}"] as const;

/** factorsOfY are functions of y for separable equations, with their reciprocals. */
const factorsOfY: readonly (readonly [string, string])[] = [
  ["y", "\\frac{1}{y}"],
  ["y^{2}", "\\frac{1}{y^{2}}"],
  ["e^{y}", "e^{-y}"],
  ["\\sqrt{y}", "\\frac{1}{\\sqrt{y}}"],
  ["1 + y^{2}", "\\frac{1}{1 + y^{2}}"],
];

/** power writes x to a whole power: nothing for 0, x for 1. */
const power = (m: number) => (m === 0 ? "" : m === 1 ? "x" : `x^{${m}}`);

/** solvingFirstOrderOdesUsingSeparationOfVariables solves dy/dx = f(x)g(y). */
export const solvingFirstOrderOdesUsingSeparationOfVariables: TopicDef = {
  id: "solving-first-order-odes-using-separation-of-variables",
  title: t("Solving First-Order ODEs Using Separation of Variables", "用分离变量法解一阶常微分方程"),
  summary: t(
    "If dy/dx = f(x)g(y), then ∫ dy/g(y) = ∫ f(x) dx; integrate both sides and solve for y.",
    "若 dy/dx = f(x)g(y)，则 ∫ dy/g(y) = ∫ f(x) dx；两边积分后解出 y。",
  ),
  intro: t(
    "When the right side is a function of $x$ times a function of $y$, the variables can be pulled apart. For $\\frac{dy}{dx} = xy$, divide by $y$ and multiply by $dx$, then integrate each side:\n\n$$\\int \\frac{dy}{y} = \\int x \\, dx, \\qquad \\ln|y| = \\frac{x^{2}}{2} + C_1, \\qquad y = Ce^{x^{2}/2}.$$\n\nCheck: $y = Ce^{x^{2}/2}$ has $y' = x \\cdot Ce^{x^{2}/2} = xy$, which is the equation.\n\nIn this lesson we separate the variables of an equation and integrate both sides to find its general solution.",
    "当右边是 $x$ 的函数乘以 $y$ 的函数时，就可以把两个变量分开。对 $\\frac{dy}{dx} = xy$，两边除以 $y$ 再乘以 $dx$，然后两边分别积分：\n\n$$\\int \\frac{dy}{y} = \\int x \\, dx, \\qquad \\ln|y| = \\frac{x^{2}}{2} + C_1, \\qquad y = Ce^{x^{2}/2}$$\n\n检验：$y = Ce^{x^{2}/2}$ 满足 $y' = x \\cdot Ce^{x^{2}/2} = xy$，正是原方程。\n\n本课我们对方程分离变量，两边积分求出通解。",
  ),
  prerequisites: ["solving-first-order-odes-using-direct-integration", "verifying-solutions-of-differential-equations"],
  encompasses: [{ topic: "solving-first-order-odes-using-direct-integration", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "separating-the-variables",
      title: t("Separating the variables", "分离变量"),
      explanation: t(
        "An equation is **separable** when the right side factors as $f(x)g(y)$. Move every $y$ to the side with $dy$ and every $x$ to the side with $dx$: $\\frac{dy}{g(y)} = f(x) \\, dx$, then integrate. For $\\frac{dy}{dx} = 3x^{2}y^{2}$: $\\int \\frac{1}{y^{2}} \\, dy = \\int 3x^{2} \\, dx$.\n\nCheck: multiplying $\\frac{1}{y^{2}} \\, dy = 3x^{2} \\, dx$ by $y^{2}$ and dividing by $dx$ gives back $\\frac{dy}{dx} = 3x^{2}y^{2}$.\n\n> **Watch out.** The factor with $y$ is divided across, so it appears as its reciprocal next to $dy$; the factor with $x$ stays as it is.",
        "若右边能分解为 $f(x)g(y)$，方程就是**可分离变量**的。把所有 $y$ 移到含 $dy$ 的一边，所有 $x$ 移到含 $dx$ 的一边：$\\frac{dy}{g(y)} = f(x) \\, dx$，再两边积分。对 $\\frac{dy}{dx} = 3x^{2}y^{2}$：$\\int \\frac{1}{y^{2}} \\, dy = \\int 3x^{2} \\, dx$。\n\n检验：把 $\\frac{1}{y^{2}} \\, dy = 3x^{2} \\, dx$ 乘以 $y^{2}$ 再除以 $dx$，又回到 $\\frac{dy}{dx} = 3x^{2}y^{2}$。\n\n> **注意。** 含 $y$ 的因子是除过去的，所以它以倒数形式出现在 $dy$ 旁边；含 $x$ 的因子保持原样。",
      ),
      generate(rng) {
        const k = rng.int(1, 4);
        const fx = rng.pick(factorsOfX);
        const [gy, inv] = rng.pick(factorsOfY);
        const kf = `${k === 1 ? "" : k}${fx}`;
        const product = gy.includes("+") ? `${kf}(${gy})` : `${kf}${gy}`;
        const separated = `\\int ${inv} \\, dy = \\int ${kf} \\, dx`;
        return choose(
          rng,
          t(
            `Which equation results from separating the variables in $\\frac{dy}{dx} = ${product}$?`,
            `对 $\\frac{dy}{dx} = ${product}$ 分离变量后得到哪个方程？`,
          ),
          opt(separated),
          [
            because(
              opt(`\\int ${gy} \\, dy = \\int ${kf} \\, dx`),
              `The factor with $y$ must be divided across, so it appears as its reciprocal, not as $${gy}$.`,
              `含 $y$ 的因子要除到左边，所以它以倒数出现，而不是 $${gy}$。`,
            ),
            because(
              opt(`\\int ${inv} \\, dy = \\int \\frac{1}{${kf}} \\, dx`),
              "The factor with $x$ stays where it is, multiplying $dx$: only the factor with $y$ moves.",
              "含 $x$ 的因子留在原处，与 $dx$ 相乘：只有含 $y$ 的因子要移动。",
            ),
            because(
              opt(`\\int ${kf} \\, dy = \\int ${gy} \\, dx`),
              "The variables are on the wrong sides: $x$ goes with $dx$ and $y$ goes with $dy$.",
              "变量放错了边：$x$ 要和 $dx$ 在一起，$y$ 要和 $dy$ 在一起。",
            ),
          ],
          [
            step(
              "Divide by the factor with y",
              "除以含 y 的因子",
              t(`Divide both sides by $${gy}$:`, `两边除以 $${gy}$：`),
              `${inv} \\, \\frac{dy}{dx} = ${kf}`,
            ),
            step(
              "Multiply by dx and integrate",
              "乘以 dx 后积分",
              t("Multiply by $dx$ and integrate both sides:", "乘以 $dx$，两边积分："),
              separated,
            ),
          ],
          t(
            `Undo the separation: multiplying $${inv} \\, dy = ${kf} \\, dx$ by $${gy}$ and dividing by $dx$ gives back $\\frac{dy}{dx} = ${product}$.`,
            `把分离倒回去：$${inv} \\, dy = ${kf} \\, dx$ 乘以 $${gy}$ 再除以 $dx$，又回到 $\\frac{dy}{dx} = ${product}$。`,
          ),
        );
      },
    },
    {
      id: "general-solutions-by-separation",
      title: t("General solutions by separation", "分离变量求通解"),
      explanation: t(
        "Move every factor with the unknown function to one side and every factor with the variable to the other, then integrate both sides. For $\\frac{dy}{dx} = kx^{m}y$: $\\int \\frac{dy}{y} = \\int kx^{m} \\, dx$ gives $\\ln|y| = \\frac{k}{m + 1}x^{m+1} + C_1$, so $y = Ce^{\\frac{k}{m + 1}x^{m+1}}$ with $C = \\pm e^{C_1}$ (and $C = 0$ for the solution $y = 0$). For $\\frac{dy}{dx} = 6x^{2}y$: $y = Ce^{2x^{3}}$.\n\nCheck: $y = Ce^{2x^{3}}$ gives $y' = 6x^{2} \\cdot Ce^{2x^{3}} = 6x^{2}y$.\n\n> **Watch out.** Integrating $kx^{m}$ divides by $m + 1$; leaving that out gives an exponent whose derivative is too large.",
        "把含未知函数的因子都移到一边，含自变量的因子都移到另一边，再两边积分。对 $\\frac{dy}{dx} = kx^{m}y$：由 $\\int \\frac{dy}{y} = \\int kx^{m} \\, dx$ 得 $\\ln|y| = \\frac{k}{m + 1}x^{m+1} + C_1$，所以 $y = Ce^{\\frac{k}{m + 1}x^{m+1}}$，其中 $C = \\pm e^{C_1}$（$C = 0$ 对应解 $y = 0$）。对 $\\frac{dy}{dx} = 6x^{2}y$：$y = Ce^{2x^{3}}$。\n\n检验：$y = Ce^{2x^{3}}$ 给出 $y' = 6x^{2} \\cdot Ce^{2x^{3}} = 6x^{2}y$。\n\n> **注意。** 对 $kx^{m}$ 积分要除以 $m + 1$；漏掉它，指数的导数就会偏大。",
      ),
      generate(rng) {
        const k = rng.nonZero(-9, 9);
        const m = rng.int(0, 4);
        const xm = power(m);
        const xm1 = power(m + 1);
        const g = poly([Q.of(k, m + 1), xm1]);
        const kxm = m === 0 ? `${k}` : poly([k, xm]);
        return exact(
          {
            prompt: t(
              `The general solution of $\\frac{dy}{dx} = ${poly([k, `${xm}y`])}$ is $y = Ce^{g(x)}$. Find $g(x)$.`,
              `$\\frac{dy}{dx} = ${poly([k, `${xm}y`])}$ 的通解为 $y = Ce^{g(x)}$。求 $g(x)$。`,
            ),
            answer: g,
            prefix: "g(x) =",
          },
          [
            step(
              "Separate",
              "分离变量",
              t("Divide by $y$ and multiply by $dx$:", "两边除以 $y$ 再乘以 $dx$："),
              `\\int \\frac{dy}{y} = \\int ${kxm} \\, dx`,
            ),
            step(
              "Integrate",
              "积分",
              t("The power of $x$ goes up by one and is divided by the new power:", "$x$ 的幂次加一，再除以新的幂次："),
              `\\ln|y| = ${g} + C_1`,
            ),
            step(
              "Solve for y",
              "解出 y",
              t(
                "Exponentiate, with $C = \\pm e^{C_1}$ ($C = 0$ gives the solution $y = 0$):",
                "取指数，$C = \\pm e^{C_1}$（$C = 0$ 对应解 $y = 0$）：",
              ),
              `y = Ce^{${g}}`,
              `g(x) = ${g}`,
            ),
          ],
          t(
            `Substitute $y = Ce^{${g}}$: by the chain rule $y' = ${kxm} \\cdot Ce^{${g}} = ${kxm}y$, which is the equation.`,
            `代入 $y = Ce^{${g}}$：由链式法则 $y' = ${kxm} \\cdot Ce^{${g}} = ${kxm}y$，正是原方程。`,
          ),
          [
            ...(m === 0
              ? []
              : [
                  say(
                    poly([k, xm1]),
                    `Integrating $${kxm}$ divides by the new power $${m + 1}$; without it, $g'(x)$ is $${m + 1}$ times too large.`,
                    `对 $${kxm}$ 积分要除以新的幂次 $${m + 1}$；不除的话，$g'(x)$ 会大 $${m + 1}$ 倍。`,
                  ),
                  say(
                    poly([k * m, power(m - 1)]) || "0",
                    `This differentiates $${kxm}$; the exponent comes from integrating it.`,
                    `这是对 $${kxm}$ 求导；指数应当由积分得到。`,
                  ),
                ]),
            say(
              poly([Q.of(-k, m + 1), xm1]),
              "Dividing by $y$ changes no signs: $\\ln|y|$ equals the integral itself, not its negative.",
              "除以 $y$ 不会改变符号：$\\ln|y|$ 等于这个积分本身，而不是它的相反数。",
            ),
          ],
        );
      },
    },
  ],
};

/** solvingFirstOrderIvpsUsingSeparationOfVariables fixes the constant with an initial condition. */
export const solvingFirstOrderIvpsUsingSeparationOfVariables: TopicDef = {
  id: "solving-first-order-ivps-using-separation-of-variables",
  title: t("Solving First-Order IVPs Using Separation of Variables", "用分离变量法解一阶初值问题"),
  summary: t(
    "Separate, integrate, then use the initial condition to find the constant before solving for y.",
    "分离变量并积分，再用初始条件求出常数，最后解出 y。",
  ),
  intro: t(
    "An initial value problem asks for the one solution through a given point. For $\\frac{dy}{dx} = 2xy$ with $y(0) = 5$, separating gives\n\n$$\\int \\frac{dy}{y} = \\int 2x \\, dx, \\qquad \\ln|y| = x^{2} + C_1, \\qquad y = Ce^{x^{2}}.$$\n\nAt $x = 0$, $y = Ce^{0} = C$, so $C = 5$ and $y = 5e^{x^{2}}$.\n\nCheck: $y' = 2x \\cdot 5e^{x^{2}} = 2xy$, which is the equation, and $y(0) = 5e^{0} = 5$.\n\nIn this lesson we solve initial value problems by separating the variables, using the initial condition to find the constant.",
    "初值问题要求的是经过给定点的那一个解。对 $\\frac{dy}{dx} = 2xy$，$y(0) = 5$，分离变量得\n\n$$\\int \\frac{dy}{y} = \\int 2x \\, dx, \\qquad \\ln|y| = x^{2} + C_1, \\qquad y = Ce^{x^{2}}$$\n\n在 $x = 0$ 处 $y = Ce^{0} = C$，所以 $C = 5$，$y = 5e^{x^{2}}$。\n\n检验：$y' = 2x \\cdot 5e^{x^{2}} = 2xy$，正是原方程，且 $y(0) = 5e^{0} = 5$。\n\n本课我们用分离变量法解初值问题，并用初始条件求出常数。",
  ),
  prerequisites: ["solving-first-order-odes-using-separation-of-variables"],
  encompasses: [{ topic: "solving-first-order-odes-using-separation-of-variables", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "exponential-ivps",
      title: t("IVPs with exponential solutions", "解为指数函数的初值问题"),
      explanation: t(
        "The initial condition fixes the constant in the general solution, and for an exponential solution at zero, that constant is simply the starting value. For $\\frac{dy}{dx} = kx^{m}y$ with $y(0) = y_0$, the general solution $y = Ce^{\\frac{k}{m + 1}x^{m+1}}$ gives $y(0) = C$, so $C = y_0$. For $\\frac{dy}{dx} = 4xy$ with $y(0) = 3$: $y = 3e^{2x^{2}}$.\n\nCheck: $y = 3e^{2x^{2}}$ has $y' = 4x \\cdot 3e^{2x^{2}} = 4xy$ and $y(0) = 3e^{0} = 3$.\n\n> **Watch out.** The constant multiplies the exponential; adding $y_0$ instead gives the right value at $0$ but the wrong slope everywhere else.",
        "初始条件确定了通解中的常数；对于在零处的指数型解，这个常数就是初始值。对 $\\frac{dy}{dx} = kx^{m}y$，$y(0) = y_0$，通解 $y = Ce^{\\frac{k}{m + 1}x^{m+1}}$ 给出 $y(0) = C$，所以 $C = y_0$。对 $\\frac{dy}{dx} = 4xy$，$y(0) = 3$：$y = 3e^{2x^{2}}$。\n\n检验：$y = 3e^{2x^{2}}$ 满足 $y' = 4x \\cdot 3e^{2x^{2}} = 4xy$，且 $y(0) = 3e^{0} = 3$。\n\n> **注意。** 常数是乘在指数函数上的；改成加上 $y_0$，在 $0$ 处的值虽然对，其他地方的斜率却错了。",
      ),
      generate(rng) {
        const k = rng.nonZero(-6, 6);
        const m = rng.int(0, 3);
        const y0 = rng.nonZero(-9, 9);
        const xm = power(m);
        const xm1 = power(m + 1);
        const g = poly([Q.of(k, m + 1), xm1]);
        const kxm = m === 0 ? `${k}` : poly([k, xm]);
        const lead = y0 === 1 ? "" : y0 === -1 ? "-" : `${y0}`;
        const answer = `${lead}e^{${g}}`;
        return exact(
          {
            prompt: t(
              `Solve $\\frac{dy}{dx} = ${poly([k, `${xm}y`])}$ with $y(0) = ${y0}$.`,
              `解 $\\frac{dy}{dx} = ${poly([k, `${xm}y`])}$，$y(0) = ${y0}$。`,
            ),
            answer,
            prefix: "y =",
          },
          [
            step(
              "Separate and integrate",
              "分离变量并积分",
              t(`$\\int \\frac{dy}{y} = \\int ${kxm} \\, dx$ gives`, `由 $\\int \\frac{dy}{y} = \\int ${kxm} \\, dx$ 得`),
              `\\ln|y| = ${g} + C_1`,
              `y = Ce^{${g}}`,
            ),
            step(
              "Use the initial condition",
              "用初始条件",
              t("At $x = 0$ the exponent is $0$ and $e^{0} = 1$:", "在 $x = 0$ 处指数为 $0$，而 $e^{0} = 1$："),
              `y(0) = Ce^{0} = C = ${y0}`,
              `y = ${answer}`,
            ),
          ],
          t(
            `Substitute: $y' = ${kxm} \\cdot ${neg(y0)}e^{${g}} = ${kxm}y$, which is the equation, and $y(0) = ${neg(y0)} \\cdot e^{0} = ${y0}$.`,
            `代入：$y' = ${kxm} \\cdot ${neg(y0)}e^{${g}} = ${kxm}y$，正是原方程，且 $y(0) = ${neg(y0)} \\cdot e^{0} = ${y0}$。`,
          ),
          [
            ...(y0 === 1
              ? []
              : [
                  say(
                    `e^{${g}}${plus(y0 - 1)}`,
                    `This has the right value at $0$, but its derivative is that of $e^{${g}}$ alone, not $${kxm}y$: the constant multiplies the exponential.`,
                    `它在 $0$ 处的值是对的，但它的导数只是 $e^{${g}}$ 的导数，不等于 $${kxm}y$：常数应当乘在指数函数上。`,
                  ),
                  say(
                    `e^{${g}}`,
                    `This is the solution with $C = 1$, so $y(0) = 1$; the condition needs $C = ${y0}$.`,
                    `这是 $C = 1$ 的解，$y(0) = 1$；条件要求 $C = ${y0}$。`,
                  ),
                ]),
            ...(m === 0
              ? []
              : [
                  say(
                    `${lead}e^{${poly([k, xm1])}}`,
                    `Integrating $${kxm}$ divides by $${m + 1}$; this exponent's derivative is $${m + 1}$ times too large.`,
                    `对 $${kxm}$ 积分要除以 $${m + 1}$；这个指数的导数大了 $${m + 1}$ 倍。`,
                  ),
                ]),
            say(
              `${lead}e^{${poly([Q.of(-k, m + 1), xm1])}}`,
              "The sign of the exponent is flipped: separating changes no signs.",
              "指数的符号反了：分离变量不会改变符号。",
            ),
          ],
        );
      },
    },
    {
      id: "ivps-with-reciprocal-solutions",
      title: t("IVPs with reciprocal solutions", "解为倒数形式的初值问题"),
      explanation: t(
        "Separating and integrating gives the reciprocal of the unknown function, so use the initial condition to find the constant before solving for the function. For $\\frac{dy}{dx} = kxy^{2}$: $\\int y^{-2} \\, dy = \\int kx \\, dx$ gives $-\\frac{1}{y} = \\frac{k}{2}x^{2} + C$. With $y(0) = y_0$, $C = -\\frac{1}{y_0}$. For $\\frac{dy}{dx} = 2xy^{2}$, $y(0) = 1$: $-\\frac{1}{y} = x^{2} - 1$, so $y = \\frac{1}{1 - x^{2}}$ and $y\\left(\\frac{1}{2}\\right) = \\frac{4}{3}$.\n\nCheck: $y = \\frac{1}{1 - x^{2}}$ has $y' = \\frac{2x}{(1 - x^{2})^{2}} = 2xy^{2}$, and $y(0) = 1$.\n\n> **Watch out.** Integrating gives $\\frac{1}{y}$, with a minus sign: remember to turn it over at the end.",
        "分离变量并积分后得到未知函数的倒数，所以先用初始条件求出常数，再解出函数。对 $\\frac{dy}{dx} = kxy^{2}$：由 $\\int y^{-2} \\, dy = \\int kx \\, dx$ 得 $-\\frac{1}{y} = \\frac{k}{2}x^{2} + C$。由 $y(0) = y_0$ 得 $C = -\\frac{1}{y_0}$。对 $\\frac{dy}{dx} = 2xy^{2}$，$y(0) = 1$：$-\\frac{1}{y} = x^{2} - 1$，所以 $y = \\frac{1}{1 - x^{2}}$，$y\\left(\\frac{1}{2}\\right) = \\frac{4}{3}$。\n\n检验：$y = \\frac{1}{1 - x^{2}}$ 满足 $y' = \\frac{2x}{(1 - x^{2})^{2}} = 2xy^{2}$，且 $y(0) = 1$。\n\n> **注意。** 积分得到的是带负号的 $\\frac{1}{y}$：最后别忘了取倒数。",
      ),
      generate(rng) {
        for (;;) {
          const k = rng.nonZero(-4, 4);
          const y0 = rng.nonZero(-5, 5);
          const x1 = rng.pick([Q.of(1, 2), Q.of(1), Q.of(2), Q.of(-1), Q.of(1, 3), Q.of(3, 2)]);
          // 1/y = 1/y₀ − (k/2)x²
          const inv = Q.of(1, y0).sub(Q.of(k, 2).mul(x1).mul(x1));
          const flipped = Q.of(1, y0).add(Q.of(k, 2).mul(x1).mul(x1));
          if (inv.isZero() || flipped.isZero()) continue;
          // The solution must exist on the whole way from 0 to x₁: 1/y keeps the sign of 1/y₀.
          if (inv.sign() * Math.sign(y0) < 0) continue;
          const answer = Q.one.div(inv);
          const u = poly([Q.of(1, y0), ""], [Q.of(-k, 2), "x^{2}"]);
          const kx = poly([k, "x"]);
          return worked(
            t(
              `Solve $\\frac{dy}{dx} = ${poly([k, "xy^{2}"])}$ with $y(0) = ${y0}$, and find $y\\left(${x1.toLatex()}\\right)$.`,
              `解 $\\frac{dy}{dx} = ${poly([k, "xy^{2}"])}$，$y(0) = ${y0}$，并求 $y\\left(${x1.toLatex()}\\right)$。`,
            ),
            answer,
            [
              step(
                "Separate and integrate",
                "分离变量并积分",
                t("Divide by $y^{2}$ and integrate both sides:", "两边除以 $y^{2}$ 后积分："),
                `\\int \\frac{dy}{y^{2}} = \\int ${kx} \\, dx`,
                `-\\frac{1}{y} = ${poly([Q.of(k, 2), "x^{2}"])} + C`,
              ),
              step(
                "Use the initial condition",
                "用初始条件",
                t(
                  `At $x = 0$, $-\\frac{1}{y_0} = C$, so $C = ${Q.of(-1, y0).toLatex()}$ and`,
                  `在 $x = 0$ 处 $-\\frac{1}{y_0} = C$，所以 $C = ${Q.of(-1, y0).toLatex()}$，于是`,
                ),
                `\\frac{1}{y} = ${u}`,
              ),
              step(
                "Evaluate and turn over",
                "求值并取倒数",
                t(`At $x = ${x1.toLatex()}$:`, `在 $x = ${x1.toLatex()}$ 处：`),
                `\\frac{1}{y} = ${inv.toLatex()}`,
                `y = ${answer.toLatex()}`,
              ),
            ],
            t(
              `Write $u = ${u}$, so $y = \\frac{1}{u}$ and $u' = ${poly([-k, "x"])}$. Then $y' = -\\frac{u'}{u^{2}} = ${kx} \\cdot \\frac{1}{u^{2}} = ${kx}y^{2}$, which is the equation, and at $x = 0$, $u = ${Q.of(1, y0).toLatex()}$, so $y(0) = ${y0}$.`,
              `设 $u = ${u}$，则 $y = \\frac{1}{u}$，$u' = ${poly([-k, "x"])}$。于是 $y' = -\\frac{u'}{u^{2}} = ${kx} \\cdot \\frac{1}{u^{2}} = ${kx}y^{2}$，正是原方程；在 $x = 0$ 处 $u = ${Q.of(1, y0).toLatex()}$，所以 $y(0) = ${y0}$。`,
            ),
            [
              slip(inv, `This is $\\frac{1}{y}$; turn it over to get $y$.`, `这是 $\\frac{1}{y}$；取倒数才得到 $y$。`),
              slip(
                Q.one.div(flipped),
                "A sign slip: from $-\\frac{1}{y} = \\frac{k}{2}x^{2} + C$, $\\frac{1}{y} = \\frac{1}{y_0} - \\frac{k}{2}x^{2}$.",
                "符号错了：由 $-\\frac{1}{y} = \\frac{k}{2}x^{2} + C$ 得 $\\frac{1}{y} = \\frac{1}{y_0} - \\frac{k}{2}x^{2}$。",
              ),
              slip(
                Q.of(y0).add(Q.of(k, 2).mul(x1).mul(x1)),
                `This integrates $${kx}$ alone, as if the factor $y^{2}$ were not there; divide by $y^{2}$ first.`,
                `这是只对 $${kx}$ 积分，好像因子 $y^{2}$ 不存在；要先除以 $y^{2}$。`,
              ),
            ],
          );
        }
      },
    },
  ],
};

/** ModelCase is a verbal description with the matching equation and explained distractors. */
interface ModelCase {
  readonly words: Text;
  readonly v: string;
  readonly right: string;
  readonly to: Text;
  readonly wrong: readonly Option[];
}

/** timeUnits are the units of time a model may use. */
const timeUnits = [t("seconds", "秒"), t("minutes", "分钟"), t("hours", "小时"), t("days", "天"), t("years", "年")] as const;

/** modelCase picks a situation described by a first-order equation. */
function modelCase(rng: Rng): ModelCase {
  const a = rng.int(2, 9) * 10;
  const kind = rng.int(0, 4);
  if (kind === 0) {
    const [v, en, zh] = rng.pick([
      ["P", "a population $P$", "种群数量 $P$"],
      ["B", "the number $B$ of bacteria in a culture", "培养物中的细菌数 $B$"],
      ["A", "the amount $A$ in an account earning continuous interest", "连续计息账户中的金额 $A$"],
    ] as const);
    return {
      words: t(`The rate of change of ${en} is proportional to $${v}$ itself.`, `${zh}的变化率与它自身成正比。`),
      v,
      right: `\\frac{d${v}}{dt} = k${v}`,
      to: t(`$${v}$ itself`, `$${v}$ 本身`),
      wrong: [
        because(
          opt(`\\frac{d${v}}{dt} = k`),
          `This is a constant rate; the rate must grow with $${v}$.`,
          `这是恒定的速率；速率应当随 $${v}$ 增大。`,
        ),
        because(
          opt(`\\frac{d${v}}{dt} = kt`),
          `This makes the rate proportional to the time $t$, not to $${v}$.`,
          `这让速率与时间 $t$ 成正比，而不是与 $${v}$ 成正比。`,
        ),
        because(
          opt(`${v} = kt`),
          `This gives $${v}$ itself, not its rate of change: there is no derivative.`,
          `这给出的是 $${v}$ 本身，而不是它的变化率：式中没有导数。`,
        ),
      ],
    };
  }
  if (kind === 1)
    return {
      words: t(
        `The rate of change of the temperature $T$ of a cup of tea is proportional to the difference between $T$ and the room temperature of $${a}^{\\circ}$.`,
        `一杯茶的温度 $T$ 的变化率与 $T$ 和室温 $${a}^{\\circ}$ 之差成正比。`,
      ),
      v: "T",
      right: `\\frac{dT}{dt} = k(T - ${a})`,
      to: t(`the difference $T - ${a}$`, `差 $T - ${a}$`),
      wrong: [
        because(
          opt(`\\frac{dT}{dt} = kT - ${a}`),
          `The constant multiplies the whole difference $T - ${a}$, not just $T$.`,
          `常数乘的是整个差 $T - ${a}$，而不只是 $T$。`,
        ),
        because(
          opt(`\\frac{dT}{dt} = k(t - ${a})`),
          "This uses the time $t$ where the temperature $T$ belongs.",
          "这里把温度 $T$ 写成了时间 $t$。",
        ),
        because(
          opt(`\\frac{dT}{dt} = \\frac{k}{T - ${a}}`),
          "This is inversely proportional to the difference: the rate would grow as the tea nears room temperature.",
          "这是与差成反比：茶越接近室温，速率反而越大。",
        ),
      ],
    };
  if (kind === 2)
    return {
      words: t(
        `In a town of $${a * 100}$ people, a rumor spreads at a rate proportional to the product of the number $N$ who have heard it and the number who have not.`,
        `在一个 $${a * 100}$ 人的小镇里，谣言传播的速率与已听说的人数 $N$ 和未听说的人数之积成正比。`,
      ),
      v: "N",
      right: `\\frac{dN}{dt} = kN(${a * 100} - N)`,
      to: t(`the product of $N$ and $${a * 100} - N$`, `$N$ 与 $${a * 100} - N$ 之积`),
      wrong: [
        because(
          opt(`\\frac{dN}{dt} = kN + (${a * 100} - N)`),
          "This adds the two numbers; the rate is proportional to their product.",
          "这是把两个数相加；速率与它们的乘积成正比。",
        ),
        because(
          opt(`\\frac{dN}{dt} = k(${a * 100} - N)`),
          "This uses only the people who have not heard it; the product needs $N$ as well.",
          "这里只用了未听说的人数；乘积中还需要 $N$。",
        ),
        because(
          opt(`\\frac{dN}{dt} = kN \\cdot ${a * 100}`),
          `$${a * 100}$ is the whole town; the number who have not heard is $${a * 100} - N$.`,
          `$${a * 100}$ 是全镇人数；未听说的人数是 $${a * 100} - N$。`,
        ),
      ],
    };
  if (kind === 3)
    return {
      words: t(
        `A student must learn $${a}$ facts. The rate at which the number $L$ of learned facts grows is proportional to the number not yet learned.`,
        `一名学生要学会 $${a}$ 个知识点。已学会的数量 $L$ 的增长速率与尚未学会的数量成正比。`,
      ),
      v: "L",
      right: `\\frac{dL}{dt} = k(${a} - L)`,
      to: t(`the number not yet learned, $${a} - L$`, `尚未学会的数量 $${a} - L$`),
      wrong: [
        because(
          opt(`\\frac{dL}{dt} = kL`),
          "This is proportional to the facts already learned, not to those still to learn.",
          "这是与已学会的数量成正比，而不是与尚未学会的数量成正比。",
        ),
        because(
          opt(`\\frac{dL}{dt} = kL(${a} - L)`),
          "This has an extra factor $L$; the rate depends only on what is left to learn.",
          "这里多了一个因子 $L$；速率只取决于剩下要学的数量。",
        ),
        because(
          opt(`\\frac{dL}{dt} = ${a} - kL`),
          `The constant multiplies the whole number left, $${a} - L$.`,
          `常数乘的是剩下的全部数量 $${a} - L$。`,
        ),
      ],
    };
  return {
    words: t(
      "Water drains from a tank so that the volume $V$ decreases at a rate proportional to the square root of $V$.",
      "水从水箱中流出，使体积 $V$ 以与 $V$ 的平方根成正比的速率减少。",
    ),
    v: "V",
    right: "\\frac{dV}{dt} = -k\\sqrt{V}",
    to: t("$\\sqrt{V}$, with a minus sign because $V$ decreases", "$\\sqrt{V}$，并带负号，因为 $V$ 在减少"),
    wrong: [
      because(
        opt("\\frac{dV}{dt} = -kV^{2}"),
        "This uses the square of $V$, not its square root.",
        "这里用的是 $V$ 的平方，而不是平方根。",
      ),
      because(
        opt("\\frac{dV}{dt} = -\\sqrt{kt}"),
        "This depends on the time $t$, not on the volume $V$.",
        "这依赖于时间 $t$，而不是体积 $V$。",
      ),
      because(
        opt("\\frac{dV}{dt} = k\\sqrt{V}"),
        "With $k > 0$ this says $V$ increases; a draining tank needs a minus sign.",
        "当 $k > 0$ 时这表示 $V$ 在增加；排水的水箱需要负号。",
      ),
    ],
  };
}

/** modelingWithFirstOrderOdes turns descriptions of rates into equations. */
export const modelingWithFirstOrderOdes: TopicDef = {
  id: "modeling-with-first-order-odes",
  title: t("Modeling With First-Order ODEs", "用一阶常微分方程建模"),
  summary: t('"The rate of change of Q is proportional to X" translates to dQ/dt = kX.', "“Q 的变化率与 X 成正比”可以写成 dQ/dt = kX。"),
  intro: t(
    'A sentence about how fast something changes becomes a differential equation. "The rate of change of a population $P$ is proportional to $P$" says\n\n$$\\frac{dP}{dt} = kP.$$\n\nWith $k = 0.02$ per year, a population of $5000$ grows at $\\frac{dP}{dt} = 0.02 \\cdot 5000 = 100$ individuals per year.\n\nCheck: dividing the rate by the population gives back the constant: $\\frac{100}{5000} = 0.02 = k$.\n\nIn this lesson we translate descriptions of rates into differential equations and use an equation to find a rate.',
    "关于某个量变化快慢的一句话，可以变成一个微分方程。“种群数量 $P$ 的变化率与 $P$ 成正比”就是\n\n$$\\frac{dP}{dt} = kP$$\n\n若 $k = 0.02$（每年），数量为 $5000$ 的种群以 $\\frac{dP}{dt} = 0.02 \\cdot 5000 = 100$（每年个体数）的速率增长。\n\n检验：变化率除以种群数量又得到常数：$\\frac{100}{5000} = 0.02 = k$。\n\n本课我们把对变化率的描述写成微分方程，并用方程求出变化率。",
  ),
  prerequisites: ["introduction-to-differential-equations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "writing-a-model",
      title: t("Writing the equation", "写出方程"),
      explanation: t(
        'A rate of change is a derivative with respect to time, and "proportional to" means "a constant $k$ times". So "the amount $A$ grows at a rate proportional to the square of $A$" is $\\frac{dA}{dt} = kA^{2}$, and "the temperature $T$ changes at a rate proportional to the difference between $T$ and $20^{\\circ}$" is $\\frac{dT}{dt} = k(T - 20)$.\n\nCheck: read the equation back in words: $\\frac{dT}{dt} = k(T - 20)$ says the rate of change of $T$ is a constant times $T - 20$.\n\n> **Watch out.** The constant multiplies the whole quantity named: $k(T - 20)$, not $kT - 20$.',
        "变化率就是对时间的导数，“与……成正比”就是“常数 $k$ 乘以……”。所以“数量 $A$ 以与 $A$ 的平方成正比的速率增长”就是 $\\frac{dA}{dt} = kA^{2}$；“温度 $T$ 的变化率与 $T$ 和 $20^{\\circ}$ 之差成正比”就是 $\\frac{dT}{dt} = k(T - 20)$。\n\n检验：把方程读回成文字：$\\frac{dT}{dt} = k(T - 20)$ 说的是 $T$ 的变化率等于常数乘以 $T - 20$。\n\n> **注意。** 常数乘的是所说的整个量：是 $k(T - 20)$，不是 $kT - 20$。",
      ),
      generate(rng) {
        const m = modelCase(rng);
        const unit = rng.pick(timeUnits);
        return choose(
          rng,
          t(
            `${m.words.en} Which differential equation models this ($k$ is a positive constant and $t$ is in ${unit.en})?`,
            `${m.words["zh-CN"]}哪个微分方程描述了这一情形（$k$ 为正常数，$t$ 以${unit["zh-CN"]}为单位）？`,
          ),
          opt(m.right),
          m.wrong,
          [
            step(
              "Name the rate",
              "写出变化率",
              t(
                `The rate of change of $${m.v}$ is the derivative $\\frac{d${m.v}}{dt}$.`,
                `$${m.v}$ 的变化率就是导数 $\\frac{d${m.v}}{dt}$。`,
              ),
            ),
            step(
              "Translate the description",
              "翻译描述",
              t(`"Proportional to" means $k$ times ${m.to.en}:`, `“与……成正比”就是 $k$ 乘以${m.to["zh-CN"]}：`),
              m.right,
            ),
          ],
          t(
            `Read $${m.right}$ back in words: the rate of change of $${m.v}$ is a constant times ${m.to.en}, as described.`,
            `把 $${m.right}$ 读回成文字：$${m.v}$ 的变化率等于常数乘以${m.to["zh-CN"]}，与描述相符。`,
          ),
        );
      },
    },
    {
      id: "rates-from-a-model",
      title: t("Rates from a model", "由模型求变化率"),
      explanation: t(
        "A differential equation gives the rate of change from the current state. If $\\frac{dT}{dt} = -\\frac{1}{10}(T - 20)$ and $T = 80$, then $\\frac{dT}{dt} = -\\frac{1}{10} \\cdot 60 = -6$: the temperature is falling by $6$ degrees per minute at that moment.\n\nCheck: dividing the rate by $T - 20 = 60$ gives back $-\\frac{1}{10}$, the constant in the equation.\n\n> **Watch out.** Keep the sign: a negative rate means the quantity is falling at that moment.",
        "微分方程由当前状态给出变化率。若 $\\frac{dT}{dt} = -\\frac{1}{10}(T - 20)$ 且 $T = 80$，则 $\\frac{dT}{dt} = -\\frac{1}{10} \\cdot 60 = -6$：那一刻温度每分钟下降 $6$ 度。\n\n检验：变化率除以 $T - 20 = 60$，又得到方程中的常数 $-\\frac{1}{10}$。\n\n> **注意。** 保留符号：变化率为负表示该量在那一刻正在减少。",
      ),
      generate(rng) {
        if (rng.int(0, 1) === 0) {
          const k = Q.of(rng.int(1, 9), rng.pick([10, 20, 50, 100]));
          const P = rng.int(1, 20) * 100;
          const answer = k.mul(Q.of(P));
          return worked(
            t(
              `A population satisfies $\\frac{dP}{dt} = ${k.toLatex()}P$, with $t$ in years. How fast is it growing, in individuals per year, when $P = ${P}$?`,
              `某种群满足 $\\frac{dP}{dt} = ${k.toLatex()}P$，$t$ 以年为单位。当 $P = ${P}$ 时，它每年增长多少个体？`,
            ),
            answer,
            [
              step(
                "Read the equation",
                "读懂方程",
                t("The growth rate is the constant times the current population.", "增长速率等于常数乘以当前的种群数量。"),
              ),
              step(
                "Substitute",
                "代入",
                t(`Put $P = ${P}$:`, `代入 $P = ${P}$：`),
                `\\frac{dP}{dt} = ${k.toLatex()} \\cdot ${P} = ${answer.toLatex()}`,
              ),
            ],
            t(
              `Dividing the rate by the population gives back the constant: $${answer.toLatex()} \\div ${P} = ${k.toLatex()}$.`,
              `变化率除以种群数量又得到常数：$${answer.toLatex()} \\div ${P} = ${k.toLatex()}$。`,
            ),
            [
              slip(
                P,
                `$${P}$ is the population itself; the rate is $${k.toLatex()}$ times it.`,
                `$${P}$ 是种群数量本身；变化率是它的 $${k.toLatex()}$ 倍。`,
              ),
              slip(
                k,
                `$${k.toLatex()}$ is only the constant; multiply it by $P = ${P}$.`,
                `$${k.toLatex()}$ 只是常数；还要乘以 $P = ${P}$。`,
              ),
              slip(
                answer.add(Q.of(P)),
                "This adds the population to the rate; the question asks only for the rate of growth.",
                "这是把种群数量加到了变化率上；题目只问增长速率。",
              ),
            ],
          );
        }
        const k = Q.of(1, rng.pick([2, 4, 5, 10, 20]));
        const A = rng.int(1, 5) * 5;
        const T = A + rng.int(1, 16) * 5;
        const answer = k.neg().mul(Q.of(T - A));
        return worked(
          t(
            `A cooling object satisfies $\\frac{dT}{dt} = -${k.toLatex()}(T - ${A})$, with $t$ in minutes. Find $\\frac{dT}{dt}$ when $T = ${T}$.`,
            `一个冷却中的物体满足 $\\frac{dT}{dt} = -${k.toLatex()}(T - ${A})$，$t$ 以分钟为单位。求 $T = ${T}$ 时的 $\\frac{dT}{dt}$。`,
          ),
          answer,
          [
            step(
              "Find the difference",
              "求温差",
              t(`The object is $${T - A}$ degrees above the surroundings:`, `物体比环境高 $${T - A}$ 度：`),
              `T - ${A} = ${T} - ${A} = ${T - A}`,
            ),
            step(
              "Multiply by the constant",
              "乘以常数",
              t("", ""),
              `\\frac{dT}{dt} = -${k.toLatex()} \\cdot ${T - A} = ${answer.toLatex()}`,
            ),
          ],
          t(
            `Dividing the rate by the difference gives back the constant: $${answer.toLatex()} \\div ${T - A} = -${k.toLatex()}$. The rate is negative, as it should be for an object warmer than its surroundings.`,
            `变化率除以温差又得到常数：$${answer.toLatex()} \\div ${T - A} = -${k.toLatex()}$。变化率为负，正符合物体比环境热的情形。`,
          ),
          [
            slip(
              answer.neg(),
              `The sign is lost: $T > ${A}$, so the object is cooling and the rate is negative.`,
              `丢了符号：$T > ${A}$，物体正在冷却，变化率为负。`,
            ),
            slip(k.neg().mul(Q.of(T)), `This uses $T$ instead of the difference $T - ${A}$.`, `这里用了 $T$，而不是差 $T - ${A}$。`),
            slip(
              k.neg().mul(Q.of(T)).sub(Q.of(A)),
              `The constant multiplies the whole difference $T - ${A}$, not just $T$.`,
              `常数乘的是整个差 $T - ${A}$，而不只是 $T$。`,
            ),
          ],
        );
      },
    },
  ],
};

/** furtherModelingWithFirstOrderOdes models mixing tanks with rate in minus rate out. */
export const furtherModelingWithFirstOrderOdes: TopicDef = {
  id: "further-modeling-with-first-order-odes",
  title: t("Further Modeling With First-Order ODEs", "用一阶常微分方程进一步建模"),
  summary: t(
    "For a quantity in a tank, dS/dt = (rate in) − (rate out), where the rate out is the outflow times the current concentration.",
    "对水箱中的某种物质，dS/dt =（流入速率）−（流出速率），流出速率等于流出量乘以当前浓度。",
  ),
  intro: t(
    "A tank holds $100$ L of salt water containing $S$ kg of salt. Brine with $\\frac{1}{2}$ kg of salt per liter flows in at $5$ L/min, and the well-mixed solution drains at $5$ L/min. Salt enters at $5 \\cdot \\frac{1}{2}$ kg/min and leaves at $5 \\cdot \\frac{S}{100}$ kg/min, so\n\n$$\\frac{dS}{dt} = \\frac{5}{2} - \\frac{S}{20}.$$\n\nWhen $S = 20$, $\\frac{dS}{dt} = \\frac{5}{2} - 1 = \\frac{3}{2}$ kg/min.\n\nCheck: the tank's concentration $\\frac{20}{100} = \\frac{1}{5}$ is weaker than the brine's $\\frac{1}{2}$, so the salt should increase, and $\\frac{3}{2} > 0$.\n\nIn this lesson we model a mixing tank as rate in minus rate out and find the amount it settles at.",
    "水箱中有 $100$ 升盐水，含盐 $S$ 千克。每升含盐 $\\frac{1}{2}$ 千克的盐水以每分钟 $5$ 升流入，充分混合的溶液以每分钟 $5$ 升流出。盐以每分钟 $5 \\cdot \\frac{1}{2}$ 千克流入，以每分钟 $5 \\cdot \\frac{S}{100}$ 千克流出，所以\n\n$$\\frac{dS}{dt} = \\frac{5}{2} - \\frac{S}{20}$$\n\n当 $S = 20$ 时，$\\frac{dS}{dt} = \\frac{5}{2} - 1 = \\frac{3}{2}$ 千克/分钟。\n\n检验：水箱的浓度 $\\frac{20}{100} = \\frac{1}{5}$ 比流入盐水的 $\\frac{1}{2}$ 低，所以盐应当增加，而 $\\frac{3}{2} > 0$。\n\n本课我们把混合问题建模为流入速率减去流出速率，并求出含量最终稳定的值。",
  ),
  prerequisites: ["modeling-with-first-order-odes"],
  encompasses: [{ topic: "modeling-with-first-order-odes", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "mixing-tank-rates",
      title: t("Rates in a mixing tank", "混合问题中的变化率"),
      explanation: t(
        "A tank holds $V$ liters of well-mixed salt water containing $S$ kg of salt. Brine with $c$ kg of salt per liter flows in at $r$ liters per minute, and the mixture flows out at the same rate. Salt enters at $rc$ kg/min and leaves at $r \\cdot \\frac{S}{V}$ kg/min, so\n\n$$\\frac{dS}{dt} = rc - \\frac{rS}{V}.$$\n\nWith $V = 100$, $r = 5$, $c = \\frac{1}{2}$ and $S = 20$: $\\frac{dS}{dt} = \\frac{5}{2} - 1 = \\frac{3}{2}$.\n\nCheck: factoring out the flow, $\\frac{dS}{dt} = 5\\left(\\frac{1}{2} - \\frac{1}{5}\\right) = \\frac{3}{2}$, positive because the tank is weaker than the brine.\n\n> **Watch out.** The rate out is the outflow times the concentration $\\frac{S}{V}$, not the amount $S$ itself.",
        "水箱中有 $V$ 升充分混合的盐水，含盐 $S$ 千克。每升含盐 $c$ 千克的盐水以每分钟 $r$ 升流入，混合液以相同速率流出。盐以每分钟 $rc$ 千克流入，以每分钟 $r \\cdot \\frac{S}{V}$ 千克流出，所以\n\n$$\\frac{dS}{dt} = rc - \\frac{rS}{V}$$\n\n当 $V = 100$，$r = 5$，$c = \\frac{1}{2}$，$S = 20$ 时：$\\frac{dS}{dt} = \\frac{5}{2} - 1 = \\frac{3}{2}$。\n\n检验：提出流量，$\\frac{dS}{dt} = 5\\left(\\frac{1}{2} - \\frac{1}{5}\\right) = \\frac{3}{2}$，为正，因为水箱的浓度比流入的盐水低。\n\n> **注意。** 流出速率是流出量乘以浓度 $\\frac{S}{V}$，而不是含盐量 $S$ 本身。",
      ),
      generate(rng) {
        const V = rng.pick([100, 200, 400, 500, 1000]);
        const r = rng.pick([2, 4, 5, 10, 20]);
        const c = Q.of(rng.int(1, 4), rng.pick([2, 4, 5, 10]));
        const S = rng.int(1, 20) * 5;
        const into = c.mul(Q.of(r));
        const out = Q.of(r * S, V);
        const answer = into.sub(out);
        const gap = c.sub(Q.of(S, V));
        const sense =
          gap.sign() > 0
            ? t("positive because the tank is weaker than the incoming brine", "为正，因为水箱的浓度比流入的盐水低")
            : gap.sign() < 0
              ? t("negative because the tank is stronger than the incoming brine", "为负，因为水箱的浓度比流入的盐水高")
              : t("zero because the two concentrations are equal", "为零，因为两个浓度相等");
        return worked(
          t(
            `A tank holds $${V}$ L of salt water. Brine containing $${c.toLatex()}$ kg of salt per liter flows in at $${r}$ L/min, and the well-mixed solution drains at $${r}$ L/min. Find $\\frac{dS}{dt}$, in kg/min, at the moment the tank contains $S = ${S}$ kg of salt.`,
            `水箱中有 $${V}$ 升盐水。每升含盐 $${c.toLatex()}$ 千克的盐水以每分钟 $${r}$ 升流入，充分混合的溶液以每分钟 $${r}$ 升流出。求水箱含盐 $S = ${S}$ 千克的那一刻的 $\\frac{dS}{dt}$（千克/分钟）。`,
          ),
          answer,
          [
            step(
              "Rate in",
              "流入速率",
              t("Salt enters at the inflow times the brine's concentration:", "盐的流入速率等于流入量乘以盐水的浓度："),
              `${r} \\cdot ${c.toLatex()} = ${into.toLatex()}`,
            ),
            step(
              "Rate out",
              "流出速率",
              t(
                "Salt leaves at the outflow times the tank's concentration $\\frac{S}{V}$:",
                "盐的流出速率等于流出量乘以水箱的浓度 $\\frac{S}{V}$：",
              ),
              `${r} \\cdot \\frac{${S}}{${V}} = ${out.toLatex()}`,
            ),
            step(
              "Subtract",
              "相减",
              t("The salt changes at rate in minus rate out:", "含盐量的变化率等于流入速率减去流出速率："),
              `\\frac{dS}{dt} = ${into.toLatex()} - ${out.toLatex()} = ${answer.toLatex()}`,
            ),
          ],
          t(
            `Factor out the flow: $\\frac{dS}{dt} = ${r}\\left(${c.toLatex()} - \\frac{${S}}{${V}}\\right) = ${r} \\cdot ${neg(gap)} = ${answer.toLatex()}$, ${sense.en}.`,
            `提出流量：$\\frac{dS}{dt} = ${r}\\left(${c.toLatex()} - \\frac{${S}}{${V}}\\right) = ${r} \\cdot ${neg(gap)} = ${answer.toLatex()}$，${sense["zh-CN"]}。`,
          ),
          [
            slip(into.add(out), "The salt draining out is lost, so subtract the rate out.", "流出的盐是减少的，所以要减去流出速率。"),
            slip(into, "This is only the rate in; salt also drains out with the solution.", "这只是流入速率；盐还会随溶液流出。"),
            slip(
              into.sub(Q.of(S, V)),
              `$\\frac{${S}}{${V}}$ is the concentration; the rate out is $${r}$ L/min times it.`,
              `$\\frac{${S}}{${V}}$ 是浓度；流出速率是它乘以每分钟 $${r}$ 升。`,
            ),
          ],
        );
      },
    },
    {
      id: "long-run-amount-in-a-tank",
      title: t("The long-run amount", "长期的含量"),
      explanation: t(
        "The salt stops changing when $\\frac{dS}{dt} = 0$, that is $rc = \\frac{rS}{V}$, or $S = cV$: the tank ends up with the concentration of the incoming brine. With $V = 200$ L and $c = \\frac{1}{4}$ kg/L, the amount approaches $50$ kg.\n\nCheck: at $S = 50$ the tank's concentration is $\\frac{50}{200} = \\frac{1}{4}$, the same as the brine, so salt flows in and out at the same rate.\n\n> **Watch out.** The long-run amount depends only on $c$ and $V$, not on the starting amount or the flow rate.",
        "当 $\\frac{dS}{dt} = 0$ 即 $rc = \\frac{rS}{V}$ 时，含盐量不再变化，此时 $S = cV$：水箱最终达到流入盐水的浓度。当 $V = 200$ 升、$c = \\frac{1}{4}$ 千克/升时，含盐量趋于 $50$ 千克。\n\n检验：$S = 50$ 时水箱的浓度为 $\\frac{50}{200} = \\frac{1}{4}$，与流入的盐水相同，所以盐的流入与流出速率相等。\n\n> **注意。** 长期含量只取决于 $c$ 和 $V$，与初始含量和流速无关。",
      ),
      generate(rng) {
        const V = rng.pick([100, 200, 400, 500, 1000]);
        const r = rng.pick([2, 4, 5, 10, 20]);
        const c = Q.of(rng.int(1, 4), rng.pick([2, 4, 5, 10]));
        const S0 = rng.int(0, 10) * 5;
        const into = c.mul(Q.of(r));
        const answer = c.mul(Q.of(V));
        return worked(
          t(
            `A tank holds $${V}$ L of water containing $${S0}$ kg of salt. Brine containing $${c.toLatex()}$ kg of salt per liter flows in at $${r}$ L/min, and the well-mixed solution drains at the same rate. How many kilograms of salt does the tank contain in the long run?`,
            `水箱中有 $${V}$ 升水，含盐 $${S0}$ 千克。每升含盐 $${c.toLatex()}$ 千克的盐水以每分钟 $${r}$ 升流入，充分混合的溶液以相同速率流出。长期来看水箱中含盐多少千克？`,
          ),
          answer,
          [
            step(
              "Write the rate",
              "写出变化率",
              t("Rate in minus rate out:", "流入速率减去流出速率："),
              `\\frac{dS}{dt} = ${r} \\cdot ${c.toLatex()} - \\frac{${r}S}{${V}}`,
            ),
            step(
              "Set it to zero",
              "令它为零",
              t("The amount settles where it stops changing:", "含盐量在不再变化处稳定下来："),
              `${into.toLatex()} = \\frac{${r}S}{${V}}`,
              `S = ${c.toLatex()} \\cdot ${V} = ${answer.toLatex()}`,
            ),
          ],
          t(
            `At $S = ${answer.toLatex()}$ the tank's concentration is $\\frac{${answer.toLatex()}}{${V}} = ${c.toLatex()}$ kg/L, the same as the brine, so salt enters and leaves at the same rate. Below this amount $\\frac{dS}{dt} > 0$ and above it $\\frac{dS}{dt} < 0$, so the salt moves toward it from any start.`,
            `当 $S = ${answer.toLatex()}$ 时，水箱的浓度为 $\\frac{${answer.toLatex()}}{${V}} = ${c.toLatex()}$ 千克/升，与流入的盐水相同，所以盐的流入与流出速率相等。低于这个量时 $\\frac{dS}{dt} > 0$，高于它时 $\\frac{dS}{dt} < 0$，所以无论从哪里开始，含盐量都趋向它。`,
          ),
          [
            slip(
              into,
              `$${into.toLatex()}$ kg/min is the rate at which salt enters, not an amount.`,
              `$${into.toLatex()}$ 千克/分钟是盐的流入速率，不是含量。`,
            ),
            slip(
              answer.add(Q.of(S0)),
              "The starting salt does not add on: it drains away and the tank settles at the brine's concentration.",
              "初始的盐不会累加上去：它会流走，水箱最终达到盐水的浓度。",
            ),
            slip(
              S0,
              `$${S0}$ kg is only the starting amount; the brine keeps changing it until the concentrations match.`,
              `$${S0}$ 千克只是初始含量；盐水会不断改变它，直到两个浓度相等。`,
            ),
            slip(
              c,
              `$${c.toLatex()}$ kg/L is a concentration; multiply it by the volume $${V}$ L.`,
              `$${c.toLatex()}$ 千克/升是浓度；要乘以体积 $${V}$ 升。`,
            ),
          ],
        );
      },
    },
  ],
};

/** directions are what a solution curve does at a point. */
const directions = [t("Increasing", "递增"), t("Decreasing", "递减"), t("Neither: the slope is 0 there", "都不是：该处斜率为 0")] as const;

/** qualitativeAnalysisOfFirstOrderOdes reads the shape of solutions from the equation. */
export const qualitativeAnalysisOfFirstOrderOdes: TopicDef = {
  id: "qualitative-analysis-of-first-order-odes",
  title: t("Qualitative Analysis of First-Order ODEs", "一阶常微分方程的定性分析"),
  summary: t(
    "dy/dx = f(x, y) gives the slope of the solution through each point; differentiating again gives its concavity.",
    "dy/dx = f(x, y) 给出过每一点的解曲线的斜率；再求导一次得到凹凸性。",
  ),
  intro: t(
    "A differential equation describes its solutions even before it is solved. For $\\frac{dy}{dx} = x - 2y$, the solution through $(1, 3)$ has slope $1 - 6 = -5$ there, so it is decreasing. Differentiating the equation gives the second derivative:\n\n$$\\frac{d^{2}y}{dx^{2}} = 1 - 2\\frac{dy}{dx} = 1 - 2(-5) = 11 > 0,$$\n\nso the solution is also concave up there.\n\nCheck: substituting the equation first, $\\frac{d^{2}y}{dx^{2}} = 1 - 2(x - 2y) = 1 - 2x + 4y$, which is $1 - 2 + 12 = 11$ at $(1, 3)$.\n\nIn this lesson we decide where solutions increase or decrease and find their concavity, straight from the equation.",
    "不必解出微分方程，它就已经描述了解的样子。对 $\\frac{dy}{dx} = x - 2y$，过 $(1, 3)$ 的解在该处的斜率为 $1 - 6 = -5$，所以它在递减。对方程求导得到二阶导数：\n\n$$\\frac{d^{2}y}{dx^{2}} = 1 - 2\\frac{dy}{dx} = 1 - 2(-5) = 11 > 0$$\n\n所以这个解在该处还是上凹的。\n\n检验：先代入方程，$\\frac{d^{2}y}{dx^{2}} = 1 - 2(x - 2y) = 1 - 2x + 4y$，在 $(1, 3)$ 处等于 $1 - 2 + 12 = 11$。\n\n本课我们直接从方程判断解在哪里递增或递减，并求出它的凹凸性。",
  ),
  prerequisites: ["introduction-to-differential-equations", "implicit-differentiation"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "increasing-or-decreasing-solutions",
      title: t("Increasing or decreasing", "递增还是递减"),
      explanation: t(
        "Without solving, $\\frac{dy}{dx} = f(x, y)$ tells the slope of the solution curve through any point. For $\\frac{dy}{dx} = x - 2y$ at $(1, 3)$: $1 - 6 = -5 < 0$, so the solution through $(1, 3)$ is decreasing there.\n\nCheck: a short step along the tangent from $x = 1$ to $x = 1.1$ changes $y$ by about $0.1 \\cdot (-5) = -0.5$, so the curve goes down.\n\n> **Watch out.** Substitute both coordinates: the slope depends on $y$ as well as on $x$.",
        "不必求解，$\\frac{dy}{dx} = f(x, y)$ 就告诉我们过任一点的解曲线的斜率。对 $\\frac{dy}{dx} = x - 2y$，在 $(1, 3)$ 处：$1 - 6 = -5 < 0$，所以过 $(1, 3)$ 的解在该处递减。\n\n检验：沿切线从 $x = 1$ 走到 $x = 1.1$，$y$ 大约变化 $0.1 \\cdot (-5) = -0.5$，所以曲线在下降。\n\n> **注意。** 两个坐标都要代入：斜率既依赖于 $x$，也依赖于 $y$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const x0 = rng.int(-4, 4);
        const y0 = rng.int(-4, 4);
        const c = rng.int(0, 3) === 0 ? -(a * x0 + b * y0) : rng.int(-5, 5);
        const v = a * x0 + b * y0 + c;
        const rhs = poly([a, "x"], [b, "y"], [c, ""]);
        const right = v > 0 ? 0 : v < 0 ? 1 : 2;
        const reasons = [
          because(
            directions[0],
            `Increasing needs a positive slope, and the slope at this point is $${v}$.`,
            `递增要求斜率为正，而这一点的斜率是 $${v}$。`,
          ),
          because(
            directions[1],
            `Decreasing needs a negative slope, and the slope at this point is $${v}$.`,
            `递减要求斜率为负，而这一点的斜率是 $${v}$。`,
          ),
          because(directions[2], `The slope at this point is $${v}$, which is not $0$.`, `这一点的斜率是 $${v}$，不是 $0$。`),
        ];
        const sign =
          v > 0
            ? t("The slope is positive, so the solution is increasing there.", "斜率为正，所以解在该处递增。")
            : v < 0
              ? t("The slope is negative, so the solution is decreasing there.", "斜率为负，所以解在该处递减。")
              : t(
                  "The slope is $0$, so the solution is neither increasing nor decreasing there.",
                  "斜率为 $0$，所以解在该处既不递增也不递减。",
                );
        return choose(
          rng,
          t(
            `Let $y$ be the solution of $\\frac{dy}{dx} = ${rhs}$ whose graph passes through $(${x0}, ${y0})$. Is it increasing or decreasing at that point?`,
            `设 $y$ 是 $\\frac{dy}{dx} = ${rhs}$ 的图像经过 $(${x0}, ${y0})$ 的解。它在该点递增还是递减？`,
          ),
          directions[right],
          reasons.filter((_, i) => i !== right),
          [
            step(
              "Substitute the point",
              "代入该点",
              t(
                `The slope of the solution at $(${x0}, ${y0})$ is the right side there:`,
                `解在 $(${x0}, ${y0})$ 处的斜率就是右边在该点的值：`,
              ),
              `\\frac{dy}{dx} = ${a} \\cdot ${neg(x0)} + ${neg(b)} \\cdot ${neg(y0)} + ${neg(c)} = ${v}`,
            ),
            step("Read the sign", "看符号", sign),
          ],
          t(
            `Follow the tangent a short way: from $x = ${x0}$ to $x = ${x0} + 0.1$, $y$ changes by about $0.1 \\cdot ${neg(v)} = ${Q.of(v, 10).toLatex()}$, so the curve ${v > 0 ? "rises" : v < 0 ? "falls" : "is level for the moment"}.`,
            `沿切线走一小段：从 $x = ${x0}$ 到 $x = ${x0} + 0.1$，$y$ 大约变化 $0.1 \\cdot ${neg(v)} = ${Q.of(v, 10).toLatex()}$，所以曲线${v > 0 ? "上升" : v < 0 ? "下降" : "暂时是平的"}。`,
          ),
        );
      },
    },
    {
      id: "concavity-of-solutions",
      title: t("Concavity of solutions", "解的凹凸性"),
      explanation: t(
        "Differentiate the equation implicitly, remembering that $y$ depends on $x$. For $\\frac{dy}{dx} = x + y$: $\\frac{d^{2}y}{dx^{2}} = 1 + \\frac{dy}{dx}$. At $(0, 2)$ the slope is $0 + 2 = 2$, so $\\frac{d^{2}y}{dx^{2}} = 1 + 2 = 3 > 0$, and the solution is concave up there.\n\nCheck: substituting the equation first gives $\\frac{d^{2}y}{dx^{2}} = 1 + x + y$, which is $1 + 0 + 2 = 3$ at $(0, 2)$.\n\n> **Watch out.** The derivative of $y$ is $\\frac{dy}{dx}$, not $1$ and not $0$: $y$ is a function of $x$.",
        "对方程作隐函数求导，记住 $y$ 依赖于 $x$。对 $\\frac{dy}{dx} = x + y$：$\\frac{d^{2}y}{dx^{2}} = 1 + \\frac{dy}{dx}$。在 $(0, 2)$ 处斜率为 $0 + 2 = 2$，所以 $\\frac{d^{2}y}{dx^{2}} = 1 + 2 = 3 > 0$，解在该处上凹。\n\n检验：先代入方程得 $\\frac{d^{2}y}{dx^{2}} = 1 + x + y$，在 $(0, 2)$ 处为 $1 + 0 + 2 = 3$。\n\n> **注意。** $y$ 的导数是 $\\frac{dy}{dx}$，不是 $1$ 也不是 $0$：$y$ 是 $x$ 的函数。",
      ),
      generate(rng) {
        const a = rng.nonZero(-4, 4);
        const b = rng.nonZero(-4, 4);
        const x0 = rng.int(-3, 3);
        const y0 = rng.int(-3, 3);
        const rhs = poly([a, "x"], [b, "y"]);
        const slope = a * x0 + b * y0;
        const answer = a + b * slope;
        return worked(
          t(
            `For the solution of $\\frac{dy}{dx} = ${rhs}$ through $(${x0}, ${y0})$, find $\\frac{d^{2}y}{dx^{2}}$ at that point.`,
            `对 $\\frac{dy}{dx} = ${rhs}$ 过 $(${x0}, ${y0})$ 的解，求它在该点的 $\\frac{d^{2}y}{dx^{2}}$。`,
          ),
          answer,
          [
            step(
              "Differentiate the equation",
              "对方程求导",
              t(
                "Differentiate both sides with respect to $x$; the derivative of $y$ is $\\frac{dy}{dx}$:",
                "两边对 $x$ 求导；$y$ 的导数是 $\\frac{dy}{dx}$：",
              ),
              `\\frac{d^{2}y}{dx^{2}} = ${poly([a, ""], [b, "\\frac{dy}{dx}"])}`,
            ),
            step(
              "Find the slope at the point",
              "求该点的斜率",
              t("", ""),
              `\\frac{dy}{dx} = ${a} \\cdot ${neg(x0)} + ${neg(b)} \\cdot ${neg(y0)} = ${slope}`,
            ),
            step("Substitute", "代入", t("", ""), `\\frac{d^{2}y}{dx^{2}} = ${a} + ${neg(b)} \\cdot ${neg(slope)} = ${answer}`),
          ],
          t(
            `Substitute the equation first: $\\frac{d^{2}y}{dx^{2}} = ${a} + ${neg(b)}(${rhs}) = ${poly([a, ""], [a * b, "x"], [b * b, "y"])}$, and at $(${x0}, ${y0})$ this is $${a} + ${neg(a * b)} \\cdot ${neg(x0)} + ${b * b} \\cdot ${neg(y0)} = ${answer}$.`,
            `先代入方程：$\\frac{d^{2}y}{dx^{2}} = ${a} + ${neg(b)}(${rhs}) = ${poly([a, ""], [a * b, "x"], [b * b, "y"])}$，在 $(${x0}, ${y0})$ 处为 $${a} + ${neg(a * b)} \\cdot ${neg(x0)} + ${b * b} \\cdot ${neg(y0)} = ${answer}$。`,
          ),
          [
            slip(
              a + b,
              "This differentiates $y$ as if its derivative were $1$; it is $\\frac{dy}{dx}$, the slope at the point.",
              "这是把 $y$ 的导数当成了 $1$；它应是 $\\frac{dy}{dx}$，即该点的斜率。",
            ),
            slip(slope, "This is the first derivative at the point; differentiate once more.", "这是该点的一阶导数；还要再求一次导。"),
            slip(
              a,
              `This treats $y$ as a constant; the derivative of $${poly([b, "y"])}$ is $${poly([b, "\\frac{dy}{dx}"])}$, not $0$.`,
              `这是把 $y$ 当成了常数；$${poly([b, "y"])}$ 的导数是 $${poly([b, "\\frac{dy}{dx}"])}$，不是 $0$。`,
            ),
          ],
        );
      },
    },
  ],
};

/** stabilities classify an equilibrium. */
const stabilities = [
  t("Stable: nearby solutions approach it", "稳定：附近的解趋向它"),
  t("Unstable: nearby solutions move away from it", "不稳定：附近的解远离它"),
  t("Semi-stable: solutions approach it from one side only", "半稳定：只有一侧的解趋向它"),
] as const;

/** equilibriumSolutionsOfFirstOrderOdes finds constant solutions of autonomous equations and classifies them. */
export const equilibriumSolutionsOfFirstOrderOdes: TopicDef = {
  id: "equilibrium-solutions-of-first-order-odes",
  title: t("Equilibrium Solutions of First-Order ODEs", "一阶常微分方程的平衡解"),
  summary: t(
    "For dy/dt = f(y), each zero c of f gives a constant solution y = c, which is stable or unstable according to the sign of f on either side.",
    "对 dy/dt = f(y)，f 的每个零点 c 给出常数解 y = c；按 f 在两侧的符号判断它稳定还是不稳定。",
  ),
  intro: t(
    "For $\\frac{dy}{dt} = (y - 2)(y - 3)$, the constant functions $y = 2$ and $y = 3$ are solutions, because the right side is $0$ there. Between them the right side is negative, below $2$ and above $3$ it is positive:\n\n$$y < 2: \\ \\frac{dy}{dt} > 0, \\qquad 2 < y < 3: \\ \\frac{dy}{dt} < 0, \\qquad y > 3: \\ \\frac{dy}{dt} > 0.$$\n\nSo solutions near $2$ move toward it (stable) and solutions near $3$ move away from it (unstable).\n\nCheck: for $f(y) = (y - 2)(y - 3) = y^{2} - 5y + 6$, $f'(2) = -1 < 0$ and $f'(3) = 1 > 0$, which gives the same verdicts.\n\nIn this lesson we find the equilibrium solutions of an autonomous equation and classify them as stable, unstable or semi-stable.",
    "对 $\\frac{dy}{dt} = (y - 2)(y - 3)$，常函数 $y = 2$ 和 $y = 3$ 都是解，因为右边在那里为 $0$。在它们之间右边为负，在 $2$ 以下和 $3$ 以上为正：\n\n$$y < 2: \\ \\frac{dy}{dt} > 0, \\qquad 2 < y < 3: \\ \\frac{dy}{dt} < 0, \\qquad y > 3: \\ \\frac{dy}{dt} > 0$$\n\n所以 $2$ 附近的解趋向它（稳定），$3$ 附近的解远离它（不稳定）。\n\n检验：对 $f(y) = (y - 2)(y - 3) = y^{2} - 5y + 6$，$f'(2) = -1 < 0$，$f'(3) = 1 > 0$，得到同样的结论。\n\n本课我们求自治方程的平衡解，并判断它们是稳定、不稳定还是半稳定的。",
  ),
  prerequisites: ["qualitative-analysis-of-first-order-odes"],
  encompasses: [{ topic: "qualitative-analysis-of-first-order-odes", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-equilibrium-solutions",
      title: t("Finding equilibrium solutions", "求平衡解"),
      explanation: t(
        "An equation $\\frac{dy}{dt} = f(y)$ whose right side does not involve $t$ is **autonomous**. If $f(c) = 0$, the constant function $y = c$ is a solution, called an **equilibrium solution**. For $\\frac{dy}{dt} = y^{2} - 5y + 6 = (y - 2)(y - 3)$, the equilibria are $y = 2$ and $y = 3$.\n\nCheck: substituting the constant $y = 2$ gives $\\frac{dy}{dt} = 0$ on the left and $4 - 10 + 6 = 0$ on the right.\n\n> **Watch out.** An equilibrium is the value that makes a factor zero: $(y + 4)$ gives $y = -4$, not $4$.",
        "右边不含 $t$ 的方程 $\\frac{dy}{dt} = f(y)$ 叫做**自治方程**。若 $f(c) = 0$，常函数 $y = c$ 就是解，称为**平衡解**。对 $\\frac{dy}{dt} = y^{2} - 5y + 6 = (y - 2)(y - 3)$，平衡解为 $y = 2$ 和 $y = 3$。\n\n检验：代入常数 $y = 2$，左边 $\\frac{dy}{dt} = 0$，右边 $4 - 10 + 6 = 0$。\n\n> **注意。** 平衡解是使某个因子为零的值：$(y + 4)$ 给出 $y = -4$，而不是 $4$。",
      ),
      generate(rng) {
        const a = rng.int(-6, 5);
        const b = rng.int(a + 1, 7);
        const k = rng.nonZero(-3, 3);
        const kTex = k === 1 ? "" : k === -1 ? "-" : `${k}`;
        const f = poly([k, "y^{2}"], [-k * (a + b), "y"], [k * a * b, ""]);
        const larger = rng.bool();
        const answer = larger ? b : a;
        const word = larger ? t("larger", "较大") : t("smaller", "较小");
        return worked(
          t(
            `The equation $\\frac{dy}{dt} = ${f}$ has two equilibrium solutions. Find the ${word.en} one.`,
            `方程 $\\frac{dy}{dt} = ${f}$ 有两个平衡解。求${word["zh-CN"]}的那个。`,
          ),
          answer,
          [
            step("Factor", "因式分解", t("Factor the right side:", "把右边因式分解："), `${f} = ${kTex}${factors(a, b)}`),
            step(
              "Set it to zero",
              "令它为零",
              t(
                `An equilibrium is a constant $y = c$ with $f(c) = 0$, so $y = ${a}$ or $y = ${b}$. The ${word.en} one is $y = ${answer}$.`,
                `平衡解是满足 $f(c) = 0$ 的常数 $y = c$，所以 $y = ${a}$ 或 $y = ${b}$。${word["zh-CN"]}的是 $y = ${answer}$。`,
              ),
            ),
          ],
          t(
            `Substitute the constant $y = ${answer}$: the left side is $\\frac{dy}{dt} = 0$, and the right side is $${k * answer * answer}${plus(-k * (a + b) * answer)}${plus(k * a * b)} = 0$.`,
            `代入常数 $y = ${answer}$：左边 $\\frac{dy}{dt} = 0$，右边为 $${k * answer * answer}${plus(-k * (a + b) * answer)}${plus(k * a * b)} = 0$。`,
          ),
          [
            slip(
              larger ? a : b,
              `$${larger ? a : b}$ is the ${larger ? "smaller" : "larger"} equilibrium; the question asks for the ${word.en} one.`,
              `$${larger ? a : b}$ 是${larger ? "较小" : "较大"}的平衡解；题目要的是${word["zh-CN"]}的那个。`,
            ),
            slip(
              -b,
              `The sign is flipped: $y = ${b}$ is the value that makes its factor zero.`,
              `符号反了：使对应因子为零的是 $y = ${b}$。`,
            ),
            slip(
              -a,
              `The sign is flipped: $y = ${a}$ is the value that makes its factor zero.`,
              `符号反了：使对应因子为零的是 $y = ${a}$。`,
            ),
            slip(
              0,
              `At $y = 0$ the right side is $${k * a * b}$, not $0$, so $y = 0$ is not an equilibrium.`,
              `在 $y = 0$ 处右边等于 $${k * a * b}$，不是 $0$，所以 $y = 0$ 不是平衡解。`,
            ),
          ],
        );
      },
    },
    {
      id: "stability-of-equilibrium-solutions",
      title: t("Stability of equilibria", "平衡解的稳定性"),
      explanation: t(
        "Look at the sign of $f(y)$ just below and just above an equilibrium $c$. If $y$ increases below $c$ and decreases above it, solutions move toward $c$: it is **stable**. If they move away on both sides, it is **unstable**. If $f$ has the same sign on both sides, as for $\\frac{dy}{dt} = (y - 1)^{2}$, solutions approach from one side only: **semi-stable**. For $\\frac{dy}{dt} = (y - 2)(y - 3)$, $f > 0$ below $2$ and $f < 0$ just above it, so $y = 2$ is stable.\n\nCheck: the derivative test agrees: $f'(y) = 2y - 5$ and $f'(2) = -1 < 0$, so $y = 2$ is stable.\n\n> **Watch out.** Look at both sides: when the sign is the same on both sides, the equilibrium is semi-stable, neither stable nor unstable.",
        "看平衡解 $c$ 稍下方和稍上方 $f(y)$ 的符号。若在 $c$ 下方 $y$ 递增、在上方递减，解都朝 $c$ 移动：它是**稳定**的。若两侧的解都远离 $c$，它是**不稳定**的。若 $f$ 在两侧同号，例如 $\\frac{dy}{dt} = (y - 1)^{2}$，解只从一侧趋向它：**半稳定**。对 $\\frac{dy}{dt} = (y - 2)(y - 3)$，在 $2$ 以下 $f > 0$，在 $2$ 稍上方 $f < 0$，所以 $y = 2$ 是稳定的。\n\n检验：导数判别法给出同样结论：$f'(y) = 2y - 5$，$f'(2) = -1 < 0$，所以 $y = 2$ 稳定。\n\n> **注意。** 两侧都要看：两侧符号相同时，平衡解是半稳定的，既不是稳定的也不是不稳定的。",
      ),
      generate(rng) {
        const a = rng.int(-6, 5);
        const b = rng.int(a + 1, 7);
        const k = rng.pick([-1, 1, -2, 2]);
        const kTex = k === 1 ? "" : k === -1 ? "-" : `${k}`;
        const sign = (positive: boolean) => (positive ? t("positive", "为正") : t("negative", "为负"));
        if (rng.int(0, 3) === 0) {
          const f = `${kTex}${a === 0 ? "y" : `(${linear(1, -a, "y")})`}^{2}`;
          const up = k > 0;
          return choose(
            rng,
            t(
              `Classify the equilibrium $y = ${a}$ of $\\frac{dy}{dt} = ${f}$.`,
              `判断 $\\frac{dy}{dt} = ${f}$ 的平衡解 $y = ${a}$ 的稳定性。`,
            ),
            stabilities[2],
            [
              because(
                stabilities[0],
                `Solutions ${up ? "above" : "below"} $y = ${a}$ move away from it, so it is not stable.`,
                `$y = ${a}$ ${up ? "上方" : "下方"}的解远离它，所以它不是稳定的。`,
              ),
              because(
                stabilities[1],
                `Solutions ${up ? "below" : "above"} $y = ${a}$ move toward it, so it is not unstable.`,
                `$y = ${a}$ ${up ? "下方" : "上方"}的解趋向它，所以它不是不稳定的。`,
              ),
            ],
            [
              step(
                "Sign below",
                "下方的符号",
                t(
                  `For $y < ${a}$ the square is positive, so $\\frac{dy}{dt}$ is ${sign(up).en}: solutions ${up ? "rise toward" : "fall away from"} $y = ${a}$.`,
                  `当 $y < ${a}$ 时平方为正，所以 $\\frac{dy}{dt}$ ${sign(up)["zh-CN"]}：解${up ? "上升趋向" : "下降远离"} $y = ${a}$。`,
                ),
              ),
              step(
                "Sign above",
                "上方的符号",
                t(
                  `For $y > ${a}$ it is ${sign(up).en} again: solutions ${up ? "rise away from" : "fall toward"} $y = ${a}$.`,
                  `当 $y > ${a}$ 时它同样${sign(up)["zh-CN"]}：解${up ? "上升远离" : "下降趋向"} $y = ${a}$。`,
                ),
              ),
              step(
                "Classify",
                "判断",
                t(
                  "Solutions approach from one side only, so the equilibrium is semi-stable.",
                  "只有一侧的解趋向它，所以平衡解是半稳定的。",
                ),
              ),
            ],
            t(
              `Test values on each side: $f(${a - 1}) = ${k}$ and $f(${a + 1}) = ${k}$ have the same sign, so the flow goes the same way on both sides of $y = ${a}$: toward it on one side and away on the other.`,
              `在两侧各取一个值：$f(${a - 1}) = ${k}$，$f(${a + 1}) = ${k}$，符号相同，所以 $y = ${a}$ 两侧的流向一致：一侧趋向它，另一侧远离它。`,
            ),
          );
        }
        const f = `${kTex}${factors(a, b)}`;
        const atLower = rng.bool();
        const c = atLower ? a : b;
        // Between a and b the product (y − a)(y − b) is negative.
        const between = -k > 0;
        const stable = atLower ? !between : between;
        const slope = k * (2 * c - a - b);
        return choose(
          rng,
          t(
            `Classify the equilibrium $y = ${c}$ of $\\frac{dy}{dt} = ${f}$.`,
            `判断 $\\frac{dy}{dt} = ${f}$ 的平衡解 $y = ${c}$ 的稳定性。`,
          ),
          stabilities[stable ? 0 : 1],
          stable
            ? [
                because(
                  stabilities[1],
                  `Solutions on both sides move toward $y = ${c}$, not away from it.`,
                  `两侧的解都趋向 $y = ${c}$，而不是远离它。`,
                ),
                because(
                  stabilities[2],
                  `$\\frac{dy}{dt}$ changes sign at $y = ${c}$, so solutions approach from both sides, not just one.`,
                  `$\\frac{dy}{dt}$ 在 $y = ${c}$ 处变号，所以两侧的解都趋向它，而不只是一侧。`,
                ),
              ]
            : [
                because(stabilities[0], `Solutions on both sides move away from $y = ${c}$.`, `两侧的解都远离 $y = ${c}$。`),
                because(
                  stabilities[2],
                  `$\\frac{dy}{dt}$ changes sign at $y = ${c}$, so solutions leave on both sides, not just one.`,
                  `$\\frac{dy}{dt}$ 在 $y = ${c}$ 处变号，所以两侧的解都离开它，而不只是一侧。`,
                ),
              ],
          [
            step(
              "Sign between the roots",
              "两根之间的符号",
              t(
                `For $${a} < y < ${b}$ the factors have opposite signs, so $\\frac{dy}{dt}$ is ${sign(between).en}.`,
                `当 $${a} < y < ${b}$ 时两个因子异号，所以 $\\frac{dy}{dt}$ ${sign(between)["zh-CN"]}。`,
              ),
            ),
            step(
              "Sign on the far side",
              "外侧的符号",
              t(
                `For ${atLower ? `$y < ${a}$` : `$y > ${b}$`} the factors have the same sign, so $\\frac{dy}{dt}$ is ${sign(!between).en}.`,
                `当 ${atLower ? `$y < ${a}$` : `$y > ${b}$`} 时两个因子同号，所以 $\\frac{dy}{dt}$ ${sign(!between)["zh-CN"]}。`,
              ),
            ),
            step(
              "Classify",
              "判断",
              t(
                `So solutions on both sides ${stable ? "move toward" : "move away from"} $y = ${c}$: it is ${stable ? "stable" : "unstable"}.`,
                `所以两侧的解都${stable ? "趋向" : "远离"} $y = ${c}$：它是${stable ? "稳定" : "不稳定"}的。`,
              ),
            ),
          ],
          t(
            `Derivative test: $f'(y) = ${poly([2 * k, "y"], [-k * (a + b), ""])}$, so $f'(${c}) = ${slope}$, which is ${slope < 0 ? "negative: stable" : "positive: unstable"}.`,
            `导数判别法：$f'(y) = ${poly([2 * k, "y"], [-k * (a + b), ""])}$，所以 $f'(${c}) = ${slope}$，${slope < 0 ? "为负：稳定" : "为正：不稳定"}。`,
          ),
        );
      },
    },
  ],
};

/** rates are growth constants k for exponential models. */
const rates = [
  Q.of(1, 2),
  Q.of(1, 3),
  Q.of(1, 4),
  Q.of(1, 10),
  Q.of(3, 100),
  Q.of(-1, 2),
  Q.of(-1, 5),
  Q.of(-1, 10),
  Q.of(2),
  Q.of(-3),
] as const;

/** exponentialGrowthAndDecayModelsWithFirstOrderOdes solves dy/dt = ky. */
export const exponentialGrowthAndDecayModelsWithFirstOrderOdes: TopicDef = {
  id: "exponential-growth-and-decay-models-with-first-order-odes",
  title: t("Exponential Growth and Decay Models With First-Order ODEs", "用一阶常微分方程建立指数增长与衰减模型"),
  summary: t(
    "The solution of $\\frac{dy}{dt} = ky$ with $y(0) = y_0$ is $y = y_0 e^{kt}$: growth when $k > 0$, decay when $k < 0$.",
    "$\\frac{dy}{dt} = ky$，$y(0) = y_0$ 的解为 $y = y_0 e^{kt}$：$k > 0$ 时增长，$k < 0$ 时衰减。",
  ),
  intro: t(
    "A quantity whose rate of change is proportional to itself satisfies $\\frac{dP}{dt} = kP$. With $k = 0.04$ and $P(0) = 500$, separating gives $P = Ce^{0.04t}$, and $P(0) = C = 500$:\n\n$$P(t) = 500e^{0.04t}.$$\n\nCheck: $P' = 0.04 \\cdot 500e^{0.04t} = 0.04P$, which is the equation, and $P(0) = 500e^{0} = 500$.\n\nIn this lesson we solve $\\frac{dy}{dt} = ky$ with a starting value and use a doubling or tripling time to find later values.",
    "变化率与自身成正比的量满足 $\\frac{dP}{dt} = kP$。若 $k = 0.04$，$P(0) = 500$，分离变量得 $P = Ce^{0.04t}$，而 $P(0) = C = 500$：\n\n$$P(t) = 500e^{0.04t}$$\n\n检验：$P' = 0.04 \\cdot 500e^{0.04t} = 0.04P$，正是原方程，且 $P(0) = 500e^{0} = 500$。\n\n本课我们解带初始值的 $\\frac{dy}{dt} = ky$，并用倍增或三倍时间求以后的值。",
  ),
  prerequisites: ["solving-first-order-ivps-using-separation-of-variables", "modeling-with-first-order-odes"],
  encompasses: [{ topic: "solving-first-order-ivps-using-separation-of-variables", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "solving-the-exponential-model",
      title: t("Solving dy/dt = ky", "解 dy/dt = ky"),
      explanation: t(
        "Separating $\\frac{dy}{dt} = ky$ gives $\\ln|y| = kt + C$, so $y = y_0e^{kt}$, where $y_0 = y(0)$. A quantity whose rate of change is proportional to itself grows exponentially when $k > 0$ and decays when $k < 0$. For $\\frac{dP}{dt} = 0.04P$ with $P(0) = 500$: $P(t) = 500e^{0.04t}$.\n\nCheck: $P = 500e^{0.04t}$ has $P' = 20e^{0.04t} = 0.04P$ and $P(0) = 500$.\n\n> **Watch out.** The starting value multiplies the exponential; it is not added to it.",
        "对 $\\frac{dy}{dt} = ky$ 分离变量得 $\\ln|y| = kt + C$，所以 $y = y_0e^{kt}$，其中 $y_0 = y(0)$。变化率与自身成正比的量，在 $k > 0$ 时指数增长，在 $k < 0$ 时指数衰减。对 $\\frac{dP}{dt} = 0.04P$，$P(0) = 500$：$P(t) = 500e^{0.04t}$。\n\n检验：$P = 500e^{0.04t}$ 满足 $P' = 20e^{0.04t} = 0.04P$，且 $P(0) = 500$。\n\n> **注意。** 初始值是乘在指数函数上的，不是加上去的。",
      ),
      generate(rng) {
        const k = rng.pick(rates);
        const P0 = rng.int(1, 40) * 25;
        const kt = poly([k, "t"]);
        const answer = `${P0}e^{${kt}}`;
        return exact(
          {
            prompt: t(
              `Solve $\\frac{dP}{dt} = ${poly([k, "P"])}$ with $P(0) = ${P0}$.`,
              `解 $\\frac{dP}{dt} = ${poly([k, "P"])}$，$P(0) = ${P0}$。`,
            ),
            answer,
            prefix: "P(t) =",
            variable: "t",
          },
          [
            step(
              "Separate and integrate",
              "分离变量并积分",
              t(`$\\int \\frac{dP}{P} = \\int ${k.toLatex()} \\, dt$ gives`, `由 $\\int \\frac{dP}{P} = \\int ${k.toLatex()} \\, dt$ 得`),
              `\\ln|P| = ${kt} + C_1`,
              `P = Ce^{${kt}}`,
            ),
            step(
              "Use the initial condition",
              "用初始条件",
              t("At $t = 0$, $e^{0} = 1$:", "在 $t = 0$ 处 $e^{0} = 1$："),
              `P(0) = C = ${P0}`,
              `P(t) = ${answer}`,
            ),
          ],
          t(
            `Substitute: $P' = ${neg(k)} \\cdot ${P0}e^{${kt}} = ${neg(k)}P$, which is the equation, and $P(0) = ${P0}e^{0} = ${P0}$.`,
            `代入：$P' = ${neg(k)} \\cdot ${P0}e^{${kt}} = ${neg(k)}P$，正是原方程，且 $P(0) = ${P0}e^{0} = ${P0}$。`,
          ),
          [
            say(
              `${P0}e^{${poly([k.neg(), "t"])}}`,
              `The sign of the exponent is flipped; this solves $\\frac{dP}{dt} = ${poly([k.neg(), "P"])}$.`,
              `指数的符号反了；它解的是 $\\frac{dP}{dt} = ${poly([k.neg(), "P"])}$。`,
            ),
            say(
              `e^{${kt}} + ${P0 - 1}`,
              `This has the right value at $0$, but its derivative is $${neg(k)}e^{${kt}}$, not $${neg(k)}P$: the starting value multiplies the exponential.`,
              `它在 $0$ 处的值是对的，但它的导数是 $${neg(k)}e^{${kt}}$，不是 $${neg(k)}P$：初始值应当乘在指数函数上。`,
            ),
            say(`${P0}e^{t}`, `This leaves out $k$: it solves $\\frac{dP}{dt} = P$.`, `这里漏掉了 $k$：它解的是 $\\frac{dP}{dt} = P$。`),
            say(
              poly([k.mul(Q.of(P0)), "t"], [P0, ""]),
              `This changes at the constant rate $${neg(k)} \\cdot ${P0}$; in the model the rate is proportional to the current $P$.`,
              `它以恒定速率 $${neg(k)} \\cdot ${P0}$ 变化；而模型中的速率与当前的 $P$ 成正比。`,
            ),
          ],
        );
      },
    },
    {
      id: "values-from-a-doubling-time",
      title: t("Values from a doubling or tripling time", "由倍增时间求值"),
      explanation: t(
        "If $y = y_0e^{kt}$ doubles every $d$ units of time, then $e^{kd} = 2$ and $y = y_0 \\cdot 2^{t/d}$. A culture of $300$ bacteria that doubles every $4$ hours has $300 \\cdot 2^{3} = 2400$ bacteria after $12$ hours.\n\nCheck: with $k = \\frac{\\ln 2}{4}$, $300e^{12k} = 300e^{3\\ln 2} = 300 \\cdot 8 = 2400$.\n\n> **Watch out.** Growth compounds: three doublings multiply by $2^{3} = 8$, not by $2 \\cdot 3 = 6$.",
        "若 $y = y_0e^{kt}$ 每隔 $d$ 个时间单位翻一倍，则 $e^{kd} = 2$，$y = y_0 \\cdot 2^{t/d}$。一个每 $4$ 小时翻倍、初始有 $300$ 个细菌的菌落，$12$ 小时后有 $300 \\cdot 2^{3} = 2400$ 个细菌。\n\n检验：取 $k = \\frac{\\ln 2}{4}$，$300e^{12k} = 300e^{3\\ln 2} = 300 \\cdot 8 = 2400$。\n\n> **注意。** 增长是复合的：翻三次倍是乘以 $2^{3} = 8$，而不是 $2 \\cdot 3 = 6$。",
      ),
      generate(rng) {
        const m = rng.pick([2, 3]);
        const d = rng.int(2, 12);
        const j = rng.int(2, 5);
        const P0 = rng.int(1, 20) * 50;
        const answer = P0 * m ** j;
        const word = m === 2 ? t("doubles", "翻一倍") : t("triples", "变为原来的三倍");
        return worked(
          t(
            `A culture grows according to $\\frac{dP}{dt} = kP$ and ${word.en} every $${d}$ hours. If $P(0) = ${P0}$, find $P(${j * d})$.`,
            `某菌落按 $\\frac{dP}{dt} = kP$ 增长，每 $${d}$ 小时${word["zh-CN"]}。若 $P(0) = ${P0}$，求 $P(${j * d})$。`,
          ),
          answer,
          [
            step(
              "Count the periods",
              "数周期",
              t(
                `$${j * d}$ hours is $\\frac{${j * d}}{${d}} = ${j}$ periods of $${d}$ hours.`,
                `$${j * d}$ 小时是 $\\frac{${j * d}}{${d}} = ${j}$ 个 $${d}$ 小时的周期。`,
              ),
            ),
            step(
              "Multiply once per period",
              "每个周期乘一次",
              t(`Each period multiplies the culture by $${m}$:`, `每个周期菌落乘以 $${m}$：`),
              `P(${j * d}) = ${P0} \\cdot ${m}^{${j}} = ${answer}`,
            ),
          ],
          t(
            `Use the rate: $e^{${d}k} = ${m}$, so $P(${j * d}) = ${P0}e^{${j * d}k} = ${P0}\\left(e^{${d}k}\\right)^{${j}} = ${P0} \\cdot ${m}^{${j}} = ${answer}$.`,
            `用增长率：$e^{${d}k} = ${m}$，所以 $P(${j * d}) = ${P0}e^{${j * d}k} = ${P0}\\left(e^{${d}k}\\right)^{${j}} = ${P0} \\cdot ${m}^{${j}} = ${answer}$。`,
          ),
          [
            slip(
              P0 * m * j,
              `Growth compounds: $${j}$ periods multiply by $${m}^{${j}}$, not by $${m} \\cdot ${j}$.`,
              `增长是复合的：$${j}$ 个周期是乘以 $${m}^{${j}}$，而不是 $${m} \\cdot ${j}$。`,
            ),
            slip(
              P0 * m ** (j - 1),
              `This is one period short: $${j * d}$ hours is $${j}$ periods, not $${j - 1}$.`,
              `少算了一个周期：$${j * d}$ 小时是 $${j}$ 个周期，不是 $${j - 1}$ 个。`,
            ),
            slip(
              P0 + m ** j,
              `The factor $${m}^{${j}}$ multiplies the starting value; it is not added.`,
              `因子 $${m}^{${j}}$ 是乘在初始值上的，不是加上去的。`,
            ),
          ],
        );
      },
    },
  ],
};

/** exponentialGrowthAndDecayModelsWithFirstOrderOdesCalculatingUnknownTimesAndInitialValues runs the model backwards. */
export const exponentialGrowthAndDecayModelsWithFirstOrderOdesCalculatingUnknownTimesAndInitialValues: TopicDef = {
  id: "exponential-growth-and-decay-models-with-first-order-odes-calculating-unknown-times-and-initial-values",
  title: t(
    "Exponential Growth and Decay Models With First-Order ODEs: Calculating Unknown Times and Initial Values",
    "用一阶常微分方程建立指数增长与衰减模型：求未知时间与初始值",
  ),
  summary: t(
    "Solve $y_0 \\cdot m^{t/d} = y$ for $t$ to find when a value is reached, or for $y_0$ to find the starting amount.",
    "解 $y_0 \\cdot m^{t/d} = y$ 中的 $t$ 求出何时达到某值，或解 $y_0$ 求出初始量。",
  ),
  intro: t(
    "An investment that doubles every $5$ years is worth $A = A_0 \\cdot 2^{t/5}$. Starting from $300$, when is it worth $2400$? Divide by the start:\n\n$$2^{t/5} = \\frac{2400}{300} = 8 = 2^{3}, \\qquad \\frac{t}{5} = 3, \\qquad t = 15 \\text{ years}.$$\n\nCheck: running forward, $300 \\cdot 2^{15/5} = 300 \\cdot 8 = 2400$.\n\nIn this lesson we run an exponential model backwards to find the time a value is reached or the value it started from.",
    "每 $5$ 年翻一倍的投资价值为 $A = A_0 \\cdot 2^{t/5}$。从 $300$ 开始，何时价值 $2400$？除以初始值：\n\n$$2^{t/5} = \\frac{2400}{300} = 8 = 2^{3}, \\qquad \\frac{t}{5} = 3, \\qquad t = 15 \\text{ 年}$$\n\n检验：正向计算，$300 \\cdot 2^{15/5} = 300 \\cdot 8 = 2400$。\n\n本课我们把指数模型倒过来用，求出达到某值的时间，或者最初的值。",
  ),
  prerequisites: ["exponential-growth-and-decay-models-with-first-order-odes"],
  encompasses: [{ topic: "exponential-growth-and-decay-models-with-first-order-odes", weight: 0.5 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "finding-an-unknown-time",
      title: t("Finding an unknown time", "求未知时间"),
      explanation: t(
        "Write the quantity as its starting value times a power with time in the exponent, set it equal to the target, and solve with logarithms. If $P$ doubles every $d$ years, then $P = P_0 \\cdot 2^{t/d}$. To reach $8P_0$ we need $2^{t/d} = 8 = 2^{3}$, so $t = 3d$. In general, solving $e^{kt} = m$ gives $t = \\frac{\\ln m}{k}$.\n\nCheck: with $d = 5$, $P_0 \\cdot 2^{15/5} = 8P_0$.\n\n> **Watch out.** The ratio $8$ is the growth factor, not the number of periods: the number of periods is the exponent $3$.",
        "把这个量写成初始值乘以一个以时间为指数的幂，令它等于目标值，再用对数求解。若 $P$ 每 $d$ 年翻一倍，则 $P = P_0 \\cdot 2^{t/d}$。要达到 $8P_0$，需要 $2^{t/d} = 8 = 2^{3}$，所以 $t = 3d$。一般地，解 $e^{kt} = m$ 得 $t = \\frac{\\ln m}{k}$。\n\n检验：取 $d = 5$，$P_0 \\cdot 2^{15/5} = 8P_0$。\n\n> **注意。** 比值 $8$ 是增长倍数，不是周期数：周期数是指数 $3$。",
      ),
      generate(rng) {
        const m = rng.pick([2, 3]);
        const d = rng.int(2, 15);
        const j = rng.int(2, 5);
        const P0 = rng.int(1, 20) * 100;
        const target = P0 * m ** j;
        const answer = j * d;
        const word = m === 2 ? t("doubles", "翻一倍") : t("triples", "变为原来的三倍");
        return worked(
          t(
            `An investment grows according to $\\frac{dA}{dt} = kA$ and ${word.en} every $${d}$ years. It starts at $${P0}$. After how many years is it worth $${target}$?`,
            `一笔投资按 $\\frac{dA}{dt} = kA$ 增长，每 $${d}$ 年${word["zh-CN"]}。初始为 $${P0}$。多少年后它价值 $${target}$？`,
          ),
          answer,
          [
            step(
              "Find the growth factor",
              "求增长倍数",
              t("Divide the target by the start:", "目标值除以初始值："),
              `\\frac{${target}}{${P0}} = ${m ** j} = ${m}^{${j}}`,
            ),
            step(
              "Turn periods into years",
              "把周期换成年",
              t(`That is $${j}$ periods of $${d}$ years:`, `这是 $${j}$ 个 $${d}$ 年的周期：`),
              `t = ${j} \\cdot ${d} = ${answer}`,
            ),
          ],
          t(
            `Run the model forward: $${P0} \\cdot ${m}^{${answer}/${d}} = ${P0} \\cdot ${m}^{${j}} = ${target}$.`,
            `正向计算：$${P0} \\cdot ${m}^{${answer}/${d}} = ${P0} \\cdot ${m}^{${j}} = ${target}$。`,
          ),
          [
            slip(
              m ** j * d,
              `$${m ** j}$ is the growth factor; the number of periods is its exponent, $${j}$.`,
              `$${m ** j}$ 是增长倍数；周期数是它的指数 $${j}$。`,
            ),
            slip(j, `$${j}$ is the number of periods; each lasts $${d}$ years.`, `$${j}$ 是周期数；每个周期 $${d}$ 年。`),
            slip(
              (j + 1) * d,
              `This is one period too many: $${P0} \\cdot ${m}^{${j}}$ is already $${target}$.`,
              `多算了一个周期：$${P0} \\cdot ${m}^{${j}}$ 已经等于 $${target}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "finding-an-initial-value",
      title: t("Finding an initial value", "求初始值"),
      explanation: t(
        "Run the model backwards. If a population that triples every $5$ years is $4050$ after $15$ years, then $P_0 \\cdot 3^{3} = 4050$, so $P_0 = \\frac{4050}{27} = 150$.\n\nCheck: running forward, $150 \\cdot 3^{3} = 150 \\cdot 27 = 4050$.\n\n> **Watch out.** Divide by the growth factor $3^{3}$, not by the number of years or of periods.",
        "把模型倒过来用。若一个每 $5$ 年变为三倍的种群在 $15$ 年后为 $4050$，则 $P_0 \\cdot 3^{3} = 4050$，所以 $P_0 = \\frac{4050}{27} = 150$。\n\n检验：正向计算，$150 \\cdot 3^{3} = 150 \\cdot 27 = 4050$。\n\n> **注意。** 要除以增长倍数 $3^{3}$，而不是年数或周期数。",
      ),
      generate(rng) {
        const m = rng.pick([2, 3]);
        const d = rng.int(2, 12);
        const j = rng.int(1, 4);
        const P0 = rng.int(1, 30) * 10;
        const later = P0 * m ** j;
        const word = m === 2 ? t("doubles", "翻一倍") : t("triples", "变为原来的三倍");
        return worked(
          t(
            `A population grows according to $\\frac{dP}{dt} = kP$ and ${word.en} every $${d}$ years. After $${j * d}$ years it is $${later}$. What was its initial size?`,
            `某种群按 $\\frac{dP}{dt} = kP$ 增长，每 $${d}$ 年${word["zh-CN"]}。$${j * d}$ 年后为 $${later}$。初始数量是多少？`,
          ),
          P0,
          [
            step(
              "Count the periods",
              "数周期",
              t(
                `$${j * d}$ years is $${j}$ period${j === 1 ? "" : "s"} of $${d}$ years, so`,
                `$${j * d}$ 年是 $${j}$ 个 $${d}$ 年的周期，所以`,
              ),
              `P_0 \\cdot ${m}^{${j}} = ${later}`,
            ),
            step("Divide by the growth factor", "除以增长倍数", t("", ""), `P_0 = \\frac{${later}}{${m ** j}} = ${P0}`),
          ],
          t(
            `Run the model forward: $${P0} \\cdot ${m}^{${j}} = ${P0} \\cdot ${m ** j} = ${later}$, the size after $${j * d}$ years.`,
            `正向计算：$${P0} \\cdot ${m}^{${j}} = ${P0} \\cdot ${m ** j} = ${later}$，正是 $${j * d}$ 年后的数量。`,
          ),
          [
            slip(
              later * m ** j,
              "This runs the model forward from the later size; the starting size is smaller, so divide.",
              "这是从后来的数量继续往前推；初始数量更小，应当做除法。",
            ),
            slip(
              Q.of(later, m * j),
              `Divide by the growth factor $${m}^{${j}}$, not by $${m} \\cdot ${j}$.`,
              `要除以增长倍数 $${m}^{${j}}$，而不是 $${m} \\cdot ${j}$。`,
            ),
            slip(Q.of(later, j * d), "Divide by the growth factor, not by the number of years.", "要除以增长倍数，而不是年数。"),
            slip(
              Q.of(later, m),
              `This divides by $${m}$ only once; there are $${j}$ periods.`,
              `这只除了一次 $${m}$；一共有 $${j}$ 个周期。`,
            ),
          ],
        );
      },
    },
  ],
};

/** exponentialGrowthAndDecayModelsWithFirstOrderOdesHalfLifeProblems uses half-lives for decay. */
export const exponentialGrowthAndDecayModelsWithFirstOrderOdesHalfLifeProblems: TopicDef = {
  id: "exponential-growth-and-decay-models-with-first-order-odes-half-life-problems",
  title: t(
    "Exponential Growth and Decay Models With First-Order ODEs: Half-Life Problems",
    "用一阶常微分方程建立指数增长与衰减模型：半衰期问题",
  ),
  summary: t(
    "A substance with $\\frac{dA}{dt} = kA$ ($k < 0$) halves every $h = \\frac{\\ln 2}{|k|}$, so $A = A_0 \\left(\\frac{1}{2}\\right)^{t/h}$.",
    "满足 $\\frac{dA}{dt} = kA$（$k < 0$）的物质每经过 $h = \\frac{\\ln 2}{|k|}$ 减半，所以 $A = A_0 \\left(\\frac{1}{2}\\right)^{t/h}$。",
  ),
  intro: t(
    "A dose of $80$ mg of a drug decays according to $\\frac{dA}{dt} = kA$ with a half-life of $6$ hours. After $18$ hours, that is $3$ half-lives,\n\n$$A = 80\\left(\\frac{1}{2}\\right)^{18/6} = 80 \\cdot \\frac{1}{8} = 10 \\text{ mg}.$$\n\nCheck: doubling back three times, $10 \\to 20 \\to 40 \\to 80$.\n\nIn this lesson we use half-lives to find the amount left after a time and the time needed to decay to an amount.",
    "$80$ 毫克的药物按 $\\frac{dA}{dt} = kA$ 衰减，半衰期为 $6$ 小时。$18$ 小时即 $3$ 个半衰期之后，\n\n$$A = 80\\left(\\frac{1}{2}\\right)^{18/6} = 80 \\cdot \\frac{1}{8} = 10 \\text{ 毫克}$$\n\n检验：倒着翻三次倍，$10 \\to 20 \\to 40 \\to 80$。\n\n本课我们用半衰期求经过一段时间后的剩余量，以及衰减到某个量所需的时间。",
  ),
  prerequisites: ["exponential-growth-and-decay-models-with-first-order-odes-calculating-unknown-times-and-initial-values"],
  encompasses: [
    {
      topic: "exponential-growth-and-decay-models-with-first-order-odes-calculating-unknown-times-and-initial-values",
      weight: 0.4,
    },
  ],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "amount-remaining-after-half-lives",
      title: t("The amount remaining", "剩余的量"),
      explanation: t(
        "The **half-life** $h$ is the time for a decaying quantity to halve: $e^{kh} = \\frac{1}{2}$, so $h = \\frac{\\ln 2}{|k|}$ and $A = A_0\\left(\\frac{1}{2}\\right)^{t/h}$. With $A_0 = 80$ mg and $h = 6$ hours, after $18$ hours $A = 80 \\cdot \\frac{1}{8} = 10$ mg.\n\nCheck: doubling back three times, $10 \\to 20 \\to 40 \\to 80$.\n\n> **Watch out.** Halving compounds: after $3$ half-lives the amount is $\\frac{1}{8}$ of the start, not $\\frac{1}{6}$.",
        "**半衰期** $h$ 是衰减量减半所需的时间：$e^{kh} = \\frac{1}{2}$，所以 $h = \\frac{\\ln 2}{|k|}$，$A = A_0\\left(\\frac{1}{2}\\right)^{t/h}$。当 $A_0 = 80$ 毫克、$h = 6$ 小时时，$18$ 小时后 $A = 80 \\cdot \\frac{1}{8} = 10$ 毫克。\n\n检验：倒着翻三次倍，$10 \\to 20 \\to 40 \\to 80$。\n\n> **注意。** 减半是复合的：$3$ 个半衰期后剩下初始量的 $\\frac{1}{8}$，而不是 $\\frac{1}{6}$。",
      ),
      generate(rng) {
        const h = rng.int(2, 30);
        const j = rng.int(1, 5);
        const A0 = rng.int(1, 20) * 2 ** j * 5;
        const answer = A0 / 2 ** j;
        return worked(
          t(
            `A radioactive sample of $${A0}$ g decays according to $\\frac{dA}{dt} = kA$ and has a half-life of $${h}$ days. How many grams remain after $${j * h}$ days?`,
            `一份 $${A0}$ 克的放射性样品按 $\\frac{dA}{dt} = kA$ 衰变，半衰期为 $${h}$ 天。$${j * h}$ 天后剩余多少克？`,
          ),
          answer,
          [
            step(
              "Count the half-lives",
              "数半衰期",
              t(
                `$${j * h}$ days is $\\frac{${j * h}}{${h}} = ${j}$ half-li${j === 1 ? "fe" : "ves"}.`,
                `$${j * h}$ 天是 $\\frac{${j * h}}{${h}} = ${j}$ 个半衰期。`,
              ),
            ),
            step(
              "Halve once per half-life",
              "每个半衰期减半一次",
              t("", ""),
              `A = ${A0}\\left(\\frac{1}{2}\\right)^{${j}} = \\frac{${A0}}{${2 ** j}} = ${answer}`,
            ),
          ],
          t(
            `Double back $${j}$ time${j === 1 ? "" : "s"}: $${answer} \\cdot 2^{${j}} = ${A0}$, the starting amount.`,
            `倒着翻 $${j}$ 次倍：$${answer} \\cdot 2^{${j}} = ${A0}$，正是初始量。`,
          ),
          [
            slip(
              A0 - answer,
              "This is the amount that has decayed; the question asks what remains.",
              "这是已经衰变掉的量；题目问的是剩余的量。",
            ),
            slip(
              Q.of(A0, 2 * j),
              `Halving compounds: $${j}$ half-lives divide by $2^{${j}}$, not by $2 \\cdot ${j}$.`,
              `减半是复合的：$${j}$ 个半衰期是除以 $2^{${j}}$，而不是 $2 \\cdot ${j}$。`,
            ),
            slip(
              answer * 2,
              `This is one half-life short: $${j * h}$ days is $${j}$ half-lives.`,
              `少算了一个半衰期：$${j * h}$ 天是 $${j}$ 个半衰期。`,
            ),
            slip(A0 / 2, `This halves only once; there are $${j}$ half-lives.`, `这只减半了一次；一共有 $${j}$ 个半衰期。`),
          ],
        );
      },
    },
    {
      id: "time-to-decay",
      title: t("Time to decay", "衰减所需的时间"),
      explanation: t(
        "Count half-lives. A drug with a half-life of $4$ hours falls to $12.5\\% = \\frac{1}{8}$ of its dose after $3$ half-lives, that is $12$ hours.\n\nCheck: from a dose $D$, $D\\left(\\frac{1}{2}\\right)^{12/4} = \\frac{D}{8}$.\n\n> **Watch out.** The number of half-lives is the exponent $3$, not the ratio $8$.",
        "数半衰期的个数。半衰期为 $4$ 小时的药物，降到剂量的 $12.5\\% = \\frac{1}{8}$ 需要 $3$ 个半衰期，即 $12$ 小时。\n\n检验：从剂量 $D$ 出发，$D\\left(\\frac{1}{2}\\right)^{12/4} = \\frac{D}{8}$。\n\n> **注意。** 半衰期的个数是指数 $3$，而不是比值 $8$。",
      ),
      generate(rng) {
        const h = rng.int(2, 30);
        const j = rng.int(1, 5);
        const A0 = rng.int(1, 20) * 2 ** j * 5;
        const end = A0 / 2 ** j;
        return worked(
          t(
            `A substance decays according to $\\frac{dA}{dt} = kA$ with a half-life of $${h}$ years. How long does it take $${A0}$ g to decay to $${end}$ g?`,
            `某物质按 $\\frac{dA}{dt} = kA$ 衰变，半衰期为 $${h}$ 年。$${A0}$ 克衰变到 $${end}$ 克需要多少年？`,
          ),
          j * h,
          [
            step(
              "Find the fraction left",
              "求剩余的比例",
              t("", ""),
              `\\frac{${end}}{${A0}} = \\frac{1}{${2 ** j}} = \\left(\\frac{1}{2}\\right)^{${j}}`,
            ),
            step(
              "Turn half-lives into years",
              "把半衰期换成年",
              t(`That is $${j}$ half-li${j === 1 ? "fe" : "ves"} of $${h}$ years:`, `这是 $${j}$ 个 $${h}$ 年的半衰期：`),
              `t = ${j} \\cdot ${h} = ${j * h}`,
            ),
          ],
          t(
            `Run the decay forward: $${A0}\\left(\\frac{1}{2}\\right)^{${j * h}/${h}} = \\frac{${A0}}{${2 ** j}} = ${end}$.`,
            `正向计算衰变：$${A0}\\left(\\frac{1}{2}\\right)^{${j * h}/${h}} = \\frac{${A0}}{${2 ** j}} = ${end}$。`,
          ),
          [
            slip(
              h * 2 ** j,
              `$${2 ** j}$ is the ratio of the amounts; the number of half-lives is its exponent, $${j}$.`,
              `$${2 ** j}$ 是两个量的比值；半衰期的个数是它的指数 $${j}$。`,
            ),
            slip(j, `$${j}$ is the number of half-lives; each lasts $${h}$ years.`, `$${j}$ 是半衰期的个数；每个半衰期 $${h}$ 年。`),
            slip(
              (j + 1) * h,
              `This is one half-life too many: after $${j}$ half-lives $${end}$ g is left.`,
              `多算了一个半衰期：$${j}$ 个半衰期后就只剩 $${end}$ 克。`,
            ),
          ],
        );
      },
    },
  ],
};

/** Logistic is dP/dt = kP(1 − P/K), written as k and K. */
interface Logistic {
  readonly k: Q;
  readonly K: number;
  readonly tex: string;
  readonly standard: boolean;
}

/** logistic picks a logistic equation, written either in standard form or as aP − bP². */
function logistic(rng: Rng): Logistic {
  const k = Q.of(1, rng.pick([2, 4, 5, 10, 20, 50]));
  const K = rng.int(2, 40) * 50;
  const standard = rng.bool();
  const tex = standard ? `${k.toLatex()}P\\left(1 - \\frac{P}{${K}}\\right)` : poly([k, "P"], [k.div(Q.of(K)).neg(), "P^{2}"]);
  return { k, K, tex, standard };
}

/** standardForm writes kP(1 − P/K). */
const standardForm = (L: Logistic) => `${L.k.toLatex()}P\\left(1 - \\frac{P}{${L.K}}\\right)`;

/** rateAt is the logistic rate at a population. */
const rateAt = (L: Logistic, P: number) => L.k.mul(Q.of(P)).mul(Q.one.sub(Q.of(P, L.K)));

/** logisticGrowthModelsWithFirstOrderOdes introduces the carrying capacity. */
export const logisticGrowthModelsWithFirstOrderOdes: TopicDef = {
  id: "logistic-growth-models-with-first-order-odes",
  title: t("Logistic Growth Models With First-Order ODEs", "用一阶常微分方程建立逻辑斯谛增长模型"),
  summary: t(
    "dP/dt = kP(1 − P/K) models growth that slows as P approaches the carrying capacity K.",
    "dP/dt = kP(1 − P/K) 描述的增长在 P 接近环境容纳量 K 时放缓。",
  ),
  intro: t(
    "Real populations cannot grow exponentially for ever. The logistic model\n\n$$\\frac{dP}{dt} = 0.5P\\left(1 - \\frac{P}{400}\\right)$$\n\ngrows like $0.5P$ when $P$ is small, but the factor $1 - \\frac{P}{400}$ slows it as $P$ nears $400$, the carrying capacity. At $P = 100$ the rate is $0.5 \\cdot 100 \\cdot \\frac{3}{4} = 37.5$.\n\nCheck: at $P = 400$ the rate is $0.5 \\cdot 400 \\cdot 0 = 0$, so the population stops growing there.\n\nIn this lesson we read the carrying capacity from a logistic equation and find growth rates from it.",
    "真实的种群不可能永远指数增长。逻辑斯谛模型\n\n$$\\frac{dP}{dt} = 0.5P\\left(1 - \\frac{P}{400}\\right)$$\n\n在 $P$ 较小时像 $0.5P$ 一样增长，但因子 $1 - \\frac{P}{400}$ 使它在 $P$ 接近环境容纳量 $400$ 时放缓。在 $P = 100$ 时速率为 $0.5 \\cdot 100 \\cdot \\frac{3}{4} = 37.5$。\n\n检验：在 $P = 400$ 时速率为 $0.5 \\cdot 400 \\cdot 0 = 0$，所以种群在那里停止增长。\n\n本课我们从逻辑斯谛方程读出环境容纳量，并由它求增长速率。",
  ),
  prerequisites: ["exponential-growth-and-decay-models-with-first-order-odes", "equilibrium-solutions-of-first-order-odes"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "carrying-capacity",
      title: t("The carrying capacity", "环境容纳量"),
      explanation: t(
        "The **logistic equation** $\\frac{dP}{dt} = kP\\left(1 - \\frac{P}{K}\\right)$ behaves like $kP$ when $P$ is small, but the factor $1 - \\frac{P}{K}$ slows growth as $P$ nears $K$, the **carrying capacity**. Written as $\\frac{dP}{dt} = aP - bP^{2} = aP\\left(1 - \\frac{b}{a}P\\right)$, the carrying capacity is $K = \\frac{a}{b}$: for $\\frac{dP}{dt} = 0.2P - 0.001P^{2}$, $K = 200$.\n\nCheck: at $P = 200$, $0.2 \\cdot 200 - 0.001 \\cdot 200^{2} = 40 - 40 = 0$, so growth stops there.\n\n> **Watch out.** The carrying capacity is $\\frac{a}{b}$, not the rate $a$ and not the coefficient $b$.",
        "**逻辑斯谛方程** $\\frac{dP}{dt} = kP\\left(1 - \\frac{P}{K}\\right)$ 在 $P$ 较小时近似于 $kP$，但因子 $1 - \\frac{P}{K}$ 使增长在 $P$ 接近 $K$ 时放缓，$K$ 叫做**环境容纳量**。若写成 $\\frac{dP}{dt} = aP - bP^{2} = aP\\left(1 - \\frac{b}{a}P\\right)$，则环境容纳量为 $K = \\frac{a}{b}$：对 $\\frac{dP}{dt} = 0.2P - 0.001P^{2}$，$K = 200$。\n\n检验：在 $P = 200$ 时，$0.2 \\cdot 200 - 0.001 \\cdot 200^{2} = 40 - 40 = 0$，所以增长在那里停止。\n\n> **注意。** 环境容纳量是 $\\frac{a}{b}$，既不是增长率 $a$，也不是系数 $b$。",
      ),
      generate(rng) {
        const L = logistic(rng);
        const b = L.k.div(Q.of(L.K));
        return worked(
          t(
            `A population satisfies $\\frac{dP}{dt} = ${L.tex}$. Find its carrying capacity.`,
            `某种群满足 $\\frac{dP}{dt} = ${L.tex}$。求它的环境容纳量。`,
          ),
          L.K,
          [
            L.standard
              ? step(
                  "Compare with the standard form",
                  "与标准形式比较",
                  t(
                    `The equation already has the form $kP\\left(1 - \\frac{P}{K}\\right)$, with $k = ${L.k.toLatex()}$.`,
                    `方程已经是 $kP\\left(1 - \\frac{P}{K}\\right)$ 的形式，其中 $k = ${L.k.toLatex()}$。`,
                  ),
                )
              : step(
                  "Factor out the linear term",
                  "提出一次项",
                  t(
                    `Take out $${L.k.toLatex()}P$; the ratio of the coefficients is $${b.toLatex()} \\div ${L.k.toLatex()} = \\frac{1}{${L.K}}$:`,
                    `提出 $${L.k.toLatex()}P$；系数之比为 $${b.toLatex()} \\div ${L.k.toLatex()} = \\frac{1}{${L.K}}$：`,
                  ),
                  `${L.tex} = ${standardForm(L)}`,
                ),
            step(
              "Read the carrying capacity",
              "读出环境容纳量",
              t(
                `Growth stops when $1 - \\frac{P}{K} = 0$, so the carrying capacity is $K = ${L.K}$.`,
                `当 $1 - \\frac{P}{K} = 0$ 时增长停止，所以环境容纳量为 $K = ${L.K}$。`,
              ),
            ),
          ],
          L.standard
            ? t(
                `Substitute $P = ${L.K}$: $${L.k.toLatex()} \\cdot ${L.K}\\left(1 - \\frac{${L.K}}{${L.K}}\\right) = 0$, so the population stops growing at $${L.K}$.`,
                `代入 $P = ${L.K}$：$${L.k.toLatex()} \\cdot ${L.K}\\left(1 - \\frac{${L.K}}{${L.K}}\\right) = 0$，所以种群在 $${L.K}$ 处停止增长。`,
              )
            : t(
                `Substitute $P = ${L.K}$: $${L.k.toLatex()} \\cdot ${L.K} - ${b.toLatex()} \\cdot ${L.K}^{2} = ${L.k.mul(Q.of(L.K)).toLatex()} - ${L.k.mul(Q.of(L.K)).toLatex()} = 0$, so the population stops growing at $${L.K}$.`,
                `代入 $P = ${L.K}$：$${L.k.toLatex()} \\cdot ${L.K} - ${b.toLatex()} \\cdot ${L.K}^{2} = ${L.k.mul(Q.of(L.K)).toLatex()} - ${L.k.mul(Q.of(L.K)).toLatex()} = 0$，所以种群在 $${L.K}$ 处停止增长。`,
              ),
          [
            slip(
              L.k,
              `$${L.k.toLatex()}$ is the growth rate $k$, not the carrying capacity.`,
              `$${L.k.toLatex()}$ 是增长率 $k$，不是环境容纳量。`,
            ),
            slip(L.K / 2, "This is half the carrying capacity, where growth is fastest.", "这是环境容纳量的一半，即增长最快的位置。"),
            slip(
              Q.one.div(L.k),
              `This is $\\frac{1}{k}$; the carrying capacity is where the factor $1 - \\frac{P}{K}$ is $0$.`,
              `这是 $\\frac{1}{k}$；环境容纳量是因子 $1 - \\frac{P}{K}$ 为 $0$ 的位置。`,
            ),
            ...(L.standard
              ? []
              : [
                  slip(
                    b,
                    `This is the coefficient of $P^{2}$; the carrying capacity is the coefficient of $P$ divided by it: $${L.k.toLatex()} \\div ${b.toLatex()} = ${L.K}$.`,
                    `这是 $P^{2}$ 的系数；环境容纳量是 $P$ 的系数除以它：$${L.k.toLatex()} \\div ${b.toLatex()} = ${L.K}$。`,
                  ),
                ]),
          ],
        );
      },
    },
    {
      id: "logistic-growth-rates",
      title: t("Growth rates in a logistic model", "逻辑斯谛模型中的增长速率"),
      explanation: t(
        "In a logistic model the growth rate is proportional to both the population and the room left before the carrying capacity, so substitute the current population. For $\\frac{dP}{dt} = 0.1P\\left(1 - \\frac{P}{500}\\right)$ at $P = 100$: $0.1 \\cdot 100 \\cdot \\frac{4}{5} = 8$ individuals per unit of time.\n\nCheck: in the expanded form, $0.1 \\cdot 100 - \\frac{0.1}{500} \\cdot 100^{2} = 10 - 2 = 8$.\n\n> **Watch out.** The factor is $1 - \\frac{P}{K}$, the room left, not $\\frac{P}{K}$.",
        "在逻辑斯谛模型中，增长率既与种群数量成正比，也与距离环境容量的余量成正比，所以代入当前的种群数量。对 $\\frac{dP}{dt} = 0.1P\\left(1 - \\frac{P}{500}\\right)$，在 $P = 100$ 时：$0.1 \\cdot 100 \\cdot \\frac{4}{5} = 8$，即每单位时间增加 $8$ 个个体。\n\n检验：用展开式，$0.1 \\cdot 100 - \\frac{0.1}{500} \\cdot 100^{2} = 10 - 2 = 8$。\n\n> **注意。** 因子是 $1 - \\frac{P}{K}$，即剩余的空间，而不是 $\\frac{P}{K}$。",
      ),
      generate(rng) {
        const L = logistic(rng);
        const P = (L.K / 50) * rng.int(1, 9) * 5;
        const answer = rateAt(L, P);
        const kP = L.k.mul(Q.of(P));
        const room = Q.one.sub(Q.of(P, L.K));
        const loss = L.k.div(Q.of(L.K)).mul(Q.of(P * P));
        return worked(
          t(
            `A population satisfies $\\frac{dP}{dt} = ${L.tex}$. Find $\\frac{dP}{dt}$ when $P = ${P}$.`,
            `某种群满足 $\\frac{dP}{dt} = ${L.tex}$。求 $P = ${P}$ 时的 $\\frac{dP}{dt}$。`,
          ),
          answer,
          [
            step(
              "Substitute the population",
              "代入种群数量",
              L.standard
                ? t(`Put $P = ${P}$:`, `代入 $P = ${P}$：`)
                : t(
                    `In standard form the equation is $\\frac{dP}{dt} = ${standardForm(L)}$; put $P = ${P}$:`,
                    `写成标准形式为 $\\frac{dP}{dt} = ${standardForm(L)}$；代入 $P = ${P}$：`,
                  ),
              `\\frac{dP}{dt} = ${L.k.toLatex()} \\cdot ${P} \\cdot \\left(1 - \\frac{${P}}{${L.K}}\\right)`,
            ),
            step("Multiply", "相乘", t("", ""), `= ${kP.toLatex()} \\cdot ${room.toLatex()} = ${answer.toLatex()}`),
          ],
          t(
            `Use the expanded form: $${L.k.toLatex()} \\cdot ${P} - \\frac{${L.k.toLatex()}}{${L.K}} \\cdot ${P}^{2} = ${kP.toLatex()} - ${loss.toLatex()} = ${answer.toLatex()}$.`,
            `用展开式：$${L.k.toLatex()} \\cdot ${P} - \\frac{${L.k.toLatex()}}{${L.K}} \\cdot ${P}^{2} = ${kP.toLatex()} - ${loss.toLatex()} = ${answer.toLatex()}$。`,
          ),
          [
            slip(
              kP,
              `This leaves out the factor $1 - \\frac{P}{${L.K}}$, which slows the growth.`,
              `这里漏掉了使增长放缓的因子 $1 - \\frac{P}{${L.K}}$。`,
            ),
            slip(
              kP.mul(Q.of(P, L.K)),
              `This uses $\\frac{P}{${L.K}}$; the factor is the room left, $1 - \\frac{P}{${L.K}}$.`,
              `这里用了 $\\frac{P}{${L.K}}$；因子应是剩余的空间 $1 - \\frac{P}{${L.K}}$。`,
            ),
            slip(
              answer.neg(),
              `The sign is flipped: $P$ is below $${L.K}$, so the population is growing.`,
              `符号反了：$P$ 低于 $${L.K}$，种群在增长。`,
            ),
          ],
        );
      },
    },
  ],
};

/** trends are what a logistic population does over time. */
const trends = [
  t("It increases and approaches the carrying capacity", "递增并趋于环境容纳量"),
  t("It decreases and approaches the carrying capacity", "递减并趋于环境容纳量"),
  t("It stays constant", "保持不变"),
  t("It increases without bound", "无限递增"),
] as const;

/** qualitativeAnalysisOfTheLogisticGrowthEquation describes logistic solutions without solving. */
export const qualitativeAnalysisOfTheLogisticGrowthEquation: TopicDef = {
  id: "qualitative-analysis-of-the-logistic-growth-equation",
  title: t("Qualitative Analysis of the Logistic Growth Equation", "逻辑斯谛增长方程的定性分析"),
  summary: t(
    "Positive solutions tend to K; they grow fastest at P = K/2, where the graph has an inflection point.",
    "正的解都趋于 K；在 P = K/2 处增长最快，图像在此处有拐点。",
  ),
  intro: t(
    "For $\\frac{dP}{dt} = 0.2P\\left(1 - \\frac{P}{500}\\right)$ with $P(0) = 100$, the rate is positive while $0 < P < 500$, so the population rises toward the carrying capacity $500$. The rate is a downward parabola in $P$ with zeros at $0$ and $500$, so growth is fastest at $P = 250$:\n\n$$\\frac{dP}{dt}\\Big|_{P = 250} = 0.2 \\cdot 250 \\cdot \\frac{1}{2} = 25.$$\n\nCheck: at the start the rate is only $0.2 \\cdot 100 \\cdot \\frac{4}{5} = 16 < 25$.\n\nIn this lesson we describe what logistic solutions do in the long run and find where they grow fastest, without solving the equation.",
    "对 $\\frac{dP}{dt} = 0.2P\\left(1 - \\frac{P}{500}\\right)$，$P(0) = 100$，当 $0 < P < 500$ 时速率为正，所以种群上升并趋于环境容纳量 $500$。速率是关于 $P$ 的开口向下的抛物线，零点为 $0$ 和 $500$，所以在 $P = 250$ 处增长最快：\n\n$$\\frac{dP}{dt}\\Big|_{P = 250} = 0.2 \\cdot 250 \\cdot \\frac{1}{2} = 25$$\n\n检验：开始时速率只有 $0.2 \\cdot 100 \\cdot \\frac{4}{5} = 16 < 25$。\n\n本课我们不解方程，就描述逻辑斯谛解的长期性态，并找出它增长最快的位置。",
  ),
  prerequisites: ["logistic-growth-models-with-first-order-odes"],
  encompasses: [{ topic: "logistic-growth-models-with-first-order-odes", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "long-run-behavior-of-logistic-solutions",
      title: t("Long-run behavior", "长期性态"),
      explanation: t(
        "The equilibria are $P = 0$ (unstable) and $P = K$ (stable). If $0 < P(0) < K$, then $\\frac{dP}{dt} > 0$ and $P$ rises toward $K$; if $P(0) > K$, then $\\frac{dP}{dt} < 0$ and $P$ falls toward $K$; if $P(0) = K$, $P$ stays at $K$.\n\nCheck: with $K = 500$ and $P(0) = 600$, $\\frac{dP}{dt} = kP\\left(1 - \\frac{600}{500}\\right) < 0$, so $P$ starts falling.\n\n> **Watch out.** A positive logistic population never grows without bound: the factor $1 - \\frac{P}{K}$ brings it to $K$.",
        "平衡解为 $P = 0$（不稳定）和 $P = K$（稳定）。若 $0 < P(0) < K$，则 $\\frac{dP}{dt} > 0$，$P$ 上升趋于 $K$；若 $P(0) > K$，则 $\\frac{dP}{dt} < 0$，$P$ 下降趋于 $K$；若 $P(0) = K$，$P$ 保持为 $K$。\n\n检验：当 $K = 500$，$P(0) = 600$ 时，$\\frac{dP}{dt} = kP\\left(1 - \\frac{600}{500}\\right) < 0$，所以 $P$ 开始下降。\n\n> **注意。** 正的逻辑斯谛种群不会无限增长：因子 $1 - \\frac{P}{K}$ 使它趋于 $K$。",
      ),
      generate(rng) {
        const L = logistic(rng);
        const kind = rng.int(0, 4);
        const P0 = kind === 4 ? L.K : kind < 2 ? (L.K / 50) * rng.int(1, 9) * 5 : L.K + rng.int(1, 10) * 50;
        const right = P0 < L.K ? 0 : P0 > L.K ? 1 : 2;
        const rate = rateAt(L, P0);
        const atK = t(
          `$P(0) = ${L.K}$ makes $\\frac{dP}{dt} = 0$, so $P$ does not move.`,
          `$P(0) = ${L.K}$ 使 $\\frac{dP}{dt} = 0$，所以 $P$ 不动。`,
        );
        const reasons: Option[] = [
          right === 1
            ? because(
                trends[0],
                `$${P0}$ is above $${L.K}$, so $\\frac{dP}{dt} < 0$ and $P$ decreases.`,
                `$${P0}$ 高于 $${L.K}$，所以 $\\frac{dP}{dt} < 0$，$P$ 递减。`,
              )
            : { option: trends[0], why: atK },
          right === 0
            ? because(
                trends[1],
                `$${P0}$ is below $${L.K}$, so $\\frac{dP}{dt} > 0$ and $P$ increases.`,
                `$${P0}$ 低于 $${L.K}$，所以 $\\frac{dP}{dt} > 0$，$P$ 递增。`,
              )
            : { option: trends[1], why: atK },
          because(
            trends[2],
            `Only $P(0) = 0$ or $P(0) = ${L.K}$ stays constant; here $\\frac{dP}{dt} = ${rate.toLatex()}$ at the start.`,
            `只有 $P(0) = 0$ 或 $P(0) = ${L.K}$ 才保持不变；这里开始时 $\\frac{dP}{dt} = ${rate.toLatex()}$。`,
          ),
          because(
            trends[3],
            `The factor $1 - \\frac{P}{${L.K}}$ shrinks to $0$ as $P$ nears $${L.K}$, so the growth stops there.`,
            `当 $P$ 接近 $${L.K}$ 时因子 $1 - \\frac{P}{${L.K}}$ 缩小到 $0$，所以增长在那里停止。`,
          ),
        ];
        const compare = [
          t(
            `Since $0 < ${P0} < ${L.K}$, $\\frac{dP}{dt} > 0$: $P$ rises toward $${L.K}$.`,
            `由于 $0 < ${P0} < ${L.K}$，$\\frac{dP}{dt} > 0$：$P$ 上升趋于 $${L.K}$。`,
          ),
          t(
            `Since $${P0} > ${L.K}$, $\\frac{dP}{dt} < 0$: $P$ falls toward $${L.K}$.`,
            `由于 $${P0} > ${L.K}$，$\\frac{dP}{dt} < 0$：$P$ 下降趋于 $${L.K}$。`,
          ),
          t(`$P(0) = ${L.K}$ is an equilibrium, so $P$ stays constant.`, `$P(0) = ${L.K}$ 是平衡解，所以 $P$ 保持不变。`),
        ][right]!;
        return choose(
          rng,
          t(
            `A population satisfies $\\frac{dP}{dt} = ${L.tex}$ with $P(0) = ${P0}$. How does $P$ behave as $t$ increases?`,
            `某种群满足 $\\frac{dP}{dt} = ${L.tex}$，$P(0) = ${P0}$。随着 $t$ 增大，$P$ 如何变化？`,
          ),
          trends[right],
          reasons.filter((_, i) => i !== right),
          [
            step(
              "Find the carrying capacity",
              "求环境容纳量",
              t(
                `In standard form the equation is $${standardForm(L)}$, so $K = ${L.K}$; the equilibria are $P = 0$ and $P = ${L.K}$.`,
                `写成标准形式为 $${standardForm(L)}$，所以 $K = ${L.K}$；平衡解为 $P = 0$ 和 $P = ${L.K}$。`,
              ),
            ),
            step("Compare the start with K", "比较初始值与 K", compare),
          ],
          t(
            `Substitute the start: $\\frac{dP}{dt} = ${L.k.toLatex()} \\cdot ${P0} \\cdot \\left(1 - \\frac{${P0}}{${L.K}}\\right) = ${rate.toLatex()}$, which is ${rate.sign() > 0 ? "positive" : rate.sign() < 0 ? "negative" : "zero"}.`,
            `代入初始值：$\\frac{dP}{dt} = ${L.k.toLatex()} \\cdot ${P0} \\cdot \\left(1 - \\frac{${P0}}{${L.K}}\\right) = ${rate.toLatex()}$，${rate.sign() > 0 ? "为正" : rate.sign() < 0 ? "为负" : "为零"}。`,
          ),
        );
      },
    },
    {
      id: "fastest-logistic-growth",
      figure: calculusDrawings5["qualitative-analysis-of-the-logistic-growth-equation#fastest-logistic-growth"],
      title: t("Where growth is fastest", "增长最快的位置"),
      explanation: t(
        "$\\frac{dP}{dt} = kP - \\frac{k}{K}P^{2}$ is a downward parabola in $P$ with zeros at $0$ and $K$, so it is largest at $P = \\frac{K}{2}$. There the graph of $P(t)$ changes from concave up to concave down: an inflection point. For $K = 800$, growth is fastest when $P = 400$.\n\nCheck: differentiating the rate with respect to $P$ gives $k - \\frac{2k}{K}P$, which is $0$ at $P = \\frac{K}{2}$.\n\n> **Watch out.** Growth is fastest at half the carrying capacity, whatever the starting population.",
        "$\\frac{dP}{dt} = kP - \\frac{k}{K}P^{2}$ 是关于 $P$ 的开口向下的抛物线，零点为 $0$ 和 $K$，所以在 $P = \\frac{K}{2}$ 处最大。在那里 $P(t)$ 的图像由上凹变为下凹：是拐点。当 $K = 800$ 时，$P = 400$ 时增长最快。\n\n检验：速率对 $P$ 求导得 $k - \\frac{2k}{K}P$，它在 $P = \\frac{K}{2}$ 处为 $0$。\n\n> **注意。** 无论初始种群是多少，增长都在环境容纳量的一半处最快。",
      ),
      generate(rng) {
        const L = logistic(rng);
        const P0 = (L.K / 50) * rng.int(1, 4) * 5;
        const b = L.k.div(Q.of(L.K));
        return worked(
          t(
            `A population satisfies $\\frac{dP}{dt} = ${L.tex}$ with $P(0) = ${P0}$. At what population is it growing fastest?`,
            `某种群满足 $\\frac{dP}{dt} = ${L.tex}$，$P(0) = ${P0}$。种群数量为多少时增长最快？`,
          ),
          L.K / 2,
          [
            step(
              "See the rate as a parabola",
              "把速率看成抛物线",
              t(
                `As a function of $P$, the rate $${standardForm(L)}$ is a downward parabola with zeros at $0$ and $${L.K}$.`,
                `作为 $P$ 的函数，速率 $${standardForm(L)}$ 是开口向下的抛物线，零点为 $0$ 和 $${L.K}$。`,
              ),
            ),
            step(
              "Take the vertex",
              "取顶点",
              t("A parabola's vertex is halfway between its zeros:", "抛物线的顶点在两个零点的正中间："),
              `P = \\frac{0 + ${L.K}}{2} = ${L.K / 2}`,
            ),
          ],
          t(
            `Differentiate the rate with respect to $P$: $\\frac{d}{dP}\\left(${poly([L.k, "P"], [b.neg(), "P^{2}"])}\\right) = ${poly([L.k, ""], [b.mul(Q.of(2)).neg(), "P"])}$, which is $0$ at $P = ${L.K / 2}$.`,
            `速率对 $P$ 求导：$\\frac{d}{dP}\\left(${poly([L.k, "P"], [b.neg(), "P^{2}"])}\\right) = ${poly([L.k, ""], [b.mul(Q.of(2)).neg(), "P"])}$，它在 $P = ${L.K / 2}$ 处为 $0$。`,
          ),
          [
            slip(
              L.K,
              `At $P = ${L.K}$ the rate is $0$: growth stops at the carrying capacity.`,
              `在 $P = ${L.K}$ 处速率为 $0$：增长在环境容纳量处停止。`,
            ),
            slip(
              P0,
              "The starting population is not where growth is fastest; the rate keeps rising until $\\frac{K}{2}$.",
              "初始种群并不是增长最快的位置；速率一直上升到 $\\frac{K}{2}$。",
            ),
            slip(
              Q.of(L.K + P0, 2),
              "This is halfway between the start and the capacity; the fastest growth is at $\\frac{K}{2}$ whatever the start.",
              "这是初始值与容纳量的中点；无论从哪里开始，增长都在 $\\frac{K}{2}$ 处最快。",
            ),
          ],
        );
      },
    },
  ],
};

/** solvingTheLogisticGrowthEquation finds P(t) = K/(1 + Ae^{−kt}). */
export const solvingTheLogisticGrowthEquation: TopicDef = {
  id: "solving-the-logistic-growth-equation",
  title: t("Solving the Logistic Growth Equation", "解逻辑斯谛增长方程"),
  summary: t(
    "Separation and partial fractions give $P(t) = \\frac{K}{1 + Ae^{-kt}}$ with $A = \\frac{K - P_0}{P_0}$.",
    "分离变量并用部分分式得 $P(t) = \\frac{K}{1 + Ae^{-kt}}$，其中 $A = \\frac{K - P_0}{P_0}$。",
  ),
  intro: t(
    "Separating the logistic equation and using partial fractions gives $P(t) = \\frac{K}{1 + Ae^{-kt}}$. For $\\frac{dP}{dt} = \\frac{1}{2}P\\left(1 - \\frac{P}{1000}\\right)$ with $P(0) = 200$:\n\n$$A = \\frac{1000 - 200}{200} = 4, \\qquad P(t) = \\frac{1000}{1 + 4e^{-t/2}}.$$\n\nCheck: $P(0) = \\frac{1000}{1 + 4} = 200$, and as $t \\to \\infty$, $e^{-t/2} \\to 0$, so $P \\to 1000$, the carrying capacity.\n\nIn this lesson we find the constant in the logistic solution from the starting population and write the solution.",
    "对逻辑斯谛方程分离变量并用部分分式，得 $P(t) = \\frac{K}{1 + Ae^{-kt}}$。对 $\\frac{dP}{dt} = \\frac{1}{2}P\\left(1 - \\frac{P}{1000}\\right)$，$P(0) = 200$：\n\n$$A = \\frac{1000 - 200}{200} = 4, \\qquad P(t) = \\frac{1000}{1 + 4e^{-t/2}}$$\n\n检验：$P(0) = \\frac{1000}{1 + 4} = 200$；当 $t \\to \\infty$ 时 $e^{-t/2} \\to 0$，所以 $P \\to 1000$，即环境容纳量。\n\n本课我们由初始种群求出逻辑斯谛解中的常数，并写出解。",
  ),
  prerequisites: ["qualitative-analysis-of-the-logistic-growth-equation", "integrating-rational-functions-using-partial-fractions"],
  encompasses: [{ topic: "qualitative-analysis-of-the-logistic-growth-equation", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-constant-in-the-logistic-solution",
      title: t("The constant A", "常数 A"),
      explanation: t(
        "The constant in the logistic solution is fixed by the starting population, measuring how far below the carrying capacity the population begins. Separating gives $\\int \\frac{K}{P(K - P)} \\, dP = \\int k \\, dt$, and partial fractions give $\\ln\\left|\\frac{P}{K - P}\\right| = kt + C$. Solving for $P$:\n\n$$P(t) = \\frac{K}{1 + Ae^{-kt}}, \\qquad A = \\frac{K - P_0}{P_0}.$$\n\nWith $K = 1000$ and $P_0 = 200$: $A = \\frac{800}{200} = 4$.\n\nCheck: $P(0) = \\frac{1000}{1 + 4} = 200 = P_0$.\n\n> **Watch out.** $A = \\frac{K - P_0}{P_0}$ divides by $P_0$, not by $K$; it is negative when $P_0 > K$.",
        "逻辑斯谛解中的常数由初始种群数量确定，它衡量种群开始时比环境容量低多少。分离变量得 $\\int \\frac{K}{P(K - P)} \\, dP = \\int k \\, dt$，用部分分式得 $\\ln\\left|\\frac{P}{K - P}\\right| = kt + C$。解出 $P$：\n\n$$P(t) = \\frac{K}{1 + Ae^{-kt}}, \\qquad A = \\frac{K - P_0}{P_0}$$\n\n当 $K = 1000$，$P_0 = 200$ 时：$A = \\frac{800}{200} = 4$。\n\n检验：$P(0) = \\frac{1000}{1 + 4} = 200 = P_0$。\n\n> **注意。** $A = \\frac{K - P_0}{P_0}$ 是除以 $P_0$，不是除以 $K$；当 $P_0 > K$ 时它为负。",
      ),
      generate(rng) {
        const L = logistic(rng);
        const P0 = rng.bool() ? (L.K / 50) * rng.int(1, 9) * 5 : L.K + rng.int(1, 10) * 50;
        const A = Q.of(L.K - P0, P0);
        return worked(
          t(
            `The solution of $\\frac{dP}{dt} = ${L.tex}$ with $P(0) = ${P0}$ has the form $P(t) = \\frac{${L.K}}{1 + Ae^{-${L.k.toLatex()}t}}$. Find $A$.`,
            `$\\frac{dP}{dt} = ${L.tex}$，$P(0) = ${P0}$ 的解形如 $P(t) = \\frac{${L.K}}{1 + Ae^{-${L.k.toLatex()}t}}$。求 $A$。`,
          ),
          A,
          [
            step("Put t = 0", "代入 t = 0", t("At $t = 0$, $e^{0} = 1$:", "在 $t = 0$ 处 $e^{0} = 1$："), `${P0} = \\frac{${L.K}}{1 + A}`),
            step("Solve for A", "解出 A", t("", ""), `1 + A = \\frac{${L.K}}{${P0}} = ${Q.of(L.K, P0).toLatex()}`, `A = ${A.toLatex()}`),
          ],
          t(
            `The formula $A = \\frac{K - P_0}{P_0} = \\frac{${L.K} - ${P0}}{${P0}} = ${A.toLatex()}$ agrees, and $\\frac{${L.K}}{1 + ${neg(A)}} = ${P0}$.`,
            `公式 $A = \\frac{K - P_0}{P_0} = \\frac{${L.K} - ${P0}}{${P0}} = ${A.toLatex()}$ 与之相符，且 $\\frac{${L.K}}{1 + ${neg(A)}} = ${P0}$。`,
          ),
          [
            slip(
              Q.of(P0, L.K - P0),
              "This is the reciprocal of $A$: $A = \\frac{K - P_0}{P_0}$.",
              "这是 $A$ 的倒数：$A = \\frac{K - P_0}{P_0}$。",
            ),
            slip(Q.of(L.K, P0), "This is $1 + A$; subtract $1$.", "这是 $1 + A$；还要减去 $1$。"),
            slip(Q.of(L.K - P0, L.K), "Divide by $P_0$, not by $K$.", "要除以 $P_0$，而不是 $K$。"),
          ],
        );
      },
    },
    {
      id: "writing-the-logistic-solution",
      title: t("Writing the solution", "写出解"),
      explanation: t(
        "Once the carrying capacity, the rate and the constant are known, the solution is a fraction that rises from the starting value toward the carrying capacity. Read $K$ and $k$ from the equation, compute $A$ from $P_0$, and substitute. For $\\frac{dP}{dt} = \\frac{1}{2}P\\left(1 - \\frac{P}{300}\\right)$ with $P(0) = 50$: $A = 5$, so $P(t) = \\frac{300}{1 + 5e^{-t/2}}$.\n\nCheck: $P(0) = \\frac{300}{1 + 5} = 50$, and as $t \\to \\infty$, $e^{-t/2} \\to 0$ and $P \\to 300$.\n\n> **Watch out.** The exponent is $-kt$: with $+kt$ the population would fall toward $0$ instead of rising to $K$.",
        "一旦知道环境容量、增长率和常数，解就是一个从初始值上升并趋近环境容量的分式。从方程读出 $K$ 和 $k$，由 $P_0$ 求出 $A$，再代入。对 $\\frac{dP}{dt} = \\frac{1}{2}P\\left(1 - \\frac{P}{300}\\right)$，$P(0) = 50$：$A = 5$，所以 $P(t) = \\frac{300}{1 + 5e^{-t/2}}$。\n\n检验：$P(0) = \\frac{300}{1 + 5} = 50$；当 $t \\to \\infty$ 时 $e^{-t/2} \\to 0$，$P \\to 300$。\n\n> **注意。** 指数是 $-kt$：若是 $+kt$，种群会下降趋于 $0$，而不是上升到 $K$。",
      ),
      generate(rng) {
        const L = logistic(rng);
        const P0 = (L.K / 50) * rng.int(1, 9) * 5;
        const A = Q.of(L.K - P0, P0);
        const kt = poly([L.k.neg(), "t"]);
        const answer = `\\frac{${L.K}}{1 + ${A.toLatex()}e^{${kt}}}`;
        return exact(
          {
            prompt: t(`Solve $\\frac{dP}{dt} = ${L.tex}$ with $P(0) = ${P0}$.`, `解 $\\frac{dP}{dt} = ${L.tex}$，$P(0) = ${P0}$。`),
            answer,
            prefix: "P(t) =",
            variable: "t",
          },
          [
            step(
              "Read K and k",
              "读出 K 和 k",
              t(
                `In standard form the equation is $${standardForm(L)}$: the carrying capacity is $K = ${L.K}$ and the rate is $k = ${L.k.toLatex()}$.`,
                `写成标准形式为 $${standardForm(L)}$：环境容纳量 $K = ${L.K}$，增长率 $k = ${L.k.toLatex()}$。`,
              ),
            ),
            step("Find A", "求 A", t("", ""), `A = \\frac{K - P_0}{P_0} = \\frac{${L.K} - ${P0}}{${P0}} = ${A.toLatex()}`),
            step("Assemble", "组合", t("", ""), `P(t) = ${answer}`),
          ],
          t(
            `At $t = 0$ the formula gives $\\frac{${L.K}}{1 + ${A.toLatex()}} = ${P0}$. To substitute, write $u = 1 + ${A.toLatex()}e^{${kt}}$, so that $P = \\frac{${L.K}}{u}$ and $P' = \\frac{${L.K} \\cdot ${A.toLatex()} \\cdot ${L.k.toLatex()}e^{${kt}}}{u^{2}}$. Also $1 - \\frac{P}{${L.K}} = \\frac{${A.toLatex()}e^{${kt}}}{u}$, so the right side is $${L.k.toLatex()} \\cdot \\frac{${L.K}}{u} \\cdot \\frac{${A.toLatex()}e^{${kt}}}{u}$, the same as $P'$.`,
            `在 $t = 0$ 处公式给出 $\\frac{${L.K}}{1 + ${A.toLatex()}} = ${P0}$。再代入方程：设 $u = 1 + ${A.toLatex()}e^{${kt}}$，则 $P = \\frac{${L.K}}{u}$，$P' = \\frac{${L.K} \\cdot ${A.toLatex()} \\cdot ${L.k.toLatex()}e^{${kt}}}{u^{2}}$。又 $1 - \\frac{P}{${L.K}} = \\frac{${A.toLatex()}e^{${kt}}}{u}$，所以右边等于 $${L.k.toLatex()} \\cdot \\frac{${L.K}}{u} \\cdot \\frac{${A.toLatex()}e^{${kt}}}{u}$，与 $P'$ 相同。`,
          ),
          [
            say(
              `\\frac{${L.K}}{1 + ${Q.of(P0, L.K - P0).toLatex()}e^{${kt}}}`,
              `The constant is upside down: $A = \\frac{K - P_0}{P_0} = ${A.toLatex()}$, so this does not start at $${P0}$.`,
              `常数颠倒了：$A = \\frac{K - P_0}{P_0} = ${A.toLatex()}$，所以这个函数不从 $${P0}$ 开始。`,
            ),
            say(
              `\\frac{${L.K}}{1 + ${A.toLatex()}e^{${poly([L.k, "t"])}}}`,
              "With $+kt$ in the exponent the population would fall toward $0$; the exponent is $-kt$.",
              "指数为 $+kt$ 时种群会下降趋于 $0$；指数应是 $-kt$。",
            ),
            say(
              `${P0}e^{${poly([L.k, "t"])}}`,
              "This is exponential growth with no carrying capacity; the logistic solution levels off at $K$.",
              "这是没有环境容纳量的指数增长；逻辑斯谛解会在 $K$ 处趋于平稳。",
            ),
          ],
        );
      },
    },
  ],
};

/** Field is a right side f(x, y) for dy/dx, with its LaTeX. */
interface Field {
  readonly tex: string;
  readonly f: (x: number, y: number) => number;
}

/** slopeField draws short segments of slope f(x, y) at the integer points of [−3, 3]². */
function slopeField(field: Field): Figure {
  const marks: PlaneMark[] = [];
  for (let x = -3; x <= 3; x++)
    for (let y = -3; y <= 3; y++) {
      const m = field.f(x, y);
      const dx = 0.32 / Math.sqrt(1 + m * m);
      marks.push({ kind: "segment", a: [x - dx, y - m * dx], b: [x + dx, y + m * dx], accent: true });
    }
  return {
    svg: plane({ xMin: -4, xMax: 4, yMin: -4, yMax: 4 }, marks),
    alt: t(
      `A slope field on the grid from −3 to 3 in each direction, drawn for dy/dx = ${field.tex}.`,
      `在两个方向上从 −3 到 3 的网格上画出的斜率场，对应 dy/dx = ${field.tex}。`,
    ),
  };
}

/** lin builds the field ax + by + c. */
const lin = (a: number, b: number, c: number): Field => ({
  tex: poly([a, "x"], [b, "y"], [c, ""]),
  f: (x, y) => a * x + b * y + c,
});

/** scale writes a coefficient in front of a factor, leaving out 1 and writing −1 as a minus sign. */
const scale = (q: Q) => (q.eq(Q.one) ? "" : q.eq(Q.of(-1)) ? "-" : q.toLatex());

/** Decoy is a wrong field of a matching question with what is wrong with it. */
type Decoy = { readonly field: Field; readonly en: string; readonly zh: string };

/** SlopeKind says what the slope of a field depends on. */
type SlopeKind = "x" | "y" | "xy";

/** SlopeFamily picks a field of one kind with plausible wrong fields and their reasons. */
type SlopeFamily = (rng: Rng) => { readonly right: Field; readonly wrong: readonly Decoy[] };

/** onlyY is the reason for a field that depends on y alone. */
const onlyY = (field: Field): Decoy => ({
  field,
  en: "This depends on $y$ alone, so its slopes would be equal along rows, not along columns",
  zh: "它只依赖于 $y$，所以斜率应沿每一行相等，而不是沿每一列相等",
});

/** onlyX is the reason for a field that depends on x alone. */
const onlyX = (field: Field): Decoy => ({
  field,
  en: "This depends on $x$ alone, so its slopes would be equal along columns, not along rows",
  zh: "它只依赖于 $x$，所以斜率应沿每一列相等，而不是沿每一行相等",
});

/** opposite is the reason for a field with the opposite slope everywhere. */
const opposite = (field: Field): Decoy => ({
  field,
  en: "This gives the opposite slope at every point: where the field rises it would fall",
  zh: "它在每一点给出相反的斜率：斜率场上升的地方它会下降",
});

/** directFamily: dy/dx = f(x). */
const directFamily: SlopeFamily = (rng) => {
  const a = rng.nonZero(-2, 2);
  const c = rng.int(-2, 2);
  if (rng.bool()) return { right: lin(a, 0, c), wrong: [onlyY(lin(0, a, c)), opposite(lin(-a, 0, -c))] };
  const s = rng.pick([-1, 1]);
  const sq = (v: number): Field => ({ tex: poly([s, `${v === 0 ? "x" : "y"}^{2}`], [c, ""]), f: (x, y) => s * (v === 0 ? x : y) ** 2 + c });
  return { right: sq(0), wrong: [onlyY(sq(1)), opposite({ tex: poly([-s, "x^{2}"], [-c, ""]), f: (x) => -s * x * x - c })] };
};

/** autonomousFamily: dy/dx = g(y). */
const autonomousFamily: SlopeFamily = (rng) => {
  const a = rng.nonZero(-2, 2);
  const c = rng.int(-2, 2);
  const linearCase = { right: lin(0, a, c), wrong: [onlyX(lin(a, 0, c)), opposite(lin(0, -a, -c))] };
  if (rng.bool()) return linearCase;
  const r = rng.int(-2, 2);
  const s = rng.pick([-1, 1]);
  const prod = (v: "x" | "y", sign: number): Field => ({
    tex: `${sign < 0 ? "-" : ""}${v}(${linear(1, -r, v)})`,
    f: (x, y) => sign * (v === "x" ? x : y) * ((v === "x" ? x : y) - r),
  });
  if (r === 0) return linearCase;
  return { right: prod("y", s), wrong: [onlyX(prod("x", s)), opposite(prod("y", -s))] };
};

/** mixedFamily: dy/dx = ax + by + c with a, b ≠ 0. */
const mixedFamily: SlopeFamily = (rng) => {
  const a = rng.nonZero(-2, 2);
  const b = rng.nonZero(-2, 2);
  const c = rng.int(-2, 2);
  const swapped = b !== a && !(b === -a && c === 0);
  return {
    right: lin(a, b, c),
    wrong: [
      {
        field: lin(a, -b, c),
        en: "The sign of the $y$ term is wrong: going up a column its slopes would change the other way",
        zh: "$y$ 项的符号错了：沿一列向上走时，它的斜率变化方向相反",
      },
      opposite(lin(-a, -b, -c)),
      swapped
        ? {
            field: lin(b, a, c),
            en: "This swaps the roles of $x$ and $y$: its slope at $(x, y)$ is the field's slope at $(y, x)$",
            zh: "它把 $x$ 与 $y$ 的作用对调了：它在 $(x, y)$ 处的斜率是原斜率场在 $(y, x)$ 处的斜率",
          }
        : {
            field: lin(a, 0, c),
            en: "With no $y$ term every column would be parallel, but here the slopes change along each column",
            zh: "没有 $y$ 项时每一列都会互相平行，但这里的斜率沿每一列都在变化",
          },
    ],
  };
};

/** matchingProblem shows a slope field and asks which equation it belongs to. */
function matchingProblem(rng: Rng, family: SlopeFamily, why: Text) {
  const { right, wrong } = family(rng);
  const eq = (f: Field) => opt(`\\frac{dy}{dx} = ${f.tex}`);
  return choose(
    rng,
    t("Which differential equation does this slope field belong to?", "这个斜率场属于哪个微分方程？"),
    eq(right),
    wrong.map((w) => because(eq(w.field), w.en, w.zh)),
    [
      step("See how the slopes vary", "看斜率如何变化", why),
      step(
        "Compare slopes at points",
        "比较几个点的斜率",
        t(
          `The slopes match $\\frac{dy}{dx} = ${right.tex}$: at $(1, 1)$ the segment has slope $${right.f(1, 1)}$ and at $(-1, 2)$ it has slope $${right.f(-1, 2)}$.`,
          `各斜率与 $\\frac{dy}{dx} = ${right.tex}$ 相符：$(1, 1)$ 处线段的斜率为 $${right.f(1, 1)}$，$(-1, 2)$ 处为 $${right.f(-1, 2)}$。`,
        ),
      ),
    ],
    t(
      `Take a third point: at $(2, -1)$ the equation gives slope $${right.f(2, -1)}$, which matches the segment drawn there.`,
      `再取第三个点：在 $(2, -1)$ 处，方程给出的斜率为 $${right.f(2, -1)}$，与那里画出的线段一致。`,
    ),
    slopeField(right),
  );
}

/** slopeAtPointProblem asks for the slope of the field at a grid point. */
function slopeAtPointProblem(rng: Rng, family: SlopeFamily, kind: SlopeKind) {
  const { right } = family(rng);
  const x0 = rng.int(-3, 3);
  const y0 = rng.int(-3, 3);
  const answer = right.f(x0, y0);
  const put = right.tex.replace(/x/g, `(${x0})`).replace(/y/g, `(${y0})`);
  const at = right.f(0, 0);
  const check =
    kind === "x"
      ? t(
          `The rule has no $y$, so every segment in the column $x = ${x0}$ has the same slope; at $(${x0}, ${y0 + 1})$ it is also $${answer}$, and the segment at $(${x0}, ${y0})$ is parallel to it.`,
          `规则中没有 $y$，所以列 $x = ${x0}$ 上的每条线段斜率都相同；在 $(${x0}, ${y0 + 1})$ 处也是 $${answer}$，$(${x0}, ${y0})$ 处的线段与它平行。`,
        )
      : kind === "y"
        ? t(
            `The rule has no $x$, so every segment in the row $y = ${y0}$ has the same slope; at $(0, ${y0})$ it is also $${right.f(0, y0)}$.`,
            `规则中没有 $x$，所以行 $y = ${y0}$ 上的每条线段斜率都相同；在 $(0, ${y0})$ 处也是 $${right.f(0, y0)}$。`,
          )
        : t(
            `Term by term: the $x$ term gives $${(right.f(1, 0) - at) * x0}$, the $y$ term gives $${(right.f(0, 1) - at) * y0}$ and the constant is $${at}$; together $${answer}$.`,
            `逐项计算：$x$ 项给出 $${(right.f(1, 0) - at) * x0}$，$y$ 项给出 $${(right.f(0, 1) - at) * y0}$，常数为 $${at}$；合起来是 $${answer}$。`,
          );
  return worked(
    t(
      `In the slope field of $\\frac{dy}{dx} = ${right.tex}$, what is the slope of the segment drawn at $(${x0}, ${y0})$?`,
      `在 $\\frac{dy}{dx} = ${right.tex}$ 的斜率场中，画在 $(${x0}, ${y0})$ 处的线段斜率是多少？`,
    ),
    answer,
    [
      step(
        "Read the slope rule",
        "读出斜率规则",
        t(
          `The segment at a point has slope $\\frac{dy}{dx}$ there, so evaluate the right side $${right.tex}$ with $x = ${x0}$ and $y = ${y0}$.`,
          `线段的斜率就是 $\\frac{dy}{dx}$ 在该点的值，所以在 $x = ${x0}$，$y = ${y0}$ 处计算右边 $${right.tex}$。`,
        ),
      ),
      step("Substitute", "代入", t("", ""), `\\left.\\frac{dy}{dx}\\right|_{(${x0}, ${y0})} = ${put} = ${answer}`),
    ],
    check,
    [
      slip(
        right.f(y0, x0),
        `This is the slope at $(${y0}, ${x0})$: the coordinates were swapped`,
        `这是 $(${y0}, ${x0})$ 处的斜率：两个坐标对调了`,
      ),
      slip(-answer, "The sign is reversed; keep negative coordinates in parentheses when substituting", "符号反了；代入负坐标时要加括号"),
      slip(at, "This is the slope at the origin; the slope changes from point to point", "这是原点处的斜率；斜率随点而变"),
    ],
  );
}

/** slopeFieldsForDirectlyIntegrableDifferentialEquations draws fields of dy/dx = f(x). */
export const slopeFieldsForDirectlyIntegrableDifferentialEquations: TopicDef = {
  id: "slope-fields-for-directly-integrable-differential-equations",
  title: t("Slope Fields for Directly Integrable Differential Equations", "可直接积分的微分方程的斜率场"),
  summary: t(
    "A slope field draws a short segment of slope f(x, y) at many points; for dy/dx = f(x) the slopes are equal along each vertical line.",
    "斜率场在许多点画出斜率为 f(x, y) 的短线段；对 dy/dx = f(x)，同一条竖直线上的斜率都相等。",
  ),
  intro: t(
    "A slope field shows a differential equation as a picture: at each grid point it draws a short segment whose slope is $\\frac{dy}{dx}$ there. For $\\frac{dy}{dx} = x - 1$:\n\n$$\\text{at } (3, 0): 3 - 1 = 2, \\qquad \\text{at } (3, 5): 3 - 1 = 2, \\qquad \\text{at } (0, 2): 0 - 1 = -1.$$\n\nThe height does not matter, so every segment on the line $x = 3$ has slope $2$, and the segments on $x = 1$ are horizontal.\n\nCheck: the solutions are $y = \\frac{x^{2}}{2} - x + C$, and $y' = x - 1$ is $2$ at $x = 3$ for every $C$.\n\nIn this lesson we compute the slopes in the field of $\\frac{dy}{dx} = f(x)$ and match such a field to its equation.",
    "斜率场把微分方程画成一幅图：在每个网格点画一条短线段，其斜率是该点的 $\\frac{dy}{dx}$。对 $\\frac{dy}{dx} = x - 1$：\n\n$$(3, 0) \\text{ 处}: 3 - 1 = 2, \\qquad (3, 5) \\text{ 处}: 3 - 1 = 2, \\qquad (0, 2) \\text{ 处}: 0 - 1 = -1$$\n\n高度不起作用，所以直线 $x = 3$ 上每条线段的斜率都是 $2$，直线 $x = 1$ 上的线段都是水平的。\n\n检验：解为 $y = \\frac{x^{2}}{2} - x + C$，$y' = x - 1$ 在 $x = 3$ 处对每个 $C$ 都等于 $2$。\n\n本课我们计算 $\\frac{dy}{dx} = f(x)$ 的斜率场中的斜率，并把这样的斜率场与它的方程对应起来。",
  ),
  prerequisites: ["solving-first-order-odes-using-direct-integration", "qualitative-analysis-of-first-order-odes"],
  encompasses: [{ topic: "qualitative-analysis-of-first-order-odes", weight: 0.2 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "slopes-in-a-field-of-a-function-of-x",
      title: t("Slopes in the field", "斜率场中的斜率"),
      explanation: t(
        "A **slope field** draws, at each grid point $(x, y)$, a short segment with slope $\\frac{dy}{dx}$ there. Solution curves run along the segments. For $\\frac{dy}{dx} = 2x - 1$, the segment at $(2, -3)$ has slope $2(2) - 1 = 3$, and so does every segment on the line $x = 2$.\n\nCheck: $y = x^{2} - x + C$ solves the equation, and its slope at $x = 2$ is $2 \\cdot 2 - 1 = 3$ whatever $C$ is.\n\n> **Watch out.** The slope comes from the equation, not from the position of the point: at $(2, -3)$ it is $3$, not $\\frac{-3}{2}$.",
        "**斜率场**在每个网格点 $(x, y)$ 处画一条斜率为该点 $\\frac{dy}{dx}$ 的短线段。解曲线顺着这些线段走。对 $\\frac{dy}{dx} = 2x - 1$，$(2, -3)$ 处线段的斜率为 $2(2) - 1 = 3$，直线 $x = 2$ 上每条线段的斜率也都是 $3$。\n\n检验：$y = x^{2} - x + C$ 是方程的解，它在 $x = 2$ 处的斜率为 $2 \\cdot 2 - 1 = 3$，与 $C$ 无关。\n\n> **注意。** 斜率由方程给出，而不是由点的位置给出：$(2, -3)$ 处的斜率是 $3$，不是 $\\frac{-3}{2}$。",
      ),
      generate: (rng) => slopeAtPointProblem(rng, directFamily, "x"),
    },
    {
      id: "matching-a-field-of-a-function-of-x",
      figure: calculusDrawings5["slope-fields-for-directly-integrable-differential-equations#matching-a-field-of-a-function-of-x"],
      title: t("Matching the field", "匹配斜率场"),
      explanation: t(
        "When $\\frac{dy}{dx}$ depends only on $x$, every column of segments is parallel: moving up or down does not change the slope. Then compare the slopes in a few columns, for example where they are $0$ and where they are positive or negative. For $\\frac{dy}{dx} = x$ the column $x = 0$ is horizontal, the slopes are positive to its right and negative to its left.\n\nCheck: in the column $x = 1$ the segments at $(1, -2)$, $(1, 0)$ and $(1, 3)$ all have slope $1$.\n\n> **Watch out.** Parallel columns mean the slope depends on $x$; parallel rows mean it depends on $y$. Do not mix the two up.",
        "当 $\\frac{dy}{dx}$ 只依赖于 $x$ 时，每一列线段都互相平行：上下移动不改变斜率。再比较几列的斜率，例如斜率为 $0$ 的位置，以及斜率为正或为负的位置。对 $\\frac{dy}{dx} = x$，列 $x = 0$ 上的线段是水平的，其右侧斜率为正，左侧为负。\n\n检验：在列 $x = 1$ 上，$(1, -2)$、$(1, 0)$、$(1, 3)$ 处的线段斜率都是 $1$。\n\n> **注意。** 每一列平行说明斜率依赖于 $x$；每一行平行说明斜率依赖于 $y$。不要把两者弄混。",
      ),
      generate: (rng) =>
        matchingProblem(
          rng,
          directFamily,
          t(
            "The segments are parallel along each vertical line, so the slope depends only on $x$.",
            "每条竖直线上的线段互相平行，所以斜率只依赖于 $x$。",
          ),
        ),
    },
  ],
};

/** slopeFieldsForAutonomousDifferentialEquations draws fields of dy/dx = g(y). */
export const slopeFieldsForAutonomousDifferentialEquations: TopicDef = {
  id: "slope-fields-for-autonomous-differential-equations",
  title: t("Slope Fields for Autonomous Differential Equations", "自治微分方程的斜率场"),
  summary: t(
    "For dy/dx = g(y) the slopes are equal along each horizontal line, and rows of horizontal segments mark equilibria.",
    "对 dy/dx = g(y)，同一条水平线上的斜率都相等，整行水平线段标出平衡解。",
  ),
  intro: t(
    "In an autonomous equation $\\frac{dy}{dx} = g(y)$ the slope depends only on the height. For $\\frac{dy}{dx} = y - 1$:\n\n$$\\text{at } (0, 3): 3 - 1 = 2, \\qquad \\text{at } (5, 3): 3 - 1 = 2, \\qquad \\text{at } (2, 1): 1 - 1 = 0.$$\n\nEvery segment on the row $y = 3$ has slope $2$, and the whole row $y = 1$ is horizontal: the constant function $y = 1$ is a solution.\n\nCheck: $y = 1$ has $y' = 0$, and the right side is $1 - 1 = 0$, so the equation holds for every $x$.\n\nIn this lesson we compute the slopes in the field of $\\frac{dy}{dx} = g(y)$ and match such a field to its equation.",
    "在自治方程 $\\frac{dy}{dx} = g(y)$ 中，斜率只依赖于高度。对 $\\frac{dy}{dx} = y - 1$：\n\n$$(0, 3) \\text{ 处}: 3 - 1 = 2, \\qquad (5, 3) \\text{ 处}: 3 - 1 = 2, \\qquad (2, 1) \\text{ 处}: 1 - 1 = 0$$\n\n行 $y = 3$ 上每条线段的斜率都是 $2$，整行 $y = 1$ 都是水平的：常函数 $y = 1$ 是一个解。\n\n检验：$y = 1$ 满足 $y' = 0$，右边为 $1 - 1 = 0$，所以方程对每个 $x$ 都成立。\n\n本课我们计算 $\\frac{dy}{dx} = g(y)$ 的斜率场中的斜率，并把这样的斜率场与它的方程对应起来。",
  ),
  prerequisites: ["slope-fields-for-directly-integrable-differential-equations", "equilibrium-solutions-of-first-order-odes"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "slopes-in-a-field-of-a-function-of-y",
      title: t("Slopes in the field", "斜率场中的斜率"),
      explanation: t(
        "For an autonomous equation $\\frac{dy}{dx} = g(y)$ the slope depends only on the height $y$. For $\\frac{dy}{dx} = y(y - 2)$, every segment on the line $y = 3$ has slope $3(3 - 2) = 3$, and every segment on $y = 2$ is horizontal.\n\nCheck: the constant function $y = 2$ has $y' = 0$ and $2(2 - 2) = 0$, so it is a solution, and its row is flat.\n\n> **Watch out.** Evaluate $g$ at the $y$-coordinate; the $x$-coordinate does not enter at all.",
        "对自治方程 $\\frac{dy}{dx} = g(y)$，斜率只依赖于高度 $y$。对 $\\frac{dy}{dx} = y(y - 2)$，直线 $y = 3$ 上每条线段的斜率都是 $3(3 - 2) = 3$，直线 $y = 2$ 上的每条线段都是水平的。\n\n检验：常函数 $y = 2$ 满足 $y' = 0$，且 $2(2 - 2) = 0$，所以它是解，它所在的行是平的。\n\n> **注意。** 要在 $y$ 坐标处计算 $g$；$x$ 坐标根本不参与。",
      ),
      generate: (rng) => slopeAtPointProblem(rng, autonomousFamily, "y"),
    },
    {
      id: "matching-a-field-of-a-function-of-y",
      figure: calculusDrawings5["slope-fields-for-autonomous-differential-equations#matching-a-field-of-a-function-of-y"],
      title: t("Matching the field", "匹配斜率场"),
      explanation: t(
        "When every row of segments is parallel, the equation is autonomous. A row of horizontal segments at $y = c$ shows that $g(c) = 0$, so $y = c$ is an equilibrium solution. For $\\frac{dy}{dx} = y - 1$ the row $y = 1$ is flat, the slopes are positive above it and negative below it.\n\nCheck: at $(-2, 1)$ and $(3, 1)$ the slope is $1 - 1 = 0$, and at $(0, 2)$ and $(3, 2)$ it is $2 - 1 = 1$.\n\n> **Watch out.** A flat row marks an equilibrium only when the field is autonomous; first check that the other rows are parallel too.",
        "若每一行线段都互相平行，方程就是自治的。在 $y = c$ 处整行水平的线段说明 $g(c) = 0$，所以 $y = c$ 是平衡解。对 $\\frac{dy}{dx} = y - 1$，行 $y = 1$ 是平的，其上方斜率为正，下方为负。\n\n检验：$(-2, 1)$ 与 $(3, 1)$ 处的斜率为 $1 - 1 = 0$，$(0, 2)$ 与 $(3, 2)$ 处为 $2 - 1 = 1$。\n\n> **注意。** 只有斜率场是自治的，平的一行才标出平衡解；先检查其他各行是否也互相平行。",
      ),
      generate: (rng) =>
        matchingProblem(
          rng,
          autonomousFamily,
          t(
            "The segments are parallel along each horizontal line, so the slope depends only on $y$.",
            "每条水平线上的线段互相平行，所以斜率只依赖于 $y$。",
          ),
        ),
    },
  ],
};

/** slopeFieldsForNonautonomousDifferentialEquations draws fields of dy/dx = f(x, y). */
export const slopeFieldsForNonautonomousDifferentialEquations: TopicDef = {
  id: "slope-fields-for-nonautonomous-differential-equations",
  title: t("Slope Fields for Nonautonomous Differential Equations", "非自治微分方程的斜率场"),
  summary: t(
    "When dy/dx depends on both x and y, slopes change along rows and columns; lines of equal slope (isoclines) help to read the field.",
    "当 dy/dx 同时依赖于 x 和 y 时，斜率沿行和列都会变化；等斜线有助于读懂斜率场。",
  ),
  intro: t(
    "When the slope depends on both coordinates, it changes along rows and along columns. For $\\frac{dy}{dx} = x + y$:\n\n$$\\text{at } (1, 2): 1 + 2 = 3, \\qquad \\text{at } (2, 1): 2 + 1 = 3, \\qquad \\text{at } (-1, 1): -1 + 1 = 0.$$\n\nThe slope is $0$ wherever $x + y = 0$, that is along the line $y = -x$, and it is positive above that line and negative below it.\n\nCheck: the point $(2, -2)$ lies on $y = -x$, and its slope is $2 + (-2) = 0$.\n\nIn this lesson we compute the slopes in a field that depends on $x$ and $y$ and match such a field using its line of zero slope.",
    "当斜率同时依赖于两个坐标时，它沿行和沿列都会变化。对 $\\frac{dy}{dx} = x + y$：\n\n$$(1, 2) \\text{ 处}: 1 + 2 = 3, \\qquad (2, 1) \\text{ 处}: 2 + 1 = 3, \\qquad (-1, 1) \\text{ 处}: -1 + 1 = 0$$\n\n凡是 $x + y = 0$ 的地方，即沿直线 $y = -x$，斜率都为 $0$；在这条直线上方斜率为正，下方为负。\n\n检验：点 $(2, -2)$ 在 $y = -x$ 上，它的斜率为 $2 + (-2) = 0$。\n\n本课我们计算同时依赖于 $x$ 和 $y$ 的斜率场中的斜率，并借助斜率为零的直线来匹配这样的斜率场。",
  ),
  prerequisites: ["slope-fields-for-autonomous-differential-equations"],
  encompasses: [],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "slopes-in-a-field-of-x-and-y",
      title: t("Slopes in the field", "斜率场中的斜率"),
      explanation: t(
        "Evaluate $f(x, y)$ at the point. For $\\frac{dy}{dx} = x - 2y$, the slope at $(3, 1)$ is $3 - 2(1) = 1$ and at $(1, 3)$ it is $1 - 2(3) = -5$: swapping the coordinates changes the slope.\n\nCheck: term by term at $(3, 1)$, the $x$ term gives $3$ and the $-2y$ term gives $-2$, so the slope is $1$.\n\n> **Watch out.** Put the $x$-coordinate in for $x$ and the $y$-coordinate in for $y$; swapping them gives the slope at the mirrored point.",
        "在该点计算 $f(x, y)$。对 $\\frac{dy}{dx} = x - 2y$，$(3, 1)$ 处的斜率为 $3 - 2(1) = 1$，$(1, 3)$ 处为 $1 - 2(3) = -5$：交换坐标会改变斜率。\n\n检验：在 $(3, 1)$ 处逐项计算，$x$ 项给出 $3$，$-2y$ 项给出 $-2$，所以斜率为 $1$。\n\n> **注意。** 用横坐标代 $x$、纵坐标代 $y$；把两者对调得到的是对称点处的斜率。",
      ),
      generate: (rng) => slopeAtPointProblem(rng, mixedFamily, "xy"),
    },
    {
      id: "matching-a-field-of-x-and-y",
      title: t("Matching the field", "匹配斜率场"),
      explanation: t(
        "Find where the slopes are $0$: for $\\frac{dy}{dx} = ax + by + c$ they lie on the line $ax + by + c = 0$. Then check the sign of the slope on each side of that line. For $\\frac{dy}{dx} = x - y + 1$ the slope is $0$ along $y = x + 1$; above that line $y$ is larger, so the slope is negative.\n\nCheck: $(0, 3)$ lies above $y = x + 1$, and its slope is $0 - 3 + 1 = -2 < 0$.\n\n> **Watch out.** Changing the sign of the $y$ term tilts the line of zero slope the other way; compare that line's direction before anything else.",
        "先找斜率为 $0$ 的位置：对 $\\frac{dy}{dx} = ax + by + c$，它们位于直线 $ax + by + c = 0$ 上。再检查这条直线两侧斜率的正负。对 $\\frac{dy}{dx} = x - y + 1$，斜率沿 $y = x + 1$ 为 $0$；在这条直线上方 $y$ 更大，所以斜率为负。\n\n检验：$(0, 3)$ 在 $y = x + 1$ 上方，它的斜率为 $0 - 3 + 1 = -2 < 0$。\n\n> **注意。** 改变 $y$ 项的符号会使斜率为零的直线朝另一方向倾斜；先比较这条直线的方向。",
      ),
      generate: (rng) =>
        matchingProblem(
          rng,
          mixedFamily,
          t(
            "The slopes change along both rows and columns, so they depend on both $x$ and $y$.",
            "斜率沿行和列都在变化，所以它同时依赖于 $x$ 和 $y$。",
          ),
        ),
    },
  ],
};

/** analyzingSlopeFieldsForDirectlyIntegrableDifferentialEquations reads solutions of dy/dx = f(x) from a field. */
export const analyzingSlopeFieldsForDirectlyIntegrableDifferentialEquations: TopicDef = {
  id: "analyzing-slope-fields-for-directly-integrable-differential-equations",
  title: t("Analyzing Slope Fields for Directly Integrable Differential Equations", "分析可直接积分的微分方程的斜率场"),
  summary: t(
    "Solutions of dy/dx = f(x) are vertical translates of each other; their extrema lie where f(x) = 0.",
    "dy/dx = f(x) 的解彼此是竖直平移的关系；它们的极值点位于 f(x) = 0 处。",
  ),
  intro: t(
    "A slope field tells us about every solution at once. For $\\frac{dy}{dx} = 2x - 4$ the column $x = 2$ is horizontal, the slopes are negative to its left and positive to its right:\n\n$$2(1) - 4 = -2 < 0, \\qquad 2(2) - 4 = 0, \\qquad 2(3) - 4 = 2 > 0.$$\n\nSo every solution falls and then rises: each has a local minimum at $x = 2$. The solutions $y = x^{2} - 4x + C$ differ only by $C$, so each is the others shifted up or down.\n\nCheck: $x^{2} - 4x + C = (x - 2)^{2} + C - 4$ is a parabola opening upward with its vertex at $x = 2$.\n\nIn this lesson we find the extrema of solutions from the field and use that the solutions are vertical translates of each other.",
    "斜率场能一次告诉我们所有解的情况。对 $\\frac{dy}{dx} = 2x - 4$，列 $x = 2$ 是水平的，其左侧斜率为负，右侧为正：\n\n$$2(1) - 4 = -2 < 0, \\qquad 2(2) - 4 = 0, \\qquad 2(3) - 4 = 2 > 0$$\n\n所以每个解都先降后升：每个解都在 $x = 2$ 处取得局部极小值。解 $y = x^{2} - 4x + C$ 只相差 $C$，所以每个解都是其他解向上或向下平移得到的。\n\n检验：$x^{2} - 4x + C = (x - 2)^{2} + C - 4$ 是开口向上、顶点在 $x = 2$ 处的抛物线。\n\n本课我们从斜率场找出解的极值，并利用解彼此互为竖直平移这一点。",
  ),
  prerequisites: ["slope-fields-for-directly-integrable-differential-equations"],
  encompasses: [{ topic: "slope-fields-for-directly-integrable-differential-equations", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "extrema-of-solutions-from-a-field",
      title: t("Extrema of solutions", "解的极值"),
      explanation: t(
        "In the field of $\\frac{dy}{dx} = f(x)$, a column of horizontal segments at $x = c$ means $f(c) = 0$. If the slopes change from negative to positive there, every solution has a local minimum at $x = c$; from positive to negative, a local maximum. For $\\frac{dy}{dx} = 2x - 4$ the slopes go from negative to positive at $x = 2$, so every solution has a minimum there.\n\nCheck: $\\frac{dy}{dx} = 2x - 4$ integrates to $y = (x - 2)^{2} + C - 4$, a parabola whose lowest point is at $x = 2$.\n\n> **Watch out.** A column of horizontal segments is an extremum only if the slopes change sign there: for $\\frac{dy}{dx} = x^{2}$ they are $0$ at $x = 0$ but positive on both sides.",
        "在 $\\frac{dy}{dx} = f(x)$ 的斜率场中，$x = c$ 处整列水平的线段说明 $f(c) = 0$。若斜率在该处由负变正，每个解在 $x = c$ 处都取得局部极小值；由正变负，则取得局部极大值。对 $\\frac{dy}{dx} = 2x - 4$，斜率在 $x = 2$ 处由负变正，所以每个解都在那里取得极小值。\n\n检验：$\\frac{dy}{dx} = 2x - 4$ 积分得 $y = (x - 2)^{2} + C - 4$，这是最低点在 $x = 2$ 处的抛物线。\n\n> **注意。** 只有斜率在该处变号，整列水平线段才对应极值：对 $\\frac{dy}{dx} = x^{2}$，$x = 0$ 处斜率为 $0$，但两侧都为正。",
      ),
      generate(rng) {
        const a = rng.nonZero(-3, 3);
        const c = rng.int(-3, 3);
        const field = lin(a, 0, -a * c);
        const minimum = a > 0;
        const half = Q.of(a, 2);
        const base = c === 0 ? "x" : `(${linear(1, -c)})`;
        return {
          ...worked(
            t(
              `The slope field shows $\\frac{dy}{dx} = ${field.tex}$. At what value of $x$ does every solution have a local ${minimum ? "minimum" : "maximum"}?`,
              `斜率场对应 $\\frac{dy}{dx} = ${field.tex}$。每个解在 $x$ 取何值时取得局部${minimum ? "极小值" : "极大值"}？`,
            ),
            c,
            [
              step(
                "Find the flat column",
                "找出水平的一列",
                t(`The segments are horizontal where the slope is $0$:`, `线段在斜率为 $0$ 处水平：`),
                `${field.tex} = 0 \\quad\\Rightarrow\\quad x = ${c}`,
              ),
              step(
                "Read the sign change",
                "看符号变化",
                t(
                  `At $x = ${c - 1}$ the slope is $${a * -1}$ and at $x = ${c + 1}$ it is $${a}$: the slopes go from ${minimum ? "negative to positive" : "positive to negative"}, so each solution has a local ${minimum ? "minimum" : "maximum"} at $x = ${c}$.`,
                  `在 $x = ${c - 1}$ 处斜率为 $${a * -1}$，在 $x = ${c + 1}$ 处为 $${a}$：斜率由${minimum ? "负变正" : "正变负"}，所以每个解在 $x = ${c}$ 处取得局部${minimum ? "极小值" : "极大值"}。`,
                ),
              ),
            ],
            t(
              `Integrate: $y = ${scale(half)}${base}^{2} + C$, a parabola opening ${minimum ? "upward" : "downward"} with its vertex at $x = ${c}$; its derivative $${scale(Q.of(a))}${base}$ is the right side.`,
              `积分得 $y = ${scale(half)}${base}^{2} + C$，这是开口向${minimum ? "上" : "下"}、顶点在 $x = ${c}$ 的抛物线；它的导数 $${scale(Q.of(a))}${base}$ 正是方程右边。`,
            ),
            [
              slip(
                -c,
                "The sign is reversed: the slope is $0$ where $x$ equals this value's opposite",
                "符号反了：斜率为 $0$ 的位置是这个数的相反数",
              ),
              slip(
                -a * c,
                "This is the constant term, the slope at $x = 0$; the extremum is where the slope is $0$",
                "这是常数项，即 $x = 0$ 处的斜率；极值点在斜率为 $0$ 的位置",
              ),
              slip(
                a,
                "This is the coefficient of $x$, how fast the slope changes; the extremum is where the slope is $0$",
                "这是 $x$ 的系数，即斜率变化的快慢；极值点在斜率为 $0$ 的位置",
              ),
            ],
          ),
          figure: slopeField(field),
        };
      },
    },
    {
      id: "vertical-translates-of-solutions",
      figure: calculusDrawings5["analyzing-slope-fields-for-directly-integrable-differential-equations#vertical-translates-of-solutions"],
      title: t("Solutions are vertical translates", "解互为竖直平移"),
      explanation: t(
        "If $y_1$ and $y_2$ both solve $\\frac{dy}{dx} = f(x)$, then $(y_2 - y_1)' = f(x) - f(x) = 0$, so they differ by a constant: one curve is the other shifted up or down. If the solution through $(0, 0)$ passes through $(2, 5)$, the solution through $(0, 3)$ passes through $(2, 8)$.\n\nCheck: both solutions have the same net change from $x = 0$ to $x = 2$: $5 - 0 = 8 - 3 = 5$.\n\n> **Watch out.** The shift is the difference at the start, and it stays the same for every $x$; it does not grow as $x$ moves away.",
        "若 $y_1$ 和 $y_2$ 都是 $\\frac{dy}{dx} = f(x)$ 的解，则 $(y_2 - y_1)' = f(x) - f(x) = 0$，所以它们相差一个常数：一条曲线是另一条向上或向下平移得到的。若过 $(0, 0)$ 的解经过 $(2, 5)$，则过 $(0, 3)$ 的解经过 $(2, 8)$。\n\n检验：两个解从 $x = 0$ 到 $x = 2$ 的净变化相同：$5 - 0 = 8 - 3 = 5$。\n\n> **注意。** 平移量就是起点处的差，它对每个 $x$ 都不变；不会随 $x$ 远离而变大。",
      ),
      generate(rng) {
        const x1 = rng.int(1, 4);
        const v = rng.int(-9, 9);
        const x0 = rng.int(-3, 0);
        const y0 = rng.int(-5, 5);
        const s = rng.nonZero(-6, 6);
        return worked(
          t(
            `The solution of $\\frac{dy}{dx} = f(x)$ through $(${x0}, ${y0})$ passes through $(${x1}, ${v})$. The solution through $(${x0}, ${y0 + s})$ passes through $(${x1}, b)$. Find $b$.`,
            `$\\frac{dy}{dx} = f(x)$ 过 $(${x0}, ${y0})$ 的解经过 $(${x1}, ${v})$。过 $(${x0}, ${y0 + s})$ 的解经过 $(${x1}, b)$。求 $b$。`,
          ),
          v + s,
          [
            step(
              "Solutions differ by a constant",
              "解相差一个常数",
              t(
                "Both solve the same equation, so their difference has derivative $0$: $y_2 = y_1 + k$ for a constant $k$.",
                "两者满足同一个方程，所以它们的差的导数为 $0$：$y_2 = y_1 + k$，$k$ 为常数。",
              ),
            ),
            step(
              "Find the shift",
              "求平移量",
              t(`At $x = ${x0}$ the two values are $${y0 + s}$ and $${y0}$:`, `在 $x = ${x0}$ 处两个值分别为 $${y0 + s}$ 和 $${y0}$：`),
              `k = ${y0 + s} - ${neg(y0)} = ${s}, \\qquad b = ${v} + ${neg(s)} = ${v + s}`,
            ),
          ],
          t(
            `Compare net changes from $x = ${x0}$ to $x = ${x1}$: the first solution changes by $${v} - ${neg(y0)} = ${v - y0}$, and the second by $${v + s} - ${neg(y0 + s)} = ${v - y0}$, the same, as it must be when both follow the same slopes.`,
            `比较从 $x = ${x0}$ 到 $x = ${x1}$ 的净变化：第一个解变化 $${v} - ${neg(y0)} = ${v - y0}$，第二个解变化 $${v + s} - ${neg(y0 + s)} = ${v - y0}$，两者相同，因为它们沿着同样的斜率走。`,
          ),
          [
            slip(
              v,
              "This is the first solution's value; the second starts higher or lower and stays shifted",
              "这是第一个解的值；第二个解起点不同，并一直保持平移",
            ),
            slip(v - s, "The shift went the wrong way", "平移方向反了"),
            slip(
              y0 + s,
              "This is the second solution's starting value; it changes between the two values of $x$",
              "这是第二个解的起始值；它在两个 $x$ 值之间会变化",
            ),
          ],
        );
      },
    },
  ],
};

/** analyzingSlopeFieldsForAutonomousDifferentialEquations reads equilibria and limits from a field. */
export const analyzingSlopeFieldsForAutonomousDifferentialEquations: TopicDef = {
  id: "analyzing-slope-fields-for-autonomous-differential-equations",
  title: t("Analyzing Slope Fields for Autonomous Differential Equations", "分析自治微分方程的斜率场"),
  summary: t(
    "Rows of horizontal segments are equilibria; solutions between them move toward the stable one.",
    "整行水平线段是平衡解；位于它们之间的解朝稳定的平衡解移动。",
  ),
  intro: t(
    "In the field of $\\frac{dy}{dx} = -y(y - 2)$ the rows $y = 0$ and $y = 2$ are flat. Starting from $y(0) = 1$:\n\n$$\\frac{dy}{dx} = -1(1 - 2) = 1 > 0,$$\n\nso the solution rises. It cannot cross the row $y = 2$, so it levels off toward it: $\\lim_{x \\to \\infty} y(x) = 2$, and $y = 2$ is the stable equilibrium.\n\nCheck: $g(y) = -y^{2} + 2y$ has $g'(y) = -2y + 2$, and $g'(2) = -2 < 0$, so $y = 2$ is stable.\n\nIn this lesson we read equilibria and their stability from the field and find where a solution ends up.",
    "在 $\\frac{dy}{dx} = -y(y - 2)$ 的斜率场中，行 $y = 0$ 和 $y = 2$ 是平的。从 $y(0) = 1$ 出发：\n\n$$\\frac{dy}{dx} = -1(1 - 2) = 1 > 0$$\n\n所以解上升。它不能越过行 $y = 2$，于是逐渐趋于它：$\\lim_{x \\to \\infty} y(x) = 2$，$y = 2$ 是稳定平衡解。\n\n检验：$g(y) = -y^{2} + 2y$，$g'(y) = -2y + 2$，$g'(2) = -2 < 0$，所以 $y = 2$ 是稳定的。\n\n本课我们从斜率场读出平衡解及其稳定性，并求出解的最终走向。",
  ),
  prerequisites: [
    "slope-fields-for-autonomous-differential-equations",
    "analyzing-slope-fields-for-directly-integrable-differential-equations",
  ],
  encompasses: [{ topic: "slope-fields-for-autonomous-differential-equations", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "limits-of-solutions-from-a-field",
      title: t("Where solutions end up", "解的最终走向"),
      explanation: t(
        "In the field of $\\frac{dy}{dx} = g(y)$, follow the segments from the starting height. Between two equilibria the solution moves toward the stable one and approaches it as $x \\to \\infty$. For $\\frac{dy}{dx} = -y(y - 2)$ with $y(0) = \\frac{1}{2}$, slopes are positive between $0$ and $2$, so $y \\to 2$.\n\nCheck: at the start $g\\left(\\frac{1}{2}\\right) = -\\frac{1}{2}\\left(-\\frac{3}{2}\\right) = \\frac{3}{4} > 0$, so $y$ rises, and no equilibrium stops it before the row $y = 2$.\n\n> **Watch out.** A solution never crosses an equilibrium row; it only approaches one, so the limit is the nearest equilibrium in the direction it moves.",
        "在 $\\frac{dy}{dx} = g(y)$ 的斜率场中，从初始高度出发顺着线段走。在两个平衡解之间，解朝稳定的那个移动，并在 $x \\to \\infty$ 时趋于它。对 $\\frac{dy}{dx} = -y(y - 2)$，$y(0) = \\frac{1}{2}$，在 $0$ 与 $2$ 之间斜率为正，所以 $y \\to 2$。\n\n检验：起点处 $g\\left(\\frac{1}{2}\\right) = -\\frac{1}{2}\\left(-\\frac{3}{2}\\right) = \\frac{3}{4} > 0$，所以 $y$ 上升，在到达行 $y = 2$ 之前没有平衡解挡住它。\n\n> **注意。** 解永远不会越过平衡解所在的行，只会趋于它，所以极限是解运动方向上最近的平衡解。",
      ),
      generate(rng) {
        const r = rng.nonZero(-2, 2);
        const lo = Math.min(0, r);
        const hi = Math.max(0, r);
        const s = rng.pick([-1, 1]);
        const field: Field = { tex: `${s < 0 ? "-" : ""}y(${linear(1, -r, "y")})`, f: (_, y) => s * y * (y - r) };
        // y(y − r) is negative between the roots; the stable root is hi when s < 0 and lo when s > 0.
        const stable = s < 0 ? hi : lo;
        const unstable = s < 0 ? lo : hi;
        const y0 = rng.pick(
          [lo + 0.5, hi - 0.5, stable + (stable === hi ? 1 : -1), stable + (stable === hi ? 2 : -2)].filter((v) => v !== unstable),
        );
        const start = Q.of(Math.round(y0 * 2), 2);
        const slope = Q.of(s)
          .mul(start)
          .mul(start.sub(Q.of(r)));
        const rising = slope.sign() > 0;
        return {
          ...worked(
            t(
              `The slope field shows $\\frac{dy}{dx} = ${field.tex}$. Find $\\lim_{x \\to \\infty} y(x)$ for the solution with $y(0) = ${start.toLatex()}$.`,
              `斜率场对应 $\\frac{dy}{dx} = ${field.tex}$。对满足 $y(0) = ${start.toLatex()}$ 的解，求 $\\lim_{x \\to \\infty} y(x)$。`,
            ),
            stable,
            [
              step(
                "Find the equilibria",
                "找出平衡解",
                t(`The rows of horizontal segments are where the right side is $0$:`, `整行水平线段位于右边为 $0$ 的地方：`),
                `${field.tex} = 0 \\quad\\Rightarrow\\quad y = ${lo}, \\quad y = ${hi}`,
              ),
              step(
                "Follow the segments",
                "顺着线段走",
                t(
                  `From height $${start.toLatex()}$ the segments point ${rising ? "up" : "down"}, so the solution ${rising ? "rises" : "falls"} toward $y = ${stable}$ and levels off there.`,
                  `从高度 $${start.toLatex()}$ 出发，线段指向${rising ? "上方" : "下方"}，所以解${rising ? "上升" : "下降"}趋于 $y = ${stable}$，并在那里趋于平稳。`,
                ),
              ),
            ],
            t(
              `Substitute the start: $\\frac{dy}{dx} = ${slope.toLatex()}$ at $y = ${start.toLatex()}$, which is ${rising ? "positive" : "negative"}, and there is no equilibrium between $${start.toLatex()}$ and $${stable}$, so the solution approaches $${stable}$.`,
              `代入起点：在 $y = ${start.toLatex()}$ 处 $\\frac{dy}{dx} = ${slope.toLatex()}$，${rising ? "为正" : "为负"}，而 $${start.toLatex()}$ 与 $${stable}$ 之间没有平衡解，所以解趋于 $${stable}$。`,
            ),
            [
              slip(unstable, "This equilibrium is unstable: solutions near it move away", "这个平衡解是不稳定的：附近的解会远离它"),
              slip(
                start,
                "This is the starting value; the slope there is not $0$, so the solution moves",
                "这是初始值；那里的斜率不为 $0$，所以解会移动",
              ),
              slip(
                -stable,
                "The sign is reversed: the flat row the solution approaches has the opposite sign",
                "符号反了：解所趋近的那一行是它的相反数",
              ),
            ],
          ),
          figure: slopeField(field),
        };
      },
    },
    {
      id: "equilibria-from-a-field",
      title: t("Equilibria from the field", "从斜率场读出平衡解"),
      explanation: t(
        "A row of horizontal segments at height $c$ is an equilibrium solution $y = c$. It is stable when the segments just above point down and those just below point up. For $\\frac{dy}{dx} = (y + 1)(y - 2)$ the rows $y = -1$ and $y = 2$ are flat; the slopes are negative between them and positive outside, so solutions move toward $y = -1$.\n\nCheck: $g(y) = y^{2} - y - 2$ has $g'(y) = 2y - 1$; $g'(-1) = -3 < 0$, stable, and $g'(2) = 3 > 0$, unstable.\n\n> **Watch out.** Stable means nearby solutions come back: just above the row the slopes must be negative. Slopes pointing away on both sides mean the equilibrium is unstable.",
        "在高度 $c$ 处整行水平的线段就是平衡解 $y = c$。若其稍上方的线段向下指、稍下方的线段向上指，它就是稳定的。对 $\\frac{dy}{dx} = (y + 1)(y - 2)$，行 $y = -1$ 与 $y = 2$ 是平的；两者之间斜率为负，外侧为正，所以解朝 $y = -1$ 移动。\n\n检验：$g(y) = y^{2} - y - 2$，$g'(y) = 2y - 1$；$g'(-1) = -3 < 0$，稳定；$g'(2) = 3 > 0$，不稳定。\n\n> **注意。** 稳定意味着附近的解会回来：在该行稍上方斜率必须为负。若两侧的线段都指离该行，平衡解就是不稳定的。",
      ),
      generate(rng) {
        const a = rng.int(-3, 2);
        const b = rng.int(a + 1, 3);
        const s = rng.pick([-1, 1]);
        const field: Field = {
          tex: `${s < 0 ? "-" : ""}${factors(a, b)}`,
          f: (_, y) => s * (y - a) * (y - b),
        };
        const stable = s > 0 ? a : b;
        const other = s > 0 ? b : a;
        const g0 = field.f(0, 0);
        return {
          ...worked(
            t(
              `The slope field shows $\\frac{dy}{dx} = ${field.tex}$. Find the stable equilibrium solution $y = c$; give $c$.`,
              `斜率场对应 $\\frac{dy}{dx} = ${field.tex}$。求稳定的平衡解 $y = c$，写出 $c$。`,
            ),
            stable,
            [
              step(
                "Find the flat rows",
                "找出平的行",
                t("The right side is $0$ at the roots:", "右边在两个根处为 $0$："),
                `${field.tex} = 0 \\quad\\Rightarrow\\quad y = ${a}, \\quad y = ${b}`,
              ),
              step(
                "Read the slopes around them",
                "看它们周围的斜率",
                t(
                  `Between the rows the slopes are ${s > 0 ? "negative" : "positive"}, and outside they are ${s > 0 ? "positive" : "negative"}, so solutions on both sides move toward $y = ${stable}$: it is the stable equilibrium.`,
                  `两行之间斜率${s > 0 ? "为负" : "为正"}，外侧${s > 0 ? "为正" : "为负"}，所以两侧的解都朝 $y = ${stable}$ 移动：它是稳定平衡解。`,
                ),
              ),
            ],
            t(
              `Use the derivative test: $g'(y) = ${s < 0 ? `-(${linear(2, -(a + b), "y")})` : linear(2, -(a + b), "y")}$, so $g'(${stable}) = ${s * (2 * stable - a - b)} < 0$, stable, while $g'(${other}) = ${s * (2 * other - a - b)} > 0$, unstable.`,
              `用导数判别：$g'(y) = ${s < 0 ? `-(${linear(2, -(a + b), "y")})` : linear(2, -(a + b), "y")}$，所以 $g'(${stable}) = ${s * (2 * stable - a - b)} < 0$，稳定；而 $g'(${other}) = ${s * (2 * other - a - b)} > 0$，不稳定。`,
            ),
            [
              slip(
                other,
                "This equilibrium is unstable: the segments on both sides point away from it",
                "这个平衡解不稳定：两侧的线段都指离它",
              ),
              slip(
                -stable,
                "The sign is reversed: read the root from the factor, $y - c = 0$ gives $y = c$",
                "符号反了：由因式读根时，$y - c = 0$ 给出 $y = c$",
              ),
              slip(
                0,
                `At height $0$ the slope is $${g0}$, not $0$, so $y = 0$ is not an equilibrium`,
                `在高度 $0$ 处斜率为 $${g0}$，不为 $0$，所以 $y = 0$ 不是平衡解`,
              ),
            ],
          ),
          figure: slopeField(field),
        };
      },
    },
  ],
};

/** analyzingSlopeFieldsForNonautonomousDifferentialEquations finds isoclines and straight-line solutions. */
export const analyzingSlopeFieldsForNonautonomousDifferentialEquations: TopicDef = {
  id: "analyzing-slope-fields-for-nonautonomous-differential-equations",
  title: t("Analyzing Slope Fields for Nonautonomous Differential Equations", "分析非自治微分方程的斜率场"),
  summary: t(
    "Isoclines f(x, y) = m collect points of equal slope; a line whose slope equals its isocline value is itself a solution.",
    "等斜线 f(x, y) = m 汇集了斜率相同的点；若一条直线的斜率等于它所在等斜线的斜率值，它本身就是解。",
  ),
  intro: t(
    "For $\\frac{dy}{dx} = x - y$ the slope is $0$ along the line $y = x$, where solutions have horizontal tangents. Along the line $y = x - 1$ the slope is\n\n$$x - (x - 1) = 1,$$\n\nwhich is the slope of that line itself, so the line runs along its own segments: $y = x - 1$ is a solution.\n\nCheck: substitute $y = x - 1$: the left side is $y' = 1$ and the right side is $x - (x - 1) = 1$, for every $x$.\n\nIn this lesson we find the line of zero slope of a field and the straight lines that are solutions.",
    "对 $\\frac{dy}{dx} = x - y$，斜率沿直线 $y = x$ 为 $0$，解在那里有水平切线。沿直线 $y = x - 1$，斜率为\n\n$$x - (x - 1) = 1$$\n\n正好是这条直线自身的斜率，所以这条直线顺着自己的线段走：$y = x - 1$ 是一个解。\n\n检验：代入 $y = x - 1$：左边 $y' = 1$，右边 $x - (x - 1) = 1$，对每个 $x$ 都成立。\n\n本课我们求斜率场中斜率为零的直线，以及本身就是解的直线。",
  ),
  prerequisites: ["slope-fields-for-nonautonomous-differential-equations", "analyzing-slope-fields-for-autonomous-differential-equations"],
  encompasses: [{ topic: "slope-fields-for-nonautonomous-differential-equations", weight: 0.4 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "the-zero-slope-isocline",
      figure: calculusDrawings5["analyzing-slope-fields-for-nonautonomous-differential-equations#the-zero-slope-isocline"],
      title: t("Where the slope is zero", "斜率为零的位置"),
      explanation: t(
        "An **isocline** is a curve along which $f(x, y)$ is constant, so all its segments are parallel. For $\\frac{dy}{dx} = 2x - y + 1$, the slope is $0$ along $y = 2x + 1$, where solutions have horizontal tangents.\n\nCheck: the point $(1, 3)$ is on $y = 2x + 1$, and $2(1) - 3 + 1 = 0$.\n\n> **Watch out.** The zero isocline is where solutions are flat; it is usually not a solution itself, since the line $y = 2x + 1$ has slope $2$, not $0$.",
        "**等斜线**是 $f(x, y)$ 保持常数的曲线，其上的线段都互相平行。对 $\\frac{dy}{dx} = 2x - y + 1$，斜率在 $y = 2x + 1$ 上为 $0$，解在那里有水平切线。\n\n检验：点 $(1, 3)$ 在 $y = 2x + 1$ 上，且 $2(1) - 3 + 1 = 0$。\n\n> **注意。** 零斜率等斜线是解变平的地方；它本身通常不是解，因为直线 $y = 2x + 1$ 的斜率是 $2$，不是 $0$。",
      ),
      generate(rng) {
        const a = rng.nonZero(-2, 2);
        const b = rng.pick([-1, 1]);
        const c = rng.int(-2, 2);
        const field = lin(a, b, c);
        // ax + by + c = 0 ⇔ y = −(ax + c)/b
        const m = -a / b;
        const d = -c / b + 0;
        return {
          ...worked(
            t(
              `In the slope field of $\\frac{dy}{dx} = ${field.tex}$, the segments are horizontal along a line $y = mx + d$. Find $d$.`,
              `在 $\\frac{dy}{dx} = ${field.tex}$ 的斜率场中，线段在直线 $y = mx + d$ 上是水平的。求 $d$。`,
            ),
            d,
            [
              step("Set the slope to zero", "令斜率为零", t("The segments are horizontal where", "线段水平的地方满足"), `${field.tex} = 0`),
              step("Solve for y", "解出 y", t("", ""), `y = ${linear(m, d)}, \\qquad d = ${d}`),
            ],
            t(
              `Take the point on the line at $x = 1$, which is $(1, ${m + d})$: the slope there is $${a} + ${neg(b)} \\cdot ${neg(m + d)} + ${neg(c)} = ${field.f(1, m + d)}$.`,
              `取直线上 $x = 1$ 的点 $(1, ${m + d})$：那里的斜率为 $${a} + ${neg(b)} \\cdot ${neg(m + d)} + ${neg(c)} = ${field.f(1, m + d)}$。`,
            ),
            [
              slip(
                c,
                "This is the constant of the right side; solve the equation for $y$ to get the line's intercept",
                "这是右边的常数；要把方程解出 $y$ 才得到直线的截距",
              ),
              slip(-d, "A sign slipped when moving terms across the equals sign", "移项时符号出错了"),
              slip(m, "This is the slope of the line, not its intercept", "这是直线的斜率，不是截距"),
            ],
          ),
          figure: slopeField(field),
        };
      },
    },
    {
      id: "straight-line-solutions",
      title: t("Straight-line solutions", "直线解"),
      explanation: t(
        "Try $y = mx + d$ in $\\frac{dy}{dx} = ax + by + c$: the left side is $m$ and the right side is $(a + bm)x + bd + c$. They agree for every $x$ when $a + bm = 0$ and $m = bd + c$. For $\\frac{dy}{dx} = x - y$: $m = 1$ and $1 = -d$, so $y = x - 1$ is a solution.\n\nCheck: on $y = x - 1$ at $x = 4$, the point is $(4, 3)$ and $\\frac{dy}{dx} = 4 - 3 = 1$, the line's own slope.\n\n> **Watch out.** Matching the $x$ terms fixes $m$, and matching the constants then fixes $d$. Setting the right side to $0$ instead finds the zero isocline, not a solution.",
        "把 $y = mx + d$ 代入 $\\frac{dy}{dx} = ax + by + c$：左边为 $m$，右边为 $(a + bm)x + bd + c$。当 $a + bm = 0$ 且 $m = bd + c$ 时两边对每个 $x$ 都相等。对 $\\frac{dy}{dx} = x - y$：$m = 1$，$1 = -d$，所以 $y = x - 1$ 是解。\n\n检验：在 $y = x - 1$ 上取 $x = 4$，点为 $(4, 3)$，$\\frac{dy}{dx} = 4 - 3 = 1$，正是直线自身的斜率。\n\n> **注意。** 比较 $x$ 项定出 $m$，再比较常数项定出 $d$。若令右边等于 $0$，求出的是零斜率等斜线，而不是解。",
      ),
      generate(rng) {
        const b = rng.pick([-1, 1]);
        const m = rng.nonZero(-2, 2);
        const a = -b * m;
        const c = rng.int(-3, 3);
        const d = (m - c) / b;
        const field = lin(a, b, c);
        const mx = m === 1 ? "x" : m === -1 ? "-x" : `${m}x`;
        return {
          ...worked(
            t(
              `The differential equation $\\frac{dy}{dx} = ${field.tex}$ has a solution of the form $y = ${mx} + d$. Find $d$.`,
              `微分方程 $\\frac{dy}{dx} = ${field.tex}$ 有形如 $y = ${mx} + d$ 的解。求 $d$。`,
            ),
            d,
            [
              step(
                "Substitute the line",
                "代入直线",
                t(`The left side is $y' = ${m}$. The right side is`, `左边为 $y' = ${m}$。右边为`),
                `${poly([a, "x"])} + ${neg(b)}(${mx} + d) + ${neg(c)} = ${poly([b, "d"], [c, ""])}`,
              ),
              step("Match the sides", "令两边相等", t("", ""), `${m} = ${poly([b, "d"], [c, ""])} \\quad\\Rightarrow\\quad d = ${d}`),
            ],
            t(
              `Substitute $y = ${linear(m, d)}$ back in at two points: at $x = 0$ the slope is $${field.f(0, d)}$ and at $x = 1$ it is $${field.f(1, m + d)}$, both equal to the line's slope $${m}$.`,
              `把 $y = ${linear(m, d)}$ 代回方程检查两个点：$x = 0$ 处斜率为 $${field.f(0, d)}$，$x = 1$ 处为 $${field.f(1, m + d)}$，都等于直线的斜率 $${m}$。`,
            ),
            [
              slip(-d, "A sign slipped when solving for $d$", "解 $d$ 时符号出错了"),
              slip(
                -c / b + 0,
                "Solving $bd + c = 0$ finds the zero isocline; the line's own slope is $m$, so $bd + c = m$",
                "解 $bd + c = 0$ 得到的是零斜率等斜线；直线自身的斜率是 $m$，所以应有 $bd + c = m$",
              ),
              slip(c, "This is the constant of the right side, not the line's intercept", "这是右边的常数，不是直线的截距"),
              slip(
                (m + c) / b + 0,
                "The constant $c$ was moved across without changing its sign: $bd = m - c$",
                "常数 $c$ 移项时没有变号：应有 $bd = m - c$",
              ),
            ],
          ),
          figure: slopeField(field),
        };
      },
    },
  ],
};

/** EulerField is a right side f(x, y) with rational arithmetic, for Euler's method. */
interface EulerField {
  readonly tex: string;
  readonly f: (x: Q, y: Q) => Q;
}

/** linearEuler builds the field ax + by + c. */
const linearEuler = (a: number, b: number, c: number): EulerField => ({
  tex: poly([a, "x"], [b, "y"], [c, ""]),
  f: (x, y) =>
    x
      .mul(Q.of(a))
      .add(y.mul(Q.of(b)))
      .add(Q.of(c)),
});

/** nonlinearEuler picks a field with a product or a square. */
function nonlinearEuler(rng: Rng): EulerField {
  const k = rng.nonZero(-2, 2);
  const kind = rng.int(0, 2);
  if (kind === 0) return { tex: poly([k, "xy"]), f: (x, y) => x.mul(y).mul(Q.of(k)) };
  if (kind === 1) return { tex: poly([1, "x^{2}"], [k, "y"]), f: (x, y) => x.mul(x).add(y.mul(Q.of(k))) };
  return { tex: poly([k, "x"], [1, "y^{2}"]), f: (x, y) => x.mul(Q.of(k)).add(y.mul(y)) };
}

/** stepSizes are the step sizes h used with Euler's method. */
const stepSizes = [Q.of(1, 2), Q.of(1, 4), Q.of(1, 10), Q.of(1, 5), Q.one] as const;

/** eulerProblem asks for the estimate after n steps and explains each step. */
function eulerProblem(rng: Rng, field: EulerField, n: number) {
  const h = rng.pick(stepSizes);
  const x0 = Q.of(rng.int(-2, 2));
  const y0 = Q.of(rng.int(-3, 3));
  const rows: { x: Q; y: Q; m: Q }[] = [];
  let x = x0;
  let y = y0;
  for (let i = 0; i < n; i++) {
    const m = field.f(x, y);
    rows.push({ x, y, m });
    y = y.add(h.mul(m));
    x = x.add(h);
  }
  const first = rows[0]!;
  const end = x;
  const slopeLine = (r: { x: Q; y: Q; m: Q }) => `f\\left(${r.x.toLatex()}, ${r.y.toLatex()}\\right) = ${r.m.toLatex()}`;
  const moveLine = (r: { x: Q; y: Q; m: Q }, i: number) =>
    `y_{${i + 1}} = ${r.y.toLatex()} + ${h.toLatex()} \\cdot ${neg(r.m)} = ${r.y.add(h.mul(r.m)).toLatex()}`;
  const parts: Step[] =
    n === 1
      ? [
          step(
            "Find the slope",
            "求斜率",
            t(`The slope of the solution at the starting point $(x_0, y_0)$ is`, `解在起点 $(x_0, y_0)$ 处的斜率为`),
            slopeLine(first),
          ),
          step(
            "Take the step",
            "前进一步",
            t(`Move $h = ${h.toLatex()}$ along the tangent line:`, `沿切线前进 $h = ${h.toLatex()}$：`),
            moveLine(first, 0),
          ),
        ]
      : rows.map((r, i) =>
          step(
            ["First move", "Second move", "Third move"][i] ?? "Next move",
            ["第一次前进", "第二次前进", "第三次前进"][i] ?? "再前进",
            t(
              `At $(x_{${i}}, y_{${i}}) = \\left(${r.x.toLatex()}, ${r.y.toLatex()}\\right)$ find the slope, then move $h$ along it:`,
              `在 $(x_{${i}}, y_{${i}}) = \\left(${r.x.toLatex()}, ${r.y.toLatex()}\\right)$ 处求斜率，再沿它前进 $h$：`,
            ),
            slopeLine(r),
            moveLine(r, i),
          ),
        );
  const sum = rows.map((r) => neg(r.m)).join(" + ");
  const check =
    n === 1
      ? t(
          `The rise over the run is the slope at the start: $\\frac{${y.toLatex()} - ${neg(y0)}}{${h.toLatex()}} = ${first.m.toLatex()}$.`,
          `升高除以前进量等于起点处的斜率：$\\frac{${y.toLatex()} - ${neg(y0)}}{${h.toLatex()}} = ${first.m.toLatex()}$。`,
        )
      : t(
          `The total rise is $h$ times the sum of the slopes used: $${y0.toLatex()} + ${h.toLatex()}\\left(${sum}\\right) = ${y.toLatex()}$.`,
          `总的升高等于 $h$ 乘以所用斜率之和：$${y0.toLatex()} + ${h.toLatex()}\\left(${sum}\\right) = ${y.toLatex()}$。`,
        );
  return worked(
    t(
      `Use Euler's method with step size $h = ${h.toLatex()}$ to estimate $y\\left(${end.toLatex()}\\right)$, where $\\frac{dy}{dx} = ${field.tex}$ and $y\\left(${x0.toLatex()}\\right) = ${y0.toLatex()}$.`,
      `用步长 $h = ${h.toLatex()}$ 的欧拉法估计 $y\\left(${end.toLatex()}\\right)$，其中 $\\frac{dy}{dx} = ${field.tex}$，$y\\left(${x0.toLatex()}\\right) = ${y0.toLatex()}$。`,
    ),
    y,
    parts,
    check,
    [
      slip(
        y0.add(Q.of(n).mul(h).mul(first.m)),
        "This reuses the first slope for every step; recompute the slope at each new point",
        "这在每一步都沿用了第一个斜率；每到一个新点都要重新计算斜率",
      ),
      slip(
        y.sub(y0),
        "This is only the change in $y$; add it to the starting value $y_0$",
        "这只是 $y$ 的变化量；要把它加到初始值 $y_0$ 上",
      ),
      n === 1
        ? slip(
            y0.add(first.m),
            `This adds the slope itself; multiply it by $h = ${h.toLatex()}$ first`,
            `这直接加上了斜率；要先乘以 $h = ${h.toLatex()}$`,
          )
        : slip(
            y0.add(Q.of(n).mul(first.m)),
            "This moves by the first slope at every step without multiplying it by $h$",
            "这在每一步都按第一个斜率移动，且没有乘以 $h$",
          ),
      slip(
        y0.sub(h.mul(first.m)),
        "This steps the wrong way: Euler's method adds $h f(x_0, y_0)$",
        "方向反了：欧拉法是加上 $h f(x_0, y_0)$",
      ),
    ],
  );
}

/** eulersMethodCalculatingOneStep follows the tangent line for one step. */
export const eulersMethodCalculatingOneStep: TopicDef = {
  id: "eulers-method-calculating-one-step",
  title: t("Euler's Method: Calculating One Step", "欧拉法：计算一步"),
  summary: t(
    "Euler's method follows the tangent line: y₁ = y₀ + h f(x₀, y₀) estimates y(x₀ + h).",
    "欧拉法沿切线前进：y₁ = y₀ + h f(x₀, y₀) 是 y(x₀ + h) 的估计值。",
  ),
  intro: t(
    "When an equation is hard to solve, we can still estimate its solution by following the slope field. For $\\frac{dy}{dx} = x + y$ with $y(0) = 1$, the slope at the start is $0 + 1 = 1$. Moving $h = \\frac{1}{10}$ along the tangent line:\n\n$$y\\left(\\tfrac{1}{10}\\right) \\approx y_1 = 1 + \\frac{1}{10} \\cdot 1 = \\frac{11}{10}.$$\n\nThe exact solution is $y = 2e^{x} - x - 1$, and $y\\left(\\frac{1}{10}\\right) \\approx 1.1103$, close to the estimate.\n\nCheck: the step rises $\\frac{11}{10} - 1 = \\frac{1}{10}$ over a run of $\\frac{1}{10}$, a slope of $1$, the slope at $(0, 1)$.\n\nIn this lesson we take one step of Euler's method, for linear and nonlinear equations.",
    "方程难以求解时，仍可以顺着斜率场估计它的解。对 $\\frac{dy}{dx} = x + y$，$y(0) = 1$，起点处斜率为 $0 + 1 = 1$。沿切线前进 $h = \\frac{1}{10}$：\n\n$$y\\left(\\tfrac{1}{10}\\right) \\approx y_1 = 1 + \\frac{1}{10} \\cdot 1 = \\frac{11}{10}$$\n\n精确解为 $y = 2e^{x} - x - 1$，$y\\left(\\frac{1}{10}\\right) \\approx 1.1103$，与估计值很接近。\n\n检验：这一步升高 $\\frac{11}{10} - 1 = \\frac{1}{10}$，前进 $\\frac{1}{10}$，斜率为 $1$，正是 $(0, 1)$ 处的斜率。\n\n本课我们对线性方程和非线性方程计算欧拉法的一步。",
  ),
  prerequisites: [
    "slope-fields-for-nonautonomous-differential-equations",
    "approximating-functions-using-local-linearity-and-linearization",
  ],
  encompasses: [{ topic: "approximating-functions-using-local-linearity-and-linearization", weight: 0.3 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "one-step-of-eulers-method",
      title: t("One step", "一步"),
      explanation: t(
        "Starting from the known point $(x_0, y_0)$, the solution's slope there is $f(x_0, y_0)$. Moving a small step $h$ along that tangent line gives\n\n$$y(x_0 + h) \\approx y_1 = y_0 + h f(x_0, y_0).$$\n\nFor $\\frac{dy}{dx} = x + 2y$ with $y(1) = 3$ and $h = \\frac{1}{2}$: the slope is $1 + 6 = 7$, so $y\\left(\\frac{3}{2}\\right) \\approx 3 + \\frac{1}{2} \\cdot 7 = \\frac{13}{2}$.\n\nCheck: the rise $\\frac{13}{2} - 3 = \\frac{7}{2}$ over the run $\\frac{1}{2}$ is $7$, the slope at the start.\n\n> **Watch out.** Use the slope at the starting point $(x_0, y_0)$, not at the point being estimated, and multiply it by $h$ before adding.",
        "从已知点 $(x_0, y_0)$ 出发，解在该处的斜率为 $f(x_0, y_0)$。沿这条切线前进一小步 $h$ 得\n\n$$y(x_0 + h) \\approx y_1 = y_0 + h f(x_0, y_0)$$\n\n对 $\\frac{dy}{dx} = x + 2y$，$y(1) = 3$，$h = \\frac{1}{2}$：斜率为 $1 + 6 = 7$，所以 $y\\left(\\frac{3}{2}\\right) \\approx 3 + \\frac{1}{2} \\cdot 7 = \\frac{13}{2}$。\n\n检验：升高 $\\frac{13}{2} - 3 = \\frac{7}{2}$ 除以前进量 $\\frac{1}{2}$ 得 $7$，正是起点处的斜率。\n\n> **注意。** 要用起点 $(x_0, y_0)$ 处的斜率，而不是待估计点处的斜率，并且先乘以 $h$ 再相加。",
      ),
      generate: (rng) => eulerProblem(rng, linearEuler(rng.nonZero(-3, 3), rng.nonZero(-3, 3), rng.int(-4, 4)), 1),
    },
    {
      id: "one-step-with-a-nonlinear-equation",
      title: t("One step with a nonlinear equation", "非线性方程的一步"),
      explanation: t(
        "The step is the same whatever $f$ is: evaluate the slope at the current point and move $h$ along it. For $\\frac{dy}{dx} = xy$ with $y(2) = 1$ and $h = \\frac{1}{10}$: the slope is $2 \\cdot 1 = 2$, so $y(2.1) \\approx 1 + \\frac{1}{10} \\cdot 2 = \\frac{6}{5}$.\n\nCheck: the rise $\\frac{6}{5} - 1 = \\frac{1}{5}$ over the run $\\frac{1}{10}$ is $2$, the slope at $(2, 1)$.\n\n> **Watch out.** Put both coordinates of the current point into $f$: for $xy$ at $(2, 1)$ the slope is $2 \\cdot 1$; $x$ is the current $x$, not $h$.",
        "无论 $f$ 是什么，步骤都一样：在当前点计算斜率，再沿它前进 $h$。对 $\\frac{dy}{dx} = xy$，$y(2) = 1$，$h = \\frac{1}{10}$：斜率为 $2 \\cdot 1 = 2$，所以 $y(2.1) \\approx 1 + \\frac{1}{10} \\cdot 2 = \\frac{6}{5}$。\n\n检验：升高 $\\frac{6}{5} - 1 = \\frac{1}{5}$ 除以前进量 $\\frac{1}{10}$ 得 $2$，正是 $(2, 1)$ 处的斜率。\n\n> **注意。** 要把当前点的两个坐标都代入 $f$：对 $xy$，在 $(2, 1)$ 处斜率为 $2 \\cdot 1$；其中 $x$ 是当前的 $x$，不是 $h$。",
      ),
      generate: (rng) => eulerProblem(rng, nonlinearEuler(rng), 1),
    },
  ],
};

/** eulersMethodCalculatingMultipleSteps repeats Euler steps to reach a farther point. */
export const eulersMethodCalculatingMultipleSteps: TopicDef = {
  id: "eulers-method-calculating-multiple-steps",
  title: t("Euler's Method: Calculating Multiple Steps", "欧拉法：计算多步"),
  summary: t(
    "Repeat yₖ₊₁ = yₖ + h f(xₖ, yₖ), recomputing the slope at each new point; smaller steps give better estimates.",
    "重复 yₖ₊₁ = yₖ + h f(xₖ, yₖ)，每到一个新点都重新计算斜率；步长越小，估计越准。",
  ),
  intro: t(
    "To reach farther, take several Euler steps, finding a new slope at each new point. For $\\frac{dy}{dx} = y$ with $y(0) = 1$ and $h = \\frac{1}{2}$:\n\n$$y_1 = 1 + \\frac{1}{2} \\cdot 1 = \\frac{3}{2}, \\qquad y_2 = \\frac{3}{2} + \\frac{1}{2} \\cdot \\frac{3}{2} = \\frac{9}{4} \\approx y(1).$$\n\nThe exact value is $e \\approx 2.718$; the estimate $2.25$ is low because the solution curves upward, away from each tangent line, and smaller steps bring the estimate closer.\n\nCheck: the total rise is $h$ times the sum of the slopes used: $1 + \\frac{1}{2}\\left(1 + \\frac{3}{2}\\right) = \\frac{9}{4}$.\n\nIn this lesson we carry Euler's method through two and three steps.",
    "要走得更远，就做几步欧拉法，每到一个新点都求新的斜率。对 $\\frac{dy}{dx} = y$，$y(0) = 1$，$h = \\frac{1}{2}$：\n\n$$y_1 = 1 + \\frac{1}{2} \\cdot 1 = \\frac{3}{2}, \\qquad y_2 = \\frac{3}{2} + \\frac{1}{2} \\cdot \\frac{3}{2} = \\frac{9}{4} \\approx y(1)$$\n\n精确值为 $e \\approx 2.718$；估计值 $2.25$ 偏小，因为解曲线向上弯，离开了每一条切线；步长越小，估计越接近。\n\n检验：总的升高等于 $h$ 乘以所用斜率之和：$1 + \\frac{1}{2}\\left(1 + \\frac{3}{2}\\right) = \\frac{9}{4}$。\n\n本课我们把欧拉法做到两步和三步。",
  ),
  prerequisites: ["eulers-method-calculating-one-step"],
  encompasses: [{ topic: "eulers-method-calculating-one-step", weight: 0.6 }],
  xp: 10,
  standards: [],
  knowledgePoints: [
    {
      id: "two-steps-of-eulers-method",
      title: t("Two steps", "两步"),
      explanation: t(
        "After the first step, the new point $(x_1, y_1)$ has its own slope $f(x_1, y_1)$: use it, not the old slope. For $\\frac{dy}{dx} = x + y$, $y(0) = 1$, $h = \\frac{1}{2}$: $y_1 = 1 + \\frac{1}{2} \\cdot 1 = \\frac{3}{2}$; then $f\\left(\\frac{1}{2}, \\frac{3}{2}\\right) = 2$, so $y_2 = \\frac{3}{2} + \\frac{1}{2} \\cdot 2 = \\frac{5}{2} \\approx y(1)$.\n\nCheck: the total rise is $h$ times the sum of the slopes: $1 + \\frac{1}{2}(1 + 2) = \\frac{5}{2}$.\n\n> **Watch out.** Recompute the slope at each new point; reusing the first slope just follows one long tangent line.",
        "第一步之后，新点 $(x_1, y_1)$ 有自己的斜率 $f(x_1, y_1)$：要用它，而不是旧的斜率。对 $\\frac{dy}{dx} = x + y$，$y(0) = 1$，$h = \\frac{1}{2}$：$y_1 = 1 + \\frac{1}{2} \\cdot 1 = \\frac{3}{2}$；然后 $f\\left(\\frac{1}{2}, \\frac{3}{2}\\right) = 2$，所以 $y_2 = \\frac{3}{2} + \\frac{1}{2} \\cdot 2 = \\frac{5}{2} \\approx y(1)$。\n\n检验：总的升高等于 $h$ 乘以斜率之和：$1 + \\frac{1}{2}(1 + 2) = \\frac{5}{2}$。\n\n> **注意。** 每到一个新点都要重新计算斜率；沿用第一个斜率只是沿一条长切线走。",
      ),
      generate: (rng) => eulerProblem(rng, linearEuler(rng.nonZero(-2, 2), rng.nonZero(-2, 2), rng.int(-3, 3)), 2),
    },
    {
      id: "three-steps-of-eulers-method",
      title: t("Three steps", "三步"),
      explanation: t(
        "Organize the work in a table of $x_k$, $y_k$ and the slope $f(x_k, y_k)$, filling one row per step. Each row's $y$ is the previous $y$ plus $h$ times the previous slope. For $\\frac{dy}{dx} = x + y$, $y(0) = 0$, $h = \\frac{1}{2}$: the slopes are $0$, $\\frac{1}{2}$ and $\\frac{5}{4}$, and the values are $y_1 = 0$, $y_2 = \\frac{1}{4}$, $y_3 = \\frac{1}{4} + \\frac{1}{2} \\cdot \\frac{5}{4} = \\frac{7}{8} \\approx y\\left(\\frac{3}{2}\\right)$.\n\nCheck: $0 + \\frac{1}{2}\\left(0 + \\frac{1}{2} + \\frac{5}{4}\\right) = \\frac{7}{8}$.\n\n> **Watch out.** Advance $x$ by $h$ in every row; each slope uses that row's $x$ as well as its $y$.",
        "把计算整理成一张表，列出 $x_k$、$y_k$ 和斜率 $f(x_k, y_k)$，每一步填一行。每行的 $y$ 等于上一行的 $y$ 加上 $h$ 乘以上一行的斜率。对 $\\frac{dy}{dx} = x + y$，$y(0) = 0$，$h = \\frac{1}{2}$：各斜率为 $0$、$\\frac{1}{2}$、$\\frac{5}{4}$，各值为 $y_1 = 0$，$y_2 = \\frac{1}{4}$，$y_3 = \\frac{1}{4} + \\frac{1}{2} \\cdot \\frac{5}{4} = \\frac{7}{8} \\approx y\\left(\\frac{3}{2}\\right)$。\n\n检验：$0 + \\frac{1}{2}\\left(0 + \\frac{1}{2} + \\frac{5}{4}\\right) = \\frac{7}{8}$。\n\n> **注意。** 每一行都要把 $x$ 增加 $h$；每个斜率既用该行的 $y$，也用该行的 $x$。",
      ),
      generate: (rng) => eulerProblem(rng, linearEuler(rng.nonZero(-2, 2), rng.pick([-1, 1]), rng.int(-3, 3)), 3),
    },
  ],
};

/** calculusIIDifferentialEquationTopics are the topics of Calculus II unit 5. */
export const calculusIIDifferentialEquationTopics: readonly TopicDef[] = [
  introductionToDifferentialEquations,
  verifyingSolutionsOfDifferentialEquations,
  solvingFirstOrderOdesUsingDirectIntegration,
  solvingFirstOrderOdesUsingSeparationOfVariables,
  solvingFirstOrderIvpsUsingSeparationOfVariables,
  modelingWithFirstOrderOdes,
  furtherModelingWithFirstOrderOdes,
  qualitativeAnalysisOfFirstOrderOdes,
  equilibriumSolutionsOfFirstOrderOdes,
  exponentialGrowthAndDecayModelsWithFirstOrderOdes,
  exponentialGrowthAndDecayModelsWithFirstOrderOdesCalculatingUnknownTimesAndInitialValues,
  exponentialGrowthAndDecayModelsWithFirstOrderOdesHalfLifeProblems,
  logisticGrowthModelsWithFirstOrderOdes,
  qualitativeAnalysisOfTheLogisticGrowthEquation,
  solvingTheLogisticGrowthEquation,
  slopeFieldsForDirectlyIntegrableDifferentialEquations,
  slopeFieldsForAutonomousDifferentialEquations,
  slopeFieldsForNonautonomousDifferentialEquations,
  analyzingSlopeFieldsForDirectlyIntegrableDifferentialEquations,
  analyzingSlopeFieldsForAutonomousDifferentialEquations,
  analyzingSlopeFieldsForNonautonomousDifferentialEquations,
  eulersMethodCalculatingOneStep,
  eulersMethodCalculatingMultipleSteps,
];
