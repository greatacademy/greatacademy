// Shared drawing and writing helpers for the courses of grades 1 to 3, where a
// picture often carries the problem: counters, arrays, base-ten blocks, clocks,
// graphs, grids and number lines.

import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { svgDocument } from "@ga/subject-math";

/** earlyFigureWidth is the width of the drawing area that svgDocument provides. */
const earlyFigureWidth = 320;

const accent = `class="accent" fill="currentColor"`;

/** earlyPoint builds a knowledge point from its id, its title and explanation as [English, Chinese] pairs, and its generator. */
export function earlyPoint(
  id: string,
  title: readonly [string, string],
  explanation: readonly [string, string],
  generate: (rng: Rng) => Problem,
): KnowledgePointDef {
  return { id, title: t(title[0], title[1]), explanation: t(explanation[0], explanation[1]), generate };
}

/** earlyTopic builds a topic from its id, its title and summary as [English, Chinese] pairs, its prerequisites, its Common Core codes and its points. */
export function earlyTopic(
  id: string,
  title: readonly [string, string],
  summary: readonly [string, string],
  prerequisites: readonly string[],
  standards: readonly string[],
  knowledgePoints: readonly KnowledgePointDef[],
): TopicDef {
  return {
    id,
    title: t(title[0], title[1]),
    summary: t(summary[0], summary[1]),
    prerequisites: [...prerequisites],
    encompasses: [],
    xp: 8,
    standards: standards.map((code) => `CCSS.${code}`),
    knowledgePoints: [...knowledgePoints],
  };
}

/** earlyNames are first names for word problems, spelled the same in both languages' prompts. */
export const earlyNames: readonly string[] = [
  "Ava",
  "Ben",
  "Chloe",
  "Diego",
  "Emma",
  "Felix",
  "Grace",
  "Hana",
  "Ivan",
  "Jade",
  "Leo",
  "Mia",
];

/** earlyThings are things to count in word problems, as a plural English noun, a Chinese noun and its measure word. */
export const earlyThings: readonly { readonly en: string; readonly zh: string; readonly unit: string }[] = [
  { en: "apples", zh: "苹果", unit: "个" },
  { en: "pencils", zh: "铅笔", unit: "支" },
  { en: "stickers", zh: "贴纸", unit: "张" },
  { en: "marbles", zh: "弹珠", unit: "颗" },
  { en: "books", zh: "书", unit: "本" },
  { en: "shells", zh: "贝壳", unit: "个" },
  { en: "cards", zh: "卡片", unit: "张" },
  { en: "blocks", zh: "积木", unit: "块" },
];

/** nearbyWrong lists whole numbers near the answer, leaving out negative ones and the answer itself. */
export function nearbyWrong(answer: number, ...others: readonly number[]): number[] {
  return [...others, answer + 1, answer - 1, answer + 2, answer - 2, answer + 10].filter((v) => v >= 0 && v !== answer);
}

/** countersFigure draws n counters in rows of perRow, the first accented of them filled in the accent color. */
export function countersFigure(n: number, perRow = 5, accented = 0): Figure {
  const rows = Math.ceil(n / perRow);
  let body = "";
  for (let i = 0; i < n; i++) {
    const x = 30 + (i % perRow) * 26;
    const y = 18 + Math.floor(i / perRow) * 26;
    body += `<circle cx="${x}" cy="${y}" r="9"${i < accented ? ` ${accent}` : ""}/>`;
  }
  return {
    svg: svgDocument(rows * 26 + 10, body),
    alt: t(`${n} counters in rows of ${perRow}.`, `${n} 个圆片，每行 ${perRow} 个。`),
  };
}

/** arrayFigure draws an array of dots with the given rows and columns. */
export function arrayFigure(rows: number, columns: number): Figure {
  const gap = Math.min(26, Math.floor((earlyFigureWidth - 40) / columns));
  let body = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) body += `<circle cx="${30 + c * gap}" cy="${18 + r * gap}" r="${Math.min(9, gap / 3)}" ${accent}/>`;
  }
  return {
    svg: svgDocument(rows * gap + 12, body),
    alt: t(`An array of dots with ${rows} rows and ${columns} columns.`, `一个点阵，共 ${rows} 行 ${columns} 列。`),
  };
}

/** baseTenFigure draws hundreds as large squares, tens as long rods and ones as small squares. */
export function baseTenFigure(hundreds: number, tens: number, ones: number): Figure {
  let x = 10;
  let body = "";
  for (let i = 0; i < hundreds; i++) {
    body += `<rect x="${x}" y="10" width="50" height="50" ${accent} fill-opacity="0.25"/>`;
    x += 56;
  }
  for (let i = 0; i < tens; i++) {
    body += `<rect x="${x}" y="10" width="7" height="50"/><line x1="${x}" y1="20" x2="${x + 7}" y2="20"/><line x1="${x}" y1="30" x2="${x + 7}" y2="30"/><line x1="${x}" y1="40" x2="${x + 7}" y2="40"/><line x1="${x}" y1="50" x2="${x + 7}" y2="50"/>`;
    x += 11;
  }
  x += 4;
  for (let i = 0; i < ones; i++) {
    const column = Math.floor(i / 5);
    body += `<rect x="${x + column * 11}" y="${50 - (i % 5) * 10}" width="7" height="7" ${accent}/>`;
  }
  return {
    svg: svgDocument(70, body),
    alt: t(
      `Base-ten blocks: ${hundreds} hundreds, ${tens} tens and ${ones} ones.`,
      `十进制积木：${hundreds} 个百、${tens} 个十和 ${ones} 个一。`,
    ),
  };
}

/** clockFigure draws an analog clock showing the given hour and minute. */
export function clockFigure(hour: number, minute: number): Figure {
  const cx = 160;
  const cy = 80;
  const r = 70;
  const hand = (angle: number, length: number) =>
    `x2="${(cx + length * Math.sin(angle)).toFixed(2)}" y2="${(cy - length * Math.cos(angle)).toFixed(2)}"`;
  let body = `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
  for (let i = 1; i <= 12; i++) {
    const a = (i * Math.PI) / 6;
    body += `<text x="${(cx + 56 * Math.sin(a)).toFixed(2)}" y="${(cy - 56 * Math.cos(a) + 4).toFixed(2)}" text-anchor="middle" stroke="none" fill="currentColor">${i}</text>`;
  }
  for (let i = 0; i < 60; i++) {
    const a = (i * Math.PI) / 30;
    const inner = i % 5 === 0 ? r - 7 : r - 3;
    body += `<line x1="${(cx + inner * Math.sin(a)).toFixed(2)}" y1="${(cy - inner * Math.cos(a)).toFixed(2)}" ${hand(a, r)}/>`;
  }
  const hourAngle = ((hour % 12) + minute / 60) * (Math.PI / 6);
  const minuteAngle = minute * (Math.PI / 30);
  body += `<g class="accent" stroke-width="3"><line x1="${cx}" y1="${cy}" ${hand(hourAngle, 34)}/></g><g class="accent"><line x1="${cx}" y1="${cy}" ${hand(minuteAngle, 52)}/></g>`;
  return {
    svg: svgDocument(160, body),
    alt: t(`An analog clock whose hands show a time.`, `一个指针式钟面，指针指示某个时间。`),
  };
}

/** barGraphFigure draws a bar graph with one vertical bar per value, labeled by letters, and a scale marked every `step`. */
export function barGraphFigure(labels: readonly string[], values: readonly number[], step: number): Figure {
  const top = Math.ceil(Math.max(...values) / step) * step;
  const height = 130;
  const y = (v: number) => 10 + height - (v / top) * height;
  let body = `<line x1="40" y1="10" x2="40" y2="${10 + height}"/><line x1="40" y1="${10 + height}" x2="310" y2="${10 + height}"/>`;
  for (let v = 0; v <= top; v += step) {
    body += `<line x1="36" y1="${y(v).toFixed(2)}" x2="310" y2="${y(v).toFixed(2)}" stroke-opacity="0.25"/><text x="32" y="${(y(v) + 4).toFixed(2)}" text-anchor="end" stroke="none" fill="currentColor">${v}</text>`;
  }
  const slot = 260 / values.length;
  values.forEach((value, i) => {
    const x = 50 + i * slot;
    body += `<rect x="${x.toFixed(2)}" y="${y(value).toFixed(2)}" width="${(slot * 0.6).toFixed(2)}" height="${(10 + height - y(value)).toFixed(2)}" ${accent} fill-opacity="0.45"/>`;
    body += `<text x="${(x + slot * 0.3).toFixed(2)}" y="${height + 26}" text-anchor="middle" stroke="none" fill="currentColor">${labels[i]}</text>`;
  });
  return {
    svg: svgDocument(height + 34, body),
    alt: t(
      `A bar graph with bars ${labels.join(", ")} of heights ${values.join(", ")}.`,
      `条形图，条 ${labels.join("、")} 的高度分别是 ${values.join("、")}。`,
    ),
  };
}

/** pictureGraphFigure draws a picture graph with one row per label, where each dot stands for `per` items. */
export function pictureGraphFigure(labels: readonly string[], values: readonly number[], per: number): Figure {
  let body = "";
  values.forEach((value, row) => {
    const rowY = 18 + row * 28;
    body += `<text x="16" y="${rowY + 4}" text-anchor="middle" stroke="none" fill="currentColor">${labels[row]}</text>`;
    for (let i = 0; i < value / per; i++) body += `<circle cx="${44 + i * 24}" cy="${rowY}" r="9" ${accent}/>`;
  });
  return {
    svg: svgDocument(values.length * 28 + 10, body),
    alt: t(
      `A picture graph with rows ${labels.join(", ")}. Each dot stands for ${per}. The rows stand for ${values.join(", ")}.`,
      `象形统计图，各行是 ${labels.join("、")}。每个点代表 ${per}。各行分别代表 ${values.join("、")}。`,
    ),
  };
}

/** gridFigure draws a rectangle cut into unit squares, with the first `shaded` squares shaded. */
export function gridFigure(rows: number, columns: number, shaded = rows * columns): Figure {
  const size = Math.min(24, Math.floor((earlyFigureWidth - 20) / columns));
  let body = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      body += `<rect x="${10 + c * size}" y="${6 + r * size}" width="${size}" height="${size}"${r * columns + c < shaded ? ` ${accent} fill-opacity="0.35"` : ""}/>`;
    }
  }
  return {
    svg: svgDocument(rows * size + 12, body),
    alt: t(
      `A rectangle cut into ${rows} rows of ${columns} equal squares, ${shaded} of them shaded.`,
      `一个长方形被分成 ${rows} 行、每行 ${columns} 个相同的正方形，其中 ${shaded} 个涂了颜色。`,
    ),
  };
}

/** numberLineFigure draws a number line from lo to hi with a tick every step and an accented mark at `mark`, labeling only the ends unless all are labeled. */
export function numberLineFigure(lo: number, hi: number, step: number, mark?: number, labelAll = true): Figure {
  const x = (v: number) => 20 + ((v - lo) / (hi - lo)) * 280;
  let body = `<line x1="10" y1="24" x2="310" y2="24"/>`;
  const ticks = Math.round((hi - lo) / step);
  for (let i = 0; i <= ticks; i++) {
    const v = lo + i * step;
    body += `<line x1="${x(v).toFixed(2)}" y1="18" x2="${x(v).toFixed(2)}" y2="30"/>`;
    if (labelAll || i === 0 || i === ticks) {
      body += `<text x="${x(v).toFixed(2)}" y="46" text-anchor="middle" stroke="none" fill="currentColor">${v}</text>`;
    }
  }
  if (mark !== undefined) body += `<circle cx="${x(mark).toFixed(2)}" cy="24" r="5" ${accent}/>`;
  return {
    svg: svgDocument(54, body),
    alt: t(
      `A number line from ${lo} to ${hi} with a tick every ${step}${mark === undefined ? "" : " and one marked point"}.`,
      `一条从 ${lo} 到 ${hi} 的数轴，每 ${step} 一个刻度${mark === undefined ? "" : "，上面标出一个点"}。`,
    ),
  };
}

/** polygonFigure draws a polygon through the given points, scaled from a 0-to-10 square. */
export function polygonFigure(points: readonly (readonly [number, number])[], alt: Text): Figure {
  const path = points.map(([x, y]) => `${60 + x * 20},${10 + (10 - y) * 12}`).join(" ");
  return {
    svg: svgDocument(140, `<polygon points="${path}" class="accent" fill="currentColor" fill-opacity="0.2"/><polygon points="${path}"/>`),
    alt,
  };
}

/** labeledRectangleFigure draws a rectangle with its side lengths written beside it, followed by a unit. */
export function labeledRectangleFigure(width: number, height: number, unit: string): Figure {
  const w = Math.min(200, 40 + width * 12);
  const h = Math.min(90, 30 + height * 8);
  return {
    svg: svgDocument(
      h + 44,
      `<rect x="60" y="24" width="${w}" height="${h}" class="accent" fill="currentColor" fill-opacity="0.2"/><rect x="60" y="24" width="${w}" height="${h}"/>` +
        `<text x="${60 + w / 2}" y="16" text-anchor="middle" stroke="none" fill="currentColor">${width} ${unit}</text>` +
        `<text x="52" y="${24 + h / 2 + 4}" text-anchor="end" stroke="none" fill="currentColor">${height} ${unit}</text>`,
    ),
    alt: t(`A rectangle ${width} ${unit} wide and ${height} ${unit} tall.`, `一个宽 ${width} ${unit}、高 ${height} ${unit} 的长方形。`),
  };
}
