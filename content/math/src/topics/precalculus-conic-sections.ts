import type { Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { Q } from "@ga/subject-math";

import { choiceProblem, steps } from "../problems.ts";

// ---------------------------------------------------------------------------
// Helpers for Conic Sections
// ---------------------------------------------------------------------------

/** Pythagorean triples [b, c, a] for ellipses (a^2 = b^2 + c^2) or [a, b, c] for hyperbolas (c^2 = a^2 + b^2). */
const pythTriples = [
  [3, 4, 5],
  [4, 3, 5],
  [6, 8, 10],
  [8, 6, 10],
  [5, 12, 13],
  [12, 5, 13],
  [9, 12, 15],
  [12, 9, 15],
  [8, 15, 17],
  [15, 8, 17],
  [7, 24, 25],
  [24, 7, 25],
  [10, 24, 26],
  [24, 10, 26],
  [12, 16, 20],
  [16, 12, 20],
  [15, 20, 25],
  [20, 15, 25],
] as const;

/** sqTerm writes (v - h)^2 or v^2 if h is 0. */
function sqTerm(v: string, h: number): string {
  if (h === 0) return `${v}^{2}`;
  return h > 0 ? `(${v} - ${h})^{2}` : `(${v} + ${-h})^{2}`;
}

/** linTerm writes (v - h) or v if h is 0. */
function linTerm(v: string, h: number): string {
  if (h === 0) return v;
  return h > 0 ? `(${v} - ${h})` : `(${v} + ${-h})`;
}

/** ellipseEq writes standard form of an ellipse. */
function ellipseEq(h: number, k: number, a2: number, b2: number, horizontal: boolean): string {
  const xDen = horizontal ? a2 : b2;
  const yDen = horizontal ? b2 : a2;
  return `\\frac{${sqTerm("x", h)}}{${xDen}} + \\frac{${sqTerm("y", k)}}{${yDen}} = 1`;
}

/** hyperbolaEq writes standard form of a hyperbola. */
function hyperbolaEq(h: number, k: number, a2: number, b2: number, horizontal: boolean): string {
  if (horizontal) {
    return `\\frac{${sqTerm("x", h)}}{${a2}} - \\frac{${sqTerm("y", k)}}{${b2}} = 1`;
  }
  return `\\frac{${sqTerm("y", k)}}{${a2}} - \\frac{${sqTerm("x", h)}}{${b2}} = 1`;
}

/** pmFrac writes \pm p/q in reduced LaTeX form. */
function pmFrac(p: number, q: number): string {
  const frac = Q.of(p, q);
  if (frac.isInteger()) return `\\pm ${frac.abs().toLatex()}`;
  return `\\pm ${frac.abs().toLatex()}`;
}

/** makeChoice builds a 4-option multiple-choice problem from LaTeX string options. */
function makeChoice(rng: Rng, prompt: Text, correct: string, distractors: readonly string[], solution: Text): Problem {
  const cleanCorrect = correct.trim();
  const seen = new Set<string>([cleanCorrect]);
  const validDistractors: string[] = [];
  for (const d of distractors) {
    const s = d.trim();
    if (!seen.has(s) && s.length > 0) {
      seen.add(s);
      validDistractors.push(s);
    }
  }
  let fallbackCount = 1;
  while (validDistractors.length < 3) {
    const fallback = `${cleanCorrect} + ${fallbackCount}`;
    if (!seen.has(fallback)) {
      seen.add(fallback);
      validDistractors.push(fallback);
    }
    fallbackCount++;
  }
  const chosenDistractors = rng.shuffle(validDistractors).slice(0, 3);
  const rawOptions = rng.shuffle([cleanCorrect, ...chosenDistractors]);
  const options = rawOptions.map((s) => t(`$${s}$`, `$${s}$`));
  const correctIdx = options.findIndex((o) => o.en === `$${cleanCorrect}$`);
  return choiceProblem({
    prompt,
    options,
    correct: correctIdx,
    solution,
  });
}

/** makeChoiceTexts builds a 4-option multiple-choice problem from bilingual Text options. */
function makeChoiceTexts(rng: Rng, prompt: Text, correct: Text, distractors: readonly Text[], solution: Text): Problem {
  const seen = new Set<string>([correct.en]);
  const valid: Text[] = [];
  for (const d of distractors) {
    if (!seen.has(d.en) && d.en.length > 0) {
      seen.add(d.en);
      valid.push(d);
    }
  }
  let fallbackCount = 1;
  while (valid.length < 3) {
    const fallback = t(`${correct.en} (${fallbackCount})`, `${correct["zh-CN"]} (${fallbackCount})`);
    if (!seen.has(fallback.en)) {
      seen.add(fallback.en);
      valid.push(fallback);
    }
    fallbackCount++;
  }
  const chosen = rng.shuffle(valid).slice(0, 3);
  const options = rng.shuffle([correct, ...chosen]);
  const correctIdx = options.findIndex((o) => o.en === correct.en);
  return choiceProblem({
    prompt,
    options,
    correct: correctIdx,
    solution,
  });
}

// ===========================================================================
// Module 7.26. Ellipses as Conic Sections (Topics 1 - 10)
// ===========================================================================

export const introductionToEllipses: TopicDef = {
  id: "introduction-to-ellipses",
  title: t("Introduction to Ellipses", "椭圆的概念与几何定义"),
  summary: t(
    "Explore the geometric definition of an ellipse as the locus of points where the sum of distances to two foci is constant, and identify its center and axes.",
    "理解椭圆的几何定义（到两焦点的距离之和为定值 2a），并识别椭圆的中心、长轴和短轴。",
  ),
  prerequisites: ["equations-of-circles"],
  encompasses: [{ topic: "equations-of-circles", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "geometric-definition-of-an-ellipse",
      title: t("The geometric definition of an ellipse", "椭圆的几何定义"),
      explanation: t(
        "An ellipse is the set of all points $P$ in a plane such that the sum of the distances from $P$ to two fixed points $F_{1}$ and $F_{2}$ (the foci) is a constant $2a$, where $2a > F_{1}F_{2}$:\n\n$$PF_{1} + PF_{2} = 2a$$\n\nIf the distance to one focus is $d_{1}$, the distance to the other focus is $d_{2} = 2a - d_{1}$.",
        "椭圆是平面内到两个定点 $F_{1}$ 和 $F_{2}$（焦点）的距离之和为常数 $2a$ 的点的集合，其中 $2a > F_{1}F_{2}$：\n\n$$PF_{1} + PF_{2} = 2a$$\n\n如果点 $P$ 到一个焦点的距离是 $d_{1}$，那么到另一个焦点的距离就是 $d_{2} = 2a - d_{1}$。",
      ),
      generate(rng) {
        const a = rng.int(6, 18);
        const sumDist = 2 * a;
        const d1 = rng.int(2, sumDist - 2);
        const d2 = sumDist - d1;
        const prompt = t(
          `An ellipse is defined such that the sum of the distances from any point on it to the two foci $F_{1}$ and $F_{2}$ is $${sumDist}$. If a point $P$ lies on this ellipse and $PF_{1} = ${d1}$, what is the distance $PF_{2}$?`,
          `已知椭圆上任意一点到两个焦点 $F_{1}$ 和 $F_{2}$ 的距离之和为 $${sumDist}$。如果点 $P$ 在该椭圆上且 $PF_{1} = ${d1}$，那么距离 $PF_{2}$ 是多少？`,
        );
        const correct = `${d2}`;
        const distractors = [`${d1}`, `${sumDist + d1}`, `${Math.abs(a - d1) || a + 1}`, `${sumDist}`, `${d2 + 2}`];
        const solution = t(
          `By the definition of an ellipse, $PF_{1} + PF_{2} = ${sumDist}$. Therefore:${steps(`PF_{2} = ${sumDist} - PF_{1} = ${sumDist} - ${d1} = ${d2}`)}`,
          `根据椭圆的几何定义，$PF_{1} + PF_{2} = ${sumDist}$。因此：${steps(`PF_{2} = ${sumDist} - PF_{1} = ${sumDist} - ${d1} = ${d2}`)}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "major-and-minor-axes",
      title: t("Major and minor axes of an ellipse", "椭圆的长轴与短轴"),
      explanation: t(
        "The major axis of an ellipse passes through the foci and vertices; its length is $2a$, where $a$ is the semi-major axis.\n\nThe minor axis is perpendicular to the major axis at the center; its length is $2b$, where $b$ is the semi-minor axis ($a > b > 0$).",
        "椭圆的长轴穿过焦点和顶点，其长度为 $2a$，其中 $a$ 是半长轴。\n\n椭圆的短轴在中心处垂直于长轴，其长度为 $2b$，其中 $b$ 是半短轴（$a > b > 0$）。",
      ),
      generate(rng) {
        const a = rng.int(5, 16);
        const b = rng.int(2, a - 1);
        const askMajor = rng.bool();
        const prompt = askMajor
          ? t(
              `An ellipse has a semi-major axis of length $a = ${a}$ and a semi-minor axis of length $b = ${b}$. What is the length of its major axis?`,
              `一个椭圆的半长轴长为 $a = ${a}$，半短轴长为 $b = ${b}$。该椭圆的长轴长是多少？`,
            )
          : t(
              `An ellipse has a semi-major axis of length $a = ${a}$ and a semi-minor axis of length $b = ${b}$. What is the length of its minor axis?`,
              `一个椭圆的半长轴长为 $a = ${a}$，半短轴长为 $b = ${b}$。该椭圆的短轴长是多少？`,
            );
        const correctVal = askMajor ? 2 * a : 2 * b;
        const correct = `${correctVal}`;
        const distractors = [
          `${askMajor ? a : b}`,
          `${askMajor ? 2 * b : 2 * a}`,
          `${a + b}`,
          `${2 * (a + b)}`,
          `${Math.abs(2 * a - 2 * b) || 1}`,
        ];
        const solution = askMajor
          ? t(
              `The length of the major axis is twice the semi-major axis $a$:${steps(`\\text{Major axis} = 2a = 2 \\times ${a} = ${2 * a}`)}`,
              `长轴的长度是半长轴 $a$ 的两倍：${steps(`\\text{长轴长} = 2a = 2 \\times ${a} = ${2 * a}`)}`,
            )
          : t(
              `The length of the minor axis is twice the semi-minor axis $b$:${steps(`\\text{Minor axis} = 2b = 2 \\times ${b} = ${2 * b}`)}`,
              `短轴的长度是半短轴 $b$ 的两倍：${steps(`\\text{短轴长} = 2b = 2 \\times ${b} = ${2 * b}`)}`,
            );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "center-of-an-ellipse",
      title: t("The center of an ellipse", "椭圆的中心"),
      explanation: t(
        "The center $(h, k)$ of an ellipse is the midpoint of the major axis connecting its two vertices, and also the midpoint of the segment connecting its two foci:\n\n$$(h, k) = \\left(\\frac{x_{1} + x_{2}}{2}, \\frac{y_{1} + y_{2}}{2}\\right)$$",
        "椭圆的中心 $(h, k)$ 是连接两顶点的长轴线段的中点，也是连接两焦点的线段的中点：\n\n$$(h, k) = \\left(\\frac{x_{1} + x_{2}}{2}, \\frac{y_{1} + y_{2}}{2}\\right)$$",
      ),
      generate(rng) {
        const h = rng.int(-7, 7);
        const k = rng.int(-7, 7);
        const d = rng.int(2, 9);
        const horizontal = rng.bool();
        const v1x = horizontal ? h - d : h;
        const v1y = horizontal ? k : k - d;
        const v2x = horizontal ? h + d : h;
        const v2y = horizontal ? k : k + d;
        const prompt = t(
          `The endpoints of the major axis of an ellipse are $(${v1x}, ${v1y})$ and $(${v2x}, ${v2y})$. What are the coordinates of the center of the ellipse?`,
          `某椭圆长轴的两端点坐标分别为 $(${v1x}, ${v1y})$ 和 $(${v2x}, ${v2y})$。该椭圆的中心坐标是什么？`,
        );
        const correct = `(${h}, ${k})`;
        const distractors = [`(${h + 1}, ${k})`, `(${h}, ${k + 1})`, `(${k}, ${h})`, `(${h - 1}, ${k - 1})`, `(${h + d}, ${k})`];
        const solution = t(
          `The center is the midpoint of the endpoints of the major axis:${steps(
            `(h, k) = \\left(\\frac{${v1x} + ${v2x}}{2}, \\frac{${v1y} + ${v2y}}{2}\\right) = (${h}, ${k})`,
          )}`,
          `中心是长轴两端点的中点坐标：${steps(
            `(h, k) = \\left(\\frac{${v1x} + ${v2x}}{2}, \\frac{${v1y} + ${v2y}}{2}\\right) = (${h}, ${k})`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const equationsOfEllipsesCenteredAtTheOrigin: TopicDef = {
  id: "equations-of-ellipses-centered-at-the-origin",
  title: t("Equations of Ellipses Centered at the Origin", "中心在原点的椭圆标准方程"),
  summary: t(
    "Identify and write standard equations of ellipses centered at the origin, distinguishing horizontal and vertical orientations.",
    "识别并写出中心在原点的椭圆标准方程，区分焦点在 x 轴或 y 轴上的情况。",
  ),
  prerequisites: ["introduction-to-ellipses"],
  encompasses: [{ topic: "introduction-to-ellipses", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "horizontal-ellipse-centered-at-origin",
      title: t("Horizontal ellipse centered at the origin", "焦点在 x 轴上的椭圆标准方程"),
      explanation: t(
        "When the major axis lies along the $x$-axis, the standard equation of an ellipse centered at $(0, 0)$ is:\n\n$$\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1 \\quad (a > b > 0)$$\n\nThe vertices are $(\\pm a, 0)$ and the co-vertices are $(0, \\pm b)$.",
        "当长轴位于 $x$ 轴上时，中心在 $(0, 0)$ 的椭圆标准方程为：\n\n$$\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1 \\quad (a > b > 0)$$\n\n其长轴顶点为 $(\\pm a, 0)$，短轴端点为 $(0, \\pm b)$。",
      ),
      generate(rng) {
        const a = rng.int(4, 14);
        const b = rng.int(2, a - 1);
        const a2 = a * a;
        const b2 = b * b;
        const prompt = t(
          `An ellipse centered at $(0, 0)$ has vertices at $(\\pm ${a}, 0)$ and co-vertices at $(0, \\pm ${b})$. What is the standard equation of this ellipse?`,
          `一个中心在 $(0, 0)$ 的椭圆顶点为 $(\\pm ${a}, 0)$，短轴端点为 $(0, \\pm ${b})$。该椭圆的标准方程是什么？`,
        );
        const correct = `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1`;
        const distractors = [
          `\\frac{x^{2}}{${b2}} + \\frac{y^{2}}{${a2}} = 1`,
          `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1`,
          `\\frac{x^{2}}{${a}} + \\frac{y^{2}}{${b}} = 1`,
          `\\frac{x^{2}}{${2 * a}} + \\frac{y^{2}}{${2 * b}} = 1`,
        ];
        const solution = t(
          `Since the vertices are on the $x$-axis, the ellipse is horizontal with $a = ${a}$ ($a^{2} = ${a2}$) and $b = ${b}$ ($b^{2} = ${b2}$):${steps(
            correct,
          )}`,
          `因为顶点在 $x$ 轴上，所以椭圆为水平方向，其中 $a = ${a}$（$a^{2} = ${a2}$），$b = ${b}$（$b^{2} = ${b2}$）：${steps(correct)}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "vertical-ellipse-centered-at-origin",
      title: t("Vertical ellipse centered at the origin", "焦点在 y 轴上的椭圆标准方程"),
      explanation: t(
        "When the major axis lies along the $y$-axis, the standard equation of an ellipse centered at $(0, 0)$ is:\n\n$$\\frac{x^{2}}{b^{2}} + \\frac{y^{2}}{a^{2}} = 1 \\quad (a > b > 0)$$\n\nThe larger denominator is under $y^{2}$. The vertices are $(0, \\pm a)$ and the co-vertices are $(\\pm b, 0)$.",
        "当长轴位于 $y$ 轴上时，中心在 $(0, 0)$ 的椭圆标准方程为：\n\n$$\\frac{x^{2}}{b^{2}} + \\frac{y^{2}}{a^{2}} = 1 \\quad (a > b > 0)$$\n\n较大的分母在 $y^{2}$ 下方。其顶点为 $(0, \\pm a)$，短轴端点为 $(\\pm b, 0)$。",
      ),
      generate(rng) {
        const a = rng.int(4, 14);
        const b = rng.int(2, a - 1);
        const a2 = a * a;
        const b2 = b * b;
        const prompt = t(
          `An ellipse centered at $(0, 0)$ has vertices at $(0, \\pm ${a})$ and co-vertices at $(\\pm ${b}, 0)$. What is the standard equation of this ellipse?`,
          `一个中心在 $(0, 0)$ 的椭圆顶点为 $(0, \\pm ${a})$，短轴端点为 $(\\pm ${b}, 0)$。该椭圆的标准方程是什么？`,
        );
        const correct = `\\frac{x^{2}}{${b2}} + \\frac{y^{2}}{${a2}} = 1`;
        const distractors = [
          `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1`,
          `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`,
          `\\frac{x^{2}}{${b}} + \\frac{y^{2}}{${a}} = 1`,
          `\\frac{x^{2}}{${b2}} - \\frac{y^{2}}{${a2}} = 1`,
        ];
        const solution = t(
          `Since the vertices are on the $y$-axis, $a = ${a}$ lies under $y^{2}$, giving:${steps(correct)}`,
          `由于长轴顶点在 $y$ 轴上，$a = ${a}$ 位于 $y^{2}$ 之下，得：${steps(correct)}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "identifying-semi-axes-and-orientation",
      title: t("Identifying semi-axes and orientation", "由方程识别半轴长与长轴方向"),
      explanation: t(
        "In $\\frac{x^{2}}{M} + \\frac{y^{2}}{N} = 1$, the larger denominator is $a^{2}$ and the smaller denominator is $b^{2}$.\n\n- If $M > N$, the major axis is horizontal with $a = \\sqrt{M}$ and $b = \\sqrt{N}$.\n- If $N > M$, the major axis is vertical with $a = \\sqrt{N}$ and $b = \\sqrt{M}$.",
        "在方程 $\\frac{x^{2}}{M} + \\frac{y^{2}}{N} = 1$ 中，较大的分母是 $a^{2}$，较小的分母是 $b^{2}$。\n\n- 若 $M > N$，长轴为水平方向，半轴长为 $a = \\sqrt{M}, b = \\sqrt{N}$。\n- 若 $N > M$，长轴为竖直方向，半轴长为 $a = \\sqrt{N}, b = \\sqrt{M}$。",
      ),
      generate(rng) {
        const a = rng.int(5, 15);
        const b = rng.int(2, a - 1);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1` : `\\frac{x^{2}}{${b2}} + \\frac{y^{2}}{${a2}} = 1`;
        const prompt = t(
          `For the ellipse $${eqStr}$, determine the orientation of its major axis and the values of $a$ and $b$.`,
          `对于椭圆 $${eqStr}$，确定其长轴方向以及半轴长 $a$ 和 $b$ 的值。`,
        );
        const correct = horizontal
          ? t(`Horizontal; a = ${a}, b = ${b}`, `水平方向；a = ${a}, b = ${b}`)
          : t(`Vertical; a = ${a}, b = ${b}`, `竖直方向；a = ${a}, b = ${b}`);
        const distractors = [
          horizontal
            ? t(`Vertical; a = ${a}, b = ${b}`, `竖直方向；a = ${a}, b = ${b}`)
            : t(`Horizontal; a = ${a}, b = ${b}`, `水平方向；a = ${a}, b = ${b}`),
          horizontal
            ? t(`Horizontal; a = ${a2}, b = ${b2}`, `水平方向；a = ${a2}, b = ${b2}`)
            : t(`Vertical; a = ${a2}, b = ${b2}`, `竖直方向；a = ${a2}, b = ${b2}`),
          horizontal
            ? t(`Vertical; a = ${b}, b = ${a}`, `竖直方向；a = ${b}, b = ${a}`)
            : t(`Horizontal; a = ${b}, b = ${a}`, `水平方向；a = ${b}, b = ${a}`),
        ];
        const solution = t(
          `The larger denominator is $${a2} = ${a}^{2}$, so $a = ${a}$. The smaller is $${b2} = ${b}^{2}$, so $b = ${b}$. Because $${a2}$ is under $${horizontal ? "x^{2}" : "y^{2}"}$, the major axis is ${horizontal ? "horizontal" : "vertical"}.`,
          `较大分母为 $${a2} = ${a}^{2}$，因此 $a = ${a}$；较小分母为 $${b2} = ${b}^{2}$，因此 $b = ${b}$。因为 $${a2}$ 位于 $${horizontal ? "x^{2}" : "y^{2}"}$ 下方，所以长轴是${horizontal ? "水平方向" : "竖直方向"}。`,
        );
        return makeChoiceTexts(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const equationsOfEllipsesCenteredAtAGeneralPoint: TopicDef = {
  id: "equations-of-ellipses-centered-at-a-general-point",
  title: t("Equations of Ellipses Centered at a General Point", "中心在任意点 (h, k) 的椭圆标准方程"),
  summary: t(
    "Write and analyze equations of translated ellipses with center $(h, k)$, finding their centers and vertices.",
    "写出并分析中心在 $(h, k)$ 的平移椭圆方程，求解其中心坐标与顶点坐标。",
  ),
  prerequisites: ["equations-of-ellipses-centered-at-the-origin"],
  encompasses: [{ topic: "equations-of-ellipses-centered-at-the-origin", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "standard-form-with-center-h-k",
      title: t("Standard equation with center (h, k)", "中心在 (h, k) 的标准方程"),
      explanation: t(
        "When an ellipse is translated so that its center is $(h, k)$:\n\n- Horizontal major axis: $\\frac{(x-h)^{2}}{a^{2}} + \\frac{(y-k)^{2}}{b^{2}} = 1$\n- Vertical major axis: $\\frac{(x-h)^{2}}{b^{2}} + \\frac{(y-k)^{2}}{a^{2}} = 1$",
        "当椭圆平移至中心为 $(h, k)$ 时：\n\n- 长轴水平：$\\frac{(x-h)^{2}}{a^{2}} + \\frac{(y-k)^{2}}{b^{2}} = 1$\n- 长轴竖直：$\\frac{(x-h)^{2}}{b^{2}} + \\frac{(y-k)^{2}}{a^{2}} = 1$",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const a = rng.int(4, 12);
        const b = rng.int(2, a - 1);
        const horizontal = rng.bool();
        const a2 = a * a;
        const b2 = b * b;
        const prompt = t(
          `Write the standard equation of the ellipse with center $(${h}, ${k})$, semi-major axis $a = ${a}$ (${horizontal ? "horizontal" : "vertical"}), and semi-minor axis $b = ${b}$.`,
          `写出中心在 $(${h}, ${k})$，半长轴长 $a = ${a}$（${horizontal ? "水平方向" : "竖直方向"}），半短轴长 $b = ${b}$ 的椭圆标准方程。`,
        );
        const correct = ellipseEq(h, k, a2, b2, horizontal);
        const distractors = [
          ellipseEq(-h, -k, a2, b2, horizontal),
          ellipseEq(h, k, b2, a2, horizontal),
          ellipseEq(k, h, a2, b2, horizontal),
          ellipseEq(h, k, a, b, horizontal),
        ];
        const solution = t(
          `The center $(h, k) = (${h}, ${k})$ gives numerators $${sqTerm("x", h)}$ and $${sqTerm("y", k)}$. Since $a^{2} = ${a2}$ is on the ${horizontal ? "horizontal" : "vertical"} axis:${steps(
            correct,
          )}`,
          `由中心 $(h, k) = (${h}, ${k})$ 可知分子为 $${sqTerm("x", h)}$ 和 $${sqTerm("y", k)}$。因为半长轴平方 $a^{2} = ${a2}$ 对应${horizontal ? "水平" : "竖直"}方向：${steps(
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "identifying-center-and-vertices",
      title: t("Identifying center and vertices from the equation", "由方程识别中心与顶点"),
      explanation: t(
        "For $\\frac{(x-h)^{2}}{a^{2}} + \\frac{(y-k)^{2}}{b^{2}} = 1$ ($a > b$), the center is $(h, k)$ and the major axis vertices are $(h \\pm a, k)$.\n\nIf the larger denominator is under $y$, the vertices are $(h, k \\pm a)$.",
        "对于 $\\frac{(x-h)^{2}}{a^{2}} + \\frac{(y-k)^{2}}{b^{2}} = 1$（$a > b$），中心为 $(h, k)$，长轴顶点为 $(h \\pm a, k)$。\n\n若较大的分母在 $y$ 下方，则顶点为 $(h, k \\pm a)$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const a = rng.int(4, 10);
        const b = rng.int(2, a - 1);
        const horizontal = rng.bool();
        const a2 = a * a;
        const b2 = b * b;
        const eqStr = ellipseEq(h, k, a2, b2, horizontal);
        const prompt = t(
          `Find the coordinates of the vertices of the ellipse given by the equation $${eqStr}$.`,
          `求椭圆方程 $${eqStr}$ 的长轴两顶点坐标。`,
        );
        const v1 = horizontal ? `(${h - a}, ${k})` : `(${h}, ${k - a})`;
        const v2 = horizontal ? `(${h + a}, ${k})` : `(${h}, ${k + a})`;
        const correct = `${v1} \\text{ and } ${v2}`;
        const distractors = [
          horizontal ? `(${h}, ${k - a}) \\text{ and } (${h}, ${k + a})` : `(${h - a}, ${k}) \\text{ and } (${h + a}, ${k})`,
          horizontal ? `(${h - b}, ${k}) \\text{ and } (${h + b}, ${k})` : `(${h}, ${k - b}) \\text{ and } (${h}, ${k + b})`,
          horizontal ? `(${-h - a}, ${-k}) \\text{ and } (${-h + a}, ${-k})` : `(${-h}, ${-k - a}) \\text{ and } (${-h}, ${-k + a})`,
          `(${h}, ${k})`,
        ];
        const solution = t(
          `The center is $(h, k) = (${h}, ${k})$. The semi-major axis is $a = \\sqrt{${a2}} = ${a}$. Moving $a = ${a}$ units along the ${horizontal ? "horizontal" : "vertical"} axis gives:${steps(
            correct,
          )}`,
          `椭圆中心为 $(h, k) = (${h}, ${k})$，半长轴长 $a = \\sqrt{${a2}} = ${a}$。沿${horizontal ? "水平" : "竖直"}方向移动 $a = ${a}$ 个单位得顶点坐标：${steps(
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const findingTheCenterAndAxesOfEllipsesByCompletingTheSquare: TopicDef = {
  id: "finding-the-center-and-axes-of-ellipses-by-completing-the-square",
  title: t("Finding the Center and Axes of Ellipses by Completing the Square", "配方法求椭圆的中心与半轴长"),
  summary: t(
    "Convert the general quadratic form $Ax^2 + By^2 + Cx + Dy + E = 0$ of an ellipse into standard form by completing the square.",
    "用配方法将椭圆的一般方程 $Ax^2 + By^2 + Cx + Dy + E = 0$ 化为标准方程，确定中心和半轴长。",
  ),
  prerequisites: ["equations-of-ellipses-centered-at-a-general-point", "determining-circle-properties-by-completing-the-square"],
  encompasses: [{ topic: "equations-of-ellipses-centered-at-a-general-point", weight: 0.6 }],
  xp: 14,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "completing-the-square-to-standard-form",
      title: t("Converting general form to standard form", "一般方程化为标准方程"),
      explanation: t(
        "To convert $Ax^{2} + By^{2} + Cx + Dy + E = 0$ to standard form:\n\n1. Group $x$-terms and $y$-terms: $A(x^{2} + \\dots) + B(y^{2} + \\dots) = -E$\n2. Complete the square inside each set of parentheses.\n3. Add the corresponding terms to both sides.\n4. Divide by the constant on the right side to get $1$.",
        "将一般方程 $Ax^{2} + By^{2} + Cx + Dy + E = 0$ 化为标准方程：\n\n1. 分组整理 $x$ 和 $y$ 项：$A(x^{2} + \\dots) + B(y^{2} + \\dots) = -E$\n2. 对括号内分别配方。\n3. 在等式两边加上相应的常数。\n4. 两边同除以右边的常数使右边为 $1$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-4, 4);
        const k = rng.nonZero(-4, 4);
        const pairs = [
          [1, 4, 16],
          [4, 1, 16],
          [1, 9, 36],
          [9, 1, 36],
          [4, 9, 36],
          [9, 4, 36],
          [1, 4, 36],
          [4, 1, 36],
          [2, 3, 24],
          [3, 2, 24],
          [1, 16, 64],
          [16, 1, 64],
        ] as const;
        const [A, B, K] = rng.pick(pairs);
        const C = -2 * A * h;
        const D = -2 * B * k;
        const E = A * h * h + B * k * k - K;
        const a2 = K / A;
        const b2 = K / B;

        let generalStr = `${A === 1 ? "" : A}x^{2} + ${B === 1 ? "" : B}y^{2}`;
        generalStr += C < 0 ? ` - ${-C}x` : ` + ${C}x`;
        generalStr += D < 0 ? ` - ${-D}y` : ` + ${D}y`;
        generalStr += E < 0 ? ` - ${-E}` : ` + ${E}`;
        generalStr += " = 0";

        const prompt = t(`Convert the ellipse equation $${generalStr}$ into standard form.`, `将椭圆方程 $${generalStr}$ 化为标准方程。`);
        const correct = `\\frac{${sqTerm("x", h)}}{${a2}} + \\frac{${sqTerm("y", k)}}{${b2}} = 1`;
        const distractors = [
          `\\frac{${sqTerm("x", -h)}}{${a2}} + \\frac{${sqTerm("y", -k)}}{${b2}} = 1`,
          `\\frac{${sqTerm("x", h)}}{${b2}} + \\frac{${sqTerm("y", k)}}{${a2}} = 1`,
          `\\frac{${sqTerm("x", h)}}{${a2}} - \\frac{${sqTerm("y", k)}}{${b2}} = 1`,
          `\\frac{${sqTerm("x", h)}}{${A}} + \\frac{${sqTerm("y", k)}}{${B}} = 1`,
        ];
        const solution = t(
          `Group and complete the square:${steps(`${A}${sqTerm("x", h)} + ${B}${sqTerm("y", k)} = ${K}`, correct)}`,
          `分组并配方：${steps(`${A}${sqTerm("x", h)} + ${B}${sqTerm("y", k)} = ${K}`, correct)}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "finding-center-and-semi-axes-from-general-form",
      title: t("Finding center and semi-axes from general form", "由一般方程求中心与半轴长"),
      explanation: t(
        "After completing the square, write the equation in standard form $\\frac{(x-h)^{2}}{M} + \\frac{(y-k)^{2}}{N} = 1$. The center is $(h, k)$, the semi-major axis is $\\sqrt{\\max(M, N)}$, and the semi-minor axis is $\\sqrt{\\min(M, N)}$.",
        "配方化为标准方程 $\\frac{(x-h)^{2}}{M} + \\frac{(y-k)^{2}}{N} = 1$ 后，中心为 $(h, k)$，半长轴长为 $\\sqrt{\\max(M, N)}$，半短轴长为 $\\sqrt{\\min(M, N)}$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-4, 4);
        const k = rng.nonZero(-4, 4);
        const pairs = [
          [1, 4, 16],
          [4, 1, 16],
          [1, 9, 36],
          [9, 1, 36],
          [4, 9, 36],
          [9, 4, 36],
          [1, 4, 36],
          [4, 1, 36],
          [1, 16, 64],
          [16, 1, 64],
        ] as const;
        const [A, B, K] = rng.pick(pairs);
        const C = -2 * A * h;
        const D = -2 * B * k;
        const E = A * h * h + B * k * k - K;
        const M = K / A;
        const N = K / B;
        const aVal = Math.round(Math.sqrt(Math.max(M, N)));
        const bVal = Math.round(Math.sqrt(Math.min(M, N)));

        let generalStr = `${A === 1 ? "" : A}x^{2} + ${B === 1 ? "" : B}y^{2}`;
        generalStr += C < 0 ? ` - ${-C}x` : ` + ${C}x`;
        generalStr += D < 0 ? ` - ${-D}y` : ` + ${D}y`;
        generalStr += E < 0 ? ` - ${-E}` : ` + ${E}`;
        generalStr += " = 0";

        const prompt = t(
          `Find the center $(h, k)$ and the semi-major axis $a$ of the ellipse $${generalStr}$.`,
          `求椭圆 $${generalStr}$ 的中心 $(h, k)$ 和半长轴长 $a$。`,
        );
        const correct = `(${h}, ${k}), \\; a = ${aVal}`;
        const distractors = [
          `(${-h}, ${-k}), \\; a = ${aVal}`,
          `(${h}, ${k}), \\; a = ${bVal}`,
          `(${k}, ${h}), \\; a = ${aVal}`,
          `(${h}, ${k}), \\; a = ${Math.max(M, N)}`,
        ];
        const solution = t(
          `Completing the square yields $\\frac{${sqTerm("x", h)}}{${M}} + \\frac{${sqTerm("y", k)}}{${N}} = 1$. The center is $(${h}, ${k})$ and $a = \\sqrt{${Math.max(M, N)}} = ${aVal}$.`,
          `配方得到 $\\frac{${sqTerm("x", h)}}{${M}} + \\frac{${sqTerm("y", k)}}{${N}} = 1$。中心为 $(${h}, ${k})$，半长轴长 $a = \\sqrt{${Math.max(M, N)}} = ${aVal}$。`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const findingInterceptsOfEllipses: TopicDef = {
  id: "finding-intercepts-of-ellipses",
  title: t("Finding Intercepts of Ellipses", "求椭圆的坐标轴截距"),
  summary: t(
    "Find the x-intercepts and y-intercepts of an ellipse by substituting $y = 0$ and $x = 0$.",
    "通过令 $y = 0$ 和 $x = 0$ 求解椭圆在坐标轴上的截距。",
  ),
  prerequisites: ["equations-of-ellipses-centered-at-a-general-point"],
  encompasses: [{ topic: "equations-of-ellipses-centered-at-a-general-point", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "finding-x-intercepts-of-an-ellipse",
      title: t("Finding x-intercepts of an ellipse", "求椭圆的 x 轴截距"),
      explanation: t(
        "To find the $x$-intercepts of an ellipse, set $y = 0$ and solve for $x$.\n\nFor $\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1$, setting $y = 0$ yields $x^{2} = a^{2} \\implies x = \\pm a$, giving points $(\\pm a, 0)$.",
        "求椭圆的 $x$ 轴截距，令 $y = 0$ 并求解 $x$。\n\n对于 $\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1$，令 $y = 0$ 得到 $x^{2} = a^{2} \\implies x = \\pm a$，即截距点为 $(\\pm a, 0)$。",
      ),
      generate(rng) {
        const a = rng.int(3, 15);
        const b = rng.int(2, a + 4);
        const a2 = a * a;
        const b2 = b * b;
        const h = rng.pick([0, 0, rng.int(-4, 4)]);
        const eqStr =
          h === 0 ? `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1` : `\\frac{${sqTerm("x", h)}}{${a2}} + \\frac{y^{2}}{${b2}} = 1`;
        const prompt = t(`Find the $x$-intercepts of the ellipse given by $${eqStr}$.`, `求椭圆 $${eqStr}$ 的 $x$ 轴截距点坐标。`);
        const x1 = h - a;
        const x2 = h + a;
        const correct = h === 0 ? `(\\pm ${a}, 0)` : `(${x1}, 0) \\text{ and } (${x2}, 0)`;
        const distractors = [
          h === 0 ? `(0, \\pm ${b})` : `(0, ${x1}) \\text{ and } (0, ${x2})`,
          h === 0 ? `(\\pm ${b}, 0)` : `(${x1 + 1}, 0) \\text{ and } (${x2 + 1}, 0)`,
          h === 0 ? `(\\pm ${a2}, 0)` : `(${h - b}, 0) \\text{ and } (${h + b}, 0)`,
          `(0, 0)`,
        ];
        const solution = t(
          `Set $y = 0$ in the equation:${steps(
            `\\frac{${sqTerm("x", h)}}{${a2}} = 1 \\implies ${sqTerm("x", h)} = ${a2} \\implies ${linTerm("x", h)} = \\pm ${a}`,
            correct,
          )}`,
          `在方程中令 $y = 0$：${steps(
            `\\frac{${sqTerm("x", h)}}{${a2}} = 1 \\implies ${sqTerm("x", h)} = ${a2} \\implies ${linTerm("x", h)} = \\pm ${a}`,
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "finding-y-intercepts-of-an-ellipse",
      title: t("Finding y-intercepts of an ellipse", "求椭圆的 y 轴截距"),
      explanation: t(
        "To find the $y$-intercepts of an ellipse, set $x = 0$ and solve for $y$.\n\nFor $\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1$, setting $x = 0$ yields $y^{2} = b^{2} \\implies y = \\pm b$, giving points $(0, \\pm b)$.",
        "求椭圆的 $y$ 轴截距，令 $x = 0$ 并求解 $y$。\n\n对于 $\\frac{x^{2}}{a^{2}} + \\frac{y^{2}}{b^{2}} = 1$，令 $x = 0$ 得到 $y^{2} = b^{2} \\implies y = \\pm b$，即截距点为 $(0, \\pm b)$。",
      ),
      generate(rng) {
        const a = rng.int(3, 15);
        const b = rng.int(2, a + 4);
        const a2 = a * a;
        const b2 = b * b;
        const k = rng.pick([0, 0, rng.int(-4, 4)]);
        const eqStr =
          k === 0 ? `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1` : `\\frac{x^{2}}{${a2}} + \\frac{${sqTerm("y", k)}}{${b2}} = 1`;
        const prompt = t(`Find the $y$-intercepts of the ellipse given by $${eqStr}$.`, `求椭圆 $${eqStr}$ 的 $y$ 轴截距点坐标。`);
        const y1 = k - b;
        const y2 = k + b;
        const correct = k === 0 ? `(0, \\pm ${b})` : `(0, ${y1}) \\text{ and } (0, ${y2})`;
        const distractors = [
          k === 0 ? `(\\pm ${a}, 0)` : `(${y1}, 0) \\text{ and } (${y2}, 0)`,
          k === 0 ? `(0, \\pm ${a})` : `(0, ${y1 + 1}) \\text{ and } (0, ${y2 + 1})`,
          k === 0 ? `(0, \\pm ${b2})` : `(0, ${k - a}) \\text{ and } (0, ${k + a})`,
          `(0, 0)`,
        ];
        const solution = t(
          `Set $x = 0$ in the equation:${steps(
            `\\frac{${sqTerm("y", k)}}{${b2}} = 1 \\implies ${sqTerm("y", k)} = ${b2} \\implies ${linTerm("y", k)} = \\pm ${b}`,
            correct,
          )}`,
          `在方程中令 $x = 0$：${steps(
            `\\frac{${sqTerm("y", k)}}{${b2}} = 1 \\implies ${sqTerm("y", k)} = ${b2} \\implies ${linTerm("y", k)} = \\pm ${b}`,
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const findingIntersectionsOfEllipsesAndLines: TopicDef = {
  id: "finding-intersections-of-ellipses-and-lines",
  title: t("Finding Intersections of Ellipses and Lines", "椭圆与直线的交点"),
  summary: t(
    "Determine the points of intersection between an ellipse and a line by solving a system of equations, and use the discriminant to determine tangency or intersection.",
    "通过联立方程组求解椭圆与直线的交点坐标，并利用判别式判断相交、相切或相离。",
  ),
  prerequisites: ["finding-intercepts-of-ellipses"],
  encompasses: [{ topic: "finding-intercepts-of-ellipses", weight: 0.5 }],
  xp: 14,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "number-of-intersection-points",
      title: t("Number of intersections of an ellipse and a line", "椭圆与直线交点的个数"),
      explanation: t(
        "Substituting the linear equation $y = mx + d$ or $x = c$ into the ellipse equation produces a quadratic equation $Ax^{2} + Bx + C = 0$.\n\nThe discriminant $\\Delta = B^{2} - 4AC$ reveals:\n- $\\Delta > 0$: $2$ intersection points (secant line)\n- $\\Delta = 0$: $1$ intersection point (tangent line)\n- $\\Delta < 0$: $0$ intersection points",
        "将直线方程 $y = mx + d$ 或 $x = c$ 代入椭圆方程，得到一元二次方程 $Ax^{2} + Bx + C = 0$。\n\n判别式 $\\Delta = B^{2} - 4AC$ 决定交点个数：\n- $\\Delta > 0$：$2$ 个交点（割线）\n- $\\Delta = 0$：$1$ 个交点（切线）\n- $\\Delta < 0$：$0$ 个交点（相离）",
      ),
      generate(rng) {
        const a = rng.int(4, 12);
        const b = rng.int(3, 10);
        const a2 = a * a;
        const b2 = b * b;
        const kind = rng.pick(["secant", "tangent", "exterior"]);
        let cVal = 0;
        let expectedCount = 2;
        if (kind === "secant") {
          cVal = rng.int(1, b - 1);
          expectedCount = 2;
        } else if (kind === "tangent") {
          cVal = b;
          expectedCount = 1;
        } else {
          cVal = b + rng.int(1, 5);
          expectedCount = 0;
        }
        const prompt = t(
          `How many points of intersection exist between the ellipse $\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1$ and the horizontal line $y = ${cVal}$?`,
          `椭圆 $\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1$ 与水平直线 $y = ${cVal}$ 有几个交点？`,
        );
        const correct = `${expectedCount}`;
        const distractors = ["0", "1", "2", "3"].filter((s) => s !== correct);
        const solution = t(
          `Substituting $y = ${cVal}$ gives $\\frac{x^{2}}{${a2}} + \\frac{${cVal * cVal}}{${b2}} = 1 \\implies \\frac{x^{2}}{${a2}} = 1 - \\frac{${cVal * cVal}}{${b2}}$. Since the right side is ${expectedCount === 2 ? "positive" : expectedCount === 1 ? "zero" : "negative"}, there are $${expectedCount}$ intersection point(s).`,
          `代入 $y = ${cVal}$ 得到 $\\frac{x^{2}}{${a2}} + \\frac{${cVal * cVal}}{${b2}} = 1 \\implies \\frac{x^{2}}{${a2}} = 1 - \\frac{${cVal * cVal}}{${b2}}$。因为右边${expectedCount === 2 ? "大于 0" : expectedCount === 1 ? "等于 0" : "小于 0"}，所以有 $${expectedCount}$ 个交点。`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "coordinates-of-intersection-points",
      title: t("Finding coordinates of intersection points", "求椭圆与直线的交点坐标"),
      explanation: t(
        "To find the intersection points, substitute the line's variable into the ellipse equation, solve for the remaining variable, and substitute back to obtain both coordinates $(x, y)$.",
        "求交点坐标时，将直线方程代入椭圆方程，求解剩余未知数，再回代得到所有交点坐标 $(x, y)$。",
      ),
      generate(rng) {
        // Choose Pythagorean ratio for clean values: e.g. x/a = 3/5 => y/b = 4/5
        const triple = rng.pick(pythTriples);
        const [k1, k2, m] = triple;
        const mult = rng.int(1, 3);
        const a = m * mult;
        const b = rng.int(2, 8);
        const xVal = k1 * mult;
        const yVal = Q.of(k2 * b, m);
        const a2 = a * a;
        const b2 = b * b;
        const prompt = t(
          `Find the intersection points of the ellipse $\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1$ and the vertical line $x = ${xVal}$.`,
          `求椭圆 $\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1$ 与竖直直线 $x = ${xVal}$ 的交点坐标。`,
        );
        const yTex = yVal.isInteger() ? `${yVal.abs().toLatex()}` : `${yVal.abs().toLatex()}`;
        const correct = `(${xVal}, \\pm ${yTex})`;
        const distractors = [`(\\pm ${xVal}, ${yTex})`, `(${xVal}, \\pm ${b})`, `(${xVal}, 0)`, `(\\pm ${a}, 0)`];
        const solution = t(
          `Substitute $x = ${xVal}$ into the ellipse equation:${steps(
            `\\frac{${xVal * xVal}}{${a2}} + \\frac{y^{2}}{${b2}} = 1 \\implies \\frac{y^{2}}{${b2}} = 1 - \\frac{${k1 * k1}}{${m * m}} = \\frac{${k2 * k2}}{${m * m}}`,
            `y = \\pm ${yTex}`,
            `\\text{Points: } (${xVal}, \\pm ${yTex})`,
          )}`,
          `将 $x = ${xVal}$ 代入椭圆方程：${steps(
            `\\frac{${xVal * xVal}}{${a2}} + \\frac{y^{2}}{${b2}} = 1 \\implies \\frac{y^{2}}{${b2}} = 1 - \\frac{${k1 * k1}}{${m * m}} = \\frac{${k2 * k2}}{${m * m}}`,
            `y = \\pm ${yTex}`,
            `\\text{交点坐标：} (${xVal}, \\pm ${yTex})`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const fociOfEllipses: TopicDef = {
  id: "foci-of-ellipses",
  title: t("Foci of Ellipses", "椭圆的焦点坐标与焦距"),
  summary: t(
    "Calculate the focal distance using $c^2 = a^2 - b^2$ and find the coordinates of the foci for both origin-centered and shifted ellipses.",
    "利用焦半径关系 $c^2 = a^2 - b^2$ 计算焦距，并确定中心在原点及平移后椭圆的焦点坐标。",
  ),
  prerequisites: ["equations-of-ellipses-centered-at-the-origin"],
  encompasses: [{ topic: "equations-of-ellipses-centered-at-the-origin", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "foci-of-ellipses-at-the-origin",
      title: t("Foci of ellipses centered at the origin", "中心在原点的椭圆焦点"),
      explanation: t(
        "The focal distance $c$ from the center to each focus satisfies:\n\n$$c^{2} = a^{2} - b^{2} \\implies c = \\sqrt{a^{2} - b^{2}}$$\n\n- Horizontal major axis: foci at $(\\pm c, 0)$\n- Vertical major axis: foci at $(0, \\pm c)$",
        "中心到焦点的焦距 $c$ 满足关系：\n\n$$c^{2} = a^{2} - b^{2} \\implies c = \\sqrt{a^{2} - b^{2}}$$\n\n- 长轴水平：焦点为 $(\\pm c, 0)$\n- 长轴竖直：焦点为 $(0, \\pm c)$",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [b, c, a] = triple;
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1` : `\\frac{x^{2}}{${b2}} + \\frac{y^{2}}{${a2}} = 1`;
        const prompt = t(`Find the coordinates of the foci of the ellipse $${eqStr}$.`, `求椭圆 $${eqStr}$ 的焦点坐标。`);
        const correct = horizontal ? `(\\pm ${c}, 0)` : `(0, \\pm ${c})`;
        const distractors = [
          horizontal ? `(0, \\pm ${c})` : `(\\pm ${c}, 0)`,
          horizontal ? `(\\pm ${a}, 0)` : `(0, \\pm ${a})`,
          horizontal ? `(0, \\pm ${b})` : `(\\pm ${b}, 0)`,
          `(\\pm ${a + b}, 0)`,
        ];
        const solution = t(
          `Calculate $c^{2} = a^{2} - b^{2} = ${a2} - ${b2} = ${c * c} \\implies c = ${c}$. Since the major axis is ${horizontal ? "horizontal" : "vertical"}, the foci are $${correct}$.`,
          `计算 $c^{2} = a^{2} - b^{2} = ${a2} - ${b2} = ${c * c} \\implies c = ${c}$。因为长轴为${horizontal ? "水平" : "竖直"}方向，所以焦点坐标为 $${correct}$。`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "foci-of-shifted-ellipses",
      title: t("Foci of translated ellipses", "平移椭圆的焦点坐标"),
      explanation: t(
        "For an ellipse with center $(h, k)$ and focal distance $c = \\sqrt{a^{2} - b^{2}}$:\n\n- Horizontal major axis: foci at $(h \\pm c, k)$\n- Vertical major axis: foci at $(h, k \\pm c)$",
        "对于中心在 $(h, k)$、半焦距为 $c = \\sqrt{a^{2} - b^{2}}$ 的平移椭圆：\n\n- 长轴水平：焦点为 $(h \\pm c, k)$\n- 长轴竖直：焦点为 $(h, k \\pm c)$",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [b, c, a] = triple;
        const a2 = a * a;
        const b2 = b * b;
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const horizontal = rng.bool();
        const eqStr = ellipseEq(h, k, a2, b2, horizontal);
        const prompt = t(`Find the coordinates of the foci of the ellipse $${eqStr}$.`, `求椭圆 $${eqStr}$ 的焦点坐标。`);
        const f1 = horizontal ? `(${h - c}, ${k})` : `(${h}, ${k - c})`;
        const f2 = horizontal ? `(${h + c}, ${k})` : `(${h}, ${k + c})`;
        const correct = `${f1} \\text{ and } ${f2}`;
        const distractors = [
          horizontal ? `(${h}, ${k - c}) \\text{ and } (${h}, ${k + c})` : `(${h - c}, ${k}) \\text{ and } (${h + c}, ${k})`,
          horizontal ? `(${h - a}, ${k}) \\text{ and } (${h + a}, ${k})` : `(${h}, ${k - a}) \\text{ and } (${h}, ${k + a})`,
          horizontal ? `(\\pm ${c}, 0)` : `(0, \\pm ${c})`,
          `(${h}, ${k})`,
        ];
        const solution = t(
          `The center is $(${h}, ${k})$ and $c = \\sqrt{${a2} - ${b2}} = ${c}$. Adding $\\pm ${c}$ along the ${horizontal ? "x" : "y"}-coordinate gives:${steps(
            correct,
          )}`,
          `椭圆中心为 $(${h}, ${k})$，半焦距 $c = \\sqrt{${a2} - ${b2}} = ${c}$。沿 ${horizontal ? "x" : "y"} 坐标方向移动 $\\pm ${c}$：${steps(
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const verticesAndEccentricityOfEllipses: TopicDef = {
  id: "vertices-and-eccentricity-of-ellipses",
  title: t("Vertices and Eccentricity of Ellipses", "椭圆的顶点与离心率"),
  summary: t(
    "Define the eccentricity of an ellipse as $e = c/a$ ($0 < e < 1$) and relate it to the elongation of the ellipse.",
    "理解椭圆离心率的定义 $e = c/a$ ($0 < e < 1$) 及其对椭圆扁平程度的描述。",
  ),
  prerequisites: ["foci-of-ellipses"],
  encompasses: [{ topic: "foci-of-ellipses", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "calculating-eccentricity",
      title: t("Calculating the eccentricity of an ellipse", "计算椭圆的离心率"),
      explanation: t(
        "The eccentricity $e$ of an ellipse is the ratio of focal distance $c$ to semi-major axis $a$:\n\n$$e = \\frac{c}{a} = \\frac{\\sqrt{a^{2} - b^{2}}}{a}$$\n\nFor any ellipse, $0 < e < 1$.",
        "椭圆的离心率 $e$ 是半焦距 $c$ 与半长轴 $a$ 的比值：\n\n$$e = \\frac{c}{a} = \\frac{\\sqrt{a^{2} - b^{2}}}{a}$$\n\n对任意椭圆，恒有 $0 < e < 1$。",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [b, c, a] = triple;
        const mult = rng.int(1, 3);
        const A = a * mult;
        const B = b * mult;
        const C = c * mult;
        const a2 = A * A;
        const b2 = B * B;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1` : `\\frac{x^{2}}{${b2}} + \\frac{y^{2}}{${a2}} = 1`;
        const eFrac = Q.of(C, A);
        const prompt = t(`Calculate the eccentricity of the ellipse $${eqStr}$.`, `计算椭圆 $${eqStr}$ 的离心率。`);
        const correct = eFrac.toLatex();
        const distractors = [Q.of(B, A).toLatex(), Q.of(A, C).toLatex(), Q.of(C, B).toLatex(), Q.of(B, C).toLatex()];
        const solution = t(
          `Semi-major axis $a = ${A}$, semi-minor axis $b = ${B}$. First find $c = \\sqrt{${a2} - ${b2}} = ${C}$. Then:${steps(
            `e = \\frac{c}{a} = \\frac{${C}}{${A}} = ${correct}`,
          )}`,
          `半长轴 $a = ${A}$，半短轴 $b = ${B}$。先求半焦距 $c = \\sqrt{${a2} - ${b2}} = ${C}$，再求离心率：${steps(
            `e = \\frac{c}{a} = \\frac{${C}}{${A}} = ${correct}`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "geometric-meaning-of-eccentricity",
      title: t("Geometric meaning of eccentricity", "离心率的几何意义"),
      explanation: t(
        "Eccentricity describes the roundness or elongation of an ellipse:\n\n- As $e \\to 0$, $c \\to 0$ and $b \\to a$, so the ellipse is nearly a circle.\n- As $e \\to 1$, $c \\to a$ and $b \\to 0$, so the ellipse is very long and narrow (highly elongated).",
        "离心率描述了椭圆的圆润或扁平程度：\n\n- 当 $e \\to 0$ 时，$c \\to 0$ 且 $b \\to a$，椭圆接近圆。\n- 当 $e \\to 1$ 时，$c \\to a$ 且 $b \\to 0$，椭圆变得非常狭长（扁平）。",
      ),
      generate(rng) {
        const num1 = rng.int(10, 45);
        const num2 = rng.int(55, 95);
        const aIsHigher = rng.bool();
        const valA = aIsHigher ? num2 : num1;
        const valB = aIsHigher ? num1 : num2;
        const eA = (valA / 100).toFixed(2);
        const eB = (valB / 100).toFixed(2);
        const prompt = t(
          `Ellipse $A$ has eccentricity $e = ${eA}$ and Ellipse $B$ has eccentricity $e = ${eB}$. Which statement correctly compares their shapes?`,
          `椭圆 $A$ 的离心率为 $e = ${eA}$，椭圆 $B$ 的离心率为 $e = ${eB}$。下列哪个选项正确比较了它们的形状？`,
        );
        const correct = aIsHigher
          ? t(
              "Ellipse A is more elongated (flatter), while Ellipse B is closer to a circle.",
              "椭圆 A 更加狭长（扁平），而椭圆 B 更接近圆。",
            )
          : t(
              "Ellipse B is more elongated (flatter), while Ellipse A is closer to a circle.",
              "椭圆 B 更加狭长（扁平），而椭圆 A 更接近圆。",
            );
        const distractors = [
          aIsHigher
            ? t(
                "Ellipse B is more elongated (flatter), while Ellipse A is closer to a circle.",
                "椭圆 B 更加狭长（扁平），而椭圆 A 更接近圆。",
              )
            : t(
                "Ellipse A is more elongated (flatter), while Ellipse B is closer to a circle.",
                "椭圆 A 更加狭长（扁平），而椭圆 B 更接近圆。",
              ),
          t("Both ellipses have the exact same shape.", "两椭圆的形状完全相同。"),
          t("The ellipse with lower eccentricity is more elongated.", "离心率较低的椭圆更加扁长。"),
        ];
        const solution = t(
          `A higher eccentricity value closer to $1$ means the ellipse is more elongated, while a value closer to $0$ is more circular. Since $${aIsHigher ? eA : eB} > ${aIsHigher ? eB : eA}$, Ellipse $${aIsHigher ? "A" : "B"}$ is more elongated.`,
          `离心率越接近 $1$，椭圆越扁长；离心率越接近 $0$，椭圆越接近圆。因为 $${aIsHigher ? eA : eB} > ${aIsHigher ? eB : eA}$，所以椭圆 $${aIsHigher ? "A" : "B"}$ 更狭长。`,
        );
        return makeChoiceTexts(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const directricesOfEllipses: TopicDef = {
  id: "directrices-of-ellipses",
  title: t("Directrices of Ellipses", "椭圆的准线方程"),
  summary: t(
    "Find the equations of the directrices of an ellipse ($x = \\pm a^2/c$ or $y = \\pm a^2/c$) and understand the focus-directrix definition.",
    "求椭圆的准线方程（x = ±a²/c 或 y = ±a²/c），理解椭圆的焦点-准线定义。",
  ),
  prerequisites: ["vertices-and-eccentricity-of-ellipses"],
  encompasses: [{ topic: "vertices-and-eccentricity-of-ellipses", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "equations-of-directrices-at-origin",
      title: t("Equations of directrices for an ellipse centered at the origin", "中心在原点的椭圆准线方程"),
      explanation: t(
        "An ellipse has two directrix lines perpendicular to the major axis:\n\n- Horizontal major axis: $x = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$\n- Vertical major axis: $y = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$",
        "椭圆有两条垂直于长轴的准线：\n\n- 长轴水平：$x = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$\n- 长轴竖直：$y = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [b, c, a] = triple;
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1` : `\\frac{x^{2}}{${b2}} + \\frac{y^{2}}{${a2}} = 1`;
        const prompt = t(`Find the equations of the directrices of the ellipse $${eqStr}$.`, `求椭圆 $${eqStr}$ 的准线方程。`);
        const valStr = pmFrac(a2, c);
        const wrongVal1 = pmFrac(b2, c);
        const wrongVal2 = pmFrac(c * c, a);
        const correct = `${horizontal ? "x" : "y"} = ${valStr}`;
        const distractors = [
          `${horizontal ? "y" : "x"} = ${valStr}`,
          `${horizontal ? "x" : "y"} = ${wrongVal1}`,
          `${horizontal ? "x" : "y"} = ${wrongVal2}`,
        ];
        const solution = t(
          `Here $a = ${a}, a^{2} = ${a2}, c = \\sqrt{${a2} - ${b2}} = ${c}$. The directrices are:${steps(
            `${horizontal ? "x" : "y"} = \\pm \\frac{a^{2}}{c} = ${valStr}`,
          )}`,
          `此处 $a = ${a}, a^{2} = ${a2}, c = \\sqrt{${a2} - ${b2}} = ${c}$。准线方程为：${steps(
            `${horizontal ? "x" : "y"} = \\pm \\frac{a^{2}}{c} = ${valStr}`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "focus-directrix-ratio",
      title: t("The focus-directrix property of an ellipse", "椭圆的第二定义（焦点-准线性质）"),
      explanation: t(
        "By the focus-directrix definition, an ellipse is the locus of points $P$ such that the ratio of the distance to a focus $F$ to the distance to the corresponding directrix $\\ell$ is constant and equals the eccentricity $e$:\n\n$$\\frac{PF}{d(P, \\ell)} = e < 1 \\implies PF = e \\cdot d(P, \\ell)$$",
        "根据椭圆的第二定义，椭圆是到焦点 $F$ 的距离与到对应准线 $\\ell$ 的距离之比等于离心率 $e$ 的点的轨迹：\n\n$$\\frac{PF}{d(P, \\ell)} = e < 1 \\implies PF = e \\cdot d(P, \\ell)$$",
      ),
      generate(rng) {
        const eNumerator = rng.pick([1, 2, 3, 4]);
        const eDenominator = eNumerator + rng.int(1, 3);
        const e = Q.of(eNumerator, eDenominator);
        const mult = rng.int(2, 6);
        const distDirectrix = eDenominator * mult;
        const distFocus = eNumerator * mult;
        const prompt = t(
          `A point $P$ lies on an ellipse with eccentricity $e = ${e.toLatex()}$. If the distance from $P$ to the directrix is $${distDirectrix}$, what is the distance from $P$ to the corresponding focus?`,
          `点 $P$ 位于离心率 $e = ${e.toLatex()}$ 的椭圆上。如果点 $P$ 到准线的距离为 $${distDirectrix}$，那么点 $P$ 到对应焦点的距离是多少？`,
        );
        const correct = `${distFocus}`;
        const distractors = [
          `${distDirectrix}`,
          `${distDirectrix - distFocus}`,
          `${Math.round((distDirectrix * eDenominator) / eNumerator)}`,
          `${distFocus + 2}`,
        ];
        const solution = t(
          `Using the focus-directrix property $PF = e \\cdot d(P, \\ell)$:${steps(
            `PF = ${e.toLatex()} \\times ${distDirectrix} = ${distFocus}`,
          )}`,
          `利用焦点-准线性质 $PF = e \\cdot d(P, \\ell)$：${steps(`PF = ${e.toLatex()} \\times ${distDirectrix} = ${distFocus}`)}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const theAreaOfAnEllipse: TopicDef = {
  id: "the-area-of-an-ellipse",
  title: t("The Area of an Ellipse", "椭圆的面积"),
  summary: t(
    "Calculate the area of an ellipse using the formula $A = \\pi a b$ and compare it to the area of a circle.",
    "利用公式 A = πab 计算椭圆面积，并与圆的面积公式进行对比。",
  ),
  prerequisites: ["equations-of-ellipses-centered-at-the-origin"],
  encompasses: [{ topic: "equations-of-ellipses-centered-at-the-origin", weight: 0.5 }],
  xp: 10,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "calculating-the-area-of-an-ellipse",
      title: t("Calculating the area of an ellipse", "计算椭圆的面积"),
      explanation: t(
        "The area $A$ of an ellipse with semi-major axis $a$ and semi-minor axis $b$ is given by:\n\n$$A = \\pi a b$$\n\nWhen $a = b = r$, this simplifies to the area of a circle, $A = \\pi r^{2}$.",
        "半长轴为 $a$、半短轴为 $b$ 的椭圆面积 $A$ 计算公式为：\n\n$$A = \\pi a b$$\n\n当 $a = b = r$ 时，该公式退化为圆的面积公式 $A = \\pi r^{2}$。",
      ),
      generate(rng) {
        const a = rng.int(3, 14);
        const b = rng.int(2, a - 1);
        const a2 = a * a;
        const b2 = b * b;
        const areaCoef = a * b;
        const prompt = t(
          `Find the exact area enclosed by the ellipse $\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1$.`,
          `求椭圆 $\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1$ 所围成的精确面积。`,
        );
        const correct = `${areaCoef}\\pi`;
        const distractors = [`${2 * areaCoef}\\pi`, `${a + b}\\pi`, `${a2 * b2}\\pi`, `${a2 + b2}\\pi`];
        const solution = t(
          `Identify $a = \\sqrt{${a2}} = ${a}$ and $b = \\sqrt{${b2}} = ${b}$. The area is:${steps(
            `A = \\pi a b = \\pi (${a})(${b}) = ${areaCoef}\\pi`,
          )}`,
          `识别出 $a = \\sqrt{${a2}} = ${a}$，$b = \\sqrt{${b2}} = ${b}$。面积为：${steps(
            `A = \\pi a b = \\pi (${a})(${b}) = ${areaCoef}\\pi`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "scaling-relation-and-missing-semi-axis",
      title: t("Scaling relation and finding a missing semi-axis", "面积伸缩关系与求未知半轴长"),
      explanation: t(
        "Because an ellipse is obtained by scaling a unit circle horizontally by $a$ and vertically by $b$, its area is $\\pi \\cdot a \\cdot b$.\n\nIf the area $A$ and one semi-axis $a$ are known, the other semi-axis is $b = \\frac{A}{\\pi a}$.",
        "因为椭圆可以看作单位圆沿水平方向伸缩 $a$ 倍、竖直方向伸缩 $b$ 倍得到，所以其面积为 $\\pi \\cdot a \\cdot b$。\n\n已知面积 $A$ 和一个半轴长 $a$，可求得另一个半轴长 $b = \\frac{A}{\\pi a}$。",
      ),
      generate(rng) {
        const a = rng.int(3, 12);
        const b = rng.int(2, a - 1);
        const areaCoef = a * b;
        const prompt = t(
          `The area of an ellipse is $${areaCoef}\\pi$. If the length of its semi-major axis is $a = ${a}$, what is the length of its semi-minor axis $b$?`,
          `已知一个椭圆的面积为 $${areaCoef}\\pi$。如果其半长轴长为 $a = ${a}$，那么半短轴长 $b$ 是多少？`,
        );
        const correct = `${b}`;
        const distractors = [`${a}`, `${areaCoef}`, `${b + 1}`, `${Math.abs(a - b) || 1}`];
        const solution = t(
          `Using the area formula $A = \\pi a b$:${steps(
            `${areaCoef}\\pi = \\pi (${a}) b \\implies b = \\frac{${areaCoef}}{${a}} = ${b}`,
          )}`,
          `根据面积公式 $A = \\pi a b$：${steps(`${areaCoef}\\pi = \\pi (${a}) b \\implies b = \\frac{${areaCoef}}{${a}} = ${b}`)}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

// ===========================================================================
// Module 7.27. Hyperbolas as Conic Sections (Topics 11 - 20)
// ===========================================================================

export const equationsOfHyperbolasCenteredAtTheOrigin: TopicDef = {
  id: "equations-of-hyperbolas-centered-at-the-origin",
  title: t("Equations of Hyperbolas Centered at the Origin", "中心在原点的双曲线标准方程"),
  summary: t(
    "Identify and write standard equations of hyperbolas centered at the origin, distinguishing horizontal and vertical orientations and applying the focal property $|d_1 - d_2| = 2a$.",
    "识别并写出中心在原点的双曲线标准方程，区分焦点在 x 轴或 y 轴上的情况，应用定义 |d1 - d2| = 2a。",
  ),
  prerequisites: ["equations-of-ellipses-centered-at-the-origin"],
  encompasses: [{ topic: "equations-of-ellipses-centered-at-the-origin", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "geometric-definition-of-a-hyperbola",
      title: t("Geometric definition of a hyperbola", "双曲线的几何定义"),
      explanation: t(
        "A hyperbola is the set of all points $P$ in a plane such that the absolute difference of the distances from $P$ to two fixed foci $F_{1}$ and $F_{2}$ is constant and equal to $2a$:\n\n$$|PF_{1} - PF_{2}| = 2a \\quad (0 < 2a < F_{1}F_{2})$$\n\nIf $PF_{1} = d_{1}$, then $PF_{2} = d_{1} + 2a$ or $PF_{2} = |d_{1} - 2a|$.",
        "双曲线是平面内到两定点（焦点 $F_{1}, F_{2}$）的距离差的绝对值为定值 $2a$ 的点的集合：\n\n$$|PF_{1} - PF_{2}| = 2a \\quad (0 < 2a < F_{1}F_{2})$$\n\n若点 $P$ 到一个焦点的距离为 $d_{1}$，则到另一个焦点的距离为 $d_{1} + 2a$ 或 $|d_{1} - 2a|$。",
      ),
      generate(rng) {
        const a = rng.int(3, 10);
        const twoA = 2 * a;
        const d1 = rng.int(2, 16);
        const d2 = d1 + twoA;
        const prompt = t(
          `A hyperbola is defined such that the absolute difference of the distances from any point on it to the foci $F_{1}$ and $F_{2}$ is $${twoA}$. If a point $P$ on the hyperbola has $PF_{1} = ${d1}$, which of the following could be the distance $PF_{2}$?`,
          `已知双曲线上任意一点到两焦点 $F_{1}, F_{2}$ 的距离之差的绝对值为 $${twoA}$。如果双曲线上某点 $P$ 到焦点 $F_{1}$ 的距离为 $PF_{1} = ${d1}$，那么距离 $PF_{2}$ 可能为下列哪个值？`,
        );
        const correct = `${d2}`;
        const distractors = [`${d1}`, `${Math.abs(d1 - a) || d1 + a + 1}`, `${twoA}`, `${d1 + a}`];
        const solution = t(
          `By the definition $|PF_{1} - PF_{2}| = ${twoA}$, we have $PF_{2} = PF_{1} + ${twoA} = ${d1} + ${twoA} = ${d2}$.`,
          `根据定义 $|PF_{1} - PF_{2}| = ${twoA}$，可知 $PF_{2} = PF_{1} + ${twoA} = ${d1} + ${twoA} = ${d2}$。`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "standard-equations-of-hyperbolas-at-origin",
      title: t("Standard equations of hyperbolas centered at the origin", "中心在原点的双曲线标准方程"),
      explanation: t(
        "For a hyperbola centered at the origin:\n\n- Horizontal (opens left/right, vertices at $(\\pm a, 0)$):\n$$\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$$\n\n- Vertical (opens up/down, vertices at $(0, \\pm a)$):\n$$\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 1$$\n\nThe positive term indicates the axis containing the vertices.",
        "中心在原点的双曲线标准方程：\n\n- 水平方向（开口朝左右，顶点为 $(\\pm a, 0)$）：\n$$\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$$\n\n- 竖直方向（开口朝上下，顶点为 $(0, \\pm a)$）：\n$$\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 1$$\n\n符号为正的项决定了顶点所在的坐标轴。",
      ),
      generate(rng) {
        const a = rng.int(2, 10);
        const b = rng.int(2, 10);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const prompt = horizontal
          ? t(
              `Write the standard equation of the hyperbola centered at $(0, 0)$ with vertices at $(\\pm ${a}, 0)$ and $b = ${b}$.`,
              `写出中心在 $(0, 0)$、顶点为 $(\\pm ${a}, 0)$ 且 $b = ${b}$ 的双曲线标准方程。`,
            )
          : t(
              `Write the standard equation of the hyperbola centered at $(0, 0)$ with vertices at $(0, \\pm ${a})$ and $b = ${b}$.`,
              `写出中心在 $(0, 0)$、顶点为 $(0, \\pm ${a})$ 且 $b = ${b}$ 的双曲线标准方程。`,
            );
        const correct = horizontal ? `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1` : `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`;
        const distractors = [
          horizontal ? `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1` : `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1`,
          `\\frac{x^{2}}{${a2}} + \\frac{y^{2}}{${b2}} = 1`,
          horizontal ? `\\frac{x^{2}}{${b2}} - \\frac{y^{2}}{${a2}} = 1` : `\\frac{y^{2}}{${b2}} - \\frac{x^{2}}{${a2}} = 1`,
        ];
        const solution = t(
          `Since the vertices are on the ${horizontal ? "x" : "y"}-axis, the positive term is ${horizontal ? "x^{2}" : "y^{2}"} with denominator $a^{2} = ${a2}$:${steps(
            correct,
          )}`,
          `因为顶点在 ${horizontal ? "x" : "y"} 轴上，所以正项是 ${horizontal ? "x^{2}" : "y^{2}"}，分母为 $a^{2} = ${a2}$：${steps(
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const equationsOfHyperbolasCenteredAtAGeneralPoint: TopicDef = {
  id: "equations-of-hyperbolas-centered-at-a-general-point",
  title: t("Equations of Hyperbolas Centered at a General Point", "中心在任意点 (h, k) 的双曲线标准方程"),
  summary: t(
    "Write and analyze equations of translated hyperbolas with center $(h, k)$, identifying their centers and vertices.",
    "写出并分析中心在 $(h, k)$ 的平移双曲线标准方程，识别其中心和顶点坐标。",
  ),
  prerequisites: ["equations-of-hyperbolas-centered-at-the-origin"],
  encompasses: [{ topic: "equations-of-hyperbolas-centered-at-the-origin", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "standard-form-with-center-h-k-hyperbola",
      title: t("Standard form of a translated hyperbola", "平移双曲线的标准方程"),
      explanation: t(
        "For a hyperbola centered at $(h, k)$:\n\n- Horizontal transverse axis:\n$$\\frac{(x-h)^{2}}{a^{2}} - \\frac{(y-k)^{2}}{b^{2}} = 1$$\n\n- Vertical transverse axis:\n$$\\frac{(y-k)^{2}}{a^{2}} - \\frac{(x-h)^{2}}{b^{2}} = 1$$",
        "中心在 $(h, k)$ 的双曲线标准方程：\n\n- 实轴水平：\n$$\\frac{(x-h)^{2}}{a^{2}} - \\frac{(y-k)^{2}}{b^{2}} = 1$$\n\n- 实轴竖直：\n$$\\frac{(y-k)^{2}}{a^{2}} - \\frac{(x-h)^{2}}{b^{2}} = 1$$",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const prompt = t(
          `Write the equation of the hyperbola with center $(${h}, ${k})$, vertices at $(${horizontal ? `${h} \\pm ${a}, ${k}` : `${h}, ${k} \\pm ${a}`})$, and $b = ${b}$.`,
          `写出中心在 $(${h}, ${k})$，顶点为 $(${horizontal ? `${h} \\pm ${a}, ${k}` : `${h}, ${k} \\pm ${a}`})$ 且 $b = ${b}$ 的双曲线标准方程。`,
        );
        const correct = hyperbolaEq(h, k, a2, b2, horizontal);
        const distractors = [
          hyperbolaEq(-h, -k, a2, b2, horizontal),
          hyperbolaEq(h, k, a2, b2, !horizontal),
          ellipseEq(h, k, a2, b2, horizontal),
          hyperbolaEq(k, h, a2, b2, horizontal),
        ];
        const solution = t(
          `Center is $(${h}, ${k})$, $a = ${a}$ ($a^{2} = ${a2}$), and $b = ${b}$ ($b^{2} = ${b2}$). Transverse axis is ${horizontal ? "horizontal" : "vertical"}:${steps(
            correct,
          )}`,
          `中心为 $(${h}, ${k})$，$a = ${a}$（$a^{2} = ${a2}$），$b = ${b}$（$b^{2} = ${b2}$）。实轴为${horizontal ? "水平" : "竖直"}方向：${steps(
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "identifying-center-and-vertices-of-hyperbola",
      title: t("Identifying center and vertices of a hyperbola", "识别双曲线的中心与顶点"),
      explanation: t(
        "From the standard form of a hyperbola:\n\n- The center is $(h, k)$.\n- For a horizontal hyperbola, vertices are $(h \\pm a, k)$.\n- For a vertical hyperbola, vertices are $(h, k \\pm a)$.",
        "由双曲线的标准方程：\n\n- 中心为 $(h, k)$。\n- 水平双曲线的顶点为 $(h \\pm a, k)$。\n- 竖直双曲线的顶点为 $(h, k \\pm a)$。",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = hyperbolaEq(h, k, a2, b2, horizontal);
        const prompt = t(`Find the center and vertices of the hyperbola $${eqStr}$.`, `求双曲线 $${eqStr}$ 的中心与顶点坐标。`);
        const v1 = horizontal ? `(${h - a}, ${k})` : `(${h}, ${k - a})`;
        const v2 = horizontal ? `(${h + a}, ${k})` : `(${h}, ${k + a})`;
        const correct = `\\text{Center: } (${h}, ${k}), \\; \\text{Vertices: } ${v1}, ${v2}`;
        const distractors = [
          `\\text{Center: } (${-h}, ${-k}), \\; \\text{Vertices: } ${v1}, ${v2}`,
          horizontal
            ? `\\text{Center: } (${h}, ${k}), \\; \\text{Vertices: } (${h}, ${k - a}), (${h}, ${k + a})`
            : `\\text{Center: } (${h}, ${k}), \\; \\text{Vertices: } (${h - a}, ${k}), (${h + a}, ${k})`,
          `\\text{Center: } (${h}, ${k}), \\; \\text{Vertices: } (${h - b}, ${k}), (${h + b}, ${k})`,
        ];
        const solution = t(
          `The center is $(${h}, ${k})$. The positive term has denominator $a^{2} = ${a2} \\implies a = ${a}$. Moving $a$ units along the ${horizontal ? "horizontal" : "vertical"} axis gives vertices $${v1}$ and $${v2}$.`,
          `中心为 $(${h}, ${k})$。正项的分母为 $a^{2} = ${a2} \\implies a = ${a}$。沿${horizontal ? "水平" : "竖直"}轴方向移动 $a$ 个单位得到顶点 $${v1}$ 和 $${v2}$。`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const asymptotesOfHyperbolasCenteredAtTheOrigin: TopicDef = {
  id: "asymptotes-of-hyperbolas-centered-at-the-origin",
  title: t("Asymptotes of Hyperbolas Centered at the Origin", "中心在原点的双曲线渐近线方程"),
  summary: t(
    "Find the equations of the asymptotes of a hyperbola centered at the origin ($y = \\pm \\frac{b}{a} x$ or $y = \\pm \\frac{a}{b} x$).",
    "求中心在原点的双曲线渐近线方程（y = ±b/a x 或 y = ±a/b x）。",
  ),
  prerequisites: ["equations-of-hyperbolas-centered-at-the-origin"],
  encompasses: [{ topic: "equations-of-hyperbolas-centered-at-the-origin", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "asymptotes-of-horizontal-hyperbolas",
      title: t("Asymptotes of horizontal hyperbolas", "水平双曲线的渐近线方程"),
      explanation: t(
        "For the horizontal hyperbola $\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$, setting the right side to $0$ gives:\n\n$$\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 0 \\implies y = \\pm \\frac{b}{a}x$$",
        "对于水平双曲线 $\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$，将等式右边置为 $0$：\n\n$$\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 0 \\implies y = \\pm \\frac{b}{a}x$$",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const a2 = a * a;
        const b2 = b * b;
        const slope = Q.of(b, a);
        const prompt = t(
          `Find the equations of the asymptotes of the hyperbola $\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1$.`,
          `求双曲线 $\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1$ 的渐近线方程。`,
        );
        const slopeLatex = slope.isInteger() ? `${slope.abs().toLatex()}` : slope.abs().toLatex();
        const correct = `y = \\pm ${slopeLatex}x`;
        const distractors = [
          `y = \\pm ${Q.of(a, b).toLatex()}x`,
          `y = \\pm ${Q.of(b2, a2).toLatex()}x`,
          `y = \\pm ${Q.of(a2, b2).toLatex()}x`,
          `x = \\pm ${slopeLatex}y`,
        ];
        const solution = t(
          `For a horizontal hyperbola, the asymptotes are $y = \\pm \\frac{b}{a}x$. Here $a = ${a}$ and $b = ${b}$:${steps(
            `y = \\pm \\frac{${b}}{${a}}x = \\pm ${slopeLatex}x`,
          )}`,
          `对于水平双曲线，渐近线为 $y = \\pm \\frac{b}{a}x$。此处 $a = ${a}, b = ${b}$：${steps(
            `y = \\pm \\frac{${b}}{${a}}x = \\pm ${slopeLatex}x`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "asymptotes-of-vertical-hyperbolas",
      title: t("Asymptotes of vertical hyperbolas", "竖直双曲线的渐近线方程"),
      explanation: t(
        "For the vertical hyperbola $\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 1$, setting the right side to $0$ gives:\n\n$$\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 0 \\implies y = \\pm \\frac{a}{b}x$$",
        "对于竖直双曲线 $\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 1$，将等式右边置为 $0$：\n\n$$\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 0 \\implies y = \\pm \\frac{a}{b}x$$",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const a2 = a * a;
        const b2 = b * b;
        const slope = Q.of(a, b);
        const prompt = t(
          `Find the equations of the asymptotes of the hyperbola $\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1$.`,
          `求双曲线 $\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1$ 的渐近线方程。`,
        );
        const slopeLatex = slope.isInteger() ? `${slope.abs().toLatex()}` : slope.abs().toLatex();
        const correct = `y = \\pm ${slopeLatex}x`;
        const distractors = [
          `y = \\pm ${Q.of(b, a).toLatex()}x`,
          `y = \\pm ${Q.of(a2, b2).toLatex()}x`,
          `y = \\pm ${Q.of(b2, a2).toLatex()}x`,
          `x = \\pm ${slopeLatex}y`,
        ];
        const solution = t(
          `For a vertical hyperbola, the asymptotes are $y = \\pm \\frac{a}{b}x$. Here $a = ${a}$ and $b = ${b}$:${steps(
            `y = \\pm \\frac{${a}}{${b}}x = \\pm ${slopeLatex}x`,
          )}`,
          `对于竖直双曲线，渐近线为 $y = \\pm \\frac{a}{b}x$。此处 $a = ${a}, b = ${b}$：${steps(
            `y = \\pm \\frac{${a}}{${b}}x = \\pm ${slopeLatex}x`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const asymptotesOfHyperbolasCenteredAtAGeneralPoint: TopicDef = {
  id: "asymptotes-of-hyperbolas-centered-at-a-general-point",
  title: t("Asymptotes of Hyperbolas Centered at a General Point", "中心在任意点的双曲线渐近线方程"),
  summary: t(
    "Find the equations of the asymptotes of a translated hyperbola using the point-slope form $y - k = \\pm \\frac{b}{a} (x - h)$ or $y - k = \\pm \\frac{a}{b} (x - h)$.",
    "利用点斜式 y - k = ±b/a (x - h) 或 y - k = ±a/b (x - h) 求中心在任意点的双曲线渐近线方程。",
  ),
  prerequisites: ["asymptotes-of-hyperbolas-centered-at-the-origin", "equations-of-hyperbolas-centered-at-a-general-point"],
  encompasses: [{ topic: "asymptotes-of-hyperbolas-centered-at-the-origin", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "asymptotes-of-translated-horizontal-hyperbolas",
      title: t("Asymptotes of translated horizontal hyperbolas", "平移水平双曲线的渐近线"),
      explanation: t(
        "For $\\frac{(x-h)^{2}}{a^{2}} - \\frac{(y-k)^{2}}{b^{2}} = 1$, the asymptotes pass through the center $(h, k)$ with slopes $\\pm \\frac{b}{a}$:\n\n$$y - k = \\pm \\frac{b}{a}(x - h)$$",
        "对于 $\\frac{(x-h)^{2}}{a^{2}} - \\frac{(y-k)^{2}}{b^{2}} = 1$，渐近线穿过中心 $(h, k)$，斜率为 $\\pm \\frac{b}{a}$：\n\n$$y - k = \\pm \\frac{b}{a}(x - h)$$",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const a = rng.int(2, 10);
        const b = rng.int(2, 10);
        const a2 = a * a;
        const b2 = b * b;
        const slope = Q.of(b, a).toLatex();
        const eqStr = `\\frac{${sqTerm("x", h)}}{${a2}} - \\frac{${sqTerm("y", k)}}{${b2}} = 1`;
        const prompt = t(`Find the equations of the asymptotes of the hyperbola $${eqStr}$.`, `求双曲线 $${eqStr}$ 的渐近线方程。`);
        const yPart = linTerm("y", k);
        const xPart = linTerm("x", h);
        const correct = `${yPart} = \\pm ${slope}${xPart}`;
        const distractors = [
          `${linTerm("y", -k)} = \\pm ${slope}${linTerm("x", -h)}`,
          `${yPart} = \\pm ${Q.of(a, b).toLatex()}${xPart}`,
          `${xPart} = \\pm ${slope}${yPart}`,
        ];
        const solution = t(
          `The center is $(${h}, ${k})$. For a horizontal hyperbola, the asymptotes have slope $\\pm \\frac{b}{a} = \\pm \\frac{${b}}{${a}} = \\pm ${slope}$:${steps(
            correct,
          )}`,
          `中心为 $(${h}, ${k})$。水平双曲线的渐近线斜率为 $\\pm \\frac{b}{a} = \\pm \\frac{${b}}{${a}} = \\pm ${slope}$：${steps(
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "asymptotes-of-translated-vertical-hyperbolas",
      title: t("Asymptotes of translated vertical hyperbolas", "平移竖直双曲线的渐近线"),
      explanation: t(
        "For $\\frac{(y-k)^{2}}{a^{2}} - \\frac{(x-h)^{2}}{b^{2}} = 1$, the asymptotes pass through the center $(h, k)$ with slopes $\\pm \\frac{a}{b}$:\n\n$$y - k = \\pm \\frac{a}{b}(x - h)$$",
        "对于 $\\frac{(y-k)^{2}}{a^{2}} - \\frac{(x-h)^{2}}{b^{2}} = 1$，渐近线穿过中心 $(h, k)$，斜率为 $\\pm \\frac{a}{b}$：\n\n$$y - k = \\pm \\frac{a}{b}(x - h)$$",
      ),
      generate(rng) {
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const a = rng.int(2, 10);
        const b = rng.int(2, 10);
        const a2 = a * a;
        const b2 = b * b;
        const slope = Q.of(a, b).toLatex();
        const eqStr = `\\frac{${sqTerm("y", k)}}{${a2}} - \\frac{${sqTerm("x", h)}}{${b2}} = 1`;
        const prompt = t(`Find the equations of the asymptotes of the hyperbola $${eqStr}$.`, `求双曲线 $${eqStr}$ 的渐近线方程。`);
        const yPart = linTerm("y", k);
        const xPart = linTerm("x", h);
        const correct = `${yPart} = \\pm ${slope}${xPart}`;
        const distractors = [
          `${linTerm("y", -k)} = \\pm ${slope}${linTerm("x", -h)}`,
          `${yPart} = \\pm ${Q.of(b, a).toLatex()}${xPart}`,
          `${xPart} = \\pm ${slope}${yPart}`,
        ];
        const solution = t(
          `The center is $(${h}, ${k})$. For a vertical hyperbola, the asymptotes have slope $\\pm \\frac{a}{b} = \\pm \\frac{${a}}{${b}} = \\pm ${slope}$:${steps(
            correct,
          )}`,
          `中心为 $(${h}, ${k})$。竖直双曲线的渐近线斜率为 $\\pm \\frac{a}{b} = \\pm \\frac{${a}}{${b}} = \\pm ${slope}$：${steps(
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const findingInterceptsAndIntersectionsOfHyperbolas: TopicDef = {
  id: "finding-intercepts-and-intersections-of-hyperbolas",
  title: t("Finding Intercepts and Intersections of Hyperbolas", "双曲线的截距与直线交点"),
  summary: t(
    "Find coordinate intercepts of hyperbolas and determine points of intersection with lines.",
    "求解双曲线在坐标轴上的截距，并确定双曲线与直线的交点坐标。",
  ),
  prerequisites: ["equations-of-hyperbolas-centered-at-a-general-point"],
  encompasses: [{ topic: "equations-of-hyperbolas-centered-at-a-general-point", weight: 0.5 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "intercepts-of-a-hyperbola",
      title: t("Intercepts of a hyperbola with the coordinate axes", "双曲线与坐标轴的截距"),
      explanation: t(
        "For $\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$:\n- Setting $y = 0$ gives $x^{2} = a^{2} \\implies x = \\pm a$ ($x$-intercepts at $(\\pm a, 0)$).\n- Setting $x = 0$ gives $-\\frac{y^{2}}{b^{2}} = 1$, which has no real solutions (no $y$-intercepts).\n\nSimilarly, a vertical hyperbola $\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 1$ has $y$-intercepts at $(0, \\pm a)$ and no $x$-intercepts.",
        "对于水平双曲线 $\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$：\n- 令 $y = 0$ 得 $x^{2} = a^{2} \\implies x = \\pm a$（$x$ 轴截距为 $(\\pm a, 0)$）。\n- 令 $x = 0$ 得 $-\\frac{y^{2}}{b^{2}} = 1$，无实数解（无 $y$ 轴截距）。\n\n同理，竖直双曲线有 $y$ 轴截距 $(0, \\pm a)$，无 $x$ 轴截距。",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1` : `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`;
        const prompt = t(
          `Determine all $x$-intercepts and $y$-intercepts of the hyperbola $${eqStr}$.`,
          `确定双曲线 $${eqStr}$ 的所有坐标轴截距点。`,
        );
        const correct = horizontal
          ? t(`x-intercepts at (±${a}, 0); no y-intercepts`, `x 轴截距为 (±${a}, 0)；无 y 轴截距`)
          : t(`y-intercepts at (0, ±${a}); no x-intercepts`, `y 轴截距为 (0, ±${a})；无 x 轴截距`);
        const distractors = [
          horizontal
            ? t(`y-intercepts at (0, ±${b}); no x-intercepts`, `y 轴截距为 (0, ±${b})；无 x 轴截距`)
            : t(`x-intercepts at (±${b}, 0); no y-intercepts`, `x 轴截距为 (±${b}, 0)；无 y 轴截距`),
          horizontal
            ? t(`x-intercepts at (±${a}, 0) and y-intercepts at (0, ±${b})`, `x 轴截距为 (±${a}, 0)，y 轴截距为 (0, ±${b})`)
            : t(`y-intercepts at (0, ±${a}) and x-intercepts at (±${b}, 0)`, `y 轴截距为 (0, ±${a})，x 轴截距为 (±${b}, 0)`),
          t("No intercepts on either axis", "与两条坐标轴均无交点"),
        ];
        const solution = t(
          `For $${eqStr}$, the positive term yields real intercepts on the ${horizontal ? "x" : "y"}-axis at ${horizontal ? `(\\pm ${a}, 0)` : `(0, \\pm ${a})`}. Setting the other variable to $0$ gives no real solutions.`,
          `对于 $${eqStr}$，正项变量在 ${horizontal ? "x" : "y"} 轴上产生实数截距 ${horizontal ? `(\\pm ${a}, 0)` : `(0, \\pm ${a})`}，而令另一变量为 $0$ 时无实数解。`,
        );
        return makeChoiceTexts(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "intersections-with-lines",
      title: t("Intersections of a hyperbola with lines", "双曲线与直线的交点"),
      explanation: t(
        "To find the intersection points of a hyperbola with a line, substitute the linear relationship into the hyperbola equation and solve the resulting quadratic equation.",
        "求解双曲线与直线的交点，将直线的代数式代入双曲线方程，解所得的一元二次方程。",
      ),
      generate(rng) {
        // Horizontal hyperbola x^2/a^2 - y^2/b^2 = 1 with line y = d
        // 1 + d^2/b^2 = (m/n)^2 using Pythagorean triple [b, d, m] => m^2 = b^2 + d^2
        const triple = rng.pick(pythTriples);
        const [b, d, m] = triple;
        const aMult = rng.int(1, 3);
        const a = aMult * b;
        const xVal = aMult * m;
        const a2 = a * a;
        const b2 = b * b;
        const prompt = t(
          `Find the coordinates of the intersection points of the hyperbola $\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1$ and the horizontal line $y = ${d}$.`,
          `求双曲线 $\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1$ 与水平直线 $y = ${d}$ 的交点坐标。`,
        );
        const correct = `(\\pm ${xVal}, ${d})`;
        const distractors = [`(${d}, \\pm ${xVal})`, `(\\pm ${a}, ${d})`, `(\\pm ${xVal}, 0)`, `(\\pm ${m}, ${d})`];
        const solution = t(
          `Substitute $y = ${d}$ into the hyperbola equation:${steps(
            `\\frac{x^{2}}{${a2}} - \\frac{${d * d}}{${b2}} = 1 \\implies \\frac{x^{2}}{${a2}} = 1 + \\frac{${d * d}}{${b2}} = \\frac{${m * m}}{${b2}}`,
            `x^{2} = ${a2} \\times \\frac{${m * m}}{${b2}} = ${xVal * xVal} \\implies x = \\pm ${xVal}`,
            `\\text{Points: } (\\pm ${xVal}, ${d})`,
          )}`,
          `将 $y = ${d}$ 代入双曲线方程：${steps(
            `\\frac{x^{2}}{${a2}} - \\frac{${d * d}}{${b2}} = 1 \\implies \\frac{x^{2}}{${a2}} = 1 + \\frac{${d * d}}{${b2}} = \\frac{${m * m}}{${b2}}`,
            `x^{2} = ${a2} \\times \\frac{${m * m}}{${b2}} = ${xVal * xVal} \\implies x = \\pm ${xVal}`,
            `\\text{交点坐标：} (\\pm ${xVal}, ${d})`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const transverseAxesOfHyperbolas: TopicDef = {
  id: "transverse-axes-of-hyperbolas",
  title: t("Transverse Axes of Hyperbolas", "双曲线的实轴"),
  summary: t(
    "Determine the orientation and length $2a$ of the transverse axis connecting the vertices of a hyperbola.",
    "确定连接双曲线两顶点的实轴方向与实轴长 2a。",
  ),
  prerequisites: ["equations-of-hyperbolas-centered-at-the-origin"],
  encompasses: [{ topic: "equations-of-hyperbolas-centered-at-the-origin", weight: 0.6 }],
  xp: 10,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "length-of-the-transverse-axis",
      title: t("Length of the transverse axis", "实轴的长度"),
      explanation: t(
        "The segment joining the two vertices is the transverse axis of the hyperbola. Its length is $2a$, where $a$ is the semi-transverse axis:\n\n$$\\text{Transverse axis length} = 2a$$",
        "连接双曲线两个顶点的线段称为实轴。其实轴长度为 $2a$，其中 $a$ 为半实轴长：\n\n$$\\text{实轴长} = 2a$$",
      ),
      generate(rng) {
        const a = rng.int(2, 14);
        const b = rng.int(2, 14);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1` : `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`;
        const prompt = t(`What is the length of the transverse axis of the hyperbola $${eqStr}$?`, `双曲线 $${eqStr}$ 的实轴长度是多少？`);
        const correct = `${2 * a}`;
        const distractors = [`${a}`, `${2 * b}`, `${b}`, `${a2}`];
        const solution = t(
          `The positive term denominator is $a^{2} = ${a2} \\implies a = ${a}$. The length of the transverse axis is $2a = 2(${a}) = ${2 * a}$.`,
          `正项的分母为 $a^{2} = ${a2} \\implies a = ${a}$。实轴长度为 $2a = 2(${a}) = ${2 * a}$。`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "endpoints-of-the-transverse-axis",
      title: t("Endpoints of the transverse axis", "实轴的端点坐标"),
      explanation: t(
        "The endpoints of the transverse axis are the vertices of the hyperbola:\n\n- Horizontal hyperbola centered at $(h, k)$: $(h \\pm a, k)$\n- Vertical hyperbola centered at $(h, k)$: $(h, k \\pm a)$",
        "实轴的端点即为双曲线的顶点：\n\n- 中心在 $(h, k)$ 的水平双曲线：$(h \\pm a, k)$\n- 中心在 $(h, k)$ 的竖直双曲线：$(h, k \\pm a)$",
      ),
      generate(rng) {
        const h = rng.int(-5, 5);
        const k = rng.int(-5, 5);
        const a = rng.int(3, 10);
        const b = rng.int(2, 8);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = hyperbolaEq(h, k, a2, b2, horizontal);
        const prompt = t(
          `Find the endpoints of the transverse axis for the hyperbola $${eqStr}$.`,
          `求双曲线 $${eqStr}$ 实轴的两端点坐标。`,
        );
        const v1 = horizontal ? `(${h - a}, ${k})` : `(${h}, ${k - a})`;
        const v2 = horizontal ? `(${h + a}, ${k})` : `(${h}, ${k + a})`;
        const correct = `${v1} \\text{ and } ${v2}`;
        const distractors = [
          horizontal ? `(${h}, ${k - a}) \\text{ and } (${h}, ${k + a})` : `(${h - a}, ${k}) \\text{ and } (${h + a}, ${k})`,
          horizontal ? `(${h - b}, ${k}) \\text{ and } (${h + b}, ${k})` : `(${h}, ${k - b}) \\text{ and } (${h}, ${k + b})`,
          `(${h}, ${k})`,
        ];
        const solution = t(
          `The transverse axis connects the vertices. Center is $(${h}, ${k})$ and $a = \\sqrt{${a2}} = ${a}$. Along the ${horizontal ? "horizontal" : "vertical"} axis:${steps(
            correct,
          )}`,
          `实轴连接两顶点。中心为 $(${h}, ${k})$，半实轴长 $a = \\sqrt{${a2}} = ${a}$。沿${horizontal ? "水平" : "竖直"}方向移动得：${steps(
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const conjugateAxesOfHyperbolas: TopicDef = {
  id: "conjugate-axes-of-hyperbolas",
  title: t("Conjugate Axes of Hyperbolas", "双曲线的虚轴"),
  summary: t(
    "Identify the conjugate axis of length $2b$ and the central fundamental rectangle of dimensions $2a \\times 2b$.",
    "识别双曲线长为 2b 的虚轴以及尺寸为 2a × 2b 的中心基本矩形。",
  ),
  prerequisites: ["transverse-axes-of-hyperbolas"],
  encompasses: [{ topic: "transverse-axes-of-hyperbolas", weight: 0.6 }],
  xp: 10,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "length-of-the-conjugate-axis",
      title: t("Length of the conjugate axis", "虚轴的长度"),
      explanation: t(
        "The segment perpendicular to the transverse axis at the center of length $2b$ is called the conjugate axis of the hyperbola:\n\n$$\\text{Conjugate axis length} = 2b$$",
        "在中心处垂直于实轴、长度为 $2b$ 的线段称为双曲线的虚轴：\n\n$$\\text{虚轴长} = 2b$$",
      ),
      generate(rng) {
        const a = rng.int(2, 14);
        const b = rng.int(2, 14);
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1` : `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`;
        const prompt = t(`What is the length of the conjugate axis of the hyperbola $${eqStr}$?`, `双曲线 $${eqStr}$ 的虚轴长度是多少？`);
        const correct = `${2 * b}`;
        const distractors = [`${b}`, `${2 * a}`, `${a}`, `${b2}`];
        const solution = t(
          `The negative term denominator is $b^{2} = ${b2} \\implies b = ${b}$. The length of the conjugate axis is $2b = 2(${b}) = ${2 * b}$.`,
          `负项的分母为 $b^{2} = ${b2} \\implies b = ${b}$。虚轴长为 $2b = 2(${b}) = ${2 * b}$。`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "central-fundamental-rectangle",
      title: t("The central fundamental rectangle", "双曲线的中心基本矩形"),
      explanation: t(
        "The central rectangle of a hyperbola has side lengths $2a$ (along the transverse axis) and $2b$ (along the conjugate axis). Its diagonals extended are the asymptotes of the hyperbola, and its area is $(2a)(2b) = 4ab$.",
        "双曲线的中心基本矩形边长分别为 $2a$（沿实轴方向）和 $2b$（沿虚轴方向）。其对角线延伸即为双曲线的渐近线，其面积为 $(2a)(2b) = 4ab$。",
      ),
      generate(rng) {
        const a = rng.int(2, 12);
        const b = rng.int(2, 12);
        const a2 = a * a;
        const b2 = b * b;
        const areaRect = 4 * a * b;
        const prompt = t(
          `Find the area of the central fundamental rectangle for the hyperbola $\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1$.`,
          `求双曲线 $\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1$ 的中心基本矩形的面积。`,
        );
        const correct = `${areaRect}`;
        const distractors = [`${a * b}`, `${2 * a * b}`, `${2 * (a + b)}`, `${4 * (a + b)}`];
        const solution = t(
          `The dimensions of the central rectangle are $2a = 2(${a}) = ${2 * a}$ and $2b = 2(${b}) = ${2 * b}$. Its area is:${steps(
            `\\text{Area} = (2a)(2b) = (${2 * a})(${2 * b}) = ${areaRect}`,
          )}`,
          `中心矩形的两边长分别为 $2a = 2(${a}) = ${2 * a}$ 和 $2b = 2(${b}) = ${2 * b}$。其面积为：${steps(
            `\\text{面积} = (2a)(2b) = (${2 * a})(${2 * b}) = ${areaRect}`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const fociOfHyperbolas: TopicDef = {
  id: "foci-of-hyperbolas",
  title: t("Foci of Hyperbolas", "双曲线的焦点坐标与焦距"),
  summary: t(
    "Use $c^2 = a^2 + b^2$ to find the focal distance and coordinates of the foci of a hyperbola.",
    "利用 c² = a² + b² 计算双曲线的焦距和焦点坐标。",
  ),
  prerequisites: ["transverse-axes-of-hyperbolas"],
  encompasses: [{ topic: "transverse-axes-of-hyperbolas", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "foci-of-hyperbolas-at-origin",
      title: t("Foci of a hyperbola centered at the origin", "中心在原点的双曲线焦点"),
      explanation: t(
        "For any hyperbola, the focal distance $c$ from the center to each focus satisfies:\n\n$$c^{2} = a^{2} + b^{2} \\implies c = \\sqrt{a^{2} + b^{2}}$$\n\n- Horizontal hyperbola: foci at $(\\pm c, 0)$\n- Vertical hyperbola: foci at $(0, \\pm c)$",
        "对任意双曲线，中心到各焦点的半焦距 $c$ 满足：\n\n$$c^{2} = a^{2} + b^{2} \\implies c = \\sqrt{a^{2} + b^{2}}$$\n\n- 水平双曲线：焦点为 $(\\pm c, 0)$\n- 竖直双曲线：焦点为 $(0, \\pm c)$",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [a, b, c] = triple;
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1` : `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`;
        const prompt = t(`Find the coordinates of the foci of the hyperbola $${eqStr}$.`, `求双曲线 $${eqStr}$ 的焦点坐标。`);
        const correct = horizontal ? `(\\pm ${c}, 0)` : `(0, \\pm ${c})`;
        const distractors = [
          horizontal ? `(0, \\pm ${c})` : `(\\pm ${c}, 0)`,
          horizontal ? `(\\pm ${a}, 0)` : `(0, \\pm ${a})`,
          horizontal ? `(0, \\pm ${b})` : `(\\pm ${b}, 0)`,
          `(\\pm ${a + b}, 0)`,
        ];
        const solution = t(
          `Using $c^{2} = a^{2} + b^{2} = ${a2} + ${b2} = ${c * c} \\implies c = ${c}$. Since the hyperbola is ${horizontal ? "horizontal" : "vertical"}, the foci are $${correct}$.`,
          `根据 $c^{2} = a^{2} + b^{2} = ${a2} + ${b2} = ${c * c} \\implies c = ${c}$。因为双曲线为${horizontal ? "水平" : "竖直"}方向，所以焦点坐标为 $${correct}$。`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "foci-of-translated-hyperbolas",
      title: t("Foci of a translated hyperbola", "平移双曲线的焦点坐标"),
      explanation: t(
        "For a hyperbola with center $(h, k)$ and focal distance $c = \\sqrt{a^{2} + b^{2}}$:\n\n- Horizontal hyperbola: foci at $(h \\pm c, k)$\n- Vertical hyperbola: foci at $(h, k \\pm c)$",
        "对于中心在 $(h, k)$、半焦距为 $c = \\sqrt{a^{2} + b^{2}}$ 的双曲线：\n\n- 水平双曲线：焦点为 $(h \\pm c, k)$\n- 竖直双曲线：焦点为 $(h, k \\pm c)$",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [a, b, c] = triple;
        const a2 = a * a;
        const b2 = b * b;
        const h = rng.nonZero(-6, 6);
        const k = rng.nonZero(-6, 6);
        const horizontal = rng.bool();
        const eqStr = hyperbolaEq(h, k, a2, b2, horizontal);
        const prompt = t(`Find the coordinates of the foci of the hyperbola $${eqStr}$.`, `求双曲线 $${eqStr}$ 的焦点坐标。`);
        const f1 = horizontal ? `(${h - c}, ${k})` : `(${h}, ${k - c})`;
        const f2 = horizontal ? `(${h + c}, ${k})` : `(${h}, ${k + c})`;
        const correct = `${f1} \\text{ and } ${f2}`;
        const distractors = [
          horizontal ? `(${h}, ${k - c}) \\text{ and } (${h}, ${k + c})` : `(${h - c}, ${k}) \\text{ and } (${h + c}, ${k})`,
          horizontal ? `(${h - a}, ${k}) \\text{ and } (${h + a}, ${k})` : `(${h}, ${k - a}) \\text{ and } (${h}, ${k + a})`,
          `(${h}, ${k})`,
        ];
        const solution = t(
          `The center is $(${h}, ${k})$ and $c = \\sqrt{${a2} + ${b2}} = ${c}$. Adding $\\pm ${c}$ along the ${horizontal ? "x" : "y"}-coordinate gives:${steps(
            correct,
          )}`,
          `中心为 $(${h}, ${k})$，半焦距 $c = \\sqrt{${a2} + ${b2}} = ${c}$。沿 ${horizontal ? "x" : "y"} 轴方向偏移 $\\pm ${c}$ 得：${steps(
            correct,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const eccentricityAndVerticesOfHyperbolas: TopicDef = {
  id: "eccentricity-and-vertices-of-hyperbolas",
  title: t("Eccentricity and Vertices of Hyperbolas", "双曲线的离心率与顶点"),
  summary: t(
    "Calculate the eccentricity $e = c/a > 1$ of a hyperbola, and explore the properties of equilateral (rectangular) hyperbolas.",
    "计算双曲线的离心率 e = c/a > 1，并探讨等轴双曲线（a = b ⇒ e = √2）的性质。",
  ),
  prerequisites: ["foci-of-hyperbolas"],
  encompasses: [{ topic: "foci-of-hyperbolas", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "calculating-hyperbola-eccentricity",
      title: t("Calculating the eccentricity of a hyperbola", "计算双曲线的离心率"),
      explanation: t(
        "The eccentricity $e$ of a hyperbola is defined as:\n\n$$e = \\frac{c}{a} = \\frac{\\sqrt{a^{2} + b^{2}}}{a}$$\n\nBecause $c > a > 0$, the eccentricity of every hyperbola is strictly greater than $1$ ($e > 1$).",
        "双曲线的离心率 $e$ 定义为：\n\n$$e = \\frac{c}{a} = \\frac{\\sqrt{a^{2} + b^{2}}}{a}$$\n\n因为 $c > a > 0$，所以任意双曲线的离心率恒严格大于 $1$（$e > 1$）。",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [a, b, c] = triple;
        const mult = rng.int(1, 3);
        const A = a * mult;
        const B = b * mult;
        const C = c * mult;
        const a2 = A * A;
        const b2 = B * B;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1` : `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`;
        const eFrac = Q.of(C, A);
        const prompt = t(`Calculate the eccentricity of the hyperbola $${eqStr}$.`, `计算双曲线 $${eqStr}$ 的离心率。`);
        const correct = eFrac.toLatex();
        const distractors = [Q.of(A, C).toLatex(), Q.of(B, A).toLatex(), Q.of(C, B).toLatex(), "1"];
        const solution = t(
          `Here $a = ${A}, b = ${B}$. First find $c = \\sqrt{${a2} + ${b2}} = ${C}$. Then:${steps(
            `e = \\frac{c}{a} = \\frac{${C}}{${A}} = ${correct}`,
          )}`,
          `此处 $a = ${A}, b = ${B}$。先求半焦距 $c = \\sqrt{${a2} + ${b2}} = ${C}$。然后求离心率：${steps(
            `e = \\frac{c}{a} = \\frac{${C}}{${A}} = ${correct}`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "equilateral-rectangular-hyperbolas",
      title: t("Rectangular (equilateral) hyperbolas", "等轴双曲线"),
      explanation: t(
        "When $a = b$, the hyperbola is called rectangular (or equilateral):\n\n- The asymptotes $y = \\pm \\frac{a}{a}x = \\pm x$ are perpendicular ($90^{\\circ}$ angle).\n- The eccentricity is constant for all rectangular hyperbolas:\n$$e = \\frac{\\sqrt{a^{2} + a^{2}}}{a} = \\frac{a\\sqrt{2}}{a} = \\sqrt{2}$$",
        "当 $a = b$ 时，双曲线被称为等轴双曲线（或直角双曲线）：\n\n- 渐近线 $y = \\pm \\frac{a}{a}x = \\pm x$ 互相垂直（夹角为 $90^{\\circ}$）。\n- 所有等轴双曲线的离心率均为常数：\n$$e = \\frac{\\sqrt{a^{2} + a^{2}}}{a} = \\frac{a\\sqrt{2}}{a} = \\sqrt{2}$$",
      ),
      generate(rng) {
        const a = rng.int(2, 25);
        const a2 = a * a;
        const form = rng.pick(["standard-x", "standard-y", "cleared-x", "cleared-y"]);
        let eqStr = "";
        if (form === "standard-x") eqStr = `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${a2}} = 1`;
        else if (form === "standard-y") eqStr = `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${a2}} = 1`;
        else if (form === "cleared-x") eqStr = `x^{2} - y^{2} = ${a2}`;
        else eqStr = `y^{2} - x^{2} = ${a2}`;

        const prompt = t(`What is the eccentricity of the equilateral hyperbola $${eqStr}$?`, `等轴双曲线 $${eqStr}$ 的离心率是多少？`);
        const correct = "\\sqrt{2}";
        const distractors = ["2", "\\frac{\\sqrt{2}}{2}", "1", "\\sqrt{3}"];
        const solution = t(
          `For an equilateral hyperbola, $a = b = ${a}$. The focal distance is $c = \\sqrt{${a2} + ${a2}} = ${a}\\sqrt{2}$. The eccentricity is always:${steps(
            `e = \\frac{c}{a} = \\frac{${a}\\sqrt{2}}{${a}} = \\sqrt{2}`,
          )}`,
          `对于等轴双曲线，$a = b = ${a}$。焦距 $c = \\sqrt{${a2} + ${a2}} = ${a}\\sqrt{2}$。离心率恒为：${steps(
            `e = \\frac{c}{a} = \\frac{${a}\\sqrt{2}}{${a}} = \\sqrt{2}`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

export const directricesOfHyperbolas: TopicDef = {
  id: "directrices-of-hyperbolas",
  title: t("Directrices of Hyperbolas", "双曲线的准线方程"),
  summary: t(
    "Find the equations of the directrices of a hyperbola ($x = \\pm a^2/c$ or $y = \\pm a^2/c$) and apply the focus-directrix property.",
    "求解双曲线的准线方程（x = ±a²/c 或 y = ±a²/c），应用焦点-准线性质。",
  ),
  prerequisites: ["eccentricity-and-vertices-of-hyperbolas"],
  encompasses: [{ topic: "eccentricity-and-vertices-of-hyperbolas", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.HSG.GPE.A.3"],
  knowledgePoints: [
    {
      id: "equations-of-hyperbola-directrices",
      title: t("Equations of hyperbola directrices", "双曲线的准线方程"),
      explanation: t(
        "A hyperbola centered at the origin has two directrices between the center and the vertices:\n\n- Horizontal hyperbola: $x = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$\n- Vertical hyperbola: $y = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$",
        "中心在原点的双曲线有两条位于中心与顶点之间的准线：\n\n- 水平双曲线：$x = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$\n- 竖直双曲线：$y = \\pm \\frac{a^{2}}{c} = \\pm \\frac{a}{e}$",
      ),
      generate(rng) {
        const triple = rng.pick(pythTriples);
        const [a, b, c] = triple;
        const a2 = a * a;
        const b2 = b * b;
        const horizontal = rng.bool();
        const eqStr = horizontal ? `\\frac{x^{2}}{${a2}} - \\frac{y^{2}}{${b2}} = 1` : `\\frac{y^{2}}{${a2}} - \\frac{x^{2}}{${b2}} = 1`;
        const prompt = t(`Find the equations of the directrices of the hyperbola $${eqStr}$.`, `求双曲线 $${eqStr}$ 的准线方程。`);
        const valStr = pmFrac(a2, c);
        const correct = `${horizontal ? "x" : "y"} = ${valStr}`;
        const distractors = [
          `${horizontal ? "y" : "x"} = ${valStr}`,
          `${horizontal ? "x" : "y"} = ${pmFrac(b2, c)}`,
          `${horizontal ? "x" : "y"} = ${pmFrac(c * c, a)}`,
        ];
        const solution = t(
          `Here $a = ${a}, a^{2} = ${a2}, c = \\sqrt{${a2} + ${b2}} = ${c}$. The directrices are:${steps(
            `${horizontal ? "x" : "y"} = \\pm \\frac{a^{2}}{c} = ${valStr}`,
          )}`,
          `此处 $a = ${a}, a^{2} = ${a2}, c = \\sqrt{${a2} + ${b2}} = ${c}$。准线方程为：${steps(
            `${horizontal ? "x" : "y"} = \\pm \\frac{a^{2}}{c} = ${valStr}`,
          )}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
    {
      id: "focus-directrix-ratio-hyperbola",
      title: t("The focus-directrix property of a hyperbola", "双曲线的焦点-准线性质"),
      explanation: t(
        "For any point $P$ on a hyperbola, the ratio of its distance to a focus $F$ to its distance to the corresponding directrix $\\ell$ is constant and equals the eccentricity $e > 1$:\n\n$$\\frac{PF}{d(P, \\ell)} = e > 1 \\implies PF = e \\cdot d(P, \\ell)$$",
        "对于双曲线上任意一点 $P$，其到焦点 $F$ 的距离与到对应准线 $\\ell$ 的距离之比为常数，且等于离心率 $e > 1$：\n\n$$\\frac{PF}{d(P, \\ell)} = e > 1 \\implies PF = e \\cdot d(P, \\ell)$$",
      ),
      generate(rng) {
        const eNumerator = rng.pick([5, 13, 17, 25]);
        const eDenominator =
          eNumerator === 5
            ? rng.pick([3, 4])
            : eNumerator === 13
              ? rng.pick([5, 12])
              : eNumerator === 17
                ? rng.pick([8, 15])
                : rng.pick([7, 24]);
        const e = Q.of(eNumerator, eDenominator);
        const mult = rng.int(2, 5);
        const distDirectrix = eDenominator * mult;
        const distFocus = eNumerator * mult;
        const prompt = t(
          `A point $P$ lies on a hyperbola with eccentricity $e = ${e.toLatex()}$. If the distance from $P$ to the directrix is $${distDirectrix}$, what is the distance from $P$ to the corresponding focus?`,
          `点 $P$ 位于离心率 $e = ${e.toLatex()}$ 的双曲线上。如果点 $P$ 到准线的距离为 $${distDirectrix}$，那么点 $P$ 到对应焦点的距离是多少？`,
        );
        const correct = `${distFocus}`;
        const distractors = [
          `${distDirectrix}`,
          `${Math.round((distDirectrix * eDenominator) / eNumerator)}`,
          `${distFocus + 2}`,
          `${distFocus - 2}`,
        ];
        const solution = t(
          `Using the focus-directrix property $PF = e \\cdot d(P, \\ell)$:${steps(
            `PF = ${e.toLatex()} \\times ${distDirectrix} = ${distFocus}`,
          )}`,
          `利用焦点-准线性质 $PF = e \\cdot d(P, \\ell)$：${steps(`PF = ${e.toLatex()} \\times ${distDirectrix} = ${distFocus}`)}`,
        );
        return makeChoice(rng, prompt, correct, distractors, solution);
      },
    },
  ],
};

// ===========================================================================
// All 20 Precalculus Conic Section Topics
// ===========================================================================

export const precalculusConicSectionTopics: readonly TopicDef[] = [
  introductionToEllipses,
  equationsOfEllipsesCenteredAtTheOrigin,
  equationsOfEllipsesCenteredAtAGeneralPoint,
  findingTheCenterAndAxesOfEllipsesByCompletingTheSquare,
  findingInterceptsOfEllipses,
  findingIntersectionsOfEllipsesAndLines,
  fociOfEllipses,
  verticesAndEccentricityOfEllipses,
  directricesOfEllipses,
  theAreaOfAnEllipse,
  equationsOfHyperbolasCenteredAtTheOrigin,
  equationsOfHyperbolasCenteredAtAGeneralPoint,
  asymptotesOfHyperbolasCenteredAtTheOrigin,
  asymptotesOfHyperbolasCenteredAtAGeneralPoint,
  findingInterceptsAndIntersectionsOfHyperbolas,
  transverseAxesOfHyperbolas,
  conjugateAxesOfHyperbolas,
  fociOfHyperbolas,
  eccentricityAndVerticesOfHyperbolas,
  directricesOfHyperbolas,
];
