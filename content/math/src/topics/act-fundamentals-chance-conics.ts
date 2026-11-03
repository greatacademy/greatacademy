import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Mark, type Point, Q, sketch } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// ACT Math Fundamentals, trigonometry, conics and probability: angles written as inverse tangents, features of a
// hyperbola recovered from the ones given, probability models built from stated relationships, and judging a model
// against simulated results.

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites,
    encompasses: [],
    xp: 10,
    standards: standards.map((s) => `CCSS.${s}`),
    knowledgePoints,
  };
}

/** kp builds a KnowledgePointDef. */
function kp(id: string, title: Text, explanation: Text, generate: (rng: Rng) => Problem): KnowledgePointDef {
  return { id, title, explanation, generate };
}

/** frac writes p/q in lowest terms. */
const frac = (p: number, q: number) => Q.of(p, q).toLatex();

// ---------------------------------------------------------------------------
// Inverse tangents

/** rightTriangleFigure draws right triangle ABC with the right angle at C and legs BC and AC labeled. */
function rightTriangleFigure(bc: number, ac: number): Figure {
  const [a, b, c]: [Point, Point, Point] = [
    [0, 0],
    [6, 3.6],
    [6, 0],
  ];
  const marks: Mark[] = [
    { kind: "polygon", points: [a, b, c] },
    { kind: "right", vertex: c, from: a, to: b },
    { kind: "arc", vertex: a, from: c, to: b },
    { kind: "label", at: a, text: "A", dir: "sw" },
    { kind: "label", at: b, text: "B", dir: "ne" },
    { kind: "label", at: c, text: "C", dir: "se" },
    { kind: "side", a: c, b, text: `${bc}` },
    { kind: "side", a, b: c, text: `${ac}` },
  ];
  return {
    svg: sketch(marks),
    alt: t(
      `Right triangle ABC with the right angle at C. Leg BC, opposite angle A, is ${bc}, and leg AC, next to angle A, is ${ac}.`,
      `直角三角形 ABC，直角在 C。∠A 的对边 BC 为 ${bc}，∠A 的邻边 AC 为 ${ac}。`,
    ),
  };
}

/** writingAnglesAsInverseTangents writes an angle of a right triangle, or of a line, as an inverse tangent. */
export const writingAnglesAsInverseTangents = topic(
  "writing-angles-as-inverse-tangents",
  t("Writing Angles as Inverse Tangents", "把角写成反正切"),
  t(
    "Write the measure of an acute angle in a right triangle, or the angle a line makes with the positive x-axis, as the inverse tangent of a ratio.",
    "把直角三角形中锐角的度数，或直线与 x 轴正方向所成的角，写成某个比值的反正切。",
  ),
  ["calculating-angles-in-right-triangles-using-trigonometry"],
  ["HSG.SRT.C.8"],
  [
    kp(
      "an-angle-from-its-legs",
      t("An angle from its legs", "由两条直角边写角"),
      t(
        "In a right triangle, $\\tan A = \\frac{\\text{opposite}}{\\text{adjacent}}$, so the angle itself is $A = \\tan^{-1}\\left(\\frac{\\text{opposite}}{\\text{adjacent}}\\right)$. If the leg opposite $A$ is $5$ and the leg next to it is $12$, then $A = \\tan^{-1}\\left(\\frac{5}{12}\\right)$. The ratio $\\frac{12}{5}$ gives the other acute angle, and $\\sin^{-1}$ would need the hypotenuse.",
        "在直角三角形中，$\\tan A = \\frac{\\text{对边}}{\\text{邻边}}$，所以角本身为 $A = \\tan^{-1}\\left(\\frac{\\text{对边}}{\\text{邻边}}\\right)$。若 $A$ 的对边为 $5$、邻边为 $12$，则 $A = \\tan^{-1}\\left(\\frac{5}{12}\\right)$。比值 $\\frac{12}{5}$ 给出的是另一个锐角，而用 $\\sin^{-1}$ 则需要斜边。",
      ),
      (rng) => {
        let [bc, ac] = [0, 0];
        do [bc, ac] = [rng.int(2, 15), rng.int(2, 15)];
        while (bc === ac || bc >= ac * 1.6 || ac >= bc * 3);
        const r = frac(bc, ac);
        const inv = frac(ac, bc);
        // Sine and cosine distractors keep their ratio below 1.
        const small = frac(Math.min(bc, ac), Math.max(bc, ac));
        return pickChoice(
          rng,
          t(
            `In right triangle $ABC$, the right angle is at $C$, $BC = ${bc}$ and $AC = ${ac}$. Which expression equals the measure of $\\angle A$?`,
            `在直角三角形 $ABC$ 中，直角在 $C$，$BC = ${bc}$，$AC = ${ac}$。哪个表达式等于 $\\angle A$ 的度数？`,
          ),
          mathText(`\\tan^{-1}\\left(${r}\\right)`),
          [
            mathText(`\\tan^{-1}\\left(${inv}\\right)`),
            mathText(`\\sin^{-1}\\left(${small}\\right)`),
            mathText(`\\cos^{-1}\\left(${small}\\right)`),
            mathText(`\\tan\\left(${r}\\right)`),
          ],
          t(
            `$BC$ is opposite $\\angle A$ and $AC$ is adjacent to it, so $\\tan A = \\frac{${bc}}{${ac}}$ and $A = \\tan^{-1}\\left(${r}\\right)$. Sine and cosine of $A$ would need the hypotenuse $AB$.`,
            `$BC$ 是 $\\angle A$ 的对边，$AC$ 是邻边，所以 $\\tan A = \\frac{${bc}}{${ac}}$，$A = \\tan^{-1}\\left(${r}\\right)$。$A$ 的正弦和余弦需要用到斜边 $AB$。`,
          ),
          rightTriangleFigure(bc, ac),
        );
      },
    ),
    kp(
      "the-angle-of-a-line",
      t("The angle of a line", "直线的倾斜角"),
      t(
        "A line with positive slope $m$ rises $m$ units for each unit it runs, so it makes an angle $\\theta$ with the positive $x$-axis where $\\tan\\theta = m$, that is $\\theta = \\tan^{-1}(m)$. The line through $(0, 0)$ and $(4, 3)$ has slope $\\frac{3}{4}$, so $\\theta = \\tan^{-1}\\left(\\frac{3}{4}\\right)$. The ratio is rise over run, $\\frac{\\Delta y}{\\Delta x}$.",
        "斜率为正数 $m$ 的直线每向右 $1$ 个单位上升 $m$ 个单位，所以它与 $x$ 轴正方向所成的角 $\\theta$ 满足 $\\tan\\theta = m$，即 $\\theta = \\tan^{-1}(m)$。过 $(0, 0)$ 和 $(4, 3)$ 的直线斜率为 $\\frac{3}{4}$，所以 $\\theta = \\tan^{-1}\\left(\\frac{3}{4}\\right)$。比值是纵向变化比横向变化，$\\frac{\\Delta y}{\\Delta x}$。",
      ),
      (rng) => {
        const [x1, y1] = [rng.int(-4, 3), rng.int(-4, 3)];
        let [dx, dy] = [0, 0];
        do [dx, dy] = [rng.int(1, 9), rng.int(1, 9)];
        while (dx === dy);
        const [x2, y2] = [x1 + dx, y1 + dy];
        const r = frac(dy, dx);
        const inv = frac(dx, dy);
        const small = frac(Math.min(dx, dy), Math.max(dx, dy));
        return pickChoice(
          rng,
          t(
            `A line passes through $(${x1}, ${y1})$ and $(${x2}, ${y2})$. Which expression equals the measure of the acute angle the line makes with the positive $x$-axis?`,
            `一条直线经过 $(${x1}, ${y1})$ 和 $(${x2}, ${y2})$。哪个表达式等于这条直线与 $x$ 轴正方向所成锐角的度数？`,
          ),
          mathText(`\\tan^{-1}\\left(${r}\\right)`),
          [
            mathText(`\\tan^{-1}\\left(${inv}\\right)`),
            mathText(`\\sin^{-1}\\left(${small}\\right)`),
            mathText(`\\tan\\left(${r}\\right)`),
            mathText(`\\cos^{-1}\\left(${small}\\right)`),
          ],
          t(
            `The slope is $\\frac{${y2} - ${y1 < 0 ? `(${y1})` : y1}}{${x2} - ${x1 < 0 ? `(${x1})` : x1}} = ${r}$, and the tangent of the angle is the slope, so the angle is $\\tan^{-1}\\left(${r}\\right)$.`,
            `斜率为 $\\frac{${y2} - ${y1 < 0 ? `(${y1})` : y1}}{${x2} - ${x1 < 0 ? `(${x1})` : x1}} = ${r}$，倾斜角的正切等于斜率，所以这个角为 $\\tan^{-1}\\left(${r}\\right)$。`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Hyperbolas

/** triples are whole numbers a, b, c with a² + b² = c², in both orders. */
const triples: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [4, 3, 5],
  [5, 12, 13],
  [12, 5, 13],
  [6, 8, 10],
  [8, 6, 10],
  [8, 15, 17],
  [15, 8, 17],
  [9, 12, 15],
  [12, 9, 15],
  [7, 24, 25],
  [24, 7, 25],
  [15, 20, 25],
  [20, 15, 25],
  [10, 24, 26],
  [24, 10, 26],
  [12, 16, 20],
  [16, 12, 20],
  [20, 21, 29],
  [21, 20, 29],
];

/** hyperbolaLatex writes the standard equation of a hyperbola centered at the origin. */
const hyperbolaLatex = (a: number, b: number, vertical: boolean) =>
  vertical ? `\\frac{y^{2}}{${a * a}} - \\frac{x^{2}}{${b * b}} = 1` : `\\frac{x^{2}}{${a * a}} - \\frac{y^{2}}{${b * b}} = 1`;

/** recoveringUnstatedFeaturesOfHyperbolas finds the parts of a hyperbola not given from those that are. */
export const recoveringUnstatedFeaturesOfHyperbolas = topic(
  "recovering-unstated-features-of-hyperbolas",
  t("Recovering Unstated Features of Hyperbolas", "求出双曲线未给出的特征"),
  t(
    "Use $c^{2} = a^{2} + b^{2}$ and the asymptote slopes $\\pm\\frac{b}{a}$ to find the equation, foci or asymptotes of a hyperbola centered at the origin from the features that are given.",
    "利用 $c^{2} = a^{2} + b^{2}$ 和渐近线斜率 $\\pm\\frac{b}{a}$，由已给出的特征求中心在原点的双曲线的方程、焦点或渐近线。",
  ),
  ["foci-of-hyperbolas", "asymptotes-of-hyperbolas-centered-at-the-origin"],
  ["HSG.GPE.A.3"],
  [
    kp(
      "the-equation-from-vertices-and-foci",
      t("The equation from vertices and foci", "由顶点和焦点求方程"),
      t(
        "For $\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$ the vertices are $(\\pm a, 0)$ and the foci are $(\\pm c, 0)$ with $c^{2} = a^{2} + b^{2}$. So with vertices $(\\pm 3, 0)$ and foci $(\\pm 5, 0)$: $b^{2} = 25 - 9 = 16$, and the equation is $\\frac{x^{2}}{9} - \\frac{y^{2}}{16} = 1$. For a hyperbola the foci are farther out than the vertices, so $c > a$; it is the ellipse that uses $c^{2} = a^{2} - b^{2}$.",
        "对于 $\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$，顶点为 $(\\pm a, 0)$，焦点为 $(\\pm c, 0)$，且 $c^{2} = a^{2} + b^{2}$。所以顶点为 $(\\pm 3, 0)$、焦点为 $(\\pm 5, 0)$ 时：$b^{2} = 25 - 9 = 16$，方程为 $\\frac{x^{2}}{9} - \\frac{y^{2}}{16} = 1$。双曲线的焦点比顶点更靠外，所以 $c > a$；用 $c^{2} = a^{2} - b^{2}$ 的是椭圆。",
      ),
      (rng) => {
        const [a, b, c] = rng.pick(triples);
        const vertical = rng.bool();
        const pt = (v: number) => (vertical ? `(0, \\pm ${v})` : `(\\pm ${v}, 0)`);
        const right = hyperbolaLatex(a, b, vertical);
        return pickChoice(
          rng,
          t(
            `A hyperbola centered at the origin has vertices $${pt(a)}$ and foci $${pt(c)}$. Which is its equation?`,
            `一条中心在原点的双曲线的顶点为 $${pt(a)}$，焦点为 $${pt(c)}$。它的方程是哪一个？`,
          ),
          mathText(right),
          [
            mathText(hyperbolaLatex(a, c, vertical)),
            mathText(hyperbolaLatex(a, b, !vertical)),
            mathText(
              vertical ? `\\frac{y^{2}}{${a * a}} - \\frac{x^{2}}{${c * c}} = 1` : `\\frac{x^{2}}{${c * c}} - \\frac{y^{2}}{${a * a}} = 1`,
            ),
            mathText(
              vertical ? `\\frac{y^{2}}{${a * a}} + \\frac{x^{2}}{${b * b}} = 1` : `\\frac{x^{2}}{${a * a}} + \\frac{y^{2}}{${b * b}} = 1`,
            ),
          ],
          t(
            `The vertices and foci lie on the ${vertical ? "$y$" : "$x$"}-axis, so the ${vertical ? "$y^{2}$" : "$x^{2}$"} term is positive, with $a = ${a}$ and $c = ${c}$. Then $b^{2} = c^{2} - a^{2} = ${c * c} - ${a * a} = ${b * b}$, and the equation is $${right}$.`,
            `顶点和焦点都在 ${vertical ? "$y$" : "$x$"} 轴上，所以 ${vertical ? "$y^{2}$" : "$x^{2}$"} 项为正，$a = ${a}$，$c = ${c}$。于是 $b^{2} = c^{2} - a^{2} = ${c * c} - ${a * a} = ${b * b}$，方程为 $${right}$。`,
          ),
        );
      },
    ),
    kp(
      "foci-from-a-vertex-and-an-asymptote",
      t("Foci from a vertex and an asymptote", "由顶点和渐近线求焦点"),
      t(
        "The asymptotes of $\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$ are $y = \\pm\\frac{b}{a}x$. With a vertex at $(4, 0)$ and an asymptote $y = \\frac{3}{4}x$: $a = 4$ and $\\frac{b}{4} = \\frac{3}{4}$, so $b = 3$, and $c = \\sqrt{16 + 9} = 5$. The foci are $(\\pm 5, 0)$. For a hyperbola that opens up and down, $\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 1$, the asymptotes are $y = \\pm\\frac{a}{b}x$ instead.",
        "$\\frac{x^{2}}{a^{2}} - \\frac{y^{2}}{b^{2}} = 1$ 的渐近线为 $y = \\pm\\frac{b}{a}x$。若一个顶点为 $(4, 0)$，一条渐近线为 $y = \\frac{3}{4}x$：$a = 4$，$\\frac{b}{4} = \\frac{3}{4}$，所以 $b = 3$，$c = \\sqrt{16 + 9} = 5$。焦点为 $(\\pm 5, 0)$。对于开口向上下的双曲线 $\\frac{y^{2}}{a^{2}} - \\frac{x^{2}}{b^{2}} = 1$，渐近线则为 $y = \\pm\\frac{a}{b}x$。",
      ),
      (rng) => {
        const [a, b, c] = rng.pick(triples);
        const vertical = rng.bool();
        // Horizontal: asymptote slope b/a; vertical: a/b.
        const slope = vertical ? frac(a, b) : frac(b, a);
        const vertex = vertical ? `(0, ${a})` : `(${a}, 0)`;
        return numberProblem({
          prompt: t(
            `A hyperbola centered at the origin has a vertex at $${vertex}$ and an asymptote $y = ${slope}x$. Its foci are at $${vertical ? "(0, \\pm c)" : "(\\pm c, 0)"}$. What is $c$?`,
            `一条中心在原点的双曲线有一个顶点 $${vertex}$，一条渐近线为 $y = ${slope}x$。它的焦点为 $${vertical ? "(0, \\pm c)" : "(\\pm c, 0)"}$。$c$ 是多少？`,
          ),
          answer: c,
          solveFor: "c",
          wrong: [b, a + b, ...(b > a ? [] : [Math.sqrt(a * a - b * b)].filter(Number.isInteger))],
          solution: t(
            vertical
              ? `The vertex gives $a = ${a}$. For a hyperbola opening up and down the asymptotes are $y = \\pm\\frac{a}{b}x$, so $\\frac{${a}}{b} = ${slope}$ and $b = ${b}$.${steps(`c = \\sqrt{a^{2} + b^{2}} = \\sqrt{${a * a} + ${b * b}} = ${c}`)}`
              : `The vertex gives $a = ${a}$. The asymptotes are $y = \\pm\\frac{b}{a}x$, so $\\frac{b}{${a}} = ${slope}$ and $b = ${b}$.${steps(`c = \\sqrt{a^{2} + b^{2}} = \\sqrt{${a * a} + ${b * b}} = ${c}`)}`,
            vertical
              ? `由顶点得 $a = ${a}$。开口向上下的双曲线的渐近线为 $y = \\pm\\frac{a}{b}x$，所以 $\\frac{${a}}{b} = ${slope}$，$b = ${b}$。${steps(`c = \\sqrt{a^{2} + b^{2}} = \\sqrt{${a * a} + ${b * b}} = ${c}`)}`
              : `由顶点得 $a = ${a}$。渐近线为 $y = \\pm\\frac{b}{a}x$，所以 $\\frac{b}{${a}} = ${slope}$，$b = ${b}$。${steps(`c = \\sqrt{a^{2} + b^{2}} = \\sqrt{${a * a} + ${b * b}} = ${c}`)}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Probability models from relationships

/** colorNames are the outcomes of the spinner problems. */
const colorNames: readonly Text[] = [t("red", "红色"), t("blue", "蓝色"), t("green", "绿色"), t("yellow", "黄色")];

/** constructingProbabilityModelsFromContext assigns probabilities from stated relationships between outcomes. */
export const constructingProbabilityModelsFromContext = topic(
  "constructing-probability-models-from-context",
  t("Constructing Probability Models From Context", "由情境构建概率模型"),
  t(
    "Assign probabilities to the outcomes of a chance process from stated relationships, such as one outcome being twice as likely as another, using the fact that the probabilities add to 1.",
    "利用各结果概率之和为 1，根据“一个结果的可能性是另一个的两倍”这类已知关系为随机过程的各结果分配概率。",
  ),
  ["analyzing-probability-models"],
  ["7.SP.C.7.B"],
  [
    kp(
      "outcomes-in-a-stated-proportion",
      t("Outcomes in a stated proportion", "按给定倍数关系的结果"),
      t(
        "Write every probability in terms of one unknown. If a spinner lands on red twice as often as blue and on green three times as often as blue, let $P(\\text{blue}) = p$: then red is $2p$ and green is $3p$. The probabilities add to $1$, so $p + 2p + 3p = 6p = 1$, $p = \\frac{1}{6}$, and $P(\\text{green}) = \\frac{3}{6} = \\frac{1}{2}$.",
        "把每个概率都用同一个未知数表示。若转盘停在红色的次数是蓝色的两倍，停在绿色的次数是蓝色的三倍，设 $P(\\text{蓝}) = p$：则红色为 $2p$，绿色为 $3p$。概率之和为 $1$，所以 $p + 2p + 3p = 6p = 1$，$p = \\frac{1}{6}$，$P(\\text{绿}) = \\frac{3}{6} = \\frac{1}{2}$。",
      ),
      (rng) => {
        const n = rng.pick([3, 4]);
        const multipliers = [1, ...rng.sample([2, 3, 4, 5], n - 1)];
        const sum = multipliers.reduce((x, y) => x + y, 0);
        const ask = rng.int(0, n - 1);
        const [base, ...others] = colorNames.slice(0, n);
        const relEn = others.map(
          (c, i) => `${multipliers[i + 1] === 2 ? "twice" : `${multipliers[i + 1]} times`} as likely to land on ${c.en} as on ${base!.en}`,
        );
        const relZh = others.map((c, i) => `停在${c["zh-CN"]}的可能性是${base!["zh-CN"]}的 ${multipliers[i + 1]} 倍`);
        const answer = Q.of(multipliers[ask]!, sum);
        const asked = colorNames[ask]!;
        return numberProblem({
          prompt: t(
            `A spinner can land only on ${colorNames
              .slice(0, n - 1)
              .map((c) => c.en)
              .join(
                ", ",
              )} or ${colorNames[n - 1]!.en}. It is ${relEn.join(", and ")}. What is the probability that it lands on ${asked.en}?`,
            `一个转盘只会停在${colorNames
              .slice(0, n)
              .map((c) => c["zh-CN"])
              .join("、")}上。它${relZh.join("，")}。它停在${asked["zh-CN"]}的概率是多少？`,
          ),
          answer,
          form: "fraction",
          wrong: [Q.of(1, n), Q.of(multipliers[ask]!, sum - multipliers[ask]!), Q.of(1, sum), Q.of(multipliers[ask]!, n)].filter(
            (w) => w.sign() > 0 && w.cmp(Q.one) < 0,
          ),
          solution: t(
            `Let $P(\\text{${base!.en}}) = p$. The probabilities are ${multipliers.map((m, i) => `$${m === 1 ? "" : m}p$ for ${colorNames[i]!.en}`).join(", ")}, and they add to $1$:${steps(`${multipliers.map((m) => `${m === 1 ? "" : m}p`).join(" + ")} = ${sum}p = 1`, `p = \\frac{1}{${sum}}`)}So $P(\\text{${asked.en}}) = ${multipliers[ask] === 1 ? "" : `${multipliers[ask]} \\cdot `}\\frac{1}{${sum}} = ${answer.toLatex()}$.`,
            `设 $P(\\text{${base!["zh-CN"]}}) = p$。各概率为${multipliers.map((m, i) => `${colorNames[i]!["zh-CN"]} $${m === 1 ? "" : m}p$`).join("，")}，它们之和为 $1$：${steps(`${multipliers.map((m) => `${m === 1 ? "" : m}p`).join(" + ")} = ${sum}p = 1`, `p = \\frac{1}{${sum}}`)}所以 $P(\\text{${asked["zh-CN"]}}) = ${multipliers[ask] === 1 ? "" : `${multipliers[ask]} \\cdot `}\\frac{1}{${sum}} = ${answer.toLatex()}$。`,
          ),
        });
      },
    ),
    kp(
      "a-weighted-die",
      t("A weighted die", "加权骰子"),
      t(
        "If a die is weighted so that $6$ is $3$ times as likely as each other face, and the other five faces are equally likely, let each other face have probability $p$. Then $5p + 3p = 8p = 1$, so $p = \\frac{1}{8}$ and $P(6) = \\frac{3}{8}$. An event made of several faces adds their probabilities: $P(\\text{even}) = \\frac{1}{8} + \\frac{1}{8} + \\frac{3}{8} = \\frac{5}{8}$.",
        "若一枚骰子经过加权，使 $6$ 点出现的可能性是其他每一面的 $3$ 倍，其他五面的可能性相同，设其他每一面的概率为 $p$。则 $5p + 3p = 8p = 1$，$p = \\frac{1}{8}$，$P(6) = \\frac{3}{8}$。由几面组成的事件，其概率是这几面概率之和：$P(\\text{偶数}) = \\frac{1}{8} + \\frac{1}{8} + \\frac{3}{8} = \\frac{5}{8}$。",
      ),
      (rng) => {
        const k = rng.int(2, 7);
        const face = rng.int(1, 6);
        const total = 5 + k;
        const event = rng.pick([
          { en: `rolling a ${face}`, zh: `掷出 ${face} 点`, faces: [face] },
          { en: "rolling an even number", zh: "掷出偶数", faces: [2, 4, 6] },
          { en: "rolling an odd number", zh: "掷出奇数", faces: [1, 3, 5] },
          { en: "rolling a number greater than 3", zh: "掷出大于 3 的数", faces: [4, 5, 6] },
          { en: "rolling a number less than 3", zh: "掷出小于 3 的数", faces: [1, 2] },
        ]);
        const weight = event.faces.reduce((s, f) => s + (f === face ? k : 1), 0);
        const answer = Q.of(weight, total);
        return numberProblem({
          prompt: t(
            `A six-sided die is weighted so that ${face} is ${k} times as likely to come up as each of the other faces, and the other five faces are equally likely. What is the probability of ${event.en}?`,
            `一枚六面骰子经过加权，使 ${face} 点出现的可能性是其他每一面的 ${k} 倍，其他五面出现的可能性相同。${event.zh}的概率是多少？`,
          ),
          answer,
          form: "fraction",
          wrong: [Q.of(event.faces.length, 6), Q.of(weight, 6 + k), Q.of(weight, 5 * k + 1), Q.of(event.faces.length, total)].filter(
            (w) => !w.eq(answer) && w.cmp(Q.one) < 0,
          ),
          solution: t(
            `Let each other face have probability $p$, so ${face} has $${k}p$. Then $5p + ${k}p = ${total}p = 1$ and $p = \\frac{1}{${total}}$. ${event.faces.length === 1 ? `So $P(${face}) = ${answer.toLatex()}$.` : `The event is the faces ${event.faces.join(", ")}, with total weight $${event.faces.map((f) => (f === face ? `${k}p` : "p")).join(" + ")} = ${weight}p$, so its probability is $${answer.toLatex()}$.`}`,
            `设其他每一面的概率为 $p$，则 ${face} 点为 $${k}p$。于是 $5p + ${k}p = ${total}p = 1$，$p = \\frac{1}{${total}}$。${event.faces.length === 1 ? `所以 $P(${face}) = ${answer.toLatex()}$。` : `这个事件包含 ${event.faces.join("、")} 点，总权重为 $${event.faces.map((f) => (f === face ? `${k}p` : "p")).join(" + ")} = ${weight}p$，所以概率为 $${answer.toLatex()}$。`}`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Evidence against a model

/** judgingEvidenceAgainstAProbabilityModel uses simulated results of a model to judge an observed result. */
export const judgingEvidenceAgainstAProbabilityModel = topic(
  "judging-evidence-against-a-probability-model",
  t("Judging Evidence Against a Probability Model", "判断反对概率模型的证据"),
  t(
    "Estimate from simulations of a model how often a result at least as extreme as an observed one happens, and decide whether the observed result is strong evidence against the model.",
    "由对模型的模拟估计出至少与观察结果一样极端的结果出现的频率，并判断观察结果是否构成反对该模型的有力证据。",
  ),
  ["analyzing-probability-models"],
  ["HSS.IC.A.2"],
  [
    kp(
      "how-often-the-model-gives-such-a-result",
      t("How often the model gives such a result", "模型给出这种结果的频率"),
      t(
        "To test a model, simulate it many times and count the runs whose result is at least as extreme as the one observed. Suppose $200$ simulated runs of $20$ fair coin flips gave $15$ heads in $3$ runs, $16$ heads in $1$ run and more than $16$ in none. A result of at least $15$ heads then happened in $3 + 1 = 4$ runs, so its estimated probability is $\\frac{4}{200} = 0.02$: add up the counts for every value at or beyond the observed one and divide by the number of runs. That fraction estimates how likely such a result is if the model is right.",
        "检验一个模型时，对它模拟很多次，数出结果至少与观察结果一样极端的次数。假设对 $20$ 次均匀硬币抛掷模拟 $200$ 轮，有 $3$ 轮出现 $15$ 次正面，$1$ 轮出现 $16$ 次，没有更多的。那么至少 $15$ 次正面出现了 $3 + 1 = 4$ 轮，估计概率为 $\\frac{4}{200} = 0.02$。一般地，把等于或超过观察值的每个值的次数加起来，再除以模拟的总次数。这个比例估计的是在模型正确时出现这种结果的可能性。",
      ),
      (rng) => {
        const runs = rng.pick([100, 200, 500]);
        const flips = rng.pick([10, 20]);
        const top = flips === 10 ? [7, 8, 9, 10] : [14, 15, 16, 17];
        const counts = (flips === 10 ? [0.117, 0.044, 0.01, 0.001] : [0.037, 0.015, 0.005, 0.001]).map((p, i) =>
          // Every count but the last is at least 1, so the asked tail is never empty.
          Math.max(i < 3 ? 1 : 0, Math.round(p * runs + rng.int(-2, 2))),
        );
        const from = rng.int(0, 2);
        const answer = Q.of(
          counts.slice(from).reduce((s, v) => s + v, 0),
          runs,
        );

        const lines = top.map((v, i) => `${v} heads in ${counts[i]} runs`).join(", ");
        const linesZh = top.map((v, i) => `${v} 次正面 ${counts[i]} 轮`).join("，");
        const hits = counts.slice(from).reduce((s, v) => s + v, 0);
        return numberProblem({
          prompt: t(
            `A fair coin was simulated by flipping it $${flips}$ times, and this was repeated for $${runs}$ runs. Among the runs with ${top[0]} or more heads there were ${lines}${flips === 20 ? ", and no run had more" : ""}. Based on the simulation, what is the estimated probability that a fair coin gives at least $${top[from]}$ heads in $${flips}$ flips? Give your answer as a decimal.`,
            `用 $${flips}$ 次抛掷模拟一枚均匀硬币，共重复 $${runs}$ 轮。正面次数达到 ${top[0]} 次或以上的轮次中，${linesZh}${flips === 20 ? "，没有更多的" : ""}。根据这次模拟，均匀硬币在 $${flips}$ 次抛掷中至少出现 $${top[from]}$ 次正面的估计概率是多少？用小数作答。`,
          ),
          answer,
          form: "decimal",
          wrong: [
            Q.of(counts[from]!, runs),
            Q.of(
              counts.reduce((s, v) => s + v, 0),
              runs,
            ),
            Q.of(hits, 100),
          ],
          solution: t(
            `Add the runs with ${top[from]} or more heads and divide by the number of runs:${steps(`\\frac{${counts.slice(from).join(" + ")}}{${runs}} = \\frac{${hits}}{${runs}} = ${hits / runs}`)}`,
            `把正面达到 ${top[from]} 次或以上的轮数相加，再除以总轮数：${steps(`\\frac{${counts.slice(from).join(" + ")}}{${runs}} = \\frac{${hits}}{${runs}} = ${hits / runs}`)}`,
          ),
        });
      },
    ),
    kp(
      "is-the-result-unusual-under-the-model",
      t("Is the result unusual under the model?", "在模型下这个结果是否异常"),
      t(
        "If results at least as extreme as the observed one almost never happen in simulations of the model (say in fewer than about $5\\%$ of runs), the observed result is strong evidence against the model. If they happen often, the result is consistent with the model, but that does not prove the model is right. A single surprising result never makes the model impossible, only doubtful.",
        "如果在对模型的模拟中，至少与观察结果一样极端的结果几乎从不出现（比如不到大约 $5\\%$ 的轮次），观察结果就是反对该模型的有力证据。如果这样的结果经常出现，观察结果与模型相符，但这并不证明模型正确。一次出人意料的结果不会使模型不可能成立，只会使它值得怀疑。",
      ),
      (rng) => {
        const runs = rng.pick([100, 200, 500, 1000]);
        const rare = rng.bool();
        const share = rare ? rng.pick([0.002, 0.005, 0.01, 0.02]) : rng.pick([0.15, 0.2, 0.3, 0.35, 0.4]);
        const count = Math.round(share * runs);
        const scenario = rng.pick([
          {
            claim: t("a coin is fair", "一枚硬币是均匀的"),
            observed: (v: number) => t(`flipping the coin $20$ times gave $${v}$ heads`, `把这枚硬币抛 $20$ 次得到 $${v}$ 次正面`),
            extreme: (v: number) => t(`$${v}$ or more heads`, `$${v}$ 次或更多正面`),
            values: rare ? [16, 17] : [11, 12, 13],
          },
          {
            claim: t("5% of the parts a machine makes are defective", "某台机器生产的零件有 5% 是次品"),
            observed: (v: number) => t(`a sample of $40$ parts had $${v}$ defective`, `抽取的 $40$ 个零件中有 $${v}$ 个次品`),
            extreme: (v: number) => t(`$${v}$ or more defective parts`, `$${v}$ 个或更多次品`),
            values: rare ? [7, 8, 9] : [2, 3],
          },
          {
            claim: t("a spinner lands on red one-third of the time", "一个转盘停在红色的概率是三分之一"),
            observed: (v: number) => t(`$30$ spins landed on red $${v}$ times`, `转 $30$ 次有 $${v}$ 次停在红色`),
            extreme: (v: number) => t(`$${v}$ or more reds`, `$${v}$ 次或更多红色`),
            values: rare ? [18, 19, 20] : [11, 12, 13],
          },
        ]);
        const v = rng.pick(scenario.values);
        const [observed, extreme] = [scenario.observed(v), scenario.extreme(v)];
        const pct = `${(share * 100).toFixed(share < 0.01 ? 1 : 0)}\\%`;
        const right = rare
          ? t(
              `Yes; results this extreme happened in only about $${pct}$ of the simulated runs.`,
              `是；这样极端的结果只在约 $${pct}$ 的模拟轮次中出现。`,
            )
          : t(
              `No; results this extreme happened in about $${pct}$ of the simulated runs, so the result is not unusual.`,
              `否；这样极端的结果在约 $${pct}$ 的模拟轮次中出现，所以这个结果并不罕见。`,
            );
        const wrong = rare
          ? [
              t("No; the simulated runs show that the result is possible under the model.", "否；模拟表明在该模型下这个结果是可能出现的。"),
              t("Yes; the result proves that the model is impossible.", "是；这个结果证明该模型不可能成立。"),
              t(
                `No; results this extreme happened in $${count}$ runs, which is more than zero.`,
                `否；这样极端的结果出现了 $${count}$ 轮，多于零轮。`,
              ),
            ]
          : [
              t(`Yes; the observed result differs from what the model predicts on average.`, `是；观察结果与模型的平均预测不同。`),
              t("No; the simulation proves that the model is correct.", "否；模拟证明该模型是正确的。"),
              t(`Yes; results this extreme happened in $${count}$ of the runs.`, `是；这样极端的结果出现了 $${count}$ 轮。`),
            ];
        return pickChoice(
          rng,
          t(
            `A claim says that ${scenario.claim.en}. To test it, ${observed.en}. In $${runs}$ simulated runs of the same experiment under the claim, $${count}$ runs gave ${extreme.en}. Is the observed result strong evidence against the claim?`,
            `有一种说法认为${scenario.claim["zh-CN"]}。为检验它，${observed["zh-CN"]}。在这一说法下把同样的试验模拟 $${runs}$ 轮，有 $${count}$ 轮出现 ${extreme["zh-CN"]}。观察结果是反对这一说法的有力证据吗？`,
          ),
          right,
          wrong,
          t(
            `Results this extreme happened in $\\frac{${count}}{${runs}} = ${pct}$ of the runs. ${rare ? "That is rare, so if the claim were true the observed result would be very unlikely: it is strong evidence against the claim, though it does not prove the claim false." : "That is common, so the observed result is consistent with the claim and gives no strong evidence against it, though it does not prove the claim either."}`,
            `这样极端的结果出现在 $\\frac{${count}}{${runs}} = ${pct}$ 的轮次中。${rare ? "这很罕见，所以如果这一说法正确，观察结果就很不可能出现：它是反对这一说法的有力证据，但并不证明这一说法错误。" : "这很常见，所以观察结果与这一说法相符，不构成反对它的有力证据，但也不能证明它正确。"}`,
          ),
        );
      },
    ),
  ],
);

/** actFundamentalsChanceConicsTopics are the ACT Math Fundamentals trigonometry, conics and probability topics. */
export const actFundamentalsChanceConicsTopics: TopicDef[] = [
  writingAnglesAsInverseTangents,
  recoveringUnstatedFeaturesOfHyperbolas,
  constructingProbabilityModelsFromContext,
  judgingEvidenceAgainstAProbabilityModel,
];
