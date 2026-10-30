import { numberLiteral } from "./forms.ts";
import { normalizeLatex, ParseError, parseExpression } from "./latex.ts";
import type { Q } from "./rational.ts";

/** Interval is a set of real numbers between two endpoints; an undefined endpoint is infinite, and infinite endpoints are open. */
export interface Interval {
  readonly lo?: Q;
  readonly hi?: Q;
  readonly loClosed: boolean;
  readonly hiClosed: boolean;
}

/** RealSet is a union of disjoint intervals in increasing order, with no two that touch; the empty set is []. */
export type RealSet = readonly Interval[];

/** realLine is the set of all real numbers. */
export const realLine: RealSet = [{ loClosed: false, hiClosed: false }];

const isEmpty = (i: Interval) =>
  i.lo !== undefined && i.hi !== undefined && (i.lo.cmp(i.hi) > 0 || (i.lo.eq(i.hi) && !(i.loClosed && i.hiClosed)));

/** cmpLo orders lower endpoints: −∞ first, and a closed endpoint before an open one at the same number. */
function cmpLo(a: Interval, b: Interval): number {
  if (a.lo === undefined || b.lo === undefined) return (a.lo === undefined ? 0 : 1) - (b.lo === undefined ? 0 : 1);
  return a.lo.cmp(b.lo) || (a.loClosed === b.loClosed ? 0 : a.loClosed ? -1 : 1);
}

/** cmpHi orders upper endpoints: +∞ last, and an open endpoint before a closed one at the same number. */
function cmpHi(a: Interval, b: Interval): number {
  if (a.hi === undefined || b.hi === undefined) return (a.hi === undefined ? 1 : 0) - (b.hi === undefined ? 1 : 0);
  return a.hi.cmp(b.hi) || (a.hiClosed === b.hiClosed ? 0 : a.hiClosed ? 1 : -1);
}

/** reaches tells whether a ends at or after the start of b, so that their union is one interval. */
function reaches(a: Interval, b: Interval): boolean {
  if (a.hi === undefined || b.lo === undefined) return true;
  const c = a.hi.cmp(b.lo);
  return c > 0 || (c === 0 && (a.hiClosed || b.loClosed));
}

/** union normalizes intervals into a RealSet. */
export function union(...intervals: readonly Interval[]): RealSet {
  const sorted = intervals.filter((i) => !isEmpty(i)).sort(cmpLo);
  const out: Interval[] = [];
  for (const i of sorted) {
    const last = out[out.length - 1];
    if (last && reaches(last, i)) out[out.length - 1] = cmpHi(last, i) >= 0 ? last : { ...last, hi: i.hi, hiClosed: i.hiClosed };
    else out.push(i);
  }
  return out;
}

/** intersect is the intersection of two sets. */
export function intersect(a: RealSet, b: RealSet): RealSet {
  const out: Interval[] = [];
  for (const x of a) {
    for (const y of b) {
      const lo = cmpLo(x, y) >= 0 ? x : y;
      const hi = cmpHi(x, y) <= 0 ? x : y;
      out.push({ lo: lo.lo, loClosed: lo.loClosed, hi: hi.hi, hiClosed: hi.hiClosed });
    }
  }
  return union(...out);
}

/** setEqual tells whether two normalized sets are equal. */
export function setEqual(a: RealSet, b: RealSet): boolean {
  return a.length === b.length && a.every((x, i) => cmpLo(x, b[i]!) === 0 && cmpHi(x, b[i]!) === 0);
}

const infinity = /^([+-]?)\\infty$/;

/** endpoint reads an endpoint: a number in simplest form, or ±∞ (undefined); it throws a ParseError otherwise, and reports a number not in simplest form. */
function endpoint(s: string): { value?: Q; infinite?: -1 | 1; reduced: boolean } {
  const t = s.replace(/\s/g, "");
  const inf = infinity.exec(t);
  if (inf) return { infinite: inf[1] === "-" ? -1 : 1, reduced: true };
  const lit = numberLiteral(parseExpression(t));
  if (!lit) throw new ParseError("an endpoint must be a number");
  return { value: lit.value, reduced: lit.reduced };
}

/** ParsedSet is a set read from a response, with whether its numbers were in simplest form. */
export interface ParsedSet {
  readonly set: RealSet;
  readonly reduced: boolean;
}

const cleanup = (s: string) =>
  normalizeLatex(s)
    .replace(/\\left|\\right|\\big|\\Big/g, "")
    .replace(/∞/g, "\\infty")
    .replace(/\\(?:text|mathrm|operatorname)\{\s*([^{}]*?)\s*\}/g, " $1 ")
    .trim();

const emptyNames = /^(?:\\emptyset|\\varnothing|∅|\\\{\s*\\\}|\{\s*\})$/;
const realNames = /^(?:\\mathbb\{R\}|ℝ|R|\(-\\infty,\s*\+?\\infty\))$/;

/** parseIntervals reads interval notation: "(-2, 5]", "(-\infty, 3) \cup [5, \infty)", ℝ or ∅. */
export function parseIntervals(input: string): ParsedSet {
  const s = cleanup(input);
  if (emptyNames.test(s)) return { set: [], reduced: true };
  if (realNames.test(s.replace(/\s/g, ""))) return { set: realLine, reduced: true };
  let reduced = true;
  const parts = s.split(/\\cup(?![a-zA-Z])|∪/).map((p) => p.trim());
  const intervals = parts.map((p): Interval => {
    const m = /^([([])(.*),(.*)([)\]])$/.exec(p);
    if (!m) throw new ParseError("expected an interval such as (a, b]");
    const lo = endpoint(m[2]!);
    const hi = endpoint(m[3]!);
    reduced &&= lo.reduced && hi.reduced;
    const loClosed = m[1] === "[";
    const hiClosed = m[4] === "]";
    if (lo.infinite === 1 || hi.infinite === -1) throw new ParseError("the endpoints are in the wrong order");
    if ((lo.infinite && loClosed) || (hi.infinite && hiClosed)) throw new ParseError("an infinite endpoint must be open");
    const i: Interval = { lo: lo.value, hi: hi.value, loClosed, hiClosed };
    if (lo.value && hi.value && lo.value.cmp(hi.value) >= 0) throw new ParseError("the endpoints are in the wrong order");
    return i;
  });
  return { set: union(...intervals), reduced };
}

type Op = "<" | "<=" | ">" | ">=";
const opPattern = /<=|>=|\\leq?(?![a-zA-Z])|\\geq?(?![a-zA-Z])|\\lt(?![a-zA-Z])|\\gt(?![a-zA-Z])|<|>/g;

function opOf(s: string): Op {
  if (s === "<" || s === "\\lt") return "<";
  if (s === ">" || s === "\\gt") return ">";
  return s.includes("l") || s.startsWith("<") ? "<=" : ">=";
}

/** ray is the set of x with x op v. */
function ray(op: Op, v: Q): Interval {
  if (op === "<" || op === "<=") return { hi: v, hiClosed: op === "<=", loClosed: false };
  return { lo: v, loClosed: op === ">=", hiClosed: false };
}

const reverse: Record<Op, Op> = { "<": ">", "<=": ">=", ">": "<", ">=": "<=" };

/** parseInequalities reads a compound inequality in one variable: "-2 < x \le 5", "x < -1 \text{ or } x \ge 3", "x > 0 \text{ and } x \le 4". */
export function parseInequalities(input: string, variable: string): ParsedSet {
  const s = cleanup(input);
  if (emptyNames.test(s)) return { set: [], reduced: true };
  let reduced = true;
  const atom = (a: string): RealSet => {
    const ops = [...a.matchAll(opPattern)];
    const pieces = a.split(opPattern).map((p) => p.trim());
    if (ops.length === 0 || ops.length > 2) throw new ParseError("expected an inequality");
    const read = (p: string) => {
      const e = endpoint(p);
      if (!e.value) throw new ParseError("an endpoint must be a number");
      reduced &&= e.reduced;
      return e.value;
    };
    const o = ops.map((m) => opOf(m[0]));
    if (ops.length === 1) {
      if (pieces[0] === variable) return union(ray(o[0]!, read(pieces[1]!)));
      if (pieces[1] === variable) return union(ray(reverse[o[0]!], read(pieces[0]!)));
      throw new ParseError("expected an inequality in the variable");
    }
    const [l, mid, r] = pieces;
    if (mid !== variable) throw new ParseError("expected the variable between the bounds");
    const lowerFirst = o[0]!.startsWith("<");
    if (lowerFirst !== o[1]!.startsWith("<")) throw new ParseError("the inequality signs point different ways");
    return intersect(union(ray(reverse[o[0]!], read(l!))), union(ray(o[1]!, read(r!))));
  };
  const alternatives = s.split(/\s*(?:\\lor|\\vee|or|或)\s*/);
  const sets = alternatives.map((alt) =>
    alt
      .split(/\s*(?:\\land|\\wedge|and|并且|且|,)\s*/)
      .map(atom)
      .reduce((acc, x) => intersect(acc, x), realLine),
  );
  return { set: union(...sets.flat()), reduced };
}

const fmt = (v: Q) => v.toLatex();

/** intervalLatex writes a set in interval notation: "(-\infty, 3) \cup [5, \infty)", "\varnothing". */
export function intervalLatex(set: RealSet): string {
  if (set.length === 0) return "\\varnothing";
  return set
    .map((i) => `${i.loClosed ? "[" : "("}${i.lo ? fmt(i.lo) : "-\\infty"}, ${i.hi ? fmt(i.hi) : "\\infty"}${i.hiClosed ? "]" : ")"}`)
    .join(" \\cup ");
}

/** inequalityLatexOf writes a set as inequalities in a variable: "-2 < x \le 5", "x < -1 \text{ or } x \ge 3". */
export function inequalityLatexOf(set: RealSet, variable = "x"): string {
  if (set.length === 0) return "\\varnothing";
  return set
    .map((i) => {
      const lo = i.lo && `${fmt(i.lo)} ${i.loClosed ? "\\le" : "<"} `;
      const hi = i.hi && ` ${i.hiClosed ? "\\le" : "<"} ${fmt(i.hi)}`;
      if (!lo && !hi) throw new RangeError("the real line is not an inequality");
      if (lo && hi && i.lo!.eq(i.hi!)) throw new RangeError("a single point is not an inequality");
      if (!hi) return `${variable} ${i.loClosed ? "\\ge" : ">"} ${fmt(i.lo!)}`;
      return `${lo ?? ""}${variable}${hi}`;
    })
    .join(" \\text{ or } ");
}
