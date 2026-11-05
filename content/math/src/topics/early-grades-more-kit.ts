// Writing helpers and figures shared by the added topics of grades 1 to 3:
// number bonds, fact triangles, bar models, open number lines, hundred charts,
// solids, scales, rulers in fractions of an inch and shapes with labeled sides.

import type { Figure, Problem, Rng, Text } from "@ga/content";
import { same, t } from "@ga/content";
import { svgDocument } from "@ga/subject-math";

import { nearbyWrong } from "../early-grades-kit.ts";
import { numberProblem } from "../problems.ts";
import { pickChoice } from "./grade-4-fractions.ts";

/** Pair is a text as an English and a Chinese string. */
export type Pair = readonly [string, string];

/** whole builds a problem whose answer is a whole number, with a figure when one is given. */
export function whole(prompt: Pair, answer: number, wrong: readonly number[], solution: Pair, figure?: Figure): Problem {
  const problem = numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    form: "integer",
    wrong: nearbyWrong(answer, ...wrong).filter((v) => v >= 0),
    solution: t(solution[0], solution[1]),
  });
  return figure ? { ...problem, figure } : problem;
}

/** choose builds a choice problem from a correct option and wrong ones, all as pairs of strings; the options are shuffled. */
export function choose(rng: Rng, prompt: Pair, correct: Pair, wrong: readonly Pair[], solution: Pair, figure?: Figure): Problem {
  return pickChoice(
    rng,
    t(prompt[0], prompt[1]),
    t(correct[0], correct[1]),
    wrong.map((w) => t(w[0], w[1])),
    t(solution[0], solution[1]),
    figure,
  );
}

/** chooseMath builds a choice problem whose options are the same LaTeX expressions in both languages. */
export function chooseMath(rng: Rng, prompt: Pair, correct: string, wrong: readonly string[], solution: Pair, figure?: Figure): Problem {
  const options = (s: string): Text => same(`$${s}$`);
  return pickChoice(rng, t(prompt[0], prompt[1]), options(correct), wrong.map(options), t(solution[0], solution[1]), figure);
}

const accent = `class="accent" fill="currentColor"`;
const label = `stroke="none" fill="currentColor"`;

/** text draws a label centered on x, with its baseline at y. */
const text = (x: number, y: number, s: string | number, size?: number) =>
  `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" ${label}${size ? ` font-size="${size}"` : ""}>${s}</text>`;

/** shown writes a known number, or a question mark for an unknown one. */
const shown = (v: number | null) => (v === null ? "?" : `${v}`);

/** circleWith draws a circle holding a number or a question mark, accented when the number is unknown. */
const circleWith = (x: number, y: number, r: number, v: number | null) =>
  `<circle cx="${x}" cy="${y}" r="${r}"${v === null ? ` ${accent} fill-opacity="0.2"` : ""}/>${text(x, y + 5, shown(v), 15)}`;

/** numberBondFigure draws a whole above its two parts, joined by lines; null marks the unknown number. */
export function numberBondFigure(all: number | null, left: number | null, right: number | null): Figure {
  const body =
    `<line x1="145" y1="44" x2="115" y2="76"/><line x1="175" y1="44" x2="205" y2="76"/>` +
    circleWith(160, 28, 22, all) +
    circleWith(100, 92, 22, left) +
    circleWith(220, 92, 22, right);
  return {
    svg: svgDocument(122, body),
    alt: t(
      `A number bond with whole ${shown(all)} and parts ${shown(left)} and ${shown(right)}.`,
      `一个数的分与合图，整体是 ${shown(all)}，两部分是 ${shown(left)} 和 ${shown(right)}。`,
    ),
  };
}

/** factTriangleFigure draws a triangle with a total at the top and two parts at the bottom corners, null marking the unknown; `sign` is written in the middle. */
export function factTriangleFigure(top: number | null, left: number | null, right: number | null, sign = ""): Figure {
  const body =
    `<line x1="146.9" y1="41.1" x2="93.1" y2="102.9"/><line x1="173.1" y1="41.1" x2="226.9" y2="102.9"/><line x1="100" y1="118" x2="220" y2="118"/>` +
    circleWith(160, 26, 20, top) +
    circleWith(80, 118, 20, left) +
    circleWith(240, 118, 20, right) +
    (sign ? text(160, 92, sign, 16) : "");
  return {
    svg: svgDocument(144, body),
    alt: t(
      `A fact triangle with ${shown(top)} at the top and ${shown(left)} and ${shown(right)} at the bottom corners.`,
      `一个算式三角形，顶上是 ${shown(top)}，下面两个角是 ${shown(left)} 和 ${shown(right)}。`,
    ),
  };
}

/** chartPieceFigure draws a piece of a hundred chart starting at `first`, showing only the numbers in `visible` and a question mark at `asked`. */
export function chartPieceFigure(first: number, rows: number, columns: number, visible: readonly number[], asked: number): Figure {
  const size = 40;
  const left = 160 - (columns * size) / 2;
  let body = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const v = first + r * 10 + c;
      const x = left + c * size;
      const y = 6 + r * 30;
      body += `<rect x="${x}" y="${y}" width="${size}" height="30"${v === asked ? ` ${accent} fill-opacity="0.25"` : ""}/>`;
      if (v === asked) body += text(x + size / 2, y + 20, "?", 14);
      else if (visible.includes(v)) body += text(x + size / 2, y + 20, v, 13);
    }
  }
  return {
    svg: svgDocument(rows * 30 + 12, body),
    alt: t(
      `A piece of a hundred chart with ${rows} rows and ${columns} columns, showing ${visible.join(", ")}, with one square asked about.`,
      `百数表的一部分，共 ${rows} 行 ${columns} 列，上面有 ${visible.join("、")}，还有一格要你来填。`,
    ),
  };
}

/** partWholeBarFigure draws a whole bar above the same bar cut into parts; `hidden` is the index of the unknown part, or -1 when the whole is unknown. */
export function partWholeBarFigure(parts: readonly number[], hidden: number): Figure {
  const total = parts.reduce((sum, p) => sum + p, 0);
  const scale = 280 / total;
  let body =
    `<rect x="20" y="8" width="280" height="30"${hidden === -1 ? ` ${accent} fill-opacity="0.25"` : ""}/>` +
    `<rect x="20" y="8" width="280" height="30"/>${text(160, 28, hidden === -1 ? "?" : total, 14)}`;
  let x = 20;
  parts.forEach((p, i) => {
    const w = p * scale;
    body += `<rect x="${x.toFixed(1)}" y="42" width="${w.toFixed(1)}" height="30"${i === hidden ? ` ${accent} fill-opacity="0.25"` : ""}/>`;
    body += text(x + w / 2, 62, i === hidden ? "?" : p, 14);
    x += w;
  });
  return {
    svg: svgDocument(80, body),
    alt: t(
      `A bar model. The whole is ${hidden === -1 ? "unknown" : total}. The parts are ${parts.map((p, i) => (i === hidden ? "unknown" : p)).join(", ")}.`,
      `一个线段图。整体是 ${hidden === -1 ? "未知数" : total}，各部分是 ${parts.map((p, i) => (i === hidden ? "未知数" : p)).join("、")}。`,
    ),
  };
}

/** compareBarsFigure draws two labeled bars from a common left end, where null hides a number; `gap` shows the difference as a dashed piece with its number or a question mark. */
export function compareBarsFigure(
  labels: readonly [string, string],
  values: readonly [number, number],
  hide: "first" | "second" | "gap" | "none",
): Figure {
  const scale = 240 / Math.max(...values);
  const bar = (i: 0 | 1, y: number, hideIt: boolean) => {
    const w = values[i] * scale;
    return `${text(30, y + 20, labels[i], 12)}<rect x="60" y="${y}" width="${w.toFixed(1)}" height="28" ${accent} fill-opacity="${hideIt ? 0.3 : 0.15}"/><rect x="60" y="${y}" width="${w.toFixed(1)}" height="28"/>${text(60 + w / 2, y + 19, hideIt ? "?" : values[i], 14)}`;
  };
  const shorter = values[0] < values[1] ? 0 : 1;
  const low = values[shorter] * scale;
  const high = Math.max(...values) * scale;
  const gapY = 8 + shorter * 34;
  const gapPiece =
    hide === "none"
      ? ""
      : `<rect x="${(60 + low).toFixed(1)}" y="${gapY}" width="${(high - low).toFixed(1)}" height="28" stroke-dasharray="4 3"/>${text(
          60 + (low + high) / 2,
          gapY + 19,
          hide === "gap" ? "?" : Math.abs(values[0] - values[1]),
          14,
        )}`;
  const body = bar(0, 8, hide === "first") + bar(1, 42, hide === "second") + gapPiece;
  return {
    svg: svgDocument(78, body),
    alt: t(
      `Two bars for ${labels[0]} and ${labels[1]}, compared from the same left end.`,
      `${labels[0]} 和 ${labels[1]} 的两个长条，从同一端开始比较。`,
    ),
  };
}

/** hopsFigure draws an open number line through the stops, with an arrow over each hop labeled by its change; `hideEnd` writes a question mark for the last stop and `hideHop` for the hop at that index. */
export function hopsFigure(stops: readonly number[], hideEnd = false, hideHop = -1): Figure {
  const sorted = [...stops].sort((a, b) => a - b);
  const weights = sorted.slice(1).map((v, i) => Math.max(1.6, Math.sqrt(v - (sorted[i] as number))));
  const all = weights.reduce((sum, w) => sum + w, 0);
  const place = new Map<number, number>();
  let x = 26;
  sorted.forEach((v, i) => {
    place.set(v, x);
    x += ((weights[i] ?? 0) / all) * 268;
  });
  const at = (v: number) => place.get(v) as number;
  let body = `<line x1="8" y1="60" x2="312" y2="60"/>`;
  stops.forEach((v, i) => {
    const isEnd = i === stops.length - 1 && hideEnd;
    body += `<line x1="${at(v).toFixed(1)}" y1="54" x2="${at(v).toFixed(1)}" y2="66"/>${text(at(v), 82, isEnd ? "?" : v, 13)}`;
  });
  stops.slice(1).forEach((v, i) => {
    const from = at(stops[i] as number);
    const to = at(v);
    const middle = (from + to) / 2;
    const dir = to > from ? 1 : -1;
    const change = v - (stops[i] as number);
    body += `<g class="accent"><path d="M ${from.toFixed(1)} 54 Q ${middle.toFixed(1)} 22 ${to.toFixed(1)} 54"/><path d="M ${(to - dir * 7).toFixed(1)} 45 L ${to.toFixed(1)} 54 L ${(to - dir * 1).toFixed(1)} 43"/></g>`;
    body += text(middle, 24, i === hideHop ? "?" : `${change > 0 ? "+" : "−"}${Math.abs(change)}`, 12);
  });
  return {
    svg: svgDocument(92, body),
    alt: t(
      `An open number line with jumps from ${stops[0]} through ${stops.slice(1, hideEnd ? -1 : undefined).join(", ")}${hideEnd ? " to an unknown number" : ""}.`,
      `一条空数轴，从 ${stops[0]} 开始跳，经过 ${stops.slice(1, hideEnd ? -1 : undefined).join("、")}${hideEnd ? "，跳到一个未知的数" : ""}。`,
    ),
  };
}

/** BarMeasure is one way of laying units along a bar: edge to edge, with gaps, overlapping, or starting away from the end. */
export type BarMeasure = "good" | "gaps" | "overlap" | "late";

/** measuredBarsFigure draws one lettered row per way of laying units under a bar `length` units long. */
export function measuredBarsFigure(labels: readonly string[], ways: readonly BarMeasure[], length: number): Figure {
  const u = 30;
  let body = "";
  ways.forEach((way, row) => {
    const y = 6 + row * 48;
    body += text(14, y + 16, labels[row] as string, 13);
    body += `<rect x="30" y="${y}" width="${length * u}" height="12" ${accent} fill-opacity="0.35"/><rect x="30" y="${y}" width="${length * u}" height="12"/>`;
    const step = way === "gaps" ? u + 8 : way === "overlap" ? u - 8 : u;
    const start = way === "late" ? 42 : 30;
    const count =
      way === "gaps"
        ? Math.floor((length * u) / step)
        : way === "overlap"
          ? Math.floor((length * u - u) / step) + 1
          : way === "late"
            ? length - 1
            : length;
    for (let i = 0; i < count; i++)
      body += `<rect x="${start + i * step}" y="${y + 15 + (way === "overlap" ? (i % 2) * 5 : 0)}" width="${u}" height="14"/>`;
  });
  return {
    svg: svgDocument(ways.length * 48 + 6, body),
    alt: t(
      `Rows ${labels.join(", ")}, each showing a bar with small blocks laid under it.`,
      `${labels.join("、")} 几行，每行有一个长条，下面摆着小方块。`,
    ),
  };
}

/** MixedShape is a kind of shape in a sorted group. */
export type MixedShape = "circle" | "square" | "triangle" | "star";

/** mixedShapesFigure draws a row-by-row mix of shapes to sort and count. */
export function mixedShapesFigure(items: readonly MixedShape[]): Figure {
  let body = "";
  items.forEach((shape, i) => {
    const x = 28 + (i % 8) * 38;
    const y = 22 + Math.floor(i / 8) * 38;
    if (shape === "circle") body += `<circle cx="${x}" cy="${y}" r="13" ${accent} fill-opacity="0.2"/><circle cx="${x}" cy="${y}" r="13"/>`;
    if (shape === "square") body += `<rect x="${x - 12}" y="${y - 12}" width="24" height="24"/>`;
    if (shape === "triangle")
      body += `<polygon points="${x},${y - 13} ${x + 13},${y + 11} ${x - 13},${y + 11}" ${accent} fill-opacity="0.5"/>`;
    if (shape === "star") {
      const points = [...Array(10).keys()]
        .map((k) => {
          const r = k % 2 ? 6 : 14;
          const a = (k * Math.PI) / 5;
          return `${(x + r * Math.sin(a)).toFixed(1)},${(y - r * Math.cos(a)).toFixed(1)}`;
        })
        .join(" ");
      body += `<polygon points="${points}"/>`;
    }
  });
  return {
    svg: svgDocument(Math.ceil(items.length / 8) * 38 + 8, body),
    alt: t(
      `A mix of ${items.length} shapes: circles, squares, triangles and stars.`,
      `混在一起的 ${items.length} 个图形：圆、正方形、三角形和星形。`,
    ),
  };
}

/** SolidKind names a solid shape that can be drawn. */
export type SolidKind = "cube" | "box" | "cylinder" | "cone" | "sphere" | "pyramid";

/** solidBody draws a solid centered near (x, y) at a size of about 60 scale units. */
function solidBody(kind: SolidKind, x: number, y: number, s: number): string {
  const n = (v: number) => v.toFixed(1);
  const fill = `${accent} fill-opacity="0.15"`;
  const box = (w: number, h: number, d: number) => {
    const l = x - w / 2 - d / 4;
    const b = y + h / 2 + d / 4;
    const outline = `${n(l)},${n(b)} ${n(l + w)},${n(b)} ${n(l + w + d)},${n(b - d)} ${n(l + w + d)},${n(b - d - h)} ${n(l + d)},${n(b - d - h)} ${n(l)},${n(b - h)}`;
    return (
      `<polygon points="${outline}" ${fill}/><polygon points="${outline}"/>` +
      `<rect x="${n(l)}" y="${n(b - h)}" width="${n(w)}" height="${n(h)}"/><line x1="${n(l + w)}" y1="${n(b - h)}" x2="${n(l + w + d)}" y2="${n(b - d - h)}"/>`
    );
  };
  if (kind === "cube") return box(44 * s, 44 * s, 20 * s);
  if (kind === "box") return box(72 * s, 34 * s, 22 * s);
  if (kind === "sphere") {
    return `<circle cx="${n(x)}" cy="${n(y)}" r="${n(32 * s)}" ${fill}/><circle cx="${n(x)}" cy="${n(y)}" r="${n(32 * s)}"/><path d="M ${n(x - 32 * s)} ${n(y)} A ${n(32 * s)} ${n(10 * s)} 0 0 0 ${n(x + 32 * s)} ${n(y)}"/>`;
  }
  if (kind === "cylinder") {
    const rx = 26 * s;
    const ry = 8 * s;
    const h = 30 * s;
    return (
      `<path d="M ${n(x - rx)} ${n(y - h)} L ${n(x - rx)} ${n(y + h)} A ${n(rx)} ${n(ry)} 0 0 0 ${n(x + rx)} ${n(y + h)} L ${n(x + rx)} ${n(y - h)} Z" ${fill}/>` +
      `<path d="M ${n(x - rx)} ${n(y - h)} L ${n(x - rx)} ${n(y + h)} A ${n(rx)} ${n(ry)} 0 0 0 ${n(x + rx)} ${n(y + h)} L ${n(x + rx)} ${n(y - h)}"/><ellipse cx="${n(x)}" cy="${n(y - h)}" rx="${n(rx)}" ry="${n(ry)}"/>`
    );
  }
  if (kind === "cone") {
    const rx = 28 * s;
    const ry = 8 * s;
    const h = 30 * s;
    const shape = `M ${n(x)} ${n(y - h)} L ${n(x + rx)} ${n(y + h)} A ${n(rx)} ${n(ry)} 0 0 1 ${n(x - rx)} ${n(y + h)} Z`;
    return `<path d="${shape}" ${fill}/><path d="${shape}"/><path d="M ${n(x - rx)} ${n(y + h)} A ${n(rx)} ${n(ry)} 0 0 1 ${n(x + rx)} ${n(y + h)}" stroke-dasharray="3 3"/>`;
  }
  const b = y + 26 * s;
  const outline = `${n(x)},${n(y - 34 * s)} ${n(x + 38 * s)},${n(b - 8 * s)} ${n(x + 12 * s)},${n(b + 6 * s)} ${n(x - 38 * s)},${n(b)}`;
  return `<polygon points="${outline}" ${fill}/><polygon points="${outline}"/><line x1="${n(x)}" y1="${n(y - 34 * s)}" x2="${n(x + 12 * s)}" y2="${n(b + 6 * s)}"/>`;
}

const solidNames: Readonly<Record<SolidKind, Pair>> = {
  cube: ["cube", "正方体"],
  box: ["rectangular prism", "长方体"],
  cylinder: ["cylinder", "圆柱"],
  cone: ["cone", "圆锥"],
  sphere: ["sphere", "球"],
  pyramid: ["pyramid", "棱锥"],
};

/** solidName gives the English and Chinese names of a solid. */
export const solidName = (kind: SolidKind): Pair => solidNames[kind];

/** solidFigure draws one solid at a size given by `scale`. */
export function solidFigure(kind: SolidKind, scale = 1.2): Figure {
  return {
    svg: svgDocument(120, solidBody(kind, 160, 60, scale)),
    alt: t("A solid shape.", "一个立体图形。"),
  };
}

/** solidsRowFigure draws solids side by side, at most five in a row. */
export function solidsRowFigure(kinds: readonly SolidKind[]): Figure {
  const rows = Math.ceil(kinds.length / 5);
  const body = kinds.map((k, i) => solidBody(k, 34 + (i % 5) * 63, 40 + Math.floor(i / 5) * 76, 0.68)).join("");
  return { svg: svgDocument(rows * 76 + 6, body), alt: t(`A row of ${kinds.length} solid shapes.`, `一排 ${kinds.length} 个立体图形。`) };
}

/** blockRowsFigure draws one row of base-ten blocks per entry of [hundreds, tens, ones], with room for extra tens and ones. */
export function blockRowsFigure(rows: readonly (readonly [number, number, number])[]): Figure {
  let body = "";
  rows.forEach(([hundreds, tens, ones], r) => {
    const top = 6 + r * 54;
    let x = 8;
    for (let i = 0; i < hundreds; i++) {
      body += `<rect x="${x}" y="${top}" width="46" height="46" ${accent} fill-opacity="0.25"/><rect x="${x}" y="${top}" width="46" height="46"/>`;
      x += 50;
    }
    for (let i = 0; i < tens; i++) {
      body += `<rect x="${x}" y="${top}" width="6" height="46"/>`;
      for (let k = 1; k < 5; k++) body += `<line x1="${x}" y1="${top + k * 9.2}" x2="${x + 6}" y2="${top + k * 9.2}"/>`;
      x += 9;
    }
    x += 4;
    for (let i = 0; i < ones; i++) {
      const c = Math.floor(i / 5);
      body += `<rect x="${x + c * 10}" y="${top + 40 - (i % 5) * 10}" width="7" height="7" ${accent}/>`;
    }
  });
  const say = (zh: boolean) =>
    rows
      .map(([h, n, o]) => (zh ? `${h ? `${h} 个百、` : ""}${n} 个十和 ${o} 个一` : `${h ? `${h} hundreds, ` : ""}${n} tens and ${o} ones`))
      .join(zh ? "；" : "; ");
  return { svg: svgDocument(rows.length * 54 + 6, body), alt: t(`Base-ten blocks: ${say(false)}.`, `十进制积木：${say(true)}。`) };
}

/** digitalClockFigure draws a digital clock showing a time. */
export function digitalClockFigure(hour: number, minute: number): Figure {
  const time = `${hour}:${String(minute).padStart(2, "0")}`;
  return {
    svg: svgDocument(
      72,
      `<rect x="96" y="6" width="128" height="60" rx="8" ${accent} fill-opacity="0.12"/><rect x="96" y="6" width="128" height="60" rx="8"/>${text(160, 48, time, 32)}`,
    ),
    alt: t(`A digital clock showing ${time}.`, `电子钟显示 ${time}。`),
  };
}

/** tableFigure draws a table of labels and values, with a value of null shown as a question mark. */
export function tableFigure(labels: readonly string[], values: readonly (number | null)[]): Figure {
  const w = Math.min(70, 280 / labels.length);
  const left = 160 - (labels.length * w) / 2;
  let body = "";
  labels.forEach((name, i) => {
    const x = left + i * w;
    const v = values[i] as number | null;
    body += `<rect x="${x}" y="6" width="${w}" height="28" ${accent} fill-opacity="0.15"/><rect x="${x}" y="6" width="${w}" height="28"/>${text(x + w / 2, 25, name, 13)}`;
    body += `<rect x="${x}" y="34" width="${w}" height="28"/>${text(x + w / 2, 53, shown(v), 14)}`;
  });
  return {
    svg: svgDocument(68, body),
    alt: t(
      `A table with ${labels.join(", ")} and the values ${values.map(shown).join(", ")}.`,
      `一张表，${labels.join("、")} 对应的数是 ${values.map(shown).join("、")}。`,
    ),
  };
}

/** labeledSidesFigure draws a polygon through points on a 0-to-10 square, each side labeled outside the shape; the label of side i joins point i to the next. */
export function labeledSidesFigure(points: readonly (readonly [number, number])[], labels: readonly string[]): Figure {
  const px = (x: number) => 60 + x * 20;
  const py = (y: number) => 24 + (10 - y) * 12;
  const cx = points.reduce((sum, p) => sum + px(p[0]), 0) / points.length;
  const cy = points.reduce((sum, p) => sum + py(p[1]), 0) / points.length;
  const path = points.map(([x, y]) => `${px(x)},${py(y)}`).join(" ");
  let body = `<polygon points="${path}" class="accent" fill="currentColor" fill-opacity="0.15"/><polygon points="${path}"/>`;
  points.forEach((p, i) => {
    const q = points[(i + 1) % points.length] as readonly [number, number];
    const mx = (px(p[0]) + px(q[0])) / 2;
    const my = (py(p[1]) + py(q[1])) / 2;
    const dx = mx - cx;
    const dy = my - cy;
    const size = Math.hypot(dx, dy) || 1;
    body += text(mx + (dx / size) * 18, my + (dy / size) * 14 + 4, labels[i] as string, 12);
  });
  return {
    svg: svgDocument(170, body),
    alt: t(`A shape with sides marked ${labels.join(", ")}.`, `一个图形，各边标着 ${labels.join("、")}。`),
  };
}

/** CutKind names a way of cutting a rectangle into parts. */
export type CutKind = "tall" | "wide" | "diagonal" | "grid" | "cross" | "uneven" | "tallThree" | "wideThree" | "tallFour" | "wideFour";

/** cutParts lists the parts of a rectangle 64 wide and 44 tall, as polygons. */
function cutParts(kind: CutKind): readonly string[] {
  const rect = (x0: number, y0: number, x1: number, y1: number) => `${x0},${y0} ${x1},${y0} ${x1},${y1} ${x0},${y1}`;
  const strips = (n: number, tall: boolean) =>
    [...Array(n).keys()].map((i) => (tall ? rect((i * 64) / n, 0, ((i + 1) * 64) / n, 44) : rect(0, (i * 44) / n, 64, ((i + 1) * 44) / n)));
  switch (kind) {
    case "tall":
      return strips(2, true);
    case "wide":
      return strips(2, false);
    case "diagonal":
      return ["0,0 64,0 64,44", "0,0 64,44 0,44"];
    case "grid":
      return [rect(0, 0, 32, 22), rect(32, 0, 64, 22), rect(0, 22, 32, 44), rect(32, 22, 64, 44)];
    case "cross":
      return ["0,0 64,0 32,22", "64,0 64,44 32,22", "64,44 0,44 32,22", "0,44 0,0 32,22"];
    case "uneven":
      return [rect(0, 0, 18, 44), rect(18, 0, 64, 44)];
    case "tallThree":
      return strips(3, true);
    case "wideThree":
      return strips(3, false);
    case "tallFour":
      return strips(4, true);
    case "wideFour":
      return strips(4, false);
  }
}

/** rectangleCutsFigure draws lettered rectangles, each cut in its way with its first `shaded` parts shaded. */
export function rectangleCutsFigure(
  labels: readonly string[],
  cuts: readonly { readonly kind: CutKind; readonly shaded: number }[],
): Figure {
  const gap = 320 / cuts.length;
  let body = "";
  cuts.forEach((cut, i) => {
    const ox = gap * i + gap / 2 - 32;
    const parts = cutParts(cut.kind);
    parts.forEach((part, k) => {
      const moved = part
        .split(" ")
        .map((pair) => {
          const [x, y] = pair.split(",").map(Number) as [number, number];
          return `${(ox + x).toFixed(1)},${y + 6}`;
        })
        .join(" ");
      if (k < cut.shaded) body += `<polygon points="${moved}" ${accent} fill-opacity="0.35"/>`;
      body += `<polygon points="${moved}"/>`;
    });
    body += text(ox + 32, 66, labels[i] as string, 13);
  });
  return {
    svg: svgDocument(74, body),
    alt: t(`Rectangles ${labels.join(", ")}, each cut into parts.`, `长方形 ${labels.join("、")}，每个都被分成几部分。`),
  };
}

/** timesTableFigure draws a multiplication table of the given row and column factors; only the cells in `visible` show their products, and `asked` shows a question mark. */
export function timesTableFigure(
  rows: readonly number[],
  columns: readonly number[],
  visible: (r: number, c: number) => boolean,
  asked?: readonly [number, number],
): Figure {
  const size = Math.min(34, Math.floor(300 / (columns.length + 1)));
  const left = 160 - ((columns.length + 1) * size) / 2;
  const h = 24;
  let body = `<rect x="${left}" y="4" width="${size}" height="${h}" ${accent} fill-opacity="0.15"/><rect x="${left}" y="4" width="${size}" height="${h}"/>${text(left + size / 2, 21, "×", 13)}`;
  columns.forEach((c, j) => {
    const x = left + (j + 1) * size;
    body += `<rect x="${x}" y="4" width="${size}" height="${h}" ${accent} fill-opacity="0.15"/><rect x="${x}" y="4" width="${size}" height="${h}"/>${text(x + size / 2, 21, c, 13)}`;
  });
  rows.forEach((r, i) => {
    const y = 4 + (i + 1) * h;
    body += `<rect x="${left}" y="${y}" width="${size}" height="${h}" ${accent} fill-opacity="0.15"/><rect x="${left}" y="${y}" width="${size}" height="${h}"/>${text(left + size / 2, y + 17, r, 13)}`;
    columns.forEach((c, j) => {
      const x = left + (j + 1) * size;
      const isAsked = asked !== undefined && asked[0] === r && asked[1] === c;
      body += `<rect x="${x}" y="${y}" width="${size}" height="${h}"${isAsked ? ` ${accent} fill-opacity="0.3"` : ""}/><rect x="${x}" y="${y}" width="${size}" height="${h}"/>`;
      if (isAsked) body += text(x + size / 2, y + 17, "?", 13);
      else if (visible(r, c)) body += text(x + size / 2, y + 17, r * c, 12);
    });
  });
  return {
    svg: svgDocument((rows.length + 1) * h + 10, body),
    alt: t(
      `A multiplication table with rows ${rows.join(", ")} and columns ${columns.join(", ")}.`,
      `一张乘法表，行是 ${rows.join("、")}，列是 ${columns.join("、")}。`,
    ),
  };
}

/** areaModelFigure draws a rectangle of the given height cut into columns of the given widths, with the side lengths outside and `inside` written in the parts. */
export function areaModelFigure(height: number, widths: readonly number[], inside: readonly string[]): Figure {
  const total = widths.reduce((sum, w) => sum + w, 0);
  const scale = 250 / total;
  const h = Math.min(100, 30 + height * 8);
  let x = 50;
  let body = text(36, 26 + h / 2 + 4, height, 14);
  widths.forEach((w, i) => {
    const width = w * scale;
    body += `<rect x="${x.toFixed(1)}" y="26" width="${width.toFixed(1)}" height="${h}" ${accent} fill-opacity="${i % 2 ? 0.28 : 0.12}"/><rect x="${x.toFixed(1)}" y="26" width="${width.toFixed(1)}" height="${h}"/>`;
    body += text(x + width / 2, 18, w, 14);
    if (inside[i]) body += text(x + width / 2, 26 + h / 2 + 5, inside[i] as string, 14);
    x += width;
  });
  return {
    svg: svgDocument(h + 34, body),
    alt: t(
      `A rectangle ${height} tall, cut into columns ${widths.join(" and ")} wide.`,
      `一个高 ${height} 的长方形，被分成宽 ${widths.join(" 和 ")} 的几列。`,
    ),
  };
}

/** beakerFigure draws a measuring cup marked every `step` up to `max`, filled up to `level`, with every mark or only every other mark numbered. */
export function beakerFigure(level: number, max: number, step: number, unit: string, numberEvery = 1): Figure {
  const y = (v: number) => 150 - (v / max) * 136;
  let body = `<rect x="110" y="${y(level).toFixed(1)}" width="90" height="${(150 - y(level)).toFixed(1)}" ${accent} fill-opacity="0.3"/><path d="M 110 8 L 110 150 L 200 150 L 200 8"/>`;
  const ticks = Math.round(max / step);
  for (let i = 0; i <= ticks; i++) {
    const v = i * step;
    body += `<line x1="200" y1="${y(v).toFixed(1)}" x2="${i % numberEvery === 0 ? 186 : 192}" y2="${y(v).toFixed(1)}"/>`;
    if (i % numberEvery === 0) body += text(218, y(v) + 4, v, 12);
  }
  body += text(250, 16, unit, 13);
  return {
    svg: svgDocument(158, body),
    alt: t(`A measuring cup marked from 0 to ${max} ${unit}, with liquid in it.`, `一个量杯，刻度从 0 到 ${max} ${unit}，里面有液体。`),
  };
}

/** dialScaleFigure draws a weighing scale whose dial runs from 0 to `max`, marked every `step`, with the needle at `value`. */
export function dialScaleFigure(value: number, max: number, step: number, unit: string, numberEvery = 1): Figure {
  const cx = 160;
  const cy = 112;
  const r = 96;
  const point = (v: number, radius: number) => {
    const a = Math.PI * (1 - v / max);
    return [cx + radius * Math.cos(a), cy - radius * Math.sin(a)] as const;
  };
  const [sx, sy] = point(0, r);
  const [ex, ey] = point(max, r);
  let body = `<path d="M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${r} ${r} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)}"/><line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}"/>`;
  const ticks = Math.round(max / step);
  for (let i = 0; i <= ticks; i++) {
    const v = i * step;
    const numbered = i % numberEvery === 0;
    const [ax, ay] = point(v, r);
    const [bx, by] = point(v, numbered ? r - 10 : r - 6);
    body += `<line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}"/>`;
    if (numbered) {
      const [tx, ty] = point(v, r - 22);
      body += text(tx, ty + (i === 0 || i === ticks ? -6 : 4), v, 11);
    }
  }
  const [nx, ny] = point(value, r - 30);
  body += `<g class="accent" stroke-width="2.5"><line x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}"/></g><circle cx="${cx}" cy="${cy}" r="4" ${accent}/>`;
  body += text(cx, cy + 20, unit, 13);
  return {
    svg: svgDocument(138, body),
    alt: t(`A scale with a dial from 0 to ${max} ${unit} and a needle.`, `一台秤，表盘从 0 到 ${max} ${unit}，上面有一根指针。`),
  };
}

/** inchRulerFigure draws a bar above a ruler `inches` long, marked in halves or fourths of an inch, with the bar `fourths` fourths of an inch long from the zero mark. */
export function inchRulerFigure(fourths: number, inches: number, ticksPerInch: 2 | 4): Figure {
  const size = 280 / inches;
  const x = (v: number) => 20 + v * size;
  let body = `<rect x="20" y="8" width="${((fourths / 4) * size).toFixed(1)}" height="16" ${accent} fill-opacity="0.35"/><rect x="20" y="8" width="${((fourths / 4) * size).toFixed(1)}" height="16"/>`;
  body += `<rect x="12" y="30" width="${(inches * size + 16).toFixed(1)}" height="38"/>`;
  for (let i = 0; i <= inches * ticksPerInch; i++) {
    const v = i / ticksPerInch;
    const long = i % ticksPerInch === 0;
    const half = !long && i % (ticksPerInch / 2) === 0;
    body += `<line x1="${x(v).toFixed(1)}" y1="30" x2="${x(v).toFixed(1)}" y2="${long ? 44 : half ? 40 : 36}"/>`;
    if (long) body += text(x(v), 60, v, 12);
  }
  body += text(290, 22, "in", 12);
  return {
    svg: svgDocument(76, body),
    alt: t(`A bar above an inch ruler marked in parts of an inch.`, `一把英寸尺上方有一个长条，尺子上有英寸的分格。`),
  };
}

/** fractionTick draws a stacked fraction with its top at y. */
const fractionTick = (x: number, y: number, n: number, d: number) =>
  `${text(x, y + 9, n, 11)}<line x1="${x - 6}" y1="${y + 12}" x2="${x + 6}" y2="${y + 12}"/>${text(x, y + 23, d, 11)}`;

/** fractionLineRow draws one number line in fractions at height y. */
function fractionLineRow(wholes: number, d: number, y: number, mark: number | undefined, labelTicks: boolean, askMark: boolean): string {
  const x = (i: number) => 22 + (i / (wholes * d)) * 276;
  let body = `<line x1="10" y1="${y}" x2="310" y2="${y}"/>`;
  for (let i = 0; i <= wholes * d; i++) {
    const isWhole = i % d === 0;
    body += `<line x1="${x(i).toFixed(1)}" y1="${y - (isWhole ? 8 : 5)}" x2="${x(i).toFixed(1)}" y2="${y + (isWhole ? 8 : 5)}"/>`;
    if (isWhole) body += text(x(i), y + 22, i / d, 13);
    else if (labelTicks) body += fractionTick(x(i), y + 10, i, d);
  }
  if (mark !== undefined) {
    body += `<circle cx="${x(mark).toFixed(1)}" cy="${y}" r="5" ${accent}/>`;
    if (askMark) body += text(x(mark), y - 12, "?", 13);
  }
  return body;
}

/** fractionLineFigure draws a number line from 0 to `wholes`, with `d` spaces in each whole and a point at `mark` spaces from zero. */
export function fractionLineFigure(wholes: number, d: number, mark?: number, labelTicks = false): Figure {
  return {
    svg: svgDocument(labelTicks ? 60 : 56, fractionLineRow(wholes, d, 22, mark, labelTicks, false)),
    alt: t(
      `A number line from 0 to ${wholes}, with ${d} equal spaces in each whole${mark === undefined ? "" : `, and a point ${mark} spaces from 0`}.`,
      `一条从 0 到 ${wholes} 的数轴，每个整数之间平均分成 ${d} 格${mark === undefined ? "" : `，离 0 ${mark} 格的地方有一个点`}。`,
    ),
  };
}

/** twoFractionLinesFigure draws two number lines from 0 to 1 cut into d1 and d2 spaces, with a point on each when given. */
export function twoFractionLinesFigure(d1: number, mark1: number | undefined, d2: number, mark2: number | undefined): Figure {
  return {
    svg: svgDocument(100, fractionLineRow(1, d1, 18, mark1, false, false) + fractionLineRow(1, d2, 64, mark2, false, false)),
    alt: t(
      `Two number lines from 0 to 1, one cut into ${d1} equal spaces and one cut into ${d2} equal spaces, with points marked.`,
      `两条从 0 到 1 的数轴，一条平均分成 ${d1} 格，另一条平均分成 ${d2} 格，上面都标了点。`,
    ),
  };
}

/** halfPictureGraphFigure draws a picture graph whose rows hold whole dots and, for a value ending in .5, a half dot; values are in dots. */
export function halfPictureGraphFigure(labels: readonly string[], dots: readonly number[]): Figure {
  let body = "";
  dots.forEach((value, row) => {
    const y = 18 + row * 28;
    body += text(16, y + 4, labels[row] as string, 13);
    for (let i = 0; i < Math.floor(value); i++) body += `<circle cx="${44 + i * 24}" cy="${y}" r="9" ${accent}/>`;
    if (value % 1) {
      const x = 44 + Math.floor(value) * 24;
      body += `<path d="M ${x} ${y - 9} A 9 9 0 0 0 ${x} ${y + 9} Z" ${accent}/>`;
    }
  });
  return {
    svg: svgDocument(dots.length * 28 + 10, body),
    alt: t(
      `A picture graph with rows ${labels.join(", ")}, some ending in half a dot.`,
      `象形统计图，各行是 ${labels.join("、")}，有的行最后是半个点。`,
    ),
  };
}

/** fourthsLabel writes a number of fourths as a whole number and a fraction character. */
export const fourthsLabel = (fourths: number): string => {
  const w = Math.floor(fourths / 4);
  const part = ["", "¼", "½", "¾"][fourths % 4] as string;
  return `${w === 0 && part ? "" : w}${part}`;
};

/** fractionLinePlotFigure draws a line plot of lengths given in fourths, with a tick every `step` fourths from `lo` to `hi`. */
export function fractionLinePlotFigure(values: readonly number[], lo: number, hi: number, step: number): Figure {
  const x = (v: number) => 24 + ((v - lo) / (hi - lo)) * 272;
  const tallest = Math.max(...[...new Set(values)].map((v) => values.filter((w) => w === v).length));
  const base = 14 + tallest * 16;
  let body = `<line x1="10" y1="${base}" x2="310" y2="${base}"/>`;
  for (let v = lo; v <= hi; v += step) {
    body += `<line x1="${x(v).toFixed(1)}" y1="${base - 5}" x2="${x(v).toFixed(1)}" y2="${base + 5}"/>${text(x(v), base + 22, fourthsLabel(v), 13)}`;
    const n = values.filter((w) => w === v).length;
    for (let i = 0; i < n; i++) body += `<circle cx="${x(v).toFixed(1)}" cy="${base - 14 - i * 16}" r="5.5" ${accent}/>`;
  }
  return {
    svg: svgDocument(base + 30, body),
    alt: t(
      `A line plot of ${values.length} measurements, in halves or fourths of an inch.`,
      `一张线图，有 ${values.length} 个测量结果，单位是英寸的二分之几或四分之几。`,
    ),
  };
}

/** LSides holds the labels of an L shape's sides, going around from the bottom. */
export interface LSides {
  readonly bottom?: string;
  readonly right?: string;
  readonly notchBottom?: string;
  readonly notchSide?: string;
  readonly top?: string;
  readonly left?: string;
}

/** lShapeFigure draws a w by h rectangle with a corner of cw by ch cut from its top right, optionally over a grid of unit squares or with a dashed line that splits it. */
export function lShapeFigure(
  w: number,
  h: number,
  cw: number,
  ch: number,
  sides: LSides,
  options: { grid?: boolean; split?: boolean } = {},
): Figure {
  const u = Math.min(190 / w, 110 / h);
  const left = 160 - (w * u) / 2;
  const top = 24;
  const X = (v: number) => left + v * u;
  const Y = (v: number) => top + (h - v) * u;
  const path = `${X(0)},${Y(0)} ${X(w)},${Y(0)} ${X(w)},${Y(h - ch)} ${X(w - cw)},${Y(h - ch)} ${X(w - cw)},${Y(h)} ${X(0)},${Y(h)}`;
  let body = `<polygon points="${path}" ${accent} fill-opacity="0.15"/>`;
  if (options.grid) {
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if (c >= w - cw && r >= h - ch) continue;
        body += `<rect x="${X(c)}" y="${Y(r + 1)}" width="${u}" height="${u}" stroke-width="0.75"/>`;
      }
    }
  }
  body += `<polygon points="${path}"/>`;
  if (options.split) body += `<line x1="${X(w - cw)}" y1="${Y(h - ch)}" x2="${X(w - cw)}" y2="${Y(0)}" stroke-dasharray="4 3"/>`;
  if (sides.bottom) body += text(X(w / 2), Y(0) + 16, sides.bottom, 12);
  if (sides.right) body += text(X(w) + 22, Y((h - ch) / 2) + 4, sides.right, 12);
  if (sides.notchBottom) body += text(X(w - cw / 2), Y(h - ch) - 6, sides.notchBottom, 12);
  if (sides.notchSide) body += text(X(w - cw) + 22, Y(h - ch / 2) + 4, sides.notchSide, 12);
  if (sides.top) body += text(X((w - cw) / 2), Y(h) - 6, sides.top, 12);
  if (sides.left) body += text(X(0) - 22, Y(h / 2) + 4, sides.left, 12);
  return {
    svg: svgDocument(h * u + 46, body),
    alt: t("An L-shaped figure made of rectangles, with some sides labeled.", "一个由长方形组成的 L 形，有些边标了长度。"),
  };
}

/** many writes a count before a word, adding an s unless the count is 1. */
export const many = (count: number, word: string): string => `${count} ${word}${count === 1 ? "" : "s"}`;
