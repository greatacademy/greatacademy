// Drawings for the knowledge points of English that explain something seen: graphs, charts and diagrams. Each is an SVG
// drawn in currentColor with numbers and letters only, so that one drawing serves every locale; its alt says what it shows.

import { type Figure, type KnowledgePointDef, type TopicDef, t } from "@ga/content";

const accent = `class="accent"`;
const result = `class="result"`;

/** label writes language-neutral text, such as a number, at a point. */
const label = (x: number, y: number, text: string | number, anchor = "middle") =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" stroke="none" fill="currentColor">${text}</text>`;

const svg = (width: number, height: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="none" stroke="currentColor" stroke-width="1.5" font-size="12" text-anchor="middle">${body}</svg>`;

/** Panel is a box of the drawing with its axes: x and y map values from 0 to 1 onto it. */
interface Panel {
  readonly x: (v: number) => number;
  readonly y: (v: number) => number;
  readonly body: string;
}

/** panel draws the axes of a small graph whose corner is at (left, top), of the given size. */
const panel = (left: number, top: number, width: number, height: number): Panel => {
  const x = (v: number) => Math.round((left + v * width) * 10) / 10;
  const y = (v: number) => Math.round((top + height - v * height) * 10) / 10;
  return { x, y, body: `<polyline points="${left},${top} ${left},${top + height} ${left + width},${top + height}"/>` };
};

/** line draws a line through points given as [x, y] fractions of a panel. */
const line = (p: Panel, points: readonly (readonly [number, number])[], cls = accent) =>
  `<polyline ${cls} stroke-width="2.5" points="${points.map(([a, b]) => `${p.x(a)},${p.y(b)}`).join(" ")}"/>`;

/** bars draws bars of the given heights, as fractions of a panel, evenly across it. */
const bars = (p: Panel, heights: readonly number[], cls = accent) => {
  const slot = 1 / heights.length;
  return heights
    .map((h, i) => {
      const left = p.x(i * slot + slot * 0.2);
      const right = p.x(i * slot + slot * 0.8);
      return `<rect ${cls} fill="currentColor" fill-opacity="0.45" x="${left}" y="${p.y(h)}" width="${Math.round((right - left) * 10) / 10}" height="${Math.round((p.y(0) - p.y(h)) * 10) / 10}"/>`;
    })
    .join("");
};

/** figure pairs a drawing with its alt text in English and Chinese. */
const figure = (width: number, height: number, body: string, en: string, zh: string): Figure => ({
  svg: svg(width, height, body),
  alt: t(en, zh),
});

/** kindsOfGraph shows a line graph, a bar graph, a pie chart and a scatter plot side by side. */
export const kindsOfGraph: Figure = (() => {
  const a = panel(14, 14, 60, 60);
  const b = panel(94, 14, 60, 60);
  const d = panel(254, 14, 60, 60);
  const dots: readonly (readonly [number, number])[] = [
    [0.1, 0.15],
    [0.2, 0.3],
    [0.3, 0.25],
    [0.45, 0.45],
    [0.55, 0.5],
    [0.65, 0.65],
    [0.8, 0.7],
    [0.9, 0.85],
  ];
  const body =
    a.body +
    line(a, [
      [0.05, 0.3],
      [0.25, 0.7],
      [0.5, 0.85],
      [0.75, 0.5],
      [0.95, 0.35],
    ]) +
    b.body +
    bars(b, [0.5, 0.8, 0.35, 0.65]) +
    `<circle cx="204" cy="44" r="30"/><path ${accent} fill="currentColor" fill-opacity="0.45" d="M204 44 L204 14 A30 30 0 0 1 233.5 49.2 Z"/><line x1="204" y1="44" x2="180" y2="62"/>` +
    d.body +
    dots.map(([x, y]) => `<circle ${accent} fill="currentColor" cx="${d.x(x)}" cy="${d.y(y)}" r="3"/>`).join("") +
    label(44, 94, "A") +
    label(124, 94, "B") +
    label(204, 94, "C") +
    label(284, 94, "D");
  return figure(
    328,
    100,
    body,
    "Four kinds of graph: A, a line graph, whose line rises and falls over time; B, a bar graph comparing four separate groups; C, a pie chart divided into the parts of a whole; D, a scatter plot whose dots rise together from lower left to upper right.",
    "四种图表：A 是折线图，线条随时间上升又下降；B 是条形图，比较四个独立的组；C 是饼图，分成整体的各个部分；D 是散点图，点从左下向右上一起上升。",
  );
})();

/** fourTrends shows a rising, a falling, a level and a rising-then-falling line. */
export const fourTrends: Figure = (() => {
  const shapes: readonly (readonly (readonly [number, number])[])[] = [
    [
      [0.05, 0.15],
      [0.35, 0.35],
      [0.65, 0.6],
      [0.95, 0.85],
    ],
    [
      [0.05, 0.85],
      [0.35, 0.65],
      [0.65, 0.4],
      [0.95, 0.15],
    ],
    [
      [0.05, 0.5],
      [0.35, 0.53],
      [0.65, 0.48],
      [0.95, 0.51],
    ],
    [
      [0.05, 0.15],
      [0.3, 0.55],
      [0.5, 0.85],
      [0.7, 0.55],
      [0.95, 0.2],
    ],
  ];
  const body = shapes
    .map((points, i) => {
      const p = panel(14 + i * 80, 14, 60, 60);
      return p.body + line(p, points) + label(44 + i * 80, 94, i + 1);
    })
    .join("");
  return figure(
    328,
    100,
    body,
    "Four line graphs: 1 rising, from low on the left to high on the right; 2 falling; 3 level, staying about the same; 4 rising to a peak in the middle and then falling.",
    "四幅折线图：1 上升，从左边的低处到右边的高处；2 下降；3 平稳，大致保持不变；4 先上升到中间的峰值，然后下降。",
  );
})();

/** risingSales shows a line rising from 20 in month 1 to 50 in month 3, with its values marked. */
export const risingSales: Figure = (() => {
  const p = panel(50, 14, 240, 120);
  const values = [20, 35, 50];
  const at = (i: number) => 0.1 + i * 0.4;
  let body = p.body;
  for (const v of [0, 20, 40, 60])
    body += `<line x1="46" y1="${p.y(v / 60)}" x2="290" y2="${p.y(v / 60)}" stroke-opacity="0.25"/>${label(40, p.y(v / 60) + 4, v, "end")}`;
  body += line(
    p,
    values.map((v, i) => [at(i), v / 60] as const),
  );
  values.forEach((v, i) => {
    body += `<circle ${result} fill="currentColor" cx="${p.x(at(i))}" cy="${p.y(v / 60)}" r="4"/>${label(p.x(at(i)), p.y(v / 60) - 10, v)}${label(p.x(at(i)), 152, i + 1)}`;
  });
  return figure(
    328,
    160,
    body,
    "A line graph of sales over three months: 20 in month 1, 35 in month 2 and 50 in month 3, so the line rises each month.",
    "三个月销量的折线图：第 1 个月 20，第 2 个月 35，第 3 个月 50，线条每个月都在上升。",
  );
})();

/** cutOffAxis shows the same two values, 50 and 52, on an axis from 0 and on an axis cut off at 49. */
export const cutOffAxis: Figure = (() => {
  const left = panel(40, 14, 110, 110);
  const right = panel(210, 14, 110, 110);
  let body = left.body + right.body;
  for (const v of [0, 25, 50]) body += label(34, left.y(v / 55) + 4, v, "end");
  for (const v of [49, 50, 51, 52]) body += label(204, right.y((v - 49) / 3.3) + 4, v, "end");
  body += bars(left, [50 / 55, 52 / 55]) + bars(right, [1 / 3.3, 3 / 3.3], result);
  body += label(left.x(0.25), 140, "A") + label(left.x(0.75), 140, "B") + label(right.x(0.25), 140, "A") + label(right.x(0.75), 140, "B");
  return figure(
    336,
    148,
    body,
    "The same two values drawn twice: A is 50 and B is 52. On the left the axis starts at 0 and the bars look almost equal; on the right the axis starts at 49, so B's bar looks three times as tall as A's.",
    "同样的两个数值画了两次：A 是 50，B 是 52。左图纵轴从 0 开始，两个条几乎一样高；右图纵轴从 49 开始，B 的条看起来是 A 的三倍高。",
  );
})();

/** fourVisuals shows a labeled diagram, a flow chart, a cycle diagram and a cross-section. */
export const fourVisuals: Figure = (() => {
  const arrow = (x1: number, y1: number, x2: number, y2: number) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><polyline points="${x2 - 5},${y2 - 4} ${x2},${y2} ${x2 - 5},${y2 + 4}"/>`;
  const labeled =
    `<rect ${accent} x="14" y="30" width="34" height="30" rx="4"/><circle ${accent} cx="31" cy="20" r="9"/>` +
    `<line x1="40" y1="20" x2="62" y2="14"/>${label(68, 18, 1)}<line x1="48" y1="45" x2="62" y2="45"/>${label(68, 49, 2)}<line x1="31" y1="60" x2="62" y2="72"/>${label(68, 76, 3)}`;
  const flow =
    `<rect ${accent} x="90" y="34" width="18" height="18"/><rect ${accent} x="122" y="34" width="18" height="18"/><rect ${accent} x="154" y="34" width="18" height="18"/>` +
    arrow(108, 43, 121, 43) +
    arrow(140, 43, 153, 43) +
    label(99, 70, 1) +
    label(131, 70, 2) +
    label(163, 70, 3);
  const cycle =
    `<path ${accent} d="M218 20 A24 24 0 0 1 242 44"/><path ${accent} d="M242 50 A24 24 0 0 1 218 74"/><path ${accent} d="M212 74 A24 24 0 0 1 194 50"/><path ${accent} d="M194 44 A24 24 0 0 1 212 20"/>` +
    `<polyline points="238,38 242,44 246,38"/><polyline points="224,70 218,74 224,78"/><polyline points="190,56 194,50 198,56"/><polyline points="206,16 212,20 206,24"/>`;
  const section =
    `<circle cx="292" cy="47" r="28"/><circle ${accent} cx="292" cy="47" r="18"/><circle ${result} fill="currentColor" fill-opacity="0.45" cx="292" cy="47" r="8"/>` +
    `<line x1="262" y1="47" x2="322" y2="47" stroke-dasharray="3 3"/>`;
  const body = labeled + flow + cycle + section + label(44, 96, "A") + label(131, 96, "B") + label(218, 96, "C") + label(292, 96, "D");
  return figure(
    336,
    102,
    body,
    "Four kinds of visual: A, a labeled diagram, whose parts are numbered 1, 2 and 3 with lines to each; B, a flow chart of three steps joined by arrows; C, a cycle diagram whose four arrows lead round in a circle; D, a cross-section showing three layers inside a round object, as if it were cut open.",
    "四种图示：A 是标注图，用线条指向各部分并编号 1、2、3；B 是流程图，三个步骤用箭头相连；C 是循环图，四个箭头绕成一圈；D 是剖面图，像切开一样显示圆形物体内部的三层。",
  );
})();

/** risingTogether shows two lines that rise and fall together over twelve months. */
export const risingTogether: Figure = (() => {
  const p = panel(30, 14, 280, 110);
  const first = [0.15, 0.2, 0.3, 0.45, 0.6, 0.8, 0.9, 0.85, 0.65, 0.4, 0.25, 0.15];
  const second = [0.1, 0.12, 0.2, 0.32, 0.45, 0.62, 0.72, 0.68, 0.5, 0.3, 0.18, 0.1];
  const at = (i: number) => 0.04 + (i * 0.92) / 11;
  let body = p.body;
  body += line(
    p,
    first.map((v, i) => [at(i), v] as const),
  );
  body += line(
    p,
    second.map((v, i) => [at(i), v] as const),
    result,
  );
  for (const i of [0, 5, 11]) body += label(p.x(at(i)), 140, i + 1);
  return figure(
    336,
    148,
    body,
    "Two lines over twelve months that rise together to a peak in months 6 to 8 and fall together afterward, as sales of ice cream and cases of sunburn do; the lines move together, but neither causes the other.",
    "两条线跨越十二个月，一起上升到第 6 至 8 个月的峰值，之后又一起下降，就像冰淇淋销量和晒伤病例那样；两条线同步变化，但谁也不是谁的原因。",
  );
})();

/** sizesOfChange shows a rise from 40 to 42, from 40 to 44 and from 40 to 56, on the same scale. */
export const sizesOfChange: Figure = (() => {
  const ends = [42, 44, 56];
  const body = ends
    .map((end, i) => {
      const p = panel(30 + i * 104, 14, 80, 90);
      const y = (v: number) => (v - 30) / 30;
      return (
        p.body +
        line(p, [
          [0.1, y(40)],
          [0.9, y(end)],
        ]) +
        label(p.x(0.1) + 8, p.y(y(40)) + 16, 40) +
        label(p.x(0.9), p.y(y(end)) - 8, end)
      );
    })
    .join("");
  return figure(
    336,
    112,
    body,
    "Three changes on the same scale: from 40 to 42, which is stable; from 40 to 44, a slight rise of a tenth; and from 40 to 56, a sharp rise of two fifths.",
    "同一刻度上的三种变化：从 40 到 42，基本平稳；从 40 到 44，上升十分之一，属于小幅上升；从 40 到 56，上升五分之二，属于急剧上升。",
  );
})();

/** drawn gives knowledge points of a topic their figures, by the knowledge point's id. */
export function drawn(topic: TopicDef, figures: Readonly<Record<string, Figure>>): TopicDef {
  for (const id of Object.keys(figures)) {
    if (!topic.knowledgePoints.some((kp) => kp.id === id)) throw new Error(`${topic.id} has no knowledge point ${id}`);
  }
  return {
    ...topic,
    knowledgePoints: topic.knowledgePoints.map((kp): KnowledgePointDef => {
      const drawing = figures[kp.id];
      return drawing === undefined ? kp : { ...kp, figure: drawing };
    }),
  };
}
