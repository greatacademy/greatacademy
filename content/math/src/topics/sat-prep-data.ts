import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q, svgDocument } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";

// SAT Math Prep, geometry, data and problem solving: geometry problems that lead to quadratic equations, right triangles
// inside other triangles, bar graphs, probabilities from frequency tables, best-fit lines read from graphs whose axes do
// not start at zero and after the data are transformed, quadratic and exponential models, percentages of variables,
// successive percentage changes, and expressions with rates and ratios.

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

/** distinct drops the values equal to the answer or to an earlier value. */
function distinct(answer: Q, values: readonly Q[]): Q[] {
  const out: Q[] = [];
  for (const v of values) if (!v.eq(answer) && !out.some((o) => o.eq(v))) out.push(v);
  return out;
}

/** r rounds a coordinate to one decimal place. */
const r = (v: number) => Math.round(v * 10) / 10;

// ---------------------------------------------------------------------------
// Geometry

/** modelingGeometryProblemsWithQuadraticEquations writes and solves quadratic equations for areas of rectangles and frames. */
export const modelingGeometryProblemsWithQuadraticEquations = topic(
  "modeling-geometry-problems-with-quadratic-equations",
  t("Modeling Geometry Problems With Quadratic Equations", "用二次方程解几何问题"),
  t(
    "Write a quadratic equation for the area of a rectangle or a framed region, solve it, and keep the solution that makes sense as a length.",
    "为矩形或带边框区域的面积写出二次方程，解方程，并保留能作为长度的解。",
  ),
  ["solving-quadratic-equations-by-factoring", "area-of-rectangles-and-squares"],
  ["A-CED.A.1", "G-MG.A.3"],
  [
    kp(
      "rectangles-with-related-sides",
      t("Rectangles with related sides", "边长相关的矩形"),
      t(
        "If the length of a rectangle is $d$ more than its width $w$, its area is $w(w + d)$. Setting this equal to the given area gives a quadratic equation. For an area of $60$ and a length $4$ more than the width, $w^{2} + 4w - 60 = 0$ factors as $(w + 10)(w - 6) = 0$. A width cannot be negative, so $w = 6$.",
        "如果矩形的长比宽 $w$ 多 $d$，那么它的面积是 $w(w + d)$。令它等于给定的面积，就得到一个二次方程。若面积为 $60$，长比宽多 $4$，则 $w^{2} + 4w - 60 = 0$ 分解为 $(w + 10)(w - 6) = 0$。宽不能为负，所以 $w = 6$。",
      ),
      (rng) => {
        const w = rng.int(2, 15);
        const d = rng.int(1, 9);
        const area = w * (w + d);
        const askLength = rng.bool();
        const answer = askLength ? w + d : w;
        const thing = rng.pick([
          { en: "A rectangular garden", zh: "一个矩形花园", unit: "square meters", unitZh: "平方米" },
          { en: "A rectangular rug", zh: "一块矩形地毯", unit: "square feet", unitZh: "平方英尺" },
          { en: "A rectangular poster", zh: "一张矩形海报", unit: "square inches", unitZh: "平方英寸" },
        ]);
        return numberProblem({
          prompt: t(
            `${thing.en} has an area of $${area}$ ${thing.unit}. Its length is $${d}$ more than its width. What is its ${askLength ? "length" : "width"}?`,
            `${thing.zh}的面积为 $${area}$ ${thing.unitZh}，长比宽多 $${d}$。它的${askLength ? "长" : "宽"}是多少？`,
          ),
          answer,
          form: "integer",
          wrong: distinct(Q.of(answer), [Q.of(askLength ? w : w + d), Q.of(w + 2 * d), Q.of(area - d), Q.of(area, 2)]),
          solution: t(
            `Let $w$ be the width. Then${steps(`w(w + ${d}) = ${area}`, `w^{2} + ${d}w - ${area} = 0`, `(w + ${w + d})(w - ${w}) = 0`)}The width is positive, so $w = ${w}$${askLength ? ` and the length is $${w} + ${d} = ${w + d}$` : ""}.`,
            `设宽为 $w$，则${steps(`w(w + ${d}) = ${area}`, `w^{2} + ${d}w - ${area} = 0`, `(w + ${w + d})(w - ${w}) = 0`)}宽为正数，所以 $w = ${w}$${askLength ? `，长为 $${w} + ${d} = ${w + d}$` : ""}。`,
          ),
        });
      },
    ),
    kp(
      "uniform-borders",
      t("Uniform borders", "宽度均匀的边框"),
      t(
        "A border of width $x$ around an $a$ by $b$ rectangle adds $x$ on each side, so the outer rectangle is $(a + 2x)$ by $(b + 2x)$. If a $6$ by $4$ photo with its frame has a total area of $80$, then $(6 + 2x)(4 + 2x) = 80$, which simplifies to $x^{2} + 5x - 14 = 0$ and $(x + 7)(x - 2) = 0$. The border width is $x = 2$.",
        "宽为 $x$ 的边框围在 $a \\times b$ 的矩形外面，每条边都增加 $x$，所以外面的矩形是 $(a + 2x) \\times (b + 2x)$。若 $6 \\times 4$ 的照片连同相框的总面积为 $80$，则 $(6 + 2x)(4 + 2x) = 80$，化简为 $x^{2} + 5x - 14 = 0$，即 $(x + 7)(x - 2) = 0$。边框宽 $x = 2$。",
      ),
      (rng) => {
        const half = rng.int(2, 9);
        const a = 2 * half + 2 * rng.int(0, 4);
        const b = 2 * half;
        const x = rng.int(1, 5);
        const total = (a + 2 * x) * (b + 2 * x);
        // (a + 2x)(b + 2x) = total ⇔ x² + ((a + b)/2)x + (ab − total)/4 = 0.
        const p = (a + b) / 2;
        const c = (a * b - total) / 4;
        const other = -p - x;
        return numberProblem({
          prompt: t(
            `A rectangular painting $${a}$ inches wide and $${b}$ inches tall is surrounded by a frame of uniform width $x$ inches. The painting and frame together cover $${total}$ square inches. What is the value of $x$?`,
            `一幅宽 $${a}$ 英寸、高 $${b}$ 英寸的矩形画被宽度均匀为 $x$ 英寸的画框围住。画和画框一共占 $${total}$ 平方英寸。求 $x$ 的值。`,
          ),
          answer: x,
          form: "integer",
          wrong: distinct(Q.of(x), [Q.of(2 * x), Q.of(total - a * b, 2 * (a + b)), Q.of(-other), Q.of(x + 1)]),
          solution: t(
            `The outer rectangle is $${a} + 2x$ by $${b} + 2x$:${steps(`(${a} + 2x)(${b} + 2x) = ${total}`, `4x^{2} + ${2 * (a + b)}x + ${a * b} = ${total}`, `x^{2} + ${p}x - ${-c} = 0`, `(x + ${-other})(x - ${x}) = 0`)}A width is positive, so $x = ${x}$.`,
            `外面的矩形是 $(${a} + 2x) \\times (${b} + 2x)$：${steps(`(${a} + 2x)(${b} + 2x) = ${total}`, `4x^{2} + ${2 * (a + b)}x + ${a * b} = ${total}`, `x^{2} + ${p}x - ${-c} = 0`, `(x + ${-other})(x - ${x}) = 0`)}宽度为正数，所以 $x = ${x}$。`,
          ),
        });
      },
    ),
  ],
);

/** primitiveTriples are right triangles with whole sides, as [leg, leg, hypotenuse]. */
const primitiveTriples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [9, 40, 41],
] as const;

/** byLeg maps a leg length up to 60 to the [other leg, hypotenuse] of every whole right triangle with that leg. */
const byLeg = (() => {
  const map = new Map<number, [number, number][]>();
  for (const [p, q, h] of primitiveTriples)
    for (let k = 1; k * Math.min(p, q) <= 60; k++)
      for (const [leg, other] of [
        [p, q],
        [q, p],
      ] as const) {
        if (k * leg > 60) continue;
        const list = map.get(k * leg) ?? [];
        if (!list.some(([o]) => o === k * other)) list.push([k * other, k * h]);
        map.set(k * leg, list);
      }
  return [...map.entries()].filter(([, list]) => list.length >= 2);
})();

/** embeddedFigure draws triangle ABC with the altitude AD to BC, D between B and C. */
function embeddedFigure(bd: number, dc: number, ad: number, labels: Text): Figure {
  const scale = 240 / Math.max(bd + dc, ad * 1.6);
  const [bx, by] = [40, 20 + ad * scale];
  const dx = r(bx + bd * scale);
  const cx = r(dx + dc * scale);
  const ay = 20;
  const box = 8;
  const body =
    `<path d="M${bx} ${r(by)} L${dx} ${ay} L${cx} ${r(by)} Z"/>` +
    `<line x1="${dx}" y1="${ay}" x2="${dx}" y2="${r(by)}" stroke-dasharray="4 3"/>` +
    `<path d="M${dx} ${r(by - box)} L${r(dx + box)} ${r(by - box)} L${r(dx + box)} ${r(by)}" stroke-width="1"/>` +
    `<text x="${dx}" y="${ay - 6}">A</text><text x="${bx - 10}" y="${r(by + 4)}">B</text>` +
    `<text x="${dx}" y="${r(by + 16)}">D</text><text x="${cx + 10}" y="${r(by + 4)}">C</text>`;
  return { svg: svgDocument(Math.ceil(by + 24), body), alt: labels };
}

/** solvingProblemsWithEmbeddedRightTriangles solves triangles split by an altitude into two right triangles. */
export const solvingProblemsWithEmbeddedRightTriangles = topic(
  "solving-problems-with-embedded-right-triangles",
  t("Solving Problems With Embedded Right Triangles", "解含有嵌套直角三角形的问题"),
  t(
    "Split a triangle along an altitude into two right triangles that share a leg, and use the Pythagorean theorem and similarity to find lengths.",
    "沿高把三角形分成两个共用一条直角边的直角三角形，用勾股定理和相似求出长度。",
  ),
  ["the-pythagorean-theorem", "the-aa-similarity-criterion"],
  ["G-SRT.B.5", "8.G.B.7"],
  [
    kp(
      "two-right-triangles-sharing-a-leg",
      t("Two right triangles sharing a leg", "共用一条直角边的两个直角三角形"),
      t(
        "An altitude $AD$ from $A$ to side $BC$ splits triangle $ABC$ into two right triangles, $ABD$ and $ACD$, which share the leg $AD$. Use the Pythagorean theorem in each one: $BD = \\sqrt{AB^{2} - AD^{2}}$ and $DC = \\sqrt{AC^{2} - AD^{2}}$. When $D$ lies between $B$ and $C$, the base is $BC = BD + DC$. With $AB = 15$, $AC = 13$ and $AD = 12$, $BD = 9$, $DC = 5$ and $BC = 14$.",
        "从 $A$ 到边 $BC$ 的高 $AD$ 把三角形 $ABC$ 分成两个直角三角形 $ABD$ 和 $ACD$，它们共用直角边 $AD$。在每个三角形中用勾股定理：$BD = \\sqrt{AB^{2} - AD^{2}}$，$DC = \\sqrt{AC^{2} - AD^{2}}$。当 $D$ 在 $B$、$C$ 之间时，底边 $BC = BD + DC$。若 $AB = 15$、$AC = 13$、$AD = 12$，则 $BD = 9$，$DC = 5$，$BC = 14$。",
      ),
      (rng) => {
        const [ad, list] = rng.pick(byLeg);
        const [[bd, ab], [dc, ac]] = rng.sample(list, 2) as [[number, number], [number, number]];
        const askArea = rng.bool(0.3);
        const bc = bd + dc;
        const answer = askArea ? Q.of(bc * ad, 2) : Q.of(bc);
        return {
          ...numberProblem({
            prompt: t(
              `In triangle $ABC$, point $D$ lies on $\\overline{BC}$ and $\\overline{AD}$ is perpendicular to $\\overline{BC}$. If $AB = ${ab}$, $AC = ${ac}$ and $AD = ${ad}$, what is ${askArea ? "the area of triangle $ABC$" : "the length of $\\overline{BC}$"}?`,
              `在三角形 $ABC$ 中，点 $D$ 在 $\\overline{BC}$ 上，且 $\\overline{AD}$ 垂直于 $\\overline{BC}$。若 $AB = ${ab}$、$AC = ${ac}$、$AD = ${ad}$，求${askArea ? "三角形 $ABC$ 的面积" : " $\\overline{BC}$ 的长度"}。`,
            ),
            answer,
            wrong: distinct(
              answer,
              askArea
                ? [Q.of(bc * ad), Q.of(ab * ac, 2), Q.of(bd * ad, 2)]
                : [Q.of(ab + ac - ad), Q.of(Math.abs(bd - dc)), Q.of(ab + ac), Q.of(bd)],
            ),
            solution: t(
              `In right triangle $ABD$, $BD = \\sqrt{${ab}^{2} - ${ad}^{2}} = ${bd}$. In right triangle $ACD$, $DC = \\sqrt{${ac}^{2} - ${ad}^{2}} = ${dc}$. So $BC = ${bd} + ${dc} = ${bc}$${askArea ? `, and the area is $\\frac{1}{2} \\cdot ${bc} \\cdot ${ad} = ${answer.toLatex()}$` : ""}.`,
              `在直角三角形 $ABD$ 中，$BD = \\sqrt{${ab}^{2} - ${ad}^{2}} = ${bd}$；在直角三角形 $ACD$ 中，$DC = \\sqrt{${ac}^{2} - ${ad}^{2}} = ${dc}$。所以 $BC = ${bd} + ${dc} = ${bc}$${askArea ? `，面积为 $\\frac{1}{2} \\cdot ${bc} \\cdot ${ad} = ${answer.toLatex()}$` : ""}。`,
            ),
          }),
          figure: embeddedFigure(
            bd,
            dc,
            ad,
            t(
              "Triangle ABC with the altitude AD drawn from A perpendicular to side BC, meeting it at D between B and C.",
              "三角形 ABC，从 A 向边 BC 作垂线 AD，垂足 D 在 B、C 之间。",
            ),
          ),
        };
      },
    ),
    kp(
      "the-altitude-to-the-hypotenuse",
      t("The altitude to the hypotenuse", "斜边上的高"),
      t(
        "In a right triangle, the altitude to the hypotenuse makes two smaller right triangles that are similar to each other and to the whole triangle. If the altitude $h$ divides the hypotenuse into pieces $p$ and $q$, similarity gives $\\frac{p}{h} = \\frac{h}{q}$, so $h^{2} = pq$. Pieces of $4$ and $9$ give an altitude of $\\sqrt{36} = 6$.",
        "在直角三角形中，斜边上的高把它分成两个较小的直角三角形，它们彼此相似，也都与原三角形相似。若高 $h$ 把斜边分成 $p$ 和 $q$ 两段，由相似得 $\\frac{p}{h} = \\frac{h}{q}$，所以 $h^{2} = pq$。两段分别为 $4$ 和 $9$ 时，高为 $\\sqrt{36} = 6$。",
      ),
      (rng) => {
        const h = rng.int(2, 20);
        const ds: number[] = [];
        for (let p = 1; p < h; p++) if ((h * h) % p === 0) ds.push(p);
        if (ds.length === 0) return solvingProblemsWithEmbeddedRightTriangles.knowledgePoints[1]!.generate(rng);
        const p = rng.pick(ds);
        const q = (h * h) / p;
        const askAltitude = rng.bool();
        const answer = askAltitude ? h : q;
        return {
          ...numberProblem({
            prompt: askAltitude
              ? t(
                  `In right triangle $ABC$, the right angle is at $A$, and $\\overline{AD}$ is the altitude to the hypotenuse $\\overline{BC}$. If $BD = ${p}$ and $DC = ${q}$, what is $AD$?`,
                  `在直角三角形 $ABC$ 中，直角在 $A$，$\\overline{AD}$ 是斜边 $\\overline{BC}$ 上的高。若 $BD = ${p}$、$DC = ${q}$，求 $AD$。`,
                )
              : t(
                  `In right triangle $ABC$, the right angle is at $A$, and $\\overline{AD}$ is the altitude to the hypotenuse $\\overline{BC}$. If $BD = ${p}$ and $AD = ${h}$, what is $DC$?`,
                  `在直角三角形 $ABC$ 中，直角在 $A$，$\\overline{AD}$ 是斜边 $\\overline{BC}$ 上的高。若 $BD = ${p}$、$AD = ${h}$，求 $DC$。`,
                ),
            answer,
            form: "integer",
            wrong: distinct(
              Q.of(answer),
              askAltitude ? [Q.of(p + q, 2), Q.of(p * q), Q.of(q - p)] : [Q.of(h - p), Q.of(h * p), Q.of(h + p), Q.of(h * h)],
            ),
            solution: askAltitude
              ? t(
                  `Triangles $ABD$ and $CAD$ are similar, so $\\frac{BD}{AD} = \\frac{AD}{DC}$ and $AD^{2} = ${p} \\cdot ${q} = ${h * h}$. So $AD = ${h}$.`,
                  `三角形 $ABD$ 与 $CAD$ 相似，所以 $\\frac{BD}{AD} = \\frac{AD}{DC}$，$AD^{2} = ${p} \\cdot ${q} = ${h * h}$。所以 $AD = ${h}$。`,
                )
              : t(
                  `Triangles $ABD$ and $CAD$ are similar, so $AD^{2} = BD \\cdot DC$: $${h * h} = ${p} \\cdot DC$, which gives $DC = ${q}$.`,
                  `三角形 $ABD$ 与 $CAD$ 相似，所以 $AD^{2} = BD \\cdot DC$：$${h * h} = ${p} \\cdot DC$，得 $DC = ${q}$。`,
                ),
          }),
          figure: embeddedFigure(
            p,
            q,
            h,
            t(
              "Right triangle ABC with the right angle at A and the altitude AD drawn to the hypotenuse BC.",
              "直角三角形 ABC，直角在 A，从 A 向斜边 BC 作高 AD。",
            ),
          ),
        };
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Bar graphs and frequency tables

/** BarSet is a bar graph: what is counted, the categories and the values on a scale with a gridline every step. */
interface BarSet {
  readonly en: string;
  readonly zh: string;
  readonly names: readonly string[];
  readonly values: readonly number[];
  readonly step: number;
}

/** barSvg draws vertical bars labeled with the category names, over a value scale with a gridline every step. */
function barSvg(d: BarSet): string {
  const top = Math.max(...d.values);
  const lines = Math.ceil(top / d.step);
  const max = lines * d.step;
  const [x0, x1, y0, y1] = [48, 304, 170, 14];
  const slot = (x1 - x0) / d.values.length;
  const y = (v: number) => r(y0 - (v / max) * (y0 - y1));
  let out = "";
  for (let k = 1; k <= lines; k++)
    out += `<line x1="${x0}" y1="${y(k * d.step)}" x2="${x1}" y2="${y(k * d.step)}" stroke-width="0.4" stroke-dasharray="2 2"/>`;
  const every = lines > 10 ? 2 : 1;
  for (let k = 0; k <= lines; k += every)
    out += `<line x1="${x0 - 4}" y1="${y(k * d.step)}" x2="${x0}" y2="${y(k * d.step)}"/><text x="${x0 - 8}" y="${y(k * d.step) + 4}" text-anchor="end">${k * d.step}</text>`;
  for (const [i, v] of d.values.entries()) {
    const bx = r(x0 + i * slot + slot * 0.2);
    out += `<rect class="accent" x="${bx}" y="${y(v)}" width="${r(slot * 0.6)}" height="${r(y0 - y(v))}" fill="currentColor" fill-opacity="0.25"/>`;
    out += `<text x="${r(x0 + (i + 0.5) * slot)}" y="${y0 + 18}">${d.names[i]}</text>`;
  }
  out += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1 - 6}"/>`;
  return svgDocument(y0 + 26, out);
}

/** barFigure draws a bar graph, with alt text giving each bar. */
function barFigure(d: BarSet): Figure {
  return {
    svg: barSvg(d),
    alt: t(
      `Bar graph of ${d.en}: ${d.names.map((n, i) => `${n} ${d.values[i]}`).join(", ")}.`,
      `${d.zh}的条形图：${d.names.map((n, i) => `${n} ${d.values[i]}`).join("，")}。`,
    ),
  };
}

/** barContexts are what a bar graph counts, for categories named by letters. */
const barContexts = [
  { en: "the number of books sold by five stores", zh: "五家书店售出的图书数量", who: "store", whoZh: "书店" },
  { en: "the number of members in five clubs", zh: "五个社团的成员人数", who: "club", whoZh: "社团" },
  { en: "the number of goals scored by five teams", zh: "五支球队的进球数", who: "team", whoZh: "球队" },
] as const;

/** barSet draws the values of a bar graph with five categories. */
function barSet(rng: Rng): BarSet & { readonly who: string; readonly whoZh: string } {
  const ctx = rng.pick(barContexts);
  const step = rng.pick([1, 2, 5, 10]);
  const values = Array.from({ length: 5 }, () => step * rng.int(1, 10));
  return { en: ctx.en, zh: ctx.zh, names: ["A", "B", "C", "D", "E"], values, step, who: ctx.who, whoZh: ctx.whoZh };
}

/** barGraphs reads totals, differences and percentages from bar graphs. */
export const barGraphs = topic(
  "bar-graphs",
  t("Bar Graphs", "条形图"),
  t(
    "Read values from a bar graph using its scale, and combine them into totals, differences and percentages.",
    "根据刻度从条形图中读出数值，并由此求出总和、差和百分比。",
  ),
  ["frequency-tables", "finding-a-percentage-given-two-numbers"],
  ["6.SP.B.4", "S-ID.A.1"],
  [
    kp(
      "reading-a-bar-graph",
      t("Reading values from a bar graph", "从条形图中读数"),
      t(
        "A bar graph shows a value for each category by the height of its bar. Read the height against the scale on the vertical axis, and check how much each gridline is worth: if the gridlines are $5$ apart, a bar reaching the fourth line stands for $20$. Then add or subtract the values you read to answer the question.",
        "条形图用每个条形的高度表示每一类的数值。对照纵轴的刻度读出高度，并注意每条网格线代表多少：若网格线间隔为 $5$，到达第四条线的条形表示 $20$。然后把读出的数值相加或相减来回答问题。",
      ),
      (rng) => {
        const d = barSet(rng);
        const [i, j] = rng.sample([0, 1, 2, 3, 4], 2) as [number, number];
        const askTotal = rng.bool();
        const vi = d.values[i]!;
        const vj = d.values[j]!;
        if (!askTotal && vi === vj) return barGraphs.knowledgePoints[0]!.generate(rng);
        const answer = askTotal ? vi + vj : Math.abs(vi - vj);
        const [hi, lo] = vi > vj ? [i, j] : [j, i];
        return {
          ...numberProblem({
            prompt: askTotal
              ? t(
                  `The bar graph shows ${d.en}. What is the total for ${d.who}s ${d.names[i]} and ${d.names[j]}?`,
                  `条形图显示了${d.zh}。${d.whoZh} ${d.names[i]} 与 ${d.names[j]} 的总数是多少？`,
                )
              : t(
                  `The bar graph shows ${d.en}. How much greater is the value for ${d.who} ${d.names[hi]} than for ${d.who} ${d.names[lo]}?`,
                  `条形图显示了${d.zh}。${d.whoZh} ${d.names[hi]} 的数值比${d.whoZh} ${d.names[lo]} 多多少？`,
                ),
            answer,
            form: "integer",
            wrong: distinct(Q.of(answer), [
              Q.of(askTotal ? Math.abs(vi - vj) : vi + vj),
              Q.of((vi + vj) / d.step),
              Q.of(Math.abs(vi - vj) / d.step),
            ]),
            solution: t(
              `Each gridline is worth $${d.step}$. ${d.who[0]!.toUpperCase()}${d.who.slice(1)} ${d.names[i]} has $${vi}$ and ${d.who} ${d.names[j]} has $${vj}$, so the ${askTotal ? `total is $${vi} + ${vj} = ${answer}$` : `difference is $${Math.max(vi, vj)} - ${Math.min(vi, vj)} = ${answer}$`}.`,
              `每条网格线代表 $${d.step}$。${d.whoZh} ${d.names[i]} 为 $${vi}$，${d.whoZh} ${d.names[j]} 为 $${vj}$，所以${askTotal ? `总数为 $${vi} + ${vj} = ${answer}$` : `差为 $${Math.max(vi, vj)} - ${Math.min(vi, vj)} = ${answer}$`}。`,
            ),
          }),
          figure: barFigure(d),
        };
      },
    ),
    kp(
      "percentages-from-a-bar-graph",
      t("Percentages from a bar graph", "由条形图求百分比"),
      t(
        "To find what percent of the whole one category is, add the heights of all the bars to get the total, divide the category's value by the total, and multiply by $100$. If five bars show $10$, $20$, $5$, $10$ and $5$, the total is $50$, so the first category is $\\frac{10}{50} = 20\\%$ of the whole.",
        "要求某一类占总体的百分比，先把所有条形的高度相加得到总数，再用这一类的数值除以总数并乘以 $100$。若五个条形分别为 $10$、$20$、$5$、$10$、$5$，总数为 $50$，第一类占总体的 $\\frac{10}{50} = 20\\%$。",
      ),
      (rng) => {
        const d = barSet(rng);
        const total = d.values.reduce((s, v) => s + v, 0);
        const i = rng.int(0, 4);
        const pct = Q.of(100 * d.values[i]!, total);
        if (!pct.mul(Q.of(10)).isInteger()) return barGraphs.knowledgePoints[1]!.generate(rng);
        return {
          ...numberProblem({
            prompt: t(
              `The bar graph shows ${d.en}. What percent of the total belongs to ${d.who} ${d.names[i]}?`,
              `条形图显示了${d.zh}。${d.whoZh} ${d.names[i]} 占总数的百分之几？`,
            ),
            answer: pct,
            form: "decimal",
            unit: "%",
            wrong: distinct(pct, [Q.of(d.values[i]!), Q.of(100 * d.values[i]!, Math.max(...d.values)), Q.of(20)]),
            solution: t(
              `The total is $${d.values.join(" + ")} = ${total}$, so ${d.who} ${d.names[i]} has $\\frac{${d.values[i]}}{${total}} \\cdot 100 = ${dec(pct)}\\%$ of it.`,
              `总数为 $${d.values.join(" + ")} = ${total}$，所以${d.whoZh} ${d.names[i]} 占 $\\frac{${d.values[i]}}{${total}} \\cdot 100 = ${dec(pct)}\\%$。`,
            ),
          }),
          figure: barFigure(d),
        };
      },
    ),
  ],
);

/** freqTable writes a frequency table of values and how often each occurs. */
function freqTable(head: Text, values: readonly number[], freqs: readonly number[]): Text {
  const row = (h: string, xs: readonly (number | string)[]) => `${h} & ${xs.join(" & ")}`;
  const make = (h: string, f: string) =>
    `$$\\begin{array}{c|${"c".repeat(values.length)}} ${row(`\\text{${h}}`, values)} \\\\ \\hline ${row(`\\text{${f}}`, freqs)} \\end{array}$$`;
  return t(make(head.en, "Frequency"), make(head["zh-CN"], "频数"));
}

/** freqContexts are the data a frequency table counts. */
const freqContexts = [
  {
    head: t("Pets", "宠物数"),
    en: "the number of pets owned by each student in a class",
    zh: "某班每位学生养的宠物数",
    one: "student",
    ones: "students",
    oneZh: "学生",
    what: "pets",
    whatZh: "只宠物",
  },
  {
    head: t("Siblings", "兄弟姐妹数"),
    en: "the number of siblings of each person in a group",
    zh: "一组人中每个人的兄弟姐妹数",
    one: "person",
    ones: "people",
    oneZh: "人",
    what: "siblings",
    whatZh: "个兄弟姐妹",
  },
  {
    head: t("Books", "图书数"),
    en: "the number of books each member of a club read last month",
    zh: "某社团每位成员上个月读的图书数",
    one: "member",
    ones: "members",
    oneZh: "成员",
    what: "books",
    whatZh: "本书",
  },
] as const;

/** calculatingProbabilitiesFromFrequencyTables finds probabilities of events from frequency tables. */
export const calculatingProbabilitiesFromFrequencyTables = topic(
  "calculating-probabilities-from-frequency-tables",
  t("Calculating Probabilities From Frequency Tables", "由频数表计算概率"),
  t(
    "Find the probability that a randomly chosen member of a data set has a given value or a value in a given range.",
    "求从数据集中随机选出的成员取某个值或落在某个范围内的概率。",
  ),
  ["frequency-tables", "single-events-in-probability"],
  ["S-CP.A.4", "7.SP.C.5"],
  [
    kp(
      "probability-of-a-value",
      t("The probability of one value", "取某个值的概率"),
      t(
        "If one member of a data set is chosen at random, each member is equally likely. The probability of a value is its frequency divided by the total of all the frequencies. In a table where $6$ of $30$ students own exactly $2$ pets, the probability that a randomly chosen student owns $2$ pets is $\\frac{6}{30} = \\frac{1}{5}$.",
        "从数据集中随机选出一个成员时，每个成员被选中的可能性相同。某个值的概率等于它的频数除以所有频数的总和。若表中 $30$ 名学生里有 $6$ 名恰好养 $2$ 只宠物，那么随机选出的学生养 $2$ 只宠物的概率是 $\\frac{6}{30} = \\frac{1}{5}$。",
      ),
      (rng) => {
        const ctx = rng.pick(freqContexts);
        const values = [0, 1, 2, 3, 4];
        const freqs = values.map(() => rng.int(1, 15));
        const total = freqs.reduce((s, f) => s + f, 0);
        const v = rng.int(0, 4);
        const answer = Q.of(freqs[v]!, total);
        return numberProblem({
          prompt: t(
            `The table shows ${ctx.en}. ${freqTable(ctx.head, values, freqs).en}If one ${ctx.one} is chosen at random, what is the probability that the ${ctx.one} has exactly $${v}$ ${ctx.what}?`,
            `下表给出${ctx.zh}。${freqTable(ctx.head, values, freqs)["zh-CN"]}随机选出一名${ctx.oneZh}，这名${ctx.oneZh}恰好有 $${v}$ ${ctx.whatZh}的概率是多少？`,
          ),
          answer,
          form: "fraction",
          wrong: distinct(answer, [Q.of(freqs[v]!, 100), Q.of(1, 5), Q.of(v, total), Q.of(freqs[v]!, total - freqs[v]!)]),
          solution: t(
            `There are $${freqs.join(" + ")} = ${total}$ ${ctx.ones} in all, and $${freqs[v]}$ of them have $${v}$ ${ctx.what}. The probability is $\\frac{${freqs[v]}}{${total}}${answer.d === BigInt(total) ? "" : ` = ${answer.toLatex()}`}$.`,
            `总共有 $${freqs.join(" + ")} = ${total}$ 名${ctx.oneZh}，其中 $${freqs[v]}$ 名有 $${v}$ ${ctx.whatZh}。概率为 $\\frac{${freqs[v]}}{${total}}${answer.d === BigInt(total) ? "" : ` = ${answer.toLatex()}`}$。`,
          ),
        });
      },
    ),
    kp(
      "probability-of-a-range-of-values",
      t("The probability of a range of values", "落在某个范围内的概率"),
      t(
        'For an event such as "at least $2$" or "fewer than $2$", add the frequencies of every value that satisfies it, then divide by the total. "At least $2$" includes $2$ itself, while "more than $2$" does not. If the frequencies of $2$, $3$ and $4$ are $5$, $3$ and $2$ out of $25$, then the probability of at least $2$ is $\\frac{10}{25} = \\frac{2}{5}$.',
        "对于“至少 $2$”或“少于 $2$”这样的事件，把满足条件的每个值的频数相加，再除以总数。“至少 $2$”包括 $2$ 本身，而“多于 $2$”不包括。若 $25$ 个数据中 $2$、$3$、$4$ 的频数分别为 $5$、$3$、$2$，则至少为 $2$ 的概率是 $\\frac{10}{25} = \\frac{2}{5}$。",
      ),
      (rng) => {
        const ctx = rng.pick(freqContexts);
        const values = [0, 1, 2, 3, 4];
        const freqs = values.map(() => rng.int(1, 15));
        const total = freqs.reduce((s, f) => s + f, 0);
        const k = rng.int(1, 3);
        const kind = rng.pick(["atLeast", "moreThan", "fewerThan"] as const);
        const keep = (v: number) => (kind === "atLeast" ? v >= k : kind === "moreThan" ? v > k : v < k);
        const count = values.filter(keep).reduce((s, v) => s + freqs[v]!, 0);
        const answer = Q.of(count, total);
        const nearCount = kind === "atLeast" ? count - freqs[k]! : kind === "moreThan" ? count + freqs[k]! : count + freqs[k]!;
        const phraseEn = { atLeast: `at least $${k}$`, moreThan: `more than $${k}$`, fewerThan: `fewer than $${k}$` }[kind];
        const phraseZh = { atLeast: `至少 $${k}$`, moreThan: `多于 $${k}$`, fewerThan: `少于 $${k}$` }[kind];
        return numberProblem({
          prompt: t(
            `The table shows ${ctx.en}. ${freqTable(ctx.head, values, freqs).en}If one ${ctx.one} is chosen at random, what is the probability that the ${ctx.one} has ${phraseEn} ${ctx.what}?`,
            `下表给出${ctx.zh}。${freqTable(ctx.head, values, freqs)["zh-CN"]}随机选出一名${ctx.oneZh}，这名${ctx.oneZh}有${phraseZh} ${ctx.whatZh}的概率是多少？`,
          ),
          answer,
          form: "fraction",
          wrong: distinct(answer, [Q.of(nearCount, total), Q.of(total - count, total), Q.of(count, total - count || 1)]),
          solution: t(
            `The values with ${phraseEn} are ${values
              .filter(keep)
              .map((v) => `$${v}$`)
              .join(", ")}, with $${values
              .filter(keep)
              .map((v) => freqs[v])
              .join(
                " + ",
              )} = ${count}$ ${ctx.ones} out of $${total}$. The probability is $\\frac{${count}}{${total}}${answer.d === BigInt(total) ? "" : ` = ${answer.toLatex()}`}$.`,
            `满足“${phraseZh}”的值为 ${values
              .filter(keep)
              .map((v) => `$${v}$`)
              .join("、")}，共 $${values
              .filter(keep)
              .map((v) => freqs[v])
              .join(
                " + ",
              )} = ${count}$ 名${ctx.oneZh}，总数为 $${total}$。概率为 $\\frac{${count}}{${total}}${answer.d === BigInt(total) ? "" : ` = ${answer.toLatex()}`}$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Best-fit lines

/** Compressed is a scatter plot whose axes start at x0 and y0, with gridlines every sx and sy, and a best-fit line through grid points (0, ja) and (8, jb). */
interface Compressed {
  readonly x0: number;
  readonly y0: number;
  readonly sx: number;
  readonly sy: number;
  readonly ja: number;
  readonly jb: number;
  readonly pts: readonly (readonly [number, number])[];
}

/** compressedSvg draws a scatter plot on 8 by 8 gridlines whose axes start at x0 and y0, marked by breaks near the origin. */
function compressedSvg(c: Compressed): string {
  const [left, right, bottom, top] = [52, 300, 176, 16];
  const gx = (i: number) => r(left + (i / 8) * (right - left));
  const gy = (j: number) => r(bottom - (j / 8) * (bottom - top));
  let out = "";
  for (let k = 1; k <= 8; k++) {
    out += `<line x1="${gx(k)}" y1="${bottom}" x2="${gx(k)}" y2="${top}" stroke-width="0.4" stroke-dasharray="2 2"/>`;
    out += `<line x1="${left}" y1="${gy(k)}" x2="${right}" y2="${gy(k)}" stroke-width="0.4" stroke-dasharray="2 2"/>`;
  }
  for (let k = 0; k <= 8; k += 2) {
    out += `<text x="${gx(k)}" y="${bottom + 16}">${c.x0 + k * c.sx}</text>`;
    out += `<text x="${left - 8}" y="${gy(k) + 4}" text-anchor="end">${c.y0 + k * c.sy}</text>`;
  }
  out += `<line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}"/><line x1="${left}" y1="${bottom}" x2="${left}" y2="${top - 6}"/>`;
  // Breaks: a zigzag on each axis next to the origin shows that the axis does not start at 0.
  out += `<path d="M${left + 6} ${bottom} l3 -5 l4 10 l3 -5" stroke-width="1.2"/>`;
  out += `<path d="M${left} ${bottom - 6} l-5 -3 l10 -4 l-5 -3" stroke-width="1.2"/>`;
  out += `<line class="accent" x1="${gx(0)}" y1="${gy(c.ja)}" x2="${gx(8)}" y2="${gy(c.jb)}" stroke="currentColor"/>`;
  for (const [i, j] of c.pts) out += `<circle cx="${gx(i)}" cy="${gy(j)}" r="3" fill="currentColor"/>`;
  return svgDocument(bottom + 24, out);
}

/** compressedPlot draws the data of a compressed-axis scatter plot near its best-fit line. */
function compressedPlot(rng: Rng): Compressed {
  const x0 = rng.pick([10, 20, 30, 40, 50]);
  const y0 = rng.pick([20, 40, 50, 100, 200]);
  const sx = rng.pick([1, 2, 5]);
  const sy = rng.pick([2, 5, 10]);
  const ja = rng.int(1, 7);
  let jb = rng.int(1, 7);
  while (jb === ja) jb = rng.int(1, 7);
  const pts = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5].map((i): readonly [number, number] => {
    const j = ja + ((jb - ja) * i) / 8 + rng.int(-6, 6) / 10;
    return [i, Math.min(7.8, Math.max(0.2, r(j)))];
  });
  return { x0, y0, sx, sy, ja, jb, pts };
}

/** compressedFigure draws a compressed-axis scatter plot, with alt text giving the scales and the line. */
function compressedFigure(c: Compressed, xs: Text, ys: Text): Figure {
  const end = c.x0 + 8 * c.sx;
  return {
    svg: compressedSvg(c),
    alt: t(
      `Scatter plot of ${ys.en} against ${xs.en}. The horizontal axis runs from ${c.x0} to ${end} with gridlines every ${c.sx}; the vertical axis runs from ${c.y0} to ${c.y0 + 8 * c.sy} with gridlines every ${c.sy}. A line of best fit passes through (${c.x0}, ${c.y0 + c.ja * c.sy}) and (${end}, ${c.y0 + c.jb * c.sy}).`,
      `${ys["zh-CN"]}关于${xs["zh-CN"]}的散点图。横轴从 ${c.x0} 到 ${end}，每 ${c.sx} 一条网格线；纵轴从 ${c.y0} 到 ${c.y0 + 8 * c.sy}，每 ${c.sy} 一条网格线。最佳拟合直线经过 (${c.x0}, ${c.y0 + c.ja * c.sy}) 和 (${end}, ${c.y0 + c.jb * c.sy})。`,
    ),
  };
}

/** compressedContexts name the variables of compressed-axis scatter plots. */
const compressedContexts = [
  {
    x: t("age, in years", "年龄（岁）"),
    y: t("resting heart rate, in beats per minute", "静息心率（次/分）"),
    en: "age $x$, in years, and resting heart rate $y$, in beats per minute,",
    zh: "年龄 $x$（岁）与静息心率 $y$（次/分）",
  },
  {
    x: t("temperature, in degrees", "气温（度）"),
    y: t("drinks sold", "饮料销量"),
    en: "the temperature $x$, in degrees, and the number of drinks sold $y$",
    zh: "气温 $x$（度）与饮料销量 $y$",
  },
  {
    x: t("hours of practice", "练习小时数"),
    y: t("test score", "测试成绩"),
    en: "hours of practice $x$ and test score $y$",
    zh: "练习小时数 $x$ 与测试成绩 $y$",
  },
] as const;

/** bestFitLinesWithCompressedAxes reads slopes and intercepts of best-fit lines from graphs whose axes do not start at 0. */
export const bestFitLinesWithCompressedAxes = topic(
  "best-fit-lines-with-compressed-axes",
  t("Best-Fit Lines With Compressed Axes", "坐标轴有截断的最佳拟合直线"),
  t(
    "Find the slope and the y-intercept of a best-fit line drawn on axes that do not start at zero.",
    "在不从零开始的坐标轴上，求出最佳拟合直线的斜率和 y 轴截距。",
  ),
  ["trend-lines"],
  ["S-ID.B.6.c", "8.SP.A.3"],
  [
    kp(
      "slope-on-compressed-axes",
      t("The slope on compressed axes", "截断坐标轴上的斜率"),
      t(
        "A break mark on an axis means the axis does not start at $0$, so the gridlines are labeled by their values rather than counted from the origin. To find the slope of a line, pick two points on it, read their coordinates from the axis labels, and divide the change in $y$ by the change in $x$. Each gridline may stand for a different amount on the two axes, so never count squares alone.",
        "坐标轴上的截断符号表示它不从 $0$ 开始，所以要按网格线上标注的数值读数，而不是从原点数格子。要求直线的斜率，在直线上取两个点，从坐标轴的标注读出它们的坐标，再用 $y$ 的变化量除以 $x$ 的变化量。两条坐标轴上每格代表的量可能不同，所以不能只数格子。",
      ),
      (rng) => {
        const c = compressedPlot(rng);
        const ctx = rng.pick(compressedContexts);
        const dy = (c.jb - c.ja) * c.sy;
        const dx = 8 * c.sx;
        const answer = Q.of(dy, dx);
        return {
          ...numberProblem({
            prompt: t(
              `The scatter plot shows ${ctx.en} for a group of data, along with a line of best fit. What is the slope of the line of best fit?`,
              `散点图显示了一组数据的${ctx.zh}，并画出了最佳拟合直线。最佳拟合直线的斜率是多少？`,
            ),
            answer,
            form: "fraction",
            wrong: distinct(answer, [Q.of(c.jb - c.ja, 8), Q.of(dx, dy), Q.of(c.y0 + c.jb * c.sy, c.x0 + dx), Q.of(dy)]),
            solution: t(
              `The line passes through $(${c.x0}, ${c.y0 + c.ja * c.sy})$ and $(${c.x0 + dx}, ${c.y0 + c.jb * c.sy})$. Its slope is $\\frac{${c.y0 + c.jb * c.sy} - ${c.y0 + c.ja * c.sy}}{${c.x0 + dx} - ${c.x0}} = \\frac{${dy}}{${dx}}${answer.eq(Q.of(dy, dx)) && answer.d === BigInt(dx) ? "" : ` = ${answer.toLatex()}`}$.`,
              `直线经过 $(${c.x0}, ${c.y0 + c.ja * c.sy})$ 和 $(${c.x0 + dx}, ${c.y0 + c.jb * c.sy})$。斜率为 $\\frac{${c.y0 + c.jb * c.sy} - ${c.y0 + c.ja * c.sy}}{${c.x0 + dx} - ${c.x0}} = \\frac{${dy}}{${dx}}${answer.d === BigInt(dx) ? "" : ` = ${answer.toLatex()}`}$。`,
            ),
          }),
          figure: compressedFigure(c, ctx.x, ctx.y),
        };
      },
    ),
    kp(
      "intercept-off-the-graph",
      t("A y-intercept off the graph", "图外的 y 轴截距"),
      t(
        "When the horizontal axis does not start at $0$, the place where the line meets the left edge of the graph is not its $y$-intercept. Find the slope $m$ from two points, then use one point $(x_{1}, y_{1})$ and $b = y_{1} - mx_{1}$. A line through $(10, 70)$ and $(20, 50)$ has slope $-2$ and $y$-intercept $70 - (-2)(10) = 90$, even if the graph shows only $x$ from $10$ to $20$.",
        "当横轴不从 $0$ 开始时，直线与图左边缘的交点并不是它的 $y$ 轴截距。先用两点求斜率 $m$，再取一点 $(x_{1}, y_{1})$，由 $b = y_{1} - mx_{1}$ 求出截距。经过 $(10, 70)$ 和 $(20, 50)$ 的直线斜率为 $-2$，$y$ 轴截距为 $70 - (-2)(10) = 90$，即使图中只显示了 $x$ 从 $10$ 到 $20$ 的部分。",
      ),
      (rng) => {
        const c = compressedPlot(rng);
        const ctx = rng.pick(compressedContexts);
        const m = Q.of((c.jb - c.ja) * c.sy, 8 * c.sx);
        const ya = c.y0 + c.ja * c.sy;
        const b = Q.of(ya).sub(m.mul(Q.of(c.x0)));
        return {
          ...numberProblem({
            prompt: t(
              `The scatter plot shows ${ctx.en} for a group of data, along with a line of best fit. The line of best fit has the equation $y = mx + b$. What is the value of $b$?`,
              `散点图显示了一组数据的${ctx.zh}，并画出了最佳拟合直线。最佳拟合直线的方程为 $y = mx + b$。求 $b$ 的值。`,
            ),
            answer: b,
            form: "fraction",
            wrong: distinct(b, [Q.of(ya), Q.of(c.y0), Q.of(ya).add(m.mul(Q.of(c.x0))), Q.of(c.ja * c.sy)]),
            solution: t(
              `The line passes through $(${c.x0}, ${ya})$ and $(${c.x0 + 8 * c.sx}, ${c.y0 + c.jb * c.sy})$, so $m = ${m.toLatex()}$. The $x$-axis starts at $${c.x0}$, not $0$, so $b = ${ya} - ${m.sign() < 0 ? `\\left(${m.toLatex()}\\right)` : m.toLatex()}(${c.x0}) = ${b.toLatex()}$.`,
              `直线经过 $(${c.x0}, ${ya})$ 和 $(${c.x0 + 8 * c.sx}, ${c.y0 + c.jb * c.sy})$，所以 $m = ${m.toLatex()}$。$x$ 轴从 $${c.x0}$ 而不是 $0$ 开始，所以 $b = ${ya} - ${m.sign() < 0 ? `\\left(${m.toLatex()}\\right)` : m.toLatex()}(${c.x0}) = ${b.toLatex()}$。`,
            ),
          }),
          figure: compressedFigure(c, ctx.x, ctx.y),
        };
      },
    ),
  ],
);

/** decLine writes y = mx + b with decimal coefficients. */
const decLine = (m: Q, b: Q) => `y = ${dec(m)}x ${b.sign() < 0 ? "-" : "+"} ${dec(b.abs())}`;

/** transformationsOfBestFitLines finds best-fit lines after every data value is shifted or scaled. */
export const transformationsOfBestFitLines = topic(
  "transformations-of-best-fit-lines",
  t("Transformations of Best-Fit Lines", "最佳拟合直线的变换"),
  t(
    "Find the new best-fit line when every data value is increased by a constant or multiplied by a constant.",
    "当每个数据值都加上或乘以一个常数时，求出新的最佳拟合直线。",
  ),
  ["trend-lines"],
  ["S-ID.B.6.a"],
  [
    kp(
      "shifting-every-output",
      t("Shifting every output", "每个输出值平移"),
      t(
        "If every $y$-value in a data set increases by $k$, every point moves up $k$ units, and so does the best-fit line: $y = mx + b$ becomes $y = mx + (b + k)$. The slope stays the same because the shape of the data does not change. If every $x$-value increases by $k$ instead, the line moves right, and the new intercept is $b - mk$.",
        "如果数据集中每个 $y$ 值都增加 $k$，每个点都向上移动 $k$ 个单位，最佳拟合直线也一样：$y = mx + b$ 变为 $y = mx + (b + k)$。数据的形状没有变化，所以斜率不变。如果改为每个 $x$ 值都增加 $k$，直线向右移动，新的截距为 $b - mk$。",
      ),
      (rng) => {
        const m = Q.of(rng.nonZero(-30, 30), 10);
        const b = Q.of(rng.int(10, 900), 10);
        const k = rng.nonZero(-9, 9);
        const shiftX = rng.bool(0.4);
        const answer = shiftX ? b.sub(m.mul(Q.of(k))) : b.add(Q.of(k));
        const verb = (en: boolean) => (k > 0 ? (en ? `increased by $${k}$` : `增加 $${k}$`) : en ? `decreased by $${-k}$` : `减少 $${-k}$`);
        return numberProblem({
          prompt: t(
            `A line of best fit for a data set is $${decLine(m, b)}$. Every ${shiftX ? "$x$" : "$y$"}-value in the data set is ${verb(true)}, and a new line of best fit $y = mx + c$ is found. What is the value of $c$?`,
            `某数据集的最佳拟合直线为 $${decLine(m, b)}$。把数据集中每个${shiftX ? " $x$ " : " $y$ "}值都${verb(false)}，得到新的最佳拟合直线 $y = mx + c$。求 $c$ 的值。`,
          ),
          answer,
          form: "decimal",
          wrong: distinct(answer, [b, shiftX ? b.add(m.mul(Q.of(k))) : b.sub(Q.of(k)), shiftX ? b.sub(Q.of(k)) : b.add(m.mul(Q.of(k)))]),
          solution: shiftX
            ? t(
                `${k > 0 ? "Increasing" : "Decreasing"} every $x$ by $${Math.abs(k)}$ moves the line $${Math.abs(k)}$ units to the ${k > 0 ? "right" : "left"}: the new line is $y = ${dec(m)}(x ${k > 0 ? "-" : "+"} ${Math.abs(k)}) + ${dec(b)}$, so $c = ${dec(b)} - ${paren(dec(m))} \\cdot ${paren(k)} = ${dec(answer)}$.`,
                `每个 $x$ 都${k > 0 ? "增加" : "减少"} $${Math.abs(k)}$，直线向${k > 0 ? "右" : "左"}移动 $${Math.abs(k)}$ 个单位：新直线为 $y = ${dec(m)}(x ${k > 0 ? "-" : "+"} ${Math.abs(k)}) + ${dec(b)}$，所以 $c = ${dec(b)} - ${paren(dec(m))} \\cdot ${paren(k)} = ${dec(answer)}$。`,
              )
            : t(
                `Every point moves ${k > 0 ? "up" : "down"} $${Math.abs(k)}$ units, so the line does too and its slope is unchanged: $c = ${dec(b)} ${k > 0 ? "+" : "-"} ${Math.abs(k)} = ${dec(answer)}$.`,
                `每个点都向${k > 0 ? "上" : "下"}移动 $${Math.abs(k)}$ 个单位，直线也一样，斜率不变：$c = ${dec(b)} ${k > 0 ? "+" : "-"} ${Math.abs(k)} = ${dec(answer)}$。`,
              ),
        });
      },
    ),
    kp(
      "scaling-every-output",
      t("Scaling every output", "每个输出值伸缩"),
      t(
        "If every $y$-value is multiplied by a constant $c$, for example to convert units, the best-fit line $y = mx + b$ becomes $y = cmx + cb$: both the slope and the intercept are multiplied by $c$. Converting a line in meters, $y = 1.5x + 4$, to centimeters gives $y = 150x + 400$.",
        "如果每个 $y$ 值都乘以常数 $c$（例如换算单位），最佳拟合直线 $y = mx + b$ 就变为 $y = cmx + cb$：斜率和截距都乘以 $c$。把以米为单位的直线 $y = 1.5x + 4$ 换算成厘米，得到 $y = 150x + 400$。",
      ),
      (rng) => {
        const m = Q.of(rng.nonZero(-40, 40), 10);
        const b = Q.of(rng.int(5, 200), 10);
        const c = rng.pick([2, 3, 4, 5, 10, 12, 100]);
        const askSlope = rng.bool();
        const answer = (askSlope ? m : b).mul(Q.of(c));
        return numberProblem({
          prompt: t(
            `A line of best fit for a data set is $${decLine(m, b)}$. Every $y$-value in the data set is multiplied by $${c}$, and a new line of best fit $y = px + q$ is found. What is the value of $${askSlope ? "p" : "q"}$?`,
            `某数据集的最佳拟合直线为 $${decLine(m, b)}$。把数据集中每个 $y$ 值都乘以 $${c}$，得到新的最佳拟合直线 $y = px + q$。求 $${askSlope ? "p" : "q"}$ 的值。`,
          ),
          answer,
          form: "decimal",
          wrong: distinct(answer, [askSlope ? m : b, (askSlope ? m : b).add(Q.of(c)), (askSlope ? m : b).div(Q.of(c))]),
          solution: t(
            `Multiplying every $y$-value by $${c}$ multiplies both the slope and the intercept by $${c}$: $${askSlope ? "p" : "q"} = ${c} \\cdot ${paren(dec(askSlope ? m : b))} = ${dec(answer)}$.`,
            `每个 $y$ 值都乘以 $${c}$，斜率和截距也都乘以 $${c}$：$${askSlope ? "p" : "q"} = ${c} \\cdot ${paren(dec(askSlope ? m : b))} = ${dec(answer)}$。`,
          ),
        });
      },
    ),
  ],
);

/** paren wraps a negative number in parentheses. */
function paren(v: number | string): string {
  const s = String(v);
  return s.startsWith("-") ? `(${s})` : s;
}

// ---------------------------------------------------------------------------
// Models

/** quadraticVsExponentialModels tells linear, quadratic and exponential data apart and compares their growth. */
export const quadraticVsExponentialModels = topic(
  "quadratic-vs-exponential-models",
  t("Quadratic vs. Exponential Models", "二次模型与指数模型的比较"),
  t(
    "Tell linear, quadratic and exponential data apart by their differences and ratios, and compare how fast quadratic and exponential functions grow.",
    "根据差和比区分一次、二次和指数数据，并比较二次函数与指数函数增长的快慢。",
  ),
  ["linear-vs-exponential-models", "graphs-of-general-quadratic-functions"],
  ["F-LE.A.1", "F-LE.A.3"],
  [
    kp(
      "classifying-tables",
      t("Classifying tables of values", "判断表格的类型"),
      t(
        "For inputs that go up by $1$: if the outputs have a constant difference, the data are linear; if the differences themselves change by a constant amount (constant second differences), the data are quadratic; if the outputs have a constant ratio, the data are exponential. The outputs $2, 5, 10, 17, 26$ have differences $3, 5, 7, 9$, which change by $2$ each time, so they are quadratic.",
        "当自变量每次增加 $1$ 时：若函数值的差恒定，数据是一次的；若差本身每次变化一个恒定的量（二阶差恒定），数据是二次的；若函数值的比恒定，数据是指数的。函数值 $2, 5, 10, 17, 26$ 的差为 $3, 5, 7, 9$，每次增加 $2$，所以是二次的。",
      ),
      (rng) => {
        const kind = rng.int(0, 2);
        const xs = [0, 1, 2, 3, 4];
        const ys =
          kind === 0
            ? (() => {
                const m = rng.nonZero(-9, 9);
                const b = rng.int(-10, 20);
                return xs.map((x) => m * x + b);
              })()
            : kind === 1
              ? (() => {
                  const a = rng.nonZero(-3, 3);
                  const bb = rng.int(-6, 6);
                  const c = rng.int(-10, 20);
                  return xs.map((x) => a * x * x + bb * x + c);
                })()
              : (() => {
                  const a = rng.int(1, 6);
                  const g = rng.int(2, 4);
                  return xs.map((x) => a * g ** x);
                })();
        const options = [t("Linear", "一次函数"), t("Quadratic", "二次函数"), t("Exponential", "指数函数")];
        const d1 = ys.slice(1).map((y, i) => y - ys[i]!);
        const d2 = d1.slice(1).map((d, i) => d - d1[i]!);
        const table = `$$\\begin{array}{c|ccccc} x & ${xs.join(" & ")} \\\\ \\hline y & ${ys.join(" & ")} \\end{array}$$`;
        const why = [
          t(
            `The differences are ${d1.map((d) => `$${d}$`).join(", ")}, which are constant, so the data are linear.`,
            `差为 ${d1.map((d) => `$${d}$`).join("、")}，恒定不变，所以数据是一次的。`,
          ),
          t(
            `The differences are ${d1.map((d) => `$${d}$`).join(", ")}, and they change by $${d2[0]}$ each time. Constant second differences mean the data are quadratic.`,
            `差为 ${d1.map((d) => `$${d}$`).join("、")}，每次变化 $${d2[0]}$。二阶差恒定，所以数据是二次的。`,
          ),
          t(
            `Each output is $${ys[1]! / ys[0]!}$ times the one before, a constant ratio, so the data are exponential.`,
            `每个函数值都是前一个的 $${ys[1]! / ys[0]!}$ 倍，比值恒定，所以数据是指数的。`,
          ),
        ][kind]!;
        return pickChoice(
          rng,
          t(`Which type of function best models the data in the table? ${table}`, `哪种函数最适合表示下表中的数据？${table}`),
          options[kind]!,
          options.filter((_, i) => i !== kind),
          why,
        );
      },
    ),
    kp(
      "exponential-eventually-exceeds-quadratic",
      t("Exponential growth overtakes quadratic growth", "指数增长最终超过二次增长"),
      t(
        "An increasing exponential function $b^{x}$ with $b > 1$ multiplies by $b$ at each step, while a quadratic adds a growing but steady amount. A quadratic can be larger for small inputs, but the exponential function eventually exceeds it and stays larger. For example, $10x^{2}$ is greater than $2^{x}$ at $x = 5$ ($250$ versus $32$), but $2^{x}$ is greater at $x = 10$ ($1024$ versus $1000$).",
        "递增的指数函数 $b^{x}$（$b > 1$）每一步乘以 $b$，而二次函数每一步增加的量虽然在变大，却增长得平稳。对较小的自变量，二次函数可能更大，但指数函数最终会超过它并一直更大。例如在 $x = 5$ 时 $10x^{2}$ 比 $2^{x}$ 大（$250$ 对 $32$），但在 $x = 10$ 时 $2^{x}$ 更大（$1024$ 对 $1000$）。",
      ),
      (rng) => {
        const a = rng.int(1, 12);
        const g = rng.pick([2, 3]);
        const n = rng.int(1, g === 2 ? 14 : 9);
        const fq = a * n * n;
        const fe = g ** n;
        const options = [t("$f(x) > g(x)$", "$f(x) > g(x)$"), t("$f(x) < g(x)$", "$f(x) < g(x)$"), t("$f(x) = g(x)$", "$f(x) = g(x)$")];
        const correct = fq > fe ? 0 : fq < fe ? 1 : 2;
        const quad = a === 1 ? "x^{2}" : `${a}x^{2}`;
        return pickChoice(
          rng,
          t(
            `The functions $f$ and $g$ are defined by $f(x) = ${quad}$ and $g(x) = ${g}^{x}$. Which statement is true when $x = ${n}$?`,
            `函数 $f$ 与 $g$ 定义为 $f(x) = ${quad}$，$g(x) = ${g}^{x}$。当 $x = ${n}$ 时，哪个说法正确？`,
          ),
          options[correct]!,
          options.filter((_, i) => i !== correct),
          t(
            `At $x = ${n}$, $f(${n}) = ${a === 1 ? "" : `${a} \\cdot `}${n}^{2} = ${fq}$ and $g(${n}) = ${g}^{${n}} = ${fe}$. So $f(${n}) ${fq > fe ? ">" : fq < fe ? "<" : "="} g(${n})$.`,
            `当 $x = ${n}$ 时，$f(${n}) = ${a === 1 ? "" : `${a} \\cdot `}${n}^{2} = ${fq}$，$g(${n}) = ${g}^{${n}} = ${fe}$。所以 $f(${n}) ${fq > fe ? ">" : fq < fe ? "<" : "="} g(${n})$。`,
          ),
        );
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Percentages

/** reciprocalPercents are percents p for which 100 is a clean percent of p in return: y is (10000/p)% of x when x is p% of y. */
const reciprocalPercents = [10, 20, 25, 40, 50, 80, 125, 160, 200, 250, 400, 500, 625, 800] as const;

/** findingPercentagesRepresentedByVariables relates percentages of variables to each other. */
export const findingPercentagesRepresentedByVariables = topic(
  "finding-percentages-represented-by-variables",
  t("Finding Percentages Represented by Variables", "求变量所表示的百分比"),
  t(
    'Turn statements such as "$x$ is $p\\%$ of $y$" into equations, and use them to find what percent one variable is of another.',
    "把“$x$ 是 $y$ 的 $p\\%$”这样的说法写成方程，并据此求一个变量是另一个变量的百分之几。",
  ),
  ["finding-a-percentage-given-two-numbers", "many-variable-equations"],
  ["7.RP.A.3", "A-CED.A.4"],
  [
    kp(
      "reversing-a-percentage",
      t("Reversing a percentage", "反过来求百分比"),
      t(
        '"$x$ is $p\\%$ of $y$" means $x = \\frac{p}{100}y$. To find what percent $y$ is of $x$, solve for $y$: $y = \\frac{100}{p}x$, which is $\\frac{100}{p} \\cdot 100\\%$ of $x$. If $x$ is $25\\%$ of $y$, then $y = 4x$, so $y$ is $400\\%$ of $x$.',
        "“$x$ 是 $y$ 的 $p\\%$”表示 $x = \\frac{p}{100}y$。要求 $y$ 是 $x$ 的百分之几，就解出 $y$：$y = \\frac{100}{p}x$，即 $x$ 的 $\\frac{100}{p} \\cdot 100\\%$。若 $x$ 是 $y$ 的 $25\\%$，则 $y = 4x$，所以 $y$ 是 $x$ 的 $400\\%$。",
      ),
      (rng) => {
        const p = rng.pick(reciprocalPercents);
        const [a, b] = rng.pick([
          ["x", "y"],
          ["a", "b"],
          ["m", "n"],
          ["p", "q"],
        ] as const);
        const answer = Q.of(10000, p);
        return numberProblem({
          prompt: t(
            `The positive number $${a}$ is $${p}\\%$ of $${b}$. The number $${b}$ is what percent of $${a}$?`,
            `正数 $${a}$ 是 $${b}$ 的 $${p}\\%$。$${b}$ 是 $${a}$ 的百分之几？`,
          ),
          answer,
          form: "decimal",
          unit: "%",
          wrong: distinct(answer, [Q.of(p), Q.of(100 - p), Q.of(100 + p), Q.of(100, p)]),
          solution: t(
            `From $${a} = ${dec(Q.of(p, 100))}${b}$, we get $${b} = \\frac{${a}}{${dec(Q.of(p, 100))}} = ${dec(Q.of(100, p))}${a}$. So $${b}$ is $${dec(answer)}\\%$ of $${a}$.`,
            `由 $${a} = ${dec(Q.of(p, 100))}${b}$ 得 $${b} = \\frac{${a}}{${dec(Q.of(p, 100))}} = ${dec(Q.of(100, p))}${a}$。所以 $${b}$ 是 $${a}$ 的 $${dec(answer)}\\%$。`,
          ),
        });
      },
    ),
    kp(
      "chaining-percentages",
      t("Chaining percentages", "连续的百分比"),
      t(
        "If $x$ is $p\\%$ of $y$ and $y$ is $q\\%$ of $z$, then $x = \\frac{p}{100} \\cdot \\frac{q}{100}z$. Multiply the decimal forms of the two percents to find what percent $x$ is of $z$. If $x$ is $30\\%$ of $y$ and $y$ is $40\\%$ of $z$, then $x = 0.3 \\cdot 0.4z = 0.12z$, so $x$ is $12\\%$ of $z$. A percent greater than $100$ works the same way.",
        "若 $x$ 是 $y$ 的 $p\\%$，$y$ 是 $z$ 的 $q\\%$，则 $x = \\frac{p}{100} \\cdot \\frac{q}{100}z$。把两个百分数的小数形式相乘，就得到 $x$ 是 $z$ 的百分之几。若 $x$ 是 $y$ 的 $30\\%$，$y$ 是 $z$ 的 $40\\%$，则 $x = 0.3 \\cdot 0.4z = 0.12z$，所以 $x$ 是 $z$ 的 $12\\%$。大于 $100$ 的百分数也同样处理。",
      ),
      (rng) => {
        const p = rng.int(1, 30) * 10;
        const q = rng.int(1, 30) * 10;
        const answer = Q.of(p * q, 100);
        return numberProblem({
          prompt: t(
            `The number $x$ is $${p}\\%$ of $y$, and $y$ is $${q}\\%$ of $z$. If $z$ is positive, $x$ is what percent of $z$?`,
            `数 $x$ 是 $y$ 的 $${p}\\%$，$y$ 是 $z$ 的 $${q}\\%$。若 $z$ 为正数，$x$ 是 $z$ 的百分之几？`,
          ),
          answer,
          form: "decimal",
          unit: "%",
          wrong: distinct(answer, [Q.of(p + q), Q.of(p * q), Q.of(Math.abs(p - q)), Q.of(p * q, 10000)]),
          solution: t(
            `$x = ${dec(Q.of(p, 100))}y$ and $y = ${dec(Q.of(q, 100))}z$, so $x = ${dec(Q.of(p, 100))} \\cdot ${dec(Q.of(q, 100))}z = ${dec(Q.of(p * q, 10000))}z$. So $x$ is $${dec(answer)}\\%$ of $z$.`,
            `$x = ${dec(Q.of(p, 100))}y$，$y = ${dec(Q.of(q, 100))}z$，所以 $x = ${dec(Q.of(p, 100))} \\cdot ${dec(Q.of(q, 100))}z = ${dec(Q.of(p * q, 10000))}z$。所以 $x$ 是 $z$ 的 $${dec(answer)}\\%$。`,
          ),
        });
      },
    ),
  ],
);

/** returnChanges pairs a percentage change with the opposite change that undoes it, both clean. */
const returnChanges = [
  [-20, 25],
  [-50, 100],
  [-60, 150],
  [-75, 300],
  [-80, 400],
  [-36, 56.25],
  [-68, 212.5],
  [-90, 900],
  [25, -20],
  [100, -50],
  [150, -60],
  [300, -75],
  [400, -80],
  [60, -37.5],
  [900, -90],
] as const;

/** furtherSuccessivePercentageChanges finds net changes and the changes that undo earlier ones. */
export const furtherSuccessivePercentageChanges = topic(
  "further-successive-percentage-changes",
  t("Further Successive Percentage Changes", "进一步的连续百分比变化"),
  t(
    "Find the net percentage change after an increase and a decrease, and the percentage change that returns a quantity to its original value.",
    "求先增后减后的净百分比变化，以及使数量恢复原值所需的百分比变化。",
  ),
  ["applying-percentages-in-succession", "finding-original-values-from-percentage-decreases"],
  ["7.RP.A.3"],
  [
    kp(
      "net-percentage-change",
      t("The net percentage change", "净百分比变化"),
      t(
        "Successive percentage changes multiply: an increase of $p\\%$ multiplies by $1 + \\frac{p}{100}$ and a decrease of $q\\%$ multiplies by $1 - \\frac{q}{100}$. The net change is the product minus $1$, written as a percent. An increase of $20\\%$ followed by a decrease of $20\\%$ multiplies by $1.2 \\cdot 0.8 = 0.96$, a net decrease of $4\\%$, not a net change of $0$.",
        "连续的百分比变化要相乘：增加 $p\\%$ 相当于乘以 $1 + \\frac{p}{100}$，减少 $q\\%$ 相当于乘以 $1 - \\frac{q}{100}$。净变化等于乘积减去 $1$，再写成百分数。先增加 $20\\%$ 再减少 $20\\%$，相当于乘以 $1.2 \\cdot 0.8 = 0.96$，即净减少 $4\\%$，而不是没有变化。",
      ),
      (rng) => {
        const p = rng.int(1, 12) * 5;
        const q = rng.int(1, 12) * 5;
        const upFirst = rng.bool();
        const factor = Q.of(100 + p, 100).mul(Q.of(100 - q, 100));
        const net = factor.sub(Q.one).mul(Q.of(100));
        const item = rng.pick([
          { en: "The price of a jacket", zh: "一件夹克的价格" },
          { en: "The population of a town", zh: "一个小镇的人口" },
          { en: "The value of a stock", zh: "一只股票的价值" },
        ]);
        const first = upFirst ? [`increased by $${p}\\%$`, `增加了 $${p}\\%$`] : [`decreased by $${q}\\%$`, `减少了 $${q}\\%$`];
        const second = upFirst ? [`decreased by $${q}\\%$`, `减少了 $${q}\\%$`] : [`increased by $${p}\\%$`, `增加了 $${p}\\%$`];
        return numberProblem({
          prompt: t(
            `${item.en} ${first[0]} and then ${second[0]}. What is the net percentage change? Use a negative number for a decrease.`,
            `${item.zh}先${first[1]}，然后又${second[1]}。净百分比变化是多少？减少用负数表示。`,
          ),
          answer: net,
          form: "decimal",
          unit: "%",
          wrong: distinct(net, [Q.of(p - q), Q.of(p + q), net.neg(), factor.mul(Q.of(100))]),
          solution: t(
            `The value is multiplied by $${dec(Q.of(100 + p, 100))} \\cdot ${dec(Q.of(100 - q, 100))} = ${dec(factor)}$. The net change is $${dec(factor)} - 1 = ${dec(factor.sub(Q.one))}$, that is $${dec(net)}\\%$.`,
            `数值乘以 $${dec(Q.of(100 + p, 100))} \\cdot ${dec(Q.of(100 - q, 100))} = ${dec(factor)}$。净变化为 $${dec(factor)} - 1 = ${dec(factor.sub(Q.one))}$，即 $${dec(net)}\\%$。`,
          ),
        });
      },
    ),
    kp(
      "undoing-a-percentage-change",
      t("Undoing a percentage change", "抵消一次百分比变化"),
      t(
        "A decrease of $20\\%$ is not undone by an increase of $20\\%$, because the increase is taken of a smaller amount. After a $20\\%$ decrease the value is $0.8$ of the original, so it must be multiplied by $\\frac{1}{0.8} = 1.25$ to return, an increase of $25\\%$. In general, divide $1$ by the factor of the first change, subtract $1$, and write the result as a percent.",
        "减少 $20\\%$ 后再增加 $20\\%$ 并不能回到原值，因为增加是以较小的量为基准的。减少 $20\\%$ 后数值为原来的 $0.8$，要回到原值必须乘以 $\\frac{1}{0.8} = 1.25$，即增加 $25\\%$。一般地，用 $1$ 除以第一次变化的倍数，减去 $1$，再写成百分数。",
      ),
      (rng) => {
        const [first, back] = rng.pick(returnChanges);
        const start = rng.int(2, 60) * 20;
        const factor = Q.of(100 + first, 100);
        const after = Q.of(start).mul(factor);
        const answer = Q.parse(String(back));
        const up = first > 0;
        return numberProblem({
          prompt: t(
            `A quantity of $${start}$ ${up ? "increased" : "decreased"} by $${Math.abs(first)}\\%$ to $${dec(after)}$. By what percent must the new amount change to return to $${start}$? Use a negative number for a decrease.`,
            `一个数量从 $${start}$ ${up ? "增加" : "减少"}了 $${Math.abs(first)}\\%$，变为 $${dec(after)}$。新数量要变化百分之几才能回到 $${start}$？减少用负数表示。`,
          ),
          answer,
          form: "decimal",
          unit: "%",
          wrong: distinct(answer, [Q.of(-first), Q.of(first), Q.of(Math.abs(first))]),
          solution: t(
            `The new amount is $${dec(factor)}$ times the original, so it must be multiplied by $\\frac{1}{${dec(factor)}} = ${dec(Q.one.div(factor))}$ to return: a change of $${dec(Q.one.div(factor))} - 1 = ${dec(answer.div(Q.of(100)))}$, that is $${dec(answer)}\\%$.`,
            `新数量是原来的 $${dec(factor)}$ 倍，要回到原值必须乘以 $\\frac{1}{${dec(factor)}} = ${dec(Q.one.div(factor))}$：变化为 $${dec(Q.one.div(factor))} - 1 = ${dec(answer.div(Q.of(100)))}$，即 $${dec(answer)}\\%$。`,
          ),
        });
      },
    ),
  ],
);

// ---------------------------------------------------------------------------
// Rates and ratios

/** rateUnits pairs a smaller unit of time with a larger one and the number of small units in a large one. */
const rateUnits = [
  { small: "seconds", smallZh: "秒", big: "minutes", bigZh: "分钟", n: 60 },
  { small: "minutes", smallZh: "分钟", big: "hours", bigZh: "小时", n: 60 },
  { small: "hours", smallZh: "小时", big: "days", bigZh: "天", n: 24 },
  { small: "days", smallZh: "天", big: "weeks", bigZh: "周", n: 7 },
] as const;

/** rateMachines are things that make items at a steady rate. */
const rateMachines = [
  { en: "A printer prints", zh: "一台打印机", verbZh: "打印", what: "pages", whatZh: "页" },
  { en: "A machine fills", zh: "一台机器", verbZh: "灌装", what: "bottles", whatZh: "瓶" },
  { en: "A bakery bakes", zh: "一家面包店", verbZh: "烤制", what: "loaves", whatZh: "个面包" },
] as const;

/** algebraicExpressionsWithRatesAndRatios writes expressions for rates in variables and evaluates ratios of variables. */
export const algebraicExpressionsWithRatesAndRatios = topic(
  "algebraic-expressions-with-rates-and-ratios",
  t("Algebraic Expressions With Rates and Ratios", "含比率与比的代数式"),
  t(
    "Write expressions for quantities produced at a rate given in variables, converting units of time, and evaluate expressions from a ratio of two variables.",
    "为以字母给出的速率所产生的量写出代数式（含时间单位换算），并由两个变量的比求代数式的值。",
  ),
  ["unit-rates", "constructing-algebraic-expressions"],
  ["6.RP.A.3.d", "A-SSE.A.1"],
  [
    kp(
      "rates-in-variables",
      t("Rates given in variables", "以字母给出的速率"),
      t(
        "If a machine makes $n$ items every $s$ seconds, its rate is $\\frac{n}{s}$ items per second. In $m$ minutes there are $60m$ seconds, so it makes $\\frac{n}{s} \\cdot 60m = \\frac{60nm}{s}$ items. Convert the time to the unit of the rate before multiplying, and check the expression with simple numbers such as $n = 2$, $s = 1$, $m = 1$.",
        "如果一台机器每 $s$ 秒生产 $n$ 件产品，它的速率是每秒 $\\frac{n}{s}$ 件。$m$ 分钟有 $60m$ 秒，所以它生产 $\\frac{n}{s} \\cdot 60m = \\frac{60nm}{s}$ 件。相乘之前先把时间换算成速率所用的单位，并可以用 $n = 2$、$s = 1$、$m = 1$ 这样的简单数值检验代数式。",
      ),
      (rng) => {
        const u = rng.pick(rateUnits);
        const mac = rng.pick(rateMachines);
        const [n, s, m] = rng.pick([
          ["n", "s", "m"],
          ["p", "k", "h"],
          ["a", "b", "c"],
          ["x", "y", "t"],
        ] as const);
        const correct = mathText(`\\frac{${u.n}${n}${m}}{${s}}`);
        const wrong = [
          mathText(`\\frac{${n}${m}}{${u.n}${s}}`),
          mathText(`\\frac{${u.n}${s}${m}}{${n}}`),
          mathText(`\\frac{${n}${s}}{${u.n}${m}}`),
          mathText(`\\frac{${n}${m}}{${s}}`),
        ];
        return pickChoice(
          rng,
          t(
            `${mac.en} $${n}$ ${mac.what} every $${s}$ ${u.small}. At this rate, which expression gives the number of ${mac.what} it makes in $${m}$ ${u.big}?`,
            `${mac.zh}每 $${s}$ ${u.smallZh}${mac.verbZh} $${n}$ ${mac.whatZh}。按这个速率，哪个代数式表示它在 $${m}$ ${u.bigZh}内${mac.verbZh}的数量？`,
          ),
          correct,
          wrong,
          t(
            `The rate is $\\frac{${n}}{${s}}$ ${mac.what} per ${u.small.slice(0, -1)}, and $${m}$ ${u.big} are $${u.n}${m}$ ${u.small}. So the number is $\\frac{${n}}{${s}} \\cdot ${u.n}${m} = \\frac{${u.n}${n}${m}}{${s}}$.`,
            `速率为每${u.smallZh} $\\frac{${n}}{${s}}$ ${mac.whatZh}，$${m}$ ${u.bigZh}等于 $${u.n}${m}$ ${u.smallZh}。所以数量为 $\\frac{${n}}{${s}} \\cdot ${u.n}${m} = \\frac{${u.n}${n}${m}}{${s}}$。`,
          ),
        );
      },
    ),
    kp(
      "expressions-from-a-ratio",
      t("Expressions from a ratio", "由比求代数式的值"),
      t(
        "An equation such as $3a = 5b$ fixes the ratio of $a$ to $b$: dividing both sides by $3b$ gives $\\frac{a}{b} = \\frac{5}{3}$. Other expressions follow from the ratio. For example, $\\frac{a + b}{b} = \\frac{a}{b} + 1 = \\frac{8}{3}$ and $\\frac{a - b}{b} = \\frac{a}{b} - 1 = \\frac{2}{3}$. Split the fraction so that each part is a multiple of $\\frac{a}{b}$ or a number.",
        "像 $3a = 5b$ 这样的方程确定了 $a$ 与 $b$ 的比：两边同除以 $3b$，得 $\\frac{a}{b} = \\frac{5}{3}$。其他代数式可以由这个比得到。例如 $\\frac{a + b}{b} = \\frac{a}{b} + 1 = \\frac{8}{3}$，$\\frac{a - b}{b} = \\frac{a}{b} - 1 = \\frac{2}{3}$。把分式拆开，使每一部分都是 $\\frac{a}{b}$ 的倍数或一个数。",
      ),
      (rng) => {
        const k = rng.int(2, 9);
        let j = rng.int(2, 9);
        while (j === k) j = rng.int(2, 9);
        const ratio = Q.of(j, k);
        const kind = rng.int(0, 3);
        const answer = [ratio, ratio.add(Q.one), ratio.sub(Q.one), Q.one.div(ratio).add(Q.one)][kind]!;
        const exprs = ["\\frac{a}{b}", "\\frac{a + b}{b}", "\\frac{a - b}{b}", "\\frac{a + b}{a}"];
        return numberProblem({
          prompt: t(
            `If $${k}a = ${j}b$ and $a$ and $b$ are not $0$, what is the value of $${exprs[kind]}$?`,
            `若 $${k}a = ${j}b$，且 $a$、$b$ 都不为 $0$，求 $${exprs[kind]}$ 的值。`,
          ),
          answer,
          form: "fraction",
          wrong: distinct(answer, [Q.of(k, j), ratio, Q.of(k, j).add(Q.one), Q.of(j + k, j * k), Q.of(j - k)]),
          solution: t(
            `Dividing $${k}a = ${j}b$ by $${k}b$ gives $\\frac{a}{b} = ${ratio.toLatex()}$.${kind === 0 ? "" : kind === 1 ? ` So $\\frac{a + b}{b} = \\frac{a}{b} + 1 = ${answer.toLatex()}$.` : kind === 2 ? ` So $\\frac{a - b}{b} = \\frac{a}{b} - 1 = ${answer.toLatex()}$.` : ` So $\\frac{b}{a} = ${Q.one.div(ratio).toLatex()}$ and $\\frac{a + b}{a} = 1 + \\frac{b}{a} = ${answer.toLatex()}$.`}`,
            `把 $${k}a = ${j}b$ 两边同除以 $${k}b$，得 $\\frac{a}{b} = ${ratio.toLatex()}$。${kind === 0 ? "" : kind === 1 ? `所以 $\\frac{a + b}{b} = \\frac{a}{b} + 1 = ${answer.toLatex()}$。` : kind === 2 ? `所以 $\\frac{a - b}{b} = \\frac{a}{b} - 1 = ${answer.toLatex()}$。` : `所以 $\\frac{b}{a} = ${Q.one.div(ratio).toLatex()}$，$\\frac{a + b}{a} = 1 + \\frac{b}{a} = ${answer.toLatex()}$。`}`,
          ),
        });
      },
    ),
  ],
);

/** satPrepDataTopics lists the SAT Math Prep geometry, data and problem-solving topics in prerequisite order. */
export const satPrepDataTopics: readonly TopicDef[] = [
  modelingGeometryProblemsWithQuadraticEquations,
  solvingProblemsWithEmbeddedRightTriangles,
  barGraphs,
  calculatingProbabilitiesFromFrequencyTables,
  bestFitLinesWithCompressedAxes,
  transformationsOfBestFitLines,
  quadraticVsExponentialModels,
  findingPercentagesRepresentedByVariables,
  furtherSuccessivePercentageChanges,
  algebraicExpressionsWithRatesAndRatios,
];
