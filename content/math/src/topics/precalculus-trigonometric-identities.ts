import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, gcd, Q } from "@ga/subject-math";

import { choiceProblem, numberProblem } from "../problems.ts";

// Precalculus unit 4: Trigonometry (modules 4.9 to 4.12: inverse functions,
// identities, sum/difference formulas, and double-angle formulas).

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** piTex writes c·π in LaTeX. */
function _piTex(c: Coefficient): string {
  const v = toQ(c);
  if (v.isZero()) return "0";
  const n = v.n < 0n ? -v.n : v.n;
  const top = n === 1n ? "pi" : `${n}pi`;
  const body = v.d === 1n ? top : `\frac{${top}}{${v.d}}`;
  return v.sign() < 0 ? `-${body}` : body;
}

/** oneOf builds a multiple-choice problem with options shuffled. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([right.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && seen.add(w.en)).slice(0, 3);
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

/** Pythagorean triples [a, b, c] with a² + b² = c². */
const _triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [7, 24, 25],
  [24, 7, 25],
  [8, 15, 17],
  [15, 8, 17],
];

// ─── 4.9.1 Graphing the inverse sine function ───────────────────────────────

/** graphingTheInverseSineFunction covers domain, range, and properties of arcsin. */
export const graphingTheInverseSineFunction: TopicDef = {
  id: "graphing-the-inverse-sine-function",
  title: t("Graphing the Inverse Sine Function", "反弦函数的图象与性质"),
  summary: t(
    "Describe the domain, range, key points, and symmetry of the inverse sine function y = arcsin(x).",
    "描述反正弦函数 y = arcsin(x) 的定义域、值域、关键点与对称性。",
  ),
  prerequisites: ["graphing-sine-and-cosine", "calculating-the-inverse-of-a-function"],
  encompasses: [{ topic: "calculating-the-inverse-of-a-function", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSF.TF.B.6"],
  knowledgePoints: [
    {
      id: "domain-and-range-of-arcsin",
      title: t("Domain and range of arcsin", "反正弦函数的定义域与值域"),
      explanation: t(
        "Because $\\sin x$ is not one-to-one on the whole real line, its domain is restricted to $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ to define its inverse. Therefore, $y = \\arcsin x$ has:\n\n- **Domain**: $[-1, 1]$\n- **Range**: $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$",
        "由于 $\\sin x$ 在整个实数集上不是单调一一对应的，将其定义域限制在 $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$ 上以定义反函数。因此 $y = \\arcsin x$ 的：\n\n- **定义域**：$[-1, 1]$\n- **值域**：$\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$",
      ),
      generate(rng) {
        const type = rng.pick(["scaled", "shifted", "linear", "range"] as const);
        if (type === "scaled") {
          const a = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20]);
          return oneOf(
            rng,
            t(
              `What is the domain of $f(x) = \\arcsin\\left(\\frac{x}{${a}}\\right)$?`,
              `$f(x) = \\arcsin\\left(\\frac{x}{${a}}\\right)$ 的定义域是什么？`,
            ),
            t(`$[-${a}, ${a}]$`, `$[-${a}, ${a}]$`),
            [t("$[-1, 1]$", "$[-1, 1]$"), t(`$(-${a}, ${a})$`, `$(-${a}, ${a})$`), t("$(-\\infty, \\infty)$", "$(-\\infty, \\infty)$")],
            t(
              `The argument must satisfy $-1 \\le \\frac{x}{${a}} \\le 1$, so the domain is $[- ${a}, ${a}]$.`,
              `输入值必须满足 $-1 \\le \\frac{x}{${a}} \\le 1$，因此定义域为 $[- ${a}, ${a}]$。`,
            ),
          );
        }
        if (type === "shifted") {
          const h = rng.pick([-10, -8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 10]);
          const sign = h > 0 ? `-${h}` : `+${-h}`;
          const left = h - 1;
          const right = h + 1;
          return oneOf(
            rng,
            t(`What is the domain of $f(x) = \\arcsin(x ${sign})$?`, `$f(x) = \\arcsin(x ${sign})$ 的定义域是什么？`),
            t(`$[${left}, ${right}]$`, `$[${left}, ${right}]$`),
            [
              t("$[-1, 1]$", "$[-1, 1]$"),
              t(`$[${left - 1}, ${right + 1}]$`, `$[${left - 1}, ${right + 1}]$`),
              t("$(-\\infty, \\infty)$", "$(-\\infty, \\infty)$"),
            ],
            t(
              `Since $-1 \\le x ${sign} \\le 1$, adding $${h}$ gives $[${left}, ${right}]$.`,
              `由 $-1 \\le x ${sign} \\le 1$，得定义域为 $[${left}, ${right}]$。`,
            ),
          );
        }
        if (type === "linear") {
          const a = rng.pick([2, 3, 4, 5, 6, 7, 8]);
          return oneOf(
            rng,
            t(`What is the domain of $f(x) = \\arcsin(${a}x)$?`, `$f(x) = \\arcsin(${a}x)$ 的定义域是什么？`),
            t(`$\\left[-\\frac{1}{${a}}, \\frac{1}{${a}}\\right]$`, `$\\left[-\\frac{1}{${a}}, \\frac{1}{${a}}\\right]$`),
            [t("$[-1, 1]$", "$[-1, 1]$"), t(`$[-${a}, ${a}]$`, `$[-${a}, ${a}]$`), t("$(-\\infty, \\infty)$", "$(-\\infty, \\infty)$")],
            t(
              `Solve $-1 \\le ${a}x \\le 1 \\implies -\\frac{1}{${a}} \\le x \\le \\frac{1}{${a}}$.`,
              `解 $-1 \\le ${a}x \\le 1 \\implies -\\frac{1}{${a}} \\le x \\le \\frac{1}{${a}}$。`,
            ),
          );
        }
        const k = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
        return oneOf(
          rng,
          t(`What is the range of $f(x) = ${k}\\arcsin x$?`, `$f(x) = ${k}\\arcsin x$ 的值域是什么？`),
          t(
            k % 2 === 0 ? `$[-${k / 2}\\pi, ${k / 2}\\pi]$` : `$\\left[-\\frac{${k}\\pi}{2}, \\frac{${k}\\pi}{2}\\right]$`,
            k % 2 === 0 ? `$[-${k / 2}\\pi, ${k / 2}\\pi]$` : `$\\left[-\\frac{${k}\\pi}{2}, \\frac{${k}\\pi}{2}\\right]$`,
          ),
          [t("$[-1, 1]$", "$[-1, 1]$"), t("$[0, \\pi]$", "$[0, \\pi]$"), t("$(-\\infty, \\infty)$", "$(-\\infty, \\infty)$")],
          t(
            `The range of $\\arcsin x$ is $[-\\pi/2, \\pi/2]$, so multiplying by $${k}$ gives the result.`,
            `$\\arcsin x$ 的值域为 $[-\\pi/2, \\pi/2]$，乘以 $${k}$ 即得结果。`,
          ),
        );
      },
    },
    {
      id: "key-points-and-symmetry-of-arcsin",
      title: t("Key points and odd symmetry of arcsin", "反正弦的关键点与奇函数性质"),
      explanation: t(
        "The graph of $y = \\arcsin x$ passes through $(-1, -\\pi/2)$, $(0, 0)$, and $(1, \\pi/2)$. It is an **odd function**: $\\arcsin(-x) = -\\arcsin x$, meaning its graph is symmetric about the origin.",
        "$y = \\arcsin x$ 的图象通过关键点 $(-1, -\\pi/2)$、$(0, 0)$ 与 $(1, \\pi/2)$。它是**奇函数**：$\\arcsin(-x) = -\\arcsin x$，图象关于原点对称。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "0", wrong: ["\frac{pi}{2}", "-\frac{pi}{2}", "pi"] },
          { val: "1", ans: "\frac{pi}{2}", wrong: ["pi", "0", "\frac{pi}{4}"] },
          { val: "-1", ans: "-\frac{pi}{2}", wrong: ["\frac{pi}{2}", "pi", "-pi"] },
          { val: "\frac{1}{2}", ans: "\frac{pi}{6}", wrong: ["\frac{pi}{3}", "\frac{pi}{4}", "\frac{pi}{2}"] },
          { val: "-\frac{1}{2}", ans: "-\frac{pi}{6}", wrong: ["\frac{5pi}{6}", "-\frac{pi}{3}", "-\frac{pi}{4}"] },
          { val: "\frac{sqrt{2}}{2}", ans: "\frac{pi}{4}", wrong: ["\frac{pi}{6}", "\frac{pi}{3}", "\frac{3pi}{4}"] },
          { val: "-\frac{sqrt{2}}{2}", ans: "-\frac{pi}{4}", wrong: ["\frac{3pi}{4}", "-\frac{pi}{6}", "-\frac{pi}{3}"] },
          { val: "\frac{sqrt{3}}{2}", ans: "\frac{pi}{3}", wrong: ["\frac{pi}{6}", "\frac{pi}{4}", "\frac{2pi}{3}"] },
          { val: "-\frac{sqrt{3}}{2}", ans: "-\frac{pi}{3}", wrong: ["\frac{2pi}{3}", "-\frac{pi}{6}", "-\frac{pi}{4}"] },
        ]);
        const mult = rng.pick([1, 2, 3, 4, 6]);
        const promptStr = mult === 1 ? `arcsinleft(${item.val}\right)` : `${mult}arcsinleft(${item.val}\right)`;
        const ansStr = mult === 1 ? item.ans : `${mult}cdotleft(${item.ans}\right)`;
        const wrongStr = item.wrong.map((w) => (mult === 1 ? `$${w}$` : `$${mult}cdotleft(${w}\right)$`));
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          t(
            `Since $arcsin(${item.val}) = ${item.ans}$, multiplying by $${mult}$ gives $${ansStr}$.`,
            `因为 $arcsin(${item.val}) = ${item.ans}$，乘以 $${mult}$ 得 $${ansStr}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.9.2 Graphing the inverse cosine function ─────────────────────────────

/** graphingTheInverseCosineFunction covers domain, range, and properties of arccos. */
export const graphingTheInverseCosineFunction: TopicDef = {
  id: "graphing-the-inverse-cosine-function",
  title: t("Graphing the Inverse Cosine Function", "反余弦函数的图象与性质"),
  summary: t(
    "Describe the domain, range, key points, and symmetry properties of the inverse cosine function y = arccos(x).",
    "描述反余弦函数 y = arccos(x) 的定义域、值域、关键点与对称性。",
  ),
  prerequisites: ["graphing-the-inverse-sine-function"],
  encompasses: [{ topic: "graphing-the-inverse-sine-function", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSF.TF.B.6"],
  knowledgePoints: [
    {
      id: "domain-and-range-of-arccos",
      title: t("Domain and range of arccos", "反余弦函数的定义域与值域"),
      explanation: t(
        "To invert $\\cos x$, its domain is restricted to $[0, \\pi]$. Therefore, $y = \\arccos x$ has:\n\n- **Domain**: $[-1, 1]$\n- **Range**: $[0, \\pi]$",
        "为了使 $\\cos x$ 具有反函数，将其定义域限制在 $[0, \\pi]$。因此 $y = \\arccos x$ 的：\n\n- **定义域**：$[-1, 1]$\n- **值域**：$[0, \\pi]$",
      ),
      generate(rng) {
        const type = rng.pick(["scaled", "shifted", "linear", "range"] as const);
        if (type === "scaled") {
          const a = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20]);
          return oneOf(
            rng,
            t(
              `What is the domain of $f(x) = \\arccos\\left(\\frac{x}{${a}}\\right)$?`,
              `$f(x) = \\arccos\\left(\\frac{x}{${a}}\\right)$ 的定义域是什么？`,
            ),
            t(`$[-${a}, ${a}]$`, `$[-${a}, ${a}]$`),
            [t("$[-1, 1]$", "$[-1, 1]$"), t(`$(-${a}, ${a})$`, `$(-${a}, ${a})$`), t("$[0, \\pi]$", "$[0, \\pi]$")],
            t(
              `Set $-1 \\le \\frac{x}{${a}} \\le 1$, yielding $[- ${a}, ${a}]$.`,
              `解 $-1 \\le \\frac{x}{${a}} \\le 1$，得 $[- ${a}, ${a}]$。`,
            ),
          );
        }
        if (type === "shifted") {
          const h = rng.pick([-10, -8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 10]);
          const sign = h > 0 ? `-${h}` : `+${-h}`;
          const left = h - 1;
          const right = h + 1;
          return oneOf(
            rng,
            t(`What is the domain of $f(x) = \\arccos(x ${sign})$?`, `$f(x) = \\arccos(x ${sign})$ 的定义域是什么？`),
            t(`$[${left}, ${right}]$`, `$[${left}, ${right}]$`),
            [
              t("$[-1, 1]$", "$[-1, 1]$"),
              t(`$[${left - 1}, ${right + 1}]$`, `$[${left - 1}, ${right + 1}]$`),
              t("$[0, \\pi]$", "$[0, \\pi]$"),
            ],
            t(
              `Set $-1 \\le x ${sign} \\le 1$, yielding $[${left}, ${right}]$.`,
              `解 $-1 \\le x ${sign} \\le 1$，得 $[${left}, ${right}]$。`,
            ),
          );
        }
        if (type === "linear") {
          const a = rng.pick([2, 3, 4, 5, 6, 7, 8]);
          return oneOf(
            rng,
            t(`What is the domain of $f(x) = \\arccos(${a}x)$?`, `$f(x) = \\arccos(${a}x)$ 的定义域是什么？`),
            t(`$\\left[-\\frac{1}{${a}}, \\frac{1}{${a}}\\right]$`, `$\\left[-\\frac{1}{${a}}, \\frac{1}{${a}}\\right]$`),
            [t("$[-1, 1]$", "$[-1, 1]$"), t(`$[-${a}, ${a}]$`, `$[-${a}, ${a}]$`), t("$[0, \\pi]$", "$[0, \\pi]$")],
            t(
              `Solve $-1 \\le ${a}x \\le 1 \\implies -\\frac{1}{${a}} \\le x \\le \\frac{1}{${a}}$.`,
              `解 $-1 \\le ${a}x \\le 1 \\implies -\\frac{1}{${a}} \\le x \\le \\frac{1}{${a}}$。`,
            ),
          );
        }
        const k = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]);
        return oneOf(
          rng,
          t(`What is the range of $f(x) = ${k}\\arccos x$?`, `$f(x) = ${k}\\arccos x$ 的值域是什么？`),
          t(`$[0, ${k}\\pi]$`, `$[0, ${k}\\pi]$`),
          [t("$[0, \\pi]$", "$[0, \\pi]$"), t(`$[-${k}\\pi, ${k}\\pi]$`, `$[-${k}\\pi, ${k}\\pi]$`), t("$[-1, 1]$", "$[-1, 1]$")],
          t(
            `The range of $\\arccos x$ is $[0, \\pi]$, so multiplying by $${k}$ gives $[0, ${k}\\pi]$.`,
            `$\\arccos x$ 的值域为 $[0, \\pi]$，乘以 $${k}$ 得 $[0, ${k}\\pi]$。`,
          ),
        );
      },
    },
    {
      id: "key-points-and-symmetry-of-arccos",
      title: t("Key points and evaluation of arccos", "反余弦的关键点与求值"),
      explanation: t(
        "Key points on $y = \\arccos x$ include $(-1, \\pi)$, $(0, \\pi/2)$, and $(1, 0)$. Furthermore, $\\arccos(-x) = \\pi - \\arccos x$.",
        "$y = \\arccos x$ 上的关键点包括 $(-1, \\pi)$、$(0, \\pi/2)$ 与 $(1, 0)$。此外，$\\arccos(-x) = \\pi - \\arccos x$。",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "1", ans: "0", wrong: ["pi", "\frac{pi}{2}", "\frac{pi}{4}"] },
          { val: "0", ans: "\frac{pi}{2}", wrong: ["0", "pi", "-\frac{pi}{2}"] },
          { val: "-1", ans: "pi", wrong: ["0", "\frac{pi}{2}", "-pi"] },
          { val: "\frac{1}{2}", ans: "\frac{pi}{3}", wrong: ["\frac{pi}{6}", "\frac{2pi}{3}", "\frac{pi}{4}"] },
          { val: "-\frac{1}{2}", ans: "\frac{2pi}{3}", wrong: ["-\frac{pi}{3}", "\frac{pi}{3}", "\frac{5pi}{6}"] },
          { val: "\frac{sqrt{2}}{2}", ans: "\frac{pi}{4}", wrong: ["\frac{pi}{6}", "\frac{pi}{3}", "\frac{3pi}{4}"] },
          { val: "-\frac{sqrt{2}}{2}", ans: "\frac{3pi}{4}", wrong: ["-\frac{pi}{4}", "\frac{pi}{4}", "\frac{5pi}{4}"] },
          { val: "\frac{sqrt{3}}{2}", ans: "\frac{pi}{6}", wrong: ["\frac{pi}{3}", "\frac{pi}{4}", "\frac{5pi}{6}"] },
          { val: "-\frac{sqrt{3}}{2}", ans: "\frac{5pi}{6}", wrong: ["-\frac{pi}{6}", "\frac{pi}{6}", "\frac{2pi}{3}"] },
        ]);
        const mult = rng.pick([1, 2, 3, 4, 6]);
        const promptStr = mult === 1 ? `arccosleft(${item.val}\right)` : `${mult}arccosleft(${item.val}\right)`;
        const ansStr = mult === 1 ? item.ans : `${mult}cdotleft(${item.ans}\right)`;
        const wrongStr = item.wrong.map((w) => (mult === 1 ? `$${w}$` : `$${mult}cdotleft(${w}\right)$`));
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          t(
            `Since $arccos(${item.val}) = ${item.ans}$, multiplying by $${mult}$ gives $${ansStr}$.`,
            `因为 $arccos(${item.val}) = ${item.ans}$，乘以 $${mult}$ 得 $${ansStr}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.9.3 Graphing the inverse tangent function ────────────────────────────

/** graphingTheInverseTangentFunction covers domain, range, and asymptotes of arctan. */
export const graphingTheInverseTangentFunction: TopicDef = {
  id: "graphing-the-inverse-tangent-function",
  title: t("Graphing the Inverse Tangent Function", "反正切函数的图象与性质"),
  summary: t(
    "Describe the domain, range, horizontal asymptotes, and symmetry of the inverse tangent function y = arctan(x).",
    "描述反正切函数 y = arctan(x) 的定义域、值域、水平渐近线与对称性。",
  ),
  prerequisites: ["graphing-the-inverse-sine-function", "graphing-tangent-and-cotangent"],
  encompasses: [{ topic: "graphing-the-inverse-sine-function", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSF.TF.B.6"],
  knowledgePoints: [
    {
      id: "domain-and-range-of-arctan",
      title: t("Domain and range of arctan", "反正切函数的定义域与值域"),
      explanation: t(
        "By restricting $\\tan x$ to $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$, the inverse tangent function $y = \\arctan x$ has:\n\n- **Domain**: $(-\\infty, \\infty)$\n- **Range**: $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$",
        "通过将 $\\tan x$ 的定义域限制在 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$ 上，反正切函数 $y = \\arctan x$ 的：\n\n- **定义域**：$(-\\infty, \\infty)$\n- **值域**：$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$",
      ),
      generate(rng) {
        const type = rng.pick(["domain", "range-scaled", "range-shifted"] as const);
        if (type === "domain") {
          const k = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
          const h = rng.pick([-4, -3, -2, -1, 0, 1, 2, 3, 4]);
          const expr = h === 0 ? `${k === 1 ? "" : k}x` : `${k === 1 ? "" : k}x ${h > 0 ? `+ ${h}` : `- ${-h}`}`;
          return oneOf(
            rng,
            t(`What is the domain of $f(x) = \\arctan(${expr})$?`, `$f(x) = \\arctan(${expr})$ 的定义域是什么？`),
            t("$(-\\infty, \\infty)$", "$(-\\infty, \\infty)$"),
            [
              t("$[-1, 1]$", "$[-1, 1]$"),
              t("$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$", "$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$"),
              t("$[0, \\infty)$", "$[0, \\infty)$"),
            ],
            t(
              "The inverse tangent function accepts any real number: domain is $(-infty, infty)$.",
              "反正切函数的定义域是所有实数：$(-infty, infty)$。",
            ),
          );
        }
        if (type === "range-scaled") {
          const k = rng.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
          const ans = k % 2 === 0 ? `(-${k / 2}pi, ${k / 2}pi)` : `left(-\frac{${k}pi}{2}, \frac{${k}pi}{2}\right)`;
          return oneOf(
            rng,
            t(`What is the range of $f(x) = ${k}\\arctan x$?`, `$f(x) = ${k}\\arctan x$ 的值域是什么？`),
            t(`$${ans}$`, `$${ans}$`),
            [
              t("$(-\\infty, \\infty)$", "$(-\\infty, \\infty)$"),
              t("$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$", "$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$"),
              t(`$[0, ${k}\\pi]$`, `$[0, ${k}\\pi]$`),
            ],
            t(
              `Multiply the standard range $(-pi/2, pi/2)$ by $${k}$ to obtain $${ans}$.`,
              `将标准值域 $(-pi/2, pi/2)$ 乘以 $${k}$ 即得 $${ans}$。`,
            ),
          );
        }
        const c = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const sign = c > 0 ? `+ ${c}` : `- ${-c}`;
        return oneOf(
          rng,
          t(`What is the range of $f(x) = \\arctan(x) ${sign}$?`, `$f(x) = \\arctan(x) ${sign}$ 的值域是什么？`),
          t(
            `$\\left(-\\frac{\\pi}{2} ${sign}, \\frac{\\pi}{2} ${sign}\\right)$`,
            `$\\left(-\\frac{\\pi}{2} ${sign}, \\frac{\\pi}{2} ${sign}\\right)$`,
          ),
          [
            t("$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$", "$\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$"),
            t("$(-\\infty, \\infty)$", "$(-\\infty, \\infty)$"),
            t(`$[0, \\pi ${sign}]$`, `$[0, \\pi ${sign}]$`),
          ],
          t(
            `Shifting the range vertically gives $left(-\frac{pi}{2} ${sign}, \frac{pi}{2} ${sign}\right)$.`,
            `值域沿纵向平移得到 $left(-\frac{pi}{2} ${sign}, \frac{pi}{2} ${sign}\right)$。`,
          ),
        );
      },
    },
    {
      id: "asymptotes-and-symmetry-of-arctan",
      title: t("Horizontal asymptotes and symmetry of arctan", "反正切函数的渐近线与对称性"),
      explanation: t(
        "As $x \\to \\infty$, $\\arctan x \\to \\frac{\\pi}{2}$. As $x \\to -\\infty$, $\\arctan x \\to -\\frac{\\pi}{2}$. Its horizontal asymptotes are $y = \\pm \\frac{\\pi}{2}$, and $\\arctan(-x) = -\\arctan x$ (odd symmetry).",
        "当 $x \\to \\infty$ 时，$\\arctan x \\to \\frac{\\pi}{2}$；当 $x \\to -\\infty$ 时，$\\arctan x \\to -\\frac{\\pi}{2}$。其水平渐近线为 $y = \\pm \\frac{\\pi}{2}$，且 $\\arctan(-x) = -\\arctan x$（奇函数对称性）。",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15]);
        const askAsymptote = rng.pick(["pos", "neg", "sym"] as const);
        const kTex = k === 1 ? "" : `${k}`;
        if (askAsymptote === "pos") {
          const ans = k === 1 ? "y = \frac{pi}{2}" : k % 2 === 0 ? `y = ${k / 2}pi` : `y = \frac{${k}pi}{2}`;
          return oneOf(
            rng,
            t(
              `What is the horizontal asymptote of $f(x) = ${kTex}\\arctan x$ as $x \\to \\infty$?`,
              `当 $x \\to \\infty$ 时，$f(x) = ${kTex}\\arctan x$ 的水平渐近线是什么？`,
            ),
            t(`$${ans}$`, `$${ans}$`),
            [t("y = pi", "y = pi"), t("y = 0", "y = 0"), t("y = 1", "y = 1")],
            t(
              `As $x \\to \\infty$, $\\arctan x \\to \\pi/2$, so $f(x) \\to ${ans}$.`,
              `当 $x \\to \\infty$ 时，$\\arctan x \\to \\pi/2$，因此 $f(x) \\to ${ans}$。`,
            ),
          );
        }
        if (askAsymptote === "neg") {
          const ans = k === 1 ? "y = -\frac{pi}{2}" : k % 2 === 0 ? `y = -${k / 2}pi` : `y = -\frac{${k}pi}{2}`;
          return oneOf(
            rng,
            t(
              `What is the horizontal asymptote of $f(x) = ${kTex}\\arctan x$ as $x \\to -\\infty$?`,
              `当 $x \\to -\\infty$ 时，$f(x) = ${kTex}\\arctan x$ 的水平渐近线是什么？`,
            ),
            t(`$${ans}$`, `$${ans}$`),
            [t("y = -pi", "y = -pi"), t("y = 0", "y = 0"), t("y = -1", "y = -1")],
            t(
              `As $x \\to -\\infty$, $\\arctan x \\to -\\pi/2$, so $f(x) \\to ${ans}$.`,
              `当 $x \\to -\\infty$ 时，$\\arctan x \\to -\\pi/2$，因此 $f(x) \\to ${ans}$。`,
            ),
          );
        }
        return oneOf(
          rng,
          t(
            `Which statement correctly describes the symmetry of $f(x) = ${kTex}\\arctan x$?`,
            `关于 $f(x) = ${kTex}\\arctan x$ 的对称性，下列哪项描述正确？`,
          ),
          t("Odd function, symmetric about the origin", "奇函数，关于原点对称"),
          [
            t("Even function, symmetric about the y-axis", "偶函数，关于 y 轴对称"),
            t("Periodic with period $\\pi$", "周期函数，周期为 $\\pi$"),
            t("Neither even nor odd", "非奇非偶函数"),
          ],
          t(
            "Since $\\arctan(-x) = -\\arctan x$, it is an odd function symmetric about the origin.",
            "由于 $\\arctan(-x) = -\\arctan x$，它是关于原点对称的奇函数。",
          ),
        );
      },
    },
  ],
};

// ─── 4.9.4 Evaluating expressions with inverse trigonometric functions ──────

/** evaluatingExpressionsContainingInverseTrigonometricFunctions calculates special values. */
export const evaluatingExpressionsContainingInverseTrigonometricFunctions: TopicDef = {
  id: "evaluating-expressions-containing-inverse-trigonometric-functions",
  title: t("Evaluating Expressions Containing Inverse Trigonometric Functions", "求含反三角函数表达式的值"),
  summary: t(
    "Evaluate exact values of inverse trigonometric functions at special unit circle ratios.",
    "求反三角函数在单位圆特殊角比值处的精确值。",
  ),
  prerequisites: ["graphing-the-inverse-sine-function"],
  encompasses: [{ topic: "graphing-the-inverse-sine-function", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.B.6"],
  knowledgePoints: [
    {
      id: "evaluating-arcsin-and-arccos-special",
      title: t("Exact values of arcsin and arccos", "反正弦与反余弦的精确值"),
      explanation: t(
        "To evaluate $\\arcsin(v)$ or $\\arccos(v)$, find the unique angle in the principal range whose trigonometric ratio equals $v$:\n\n$$\\arcsin\\left(\\frac{\\sqrt{3}}{2}\\right) = \\frac{\\pi}{3}, \\quad \\arccos\\left(-\\frac{1}{2}\\right) = \\frac{2\\pi}{3}$$",
        "求 $\\arcsin(v)$ 或 $\\arccos(v)$ 时，在主值区间内寻找三角函数值等于 $v$ 的唯一角：\n\n$$\\arcsin\\left(\\frac{\\sqrt{3}}{2}\\right) = \\frac{\\pi}{3}, \\quad \\arccos\\left(-\\frac{1}{2}\\right) = \\frac{2\\pi}{3}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { fn: "arcsin", val: "\frac{1}{2}", ans: "\frac{pi}{6}" },
          { fn: "arcsin", val: "\frac{sqrt{2}}{2}", ans: "\frac{pi}{4}" },
          { fn: "arcsin", val: "\frac{sqrt{3}}{2}", ans: "\frac{pi}{3}" },
          { fn: "arcsin", val: "-\frac{1}{2}", ans: "-\frac{pi}{6}" },
          { fn: "arcsin", val: "-\frac{sqrt{2}}{2}", ans: "-\frac{pi}{4}" },
          { fn: "arcsin", val: "-\frac{sqrt{3}}{2}", ans: "-\frac{pi}{3}" },
          { fn: "arccos", val: "\frac{1}{2}", ans: "\frac{pi}{3}" },
          { fn: "arccos", val: "\frac{sqrt{2}}{2}", ans: "\frac{pi}{4}" },
          { fn: "arccos", val: "\frac{sqrt{3}}{2}", ans: "\frac{pi}{6}" },
          { fn: "arccos", val: "-\frac{1}{2}", ans: "\frac{2pi}{3}" },
          { fn: "arccos", val: "-\frac{sqrt{2}}{2}", ans: "\frac{3pi}{4}" },
          { fn: "arccos", val: "-\frac{sqrt{3}}{2}", ans: "\frac{5pi}{6}" },
          { fn: "arcsin", val: "1", ans: "\frac{pi}{2}" },
          { fn: "arcsin", val: "-1", ans: "-\frac{pi}{2}" },
          { fn: "arccos", val: "1", ans: "0" },
          { fn: "arccos", val: "-1", ans: "pi" },
        ]);
        const mult = rng.pick([1, 2, 3, 4, 6]);
        const promptStr = mult === 1 ? `${item.fn}left(${item.val}\right)` : `${mult}${item.fn}left(${item.val}\right)`;
        const ansStr = mult === 1 ? item.ans : `${mult}cdotleft(${item.ans}\right)`;
        const wrongList = [
          "\frac{pi}{6}",
          "\frac{pi}{4}",
          "\frac{pi}{3}",
          "\frac{2pi}{3}",
          "\frac{3pi}{4}",
          "\frac{5pi}{6}",
          "-\frac{pi}{6}",
        ]
          .filter((w) => w !== item.ans)
          .slice(0, 3);
        const wrongStr = wrongList.map((w) => (mult === 1 ? `$${w}$` : `$${mult}cdotleft(${w}\right)$`));
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          t(
            `Since $${item.fn}(${item.val}) = ${item.ans}$, the answer is $${ansStr}$.`,
            `因为 $${item.fn}(${item.val}) = ${item.ans}$，答案为 $${ansStr}$。`,
          ),
        );
      },
    },
    {
      id: "evaluating-arctan-special",
      title: t("Exact values of arctan", "反正切的精确值"),
      explanation: t(
        "For $y = \\arctan x$, the angle must lie in $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$:\n\n$$\\arctan(1) = \\frac{\\pi}{4}, \\quad \\arctan(-\\sqrt{3}) = -\\frac{\\pi}{3}$$",
        "对 $y = \\arctan x$，结果角必须位于 $\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)$：\n\n$$\\arctan(1) = \\frac{\\pi}{4}, \\quad \\arctan(-\\sqrt{3}) = -\\frac{\\pi}{3}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { val: "0", ans: "0" },
          { val: "\frac{sqrt{3}}{3}", ans: "\frac{pi}{6}" },
          { val: "1", ans: "\frac{pi}{4}" },
          { val: "sqrt{3}", ans: "\frac{pi}{3}" },
          { val: "-\frac{sqrt{3}}{3}", ans: "-\frac{pi}{6}" },
          { val: "-1", ans: "-\frac{pi}{4}" },
          { val: "-sqrt{3}", ans: "-\frac{pi}{3}" },
        ]);
        const mult = rng.pick([1, 2, 3, 4, 6]);
        const promptStr = mult === 1 ? `arctanleft(${item.val}\right)` : `${mult}arctanleft(${item.val}\right)`;
        const ansStr = mult === 1 ? item.ans : `${mult}cdotleft(${item.ans}\right)`;
        const wrongList = ["0", "\frac{pi}{6}", "\frac{pi}{4}", "\frac{pi}{3}", "-\frac{pi}{6}", "-\frac{pi}{4}", "-\frac{pi}{3}"]
          .filter((w) => w !== item.ans)
          .slice(0, 3);
        const wrongStr = wrongList.map((w) => (mult === 1 ? `$${w}$` : `$${mult}cdotleft(${w}\right)$`));
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          t(
            `Since $arctan(${item.val}) = ${item.ans}$, multiplying gives $${ansStr}$.`,
            `因为 $arctan(${item.val}) = ${item.ans}$，乘积得 $${ansStr}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.9.5 Further evaluating expressions containing inverse trig ───────────

/** furtherEvaluatingExpressionsContainingInverseTrigonometricFunctions covers compositions. */
export const furtherEvaluatingExpressionsContainingInverseTrigonometricFunctions: TopicDef = {
  id: "further-evaluating-expressions-containing-inverse-trigonometric-functions",
  title: t("Further Evaluating Expressions Containing Inverse Trigonometric Functions", "进一步求含反三角函数表达式的值"),
  summary: t(
    "Evaluate compositions of trigonometric and inverse trigonometric functions, including angles outside the principal branch.",
    "求三角函数与反三角函数的复合表达式的值，包括角位于主值区间外的情形。",
  ),
  prerequisites: ["evaluating-expressions-containing-inverse-trigonometric-functions"],
  encompasses: [{ topic: "evaluating-expressions-containing-inverse-trigonometric-functions", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.B.6"],
  knowledgePoints: [
    {
      id: "compositions-using-reference-triangles",
      title: t("Evaluating trig of inverse trig using triangles", "借助参考直角三角形计算复合三角值"),
      explanation: t(
        "To find $\\cos(\\arcsin(3/5))$, let $\\theta = \\arcsin(3/5)$. In a right triangle, the opposite side is $3$ and hypotenuse is $5$, so the adjacent side is $\\sqrt{5^{2} - 3^{2}} = 4$. Thus, $\\cos \\theta = \\frac{4}{5}$.",
        "求 $\\cos(\\arcsin(3/5))$ 时，令 $\\theta = \\arcsin(3/5)$。在参考直角三角形中，对边为 $3$，斜边为 $5$，则邻边为 $\\sqrt{5^{2} - 3^{2}} = 4$。因此 $\\cos \\theta = \\frac{4}{5}$。",
      ),
      generate(rng) {
        const triplesList = [
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
          [15, 8, 17],
          [7, 24, 25],
          [24, 7, 25],
        ] as const;
        const [a, b, c] = rng.pick(triplesList);
        const outer = rng.pick(["sin", "cos", "tan"] as const);
        const inner = rng.pick(["arccos", "arcsin"] as const);
        let ansNum = 0;
        let ansDen = 1;
        if (inner === "arccos") {
          // cos(θ) = b/c, so adjacent = b, hypotenuse = c, opposite = a
          if (outer === "sin") {
            ansNum = a;
            ansDen = c;
          } else if (outer === "cos") {
            ansNum = b;
            ansDen = c;
          } else {
            ansNum = a;
            ansDen = b;
          }
        } else {
          // sin(θ) = a/c, so opposite = a, hypotenuse = c, adjacent = b
          if (outer === "sin") {
            ansNum = a;
            ansDen = c;
          } else if (outer === "cos") {
            ansNum = b;
            ansDen = c;
          } else {
            ansNum = a;
            ansDen = b;
          }
        }
        const ans = Q.of(ansNum, ansDen);
        const wrong = [Q.of(ansDen, ansNum), Q.of(b, c), Q.of(a, b)].filter((w) => !w.eq(ans));
        return numberProblem({
          prompt: t(
            `Find the exact value of $\\${outer}\\left(\\${inner}\\left(\\frac{${inner === "arccos" ? b : a}}{${c}}\\right)\\right)$.`,
            `求 $\\${outer}\\left(\\${inner}\\left(\\frac{${inner === "arccos" ? b : a}}{${c}}\\right)\\right)$ 的精确值。`,
          ),
          answer: ans,
          wrong,
          solution: t(
            `Draw a reference right triangle with side lengths $${a}$, $${b}$, and $${c}$. The ratio is ${ans.toLatex()}.`,
            `绘制边长为 $${a}$、$${b}$ 与 $${c}$ 的参考直角三角形，比值为 ${ans.toLatex()}。`,
          ),
          form: "fraction",
        });
      },
    },
    {
      id: "evaluating-inverse-trig-outside-principal-range",
      title: t("Inverse trig of trig outside principal range", "主值区间外的反三角复合值"),
      explanation: t(
        "While $\\sin(\\arcsin x) = x$ always holds for $x \\in [-1, 1]$, $\\arcsin(\\sin \\theta) = \\theta$ holds **only** when $\\theta \\in [-\\pi/2, \\pi/2]$. For $\\theta = 5\\pi/6$:\n\n$$\\arcsin\\left(\\sin\\left(\\frac{5\\pi}{6}\\right)\\right) = \\arcsin\\left(\\frac{1}{2}\\right) = \\frac{\\pi}{6}$$",
        "虽然当 $x \\in [-1, 1]$ 时恒有 $\\sin(\\arcsin x) = x$，但 $\\arcsin(\\sin \\theta) = \\theta$ **仅**在 $\\theta \\in [-\\pi/2, \\pi/2]$ 时成立。以 $\\theta = 5\\pi/6$ 为例：\n\n$$\\arcsin\\left(\\sin\\left(\\frac{5\\pi}{6}\\right)\\right) = \\arcsin\\left(\\frac{1}{2}\\right) = \\frac{\\pi}{6}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { expr: "arcsinleft(sinleft(\frac{5pi}{6}\right)\right)", ans: "\frac{pi}{6}" },
          { expr: "arcsinleft(sinleft(\frac{7pi}{6}\right)\right)", ans: "-\frac{pi}{6}" },
          { expr: "arcsinleft(sinleft(\frac{3pi}{4}\right)\right)", ans: "\frac{pi}{4}" },
          { expr: "arcsinleft(sinleft(\frac{5pi}{4}\right)\right)", ans: "-\frac{pi}{4}" },
          { expr: "arcsinleft(sinleft(\frac{2pi}{3}\right)\right)", ans: "\frac{pi}{3}" },
          { expr: "arcsinleft(sinleft(\frac{4pi}{3}\right)\right)", ans: "-\frac{pi}{3}" },
          { expr: "arccosleft(cosleft(\frac{4pi}{3}\right)\right)", ans: "\frac{2pi}{3}" },
          { expr: "arccosleft(cosleft(\frac{5pi}{3}\right)\right)", ans: "\frac{pi}{3}" },
          { expr: "arccosleft(cosleft(\frac{7pi}{4}\right)\right)", ans: "\frac{pi}{4}" },
          { expr: "arccosleft(cosleft(-\frac{pi}{6}\right)\right)", ans: "\frac{pi}{6}" },
          { expr: "arccosleft(cosleft(\frac{7pi}{6}\right)\right)", ans: "\frac{5pi}{6}" },
          { expr: "arctanleft(\tanleft(\frac{3pi}{4}\right)\right)", ans: "-\frac{pi}{4}" },
          { expr: "arctanleft(\tanleft(\frac{5pi}{6}\right)\right)", ans: "-\frac{pi}{6}" },
          { expr: "arctanleft(\tanleft(\frac{4pi}{3}\right)\right)", ans: "\frac{pi}{3}" },
          { expr: "arctanleft(\tanleft(\frac{7pi}{6}\right)\right)", ans: "\frac{pi}{6}" },
        ]);
        const mult = rng.pick([1, 2, 3]);
        const promptStr = mult === 1 ? item.expr : `${mult}left(${item.expr}\right)`;
        const ansStr = mult === 1 ? item.ans : `${mult}cdotleft(${item.ans}\right)`;
        const wrongList = ["\frac{pi}{6}", "\frac{pi}{4}", "\frac{pi}{3}", "-\frac{pi}{6}", "-\frac{pi}{4}", "-\frac{pi}{3}"]
          .filter((w) => w !== item.ans)
          .slice(0, 3);
        const wrongStr = wrongList.map((w) => (mult === 1 ? `$${w}$` : `$${mult}cdotleft(${w}\right)$`));
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          t(
            `Evaluate the inner trigonometric value first, then map into the principal range: result is $${ansStr}$.`,
            `先计算内部三角函数值，再求主值区间内的对应角：结果为 $${ansStr}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.10.1 Simplifying expressions using basic identities ─────────────────

/** simplifyingExpressionsUsingBasicTrigonometricIdentities simplifies with reciprocal & quotient identities. */
export const simplifyingExpressionsUsingBasicTrigonometricIdentities: TopicDef = {
  id: "simplifying-expressions-using-basic-trigonometric-identities",
  title: t("Simplifying Expressions Using Basic Trigonometric Identities", "利用基本三角恒等式化简表达式"),
  summary: t(
    "Simplify trigonometric products and quotients using reciprocal identities (csc = 1/sin, sec = 1/cos, cot = 1/tan) and quotient identities (tan = sin/cos, cot = cos/sin).",
    "利用倒数关系与商数关系化简三角函数的乘积与分式。",
  ),
  prerequisites: ["further-extensions-of-the-special-trigonometric-ratios"],
  encompasses: [{ topic: "further-extensions-of-the-special-trigonometric-ratios", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSF.TF.C.8"],
  knowledgePoints: [
    {
      id: "reciprocal-and-quotient-products",
      title: t("Products of reciprocal and quotient expressions", "倒数与商关系的乘积"),
      explanation: t(
        "Express everything in terms of sine and cosine to simplify products:\\n\\n$$\\\\tan \\\\theta \\\\cos \\\\theta = \\\\left(\\\\frac{\\\\sin \\\\theta}{\\\\cos \\\\theta}\\\\right) \\\\cos \\\\theta = \\\\sin \\\\theta, \\\\quad \\\\sin \\\\theta \\\\csc \\\\theta = \\\\sin \\\\theta \\\\left(\\\\frac{1}{\\\\sin \\\\theta}\\\\right) = 1$$",
        "将式子全部化为正弦与余弦进行化简：\\n\\n$$\\\\tan \\\\theta \\\\cos \\\\theta = \\\\left(\\\\frac{\\\\sin \\\\theta}{\\\\cos \\\\theta}\\\\right) \\\\cos \\\\theta = \\\\sin \\\\theta, \\\\quad \\\\sin \\\\theta \\\\csc \\\\theta = \\\\sin \\\\theta \\\\left(\\\\frac{1}{\\\\sin \\\\theta}\\\\right) = 1$$",
      ),
      generate(rng) {
        const v = rng.pick(["x", "\theta", "t", "alpha", "\beta", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const kTex = k === 1 ? "" : `${k}`;
        const item = rng.pick([
          { expr: `${kTex}\tan(${v})\\cos(${v})`, ans: `${kTex}sin(${v})`, wrong: [`${kTex}cos(${v})`, `${kTex}cot(${v})`, "1"] },
          { expr: `${kTex}cot(${v})\\sin(${v})`, ans: `${kTex}cos(${v})`, wrong: [`${kTex}sin(${v})`, `${kTex}\tan(${v})`, "1"] },
          { expr: `${kTex}sin(${v})\\csc(${v})`, ans: `${k}`, wrong: ["0", `${kTex}cos(${v})`, "-1"] },
          { expr: `${kTex}cos(${v})\\sec(${v})`, ans: `${k}`, wrong: ["0", `${kTex}sin(${v})`, "-1"] },
          { expr: `${kTex}\tan(${v})\\cot(${v})`, ans: `${k}`, wrong: ["0", `${kTex}sec(${v})`, "-1"] },
          { expr: `${kTex}\frac{sin(${v})}{\tan(${v})}`, ans: `${kTex}cos(${v})`, wrong: [`${kTex}sin(${v})`, "1", `${kTex}sec(${v})`] },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(`Convert to sine and cosine and simplify: result is $${item.ans}$.`, `化为正弦与余弦化简：结果为 $${item.ans}$。`),
        );
      },
    },
    {
      id: "simplifying-trig-fractions",
      title: t("Simplifying trigonometric fractions", "化简三角分式"),
      explanation: t(
        "Fractions can be reduced by writing tangent, cotangent, secant, and cosecant in terms of sine and cosine:\\n\\n$$\\\\frac{\\\\tan \\\\theta}{\\\\sec \\\\theta} = \\\\frac{\\\\sin \\\\theta / \\\\cos \\\\theta}{1 / \\\\cos \\\\theta} = \\\\sin \\\\theta$$",
        "通过将正切、余切、正割和余割转化为正弦和余弦来约简分式：\\n\\n$$\\\\frac{\\\\tan \\\\theta}{\\\\sec \\\\theta} = \\\\frac{\\\\sin \\\\theta / \\\\cos \\\\theta}{1 / \\\\cos \\\\theta} = \\\\sin \\\\theta$$",
      ),
      generate(rng) {
        const v = rng.pick(["x", "\theta", "t", "alpha", "\beta", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const kTex = k === 1 ? "" : `${k}`;
        const item = rng.pick([
          { expr: `${kTex}\frac{sec ${v}}{csc ${v}}`, ans: `${kTex}\tan ${v}`, wrong: [`${kTex}cot ${v}`, "1", `${kTex}cos ${v}`] },
          { expr: `${kTex}\frac{csc ${v}}{sec ${v}}`, ans: `${kTex}cot ${v}`, wrong: [`${kTex}\tan ${v}`, "1", `${kTex}sin ${v}`] },
          { expr: `${kTex}\frac{\tan ${v}}{sin ${v}}`, ans: `${kTex}sec ${v}`, wrong: [`${kTex}csc ${v}`, `${kTex}cos ${v}`, "1"] },
          { expr: `${kTex}\frac{cot ${v}}{cos ${v}}`, ans: `${kTex}csc ${v}`, wrong: [`${kTex}sec ${v}`, `${kTex}sin ${v}`, "1"] },
          { expr: `${kTex}sin ${v}\\sec ${v}`, ans: `${kTex}\tan ${v}`, wrong: [`${kTex}cot ${v}`, "1", `${kTex}cos ${v}`] },
          { expr: `${kTex}cos ${v}\\csc ${v}`, ans: `${kTex}cot ${v}`, wrong: [`${kTex}\tan ${v}`, "1", `${kTex}sin ${v}`] },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(`Rewrite with reciprocal and quotient identities: $${item.ans}$.`, `利用倒数与商数关系化简：$${item.ans}$。`),
        );
      },
    },
  ],
};

// ─── 4.10.2 Simplifying expressions using the Pythagorean identity ──────────

/** simplifyingExpressionsUsingThePythagoreanIdentity applies sin² + cos² = 1. */
export const simplifyingExpressionsUsingThePythagoreanIdentity: TopicDef = {
  id: "simplifying-expressions-using-the-pythagorean-identity",
  title: t("Simplifying Expressions Using the Pythagorean Identity", "利用勾股恒等式化简表达式"),
  summary: t(
    "Simplify expressions using the fundamental Pythagorean identity sin²(θ) + cos²(θ) = 1.",
    "利用基本的勾股（平方）恒等式 sin²(θ) + cos²(θ) = 1 化简表达式。",
  ),
  prerequisites: ["simplifying-expressions-using-basic-trigonometric-identities", "extending-the-pythagorean-identity-to-all-quadrants"],
  encompasses: [{ topic: "simplifying-expressions-using-basic-trigonometric-identities", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.8"],
  knowledgePoints: [
    {
      id: "direct-pythagorean-simplification",
      title: t("Direct Pythagorean substitution", "直接利用平方关系代换"),
      explanation: t(
        "From $\\\\sin^{2}\\\\theta + \\\\cos^{2}\\\\theta = 1$, we have:\\n\\n$$1 - \\\\sin^{2}\\\\theta = \\\\cos^{2}\\\\theta, \\\\quad 1 - \\\\cos^{2}\\\\theta = \\\\sin^{2}\\\\theta$$",
        "由 $\\\\sin^{2}\\\\theta + \\\\cos^{2}\\\\theta = 1$ 可得：\\n\\n$$1 - \\\\sin^{2}\\\\theta = \\\\cos^{2}\\\\theta, \\\\quad 1 - \\\\cos^{2}\\\\theta = \\\\sin^{2}\\\\theta$$",
      ),
      generate(rng) {
        const v = rng.pick(["x", "\theta", "t", "alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const item = rng.pick([
          { expr: `1 - sin^2(${arg})`, ans: `cos^2(${arg})`, wrong: [`sin^2(${arg})`, `-cos^2(${arg})`, "1"] },
          { expr: `1 - cos^2(${arg})`, ans: `sin^2(${arg})`, wrong: [`cos^2(${arg})`, `-sin^2(${arg})`, "1"] },
          { expr: `sin^2(${arg}) + cos^2(${arg})`, ans: "1", wrong: ["0", "-1", `2sin^2(${arg})`] },
          { expr: `sin^2(${arg}) + cos^2(${arg}) - 1`, ans: "0", wrong: ["1", "-1", `cos^2(${arg})`] },
          { expr: `\frac{1 - cos^2(${arg})}{sin(${arg})}`, ans: `sin(${arg})`, wrong: [`cos(${arg})`, "1", `sin^2(${arg})`] },
          { expr: `\frac{1 - sin^2(${arg})}{cos(${arg})}`, ans: `cos(${arg})`, wrong: [`sin(${arg})`, "1", `cos^2(${arg})`] },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(`Using $sin^2 A + cos^2 A = 1$: the result is $${item.ans}$.`, `利用 $sin^2 A + cos^2 A = 1$：结果为 $${item.ans}$。`),
        );
      },
    },
    {
      id: "products-yielding-the-pythagorean-identity",
      title: t("Conjugate products yielding Pythagorean identity", "共轭乘积化简"),
      explanation: t(
        "Multiplying conjugates gives a difference of squares:\\n\\n$$(1 - \\\\cos\\\\theta)(1 + \\\\cos\\\\theta) = 1 - \\\\cos^{2}\\\\theta = \\\\sin^{2}\\\\theta, \\\\quad (1 - \\\\sin\\\\theta)(1 + \\\\sin\\\\theta) = 1 - \\\\sin^{2}\\\\theta = \\\\cos^{2}\\\\theta$$",
        "共轭因式相乘形成平方差：\\n\\n$$(1 - \\\\cos\\\\theta)(1 + \\\\cos\\\\theta) = 1 - \\\\cos^{2}\\\\theta = \\\\sin^{2}\\\\theta, \\\\quad (1 - \\\\sin\\\\theta)(1 + \\\\sin\\\\theta) = 1 - \\\\sin^{2}\\\\theta = \\\\cos^{2}\\\\theta$$",
      ),
      generate(rng) {
        const v = rng.pick(["x", "\theta", "t", "alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const item = rng.pick([
          { expr: `(1 - sin(${arg}))(1 + sin(${arg}))`, ans: `cos^2(${arg})`, wrong: [`sin^2(${arg})`, "1", `1 - sin(${arg})`] },
          { expr: `(1 - cos(${arg}))(1 + cos(${arg}))`, ans: `sin^2(${arg})`, wrong: [`cos^2(${arg})`, "1", `1 - cos(${arg})`] },
          { expr: `(cos(${arg}) - 1)(cos(${arg}) + 1)`, ans: `-sin^2(${arg})`, wrong: [`sin^2(${arg})`, `-1`, `cos^2(${arg})`] },
          { expr: `(sin(${arg}) - 1)(sin(${arg}) + 1)`, ans: `-cos^2(${arg})`, wrong: [`cos^2(${arg})`, `-1`, `sin^2(${arg})`] },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `Expand as difference of squares and apply Pythagorean identity: $${item.ans}$.`,
            `按平方差展开并应用勾股恒等式：$${item.ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.10.3 Alternate forms of the Pythagorean identity ─────────────────────

/** alternateFormsOfThePythagoreanIdentity factors and rearranges sin² + cos² = 1. */
export const alternateFormsOfThePythagoreanIdentity: TopicDef = {
  id: "alternate-forms-of-the-pythagorean-identity",
  title: t("Alternate Forms of the Pythagorean Identity", "勾股恒等式的变式"),
  summary: t(
    "Factor and substitute alternate forms of the Pythagorean identity in higher-order expressions and fractions.",
    "在高次表达式和分式中因式分解与代换勾股恒等式的变式。",
  ),
  prerequisites: ["simplifying-expressions-using-the-pythagorean-identity"],
  encompasses: [{ topic: "simplifying-expressions-using-the-pythagorean-identity", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.8"],
  knowledgePoints: [
    {
      id: "difference-of-squares-higher-powers",
      title: t("Factoring higher powers of sine and cosine", "正弦与余弦高次幂的因式分解"),
      explanation: t(
        "Recognize differences of squares in higher powers:\\n\\n$$\\\\sin^{4}\\\\theta - \\\\cos^{4}\\\\theta = (\\\\sin^{2}\\\\theta - \\\\cos^{2}\\\\theta)(\\\\sin^{2}\\\\theta + \\\\cos^{2}\\\\theta) = \\\\sin^{2}\\\\theta - \\\\cos^{2}\\\\theta$$",
        "识别高次幂中的平方差公式：\\n\\n$$\\\\sin^{4}\\\\theta - \\\\cos^{4}\\\\theta = (\\\\sin^{2}\\\\theta - \\\\cos^{2}\\\\theta)(\\\\sin^{2}\\\\theta + \\\\cos^{2}\\\\theta) = \\\\sin^{2}\\\\theta - \\\\cos^{2}\\\\theta$$",
      ),
      generate(rng) {
        const v = rng.pick(["x", "\theta", "t", "alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const item = rng.pick([
          {
            expr: `cos^4(${arg}) - sin^4(${arg})`,
            ans: `cos^2(${arg}) - sin^2(${arg})`,
            wrong: ["1", `sin^2(${arg}) - cos^2(${arg})`, `2cos^2(${arg})`],
          },
          {
            expr: `sin^4(${arg}) - cos^4(${arg})`,
            ans: `sin^2(${arg}) - cos^2(${arg})`,
            wrong: ["-1", `cos^2(${arg}) - sin^2(${arg})`, `2sin^2(${arg})`],
          },
          { expr: `\frac{cos^4(${arg}) - sin^4(${arg})}{cos^2(${arg}) - sin^2(${arg})}`, ans: "1", wrong: ["0", "-1", `cos^2(${arg})`] },
          { expr: `(1 - sin^2(${arg}))^2 + 2sin^2(${arg})cos^2(${arg}) + sin^4(${arg})`, ans: "1", wrong: ["0", `cos^2(${arg})`, "2"] },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(`Factor and apply $sin^2 + cos^2 = 1$: result is $${item.ans}$.`, `因式分解并利用 $sin^2 + cos^2 = 1$：结果为 $${item.ans}$。`),
        );
      },
    },
    {
      id: "fractions-with-pythagorean-substitutions",
      title: t("Pythagorean substitutions in fractions", "分式中的勾股恒等式代换"),
      explanation: t(
        "Substitute $1 - \\\\cos^{2}\\\\theta = \\\\sin^{2}\\\\theta$ to cancel common factors in fractions:\\n\\n$$\\\\frac{1 - \\\\cos^{2}\\\\theta}{\\\\sin \\\\theta} = \\\\frac{\\\\sin^{2}\\\\theta}{\\\\sin \\\\theta} = \\\\sin \\\\theta$$",
        "代换 $1 - \\\\cos^{2}\\\\theta = \\\\sin^{2}\\\\theta$ 以约去分式中的公因式：\\n\\n$$\\\\frac{1 - \\\\cos^{2}\\\\theta}{\\\\sin \\\\theta} = \\\\frac{\\\\sin^{2}\\\\theta}{\\\\sin \\\\theta} = \\\\sin \\\\theta$$",
      ),
      generate(rng) {
        const v = rng.pick(["x", "\theta", "t", "alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const item = rng.pick([
          { expr: `\frac{1 - sin^2(${arg})}{cos(${arg})}`, ans: `cos(${arg})`, wrong: [`sin(${arg})`, "1", `cos^2(${arg})`] },
          { expr: `\frac{1 - cos^2(${arg})}{sin(${arg})}`, ans: `sin(${arg})`, wrong: [`cos(${arg})`, "1", `sin^2(${arg})`] },
          { expr: `\frac{1 - cos^2(${arg})}{1 - sin^2(${arg})}`, ans: `\tan^2(${arg})`, wrong: [`cot^2(${arg})`, "1", `sin^2(${arg})`] },
          { expr: `\frac{1 - sin^2(${arg})}{1 - cos^2(${arg})}`, ans: `cot^2(${arg})`, wrong: [`\tan^2(${arg})`, "1", `cos^2(${arg})`] },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(`Substitute Pythagorean identities and reduce: $${item.ans}$.`, `代入勾股恒等式并约分：$${item.ans}$。`),
        );
      },
    },
  ],
};

// ─── 4.10.4 Simplifying expressions using secant-tangent identity ───────────

/** simplifyingExpressionsUsingTheSecantTangentIdentity applies 1 + tan² = sec². */
export const simplifyingExpressionsUsingTheSecantTangentIdentity: TopicDef = {
  id: "simplifying-expressions-using-the-secant-tangent-identity",
  title: t("Simplifying Expressions Using the Secant-Tangent Identity", "利用正割-正切恒等式化简表达式"),
  summary: t(
    "Simplify expressions using the identity 1 + tan²(θ) = sec²(θ) and its difference sec²(θ) - tan²(θ) = 1.",
    "利用恒等式 1 + tan²(θ) = sec²(θ) 及其差的形式 sec²(θ) - tan²(θ) = 1 化简表达式。",
  ),
  prerequisites: ["simplifying-expressions-using-the-pythagorean-identity"],
  encompasses: [{ topic: "simplifying-expressions-using-the-pythagorean-identity", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.8"],
  knowledgePoints: [
    {
      id: "direct-secant-tangent-substitutions",
      title: t("Direct secant-tangent substitution", "直接利用正割-正切关系代换"),
      explanation: t(
        "Dividing $\\\\sin^{2}\\\\theta + \\\\cos^{2}\\\\theta = 1$ by $\\\\cos^{2}\\\\theta$ yields $1 + \\\\tan^{2}\\\\theta = \\\\sec^{2}\\\\theta$. Therefore:\\n\\n$$\\\\sec^{2}\\\\theta - \\\\tan^{2}\\\\theta = 1, \\\\quad \\\\sec^{2}\\\\theta - 1 = \\\\tan^{2}\\\\theta$$",
        "将 $\\\\sin^{2}\\\\theta + \\\\cos^{2}\\\\theta = 1$ 两边同除以 $\\\\cos^{2}\\\\theta$ 得 $1 + \\\\tan^{2}\\\\theta = \\\\sec^{2}\\\\theta$。因此：\\n\\n$$\\\\sec^{2}\\\\theta - \\\\tan^{2}\\\\theta = 1, \\\\quad \\\\sec^{2}\\\\theta - 1 = \\\\tan^{2}\\\\theta$$",
      ),
      generate(rng) {
        const v = rng.pick(["x", "\theta", "t", "alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const item = rng.pick([
          { expr: `sec^2(${arg}) - \tan^2(${arg})`, ans: "1", wrong: ["-1", "0", `cos^2(${arg})`] },
          { expr: `\tan^2(${arg}) - sec^2(${arg})`, ans: "-1", wrong: ["1", "0", `-cos^2(${arg})`] },
          { expr: `1 + \tan^2(${arg})`, ans: `sec^2(${arg})`, wrong: [`csc^2(${arg})`, "1", `sin^2(${arg})`] },
          { expr: `sec^2(${arg}) - 1`, ans: `\tan^2(${arg})`, wrong: [`cot^2(${arg})`, "1", `cos^2(${arg})`] },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `By the secant-tangent identity $1 + \tan^2 A = sec^2 A$: $${item.ans}$.`,
            `由正割-正切恒等式 $1 + \tan^2 A = sec^2 A$：$${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "secant-tangent-fractions",
      title: t("Fractions involving secant and tangent", "含正割与正切的分式"),
      explanation: t(
        "Fractions containing $\\\\sec^{2}\\\\theta - 1$ or $\\\\sec^{2}\\\\theta - \\\\tan^{2}\\\\theta$ can be simplified directly:\\n\\n$$\\\\frac{\\\\sec^{2}\\\\theta - 1}{\\\\tan \\\\theta} = \\\\frac{\\\\tan^{2}\\\\theta}{\\\\tan \\\\theta} = \\\\tan \\\\theta$$",
        "含 $\\\\sec^{2}\\\\theta - 1$ 或 $\\\\sec^{2}\\\\theta - \\\\tan^{2}\\\\theta$ 的分式可直接化简：\\n\\n$$\\\\frac{\\\\sec^{2}\\\\theta - 1}{\\\\tan \\\\theta} = \\\\frac{\\\\tan^{2}\\\\theta}{\\\\tan \\\\theta} = \\\\tan \\\\theta$$",
      ),
      generate(rng) {
        const v = rng.pick(["x", "\theta", "t", "alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const item = rng.pick([
          { expr: `\frac{sec^2(${arg}) - 1}{\tan(${arg})}`, ans: `\tan(${arg})`, wrong: [`cot(${arg})`, "1", `sec(${arg})`] },
          { expr: `\frac{sec^2(${arg}) - \tan^2(${arg})}{sec(${arg})}`, ans: `cos(${arg})`, wrong: [`sec(${arg})`, "1", `sin(${arg})`] },
          { expr: `\frac{sec^2(${arg}) - \tan^2(${arg})}{\tan(${arg})}`, ans: `cot(${arg})`, wrong: [`\tan(${arg})`, "1", `cos(${arg})`] },
          { expr: `\frac{1 + \tan^2(${arg})}{sec(${arg})}`, ans: `sec(${arg})`, wrong: [`cos(${arg})`, "1", `\tan(${arg})`] },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(`Apply $sec^2 A - \tan^2 A = 1$: result is $${item.ans}$.`, `应用 $sec^2 A - \tan^2 A = 1$：结果为 $${item.ans}$。`),
        );
      },
    },
  ],
};

// ─── 4.10.5 Alternate forms of the secant-tangent identity ──────────────────

/** alternateFormsOfTheSecantTangentIdentity factors and manipulates sec² - tan² = 1. */
export const alternateFormsOfTheSecantTangentIdentity: TopicDef = {
  id: "alternate-forms-of-the-secant-tangent-identity",
  title: t("Alternate Forms of the Secant-Tangent Identity", "正割-正切恒等式的变式"),
  summary: t(
    "Manipulate expressions involving secant and tangent using algebraic identities and reciprocals.",
    "利用代数恒等式与倒数关系对含正割与正切的表达式进行变式化简。",
  ),
  prerequisites: ["simplifying-expressions-using-the-secant-tangent-identity"],
  encompasses: [{ topic: "simplifying-expressions-using-the-secant-tangent-identity", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.8"],
  knowledgePoints: [
    {
      id: "factoring-secant-tangent-powers",
      title: t("Factoring higher powers of secant and tangent", "正割与正切高次幂的因式分解"),
      explanation: t(
        "Using difference of squares:\\n\\n$$\\\\sec^{4}\\\\theta - \\\\tan^{4}\\\\theta = (\\\\sec^{2}\\\\theta - \\\\tan^{2}\\\\theta)(\\\\sec^{2}\\\\theta + \\\\tan^{2}\\\\theta) = \\\\sec^{2}\\\\theta + \\\\tan^{2}\\\\theta$$",
        "应用平方差公式：\\n\\n$$\\\\sec^{4}\\\\theta - \\\\tan^{4}\\\\theta = (\\\\sec^{2}\\\\theta - \\\\tan^{2}\\\\theta)(\\\\sec^{2}\\\\theta + \\\\tan^{2}\\\\theta) = \\\\sec^{2}\\\\theta + \\\\tan^{2}\\\\theta$$",
      ),
      generate(rng) {
        const v = rng.pick(["x", "\theta", "t", "alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const item = rng.pick([
          {
            expr: `sec^4(${arg}) - \tan^4(${arg})`,
            ans: `sec^2(${arg}) + \tan^2(${arg})`,
            wrong: ["1", `sec^2(${arg}) - \tan^2(${arg})`, "0"],
          },
          { expr: `\frac{sec^4(${arg}) - \tan^4(${arg})}{sec^2(${arg}) + \tan^2(${arg})}`, ans: "1", wrong: ["-1", "0", `sec^2(${arg})`] },
          {
            expr: `\tan^4(${arg}) - sec^4(${arg})`,
            ans: `-(sec^2(${arg}) + \tan^2(${arg}))`,
            wrong: ["-1", "1", `sec^2(${arg}) + \tan^2(${arg})`],
          },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `Factor as a difference of squares: $(sec^2 A - \tan^2 A)(sec^2 A + \tan^2 A) = ${item.ans}$.`,
            `分解为平方差：$(sec^2 A - \tan^2 A)(sec^2 A + \tan^2 A) = ${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "secant-tangent-reciprocal-relationships",
      title: t("Conjugate reciprocal relationship", "共轭因式的倒数关系"),
      explanation: t(
        "Since $(\\\\sec\\\\theta - \\\\tan\\\\theta)(\\\\sec\\\\theta + \\\\tan\\\\theta) = 1$, the factors are reciprocals of each other:\\n\\n$$\\\\frac{1}{\\\\sec\\\\theta + \\\\tan\\\\theta} = \\\\sec\\\\theta - \\\\tan\\\\theta$$",
        "因为 $(\\\\sec\\\\theta - \\\\tan\\\\theta)(\\\\sec\\\\theta + \\\\tan\\\\theta) = 1$，所以它们互为倒数：\\n\\n$$\\\\frac{1}{\\\\sec\\\\theta + \\\\tan\\\\theta} = \\\\sec\\\\theta - \\\\tan\\\\theta$$",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "\\beta", "u"]);
        const item = rng.pick([
          {
            expr: `\\frac{1}{\\sec ${v} + \\tan ${v}}`,
            ans: `\\sec ${v} - \\tan ${v}`,
            wrong: [`\\sec ${v} + \\tan ${v}`, "1", `\\cos ${v}`],
          },
          {
            expr: `\\frac{1}{\\sec ${v} - \\tan ${v}}`,
            ans: `\\sec ${v} + \\tan ${v}`,
            wrong: [`\\sec ${v} - \\tan ${v}`, "1", `\\cos ${v}`],
          },
          { expr: `(\\sec ${v} - \\tan ${v})^{-1}`, ans: `\\sec ${v} + \\tan ${v}`, wrong: [`\\sec ${v} - \\tan ${v}`, "1", `\\cot ${v}`] },
          { expr: `(\\sec ${v} + \\tan ${v})(\\sec ${v} - \\tan ${v})`, ans: "1", wrong: ["-1", "2", `\\sec^2 ${v}`] },
          { expr: `(\\sec ${v})^2 - (\\tan ${v})^2`, ans: "1", wrong: ["-1", "0", `\\sec^2 ${v} - 1`] },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `Use $\\sec^2 ${v} - \\tan^2 ${v} = 1$ (or multiply by the conjugate): the result is $${item.ans}$.`,
            `利用 $\\sec^2 ${v} - \\tan^2 ${v} = 1$（或乘以共轭式）：结果是 $${item.ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.10.6 Cotangent-cosecant identity ─────────────────────────────────────

/** simplifyingTrigonometricExpressionsUsingTheCotangentCosecantIdentity applies 1 + cot² = csc². */
export const simplifyingTrigonometricExpressionsUsingTheCotangentCosecantIdentity: TopicDef = {
  id: "simplifying-trigonometric-expressions-using-the-cotangent-cosecant-identity",
  title: t("Simplifying Trigonometric Expressions Using the Cotangent-Cosecant Identity", "利用余切-余割恒等式化简表达式"),
  summary: t(
    "Simplify expressions using 1 + cot²(θ) = csc²(θ) and csc²(θ) - cot²(θ) = 1.",
    "利用恒等式 1 + cot²(θ) = csc²(θ) 与 csc²(θ) - cot²(θ) = 1 化简三角表达式。",
  ),
  prerequisites: ["simplifying-expressions-using-the-secant-tangent-identity"],
  encompasses: [{ topic: "simplifying-expressions-using-the-secant-tangent-identity", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.8"],
  knowledgePoints: [
    {
      id: "cotangent-cosecant-basic",
      title: t("Basic cotangent-cosecant substitutions", "余切-余割基本代换"),
      explanation: t(
        "Dividing $\\\\sin^{2}\\\\theta + \\\\cos^{2}\\\\theta = 1$ by $\\\\sin^{2}\\\\theta$ gives $1 + \\\\cot^{2}\\\\theta = \\\\csc^{2}\\\\theta$. Thus:\\n\\n$$\\\\csc^{2}\\\\theta - \\\\cot^{2}\\\\theta = 1, \\\\quad \\\\csc^{2}\\\\theta - 1 = \\\\cot^{2}\\\\theta$$",
        "将 $\\\\sin^{2}\\\\theta + \\\\cos^{2}\\\\theta = 1$ 两边除以 $\\\\sin^{2}\\\\theta$ 得到 $1 + \\\\cot^{2}\\\\theta = \\\\csc^{2}\\\\theta$。因此：\\n\\n$$\\\\csc^{2}\\\\theta - \\\\cot^{2}\\\\theta = 1, \\\\quad \\\\csc^{2}\\\\theta - 1 = \\\\cot^{2}\\\\theta$$",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "\\beta"]);
        const item = rng.pick([
          { expr: `\\csc^{2}${v} - \\cot^{2}${v}`, ans: "1", wrong: ["-1", "0", `\\sin^{2}${v}`] },
          { expr: `\\cot^{2}${v} - \\csc^{2}${v}`, ans: "-1", wrong: ["1", "0", `-\\sin^{2}${v}`] },
          { expr: `\\csc^{2}${v} - 1`, ans: `\\cot^{2}${v}`, wrong: [`\\tan^{2}${v}`, "1", `\\sin^{2}${v}`] },
          { expr: `1 + \\cot^{2}${v}`, ans: `\\csc^{2}${v}`, wrong: [`\\sec^{2}${v}`, "1", `\\cos^{2}${v}`] },
          { expr: `(\\csc${v} - \\cot${v})(\\csc${v} + \\cot${v})`, ans: "1", wrong: ["-1", "0", "2"] },
          { expr: `\\csc^{2}${v} - \\cot^{2}${v} + 1`, ans: "2", wrong: ["1", "0", `-\\cot^{2}${v}`] },
          { expr: `\\csc^{2}${v}(1 - \\cos^{2}${v})`, ans: "1", wrong: [`\\csc^{2}${v}`, `\\sin^{2}${v}`, "0"] },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `Use $1 + \\cot^{2}${v} = \\csc^{2}${v}$: the result is $${item.ans}$.`,
            `利用 $1 + \\cot^{2}${v} = \\csc^{2}${v}$：化简结果是 $${item.ans}$。`,
          ),
        );
      },
    },
    {
      id: "cotangent-cosecant-fractions",
      title: t("Cotangent-cosecant fractions and reciprocals", "余切-余割分式与倒数关系"),
      explanation: t(
        "In fractions, $\\\\frac{\\\\csc^{2}\\\\theta - 1}{\\\\cot \\\\theta} = \\\\frac{\\\\cot^{2}\\\\theta}{\\\\cot \\\\theta} = \\\\cot \\\\theta$, and $\\\\frac{1}{\\\\csc\\\\theta + \\\\cot\\\\theta} = \\\\csc\\\\theta - \\\\cot\\\\theta$.",
        "在分式中，$\\\\frac{\\\\csc^{2}\\\\theta - 1}{\\\\cot \\\\theta} = \\\\frac{\\\\cot^{2}\\\\theta}{\\\\cot \\\\theta} = \\\\cot \\\\theta$，且 $\\\\frac{1}{\\\\csc\\\\theta + \\\\cot\\\\theta} = \\\\csc\\\\theta - \\\\cot\\\\theta$。",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "\\beta", "u"]);
        const item = rng.pick([
          { expr: `\\frac{\\csc^{2}${v} - 1}{\\cot ${v}}`, ans: `\\cot ${v}`, wrong: [`\\tan ${v}`, "1", `\\csc ${v}`] },
          { expr: `\\frac{1}{\\csc${v} + \\cot${v}}`, ans: `\\csc${v} - \\cot${v}`, wrong: [`\\csc${v} + \\cot${v}`, "1", `\\sin${v}`] },
          { expr: `\\frac{\\csc^{2}${v} - \\cot^{2}${v}}{\\csc ${v}}`, ans: `\\sin ${v}`, wrong: [`\\csc ${v}`, "1", `\\cos ${v}`] },
          { expr: `\\frac{1}{\\csc${v} - \\cot${v}}`, ans: `\\csc${v} + \\cot${v}`, wrong: [`\\csc${v} - \\cot${v}`, "1", `\\cos${v}`] },
          { expr: `\\frac{\\cot^{2}${v} + 1}{\\csc ${v}}`, ans: `\\csc ${v}`, wrong: [`\\sin ${v}`, `\\cot ${v}`, "1"] },
          { expr: `\\frac{\\csc^{2}${v} - \\cot^{2}${v}}{\\cot ${v}}`, ans: `\\tan ${v}`, wrong: [`\\cot ${v}`, `\\csc ${v}`, "1"] },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `Apply $\\csc^{2}${v} - \\cot^{2}${v} = 1$: the result is $${item.ans}$.`,
            `应用 $\\csc^{2}${v} - \\cot^{2}${v} = 1$：化简结果是 $${item.ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.10.7 Cofunction identities ───────────────────────────────────────────

/** simplifyingTrigonometricExpressionsUsingCofunctionIdentities applies cofunctions. */
export const simplifyingTrigonometricExpressionsUsingCofunctionIdentities: TopicDef = {
  id: "simplifying-trigonometric-expressions-using-cofunction-identities",
  title: t("Simplifying Trigonometric Expressions Using Cofunction Identities", "利用余角（诱导）恒等式化简表达式"),
  summary: t(
    "Simplify expressions using cofunction identities sin(π/2 - θ) = cos(θ), cos(π/2 - θ) = sin(θ), and tan(π/2 - θ) = cot(θ).",
    "利用余角恒等式 sin(π/2 - θ) = cos(θ)、cos(π/2 - θ) = sin(θ) 和 tan(π/2 - θ) = cot(θ) 化简表达式。",
  ),
  prerequisites: ["simplifying-expressions-using-basic-trigonometric-identities"],
  encompasses: [{ topic: "simplifying-expressions-using-basic-trigonometric-identities", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSF.TF.C.8"],
  knowledgePoints: [
    {
      id: "cofunction-identities-basic",
      title: t("Cofunction identities in radians", "弧度制下的余角恒等式"),
      explanation: t(
        "Complementary angles satisfy:\\n\\n$$\\\\sin\\\\left(\\\\frac{\\\\pi}{2} - \\\\theta\\\\right) = \\\\cos\\\\theta, \\\\quad \\\\cos\\\\left(\\\\frac{\\\\pi}{2} - \\\\theta\\\\right) = \\\\sin\\\\theta, \\\\quad \\\\tan\\\\left(\\\\frac{\\\\pi}{2} - \\\\theta\\\\right) = \\\\cot\\\\theta$$",
        "互余的两个角满足：\\n\\n$$\\\\sin\\\\left(\\\\frac{\\\\pi}{2} - \\\\theta\\\\right) = \\\\cos\\\\theta, \\\\quad \\\\cos\\\\left(\\\\frac{\\\\pi}{2} - \\\\theta\\\\right) = \\\\sin\\\\theta, \\\\quad \\\\tan\\\\left(\\\\frac{\\\\pi}{2} - \\\\theta\\\\right) = \\\\cot\\\\theta$$",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "\\beta", "u"]);
        const item = rng.pick([
          { expr: `\\sin\\left(\\frac{\\pi}{2} - ${v}\\right)`, ans: `\\cos${v}`, wrong: [`\\sin${v}`, `-\\cos${v}`, `\\tan${v}`] },
          { expr: `\\cos\\left(\\frac{\\pi}{2} - ${v}\\right)`, ans: `\\sin${v}`, wrong: [`\\cos${v}`, `-\\sin${v}`, `\\cot${v}`] },
          { expr: `\\tan\\left(\\frac{\\pi}{2} - ${v}\\right)`, ans: `\\cot${v}`, wrong: [`\\tan${v}`, `-\\cot${v}`, `\\sec${v}`] },
          { expr: `\\sec\\left(\\frac{\\pi}{2} - ${v}\\right)`, ans: `\\csc${v}`, wrong: [`\\sec${v}`, `-\\csc${v}`, `\\cos${v}`] },
          { expr: `\\csc\\left(\\frac{\\pi}{2} - ${v}\\right)`, ans: `\\sec${v}`, wrong: [`\\csc${v}`, `-\\sec${v}`, `\\sin${v}`] },
          { expr: `\\cot\\left(\\frac{\\pi}{2} - ${v}\\right)`, ans: `\\tan${v}`, wrong: [`\\cot${v}`, `-\\tan${v}`, `\\cos${v}`] },
          { expr: `\\sin\\left(\\frac{\\pi}{2} + ${v}\\right)`, ans: `\\cos${v}`, wrong: [`-\\cos${v}`, `\\sin${v}`, `-\\sin${v}`] },
          { expr: `\\cos\\left(\\frac{\\pi}{2} + ${v}\\right)`, ans: `-\\sin${v}`, wrong: [`\\sin${v}`, `\\cos${v}`, `-\\cos${v}`] },
        ]);
        return oneOf(
          rng,
          t(`Simplify $${item.expr}$.`, `化简 $${item.expr}$。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(`By the cofunction identity, $${item.expr} = ${item.ans}$.`, `由余角恒等式可知，$${item.expr} = ${item.ans}$。`),
        );
      },
    },
    {
      id: "cofunction-identities-in-degree-expressions",
      title: t("Cofunction identities with numerical angles", "数字角度中的余角恒等式"),
      explanation: t(
        "Since $\\\\sin(90^{\\\\circ} - x) = \\\\cos x$, ratios of complementary angles are equal: $\\\\sin(70^{\\\\circ}) = \\\\cos(20^{\\\\circ})$, so $\\\\frac{\\\\sin(70^{\\\\circ})}{\\\\cos(20^{\\\\circ})} = 1$.",
        "因为 $\\\\sin(90^{\\\\circ} - x) = \\\\cos x$，互余角的对应三角比相等：$\\\\sin(70^{\\\\circ}) = \\\\cos(20^{\\\\circ})$，因此 $\\\\frac{\\\\sin(70^{\\\\circ})}{\\\\cos(20^{\\\\circ})} = 1$。",
      ),
      generate(rng) {
        const deg = rng.int(10, 80);
        const comp = 90 - deg;
        const kind = rng.pick(["sinCos", "tanCot", "diff"] as const);
        if (kind === "sinCos") {
          return oneOf(
            rng,
            t(
              `Simplify $\\\\frac{\\\\sin(${deg}^{\\\\circ})}{\\\\cos(${comp}^{\\\\circ})}$.`,
              `化简 $\\\\frac{\\\\sin(${deg}^{\\\\circ})}{\\\\cos(${comp}^{\\\\circ})}$。`,
            ),
            t("$1$", "$1$"),
            [t("$0$", "$0$"), t("$-1$", "$-1$"), t(`$\\\\tan(${deg}^{\\\\circ})$`, `$\\\\tan(${deg}^{\\\\circ})$`)],
            t(
              `Since $\\cos(${comp}^\\circ) = \\cos(90^\\circ - ${deg}^\\circ) = \\sin(${deg}^\\circ)$, the ratio is $1$.`,
              `因为 $\\cos(${comp}^\\circ) = \\cos(90^\\circ - ${deg}^\\circ) = \\sin(${deg}^\\circ)$，所以商等于 $1$。`,
            ),
          );
        }
        if (kind === "tanCot") {
          return oneOf(
            rng,
            t(
              `Simplify $\\\\tan(${deg}^{\\\\circ}) \\\\tan(${comp}^{\\\\circ})$.`,
              `化简 $\\\\tan(${deg}^{\\\\circ}) \\\\tan(${comp}^{\\\\circ})$。`,
            ),
            t("$1$", "$1$"),
            [t("$0$", "$0$"), t("$-1$", "$-1$"), t(`$\\\\tan^{2}(${deg}^{\\\\circ})$`, `$\\\\tan^{2}(${deg}^{\\\\circ})$`)],
            t(
              `Since $\\tan(${comp}^\\circ) = \\cot(${deg}^\\circ) = \\frac{1}{\\tan(${deg}^\\circ)}$, the product is $1$.`,
              `因为 $\\tan(${comp}^\\circ) = \\cot(${deg}^\\circ) = \\frac{1}{\\tan(${deg}^\\circ)}$，所以乘积等于 $1$。`,
            ),
          );
        }
        return oneOf(
          rng,
          t(
            `Simplify $\\\\sin(${deg}^{\\\\circ}) - \\\\cos(${comp}^{\\\\circ})$.`,
            `化简 $\\\\sin(${deg}^{\\\\circ}) - \\\\cos(${comp}^{\\\\circ})$。`,
          ),
          t("$0$", "$0$"),
          [t("$1$", "$1$"), t("$-1$", "$-1$"), t(`$2\\\\sin(${deg}^{\\\\circ})$`, `$2\\\\sin(${deg}^{\\\\circ})$`)],
          t(
            `Since $\\sin(${deg}^\\circ) = \\cos(${comp}^\\circ)$, the difference is $0$.`,
            `因为 $\\sin(${deg}^\\circ) = \\cos(${comp}^\\circ)$，所以两项相减等于 $0$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.11.1 The sum and difference formulas for sine ────────────────────────

/** theSumAndDifferenceFormulasForSine applies sin(α ± β) = sin α cos β ± cos α sin β. */
export const theSumAndDifferenceFormulasForSine: TopicDef = {
  id: "the-sum-and-difference-formulas-for-sine",
  title: t("The Sum and Difference Formulas for Sine", "正弦的和差角公式"),
  summary: t(
    "Expand and collapse expressions using the angle addition and subtraction identities for sine: sin(α ± β) = sin α cos β ± cos α sin β.",
    "利用正弦的和角与差角公式 sin(α ± β) = sin α cos β ± cos α sin β 展开与化简表达式。",
  ),
  prerequisites: ["simplifying-expressions-using-the-pythagorean-identity"],
  encompasses: [{ topic: "simplifying-expressions-using-the-pythagorean-identity", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "sine-sum-difference-formulas",
      title: t("Sine sum and difference identities", "正弦和差公式形式"),
      explanation: t(
        "The angle addition and subtraction formulas for sine are:\\n\\n$$\\\\sin(\\\\alpha + \\\\beta) = \\\\sin \\\\alpha \\\\cos \\\\beta + \\\\cos \\\\alpha \\\\sin \\\\beta, \\\\quad \\\\sin(\\\\alpha - \\\\beta) = \\\\sin \\\\alpha \\\\cos \\\\beta - \\\\cos \\\\alpha \\\\sin \\\\beta$$",
        "正弦的和差角公式为：\\n\\n$$\\\\sin(\\\\alpha + \\\\beta) = \\\\sin \\\\alpha \\\\cos \\\\beta + \\\\cos \\\\alpha \\\\sin \\\\beta, \\\\quad \\\\sin(\\\\alpha - \\\\beta) = \\\\sin \\\\alpha \\\\cos \\\\beta - \\\\cos \\\\alpha \\\\sin \\\\beta$$",
      ),
      generate(rng) {
        const isSum = rng.bool();
        const a = rng.int(10, 50);
        const b = rng.int(10, 40);
        const opStr = isSum ? "+" : "-";
        const resAngle = isSum ? a + b : a - b;
        return oneOf(
          rng,
          t(
            `Simplify $\\\\sin(${a}^{\\\\circ})\\\\cos(${b}^{\\\\circ}) ${opStr} \\\\cos(${a}^{\\\\circ})\\\\sin(${b}^{\\\\circ})$.`,
            `化简 $\\\\sin(${a}^{\\\\circ})\\\\cos(${b}^{\\\\circ}) ${opStr} \\\\cos(${a}^{\\\\circ})\\\\sin(${b}^{\\\\circ})$。`,
          ),
          t(`$\\\\sin(${resAngle}^{\\\\circ})$`, `$\\\\sin(${resAngle}^{\\\\circ})$`),
          [
            t(`$\\\\cos(${resAngle}^{\\\\circ})$`, `$\\\\cos(${resAngle}^{\\\\circ})$`),
            t(`$\\\\sin(${a + b + 10}^{\\\\circ})$`, `$\\\\sin(${a + b + 10}^{\\\\circ})$`),
            t(`$\\\\cos(${Math.abs(a - b)}^{\\\\circ})$`, `$\\\\cos(${Math.abs(a - b)}^{\\\\circ})$`),
          ],
          t(
            `By the sine ${isSum ? "sum" : "difference"} formula, $\\sin(\\alpha ${opStr} \\beta) = \\sin \\alpha \\cos \\beta ${opStr} \\cos \\alpha \\sin \\beta$, which gives $\\sin(${resAngle}^\\circ)$.`,
            `由正弦${isSum ? "和角" : "差角"}公式，原式等于 $\\sin(${a}^\\circ ${opStr} ${b}^\\circ) = \\sin(${resAngle}^\\circ)$。`,
          ),
        );
      },
    },
    {
      id: "collapsing-sine-to-special-values",
      title: t("Evaluating collapsed sine formulas", "正弦和差公式计算特殊角"),
      explanation: t(
        "Collapsing expressions can yield special angles:\\n\\n$$\\\\sin(40^{\\\\circ})\\\\cos(20^{\\\\circ}) + \\\\cos(40^{\\\\circ})\\\\sin(20^{\\\\circ}) = \\\\sin(60^{\\\\circ}) = \\\\frac{\\\\sqrt{3}}{2}$$",
        "将式子合并为单个正弦后可直接求出特殊角的值：\\n\\n$$\\\\sin(40^{\\\\circ})\\\\cos(20^{\\\\circ}) + \\\\cos(40^{\\\\circ})\\\\sin(20^{\\\\circ}) = \\\\sin(60^{\\\\circ}) = \\\\frac{\\\\sqrt{3}}{2}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { a: 40, b: 20, isSum: true, ans: "\\frac{\\sqrt{3}}{2}" },
          { a: 70, b: 25, isSum: false, ans: "\\frac{\\sqrt{2}}{2}" },
          { a: 20, b: 10, isSum: true, ans: "\\frac{1}{2}" },
          { a: 50, b: 20, isSum: false, ans: "\\frac{1}{2}" },
          { a: 80, b: 20, isSum: false, ans: "\\frac{\\sqrt{3}}{2}" },
          { a: 10, b: 20, isSum: true, ans: "\\frac{1}{2}" },
          { a: 60, b: 15, isSum: true, ans: "\\frac{\\sqrt{6}+\\sqrt{2}}{4}" },
          { a: 45, b: 30, isSum: true, ans: "\\frac{\\sqrt{6}+\\sqrt{2}}{4}" },
          { a: 45, b: 30, isSum: false, ans: "\\frac{\\sqrt{6}-\\sqrt{2}}{4}" },
          { a: 65, b: 5, isSum: false, ans: "1" },
          { a: 55, b: 35, isSum: true, ans: "1" },
          { a: 30, b: 15, isSum: true, ans: "\\frac{\\sqrt{6}+\\sqrt{2}}{4}" },
          { a: 50, b: 10, isSum: true, ans: "\\frac{\\sqrt{3}}{2}" },
          { a: 75, b: 15, isSum: false, ans: "\\frac{\\sqrt{3}}{2}" },
          { a: 25, b: 20, isSum: true, ans: "\\frac{\\sqrt{2}}{2}" },
          { a: 60, b: 30, isSum: true, ans: "1" },
          { a: 45, b: 45, isSum: true, ans: "1" },
          { a: 70, b: 10, isSum: false, ans: "1" },
          { a: 45, b: 15, isSum: true, ans: "\\frac{\\sqrt{3}}{2}" },
          { a: 55, b: 25, isSum: false, ans: "\\frac{1}{2}" },
          { a: 40, b: 5, isSum: true, ans: "\\frac{\\sqrt{2}}{2}" },
          { a: 75, b: 15, isSum: true, ans: "\\frac{\\sqrt{6}+\\sqrt{2}}{4}" },
          { a: 35, b: 10, isSum: true, ans: "\\frac{\\sqrt{2}}{2}" },
          { a: 40, b: 50, isSum: true, ans: "1" },
          { a: 65, b: 25, isSum: false, ans: "\\frac{\\sqrt{3}}{2}" },
          { a: 80, b: 50, isSum: false, ans: "\\frac{1}{2}" },
        ]);
        const opStr = item.isSum ? "+" : "-";
        return oneOf(
          rng,
          t(
            `Find the exact value of $\\\\sin(${item.a}^{\\\\circ})\\\\cos(${item.b}^{\\\\circ}) ${opStr} \\\\cos(${item.a}^{\\\\circ})\\\\sin(${item.b}^{\\\\circ})$.`,
            `求 $\\\\sin(${item.a}^{\\\\circ})\\\\cos(${item.b}^{\\\\circ}) ${opStr} \\\\cos(${item.a}^{\\\\circ})\\\\sin(${item.b}^{\\\\circ})$ 的精确值。`,
          ),
          t(`$${item.ans}$`, `$${item.ans}$`),
          [
            t("$0$", "$0$"),
            t("$1$", "$1$"),
            t("$\\frac{\\sqrt{2}}{2}$", "$\\frac{\\sqrt{2}}{2}$"),
            t("$\\frac{1}{2}$", "$\\frac{1}{2}$"),
          ].filter((o) => o.en !== `$${item.ans}$`),
          t(
            `Collapse using the sine ${item.isSum ? "sum" : "difference"} formula: $\\sin(${item.a}^\\circ ${opStr} ${item.b}^\\circ) = ${item.ans}$.`,
            `应用正弦${item.isSum ? "和角" : "差角"}公式化简：$\\sin(${item.a}^\\circ ${opStr} ${item.b}^\\circ) = ${item.ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.11.2 The sum and difference formulas for cosine ──────────────────────

/** theSumAndDifferenceFormulasForCosine applies cos(α ± β) = cos α cos β ∓ sin α sin β. */
export const theSumAndDifferenceFormulasForCosine: TopicDef = {
  id: "the-sum-and-difference-formulas-for-cosine",
  title: t("The Sum and Difference Formulas for Cosine", "余弦的和差角公式"),
  summary: t(
    "Expand and collapse expressions using the angle addition and subtraction identities for cosine: cos(α ± β) = cos α cos β ∓ sin α sin β.",
    "利用余弦的和角与差角公式 cos(α ± β) = cos α cos β ∓ sin α sin β 展开与化简表达式。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-sine"],
  encompasses: [{ topic: "the-sum-and-difference-formulas-for-sine", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "cosine-sum-difference-formulas",
      title: t("Cosine sum and difference identities", "余弦和差公式形式"),
      explanation: t(
        "Note the sign flip in cosine formulas:\\n\\n$$\\\\cos(\\\\alpha + \\\\beta) = \\\\cos \\\\alpha \\\\cos \\\\beta - \\\\sin \\\\alpha \\\\sin \\\\beta, \\\\quad \\\\cos(\\\\alpha - \\\\beta) = \\\\cos \\\\alpha \\\\cos \\\\beta + \\\\sin \\\\alpha \\\\sin \\\\beta$$",
        "注意余弦和差公式中的正负号反转：\\n\\n$$\\\\cos(\\\\alpha + \\\\beta) = \\\\cos \\\\alpha \\\\cos \\\\beta - \\\\sin \\\\alpha \\\\sin \\\\beta, \\\\quad \\\\cos(\\\\alpha - \\\\beta) = \\\\cos \\\\alpha \\\\cos \\\\beta + \\\\sin \\\\alpha \\\\sin \\\\beta$$",
      ),
      generate(rng) {
        const isSum = rng.bool();
        const a = rng.int(15, 60);
        const b = rng.int(10, 45);
        const signStr = isSum ? "-" : "+";
        const resAngle = isSum ? a + b : a - b;
        return oneOf(
          rng,
          t(
            `Simplify $\\\\cos(${a}^{\\\\circ})\\\\cos(${b}^{\\\\circ}) ${signStr} \\\\sin(${a}^{\\\\circ})\\\\sin(${b}^{\\\\circ})$.`,
            `化简 $\\\\cos(${a}^{\\\\circ})\\\\cos(${b}^{\\\\circ}) ${signStr} \\\\sin(${a}^{\\\\circ})\\\\sin(${b}^{\\\\circ})$。`,
          ),
          t(`$\\\\cos(${resAngle}^{\\\\circ})$`, `$\\\\cos(${resAngle}^{\\\\circ})$`),
          [
            t(`$\\\\sin(${resAngle}^{\\\\circ})$`, `$\\\\sin(${resAngle}^{\\\\circ})$`),
            t(`$\\\\cos(${a + b + 15}^{\\\\circ})$`, `$\\\\cos(${a + b + 15}^{\\\\circ})$`),
            t(`$\\\\sin(${Math.abs(a - b)}^{\\\\circ})$`, `$\\\\sin(${Math.abs(a - b)}^{\\\\circ})$`),
          ],
          t(
            `By the cosine ${isSum ? "sum" : "difference"} formula (remembering the sign flip), this equals $\\cos(${resAngle}^\\circ)$.`,
            `由余弦${isSum ? "和角" : "差角"}公式（注意符号反转），该式等于 $\\cos(${resAngle}^\\circ)$。`,
          ),
        );
      },
    },
    {
      id: "collapsing-cosine-to-special-values",
      title: t("Evaluating collapsed cosine formulas", "余弦和差公式计算特殊角"),
      explanation: t(
        "Collapsing terms with the cosine formula:\\n\\n$$\\\\cos(70^{\\\\circ})\\\\cos(10^{\\\\circ}) + \\\\sin(70^{\\\\circ})\\\\sin(10^{\\\\circ}) = \\\\cos(60^{\\\\circ}) = \\\\frac{1}{2}$$",
        "利用余弦和差公式合并求特殊角：\\n\\n$$\\\\cos(70^{\\\\circ})\\\\cos(10^{\\\\circ}) + \\\\sin(70^{\\\\circ})\\\\sin(10^{\\\\circ}) = \\\\cos(60^{\\\\circ}) = \\\\frac{1}{2}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { a: 70, b: 10, isMinus: false, ans: "\\frac{1}{2}" },
          { a: 40, b: 20, isMinus: true, ans: "\\frac{1}{2}" },
          { a: 50, b: 20, isMinus: true, ans: "\\frac{\\sqrt{3}}{2}" },
          { a: 75, b: 30, isMinus: false, ans: "\\frac{\\sqrt{2}}{2}" },
          { a: 15, b: 30, isMinus: false, ans: "\\frac{\\sqrt{2}}{2}" },
          { a: 50, b: 10, isMinus: true, ans: "\\frac{\\sqrt{2}}{2}" },
          { a: 35, b: 25, isMinus: false, ans: "\\frac{\\sqrt{2}}{2}" },
          { a: 80, b: 20, isMinus: true, ans: "\\frac{1}{2}" },
          { a: 45, b: 15, isMinus: false, ans: "\\frac{\\sqrt{6}-\\sqrt{2}}{4}" },
          { a: 45, b: 30, isMinus: true, ans: "\\frac{\\sqrt{6}-\\sqrt{2}}{4}" },
          { a: 45, b: 15, isMinus: true, ans: "\\frac{\\sqrt{6}+\\sqrt{2}}{4}" },
          { a: 60, b: 15, isMinus: false, ans: "\\frac{\\sqrt{6}-\\sqrt{2}}{4}" },
          { a: 30, b: 30, isMinus: false, ans: "\\frac{1}{2}" },
          { a: 60, b: 30, isMinus: false, ans: "0" },
          { a: 45, b: 45, isMinus: false, ans: "0" },
          { a: 65, b: 5, isMinus: true, ans: "\\frac{\\sqrt{3}}{2}" },
          { a: 40, b: 10, isMinus: false, ans: "\\frac{\\sqrt{3}}{2}" },
          { a: 60, b: 0, isMinus: true, ans: "\\frac{1}{2}" },
          { a: 70, b: 40, isMinus: true, ans: "\\frac{\\sqrt{3}}{2}" },
          { a: 30, b: 15, isMinus: false, ans: "\\frac{\\sqrt{6}+\\sqrt{2}}{4}" },
          { a: 80, b: 35, isMinus: false, ans: "\\frac{\\sqrt{6}+\\sqrt{2}}{4}" },
          { a: 55, b: 25, isMinus: true, ans: "\\frac{\\sqrt{3}}{2}" },
          { a: 55, b: 25, isMinus: false, ans: "0" },
          { a: 60, b: 15, isMinus: true, ans: "\\frac{\\sqrt{6}+\\sqrt{2}}{4}" },
          { a: 75, b: 45, isMinus: false, ans: "\\frac{\\sqrt{3}}{2}" },
          { a: 25, b: 20, isMinus: false, ans: "\\frac{\\sqrt{2}}{2}" },
        ]);
        const signStr = item.isMinus ? "-" : "+";
        return oneOf(
          rng,
          t(
            `Find the exact value of $\\\\cos(${item.a}^{\\\\circ})\\\\cos(${item.b}^{\\\\circ}) ${signStr} \\\\sin(${item.a}^{\\\\circ})\\\\sin(${item.b}^{\\\\circ})$.`,
            `求 $\\\\cos(${item.a}^{\\\\circ})\\\\cos(${item.b}^{\\\\circ}) ${signStr} \\\\sin(${item.a}^{\\\\circ})\\\\sin(${item.b}^{\\\\circ})$ 的精确值。`,
          ),
          t(`$${item.ans}$`, `$${item.ans}$`),
          [
            t("$0$", "$0$"),
            t("$1$", "$1$"),
            t("$\\frac{\\sqrt{3}}{2}$", "$\\frac{\\sqrt{3}}{2}$"),
            t("$\\frac{1}{2}$", "$\\frac{1}{2}$"),
          ].filter((o) => o.en !== `$${item.ans}$`),
          t(
            `By the cosine formula, the expression equals $\\cos(${item.isMinus ? item.a + item.b : item.a - item.b}^\\circ) = ${item.ans}$.`,
            `由余弦和差角公式，原式等于 $\\cos(${item.isMinus ? item.a + item.b : item.a - item.b}^\\circ) = ${item.ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.11.3 The sum and difference formulas for tangent ─────────────────────

/** theSumAndDifferenceFormulasForTangent applies tan(α ± β) = (tan α ± tan β)/(1 ∓ tan α tan β). */
export const theSumAndDifferenceFormulasForTangent: TopicDef = {
  id: "the-sum-and-difference-formulas-for-tangent",
  title: t("The Sum and Difference Formulas for Tangent", "正切的和差角公式"),
  summary: t(
    "Expand and collapse expressions using the tangent addition and subtraction formulas.",
    "利用正切的和角与差角公式展开与化简表达式。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-cosine"],
  encompasses: [{ topic: "the-sum-and-difference-formulas-for-sine", weight: 0.3 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "tangent-sum-difference-formulas",
      title: t("Tangent sum and difference identities", "正切和差公式形式"),
      explanation: t(
        "The angle addition and subtraction formulas for tangent are:\\n\\n$$\\\\tan(\\\\alpha + \\\\beta) = \\\\frac{\\\\tan\\\\alpha + \\\\tan\\\\beta}{1 - \\\\tan\\\\alpha\\\\tan\\\\beta}, \\\\quad \\\\tan(\\\\alpha - \\\\beta) = \\\\frac{\\\\tan\\\\alpha - \\\\tan\\\\beta}{1 + \\\\tan\\\\alpha\\\\tan\\\\beta}$$",
        "正切的和差角公式为：\\n\\n$$\\\\tan(\\\\alpha + \\\\beta) = \\\\frac{\\\\tan\\\\alpha + \\\\tan\\\\beta}{1 - \\\\tan\\\\alpha\\\\tan\\\\beta}, \\\\quad \\\\tan(\\\\alpha - \\\\beta) = \\\\frac{\\\\tan\\\\alpha - \\\\tan\\\\beta}{1 + \\\\tan\\\\alpha\\\\tan\\\\beta}$$",
      ),
      generate(rng) {
        const isSum = rng.bool();
        const a = rng.int(20, 60);
        const b = rng.int(10, 30);
        const topSign = isSum ? "+" : "-";
        const botSign = isSum ? "-" : "+";
        const resAngle = isSum ? a + b : a - b;
        return oneOf(
          rng,
          t(
            `Simplify $\\\\frac{\\\\tan(${a}^{\\\\circ}) ${topSign} \\\\tan(${b}^{\\\\circ})}{1 ${botSign} \\\\tan(${a}^{\\\\circ})\\\\tan(${b}^{\\\\circ})}$.`,
            `化简 $\\\\frac{\\\\tan(${a}^{\\\\circ}) ${topSign} \\\\tan(${b}^{\\\\circ})}{1 ${botSign} \\\\tan(${a}^{\\\\circ})\\\\tan(${b}^{\\\\circ})}$。`,
          ),
          t(`$\\\\tan(${resAngle}^{\\\\circ})$`, `$\\\\tan(${resAngle}^{\\\\circ})$`),
          [
            t(`$\\\\cot(${resAngle}^{\\\\circ})$`, `$\\\\cot(${resAngle}^{\\\\circ})$`),
            t(`$\\\\tan(${a + b + 10}^{\\\\circ})$`, `$\\\\tan(${a + b + 10}^{\\\\circ})$`),
            t(`$\\\\tan(${Math.abs(a - b)}^{\\\\circ})$`, `$\\\\tan(${Math.abs(a - b)}^{\\\\circ})$`),
          ],
          t(
            `By the tangent ${isSum ? "sum" : "difference"} formula, the expression equals $\\tan(${resAngle}^\\circ)$.`,
            `由正切${isSum ? "和角" : "差角"}公式，该式等于 $\\tan(${resAngle}^\\circ)$。`,
          ),
        );
      },
    },
    {
      id: "collapsing-tangent-to-special-values",
      title: t("Evaluating collapsed tangent formulas", "正切和差公式计算特殊角"),
      explanation: t(
        "Collapsing tangent expressions to special angles:\\n\\n$$\\\\frac{\\\\tan(50^{\\\\circ}) - \\\\tan(20^{\\\\circ})}{1 + \\\\tan(50^{\\\\circ})\\\\tan(20^{\\\\circ})} = \\\\tan(30^{\\\\circ}) = \\\\frac{\\\\sqrt{3}}{3}$$",
        "利用正切公式合并求特殊角：\\n\\n$$\\\\frac{\\\\tan(50^{\\\\circ}) - \\\\tan(20^{\\\\circ})}{1 + \\\\tan(50^{\\\\circ})\\\\tan(20^{\\\\circ})} = \\\\tan(30^{\\\\circ}) = \\\\frac{\\\\sqrt{3}}{3}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { a: 50, b: 20, isSum: false, ans: "\\frac{\\sqrt{3}}{3}" },
          { a: 20, b: 25, isSum: true, ans: "1" },
          { a: 40, b: 20, isSum: true, ans: "\\sqrt{3}" },
          { a: 70, b: 25, isSum: false, ans: "1" },
          { a: 75, b: 15, isSum: false, ans: "\\sqrt{3}" },
          { a: 50, b: 5, isSum: false, ans: "\\frac{\\sqrt{3}}{3}" },
          { a: 35, b: 10, isSum: true, ans: "1" },
          { a: 10, b: 20, isSum: true, ans: "\\frac{\\sqrt{3}}{3}" },
          { a: 55, b: 5, isSum: false, ans: "1" },
          { a: 45, b: 15, isSum: true, ans: "-1" },
          { a: 60, b: 15, isSum: true, ans: "-1" },
          { a: 80, b: 35, isSum: false, ans: "\\frac{\\sqrt{3}}{3}" },
          { a: 70, b: 10, isSum: false, ans: "1" },
          { a: 45, b: 75, isSum: true, ans: "-1" },
          { a: 25, b: 5, isSum: false, ans: "\\frac{\\sqrt{3}}{3}" },
          { a: 30, b: 15, isSum: true, ans: "\\sqrt{3}" },
          { a: 60, b: 30, isSum: false, ans: "\\frac{\\sqrt{3}}{3}" },
          { a: 65, b: 20, isSum: false, ans: "\\frac{\\sqrt{3}}{3}" },
          { a: 45, b: 45, isSum: false, ans: "0" },
          { a: 30, b: 15, isSum: false, ans: "\\frac{\\sqrt{3}}{3}" },
          { a: 20, b: 40, isSum: true, ans: "\\sqrt{3}" },
          { a: 55, b: 35, isSum: true, ans: "-1" },
          { a: 40, b: 5, isSum: true, ans: "1" },
          { a: 25, b: 20, isSum: true, ans: "\\sqrt{3}" },
          { a: 35, b: 25, isSum: false, ans: "\\frac{\\sqrt{3}}{3}" },
          { a: 50, b: 50, isSum: true, ans: "0" },
        ]);
        const topSign = item.isSum ? "+" : "-";
        const botSign = item.isSum ? "-" : "+";
        return oneOf(
          rng,
          t(
            `Find the exact value of $\\\\frac{\\\\tan(${item.a}^{\\\\circ}) ${topSign} \\\\tan(${item.b}^{\\\\circ})}{1 ${botSign} \\\\tan(${item.a}^{\\\\circ})\\\\tan(${item.b}^{\\\\circ})}$.`,
            `求 $\\\\frac{\\\\tan(${item.a}^{\\\\circ}) ${topSign} \\\\tan(${item.b}^{\\\\circ})}{1 ${botSign} \\\\tan(${item.a}^{\\\\circ})\\\\tan(${item.b}^{\\\\circ})}$ 的精确值。`,
          ),
          t(`$${item.ans}$`, `$${item.ans}$`),
          [t("$1$", "$1$"), t("$\\sqrt{3}$", "$\\sqrt{3}$"), t("$\\frac{\\sqrt{3}}{3}$", "$\\frac{\\sqrt{3}}{3}$"), t("$0$", "$0$")].filter(
            (o) => o.en !== `$${item.ans}$`,
          ),
          t(
            `Collapse using the tangent formula: $\\tan(${item.isSum ? item.a + item.b : item.a - item.b}^\\circ) = ${item.ans}$.`,
            `利用正切和差公式化简：$\\tan(${item.isSum ? item.a + item.b : item.a - item.b}^\\circ) = ${item.ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.11.4 Calculating sine ratios using sum formula ───────────────────────

/** calculatingTrigonometricRatiosUsingTheSumFormulaForSine finds exact values. */
export const calculatingTrigonometricRatiosUsingTheSumFormulaForSine: TopicDef = {
  id: "calculating-trigonometric-ratios-using-the-sum-formula-for-sine",
  title: t("Calculating Trigonometric Ratios Using the Sum Formula for Sine", "用正弦和差角公式求三角比的精确值"),
  summary: t(
    "Calculate the exact values of sine for non-standard angles such as 75° (5π/12) and 15° (π/12).",
    "利用正弦和差角公式计算 75° (5π/12) 与 15° (π/12) 等非标准特殊角的精确值。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-sine", "evaluating-trigonometric-expressions"],
  encompasses: [{ topic: "the-sum-and-difference-formulas-for-sine", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "exact-sine-of-fifteen-and-seventy-five",
      title: t("Exact sine of 15° and 75°", "15° 与 75° 的正弦精确值"),
      explanation: t(
        "Using $75^{\\\\circ} = 45^{\\\\circ} + 30^{\\\\circ}$ and $15^{\\\\circ} = 45^{\\\\circ} - 30^{\\\\circ}$:\\n\\n$$\\\\sin(75^{\\\\circ}) = \\\\sin(45^{\\\\circ})\\\\cos(30^{\\\\circ}) + \\\\cos(45^{\\\\circ})\\\\sin(30^{\\\\circ}) = \\\\frac{\\\\sqrt{2}}{2}\\\\frac{\\\\sqrt{3}}{2} + \\\\frac{\\\\sqrt{2}}{2}\\\\frac{1}{2} = \\\\frac{\\\\sqrt{6} + \\\\sqrt{2}}{4}$$\\n\\n$$\\\\sin(15^{\\\\circ}) = \\\\frac{\\\\sqrt{6} - \\\\sqrt{2}}{4}$$",
        "由 $75^{\\\\circ} = 45^{\\\\circ} + 30^{\\\\circ}$ 以及 $15^{\\\\circ} = 45^{\\\\circ} - 30^{\\\\circ}$：\\n\\n$$\\\\sin(75^{\\\\circ}) = \\\\frac{\\\\sqrt{6} + \\\\sqrt{2}}{4}, \\\\quad \\\\sin(15^{\\\\circ}) = \\\\frac{\\\\sqrt{6} - \\\\sqrt{2}}{4}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { deg: 15, decomp: "45° − 30°", ans: "\frac{sqrt{6} - sqrt{2}}{4}" },
          { deg: 75, decomp: "45° + 30°", ans: "\frac{sqrt{6} + sqrt{2}}{4}" },
          { deg: 105, decomp: "60° + 45°", ans: "\frac{sqrt{6} + sqrt{2}}{4}" },
          { deg: 165, decomp: "180° − 15°", ans: "\frac{sqrt{6} - sqrt{2}}{4}" },
          { deg: 195, decomp: "180° + 15°", ans: "-\frac{sqrt{6} - sqrt{2}}{4}" },
          { deg: 255, decomp: "270° − 15°", ans: "-\frac{sqrt{6} + sqrt{2}}{4}" },
          { deg: 285, decomp: "270° + 15°", ans: "-\frac{sqrt{6} + sqrt{2}}{4}" },
          { deg: 345, decomp: "360° − 15°", ans: "-\frac{sqrt{6} - sqrt{2}}{4}" },
          { deg: -15, decomp: "−15°", ans: "-\frac{sqrt{6} - sqrt{2}}{4}" },
          { deg: -75, decomp: "−75°", ans: "-\frac{sqrt{6} + sqrt{2}}{4}" },
          { deg: 375, decomp: "360° + 15°", ans: "\frac{sqrt{6} - sqrt{2}}{4}" },
          { deg: 435, decomp: "360° + 75°", ans: "\frac{sqrt{6} + sqrt{2}}{4}" },
        ]);
        const mult = rng.pick([1, 2, 4]);
        const promptStr = mult === 1 ? `sin(${item.deg}^circ)` : `${mult}sin(${item.deg}^circ)`;
        const ansStr = mult === 1 ? item.ans : `${mult}cdotleft(${item.ans}\right)`;
        const wrongList = [
          "\frac{sqrt{6} + sqrt{2}}{4}",
          "\frac{sqrt{6} - sqrt{2}}{4}",
          "-\frac{sqrt{6} + sqrt{2}}{4}",
          "-\frac{sqrt{6} - sqrt{2}}{4}",
          "\frac{sqrt{3}}{2}",
          "\frac{sqrt{2}}{2}",
        ]
          .filter((w) => w !== item.ans)
          .slice(0, 3);
        const wrongStr = wrongList.map((w) => (mult === 1 ? `$${w}$` : `$${mult}cdotleft(${w}\right)$`));
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          t(
            `Decompose using $${item.decomp}$ and apply the sine formula: result is $${ansStr}$.`,
            `利用 $${item.decomp}$ 分解并应用正弦和差公式：结果为 $${ansStr}$。`,
          ),
        );
      },
    },
    {
      id: "exact-sine-in-radians-twelfths",
      title: t("Exact sine for radian multiples of π/12", "π/12 弧度倍角处的正弦精确值"),
      explanation: t(
        "In radians, $\\\\frac{5\\\\pi}{12} = 75^{\\\\circ}$ and $\\\\frac{\\\\pi}{12} = 15^{\\\\circ}$:\\n\\n$$\\\\sin\\\\left(\\\\frac{5\\\\pi}{12}\\\\right) = \\\\frac{\\\\sqrt{6} + \\\\sqrt{2}}{4}, \\\\quad \\\\sin\\\\left(\\\\frac{\\\\pi}{12}\\\\right) = \\\\frac{\\\\sqrt{6} - \\\\sqrt{2}}{4}$$",
        "在弧度制下，$\\\\frac{5\\\\pi}{12} = 75^{\\\\circ}$，$\\\\frac{\\\\pi}{12} = 15^{\\\\circ}$：\\n\\n$$\\\\sin\\\\left(\\\\frac{5\\\\pi}{12}\\\\right) = \\\\frac{\\\\sqrt{6} + \\\\sqrt{2}}{4}, \\\\quad \\\\sin\\\\left(\\\\frac{\\\\pi}{12}\\\\right) = \\\\frac{\\\\sqrt{6} - \\\\sqrt{2}}{4}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { frac: "\frac{5pi}{12}", ans: "\frac{sqrt{6} + sqrt{2}}{4}", decomp: "pi/4 + pi/6" },
          { frac: "\frac{pi}{12}", ans: "\frac{sqrt{6} - sqrt{2}}{4}", decomp: "pi/4 - pi/6" },
          { frac: "\frac{7pi}{12}", ans: "\frac{sqrt{6} + sqrt{2}}{4}", decomp: "pi/3 + pi/4" },
          { frac: "\frac{11pi}{12}", ans: "\frac{sqrt{6} - sqrt{2}}{4}", decomp: "pi - pi/12" },
          { frac: "\frac{13pi}{12}", ans: "-\frac{sqrt{6} + sqrt{2}}{4}", decomp: "pi + pi/12" },
          { frac: "\frac{17pi}{12}", ans: "-\frac{sqrt{6} + sqrt{2}}{4}", decomp: "pi + 5pi/12" },
          { frac: "\frac{19pi}{12}", ans: "-\frac{sqrt{6} - sqrt{2}}{4}", decomp: "2pi - 5pi/12" },
          { frac: "\frac{23pi}{12}", ans: "-\frac{sqrt{6} - sqrt{2}}{4}", decomp: "2pi - pi/12" },
          { frac: "-\frac{pi}{12}", ans: "-\frac{sqrt{6} - sqrt{2}}{4}", decomp: "-(pi/4 - pi/6)" },
          { frac: "-\frac{5pi}{12}", ans: "-\frac{sqrt{6} + sqrt{2}}{4}", decomp: "-(pi/4 + pi/6)" },
          { frac: "\frac{25pi}{12}", ans: "\frac{sqrt{6} + sqrt{2}}{4}", decomp: "2pi + pi/12" },
          { frac: "\frac{29pi}{12}", ans: "\frac{sqrt{6} - sqrt{2}}{4}", decomp: "2pi + 5pi/12" },
        ]);
        const mult = rng.pick([1, 2, 4]);
        const promptStr = mult === 1 ? `sinleft(${item.frac}\right)` : `${mult}sinleft(${item.frac}\right)`;
        const ansStr = mult === 1 ? item.ans : `${mult}cdotleft(${item.ans}\right)`;
        const wrongList = [
          "\frac{sqrt{6} + sqrt{2}}{4}",
          "\frac{sqrt{6} - sqrt{2}}{4}",
          "-\frac{sqrt{6} + sqrt{2}}{4}",
          "-\frac{sqrt{6} - sqrt{2}}{4}",
        ].filter((w) => w !== item.ans);
        const wrongStr = wrongList.map((w) => (mult === 1 ? `$${w}$` : `$${mult}cdotleft(${w}\right)$`));
        return oneOf(
          rng,
          t(`Find the exact value of $\\displaystyle ${promptStr}$.`, `求 $\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.slice(0, 3).map((w) => t(w, w)),
          t(
            `Write $${item.frac} = ${item.decomp}$ and apply the sine formula: result is $${ansStr}$.`,
            `将 $${item.frac} = ${item.decomp}$ 并应用正弦公式：结果为 $${ansStr}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.11.5 Calculating cosine ratios using sum formula ─────────────────────

/** calculatingTrigonometricRatiosUsingTheSumFormulaForCosine finds exact values. */
export const calculatingTrigonometricRatiosUsingTheSumFormulaForCosine: TopicDef = {
  id: "calculating-trigonometric-ratios-using-the-sum-formula-for-cosine",
  title: t("Calculating Trigonometric Ratios Using the Sum Formula for Cosine", "用余弦和差角公式求三角比的精确值"),
  summary: t(
    "Calculate the exact values of cosine for non-standard angles such as 75° (5π/12) and 15° (π/12).",
    "利用余弦和差角公式计算 75° (5π/12) 与 15° (π/12) 等非标准特殊角的精确值。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-cosine", "calculating-trigonometric-ratios-using-the-sum-formula-for-sine"],
  encompasses: [{ topic: "the-sum-and-difference-formulas-for-cosine", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "exact-cosine-of-fifteen-and-seventy-five",
      title: t("Exact cosine of 15° and 75°", "15° 与 75° 的余弦精确值"),
      explanation: t(
        "Using $75^{\\\\circ} = 45^{\\\\circ} + 30^{\\\\circ}$ and $15^{\\\\circ} = 45^{\\\\circ} - 30^{\\\\circ}$:\\n\\n$$\\\\cos(75^{\\\\circ}) = \\\\cos(45^{\\\\circ})\\\\cos(30^{\\\\circ}) - \\\\sin(45^{\\\\circ})\\\\sin(30^{\\\\circ}) = \\\\frac{\\\\sqrt{6} - \\\\sqrt{2}}{4}$$\\n\\n$$\\\\cos(15^{\\\\circ}) = \\\\frac{\\\\sqrt{6} + \\\\sqrt{2}}{4}$$",
        "由 $75^{\\\\circ} = 45^{\\\\circ} + 30^{\\\\circ}$ 与 $15^{\\\\circ} = 45^{\\\\circ} - 30^{\\\\circ}$：\\n\\n$$\\\\cos(75^{\\\\circ}) = \\\\frac{\\\\sqrt{6} - \\\\sqrt{2}}{4}, \\\\quad \\\\cos(15^{\\\\circ}) = \\\\frac{\\\\sqrt{6} + \\\\sqrt{2}}{4}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { deg: 15, decomp: "45° − 30°", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 75, decomp: "45° + 30°", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: 105, decomp: "60° + 45°", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: 165, decomp: "180° − 15°", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 195, decomp: "180° + 15°", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 255, decomp: "270° − 15°", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: 285, decomp: "270° + 15°", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: 345, decomp: "360° − 15°", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: -15, decomp: "−15°", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: -75, decomp: "−75°", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: -105, decomp: "−105°", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
          { deg: -165, decomp: "−165°", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 375, decomp: "360° + 15°", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}" },
          { deg: 435, decomp: "360° + 75°", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}" },
        ]);
        const mult = rng.pick([1, 2, 4]);
        const promptStr = mult === 1 ? `\\cos(${item.deg}^\\circ)` : `${mult}\\cos(${item.deg}^\\circ)`;
        const ansStr = mult === 1 ? item.ans : `${mult}\\cdot\\left(${item.ans}\\right)`;
        const wrongList = [
          "\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
          "\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
          "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
          "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
          "\\frac{\\sqrt{3}}{2}",
          "\\frac{1}{2}",
        ]
          .filter((w) => w !== item.ans)
          .slice(0, 3);
        const wrongStr = wrongList.map((w) => (mult === 1 ? `$${w}$` : `$${mult}\\cdot\\left(${w}\\right)$`));
        return oneOf(
          rng,
          t(`Find the exact value of $\\\\displaystyle ${promptStr}$.`, `求 $\\\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          t(
            `Expand using the cosine formula with $${item.decomp}$: result is $${ansStr}$.`,
            `应用余弦公式与 $${item.decomp}$ 展开计算：结果为 $${ansStr}$。`,
          ),
        );
      },
    },
    {
      id: "exact-cosine-in-radians-twelfths",
      title: t("Exact cosine for radian multiples of π/12", "π/12 弧度倍角处的余弦精确值"),
      explanation: t(
        "For angles in radians:\\n\\n$$\\\\cos\\\\left(\\\\frac{5\\\\pi}{12}\\\\right) = \\\\frac{\\\\sqrt{6} - \\\\sqrt{2}}{4}, \\\\quad \\\\cos\\\\left(\\\\frac{\\\\pi}{12}\\\\right) = \\\\frac{\\\\sqrt{6} + \\\\sqrt{2}}{4}$$",
        "对于弧度制下的角：\\n\\n$$\\\\cos\\\\left(\\\\frac{5\\\\pi}{12}\\\\right) = \\\\frac{\\\\sqrt{6} - \\\\sqrt{2}}{4}, \\\\quad \\\\cos\\\\left(\\\\frac{\\\\pi}{12}\\\\right) = \\\\frac{\\\\sqrt{6} + \\\\sqrt{2}}{4}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { frac: "\\frac{5\\pi}{12}", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "\\pi/4 + \\pi/6" },
          { frac: "\\frac{\\pi}{12}", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "\\pi/4 - \\pi/6" },
          { frac: "\\frac{7\\pi}{12}", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "\\pi/3 + \\pi/4" },
          { frac: "\\frac{11\\pi}{12}", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "\\pi - \\pi/12" },
          { frac: "\\frac{13\\pi}{12}", ans: "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "\\pi + \\pi/12" },
          { frac: "\\frac{17\\pi}{12}", ans: "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "\\pi + 5\\pi/12" },
          { frac: "\\frac{19\\pi}{12}", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "2\\pi - 5\\pi/12" },
          { frac: "\\frac{23\\pi}{12}", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "2\\pi - \\pi/12" },
          { frac: "-\\frac{\\pi}{12}", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "-(\\pi/4 - \\pi/6)" },
          { frac: "-\\frac{5\\pi}{12}", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "-(\\pi/4 + \\pi/6)" },
          { frac: "\\frac{25\\pi}{12}", ans: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}", decomp: "2\\pi + \\pi/12" },
          { frac: "\\frac{29\\pi}{12}", ans: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}", decomp: "2\\pi + 5\\pi/12" },
        ]);
        const mult = rng.pick([1, 2, 4]);
        const promptStr = mult === 1 ? `\\cos\\left(${item.frac}\\right)` : `${mult}\\cos\\left(${item.frac}\\right)`;
        const ansStr = mult === 1 ? item.ans : `${mult}\\cdot\\left(${item.ans}\\right)`;
        const wrongList = [
          "\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
          "\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
          "-\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
          "-\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
        ].filter((w) => w !== item.ans);
        const wrongStr = wrongList.map((w) => (mult === 1 ? `$${w}$` : `$${mult}\\cdot\\left(${w}\\right)$`));
        return oneOf(
          rng,
          t(`Find the exact value of $\\\\displaystyle ${promptStr}$.`, `求 $\\\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.slice(0, 3).map((w) => t(w, w)),
          t(
            `Apply the cosine formula with $${item.decomp}$: $\\cos(${item.frac}) = ${item.ans}$, so the result is $${ansStr}$.`,
            `应用余弦公式与 $${item.decomp}$ 计算：$\\cos(${item.frac}) = ${item.ans}$，因此结果为 $${ansStr}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.11.6 Calculating tangent ratios using sum formula ────────────────────

/** calculatingTrigonometricRatiosUsingTheSumFormulaForTangent finds exact values. */
export const calculatingTrigonometricRatiosUsingTheSumFormulaForTangent: TopicDef = {
  id: "calculating-trigonometric-ratios-using-the-sum-formula-for-tangent",
  title: t("Calculating Trigonometric Ratios Using the Sum Formula for Tangent", "用正切和差角公式求三角比的精确值"),
  summary: t(
    "Calculate exact values of tangent for angles such as 75° = 2 + √3 and 15° = 2 - √3.",
    "利用正切和差角公式计算 75° = 2 + √3 与 15° = 2 - √3 等角的精确值。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-tangent", "calculating-trigonometric-ratios-using-the-sum-formula-for-sine"],
  encompasses: [{ topic: "the-sum-and-difference-formulas-for-tangent", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "exact-tangent-fifteen-seventy-five",
      title: t("Exact tangent of 15° and 75°", "15° 与 75° 的正切精确值"),
      explanation: t(
        "Using $75^{\\\\circ} = 45^{\\\\circ} + 30^{\\\\circ}$:\\n\\n$$\\\\tan(75^{\\\\circ}) = \\\\frac{\\\\tan 45^{\\\\circ} + \\\\tan 30^{\\\\circ}}{1 - \\\\tan 45^{\\\\circ}\\\\tan 30^{\\\\circ}} = \\\\frac{1 + 1/\\\\sqrt{3}}{1 - 1/\\\\sqrt{3}} = \\\\frac{\\\\sqrt{3} + 1}{\\\\sqrt{3} - 1} = 2 + \\\\sqrt{3}$$\\n\\nSimilarly, $\\\\tan(15^{\\\\circ}) = 2 - \\\\sqrt{3}$.",
        "由 $75^{\\\\circ} = 45^{\\\\circ} + 30^{\\\\circ}$：\\n\\n$$\\\\tan(75^{\\\\circ}) = 2 + \\\\sqrt{3}, \\\\quad \\\\tan(15^{\\\\circ}) = 2 - \\\\sqrt{3}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { deg: 15, ans: "2 - \\sqrt{3}", decomp: "45° − 30°" },
          { deg: 75, ans: "2 + \\sqrt{3}", decomp: "45° + 30°" },
          { deg: 105, ans: "-2 - \\sqrt{3}", decomp: "60° + 45°" },
          { deg: 165, ans: "-2 + \\sqrt{3}", decomp: "180° − 15°" },
          { deg: 195, ans: "2 - \\sqrt{3}", decomp: "180° + 15°" },
          { deg: 255, ans: "2 + \\sqrt{3}", decomp: "270° − 15°" },
          { deg: 285, ans: "-2 - \\sqrt{3}", decomp: "270° + 15°" },
          { deg: 345, ans: "-2 + \\sqrt{3}", decomp: "360° − 15°" },
          { deg: -15, ans: "-2 + \\sqrt{3}", decomp: "−15°" },
          { deg: -75, ans: "-2 - \\sqrt{3}", decomp: "−75°" },
          { deg: 375, ans: "2 - \\sqrt{3}", decomp: "360° + 15°" },
          { deg: 435, ans: "2 + \\sqrt{3}", decomp: "360° + 75°" },
        ]);
        const mult = rng.pick([1, 2, 3]);
        const promptStr = mult === 1 ? `\\tan(${item.deg}^\\circ)` : `${mult}\\tan(${item.deg}^\\circ)`;
        const ansStr = mult === 1 ? item.ans : `${mult}(${item.ans})`;
        const wrongList = ["2 + \\sqrt{3}", "2 - \\sqrt{3}", "-2 - \\sqrt{3}", "-2 + \\sqrt{3}", "\\sqrt{3}"]
          .filter((w) => w !== item.ans)
          .slice(0, 3);
        const wrongStr = wrongList.map((w) => (mult === 1 ? `$${w}$` : `$${mult}(${w})$`));
        return oneOf(
          rng,
          t(`Find the exact value of $\\\\displaystyle ${promptStr}$.`, `求 $\\\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          t(
            `Expand using the tangent addition formula with $${item.decomp}$: result is $${ansStr}$.`,
            `应用正切和角公式与 $${item.decomp}$ 展开：结果为 $${ansStr}$。`,
          ),
        );
      },
    },
    {
      id: "exact-tangent-in-radians",
      title: t("Exact tangent in radians", "弧度制下的正切精确值"),
      explanation: t(
        "In radians:\\n\\n$$\\\\tan\\\\left(\\\\frac{5\\\\pi}{12}\\\\right) = 2 + \\\\sqrt{3}, \\\\quad \\\\tan\\\\left(\\\\frac{\\\\pi}{12}\\\\right) = 2 - \\\\sqrt{3}$$",
        "在弧度制下：\\n\\n$$\\\\tan\\\\left(\\\\frac{5\\\\pi}{12}\\\\right) = 2 + \\\\sqrt{3}, \\\\quad \\\\tan\\\\left(\\\\frac{\\\\pi}{12}\\\\right) = 2 - \\\\sqrt{3}$$",
      ),
      generate(rng) {
        const item = rng.pick([
          { frac: "\\frac{5\\pi}{12}", ans: "2 + \\sqrt{3}" },
          { frac: "\\frac{\\pi}{12}", ans: "2 - \\sqrt{3}" },
          { frac: "\\frac{7\\pi}{12}", ans: "-2 - \\sqrt{3}" },
          { frac: "\\frac{11\\pi}{12}", ans: "-2 + \\sqrt{3}" },
          { frac: "\\frac{13\\pi}{12}", ans: "2 - \\sqrt{3}" },
          { frac: "\\frac{17\\pi}{12}", ans: "2 + \\sqrt{3}" },
          { frac: "\\frac{19\\pi}{12}", ans: "-2 - \\sqrt{3}" },
          { frac: "\\frac{23\\pi}{12}", ans: "-2 + \\sqrt{3}" },
          { frac: "-\\frac{\\pi}{12}", ans: "-2 + \\sqrt{3}" },
          { frac: "-\\frac{5\\pi}{12}", ans: "-2 - \\sqrt{3}" },
          { frac: "\\frac{25\\pi}{12}", ans: "2 - \\sqrt{3}" },
          { frac: "\\frac{29\\pi}{12}", ans: "2 + \\sqrt{3}" },
        ]);
        const mult = rng.pick([1, 2, 3]);
        const promptStr = mult === 1 ? `\\tan\\left(${item.frac}\\right)` : `${mult}\\tan\\left(${item.frac}\\right)`;
        const ansStr = mult === 1 ? item.ans : `${mult}(${item.ans})`;
        const wrongList = ["2 + \\sqrt{3}", "2 - \\sqrt{3}", "-2 - \\sqrt{3}", "-2 + \\sqrt{3}"].filter((w) => w !== item.ans);
        const wrongStr = wrongList.map((w) => (mult === 1 ? `$${w}$` : `$${mult}(${w})$`));
        return oneOf(
          rng,
          t(`Find the exact value of $\\\\displaystyle ${promptStr}$.`, `求 $\\\\displaystyle ${promptStr}$ 的精确值。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.slice(0, 3).map((w) => t(w, w)),
          t(
            `Apply the tangent sum formula: $\\tan(${item.frac}) = ${item.ans}$, so the result is $${ansStr}$.`,
            `应用正切和角公式计算得：$\\tan(${item.frac}) = ${item.ans}$，因此结果为 $${ansStr}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.11.7 Writing sums in amplitude-phase form ────────────────────────────

/** writingSumsOfTrigonometricFunctionsInAmplitudePhaseForm converts A sin + B cos. */
export const writingSumsOfTrigonometricFunctionsInAmplitudePhaseForm: TopicDef = {
  id: "writing-sums-of-trigonometric-functions-in-amplitude-phase-form",
  title: t("Writing Sums of Trigonometric Functions in Amplitude-Phase Form", "将三角函数和写为振幅-初相形式（辅助角公式）"),
  summary: t(
    "Convert a linear combination A sin(x) + B cos(x) into R sin(x + φ) where R = √(A² + B²) and tan(φ) = B/A.",
    "利用辅助角公式将线性组合 A sin(x) + B cos(x) 化为 R sin(x + φ)，其中 R = √(A² + B²) 且 tan(φ) = B/A。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-sine"],
  encompasses: [{ topic: "the-sum-and-difference-formulas-for-sine", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "amplitude-of-linear-combination",
      title: t("Amplitude of a sum of sine and cosine", "正弦与余弦线性组合的振幅"),
      explanation: t(
        "For $f(x) = A \\\\sin x + B \\\\cos x$, the maximum value (amplitude) is $R = \\\\sqrt{A^{2} + B^{2}}$. For $3\\\\sin x + 4\\\\cos x$:\\n\\n$$R = \\\\sqrt{3^{2} + 4^{2}} = 5$$",
        "对于 $f(x) = A \\\\sin x + B \\\\cos x$，其最大值（振幅）为 $R = \\\\sqrt{A^{2} + B^{2}}$。以 $3\\\\sin x + 4\\\\cos x$ 为例：\\n\\n$$R = \\\\sqrt{3^{2} + 4^{2}} = 5$$",
      ),
      generate(rng) {
        const allTriples = [
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
          [15, 8, 17],
          [7, 24, 25],
          [24, 7, 25],
          [20, 21, 29],
          [21, 20, 29],
          [9, 40, 41],
          [40, 9, 41],
          [12, 35, 37],
          [35, 12, 37],
        ] as const;
        const [baseA, baseB, baseC] = rng.pick(allTriples);
        const k = rng.pick([1, 2, 3, 4]);
        const a = k * baseA;
        const b = k * baseB;
        const c = k * baseC;
        const v = rng.pick(["x", "\\theta", "t", "u"]);
        const sign = rng.pick(["+", "-"]);
        return numberProblem({
          prompt: t(
            `Find the amplitude (maximum value) of $f(${v}) = ${a}\\\\sin ${v} ${sign} ${b}\\\\cos ${v}$.`,
            `求 $f(${v}) = ${a}\\\\sin ${v} ${sign} ${b}\\\\cos ${v}$ 的振幅（最大值）。`,
          ),
          answer: c,
          wrong: [a + b, Math.abs(a - b), c + k],
          solution: t(
            `The amplitude is $R = \\sqrt{A^{2} + B^{2}} = \\sqrt{${a}^{2} + ${b}^{2}} = ${c}$.`,
            `振幅为 $R = \\sqrt{A^{2} + B^{2}} = \\sqrt{${a}^{2} + ${b}^{2}} = ${c}$。`,
          ),
        });
      },
    },
    {
      id: "amplitude-phase-form-exact",
      title: t("Complete amplitude-phase form", "完整的振幅-初相表达式"),
      explanation: t(
        "Rewrite using the auxiliary angle:\\n\\n$$\\\\sqrt{3}\\\\sin x + \\\\cos x = 2\\\\left(\\\\frac{\\\\sqrt{3}}{2}\\\\sin x + \\\\frac{1}{2}\\\\cos x\\\\right) = 2\\\\sin\\\\left(x + \\\\frac{\\\\pi}{6}\\\\right)$$",
        "利用辅助角改写：\\n\\n$$\\\\sqrt{3}\\\\sin x + \\\\cos x = 2\\\\left(\\\\frac{\\\\sqrt{3}}{2}\\\\sin x + \\\\frac{1}{2}\\\\cos x\\\\right) = 2\\\\sin\\\\left(x + \\\\frac{\\\\pi}{6}\\\\right)$$",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const v = rng.pick(["x", "\\theta", "t"]);
        const p = k === 1 ? "" : `${k}`;
        const item = rng.pick([
          {
            expr: `${p}\\sqrt{3}\\sin ${v} + ${p}\\cos ${v}`,
            ans: `${2 * k}\\sin\\left(${v} + \\frac{\\pi}{6}\\right)`,
            wrong: [
              `${2 * k}\\sin\\left(${v} + \\frac{\\pi}{3}\\right)`,
              `${2 * k}\\cos\\left(${v} + \\frac{\\pi}{6}\\right)`,
              `${p}\\sqrt{3}\\sin\\left(${v} + \\frac{\\pi}{6}\\right)`,
            ],
          },
          {
            expr: `${p}\\sin ${v} + ${p}\\sqrt{3}\\cos ${v}`,
            ans: `${2 * k}\\sin\\left(${v} + \\frac{\\pi}{3}\\right)`,
            wrong: [
              `${2 * k}\\sin\\left(${v} + \\frac{\\pi}{6}\\right)`,
              `${2 * k}\\cos\\left(${v} + \\frac{\\pi}{3}\\right)`,
              `${p}\\sqrt{3}\\sin\\left(${v} + \\frac{\\pi}{3}\\right)`,
            ],
          },
          {
            expr: `${p}\\sin ${v} + ${p}\\cos ${v}`,
            ans: `${p}\\sqrt{2}\\sin\\left(${v} + \\frac{\\pi}{4}\\right)`,
            wrong: [
              `${2 * k}\\sin\\left(${v} + \\frac{\\pi}{4}\\right)`,
              `${p}\\sqrt{2}\\sin\\left(${v} + \\frac{\\pi}{2}\\right)`,
              `${p}\\cos\\left(${v} + \\frac{\\pi}{4}\\right)`,
            ],
          },
          {
            expr: `${p}\\sqrt{3}\\sin ${v} - ${p}\\cos ${v}`,
            ans: `${2 * k}\\sin\\left(${v} - \\frac{\\pi}{6}\\right)`,
            wrong: [
              `${2 * k}\\sin\\left(${v} + \\frac{\\pi}{6}\\right)`,
              `${2 * k}\\cos\\left(${v} - \\frac{\\pi}{6}\\right)`,
              `${p}\\sqrt{3}\\sin\\left(${v} - \\frac{\\pi}{6}\\right)`,
            ],
          },
          {
            expr: `${p}\\sin ${v} - ${p}\\sqrt{3}\\cos ${v}`,
            ans: `${2 * k}\\sin\\left(${v} - \\frac{\\pi}{3}\\right)`,
            wrong: [
              `${2 * k}\\sin\\left(${v} + \\frac{\\pi}{3}\\right)`,
              `${2 * k}\\cos\\left(${v} - \\frac{\\pi}{3}\\right)`,
              `${p}\\sqrt{3}\\sin\\left(${v} - \\frac{\\pi}{3}\\right)`,
            ],
          },
          {
            expr: `${p}\\sin ${v} - ${p}\\cos ${v}`,
            ans: `${p}\\sqrt{2}\\sin\\left(${v} - \\frac{\\pi}{4}\\right)`,
            wrong: [
              `${2 * k}\\sin\\left(${v} - \\frac{\\pi}{4}\\right)`,
              `${p}\\sqrt{2}\\sin\\left(${v} + \\frac{\\pi}{4}\\right)`,
              `${p}\\cos\\left(${v} - \\frac{\\pi}{4}\\right)`,
            ],
          },
        ]);
        return oneOf(
          rng,
          t(`Write $${item.expr}$ in the form $R\\\\sin(${v} + \\\\phi)$.`, `将 $${item.expr}$ 化为 $R\\\\sin(${v} + \\\\phi)$ 的形式。`),
          t(`$${item.ans}$`, `$${item.ans}$`),
          item.wrong.map((w) => t(`$${w}$`, `$${w}$`)),
          t(
            `Factor out $R = \\sqrt{A^2 + B^2}$ and identify the auxiliary phase angle: the result is $${item.ans}$.`,
            `提出 $R = \\sqrt{A^2 + B^2}$ 并确定初相角：结果为 $${item.ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.12.1 The double-angle formula for sine ────────────────────────────────

/** theDoubleAngleFormulaForSine introduces sin(2θ) = 2 sin(θ) cos(θ). */
export const theDoubleAngleFormulaForSine: TopicDef = {
  id: "the-double-angle-formula-for-sine",
  title: t("The Double-Angle Formula for Sine", "正弦的二倍角公式"),
  summary: t(
    "Use sin(2θ) = 2 sin(θ) cos(θ) to rewrite or evaluate trigonometric expressions.",
    "利用 sin(2θ) = 2 sin(θ) cos(θ) 改写或求值三角表达式。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-sine"],
  encompasses: [{ topic: "the-sum-and-difference-formulas-for-sine", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "double-angle-formula-for-sine-statement",
      title: t("The double-angle formula for sine", "正弦二倍角公式的陈述"),
      explanation: t(
        "Applying the addition formula with both angles equal gives:\\n\\n$$\\sin(2\\theta) = \\sin(\\theta + \\theta) = \\sin\\theta\\cos\\theta + \\cos\\theta\\sin\\theta = 2\\sin\\theta\\cos\\theta$$",
        "将和角公式中两个角取相同值，即得：\\n\\n$$\\sin(2\\theta) = \\sin(\\theta + \\theta) = \\sin\\theta\\cos\\theta + \\cos\\theta\\sin\\theta = 2\\sin\\theta\\cos\\theta$$",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u", "A"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6]);
        const arg = k === 1 ? v : `${k}${v}`;
        const doubleArg = `${2 * k}${v}`;
        const mode = rng.pick(["forward", "reverse", "evaluate"] as const);
        if (mode === "forward") {
          return oneOf(
            rng,
            t(`Which of the following is equal to $\\sin(${doubleArg})$?`, `下列哪个式子恒等于 $\\sin(${doubleArg})$？`),
            t(`$2\\sin(${arg})\\cos(${arg})$`, `$2\\sin(${arg})\\cos(${arg})$`),
            [
              t(`$2\\sin^2(${arg})$`, `$2\\sin^2(${arg})$`),
              t(`$\\sin^2(${arg}) - \\cos^2(${arg})$`, `$\\sin^2(${arg}) - \\cos^2(${arg})$`),
              t(`$2\\cos^2(${arg}) - 1$`, `$2\\cos^2(${arg}) - 1$`),
            ],
            t(
              `By the double-angle formula, $\\sin(2A) = 2\\sin A\\cos A$ with $A = ${arg}$.`,
              `由二倍角公式，当 $A = ${arg}$ 时，$\\sin(2A) = 2\\sin A\\cos A$。`,
            ),
          );
        } else if (mode === "reverse") {
          return oneOf(
            rng,
            t(`Rewrite $2\\sin(${arg})\\cos(${arg})$ using a double-angle formula.`, `将 $2\\sin(${arg})\\cos(${arg})$ 用二倍角公式改写。`),
            t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
            [
              t(`$\\cos(${doubleArg})$`, `$\\cos(${doubleArg})$`),
              t(`$\\tan(${doubleArg})$`, `$\\tan(${doubleArg})$`),
              t(`$2\\sin(${doubleArg})$`, `$2\\sin(${doubleArg})$`),
            ],
            t(
              `Since $2\\sin A\\cos A = \\sin(2A)$, the expression equals $\\sin(${doubleArg})$.`,
              `因为 $2\\sin A\\cos A = \\sin(2A)$，所以原式等于 $\\sin(${doubleArg})$。`,
            ),
          );
        } else {
          return oneOf(
            rng,
            t(`Simplify $\\frac{\\sin(${doubleArg})}{2\\cos(${arg})}$.`, `化简 $\\frac{\\sin(${doubleArg})}{2\\cos(${arg})}$。`),
            t(`$\\sin(${arg})$`, `$\\sin(${arg})$`),
            [
              t(`$\\cos(${arg})$`, `$\\cos(${arg})$`),
              t(`$\\tan(${arg})$`, `$\\tan(${arg})$`),
              t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
            ],
            t(
              `Substitute $\\sin(${doubleArg}) = 2\\sin(${arg})\\cos(${arg})$ and simplify: $\\sin(${arg})$.`,
              `代入 $\\sin(${doubleArg}) = 2\\sin(${arg})\\cos(${arg})$ 约分得：$\\sin(${arg})$。`,
            ),
          );
        }
      },
    },
    {
      id: "evaluating-sin-double-angle",
      title: t("Evaluating sin(2θ) from given values", "由已知值求 sin(2θ)"),
      explanation: t(
        "If $\\sin\\theta = \\frac{3}{5}$ and $\\theta$ is in the first quadrant, then $\\cos\\theta = \\frac{4}{5}$ (from the Pythagorean identity) and:\\n\\n$$\\sin(2\\theta) = 2\\cdot\\frac{3}{5}\\cdot\\frac{4}{5} = \\frac{24}{25}$$",
        "若 $\\sin\\theta = \\frac{3}{5}$ 且 $\\theta$ 在第一象限，则由勾股恒等式得 $\\cos\\theta = \\frac{4}{5}$，从而：\\n\\n$$\\sin(2\\theta) = 2\\cdot\\frac{3}{5}\\cdot\\frac{4}{5} = \\frac{24}{25}$$",
      ),
      generate(rng) {
        const [a, b, c] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
          [15, 8, 17],
          [7, 24, 25],
          [24, 7, 25],
        ] as const);
        const quad = rng.pick([
          { num: "first", numZh: "第一", sinSign: 1, cosSign: 1 },
          { num: "second", numZh: "第二", sinSign: 1, cosSign: -1 },
          { num: "third", numZh: "第三", sinSign: -1, cosSign: -1 },
          { num: "fourth", numZh: "第四", sinSign: -1, cosSign: 1 },
        ]);
        const v = rng.pick(["\\theta", "x", "\\alpha"]);
        const sinVal = Q.of(quad.sinSign * a, c);
        const cosVal = Q.of(quad.cosSign * b, c);
        const ans = sinVal.mul(cosVal).mul(Q.of(2));
        const w1 = Q.of(-ans.n, ans.d);
        const w2 = sinVal.mul(sinVal).mul(Q.of(2));
        const w3 = Q.of(a * b, c * c);
        return numberProblem({
          prompt: t(
            `If $\\sin ${v} = ${sinVal.toLatex()}$ and $${v}$ is in the ${quad.num} quadrant, find $\\sin(2${v})$.`,
            `若 $\\sin ${v} = ${sinVal.toLatex()}$ 且 $${v}$ 在${quad.numZh}象限，求 $\\sin(2${v})$。`,
          ),
          answer: ans,
          wrong: [w1, w2, w3],
          solution: t(
            `In the ${quad.num} quadrant, $\\cos ${v} = ${cosVal.toLatex()}$. Then $\\sin(2${v}) = 2\\cdot(${sinVal.toLatex()})\\cdot(${cosVal.toLatex()}) = ${ans.toLatex()}$.`,
            `在${quad.numZh}象限中，$\\cos ${v} = ${cosVal.toLatex()}$。则 $\\sin(2${v}) = 2\\cdot(${sinVal.toLatex()})\\cdot(${cosVal.toLatex()}) = ${ans.toLatex()}$。`,
          ),
          form: "fraction",
        });
      },
    },
    {
      id: "rewriting-products-as-sin-double-angle",
      title: t("Rewriting products using the double-angle formula", "用二倍角公式改写乘积"),
      explanation: t(
        "The product $6\\sin x\\cos x$ can be rewritten as $3\\cdot(2\\sin x\\cos x) = 3\\sin(2x)$.",
        "乘积 $6\\sin x\\cos x$ 可改写为 $3\\cdot(2\\sin x\\cos x) = 3\\sin(2x)$。",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const m = rng.pick([1, 2, 3, 4, 5]);
        const v = rng.pick(["x", "\\theta", "t", "\\alpha", "u"]);
        const coeff = 2 * k;
        const arg = m === 1 ? v : `${m}${v}`;
        const doubleArg = `${2 * m}${v}`;
        return oneOf(
          rng,
          t(
            `Rewrite $${coeff}\\sin(${arg})\\cos(${arg})$ using a double-angle formula.`,
            `用二倍角公式改写 $${coeff}\\sin(${arg})\\cos(${arg})$。`,
          ),
          t(
            k === 1 ? `$\\sin(${doubleArg})$` : `$${k}\\sin(${doubleArg})$`,
            k === 1 ? `$\\sin(${doubleArg})$` : `$${k}\\sin(${doubleArg})$`,
          ),
          [
            t(k === 1 ? `$\\sin^2(${arg})$` : `$${k}\\sin^2(${arg})$`, k === 1 ? `$\\sin^2(${arg})$` : `$${k}\\sin^2(${arg})$`),
            t(
              k === 1 ? `$\\cos(${doubleArg})$` : `$${k}\\cos(${doubleArg})$`,
              k === 1 ? `$\\cos(${doubleArg})$` : `$${k}\\cos(${doubleArg})$`,
            ),
            t(`$${coeff}\\sin(${doubleArg})$`, `$${coeff}\\sin(${doubleArg})$`),
          ],
          t(
            `Factor: $${coeff}\\sin(${arg})\\cos(${arg}) = ${k}\\cdot(2\\sin(${arg})\\cos(${arg})) = ${k === 1 ? "" : k}\\sin(${doubleArg})$.`,
            `提取因子：$${coeff}\\sin(${arg})\\cos(${arg}) = ${k}\\cdot(2\\sin(${arg})\\cos(${arg})) = ${k === 1 ? "" : k}\\sin(${doubleArg})$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.12.2 Verifying identities using sin double-angle ──────────────────────

/** verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulaForSine covers identity verification. */
export const verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulaForSine: TopicDef = {
  id: "verifying-trigonometric-identities-using-the-double-angle-formula-for-sine",
  title: t("Verifying Trigonometric Identities Using the Double-Angle Formula for Sine", "利用正弦二倍角公式验证三角恒等式"),
  summary: t(
    "Prove identities by substituting sin(2θ) = 2 sin(θ) cos(θ) and simplifying.",
    "通过代入 sin(2θ) = 2 sin(θ) cos(θ) 并化简来证明三角恒等式。",
  ),
  prerequisites: ["the-double-angle-formula-for-sine"],
  encompasses: [
    { topic: "the-double-angle-formula-for-sine", weight: 0.5 },
    { topic: "simplifying-expressions-using-basic-trigonometric-identities", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "verifying-double-angle-sine-identities",
      title: t("Verifying identities with sin(2θ)", "利用 sin(2θ) 验证恒等式"),
      explanation: t(
        "To verify $\\frac{\\sin(2\\theta)}{\\sin\\theta} = 2\\cos\\theta$, substitute and simplify the left side:\\n\\n$$\\frac{\\sin(2\\theta)}{\\sin\\theta} = \\frac{2\\sin\\theta\\cos\\theta}{\\sin\\theta} = 2\\cos\\theta \\checkmark$$",
        "为验证 $\\frac{\\sin(2\\theta)}{\\sin\\theta} = 2\\cos\\theta$，代入并化简左边：\\n\\n$$\\frac{\\sin(2\\theta)}{\\sin\\theta} = \\frac{2\\sin\\theta\\cos\\theta}{\\sin\\theta} = 2\\cos\\theta \\checkmark$$",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const arg = k === 1 ? v : `${k}${v}`;
        const doubleArg = `${2 * k}${v}`;
        const identities = [
          {
            prompt: t(
              `Which expression is equal to $\\dfrac{\\sin(${doubleArg})}{\\sin(${arg})}$?`,
              `哪个表达式等于 $\\dfrac{\\sin(${doubleArg})}{\\sin(${arg})}$？`,
            ),
            ans: t(`$2\\cos(${arg})$`, `$2\\cos(${arg})$`),
            wrong: [
              t(`$2\\sin(${arg})$`, `$2\\sin(${arg})$`),
              t(`$\\cos(${doubleArg})$`, `$\\cos(${doubleArg})$`),
              t(`$\\tan(${doubleArg})$`, `$\\tan(${doubleArg})$`),
            ],
            sol: t(
              `Substitute $\\sin(${doubleArg}) = 2\\sin(${arg})\\cos(${arg})$: result is $2\\cos(${arg})$.`,
              `代入 $\\sin(${doubleArg}) = 2\\sin(${arg})\\cos(${arg})$：结果为 $2\\cos(${arg})$。`,
            ),
          },
          {
            prompt: t(
              `Which expression equals $\\dfrac{\\sin(${doubleArg})}{2\\cos(${arg})}$?`,
              `哪个表达式等于 $\\dfrac{\\sin(${doubleArg})}{2\\cos(${arg})}$？`,
            ),
            ans: t(`$\\sin(${arg})$`, `$\\sin(${arg})$`),
            wrong: [
              t(`$\\cos(${arg})$`, `$\\cos(${arg})$`),
              t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
              t(`$\\tan(${arg})$`, `$\\tan(${arg})$`),
            ],
            sol: t(
              `Substitute $\\sin(${doubleArg}) = 2\\sin(${arg})\\cos(${arg})$: result is $\\sin(${arg})$.`,
              `代入 $\\sin(${doubleArg}) = 2\\sin(${arg})\\cos(${arg})$：结果为 $\\sin(${arg})$。`,
            ),
          },
          {
            prompt: t(`Which expression equals $\\sin(${doubleArg})\\tan(${arg})$?`, `哪个表达式等于 $\\sin(${doubleArg})\\tan(${arg})$？`),
            ans: t(`$2\\sin^2(${arg})$`, `$2\\sin^2(${arg})$`),
            wrong: [
              t(`$2\\cos^2(${arg})$`, `$2\\cos^2(${arg})$`),
              t(`$\\sin(4${arg})$`, `$\\sin(4${arg})$`),
              t(`$\\tan(${doubleArg})$`, `$\\tan(${doubleArg})$`),
            ],
            sol: t(
              `$\\sin(${doubleArg})\\tan(${arg}) = 2\\sin(${arg})\\cos(${arg})\\cdot\\frac{\\sin(${arg})}{\\cos(${arg})} = 2\\sin^2(${arg})$.`,
              `$\\sin(${doubleArg})\\tan(${arg}) = 2\\sin(${arg})\\cos(${arg})\\cdot\\frac{\\sin(${arg})}{\\cos(${arg})} = 2\\sin^2(${arg})$。`,
            ),
          },
          {
            prompt: t(`Simplify $\\dfrac{\\sin(${doubleArg})}{2}$.`, `化简 $\\dfrac{\\sin(${doubleArg})}{2}$。`),
            ans: t(`$\\sin(${arg})\\cos(${arg})$`, `$\\sin(${arg})\\cos(${arg})$`),
            wrong: [
              t(`$\\sin^2(${arg})$`, `$\\sin^2(${arg})$`),
              t(`$\\cos^2(${arg})$`, `$\\cos^2(${arg})$`),
              t(`$\\sin(${arg})$`, `$\\sin(${arg})$`),
            ],
            sol: t(
              `$\\frac{\\sin(${doubleArg})}{2} = \\frac{2\\sin(${arg})\\cos(${arg})}{2} = \\sin(${arg})\\cos(${arg})$.`,
              `$\\frac{\\sin(${doubleArg})}{2} = \\frac{2\\sin(${arg})\\cos(${arg})}{2} = \\sin(${arg})\\cos(${arg})$。`,
            ),
          },
        ];
        const item = rng.pick(identities);
        return oneOf(rng, item.prompt, item.ans, item.wrong, item.sol);
      },
    },
  ],
};

// ─── 4.12.3 Using sin double-angle with Pythagorean theorem ──────────────────

/** usingTheDoubleAngleFormulaForSineWithThePythagoreanTheorem combines double-angle and Pythagorean identities. */
export const usingTheDoubleAngleFormulaForSineWithThePythagoreanTheorem: TopicDef = {
  id: "using-the-double-angle-formula-for-sine-with-the-pythagorean-theorem",
  title: t("Using the Double-Angle Formula for Sine With the Pythagorean Theorem", "结合勾股定理使用正弦二倍角公式"),
  summary: t(
    "Compute sin(2θ) from sin(θ) or cos(θ) alone using the Pythagorean identity to find the missing ratio.",
    "仅用 sin(θ) 或 cos(θ) 的值，借助勾股恒等式求得另一个比值，从而计算 sin(2θ)。",
  ),
  prerequisites: ["the-double-angle-formula-for-sine"],
  encompasses: [
    { topic: "the-double-angle-formula-for-sine", weight: 0.5 },
    { topic: "simplifying-expressions-using-the-pythagorean-identity", weight: 0.4 },
  ],
  xp: 20,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "sin-double-angle-from-cos-only",
      title: t("Finding sin(2θ) from cos(θ) in a given quadrant", "由 cos(θ) 在给定象限求 sin(2θ)"),
      explanation: t(
        "If $\\cos\\theta = -\\frac{4}{5}$ and $\\theta$ is in quadrant II, then $\\sin\\theta = \\frac{3}{5}$ (positive in QII) and:\\n\\n$$\\sin(2\\theta) = 2\\cdot\\frac{3}{5}\\cdot\\left(-\\frac{4}{5}\\right) = -\\frac{24}{25}$$",
        "若 $\\cos\\theta = -\\frac{4}{5}$ 且 $\\theta$ 在第二象限，则 $\\sin\\theta = \\frac{3}{5}$（第二象限正弦为正），从而：\\n\\n$$\\sin(2\\theta) = 2\\cdot\\frac{3}{5}\\cdot\\left(-\\frac{4}{5}\\right) = -\\frac{24}{25}$$",
      ),
      generate(rng) {
        const [a, b, c] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
          [15, 8, 17],
          [7, 24, 25],
          [24, 7, 25],
        ] as const);
        const v = rng.pick(["\\theta", "x", "\\alpha"]);
        const quadrant = rng.pick([
          { sinSign: 1, cosSign: 1, quad: "I", quadZh: "一", sinTex: `\\frac{${a}}{${c}}`, cosTex: `\\frac{${b}}{${c}}` },
          { sinSign: 1, cosSign: -1, quad: "II", quadZh: "二", sinTex: `\\frac{${a}}{${c}}`, cosTex: `-\\frac{${b}}{${c}}` },
          { sinSign: -1, cosSign: -1, quad: "III", quadZh: "三", sinTex: `-\\frac{${a}}{${c}}`, cosTex: `-\\frac{${b}}{${c}}` },
          { sinSign: -1, cosSign: 1, quad: "IV", quadZh: "四", sinTex: `-\\frac{${a}}{${c}}`, cosTex: `\\frac{${b}}{${c}}` },
        ] as const);
        const sinVal = quadrant.sinSign * a;
        const cosVal = quadrant.cosSign * b;
        const num = 2 * sinVal * cosVal;
        const den = c * c;
        const g = Math.abs(gcd(num, den));
        const ansNum = num / g;
        const ansDen = den / g;
        const ansFrac = ansDen === 1 ? `${ansNum}` : `\\frac{${ansNum}}{${ansDen}}`;
        return numberProblem({
          prompt: t(
            `If $\\cos ${v} = ${quadrant.cosTex}$ and $${v}$ is in quadrant ${quadrant.quad}, find $\\sin(2${v})$.`,
            `若 $\\cos ${v} = ${quadrant.cosTex}$ 且 $${v}$ 在第${quadrant.quadZh}象限，求 $\\sin(2${v})$。`,
          ),
          answer: Q.of(num, den),
          wrong: [Q.of(-num, den), Q.of(Math.abs(num), den), Q.of(2 * a * b, c * c)],
          solution: t(
            `In quadrant ${quadrant.quad}, $\\sin ${v} = ${quadrant.sinTex}$. So $\\sin(2${v}) = 2\\cdot${quadrant.sinTex}\\cdot(${quadrant.cosTex}) = ${ansFrac}$.`,
            `在第${quadrant.quadZh}象限，$\\sin ${v} = ${quadrant.sinTex}$。故 $\\sin(2${v}) = 2\\cdot${quadrant.sinTex}\\cdot(${quadrant.cosTex}) = ${ansFrac}$。`,
          ),
          form: "fraction",
        });
      },
    },
  ],
};

// ─── 4.12.4 The double-angle formula for cosine ──────────────────────────────

/** theDoubleAngleFormulaForCosine covers the three forms of cos(2θ). */
export const theDoubleAngleFormulaForCosine: TopicDef = {
  id: "the-double-angle-formula-for-cosine",
  title: t("The Double-Angle Formula for Cosine", "余弦的二倍角公式"),
  summary: t(
    "Know and apply the three equivalent forms of cos(2θ): cos²θ − sin²θ, 2cos²θ − 1, and 1 − 2sin²θ.",
    "掌握并应用 cos(2θ) 的三种等价形式：cos²θ − sin²θ、2cos²θ − 1 和 1 − 2sin²θ。",
  ),
  prerequisites: ["the-sum-and-difference-formulas-for-cosine", "alternate-forms-of-the-pythagorean-identity"],
  encompasses: [
    { topic: "the-sum-and-difference-formulas-for-cosine", weight: 0.4 },
    { topic: "alternate-forms-of-the-pythagorean-identity", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "three-forms-of-cos-double-angle",
      title: t("The three forms of the cosine double-angle formula", "余弦二倍角公式的三种形式"),
      explanation: t(
        "From $\\cos(\\alpha+\\beta) = \\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta$ with $\\alpha=\\beta=\\theta$:\\n\\n$$\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta$$\\n\\nThe last two forms use $\\sin^2\\theta + \\cos^2\\theta = 1$.",
        "由余弦和角公式令 $\\alpha=\\beta=\\theta$，得：\\n\\n$$\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta = 2\\cos^2\\theta - 1 = 1 - 2\\sin^2\\theta$$\\n\\n后两种形式利用了 $\\sin^2\\theta + \\cos^2\\theta = 1$。",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const arg = k === 1 ? v : `${k}${v}`;
        const doubleArg = `${2 * k}${v}`;
        const items = [
          {
            prompt: t(`Which expression is NOT equal to $\\cos(${doubleArg})$?`, `哪个表达式不等于 $\\cos(${doubleArg})$？`),
            ans: t(`$\\sin^2(${arg}) - \\cos^2(${arg})$`, `$\\sin^2(${arg}) - \\cos^2(${arg})$`),
            wrong: [
              t(`$\\cos^2(${arg}) - \\sin^2(${arg})$`, `$\\cos^2(${arg}) - \\sin^2(${arg})$`),
              t(`$2\\cos^2(${arg}) - 1$`, `$2\\cos^2(${arg}) - 1$`),
              t(`$1 - 2\\sin^2(${arg})$`, `$1 - 2\\sin^2(${arg})$`),
            ],
            sol: t(
              `The three valid forms are $\\cos^2(${arg}) - \\sin^2(${arg})$, $2\\cos^2(${arg}) - 1$, and $1 - 2\\sin^2(${arg})$. Note: $\\sin^2 - \\cos^2$ has opposite sign.`,
              `三种有效形式为 $\\cos^2(${arg}) - \\sin^2(${arg})$、$2\\cos^2(${arg}) - 1$ 和 $1 - 2\\sin^2(${arg})$。注意符号：$\\sin^2 - \\cos^2$ 与之相反。`,
            ),
          },
          {
            prompt: t(
              `Which form of $\\cos(${doubleArg})$ contains only $\\cos(${arg})$?`,
              `$\\cos(${doubleArg})$ 的哪种形式只含 $\\cos(${arg})$？`,
            ),
            ans: t(`$2\\cos^2(${arg}) - 1$`, `$2\\cos^2(${arg}) - 1$`),
            wrong: [
              t(`$\\cos^2(${arg}) - \\sin^2(${arg})$`, `$\\cos^2(${arg}) - \\sin^2(${arg})$`),
              t(`$1 - 2\\sin^2(${arg})$`, `$1 - 2\\sin^2(${arg})$`),
              t(`$2\\cos(${arg})$`, `$2\\cos(${arg})$`),
            ],
            sol: t(
              `Replacing $\\sin^2(${arg}) = 1 - \\cos^2(${arg})$ gives $2\\cos^2(${arg}) - 1$.`,
              `将 $\\sin^2(${arg}) = 1 - \\cos^2(${arg})$ 代入得 $2\\cos^2(${arg}) - 1$。`,
            ),
          },
          {
            prompt: t(
              `Which form of $\\cos(${doubleArg})$ contains only $\\sin(${arg})$?`,
              `$\\cos(${doubleArg})$ 的哪种形式只含 $\\sin(${arg})$？`,
            ),
            ans: t(`$1 - 2\\sin^2(${arg})$`, `$1 - 2\\sin^2(${arg})$`),
            wrong: [
              t(`$\\cos^2(${arg}) - \\sin^2(${arg})$`, `$\\cos^2(${arg}) - \\sin^2(${arg})$`),
              t(`$2\\cos^2(${arg}) - 1$`, `$2\\cos^2(${arg}) - 1$`),
              t(`$2\\sin(${arg})$`, `$2\\sin(${arg})$`),
            ],
            sol: t(
              `Replacing $\\cos^2(${arg}) = 1 - \\sin^2(${arg})$ gives $1 - 2\\sin^2(${arg})$.`,
              `将 $\\cos^2(${arg}) = 1 - \\sin^2(${arg})$ 代入得 $1 - 2\\sin^2(${arg})$。`,
            ),
          },
        ];
        const item = rng.pick(items);
        return oneOf(rng, item.prompt, item.ans, item.wrong, item.sol);
      },
    },
    {
      id: "evaluating-cos-double-angle",
      title: t("Evaluating cos(2θ) from a given value", "由已知值求 cos(2θ)"),
      explanation: t(
        "If $\\sin\\theta = \\frac{5}{13}$, use the form $1 - 2\\sin^2\\theta$ (only sine needed):\\n\\n$$\\cos(2\\theta) = 1 - 2\\left(\\frac{5}{13}\\right)^2 = 1 - \\frac{50}{169} = \\frac{119}{169}$$",
        "若 $\\sin\\theta = \\frac{5}{13}$，使用只含正弦的形式 $1 - 2\\sin^2\\theta$：\\n\\n$$\\cos(2\\theta) = 1 - 2\\left(\\frac{5}{13}\\right)^2 = 1 - \\frac{50}{169} = \\frac{119}{169}$$",
      ),
      generate(rng) {
        const [a, b, c] = rng.pick([
          [3, 4, 5],
          [4, 3, 5],
          [5, 12, 13],
          [12, 5, 13],
          [8, 15, 17],
          [15, 8, 17],
          [7, 24, 25],
          [24, 7, 25],
        ] as const);
        const v = rng.pick(["\\theta", "x", "\\alpha"]);
        const sign = rng.pick([1, -1]);
        const useSin = rng.pick([true, false]);
        const sinSq = Q.of(a * a, c * c);
        const cosSq = Q.of(b * b, c * c);
        const ans = cosSq.sub(sinSq);
        const wrong1 = sinSq.sub(cosSq);
        const wrong2 = sinSq.mul(Q.of(2)).sub(Q.of(1));
        const wrong3 = Q.of(a * b * 2, c * c);
        if (useSin) {
          const val = Q.of(sign * a, c);
          return numberProblem({
            prompt: t(
              `If $\\sin ${v} = ${val.toLatex()}$, find $\\cos(2${v})$.`,
              `若 $\\sin ${v} = ${val.toLatex()}$，求 $\\cos(2${v})$。`,
            ),
            answer: ans,
            wrong: [wrong1, wrong2, wrong3],
            solution: t(
              `Use $\\cos(2${v}) = 1 - 2\\sin^2 ${v} = 1 - 2\\left(${val.toLatex()}\\right)^2 = ${ans.toLatex()}$.`,
              `使用 $\\cos(2${v}) = 1 - 2\\sin^2 ${v} = 1 - 2\\left(${val.toLatex()}\\right)^2 = ${ans.toLatex()}$。`,
            ),
            form: "fraction",
          });
        } else {
          const val = Q.of(sign * b, c);
          return numberProblem({
            prompt: t(
              `If $\\cos ${v} = ${val.toLatex()}$, find $\\cos(2${v})$.`,
              `若 $\\cos ${v} = ${val.toLatex()}$，求 $\\cos(2${v})$。`,
            ),
            answer: ans,
            wrong: [wrong1, wrong2, wrong3],
            solution: t(
              `Use $\\cos(2${v}) = 2\\cos^2 ${v} - 1 = 2\\left(${val.toLatex()}\\right)^2 - 1 = ${ans.toLatex()}$.`,
              `使用 $\\cos(2${v}) = 2\\cos^2 ${v} - 1 = 2\\left(${val.toLatex()}\\right)^2 - 1 = ${ans.toLatex()}$。`,
            ),
            form: "fraction",
          });
        }
      },
    },
  ],
};

// ─── 4.12.5 Verifying identities using cos double-angle ──────────────────────

/** verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulasForCosine covers identity verification with cos(2θ). */
export const verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulasForCosine: TopicDef = {
  id: "verifying-trigonometric-identities-using-the-double-angle-formulas-for-cosine",
  title: t("Verifying Trigonometric Identities Using the Double-Angle Formulas for Cosine", "利用余弦二倍角公式验证三角恒等式"),
  summary: t(
    "Prove identities by choosing the most useful form of cos(2θ) and simplifying.",
    "选择 cos(2θ) 最适用的形式并化简来证明三角恒等式。",
  ),
  prerequisites: ["the-double-angle-formula-for-cosine"],
  encompasses: [{ topic: "the-double-angle-formula-for-cosine", weight: 0.6 }],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "choosing-form-for-cos-identity",
      title: t("Choosing the right form of cos(2θ) for verification", "选择合适的 cos(2θ) 形式来验证恒等式"),
      explanation: t(
        "To show $1 + \\cos(2\\theta) = 2\\cos^2\\theta$, substitute $\\cos(2\\theta) = 2\\cos^2\\theta - 1$:\\n\\n$$1 + (2\\cos^2\\theta - 1) = 2\\cos^2\\theta \\checkmark$$",
        "为证明 $1 + \\cos(2\\theta) = 2\\cos^2\\theta$，代入 $\\cos(2\\theta) = 2\\cos^2\\theta - 1$：\\n\\n$$1 + (2\\cos^2\\theta - 1) = 2\\cos^2\\theta \\checkmark$$",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const arg = k === 1 ? v : `${k}${v}`;
        const doubleArg = `${2 * k}${v}`;
        const items = [
          {
            prompt: t(`Which is equal to $1 + \\cos(${doubleArg})$?`, `哪个表达式等于 $1 + \\cos(${doubleArg})$？`),
            ans: t(`$2\\cos^2(${arg})$`, `$2\\cos^2(${arg})$`),
            wrong: [
              t(`$2\\sin^2(${arg})$`, `$2\\sin^2(${arg})$`),
              t(`$\\cos^2(${arg})$`, `$\\cos^2(${arg})$`),
              t(`$2\\cos(${doubleArg})$`, `$2\\cos(${doubleArg})$`),
            ],
            sol: t(
              `Substitute $\\cos(${doubleArg}) = 2\\cos^2(${arg}) - 1$: result is $2\\cos^2(${arg})$.`,
              `代入 $\\cos(${doubleArg}) = 2\\cos^2(${arg}) - 1$：结果为 $2\\cos^2(${arg})$。`,
            ),
          },
          {
            prompt: t(`Which is equal to $1 - \\cos(${doubleArg})$?`, `哪个表达式等于 $1 - \\cos(${doubleArg})$？`),
            ans: t(`$2\\sin^2(${arg})$`, `$2\\sin^2(${arg})$`),
            wrong: [
              t(`$2\\cos^2(${arg})$`, `$2\\cos^2(${arg})$`),
              t(`$\\sin^2(${arg})$`, `$\\sin^2(${arg})$`),
              t(`$-2\\sin^2(${arg})$`, `$-2\\sin^2(${arg})$`),
            ],
            sol: t(
              `Substitute $\\cos(${doubleArg}) = 1 - 2\\sin^2(${arg})$: result is $2\\sin^2(${arg})$.`,
              `代入 $\\cos(${doubleArg}) = 1 - 2\\sin^2(${arg})$：结果为 $2\\sin^2(${arg})$。`,
            ),
          },
          {
            prompt: t(`Simplify $\\cos^2(${arg}) - \\sin^2(${arg})$.`, `化简 $\\cos^2(${arg}) - \\sin^2(${arg})$。`),
            ans: t(`$\\cos(${doubleArg})$`, `$\\cos(${doubleArg})$`),
            wrong: [
              t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
              t(`$\\cos^2(${doubleArg})$`, `$\\cos^2(${doubleArg})$`),
              t(`$1$`, `$1$`),
            ],
            sol: t(
              `By the double-angle formula, $\\cos^2(${arg}) - \\sin^2(${arg}) = \\cos(${doubleArg})$.`,
              `由二倍角公式，$\\cos^2(${arg}) - \\sin^2(${arg}) = \\cos(${doubleArg})$。`,
            ),
          },
          {
            prompt: t(`Simplify $2\\cos^2(${arg}) - 1$.`, `化简 $2\\cos^2(${arg}) - 1$。`),
            ans: t(`$\\cos(${doubleArg})$`, `$\\cos(${doubleArg})$`),
            wrong: [
              t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
              t(`$1 - 2\\sin^2(${arg})$`, `$1 - 2\\sin^2(${arg})$`),
              t(`$2\\cos(${doubleArg}) - 1$`, `$2\\cos(${doubleArg}) - 1$`),
            ],
            sol: t(
              `$2\\cos^2(${arg}) - 1 = \\cos(${doubleArg})$ is one form of the double-angle formula.`,
              `$2\\cos^2(${arg}) - 1 = \\cos(${doubleArg})$ 是二倍角公式的一种形式。`,
            ),
          },
        ];
        const item = rng.pick(items);
        return oneOf(rng, item.prompt, item.ans, item.wrong, item.sol);
      },
    },
  ],
};

// ─── 4.12.6 Exact values using cos double-angle ──────────────────────────────

/** findingExactValuesOfTrigonometricExpressionsUsingTheDoubleAngleFormulasForCosine. */
export const findingExactValuesOfTrigonometricExpressionsUsingTheDoubleAngleFormulasForCosine: TopicDef = {
  id: "finding-exact-values-of-trigonometric-expressions-using-the-double-angle-formulas-for-cosine",
  title: t(
    "Finding Exact Values of Trigonometric Expressions Using the Double-Angle Formulas for Cosine",
    "用余弦二倍角公式求三角表达式的精确值",
  ),
  summary: t(
    "Compute exact values like cos(π/8) and cos(5π/12) by applying the cosine double-angle formula in reverse.",
    "通过逆用余弦二倍角公式求 cos(π/8)、cos(5π/12) 等精确值。",
  ),
  prerequisites: ["the-double-angle-formula-for-cosine", "calculating-trigonometric-ratios-using-the-sum-formula-for-cosine"],
  encompasses: [
    { topic: "the-double-angle-formula-for-cosine", weight: 0.5 },
    { topic: "calculating-trigonometric-ratios-using-the-sum-formula-for-cosine", weight: 0.3 },
  ],
  xp: 20,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "evaluating-cos-2theta-at-special-angles",
      title: t("Evaluating cos(2θ) at special angles", "在特殊角处求 cos(2θ)"),
      explanation: t(
        "Use a known double angle:\\n\\n$$\\cos\\left(\\frac{\\pi}{3}\\right) = \\cos\\left(2\\cdot\\frac{\\pi}{6}\\right) = 2\\cos^2\\frac{\\pi}{6} - 1 = 2\\cdot\\frac{3}{4} - 1 = \\frac{1}{2} \\checkmark$$",
        "利用已知的二倍角：\\n\\n$$\\cos\\left(\\frac{\\pi}{3}\\right) = \\cos\\left(2\\cdot\\frac{\\pi}{6}\\right) = 2\\cos^2\\frac{\\pi}{6} - 1 = 2\\cdot\\frac{3}{4} - 1 = \\frac{1}{2} \\checkmark$$",
      ),
      generate(rng) {
        const items = [
          {
            expr: "\\cos\\left(\\frac{\\pi}{3}\\right)",
            half: "\\frac{\\pi}{6}",
            ans: "\\frac{1}{2}",
            wrong: ["\\frac{\\sqrt{3}}{2}", "\\frac{\\sqrt{2}}{2}", "-\\frac{1}{2}"],
            sol: "$\\cos(\\pi/3) = 2\\cos^2(\\pi/6) - 1 = 2\\cdot\\frac{3}{4} - 1 = \\frac{1}{2}$",
          },
          {
            expr: "\\cos\\left(\\frac{2\\pi}{3}\\right)",
            half: "\\frac{\\pi}{3}",
            ans: "-\\frac{1}{2}",
            wrong: ["\\frac{1}{2}", "\\frac{\\sqrt{3}}{2}", "-\\frac{\\sqrt{3}}{2}"],
            sol: "$\\cos(2\\pi/3) = 2\\cos^2(\\pi/3) - 1 = 2\\cdot\\frac{1}{4} - 1 = -\\frac{1}{2}$",
          },
          {
            expr: "\\cos\\left(\\frac{\\pi}{2}\\right)",
            half: "\\frac{\\pi}{4}",
            ans: "0",
            wrong: ["1", "\\frac{\\sqrt{2}}{2}", "\\frac{1}{2}"],
            sol: "$\\cos(\\pi/2) = 2\\cos^2(\\pi/4) - 1 = 2\\cdot\\frac{1}{2} - 1 = 0$",
          },
          {
            expr: "\\cos(\\pi)",
            half: "\\frac{\\pi}{2}",
            ans: "-1",
            wrong: ["0", "1", "-\\frac{1}{2}"],
            sol: "$\\cos(\\pi) = 2\\cos^2(\\pi/2) - 1 = 2\\cdot 0 - 1 = -1$",
          },
          {
            expr: "\\cos(60^\\circ)",
            half: "30^\\circ",
            ans: "\\frac{1}{2}",
            wrong: ["\\frac{\\sqrt{3}}{2}", "\\frac{\\sqrt{2}}{2}", "1"],
            sol: "$\\cos(60^\\circ) = 2\\cos^2(30^\\circ) - 1 = 2\\cdot\\frac{3}{4} - 1 = \\frac{1}{2}$",
          },
          {
            expr: "\\cos(90^\\circ)",
            half: "45^\\circ",
            ans: "0",
            wrong: ["1", "\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}"],
            sol: "$\\cos(90^\\circ) = 2\\cos^2(45^\\circ) - 1 = 2\\cdot\\frac{1}{2} - 1 = 0$",
          },
          {
            expr: "\\cos(120^\\circ)",
            half: "60^\\circ",
            ans: "-\\frac{1}{2}",
            wrong: ["\\frac{1}{2}", "-\\frac{\\sqrt{3}}{2}", "0"],
            sol: "$\\cos(120^\\circ) = 2\\cos^2(60^\\circ) - 1 = 2\\cdot\\frac{1}{4} - 1 = -\\frac{1}{2}$",
          },
          {
            expr: "\\cos(180^\\circ)",
            half: "90^\\circ",
            ans: "-1",
            wrong: ["0", "1", "-\\frac{1}{2}"],
            sol: "$\\cos(180^\\circ) = 2\\cos^2(90^\\circ) - 1 = -1$",
          },
          {
            expr: "2\\cos^2(15^\\circ) - 1",
            half: "15^\\circ",
            ans: "\\frac{\\sqrt{3}}{2}",
            wrong: ["\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}", "1"],
            sol: "$2\\cos^2(15^\\circ) - 1 = \\cos(30^\\circ) = \\frac{\\sqrt{3}}{2}$",
          },
          {
            expr: "1 - 2\\sin^2(15^\\circ)",
            half: "15^\\circ",
            ans: "\\frac{\\sqrt{3}}{2}",
            wrong: ["\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}", "-\\frac{\\sqrt{3}}{2}"],
            sol: "$1 - 2\\sin^2(15^\\circ) = \\cos(30^\\circ) = \\frac{\\sqrt{3}}{2}$",
          },
          {
            expr: "2\\cos^2(22.5^\\circ) - 1",
            half: "22.5^\\circ",
            ans: "\\frac{\\sqrt{2}}{2}",
            wrong: ["\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}", "1"],
            sol: "$2\\cos^2(22.5^\\circ) - 1 = \\cos(45^\\circ) = \\frac{\\sqrt{2}}{2}$",
          },
          {
            expr: "1 - 2\\sin^2(22.5^\\circ)",
            half: "22.5^\\circ",
            ans: "\\frac{\\sqrt{2}}{2}",
            wrong: ["\\frac{\\sqrt{3}}{2}", "\\frac{1}{2}", "-\\frac{\\sqrt{2}}{2}"],
            sol: "$1 - 2\\sin^2(22.5^\\circ) = \\cos(45^\\circ) = \\frac{\\sqrt{2}}{2}$",
          },
          {
            expr: "2\\cos^2(75^\\circ) - 1",
            half: "75^\\circ",
            ans: "-\\frac{\\sqrt{3}}{2}",
            wrong: ["\\frac{\\sqrt{3}}{2}", "-\\frac{1}{2}", "\\frac{1}{2}"],
            sol: "$2\\cos^2(75^\\circ) - 1 = \\cos(150^\\circ) = -\\frac{\\sqrt{3}}{2}$",
          },
          {
            expr: "1 - 2\\sin^2(75^\\circ)",
            half: "75^\\circ",
            ans: "-\\frac{\\sqrt{3}}{2}",
            wrong: ["\\frac{\\sqrt{3}}{2}", "-\\frac{1}{2}", "0"],
            sol: "$1 - 2\\sin^2(75^\\circ) = \\cos(150^\\circ) = -\\frac{\\sqrt{3}}{2}$",
          },
        ];
        const mult = rng.pick([1, 2, 4]);
        const item = rng.pick(items);
        const promptStr = mult === 1 ? item.expr : `${mult}\\left(${item.expr}\\right)`;
        const ansStr = mult === 1 ? item.ans : `${mult}\\cdot\\left(${item.ans}\\right)`;
        const wrongStr = item.wrong.map((w) => (mult === 1 ? `$${w}$` : `$${mult}\\cdot\\left(${w}\\right)$`));
        return oneOf(
          rng,
          t(
            `Find the exact value of $\\\\displaystyle ${promptStr}$ using double-angle properties.`,
            `利用二倍角性质求 $\\\\displaystyle ${promptStr}$ 的精确值。`,
          ),
          t(`$${ansStr}$`, `$${ansStr}$`),
          wrongStr.map((w) => t(w, w)),
          t(`${item.sol} ✓`, `${item.sol} ✓`),
        );
      },
    },
  ],
};

// ─── 4.12.7 Simplifying expressions using tan double-angle ───────────────────

/** simplifyingExpressionsUsingTheDoubleAngleFormulaForTangent covers tan(2θ) = 2tan(θ)/(1−tan²θ). */
export const simplifyingExpressionsUsingTheDoubleAngleFormulaForTangent: TopicDef = {
  id: "simplifying-expressions-using-the-double-angle-formula-for-tangent",
  title: t("Simplifying Expressions Using the Double-Angle Formula for Tangent", "用正切二倍角公式化简表达式"),
  summary: t(
    "Apply tan(2θ) = 2tan(θ) / (1 − tan²θ) to simplify or evaluate tangent expressions.",
    "应用 tan(2θ) = 2tan(θ) / (1 − tan²θ) 化简或求值正切表达式。",
  ),
  prerequisites: [
    "the-sum-and-difference-formulas-for-tangent",
    "the-double-angle-formula-for-sine",
    "the-double-angle-formula-for-cosine",
  ],
  encompasses: [
    { topic: "the-sum-and-difference-formulas-for-tangent", weight: 0.4 },
    { topic: "the-double-angle-formula-for-sine", weight: 0.2 },
    { topic: "the-double-angle-formula-for-cosine", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "tan-double-angle-formula",
      title: t("The double-angle formula for tangent", "正切的二倍角公式"),
      explanation: t(
        "From the addition formula with $A=B=\\theta$:\\n\\n$$\\tan(2\\theta) = \\frac{2\\tan\\theta}{1 - \\tan^2\\theta}$$\\n\\nExample: if $\\tan\\theta = \\frac{1}{2}$, then $\\tan(2\\theta) = \\frac{2\\cdot\\frac{1}{2}}{1 - \\frac{1}{4}} = \\frac{1}{\\frac{3}{4}} = \\frac{4}{3}$.",
        "由和角公式令 $A=B=\\theta$，得：\\n\\n$$\\tan(2\\theta) = \\frac{2\\tan\\theta}{1 - \\tan^2\\theta}$$\\n\\n例如，若 $\\tan\\theta = \\frac{1}{2}$，则 $\\tan(2\\theta) = \\frac{2\\cdot\\frac{1}{2}}{1 - \\frac{1}{4}} = \\frac{1}{\\frac{3}{4}} = \\frac{4}{3}$。",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u"]);
        const pairs: [number, number][] = [
          [1, 2],
          [1, 3],
          [1, 4],
          [1, 5],
          [2, 3],
          [2, 5],
          [3, 4],
          [3, 5],
          [4, 3],
          [3, 2],
          [5, 2],
        ];
        const [p, q2] = rng.pick(pairs);
        const sign = rng.pick([1, -1]);
        const tanVal = Q.of(sign * p, q2);
        const tan2val = tanVal.mul(Q.of(2)).div(Q.of(1).sub(tanVal.mul(tanVal)));
        const wrong2a = tanVal.mul(Q.of(2));
        const wrong2b = Q.of(sign * p * 2, q2);
        const wrong2c = Q.of(-tan2val.n, tan2val.d);
        return numberProblem({
          prompt: t(
            `If $\\tan ${v} = ${tanVal.toLatex()}$, find $\\tan(2${v})$.`,
            `若 $\\tan ${v} = ${tanVal.toLatex()}$，求 $\\tan(2${v})$。`,
          ),
          answer: tan2val,
          wrong: [wrong2a, wrong2b, wrong2c],
          solution: t(
            `$\\tan(2${v}) = \\frac{2\\cdot(${tanVal.toLatex()})}{1 - (${tanVal.toLatex()})^2} = ${tan2val.toLatex()}$.`,
            `$\\tan(2${v}) = \\frac{2\\cdot(${tanVal.toLatex()})}{1 - (${tanVal.toLatex()})^2} = ${tan2val.toLatex()}$。`,
          ),
          form: "fraction",
        });
      },
    },
    {
      id: "tan-double-angle-rewriting",
      title: t("Rewriting products as tan double-angle", "将乘积改写为正切二倍角"),
      explanation: t(
        "To simplify $\\dfrac{2\\tan x}{1 - \\tan^2 x}$, recognize the double-angle pattern:\\n\\n$$\\frac{2\\tan x}{1 - \\tan^2 x} = \\tan(2x)$$",
        "化简 $\\dfrac{2\\tan x}{1 - \\tan^2 x}$ 时，识别二倍角模式：\\n\\n$$\\frac{2\\tan x}{1 - \\tan^2 x} = \\tan(2x)$$",
      ),
      generate(rng) {
        const v = rng.pick(["x", "\\theta", "t", "\\alpha", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5, 6, 7]);
        const m = rng.pick([1, 2, 3, 4]);
        const arg = m === 1 ? v : `${m}${v}`;
        const doubleArg = `${2 * m}${v}`;
        const kTex = k === 1 ? "" : `${k}`;
        return oneOf(
          rng,
          t(
            `Simplify $\\dfrac{${2 * k}\\tan(${arg})}{${k === 1 ? "" : k}(1 - \\tan^2(${arg}))}$.`,
            `化简 $\\dfrac{${2 * k}\\tan(${arg})}{${k === 1 ? "" : k}(1 - \\tan^2(${arg}))}$。`,
          ),
          t(`$\\tan(${doubleArg})$`, `$\\tan(${doubleArg})$`),
          [
            t(`$\\tan^2(${arg})$`, `$\\tan^2(${arg})$`),
            t(`$${kTex}\\tan(${doubleArg})$`, `$${kTex}\\tan(${doubleArg})$`),
            t(`$2\\tan(${arg})$`, `$2\\tan(${arg})$`),
          ],
          t(
            `Cancel ${k === 1 ? "factor 1" : `factor ${k}`}: $\\frac{2\\tan(${arg})}{1 - \\tan^2(${arg})} = \\tan(${doubleArg})$.`,
            `约去因子 ${k === 1 ? "1" : k}：$\\frac{2\\tan(${arg})}{1 - \\tan^2(${arg})} = \\tan(${doubleArg})$。`,
          ),
        );
      },
    },
  ],
};

// ─── 4.12.8 Verifying identities using tan double-angle ──────────────────────

/** verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulaForTangent. */
export const verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulaForTangent: TopicDef = {
  id: "verifying-trigonometric-identities-using-the-double-angle-formula-for-tangent",
  title: t("Verifying Trigonometric Identities Using the Double-Angle Formula for Tangent", "利用正切二倍角公式验证三角恒等式"),
  summary: t(
    "Prove identities by substituting tan(2θ) = 2tan(θ)/(1−tan²θ) and simplifying.",
    "通过代入 tan(2θ) = 2tan(θ)/(1−tan²θ) 并化简来证明三角恒等式。",
  ),
  prerequisites: ["simplifying-expressions-using-the-double-angle-formula-for-tangent"],
  encompasses: [{ topic: "simplifying-expressions-using-the-double-angle-formula-for-tangent", weight: 0.6 }],
  xp: 20,
  standards: ["CCSS.HSF.TF.C.9"],
  knowledgePoints: [
    {
      id: "verifying-tan-double-angle-identities",
      title: t("Verifying identities involving tan(2θ)", "验证含 tan(2θ) 的恒等式"),
      explanation: t(
        "Verify $\\tan(2\\theta) = \\dfrac{2}{\\cot\\theta - \\tan\\theta}$:\\n\\n$$\\frac{2}{\\cot\\theta - \\tan\\theta} = \\frac{2}{\\frac{\\cos\\theta}{\\sin\\theta} - \\frac{\\sin\\theta}{\\cos\\theta}} = \\frac{2}{\\frac{\\cos^2\\theta - \\sin^2\\theta}{\\sin\\theta\\cos\\theta}} = \\frac{2\\sin\\theta\\cos\\theta}{\\cos^2\\theta - \\sin^2\\theta} = \\frac{\\sin(2\\theta)}{\\cos(2\\theta)} = \\tan(2\\theta) \\checkmark$$",
        "验证 $\\tan(2\\theta) = \\dfrac{2}{\\cot\\theta - \\tan\\theta}$：\\n\\n$$\\frac{2}{\\cot\\theta - \\tan\\theta} = \\frac{2}{\\frac{\\cos\\theta}{\\sin\\theta} - \\frac{\\sin\\theta}{\\cos\\theta}} = \\frac{2}{\\frac{\\cos^2\\theta - \\sin^2\\theta}{\\sin\\theta\\cos\\theta}} = \\frac{2\\sin\\theta\\cos\\theta}{\\cos^2\\theta - \\sin^2\\theta} = \\frac{\\sin(2\\theta)}{\\cos(2\\theta)} = \\tan(2\\theta) \\checkmark$$",
      ),
      generate(rng) {
        const v = rng.pick(["\\theta", "x", "\\alpha", "t", "u"]);
        const k = rng.pick([1, 2, 3, 4, 5]);
        const arg = k === 1 ? v : `${k}${v}`;
        const doubleArg = `${2 * k}${v}`;
        const identities = [
          {
            prompt: t(`Which expression equals $\\dfrac{\\tan(${doubleArg})}{2}$?`, `哪个表达式等于 $\\dfrac{\\tan(${doubleArg})}{2}$？`),
            ans: t(`$\\dfrac{\\tan(${arg})}{1 - \\tan^2(${arg})}$`, `$\\dfrac{\\tan(${arg})}{1 - \\tan^2(${arg})}$`),
            wrong: [
              t(`$\\tan(${arg})$`, `$\\tan(${arg})$`),
              t(`$\\dfrac{\\tan(${arg})}{2}$`, `$\\dfrac{\\tan(${arg})}{2}$`),
              t(`$\\dfrac{2\\tan(${arg})}{1 - \\tan^2(${arg})}$`, `$\\dfrac{2\\tan(${arg})}{1 - \\tan^2(${arg})}$`),
            ],
            sol: t(
              `$\\frac{\\tan(${doubleArg})}{2} = \\frac{1}{2}\\cdot\\frac{2\\tan(${arg})}{1-\\tan^2(${arg})} = \\frac{\\tan(${arg})}{1-\\tan^2(${arg})}$.`,
              `$\\frac{\\tan(${doubleArg})}{2} = \\frac{1}{2}\\cdot\\frac{2\\tan(${arg})}{1-\\tan^2(${arg})} = \\frac{\\tan(${arg})}{1-\\tan^2(${arg})}$。`,
            ),
          },
          {
            prompt: t(
              `Simplify $\\sin(${doubleArg})\\cdot\\dfrac{1 - \\tan^2(${arg})}{2\\tan(${arg})}$.`,
              `化简 $\\sin(${doubleArg})\\cdot\\dfrac{1 - \\tan^2(${arg})}{2\\tan(${arg})}$.`,
            ),
            ans: t(`$\\cos(${doubleArg})$`, `$\\cos(${doubleArg})$`),
            wrong: [
              t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
              t(`$\\tan(${doubleArg})$`, `$\\tan(${doubleArg})$`),
              t(`$1$`, `$1$`),
            ],
            sol: t(
              `$\\frac{\\sin(${doubleArg})}{\\tan(${doubleArg})} = \\cos(${doubleArg})$.`,
              `$\\frac{\\sin(${doubleArg})}{\\tan(${doubleArg})} = \\cos(${doubleArg})$。`,
            ),
          },
          {
            prompt: t(
              `Which expression equals $\\dfrac{2}{\\cot(${arg}) - \\tan(${arg})}$?`,
              `哪个表达式等于 $\\dfrac{2}{\\cot(${arg}) - \\tan(${arg})}$？`,
            ),
            ans: t(`$\\tan(${doubleArg})$`, `$\\tan(${doubleArg})$`),
            wrong: [
              t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
              t(`$2\\tan(${arg})$`, `$2\\tan(${arg})$`),
              t(`$\\cot(${doubleArg})$`, `$\\cot(${doubleArg})$`),
            ],
            sol: t(
              `$\\cot(${arg}) - \\tan(${arg}) = 2\\cot(${doubleArg})$, so $\\frac{2}{2\\cot(${doubleArg})} = \\tan(${doubleArg})$.`,
              `$\\cot(${arg}) - \\tan(${arg}) = 2\\cot(${doubleArg})$，故 $\\frac{2}{2\\cot(${doubleArg})} = \\tan(${doubleArg})$。`,
            ),
          },
          {
            prompt: t(
              `Simplify $\\dfrac{\\sin(${doubleArg})}{\\cos(${doubleArg})}$.`,
              `化简 $\\dfrac{\\sin(${doubleArg})}{\\cos(${doubleArg})}$。`,
            ),
            ans: t(`$\\tan(${doubleArg})$`, `$\\tan(${doubleArg})$`),
            wrong: [
              t(`$\\sin(${doubleArg})$`, `$\\sin(${doubleArg})$`),
              t(`$\\tan(${arg})$`, `$\\tan(${arg})$`),
              t(`$\\cot(${doubleArg})$`, `$\\cot(${doubleArg})$`),
            ],
            sol: t(
              `By definition, $\\frac{\\sin(${doubleArg})}{\\cos(${doubleArg})} = \\tan(${doubleArg})$.`,
              `由定义，$\\frac{\\sin(${doubleArg})}{\\cos(${doubleArg})} = \\tan(${doubleArg})$。`,
            ),
          },
        ];
        const item = rng.pick(identities);
        return oneOf(rng, item.prompt, item.ans, item.wrong, item.sol);
      },
    },
  ],
};

// ─── Export array: all 27 topics, modules 4.9–4.12 ───────────────────────────

export const precalculusTrigonometricIdentityTopics: readonly TopicDef[] = [
  graphingTheInverseSineFunction,
  graphingTheInverseCosineFunction,
  graphingTheInverseTangentFunction,
  evaluatingExpressionsContainingInverseTrigonometricFunctions,
  furtherEvaluatingExpressionsContainingInverseTrigonometricFunctions,
  simplifyingExpressionsUsingBasicTrigonometricIdentities,
  simplifyingExpressionsUsingThePythagoreanIdentity,
  alternateFormsOfThePythagoreanIdentity,
  simplifyingExpressionsUsingTheSecantTangentIdentity,
  alternateFormsOfTheSecantTangentIdentity,
  simplifyingTrigonometricExpressionsUsingTheCotangentCosecantIdentity,
  simplifyingTrigonometricExpressionsUsingCofunctionIdentities,
  theSumAndDifferenceFormulasForSine,
  theSumAndDifferenceFormulasForCosine,
  theSumAndDifferenceFormulasForTangent,
  calculatingTrigonometricRatiosUsingTheSumFormulaForSine,
  calculatingTrigonometricRatiosUsingTheSumFormulaForCosine,
  calculatingTrigonometricRatiosUsingTheSumFormulaForTangent,
  writingSumsOfTrigonometricFunctionsInAmplitudePhaseForm,
  theDoubleAngleFormulaForSine,
  verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulaForSine,
  usingTheDoubleAngleFormulaForSineWithThePythagoreanTheorem,
  theDoubleAngleFormulaForCosine,
  verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulasForCosine,
  findingExactValuesOfTrigonometricExpressionsUsingTheDoubleAngleFormulasForCosine,
  simplifyingExpressionsUsingTheDoubleAngleFormulaForTangent,
  verifyingTrigonometricIdentitiesUsingTheDoubleAngleFormulaForTangent,
];
