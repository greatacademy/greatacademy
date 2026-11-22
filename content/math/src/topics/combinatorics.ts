import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { joinText, t } from "@ga/content";
import { dec, Q, svgDocument } from "@ga/subject-math";

import { choiceProblem, expressionProblem, numberProblem, steps, verdictChoice, why, yesNo } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";

// Conditional probability (Geometry 6.18) and combinatorics (Geometry 6.19).

/** fr writes a fraction n/d as it is, without simplifying it. */
const fr = (n: number, d: number) => `\\frac{${n}}{${d}}`;

/** ratioL writes n/d and, when it simplifies, "= " its simplest form. */
function ratioL(n: number, d: number): string {
  const v = Q.of(n, d).toLatex();
  return v === fr(n, d) ? v : `${fr(n, d)} = ${v}`;
}

/** h writes a number of hundredths as a decimal: h(35) is "0.35". */
const h = (x: number) => dec(Q.of(x, 100));

/** simplest asks for a fraction in simplest form. */
const simplest = t(" Give the answer as a fraction in simplest form.", "答案写成最简分数。");

/** asDecimal asks for a decimal. */
const asDecimal = t(" Give the answer as a decimal.", "答案写成小数。");

/** para joins the paragraphs of an explanation or a solution. */
const para = (...parts: readonly Text[]): Text => joinText(parts);

/** step writes one labelled step of a solution: its bold label, then what it does and why. */
function step(i: number, en: string, zh: string, body: Text): Text {
  const label = stepLabel(i, en, zh);
  return t(`${label.en} ${body.en}`, `${label["zh-CN"]}${body["zh-CN"]}`);
}

/** check writes the closing check of a solution. */
const check = (body: Text): Text => t(`**Check.** ${body.en}`, `**检验。** ${body["zh-CN"]}`);

/** same writes a text that reads the same in both locales, such as a formula or the line of a figure. */
const same = (s: string): Text => t(s, s);

/** figureLine places figure i of a solution on a line of its own. */
const figureLine = (i: number): Text => same(`{{figure ${i}}}`);

/** big writes a whole number with thin spaces between groups of three digits once it has five digits: "362\,880". */
const big = (n: number) => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\\,") : String(n));

/** approx writes a probability as a decimal to three places, with "=" when that is exact and "≈" when it is rounded. */
function approx(v: Q): string {
  const x = v.toNumber();
  const s = x.toFixed(3);
  return Math.abs(Number(s) - x) < 1e-12 ? `= ${Number(s)}` : `\\approx ${s}`;
}

/** r1 rounds a coordinate of a drawing to one decimal place. */
const r1 = (x: number) => Math.round(x * 10) / 10;

/** Tone is how a part of a drawing is colored: the subject, what is done to it, or what comes out of it. */
type Tone = "accent" | "action" | "result";

/** svgText writes a filled text element centered at (x, y), in a tone when one is given. */
const svgText = (x: number, y: number, s: string, italic = false, tone?: Tone) =>
  `<text${tone ? ` class="${tone}"` : ""} x="${r1(x)}" y="${r1(y)}" stroke="none" fill="currentColor"${italic ? ' font-style="italic"' : ""}>${s}</text>`;

/** shadePath fills a path in a tone, lightly for a condition and more strongly for what is counted inside it. */
const shadePath = (d: string, tone: Tone, opacity: number) =>
  `<path class="${tone}" d="${d}" fill="currentColor" fill-opacity="${opacity}" fill-rule="evenodd" stroke="none"/>`;

// ---------------------------------------------------------------------------
// Venn diagrams

/**
 * vennRegions are the outlines of the regions A only, both, B only and neither of the Venn diagram drawn by venn: circles of
 * radius 62 around (125, 88) and (195, 88), which cross at (160, 36.82) and (160, 139.18), in the rectangle (10, 10)–(310, 160).
 */
const vennRegions = [
  "M160 36.82 A62 62 0 1 0 160 139.18 A62 62 0 0 1 160 36.82 Z",
  "M160 36.82 A62 62 0 0 1 160 139.18 A62 62 0 0 1 160 36.82 Z",
  "M160 36.82 A62 62 0 1 1 160 139.18 A62 62 0 0 0 160 36.82 Z",
  "M10 10 H310 V160 H10 Z M160 36.82 A62 62 0 1 0 160 139.18 A62 62 0 1 0 160 36.82 Z",
] as const;

/** VennShade marks a Venn diagram: the regions of the condition, shaded, and the regions counted inside it, shaded darker. */
interface VennShade {
  readonly cond: (r: number) => boolean;
  readonly joint?: (r: number) => boolean;
  /** alt says in words what is shaded. */
  readonly alt: Text;
}

/** venn draws two overlapping circles named a and b in a rectangle, with the values of A only, both, B only and neither. */
function venn(a: string, b: string, values: readonly [string, string, string, string], shade?: VennShade): string {
  let shades = "";
  if (shade) {
    for (let r = 0; r < 4; r++) if (shade.cond(r)) shades += shadePath(vennRegions[r]!, "accent", 0.18);
    for (let r = 0; r < 4; r++) if (shade.joint?.(r)) shades += shadePath(vennRegions[r]!, "result", 0.35);
  }
  return svgDocument(
    170,
    shades +
      `<rect x="10" y="10" width="300" height="150"/>` +
      `<g${shade ? "" : ' class="accent"'}><circle cx="125" cy="88" r="62"/><circle cx="195" cy="88" r="62"/></g>` +
      svgText(52, 34, a, true) +
      svgText(268, 34, b, true) +
      svgText(94, 92, values[0]) +
      svgText(160, 92, values[1]) +
      svgText(226, 92, values[2]) +
      svgText(282, 150, values[3]),
  );
}

/** vennAlt describes a Venn diagram for screen readers. */
function vennAlt(a: string, b: string, v: readonly [string, string, string, string]): Text {
  return t(
    `Venn diagram of ${a} and ${b}: ${v[0]} in ${a} only, ${v[1]} in both, ${v[2]} in ${b} only, ${v[3]} in neither.`,
    `${a} 与 ${b} 的维恩图：只在 ${a} 中 ${v[0]}，两者都在 ${v[1]}，只在 ${b} 中 ${v[2]}，都不在 ${v[3]}。`,
  );
}

/** vennFigure draws a Venn diagram with its description, and what is shaded in it. */
function vennFigure(a: string, b: string, v: readonly [string, string, string, string], shade?: VennShade): Figure {
  const alt = vennAlt(a, b, v);
  return {
    svg: venn(a, b, v, shade),
    alt: shade ? t(`${alt.en} ${shade.alt.en}`, `${alt["zh-CN"]}${shade.alt["zh-CN"]}`) : alt,
  };
}

// ---------------------------------------------------------------------------
// Tree diagrams

/** Branch is one branch of a tree diagram: the outcome at its end and its probability. */
interface Branch {
  readonly label: string;
  readonly p: string;
}

/** Path is a path from the start of a tree diagram: the branch taken at each stage, 0 for the upper and 1 for the lower. */
type Path = readonly number[];

/** TreeMarks mark a tree diagram: the tone of the branch into each point, and a text after the end of each path. */
interface TreeMarks {
  readonly tone?: (path: Path) => Tone | undefined;
  readonly leaf?: (path: Path) => string;
}

/** treeSvg draws a tree diagram of depth stages, two branches from every point, from left to right. */
function treeSvg(depth: number, branch: (path: Path) => Branch, marks: TreeMarks = {}): string {
  const gap = depth === 2 ? 52 : 26;
  const top = 16;
  const end = marks.leaf ? 228 : 278;
  const xs = Array.from({ length: depth + 1 }, (_, k) => 14 + ((end - 14) * k) / depth);
  const yOf = (path: Path): number =>
    path.length === depth ? top + gap * path.reduce((s, b) => 2 * s + b, 0) : (yOf([...path, 0]) + yOf([...path, 1])) / 2;
  let body = `<circle cx="${xs[0]}" cy="${r1(yOf([]))}" r="2.5" fill="currentColor" stroke="none"/>`;
  const walk = (path: Path) => {
    const k = path.length;
    if (k === depth) {
      const text = marks.leaf?.(path);
      if (text) body += svgText(end + 42, yOf(path) + 4, text, false, marks.tone?.(path));
      return;
    }
    for (const c of [0, 1]) {
      const child = [...path, c];
      const b = branch(child);
      const tone = marks.tone ? marks.tone(child) : "accent";
      const [x1, y1, x2, y2] = [xs[k]! + (k === 0 ? 4 : 11), yOf(path), xs[k + 1]! - 11, yOf(child)];
      const width = tone && tone !== "accent" ? ' stroke-width="2.5"' : "";
      body += `<line${tone ? ` class="${tone}"` : ""}${width} x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}"/>`;
      body += svgText(xs[k + 1]!, y2 + 4, b.label, true);
      if (b.p) body += svgText((x1 + x2) / 2, (y1 + y2) / 2 + (c === 0 ? -7 : 15), b.p);
      walk(child);
    }
  };
  walk([]);
  return svgDocument(2 * top + gap * (2 ** depth - 1), body);
}

/** Stages are the branches of a two-stage tree: the two first branches, and the two second branches after each. */
interface Stages {
  readonly first: readonly [Branch, Branch];
  readonly second: readonly [readonly [Branch, Branch], readonly [Branch, Branch]];
}

/** stageBranch reads the branch at the end of a path of one or two steps of a two-stage tree. */
const stageBranch =
  (s: Stages) =>
  (path: Path): Branch =>
    path.length === 1 ? s.first[path[0]!]! : s.second[path[0]!]![path[1]!]!;

/** treeAlt describes a two-stage tree diagram for screen readers. */
function treeAlt({ first, second }: Stages): Text {
  const en = (b: Branch) => (b.p ? `${b.label} (${b.p})` : b.label);
  const zh = (b: Branch) => (b.p ? `${b.label}（${b.p}）` : b.label);
  const part = (i: 0 | 1) => `${en(first[i])}, then ${en(second[i][0])} or ${en(second[i][1])}`;
  const partZh = (i: 0 | 1) => `${zh(first[i])}，之后 ${zh(second[i][0])}或 ${zh(second[i][1])}`;
  return t(`Tree diagram: ${part(0)}; ${part(1)}.`, `树状图：${partZh(0)}；${partZh(1)}。`);
}

/** treeFigure builds a two-stage tree diagram figure, with its marks and a note on them for screen readers. */
function treeFigure(
  first: readonly [Branch, Branch],
  second: readonly [readonly [Branch, Branch], readonly [Branch, Branch]],
  marks?: TreeMarks,
  note?: Text,
): Figure {
  const alt = treeAlt({ first, second });
  return {
    svg: treeSvg(2, stageBranch({ first, second }), marks),
    alt: note ? t(`${alt.en} ${note.en}`, `${alt["zh-CN"]}${note["zh-CN"]}`) : alt,
  };
}

/** onPaths colors the branches along the given paths in a tone. */
const onPaths =
  (paths: readonly Path[], tone: Tone = "result") =>
  (path: Path): Tone | undefined =>
    paths.some((p) => path.every((b, i) => p[i] === b)) ? tone : undefined;

/** either colors a branch by the first of several colorings that colors it. */
const either =
  (...tones: readonly ((path: Path) => Tone | undefined)[]) =>
  (path: Path): Tone | undefined => {
    for (const f of tones) {
      const tone = f(path);
      if (tone) return tone;
    }
    return undefined;
  };

/** samePath tells whether two paths are the same. */
const samePath = (a: Path, b: Path) => a.length === b.length && a.every((x, i) => x === b[i]);

// ---------------------------------------------------------------------------
// Tables, places in a row and lists

/** TableMarks mark a two-way table drawn with its totals: a shaded row or column (2 is the totals) and two cells. */
interface TableMarks {
  readonly row?: number;
  readonly col?: number;
  /** num is the cell counted, the numerator. */
  readonly num?: readonly [number, number];
  /** den is the cell of the whole it is counted in, the denominator. */
  readonly den?: readonly [number, number];
}

/** tableSvg draws the counts of a two-way table with a column and a row of totals, set off by double lines. */
function tableSvg(cells: readonly (readonly number[])[], m: TableMarks): string {
  const xs = [60, 130, 200, 270];
  const ys = [10, 42, 74, 106];
  const sums = cells.map((r) => [r[0]!, r[1]!, r[0]! + r[1]!]);
  sums.push([0, 1, 2].map((c) => sums[0]![c]! + sums[1]![c]!));
  let body = "";
  const cellBox = (r: number, c: number) => ({ x: xs[c]!, y: ys[r]!, w: xs[c + 1]! - xs[c]!, h: ys[r + 1]! - ys[r]! });
  if (m.row !== undefined) {
    const a = cellBox(m.row, 0);
    const b = cellBox(m.row, 2);
    body += `<rect class="accent" x="${a.x}" y="${a.y}" width="${b.x + b.w - a.x}" height="${a.h}" fill="currentColor" fill-opacity="0.18" stroke="none"/>`;
  }
  if (m.col !== undefined) {
    const a = cellBox(0, m.col);
    const b = cellBox(2, m.col);
    body += `<rect class="accent" x="${a.x}" y="${a.y}" width="${a.w}" height="${b.y + b.h - a.y}" fill="currentColor" fill-opacity="0.18" stroke="none"/>`;
  }
  for (const x of xs) body += `<line x1="${x}" y1="${ys[0]}" x2="${x}" y2="${ys[3]}"/>`;
  for (const y of ys) body += `<line x1="${xs[0]}" y1="${y}" x2="${xs[3]}" y2="${y}"/>`;
  body += `<line x1="${xs[2]! - 4}" y1="${ys[0]}" x2="${xs[2]! - 4}" y2="${ys[3]}"/>`;
  body += `<line x1="${xs[0]}" y1="${ys[2]! - 4}" x2="${xs[3]}" y2="${ys[2]! - 4}"/>`;
  const ring = (cell: readonly [number, number] | undefined, tone: Tone) => {
    if (!cell) return;
    const b = cellBox(cell[0], cell[1]);
    body += `<rect class="${tone}" x="${b.x + 4}" y="${b.y + 4}" width="${b.w - 8}" height="${b.h - 8}" rx="4" stroke-width="2.5"/>`;
  };
  ring(m.num, "result");
  ring(m.den, "action");
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) {
      const b = cellBox(r, c);
      body += svgText(b.x + b.w / 2, b.y + b.h / 2 + 4, String(sums[r]![c]!));
    }
  return svgDocument(116, body);
}

/** Slot is one place in a row: what is written in it (a number of choices, or what is put there) and its tone. */
interface Slot {
  readonly text: string;
  readonly tone?: Tone;
}

/** SlotMarks finish a row of places: the signs between them, the total after them, and a bracket over a block of places. */
interface SlotMarks {
  readonly ops?: string | readonly string[];
  readonly total?: string;
  readonly block?: readonly [number, number];
  readonly blockText?: string;
}

/** slotsSvg draws places in a row as boxes, each with the number of ways to fill it or what fills it. */
function slotsSvg(slots: readonly Slot[], m: SlotMarks = {}): string {
  const n = slots.length;
  const unit = Math.min(50, 232 / n);
  const w = unit * 0.74;
  const rowW = n * unit - (unit - w);
  const totalW = m.total ? 16 + 7 * m.total.length : 0;
  const x0 = (320 - rowW - totalW) / 2;
  const y = m.block ? 34 : 14;
  let body = "";
  slots.forEach((s, i) => {
    const x = x0 + i * unit;
    body += `<rect${s.tone ? ` class="${s.tone}"` : ""} x="${r1(x)}" y="${y}" width="${r1(w)}" height="30" rx="3"${s.tone ? ' stroke-width="2"' : ""}/>`;
    if (s.text) body += svgText(x + w / 2, y + 19, s.text, /^[A-Z]+$/.test(s.text), s.tone);
    const op = typeof m.ops === "string" ? m.ops : (m.ops?.[i] ?? "·");
    if (i < n - 1 && op) body += svgText(x + w + (unit - w) / 2, y + 19, op);
  });
  if (m.total) body += svgText(x0 + rowW + totalW / 2 + 4, y + 19, m.total, false, "result");
  if (m.block) {
    const [i, j] = m.block;
    const [a, b] = [x0 + i * unit, x0 + j * unit + w];
    body += `<path class="action" d="M${r1(a)} ${y - 4} V${y - 12} H${r1(b)} V${y - 4}"/>`;
    if (m.blockText) body += svgText((a + b) / 2, y - 17, m.blockText, false, "action");
  }
  return svgDocument(y + 44, body);
}

/** slotsFigure draws a row of places with its description. */
const slotsFigure = (slots: readonly Slot[], marks: SlotMarks, alt: Text): Figure => ({ svg: slotsSvg(slots, marks), alt });

/** Cell is one entry of a list drawn as a grid: its text and its tone. */
interface Cell {
  readonly text: string;
  readonly tone?: Tone;
}

/** gridSvg draws a list of outcomes as a grid of boxes, row by row. */
function gridSvg(rows: readonly (readonly Cell[])[]): string {
  const cols = Math.max(...rows.map((r) => r.length));
  const w = Math.min(46, 300 / cols);
  const x0 = (320 - cols * w) / 2;
  let body = "";
  rows.forEach((row, i) => {
    row.forEach((c, j) => {
      const [x, y] = [x0 + j * w, 8 + i * 30];
      body += `<rect${c.tone ? ` class="${c.tone}" stroke-width="2"` : ""} x="${r1(x + 2)}" y="${y}" width="${r1(w - 4)}" height="24" rx="3"/>`;
      body += svgText(x + w / 2, y + 16, c.text, false, c.tone);
    });
  });
  return svgDocument(16 + rows.length * 30, body);
}

/** fact is n!. */
function fact(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

/** perm is the number of ordered selections of r of n objects. */
function perm(n: number, r: number): number {
  let p = 1;
  for (let i = 0; i < r; i++) p *= n - i;
  return p;
}

/** comb is the number of unordered selections of r of n objects. */
const comb = (n: number, r: number) => perm(n, r) / fact(r);

/** prodL writes the product n(n-1)…(n-r+1): "7 \cdot 6 \cdot 5". */
function prodL(n: number, r: number): string {
  return Array.from({ length: r }, (_, i) => n - i).join(" \\cdot ");
}

/** countSlots are the places of a product n(n − 1)…(n − r + 1), each with its number of choices. */
const countSlots = (n: number, r: number): Slot[] => Array.from({ length: r }, (_, i) => ({ text: String(n - i) }));

/** cap capitalizes the first letter of an English phrase. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------------------------------------------------------------------------
// Conditional probabilities from Venn diagrams

/** Pair is two characteristics of the people in a survey, with the letters of their events. */
interface Pair {
  readonly a: string;
  readonly b: string;
  readonly aDo: Text;
  readonly bDo: Text;
}

const pairs: readonly Pair[] = [
  { a: "S", b: "M", aDo: t("study Spanish", "学西班牙语"), bDo: t("play a musical instrument", "会演奏乐器") },
  { a: "C", b: "D", aDo: t("own a cat", "养猫"), bDo: t("own a dog", "养狗") },
  { a: "T", b: "C", aDo: t("drink tea", "喝茶"), bDo: t("drink coffee", "喝咖啡") },
  { a: "F", b: "B", aDo: t("play football", "踢足球"), bDo: t("play basketball", "打篮球") },
  { a: "W", b: "R", aDo: t("walk to school", "步行上学"), bDo: t("read every day", "每天阅读") },
];

/** Ev is the event A or B (set 0 or 1), or its complement. */
interface Ev {
  readonly set: 0 | 1;
  readonly not: boolean;
}

const inSet = [
  [true, true, false, false],
  [false, true, true, false],
] as const;

/** holds tells whether region r (A only, both, B only, neither) lies in event e. */
const holds = (e: Ev, r: number) => inSet[e.set][r] !== e.not;

/** evL writes an event in LaTeX: "S", "S'". */
const evL = (p: Pair, e: Ev) => (e.set === 0 ? p.a : p.b) + (e.not ? "'" : "");

/** evDo describes the people in an event: "own a cat", "do not own a cat". */
function evDo(p: Pair, e: Ev): Text {
  const d = e.set === 0 ? p.aDo : p.bDo;
  return e.not ? t(`do not ${d.en}`, `不${d["zh-CN"]}`) : d;
}

/** sumOf adds the values of the regions in which pred holds. */
const sumOf = (v: readonly number[], pred: (r: number) => boolean) => v.reduce((s, x, r) => (pred(r) ? s + x : s), 0);

/** Conditional is a conditional probability read from region values. */
interface Conditional {
  readonly joint: number;
  readonly cond: number;
  readonly target: number;
  readonly total: number;
}

/** conditional computes the values needed for P(target | cond). */
function conditional(v: readonly number[], target: Ev, cond: Ev): Conditional {
  return {
    joint: sumOf(v, (r) => holds(target, r) && holds(cond, r)),
    cond: sumOf(v, (r) => holds(cond, r)),
    target: sumOf(v, (r) => holds(target, r)),
    total: sumOf(v, () => true),
  };
}

/** pickEvents draws a target and a condition on different sets, with at least one complement when complements is set. */
function pickEvents(rng: Rng, complements: boolean | undefined): [Ev, Ev] {
  const s = rng.pick([0, 1] as const);
  const o = (1 - s) as 0 | 1;
  if (complements === false)
    return [
      { set: s, not: false },
      { set: o, not: false },
    ];
  if (complements === true) {
    const k = rng.int(0, 2);
    return [
      { set: s, not: k !== 1 },
      { set: o, not: k !== 0 },
    ];
  }
  return [
    { set: s, not: rng.bool(0.3) },
    { set: o, not: rng.bool(0.3) },
  ];
}

/** vennCounts draws counts for the four regions, each at least 1. */
const vennCounts = (rng: Rng): [number, number, number, number] => [rng.int(2, 25), rng.int(1, 18), rng.int(2, 25), rng.int(1, 15)];

/** regionIn names a region of the Venn diagram of a pair, as where people are: "in S only", "in the overlap". */
function regionIn(p: Pair, r: number): Text {
  return [
    t(`in $${p.a}$ only`, `只在 $${p.a}$ 中`),
    t("in the overlap", "在重叠部分"),
    t(`in $${p.b}$ only`, `只在 $${p.b}$ 中`),
    t("outside both circles", "在两圆之外"),
  ][r]!;
}

/** VennRead is what a solution reads off a Venn diagram for P(target | cond). */
interface VennRead {
  /** regions are the regions of the condition, in order. */
  readonly regions: readonly number[];
  /** joint is the region of the condition that lies in the target too; rest is the other one. */
  readonly joint: number;
  readonly rest: number;
}

/** vennRead finds the regions of the condition, the one of them in the target, and the other one. */
function vennRead(target: Ev, cond: Ev): VennRead {
  const regions = [0, 1, 2, 3].filter((r) => holds(cond, r));
  const joint = regions.find((r) => holds(target, r))!;
  return { regions, joint, rest: regions.find((r) => r !== joint)! };
}

/** vennShade shades the condition of P(target | cond) and, darker, the part of it in the target. */
function vennShade(p: Pair, target: Ev, cond: Ev): VennShade {
  const [tL, cL] = [evL(p, target), evL(p, cond)];
  return {
    cond: (r) => holds(cond, r),
    joint: (r) => holds(cond, r) && holds(target, r),
    alt: t(`Shaded: the condition ${cL}; shaded darker: its part in ${tL}.`, `阴影：条件 ${cL}；深色：其中属于 ${tL} 的部分。`),
  };
}

/** vennSolution works P(target | cond) from the region values v, written with show (counts or decimals). */
function vennSolution(p: Pair, v: readonly number[], target: Ev, cond: Ev, show: (x: number) => string, counts: boolean): Text {
  const c = conditional(v, target, cond);
  const read = vennRead(target, cond);
  const [tL, cL] = [evL(p, target), evL(p, cond)];
  const parts = read.regions.map((r) => regionIn(p, r));
  const sum = `${read.regions.map((r) => show(v[r]!)).join(" + ")} = ${show(c.cond)}`;
  const n = counts ? "n" : "P";
  const answer = Q.of(c.joint, c.cond);
  const division = counts
    ? `P(${tL} \\mid ${cL}) = \\frac{n(${tL} \\cap ${cL})}{n(${cL})} = ${ratioL(c.joint, c.cond)}`
    : `P(${tL} \\mid ${cL}) = \\frac{P(${tL} \\cap ${cL})}{P(${cL})} = \\frac{${show(c.joint)}}{${show(c.cond)}} = ${ratioL(c.joint, c.cond)}`;
  const first = step(
    1,
    "shade the condition",
    "圈出条件",
    t(
      `The condition is $${cL}$: the people who ${evDo(p, cond).en}. They are the people ${parts[0]!.en} and those ${parts[1]!.en}, and together they are the new whole:${steps(`${n}(${cL}) = ${sum}`)}`,
      `条件是 $${cL}$，即${evDo(p, cond)["zh-CN"]}的人。他们是${parts[0]!["zh-CN"]}的人和${parts[1]!["zh-CN"]}的人，这两部分合起来就是新的全体：${steps(`${n}(${cL}) = ${sum}`)}`,
    ),
  );
  const second = step(
    2,
    "divide",
    "相除",
    t(
      `Inside the condition, those who are also in $${tL}$ are the ones ${regionIn(p, read.joint).en}: $${show(c.joint)}$.${steps(division)}`,
      `在条件之内，同时属于 $${tL}$ 的是${regionIn(p, read.joint)["zh-CN"]}的人：$${show(c.joint)}$。${steps(division)}`,
    ),
  );
  const last = counts
    ? check(
        t(
          `The other $${v[read.rest]}$ people of $${cL}$, ${regionIn(p, read.rest).en}, are not in $${tL}$, and $${c.joint} + ${v[read.rest]} = ${c.cond}$: the two parts make up the whole condition. So $P(${tL} \\mid ${cL})$ and its complement, $\\frac{${v[read.rest]}}{${c.cond}}$, add up to $1$, and the answer, a part over its whole, lies between $0$ and $1$.`,
          `$${cL}$ 中其余 $${v[read.rest]}$ 人${regionIn(p, read.rest)["zh-CN"]}，不属于 $${tL}$；$${c.joint} + ${v[read.rest]} = ${c.cond}$，两部分正好组成整个条件。所以 $P(${tL} \\mid ${cL})$ 与它的对立概率 $\\frac{${v[read.rest]}}{${c.cond}}$ 之和为 $1$，而答案是部分除以整体，在 $0$ 与 $1$ 之间。`,
        ),
      )
    : check(
        t(
          `Multiply back: $P(${cL}) \\cdot P(${tL} \\mid ${cL})$ must give the overlap of the two events, $${show(c.cond)} \\cdot ${answer.toLatex()} = ${show(c.joint)}$. It does, and the answer lies between $0$ and $1$.`,
          `乘回去：$P(${cL}) \\cdot P(${tL} \\mid ${cL})$ 应当等于两个事件同时发生的概率，$${show(c.cond)} \\cdot ${answer.toLatex()} = ${show(c.joint)}$。确实如此，而且答案在 $0$ 与 $1$ 之间。`,
        ),
      );
  return para(first, figureLine(0), second, last);
}

/** vennCountProblem asks a conditional probability from a Venn diagram of counts. */
function vennCountProblem(rng: Rng, complements: boolean): Problem {
  const p = rng.pick(pairs);
  const v = vennCounts(rng);
  const [target, cond] = pickEvents(rng, complements);
  const c = conditional(v, target, cond);
  const vs = v.map(String) as unknown as [string, string, string, string];
  const tD = evDo(p, target);
  const cD = evDo(p, cond);
  return {
    ...numberProblem({
      prompt: t(
        `The Venn diagram shows how many of the $${c.total}$ people surveyed ${p.aDo.en} ($${p.a}$) and how many ${p.bDo.en} ($${p.b}$). One of the people who ${cD.en} is chosen at random. What is the probability that this person ${tD.en.replace(/^do not/, "does not").replace(/^(\w+)/, (w) => (w === "does" ? w : thirdPerson(w)))}?${simplest.en}`,
        `维恩图显示了接受调查的 $${c.total}$ 人中${p.aDo["zh-CN"]}（$${p.a}$）和${p.bDo["zh-CN"]}（$${p.b}$）的人数。从${cD["zh-CN"]}的人中随机选一人，求此人${tD["zh-CN"]}的概率。${simplest["zh-CN"]}`,
      ),
      answer: Q.of(c.joint, c.cond),
      wrong: [Q.of(c.joint, c.total), Q.of(c.joint, c.target), Q.of(c.cond, c.total)],
      solution: vennSolution(p, v, target, cond, String, true),
    }),
    figure: { svg: venn(p.a, p.b, vs), alt: vennAlt(p.a, p.b, vs) },
    solutionFigures: [vennFigure(p.a, p.b, vs, vennShade(p, target, cond))],
  };
}

/** thirdPerson turns a verb into its third-person singular form: "own" → "owns", "study" → "studies". */
function thirdPerson(w: string): string {
  if (w.endsWith("y") && !/[aeiou]y$/.test(w)) return `${w.slice(0, -1)}ies`;
  if (/(s|sh|ch|x)$/.test(w)) return `${w}es`;
  return `${w}s`;
}

/** sing writes what a person does in the third person: "owns a cat", "does not own a cat". */
function sing(d: Text): string {
  if (d.en.startsWith("do not ")) return `does not ${d.en.slice(7)}`;
  return d.en.replace(/^(\w+)/, (w) => thirdPerson(w));
}

/** surveyCounts are the counts of the survey the explanations of this topic walk through. */
const surveyCounts = ["8", "4", "6", "2"] as const;

/** Conditional probabilities from Venn diagrams (Geometry 6.18.1). */
export const conditionalProbabilitiesFromVennDiagrams: TopicDef = {
  id: "conditional-probabilities-from-venn-diagrams",
  title: t("Conditional Probabilities From Venn Diagrams", "由维恩图求条件概率"),
  summary: t(
    "Find the probability of an event given that another event happens, from a Venn diagram of counts or of probabilities.",
    "由标有人数或概率的维恩图，求在一个事件发生的条件下另一个事件的概率。",
  ),
  prerequisites: ["fractions-and-decimals"],
  encompasses: [{ topic: "equivalent-fractions", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSS.CP.A.3"],
  intro: t(
    `When all outcomes are equally likely, a probability is a count of favorable outcomes over a count of possible ones. In a group of $25$ people, $15$ drink tea ($T$) and $13$ drink coffee ($C$); $6$ of them drink both. A person picked from the whole group drinks tea with probability $\\frac{15}{25} = \\frac{3}{5}$.

Now suppose we are told something first: the person picked drinks coffee. Everyone outside the circle $C$ is ruled out, and the $13$ coffee drinkers are the only possible outcomes left:

{{figure 0}}

Of those $13$, the $6$ in the overlap drink tea, so the probability is now $\\frac{6}{13}$, not $\\frac{3}{5}$. The information changed the probability because it changed the whole we count in.

This is a **conditional probability**: the probability that $T$ happens **given** that $C$ happens, written $P(T \\mid C)$. In this lesson we read conditional probabilities off Venn diagrams of counts, with complements, and of probabilities.`,
    `当所有结果等可能时，概率就是有利结果的个数除以全部结果的个数。在一组 $25$ 人中，$15$ 人喝茶（$T$），$13$ 人喝咖啡（$C$），其中 $6$ 人两样都喝。从全体中随机选一人，他喝茶的概率是 $\\frac{15}{25} = \\frac{3}{5}$。

现在假设先告诉我们一条信息：选出的人喝咖啡。圆 $C$ 以外的人都被排除了，可能的结果只剩下这 $13$ 个喝咖啡的人：

{{figure 0}}

这 $13$ 人中，重叠部分的 $6$ 人喝茶，所以现在的概率是 $\\frac{6}{13}$，而不是 $\\frac{3}{5}$。信息改变了概率，因为它改变了我们计数时的全体。

这就是**条件概率**：在 $C$ 发生的**条件下** $T$ 发生的概率，记作 $P(T \\mid C)$。这节课我们从标有人数的维恩图、含对立事件的情形和标有概率的维恩图中读出条件概率。`,
  ),
  introFigures: [
    vennFigure("T", "C", ["9", "6", "7", "3"], {
      cond: (r) => r === 1 || r === 2,
      joint: (r) => r === 1,
      alt: t(
        "Shaded: the 13 coffee drinkers; shaded darker: the 6 of them who drink tea.",
        "阴影：13 个喝咖啡的人；深色：其中喝茶的 6 人。",
      ),
    }),
  ],
  knowledgePoints: [
    {
      id: "conditional-from-counts",
      title: t("Conditional probability from counts", "由人数求条件概率"),
      explanation: t(
        `The **conditional probability** of $A$ given $B$, written $P(A \\mid B)$, is the probability that $A$ happens when we already know that $B$ happens. Knowing $B$ rules out every outcome outside $B$: the sample space shrinks to $B$. So the denominator is the number of outcomes in $B$, and the numerator is the number of those that are in $A$ as well:

$$P(A \\mid B) = \\frac{n(A \\cap B)}{n(B)}.$$

In the diagram, $20$ people were asked whether they study Spanish ($S$) and whether they play an instrument ($M$). One of the musicians is chosen at random. The circle $M$ is the new sample space, with $4 + 6 = 10$ musicians, and the $4$ in the overlap study Spanish as well:

{{figure 0}}

$$P(S \\mid M) = \\frac{4}{10} = \\frac{2}{5}.$$

> **Watch out.** The condition, the event after the bar, gives the denominator. Dividing by all $20$ people gives $P(S \\cap M) = \\frac{4}{20}$, the probability that a person picked from everyone does both. Dividing by the $12$ Spanish students gives $P(M \\mid S) = \\frac{4}{12}$, the answer to the reverse question.`,
        `在已知事件 $B$ 发生的条件下事件 $A$ 发生的概率，叫做 $B$ 发生条件下 $A$ 的**条件概率**，记作 $P(A \\mid B)$。知道 $B$ 发生，就排除了 $B$ 以外的所有结果：样本空间缩小为 $B$。所以分母是 $B$ 中结果的个数，分子是其中也属于 $A$ 的结果的个数：

$$P(A \\mid B) = \\frac{n(A \\cap B)}{n(B)}.$$

图中调查了 $20$ 人是否学西班牙语（$S$）、是否会演奏乐器（$M$）。从会演奏乐器的人中随机选一人。圆 $M$ 是新的样本空间，共 $4 + 6 = 10$ 人，重叠部分的 $4$ 人也学西班牙语：

{{figure 0}}

$$P(S \\mid M) = \\frac{4}{10} = \\frac{2}{5}.$$

> **注意。** 竖线后面的条件决定分母。除以全部 $20$ 人，得到的是 $P(S \\cap M) = \\frac{4}{20}$，即从所有人中选一人、他两样都会的概率。除以学西班牙语的 $12$ 人，得到的是 $P(M \\mid S) = \\frac{4}{12}$，那是反过来的问题。`,
      ),
      figures: [
        vennFigure("S", "M", surveyCounts, {
          cond: (r) => r === 1 || r === 2,
          joint: (r) => r === 1,
          alt: t("Shaded: the condition M; shaded darker: its part in S.", "阴影：条件 M；深色：其中属于 S 的部分。"),
        }),
      ],
      generate: (rng) => vennCountProblem(rng, false),
    },
    {
      id: "conditional-with-complements",
      title: t("Conditions with complements", "含对立事件的条件"),
      explanation: t(
        `The event or the condition may be a complement. $M'$ (not $M$) is everything outside the circle $M$, and that includes the region outside both circles. So shade the condition first and add up **all** of its regions; then count the part of it that lies in the event.

In the same survey, for $P(S \\mid M')$ the condition is the people who do not play an instrument: the $8$ in $S$ only and the $2$ outside both circles, $8 + 2 = 10$ people.

{{figure 0}}

$8$ of them study Spanish, so $P(S \\mid M') = \\frac{8}{10} = \\frac{4}{5}$. For $P(S' \\mid M)$ the condition is $M$ again, the $10$ musicians, and the $6$ of them outside $S$ give $P(S' \\mid M) = \\frac{6}{10} = \\frac{3}{5}$.

> **Watch out.** The region outside both circles belongs to every complement: leaving its $2$ people out makes $n(M') = 8$ instead of $10$. And, as before, divide by the size of the condition, not by all $20$ people.`,
        `事件或条件也可能是对立事件。$M'$（非 $M$）是圆 $M$ 以外的全部，包括两个圆外面的区域。所以先圈出条件，把它的**所有**区域加起来，再数其中属于所求事件的部分。

在同一个调查中求 $P(S \\mid M')$：条件是不会演奏乐器的人，即只在 $S$ 中的 $8$ 人和两圆之外的 $2$ 人，共 $8 + 2 = 10$ 人。

{{figure 0}}

其中 $8$ 人学西班牙语，所以 $P(S \\mid M') = \\frac{8}{10} = \\frac{4}{5}$。求 $P(S' \\mid M)$ 时条件又是 $M$，即 $10$ 个会演奏乐器的人，其中不在 $S$ 中的有 $6$ 人，所以 $P(S' \\mid M) = \\frac{6}{10} = \\frac{3}{5}$。

> **注意。** 两圆之外的区域属于每一个对立事件：漏掉那 $2$ 人，就会得到 $n(M') = 8$ 而不是 $10$。和前面一样，要除以条件的人数，而不是全部 $20$ 人。`,
      ),
      figures: [
        vennFigure("S", "M", surveyCounts, {
          cond: (r) => r === 0 || r === 3,
          joint: (r) => r === 0,
          alt: t(
            "Shaded: the condition M′, outside M; shaded darker: its part in S.",
            "阴影：条件 M′，即 M 之外；深色：其中属于 S 的部分。",
          ),
        }),
      ],
      generate: (rng) => vennCountProblem(rng, true),
    },
    {
      id: "conditional-from-probabilities",
      title: t("Conditional probability from probabilities", "由概率求条件概率"),
      explanation: t(
        `A Venn diagram may show probabilities instead of counts. Dividing a count by the total turns it into a probability, and dividing the top and the bottom of $\\frac{n(A \\cap B)}{n(B)}$ by the same total does not change the fraction. So the same rule holds with probabilities:

$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}.$$

In the diagram, $P(B) = 0.2 + 0.3 = 0.5$ and $P(A \\cap B) = 0.2$:

{{figure 0}}

$$P(A \\mid B) = \\frac{0.2}{0.5} = \\frac{2}{5}.$$

Multiplying the top and the bottom by $10$ or $100$ turns the decimals into whole numbers before simplifying.

> **Watch out.** The number in the overlap, $0.2$, is not the answer: it is the probability of both events among all outcomes. The condition shrinks the whole to $P(B) = 0.5$, so divide by it; and divide by the probability of the condition, $B$, not by $P(A)$.`,
        `维恩图上标的也可能是概率而不是人数。把人数除以总数就得到概率，而把 $\\frac{n(A \\cap B)}{n(B)}$ 的分子分母同除以总数，分数不变。所以用概率时规则相同：

$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}.$$

图中 $P(B) = 0.2 + 0.3 = 0.5$，$P(A \\cap B) = 0.2$：

{{figure 0}}

$$P(A \\mid B) = \\frac{0.2}{0.5} = \\frac{2}{5}.$$

分子分母同乘 $10$ 或 $100$，先把小数化成整数再约分。

> **注意。** 重叠部分的 $0.2$ 不是答案：它是在全部结果中两个事件同时发生的概率。条件把全体缩小为 $P(B) = 0.5$，所以要除以它；而且要除以条件 $B$ 的概率，而不是 $P(A)$。`,
      ),
      figures: [
        vennFigure("A", "B", ["0.3", "0.2", "0.3", "0.2"], {
          cond: (r) => r === 1 || r === 2,
          joint: (r) => r === 1,
          alt: t("Shaded: the condition B; shaded darker: its part in A.", "阴影：条件 B；深色：其中属于 A 的部分。"),
        }),
      ],
      generate(rng) {
        const p = rng.pick(pairs);
        const v = [rng.int(5, 35), rng.int(5, 25), rng.int(5, 35)];
        v.push(100 - v[0]! - v[1]! - v[2]!);
        const [target, cond] = pickEvents(rng, undefined);
        const c = conditional(v, target, cond);
        const vs = v.map(h) as [string, string, string, string];
        const tL = evL(p, target);
        const cL = evL(p, cond);
        return {
          ...numberProblem({
            prompt: t(
              `A person is chosen at random. The Venn diagram shows the probabilities for people who ${p.aDo.en} ($${p.a}$), who ${p.bDo.en} ($${p.b}$), who do both and who do neither. Find $P(${tL} \\mid ${cL})$, the probability that the person ${sing(evDo(p, target))} given that the person ${sing(evDo(p, cond))}.${simplest.en}`,
              `随机选一人。维恩图给出了此人${p.aDo["zh-CN"]}（$${p.a}$）、${p.bDo["zh-CN"]}（$${p.b}$）、两者都是或两者都不是的概率。求 $P(${tL} \\mid ${cL})$，即在此人${evDo(p, cond)["zh-CN"]}的条件下，此人${evDo(p, target)["zh-CN"]}的概率。${simplest["zh-CN"]}`,
            ),
            answer: Q.of(c.joint, c.cond),
            wrong: [Q.of(c.joint, 100), Q.of(c.joint, c.target), Q.of(c.cond, 100)],
            solution: vennSolution(p, v, target, cond, h, false),
          }),
          figure: { svg: venn(p.a, p.b, vs), alt: vennAlt(p.a, p.b, vs) },
          solutionFigures: [vennFigure(p.a, p.b, vs, vennShade(p, target, cond))],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Two-way tables

/** Cat is one category of a two-way table: its heading and what a member of it does. */
interface Cat {
  readonly label: Text;
  readonly is: Text;
}

/** TableCtx is a two-way table of people classified two ways. */
interface TableCtx {
  readonly intro: Text;
  readonly a: Text;
  readonly the: Text;
  /** many names the members of the table: "students". */
  readonly many: Text;
  readonly rows: readonly [Cat, Cat];
  readonly cols: readonly [Cat, Cat];
}

const tables: readonly TableCtx[] = [
  {
    intro: t("The table shows how the students of a school get to school.", "下表显示了某校学生的上学方式。"),
    a: t("A student", "一名学生"),
    the: t("the student", "这名学生"),
    many: t("students", "名学生"),
    rows: [
      { label: t("Grade 9", "九年级"), is: t("is in Grade 9", "是九年级的") },
      { label: t("Grade 10", "十年级"), is: t("is in Grade 10", "是十年级的") },
    ],
    cols: [
      { label: t("Walks", "步行"), is: t("walks to school", "步行上学") },
      { label: t("Takes the bus", "坐公交"), is: t("takes the bus to school", "坐公交上学") },
    ],
  },
  {
    intro: t("The table shows the visitors to a cinema on one evening.", "下表显示了某电影院一个晚上的观众情况。"),
    a: t("A visitor", "一名观众"),
    the: t("the visitor", "这名观众"),
    many: t("visitors", "名观众"),
    rows: [
      { label: t("Adult", "成年人"), is: t("is an adult", "是成年人") },
      { label: t("Child", "儿童"), is: t("is a child", "是儿童") },
    ],
    cols: [
      { label: t("Bought popcorn", "买了爆米花"), is: t("bought popcorn", "买了爆米花") },
      { label: t("No popcorn", "没买爆米花"), is: t("did not buy popcorn", "没有买爆米花") },
    ],
  },
  {
    intro: t(
      "The table shows the workers of a factory by shift and by whether they were late last week.",
      "下表按班次和上周是否迟到统计了某工厂的工人。",
    ),
    a: t("A worker", "一名工人"),
    the: t("the worker", "这名工人"),
    many: t("workers", "名工人"),
    rows: [
      { label: t("Morning shift", "早班"), is: t("works the morning shift", "上早班") },
      { label: t("Evening shift", "晚班"), is: t("works the evening shift", "上晚班") },
    ],
    cols: [
      { label: t("Late", "迟到过"), is: t("was late last week", "上周迟到过") },
      { label: t("Not late", "没迟到"), is: t("was not late last week", "上周没有迟到") },
    ],
  },
];

/** tableMd writes a two-way table in Markdown, with totals when asked. */
function tableMd(c: TableCtx, cells: readonly (readonly number[])[], totals: boolean): Text {
  const make = (loc: "en" | "zh-CN", total: string) => {
    const head = `| | ${c.cols[0].label[loc]} | ${c.cols[1].label[loc]} |${totals ? ` ${total} |` : ""}`;
    const rule = `| :--- | ---: | ---: |${totals ? " ---: |" : ""}`;
    const rows = cells.map((r, i) => `| ${c.rows[i as 0 | 1].label[loc]} | ${r[0]} | ${r[1]} |${totals ? ` ${r[0]! + r[1]!} |` : ""}`);
    const lines = [head, rule, ...rows];
    if (totals) {
      const c0 = cells[0]![0]! + cells[1]![0]!;
      const c1 = cells[0]![1]! + cells[1]![1]!;
      lines.push(`| ${total} | ${c0} | ${c1} | ${c0 + c1} |`);
    }
    return `\n\n${lines.join("\n")}\n\n`;
  };
  return t(make("en", "Total"), make("zh-CN", "合计"));
}

/** tableFigure draws a two-way table with its totals, the row or the column of the condition shaded, and the cells of a division marked. */
function tableFigure(cells: readonly (readonly number[])[], m: TableMarks, alt: Text): Figure {
  return { svg: tableSvg(cells, m), alt };
}

/** tableProblem asks a conditional probability from a two-way table, given a row or given a column. */
function tableProblem(rng: Rng, byRow: boolean, totals: boolean): Problem {
  const c = rng.pick(tables);
  const cells = [
    [rng.int(3, 40), rng.int(3, 40)],
    [rng.int(3, 40), rng.int(3, 40)],
  ];
  const i = rng.int(0, 1);
  const j = rng.int(0, 1);
  const cell = cells[i]![j]!;
  const rowT = cells[i]![0]! + cells[i]![1]!;
  const colT = cells[0]![j]! + cells[1]![j]!;
  const total = rowT + cells[1 - i]![0]! + cells[1 - i]![1]!;
  const row = c.rows[i as 0 | 1];
  const col = c.cols[j as 0 | 1];
  const [given, wanted, den] = byRow ? [row, col, rowT] : [col, row, colT];
  const other = byRow ? cells[i]![1 - j]! : cells[1 - i]![j]!;
  const otherCat = byRow ? c.cols[(1 - j) as 0 | 1] : c.rows[(1 - i) as 0 | 1];
  const tb = tableMd(c, cells, totals);
  const [line, lineZh] = byRow ? ["row", "行"] : ["column", "列"];
  const parts = byRow ? [cells[i]![0]!, cells[i]![1]!] : [cells[0]![j]!, cells[1]![j]!];
  const size = totals
    ? t(`its total, in the ${byRow ? "last column" : "last row"}, is $${den}$`, `它的合计在${byRow ? "最后一列" : "最后一行"}，是 $${den}$`)
    : t(
        `the table has no totals, so add its two cells: $${parts[0]} + ${parts[1]} = ${den}$`,
        `表中没有合计，所以把它的两个格子相加：$${parts[0]} + ${parts[1]} = ${den}$`,
      );
  const marks: TableMarks = byRow ? { row: i, num: [i, j], den: [i, 2] } : { col: j, num: [i, j], den: [2, j] };
  return {
    ...numberProblem({
      prompt: t(
        `${c.intro.en}${tb.en}${c.a.en} is chosen at random. Given that ${c.the.en} ${given.is.en}, what is the probability that ${c.the.en} ${wanted.is.en}?${simplest.en}`,
        `${c.intro["zh-CN"]}${tb["zh-CN"]}随机选${c.a["zh-CN"]}。已知${c.the["zh-CN"]}${given.is["zh-CN"]}，求${c.the["zh-CN"]}${wanted.is["zh-CN"]}的概率。${simplest["zh-CN"]}`,
      ),
      answer: Q.of(cell, den),
      wrong: [Q.of(cell, total), Q.of(cell, byRow ? colT : rowT), Q.of(den, total)],
      solution: para(
        step(
          1,
          `keep only the ${line} of the condition`,
          `只保留条件所在的${lineZh}`,
          t(
            `We know that ${c.the.en} ${given.is.en}, so only the ${line} "${given.label.en}" counts, and ${size.en}. These $${den}$ ${c.many.en} are the new whole:`,
            `已知${c.the["zh-CN"]}${given.is["zh-CN"]}，所以只看“${given.label["zh-CN"]}”这一${lineZh}，${size["zh-CN"]}。这 $${den}$ ${c.many["zh-CN"]}就是新的全体：`,
          ),
        ),
        figureLine(0),
        step(
          2,
          "divide",
          "相除",
          t(
            `In that ${line}, $${cell}$ ${c.many.en} are in "${wanted.label.en}":${steps(`P = ${ratioL(cell, den)}`)}`,
            `在这一${lineZh}中，“${wanted.label["zh-CN"]}”有 $${cell}$ ${c.many["zh-CN"]}：${steps(`P = ${ratioL(cell, den)}`)}`,
          ),
        ),
        check(
          t(
            `The other cell of the ${line}, "${otherCat.label.en}", holds the other $${other}$, and $${cell} + ${other} = ${den}$: together the two cells are the whole ${line}. So $\\frac{${cell}}{${den}}$ and $\\frac{${other}}{${den}}$ add up to $1$, and the answer lies between $0$ and $1$.`,
            `这一${lineZh}的另一个格子“${otherCat.label["zh-CN"]}”有 $${other}$ ${c.many["zh-CN"]}，$${cell} + ${other} = ${den}$：两个格子合起来正好是整${lineZh}。所以 $\\frac{${cell}}{${den}}$ 与 $\\frac{${other}}{${den}}$ 之和为 $1$，答案在 $0$ 与 $1$ 之间。`,
          ),
        ),
      ),
    }),
    solutionFigures: [
      tableFigure(
        cells,
        marks,
        t(
          `The counts of the table with their totals. Shaded: the ${line} "${given.label.en}", whose total ${den} is the denominator; marked: the ${cell} who are in "${wanted.label.en}" as well.`,
          `带合计的表格。阴影：“${given.label["zh-CN"]}”这一${lineZh}，它的合计 ${den} 是分母；标出：其中属于“${wanted.label["zh-CN"]}”的 ${cell}。`,
        ),
      ),
    ],
  };
}

/** schoolCells are the counts of the table the explanations of this topic walk through. */
const schoolCells = [
  [18, 12],
  [10, 20],
] as const;

/** Conditional probabilities from two-way tables (Geometry 6.18.2). */
export const conditionalProbabilitiesFromTables: TopicDef = {
  id: "conditional-probabilities-from-tables",
  title: t("Conditional Probabilities From Tables", "由表格求条件概率"),
  summary: t(
    "Find conditional probabilities from two-way tables by restricting to one row or one column.",
    "在双向表中只看一行或一列，求条件概率。",
  ),
  prerequisites: ["conditional-probabilities-from-venn-diagrams"],
  encompasses: [{ topic: "conditional-probabilities-from-venn-diagrams", weight: 0.2 }],
  xp: 12,
  standards: ["CCSS.HSS.CP.A.4", "CCSS.HSS.CP.B.6"],
  intro: t(
    `A Venn diagram of two events has four regions: both, the first only, the second only, and neither. A **two-way table** holds the same four counts in a grid, one characteristic along the rows and the other along the columns, often with the totals added:

| | Bought popcorn | No popcorn | Total |
| :--- | ---: | ---: | ---: |
| Adult | 24 | 16 | 40 |
| Child | 27 | 3 | 30 |
| Total | 51 | 19 | 70 |

Of all $70$ visitors to a cinema, $51$ bought popcorn, so a visitor picked at random bought popcorn with probability $\\frac{51}{70}$. Given that the visitor is a child, only the row "Child" counts:

{{figure 0}}

$27$ of its $30$ children bought popcorn, so $P(\\text{popcorn} \\mid \\text{child}) = \\frac{27}{30} = \\frac{9}{10}$, much more than $\\frac{51}{70}$. A condition in a table is a row or a column, and the total of that row or column is the denominator. In this lesson we condition on a row, on a column, and on tables that do not show their totals.`,
    `两个事件的维恩图有四个区域：两者都是、只是第一个、只是第二个、两者都不是。**双向表**把同样的四个数排成表格：行表示一种特征，列表示另一种特征，通常还加上合计：

| | 买了爆米花 | 没买爆米花 | 合计 |
| :--- | ---: | ---: | ---: |
| 成年人 | 24 | 16 | 40 |
| 儿童 | 27 | 3 | 30 |
| 合计 | 51 | 19 | 70 |

电影院的 $70$ 名观众中有 $51$ 人买了爆米花，所以随机选一名观众，他买了爆米花的概率是 $\\frac{51}{70}$。如果已知这名观众是儿童，就只看“儿童”这一行：

{{figure 0}}

这一行的 $30$ 名儿童中有 $27$ 人买了爆米花，所以 $P(\\text{爆米花} \\mid \\text{儿童}) = \\frac{27}{30} = \\frac{9}{10}$，比 $\\frac{51}{70}$ 大得多。表格中的条件就是一行或一列，这一行或一列的合计就是分母。这节课我们分别以一行、一列为条件，也处理不给合计的表格。`,
  ),
  introFigures: [
    tableFigure(
      [
        [24, 16],
        [27, 3],
      ],
      { row: 1, num: [1, 0], den: [1, 2] },
      t(
        "The cinema table with totals. Shaded: the row of children, total 30; marked: the 27 children who bought popcorn.",
        "带合计的电影院表格。阴影：儿童这一行，合计 30；标出：其中买了爆米花的 27 人。",
      ),
    ),
  ],
  knowledgePoints: [
    {
      id: "given-a-row",
      title: t("Given a row", "已知所在行"),
      explanation: t(
        `To find a probability **given** a category, keep only that category's row: the people outside it are ruled out, as the outcomes outside the condition were in a Venn diagram. The total of the row is the denominator, and the cell where the row meets the event's column is the numerator.

| | Walks | Bus | Total |
| :--- | ---: | ---: | ---: |
| Grade 9 | 18 | 12 | 30 |
| Grade 10 | 10 | 20 | 30 |
| Total | 28 | 32 | 60 |

Given that a randomly chosen student is in Grade 9, the row "Grade 9" holds $30$ students, and $18$ of them walk:

{{figure 0}}

$$P(\\text{walks} \\mid \\text{Grade 9}) = \\frac{18}{30} = \\frac{3}{5}.$$

> **Watch out.** Divide by the total of the row of the condition, $30$. Dividing by the grand total $60$ gives $P(\\text{Grade 9 and walks}) = \\frac{18}{60}$, a different question, and dividing by the column total $28$ answers the reverse question, $P(\\text{Grade 9} \\mid \\text{walks})$.`,
        `求**已知**某一类时的概率，只保留这一类所在的行：这一行以外的人都被排除了，就像维恩图中条件以外的结果被排除一样。这一行的合计是分母，这一行与所求事件那一列相交的格子是分子。

| | 步行 | 坐公交 | 合计 |
| :--- | ---: | ---: | ---: |
| 九年级 | 18 | 12 | 30 |
| 十年级 | 10 | 20 | 30 |
| 合计 | 28 | 32 | 60 |

已知随机选出的学生是九年级的，“九年级”这一行有 $30$ 人，其中 $18$ 人步行：

{{figure 0}}

$$P(\\text{步行} \\mid \\text{九年级}) = \\frac{18}{30} = \\frac{3}{5}.$$

> **注意。** 要除以条件所在行的合计 $30$。除以总数 $60$，得到的是“是九年级的且步行”的概率 $\\frac{18}{60}$，那是另一个问题；除以这一列的合计 $28$，回答的是反过来的问题 $P(\\text{九年级} \\mid \\text{步行})$。`,
      ),
      figures: [
        tableFigure(
          schoolCells,
          { row: 0, num: [0, 0], den: [0, 2] },
          t(
            "The school table with totals. Shaded: the row Grade 9, total 30; marked: the 18 of them who walk.",
            "带合计的学校表格。阴影：九年级这一行，合计 30；标出：其中步行的 18 人。",
          ),
        ),
      ],
      generate: (rng) => tableProblem(rng, true, true),
    },
    {
      id: "given-a-column",
      title: t("Given a column", "已知所在列"),
      explanation: t(
        `The condition may be a column instead; then the column total is the denominator. In the table of the previous step, given that a student walks, only the column "Walks" counts. It holds $28$ students, and $18$ of them are in Grade 9:

{{figure 0}}

$$P(\\text{Grade 9} \\mid \\text{walks}) = \\frac{18}{28} = \\frac{9}{14}.$$

The cell is the same $18$ as for $P(\\text{walks} \\mid \\text{Grade 9}) = \\frac{18}{30}$, but the condition is different, and so is the whole it is counted in.

> **Watch out.** $P(A \\mid B)$ and $P(B \\mid A)$ share their numerator but not their denominator. Read the question for what is **given**: that category's row or column supplies the total, here the column total $28$, not the row total $30$ or the grand total $60$.`,
        `条件也可能是一列，这时分母是这一列的合计。在上一步的表中，已知学生步行上学，就只看“步行”这一列。这一列有 $28$ 人，其中 $18$ 人是九年级的：

{{figure 0}}

$$P(\\text{九年级} \\mid \\text{步行}) = \\frac{18}{28} = \\frac{9}{14}.$$

格子还是求 $P(\\text{步行} \\mid \\text{九年级}) = \\frac{18}{30}$ 时的那个 $18$，但条件不同，计数时的全体也就不同。

> **注意。** $P(A \\mid B)$ 与 $P(B \\mid A)$ 分子相同，分母不同。读题时找出**已知**的是什么：那一类所在的行或列给出合计，这里是这一列的合计 $28$，而不是这一行的合计 $30$ 或总数 $60$。`,
      ),
      figures: [
        tableFigure(
          schoolCells,
          { col: 0, num: [0, 0], den: [2, 0] },
          t(
            "The school table with totals. Shaded: the column Walks, total 28; marked: the 18 of them in Grade 9.",
            "带合计的学校表格。阴影：步行这一列，合计 28；标出：其中九年级的 18 人。",
          ),
        ),
      ],
      generate: (rng) => tableProblem(rng, false, true),
    },
    {
      id: "tables-without-totals",
      title: t("Tables without totals", "没有合计的表格"),
      explanation: t(
        `When the table shows no totals, add up the row or the column of the condition yourself: it is the only total the question needs. With the counts of the school table, Grade 9 has $18$ students who walk and $12$ who take the bus, so it has $18 + 12 = 30$ students, and

$$P(\\text{bus} \\mid \\text{Grade 9}) = \\frac{12}{18 + 12} = \\frac{12}{30} = \\frac{2}{5}.$$

Given that a student takes the bus, add the column instead: $12 + 20 = 32$ students, and $P(\\text{Grade 9} \\mid \\text{bus}) = \\frac{12}{32} = \\frac{3}{8}$.

> **Watch out.** Add along the condition. For "given Grade 9" add across its row, $18 + 12$; adding down the column, $12 + 20$, or adding all four cells gives the denominator of another question.`,
        `如果表中没有合计，就自己把条件所在的行或列加起来：这是题目唯一需要的合计。用学校表格的数据，九年级步行的有 $18$ 人、坐公交的有 $12$ 人，所以九年级共 $18 + 12 = 30$ 人，

$$P(\\text{坐公交} \\mid \\text{九年级}) = \\frac{12}{18 + 12} = \\frac{12}{30} = \\frac{2}{5}.$$

若已知学生坐公交，就把这一列加起来：$12 + 20 = 32$ 人，$P(\\text{九年级} \\mid \\text{坐公交}) = \\frac{12}{32} = \\frac{3}{8}$。

> **注意。** 沿着条件相加。“已知是九年级的”就把这一行加起来，$18 + 12$；把这一列加起来（$12 + 20$）或把四个格子全加起来，得到的是别的问题的分母。`,
      ),
      generate: (rng) => tableProblem(rng, rng.bool(), false),
    },
  ],
};
// ---------------------------------------------------------------------------
// The multiplication law

/** Bag is a container of objects of two colors drawn without replacement. */
interface Bag {
  readonly setup: (x: number, y: number) => Text;
  readonly two: Text;
  readonly x: Text;
  readonly y: Text;
  readonly letters: readonly [string, string];
}

const bags: readonly Bag[] = [
  {
    setup: (x, y) => t(`A bag holds ${x} red and ${y} blue marbles.`, `袋子里有 ${x} 颗红弹珠和 ${y} 颗蓝弹珠。`),
    two: t("Two marbles are taken out at random, one after the other, without replacement.", "不放回地依次随机取出两颗弹珠。"),
    x: t("red", "红色"),
    y: t("blue", "蓝色"),
    letters: ["R", "B"],
  },
  {
    setup: (x, y) => t(`A drawer holds ${x} grey and ${y} white socks.`, `抽屉里有 ${x} 只灰袜子和 ${y} 只白袜子。`),
    two: t("Two socks are taken out at random, one after the other, without replacement.", "不放回地依次随机取出两只袜子。"),
    x: t("grey", "灰色"),
    y: t("white", "白色"),
    letters: ["G", "W"],
  },
  {
    setup: (x, y) => t(`A box holds ${x} green and ${y} yellow counters.`, `盒子里有 ${x} 个绿色筹码和 ${y} 个黄色筹码。`),
    two: t("Two counters are taken out at random, one after the other, without replacement.", "不放回地依次随机取出两个筹码。"),
    x: t("green", "绿色"),
    y: t("yellow", "黄色"),
    letters: ["G", "Y"],
  },
];

/** qs writes a probability as plain text for a drawing: "3/10", "1". */
const qs = (q: Q) => (q.d === 1n ? `${q.n}` : `${q.n}/${q.d}`);

/** bagTree is the tree diagram of two draws without replacement from x and y objects, with marks when given. */
function bagTree(bag: Bag, x: number, y: number, marks?: TreeMarks, note?: Text): Figure {
  const n = x + y;
  const [X, Y] = bag.letters;
  return treeFigure(
    [
      { label: X, p: `${x}/${n}` },
      { label: Y, p: `${y}/${n}` },
    ],
    [
      [
        { label: X, p: `${x - 1}/${n - 1}` },
        { label: Y, p: `${y}/${n - 1}` },
      ],
      [
        { label: X, p: `${x}/${n - 1}` },
        { label: Y, p: `${y - 1}/${n - 1}` },
      ],
    ],
    marks,
    note,
  );
}

/** pathTree draws the tree of A then B with the path A, B marked and its probability after it; the branches after A′ are left unlabelled. */
function pathTree(pa: string, pna: string, pb: string, pnb: string, leaf: string): Figure {
  return treeFigure(
    [
      { label: "A", p: pa },
      { label: "A'", p: pna },
    ],
    [
      [
        { label: "B", p: pb },
        { label: "B'", p: pnb },
      ],
      [
        { label: "B", p: "" },
        { label: "B'", p: "" },
      ],
    ],
    { tone: either(onPaths([[0, 0]]), () => "accent"), leaf: (path) => (samePath(path, [0, 0]) ? leaf : "") },
    t(`Marked: the path A then B, with probability ${leaf}.`, `标出：先 A 后 B 的路径，概率为 ${leaf}。`),
  );
}

/** The multiplication law for conditional probability (Geometry 6.18.3). */
export const theMultiplicationLawForConditionalProbability: TopicDef = {
  id: "the-multiplication-law-for-conditional-probability",
  title: t("The Multiplication Law for Conditional Probability", "条件概率的乘法公式"),
  summary: t(
    "Use P(A ∩ B) = P(A) · P(B | A) to find the probability that two events both happen, or to find a conditional probability.",
    "用 P(A ∩ B) = P(A) · P(B | A) 求两个事件同时发生的概率，或求条件概率。",
  ),
  prerequisites: ["conditional-probabilities-from-venn-diagrams", "dividing-fractions", "decimal-arithmetic"],
  encompasses: [
    { topic: "multiplying-fractions", weight: 0.4 },
    { topic: "dividing-fractions", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.B.8"],
  intro: t(
    `A conditional probability divides: $P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)}$. Often we know the conditional probability and want the probability that both events happen, so we turn the division around.

A school has $200$ students; $50$ of them play in the band, and $\\frac{2}{5}$ of the band members also sing in the choir. That is $\\frac{2}{5} \\cdot 50 = 20$ students who do both, so a student picked at random does both with probability $\\frac{20}{200} = \\frac{1}{10}$. The same number comes from the two probabilities alone: $P(\\text{band}) = \\frac{50}{200} = \\frac{1}{4}$, $P(\\text{choir} \\mid \\text{band}) = \\frac{2}{5}$, and

$$\\frac{1}{4} \\cdot \\frac{2}{5} = \\frac{1}{10}.$$

Taking a fraction of a fraction is multiplying. This is the **multiplication law**, $P(A \\cap B) = P(A) \\cdot P(B \\mid A)$. In this lesson we use it forwards, backwards to find a conditional probability, and for objects drawn one after another without replacement.`,
    `条件概率是用除法求的：$P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)}$。很多时候我们已知条件概率，想求两个事件同时发生的概率，这就要把除法倒过来。

某校有 $200$ 名学生，其中 $50$ 人参加乐队，乐队成员中又有 $\\frac{2}{5}$ 参加合唱团。两者都参加的有 $\\frac{2}{5} \\cdot 50 = 20$ 人，所以随机选一名学生，他两者都参加的概率是 $\\frac{20}{200} = \\frac{1}{10}$。只用两个概率也能得到同样的数：$P(\\text{乐队}) = \\frac{50}{200} = \\frac{1}{4}$，$P(\\text{合唱} \\mid \\text{乐队}) = \\frac{2}{5}$，

$$\\frac{1}{4} \\cdot \\frac{2}{5} = \\frac{1}{10}.$$

求一个分数的几分之几，就是相乘。这就是**乘法公式** $P(A \\cap B) = P(A) \\cdot P(B \\mid A)$。这节课我们正着用它，倒过来用它求条件概率，再用它处理不放回地依次抽取。`,
  ),
  knowledgePoints: [
    {
      id: "probability-of-both",
      title: t("The probability that both happen", "两个事件同时发生的概率"),
      explanation: t(
        `Multiplying both sides of $P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)}$ by $P(A)$ gives the **multiplication law**:

$$P(A \\cap B) = P(A) \\cdot P(B \\mid A).$$

For both events to happen, $A$ must happen, and then $B$ must happen given $A$: of the share $P(A)$ of all outcomes, we keep the share $P(B \\mid A)$. On a tree diagram this is the path that goes first along $A$ and then along $B$, and the probabilities along a path multiply.

If the probability of rain on Saturday is $\\frac{2}{5}$ and, when it rains on Saturday, the probability of rain on Sunday is $\\frac{3}{4}$, the path "rain, then rain" has probability

{{figure 0}}

$$\\frac{2}{5} \\cdot \\frac{3}{4} = \\frac{6}{20} = \\frac{3}{10}.$$

> **Watch out.** Multiply, do not add: $\\frac{2}{5} + \\frac{3}{4}$ is more than $1$. And $\\frac{3}{4}$ alone is not the answer, since it only counts the days after a rainy Saturday. Both happening is never more likely than either step, so the answer is smaller than each factor.`,
        `把 $P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)}$ 两边同乘 $P(A)$，得到**乘法公式**：

$$P(A \\cap B) = P(A) \\cdot P(B \\mid A).$$

两个事件都发生，就是 $A$ 先发生，再在 $A$ 发生的条件下 $B$ 发生：在全部结果中占 $P(A)$ 的那部分里，再取其中的 $P(B \\mid A)$。在树状图上，这是先沿 $A$ 再沿 $B$ 的路径，一条路径上的概率相乘。

若周六下雨的概率是 $\\frac{2}{5}$，周六下雨时周日也下雨的概率是 $\\frac{3}{4}$，那么“下雨、再下雨”这条路径的概率是

{{figure 0}}

$$\\frac{2}{5} \\cdot \\frac{3}{4} = \\frac{6}{20} = \\frac{3}{10}.$$

> **注意。** 要相乘，不要相加：$\\frac{2}{5} + \\frac{3}{4}$ 比 $1$ 还大。单独的 $\\frac{3}{4}$ 也不是答案，它只考虑了周六下雨之后的情况。两件事都发生不会比其中任何一步更可能，所以答案比每个因数都小。`,
      ),
      figures: [pathTree("2/5", "3/5", "3/4", "1/4", "3/10")],
      generate(rng) {
        const b = rng.int(3, 10);
        const a = rng.int(1, b - 1);
        const d = rng.int(3, 10);
        const c = rng.int(1, d - 1);
        const pa = Q.of(a, b);
        const pc = Q.of(c, d);
        const ans = pa.mul(pc);
        const raw = `${fr(a * c, b * d)}`;
        const product = `${pa.toLatex()} \\cdot ${pc.toLatex()} = ${ans.toLatex() === raw ? raw : `${raw} = ${ans.toLatex()}`}`;
        const work = steps(`P(A \\cap B) = P(A) \\cdot P(B \\mid A) = ${product}`);
        const rain = rng.bool();
        const names = rain ? t("Let $A$ be rain on Saturday and $B$ rain on Sunday. ", "设 $A$ 为周六下雨，$B$ 为周日下雨。") : t("", "");
        return {
          ...numberProblem({
            prompt: rain
              ? t(
                  `The probability that it rains on Saturday is $${pa.toLatex()}$. If it rains on Saturday, the probability that it also rains on Sunday is $${pc.toLatex()}$. What is the probability that it rains on both days?${simplest.en}`,
                  `周六下雨的概率是 $${pa.toLatex()}$。如果周六下雨，周日也下雨的概率是 $${pc.toLatex()}$。求两天都下雨的概率。${simplest["zh-CN"]}`,
                )
              : t(
                  `For two events $A$ and $B$, $P(A) = ${pa.toLatex()}$ and $P(B \\mid A) = ${pc.toLatex()}$. Find $P(A \\cap B)$.${simplest.en}`,
                  `对两个事件 $A$ 和 $B$，$P(A) = ${pa.toLatex()}$，$P(B \\mid A) = ${pc.toLatex()}$。求 $P(A \\cap B)$。${simplest["zh-CN"]}`,
                ),
            answer: ans,
            wrong: [pc, pa.add(pc), pc.div(pa), pa.div(pc)],
            solution: para(
              step(
                1,
                "read the path",
                "找出路径",
                t(
                  `${names.en}Both happen along one path of the tree: first $A$, with $P(A) = ${pa.toLatex()}$, then $B$ given $A$, with $P(B \\mid A) = ${pc.toLatex()}$. The second probability is already measured among the outcomes where $A$ happened.`,
                  `${names["zh-CN"]}两者都发生，是树状图上的一条路径：先是 $A$，$P(A) = ${pa.toLatex()}$；再是 $A$ 发生条件下的 $B$，$P(B \\mid A) = ${pc.toLatex()}$。第二个概率本来就是在 $A$ 发生的那些结果中衡量的。`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "multiply along it",
                "沿路径相乘",
                t(`By the multiplication law, multiply the two probabilities:${work}`, `由乘法公式，把两个概率相乘：${work}`),
              ),
              check(
                t(
                  `Divide back: $${ans.toLatex()} \\div ${pa.toLatex()} = ${ans.div(pa).toLatex()}$, which is $P(B \\mid A)$ again. The answer is smaller than both $${pa.toLatex()}$ and $${pc.toLatex()}$, as the probability that both happen must be.`,
                  `除回去：$${ans.toLatex()} \\div ${pa.toLatex()} = ${ans.div(pa).toLatex()}$，正是 $P(B \\mid A)$。答案比 $${pa.toLatex()}$ 和 $${pc.toLatex()}$ 都小，两者同时发生的概率本应如此。`,
                ),
              ),
            ),
          }),
          solutionFigures: [pathTree(qs(pa), qs(Q.one.sub(pa)), qs(pc), qs(Q.one.sub(pc)), qs(ans))],
        };
      },
    },
    {
      id: "finding-a-conditional-probability",
      title: t("Finding a conditional probability", "求条件概率"),
      explanation: t(
        `When $P(A)$ and $P(A \\cap B)$ are known, the multiplication law has one unknown left, $P(B \\mid A)$, and dividing by $P(A)$ finds it:

$$P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)}.$$

On the tree, the first branch $A$ and the whole path $A$ then $B$ are known, and the branch between them is missing:

{{figure 0}}

If $60\\%$ of a class passed the first test and $45\\%$ passed both tests, then for a student who passed the first test, the probability of passing the second is

$$\\frac{0.45}{0.6} = \\frac{45}{60} = \\frac{3}{4}.$$

> **Watch out.** $0.45$ is the probability of both among all students, not among those who passed the first test, so it is not the answer. Multiplying $0.6 \\cdot 0.45$ or subtracting $0.6 - 0.45$ does not undo the multiplication law; dividing does.`,
        `已知 $P(A)$ 和 $P(A \\cap B)$ 时，乘法公式里只剩一个未知数 $P(B \\mid A)$，除以 $P(A)$ 就能求出它：

$$P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)}.$$

在树状图上，第一段 $A$ 和整条路径“先 $A$ 后 $B$”都已知，缺的是中间那一段：

{{figure 0}}

若某班 $60\\%$ 的学生通过了第一次测验，$45\\%$ 两次都通过，则对一名通过第一次测验的学生，他通过第二次的概率是

$$\\frac{0.45}{0.6} = \\frac{45}{60} = \\frac{3}{4}.$$

> **注意。** $0.45$ 是在全体学生中两次都通过的概率，不是在通过第一次的学生中的概率，所以它不是答案。$0.6 \\cdot 0.45$ 或 $0.6 - 0.45$ 都不能把乘法公式倒回去，要用除法。`,
      ),
      figures: [pathTree("0.6", "0.4", "?", "", "0.45")],
      generate(rng) {
        const x = 5 * rng.int(4, 19);
        const y = 5 * rng.int(1, x / 5 - 1);
        const ans = Q.of(y, x);
        const work = steps(`P(B \\mid A) = \\frac{P(A \\cap B)}{P(A)} = \\frac{${h(y)}}{${h(x)}} = ${ratioL(y, x)}`);
        const test = rng.bool();
        const names = test
          ? t("Let $A$ be passing the first test and $B$ passing the second. ", "设 $A$ 为通过第一次测验，$B$ 为通过第二次测验。")
          : t("", "");
        return {
          ...numberProblem({
            prompt: test
              ? t(
                  `In a class, the probability that a student passed the first test is $${h(x)}$, and the probability that a student passed both tests is $${h(y)}$. A student who passed the first test is chosen at random. What is the probability that this student passed the second test?${simplest.en}`,
                  `某班学生通过第一次测验的概率是 $${h(x)}$，两次测验都通过的概率是 $${h(y)}$。从通过第一次测验的学生中随机选一人，求他通过第二次测验的概率。${simplest["zh-CN"]}`,
                )
              : t(
                  `For two events $A$ and $B$, $P(A) = ${h(x)}$ and $P(A \\cap B) = ${h(y)}$. Find $P(B \\mid A)$.${simplest.en}`,
                  `对两个事件 $A$ 和 $B$，$P(A) = ${h(x)}$，$P(A \\cap B) = ${h(y)}$。求 $P(B \\mid A)$。${simplest["zh-CN"]}`,
                ),
            answer: ans,
            wrong: [Q.of(x * y, 10000), Q.of(y, 100), Q.of(x - y, 100)],
            solution: para(
              step(
                1,
                "find the missing branch",
                "找出缺的那一段",
                t(
                  `${names.en}The multiplication law says $P(A \\cap B) = P(A) \\cdot P(B \\mid A)$, and here $P(A) = ${h(x)}$ and $P(A \\cap B) = ${h(y)}$ are known. On the tree, the branch from $A$ to $B$ is the unknown:`,
                  `${names["zh-CN"]}乘法公式是 $P(A \\cap B) = P(A) \\cdot P(B \\mid A)$，这里已知 $P(A) = ${h(x)}$，$P(A \\cap B) = ${h(y)}$。在树状图上，从 $A$ 到 $B$ 的那一段是未知数：`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "divide",
                "相除",
                t(
                  `Divide both sides by $P(A)$, the probability of the condition, and multiply the top and the bottom by $100$:${work}`,
                  `两边同除以条件的概率 $P(A)$，分子分母同乘 $100$：${work}`,
                ),
              ),
              check(
                t(
                  `Multiply back: $P(A) \\cdot P(B \\mid A) = ${h(x)} \\cdot ${ans.toLatex()} = ${h(y)}$, which is $P(A \\cap B)$. The answer lies between $0$ and $1$, as $P(A \\cap B)$ is less than $P(A)$.`,
                  `乘回去：$P(A) \\cdot P(B \\mid A) = ${h(x)} \\cdot ${ans.toLatex()} = ${h(y)}$，正是 $P(A \\cap B)$。因为 $P(A \\cap B)$ 小于 $P(A)$，答案在 $0$ 与 $1$ 之间。`,
                ),
              ),
            ),
          }),
          solutionFigures: [pathTree(h(x), h(100 - x), "?", "", h(y))],
        };
      },
    },
    {
      id: "drawing-without-replacement",
      title: t("Drawing without replacement", "不放回地抽取"),
      explanation: t(
        `When objects are drawn **without replacement**, the second draw depends on the first: the object taken out is not there for the second draw. So the probability of the second draw is a conditional probability, counted among what is left.

A bag holds $5$ red and $3$ blue marbles, and two are taken out one after the other. The first is red with probability $\\frac{5}{8}$. Given that it was red, $7$ marbles are left and $4$ of them are red, so the second is red with probability $\\frac{4}{7}$. On the tree, every branch of the second stage is counted out of $7$:

{{figure 0}}

$$P(\\text{both red}) = \\frac{5}{8} \\cdot \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}.$$

> **Watch out.** After the first draw, both counts change: one object fewer in all ($7$, not $8$), and one fewer of the color drawn ($4$ red, not $5$). Keeping $\\frac{5}{8}$ for the second draw treats it as if the marble were put back.`,
        `**不放回**地抽取时，第二次抽取依赖于第一次：取出的那个不会再参与第二次抽取。所以第二次的概率是一个条件概率，要在剩下的物品中计算。

袋子里有 $5$ 颗红弹珠和 $3$ 颗蓝弹珠，依次取出两颗。第一颗是红色的概率是 $\\frac{5}{8}$。在第一颗是红色的条件下，还剩 $7$ 颗，其中 $4$ 颗红色，所以第二颗是红色的概率是 $\\frac{4}{7}$。在树状图上，第二层的每一段都以 $7$ 为分母：

{{figure 0}}

$$P(\\text{两颗都是红色}) = \\frac{5}{8} \\cdot \\frac{4}{7} = \\frac{20}{56} = \\frac{5}{14}.$$

> **注意。** 第一次取出后，两个数都变了：总数少一个（$7$ 而不是 $8$），取出的那种颜色也少一个（$4$ 颗红色而不是 $5$ 颗）。第二次仍用 $\\frac{5}{8}$，就相当于把弹珠放了回去。`,
      ),
      figures: [
        bagTree(bags[0]!, 5, 3, { tone: either(onPaths([[0, 0]]), () => "accent") }, t("Marked: the path R then R.", "标出：路径 R、R。")),
      ],
      generate(rng) {
        const bag = rng.pick(bags);
        const x = rng.int(2, 9);
        const y = rng.int(2, 9);
        const n = x + y;
        const first = rng.bool() ? 0 : 1;
        const second = rng.bool(0.6) ? first : 1 - first;
        const k = [x, y];
        const a = k[first]!;
        const b = second === first ? a - 1 : k[second]!;
        const ans = Q.of(a * b, n * (n - 1));
        const col = [bag.x, bag.y];
        const what =
          first === second
            ? t(`both are ${col[first]!.en}`, `两次都取到${col[first]!["zh-CN"]}`)
            : t(
                `the first is ${col[first]!.en} and the second is ${col[second]!.en}`,
                `第一次取到${col[first]!["zh-CN"]}、第二次取到${col[second]!["zh-CN"]}`,
              );
        const work = steps(`${fr(a, n)} \\cdot ${fr(b, n - 1)} = ${ratioL(a * b, n * (n - 1))}`);
        const [X, Y] = bag.letters;
        const L = [X, Y];
        const after =
          second === first
            ? t(
                `one ${col[first]!.en} object is gone, so $${b}$ of the $${n - 1}$ left ${b === 1 ? "is" : "are"} ${col[second]!.en}`,
                `少了一个${col[first]!["zh-CN"]}的，剩下的 $${n - 1}$ 个中有 $${b}$ 个是${col[second]!["zh-CN"]}`,
              )
            : t(
                `the $${b}$ ${col[second]!.en} objects are all still there, among $${n - 1}$ left`,
                `${col[second]!["zh-CN"]}的 $${b}$ 个都还在，共剩 $${n - 1}$ 个`,
              );
        const total = x * (x - 1) + 2 * x * y + y * (y - 1);
        return {
          ...numberProblem({
            prompt: t(
              `${bag.setup(x, y).en} ${bag.two.en} What is the probability that ${what.en}?${simplest.en}`,
              `${bag.setup(x, y)["zh-CN"]}${bag.two["zh-CN"]}求${what["zh-CN"]}的概率。${simplest["zh-CN"]}`,
            ),
            answer: ans,
            wrong: [Q.of(a * k[second]!, n * n), Q.of(a * b, n * n), Q.of(a * b, n * (n + 1)), Q.of(b, n - 1)],
            solution: para(
              step(
                1,
                "the first draw",
                "第一次抽取",
                t(
                  `$${a}$ of the $${n}$ objects are ${col[first]!.en}, so the first draw gives ${col[first]!.en} with probability $${fr(a, n)}$.`,
                  `$${n}$ 个中有 $${a}$ 个是${col[first]!["zh-CN"]}，所以第一次取到${col[first]!["zh-CN"]}的概率是 $${fr(a, n)}$。`,
                ),
              ),
              step(
                2,
                "the second draw, given the first",
                "在第一次的条件下的第二次抽取",
                t(
                  `The object drawn is not put back: ${after.en}. So the second branch of the path ${L[first]}, ${L[second]} has probability $${fr(b, n - 1)}$:`,
                  `取出的不放回：${after["zh-CN"]}。所以路径 ${L[first]}、${L[second]} 的第二段概率是 $${fr(b, n - 1)}$：`,
                ),
              ),
              figureLine(0),
              step(3, "multiply along the path", "沿路径相乘", t(`By the multiplication law:${work}`, `由乘法公式：${work}`)),
              check(
                t(
                  `The four paths of the tree cover every outcome, so their numerators over $${n} \\cdot ${n - 1} = ${n * (n - 1)}$ must add up to it: $${x} \\cdot ${x - 1} + ${x} \\cdot ${y} + ${y} \\cdot ${x} + ${y} \\cdot ${y - 1} = ${total}$. They do, and our path is $${a * b}$ of these $${n * (n - 1)}$.`,
                  `树状图的四条路径包括了所有结果，所以它们以 $${n} \\cdot ${n - 1} = ${n * (n - 1)}$ 为分母的分子之和应当等于它：$${x} \\cdot ${x - 1} + ${x} \\cdot ${y} + ${y} \\cdot ${x} + ${y} \\cdot ${y - 1} = ${total}$。确实如此，我们的路径占其中的 $${a * b}$。`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            bagTree(
              bag,
              x,
              y,
              {
                tone: either(onPaths([[first, second]]), () => "accent"),
                leaf: (p) => (samePath(p, [first, second]) ? `${a * b}/${n * (n - 1)}` : ""),
              },
              t(`Marked: the path ${L[first]} then ${L[second]}.`, `标出：路径 ${L[first]}、${L[second]}。`),
            ),
          ],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// The law of total probability

/** Split is a situation with a first event A of probability p% and a second event with probabilities x% given A and y% given not A. */
interface Split {
  readonly intro: (p: number, x: number, y: number) => Text;
  readonly ask: Text;
  readonly askBack: Text;
  readonly a: Text;
  readonly notA: Text;
  /** b names the second event: "faulty". */
  readonly b: Text;
}

const splits: readonly Split[] = [
  {
    intro: (p, x, y) =>
      t(
        `Machine A makes ${p}% of a factory's light bulbs and machine B makes the rest. ${x}% of the bulbs from machine A and ${y}% of the bulbs from machine B are faulty.`,
        `某工厂的灯泡中 ${p}% 由机器 A 生产，其余由机器 B 生产。机器 A 生产的灯泡有 ${x}% 是次品，机器 B 生产的有 ${y}% 是次品。`,
      ),
    ask: t("A bulb is chosen at random. What is the probability that it is faulty?", "随机抽取一个灯泡，求它是次品的概率。"),
    askBack: t(
      "A bulb chosen at random is faulty. What is the probability that it was made by machine A?",
      "随机抽取的一个灯泡是次品，求它由机器 A 生产的概率。",
    ),
    a: t("made by A", "由 A 生产"),
    notA: t("made by B", "由 B 生产"),
    b: t("faulty", "是次品"),
  },
  {
    intro: (p, x, y) =>
      t(
        `${p}% of the people in a town have a certain illness. A test is positive for ${x}% of the people who have the illness and for ${y}% of the people who do not.`,
        `某镇 ${p}% 的人患有某种疾病。患病的人检测结果为阳性的比例是 ${x}%，未患病的人是 ${y}%。`,
      ),
    ask: t(
      "A person from the town is chosen at random and tested. What is the probability that the test is positive?",
      "从该镇随机选一人检测，求结果为阳性的概率。",
    ),
    askBack: t(
      "A person chosen at random from the town tests positive. What is the probability that the person has the illness?",
      "从该镇随机选出的一人检测结果为阳性，求此人患病的概率。",
    ),
    a: t("ill", "患病"),
    notA: t("not ill", "未患病"),
    b: t("positive", "检测为阳性"),
  },
  {
    intro: (p, x, y) =>
      t(
        `There is a ${p}% chance of rain tomorrow. If it rains, the chance that Ana is late for school is ${x}%; if it does not rain, the chance is ${y}%.`,
        `明天下雨的概率是 ${p}%。如果下雨，安娜上学迟到的概率是 ${x}%；如果不下雨，迟到的概率是 ${y}%。`,
      ),
    ask: t("What is the probability that Ana is late tomorrow?", "求安娜明天迟到的概率。"),
    askBack: t("Ana is late tomorrow. What is the probability that it rained?", "已知安娜明天迟到了，求明天下雨的概率。"),
    a: t("rain", "下雨"),
    notA: t("no rain", "不下雨"),
    b: t("late", "迟到"),
  },
];

/** splitValues draws p, x and y in percent, multiples of 5, with x > y. */
function splitValues(rng: Rng): [number, number, number] {
  const p = 5 * rng.int(2, 14);
  const x = 5 * rng.int(8, 19);
  const y = 5 * rng.int(1, 6);
  return [p, x, y];
}

/**
 * splitTree draws the tree of A or A′ and then B or B′, with the probabilities p of A, x of B given A and y of B given A′,
 * the paths in which B happens marked and, after them, their probabilities.
 */
function splitTree(
  p: string,
  np: string,
  x: string,
  nx: string,
  y: string,
  ny: string,
  leaves: readonly [string, string],
  paths: readonly Path[] = [
    [0, 0],
    [1, 0],
  ],
): Figure {
  return treeFigure(
    [
      { label: "A", p },
      { label: "A'", p: np },
    ],
    [
      [
        { label: "B", p: x },
        { label: "B'", p: nx },
      ],
      [
        { label: "B", p: y },
        { label: "B'", p: ny },
      ],
    ],
    {
      tone: either(onPaths(paths), () => "accent"),
      leaf: (path) => (samePath(path, [0, 0]) ? leaves[0] : samePath(path, [1, 0]) ? leaves[1] : ""),
    },
    t(
      `Marked: the paths that end in B, with probabilities ${leaves[0]} and ${leaves[1]}.`,
      `标出：以 B 结尾的路径，概率分别为 ${leaves[0]} 和 ${leaves[1]}。`,
    ),
  );
}

/** totalSolution is the solution of a total probability from p, x and y in hundredths of the first event and the two conditionals. */
function totalSolution(p: number, x: number, y: number, cases: Text, names: Text): Text {
  const ans = Q.of(p * x + (100 - p) * y, 10000);
  const notB = Q.one.sub(ans);
  const [d1, d2] = [dec(Q.of(p * x, 10000)), dec(Q.of((100 - p) * y, 10000))];
  const [e1, e2] = [dec(Q.of(p * (100 - x), 10000)), dec(Q.of((100 - p) * (100 - y), 10000))];
  const work = steps(
    `P(B) = P(A) \\cdot P(B \\mid A) + P(A') \\cdot P(B \\mid A') = ${h(p)} \\cdot ${h(x)} + ${h(100 - p)} \\cdot ${h(y)} = ${d1} + ${d2} = ${dec(ans)}`,
  );
  const [lo, hi] = x < y ? [x, y] : [y, x];
  return para(
    step(
      1,
      "split into cases",
      "分成两种情况",
      t(
        `${names.en}Every outcome is in $A$ or in $A'$${cases.en}, with $P(A) = ${h(p)}$ and $P(A') = 1 - ${h(p)} = ${h(100 - p)}$. So $B$ happens along two paths of the tree, one through each case:`,
        `${names["zh-CN"]}每个结果不在 $A$ 中就在 $A'$ 中${cases["zh-CN"]}，$P(A) = ${h(p)}$，$P(A') = 1 - ${h(p)} = ${h(100 - p)}$。所以 $B$ 沿树状图的两条路径发生，每种情况各一条：`,
      ),
    ),
    figureLine(0),
    step(
      2,
      "multiply along each path and add",
      "每条路径相乘，再相加",
      t(
        `Each path is found with the multiplication law, and the two paths do not overlap, so their probabilities add:${work}`,
        `每条路径用乘法公式求出，两条路径互不重叠，所以概率相加：${work}`,
      ),
    ),
    check(
      t(
        `The other two paths end in $B'$: $${h(p)} \\cdot ${h(100 - x)} + ${h(100 - p)} \\cdot ${h(100 - y)} = ${e1} + ${e2} = ${dec(notB)}$, and $${dec(ans)} + ${dec(notB)} = 1$. The answer also lies between the two conditional probabilities $${h(lo)}$ and $${h(hi)}$, as a mixture of the two cases must.`,
        `另外两条路径以 $B'$ 结尾：$${h(p)} \\cdot ${h(100 - x)} + ${h(100 - p)} \\cdot ${h(100 - y)} = ${e1} + ${e2} = ${dec(notB)}$，而 $${dec(ans)} + ${dec(notB)} = 1$。答案还在两个条件概率 $${h(lo)}$ 与 $${h(hi)}$ 之间，两种情况混合起来本应如此。`,
      ),
    ),
  );
}

/** totalFigure is the tree of a total probability from p, x and y in hundredths, the paths of B marked. */
const totalFigure = (p: number, x: number, y: number) =>
  splitTree(h(p), h(100 - p), h(x), h(100 - x), h(y), h(100 - y), [dec(Q.of(p * x, 10000)), dec(Q.of((100 - p) * y, 10000))]);

/** The law of total probability (Geometry 6.18.4). */
export const theLawOfTotalProbability: TopicDef = {
  id: "the-law-of-total-probability",
  title: t("The Law of Total Probability", "全概率公式"),
  summary: t(
    "Find the probability of an event by splitting it according to whether another event happens: P(B) = P(A)P(B | A) + P(A')P(B | A').",
    "按另一个事件是否发生把事件分成两部分求概率：P(B) = P(A)P(B | A) + P(A')P(B | A')。",
  ),
  prerequisites: ["the-multiplication-law-for-conditional-probability", "adding-and-subtracting-fractions", "percents"],
  encompasses: [
    { topic: "the-multiplication-law-for-conditional-probability", weight: 0.6 },
    { topic: "decimal-arithmetic", weight: 0.3 },
    { topic: "percents", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.B.8"],
  intro: t(
    `The multiplication law gives the probability of one path through a tree: first $A$, then $B$ given $A$. Sometimes an event can be reached along several paths, and we want its probability in all.

A fair coin is tossed to choose a box. Box 1 holds $3$ red and $2$ white balls, box 2 holds $1$ red and $4$ white, and a ball is then taken from the chosen box. A red ball can come from either box:

{{figure 0}}

Through box 1 the probability is $\\frac{1}{2} \\cdot \\frac{3}{5} = \\frac{3}{10}$, and through box 2 it is $\\frac{1}{2} \\cdot \\frac{1}{5} = \\frac{1}{10}$. The two paths cannot both happen, so their probabilities add: $P(\\text{red}) = \\frac{3}{10} + \\frac{1}{10} = \\frac{2}{5}$.

Splitting an event by the cases of another event and adding the paths is the **law of total probability**. In this lesson we use it with probabilities given as decimals and in situations described in words.`,
    `乘法公式给出树状图上一条路径的概率：先 $A$，再在 $A$ 的条件下 $B$。有时一个事件可以沿几条路径发生，我们要求它总的概率。

抛一枚均匀的硬币来选盒子。盒子 1 里有 $3$ 个红球、$2$ 个白球，盒子 2 里有 $1$ 个红球、$4$ 个白球，然后从选中的盒子里取一个球。红球可能来自任何一个盒子：

{{figure 0}}

经过盒子 1 的概率是 $\\frac{1}{2} \\cdot \\frac{3}{5} = \\frac{3}{10}$，经过盒子 2 的概率是 $\\frac{1}{2} \\cdot \\frac{1}{5} = \\frac{1}{10}$。两条路径不会同时发生，所以概率相加：$P(\\text{红}) = \\frac{3}{10} + \\frac{1}{10} = \\frac{2}{5}$。

按另一个事件的各种情况把事件分开、再把路径相加，就是**全概率公式**。这节课我们在概率用小数给出的情形和用文字描述的实际问题中使用它。`,
  ),
  introFigures: [
    treeFigure(
      [
        { label: "1", p: "1/2" },
        { label: "2", p: "1/2" },
      ],
      [
        [
          { label: "R", p: "3/5" },
          { label: "W", p: "2/5" },
        ],
        [
          { label: "R", p: "1/5" },
          { label: "W", p: "4/5" },
        ],
      ],
      {
        tone: either(
          onPaths([
            [0, 0],
            [1, 0],
          ]),
          () => "accent",
        ),
        leaf: (path) => (samePath(path, [0, 0]) ? "3/10" : samePath(path, [1, 0]) ? "1/10" : ""),
      },
      t("Marked: the two paths to a red ball, with probabilities 3/10 and 1/10.", "标出：取到红球的两条路径，概率分别为 3/10 和 1/10。"),
    ),
  ],
  knowledgePoints: [
    {
      id: "total-probability",
      title: t("Splitting an event in two", "把事件分成两部分"),
      explanation: t(
        `Every outcome is either in $A$ or in $A'$, so $B$ splits into the two parts $A \\cap B$ and $A' \\cap B$, which do not overlap. Adding their probabilities, each found with the multiplication law, gives the **law of total probability**:

$$P(B) = P(A) \\cdot P(B \\mid A) + P(A') \\cdot P(B \\mid A').$$

If $P(A) = 0.3$, $P(B \\mid A) = 0.6$ and $P(B \\mid A') = 0.2$, then $P(A') = 1 - 0.3 = 0.7$, and the two paths that end in $B$ are

{{figure 0}}

$$P(B) = 0.3 \\cdot 0.6 + 0.7 \\cdot 0.2 = 0.18 + 0.14 = 0.32.$$

> **Watch out.** Each conditional probability is weighted by the probability of its own case: the second path starts with $P(A') = 0.7$, not with $P(A) = 0.3$, and it continues with $P(B \\mid A') = 0.2$, not with its complement $0.8$. Adding $0.6 + 0.2$ without the weights, or keeping only the first path, misses that.`,
        `每个结果不是在 $A$ 中就是在 $A'$ 中，所以 $B$ 分成互不重叠的两部分 $A \\cap B$ 和 $A' \\cap B$。用乘法公式分别求出它们的概率再相加，就得到**全概率公式**：

$$P(B) = P(A) \\cdot P(B \\mid A) + P(A') \\cdot P(B \\mid A').$$

若 $P(A) = 0.3$，$P(B \\mid A) = 0.6$，$P(B \\mid A') = 0.2$，则 $P(A') = 1 - 0.3 = 0.7$，以 $B$ 结尾的两条路径是

{{figure 0}}

$$P(B) = 0.3 \\cdot 0.6 + 0.7 \\cdot 0.2 = 0.18 + 0.14 = 0.32.$$

> **注意。** 每个条件概率都要乘它自己那种情况的概率：第二条路径从 $P(A') = 0.7$ 开始，而不是 $P(A) = 0.3$；接着是 $P(B \\mid A') = 0.2$，而不是它的对立值 $0.8$。不加权直接算 $0.6 + 0.2$，或只算第一条路径，都会出错。`,
      ),
      figures: [totalFigure(30, 60, 20)],
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        let c = rng.int(1, 9);
        if (c === b) c = c === 9 ? 1 : c + 1;
        const ans = Q.of(a * b + (10 - a) * c, 100);
        return {
          ...numberProblem({
            prompt: t(
              `For two events $A$ and $B$, $P(A) = ${h(10 * a)}$, $P(B \\mid A) = ${h(10 * b)}$ and $P(B \\mid A') = ${h(10 * c)}$. Find $P(B)$.${asDecimal.en}`,
              `对两个事件 $A$ 和 $B$，$P(A) = ${h(10 * a)}$，$P(B \\mid A) = ${h(10 * b)}$，$P(B \\mid A') = ${h(10 * c)}$。求 $P(B)$。${asDecimal["zh-CN"]}`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: [
              why(
                Q.of(a * b, 100),
                "That counts only the first case. Add the probability of every path that ends in the event.",
                "这只算了第一种情况。要把所有通向该事件的路径的概率相加。",
              ),
              why(
                Q.of(a * b + a * c, 100),
                "You used the same first probability on both paths. The second path starts with the complement.",
                "你在两条路径上用了同一个起始概率。第二条路径应从它的对立事件开始。",
              ),
              why(
                Q.of(b + c, 10),
                "You added the conditional probabilities. Weight each by the probability of its case first.",
                "你直接把条件概率相加了。应先用每种情况的概率给它们加权。",
              ),
              why(
                Q.of(a * b + (10 - a) * (10 - c), 100),
                "On the second path you used the complement of the conditional probability. Use the probability of the event itself in that case.",
                "在第二条路径上你用了条件概率的对立值。应使用这种情况下该事件本身的概率。",
              ),
            ],
            solution: totalSolution(10 * a, 10 * b, 10 * c, t("", ""), t("", "")),
          }),
          solutionFigures: [totalFigure(10 * a, 10 * b, 10 * c)],
        };
      },
    },
    {
      id: "total-probability-in-context",
      title: t("Total probability in context", "实际问题中的全概率"),
      explanation: t(
        `In a word problem, find the two cases first: they are the first event and its complement, and their probabilities add up to $1$. Then find the probability of the event in each case, and weight it by the probability of the case.

Machine A makes $60\\%$ of a factory's bulbs and machine B the other $40\\%$; $2\\%$ of A's bulbs and $5\\%$ of B's are faulty. A random bulb comes from A or from B, so

$$P(\\text{faulty}) = 0.6 \\cdot 0.02 + 0.4 \\cdot 0.05 = 0.012 + 0.02 = 0.032.$$

Write each percent as a decimal before multiplying. The answer, $3.2\\%$, lies between the two rates $2\\%$ and $5\\%$, closer to the rate of the bigger group.

> **Watch out.** Do not average the two rates, $\\frac{2\\% + 5\\%}{2} = 3.5\\%$: that treats the two groups as equally large. Weight each rate by the share of its own group, and keep each rate with its own group rather than swapping them.`,
        `在应用题中，先找出两种情况：第一个事件和它的对立事件，它们的概率之和为 $1$。再找出每种情况下所求事件的概率，并乘以这种情况的概率。

机器 A 生产某工厂 $60\\%$ 的灯泡，机器 B 生产另外 $40\\%$；A 生产的有 $2\\%$ 是次品，B 生产的有 $5\\%$ 是次品。随机一个灯泡不是 A 生产就是 B 生产，所以

$$P(\\text{次品}) = 0.6 \\cdot 0.02 + 0.4 \\cdot 0.05 = 0.012 + 0.02 = 0.032.$$

相乘之前先把百分数写成小数。答案 $3.2\\%$ 在两个比率 $2\\%$ 与 $5\\%$ 之间，更靠近较大那一组的比率。

> **注意。** 不要把两个比率直接平均，$\\frac{2\\% + 5\\%}{2} = 3.5\\%$：那相当于认为两组一样大。每个比率要乘它自己那一组所占的比例，也不要把两组的比率弄反。`,
      ),
      generate(rng) {
        const s = rng.pick(splits);
        const [p, x, y] = splitValues(rng);
        const ans = Q.of(p * x + (100 - p) * y, 10000);
        return {
          ...numberProblem({
            prompt: t(
              `${s.intro(p, x, y).en} ${s.ask.en}${asDecimal.en}`,
              `${s.intro(p, x, y)["zh-CN"]}${s.ask["zh-CN"]}${asDecimal["zh-CN"]}`,
            ),
            answer: ans,
            form: "decimal",
            mistakes: [
              why(
                Q.of(p * x, 10000),
                "That counts only one group. Add the contribution of the other group too.",
                "这只算了一组，还要加上另一组的部分。",
              ),
              why(
                Q.of(x + y, 200),
                "You averaged the two rates as if the groups were the same size. Weight each rate by the share of its group.",
                "你把两个比率直接平均了，好像两组一样大。应按每组所占比例加权。",
              ),
              why(
                Q.of(x + y, 100),
                "You added the rates. Weight each by the share of its group first.",
                "你把比率直接相加了。应先按每组所占比例加权。",
              ),
              why(
                Q.of(p * y + (100 - p) * x, 10000),
                "You swapped the rates between the groups. Match each rate with its own group.",
                "你把两组的比率弄反了。每个比率要配它自己的组。",
              ),
            ],
            solution: totalSolution(
              p,
              x,
              y,
              t(` (${s.a.en} or ${s.notA.en})`, `（${s.a["zh-CN"]}或${s.notA["zh-CN"]}）`),
              t(
                `Let $A$ be the case "${s.a.en}" and $B$ the event "${s.b.en}", and write the percents as decimals. `,
                `设 $A$ 为“${s.a["zh-CN"]}”，$B$ 为“${s.b["zh-CN"]}”，把百分数写成小数。`,
              ),
            ),
          }),
          solutionFigures: [totalFigure(p, x, y)],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Tree diagrams for dependent events

/** branchPath is the path of branch i of a two-stage tree listed as A, A′, B after A, B′ after A, B after A′, B′ after A′. */
const branchPath = (i: number): Path => (i < 2 ? [i] : [(i - 2) >> 1, i & 1]);

/** abTree draws the tree of A and B with six branch probabilities, in the order of branchPath, and marks when given. */
function abTree(lab: readonly string[], marks?: TreeMarks, note?: Text): Figure {
  return treeFigure(
    [
      { label: "A", p: lab[0]! },
      { label: "A′", p: lab[1]! },
    ],
    [
      [
        { label: "B", p: lab[2]! },
        { label: "B′", p: lab[3]! },
      ],
      [
        { label: "B", p: lab[4]! },
        { label: "B′", p: lab[5]! },
      ],
    ],
    marks,
    note,
  );
}

/** pathFr writes the probability of the path of two draws, a of n and then b of n − 1, as a fraction over n(n − 1). */
const pathFr = (a: number, b: number, n: number) => `${a * b}/${n * (n - 1)}`;

/** Tree diagrams for dependent events (Geometry 6.18.5). */
export const treeDiagramsForDependentEvents: TopicDef = {
  id: "tree-diagrams-for-dependent-events",
  title: t("Tree Diagrams for Dependent Events", "相关事件的树状图"),
  summary: t(
    "Read and complete tree diagrams whose second-stage probabilities depend on the first stage, multiplying along paths and adding paths.",
    "读懂并补全第二阶段概率依赖于第一阶段的树状图：沿路径相乘，不同路径相加。",
  ),
  prerequisites: ["the-law-of-total-probability"],
  encompasses: [
    { topic: "the-law-of-total-probability", weight: 0.3 },
    { topic: "the-multiplication-law-for-conditional-probability", weight: 0.5 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.B.8"],
  intro: t(
    `The multiplication law and the law of total probability both follow paths through a tree. A tree diagram puts every path of a process in one picture, so we can read off any of them.

A box holds $4$ green and $2$ yellow counters, and two are taken out without replacement. The first draw has two branches, $\\frac{4}{6}$ and $\\frac{2}{6}$. After a green counter, $3$ green and $2$ yellow are left among $5$; after a yellow one, $4$ green and $1$ yellow. Multiplying along each path gives the number at its end:

{{figure 0}}

The four paths are all the ways the two draws can go, so they add up to $1$: $\\frac{12}{30} + \\frac{8}{30} + \\frac{8}{30} + \\frac{2}{30} = \\frac{30}{30}$. In this lesson we complete trees with a missing branch, find the probability of one path, and add the paths that make up an event.`,
    `乘法公式和全概率公式都是沿树状图的路径计算的。树状图把一个过程的所有路径画在一张图里，任何一条都能直接读出来。

盒子里有 $4$ 个绿色筹码和 $2$ 个黄色筹码，不放回地取出两个。第一次抽取有两个分支：$\\frac{4}{6}$ 和 $\\frac{2}{6}$。取出绿色的之后，剩下 $5$ 个中有 $3$ 个绿色、$2$ 个黄色；取出黄色的之后，剩下 $4$ 个绿色、$1$ 个黄色。沿每条路径相乘，得到它末端的数：

{{figure 0}}

这四条路径是两次抽取的所有可能，所以它们之和为 $1$：$\\frac{12}{30} + \\frac{8}{30} + \\frac{8}{30} + \\frac{2}{30} = \\frac{30}{30}$。这节课我们补全缺一个分支的树状图，求一条路径的概率，再把组成一个事件的路径相加。`,
  ),
  introFigures: [
    bagTree(
      bags[2]!,
      4,
      2,
      { leaf: (p) => ["12/30", "8/30", "8/30", "2/30"][2 * p[0]! + p[1]!]! },
      t("At the ends of the paths: 12/30, 8/30, 8/30 and 2/30.", "各路径末端：12/30、8/30、8/30 和 2/30。"),
    ),
  ],
  knowledgePoints: [
    {
      id: "completing-a-tree",
      title: t("Completing a tree diagram", "补全树状图"),
      explanation: t(
        `A **tree diagram** shows a process in stages. Each branch carries a probability; the branches of the second stage carry conditional probabilities, such as $P(B \\mid A)$ on the branch to $B$ after $A$.

The branches leaving one point cover every possibility and do not overlap, so their probabilities **add up to $1$**. Here the branches after $A$ are $B$ with $0.35$ and $B'$ with an unknown probability:

{{figure 0}}

That probability is $1 - 0.35 = 0.65$. The branches after $A'$, $0.7$ and $0.3$, add up to $1$ on their own, and so do the two first branches, $0.4$ and $0.6$.

> **Watch out.** Only the branches that leave the **same point** add up to $1$. The missing $P(B' \\mid A)$ pairs with $P(B \\mid A) = 0.35$, not with $0.7$ on the branch after $A'$, and it is not equal to its partner $0.35$ either.`,
        `**树状图**把一个过程分阶段画出来。每条分支上标有概率；第二阶段的分支上是条件概率，例如 $A$ 之后通向 $B$ 的分支上是 $P(B \\mid A)$。

从同一点出发的各分支包含了所有可能且互不重叠，所以它们的概率**之和为 $1$**。这里 $A$ 之后的分支是概率为 $0.35$ 的 $B$ 和概率未知的 $B'$：

{{figure 0}}

这个概率是 $1 - 0.35 = 0.65$。$A'$ 之后的分支 $0.7$ 和 $0.3$ 自己相加为 $1$，第一层的两个分支 $0.4$ 和 $0.6$ 也是如此。

> **注意。** 只有从**同一点**出发的分支之和为 $1$。缺少的 $P(B' \\mid A)$ 要和 $P(B \\mid A) = 0.35$ 配对，而不是和 $A'$ 之后那条分支上的 $0.7$ 配对；它也不等于同伴 $0.35$。`,
      ),
      figures: [
        abTree(
          ["0.4", "0.6", "0.35", "?", "0.7", "0.3"],
          { tone: (p) => (samePath(p, [0, 1]) ? "result" : samePath(p, [0, 0]) ? "action" : undefined) },
          t("Marked: the missing branch after A and the branch beside it.", "标出：A 之后缺少的分支和它旁边的分支。"),
        ),
      ],
      generate(rng) {
        const pa = 5 * rng.int(2, 18);
        const pb = 5 * rng.int(1, 19);
        let pc = 5 * rng.int(1, 19);
        if (pc === pb) pc = pc === 95 ? 5 : pc + 5;
        const values = [pa, 100 - pa, pb, 100 - pb, pc, 100 - pc];
        const miss = rng.int(0, 5);
        const lab = (i: number) => (i === miss ? "?" : h(values[i]!));
        const fig = treeFigure(
          [
            { label: "A", p: lab(0) },
            { label: "A′", p: lab(1) },
          ],
          [
            [
              { label: "B", p: lab(2) },
              { label: "B′", p: lab(3) },
            ],
            [
              { label: "B", p: lab(4) },
              { label: "B′", p: lab(5) },
            ],
          ],
        );
        const sib = miss ^ 1;
        const ans = Q.of(values[miss]!, 100);
        const names = ["A", "A'", "B \\mid A", "B' \\mid A", "B \\mid A'", "B' \\mid A'"];
        const where =
          miss < 2 ? t("the start of the tree", "树的起点") : t(`the point $${miss < 4 ? "A" : "A'"}$`, `点 $${miss < 4 ? "A" : "A'"}$`);
        const paths = [
          [0, 2],
          [0, 3],
          [1, 4],
          [1, 5],
        ].map(([i, j]) => values[i!]! * values[j!]!);
        const pathL = [
          [0, 2],
          [0, 3],
          [1, 4],
          [1, 5],
        ]
          .map(([i, j]) => `${h(values[i!]!)} \\cdot ${h(values[j!]!)}`)
          .join(" + ");
        return {
          ...numberProblem({
            prompt: t(
              "The tree diagram shows the probabilities of events $A$ and $B$. What is the missing probability?",
              "树状图给出了事件 $A$ 和 $B$ 的概率。缺少的概率是多少？",
            ),
            answer: ans,
            form: "decimal",
            wrong: [values[sib]!, values[(miss + 2) % 6]!, 100 - values[(miss + 2) % 6]!]
              .filter((v) => v !== values[miss])
              .map((v) => Q.of(v, 100)),
            solution: para(
              step(
                1,
                "find the branch beside it",
                "找出旁边的分支",
                t(
                  `The missing branch is $P(${names[miss]})$. It leaves ${where.en} together with one other branch, $P(${names[sib]}) = ${h(values[sib]!)}$:`,
                  `缺少的分支是 $P(${names[miss]})$。从${where["zh-CN"]}出发的还有另一个分支 $P(${names[sib]}) = ${h(values[sib]!)}$：`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "subtract from 1",
                "用 1 去减",
                t(
                  `The branches leaving one point add up to $1$:${steps(`P(${names[miss]}) = 1 - ${h(values[sib]!)} = ${h(values[miss]!)}`)}`,
                  `从同一点出发的分支之和为 $1$：${steps(`P(${names[miss]}) = 1 - ${h(values[sib]!)} = ${h(values[miss]!)}`)}`,
                ),
              ),
              check(
                t(
                  `With the gap filled, the four paths of the tree add up to $1$: $${pathL} = ${paths.map((v) => dec(Q.of(v, 10000))).join(" + ")} = 1$.`,
                  `补上之后，树状图的四条路径之和为 $1$：$${pathL} = ${paths.map((v) => dec(Q.of(v, 10000))).join(" + ")} = 1$。`,
                ),
              ),
            ),
          }),
          figure: fig,
          solutionFigures: [
            abTree(
              values.map((v) => h(v)),
              {
                tone: (p) => (samePath(p, branchPath(miss)) ? "result" : samePath(p, branchPath(sib)) ? "action" : undefined),
              },
              t(
                `Marked: the missing branch, ${h(values[miss]!)}, and the branch beside it, ${h(values[sib]!)}.`,
                `标出：缺少的分支 ${h(values[miss]!)} 和它旁边的分支 ${h(values[sib]!)}。`,
              ),
            ),
          ],
        };
      },
    },
    {
      id: "probability-of-a-path",
      title: t("The probability of a path", "一条路径的概率"),
      explanation: t(
        `Each path from the start to an end is one outcome of the whole process. By the multiplication law, its probability is the **product of the probabilities along the path**.

A bag holds $5$ red and $3$ blue marbles, and two are drawn without replacement. In its tree, the path "red, then blue" carries $\\frac{5}{8}$ and then $\\frac{3}{7}$: after a red one, $3$ of the $7$ marbles left are blue.

{{figure 0}}

$$P(R \\text{ then } B) = \\frac{5}{8} \\cdot \\frac{3}{7} = \\frac{15}{56}.$$

> **Watch out.** Multiply along a path; do not add the two branches, and do not stop at the second branch, $\\frac{3}{7}$, which is only the probability given the first draw. The second branch is out of $7$, not $8$: one marble has already gone.`,
        `从起点到终点的每一条路径是整个过程的一种结果。由乘法公式，它的概率是**路径上各概率的乘积**。

袋子里有 $5$ 颗红弹珠和 $3$ 颗蓝弹珠，不放回地取两颗。在树状图中，“先红后蓝”这条路径上依次是 $\\frac{5}{8}$ 和 $\\frac{3}{7}$：取出一颗红的后，剩下 $7$ 颗中有 $3$ 颗蓝的。

{{figure 0}}

$$P(\\text{先 } R \\text{ 后 } B) = \\frac{5}{8} \\cdot \\frac{3}{7} = \\frac{15}{56}.$$

> **注意。** 沿路径要相乘；不要把两段相加，也不要停在第二段的 $\\frac{3}{7}$，它只是在第一次结果已知时的概率。第二段的分母是 $7$ 而不是 $8$：已经取走了一颗。`,
      ),
      figures: [
        bagTree(
          bags[0]!,
          5,
          3,
          { tone: onPaths([[0, 1]]), leaf: (p) => (samePath(p, [0, 1]) ? "15/56" : "") },
          t("Marked: the path R then B, with probability 15/56.", "标出：路径 R、B，概率为 15/56。"),
        ),
      ],
      generate(rng) {
        const bag = rng.pick(bags);
        const x = rng.int(2, 9);
        const y = rng.int(2, 9);
        const n = x + y;
        const first = rng.int(0, 1);
        const second = rng.int(0, 1);
        const k = [x, y];
        const a = k[first]!;
        const b = second === first ? a - 1 : k[second]!;
        const col = [bag.x, bag.y];
        const d = n * (n - 1);
        const work = steps(`${fr(a, n)} \\cdot ${fr(b, n - 1)} = ${ratioL(a * b, d)}`);
        const L = bag.letters;
        const rest = n - 1 - b;
        return {
          ...numberProblem({
            prompt: t(
              `${bag.setup(x, y).en} ${bag.two.en} The tree diagram shows the draws. What is the probability that the first is ${col[first]!.en} and the second is ${col[second]!.en}?${simplest.en}`,
              `${bag.setup(x, y)["zh-CN"]}${bag.two["zh-CN"]}树状图表示了这两次抽取。求第一次取到${col[first]!["zh-CN"]}、第二次取到${col[second]!["zh-CN"]}的概率。${simplest["zh-CN"]}`,
            ),
            answer: Q.of(a * b, d),
            wrong: [Q.of(a * b, n * n), Q.of(a + b, 2 * n - 1), Q.of(b, n - 1), Q.of(a * k[second]!, n * n)],
            solution: para(
              step(
                1,
                "follow the path",
                "找出路径",
                t(
                  `The path is ${L[first]} then ${L[second]}. Its first branch is $${fr(a, n)}$, since $${a}$ of the $${n}$ are ${col[first]!.en}. Its second branch is counted among the $${n - 1}$ left after that draw, $${b}$ of them ${col[second]!.en}: $${fr(b, n - 1)}$.`,
                  `路径是先 ${L[first]} 后 ${L[second]}。第一段是 $${fr(a, n)}$，因为 $${n}$ 个中有 $${a}$ 个是${col[first]!["zh-CN"]}。第二段要在这次抽取后剩下的 $${n - 1}$ 个中计算，其中 $${b}$ 个是${col[second]!["zh-CN"]}：$${fr(b, n - 1)}$。`,
                ),
              ),
              figureLine(0),
              step(2, "multiply along it", "沿路径相乘", t(`By the multiplication law:${work}`, `由乘法公式：${work}`)),
              check(
                t(
                  `The two paths that start with ${L[first]} must together give the first branch: $${fr(a * b, d)} + ${fr(a * rest, d)} = ${fr(a * (n - 1), d)} = ${Q.of(a, n).toLatex()}$, the probability $${fr(a, n)}$ of the first branch.`,
                  `以 ${L[first]} 开头的两条路径合起来应当等于第一段：$${fr(a * b, d)} + ${fr(a * rest, d)} = ${fr(a * (n - 1), d)} = ${Q.of(a, n).toLatex()}$，正是第一段的概率 $${fr(a, n)}$。`,
                ),
              ),
            ),
          }),
          figure: bagTree(bag, x, y),
          solutionFigures: [
            bagTree(
              bag,
              x,
              y,
              { tone: onPaths([[first, second]]), leaf: (p) => (samePath(p, [first, second]) ? pathFr(a, b, n) : "") },
              t(`Marked: the path ${L[first]} then ${L[second]}.`, `标出：路径 ${L[first]}、${L[second]}。`),
            ),
          ],
        };
      },
    },
    {
      id: "adding-paths",
      title: t("Adding paths", "路径相加"),
      explanation: t(
        `When several paths lead to the event, find the probability of each path and **add** them: different paths are different outcomes, so they do not overlap.

With $5$ red and $3$ blue marbles, the second marble is red along "red, red" and along "blue, red":

{{figure 0}}

$$P(\\text{second red}) = \\frac{5}{8} \\cdot \\frac{4}{7} + \\frac{3}{8} \\cdot \\frac{5}{7} = \\frac{20}{56} + \\frac{15}{56} = \\frac{35}{56} = \\frac{5}{8}.$$

That is the same as the chance that the first marble is red: before anything is seen, the second draw is just as likely to be red as the first.

> **Watch out.** Count every path that leads to the event; one path alone is only part of it. Paths are added, never multiplied with each other: multiplying $\\frac{20}{56} \\cdot \\frac{15}{56}$ would ask for both paths at once, which cannot happen.`,
        `当有几条路径都通向所求事件时，分别求出每条路径的概率再**相加**：不同的路径是不同的结果，互不重叠。

有 $5$ 颗红弹珠和 $3$ 颗蓝弹珠时，第二颗是红色的路径有“红、红”和“蓝、红”：

{{figure 0}}

$$P(\\text{第二颗是红色}) = \\frac{5}{8} \\cdot \\frac{4}{7} + \\frac{3}{8} \\cdot \\frac{5}{7} = \\frac{20}{56} + \\frac{15}{56} = \\frac{35}{56} = \\frac{5}{8}.$$

这和第一颗是红色的概率相同：在什么都没看到之前，第二次取到红色和第一次一样可能。

> **注意。** 要把通向该事件的每条路径都算上，只算一条只是其中一部分。路径之间要相加，不能相乘：$\\frac{20}{56} \\cdot \\frac{15}{56}$ 相当于要求两条路径同时发生，那是不可能的。`,
      ),
      figures: [
        bagTree(
          bags[0]!,
          5,
          3,
          {
            tone: onPaths([
              [0, 0],
              [1, 0],
            ]),
            leaf: (p) => (samePath(p, [0, 0]) ? "20/56" : samePath(p, [1, 0]) ? "15/56" : ""),
          },
          t("Marked: the paths R, R and B, R, with probabilities 20/56 and 15/56.", "标出：路径 R、R 与 B、R，概率分别为 20/56 和 15/56。"),
        ),
      ],
      generate(rng) {
        const bag = rng.pick(bags);
        const x = rng.int(2, 9);
        const y = rng.int(2, 9);
        const n = x + y;
        const d = n * (n - 1);
        const kind = rng.int(0, 2);
        const col = [bag.x, bag.y];
        const c = rng.int(0, 1);
        const k = [x, y];
        const what = [
          t(`the second is ${col[c]!.en}`, `第二次取到${col[c]!["zh-CN"]}`),
          t("the two have different colors", "两次取到的颜色不同"),
          t("the two have the same color", "两次取到的颜色相同"),
        ][kind]!;
        const terms: [number, number, number, number][] =
          kind === 0
            ? [
                [k[c]!, n, k[c]! - 1, n - 1],
                [k[1 - c]!, n, k[c]!, n - 1],
              ]
            : kind === 1
              ? [
                  [x, n, y, n - 1],
                  [y, n, x, n - 1],
                ]
              : [
                  [x, n, x - 1, n - 1],
                  [y, n, y - 1, n - 1],
                ];
        const nums = terms.map(([a, , b]) => a * b);
        const total = nums[0]! + nums[1]!;
        const work = steps(
          `${terms.map(([a, p, b, q]) => `${fr(a, p)} \\cdot ${fr(b, q)}`).join(" + ")} = ${nums.map((m) => fr(m, d)).join(" + ")} = ${ratioL(total, d)}`,
        );
        const paths: Path[] =
          kind === 0
            ? [
                [c, c],
                [1 - c, c],
              ]
            : kind === 1
              ? [
                  [0, 1],
                  [1, 0],
                ]
              : [
                  [0, 0],
                  [1, 1],
                ];
        const L = bag.letters;
        const named = paths.map((p) => `${L[p[0]!]}, ${L[p[1]!]}`);
        const [same, diff] = [x * (x - 1) + y * (y - 1), 2 * x * y];
        const last =
          kind === 0
            ? t(
                `Before anything is seen, the second draw is as likely to be ${col[c]!.en} as the first, and the first is ${col[c]!.en} with probability $${fr(k[c]!, n)}${Q.of(k[c]!, n).toLatex() === fr(k[c]!, n) ? "" : ` = ${Q.of(k[c]!, n).toLatex()}`}$, the same as the answer.`,
                `在什么都没看到之前，第二次取到${col[c]!["zh-CN"]}和第一次一样可能，而第一次取到${col[c]!["zh-CN"]}的概率是 $${fr(k[c]!, n)}${Q.of(k[c]!, n).toLatex() === fr(k[c]!, n) ? "" : ` = ${Q.of(k[c]!, n).toLatex()}`}$，与答案相同。`,
              )
            : t(
                `"Same color" and "different colors" share out all four paths, so their numerators add up to $${d}$: $${same} + ${diff} = ${same + diff}$.`,
                `“颜色相同”和“颜色不同”分掉了全部四条路径，所以它们的分子之和应为 $${d}$：$${same} + ${diff} = ${same + diff}$。`,
              );
        return {
          ...numberProblem({
            prompt: t(
              `${bag.setup(x, y).en} ${bag.two.en} The tree diagram shows the draws. What is the probability that ${what.en}?${simplest.en}`,
              `${bag.setup(x, y)["zh-CN"]}${bag.two["zh-CN"]}树状图表示了这两次抽取。求${what["zh-CN"]}的概率。${simplest["zh-CN"]}`,
            ),
            answer: Q.of(total, d),
            wrong: [Q.of(nums[0]!, d), Q.of(nums[1]!, d), Q.of(nums[0]! * nums[1]!, d * d)],
            solution: para(
              step(
                1,
                "find the paths",
                "找出路径",
                t(
                  `Two paths of the tree lead to the event: ${named[0]} and ${named[1]}.`,
                  `树状图上有两条路径通向这个事件：${named[0]} 和 ${named[1]}。`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "multiply along each, then add",
                "每条相乘，再相加",
                t(
                  `Multiply along each path; the two paths do not overlap, so add them:${work}`,
                  `沿每条路径相乘；两条路径互不重叠，所以相加：${work}`,
                ),
              ),
              check(last),
            ),
          }),
          figure: bagTree(bag, x, y),
          solutionFigures: [
            bagTree(
              bag,
              x,
              y,
              {
                tone: onPaths(paths),
                leaf: (p) => (samePath(p, paths[0]!) ? `${nums[0]}/${d}` : samePath(p, paths[1]!) ? `${nums[1]}/${d}` : ""),
              },
              t(`Marked: the paths ${named[0]} and ${named[1]}.`, `标出：路径 ${named[0]} 与 ${named[1]}。`),
            ),
          ],
        };
      },
    },
  ],
};

/** Tree diagrams for dependent events: applications (Geometry 6.18.6). */
export const treeDiagramsForDependentEventsApplications: TopicDef = {
  id: "tree-diagrams-for-dependent-events-applications",
  title: t("Tree Diagrams for Dependent Events: Applications", "相关事件的树状图：应用"),
  summary: t(
    "Draw your own tree diagrams to solve problems with dependent events, including at-least-one problems and reversed conditional probabilities.",
    "自己画树状图解决相关事件的问题，包括“至少一个”问题和反过来的条件概率。",
  ),
  prerequisites: ["tree-diagrams-for-dependent-events"],
  encompasses: [{ topic: "tree-diagrams-for-dependent-events", weight: 0.7 }],
  xp: 16,
  standards: ["CCSS.HSS.CP.B.8", "CCSS.HSS.CP.A.3"],
  intro: t(
    `So far the tree was given. In a word problem, draw it yourself: one stage for each draw or event, two branches from every point, and conditional probabilities on the second stage. Then the question decides which paths to add.

A jar holds $2$ lemon and $4$ cherry sweets, and Mia takes two without looking. What is the probability that she gets at least one lemon sweet? Three paths have a lemon in them, but only one has none:

{{figure 0}}

The path cherry, cherry has probability $\\frac{4}{6} \\cdot \\frac{3}{5} = \\frac{12}{30} = \\frac{2}{5}$, so at least one lemon has probability $1 - \\frac{2}{5} = \\frac{3}{5}$. Adding the three other paths gives the same: $\\frac{2}{30} + \\frac{8}{30} + \\frac{8}{30} = \\frac{18}{30} = \\frac{3}{5}$.

In this lesson we solve "at least one" questions with the complement, and turn a condition around: from $P(B \\mid A)$ on the tree to $P(A \\mid B)$.`,
    `前面的树状图都是给好的。在应用题里要自己画：每次抽取或每个事件画一层，每一点引出两个分支，第二层上标条件概率。然后由问题决定把哪些路径相加。

罐子里有 $2$ 颗柠檬糖和 $4$ 颗樱桃糖，米娅不看就拿了两颗。她至少拿到一颗柠檬糖的概率是多少？有三条路径含有柠檬糖，但一颗也没有的只有一条：

{{figure 0}}

“樱桃、樱桃”这条路径的概率是 $\\frac{4}{6} \\cdot \\frac{3}{5} = \\frac{12}{30} = \\frac{2}{5}$，所以至少一颗柠檬糖的概率是 $1 - \\frac{2}{5} = \\frac{3}{5}$。把另外三条路径相加也得到同样的结果：$\\frac{2}{30} + \\frac{8}{30} + \\frac{8}{30} = \\frac{18}{30} = \\frac{3}{5}$。

这节课我们用对立事件解决“至少一个”的问题，并把条件反过来：由树状图上的 $P(B \\mid A)$ 求 $P(A \\mid B)$。`,
  ),
  introFigures: [
    treeFigure(
      [
        { label: "L", p: "2/6" },
        { label: "C", p: "4/6" },
      ],
      [
        [
          { label: "L", p: "1/5" },
          { label: "C", p: "4/5" },
        ],
        [
          { label: "L", p: "2/5" },
          { label: "C", p: "3/5" },
        ],
      ],
      {
        tone: either(
          onPaths([[1, 1]], "action"),
          onPaths(
            [
              [0, 0],
              [0, 1],
              [1, 0],
            ],
            "result",
          ),
        ),
        leaf: (p) => ["2/30", "8/30", "8/30", "12/30"][2 * p[0]! + p[1]!]!,
      },
      t(
        "Marked: the three paths with a lemon sweet, and the path cherry, cherry with none.",
        "标出：含有柠檬糖的三条路径，以及一颗也没有的“樱桃、樱桃”路径。",
      ),
    ),
  ],
  knowledgePoints: [
    {
      id: "at-least-one",
      title: t("At least one", "至少一个"),
      explanation: t(
        `"At least one" covers many paths, but its complement, "none", is a single path: the other outcome both times. So find that one path and subtract it from $1$.

A bag holds $5$ red and $3$ blue marbles, and two are drawn without replacement. No red means blue, then blue:

{{figure 0}}

$$P(\\text{no red}) = \\frac{3}{8} \\cdot \\frac{2}{7} = \\frac{6}{56} = \\frac{3}{28}, \\qquad P(\\text{at least one red}) = 1 - \\frac{3}{28} = \\frac{25}{28}.$$

> **Watch out.** The path you multiply is the complement, so the last step is $1 -$ it; stopping at $\\frac{3}{28}$ answers "none". "At least one" also includes both red, so it is not the same as "exactly one", and the second blue branch is $\\frac{2}{7}$, not $\\frac{3}{8}$ again.`,
        `“至少一个”包括很多条路径，但它的对立事件“一个也没有”只有一条路径：两次都是另一种结果。所以求出这一条路径，再用 $1$ 去减。

袋子里有 $5$ 颗红弹珠和 $3$ 颗蓝弹珠，不放回地取两颗。没有红色就是“蓝、蓝”：

{{figure 0}}

$$P(\\text{没有红色}) = \\frac{3}{8} \\cdot \\frac{2}{7} = \\frac{6}{56} = \\frac{3}{28}, \\qquad P(\\text{至少一颗红色}) = 1 - \\frac{3}{28} = \\frac{25}{28}.$$

> **注意。** 相乘的这条路径是对立事件，所以最后一步是用 $1$ 减去它；停在 $\\frac{3}{28}$ 回答的是“一个也没有”。“至少一个”也包括两颗都是红色，所以它和“恰好一个”不同；第二段蓝色的概率是 $\\frac{2}{7}$，不再是 $\\frac{3}{8}$。`,
      ),
      figures: [
        bagTree(
          bags[0]!,
          5,
          3,
          {
            tone: either(
              onPaths([[1, 1]], "action"),
              onPaths(
                [
                  [0, 0],
                  [0, 1],
                  [1, 0],
                ],
                "result",
              ),
            ),
          },
          t(
            "Marked: the path B, B with no red, and the three paths with a red marble.",
            "标出：没有红色的路径 B、B，以及含有红色的三条路径。",
          ),
        ),
      ],
      generate(rng) {
        const bag = rng.pick(bags);
        const x = rng.int(2, 9);
        const y = rng.int(2, 9);
        const n = x + y;
        const d = n * (n - 1);
        const c = rng.int(0, 1);
        const col = [bag.x, bag.y];
        const o = c === 0 ? y : x;
        const none = o * (o - 1);
        const m = c === 0 ? x : y;
        const work = steps(
          `P(\\text{none}) = ${fr(o, n)} \\cdot ${fr(o - 1, n - 1)} = ${ratioL(none, d)}`,
          `1 - ${Q.of(none, d).toLatex()} = ${Q.of(d - none, d).toLatex()}`,
        );
        const workZh = steps(
          `P(\\text{一个也没有}) = ${fr(o, n)} \\cdot ${fr(o - 1, n - 1)} = ${ratioL(none, d)}`,
          `1 - ${Q.of(none, d).toLatex()} = ${Q.of(d - none, d).toLatex()}`,
        );
        const L = bag.letters;
        const oc = 1 - c;
        const some: Path[] = [
          [c, c],
          [c, oc],
          [oc, c],
        ];
        const direct = [m * (m - 1), m * o, o * m];
        return {
          ...numberProblem({
            prompt: t(
              `${bag.setup(x, y).en} ${bag.two.en} What is the probability that at least one of them is ${col[c]!.en}?${simplest.en}`,
              `${bag.setup(x, y)["zh-CN"]}${bag.two["zh-CN"]}求至少一次取到${col[c]!["zh-CN"]}的概率。${simplest["zh-CN"]}`,
            ),
            answer: Q.of(d - none, d),
            wrong: [Q.of(none, d), Q.of(n * n - o * o, n * n), Q.of(m * (m - 1), d), Q.of(2 * x * y, d)],
            solution: para(
              step(
                1,
                "use the complement",
                "用对立事件",
                t(
                  `Three paths of the tree have at least one ${col[c]!.en}, but only one has none: ${L[oc]}, ${L[oc]}, the other color both times.`,
                  `树状图上有三条路径至少有一次${col[c]!["zh-CN"]}，而一次也没有的只有一条：${L[oc]}、${L[oc]}，两次都是另一种颜色。`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "find that path and subtract",
                "求出这条路径再相减",
                t(
                  `After one ${col[oc]!.en} object is drawn, $${o - 1}$ of the $${n - 1}$ left are ${col[oc]!.en}:${work}`,
                  `取出一个${col[oc]!["zh-CN"]}的之后，剩下的 $${n - 1}$ 个中有 $${o - 1}$ 个是${col[oc]!["zh-CN"]}：${workZh}`,
                ),
              ),
              check(
                t(
                  `Add the three other paths directly, over $${d}$: $${m} \\cdot ${m - 1} + ${m} \\cdot ${o} + ${o} \\cdot ${m} = ${direct.join(" + ")} = ${d - none}$, and $${ratioL(d - none, d)}$ again.`,
                  `直接把另外三条路径相加，分母为 $${d}$：$${m} \\cdot ${m - 1} + ${m} \\cdot ${o} + ${o} \\cdot ${m} = ${direct.join(" + ")} = ${d - none}$，同样得到 $${ratioL(d - none, d)}$。`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            bagTree(
              bag,
              x,
              y,
              {
                tone: either(onPaths([[oc, oc]], "action"), onPaths(some, "result")),
                leaf: (p) => pathFr(p[0] === c ? m : o, p[0] === p[1] ? (p[0] === c ? m - 1 : o - 1) : p[1] === c ? m : o, n),
              },
              t(
                `Marked: the path ${L[oc]}, ${L[oc]} with none, and the three paths with at least one ${L[c]}.`,
                `标出：一次也没有的路径 ${L[oc]}、${L[oc]}，以及至少一次 ${L[c]} 的三条路径。`,
              ),
            ),
          ],
        };
      },
    },
    {
      id: "reversing-a-condition",
      title: t("Reversing a condition", "反过来的条件"),
      explanation: t(
        `A tree gives $P(B \\mid A)$, but a question may ask for $P(A \\mid B)$. Use the definition of conditional probability, with the law of total probability for the denominator:

$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{P(A) \\cdot P(B \\mid A)}{P(A) \\cdot P(B \\mid A) + P(A') \\cdot P(B \\mid A')}.$$

In the tree, $A$ is having an illness and $B$ is testing positive. If $10\\%$ of people have an illness, and a test is positive for $90\\%$ of the ill and $20\\%$ of the others, the two paths that end in a positive test are $0.1 \\cdot 0.9 = 0.09$ and $0.9 \\cdot 0.2 = 0.18$:

{{figure 0}}

$$P(\\text{ill} \\mid +) = \\frac{0.09}{0.09 + 0.18} = \\frac{0.09}{0.27} = \\frac{1}{3}.$$

Most positive results come from the many healthy people.

> **Watch out.** $P(\\text{ill} \\mid +)$ is not $P(+ \\mid \\text{ill}) = 0.9$: the condition is now the test result, so the whole is all the positive tests, $0.27$. The path $0.09$ alone is the probability of being ill **and** positive among everyone, and still has to be divided.`,
        `树状图给出的是 $P(B \\mid A)$，但问题可能问 $P(A \\mid B)$。这时用条件概率的定义，分母用全概率公式：

$$P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{P(A) \\cdot P(B \\mid A)}{P(A) \\cdot P(B \\mid A) + P(A') \\cdot P(B \\mid A')}.$$

树状图中，$A$ 表示患病，$B$ 表示检测呈阳性。若 $10\\%$ 的人患有某种疾病，检测对患病者有 $90\\%$ 呈阳性，对其他人有 $20\\%$ 呈阳性，那么以阳性结尾的两条路径是 $0.1 \\cdot 0.9 = 0.09$ 和 $0.9 \\cdot 0.2 = 0.18$：

{{figure 0}}

$$P(\\text{患病} \\mid +) = \\frac{0.09}{0.09 + 0.18} = \\frac{0.09}{0.27} = \\frac{1}{3}.$$

大多数阳性结果来自人数众多的健康人。

> **注意。** $P(\\text{患病} \\mid +)$ 不是 $P(+ \\mid \\text{患病}) = 0.9$：现在的条件是检测结果，所以全体是所有阳性结果 $0.27$。单独的路径 $0.09$ 是在所有人中患病**且**阳性的概率，还要再相除。`,
      ),
      figures: [
        abTree(
          ["0.1", "0.9", "0.9", "0.1", "0.2", "0.8"],
          {
            tone: either(onPaths([[0, 0]], "result"), onPaths([[1, 0]], "action")),
            leaf: (p) => (samePath(p, [0, 0]) ? "0.09" : samePath(p, [1, 0]) ? "0.18" : ""),
          },
          t("Marked: the path A then B, 0.09, and the path A′ then B, 0.18.", "标出：路径 A、B（0.09）与路径 A′、B（0.18）。"),
        ),
      ],
      generate(rng) {
        const s = rng.pick(splits);
        const [p, x, y] = splitValues(rng);
        const top = p * x;
        const bottom = p * x + (100 - p) * y;
        const otherTop = (100 - p) * y;
        const [dt, dob, db] = [dec(Q.of(top, 10000)), dec(Q.of(otherTop, 10000)), dec(Q.of(bottom, 10000))];
        const work = steps(
          `P(A \\mid B) = \\frac{${dt}}{${db}} = \\frac{${top}}{${bottom}}${Q.of(top, bottom).toLatex() === fr(top, bottom) ? "" : ` = ${Q.of(top, bottom).toLatex()}`}`,
        );
        const ans = Q.of(top, bottom);
        return {
          ...numberProblem({
            prompt: t(
              `${s.intro(p, x, y).en} ${s.askBack.en}${simplest.en}`,
              `${s.intro(p, x, y)["zh-CN"]}${s.askBack["zh-CN"]}${simplest["zh-CN"]}`,
            ),
            answer: ans,
            wrong: [Q.of(x, 100), Q.of(top, 10000), Q.of(p, 100), Q.of(bottom, 10000)],
            solution: para(
              step(
                1,
                "draw the tree",
                "画树状图",
                t(
                  `Let $A$ be the case "${s.a.en}" and $B$ the event "${s.b.en}". The tree splits first by $A$ and $A'$, with $${h(p)}$ and $${h(100 - p)}$, and then by $B$, with $P(B \\mid A) = ${h(x)}$ and $P(B \\mid A') = ${h(y)}$. Two paths end in $B$:`,
                  `设 $A$ 为“${s.a["zh-CN"]}”，$B$ 为“${s.b["zh-CN"]}”。树状图先按 $A$ 和 $A'$ 分，概率为 $${h(p)}$ 和 $${h(100 - p)}$；再按 $B$ 分，$P(B \\mid A) = ${h(x)}$，$P(B \\mid A') = ${h(y)}$。有两条路径以 $B$ 结尾：`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "find the whole, P(B)",
                "求全体 P(B)",
                t(
                  `We are told that $B$ happened, so the two paths into $B$ are the new whole:${steps(`P(B) = ${h(p)} \\cdot ${h(x)} + ${h(100 - p)} \\cdot ${h(y)} = ${dt} + ${dob} = ${db}`)}`,
                  `已知 $B$ 发生了，所以通向 $B$ 的两条路径就是新的全体：${steps(`P(B) = ${h(p)} \\cdot ${h(x)} + ${h(100 - p)} \\cdot ${h(y)} = ${dt} + ${dob} = ${db}`)}`,
                ),
              ),
              step(
                3,
                "divide the path through A by it",
                "用经过 A 的路径除以它",
                t(
                  `The part of that whole that went through $A$ is the path $P(A \\cap B) = ${dt}$; multiply the top and the bottom by $10\\,000$:${work}`,
                  `这个全体中经过 $A$ 的部分是路径 $P(A \\cap B) = ${dt}$；分子分母同乘 $10\\,000$：${work}`,
                ),
              ),
              check(
                t(
                  `The rest of the whole went through $A'$: $P(A' \\mid B) = \\frac{${dob}}{${db}} = ${Q.of(otherTop, bottom).toLatex()}$, and $${ans.toLatex()} + ${Q.of(otherTop, bottom).toLatex()} = 1$. The answer lies between $0$ and $1$.`,
                  `全体中其余的部分经过 $A'$：$P(A' \\mid B) = \\frac{${dob}}{${db}} = ${Q.of(otherTop, bottom).toLatex()}$，而 $${ans.toLatex()} + ${Q.of(otherTop, bottom).toLatex()} = 1$。答案在 $0$ 与 $1$ 之间。`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            abTree(
              [h(p), h(100 - p), h(x), h(100 - x), h(y), h(100 - y)],
              {
                tone: either(onPaths([[0, 0]], "result"), onPaths([[1, 0]], "action")),
                leaf: (q) => (samePath(q, [0, 0]) ? dt : samePath(q, [1, 0]) ? dob : ""),
              },
              t(`Marked: the path A then B, ${dt}, and the path A′ then B, ${dob}.`, `标出：路径 A、B（${dt}）与路径 A′、B（${dob}）。`),
            ),
          ],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Independent events

/** coinDieFigure lists the twelve outcomes of a coin and a die, with those of one side and a number greater than k marked. */
function coinDieFigure(heads: boolean, k: number): Figure {
  const rows = ["H", "T"].map((side) =>
    [1, 2, 3, 4, 5, 6].map((d): Cell => ({ text: `${side}${d}`, tone: (side === "H") === heads && d > k ? "result" : undefined })),
  );
  const s = heads ? "H" : "T";
  return {
    svg: gridSvg(rows),
    alt: t(
      `The twelve outcomes H1 to H6 and T1 to T6, with the ${6 - k} of ${s} and a number greater than ${k} marked.`,
      `十二种结果 H1 至 H6 和 T1 至 T6，标出 ${s} 且点数大于 ${k} 的 ${6 - k} 种。`,
    ),
  };
}

/** Independent events (Geometry 6.18.7). */
export const independentEvents: TopicDef = {
  id: "independent-events",
  title: t("Independent Events", "独立事件"),
  summary: t(
    "Multiply the probabilities of independent events, and test whether two events are independent.",
    "独立事件的概率相乘，并判断两个事件是否独立。",
  ),
  prerequisites: ["the-multiplication-law-for-conditional-probability", "conditional-probabilities-from-tables"],
  encompasses: [
    { topic: "the-multiplication-law-for-conditional-probability", weight: 0.3 },
    { topic: "conditional-probabilities-from-tables", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.A.2", "CCSS.HSS.CP.A.5"],
  intro: t(
    `A condition usually changes a probability: knowing that a visitor is a child made popcorn more likely. Sometimes it does not, and then the two events are called **independent**.

In a class of $40$ students, $10$ are left-handed and $16$ wear glasses, and $4$ of the left-handed students wear glasses. A student picked at random wears glasses with probability $\\frac{16}{40} = \\frac{2}{5}$. Among the left-handed students alone, it is $\\frac{4}{10} = \\frac{2}{5}$, exactly the same:

{{figure 0}}

Knowing that the student is left-handed tells us nothing about the glasses. The multiplication law then needs no condition: $P(\\text{left and glasses}) = \\frac{10}{40} \\cdot \\frac{2}{5} = \\frac{1}{4} \\cdot \\frac{2}{5} = \\frac{1}{10}$, which is $\\frac{4}{40}$. In this lesson we multiply the probabilities of independent events, and test whether two events are independent from probabilities and from tables.`,
    `条件通常会改变概率：知道观众是儿童，买爆米花的可能就变大了。有时条件并不改变概率，这时就说两个事件**相互独立**。

一个班有 $40$ 名学生，其中 $10$ 人是左撇子，$16$ 人戴眼镜，左撇子中有 $4$ 人戴眼镜。随机选一名学生，他戴眼镜的概率是 $\\frac{16}{40} = \\frac{2}{5}$。只看左撇子，这个概率是 $\\frac{4}{10} = \\frac{2}{5}$，完全一样：

{{figure 0}}

知道这名学生是左撇子，对他是否戴眼镜毫无影响。这时乘法公式不需要条件：$P(\\text{左撇子且戴眼镜}) = \\frac{10}{40} \\cdot \\frac{2}{5} = \\frac{1}{4} \\cdot \\frac{2}{5} = \\frac{1}{10}$，正是 $\\frac{4}{40}$。这节课我们把独立事件的概率相乘，并根据概率和表格判断两个事件是否独立。`,
  ),
  introFigures: [
    vennFigure("L", "G", ["6", "4", "12", "18"], {
      cond: (r) => r === 0 || r === 1,
      joint: (r) => r === 1,
      alt: t(
        "Shaded: the 10 left-handed students; shaded darker: the 4 of them with glasses.",
        "阴影：10 名左撇子；深色：其中戴眼镜的 4 人。",
      ),
    }),
  ],
  knowledgePoints: [
    {
      id: "multiplying-independent-probabilities",
      title: t("Multiplying probabilities", "概率相乘"),
      explanation: t(
        `Two events are **independent** when knowing that one happens does not change the probability of the other: $P(B \\mid A) = P(B)$. The multiplication law then becomes

$$P(A \\cap B) = P(A) \\cdot P(B).$$

A fair coin and a fair die do not affect each other. Of their $12$ equally likely outcomes, heads and a number greater than $4$ are H5 and H6:

{{figure 0}}

The count gives $\\frac{2}{12}$, and the product gives the same, $\\frac{1}{2} \\cdot \\frac{2}{6} = \\frac{1}{6}$. If $A$ and $B$ are independent, so are $A$ and $B'$, and $A'$ and $B'$: $P(A \\cap B') = P(A) \\cdot (1 - P(B))$.

> **Watch out.** "Both" multiplies: $\\frac{1}{2} + \\frac{2}{6}$ adds two probabilities of different events, and $\\frac{2}{6}$ alone forgets the coin. With a complement, change only the event that is complemented: $P(A \\cap B')$ uses $P(A)$ and $1 - P(B)$, not $1 - P(A) \\cdot P(B)$.`,
        `如果知道一个事件发生并不改变另一个事件的概率，即 $P(B \\mid A) = P(B)$，就说这两个事件**相互独立**。这时乘法公式变为

$$P(A \\cap B) = P(A) \\cdot P(B).$$

一枚均匀硬币和一颗均匀骰子互不影响。在它们的 $12$ 种等可能结果中，正面且点数大于 $4$ 的是 H5 和 H6：

{{figure 0}}

数出来是 $\\frac{2}{12}$，用乘法也得到同样的结果：$\\frac{1}{2} \\cdot \\frac{2}{6} = \\frac{1}{6}$。若 $A$ 与 $B$ 独立，则 $A$ 与 $B'$、$A'$ 与 $B'$ 也独立：$P(A \\cap B') = P(A) \\cdot (1 - P(B))$。

> **注意。** “都发生”要相乘：$\\frac{1}{2} + \\frac{2}{6}$ 是把两个不同事件的概率相加，只写 $\\frac{2}{6}$ 则忘了硬币。遇到对立事件时，只改变取对立的那个事件：$P(A \\cap B')$ 用 $P(A)$ 和 $1 - P(B)$，而不是 $1 - P(A) \\cdot P(B)$。`,
      ),
      figures: [coinDieFigure(true, 4)],
      generate(rng) {
        if (rng.bool(0.35)) {
          const k = rng.int(1, 5);
          const heads = rng.bool();
          const ans = Q.of(6 - k, 12);
          const side = t(heads ? "heads" : "tails", heads ? "正面" : "反面");
          const S = heads ? "H" : "T";
          const faces = Array.from({ length: 6 - k }, (_, i) => k + 1 + i);
          const list = faces.map((f) => `$${f}$`).join(", ");
          const outcomes = faces.map((f) => `${S}${f}`).join(", ");
          return {
            ...numberProblem({
              prompt: t(
                `A fair coin is tossed and a fair six-sided die is rolled. What is the probability of ${heads ? "heads" : "tails"} and a number greater than $${k}$?${simplest.en}`,
                `掷一枚均匀硬币和一颗均匀的六面骰子。求硬币${heads ? "正面" : "反面"}朝上且骰子点数大于 $${k}$ 的概率。${simplest["zh-CN"]}`,
              ),
              answer: ans,
              wrong: [Q.of(5 - k, 12)],
              mistakes: [
                why(
                  Q.of(6 - k, 6),
                  "That is only one of the two probabilities. For both events to happen, multiply them.",
                  "这只是其中一个事件的概率。两个事件都发生，要把概率相乘。",
                ),
                why(
                  Q.of(1, 2).add(Q.of(6 - k, 6)),
                  "You added the probabilities. For independent events both happening, multiply.",
                  "你把概率相加了。独立事件同时发生，要相乘。",
                ),
              ],
              solution: para(
                step(
                  1,
                  "find each probability",
                  "分别求概率",
                  t(
                    `The coin shows ${side.en} with probability $\\frac{1}{2}$. The numbers greater than $${k}$ are ${list}: $${6 - k}$ of the $6$, so that probability is $${fr(6 - k, 6)}$.`,
                    `硬币${side["zh-CN"]}朝上的概率是 $\\frac{1}{2}$。大于 $${k}$ 的点数有 ${list}，是 $6$ 个中的 $${6 - k}$ 个，所以这个概率是 $${fr(6 - k, 6)}$。`,
                  ),
                ),
                step(
                  2,
                  "multiply",
                  "相乘",
                  t(
                    `The coin and the die do not affect each other, so the events are independent and their probabilities multiply:${steps(`\\frac{1}{2} \\cdot ${fr(6 - k, 6)} = ${ratioL(6 - k, 12)}`)}`,
                    `硬币和骰子互不影响，所以两个事件相互独立，概率相乘：${steps(`\\frac{1}{2} \\cdot ${fr(6 - k, 6)} = ${ratioL(6 - k, 12)}`)}`,
                  ),
                ),
                check(
                  t(
                    `Count instead. The coin and the die have $2 \\cdot 6 = 12$ equally likely outcomes, and the ones we want are ${outcomes}:`,
                    `改用计数。硬币和骰子共有 $2 \\cdot 6 = 12$ 种等可能结果，符合要求的是 ${outcomes}：`,
                  ),
                ),
                figureLine(0),
                t(
                  `That is $${6 - k}$ of $12$, and $${ratioL(6 - k, 12)}$ again.`,
                  `共 $12$ 种中的 $${6 - k}$ 种，同样是 $${ratioL(6 - k, 12)}$。`,
                ),
              ),
            }),
            solutionFigures: [coinDieFigure(heads, k)],
          };
        }
        const b = rng.int(3, 9);
        const a = rng.int(1, b - 1);
        const d = rng.int(3, 9);
        const c = rng.int(1, d - 1);
        const pa = Q.of(a, b);
        const pb = Q.of(c, d);
        const kind = rng.int(0, 2);
        const fa = kind === 2 ? Q.one.sub(pa) : pa;
        const fb = kind === 0 ? pb : Q.one.sub(pb);
        const ev = ["A \\cap B", "A \\cap B'", "A' \\cap B'"][kind]!;
        const ans = fa.mul(fb);
        const [eA, eB] = [kind === 2 ? "A'" : "A", kind === 0 ? "B" : "B'"];
        const [oB] = [kind === 0 ? "B'" : "B"];
        const comps: Text =
          kind === 0
            ? t(
                `Both probabilities are given: $P(A) = ${pa.toLatex()}$ and $P(B) = ${pb.toLatex()}$.`,
                `两个概率都已给出：$P(A) = ${pa.toLatex()}$，$P(B) = ${pb.toLatex()}$。`,
              )
            : kind === 1
              ? t(
                  `$P(A) = ${pa.toLatex()}$, and the complement of $B$ has $P(B') = 1 - ${pb.toLatex()} = ${fb.toLatex()}$.`,
                  `$P(A) = ${pa.toLatex()}$，$B$ 的对立事件的概率是 $P(B') = 1 - ${pb.toLatex()} = ${fb.toLatex()}$。`,
                )
              : t(
                  `Both events are complements: $P(A') = 1 - ${pa.toLatex()} = ${fa.toLatex()}$ and $P(B') = 1 - ${pb.toLatex()} = ${fb.toLatex()}$.`,
                  `两个都是对立事件：$P(A') = 1 - ${pa.toLatex()} = ${fa.toLatex()}$，$P(B') = 1 - ${pb.toLatex()} = ${fb.toLatex()}$。`,
                );
        const other = fa.mul(Q.one.sub(fb));
        return numberProblem({
          prompt: t(
            `Events $A$ and $B$ are independent, with $P(A) = ${pa.toLatex()}$ and $P(B) = ${pb.toLatex()}$. Find $P(${ev})$.${simplest.en}`,
            `事件 $A$ 与 $B$ 相互独立，$P(A) = ${pa.toLatex()}$，$P(B) = ${pb.toLatex()}$。求 $P(${ev})$。${simplest["zh-CN"]}`,
          ),
          answer: ans,
          wrong: [pa.mul(pb), fa.add(fb), Q.one.sub(pa.mul(pb)), pa.mul(Q.one.sub(pb))],
          solution: para(
            step(1, "find the probabilities of the two events", "求两个事件的概率", comps),
            step(
              2,
              "multiply",
              "相乘",
              t(
                `${kind === 0 ? "$A$ and $B$" : `$${eA}$ and $${eB}$ are independent too, since independence carries over to complements, so`} ${kind === 0 ? "are independent, so their probabilities multiply" : "their probabilities multiply"}:${steps(`P(${ev}) = ${fa.toLatex()} \\cdot ${fb.toLatex()} = ${ans.toLatex()}`)}`,
                `${kind === 0 ? "$A$ 与 $B$ 相互独立，所以" : `独立事件的对立事件仍然独立，$${eA}$ 与 $${eB}$ 相互独立，所以`}概率相乘：${steps(`P(${ev}) = ${fa.toLatex()} \\cdot ${fb.toLatex()} = ${ans.toLatex()}`)}`,
              ),
            ),
            check(
              t(
                `$${eA}$ happens either with $${eB}$ or with $${oB}$, so the two products must add up to $P(${eA})$: $${ans.toLatex()} + ${fa.toLatex()} \\cdot ${Q.one.sub(fb).toLatex()} = ${ans.toLatex()} + ${other.toLatex()} = ${ans.add(other).toLatex()}$. It does, and the answer is less than both factors.`,
                `$${eA}$ 发生时，要么 $${eB}$ 发生，要么 $${oB}$ 发生，所以两个乘积之和应为 $P(${eA})$：$${ans.toLatex()} + ${fa.toLatex()} \\cdot ${Q.one.sub(fb).toLatex()} = ${ans.toLatex()} + ${other.toLatex()} = ${ans.add(other).toLatex()}$。确实如此，而且答案比两个因数都小。`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "testing-independence",
      title: t("Testing for independence", "判断是否独立"),
      explanation: t(
        `To test whether $A$ and $B$ are independent, compare $P(A \\cap B)$ with $P(A) \\cdot P(B)$: they are independent exactly when the two are equal. That is the same test as $P(B \\mid A) = P(B)$, multiplied through by $P(A)$.

With $P(A) = 0.4$, $P(B) = 0.5$ and $P(A \\cap B) = 0.2$: $0.4 \\cdot 0.5 = 0.2$, so $A$ and $B$ are independent. In the Venn diagram, half of $A$ lies in $B$, just as half of everything does:

{{figure 0}}

With $P(A \\cap B) = 0.25$ instead, they are not: knowing $A$ makes $B$ more likely.

> **Watch out.** Independent does not mean "not overlapping": events that cannot happen together, with $P(A \\cap B) = 0$, are as dependent as can be, since one rules the other out. The test is an exact equality of $P(A) \\cdot P(B)$ and $P(A \\cap B)$; nearly equal is not equal.`,
        `判断 $A$ 与 $B$ 是否独立，比较 $P(A \\cap B)$ 与 $P(A) \\cdot P(B)$：两者相等时，且仅在此时，它们相互独立。这与 $P(B \\mid A) = P(B)$ 两边同乘 $P(A)$ 是同一个检验。

若 $P(A) = 0.4$，$P(B) = 0.5$，$P(A \\cap B) = 0.2$：$0.4 \\cdot 0.5 = 0.2$，所以 $A$ 与 $B$ 独立。在维恩图中，$A$ 有一半在 $B$ 里，正如全体有一半在 $B$ 里：

{{figure 0}}

若 $P(A \\cap B) = 0.25$，它们就不独立：知道 $A$ 发生会使 $B$ 更可能发生。

> **注意。** 独立不是“不重叠”：不能同时发生、$P(A \\cap B) = 0$ 的两个事件恰恰最不独立，因为一个发生就排除了另一个。检验要求 $P(A) \\cdot P(B)$ 与 $P(A \\cap B)$ 严格相等；差不多相等不算相等。`,
      ),
      figures: [
        vennFigure("A", "B", ["0.2", "0.2", "0.3", "0.3"], {
          cond: (r) => r === 0 || r === 1,
          joint: (r) => r === 1,
          alt: t("Shaded: A, 0.4; shaded darker: its part in B, 0.2.", "阴影：A，0.4；深色：其中属于 B 的部分，0.2。"),
        }),
      ],
      generate(rng) {
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const indep = rng.bool();
        let j = a * b;
        if (!indep) {
          const lo = Math.max(1, 10 * (a + b) - 100);
          const hi = 10 * Math.min(a, b);
          const cands = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((v) => v !== a * b && Math.abs(v - a * b) <= 12);
          j = cands.length > 0 ? rng.pick(cands) : a * b;
        }
        const yes = j === a * b;
        const rel = yes ? "=" : "\\ne";
        const v = [10 * a - j, j, 10 * b - j, 100 - 10 * a - 10 * b + j].map((x) => h(x)) as [string, string, string, string];
        const cond = Q.of(j, 10 * a);
        const more = j > a * b;
        return {
          ...choiceProblem({
            prompt: t(
              `$P(A) = ${h(10 * a)}$, $P(B) = ${h(10 * b)}$ and $P(A \\cap B) = ${h(j)}$. Are $A$ and $B$ independent?`,
              `$P(A) = ${h(10 * a)}$，$P(B) = ${h(10 * b)}$，$P(A \\cap B) = ${h(j)}$。$A$ 与 $B$ 相互独立吗？`,
            ),
            options: yesNo,
            correct: yes ? 0 : 1,
            solution: para(
              step(
                1,
                "multiply the two probabilities",
                "把两个概率相乘",
                t(
                  `If the events were independent, $P(A \\cap B)$ would be $P(A) \\cdot P(B) = ${h(10 * a)} \\cdot ${h(10 * b)} = ${h(a * b)}$.`,
                  `如果两个事件独立，$P(A \\cap B)$ 应当等于 $P(A) \\cdot P(B) = ${h(10 * a)} \\cdot ${h(10 * b)} = ${h(a * b)}$。`,
                ),
              ),
              step(
                2,
                "compare with the overlap",
                "与重叠部分比较",
                t(
                  `The overlap is given as $P(A \\cap B) = ${h(j)}$, and $${h(a * b)} ${rel} ${h(j)}$, so $A$ and $B$ are ${yes ? "" : "not "}independent.${yes ? "" : ` The overlap is ${more ? "larger" : "smaller"} than independence allows: knowing $A$ makes $B$ ${more ? "more" : "less"} likely.`}`,
                  `已知重叠部分 $P(A \\cap B) = ${h(j)}$，而 $${h(a * b)} ${rel} ${h(j)}$，所以 $A$ 与 $B$ ${yes ? "" : "不"}独立。${yes ? "" : `重叠部分比独立时${more ? "大" : "小"}：知道 $A$ 发生，$B$ 就${more ? "更" : "更不"}可能发生。`}`,
                ),
              ),
              figureLine(0),
              check(
                t(
                  `Use the condition instead: $P(B \\mid A) = \\frac{${h(j)}}{${h(10 * a)}} = ${cond.toLatex()}$, and $P(B) = ${h(10 * b)}$. Knowing $A$ ${yes ? "leaves the probability of $B$ unchanged" : "changes the probability of $B$"}, which is the same verdict.`,
                  `改用条件概率：$P(B \\mid A) = \\frac{${h(j)}}{${h(10 * a)}} = ${cond.toLatex()}$，而 $P(B) = ${h(10 * b)}$。知道 $A$ 发生${yes ? "并不改变" : "改变了"} $B$ 的概率，结论相同。`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            vennFigure("A", "B", v, {
              cond: (r) => r === 0 || r === 1,
              joint: (r) => r === 1,
              alt: t(
                `Shaded: A, ${h(10 * a)}; shaded darker: its part in B, ${h(j)}.`,
                `阴影：A，${h(10 * a)}；深色：其中属于 B 的部分，${h(j)}。`,
              ),
            }),
          ],
        };
      },
    },
    {
      id: "independence-in-a-table",
      title: t("Independence in a two-way table", "双向表中的独立性"),
      explanation: t(
        `In a two-way table, a row category and a column category are independent when the conditional probability equals the overall probability: the column's share is the same within the row as in the whole table.

| | Walks | Bus | Total |
| :--- | ---: | ---: | ---: |
| Grade 9 | 12 | 18 | 30 |
| Grade 10 | 8 | 12 | 20 |
| Total | 20 | 30 | 50 |

Within the row Grade 9, $12$ of $30$ walk; in the whole table, $20$ of $50$ do:

{{figure 0}}

$P(\\text{walks} \\mid \\text{Grade 9}) = \\frac{12}{30} = \\frac{2}{5}$ and $P(\\text{walks}) = \\frac{20}{50} = \\frac{2}{5}$, so being in Grade 9 and walking are independent.

> **Watch out.** Compare the share in the row with the column total over the grand total, $\\frac{20}{50}$, not with the cell over the grand total, $\\frac{12}{50}$. And independence is a matter of these numbers: that one event does not cause the other, or that the two share some people, decides nothing.`,
        `在双向表中，当条件概率等于总体概率，即某一列在这一行中所占的比例与在全表中所占的比例相同时，这一行的类别与这一列的类别相互独立。

| | 步行 | 坐公交 | 合计 |
| :--- | ---: | ---: | ---: |
| 九年级 | 12 | 18 | 30 |
| 十年级 | 8 | 12 | 20 |
| 合计 | 20 | 30 | 50 |

在九年级这一行中，$30$ 人里有 $12$ 人步行；在全表中，$50$ 人里有 $20$ 人步行：

{{figure 0}}

$P(\\text{步行} \\mid \\text{九年级}) = \\frac{12}{30} = \\frac{2}{5}$，$P(\\text{步行}) = \\frac{20}{50} = \\frac{2}{5}$，所以“是九年级的”与“步行上学”相互独立。

> **注意。** 要把这一行中的比例与这一列的合计除以总数 $\\frac{20}{50}$ 比较，而不是与这个格子除以总数 $\\frac{12}{50}$ 比较。是否独立只看这些数：一个事件不会导致另一个，或者两个事件有共同的人，都说明不了什么。`,
      ),
      figures: [
        tableFigure(
          [
            [12, 18],
            [8, 12],
          ],
          { row: 0, num: [0, 0], den: [0, 2] },
          t(
            "The table with totals. Shaded: the row Grade 9, total 30; marked: the 12 of them who walk.",
            "带合计的表格。阴影：九年级这一行，合计 30；标出：其中步行的 12 人。",
          ),
        ),
      ],
      generate(rng) {
        const c = rng.pick(tables);
        const m = rng.int(2, 5);
        const k = rng.int(1, m - 1);
        const u1 = rng.int(2, 9);
        const u2 = rng.int(2, 9);
        const cells = [
          [u1 * k, u1 * (m - k)],
          [u2 * k, u2 * (m - k)],
        ];
        if (rng.bool()) {
          const s = rng.int(1, 3) * (rng.bool() ? 1 : -1);
          const r = rng.int(0, 1);
          const col = cells[r]![0]! + s > 0 && cells[r]![1]! - s > 0 ? s : -s;
          cells[r]![0]! += col;
          cells[r]![1]! -= col;
        }
        const i = rng.int(0, 1);
        const j = rng.int(0, 1);
        const cell = cells[i]![j]!;
        const rowT = cells[i]![0]! + cells[i]![1]!;
        const colT = cells[0]![j]! + cells[1]![j]!;
        const total = rowT + cells[1 - i]![0]! + cells[1 - i]![1]!;
        const yes = cell * total === rowT * colT;
        const rel = yes ? "=" : "\\ne";
        const row = c.rows[i as 0 | 1];
        const col = c.cols[j as 0 | 1];
        const tb = tableMd(c, cells, true);
        const rowShare = Q.of(cell, rowT).toLatex();
        // When the events are independent, the option for "no" quotes the joint share, a common slip.
        const shownShare = (yes ? Q.of(cell, total) : Q.of(colT, total)).toLatex();
        const [rRev, cRev] = [Q.of(cell, colT), Q.of(rowT, total)];
        return {
          ...verdictChoice(rng, {
            prompt: t(
              `${c.intro.en}${tb.en}For ${c.a.en.toLowerCase()} chosen at random, are the events "${c.the.en} ${row.is.en}" and "${c.the.en} ${col.is.en}" independent?`,
              `${c.intro["zh-CN"]}${tb["zh-CN"]}随机选${c.a["zh-CN"]}，事件“${c.the["zh-CN"]}${row.is["zh-CN"]}”与“${c.the["zh-CN"]}${col.is["zh-CN"]}”相互独立吗？`,
            ),
            holds: yes,
            yes: t(
              `the share of "${col.label.en}" is $${rowShare}$ both in the row and in the whole table`,
              `“${col.label["zh-CN"]}”在这一行和在全表中的比例都是 $${rowShare}$`,
            ),
            no: t(
              `the share of "${col.label.en}" is $${rowShare}$ in the row but $${shownShare}$ in the whole table`,
              `“${col.label["zh-CN"]}”在这一行中的比例是 $${rowShare}$，在全表中却是 $${shownShare}$`,
            ),
            yesWrong: t("one event does not cause the other", "一个事件不会导致另一个事件"),
            noWrong: t(
              `$${cell}$ outcomes belong to both events, so the events overlap`,
              `有 $${cell}$ 个结果同时属于两个事件，所以它们有重叠`,
            ),
            solution: para(
              step(
                1,
                "the share in the row",
                "这一行中的比例",
                t(
                  `Given "${row.label.en}", only its row counts: $${cell}$ of its $${rowT}$ ${c.many.en} are in "${col.label.en}", a share of $${ratioL(cell, rowT)}$.`,
                  `已知“${row.label["zh-CN"]}”，就只看这一行：这一行的 $${rowT}$ ${c.many["zh-CN"]}中有 $${cell}$ ${c.many["zh-CN"]}属于“${col.label["zh-CN"]}”，比例是 $${ratioL(cell, rowT)}$。`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "the share in the whole table",
                "全表中的比例",
                t(
                  `In the whole table, the column "${col.label.en}" holds $${colT}$ of the $${total}$ ${c.many.en}, a share of $${ratioL(colT, total)}$.`,
                  `在全表中，“${col.label["zh-CN"]}”这一列占 $${total}$ ${c.many["zh-CN"]}中的 $${colT}$ ${c.many["zh-CN"]}，比例是 $${ratioL(colT, total)}$。`,
                ),
              ),
              figureLine(1),
              step(
                3,
                "compare",
                "比较",
                t(
                  `Since $${Q.of(cell, rowT).toLatex()} ${rel} ${Q.of(colT, total).toLatex()}$, knowing the row ${yes ? "does not change" : "changes"} the probability of the column, so the events are ${yes ? "" : "not "}independent.`,
                  `因为 $${Q.of(cell, rowT).toLatex()} ${rel} ${Q.of(colT, total).toLatex()}$，知道所在的行${yes ? "并不改变" : "改变了"}属于这一列的概率，所以这两个事件${yes ? "" : "不"}独立。`,
                ),
              ),
              check(
                t(
                  `Condition the other way: within the column "${col.label.en}", the share of "${row.label.en}" is $${ratioL(cell, colT)}$, and in the whole table it is $${ratioL(rowT, total)}$. Since $${rRev.toLatex()} ${rel} ${cRev.toLatex()}$, the verdict is the same.`,
                  `反过来取条件：在“${col.label["zh-CN"]}”这一列中，“${row.label["zh-CN"]}”的比例是 $${ratioL(cell, colT)}$，在全表中是 $${ratioL(rowT, total)}$。因为 $${rRev.toLatex()} ${rel} ${cRev.toLatex()}$，结论相同。`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            tableFigure(
              cells,
              { row: i, num: [i, j], den: [i, 2] },
              t(
                `The table with totals. Shaded: the row "${row.label.en}", total ${rowT}; marked: the ${cell} in "${col.label.en}".`,
                `带合计的表格。阴影：“${row.label["zh-CN"]}”这一行，合计 ${rowT}；标出：其中属于“${col.label["zh-CN"]}”的 ${cell}。`,
              ),
            ),
            tableFigure(
              cells,
              { col: j, num: [2, j], den: [2, 2] },
              t(
                `The table with totals. Shaded: the column "${col.label.en}"; marked: its total ${colT} and the grand total ${total}.`,
                `带合计的表格。阴影：“${col.label["zh-CN"]}”这一列；标出：它的合计 ${colT} 和总数 ${total}。`,
              ),
            ),
          ],
        };
      },
    },
  ],
};

/** sameTree draws the tree of two independent events named a and b, with the same second-stage branches after both first ones. */
function sameTree(a: string, b: string, pa: string, qa: string, pb: string, qb: string, marks?: TreeMarks, note?: Text): Figure {
  const second = [
    { label: b, p: pb },
    { label: `${b}′`, p: qb },
  ] as const;
  return treeFigure(
    [
      { label: a, p: pa },
      { label: `${a}′`, p: qa },
    ],
    [second, second],
    marks,
    note,
  );
}

/** trialsTree draws the tree of three independent trials, success S and failure F, with the probabilities on the first stage and the given paths marked. */
function trialsTree(p: string, q: string, paths: readonly Path[], leaf: string, alt: Text): Figure {
  return {
    svg: treeSvg(3, (path) => ({ label: path[path.length - 1] === 0 ? "S" : "F", p: path.length === 1 ? (path[0] === 0 ? p : q) : "" }), {
      tone: either(onPaths(paths), () => "accent"),
      leaf: (path) => (paths.some((x) => samePath(x, path)) ? leaf : ""),
    }),
    alt,
  };
}

/** Tree diagrams for independent events (Geometry 6.18.8). */
export const treeDiagramsForIndependentEvents: TopicDef = {
  id: "tree-diagrams-for-independent-events",
  title: t("Tree Diagrams for Independent Events", "独立事件的树状图"),
  summary: t(
    "Use tree diagrams for independent events and repeated independent trials: both, neither, exactly one, and at least one.",
    "用树状图处理独立事件和独立重复试验：都发生、都不发生、恰好一个、至少一个。",
  ),
  prerequisites: ["independent-events", "tree-diagrams-for-dependent-events", "powers-of-rational-numbers"],
  encompasses: [
    { topic: "independent-events", weight: 0.6 },
    { topic: "powers-of-rational-numbers", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.A.2", "CCSS.HSS.CP.B.8"],
  intro: t(
    `In a tree for drawing without replacement, the second-stage branches changed with the first draw. When the two events are independent, they do not: the second stage is the same after every first branch, and the tree is quicker to draw.

Kim plays two games of chess. She wins the first with probability $0.6$ and the second with probability $0.5$, whatever happened in the first. Both pairs of second branches carry $0.5$ and $0.5$:

{{figure 0}}

She wins exactly one game along two paths, win then lose and lose then win: $0.6 \\cdot 0.5 + 0.4 \\cdot 0.5 = 0.3 + 0.2 = 0.5$. In this lesson we read such trees for two events, and for the same trial repeated: at least once, and exactly $k$ times in three trials.`,
    `在不放回抽取的树状图中，第二阶段的分支随第一次的结果而变。两个事件独立时就不会这样：每个第一阶段分支之后，第二阶段都一样，树状图也更容易画。

基姆下两盘棋。她赢第一盘的概率是 $0.6$，赢第二盘的概率是 $0.5$，与第一盘的结果无关。两组第二阶段的分支上都是 $0.5$ 和 $0.5$：

{{figure 0}}

她恰好赢一盘有两条路径，先赢后输和先输后赢：$0.6 \\cdot 0.5 + 0.4 \\cdot 0.5 = 0.3 + 0.2 = 0.5$。这节课我们读两个事件的这种树状图，也处理同一个试验的重复：至少一次，以及三次中恰好 $k$ 次。`,
  ),
  introFigures: [
    sameTree(
      "W",
      "W",
      "0.6",
      "0.4",
      "0.5",
      "0.5",
      {
        tone: either(
          onPaths([
            [0, 1],
            [1, 0],
          ]),
          () => "accent",
        ),
        leaf: (p) => (samePath(p, [0, 1]) ? "0.3" : samePath(p, [1, 0]) ? "0.2" : ""),
      },
      t("Marked: the two paths with exactly one win, 0.3 and 0.2.", "标出：恰好赢一盘的两条路径，0.3 和 0.2。"),
    ),
  ],
  knowledgePoints: [
    {
      id: "two-independent-events",
      title: t("Two independent events", "两个独立事件"),
      explanation: t(
        `For independent events, the second-stage branches are the same after every first-stage outcome, because the first stage does not change them. Each question is a choice of paths.

If Leo's train is late with probability $0.2$ and his bus, independently, with probability $0.3$, the four paths are

{{figure 0}}

- both late: $0.2 \\cdot 0.3 = 0.06$;
- neither late: $0.8 \\cdot 0.7 = 0.56$;
- exactly one late: $0.2 \\cdot 0.7 + 0.8 \\cdot 0.3 = 0.14 + 0.24 = 0.38$;
- at least one late: $1 - 0.56 = 0.44$.

The four paths add up to $0.06 + 0.14 + 0.24 + 0.56 = 1$.

> **Watch out.** "Exactly one" is two paths, $T$ then $B'$ and $T'$ then $B$; one path alone is half of it. "At least one" also counts both late. And $0.2 + 0.3$ is not the probability of anything here: add whole paths, not branches.`,
        `对独立事件，第一阶段的每种结果之后，第二阶段的分支都相同，因为第一阶段不会改变它们。每个问题就是选出相应的路径。

若利奥的火车晚点的概率是 $0.2$，公交车晚点的概率是 $0.3$，两者独立，四条路径是

{{figure 0}}

- 都晚点：$0.2 \\cdot 0.3 = 0.06$；
- 都不晚点：$0.8 \\cdot 0.7 = 0.56$；
- 恰好一个晚点：$0.2 \\cdot 0.7 + 0.8 \\cdot 0.3 = 0.14 + 0.24 = 0.38$；
- 至少一个晚点：$1 - 0.56 = 0.44$。

四条路径之和是 $0.06 + 0.14 + 0.24 + 0.56 = 1$。

> **注意。** “恰好一个”是两条路径：$T$ 后 $B'$ 和 $T'$ 后 $B$，只算一条就只有一半。“至少一个”还包括两个都晚点。$0.2 + 0.3$ 在这里不是任何事件的概率：要把整条路径相加，而不是把分支相加。`,
      ),
      figures: [
        sameTree(
          "T",
          "B",
          "0.2",
          "0.8",
          "0.3",
          "0.7",
          { leaf: (p) => ["0.06", "0.14", "0.24", "0.56"][2 * p[0]! + p[1]!]! },
          t("At the ends of the paths: 0.06, 0.14, 0.24 and 0.56.", "各路径末端：0.06、0.14、0.24 和 0.56。"),
        ),
      ],
      generate(rng) {
        const ctx = rng.pick([
          {
            l: ["T", "B"],
            intro: (a: string, b: string) =>
              t(
                `Leo's train is late ($T$) with probability $${a}$, and his bus is late ($B$) with probability $${b}$, independently of the train.`,
                `利奥的火车晚点（$T$）的概率是 $${a}$，公交车晚点（$B$）的概率是 $${b}$，两者相互独立。`,
              ),
            what: [
              t("both are late", "两者都晚点"),
              t("neither is late", "两者都不晚点"),
              t("exactly one of them is late", "恰好有一个晚点"),
              t("at least one of them is late", "至少有一个晚点"),
            ],
          },
          {
            l: ["M", "S"],
            intro: (a: string, b: string) =>
              t(
                `Mia passes her math exam ($M$) with probability $${a}$ and her science exam ($S$) with probability $${b}$, independently.`,
                `米娅通过数学考试（$M$）的概率是 $${a}$，通过科学考试（$S$）的概率是 $${b}$，两者相互独立。`,
              ),
            what: [
              t("she passes both", "两门都通过"),
              t("she passes neither", "两门都没通过"),
              t("she passes exactly one", "恰好通过一门"),
              t("she passes at least one", "至少通过一门"),
            ],
          },
        ] as const);
        const a = rng.int(1, 9);
        const b = rng.int(1, 9);
        const kind = rng.int(0, 3);
        const [A, B] = ctx.l;
        const both = a * b;
        const neither = (10 - a) * (10 - b);
        const one = a * (10 - b) + (10 - a) * b;
        const ans = Q.of([both, neither, one, 100 - neither][kind]!, 100);
        const work = [
          steps(`${h(10 * a)} \\cdot ${h(10 * b)} = ${h(both)}`),
          steps(`${h(100 - 10 * a)} \\cdot ${h(100 - 10 * b)} = ${h(neither)}`),
          steps(
            `${h(10 * a)} \\cdot ${h(100 - 10 * b)} + ${h(100 - 10 * a)} \\cdot ${h(10 * b)} = ${h(a * (10 - b))} + ${h((10 - a) * b)} = ${h(one)}`,
          ),
          steps(`1 - ${h(100 - 10 * a)} \\cdot ${h(100 - 10 * b)} = 1 - ${h(neither)} = ${h(100 - neither)}`),
        ][kind]!;
        const how = [
          t("Multiply along the path through both", "沿两者都发生的路径相乘"),
          t("Multiply along the path through neither", "沿两者都不发生的路径相乘"),
          t("Two paths have exactly one; add them", "恰好一个的路径有两条，相加"),
          t("Use the complement of neither", "用“都不发生”的对立事件"),
        ][kind]!;
        const [Ap, Bp] = [`${A}'`, `${B}'`];
        const which = [
          t(`the path ${A} then ${B}`, `路径 ${A}、${B}`),
          t(`the path ${A}′ then ${B}′`, `路径 ${A}′、${B}′`),
          t(`the paths ${A} then ${B}′ and ${A}′ then ${B}`, `路径 ${A}、${B}′ 与 ${A}′、${B}`),
          t(
            `every path except ${A}′ then ${B}′, which is the only one with neither`,
            `除 ${A}′、${B}′ 以外的每条路径，${A}′、${B}′ 是唯一一条都不发生的路径`,
          ),
        ][kind]!;
        const paths: Path[][] = [
          [[0, 0]],
          [[1, 1]],
          [
            [0, 1],
            [1, 0],
          ],
          [
            [0, 0],
            [0, 1],
            [1, 0],
          ],
        ];
        const leafOf = (p: Path) => h([both, a * (10 - b), (10 - a) * b, neither][2 * p[0]! + p[1]!]!);
        const sum = `${h(both)} + ${h(a * (10 - b))} + ${h((10 - a) * b)} + ${h(neither)} = 1`;
        return {
          ...numberProblem({
            prompt: t(
              `${ctx.intro(h(10 * a), h(10 * b)).en} Use the tree diagram to find the probability that ${ctx.what[kind]!.en}.${asDecimal.en}`,
              `${ctx.intro(h(10 * a), h(10 * b))["zh-CN"]}利用树状图求${ctx.what[kind]!["zh-CN"]}的概率。${asDecimal["zh-CN"]}`,
            ),
            answer: ans,
            form: "decimal",
            wrong: [
              Q.of(both, 100),
              Q.of(neither, 100),
              Q.of(one, 100),
              Q.of(100 - neither, 100),
              Q.of(a + b, 10),
              Q.of(a * (10 - b), 100),
            ],
            solution: para(
              step(
                1,
                "choose the paths",
                "选出路径",
                t(
                  `The events are independent, so the branches to $${B}$ and $${Bp}$ are the same after $${A}$ and after $${Ap}$. The event is ${which.en}:`,
                  `两个事件独立，所以在 $${A}$ 和 $${Ap}$ 之后，通向 $${B}$ 和 $${Bp}$ 的分支都相同。所求事件是${which["zh-CN"]}：`,
                ),
              ),
              figureLine(0),
              step(2, "compute", "计算", t(`${how.en}:${work}`, `${how["zh-CN"]}：${work}`)),
              check(
                t(
                  `The four paths cover every outcome: $${sum}$. The paths chosen add up to the answer, $${dec(ans)}$.`,
                  `四条路径包括了所有结果：$${sum}$。选出的路径之和就是答案 $${dec(ans)}$。`,
                ),
              ),
            ),
          }),
          figure: treeFigure(
            [
              { label: A, p: h(10 * a) },
              { label: `${A}′`, p: h(100 - 10 * a) },
            ],
            [
              [
                { label: B, p: h(10 * b) },
                { label: `${B}′`, p: h(100 - 10 * b) },
              ],
              [
                { label: B, p: h(10 * b) },
                { label: `${B}′`, p: h(100 - 10 * b) },
              ],
            ],
          ),
          solutionFigures: [
            sameTree(
              A,
              B,
              h(10 * a),
              h(100 - 10 * a),
              h(10 * b),
              h(100 - 10 * b),
              {
                tone: kind === 3 ? either(onPaths([[1, 1]], "action"), onPaths(paths[3]!)) : either(onPaths(paths[kind]!), () => "accent"),
                leaf: leafOf,
              },
              t(`Marked: ${which.en}.`, `标出：${which["zh-CN"]}。`),
            ),
          ],
        };
      },
    },
    {
      id: "at-least-once-in-repeated-trials",
      title: t("At least once in repeated trials", "重复试验中至少一次"),
      explanation: t(
        `When the same experiment is repeated independently, each stage of the tree has the same branches. "At least once" is every path but one: the path where the event never happens, which multiplies the probability of "not" once per trial. So

$$P(\\text{at least once in } n \\text{ trials}) = 1 - (1 - p)^{n}.$$

Rolling a fair die $3$ times, the path with no six multiplies $\\frac{5}{6}$ three times:

{{figure 0}}

So the probability of at least one six is $1 - \\left(\\frac{5}{6}\\right)^{3} = 1 - \\frac{125}{216} = \\frac{91}{216}$.

> **Watch out.** It is not $3 \\cdot \\frac{1}{6}$: that counts the outcomes with two or three sixes more than once, and with $7$ rolls it would exceed $1$. Nor is it $1 - \\left(\\frac{1}{6}\\right)^{3}$, which is the probability of not getting a six every time. Raise the probability of failure, then subtract from $1$.`,
        `同一个试验独立重复时，树状图每一阶段的分支都相同。“至少一次”是除一条以外的所有路径：那一条是事件一次也不发生的路径，每次试验乘一次“不发生”的概率。所以

$$P(n \\text{ 次中至少一次}) = 1 - (1 - p)^{n}.$$

掷一颗均匀骰子 $3$ 次，没有六点的路径把 $\\frac{5}{6}$ 乘了三次：

{{figure 0}}

所以至少一次掷出六点的概率是 $1 - \\left(\\frac{5}{6}\\right)^{3} = 1 - \\frac{125}{216} = \\frac{91}{216}$。

> **注意。** 不是 $3 \\cdot \\frac{1}{6}$：那样会把出现两次或三次六点的结果重复计算，掷 $7$ 次时还会超过 $1$。也不是 $1 - \\left(\\frac{1}{6}\\right)^{3}$，那是“并非每次都是六点”的概率。应先求失败概率的乘方，再用 $1$ 去减。`,
      ),
      figures: [
        slotsFigure(
          [{ text: "5/6" }, { text: "5/6" }, { text: "5/6" }],
          { total: "= 125/216" },
          t(
            "Three rolls, each without a six with probability 5/6: together 125/216.",
            "三次投掷，每次不是六点的概率为 5/6：合起来是 125/216。",
          ),
        ),
      ],
      generate(rng) {
        const n = rng.int(2, 4);
        const kind = rng.int(0, 2);
        let p: Q;
        let what: Text;
        let fail: Text;
        if (kind === 0) {
          const f = rng.int(1, 3);
          p = Q.of(f, 6);
          what = t(
            `A fair six-sided die is rolled $${n}$ times. What is the probability of rolling a number greater than $${6 - f}$ at least once?`,
            `掷一颗均匀的六面骰子 $${n}$ 次。求至少一次掷出大于 $${6 - f}$ 的点数的概率。`,
          );
          fail = t(`a roll is not greater than $${6 - f}$`, `一次掷出的点数不大于 $${6 - f}$`);
        } else if (kind === 1) {
          const m = rng.pick([3, 4, 5, 8]);
          const r = rng.int(1, m - 1);
          p = Q.of(r, m);
          what = t(
            `A spinner has $${m}$ equal sections, $${r}$ of them red. It is spun $${n}$ times. What is the probability that it lands on red at least once?`,
            `一个转盘被分成 $${m}$ 个相等的扇区，其中 $${r}$ 个是红色。转动 $${n}$ 次，求至少一次停在红色上的概率。`,
          );
          fail = t("a spin misses red", "一次没有停在红色上");
        } else {
          const k = rng.int(1, 9);
          p = Q.of(k, 10);
          what = t(
            `A basketball player makes each free throw with probability $${h(10 * k)}$, independently. She takes $${n}$ free throws. What is the probability that she makes at least one?`,
            `一名篮球运动员每次罚球命中的概率是 $${h(10 * k)}$，各次相互独立。她罚球 $${n}$ 次，求至少命中一次的概率。`,
          );
          fail = t("a throw is missed", "一次罚球不中");
        }
        const q = Q.one.sub(p);
        const ans = Q.one.sub(q.pow(n));
        const np = p.mul(Q.of(n));
        const upper = np.toNumber() < 1;
        return {
          ...numberProblem({
            prompt: t(`${what.en}${simplest.en}`, `${what["zh-CN"]}${simplest["zh-CN"]}`),
            answer: ans,
            wrong: [p.mul(Q.of(n)), Q.one.sub(p.pow(n)), q.pow(n), p.pow(n)],
            solution: para(
              step(
                1,
                "the probability of failing once",
                "一次失败的概率",
                t(
                  `The probability that ${fail.en} is $1 - ${p.toLatex()} = ${q.toLatex()}$.`,
                  `${fail["zh-CN"]}的概率是 $1 - ${p.toLatex()} = ${q.toLatex()}$。`,
                ),
              ),
              step(
                2,
                "fail every time",
                "每次都失败",
                t(
                  `The trials are independent, so the one path with no success multiplies $${q.toLatex()}$ once for each of the $${n}$ trials:`,
                  `各次试验相互独立，所以没有一次成功的那条路径把 $${q.toLatex()}$ 乘了 $${n}$ 次：`,
                ),
              ),
              figureLine(0),
              step(
                3,
                "take the complement",
                "取对立事件",
                t(
                  `Every other path has at least one success:${steps(`1 - \\left(${q.toLatex()}\\right)^{${n}} = 1 - ${q.pow(n).toLatex()} = ${ans.toLatex()}`)}`,
                  `其余每条路径都至少成功一次：${steps(`1 - \\left(${q.toLatex()}\\right)^{${n}} = 1 - ${q.pow(n).toLatex()} = ${ans.toLatex()}`)}`,
                ),
              ),
              check(
                t(
                  `Estimate: $${ans.toLatex()} ${approx(ans)}$. That is at least the chance in a single trial, $${p.toLatex()} ${approx(p)}$, and ${upper ? `less than $${n} \\cdot ${p.toLatex()} ${approx(np)}$, which counts the outcomes with several successes more than once` : "at most $1$"}.`,
                  `估算：$${ans.toLatex()} ${approx(ans)}$。它不小于一次试验成功的概率 $${p.toLatex()} ${approx(p)}$，${upper ? `且小于 $${n} \\cdot ${p.toLatex()} ${approx(np)}$，后者把成功多次的结果重复计算了` : "也不超过 $1$"}。`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            slotsFigure(
              Array.from({ length: n }, () => ({ text: qs(q) })),
              { total: `= ${qs(q.pow(n))}` },
              t(
                `${n} trials, each failing with probability ${qs(q)}: together ${qs(q.pow(n))}.`,
                `${n} 次试验，每次失败的概率为 ${qs(q)}：合起来是 ${qs(q.pow(n))}。`,
              ),
            ),
          ],
        };
      },
    },
    {
      id: "exactly-k-in-three-trials",
      title: t("Exactly k successes in three trials", "三次试验中恰好 k 次成功"),
      explanation: t(
        `With three independent trials, the tree has $2 \\cdot 2 \\cdot 2 = 8$ paths. To find the probability of exactly two successes, count the paths with exactly two: $SSF$, $SFS$ and $FSS$. Each has two factors $p$ and one factor $1 - p$, in a different order, so each has the same probability $p^{2}(1 - p)$, and

$$P(\\text{exactly two}) = 3p^{2}(1 - p).$$

For $p = 0.6$, each of the three paths has probability $0.36 \\cdot 0.4 = 0.144$:

{{figure 0}}

So $P(\\text{exactly two}) = 3 \\cdot 0.144 = 0.432$. Likewise, exactly one success has probability $3p(1 - p)^{2}$.

> **Watch out.** $p^{2}(1 - p)$ is one path, a particular order; the factor $3$ counts the orders. Leaving out the factor $1 - p$ allows a third success, and exactly two is not $3p^{2}$.`,
        `三次独立试验的树状图有 $2 \\cdot 2 \\cdot 2 = 8$ 条路径。求恰好成功两次的概率，先数出恰好两次成功的路径：$SSF$、$SFS$、$FSS$。每条路径都有两个因数 $p$ 和一个因数 $1 - p$，只是顺序不同，所以概率都是 $p^{2}(1 - p)$，

$$P(\\text{恰好两次}) = 3p^{2}(1 - p).$$

当 $p = 0.6$ 时，三条路径的概率都是 $0.36 \\cdot 0.4 = 0.144$：

{{figure 0}}

所以 $P(\\text{恰好两次}) = 3 \\cdot 0.144 = 0.432$。同样，恰好成功一次的概率是 $3p(1 - p)^{2}$。

> **注意。** $p^{2}(1 - p)$ 只是一条路径，即一种特定的顺序；因数 $3$ 数的是顺序的个数。漏掉因数 $1 - p$ 就允许第三次也成功；恰好两次也不是 $3p^{2}$。`,
      ),
      figures: [
        trialsTree(
          "0.6",
          "0.4",
          [
            [0, 0, 1],
            [0, 1, 0],
            [1, 0, 0],
          ],
          "0.144",
          t(
            "A tree of three trials, each a success with 0.6 or a failure with 0.4. Marked: the three paths with exactly two successes, each 0.144.",
            "三次试验的树状图，每次成功的概率为 0.6，失败为 0.4。标出：恰好两次成功的三条路径，每条 0.144。",
          ),
        ),
      ],
      generate(rng) {
        const k = rng.int(1, 9);
        const two = rng.bool();
        const p = Q.of(k, 10);
        const q = Q.of(10 - k, 10);
        const path = two ? p.mul(p).mul(q) : p.mul(q).mul(q);
        const ans = path.mul(Q.of(3));
        const ctx = rng.pick([
          t(
            `A seed sprouts with probability $${h(10 * k)}$, independently of other seeds. Three seeds are planted. What is the probability that exactly ${two ? "two" : "one"} of them sprout${two ? "" : "s"}?`,
            `每粒种子发芽的概率是 $${h(10 * k)}$，各粒种子相互独立。种下三粒种子，求恰好有${two ? "两" : "一"}粒发芽的概率。`,
          ),
          t(
            `An archer hits the target with probability $${h(10 * k)}$ on each shot, independently. She shoots three times. What is the probability that she hits exactly ${two ? "twice" : "once"}?`,
            `一名射箭运动员每次射中靶子的概率是 $${h(10 * k)}$，各次相互独立。她射三次，求恰好射中${two ? "两" : "一"}次的概率。`,
          ),
        ]);
        const form = two ? `3 \\cdot ${dec(p)}^{2} \\cdot ${dec(q)}` : `3 \\cdot ${dec(p)} \\cdot ${dec(q)}^{2}`;
        const paths: Path[] = two
          ? [
              [0, 0, 1],
              [0, 1, 0],
              [1, 0, 0],
            ]
          : [
              [0, 1, 1],
              [1, 0, 1],
              [1, 1, 0],
            ];
        const names = two ? "SSF, SFS, FSS" : "SFF, FSF, FFS";
        const namesZh = names.replaceAll(", ", "、");
        const one = p.mul(q).mul(q).mul(Q.of(3));
        const twoP = p.mul(p).mul(q).mul(Q.of(3));
        const parts = [q.pow(3), one, twoP, p.pow(3)];
        const pathL = two ? `${dec(p)} \\cdot ${dec(p)} \\cdot ${dec(q)}` : `${dec(p)} \\cdot ${dec(q)} \\cdot ${dec(q)}`;
        return {
          ...numberProblem({
            prompt: t(`${ctx.en}${asDecimal.en}`, `${ctx["zh-CN"]}${asDecimal["zh-CN"]}`),
            answer: ans,
            form: "decimal",
            wrong: [
              path,
              two ? p.mul(p).mul(Q.of(3)) : p.mul(Q.of(3)),
              two ? p.mul(p) : p,
              two ? p.mul(q).mul(q).mul(Q.of(3)) : p.mul(p).mul(q).mul(Q.of(3)),
            ],
            solution: para(
              step(
                1,
                "count the paths",
                "数路径",
                t(
                  `Write S for a success, with probability $${dec(p)}$, and F for a failure, with probability $1 - ${dec(p)} = ${dec(q)}$. Of the $8$ paths of the tree, three have exactly ${two ? "two successes" : "one success"}: ${names}.`,
                  `用 S 表示成功，概率为 $${dec(p)}$；F 表示失败，概率为 $1 - ${dec(p)} = ${dec(q)}$。树状图的 $8$ 条路径中，恰好${two ? "两" : "一"}次成功的有三条：${namesZh}。`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "the probability of one path",
                "一条路径的概率",
                t(
                  `The trials are independent, so multiply along a path. Each of the three has the same factors in a different order: $${pathL} = ${dec(path)}$.`,
                  `各次试验相互独立，所以沿路径相乘。三条路径的因数相同，只是顺序不同：$${pathL} = ${dec(path)}$。`,
                ),
              ),
              step(
                3,
                "add the three paths",
                "把三条路径相加",
                t(
                  `Three paths of equal probability:${steps(`${form} = ${dec(ans)}`)}`,
                  `三条概率相同的路径：${steps(`${form} = ${dec(ans)}`)}`,
                ),
              ),
              check(
                t(
                  `The numbers of successes $0$, $1$, $2$ and $3$ share out all $8$ paths, so their probabilities add up to $1$: $${parts.map((x) => dec(x)).join(" + ")} = ${dec(parts.reduce((s, x) => s.add(x), Q.of(0)))}$.`,
                  `成功 $0$、$1$、$2$、$3$ 次分掉了全部 $8$ 条路径，所以它们的概率之和为 $1$：$${parts.map((x) => dec(x)).join(" + ")} = ${dec(parts.reduce((s, x) => s.add(x), Q.of(0)))}$。`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            trialsTree(
              dec(p),
              dec(q),
              paths,
              dec(path),
              t(
                `A tree of three trials, each a success S with ${dec(p)} or a failure F with ${dec(q)}. Marked: the paths ${names}, each ${dec(path)}.`,
                `三次试验的树状图，每次成功 S 的概率为 ${dec(p)}，失败 F 为 ${dec(q)}。标出：路径 ${namesZh}，每条 ${dec(path)}。`,
              ),
            ),
          ],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Combinatorics

/** groupsFigure draws groups that have nothing in common as rows of boxes, one row per group, each box marked with its group's letter. */
function groupsFigure(groups: readonly (readonly [string, number])[], alt: Text): Figure {
  return { svg: gridSvg(groups.map(([l, n]) => Array.from({ length: n }, () => ({ text: l })))), alt };
}

/** The rules of sum and product (Geometry 6.19.1). */
export const theRulesOfSumAndProduct: TopicDef = {
  id: "the-rules-of-sum-and-product",
  title: t("The Rules of Sum and Product", "加法原理与乘法原理"),
  summary: t(
    "Count choices made in sequence by multiplying and choices among separate options by adding.",
    "分步完成的选择用乘法计数，分类完成的选择用加法计数。",
  ),
  prerequisites: ["order-of-operations-with-integers"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSS.CP.B.9"],
  intro: t(
    `Counting by listing works for small cases but soon becomes slow. Two rules let us count without listing: multiply when the choices are made one after another, and add when one choice is made from separate groups.

A snack stand sells $2$ drinks, tea $T$ and juice $J$, and $3$ snacks, $A$, $B$ and $C$. A drink with a snack can be listed in a grid, one row for each drink:

{{figure 0}}

Each drink goes with each of the $3$ snacks, so the grid has $2$ rows of $3$, and $2 \\cdot 3 = 6$ pairs. But if you buy just one item, a drink or a snack, there are $2 + 3 = 5$ choices. In this lesson we learn when to multiply, when to add, and how to combine the two.`,
    `列举法适合小的情形，情形一多就很慢。两条原理让我们不必列举也能计数：选择一个接一个地做时用乘法，从几个互不相交的组中只选一个时用加法。

一个小卖部有 $2$ 种饮料，茶 $T$ 和果汁 $J$，以及 $3$ 种点心 $A$、$B$、$C$。一杯饮料配一份点心的所有搭配可以列成表，每种饮料一行：

{{figure 0}}

每种饮料都可以配 $3$ 种点心中的任意一种，所以表有 $2$ 行，每行 $3$ 个，共 $2 \\cdot 3 = 6$ 种搭配。但如果只买一样，饮料或点心，就有 $2 + 3 = 5$ 种选择。这节课我们学习什么时候相乘、什么时候相加，以及如何把两者结合起来。`,
  ),
  introFigures: [
    {
      svg: gridSvg(["T", "J"].map((d) => ["A", "B", "C"].map((s) => ({ text: `${d} ${s}` })))),
      alt: t("A grid of 2 rows and 3 columns: T A, T B, T C; J A, J B, J C.", "两行三列的表：T A、T B、T C；J A、J B、J C。"),
    },
  ],
  knowledgePoints: [
    {
      id: "rule-of-product",
      title: t("The rule of product", "乘法原理"),
      explanation: t(
        `**The rule of product.** If one choice can be made in $m$ ways and then, whatever it was, a second choice in $n$ ways, the two choices together can be made in $m \\cdot n$ ways. The reason is the grid: each of the $m$ first choices starts a row of $n$ pairs, and $m$ rows of $n$ make $m \\cdot n$. The rule extends to any number of steps.

With $4$ shirts, $3$ pairs of pants and $2$ pairs of shoes, write one box for each step and the number of ways to make it:

{{figure 0}}

Each of the $4 \\cdot 3 = 12$ shirt-and-pants pairs goes with each of the $2$ pairs of shoes, so there are $12 \\cdot 2 = 24$ outfits. Likewise a code of $3$ digits, each any of the $10$ digits, can be chosen in $10 \\cdot 10 \\cdot 10 = 1000$ ways: $000$ to $999$.

> **Watch out.** Multiply only when every choice is made: one shirt *and* one pair of pants *and* one pair of shoes. Adding, $4 + 3 + 2 = 9$, counts items, not outfits. And the number of ways for a step must not depend on what was chosen before.`,
        `**乘法原理**：如果完成一件事要分两步，第一步有 $m$ 种方法，不论第一步怎样选，第二步都有 $n$ 种方法，那么完成这件事共有 $m \\cdot n$ 种方法。道理就在表里：$m$ 种第一步的选法各开出一行，每行 $n$ 种，$m$ 行共 $m \\cdot n$ 种。步数更多时同理。

有 $4$ 件衬衫、$3$ 条裤子、$2$ 双鞋，每一步画一个格子，写上这一步的选法数：

{{figure 0}}

$4 \\cdot 3 = 12$ 种衬衫与裤子的组合，每一种都可以配 $2$ 双鞋中的任意一双，所以共有 $12 \\cdot 2 = 24$ 种搭配。同样，$3$ 位的密码，每一位可以是 $10$ 个数字中的任意一个，共有 $10 \\cdot 10 \\cdot 10 = 1000$ 种：从 $000$ 到 $999$。

> **注意。** 只有每一步都要做时才相乘：一件衬衫*并且*一条裤子*并且*一双鞋。相加得 $4 + 3 + 2 = 9$，数的是衣物件数，不是搭配数。而且每一步的选法数不能随前面的选择而变。`,
      ),
      figures: [
        slotsFigure(
          countSlots(4, 3),
          { total: "= 24" },
          t("Three boxes for shirt, pants and shoes: 4 · 3 · 2 = 24.", "衬衫、裤子、鞋三个格子：4 · 3 · 2 = 24。"),
        ),
      ],
      generate(rng) {
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const [s, p, k] = [rng.int(2, 9), rng.int(2, 9), rng.int(2, 6)];
          const three = rng.bool();
          const ans = three ? s * p * k : s * p;
          const rest = three ? p * k : p;
          return {
            ...numberProblem({
              prompt: three
                ? t(
                    `Sam has ${s} shirts, ${p} pairs of pants and ${k} pairs of shoes. An outfit is one shirt, one pair of pants and one pair of shoes. How many different outfits can Sam make?`,
                    `萨姆有 ${s} 件衬衫、${p} 条裤子和 ${k} 双鞋。一套搭配由一件衬衫、一条裤子和一双鞋组成。萨姆一共能搭配出多少种不同的服装？`,
                  )
                : t(
                    `Sam has ${s} shirts and ${p} pairs of pants. An outfit is one shirt and one pair of pants. How many different outfits can Sam make?`,
                    `萨姆有 ${s} 件衬衫和 ${p} 条裤子。一套搭配由一件衬衫和一条裤子组成。萨姆一共能搭配出多少种不同的服装？`,
                  ),
              answer: ans,
              wrong: three ? [s + p + k, s * p, s * p + k] : [s + p, s * p * 2],
              solution: para(
                step(
                  1,
                  "the steps",
                  "分步",
                  three
                    ? t(
                        `An outfit is made in three steps: a shirt in $${s}$ ways, then pants in $${p}$ ways, then shoes in $${k}$ ways, whatever was chosen before.`,
                        `一套搭配分三步完成：衬衫有 $${s}$ 种选法，然后裤子有 $${p}$ 种，再然后鞋有 $${k}$ 种，不论前面怎样选。`,
                      )
                    : t(
                        `An outfit is made in two steps: a shirt in $${s}$ ways, then pants in $${p}$ ways, whatever the shirt.`,
                        `一套搭配分两步完成：衬衫有 $${s}$ 种选法，然后裤子有 $${p}$ 种，不论选了哪件衬衫。`,
                      ),
                ),
                figureLine(0),
                step(
                  2,
                  "multiply",
                  "相乘",
                  t(
                    `Each choice can follow each earlier one, so multiply:${steps(three ? `${s} \\cdot ${p} \\cdot ${k} = ${ans}` : `${s} \\cdot ${p} = ${ans}`)}`,
                    `每一步的每种选法都可以接在前面任何一种选法之后，所以相乘：${steps(three ? `${s} \\cdot ${p} \\cdot ${k} = ${ans}` : `${s} \\cdot ${p} = ${ans}`)}`,
                  ),
                ),
                check(
                  three
                    ? t(
                        `Fix one shirt: it goes with $${p} \\cdot ${k} = ${rest}$ choices of pants and shoes. Each of the $${s}$ shirts gives the same number, so $${s} \\cdot ${rest} = ${ans}$.`,
                        `固定一件衬衫：它可以配 $${p} \\cdot ${k} = ${rest}$ 种裤子和鞋的组合。$${s}$ 件衬衫各有这么多种，所以 $${s} \\cdot ${rest} = ${ans}$。`,
                      )
                    : t(
                        `Fix one shirt: it makes $${p}$ outfits, one with each pair of pants. The $${s}$ shirts give $${s}$ such rows, and adding them, $${Array(s).fill(p).join(" + ")} = ${ans}$.`,
                        `固定一件衬衫：它和每条裤子各配一套，共 $${p}$ 套。$${s}$ 件衬衫给出 $${s}$ 行，相加得 $${Array(s).fill(p).join(" + ")} = ${ans}$。`,
                      ),
                ),
              ),
            }),
            solutionFigures: [
              slotsFigure(
                (three ? [s, p, k] : [s, p]).map((x) => ({ text: String(x) })),
                { total: `= ${ans}` },
                t(
                  `One box for each step: ${three ? `${s} · ${p} · ${k}` : `${s} · ${p}`} = ${ans}.`,
                  `每一步一个格子：${three ? `${s} · ${p} · ${k}` : `${s} · ${p}`} = ${ans}。`,
                ),
              ),
            ],
          };
        }
        if (kind === 1) {
          const [a, b, c] = [rng.int(3, 8), rng.int(3, 12), rng.int(2, 9)];
          const ans = a * b * c;
          return {
            ...numberProblem({
              prompt: t(
                `A café offers ${a} starters, ${b} main courses and ${c} desserts. A set meal is one of each. How many different set meals are there?`,
                `一家餐馆提供 ${a} 种前菜、${b} 种主菜和 ${c} 种甜点。一份套餐包括每类各一种。共有多少种不同的套餐？`,
              ),
              answer: ans,
              wrong: [a + b + c, a * b + c, a * b],
              solution: para(
                step(
                  1,
                  "the steps",
                  "分步",
                  t(
                    `A set meal takes three steps: a starter in $${a}$ ways, a main course in $${b}$ ways and a dessert in $${c}$ ways. Any starter can go with any main course and any dessert.`,
                    `一份套餐分三步：前菜 $${a}$ 种、主菜 $${b}$ 种、甜点 $${c}$ 种。任何前菜都可以配任何主菜和任何甜点。`,
                  ),
                ),
                figureLine(0),
                step(
                  2,
                  "multiply",
                  "相乘",
                  t(
                    `Choose one of each in turn and multiply:${steps(`${a} \\cdot ${b} \\cdot ${c} = ${ans}`)}`,
                    `依次各选一种，相乘：${steps(`${a} \\cdot ${b} \\cdot ${c} = ${ans}`)}`,
                  ),
                ),
                check(
                  t(
                    `Fix the dessert: there are $${a} \\cdot ${b} = ${a * b}$ meals with it. Each of the $${c}$ desserts gives as many, so $${a * b} \\cdot ${c} = ${ans}$.`,
                    `固定甜点：含这种甜点的套餐有 $${a} \\cdot ${b} = ${a * b}$ 种。$${c}$ 种甜点各有这么多，所以 $${a * b} \\cdot ${c} = ${ans}$。`,
                  ),
                ),
              ),
            }),
            solutionFigures: [
              slotsFigure(
                [a, b, c].map((x) => ({ text: String(x) })),
                { total: `= ${ans}` },
                t(`Starter, main course, dessert: ${a} · ${b} · ${c} = ${ans}.`, `前菜、主菜、甜点：${a} · ${b} · ${c} = ${ans}。`),
              ),
            ],
          };
        }
        const L = rng.int(1, 2);
        const D = rng.int(2, 4);
        const ans = 26 ** L * 10 ** D;
        const factors = [...Array(L).fill("26"), ...Array(D).fill("10")].join(" \\cdot ");
        const letters = 26 ** L;
        return {
          ...numberProblem({
            prompt: t(
              `A code is made of ${L === 1 ? "one letter" : `${L} letters`} (A to Z) followed by ${D} digits (0 to 9). Letters and digits may repeat. How many different codes are there?`,
              `一个编号由 ${L} 个字母（A 到 Z）后接 ${D} 个数字（0 到 9）组成，字母和数字都可以重复。共有多少种不同的编号？`,
            ),
            answer: ans,
            wrong: [26 * L + 10 * D, 26 * L * 10 * D, 26 + 10 ** D],
            solution: para(
              step(
                1,
                "one step for each position",
                "每个位置一步",
                t(
                  `Each of the ${L + D} positions is one step: $26$ ways for a letter and $10$ for a digit, whatever is in the other positions, since letters and digits may repeat.`,
                  `${L + D} 个位置各是一步：字母有 $26$ 种，数字有 $10$ 种，与其他位置无关，因为字母和数字都可以重复。`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "multiply",
                "相乘",
                t(
                  `Multiply the numbers of ways:${steps(`${factors} = ${big(ans)}`)}`,
                  `把各步的方法数相乘：${steps(`${factors} = ${big(ans)}`)}`,
                ),
              ),
              check(
                t(
                  `The digits alone run from ${"0".repeat(D)} to ${"9".repeat(D)}: that is $10^{${D}} = ${big(10 ** D)}$ endings. Each of the $${letters}$ ${L === 1 ? "letters" : "pairs of letters"} starts that many codes, and $${letters} \\cdot ${big(10 ** D)} = ${big(ans)}$.`,
                  `只看数字部分，从 ${"0".repeat(D)} 到 ${"9".repeat(D)}，共 $10^{${D}} = ${big(10 ** D)}$ 种结尾。$${letters}$ 种${L === 1 ? "字母" : "字母组合"}各开头这么多个编号，$${letters} \\cdot ${big(10 ** D)} = ${big(ans)}$。`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            slotsFigure(
              [...Array(L).fill("26"), ...Array(D).fill("10")].map((x: string) => ({ text: x })),
              {},
              t(
                `One box for each position: ${[...Array(L).fill("26"), ...Array(D).fill("10")].join(" · ")}.`,
                `每个位置一个格子：${[...Array(L).fill("26"), ...Array(D).fill("10")].join(" · ")}。`,
              ),
            ),
          ],
        };
      },
    },
    {
      id: "rule-of-sum",
      title: t("The rule of sum", "加法原理"),
      explanation: t(
        `**The rule of sum.** If a choice is made from one of several groups that have nothing in common, the number of ways is the sum of the sizes of the groups. Each way of choosing lies in exactly one group, so counting the groups one after another counts every way once.

To pick one book to read from $7$ novels $N$ and $5$ comics $C$:

{{figure 0}}

There are $7 + 5 = 12$ choices: you choose one book, not one of each kind. Use the product when you make one choice *and then* another; use the sum when you make one choice *or* another.

> **Watch out.** The groups must have nothing in common. If $2$ of the books were both novels and comics, adding would count them twice, and there would be $12 - 2 = 10$ books. And $7 \\cdot 5 = 35$ would count pairs of books, one of each kind.`,
        `**加法原理**：如果从几个没有公共元素的组中只选一个，选法总数是各组元素个数之和。每一种选法恰好属于一个组，所以把各组依次数一遍，每种选法都恰好数到一次。

从 $7$ 本小说 $N$ 和 $5$ 本漫画 $C$ 中挑一本来读：

{{figure 0}}

有 $7 + 5 = 12$ 种选法：只选一本，而不是每类各选一本。先选一个*再*选一个时用乘法；选这一个*或*那一个时用加法。

> **注意。** 各组不能有公共元素。如果有 $2$ 本书既算小说又算漫画，相加就把它们数了两次，书实际只有 $12 - 2 = 10$ 本。而 $7 \\cdot 5 = 35$ 数的是每类各一本的配对。`,
      ),
      figures: [
        groupsFigure(
          [
            ["N", 7],
            ["C", 5],
          ],
          t("A row of 7 boxes N and a row of 5 boxes C: 12 boxes in all.", "一行 7 个 N 格子，一行 5 个 C 格子：共 12 个。"),
        ),
      ],
      generate(rng) {
        const three = rng.bool();
        const [a, b, c] = [rng.int(2, 15), rng.int(2, 15), rng.int(2, 15)];
        const ans = three ? a + b + c : a + b;
        const ctx = rng.int(0, 1);
        const prompt =
          ctx === 0
            ? three
              ? t(
                  `A shelf holds ${a} novels, ${b} comics and ${c} magazines. In how many ways can Lin choose one item to read?`,
                  `书架上有 ${a} 本小说、${b} 本漫画和 ${c} 本杂志。林从中选一本来读，有多少种选法？`,
                )
              : t(
                  `A shelf holds ${a} novels and ${b} comics. In how many ways can Lin choose one book to read?`,
                  `书架上有 ${a} 本小说和 ${b} 本漫画。林从中选一本来读，有多少种选法？`,
                )
            : three
              ? t(
                  `A school club can be chosen from ${a} sports clubs, ${b} music clubs or ${c} art clubs. Each student joins exactly one club. How many choices does a student have?`,
                  `学生可以从 ${a} 个体育社团、${b} 个音乐社团或 ${c} 个美术社团中选择。每名学生只参加一个社团。一名学生有多少种选择？`,
                )
              : t(
                  `A student joins exactly one club, either one of ${a} sports clubs or one of ${b} music clubs. How many choices does the student have?`,
                  `一名学生只参加一个社团，可以从 ${a} 个体育社团或 ${b} 个音乐社团中选。他有多少种选择？`,
                );
        const kinds =
          ctx === 0
            ? [t("novels", "小说"), t("comics", "漫画"), t("magazines", "杂志")]
            : [t("sports clubs", "体育社团"), t("music clubs", "音乐社团"), t("art clubs", "美术社团")];
        const letters = ctx === 0 ? ["N", "C", "M"] : ["S", "M", "A"];
        const sizes = three ? [a, b, c] : [a, b];
        const listEn = sizes.map((x, i) => `$${x}$ ${kinds[i]!.en}`).join(three ? ", " : " and ");
        const listZh = sizes.map((x, i) => `$${x}$ ${ctx === 0 ? "本" : "个"}${kinds[i]!["zh-CN"]}`).join("、");
        const firstTwo = a + b;
        return {
          ...numberProblem({
            prompt,
            answer: ans,
            wrong: three ? [a * b * c, a + b, a * b + c] : [a * b, a + b - 1],
            solution: para(
              step(
                1,
                "the groups",
                "分组",
                t(
                  `Only one ${ctx === 0 ? "item" : "club"} is chosen, and it belongs to exactly one of the groups: ${listEn}${three ? "," : ""} with nothing in common.`,
                  `只选一${ctx === 0 ? "本" : "个社团"}，它恰好属于其中一组：${listZh}，各组没有公共元素。`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "add",
                "相加",
                t(
                  `Count the groups one after another and add:${steps(three ? `${a} + ${b} + ${c} = ${ans}` : `${a} + ${b} = ${ans}`)}`,
                  `把各组依次数完，相加：${steps(three ? `${a} + ${b} + ${c} = ${ans}` : `${a} + ${b} = ${ans}`)}`,
                ),
              ),
              check(
                three
                  ? t(
                      `Number the choices in turn: the ${kinds[0]!.en} get $1$ to $${a}$, the ${kinds[1]!.en} $${a + 1}$ to $${firstTwo}$, and the ${kinds[2]!.en} $${firstTwo + 1}$ to $${ans}$. The last number is the count, $${ans}$, and it is less than the product $${a * b * c}$, which counts one of each kind.`,
                      `给选法依次编号：${kinds[0]!["zh-CN"]}是 $1$ 到 $${a}$，${kinds[1]!["zh-CN"]}是 $${a + 1}$ 到 $${firstTwo}$，${kinds[2]!["zh-CN"]}是 $${firstTwo + 1}$ 到 $${ans}$。最后一个编号就是总数 $${ans}$，它小于乘积 $${a * b * c}$，后者数的是每类各选一个。`,
                    )
                  : t(
                      `Number the choices in turn: the ${kinds[0]!.en} get $1$ to $${a}$ and the ${kinds[1]!.en} $${a + 1}$ to $${ans}$. The last number is the count, $${ans}$.`,
                      `给选法依次编号：${kinds[0]!["zh-CN"]}是 $1$ 到 $${a}$，${kinds[1]!["zh-CN"]}是 $${a + 1}$ 到 $${ans}$。最后一个编号就是总数 $${ans}$。`,
                    ),
              ),
            ),
          }),
          solutionFigures: [
            groupsFigure(
              sizes.map((x, i) => [letters[i]!, x] as const),
              t(
                `One row of boxes for each group: ${sizes.map((x, i) => `${x} ${letters[i]}`).join(", ")}; ${ans} boxes in all.`,
                `每组一行格子：${sizes.map((x, i) => `${x} 个 ${letters[i]}`).join("、")}；共 ${ans} 个。`,
              ),
            ),
          ],
        };
      },
    },
    {
      id: "combining-sum-and-product",
      title: t("Combining the rules", "综合运用两个原理"),
      explanation: t(
        `Many problems split into cases that do not overlap (add) and count each case in steps (multiply). First decide the cases, then count each one.

There are $3$ roads from town A to town B, $4$ roads from B to C, and $2$ direct roads from A to C. A trip from A to C goes either through B or directly:

{{figure 0}}

Through B is two steps, $3 \\cdot 4 = 12$ ways; directly is one step, $2$ ways. Each route is one or the other, so there are $12 + 2 = 14$ routes.

> **Watch out.** Multiply inside a case, add between cases. $3 \\cdot 4 \\cdot 2 = 24$ treats the direct roads as a third step, and $(3 + 2) \\cdot 4$ sends the direct roads on through B.`,
        `很多问题要先分成互不重叠的几类（相加），每一类再分步计数（相乘）。先定好分类，再逐类计数。

从 A 镇到 B 镇有 $3$ 条路，从 B 到 C 有 $4$ 条路，从 A 直达 C 有 $2$ 条路。从 A 到 C 要么经过 B，要么直达：

{{figure 0}}

经过 B 分两步，有 $3 \\cdot 4 = 12$ 种走法；直达只一步，有 $2$ 种。每条路线属于其中一类，所以共有 $12 + 2 = 14$ 种路线。

> **注意。** 类内相乘，类间相加。$3 \\cdot 4 \\cdot 2 = 24$ 把直达的路当成了第三步；$(3 + 2) \\cdot 4$ 则让直达的路又经过 B 继续走。`,
      ),
      figures: [
        slotsFigure(
          [{ text: "3" }, { text: "4" }, { text: "2", tone: "action" }],
          { ops: ["·", "+"], total: "= 14" },
          t("Through B, 3 · 4, plus directly, 2: 14 routes.", "经过 B 的 3 · 4，加上直达的 2：14 种路线。"),
        ),
      ],
      generate(rng) {
        const [a, b, c] = [rng.int(2, 6), rng.int(2, 6), rng.int(1, 5)];
        const ans = a * b + c;
        const fig = (en: string, zh: string): Figure =>
          slotsFigure(
            [{ text: String(a) }, { text: String(b) }, { text: String(c), tone: "action" }],
            { ops: ["·", "+"], total: `= ${ans}` },
            t(`${en}: ${a} · ${b} + ${c} = ${ans}.`, `${zh}：${a} · ${b} + ${c} = ${ans}。`),
          );
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(
                `There are ${a} roads from town A to town B, ${b} roads from town B to town C, and ${c} direct road${c === 1 ? "" : "s"} from town A to town C. How many different routes are there from A to C that pass through each town at most once?`,
                `从 A 镇到 B 镇有 ${a} 条路，从 B 镇到 C 镇有 ${b} 条路，从 A 镇直达 C 镇有 ${c} 条路。从 A 到 C，每个镇最多经过一次，共有多少种不同的路线？`,
              ),
              answer: ans,
              wrong: [a + b + c, a * b * c, a * b, (a + c) * b],
              solution: para(
                step(
                  1,
                  "split into cases",
                  "分类",
                  t(
                    `A route goes through B or directly, never both. Through B takes two steps, A to B and then B to C: $${a} \\cdot ${b} = ${a * b}$ routes. Directly takes one step: $${c}$ route${c === 1 ? "" : "s"}.`,
                    `路线要么经过 B，要么直达，不会两者都是。经过 B 分两步，A 到 B 再 B 到 C：$${a} \\cdot ${b} = ${a * b}$ 种；直达只一步：$${c}$ 种。`,
                  ),
                ),
                figureLine(0),
                step(
                  2,
                  "add the cases",
                  "各类相加",
                  t(
                    `The cases do not overlap, so add:${steps(`${a * b} + ${c} = ${ans}`)}`,
                    `两类不重叠，所以相加：${steps(`${a * b} + ${c} = ${ans}`)}`,
                  ),
                ),
                check(
                  t(
                    `Group the routes by the last road into C instead. Each of the $${b}$ roads from B is reached by $${a}$ routes from A, and each direct road is one route: $${b} \\cdot ${a} + ${c} = ${ans}$.`,
                    `改按进入 C 的最后一条路来分组。从 B 出发的 $${b}$ 条路，每条前面都有 $${a}$ 种从 A 来的走法；每条直达的路是一种路线：$${b} \\cdot ${a} + ${c} = ${ans}$。`,
                  ),
                ),
              ),
            }),
            solutionFigures: [fig("Through B plus directly", "经过 B 加上直达")],
          };
        }
        return {
          ...numberProblem({
            prompt: t(
              `For lunch, Ava has either a sandwich and a drink, or a salad on its own. There are ${a} kinds of sandwich, ${b} kinds of drink and ${c} kind${c === 1 ? "" : "s"} of salad. How many different lunches can she have?`,
              `午餐时，阿娃要么吃一份三明治配一杯饮料，要么只吃一份沙拉。三明治有 ${a} 种，饮料有 ${b} 种，沙拉有 ${c} 种。她共有多少种不同的午餐选择？`,
            ),
            answer: ans,
            wrong: [a + b + c, a * b * c, a * b, (a + c) * b],
            solution: para(
              step(
                1,
                "split into cases",
                "分类",
                t(
                  `A lunch is a sandwich with a drink, or a salad, never both. The first case takes two steps: $${a} \\cdot ${b} = ${a * b}$ lunches. The second takes one: $${c}$ lunch${c === 1 ? "" : "es"}.`,
                  `午餐要么是三明治配饮料，要么是沙拉，不会两者都是。第一类分两步：$${a} \\cdot ${b} = ${a * b}$ 种；第二类只一步：$${c}$ 种。`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "add the cases",
                "各类相加",
                t(`Add the two cases:${steps(`${a * b} + ${c} = ${ans}`)}`, `两类相加：${steps(`${a * b} + ${c} = ${ans}`)}`),
              ),
              check(
                t(
                  `Group the sandwich lunches by the drink instead: each of the $${b}$ drinks goes with $${a}$ sandwiches. With the salads, $${b} \\cdot ${a} + ${c} = ${ans}$.`,
                  `改按饮料给三明治午餐分组：$${b}$ 种饮料各配 $${a}$ 种三明治。再加上沙拉，$${b} \\cdot ${a} + ${c} = ${ans}$。`,
                ),
              ),
            ),
          }),
          solutionFigures: [fig("Sandwich and drink, plus salad", "三明治配饮料，加上沙拉")],
        };
      },
    },
  ],
};

/** factL writes n! expanded: "5 \cdot 4 \cdot 3 \cdot 2 \cdot 1". */
const factL = (n: number) => (n <= 1 ? "1" : prodL(n, n));

/** Factorials (Geometry 6.19.2). */
export const factorials: TopicDef = {
  id: "factorials",
  title: t("Factorials", "阶乘"),
  summary: t("Evaluate factorials, including 0!, and simplify quotients of factorials.", "计算阶乘（包括 0!），并化简阶乘的商。"),
  prerequisites: ["the-rules-of-sum-and-product", "equivalent-fractions"],
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSS.CP.B.9"],
  intro: t(
    `In how many orders can $3$ books $A$, $B$ and $C$ stand on a shelf? List them by the first book:

{{figure 0}}

There are $3$ choices for the first place, then $2$ for the second, then $1$ for the last, so by the rule of product $3 \\cdot 2 \\cdot 1 = 6$ orders, one row for each first book. Products like $3 \\cdot 2 \\cdot 1$ come up so often in counting that they have a name and a sign: the factorial, $3! = 6$. In this lesson we evaluate factorials and simplify quotients of them without multiplying everything out.`,
    `$3$ 本书 $A$、$B$、$C$ 立在书架上，有多少种排列顺序？按第一本书分行列出：

{{figure 0}}

第一个位置有 $3$ 种选法，第二个位置有 $2$ 种，最后一个位置只有 $1$ 种，由乘法原理共有 $3 \\cdot 2 \\cdot 1 = 6$ 种顺序，每种第一本书占一行。$3 \\cdot 2 \\cdot 1$ 这样的乘积在计数中经常出现，所以有专门的名称和记号：阶乘，$3! = 6$。这节课我们计算阶乘，并且不必把所有数都乘出来就能化简阶乘的商。`,
  ),
  introFigures: [
    {
      svg: gridSvg([
        [{ text: "A B C" }, { text: "A C B" }],
        [{ text: "B A C" }, { text: "B C A" }],
        [{ text: "C A B" }, { text: "C B A" }],
      ]),
      alt: t("The 6 orders, by the first book: ABC, ACB; BAC, BCA; CAB, CBA.", "按第一本书列出的 6 种顺序：ABC、ACB；BAC、BCA；CAB、CBA。"),
    },
  ],
  knowledgePoints: [
    {
      id: "evaluating-factorials",
      title: t("Evaluating factorials", "计算阶乘"),
      explanation: t(
        `For a positive integer $n$, **$n$ factorial** is the product of the integers from $n$ down to $1$:

$$n! = n \\cdot (n - 1) \\cdot \\ldots \\cdot 2 \\cdot 1.$$

It counts the orders of $n$ objects: $n$ choices for the first place, $n - 1$ for the next, and so on. For $5$ objects:

{{figure 0}}

So $5! = 120$. The first factor times the rest gives $n! = n \\cdot (n - 1)!$, here $5! = 5 \\cdot 4! = 5 \\cdot 24 = 120$. With $n = 1$ it reads $1! = 1 \\cdot 0!$, which is why $0! = 1$ by definition (and $1! = 1$).

> **Watch out.** The factorial applies only to the number just before it: $2 \\cdot 3! = 2 \\cdot 6 = 12$, not $6! = 720$, and $3! + 2! = 6 + 2 = 8$, not $5! = 120$. And $0!$ is $1$, not $0$.`,
        `对正整数 $n$，**$n$ 的阶乘**是从 $n$ 到 $1$ 的所有整数的乘积：

$$n! = n \\cdot (n - 1) \\cdot \\ldots \\cdot 2 \\cdot 1.$$

它数的是 $n$ 个物体的排列顺序：第一个位置有 $n$ 种选法，下一个有 $n - 1$ 种，依此类推。$5$ 个物体时：

{{figure 0}}

所以 $5! = 120$。第一个因数乘以其余部分，得到 $n! = n \\cdot (n - 1)!$，这里 $5! = 5 \\cdot 4! = 5 \\cdot 24 = 120$。取 $n = 1$，得 $1! = 1 \\cdot 0!$，所以规定 $0! = 1$（$1! = 1$）。

> **注意。** 阶乘只作用于紧挨在它前面的数：$2 \\cdot 3! = 2 \\cdot 6 = 12$，而不是 $6! = 720$；$3! + 2! = 6 + 2 = 8$，而不是 $5! = 120$。$0!$ 等于 $1$，不是 $0$。`,
      ),
      figures: [
        slotsFigure(
          countSlots(5, 5),
          { total: "= 120" },
          t("Five places, with 5, 4, 3, 2 and 1 choices: 120.", "五个位置，依次有 5、4、3、2、1 种选法：120。"),
        ),
      ],
      generate(rng) {
        const kind = rng.int(0, 3);
        if (kind === 0) {
          const n = rng.int(0, 8);
          if (n <= 1) {
            return numberProblem({
              prompt: t(`Evaluate $${n}!$.`, `计算 $${n}!$。`),
              answer: fact(n),
              wrong: [n, n * (n - 1), (n * (n + 1)) / 2, n === 0 ? 0 : fact(n - 1)],
              solution: para(
                step(
                  1,
                  "the rule",
                  "规律",
                  n === 0
                    ? t(
                        "The factorial of zero has no factors to multiply. Its value comes from the rule $n! = n \\cdot (n - 1)!$ with $n = 1$: $1! = 1 \\cdot 0!$.",
                        "零的阶乘没有因数可乘。它的值来自规律 $n! = n \\cdot (n - 1)!$ 取 $n = 1$：$1! = 1 \\cdot 0!$。",
                      )
                    : t(
                        "The product of the integers from $1$ down to $1$ has the single factor $1$.",
                        "从 $1$ 到 $1$ 的整数之积只有一个因数 $1$。",
                      ),
                ),
                step(
                  2,
                  "the value",
                  "求值",
                  n === 0
                    ? t(
                        `Since $1! = 1$, this says $1 = 0!$, and by definition${steps("0! = 1")}`,
                        `因为 $1! = 1$，这就是 $1 = 0!$，按规定${steps("0! = 1")}`,
                      )
                    : t(`So${steps("1! = 1")}`, `所以${steps("1! = 1")}`),
                ),
                check(
                  t(
                    "Divide down the factorials: $\\frac{3!}{3} = 2! = 2$, $\\frac{2!}{2} = 1! = 1$, $\\frac{1!}{1} = 0! = 1$. Both $1!$ and $0!$ are $1$.",
                    "把阶乘逐个往下除：$\\frac{3!}{3} = 2! = 2$，$\\frac{2!}{2} = 1! = 1$，$\\frac{1!}{1} = 0! = 1$。$1!$ 和 $0!$ 都是 $1$。",
                  ),
                ),
              ),
            });
          }
          return {
            ...numberProblem({
              prompt: t(`Evaluate $${n}!$.`, `计算 $${n}!$。`),
              answer: fact(n),
              wrong: [n, n * (n - 1), (n * (n + 1)) / 2, n === 0 ? 0 : fact(n - 1)],
              solution: para(
                step(
                  1,
                  "the factors",
                  "因数",
                  t(
                    `$${n}!$ is the product of the integers from $${n}$ down to $1$, one factor for each of $${n}$ places:`,
                    `$${n}!$ 是从 $${n}$ 到 $1$ 的整数之积，$${n}$ 个位置各一个因数：`,
                  ),
                ),
                figureLine(0),
                step(
                  2,
                  "multiply",
                  "相乘",
                  t(
                    `Multiply:${steps(`${n}! = ${factL(n)} = ${big(fact(n))}`)}`,
                    `相乘：${steps(`${n}! = ${factL(n)} = ${big(fact(n))}`)}`,
                  ),
                ),
                check(
                  t(
                    `Use $n! = n \\cdot (n - 1)!$: $${n} \\cdot ${n - 1}! = ${n} \\cdot ${big(fact(n - 1))} = ${big(fact(n))}$.`,
                    `用 $n! = n \\cdot (n - 1)!$：$${n} \\cdot ${n - 1}! = ${n} \\cdot ${big(fact(n - 1))} = ${big(fact(n))}$。`,
                  ),
                ),
              ),
            }),
            solutionFigures: [
              slotsFigure(
                countSlots(n, n),
                { total: `= ${fact(n)}` },
                t(
                  `${n} places: ${factL(n).replaceAll(" \\cdot ", " · ")} = ${fact(n)}.`,
                  `${n} 个位置：${factL(n).replaceAll(" \\cdot ", " · ")} = ${fact(n)}。`,
                ),
              ),
            ],
          };
        }
        if (kind === 1) {
          const a = rng.int(2, 5);
          const n = rng.int(2, 6);
          const ans = a * fact(n);
          return numberProblem({
            prompt: t(`Evaluate $${a} \\cdot ${n}!$.`, `计算 $${a} \\cdot ${n}!$。`),
            answer: ans,
            wrong: [fact(a * n), a * n, fact(a) * fact(n)],
            solution: para(
              step(
                1,
                "the factorial first",
                "先算阶乘",
                t(
                  `The factorial applies to $${n}$ only, not to $${a} \\cdot ${n}$:${steps(`${n}! = ${factL(n)} = ${fact(n)}`)}`,
                  `阶乘只作用于 $${n}$，而不是 $${a} \\cdot ${n}$：${steps(`${n}! = ${factL(n)} = ${fact(n)}`)}`,
                ),
              ),
              step(
                2,
                "multiply",
                "相乘",
                t(
                  `Then multiply by $${a}$:${steps(`${a} \\cdot ${n}! = ${a} \\cdot ${fact(n)} = ${ans}`)}`,
                  `再乘以 $${a}$：${steps(`${a} \\cdot ${n}! = ${a} \\cdot ${fact(n)} = ${ans}`)}`,
                ),
              ),
              check(
                t(
                  `Divide back: $${ans} \\div ${a} = ${fact(n)}$, and $${fact(n)} = ${n} \\cdot ${fact(n - 1)} = ${n} \\cdot ${n - 1}!$, which is $${n}!$.`,
                  `反过来除：$${ans} \\div ${a} = ${fact(n)}$，而 $${fact(n)} = ${n} \\cdot ${fact(n - 1)} = ${n} \\cdot ${n - 1}!$，正是 $${n}!$。`,
                ),
              ),
            ),
          });
        }
        const n = rng.int(3, 7);
        const m = rng.int(1, n - 1);
        const plus = kind === 2;
        const ans = plus ? fact(n) + fact(m) : fact(n) - fact(m);
        const op = plus ? "+" : "-";
        const q = fact(n) / fact(m);
        return numberProblem({
          prompt: t(`Evaluate $${n}! ${op} ${m}!$.`, `计算 $${n}! ${op} ${m}!$。`),
          answer: ans,
          wrong: [plus ? fact(n + m) : fact(n - m), plus ? n + m : n - m, fact(n) * fact(m)],
          solution: para(
            step(
              1,
              "each factorial",
              "每个阶乘",
              t(
                `A factorial is not shared across ${plus ? "a sum" : "a difference"}, so evaluate each one first: $${n}! = ${fact(n)}$ and $${m}! = ${fact(m)}$.`,
                `阶乘不能对${plus ? "和" : "差"}合并，所以先分别计算每个阶乘：$${n}! = ${fact(n)}$，$${m}! = ${fact(m)}$。`,
              ),
            ),
            step(
              2,
              plus ? "add" : "subtract",
              plus ? "相加" : "相减",
              t(
                `Then ${plus ? "add" : "subtract"}:${steps(`${n}! ${op} ${m}! = ${fact(n)} ${op} ${fact(m)} = ${ans}`)}`,
                `再${plus ? "相加" : "相减"}：${steps(`${n}! ${op} ${m}! = ${fact(n)} ${op} ${fact(m)} = ${ans}`)}`,
              ),
            ),
            check(
              t(
                `Factor out $${m}!$: since $${n}! = ${prodL(n, n - m)} \\cdot ${m}! = ${q} \\cdot ${m}!$,${steps(`${n}! ${op} ${m}! = ${m}! \\cdot (${q} ${op} 1) = ${fact(m)} \\cdot ${plus ? q + 1 : q - 1} = ${ans}`)}`,
                `提出 $${m}!$：因为 $${n}! = ${prodL(n, n - m)} \\cdot ${m}! = ${q} \\cdot ${m}!$，${steps(`${n}! ${op} ${m}! = ${m}! \\cdot (${q} ${op} 1) = ${fact(m)} \\cdot ${plus ? q + 1 : q - 1} = ${ans}`)}`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "quotients-of-factorials",
      title: t("Quotients of factorials", "阶乘的商"),
      explanation: t(
        `To divide factorials, write the larger one until the smaller one appears, and cancel. This works because the smaller factorial is the tail of the larger one: $9!$ is $9 \\cdot 8 \\cdot 7$ followed by $6 \\cdot 5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = 6!$.

{{figure 0}}

So

$$\\frac{9!}{6!} = \\frac{9 \\cdot 8 \\cdot 7 \\cdot 6!}{6!} = 9 \\cdot 8 \\cdot 7 = 504.$$

This is much quicker than computing $9! = 362\\,880$ and $6! = 720$. What is left is $9 - 6 = 3$ factors, from $9$ down.

> **Watch out.** $\\frac{9!}{6!}$ is not $3!$ and not $\\left(\\frac{9}{6}\\right)!$: factorials do not divide like ordinary numbers. The $3$ factors left are the largest ones, $9 \\cdot 8 \\cdot 7$, not $3 \\cdot 2 \\cdot 1$.`,
        `做阶乘的除法时，把较大的阶乘展开到出现较小的阶乘为止，再约去。这样做的道理是：较小的阶乘正是较大阶乘的尾部。$9!$ 是 $9 \\cdot 8 \\cdot 7$ 后面接着 $6 \\cdot 5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = 6!$。

{{figure 0}}

所以

$$\\frac{9!}{6!} = \\frac{9 \\cdot 8 \\cdot 7 \\cdot 6!}{6!} = 9 \\cdot 8 \\cdot 7 = 504.$$

这比先算出 $9! = 362\\,880$ 和 $6! = 720$ 快得多。剩下的是从 $9$ 往下的 $9 - 6 = 3$ 个因数。

> **注意。** $\\frac{9!}{6!}$ 不是 $3!$，也不是 $\\left(\\frac{9}{6}\\right)!$：阶乘不能像普通的数那样相除。剩下的 $3$ 个因数是最大的几个 $9 \\cdot 8 \\cdot 7$，而不是 $3 \\cdot 2 \\cdot 1$。`,
      ),
      figures: [
        slotsFigure(
          countSlots(9, 9).map((s, i) => (i < 3 ? { ...s, tone: "result" as const } : s)),
          { block: [3, 8], blockText: "6!" },
          t(
            "The factors of 9!: 9, 8, 7, then a bracket over 6 down to 1, which is 6!.",
            "9! 的因数：9、8、7，然后一个括号括住 6 到 1，即 6!。",
          ),
        ),
      ],
      generate(rng) {
        const n = rng.int(5, 15);
        const k = rng.int(1, 3);
        const m = n - k;
        const ans = perm(n, k);
        return {
          ...numberProblem({
            prompt: t(`Evaluate $\\frac{${n}!}{${m}!}$.`, `计算 $\\frac{${n}!}{${m}!}$。`),
            answer: ans,
            wrong: [fact(k), n * k, ans / n, perm(n, k + 1)],
            solution: para(
              step(
                1,
                "write the larger factorial down to the smaller",
                "把较大的阶乘展开到较小的",
                t(
                  `$${m}!$ is the tail of $${n}!$, after the ${k === 1 ? "factor" : `$${k}$ factors`} from $${n}$ down to $${m + 1}$:${steps(`${n}! = ${prodL(n, k)} \\cdot ${m}!`)}`,
                  `$${m}!$ 是 $${n}!$ 的尾部，前面是从 $${n}$ 到 $${m + 1}$ 的 $${k}$ 个因数：${steps(`${n}! = ${prodL(n, k)} \\cdot ${m}!`)}`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "cancel",
                "约去",
                t(
                  `Cancel $${m}!$:${steps(`\\frac{${n}!}{${m}!} = ${k === 1 ? `${n}` : `${prodL(n, k)} = ${ans}`}`)}`,
                  `约去 $${m}!$：${steps(`\\frac{${n}!}{${m}!} = ${k === 1 ? `${n}` : `${prodL(n, k)} = ${ans}`}`)}`,
                ),
              ),
              check(
                t(
                  `Multiply back: $${ans} \\cdot ${m}! = ${big(ans)} \\cdot ${big(fact(m))} = ${big(fact(n))}$, which is $${n}!$.`,
                  `乘回去：$${ans} \\cdot ${m}! = ${big(ans)} \\cdot ${big(fact(m))} = ${big(fact(n))}$，正是 $${n}!$。`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            slotsFigure(
              [...countSlots(n, k).map((s) => ({ ...s, tone: "result" as const })), { text: `${m}!` }],
              {},
              t(
                `${n}! as ${prodL(n, k).replaceAll(" \\cdot ", " · ")} · ${m}!.`,
                `${n}! 写成 ${prodL(n, k).replaceAll(" \\cdot ", " · ")} · ${m}!。`,
              ),
            ),
          ],
        };
      },
    },
    {
      id: "factorials-in-numerator-and-denominator",
      title: t("Several factorials in a quotient", "含多个阶乘的商"),
      explanation: t(
        `When the denominator is a product of factorials, cancel the larger one first, since it is the tail of the numerator, then divide by the other:

$$\\frac{8!}{5! \\cdot 3!} = \\frac{8 \\cdot 7 \\cdot 6}{3!} = \\frac{336}{6} = 56.$$

Simplifying before multiplying keeps the numbers small: $\\frac{8 \\cdot 7 \\cdot 6}{3 \\cdot 2 \\cdot 1} = 8 \\cdot 7 = 56$, since $6 = 3 \\cdot 2$. The answer is always a whole number here: it counts the ways to choose $3$ of $8$ objects.

> **Watch out.** $5! \\cdot 3!$ is not $8!$, so the quotient is not $1$; and cancelling only $5!$ leaves $8 \\cdot 7 \\cdot 6 = 336$, which must still be divided by $3!$.`,
        `分母是几个阶乘的积时，先约去较大的那个阶乘，因为它是分子的尾部，再除以另一个：

$$\\frac{8!}{5! \\cdot 3!} = \\frac{8 \\cdot 7 \\cdot 6}{3!} = \\frac{336}{6} = 56.$$

先约分再相乘可以让数字保持较小：$\\frac{8 \\cdot 7 \\cdot 6}{3 \\cdot 2 \\cdot 1} = 8 \\cdot 7 = 56$，因为 $6 = 3 \\cdot 2$。这里的结果总是整数：它数的是从 $8$ 个物体中选 $3$ 个的方法数。

> **注意。** $5! \\cdot 3!$ 不等于 $8!$，所以商不是 $1$；只约去 $5!$ 得到 $8 \\cdot 7 \\cdot 6 = 336$，还要再除以 $3!$。`,
      ),
      generate(rng) {
        const n = rng.int(5, 12);
        const r = rng.int(2, Math.min(4, n - 2));
        const m = n - r;
        const ans = comb(n, r);
        const swap = rng.bool();
        const den = swap ? `${r}! \\cdot ${m}!` : `${m}! \\cdot ${r}!`;
        const [L, S] = m >= r ? [m, r] : [r, m];
        const rest = perm(n, n - L);
        const which =
          m === r
            ? t(`Both factorials in the denominator are $${m}!$, the tail of`, `分母中的两个阶乘都是 $${m}!$，它是`)
            : t(`Of $${m}!$ and $${r}!$, the larger is $${L}!$, the tail of`, `$${m}!$ 和 $${r}!$ 中较大的是 $${L}!$，它是`);
        return numberProblem({
          prompt: t(`Evaluate $\\frac{${n}!}{${den}}$.`, `计算 $\\frac{${n}!}{${den}}$。`),
          answer: ans,
          wrong: [perm(n, r), ans * 2, fact(r), n * r],
          solution: para(
            step(
              1,
              "cancel the larger factorial",
              "约去较大的阶乘",
              t(
                `${which.en} $${n}! = ${prodL(n, n - L)} \\cdot ${L}!$. Cancel ${m === r ? "one of them" : "it"}:${steps(`\\frac{${n}!}{${den}} = \\frac{${prodL(n, n - L)}}{${S}!} = \\frac{${rest}}{${S}!}`)}`,
                `${which["zh-CN"]} $${n}! = ${prodL(n, n - L)} \\cdot ${L}!$ 的尾部。约去${m === r ? "其中一个" : "它"}：${steps(`\\frac{${n}!}{${den}} = \\frac{${prodL(n, n - L)}}{${S}!} = \\frac{${rest}}{${S}!}`)}`,
              ),
            ),
            step(
              2,
              "divide by the other",
              "除以另一个",
              t(
                `Divide by $${S}! = ${factL(S)} = ${fact(S)}$:${steps(`\\frac{${rest}}{${fact(S)}} = ${ans}`)}`,
                `除以 $${S}! = ${factL(S)} = ${fact(S)}$：${steps(`\\frac{${rest}}{${fact(S)}} = ${ans}`)}`,
              ),
            ),
            check(
              t(
                `Multiply back: $${ans} \\cdot ${S}! = ${ans} \\cdot ${fact(S)} = ${rest}$, the product $${prodL(n, n - L)}$ left after cancelling $${L}!$. The answer is a whole number, as it must be: it counts the ways to choose $${r}$ of $${n}$ objects.`,
                `乘回去：$${ans} \\cdot ${S}! = ${ans} \\cdot ${fact(S)} = ${rest}$，正是约去 $${L}!$ 后剩下的 $${prodL(n, n - L)}$。结果是整数，这是必然的：它数的是从 $${n}$ 个物体中选 $${r}$ 个的方法数。`,
              ),
            ),
          ),
        });
      },
    },
  ],
};

/** lin writes kn + a: "n", "2n - 1", "n + 3". */
function lin(k: number, a: number): string {
  const head = k === 1 ? "n" : `${k}n`;
  return a === 0 ? head : a > 0 ? `${head} + ${a}` : `${head} - ${-a}`;
}

/** factArg writes the argument of a factorial, in parentheses unless it is a single letter: "n!", "(n + 1)!", "(2n)!". */
const factArg = (k: number, a: number) => (k === 1 && a === 0 ? "n!" : `(${lin(k, a)})!`);

/** productOf writes the product of the factors kn + a for a in as, monomial factor first: "n(n - 1)", "(n + 2)(n + 1)". */
function productOf(k: number, as: readonly number[]): string {
  const sorted = [...as].sort((x, y) => (x === 0 ? -1 : y === 0 ? 1 : y - x));
  return sorted.map((a) => (a === 0 ? lin(k, 0) : `(${lin(k, a)})`)).join("");
}

/** atFive evaluates kn + a at n = 5, the value used to check simplified factorial quotients. */
const atFive = (k: number, a: number) => 5 * k + a;

/** Factorials in variable expressions (Geometry 6.19.3). */
export const factorialsInVariableExpressions: TopicDef = {
  id: "factorials-in-variable-expressions",
  title: t("Factorials in Variable Expressions", "含变量的阶乘式"),
  summary: t(
    "Simplify quotients of factorials of expressions such as (n + 1)!/(n − 1)!, and solve simple equations with them.",
    "化简 (n + 1)!/(n − 1)! 这类含变量阶乘的商，并解相关的简单方程。",
  ),
  prerequisites: ["factorials", "multiplying-binomials"],
  encompasses: [
    { topic: "factorials", weight: 0.5 },
    { topic: "multiplying-binomials", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.B.9"],
  intro: t(
    `With numbers, a quotient of factorials cancels to the factors between them: $\\frac{10!}{9!} = 10$, since $10! = 10 \\cdot 9!$, and $\\frac{10!}{8!} = 10 \\cdot 9 = 90$, since $10! = 10 \\cdot 9 \\cdot 8!$.

The same works with a letter. Whatever the positive integer $n$, $n! = n \\cdot (n - 1)!$, so $\\frac{n!}{(n - 1)!} = n$, and $n! = n(n - 1) \\cdot (n - 2)!$, so $\\frac{n!}{(n - 2)!} = n(n - 1)$. In this lesson we simplify such quotients and use them to solve equations.`,
    `对具体的数，阶乘的商约分后只剩两者之间的因数：$\\frac{10!}{9!} = 10$，因为 $10! = 10 \\cdot 9!$；$\\frac{10!}{8!} = 10 \\cdot 9 = 90$，因为 $10! = 10 \\cdot 9 \\cdot 8!$。

用字母也一样。对任何正整数 $n$，$n! = n \\cdot (n - 1)!$，所以 $\\frac{n!}{(n - 1)!} = n$；$n! = n(n - 1) \\cdot (n - 2)!$，所以 $\\frac{n!}{(n - 2)!} = n(n - 1)$。这节课我们化简这样的商，并用它们解方程。`,
  ),
  knowledgePoints: [
    {
      id: "consecutive-factorials",
      title: t("Factorials one apart", "相差 1 的阶乘"),
      explanation: t(
        `For a positive integer $n$, the factorial of $n + 1$ is $n + 1$ times the factorial of $n$, because $(n + 1)!$ is the product down from $n + 1$, and after its first factor the rest is $n!$:

$$(n + 1)! = (n + 1) \\cdot n!.$$

So factorials of expressions one apart cancel to a single factor:

$$\\frac{(n + 3)!}{(n + 2)!} = \\frac{(n + 3) \\cdot (n + 2)!}{(n + 2)!} = n + 3, \\qquad \\frac{(n - 1)!}{n!} = \\frac{(n - 1)!}{n \\cdot (n - 1)!} = \\frac{1}{n}.$$

With $n = 5$ the first is $\\frac{8!}{7!} = 8$, and indeed $5 + 3 = 8$.

> **Watch out.** The factor left is the larger expression, the one inside the larger factorial: $\\frac{(n + 3)!}{(n + 2)!}$ is $n + 3$, not $n + 2$, and not $1$ or $\\frac{n + 3}{n + 2}$. When the larger factorial is in the denominator, the answer is $1$ over that factor.`,
        `对正整数 $n$，$n + 1$ 的阶乘等于 $n + 1$ 乘以 $n$ 的阶乘，因为 $(n + 1)!$ 是从 $n + 1$ 往下的乘积，去掉第一个因数后剩下的就是 $n!$：

$$(n + 1)! = (n + 1) \\cdot n!.$$

所以两个相差 $1$ 的式子的阶乘相除，约分后只剩一个因式：

$$\\frac{(n + 3)!}{(n + 2)!} = \\frac{(n + 3) \\cdot (n + 2)!}{(n + 2)!} = n + 3, \\qquad \\frac{(n - 1)!}{n!} = \\frac{(n - 1)!}{n \\cdot (n - 1)!} = \\frac{1}{n}.$$

取 $n = 5$，第一个是 $\\frac{8!}{7!} = 8$，确实 $5 + 3 = 8$。

> **注意。** 剩下的因式是较大的式子，即较大阶乘括号里的那个：$\\frac{(n + 3)!}{(n + 2)!}$ 等于 $n + 3$，不是 $n + 2$，也不是 $1$ 或 $\\frac{n + 3}{n + 2}$。较大的阶乘在分母时，结果是 $1$ 除以这个因式。`,
      ),
      generate(rng) {
        const k = rng.pick([1, 1, 2, 3]);
        const a = rng.int(-3, 3);
        const inv = rng.bool(0.35);
        const top = lin(k, a);
        const big = factArg(k, a);
        const small = factArg(k, a - 1);
        const answer = inv ? (a === 0 ? `\\frac{1}{${top}}` : `\\frac{1}{${top}}`) : top;
        const expr = inv ? `\\frac{${small}}{${big}}` : `\\frac{${big}}{${small}}`;
        const v = atFive(k, a);
        const num = inv ? `\\frac{${v - 1}!}{${v}!}` : `\\frac{${v}!}{${v - 1}!}`;
        const val = inv ? `\\frac{1}{${v}}` : `${v}`;
        return expressionProblem({
          prompt: t(`Simplify $${expr}$, where $n$ is a large positive integer.`, `化简 $${expr}$，其中 $n$ 是足够大的正整数。`),
          answer,
          lowest: true,
          wrong: inv ? [top, `\\frac{1}{${lin(k, a - 1)}}`, "1"] : [lin(k, a - 1), "1", `${productOf(k, [a, a - 1])}`],
          solution: para(
            step(
              1,
              "the larger factorial",
              "较大的阶乘",
              t(
                `$${top}$ is one more than $${lin(k, a - 1)}$, so $${big}$ is the larger factorial, and its first factor times the rest is${steps(`${big} = (${top}) \\cdot ${small}`)}`,
                `$${top}$ 比 $${lin(k, a - 1)}$ 大 $1$，所以 $${big}$ 是较大的阶乘，它的第一个因数乘以其余部分：${steps(`${big} = (${top}) \\cdot ${small}`)}`,
              ),
            ),
            step(
              2,
              "cancel",
              "约去",
              t(
                `Cancel $${small}$${inv ? "; the factor left is in the denominator" : ""}:${steps(`${expr} = ${answer}`)}`,
                `约去 $${small}$${inv ? "，剩下的因式在分母" : ""}：${steps(`${expr} = ${answer}`)}`,
              ),
            ),
            check(
              t(
                `Try $n = 5$: $${top} = ${v}$, and the quotient is $${num} = ${val}$, the same.`,
                `取 $n = 5$：$${top} = ${v}$，而原式为 $${num} = ${val}$，两者相同。`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "factorials-further-apart",
      title: t("Factorials further apart", "相差更多的阶乘"),
      explanation: t(
        `When the expressions differ by $2$ or $3$, write the larger factorial down to the smaller one; one factor is left for each step down, so several factors remain:

$$\\frac{(n + 1)!}{(n - 1)!} = \\frac{(n + 1) \\cdot n \\cdot (n - 1)!}{(n - 1)!} = n(n + 1) = n^{2} + n.$$

With $n = 5$: $\\frac{6!}{4!} = 6 \\cdot 5 = 30$, and $5^{2} + 5 = 30$. Leave the answer as a product of factors or multiply it out; both are simplified.

> **Watch out.** The difference $(n + 1) - (n - 1) = 2$ is the number of factors left, not the answer: $\\frac{(n + 1)!}{(n - 1)!}$ is not $2$ or $2!$. Write every factor from the larger expression down, and stop just before the smaller one.`,
        `两个式子相差 $2$ 或 $3$ 时，把较大的阶乘展开到较小的阶乘为止；每往下一步留下一个因式，所以约分后剩下几个因式：

$$\\frac{(n + 1)!}{(n - 1)!} = \\frac{(n + 1) \\cdot n \\cdot (n - 1)!}{(n - 1)!} = n(n + 1) = n^{2} + n.$$

取 $n = 5$：$\\frac{6!}{4!} = 6 \\cdot 5 = 30$，而 $5^{2} + 5 = 30$。答案可以写成因式的积，也可以展开，两者都是化简后的形式。

> **注意。** 差 $(n + 1) - (n - 1) = 2$ 是剩下因式的个数，不是答案：$\\frac{(n + 1)!}{(n - 1)!}$ 不是 $2$，也不是 $2!$。从较大的式子起逐个写出因式，在较小的式子之前停下。`,
      ),
      generate(rng) {
        const k = rng.pick([1, 1, 1, 2]);
        const a = rng.int(-1, 4);
        const gap = rng.pick([2, 2, 3]);
        const inv = rng.bool(0.3);
        const as = Array.from({ length: gap }, (_, i) => a - i);
        const prod = productOf(k, as);
        const big = factArg(k, a);
        const small = factArg(k, a - gap);
        const answer = inv ? `\\frac{1}{${prod}}` : prod;
        const expr = inv ? `\\frac{${small}}{${big}}` : `\\frac{${big}}{${small}}`;
        const expand = as.map((x) => `(${lin(k, x)})`).join(" \\cdot ");
        const v = atFive(k, a);
        const p5 = perm(v, gap);
        const nums = prodL(v, gap);
        const num = inv ? `\\frac{${v - gap}!}{${v}!}` : `\\frac{${v}!}{${v - gap}!}`;
        const val = (s: string | number) => (inv ? `\\frac{1}{${s}}` : `${s}`);
        return expressionProblem({
          prompt: t(`Simplify $${expr}$, where $n$ is a large positive integer.`, `化简 $${expr}$，其中 $n$ 是足够大的正整数。`),
          answer,
          lowest: true,
          wrong: inv ? [prod, `\\frac{1}{${lin(k, a)}}`] : [lin(k, a), productOf(k, as.slice(0, gap - 1)), `${gap}`],
          solution: para(
            step(
              1,
              "write the larger factorial down",
              "展开较大的阶乘",
              t(
                `$${lin(k, a)}$ is $${gap}$ more than $${lin(k, a - gap)}$, so $${big}$ has $${gap}$ factors before $${small}$:${steps(`${big} = ${expand} \\cdot ${small}`)}`,
                `$${lin(k, a)}$ 比 $${lin(k, a - gap)}$ 大 $${gap}$，所以 $${big}$ 在 $${small}$ 之前有 $${gap}$ 个因式：${steps(`${big} = ${expand} \\cdot ${small}`)}`,
              ),
            ),
            step(
              2,
              "cancel",
              "约去",
              t(
                `Cancel $${small}$${inv ? "; the factors left are in the denominator" : ""}:${steps(`${expr} = ${answer}`)}`,
                `约去 $${small}$${inv ? "，剩下的因式在分母" : ""}：${steps(`${expr} = ${answer}`)}`,
              ),
            ),
            check(
              t(
                `Try $n = 5$: the quotient is $${num} = ${val(nums)} = ${val(p5)}$, and $${prod}$ is $${nums} = ${p5}$ there, so the two agree.`,
                `取 $n = 5$：原式为 $${num} = ${val(nums)} = ${val(p5)}$，而此时 $${prod}$ 等于 $${nums} = ${p5}$，两者一致。`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "solving-factorial-equations",
      title: t("Solving factorial equations", "解阶乘方程"),
      explanation: t(
        `To solve an equation with factorials, simplify the quotient first, then find $n$:

$$\\frac{n!}{(n - 2)!} = 42 \\quad\\Longrightarrow\\quad n(n - 1) = 42.$$

$n$ and $n - 1$ are consecutive integers whose product is $42 = 7 \\cdot 6$, so $n = 7$. Substituting back, $\\frac{7!}{5!} = 7 \\cdot 6 = 42$.

> **Watch out.** Solving $n^{2} - n - 42 = 0$ also gives $n = -6$, which is rejected: a factorial needs a whole number. And the larger of the two consecutive integers is not always $n$: in $\\frac{(n + 1)!}{(n - 1)!} = (n + 1)n$ it is $n + 1$.`,
        `解含阶乘的方程，先化简商，再求 $n$：

$$\\frac{n!}{(n - 2)!} = 42 \\quad\\Longrightarrow\\quad n(n - 1) = 42.$$

$n$ 与 $n - 1$ 是乘积为 $42 = 7 \\cdot 6$ 的两个连续整数，所以 $n = 7$。代回检验：$\\frac{7!}{5!} = 7 \\cdot 6 = 42$。

> **注意。** 解 $n^{2} - n - 42 = 0$ 还会得到 $n = -6$，应舍去：阶乘只对自然数有意义。而且两个连续整数中较大的那个不一定是 $n$：在 $\\frac{(n + 1)!}{(n - 1)!} = (n + 1)n$ 中它是 $n + 1$。`,
      ),
      generate(rng) {
        const form = rng.int(0, 2);
        const n = rng.int(3, 15);
        // form 0: n!/(n-2)! = n(n-1); form 1: (n+1)!/(n-1)! = (n+1)n; form 2: (n+2)!/n! = (n+2)(n+1).
        const hi = [n, n + 1, n + 2][form]!;
        const k = hi * (hi - 1);
        const expr = [`\\frac{n!}{(n - 2)!}`, `\\frac{(n + 1)!}{(n - 1)!}`, `\\frac{(n + 2)!}{n!}`][form]!;
        const prod = [`n(n - 1)`, `(n + 1)n`, `(n + 2)(n + 1)`][form]!;
        const larger = ["n", "n + 1", "n + 2"][form]!;
        const back = `\\frac{${hi}!}{${hi - 2}!}`;
        return numberProblem({
          prompt: t(`Solve $${expr} = ${k}$ for the positive integer $n$.`, `求满足 $${expr} = ${k}$ 的正整数 $n$。`),
          answer: n,
          solveFor: "n",
          wrong: [hi, hi - 1, n + 1, k / 2],
          solution: para(
            step(
              1,
              "simplify",
              "化简",
              t(
                `The two factorials are $2$ apart, so two factors are left:${steps(`${expr} = ${prod} = ${k}`)}`,
                `两个阶乘相差 $2$，所以剩下两个因式：${steps(`${expr} = ${prod} = ${k}`)}`,
              ),
            ),
            step(
              2,
              "find n",
              "求 n",
              t(
                `The factors are consecutive integers, the larger being $${larger}$. The two consecutive positive integers with product $${k}$ are $${hi}$ and $${hi - 1}$, so $${larger} = ${hi}$ and${steps(`n = ${n}`)}`,
                `两个因式是连续整数，较大的是 $${larger}$。乘积为 $${k}$ 的两个连续正整数是 $${hi}$ 和 $${hi - 1}$，所以 $${larger} = ${hi}$，${steps(`n = ${n}`)}`,
              ),
            ),
            check(
              t(
                `Substitute $n = ${n}$: the quotient becomes $${back} = ${hi} \\cdot ${hi - 1} = ${k}$, as required.`,
                `代入 $n = ${n}$：原式变为 $${back} = ${hi} \\cdot ${hi - 1} = ${k}$，符合要求。`,
              ),
            ),
          ),
        });
      },
    },
  ],
};

/** Row is a kind of objects arranged in a row. */
interface Row {
  readonly setup: (n: number) => Text;
  readonly a: Text;
  readonly b: Text;
  readonly first: Text;
  readonly last: Text;
}

/** rowsOf are the kinds of objects put in a row in problems on orders. */
const rowsOf: readonly Row[] = [
  {
    setup: (n) => t(`${n} different books are placed in a row on a shelf.`, `把 ${n} 本不同的书在书架上排成一排。`),
    a: t("the dictionary", "词典"),
    b: t("the atlas", "地图册"),
    first: t("at the left end", "在最左端"),
    last: t("at the right end", "在最右端"),
  },
  {
    setup: (n) => t(`${n} friends stand in a line for a photo.`, `${n} 个朋友站成一排拍照。`),
    a: t("Ana", "安娜"),
    b: t("Ben", "本"),
    first: t("at the left end", "在最左端"),
    last: t("at the right end", "在最右端"),
  },
  {
    setup: (n) => t(`${n} runners finish a race, with no ties.`, `${n} 名运动员跑完一场比赛，没有并列名次。`),
    a: t("Kai", "凯"),
    b: t("Lea", "莉娅"),
    first: t("first", "第一名"),
    last: t("last", "最后一名"),
  },
  {
    setup: (n) => t(`A playlist plays ${n} different songs, each once.`, `一个播放列表把 ${n} 首不同的歌各播放一次。`),
    a: t("the oldest song", "最老的那首歌"),
    b: t("the newest song", "最新的那首歌"),
    first: t("first", "第一首"),
    last: t("last", "最后一首"),
  },
];

/** seatsInARow is a row of seats for problems where two people sit together or apart. */
const seatsInARow: Row = {
  setup: (n) => t(`${n} students sit in a row of ${n} chairs.`, `${n} 名学生坐在一排 ${n} 把椅子上。`),
  a: t("Mia", "米娅"),
  b: t("Noah", "诺亚"),
  first: t("in the first chair", "在第一把椅子上"),
  last: t("in the last chair", "在最后一把椅子上"),
};

/** dots writes a product of numbers with the middle dot of alternative texts: "5 · 4 · 3". */
const dots = (xs: readonly (number | string)[]) => xs.join(" · ");

/** Ordering objects (Geometry 6.19.4). */
export const orderingObjects: TopicDef = {
  id: "ordering-objects",
  title: t("Ordering Objects", "排列物体"),
  summary: t(
    "Count the orders of n different objects with n!, including orders with fixed positions and with objects kept together.",
    "用 n! 计算 n 个不同物体的排列数，包括某些位置固定或某些物体相邻的情况。",
  ),
  prerequisites: ["factorials"],
  encompasses: [
    { topic: "factorials", weight: 0.4 },
    { topic: "the-rules-of-sum-and-product", weight: 0.4 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.B.9"],
  intro: t(
    `A gallery hangs $5$ different paintings in a row. Think of the row as $5$ empty places, filled from the left:

{{figure 0}}

Any of the $5$ paintings can go in the first place; whichever it is, $4$ are left for the second place, then $3$, $2$ and $1$. By the rule of product there are $5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = 5! = 120$ orders. In this lesson we count orders like this, and also orders where some objects have fixed places or must stay together.`,
    `画廊把 $5$ 幅不同的画挂成一排。把这一排看成 $5$ 个空位，从左往右填：

{{figure 0}}

第一个位置可以挂 $5$ 幅画中的任意一幅；不论挂了哪幅，第二个位置还剩 $4$ 幅可选，然后是 $3$、$2$、$1$。由乘法原理共有 $5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 = 5! = 120$ 种顺序。这节课我们计算这样的排列数，以及某些物体位置固定或必须相邻时的排列数。`,
  ),
  introFigures: [
    slotsFigure(
      countSlots(5, 5),
      { total: "= 120" },
      t("Five places with 5, 4, 3, 2 and 1 choices: 120 orders.", "五个位置，依次有 5、4、3、2、1 种选法：120 种顺序。"),
    ),
  ],
  knowledgePoints: [
    {
      id: "orders-of-n-objects",
      title: t("Orders of n objects", "n 个物体的排列"),
      explanation: t(
        `To put $n$ different objects in order, choose the first in $n$ ways, the second in $n - 1$ ways (one is used), and so on. By the rule of product, the number of orders is

$$n \\cdot (n - 1) \\cdot \\ldots \\cdot 1 = n!.$$

Four friends can stand in a line in

{{figure 0}}

$4! = 24$ ways. For each of the $4$ friends at the left end, the other $3$ can stand in $3! = 6$ orders, and $4 \\cdot 6 = 24$.

> **Watch out.** Each object is used once, so the choices go down by one: it is not $4 \\cdot 4 = 16$ or $4^{4}$, which would allow the same friend in two places. And it is not $4$: that is the number of objects, not of orders.`,
        `把 $n$ 个不同的物体排成一列：第一个有 $n$ 种选法，第二个有 $n - 1$ 种（已用掉一个），依此类推。由乘法原理，排列数是

$$n \\cdot (n - 1) \\cdot \\ldots \\cdot 1 = n!.$$

四个朋友站成一排，有

{{figure 0}}

$4! = 24$ 种站法。最左端站 $4$ 个朋友中的任何一个，其余 $3$ 人都有 $3! = 6$ 种站法，$4 \\cdot 6 = 24$。

> **注意。** 每个物体只用一次，所以选法数每次减一：不是 $4 \\cdot 4 = 16$ 或 $4^{4}$，那样同一个朋友会站在两个位置上。也不是 $4$：那是物体的个数，不是排列数。`,
      ),
      figures: [
        slotsFigure(
          countSlots(4, 4),
          { total: "= 24" },
          t("Four places with 4, 3, 2 and 1 choices: 24.", "四个位置，依次有 4、3、2、1 种选法：24。"),
        ),
      ],
      generate(rng) {
        const r = rng.pick(rowsOf);
        const n = rng.int(3, 10);
        return {
          ...numberProblem({
            prompt: t(`${r.setup(n).en} In how many different orders can this happen?`, `${r.setup(n)["zh-CN"]}共有多少种不同的顺序？`),
            answer: fact(n),
            wrong: [n, n * n, (n * (n + 1)) / 2, fact(n - 1)],
            solution: para(
              step(
                1,
                "fill the places in turn",
                "依次填位置",
                t(
                  `There are $${n}$ choices for the first place, $${n - 1}$ for the next, since one is used, and so on down to $1$:`,
                  `第一个位置有 $${n}$ 种选法，下一个有 $${n - 1}$ 种，因为已用掉一个，依此类推直到 $1$：`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "multiply",
                "相乘",
                t(
                  `By the rule of product:${steps(`${n}! = ${factL(n)} = ${big(fact(n))}`)}`,
                  `由乘法原理：${steps(`${n}! = ${factL(n)} = ${big(fact(n))}`)}`,
                ),
              ),
              check(
                t(
                  `Fix the first place: each of its $${n}$ choices is followed by $${n - 1}! = ${big(fact(n - 1))}$ orders of the rest, and $${n} \\cdot ${big(fact(n - 1))} = ${big(fact(n))}$.`,
                  `固定第一个位置：它的 $${n}$ 种选法，每种后面都有其余物体的 $${n - 1}! = ${big(fact(n - 1))}$ 种顺序，$${n} \\cdot ${big(fact(n - 1))} = ${big(fact(n))}$。`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            slotsFigure(
              countSlots(n, n),
              { total: `= ${fact(n)}` },
              t(
                `${n} places: ${dots(countSlots(n, n).map((s) => s.text))} = ${fact(n)}.`,
                `${n} 个位置：${dots(countSlots(n, n).map((s) => s.text))} = ${fact(n)}。`,
              ),
            ),
          ],
        };
      },
    },
    {
      id: "fixed-positions",
      title: t("Fixed positions", "位置固定"),
      explanation: t(
        `When some objects must be in given places, place them first, then order the rest: the fixed objects take one way each, and the others fill the remaining places in any order.

If $6$ friends line up and Ana, $A$, must be at the left end, the other $5$ fill the remaining places in $5! = 120$ ways:

{{figure 0}}

If Ana must be at *one of* the ends, there are $2$ choices for her end, so $2 \\cdot 5! = 240$ ways. If Ana is at the left end and Ben at the right end, the other $4$ can be ordered in $4! = 24$ ways.

> **Watch out.** Fixing one object does not take one order away: it is $5!$, not $6! - 1$. And "at one of the ends" doubles the count, while "at the left end and Ben at the right end" fixes two places and leaves $6 - 2 = 4$ friends to order.`,
        `某些物体必须在指定位置时，先放好它们，再排列其余物体：固定的物体各只有一种放法，其余物体在剩下的位置上任意排列。

6 个朋友排成一排，若安娜 $A$ 必须在最左端，其余 $5$ 人排在剩下的位置，有 $5! = 120$ 种：

{{figure 0}}

若安娜必须在*某一端*，她有 $2$ 种选法，共 $2 \\cdot 5! = 240$ 种。若安娜在最左端、本在最右端，其余 $4$ 人有 $4! = 24$ 种排法。

> **注意。** 固定一个物体并不是只少一种顺序：是 $5!$，不是 $6! - 1$。“在某一端”使个数加倍；而“安娜在最左端、本在最右端”固定了两个位置，只剩 $6 - 2 = 4$ 人要排。`,
      ),
      figures: [
        slotsFigure(
          [{ text: "A", tone: "result" }, ...countSlots(5, 5)],
          { total: "= 120" },
          t(
            "Six places: A fixed in the first, then 5, 4, 3, 2 and 1 choices: 120.",
            "六个位置：A 固定在第一个，之后依次 5、4、3、2、1 种选法：120。",
          ),
        ),
      ],
      generate(rng) {
        const r = rng.pick(rowsOf);
        const n = rng.int(4, 9);
        const kind = rng.int(0, 2);
        const cond = [
          t(`${cap(r.a.en)} must be ${r.first.en}.`, `${r.a["zh-CN"]}必须${r.first["zh-CN"]}。`),
          t(`${cap(r.a.en)} must be either ${r.first.en} or ${r.last.en}.`, `${r.a["zh-CN"]}必须${r.first["zh-CN"]}或${r.last["zh-CN"]}。`),
          t(
            `${cap(r.a.en)} must be ${r.first.en} and ${r.b.en} must be ${r.last.en}.`,
            `${r.a["zh-CN"]}必须${r.first["zh-CN"]}，${r.b["zh-CN"]}必须${r.last["zh-CN"]}。`,
          ),
        ][kind]!;
        const ans = [fact(n - 1), 2 * fact(n - 1), fact(n - 2)][kind]!;
        const work = [
          steps(`${n - 1}! = ${ans}`),
          steps(`2 \\cdot ${n - 1}! = 2 \\cdot ${fact(n - 1)} = ${ans}`),
          steps(`${n - 2}! = ${ans}`),
        ][kind]!;
        const rest = kind === 2 ? n - 2 : n - 1;
        const place = [
          t(`Put ${r.a.en} ${r.first.en}: one way.`, `把${r.a["zh-CN"]}放在指定位置：一种放法。`),
          t(
            `${cap(r.a.en)} goes ${r.first.en} or ${r.last.en}: $2$ ways.`,
            `${r.a["zh-CN"]}${r.first["zh-CN"]}或${r.last["zh-CN"]}：$2$ 种。`,
          ),
          t(
            `Put ${r.a.en} ${r.first.en} and ${r.b.en} ${r.last.en}: one way.`,
            `把${r.a["zh-CN"]}和${r.b["zh-CN"]}放在指定位置：一种放法。`,
          ),
        ][kind]!;
        const checkText = [
          t(
            `Each of the $${n}$ objects is ${r.first.en} in the same number of the $${n}! = ${fact(n)}$ orders, so ${r.a.en} is in $\\frac{${fact(n)}}{${n}} = ${ans}$ of them.`,
            `在全部 $${n}! = ${fact(n)}$ 种顺序中，$${n}$ 个物体各自${r.first["zh-CN"]}的次数相同，所以${r.a["zh-CN"]}${r.first["zh-CN"]}的有 $\\frac{${fact(n)}}{${n}} = ${ans}$ 种。`,
          ),
          t(
            `${cap(r.a.en)} is equally likely to be in each of the $${n}$ places, and $2$ of them are ends, so the count is $\\frac{2}{${n}}$ of all orders: $\\frac{2}{${n}} \\cdot ${fact(n)} = ${ans}$.`,
            `${r.a["zh-CN"]}在 $${n}$ 个位置上的机会相同，其中 $2$ 个是端点，所以个数是全部顺序的 $\\frac{2}{${n}}$：$\\frac{2}{${n}} \\cdot ${fact(n)} = ${ans}$。`,
          ),
          t(
            `The two end places can be filled by an ordered pair of objects in $${n} \\cdot ${n - 1} = ${n * (n - 1)}$ ways, each in the same number of orders, so one pair is in $\\frac{${fact(n)}}{${n * (n - 1)}} = ${ans}$ of them.`,
            `两端可以由一对有序的物体来占，有 $${n} \\cdot ${n - 1} = ${n * (n - 1)}$ 种，每种对应的顺序一样多，所以指定的一对有 $\\frac{${fact(n)}}{${n * (n - 1)}} = ${ans}$ 种。`,
          ),
        ][kind]!;
        const slots: Slot[] =
          kind === 0
            ? [{ text: "A", tone: "result" }, ...countSlots(n - 1, n - 1)]
            : kind === 1
              ? [{ text: "2", tone: "result" }, ...countSlots(n - 1, n - 1)]
              : [{ text: "A", tone: "result" }, ...countSlots(n - 2, n - 2), { text: "B", tone: "result" }];
        return {
          ...numberProblem({
            prompt: t(
              `${r.setup(n).en} ${cond.en} In how many different orders can this happen?`,
              `${r.setup(n)["zh-CN"]}${cond["zh-CN"]}共有多少种不同的顺序？`,
            ),
            answer: ans,
            wrong: [fact(n), fact(n) - fact(n - 1), fact(n - 1), 2 * fact(n - 2), n - 1],
            solution: para(
              step(1, "place the fixed objects", "先放固定的物体", place),
              figureLine(0),
              step(
                2,
                "order the rest",
                "排列其余物体",
                t(
                  `${["The other", "Then the other", "The other"][kind]} $${rest}$ can be in any order in the remaining places:${work}`,
                  `其余 $${rest}$ 个在剩下的位置上可以任意排列：${work}`,
                ),
              ),
              check(checkText),
            ),
          }),
          solutionFigures: [
            slotsFigure(
              slots,
              { total: `= ${ans}` },
              [
                t(
                  `A marks ${r.a.en}, fixed; then ${dots(countSlots(n - 1, n - 1).map((s) => s.text))}: ${ans}.`,
                  `A 表示${r.a["zh-CN"]}，位置固定；之后 ${dots(countSlots(n - 1, n - 1).map((s) => s.text))}：${ans}。`,
                ),
                t(
                  `2 choices of end for ${r.a.en}, then ${dots(countSlots(n - 1, n - 1).map((s) => s.text))}: ${ans}.`,
                  `${r.a["zh-CN"]}有 2 种端点可选，之后 ${dots(countSlots(n - 1, n - 1).map((s) => s.text))}：${ans}。`,
                ),
                t(
                  `A and B mark ${r.a.en} and ${r.b.en}, fixed at the ends; between them ${dots(countSlots(n - 2, n - 2).map((s) => s.text))}: ${ans}.`,
                  `A 和 B 表示${r.a["zh-CN"]}和${r.b["zh-CN"]}，固定在两端；中间 ${dots(countSlots(n - 2, n - 2).map((s) => s.text))}：${ans}。`,
                ),
              ][kind]!,
            ),
          ],
        };
      },
    },
    {
      id: "objects-kept-together",
      title: t("Objects kept together", "物体相邻"),
      explanation: t(
        `To keep two objects next to each other, glue them into one block: then the block moves as a single unit. With $6$ friends where Ana and Ben stand together, there are $5$ units, the block and $4$ others:

{{figure 0}}

Order the $5$ units in $5!$ ways, and the block itself in $2$ ways (Ana–Ben or Ben–Ana): $2 \\cdot 5! = 240$.

To keep them **apart**, subtract from all orders: $6! - 2 \\cdot 5! = 720 - 240 = 480$.

> **Watch out.** Do not forget the factor $2$ for the order inside the block. And "apart" is not the block count with something removed: it is all orders minus the orders where they are together.`,
        `要让两个物体相邻，把它们“捆绑”成一个整体：这个整体作为一个单位移动。6 个朋友中安娜和本必须相邻，就有 $5$ 个单位，即这个整体和其余 $4$ 人：

{{figure 0}}

把 $5$ 个单位排列，有 $5!$ 种；整体内部有 $2$ 种（安娜—本或本—安娜），共 $2 \\cdot 5! = 240$ 种。

要让它们**不相邻**，用全部排法减去相邻的排法：$6! - 2 \\cdot 5! = 720 - 240 = 480$。

> **注意。** 别忘了整体内部顺序的因数 $2$。“不相邻”也不是从捆绑的结果里去掉什么：而是全部排法减去相邻的排法。`,
      ),
      figures: [
        slotsFigure(
          [{ text: "A B", tone: "action" }, ...countSlots(4, 4)],
          { total: "· 2" },
          t(
            "Five units: the block A B and four others, then times 2 for the order inside the block.",
            "五个单位：整体 A B 和其余四人，再乘以整体内部顺序的 2。",
          ),
        ),
      ],
      generate(rng) {
        const r = rng.pick([...rowsOf.slice(0, 2), seatsInARow]);
        const n = rng.int(4, 9);
        const apart = rng.bool();
        const together = 2 * fact(n - 1);
        const ans = apart ? fact(n) - together : together;
        const pairs = n - 1;
        return {
          ...numberProblem({
            prompt: t(
              `${r.setup(n).en} ${cap(r.a.en)} and ${r.b.en} must ${apart ? "not " : ""}be next to each other. In how many different orders can this happen?`,
              `${r.setup(n)["zh-CN"]}${r.a["zh-CN"]}和${r.b["zh-CN"]}${apart ? "不能" : "必须"}相邻。共有多少种不同的顺序？`,
            ),
            answer: ans,
            wrong: apart ? [together, fact(n) - fact(n - 1), fact(n - 2)] : [fact(n - 1), fact(n) - together, 2 * fact(n - 2)],
            solution: para(
              step(
                1,
                "glue the two into a block",
                "捆绑成一个整体",
                t(
                  `${apart ? "First count the orders where they are together. " : ""}The block of ${r.a.en} and ${r.b.en} and the other $${n - 2}$ make $${n - 1}$ units:`,
                  `${apart ? "先数出他们相邻的顺序。" : ""}${r.a["zh-CN"]}和${r.b["zh-CN"]}的整体与其余 $${n - 2}$ 个共 $${n - 1}$ 个单位：`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "order the units and the block",
                "排列单位和整体内部",
                t(
                  `The units can be ordered in $${n - 1}!$ ways and the block in $2$, so${steps(`2 \\cdot ${n - 1}! = 2 \\cdot ${fact(n - 1)} = ${together}`)}`,
                  `单位有 $${n - 1}!$ 种排法，整体内部有 $2$ 种，所以${steps(`2 \\cdot ${n - 1}! = 2 \\cdot ${fact(n - 1)} = ${together}`)}`,
                ),
              ),
              ...(apart
                ? [
                    step(
                      3,
                      "subtract from all orders",
                      "从全部排法中减去",
                      t(
                        `Apart is every order except these:${steps(`${n}! - ${together} = ${fact(n)} - ${together} = ${ans}`)}`,
                        `不相邻就是除去这些以外的所有顺序：${steps(`${n}! - ${together} = ${fact(n)} - ${together} = ${ans}`)}`,
                      ),
                    ),
                  ]
                : []),
              check(
                apart
                  ? t(
                      `Count the apart orders directly: order the other $${n - 2}$ in $${n - 2}! = ${fact(n - 2)}$ ways; they leave $${n - 1}$ gaps (the ends included), and ${r.a.en} and ${r.b.en} go into two different gaps in $${n - 1} \\cdot ${n - 2}$ ways. So $${fact(n - 2)} \\cdot ${n - 1} \\cdot ${n - 2} = ${ans}$.`,
                      `直接数不相邻的顺序：其余 $${n - 2}$ 个有 $${n - 2}! = ${fact(n - 2)}$ 种排法，留出 $${n - 1}$ 个空隙（含两端），${r.a["zh-CN"]}和${r.b["zh-CN"]}放进两个不同的空隙，有 $${n - 1} \\cdot ${n - 2}$ 种。所以 $${fact(n - 2)} \\cdot ${n - 1} \\cdot ${n - 2} = ${ans}$。`,
                    )
                  : t(
                      `Count by places instead: the two can take $${pairs}$ pairs of neighbouring places, in $2$ orders, and the other $${n - 2}$ fill the rest in $${n - 2}! = ${fact(n - 2)}$ ways: $${pairs} \\cdot 2 \\cdot ${fact(n - 2)} = ${ans}$.`,
                      `改按位置来数：两人可以占 $${pairs}$ 对相邻的位置，有 $2$ 种先后，其余 $${n - 2}$ 个填满剩下的位置，有 $${n - 2}! = ${fact(n - 2)}$ 种：$${pairs} \\cdot 2 \\cdot ${fact(n - 2)} = ${ans}$。`,
                    ),
              ),
            ),
          }),
          solutionFigures: [
            slotsFigure(
              [{ text: "A B", tone: "action" }, ...countSlots(n - 2, n - 2)],
              { total: "· 2" },
              t(
                `The block A B of ${r.a.en} and ${r.b.en}, and ${n - 2} others: ${n - 1} units, then times 2 for the order inside the block.`,
                `${r.a["zh-CN"]}和${r.b["zh-CN"]}的整体 A B，加上其余 ${n - 2} 个：${n - 1} 个单位，再乘以整体内部顺序的 2。`,
              ),
            ),
          ],
        };
      },
    },
  ],
};

/** Permutations (Geometry 6.19.5). */
export const permutations: TopicDef = {
  id: "permutations",
  title: t("Permutations", "排列"),
  summary: t(
    "Count ordered selections of r objects from n with nPr = n!/(n − r)!.",
    "用 nPr = n!/(n − r)! 计算从 n 个物体中选出 r 个并排序的方法数。",
  ),
  prerequisites: ["ordering-objects"],
  encompasses: [
    { topic: "ordering-objects", weight: 0.5 },
    { topic: "factorials", weight: 0.4 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.B.9"],
  intro: t(
    `Sometimes only some of the objects are put in order. Lea has $6$ photos and $3$ frames in a row on a wall. The first frame can hold any of the $6$ photos, the second any of the $5$ left, the third any of the $4$ left:

{{figure 0}}

So there are $6 \\cdot 5 \\cdot 4 = 120$ ways; the other $3$ photos stay in the drawer. Such an ordered selection is a permutation, and the product stops after $3$ factors. In this lesson we compute permutations, use them in context, and count them under a condition.`,
    `有时只把一部分物体排成顺序。莉娅有 $6$ 张照片，墙上一排有 $3$ 个相框。第一个相框可以放 $6$ 张中的任意一张，第二个放剩下 $5$ 张中的任意一张，第三个放剩下 $4$ 张中的任意一张：

{{figure 0}}

所以共有 $6 \\cdot 5 \\cdot 4 = 120$ 种放法；另外 $3$ 张照片留在抽屉里。这样有顺序的选取就是排列，乘积在 $3$ 个因数后停止。这节课我们计算排列数，在实际问题中使用它，并在有条件时计数。`,
  ),
  introFigures: [
    slotsFigure(
      countSlots(6, 3),
      { total: "= 120" },
      t("Three frames with 6, 5 and 4 choices: 120.", "三个相框，依次有 6、5、4 种选法：120。"),
    ),
  ],
  knowledgePoints: [
    {
      id: "evaluating-permutations",
      title: t("Evaluating permutations", "计算排列数"),
      explanation: t(
        `A **permutation** of $r$ objects from $n$ is an ordered selection: choose the first in $n$ ways, the second in $n - 1$ ways, …, the $r$th in $n - r + 1$ ways. Their number is

$$_{n}P_{r} = P(n, r) = n(n - 1)\\cdots(n - r + 1) = \\frac{n!}{(n - r)!}.$$

The fraction holds because $n!$ continues the product down to $1$, and dividing by $(n - r)!$ cancels exactly that tail. For example

{{figure 0}}

$_{8}P_{3} = 8 \\cdot 7 \\cdot 6 = 336$: three factors, starting at $8$; and $\\frac{8!}{5!} = \\frac{40\\,320}{120} = 336$.

> **Watch out.** There are $r$ factors, not $n - r$: $_{8}P_{3}$ is $8 \\cdot 7 \\cdot 6$, not $8 \\cdot 7 \\cdot 6 \\cdot 5 \\cdot 4$. The formula divides by $(n - r)!$, not by $r!$, and the factors go down by one, so it is not $8^{3}$.`,
        `从 $n$ 个物体中取出 $r$ 个按顺序排列，叫做一个**排列**：第一个有 $n$ 种选法，第二个有 $n - 1$ 种，……，第 $r$ 个有 $n - r + 1$ 种。排列数是

$$_{n}P_{r} = P(n, r) = n(n - 1)\\cdots(n - r + 1) = \\frac{n!}{(n - r)!}.$$

分数形式成立，是因为 $n!$ 把乘积一直乘到 $1$，除以 $(n - r)!$ 正好约去这个尾部。例如

{{figure 0}}

$_{8}P_{3} = 8 \\cdot 7 \\cdot 6 = 336$：从 $8$ 开始的三个因数；而 $\\frac{8!}{5!} = \\frac{40\\,320}{120} = 336$。

> **注意。** 因数有 $r$ 个，不是 $n - r$ 个：$_{8}P_{3}$ 是 $8 \\cdot 7 \\cdot 6$，不是 $8 \\cdot 7 \\cdot 6 \\cdot 5 \\cdot 4$。公式除以的是 $(n - r)!$，不是 $r!$；因数逐个减一，所以也不是 $8^{3}$。`,
      ),
      figures: [
        slotsFigure(
          countSlots(8, 3),
          { total: "= 336" },
          t("Three places with 8, 7 and 6 choices: 336.", "三个位置，依次有 8、7、6 种选法：336。"),
        ),
      ],
      generate(rng) {
        const n = rng.int(5, 12);
        const r = rng.int(2, 4);
        const ans = perm(n, r);
        const notation = rng.bool() ? `{}_{${n}}P_{${r}}` : `P(${n}, ${r})`;
        return {
          ...numberProblem({
            prompt: t(`Evaluate $${notation}$.`, `计算 $${notation}$。`),
            answer: ans,
            wrong: [perm(n, r + 1)],
            mistakes: [
              why(
                comb(n, r),
                "That is the number of combinations, where order does not matter. Here order matters, so do not divide by $r!$.",
                "这是组合数，不考虑顺序。这里顺序有关，不要除以 $r!$。",
              ),
              why(
                n ** r,
                "That allows repeats, as if each position could use any item again. Each item is used once, so the choices go down by one each time.",
                "这相当于允许重复，每个位置都能再选任何一项。每一项只能用一次，所以选择数每次减一。",
              ),
              why(
                n * r,
                "You multiplied $n$ by $r$. Multiply $r$ decreasing factors, starting from $n$.",
                "你用 $n$ 乘了 $r$。应从 $n$ 开始，连乘 $r$ 个依次减一的因数。",
              ),
              why(
                fact(n) / fact(r),
                "You divided by $r!$. The formula divides by $(n - r)!$.",
                "你除以了 $r!$。公式中除以的是 $(n - r)!$。",
              ),
            ],
            solution: para(
              step(
                1,
                "the factors",
                "因数",
                t(
                  `$${notation}$ has $${r}$ places: $${n}$ choices for the first, one fewer for each next one, down to $${n - r + 1}$:`,
                  `$${notation}$ 有 $${r}$ 个位置：第一个有 $${n}$ 种选法，之后每个少一种，直到 $${n - r + 1}$：`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "multiply",
                "相乘",
                t(
                  `Multiply the $${r}$ factors:${steps(`${notation} = ${prodL(n, r)} = ${ans}`)}`,
                  `把 $${r}$ 个因数相乘：${steps(`${notation} = ${prodL(n, r)} = ${ans}`)}`,
                ),
              ),
              check(
                t(
                  `Use the formula with factorials:${steps(`\\frac{${n}!}{${n - r}!} = \\frac{${big(fact(n))}}{${big(fact(n - r))}} = ${ans}`)}`,
                  `用阶乘公式：${steps(`\\frac{${n}!}{${n - r}!} = \\frac{${big(fact(n))}}{${big(fact(n - r))}} = ${ans}`)}`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            slotsFigure(
              countSlots(n, r),
              { total: `= ${ans}` },
              t(
                `${r} places: ${dots(countSlots(n, r).map((s) => s.text))} = ${ans}.`,
                `${r} 个位置：${dots(countSlots(n, r).map((s) => s.text))} = ${ans}。`,
              ),
            ),
          ],
        };
      },
    },
    {
      id: "permutations-in-context",
      title: t("Permutations in context", "实际问题中的排列"),
      explanation: t(
        `Use permutations when you pick $r$ of $n$ different objects and **the order matters**: different roles, positions or places. Each role is a place, filled one after another from the objects not yet used.

In a club of $10$ members, a president, a vice president and a secretary can be chosen in

{{figure 0}}

$_{10}P_{3} = 10 \\cdot 9 \\cdot 8 = 720$ ways: Ana as president and Ben as secretary is different from Ben as president and Ana as secretary.

> **Watch out.** Ask whether swapping two chosen objects gives a different result. If it does, as with roles or medals, count permutations; if it does not, as with a committee of equals, this count is too large. And no one holds two roles, so the choices go down by one: not $10^{3}$.`,
        `从 $n$ 个不同的物体中选出 $r$ 个，并且**顺序有关**（不同的角色、位置或名次）时，用排列。每个角色是一个位置，依次从还没用到的物体中选。

一个有 $10$ 名成员的社团选出主席、副主席和秘书各一名，有

{{figure 0}}

$_{10}P_{3} = 10 \\cdot 9 \\cdot 8 = 720$ 种选法：安娜当主席、本当秘书，与本当主席、安娜当秘书是不同的。

> **注意。** 问一问：交换两个选出的物体，结果是否不同？若不同，比如角色或奖牌，就用排列；若相同，比如地位平等的委员会，这样数就多了。而且每人最多担任一个职务，所以选法数逐个减一：不是 $10^{3}$。`,
      ),
      figures: [
        slotsFigure(
          countSlots(10, 3),
          { total: "= 720" },
          t("Three roles with 10, 9 and 8 choices: 720.", "三个职务，依次有 10、9、8 种选法：720。"),
        ),
      ],
      generate(rng) {
        const kind = rng.int(0, 2);
        let n: number;
        let r: number;
        let prompt: Text;
        let places: Text;
        if (kind === 0) {
          n = rng.int(5, 15);
          r = 3;
          prompt = t(
            `${n} runners take part in a race. In how many ways can the gold, silver and bronze medals be awarded? (There are no ties.)`,
            `${n} 名运动员参加比赛。金、银、铜牌的颁发方式有多少种？（没有并列名次。）`,
          );
          places = t(
            "Gold, silver and bronze are three different places, and no runner wins two medals",
            "金、银、铜是三个不同的位置，没有人能得两枚奖牌",
          );
        } else if (kind === 1) {
          n = rng.int(6, 20);
          r = rng.int(2, 4);
          const roles = [
            t("a president and a vice president", "主席和副主席"),
            t("a president, a vice president and a secretary", "主席、副主席和秘书"),
            t("a president, a vice president, a secretary and a treasurer", "主席、副主席、秘书和财务"),
          ][r - 2]!;
          prompt = t(
            `A club has ${n} members. In how many ways can ${roles.en} be chosen, if no one holds two roles?`,
            `一个社团有 ${n} 名成员。选出${roles["zh-CN"]}，每人最多担任一个职务，有多少种选法？`,
          );
          places = t(`The $${r}$ roles are different places, and no one holds two`, `$${r}$ 个职务是不同的位置，每人最多担任一个`);
        } else {
          n = 10;
          r = rng.int(2, 5);
          prompt = t(
            `A code uses ${r} different digits (0 to 9), and the order of the digits matters. How many codes are possible?`,
            `一个密码由 ${r} 个互不相同的数字（0 到 9）组成，数字的顺序有关。共有多少种可能的密码？`,
          );
          places = t(
            `The $${r}$ positions of the code are different places, and no digit is used twice`,
            `密码的 $${r}$ 个位置是不同的位置，每个数字最多用一次`,
          );
        }
        const ans = perm(n, r);
        const restP = perm(n - 1, r - 1);
        return {
          ...numberProblem({
            prompt,
            answer: ans,
            mistakes: [
              why(
                comb(n, r),
                "That is the number of combinations, where order does not matter. Here order matters, so do not divide by $r!$.",
                "这是组合数，不考虑顺序。这里顺序有关，不要除以 $r!$。",
              ),
              why(
                n ** r,
                "That allows repeats, as if each position could use any item again. Each item is used once, so the choices go down by one each time.",
                "这相当于允许重复，每个位置都能再选任何一项。每一项只能用一次，所以选择数每次减一。",
              ),
              why(
                n * r,
                "You multiplied the two numbers. Count the choices for each position in turn and multiply those.",
                "你把两个数相乘了。应依次数出每个位置的选择数，再把它们相乘。",
              ),
              why(
                fact(r),
                "That only arranges the chosen ones among themselves. Start with all the choices for the first position.",
                "这只是把选出的几个相互排列。应从第一个位置的全部选择开始数。",
              ),
            ],
            solution: para(
              step(
                1,
                "the order matters",
                "顺序有关",
                t(
                  `${places.en}, so this is a permutation of $${r}$ from $${n}$: the places are filled in turn with $${n}$, $${n - 1}$, … choices.`,
                  `${places["zh-CN"]}，所以这是从 $${n}$ 个中取 $${r}$ 个的排列：依次填各个位置，分别有 $${n}$、$${n - 1}$、…… 种选法。`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "multiply",
                "相乘",
                t(
                  `Multiply the $${r}$ factors:${steps(`{}_{${n}}P_{${r}} = ${prodL(n, r)} = ${ans}`)}`,
                  `把 $${r}$ 个因数相乘：${steps(`{}_{${n}}P_{${r}} = ${prodL(n, r)} = ${ans}`)}`,
                ),
              ),
              check(
                t(
                  `Fix the first place: each of its $${n}$ choices leaves $${r - 1}$ places for the other $${n - 1}$, in $_{${n - 1}}P_{${r - 1}} = ${restP}$ ways, and $${n} \\cdot ${restP} = ${ans}$.`,
                  `固定第一个位置：它的 $${n}$ 种选法，每种都留下 $${r - 1}$ 个位置给其余 $${n - 1}$ 个，有 $_{${n - 1}}P_{${r - 1}} = ${restP}$ 种，$${n} \\cdot ${restP} = ${ans}$。`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            slotsFigure(
              countSlots(n, r),
              { total: `= ${ans}` },
              t(
                `${r} places: ${dots(countSlots(n, r).map((s) => s.text))} = ${ans}.`,
                `${r} 个位置：${dots(countSlots(n, r).map((s) => s.text))} = ${ans}。`,
              ),
            ),
          ],
        };
      },
    },
    {
      id: "permutations-with-a-condition",
      title: t("Permutations with a condition", "有条件的排列"),
      explanation: t(
        `Deal with the condition first, then count what is left: a person with a fixed role uses up that role and is no longer available, and a person who is left out shrinks the pool.

In a club of $10$, a president, a vice president and a secretary are chosen, and Ana, $A$, must be president: the other two roles go to the other $9$ members in $_{9}P_{2} = 72$ ways.

{{figure 0}}

If instead Ana must hold no role, all three roles go to the other $9$: $_{9}P_{3} = 504$ ways.

> **Watch out.** When Ana must be president, both the roles and the people go down by one: it is $_{9}P_{2}$, not $_{9}P_{3}$ or $_{10}P_{2}$. When she must hold no role, only the people go down: $_{9}P_{3}$.`,
        `先处理条件，再对剩下的部分计数：职务固定的人用掉了那个职务，也不能再选；被排除的人则使候选人减少。

一个 $10$ 人的社团选出主席、副主席和秘书，安娜 $A$ 必须当主席：另两个职务由其余 $9$ 人担任，有 $_{9}P_{2} = 72$ 种。

{{figure 0}}

若安娜不能担任任何职务，三个职务都由其余 $9$ 人担任：$_{9}P_{3} = 504$ 种。

> **注意。** 安娜必须当主席时，职务和人数都减少一个：是 $_{9}P_{2}$，不是 $_{9}P_{3}$ 或 $_{10}P_{2}$。她不能担任职务时，只有人数减少：$_{9}P_{3}$。`,
      ),
      figures: [
        slotsFigure(
          [{ text: "A", tone: "result" }, ...countSlots(9, 2)],
          { total: "= 72" },
          t("Three roles: A fixed as president, then 9 and 8 choices: 72.", "三个职务：A 固定当主席，之后依次 9、8 种选法：72。"),
        ),
      ],
      generate(rng) {
        const n = rng.int(6, 15);
        const r = rng.int(2, 4);
        const must = rng.bool();
        const roles = [
          t("a president and a vice president", "主席和副主席"),
          t("a president, a vice president and a secretary", "主席、副主席和秘书"),
          t("a president, a vice president, a secretary and a treasurer", "主席、副主席、秘书和财务"),
        ][r - 2]!;
        const ans = must ? perm(n - 1, r - 1) : perm(n - 1, r);
        const [pn, pr] = must ? [n - 1, r - 1] : [n - 1, r];
        const all = perm(n, r);
        const withAna = r * perm(n - 1, r - 1);
        const work = pr === 1 ? `{}_{${pn}}P_{${pr}} = ${ans}` : `{}_{${pn}}P_{${pr}} = ${prodL(pn, pr)} = ${ans}`;
        return {
          ...numberProblem({
            prompt: t(
              `A club has ${n} members, including Ana. ${cap(roles.en)} are chosen, and no one holds two roles. In how many ways can this be done if Ana ${must ? "must be president" : "must not hold any role"}?`,
              `一个社团有 ${n} 名成员，其中有安娜。选出${roles["zh-CN"]}，每人最多担任一个职务。如果安娜${must ? "必须当主席" : "不能担任任何职务"}，有多少种选法？`,
            ),
            answer: ans,
            wrong: [perm(n, r), must ? perm(n - 1, r) : perm(n - 1, r - 1), perm(n, r) - ans, comb(pn, pr)],
            solution: para(
              step(
                1,
                "deal with the condition",
                "先处理条件",
                must
                  ? t(
                      `Ana is president, in one way. That uses one role and one person: $${r - 1}$ role${r - 1 === 1 ? "" : "s"} remain for the other $${n - 1}$ members.`,
                      `安娜当主席，只有一种方式。这用掉了一个职务和一个人：剩下 $${r - 1}$ 个职务，由其余 $${n - 1}$ 人担任。`,
                    )
                  : t(
                      `Ana is left out, so all $${r}$ roles go to the other $${n - 1}$ members.`,
                      `安娜被排除，所以 $${r}$ 个职务都由其余 $${n - 1}$ 人担任。`,
                    ),
              ),
              figureLine(0),
              step(
                2,
                "count the rest",
                "对其余部分计数",
                t(`The roles are filled in order:${steps(work)}`, `依次填各个职务：${steps(work)}`),
              ),
              check(
                must
                  ? t(
                      `Of all $_{${n}}P_{${r}} = ${all}$ choices, each of the $${n}$ members is president in the same number of them, so Ana is president in $\\frac{${all}}{${n}} = ${ans}$ of them.`,
                      `在全部 $_{${n}}P_{${r}} = ${all}$ 种选法中，$${n}$ 名成员当主席的次数相同，所以安娜当主席的有 $\\frac{${all}}{${n}} = ${ans}$ 种。`,
                    )
                  : t(
                      `Subtract the choices where Ana holds a role from all $_{${n}}P_{${r}} = ${all}$: she can hold any of the $${r}$ roles, with the rest filled in $_{${n - 1}}P_{${r - 1}} = ${perm(n - 1, r - 1)}$ ways, so $${all} - ${r} \\cdot ${perm(n - 1, r - 1)} = ${all} - ${withAna} = ${ans}$.`,
                      `从全部 $_{${n}}P_{${r}} = ${all}$ 种中减去安娜担任职务的选法：她可以担任 $${r}$ 个职务中的任意一个，其余职务有 $_{${n - 1}}P_{${r - 1}} = ${perm(n - 1, r - 1)}$ 种，所以 $${all} - ${r} \\cdot ${perm(n - 1, r - 1)} = ${all} - ${withAna} = ${ans}$。`,
                    ),
              ),
            ),
          }),
          solutionFigures: [
            slotsFigure(
              must ? [{ text: "A", tone: "result" }, ...countSlots(n - 1, r - 1)] : countSlots(n - 1, r),
              { total: `= ${ans}` },
              must
                ? t(
                    `A marks Ana, fixed as president; then ${dots(countSlots(n - 1, r - 1).map((s) => s.text))}: ${ans}.`,
                    `A 表示安娜，固定当主席；之后 ${dots(countSlots(n - 1, r - 1).map((s) => s.text))}：${ans}。`,
                  )
                : t(
                    `${r} roles from the other ${n - 1}: ${dots(countSlots(n - 1, r).map((s) => s.text))} = ${ans}.`,
                    `${r} 个职务由其余 ${n - 1} 人担任：${dots(countSlots(n - 1, r).map((s) => s.text))} = ${ans}。`,
                  ),
            ),
          ],
        };
      },
    },
  ],
};

/** pairGrid lists the ordered pairs of A, B, C and D, one row for each unordered pair, with the given pairs marked. */
function pairGrid(marked: readonly string[] = []): string {
  const ls = ["A", "B", "C", "D"];
  const rows: Cell[][] = [];
  ls.forEach((a, i) => {
    for (const b of ls.slice(i + 1)) {
      const tone = marked.includes(a + b) ? ("result" as const) : undefined;
      rows.push([
        { text: `${a} ${b}`, tone },
        { text: `${b} ${a}`, tone },
      ]);
    }
  });
  return gridSvg(rows);
}

/** Combinations (Geometry 6.19.6). */
export const combinations: TopicDef = {
  id: "combinations",
  title: t("Combinations", "组合"),
  summary: t(
    "Count unordered selections of r objects from n with nCr = n!/(r!(n − r)!), alone and with the rule of product.",
    "用 nCr = n!/(r!(n − r)!) 计算从 n 个物体中选出 r 个（不计顺序）的方法数，并与乘法原理结合使用。",
  ),
  prerequisites: ["permutations"],
  encompasses: [
    { topic: "permutations", weight: 0.5 },
    { topic: "factorials", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.B.9"],
  intro: t(
    `Permutations count selections where the order matters. Often it does not: choosing $2$ of $4$ friends $A$, $B$, $C$ and $D$ to carry a table, $A$ with $B$ is the same as $B$ with $A$.

There are $4 \\cdot 3 = 12$ ordered pairs. Put each pair and its reverse in one row:

{{figure 0}}

Every row holds the same two friends in its $2$ orders, so there are $\\frac{12}{2} = 6$ ways to choose the pair. Such an unordered selection is a combination. In this lesson we compute combinations, use them in context, and combine them with the rule of product.`,
    `排列数计算的是与顺序有关的选法。很多时候顺序无关：从 $4$ 个朋友 $A$、$B$、$C$、$D$ 中选 $2$ 人抬桌子，$A$ 和 $B$ 与 $B$ 和 $A$ 是一样的。

有顺序的选法有 $4 \\cdot 3 = 12$ 种。把每一对和它的倒序放在同一行：

{{figure 0}}

每一行都是同样两个人的 $2$ 种顺序，所以选出这两人的方法有 $\\frac{12}{2} = 6$ 种。这样不计顺序的选取就是组合。这节课我们计算组合数，在实际问题中使用它，并把它与乘法原理结合。`,
  ),
  introFigures: [
    {
      svg: pairGrid(),
      alt: t(
        "Six rows of two ordered pairs: A B, B A; A C, C A; A D, D A; B C, C B; B D, D B; C D, D C.",
        "六行，每行两个有序对：A B、B A；A C、C A；A D、D A；B C、C B；B D、D B；C D、D C。",
      ),
    },
  ],
  knowledgePoints: [
    {
      id: "evaluating-combinations",
      title: t("Evaluating combinations", "计算组合数"),
      explanation: t(
        `A **combination** of $r$ objects from $n$ is a selection in which the order does not matter. Each combination can be ordered in $r!$ ways, so there are $r!$ times fewer combinations than permutations:

$$_{n}C_{r} = \\binom{n}{r} = \\frac{{}_{n}P_{r}}{r!} = \\frac{n!}{r!\\,(n - r)!}.$$

For example, count the ordered selections of $3$ from $8$, then divide by the $3! = 6$ orders of each:

{{figure 0}}

So $\\binom{8}{3} = \\frac{8 \\cdot 7 \\cdot 6}{3 \\cdot 2 \\cdot 1} = \\frac{336}{6} = 56$.

> **Watch out.** Divide the $r$ factors by $r!$, not by $(n - r)!$: $\\frac{8!}{5!} = 336$ is the number of permutations. Choosing $3$ to take is the same as choosing $5$ to leave, so $\\binom{8}{3} = \\binom{8}{5}$; use the smaller of $r$ and $n - r$.`,
        `从 $n$ 个物体中取出 $r$ 个、不计顺序，叫做一个**组合**。每个组合可以排成 $r!$ 种顺序，所以组合数是排列数的 $\\frac{1}{r!}$：

$$_{n}C_{r} = \\binom{n}{r} = \\frac{{}_{n}P_{r}}{r!} = \\frac{n!}{r!\\,(n - r)!}.$$

例如，先数出从 $8$ 个中取 $3$ 个的有序选法，再除以每组的 $3! = 6$ 种顺序：

{{figure 0}}

所以 $\\binom{8}{3} = \\frac{8 \\cdot 7 \\cdot 6}{3 \\cdot 2 \\cdot 1} = \\frac{336}{6} = 56$。

> **注意。** 是用 $r$ 个因数除以 $r!$，不是除以 $(n - r)!$：$\\frac{8!}{5!} = 336$ 是排列数。选出 $3$ 个带走与选出 $5$ 个留下是一回事，所以 $\\binom{8}{3} = \\binom{8}{5}$；用 $r$ 和 $n - r$ 中较小的那个来算。`,
      ),
      figures: [
        slotsFigure(
          countSlots(8, 3),
          { total: "÷ 6 = 56" },
          t("Three places with 8, 7 and 6 choices, divided by 6: 56.", "三个位置，依次有 8、7、6 种选法，再除以 6：56。"),
        ),
      ],
      generate(rng) {
        const n = rng.int(5, 14);
        const r = rng.int(2, Math.min(5, n - 2));
        const ans = comb(n, r);
        const notation = rng.bool() ? `{}_{${n}}C_{${r}}` : `\\binom{${n}}{${r}}`;
        return {
          ...numberProblem({
            prompt: t(`Evaluate $${notation}$.`, `计算 $${notation}$。`),
            answer: ans,
            wrong: [perm(n, r), n * r, fact(n) / fact(r), comb(n, r - 1) === ans ? n : comb(n, r - 1)],
            solution: para(
              step(
                1,
                "the ordered selections",
                "有序的选法",
                t(
                  `Ordered, $${r}$ of $${n}$ can be chosen in $_{${n}}P_{${r}} = ${prodL(n, r)} = ${perm(n, r)}$ ways:`,
                  `若计顺序，从 $${n}$ 个中取 $${r}$ 个有 $_{${n}}P_{${r}} = ${prodL(n, r)} = ${perm(n, r)}$ 种：`,
                ),
              ),
              figureLine(0),
              step(
                2,
                `divide by ${r}!`,
                `除以 ${r}!`,
                t(
                  `Each selection appears in $${r}! = ${fact(r)}$ orders, so${steps(`${notation} = \\frac{${prodL(n, r)}}{${factL(r)}} = \\frac{${perm(n, r)}}{${fact(r)}} = ${ans}`)}`,
                  `每种选法出现了 $${r}! = ${fact(r)}$ 次（不同顺序），所以${steps(`${notation} = \\frac{${prodL(n, r)}}{${factL(r)}} = \\frac{${perm(n, r)}}{${fact(r)}} = ${ans}`)}`,
                ),
              ),
              check(
                t(
                  `Multiply back: $${ans} \\cdot ${r}! = ${ans} \\cdot ${fact(r)} = ${perm(n, r)} = {}_{${n}}P_{${r}}$. And from the formula with factorials, $\\frac{${n}!}{${r}! \\cdot ${n - r}!} = \\frac{${big(fact(n))}}{${fact(r)} \\cdot ${big(fact(n - r))}} = ${ans}$.`,
                  `乘回去：$${ans} \\cdot ${r}! = ${ans} \\cdot ${fact(r)} = ${perm(n, r)} = {}_{${n}}P_{${r}}$。用阶乘公式也得 $\\frac{${n}!}{${r}! \\cdot ${n - r}!} = \\frac{${big(fact(n))}}{${fact(r)} \\cdot ${big(fact(n - r))}} = ${ans}$。`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            slotsFigure(
              countSlots(n, r),
              { total: `÷ ${fact(r)} = ${ans}` },
              t(
                `${r} places: ${dots(countSlots(n, r).map((s) => s.text))}, divided by ${fact(r)}: ${ans}.`,
                `${r} 个位置：${dots(countSlots(n, r).map((s) => s.text))}，再除以 ${fact(r)}：${ans}。`,
              ),
            ),
          ],
        };
      },
    },
    {
      id: "combinations-in-context",
      title: t("Combinations in context", "实际问题中的组合"),
      explanation: t(
        `Use combinations when you pick $r$ of $n$ different objects and **the order does not matter**: a group, a committee, a hand of cards, a set of toppings. The test is to swap two chosen objects: if the result is the same, the order does not matter.

A committee of $3$ from a club of $10$ can be formed in $\\binom{10}{3} = \\frac{10 \\cdot 9 \\cdot 8}{3!} = \\frac{720}{6} = 120$ ways: Ana, Ben and Kai form the same committee in any order. Each handshake among $n$ people is a pair of people, so there are $\\binom{n}{2} = \\frac{n(n - 1)}{2}$ handshakes; with $5$ people, $\\frac{5 \\cdot 4}{2} = 10$.

> **Watch out.** A committee with a president and a secretary is ordered, and $_{10}P_{3} = 720$ would be right for three different roles. For a committee of equals, $720$ counts each committee $3! = 6$ times.`,
        `从 $n$ 个不同的物体中选出 $r$ 个，并且**与顺序无关**（一组人、一个委员会、一手牌、几种配料）时，用组合。检验的办法是交换两个选出的物体：若结果不变，就与顺序无关。

从 $10$ 人的社团中选出 $3$ 人组成委员会，有 $\\binom{10}{3} = \\frac{10 \\cdot 9 \\cdot 8}{3!} = \\frac{720}{6} = 120$ 种选法：安娜、本、凯不论按什么顺序选出，都是同一个委员会。$n$ 个人两两握手，每次握手对应一对人，所以共握手 $\\binom{n}{2} = \\frac{n(n - 1)}{2}$ 次；$5$ 个人时是 $\\frac{5 \\cdot 4}{2} = 10$ 次。

> **注意。** 有主席和秘书的委员会是有顺序的，三个不同职务时 $_{10}P_{3} = 720$ 才对。对地位平等的委员会，$720$ 把每个委员会数了 $3! = 6$ 次。`,
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let n: number;
        let r: number;
        let prompt: Text;
        let why_: Text;
        if (kind === 0) {
          n = rng.int(6, 15);
          r = rng.int(2, 5);
          prompt = t(
            `A committee of ${r} people is chosen from a club of ${n} members. How many different committees are possible?`,
            `从一个有 ${n} 名成员的社团中选出 ${r} 人组成委员会。可以组成多少个不同的委员会？`,
          );
          why_ = t(
            "The members of a committee have no roles, so swapping two of them gives the same committee",
            "委员会成员没有职务之分，交换其中两人还是同一个委员会",
          );
        } else if (kind === 1) {
          n = rng.int(6, 14);
          r = rng.int(2, 4);
          prompt = t(
            `A pizzeria offers ${n} different toppings. How many different pizzas with exactly ${r} different toppings can be ordered?`,
            `一家比萨店提供 ${n} 种不同的配料。恰好加 ${r} 种不同配料的比萨共有多少种？`,
          );
          why_ = t("A pizza is the same whatever order its toppings are put on", "配料不论按什么顺序放，比萨都一样");
        } else {
          n = rng.int(5, 20);
          r = 2;
          prompt = t(
            `At a meeting, each of the ${n} people shakes hands once with each of the others. How many handshakes are there?`,
            `一次会议上，${n} 个人中每两人握手一次。共握手多少次？`,
          );
          why_ = t(
            "A handshake is a pair of people, and A with B is the same handshake as B with A",
            "一次握手对应一对人，A 和 B 握手与 B 和 A 握手是同一次",
          );
        }
        const ans = comb(n, r);
        return {
          ...numberProblem({
            prompt,
            answer: ans,
            wrong: [perm(n, r), n * r, n ** r, fact(n) / fact(n - r + 1)],
            solution: para(
              step(
                1,
                "the order does not matter",
                "与顺序无关",
                t(
                  `${why_.en}. So this is a combination of $${r}$ from $${n}$: count the ordered selections, $${prodL(n, r)} = ${perm(n, r)}$, and divide by the $${r}!$ orders of each.`,
                  `${why_["zh-CN"]}。所以这是从 $${n}$ 个中取 $${r}$ 个的组合：先数有序的选法 $${prodL(n, r)} = ${perm(n, r)}$，再除以每种选法的 $${r}!$ 种顺序。`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "compute",
                "计算",
                t(
                  `Divide:${steps(`\\binom{${n}}{${r}} = \\frac{${prodL(n, r)}}{${r}!} = \\frac{${perm(n, r)}}{${fact(r)}} = ${ans}`)}`,
                  `相除：${steps(`\\binom{${n}}{${r}} = \\frac{${prodL(n, r)}}{${r}!} = \\frac{${perm(n, r)}}{${fact(r)}} = ${ans}`)}`,
                ),
              ),
              check(
                kind === 2
                  ? t(
                      `Count by people: each of the $${n}$ people shakes $${n - 1}$ hands, which counts every handshake twice, once for each person in it: $\\frac{${n} \\cdot ${n - 1}}{2} = ${ans}$.`,
                      `按人来数：$${n}$ 个人每人握手 $${n - 1}$ 次，这样每次握手被它的两个人各数了一次：$\\frac{${n} \\cdot ${n - 1}}{2} = ${ans}$。`,
                    )
                  : t(
                      `Each of the $${ans}$ selections can be put in $${r}! = ${fact(r)}$ orders, and $${ans} \\cdot ${fact(r)} = ${perm(n, r)}$, the number of ordered selections.`,
                      `$${ans}$ 种选法中的每一种都可以排成 $${r}! = ${fact(r)}$ 种顺序，$${ans} \\cdot ${fact(r)} = ${perm(n, r)}$，正是有序选法的个数。`,
                    ),
              ),
            ),
          }),
          solutionFigures: [
            slotsFigure(
              countSlots(n, r),
              { total: `÷ ${fact(r)} = ${ans}` },
              t(
                `${r} places: ${dots(countSlots(n, r).map((s) => s.text))}, divided by ${fact(r)}: ${ans}.`,
                `${r} 个位置：${dots(countSlots(n, r).map((s) => s.text))}，再除以 ${fact(r)}：${ans}。`,
              ),
            ),
          ],
        };
      },
    },
    {
      id: "choosing-from-two-groups",
      title: t("Choosing from two groups", "从两组中选取"),
      explanation: t(
        `When a selection takes a given number from each of two groups, choose from each group with a combination, then multiply by the rule of product: every choice of girls goes with every choice of boys.

A team of $2$ girls and $3$ boys chosen from $5$ girls and $6$ boys:

{{figure 0}}

$\\binom{5}{2} \\cdot \\binom{6}{3} = 10 \\cdot 20 = 200$ teams.

> **Watch out.** This is not $\\binom{11}{5} = 462$, which counts every team of $5$, whatever its mix, and not $10 + 20 = 30$: a team needs the girls *and* the boys, so multiply.`,
        `从两组中各选出指定的人数时，每组用组合数计算，再用乘法原理相乘：每一种女生的选法都可以配每一种男生的选法。

从 $5$ 名女生和 $6$ 名男生中选出 $2$ 名女生和 $3$ 名男生组队：

{{figure 0}}

共 $\\binom{5}{2} \\cdot \\binom{6}{3} = 10 \\cdot 20 = 200$ 种。

> **注意。** 它不是 $\\binom{11}{5} = 462$，那是不论男女组成的所有 $5$ 人队伍的个数；也不是 $10 + 20 = 30$：一个队既要女生*又*要男生，所以相乘。`,
      ),
      figures: [
        slotsFigure(
          [
            { text: "10", tone: "result" },
            { text: "20", tone: "action" },
          ],
          { total: "= 200" },
          t(
            "Two boxes: 10 choices of the girls times 20 choices of the boys: 200.",
            "两个格子：女生的 10 种选法乘以男生的 20 种选法：200。",
          ),
        ),
      ],
      generate(rng) {
        const g = rng.int(3, 9);
        const b = rng.int(3, 9);
        const x = rng.int(1, Math.min(3, g - 1));
        const y = rng.int(1, Math.min(3, b - 1));
        const ans = comb(g, x) * comb(b, y);
        const cL = (n: number, r: number) =>
          r === 1 ? `\\binom{${n}}{1} = ${n}` : `\\binom{${n}}{${r}} = \\frac{${prodL(n, r)}}{${factL(r)}} = ${comb(n, r)}`;
        const allTeams = comb(g + b, x + y);
        return {
          ...numberProblem({
            prompt: t(
              `A team is made of ${x} girl${x === 1 ? "" : "s"} chosen from ${g} girls and ${y} boy${y === 1 ? "" : "s"} chosen from ${b} boys. How many different teams are possible?`,
              `从 ${g} 名女生中选出 ${x} 名、从 ${b} 名男生中选出 ${y} 名组成一个队。可以组成多少个不同的队？`,
            ),
            answer: ans,
            wrong: [comb(g, x) + comb(b, y), comb(g + b, x + y), perm(g, x) * perm(b, y)],
            solution: para(
              step(
                1,
                "each group on its own",
                "每组分别计算",
                t(
                  `The order within each group does not matter. The girls: $${cL(g, x)}$ ways. The boys: $${cL(b, y)}$ ways.`,
                  `每组内部与顺序无关。女生：$${cL(g, x)}$ 种。男生：$${cL(b, y)}$ 种。`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "multiply",
                "相乘",
                t(
                  `Any choice of girls goes with any choice of boys:${steps(`\\binom{${g}}{${x}} \\cdot \\binom{${b}}{${y}} = ${comb(g, x)} \\cdot ${comb(b, y)} = ${ans}`)}`,
                  `任何一种女生的选法都可以配任何一种男生的选法：${steps(`\\binom{${g}}{${x}} \\cdot \\binom{${b}}{${y}} = ${comb(g, x)} \\cdot ${comb(b, y)} = ${ans}`)}`,
                ),
              ),
              check(
                t(
                  `These teams are some of all teams of $${x + y}$ from the $${g + b}$ children, $\\binom{${g + b}}{${x + y}} = ${allTeams}$, and indeed $${ans} < ${allTeams}$: the rest have a different mix of girls and boys. Also, choosing $${x}$ girls to take is choosing $${g - x}$ to leave out, and $\\binom{${g}}{${g - x}} = ${comb(g, g - x)}$ agrees.`,
                  `这些队是从 $${g + b}$ 个孩子中选 $${x + y}$ 人的所有队伍的一部分，后者有 $\\binom{${g + b}}{${x + y}} = ${allTeams}$ 个，确实 $${ans} < ${allTeams}$：其余的队男女人数搭配不同。另外，选出 $${x}$ 名女生就是选出 $${g - x}$ 名留下，$\\binom{${g}}{${g - x}} = ${comb(g, g - x)}$，结果一致。`,
                ),
              ),
            ),
          }),
          solutionFigures: [
            slotsFigure(
              [
                { text: String(comb(g, x)), tone: "result" },
                { text: String(comb(b, y)), tone: "action" },
              ],
              { total: `= ${ans}` },
              t(
                `${comb(g, x)} choices of the girls times ${comb(b, y)} choices of the boys: ${ans}.`,
                `女生的 ${comb(g, x)} 种选法乘以男生的 ${comb(b, y)} 种选法：${ans}。`,
              ),
            ),
          ],
        };
      },
    },
  ],
};

/** Group is a group of two kinds of people or objects from which some are chosen at random. */
interface Group {
  readonly setup: (x: number, y: number, k: number) => Text;
  readonly x: Text;
  readonly y: Text;
  /** unit is the Chinese measure word for one member. */
  readonly unit: string;
  /** zx and zy name the two kinds in Chinese with their measure word, after a number. */
  readonly zx: string;
  readonly zy: string;
}

/** groups are the groups of two kinds from which selections are made at random. */
const groups: readonly Group[] = [
  {
    setup: (x, y, k) =>
      t(
        `A club has ${x} women and ${y} men. A committee of ${k} members is chosen at random.`,
        `一个社团有 ${x} 名女性和 ${y} 名男性。从中随机选出 ${k} 人组成委员会。`,
      ),
    x: t("women", "女性"),
    y: t("men", "男性"),
    unit: "名",
    zx: "名女性",
    zy: "名男性",
  },
  {
    setup: (x, y, k) =>
      t(
        `A bag holds ${x} red and ${y} blue marbles. ${k} marbles are taken out at random at the same time.`,
        `袋子里有 ${x} 颗红弹珠和 ${y} 颗蓝弹珠。同时随机取出 ${k} 颗。`,
      ),
    x: t("red", "红色"),
    y: t("blue", "蓝色"),
    unit: "颗",
    zx: "颗红弹珠",
    zy: "颗蓝弹珠",
  },
];

/** fracProd writes a product of fractions a/b · (a − 1)/(b − 1) · … with k factors. */
const fracProd = (a: number, b: number, k: number) => Array.from({ length: k }, (_, i) => fr(a - i, b - i)).join(" \\cdot ");

/** Computing probabilities using combinatorics (Geometry 6.19.7). */
export const computingProbabilitiesUsingCombinatorics: TopicDef = {
  id: "computing-probabilities-using-combinatorics",
  title: t("Computing Probabilities Using Combinatorics", "用计数方法求概率"),
  summary: t(
    "Find probabilities of equally likely outcomes by counting favorable and possible outcomes with combinations and orders.",
    "用组合数和排列数分别数出有利结果和全部结果，求等可能结果的概率。",
  ),
  prerequisites: ["combinations"],
  encompasses: [
    { topic: "combinations", weight: 0.7 },
    { topic: "ordering-objects", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.B.9"],
  intro: t(
    `When every outcome is equally likely, a probability is a count divided by a count, and the counting rules do the work.

Two of $4$ friends $A$, $B$, $C$ and $D$ are picked at random to carry a table. The $\\binom{4}{2} = 6$ pairs are equally likely, one per row:

{{figure 0}}

Only one of them is $A$ with $B$, so the probability that $A$ and $B$ are both picked is $\\frac{1}{6}$. In this lesson we find such probabilities for selections of one kind, mixed selections, and random orders.`,
    `当每种结果等可能时，概率就是一个个数除以另一个个数，计数原理就派上了用场。

从 $4$ 个朋友 $A$、$B$、$C$、$D$ 中随机选 $2$ 人抬桌子。$\\binom{4}{2} = 6$ 种两人组合等可能，每行一种：

{{figure 0}}

其中只有一种是 $A$ 和 $B$，所以 $A$、$B$ 都被选中的概率是 $\\frac{1}{6}$。这节课我们求这样的概率：选出的全是一类、混合的选法、以及随机的排列顺序。`,
  ),
  introFigures: [
    {
      svg: pairGrid(["AB"]),
      alt: t(
        "Six rows, one for each pair, each in its two orders: A B, B A; A C, C A; A D, D A; B C, C B; B D, D B; C D, D C. Marked: the row A B.",
        "六行，每对一行，各有两种顺序：A B、B A；A C、C A；A D、D A；B C、C B；B D、D B；C D、D C。标出：A B 那一行。",
      ),
    },
  ],
  knowledgePoints: [
    {
      id: "all-of-one-kind",
      title: t("All of one kind", "全是同一类"),
      explanation: t(
        `When all selections are equally likely,

$$P(\\text{event}) = \\frac{\\text{number of favorable selections}}{\\text{number of possible selections}}.$$

Choosing at random means every selection of the right size is equally likely, so count both with combinations. A committee of $3$ is chosen at random from $5$ women and $4$ men. There are $\\binom{9}{3} = 84$ possible committees, and $\\binom{5}{3} = 10$ of them are all women, so

$$P(\\text{all women}) = \\frac{10}{84} = \\frac{5}{42}.$$

One at a time, by the multiplication law, it is $\\frac{5}{9} \\cdot \\frac{4}{8} \\cdot \\frac{3}{7} = \\frac{60}{504} = \\frac{5}{42}$ too.

> **Watch out.** The members are chosen without replacement, so it is not $\\left(\\frac{5}{9}\\right)^{3}$. And the denominator counts committees of $3$ from all $9$ people, not from the women only.`,
        `当所有选法等可能时，

$$P(\\text{事件}) = \\frac{\\text{有利的选法数}}{\\text{全部的选法数}}.$$

随机选取意味着每一种规定人数的选法都等可能，所以分子分母都用组合数来数。从 $5$ 名女性和 $4$ 名男性中随机选出 $3$ 人组成委员会。全部委员会有 $\\binom{9}{3} = 84$ 个，其中全是女性的有 $\\binom{5}{3} = 10$ 个，所以

$$P(\\text{全是女性}) = \\frac{10}{84} = \\frac{5}{42}.$$

用乘法公式一个一个地选，也得 $\\frac{5}{9} \\cdot \\frac{4}{8} \\cdot \\frac{3}{7} = \\frac{60}{504} = \\frac{5}{42}$。

> **注意。** 选人是不放回的，所以不是 $\\left(\\frac{5}{9}\\right)^{3}$。分母数的是从全部 $9$ 人中选 $3$ 人的委员会，不是只从女性中选。`,
      ),
      generate(rng) {
        const gr = rng.pick(groups);
        const x = rng.int(3, 9);
        const y = rng.int(2, 9);
        const k = rng.int(2, Math.min(4, x));
        const n = x + y;
        const fav = comb(x, k);
        const all = comb(n, k);
        return numberProblem({
          prompt: t(
            `${gr.setup(x, y, k).en} What is the probability that all of them are ${gr.x.en}?${simplest.en}`,
            `${gr.setup(x, y, k)["zh-CN"]}求选出的全是${gr.x["zh-CN"]}的概率。${simplest["zh-CN"]}`,
          ),
          answer: Q.of(fav, all),
          wrong: [Q.of(x, n).pow(k), Q.of(x, n), Q.of(k, n), Q.of(1, all)],
          solution: para(
            step(
              1,
              "count the possible selections",
              "数全部选法",
              t(
                `Every selection of $${k}$ from the $${n}$ is equally likely, and there are $\\binom{${n}}{${k}} = \\frac{${prodL(n, k)}}{${factL(k)}} = ${all}$ of them.`,
                `从 $${n}$ 个中选 $${k}$ 个的每一种选法都等可能，共有 $\\binom{${n}}{${k}} = \\frac{${prodL(n, k)}}{${factL(k)}} = ${all}$ 种。`,
              ),
            ),
            step(
              2,
              "count the favorable ones",
              "数有利的选法",
              t(
                `All ${gr.x.en} means all $${k}$ come from the $${x}$ ${gr.x.en}: $\\binom{${x}}{${k}} = ${fav}$ ways. So${steps(`P = ${ratioL(fav, all)}`)}`,
                `全是${gr.x["zh-CN"]}，就是 $${k}$ ${gr.unit}都来自 $${x}$ ${gr.zx}：$\\binom{${x}}{${k}} = ${fav}$ 种。所以${steps(`P = ${ratioL(fav, all)}`)}`,
              ),
            ),
            check(
              t(
                `Take them one at a time with the multiplication law:${steps(`${fracProd(x, n, k)} = ${ratioL(perm(x, k), perm(n, k))}`)}`,
                `用乘法公式一个一个地取：${steps(`${fracProd(x, n, k)} = ${ratioL(perm(x, k), perm(n, k))}`)}`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "exactly-j-of-one-kind",
      title: t("Exactly j of one kind", "恰好有 j 个是某一类"),
      explanation: t(
        `For a mixed selection, count the favorable selections with the rule of product: choose the right number from each kind, since every choice from one kind goes with every choice from the other.

A committee of $3$ from $5$ women and $4$ men has exactly $2$ women in $\\binom{5}{2} \\cdot \\binom{4}{1} = 10 \\cdot 4 = 40$ ways, so

$$P(\\text{exactly 2 women}) = \\frac{40}{84} = \\frac{10}{21}.$$

The numbers of women $0$, $1$, $2$, $3$ share out all committees: $4 + 30 + 40 + 10 = 84$.

> **Watch out.** "Exactly $2$ women" in a committee of $3$ also fixes $1$ man: multiply by $\\binom{4}{1}$, do not leave it out, and do not add the two counts.`,
        `对混合的选法，用乘法原理数有利的选法：每一类各选出要求的个数，因为一类的每种选法都可以配另一类的每种选法。

从 $5$ 名女性和 $4$ 名男性中选出 $3$ 人，恰好有 $2$ 名女性的选法有 $\\binom{5}{2} \\cdot \\binom{4}{1} = 10 \\cdot 4 = 40$ 种，所以

$$P(\\text{恰好 2 名女性}) = \\frac{40}{84} = \\frac{10}{21}.$$

女性人数为 $0$、$1$、$2$、$3$ 分掉了全部委员会：$4 + 30 + 40 + 10 = 84$。

> **注意。** 在 $3$ 人委员会中“恰好 $2$ 名女性”也就确定了 $1$ 名男性：要乘以 $\\binom{4}{1}$，不能漏掉，也不能把两个数相加。`,
      ),
      generate(rng) {
        const gr = rng.pick(groups);
        const x = rng.int(3, 9);
        const y = rng.int(3, 9);
        const k = rng.int(3, 4);
        const j = rng.int(1, k - 1);
        const n = x + y;
        const fav = comb(x, j) * comb(y, k - j);
        const all = comb(n, k);
        const split = Array.from({ length: k + 1 }, (_, i) => comb(x, i) * comb(y, k - i));
        return numberProblem({
          prompt: t(
            `${gr.setup(x, y, k).en} What is the probability that exactly ${j} of them ${j === 1 ? "is" : "are"} ${gr.x.en}?${simplest.en}`,
            `${gr.setup(x, y, k)["zh-CN"]}求选出的恰好有 ${j} 个是${gr.x["zh-CN"]}的概率。${simplest["zh-CN"]}`,
          ),
          answer: Q.of(fav, all),
          wrong: [Q.of(comb(x, j), all), Q.of(j, k), Q.of(comb(x, j) + comb(y, k - j), all), Q.of(x, n)],
          solution: para(
            step(
              1,
              "count the possible selections",
              "数全部选法",
              t(
                `All selections of $${k}$ from the $${n}$ are equally likely: $\\binom{${n}}{${k}} = ${all}$.`,
                `从 $${n}$ 个中选 $${k}$ 个的所有选法等可能：$\\binom{${n}}{${k}} = ${all}$ 种。`,
              ),
            ),
            step(
              2,
              "count the favorable ones",
              "数有利的选法",
              t(
                `Exactly $${j}$ ${gr.x.en} means $${j}$ of the $${x}$ ${gr.x.en} and $${k - j}$ of the $${y}$ ${gr.y.en}, chosen together: $\\binom{${x}}{${j}} \\cdot \\binom{${y}}{${k - j}} = ${comb(x, j)} \\cdot ${comb(y, k - j)} = ${fav}$ ways. So${steps(`P = ${ratioL(fav, all)}`)}`,
                `恰好 $${j}$ ${gr.unit}${gr.x["zh-CN"]}，就是从 $${x}$ ${gr.zx}中选 $${j}$ ${gr.unit}，同时从 $${y}$ ${gr.zy}中选 $${k - j}$ ${gr.unit}：$\\binom{${x}}{${j}} \\cdot \\binom{${y}}{${k - j}} = ${comb(x, j)} \\cdot ${comb(y, k - j)} = ${fav}$ 种。所以${steps(`P = ${ratioL(fav, all)}`)}`,
              ),
            ),
            check(
              t(
                `The numbers of ${gr.x.en} from $0$ to $${k}$ share out all the selections, so their counts add up to $${all}$: $${split.join(" + ")} = ${split.reduce((s, v) => s + v, 0)}$.`,
                `${gr.x["zh-CN"]}的个数从 $0$ 到 $${k}$ 分掉了全部选法，所以各自的个数之和是 $${all}$：$${split.join(" + ")} = ${split.reduce((s, v) => s + v, 0)}$。`,
              ),
            ),
          ),
        });
      },
    },
    {
      id: "probabilities-of-orders",
      title: t("Probabilities of orders", "排列的概率"),
      explanation: t(
        `When objects are put in a random order, all $n!$ orders are equally likely. Count the favorable orders with the methods for ordering objects.

$6$ friends line up at random. Ana and Ben, as a block $A$ $B$, stand next to each other in $2 \\cdot 5! = 240$ of the $6! = 720$ orders:

{{figure 0}}

So the probability is $\\frac{240}{720} = \\frac{1}{3}$. Ana is at the left end and Ben at the right end in $4! = 24$ orders: probability $\\frac{24}{720} = \\frac{1}{30}$.

> **Watch out.** Count the favorable orders and the possible orders the same way, both as orders of all $6$ friends. Next to each other includes both Ana–Ben and Ben–Ana; directly to the left of Ben is only one of them.`,
        `物体随机排列时，全部 $n!$ 种顺序等可能。用排列物体的方法数出有利的顺序。

$6$ 个朋友随机站成一排。安娜和本捆成整体 $A$ $B$，在 $6! = 720$ 种顺序中，他们相邻的有 $2 \\cdot 5! = 240$ 种：

{{figure 0}}

所以概率是 $\\frac{240}{720} = \\frac{1}{3}$。安娜在最左端、本在最右端的有 $4! = 24$ 种：概率是 $\\frac{24}{720} = \\frac{1}{30}$。

> **注意。** 有利的顺序和全部的顺序要用同一种方式来数，都看作全部 $6$ 人的排列。相邻包括安娜—本和本—安娜两种；“紧挨在本的左边”只是其中一种。`,
      ),
      figures: [
        slotsFigure(
          [{ text: "A B", tone: "action" }, ...countSlots(4, 4)],
          { total: "· 2" },
          t(
            "Five units: the block A B and four others, then times 2 for the order inside the block.",
            "五个单位：整体 A B 和其余四人，再乘以整体内部顺序的 2。",
          ),
        ),
      ],
      generate(rng) {
        const n = rng.int(4, 9);
        const kind = rng.int(0, 4);
        const fav = [2 * fact(n - 1), fact(n - 2), fact(n - 1), 2 * fact(n - 1), fact(n - 1)][kind]!;
        const all = fact(n);
        const what = [
          t("Ana and Ben stand next to each other", "安娜和本相邻"),
          t("Ana is at the left end and Ben is at the right end", "安娜在最左端、本在最右端"),
          t("Ana is at the left end", "安娜在最左端"),
          t("Ana is at one of the two ends", "安娜在两端之一"),
          t("Ana stands directly to the left of Ben", "安娜紧挨在本的左边"),
        ][kind]!;
        const how = [
          `2 \\cdot ${n - 1}! = ${fav}`,
          `${n - 2}! = ${fav}`,
          `${n - 1}! = ${fav}`,
          `2 \\cdot ${n - 1}! = ${fav}`,
          `${n - 1}! = ${fav}`,
        ][kind]!;
        const reason = [
          t(
            `glue Ana and Ben into a block: $${n - 1}$ units in $${n - 1}!$ orders, and $2$ orders inside the block`,
            `把安娜和本捆成整体：$${n - 1}$ 个单位有 $${n - 1}!$ 种顺序，整体内部有 $2$ 种`,
          ),
          t(
            `with Ana and Ben fixed at the ends, the other $${n - 2}$ fill the middle in any order`,
            `安娜和本固定在两端，其余 $${n - 2}$ 人在中间任意排列`,
          ),
          t(
            `with Ana fixed at the left end, the other $${n - 1}$ fill the rest in any order`,
            `安娜固定在最左端，其余 $${n - 1}$ 人在剩下的位置任意排列`,
          ),
          t(
            `Ana has $2$ ends to choose from, and the other $${n - 1}$ fill the rest in any order`,
            `安娜有 $2$ 个端点可选，其余 $${n - 1}$ 人在剩下的位置任意排列`,
          ),
          t(
            `glue Ana and Ben into the block Ana–Ben, in this order only: $${n - 1}$ units in $${n - 1}!$ orders`,
            `把安娜和本捆成“安娜—本”这一个整体，顺序固定：$${n - 1}$ 个单位有 $${n - 1}!$ 种顺序`,
          ),
        ][kind]!;
        const pairs = (n * (n - 1)) / 2;
        const checkText = [
          t(
            `Look only at the two places Ana and Ben take: all $\\binom{${n}}{2} = ${pairs}$ pairs of places are equally likely, and $${n - 1}$ of them are next to each other: $${ratioL(n - 1, pairs)}$.`,
            `只看安娜和本所占的两个位置：$\\binom{${n}}{2} = ${pairs}$ 对位置等可能，其中相邻的有 $${n - 1}$ 对：$${ratioL(n - 1, pairs)}$。`,
          ),
          t(
            `With the multiplication law: Ana is at the left end with probability $\\frac{1}{${n}}$, and then Ben, among the $${n - 1}$ places left, at the right end with probability $\\frac{1}{${n - 1}}$: $\\frac{1}{${n}} \\cdot \\frac{1}{${n - 1}} = ${ratioL(1, n * (n - 1))}$.`,
            `用乘法公式：安娜在最左端的概率是 $\\frac{1}{${n}}$，然后本在剩下 $${n - 1}$ 个位置中的最右端，概率是 $\\frac{1}{${n - 1}}$：$\\frac{1}{${n}} \\cdot \\frac{1}{${n - 1}} = ${ratioL(1, n * (n - 1))}$。`,
          ),
          t(
            `Ana is equally likely to be in each of the $${n}$ places, so she is at the left end with probability $\\frac{1}{${n}}$.`,
            `安娜在 $${n}$ 个位置上的机会相同，所以她在最左端的概率是 $\\frac{1}{${n}}$。`,
          ),
          t(
            `Ana is equally likely to be in each of the $${n}$ places, and $2$ of them are ends: $${ratioL(2, n)}$.`,
            `安娜在 $${n}$ 个位置上的机会相同，其中 $2$ 个是端点：$${ratioL(2, n)}$。`,
          ),
          t(
            `When Ana and Ben are next to each other, with probability $${Q.of(2, n).toLatex()}$, Ana is on the left in half of the orders: $\\frac{1}{2} \\cdot ${Q.of(2, n).toLatex()} = ${Q.of(1, n).toLatex()}$.`,
            `安娜和本相邻的概率是 $${Q.of(2, n).toLatex()}$，其中一半的顺序安娜在左边：$\\frac{1}{2} \\cdot ${Q.of(2, n).toLatex()} = ${Q.of(1, n).toLatex()}$。`,
          ),
        ][kind]!;
        const slotsOf: Slot[][] = [
          [{ text: "A B", tone: "action" }, ...countSlots(n - 2, n - 2)],
          [{ text: "A", tone: "result" }, ...countSlots(n - 2, n - 2), { text: "B", tone: "result" }],
          [{ text: "A", tone: "result" }, ...countSlots(n - 1, n - 1)],
          [{ text: "2", tone: "result" }, ...countSlots(n - 1, n - 1)],
          [{ text: "A B", tone: "action" }, ...countSlots(n - 2, n - 2)],
        ];
        const slots = slotsOf[kind]!;
        const alt = [
          t(
            `The block A B of Ana and Ben and ${n - 2} others, then times 2 for the order inside the block.`,
            `安娜和本的整体 A B 与其余 ${n - 2} 人，再乘以整体内部顺序的 2。`,
          ),
          t(
            `A and B, Ana and Ben, fixed at the ends; the ${n - 2} others between them.`,
            `A 和 B，即安娜和本，固定在两端；其余 ${n - 2} 人在中间。`,
          ),
          t(`A, Ana, fixed at the left end; then the ${n - 1} others.`, `A 即安娜，固定在最左端；之后是其余 ${n - 1} 人。`),
          t(`2 choices of end for Ana; then the ${n - 1} others.`, `安娜有 2 种端点可选；之后是其余 ${n - 1} 人。`),
          t(`The block A B, Ana then Ben, and ${n - 2} others.`, `整体 A B，安娜在前、本在后，与其余 ${n - 2} 人。`),
        ][kind]!;
        return {
          ...numberProblem({
            prompt: t(
              `${n} friends, including Ana and Ben, stand in a line in a random order. What is the probability that ${what.en}?${simplest.en}`,
              `包括安娜和本在内的 ${n} 个朋友随机站成一排。求${what["zh-CN"]}的概率。${simplest["zh-CN"]}`,
            ),
            answer: Q.of(fav, all),
            wrong: [Q.of(1, all), Q.of(1, n * n), Q.of(2, n * (n - 1)), Q.of(fact(n - 1), all)],
            solution: para(
              step(
                1,
                "count the favorable orders",
                "数有利的顺序",
                t(
                  `All $${n}! = ${all}$ orders are equally likely. For the favorable ones, ${reason.en}:`,
                  `全部 $${n}! = ${all}$ 种顺序等可能。有利的顺序：${reason["zh-CN"]}：`,
                ),
              ),
              figureLine(0),
              step(
                2,
                "divide",
                "相除",
                t(
                  `There are $${how}$ favorable orders, so${steps(`P = ${ratioL(fav, all)}`)}`,
                  `有利的顺序有 $${how}$ 种，所以${steps(`P = ${ratioL(fav, all)}`)}`,
                ),
              ),
              check(checkText),
            ),
          }),
          solutionFigures: [slotsFigure(slots, kind === 0 ? { total: "· 2" } : {}, alt)],
        };
      },
    },
  ],
};

/** combinatoricsTopics are the topics of conditional probability and combinatorics, in outline order. */
export const combinatoricsTopics: readonly TopicDef[] = [
  conditionalProbabilitiesFromVennDiagrams,
  conditionalProbabilitiesFromTables,
  theMultiplicationLawForConditionalProbability,
  theLawOfTotalProbability,
  treeDiagramsForDependentEvents,
  treeDiagramsForDependentEventsApplications,
  independentEvents,
  treeDiagramsForIndependentEvents,
  theRulesOfSumAndProduct,
  factorials,
  factorialsInVariableExpressions,
  orderingObjects,
  permutations,
  combinations,
  computingProbabilitiesUsingCombinatorics,
];
