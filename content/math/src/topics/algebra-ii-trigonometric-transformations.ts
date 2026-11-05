import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Interval, type PlaneMark, plane, Q, q, type RealSet, union } from "@ga/subject-math";
import { waveDrawings } from "../explanation-drawings-waves.ts";
import { choiceProblem, expressionProblem, intervalProblem, numberProblem, steps } from "../problems.ts";

// Algebra II, modules 9.28 and 9.29: the graphs of the six trigonometric
// functions under vertical and horizontal translations, stretches and
// reflections, written y = a·f(b(x − c)) + d; then the properties of the
// transformed functions (range, period, phase shift, asymptotes, zeros and
// extrema) and trigonometric models of periodic situations.
//
// Graphs are drawn with one grid unit on the x-axis standing for π/4 and the
// x-axis numbered in multiples of π/2 along the bottom edge, so that every key
// point of the waves drawn lies on a grid line.

// ---------------------------------------------------------------------------
// Waves
// ---------------------------------------------------------------------------

/** Fn is one of the six trigonometric functions. */
type Fn = "sin" | "cos" | "tan" | "cot" | "sec" | "csc";

const fnNames: Record<Fn, Text> = {
  sin: t("sine", "正弦"),
  cos: t("cosine", "余弦"),
  tan: t("tangent", "正切"),
  cot: t("cotangent", "余切"),
  sec: t("secant", "正割"),
  csc: t("cosecant", "余割"),
};

/** partner is the function a learner confuses with f. */
const partner: Record<Fn, Fn> = { sin: "cos", cos: "sin", tan: "cot", cot: "tan", sec: "csc", csc: "sec" };

/** even tells whether f(−x) = f(x). */
const even = (f: Fn) => f === "cos" || f === "sec";

/** basePeriod is the period of f in multiples of π. */
const basePeriod = (f: Fn) => (f === "tan" || f === "cot" ? Q.one : Q.of(2));

/** Wave is y = a·f(b(x − cπ)) + d with b > 0. */
interface Wave {
  readonly f: Fn;
  readonly a: Q;
  readonly b: Q;
  readonly c: Q;
  readonly d: number;
}

type Num = number | Q;
const toQ = (v: Num): Q => (v instanceof Q ? v : Q.of(v));

/** wave builds a wave from its parameters; c is in multiples of π. */
const wave = (f: Fn, a: Num = 1, b: Num = 1, c: Num = 0, d = 0): Wave => ({ f, a: toQ(a), b: toQ(b), c: toQ(c), d });

/** piTex writes c·π in LaTeX: "\pi", "2\pi", "\frac{5\pi}{6}", "-\frac{\pi}{3}". */
function piTex(c: Num): string {
  const v = toQ(c);
  if (v.isZero()) return "0";
  const n = v.n < 0n ? -v.n : v.n;
  const top = n === 1n ? "\\pi" : `${n}\\pi`;
  const body = v.d === 1n ? top : `\\frac{${top}}{${v.d}}`;
  return v.sign() < 0 ? `-${body}` : body;
}

/** piText writes c·π as plain text for a figure: "π/4", "−3π/2", "2π". */
function piText(c: Q): string {
  if (c.isZero()) return "0";
  const n = c.n < 0n ? -c.n : c.n;
  const top = n === 1n ? "π" : `${n}π`;
  return `${c.sign() < 0 ? "−" : ""}${c.d === 1n ? top : `${top}/${c.d}`}`;
}

/** numText writes a number as plain text for a figure. */
const numText = (v: Q) => v.toString().replace("-", "−");

/** signed writes "+ d" or "- d" after a term, or nothing for 0. */
const signed = (d: number) => (d > 0 ? ` + ${d}` : d < 0 ? ` - ${-d}` : "");

/** coefTex writes a leading coefficient: "", "-", "3", "\frac{1}{2}". */
function coefTex(a: Q): string {
  if (a.eq(Q.one)) return "";
  if (a.eq(Q.one.neg())) return "-";
  return a.toLatex();
}

/** bxTex writes bx: "x", "2x", "\frac{1}{2}x". */
const bxTex = (b: Q) => (b.eq(Q.one) ? "x" : `${b.toLatex()}x`);

/** argTex writes the argument b(x − c) in factored form, or bx − bc expanded. */
function argTex(w: Wave, expanded = false): string {
  if (w.c.isZero()) return bxTex(w.b);
  const op = w.c.sign() > 0 ? "-" : "+";
  if (expanded) return `${bxTex(w.b)} ${op} ${piTex(w.b.mul(w.c).abs())}`;
  const inner = `x ${op} ${piTex(w.c.abs())}`;
  return w.b.eq(Q.one) ? inner : `${w.b.toLatex()}\\left(${inner}\\right)`;
}

/** callTex writes f of the argument of a wave, without parentheses for x and nx. */
function callTex(w: Wave, expanded = false): string {
  const plain = w.c.isZero() && w.b.isInteger();
  const arg = argTex(w, expanded);
  return plain ? `\\${w.f} ${arg}` : `\\${w.f}\\left(${arg}\\right)`;
}

/** waveTex writes the right side of y = a·f(b(x − c)) + d. */
const waveTex = (w: Wave, expanded = false) => `${coefTex(w.a)}${callTex(w, expanded)}${signed(w.d)}`;

/** eqOption is the choice option "y = …" for a wave. */
const eqOption = (w: Wave, expanded = false) => same(`$y = ${waveTex(w, expanded)}$`);

/** fnValue evaluates a trigonometric function of x in radians. */
function fnValue(f: Fn, x: number): number {
  const [s, c] = [Math.sin(x), Math.cos(x)];
  return { sin: s, cos: c, tan: s / c, cot: c / s, sec: 1 / c, csc: 1 / s }[f];
}

/** yAt evaluates a wave at x = xPi·π. */
const yAt = (w: Wave, xPi: number) => w.a.toNumber() * fnValue(w.f, w.b.toNumber() * (xPi - w.c.toNumber()) * Math.PI) + w.d;

const probes = [0.0731, 0.2113, 0.3771, 0.5413, 0.7019, 0.9131, 1.1377, 1.4119, -0.2617, -0.8333, 1.7071, -1.3229];

/** sameGraph tells whether two waves have the same graph, comparing them at points off their asymptotes. */
function sameGraph(u: Wave, v: Wave): boolean {
  let compared = 0;
  for (const x of probes) {
    const [p, r] = [yAt(u, x), yAt(v, x)];
    if (!Number.isFinite(p) || !Number.isFinite(r) || Math.abs(p) > 1e6 || Math.abs(r) > 1e6) continue;
    if (Math.abs(p - r) > 1e-7 * (1 + Math.abs(p))) return false;
    compared++;
  }
  return compared >= 6;
}

/** amplitude is |a|. */
const amp = (w: Wave) => w.a.abs();

/** periodOf is the period of a wave in multiples of π. */
const periodOf = (w: Wave) => basePeriod(w.f).div(w.b);

// --- Families of key points -------------------------------------------------

/** Family is the set of angles θ = (off + kP)π for integers k. */
interface Family {
  readonly off: Q;
  readonly P: Q;
}

const fam = (n: number, d: number, P: number): Family => ({ off: q(n, d), P: Q.of(P) });

/**
 * levelFamilies are the angles θ where f(θ) = s/2, for s in −2 … 2 (sine and
 * cosine), −2, 0, 2 (tangent and cotangent) or ±2 (secant and cosecant).
 */
function levelFamilies(f: Fn, s: number): readonly Family[] {
  const table: Record<Fn, Record<number, readonly Family[]>> = {
    sin: {
      [-2]: [fam(3, 2, 2)],
      [-1]: [fam(7, 6, 2), fam(11, 6, 2)],
      0: [fam(0, 1, 1)],
      1: [fam(1, 6, 2), fam(5, 6, 2)],
      2: [fam(1, 2, 2)],
    },
    cos: {
      [-2]: [fam(1, 1, 2)],
      [-1]: [fam(2, 3, 2), fam(4, 3, 2)],
      0: [fam(1, 2, 1)],
      1: [fam(1, 3, 2), fam(5, 3, 2)],
      2: [fam(0, 1, 2)],
    },
    tan: { [-2]: [fam(3, 4, 1)], 0: [fam(0, 1, 1)], 2: [fam(1, 4, 1)] },
    cot: { [-2]: [fam(3, 4, 1)], 0: [fam(1, 2, 1)], 2: [fam(1, 4, 1)] },
    sec: { [-2]: [fam(1, 1, 2)], 2: [fam(0, 1, 2)] },
    csc: { [-2]: [fam(3, 2, 2)], 2: [fam(1, 2, 2)] },
  };
  const found = table[f][s];
  if (!found) throw new RangeError(`no level ${s}/2 for ${f}`);
  return found;
}

/** asymptoteFamily is where f is undefined. */
const asymptoteFamily = (f: Fn): Family => (f === "tan" || f === "sec" ? fam(1, 2, 1) : fam(0, 1, 1));

const hasAsymptotes = (f: Fn) => f !== "sin" && f !== "cos";

/** floorQ is the greatest integer at most v. */
function floorQ(v: Q): bigint {
  return v.n >= 0n ? v.n / v.d : -((-v.n + v.d - 1n) / v.d);
}

/** modQ is v modulo m, in [0, m). */
const modQ = (v: Q, m: Q) => v.sub(Q.of(floorQ(v.div(m))).mul(m));

/** xOf is the x where the argument of a wave equals θ. */
const xOf = (w: Wave, theta: Q) => w.c.add(theta.div(w.b));

/** firstAfter is the least x above lo (at or above it unless strict) where the argument of a wave is in one of the families. */
function firstAfter(w: Wave, fams: readonly Family[], lo: Q, strict = true): Q {
  let best: Q | undefined;
  for (const fm of fams) {
    const r = w.b.mul(lo.sub(w.c)).sub(fm.off).div(fm.P);
    const k = strict ? floorQ(r) + 1n : -floorQ(r.neg());
    const x = xOf(w, fm.off.add(Q.of(k).mul(fm.P)));
    if (!best || x.cmp(best) < 0) best = x;
  }
  if (!best) throw new RangeError("no family");
  return best;
}

/** membersIn lists the x in [lo, hi] where the argument of a wave is in a family. */
function membersIn(w: Wave, fm: Family, lo: Q, hi: Q): Q[] {
  const out: Q[] = [];
  const step = fm.P.div(w.b);
  for (let x = firstAfter(w, [fm], lo, false); x.cmp(hi) <= 0; x = x.add(step)) out.push(x);
  return out;
}

/** kTex writes k times a step of s·π: "k\pi", "2k\pi", "\frac{k\pi}{2}", "\frac{3k\pi}{2}". */
function kTex(s: Q): string {
  const top = s.n === 1n ? "k\\pi" : `${s.n}k\\pi`;
  return s.d === 1n ? top : `\\frac{${top}}{${s.d}}`;
}

/** familyTex writes base + k·step with the base reduced to [0, step). */
function familyTex(base: Q, step: Q): string {
  const r = modQ(base, step);
  return r.isZero() ? kTex(step) : `${piTex(r)} + ${kTex(step)}`;
}

/** levelTex writes s/2: "1", "-\frac{1}{2}", "0". */
const levelTex = (s: number) => q(s, 2).toLatex();

/** highLevel is the level 2·f(θ) where a sine or cosine wave is highest: 2 when a > 0, else −2. */
const highLevel = (w: Wave) => 2 * w.a.sign();

// --- Shared text helpers ------------------------------------------------------

/** both builds a text from one English and one Chinese sentence around the same LaTeX steps. */
const both = (en: string, zh: string, ...lines: string[]) => t(`${en}${steps(...lines)}`, `${zh}${steps(...lines)}`);

/** join concatenates texts locale by locale. */
const join = (...parts: readonly Text[]): Text => t(parts.map((p) => p.en).join(""), parts.map((p) => p["zh-CN"]).join(""));

/** oneOf builds a choice problem from the right option and up to three distinct wrong ones, shuffled. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text): Problem {
  const seen = new Set([right.en]);
  const rest = wrong.filter((w) => !seen.has(w.en) && seen.add(w.en)).slice(0, 3);
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  return choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
}

/** piProblem builds a problem whose answer is a simplified multiple of π. */
const piProblem = (prompt: Text, answer: Q, solution: Text, wrong: readonly Q[], prefix?: string): Problem =>
  expressionProblem({
    prompt,
    answer: piTex(answer),
    solution,
    simplified: true,
    wrong: wrong.filter((w) => !w.eq(answer)).map(piTex),
    ...(prefix && { prefix }),
  });

/** iv is the interval between lo and hi (infinite when undefined), closed at the finite ends. */
function iv(lo: Num | undefined, hi: Num | undefined): Interval {
  return {
    ...(lo !== undefined && { lo: toQ(lo) }),
    ...(hi !== undefined && { hi: toQ(hi) }),
    loClosed: lo !== undefined,
    hiClosed: hi !== undefined,
  };
}

/** box is the range [d − A, d + A] of a sine or cosine wave. */
const box = (d: Num, A: Q): RealSet => union(iv(toQ(d).sub(A), toQ(d).add(A)));

/** outside is the range of a secant or cosecant wave, (−∞, d − A] ∪ [d + A, ∞). */
const outside = (d: Num, A: Q): RealSet => union(iv(undefined, toQ(d).sub(A)), iv(toQ(d).add(A), undefined));

/** shiftTexts name the four translations by an amount. */
const moves = {
  up: (k: string) => t(`Shifted up $${k}$ units`, `向上平移 $${k}$ 个单位`),
  down: (k: string) => t(`Shifted down $${k}$ units`, `向下平移 $${k}$ 个单位`),
  left: (k: string) => t(`Shifted left $${k}$ units`, `向左平移 $${k}$ 个单位`),
  right: (k: string) => t(`Shifted right $${k}$ units`, `向右平移 $${k}$ 个单位`),
};

/** horizontal names a horizontal shift by c·π: right for c > 0. */
const horizontal = (c: Q) => (c.sign() > 0 ? moves.right : moves.left)(piTex(c.abs()));
const horizontalOpposite = (c: Q) => (c.sign() > 0 ? moves.left : moves.right)(piTex(c.abs()));

// ---------------------------------------------------------------------------
// Figures
// ---------------------------------------------------------------------------

const round = (x: number) => Math.round(x * 100) / 100;

/** listEn joins labels: "a, b and c". */
function listEn(items: readonly string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** waveSvg draws a wave for x from u0·π/4 to (u0 + 16)·π/4, with dashed asymptotes and the axes numbered along the edges. */
function waveSvg(w: Wave, u0: number, asym: readonly Q[]): string {
  const W = 16;
  const A = amp(w).toNumber();
  const extra = hasAsymptotes(w.f) ? 2 : 1;
  const yMax = Math.max(1, Math.ceil(w.d + A) + extra);
  const yMin = Math.min(-1, Math.floor(w.d - A) - extra);
  const view = { xMin: u0, xMax: u0 + W, yMin, yMax, labelEvery: 1000 };
  const g = (u: number) => yAt(w, u / 4);
  const asymU = asym.map((x) => x.toNumber() * 4);
  const marks: PlaneMark[] = asymU.map((u) => ({ kind: "line", a: [u, 0], b: [u, 1], dashed: true }));
  const cuts = [u0, ...asymU.filter((u) => u > u0 && u < u0 + W), u0 + W];
  const near = (u: number) => asymU.some((v) => Math.abs(v - u) < 1e-9);
  for (let i = 0; i + 1 < cuts.length; i++) {
    const [lo, hi] = [cuts[i]!, cuts[i + 1]!];
    marks.push({ kind: "curve", f: g, from: near(lo) ? lo + 1e-4 : lo, to: near(hi) ? hi - 1e-4 : hi, accent: true });
  }
  const svg = plane(view, marks);
  const s = Math.min(260 / W, 260 / (yMax - yMin));
  const sx = (u: number) => round(22 + (u - u0) * s);
  const sy = (y: number) => round(22 + (yMax - y) * s);
  let labels = `<g stroke="none" fill="currentColor" font-size="10">`;
  for (let u = Math.ceil(u0 / 2) * 2; u <= u0 + W; u += 2) {
    if (u !== 0) labels += `<text x="${sx(u)}" y="${round(sy(yMin) + 13)}">${piText(q(u, 4))}</text>`;
  }
  const every = yMax - yMin > 12 ? 2 : 1;
  for (let y = yMin; y <= yMax; y++) {
    if (y !== 0 && y % every === 0)
      labels += `<text x="${round(sx(u0) - 6)}" y="${round(sy(y) + 3.5)}" text-anchor="end">${String(y).replace("-", "−")}</text>`;
  }
  labels += "</g>";
  return svg.replace(/<\/svg>$/, `${labels}</svg>`);
}

/** waveFigure draws a wave over a window of 4π starting at u0·π/4 and describes its key points without naming it. */
function waveFigure(w: Wave, u0 = -8): Figure {
  const [lo, hi] = [q(u0, 4), q(u0 + 16, 4)];
  const at = (fams: readonly Family[]) =>
    fams
      .flatMap((fm) => membersIn(w, fm, lo, hi))
      .sort((x, y) => x.cmp(y))
      .map(piText);
  const asym = hasAsymptotes(w.f) ? membersIn(w, asymptoteFamily(w.f), lo, hi) : [];
  const en: string[] = [`The graph of a function for x from ${piText(lo)} to ${piText(hi)}, with grid lines every π/4 on the x-axis`];
  const zh: string[] = [`一个函数在 x 从 ${piText(lo)} 到 ${piText(hi)} 的图象，x 轴上每隔 π/4 有一条网格线`];
  const pointsWith = (y: Q, xs: readonly string[]) => {
    if (!xs.length) return;
    en.push(`y = ${numText(y)} at x = ${listEn(xs)}`);
    zh.push(`在 x = ${xs.join("、")} 处 y = ${numText(y)}`);
  };
  if (asym.length) {
    const xs = asym.map(piText);
    en.push(`vertical asymptotes at x = ${listEn(xs)}`);
    zh.push(`竖直渐近线为 x = ${xs.join("、")}`);
  }
  const D = Q.of(w.d);
  if (w.f === "sin" || w.f === "cos") {
    const top = highLevel(w);
    en.push(`highest value ${numText(D.add(amp(w)))} and lowest value ${numText(D.sub(amp(w)))}`);
    zh.push(`最大值 ${numText(D.add(amp(w)))}，最小值 ${numText(D.sub(amp(w)))}`);
    pointsWith(D.add(amp(w)), at(levelFamilies(w.f, top)));
    pointsWith(D.sub(amp(w)), at(levelFamilies(w.f, -top)));
  } else if (w.f === "tan" || w.f === "cot") {
    pointsWith(D, at(levelFamilies(w.f, 0)));
    pointsWith(D.add(w.a), at(levelFamilies(w.f, 2)));
  } else {
    pointsWith(D.add(w.a), at(levelFamilies(w.f, 2)));
    pointsWith(D.sub(w.a), at(levelFamilies(w.f, -2)));
  }
  return { svg: waveSvg(w, u0, asym), alt: t(`${en.join("; ")}.`, `${zh.join("；")}。`) };
}

/** featuresText describes the features of a wave that identify its graph. */
function featuresText(w: Wave): Text {
  const W = waveTex(w);
  const D = Q.of(w.d);
  const P = piTex(periodOf(w));
  if (w.f === "sin" || w.f === "cos") {
    const x = firstAfter(w, levelFamilies(w.f, highLevel(w)), Q.zero, false);
    const top = D.add(amp(w)).toLatex();
    return t(
      `The graph of $y = ${W}$ has midline $y = ${w.d}$, amplitude $${amp(w).toLatex()}$ and period $${P}$, so it runs between $y = ${D.sub(amp(w)).toLatex()}$ and $y = ${top}$, and its first highest point with $x \\ge 0$ is $\\left(${piTex(x)}, ${top}\\right)$. These match the figure; each other equation changes at least one of these features.`,
      `$y = ${W}$ 的图象的中线为 $y = ${w.d}$，振幅为 $${amp(w).toLatex()}$，周期为 $${P}$，所以它在 $y = ${D.sub(amp(w)).toLatex()}$ 与 $y = ${top}$ 之间，且 $x \\ge 0$ 时的第一个最高点是 $\\left(${piTex(x)}, ${top}\\right)$。这些都与图相符；其他每个方程都至少改变了其中一个特征。`,
    );
  }
  const asym = firstAfter(w, [asymptoteFamily(w.f)], Q.zero, false);
  if (w.f === "tan" || w.f === "cot") {
    const x0 = firstAfter(w, levelFamilies(w.f, 0), Q.zero, false);
    const x1 = firstAfter(w, levelFamilies(w.f, 2), Q.zero, false);
    return t(
      `The graph of $y = ${W}$ has period $${P}$, with vertical asymptotes $${P}$ apart, one of them at $x = ${piTex(asym)}$; it passes through $\\left(${piTex(x0)}, ${w.d}\\right)$ and $\\left(${piTex(x1)}, ${D.add(w.a).toLatex()}\\right)$. These match the figure; each other equation changes at least one of these features.`,
      `$y = ${W}$ 的图象的周期为 $${P}$，竖直渐近线相距 $${P}$，其中一条是 $x = ${piTex(asym)}$；图象经过 $\\left(${piTex(x0)}, ${w.d}\\right)$ 和 $\\left(${piTex(x1)}, ${D.add(w.a).toLatex()}\\right)$。这些都与图相符；其他每个方程都至少改变了其中一个特征。`,
    );
  }
  const x1 = firstAfter(w, levelFamilies(w.f, 2), Q.zero, false);
  const x2 = firstAfter(w, levelFamilies(w.f, -2), Q.zero, false);
  return t(
    `The graph of $y = ${W}$ has period $${P}$ and a vertical asymptote at $x = ${piTex(asym)}$, and its turning points include $\\left(${piTex(x1)}, ${D.add(w.a).toLatex()}\\right)$ and $\\left(${piTex(x2)}, ${D.sub(w.a).toLatex()}\\right)$. These match the figure; each other equation changes at least one of these features.`,
    `$y = ${W}$ 的图象的周期为 $${P}$，有竖直渐近线 $x = ${piTex(asym)}$，转折点包括 $\\left(${piTex(x1)}, ${D.add(w.a).toLatex()}\\right)$ 和 $\\left(${piTex(x2)}, ${D.sub(w.a).toLatex()}\\right)$。这些都与图相符；其他每个方程都至少改变了其中一个特征。`,
  );
}

/** graphProblem shows the graph of a wave and asks which equation it is, among candidates with different graphs. */
function graphProblem(rng: Rng, w: Wave, candidates: readonly Wave[], u0 = -8): Problem {
  const wrong = candidates.filter((c) => c.b.sign() > 0 && !sameGraph(c, w)).map((c) => eqOption(c));
  return {
    ...oneOf(rng, t("Which equation is graphed?", "图中是哪个方程的图象？"), eqOption(w), wrong, featuresText(w)),
    figure: waveFigure(w, u0),
  };
}

// ---------------------------------------------------------------------------
// Shared generators
// ---------------------------------------------------------------------------

/** periodProblem asks for the period of a wave. */
function periodProblem(w: Wave, expanded = false): Problem {
  const P = periodOf(w);
  const base = basePeriod(w.f);
  const quotient = `\\frac{${piTex(base)}}{${w.b.toLatex()}}`;
  return piProblem(
    t(`What is the period of $y = ${waveTex(w, expanded)}$?`, `$y = ${waveTex(w, expanded)}$ 的周期是多少？`),
    P,
    both(
      `The period of $y = \\${w.f} x$ is $${piTex(base)}$. Multiplying $x$ by $b = ${w.b.toLatex()}$ compresses the graph horizontally by the factor $b$ (stretches it when $b < 1$), so the period is $\\frac{${piTex(base)}}{b}$; the other parameters do not change it:`,
      `$y = \\${w.f} x$ 的周期为 $${piTex(base)}$。把 $x$ 乘以 $b = ${w.b.toLatex()}$ 会把图象沿水平方向压缩为原来的 $\\frac{1}{b}$（$b < 1$ 时为拉伸），所以周期为 $\\frac{${piTex(base)}}{b}$；其他参数不改变周期：`,
      quotient === piTex(P) ? quotient : `${quotient} = ${piTex(P)}`,
    ),
    [base.mul(w.b), Q.one.div(w.b), base, base.div(w.b).mul(Q.of(2)), base.div(w.b).div(Q.of(2))],
  );
}

/** Target names the points a firstXProblem asks for. */
type Target = "max" | "min" | "zero" | "asymptote" | "localMin" | "localMax";

/** targetLevel is the level 2·f(θ) of the target points, or undefined for asymptotes. */
function targetLevel(w: Wave, target: Target): number | undefined {
  switch (target) {
    case "max":
    case "localMin":
      return 2 * w.a.sign();
    case "min":
    case "localMax":
      return -2 * w.a.sign();
    case "zero":
      return q(-2 * w.d, 1)
        .div(w.a)
        .toNumber();
    case "asymptote":
      return undefined;
  }
}

/** targetFamilies are the angles θ of the target points. */
function targetFamilies(w: Wave, target: Target): readonly Family[] {
  const s = targetLevel(w, target);
  return s === undefined ? [asymptoteFamily(w.f)] : levelFamilies(w.f, s);
}

const targetPrompts: Record<Target, (W: string) => Text> = {
  max: (W) =>
    t(`Find the smallest positive $x$ at which $y = ${W}$ reaches its maximum value.`, `求使 $y = ${W}$ 取得最大值的最小正数 $x$。`),
  min: (W) =>
    t(`Find the smallest positive $x$ at which $y = ${W}$ reaches its minimum value.`, `求使 $y = ${W}$ 取得最小值的最小正数 $x$。`),
  zero: (W) => t(`Find the smallest positive zero of $y = ${W}$.`, `求 $y = ${W}$ 的最小正零点。`),
  asymptote: (W) =>
    t(
      `The graph of $y = ${W}$ has vertical asymptotes $x = p$. Find the smallest positive $p$.`,
      `$y = ${W}$ 的图象有竖直渐近线 $x = p$。求最小的正数 $p$。`,
    ),
  localMin: (W) =>
    t(`Find the smallest positive $x$ at which $y = ${W}$ has a local minimum.`, `求使 $y = ${W}$ 取得局部极小值的最小正数 $x$。`),
  localMax: (W) =>
    t(`Find the smallest positive $x$ at which $y = ${W}$ has a local maximum.`, `求使 $y = ${W}$ 取得局部极大值的最小正数 $x$。`),
};

/** conditionText says what holds at the target points, in terms of θ. */
function conditionText(w: Wave, target: Target): Text {
  const s = targetLevel(w, target);
  const f = `\\${w.f} \\theta`;
  const D = Q.of(w.d);
  const aTex = w.a.eq(Q.one) ? "" : w.a.eq(Q.one.neg()) ? "-" : w.a.toLatex();
  const noteEn = w.a.eq(Q.one) ? "" : ` (the coefficient $${w.a.toLatex()}$ is ${w.a.sign() > 0 ? "positive" : "negative"})`;
  const noteZh = w.a.eq(Q.one) ? "" : `（系数 $${w.a.toLatex()}$ 为${w.a.sign() > 0 ? "正" : "负"}）`;
  switch (target) {
    case "asymptote":
      return t(`The graph has a vertical asymptote where $${f}$ is not defined`, `图象在 $${f}$ 无定义处有竖直渐近线`);
    case "max":
      return t(
        `The maximum $${D.add(amp(w)).toLatex()}$ occurs where $${f} = ${levelTex(s ?? 0)}$${noteEn}`,
        `最大值 $${D.add(amp(w)).toLatex()}$ 在 $${f} = ${levelTex(s ?? 0)}$ 处取得${noteZh}`,
      );
    case "min":
      return t(
        `The minimum $${D.sub(amp(w)).toLatex()}$ occurs where $${f} = ${levelTex(s ?? 0)}$${noteEn}`,
        `最小值 $${D.sub(amp(w)).toLatex()}$ 在 $${f} = ${levelTex(s ?? 0)}$ 处取得${noteZh}`,
      );
    case "zero":
      return t(
        `Setting $y = 0$ gives $${aTex}${f}${signed(w.d)} = 0$${aTex === "" && signed(w.d) === "" ? "" : `, so $${f} = ${levelTex(s ?? 0)}$`}`,
        `令 $y = 0$ 得 $${aTex}${f}${signed(w.d)} = 0$${aTex === "" && signed(w.d) === "" ? "" : `，所以 $${f} = ${levelTex(s ?? 0)}$`}`,
      );
    case "localMin":
      return t(
        `The branches opening upward have their lowest points, the local minima $y = ${D.add(amp(w)).toLatex()}$, where $${f} = ${levelTex(s ?? 0)}$`,
        `开口向上的分支的最低点，即局部极小值 $y = ${D.add(amp(w)).toLatex()}$，在 $${f} = ${levelTex(s ?? 0)}$ 处`,
      );
    case "localMax":
      return t(
        `The branches opening downward have their highest points, the local maxima $y = ${D.sub(amp(w)).toLatex()}$, where $${f} = ${levelTex(s ?? 0)}$`,
        `开口向下的分支的最高点，即局部极大值 $y = ${D.sub(amp(w)).toLatex()}$，在 $${f} = ${levelTex(s ?? 0)}$ 处`,
      );
  }
}

/** firstXProblem asks for the smallest positive x of a family of key points of a wave. */
function firstXProblem(w: Wave, target: Target, expanded = false, extraWrong: readonly Q[] = []): Problem {
  const fams = targetFamilies(w, target);
  const ans = firstAfter(w, fams, Q.zero);
  const arg = argTex(w, expanded);
  const thetas = fams.map((fm) => `\\theta = ${familyTex(fm.off, fm.P)}`).join(", \\quad ");
  const xs = fams.map((fm) => `x = ${familyTex(xOf(w, fm.off), fm.P.div(w.b))}`).join(", \\quad ");
  const cond = conditionText(w, target);
  const flipped = wave(w.f, w.a, w.b, w.c.neg(), w.d);
  const unshifted = wave(w.f, w.a, w.b, 0, w.d);
  const wrong = [
    firstAfter(flipped, targetFamilies(flipped, target), Q.zero),
    firstAfter(unshifted, targetFamilies(unshifted, target), Q.zero),
    ...fams.map((fm) => modQ(fm.off.add(w.c), fm.P)).filter((x) => !x.isZero()),
    ...extraWrong,
  ];
  return piProblem(
    targetPrompts[target](waveTex(w, expanded)),
    ans,
    join(
      // With the plain input x there is nothing to substitute or solve.
      arg === "x"
        ? both(
            `${cond.en.replaceAll("\\theta", "x")}, that is, for integers $k$,`,
            `${cond["zh-CN"].replaceAll("\\theta", "x")}，即对整数 $k$，`,
            xs,
          )
        : join(
            both(
              `Let $\\theta = ${arg}$. ${cond.en}, that is, for integers $k$,`,
              `令 $\\theta = ${arg}$。${cond["zh-CN"]}，即对整数 $k$，`,
              thetas,
            ),
            both(`Solving $${arg} = \\theta$ for $x$ gives`, `由 $${arg} = \\theta$ 解出 $x$ 得`, xs),
          ),
      t(`The smallest positive of these is $x = ${piTex(ans)}$.`, `其中最小的正数是 $x = ${piTex(ans)}$。`),
    ),
    wrong,
    "x =",
  );
}

/** pickQ picks one of a list of rationals given as [n, d] pairs or integers. */
const pickQ = (rng: Rng, items: readonly (number | readonly [number, number])[]): Q => {
  const v = rng.pick(items);
  return typeof v === "number" ? Q.of(v) : q(v[0], v[1]);
};

/** signedPick picks a value and gives it a random sign. */
const signedPick = (rng: Rng, items: readonly (number | readonly [number, number])[]): Q => {
  const v = pickQ(rng, items);
  return rng.bool() ? v : v.neg();
};

const sinCos: readonly Fn[] = ["sin", "cos"];
const tanCot: readonly Fn[] = ["tan", "cot"];
const secCsc: readonly Fn[] = ["sec", "csc"];

/** u0s are the windows of the graphs: from −2π, −3π/2 or −π. */
const u0s = [-8, -6, -4];

// ---------------------------------------------------------------------------
// 9.28 Graph transformations of trigonometric functions
// ---------------------------------------------------------------------------

/** verticalTranslationsOfTrigonometricFunctions shifts the sine and cosine waves up and down. */
const verticalTranslationsOfTrigonometricFunctions: TopicDef = {
  id: "vertical-translations-of-trigonometric-functions",
  title: t("Vertical Translations of Trigonometric Functions", "三角函数图象的竖直平移"),
  summary: t(
    "Shift the graphs of y = sin x and y = cos x up or down with y = sin x + d, and find the midline, maximum and minimum of the shifted waves.",
    "用 y = sin x + d 把 y = sin x 和 y = cos x 的图象向上或向下平移，并求平移后波形的中线、最大值和最小值。",
  ),
  prerequisites: ["describing-properties-of-the-cosine-function", "vertical-translations-of-functions"],
  encompasses: [
    { topic: "graphing-sine-and-cosine", weight: 0.3 },
    { topic: "vertical-translations-of-functions", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7e"],
  knowledgePoints: [
    {
      id: "describing-vertical-translations",
      figure: waveDrawings["vertical-translations-of-trigonometric-functions#describing-vertical-translations"],
      title: t("Describing the shift", "描述平移"),
      explanation: t(
        "Adding a constant $d$ to a function, $y = \\sin x + d$, adds $d$ to every $y$-value, so the whole graph moves **up** $d$ units when $d > 0$ and **down** $|d|$ units when $d < 0$. The $x$-values of the key points do not change.\n\nFor example, $y = \\cos x - 3$ is the graph of $y = \\cos x$ shifted down $3$ units. A constant added *inside*, as in $y = \\cos(x - 3)$, moves the graph sideways instead.",
        "给函数加上常数 $d$，即 $y = \\sin x + d$，会给每个 $y$ 值加上 $d$，所以 $d > 0$ 时整个图象**向上**平移 $d$ 个单位，$d < 0$ 时**向下**平移 $|d|$ 个单位。关键点的 $x$ 值不变。\n\n例如，$y = \\cos x - 3$ 的图象是把 $y = \\cos x$ 的图象向下平移 $3$ 个单位。而加在函数*里面*的常数，如 $y = \\cos(x - 3)$，则使图象左右移动。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const d = rng.nonZero(-9, 9);
        const k = String(Math.abs(d));
        const solution = t(
          `Adding $${d}$ outside the function adds $${d}$ to every $y$-value, so $y = \\${f} x${signed(d)}$ is the graph of $y = \\${f} x$ shifted ${d > 0 ? "up" : "down"} $${k}$ units.`,
          `在函数外面加上 $${d}$ 会给每个 $y$ 值加上 $${d}$，所以 $y = \\${f} x${signed(d)}$ 的图象是把 $y = \\${f} x$ 的图象向${d > 0 ? "上" : "下"}平移 $${k}$ 个单位。`,
        );
        if (rng.bool()) {
          const right = (d > 0 ? moves.up : moves.down)(k);
          return oneOf(
            rng,
            t(
              `How is the graph of $y = \\${f} x${signed(d)}$ obtained from the graph of $y = \\${f} x$?`,
              `$y = \\${f} x${signed(d)}$ 的图象如何由 $y = \\${f} x$ 的图象得到？`,
            ),
            right,
            [(d > 0 ? moves.down : moves.up)(k), moves.left(k), moves.right(k)],
            solution,
          );
        }
        const dir = d > 0 ? t("up", "上") : t("down", "下");
        return oneOf(
          rng,
          t(
            `The graph of $y = \\${f} x$ is shifted ${dir.en} $${k}$ units. Which equation describes the new graph?`,
            `把 $y = \\${f} x$ 的图象向${dir["zh-CN"]}平移 $${k}$ 个单位。新图象的方程是哪一个？`,
          ),
          same(`$y = \\${f} x${signed(d)}$`),
          [same(`$y = \\${f} x${signed(-d)}$`), same(`$y = \\${f}(x${signed(d)})$`), same(`$y = \\${f}(x${signed(-d)})$`)],
          solution,
        );
      },
    },
    {
      id: "midline-maximum-and-minimum",
      title: t("Midline, maximum and minimum", "中线、最大值与最小值"),
      explanation: t(
        "The waves $y = \\sin x$ and $y = \\cos x$ run between $-1$ and $1$ around the **midline** $y = 0$. Shifting by $d$ moves everything by $d$: the graph of $y = \\sin x + d$ has\n\n- midline $y = d$,\n- maximum value $d + 1$,\n- minimum value $d - 1$.\n\nFor $y = \\cos x - 4$: midline $y = -4$, maximum $-3$, minimum $-5$.",
        "波形 $y = \\sin x$ 与 $y = \\cos x$ 围绕**中线** $y = 0$ 在 $-1$ 与 $1$ 之间起伏。平移 $d$ 使一切都移动 $d$：$y = \\sin x + d$ 的图象有\n\n- 中线 $y = d$，\n- 最大值 $d + 1$，\n- 最小值 $d - 1$。\n\n对 $y = \\cos x - 4$：中线 $y = -4$，最大值 $-3$，最小值 $-5$。",
      ),
      figure: waveFigure(wave("sin", 1, 1, 0, 2)),
      generate(rng) {
        const f = rng.pick(sinCos);
        const d = rng.nonZero(-8, 8);
        const W = `\\${f} x${signed(d)}`;
        const kind = rng.pick(["max", "min", "midline"] as const);
        const solution = t(
          `The graph of $y = ${W}$ is the wave $y = \\${f} x$, which runs from $-1$ to $1$ around $y = 0$, shifted by $${d}$. So its midline is $y = ${d}$, its maximum is $${d} + 1 = ${d + 1}$ and its minimum is $${d} - 1 = ${d - 1}$.`,
          `$y = ${W}$ 的图象是把围绕 $y = 0$ 在 $-1$ 到 $1$ 之间起伏的波形 $y = \\${f} x$ 平移 $${d}$。所以中线是 $y = ${d}$，最大值是 $${d} + 1 = ${d + 1}$，最小值是 $${d} - 1 = ${d - 1}$。`,
        );
        if (kind === "midline")
          return numberProblem({
            prompt: t(`Find the midline of the graph of $y = ${W}$.`, `求 $y = ${W}$ 的图象的中线。`),
            answer: d,
            solveFor: "y",
            solution,
            wrong: [0, d + 1, -d, d - 1],
          });
        const max = kind === "max";
        return numberProblem({
          prompt: max
            ? t(`What is the maximum value of $y = ${W}$?`, `$y = ${W}$ 的最大值是多少？`)
            : t(`What is the minimum value of $y = ${W}$?`, `$y = ${W}$ 的最小值是多少？`),
          answer: max ? d + 1 : d - 1,
          solution,
          wrong: max ? [d, d - 1, 1, -d + 1] : [d, d + 1, -1, -d - 1],
        });
      },
    },
    {
      id: "matching-graphs-of-vertical-translations",
      title: t("Matching graphs", "匹配图象"),
      explanation: t(
        "To match a shifted wave to its equation, find its midline halfway between its highest and lowest values, then check its value at $x = 0$: a sine wave starts on its midline there, and a cosine wave at its highest point. The figure shows $y = \\sin x + 2$: it runs between $1$ and $3$ around $y = 2$ and passes through $(0, 2)$.",
        "要把平移后的波形与方程对应，先找出位于最大值与最小值正中间的中线，再看 $x = 0$ 处的值：正弦波在那里位于中线上，余弦波则在最高点。图中是 $y = \\sin x + 2$：它围绕 $y = 2$ 在 $1$ 与 $3$ 之间起伏，并经过 $(0, 2)$。",
      ),
      figure: waveFigure(wave("sin", 1, 1, 0, 2)),
      generate(rng) {
        const f = rng.pick(sinCos);
        const g = partner[f];
        const d = rng.nonZero(-3, 3);
        const w = wave(f, 1, 1, 0, d);
        return graphProblem(
          rng,
          w,
          [wave(f, 1, 1, 0, -d), wave(g, 1, 1, 0, d), wave(g, 1, 1, 0, -d), wave(f, 2, 1, 0, d)],
          rng.pick([-8, -7, -6, -5, -4]),
        );
      },
    },
  ],
};

const amps = [2, 3, 4, 5, 6, [1, 2], [1, 3], [2, 3], [3, 2], [5, 2]] as const;

/** verticalStretchesOfTrigonometricFunctions changes the amplitude of the sine and cosine waves. */
const verticalStretchesOfTrigonometricFunctions: TopicDef = {
  id: "vertical-stretches-of-trigonometric-functions",
  title: t("Vertical Stretches of Trigonometric Functions", "三角函数图象的竖直伸缩"),
  summary: t(
    "Stretch the sine and cosine waves vertically with y = a sin x, read the amplitude, and find the range of y = a sin x + d.",
    "用 y = a sin x 把正弦和余弦波形沿竖直方向伸缩，读出振幅，并求 y = a sin x + d 的值域。",
  ),
  prerequisites: ["vertical-translations-of-trigonometric-functions", "vertical-stretches-of-functions"],
  encompasses: [{ topic: "vertical-stretches-of-functions", weight: 0.3 }],
  xp: 13,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7e"],
  knowledgePoints: [
    {
      id: "amplitude",
      title: t("Amplitude", "振幅"),
      explanation: t(
        "Multiplying by $a > 0$, $y = a \\sin x$, multiplies every $y$-value by $a$: the graph is stretched vertically by the factor $a$ (compressed when $a < 1$). The zeros stay where they are, and the wave now runs from $-a$ to $a$.\n\nThe **amplitude** of a wave is the distance from its midline to its highest point, half the distance from its lowest to its highest point. The amplitude of $y = a \\sin x$ and of $y = a \\cos x$ is $a$. For $y = \\frac{1}{2}\\cos x$: amplitude $\\frac{1}{2}$, maximum $\\frac{1}{2}$, minimum $-\\frac{1}{2}$.",
        "乘以 $a > 0$，即 $y = a \\sin x$，会把每个 $y$ 值乘以 $a$：图象沿竖直方向伸长为原来的 $a$ 倍（$a < 1$ 时为压缩）。零点位置不变，波形现在从 $-a$ 起伏到 $a$。\n\n波形的**振幅**是中线到最高点的距离，即最低点到最高点距离的一半。$y = a \\sin x$ 和 $y = a \\cos x$ 的振幅都是 $a$。对 $y = \\frac{1}{2}\\cos x$：振幅 $\\frac{1}{2}$，最大值 $\\frac{1}{2}$，最小值 $-\\frac{1}{2}$。",
      ),
      figure: waveFigure(wave("cos", 3)),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = pickQ(rng, amps);
        const w = wave(f, a);
        const W = waveTex(w);
        const kind = rng.pick(["amplitude", "max", "min"] as const);
        const A = a.toLatex();
        const solution = t(
          `Multiplying $\\${f} x$ by $${A}$ stretches the wave vertically by the factor $${A}$: it now runs from $-${A}$ to $${A}$. So the amplitude is $${A}$, the maximum $${A}$ and the minimum $-${A}$.`,
          `把 $\\${f} x$ 乘以 $${A}$ 使波形沿竖直方向伸缩为原来的 $${A}$ 倍：它现在从 $-${A}$ 起伏到 $${A}$。所以振幅是 $${A}$，最大值是 $${A}$，最小值是 $-${A}$。`,
        );
        if (kind === "amplitude")
          return numberProblem({
            prompt: t(`What is the amplitude of $y = ${W}$?`, `$y = ${W}$ 的振幅是多少？`),
            answer: a,
            solution,
            wrong: [a.mul(Q.of(2)), Q.one, a.neg(), Q.one.div(a)],
          });
        const max = kind === "max";
        return numberProblem({
          prompt: max
            ? t(`What is the maximum value of $y = ${W}$?`, `$y = ${W}$ 的最大值是多少？`)
            : t(`What is the minimum value of $y = ${W}$?`, `$y = ${W}$ 的最小值是多少？`),
          answer: max ? a : a.neg(),
          solution,
          wrong: max ? [Q.one, a.mul(Q.of(2)), a.neg()] : [Q.one.neg(), a, Q.zero, a.mul(Q.of(-2))],
        });
      },
    },
    {
      id: "range-of-a-stretched-and-shifted-wave",
      title: t("Range of a stretched and shifted wave", "伸缩并平移后波形的值域"),
      explanation: t(
        "For $y = a \\sin x + d$ with $a > 0$, first stretch, then shift: the stretched wave runs from $-a$ to $a$, and adding $d$ moves it to run from $d - a$ to $d + a$ around the midline $y = d$. So the range is $[d - a, d + a]$.\n\nFor $y = 3 \\cos x - 1$: the range is $[-1 - 3, -1 + 3] = [-4, 2]$.",
        "对 $a > 0$ 的 $y = a \\sin x + d$，先伸缩再平移：伸缩后的波形从 $-a$ 起伏到 $a$，加上 $d$ 后围绕中线 $y = d$ 从 $d - a$ 起伏到 $d + a$。所以值域是 $[d - a, d + a]$。\n\n对 $y = 3 \\cos x - 1$：值域是 $[-1 - 3, -1 + 3] = [-4, 2]$。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = pickQ(rng, amps);
        const d = rng.nonZero(-5, 5);
        const w = wave(f, a, 1, 0, d);
        const D = Q.of(d);
        return intervalProblem({
          prompt: t(
            `What is the range of $y = ${waveTex(w)}$? Write it in interval notation.`,
            `$y = ${waveTex(w)}$ 的值域是什么？用区间表示。`,
          ),
          set: box(d, a),
          solution: t(
            `The wave $y = ${waveTex(wave(f, a))}$ runs from $${a.neg().toLatex()}$ to $${a.toLatex()}$; adding $${d}$ moves it to run from $${D.sub(a).toLatex()}$ to $${D.add(a).toLatex()}$. The range is $[${D.sub(a).toLatex()}, ${D.add(a).toLatex()}]$.`,
            `波形 $y = ${waveTex(wave(f, a))}$ 从 $${a.neg().toLatex()}$ 起伏到 $${a.toLatex()}$；加上 $${d}$ 后从 $${D.sub(a).toLatex()}$ 起伏到 $${D.add(a).toLatex()}$。值域是 $[${D.sub(a).toLatex()}, ${D.add(a).toLatex()}]$。`,
          ),
          wrong: [box(0, a), box(d, Q.one), box(d, a.mul(Q.of(2))), box(d - 1, a)],
        });
      },
    },
    {
      id: "matching-graphs-of-vertical-stretches",
      title: t("Matching graphs", "匹配图象"),
      explanation: t(
        "Read the amplitude from a graph as half the distance between its highest and lowest values, and the midline halfway between them. The figure shows $y = 3 \\cos x$: it runs between $-3$ and $3$, so its amplitude is $3$, and it has its highest point $(0, 3)$ on the $y$-axis, like a cosine wave.",
        "从图象读振幅：最高值与最低值之差的一半；中线位于两者正中间。图中是 $y = 3 \\cos x$：它在 $-3$ 与 $3$ 之间起伏，所以振幅为 $3$，并且像余弦波一样在 $y$ 轴上有最高点 $(0, 3)$。",
      ),
      figure: waveFigure(wave("cos", 3)),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = pickQ(rng, [2, 3, 4, [1, 2], [3, 2]]);
        const d = rng.int(-1, 1);
        const w = wave(f, a, 1, 0, d);
        return graphProblem(
          rng,
          w,
          [
            wave(f, Q.one.div(a), 1, 0, d),
            wave(partner[f], a, 1, 0, d),
            wave(f, a.add(Q.one), 1, 0, d),
            wave(f, a, 1, 0, d === 0 ? 1 : -d),
          ],
          rng.pick(u0s),
        );
      },
    },
  ],
};

const shifts = [
  [1, 6],
  [1, 4],
  [1, 3],
  [1, 2],
  [2, 3],
  [3, 4],
  [5, 6],
] as const;

/** horizontalTranslationsOfTrigonometricFunctions shifts the sine and cosine waves left and right. */
const horizontalTranslationsOfTrigonometricFunctions: TopicDef = {
  id: "horizontal-translations-of-trigonometric-functions",
  title: t("Horizontal Translations of Trigonometric Functions", "三角函数图象的水平平移"),
  summary: t(
    "Shift the sine and cosine waves left or right with y = sin(x − c), and find where the shifted waves reach their maximum, minimum and zeros.",
    "用 y = sin(x − c) 把正弦和余弦波形向左或向右平移，并求平移后波形取得最大值、最小值和零点的位置。",
  ),
  prerequisites: ["vertical-translations-of-trigonometric-functions", "horizontal-translations-of-functions"],
  encompasses: [{ topic: "horizontal-translations-of-functions", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7e"],
  knowledgePoints: [
    {
      id: "describing-horizontal-translations",
      figure: waveDrawings["horizontal-translations-of-trigonometric-functions#describing-horizontal-translations"],
      title: t("Describing the shift", "描述平移"),
      explanation: t(
        "Replacing $x$ by $x - c$ shifts a graph **right** $c$ units: the graph of $y = \\sin(x - c)$ takes at $x$ the value $y = \\sin x$ takes at $x - c$, so every point moves $c$ to the right. Replacing $x$ by $x + c$ shifts it **left** $c$ units. For trigonometric functions the shift is usually a multiple of $\\pi$.\n\nFor example, $y = \\cos\\left(x + \\frac{\\pi}{3}\\right)$ is the graph of $y = \\cos x$ shifted left $\\frac{\\pi}{3}$ units: the sign inside is the opposite of the direction.",
        "把 $x$ 换成 $x - c$ 使图象**向右**平移 $c$ 个单位：$y = \\sin(x - c)$ 在 $x$ 处的值等于 $y = \\sin x$ 在 $x - c$ 处的值，所以每个点都向右移动 $c$。把 $x$ 换成 $x + c$ 则使图象**向左**平移 $c$ 个单位。对三角函数，平移量通常是 $\\pi$ 的倍数。\n\n例如，$y = \\cos\\left(x + \\frac{\\pi}{3}\\right)$ 的图象是把 $y = \\cos x$ 的图象向左平移 $\\frac{\\pi}{3}$ 个单位：括号里的符号与平移方向相反。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const c = signedPick(rng, shifts);
        const w = wave(f, 1, 1, c);
        const k = piTex(c.abs());
        const dir = c.sign() > 0 ? t("right", "右") : t("left", "左");
        const solution = t(
          `In $y = ${waveTex(w)}$ the input is $x ${c.sign() > 0 ? "-" : "+"} ${k}$, so the graph of $y = \\${f} x$ is shifted ${dir.en} $${k}$ units.`,
          `$y = ${waveTex(w)}$ 中的输入是 $x ${c.sign() > 0 ? "-" : "+"} ${k}$，所以把 $y = \\${f} x$ 的图象向${dir["zh-CN"]}平移 $${k}$ 个单位。`,
        );
        if (rng.bool())
          return oneOf(
            rng,
            t(
              `How is the graph of $y = ${waveTex(w)}$ obtained from the graph of $y = \\${f} x$?`,
              `$y = ${waveTex(w)}$ 的图象如何由 $y = \\${f} x$ 的图象得到？`,
            ),
            horizontal(c),
            [horizontalOpposite(c), moves.up(k), moves.down(k)],
            solution,
          );
        return oneOf(
          rng,
          t(
            `The graph of $y = \\${f} x$ is shifted ${dir.en} $${k}$ units. Which equation describes the new graph?`,
            `把 $y = \\${f} x$ 的图象向${dir["zh-CN"]}平移 $${k}$ 个单位。新图象的方程是哪一个？`,
          ),
          eqOption(w),
          [eqOption(wave(f, 1, 1, c.neg())), same(`$y = \\${f} x + ${k}$`), same(`$y = \\${f} x - ${k}$`)],
          solution,
        );
      },
    },
    {
      id: "key-points-after-a-horizontal-translation",
      figure: waveDrawings["horizontal-translations-of-trigonometric-functions#key-points-after-a-horizontal-translation"],
      title: t("Key points after the shift", "平移后的关键点"),
      explanation: t(
        "A horizontal shift moves every key point by the same amount. The maximum points of $y = \\sin x$ are at $x = \\frac{\\pi}{2} + 2k\\pi$, so those of $y = \\sin\\left(x - \\frac{\\pi}{3}\\right)$, shifted right $\\frac{\\pi}{3}$, are at\n\n$$x = \\frac{\\pi}{2} + \\frac{\\pi}{3} + 2k\\pi = \\frac{5\\pi}{6} + 2k\\pi.$$\n\nThe smallest positive one is $\\frac{5\\pi}{6}$. Equivalently, set the inside equal to the angles where sine is $1$: $x - \\frac{\\pi}{3} = \\frac{\\pi}{2} + 2k\\pi$.",
        "水平平移使每个关键点移动相同的量。$y = \\sin x$ 的最大值点在 $x = \\frac{\\pi}{2} + 2k\\pi$，所以向右平移 $\\frac{\\pi}{3}$ 后，$y = \\sin\\left(x - \\frac{\\pi}{3}\\right)$ 的最大值点在\n\n$$x = \\frac{\\pi}{2} + \\frac{\\pi}{3} + 2k\\pi = \\frac{5\\pi}{6} + 2k\\pi.$$\n\n最小的正值是 $\\frac{5\\pi}{6}$。也可以令括号内等于正弦为 $1$ 的角：$x - \\frac{\\pi}{3} = \\frac{\\pi}{2} + 2k\\pi$。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const c = signedPick(rng, [...shifts, 1]);
        return firstXProblem(wave(f, 1, 1, c), rng.pick(["max", "min", "zero"] as const));
      },
    },
    {
      id: "matching-graphs-of-horizontal-translations",
      title: t("Matching graphs", "匹配图象"),
      explanation: t(
        "To read a horizontal shift from a graph, find a key point and compare it with the same point of the original wave. The figure shows $y = \\cos\\left(x - \\frac{\\pi}{4}\\right)$: its highest point nearest the $y$-axis is at $x = \\frac{\\pi}{4}$ instead of $x = 0$, so the cosine wave is shifted right $\\frac{\\pi}{4}$. A shifted cosine can also look like a shifted sine, so check each option against the key points.",
        "要从图象读出水平平移，找一个关键点，与原波形的对应点比较。图中是 $y = \\cos\\left(x - \\frac{\\pi}{4}\\right)$：离 $y$ 轴最近的最高点在 $x = \\frac{\\pi}{4}$ 而不是 $x = 0$，所以余弦波向右平移了 $\\frac{\\pi}{4}$。平移后的余弦波也可能看起来像平移后的正弦波，所以要用关键点逐一检验选项。",
      ),
      figure: waveFigure(wave("cos", 1, 1, q(1, 4))),
      generate(rng) {
        const f = rng.pick(sinCos);
        const g = partner[f];
        const c = signedPick(rng, [
          [1, 4],
          [1, 2],
          [3, 4],
        ]);
        return graphProblem(
          rng,
          wave(f, 1, 1, c),
          [wave(f, 1, 1, c.neg()), wave(g, 1, 1, c), wave(g, 1, 1, c.neg()), wave(f), wave(f, 1, 1, c.mul(Q.of(2)))],
          rng.pick(u0s),
        );
      },
    },
  ],
};

const freqs = [2, 3, 4, 5, 6, [1, 2], [1, 3], [1, 4], [2, 3], [3, 2], [3, 4]] as const;

/** horizontalStretchesOfTrigonometricFunctions changes the period of the sine and cosine waves. */
const horizontalStretchesOfTrigonometricFunctions: TopicDef = {
  id: "horizontal-stretches-of-trigonometric-functions",
  title: t("Horizontal Stretches of Trigonometric Functions", "三角函数图象的水平伸缩"),
  summary: t(
    "Stretch or compress the sine and cosine waves horizontally with y = sin bx, find the period 2π/b, and find b from a period.",
    "用 y = sin bx 把正弦和余弦波形沿水平方向伸缩，求周期 2π/b，并由周期求 b。",
  ),
  prerequisites: ["vertical-stretches-of-trigonometric-functions", "horizontal-stretches-of-functions"],
  encompasses: [{ topic: "horizontal-stretches-of-functions", weight: 0.3 }],
  xp: 14,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7e"],
  knowledgePoints: [
    {
      id: "the-period-of-y-sin-bx",
      title: t("The period of y = sin bx", "y = sin bx 的周期"),
      explanation: t(
        "Replacing $x$ by $bx$ with $b > 0$ compresses a graph horizontally by the factor $b$ (stretches it when $b < 1$). The wave $y = \\sin bx$ completes one cycle while $bx$ runs from $0$ to $2\\pi$, that is, while $x$ runs from $0$ to $\\frac{2\\pi}{b}$. So the **period** of $y = \\sin bx$ and of $y = \\cos bx$ is\n\n$$P = \\frac{2\\pi}{b}.$$\n\nFor $y = \\cos 4x$: $P = \\frac{2\\pi}{4} = \\frac{\\pi}{2}$. For $y = \\sin\\left(\\frac{1}{3}x\\right)$: $P = 2\\pi \\div \\frac{1}{3} = 6\\pi$. The amplitude does not change the period.",
        "把 $x$ 换成 $bx$（$b > 0$）会使图象沿水平方向压缩为原来的 $\\frac{1}{b}$（$b < 1$ 时为拉伸）。当 $bx$ 从 $0$ 变到 $2\\pi$，即 $x$ 从 $0$ 变到 $\\frac{2\\pi}{b}$ 时，波形 $y = \\sin bx$ 完成一个周期。所以 $y = \\sin bx$ 和 $y = \\cos bx$ 的**周期**是\n\n$$P = \\frac{2\\pi}{b}.$$\n\n对 $y = \\cos 4x$：$P = \\frac{2\\pi}{4} = \\frac{\\pi}{2}$。对 $y = \\sin\\left(\\frac{1}{3}x\\right)$：$P = 2\\pi \\div \\frac{1}{3} = 6\\pi$。振幅不改变周期。",
      ),
      figure: waveFigure(wave("sin", 1, 2)),
      generate(rng) {
        const f = rng.pick(sinCos);
        return periodProblem(wave(f, rng.int(1, 3), pickQ(rng, freqs)));
      },
    },
    {
      id: "finding-b-from-the-period",
      title: t("Finding b from the period", "由周期求 b"),
      explanation: t(
        "Solving $P = \\frac{2\\pi}{b}$ for $b$ gives $b = \\frac{2\\pi}{P}$. If $y = \\sin bx$ with $b > 0$ has period $3\\pi$, then\n\n$$b = \\frac{2\\pi}{3\\pi} = \\frac{2}{3}.$$\n\nA wave that completes one full cycle from $x = 0$ to $x = P$ has period $P$.",
        "由 $P = \\frac{2\\pi}{b}$ 解出 $b$ 得 $b = \\frac{2\\pi}{P}$。若 $y = \\sin bx$（$b > 0$）的周期是 $3\\pi$，则\n\n$$b = \\frac{2\\pi}{3\\pi} = \\frac{2}{3}.$$\n\n从 $x = 0$ 到 $x = P$ 恰好完成一个完整周期的波形，周期为 $P$。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const p = pickQ(rng, [[1, 2], 1, 3, 4, 6, [2, 3], [4, 3], [1, 3], [1, 4], 8, 5, [3, 2], 10]);
        const b = Q.of(2).div(p);
        const P = piTex(p);
        const prompt = rng.bool()
          ? t(
              `The function $y = \\${f} bx$, with $b > 0$, has period $${P}$. Find $b$.`,
              `函数 $y = \\${f} bx$（$b > 0$）的周期是 $${P}$。求 $b$。`,
            )
          : t(
              `The graph of $y = \\${f} bx$, with $b > 0$, completes exactly one full cycle from $x = 0$ to $x = ${P}$. Find $b$.`,
              `$y = \\${f} bx$（$b > 0$）的图象从 $x = 0$ 到 $x = ${P}$ 恰好完成一个完整周期。求 $b$。`,
            );
        return numberProblem({
          prompt,
          answer: b,
          solveFor: "b",
          solution: both(
            `The period is $P = ${P}$, and $P = \\frac{2\\pi}{b}$, so`,
            `周期 $P = ${P}$，且 $P = \\frac{2\\pi}{b}$，所以`,
            `b = \\frac{2\\pi}{P} = \\frac{2\\pi}{${P}} = ${b.toLatex()}`,
          ),
          wrong: [p.div(Q.of(2)), Q.one.div(p), p, p.mul(Q.of(2))],
        });
      },
    },
    {
      id: "matching-graphs-of-horizontal-stretches",
      title: t("Matching graphs", "匹配图象"),
      explanation: t(
        "Read the period from a graph as the horizontal distance between two neighboring highest points, then use $b = \\frac{2\\pi}{P}$. The figure shows $y = \\sin 2x$: its highest points are $\\pi$ apart, so $P = \\pi$ and $b = \\frac{2\\pi}{\\pi} = 2$.",
        "从图象读周期：两个相邻最高点之间的水平距离，再用 $b = \\frac{2\\pi}{P}$。图中是 $y = \\sin 2x$：它的最高点相距 $\\pi$，所以 $P = \\pi$，$b = \\frac{2\\pi}{\\pi} = 2$。",
      ),
      figure: waveFigure(wave("sin", 1, 2)),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = rng.int(1, 2);
        const b = rng.bool() ? Q.of(2) : q(1, 2);
        const d = rng.int(-1, 1);
        const w = wave(f, a, b, 0, d);
        return graphProblem(
          rng,
          w,
          [wave(f, a, Q.one.div(b), 0, d), wave(partner[f], a, b, 0, d), wave(f, a, b.mul(Q.of(2)), 0, d), wave(f, 3 - a, b, 0, d)],
          rng.pick(u0s),
        );
      },
    },
  ],
};

/** combiningGraphTransformationsOfSineAndCosine reads amplitude, period, phase shift and midline of y = a sin(b(x − c)) + d. */
const combiningGraphTransformationsOfSineAndCosine: TopicDef = {
  id: "combining-graph-transformations-of-sine-and-cosine",
  title: t("Combining Graph Transformations of Sine and Cosine", "正弦与余弦图象变换的组合"),
  summary: t(
    "Read the amplitude, period, horizontal shift and midline of y = a sin(b(x − c)) + d, including the shift of y = a sin(bx − φ) + d, and match equations to graphs.",
    "读出 y = a sin(b(x − c)) + d 的振幅、周期、水平平移和中线，包括 y = a sin(bx − φ) + d 的平移，并把方程与图象对应。",
  ),
  prerequisites: [
    "horizontal-translations-of-trigonometric-functions",
    "horizontal-stretches-of-trigonometric-functions",
    "combining-graph-transformations-three-or-more-operations",
  ],
  encompasses: [
    { topic: "horizontal-translations-of-trigonometric-functions", weight: 0.4 },
    { topic: "horizontal-stretches-of-trigonometric-functions", weight: 0.4 },
    { topic: "vertical-stretches-of-trigonometric-functions", weight: 0.3 },
    { topic: "combining-graph-transformations-three-or-more-operations", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7e", "CCSS.HSF.TF.B.5"],
  knowledgePoints: [
    {
      id: "reading-the-four-parameters",
      title: t("Reading the four parameters", "读出四个参数"),
      explanation: t(
        "In $y = a \\sin(b(x - c)) + d$ with $a, b > 0$, each parameter does one thing:\n\n| parameter | effect |\n| :--- | :--- |\n| $a$ | amplitude $a$ |\n| $b$ | period $\\frac{2\\pi}{b}$ |\n| $c$ | shift right $c$ (left when $c < 0$) |\n| $d$ | midline $y = d$ |\n\nFor $y = 3\\cos\\left(2\\left(x + \\frac{\\pi}{6}\\right)\\right) - 1$: amplitude $3$, period $\\frac{2\\pi}{2} = \\pi$, shifted left $\\frac{\\pi}{6}$, midline $y = -1$. The horizontal shift is $c$, read after factoring $b$ out of the input.",
        "在 $a, b > 0$ 的 $y = a \\sin(b(x - c)) + d$ 中，每个参数各起一个作用：\n\n| 参数 | 作用 |\n| :--- | :--- |\n| $a$ | 振幅为 $a$ |\n| $b$ | 周期为 $\\frac{2\\pi}{b}$ |\n| $c$ | 向右平移 $c$（$c < 0$ 时向左） |\n| $d$ | 中线为 $y = d$ |\n\n对 $y = 3\\cos\\left(2\\left(x + \\frac{\\pi}{6}\\right)\\right) - 1$：振幅 $3$，周期 $\\frac{2\\pi}{2} = \\pi$，向左平移 $\\frac{\\pi}{6}$，中线 $y = -1$。水平平移量是把 $b$ 从输入中提出后读出的 $c$。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = pickQ(rng, [2, 3, 4, 5, [1, 2], [3, 2]]);
        const b = pickQ(rng, [2, 3, 4, [1, 2], [1, 3]]);
        const c = signedPick(rng, [
          [1, 6],
          [1, 4],
          [1, 3],
          [1, 2],
        ]);
        const d = rng.nonZero(-5, 5);
        const w = wave(f, a, b, c, d);
        const W = waveTex(w);
        const kind = rng.pick(["amplitude", "period", "midline", "shift"] as const);
        switch (kind) {
          case "amplitude":
            return numberProblem({
              prompt: t(`What is the amplitude of $y = ${W}$?`, `$y = ${W}$ 的振幅是多少？`),
              answer: a,
              solution: t(
                `The amplitude is the coefficient in front of $\\${f}$: $${a.toLatex()}$. The other parameters change the period, the shift and the midline, not the height of the wave.`,
                `振幅是 $\\${f}$ 前面的系数：$${a.toLatex()}$。其他参数改变周期、平移和中线，不改变波的高度。`,
              ),
              wrong: [Q.of(d), b, a.mul(Q.of(2)), Q.of(d).add(a)],
            });
          case "midline":
            return numberProblem({
              prompt: t(`Find the midline of the graph of $y = ${W}$.`, `求 $y = ${W}$ 的图象的中线。`),
              answer: d,
              solveFor: "y",
              solution: t(
                `The constant added outside the function shifts the midline $y = 0$ of the wave to $y = ${d}$.`,
                `加在函数外面的常数把波形的中线 $y = 0$ 移到 $y = ${d}$。`,
              ),
              wrong: [0, -d, Q.of(d).add(a), a],
            });
          case "period":
            return periodProblem(w);
          case "shift":
            return oneOf(
              rng,
              t(
                `Which describes the horizontal shift of the graph of $y = ${W}$ from the graph of $y = ${waveTex(wave(f, a, b, 0, d))}$?`,
                `$y = ${W}$ 的图象相对于 $y = ${waveTex(wave(f, a, b, 0, d))}$ 的图象的水平平移是哪一个？`,
              ),
              horizontal(c),
              [horizontalOpposite(c), horizontal(c.mul(b)), horizontalOpposite(c.mul(b))],
              t(
                `With $b = ${b.toLatex()}$ factored out, the input is $${b.toLatex()}\\left(x ${c.sign() > 0 ? "-" : "+"} ${piTex(c.abs())}\\right)$: $x$ is replaced by $x ${c.sign() > 0 ? "-" : "+"} ${piTex(c.abs())}$, a shift ${c.sign() > 0 ? "right" : "left"} $${piTex(c.abs())}$ units.`,
                `把 $b = ${b.toLatex()}$ 提出后，输入是 $${b.toLatex()}\\left(x ${c.sign() > 0 ? "-" : "+"} ${piTex(c.abs())}\\right)$：$x$ 被换成 $x ${c.sign() > 0 ? "-" : "+"} ${piTex(c.abs())}$，即向${c.sign() > 0 ? "右" : "左"}平移 $${piTex(c.abs())}$ 个单位。`,
              ),
            );
        }
      },
    },
    {
      id: "the-shift-of-y-a-sin-bx-phi-d",
      figure: waveDrawings["combining-graph-transformations-of-sine-and-cosine#the-shift-of-y-a-sin-bx-phi-d"],
      title: t("The shift of y = a sin(bx − φ) + d", "y = a sin(bx − φ) + d 的平移"),
      explanation: t(
        "In $y = a \\sin(bx - \\varphi) + d$ the shift is **not** $\\varphi$. Factor $b$ out of the input first:\n\n$$bx - \\varphi = b\\left(x - \\frac{\\varphi}{b}\\right),$$\n\nso the graph is shifted right $\\frac{\\varphi}{b}$ (left when the sign is $+$). For $y = \\sin\\left(3x - \\frac{\\pi}{2}\\right)$: $3x - \\frac{\\pi}{2} = 3\\left(x - \\frac{\\pi}{6}\\right)$, a shift right $\\frac{\\pi}{6}$.",
        "在 $y = a \\sin(bx - \\varphi) + d$ 中，平移量**不是** $\\varphi$。先把 $b$ 从输入中提出：\n\n$$bx - \\varphi = b\\left(x - \\frac{\\varphi}{b}\\right),$$\n\n所以图象向右平移 $\\frac{\\varphi}{b}$（符号为 $+$ 时向左）。对 $y = \\sin\\left(3x - \\frac{\\pi}{2}\\right)$：$3x - \\frac{\\pi}{2} = 3\\left(x - \\frac{\\pi}{6}\\right)$，即向右平移 $\\frac{\\pi}{6}$。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = rng.int(1, 5);
        const b = Q.of(rng.int(2, 4));
        const c = signedPick(rng, [
          [1, 6],
          [1, 4],
          [1, 3],
          [1, 2],
          [1, 8],
          [1, 12],
        ]);
        const d = rng.int(-4, 4);
        const w = wave(f, a, b, c, d);
        const phi = b.mul(c).abs();
        const op = c.sign() > 0 ? "-" : "+";
        const solution = both(
          `Factor $${b.toLatex()}$ out of the input:`,
          `把 $${b.toLatex()}$ 从输入中提出：`,
          `${b.toLatex()}x ${op} ${piTex(phi)} = ${b.toLatex()}\\left(x ${op} ${piTex(c.abs())}\\right)`,
        );
        const tail = t(
          `So $y = ${waveTex(w)}$, a shift ${c.sign() > 0 ? "right" : "left"} $${piTex(c.abs())}$ units.`,
          `所以 $y = ${waveTex(w)}$，即向${c.sign() > 0 ? "右" : "左"}平移 $${piTex(c.abs())}$ 个单位。`,
        );
        if (rng.bool())
          return oneOf(
            rng,
            t(
              `Which describes the horizontal shift of the graph of $y = ${waveTex(w, true)}$ from the graph of $y = ${waveTex(wave(f, a, b, 0, d))}$?`,
              `$y = ${waveTex(w, true)}$ 的图象相对于 $y = ${waveTex(wave(f, a, b, 0, d))}$ 的图象的水平平移是哪一个？`,
            ),
            horizontal(c),
            [horizontalOpposite(c), horizontal(c.mul(b)), horizontalOpposite(c.mul(b))],
            join(solution, tail),
          );
        return oneOf(
          rng,
          t(`Which equation is the same as $y = ${waveTex(w, true)}$?`, `哪个方程与 $y = ${waveTex(w, true)}$ 相同？`),
          eqOption(w),
          [eqOption(wave(f, a, b, c.mul(b), d)), eqOption(wave(f, a, b, c.neg(), d)), eqOption(wave(f, a, b, c.mul(b).neg(), d))],
          join(solution, tail),
        );
      },
    },
    {
      id: "matching-graphs-of-combined-transformations",
      title: t("Matching graphs", "匹配图象"),
      explanation: t(
        "Read a transformed wave in four steps: the midline $d$ halfway between the highest and lowest values; the amplitude $a$ from the midline to the top; the period from one highest point to the next, giving $b = \\frac{2\\pi}{P}$; and the shift from where a key point has moved. The figure shows $y = 2\\sin\\left(\\frac{1}{2}\\left(x - \\frac{\\pi}{2}\\right)\\right) + 1$: midline $y = 1$, amplitude $2$, period $4\\pi$, and it crosses its midline rising at $x = \\frac{\\pi}{2}$ instead of $x = 0$.",
        "分四步读出变换后的波形：中线 $d$ 位于最高值与最低值的正中间；振幅 $a$ 是中线到最高处的距离；周期是相邻两个最高点的距离，由此 $b = \\frac{2\\pi}{P}$；平移量看某个关键点移动了多少。图中是 $y = 2\\sin\\left(\\frac{1}{2}\\left(x - \\frac{\\pi}{2}\\right)\\right) + 1$：中线 $y = 1$，振幅 $2$，周期 $4\\pi$，并且在 $x = \\frac{\\pi}{2}$ 而不是 $x = 0$ 处上升穿过中线。",
      ),
      figure: waveFigure(wave("sin", 2, q(1, 2), q(1, 2), 1)),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = rng.int(1, 3);
        const b = pickQ(rng, [[1, 2], 1, 2]);
        const c = signedPick(rng, [
          [1, 4],
          [1, 2],
        ]);
        const d = rng.int(-2, 2);
        const w = wave(f, a, b, c, d);
        const otherB = b.eq(Q.one) ? Q.of(2) : Q.one.div(b);
        return graphProblem(rng, w, [
          wave(f, a, b, c.neg(), d),
          wave(f, a, otherB, c, d),
          wave(f, a, b, c, d === 0 ? 1 : -d),
          wave(partner[f], a, b, c, d),
          wave(f, a === 3 ? 1 : a + 1, b, c, d),
        ]);
      },
    },
  ],
};

/** graphTransformationsOfTangentAndCotangent applies one transformation at a time to tangent and cotangent. */
const graphTransformationsOfTangentAndCotangent: TopicDef = {
  id: "graph-transformations-of-tangent-and-cotangent",
  title: t("Graph Transformations of Tangent and Cotangent", "正切与余切的图象变换"),
  summary: t(
    "Shift and stretch the graphs of y = tan x and y = cot x, find the period π/b of y = tan bx, and locate the shifted asymptotes.",
    "平移和伸缩 y = tan x 与 y = cot x 的图象，求 y = tan bx 的周期 π/b，并确定平移后的渐近线。",
  ),
  prerequisites: [
    "horizontal-translations-of-trigonometric-functions",
    "horizontal-stretches-of-trigonometric-functions",
    "describing-properties-of-the-cotangent-function",
  ],
  encompasses: [
    { topic: "horizontal-translations-of-trigonometric-functions", weight: 0.3 },
    { topic: "horizontal-stretches-of-trigonometric-functions", weight: 0.3 },
    { topic: "graphing-tangent-and-cotangent", weight: 0.4 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7e"],
  knowledgePoints: [
    {
      id: "the-period-of-y-tan-bx",
      title: t("The period of y = tan bx", "y = tan bx 的周期"),
      explanation: t(
        "The functions $y = \\tan x$ and $y = \\cot x$ have period $\\pi$, not $2\\pi$. Replacing $x$ by $bx$ with $b > 0$ divides the period by $b$:\n\n$$P = \\frac{\\pi}{b}.$$\n\nFor $y = \\tan 3x$: $P = \\frac{\\pi}{3}$, and the asymptotes are $\\frac{\\pi}{3}$ apart. For $y = 2\\cot\\left(\\frac{1}{2}x\\right)$: $P = \\pi \\div \\frac{1}{2} = 2\\pi$. A vertical stretch does not change the period.",
        "函数 $y = \\tan x$ 与 $y = \\cot x$ 的周期是 $\\pi$，而不是 $2\\pi$。把 $x$ 换成 $bx$（$b > 0$）会把周期除以 $b$：\n\n$$P = \\frac{\\pi}{b}.$$\n\n对 $y = \\tan 3x$：$P = \\frac{\\pi}{3}$，渐近线相距 $\\frac{\\pi}{3}$。对 $y = 2\\cot\\left(\\frac{1}{2}x\\right)$：$P = \\pi \\div \\frac{1}{2} = 2\\pi$。竖直伸缩不改变周期。",
      ),
      figure: waveFigure(wave("tan", 1, q(1, 2))),
      generate(rng) {
        const f = rng.pick(tanCot);
        return periodProblem(wave(f, pickQ(rng, [1, 2, 3, [1, 2]]), pickQ(rng, [2, 3, 4, [1, 2], [1, 3], [1, 4], [2, 3], [3, 2]])));
      },
    },
    {
      id: "asymptotes-after-a-translation",
      figure: waveDrawings["graph-transformations-of-tangent-and-cotangent#asymptotes-after-a-translation"],
      title: t("Asymptotes after a translation", "平移后的渐近线"),
      explanation: t(
        "The asymptotes of $y = \\tan x$ are at $x = \\frac{\\pi}{2} + k\\pi$, and those of $y = \\cot x$ at $x = k\\pi$. A horizontal shift moves them with the graph; a vertical shift does not move them at all.\n\nFor $y = \\cot\\left(x + \\frac{\\pi}{3}\\right) + 2$: the asymptotes are where $x + \\frac{\\pi}{3} = k\\pi$, that is $x = -\\frac{\\pi}{3} + k\\pi$. The smallest positive one is $x = \\frac{2\\pi}{3}$.",
        "$y = \\tan x$ 的渐近线在 $x = \\frac{\\pi}{2} + k\\pi$，$y = \\cot x$ 的渐近线在 $x = k\\pi$。水平平移使它们随图象一起移动；竖直平移则完全不移动它们。\n\n对 $y = \\cot\\left(x + \\frac{\\pi}{3}\\right) + 2$：渐近线在 $x + \\frac{\\pi}{3} = k\\pi$ 处，即 $x = -\\frac{\\pi}{3} + k\\pi$。最小的正值是 $x = \\frac{2\\pi}{3}$。",
      ),
      generate(rng) {
        const f = rng.pick(tanCot);
        const c = signedPick(rng, [
          [1, 6],
          [1, 4],
          [1, 3],
          [2, 3],
          [3, 4],
          [5, 6],
        ]);
        return firstXProblem(wave(f, 1, 1, c, rng.int(-3, 3)), "asymptote");
      },
    },
    {
      id: "matching-graphs-of-transformed-tangent-and-cotangent",
      title: t("Matching graphs", "匹配图象"),
      explanation: t(
        "Tangent rises on each branch and passes through a point on its midline halfway between two asymptotes; cotangent falls. After a vertical shift by $d$ that point is at height $d$; after a horizontal shift the asymptotes move; after a stretch by $a$ the points a quarter period from it are at height $d \\pm a$. The figure shows $y = \\tan\\left(\\frac{1}{2}x\\right)$: the asymptotes are $2\\pi$ apart, at $x = \\pm\\pi$.",
        "正切的每一支都上升，并在两条渐近线正中间经过中线上的一点；余切则下降。竖直平移 $d$ 后，该点的高度为 $d$；水平平移后渐近线移动；竖直伸缩 $a$ 倍后，距该点四分之一周期的点的高度为 $d \\pm a$。图中是 $y = \\tan\\left(\\frac{1}{2}x\\right)$：渐近线相距 $2\\pi$，在 $x = \\pm\\pi$ 处。",
      ),
      figure: waveFigure(wave("tan", 1, q(1, 2))),
      generate(rng) {
        const f = rng.pick(tanCot);
        const g = partner[f];
        const kind = rng.pick(["d", "a", "c", "b"] as const);
        const d = rng.nonZero(-2, 2);
        const a = pickQ(rng, [2, 3, [1, 2]]);
        const c = signedPick(rng, [[1, 4]]);
        const w = kind === "d" ? wave(f, 1, 1, 0, d) : kind === "a" ? wave(f, a) : kind === "c" ? wave(f, 1, 1, c) : wave(f, 1, q(1, 2));
        return graphProblem(
          rng,
          w,
          [
            wave(g, w.a, w.b, w.c, w.d),
            wave(f, w.a, w.b, w.c.neg(), -w.d),
            wave(f, kind === "a" ? Q.one : Q.of(2), w.b, w.c, w.d),
            wave(f, w.a, kind === "b" ? Q.of(2) : q(1, 2), w.c, w.d),
            wave(g, w.a, w.b, w.c.neg(), -w.d),
          ],
          rng.pick(u0s),
        );
      },
    },
  ],
};

/** combiningGraphTransformationsOfTangentAndCotangent handles y = a tan(b(x − c)) + d. */
const combiningGraphTransformationsOfTangentAndCotangent: TopicDef = {
  id: "combining-graph-transformations-of-tangent-and-cotangent",
  title: t("Combining Graph Transformations of Tangent and Cotangent", "正切与余切图象变换的组合"),
  summary: t(
    "Find the period and asymptotes of y = a tan(b(x − c)) + d and y = a cot(b(x − c)) + d, and match these equations to graphs.",
    "求 y = a tan(b(x − c)) + d 与 y = a cot(b(x − c)) + d 的周期和渐近线，并把这些方程与图象对应。",
  ),
  prerequisites: ["graph-transformations-of-tangent-and-cotangent", "combining-graph-transformations-of-sine-and-cosine"],
  encompasses: [{ topic: "graph-transformations-of-tangent-and-cotangent", weight: 0.6 }],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7e"],
  knowledgePoints: [
    {
      id: "the-period-of-a-combined-tangent",
      title: t("The period", "周期"),
      explanation: t(
        "In $y = a \\tan(b(x - c)) + d$ only $b$ changes the period, which is $\\frac{\\pi}{b}$; $a$ stretches the branches, $c$ shifts them sideways and $d$ moves the point of symmetry of each branch to height $d$. For $y = 4\\cot\\left(3\\left(x - \\frac{\\pi}{4}\\right)\\right) - 2$ the period is $\\frac{\\pi}{3}$.",
        "在 $y = a \\tan(b(x - c)) + d$ 中只有 $b$ 改变周期，周期为 $\\frac{\\pi}{b}$；$a$ 伸缩各分支，$c$ 使它们左右移动，$d$ 把每一支的对称中心移到高度 $d$。$y = 4\\cot\\left(3\\left(x - \\frac{\\pi}{4}\\right)\\right) - 2$ 的周期是 $\\frac{\\pi}{3}$。",
      ),
      generate(rng) {
        const f = rng.pick(tanCot);
        const w = wave(
          f,
          rng.int(1, 4),
          pickQ(rng, [2, 3, 4, [1, 2], [1, 3], [3, 2]]),
          signedPick(rng, [
            [1, 6],
            [1, 4],
            [1, 3],
            [1, 2],
          ]),
          rng.nonZero(-4, 4),
        );
        return periodProblem(w);
      },
    },
    {
      id: "asymptotes-of-a-combined-tangent",
      figure: waveDrawings["combining-graph-transformations-of-tangent-and-cotangent#asymptotes-of-a-combined-tangent"],
      title: t("Asymptotes", "渐近线"),
      explanation: t(
        "Let $\\theta = b(x - c)$. The graph of $y = a \\tan \\theta + d$ has asymptotes where $\\tan \\theta$ is undefined, $\\theta = \\frac{\\pi}{2} + k\\pi$ (for cotangent, $\\theta = k\\pi$). Solve for $x$:\n\nFor $y = \\tan\\left(2\\left(x - \\frac{\\pi}{6}\\right)\\right)$: $2\\left(x - \\frac{\\pi}{6}\\right) = \\frac{\\pi}{2} + k\\pi$ gives $x = \\frac{\\pi}{6} + \\frac{\\pi}{4} + \\frac{k\\pi}{2} = \\frac{5\\pi}{12} + \\frac{k\\pi}{2}$. The smallest positive asymptote is $x = \\frac{5\\pi}{12}$.",
        "令 $\\theta = b(x - c)$。$y = a \\tan \\theta + d$ 的图象在 $\\tan \\theta$ 无定义处，即 $\\theta = \\frac{\\pi}{2} + k\\pi$ 处，有渐近线（余切为 $\\theta = k\\pi$）。解出 $x$：\n\n对 $y = \\tan\\left(2\\left(x - \\frac{\\pi}{6}\\right)\\right)$：由 $2\\left(x - \\frac{\\pi}{6}\\right) = \\frac{\\pi}{2} + k\\pi$ 得 $x = \\frac{\\pi}{6} + \\frac{\\pi}{4} + \\frac{k\\pi}{2} = \\frac{5\\pi}{12} + \\frac{k\\pi}{2}$。最小的正渐近线是 $x = \\frac{5\\pi}{12}$。",
      ),
      generate(rng) {
        const f = rng.pick(tanCot);
        const w = wave(
          f,
          rng.int(1, 3),
          pickQ(rng, [2, 3, [1, 2], [1, 3]]),
          signedPick(rng, [
            [1, 6],
            [1, 4],
            [1, 3],
            [1, 2],
          ]),
          rng.int(-3, 3),
        );
        return firstXProblem(w, "asymptote");
      },
    },
    {
      id: "matching-graphs-of-combined-tangent-transformations",
      title: t("Matching graphs", "匹配图象"),
      explanation: t(
        "Find the asymptotes and their spacing (the period $\\frac{\\pi}{b}$), the point of each branch at height $d$ halfway between two asymptotes, and the points a quarter period away at heights $d \\pm a$. The figure shows $y = 2\\tan\\left(x - \\frac{\\pi}{4}\\right) + 1$: asymptotes $\\pi$ apart at $x = -\\frac{\\pi}{4}$ and $x = \\frac{3\\pi}{4}$, the point $\\left(\\frac{\\pi}{4}, 1\\right)$ and the point $\\left(\\frac{\\pi}{2}, 3\\right)$.",
        "找出渐近线及其间距（周期 $\\frac{\\pi}{b}$），每一支在两条渐近线正中间、高度为 $d$ 的点，以及距它四分之一周期、高度为 $d \\pm a$ 的点。图中是 $y = 2\\tan\\left(x - \\frac{\\pi}{4}\\right) + 1$：渐近线相距 $\\pi$，在 $x = -\\frac{\\pi}{4}$ 与 $x = \\frac{3\\pi}{4}$，经过点 $\\left(\\frac{\\pi}{4}, 1\\right)$ 和 $\\left(\\frac{\\pi}{2}, 3\\right)$。",
      ),
      figure: waveFigure(wave("tan", 2, 1, q(1, 4), 1)),
      generate(rng) {
        const f = rng.pick(tanCot);
        const a = rng.int(1, 2);
        const b = rng.bool() ? Q.one : q(1, 2);
        const c = signedPick(rng, [
          [1, 4],
          [1, 2],
        ]);
        const d = rng.int(-2, 2);
        const w = wave(f, a, b, c, d);
        return graphProblem(rng, w, [
          wave(f, a, b, c.neg(), d),
          wave(partner[f], a, b, c, d),
          wave(f, a, b.eq(Q.one) ? q(1, 2) : Q.one, c, d),
          wave(f, a, b, c, d === 0 ? 1 : -d),
          wave(f, 3 - a, b, c, d),
        ]);
      },
    },
  ],
};

/** combiningGraphTransformationsOfSecantAndCosecant handles y = a sec(b(x − c)) + d. */
const combiningGraphTransformationsOfSecantAndCosecant: TopicDef = {
  id: "combining-graph-transformations-of-secant-and-cosecant",
  title: t("Combining Graph Transformations of Secant and Cosecant", "正割与余割图象变换的组合"),
  summary: t(
    "Find the range and asymptotes of y = a sec(b(x − c)) + d and y = a csc(b(x − c)) + d, and match these equations to graphs.",
    "求 y = a sec(b(x − c)) + d 与 y = a csc(b(x − c)) + d 的值域和渐近线，并把这些方程与图象对应。",
  ),
  prerequisites: ["combining-graph-transformations-of-sine-and-cosine", "describing-properties-of-the-cosecant-function"],
  encompasses: [{ topic: "graphing-secant-and-cosecant", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7e"],
  knowledgePoints: [
    {
      id: "range-of-a-transformed-secant",
      title: t("The range", "值域"),
      explanation: t(
        "The values of $\\sec \\theta$ and $\\csc \\theta$ are at most $-1$ or at least $1$. Multiplying by $a > 0$ and adding $d$ moves these to at most $d - a$ or at least $d + a$, so the range of $y = a \\sec(b(x - c)) + d$ is\n\n$$(-\\infty, d - a] \\cup [d + a, \\infty).$$\n\nThe graph is the transformed cosine wave $y = a\\cos(b(x - c)) + d$ with each half-wave turned into a U-shaped branch outside the band between $d - a$ and $d + a$. For $y = 2\\csc 3x - 1$ the range is $(-\\infty, -3] \\cup [1, \\infty)$.",
        "$\\sec \\theta$ 与 $\\csc \\theta$ 的值不大于 $-1$ 或不小于 $1$。乘以 $a > 0$ 再加 $d$ 后，变为不大于 $d - a$ 或不小于 $d + a$，所以 $y = a \\sec(b(x - c)) + d$ 的值域是\n\n$$(-\\infty, d - a] \\cup [d + a, \\infty).$$\n\n它的图象是把变换后的余弦波 $y = a\\cos(b(x - c)) + d$ 的每半个波变成位于 $d - a$ 与 $d + a$ 之间的带状区域之外的 U 形分支。$y = 2\\csc 3x - 1$ 的值域是 $(-\\infty, -3] \\cup [1, \\infty)$。",
      ),
      figure: waveFigure(wave("sec", 1, 1, 0, 1)),
      generate(rng) {
        const f = rng.pick(secCsc);
        const a = pickQ(rng, [1, 2, 3, 4, [1, 2]]);
        const d = rng.int(-4, 4);
        const w = wave(f, a, pickQ(rng, [1, 2, 3, [1, 2]]), signedPick(rng, [0, [1, 4], [1, 3], [1, 2]]), d);
        const D = Q.of(d);
        return intervalProblem({
          prompt: t(
            `What is the range of $y = ${waveTex(w)}$? Write it in interval notation.`,
            `$y = ${waveTex(w)}$ 的值域是什么？用区间表示。`,
          ),
          set: outside(d, a),
          solution: both(
            `The values of $\\${f} \\theta$ are at most $-1$ or at least $1$. Multiplying by $${a.toLatex()}$ and adding $${d}$ gives values at most $${D.sub(a).toLatex()}$ or at least $${D.add(a).toLatex()}$; $b$ and $c$ only move the graph sideways:`,
            `$\\${f} \\theta$ 的值不大于 $-1$ 或不小于 $1$。乘以 $${a.toLatex()}$ 再加 $${d}$ 后，值不大于 $${D.sub(a).toLatex()}$ 或不小于 $${D.add(a).toLatex()}$；$b$ 与 $c$ 只使图象左右移动：`,
            `(-\\infty, ${D.sub(a).toLatex()}] \\cup [${D.add(a).toLatex()}, \\infty)`,
          ),
          wrong: [box(d, a), outside(0, a), outside(d, Q.one), outside(d, a.mul(Q.of(2)))],
        });
      },
    },
    {
      id: "asymptotes-of-a-transformed-secant",
      figure: waveDrawings["combining-graph-transformations-of-secant-and-cosecant#asymptotes-of-a-transformed-secant"],
      title: t("Asymptotes", "渐近线"),
      explanation: t(
        "The graph of $y = a \\sec \\theta + d$ has asymptotes where $\\cos \\theta = 0$, $\\theta = \\frac{\\pi}{2} + k\\pi$, and that of $y = a \\csc \\theta + d$ where $\\sin \\theta = 0$, $\\theta = k\\pi$. With $\\theta = b(x - c)$, solve for $x$.\n\nFor $y = 3\\csc\\left(\\frac{1}{2}\\left(x + \\frac{\\pi}{3}\\right)\\right)$: $\\frac{1}{2}\\left(x + \\frac{\\pi}{3}\\right) = k\\pi$ gives $x = -\\frac{\\pi}{3} + 2k\\pi$, so the smallest positive asymptote is $x = \\frac{5\\pi}{3}$.",
        "$y = a \\sec \\theta + d$ 的图象在 $\\cos \\theta = 0$，即 $\\theta = \\frac{\\pi}{2} + k\\pi$ 处有渐近线；$y = a \\csc \\theta + d$ 在 $\\sin \\theta = 0$，即 $\\theta = k\\pi$ 处有渐近线。令 $\\theta = b(x - c)$，解出 $x$。\n\n对 $y = 3\\csc\\left(\\frac{1}{2}\\left(x + \\frac{\\pi}{3}\\right)\\right)$：由 $\\frac{1}{2}\\left(x + \\frac{\\pi}{3}\\right) = k\\pi$ 得 $x = -\\frac{\\pi}{3} + 2k\\pi$，所以最小的正渐近线是 $x = \\frac{5\\pi}{3}$。",
      ),
      generate(rng) {
        const f = rng.pick(secCsc);
        const w = wave(
          f,
          rng.int(1, 4),
          pickQ(rng, [1, 2, 3, [1, 2]]),
          signedPick(rng, [
            [1, 6],
            [1, 4],
            [1, 3],
            [1, 2],
          ]),
          rng.int(-3, 3),
        );
        return firstXProblem(w, "asymptote");
      },
    },
    {
      id: "matching-graphs-of-transformed-secant-and-cosecant",
      title: t("Matching graphs", "匹配图象"),
      explanation: t(
        "Read the turning points of the branches: those opening up are at height $d + a$, those opening down at $d - a$, so the midline is halfway between them. The asymptotes lie halfway between neighboring turning points, and two turning points at the same height are one period apart. The figure shows $y = \\sec x + 1$: branches opening up from $(0, 2)$ and down from $(\\pi, 0)$, with asymptotes at $x = \\pm\\frac{\\pi}{2}$.",
        "读出各分支的转折点：开口向上的在高度 $d + a$，开口向下的在 $d - a$，中线位于两者正中间。渐近线位于相邻转折点的正中间，两个高度相同的转折点相距一个周期。图中是 $y = \\sec x + 1$：分支从 $(0, 2)$ 向上开口、从 $(\\pi, 0)$ 向下开口，渐近线为 $x = \\pm\\frac{\\pi}{2}$。",
      ),
      figure: waveFigure(wave("sec", 1, 1, 0, 1)),
      generate(rng) {
        const f = rng.pick(secCsc);
        const a = rng.int(1, 2);
        const b = pickQ(rng, [[1, 2], 1, 2]);
        const c = signedPick(rng, [0, [1, 4], [1, 2]]);
        const d = rng.int(-1, 1);
        const w = wave(f, a, b, c, d);
        return graphProblem(rng, w, [
          wave(partner[f], a, b, c, d),
          wave(f, a, b, c.neg(), d),
          wave(f, a, b.eq(Q.one) ? Q.of(2) : Q.one, c, d),
          wave(f, a, b, c, d === 0 ? 1 : -d),
          wave(f, 3 - a, b, c, d),
          wave(f, a, b, c.add(q(1, 4)), d),
        ]);
      },
    },
  ],
};

/** graphingReflectionsOfTrigonometricFunctions reflects the trigonometric graphs in the axes. */
const graphingReflectionsOfTrigonometricFunctions: TopicDef = {
  id: "graphing-reflections-of-trigonometric-functions",
  title: t("Graphing Reflections of Trigonometric Functions", "三角函数图象的对称变换"),
  summary: t(
    "Reflect trigonometric graphs in the x-axis with y = −f(x) and in the y-axis with y = f(−x), using the symmetry of each function, and find the new maximum and minimum points.",
    "用 y = −f(x) 把三角函数图象关于 x 轴对称，用 y = f(−x) 关于 y 轴对称，利用各函数的奇偶性，并求新的最大值点和最小值点。",
  ),
  prerequisites: [
    "combining-graph-transformations-of-secant-and-cosecant",
    "graph-transformations-of-tangent-and-cotangent",
    "combining-reflections-with-other-graph-transformations",
  ],
  encompasses: [{ topic: "combining-reflections-with-other-graph-transformations", weight: 0.4 }],
  xp: 15,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.TF.A.4"],
  knowledgePoints: [
    {
      id: "reflecting-in-the-y-axis",
      figure: waveDrawings["graphing-reflections-of-trigonometric-functions#reflecting-in-the-y-axis"],
      title: t("Reflecting in the y-axis", "关于 y 轴对称"),
      explanation: t(
        "The graph of $y = -f(x)$ is the graph of $y = f(x)$ reflected in the $x$-axis, and $y = f(-x)$ is its reflection in the $y$-axis. For the trigonometric functions a reflection in the $y$-axis is the same as either nothing or a reflection in the $x$-axis:\n\n- cosine and secant are **even**: $\\cos(-x) = \\cos x$, $\\sec(-x) = \\sec x$;\n- sine, cosecant, tangent and cotangent are **odd**: $\\sin(-x) = -\\sin x$, and so on.\n\nSo $y = 3\\sin(-x) + 2$ is the same as $y = -3\\sin x + 2$, while $y = 3\\cos(-x) + 2$ is the same as $y = 3\\cos x + 2$.",
        "$y = -f(x)$ 的图象是 $y = f(x)$ 的图象关于 $x$ 轴的对称图形，$y = f(-x)$ 则是关于 $y$ 轴的对称图形。对三角函数，关于 $y$ 轴对称要么不改变图象，要么等同于关于 $x$ 轴对称：\n\n- 余弦与正割是**偶函数**：$\\cos(-x) = \\cos x$，$\\sec(-x) = \\sec x$；\n- 正弦、余割、正切与余切是**奇函数**：$\\sin(-x) = -\\sin x$，等等。\n\n所以 $y = 3\\sin(-x) + 2$ 与 $y = -3\\sin x + 2$ 相同，而 $y = 3\\cos(-x) + 2$ 与 $y = 3\\cos x + 2$ 相同。",
      ),
      generate(rng) {
        const f = rng.pick<Fn>(["sin", "cos", "tan", "cot", "sec", "csc"]);
        const a = rng.int(1, 4);
        const d = rng.int(-4, 4);
        const A = a === 1 ? "" : String(a);
        const prompt = `${A}\\${f}(-x)${signed(d)}`;
        const opt = (s: number, dd: number) => same(`$y = ${s < 0 ? "-" : ""}${A}\\${f} x${signed(dd)}$`);
        const right = even(f) ? opt(1, d) : opt(-1, d);
        return oneOf(
          rng,
          t(`Which equation has the same graph as $y = ${prompt}$?`, `哪个方程与 $y = ${prompt}$ 的图象相同？`),
          right,
          [opt(even(f) ? -1 : 1, d), opt(-1, -d), opt(1, -d), same(`$y = ${A}\\${partner[f]} x${signed(d)}$`)],
          t(
            `${fnNames[f].en[0]!.toUpperCase()}${fnNames[f].en.slice(1)} is ${even(f) ? "even" : "odd"}: $\\${f}(-x) = ${even(f) ? "" : "-"}\\${f} x$. So $y = ${prompt}$ is the same as $y = ${right.en.slice(5, -1)}$. Only the sign in front of $\\${f}$ can change; the constant $${d}$ is not reflected.`,
            `${fnNames[f]["zh-CN"]}函数是${even(f) ? "偶" : "奇"}函数：$\\${f}(-x) = ${even(f) ? "" : "-"}\\${f} x$。所以 $y = ${prompt}$ 与 $y = ${right.en.slice(5, -1)}$ 相同。只有 $\\${f}$ 前面的符号可能改变；常数 $${d}$ 不受影响。`,
          ),
        );
      },
    },
    {
      id: "extrema-of-reflected-waves",
      figure: waveDrawings["graphing-reflections-of-trigonometric-functions#extrema-of-reflected-waves"],
      title: t("Extrema of reflected waves", "对称后波形的最值点"),
      explanation: t(
        "Reflecting in the $x$-axis swaps the highest and lowest points: $y = -\\sin x$ has its **maximum** where $\\sin x = -1$, at $x = \\frac{3\\pi}{2} + 2k\\pi$, and its minimum where $\\sin x = 1$. The midline and amplitude stay the same.\n\nFor $y = -2\\cos x + 1$: maximum $1 + 2 = 3$ where $\\cos x = -1$, so at $x = \\pi + 2k\\pi$; minimum $-1$ where $\\cos x = 1$, at $x = 2k\\pi$, so the smallest positive one is $x = 2\\pi$.",
        "关于 $x$ 轴对称会交换最高点与最低点：$y = -\\sin x$ 在 $\\sin x = -1$ 处，即 $x = \\frac{3\\pi}{2} + 2k\\pi$ 处取得**最大值**，在 $\\sin x = 1$ 处取得最小值。中线和振幅不变。\n\n对 $y = -2\\cos x + 1$：最大值 $1 + 2 = 3$ 在 $\\cos x = -1$ 处，即 $x = \\pi + 2k\\pi$；最小值 $-1$ 在 $\\cos x = 1$ 处，即 $x = 2k\\pi$，所以最小的正值是 $x = 2\\pi$。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = rng.int(1, 4);
        const d = rng.int(-3, 3);
        const target = rng.pick(["max", "min"] as const);
        const reflected = wave(f, -a, 1, 0, d);
        const unreflected = wave(f, a, 1, 0, d);
        return firstXProblem(reflected, target, false, [firstAfter(unreflected, targetFamilies(unreflected, target), Q.zero)]);
      },
    },
    {
      id: "matching-graphs-of-reflections",
      title: t("Matching graphs", "匹配图象"),
      explanation: t(
        "A negative coefficient turns the wave upside down about its midline. The figure shows $y = -2\\sin x + 1$: it crosses its midline $y = 1$ at $x = 0$ going **down**, where $y = 2\\sin x + 1$ would go up, and its lowest point nearest the $y$-axis on the right is $\\left(\\frac{\\pi}{2}, -1\\right)$.",
        "负系数把波形关于中线上下翻转。图中是 $y = -2\\sin x + 1$：它在 $x = 0$ 处**向下**穿过中线 $y = 1$，而 $y = 2\\sin x + 1$ 会向上穿过；它在 $y$ 轴右侧最近的最低点是 $\\left(\\frac{\\pi}{2}, -1\\right)$。",
      ),
      figure: waveFigure(wave("sin", -2, 1, 0, 1)),
      generate(rng) {
        const f = rng.pick<Fn>(["sin", "cos", "tan"]);
        const a = rng.int(1, 3);
        const d = rng.int(-2, 2);
        const w = wave(f, -a, 1, 0, d);
        return graphProblem(
          rng,
          w,
          [wave(f, a, 1, 0, d), wave(f, -a, 1, 0, -d), wave(partner[f], -a, 1, 0, d), wave(f, a, 1, 0, -d), wave(f, -a - 1, 1, 0, d)],
          rng.pick(u0s),
        );
      },
    },
  ],
};

/** graphingReflectionsThreeOrMore combines a reflection with stretches and shifts. */
const graphingReflectionsThreeOrMore: TopicDef = {
  id: "graphing-reflections-of-trigonometric-functions-three-or-more-transformations",
  title: t("Graphing Reflections of Trigonometric Functions: Three or More Transformations", "三角函数图象的对称变换：三个或更多变换"),
  summary: t(
    "Combine a reflection with stretches and translations in y = a f(b(x − c)) + d with a < 0: find the extrema, the period and where the maxima occur, and match graphs.",
    "在 a < 0 的 y = a f(b(x − c)) + d 中把对称与伸缩、平移组合起来：求最值、周期与最大值点的位置，并匹配图象。",
  ),
  prerequisites: ["graphing-reflections-of-trigonometric-functions", "combining-graph-transformations-of-tangent-and-cotangent"],
  encompasses: [{ topic: "graphing-reflections-of-trigonometric-functions", weight: 0.6 }],
  xp: 18,
  standards: ["CCSS.HSF.BF.B.3", "CCSS.HSF.IF.C.7e"],
  knowledgePoints: [
    {
      id: "values-of-reflected-combined-waves",
      figure:
        waveDrawings["graphing-reflections-of-trigonometric-functions-three-or-more-transformations#values-of-reflected-combined-waves"],
      title: t("Maximum, minimum and period", "最大值、最小值与周期"),
      explanation: t(
        "In $y = a \\sin(b(x - c)) + d$ with $a < 0$ the amplitude is $|a|$, so the maximum is $d + |a|$ and the minimum is $d - |a|$; the reflection only changes *where* they occur. The period is still $\\frac{2\\pi}{b}$.\n\nFor $y = -3\\cos\\left(2\\left(x - \\frac{\\pi}{4}\\right)\\right) + 1$: maximum $1 + 3 = 4$, minimum $1 - 3 = -2$, period $\\pi$.",
        "在 $a < 0$ 的 $y = a \\sin(b(x - c)) + d$ 中，振幅为 $|a|$，所以最大值为 $d + |a|$，最小值为 $d - |a|$；对称只改变它们*出现的位置*。周期仍为 $\\frac{2\\pi}{b}$。\n\n对 $y = -3\\cos\\left(2\\left(x - \\frac{\\pi}{4}\\right)\\right) + 1$：最大值 $1 + 3 = 4$，最小值 $1 - 3 = -2$，周期 $\\pi$。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = pickQ(rng, [1, 2, 3, 4, 5, [1, 2], [3, 2]]).neg();
        const w = wave(f, a, pickQ(rng, [1, 2, 3, [1, 2], [1, 3]]), signedPick(rng, [0, [1, 6], [1, 4], [1, 3], [1, 2]]), rng.int(-5, 5));
        const kind = rng.pick(["max", "min", "period"] as const);
        if (kind === "period") return periodProblem(w);
        const D = Q.of(w.d);
        const A = amp(w);
        const max = kind === "max";
        return numberProblem({
          prompt: max
            ? t(`What is the maximum value of $y = ${waveTex(w)}$?`, `$y = ${waveTex(w)}$ 的最大值是多少？`)
            : t(`What is the minimum value of $y = ${waveTex(w)}$?`, `$y = ${waveTex(w)}$ 的最小值是多少？`),
          answer: max ? D.add(A) : D.sub(A),
          solution: t(
            `The amplitude is $|${a.toLatex()}| = ${A.toLatex()}$ and the midline is $y = ${w.d}$, so the wave runs from $${w.d} - ${A.toLatex()} = ${D.sub(A).toLatex()}$ to $${w.d} + ${A.toLatex()} = ${D.add(A).toLatex()}$. The reflection swaps where the highest and lowest points are, not their values.`,
            `振幅为 $|${a.toLatex()}| = ${A.toLatex()}$，中线为 $y = ${w.d}$，所以波形从 $${w.d} - ${A.toLatex()} = ${D.sub(A).toLatex()}$ 起伏到 $${w.d} + ${A.toLatex()} = ${D.add(A).toLatex()}$。对称交换的是最高点与最低点的位置，而不是它们的值。`,
          ),
          wrong: max ? [D.sub(A), A, D.add(Q.one), D.add(a.mul(Q.of(2)))] : [D.add(A), A.neg(), D.sub(Q.one), D.sub(A.mul(Q.of(2)))],
        });
      },
    },
    {
      id: "where-reflected-combined-waves-peak",
      title: t("Where the maxima and minima occur", "最值点的位置"),
      explanation: t(
        "With $a < 0$ the maximum of $y = a\\sin \\theta + d$ occurs where $\\sin\\theta = -1$, and the minimum where $\\sin \\theta = 1$. Let $\\theta = b(x - c)$ and solve.\n\nFor $y = -2\\sin\\left(2\\left(x + \\frac{\\pi}{6}\\right)\\right) + 3$, the maximum $5$ occurs where $2\\left(x + \\frac{\\pi}{6}\\right) = \\frac{3\\pi}{2} + 2k\\pi$, so $x = -\\frac{\\pi}{6} + \\frac{3\\pi}{4} + k\\pi = \\frac{7\\pi}{12} + k\\pi$; the smallest positive one is $\\frac{7\\pi}{12}$.",
        "当 $a < 0$ 时，$y = a\\sin \\theta + d$ 在 $\\sin\\theta = -1$ 处取得最大值，在 $\\sin \\theta = 1$ 处取得最小值。令 $\\theta = b(x - c)$ 求解。\n\n对 $y = -2\\sin\\left(2\\left(x + \\frac{\\pi}{6}\\right)\\right) + 3$，最大值 $5$ 在 $2\\left(x + \\frac{\\pi}{6}\\right) = \\frac{3\\pi}{2} + 2k\\pi$ 处取得，所以 $x = -\\frac{\\pi}{6} + \\frac{3\\pi}{4} + k\\pi = \\frac{7\\pi}{12} + k\\pi$；最小的正值是 $\\frac{7\\pi}{12}$。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = rng.int(1, 4);
        const b = pickQ(rng, [1, 2, 3, [1, 2]]);
        const c = signedPick(rng, [
          [1, 6],
          [1, 4],
          [1, 3],
          [1, 2],
        ]);
        const d = rng.int(-3, 3);
        const target = rng.pick(["max", "min"] as const);
        const unreflected = wave(f, a, b, c, d);
        return firstXProblem(wave(f, -a, b, c, d), target, false, [firstAfter(unreflected, targetFamilies(unreflected, target), Q.zero)]);
      },
    },
    {
      id: "matching-graphs-of-reflected-combined-waves",
      title: t("Matching graphs", "匹配图象"),
      explanation: t(
        "Read the midline, amplitude and period as before, then decide the sign of $a$ from the direction of the graph at a key point. The figure shows $y = -\\cos\\left(2\\left(x - \\frac{\\pi}{4}\\right)\\right) + 1$: period $\\pi$, midline $y = 1$, and a **lowest** point at $x = \\frac{\\pi}{4}$, where an unreflected cosine would have its highest point.",
        "像以前一样读出中线、振幅和周期，再根据图象在某个关键点的走向确定 $a$ 的符号。图中是 $y = -\\cos\\left(2\\left(x - \\frac{\\pi}{4}\\right)\\right) + 1$：周期 $\\pi$，中线 $y = 1$，在 $x = \\frac{\\pi}{4}$ 处是**最低**点，而未对称的余弦在那里是最高点。",
      ),
      figure: waveFigure(wave("cos", -1, 2, q(1, 4), 1)),
      generate(rng) {
        const f = rng.pick<Fn>(["sin", "cos", "tan", "sec"]);
        const a = -rng.int(1, 2);
        const b = f === "tan" ? pickQ(rng, [[1, 2], 1]) : pickQ(rng, [[1, 2], 1, 2]);
        const c = signedPick(rng, [
          [1, 4],
          [1, 2],
        ]);
        const d = rng.int(-2, 2);
        const w = wave(f, a, b, c, d);
        return graphProblem(rng, w, [
          wave(f, -a, b, c, d),
          wave(f, a, b, c.neg(), d),
          wave(f, a, b, c, d === 0 ? 1 : -d),
          wave(f, a, b.eq(Q.one) ? q(1, 2) : Q.one, c, d),
          wave(partner[f], a, b, c, d),
          wave(f, -a, b, c.neg(), d),
        ]);
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 9.29 Properties of transformed trigonometric functions
// ---------------------------------------------------------------------------

/** exactValue is f(θπ) when it is rational, for sine and cosine at multiples of π/6. */
function exactValue(f: Fn, theta: Q): Q | undefined {
  const k = theta.mul(Q.of(6));
  if (!k.isInteger()) return undefined;
  const m = Number(((k.n % 12n) + 12n) % 12n);
  const sin: Record<number, Q> = { 0: Q.zero, 1: q(1, 2), 3: Q.one, 5: q(1, 2), 6: Q.zero, 7: q(-1, 2), 9: Q.of(-1), 11: q(-1, 2) };
  const cos: Record<number, Q> = { 0: Q.one, 2: q(1, 2), 3: Q.zero, 4: q(-1, 2), 6: Q.of(-1), 8: q(-1, 2), 9: Q.zero, 10: q(1, 2) };
  return f === "sin" ? sin[m] : f === "cos" ? cos[m] : undefined;
}

/** propertiesOfTransformedSineAndCosineFunctions states the range, period, shift and values of transformed sine and cosine. */
const propertiesOfTransformedSineAndCosineFunctions: TopicDef = {
  id: "properties-of-transformed-sine-and-cosine-functions",
  title: t("Properties of Transformed Sine and Cosine Functions", "变换后正弦与余弦函数的性质"),
  summary: t(
    "State the range, period and horizontal shift of y = a sin(bx + φ) + d and y = a cos(bx + φ) + d for any sign of a, and evaluate them at special angles.",
    "对任意符号的 a，写出 y = a sin(bx + φ) + d 与 y = a cos(bx + φ) + d 的值域、周期和水平平移，并求它们在特殊角处的值。",
  ),
  prerequisites: [
    "graphing-reflections-of-trigonometric-functions-three-or-more-transformations",
    "the-domain-and-range-of-transformed-functions",
  ],
  encompasses: [
    { topic: "graphing-reflections-of-trigonometric-functions-three-or-more-transformations", weight: 0.3 },
    { topic: "combining-graph-transformations-of-sine-and-cosine", weight: 0.4 },
    { topic: "the-domain-and-range-of-transformed-functions", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSF.IF.C.7e", "CCSS.HSF.TF.B.5"],
  knowledgePoints: [
    {
      id: "range-of-transformed-sine-and-cosine",
      title: t("The range", "值域"),
      explanation: t(
        "The domain of $y = a \\sin(bx + \\varphi) + d$ is all real numbers. Its values run from the midline $d$ down and up by the amplitude $|a|$, whatever the sign of $a$, so its range is\n\n$$[d - |a|, d + |a|].$$\n\nFor $y = -4\\cos\\left(\\frac{1}{2}x + \\frac{\\pi}{3}\\right) + 1$: $[1 - 4, 1 + 4] = [-3, 5]$. The numbers $b$ and $\\varphi$ do not affect the range.",
        "$y = a \\sin(bx + \\varphi) + d$ 的定义域是全体实数。无论 $a$ 的符号如何，它的值都从中线 $d$ 向下、向上各变化振幅 $|a|$，所以值域是\n\n$$[d - |a|, d + |a|].$$\n\n对 $y = -4\\cos\\left(\\frac{1}{2}x + \\frac{\\pi}{3}\\right) + 1$：$[1 - 4, 1 + 4] = [-3, 5]$。$b$ 与 $\\varphi$ 不影响值域。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = pickQ(rng, [2, 3, 4, 5, 6, [1, 2], [3, 2]]);
        const sa = rng.bool() ? a : a.neg();
        const d = rng.nonZero(-6, 6);
        const w = wave(f, sa, pickQ(rng, [2, 3, 4, [1, 2], [1, 3]]), signedPick(rng, [0, [1, 6], [1, 4], [1, 3]]), d);
        const D = Q.of(d);
        return intervalProblem({
          prompt: t(
            `What is the range of $y = ${waveTex(w, true)}$? Write it in interval notation.`,
            `$y = ${waveTex(w, true)}$ 的值域是什么？用区间表示。`,
          ),
          set: box(d, a),
          solution: t(
            `The amplitude is $|${sa.toLatex()}| = ${a.toLatex()}$ and the midline is $y = ${d}$, so the values run from $${d} - ${a.toLatex()} = ${D.sub(a).toLatex()}$ to $${d} + ${a.toLatex()} = ${D.add(a).toLatex()}$: the range is $[${D.sub(a).toLatex()}, ${D.add(a).toLatex()}]$.`,
            `振幅为 $|${sa.toLatex()}| = ${a.toLatex()}$，中线为 $y = ${d}$，所以函数值从 $${d} - ${a.toLatex()} = ${D.sub(a).toLatex()}$ 变到 $${d} + ${a.toLatex()} = ${D.add(a).toLatex()}$：值域是 $[${D.sub(a).toLatex()}, ${D.add(a).toLatex()}]$。`,
          ),
          wrong: [box(0, a), box(d, Q.one), box(d, a.mul(Q.of(2))), box(-d, a)],
        });
      },
    },
    {
      id: "period-and-shift-of-transformed-sine-and-cosine",
      title: t("Period and horizontal shift", "周期与水平平移"),
      explanation: t(
        "For $y = a \\sin(bx + \\varphi) + d$ with $b > 0$, the period is $\\frac{2\\pi}{b}$, and factoring $b$ out of the input, $bx + \\varphi = b\\left(x + \\frac{\\varphi}{b}\\right)$, shows the horizontal shift: left $\\frac{\\varphi}{b}$ when $\\varphi > 0$, right $\\frac{|\\varphi|}{b}$ when $\\varphi < 0$. This shift is often called the **phase shift**.\n\nFor $y = 5\\sin\\left(\\frac{1}{2}x - \\frac{\\pi}{4}\\right)$: period $4\\pi$, and $\\frac{1}{2}x - \\frac{\\pi}{4} = \\frac{1}{2}\\left(x - \\frac{\\pi}{2}\\right)$, a phase shift right $\\frac{\\pi}{2}$.",
        "对 $b > 0$ 的 $y = a \\sin(bx + \\varphi) + d$，周期是 $\\frac{2\\pi}{b}$；把 $b$ 从输入中提出，$bx + \\varphi = b\\left(x + \\frac{\\varphi}{b}\\right)$，就得到水平平移：$\\varphi > 0$ 时向左 $\\frac{\\varphi}{b}$，$\\varphi < 0$ 时向右 $\\frac{|\\varphi|}{b}$。这个平移常称为**相移**。\n\n对 $y = 5\\sin\\left(\\frac{1}{2}x - \\frac{\\pi}{4}\\right)$：周期 $4\\pi$，且 $\\frac{1}{2}x - \\frac{\\pi}{4} = \\frac{1}{2}\\left(x - \\frac{\\pi}{2}\\right)$，相移为向右 $\\frac{\\pi}{2}$。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const b = pickQ(rng, [2, 3, 4, [1, 2], [1, 3], [2, 3], [3, 2]]);
        const c = signedPick(rng, [
          [1, 6],
          [1, 4],
          [1, 3],
          [1, 2],
          [2, 3],
        ]);
        const w = wave(f, rng.nonZero(-4, 4), b, c, rng.int(-3, 3));
        if (rng.bool()) return periodProblem(w, true);
        const phi = b.mul(c).abs();
        const op = c.sign() > 0 ? "-" : "+";
        return oneOf(
          rng,
          t(
            `What is the phase shift of the graph of $y = ${waveTex(w, true)}$ relative to $y = ${waveTex(wave(f, w.a, b, 0, w.d))}$?`,
            `$y = ${waveTex(w, true)}$ 的图象相对于 $y = ${waveTex(wave(f, w.a, b, 0, w.d))}$ 的相移是什么？`,
          ),
          horizontal(c),
          [horizontalOpposite(c), horizontal(c.mul(b)), horizontalOpposite(c.mul(b))],
          both(
            `Factor $${b.toLatex()}$ out of the input:`,
            `把 $${b.toLatex()}$ 从输入中提出：`,
            `${bxTex(b)} ${op} ${piTex(phi)} = ${b.toLatex()}\\left(x ${op} ${piTex(c.abs())}\\right)`,
          ),
        );
      },
    },
    {
      id: "evaluating-transformed-sine-and-cosine",
      figure: waveDrawings["properties-of-transformed-sine-and-cosine-functions#evaluating-transformed-sine-and-cosine"],
      title: t("Evaluating at special angles", "在特殊角处求值"),
      explanation: t(
        "To evaluate a transformed wave, work from the inside out: compute the input angle, take its sine or cosine from the unit circle, multiply by $a$, then add $d$. For $f(x) = 4\\cos\\left(2x - \\frac{\\pi}{3}\\right) + 1$ at $x = \\frac{\\pi}{2}$:\n\n$$2 \\cdot \\frac{\\pi}{2} - \\frac{\\pi}{3} = \\frac{2\\pi}{3}, \\quad \\cos\\frac{2\\pi}{3} = -\\frac{1}{2}, \\quad f\\left(\\frac{\\pi}{2}\\right) = 4 \\cdot \\left(-\\frac{1}{2}\\right) + 1 = -1.$$",
        "求变换后波形的值，由内向外计算：先算输入角，再由单位圆取它的正弦或余弦，乘以 $a$，最后加 $d$。对 $f(x) = 4\\cos\\left(2x - \\frac{\\pi}{3}\\right) + 1$ 在 $x = \\frac{\\pi}{2}$ 处：\n\n$$2 \\cdot \\frac{\\pi}{2} - \\frac{\\pi}{3} = \\frac{2\\pi}{3}, \\quad \\cos\\frac{2\\pi}{3} = -\\frac{1}{2}, \\quad f\\left(\\frac{\\pi}{2}\\right) = 4 \\cdot \\left(-\\frac{1}{2}\\right) + 1 = -1.$$",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const g = partner[f];
        const a = rng.pick([2, 4, 6, -2, -4, 3, -3]);
        const b = pickQ(rng, [1, 2, 3, [1, 2]]);
        const c = signedPick(rng, [
          [1, 6],
          [1, 4],
          [1, 3],
          [1, 2],
        ]);
        const d = rng.int(-4, 4);
        const w = wave(f, a, b, c, d);
        const goodThetas = f === "sin" ? [0, 1, 3, 5, 6, 7, 9, 11].map((k) => q(k, 6)) : [0, 2, 3, 4, 6, 8, 9, 10].map((k) => q(k, 6));
        const theta = rng.pick(goodThetas);
        const x = xOf(w, theta);
        const F = exactValue(f, theta)!;
        const A = Q.of(a);
        const D = Q.of(d);
        const value = A.mul(F).add(D);
        const noShift = exactValue(f, b.mul(x));
        const other = exactValue(g, theta);
        const X = piTex(x);
        return numberProblem({
          prompt: t(
            `Let $f(x) = ${waveTex(w, true)}$. Find the exact value of $f\\left(${X}\\right)$.`,
            `设 $f(x) = ${waveTex(w, true)}$。求 $f\\left(${X}\\right)$ 的精确值。`,
          ),
          answer: value,
          solution: both(
            "Work from the inside out:",
            "由内向外计算：",
            `${bxTex(b).replace("x", "")}${b.eq(Q.one) ? "" : " \\cdot "}${b.eq(Q.one) ? X : `\\left(${X}\\right)`} ${c.sign() > 0 ? "-" : "+"} ${piTex(b.mul(c).abs())} = ${piTex(theta)}`,
            `\\${f} ${piTex(theta)} = ${F.toLatex()}`,
            `f\\left(${X}\\right) = ${a} \\cdot ${F.sign() < 0 ? `\\left(${F.toLatex()}\\right)` : F.toLatex()}${signed(d)} = ${value.toLatex()}`,
          ),
          wrong: [
            F.add(D),
            A.mul(F),
            A.neg().mul(F).add(D),
            ...(noShift ? [A.mul(noShift).add(D)] : []),
            ...(other ? [A.mul(other).add(D)] : []),
          ],
        });
      },
    },
  ],
};

/** findingZerosAndExtremaOfTransformedSineAndCosineFunctions locates the extrema and zeros of transformed waves. */
const findingZerosAndExtremaOfTransformedSineAndCosineFunctions: TopicDef = {
  id: "finding-zeros-and-extrema-of-transformed-sine-and-cosine-functions",
  title: t("Finding Zeros and Extrema of Transformed Sine and Cosine Functions", "求变换后正弦与余弦函数的零点与最值"),
  summary: t(
    "Find where y = a sin(bx + φ) + d reaches its maximum and minimum, and find its zeros when sin θ or cos θ must equal 0 or ±1/2.",
    "求 y = a sin(bx + φ) + d 取得最大值和最小值的位置，并在 sin θ 或 cos θ 须等于 0 或 ±1/2 时求它的零点。",
  ),
  prerequisites: ["properties-of-transformed-sine-and-cosine-functions"],
  encompasses: [
    { topic: "properties-of-transformed-sine-and-cosine-functions", weight: 0.4 },
    { topic: "graphing-reflections-of-trigonometric-functions-three-or-more-transformations", weight: 0.3 },
  ],
  xp: 18,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSF.TF.B.7"],
  knowledgePoints: [
    {
      id: "locating-the-extrema",
      figure: waveDrawings["finding-zeros-and-extrema-of-transformed-sine-and-cosine-functions#locating-the-extrema"],
      title: t("Locating the extrema", "确定最值点"),
      explanation: t(
        "Let $\\theta$ be the input of $y = a \\sin\\theta + d$. The maximum $d + |a|$ occurs where $\\sin \\theta = 1$ if $a > 0$, or $\\sin\\theta = -1$ if $a < 0$; the minimum at the other one. Write $\\theta$ as a family of angles and solve for $x$.\n\nFor $y = 2\\cos\\left(3x - \\frac{\\pi}{2}\\right)$, the maximum occurs where $3x - \\frac{\\pi}{2} = 2k\\pi$, so $x = \\frac{\\pi}{6} + \\frac{2k\\pi}{3}$; the smallest positive one is $\\frac{\\pi}{6}$.",
        "设 $\\theta$ 为 $y = a \\sin\\theta + d$ 的输入。若 $a > 0$，最大值 $d + |a|$ 在 $\\sin \\theta = 1$ 处取得；若 $a < 0$，则在 $\\sin\\theta = -1$ 处取得；最小值在另一处。把 $\\theta$ 写成一族角，再解出 $x$。\n\n对 $y = 2\\cos\\left(3x - \\frac{\\pi}{2}\\right)$，最大值在 $3x - \\frac{\\pi}{2} = 2k\\pi$ 处取得，所以 $x = \\frac{\\pi}{6} + \\frac{2k\\pi}{3}$；最小的正值是 $\\frac{\\pi}{6}$。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = rng.nonZero(-5, 5);
        const b = pickQ(rng, [2, 3, 4, [1, 2], [1, 3]]);
        const c = signedPick(rng, [
          [1, 6],
          [1, 4],
          [1, 3],
          [1, 2],
          [1, 12],
        ]);
        return firstXProblem(wave(f, a, b, c, rng.int(-4, 4)), rng.pick(["max", "min"] as const), true);
      },
    },
    {
      id: "zeros-on-the-midline",
      title: t("Zeros when the midline is the x-axis", "中线为 x 轴时的零点"),
      explanation: t(
        "When $d = 0$, the zeros of $y = a\\sin\\theta$ are where $\\sin\\theta = 0$, $\\theta = k\\pi$; those of $y = a \\cos\\theta$ where $\\theta = \\frac{\\pi}{2} + k\\pi$. Zeros come twice per period, half a period apart.\n\nFor $y = 3\\sin\\left(2x + \\frac{\\pi}{3}\\right)$: $2x + \\frac{\\pi}{3} = k\\pi$ gives $x = -\\frac{\\pi}{6} + \\frac{k\\pi}{2}$, so the smallest positive zero is $\\frac{\\pi}{3}$.",
        "当 $d = 0$ 时，$y = a\\sin\\theta$ 的零点在 $\\sin\\theta = 0$，即 $\\theta = k\\pi$ 处；$y = a \\cos\\theta$ 的零点在 $\\theta = \\frac{\\pi}{2} + k\\pi$ 处。每个周期有两个零点，相距半个周期。\n\n对 $y = 3\\sin\\left(2x + \\frac{\\pi}{3}\\right)$：由 $2x + \\frac{\\pi}{3} = k\\pi$ 得 $x = -\\frac{\\pi}{6} + \\frac{k\\pi}{2}$，所以最小的正零点是 $\\frac{\\pi}{3}$。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = rng.nonZero(-5, 5);
        const b = pickQ(rng, [1, 2, 3, 4, [1, 2], [1, 3]]);
        const c = signedPick(rng, [
          [1, 6],
          [1, 4],
          [1, 3],
          [1, 2],
          [2, 3],
        ]);
        return firstXProblem(wave(f, a, b, c), "zero", rng.bool());
      },
    },
    {
      id: "zeros-off-the-midline",
      figure: waveDrawings["finding-zeros-and-extrema-of-transformed-sine-and-cosine-functions#zeros-off-the-midline"],
      title: t("Zeros when the midline is shifted", "中线平移后的零点"),
      explanation: t(
        "When $d \\ne 0$, solve $a \\sin\\theta + d = 0$ for $\\sin\\theta = -\\frac{d}{a}$ first. If this is $\\pm\\frac{1}{2}$, there are two families of angles per turn: $\\sin \\theta = \\frac{1}{2}$ at $\\theta = \\frac{\\pi}{6} + 2k\\pi$ and $\\theta = \\frac{5\\pi}{6} + 2k\\pi$, and $\\cos\\theta = \\frac{1}{2}$ at $\\theta = \\frac{\\pi}{3} + 2k\\pi$ and $\\theta = \\frac{5\\pi}{3} + 2k\\pi$. Solve each for $x$ and compare.\n\nFor $y = 4\\cos 2x + 2$: $\\cos 2x = -\\frac{1}{2}$, so $2x = \\frac{2\\pi}{3} + 2k\\pi$ or $2x = \\frac{4\\pi}{3} + 2k\\pi$, giving $x = \\frac{\\pi}{3} + k\\pi$ or $x = \\frac{2\\pi}{3} + k\\pi$. The smallest positive zero is $\\frac{\\pi}{3}$.",
        "当 $d \\ne 0$ 时，先由 $a \\sin\\theta + d = 0$ 解出 $\\sin\\theta = -\\frac{d}{a}$。若它等于 $\\pm\\frac{1}{2}$，则每转一圈有两族角：$\\sin \\theta = \\frac{1}{2}$ 在 $\\theta = \\frac{\\pi}{6} + 2k\\pi$ 与 $\\theta = \\frac{5\\pi}{6} + 2k\\pi$；$\\cos\\theta = \\frac{1}{2}$ 在 $\\theta = \\frac{\\pi}{3} + 2k\\pi$ 与 $\\theta = \\frac{5\\pi}{3} + 2k\\pi$。分别解出 $x$ 再比较。\n\n对 $y = 4\\cos 2x + 2$：$\\cos 2x = -\\frac{1}{2}$，所以 $2x = \\frac{2\\pi}{3} + 2k\\pi$ 或 $2x = \\frac{4\\pi}{3} + 2k\\pi$，得 $x = \\frac{\\pi}{3} + k\\pi$ 或 $x = \\frac{2\\pi}{3} + k\\pi$。最小的正零点是 $\\frac{\\pi}{3}$。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = rng.pick([2, 4, 6, -2, -4, -6]);
        const d = (rng.sign() * Math.abs(a)) / 2;
        const b = pickQ(rng, [1, 2, 3, [1, 2]]);
        const c = signedPick(rng, [0, [1, 6], [1, 4], [1, 3], [1, 2]]);
        return firstXProblem(wave(f, a, b, c, d), "zero", rng.bool());
      },
    },
  ],
};

/** propertiesOfTransformedTangentAndCotangentFunctions finds the period, asymptotes and zeros of transformed tangent and cotangent. */
const propertiesOfTransformedTangentAndCotangentFunctions: TopicDef = {
  id: "properties-of-transformed-tangent-and-cotangent-functions",
  title: t("Properties of Transformed Tangent and Cotangent Functions", "变换后正切与余切函数的性质"),
  summary: t(
    "Find the period, the vertical asymptotes and the zeros of y = a tan(bx + φ) + d and y = a cot(bx + φ) + d.",
    "求 y = a tan(bx + φ) + d 与 y = a cot(bx + φ) + d 的周期、竖直渐近线和零点。",
  ),
  prerequisites: ["properties-of-transformed-sine-and-cosine-functions"],
  encompasses: [{ topic: "combining-graph-transformations-of-tangent-and-cotangent", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSF.IF.C.7e"],
  knowledgePoints: [
    {
      id: "period-of-transformed-tangent-and-cotangent",
      figure: waveDrawings["properties-of-transformed-tangent-and-cotangent-functions#period-of-transformed-tangent-and-cotangent"],
      title: t("The period", "周期"),
      explanation: t(
        "The domain of $y = a\\tan(bx + \\varphi) + d$ is all real numbers except the asymptotes, and its range is all real numbers. Its period is $\\frac{\\pi}{b}$, whatever $a$, $\\varphi$ and $d$ are. For $y = -2\\cot\\left(4x - \\frac{\\pi}{3}\\right) + 5$ the period is $\\frac{\\pi}{4}$.",
        "$y = a\\tan(bx + \\varphi) + d$ 的定义域是除渐近线以外的全体实数，值域是全体实数。无论 $a$、$\\varphi$、$d$ 是多少，它的周期都是 $\\frac{\\pi}{b}$。$y = -2\\cot\\left(4x - \\frac{\\pi}{3}\\right) + 5$ 的周期是 $\\frac{\\pi}{4}$。",
      ),
      generate(rng) {
        const f = rng.pick(tanCot);
        const w = wave(
          f,
          rng.nonZero(-4, 4),
          pickQ(rng, [2, 3, 4, 5, [1, 2], [1, 3], [2, 3], [3, 2]]),
          signedPick(rng, [
            [1, 6],
            [1, 4],
            [1, 3],
            [1, 2],
          ]),
          rng.int(-4, 4),
        );
        return periodProblem(w, true);
      },
    },
    {
      id: "asymptotes-of-transformed-tangent-and-cotangent",
      figure: waveDrawings["properties-of-transformed-tangent-and-cotangent-functions#asymptotes-of-transformed-tangent-and-cotangent"],
      title: t("Vertical asymptotes", "竖直渐近线"),
      explanation: t(
        "Set the input equal to the angles where the function is undefined: $bx + \\varphi = \\frac{\\pi}{2} + k\\pi$ for tangent, $bx + \\varphi = k\\pi$ for cotangent, and solve for $x$.\n\nFor $y = \\cot\\left(2x + \\frac{\\pi}{2}\\right)$: $2x + \\frac{\\pi}{2} = k\\pi$ gives $x = -\\frac{\\pi}{4} + \\frac{k\\pi}{2}$, so the smallest positive asymptote is $x = \\frac{\\pi}{4}$.",
        "令输入等于函数无定义的角：正切为 $bx + \\varphi = \\frac{\\pi}{2} + k\\pi$，余切为 $bx + \\varphi = k\\pi$，再解出 $x$。\n\n对 $y = \\cot\\left(2x + \\frac{\\pi}{2}\\right)$：由 $2x + \\frac{\\pi}{2} = k\\pi$ 得 $x = -\\frac{\\pi}{4} + \\frac{k\\pi}{2}$，所以最小的正渐近线是 $x = \\frac{\\pi}{4}$。",
      ),
      generate(rng) {
        const f = rng.pick(tanCot);
        const w = wave(
          f,
          rng.nonZero(-3, 3),
          pickQ(rng, [2, 3, 4, [1, 2], [1, 3]]),
          signedPick(rng, [
            [1, 6],
            [1, 4],
            [1, 3],
            [1, 2],
            [1, 12],
          ]),
          rng.int(-3, 3),
        );
        return firstXProblem(w, "asymptote", true);
      },
    },
    {
      id: "zeros-of-transformed-tangent-and-cotangent",
      figure: waveDrawings["properties-of-transformed-tangent-and-cotangent-functions#zeros-of-transformed-tangent-and-cotangent"],
      title: t("Zeros", "零点"),
      explanation: t(
        "Solve $a\\tan\\theta + d = 0$ for $\\tan\\theta = -\\frac{d}{a}$. Tangent takes each value once per period: $\\tan\\theta = 0$ at $\\theta = k\\pi$, $\\tan\\theta = 1$ at $\\theta = \\frac{\\pi}{4} + k\\pi$ and $\\tan\\theta = -1$ at $\\theta = \\frac{3\\pi}{4} + k\\pi$; cotangent is $0$ at $\\theta = \\frac{\\pi}{2} + k\\pi$ and $\\pm 1$ at the same angles as tangent.\n\nFor $y = 2\\tan\\left(x - \\frac{\\pi}{3}\\right) - 2$: $\\tan\\left(x - \\frac{\\pi}{3}\\right) = 1$, so $x - \\frac{\\pi}{3} = \\frac{\\pi}{4} + k\\pi$ and $x = \\frac{7\\pi}{12} + k\\pi$; the smallest positive zero is $\\frac{7\\pi}{12}$.",
        "由 $a\\tan\\theta + d = 0$ 解出 $\\tan\\theta = -\\frac{d}{a}$。正切在每个周期内取每个值一次：$\\tan\\theta = 0$ 在 $\\theta = k\\pi$，$\\tan\\theta = 1$ 在 $\\theta = \\frac{\\pi}{4} + k\\pi$，$\\tan\\theta = -1$ 在 $\\theta = \\frac{3\\pi}{4} + k\\pi$；余切在 $\\theta = \\frac{\\pi}{2} + k\\pi$ 处为 $0$，取 $\\pm 1$ 的角与正切相同。\n\n对 $y = 2\\tan\\left(x - \\frac{\\pi}{3}\\right) - 2$：$\\tan\\left(x - \\frac{\\pi}{3}\\right) = 1$，所以 $x - \\frac{\\pi}{3} = \\frac{\\pi}{4} + k\\pi$，$x = \\frac{7\\pi}{12} + k\\pi$；最小的正零点是 $\\frac{7\\pi}{12}$。",
      ),
      generate(rng) {
        const f = rng.pick(tanCot);
        const a = rng.nonZero(-4, 4);
        const d = rng.pick([0, a, -a]);
        const w = wave(
          f,
          a,
          pickQ(rng, [1, 2, 3, [1, 2]]),
          signedPick(rng, [
            [1, 6],
            [1, 4],
            [1, 3],
            [1, 2],
          ]),
          d,
        );
        return firstXProblem(w, "zero", rng.bool());
      },
    },
  ],
};

/** propertiesOfTransformedSecantAndCosecantFunctions finds the range, asymptotes and local extrema of transformed secant and cosecant. */
const propertiesOfTransformedSecantAndCosecantFunctions: TopicDef = {
  id: "properties-of-transformed-secant-and-cosecant-functions",
  title: t("Properties of Transformed Secant and Cosecant Functions", "变换后正割与余割函数的性质"),
  summary: t(
    "Find the range, the vertical asymptotes and the local extrema of y = a sec(bx + φ) + d and y = a csc(bx + φ) + d for any sign of a.",
    "对任意符号的 a，求 y = a sec(bx + φ) + d 与 y = a csc(bx + φ) + d 的值域、竖直渐近线和局部极值。",
  ),
  prerequisites: ["properties-of-transformed-sine-and-cosine-functions"],
  encompasses: [{ topic: "combining-graph-transformations-of-secant-and-cosecant", weight: 0.4 }],
  xp: 16,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSF.IF.C.7e"],
  knowledgePoints: [
    {
      id: "range-of-transformed-secant-and-cosecant",
      title: t("The range", "值域"),
      explanation: t(
        "Whatever the sign of $a$, the values of $a\\sec\\theta$ are at most $-|a|$ or at least $|a|$, so the range of $y = a\\sec(bx + \\varphi) + d$ is\n\n$$(-\\infty, d - |a|] \\cup [d + |a|, \\infty).$$\n\nFor $y = -3\\csc\\left(2x + \\frac{\\pi}{4}\\right) + 1$: $(-\\infty, -2] \\cup [4, \\infty)$.",
        "无论 $a$ 的符号如何，$a\\sec\\theta$ 的值都不大于 $-|a|$ 或不小于 $|a|$，所以 $y = a\\sec(bx + \\varphi) + d$ 的值域是\n\n$$(-\\infty, d - |a|] \\cup [d + |a|, \\infty).$$\n\n对 $y = -3\\csc\\left(2x + \\frac{\\pi}{4}\\right) + 1$：$(-\\infty, -2] \\cup [4, \\infty)$。",
      ),
      generate(rng) {
        const f = rng.pick(secCsc);
        const a = pickQ(rng, [1, 2, 3, 4, 5, [1, 2]]);
        const sa = rng.bool() ? a : a.neg();
        const d = rng.int(-5, 5);
        const w = wave(f, sa, pickQ(rng, [2, 3, [1, 2]]), signedPick(rng, [0, [1, 6], [1, 4], [1, 3]]), d);
        const D = Q.of(d);
        return intervalProblem({
          prompt: t(
            `What is the range of $y = ${waveTex(w, true)}$? Write it in interval notation.`,
            `$y = ${waveTex(w, true)}$ 的值域是什么？用区间表示。`,
          ),
          set: outside(d, a),
          solution: both(
            `The values of $${sa.toLatex()}\\${f} \\theta$ are at most $-${a.toLatex()}$ or at least $${a.toLatex()}$. Adding $${d}$:`,
            `$${sa.toLatex()}\\${f} \\theta$ 的值不大于 $-${a.toLatex()}$ 或不小于 $${a.toLatex()}$。加上 $${d}$：`,
            `(-\\infty, ${D.sub(a).toLatex()}] \\cup [${D.add(a).toLatex()}, \\infty)`,
          ),
          wrong: [box(d, a), outside(0, a), outside(d, Q.one), outside(-d, a)],
        });
      },
    },
    {
      id: "asymptotes-of-transformed-secant-and-cosecant",
      figure: waveDrawings["properties-of-transformed-secant-and-cosecant-functions#asymptotes-of-transformed-secant-and-cosecant"],
      title: t("Vertical asymptotes", "竖直渐近线"),
      explanation: t(
        "Secant is undefined where cosine is $0$, and cosecant where sine is $0$. Set the input $bx + \\varphi$ equal to $\\frac{\\pi}{2} + k\\pi$ (secant) or $k\\pi$ (cosecant) and solve for $x$.\n\nFor $y = 2\\sec\\left(3x - \\frac{\\pi}{4}\\right)$: $3x - \\frac{\\pi}{4} = \\frac{\\pi}{2} + k\\pi$ gives $x = \\frac{\\pi}{4} + \\frac{k\\pi}{3}$, so the smallest positive asymptote is $x = \\frac{\\pi}{4}$.",
        "正割在余弦为 $0$ 处无定义，余割在正弦为 $0$ 处无定义。令输入 $bx + \\varphi$ 等于 $\\frac{\\pi}{2} + k\\pi$（正割）或 $k\\pi$（余割），再解出 $x$。\n\n对 $y = 2\\sec\\left(3x - \\frac{\\pi}{4}\\right)$：由 $3x - \\frac{\\pi}{4} = \\frac{\\pi}{2} + k\\pi$ 得 $x = \\frac{\\pi}{4} + \\frac{k\\pi}{3}$，所以最小的正渐近线是 $x = \\frac{\\pi}{4}$。",
      ),
      generate(rng) {
        const f = rng.pick(secCsc);
        const w = wave(
          f,
          rng.nonZero(-3, 3),
          pickQ(rng, [2, 3, 4, [1, 2], [1, 3]]),
          signedPick(rng, [
            [1, 6],
            [1, 4],
            [1, 3],
            [1, 2],
            [1, 12],
          ]),
          rng.int(-3, 3),
        );
        return firstXProblem(w, "asymptote", true);
      },
    },
    {
      id: "local-extrema-of-transformed-secant-and-cosecant",
      title: t("Local extrema", "局部极值"),
      explanation: t(
        "Each U-shaped branch has one turning point. The branches opening up have **local minima** $d + |a|$, and those opening down have **local maxima** $d - |a|$: the local maxima are below the local minima. They occur where the cosine (for secant) or sine (for cosecant) of the input is $\\pm 1$; when $a > 0$ the local minima are where it is $1$, and when $a < 0$ where it is $-1$.\n\nFor $y = -\\sec 2x + 3$: local minimum $4$ where $\\cos 2x = -1$, $x = \\frac{\\pi}{2} + k\\pi$; local maximum $2$ where $\\cos 2x = 1$, $x = k\\pi$.",
        "每个 U 形分支有一个转折点。开口向上的分支有**局部极小值** $d + |a|$，开口向下的分支有**局部极大值** $d - |a|$：局部极大值比局部极小值小。它们出现在输入的余弦（正割）或正弦（余割）为 $\\pm 1$ 处；$a > 0$ 时局部极小值在其为 $1$ 处，$a < 0$ 时在其为 $-1$ 处。\n\n对 $y = -\\sec 2x + 3$：局部极小值 $4$ 在 $\\cos 2x = -1$ 处，即 $x = \\frac{\\pi}{2} + k\\pi$；局部极大值 $2$ 在 $\\cos 2x = 1$ 处，即 $x = k\\pi$。",
      ),
      generate(rng) {
        const f = rng.pick(secCsc);
        const a = rng.nonZero(-4, 4);
        const d = rng.int(-4, 4);
        const b = pickQ(rng, [1, 2, 3, [1, 2]]);
        const c = signedPick(rng, [0, [1, 6], [1, 4], [1, 3], [1, 2]]);
        const w = wave(f, a, b, c, d);
        const kind = rng.pick(["minValue", "maxValue", "localMin", "localMax"] as const);
        if (kind === "localMin" || kind === "localMax") {
          const flipped = wave(f, -a, b, c, d);
          return firstXProblem(w, kind, true, [firstAfter(flipped, targetFamilies(flipped, kind), Q.zero)]);
        }
        const A = Math.abs(a);
        const min = kind === "minValue";
        return numberProblem({
          prompt: min
            ? t(
                `What is the value of each local minimum of $y = ${waveTex(w, true)}$?`,
                `$y = ${waveTex(w, true)}$ 的每个局部极小值是多少？`,
              )
            : t(
                `What is the value of each local maximum of $y = ${waveTex(w, true)}$?`,
                `$y = ${waveTex(w, true)}$ 的每个局部极大值是多少？`,
              ),
          answer: min ? d + A : d - A,
          solution: t(
            `The branches opening up have their lowest points at $y = ${d} + ${A} = ${d + A}$, the local minima; the branches opening down have their highest points at $y = ${d} - ${A} = ${d - A}$, the local maxima.`,
            `开口向上的分支的最低点在 $y = ${d} + ${A} = ${d + A}$，即局部极小值；开口向下的分支的最高点在 $y = ${d} - ${A} = ${d - A}$，即局部极大值。`,
          ),
          wrong: min ? [d - A, A, d + a === d + A ? d - a - 1 : d + a, d + 1] : [d + A, -A, d + a === d - A ? d - a + 1 : d + a, d - 1],
        });
      },
    },
  ],
};

// --- Models -------------------------------------------------------------------

/** Model is a periodic situation described by a transformed sine or cosine. */
interface Model {
  /** intro introduces the situation and the formula. */
  readonly intro: Text;
  readonly max: number;
  readonly min: number;
  /** what names the quantity: "height", "temperature". */
  readonly what: Text;
  readonly unit?: string;
}

/** ferrisWheel models the height h(t) = C − r cos(πt/n) of a rider who boards at the bottom. */
function ferrisWheel(r: number, C: number, n: number): Model {
  const b = piTex(q(1, n)).replace("\\pi", "\\pi t");
  return {
    intro: t(
      `The height in meters of a rider on a Ferris wheel $t$ minutes after boarding is $h(t) = ${C} - ${r}\\cos\\left(${b}\\right)$.`,
      `摩天轮上一名乘客登上后 $t$ 分钟时的高度（米）为 $h(t) = ${C} - ${r}\\cos\\left(${b}\\right)$。`,
    ),
    max: C + r,
    min: C - r,
    what: t("height", "高度"),
    unit: "m",
  };
}

/** interpretingTrigonometricModels reads the meaning of the parameters of periodic models. */
const interpretingTrigonometricModels: TopicDef = {
  id: "interpreting-trigonometric-models",
  title: t("Interpreting Trigonometric Models", "解读三角函数模型"),
  summary: t(
    "Read the maximum, minimum, period and the times of the peaks of trigonometric models of Ferris wheels, tides and daily temperatures.",
    "从摩天轮、潮汐和日气温的三角函数模型中读出最大值、最小值、周期和达到峰值的时刻。",
  ),
  prerequisites: ["finding-zeros-and-extrema-of-transformed-sine-and-cosine-functions"],
  encompasses: [
    { topic: "finding-zeros-and-extrema-of-transformed-sine-and-cosine-functions", weight: 0.4 },
    { topic: "properties-of-transformed-sine-and-cosine-functions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.TF.B.5", "CCSS.HSF.IF.B.4"],
  knowledgePoints: [
    {
      id: "maximum-and-minimum-in-context",
      title: t("Maximum and minimum in context", "实际情境中的最大值与最小值"),
      explanation: t(
        "In a model $y = a\\cos(b(t - c)) + d$ the midline $d$ is the average value of the quantity and the amplitude $|a|$ is how far it swings above and below it. So the greatest value is $d + |a|$ and the least is $d - |a|$.\n\nIf the depth of water in a harbor is $D(t) = 5 + 3\\cos\\left(\\frac{\\pi}{6}(t - 2)\\right)$ meters, the depth at high tide is $5 + 3 = 8$ meters and at low tide $5 - 3 = 2$ meters.",
        "在模型 $y = a\\cos(b(t - c)) + d$ 中，中线 $d$ 是该量的平均值，振幅 $|a|$ 是它在平均值上下摆动的幅度。所以最大值是 $d + |a|$，最小值是 $d - |a|$。\n\n若港口的水深为 $D(t) = 5 + 3\\cos\\left(\\frac{\\pi}{6}(t - 2)\\right)$ 米，则涨潮时水深 $5 + 3 = 8$ 米，落潮时 $5 - 3 = 2$ 米。",
      ),
      generate(rng) {
        const kind = rng.pick(["wheel", "tide", "temperature"] as const);
        const high = rng.bool();
        let m: Model;
        let ask: Text;
        if (kind === "wheel") {
          const r = rng.int(5, 30);
          m = ferrisWheel(r, r + rng.int(1, 5), rng.int(2, 12));
          ask = high
            ? t("What is the greatest height of the rider?", "乘客的最大高度是多少？")
            : t("What is the least height of the rider?", "乘客的最小高度是多少？");
        } else if (kind === "tide") {
          const A = rng.int(1, 4);
          const M = A + rng.int(1, 6);
          const n = rng.int(5, 7);
          const c = rng.int(1, 5);
          m = {
            intro: t(
              `The depth in meters of the water in a harbor $t$ hours after midnight is $D(t) = ${M} + ${A}\\cos\\left(\\frac{\\pi}{${n}}(t - ${c})\\right)$.`,
              `某港口午夜后 $t$ 小时的水深（米）为 $D(t) = ${M} + ${A}\\cos\\left(\\frac{\\pi}{${n}}(t - ${c})\\right)$。`,
            ),
            max: M + A,
            min: M - A,
            what: t("depth", "水深"),
            unit: "m",
          };
          ask = high
            ? t("What is the depth of the water at high tide?", "涨潮时水深是多少？")
            : t("What is the depth of the water at low tide?", "落潮时水深是多少？");
        } else {
          const A = rng.int(3, 10);
          const M = rng.int(8, 25);
          const c = rng.int(7, 11);
          m = {
            intro: t(
              `The temperature in degrees Celsius in a town $t$ hours after midnight is $T(t) = ${M} + ${A}\\sin\\left(\\frac{\\pi}{12}(t - ${c})\\right)$.`,
              `某镇午夜后 $t$ 小时的气温（摄氏度）为 $T(t) = ${M} + ${A}\\sin\\left(\\frac{\\pi}{12}(t - ${c})\\right)$。`,
            ),
            max: M + A,
            min: M - A,
            what: t("temperature", "气温"),
          };
          ask = high
            ? t("What is the highest temperature of the day, in degrees Celsius?", "一天中的最高气温是多少摄氏度？")
            : t("What is the lowest temperature of the day, in degrees Celsius?", "一天中的最低气温是多少摄氏度？");
        }
        const mid = (m.max + m.min) / 2;
        const amp = (m.max - m.min) / 2;
        return numberProblem({
          prompt: join(m.intro, t(" ", ""), ask),
          answer: high ? m.max : m.min,
          ...(m.unit && { unit: m.unit }),
          solution: t(
            `The ${m.what.en} swings between $${mid} - ${amp} = ${m.min}$ and $${mid} + ${amp} = ${m.max}$: the midline is $${mid}$ and the amplitude $${amp}$, since the sine or cosine factor runs from $-1$ to $1$. So the ${high ? "greatest" : "least"} value is $${high ? m.max : m.min}$.`,
            `${m.what["zh-CN"]}在 $${mid} - ${amp} = ${m.min}$ 与 $${mid} + ${amp} = ${m.max}$ 之间变化：因为正弦或余弦因子从 $-1$ 变到 $1$，中线是 $${mid}$，振幅是 $${amp}$。所以${high ? "最大" : "最小"}值是 $${high ? m.max : m.min}$。`,
          ),
          wrong: high ? [mid, amp, m.min, 2 * amp] : [mid, amp, m.max, -amp],
        });
      },
    },
    {
      id: "period-in-context",
      title: t("The period in context", "实际情境中的周期"),
      explanation: t(
        "The period $\\frac{2\\pi}{b}$ is the time one full cycle takes: one turn of a wheel, or the time from one high tide to the next. If $h(t) = 21 - 19\\cos\\left(\\frac{\\pi}{4}t\\right)$ gives a rider's height after $t$ minutes, one revolution takes\n\n$$\\frac{2\\pi}{\\frac{\\pi}{4}} = 8 \\text{ minutes},$$\n\nand in $40$ minutes the wheel turns $\\frac{40}{8} = 5$ times.",
        "周期 $\\frac{2\\pi}{b}$ 是完成一个完整周期所需的时间：摩天轮转一圈的时间，或从一次涨潮到下一次涨潮的时间。若 $h(t) = 21 - 19\\cos\\left(\\frac{\\pi}{4}t\\right)$ 表示乘客 $t$ 分钟后的高度，则转一圈需要\n\n$$\\frac{2\\pi}{\\frac{\\pi}{4}} = 8 \\text{ 分钟},$$\n\n$40$ 分钟内摩天轮转了 $\\frac{40}{8} = 5$ 圈。",
      ),
      generate(rng) {
        const n = rng.int(2, 15);
        const P = 2 * n;
        if (rng.bool()) {
          const r = rng.int(5, 30);
          const m = ferrisWheel(r, r + rng.int(1, 5), n);
          const turns = rng.bool() ? 0 : rng.int(2, 6);
          if (turns === 0)
            return numberProblem({
              prompt: join(m.intro, t(" How many minutes does one revolution take?", "转一圈需要多少分钟？")),
              answer: P,
              unit: "min",
              solution: both(
                `One revolution is one period of $h$:`,
                `转一圈就是 $h$ 的一个周期：`,
                `\\frac{2\\pi}{\\frac{\\pi}{${n}}} = 2 \\cdot ${n} = ${P}`,
              ),
              wrong: [n, 4 * n, r, 2 * r],
            });
          return numberProblem({
            prompt: join(
              m.intro,
              t(` How many full revolutions does the wheel make in $${P * turns}$ minutes?`, `摩天轮在 $${P * turns}$ 分钟内转了几整圈？`),
            ),
            answer: turns,
            solution: t(
              `One revolution takes $\\frac{2\\pi}{\\frac{\\pi}{${n}}} = ${P}$ minutes, so in $${P * turns}$ minutes the wheel turns $\\frac{${P * turns}}{${P}} = ${turns}$ times.`,
              `转一圈需要 $\\frac{2\\pi}{\\frac{\\pi}{${n}}} = ${P}$ 分钟，所以 $${P * turns}$ 分钟内转了 $\\frac{${P * turns}}{${P}} = ${turns}$ 圈。`,
            ),
            wrong: [2 * turns, P * turns, turns + 1],
          });
        }
        const A = rng.int(1, 4);
        const M = A + rng.int(1, 6);
        const k = rng.int(5, 7);
        const c = rng.int(1, 5);
        return numberProblem({
          prompt: t(
            `The depth in meters of the water in a harbor $t$ hours after midnight is $D(t) = ${M} + ${A}\\cos\\left(\\frac{\\pi}{${k}}(t - ${c})\\right)$. How many hours are there from one high tide to the next?`,
            `某港口午夜后 $t$ 小时的水深（米）为 $D(t) = ${M} + ${A}\\cos\\left(\\frac{\\pi}{${k}}(t - ${c})\\right)$。相邻两次涨潮之间相隔多少小时？`,
          ),
          answer: 2 * k,
          solution: both(
            "The time from one high tide to the next is one period:",
            "相邻两次涨潮之间的时间是一个周期：",
            `\\frac{2\\pi}{\\frac{\\pi}{${k}}} = 2 \\cdot ${k} = ${2 * k}`,
          ),
          wrong: [k, 4 * k, c, 2 * c],
        });
      },
    },
    {
      id: "times-of-peaks-in-context",
      title: t("When the peaks happen", "峰值出现的时刻"),
      explanation: t(
        "A peak happens where the sine or cosine factor reaches $1$ or $-1$, whichever makes the quantity largest. For $T(t) = 18 + 6\\sin\\left(\\frac{\\pi}{12}(t - 9)\\right)$, the temperature is highest when $\\frac{\\pi}{12}(t - 9) = \\frac{\\pi}{2}$, so $t - 9 = 6$ and $t = 15$: at 3 p.m. It is lowest when $\\frac{\\pi}{12}(t - 9) = -\\frac{\\pi}{2}$, at $t = 3$.\n\nFor a wheel $h(t) = C - r\\cos\\left(\\frac{\\pi}{n}t\\right)$ the rider starts at the bottom ($\\cos 0 = 1$) and first reaches the top when $\\frac{\\pi}{n}t = \\pi$, at $t = n$.",
        "峰值出现在正弦或余弦因子达到 $1$ 或 $-1$（使该量最大的那个）时。对 $T(t) = 18 + 6\\sin\\left(\\frac{\\pi}{12}(t - 9)\\right)$，当 $\\frac{\\pi}{12}(t - 9) = \\frac{\\pi}{2}$ 时气温最高，所以 $t - 9 = 6$，$t = 15$：下午 3 点。当 $\\frac{\\pi}{12}(t - 9) = -\\frac{\\pi}{2}$，即 $t = 3$ 时气温最低。\n\n对摩天轮 $h(t) = C - r\\cos\\left(\\frac{\\pi}{n}t\\right)$，乘客从最低点出发（$\\cos 0 = 1$），当 $\\frac{\\pi}{n}t = \\pi$，即 $t = n$ 时第一次到达最高点。",
      ),
      generate(rng) {
        const kind = rng.pick(["wheel", "tide", "temperature"] as const);
        if (kind === "wheel") {
          const r = rng.int(5, 30);
          const n = rng.int(2, 15);
          const m = ferrisWheel(r, r + rng.int(1, 5), n);
          return numberProblem({
            prompt: join(m.intro, t(" After how many minutes is the rider first at the top?", "乘客几分钟后第一次到达最高点？")),
            answer: n,
            unit: "min",
            solution: t(
              `The height is greatest when $-${r}\\cos\\left(\\frac{\\pi}{${n}}t\\right)$ is greatest, that is when $\\cos\\left(\\frac{\\pi}{${n}}t\\right) = -1$. The first time is $\\frac{\\pi}{${n}}t = \\pi$, so $t = ${n}$: half a revolution.`,
              `当 $-${r}\\cos\\left(\\frac{\\pi}{${n}}t\\right)$ 最大，即 $\\cos\\left(\\frac{\\pi}{${n}}t\\right) = -1$ 时高度最大。第一次是 $\\frac{\\pi}{${n}}t = \\pi$，所以 $t = ${n}$：转了半圈。`,
            ),
            wrong: [2 * n, Math.max(1, Math.floor(n / 2)), n + 1],
          });
        }
        if (kind === "tide") {
          const A = rng.int(1, 4);
          const M = A + rng.int(1, 6);
          const k = rng.int(5, 7);
          const c = rng.int(1, 5);
          const high = rng.bool();
          const ans = high ? c : c + k;
          return numberProblem({
            prompt: t(
              `The depth in meters of the water in a harbor $t$ hours after midnight is $D(t) = ${M} + ${A}\\cos\\left(\\frac{\\pi}{${k}}(t - ${c})\\right)$. How many hours after midnight is the first ${high ? "high" : "low"} tide?`,
              `某港口午夜后 $t$ 小时的水深（米）为 $D(t) = ${M} + ${A}\\cos\\left(\\frac{\\pi}{${k}}(t - ${c})\\right)$。午夜后第几小时出现第一次${high ? "涨潮" : "落潮"}？`,
            ),
            answer: ans,
            solution: high
              ? t(
                  `The depth is greatest when the cosine is $1$, first when $\\frac{\\pi}{${k}}(t - ${c}) = 0$, so $t = ${c}$.`,
                  `当余弦为 $1$ 时水深最大，第一次是 $\\frac{\\pi}{${k}}(t - ${c}) = 0$，所以 $t = ${c}$。`,
                )
              : t(
                  `The depth is least when the cosine is $-1$, first when $\\frac{\\pi}{${k}}(t - ${c}) = \\pi$, so $t - ${c} = ${k}$ and $t = ${c + k}$.`,
                  `当余弦为 $-1$ 时水深最小，第一次是 $\\frac{\\pi}{${k}}(t - ${c}) = \\pi$，所以 $t - ${c} = ${k}$，$t = ${c + k}$。`,
                ),
            wrong: high ? [c + k, k, 2 * k] : [c, k, c + 2 * k, k - c],
          });
        }
        const A = rng.int(3, 10);
        const M = rng.int(8, 25);
        const c = rng.int(7, 11);
        const high = rng.bool();
        const ans = high ? c + 6 : c - 6;
        return numberProblem({
          prompt: t(
            `The temperature in degrees Celsius in a town $t$ hours after midnight is $T(t) = ${M} + ${A}\\sin\\left(\\frac{\\pi}{12}(t - ${c})\\right)$, for $0 \\le t < 24$. At what time $t$ is the temperature ${high ? "highest" : "lowest"}?`,
            `某镇午夜后 $t$ 小时的气温（摄氏度）为 $T(t) = ${M} + ${A}\\sin\\left(\\frac{\\pi}{12}(t - ${c})\\right)$，$0 \\le t < 24$。气温在哪个时刻 $t$ 最${high ? "高" : "低"}？`,
          ),
          answer: ans,
          solveFor: "t",
          solution: high
            ? t(
                `The temperature is highest when the sine is $1$: $\\frac{\\pi}{12}(t - ${c}) = \\frac{\\pi}{2}$, so $t - ${c} = 6$ and $t = ${ans}$.`,
                `当正弦为 $1$ 时气温最高：$\\frac{\\pi}{12}(t - ${c}) = \\frac{\\pi}{2}$，所以 $t - ${c} = 6$，$t = ${ans}$。`,
              )
            : t(
                `The temperature is lowest when the sine is $-1$: $\\frac{\\pi}{12}(t - ${c}) = -\\frac{\\pi}{2}$ (adding $2\\pi$ would give a time after $24$), so $t - ${c} = -6$ and $t = ${ans}$.`,
                `当正弦为 $-1$ 时气温最低：$\\frac{\\pi}{12}(t - ${c}) = -\\frac{\\pi}{2}$（加上 $2\\pi$ 会得到 $24$ 以后的时刻），所以 $t - ${c} = -6$，$t = ${ans}$。`,
              ),
          wrong: high ? [c, c - 6, c + 12, c + 18] : [c, c + 6, c + 18, c + 12],
        });
      },
    },
  ],
};

/** modelingWithTrigonometricFunctions builds sinusoidal models from a description. */
const modelingWithTrigonometricFunctions: TopicDef = {
  id: "modeling-with-trigonometric-functions",
  title: t("Modeling With Trigonometric Functions", "用三角函数建模"),
  summary: t(
    "Build models y = a cos(b(t − c)) + d of Ferris wheels, tides and temperatures from their greatest and least values, their period and a starting point.",
    "根据最大值、最小值、周期和起点，建立摩天轮、潮汐和气温的模型 y = a cos(b(t − c)) + d。",
  ),
  prerequisites: ["interpreting-trigonometric-models"],
  encompasses: [
    { topic: "interpreting-trigonometric-models", weight: 0.3 },
    { topic: "combining-graph-transformations-of-sine-and-cosine", weight: 0.2 },
  ],
  xp: 18,
  standards: ["CCSS.HSF.TF.B.5"],
  knowledgePoints: [
    {
      id: "amplitude-and-midline-from-data",
      title: t("Amplitude and midline from the extremes", "由最值求振幅与中线"),
      explanation: t(
        "For a quantity that swings between a greatest value $M$ and a least value $m$, the model $y = a\\cos(b(t - c)) + d$ with $a > 0$ has\n\n$$a = \\frac{M - m}{2}, \\qquad d = \\frac{M + m}{2}.$$\n\nA Ferris wheel of diameter $40$ m whose lowest point is $2$ m above the ground swings between $2$ and $42$ m, so $a = 20$ (the radius) and $d = 22$ (the height of the center).",
        "对在最大值 $M$ 与最小值 $m$ 之间变化的量，$a > 0$ 的模型 $y = a\\cos(b(t - c)) + d$ 满足\n\n$$a = \\frac{M - m}{2}, \\qquad d = \\frac{M + m}{2}.$$\n\n直径 $40$ 米、最低点离地 $2$ 米的摩天轮在 $2$ 米与 $42$ 米之间变化，所以 $a = 20$（半径），$d = 22$（中心高度）。",
      ),
      generate(rng) {
        const kind = rng.pick(["wheel", "tide", "temperature"] as const);
        const askA = rng.bool();
        let intro: Text;
        let M: number;
        let m: number;
        if (kind === "wheel") {
          const r = rng.int(5, 40);
          const g = rng.int(1, 6);
          [M, m] = [g + 2 * r, g];
          intro = t(
            `A Ferris wheel has a diameter of $${2 * r}$ meters, and its lowest point is $${g}$ meters above the ground. A rider's height is modeled by $h(t) = a\\cos(b(t - c)) + d$ with $a > 0$.`,
            `一座摩天轮的直径为 $${2 * r}$ 米，最低点离地 $${g}$ 米。乘客的高度用 $h(t) = a\\cos(b(t - c)) + d$（$a > 0$）表示。`,
          );
        } else if (kind === "tide") {
          m = rng.int(1, 6);
          M = m + 2 * rng.int(1, 5);
          intro = t(
            `In a harbor the water is $${M}$ meters deep at high tide and $${m}$ meters deep at low tide. The depth is modeled by $D(t) = a\\cos(b(t - c)) + d$ with $a > 0$.`,
            `某港口涨潮时水深 $${M}$ 米，落潮时水深 $${m}$ 米。水深用 $D(t) = a\\cos(b(t - c)) + d$（$a > 0$）表示。`,
          );
        } else {
          m = rng.int(-8, 15);
          M = m + 2 * rng.int(3, 9);
          intro = t(
            `On one day the temperature ranges from a low of $${m}^\\circ\\text{C}$ to a high of $${M}^\\circ\\text{C}$. It is modeled by $T(t) = a\\cos(b(t - c)) + d$ with $a > 0$.`,
            `某一天的气温从最低 $${m}^\\circ\\text{C}$ 变化到最高 $${M}^\\circ\\text{C}$。气温用 $T(t) = a\\cos(b(t - c)) + d$（$a > 0$）表示。`,
          );
        }
        const a = (M - m) / 2;
        const d = (M + m) / 2;
        return numberProblem({
          prompt: join(intro, askA ? t(" Find $a$.", "求 $a$。") : t(" Find $d$.", "求 $d$。")),
          answer: askA ? a : d,
          solveFor: askA ? "a" : "d",
          solution: both(
            `The greatest value is $${M}$ and the least is $${m}$. The amplitude is half their difference and the midline is their average:`,
            `最大值是 $${M}$，最小值是 $${m}$。振幅是两者之差的一半，中线是两者的平均值：`,
            `a = \\frac{${M} - ${m < 0 ? `(${m})` : m}}{2} = ${a}, \\qquad d = \\frac{${M} + ${m < 0 ? `(${m})` : m}}{2} = ${d}`,
          ),
          wrong: askA ? [M - m, d, M, m] : [a, M - m, M, m],
        });
      },
    },
    {
      id: "b-from-the-period-in-context",
      title: t("b from the period", "由周期求 b"),
      explanation: t(
        "If the situation repeats every $P$ units of time, then $\\frac{2\\pi}{b} = P$, so\n\n$$b = \\frac{2\\pi}{P}.$$\n\nA wheel that turns once every $6$ minutes has $b = \\frac{2\\pi}{6} = \\frac{\\pi}{3}$; tides $12$ hours apart give $b = \\frac{\\pi}{6}$; a daily temperature cycle of $24$ hours gives $b = \\frac{\\pi}{12}$.",
        "若情境每隔 $P$ 个时间单位重复一次，则 $\\frac{2\\pi}{b} = P$，所以\n\n$$b = \\frac{2\\pi}{P}.$$\n\n每 $6$ 分钟转一圈的摩天轮有 $b = \\frac{2\\pi}{6} = \\frac{\\pi}{3}$；相隔 $12$ 小时的潮汐给出 $b = \\frac{\\pi}{6}$；以 $24$ 小时为周期的日气温给出 $b = \\frac{\\pi}{12}$。",
      ),
      generate(rng) {
        const kind = rng.pick(["wheel", "tide", "spring"] as const);
        let intro: Text;
        let P: number;
        if (kind === "wheel") {
          P = rng.int(3, 30);
          intro = t(
            `A Ferris wheel makes one full revolution every $${P}$ minutes. A rider's height after $t$ minutes is modeled by $h(t) = a\\cos(bt) + d$ with $b > 0$.`,
            `一座摩天轮每 $${P}$ 分钟转一整圈。乘客 $t$ 分钟后的高度用 $h(t) = a\\cos(bt) + d$（$b > 0$）表示。`,
          );
        } else if (kind === "tide") {
          P = rng.int(10, 14);
          intro = t(
            `In a harbor, high tides come every $${P}$ hours. The depth of the water $t$ hours after a high tide is modeled by $D(t) = a\\cos(bt) + d$ with $b > 0$.`,
            `某港口每隔 $${P}$ 小时涨潮一次。涨潮后 $t$ 小时的水深用 $D(t) = a\\cos(bt) + d$（$b > 0$）表示。`,
          );
        } else {
          P = rng.int(2, 9);
          intro = t(
            `A weight on a spring bobs up and down, returning to its highest point every $${P}$ seconds. Its height after $t$ seconds is modeled by $y(t) = a\\cos(bt) + d$ with $b > 0$.`,
            `弹簧上的重物上下振动，每 $${P}$ 秒回到最高点一次。它 $t$ 秒后的高度用 $y(t) = a\\cos(bt) + d$（$b > 0$）表示。`,
          );
        }
        const b = q(2, P);
        return piProblem(
          join(intro, t(" Find $b$.", "求 $b$。")),
          b,
          both(
            `The period is $${P}$, and the period of $\\cos(bt)$ is $\\frac{2\\pi}{b}$, so`,
            `周期是 $${P}$，而 $\\cos(bt)$ 的周期是 $\\frac{2\\pi}{b}$，所以`,
            `b = \\frac{2\\pi}{${P}} = ${piTex(b)}`,
          ),
          [q(1, P), q(P, 2), Q.of(2 * P), Q.of(P)],
          "b =",
        );
      },
    },
    {
      id: "choosing-a-model",
      title: t("Choosing the model", "选择模型"),
      explanation: t(
        "Build a model step by step: $d$ is the midline, $|a|$ the amplitude, $b = \\frac{2\\pi}{P}$, and the sign of $a$ and the shift $c$ come from where the cycle starts. The function $\\cos$ starts at its maximum, $-\\cos$ at its minimum and $\\sin$ on its midline going up.\n\nA rider boards a Ferris wheel of radius $15$ m, center $17$ m above the ground, at the bottom, and the wheel turns once every $10$ minutes. The height starts at its minimum, so\n\n$$h(t) = 17 - 15\\cos\\left(\\frac{\\pi}{5}t\\right).$$\n\nIf high tide comes at $t = 3$, use $\\cos(b(t - 3))$ so that the maximum is at $t = 3$.",
        "逐步建立模型：$d$ 是中线，$|a|$ 是振幅，$b = \\frac{2\\pi}{P}$，$a$ 的符号和平移量 $c$ 由周期的起点决定。$\\cos$ 从最大值开始，$-\\cos$ 从最小值开始，$\\sin$ 从中线开始并上升。\n\n乘客从最低点登上半径 $15$ 米、中心离地 $17$ 米的摩天轮，摩天轮每 $10$ 分钟转一圈。高度从最小值开始，所以\n\n$$h(t) = 17 - 15\\cos\\left(\\frac{\\pi}{5}t\\right).$$\n\n若在 $t = 3$ 时涨潮，就用 $\\cos(b(t - 3))$，使最大值出现在 $t = 3$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          const r = rng.int(5, 30);
          const C = r + rng.int(1, 5);
          const P = rng.pick([4, 6, 8, 10, 12, 16, 20, 24, 30]);
          const start = rng.pick(["bottom", "top"] as const);
          const b = piTex(q(2, P)).replace("\\pi", "\\pi t");
          const bWrong = piTex(q(1, P)).replace("\\pi", "\\pi t");
          const h = (s: string, A: number, bb: string) => same(`$h(t) = ${C} ${s} ${A}\\cos\\left(${bb}\\right)$`);
          const right = h(start === "bottom" ? "-" : "+", r, b);
          return oneOf(
            rng,
            t(
              `A Ferris wheel has radius $${r}$ meters and its center is $${C}$ meters above the ground; it makes one revolution every $${P}$ minutes. A rider boards at the ${start} of the wheel at $t = 0$. Which function gives the rider's height in meters after $t$ minutes?`,
              `一座摩天轮半径 $${r}$ 米，中心离地 $${C}$ 米，每 $${P}$ 分钟转一圈。乘客在 $t = 0$ 时从摩天轮的${start === "bottom" ? "最低点" : "最高点"}登上。哪个函数表示乘客 $t$ 分钟后的高度（米）？`,
            ),
            right,
            [
              h(start === "bottom" ? "+" : "-", r, b),
              h(start === "bottom" ? "-" : "+", 2 * r, b),
              h(start === "bottom" ? "-" : "+", r, bWrong),
              h(start === "bottom" ? "+" : "-", r, bWrong),
            ],
            t(
              `The midline is the height of the center, $${C}$, and the amplitude is the radius, $${r}$. One revolution every $${P}$ minutes gives $b = \\frac{2\\pi}{${P}} = ${piTex(q(2, P))}$. The rider starts at the ${start === "bottom" ? "minimum, so the cosine term is subtracted" : "maximum, so the cosine term is added"}: $${right.en.slice(1, -1)}$.`,
              `中线是中心的高度 $${C}$，振幅是半径 $${r}$。每 $${P}$ 分钟转一圈给出 $b = \\frac{2\\pi}{${P}} = ${piTex(q(2, P))}$。乘客从${start === "bottom" ? "最小值开始，所以减去余弦项" : "最大值开始，所以加上余弦项"}：$${right.en.slice(1, -1)}$。`,
            ),
          );
        }
        const m = rng.int(1, 5);
        const A = rng.int(1, 4);
        const M = m + 2 * A;
        const d = m + A;
        const P = rng.pick([10, 12, 14]);
        const c = rng.int(1, 6);
        const b = piTex(q(2, P));
        const D = (s: string, amp: number, mid: number, shift: string, bb = b) =>
          same(`$D(t) = ${mid} ${s} ${amp}\\cos\\left(${bb}(t ${shift} ${c})\\right)$`);
        const right = D("+", A, d, "-");
        return oneOf(
          rng,
          t(
            `In a harbor the water is $${M}$ meters deep at high tide and $${m}$ meters deep at low tide, and high tides come every $${P}$ hours. The first high tide is $${c}$ hours after midnight. Which function gives the depth $t$ hours after midnight?`,
            `某港口涨潮时水深 $${M}$ 米，落潮时水深 $${m}$ 米，每隔 $${P}$ 小时涨潮一次。午夜后 $${c}$ 小时出现第一次涨潮。哪个函数表示午夜后 $t$ 小时的水深？`,
          ),
          right,
          [D("+", A, d, "+"), D("-", A, d, "-"), D("+", d, A, "-"), D("+", A, d, "-", piTex(q(1, P)))],
          t(
            `The midline is $\\frac{${M} + ${m}}{2} = ${d}$ and the amplitude $\\frac{${M} - ${m}}{2} = ${A}$. High tides every $${P}$ hours give $b = \\frac{2\\pi}{${P}} = ${b}$. The depth is greatest at $t = ${c}$, where $\\cos(b(t - ${c}))$ equals $1$: $${right.en.slice(1, -1)}$.`,
            `中线是 $\\frac{${M} + ${m}}{2} = ${d}$，振幅是 $\\frac{${M} - ${m}}{2} = ${A}$。每隔 $${P}$ 小时涨潮给出 $b = \\frac{2\\pi}{${P}} = ${b}$。水深在 $t = ${c}$ 时最大，此时 $\\cos(b(t - ${c}))$ 等于 $1$：$${right.en.slice(1, -1)}$。`,
          ),
        );
      },
    },
  ],
};

/** algebraIITrigonometricTransformationTopics are the topics of the trigonometric graph transformations and properties modules of Algebra II, in outline order. */
export const algebraIITrigonometricTransformationTopics: readonly TopicDef[] = [
  verticalTranslationsOfTrigonometricFunctions,
  verticalStretchesOfTrigonometricFunctions,
  horizontalTranslationsOfTrigonometricFunctions,
  horizontalStretchesOfTrigonometricFunctions,
  combiningGraphTransformationsOfSineAndCosine,
  graphTransformationsOfTangentAndCotangent,
  combiningGraphTransformationsOfTangentAndCotangent,
  combiningGraphTransformationsOfSecantAndCosecant,
  graphingReflectionsOfTrigonometricFunctions,
  graphingReflectionsThreeOrMore,
  propertiesOfTransformedSineAndCosineFunctions,
  findingZerosAndExtremaOfTransformedSineAndCosineFunctions,
  propertiesOfTransformedTangentAndCotangentFunctions,
  propertiesOfTransformedSecantAndCosecantFunctions,
  interpretingTrigonometricModels,
  modelingWithTrigonometricFunctions,
];
