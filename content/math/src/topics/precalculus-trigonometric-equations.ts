import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { choiceProblem } from "../problems.ts";

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
        "To solve $\\sin x = c$ on $[0^{\\circ}, 360^{\\circ})$:\n\n1. Find the reference angle $\\alpha = \\arcsin|c|$.\n2. Sine is positive in Quadrants I and II ($x = \\alpha, 180^{\\circ} - \\alpha$) and negative in Quadrants III and IV ($x = 180^{\\circ} + \\alpha, 360^{\\circ} - \\alpha$).\n\nFor example, $\\sin x = \\frac{1}{2}$ has reference angle $30^{\\circ}$, giving solutions $30^{\\circ}$ and $150^{\\circ}$.",
        "在 $[0^{\\circ}, 360^{\\circ})$ 上求解 $\\sin x = c$：\n\n1. 求参考角 $\\alpha = \\arcsin|c|$。\n2. 正弦在第一、二象限为正（$x = \\alpha, 180^{\\circ} - \\alpha$），在第三、四象限为负（$x = 180^{\\circ} + \\alpha, 360^{\\circ} - \\alpha$）。\n\n例如，$\\sin x = \\frac{1}{2}$ 的参考角为 $30^{\\circ}$，解为 $30^{\\circ}$ 与 $150^{\\circ}$。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "0^\\circ, 180^\\circ", wrong: ["0^\\circ, 360^\\circ", "90^\\circ, 270^\\circ", "0^\\circ, 90^\\circ"] },
          { val: "1", ans: "90^\\circ", wrong: ["90^\\circ, 270^\\circ", "0^\\circ, 180^\\circ", "270^\\circ"] },
          { val: "-1", ans: "270^\\circ", wrong: ["90^\\circ", "180^\\circ", "90^\\circ, 270^\\circ"] },
          {
            val: "\\frac{1}{2}",
            ans: "30^\\circ, 150^\\circ",
            wrong: ["60^\\circ, 120^\\circ", "30^\\circ, 330^\\circ", "30^\\circ, 210^\\circ"],
          },
          {
            val: "-\\frac{1}{2}",
            ans: "210^\\circ, 330^\\circ",
            wrong: ["150^\\circ, 210^\\circ", "240^\\circ, 300^\\circ", "30^\\circ, 330^\\circ"],
          },
          {
            val: "\\frac{\\sqrt{2}}{2}",
            ans: "45^\\circ, 135^\\circ",
            wrong: ["45^\\circ, 315^\\circ", "45^\\circ, 225^\\circ", "135^\\circ, 225^\\circ"],
          },
          {
            val: "-\\frac{\\sqrt{2}}{2}",
            ans: "225^\\circ, 315^\\circ",
            wrong: ["135^\\circ, 315^\\circ", "45^\\circ, 225^\\circ", "225^\\circ, 270^\\circ"],
          },
          {
            val: "\\frac{\\sqrt{3}}{2}",
            ans: "60^\\circ, 120^\\circ",
            wrong: ["30^\\circ, 150^\\circ", "60^\\circ, 300^\\circ", "120^\\circ, 240^\\circ"],
          },
          {
            val: "-\\frac{\\sqrt{3}}{2}",
            ans: "240^\\circ, 300^\\circ",
            wrong: ["210^\\circ, 330^\\circ", "120^\\circ, 240^\\circ", "300^\\circ, 330^\\circ"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "\\alpha"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = coeff === 1 ? item.val : `${coeff}\\left(${item.val}\\right)`;
        return oneOf(
          rng,
          t(
            `Solve $${coeffLatex}\\sin ${v} = ${rhs}$ for $${v} \\in [0^\\circ, 360^\\circ)$.`,
            `在 $${v} \\in [0^\\circ, 360^\\circ)$ 上解方程 $${coeffLatex}\\sin ${v} = ${rhs}$。`,
          ),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `Dividing by coefficient gives $\\sin ${v} = ${item.val}$. Looking for all solutions in $[0^\\circ, 360^\\circ)$ gives $${v} = ${item.ans}$.`,
            `两边除以系数得 $\\sin ${v} = ${item.val}$。在 $[0^\\circ, 360^\\circ)$ 上求得解为 $${v} = ${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "solve-elementary-sine-equations-radians",
      title: t("Solve sin(x) = c in radians on [0, 2π)", "在 [0, 2π) 内求解正弦方程（弧度制）"),
      explanation: t(
        "For $\\sin x = c$ on $[0, 2\\pi)$:\n\n$$\\sin x = \\frac{\\sqrt{3}}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{2\\pi}{3}$$\n\n$$\\sin x = -\\frac{1}{2} \\implies x = \\frac{7\\pi}{6}, \\; \\frac{11\\pi}{6}$$",
        "在 $[0, 2\\pi)$ 上求解 $\\sin x = c$：\n\n$$\\sin x = \\frac{\\sqrt{3}}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{2\\pi}{3}$$\n\n$$\\sin x = -\\frac{1}{2} \\implies x = \\frac{7\\pi}{6}, \\; \\frac{11\\pi}{6}$$",
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
  encompasses: [{ topic: "elementary-trigonometric-equations-containing-sine", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "solve-elementary-cosine-equations-degrees",
      title: t("Solve cos(x) = c in degrees on [0°, 360°)", "在 [0°, 360°) 内求解余弦方程（角度制）"),
      explanation: t(
        "Cosine is positive in Quadrants I and IV ($x = \\alpha, 360^{\\circ} - \\alpha$) and negative in Quadrants II and III ($x = 180^{\\circ} - \\alpha, 180^{\\circ} + \\alpha$).\n\nFor example, $\\cos x = \\frac{1}{2} \\implies x = 60^{\\circ}, 300^{\\circ}$.",
        "余弦在第一、四象限为正（$x = \\alpha, 360^{\\circ} - \\alpha$），在第二、三象限为负（$x = 180^{\\circ} - \\alpha, 180^{\\circ} + \\alpha$）。\n\n例如，$\\cos x = \\frac{1}{2} \\implies x = 60^{\\circ}, 300^{\\circ}$。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "90^\\circ, 270^\\circ", wrong: ["0^\\circ, 180^\\circ", "90^\\circ, 180^\\circ", "0^\\circ, 360^\\circ"] },
          { val: "1", ans: "0^\\circ", wrong: ["90^\\circ", "180^\\circ", "0^\\circ, 180^\\circ"] },
          { val: "-1", ans: "180^\\circ", wrong: ["0^\\circ", "270^\\circ", "90^\\circ, 270^\\circ"] },
          {
            val: "\\frac{1}{2}",
            ans: "60^\\circ, 300^\\circ",
            wrong: ["30^\\circ, 330^\\circ", "60^\\circ, 120^\\circ", "120^\\circ, 240^\\circ"],
          },
          {
            val: "-\\frac{1}{2}",
            ans: "120^\\circ, 240^\\circ",
            wrong: ["60^\\circ, 300^\\circ", "150^\\circ, 210^\\circ", "120^\\circ, 300^\\circ"],
          },
          {
            val: "\\frac{\\sqrt{2}}{2}",
            ans: "45^\\circ, 315^\\circ",
            wrong: ["45^\\circ, 135^\\circ", "135^\\circ, 225^\\circ", "45^\\circ, 225^\\circ"],
          },
          {
            val: "-\\frac{\\sqrt{2}}{2}",
            ans: "135^\\circ, 225^\\circ",
            wrong: ["45^\\circ, 315^\\circ", "135^\\circ, 315^\\circ", "225^\\circ, 315^\\circ"],
          },
          {
            val: "\\frac{\\sqrt{3}}{2}",
            ans: "30^\\circ, 330^\\circ",
            wrong: ["60^\\circ, 300^\\circ", "30^\\circ, 150^\\circ", "150^\\circ, 210^\\circ"],
          },
          {
            val: "-\\frac{\\sqrt{3}}{2}",
            ans: "150^\\circ, 210^\\circ",
            wrong: ["120^\\circ, 240^\\circ", "30^\\circ, 330^\\circ", "210^\\circ, 330^\\circ"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "\\alpha"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = coeff === 1 ? item.val : `${coeff}\\left(${item.val}\\right)`;
        return oneOf(
          rng,
          t(
            `Solve $${coeffLatex}\\cos ${v} = ${rhs}$ for $${v} \\in [0^\\circ, 360^\\circ)$.`,
            `在 $${v} \\in [0^\\circ, 360^\\circ)$ 上解方程 $${coeffLatex}\\cos ${v} = ${rhs}$。`,
          ),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `Divide by coefficient: $\\cos ${v} = ${item.val}$. Solutions in $[0^\\circ, 360^\\circ)$ are $${v} = ${item.ans}$.`,
            `除以系数得 $\\cos ${v} = ${item.val}$。在 $[0^\\circ, 360^\\circ)$ 上的解为 $${v} = ${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "solve-elementary-cosine-equations-radians",
      title: t("Solve cos(x) = c in radians on [0, 2π)", "在 [0, 2π) 内求解余弦方程（弧度制）"),
      explanation: t(
        "For $\\cos x = c$ on $[0, 2\\pi)$:\n\n$$\\cos x = \\frac{1}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\n$$\\cos x = -\\frac{\\sqrt{3}}{2} \\implies x = \\frac{5\\pi}{6}, \\; \\frac{7\\pi}{6}$$",
        "在 $[0, 2\\pi)$ 上求解 $\\cos x = c$：\n\n$$\\cos x = \\frac{1}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\n$$\\cos x = -\\frac{\\sqrt{3}}{2} \\implies x = \\frac{5\\pi}{6}, \\; \\frac{7\\pi}{6}$$",
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
  encompasses: [{ topic: "elementary-trigonometric-equations-containing-sine", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "solve-elementary-tangent-equations-degrees",
      title: t("Solve tan(x) = c in degrees on [0°, 360°)", "在 [0°, 360°) 内求解正切方程（角度制）"),
      explanation: t(
        "Tangent has period $180^{\\circ}$. It is positive in Quadrants I and III ($x = \\alpha, 180^{\\circ} + \\alpha$) and negative in Quadrants II and IV ($x = 180^{\\circ} - \\alpha, 360^{\\circ} - \\alpha$).\n\nFor example, $\\tan x = 1 \\implies x = 45^{\\circ}, 225^{\\circ}$.",
        "正切函数的周期为 $180^{\\circ}$。在第一、三象限为正（$x = \\alpha, 180^{\\circ} + \\alpha$），在第二、四象限为负（$x = 180^{\\circ} - \\alpha, 360^{\\circ} - \\alpha$）。\n\n例如，$\\tan x = 1 \\implies x = 45^{\\circ}, 225^{\\circ}$。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "0^\\circ, 180^\\circ", wrong: ["90^\\circ, 270^\\circ", "0^\\circ, 360^\\circ", "180^\\circ"] },
          { val: "1", ans: "45^\\circ, 225^\\circ", wrong: ["45^\\circ, 135^\\circ", "135^\\circ, 315^\\circ", "45^\\circ, 315^\\circ"] },
          {
            val: "-1",
            ans: "135^\\circ, 315^\\circ",
            wrong: ["45^\\circ, 225^\\circ", "135^\\circ, 225^\\circ", "225^\\circ, 315^\\circ"],
          },
          {
            val: "\\sqrt{3}",
            ans: "60^\\circ, 240^\\circ",
            wrong: ["30^\\circ, 210^\\circ", "60^\\circ, 120^\\circ", "120^\\circ, 300^\\circ"],
          },
          {
            val: "-\\sqrt{3}",
            ans: "120^\\circ, 300^\\circ",
            wrong: ["60^\\circ, 240^\\circ", "150^\\circ, 330^\\circ", "240^\\circ, 300^\\circ"],
          },
          {
            val: "\\frac{\\sqrt{3}}{3}",
            ans: "30^\\circ, 210^\\circ",
            wrong: ["60^\\circ, 240^\\circ", "30^\\circ, 150^\\circ", "150^\\circ, 330^\\circ"],
          },
          {
            val: "-\\frac{\\sqrt{3}}{3}",
            ans: "150^\\circ, 330^\\circ",
            wrong: ["30^\\circ, 210^\\circ", "120^\\circ, 300^\\circ", "210^\\circ, 330^\\circ"],
          },
        ]);
        const v = rng.pick(["x", "\\theta", "\\alpha"]);
        const coeff = rng.pick([1, 2, 3, 4]);
        const coeffLatex = coeff === 1 ? "" : `${coeff}`;
        const rhs = coeff === 1 ? item.val : `${coeff}\\left(${item.val}\\right)`;
        return oneOf(
          rng,
          t(
            `Solve $${coeffLatex}\\tan ${v} = ${rhs}$ for $${v} \\in [0^\\circ, 360^\\circ)$.`,
            `在 $${v} \\in [0^\\circ, 360^\\circ)$ 上解方程 $${coeffLatex}\\tan ${v} = ${rhs}$。`,
          ),
          t(`$${v} = ${item.ans}$`, `$${v} = ${item.ans}$`),
          item.wrong.map((w) => t(`$${v} = ${w}$`, `$${v} = ${w}$`)),
          t(
            `We have $\\tan ${v} = ${item.val}$. In $[0^\\circ, 360^\\circ)$, solutions are $${v} = ${item.ans}$.`,
            `方程为 $\\tan ${v} = ${item.val}$。在 $[0^\\circ, 360^\\circ)$ 上的解为 $${v} = ${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "solve-elementary-tangent-equations-radians",
      title: t("Solve tan(x) = c in radians on [0, 2π)", "在 [0, 2π) 内求解正切方程（弧度制）"),
      explanation: t(
        "For $\\tan x = c$ on $[0, 2\\pi)$:\n\n$$\\tan x = \\sqrt{3} \\implies x = \\frac{\\pi}{3}, \\; \\frac{4\\pi}{3}$$\n\n$$\\tan x = -1 \\implies x = \\frac{3\\pi}{4}, \\; \\frac{7\\pi}{4}$$",
        "在 $[0, 2\\pi)$ 上求解 $\\tan x = c$：\n\n$$\\tan x = \\sqrt{3} \\implies x = \\frac{\\pi}{3}, \\; \\frac{4\\pi}{3}$$\n\n$$\\tan x = -1 \\implies x = \\frac{3\\pi}{4}, \\; \\frac{7\\pi}{4}$$",
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
        "Convert using $\\cos x = \\frac{1}{\\sec x}$:\n\n$$\\sec x = 2 \\iff \\cos x = \\frac{1}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\nIf $|c| < 1$, $\\sec x = c$ has no real solution because $|\\sec x| \\ge 1$.",
        "利用 $\\cos x = \\frac{1}{\\sec x}$ 进行转化：\n\n$$\\sec x = 2 \\iff \\cos x = \\frac{1}{2} \\implies x = \\frac{\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\n若 $|c| < 1$，由于 $|\\sec x| \\ge 1$，方程 $\\sec x = c$ 无实数解。",
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
        "Convert using $\\sin x = \\frac{1}{\\csc x}$:\n\n$$\\csc x = 2 \\iff \\sin x = \\frac{1}{2} \\implies x = \\frac{\\pi}{6}, \\; \\frac{5\\pi}{6}$$",
        "利用 $\\sin x = \\frac{1}{\\csc x}$ 进行转化：\n\n$$\\csc x = 2 \\iff \\sin x = \\frac{1}{2} \\implies x = \\frac{\\pi}{6}, \\; \\frac{5\\pi}{6}$$",
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
        "Using $\\tan x = \\frac{1}{\\cot x}$:\n\n$$\\cot x = \\sqrt{3} \\iff \\tan x = \\frac{1}{\\sqrt{3}} \\implies x = \\frac{\\pi}{6}, \\; \\frac{7\\pi}{6}$$\n\nIf $\\cot x = 0$, $\\cos x = 0 \\implies x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}$.",
        "利用 $\\tan x = \\frac{1}{\\cot x}$：\n\n$$\\cot x = \\sqrt{3} \\iff \\tan x = \\frac{1}{\\sqrt{3}} \\implies x = \\frac{\\pi}{6}, \\; \\frac{7\\pi}{6}$$\n\n若 $\\cot x = 0$，则 $\\cos x = 0 \\implies x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}$。",
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
  encompasses: [
    { topic: "elementary-trigonometric-equations-containing-cosine", weight: 0.3 },
    { topic: "elementary-trigonometric-equations-containing-tangent", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "general-solutions-sin-cos-tan",
      title: t("General solution formulas for trigonometric equations", "三角方程通解公式形式"),
      explanation: t(
        "For $k \\in \\mathbb{Z}$:\n\n- $\\sin x = c$: $x = \\alpha + 2k\\pi$ or $x = (\\pi - \\alpha) + 2k\\pi$\n- $\\cos x = c$: $x = \\pm \\alpha + 2k\\pi$\n- $\\tan x = c$: $x = \\alpha + k\\pi$",
        "对于 $k \\in \\mathbb{Z}$：\n\n- $\\sin x = c$：$x = \\alpha + 2k\\pi$ 或 $x = (\\pi - \\alpha) + 2k\\pi$\n- $\\cos x = c$：$x = \\pm \\alpha + 2k\\pi$\n- $\\tan x = c$：$x = \\alpha + k\\pi$",
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
        "For $\\sin(2x) = \\frac{1}{2}$:\n\n$$2x = \\frac{\\pi}{6} + 2k\\pi \\implies x = \\frac{\\pi}{12} + k\\pi$$\n\n$$2x = \\frac{5\\pi}{6} + 2k\\pi \\implies x = \\frac{5\\pi}{12} + k\\pi$$",
        "对于 $\\sin(2x) = \\frac{1}{2}$：\n\n$$2x = \\frac{\\pi}{6} + 2k\\pi \\implies x = \\frac{\\pi}{12} + k\\pi$$\n\n$$2x = \\frac{5\\pi}{6} + 2k\\pi \\implies x = \\frac{5\\pi}{12} + k\\pi$$",
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
        "For $\\sin(2x) = 1$ on $[0, 2\\pi)$:\n\n$$2x \\in [0, 4\\pi) \\implies 2x = \\frac{\\pi}{2}, \\; \\frac{5\\pi}{2} \\implies x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4}$$",
        "在 $[0, 2\\pi)$ 上求解 $\\sin(2x) = 1$：\n\n$$2x \\in [0, 4\\pi) \\implies 2x = \\frac{\\pi}{2}, \\; \\frac{5\\pi}{2} \\implies x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4}$$",
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
        "For $\\cos(2x) = 1$ on $[0, 2\\pi)$:\n\n$$2x = 0, \\; 2\\pi \\implies x = 0, \\; \\pi$$\n\nFor $\\cos(2x) = 0$:\n\n$$2x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}, \\; \\frac{5\\pi}{2}, \\; \\frac{7\\pi}{2} \\implies x = \\frac{\\pi}{4}, \\; \\frac{3\\pi}{4}, \\; \\frac{5\\pi}{4}, \\; \\frac{7\\pi}{4}$$",
        "在 $[0, 2\\pi)$ 上求解 $\\cos(2x) = 1$：\n\n$$2x = 0, \\; 2\\pi \\implies x = 0, \\; \\pi$$\n\n求解 $\\cos(2x) = 0$：\n\n$$2x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}, \\; \\frac{5\\pi}{2}, \\; \\frac{7\\pi}{2} \\implies x = \\frac{\\pi}{4}, \\; \\frac{3\\pi}{4}, \\; \\frac{5\\pi}{4}, \\; \\frac{7\\pi}{4}$$",
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
        "For $\\tan(2x) = 1$ on $[0, \\pi)$:\n\n$$2x \\in [0, 2\\pi) \\implies 2x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4} \\implies x = \\frac{\\pi}{8}, \\; \\frac{5\\pi}{8}$$",
        "在 $[0, \\pi)$ 上求解 $\\tan(2x) = 1$：\n\n$$2x \\in [0, 2\\pi) \\implies 2x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4} \\implies x = \\frac{\\pi}{8}, \\; \\frac{5\\pi}{8}$$",
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
        "Divide both sides by $\\cos x$ (noting $\\cos x \\ne 0$):\n\n$$\\sin x = \\cos x \\implies \\frac{\\sin x}{\\cos x} = 1 \\implies \\tan x = 1 \\implies x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4}$$\n\n$$\\sin x + \\sqrt{3}\\cos x = 0 \\implies \\tan x = -\\sqrt{3} \\implies x = \\frac{2\\pi}{3}, \\; \\frac{5\\pi}{3}$$",
        "两边同除以 $\\cos x$（注意 $\\cos x \\ne 0$）：\n\n$$\\sin x = \\cos x \\implies \\frac{\\sin x}{\\cos x} = 1 \\implies \\tan x = 1 \\implies x = \\frac{\\pi}{4}, \\; \\frac{5\\pi}{4}$$\n\n$$\\sin x + \\sqrt{3}\\cos x = 0 \\implies \\tan x = -\\sqrt{3} \\implies x = \\frac{2\\pi}{3}, \\; \\frac{5\\pi}{3}$$",
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
        "Factor out common factors:\n\n$$2\\sin x\\cos x - \\cos x = 0 \\implies \\cos x(2\\sin x - 1) = 0$$\n\n$$\\cos x = 0 \\implies x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}, \\qquad \\sin x = \\frac{1}{2} \\implies x = \\frac{\\pi}{6}, \\; \\frac{5\\pi}{6}$$",
        "提出公因式：\n\n$$2\\sin x\\cos x - \\cos x = 0 \\implies \\cos x(2\\sin x - 1) = 0$$\n\n$$\\cos x = 0 \\implies x = \\frac{\\pi}{2}, \\; \\frac{3\\pi}{2}, \\qquad \\sin x = \\frac{1}{2} \\implies x = \\frac{\\pi}{6}, \\; \\frac{5\\pi}{6}$$",
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
        "For $2\\sin^{2} x - \\sin x - 1 = 0$:\n\n$$(2\\sin x + 1)(\\sin x - 1) = 0 \\implies \\sin x = -\\frac{1}{2} \\text{ or } \\sin x = 1$$\n\n$$x = \\frac{7\\pi}{6}, \\; \\frac{11\\pi}{6}, \\; \\frac{\\pi}{2}$$",
        "对于 $2\\sin^{2} x - \\sin x - 1 = 0$：\n\n$$(2\\sin x + 1)(\\sin x - 1) = 0 \\implies \\sin x = -\\frac{1}{2} \\text{ 或 } \\sin x = 1$$\n\n$$x = \\frac{7\\pi}{6}, \\; \\frac{11\\pi}{6}, \\; \\frac{\\pi}{2}$$",
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
  encompasses: [
    { topic: "quadratic-trigonometric-equations-containing-sine-or-cosine", weight: 0.5 },
    { topic: "simplifying-expressions-using-the-secant-tangent-identity", weight: 0.3 },
  ],
  xp: 20,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "solve-quadratic-tangent-cotangent-equations",
      title: t("Solve quadratic equations in tangent on [0, 2π)", "在 [0, 2π) 上求解正切二次方程"),
      explanation: t(
        "For $\\tan^{2} x - 3 = 0$:\n\n$$\\tan x = \\pm \\sqrt{3} \\implies x = \\frac{\\pi}{3}, \\; \\frac{2\\pi}{3}, \\; \\frac{4\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\nIf mixed with $\\sec^{2} x$, substitute $\\sec^{2} x = 1 + \\tan^{2} x$.",
        "对于 $\\tan^{2} x - 3 = 0$：\n\n$$\\tan x = \\pm \\sqrt{3} \\implies x = \\frac{\\pi}{3}, \\; \\frac{2\\pi}{3}, \\; \\frac{4\\pi}{3}, \\; \\frac{5\\pi}{3}$$\n\n若含有 $\\sec^{2} x$，代入 $\\sec^{2} x = 1 + \\tan^{2} x$ 化为二次方程。",
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
