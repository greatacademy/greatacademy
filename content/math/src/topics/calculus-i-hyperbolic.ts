import type { Rng, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { plane, poly, Q } from "@ga/subject-math";

import { functionProblem, numberProblem } from "../problems.ts";
import { oneOf, range, sqrtLatex } from "./calculus-common.ts";

// Calculus I unit 1: Preliminaries, module 1.1 (The Hyperbolic Functions).

/** triples are Pythagorean triples (a, b, c) with a² + b² = c², used for exact hyperbolic values. */
const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [9, 40, 41],
  [12, 35, 37],
  [11, 60, 61],
];

/** sinhLn is sinh(ln k) = (k − 1/k)/2. */
const sinhLn = (k: Q) => k.sub(Q.one.div(k)).div(Q.of(2));
/** coshLn is cosh(ln k) = (k + 1/k)/2. */
const coshLn = (k: Q) => k.add(Q.one.div(k)).div(Q.of(2));
/** tanhLn is tanh(ln k) = (k² − 1)/(k² + 1). */
const tanhLn = (k: Q) => k.mul(k).sub(Q.one).div(k.mul(k).add(Q.one));

/** shift writes "+ k" or "- |k|" after a term, or nothing for 0. */
const shift = (k: number) => (k === 0 ? "" : k > 0 ? ` + ${k}` : ` - ${-k}`);

/** lnArg writes the argument ln k with a sign in one of three forms. */
function lnArg(k: number, negative: boolean, form: number): string {
  if (!negative) return `\\ln ${k}`;
  return form === 0 ? `-\\ln ${k}` : `\\ln \\frac{1}{${k}}`;
}

/** HyperbolicGraph is a hyperbolic function drawn for identification. */
interface HyperbolicGraph {
  readonly name: string;
  readonly f: (x: number) => number;
}

const basicGraphs: readonly HyperbolicGraph[] = [
  { name: "\\sinh x", f: Math.sinh },
  { name: "\\cosh x", f: Math.cosh },
  { name: "\\tanh x", f: Math.tanh },
];

const reciprocalGraphs: readonly HyperbolicGraph[] = [
  { name: "\\operatorname{sech} x", f: (x) => 1 / Math.cosh(x) },
  { name: "\\operatorname{csch} x", f: (x) => 1 / Math.sinh(x) },
  { name: "\\coth x", f: (x) => 1 / Math.tanh(x) },
];

/** graphChoice asks which equation a drawn hyperbolic graph has. */
function graphChoice(rng: Rng, graphs: readonly HyperbolicGraph[]) {
  const g = rng.pick(graphs);
  const s = rng.pick([1, -1] as const);
  const k = rng.int(-2, 2);
  const label = (h: HyperbolicGraph, sign: number) => same(`$y = ${sign < 0 ? "-" : ""}${h.name}${shift(k)}$`);
  const others = graphs.filter((h) => h !== g);
  const figure = {
    svg: plane({ xMin: -4, xMax: 4, yMin: -5, yMax: 5 }, [{ kind: "curve", f: (x) => s * g.f(x) + k, accent: true }]),
    alt: t("The graph of a hyperbolic function.", "一个双曲函数的图像。"),
  };
  return oneOf(
    rng,
    t("Which equation does the graph show?", "图中是哪个方程的图像？"),
    label(g, s),
    [label(g, -s), label(others[0]!, s), label(others[1]!, s), label(others[0]!, -s)],
    t(
      `The shape is that of $y = ${g.name}$${s < 0 ? ", reflected in the $x$-axis" : ""}, and the graph is ${k === 0 ? "not shifted vertically" : `shifted ${Math.abs(k)} ${k > 0 ? "up" : "down"}`}: $y = ${s < 0 ? "-" : ""}${g.name}${shift(k)}$.`,
      `图像形状是 $y = ${g.name}$${s < 0 ? "关于 $x$ 轴的反射" : ""}，${k === 0 ? "没有竖直平移" : `向${k > 0 ? "上" : "下"}平移 ${Math.abs(k)} 个单位`}：$y = ${s < 0 ? "-" : ""}${g.name}${shift(k)}$。`,
    ),
    figure,
  );
}

/** theHyperbolicFunctions defines sinh, cosh and tanh and evaluates them. */
export const theHyperbolicFunctions: TopicDef = {
  id: "the-hyperbolic-functions",
  title: t("The Hyperbolic Functions", "双曲函数"),
  summary: t(
    "Define the hyperbolic sine, cosine and tangent from the exponential function, evaluate them at logarithms, and use the identity cosh²x − sinh²x = 1.",
    "用指数函数定义双曲正弦、双曲余弦和双曲正切，在对数处求值，并使用恒等式 cosh²x − sinh²x = 1。",
  ),
  prerequisites: ["natural-logarithm"],
  encompasses: [{ topic: "natural-logarithm", weight: 0.2 }],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-sinh-and-cosh",
      title: t("Evaluating sinh and cosh", "计算 sinh 与 cosh"),
      explanation: t(
        "The hyperbolic functions are built from exponentials, so to evaluate one at a logarithm, substitute and use the fact that the exponential undoes the logarithm. The **hyperbolic sine** and **hyperbolic cosine** are\n\n$$\\sinh x = \\frac{e^{x} - e^{-x}}{2}, \\qquad \\cosh x = \\frac{e^{x} + e^{-x}}{2}.$$\n\n$\\sinh$ is odd and $\\cosh$ is even. At $x = \\ln k$, $e^{x} = k$ and $e^{-x} = \\frac{1}{k}$:\n\n$$\\sinh(\\ln 3) = \\frac{3 - \\frac{1}{3}}{2} = \\frac{4}{3}, \\qquad \\cosh(\\ln 3) = \\frac{3 + \\frac{1}{3}}{2} = \\frac{5}{3}.$$",
        "双曲函数由指数函数构成，所以在对数处求值时，代入后利用指数函数与对数互逆这一事实化简。**双曲正弦**和**双曲余弦**定义为\n\n$$\\sinh x = \\frac{e^{x} - e^{-x}}{2}, \\qquad \\cosh x = \\frac{e^{x} + e^{-x}}{2}.$$\n\n$\\sinh$ 是奇函数，$\\cosh$ 是偶函数。在 $x = \\ln k$ 处，$e^{x} = k$，$e^{-x} = \\frac{1}{k}$：\n\n$$\\sinh(\\ln 3) = \\frac{3 - \\frac{1}{3}}{2} = \\frac{4}{3}, \\qquad \\cosh(\\ln 3) = \\frac{3 + \\frac{1}{3}}{2} = \\frac{5}{3}.$$",
      ),
      keyPrerequisites: ["natural-logarithm"],
      generate(rng) {
        const k = rng.int(2, 9);
        const negative = rng.bool();
        const isSinh = rng.bool();
        const kq = Q.of(negative ? 1 : k, negative ? k : 1);
        const answer = isSinh ? sinhLn(kq) : coshLn(kq);
        const arg = lnArg(k, negative, rng.int(0, 1));
        const name = isSinh ? "\\sinh" : "\\cosh";
        const ex = `e^{${arg}} = ${kq.toLatex()}`;
        return numberProblem({
          prompt: t(`Find the exact value of $${name}(${arg})$.`, `求 $${name}(${arg})$ 的精确值。`),
          answer,
          wrong: [isSinh ? coshLn(kq) : sinhLn(kq), answer.mul(Q.of(2)), answer.neg()],
          solution: t(
            `Since $${ex}$, $$${name}(${arg}) = \\frac{${kq.toLatex()} ${isSinh ? "-" : "+"} ${Q.one.div(kq).toLatex()}}{2} = ${answer.toLatex()}.$$`,
            `因为 $${ex}$，$$${name}(${arg}) = \\frac{${kq.toLatex()} ${isSinh ? "-" : "+"} ${Q.one.div(kq).toLatex()}}{2} = ${answer.toLatex()}.$$`,
          ),
        });
      },
    },
    {
      id: "evaluating-tanh",
      title: t("Evaluating tanh", "计算 tanh"),
      explanation: t(
        "The hyperbolic tangent is the ratio of the hyperbolic sine to the hyperbolic cosine, and its values always lie strictly between minus one and one. The **hyperbolic tangent** is\n\n$$\\tanh x = \\frac{\\sinh x}{\\cosh x} = \\frac{e^{x} - e^{-x}}{e^{x} + e^{-x}}.$$\n\nIt is odd. At $x = \\ln k$, multiply the top and bottom by $k$:\n\n$$\\tanh(\\ln 2) = \\frac{2 - \\frac{1}{2}}{2 + \\frac{1}{2}} = \\frac{4 - 1}{4 + 1} = \\frac{3}{5}.$$",
        "双曲正切是双曲正弦与双曲余弦之比，它的值总是严格介于 −1 和 1 之间。**双曲正切**定义为\n\n$$\\tanh x = \\frac{\\sinh x}{\\cosh x} = \\frac{e^{x} - e^{-x}}{e^{x} + e^{-x}}.$$\n\n它是奇函数。在 $x = \\ln k$ 处，分子分母同乘 $k$：\n\n$$\\tanh(\\ln 2) = \\frac{2 - \\frac{1}{2}}{2 + \\frac{1}{2}} = \\frac{4 - 1}{4 + 1} = \\frac{3}{5}.$$",
      ),
      generate(rng) {
        const k = rng.int(2, 12);
        const negative = rng.bool(0.6);
        const form = rng.int(0, 1);
        const kq = Q.of(negative ? 1 : k, negative ? k : 1);
        const answer = tanhLn(kq);
        const arg = lnArg(k, negative, form);
        const k2 = k * k;
        return numberProblem({
          prompt: t(`Find the exact value of $\\tanh(${arg})$.`, `求 $\\tanh(${arg})$ 的精确值。`),
          answer,
          wrong: [answer.neg(), Q.of(k2 + 1, k2 - 1), Q.of(k - 1, k + 1)],
          solution: t(
            `$\\tanh(\\ln ${k}) = \\frac{${k2} - 1}{${k2} + 1} = ${Q.of(k2 - 1, k2 + 1).toLatex()}$${negative ? `, and $\\tanh$ is odd, so $\\tanh(${arg}) = ${answer.toLatex()}$` : ""}.`,
            `$\\tanh(\\ln ${k}) = \\frac{${k2} - 1}{${k2} + 1} = ${Q.of(k2 - 1, k2 + 1).toLatex()}$${negative ? `，而 $\\tanh$ 是奇函数，所以 $\\tanh(${arg}) = ${answer.toLatex()}$` : ""}。`,
          ),
        });
      },
    },
    {
      id: "the-hyperbolic-identity",
      title: t("The identity $\\cosh^2 x - \\sinh^2 x = 1$", "恒等式 $\\cosh^2 x - \\sinh^2 x = 1$"),
      explanation: t(
        "This identity plays the same role for hyperbolic functions that the Pythagorean identity plays for sine and cosine, but with a minus sign instead of a plus. Squaring the definitions and subtracting gives\n\n$$\\cosh^{2} x - \\sinh^{2} x = 1.$$\n\nSince $\\cosh x > 0$ always, $\\cosh x = \\sqrt{1 + \\sinh^{2} x}$. If $\\sinh x = \\frac{3}{4}$, then $\\cosh x = \\sqrt{1 + \\frac{9}{16}} = \\frac{5}{4}$ and $\\tanh x = \\frac{3/4}{5/4} = \\frac{3}{5}$.",
        "这个恒等式对双曲函数的作用，就像勾股恒等式对正弦和余弦的作用一样，只是把加号换成了减号。把定义平方后相减得\n\n$$\\cosh^{2} x - \\sinh^{2} x = 1.$$\n\n因为 $\\cosh x$ 恒为正，$\\cosh x = \\sqrt{1 + \\sinh^{2} x}$。若 $\\sinh x = \\frac{3}{4}$，则 $\\cosh x = \\sqrt{1 + \\frac{9}{16}} = \\frac{5}{4}$，$\\tanh x = \\frac{3/4}{5/4} = \\frac{3}{5}$。",
      ),
      generate(rng) {
        const [p, q, c] = rng.pick(triples);
        const [a, b] = rng.bool() ? [p, q] : [q, p];
        const s = rng.sign();
        const sinh = Q.of(s * a, b);
        const cosh = Q.of(c, b);
        const askTanh = rng.bool();
        const answer = askTanh ? sinh.div(cosh) : cosh;
        const name = askTanh ? "\\tanh" : "\\cosh";
        return numberProblem({
          prompt: t(`If $\\sinh x = ${sinh.toLatex()}$, find $${name} x$.`, `若 $\\sinh x = ${sinh.toLatex()}$，求 $${name} x$。`),
          answer,
          wrong: askTanh ? [answer.neg(), cosh.div(sinh), sinh.mul(cosh)] : [cosh.neg(), Q.of(b, c), Q.one.sub(sinh.mul(sinh))],
          solution: t(
            `$$\\cosh x = \\sqrt{1 + \\sinh^{2} x} = \\sqrt{1 + ${Q.of(a * a, b * b).toLatex()}} = \\sqrt{${Q.of(c * c, b * b).toLatex()}} = ${cosh.toLatex()}$$${askTanh ? `$$\\tanh x = \\frac{\\sinh x}{\\cosh x} = ${answer.toLatex()}$$` : ""}`,
            `$$\\cosh x = \\sqrt{1 + \\sinh^{2} x} = \\sqrt{1 + ${Q.of(a * a, b * b).toLatex()}} = \\sqrt{${Q.of(c * c, b * b).toLatex()}} = ${cosh.toLatex()}$$${askTanh ? `$$\\tanh x = \\frac{\\sinh x}{\\cosh x} = ${answer.toLatex()}$$` : ""}`,
          ),
        });
      },
    },
  ],
};

/** theReciprocalHyperbolicFunctions defines sech, csch and coth. */
export const theReciprocalHyperbolicFunctions: TopicDef = {
  id: "the-reciprocal-hyperbolic-functions",
  title: t("The Reciprocal Hyperbolic Functions", "倒数双曲函数"),
  summary: t(
    "Define the hyperbolic secant, cosecant and cotangent as reciprocals of cosh, sinh and tanh, and evaluate them.",
    "把双曲正割、双曲余割和双曲余切定义为 cosh、sinh 和 tanh 的倒数，并求值。",
  ),
  prerequisites: ["the-hyperbolic-functions"],
  encompasses: [{ topic: "the-hyperbolic-functions", weight: 0.4 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-the-reciprocal-hyperbolic-functions",
      title: t("Evaluating sech, csch and coth", "计算 sech、csch 与 coth"),
      explanation: t(
        "Each reciprocal hyperbolic function is one over a basic one, so evaluate the basic function first and then take its reciprocal. $$\\operatorname{sech} x = \\frac{1}{\\cosh x} = \\frac{2}{e^{x} + e^{-x}}, \\quad \\operatorname{csch} x = \\frac{1}{\\sinh x}, \\quad \\coth x = \\frac{\\cosh x}{\\sinh x}.$$\n\n$\\operatorname{sech}$ is even; $\\operatorname{csch}$ and $\\coth$ are odd and not defined at $0$. Since $\\cosh(\\ln 2) = \\frac{5}{4}$, $\\operatorname{sech}(\\ln 2) = \\frac{4}{5}$.",
        "每个倒数双曲函数都是某个基本双曲函数的倒数，所以先求出基本函数的值，再取倒数。$$\\operatorname{sech} x = \\frac{1}{\\cosh x} = \\frac{2}{e^{x} + e^{-x}}, \\quad \\operatorname{csch} x = \\frac{1}{\\sinh x}, \\quad \\coth x = \\frac{\\cosh x}{\\sinh x}.$$\n\n$\\operatorname{sech}$ 是偶函数；$\\operatorname{csch}$ 和 $\\coth$ 是奇函数，在 $0$ 处无定义。因为 $\\cosh(\\ln 2) = \\frac{5}{4}$，所以 $\\operatorname{sech}(\\ln 2) = \\frac{4}{5}$。",
      ),
      generate(rng) {
        const k = rng.int(2, 10);
        const negative = rng.bool();
        const kq = Q.of(negative ? 1 : k, negative ? k : 1);
        const which = rng.int(0, 2);
        const names = ["\\operatorname{sech}", "\\operatorname{csch}", "\\coth"];
        const base = [coshLn(kq), sinhLn(kq), tanhLn(kq)][which]!;
        const answer = Q.one.div(base);
        const arg = lnArg(k, negative, rng.int(0, 1));
        const baseName = ["\\cosh", "\\sinh", "\\tanh"][which]!;
        return numberProblem({
          prompt: t(`Find the exact value of $${names[which]}(${arg})$.`, `求 $${names[which]}(${arg})$ 的精确值。`),
          answer,
          wrong: [base, answer.neg(), Q.one.div([sinhLn(kq), coshLn(kq), coshLn(kq)][which]!)],
          solution: t(
            `$${baseName}(${arg}) = ${base.toLatex()}$, so $${names[which]}(${arg}) = ${answer.toLatex()}$.`,
            `$${baseName}(${arg}) = ${base.toLatex()}$，所以 $${names[which]}(${arg}) = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
    {
      id: "reciprocal-hyperbolic-functions-from-sinh",
      title: t("Reciprocal hyperbolic values from sinh", "由 sinh 求倒数双曲函数值"),
      explanation: t(
        "Knowing one hyperbolic value is enough to find all the others, because the hyperbolic identity gives the cosine and the rest are quotients and reciprocals. From $\\sinh x$, find $\\cosh x = \\sqrt{1 + \\sinh^{2} x}$, then take reciprocals. If $\\sinh x = \\frac{5}{12}$, then $\\cosh x = \\frac{13}{12}$, so\n\n$$\\operatorname{sech} x = \\frac{12}{13}, \\quad \\operatorname{csch} x = \\frac{12}{5}, \\quad \\coth x = \\frac{13}{5}.$$",
        "知道一个双曲函数值就足以求出所有其他值，因为双曲恒等式给出双曲余弦，其余都是商或倒数。由 $\\sinh x$ 先求 $\\cosh x = \\sqrt{1 + \\sinh^{2} x}$，再取倒数。若 $\\sinh x = \\frac{5}{12}$，则 $\\cosh x = \\frac{13}{12}$，所以\n\n$$\\operatorname{sech} x = \\frac{12}{13}, \\quad \\operatorname{csch} x = \\frac{12}{5}, \\quad \\coth x = \\frac{13}{5}.$$",
      ),
      generate(rng) {
        const [p, q, c] = rng.pick(triples);
        const [a, b] = rng.bool() ? [p, q] : [q, p];
        const s = rng.sign();
        const which = rng.int(0, 2);
        const names = ["\\operatorname{sech}", "\\operatorname{csch}", "\\coth"];
        const answer = [Q.of(b, c), Q.of(s * b, a), Q.of(s * c, a)][which]!;
        return numberProblem({
          prompt: t(
            `If $\\sinh x = ${Q.of(s * a, b).toLatex()}$, find $${names[which]} x$.`,
            `若 $\\sinh x = ${Q.of(s * a, b).toLatex()}$，求 $${names[which]} x$。`,
          ),
          answer,
          wrong: [Q.of(c, b), Q.of(s * a, c), answer.neg(), Q.of(s * a, b)],
          solution: t(
            `$\\cosh x = \\sqrt{1 + \\sinh^{2} x} = ${Q.of(c, b).toLatex()}$, so $${names[which]} x = ${answer.toLatex()}$.`,
            `$\\cosh x = \\sqrt{1 + \\sinh^{2} x} = ${Q.of(c, b).toLatex()}$，所以 $${names[which]} x = ${answer.toLatex()}$。`,
          ),
        });
      },
    },
  ],
};

/** solvingEquationsContainingHyperbolicFunctions solves sinh, cosh and tanh equations through e^x. */
export const solvingEquationsContainingHyperbolicFunctions: TopicDef = {
  id: "solving-equations-containing-hyperbolic-functions",
  title: t("Solving Equations Containing Hyperbolic Functions", "解含双曲函数的方程"),
  summary: t(
    "Solve equations in $\\sinh$, $\\cosh$ and $\\tanh$ by rewriting them as quadratic equations in $e^x$.",
    "把含 $\\sinh$、$\\cosh$、$\\tanh$ 的方程改写成关于 $e^x$ 的二次方程来求解。",
  ),
  prerequisites: ["the-hyperbolic-functions", "solving-equations-containing-the-exponential-function"],
  encompasses: [
    { topic: "the-hyperbolic-functions", weight: 0.4 },
    { topic: "solving-equations-containing-the-exponential-function", weight: 0.3 },
  ],
  xp: 16,
  standards: [],
  knowledgePoints: [
    {
      id: "solving-sinh-equations",
      title: t("Solving sinh x = c", "解 sinh x = c"),
      explanation: t(
        "To solve $\\sinh x = \\frac{4}{3}$, write it with $u = e^{x}$:\n\n$$\\frac{u - \\frac{1}{u}}{2} = \\frac{4}{3} \\;\\Rightarrow\\; 3u^{2} - 8u - 3 = 0 \\;\\Rightarrow\\; (3u + 1)(u - 3) = 0.$$\n\nSince $u = e^{x} > 0$, $u = 3$ and $x = \\ln 3$. There is always exactly one solution, because $\\sinh$ is increasing.",
        "解 $\\sinh x = \\frac{4}{3}$ 时，令 $u = e^{x}$：\n\n$$\\frac{u - \\frac{1}{u}}{2} = \\frac{4}{3} \\;\\Rightarrow\\; 3u^{2} - 8u - 3 = 0 \\;\\Rightarrow\\; (3u + 1)(u - 3) = 0.$$\n\n因为 $u = e^{x} > 0$，所以 $u = 3$，$x = \\ln 3$。由于 $\\sinh$ 单调递增，方程总是恰有一个解。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const s = rng.sign();
        const a = rng.int(1, 4);
        const kq = Q.of(k);
        const v = sinhLn(kq).mul(Q.of(s));
        const rhs = v.mul(Q.of(a));
        const answer = `${s < 0 ? "-" : ""}\\ln ${k}`;
        const lhs = `${a === 1 ? "" : a}\\sinh x`;
        return functionProblem({
          prompt: t(
            `Solve $${lhs} = ${rhs.toLatex()}$. Give the exact value of $x$.`,
            `解方程 $${lhs} = ${rhs.toLatex()}$，写出 $x$ 的精确值。`,
          ),
          answer,
          prefix: "x =",
          wrong: [`${s < 0 ? "" : "-"}\\ln ${k}`, `\\ln ${k * k}`, `\\ln ${2 * k}`],
          solution: t(
            `${a === 1 ? "" : `Divide by $${a}$: $\\sinh x = ${v.toLatex()}$. `}With $u = e^{x}$, $\\frac{u - 1/u}{2} = ${v.toLatex()}$, whose positive root is $u = ${s < 0 ? `\\frac{1}{${k}}` : k}$. So $x = ${answer}$.`,
            `${a === 1 ? "" : `两边除以 $${a}$：$\\sinh x = ${v.toLatex()}$。`}令 $u = e^{x}$，$\\frac{u - 1/u}{2} = ${v.toLatex()}$，其正根为 $u = ${s < 0 ? `\\frac{1}{${k}}` : k}$。所以 $x = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "solving-cosh-and-tanh-equations",
      title: t("Solving cosh x = c and tanh x = c", "解 cosh x = c 与 tanh x = c"),
      explanation: t(
        "$\\cosh x = c$ has two solutions $x = \\pm \\ln k$ when $c > 1$, since $\\cosh$ is even: from $\\frac{u + 1/u}{2} = \\frac{5}{4}$, $2u^{2} - 5u + 2 = 0$, so $u = 2$ or $u = \\frac{1}{2}$, and the positive solution is $\\ln 2$.\n\nFor $\\tanh x = c$ with $-1 < c < 1$, cross-multiply: $\\frac{u^{2} - 1}{u^{2} + 1} = c$ gives $u^{2} = \\frac{1 + c}{1 - c}$. With $c = \\frac{3}{5}$, $u^{2} = 4$, $u = 2$, $x = \\ln 2$.",
        "当 $c > 1$ 时，由于 $\\cosh$ 是偶函数，$\\cosh x = c$ 有两个解 $x = \\pm \\ln k$：由 $\\frac{u + 1/u}{2} = \\frac{5}{4}$ 得 $2u^{2} - 5u + 2 = 0$，所以 $u = 2$ 或 $u = \\frac{1}{2}$，正解为 $\\ln 2$。\n\n对于 $-1 < c < 1$ 的 $\\tanh x = c$，交叉相乘：$\\frac{u^{2} - 1}{u^{2} + 1} = c$ 得 $u^{2} = \\frac{1 + c}{1 - c}$。当 $c = \\frac{3}{5}$ 时，$u^{2} = 4$，$u = 2$，$x = \\ln 2$。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const isCosh = rng.bool();
        const a = rng.int(1, 3);
        const kq = Q.of(k);
        const v = isCosh ? coshLn(kq) : tanhLn(kq);
        const rhs = v.mul(Q.of(a));
        const lhs = `${a === 1 ? "" : a}\\${isCosh ? "cosh" : "tanh"} x`;
        return functionProblem({
          prompt: t(
            `Find the ${isCosh ? "positive " : ""}solution of $${lhs} = ${rhs.toLatex()}$. Give the exact value of $x$.`,
            `求方程 $${lhs} = ${rhs.toLatex()}$ 的${isCosh ? "正" : ""}解，写出 $x$ 的精确值。`,
          ),
          answer: `\\ln ${k}`,
          prefix: "x =",
          wrong: [`-\\ln ${k}`, `\\ln ${k * k}`, `\\ln ${2 * k}`, `\\frac{1}{2}\\ln ${k}`],
          solution: isCosh
            ? t(
                `${a === 1 ? "" : `Divide by $${a}$: $\\cosh x = ${v.toLatex()}$. `}With $u = e^{x}$, $\\frac{u + 1/u}{2} = ${v.toLatex()}$ has roots $u = ${k}$ and $u = \\frac{1}{${k}}$. The positive solution is $x = \\ln ${k}$.`,
                `${a === 1 ? "" : `两边除以 $${a}$：$\\cosh x = ${v.toLatex()}$。`}令 $u = e^{x}$，$\\frac{u + 1/u}{2} = ${v.toLatex()}$ 的根为 $u = ${k}$ 和 $u = \\frac{1}{${k}}$。正解为 $x = \\ln ${k}$。`,
              )
            : t(
                `${a === 1 ? "" : `Divide by $${a}$: $\\tanh x = ${v.toLatex()}$. `}Then $e^{2x} = \\frac{${poly([1, ""], [v, ""])}}{${poly([1, ""], [v.neg(), ""])}} = ${k * k}$, so $e^{x} = ${k}$ and $x = \\ln ${k}$.`,
                `${a === 1 ? "" : `两边除以 $${a}$：$\\tanh x = ${v.toLatex()}$。`}于是 $e^{2x} = \\frac{${poly([1, ""], [v, ""])}}{${poly([1, ""], [v.neg(), ""])}} = ${k * k}$，所以 $e^{x} = ${k}$，$x = \\ln ${k}$。`,
              ),
        });
      },
    },
  ],
};

/** graphsOfTheHyperbolicFunctions recognizes and describes the graphs of sinh, cosh and tanh. */
export const graphsOfTheHyperbolicFunctions: TopicDef = {
  id: "graphs-of-the-hyperbolic-functions",
  title: t("Graphs of the Hyperbolic Functions", "双曲函数的图像"),
  summary: t(
    "Recognize the graphs of sinh, cosh and tanh and their transformations, and read off their extreme values and asymptotes.",
    "识别 sinh、cosh、tanh 及其变换的图像，读出最值和渐近线。",
  ),
  prerequisites: ["the-hyperbolic-functions"],
  encompasses: [{ topic: "the-hyperbolic-functions", weight: 0.3 }],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-hyperbolic-graphs",
      title: t("Recognizing the graphs", "识别图像"),
      explanation: t(
        "- $y = \\sinh x$ is odd and increasing, passes through the origin and grows without bound in both directions.\n- $y = \\cosh x$ is even, U-shaped (a *catenary*), with minimum $1$ at $x = 0$.\n- $y = \\tanh x$ is odd and increasing, with horizontal asymptotes $y = -1$ and $y = 1$.\n\n$y = -f(x) + k$ reflects the graph in the $x$-axis and shifts it $k$ up.",
        "- $y = \\sinh x$ 是单调递增的奇函数，过原点，向两侧无界。\n- $y = \\cosh x$ 是偶函数，呈 U 形（**悬链线**），在 $x = 0$ 处取最小值 $1$。\n- $y = \\tanh x$ 是单调递增的奇函数，水平渐近线为 $y = -1$ 和 $y = 1$。\n\n$y = -f(x) + k$ 把图像关于 $x$ 轴反射，再向上平移 $k$。",
      ),
      generate(rng) {
        return graphChoice(rng, basicGraphs);
      },
    },
    {
      id: "extremes-and-asymptotes-of-hyperbolic-graphs",
      title: t("Extreme values and asymptotes", "最值与渐近线"),
      explanation: t(
        "For $y = a\\cosh(x - h) + k$, the vertex is at $(h, a + k)$: a minimum when $a > 0$, a maximum when $a < 0$.\n\nFor $y = a\\tanh(x - h) + k$, the horizontal asymptotes are $y = k - |a|$ and $y = k + |a|$.\n\nSo $y = 3\\tanh(x + 1) - 2$ has asymptotes $y = -5$ and $y = 1$.",
        "对于 $y = a\\cosh(x - h) + k$，顶点为 $(h, a + k)$：$a > 0$ 时为最小值，$a < 0$ 时为最大值。\n\n对于 $y = a\\tanh(x - h) + k$，水平渐近线为 $y = k - |a|$ 和 $y = k + |a|$。\n\n所以 $y = 3\\tanh(x + 1) - 2$ 的渐近线为 $y = -5$ 和 $y = 1$。",
      ),
      generate(rng) {
        const a = rng.pick([-4, -3, -2, -1, 2, 3, 4, 5]);
        const h = rng.int(-4, 4);
        const k = rng.int(-6, 6);
        const inner = h === 0 ? "x" : `(x ${h > 0 ? "-" : "+"} ${Math.abs(h)})`;
        const aL = a === 1 ? "" : a === -1 ? "-" : `${a}`;
        if (rng.bool()) {
          const kind = a > 0 ? t("minimum", "最小值") : t("maximum", "最大值");
          return numberProblem({
            prompt: t(
              `Find the ${kind.en} value of $y = ${aL}\\cosh ${inner}${shift(k)}$.`,
              `求 $y = ${aL}\\cosh ${inner}${shift(k)}$ 的${kind["zh-CN"]}。`,
            ),
            answer: a + k,
            wrong: [k, a, k - a, h],
            solution: t(
              `$\\cosh ${inner} \\ge 1$ with equality at $x = ${h}$, so the ${kind.en} is $${a} \\cdot 1 ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${a + k}$.`,
              `$\\cosh ${inner} \\ge 1$，在 $x = ${h}$ 处取等号，所以${kind["zh-CN"]}为 $${a} \\cdot 1 ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${a + k}$。`,
            ),
          });
        }
        const upper = rng.bool();
        const answer = upper ? k + Math.abs(a) : k - Math.abs(a);
        const which = upper ? t("upper", "上方的") : t("lower", "下方的");
        return numberProblem({
          prompt: t(
            `The graph of $y = ${aL}\\tanh ${inner}${shift(k)}$ has two horizontal asymptotes. The ${which.en} one is $y = c$. Find $c$.`,
            `$y = ${aL}\\tanh ${inner}${shift(k)}$ 的图像有两条水平渐近线，${which["zh-CN"]}一条是 $y = c$。求 $c$。`,
          ),
          answer,
          wrong: [upper ? k - Math.abs(a) : k + Math.abs(a), k, upper ? Math.abs(a) : -Math.abs(a), k + (upper ? 1 : -1)],
          solution: t(
            `$\\tanh$ takes values between $-1$ and $1$, so $y$ lies between $${k - Math.abs(a)}$ and $${k + Math.abs(a)}$: the ${which.en} asymptote is $y = ${answer}$.`,
            `$\\tanh$ 的值在 $-1$ 与 $1$ 之间，所以 $y$ 在 $${k - Math.abs(a)}$ 与 $${k + Math.abs(a)}$ 之间：${which["zh-CN"]}渐近线是 $y = ${answer}$。`,
          ),
        });
      },
    },
  ],
};

/** graphsOfTheReciprocalHyperbolicFunctions recognizes and describes the graphs of sech, csch and coth. */
export const graphsOfTheReciprocalHyperbolicFunctions: TopicDef = {
  id: "graphs-of-the-reciprocal-hyperbolic-functions",
  title: t("Graphs of the Reciprocal Hyperbolic Functions", "倒数双曲函数的图像"),
  summary: t(
    "Recognize the graphs of sech, csch and coth and their transformations, and find their asymptotes.",
    "识别 sech、csch、coth 及其变换的图像，求出渐近线。",
  ),
  prerequisites: ["graphs-of-the-hyperbolic-functions", "the-reciprocal-hyperbolic-functions"],
  encompasses: [
    { topic: "graphs-of-the-hyperbolic-functions", weight: 0.3 },
    { topic: "the-reciprocal-hyperbolic-functions", weight: 0.3 },
  ],
  xp: 12,
  standards: [],
  knowledgePoints: [
    {
      id: "recognizing-reciprocal-hyperbolic-graphs",
      title: t("Recognizing the graphs", "识别图像"),
      explanation: t(
        "- $y = \\operatorname{sech} x$ is an even bell shape with maximum $1$ at $x = 0$ and asymptote $y = 0$.\n- $y = \\operatorname{csch} x$ is odd, with a vertical asymptote $x = 0$ and horizontal asymptote $y = 0$.\n- $y = \\coth x$ is odd, with vertical asymptote $x = 0$ and horizontal asymptotes $y = \\pm 1$; its values satisfy $|y| > 1$.",
        "- $y = \\operatorname{sech} x$ 是偶函数，呈钟形，在 $x = 0$ 处取最大值 $1$，渐近线为 $y = 0$。\n- $y = \\operatorname{csch} x$ 是奇函数，竖直渐近线为 $x = 0$，水平渐近线为 $y = 0$。\n- $y = \\coth x$ 是奇函数，竖直渐近线为 $x = 0$，水平渐近线为 $y = \\pm 1$；其值满足 $|y| > 1$。",
      ),
      generate(rng) {
        return graphChoice(rng, reciprocalGraphs);
      },
    },
    {
      id: "asymptotes-of-reciprocal-hyperbolic-graphs",
      title: t("Asymptotes of the graphs", "图像的渐近线"),
      explanation: t(
        "Transformations move the asymptotes: $y = a\\coth(x - h) + k$ has vertical asymptote $x = h$ and horizontal asymptotes $y = k \\pm a$; $y = a\\operatorname{csch}(x - h) + k$ has $x = h$ and $y = k$; $y = a\\operatorname{sech}(x - h) + k$ has only $y = k$, and its extreme value $a + k$ at $x = h$.",
        "变换会移动渐近线：$y = a\\coth(x - h) + k$ 的竖直渐近线为 $x = h$，水平渐近线为 $y = k \\pm a$；$y = a\\operatorname{csch}(x - h) + k$ 的渐近线为 $x = h$ 和 $y = k$；$y = a\\operatorname{sech}(x - h) + k$ 只有 $y = k$，并在 $x = h$ 处取极值 $a + k$。",
      ),
      generate(rng) {
        const a = rng.pick([-3, -2, 2, 3, 4]);
        const h = rng.nonZero(-5, 5);
        const k = rng.nonZero(-5, 5);
        const inner = `(x ${h > 0 ? "-" : "+"} ${Math.abs(h)})`;
        const which = rng.int(0, 3);
        if (which === 0) {
          const fn = rng.pick(["\\coth", "\\operatorname{csch}"]);
          return numberProblem({
            prompt: t(
              `The graph of $y = ${a}${fn}${inner}${shift(k)}$ has a vertical asymptote $x = c$. Find $c$.`,
              `$y = ${a}${fn}${inner}${shift(k)}$ 的图像有竖直渐近线 $x = c$。求 $c$。`,
            ),
            answer: h,
            wrong: [-h, k, a],
            solution: t(`$${fn} u$ is not defined at $u = 0$, that is, at $x = ${h}$.`, `$${fn} u$ 在 $u = 0$ 处无定义，即 $x = ${h}$。`),
          });
        }
        if (which === 1) {
          const fn = rng.pick(["\\operatorname{sech}", "\\operatorname{csch}"]);
          return numberProblem({
            prompt: t(
              `The graph of $y = ${a}${fn}${inner}${shift(k)}$ has a horizontal asymptote $y = c$. Find $c$.`,
              `$y = ${a}${fn}${inner}${shift(k)}$ 的图像有水平渐近线 $y = c$。求 $c$。`,
            ),
            answer: k,
            wrong: [a + k, h, -k],
            solution: t(
              `$${fn} u \\to 0$ as $u \\to \\pm\\infty$, so $y \\to ${k}$.`,
              `当 $u \\to \\pm\\infty$ 时 $${fn} u \\to 0$，所以 $y \\to ${k}$。`,
            ),
          });
        }
        if (which === 2) {
          const kind = a > 0 ? t("maximum", "最大值") : t("minimum", "最小值");
          return numberProblem({
            prompt: t(
              `Find the ${kind.en} value of $y = ${a}\\operatorname{sech}${inner}${shift(k)}$.`,
              `求 $y = ${a}\\operatorname{sech}${inner}${shift(k)}$ 的${kind["zh-CN"]}。`,
            ),
            answer: a + k,
            wrong: [k, a, k - a],
            solution: t(
              `$0 < \\operatorname{sech} u \\le 1$ with $\\operatorname{sech} 0 = 1$, so the ${kind.en} is $${a} ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${a + k}$.`,
              `$0 < \\operatorname{sech} u \\le 1$，且 $\\operatorname{sech} 0 = 1$，所以${kind["zh-CN"]}为 $${a} ${k < 0 ? "-" : "+"} ${Math.abs(k)} = ${a + k}$。`,
            ),
          });
        }
        const upper = rng.bool();
        const answer = upper ? k + Math.abs(a) : k - Math.abs(a);
        const word = upper ? t("upper", "上方的") : t("lower", "下方的");
        return numberProblem({
          prompt: t(
            `The graph of $y = ${a}\\coth${inner}${shift(k)}$ has two horizontal asymptotes. The ${word.en} one is $y = c$. Find $c$.`,
            `$y = ${a}\\coth${inner}${shift(k)}$ 的图像有两条水平渐近线，${word["zh-CN"]}一条是 $y = c$。求 $c$。`,
          ),
          answer,
          wrong: [upper ? k - Math.abs(a) : k + Math.abs(a), k, h],
          solution: t(
            `$\\coth u \\to \\pm 1$ as $u \\to \\pm\\infty$, so the horizontal asymptotes are $y = ${k} \\pm ${Math.abs(a)}$: $y = ${k - Math.abs(a)}$ and $y = ${k + Math.abs(a)}$.`,
            `当 $u \\to \\pm\\infty$ 时 $\\coth u \\to \\pm 1$，所以水平渐近线为 $y = ${k} \\pm ${Math.abs(a)}$：$y = ${k - Math.abs(a)}$ 和 $y = ${k + Math.abs(a)}$。`,
          ),
        });
      },
    },
  ],
};

/** theInverseHyperbolicFunctions evaluates arsinh, arcosh and artanh with their logarithmic forms. */
export const theInverseHyperbolicFunctions: TopicDef = {
  id: "the-inverse-hyperbolic-functions",
  title: t("The Inverse Hyperbolic Functions", "反双曲函数"),
  summary: t(
    "Evaluate the inverse hyperbolic sine, cosine and tangent, using their logarithmic forms.",
    "利用对数形式计算反双曲正弦、反双曲余弦和反双曲正切。",
  ),
  prerequisites: ["solving-equations-containing-hyperbolic-functions"],
  encompasses: [{ topic: "solving-equations-containing-hyperbolic-functions", weight: 0.5 }],
  xp: 14,
  standards: [],
  knowledgePoints: [
    {
      id: "evaluating-inverse-hyperbolic-functions",
      title: t("Evaluating inverse hyperbolic functions", "计算反双曲函数"),
      explanation: t(
        "An inverse hyperbolic function answers the question of which input gives a stated output, so work backwards from the definition of the original function. $\\operatorname{arsinh} c$ is the $x$ with $\\sinh x = c$; $\\operatorname{arcosh} c$ (for $c \\ge 1$) is the $x \\ge 0$ with $\\cosh x = c$; $\\operatorname{artanh} c$ (for $|c| < 1$) is the $x$ with $\\tanh x = c$.\n\nSince $\\cosh(\\ln 2) = \\frac{5}{4}$, $\\operatorname{arcosh} \\frac{5}{4} = \\ln 2$.",
        "反双曲函数回答的是哪个输入会给出指定的输出，所以要从原函数的定义倒推。$\\operatorname{arsinh} c$ 是满足 $\\sinh x = c$ 的 $x$；$\\operatorname{arcosh} c$（$c \\ge 1$）是满足 $\\cosh x = c$ 的 $x \\ge 0$；$\\operatorname{artanh} c$（$|c| < 1$）是满足 $\\tanh x = c$ 的 $x$。\n\n因为 $\\cosh(\\ln 2) = \\frac{5}{4}$，所以 $\\operatorname{arcosh} \\frac{5}{4} = \\ln 2$。",
      ),
      generate(rng) {
        const k = rng.int(2, 9);
        const which = rng.int(0, 2);
        const s = which === 1 ? 1 : rng.sign();
        const kq = Q.of(k);
        const v = [sinhLn(kq), coshLn(kq), tanhLn(kq)][which]!.mul(Q.of(s));
        const names = ["\\operatorname{arsinh}", "\\operatorname{arcosh}", "\\operatorname{artanh}"];
        const base = ["\\sinh", "\\cosh", "\\tanh"][which]!;
        const answer = `${s < 0 ? "-" : ""}\\ln ${k}`;
        return functionProblem({
          prompt: t(
            `Find the exact value of $${names[which]}\\left(${v.toLatex()}\\right)$.`,
            `求 $${names[which]}\\left(${v.toLatex()}\\right)$ 的精确值。`,
          ),
          answer,
          wrong: [`${s < 0 ? "" : "-"}\\ln ${k}`, `\\ln ${k * k}`, `\\ln ${k + 1}`],
          solution: t(
            `$${base}(${answer}) = ${v.toLatex()}$, so $${names[which]}\\left(${v.toLatex()}\\right) = ${answer}$.`,
            `$${base}(${answer}) = ${v.toLatex()}$，所以 $${names[which]}\\left(${v.toLatex()}\\right) = ${answer}$。`,
          ),
        });
      },
    },
    {
      id: "logarithmic-forms-of-inverse-hyperbolic-functions",
      title: t("Logarithmic forms", "对数形式"),
      explanation: t(
        "Because hyperbolic functions are made of exponentials, solving for the input leads to a quadratic in the exponential, whose solution is a logarithm. Solving $\\sinh x = c$, $\\cosh x = c$ and $\\tanh x = c$ for $x$ gives\n\n$$\\operatorname{arsinh} c = \\ln\\left(c + \\sqrt{c^{2} + 1}\\right), \\quad \\operatorname{arcosh} c = \\ln\\left(c + \\sqrt{c^{2} - 1}\\right), \\quad \\operatorname{artanh} c = \\frac{1}{2}\\ln\\frac{1 + c}{1 - c}.$$\n\nFor example $\\operatorname{arsinh} 2 = \\ln\\left(2 + \\sqrt{5}\\right)$.",
        "由于双曲函数由指数函数构成，求自变量时会得到关于指数式的二次方程，它的解是一个对数。由 $\\sinh x = c$、$\\cosh x = c$、$\\tanh x = c$ 解出 $x$，得\n\n$$\\operatorname{arsinh} c = \\ln\\left(c + \\sqrt{c^{2} + 1}\\right), \\quad \\operatorname{arcosh} c = \\ln\\left(c + \\sqrt{c^{2} - 1}\\right), \\quad \\operatorname{artanh} c = \\frac{1}{2}\\ln\\frac{1 + c}{1 - c}.$$\n\n例如 $\\operatorname{arsinh} 2 = \\ln\\left(2 + \\sqrt{5}\\right)$。",
      ),
      generate(rng) {
        const which = rng.int(0, 2);
        if (which === 2) {
          const [p, q] = rng.pick(
            range(2, 9).flatMap((d) =>
              range(1, d - 1)
                .filter((n) => Q.of(n, d).d === BigInt(d) && Q.of(d + n, d - n).d !== 1n)
                .map((n) => [n, d] as const),
            ),
          );
          const s = rng.sign();
          const c = Q.of(s * p, q);
          const ratio = Q.one.add(c).div(Q.one.sub(c));
          return functionProblem({
            prompt: t(
              `Write $\\operatorname{artanh}\\left(${c.toLatex()}\\right)$ exactly, using a logarithm.`,
              `用对数写出 $\\operatorname{artanh}\\left(${c.toLatex()}\\right)$ 的精确值。`,
            ),
            answer: `\\frac{1}{2}\\ln ${ratio.toLatex()}`,
            wrong: [`\\ln ${ratio.toLatex()}`, `\\frac{1}{2}\\ln ${Q.one.div(ratio).toLatex()}`, `2\\ln ${ratio.toLatex()}`],
            solution: t(
              `$$\\operatorname{artanh}\\left(${c.toLatex()}\\right) = \\frac{1}{2}\\ln\\frac{${poly([1, ""], [c, ""])}}{${poly([1, ""], [c.neg(), ""])}} = \\frac{1}{2}\\ln ${ratio.toLatex()}$$`,
              `$$\\operatorname{artanh}\\left(${c.toLatex()}\\right) = \\frac{1}{2}\\ln\\frac{${poly([1, ""], [c, ""])}}{${poly([1, ""], [c.neg(), ""])}} = \\frac{1}{2}\\ln ${ratio.toLatex()}$$`,
            ),
          });
        }
        const n = which === 0 ? rng.int(1, 12) : rng.int(2, 12);
        const under = which === 0 ? n * n + 1 : n * n - 1;
        const name = which === 0 ? "\\operatorname{arsinh}" : "\\operatorname{arcosh}";
        const answer = `\\ln\\left(${n} + ${sqrtLatex(under)}\\right)`;
        const other = which === 0 ? n * n - 1 : n * n + 1;
        return functionProblem({
          prompt: t(`Write $${name} ${n}$ exactly, using a logarithm.`, `用对数写出 $${name} ${n}$ 的精确值。`),
          answer,
          wrong: [
            ...(other > 0 ? [`\\ln\\left(${n} + ${sqrtLatex(other)}\\right)`] : []),
            `\\ln\\left(${n} - ${sqrtLatex(under)}\\right)`,
            `\\ln ${n}`,
          ],
          solution: t(
            `$$${name} ${n} = \\ln\\left(${n} + \\sqrt{${n}^{2} ${which === 0 ? "+" : "-"} 1}\\right) = ${answer}$$`,
            `$$${name} ${n} = \\ln\\left(${n} + \\sqrt{${n}^{2} ${which === 0 ? "+" : "-"} 1}\\right) = ${answer}$$`,
          ),
        });
      },
    },
  ],
};

/** calculusIHyperbolicTopics are the topics of Calculus I module 1.1. */
export const calculusIHyperbolicTopics: readonly TopicDef[] = [
  theHyperbolicFunctions,
  theReciprocalHyperbolicFunctions,
  solvingEquationsContainingHyperbolicFunctions,
  graphsOfTheHyperbolicFunctions,
  graphsOfTheReciprocalHyperbolicFunctions,
  theInverseHyperbolicFunctions,
];
