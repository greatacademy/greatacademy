import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Compass, dec, type Mark, type Point, Q, sketch } from "@ga/subject-math";

import { choiceProblem, numberProblem, steps } from "../problems.ts";

// Algebra II, unit 8 (continued): trigonometry with general triangles — the
// law of sines, the law of cosines, the area of a triangle from two sides and
// the included angle, and models built on them. Angles are in degrees, and the
// ratios of obtuse angles come from a calculator.

const rad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

/** sin is the sine of an angle in degrees. */
const sin = (d: number) => Math.sin(rad(d));

/** cos is the cosine of an angle in degrees. */
const cos = (d: number) => Math.cos(rad(d));

/** asinD is the inverse sine in degrees. */
const asinD = (v: number) => toDeg(Math.asin(v));

/** acosD is the inverse cosine in degrees. */
const acosD = (v: number) => toDeg(Math.acos(v));

/** t4 is x rounded to four decimal places, as a calculator value copied by hand. */
const t4 = (x: number) => Math.round(x * 1e4) / 1e4;

/** roundQ is x rounded to the given number of decimal places, as an exact number. */
const roundQ = (x: number, places = 1) => Q.of(Math.round(x * 10 ** places), 10 ** places);

/** r4 writes x rounded to four decimal places. */
const r4 = (x: number) => dec(roundQ(x, 4));

/** eqR4 writes "= x" when x has at most four decimal places, and "≈ x" rounded to four places otherwise. */
const eqR4 = (x: number) => `${Math.abs(x - t4(x)) < 1e-12 ? "=" : "\\approx"} ${r4(x)}`;

/**
 * rounded is x rounded to the given number of decimal places, or undefined when
 * x lies close to a rounding boundary or approx (the same computation with
 * ratios rounded to four places) rounds differently, so that every learner
 * with a calculator gets the same answer.
 */
function rounded(x: number, approx: number, places = 1): Q | undefined {
  const s = x * 10 ** places;
  if (!Number.isFinite(s) || Math.abs(s - Math.floor(s) - 0.5) < 0.1 || Math.round(s) !== Math.round(approx * 10 ** places)) {
    return undefined;
  }
  return roundQ(x, places);
}

/** wrongs rounds the values typical mistakes produce, dropping those that are not positive numbers. */
const wrongs = (...xs: number[]): Q[] => xs.filter((x) => Number.isFinite(x) && x > 0).map((x) => roundQ(x));

/** dir is the point at distance r from o in direction d degrees. */
const dir = (d: number, r = 1, o: Point = [0, 0]): Point => [o[0] + r * Math.cos(rad(d)), o[1] + r * Math.sin(rad(d))];

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** Tri is the three vertices of a triangle, numbered 0, 1 and 2. */
type Tri = readonly [Point, Point, Point];

/** fromAngles places a triangle with angles a0 at vertex 0 and a1 at vertex 1. */
function fromAngles(a0: number, a1: number): Tri {
  return [[0, 0], [sin(180 - a0 - a1), 0], dir(a0, sin(a1))];
}

/** fromSAS places a triangle with sides s01 and s20 meeting at the angle a0 at vertex 0. */
function fromSAS(s01: number, a0: number, s20: number): Tri {
  return [[0, 0], [s01, 0], dir(a0, s20)];
}

/** fromSides places a triangle with the given three sides. */
function fromSides(s01: number, s12: number, s20: number): Tri {
  return fromSAS(s01, acosD((s01 * s01 + s20 * s20 - s12 * s12) / (2 * s01 * s20)), s20);
}

/** Pose turns and maybe mirrors a drawing, so that figures do not all face the same way. */
interface Pose {
  readonly turn: number;
  readonly mirror: boolean;
}

const pickPose = (rng: Rng): Pose => ({ turn: rng.pick([0, 0, 0, 180, 15, -15, 30, -30]), mirror: rng.bool() });

/** posed applies a pose to a triangle. */
function posed(tri: Tri, pose: Pose): Tri {
  const [c, s] = [Math.cos(rad(pose.turn)), Math.sin(rad(pose.turn))];
  return tri.map(([x0, y]) => {
    const x = pose.mirror ? -x0 : x0;
    return [x * c - y * s, x * s + y * c] as Point;
  }) as unknown as Tri;
}

const compasses: readonly Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];

/** compassOf is the compass direction nearest to the direction (dx, dy). */
function compassOf(dx: number, dy: number): Compass {
  const a = (toDeg(Math.atan2(dy, dx)) + 360 + 22.5) % 360;
  return compasses[Math.floor(a / 45) % 8]!;
}

/** TriLabels label a triangle: its sides 01, 12 and 20, the angles at vertices 0, 1 and 2, and the vertex letters. */
interface TriLabels {
  readonly sides: readonly [string | null, string | null, string | null];
  readonly angles: readonly [string | null, string | null, string | null];
  readonly letters: string;
}

/** triMarks draws a triangle with side labels outside it, angle arcs and vertex letters. */
function triMarks(tri: Tri, l: TriLabels): Mark[] {
  const [p0, p1, p2] = tri;
  const ccw = (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p2[0] - p0[0]) * (p1[1] - p0[1]) > 0;
  const c: Point = [(p0[0] + p1[0] + p2[0]) / 3, (p0[1] + p1[1] + p2[1]) / 3];
  const marks: Mark[] = [{ kind: "polygon", points: [p0, p1, p2] }];
  tri.forEach((p, i) => {
    const q = tri[(i + 1) % 3]!;
    const r = tri[(i + 2) % 3]!;
    const side = l.sides[i];
    if (side) marks.push({ kind: "side", a: ccw ? p : q, b: ccw ? q : p, text: side });
    const angle = l.angles[i];
    if (angle) marks.push({ kind: "arc", vertex: p, from: q, to: r, label: angle, accent: true });
    marks.push({ kind: "label", at: p, text: l.letters[i]!, dir: compassOf(p[0] - c[0], p[1] - c[1]), italic: true });
  });
  return marks;
}

/** triFigure draws a labeled triangle in a random pose. */
const triFigure = (rng: Rng, tri: Tri, l: TriLabels, en: string, zh: string): Figure =>
  figure(triMarks(posed(tri, pickPose(rng)), l), en, zh);

const triangleLetters = ["ABC", "PQR", "XYZ", "DEF", "JKL", "LMN", "RST"] as const;

/** pickLetters picks the letters of the vertices 0, 1 and 2 of a triangle. */
const pickLetters = (rng: Rng) => rng.shuffle(rng.pick(triangleLetters).split("")) as [string, string, string];

/** deg writes an angle in degrees in LaTeX: "40^\circ". */
const deg = (d: number | string) => `${d}^\\circ`;

/** sinOf writes the sine of an angle in degrees: "\sin 40^\circ". */
const sinOf = (d: number) => `\\sin ${deg(d)}`;

/** cosOf writes the cosine of an angle in degrees: "\cos 40^\circ". */
const cosOf = (d: number) => `\\cos ${deg(d)}`;

/** unitM writes a length in meters in LaTeX. */
const unitM = (v: number | string) => `${v}\\text{ m}`;

/** unitKm writes a length in kilometers in LaTeX. */
const unitKm = (v: number | string) => `${v}\\text{ km}`;

const toTenth = t("Round to the nearest tenth.", "结果精确到十分位。");
const toTenthDegree = t("Round to the nearest tenth of a degree.", "结果精确到 $0.1^\\circ$。");

/** cosRule writes the law of cosines solved for the side opposite the angle a between sides p and q. */
const cosRuleTex = (x: string, p: number, q: number, a: number) => `${x}^2 = ${p}^2 + ${q}^2 - 2 \\cdot ${p} \\cdot ${q} ${cosOf(a)}`;

/** sideByCosines is the side opposite the angle a between sides p and q, with its value from four-place ratios. */
function sideByCosines(p: number, q: number, a: number): { exact: number; approx: number } {
  return {
    exact: Math.sqrt(p * p + q * q - 2 * p * q * cos(a)),
    approx: Math.sqrt(p * p + q * q - 2 * p * q * t4(cos(a))),
  };
}

/** sideWrongs are the sides typical mistakes with the law of cosines produce: the wrong sign, no cosine term, no square root. */
function sideWrongs(p: number, q: number, a: number): Q[] {
  return wrongs(Math.sqrt(p * p + q * q + 2 * p * q * cos(a)), Math.sqrt(p * p + q * q), p * p + q * q - 2 * p * q * cos(a));
}

/** angleByCosines is the angle opposite side r in a triangle with sides p, q and r, with the cosine as a LaTeX fraction. */
function angleByCosines(p: number, q: number, r: number): { angle: number; cosine: number; frac: string } {
  const top = p * p + q * q - r * r;
  return {
    angle: acosD(top / (2 * p * q)),
    cosine: top / (2 * p * q),
    frac: `\\frac{${p}^2 + ${q}^2 - ${r}^2}{2 \\cdot ${p} \\cdot ${q}}`,
  };
}

/** isTriangle tells whether three sides make a triangle that is not too thin to draw. */
const isTriangle = (a: number, b: number, c: number) => a + b > c + 1 && b + c > a + 1 && c + a > b + 1;

/** shortBase tells whether the side between vertices 0 and 1 of a triangle with angles a0 and a1 there is too short to keep the labels of both angles apart. */
const shortBase = (a0: number, a1: number) => sin(180 - a0 - a1) < 0.55 * Math.max(sin(a0), sin(a1));

/** thinSSS tells whether the triangle with sides a, b and c has an angle under 20°. */
const thinSSS = (a: number, b: number, c: number) =>
  Math.min(angleByCosines(a, b, c).angle, angleByCosines(b, c, a).angle, angleByCosines(c, a, b).angle) < 20;

/** thinSAS tells whether the triangle with sides p and q around the angle a has another angle under 20° or, around an obtuse angle, a low height, too thin to draw clearly. */
function thinSAS(p: number, a: number, q: number): boolean {
  const r = sideByCosines(p, q, a).exact;
  const b = acosD((p * p + r * r - q * q) / (2 * p * r));
  return b < 20 || 180 - a - b < 20 || (a > 105 && (p * q * sin(a)) / (r * r) < 0.3);
}

/** The Law of Sines. */
export const theLawOfSines: TopicDef = {
  id: "the-law-of-sines",
  title: t("The Law of Sines", "正弦定理"),
  summary: t(
    "Use the law of sines to find sides and angles of any triangle, including the ambiguous case of two sides and a non-included angle.",
    "用正弦定理求任意三角形的边和角，包括已知两边及其中一边对角时的多解情况。",
  ),
  prerequisites: ["calculating-angles-in-right-triangles-using-trigonometry", "angles-of-a-triangle"],
  encompasses: [
    { topic: "calculating-angles-in-right-triangles-using-trigonometry", weight: 0.3 },
    { topic: "calculating-side-lengths-of-right-triangles-using-trigonometry", weight: 0.3 },
    { topic: "angles-of-a-triangle", weight: 0.1 },
  ],
  xp: 18,
  standards: ["CCSS.HSG.SRT.D.10", "CCSS.HSG.SRT.D.11"],
  knowledgePoints: [
    {
      id: "a-side-opposite-a-known-angle",
      title: t("A side opposite a known angle", "已知角的对边"),
      explanation: t(
        "In $\\triangle ABC$, write $a$, $b$ and $c$ for the sides opposite the angles $A$, $B$ and $C$. The height from $C$ to $AB$ is both $b \\sin A$ and $a \\sin B$, so $\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$. The same holds for every pair, which is the **law of sines**:\n\n$$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}.$$\n\nEach side is paired with the angle **opposite** it. With $A = 40^\\circ$, $B = 65^\\circ$ and $a = 12$:\n\n$$\\frac{b}{\\sin 65^\\circ} = \\frac{12}{\\sin 40^\\circ}, \\qquad b = \\frac{12 \\sin 65^\\circ}{\\sin 40^\\circ} \\approx 16.9.$$\n\nA calculator gives the sine of an obtuse angle as well: $\\sin 130^\\circ \\approx 0.766$, the same as $\\sin 50^\\circ$.",
        "在 $\\triangle ABC$ 中，用 $a$、$b$、$c$ 表示角 $A$、$B$、$C$ 的对边。从 $C$ 到 $AB$ 的高既等于 $b \\sin A$，也等于 $a \\sin B$，所以 $\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$。每一对边角都是如此，这就是**正弦定理**：\n\n$$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}.$$\n\n每条边都和它**所对**的角配对。$A = 40^\\circ$，$B = 65^\\circ$，$a = 12$ 时：\n\n$$\\frac{b}{\\sin 65^\\circ} = \\frac{12}{\\sin 40^\\circ}, \\qquad b = \\frac{12 \\sin 65^\\circ}{\\sin 40^\\circ} \\approx 16.9.$$\n\n计算器也能给出钝角的正弦：$\\sin 130^\\circ \\approx 0.766$，与 $\\sin 50^\\circ$ 相同。",
      ),
      generate(rng) {
        for (;;) {
          const A = rng.int(25, 115);
          const B = rng.int(25, 115);
          const C = 180 - A - B;
          if (C < 30 || A === B) continue;
          const a = rng.int(5, 40);
          const [sA, sB] = [sin(A), sin(B)];
          const answer = rounded((a * sB) / sA, (a * t4(sB)) / t4(sA));
          if (!answer) continue;
          const [L0, L1, L2] = pickLetters(rng);
          const work = steps(
            `\\frac{x}{${sinOf(B)}} = \\frac{${a}}{${sinOf(A)}}`,
            `x = \\frac{${a} ${sinOf(B)}}{${sinOf(A)}} \\approx ${dec(answer)}`,
          );
          return {
            ...numberProblem({
              prompt: t(
                `In $\\triangle ${L0}${L1}${L2}$, $\\angle ${L0} = ${deg(A)}$, $\\angle ${L1} = ${deg(B)}$ and $${L1}${L2} = ${a}$. Find $x = ${L0}${L2}$. ${toTenth.en}`,
                `在 $\\triangle ${L0}${L1}${L2}$ 中，$\\angle ${L0} = ${deg(A)}$，$\\angle ${L1} = ${deg(B)}$，$${L1}${L2} = ${a}$。求 $x = ${L0}${L2}$。${toTenth["zh-CN"]}`,
              ),
              answer,
              form: "decimal",
              wrong: wrongs((a * sA) / sB, a * sB, (a * sin(C)) / sA),
              solution: t(
                `The side $${a}$ is opposite $\\angle ${L0}$ and $x$ is opposite $\\angle ${L1}$, so the law of sines gives${work}`,
                `边 $${a}$ 是 $\\angle ${L0}$ 的对边，$x$ 是 $\\angle ${L1}$ 的对边，由正弦定理得${work}`,
              ),
            }),
            figure: triFigure(
              rng,
              fromAngles(A, B),
              { sides: [null, `${a}`, "x"], angles: [`${A}°`, `${B}°`, null], letters: `${L0}${L1}${L2}` },
              `Triangle ${L0}${L1}${L2} with angle ${L0} = ${A}°, angle ${L1} = ${B}°, ${L1}${L2} = ${a} and ${L0}${L2} = x.`,
              `三角形 ${L0}${L1}${L2}，角 ${L0} = ${A}°，角 ${L1} = ${B}°，${L1}${L2} = ${a}，${L0}${L2} = x。`,
            ),
          };
        }
      },
    },
    {
      id: "two-angles-and-the-included-side",
      title: t("Two angles and the included side", "两角及其夹边"),
      explanation: t(
        "When the known side lies between the two known angles, no known angle is opposite it. Find the third angle first, since the angles add up to $180^\\circ$, then use the law of sines.\n\nWith $A = 50^\\circ$, $B = 70^\\circ$ and $c = AB = 10$: $C = 180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$, and\n\n$$\\frac{a}{\\sin 50^\\circ} = \\frac{10}{\\sin 60^\\circ}, \\qquad a = \\frac{10 \\sin 50^\\circ}{\\sin 60^\\circ} \\approx 8.8.$$",
        "当已知边夹在两个已知角之间时，没有已知角是它的对角。先由三角形内角和为 $180^\\circ$ 求出第三个角，再用正弦定理。\n\n$A = 50^\\circ$，$B = 70^\\circ$，$c = AB = 10$ 时：$C = 180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$，且\n\n$$\\frac{a}{\\sin 50^\\circ} = \\frac{10}{\\sin 60^\\circ}, \\qquad a = \\frac{10 \\sin 50^\\circ}{\\sin 60^\\circ} \\approx 8.8.$$",
      ),
      keyPrerequisites: ["angles-of-a-triangle"],
      generate(rng) {
        for (;;) {
          const A = rng.int(25, 115);
          const B = rng.int(25, 115);
          const C = 180 - A - B;
          if (C < 30 || A === B) continue;
          const c = rng.int(5, 40);
          // The side asked for is opposite the angle at vertex 0 (side 12) or at vertex 1 (side 20).
          const atZero = rng.bool();
          const [ask, other] = atZero ? [A, B] : [B, A];
          const answer = rounded((c * sin(ask)) / sin(C), (c * t4(sin(ask))) / t4(sin(C)));
          if (!answer) continue;
          const [L0, L1, L2] = pickLetters(rng);
          const side = atZero ? `${L1}${L2}` : `${L0}${L2}`;
          const askAt = atZero ? L0 : L1;
          const work = steps(
            `\\angle ${L2} = 180^\\circ - ${deg(A)} - ${deg(B)} = ${deg(C)}`,
            `\\frac{x}{${sinOf(ask)}} = \\frac{${c}}{${sinOf(C)}}`,
            `x = \\frac{${c} ${sinOf(ask)}}{${sinOf(C)}} \\approx ${dec(answer)}`,
          );
          return {
            ...numberProblem({
              prompt: t(
                `In $\\triangle ${L0}${L1}${L2}$, $\\angle ${L0} = ${deg(A)}$, $\\angle ${L1} = ${deg(B)}$ and $${L0}${L1} = ${c}$. Find $x = ${side}$. ${toTenth.en}`,
                `在 $\\triangle ${L0}${L1}${L2}$ 中，$\\angle ${L0} = ${deg(A)}$，$\\angle ${L1} = ${deg(B)}$，$${L0}${L1} = ${c}$。求 $x = ${side}$。${toTenth["zh-CN"]}`,
              ),
              answer,
              form: "decimal",
              wrong: wrongs((c * sin(other)) / sin(C), (c * sin(C)) / sin(ask), (c * sin(ask)) / sin(other)),
              solution: t(
                `The side $${c}$ is opposite $\\angle ${L2}$, so find that angle first. Then $x$ is opposite $\\angle ${askAt}$:${work}`,
                `边 $${c}$ 是 $\\angle ${L2}$ 的对边，所以先求这个角。$x$ 是 $\\angle ${askAt}$ 的对边：${work}`,
              ),
            }),
            figure: triFigure(
              rng,
              fromAngles(A, B),
              {
                sides: [`${c}`, atZero ? "x" : null, atZero ? null : "x"],
                angles: [`${A}°`, `${B}°`, null],
                letters: `${L0}${L1}${L2}`,
              },
              `Triangle ${L0}${L1}${L2} with angle ${L0} = ${A}°, angle ${L1} = ${B}°, ${L0}${L1} = ${c} and ${side} = x.`,
              `三角形 ${L0}${L1}${L2}，角 ${L0} = ${A}°，角 ${L1} = ${B}°，${L0}${L1} = ${c}，${side} = x。`,
            ),
          };
        }
      },
    },
    {
      id: "finding-an-angle",
      title: t("Finding an angle", "求角"),
      explanation: t(
        "The law of sines also finds an angle opposite a known side, when another side and its opposite angle are known. Write it with the sines on top:\n\n$$\\frac{\\sin B}{b} = \\frac{\\sin A}{a}.$$\n\nWith $a = 14$, $b = 9$ and $A = 72^\\circ$: $\\sin B = \\frac{9 \\sin 72^\\circ}{14} \\approx 0.6114$, so $B = \\sin^{-1} 0.6114 \\approx 37.7^\\circ$.\n\nAn obtuse angle has the same sine as its supplement ($180^\\circ - 37.7^\\circ = 142.3^\\circ$ also has sine $0.6114$). Here $b < a$, so $B$ is smaller than $A$ and cannot be obtuse: $37.7^\\circ$ is the only answer.",
        "已知一条边及其对角，再知道另一条边时，正弦定理也能求出这条边的对角。把正弦写在分子上：\n\n$$\\frac{\\sin B}{b} = \\frac{\\sin A}{a}.$$\n\n$a = 14$，$b = 9$，$A = 72^\\circ$ 时：$\\sin B = \\frac{9 \\sin 72^\\circ}{14} \\approx 0.6114$，所以 $B = \\sin^{-1} 0.6114 \\approx 37.7^\\circ$。\n\n钝角与它的补角正弦相同（$180^\\circ - 37.7^\\circ = 142.3^\\circ$ 的正弦也是 $0.6114$）。这里 $b < a$，所以 $B$ 小于 $A$，不可能是钝角：$37.7^\\circ$ 是唯一的答案。",
      ),
      generate(rng) {
        for (;;) {
          const A = rng.int(25, 140);
          const a = rng.int(6, 30);
          const b = rng.int(3, a - 1);
          if (b * 20 < a * 7) continue;
          const v = (b * sin(A)) / a;
          const B = asinD(v);
          if (180 - A - B < 18 || B < 15 || shortBase(A, B)) continue;
          const answer = rounded(B, asinD((b * t4(sin(A))) / a));
          if (!answer) continue;
          const [L0, L1, L2] = pickLetters(rng);
          const swapped = (a * sin(A)) / b;
          const work = steps(
            `\\frac{\\sin \\theta}{${b}} = \\frac{${sinOf(A)}}{${a}}`,
            `\\sin \\theta = \\frac{${b} ${sinOf(A)}}{${a}} \\approx ${r4(v)}`,
            `\\theta = \\sin^{-1} ${r4(v)} \\approx ${dec(answer)}^\\circ`,
          );
          return {
            ...numberProblem({
              prompt: t(
                `In $\\triangle ${L0}${L1}${L2}$, $\\angle ${L0} = ${deg(A)}$, $${L1}${L2} = ${a}$ and $${L0}${L2} = ${b}$. Find $\\theta = \\angle ${L1}$. ${toTenthDegree.en}`,
                `在 $\\triangle ${L0}${L1}${L2}$ 中，$\\angle ${L0} = ${deg(A)}$，$${L1}${L2} = ${a}$，$${L0}${L2} = ${b}$。求 $\\theta = \\angle ${L1}$。${toTenthDegree["zh-CN"]}`,
              ),
              answer,
              form: "decimal",
              unit: "°",
              wrong: wrongs(180 - B, asinD(b / a), swapped <= 1 ? asinD(swapped) : Number.NaN),
              solution: t(
                `The side $${b}$ is opposite $\\theta$ and the side $${a}$ is opposite the $${deg(A)}$ angle:${work}Since $${b} < ${a}$, $\\theta$ is smaller than $\\angle ${L0}$, so it is not obtuse.`,
                `边 $${b}$ 是 $\\theta$ 的对边，边 $${a}$ 是 $${deg(A)}$ 角的对边：${work}因为 $${b} < ${a}$，$\\theta$ 小于 $\\angle ${L0}$，所以不是钝角。`,
              ),
            }),
            figure: triFigure(
              rng,
              fromAngles(A, B),
              { sides: [null, `${a}`, `${b}`], angles: [`${A}°`, "θ", null], letters: `${L0}${L1}${L2}` },
              `Triangle ${L0}${L1}${L2} with angle ${L0} = ${A}°, ${L1}${L2} = ${a}, ${L0}${L2} = ${b}, and θ the angle at ${L1}.`,
              `三角形 ${L0}${L1}${L2}，角 ${L0} = ${A}°，${L1}${L2} = ${a}，${L0}${L2} = ${b}，θ 是 ${L1} 处的角。`,
            ),
          };
        }
      },
    },
    {
      id: "the-ambiguous-case",
      title: t("The ambiguous case", "多解情况"),
      explanation: t(
        "Given $A$, $a$ and $b$ with $A$ acute, swing the side $a$ from $C$ toward the line through $A$. The height from $C$ is $h = b \\sin A$:\n\n- $a < h$: $a$ does not reach the line, so there is **no** triangle;\n- $h < a < b$: $a$ meets the line at two points, so there are **two** triangles, one with $B$ acute and one with $B$ obtuse;\n- $a \\ge b$: there is exactly **one** triangle.\n\nWith $A = 35^\\circ$, $b = 12$ and $a = 9$: $h = 12 \\sin 35^\\circ \\approx 6.88$, and $6.88 < 9 < 12$, so there are two triangles. From $\\sin B = \\frac{12 \\sin 35^\\circ}{9} \\approx 0.7648$, the acute value is $B \\approx 49.9^\\circ$ and the obtuse value is $B \\approx 180^\\circ - 49.9^\\circ = 130.1^\\circ$.",
        "已知 $A$、$a$、$b$ 且 $A$ 为锐角时，让边 $a$ 绕 $C$ 向过 $A$ 的直线摆动。从 $C$ 出发的高是 $h = b \\sin A$：\n\n- $a < h$：$a$ 够不到这条直线，**没有**三角形；\n- $h < a < b$：$a$ 与这条直线交于两点，有**两个**三角形，一个 $B$ 为锐角，一个 $B$ 为钝角；\n- $a \\ge b$：恰好有**一个**三角形。\n\n$A = 35^\\circ$，$b = 12$，$a = 9$ 时：$h = 12 \\sin 35^\\circ \\approx 6.88$，而 $6.88 < 9 < 12$，所以有两个三角形。由 $\\sin B = \\frac{12 \\sin 35^\\circ}{9} \\approx 0.7648$，锐角解为 $B \\approx 49.9^\\circ$，钝角解为 $B \\approx 180^\\circ - 49.9^\\circ = 130.1^\\circ$。",
      ),
      generate(rng) {
        for (;;) {
          const A = rng.int(25, 70);
          const b = rng.int(6, 30);
          const h = b * sin(A);
          if (Math.ceil(h) > b - 1) continue;
          const [L0, L1, L2] = pickLetters(rng);
          const given = (x: number) => `$\\angle ${L0} = ${deg(A)}$, $${L1}${L2} = ${x}$ and $${L0}${L2} = ${b}$`;
          const givenZh = (x: number) => `$\\angle ${L0} = ${deg(A)}$，$${L1}${L2} = ${x}$，$${L0}${L2} = ${b}$`;
          const hTex = `h = ${b} ${sinOf(A)} \\approx ${dec(roundQ(h, 2))}`;
          if (rng.bool()) {
            const count = rng.int(0, 2);
            const a =
              count === 0 ? rng.int(2, Math.max(2, Math.floor(h))) : count === 2 ? rng.int(Math.ceil(h), b - 1) : rng.int(b, b + 10);
            if ((count === 0 && h - a < 0.3) || (count === 2 && (a - h < 0.3 || a >= b))) continue;
            const reason =
              count === 0
                ? t(
                    `$${a} < ${dec(roundQ(h, 2))}$: the side $${L1}${L2}$ is too short to reach, so there is no triangle.`,
                    `$${a} < ${dec(roundQ(h, 2))}$：边 $${L1}${L2}$ 太短，够不到，所以没有三角形。`,
                  )
                : count === 2
                  ? t(
                      `$${dec(roundQ(h, 2))} < ${a} < ${b}$: the side $${L1}${L2}$ reaches the line at two points, so there are two triangles.`,
                      `$${dec(roundQ(h, 2))} < ${a} < ${b}$：边 $${L1}${L2}$ 与直线交于两点，所以有两个三角形。`,
                    )
                  : t(
                      `$${a} \\ge ${b}$: the side $${L1}${L2}$ is at least as long as $${L0}${L2}$, so there is exactly one triangle.`,
                      `$${a} \\ge ${b}$：边 $${L1}${L2}$ 不短于 $${L0}${L2}$，所以恰好有一个三角形。`,
                    );
            return choiceProblem({
              prompt: t(`How many triangles $${L0}${L1}${L2}$ have ${given(a)}?`, `满足 ${givenZh(a)} 的三角形 $${L0}${L1}${L2}$ 有几个？`),
              options: [t("None", "没有"), t("Exactly one", "恰好一个"), t("Two", "两个")],
              correct: count,
              solution: t(
                `The height from $${L2}$ to the line through $${L0}$ is${steps(hTex)}${reason.en}`,
                `从 $${L2}$ 到过 $${L0}$ 的直线的高是${steps(hTex)}${reason["zh-CN"]}`,
              ),
            });
          }
          const a = rng.int(Math.ceil(h), b - 1);
          if (a - h < 0.3 || a >= b) continue;
          const v = (b * sin(A)) / a;
          const acute = asinD(v);
          if (acute - A < 15 || shortBase(A, 180 - acute)) continue;
          const answer = rounded(180 - acute, 180 - asinD((b * t4(sin(A))) / a));
          if (!answer) continue;
          const acuteQ = roundQ(acute);
          const work = steps(
            `\\sin \\theta = \\frac{${b} ${sinOf(A)}}{${a}} \\approx ${r4(v)}`,
            `\\sin^{-1} ${r4(v)} \\approx ${dec(acuteQ)}^\\circ`,
            `\\theta \\approx 180^\\circ - ${dec(acuteQ)}^\\circ = ${dec(answer)}^\\circ`,
          );
          return {
            ...numberProblem({
              prompt: t(
                `Two triangles $${L0}${L1}${L2}$ have ${given(a)}. In the one shown, $\\theta = \\angle ${L1}$ is obtuse. Find $\\theta$. ${toTenthDegree.en}`,
                `有两个三角形 $${L0}${L1}${L2}$ 满足 ${givenZh(a)}。图中这个三角形的 $\\theta = \\angle ${L1}$ 是钝角。求 $\\theta$。${toTenthDegree["zh-CN"]}`,
              ),
              answer,
              form: "decimal",
              unit: "°",
              wrong: wrongs(acute, 180 - A - acute, 180 - asinD(b / a)),
              solution: t(
                `By the law of sines,${work}The inverse sine gives the acute angle; the obtuse angle with the same sine is its supplement.`,
                `由正弦定理，${work}反正弦给出的是锐角；正弦相同的钝角是它的补角。`,
              ),
            }),
            figure: triFigure(
              rng,
              fromAngles(A, 180 - acute),
              { sides: [null, `${a}`, `${b}`], angles: [`${A}°`, "θ", null], letters: `${L0}${L1}${L2}` },
              `Triangle ${L0}${L1}${L2} with angle ${L0} = ${A}°, ${L1}${L2} = ${a}, ${L0}${L2} = ${b}, and the obtuse angle θ at ${L1}.`,
              `三角形 ${L0}${L1}${L2}，角 ${L0} = ${A}°，${L1}${L2} = ${a}，${L0}${L2} = ${b}，${L1} 处是钝角 θ。`,
            ),
          };
        }
      },
    },
  ],
};

/** The Law of Cosines. */
export const theLawOfCosines: TopicDef = {
  id: "the-law-of-cosines",
  title: t("The Law of Cosines", "余弦定理"),
  summary: t(
    "Use the law of cosines to find the third side from two sides and the included angle, and an angle from three sides.",
    "用余弦定理由两边及其夹角求第三边，由三边求角。",
  ),
  prerequisites: ["the-law-of-sines"],
  encompasses: [
    { topic: "the-law-of-sines", weight: 0.2 },
    { topic: "the-pythagorean-theorem", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSG.SRT.D.10", "CCSS.HSG.SRT.D.11"],
  knowledgePoints: [
    {
      id: "finding-a-side",
      title: t("Finding the third side", "求第三边"),
      explanation: t(
        "When two sides and the angle **between** them are known, no angle is opposite a known side, so the law of sines does not help. The **law of cosines** does:\n\n$$a^2 = b^2 + c^2 - 2bc \\cos A.$$\n\nWhen $A = 90^\\circ$, $\\cos A = 0$ and this is the Pythagorean theorem. With $b = 8$, $c = 11$ and $A = 120^\\circ$ (a calculator gives $\\cos 120^\\circ = -0.5$):\n\n$$a^2 = 8^2 + 11^2 - 2 \\cdot 8 \\cdot 11 \\cos 120^\\circ = 185 + 88 = 273, \\qquad a = \\sqrt{273} \\approx 16.5.$$\n\nThe cosine of an obtuse angle is negative, so the third side comes out longer than the Pythagorean theorem would give.",
        "已知两边及其**夹角**时，没有角是已知边的对角，正弦定理用不上。这时用**余弦定理**：\n\n$$a^2 = b^2 + c^2 - 2bc \\cos A.$$\n\n当 $A = 90^\\circ$ 时，$\\cos A = 0$，这就是勾股定理。$b = 8$，$c = 11$，$A = 120^\\circ$ 时（计算器给出 $\\cos 120^\\circ = -0.5$）：\n\n$$a^2 = 8^2 + 11^2 - 2 \\cdot 8 \\cdot 11 \\cos 120^\\circ = 185 + 88 = 273, \\qquad a = \\sqrt{273} \\approx 16.5.$$\n\n钝角的余弦是负数，所以第三边比用勾股定理算出的更长。",
      ),
      generate(rng) {
        for (;;) {
          const A = rng.int(25, 140);
          const b = rng.int(4, 25);
          const c = rng.int(4, 25);
          if (A === 90 || A === 60 || A === 120 || thinSAS(c, A, b)) continue;
          const { exact, approx } = sideByCosines(b, c, A);
          const answer = rounded(exact, approx);
          if (!answer || exact < 2) continue;
          const [L0, L1, L2] = pickLetters(rng);
          const work = steps(cosRuleTex("x", b, c, A), `x = \\sqrt{${b * b + c * c} - ${2 * b * c} ${cosOf(A)}} \\approx ${dec(answer)}`);
          return {
            ...numberProblem({
              prompt: t(
                `In $\\triangle ${L0}${L1}${L2}$, $${L0}${L1} = ${c}$, $${L0}${L2} = ${b}$ and $\\angle ${L0} = ${deg(A)}$. Find $x = ${L1}${L2}$. ${toTenth.en}`,
                `在 $\\triangle ${L0}${L1}${L2}$ 中，$${L0}${L1} = ${c}$，$${L0}${L2} = ${b}$，$\\angle ${L0} = ${deg(A)}$。求 $x = ${L1}${L2}$。${toTenth["zh-CN"]}`,
              ),
              answer,
              form: "decimal",
              wrong: sideWrongs(b, c, A),
              solution: t(
                `The angle $${deg(A)}$ lies between the sides $${b}$ and $${c}$, and $x$ is opposite it. By the law of cosines,${work}`,
                `$${deg(A)}$ 角夹在边 $${b}$ 和 $${c}$ 之间，$x$ 是它的对边。由余弦定理，${work}`,
              ),
            }),
            figure: triFigure(
              rng,
              fromSAS(c, A, b),
              { sides: [`${c}`, "x", `${b}`], angles: [`${A}°`, null, null], letters: `${L0}${L1}${L2}` },
              `Triangle ${L0}${L1}${L2} with ${L0}${L1} = ${c}, ${L0}${L2} = ${b}, angle ${L0} = ${A}° and ${L1}${L2} = x.`,
              `三角形 ${L0}${L1}${L2}，${L0}${L1} = ${c}，${L0}${L2} = ${b}，角 ${L0} = ${A}°，${L1}${L2} = x。`,
            ),
          };
        }
      },
    },
    {
      id: "finding-an-angle-from-three-sides",
      title: t("An angle from three sides", "由三边求角"),
      explanation: t(
        "Solve the law of cosines for the cosine of the angle:\n\n$$\\cos C = \\frac{a^2 + b^2 - c^2}{2ab},$$\n\nwhere $c$ is the side **opposite** $C$ and $a$, $b$ are the sides that form it. With $a = 7$, $b = 9$ and $c = 8$:\n\n$$\\cos C = \\frac{7^2 + 9^2 - 8^2}{2 \\cdot 7 \\cdot 9} = \\frac{66}{126} \\approx 0.5238, \\qquad C = \\cos^{-1} 0.5238 \\approx 58.4^\\circ.$$",
        "把余弦定理解出角的余弦：\n\n$$\\cos C = \\frac{a^2 + b^2 - c^2}{2ab},$$\n\n其中 $c$ 是 $C$ 的**对边**，$a$、$b$ 是夹成这个角的两边。$a = 7$，$b = 9$，$c = 8$ 时：\n\n$$\\cos C = \\frac{7^2 + 9^2 - 8^2}{2 \\cdot 7 \\cdot 9} = \\frac{66}{126} \\approx 0.5238, \\qquad C = \\cos^{-1} 0.5238 \\approx 58.4^\\circ.$$",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(4, 25);
          const b = rng.int(4, 25);
          const c = rng.int(3, 24);
          if (!isTriangle(a, b, c) || c >= Math.max(a, b) || thinSSS(a, b, c)) continue;
          const { angle, cosine, frac } = angleByCosines(a, b, c);
          const answer = rounded(angle, acosD(t4(cosine)));
          if (!answer || angle < 15) continue;
          const [L0, L1, L2] = pickLetters(rng);
          const doubled = (a * a + b * b - c * c) / (a * b);
          return {
            ...numberProblem({
              prompt: t(
                `In $\\triangle ${L0}${L1}${L2}$, $${L0}${L1} = ${c}$, $${L1}${L2} = ${a}$ and $${L2}${L0} = ${b}$. Find $\\theta = \\angle ${L2}$. ${toTenthDegree.en}`,
                `在 $\\triangle ${L0}${L1}${L2}$ 中，$${L0}${L1} = ${c}$，$${L1}${L2} = ${a}$，$${L2}${L0} = ${b}$。求 $\\theta = \\angle ${L2}$。${toTenthDegree["zh-CN"]}`,
              ),
              answer,
              form: "decimal",
              unit: "°",
              wrong: wrongs(180 - angle, Math.abs(doubled) <= 1 ? acosD(doubled) : Number.NaN, angleByCosines(a, c, b).angle),
              solution: t(
                `The side $${c}$ is opposite $\\theta$, and $${a}$ and $${b}$ form it:${steps(`\\cos \\theta = ${frac} ${eqR4(cosine)}`, `\\theta = \\cos^{-1} ${r4(cosine)} \\approx ${dec(answer)}^\\circ`)}`,
                `边 $${c}$ 是 $\\theta$ 的对边，$${a}$ 和 $${b}$ 夹成这个角：${steps(`\\cos \\theta = ${frac} ${eqR4(cosine)}`, `\\theta = \\cos^{-1} ${r4(cosine)} \\approx ${dec(answer)}^\\circ`)}`,
              ),
            }),
            figure: triFigure(
              rng,
              fromSides(c, a, b),
              { sides: [`${c}`, `${a}`, `${b}`], angles: [null, null, "θ"], letters: `${L0}${L1}${L2}` },
              `Triangle ${L0}${L1}${L2} with ${L0}${L1} = ${c}, ${L1}${L2} = ${a}, ${L2}${L0} = ${b}, and θ the angle at ${L2}.`,
              `三角形 ${L0}${L1}${L2}，${L0}${L1} = ${c}，${L1}${L2} = ${a}，${L2}${L0} = ${b}，θ 是 ${L2} 处的角。`,
            ),
          };
        }
      },
    },
    {
      id: "an-obtuse-angle-from-three-sides",
      title: t("An obtuse angle from three sides", "由三边求钝角"),
      explanation: t(
        "The largest angle of a triangle is opposite its longest side. When $c^2 > a^2 + b^2$, the numerator $a^2 + b^2 - c^2$ is negative, so $\\cos C < 0$ and $C$ is obtuse. The inverse cosine of a negative number gives the obtuse angle directly.\n\nWith $a = 5$, $b = 6$ and $c = 10$:\n\n$$\\cos C = \\frac{5^2 + 6^2 - 10^2}{2 \\cdot 5 \\cdot 6} = \\frac{-39}{60} = -0.65, \\qquad C = \\cos^{-1} (-0.65) \\approx 130.5^\\circ.$$\n\nUnlike the sine, the cosine tells acute and obtuse angles apart, so there is no second answer.",
        "三角形的最大角是最长边的对角。当 $c^2 > a^2 + b^2$ 时，分子 $a^2 + b^2 - c^2$ 为负，所以 $\\cos C < 0$，$C$ 是钝角。负数的反余弦直接给出这个钝角。\n\n$a = 5$，$b = 6$，$c = 10$ 时：\n\n$$\\cos C = \\frac{5^2 + 6^2 - 10^2}{2 \\cdot 5 \\cdot 6} = \\frac{-39}{60} = -0.65, \\qquad C = \\cos^{-1} (-0.65) \\approx 130.5^\\circ.$$\n\n与正弦不同，余弦能区分锐角和钝角，所以不会有第二个答案。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(3, 20);
          const b = rng.int(3, 20);
          const c = rng.int(5, 38);
          if (!isTriangle(a, b, c) || c * c <= a * a + b * b || thinSSS(a, b, c)) continue;
          const { angle, cosine, frac } = angleByCosines(a, b, c);
          const answer = rounded(angle, acosD(t4(cosine)));
          if (!answer || angle > 160 || angle < 95) continue;
          const [L0, L1, L2] = pickLetters(rng);
          return {
            ...numberProblem({
              prompt: t(
                `In $\\triangle ${L0}${L1}${L2}$, $${L0}${L1} = ${c}$, $${L1}${L2} = ${a}$ and $${L2}${L0} = ${b}$. Find the largest angle, $\\theta = \\angle ${L2}$. ${toTenthDegree.en}`,
                `在 $\\triangle ${L0}${L1}${L2}$ 中，$${L0}${L1} = ${c}$，$${L1}${L2} = ${a}$，$${L2}${L0} = ${b}$。求最大的角 $\\theta = \\angle ${L2}$。${toTenthDegree["zh-CN"]}`,
              ),
              answer,
              form: "decimal",
              unit: "°",
              wrong: wrongs(180 - angle, acosD(Math.abs(cosine)), angleByCosines(a, c, b).angle),
              solution: t(
                `The longest side $${c}$ is opposite $\\theta$:${steps(`\\cos \\theta = ${frac} ${eqR4(cosine)}`, `\\theta = \\cos^{-1} (${r4(cosine)}) \\approx ${dec(answer)}^\\circ`)}The cosine is negative, so $\\theta$ is obtuse.`,
                `最长边 $${c}$ 是 $\\theta$ 的对边：${steps(`\\cos \\theta = ${frac} ${eqR4(cosine)}`, `\\theta = \\cos^{-1} (${r4(cosine)}) \\approx ${dec(answer)}^\\circ`)}余弦为负，所以 $\\theta$ 是钝角。`,
              ),
            }),
            figure: triFigure(
              rng,
              fromSides(c, a, b),
              { sides: [`${c}`, `${a}`, `${b}`], angles: [null, null, "θ"], letters: `${L0}${L1}${L2}` },
              `Triangle ${L0}${L1}${L2} with ${L0}${L1} = ${c}, ${L1}${L2} = ${a}, ${L2}${L0} = ${b}, and θ the obtuse angle at ${L2}.`,
              `三角形 ${L0}${L1}${L2}，${L0}${L1} = ${c}，${L1}${L2} = ${a}，${L2}${L0} = ${b}，θ 是 ${L2} 处的钝角。`,
            ),
          };
        }
      },
    },
  ],
};

/** The Area of a General Triangle. */
export const theAreaOfAGeneralTriangle: TopicDef = {
  id: "the-area-of-a-general-triangle",
  title: t("The Area of a General Triangle", "一般三角形的面积"),
  summary: t(
    "Find the area of any triangle as half the product of two sides and the sine of the included angle, and work backward from the area.",
    "用两边之积乘夹角正弦的一半求任意三角形的面积，并由面积反求边。",
  ),
  prerequisites: ["calculating-areas-of-right-triangles-using-trigonometry", "the-law-of-cosines"],
  encompasses: [
    { topic: "calculating-areas-of-right-triangles-using-trigonometry", weight: 0.5 },
    { topic: "the-law-of-cosines", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSG.SRT.D.9"],
  knowledgePoints: [
    {
      id: "two-sides-and-an-obtuse-or-acute-included-angle",
      title: t("Two sides and the included angle", "两边及其夹角"),
      explanation: t(
        "The area of a triangle with sides $a$ and $b$ and the angle $C$ between them is\n\n$$A = \\frac{1}{2} ab \\sin C.$$\n\nThis holds for an obtuse angle as well: the height then falls outside the triangle, and it equals $a \\sin(180^\\circ - C) = a \\sin C$. With $a = 9$, $b = 7$ and $C = 130^\\circ$:\n\n$$A = \\frac{1}{2} \\cdot 9 \\cdot 7 \\sin 130^\\circ \\approx 31.5 \\cdot 0.766 \\approx 24.1.$$",
        "两边为 $a$、$b$，夹角为 $C$ 的三角形面积是\n\n$$A = \\frac{1}{2} ab \\sin C.$$\n\n夹角是钝角时同样成立：这时高落在三角形外，等于 $a \\sin(180^\\circ - C) = a \\sin C$。$a = 9$，$b = 7$，$C = 130^\\circ$ 时：\n\n$$A = \\frac{1}{2} \\cdot 9 \\cdot 7 \\sin 130^\\circ \\approx 31.5 \\cdot 0.766 \\approx 24.1.$$",
      ),
      generate(rng) {
        for (;;) {
          const C = rng.int(25, 140);
          const m = rng.int(3, 25);
          const n = rng.int(3, 25);
          if (C === 90 || m > 3 * n || n > 3 * m || thinSAS(m, C, n)) continue;
          const s = sin(C);
          const answer = rounded((m * n * s) / 2, (m * n * t4(s)) / 2);
          if (!answer) continue;
          const [L0, L1, L2] = pickLetters(rng);
          return {
            ...numberProblem({
              prompt: t(
                `In $\\triangle ${L0}${L1}${L2}$, $${L0}${L1} = ${m}$, $${L0}${L2} = ${n}$ and $\\angle ${L0} = ${deg(C)}$. Find the area of the triangle. ${toTenth.en}`,
                `在 $\\triangle ${L0}${L1}${L2}$ 中，$${L0}${L1} = ${m}$，$${L0}${L2} = ${n}$，$\\angle ${L0} = ${deg(C)}$。求这个三角形的面积。${toTenth["zh-CN"]}`,
              ),
              answer,
              form: "decimal",
              wrong: wrongs(m * n * s, Math.abs((m * n * cos(C)) / 2), (m * n) / 2),
              solution: t(
                `The angle $${deg(C)}$ lies between the sides $${m}$ and $${n}$:${steps(`A = \\frac{1}{2} \\cdot ${m} \\cdot ${n} ${sinOf(C)} \\approx ${dec(answer)}`)}`,
                `$${deg(C)}$ 角夹在边 $${m}$ 和 $${n}$ 之间：${steps(`A = \\frac{1}{2} \\cdot ${m} \\cdot ${n} ${sinOf(C)} \\approx ${dec(answer)}`)}`,
              ),
            }),
            figure: triFigure(
              rng,
              fromSAS(m, C, n),
              { sides: [`${m}`, null, `${n}`], angles: [`${C}°`, null, null], letters: `${L0}${L1}${L2}` },
              `Triangle ${L0}${L1}${L2} with ${L0}${L1} = ${m}, ${L0}${L2} = ${n} and angle ${L0} = ${C}°.`,
              `三角形 ${L0}${L1}${L2}，${L0}${L1} = ${m}，${L0}${L2} = ${n}，角 ${L0} = ${C}°。`,
            ),
          };
        }
      },
    },
    {
      id: "a-side-from-the-area",
      title: t("A side from the area", "由面积求边"),
      explanation: t(
        "When the area is known, the formula $A = \\frac{1}{2} ab \\sin C$ is an equation for a missing side. A triangle has area $30$, one side $b = 8$, and the angle between $b$ and the unknown side $a$ is $48^\\circ$:\n\n$$30 = \\frac{1}{2} \\cdot 8 \\cdot a \\sin 48^\\circ, \\qquad a = \\frac{2 \\cdot 30}{8 \\sin 48^\\circ} \\approx 10.1.$$",
        "已知面积时，公式 $A = \\frac{1}{2} ab \\sin C$ 就是关于未知边的方程。一个三角形面积为 $30$，一边 $b = 8$，$b$ 与未知边 $a$ 的夹角是 $48^\\circ$：\n\n$$30 = \\frac{1}{2} \\cdot 8 \\cdot a \\sin 48^\\circ, \\qquad a = \\frac{2 \\cdot 30}{8 \\sin 48^\\circ} \\approx 10.1.$$",
      ),
      generate(rng) {
        for (;;) {
          const C = rng.int(25, 140);
          const m = rng.int(4, 25);
          const K = rng.int(10, 200);
          if (C === 90) continue;
          const s = sin(C);
          const x = (2 * K) / (m * s);
          if (x < 3 || x > 40 || x > 3 * m || m > 3 * x || thinSAS(m, C, x)) continue;
          const answer = rounded(x, (2 * K) / (m * t4(s)));
          if (!answer) continue;
          const [L0, L1, L2] = pickLetters(rng);
          const work = steps(
            `${K} = \\frac{1}{2} \\cdot ${m} \\cdot x ${sinOf(C)}`,
            `x = \\frac{${2 * K}}{${m} ${sinOf(C)}} \\approx ${dec(answer)}`,
          );
          return {
            ...numberProblem({
              prompt: t(
                `The area of $\\triangle ${L0}${L1}${L2}$ is $${K}$, $${L0}${L1} = ${m}$ and $\\angle ${L0} = ${deg(C)}$. Find $x = ${L0}${L2}$. ${toTenth.en}`,
                `$\\triangle ${L0}${L1}${L2}$ 的面积是 $${K}$，$${L0}${L1} = ${m}$，$\\angle ${L0} = ${deg(C)}$。求 $x = ${L0}${L2}$。${toTenth["zh-CN"]}`,
              ),
              answer,
              form: "decimal",
              wrong: wrongs(K / (m * s), (2 * K) / m, Math.abs((2 * K) / (m * cos(C)))),
              solution: t(
                `The angle $${deg(C)}$ lies between $${L0}${L1}$ and $${L0}${L2}$, so${work}`,
                `$${deg(C)}$ 角夹在 $${L0}${L1}$ 和 $${L0}${L2}$ 之间，所以${work}`,
              ),
            }),
            figure: triFigure(
              rng,
              fromSAS(m, C, x),
              { sides: [`${m}`, null, "x"], angles: [`${C}°`, null, null], letters: `${L0}${L1}${L2}` },
              `Triangle ${L0}${L1}${L2} with area ${K}, ${L0}${L1} = ${m}, angle ${L0} = ${C}° and ${L0}${L2} = x.`,
              `三角形 ${L0}${L1}${L2}，面积为 ${K}，${L0}${L1} = ${m}，角 ${L0} = ${C}°，${L0}${L2} = x。`,
            ),
          };
        }
      },
    },
    {
      id: "area-from-three-sides",
      title: t("Area from three sides", "由三边求面积"),
      explanation: t(
        "When only the three sides are known, find one angle with the law of cosines, then use $A = \\frac{1}{2} ab \\sin C$ with the two sides that form it.\n\nFor sides $7$, $9$ and $12$, take the angle $C$ between $7$ and $9$:\n\n$$\\cos C = \\frac{7^2 + 9^2 - 12^2}{2 \\cdot 7 \\cdot 9} = \\frac{-14}{126} \\approx -0.1111, \\qquad C \\approx 96.4^\\circ,$$\n\n$$A = \\frac{1}{2} \\cdot 7 \\cdot 9 \\sin 96.4^\\circ \\approx 31.3.$$",
        "只知道三条边时，先用余弦定理求一个角，再用夹成这个角的两边代入 $A = \\frac{1}{2} ab \\sin C$。\n\n三边为 $7$、$9$、$12$，取 $7$ 与 $9$ 的夹角 $C$：\n\n$$\\cos C = \\frac{7^2 + 9^2 - 12^2}{2 \\cdot 7 \\cdot 9} = \\frac{-14}{126} \\approx -0.1111, \\qquad C \\approx 96.4^\\circ,$$\n\n$$A = \\frac{1}{2} \\cdot 7 \\cdot 9 \\sin 96.4^\\circ \\approx 31.3.$$",
      ),
      keyPrerequisites: ["the-law-of-cosines"],
      generate(rng) {
        for (;;) {
          const p = rng.int(4, 25);
          const q = rng.int(4, 25);
          const r = rng.int(4, 25);
          if (!isTriangle(p, q, r) || thinSSS(p, q, r)) continue;
          // The angle at vertex 0 lies between p (side 01) and q (side 20), opposite r (side 12).
          const { angle, cosine, frac } = angleByCosines(p, q, r);
          const s = (p + q + r) / 2;
          const exact = Math.sqrt(s * (s - p) * (s - q) * (s - r));
          const angleQ = rounded(angle, acosD(t4(cosine)));
          if (!angleQ) continue;
          const answer = rounded(exact, (p * q * t4(sin(angleQ.toNumber()))) / 2);
          if (!answer || exact < 4) continue;
          const [L0, L1, L2] = pickLetters(rng);
          const work = steps(
            `\\cos ${L0} = ${frac} ${eqR4(cosine)}`,
            `\\angle ${L0} \\approx ${dec(angleQ)}^\\circ`,
            `A = \\frac{1}{2} \\cdot ${p} \\cdot ${q} \\sin ${dec(angleQ)}^\\circ \\approx ${dec(answer)}`,
          );
          return {
            ...numberProblem({
              prompt: t(
                `In $\\triangle ${L0}${L1}${L2}$, $${L0}${L1} = ${p}$, $${L1}${L2} = ${r}$ and $${L2}${L0} = ${q}$. Find the area of the triangle. ${toTenth.en}`,
                `在 $\\triangle ${L0}${L1}${L2}$ 中，$${L0}${L1} = ${p}$，$${L1}${L2} = ${r}$，$${L2}${L0} = ${q}$。求这个三角形的面积。${toTenth["zh-CN"]}`,
              ),
              answer,
              form: "decimal",
              wrong: wrongs((p * q) / 2, p * q * sin(angle), Math.abs((p * q * cosine) / 2)),
              solution: t(
                `Find the angle at $${L0}$, between the sides $${p}$ and $${q}$, with the law of cosines, then use it in the area formula:${work}`,
                `先用余弦定理求边 $${p}$ 与 $${q}$ 的夹角 $\\angle ${L0}$，再代入面积公式：${work}`,
              ),
            }),
            figure: triFigure(
              rng,
              fromSides(p, r, q),
              { sides: [`${p}`, `${r}`, `${q}`], angles: [null, null, null], letters: `${L0}${L1}${L2}` },
              `Triangle ${L0}${L1}${L2} with ${L0}${L1} = ${p}, ${L1}${L2} = ${r} and ${L2}${L0} = ${q}.`,
              `三角形 ${L0}${L1}${L2}，${L0}${L1} = ${p}，${L1}${L2} = ${r}，${L2}${L0} = ${q}。`,
            ),
          };
        }
      },
    },
  ],
};

/** SightContext is a situation in which a target is sighted from two points a known distance apart. */
interface SightContext {
  readonly points: Text;
  readonly target: Text;
  readonly the: Text;
  readonly letter: string;
}

const sightContexts: readonly SightContext[] = [
  { points: t("Two ranger stations", "两个护林站"), target: t("a fire", "一处火点"), the: t("the fire", "火点"), letter: "F" },
  {
    points: t("Two lifeguard towers on a straight beach", "笔直海滩上的两座救生塔"),
    target: t("a swimmer", "一名游泳者"),
    the: t("the swimmer", "游泳者"),
    letter: "S",
  },
  {
    points: t("Two surveyors on one bank of a river", "河一岸的两名测量员"),
    target: t("a tree on the other bank", "对岸的一棵树"),
    the: t("the tree", "树"),
    letter: "T",
  },
  {
    points: t("Two lookouts on a straight shore", "笔直海岸上的两个瞭望点"),
    target: t("a boat", "一条船"),
    the: t("the boat", "船"),
    letter: "B",
  },
];

const heightObjects = [
  { en: "tower", zh: "塔", max: 150 },
  { en: "building", zh: "楼房", max: 200 },
  { en: "cliff", zh: "悬崖", max: 200 },
  { en: "tree", zh: "树", max: 40 },
] as const;

/** Modeling Using the Law of Sines. */
export const modelingUsingTheLawOfSines: TopicDef = {
  id: "modeling-using-the-law-of-sines",
  title: t("Modeling Using the Law of Sines", "用正弦定理建模"),
  summary: t(
    "Find distances to a point sighted from two places, and heights from two angles of elevation, with the law of sines.",
    "用正弦定理求从两处观测到的点的距离，以及由两个仰角求高度。",
  ),
  prerequisites: ["the-law-of-sines", "modeling-with-trigonometry"],
  encompasses: [
    { topic: "the-law-of-sines", weight: 0.6 },
    { topic: "modeling-with-trigonometry", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSG.SRT.D.11"],
  knowledgePoints: [
    {
      id: "distances-from-two-points",
      title: t("Sighting from two points", "从两点观测"),
      explanation: t(
        "Two observers $A$ and $B$ a known distance apart both sight a point $C$, and each measures the angle between the line $AB$ and the line of sight. That is two angles and the included side, so find the angle at $C$ and use the law of sines.\n\nWith $AB = 200$ m, $\\angle A = 62^\\circ$ and $\\angle B = 48^\\circ$: $\\angle C = 180^\\circ - 62^\\circ - 48^\\circ = 70^\\circ$. The distance $AC$ is opposite $\\angle B$:\n\n$$AC = \\frac{200 \\sin 48^\\circ}{\\sin 70^\\circ} \\approx 158.2 \\text{ m}.$$",
        "两个观测者 $A$、$B$ 相距已知距离，都看到点 $C$，并各自测出直线 $AB$ 与视线的夹角。这是已知两角及其夹边，先求 $C$ 处的角，再用正弦定理。\n\n$AB = 200$ 米，$\\angle A = 62^\\circ$，$\\angle B = 48^\\circ$ 时：$\\angle C = 180^\\circ - 62^\\circ - 48^\\circ = 70^\\circ$。距离 $AC$ 是 $\\angle B$ 的对边：\n\n$$AC = \\frac{200 \\sin 48^\\circ}{\\sin 70^\\circ} \\approx 158.2 \\text{ 米}.$$",
      ),
      generate(rng) {
        for (;;) {
          const d = rng.int(8, 90) * 10;
          const al = rng.int(30, 80);
          const be = rng.int(30, 80);
          const ga = 180 - al - be;
          if (ga < 20 || al === be || shortBase(al, be)) continue;
          const fromA = rng.bool();
          const opp = fromA ? be : al;
          const other = fromA ? al : be;
          const answer = rounded((d * sin(opp)) / sin(ga), (d * t4(sin(opp))) / t4(sin(ga)));
          if (!answer) continue;
          const ctx = rng.pick(sightContexts);
          const T = ctx.letter;
          const from = fromA ? "A" : "B";
          const work = steps(
            `\\angle ${T} = 180^\\circ - ${deg(al)} - ${deg(be)} = ${deg(ga)}`,
            `${from}${T} = \\frac{${d} ${sinOf(opp)}}{${sinOf(ga)}} \\approx ${dec(answer)}`,
          );
          return {
            ...numberProblem({
              prompt: t(
                `${ctx.points.en}, $A$ and $B$, are $${unitM(d)}$ apart. They sight ${ctx.target.en} at point $${T}$, with $\\angle ${T}AB = ${deg(al)}$ and $\\angle ${T}BA = ${deg(be)}$. How far is ${ctx.the.en} from $${from}$? Round to the nearest tenth of a meter.`,
                `${ctx.points["zh-CN"]} $A$、$B$ 相距 $${d}$ 米，观测到${ctx.target["zh-CN"]} $${T}$，$\\angle ${T}AB = ${deg(al)}$，$\\angle ${T}BA = ${deg(be)}$。${ctx.the["zh-CN"]}离 $${from}$ 有多远？结果精确到 $0.1$ 米。`,
              ),
              answer,
              form: "decimal",
              unit: "m",
              wrong: wrongs((d * sin(other)) / sin(ga), (d * sin(ga)) / sin(opp), (d * sin(opp)) / sin(other)),
              solution: t(
                `The side $${from}${T}$ is opposite the angle at $${fromA ? "B" : "A"}$, and the known side $AB$ is opposite the angle at $${T}$:${work}So ${ctx.the.en} is about $${unitM(dec(answer))}$ from $${from}$.`,
                `边 $${from}${T}$ 是 $${fromA ? "B" : "A"}$ 处角的对边，已知边 $AB$ 是 $${T}$ 处角的对边：${work}所以${ctx.the["zh-CN"]}离 $${from}$ 约 $${dec(answer)}$ 米。`,
              ),
            }),
            figure: figure(
              triMarks(posed(fromAngles(al, be), { turn: 0, mirror: false }), {
                sides: [`${d} m`, fromA ? null : "?", fromA ? "?" : null],
                angles: [`${al}°`, `${be}°`, null],
                letters: `AB${T}`,
              }),
              `Points A and B are ${d} m apart; the lines of sight to ${T} make angles of ${al}° at A and ${be}° at B with AB.`,
              `A、B 两点相距 ${d} 米；看 ${T} 的视线与 AB 在 A 处成 ${al}°，在 B 处成 ${be}°。`,
            ),
          };
        }
      },
    },
    {
      id: "heights-from-two-angles-of-elevation",
      title: t("Heights from two angles of elevation", "由两个仰角求高度"),
      explanation: t(
        "From $A$ the angle of elevation of the top $T$ of a tower is $32^\\circ$; from $B$, $30$ m closer, it is $50^\\circ$. In $\\triangle ABT$, the angle at $B$ is $180^\\circ - 50^\\circ = 130^\\circ$, so the angle at $T$ is $180^\\circ - 32^\\circ - 130^\\circ = 18^\\circ$, the difference of the two angles of elevation. By the law of sines,\n\n$$BT = \\frac{30 \\sin 32^\\circ}{\\sin 18^\\circ} \\approx 51.45.$$\n\n$BT$ is the hypotenuse of the right triangle at the tower, so the height is $BT \\sin 50^\\circ \\approx 39.4$ m.",
        "从 $A$ 看塔顶 $T$ 的仰角是 $32^\\circ$；从离塔近 $30$ 米的 $B$ 看，仰角是 $50^\\circ$。在 $\\triangle ABT$ 中，$B$ 处的角是 $180^\\circ - 50^\\circ = 130^\\circ$，所以 $T$ 处的角是 $180^\\circ - 32^\\circ - 130^\\circ = 18^\\circ$，即两个仰角之差。由正弦定理，\n\n$$BT = \\frac{30 \\sin 32^\\circ}{\\sin 18^\\circ} \\approx 51.45.$$\n\n$BT$ 是塔旁直角三角形的斜边，所以高是 $BT \\sin 50^\\circ \\approx 39.4$ 米。",
      ),
      keyPrerequisites: ["modeling-with-trigonometry"],
      generate(rng) {
        for (;;) {
          const d = rng.int(10, 120);
          const al = rng.int(15, 50);
          const be = rng.int(al + 10, 75);
          const obj = rng.pick(heightObjects);
          const bt = (d * sin(al)) / sin(be - al);
          const h = bt * sin(be);
          if (h / Math.tan(rad(be)) < 0.3 * d || h > obj.max) continue;
          const answer = rounded(h, ((d * t4(sin(al))) / t4(sin(be - al))) * t4(sin(be)));
          if (!answer) continue;
          const at = (d * sin(be)) / sin(be - al);
          const work = steps(
            `\\angle ATB = ${deg(be)} - ${deg(al)} = ${deg(be - al)}`,
            `BT = \\frac{${d} ${sinOf(al)}}{${sinOf(be - al)}} \\approx ${dec(roundQ(bt, 2))}`,
            `h = BT ${sinOf(be)} \\approx ${dec(answer)}`,
          );
          const D = d + h / Math.tan(rad(be));
          const [A, B, F, T]: Point[] = [
            [0, 0],
            [d, 0],
            [D, 0],
            [D, h],
          ];
          return {
            ...numberProblem({
              prompt: t(
                `Points $A$ and $B$ lie on level ground in line with the base of a ${obj.en}, with $B$ between $A$ and the ${obj.en} and $AB = ${unitM(d)}$. The angle of elevation of the top of the ${obj.en} is $${deg(al)}$ from $A$ and $${deg(be)}$ from $B$. How tall is the ${obj.en}? Round to the nearest tenth of a meter.`,
                `$A$、$B$ 两点在水平地面上，与${obj.zh}底部在一条直线上，$B$ 在 $A$ 与${obj.zh}之间，$AB = ${d}$ 米。从 $A$ 看${obj.zh}顶的仰角是 $${deg(al)}$，从 $B$ 看是 $${deg(be)}$。${obj.zh}有多高？结果精确到 $0.1$ 米。`,
              ),
              answer,
              form: "decimal",
              unit: "m",
              wrong: wrongs(bt, at, bt * cos(be)),
              solution: t(
                `Let $T$ be the top. In $\\triangle ABT$, the angle at $B$ is $180^\\circ - ${deg(be)}$, so the angle at $T$ is the difference of the angles of elevation. Find $BT$ with the law of sines, then the height in the right triangle at the ${obj.en}:${work}`,
                `设顶端为 $T$。在 $\\triangle ABT$ 中，$B$ 处的角是 $180^\\circ - ${deg(be)}$，所以 $T$ 处的角是两个仰角之差。先用正弦定理求 $BT$，再在${obj.zh}旁的直角三角形中求高：${work}`,
              ),
            }),
            figure: figure(
              [
                { kind: "segment", a: A!, b: F! },
                { kind: "segment", a: F!, b: T! },
                { kind: "segment", a: A!, b: T! },
                { kind: "segment", a: B!, b: T! },
                { kind: "right", vertex: F!, from: A!, to: T! },
                { kind: "arc", vertex: A!, from: F!, to: T!, label: `${al}°`, accent: true },
                { kind: "arc", vertex: B!, from: F!, to: T!, label: `${be}°`, accent: true },
                { kind: "side", a: A!, b: B!, text: `${d} m` },
                { kind: "label", at: A!, text: "A", dir: "w", italic: true },
                { kind: "label", at: B!, text: "B", dir: "s", italic: true },
                { kind: "label", at: T!, text: "T", dir: "n", italic: true },
              ],
              `Points A and B on the ground ${d} m apart, in line with a ${obj.en} of top T; the angles of elevation of T are ${al}° from A and ${be}° from B.`,
              `地面上的 A、B 两点相距 ${d} 米，与顶端为 T 的${obj.zh}在一条直线上；从 A 看 T 的仰角是 ${al}°，从 B 看是 ${be}°。`,
            ),
          };
        }
      },
    },
  ],
};

const acrossPlaces = [
  { en: "a lake", zh: "湖" },
  { en: "a pond", zh: "池塘" },
  { en: "a marsh", zh: "沼泽" },
  { en: "a hill a tunnel will go through", zh: "要打隧道的小山" },
] as const;

const travelers = [
  { en: "Two ships leave a harbor", zh: "两艘船从港口", place: t("the harbor", "港口"), min: 10, max: 35, letter: "H" },
  {
    en: "Two cyclists leave a crossroads",
    zh: "两名骑车人从十字路口",
    place: t("the crossroads", "十字路口"),
    min: 12,
    max: 25,
    letter: "O",
  },
  { en: "Two hikers leave a campsite", zh: "两名徒步者从营地", place: t("the campsite", "营地"), min: 3, max: 6, letter: "C" },
] as const;

const plots = [
  { en: "triangular garden", zh: "三角形花园" },
  { en: "triangular plot of land", zh: "三角形地块" },
  { en: "triangular park", zh: "三角形公园" },
] as const;

/** Modeling Using the Law of Cosines. */
export const modelingUsingTheLawOfCosines: TopicDef = {
  id: "modeling-using-the-law-of-cosines",
  title: t("Modeling Using the Law of Cosines", "用余弦定理建模"),
  summary: t(
    "Find distances across obstacles and between travelers on different courses, and angles of triangular plots, with the law of cosines.",
    "用余弦定理求隔着障碍物的距离、沿不同方向行进者之间的距离，以及三角形地块的角。",
  ),
  prerequisites: ["the-law-of-cosines", "modeling-with-trigonometry"],
  encompasses: [
    { topic: "the-law-of-cosines", weight: 0.6 },
    { topic: "modeling-with-trigonometry", weight: 0.2 },
  ],
  xp: 16,
  standards: ["CCSS.HSG.SRT.D.11"],
  knowledgePoints: [
    {
      id: "distances-across-obstacles",
      title: t("Distances across an obstacle", "隔着障碍物的距离"),
      explanation: t(
        "To measure across a lake from $A$ to $B$, stand at a point $P$ from which both ends can be reached, measure $PA$, $PB$ and the angle $APB$ between them, and use the law of cosines.\n\nWith $PA = 420$ m, $PB = 350$ m and $\\angle APB = 75^\\circ$:\n\n$$AB^2 = 420^2 + 350^2 - 2 \\cdot 420 \\cdot 350 \\cos 75^\\circ \\approx 298900 - 76092.8, \\qquad AB \\approx 472.0 \\text{ m}.$$",
        "要测量湖两端 $A$、$B$ 之间的距离，可以站在能直接走到两端的点 $P$，量出 $PA$、$PB$ 以及它们的夹角 $\\angle APB$，再用余弦定理。\n\n$PA = 420$ 米，$PB = 350$ 米，$\\angle APB = 75^\\circ$ 时：\n\n$$AB^2 = 420^2 + 350^2 - 2 \\cdot 420 \\cdot 350 \\cos 75^\\circ \\approx 298900 - 76092.8, \\qquad AB \\approx 472.0 \\text{ 米}.$$",
      ),
      generate(rng) {
        for (;;) {
          const p = rng.int(5, 90) * 10;
          const q = rng.int(5, 90) * 10;
          const th = rng.int(30, 140);
          if (th === 90 || th === 60 || th === 120 || p > 3 * q || q > 3 * p || thinSAS(p, th, q)) continue;
          const { exact, approx } = sideByCosines(p, q, th);
          const answer = rounded(exact, approx);
          if (!answer) continue;
          const place = rng.pick(acrossPlaces);
          const work = steps(
            cosRuleTex("AB", p, q, th),
            `AB = \\sqrt{${p * p + q * q} - ${2 * p * q} ${cosOf(th)}} \\approx ${dec(answer)}`,
          );
          return {
            ...numberProblem({
              prompt: t(
                `To find the distance $AB$ across ${place.en}, a surveyor stands at a point $P$ with $PA = ${unitM(p)}$, $PB = ${unitM(q)}$ and $\\angle APB = ${deg(th)}$. Find $AB$, to the nearest tenth of a meter.`,
                `为了求${place.zh}两端的距离 $AB$，测量员站在点 $P$，$PA = ${p}$ 米，$PB = ${q}$ 米，$\\angle APB = ${deg(th)}$。求 $AB$，结果精确到 $0.1$ 米。`,
              ),
              answer,
              form: "decimal",
              unit: "m",
              wrong: sideWrongs(p, q, th),
              solution: t(
                `$AB$ is opposite the angle $${deg(th)}$ between $PA$ and $PB$. By the law of cosines,${work}`,
                `$AB$ 是 $PA$ 与 $PB$ 的夹角 $${deg(th)}$ 的对边。由余弦定理，${work}`,
              ),
            }),
            figure: triFigure(
              rng,
              fromSAS(p, th, q),
              { sides: [`${p} m`, "?", `${q} m`], angles: [`${th}°`, null, null], letters: "PAB" },
              `Triangle PAB with PA = ${p} m, PB = ${q} m and angle APB = ${th}°; AB runs across ${place.en}.`,
              `三角形 PAB，PA = ${p} 米，PB = ${q} 米，角 APB = ${th}°；AB 横跨${place.zh}。`,
            ),
          };
        }
      },
    },
    {
      id: "diverging-paths",
      title: t("Travelers on different courses", "沿不同方向行进"),
      explanation: t(
        "Two ships leave a harbor at the same time, one at $18$ km/h and one at $24$ km/h, on straight courses that make an angle of $65^\\circ$. After $2$ hours they have gone $36$ km and $48$ km, the two sides that form the $65^\\circ$ angle at the harbor. The distance between them is the third side:\n\n$$x^2 = 36^2 + 48^2 - 2 \\cdot 36 \\cdot 48 \\cos 65^\\circ \\approx 3600 - 1460.6, \\qquad x \\approx 46.3 \\text{ km}.$$",
        "两艘船同时从港口出发，速度分别是每小时 $18$ 千米和 $24$ 千米，沿夹角为 $65^\\circ$ 的直线航行。$2$ 小时后它们分别行驶了 $36$ 千米和 $48$ 千米，这就是在港口处夹成 $65^\\circ$ 角的两边。它们之间的距离是第三边：\n\n$$x^2 = 36^2 + 48^2 - 2 \\cdot 36 \\cdot 48 \\cos 65^\\circ \\approx 3600 - 1460.6, \\qquad x \\approx 46.3 \\text{ 千米}.$$",
      ),
      generate(rng) {
        for (;;) {
          const who = rng.pick(travelers);
          const u = rng.int(who.min, who.max);
          const v = rng.int(who.min, who.max);
          const time = rng.int(1, 4);
          const th = rng.int(20, 140);
          if (u === v || th === 90 || th === 60 || th === 120) continue;
          const [p, q] = [u * time, v * time];
          if (thinSAS(p, th, q)) continue;
          const { exact, approx } = sideByCosines(p, q, th);
          const answer = rounded(exact, approx);
          if (!answer) continue;
          const hours = time === 1 ? t("1 hour", "1 小时") : t(`${time} hours`, `${time} 小时`);
          const work = steps(cosRuleTex("x", p, q, th), `x = \\sqrt{${p * p + q * q} - ${2 * p * q} ${cosOf(th)}} \\approx ${dec(answer)}`);
          return {
            ...numberProblem({
              prompt: t(
                `${who.en} at the same time, one at $${u}$ km/h and the other at $${v}$ km/h, on straight courses that make an angle of $${deg(th)}$. How far apart are they after ${hours.en}? Round to the nearest tenth of a kilometer.`,
                `${who.zh}同时出发，速度分别是每小时 $${u}$ 千米和 $${v}$ 千米，沿夹角为 $${deg(th)}$ 的直线行进。${hours["zh-CN"]}后它们相距多远？结果精确到 $0.1$ 千米。`,
              ),
              answer,
              form: "decimal",
              unit: "km",
              wrong: [...sideWrongs(p, q, th), ...wrongs(sideByCosines(u, v, th).exact)],
              solution: t(
                `After ${hours.en} they are $${u} \\cdot ${time} = ${unitKm(p)}$ and $${v} \\cdot ${time} = ${unitKm(q)}$ from ${who.place.en}, and these sides form the $${deg(th)}$ angle there:${work}`,
                `${hours["zh-CN"]}后它们离${who.place["zh-CN"]}分别是 $${u} \\cdot ${time} = ${p}$ 千米和 $${v} \\cdot ${time} = ${q}$ 千米，这两边在那里夹成 $${deg(th)}$ 角：${work}`,
              ),
            }),
            figure: triFigure(
              rng,
              fromSAS(p, th, q),
              { sides: [null, "x", null], angles: [`${th}°`, null, null], letters: `${who.letter}MN` },
              `Two straight courses from ${who.letter} make an angle of ${th}°; x is the distance between the travelers M and N.`,
              `从 ${who.letter} 出发的两条直线路线夹角为 ${th}°；x 是行进者 M 与 N 之间的距离。`,
            ),
          };
        }
      },
    },
    {
      id: "angles-of-a-triangular-plot",
      title: t("Angles of a triangular plot", "三角形地块的角"),
      explanation: t(
        "When all three sides of a real triangle are measured, the law of cosines gives its angles. A triangular garden has sides $40$ m, $55$ m and $70$ m. The angle between the $40$ m and $55$ m sides is opposite the $70$ m side:\n\n$$\\cos \\theta = \\frac{40^2 + 55^2 - 70^2}{2 \\cdot 40 \\cdot 55} = \\frac{-275}{4400} = -0.0625, \\qquad \\theta \\approx 93.6^\\circ.$$",
        "实际三角形的三边都量出来后，余弦定理就能给出它的角。一个三角形花园的三边是 $40$ 米、$55$ 米和 $70$ 米。$40$ 米边与 $55$ 米边的夹角是 $70$ 米边的对角：\n\n$$\\cos \\theta = \\frac{40^2 + 55^2 - 70^2}{2 \\cdot 40 \\cdot 55} = \\frac{-275}{4400} = -0.0625, \\qquad \\theta \\approx 93.6^\\circ.$$",
      ),
      generate(rng) {
        for (;;) {
          const p = rng.int(5, 40);
          const q = rng.int(5, 40);
          const r = rng.int(5, 40);
          if (!isTriangle(p, q, r) || p === q || q === r || r === p || thinSSS(p, q, r)) continue;
          const { angle, cosine, frac } = angleByCosines(p, q, r);
          const answer = rounded(angle, acosD(t4(cosine)));
          if (!answer || angle < 20 || angle > 150) continue;
          const plot = rng.pick(plots);
          return {
            ...numberProblem({
              prompt: t(
                `A ${plot.en} has sides of $${unitM(p)}$, $${unitM(q)}$ and $${unitM(r)}$. Find the angle between the $${unitM(p)}$ and $${unitM(q)}$ sides. ${toTenthDegree.en}`,
                `一个${plot.zh}的三边分别是 $${p}$ 米、$${q}$ 米和 $${r}$ 米。求 $${p}$ 米边与 $${q}$ 米边的夹角。${toTenthDegree["zh-CN"]}`,
              ),
              answer,
              form: "decimal",
              unit: "°",
              wrong: wrongs(180 - angle, angleByCosines(p, r, q).angle, angleByCosines(q, r, p).angle),
              solution: t(
                `The angle between the $${p}$ m and $${q}$ m sides is opposite the $${r}$ m side:${steps(`\\cos \\theta = ${frac} ${eqR4(cosine)}`, `\\theta = \\cos^{-1} ${cosine < 0 ? `(${r4(cosine)})` : r4(cosine)} \\approx ${dec(answer)}^\\circ`)}`,
                `$${p}$ 米边与 $${q}$ 米边的夹角是 $${r}$ 米边的对角：${steps(`\\cos \\theta = ${frac} ${eqR4(cosine)}`, `\\theta = \\cos^{-1} ${cosine < 0 ? `(${r4(cosine)})` : r4(cosine)} \\approx ${dec(answer)}^\\circ`)}`,
              ),
            }),
          };
        }
      },
    },
  ],
};

/** algebraIIGeneralTrianglesTopics are the topics of trigonometry with general triangles, in outline order. */
export const algebraIIGeneralTrianglesTopics: readonly TopicDef[] = [
  theLawOfSines,
  theLawOfCosines,
  theAreaOfAGeneralTriangle,
  modelingUsingTheLawOfSines,
  modelingUsingTheLawOfCosines,
];
