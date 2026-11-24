// Writing helpers and figures for the topics of grades 4 and 5: answers that are
// whole numbers, fractions or decimals with a reason for each typical mistake,
// place-value charts, bar models, number lines with any labels, area models and
// fraction strips.

import type { Figure, KnowledgePointDef, Problem, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, Q, svgDocument } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";
import { type Pair, type Walk, walkThrough } from "./early-grades-more-kit.ts";

const accent = `class="accent" fill="currentColor"`;
const ink = `stroke="none" fill="currentColor"`;

/** write draws a label centered on x, with its baseline at y. */
const write = (x: number, y: number, s: string | number, size = 13, extra = "") =>
  `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" ${ink} font-size="${size}"${extra}>${s}</text>`;

/** grouped writes a whole number with commas between groups of three digits: 12,345. */
export const grouped = (n: number): string => Math.round(n).toLocaleString("en-US");

/** groupedTex writes a whole number for LaTeX with commas between groups of three digits: 12{,}345. */
export const groupedTex = (n: number): string => grouped(n).replace(/,/g, "{,}");

/** Miss is a wrong answer with the reason a learner reaches it, in English and Chinese. */
export type Miss = readonly [value: Coefficient, en: string, zh: string];

/** AnswerOptions are what an answer may add: the form it must take, a unit after the field, and a figure. */
export interface AnswerOptions {
  readonly form?: "number" | "integer" | "fraction" | "decimal" | "mixed";
  readonly unit?: string;
  readonly figure?: Figure;
}

/** answered asks for one number, works it in labelled steps with a check, and answers each distinct wrong value with its reason; negative values are dropped. */
export function answered(
  prompt: Pair,
  answer: Coefficient,
  walk: readonly Walk[],
  check: Pair,
  misses: readonly Miss[],
  options: AnswerOptions = {},
): Problem {
  const q = (c: Coefficient) => (c instanceof Q ? c : Q.of(c));
  const right = q(answer);
  const kept = misses.filter(([v], i) => q(v).sign() >= 0 && !q(v).eq(right) && misses.findIndex(([w]) => q(w).eq(q(v))) === i);
  const problem = numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    form: options.form ?? (right.isInteger() ? "integer" : "number"),
    ...(options.unit && { unit: options.unit }),
    mistakes: kept.map(([value, en, zh]) => ({ value, why: t(en, zh) })),
    solution: walkThrough(walk, check),
  });
  return options.figure ? { ...problem, figure: options.figure } : problem;
}

/** placeChartFigure draws a place-value chart: the place values head the columns and each row writes its digits under them, with the column at `lit` shaded. */
export function placeChartFigure(places: readonly number[], rows: readonly (readonly string[])[], lit = -1): Figure {
  const w = 280 / places.length;
  const size = places.length > 6 ? 10 : places.length > 4 ? 11 : 13;
  let body = "";
  places.forEach((p, i) => {
    const x = 20 + i * w;
    if (i === lit)
      body += `<rect x="${x.toFixed(1)}" y="4" width="${w.toFixed(1)}" height="${28 + 26 * rows.length}" ${accent} fill-opacity="0.2" stroke="none"/>`;
    body += `<rect x="${x.toFixed(1)}" y="4" width="${w.toFixed(1)}" height="24"/>${write(x + w / 2, 21, grouped(p), size)}`;
    rows.forEach((row, r) => {
      body += `<rect x="${x.toFixed(1)}" y="${28 + 26 * r}" width="${w.toFixed(1)}" height="26"/>${write(x + w / 2, 46 + 26 * r, row[i] ?? "", 15)}`;
    });
  });
  return {
    svg: svgDocument(36 + 26 * rows.length, body),
    alt: t(
      `A place-value chart with columns for ${places.map(grouped).join(", ")}${lit >= 0 ? `; the ${grouped(places[lit] ?? 1)} column is shaded` : ""}.`,
      `一张数位表，各列分别是 ${places.map(grouped).join("、")}${lit >= 0 ? `；${grouped(places[lit] ?? 1)} 这一列涂了颜色` : ""}。`,
    ),
  };
}

/** placesOf gives the place values from the highest place of a number with the given count of digits down to the ones. */
export const placesOf = (digits: number): number[] => Array.from({ length: digits }, (_, i) => 10 ** (digits - 1 - i));

/** digitsChart draws the place-value chart of one or more whole numbers, with the place at `lit` (counted from the left) shaded. */
export function digitsChart(numbers: readonly number[], lit = -1): Figure {
  const digits = Math.max(...numbers.map((n) => String(n).length));
  return placeChartFigure(
    placesOf(digits),
    numbers.map((n) =>
      String(n)
        .padStart(digits, " ")
        .split("")
        .map((c) => c.trim()),
    ),
    lit,
  );
}

/** Piece is one piece of a bar: its size, the text written in it, and whether it is shaded or dashed. */
export interface Piece {
  readonly size: number;
  readonly text: string;
  readonly lit?: boolean;
  readonly dashed?: boolean;
}

/** Tape is one bar of a bar model: its pieces from the left, and an optional text over a brace above the whole bar. */
export interface Tape {
  readonly pieces: readonly Piece[];
  readonly total?: string;
}

/** tapeFigure draws a bar model: bars from a common left end, each cut into pieces, all on one scale. */
export function tapeFigure(tapes: readonly Tape[], alt: Pair): Figure {
  const longest = Math.max(...tapes.map((tape) => tape.pieces.reduce((s, p) => s + p.size, 0)));
  const scale = 270 / longest;
  let y = 6;
  let body = "";
  for (const tape of tapes) {
    const length = tape.pieces.reduce((s, p) => s + p.size, 0) * scale;
    if (tape.total !== undefined) {
      body += `<path d="M 25 ${y + 14} L 25 ${y + 8} L ${(25 + length).toFixed(1)} ${y + 8} L ${(25 + length).toFixed(1)} ${y + 14}"/>`;
      body += write(25 + length / 2, y + 4, tape.total, 13);
      y += 18;
    }
    let x = 25;
    for (const p of tape.pieces) {
      const w = p.size * scale;
      body += `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="28"${p.lit ? ` ${accent} fill-opacity="0.25"` : ""}${p.dashed ? ` stroke-dasharray="4 3"` : ""}/>`;
      body += write(x + w / 2, y + 19, p.text, w < 26 ? 10 : 13);
      x += w;
    }
    y += 36;
  }
  return { svg: svgDocument(y + 2, body), alt: t(alt[0], alt[1]) };
}

/** equalTape draws one bar cut into `count` equal pieces that each hold `each`, with `total` over a brace; `lit` pieces from the left are shaded. */
export function equalTape(count: number, each: string, total: string, lit = 0): Figure {
  return tapeFigure(
    [{ total, pieces: Array.from({ length: count }, (_, i) => ({ size: 1, text: each, lit: i < lit })) }],
    [
      `A bar cut into ${count} equal parts, each marked ${each}, with ${total} over the whole bar.`,
      `一个长条平均分成 ${count} 份，每份标着 ${each}，整个长条上方标着 ${total}。`,
    ],
  );
}

/** Mark is a point on a number line, with an optional text above it; `result` draws it in the color of an answer. */
export interface Mark {
  readonly at: number;
  readonly text?: string;
  readonly result?: boolean;
}

/** Line describes a number line: its ends, the tick spacing, which ticks carry text, the points and the jumps between values. */
export interface Line {
  readonly lo: number;
  readonly hi: number;
  readonly step: number;
  readonly labels?: readonly number[];
  readonly label?: (v: number) => string;
  readonly marks?: readonly Mark[];
  readonly jumps?: readonly (readonly [number, number])[];
}

/** lineFigure draws a number line with ticks every step, text under the chosen ticks (both ends by default), points with text above, and jumps drawn as arcs. */
export function lineFigure(line: Line, alt: Pair): Figure {
  const x = (v: number) => 20 + ((v - line.lo) / (line.hi - line.lo)) * 280;
  const y = 44;
  const name = line.label ?? grouped;
  let body = `<line x1="12" y1="${y}" x2="308" y2="${y}"/>`;
  const ticks = Math.round((line.hi - line.lo) / line.step);
  for (let i = 0; i <= ticks; i++) {
    const v = line.lo + i * line.step;
    body += `<line x1="${x(v).toFixed(1)}" y1="${y - 6}" x2="${x(v).toFixed(1)}" y2="${y + 6}"/>`;
  }
  for (const v of line.labels ?? [line.lo, line.hi]) body += write(x(v), y + 22, name(v), ticks > 12 ? 11 : 12);
  for (const [from, to] of line.jumps ?? []) {
    const [a, b] = [x(from), x(to)];
    const s = b >= a ? 1 : -1;
    body += `<path class="action" d="M${a.toFixed(1)} ${y - 6}Q${((a + b) / 2).toFixed(1)} ${y - 30} ${b.toFixed(1)} ${y - 6}M${(b - s * 6).toFixed(1)} ${y - 10}L${b.toFixed(1)} ${y - 6}L${(b - s).toFixed(1)} ${y - 13}"/>`;
  }
  for (const m of line.marks ?? []) {
    body += `<circle cx="${x(m.at).toFixed(1)}" cy="${y}" r="5" class="${m.result ? "result" : "accent"}" fill="currentColor"/>`;
    if (m.text) body += write(x(m.at), y - 12, m.text, 12);
  }
  return { svg: svgDocument(y + 30, body), alt: t(alt[0], alt[1]) };
}

/** areaGridFigure draws an area model: a rectangle cut into rows and columns sized by `rowSizes` and `columnSizes`, the side parts written outside and `inside` written in each cell, row by row. */
export function areaGridFigure(
  rows: readonly string[],
  columns: readonly string[],
  inside: readonly (readonly string[])[],
  rowSizes: readonly number[] = rows.map(() => 1),
  columnSizes: readonly number[] = columns.map(() => 1),
): Figure {
  const across = columnSizes.reduce((s, v) => s + v, 0);
  const down = rowSizes.reduce((s, v) => s + v, 0);
  const width = 240 / across;
  const height = Math.min(110, 34 * rows.length) / down;
  let body = "";
  let y = 26;
  rows.forEach((r, i) => {
    const h = (rowSizes[i] ?? 1) * height;
    body += write(36, y + h / 2 + 5, r, 13);
    let x = 60;
    columns.forEach((c, j) => {
      const w = (columnSizes[j] ?? 1) * width;
      if (i === 0) body += write(x + w / 2, 18, c, 13);
      body += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" ${accent} fill-opacity="${(i + j) % 2 ? 0.28 : 0.12}"/><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"/>`;
      body += write(x + w / 2, y + h / 2 + 5, inside[i]?.[j] ?? "", w < 50 ? 11 : 13);
      x += w;
    });
    y += h;
  });
  return {
    svg: svgDocument(y + 8, body),
    alt: t(
      `An area model with sides cut into ${rows.join(" and ")} and ${columns.join(" and ")}, with the area of each part written inside.`,
      `一个面积模型，一边分成 ${rows.join(" 和 ")}，另一边分成 ${columns.join(" 和 ")}，每一块里写着它的面积。`,
    ),
  };
}

/** Strip is one fraction strip: a bar from 0 to 1 cut into `parts` equal parts with `shaded` of them shaded, and a text at its left. */
export interface Strip {
  readonly parts: number;
  readonly shaded: number;
  readonly text?: string;
}

/** stripsFigure draws fraction strips of the same whole, one above another, so that equal lengths line up. */
export function stripsFigure(strips: readonly Strip[]): Figure {
  let body = "";
  strips.forEach((s, r) => {
    const y = 6 + r * 34;
    const w = 240 / s.parts;
    if (s.text) body += write(32, y + 19, s.text, 13);
    for (let i = 0; i < s.parts; i++) {
      body += `<rect x="${(60 + i * w).toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="28"${i < s.shaded ? ` ${accent} fill-opacity="0.3"` : ""}/>`;
    }
  });
  return {
    svg: svgDocument(6 + strips.length * 34, body),
    alt: t(
      `Fraction strips of the same length: ${strips.map((s) => `${s.shaded} of ${s.parts} equal parts shaded`).join("; ")}.`,
      `长度相同的分数条：${strips.map((s) => `平均分成 ${s.parts} 份，涂了 ${s.shaded} 份`).join("；")}。`,
    ),
  };
}

/** fractionText writes a fraction for a drawing: "3/4", or a whole number when the denominator is 1. */
export const fractionText = (n: number, d: number): string => (d === 1 ? `${n}` : `${n}/${d}`);

/** pieceText writes a text of a drawing, so that callers can build labels from fractions or whole numbers alike. */
export const pieceText = (v: Coefficient): string => {
  const q = v instanceof Q ? v : Q.of(v);
  return q.isInteger() ? grouped(Number(q.n)) : `${q.n}/${q.d}`;
};

/** both builds a Text from a pair, for prompts and texts written outside a walk. */
export const both = (pair: Pair): Text => t(pair[0], pair[1]);

/** point builds a knowledge point from its id, its title and explanation as [English, Chinese] pairs, its generator and its picture. */
export function point(id: string, title: Pair, explanation: Pair, generate: (rng: Rng) => Problem, figure: Figure): KnowledgePointDef {
  return { id, title: t(title[0], title[1]), explanation: t(explanation[0], explanation[1]), generate, figure };
}
