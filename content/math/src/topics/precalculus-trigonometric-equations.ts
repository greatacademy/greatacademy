import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { choiceProblem, numberProblem, solutionsProblem } from "../problems.ts";

// Precalculus unit 4: Trigonometry (modules 4.13 to 4.15: elementary, transformed,
// and advanced trigonometric equations).

function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([right.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && seen.add(w.en)).slice(0, 3);
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

// ─── 4.13.1 Elementary sine equations ───────────────────────────────────────

/** elementaryTrigonometricEquationsContainingSine covers sin(x) = c. */
export const elementaryTrigonometricEquationsContainingSine: TopicDef = {
  id: "elementary-trigonometric-equations-containing-sine",
  title: t("Elementary Trigonometric Equations Containing Sine", "含正弦的基本三角方程"),
  summary: t(
    "Solve equations of the form sin(x) = c on intervals such as [0, 2π) or [0°, 360°) using reference angles and quadrants.",
    "利用参考角与象限知识在 [0, 2π) 或 [0°, 360°) 上求解形如 sin(x) = c 的方程。",
  ),
  prerequisites: ["graphing-the-inverse-sine-function"],
  encompasses: [{ topic: "graphing-the-inverse-sine-function", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "solve-elementary-sine-equations-degrees",
      title: t("Solve sin(x) = c in degrees on [0°, 360°)", "在 [0°, 360°) 内求解正弦方程（角度制）"),
      explanation: t(
        "To solve $\\sin x^{\\circ} = c$ on $[0, 360)$:\n\n1. Find the reference angle $\\alpha = \\arcsin|c|$.\n2. Sine is positive in Quadrants I and II ($x = \\alpha, 180 - \\alpha$) and negative in Quadrants III and IV ($x = 180 + \\alpha, 360 - \\alpha$).\n\nFor example, $\\sin x^{\\circ} = \\frac{1}{2}$ has reference angle $30^{\\circ}$, giving solutions $x = 30, 150$.",
        "在 $[0, 360)$ 上求解 $\\sin x^{\\circ} = c$：\n\n1. 求参考角 $\\alpha = \\arcsin|c|$。\n2. 正弦在第一、二象限为正（$x = \\alpha, 180 - \\alpha$），在第三、四象限为负（$x = 180 + \\alpha, 360 - \\alpha$）。\n\n例如，$\\sin x^{\\circ} = \\frac{1}{2}$ 的参考角为 $30^{\\circ}$，解为 $x = 30, 150$。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            val: "0",
            ans: ["0", "180"],
            wrong: [
              ["0", "360"],
              ["90", "270"],
              ["0", "90"],
            ],
          },
          { val: "1", ans: ["90"], wrong: [["90", "270"], ["0", "180"], ["270"]] },
          { val: "-1", ans: ["270"], wrong: [["90"], ["180"], ["90", "270"]] },
          {
            val: "\\frac{1}{2}",
            ans: ["30", "150"],
            wrong: [
              ["60", "120"],
              ["30", "330"],
              ["30", "210"],
            ],
          },
          {
            val: "-\\frac{1}{2}",
            ans: ["210", "330"],
            wrong: [
              ["150", "210"],
              ["240", "300"],
              ["30", "330"],
            ],
          },
          {
            val: "\\frac{\\sqrt{2}}{2}",
            ans: ["45", "135"],
            wrong: [
              ["45", "315"],
              ["45", "225"],
              ["135", "225"],
            ],
          },
          {
            val: "-\\frac{\\sqrt{2}}{2}",
            ans: ["225", "315"],
            wrong: [
              ["135", "315"],
              ["45", "225"],
              ["225", "270"],
            ],
          },
          {
            val: "\\frac{\\sqrt{3}}{2}",
            ans: ["60", "120"],
            wrong: [
              ["30", "150"],
              ["60", "300"],
              ["120", "240"],
            ],
          },
          {
            val: "-\\frac{\\sqrt{3}}{2}",
            ans: ["240", "300"],
            wrong: [
              ["210", "330"],
              ["120", "240"],
              ["300", "330"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = coeff === 1 ? item.val : `${coeff}\\left(${item.val}\\right)`;
        const ansStr = item.ans.join(", ");
        return solutionsProblem({
          prompt: t(
            `Solve $${coeffLatex}\\sin(${v}^{\\circ}) = ${rhs}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $${coeffLatex}\\sin(${v}^{\\circ}) = ${rhs}$。`,
          ),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: t(
            `Dividing by the coefficient gives $\\sin(${v}^{\\circ}) = ${item.val}$. All solutions in $[0, 360)$ are $${v} = ${ansStr}$.`,
            `两边除以系数得 $\\sin(${v}^{\\circ}) = ${item.val}$。在 $[0, 360)$ 上的全部解为 $${v} = ${ansStr}$。`,
          ),
        });
      },
    },
    {
      id: "solve-elementary-sine-equations-radians",
      title: t("Solve sin(x) = c in radians on [0, 2π)", "在 [0, 2π) 内求解正弦方程（弧度制）"),
      explanation: t(
        "Sine is positive in the first two quadrants and negative in the last two, so most equations of this kind have two solutions in one full turn. For $\\sin x = c$ on $[0, 2\\pi)$:\n\n$$\\sin x = \\frac{\\sqrt{3}}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{2\\pi}{3}$$\n\n$$\\sin x = -\\frac{1}{2} \\implies x = \\frac{7\\pi}{6}, \\; \\frac{11\\pi}{6}$$",
        "正弦在第一、二象限为正，在第三、四象限为负，所以这类方程在一整圈内通常有两个解。在 $[0, 2\\pi)$ 上求解 $\\sin x = c$：\n\n$$\\sin x = \\frac{\\sqrt{3}}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{2\\pi}{3}$$\n\n$$\\sin x = -\\frac{1}{2} \\implies x = \\frac{7\\pi}{6}, \\; \\frac{11\\pi}{6}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "0, \\pi", wrong: ["0, 2\\pi", "\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "0, \\frac{\\pi}{2}"] },
          { val: "1", ans: "\\frac{\\pi}{2}", wrong: ["\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "0, \\pi", "\\pi"] },
          { val: "-1", ans: "\\frac{3\\pi}{2}", wrong: ["\\frac{\\pi}{2}", "\\pi", "-\\frac{\\pi}{2}"] },
          {
            val: "\\frac{1}{2}",
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}"],
          },
          {
            val: "-\\frac{1}{2}",
            ans: "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{5\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{4\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{6}, \\frac{11\\pi}{6}"],
          },
          {
            val: "\\frac{\\sqrt{2}}{2}",
            ans: "\\frac{\\pi}{4}, \\frac{3\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}"],
          },
          {
            val: "-\\frac{\\sqrt{2}}{2}",
            ans: "\\frac{5\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{5\\pi}{4}, \\frac{3\\pi}{2}"],
          },
          {
            val: "\\frac{\\sqrt{3}}{2}",
            ans: "\\frac{\\pi}{3}, \\frac{2\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}"],
          },
          {
            val: "-\\frac{\\sqrt{3}}{2}",
            ans: "\\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{7\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{5\\pi}{3}, \\frac{11\\pi}{6}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = coeff === 1 ? item.val : `${coeff}\\left(${item.val}\\right)`;
        return oneOf(
          rng,
          t(`Solve $${coeffLatex}\\sin ${v} = ${rhs}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上求解 $${coeffLatex}\\sin ${v} = ${rhs}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `The equation simplifies to $\\sin ${v} = ${item.val}$. Solutions in $[0, 2\\pi)$ are $${v} = ${item.ans}$.`,
            `方程化简为 $\\sin ${v} = ${item.val}$。在 $[0, 2\\pi)$ 上的解为 $${v} = ${item.ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.13.2 Elementary cosine equations ─────────────────────────────────────

/** elementaryTrigonometricEquationsContainingCosine covers cos(x) = c. */
export const elementaryTrigonometricEquationsContainingCosine: TopicDef = {
  id: "elementary-trigonometric-equations-containing-cosine",
  title: t("Elementary Trigonometric Equations Containing Cosine", "含余弦的基本三角方程"),
  summary: t(
    "Solve equations of the form cos(x) = c on intervals such as [0, 2π) or [0°, 360°).",
    "在 [0, 2π) 或 [0°, 360°) 上求解形如 cos(x) = c 的三角方程。",
  ),
  prerequisites: ["elementary-trigonometric-equations-containing-sine"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "solve-elementary-cosine-equations-degrees",
      title: t("Solve cos(x) = c in degrees on [0°, 360°)", "在 [0°, 360°) 内求解余弦方程（角度制）"),
      explanation: t(
        "Cosine is positive in Quadrants I and IV ($x = \\alpha, 360 - \\alpha$) and negative in Quadrants II and III ($x = 180 - \\alpha, 180 + \\alpha$).\n\nFor example, $\\cos x^{\\circ} = \\frac{1}{2} \\implies x = 60, 300$.",
        "余弦在第一、四象限为正（$x = \\alpha, 360 - \\alpha$），在第二、三象限为负（$x = 180 - \\alpha, 180 + \\alpha$）。\n\n例如，$\\cos x^{\\circ} = \\frac{1}{2} \\implies x = 60, 300$。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            val: "0",
            ans: ["90", "270"],
            wrong: [
              ["0", "180"],
              ["90", "180"],
              ["0", "360"],
            ],
          },
          { val: "1", ans: ["0"], wrong: [["90"], ["180"], ["0", "180"]] },
          { val: "-1", ans: ["180"], wrong: [["0"], ["270"], ["90", "270"]] },
          {
            val: "\\frac{1}{2}",
            ans: ["60", "300"],
            wrong: [
              ["30", "330"],
              ["60", "120"],
              ["120", "240"],
            ],
          },
          {
            val: "-\\frac{1}{2}",
            ans: ["120", "240"],
            wrong: [
              ["60", "300"],
              ["150", "210"],
              ["120", "300"],
            ],
          },
          {
            val: "\\frac{\\sqrt{2}}{2}",
            ans: ["45", "315"],
            wrong: [
              ["45", "135"],
              ["135", "225"],
              ["45", "225"],
            ],
          },
          {
            val: "-\\frac{\\sqrt{2}}{2}",
            ans: ["135", "225"],
            wrong: [
              ["45", "315"],
              ["135", "315"],
              ["225", "315"],
            ],
          },
          {
            val: "\\frac{\\sqrt{3}}{2}",
            ans: ["30", "330"],
            wrong: [
              ["60", "300"],
              ["30", "150"],
              ["150", "210"],
            ],
          },
          {
            val: "-\\frac{\\sqrt{3}}{2}",
            ans: ["150", "210"],
            wrong: [
              ["120", "240"],
              ["30", "330"],
              ["210", "330"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = coeff === 1 ? item.val : `${coeff}\\left(${item.val}\\right)`;
        const ansStr = item.ans.join(", ");
        return solutionsProblem({
          prompt: t(
            `Solve $${coeffLatex}\\cos(${v}^{\\circ}) = ${rhs}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $${coeffLatex}\\cos(${v}^{\\circ}) = ${rhs}$。`,
          ),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: t(
            `Dividing by the coefficient gives $\\cos(${v}^{\\circ}) = ${item.val}$. All solutions in $[0, 360)$ are $${v} = ${ansStr}$.`,
            `除以系数得 $\\cos(${v}^{\\circ}) = ${item.val}$。在 $[0, 360)$ 上的全部解为 $${v} = ${ansStr}$。`,
          ),
        });
      },
    },
    {
      id: "solve-elementary-cosine-equations-radians",
      title: t("Solve cos(x) = c in radians on [0, 2π)", "在 [0, 2π) 内求解余弦方程（弧度制）"),
      explanation: t(
        "Cosine is positive in the first and fourth quadrants and negative in the second and third, so each value strictly between minus one and one gives two solutions in one turn. For $\\cos x = c$ on $[0, 2\\pi)$:\n\n$$\\cos x = \\frac{1}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\n$$\\cos x = -\\frac{\\sqrt{3}}{2} \\implies x = \\frac{5\\pi}{6}, \\; \\frac{7\\pi}{6}$$",
        "余弦在第一、四象限为正，在第二、三象限为负，所以介于 −1 和 1 之间的每个值在一周内都有两个解。在 $[0, 2\\pi)$ 上求解 $\\cos x = c$：\n\n$$\\cos x = \\frac{1}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\n$$\\cos x = -\\frac{\\sqrt{3}}{2} \\implies x = \\frac{5\\pi}{6}, \\; \\frac{7\\pi}{6}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "\\frac{\\pi}{2}, \\frac{3\\pi}{2}", wrong: ["0, \\pi", "\\pi, 2\\pi", "0, \\frac{\\pi}{2}"] },
          { val: "1", ans: "0", wrong: ["\\pi", "\\frac{\\pi}{2}", "0, \\pi"] },
          { val: "-1", ans: "\\pi", wrong: ["0", "\\frac{3\\pi}{2}", "2\\pi"] },
          {
            val: "\\frac{1}{2}",
            ans: "\\frac{\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}"],
          },
          {
            val: "-\\frac{1}{2}",
            ans: "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}"],
          },
          {
            val: "\\frac{\\sqrt{2}}{2}",
            ans: "\\frac{\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}"],
          },
          {
            val: "-\\frac{\\sqrt{2}}{2}",
            ans: "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{5\\pi}{4}, \\frac{7\\pi}{4}"],
          },
          {
            val: "\\frac{\\sqrt{3}}{2}",
            ans: "\\frac{\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}"],
          },
          {
            val: "-\\frac{\\sqrt{3}}{2}",
            ans: "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}",
            wrong: ["\\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = coeff === 1 ? item.val : `${coeff}\\left(${item.val}\\right)`;
        return oneOf(
          rng,
          t(`Solve $${coeffLatex}\\cos ${v} = ${rhs}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上求解 $${coeffLatex}\\cos ${v} = ${rhs}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `The equation is $\\cos ${v} = ${item.val}$. Solutions in $[0, 2\\pi)$ are $${v} = ${item.ans}$.`,
            `方程为 $\\cos ${v} = ${item.val}$。在 $[0, 2\\pi)$ 上的解为 $${v} = ${item.ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.13.3 Elementary tangent equations ────────────────────────────────────

/** elementaryTrigonometricEquationsContainingTangent covers tan(x) = c. */
export const elementaryTrigonometricEquationsContainingTangent: TopicDef = {
  id: "elementary-trigonometric-equations-containing-tangent",
  title: t("Elementary Trigonometric Equations Containing Tangent", "含正切的基本三角方程"),
  summary: t(
    "Solve equations of the form tan(x) = c on [0, 2π) or [0°, 360°) using the period π and quadrants.",
    "利用周期 π 与象限知识在 [0, 2π) 或 [0°, 360°) 上求解形如 tan(x) = c 的方程。",
  ),
  prerequisites: ["elementary-trigonometric-equations-containing-sine"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "solve-elementary-tangent-equations-degrees",
      title: t("Solve tan(x) = c in degrees on [0°, 360°)", "在 [0°, 360°) 内求解正切方程（角度制）"),
      explanation: t(
        "Tangent has period $180^{\\circ}$. It is positive in Quadrants I and III ($x = \\alpha, 180 + \\alpha$) and negative in Quadrants II and IV ($x = 180 - \\alpha, 360 - \\alpha$).\n\nFor example, $\\tan x^{\\circ} = 1 \\implies x = 45, 225$.",
        "正切函数的周期为 $180^{\\circ}$。在第一、三象限为正（$x = \\alpha, 180 + \\alpha$），在第二、四象限为负（$x = 180 - \\alpha, 360 - \\alpha$）。\n\n例如，$\\tan x^{\\circ} = 1 \\implies x = 45, 225$。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: ["0", "180"], wrong: [["90", "270"], ["0", "360"], ["180"]] },
          {
            val: "1",
            ans: ["45", "225"],
            wrong: [
              ["45", "135"],
              ["135", "315"],
              ["45", "315"],
            ],
          },
          {
            val: "-1",
            ans: ["135", "315"],
            wrong: [
              ["45", "225"],
              ["135", "225"],
              ["225", "315"],
            ],
          },
          {
            val: "\\sqrt{3}",
            ans: ["60", "240"],
            wrong: [
              ["30", "210"],
              ["60", "120"],
              ["120", "300"],
            ],
          },
          {
            val: "-\\sqrt{3}",
            ans: ["120", "300"],
            wrong: [
              ["60", "240"],
              ["150", "330"],
              ["240", "300"],
            ],
          },
          {
            val: "\\frac{\\sqrt{3}}{3}",
            ans: ["30", "210"],
            wrong: [
              ["60", "240"],
              ["30", "150"],
              ["150", "330"],
            ],
          },
          {
            val: "-\\frac{\\sqrt{3}}{3}",
            ans: ["150", "330"],
            wrong: [
              ["30", "210"],
              ["120", "300"],
              ["210", "330"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = coeff === 1 ? item.val : `${coeff}\\left(${item.val}\\right)`;
        const ansStr = item.ans.join(", ");
        return solutionsProblem({
          prompt: t(
            `Solve $${coeffLatex}\\tan(${v}^{\\circ}) = ${rhs}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $${coeffLatex}\\tan(${v}^{\\circ}) = ${rhs}$。`,
          ),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: t(
            `We have $\\tan(${v}^{\\circ}) = ${item.val}$. In $[0, 360)$, the solutions are $${v} = ${ansStr}$.`,
            `方程化为 $\\tan(${v}^{\\circ}) = ${item.val}$。在 $[0, 360)$ 上的全部解为 $${v} = ${ansStr}$。`,
          ),
        });
      },
    },
    {
      id: "solve-elementary-tangent-equations-radians",
      title: t("Solve tan(x) = c in radians on [0, 2π)", "在 [0, 2π) 内求解正切方程（弧度制）"),
      explanation: t(
        "Tangent has period $\\pi$, so first find the reference solution in $(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2})$, then add $\\pi$ to get the second solution in the interval. For $\\tan x = c$ on $[0, 2\\pi)$:\n\n$$\\tan x = \\sqrt{3} \\implies x = \\frac{\\pi}{3}, \\; \\frac{4\\pi}{3}$$\n\n$$\\tan x = -1 \\implies x = \\frac{3\\pi}{4}, \\; \\frac{7\\pi}{4}$$",
        "正切函数的周期是 $\\pi$，所以先在 $(-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2})$ 内找到基准解，再加上 $\\pi$ 得到区间内的第二个解。在 $[0, 2\\pi)$ 上求解 $\\tan x = c$：\n\n$$\\tan x = \\sqrt{3} \\implies x = \\frac{\\pi}{3}, \\; \\frac{4\\pi}{3}$$\n\n$$\\tan x = -1 \\implies x = \\frac{3\\pi}{4}, \\; \\frac{7\\pi}{4}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "0, \\pi", wrong: ["\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "0, 2\\pi", "\\pi"] },
          {
            val: "1",
            ans: "\\frac{\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}, \\frac{7\\pi}{4}"],
          },
          {
            val: "-1",
            ans: "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{5\\pi}{4}, \\frac{7\\pi}{4}"],
          },
          {
            val: "\\sqrt{3}",
            ans: "\\frac{\\pi}{3}, \\frac{4\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}"],
          },
          {
            val: "-\\sqrt{3}",
            ans: "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{4\\pi}{3}, \\frac{5\\pi}{3}"],
          },
          {
            val: "\\frac{\\sqrt{3}}{3}",
            ans: "\\frac{\\pi}{6}, \\frac{7\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}"],
          },
          {
            val: "-\\frac{\\sqrt{3}}{3}",
            ans: "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = coeff === 1 ? item.val : `${coeff}\\left(${item.val}\\right)`;
        return oneOf(
          rng,
          t(`Solve $${coeffLatex}\\tan ${v} = ${rhs}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上求解 $${coeffLatex}\\tan ${v} = ${rhs}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `The equation is $\\tan ${v} = ${item.val}$. Solutions in $[0, 2\\pi)$ are $${v} = ${item.ans}$.`,
            `方程为 $\\tan ${v} = ${item.val}$。在 $[0, 2\\pi)$ 上的解为 $${v} = ${item.ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.13.4 Elementary secant equations ─────────────────────────────────────

/** elementaryTrigonometricEquationsContainingSecant covers sec(x) = c. */
export const elementaryTrigonometricEquationsContainingSecant: TopicDef = {
  id: "elementary-trigonometric-equations-containing-secant",
  title: t("Elementary Trigonometric Equations Containing Secant", "含正割的基本三角方程"),
  summary: t(
    "Solve sec(x) = c by converting to cos(x) = 1/c and identifying domain restrictions.",
    "通过将 sec(x) = c 转化为 cos(x) = 1/c 并结合定义域求解三角方程。",
  ),
  prerequisites: ["elementary-trigonometric-equations-containing-cosine"],
  encompasses: [{ topic: "elementary-trigonometric-equations-containing-cosine", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "solve-elementary-secant-equations",
      title: t("Solve sec(x) = c on [0, 2π)", "在 [0, 2π) 上求解正割方程"),
      explanation: t(
        "Secant is the reciprocal of cosine, so rewrite the equation as a cosine equation, which has no solution when the reciprocal lies outside the range of cosine. Convert using $\\cos x = \\frac{1}{\\sec x}$:\n\n$$\\sec x = 2 \\iff \\cos x = \\frac{1}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\nIf $|c| < 1$, $\\sec x = c$ has no real solution because $|\\sec x| \\ge 1$.",
        "正割是余弦的倒数，所以把方程改写成余弦方程；如果倒数超出余弦的值域，方程就没有解。利用 $\\cos x = \\frac{1}{\\sec x}$ 进行转化：\n\n$$\\sec x = 2 \\iff \\cos x = \\frac{1}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\n若 $|c| < 1$，由于 $|\\sec x| \\ge 1$，方程 $\\sec x = c$ 无实数解。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "1", ans: "0", wrong: ["\\pi", "\\frac{\\pi}{2}", "0, \\pi"] },
          { val: "-1", ans: "\\pi", wrong: ["0", "\\frac{3\\pi}{2}", "2\\pi"] },
          {
            val: "2",
            ans: "\\frac{\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}"],
          },
          {
            val: "-2",
            ans: "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}"],
          },
          {
            val: "\\sqrt{2}",
            ans: "\\frac{\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}"],
          },
          {
            val: "-\\sqrt{2}",
            ans: "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{5\\pi}{4}, \\frac{7\\pi}{4}"],
          },
          {
            val: "\\frac{2\\sqrt{3}}{3}",
            ans: "\\frac{\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}"],
          },
          {
            val: "-\\frac{2\\sqrt{3}}{3}",
            ans: "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}",
            wrong: ["\\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}"],
          },
          { val: "\\frac{1}{2}", ans: "\\text{No solution}", wrong: ["\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "0", "\\frac{\\pi}{6}"] },
          { val: "-\\frac{1}{2}", ans: "\\text{No solution}", wrong: ["\\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\pi", "\\frac{5\\pi}{6}"] },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const isNoSol = item.ans === "\\text{No solution}";
        return oneOf(
          rng,
          t(`Solve $\\sec ${v} = ${item.val}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上求解 $\\sec ${v} = ${item.val}$。`),
          isNoSol ? t("No real solution", "无实数解") : t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          isNoSol
            ? [
                t(`$${v} = \\frac{\\pi}{3}$`, `$${v} = \\frac{\\pi}{3}$`),
                t(`$${v} = 0$`, `$${v} = 0$`),
                t(`$${v} = \\pi$`, `$${v} = \\pi$`),
              ]
            : item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            isNoSol
              ? `Since $|\\sec ${v}| \\ge 1$, $\\sec ${v} = ${item.val}$ has no real solution.`
              : `Convert to $\\cos ${v} = \\frac{1}{${item.val}}$: the solutions in $[0, 2\\pi)$ are $${v} = ${item.ans}$.`,
            isNoSol
              ? `因为 $|\\sec ${v}| \\ge 1$，所以 $\\sec ${v} = ${item.val}$ 无实数解。`
              : `转化为 $\\cos ${v} = \\frac{1}{${item.val}}$：在 $[0, 2\\pi)$ 上的解为 $${v} = ${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "solve-elementary-secant-equations-degrees",
      title: t("Solve sec(x) = c in degrees on [0°, 360°)", "在 [0°, 360°) 上求解正割方程（角度制）"),
      explanation: t(
        "Take the reciprocal to get an equation in cosine, then use the reference angle and the signs of cosine in each quadrant to list the degree solutions. Use $\\cos(x^{\\circ}) = \\frac{1}{\\sec(x^{\\circ})}$:\n\n$$\\sec(x^{\\circ}) = 2 \\iff \\cos(x^{\\circ}) = \\frac{1}{2} \\implies x = 60, 300$$",
        "取倒数得到余弦方程，再用参考角和余弦在各象限的符号写出所有度数解。利用 $\\cos(x^{\\circ}) = \\frac{1}{\\sec(x^{\\circ})}$：\n\n$$\\sec(x^{\\circ}) = 2 \\iff \\cos(x^{\\circ}) = \\frac{1}{2} \\implies x = 60, 300$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "1", inv: "1", ans: ["0"], wrong: [["90"], ["180"], ["0", "180"]] },
          { val: "-1", inv: "-1", ans: ["180"], wrong: [["0"], ["270"], ["90", "270"]] },
          {
            val: "2",
            inv: "\\frac{1}{2}",
            ans: ["60", "300"],
            wrong: [
              ["30", "330"],
              ["60", "120"],
              ["120", "240"],
            ],
          },
          {
            val: "-2",
            inv: "-\\frac{1}{2}",
            ans: ["120", "240"],
            wrong: [
              ["60", "300"],
              ["150", "210"],
              ["120", "300"],
            ],
          },
          {
            val: "\\sqrt{2}",
            inv: "\\frac{\\sqrt{2}}{2}",
            ans: ["45", "315"],
            wrong: [
              ["45", "135"],
              ["135", "225"],
              ["45", "225"],
            ],
          },
          {
            val: "-\\sqrt{2}",
            inv: "-\\frac{\\sqrt{2}}{2}",
            ans: ["135", "225"],
            wrong: [
              ["45", "315"],
              ["135", "315"],
              ["225", "315"],
            ],
          },
          {
            val: "\\frac{2\\sqrt{3}}{3}",
            inv: "\\frac{\\sqrt{3}}{2}",
            ans: ["30", "330"],
            wrong: [
              ["60", "300"],
              ["30", "150"],
              ["150", "210"],
            ],
          },
          {
            val: "-\\frac{2\\sqrt{3}}{3}",
            inv: "-\\frac{\\sqrt{3}}{2}",
            ans: ["150", "210"],
            wrong: [
              ["120", "240"],
              ["30", "330"],
              ["210", "330"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = coeff === 1 ? item.val : `${coeff}\\left(${item.val}\\right)`;
        const ansStr = item.ans.join(", ");
        return solutionsProblem({
          prompt: t(
            `Solve $${coeffLatex}\\sec(${v}^{\\circ}) = ${rhs}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $${coeffLatex}\\sec(${v}^{\\circ}) = ${rhs}$。`,
          ),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: t(
            `Since $\\sec(${v}^{\\circ}) = ${item.val}$, taking the reciprocal gives $\\cos(${v}^{\\circ}) = ${item.inv}$, which yields $${v} = ${ansStr}$ in $[0, 360)$.`,
            `由 $\\sec(${v}^{\\circ}) = ${item.val}$ 取倒数得 $\\cos(${v}^{\\circ}) = ${item.inv}$，在 $[0, 360)$ 上解得 $${v} = ${ansStr}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 4.13.5 Elementary cosecant equations ───────────────────────────────────

/** elementaryTrigonometricEquationsContainingCosecant covers csc(x) = c. */
export const elementaryTrigonometricEquationsContainingCosecant: TopicDef = {
  id: "elementary-trigonometric-equations-containing-cosecant",
  title: t("Elementary Trigonometric Equations Containing Cosecant", "含余割的基本三角方程"),
  summary: t("Solve csc(x) = c by converting to sin(x) = 1/c.", "通过将 csc(x) = c 转化为 sin(x) = 1/c 求解三角方程。"),
  prerequisites: ["elementary-trigonometric-equations-containing-sine"],
  encompasses: [{ topic: "elementary-trigonometric-equations-containing-sine", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "solve-elementary-cosecant-equations",
      title: t("Solve csc(x) = c on [0, 2π)", "在 [0, 2π) 上求解余割方程"),
      explanation: t(
        "Cosecant is the reciprocal of sine, so rewrite the equation as a sine equation, which has no solution when the reciprocal lies outside the range of sine. Convert using $\\sin x = \\frac{1}{\\csc x}$:\n\n$$\\csc x = 2 \\iff \\sin x = \\frac{1}{2} \\implies x = \\frac{\\pi}{6}, \\; \\frac{5\\pi}{6}$$",
        "余割是正弦的倒数，所以把方程改写成正弦方程；如果倒数超出正弦的值域，方程就没有解。利用 $\\sin x = \\frac{1}{\\csc x}$ 进行转化：\n\n$$\\csc x = 2 \\iff \\sin x = \\frac{1}{2} \\implies x = \\frac{\\pi}{6}, \\; \\frac{5\\pi}{6}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "1", ans: "\\frac{\\pi}{2}", wrong: ["\\pi", "0", "\\frac{3\\pi}{2}"] },
          { val: "-1", ans: "\\frac{3\\pi}{2}", wrong: ["\\frac{\\pi}{2}", "\\pi", "2\\pi"] },
          {
            val: "2",
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}"],
          },
          {
            val: "-2",
            ans: "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{5\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{4\\pi}{3}, \\frac{5\\pi}{3}"],
          },
          {
            val: "\\sqrt{2}",
            ans: "\\frac{\\pi}{4}, \\frac{3\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{5\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}"],
          },
          {
            val: "-\\sqrt{2}",
            ans: "\\frac{5\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}"],
          },
          {
            val: "\\frac{2\\sqrt{3}}{3}",
            ans: "\\frac{\\pi}{3}, \\frac{2\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{4\\pi}{3}, \\frac{5\\pi}{3}"],
          },
          {
            val: "-\\frac{2\\sqrt{3}}{3}",
            ans: "\\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}"],
          },
          { val: "\\frac{1}{2}", ans: "\\text{No solution}", wrong: ["\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{\\pi}{2}", "0"] },
          { val: "-\\frac{1}{2}", ans: "\\text{No solution}", wrong: ["\\frac{7\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{3\\pi}{2}", "\\pi"] },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const isNoSol = item.ans === "\\text{No solution}";
        return oneOf(
          rng,
          t(`Solve $\\csc ${v} = ${item.val}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上求解 $\\csc ${v} = ${item.val}$。`),
          isNoSol ? t("No real solution", "无实数解") : t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          isNoSol
            ? [
                t(`$${v} = \\frac{\\pi}{6}$`, `$${v} = \\frac{\\pi}{6}$`),
                t(`$${v} = \\frac{\\pi}{2}$`, `$${v} = \\frac{\\pi}{2}$`),
                t(`$${v} = \\pi$`, `$${v} = \\pi$`),
              ]
            : item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            isNoSol
              ? `Since $|\\csc ${v}| \\ge 1$, $\\csc ${v} = ${item.val}$ has no real solution.`
              : `Convert to $\\sin ${v} = \\frac{1}{${item.val}}$: solutions in $[0, 2\\pi)$ are $${v} = ${item.ans}$.`,
            isNoSol
              ? `因为 $|\\csc ${v}| \\ge 1$，所以 $\\csc ${v} = ${item.val}$ 无实数解。`
              : `转化为 $\\sin ${v} = \\frac{1}{${item.val}}$：在 $[0, 2\\pi)$ 上的解为 $${v} = ${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "solve-elementary-cosecant-equations-degrees",
      title: t("Solve csc(x) = c in degrees on [0°, 360°)", "在 [0°, 360°) 上求解余割方程（角度制）"),
      explanation: t(
        "Take the reciprocal to get an equation in sine, then use the reference angle and the signs of sine in each quadrant to list the degree solutions. Use $\\sin(x^{\\circ}) = \\frac{1}{\\csc(x^{\\circ})}$:\n\n$$\\csc(x^{\\circ}) = 2 \\iff \\sin(x^{\\circ}) = \\frac{1}{2} \\implies x = 30, 150$$",
        "取倒数得到正弦方程，再用参考角和正弦在各象限的符号写出所有度数解。利用 $\\sin(x^{\\circ}) = \\frac{1}{\\csc(x^{\\circ})}$：\n\n$$\\csc(x^{\\circ}) = 2 \\iff \\sin(x^{\\circ}) = \\frac{1}{2} \\implies x = 30, 150$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "1", inv: "1", ans: ["90"], wrong: [["90", "270"], ["0", "180"], ["270"]] },
          { val: "-1", inv: "-1", ans: ["270"], wrong: [["90"], ["180"], ["90", "270"]] },
          {
            val: "2",
            inv: "\\frac{1}{2}",
            ans: ["30", "150"],
            wrong: [
              ["60", "120"],
              ["30", "330"],
              ["30", "210"],
            ],
          },
          {
            val: "-2",
            inv: "-\\frac{1}{2}",
            ans: ["210", "330"],
            wrong: [
              ["150", "210"],
              ["240", "300"],
              ["30", "330"],
            ],
          },
          {
            val: "\\sqrt{2}",
            inv: "\\frac{\\sqrt{2}}{2}",
            ans: ["45", "135"],
            wrong: [
              ["45", "315"],
              ["45", "225"],
              ["135", "225"],
            ],
          },
          {
            val: "-\\sqrt{2}",
            inv: "-\\frac{\\sqrt{2}}{2}",
            ans: ["225", "315"],
            wrong: [
              ["135", "315"],
              ["45", "225"],
              ["225", "270"],
            ],
          },
          {
            val: "\\frac{2\\sqrt{3}}{3}",
            inv: "\\frac{\\sqrt{3}}{2}",
            ans: ["60", "120"],
            wrong: [
              ["30", "150"],
              ["60", "300"],
              ["120", "240"],
            ],
          },
          {
            val: "-\\frac{2\\sqrt{3}}{3}",
            inv: "-\\frac{\\sqrt{3}}{2}",
            ans: ["240", "300"],
            wrong: [
              ["210", "330"],
              ["120", "240"],
              ["300", "330"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = coeff === 1 ? item.val : `${coeff}\\left(${item.val}\\right)`;
        const ansStr = item.ans.join(", ");
        return solutionsProblem({
          prompt: t(
            `Solve $${coeffLatex}\\csc(${v}^{\\circ}) = ${rhs}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $${coeffLatex}\\csc(${v}^{\\circ}) = ${rhs}$。`,
          ),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: t(
            `Since $\\csc(${v}^{\\circ}) = ${item.val}$, taking the reciprocal gives $\\sin(${v}^{\\circ}) = ${item.inv}$, which yields $${v} = ${ansStr}$ in $[0, 360)$.`,
            `由 $\\csc(${v}^{\\circ}) = ${item.val}$ 取倒数得 $\\sin(${v}^{\\circ}) = ${item.inv}$，在 $[0, 360)$ 上解得 $${v} = ${ansStr}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 4.13.6 Elementary cotangent equations ──────────────────────────────────

/** elementaryTrigonometricEquationsContainingCotangent covers cot(x) = c. */
export const elementaryTrigonometricEquationsContainingCotangent: TopicDef = {
  id: "elementary-trigonometric-equations-containing-cotangent",
  title: t("Elementary Trigonometric Equations Containing Cotangent", "含余切的基本三角方程"),
  summary: t(
    "Solve cot(x) = c on [0, 2π) by converting to tan(x) = 1/c or finding points where cos(x)/sin(x) = c.",
    "通过转化为 tan(x) = 1/c 或利用 cos(x)/sin(x) = c 在 [0, 2π) 上求解余切方程。",
  ),
  prerequisites: ["elementary-trigonometric-equations-containing-tangent"],
  encompasses: [{ topic: "elementary-trigonometric-equations-containing-tangent", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "solve-elementary-cotangent-equations",
      title: t("Solve cot(x) = c on [0, 2π)", "在 [0, 2π) 上求解余切方程"),
      explanation: t(
        "Cotangent is the reciprocal of tangent, so rewrite the equation in tangent; a cotangent of zero instead means that cosine is zero. Using $\\tan x = \\frac{1}{\\cot x}$:\n\n$$\\cot x = \\sqrt{3} \\iff \\tan x = \\frac{1}{\\sqrt{3}} \\implies x = \\frac{\\pi}{6}, \\; \\frac{7\\pi}{6}$$\n\nIf $\\cot x = 0$, $\\cos x = 0 \\implies x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}$.",
        "余切是正切的倒数，所以把方程改写成正切方程；余切为零则意味着余弦为零。利用 $\\tan x = \\frac{1}{\\cot x}$：\n\n$$\\cot x = \\sqrt{3} \\iff \\tan x = \\frac{1}{\\sqrt{3}} \\implies x = \\frac{\\pi}{6}, \\; \\frac{7\\pi}{6}$$\n\n若 $\\cot x = 0$，则 $\\cos x = 0 \\implies x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}$。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "\\frac{\\pi}{2}, \\frac{3\\pi}{2}", wrong: ["0, \\pi", "\\pi, 2\\pi", "0, \\frac{\\pi}{2}"] },
          {
            val: "1",
            ans: "\\frac{\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}, \\frac{7\\pi}{4}"],
          },
          {
            val: "-1",
            ans: "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{5\\pi}{4}, \\frac{7\\pi}{4}"],
          },
          {
            val: "\\sqrt{3}",
            ans: "\\frac{\\pi}{6}, \\frac{7\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}"],
          },
          {
            val: "-\\sqrt{3}",
            ans: "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}"],
          },
          {
            val: "\\frac{\\sqrt{3}}{3}",
            ans: "\\frac{\\pi}{3}, \\frac{4\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}"],
          },
          {
            val: "-\\frac{\\sqrt{3}}{3}",
            ans: "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{4\\pi}{3}, \\frac{5\\pi}{3}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = coeff === 1 ? item.val : `${coeff}\\left(${item.val}\\right)`;
        return oneOf(
          rng,
          t(`Solve $${coeffLatex}\\cot ${v} = ${rhs}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上求解 $${coeffLatex}\\cot ${v} = ${rhs}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `The equation simplifies to $\\cot ${v} = ${item.val}$. Solutions in $[0, 2\\pi)$ are $${v} = ${item.ans}$.`,
            `方程化简为 $\\cot ${v} = ${item.val}$。在 $[0, 2\\pi)$ 上的解为 $${v} = ${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "solve-elementary-cotangent-equations-degrees",
      title: t("Solve cot(x) = c in degrees on [0°, 360°)", "在 [0°, 360°) 上求解余切方程（角度制）"),
      explanation: t(
        "Rewrite the equation as a tangent equation and remember that tangent repeats every one hundred eighty degrees, giving two solutions in a full turn. Use $\\tan(x^{\\circ}) = \\frac{1}{\\cot(x^{\\circ})}$:\n\n$$\\cot(x^{\\circ}) = \\sqrt{3} \\iff \\tan(x^{\\circ}) = \\frac{\\sqrt{3}}{3} \\implies x = 30, 210$$",
        "把方程改写成正切方程，并记住正切每 180° 重复一次，所以一整周内有两个解。利用 $\\tan(x^{\\circ}) = \\frac{1}{\\cot(x^{\\circ})}$：\n\n$$\\cot(x^{\\circ}) = \\sqrt{3} \\iff \\tan(x^{\\circ}) = \\frac{\\sqrt{3}}{3} \\implies x = 30, 210$$",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            val: "0",
            ans: ["90", "270"],
            wrong: [
              ["0", "180"],
              ["90", "180"],
              ["0", "360"],
            ],
          },
          {
            val: "1",
            ans: ["45", "225"],
            wrong: [
              ["45", "135"],
              ["135", "315"],
              ["45", "315"],
            ],
          },
          {
            val: "-1",
            ans: ["135", "315"],
            wrong: [
              ["45", "225"],
              ["135", "225"],
              ["225", "315"],
            ],
          },
          {
            val: "\\sqrt{3}",
            ans: ["30", "210"],
            wrong: [
              ["60", "240"],
              ["30", "150"],
              ["150", "330"],
            ],
          },
          {
            val: "-\\sqrt{3}",
            ans: ["150", "330"],
            wrong: [
              ["30", "210"],
              ["120", "300"],
              ["210", "330"],
            ],
          },
          {
            val: "\\frac{\\sqrt{3}}{3}",
            ans: ["60", "240"],
            wrong: [
              ["30", "210"],
              ["60", "120"],
              ["120", "300"],
            ],
          },
          {
            val: "-\\frac{\\sqrt{3}}{3}",
            ans: ["120", "300"],
            wrong: [
              ["60", "240"],
              ["150", "330"],
              ["240", "300"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = coeff === 1 ? item.val : `${coeff}\\left(${item.val}\\right)`;
        const ansStr = item.ans.join(", ");
        return solutionsProblem({
          prompt: t(
            `Solve $${coeffLatex}\\cot(${v}^{\\circ}) = ${rhs}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $${coeffLatex}\\cot(${v}^{\\circ}) = ${rhs}$。`,
          ),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: t(
            `Since $\\cot(${v}^{\\circ}) = ${item.val}$, its solutions in $[0, 360)$ are $${v} = ${ansStr}$.`,
            `由 $\\cot(${v}^{\\circ}) = ${item.val}$，在 $[0, 360)$ 上的全部解为 $${v} = ${ansStr}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 4.13.7 General solutions of elementary equations ────────────────────────

/** generalSolutionsOfElementaryTrigonometricEquations expresses infinite solution families. */
export const generalSolutionsOfElementaryTrigonometricEquations: TopicDef = {
  id: "general-solutions-of-elementary-trigonometric-equations",
  title: t("General Solutions of Elementary Trigonometric Equations", "基本三角方程的通解"),
  summary: t(
    "Write general solutions over the real numbers by adding 2kπ for sine/cosine or kπ for tangent/cotangent, where k ∈ ℤ.",
    "通过为正弦/余弦加上 2kπ、为正切/余切加上 kπ（k ∈ ℤ）表示实数范围内的通解。",
  ),
  prerequisites: ["elementary-trigonometric-equations-containing-cosine", "elementary-trigonometric-equations-containing-tangent"],
  encompasses: [{ topic: "elementary-trigonometric-equations-containing-tangent", weight: 0.3 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "general-solutions-sin-cos-tan",
      title: t("General solution formulas for trigonometric equations", "三角方程通解公式形式"),
      explanation: t(
        "Because trigonometric functions repeat, an equation has infinitely many solutions, which we describe by adding whole multiples of the period to the solutions in one cycle. For $k \\in \\mathbb{Z}$:\n\n- $\\sin x = c$: $x = \\alpha + 2k\\pi$ or $x = (\\pi - \\alpha) + 2k\\pi$\n- $\\cos x = c$: $x = \\pm \\alpha + 2k\\pi$\n- $\\tan x = c$: $x = \\alpha + k\\pi$",
        "由于三角函数是周期函数，方程有无穷多个解，我们在一个周期内的解上加上周期的整数倍来描述它们。对于 $k \\in \\mathbb{Z}$：\n\n- $\\sin x = c$：$x = \\alpha + 2k\\pi$ 或 $x = (\\pi - \\alpha) + 2k\\pi$\n- $\\cos x = c$：$x = \\pm \\alpha + 2k\\pi$\n- $\\tan x = c$：$x = \\alpha + k\\pi$",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            fn: "\\sin",
            val: "\\frac{1}{2}",
            ans: "\\frac{\\pi}{6} + 2k\\pi, \\; \\frac{5\\pi}{6} + 2k\\pi",
            wrong: ["\\frac{\\pi}{6} + k\\pi", "\\frac{\\pi}{3} + 2k\\pi", "\\pm \\frac{\\pi}{6} + 2k\\pi"],
          },
          {
            fn: "\\sin",
            val: "-\\frac{1}{2}",
            ans: "\\frac{7\\pi}{6} + 2k\\pi, \\; \\frac{11\\pi}{6} + 2k\\pi",
            wrong: ["\\frac{7\\pi}{6} + k\\pi", "\\pm \\frac{\\pi}{6} + 2k\\pi", "\\frac{4\\pi}{3} + 2k\\pi"],
          },
          {
            fn: "\\cos",
            val: "\\frac{1}{2}",
            ans: "\\pm \\frac{\\pi}{3} + 2k\\pi",
            wrong: ["\\frac{\\pi}{3} + k\\pi", "\\frac{\\pi}{6} + 2k\\pi", "\\pm \\frac{\\pi}{6} + 2k\\pi"],
          },
          {
            fn: "\\cos",
            val: "-\\frac{1}{2}",
            ans: "\\pm \\frac{2\\pi}{3} + 2k\\pi",
            wrong: ["\\frac{2\\pi}{3} + k\\pi", "\\pm \\frac{\\pi}{3} + 2k\\pi", "\\frac{5\\pi}{6} + 2k\\pi"],
          },
          {
            fn: "\\cos",
            val: "\\frac{\\sqrt{2}}{2}",
            ans: "\\pm \\frac{\\pi}{4} + 2k\\pi",
            wrong: ["\\frac{\\pi}{4} + k\\pi", "\\pm \\frac{3\\pi}{4} + 2k\\pi", "\\frac{\\pi}{4} + 2k\\pi"],
          },
          {
            fn: "\\tan",
            val: "1",
            ans: "\\frac{\\pi}{4} + k\\pi",
            wrong: ["\\frac{\\pi}{4} + 2k\\pi", "\\pm \\frac{\\pi}{4} + k\\pi", "\\frac{5\\pi}{4} + 2k\\pi"],
          },
          {
            fn: "\\tan",
            val: "-1",
            ans: "-\\frac{\\pi}{4} + k\\pi",
            wrong: ["\\pm \\frac{\\pi}{4} + k\\pi", "-\\frac{\\pi}{4} + 2k\\pi", "\\frac{3\\pi}{4} + 2k\\pi"],
          },
          {
            fn: "\\tan",
            val: "\\sqrt{3}",
            ans: "\\frac{\\pi}{3} + k\\pi",
            wrong: ["\\frac{\\pi}{3} + 2k\\pi", "\\pm \\frac{\\pi}{3} + k\\pi", "\\frac{\\pi}{6} + k\\pi"],
          },
          {
            fn: "\\tan",
            val: "\\frac{\\sqrt{3}}{3}",
            ans: "\\frac{\\pi}{6} + k\\pi",
            wrong: ["\\frac{\\pi}{6} + 2k\\pi", "\\pm \\frac{\\pi}{6} + k\\pi", "\\frac{\\pi}{3} + k\\pi"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        return oneOf(
          rng,
          t(
            `Find all real solutions to $${item.fn} ${v} = ${item.val}$ (where $k \\in \\mathbb{Z}$).`,
            `求方程 $${item.fn} ${v} = ${item.val}$ 的所有实数解（其中 $k \\in \\mathbb{Z}$）。`,
          ),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `By periodicity, the complete general solution family is $${v} = ${item.ans}$.`,
            `由周期性，该方程的完整通解族为 $${v} = ${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "particular-solutions-from-general-trig",
      title: t("Evaluate particular degree solutions from general formulas", "由通解公式求特定角度解"),
      explanation: t(
        "A general solution is a family of angles indexed by an integer, and choosing a specific integer picks out one member of the family. Given a general solution $x = \\alpha + 360k$ or $x = \\alpha + 180k$ in degrees, substitute the specified integer $k$ to find a particular solution.",
        "通解是一族以整数为下标的角，选定一个具体的整数就得到这族角中的一个。给定角度制下的通解 $x = \\alpha + 360k$ 或 $x = \\alpha + 180k$，代入指定的整数 $k$ 即可求得对应的特解。",
      ),
      generate(rng) {
        const item = rng.pick([
          { fn: "\\sin", val: "\\frac{1}{2}", alpha: 30, period: 360 },
          { fn: "\\sin", val: "\\frac{\\sqrt{2}}{2}", alpha: 45, period: 360 },
          { fn: "\\sin", val: "\\frac{\\sqrt{3}}{2}", alpha: 60, period: 360 },
          { fn: "\\cos", val: "\\frac{1}{2}", alpha: 60, period: 360 },
          { fn: "\\cos", val: "\\frac{\\sqrt{3}}{2}", alpha: 30, period: 360 },
          { fn: "\\tan", val: "1", alpha: 45, period: 180 },
          { fn: "\\tan", val: "\\sqrt{3}", alpha: 60, period: 180 },
          { fn: "\\tan", val: "\\frac{\\sqrt{3}}{3}", alpha: 30, period: 180 },
        ]);
        const k = rng.pick([-2, -1, 1, 2, 3]);
        const ans = item.alpha + k * item.period;
        return numberProblem({
          prompt: t(
            `One branch of the general solution to $${item.fn}(x^{\\circ}) = ${item.val}$ is $x = ${item.alpha} + ${item.period}k$. Find the value of $x$ when $k = ${k}$.`,
            `方程 $${item.fn}(x^{\\circ}) = ${item.val}$ 的通解分支之一为 $x = ${item.alpha} + ${item.period}k$。求当 $k = ${k}$ 时 $x$ 的值。`,
          ),
          answer: ans,
          wrong: [item.alpha - k * item.period, item.alpha + k * 180, item.alpha + (k + 1) * item.period],
          solution: t(
            `Substitute $k = ${k}$ into $x = ${item.alpha} + ${item.period}k$: $x = ${item.alpha} + ${item.period}(${k}) = ${ans}$.`,
            `将 $k = ${k}$ 代入 $x = ${item.alpha} + ${item.period}k$：得 $x = ${item.alpha} + ${item.period}(${k}) = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 4.14.1 General solutions with transformed functions ─────────────────────

/** generalSolutionsOfTrigonometricEquationsWithTransformedFunctions covers sin(Bx) = c. */
export const generalSolutionsOfTrigonometricEquationsWithTransformedFunctions: TopicDef = {
  id: "general-solutions-of-trigonometric-equations-with-transformed-functions",
  title: t("General Solutions of Trigonometric Equations With Transformed Functions", "含变换函数的三角方程通解"),
  summary: t(
    "Solve equations of the form sin(Bx) = c, cos(Bx) = c, or tan(Bx) = c by substituting u = Bx and dividing by B.",
    "通过令 u = Bx 并两边除以 B 求解形如 sin(Bx) = c、cos(Bx) = c 或 tan(Bx) = c 的方程通解。",
  ),
  prerequisites: ["general-solutions-of-elementary-trigonometric-equations"],
  encompasses: [{ topic: "general-solutions-of-elementary-trigonometric-equations", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "general-solution-multi-angle",
      title: t("General solution of sin(Bx) = c and cos(Bx) = c", "sin(Bx) = c 与 cos(Bx) = c 的通解"),
      explanation: t(
        "Solve for the whole inner angle first, adding multiples of the period, and only then divide by the coefficient, which also divides the period. For $\\sin(2x) = \\frac{1}{2}$:\n\n$$2x = \\frac{\\pi}{6} + 2k\\pi \\implies x = \\frac{\\pi}{12} + k\\pi$$\n\n$$2x = \\frac{5\\pi}{6} + 2k\\pi \\implies x = \\frac{5\\pi}{12} + k\\pi$$",
        "先对整个内层角求解并加上周期的整数倍，然后再除以系数，周期也随之被除。对于 $\\sin(2x) = \\frac{1}{2}$：\n\n$$2x = \\frac{\\pi}{6} + 2k\\pi \\implies x = \\frac{\\pi}{12} + k\\pi$$\n\n$$2x = \\frac{5\\pi}{6} + 2k\\pi \\implies x = \\frac{5\\pi}{12} + k\\pi$$",
      ),
      generate(rng) {
        const B = rng.pick([2, 3, 4]);
        const item = rng.pick([
          {
            fn: "\\cos",
            val: "\\frac{1}{2}",
            ans: `\\pm \\frac{\\pi}{${3 * B}} + \\frac{2k\\pi}{${B}}`,
            wrong: [
              `\\pm \\frac{\\pi}{3} + 2k\\pi`,
              `\\pm \\frac{\\pi}{${3 * B}} + 2k\\pi`,
              `\\frac{\\pi}{${6 * B}} + \\frac{k\\pi}{${B}}`,
            ],
          },
          {
            fn: "\\cos",
            val: "\\frac{\\sqrt{2}}{2}",
            ans: `\\pm \\frac{\\pi}{${4 * B}} + \\frac{2k\\pi}{${B}}`,
            wrong: [
              `\\pm \\frac{\\pi}{4} + 2k\\pi`,
              `\\pm \\frac{\\pi}{${4 * B}} + 2k\\pi`,
              `\\frac{\\pi}{${2 * B}} + \\frac{k\\pi}{${B}}`,
            ],
          },
          {
            fn: "\\tan",
            val: "1",
            ans: `\\frac{\\pi}{${4 * B}} + \\frac{k\\pi}{${B}}`,
            wrong: [`\\frac{\\pi}{4} + k\\pi`, `\\frac{\\pi}{${4 * B}} + 2k\\pi`, `\\frac{\\pi}{${2 * B}} + \\frac{k\\pi}{${B}}`],
          },
          {
            fn: "\\tan",
            val: "\\sqrt{3}",
            ans: `\\frac{\\pi}{${3 * B}} + \\frac{k\\pi}{${B}}`,
            wrong: [`\\frac{\\pi}{3} + k\\pi`, `\\frac{\\pi}{${3 * B}} + 2k\\pi`, `\\frac{\\pi}{${6 * B}} + \\frac{k\\pi}{${B}}`],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        return oneOf(
          rng,
          t(
            `Find the general solution to $${item.fn}(${B}${v}) = ${item.val}$ for $k \\in \\mathbb{Z}$.`,
            `求方程 $${item.fn}(${B}${v}) = ${item.val}$ 的通解（其中 $k \\in \\mathbb{Z}$）。`,
          ),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `Solve for the argument $u = ${B}${v}$ first, then divide by $${B}$: $${v} = ${item.ans}$.`,
            `先求整体参数 $u = ${B}${v}$，然后两边除以 $${B}$ 得：$${v} = ${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "period-and-spacing-of-transformed-trig-solutions",
      title: t("Particular degree solutions of transformed equations", "变换三角方程的特解计算"),
      explanation: t(
        "Multiplying the input by a constant squeezes the graph horizontally, so the solutions are spaced more closely, by the period divided by that constant. For $\\sin(Bx^{\\circ}) = c$, dividing the general solution $Bx = \\alpha + 360k$ by $B$ gives $x = \\frac{\\alpha}{B} + \\frac{360}{B}k$.",
        "把自变量乘以一个常数会在水平方向压缩图像，所以解之间的间隔变小，等于周期除以这个常数。对于 $\\sin(Bx^{\\circ}) = c$，将 $Bx = \\alpha + 360k$ 两边除以 $B$ 可得 $x = \\frac{\\alpha}{B} + \\frac{360}{B}k$。",
      ),
      generate(rng) {
        const B = rng.pick([2, 3, 5, 6]);
        const item = rng.pick([
          { fn: "\\sin", val: "\\frac{1}{2}", alpha: 30, basePeriod: 360 },
          { fn: "\\cos", val: "\\frac{1}{2}", alpha: 60, basePeriod: 360 },
          { fn: "\\sin", val: "1", alpha: 90, basePeriod: 360 },
          { fn: "\\tan", val: "0", alpha: 0, basePeriod: 180 },
          { fn: "\\tan", val: "\\sqrt{3}", alpha: 60, basePeriod: 180 },
        ]);
        const k = rng.pick([1, 2, 3]);
        const step = item.basePeriod / B;
        const base = item.alpha / B;
        const ans = base + k * step;
        return numberProblem({
          prompt: t(
            `The principal branch of solutions to $${item.fn}(${B}x^{\\circ}) = ${item.val}$ is $x = \\frac{${item.alpha} + ${item.basePeriod}k}{${B}}$. Find $x$ when $k = ${k}$.`,
            `方程 $${item.fn}(${B}x^{\\circ}) = ${item.val}$ 的主解分支为 $x = \\frac{${item.alpha} + ${item.basePeriod}k}{${B}}$。求当 $k = ${k}$ 时 $x$ 的值。`,
          ),
          answer: ans,
          wrong: [item.alpha + k * step, base + k * item.basePeriod, ans + step],
          solution: t(
            `Substitute $k = ${k}$: $x = \\frac{${item.alpha} + ${item.basePeriod}(${k})}{${B}} = ${base} + ${k} \\cdot ${step} = ${ans}$.`,
            `代入 $k = ${k}$：$x = \\frac{${item.alpha} + ${item.basePeriod}(${k})}{${B}} = ${base} + ${k} \\cdot ${step} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 4.14.2 Transformed sine equations ──────────────────────────────────────

/** trigonometricEquationsContainingTransformedSineFunctions solves on [0, 2π). */
export const trigonometricEquationsContainingTransformedSineFunctions: TopicDef = {
  id: "trigonometric-equations-containing-transformed-sine-functions",
  title: t("Trigonometric Equations Containing Transformed Sine Functions", "含变换正弦函数的三角方程"),
  summary: t(
    "Find all solutions on [0, 2π) for sine equations with altered frequency sin(Bx) = c or phase shift sin(x - φ) = c.",
    "在 [0, 2π) 上求解具有频率变化 sin(Bx) = c 或相位平移 sin(x - φ) = c 的正弦方程全部解。",
  ),
  prerequisites: ["general-solutions-of-trigonometric-equations-with-transformed-functions"],
  encompasses: [{ topic: "general-solutions-of-trigonometric-equations-with-transformed-functions", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "solve-transformed-sine-frequency-and-phase",
      title: t("Solve transformed sine equations on [0, 2π)", "在 [0, 2π) 上求解变换正弦方程"),
      explanation: t(
        "Find the interval that the inner expression covers as the variable runs over the given interval, list every solution for the inner expression there, and then solve for the variable. For $\\sin(2x) = 1$ on $[0, 2\\pi)$:\n\n$$2x \\in [0, 4\\pi) \\implies 2x = \\frac{\\pi}{2}, \\; \\frac{5\\pi}{2} \\implies x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4}$$",
        "先求出变量取遍给定区间时内层式子所覆盖的区间，在其中写出内层式子的所有解，再解出变量。在 $[0, 2\\pi)$ 上求解 $\\sin(2x) = 1$：\n\n$$2x \\in [0, 4\\pi) \\implies 2x = \\frac{\\pi}{2}, \\; \\frac{5\\pi}{2} \\implies x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            expr: "\\sin(2x) = 1",
            ans: "\\frac{\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "\\frac{\\pi}{4}"],
          },
          {
            expr: "\\sin(2x) = -1",
            ans: "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{3\\pi}{2}", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{3\\pi}{4}"],
          },
          {
            expr: "\\sin(2x) = 0",
            ans: "0, \\frac{\\pi}{2}, \\pi, \\frac{3\\pi}{2}",
            wrong: ["0, \\pi", "\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "0, \\frac{\\pi}{4}, \\frac{\\pi}{2}"],
          },
          {
            expr: "\\sin\\left(x - \\frac{\\pi}{4}\\right) = 0",
            ans: "\\frac{\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["0, \\pi", "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}"],
          },
          {
            expr: "\\sin\\left(x + \\frac{\\pi}{3}\\right) = 1",
            ans: "\\frac{\\pi}{6}",
            wrong: ["\\frac{\\pi}{2}", "\\frac{5\\pi}{6}", "\\frac{\\pi}{3}"],
          },
          {
            expr: "\\sin\\left(x - \\frac{\\pi}{6}\\right) = 1",
            ans: "\\frac{2\\pi}{3}",
            wrong: ["\\frac{\\pi}{2}", "\\frac{\\pi}{3}", "\\frac{5\\pi}{6}"],
          },
          {
            expr: "2\\sin(2x) = \\sqrt{3}",
            ans: "\\frac{\\pi}{6}, \\frac{\\pi}{3}, \\frac{7\\pi}{6}, \\frac{4\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{2\\pi}{3}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{\\pi}{6}, \\frac{2\\pi}{3}"],
          },
          {
            expr: "2\\sin(2x) = 1",
            ans: "\\frac{\\pi}{12}, \\frac{5\\pi}{12}, \\frac{13\\pi}{12}, \\frac{17\\pi}{12}",
            wrong: ["\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{\\pi}{12}, \\frac{7\\pi}{12}", "\\frac{5\\pi}{12}, \\frac{11\\pi}{12}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const promptExpr = item.expr.replaceAll("x", v);
        return oneOf(
          rng,
          t(`Solve $${promptExpr}$ for $${v} \\in [0, 2\\pi)$.`, `在 $${v} \\in [0, 2\\pi)$ 上解方程 $${promptExpr}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `Find all values of the inner argument in its transformed range, then solve for $${v}$: $${v} = ${item.ans}$.`,
            `先求内层表达式在其变换区间内的所有可能值，再解出 $${v}$：$${v} = ${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "solve-transformed-sine-degrees",
      title: t("Solve transformed sine equations in degrees", "在角度制下求解变换正弦方程"),
      explanation: t(
        "Treat the shifted angle as a single unknown, find all its values with the given sine, and then add the shift back to each one. To solve $\\sin(x^{\\circ} - \\varphi^{\\circ}) = c$ on $[0, 360)$, find the reference angles for $x - \\varphi$ and add $\\varphi$.",
        "把平移后的角看作一个未知数，求出正弦为给定值的所有角，再给每个角加回平移量。在 $[0, 360)$ 上求解 $\\sin(x^{\\circ} - \\varphi^{\\circ}) = c$ 时，先求出 $x - \\varphi$ 的解，再加上 $\\varphi$。",
      ),
      generate(rng) {
        const shift = rng.pick([10, 15, 20, 25, 30, 40]);
        const sign = rng.pick([1, -1]);
        const item = rng.pick([
          { val: "1", base: [90] },
          { val: "-1", base: [270] },
          { val: "\\frac{1}{2}", base: [30, 150] },
          { val: "\\frac{\\sqrt{2}}{2}", base: [45, 135] },
          { val: "\\frac{\\sqrt{3}}{2}", base: [60, 120] },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const shiftLatex = sign === 1 ? `${v}^{\\circ} - ${shift}^{\\circ}` : `${v}^{\\circ} + ${shift}^{\\circ}`;
        const ansNums = item.base.map((b) => b + sign * shift);
        const ans = ansNums.map(String);
        const wrong1 = item.base.map((b) => String(b - sign * shift));
        const wrong2 = item.base.map(String);
        const wrong3 = ansNums.map((a) => String(a + 30));
        const ansStr = ans.join(", ");
        return solutionsProblem({
          prompt: t(
            `Solve $\\sin(${shiftLatex}) = ${item.val}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $\\sin(${shiftLatex}) = ${item.val}$。`,
          ),
          variable: v,
          values: ans,
          wrong: [wrong1, wrong2, wrong3],
          solution: t(
            `The inner angle equals $${item.base.join("^{\\circ}, ")}{}^{\\circ}$, so solving for $${v}$ gives $${v} = ${ansStr}$.`,
            `内层角等于 $${item.base.join("^{\\circ}, ")}{}^{\\circ}$，解得 $${v} = ${ansStr}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 4.14.3 Transformed cosine equations ────────────────────────────────────

/** trigonometricEquationsContainingTransformedCosineFunctions solves on [0, 2π). */
export const trigonometricEquationsContainingTransformedCosineFunctions: TopicDef = {
  id: "trigonometric-equations-containing-transformed-cosine-functions",
  title: t("Trigonometric Equations Containing Transformed Cosine Functions", "含变换余弦函数的三角方程"),
  summary: t(
    "Find all solutions on [0, 2π) for cosine equations with transformed frequencies cos(Bx) = c or shifts.",
    "在 [0, 2π) 上求解具有频率变化或平移的余弦方程。",
  ),
  prerequisites: ["general-solutions-of-trigonometric-equations-with-transformed-functions"],
  encompasses: [{ topic: "general-solutions-of-trigonometric-equations-with-transformed-functions", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "solve-transformed-cosine-frequency-and-phase",
      title: t("Solve transformed cosine equations on [0, 2π)", "在 [0, 2π) 上求解变换余弦方程"),
      explanation: t(
        "Work with the inner expression as one angle, list its solutions across the stretched interval, and then divide or shift to recover the original variable. For $\\cos(2x) = 1$ on $[0, 2\\pi)$:\n\n$$2x = 0, \\; 2\\pi \\implies x = 0, \\; \\pi$$\n\nFor $\\cos(2x) = 0$:\n\n$$2x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}, \\; \\frac{5\\pi}{2}, \\; \\frac{7\\pi}{2} \\implies x = \\frac{\\pi}{4}, \\; \\frac{3\\pi}{4}, \\; \\frac{5\\pi}{4}, \\; \\frac{7\\pi}{4}$$",
        "把内层式子当作一个角，在伸缩后的区间内写出它的所有解，再通过除法或平移求回原变量。在 $[0, 2\\pi)$ 上求解 $\\cos(2x) = 1$：\n\n$$2x = 0, \\; 2\\pi \\implies x = 0, \\; \\pi$$\n\n求解 $\\cos(2x) = 0$：\n\n$$2x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}, \\; \\frac{5\\pi}{2}, \\; \\frac{7\\pi}{2} \\implies x = \\frac{\\pi}{4}, \\; \\frac{3\\pi}{4}, \\; \\frac{5\\pi}{4}, \\; \\frac{7\\pi}{4}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { expr: "\\cos(2x) = 1", ans: "0, \\pi", wrong: ["0, 2\\pi", "\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "\\pi"] },
          {
            expr: "\\cos(2x) = -1",
            ans: "\\frac{\\pi}{2}, \\frac{3\\pi}{2}",
            wrong: ["\\pi", "0, \\pi", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}"],
          },
          {
            expr: "\\cos(2x) = 0",
            ans: "\\frac{\\pi}{4}, \\frac{3\\pi}{4}, \\frac{5\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "0, \\frac{\\pi}{2}, \\pi", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}"],
          },
          {
            expr: "\\cos\\left(x - \\frac{\\pi}{4}\\right) = 0",
            ans: "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{3\\pi}{4}"],
          },
          {
            expr: "\\cos\\left(x + \\frac{\\pi}{6}\\right) = 1",
            ans: "\\frac{11\\pi}{6}",
            wrong: ["\\frac{\\pi}{6}", "0", "\\frac{5\\pi}{6}"],
          },
          {
            expr: "2\\cos(2x) = 1",
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}"],
          },
          {
            expr: "2\\cos(2x) = -1",
            ans: "\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}"],
          },
          {
            expr: "\\cos\\left(x - \\frac{\\pi}{3}\\right) = 1",
            ans: "\\frac{\\pi}{3}",
            wrong: ["0", "\\frac{5\\pi}{3}", "\\frac{2\\pi}{3}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const promptExpr = item.expr.replaceAll("x", v);
        const ansLatex = item.ans;
        return oneOf(
          rng,
          t(`Solve $${promptExpr}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上解方程 $${promptExpr}$。`),
          t(`$${v} = ${ansLatex}$`, `$${v} = ${ansLatex}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `Solve for the argument inside the expanded range, yielding $${v} = ${ansLatex}$.`,
            `先在扩大后的范围内求出内层参数，再解得 $${v} = ${ansLatex}$。`,
          ),
        );
      },
    },
    {
      id: "solve-transformed-cosine-degrees",
      title: t("Solve transformed cosine equations in degrees", "在角度制下求解变换余弦方程"),
      explanation: t(
        "Treat the shifted angle as a single unknown, find all its values with the given cosine, and then add the shift back to each one. To solve $\\cos(x^{\\circ} - \\varphi^{\\circ}) = c$ on $[0, 360)$, find the reference angles for $x - \\varphi$ and add $\\varphi$.",
        "把平移后的角看作一个未知数，求出余弦为给定值的所有角，再给每个角加回平移量。在 $[0, 360)$ 上求解 $\\cos(x^{\\circ} - \\varphi^{\\circ}) = c$ 时，先求内层角的值，再解出 $x$。",
      ),
      generate(rng) {
        const shift = rng.pick([10, 15, 20, 25]);
        const sign = rng.pick([1, -1]);
        const item = rng.pick([
          { val: "0", base: [90, 270] },
          { val: "-1", base: [180] },
          { val: "\\frac{1}{2}", base: [60, 300] },
          { val: "\\frac{\\sqrt{2}}{2}", base: [45, 315] },
          { val: "\\frac{\\sqrt{3}}{2}", base: [30, 330] },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const shiftLatex = sign === 1 ? `${v}^{\\circ} - ${shift}^{\\circ}` : `${v}^{\\circ} + ${shift}^{\\circ}`;
        const ansNums = item.base.map((b) => b + sign * shift);
        const ans = ansNums.map(String);
        const wrong1 = item.base.map((b) => String(b - sign * shift));
        const wrong2 = item.base.map(String);
        const wrong3 = ansNums.map((a) => String(a + 30));
        const ansStr = ans.join(", ");
        return solutionsProblem({
          prompt: t(
            `Solve $\\cos(${shiftLatex}) = ${item.val}$ for $${v} \\in [0, 360)$.`,
            `在 $${v} \\in [0, 360)$ 上解方程 $\\cos(${shiftLatex}) = ${item.val}$。`,
          ),
          variable: v,
          values: ans,
          wrong: [wrong1, wrong2, wrong3],
          solution: t(
            `The inner angle equals $${item.base.join("^{\\circ}, ")}{}^{\\circ}$, so solving for $${v}$ gives $${v} = ${ansStr}$.`,
            `内层角等于 $${item.base.join("^{\\circ}, ")}{}^{\\circ}$，解得 $${v} = ${ansStr}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 4.14.4 Transformed tangent equations ───────────────────────────────────

/** trigonometricEquationsContainingTransformedTangentFunctions solves on intervals. */
export const trigonometricEquationsContainingTransformedTangentFunctions: TopicDef = {
  id: "trigonometric-equations-containing-transformed-tangent-functions",
  title: t("Trigonometric Equations Containing Transformed Tangent Functions", "含变换正切函数的三角方程"),
  summary: t(
    "Solve equations of the form tan(Bx) = c or tan(x - φ) = c on specified intervals.",
    "在给定区间上求解形如 tan(Bx) = c 或 tan(x - φ) = c 的正切方程。",
  ),
  prerequisites: ["general-solutions-of-trigonometric-equations-with-transformed-functions"],
  encompasses: [{ topic: "general-solutions-of-trigonometric-equations-with-transformed-functions", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "solve-transformed-tangent-equations",
      title: t("Solve transformed tangent equations on [0, π)", "在 [0, π) 上求解变换正切方程"),
      explanation: t(
        "Tangent repeats every half turn, so after finding one solution for the inner angle, add multiples of $\\pi$ to cover the whole stretched interval before solving for the variable. For $\\tan(2x) = 1$ on $[0, \\pi)$:\n\n$$2x \\in [0, 2\\pi) \\implies 2x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4} \\implies x = \\frac{\\pi}{8}, \\; \\frac{5\\pi}{8}$$",
        "正切每半周重复一次，所以求出内层角的一个解后，加上 $\\pi$ 的倍数覆盖整个伸缩后的区间，再解出变量。在 $[0, \\pi)$ 上求解 $\\tan(2x) = 1$：\n\n$$2x \\in [0, 2\\pi) \\implies 2x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4} \\implies x = \\frac{\\pi}{8}, \\; \\frac{5\\pi}{8}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            expr: "\\tan(2x) = 1",
            ans: "\\frac{\\pi}{8}, \\frac{5\\pi}{8}",
            wrong: ["\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{\\pi}{8}, \\frac{3\\pi}{8}", "\\frac{\\pi}{4}"],
          },
          {
            expr: "\\tan(2x) = -1",
            ans: "\\frac{3\\pi}{8}, \\frac{7\\pi}{8}",
            wrong: ["\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{8}, \\frac{5\\pi}{8}", "\\frac{3\\pi}{8}"],
          },
          { expr: "\\tan(2x) = 0", ans: "0, \\frac{\\pi}{2}", wrong: ["0, \\pi", "\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "0"] },
          {
            expr: "\\tan(2x) = \\sqrt{3}",
            ans: "\\frac{\\pi}{6}, \\frac{2\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{\\pi}{3}"],
          },
          {
            expr: "\\tan(2x) = -\\sqrt{3}",
            ans: "\\frac{\\pi}{3}, \\frac{5\\pi}{6}",
            wrong: ["\\frac{2\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{5\\pi}{6}"],
          },
          {
            expr: "\\tan\\left(x - \\frac{\\pi}{4}\\right) = 0",
            ans: "\\frac{\\pi}{4}",
            wrong: ["0", "\\frac{3\\pi}{4}", "\\frac{5\\pi}{4}"],
          },
          {
            expr: "\\tan\\left(x + \\frac{\\pi}{3}\\right) = 0",
            ans: "\\frac{2\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}", "0", "\\frac{5\\pi}{6}"],
          },
          {
            expr: "\\tan(2x) = \\frac{\\sqrt{3}}{3}",
            ans: "\\frac{\\pi}{12}, \\frac{7\\pi}{12}",
            wrong: ["\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{\\pi}{12}, \\frac{5\\pi}{12}", "\\frac{\\pi}{6}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const promptExpr = item.expr.replaceAll("x", v);
        return oneOf(
          rng,
          t(`Solve $${promptExpr}$ for $${v} \\in [0, \\pi)$.`, `在 $${v} \\in [0, \\pi)$ 上解方程 $${promptExpr}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `Set the inner argument in $[0, 2\\pi)$ and divide by frequency: $${v} = ${item.ans}$.`,
            `令内层变量在 $[0, 2\\pi)$ 内取值并除以频率系数：$${v} = ${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "solve-transformed-tangent-degrees",
      title: t("Solve transformed tangent equations in degrees", "在角度制下求解变换正切方程"),
      explanation: t(
        "Treat the shifted angle as a single unknown, find its value with the given tangent, and then add the shift back, keeping the answers inside the interval. To solve $\\tan(x^{\\circ} - \\varphi^{\\circ}) = c$ on $[0, 180)$, find the principal angle in $[0, 180)$ and shift by $\\varphi$.",
        "把平移后的角看作一个未知数，求出正切为给定值的角，再加回平移量，并使答案保持在区间内。在 $[0, 180)$ 上求解 $\\tan(x^{\\circ} - \\varphi^{\\circ}) = c$ 时，先求出主值角并加上偏移量 $\\varphi$。",
      ),
      generate(rng) {
        const shift = rng.pick([5, 10, 15, 20, 25]);
        const sign = rng.pick([1, -1]);
        const item = rng.pick([
          { val: "1", base: 45 },
          { val: "-1", base: 135 },
          { val: "\\sqrt{3}", base: 60 },
          { val: "-\\sqrt{3}", base: 120 },
          { val: "\\frac{\\sqrt{3}}{3}", base: 30 },
          { val: "-\\frac{\\sqrt{3}}{3}", base: 150 },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const shiftLatex = sign === 1 ? `${v}^{\\circ} - ${shift}^{\\circ}` : `${v}^{\\circ} + ${shift}^{\\circ}`;
        const ans = item.base + sign * shift;
        return solutionsProblem({
          prompt: t(
            `Solve $\\tan(${shiftLatex}) = ${item.val}$ for $${v} \\in [0, 180)$.`,
            `在 $${v} \\in [0, 180)$ 上解方程 $\\tan(${shiftLatex}) = ${item.val}$。`,
          ),
          variable: v,
          values: [String(ans)],
          wrong: [[String(item.base - sign * shift)], [String(item.base)], [String(ans + 90)]],
          solution: t(
            `The inner angle on $[0^{\\circ}, 180^{\\circ})$ is $${item.base}^{\\circ}$, so $${v} = ${ans}$.`,
            `在 $[0^{\\circ}, 180^{\\circ})$ 内内层角为 $${item.base}^{\\circ}$，解得 $${v} = ${ans}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 4.15.1 Solving using sin-cos-tan identity ──────────────────────────────

/** solvingTrigonometricEquationsUsingTheSinCosTanIdentity covers dividing by cos(x). */
export const solvingTrigonometricEquationsUsingTheSinCosTanIdentity: TopicDef = {
  id: "solving-trigonometric-equations-using-the-sin-cos-tan-identity",
  title: t("Solving Trigonometric Equations Using the Sin-Cos-Tan Identity", "利用商数关系求解三角方程"),
  summary: t(
    "Solve equations involving both sine and cosine such as A sin(x) = B cos(x) by dividing by cos(x) to form a tangent equation.",
    "通过两边同除以 cos(x) 化为正切方程，求解形如 A sin(x) = B cos(x) 的三角方程。",
  ),
  prerequisites: [
    "elementary-trigonometric-equations-containing-tangent",
    "writing-sums-of-trigonometric-functions-in-amplitude-phase-form",
  ],
  encompasses: [{ topic: "elementary-trigonometric-equations-containing-tangent", weight: 0.5 }],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "divide-by-cosine-to-tangent",
      title: t("Convert A sin(x) = B cos(x) into tan(x) = B/A", "将 A sin(x) = B cos(x) 化为 tan(x) = B/A"),
      explanation: t(
        "When an equation compares a multiple of sine with a multiple of cosine, dividing by cosine leaves a single tangent equation, which is easier to solve. Divide both sides by $\\cos x$ (noting $\\cos x \\ne 0$):\n\n$$\\sin x = \\cos x \\implies \\frac{\\sin x}{\\cos x} = 1 \\implies \\tan x = 1 \\implies x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4}$$\n\n$$\\sin x + \\sqrt{3}\\cos x = 0 \\implies \\tan x = -\\sqrt{3} \\implies x = \\frac{2\\pi}{3}, \\; \\frac{5\\pi}{3}$$",
        "当方程比较正弦的倍数与余弦的倍数时，两边除以余弦就只剩一个正切方程，更容易求解。两边同除以 $\\cos x$（注意 $\\cos x \\ne 0$）：\n\n$$\\sin x = \\cos x \\implies \\frac{\\sin x}{\\cos x} = 1 \\implies \\tan x = 1 \\implies x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4}$$\n\n$$\\sin x + \\sqrt{3}\\cos x = 0 \\implies \\tan x = -\\sqrt{3} \\implies x = \\frac{2\\pi}{3}, \\; \\frac{5\\pi}{3}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            expr: "\\sin x = \\cos x",
            ans: "\\frac{\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "\\frac{\\pi}{2}, \\frac{3\\pi}{2}"],
          },
          {
            expr: "\\sin x = -\\cos x",
            ans: "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "0, \\pi"],
          },
          {
            expr: "\\sin x - \\sqrt{3}\\cos x = 0",
            ans: "\\frac{\\pi}{3}, \\frac{4\\pi}{3}",
            wrong: ["\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}"],
          },
          {
            expr: "\\sin x + \\sqrt{3}\\cos x = 0",
            ans: "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}"],
          },
          {
            expr: "\\sqrt{3}\\sin x - \\cos x = 0",
            ans: "\\frac{\\pi}{6}, \\frac{7\\pi}{6}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}"],
          },
          {
            expr: "\\sqrt{3}\\sin x + \\cos x = 0",
            ans: "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: ["\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}"],
          },
          {
            expr: "3\\sin x - 3\\cos x = 0",
            ans: "\\frac{\\pi}{4}, \\frac{5\\pi}{4}",
            wrong: ["\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}", "0, \\pi"],
          },
          {
            expr: "2\\sin x + 2\\sqrt{3}\\cos x = 0",
            ans: "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{6}, \\frac{7\\pi}{6}", "\\frac{2\\pi}{3}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const promptExpr = item.expr.replaceAll("x", v);
        return oneOf(
          rng,
          t(`Solve $${promptExpr}$ for $${v} \\in [0, 2\\pi)$.`, `在 $${v} \\in [0, 2\\pi)$ 上解方程 $${promptExpr}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `Divide both sides by $\\cos ${v}$ to get a tangent equation: $\\tan ${v} = \\dots$, yielding $${v} = ${item.ans}$.`,
            `两边同除以 $\\cos ${v}$ 得到正切方程：$\\tan ${v} = \\dots$，解得 $${v} = ${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "solve-sin-cos-tan-identity-degrees",
      title: t("Solve A sin(x) = B cos(x) in degrees on [0°, 360°)", "在 [0°, 360°) 上利用商数关系求解（角度制）"),
      explanation: t(
        "Before dividing, check that the values where cosine is zero are not solutions, since dividing by cosine would lose them. Divide both sides by $\\cos(x^{\\circ})$ to obtain $\\tan(x^{\\circ}) = \\frac{B}{A}$, then find all solutions in $[0, 360)$.",
        "在相除之前，先检查使余弦为零的值是不是解，因为除以余弦会丢掉这些值。两边同除以 $\\cos(x^{\\circ})$ 得到 $\\tan(x^{\\circ}) = \\frac{B}{A}$，再求出 $[0, 360)$ 内的所有解。",
      ),
      generate(rng) {
        const coeff = rng.pick([1, 2, 3, 5]);
        const cStr = coeff === 1 ? "" : `${coeff}`;
        const item = rng.pick([
          {
            expr: `${cStr}\\sin(x^{\\circ}) = ${cStr}\\cos(x^{\\circ})`,
            tanVal: "1",
            ans: ["45", "225"],
            wrong: [
              ["45", "135"],
              ["135", "315"],
              ["45", "315"],
            ],
          },
          {
            expr: `${cStr}\\sin(x^{\\circ}) = -${cStr}\\cos(x^{\\circ})`,
            tanVal: "-1",
            ans: ["135", "315"],
            wrong: [
              ["45", "225"],
              ["135", "225"],
              ["225", "315"],
            ],
          },
          {
            expr: `${cStr}\\sin(x^{\\circ}) - ${cStr}\\sqrt{3}\\cos(x^{\\circ}) = 0`,
            tanVal: "\\sqrt{3}",
            ans: ["60", "240"],
            wrong: [
              ["30", "210"],
              ["60", "120"],
              ["120", "300"],
            ],
          },
          {
            expr: `${cStr}\\sin(x^{\\circ}) + ${cStr}\\sqrt{3}\\cos(x^{\\circ}) = 0`,
            tanVal: "-\\sqrt{3}",
            ans: ["120", "300"],
            wrong: [
              ["60", "240"],
              ["150", "330"],
              ["240", "300"],
            ],
          },
          {
            expr: `${cStr}\\sqrt{3}\\sin(x^{\\circ}) - ${cStr}\\cos(x^{\\circ}) = 0`,
            tanVal: "\\frac{\\sqrt{3}}{3}",
            ans: ["30", "210"],
            wrong: [
              ["60", "240"],
              ["30", "150"],
              ["150", "330"],
            ],
          },
          {
            expr: `${cStr}\\sqrt{3}\\sin(x^{\\circ}) + ${cStr}\\cos(x^{\\circ}) = 0`,
            tanVal: "-\\frac{\\sqrt{3}}{3}",
            ans: ["150", "330"],
            wrong: [
              ["30", "210"],
              ["120", "300"],
              ["210", "330"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const promptExpr = item.expr.replaceAll("x", v);
        const ansStr = item.ans.join(", ");
        return solutionsProblem({
          prompt: t(`Solve $${promptExpr}$ for $${v} \\in [0, 360)$.`, `在 $${v} \\in [0, 360)$ 上解方程 $${promptExpr}$。`),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: t(
            `Dividing by $\\cos(${v}^{\\circ})$ yields $\\tan(${v}^{\\circ}) = ${item.tanVal}$, giving $${v} = ${ansStr}$.`,
            `两边除以 $\\cos(${v}^{\\circ})$ 得 $\\tan(${v}^{\\circ}) = ${item.tanVal}$，解得 $${v} = ${ansStr}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 4.15.2 Solving using zero-product property ─────────────────────────────

/** solvingTrigonometricEquationsUsingTheZeroProductProperty covers factored equations. */
export const solvingTrigonometricEquationsUsingTheZeroProductProperty: TopicDef = {
  id: "solving-trigonometric-equations-using-the-zero-product-property",
  title: t("Solving Trigonometric Equations Using the Zero-Product Property", "利用零乘积性质求解三角方程"),
  summary: t(
    "Factor expressions such as 2 sin(x) cos(x) - sin(x) = 0 and solve each factor independently.",
    "通过因式分解（例如 2 sin(x) cos(x) - sin(x) = 0）并分别令各因式为零求解三角方程。",
  ),
  prerequisites: ["elementary-trigonometric-equations-containing-cosine"],
  encompasses: [
    { topic: "elementary-trigonometric-equations-containing-sine", weight: 0.3 },
    { topic: "elementary-trigonometric-equations-containing-cosine", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "factor-and-zero-product-trig",
      title: t("Factoring trigonometric equations", "分解因式求解三角方程"),
      explanation: t(
        "Never divide both sides by a trigonometric factor, because that loses solutions; instead factor it out and set each factor equal to zero. Factor out common factors:\n\n$$2\\sin x\\cos x - \\cos x = 0 \\implies \\cos x(2\\sin x - 1) = 0$$\n\n$$\\cos x = 0 \\implies x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}, \\qquad \\sin x = \\frac{1}{2} \\implies x = \\frac{\\pi}{6}, \\; \\frac{5\\pi}{6}$$",
        "不要把两边同除以一个三角因式，因为那样会丢掉解；应把它提出来，令每个因式等于零。提出公因式：\n\n$$2\\sin x\\cos x - \\cos x = 0 \\implies \\cos x(2\\sin x - 1) = 0$$\n\n$$\\cos x = 0 \\implies x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}, \\qquad \\sin x = \\frac{1}{2} \\implies x = \\frac{\\pi}{6}, \\; \\frac{5\\pi}{6}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            expr: "2\\sin x\\cos x - \\cos x = 0",
            ans: "\\frac{\\pi}{6}, \\frac{\\pi}{2}, \\frac{5\\pi}{6}, \\frac{3\\pi}{2}",
            wrong: [
              "\\frac{\\pi}{6}, \\frac{5\\pi}{6}",
              "\\frac{\\pi}{2}, \\frac{3\\pi}{2}",
              "\\frac{\\pi}{3}, \\frac{\\pi}{2}, \\frac{2\\pi}{3}",
            ],
          },
          {
            expr: "2\\sin x\\cos x + \\cos x = 0",
            ans: "\\frac{\\pi}{2}, \\frac{7\\pi}{6}, \\frac{3\\pi}{2}, \\frac{11\\pi}{6}",
            wrong: [
              "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
              "\\frac{\\pi}{2}, \\frac{3\\pi}{2}",
              "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{\\pi}{2}",
            ],
          },
          {
            expr: "2\\sin x\\cos x - \\sin x = 0",
            ans: "0, \\frac{\\pi}{3}, \\pi, \\frac{5\\pi}{3}",
            wrong: ["0, \\pi", "\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, 0"],
          },
          {
            expr: "2\\sin x\\cos x + \\sin x = 0",
            ans: "0, \\frac{2\\pi}{3}, \\pi, \\frac{4\\pi}{3}",
            wrong: ["0, \\pi", "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{3}, \\pi, \\frac{5\\pi}{3}"],
          },
          { expr: "\\sin^2 x - \\sin x = 0", ans: "0, \\frac{\\pi}{2}, \\pi", wrong: ["0, \\pi", "\\frac{\\pi}{2}", "0, \\frac{\\pi}{2}"] },
          {
            expr: "\\cos^2 x - \\cos x = 0",
            ans: "0, \\frac{\\pi}{2}, \\frac{3\\pi}{2}",
            wrong: ["0, \\pi", "\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "0"],
          },
          {
            expr: "2\\cos^2 x - \\cos x = 0",
            ans: "\\frac{\\pi}{3}, \\frac{\\pi}{2}, \\frac{3\\pi}{2}, \\frac{5\\pi}{3}",
            wrong: ["\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\frac{\\pi}{2}, \\frac{3\\pi}{2}", "\\frac{\\pi}{6}, \\frac{\\pi}{2}"],
          },
          {
            expr: "2\\sin^2 x - \\sin x = 0",
            ans: "0, \\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\pi",
            wrong: ["\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "0, \\pi", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const promptExpr = item.expr.replaceAll("x", v);
        return oneOf(
          rng,
          t(`Solve $${promptExpr}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上解方程 $${promptExpr}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `Factor into product of two expressions equal to zero, then combine solutions: $${v} = ${item.ans}$.`,
            `因式分解为两式之积等于零，再合并各自的解：$${v} = ${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "solve-zero-product-trig-degrees",
      title: t("Solve factored trigonometric equations in degrees", "在角度制下分解因式求解三角方程"),
      explanation: t(
        "Each factor gives its own elementary equation, and the solutions of the original equation are all the solutions of these equations taken together. Factor the equation into a product equal to zero and collect all degree solutions on $[0, 360)$.",
        "每个因式都给出一个基本方程，原方程的解就是这些方程的所有解合在一起。将方程分解因式后令各因式等于零，合并 $[0, 360)$ 上的全部角度解。",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3]);
        const kStr = k === 1 ? "" : `${k}`;
        const item = rng.pick([
          {
            expr: `${2 * k}\\sin(x^{\\circ})\\cos(x^{\\circ}) - ${kStr}\\cos(x^{\\circ}) = 0`,
            ans: ["30", "90", "150", "270"],
            wrong: [
              ["30", "150"],
              ["90", "270"],
              ["60", "90", "120"],
            ],
          },
          {
            expr: `${2 * k}\\sin(x^{\\circ})\\cos(x^{\\circ}) + ${kStr}\\cos(x^{\\circ}) = 0`,
            ans: ["90", "210", "270", "330"],
            wrong: [
              ["210", "330"],
              ["90", "270"],
              ["30", "90", "150"],
            ],
          },
          {
            expr: `${2 * k}\\sin(x^{\\circ})\\cos(x^{\\circ}) - ${kStr}\\sin(x^{\\circ}) = 0`,
            ans: ["0", "60", "180", "300"],
            wrong: [
              ["0", "180"],
              ["60", "300"],
              ["0", "30", "150"],
            ],
          },
          {
            expr: `${2 * k}\\sin(x^{\\circ})\\cos(x^{\\circ}) + ${kStr}\\sin(x^{\\circ}) = 0`,
            ans: ["0", "120", "180", "240"],
            wrong: [
              ["0", "180"],
              ["120", "240"],
              ["0", "60", "300"],
            ],
          },
          {
            expr: `${kStr}\\sin^2(x^{\\circ}) - ${kStr}\\sin(x^{\\circ}) = 0`,
            ans: ["0", "90", "180"],
            wrong: [["0", "180"], ["90"], ["0", "90"]],
          },
          {
            expr: `${kStr}\\cos^2(x^{\\circ}) - ${kStr}\\cos(x^{\\circ}) = 0`,
            ans: ["0", "90", "270"],
            wrong: [["0", "180"], ["90", "270"], ["0"]],
          },
          {
            expr: `${2 * k}\\cos^2(x^{\\circ}) - ${kStr}\\cos(x^{\\circ}) = 0`,
            ans: ["60", "90", "270", "300"],
            wrong: [
              ["60", "300"],
              ["90", "270"],
              ["30", "90"],
            ],
          },
          {
            expr: `${2 * k}\\sin^2(x^{\\circ}) - ${kStr}\\sin(x^{\\circ}) = 0`,
            ans: ["0", "30", "150", "180"],
            wrong: [
              ["30", "150"],
              ["0", "180"],
              ["60", "120"],
            ],
          },
          {
            expr: `${kStr}\\tan^2(x^{\\circ}) - ${kStr}\\tan(x^{\\circ}) = 0`,
            ans: ["0", "45", "180", "225"],
            wrong: [
              ["0", "180"],
              ["45", "225"],
              ["45", "135"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const promptExpr = item.expr.replaceAll("x", v);
        const ansStr = item.ans.join(", ");
        return solutionsProblem({
          prompt: t(`Solve $${promptExpr}$ for $${v} \\in [0, 360)$.`, `在 $${v} \\in [0, 360)$ 上解方程 $${promptExpr}$。`),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: t(
            `Factoring and setting each factor to zero gives $${v} = ${ansStr}$ in $[0, 360)$.`,
            `提取公因式并令各因式为零，在 $[0, 360)$ 上解得 $${v} = ${ansStr}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 4.15.3 Quadratic equations in sine or cosine ───────────────────────────

/** quadraticTrigonometricEquationsContainingSineOrCosine covers quadratic forms. */
export const quadraticTrigonometricEquationsContainingSineOrCosine: TopicDef = {
  id: "quadratic-trigonometric-equations-containing-sine-or-cosine",
  title: t("Quadratic Trigonometric Equations Containing Sine or Cosine", "含正弦或余弦的一元二次三角方程"),
  summary: t(
    "Solve quadratic equations in sin(x) or cos(x), substituting identities such as sin²(x) = 1 - cos²(x) when needed.",
    "求解正弦或余弦的一元二次方程，必要时利用 sin²(x) = 1 - cos²(x) 进行恒等转化。",
  ),
  prerequisites: [
    "solving-trigonometric-equations-using-the-zero-product-property",
    "simplifying-expressions-using-the-pythagorean-identity",
  ],
  encompasses: [
    { topic: "solving-trigonometric-equations-using-the-zero-product-property", weight: 0.5 },
    { topic: "simplifying-expressions-using-the-pythagorean-identity", weight: 0.3 },
  ],
  xp: 20,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "solve-quadratic-sin-cos-equations",
      title: t("Solve quadratic equations in sin or cos on [0, 2π)", "在 [0, 2π) 上求解正弦或余弦二次方程"),
      explanation: t(
        "Treat the trigonometric function as the unknown of a quadratic, factor or use the formula, and discard any value outside the range from minus one to one. For $2\\sin^{2} x - \\sin x - 1 = 0$:\n\n$$(2\\sin x + 1)(\\sin x - 1) = 0 \\implies \\sin x = -\\frac{1}{2} \\text{ or } \\sin x = 1$$\n\n$$x = \\frac{7\\pi}{6}, \\; \\frac{11\\pi}{6}, \\; \\frac{\\pi}{2}$$",
        "把三角函数当作二次方程的未知数，因式分解或用求根公式求解，并舍去不在 −1 到 1 之间的值。对于 $2\\sin^{2} x - \\sin x - 1 = 0$：\n\n$$(2\\sin x + 1)(\\sin x - 1) = 0 \\implies \\sin x = -\\frac{1}{2} \\text{ 或 } \\sin x = 1$$\n\n$$x = \\frac{7\\pi}{6}, \\; \\frac{11\\pi}{6}, \\; \\frac{\\pi}{2}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            expr: "2\\sin^2 x - \\sin x - 1 = 0",
            ans: "\\frac{\\pi}{2}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: [
              "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{3\\pi}{2}",
              "\\frac{\\pi}{2}, \\frac{5\\pi}{6}",
              "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            ],
          },
          {
            expr: "2\\sin^2 x + \\sin x - 1 = 0",
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{3\\pi}{2}",
            wrong: ["\\frac{\\pi}{2}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}", "\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{3\\pi}{2}"],
          },
          {
            expr: "2\\cos^2 x - \\cos x - 1 = 0",
            ans: "0, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}",
            wrong: [
              "\\pi, \\frac{\\pi}{3}, \\frac{5\\pi}{3}",
              "0, \\frac{\\pi}{3}, \\frac{5\\pi}{3}",
              "\\frac{2\\pi}{3}, \\frac{4\\pi}{3}",
            ],
          },
          {
            expr: "2\\cos^2 x + \\cos x - 1 = 0",
            ans: "\\frac{\\pi}{3}, \\pi, \\frac{5\\pi}{3}",
            wrong: ["0, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "\\pi"],
          },
          {
            expr: "4\\sin^2 x - 1 = 0",
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: [
              "\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
              "\\frac{\\pi}{6}, \\frac{5\\pi}{6}",
              "\\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            ],
          },
          {
            expr: "4\\cos^2 x - 3 = 0",
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: [
              "\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
              "\\frac{\\pi}{6}, \\frac{11\\pi}{6}",
              "\\frac{5\\pi}{6}, \\frac{7\\pi}{6}",
            ],
          },
          {
            expr: "2\\cos^2 x + 3\\sin x - 3 = 0",
            ans: "\\frac{\\pi}{6}, \\frac{\\pi}{2}, \\frac{5\\pi}{6}",
            wrong: ["\\frac{\\pi}{6}, \\frac{5\\pi}{6}", "\\frac{\\pi}{2}", "\\frac{\\pi}{3}, \\frac{2\\pi}{3}"],
          },
          {
            expr: "2\\sin^2 x - \\cos x - 1 = 0",
            ans: "\\frac{\\pi}{3}, \\pi, \\frac{5\\pi}{3}",
            wrong: ["0, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{3}, \\frac{5\\pi}{3}", "0, \\pi"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const promptExpr = item.expr.replaceAll("x", v);
        return oneOf(
          rng,
          t(`Solve $${promptExpr}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上解方程 $${promptExpr}$。`),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `Treat as a quadratic in $\\sin ${v}$ or $\\cos ${v}$, factor, and solve each factor: $${v} = ${item.ans}$.`,
            `视为关于 $\\sin ${v}$ 或 $\\cos ${v}$ 的二次方程因式分解，分别求解：$${v} = ${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "solve-quadratic-sin-cos-degrees",
      title: t("Solve quadratic equations in sin or cos in degrees", "在角度制下求解正弦或余弦二次方程"),
      explanation: t(
        "Solve the quadratic for the function value first, then turn each valid value into angles using reference angles and the signs in each quadrant. Factor the quadratic in $\\sin(x^{\\circ})$ or $\\cos(x^{\\circ})$ and find all degree solutions in $[0, 360)$.",
        "先解二次方程求出函数值，再用参考角和各象限的符号把每个有效值化为角度。对关于 $\\sin(x^{\\circ})$ 或 $\\cos(x^{\\circ})$ 的二次方程分解因式，求出 $[0, 360)$ 内的全部角度解。",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3]);
        const kStr = k === 1 ? "" : `${k}`;
        const item = rng.pick([
          {
            expr: `${2 * k}\\sin^2(x^{\\circ}) - ${kStr}\\sin(x^{\\circ}) - ${k} = 0`,
            ans: ["90", "210", "330"],
            wrong: [
              ["30", "150", "270"],
              ["90", "150"],
              ["210", "330"],
            ],
          },
          {
            expr: `${2 * k}\\sin^2(x^{\\circ}) + ${kStr}\\sin(x^{\\circ}) - ${k} = 0`,
            ans: ["30", "150", "270"],
            wrong: [["90", "210", "330"], ["30", "150"], ["270"]],
          },
          {
            expr: `${2 * k}\\cos^2(x^{\\circ}) - ${kStr}\\cos(x^{\\circ}) - ${k} = 0`,
            ans: ["0", "120", "240"],
            wrong: [
              ["60", "180", "300"],
              ["0", "60", "300"],
              ["120", "240"],
            ],
          },
          {
            expr: `${2 * k}\\cos^2(x^{\\circ}) + ${kStr}\\cos(x^{\\circ}) - ${k} = 0`,
            ans: ["60", "180", "300"],
            wrong: [["0", "120", "240"], ["60", "300"], ["180"]],
          },
          {
            expr: `${4 * k}\\sin^2(x^{\\circ}) - ${k} = 0`,
            ans: ["30", "150", "210", "330"],
            wrong: [
              ["60", "120", "240", "300"],
              ["30", "150"],
              ["210", "330"],
            ],
          },
          {
            expr: `${4 * k}\\cos^2(x^{\\circ}) - ${3 * k} = 0`,
            ans: ["30", "150", "210", "330"],
            wrong: [
              ["60", "120", "240", "300"],
              ["30", "330"],
              ["150", "210"],
            ],
          },
          {
            expr: `${2 * k}\\cos^2(x^{\\circ}) + ${3 * k}\\sin(x^{\\circ}) - ${3 * k} = 0`,
            ans: ["30", "90", "150"],
            wrong: [["30", "150"], ["90"], ["60", "120"]],
          },
          {
            expr: `${2 * k}\\sin^2(x^{\\circ}) - ${kStr}\\cos(x^{\\circ}) - ${k} = 0`,
            ans: ["60", "180", "300"],
            wrong: [
              ["0", "120", "240"],
              ["60", "300"],
              ["0", "180"],
            ],
          },
          {
            expr: `${2 * k}\\sin^2(x^{\\circ}) - ${3 * k}\\sin(x^{\\circ}) + ${k} = 0`,
            ans: ["30", "90", "150"],
            wrong: [
              ["30", "150"],
              ["90", "270"],
              ["60", "90", "120"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const promptExpr = item.expr.replaceAll("x", v);
        const ansStr = item.ans.join(", ");
        return solutionsProblem({
          prompt: t(`Solve $${promptExpr}$ for $${v} \\in [0, 360)$.`, `在 $${v} \\in [0, 360)$ 上解方程 $${promptExpr}$。`),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: t(
            `Factor the quadratic equation and solve each branch in $[0, 360)$ to get $${v} = ${ansStr}$.`,
            `将二次方程分解因式并在 $[0, 360)$ 内分别求解，得 $${v} = ${ansStr}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 4.15.4 Quadratic equations in tangent or cotangent ─────────────────────

/** quadraticTrigonometricEquationsContainingTangentOrCotangent covers tangent quadratics. */
export const quadraticTrigonometricEquationsContainingTangentOrCotangent: TopicDef = {
  id: "quadratic-trigonometric-equations-containing-tangent-or-cotangent",
  title: t("Quadratic Trigonometric Equations Containing Tangent or Cotangent", "含正切或余切的一元二次三角方程"),
  summary: t(
    "Solve quadratic equations in tan(x) or cot(x), utilizing identities like 1 + tan²(x) = sec²(x) when appropriate.",
    "求解正切或余切的一元二次三角方程，必要时利用 1 + tan²(x) = sec²(x) 化简。",
  ),
  prerequisites: [
    "quadratic-trigonometric-equations-containing-sine-or-cosine",
    "simplifying-expressions-using-the-secant-tangent-identity",
  ],
  encompasses: [{ topic: "quadratic-trigonometric-equations-containing-sine-or-cosine", weight: 0.5 }],
  xp: 20,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "solve-quadratic-tangent-cotangent-equations",
      title: t("Solve quadratic equations in tangent on [0, 2π)", "在 [0, 2π) 上求解正切二次方程"),
      explanation: t(
        "Tangent can take any real value, so every real root of the quadratic gives solutions, two in each full turn. For $\\tan^{2} x - 3 = 0$:\n\n$$\\tan x = \\pm \\sqrt{3} \\implies x = \\frac{\\pi}{3}, \\; \\frac{2\\pi}{3}, \\; \\frac{4\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\nIf mixed with $\\sec^{2} x$, substitute $\\sec^{2} x = 1 + \\tan^{2} x$.",
        "正切可以取任意实数值，所以二次方程的每个实根都给出解，每一整周内有两个。对于 $\\tan^{2} x - 3 = 0$：\n\n$$\\tan x = \\pm \\sqrt{3} \\implies x = \\frac{\\pi}{3}, \\; \\frac{2\\pi}{3}, \\; \\frac{4\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\n若含有 $\\sec^{2} x$，代入 $\\sec^{2} x = 1 + \\tan^{2} x$ 化为二次方程。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            expr: "\\tan^2 x - 3 = 0",
            ans: "\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
            wrong: [
              "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
              "\\frac{\\pi}{3}, \\frac{4\\pi}{3}",
              "\\frac{2\\pi}{3}, \\frac{5\\pi}{3}",
            ],
          },
          {
            expr: "3\\tan^2 x - 1 = 0",
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: [
              "\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
              "\\frac{\\pi}{6}, \\frac{7\\pi}{6}",
              "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}",
            ],
          },
          {
            expr: "\\tan^2 x - 1 = 0",
            ans: "\\frac{\\pi}{4}, \\frac{3\\pi}{4}, \\frac{5\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}", "\\frac{\\pi}{4}, \\frac{3\\pi}{4}"],
          },
          {
            expr: "\\tan^2 x - \\sqrt{3}\\tan x = 0",
            ans: "0, \\frac{\\pi}{3}, \\pi, \\frac{4\\pi}{3}",
            wrong: ["0, \\pi", "\\frac{\\pi}{3}, \\frac{4\\pi}{3}", "\\frac{\\pi}{6}, \\pi, \\frac{7\\pi}{6}"],
          },
          {
            expr: "\\sec^2 x - 2\\tan x = 4",
            ans: "\\text{Substitute } 1 + \\tan^2 x: \\frac{3\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: ["\\frac{\\pi}{4}, \\frac{5\\pi}{4}", "\\frac{\\pi}{4}, \\frac{3\\pi}{4}", "0, \\pi"],
          },
          {
            expr: "2\\sec^2 x + \\tan^2 x - 5 = 0",
            ans: "\\frac{\\pi}{4}, \\frac{3\\pi}{4}, \\frac{5\\pi}{4}, \\frac{7\\pi}{4}",
            wrong: [
              "\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
              "\\frac{\\pi}{4}, \\frac{5\\pi}{4}",
              "\\frac{\\pi}{6}, \\frac{5\\pi}{6}",
            ],
          },
          {
            expr: "\\tan^2 x + (1 - \\sqrt{3})\\tan x - \\sqrt{3} = 0",
            ans: "\\frac{\\pi}{3}, \\frac{3\\pi}{4}, \\frac{4\\pi}{3}, \\frac{7\\pi}{4}",
            wrong: [
              "\\frac{\\pi}{4}, \\frac{\\pi}{3}, \\frac{5\\pi}{4}, \\frac{4\\pi}{3}",
              "\\frac{\\pi}{3}, \\frac{4\\pi}{3}",
              "\\frac{3\\pi}{4}, \\frac{7\\pi}{4}",
            ],
          },
          {
            expr: "\\cot^2 x - 3 = 0",
            ans: "\\frac{\\pi}{6}, \\frac{5\\pi}{6}, \\frac{7\\pi}{6}, \\frac{11\\pi}{6}",
            wrong: [
              "\\frac{\\pi}{3}, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\frac{5\\pi}{3}",
              "\\frac{\\pi}{6}, \\frac{7\\pi}{6}",
              "\\frac{5\\pi}{6}, \\frac{11\\pi}{6}",
            ],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "t", "u", "z"]);
        const promptExpr = item.expr.replaceAll("x", v);
        // Clean ans display
        const cleanAns = item.ans.replace("\\text{Substitute } 1 + \\tan^2 x: ", "");
        return oneOf(
          rng,
          t(`Solve $${promptExpr}$ on $[0, 2\\pi)$.`, `在 $[0, 2\\pi)$ 上解方程 $${promptExpr}$。`),
          t(`$${v} = ${cleanAns}$`, `$${v} = ${cleanAns}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `Solve the quadratic in $\\tan ${v}$ (substituting $1 + \\tan^2 ${v} = \\sec^2 ${v}$ if necessary): $${v} = ${cleanAns}$.`,
            `求解关于 $\\tan ${v}$ 的二次方程（必要时代入 $1 + \\tan^2 ${v} = \\sec^2 ${v}$）：$${v} = ${cleanAns}$。`,
          ),
        );
      },
    },
    {
      id: "solve-quadratic-tangent-cotangent-degrees",
      title: t("Solve quadratic equations in tangent or cotangent in degrees", "在角度制下求解正切或余切二次方程"),
      explanation: t(
        "Solve the quadratic for the value of the function, then use the period of one hundred eighty degrees to list every angle in a full turn. Solve the quadratic equation for $\\tan(x^{\\circ})$ or $\\cot(x^{\\circ})$ and list all degree solutions in $[0, 360)$.",
        "先解二次方程求出函数值，再利用 180° 的周期写出一整周内的所有角。求出 $\\tan(x^{\\circ})$ 或 $\\cot(x^{\\circ})$ 的二次方程解，并列出 $[0, 360)$ 内的所有角度解。",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3]);
        const kStr = k === 1 ? "" : `${k}`;
        const item = rng.pick([
          {
            expr: `${kStr}\\tan^2(x^{\\circ}) - ${3 * k} = 0`,
            ans: ["60", "120", "240", "300"],
            wrong: [
              ["30", "150", "210", "330"],
              ["60", "240"],
              ["120", "300"],
            ],
          },
          {
            expr: `${3 * k}\\tan^2(x^{\\circ}) - ${k} = 0`,
            ans: ["30", "150", "210", "330"],
            wrong: [
              ["60", "120", "240", "300"],
              ["30", "210"],
              ["150", "330"],
            ],
          },
          {
            expr: `${kStr}\\tan^2(x^{\\circ}) - ${k} = 0`,
            ans: ["45", "135", "225", "315"],
            wrong: [
              ["45", "225"],
              ["135", "315"],
              ["45", "135"],
            ],
          },
          {
            expr: `${kStr}\\tan^2(x^{\\circ}) - ${kStr}\\sqrt{3}\\tan(x^{\\circ}) = 0`,
            ans: ["0", "60", "180", "240"],
            wrong: [
              ["0", "180"],
              ["60", "240"],
              ["0", "30", "180", "210"],
            ],
          },
          {
            expr: `${kStr}\\tan^2(x^{\\circ}) + ${kStr}\\sqrt{3}\\tan(x^{\\circ}) = 0`,
            ans: ["0", "120", "180", "300"],
            wrong: [
              ["0", "180"],
              ["120", "300"],
              ["0", "60", "180", "240"],
            ],
          },
          {
            expr: `${kStr}\\sec^2(x^{\\circ}) - ${2 * k}\\tan(x^{\\circ}) = ${4 * k}`,
            ans: ["135", "315"],
            wrong: [
              ["45", "225"],
              ["45", "135"],
              ["0", "180"],
            ],
          },
          {
            expr: `${2 * k}\\sec^2(x^{\\circ}) + ${kStr}\\tan^2(x^{\\circ}) - ${5 * k} = 0`,
            ans: ["45", "135", "225", "315"],
            wrong: [
              ["60", "120", "240", "300"],
              ["45", "225"],
              ["30", "150"],
            ],
          },
          {
            expr: `${kStr}\\cot^2(x^{\\circ}) - ${3 * k} = 0`,
            ans: ["30", "150", "210", "330"],
            wrong: [
              ["60", "120", "240", "300"],
              ["30", "210"],
              ["150", "330"],
            ],
          },
          {
            expr: `${kStr}\\cot^2(x^{\\circ}) - ${k} = 0`,
            ans: ["45", "135", "225", "315"],
            wrong: [
              ["45", "225"],
              ["135", "315"],
              ["30", "150"],
            ],
          },
        ]);
        const v = rng.pick(["x", "t", "u"]);
        const promptExpr = item.expr.replaceAll("x", v);
        const ansStr = item.ans.join(", ");
        return solutionsProblem({
          prompt: t(`Solve $${promptExpr}$ for $${v} \\in [0, 360)$.`, `在 $${v} \\in [0, 360)$ 上解方程 $${promptExpr}$。`),
          variable: v,
          values: item.ans,
          wrong: item.wrong,
          solution: t(
            `Solve the quadratic equation in $\\tan(${v}^{\\circ})$ or $\\cot(${v}^{\\circ})$ to obtain $${v} = ${ansStr}$ in $[0, 360)$.`,
            `求解关于 $\\tan(${v}^{\\circ})$ 或 $\\cot(${v}^{\\circ})$ 的二次方程，在 $[0, 360)$ 内得 $${v} = ${ansStr}$。`,
          ),
        });
      },
    },
  ],
};

// ─── Export array: all 15 topics, modules 4.13–4.15 ──────────────────────────

export const precalculusTrigonometricEquationTopics: readonly TopicDef[] = [
  elementaryTrigonometricEquationsContainingSine,
  elementaryTrigonometricEquationsContainingCosine,
  elementaryTrigonometricEquationsContainingTangent,
  elementaryTrigonometricEquationsContainingSecant,
  elementaryTrigonometricEquationsContainingCosecant,
  elementaryTrigonometricEquationsContainingCotangent,
  generalSolutionsOfElementaryTrigonometricEquations,
  generalSolutionsOfTrigonometricEquationsWithTransformedFunctions,
  trigonometricEquationsContainingTransformedSineFunctions,
  trigonometricEquationsContainingTransformedCosineFunctions,
  trigonometricEquationsContainingTransformedTangentFunctions,
  solvingTrigonometricEquationsUsingTheSinCosTanIdentity,
  solvingTrigonometricEquationsUsingTheZeroProductProperty,
  quadraticTrigonometricEquationsContainingSineOrCosine,
  quadraticTrigonometricEquationsContainingTangentOrCotangent,
];
