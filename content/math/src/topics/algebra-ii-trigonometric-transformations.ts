import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { type Interval, type PlaneMark, plane, Q, q, type RealSet, union } from "@ga/subject-math";
import { waveDrawings } from "../explanation-drawings-waves.ts";
import { choiceProblem, expressionProblem, intervalProblem, numberProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

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

/**
 * oneOf builds a choice problem from the right option and up to three distinct wrong ones, shuffled; whys[i]
 * says what is wrong with wrong[i].
 */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text, whys: readonly Text[] = []): Problem {
  const seen = new Set([right.en]);
  const reasons: Reason[] = [];
  const rest: Text[] = [];
  wrong.forEach((w, i) => {
    if (seen.has(w.en) || rest.length === 3) return;
    seen.add(w.en);
    rest.push(w);
    const why = whys[i];
    if (why) reasons.push([w.en, why.en, why["zh-CN"]]);
  });
  const options = [right, ...rest];
  const order = rng.shuffle(options.map((_, i) => i));
  return reasoned(choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution }), reasons);
}

/** said is a closing check paragraph in both locales. */
const said = (en: string, zh: string) => t(`\n\n**Check.** ${en}`, `\n\n**检验。**${zh}`);

/** label is the bold label of step i in both locales, followed by a space in English. */
const label = (i: number, en: string, zh: string): Text => {
  const s = stepLabel(i, en, zh);
  return t(`${s.en} `, s["zh-CN"]);
};

/** para starts a new paragraph. */
const para = t("\n\n", "\n\n");

/** paren wraps a negative number in parentheses. */
const paren = (v: Num) => (toQ(v).sign() < 0 ? `\\left(${toQ(v).toLatex()}\\right)` : toQ(v).toLatex());

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

/** keyPoint is a point of a wave that identifies it: the first highest point with x ≥ 0 of a sine or cosine, otherwise the first point with x ≥ 0 where f of the input is 1. */
function keyPoint(w: Wave): { readonly x: Q; readonly v: Q; readonly y: Q } {
  const s = w.f === "sin" || w.f === "cos" ? highLevel(w) : 2;
  const x = firstAfter(w, levelFamilies(w.f, s), Q.zero, false);
  return { x, v: q(s, 2), y: Q.of(w.d).add(w.a.mul(q(s, 2))) };
}

/** substituted checks a point of a wave by substituting its x: the input, the value of f there, and y. */
function substituted(w: Wave, x: Q, v: Q): Text {
  const theta = w.b.mul(x.sub(w.c));
  const y = Q.of(w.d).add(w.a.mul(v));
  const bPart = w.b.eq(Q.one) ? "" : w.b.toLatex();
  const inner = w.c.isZero()
    ? `${bPart ? `${bPart} \\cdot ` : ""}${piTex(x)}`
    : `${bPart}\\left(${piTex(x)} ${w.c.sign() > 0 ? "-" : "+"} ${piTex(w.c.abs())}\\right)`;
  const plain = w.b.eq(Q.one) && w.c.isZero();
  const line = `${w.a.toLatex()} \\cdot ${paren(v)}${signed(w.d)} = ${y.toLatex()}`;
  return t(
    `Substitute $x = ${piTex(x)}$.${plain ? "" : ` The input becomes $${inner} = ${piTex(theta)}$.`} There $\\${w.f}\\left(${piTex(theta)}\\right) = ${v.toLatex()}$. So $y = ${line}$.`,
    `代入 $x = ${piTex(x)}$。${plain ? "" : `输入变为 $${inner} = ${piTex(theta)}$。`}这时 $\\${w.f}\\left(${piTex(theta)}\\right) = ${v.toLatex()}$。所以 $y = ${line}$。`,
  );
}

/** featuresText describes the features of a wave that identify its graph, in two steps with a check by substitution. */
function featuresText(w: Wave): Text {
  const W = waveTex(w);
  const D = Q.of(w.d);
  const P = piTex(periodOf(w));
  const kp = keyPoint(w);
  const pt = `\\left(${piTex(kp.x)}, ${kp.y.toLatex()}\\right)`;
  const check = said(
    `${substituted(w, kp.x, kp.v).en} The point $${pt}$ is on the curve in the figure.`,
    `${substituted(w, kp.x, kp.v)["zh-CN"]}点 $${pt}$ 在图中的曲线上。`,
  );
  const step2 = label(2, "Compare with the figure", "与图比较");
  const closing = t(
    " These match the figure. Each other equation changes at least one of these features, as listed below.",
    "这些都与图相符。其他每个方程都至少改变了其中一个特征，见下文。",
  );
  if (w.f === "sin" || w.f === "cos") {
    const top = D.add(amp(w)).toLatex();
    return join(
      label(1, "Read the features of the equation", "读出方程的特征"),
      t(
        `Read the equation $y = ${W}$. Its midline is $y = ${w.d}$, its amplitude is $${amp(w).toLatex()}$ and its period is $${P}$. So it runs between $y = ${D.sub(amp(w)).toLatex()}$ and $y = ${top}$.`,
        `$y = ${W}$ 的图象的中线为 $y = ${w.d}$，振幅为 $${amp(w).toLatex()}$，周期为 $${P}$。所以它在 $y = ${D.sub(amp(w)).toLatex()}$ 与 $y = ${top}$ 之间。`,
      ),
      para,
      step2,
      t(`Its first highest point with $x \\ge 0$ is $${pt}$.`, `$x \\ge 0$ 时它的第一个最高点是 $${pt}$。`),
      closing,
      check,
    );
  }
  const asym = firstAfter(w, [asymptoteFamily(w.f)], Q.zero, false);
  if (w.f === "tan" || w.f === "cot") {
    const x0 = firstAfter(w, levelFamilies(w.f, 0), Q.zero, false);
    return join(
      label(1, "Read the features of the equation", "读出方程的特征"),
      t(
        `Read the equation $y = ${W}$. Its period is $${P}$, so its vertical asymptotes are $${P}$ apart. One of them is $x = ${piTex(asym)}$.`,
        `$y = ${W}$ 的图象的周期为 $${P}$，所以竖直渐近线相距 $${P}$。其中一条是 $x = ${piTex(asym)}$。`,
      ),
      para,
      step2,
      t(
        `It passes through $\\left(${piTex(x0)}, ${w.d}\\right)$, where the ${fnNames[w.f].en} of the input is $0$. It also passes through $${pt}$.`,
        `它经过 $\\left(${piTex(x0)}, ${w.d}\\right)$，这里输入的${fnNames[w.f]["zh-CN"]}值为 $0$。它也经过 $${pt}$。`,
      ),
      closing,
      check,
    );
  }
  const x2 = firstAfter(w, levelFamilies(w.f, -2), Q.zero, false);
  return join(
    label(1, "Read the features of the equation", "读出方程的特征"),
    t(
      `Read the equation $y = ${W}$. Its period is $${P}$, and it has a vertical asymptote at $x = ${piTex(asym)}$.`,
      `$y = ${W}$ 的图象的周期为 $${P}$，有竖直渐近线 $x = ${piTex(asym)}$。`,
    ),
    para,
    step2,
    t(
      `Its turning points include $${pt}$ and $\\left(${piTex(x2)}, ${D.sub(w.a).toLatex()}\\right)$.`,
      `它的转折点包括 $${pt}$ 和 $\\left(${piTex(x2)}, ${D.sub(w.a).toLatex()}\\right)$。`,
    ),
    closing,
    check,
  );
}

/** graphWhy says how the graph of a wrong candidate c differs from the graph of w. */
function graphWhy(c: Wave, w: Wave): Text {
  const [Pc, Pw] = [periodOf(c), periodOf(w)];
  if (!Pc.eq(Pw))
    return t(
      `Its period is $${piTex(Pc)}$, but the graph repeats every $${piTex(Pw)}$.`,
      `它的周期是 $${piTex(Pc)}$，但图象每隔 $${piTex(Pw)}$ 重复一次。`,
    );
  if (c.d !== w.d)
    return t(
      `Its vertical shift is $${c.d}$, so it would be centered on $y = ${c.d}$. The graph is centered on $y = ${w.d}$.`,
      `它的竖直平移量是 $${c.d}$，中心应在 $y = ${c.d}$。图象的中心在 $y = ${w.d}$。`,
    );
  if (!amp(c).eq(amp(w)))
    return t(
      `Its stretch factor is $${amp(c).toLatex()}$, so its key points would be $${amp(c).toLatex()}$ above or below its center line. On the graph they are $${amp(w).toLatex()}$ away.`,
      `它的伸缩倍数是 $${amp(c).toLatex()}$，关键点应在中心线上下 $${amp(c).toLatex()}$ 处。图上它们相距 $${amp(w).toLatex()}$。`,
    );
  const levels = c.f === "sin" || c.f === "cos" ? [highLevel(c), -highLevel(c), 0] : c.f === "tan" || c.f === "cot" ? [2, 0, -2] : [2, -2];
  for (const s of levels) {
    const x = firstAfter(c, levelFamilies(c.f, s), Q.zero, false);
    const y = Q.of(c.d).add(c.a.mul(q(s, 2)));
    const at = yAt(w, x.toNumber());
    if (Number.isFinite(at) && Math.abs(at - y.toNumber()) < 1e-9) continue;
    return t(
      `It would pass through $\\left(${piTex(x)}, ${y.toLatex()}\\right)$. That point is not on the graph.`,
      `它应经过 $\\left(${piTex(x)}, ${y.toLatex()}\\right)$。这一点不在图象上。`,
    );
  }
  if (hasAsymptotes(c.f)) {
    const ac = firstAfter(c, [asymptoteFamily(c.f)], Q.zero, false);
    if (Number.isFinite(yAt(w, ac.toNumber())) && Math.abs(yAt(w, ac.toNumber())) < 1e6)
      return t(
        `Its first asymptote with $x \\ge 0$ would be $x = ${piTex(ac)}$. The graph has no asymptote there.`,
        `它在 $x \\ge 0$ 时的第一条渐近线应是 $x = ${piTex(ac)}$。图象在那里没有渐近线。`,
      );
  }
  return t("Its key points do not all lie on the graph.", "它的关键点并不都在图象上。");
}

/** graphProblem shows the graph of a wave and asks which equation it is, among candidates with different graphs. */
function graphProblem(rng: Rng, w: Wave, candidates: readonly Wave[], u0 = -8): Problem {
  const wrong = candidates.filter((c) => c.b.sign() > 0 && !sameGraph(c, w));
  return {
    ...oneOf(
      rng,
      t("Which equation is graphed?", "图中是哪个方程的图象？"),
      eqOption(w),
      wrong.map((c) => eqOption(c)),
      featuresText(w),
      wrong.map((c) => graphWhy(c, w)),
    ),
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
    join(
      label(1, "Start from the basic period", "从基本周期出发"),
      t(
        `The period of $y = \\${w.f} x$ is $${piTex(base)}$. The coefficient in front, the horizontal shift and the vertical shift move or stretch the graph without changing how often it repeats.`,
        `$y = \\${w.f} x$ 的周期为 $${piTex(base)}$。前面的系数、水平平移和竖直平移只移动或伸缩图象，不改变它重复的快慢。`,
      ),
      para,
      label(2, "Divide by b", "除以 b"),
      both(
        `Multiplying $x$ by $b = ${w.b.toLatex()}$ makes the input run through a full cycle $b$ times as fast. That compresses the graph horizontally by the factor $b$, or stretches it when $b < 1$. So the period is $\\frac{${piTex(base)}}{b}$:`,
        `把 $x$ 乘以 $b = ${w.b.toLatex()}$，输入走完一个周期的速度变为原来的 $b$ 倍。图象因此沿水平方向压缩为原来的 $\\frac{1}{b}$（$b < 1$ 时为拉伸）。所以周期为 $\\frac{${piTex(base)}}{b}$：`,
        quotient === piTex(P) ? quotient : `${quotient} = ${piTex(P)}`,
      ),
      said(
        `When $x$ increases by $${piTex(P)}$, the input $${argTex(w)}$ increases by $${w.b.toLatex()} \\cdot ${piTex(P)} = ${piTex(base)}$. That is exactly one period of $\\${w.f}$, so the graph repeats.`,
        `当 $x$ 增加 $${piTex(P)}$ 时，输入 $${argTex(w)}$ 增加 $${w.b.toLatex()} \\cdot ${piTex(P)} = ${piTex(base)}$。这恰好是 $\\${w.f}$ 的一个周期，所以图象重复。`,
      ),
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
  const s = targetLevel(w, target);
  const theta0 = w.b.mul(ans.sub(w.c));
  const check =
    s === undefined
      ? said(
          `At $x = ${piTex(ans)}$ the input is $${piTex(theta0)}$. There $\\${w.f}$ is not defined, so the graph has a vertical asymptote at $x = ${piTex(ans)}$.`,
          `在 $x = ${piTex(ans)}$ 处输入为 $${piTex(theta0)}$。$\\${w.f}$ 在这里无定义，所以图象在 $x = ${piTex(ans)}$ 处有竖直渐近线。`,
        )
      : said(substituted(w, ans, q(s, 2)).en, substituted(w, ans, q(s, 2))["zh-CN"]);
  const pick = t(`The smallest positive of these is $x = ${piTex(ans)}$.`, `其中最小的正数是 $x = ${piTex(ans)}$。`);
  return piProblem(
    targetPrompts[target](waveTex(w, expanded)),
    ans,
    join(
      // With the plain input x there is nothing to substitute or solve.
      arg === "x"
        ? join(
            label(1, "Find where it happens", "找出发生的位置"),
            both(
              `${cond.en.replaceAll("\\theta", "x")}, that is, for integers $k$,`,
              `${cond["zh-CN"].replaceAll("\\theta", "x")}，即对整数 $k$，`,
              xs,
            ),
            label(2, "Pick the smallest positive", "取最小的正数"),
            pick,
          )
        : join(
            label(1, "Find the angles", "找出角"),
            both(
              `Let $\\theta = ${arg}$. ${cond.en}, that is, for integers $k$,`,
              `令 $\\theta = ${arg}$。${cond["zh-CN"]}，即对整数 $k$，`,
              thetas,
            ),
            label(2, "Solve for x", "解出 x"),
            both(`To solve for $x$, start from $${arg} = \\theta$. Then`, `由 $${arg} = \\theta$ 解出 $x$ 得`, xs),
            label(3, "Pick the smallest positive", "取最小的正数"),
            pick,
          ),
      check,
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
  intro: t(
    `From vertical translations of functions you know that $y = f(x) + k$ is the graph of $y = f(x)$ moved up $k$ units, or down when $k < 0$. The waves $y = \\sin x$ and $y = \\cos x$ are functions like any other, so the same rule moves them up and down. This matters because most waves in the world do not swing around zero: a day's temperature swings around a typical value, and a rider on a Ferris wheel swings around the height of its center.

Take $y = \\sin x - 1$. Every value of $\\sin x$ drops by $1$, so each key point of one cycle moves straight down:

$$(0, 0) \\to (0, -1), \\qquad \\left(\\frac{\\pi}{2}, 1\\right) \\to \\left(\\frac{\\pi}{2}, 0\\right), \\qquad \\left(\\frac{3\\pi}{2}, -1\\right) \\to \\left(\\frac{3\\pi}{2}, -2\\right).$$

The wave now swings between $-2$ and $0$ around the line $y = -1$. Its shape and its period $2\\pi$ are unchanged; only its height has moved.`,
    `由函数的竖直平移可知，$y = f(x) + k$ 的图象是把 $y = f(x)$ 的图象向上平移 $k$ 个单位（$k < 0$ 时向下）。波形 $y = \\sin x$ 与 $y = \\cos x$ 也是函数，所以同样的规则使它们上下移动。这很重要，因为现实中的大多数波并不围绕零起伏：一天的气温围绕某个典型值起伏，摩天轮上的乘客围绕中心的高度起伏。

以 $y = \\sin x - 1$ 为例。$\\sin x$ 的每个值都减少 $1$，所以一个周期内的每个关键点都竖直向下移动：

$$(0, 0) \\to (0, -1), \\qquad \\left(\\frac{\\pi}{2}, 1\\right) \\to \\left(\\frac{\\pi}{2}, 0\\right), \\qquad \\left(\\frac{3\\pi}{2}, -1\\right) \\to \\left(\\frac{3\\pi}{2}, -2\\right).$$

波形现在围绕直线 $y = -1$ 在 $-2$ 与 $0$ 之间起伏。它的形状和周期 $2\\pi$ 都不变，只是高度移动了。`,
  ),
  knowledgePoints: [
    {
      id: "describing-vertical-translations",
      figure: waveDrawings["vertical-translations-of-trigonometric-functions#describing-vertical-translations"],
      title: t("Describing the shift", "描述平移"),
      explanation: t(
        "Adding a constant $d$ to a function, $y = \\sin x + d$, adds $d$ to every $y$-value, so the whole graph moves **up** $d$ units when $d > 0$ and **down** $|d|$ units when $d < 0$. The $x$-values of the key points do not change.\n\nFor example, $y = \\cos x - 3$ is the graph of $y = \\cos x$ shifted down $3$ units. A constant added *inside*, as in $y = \\cos(x - 3)$, moves the graph sideways instead.\n\n> **Watch out.** A constant added after the function, as in $y = \\sin x + d$, moves the graph up or down. Do not confuse it with $y = \\sin(x + d)$, where the constant is inside and the graph moves sideways. And do not flip the direction: a positive $d$ means up.",
        "给函数加上常数 $d$，即 $y = \\sin x + d$，会给每个 $y$ 值加上 $d$，所以 $d > 0$ 时整个图象**向上**平移 $d$ 个单位，$d < 0$ 时**向下**平移 $|d|$ 个单位。关键点的 $x$ 值不变。\n\n例如，$y = \\cos x - 3$ 的图象是把 $y = \\cos x$ 的图象向下平移 $3$ 个单位。而加在函数*里面*的常数，如 $y = \\cos(x - 3)$，则使图象左右移动。\n\n> **注意。**加在函数之后的常数，如 $y = \\sin x + d$，使图象上下移动。不要把它与常数在括号内、使图象左右移动的 $y = \\sin(x + d)$ 混淆。也不要弄反方向：$d$ 为正表示向上。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const d = rng.nonZero(-9, 9);
        const k = String(Math.abs(d));
        const y0 = f === "sin" ? 0 : 1;
        const solution = join(
          label(1, "See where the constant is added", "看常数加在哪里"),
          t(
            `In $y = \\${f} x${signed(d)}$ the constant $${d}$ is added outside the function, after $\\${f} x$ has been computed. So it adds $${d}$ to every $y$-value and leaves every $x$-value alone.`,
            `在 $y = \\${f} x${signed(d)}$ 中，常数 $${d}$ 加在函数外面，即算出 $\\${f} x$ 之后再加。所以它给每个 $y$ 值加上 $${d}$，而 $x$ 值都不变。`,
          ),
          para,
          label(2, "Read the direction", "读出方向"),
          t(
            `Adding a ${d > 0 ? "positive" : "negative"} number moves every point ${d > 0 ? "up" : "down"}. So the graph of $y = \\${f} x${signed(d)}$ is the graph of $y = \\${f} x$ shifted ${d > 0 ? "up" : "down"} $${k}$ units.`,
            `加上${d > 0 ? "正" : "负"}数使每个点向${d > 0 ? "上" : "下"}移动。所以 $y = \\${f} x${signed(d)}$ 的图象是把 $y = \\${f} x$ 的图象向${d > 0 ? "上" : "下"}平移 $${k}$ 个单位。`,
          ),
          said(
            `At $x = 0$ the original wave has $y = \\${f} 0 = ${y0}$ and the new one has $y = ${y0}${signed(d)} = ${y0 + d}$. The point moved from height $${y0}$ to height $${y0 + d}$, which is $${k}$ units ${d > 0 ? "up" : "down"}.`,
            `在 $x = 0$ 处，原波形 $y = \\${f} 0 = ${y0}$，新波形 $y = ${y0}${signed(d)} = ${y0 + d}$。这个点从高度 $${y0}$ 移到高度 $${y0 + d}$，即向${d > 0 ? "上" : "下"}移动了 $${k}$ 个单位。`,
          ),
        );
        const flip = t(
          `Adding $${d}$ moves points ${d > 0 ? "up" : "down"}, not ${d > 0 ? "down" : "up"}.`,
          `加上 $${d}$ 使点向${d > 0 ? "上" : "下"}移动，而不是向${d > 0 ? "下" : "上"}。`,
        );
        const sideways = t(
          "A constant added outside the function changes the $y$-values, so the graph moves up or down, not sideways.",
          "加在函数外面的常数改变 $y$ 值，所以图象上下移动，而不是左右移动。",
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
            [flip, sideways, sideways],
          );
        }
        const dir = d > 0 ? t("up", "上") : t("down", "下");
        const inside = t(
          "A constant added inside the function, to $x$, moves the graph sideways, not up or down.",
          "加在函数里面（加给 $x$）的常数使图象左右移动，而不是上下移动。",
        );
        return oneOf(
          rng,
          t(
            `The graph of $y = \\${f} x$ is shifted ${dir.en} $${k}$ units. Which equation describes the new graph?`,
            `把 $y = \\${f} x$ 的图象向${dir["zh-CN"]}平移 $${k}$ 个单位。新图象的方程是哪一个？`,
          ),
          same(`$y = \\${f} x${signed(d)}$`),
          [same(`$y = \\${f} x${signed(-d)}$`), same(`$y = \\${f}(x${signed(d)})$`), same(`$y = \\${f}(x${signed(-d)})$`)],
          solution,
          [
            t(`It shifts the graph ${d > 0 ? "down" : "up"} $${k}$ units.`, `它把图象向${d > 0 ? "下" : "上"}平移 $${k}$ 个单位。`),
            inside,
            inside,
          ],
        );
      },
    },
    {
      id: "midline-maximum-and-minimum",
      title: t("Midline, maximum and minimum", "中线、最大值与最小值"),
      explanation: t(
        "The waves $y = \\sin x$ and $y = \\cos x$ run between $-1$ and $1$ around the **midline** $y = 0$. Shifting by $d$ moves everything by $d$: the graph of $y = \\sin x + d$ has\n\n- midline $y = d$,\n- maximum value $d + 1$,\n- minimum value $d - 1$.\n\nFor $y = \\cos x - 4$: midline $y = -4$, maximum $-3$, minimum $-5$.\n\n> **Watch out.** The midline is $y = d$, not the maximum $d + 1$ or the minimum $d - 1$. It keeps the sign of $d$: $y = \\cos x - 4$ has midline $y = -4$, not $y = 4$.",
        "波形 $y = \\sin x$ 与 $y = \\cos x$ 围绕**中线** $y = 0$ 在 $-1$ 与 $1$ 之间起伏。平移 $d$ 使一切都移动 $d$：$y = \\sin x + d$ 的图象有\n\n- 中线 $y = d$，\n- 最大值 $d + 1$，\n- 最小值 $d - 1$。\n\n对 $y = \\cos x - 4$：中线 $y = -4$，最大值 $-3$，最小值 $-5$。\n\n> **注意。**中线是 $y = d$，不是最大值 $d + 1$，也不是最小值 $d - 1$。它保留 $d$ 的符号：$y = \\cos x - 4$ 的中线是 $y = -4$，而不是 $y = 4$。",
      ),
      figure: waveFigure(wave("sin", 1, 1, 0, 2)),
      generate(rng) {
        const f = rng.pick(sinCos);
        const d = rng.nonZero(-8, 8);
        const W = `\\${f} x${signed(d)}`;
        const kind = rng.pick(["max", "min", "midline"] as const);
        const solution = join(
          label(1, "Start from the basic wave", "从基本波形出发"),
          t(
            `The wave $y = \\${f} x$ runs from $-1$ to $1$ around the midline $y = 0$. The graph of $y = ${W}$ is that wave shifted ${d > 0 ? "up" : "down"} $${Math.abs(d)}$ units, so every height changes by $${d}$.`,
            `波形 $y = \\${f} x$ 围绕中线 $y = 0$ 在 $-1$ 到 $1$ 之间起伏。$y = ${W}$ 的图象是把它向${d > 0 ? "上" : "下"}平移 $${Math.abs(d)}$ 个单位，所以每个高度都改变 $${d}$。`,
          ),
          para,
          label(2, "Shift the three levels", "平移三个高度"),
          t(
            `The midline moves to $y = 0${signed(d)} = ${d}$. The maximum is $1${signed(d)} = ${d + 1}$ and the minimum is $-1${signed(d)} = ${d - 1}$.`,
            `中线移到 $y = 0${signed(d)} = ${d}$。最大值为 $1${signed(d)} = ${d + 1}$，最小值为 $-1${signed(d)} = ${d - 1}$。`,
          ),
          said(
            `The midline lies halfway between the maximum and the minimum: $\\frac{${d + 1} + ${paren(d - 1)}}{2} = ${d}$. The wave also reaches its maximum where $\\${f} x = 1$, at $x = ${f === "sin" ? "\\frac{\\pi}{2}" : "0"}$, and there $y = 1${signed(d)} = ${d + 1}$.`,
            `中线位于最大值与最小值的正中间：$\\frac{${d + 1} + ${paren(d - 1)}}{2} = ${d}$。波形在 $\\${f} x = 1$ 处，即 $x = ${f === "sin" ? "\\frac{\\pi}{2}" : "0"}$ 处取得最大值，这时 $y = 1${signed(d)} = ${d + 1}$。`,
          ),
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
        "To match a shifted wave to its equation, find its midline halfway between its highest and lowest values, then check its value at $x = 0$: a sine wave starts on its midline there, and a cosine wave at its highest point. The figure shows $y = \\sin x + 2$: it runs between $1$ and $3$ around $y = 2$ and passes through $(0, 2)$.\n\n> **Watch out.** Check both the midline and the value at $x = 0$. A sine and a cosine with the same midline differ only in where they start, so the midline alone cannot tell them apart.",
        "要把平移后的波形与方程对应，先找出位于最大值与最小值正中间的中线，再看 $x = 0$ 处的值：正弦波在那里位于中线上，余弦波则在最高点。图中是 $y = \\sin x + 2$：它围绕 $y = 2$ 在 $1$ 与 $3$ 之间起伏，并经过 $(0, 2)$。\n\n> **注意。**中线和 $x = 0$ 处的值都要检查。中线相同的正弦和余弦只在起点处不同，所以只看中线无法区分它们。",
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
  intro: t(
    `From vertical stretches of functions you know that $y = a f(x)$ multiplies every output by $a$. Applied to $y = \\sin x$, this changes how far the wave swings from its midline, which is what separates a loud sound from a soft one, or a large Ferris wheel from a small one.

Take $y = 4\\sin x$. The zeros of $\\sin x$ stay zeros, because $4 \\cdot 0 = 0$, but the top and bottom move out:

$$\\left(\\frac{\\pi}{2}, 1\\right) \\to \\left(\\frac{\\pi}{2}, 4\\right), \\qquad \\left(\\frac{3\\pi}{2}, -1\\right) \\to \\left(\\frac{3\\pi}{2}, -4\\right).$$

The wave now swings $4$ units above and below the $x$-axis. That distance from the midline to the top is called the amplitude. A shift by $d$ afterwards moves the whole band, so $y = 4\\sin x + d$ runs from $d - 4$ to $d + 4$.`,
    `由函数的竖直伸缩可知，$y = a f(x)$ 把每个输出都乘以 $a$。用在 $y = \\sin x$ 上，它改变波形离开中线的幅度，这正是响亮的声音与轻柔的声音、大摩天轮与小摩天轮的区别。

以 $y = 4\\sin x$ 为例。$\\sin x$ 的零点仍是零点，因为 $4 \\cdot 0 = 0$，但最高点和最低点向外移动：

$$\\left(\\frac{\\pi}{2}, 1\\right) \\to \\left(\\frac{\\pi}{2}, 4\\right), \\qquad \\left(\\frac{3\\pi}{2}, -1\\right) \\to \\left(\\frac{3\\pi}{2}, -4\\right).$$

波形现在在 $x$ 轴上下各起伏 $4$ 个单位。中线到最高点的这段距离叫作振幅。之后再平移 $d$，整个带状区域随之移动，所以 $y = 4\\sin x + d$ 从 $d - 4$ 起伏到 $d + 4$。`,
  ),
  knowledgePoints: [
    {
      id: "amplitude",
      title: t("Amplitude", "振幅"),
      explanation: t(
        "Multiplying by $a > 0$, $y = a \\sin x$, multiplies every $y$-value by $a$: the graph is stretched vertically by the factor $a$ (compressed when $a < 1$). The zeros stay where they are, and the wave now runs from $-a$ to $a$.\n\nThe **amplitude** of a wave is the distance from its midline to its highest point, half the distance from its lowest to its highest point. The amplitude of $y = a \\sin x$ and of $y = a \\cos x$ is $a$. For $y = \\frac{1}{2}\\cos x$: amplitude $\\frac{1}{2}$, maximum $\\frac{1}{2}$, minimum $-\\frac{1}{2}$.\n\n> **Watch out.** The amplitude is $a$ itself. It is not $2a$, the distance from the lowest to the highest point, and not $\\frac{1}{a}$. Multiplying by $\\frac{1}{2}$ flattens the wave to amplitude $\\frac{1}{2}$.",
        "乘以 $a > 0$，即 $y = a \\sin x$，会把每个 $y$ 值乘以 $a$：图象沿竖直方向伸长为原来的 $a$ 倍（$a < 1$ 时为压缩）。零点位置不变，波形现在从 $-a$ 起伏到 $a$。\n\n波形的**振幅**是中线到最高点的距离，即最低点到最高点距离的一半。$y = a \\sin x$ 和 $y = a \\cos x$ 的振幅都是 $a$。对 $y = \\frac{1}{2}\\cos x$：振幅 $\\frac{1}{2}$，最大值 $\\frac{1}{2}$，最小值 $-\\frac{1}{2}$。\n\n> **注意。**振幅就是 $a$ 本身。它不是最低点到最高点的距离 $2a$，也不是 $\\frac{1}{a}$。乘以 $\\frac{1}{2}$ 会把波形压扁，振幅变为 $\\frac{1}{2}$。",
      ),
      figure: waveFigure(wave("cos", 3)),
      generate(rng) {
        const f = rng.pick(sinCos);
        const a = pickQ(rng, amps);
        const w = wave(f, a);
        const W = waveTex(w);
        const kind = rng.pick(["amplitude", "max", "min"] as const);
        const A = a.toLatex();
        const solution = join(
          label(1, "Multiply the heights", "把高度相乘"),
          t(
            `The wave $y = \\${f} x$ runs from $-1$ to $1$. Multiplying by $${A}$ multiplies every $y$-value by $${A}$, so the zeros stay put and the wave now runs from $-${A}$ to $${A}$.`,
            `波形 $y = \\${f} x$ 从 $-1$ 起伏到 $1$。乘以 $${A}$ 会把每个 $y$ 值乘以 $${A}$，所以零点不动，波形现在从 $-${A}$ 起伏到 $${A}$。`,
          ),
          para,
          label(2, "Read the amplitude", "读出振幅"),
          t(
            `The midline is still $y = 0$. The amplitude, the distance from the midline to the top, is $${A}$. The maximum is $${A}$ and the minimum is $-${A}$.`,
            `中线仍是 $y = 0$。振幅即中线到最高点的距离，为 $${A}$。最大值是 $${A}$，最小值是 $-${A}$。`,
          ),
          said(
            `The amplitude is also half the distance from the lowest to the highest value: $\\frac{${A} - \\left(-${A}\\right)}{2} = ${A}$. At $x = ${f === "sin" ? "\\frac{\\pi}{2}" : "0"}$, where $\\${f} x = 1$, the maximum is $${A} \\cdot 1 = ${A}$.`,
            `最高值与最低值之差的一半是 $\\frac{${A} - \\left(-${A}\\right)}{2} = ${A}$，正是振幅。在 $\\${f} x = 1$ 的 $x = ${f === "sin" ? "\\frac{\\pi}{2}" : "0"}$ 处，函数值为 $${A} \\cdot 1 = ${A}$，即最大值。`,
          ),
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
        "For $y = a \\sin x + d$ with $a > 0$, first stretch, then shift: the stretched wave runs from $-a$ to $a$, and adding $d$ moves it to run from $d - a$ to $d + a$ around the midline $y = d$. So the range is $[d - a, d + a]$.\n\nFor $y = 3 \\cos x - 1$: the range is $[-1 - 3, -1 + 3] = [-4, 2]$.\n\n> **Watch out.** Stretch first, then shift: the range is $[d - a, d + a]$. Forgetting the shift gives $[-a, a]$, and forgetting the stretch gives $[d - 1, d + 1]$.",
        "对 $a > 0$ 的 $y = a \\sin x + d$，先伸缩再平移：伸缩后的波形从 $-a$ 起伏到 $a$，加上 $d$ 后围绕中线 $y = d$ 从 $d - a$ 起伏到 $d + a$。所以值域是 $[d - a, d + a]$。\n\n对 $y = 3 \\cos x - 1$：值域是 $[-1 - 3, -1 + 3] = [-4, 2]$。\n\n> **注意。**先伸缩再平移：值域是 $[d - a, d + a]$。忘了平移会得到 $[-a, a]$，忘了伸缩会得到 $[d - 1, d + 1]$。",
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
          solution: join(
            label(1, "Stretch", "伸缩"),
            t(
              `The wave $y = ${waveTex(wave(f, a))}$ is $y = \\${f} x$ stretched by the factor $${a.toLatex()}$. So it runs from $${a.neg().toLatex()}$ to $${a.toLatex()}$.`,
              `波形 $y = ${waveTex(wave(f, a))}$ 是把 $y = \\${f} x$ 伸缩为原来的 $${a.toLatex()}$ 倍。所以它从 $${a.neg().toLatex()}$ 起伏到 $${a.toLatex()}$。`,
            ),
            para,
            label(2, "Shift", "平移"),
            both(
              `Adding $${d}$ moves both ends by $${d}$:`,
              `加上 $${d}$ 使两端都移动 $${d}$：`,
              `${a.neg().toLatex()}${signed(d)} = ${D.sub(a).toLatex()}, \\qquad ${a.toLatex()}${signed(d)} = ${D.add(a).toLatex()}`,
            ),
            t(
              `The range is $[${D.sub(a).toLatex()}, ${D.add(a).toLatex()}]$.`,
              `值域是 $[${D.sub(a).toLatex()}, ${D.add(a).toLatex()}]$。`,
            ),
            said(
              `The midline is the midpoint of the interval: $\\frac{${D.sub(a).toLatex()} + ${paren(D.add(a))}}{2} = ${d}$. The amplitude is its half-length: $\\frac{${D.add(a).toLatex()} - ${paren(D.sub(a))}}{2} = ${a.toLatex()}$.`,
              `区间的中点是 $\\frac{${D.sub(a).toLatex()} + ${paren(D.add(a))}}{2} = ${d}$，即中线。区间长度的一半是 $\\frac{${D.add(a).toLatex()} - ${paren(D.sub(a))}}{2} = ${a.toLatex()}$，即振幅。`,
            ),
          ),
          wrong: [box(0, a), box(d, Q.one), box(d, a.mul(Q.of(2))), box(d - 1, a)],
        });
      },
    },
    {
      id: "matching-graphs-of-vertical-stretches",
      title: t("Matching graphs", "匹配图象"),
      explanation: t(
        "Read the amplitude from a graph as half the distance between its highest and lowest values, and the midline halfway between them. The figure shows $y = 3 \\cos x$: it runs between $-3$ and $3$, so its amplitude is $3$, and it has its highest point $(0, 3)$ on the $y$-axis, like a cosine wave.\n\n> **Watch out.** A stretch by $a$ and a stretch by $\\frac{1}{a}$ are different: one makes the wave taller, the other flatter. Read the actual top value from the grid.",
        "从图象读振幅：最高值与最低值之差的一半；中线位于两者正中间。图中是 $y = 3 \\cos x$：它在 $-3$ 与 $3$ 之间起伏，所以振幅为 $3$，并且像余弦波一样在 $y$ 轴上有最高点 $(0, 3)$。\n\n> **注意。**伸缩为 $a$ 倍与伸缩为 $\\frac{1}{a}$ 倍不同：一个使波形变高，另一个使它变扁。要从网格上读出实际的最高值。",
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
  intro: t(
    `From horizontal translations of functions you know that $y = f(x - h)$ is the graph of $y = f(x)$ moved right $h$ units. For a wave this changes when things happen: a tide that is high at three in the morning instead of at midnight is the same wave started later.

Take $y = \\sin\\left(x + \\frac{\\pi}{6}\\right)$, which is $f\\left(x - \\left(-\\frac{\\pi}{6}\\right)\\right)$ for $f = \\sin$. So the graph of $y = \\sin x$ moves left $\\frac{\\pi}{6}$. Its highest point $\\left(\\frac{\\pi}{2}, 1\\right)$ moves to $x = \\frac{\\pi}{2} - \\frac{\\pi}{6} = \\frac{\\pi}{3}$, and indeed

$$\\sin\\left(\\frac{\\pi}{3} + \\frac{\\pi}{6}\\right) = \\sin \\frac{\\pi}{2} = 1.$$

Every key point moves by the same amount, and the heights, the midline and the period stay as they were.`,
    `由函数的水平平移可知，$y = f(x - h)$ 的图象是把 $y = f(x)$ 的图象向右平移 $h$ 个单位。对波形来说，这改变的是事情发生的时刻：在凌晨三点而不是午夜涨潮的潮汐，就是同一个波晚一些开始。

以 $y = \\sin\\left(x + \\frac{\\pi}{6}\\right)$ 为例，对 $f = \\sin$ 它就是 $f\\left(x - \\left(-\\frac{\\pi}{6}\\right)\\right)$。所以 $y = \\sin x$ 的图象向左平移 $\\frac{\\pi}{6}$。它的最高点 $\\left(\\frac{\\pi}{2}, 1\\right)$ 移到 $x = \\frac{\\pi}{2} - \\frac{\\pi}{6} = \\frac{\\pi}{3}$，确实

$$\\sin\\left(\\frac{\\pi}{3} + \\frac{\\pi}{6}\\right) = \\sin \\frac{\\pi}{2} = 1.$$

每个关键点都移动相同的量，高度、中线和周期都保持不变。`,
  ),
  knowledgePoints: [
    {
      id: "describing-horizontal-translations",
      figure: waveDrawings["horizontal-translations-of-trigonometric-functions#describing-horizontal-translations"],
      title: t("Describing the shift", "描述平移"),
      explanation: t(
        "Replacing $x$ by $x - c$ shifts a graph **right** $c$ units: the graph of $y = \\sin(x - c)$ takes at $x$ the value $y = \\sin x$ takes at $x - c$, so every point moves $c$ to the right. Replacing $x$ by $x + c$ shifts it **left** $c$ units. For trigonometric functions the shift is usually a multiple of $\\pi$.\n\nFor example, $y = \\cos\\left(x + \\frac{\\pi}{3}\\right)$ is the graph of $y = \\cos x$ shifted left $\\frac{\\pi}{3}$ units: the sign inside is the opposite of the direction.\n\n> **Watch out.** The sign inside is the opposite of the direction: $x - c$ moves the graph right and $x + c$ moves it left. A constant outside, as in $y = \\sin x + c$, moves it up or down instead.",
        "把 $x$ 换成 $x - c$ 使图象**向右**平移 $c$ 个单位：$y = \\sin(x - c)$ 在 $x$ 处的值等于 $y = \\sin x$ 在 $x - c$ 处的值，所以每个点都向右移动 $c$。把 $x$ 换成 $x + c$ 则使图象**向左**平移 $c$ 个单位。对三角函数，平移量通常是 $\\pi$ 的倍数。\n\n例如，$y = \\cos\\left(x + \\frac{\\pi}{3}\\right)$ 的图象是把 $y = \\cos x$ 的图象向左平移 $\\frac{\\pi}{3}$ 个单位：括号里的符号与平移方向相反。\n\n> **注意。**括号内的符号与方向相反：$x - c$ 使图象向右移动，$x + c$ 使它向左移动。而加在外面的常数，如 $y = \\sin x + c$，则使图象上下移动。",
      ),
      generate(rng) {
        const f = rng.pick(sinCos);
        const c = signedPick(rng, shifts);
        const w = wave(f, 1, 1, c);
        const k = piTex(c.abs());
        const dir = c.sign() > 0 ? t("right", "右") : t("left", "左");
        const op = c.sign() > 0 ? "-" : "+";
        const top = f === "sin" ? q(1, 2) : Q.zero;
        const solution = join(
          label(1, "Find the constant inside", "找出括号内的常数"),
          t(
            `In $y = ${waveTex(w)}$ the input of $\\${f}$ is $x ${op} ${k}$. The constant changes $x$ before the function acts, so it moves the graph sideways.`,
            `在 $y = ${waveTex(w)}$ 中，$\\${f}$ 的输入是 $x ${op} ${k}$。这个常数在函数作用之前改变 $x$，所以它使图象左右移动。`,
          ),
          para,
          label(2, "Read the direction", "读出方向"),
          t(
            `The new graph takes at $x$ the value the old one takes at $x ${op} ${k}$, so each point arrives ${c.sign() > 0 ? "later" : "earlier"}. That is a shift ${dir.en} $${k}$ units, opposite to the sign inside.`,
            `新图象在 $x$ 处的值等于原图象在 $x ${op} ${k}$ 处的值，所以每个点都${c.sign() > 0 ? "推后" : "提前"}出现。这就是向${dir["zh-CN"]}平移 $${k}$ 个单位，方向与括号内的符号相反。`,
          ),
          said(
            `The highest point of $y = \\${f} x$ at $x = ${piTex(top)}$ should move to $x = ${piTex(top.add(c))}$. There the input is $${piTex(top.add(c))} ${op} ${k} = ${piTex(top)}$. The ${fnNames[f].en} of that input is $1$, so the new graph is highest there.`,
            `$y = \\${f} x$ 在 $x = ${piTex(top)}$ 处的最高点应移到 $x = ${piTex(top.add(c))}$。在那里输入为 $${piTex(top.add(c))} ${op} ${k} = ${piTex(top)}$，而 $\\${f}\\left(${piTex(top)}\\right) = 1$，所以新图象在那里最高。`,
          ),
        );
        const opposite = t(
          `The sign inside is the opposite of the direction: $x ${op} ${k}$ moves the graph ${dir.en}.`,
          `括号内的符号与方向相反：$x ${op} ${k}$ 使图象向${dir["zh-CN"]}移动。`,
        );
        const vertical = t(
          "The constant is inside the function, added to $x$, so the graph moves sideways, not up or down.",
          "常数在函数里面，加在 $x$ 上，所以图象左右移动，而不是上下移动。",
        );
        const outside = t(
          "A constant added outside the function moves the graph up or down, not sideways.",
          "加在函数外面的常数使图象上下移动，而不是左右移动。",
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
            [opposite, vertical, vertical],
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
          [
            t(
              `It shifts the graph ${c.sign() > 0 ? "left" : "right"}: the sign inside is the opposite of the direction.`,
              `它使图象向${c.sign() > 0 ? "左" : "右"}平移：括号内的符号与方向相反。`,
            ),
            outside,
            outside,
          ],
        );
      },
    },
    {
      id: "key-points-after-a-horizontal-translation",
      figure: waveDrawings["horizontal-translations-of-trigonometric-functions#key-points-after-a-horizontal-translation"],
      title: t("Key points after the shift", "平移后的关键点"),
      explanation: t(
        "A horizontal shift moves every key point by the same amount. The maximum points of $y = \\sin x$ are at $x = \\frac{\\pi}{2} + 2k\\pi$, so those of $y = \\sin\\left(x - \\frac{\\pi}{3}\\right)$, shifted right $\\frac{\\pi}{3}$, are at\n\n$$x = \\frac{\\pi}{2} + \\frac{\\pi}{3} + 2k\\pi = \\frac{5\\pi}{6} + 2k\\pi.$$\n\nThe smallest positive one is $\\frac{5\\pi}{6}$. Equivalently, set the inside equal to the angles where sine is $1$: $x - \\frac{\\pi}{3} = \\frac{\\pi}{2} + 2k\\pi$.\n\n> **Watch out.** For $y = \\sin(x - c)$ the key points move right, so their $x$-values grow by $c$; subtracting $c$ moves them the wrong way. Also give the smallest positive one: a key point with a negative $x$ must be moved on by a period.",
        "水平平移使每个关键点移动相同的量。$y = \\sin x$ 的最大值点在 $x = \\frac{\\pi}{2} + 2k\\pi$，所以向右平移 $\\frac{\\pi}{3}$ 后，$y = \\sin\\left(x - \\frac{\\pi}{3}\\right)$ 的最大值点在\n\n$$x = \\frac{\\pi}{2} + \\frac{\\pi}{3} + 2k\\pi = \\frac{5\\pi}{6} + 2k\\pi.$$\n\n最小的正值是 $\\frac{5\\pi}{6}$。也可以令括号内等于正弦为 $1$ 的角：$x - \\frac{\\pi}{3} = \\frac{\\pi}{2} + 2k\\pi$。\n\n> **注意。**对 $y = \\sin(x - c)$，关键点向右移动，所以它们的 $x$ 值增加 $c$；减去 $c$ 就移错了方向。还要给出最小的正值：$x$ 为负的关键点要再移动一个周期。",
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
        "To read a horizontal shift from a graph, find a key point and compare it with the same point of the original wave. The figure shows $y = \\cos\\left(x - \\frac{\\pi}{4}\\right)$: its highest point nearest the $y$-axis is at $x = \\frac{\\pi}{4}$ instead of $x = 0$, so the cosine wave is shifted right $\\frac{\\pi}{4}$. A shifted cosine can also look like a shifted sine, so check each option against the key points.\n\n> **Watch out.** A shift right and the same shift left look alike at a glance. Locate the highest point nearest the $y$-axis and check on which side it moved.",
        "要从图象读出水平平移，找一个关键点，与原波形的对应点比较。图中是 $y = \\cos\\left(x - \\frac{\\pi}{4}\\right)$：离 $y$ 轴最近的最高点在 $x = \\frac{\\pi}{4}$ 而不是 $x = 0$，所以余弦波向右平移了 $\\frac{\\pi}{4}$。平移后的余弦波也可能看起来像平移后的正弦波，所以要用关键点逐一检验选项。\n\n> **注意。**向右平移与向左平移同样的量乍看相似。找出离 $y$ 轴最近的最高点，看它移到了哪一侧。",
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
  intro: t(
    `From horizontal stretches of functions you know that $y = f(bx)$ squeezes the graph of $y = f(x)$ toward the $y$-axis by the factor $b$. For a wave this changes how often it repeats: a higher note vibrates more times per second, and a model of a day must repeat every $24$ hours, not every $2\\pi$.

Take $y = \\cos 3x$. The cosine completes one cycle while its input runs from $0$ to $2\\pi$. Here the input is $3x$, and $3x$ runs from $0$ to $2\\pi$ while $x$ runs only from $0$ to $\\frac{2\\pi}{3}$. So the wave repeats every

$$\\frac{2\\pi}{3}.$$

That is three times as often as $y = \\cos x$. Its highest points are at $x = 0, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\ldots$, and its height is unchanged.`,
    `由函数的水平伸缩可知，$y = f(bx)$ 把 $y = f(x)$ 的图象向 $y$ 轴压缩为原来的 $\\frac{1}{b}$。对波形来说，这改变的是它重复的快慢：音越高，每秒振动的次数越多；描述一天的模型必须每 $24$ 小时重复一次，而不是每 $2\\pi$。

以 $y = \\cos 3x$ 为例。余弦在输入从 $0$ 变到 $2\\pi$ 时完成一个周期。这里输入是 $3x$，而当 $x$ 只从 $0$ 变到 $\\frac{2\\pi}{3}$ 时，$3x$ 就从 $0$ 变到了 $2\\pi$。所以波形每隔

$$\\frac{2\\pi}{3}$$

重复一次，频率是 $y = \\cos x$ 的三倍。它的最高点在 $x = 0, \\frac{2\\pi}{3}, \\frac{4\\pi}{3}, \\ldots$，高度不变。`,
  ),
  knowledgePoints: [
    {
      id: "the-period-of-y-sin-bx",
      title: t("The period of y = sin bx", "y = sin bx 的周期"),
      explanation: t(
        "Replacing $x$ by $bx$ with $b > 0$ compresses a graph horizontally by the factor $b$ (stretches it when $b < 1$). The wave $y = \\sin bx$ completes one cycle while $bx$ runs from $0$ to $2\\pi$, that is, while $x$ runs from $0$ to $\\frac{2\\pi}{b}$. So the **period** of $y = \\sin bx$ and of $y = \\cos bx$ is\n\n$$P = \\frac{2\\pi}{b}.$$\n\nFor $y = \\cos 4x$: $P = \\frac{2\\pi}{4} = \\frac{\\pi}{2}$. For $y = \\sin\\left(\\frac{1}{3}x\\right)$: $P = 2\\pi \\div \\frac{1}{3} = 6\\pi$. The amplitude does not change the period.\n\n> **Watch out.** The period is $\\frac{2\\pi}{b}$, not $2\\pi b$. A larger $b$ makes the wave repeat faster, so the period gets shorter. The amplitude and the shifts do not change it.",
        "把 $x$ 换成 $bx$（$b > 0$）会使图象沿水平方向压缩为原来的 $\\frac{1}{b}$（$b < 1$ 时为拉伸）。当 $bx$ 从 $0$ 变到 $2\\pi$，即 $x$ 从 $0$ 变到 $\\frac{2\\pi}{b}$ 时，波形 $y = \\sin bx$ 完成一个周期。所以 $y = \\sin bx$ 和 $y = \\cos bx$ 的**周期**是\n\n$$P = \\frac{2\\pi}{b}.$$\n\n对 $y = \\cos 4x$：$P = \\frac{2\\pi}{4} = \\frac{\\pi}{2}$。对 $y = \\sin\\left(\\frac{1}{3}x\\right)$：$P = 2\\pi \\div \\frac{1}{3} = 6\\pi$。振幅不改变周期。\n\n> **注意。**周期是 $\\frac{2\\pi}{b}$，而不是 $2\\pi b$。$b$ 越大，波形重复得越快，所以周期越短。振幅和平移都不改变周期。",
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
        "Solving $P = \\frac{2\\pi}{b}$ for $b$ gives $b = \\frac{2\\pi}{P}$. If $y = \\sin bx$ with $b > 0$ has period $3\\pi$, then\n\n$$b = \\frac{2\\pi}{3\\pi} = \\frac{2}{3}.$$\n\nA wave that completes one full cycle from $x = 0$ to $x = P$ has period $P$.\n\n> **Watch out.** Solving $P = \\frac{2\\pi}{b}$ gives $b = \\frac{2\\pi}{P}$. Writing $b = \\frac{P}{2}$ or $b = \\frac{1}{P}$ turns the relation upside down or drops the $2\\pi$.",
        "由 $P = \\frac{2\\pi}{b}$ 解出 $b$ 得 $b = \\frac{2\\pi}{P}$。若 $y = \\sin bx$（$b > 0$）的周期是 $3\\pi$，则\n\n$$b = \\frac{2\\pi}{3\\pi} = \\frac{2}{3}.$$\n\n从 $x = 0$ 到 $x = P$ 恰好完成一个完整周期的波形，周期为 $P$。\n\n> **注意。**由 $P = \\frac{2\\pi}{b}$ 解得 $b = \\frac{2\\pi}{P}$。写成 $b = \\frac{P}{2}$ 或 $b = \\frac{1}{P}$，要么把关系颠倒了，要么丢了 $2\\pi$。",
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
          solution: join(
            label(1, "Relate b to the period", "建立 b 与周期的关系"),
            t(
              `One cycle of $y = \\${f} bx$ is completed while $bx$ runs through $2\\pi$. So the period is $P = \\frac{2\\pi}{b}$, and here $P = ${P}$.`,
              `当 $bx$ 走过 $2\\pi$ 时，$y = \\${f} bx$ 完成一个周期。所以周期 $P = \\frac{2\\pi}{b}$，这里 $P = ${P}$。`,
            ),
            para,
            label(2, "Solve for b", "解出 b"),
            both(
              "Multiply both sides by $b$ and divide by $P$:",
              "两边同乘 $b$ 再除以 $P$：",
              `b = \\frac{2\\pi}{P} = \\frac{2\\pi}{${P}} = ${b.toLatex()}`,
            ),
            said(
              `With $b = ${b.toLatex()}$ the period is $\\frac{2\\pi}{${b.toLatex()}} = ${P}$. That is the given period.`,
              `当 $b = ${b.toLatex()}$ 时，周期为 $\\frac{2\\pi}{${b.toLatex()}} = ${P}$，与已知相符。`,
            ),
          ),
          wrong: [p.div(Q.of(2)), Q.one.div(p), p, p.mul(Q.of(2))],
        });
      },
    },
    {
      id: "matching-graphs-of-horizontal-stretches",
      title: t("Matching graphs", "匹配图象"),
      explanation: t(
        "Read the period from a graph as the horizontal distance between two neighboring highest points, then use $b = \\frac{2\\pi}{P}$. The figure shows $y = \\sin 2x$: its highest points are $\\pi$ apart, so $P = \\pi$ and $b = \\frac{2\\pi}{\\pi} = 2$.\n\n> **Watch out.** $b = 2$ halves the period and $b = \\frac{1}{2}$ doubles it. Measure the distance between neighboring highest points before choosing.",
        "从图象读周期：两个相邻最高点之间的水平距离，再用 $b = \\frac{2\\pi}{P}$。图中是 $y = \\sin 2x$：它的最高点相距 $\\pi$，所以 $P = \\pi$，$b = \\frac{2\\pi}{\\pi} = 2$。\n\n> **注意。**$b = 2$ 使周期减半，$b = \\frac{1}{2}$ 使周期加倍。选择之前先量出相邻最高点之间的距离。",
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

/** shiftSolution reads the horizontal shift of a wave whose input is written as b(x − c). */
function shiftSolution(w: Wave): Text {
  const op = w.c.sign() > 0 ? "-" : "+";
  const k = piTex(w.c.abs());
  const dir = w.c.sign() > 0 ? t("right", "右") : t("left", "左");
  return join(
    label(1, "Factor out b", "提出 b"),
    t(
      `The input is written as $${w.b.toLatex()}\\left(x ${op} ${k}\\right)$, with $b = ${w.b.toLatex()}$ already factored out. Inside the parentheses $x$ is replaced by $x ${op} ${k}$.`,
      `输入写成了 $${w.b.toLatex()}\\left(x ${op} ${k}\\right)$，$b = ${w.b.toLatex()}$ 已经提出。括号里 $x$ 被换成了 $x ${op} ${k}$。`,
    ),
    para,
    label(2, "Read the direction", "读出方向"),
    t(
      `Replacing $x$ by $x ${op} ${k}$ shifts a graph ${dir.en} $${k}$ units, opposite to the sign. The factor $${w.b.toLatex()}$ squeezes the wave about the shifted point but does not move it.`,
      `把 $x$ 换成 $x ${op} ${k}$ 使图象向${dir["zh-CN"]}平移 $${k}$ 个单位，方向与符号相反。系数 $${w.b.toLatex()}$ 以平移后的点为中心挤压波形，但不移动它。`,
    ),
    said(
      `The unshifted wave has input $0$ at $x = 0$. The shifted wave has input $0$ where $${w.b.toLatex()}\\left(x ${op} ${k}\\right) = 0$. That happens at $x = ${piTex(w.c)}$. So the point at $x = 0$ has moved ${dir.en} to $x = ${piTex(w.c)}$.`,
      `未平移的波形在 $x = 0$ 处输入为 $0$。平移后的波形在 $${w.b.toLatex()}\\left(x ${op} ${k}\\right) = 0$ 处，即 $x = ${piTex(w.c)}$ 处输入为 $0$。所以 $x = 0$ 处的点向${dir["zh-CN"]}移到了 $x = ${piTex(w.c)}$。`,
    ),
  );
}

/** shiftWhys explains the wrong shifts offered with a wave: the opposite direction, and the shift b·c read before factoring b out, in both directions. */
function shiftWhys(w: Wave): Text[] {
  const bc = piTex(w.b.mul(w.c).abs());
  const k = piTex(w.c.abs());
  const unfactored = t(
    `The amount $${bc}$ is $b$ times the shift. It is read before $b = ${w.b.toLatex()}$ is factored out of the input. The shift is $${bc} \\div ${w.b.toLatex()} = ${k}$.`,
    `$${bc}$ 是平移量的 $b$ 倍，是在从输入中提出 $b = ${w.b.toLatex()}$ 之前读出的。平移量是 $${bc} \\div ${w.b.toLatex()} = ${k}$。`,
  );
  return [
    t(
      `The direction is opposite to the sign inside: $x ${w.c.sign() > 0 ? "-" : "+"} ${k}$ means ${w.c.sign() > 0 ? "right" : "left"}.`,
      `方向与括号内的符号相反：$x ${w.c.sign() > 0 ? "-" : "+"} ${k}$ 表示向${w.c.sign() > 0 ? "右" : "左"}。`,
    ),
    unfactored,
    t(
      `Two mistakes: the amount $${bc}$ is read before $b$ is factored out, and the direction is flipped.`,
      `两个错误：$${bc}$ 是在提出 $b$ 之前读出的，方向也反了。`,
    ),
  ];
}

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
  intro: t(
    `You can now shift and stretch a wave one way at a time, and from combining graph transformations you know how several of them act together. One formula, $y = a\\sin(b(x - c)) + d$, carries all four at once, so a single equation can describe any smooth wave: its height, how often it repeats, when it starts and where its center is.

Take $y = 2\\sin\\left(3\\left(x - \\frac{\\pi}{6}\\right)\\right) + 1$. Each number has its own job:

$$a = 2, \\qquad b = 3, \\qquad c = \\frac{\\pi}{6}, \\qquad d = 1.$$

So the amplitude is $2$, the period is $\\frac{2\\pi}{3}$, the graph is shifted right $\\frac{\\pi}{6}$, and the midline is $y = 1$. The plain sine crosses its midline going up at $x = 0$; this one does so at $x = \\frac{\\pi}{6}$, where $y = 2\\sin 0 + 1 = 1$.`,
    `你已经会一次做一种平移或伸缩，并且由图象变换的组合知道几种变换如何共同作用。一个公式 $y = a\\sin(b(x - c)) + d$ 同时包含这四种变换，所以一个方程就能描述任意光滑的波：它的高度、重复的快慢、开始的时刻和中心的位置。

以 $y = 2\\sin\\left(3\\left(x - \\frac{\\pi}{6}\\right)\\right) + 1$ 为例。每个数各管一件事：

$$a = 2, \\qquad b = 3, \\qquad c = \\frac{\\pi}{6}, \\qquad d = 1.$$

所以振幅是 $2$，周期是 $\\frac{2\\pi}{3}$，图象向右平移 $\\frac{\\pi}{6}$，中线是 $y = 1$。普通的正弦在 $x = 0$ 处上升穿过中线；这个波在 $x = \\frac{\\pi}{6}$ 处这样做，那里 $y = 2\\sin 0 + 1 = 1$。`,
  ),
  knowledgePoints: [
    {
      id: "reading-the-four-parameters",
      title: t("Reading the four parameters", "读出四个参数"),
      explanation: t(
        "In $y = a \\sin(b(x - c)) + d$ with $a, b > 0$, each parameter does one thing:\n\n| parameter | effect |\n| :--- | :--- |\n| $a$ | amplitude $a$ |\n| $b$ | period $\\frac{2\\pi}{b}$ |\n| $c$ | shift right $c$ (left when $c < 0$) |\n| $d$ | midline $y = d$ |\n\nFor $y = 3\\cos\\left(2\\left(x + \\frac{\\pi}{6}\\right)\\right) - 1$: amplitude $3$, period $\\frac{2\\pi}{2} = \\pi$, shifted left $\\frac{\\pi}{6}$, midline $y = -1$. The horizontal shift is $c$, read after factoring $b$ out of the input.\n\n> **Watch out.** Read the shift only after factoring $b$ out of the input: in $y = \\sin(2x + \\frac{\\pi}{2})$ the shift is $\\frac{\\pi}{4}$ to the left, not $\\frac{\\pi}{2}$. Keep each parameter to its own job: the midline is $d$, not $d + a$, and the amplitude is $a$, not $b$.",
        "在 $a, b > 0$ 的 $y = a \\sin(b(x - c)) + d$ 中，每个参数各起一个作用：\n\n| 参数 | 作用 |\n| :--- | :--- |\n| $a$ | 振幅为 $a$ |\n| $b$ | 周期为 $\\frac{2\\pi}{b}$ |\n| $c$ | 向右平移 $c$（$c < 0$ 时向左） |\n| $d$ | 中线为 $y = d$ |\n\n对 $y = 3\\cos\\left(2\\left(x + \\frac{\\pi}{6}\\right)\\right) - 1$：振幅 $3$，周期 $\\frac{2\\pi}{2} = \\pi$，向左平移 $\\frac{\\pi}{6}$，中线 $y = -1$。水平平移量是把 $b$ 从输入中提出后读出的 $c$。\n\n> **注意。**要先从输入中提出 $b$ 再读平移量：在 $y = \\sin(2x + \\frac{\\pi}{2})$ 中平移量是向左 $\\frac{\\pi}{4}$，而不是 $\\frac{\\pi}{2}$。每个参数各管一件事：中线是 $d$ 而不是 $d + a$，振幅是 $a$ 而不是 $b$。",
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
              solution: join(
                label(1, "Match the form", "对照标准形式"),
                t(
                  `The general form is $y = a\\${f}\\left(b(x - c)\\right) + d$. The given equation is $y = ${W}$. The values $b$, $c$ and $d$ change the period, the shift and the midline, which move or squeeze the wave without changing its height.`,
                  `一般形式是 $y = a\\${f}\\left(b(x - c)\\right) + d$。给定的方程是 $y = ${W}$。$b$、$c$、$d$ 分别改变周期、平移和中线，它们移动或挤压波形，但不改变它的高度。`,
                ),
                para,
                label(2, "Read a", "读出 a"),
                t(
                  `The factor in front of $\\${f}$ multiplies every height of the basic wave, so the amplitude is $a = ${a.toLatex()}$.`,
                  `$\\${f}$ 前面的系数把基本波形的每个高度都乘以它，所以振幅是 $a = ${a.toLatex()}$。`,
                ),
                said(
                  `The maximum is $${d} + ${a.toLatex()} = ${Q.of(d).add(a).toLatex()}$. The minimum is $${d} - ${a.toLatex()} = ${Q.of(d).sub(a).toLatex()}$. Half their difference is $\\frac{${Q.of(d).add(a).toLatex()} - ${paren(Q.of(d).sub(a))}}{2} = ${a.toLatex()}$.`,
                  `最大值为 $${d} + ${a.toLatex()} = ${Q.of(d).add(a).toLatex()}$，最小值为 $${d} - ${a.toLatex()} = ${Q.of(d).sub(a).toLatex()}$。两者之差的一半是 $\\frac{${Q.of(d).add(a).toLatex()} - ${paren(Q.of(d).sub(a))}}{2} = ${a.toLatex()}$。`,
                ),
              ),
              wrong: [Q.of(d), b, a.mul(Q.of(2)), Q.of(d).add(a)],
            });
          case "midline":
            return numberProblem({
              prompt: t(`Find the midline of the graph of $y = ${W}$.`, `求 $y = ${W}$ 的图象的中线。`),
              answer: d,
              solveFor: "y",
              solution: join(
                label(1, "Find the constant outside", "找出函数外面的常数"),
                t(
                  `Look at $y = ${W}$. The constant $${d}$ is added after $\\${f}$ is applied, so it is $d = ${d}$. The factor $${a.toLatex()}$ stretches the wave about its midline, and the input only moves and squeezes it sideways.`,
                  `在 $y = ${W}$ 中，常数 $${d}$ 是在作用 $\\${f}$ 之后才加的，所以 $d = ${d}$。系数 $${a.toLatex()}$ 让波形以中线为中心伸缩，括号内只使它左右移动和挤压。`,
                ),
                para,
                label(2, "Shift the midline", "平移中线"),
                t(
                  `The stretched wave has midline $y = 0$, and adding $${d}$ moves it to $y = ${d}$.`,
                  `伸缩后的波形中线是 $y = 0$，加上 $${d}$ 后移到 $y = ${d}$。`,
                ),
                said(
                  `The wave runs from $${Q.of(d).sub(a).toLatex()}$ to $${Q.of(d).add(a).toLatex()}$, and halfway between is $\\frac{${Q.of(d).sub(a).toLatex()} + ${paren(Q.of(d).add(a))}}{2} = ${d}$.`,
                  `波形从 $${Q.of(d).sub(a).toLatex()}$ 起伏到 $${Q.of(d).add(a).toLatex()}$，两者正中间是 $\\frac{${Q.of(d).sub(a).toLatex()} + ${paren(Q.of(d).add(a))}}{2} = ${d}$。`,
                ),
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
              shiftSolution(w),
              shiftWhys(w),
            );
        }
      },
    },
    {
      id: "the-shift-of-y-a-sin-bx-phi-d",
      figure: waveDrawings["combining-graph-transformations-of-sine-and-cosine#the-shift-of-y-a-sin-bx-phi-d"],
      title: t("The shift of y = a sin(bx − φ) + d", "y = a sin(bx − φ) + d 的平移"),
      explanation: t(
        "In $y = a \\sin(bx - \\varphi) + d$ the shift is **not** $\\varphi$. Factor $b$ out of the input first:\n\n$$bx - \\varphi = b\\left(x - \\frac{\\varphi}{b}\\right),$$\n\nso the graph is shifted right $\\frac{\\varphi}{b}$ (left when the sign is $+$). For $y = \\sin\\left(3x - \\frac{\\pi}{2}\\right)$: $3x - \\frac{\\pi}{2} = 3\\left(x - \\frac{\\pi}{6}\\right)$, a shift right $\\frac{\\pi}{6}$.\n\n> **Watch out.** The shift is $\\frac{\\varphi}{b}$, not $\\varphi$. The division is easy to forget because $\\varphi$ is the number you see in the equation.",
        "在 $y = a \\sin(bx - \\varphi) + d$ 中，平移量**不是** $\\varphi$。先把 $b$ 从输入中提出：\n\n$$bx - \\varphi = b\\left(x - \\frac{\\varphi}{b}\\right),$$\n\n所以图象向右平移 $\\frac{\\varphi}{b}$（符号为 $+$ 时向左）。对 $y = \\sin\\left(3x - \\frac{\\pi}{2}\\right)$：$3x - \\frac{\\pi}{2} = 3\\left(x - \\frac{\\pi}{6}\\right)$，即向右平移 $\\frac{\\pi}{6}$。\n\n> **注意。**平移量是 $\\frac{\\varphi}{b}$，而不是 $\\varphi$。因为方程里直接看到的是 $\\varphi$，所以很容易忘记除以 $b$。",
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
        const solution = join(
          label(1, "Factor b out of the input", "从输入中提出 b"),
          both(
            `The shift is read from $x - c$, so first write the input as $b$ times such a factor. Dividing $${piTex(phi)}$ by $${b.toLatex()}$ gives`,
            `平移量要从 $x - c$ 读出，所以先把输入写成 $b$ 乘这样一个因式。用 $${piTex(phi)}$ 除以 $${b.toLatex()}$ 得`,
            `${b.toLatex()}x ${op} ${piTex(phi)} = ${b.toLatex()}\\left(x ${op} ${piTex(c.abs())}\\right)`,
          ),
        );
        const tail = join(
          label(2, "Read the shift", "读出平移"),
          t(
            `So $y = ${waveTex(w)}$. Here $x$ is replaced by $x ${op} ${piTex(c.abs())}$, a shift ${c.sign() > 0 ? "right" : "left"} $${piTex(c.abs())}$ units.`,
            `所以 $y = ${waveTex(w)}$。这里 $x$ 被换成 $x ${op} ${piTex(c.abs())}$，即向${c.sign() > 0 ? "右" : "左"}平移 $${piTex(c.abs())}$ 个单位。`,
          ),
          said(
            `Expanding back gives $${b.toLatex()} \\cdot ${piTex(c.abs())} = ${piTex(phi)}$. That is the constant in the original input. The input $${b.toLatex()}x ${op} ${piTex(phi)}$ is $0$ at $x = ${piTex(c)}$. The unshifted input $${b.toLatex()}x$ is $0$ at $x = 0$. So that point has moved to $x = ${piTex(c)}$.`,
            `展开回去得 $${b.toLatex()} \\cdot ${piTex(c.abs())} = ${piTex(phi)}$，正是原输入中的常数。输入 $${b.toLatex()}x ${op} ${piTex(phi)}$ 在 $x = ${piTex(c)}$ 处为 $0$，而未平移的输入 $${b.toLatex()}x$ 在 $x = 0$ 处为 $0$。所以那个点移到了 $x = ${piTex(c)}$。`,
          ),
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
            join(solution, para, tail),
            shiftWhys(w),
          );
        return oneOf(
          rng,
          t(`Which equation is the same as $y = ${waveTex(w, true)}$?`, `哪个方程与 $y = ${waveTex(w, true)}$ 相同？`),
          eqOption(w),
          [eqOption(wave(f, a, b, c.mul(b), d)), eqOption(wave(f, a, b, c.neg(), d)), eqOption(wave(f, a, b, c.mul(b).neg(), d))],
          join(solution, para, tail),
          [
            t(
              `Expanding it gives the constant $${b.toLatex()} \\cdot ${piTex(phi)}$, not $${piTex(phi)}$: the constant $${piTex(phi)}$ was not divided by $${b.toLatex()}$.`,
              `展开它得到的常数是 $${b.toLatex()} \\cdot ${piTex(phi)}$，而不是 $${piTex(phi)}$：没有把 $${piTex(phi)}$ 除以 $${b.toLatex()}$。`,
            ),
            t("The sign inside the parentheses is flipped.", "括号内的符号反了。"),
            t(
              `Both mistakes: the constant was not divided by $${b.toLatex()}$, and the sign is flipped.`,
              `两个错误：常数没有除以 $${b.toLatex()}$，符号也反了。`,
            ),
          ],
        );
      },
    },
    {
      id: "matching-graphs-of-combined-transformations",
      title: t("Matching graphs", "匹配图象"),
      explanation: t(
        "Read a transformed wave in four steps: the midline $d$ halfway between the highest and lowest values; the amplitude $a$ from the midline to the top; the period from one highest point to the next, giving $b = \\frac{2\\pi}{P}$; and the shift from where a key point has moved. The figure shows $y = 2\\sin\\left(\\frac{1}{2}\\left(x - \\frac{\\pi}{2}\\right)\\right) + 1$: midline $y = 1$, amplitude $2$, period $4\\pi$, and it crosses its midline rising at $x = \\frac{\\pi}{2}$ instead of $x = 0$.\n\n> **Watch out.** Several options may share three of the four features. Check all four: the midline, the amplitude, the period and the position of one key point.",
        "分四步读出变换后的波形：中线 $d$ 位于最高值与最低值的正中间；振幅 $a$ 是中线到最高处的距离；周期是相邻两个最高点的距离，由此 $b = \\frac{2\\pi}{P}$；平移量看某个关键点移动了多少。图中是 $y = 2\\sin\\left(\\frac{1}{2}\\left(x - \\frac{\\pi}{2}\\right)\\right) + 1$：中线 $y = 1$，振幅 $2$，周期 $4\\pi$，并且在 $x = \\frac{\\pi}{2}$ 而不是 $x = 0$ 处上升穿过中线。\n\n> **注意。**几个选项可能有四个特征中的三个相同。四个都要检查：中线、振幅、周期和一个关键点的位置。",
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
  intro: t(
    `The shifts and stretches you used on sine and cosine work on any function, including $y = \\tan x$ and $y = \\cot x$. Two things are new. These functions repeat every $\\pi$, not $2\\pi$, and their graphs have vertical asymptotes, which move with the graph.

Take $y = \\tan\\left(x - \\frac{\\pi}{4}\\right)$, the graph of $y = \\tan x$ shifted right $\\frac{\\pi}{4}$. The asymptote of $y = \\tan x$ at $x = \\frac{\\pi}{2}$ moves to

$$x = \\frac{\\pi}{2} + \\frac{\\pi}{4} = \\frac{3\\pi}{4}.$$

The point $(0, 0)$ moves to $\\left(\\frac{\\pi}{4}, 0\\right)$, and the branches are still $\\pi$ apart. A vertical shift, by contrast, would move the points up or down and leave the asymptotes alone.`,
    `你用在正弦和余弦上的平移与伸缩对任何函数都适用，包括 $y = \\tan x$ 与 $y = \\cot x$。新的地方有两点：这两个函数每隔 $\\pi$ 而不是 $2\\pi$ 重复一次；它们的图象有竖直渐近线，渐近线随图象一起移动。

以 $y = \\tan\\left(x - \\frac{\\pi}{4}\\right)$ 为例，它是把 $y = \\tan x$ 的图象向右平移 $\\frac{\\pi}{4}$。$y = \\tan x$ 在 $x = \\frac{\\pi}{2}$ 处的渐近线移到

$$x = \\frac{\\pi}{2} + \\frac{\\pi}{4} = \\frac{3\\pi}{4}.$$

点 $(0, 0)$ 移到 $\\left(\\frac{\\pi}{4}, 0\\right)$，各分支仍相距 $\\pi$。相比之下，竖直平移会使点上下移动，而渐近线不动。`,
  ),
  knowledgePoints: [
    {
      id: "the-period-of-y-tan-bx",
      title: t("The period of y = tan bx", "y = tan bx 的周期"),
      explanation: t(
        "The functions $y = \\tan x$ and $y = \\cot x$ have period $\\pi$, not $2\\pi$. Replacing $x$ by $bx$ with $b > 0$ divides the period by $b$:\n\n$$P = \\frac{\\pi}{b}.$$\n\nFor $y = \\tan 3x$: $P = \\frac{\\pi}{3}$, and the asymptotes are $\\frac{\\pi}{3}$ apart. For $y = 2\\cot\\left(\\frac{1}{2}x\\right)$: $P = \\pi \\div \\frac{1}{2} = 2\\pi$. A vertical stretch does not change the period.\n\n> **Watch out.** Tangent and cotangent repeat every $\\pi$, not $2\\pi$, so the period of $y = \\tan bx$ is $\\frac{\\pi}{b}$. Using $\\frac{2\\pi}{b}$ doubles it.",
        "函数 $y = \\tan x$ 与 $y = \\cot x$ 的周期是 $\\pi$，而不是 $2\\pi$。把 $x$ 换成 $bx$（$b > 0$）会把周期除以 $b$：\n\n$$P = \\frac{\\pi}{b}.$$\n\n对 $y = \\tan 3x$：$P = \\frac{\\pi}{3}$，渐近线相距 $\\frac{\\pi}{3}$。对 $y = 2\\cot\\left(\\frac{1}{2}x\\right)$：$P = \\pi \\div \\frac{1}{2} = 2\\pi$。竖直伸缩不改变周期。\n\n> **注意。**正切与余切每隔 $\\pi$ 重复一次，而不是 $2\\pi$，所以 $y = \\tan bx$ 的周期是 $\\frac{\\pi}{b}$。用 $\\frac{2\\pi}{b}$ 会把它算成两倍。",
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
        "The asymptotes of $y = \\tan x$ are at $x = \\frac{\\pi}{2} + k\\pi$, and those of $y = \\cot x$ at $x = k\\pi$. A horizontal shift moves them with the graph; a vertical shift does not move them at all.\n\nFor $y = \\cot\\left(x + \\frac{\\pi}{3}\\right) + 2$: the asymptotes are where $x + \\frac{\\pi}{3} = k\\pi$, that is $x = -\\frac{\\pi}{3} + k\\pi$. The smallest positive one is $x = \\frac{2\\pi}{3}$.\n\n> **Watch out.** The asymptotes move sideways with the graph, opposite to the sign inside. The vertical shift $d$ moves the graph up or down but leaves every asymptote where it is.",
        "$y = \\tan x$ 的渐近线在 $x = \\frac{\\pi}{2} + k\\pi$，$y = \\cot x$ 的渐近线在 $x = k\\pi$。水平平移使它们随图象一起移动；竖直平移则完全不移动它们。\n\n对 $y = \\cot\\left(x + \\frac{\\pi}{3}\\right) + 2$：渐近线在 $x + \\frac{\\pi}{3} = k\\pi$ 处，即 $x = -\\frac{\\pi}{3} + k\\pi$。最小的正值是 $x = \\frac{2\\pi}{3}$。\n\n> **注意。**渐近线随图象左右移动，方向与括号内的符号相反。竖直平移 $d$ 使图象上下移动，但每条渐近线都留在原处。",
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
        "Tangent rises on each branch and passes through a point on its midline halfway between two asymptotes; cotangent falls. After a vertical shift by $d$ that point is at height $d$; after a horizontal shift the asymptotes move; after a stretch by $a$ the points a quarter period from it are at height $d \\pm a$. The figure shows $y = \\tan\\left(\\frac{1}{2}x\\right)$: the asymptotes are $2\\pi$ apart, at $x = \\pm\\pi$.\n\n> **Watch out.** Tangent rises from left to right on each branch and cotangent falls. Check the direction of a branch before reading the shift.",
        "正切的每一支都上升，并在两条渐近线正中间经过中线上的一点；余切则下降。竖直平移 $d$ 后，该点的高度为 $d$；水平平移后渐近线移动；竖直伸缩 $a$ 倍后，距该点四分之一周期的点的高度为 $d \\pm a$。图中是 $y = \\tan\\left(\\frac{1}{2}x\\right)$：渐近线相距 $2\\pi$，在 $x = \\pm\\pi$ 处。\n\n> **注意。**正切在每个分支上从左到右上升，余切则下降。读平移量之前先看分支的走向。",
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
  intro: t(
    `For sine and cosine you combined all four transformations in $y = a\\sin(b(x - c)) + d$. Tangent and cotangent take the same form, $y = a\\tan(b(x - c)) + d$, with one change: the basic period is $\\pi$, so the period becomes $\\frac{\\pi}{b}$. Knowing the period and one asymptote places every branch.

Take $y = 3\\tan\\left(\\frac{1}{2}\\left(x + \\frac{\\pi}{2}\\right)\\right) - 1$. The period is

$$\\pi \\div \\frac{1}{2} = 2\\pi.$$

The asymptotes come where the input is $\\frac{\\pi}{2} + k\\pi$, that is where $\\frac{1}{2}\\left(x + \\frac{\\pi}{2}\\right) = \\frac{\\pi}{2}$ and so on, which gives $x = \\frac{\\pi}{2} + 2k\\pi$. Halfway between two asymptotes, at $x = -\\frac{\\pi}{2}$, the input is $0$ and $y = 3 \\cdot 0 - 1 = -1$: the center of a branch sits at the height $d = -1$.`,
    `对正弦和余弦，你把四种变换组合成了 $y = a\\sin(b(x - c)) + d$。正切与余切有同样的形式 $y = a\\tan(b(x - c)) + d$，只有一处变化：基本周期是 $\\pi$，所以周期变为 $\\frac{\\pi}{b}$。知道了周期和一条渐近线，就能确定每个分支。

以 $y = 3\\tan\\left(\\frac{1}{2}\\left(x + \\frac{\\pi}{2}\\right)\\right) - 1$ 为例。周期是

$$\\pi \\div \\frac{1}{2} = 2\\pi.$$

渐近线在输入为 $\\frac{\\pi}{2} + k\\pi$ 处，即 $\\frac{1}{2}\\left(x + \\frac{\\pi}{2}\\right) = \\frac{\\pi}{2}$ 等处，得 $x = \\frac{\\pi}{2} + 2k\\pi$。在两条渐近线正中间的 $x = -\\frac{\\pi}{2}$ 处，输入为 $0$，$y = 3 \\cdot 0 - 1 = -1$：分支的中心位于高度 $d = -1$。`,
  ),
  knowledgePoints: [
    {
      id: "the-period-of-a-combined-tangent",
      title: t("The period", "周期"),
      explanation: t(
        "In $y = a \\tan(b(x - c)) + d$ only $b$ changes the period, which is $\\frac{\\pi}{b}$; $a$ stretches the branches, $c$ shifts them sideways and $d$ moves the point of symmetry of each branch to height $d$. For $y = 4\\cot\\left(3\\left(x - \\frac{\\pi}{4}\\right)\\right) - 2$ the period is $\\frac{\\pi}{3}$.\n\n> **Watch out.** Only $b$ changes the period, $P = \\frac{\\pi}{b}$. The coefficient, the horizontal shift and the vertical shift do not change it.",
        "在 $y = a \\tan(b(x - c)) + d$ 中只有 $b$ 改变周期，周期为 $\\frac{\\pi}{b}$；$a$ 伸缩各分支，$c$ 使它们左右移动，$d$ 把每一支的对称中心移到高度 $d$。$y = 4\\cot\\left(3\\left(x - \\frac{\\pi}{4}\\right)\\right) - 2$ 的周期是 $\\frac{\\pi}{3}$。\n\n> **注意。**只有 $b$ 改变周期，$P = \\frac{\\pi}{b}$。系数、水平平移和竖直平移都不改变它。",
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
        "Let $\\theta = b(x - c)$. The graph of $y = a \\tan \\theta + d$ has asymptotes where $\\tan \\theta$ is not defined, $\\theta = \\frac{\\pi}{2} + k\\pi$ (for cotangent, $\\theta = k\\pi$). Solve for $x$:\n\nFor $y = \\tan\\left(2\\left(x - \\frac{\\pi}{6}\\right)\\right)$: $2\\left(x - \\frac{\\pi}{6}\\right) = \\frac{\\pi}{2} + k\\pi$ gives $x = \\frac{\\pi}{6} + \\frac{\\pi}{4} + \\frac{k\\pi}{2} = \\frac{5\\pi}{12} + \\frac{k\\pi}{2}$. The smallest positive asymptote is $x = \\frac{5\\pi}{12}$.\n\n> **Watch out.** Solve for $x$ with $b$ included: set $b(x - c)$ equal to the asymptote angles and divide the step $k\\pi$ by $b$ too. The asymptotes are $\\frac{\\pi}{b}$ apart, not $\\pi$.",
        "令 $\\theta = b(x - c)$。$y = a \\tan \\theta + d$ 的图象在 $\\tan \\theta$ 无定义处，即 $\\theta = \\frac{\\pi}{2} + k\\pi$ 处，有渐近线（余切为 $\\theta = k\\pi$）。解出 $x$：\n\n对 $y = \\tan\\left(2\\left(x - \\frac{\\pi}{6}\\right)\\right)$：由 $2\\left(x - \\frac{\\pi}{6}\\right) = \\frac{\\pi}{2} + k\\pi$ 得 $x = \\frac{\\pi}{6} + \\frac{\\pi}{4} + \\frac{k\\pi}{2} = \\frac{5\\pi}{12} + \\frac{k\\pi}{2}$。最小的正渐近线是 $x = \\frac{5\\pi}{12}$。\n\n> **注意。**解 $x$ 时要带上 $b$：令 $b(x - c)$ 等于渐近线对应的角，并把步长 $k\\pi$ 也除以 $b$。渐近线相距 $\\frac{\\pi}{b}$，而不是 $\\pi$。",
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
        "Find the asymptotes and their spacing (the period $\\frac{\\pi}{b}$), the point of each branch at height $d$ halfway between two asymptotes, and the points a quarter period away at heights $d \\pm a$. The figure shows $y = 2\\tan\\left(x - \\frac{\\pi}{4}\\right) + 1$: asymptotes $\\pi$ apart at $x = -\\frac{\\pi}{4}$ and $x = \\frac{3\\pi}{4}$, the point $\\left(\\frac{\\pi}{4}, 1\\right)$ and the point $\\left(\\frac{\\pi}{2}, 3\\right)$.\n\n> **Watch out.** Read the asymptote spacing for $b$, the center point of a branch for $c$ and $d$, and the height a quarter period away for $a$. Two options that differ only in the sign of the shift put the center points on opposite sides of the $y$-axis.",
        "找出渐近线及其间距（周期 $\\frac{\\pi}{b}$），每一支在两条渐近线正中间、高度为 $d$ 的点，以及距它四分之一周期、高度为 $d \\pm a$ 的点。图中是 $y = 2\\tan\\left(x - \\frac{\\pi}{4}\\right) + 1$：渐近线相距 $\\pi$，在 $x = -\\frac{\\pi}{4}$ 与 $x = \\frac{3\\pi}{4}$，经过点 $\\left(\\frac{\\pi}{4}, 1\\right)$ 和 $\\left(\\frac{\\pi}{2}, 3\\right)$。\n\n> **注意。**由渐近线的间距读 $b$，由分支的中心点读 $c$ 和 $d$，由相距四分之一周期处的高度读 $a$。只有平移符号不同的两个选项，会把中心点放在 $y$ 轴的两侧。",
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
  intro: t(
    `Secant is the reciprocal of cosine and cosecant the reciprocal of sine, so their transformed graphs follow the transformed cosine and sine waves. Where the wave touches its top, the secant branch turns there and opens upward. Where the wave touches its bottom, the branch opens downward, and where the wave would be on its midline the reciprocal has an asymptote.

Take $y = 2\\sec x - 3$, which follows the wave $y = 2\\cos x - 3$. That wave runs from $-5$ to $-1$. The secant values are at most $-1$ or at least $1$, so

$$2\\sec x - 3 \\le -5 \\quad \\text{or} \\quad 2\\sec x - 3 \\ge -1.$$

The branches turn at $(0, -1)$, opening up, and at $(\\pi, -5)$, opening down, with asymptotes where $\\cos x = 0$. The range leaves out the band strictly between $-5$ and $-1$.`,
    `正割是余弦的倒数，余割是正弦的倒数，所以它们变换后的图象跟随变换后的余弦与正弦波形。波形到达最高处时，正割的分支在那里转折并开口向上；波形到达最低处时，分支开口向下；波形本应位于中线上的地方，倒数函数有渐近线。

以 $y = 2\\sec x - 3$ 为例，它跟随波形 $y = 2\\cos x - 3$。这个波形从 $-5$ 起伏到 $-1$。正割的值不大于 $-1$ 或不小于 $1$，所以

$$2\\sec x - 3 \\le -5 \\quad \\text{或} \\quad 2\\sec x - 3 \\ge -1.$$

分支在 $(0, -1)$ 处转折并开口向上，在 $(\\pi, -5)$ 处转折并开口向下，渐近线在 $\\cos x = 0$ 处。值域中不含严格位于 $-5$ 与 $-1$ 之间的带状区域。`,
  ),
  knowledgePoints: [
    {
      id: "range-of-a-transformed-secant",
      title: t("The range", "值域"),
      explanation: t(
        "The values of $\\sec \\theta$ and $\\csc \\theta$ are at most $-1$ or at least $1$. Multiplying by $a > 0$ and adding $d$ moves these to at most $d - a$ or at least $d + a$, so the range of $y = a \\sec(b(x - c)) + d$ is\n\n$$(-\\infty, d - a] \\cup [d + a, \\infty).$$\n\nThe graph is the transformed cosine wave $y = a\\cos(b(x - c)) + d$ with each half-wave turned into a U-shaped branch outside the band between $d - a$ and $d + a$. For $y = 2\\csc 3x - 1$ the range is $(-\\infty, -3] \\cup [1, \\infty)$.\n\n> **Watch out.** The range of a secant or cosecant lies outside the band, not inside it: $(-\\infty, d - a] \\cup [d + a, \\infty)$. The interval $[d - a, d + a]$ is the range of the cosine or sine it comes from.",
        "$\\sec \\theta$ 与 $\\csc \\theta$ 的值不大于 $-1$ 或不小于 $1$。乘以 $a > 0$ 再加 $d$ 后，变为不大于 $d - a$ 或不小于 $d + a$，所以 $y = a \\sec(b(x - c)) + d$ 的值域是\n\n$$(-\\infty, d - a] \\cup [d + a, \\infty).$$\n\n它的图象是把变换后的余弦波 $y = a\\cos(b(x - c)) + d$ 的每半个波变成位于 $d - a$ 与 $d + a$ 之间的带状区域之外的 U 形分支。$y = 2\\csc 3x - 1$ 的值域是 $(-\\infty, -3] \\cup [1, \\infty)$。\n\n> **注意。**正割或余割的值域在带状区域之外，而不是之内：$(-\\infty, d - a] \\cup [d + a, \\infty)$。区间 $[d - a, d + a]$ 是它所对应的余弦或正弦的值域。",
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
          solution: join(
            label(1, "Start from the basic range", "从基本值域出发"),
            t(
              `The ${fnNames[f].en} is the reciprocal of the ${fnNames[f === "sec" ? "cos" : "sin"].en}, whose values lie between $-1$ and $1$. So the values of $\\${f} \\theta$ are at most $-1$ or at least $1$, and never strictly between. The values $b$ and $c$ in the input only squeeze and move the graph sideways, so they do not change this.`,
              `${fnNames[f]["zh-CN"]}是${fnNames[f === "sec" ? "cos" : "sin"]["zh-CN"]}的倒数，而后者的值在 $-1$ 与 $1$ 之间。所以 $\\${f} \\theta$ 的值不大于 $-1$ 或不小于 $1$，从不严格位于两者之间。输入中的 $b$ 与 $c$ 只使图象左右挤压和移动，不改变这一点。`,
            ),
            para,
            label(2, "Stretch and shift", "伸缩并平移"),
            both(
              `Multiplying by $${a.toLatex()}$ moves the two edges to $${a.neg().toLatex()}$ and $${a.toLatex()}$, and adding $${d}$ moves them to $${D.sub(a).toLatex()}$ and $${D.add(a).toLatex()}$. The range is`,
              `乘以 $${a.toLatex()}$ 使两个边界变为 $${a.neg().toLatex()}$ 与 $${a.toLatex()}$，再加 $${d}$ 后变为 $${D.sub(a).toLatex()}$ 与 $${D.add(a).toLatex()}$。值域是`,
              `(-\\infty, ${D.sub(a).toLatex()}] \\cup [${D.add(a).toLatex()}, \\infty)`,
            ),
            said(
              `Where $\\${f} \\theta = 1$ the value is $${a.toLatex()} \\cdot 1${signed(d)} = ${D.add(a).toLatex()}$. Where $\\${f} \\theta = -1$ it is $${a.toLatex()} \\cdot (-1)${signed(d)} = ${D.sub(a).toLatex()}$. These are the two edges, and the gap between them is centered on $y = ${d}$.`,
              `在 $\\${f} \\theta = 1$ 处函数值为 $${a.toLatex()} \\cdot 1${signed(d)} = ${D.add(a).toLatex()}$，在 $\\${f} \\theta = -1$ 处为 $${a.toLatex()} \\cdot (-1)${signed(d)} = ${D.sub(a).toLatex()}$。这正是两个边界，它们之间的空隙以 $y = ${d}$ 为中心。`,
            ),
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
        "The graph of $y = a \\sec \\theta + d$ has asymptotes where $\\cos \\theta = 0$, $\\theta = \\frac{\\pi}{2} + k\\pi$, and that of $y = a \\csc \\theta + d$ where $\\sin \\theta = 0$, $\\theta = k\\pi$. With $\\theta = b(x - c)$, solve for $x$.\n\nFor $y = 3\\csc\\left(\\frac{1}{2}\\left(x + \\frac{\\pi}{3}\\right)\\right)$: $\\frac{1}{2}\\left(x + \\frac{\\pi}{3}\\right) = k\\pi$ gives $x = -\\frac{\\pi}{3} + 2k\\pi$, so the smallest positive asymptote is $x = \\frac{5\\pi}{3}$.\n\n> **Watch out.** Secant has asymptotes where cosine is $0$, and cosecant where sine is $0$. Mixing them up moves every asymptote by a quarter of the basic period.",
        "$y = a \\sec \\theta + d$ 的图象在 $\\cos \\theta = 0$，即 $\\theta = \\frac{\\pi}{2} + k\\pi$ 处有渐近线；$y = a \\csc \\theta + d$ 在 $\\sin \\theta = 0$，即 $\\theta = k\\pi$ 处有渐近线。令 $\\theta = b(x - c)$，解出 $x$。\n\n对 $y = 3\\csc\\left(\\frac{1}{2}\\left(x + \\frac{\\pi}{3}\\right)\\right)$：由 $\\frac{1}{2}\\left(x + \\frac{\\pi}{3}\\right) = k\\pi$ 得 $x = -\\frac{\\pi}{3} + 2k\\pi$，所以最小的正渐近线是 $x = \\frac{5\\pi}{3}$。\n\n> **注意。**正割的渐近线在余弦为 $0$ 处，余割的渐近线在正弦为 $0$ 处。把两者弄混，每条渐近线都会错开基本周期的四分之一。",
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
        "Read the turning points of the branches: those opening up are at height $d + a$, those opening down at $d - a$, so the midline is halfway between them. The asymptotes lie halfway between neighboring turning points, and two turning points at the same height are one period apart. The figure shows $y = \\sec x + 1$: branches opening up from $(0, 2)$ and down from $(\\pi, 0)$, with asymptotes at $x = \\pm\\frac{\\pi}{2}$.\n\n> **Watch out.** The graphs of secant and cosecant are shifts of each other by a quarter period. Locate a turning point and check whether its input makes the cosine or the sine equal to $\\pm 1$.",
        "读出各分支的转折点：开口向上的在高度 $d + a$，开口向下的在 $d - a$，中线位于两者正中间。渐近线位于相邻转折点的正中间，两个高度相同的转折点相距一个周期。图中是 $y = \\sec x + 1$：分支从 $(0, 2)$ 向上开口、从 $(\\pi, 0)$ 向下开口，渐近线为 $x = \\pm\\frac{\\pi}{2}$。\n\n> **注意。**正割与余割的图象相互平移四分之一周期即可重合。找出一个转折点，检查它的输入使余弦还是正弦等于 $\\pm 1$。",
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
  intro: t(
    `From reflections of functions you know that $y = -f(x)$ flips a graph over the $x$-axis and $y = f(-x)$ flips it over the $y$-axis. For the trigonometric functions the second flip is not new: each of them is either even or odd, so a reflection in the $y$-axis either changes nothing or acts like a reflection in the $x$-axis.

Take $y = \\tan(-x)$. Tangent is odd, $\\tan(-x) = -\\tan x$, so

$$y = \\tan(-x) = -\\tan x.$$

For example, at $x = \\frac{\\pi}{4}$ both sides give $-1$. The branches of the reflected graph fall from left to right instead of rising, while the asymptotes $x = \\frac{\\pi}{2} + k\\pi$ stay where they were.`,
    `由函数的对称变换可知，$y = -f(x)$ 把图象关于 $x$ 轴翻折，$y = f(-x)$ 把图象关于 $y$ 轴翻折。对三角函数来说，第二种翻折并不新：每个三角函数要么是偶函数要么是奇函数，所以关于 $y$ 轴的对称要么不改变图象，要么相当于关于 $x$ 轴的对称。

以 $y = \\tan(-x)$ 为例。正切是奇函数，$\\tan(-x) = -\\tan x$，所以

$$y = \\tan(-x) = -\\tan x.$$

例如在 $x = \\frac{\\pi}{4}$ 处两边都等于 $-1$。对称后图象的分支从左到右下降而不是上升，渐近线 $x = \\frac{\\pi}{2} + k\\pi$ 保持不动。`,
  ),
  knowledgePoints: [
    {
      id: "reflecting-in-the-y-axis",
      figure: waveDrawings["graphing-reflections-of-trigonometric-functions#reflecting-in-the-y-axis"],
      title: t("Reflecting in the y-axis", "关于 y 轴对称"),
      explanation: t(
        "The graph of $y = -f(x)$ is the graph of $y = f(x)$ reflected in the $x$-axis, and $y = f(-x)$ is its reflection in the $y$-axis. For the trigonometric functions a reflection in the $y$-axis is the same as either nothing or a reflection in the $x$-axis:\n\n- cosine and secant are **even**: $\\cos(-x) = \\cos x$, $\\sec(-x) = \\sec x$;\n- sine, cosecant, tangent and cotangent are **odd**: $\\sin(-x) = -\\sin x$, and so on.\n\nSo $y = 3\\sin(-x) + 2$ is the same as $y = -3\\sin x + 2$, while $y = 3\\cos(-x) + 2$ is the same as $y = 3\\cos x + 2$.\n\n> **Watch out.** Use the right symmetry: cosine and secant are even, so $f(-x) = f(x)$; the other four are odd, so $f(-x) = -f(x)$. The constant outside never changes sign.",
        "$y = -f(x)$ 的图象是 $y = f(x)$ 的图象关于 $x$ 轴的对称图形，$y = f(-x)$ 则是关于 $y$ 轴的对称图形。对三角函数，关于 $y$ 轴对称要么不改变图象，要么等同于关于 $x$ 轴对称：\n\n- 余弦与正割是**偶函数**：$\\cos(-x) = \\cos x$，$\\sec(-x) = \\sec x$；\n- 正弦、余割、正切与余切是**奇函数**：$\\sin(-x) = -\\sin x$，等等。\n\n所以 $y = 3\\sin(-x) + 2$ 与 $y = -3\\sin x + 2$ 相同，而 $y = 3\\cos(-x) + 2$ 与 $y = 3\\cos x + 2$ 相同。\n\n> **注意。**要用对奇偶性：余弦和正割是偶函数，$f(-x) = f(x)$；其余四个是奇函数，$f(-x) = -f(x)$。外面的常数从不改变符号。",
      ),
      generate(rng) {
        const f = rng.pick<Fn>(["sin", "cos", "tan", "cot", "sec", "csc"]);
        const a = rng.int(1, 4);
        const d = rng.int(-4, 4);
        const A = a === 1 ? "" : String(a);
        const prompt = `${A}\\${f}(-x)${signed(d)}`;
        const opt = (s: number, dd: number) => same(`$y = ${s < 0 ? "-" : ""}${A}\\${f} x${signed(dd)}$`);
        const right = even(f) ? opt(1, d) : opt(-1, d);
        const Name = `${fnNames[f].en[0]!.toUpperCase()}${fnNames[f].en.slice(1)}`;
        const quarter: Record<Fn, readonly [string, string]> = {
          sin: ["\\frac{\\sqrt{2}}{2}", "-\\frac{\\sqrt{2}}{2}"],
          cos: ["\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{2}}{2}"],
          tan: ["1", "-1"],
          cot: ["1", "-1"],
          sec: ["\\sqrt{2}", "\\sqrt{2}"],
          csc: ["\\sqrt{2}", "-\\sqrt{2}"],
        };
        const [vPos, vNeg] = quarter[f];
        const wrongSign = t(
          `${Name} is ${even(f) ? "even" : "odd"}, so $\\${f}(-x) = ${even(f) ? "" : "-"}\\${f} x$. This option uses the other symmetry.`,
          `${fnNames[f]["zh-CN"]}函数是${even(f) ? "偶" : "奇"}函数，所以 $\\${f}(-x) = ${even(f) ? "" : "-"}\\${f} x$。这个选项用了另一种对称性。`,
        );
        const constant = t(
          `The constant $${d}$ is added outside the function. Replacing $x$ by $-x$ does not touch it, so it stays $${d}$.`,
          `常数 $${d}$ 加在函数外面。把 $x$ 换成 $-x$ 不影响它，所以它仍是 $${d}$。`,
        );
        return oneOf(
          rng,
          t(`Which equation has the same graph as $y = ${prompt}$?`, `哪个方程与 $y = ${prompt}$ 的图象相同？`),
          right,
          [opt(even(f) ? -1 : 1, d), opt(-1, -d), opt(1, -d), same(`$y = ${A}\\${partner[f]} x${signed(d)}$`)],
          join(
            label(1, "Use the symmetry of the function", "利用函数的奇偶性"),
            t(
              `${Name} is ${even(f) ? "even" : "odd"}: $\\${f}(-x) = ${even(f) ? "" : "-"}\\${f} x$ for every $x$. ${even(f) ? "Its graph is symmetric in the $y$-axis, so reflecting it in the $y$-axis changes nothing." : "Its graph is symmetric about the origin, so reflecting it in the $y$-axis is the same as reflecting it in the $x$-axis."}`,
              `${fnNames[f]["zh-CN"]}函数是${even(f) ? "偶" : "奇"}函数：对每个 $x$ 都有 $\\${f}(-x) = ${even(f) ? "" : "-"}\\${f} x$。${even(f) ? "它的图象关于 $y$ 轴对称，所以关于 $y$ 轴对称变换后不变。" : "它的图象关于原点对称，所以关于 $y$ 轴对称变换等同于关于 $x$ 轴对称变换。"}`,
            ),
            para,
            label(2, "Rewrite the equation", "改写方程"),
            t(
              `Replace $\\${f}(-x)$ by $${even(f) ? "" : "-"}\\${f} x$. So $y = ${prompt}$ is the same as $y = ${right.en.slice(5, -1)}$. Only the sign in front of $\\${f}$ can change, and the constant $${d}$ stays as it is.`,
              `把 $\\${f}(-x)$ 换成 $${even(f) ? "" : "-"}\\${f} x$。所以 $y = ${prompt}$ 与 $y = ${right.en.slice(5, -1)}$ 相同。只有 $\\${f}$ 前面的符号可能改变，常数 $${d}$ 保持不变。`,
            ),
            said(
              `Try $x = \\frac{\\pi}{4}$. The original form gives $\\${f}\\left(-\\frac{\\pi}{4}\\right) = ${vNeg}$. The rewritten form gives the same value: $${even(f) ? "" : "-"}\\${f} \\frac{\\pi}{4} = ${even(f) ? vPos : vNeg}$. So both equations give the same $y$ there.`,
              `取 $x = \\frac{\\pi}{4}$：$\\${f}\\left(-\\frac{\\pi}{4}\\right) = ${vNeg}$，而 $${even(f) ? "" : "-"}\\${f} \\frac{\\pi}{4} = ${even(f) ? vPos : vNeg}$ 也是如此。所以两个方程在那里给出相同的 $y$。`,
            ),
          ),
          [
            wrongSign,
            constant,
            constant,
            t(
              `Reflecting changes the sign of the input, not the function: $\\${f}$ does not become $\\${partner[f]}$.`,
              `对称变换改变的是输入的符号，而不是函数：$\\${f}$ 不会变成 $\\${partner[f]}$。`,
            ),
          ],
        );
      },
    },
    {
      id: "extrema-of-reflected-waves",
      figure: waveDrawings["graphing-reflections-of-trigonometric-functions#extrema-of-reflected-waves"],
      title: t("Extrema of reflected waves", "对称后波形的最值点"),
      explanation: t(
        "Reflecting in the $x$-axis swaps the highest and lowest points: $y = -\\sin x$ has its **maximum** where $\\sin x = -1$, at $x = \\frac{3\\pi}{2} + 2k\\pi$, and its minimum where $\\sin x = 1$. The midline and amplitude stay the same.\n\nFor $y = -2\\cos x + 1$: maximum $1 + 2 = 3$ where $\\cos x = -1$, so at $x = \\pi + 2k\\pi$; minimum $-1$ where $\\cos x = 1$, at $x = 2k\\pi$, so the smallest positive one is $x = 2\\pi$.\n\n> **Watch out.** After a reflection in the $x$-axis the highest points are where the original wave was lowest. Using the maximum points of the unreflected wave gives the minimum points instead.",
        "关于 $x$ 轴对称会交换最高点与最低点：$y = -\\sin x$ 在 $\\sin x = -1$ 处，即 $x = \\frac{3\\pi}{2} + 2k\\pi$ 处取得**最大值**，在 $\\sin x = 1$ 处取得最小值。中线和振幅不变。\n\n对 $y = -2\\cos x + 1$：最大值 $1 + 2 = 3$ 在 $\\cos x = -1$ 处，即 $x = \\pi + 2k\\pi$；最小值 $-1$ 在 $\\cos x = 1$ 处，即 $x = 2k\\pi$，所以最小的正值是 $x = 2\\pi$。\n\n> **注意。**关于 $x$ 轴对称之后，最高点在原波形最低的地方。用未对称波形的最大值点，得到的反而是最小值点。",
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
        "A negative coefficient turns the wave upside down about its midline. The figure shows $y = -2\\sin x + 1$: it crosses its midline $y = 1$ at $x = 0$ going **down**, where $y = 2\\sin x + 1$ would go up, and its lowest point nearest the $y$-axis on the right is $\\left(\\frac{\\pi}{2}, -1\\right)$.\n\n> **Watch out.** $y = -a\\sin x + d$ is reflected in its midline $y = d$, not in the $x$-axis, so its midline stays at $y = d$. Changing the sign of $d$ as well moves the whole graph.",
        "负系数把波形关于中线上下翻转。图中是 $y = -2\\sin x + 1$：它在 $x = 0$ 处**向下**穿过中线 $y = 1$，而 $y = 2\\sin x + 1$ 会向上穿过；它在 $y$ 轴右侧最近的最低点是 $\\left(\\frac{\\pi}{2}, -1\\right)$。\n\n> **注意。**$y = -a\\sin x + d$ 是关于中线 $y = d$ 对称，而不是关于 $x$ 轴对称，所以中线仍是 $y = d$。若把 $d$ 的符号也改了，整个图象就移动了。",
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
  intro: t(
    `A negative coefficient in $y = a\\sin(b(x - c)) + d$ adds a reflection to the stretches and shifts. The reflection is in the midline $y = d$, so it changes where the highest and lowest points are, but not how high or low they are. This is how a model can start at its minimum, like a rider who boards a Ferris wheel at the bottom.

Take $y = -3\\sin(2x) + 4$. The amplitude is $|-3| = 3$, so the wave still runs from $4 - 3 = 1$ to $4 + 3 = 7$, with period $\\pi$. Because of the minus sign, the highest point comes where $\\sin 2x = -1$:

$$2x = \\frac{3\\pi}{2}, \\qquad x = \\frac{3\\pi}{4}, \\qquad y = -3 \\cdot (-1) + 4 = 7.$$

Without the minus sign that point would be the lowest one.`,
    `在 $y = a\\sin(b(x - c)) + d$ 中，负系数在伸缩和平移之外又加上了对称。对称是关于中线 $y = d$ 的，所以它改变最高点和最低点的位置，但不改变它们的高低。模型就是这样从最小值开始的，比如乘客在摩天轮的最低点登上。

以 $y = -3\\sin(2x) + 4$ 为例。振幅是 $|-3| = 3$，所以波形仍从 $4 - 3 = 1$ 起伏到 $4 + 3 = 7$，周期为 $\\pi$。由于有负号，最高点出现在 $\\sin 2x = -1$ 处：

$$2x = \\frac{3\\pi}{2}, \\qquad x = \\frac{3\\pi}{4}, \\qquad y = -3 \\cdot (-1) + 4 = 7.$$

如果没有负号，这个点就是最低点。`,
  ),
  knowledgePoints: [
    {
      id: "values-of-reflected-combined-waves",
      figure:
        waveDrawings["graphing-reflections-of-trigonometric-functions-three-or-more-transformations#values-of-reflected-combined-waves"],
      title: t("Maximum, minimum and period", "最大值、最小值与周期"),
      explanation: t(
        "In $y = a \\sin(b(x - c)) + d$ with $a < 0$ the amplitude is $|a|$, so the maximum is $d + |a|$ and the minimum is $d - |a|$; the reflection only changes *where* they occur. The period is still $\\frac{2\\pi}{b}$.\n\nFor $y = -3\\cos\\left(2\\left(x - \\frac{\\pi}{4}\\right)\\right) + 1$: maximum $1 + 3 = 4$, minimum $1 - 3 = -2$, period $\\pi$.\n\n> **Watch out.** A negative $a$ does not make the maximum $d + a$. The amplitude is $|a|$, so the maximum is $d + |a|$ and the minimum is $d - |a|$.",
        "在 $a < 0$ 的 $y = a \\sin(b(x - c)) + d$ 中，振幅为 $|a|$，所以最大值为 $d + |a|$，最小值为 $d - |a|$；对称只改变它们*出现的位置*。周期仍为 $\\frac{2\\pi}{b}$。\n\n对 $y = -3\\cos\\left(2\\left(x - \\frac{\\pi}{4}\\right)\\right) + 1$：最大值 $1 + 3 = 4$，最小值 $1 - 3 = -2$，周期 $\\pi$。\n\n> **注意。**负的 $a$ 并不使最大值变为 $d + a$。振幅是 $|a|$，所以最大值是 $d + |a|$，最小值是 $d - |a|$。",
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
          solution: join(
            label(1, "Read the amplitude and the midline", "读出振幅与中线"),
            t(
              `The coefficient $${a.toLatex()}$ is negative, so the wave is reflected in its midline and stretched by $|${a.toLatex()}| = ${A.toLatex()}$. The amplitude is $${A.toLatex()}$, and the constant outside gives the midline $y = ${w.d}$.`,
              `系数 $${a.toLatex()}$ 为负，所以波形关于中线对称并伸缩为 $|${a.toLatex()}| = ${A.toLatex()}$ 倍。振幅是 $${A.toLatex()}$，函数外的常数给出中线 $y = ${w.d}$。`,
            ),
            para,
            label(2, "Go up and down from the midline", "从中线上下移动"),
            t(
              `The lowest value is $${w.d} - ${A.toLatex()} = ${D.sub(A).toLatex()}$. The highest value is $${w.d} + ${A.toLatex()} = ${D.add(A).toLatex()}$. The reflection swaps where the highest and lowest points are, not their values, so the ${max ? "maximum" : "minimum"} is $${(max ? D.add(A) : D.sub(A)).toLatex()}$.`,
              `波形从 $${w.d} - ${A.toLatex()} = ${D.sub(A).toLatex()}$ 起伏到 $${w.d} + ${A.toLatex()} = ${D.add(A).toLatex()}$。对称交换的是最高点与最低点的位置，而不是它们的值，所以${max ? "最大值" : "最小值"}是 $${(max ? D.add(A) : D.sub(A)).toLatex()}$。`,
            ),
            said(
              `The ${max ? "maximum" : "minimum"} occurs where $\\${f}$ of the input is $${max ? "-1" : "1"}$, because the coefficient is negative. There $y = ${a.toLatex()} \\cdot ${max ? "(-1)" : "1"}${signed(w.d)} = ${(max ? D.add(A) : D.sub(A)).toLatex()}$.`,
              `由于系数为负，${max ? "最大值" : "最小值"}在输入的${fnNames[f]["zh-CN"]}值为 $${max ? "-1" : "1"}$ 处取得。这时 $y = ${a.toLatex()} \\cdot ${max ? "(-1)" : "1"}${signed(w.d)} = ${(max ? D.add(A) : D.sub(A)).toLatex()}$。`,
            ),
          ),
          wrong: max ? [D.sub(A), A, D.add(Q.one), D.add(a.mul(Q.of(2)))] : [D.add(A), A.neg(), D.sub(Q.one), D.sub(A.mul(Q.of(2)))],
        });
      },
    },
    {
      id: "where-reflected-combined-waves-peak",
      title: t("Where the maxima and minima occur", "最值点的位置"),
      explanation: t(
        "With $a < 0$ the maximum of $y = a\\sin \\theta + d$ occurs where $\\sin\\theta = -1$, and the minimum where $\\sin \\theta = 1$. Let $\\theta = b(x - c)$ and solve.\n\nFor $y = -2\\sin\\left(2\\left(x + \\frac{\\pi}{6}\\right)\\right) + 3$, the maximum $5$ occurs where $2\\left(x + \\frac{\\pi}{6}\\right) = \\frac{3\\pi}{2} + 2k\\pi$, so $x = -\\frac{\\pi}{6} + \\frac{3\\pi}{4} + k\\pi = \\frac{7\\pi}{12} + k\\pi$; the smallest positive one is $\\frac{7\\pi}{12}$.\n\n> **Watch out.** With a negative coefficient the maximum comes where the sine or cosine of the input is $-1$. Taking the maximum points of the wave without the minus sign lands on the minimum points.",
        "当 $a < 0$ 时，$y = a\\sin \\theta + d$ 在 $\\sin\\theta = -1$ 处取得最大值，在 $\\sin \\theta = 1$ 处取得最小值。令 $\\theta = b(x - c)$ 求解。\n\n对 $y = -2\\sin\\left(2\\left(x + \\frac{\\pi}{6}\\right)\\right) + 3$，最大值 $5$ 在 $2\\left(x + \\frac{\\pi}{6}\\right) = \\frac{3\\pi}{2} + 2k\\pi$ 处取得，所以 $x = -\\frac{\\pi}{6} + \\frac{3\\pi}{4} + k\\pi = \\frac{7\\pi}{12} + k\\pi$；最小的正值是 $\\frac{7\\pi}{12}$。\n\n> **注意。**系数为负时，最大值出现在输入的正弦或余弦为 $-1$ 处。用去掉负号后波形的最大值点，得到的是最小值点。",
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
        "Read the midline, amplitude and period as before, then decide the sign of $a$ from the direction of the graph at a key point. The figure shows $y = -\\cos\\left(2\\left(x - \\frac{\\pi}{4}\\right)\\right) + 1$: period $\\pi$, midline $y = 1$, and a **lowest** point at $x = \\frac{\\pi}{4}$, where an unreflected cosine would have its highest point.\n\n> **Watch out.** Decide the sign of $a$ from a key point: a reflected cosine has a lowest point where an ordinary one has its highest. The period, midline and amplitude look the same either way.",
        "像以前一样读出中线、振幅和周期，再根据图象在某个关键点的走向确定 $a$ 的符号。图中是 $y = -\\cos\\left(2\\left(x - \\frac{\\pi}{4}\\right)\\right) + 1$：周期 $\\pi$，中线 $y = 1$，在 $x = \\frac{\\pi}{4}$ 处是**最低**点，而未对称的余弦在那里是最高点。\n\n> **注意。**由关键点判断 $a$ 的符号：对称后的余弦在普通余弦取最高点的地方取最低点。无论哪种情况，周期、中线和振幅看起来都一样。",
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
  intro: t(
    `Graphs are not always at hand, so it helps to read the properties of a transformed wave straight from its equation, in the form $y = a\\sin(bx + \\varphi) + d$ that often appears. The range comes from $|a|$ and $d$, the period from $b$, and the horizontal shift from $\\varphi$ and $b$ together.

Take $y = -2\\cos\\left(3x - \\pi\\right) + 5$. The range is

$$[5 - 2, 5 + 2] = [3, 7].$$

The sign of $a$ does not change it. The period is $\\frac{2\\pi}{3}$. Factoring $3$ out of the input, $3x - \\pi = 3\\left(x - \\frac{\\pi}{3}\\right)$, shows a shift right $\\frac{\\pi}{3}$. As a check, at $x = \\frac{\\pi}{3}$ the input is $0$ and $y = -2 \\cdot 1 + 5 = 3$, the bottom of the range.`,
    `手边不一定有图象，所以能直接从方程读出变换后波形的性质很有用，方程常写成 $y = a\\sin(bx + \\varphi) + d$ 的形式。值域由 $|a|$ 和 $d$ 决定，周期由 $b$ 决定，水平平移由 $\\varphi$ 和 $b$ 共同决定。

以 $y = -2\\cos\\left(3x - \\pi\\right) + 5$ 为例。无论 $a$ 的符号如何，值域都是

$$[5 - 2, 5 + 2] = [3, 7].$$

周期是 $\\frac{2\\pi}{3}$。把 $3$ 从输入中提出，$3x - \\pi = 3\\left(x - \\frac{\\pi}{3}\\right)$，可见图象向右平移 $\\frac{\\pi}{3}$。检验一下：在 $x = \\frac{\\pi}{3}$ 处输入为 $0$，$y = -2 \\cdot 1 + 5 = 3$，正是值域的下端。`,
  ),
  knowledgePoints: [
    {
      id: "range-of-transformed-sine-and-cosine",
      title: t("The range", "值域"),
      explanation: t(
        "The domain of $y = a \\sin(bx + \\varphi) + d$ is all real numbers. Its values run from the midline $d$ down and up by the amplitude $|a|$, whatever the sign of $a$, so its range is\n\n$$[d - |a|, d + |a|].$$\n\nFor $y = -4\\cos\\left(\\frac{1}{2}x + \\frac{\\pi}{3}\\right) + 1$: $[1 - 4, 1 + 4] = [-3, 5]$. The numbers $b$ and $\\varphi$ do not affect the range.\n\n> **Watch out.** The range does not depend on the sign of $a$: use $|a|$. Forgetting the shift gives an interval centered on $0$, and using $-d$ puts it on the wrong side.",
        "$y = a \\sin(bx + \\varphi) + d$ 的定义域是全体实数。无论 $a$ 的符号如何，它的值都从中线 $d$ 向下、向上各变化振幅 $|a|$，所以值域是\n\n$$[d - |a|, d + |a|].$$\n\n对 $y = -4\\cos\\left(\\frac{1}{2}x + \\frac{\\pi}{3}\\right) + 1$：$[1 - 4, 1 + 4] = [-3, 5]$。$b$ 与 $\\varphi$ 不影响值域。\n\n> **注意。**值域与 $a$ 的符号无关：用 $|a|$。忘了平移会得到以 $0$ 为中心的区间，用 $-d$ 则把区间放到了另一侧。",
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
          solution: join(
            label(1, "Read the amplitude and the midline", "读出振幅与中线"),
            t(
              `The values of $\\${f}$ of any input lie between $-1$ and $1$, and the input only moves and squeezes the wave sideways. ${sa.sign() < 0 ? "A negative coefficient flips the wave without changing its height, so the amplitude" : "The amplitude"} is $|${sa.toLatex()}| = ${a.toLatex()}$. The midline is $y = ${d}$.`,
              `$\\${f}$ 的值总在 $-1$ 与 $1$ 之间，输入只使波形左右移动和挤压。振幅为 $|${sa.toLatex()}| = ${a.toLatex()}$${sa.sign() < 0 ? "，因为负系数只翻转波形而不改变高度" : ""}。中线为 $y = ${d}$。`,
            ),
            para,
            label(2, "Go up and down from the midline", "从中线上下移动"),
            t(
              `The least value is $${d} - ${a.toLatex()} = ${D.sub(a).toLatex()}$. The greatest value is $${d} + ${a.toLatex()} = ${D.add(a).toLatex()}$. The range is $[${D.sub(a).toLatex()}, ${D.add(a).toLatex()}]$.`,
              `函数值从 $${d} - ${a.toLatex()} = ${D.sub(a).toLatex()}$ 变到 $${d} + ${a.toLatex()} = ${D.add(a).toLatex()}$。值域是 $[${D.sub(a).toLatex()}, ${D.add(a).toLatex()}]$。`,
            ),
            said(
              `Where $\\${f}$ of the input is $1$, $y = ${sa.toLatex()} \\cdot 1${signed(d)} = ${D.add(sa).toLatex()}$. Where it is $-1$, $y = ${sa.toLatex()} \\cdot (-1)${signed(d)} = ${D.sub(sa).toLatex()}$. These are the two ends of the range.`,
              `当输入的$${f === "sin" ? "\\sin" : "\\cos"}$值为 $1$ 时，$y = ${sa.toLatex()} \\cdot 1${signed(d)} = ${D.add(sa).toLatex()}$。为 $-1$ 时，$y = ${sa.toLatex()} \\cdot (-1)${signed(d)} = ${D.sub(sa).toLatex()}$。这正是值域的两端。`,
            ),
          ),
          wrong: [box(0, a), box(d, Q.one), box(d, a.mul(Q.of(2))), box(-d, a)],
        });
      },
    },
    {
      id: "period-and-shift-of-transformed-sine-and-cosine",
      title: t("Period and horizontal shift", "周期与水平平移"),
      explanation: t(
        "For $y = a \\sin(bx + \\varphi) + d$ with $b > 0$, the period is $\\frac{2\\pi}{b}$, and factoring $b$ out of the input, $bx + \\varphi = b\\left(x + \\frac{\\varphi}{b}\\right)$, shows the horizontal shift: left $\\frac{\\varphi}{b}$ when $\\varphi > 0$, right $\\frac{|\\varphi|}{b}$ when $\\varphi < 0$. This shift is often called the **phase shift**.\n\nFor $y = 5\\sin\\left(\\frac{1}{2}x - \\frac{\\pi}{4}\\right)$: period $4\\pi$, and $\\frac{1}{2}x - \\frac{\\pi}{4} = \\frac{1}{2}\\left(x - \\frac{\\pi}{2}\\right)$, a phase shift right $\\frac{\\pi}{2}$.\n\n> **Watch out.** In $bx + \\varphi$ factor $b$ out before reading the shift. The shift is $\\frac{\\varphi}{b}$, and a $+$ sign means left.",
        "对 $b > 0$ 的 $y = a \\sin(bx + \\varphi) + d$，周期是 $\\frac{2\\pi}{b}$；把 $b$ 从输入中提出，$bx + \\varphi = b\\left(x + \\frac{\\varphi}{b}\\right)$，就得到水平平移：$\\varphi > 0$ 时向左 $\\frac{\\varphi}{b}$，$\\varphi < 0$ 时向右 $\\frac{|\\varphi|}{b}$。这个平移常称为**相移**。\n\n对 $y = 5\\sin\\left(\\frac{1}{2}x - \\frac{\\pi}{4}\\right)$：周期 $4\\pi$，且 $\\frac{1}{2}x - \\frac{\\pi}{4} = \\frac{1}{2}\\left(x - \\frac{\\pi}{2}\\right)$，相移为向右 $\\frac{\\pi}{2}$。\n\n> **注意。**在 $bx + \\varphi$ 中先提出 $b$ 再读平移量。平移量是 $\\frac{\\varphi}{b}$，$+$ 号表示向左。",
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
          join(
            label(1, "Factor b out of the input", "从输入中提出 b"),
            both(
              `The shift is read from $x - c$, so write the input as $${b.toLatex()}$ times such a factor:`,
              `平移量要从 $x - c$ 读出，所以把输入写成 $${b.toLatex()}$ 乘这样一个因式：`,
              `${bxTex(b)} ${op} ${piTex(phi)} = ${b.toLatex()}\\left(x ${op} ${piTex(c.abs())}\\right)`,
            ),
            label(2, "Read the shift", "读出平移"),
            t(
              `Here $x$ is replaced by $x ${op} ${piTex(c.abs())}$, so the phase shift is ${c.sign() > 0 ? "right" : "left"} $${piTex(c.abs())}$ units, opposite to the sign.`,
              `这里 $x$ 被换成 $x ${op} ${piTex(c.abs())}$，所以相移是向${c.sign() > 0 ? "右" : "左"} $${piTex(c.abs())}$ 个单位，方向与符号相反。`,
            ),
            said(
              `The input $${bxTex(b)} ${op} ${piTex(phi)}$ is $0$ at $x = ${piTex(c)}$. The unshifted input $${bxTex(b)}$ is $0$ at $x = 0$. So that point has moved to $x = ${piTex(c)}$.`,
              `输入 $${bxTex(b)} ${op} ${piTex(phi)}$ 在 $x = ${piTex(c)}$ 处为 $0$，而未平移的输入 $${bxTex(b)}$ 在 $x = 0$ 处为 $0$。所以那个点移到了 $x = ${piTex(c)}$。`,
            ),
          ),
          shiftWhys(w),
        );
      },
    },
    {
      id: "evaluating-transformed-sine-and-cosine",
      figure: waveDrawings["properties-of-transformed-sine-and-cosine-functions#evaluating-transformed-sine-and-cosine"],
      title: t("Evaluating at special angles", "在特殊角处求值"),
      explanation: t(
        "To evaluate a transformed wave, work from the inside out: compute the input angle, take its sine or cosine from the unit circle, multiply by $a$, then add $d$. For $f(x) = 4\\cos\\left(2x - \\frac{\\pi}{3}\\right) + 1$ at $x = \\frac{\\pi}{2}$:\n\n$$2 \\cdot \\frac{\\pi}{2} - \\frac{\\pi}{3} = \\frac{2\\pi}{3}, \\quad \\cos\\frac{2\\pi}{3} = -\\frac{1}{2}, \\quad f\\left(\\frac{\\pi}{2}\\right) = 4 \\cdot \\left(-\\frac{1}{2}\\right) + 1 = -1.$$\n\n> **Watch out.** Work from the inside out and do not skip a layer: the whole input, then the sine or cosine, then the factor $a$, then $d$. Dropping the shift, the coefficient or its sign gives the value of a different function.",
        "求变换后波形的值，由内向外计算：先算输入角，再由单位圆取它的正弦或余弦，乘以 $a$，最后加 $d$。对 $f(x) = 4\\cos\\left(2x - \\frac{\\pi}{3}\\right) + 1$ 在 $x = \\frac{\\pi}{2}$ 处：\n\n$$2 \\cdot \\frac{\\pi}{2} - \\frac{\\pi}{3} = \\frac{2\\pi}{3}, \\quad \\cos\\frac{2\\pi}{3} = -\\frac{1}{2}, \\quad f\\left(\\frac{\\pi}{2}\\right) = 4 \\cdot \\left(-\\frac{1}{2}\\right) + 1 = -1.$$\n\n> **注意。**由内向外计算，不要跳过任何一层：先算整个输入，再算正弦或余弦，再乘系数 $a$，最后加 $d$。漏掉平移、系数或它的符号，算出的就是另一个函数的值。",
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
          solution: join(
            label(1, "Compute the input", "计算输入"),
            both(
              "Work from the inside out. Substitute into the input first:",
              "由内向外计算。先代入输入：",
              `${bxTex(b).replace("x", "")}${b.eq(Q.one) ? "" : " \\cdot "}${b.eq(Q.one) ? X : `\\left(${X}\\right)`} ${c.sign() > 0 ? "-" : "+"} ${piTex(b.mul(c).abs())} = ${piTex(theta)}`,
            ),
            label(2, "Apply the function, then the outer numbers", "作用函数，再算外层"),
            both(
              `The angle $${piTex(theta)}$ is a special angle, so its ${fnNames[f].en} is known exactly. Then multiply by $${a}$ and add $${d}$:`,
              `$${piTex(theta)}$ 是特殊角，它的${fnNames[f]["zh-CN"]}值可以精确求出。再乘以 $${a}$ 并加上 $${d}$：`,
              `\\${f}\\left(${piTex(theta)}\\right) = ${F.toLatex()}`,
              `f\\left(${X}\\right) = ${a} \\cdot ${paren(F)}${signed(d)} = ${value.toLatex()}`,
            ),
            b.eq(Q.one)
              ? said(
                  `Undo the outer numbers: $\\frac{${value.toLatex()}${signed(-d)}}{${a}} = ${F.toLatex()}$. That is indeed $\\${f}\\left(${piTex(theta)}\\right)$, the value of $\\${f}$ at the input.`,
                  `倒推外层运算：$\\frac{${value.toLatex()}${signed(-d)}}{${a}} = ${F.toLatex()}$。它正是 $\\${f}\\left(${piTex(theta)}\\right)$，即 $\\${f}$ 在该输入处的值。`,
                )
              : said(
                  `In factored form the input is $${b.toLatex()}\\left(x ${c.sign() > 0 ? "-" : "+"} ${piTex(c.abs())}\\right)$. At $x = ${X}$ it is $${b.toLatex()}\\left(${X} ${c.sign() > 0 ? "-" : "+"} ${piTex(c.abs())}\\right) = ${piTex(theta)}$. That is the same angle, so $f\\left(${X}\\right) = ${value.toLatex()}$.`,
                  `写成因式形式，输入为 $${b.toLatex()}\\left(x ${c.sign() > 0 ? "-" : "+"} ${piTex(c.abs())}\\right)$。在 $x = ${X}$ 处它等于 $${b.toLatex()}\\left(${X} ${c.sign() > 0 ? "-" : "+"} ${piTex(c.abs())}\\right) = ${piTex(theta)}$。这是同一个角，所以 $f\\left(${X}\\right) = ${value.toLatex()}$。`,
                ),
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
  intro: t(
    `You know the maximum and minimum values of a transformed wave and where the plain sine and cosine reach them. To find where a transformed wave reaches them, or where it crosses the $x$-axis, name the input $\\theta$, find the angles $\\theta$ that work, and solve for $x$. This answers questions such as when a tide is highest or when the water reaches a given level.

Take $y = 2\\sin\\left(x - \\frac{\\pi}{4}\\right)$ and look for its zeros. With $\\theta = x - \\frac{\\pi}{4}$ the equation is $2\\sin\\theta = 0$, so $\\theta = k\\pi$ for integers $k$. Then

$$x - \\frac{\\pi}{4} = k\\pi, \\qquad x = \\frac{\\pi}{4} + k\\pi.$$

The zeros are $\\pi$ apart, half a period, and the smallest positive one is $x = \\frac{\\pi}{4}$.`,
    `你知道变换后波形的最大值和最小值，也知道普通的正弦和余弦在哪里取到它们。要求变换后的波形在哪里取到最值，或在哪里穿过 $x$ 轴，就把输入记为 $\\theta$，求出满足条件的角 $\\theta$，再解出 $x$。这能回答诸如何时潮水最高、何时水位达到某个高度之类的问题。

以 $y = 2\\sin\\left(x - \\frac{\\pi}{4}\\right)$ 为例，求它的零点。令 $\\theta = x - \\frac{\\pi}{4}$，方程为 $2\\sin\\theta = 0$，所以对整数 $k$ 有 $\\theta = k\\pi$。于是

$$x - \\frac{\\pi}{4} = k\\pi, \\qquad x = \\frac{\\pi}{4} + k\\pi.$$

零点相距 $\\pi$，即半个周期，最小的正零点是 $x = \\frac{\\pi}{4}$。`,
  ),
  knowledgePoints: [
    {
      id: "locating-the-extrema",
      figure: waveDrawings["finding-zeros-and-extrema-of-transformed-sine-and-cosine-functions#locating-the-extrema"],
      title: t("Locating the extrema", "确定最值点"),
      explanation: t(
        "Let $\\theta$ be the input of $y = a \\sin\\theta + d$. The maximum $d + |a|$ occurs where $\\sin \\theta = 1$ if $a > 0$, or $\\sin\\theta = -1$ if $a < 0$; the minimum at the other one. Write $\\theta$ as a family of angles and solve for $x$.\n\nFor $y = 2\\cos\\left(3x - \\frac{\\pi}{2}\\right)$, the maximum occurs where $3x - \\frac{\\pi}{2} = 2k\\pi$, so $x = \\frac{\\pi}{6} + \\frac{2k\\pi}{3}$; the smallest positive one is $\\frac{\\pi}{6}$.\n\n> **Watch out.** When $a < 0$ the maximum comes where the sine or cosine is $-1$. The question asks for the smallest positive $x$: list the family of solutions and pick the first one above $0$.",
        "设 $\\theta$ 为 $y = a \\sin\\theta + d$ 的输入。若 $a > 0$，最大值 $d + |a|$ 在 $\\sin \\theta = 1$ 处取得；若 $a < 0$，则在 $\\sin\\theta = -1$ 处取得；最小值在另一处。把 $\\theta$ 写成一族角，再解出 $x$。\n\n对 $y = 2\\cos\\left(3x - \\frac{\\pi}{2}\\right)$，最大值在 $3x - \\frac{\\pi}{2} = 2k\\pi$ 处取得，所以 $x = \\frac{\\pi}{6} + \\frac{2k\\pi}{3}$；最小的正值是 $\\frac{\\pi}{6}$。\n\n> **注意。**当 $a < 0$ 时，最大值出现在正弦或余弦为 $-1$ 处。题目要的是最小的正数 $x$：写出解的一族，取第一个大于 $0$ 的。",
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
        "When $d = 0$, the zeros of $y = a\\sin\\theta$ are where $\\sin\\theta = 0$, $\\theta = k\\pi$; those of $y = a \\cos\\theta$ where $\\theta = \\frac{\\pi}{2} + k\\pi$. Zeros come twice per period, half a period apart.\n\nFor $y = 3\\sin\\left(2x + \\frac{\\pi}{3}\\right)$: $2x + \\frac{\\pi}{3} = k\\pi$ gives $x = -\\frac{\\pi}{6} + \\frac{k\\pi}{2}$, so the smallest positive zero is $\\frac{\\pi}{3}$.\n\n> **Watch out.** When $d = 0$ the zeros are where the sine or cosine is $0$, twice per period. Solve for $x$ fully: divide by $b$ and undo the shift, then pick the smallest positive value.",
        "当 $d = 0$ 时，$y = a\\sin\\theta$ 的零点在 $\\sin\\theta = 0$，即 $\\theta = k\\pi$ 处；$y = a \\cos\\theta$ 的零点在 $\\theta = \\frac{\\pi}{2} + k\\pi$ 处。每个周期有两个零点，相距半个周期。\n\n对 $y = 3\\sin\\left(2x + \\frac{\\pi}{3}\\right)$：由 $2x + \\frac{\\pi}{3} = k\\pi$ 得 $x = -\\frac{\\pi}{6} + \\frac{k\\pi}{2}$，所以最小的正零点是 $\\frac{\\pi}{3}$。\n\n> **注意。**当 $d = 0$ 时，零点在正弦或余弦为 $0$ 处，每个周期两个。要把 $x$ 完全解出来：除以 $b$ 并抵消平移，再取最小的正值。",
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
        "When $d \\ne 0$, solve $a \\sin\\theta + d = 0$ for $\\sin\\theta = -\\frac{d}{a}$ first. If this is $\\pm\\frac{1}{2}$, there are two families of angles per turn: $\\sin \\theta = \\frac{1}{2}$ at $\\theta = \\frac{\\pi}{6} + 2k\\pi$ and $\\theta = \\frac{5\\pi}{6} + 2k\\pi$, and $\\cos\\theta = \\frac{1}{2}$ at $\\theta = \\frac{\\pi}{3} + 2k\\pi$ and $\\theta = \\frac{5\\pi}{3} + 2k\\pi$. Solve each for $x$ and compare.\n\nFor $y = 4\\cos 2x + 2$: $\\cos 2x = -\\frac{1}{2}$, so $2x = \\frac{2\\pi}{3} + 2k\\pi$ or $2x = \\frac{4\\pi}{3} + 2k\\pi$, giving $x = \\frac{\\pi}{3} + k\\pi$ or $x = \\frac{2\\pi}{3} + k\\pi$. The smallest positive zero is $\\frac{\\pi}{3}$.\n\n> **Watch out.** When $d \\ne 0$ the zeros are not on the midline. Solve $a f(\\theta) + d = 0$ for $f(\\theta) = -\\frac{d}{a}$ first. That value is reached at two angles per cycle, so compare both families.",
        "当 $d \\ne 0$ 时，先由 $a \\sin\\theta + d = 0$ 解出 $\\sin\\theta = -\\frac{d}{a}$。若它等于 $\\pm\\frac{1}{2}$，则每转一圈有两族角：$\\sin \\theta = \\frac{1}{2}$ 在 $\\theta = \\frac{\\pi}{6} + 2k\\pi$ 与 $\\theta = \\frac{5\\pi}{6} + 2k\\pi$；$\\cos\\theta = \\frac{1}{2}$ 在 $\\theta = \\frac{\\pi}{3} + 2k\\pi$ 与 $\\theta = \\frac{5\\pi}{3} + 2k\\pi$。分别解出 $x$ 再比较。\n\n对 $y = 4\\cos 2x + 2$：$\\cos 2x = -\\frac{1}{2}$，所以 $2x = \\frac{2\\pi}{3} + 2k\\pi$ 或 $2x = \\frac{4\\pi}{3} + 2k\\pi$，得 $x = \\frac{\\pi}{3} + k\\pi$ 或 $x = \\frac{2\\pi}{3} + k\\pi$。最小的正零点是 $\\frac{\\pi}{3}$。\n\n> **注意。**当 $d \\ne 0$ 时，零点不在中线上。先由 $a f(\\theta) + d = 0$ 解出 $f(\\theta) = -\\frac{d}{a}$。每个周期内有两个角取到这个值，所以要比较两族解。",
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
  intro: t(
    `The method you used for transformed sine and cosine, naming the input $\\theta$ and solving for $x$, also finds the period, asymptotes and zeros of $y = a\\tan(bx + \\varphi) + d$. The basic facts change: the period is $\\frac{\\pi}{b}$, tangent has asymptotes where $\\theta = \\frac{\\pi}{2} + k\\pi$, and it takes each value once per period.

Take $y = \\tan\\left(2x - \\frac{\\pi}{2}\\right) + 1$. Its period is $\\frac{\\pi}{2}$. Its zeros are where $\\tan\\theta = -1$, that is $\\theta = \\frac{3\\pi}{4} + k\\pi$, so

$$2x - \\frac{\\pi}{2} = \\frac{3\\pi}{4} + k\\pi, \\qquad x = \\frac{5\\pi}{8} + \\frac{k\\pi}{2}.$$

The smallest positive zero is $x = \\frac{\\pi}{8}$, for $k = -1$. One zero per period, $\\frac{\\pi}{2}$ apart, is what a tangent should have.`,
    `你在变换后的正弦与余弦上用的方法，即把输入记为 $\\theta$ 再解出 $x$，同样能求 $y = a\\tan(bx + \\varphi) + d$ 的周期、渐近线和零点。基本事实有所不同：周期是 $\\frac{\\pi}{b}$，正切的渐近线在 $\\theta = \\frac{\\pi}{2} + k\\pi$ 处，而且它在每个周期内每个值只取一次。

以 $y = \\tan\\left(2x - \\frac{\\pi}{2}\\right) + 1$ 为例。它的周期是 $\\frac{\\pi}{2}$。零点在 $\\tan\\theta = -1$ 处，即 $\\theta = \\frac{3\\pi}{4} + k\\pi$，所以

$$2x - \\frac{\\pi}{2} = \\frac{3\\pi}{4} + k\\pi, \\qquad x = \\frac{5\\pi}{8} + \\frac{k\\pi}{2}.$$

取 $k = -1$，最小的正零点是 $x = \\frac{\\pi}{8}$。每个周期一个零点，相距 $\\frac{\\pi}{2}$，这正是正切应有的样子。`,
  ),
  knowledgePoints: [
    {
      id: "period-of-transformed-tangent-and-cotangent",
      figure: waveDrawings["properties-of-transformed-tangent-and-cotangent-functions#period-of-transformed-tangent-and-cotangent"],
      title: t("The period", "周期"),
      explanation: t(
        "The domain of $y = a\\tan(bx + \\varphi) + d$ is all real numbers except the asymptotes, and its range is all real numbers. Its period is $\\frac{\\pi}{b}$, whatever $a$, $\\varphi$ and $d$ are. For $y = -2\\cot\\left(4x - \\frac{\\pi}{3}\\right) + 5$ the period is $\\frac{\\pi}{4}$.\n\n> **Watch out.** The period of a transformed tangent or cotangent is $\\frac{\\pi}{b}$. The $2\\pi$ of sine and cosine does not apply here.",
        "$y = a\\tan(bx + \\varphi) + d$ 的定义域是除渐近线以外的全体实数，值域是全体实数。无论 $a$、$\\varphi$、$d$ 是多少，它的周期都是 $\\frac{\\pi}{b}$。$y = -2\\cot\\left(4x - \\frac{\\pi}{3}\\right) + 5$ 的周期是 $\\frac{\\pi}{4}$。\n\n> **注意。**变换后的正切或余切的周期是 $\\frac{\\pi}{b}$。正弦和余弦的 $2\\pi$ 在这里不适用。",
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
        "Set the input equal to the angles where the function is not defined: $bx + \\varphi = \\frac{\\pi}{2} + k\\pi$ for tangent, $bx + \\varphi = k\\pi$ for cotangent, and solve for $x$.\n\nFor $y = \\cot\\left(2x + \\frac{\\pi}{2}\\right)$: $2x + \\frac{\\pi}{2} = k\\pi$ gives $x = -\\frac{\\pi}{4} + \\frac{k\\pi}{2}$, so the smallest positive asymptote is $x = \\frac{\\pi}{4}$.\n\n> **Watch out.** Tangent has asymptotes where its input is $\\frac{\\pi}{2} + k\\pi$, and cotangent where its input is $k\\pi$. Use the right family before solving for $x$.",
        "令输入等于函数无定义的角：正切为 $bx + \\varphi = \\frac{\\pi}{2} + k\\pi$，余切为 $bx + \\varphi = k\\pi$，再解出 $x$。\n\n对 $y = \\cot\\left(2x + \\frac{\\pi}{2}\\right)$：由 $2x + \\frac{\\pi}{2} = k\\pi$ 得 $x = -\\frac{\\pi}{4} + \\frac{k\\pi}{2}$，所以最小的正渐近线是 $x = \\frac{\\pi}{4}$。\n\n> **注意。**正切的渐近线在输入为 $\\frac{\\pi}{2} + k\\pi$ 处，余切的渐近线在输入为 $k\\pi$ 处。解 $x$ 之前先选对这一族。",
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
        "Solve $a\\tan\\theta + d = 0$ for $\\tan\\theta = -\\frac{d}{a}$. Tangent takes each value once per period: $\\tan\\theta = 0$ at $\\theta = k\\pi$, $\\tan\\theta = 1$ at $\\theta = \\frac{\\pi}{4} + k\\pi$ and $\\tan\\theta = -1$ at $\\theta = \\frac{3\\pi}{4} + k\\pi$; cotangent is $0$ at $\\theta = \\frac{\\pi}{2} + k\\pi$ and $\\pm 1$ at the same angles as tangent.\n\nFor $y = 2\\tan\\left(x - \\frac{\\pi}{3}\\right) - 2$: $\\tan\\left(x - \\frac{\\pi}{3}\\right) = 1$, so $x - \\frac{\\pi}{3} = \\frac{\\pi}{4} + k\\pi$ and $x = \\frac{7\\pi}{12} + k\\pi$; the smallest positive zero is $\\frac{7\\pi}{12}$.\n\n> **Watch out.** With $d \\ne 0$ the zeros are where the tangent or cotangent equals $-\\frac{d}{a}$, not where it is $0$. Tangent and cotangent take each value only once per period.",
        "由 $a\\tan\\theta + d = 0$ 解出 $\\tan\\theta = -\\frac{d}{a}$。正切在每个周期内取每个值一次：$\\tan\\theta = 0$ 在 $\\theta = k\\pi$，$\\tan\\theta = 1$ 在 $\\theta = \\frac{\\pi}{4} + k\\pi$，$\\tan\\theta = -1$ 在 $\\theta = \\frac{3\\pi}{4} + k\\pi$；余切在 $\\theta = \\frac{\\pi}{2} + k\\pi$ 处为 $0$，取 $\\pm 1$ 的角与正切相同。\n\n对 $y = 2\\tan\\left(x - \\frac{\\pi}{3}\\right) - 2$：$\\tan\\left(x - \\frac{\\pi}{3}\\right) = 1$，所以 $x - \\frac{\\pi}{3} = \\frac{\\pi}{4} + k\\pi$，$x = \\frac{7\\pi}{12} + k\\pi$；最小的正零点是 $\\frac{7\\pi}{12}$。\n\n> **注意。**当 $d \\ne 0$ 时，零点在正切或余切等于 $-\\frac{d}{a}$ 处，而不是等于 $0$ 处。正切和余切在每个周期内每个值只取一次。",
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
  intro: t(
    `A transformed secant $y = a\\sec(bx + \\varphi) + d$ follows the wave $y = a\\cos(bx + \\varphi) + d$, and its properties come from that wave: the range lies outside the wave's band, the asymptotes are at the wave's midline crossings, and the turning points are at the wave's tops and bottoms.

Take $y = 3\\csc\\left(x + \\frac{\\pi}{2}\\right) - 2$. The cosecant values are at most $-1$ or at least $1$, so the range is

$$(-\\infty, -5] \\cup [1, \\infty).$$

The asymptotes are where $\\sin\\left(x + \\frac{\\pi}{2}\\right) = 0$, at $x = -\\frac{\\pi}{2} + k\\pi$. At $x = 0$ the input is $\\frac{\\pi}{2}$, the cosecant is $1$ and $y = 3 - 2 = 1$: a branch opening upward turns there, a local minimum.`,
    `变换后的正割 $y = a\\sec(bx + \\varphi) + d$ 跟随波形 $y = a\\cos(bx + \\varphi) + d$，它的性质都来自这个波形：值域在波形的带状区域之外，渐近线在波形穿过中线的地方，转折点在波形的最高处和最低处。

以 $y = 3\\csc\\left(x + \\frac{\\pi}{2}\\right) - 2$ 为例。余割的值不大于 $-1$ 或不小于 $1$，所以值域是

$$(-\\infty, -5] \\cup [1, \\infty).$$

渐近线在 $\\sin\\left(x + \\frac{\\pi}{2}\\right) = 0$ 处，即 $x = -\\frac{\\pi}{2} + k\\pi$。在 $x = 0$ 处输入为 $\\frac{\\pi}{2}$，余割为 $1$，$y = 3 - 2 = 1$：一个开口向上的分支在那里转折，这是一个局部极小值。`,
  ),
  knowledgePoints: [
    {
      id: "range-of-transformed-secant-and-cosecant",
      title: t("The range", "值域"),
      explanation: t(
        "Whatever the sign of $a$, the values of $a\\sec\\theta$ are at most $-|a|$ or at least $|a|$, so the range of $y = a\\sec(bx + \\varphi) + d$ is\n\n$$(-\\infty, d - |a|] \\cup [d + |a|, \\infty).$$\n\nFor $y = -3\\csc\\left(2x + \\frac{\\pi}{4}\\right) + 1$: $(-\\infty, -2] \\cup [4, \\infty)$.\n\n> **Watch out.** A negative $a$ swaps the two pieces of the range but leaves the set the same: $(-\\infty, d - |a|] \\cup [d + |a|, \\infty)$. The band strictly between $d - |a|$ and $d + |a|$ is left out.",
        "无论 $a$ 的符号如何，$a\\sec\\theta$ 的值都不大于 $-|a|$ 或不小于 $|a|$，所以 $y = a\\sec(bx + \\varphi) + d$ 的值域是\n\n$$(-\\infty, d - |a|] \\cup [d + |a|, \\infty).$$\n\n对 $y = -3\\csc\\left(2x + \\frac{\\pi}{4}\\right) + 1$：$(-\\infty, -2] \\cup [4, \\infty)$。\n\n> **注意。**负的 $a$ 交换值域的两部分，但集合不变：$(-\\infty, d - |a|] \\cup [d + |a|, \\infty)$。严格位于 $d - |a|$ 与 $d + |a|$ 之间的带状区域不在值域中。",
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
          solution: join(
            label(1, "Start from the basic range", "从基本值域出发"),
            t(
              `The values of $\\${f} \\theta$ are at most $-1$ or at least $1$. Multiplying by $${sa.toLatex()}$ gives values at most $-${a.toLatex()}$ or at least $${a.toLatex()}$${sa.sign() < 0 ? ": the negative sign swaps the two pieces, but together they cover the same set" : ""}.`,
              `$\\${f} \\theta$ 的值不大于 $-1$ 或不小于 $1$。乘以 $${sa.toLatex()}$ 后，值不大于 $-${a.toLatex()}$ 或不小于 $${a.toLatex()}$${sa.sign() < 0 ? "：负号交换了两部分，但合起来还是同一个集合" : ""}。`,
            ),
            para,
            label(2, "Shift", "平移"),
            both(
              `Adding $${d}$ moves both edges by $${d}$. The range is`,
              `加上 $${d}$ 使两个边界都移动 $${d}$。值域是`,
              `(-\\infty, ${D.sub(a).toLatex()}] \\cup [${D.add(a).toLatex()}, \\infty)`,
            ),
            said(
              `Where $\\${f} \\theta = 1$, $y = ${sa.toLatex()} \\cdot 1${signed(d)} = ${D.add(sa).toLatex()}$. Where $\\${f} \\theta = -1$, $y = ${sa.toLatex()} \\cdot (-1)${signed(d)} = ${D.sub(sa).toLatex()}$. These are the two edges, and no value lies strictly between them.`,
              `在 $\\${f} \\theta = 1$ 处，$y = ${sa.toLatex()} \\cdot 1${signed(d)} = ${D.add(sa).toLatex()}$。在 $\\${f} \\theta = -1$ 处，$y = ${sa.toLatex()} \\cdot (-1)${signed(d)} = ${D.sub(sa).toLatex()}$。这正是两个边界，没有函数值严格位于两者之间。`,
            ),
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
        "Secant is not defined where cosine is $0$, and cosecant where sine is $0$. Set the input $bx + \\varphi$ equal to $\\frac{\\pi}{2} + k\\pi$ (secant) or $k\\pi$ (cosecant) and solve for $x$.\n\nFor $y = 2\\sec\\left(3x - \\frac{\\pi}{4}\\right)$: $3x - \\frac{\\pi}{4} = \\frac{\\pi}{2} + k\\pi$ gives $x = \\frac{\\pi}{4} + \\frac{k\\pi}{3}$, so the smallest positive asymptote is $x = \\frac{\\pi}{4}$.\n\n> **Watch out.** Use the zeros of the matching function: cosine for secant, sine for cosecant. Then solve for $x$ with both $b$ and the shift included.",
        "正割在余弦为 $0$ 处无定义，余割在正弦为 $0$ 处无定义。令输入 $bx + \\varphi$ 等于 $\\frac{\\pi}{2} + k\\pi$（正割）或 $k\\pi$（余割），再解出 $x$。\n\n对 $y = 2\\sec\\left(3x - \\frac{\\pi}{4}\\right)$：由 $3x - \\frac{\\pi}{4} = \\frac{\\pi}{2} + k\\pi$ 得 $x = \\frac{\\pi}{4} + \\frac{k\\pi}{3}$，所以最小的正渐近线是 $x = \\frac{\\pi}{4}$。\n\n> **注意。**要用对应函数的零点：正割用余弦，余割用正弦。然后解 $x$ 时同时带上 $b$ 和平移。",
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
        "Each U-shaped branch has one turning point. The branches opening up have **local minima** $d + |a|$, and those opening down have **local maxima** $d - |a|$: the local maxima are below the local minima. They occur where the cosine (for secant) or sine (for cosecant) of the input is $\\pm 1$; when $a > 0$ the local minima are where it is $1$, and when $a < 0$ where it is $-1$.\n\nFor $y = -\\sec 2x + 3$: local minimum $4$ where $\\cos 2x = -1$, $x = \\frac{\\pi}{2} + k\\pi$; local maximum $2$ where $\\cos 2x = 1$, $x = k\\pi$.\n\n> **Watch out.** A local minimum of a secant is higher than a local maximum, because the upward branches sit above the downward ones. When $a < 0$ the branches swap, so the local minima come where the secant or cosecant is $-1$.",
        "每个 U 形分支有一个转折点。开口向上的分支有**局部极小值** $d + |a|$，开口向下的分支有**局部极大值** $d - |a|$：局部极大值比局部极小值小。它们出现在输入的余弦（正割）或正弦（余割）为 $\\pm 1$ 处；$a > 0$ 时局部极小值在其为 $1$ 处，$a < 0$ 时在其为 $-1$ 处。\n\n对 $y = -\\sec 2x + 3$：局部极小值 $4$ 在 $\\cos 2x = -1$ 处，即 $x = \\frac{\\pi}{2} + k\\pi$；局部极大值 $2$ 在 $\\cos 2x = 1$ 处，即 $x = k\\pi$。\n\n> **注意。**正割的局部极小值比局部极大值大，因为开口向上的分支在开口向下的分支上方。当 $a < 0$ 时分支互换，局部极小值出现在正割或余割为 $-1$ 处。",
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
          solution: join(
            label(1, "Find the edges of the range", "找出值域的边界"),
            t(
              `The values of $\\${f}$ are at most $-1$ or at least $1$. So $${a} \\cdot \\${f}$ is at most $-${A}$ or at least $${A}$, and the whole function is at most $${d} - ${A} = ${d - A}$ or at least $${d} + ${A} = ${d + A}$.`,
              `$\\${f}$ 的值不大于 $-1$ 或不小于 $1$。所以 $${a} \\cdot \\${f}$ 不大于 $-${A}$ 或不小于 $${A}$，整个函数不大于 $${d} - ${A} = ${d - A}$ 或不小于 $${d} + ${A} = ${d + A}$。`,
            ),
            para,
            label(2, "Match the branches", "对应各分支"),
            t(
              `The branches opening up lie above $y = ${d + A}$ and touch it at their lowest points, so each local minimum is $${d + A}$. The branches opening down lie below $y = ${d - A}$ and touch it at their highest points, so each local maximum is $${d - A}$.`,
              `开口向上的分支位于 $y = ${d + A}$ 上方，并在最低点与它相切，所以每个局部极小值都是 $${d + A}$。开口向下的分支位于 $y = ${d - A}$ 下方，并在最高点与它相切，所以每个局部极大值都是 $${d - A}$。`,
            ),
            said(
              `A local minimum is larger than a local maximum here: $${d + A} > ${d - A}$. That is how secant and cosecant graphs look, with the upward branches above the downward ones. The two values are $${A}$ above and below $y = ${d}$.`,
              `这里局部极小值大于局部极大值：$${d + A} > ${d - A}$。正割与余割的图象正是这样，开口向上的分支在开口向下的分支上方。这两个值分别在 $y = ${d}$ 上方和下方 $${A}$ 处。`,
            ),
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
  /** at substitutes a time when the quantity is greatest (high) or least into the formula. */
  readonly at: (high: boolean) => Text;
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
    at: (high) =>
      high
        ? t(
            `At $t = ${n}$ the input is $\\pi$, so $h(${n}) = ${C} - ${r}\\cos \\pi = ${C} + ${r} = ${C + r}$.`,
            `在 $t = ${n}$ 时输入为 $\\pi$，所以 $h(${n}) = ${C} - ${r}\\cos \\pi = ${C} + ${r} = ${C + r}$。`,
          )
        : t(
            `At $t = 0$ the input is $0$, so $h(0) = ${C} - ${r}\\cos 0 = ${C} - ${r} = ${C - r}$.`,
            `在 $t = 0$ 时输入为 $0$，所以 $h(0) = ${C} - ${r}\\cos 0 = ${C} - ${r} = ${C - r}$。`,
          ),
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
  intro: t(
    `A trigonometric model is a transformed wave whose input is time. Everything you can read from the equation now has a meaning in the situation: the midline is the typical level, the amplitude is how far the quantity swings, the period is how long one cycle takes, and the times of the peaks come from solving for $t$.

Suppose the height in meters of a swing seat above the ground $t$ seconds after it is released is $h(t) = 1.5 + 0.5\\cos(\\pi t)$. The seat goes no higher than $1.5 + 0.5 = 2$ meters and no lower than $1.5 - 0.5 = 1$ meter. One full swing takes

$$\\frac{2\\pi}{\\pi} = 2 \\text{ seconds}.$$

The seat is back at its highest point when $\\pi t = 2\\pi$, at $t = 2$.`,
    `三角函数模型就是以时间为输入的变换后的波。从方程中能读出的每样东西在情境中都有含义：中线是典型水平，振幅是这个量起伏的幅度，周期是一个循环所需的时间，峰值出现的时刻则通过解出 $t$ 得到。

设秋千座椅松开后 $t$ 秒时离地的高度（米）为 $h(t) = 1.5 + 0.5\\cos(\\pi t)$。座椅最高不超过 $1.5 + 0.5 = 2$ 米，最低不低于 $1.5 - 0.5 = 1$ 米。来回摆一次需要

$$\\frac{2\\pi}{\\pi} = 2 \\text{ 秒},$$

当 $\\pi t = 2\\pi$，即 $t = 2$ 时，座椅回到最高点。`,
  ),
  knowledgePoints: [
    {
      id: "maximum-and-minimum-in-context",
      title: t("Maximum and minimum in context", "实际情境中的最大值与最小值"),
      explanation: t(
        "In a model $y = a\\cos(b(t - c)) + d$ the midline $d$ is the average value of the quantity and the amplitude $|a|$ is how far it swings above and below it. So the greatest value is $d + |a|$ and the least is $d - |a|$.\n\nIf the depth of water in a harbor is $D(t) = 5 + 3\\cos\\left(\\frac{\\pi}{6}(t - 2)\\right)$ meters, the depth at high tide is $5 + 3 = 8$ meters and at low tide $5 - 3 = 2$ meters.\n\n> **Watch out.** The answer is a value of the quantity, the midline plus or minus the amplitude. Neither the midline nor the amplitude alone is the greatest or least value.",
        "在模型 $y = a\\cos(b(t - c)) + d$ 中，中线 $d$ 是该量的平均值，振幅 $|a|$ 是它在平均值上下摆动的幅度。所以最大值是 $d + |a|$，最小值是 $d - |a|$。\n\n若港口的水深为 $D(t) = 5 + 3\\cos\\left(\\frac{\\pi}{6}(t - 2)\\right)$ 米，则涨潮时水深 $5 + 3 = 8$ 米，落潮时 $5 - 3 = 2$ 米。\n\n> **注意。**答案是这个量的一个值，即中线加上或减去振幅。单独的中线或振幅都不是最大值或最小值。",
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
            at: (hi) =>
              hi
                ? t(
                    `At $t = ${c}$ the input is $0$, so $D(${c}) = ${M} + ${A}\\cos 0 = ${M + A}$.`,
                    `在 $t = ${c}$ 时输入为 $0$，所以 $D(${c}) = ${M} + ${A}\\cos 0 = ${M + A}$。`,
                  )
                : t(
                    `At $t = ${c + n}$ the input is $\\pi$, so $D(${c + n}) = ${M} + ${A}\\cos \\pi = ${M - A}$.`,
                    `在 $t = ${c + n}$ 时输入为 $\\pi$，所以 $D(${c + n}) = ${M} + ${A}\\cos \\pi = ${M - A}$。`,
                  ),
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
            at: (hi) =>
              hi
                ? t(
                    `At $t = ${c + 6}$ the input is $\\frac{\\pi}{2}$, so $T(${c + 6}) = ${M} + ${A}\\sin \\frac{\\pi}{2} = ${M + A}$.`,
                    `在 $t = ${c + 6}$ 时输入为 $\\frac{\\pi}{2}$，所以 $T(${c + 6}) = ${M} + ${A}\\sin \\frac{\\pi}{2} = ${M + A}$。`,
                  )
                : t(
                    `At $t = ${c - 6}$ the input is $-\\frac{\\pi}{2}$, so $T(${c - 6}) = ${M} + ${A}\\sin\\left(-\\frac{\\pi}{2}\\right) = ${M - A}$.`,
                    `在 $t = ${c - 6}$ 时输入为 $-\\frac{\\pi}{2}$，所以 $T(${c - 6}) = ${M} + ${A}\\sin\\left(-\\frac{\\pi}{2}\\right) = ${M - A}$。`,
                  ),
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
          solution: join(
            label(1, "Read the midline and the amplitude", "读出中线与振幅"),
            t(
              `The constant term of the formula is the midline, $${mid}$. The number multiplying the sine or cosine is $${amp}$ in size, so the ${m.what.en} goes $${amp}$ above and below the midline, since the sine or cosine runs from $-1$ to $1$.`,
              `公式中的常数项是中线 $${mid}$。乘在正弦或余弦前的数大小为 $${amp}$，而正弦或余弦从 $-1$ 变到 $1$，所以${m.what["zh-CN"]}在中线上下各变化 $${amp}$。`,
            ),
            para,
            label(2, "Go up or down from the midline", "从中线上下移动"),
            t(
              `The ${m.what.en} swings between $${mid} - ${amp} = ${m.min}$ and $${mid} + ${amp} = ${m.max}$. So the ${high ? "greatest" : "least"} value is $${high ? m.max : m.min}$.`,
              `${m.what["zh-CN"]}在 $${mid} - ${amp} = ${m.min}$ 与 $${mid} + ${amp} = ${m.max}$ 之间变化。所以${high ? "最大" : "最小"}值是 $${high ? m.max : m.min}$。`,
            ),
            said(m.at(high).en, m.at(high)["zh-CN"]),
          ),
          wrong: high ? [mid, amp, m.min, 2 * amp] : [mid, amp, m.max, -amp],
        });
      },
    },
    {
      id: "period-in-context",
      title: t("The period in context", "实际情境中的周期"),
      explanation: t(
        "The period $\\frac{2\\pi}{b}$ is the time one full cycle takes: one turn of a wheel, or the time from one high tide to the next. If $h(t) = 21 - 19\\cos\\left(\\frac{\\pi}{4}t\\right)$ gives a rider's height after $t$ minutes, one revolution takes\n\n$$\\frac{2\\pi}{\\frac{\\pi}{4}} = 8 \\text{ minutes},$$\n\nand in $40$ minutes the wheel turns $\\frac{40}{8} = 5$ times.\n\n> **Watch out.** The period is $\\frac{2\\pi}{b}$, not $\\frac{\\pi}{b}$ and not $b$ itself. For $b = \\frac{\\pi}{n}$ it is $2n$, twice the denominator.",
        "周期 $\\frac{2\\pi}{b}$ 是完成一个完整周期所需的时间：摩天轮转一圈的时间，或从一次涨潮到下一次涨潮的时间。若 $h(t) = 21 - 19\\cos\\left(\\frac{\\pi}{4}t\\right)$ 表示乘客 $t$ 分钟后的高度，则转一圈需要\n\n$$\\frac{2\\pi}{\\frac{\\pi}{4}} = 8 \\text{ 分钟},$$\n\n$40$ 分钟内摩天轮转了 $\\frac{40}{8} = 5$ 圈。\n\n> **注意。**周期是 $\\frac{2\\pi}{b}$，不是 $\\frac{\\pi}{b}$，也不是 $b$ 本身。当 $b = \\frac{\\pi}{n}$ 时周期是 $2n$，即分母的两倍。",
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
              solution: join(
                label(1, "Recognize the period", "认出周期"),
                t(
                  `After one revolution the rider is back where they started, and the height repeats. So one revolution is one period of $h$. The input is $bt$ with $b = \\frac{\\pi}{${n}}$, and the period of $\\cos(bt)$ is $\\frac{2\\pi}{b}$.`,
                  `转一圈后乘客回到起点，高度开始重复。所以转一圈就是 $h$ 的一个周期。输入为 $bt$，其中 $b = \\frac{\\pi}{${n}}$，而 $\\cos(bt)$ 的周期是 $\\frac{2\\pi}{b}$。`,
                ),
                para,
                label(2, "Divide", "相除"),
                both("Divide $2\\pi$ by $b$:", "用 $2\\pi$ 除以 $b$：", `\\frac{2\\pi}{\\frac{\\pi}{${n}}} = 2 \\cdot ${n} = ${P}`),
                said(
                  `At $t = 0$ the input is $0$, and at $t = ${P}$ it is $\\frac{\\pi}{${n}} \\cdot ${P} = 2\\pi$, one full turn of the cosine. So $h(${P}) = h(0)$.`,
                  `在 $t = 0$ 时输入为 $0$，在 $t = ${P}$ 时输入为 $\\frac{\\pi}{${n}} \\cdot ${P} = 2\\pi$，恰好是余弦的一整个周期。所以 $h(${P}) = h(0)$。`,
                ),
              ),
              wrong: [n, 4 * n, r, 2 * r],
            });
          return numberProblem({
            prompt: join(
              m.intro,
              t(` How many full revolutions does the wheel make in $${P * turns}$ minutes?`, `摩天轮在 $${P * turns}$ 分钟内转了几整圈？`),
            ),
            answer: turns,
            solution: join(
              label(1, "Find the time of one revolution", "求转一圈的时间"),
              t(
                `One revolution is one period of $h$. The period of $\\cos(bt)$ is $\\frac{2\\pi}{b}$, so one revolution takes $\\frac{2\\pi}{\\frac{\\pi}{${n}}} = ${P}$ minutes.`,
                `转一圈就是 $h$ 的一个周期。$\\cos(bt)$ 的周期是 $\\frac{2\\pi}{b}$，所以转一圈需要 $\\frac{2\\pi}{\\frac{\\pi}{${n}}} = ${P}$ 分钟。`,
              ),
              para,
              label(2, "Count the revolutions", "数圈数"),
              t(
                `In $${P * turns}$ minutes the wheel turns $\\frac{${P * turns}}{${P}} = ${turns}$ times.`,
                `$${P * turns}$ 分钟内摩天轮转了 $\\frac{${P * turns}}{${P}} = ${turns}$ 圈。`,
              ),
              said(
                `In $${P * turns}$ minutes the input $\\frac{\\pi}{${n}}t$ grows by $\\frac{\\pi}{${n}} \\cdot ${P * turns} = ${2 * turns}\\pi$. That is $${turns}$ full turns of $2\\pi$.`,
                `$${P * turns}$ 分钟内输入 $\\frac{\\pi}{${n}}t$ 增加 $\\frac{\\pi}{${n}} \\cdot ${P * turns} = ${2 * turns}\\pi$。这正是 $${turns}$ 个 $2\\pi$。`,
              ),
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
          solution: join(
            label(1, "Recognize the period", "认出周期"),
            t(
              `The depth repeats from one high tide to the next, so that time is one period. The input is $b(t - ${c})$ with $b = \\frac{\\pi}{${k}}$. The shift $${c}$ moves the tides in time but does not change how often they come.`,
              `水深从一次涨潮到下一次涨潮重复一遍，所以这段时间是一个周期。输入为 $b(t - ${c})$，其中 $b = \\frac{\\pi}{${k}}$。平移 $${c}$ 改变涨潮的时刻，但不改变涨潮的频率。`,
            ),
            para,
            label(2, "Divide", "相除"),
            both("Divide $2\\pi$ by $b$:", "用 $2\\pi$ 除以 $b$：", `\\frac{2\\pi}{\\frac{\\pi}{${k}}} = 2 \\cdot ${k} = ${2 * k}`),
            said(
              `High tide is where the cosine is $1$: at $t = ${c}$ the input is $0$, and at $t = ${c + 2 * k}$ it is $\\frac{\\pi}{${k}} \\cdot ${2 * k} = 2\\pi$. These two high tides are $${2 * k}$ hours apart.`,
              `涨潮时余弦为 $1$：在 $t = ${c}$ 时输入为 $0$，在 $t = ${c + 2 * k}$ 时输入为 $\\frac{\\pi}{${k}} \\cdot ${2 * k} = 2\\pi$。这两次涨潮相隔 $${2 * k}$ 小时。`,
            ),
          ),
          wrong: [k, 4 * k, c, 2 * c],
        });
      },
    },
    {
      id: "times-of-peaks-in-context",
      title: t("When the peaks happen", "峰值出现的时刻"),
      explanation: t(
        "A peak happens where the sine or cosine factor reaches $1$ or $-1$, whichever makes the quantity largest. For $T(t) = 18 + 6\\sin\\left(\\frac{\\pi}{12}(t - 9)\\right)$, the temperature is highest when $\\frac{\\pi}{12}(t - 9) = \\frac{\\pi}{2}$, so $t - 9 = 6$ and $t = 15$: at 3 p.m. It is lowest when $\\frac{\\pi}{12}(t - 9) = -\\frac{\\pi}{2}$, at $t = 3$.\n\nFor a wheel $h(t) = C - r\\cos\\left(\\frac{\\pi}{n}t\\right)$ the rider starts at the bottom ($\\cos 0 = 1$) and first reaches the top when $\\frac{\\pi}{n}t = \\pi$, at $t = n$.\n\n> **Watch out.** Find the first time the sine or cosine reaches the value that gives the peak, and keep the time inside the stated interval. With a subtracted cosine the peak comes when the cosine is $-1$, not $1$.",
        "峰值出现在正弦或余弦因子达到 $1$ 或 $-1$（使该量最大的那个）时。对 $T(t) = 18 + 6\\sin\\left(\\frac{\\pi}{12}(t - 9)\\right)$，当 $\\frac{\\pi}{12}(t - 9) = \\frac{\\pi}{2}$ 时气温最高，所以 $t - 9 = 6$，$t = 15$：下午 3 点。当 $\\frac{\\pi}{12}(t - 9) = -\\frac{\\pi}{2}$，即 $t = 3$ 时气温最低。\n\n对摩天轮 $h(t) = C - r\\cos\\left(\\frac{\\pi}{n}t\\right)$，乘客从最低点出发（$\\cos 0 = 1$），当 $\\frac{\\pi}{n}t = \\pi$，即 $t = n$ 时第一次到达最高点。\n\n> **注意。**找出正弦或余弦第一次取到使函数达到峰值的那个值的时刻，并让时刻落在给定的区间内。余弦项被减去时，峰值出现在余弦为 $-1$ 而不是 $1$ 时。",
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
            solution: join(
              label(1, "Say when the height is greatest", "说明何时高度最大"),
              t(
                `The cosine term is subtracted, so the height is greatest when the cosine is least, that is when $\\cos\\left(\\frac{\\pi}{${n}}t\\right) = -1$. At $t = 0$ the cosine is $1$ and the rider is at the bottom.`,
                `余弦项是被减去的，所以余弦最小，即 $\\cos\\left(\\frac{\\pi}{${n}}t\\right) = -1$ 时高度最大。在 $t = 0$ 时余弦为 $1$，乘客在最低点。`,
              ),
              para,
              label(2, "Solve for the first time", "求第一次的时刻"),
              t(
                `The cosine first equals $-1$ at the angle $\\pi$. So $\\frac{\\pi}{${n}}t = \\pi$ and $t = ${n}$, half a revolution.`,
                `余弦第一次等于 $-1$ 是在角 $\\pi$ 处。所以 $\\frac{\\pi}{${n}}t = \\pi$，$t = ${n}$，即转了半圈。`,
              ),
              said(m.at(true).en, m.at(true)["zh-CN"]),
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
            solution: join(
              label(1, "Say when the depth is " + (high ? "greatest" : "least"), high ? "说明何时水深最大" : "说明何时水深最小"),
              high
                ? t(
                    `The cosine term is added with a positive coefficient, so the depth is greatest when the cosine is $1$. The cosine is $1$ at the angles $0, \\pm 2\\pi, \\ldots$`,
                    `余弦项以正系数加上，所以余弦为 $1$ 时水深最大。余弦在角 $0, \\pm 2\\pi, \\ldots$ 处为 $1$。`,
                  )
                : t(
                    `The cosine term is added with a positive coefficient, so the depth is least when the cosine is $-1$. The cosine is $-1$ at the angles $\\pm\\pi, \\pm 3\\pi, \\ldots$`,
                    `余弦项以正系数加上，所以余弦为 $-1$ 时水深最小。余弦在角 $\\pm\\pi, \\pm 3\\pi, \\ldots$ 处为 $-1$。`,
                  ),
              para,
              label(2, "Solve for the first time", "求第一次的时刻"),
              high
                ? t(
                    `The first time after midnight is when $\\frac{\\pi}{${k}}(t - ${c}) = 0$, so $t = ${c}$. The angle $-2\\pi$ would give a time before midnight.`,
                    `午夜后的第一次是 $\\frac{\\pi}{${k}}(t - ${c}) = 0$，所以 $t = ${c}$。角 $-2\\pi$ 对应的时刻在午夜之前。`,
                  )
                : t(
                    `The angle $-\\pi$ would give $t = ${c - k}$, before midnight. So the first time is when $\\frac{\\pi}{${k}}(t - ${c}) = \\pi$. Then $t - ${c} = ${k}$ and $t = ${c + k}$.`,
                    `角 $-\\pi$ 给出 $t = ${c - k}$，在午夜之前。所以第一次是 $\\frac{\\pi}{${k}}(t - ${c}) = \\pi$。于是 $t - ${c} = ${k}$，$t = ${c + k}$。`,
                  ),
              high
                ? said(
                    `$D(${c}) = ${M} + ${A}\\cos 0 = ${M + A}$, which is the greatest depth $${M} + ${A}$.`,
                    `$D(${c}) = ${M} + ${A}\\cos 0 = ${M + A}$，正是最大水深 $${M} + ${A}$。`,
                  )
                : said(
                    `$D(${c + k}) = ${M} + ${A}\\cos \\pi = ${M - A}$, which is the least depth $${M} - ${A}$.`,
                    `$D(${c + k}) = ${M} + ${A}\\cos \\pi = ${M - A}$，正是最小水深 $${M} - ${A}$。`,
                  ),
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
          solution: join(
            label(1, "Say when the sine is " + (high ? "1" : "-1"), high ? "说明何时正弦为 1" : "说明何时正弦为 -1"),
            t(
              `The sine term is added with the positive coefficient $${A}$, so the temperature is ${high ? "highest when the sine is $1$" : "lowest when the sine is $-1$"}. The sine is ${high ? "$1$ at $\\frac{\\pi}{2}$" : "$-1$ at $-\\frac{\\pi}{2}$"} plus whole turns of $2\\pi$.`,
              `正弦项以正系数 $${A}$ 加上，所以${high ? "正弦为 $1$ 时气温最高" : "正弦为 $-1$ 时气温最低"}。正弦在 ${high ? "$\\frac{\\pi}{2}$" : "$-\\frac{\\pi}{2}$"} 加上 $2\\pi$ 的整数倍处为 ${high ? "$1$" : "$-1$"}。`,
            ),
            para,
            label(2, "Solve for t in the day", "在一天内解出 t"),
            high
              ? t(
                  `Set $\\frac{\\pi}{12}(t - ${c}) = \\frac{\\pi}{2}$. Then $t - ${c} = 6$ and $t = ${ans}$. Other turns give times outside $0 \\le t < 24$.`,
                  `令 $\\frac{\\pi}{12}(t - ${c}) = \\frac{\\pi}{2}$。于是 $t - ${c} = 6$，$t = ${ans}$。其他整圈给出的时刻不在 $0 \\le t < 24$ 内。`,
                )
              : t(
                  `Set $\\frac{\\pi}{12}(t - ${c}) = -\\frac{\\pi}{2}$. Then $t - ${c} = -6$ and $t = ${ans}$. Adding $2\\pi$ to the angle would give $t = ${ans + 24}$, after the day ends.`,
                  `令 $\\frac{\\pi}{12}(t - ${c}) = -\\frac{\\pi}{2}$。于是 $t - ${c} = -6$，$t = ${ans}$。给角加上 $2\\pi$ 会得到 $t = ${ans + 24}$，已超出这一天。`,
                ),
            said(
              `$T(${ans}) = ${M} + ${A}\\sin\\left(${high ? "\\frac{\\pi}{2}" : "-\\frac{\\pi}{2}"}\\right) = ${high ? M + A : M - A}$. That is the ${high ? "highest" : "lowest"} temperature, $${M} ${high ? "+" : "-"} ${A}$.`,
              `$T(${ans}) = ${M} + ${A}\\sin\\left(${high ? "\\frac{\\pi}{2}" : "-\\frac{\\pi}{2}"}\\right) = ${high ? M + A : M - A}$，正是${high ? "最高" : "最低"}气温 $${M} ${high ? "+" : "-"} ${A}$。`,
            ),
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
  intro: t(
    `Interpreting a model reads the situation from the equation. Modeling goes the other way: from the greatest and least values, the length of a cycle and one starting fact, build $y = a\\cos(b(t - c)) + d$. Each piece of information fixes one parameter.

Suppose a buoy bobs between $2$ meters and $4$ meters above the sea floor, reaches the top every $6$ seconds, and is at the top at $t = 0$. The midline and amplitude are

$$d = \\frac{4 + 2}{2} = 3, \\qquad a = \\frac{4 - 2}{2} = 1.$$

The period $6$ gives $b = \\frac{2\\pi}{6} = \\frac{\\pi}{3}$. A cosine starts at its maximum, so no shift is needed: $y = \\cos\\left(\\frac{\\pi}{3}t\\right) + 3$. At $t = 0$ it gives $1 + 3 = 4$, the top, as required.`,
    `解读模型是从方程读出情境。建模则反过来：由最大值和最小值、一个循环的长度以及一个起始事实，建立 $y = a\\cos(b(t - c)) + d$。每条信息确定一个参数。

设一个浮标在离海底 $2$ 米到 $4$ 米之间上下浮动，每 $6$ 秒到达最高处一次，且在 $t = 0$ 时位于最高处。中线和振幅是

$$d = \\frac{4 + 2}{2} = 3, \\qquad a = \\frac{4 - 2}{2} = 1.$$

周期 $6$ 给出 $b = \\frac{2\\pi}{6} = \\frac{\\pi}{3}$。余弦从最大值开始，所以不需要平移：$y = \\cos\\left(\\frac{\\pi}{3}t\\right) + 3$。在 $t = 0$ 时它给出 $1 + 3 = 4$，正是最高处，符合要求。`,
  ),
  knowledgePoints: [
    {
      id: "amplitude-and-midline-from-data",
      title: t("Amplitude and midline from the extremes", "由最值求振幅与中线"),
      explanation: t(
        "For a quantity that swings between a greatest value $M$ and a least value $m$, the model $y = a\\cos(b(t - c)) + d$ with $a > 0$ has\n\n$$a = \\frac{M - m}{2}, \\qquad d = \\frac{M + m}{2}.$$\n\nA Ferris wheel of diameter $40$ m whose lowest point is $2$ m above the ground swings between $2$ and $42$ m, so $a = 20$ (the radius) and $d = 22$ (the height of the center).\n\n> **Watch out.** The amplitude is half the difference of the extremes, not the whole difference, and the midline is their average, not the greatest value. For a Ferris wheel the amplitude is the radius, half the diameter.",
        "对在最大值 $M$ 与最小值 $m$ 之间变化的量，$a > 0$ 的模型 $y = a\\cos(b(t - c)) + d$ 满足\n\n$$a = \\frac{M - m}{2}, \\qquad d = \\frac{M + m}{2}.$$\n\n直径 $40$ 米、最低点离地 $2$ 米的摩天轮在 $2$ 米与 $42$ 米之间变化，所以 $a = 20$（半径），$d = 22$（中心高度）。\n\n> **注意。**振幅是最值之差的一半，而不是整个差；中线是它们的平均值，而不是最大值。对摩天轮，振幅是半径，即直径的一半。",
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
          solution: join(
            label(1, "Find the greatest and least values", "找出最大值与最小值"),
            kind === "wheel"
              ? t(
                  `The rider is lowest at the bottom of the wheel, $${m}$ meters up, and highest one diameter higher, at $${m} + ${M - m} = ${M}$ meters.`,
                  `乘客在摩天轮最低点时最低，离地 $${m}$ 米；在高出一个直径处最高，为 $${m} + ${M - m} = ${M}$ 米。`,
                )
              : t(`The greatest value is $${M}$ and the least is $${m}$.`, `最大值是 $${M}$，最小值是 $${m}$。`),
            para,
            label(2, "Average and half the difference", "取平均值与差的一半"),
            both(
              "The cosine runs from $-1$ to $1$, so the model runs from $d - a$ to $d + a$. The midline is the average of the extremes and the amplitude is half their difference:",
              "余弦从 $-1$ 变到 $1$，所以模型从 $d - a$ 变到 $d + a$。中线是两个最值的平均值，振幅是它们之差的一半：",
              `a = \\frac{${M} - ${m < 0 ? `(${m})` : m}}{2} = ${a}, \\qquad d = \\frac{${M} + ${m < 0 ? `(${m})` : m}}{2} = ${d}`,
            ),
            said(
              `$d + a = ${d} + ${a} = ${M}$, the greatest value, and $d - a = ${d} - ${a} = ${m}$, the least.`,
              `$d + a = ${d} + ${a} = ${M}$，是最大值；$d - a = ${d} - ${a} = ${m}$，是最小值。`,
            ),
          ),
          wrong: askA ? [M - m, d, M, m] : [a, M - m, M, m],
        });
      },
    },
    {
      id: "b-from-the-period-in-context",
      title: t("b from the period", "由周期求 b"),
      explanation: t(
        "If the situation repeats every $P$ units of time, then $\\frac{2\\pi}{b} = P$, so\n\n$$b = \\frac{2\\pi}{P}.$$\n\nA wheel that turns once every $6$ minutes has $b = \\frac{2\\pi}{6} = \\frac{\\pi}{3}$; tides $12$ hours apart give $b = \\frac{\\pi}{6}$; a daily temperature cycle of $24$ hours gives $b = \\frac{\\pi}{12}$.\n\n> **Watch out.** $b = \\frac{2\\pi}{P}$, not $\\frac{P}{2}$ or $\\frac{\\pi}{P}$. A longer period means a smaller $b$.",
        "若情境每隔 $P$ 个时间单位重复一次，则 $\\frac{2\\pi}{b} = P$，所以\n\n$$b = \\frac{2\\pi}{P}.$$\n\n每 $6$ 分钟转一圈的摩天轮有 $b = \\frac{2\\pi}{6} = \\frac{\\pi}{3}$；相隔 $12$ 小时的潮汐给出 $b = \\frac{\\pi}{6}$；以 $24$ 小时为周期的日气温给出 $b = \\frac{\\pi}{12}$。\n\n> **注意。**$b = \\frac{2\\pi}{P}$，而不是 $\\frac{P}{2}$ 或 $\\frac{\\pi}{P}$。周期越长，$b$ 越小。",
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
          join(
            label(1, "Find the period", "找出周期"),
            t(
              `The situation repeats every $${P}$, so the period is $${P}$. The period of $\\cos(bt)$ is $\\frac{2\\pi}{b}$, since the input $bt$ must grow by $2\\pi$ for one cycle.`,
              `情境每 $${P}$ 重复一次，所以周期是 $${P}$。$\\cos(bt)$ 的周期是 $\\frac{2\\pi}{b}$，因为输入 $bt$ 要增加 $2\\pi$ 才完成一个周期。`,
            ),
            para,
            label(2, "Solve for b", "解出 b"),
            both(
              `Set $\\frac{2\\pi}{b} = ${P}$ and solve:`,
              `令 $\\frac{2\\pi}{b} = ${P}$ 并求解：`,
              `b = \\frac{2\\pi}{${P}} = ${piTex(b)}`,
            ),
            said(
              `Over $${P}$ the input grows by $${piTex(b)} \\cdot ${P} = 2\\pi$, exactly one cycle of the cosine.`,
              `经过 $${P}$，输入增加 $${piTex(b)} \\cdot ${P} = 2\\pi$，恰好是余弦的一个周期。`,
            ),
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
        "Build a model step by step: $d$ is the midline, $|a|$ the amplitude, $b = \\frac{2\\pi}{P}$, and the sign of $a$ and the shift $c$ come from where the cycle starts. The function $\\cos$ starts at its maximum, $-\\cos$ at its minimum and $\\sin$ on its midline going up.\n\nA rider boards a Ferris wheel of radius $15$ m, center $17$ m above the ground, at the bottom, and the wheel turns once every $10$ minutes. The height starts at its minimum, so\n\n$$h(t) = 17 - 15\\cos\\left(\\frac{\\pi}{5}t\\right).$$\n\nIf high tide comes at $t = 3$, use $\\cos(b(t - 3))$ so that the maximum is at $t = 3$.\n\n> **Watch out.** Check the start: at the starting time the model must give the starting value. An added cosine term starts at the maximum and a subtracted one at the minimum.",
        "逐步建立模型：$d$ 是中线，$|a|$ 是振幅，$b = \\frac{2\\pi}{P}$，$a$ 的符号和平移量 $c$ 由周期的起点决定。$\\cos$ 从最大值开始，$-\\cos$ 从最小值开始，$\\sin$ 从中线开始并上升。\n\n乘客从最低点登上半径 $15$ 米、中心离地 $17$ 米的摩天轮，摩天轮每 $10$ 分钟转一圈。高度从最小值开始，所以\n\n$$h(t) = 17 - 15\\cos\\left(\\frac{\\pi}{5}t\\right).$$\n\n若在 $t = 3$ 时涨潮，就用 $\\cos(b(t - 3))$，使最大值出现在 $t = 3$。\n\n> **注意。**检查起点：在起始时刻，模型必须给出起始值。加上的余弦项从最大值开始，减去的余弦项从最小值开始。",
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
            join(
              label(1, "Find the midline, amplitude and b", "求中线、振幅与 b"),
              t(
                `The rider circles the center, so the midline is the height of the center, $${C}$, and the amplitude is the radius, $${r}$. One revolution every $${P}$ minutes gives $b = \\frac{2\\pi}{${P}} = ${piTex(q(2, P))}$.`,
                `乘客绕中心转动，所以中线是中心的高度 $${C}$，振幅是半径 $${r}$。每 $${P}$ 分钟转一圈给出 $b = \\frac{2\\pi}{${P}} = ${piTex(q(2, P))}$。`,
              ),
              para,
              label(2, "Match the start", "对应起点"),
              t(
                `At $t = 0$ the cosine is $1$. The rider starts at the ${start === "bottom" ? "minimum, so the cosine term is subtracted" : "maximum, so the cosine term is added"}. The function is $${right.en.slice(1, -1)}$.`,
                `在 $t = 0$ 时余弦为 $1$。乘客从${start === "bottom" ? "最小值开始，所以减去余弦项" : "最大值开始，所以加上余弦项"}。函数为 $${right.en.slice(1, -1)}$。`,
              ),
              said(
                `$h(0) = ${C} ${start === "bottom" ? "-" : "+"} ${r} = ${start === "bottom" ? C - r : C + r}$, the ${start} of the wheel. Half a revolution later, $h(${P / 2}) = ${C} ${start === "bottom" ? "-" : "+"} ${r}\\cos \\pi = ${start === "bottom" ? C + r : C - r}$, the ${start === "bottom" ? "top" : "bottom"}.`,
                `$h(0) = ${C} ${start === "bottom" ? "-" : "+"} ${r} = ${start === "bottom" ? C - r : C + r}$，是摩天轮的${start === "bottom" ? "最低点" : "最高点"}。半圈之后，$h(${P / 2}) = ${C} ${start === "bottom" ? "-" : "+"} ${r}\\cos \\pi = ${start === "bottom" ? C + r : C - r}$，是${start === "bottom" ? "最高点" : "最低点"}。`,
              ),
            ),
            [
              t(
                `At $t = 0$ it gives $${start === "bottom" ? C + r : C - r}$, the ${start === "bottom" ? "top" : "bottom"} of the wheel, not the ${start}.`,
                `在 $t = 0$ 时它给出 $${start === "bottom" ? C + r : C - r}$，是摩天轮的${start === "bottom" ? "最高点" : "最低点"}，而不是${start === "bottom" ? "最低点" : "最高点"}。`,
              ),
              t(
                `Its amplitude $${2 * r}$ is the diameter. The rider moves only one radius, $${r}$, above and below the center.`,
                `它的振幅 $${2 * r}$ 是直径。乘客只在中心上下各移动一个半径 $${r}$。`,
              ),
              t(
                `Its period is $\\frac{2\\pi}{\\pi / ${P}} = ${2 * P}$ minutes, twice the time of one revolution.`,
                `它的周期是 $\\frac{2\\pi}{\\pi / ${P}} = ${2 * P}$ 分钟，是转一圈时间的两倍。`,
              ),
              t(
                `Two mistakes: it starts at the wrong end of the wheel, and its period is $${2 * P}$ minutes instead of $${P}$.`,
                `两个错误：它从摩天轮的另一端开始，周期也是 $${2 * P}$ 分钟而不是 $${P}$ 分钟。`,
              ),
            ],
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
          join(
            label(1, "Find the midline, amplitude and b", "求中线、振幅与 b"),
            t(
              `The midline is $\\frac{${M} + ${m}}{2} = ${d}$ and the amplitude is $\\frac{${M} - ${m}}{2} = ${A}$. High tides every $${P}$ hours give $b = \\frac{2\\pi}{${P}} = ${b}$.`,
              `中线是 $\\frac{${M} + ${m}}{2} = ${d}$，振幅是 $\\frac{${M} - ${m}}{2} = ${A}$。每隔 $${P}$ 小时涨潮给出 $b = \\frac{2\\pi}{${P}} = ${b}$。`,
            ),
            para,
            label(2, "Place the first high tide", "确定第一次涨潮"),
            t(
              `A cosine with a positive coefficient is greatest where its input is $0$. To have high tide at $t = ${c}$, the input must be $b(t - ${c})$. The function is $${right.en.slice(1, -1)}$.`,
              `正系数的余弦在输入为 $0$ 处最大。要在 $t = ${c}$ 时涨潮，输入必须是 $b(t - ${c})$。函数为 $${right.en.slice(1, -1)}$。`,
            ),
            said(
              `$D(${c}) = ${d} + ${A}\\cos 0 = ${M}$, high tide. Half a period later, $D(${c + P / 2}) = ${d} + ${A}\\cos \\pi = ${m}$, low tide.`,
              `$D(${c}) = ${d} + ${A}\\cos 0 = ${M}$，是涨潮。半个周期后，$D(${c + P / 2}) = ${d} + ${A}\\cos \\pi = ${m}$，是落潮。`,
            ),
          ),
          [
            t(
              `Its input is $0$ at $t = -${c}$, so it puts a high tide $${c}$ hours before midnight, not after.`,
              `它的输入在 $t = -${c}$ 时为 $0$，所以它把涨潮放在午夜前 $${c}$ 小时，而不是午夜后。`,
            ),
            t(
              `At $t = ${c}$ it gives $${d} - ${A} = ${m}$, a low tide instead of a high tide.`,
              `在 $t = ${c}$ 时它给出 $${d} - ${A} = ${m}$，是落潮而不是涨潮。`,
            ),
            t(
              `It swaps the midline and the amplitude: it would swing between $${A - d}$ and $${A + d}$.`,
              `它把中线与振幅弄反了：它会在 $${A - d}$ 与 $${A + d}$ 之间变化。`,
            ),
            t(
              `Its period is $\\frac{2\\pi}{\\pi / ${P}} = ${2 * P}$ hours, twice the time between high tides.`,
              `它的周期是 $\\frac{2\\pi}{\\pi / ${P}} = ${2 * P}$ 小时，是两次涨潮间隔的两倍。`,
            ),
          ],
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
