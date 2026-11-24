import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type Mark, type PlaneMark, type PlaneView, type Point, plane, Q, radical, sketch } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";

import { article, pointLatex } from "../problems.ts";
import { type Pair, type Walk, type Wrong, walkThrough } from "./early-grades-more-kit.ts";
import {
  arc,
  boxMarks,
  coneMarks,
  cylinderMarks,
  fitBox,
  inPi,
  pickUnit,
  piProblem,
  piTex,
  pyramidMarks,
  type Unit,
} from "./geometry-solids.ts";
import { pickPose, pickTriple, posed, rightMarks, rightTri, rootOf } from "./geometry-triangles-trigonometry.ts";
import { chosen, decided, drawn, lesson, type Off, type Said, valued, withIntro } from "./grade-6-kit.ts";
import { rooted } from "./grade-8-kit.ts";

// 8th Grade Math, Unit 8: the converse and a proof of the Pythagorean theorem, its uses in the plane and in space, and real-world
// problems with volumes of cylinders, cones and spheres.

/** ccss is a helper for writing Common Core codes. */
const ccss = (...codes: string[]) => codes.map((c) => `CCSS.${c}`);

/** topic builds a TopicDef with the common fields filled in. */
function topic(
  id: string,
  title: Text,
  summary: Text,
  prerequisites: string[],
  standards: string[],
  knowledgePoints: KnowledgePointDef[],
): TopicDef {
  return { id, title, summary, prerequisites, encompasses: [], xp: 10, standards: ccss(...standards), knowledgePoints };
}

/** fig builds a figure from sketch marks. */
const fig = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

const view: PlaneView = { xMin: -8, xMax: 8, yMin: -8, yMax: 8, labelEvery: 2 };

/** graph draws marks in the coordinate plane as a figure. */
const graph = (marks: readonly PlaneMark[], en: string, zh: string): Figure => ({ svg: plane(view, marks), alt: t(en, zh) });

/** rootTex writes √n in simplest radical form. */
const rootTex = (n: number) => {
  const [k, m] = rootOf(n);
  return radical(k, m);
};

/** rootLine writes v = √n, simplified when it can be. */
function rootLine(v: string, n: number): string {
  const [k, m] = rootOf(n);
  if (m === 1) return `${v} = \\sqrt{${n}} = ${k}`;
  if (k === 1) return `${v} = \\sqrt{${n}}`;
  return `${v} = \\sqrt{${n}} = \\sqrt{${k * k} \\cdot ${m}} = ${radical(k, m)}`;
}

/** tenth rounds a number to the nearest tenth. */
const tenth = (x: number) => Q.of(Math.round(x * 10), 10);

/** isSquare tells whether n is a perfect square. */
const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));

/** rootValue is √n exactly when n is a perfect square, else rounded to the nearest tenth. */
const rootValue = (n: number) => (isSquare(n) ? Q.of(Math.sqrt(n)) : tenth(Math.sqrt(n)));

/** rootResult writes v = √n, then its exact value or its value to the nearest tenth. */
const rootResult = (v: string, n: number) =>
  isSquare(n) ? `${v} = \\sqrt{${n}} = ${Math.sqrt(n)}` : `${v} = \\sqrt{${n}} \\approx ${dec(tenth(Math.sqrt(n)))}`;

/** paren wraps a negative number in parentheses: "(-3)". */
const paren = (n: number) => (n < 0 ? `(${n})` : `${n}`);

const zhUnits: Record<string, string> = { cm: "厘米", m: "米", in: "英寸", ft: "英尺", km: "千米", mm: "毫米" };

/** roundTenth is the instruction to round to the nearest tenth. */
const roundTenth = t(" Round to the nearest tenth.", "结果保留一位小数。");

// ---------------------------------------------------------------------------
// The converse of the Pythagorean theorem

/** Len is a side length written in LaTeX, with its exact square. */
interface Len {
  readonly tex: string;
  readonly sq: Q;
}

const whole = (n: number): Len => ({ tex: `${n}`, sq: Q.of(n * n) });

/** part is the length n/d, written as a decimal. */
const part = (n: number, d: number): Len => {
  const v = Q.of(n, d);
  return { tex: dec(v), sq: v.mul(v) };
};

/** root is the length √m, in simplest radical form. */
const root = (m: number): Len => {
  const [k, r] = rootOf(m);
  return r === 1 ? whole(k) : { tex: radical(k, r), sq: Q.of(m) };
};

/** squared writes the square of a length: "5^2", "(2\sqrt{3})^2". */
const squared = (l: Len) => (l.tex.includes("sqrt") ? `(${l.tex})^2` : `${l.tex}^2`);

/** qTex writes an exact square as an integer or a decimal. */
const qTex = (v: Q) => (v.isInteger() ? v.toString() : dec(v));

type LenKind = "whole" | "part" | "root";

/** nudge moves one of the numbers by ±1. */
function nudge(rng: Rng, s: number[]): number[] {
  const i = rng.int(0, s.length - 1);
  return s.map((v, j) => (j === i ? v + rng.pick([-1, 1]) : v));
}

/** sideSet picks the sides of a triangle, right or not, sorted from shortest to longest. */
function sideSet(rng: Rng, right: boolean, kinds: readonly LenKind[] = ["whole", "part", "root"]): [Len, Len, Len] {
  for (;;) {
    const kind = rng.pick(kinds);
    let sides: Len[];
    if (kind === "whole") {
      const s = pickTriple(rng, 40);
      sides = (right ? s : nudge(rng, s)).map(whole);
    } else if (kind === "part") {
      const d = rng.pick([2, 10]);
      const s = right ? pickTriple(rng, 30) : nudge(rng, pickTriple(rng, 30));
      if (s.every((v) => v % d === 0)) continue;
      sides = s.map((v) => part(v, d));
    } else {
      const a = rng.int(1, 9);
      const off = right ? 0 : rng.pick([-2, -1, 1, 2]);
      if (rng.bool()) sides = [whole(a), whole(rng.int(1, 9)), root(a * a + rng.int(1, 9) ** 2 + off)];
      else {
        const c = a + rng.int(1, 4);
        sides = [whole(a), root(c * c - a * a + off), whole(c)];
      }
      if (sides.every((s) => !s.tex.includes("sqrt"))) continue;
    }
    const [x, y, z] = [...sides].sort((p, q) => p.sq.sub(q.sq).sign()) as [Len, Len, Len];
    if (new Set([x.tex, y.tex, z.tex]).size < 3) continue;
    if (x.sq.add(y.sq).eq(z.sq) !== right) continue;
    const r = (l: Len) => Math.sqrt(l.sq.toNumber());
    if (r(x) + r(y) <= r(z) + 1e-9) continue;
    return [x, y, z];
  }
}

/** listTex writes side lengths as a list: "$3$, $4$ and $5$", "$3$、$4$、$5$". */
const listTex = (s: readonly string[]): Text => t(`$${s[0]}$, $${s[1]}$ and $${s[2]}$`, `$${s[0]}$、$${s[1]}$、$${s[2]}$`);

/** numerals name the sets of a choice. */
const numerals = ["I", "II", "III", "IV"] as const;

const triangleNames = ["ABC", "PQR", "XYZ", "DEF", "JKL", "RST"] as const;

/** setLine checks one set of whole-number or decimal sides with the converse, in one line. */
function setLine(s: readonly number[], d: number): string {
  const [a, b, c] = [...s].sort((p, q) => p - q).map((v) => Q.of(v, d)) as [Q, Q, Q];
  const w = (v: Q) => qTex(v);
  const sum = a.mul(a).add(b.mul(b));
  const rel = sum.eq(c.mul(c)) ? "=" : "\\ne";
  const rhs = rel === "=" ? `${w(c)}^2` : `${w(c.mul(c))} = ${w(c)}^2`;
  return `${w(a)}^2 + ${w(b)}^2 = ${w(a.mul(a))} + ${w(b.mul(b))} = ${w(sum)} ${rel} ${rhs}`;
}

/** isRight tells whether whole numbers are the sides of a right triangle. */
function isRight(s: readonly number[]): boolean {
  const [a, b, c] = [...s].sort((p, q) => p - q) as [number, number, number];
  return a * a + b * b === c * c;
}

/** isTriangle tells whether three different positive whole numbers are the sides of a triangle. */
function isTriangle(s: readonly number[]): boolean {
  const [a, b, c] = [...s].sort((p, q) => p - q) as [number, number, number];
  return a > 0 && a + b > c && new Set(s).size === 3;
}

/** converseList compares the square of the longest side with the sum of the squares of the other two, one line at a time. */
function converseList([x, y, z]: readonly [Len, Len, Len]): string[] {
  const sum = x.sq.add(y.sq);
  const lines = [`${squared(x)} + ${squared(y)} = ${qTex(x.sq)} + ${qTex(y.sq)} = ${qTex(sum)}`, `${squared(z)} = ${qTex(z.sq)}`];
  return sum.eq(z.sq) ? lines : [...lines, `${qTex(sum)} \\ne ${qTex(z.sq)}`];
}

/** plain writes a length for a figure as plain text: "2\\sqrt{3}" becomes "2√3". */
const plain = (tex: string) => tex.replace(/\\sqrt\{(\d+)\}/g, "√$1");

/** sidesFigure draws a triangle to scale with its sides labeled and no angle marked; sides are given longest first, then the two others. */
function sidesFigure([z, x, y]: readonly [Len, Len, Len]): Figure {
  const [c, a, b] = [z, x, y].map((l) => Math.sqrt(l.sq.toNumber())) as [number, number, number];
  const px = (c * c + a * a - b * b) / (2 * c);
  const top: Point = [px, Math.sqrt(Math.max(a * a - px * px, 0))];
  const [p, q]: [Point, Point] = [
    [0, 0],
    [c, 0],
  ];
  return fig(
    [
      { kind: "polygon", points: [p, q, top], accent: true },
      { kind: "side", a: p, b: q, text: plain(z.tex) },
      { kind: "side", a: q, b: top, text: plain(y.tex) },
      { kind: "side", a: top, b: p, text: plain(x.tex) },
    ],
    `A triangle with sides ${plain(x.tex)}, ${plain(y.tex)} and ${plain(z.tex)}; no angle is marked.`,
    `一个三边为 ${plain(x.tex)}、${plain(y.tex)}、${plain(z.tex)} 的三角形；图中没有标出任何角。`,
  );
}

const theConverseOfThePythagoreanTheorem = withIntro(
  topic(
    "the-converse-of-the-pythagorean-theorem",
    t("The Converse of the Pythagorean Theorem", "勾股定理的逆定理"),
    t(
      "Use the converse of the Pythagorean theorem to decide whether a triangle is a right triangle and where its right angle is.",
      "用勾股定理的逆定理判断三角形是否为直角三角形，并找出直角的位置。",
    ),
    ["the-pythagorean-theorem"],
    ["8.G.B.6"],
    [
      lesson(
        "is-it-a-right-triangle",
        ["Is it a right triangle?", "是直角三角形吗？"],
        [
          [
            "The **converse of the Pythagorean theorem**: if the square of the longest side of a triangle equals the sum of the squares of the other two sides, the triangle is a right triangle. If the two are not equal, it is not. When some sides are decimals or radicals, square every side first: the largest square belongs to the longest side. Sides $1.5$, $2.5$ and $2$: $1.5^2 + 2^2 = 2.25 + 4 = 6.25 = 2.5^2$, so the triangle is a right triangle.",
            "**勾股定理的逆定理**：若三角形最长边的平方等于另两边的平方和，则这个三角形是直角三角形；若两者不相等，它就不是。若有的边是小数或根式，先把每条边平方：平方最大的就是最长边。三边为 $1.5$、$2.5$、$2$：$1.5^2 + 2^2 = 2.25 + 4 = 6.25 = 2.5^2$，所以这是直角三角形。",
          ],
          [
            "Run the theorem forward: a right triangle with legs $1.5$ and $2$ has hypotenuse $\\sqrt{6.25} = 2.5$, the third side.",
            "把定理正着用：直角边为 $1.5$ 和 $2$ 的直角三角形，斜边是 $\\sqrt{6.25} = 2.5$，正是第三条边。",
          ],
          [
            "Always test the longest side. With sides $1.5$, $2.5$ and $2$, the sum $1.5^2 + 2.5^2 = 8.5$ is not $2^2$, but that proves nothing.",
            "一定要用最长边来检验。对三边 $1.5$、$2.5$、$2$，$1.5^2 + 2.5^2 = 8.5$ 不等于 $2^2$，但这说明不了任何问题。",
          ],
        ],
        (rng) => {
          const right = rng.bool();
          const sides = sideSet(rng, right);
          const [x, y, z] = sides;
          const shown = listTex(rng.shuffle(sides.map((s) => s.tex)));
          const sum = qTex(x.sq.add(y.sq));
          return decided(
            rng,
            [
              `A triangle has sides of lengths ${shown.en}. Is it a right triangle?`,
              `一个三角形的三边长为 ${shown["zh-CN"]}。它是直角三角形吗？`,
            ],
            right,
            [
              [
                ["Find the longest side", "找出最长边"],
                [
                  `Square every side: $${qTex(x.sq)}$, $${qTex(y.sq)}$ and $${qTex(z.sq)}$. The largest square belongs to $${z.tex}$.`,
                  `把每条边平方：$${qTex(x.sq)}$、$${qTex(y.sq)}$、$${qTex(z.sq)}$。最大的平方属于 $${z.tex}$。`,
                ],
              ],
              [
                ["Compare", "比较"],
                [
                  right
                    ? "The sum of the other two squares equals the largest square, so by the converse the triangle is a right triangle:"
                    : "The sum of the other two squares is not the largest square, so the triangle is not a right triangle:",
                  right
                    ? "另两边的平方和等于最大的平方，由逆定理，这是直角三角形："
                    : "另两边的平方和不等于最大的平方，所以这不是直角三角形：",
                ],
                converseList(sides),
              ],
            ],
            right
              ? [
                  `Run the theorem forward: a right triangle with legs $${x.tex}$ and $${y.tex}$ has hypotenuse $\\sqrt{${sum}}$, which is $${z.tex}$.`,
                  `把定理正着用：直角边为 $${x.tex}$ 和 $${y.tex}$ 的直角三角形，斜边是 $\\sqrt{${sum}}$，正是 $${z.tex}$。`,
                ]
              : [
                  `Run the theorem forward: a right triangle with legs $${x.tex}$ and $${y.tex}$ would have hypotenuse $\\sqrt{${sum}}$, not $${z.tex}$.`,
                  `把定理正着用：直角边为 $${x.tex}$ 和 $${y.tex}$ 的直角三角形，斜边应是 $\\sqrt{${sum}}$，而不是 $${z.tex}$。`,
                ],
            right
              ? [
                  `The squares do match: $${squared(x)} + ${squared(y)} = ${squared(z)}$.`,
                  `平方确实相符：$${squared(x)} + ${squared(y)} = ${squared(z)}$。`,
                ]
              : [
                  `The triangle looks close to right, but $${squared(x)} + ${squared(y)} = ${sum}$ while $${squared(z)} = ${qTex(z.sq)}$.`,
                  `这个三角形看上去接近直角三角形，但 $${squared(x)} + ${squared(y)} = ${sum}$，而 $${squared(z)} = ${qTex(z.sq)}$。`,
                ],
            sidesFigure([z, x, y]),
          );
        },
        drawn(gradeDrawings5["the-converse-of-the-pythagorean-theorem#is-it-a-right-triangle"]),
      ),
      lesson(
        "which-angle-is-the-right-angle",
        ["Which angle is the right angle?", "哪个角是直角？"],
        [
          [
            "When the converse shows that a triangle is a right triangle, its right angle is the angle **opposite the longest side**, the hypotenuse. In triangle $ABC$ with $AB = 5$, $BC = 13$ and $AC = 12$: $5^2 + 12^2 = 25 + 144 = 169 = 13^2$, so the triangle is a right triangle. The longest side is $BC$, and the angle opposite it is $\\angle A$.",
            "当逆定理说明一个三角形是直角三角形时，它的直角是**最长边（斜边）所对的角**。在三角形 $ABC$ 中，$AB = 5$，$BC = 13$，$AC = 12$：$5^2 + 12^2 = 25 + 144 = 169 = 13^2$，所以这是直角三角形。最长边是 $BC$，它所对的角是 $\\angle A$。",
          ],
          [
            "The two legs, $AB$ and $AC$, both end at $A$, so they meet at the right angle there.",
            "两条直角边 $AB$ 和 $AC$ 都以 $A$ 为端点，所以它们在 $A$ 处相交成直角。",
          ],
          [
            "The right angle is not at either end of the longest side. $B$ and $C$ are the ends of $BC$, so neither is the right angle.",
            "直角不在最长边的两个端点处。$B$ 和 $C$ 是 $BC$ 的端点，所以它们都不是直角。",
          ],
        ],
        (rng) => {
          const letters = rng.pick(triangleNames).split("");
          const sides = sideSet(rng, true);
          const opp = rng.int(0, 2);
          const seg = (i: number) => letters.filter((_, j) => j !== i).join("");
          const [l1, l2] = rng.shuffle([sides[0], sides[1]]) as [Len, Len];
          const others = [0, 1, 2].filter((i) => i !== opp);
          const len = (i: number) => (i === opp ? sides[2] : i === others[0] ? l1 : l2).tex;
          // The segments in the order AB, BC, AC are opposite C, A and B.
          const [s2, s0, s1] = [seg(2), seg(0), seg(1)];
          const name = letters.join("");
          const angle = (i: number): Pair => [`$\\angle ${letters[i]}$`, `$\\angle ${letters[i]}$`];
          return chosen(
            rng,
            [
              `In triangle $${name}$, $${s2} = ${len(2)}$, $${s0} = ${len(0)}$ and $${s1} = ${len(1)}$. Which angle is a right angle?`,
              `在三角形 $${name}$ 中，$${s2} = ${len(2)}$，$${s0} = ${len(0)}$，$${s1} = ${len(1)}$。哪个角是直角？`,
            ],
            angle(opp),
            others.map(
              (i): Wrong => [
                angle(i),
                `$${letters[i]}$ is an end of the longest side $${seg(opp)}$; the right angle is opposite that side.`,
                `$${letters[i]}$ 是最长边 $${seg(opp)}$ 的端点；直角是这条边所对的角。`,
              ],
            ),
            [
              [
                ["Check the converse", "用逆定理检验"],
                [`The longest side is $${seg(opp)}$. Compare squares:`, `最长边是 $${seg(opp)}$。比较平方：`],
                converseList(sides),
              ],
              [
                ["Find the right angle", "找出直角"],
                [
                  `They are equal, so the triangle is a right triangle. The right angle is opposite $${seg(opp)}$: it is $\\angle ${letters[opp]}$.`,
                  `两者相等，所以这是直角三角形。直角是 $${seg(opp)}$ 所对的角，即 $\\angle ${letters[opp]}$。`,
                ],
              ],
            ],
            [
              `The two legs, $${seg(others[0]!)}$ and $${seg(others[1]!)}$, both end at $${letters[opp]}$, so they meet at the right angle there.`,
              `两条直角边 $${seg(others[0]!)}$ 和 $${seg(others[1]!)}$ 都以 $${letters[opp]}$ 为端点，所以它们在那里相交成直角。`,
            ],
          );
        },
        drawn(gradeDrawings5["the-converse-of-the-pythagorean-theorem#which-angle-is-the-right-angle"]),
      ),
      lesson(
        "which-set-forms-a-right-triangle",
        ["Which set forms a right triangle?", "哪组数能构成直角三角形？"],
        [
          [
            "To find which set of lengths forms a right triangle, test each set with the converse, always using its longest length. Multiplying the sides of a right triangle by the same number gives another right triangle: $6$, $8$, $10$ works because $36 + 64 = 100$.",
            "要找出哪组长度能构成直角三角形，就用逆定理逐组检验，每次都用该组中最长的长度。把直角三角形的三边都乘同一个数，得到的仍是直角三角形：$6$、$8$、$10$ 可以，因为 $36 + 64 = 100$。",
          ],
          [
            "Subtract instead: $100 - 64 = 36 = 6^2$, so the shortest length fits too.",
            "换成减法：$100 - 64 = 36 = 6^2$，所以最短的长度也相符。",
          ],
          [
            "Adding the same number to each side does not keep a right triangle: for $4$, $5$, $6$, $16 + 25 = 41 \\ne 36$.",
            "把三边都加上同一个数，得到的就不再是直角三角形：对 $4$、$5$、$6$，$16 + 25 = 41 \\ne 36$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const d = rng.pick([1, 1, 1, 2, 10]);
            const s = pickTriple(rng, d === 1 ? 40 : 30).sort((p, q) => p - q);
            if (d > 1 && s.every((v) => v % d === 0)) continue;
            const [a, b, c] = s as [number, number, number];
            const k = rng.int(1, 3);
            const n = rng.int(3, 10);
            const pool = [
              [a + k, b + k, c + k],
              [a, b, c + 1],
              [a, b, c - 1],
              [a, b + 1, c],
              [a + 1, b, c],
              [n, n + 1, n + 2].map((v) => v * (d === 1 ? 1 : rng.int(1, 2))),
            ].filter((w) => isTriangle(w) && !isRight(w));
            const keys = new Set<string>();
            const wrong = rng.shuffle(pool).filter((w) => {
              const key = [...w].sort((p, q) => p - q).join(",");
              return !keys.has(key) && Boolean(keys.add(key));
            });
            if (wrong.length < 3) continue;
            const sets = rng.shuffle([s, ...wrong.slice(0, 3)]).map((w) => (rng.bool() ? rng.shuffle(w) : w));
            const correct = sets.findIndex((w) => isRight(w));
            const shown = sets.map((w, i) => `- ${numerals[i]}: ${listTex(w.map((x) => dec(Q.of(x, d)))).en}`);
            const shownZh = sets.map((w, i) => `- ${numerals[i]}：${listTex(w.map((x) => dec(Q.of(x, d))))["zh-CN"]}`);
            const w = (v: Q) => qTex(v);
            const fail = (set: readonly number[]): [string, string] => {
              const [p, q, r] = [...set].sort((u, v) => u - v).map((v) => Q.of(v, d)) as [Q, Q, Q];
              const total = w(p.mul(p).add(q.mul(q)));
              return [
                `$${w(p)}^2 + ${w(q)}^2 = ${total}$, but $${w(r)}^2 = ${w(r.mul(r))}$.`,
                `$${w(p)}^2 + ${w(q)}^2 = ${total}$，而 $${w(r)}^2 = ${w(r.mul(r))}$。`,
              ];
            };
            const [qa, qb, qc] = [a, b, c].map((v) => Q.of(v, d)) as [Q, Q, Q];
            return chosen(
              rng,
              [
                `Which set of side lengths forms a right triangle?\n\n${shown.join("\n")}`,
                `哪组边长能构成直角三角形？\n\n${shownZh.join("\n")}`,
              ],
              [numerals[correct]!, numerals[correct]!],
              sets.flatMap((set, i): Wrong[] => (i === correct ? [] : [[[numerals[i]!, numerals[i]!], ...fail(set)]])),
              [
                [
                  ["Test each set", "逐组检验"],
                  ["Use the converse with each set's longest length:", "用逆定理检验，每次都用该组中最长的长度："],
                  sets.map((set, i) => `\\text{${numerals[i]}: } ${setLine(set, d)}`),
                ],
                [
                  ["Pick the set", "选出那一组"],
                  [`Only set ${numerals[correct]} forms a right triangle.`, `只有第 ${numerals[correct]} 组能构成直角三角形。`],
                ],
              ],
              [
                `Subtract instead: $${w(qc)}^2 - ${w(qb)}^2 = ${w(qc.mul(qc).sub(qb.mul(qb)))}$, which is $${w(qa)}^2$, so the shortest length of set ${numerals[correct]} fits too.`,
                `换成减法：$${w(qc)}^2 - ${w(qb)}^2 = ${w(qc.mul(qc).sub(qb.mul(qb)))}$，正是 $${w(qa)}^2$，所以第 ${numerals[correct]} 组中最短的长度也相符。`,
              ],
            );
          }
        },
        drawn(gradeDrawings5["the-converse-of-the-pythagorean-theorem#which-set-forms-a-right-triangle"]),
      ),
    ],
  ),
  [
    "A carpenter checks a corner of a frame: $30$ cm along one side, $40$ cm along the other, and $50$ cm straight across. Is the corner square?",
    "一位木匠检查画框的一个角：沿一边量 $30$ 厘米，沿另一边量 $40$ 厘米，两点之间直线距离 $50$ 厘米。这个角是直角吗？",
  ],
  ["Yes: $30^2 + 40^2 = 900 + 1600 = 2500 = 50^2$.", "是：$30^2 + 40^2 = 900 + 1600 = 2500 = 50^2$。"],
  [
    "use the converse of the Pythagorean theorem to decide whether a triangle is a right triangle, find its right angle, and pick the lengths that form one.",
    "用勾股定理的逆定理判断三角形是否为直角三角形，找出它的直角，并选出能构成直角三角形的长度。",
  ],
);

// ---------------------------------------------------------------------------
// Understanding and proving the Pythagorean theorem

/** squaresFigure draws a right triangle with legs p = RU and q = RV and a square on each side, labeled inside. */
function squaresFigure(rng: Rng, p: number, q: number, labels: readonly [string, string, string], en: string, zh: string): Figure {
  const pose = pickPose(rng);
  const at = (pt: Point) => posed([pt] as const, pose)[0];
  const tri: Point[] = [
    [0, 0],
    [p, 0],
    [0, q],
  ];
  const marks: Mark[] = [];
  tri.forEach((a, i) => {
    const b = tri[(i + 1) % 3]!;
    // A counterclockwise polygon lies to the left of each edge, so the outward square is on its right.
    const n: Point = [b[1] - a[1], a[0] - b[0]];
    const square: Point[] = [a, b, [b[0] + n[0], b[1] + n[1]], [a[0] + n[0], a[1] + n[1]]];
    const center: Point = [(a[0] + b[0]) / 2 + n[0] / 2, (a[1] + b[1]) / 2 + n[1] / 2];
    marks.push({ kind: "polygon", points: square.map(at) }, { kind: "label", at: at(center), text: labels[i]!, dir: "n" });
  });
  const [r, u, v] = tri.map(at) as [Point, Point, Point];
  marks.push({ kind: "polygon", points: [r, u, v], accent: true }, { kind: "right", vertex: r, from: u, to: v });
  return fig(marks, en, zh);
}

/** frameFigure draws a square of side a + b with four copies of a right triangle with legs a and b in its corners. */
function frameFigure(a: number, b: number, labeled: boolean): Figure {
  const s = a + b;
  const marks: Mark[] = [
    {
      kind: "polygon",
      points: [
        [0, 0],
        [s, 0],
        [s, s],
        [0, s],
      ],
    },
    {
      kind: "polygon",
      points: [
        [a, 0],
        [s, a],
        [b, s],
        [0, b],
      ],
      accent: true,
    },
    { kind: "right", vertex: [0, 0], from: [a, 0], to: [0, b] },
    { kind: "right", vertex: [s, 0], from: [s, a], to: [a, 0] },
    { kind: "right", vertex: [s, s], from: [b, s], to: [s, a] },
    { kind: "right", vertex: [0, s], from: [0, b], to: [b, s] },
  ];
  if (labeled)
    marks.push(
      { kind: "side", a: [0, 0], b: [a, 0], text: `${a}` },
      { kind: "side", a: [a, 0], b: [s, 0], text: `${b}` },
      { kind: "side", a: [s, 0], b: [s, a], text: `${a}` },
      { kind: "side", a: [s, a], b: [s, s], text: `${b}` },
    );
  return fig(
    marks,
    `A square made of four right triangles${labeled ? ` with legs ${a} and ${b}` : ""} in its corners and a tilted square in the middle.`,
    `一个正方形，四个角上是四个直角三角形${labeled ? `（直角边为 ${a} 和 ${b}）` : ""}，中间是一个倾斜的正方形。`,
  );
}

/** pinwheelFigure draws a square cut into four copies of a right triangle with legs a < b and a small square of side b − a. */
function pinwheelFigure(a: number, b: number): Figure {
  const o: Point = [(b - a) / 2, (a + b) / 2];
  const turn = (p: Point, k: number): Point => {
    let [x, y] = [p[0] - o[0], p[1] - o[1]];
    for (let i = 0; i < k; i++) [x, y] = [-y, x];
    return [o[0] + x, o[1] + y];
  };
  const corners = [0, 1, 2, 3].map((k) => turn([0, 0], k));
  const rights = [0, 1, 2, 3].map((k) => turn([0, a], k));
  const marks: Mark[] = [{ kind: "polygon", points: corners }];
  for (let k = 0; k < 4; k++) {
    const [p, q, r] = [corners[k]!, corners[(k + 1) % 4]!, rights[k]!];
    marks.push({ kind: "polygon", points: [p, q, r] }, { kind: "right", vertex: r, from: p, to: q });
  }
  marks.push(
    { kind: "polygon", points: rights, accent: true },
    { kind: "side", a: corners[0]!, b: rights[0]!, text: `${a}` },
    { kind: "side", a: rights[0]!, b: corners[1]!, text: `${b}` },
  );
  return fig(
    marks,
    `A large square cut into four right triangles with legs ${a} and ${b} and a small square in the middle.`,
    `一个大正方形被分成四个直角边为 ${a} 和 ${b} 的直角三角形和中间的一个小正方形。`,
  );
}

const understandingAndProvingThePythagoreanTheorem = withIntro(
  topic(
    "understanding-and-proving-the-pythagorean-theorem",
    t("Understanding and Proving the Pythagorean Theorem", "理解并证明勾股定理"),
    t(
      "See the Pythagorean theorem as a statement about the areas of squares on the sides, and prove it by cutting and rearranging squares.",
      "把勾股定理看作关于三边上正方形面积的结论，并通过分割、拼接正方形来证明它。",
    ),
    ["the-pythagorean-theorem"],
    ["8.G.B.6"],
    [
      lesson(
        "squares-on-the-sides",
        ["Squares on the sides", "三边上的正方形"],
        [
          [
            "Draw a square on each side of a right triangle. The square on a side of length $a$ has area $a^2$, so the Pythagorean theorem says: **the area of the square on the hypotenuse equals the sum of the areas of the squares on the legs.** If the squares on the legs have areas $9$ and $16$, the square on the hypotenuse has area $9 + 16 = 25$, and the hypotenuse is $\\sqrt{25} = 5$ long.",
            "在直角三角形的每条边上各画一个正方形。边长为 $a$ 的边上的正方形面积是 $a^2$，所以勾股定理说的是：**斜边上的正方形面积等于两条直角边上的正方形面积之和。**若两条直角边上的正方形面积为 $9$ 和 $16$，则斜边上的正方形面积为 $9 + 16 = 25$，斜边长为 $\\sqrt{25} = 5$。",
          ],
          [
            "The legs are $\\sqrt{9} = 3$ and $\\sqrt{16} = 4$, and $3^2 + 4^2 = 5^2$.",
            "两条直角边是 $\\sqrt{9} = 3$ 和 $\\sqrt{16} = 4$，而 $3^2 + 4^2 = 5^2$。",
          ],
          [
            "The hypotenuse is not $9 + 16 = 25$ long: that is the area of its square. Its length is the square root, $5$.",
            "斜边长不是 $9 + 16 = 25$：那是它上面正方形的面积。斜边长是平方根 $5$。",
          ],
        ],
        (rng) => {
          const ask = rng.pick(["hyp", "hyp", "leg", "side"] as const);
          if (ask === "side") {
            const [a, b, c] = pickTriple(rng, 20);
            return valued(
              [
                "Squares are drawn on the two legs of a right triangle, and their areas are shown. How long is the hypotenuse of the triangle?",
                "在直角三角形的两条直角边上各画一个正方形，图中标出了它们的面积。三角形的斜边有多长？",
              ],
              c,
              [
                [
                  ["Add the areas", "把面积相加"],
                  ["The square on the hypotenuse has the sum of the two areas:", "斜边上的正方形面积是两个面积之和："],
                  [`${a * a} + ${b * b} = ${c * c}`],
                ],
                [
                  ["Take the square root", "开平方"],
                  ["The hypotenuse is the side of that square:", "斜边就是这个正方形的边长："],
                  [`\\sqrt{${c * c}} = ${c}`],
                ],
              ],
              [`Square it back: $${c}^2 = ${c * c}$, the sum of the two areas.`, `平方回去：$${c}^2 = ${c * c}$，正是两个面积之和。`],
              [
                [
                  c * c,
                  "That is the area of the square on the hypotenuse; its side is the square root.",
                  "这是斜边上正方形的面积；斜边长是它的平方根。",
                ],
                [
                  a + b,
                  "That adds the legs; add the areas of the squares, then take the square root.",
                  "这是把两条直角边相加了；应先把正方形面积相加，再开平方。",
                ],
              ],
              {
                figure: squaresFigure(
                  rng,
                  a,
                  b,
                  [`${a * a}`, "", `${b * b}`],
                  `A right triangle with squares on its sides; the squares on the legs have areas ${a * a} and ${b * b}.`,
                  `一个三边上画有正方形的直角三角形，两条直角边上的正方形面积为 ${a * a} 和 ${b * b}。`,
                ),
              },
            );
          }
          for (;;) {
            const [p, q] = [rng.int(4, 80), rng.int(4, 80)];
            if (p === q || Math.max(p, q) > 3 * Math.min(p, q)) continue;
            const hyp = ask === "hyp";
            const labels: [string, string, string] = hyp ? [`${p}`, "A", `${q}`] : [`${p}`, `${p + q}`, "A"];
            const figure = squaresFigure(
              rng,
              Math.sqrt(p),
              Math.sqrt(q),
              labels,
              `A right triangle with a square on each side, labeled with areas ${labels.join(", ")}.`,
              `一个每条边上都画有正方形的直角三角形，正方形的面积分别标为 ${labels.join("、")}。`,
            );
            const prompt: Pair = [
              "Squares are drawn on the sides of a right triangle. Two of their areas are shown. Find the area $A$ of the third square.",
              "在直角三角形的三条边上各画一个正方形，图中标出了其中两个的面积。求第三个正方形的面积 $A$。",
            ];
            if (hyp)
              return valued(
                prompt,
                p + q,
                [
                  [
                    ["Name the squares", "认清各个正方形"],
                    [`$A$ is on the hypotenuse; $${p}$ and $${q}$ are on the legs.`, `$A$ 在斜边上；$${p}$ 和 $${q}$ 在直角边上。`],
                  ],
                  [
                    ["Add", "相加"],
                    [
                      "The square on the hypotenuse is the sum of the squares on the legs:",
                      "斜边上的正方形面积等于两条直角边上的正方形面积之和：",
                    ],
                    [`A = ${p} + ${q} = ${p + q}`],
                  ],
                ],
                [
                  `The square on the longest side is the largest: $${p + q}$ is more than both $${p}$ and $${q}$.`,
                  `最长边上的正方形最大：$${p + q}$ 比 $${p}$ 和 $${q}$ 都大。`,
                ],
                [
                  [
                    Math.abs(p - q),
                    "That subtracts the areas; the square on the hypotenuse is their sum.",
                    "这是把面积相减了；斜边上的正方形面积是它们的和。",
                  ],
                  [
                    Math.max(p, q),
                    "That takes the larger square; the square on the hypotenuse is larger than both.",
                    "这是取了较大的正方形；斜边上的正方形比两个都大。",
                  ],
                ],
                { figure },
              );
            return valued(
              prompt,
              q,
              [
                [
                  ["Name the squares", "认清各个正方形"],
                  [
                    `$${p + q}$ is on the hypotenuse, so $${p}$ and $A$ are on the legs.`,
                    `$${p + q}$ 在斜边上，所以 $${p}$ 和 $A$ 在直角边上。`,
                  ],
                ],
                [
                  ["Subtract", "相减"],
                  [
                    "The squares on the legs add up to the square on the hypotenuse:",
                    "两条直角边上的正方形面积之和等于斜边上的正方形面积：",
                  ],
                  [`${p} + A = ${p + q}`, `A = ${p + q} - ${p} = ${q}`],
                ],
              ],
              [
                `Add the squares on the legs: $${p} + ${q} = ${p + q}$, the square on the hypotenuse.`,
                `把直角边上的正方形面积相加：$${p} + ${q} = ${p + q}$，正是斜边上的正方形面积。`,
              ],
              [
                [2 * p + q, "That adds the areas; $A$ is on a leg, so subtract.", "这是把面积相加了；$A$ 在直角边上，应该相减。"],
                [
                  p,
                  "That copies the other square on a leg; the two legs need not be equal.",
                  "这是照抄了另一条直角边上的正方形；两条直角边不一定相等。",
                ],
              ],
              { figure },
            );
          }
        },
        drawn(gradeDrawings3["understanding-and-proving-the-pythagorean-theorem#squares-on-the-sides"]),
      ),
      lesson(
        "the-rearrangement-proof",
        ["The rearrangement proof", "拼图证明"],
        [
          [
            "Place four copies of a right triangle with legs $a$ and $b$ and hypotenuse $c$ in the corners of a square of side $a + b$. The space left in the middle is a square of side $c$. So $c^2 = (a + b)^2 - 4 \\cdot \\tfrac{1}{2}ab$. With $a = 3$ and $b = 4$: the large square has area $7^2 = 49$, the four triangles have area $4 \\cdot \\tfrac{1}{2} \\cdot 3 \\cdot 4 = 24$, and the middle square has area $49 - 24 = 25$.",
            "把四个直角边为 $a$、$b$、斜边为 $c$ 的直角三角形放在边长为 $a + b$ 的正方形的四个角上，中间剩下的是一个边长为 $c$ 的正方形。所以 $c^2 = (a + b)^2 - 4 \\cdot \\tfrac{1}{2}ab$。当 $a = 3$、$b = 4$ 时：大正方形面积为 $7^2 = 49$，四个三角形面积为 $4 \\cdot \\tfrac{1}{2} \\cdot 3 \\cdot 4 = 24$，中间正方形面积为 $49 - 24 = 25$。",
          ],
          [
            "The middle square has area $25 = 3^2 + 4^2$. The same happens for any legs, which proves $a^2 + b^2 = c^2$.",
            "中间正方形的面积 $25 = 3^2 + 4^2$。对任意直角边都是如此，这就证明了 $a^2 + b^2 = c^2$。",
          ],
          [
            "Each triangle is half of an $a$ by $b$ rectangle. Taking away $4ab$ instead of $2ab$ removes twice too much.",
            "每个三角形是 $a \\times b$ 长方形的一半。减去 $4ab$ 而不是 $2ab$，就多减了一倍。",
          ],
        ],
        (rng) => {
          for (;;) {
            const a = rng.int(1, 9);
            const b = rng.int(1, 9);
            if (a === b || Math.max(a, b) > 3 * Math.min(a, b)) continue;
            const s = a + b;
            if (rng.bool(0.65))
              return valued(
                [
                  "Four copies of a right triangle are placed in the corners of a square, as shown. Find the area of the tilted square in the middle.",
                  "如图，把四个全等的直角三角形放在一个正方形的四个角上。求中间倾斜的正方形的面积。",
                ],
                a * a + b * b,
                [
                  [
                    ["Find the large square", "求大正方形"],
                    [`Its side is $${a} + ${b} = ${s}$:`, `它的边长是 $${a} + ${b} = ${s}$：`],
                    [`${s}^2 = ${s * s}`],
                  ],
                  [
                    ["Find the four triangles", "求四个三角形"],
                    ["Each triangle is half of an $a$ by $b$ rectangle:", "每个三角形是一个长方形的一半："],
                    [`4 \\cdot \\tfrac{1}{2} \\cdot ${a} \\cdot ${b} = ${2 * a * b}`],
                  ],
                  [
                    ["Subtract", "相减"],
                    ["The middle square is what is left:", "中间的正方形就是剩下的部分："],
                    [`${s * s} - ${2 * a * b} = ${a * a + b * b}`],
                  ],
                ],
                [
                  `This is the square on the hypotenuse: $${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${a * a + b * b}$.`,
                  `这正是斜边上的正方形：$${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${a * a + b * b}$。`,
                ],
                [
                  [
                    s * s - 4 * a * b,
                    "That takes away whole $a$ by $b$ rectangles; each triangle is only half of one.",
                    "这是减去了整个长方形；每个三角形只是长方形的一半。",
                  ],
                  [s * s - a * b, "That takes away only two of the four triangles.", "这是只减去了四个三角形中的两个。"],
                  [s * s, "That is the whole large square; take the four triangles away.", "这是整个大正方形的面积；要减去四个三角形。"],
                ],
                { figure: frameFigure(a, b, true) },
              );
            const [big, mid] = [s * s, a * a + b * b];
            const one = Q.of(big - mid, 4);
            return valued(
              [
                `Four copies of a right triangle are placed in the corners of a square, as shown. The large square has area $${big}$, and the tilted square in the middle has area $${mid}$. Find the area of one triangle.`,
                `如图，把四个全等的直角三角形放在一个正方形的四个角上。大正方形的面积为 $${big}$，中间倾斜的正方形面积为 $${mid}$。求一个三角形的面积。`,
              ],
              one,
              [
                [
                  ["Find the four triangles", "求四个三角形"],
                  ["They fill the large square apart from the middle square:", "它们填满了大正方形中除中间正方形以外的部分："],
                  [`${big} - ${mid} = ${big - mid}`],
                ],
                [
                  ["Find one triangle", "求一个三角形"],
                  ["The four triangles are equal:", "四个三角形全等："],
                  [`${big - mid} \\div 4 = ${dec(one)}`],
                ],
              ],
              [
                `Put the pieces back: four triangles of $${dec(one)}$ and the middle square give $4 \\times ${dec(one)} + ${mid} = ${big}$.`,
                `把各部分拼回去：四个面积为 $${dec(one)}$ 的三角形加上中间正方形，$4 \\times ${dec(one)} + ${mid} = ${big}$。`,
              ],
              [
                [big - mid, "That is all four triangles together; divide by 4.", "这是四个三角形的总面积；还要除以 4。"],
                [Q.of(big - mid, 2), "That divides by 2; there are four triangles.", "这是除以了 2；一共有四个三角形。"],
                [big + mid, "That adds the two squares instead of subtracting.", "这是把两个正方形的面积相加了，而不是相减。"],
              ],
              { figure: frameFigure(a, b, false) },
            );
          }
        },
        drawn(gradeDrawings3["understanding-and-proving-the-pythagorean-theorem#the-rearrangement-proof"]),
      ),
      lesson(
        "the-inner-square-proof",
        ["The inner-square proof", "弦图证明"],
        [
          [
            "A square of side $c$ can be cut into four copies of a right triangle with legs $a < b$ and hypotenuse $c$, plus a small square in the middle. The side of the small square is the difference of the legs, $b - a$. Adding the pieces gives $c^2 = 4 \\cdot \\tfrac{1}{2}ab + (b - a)^2$. With legs $3$ and $5$: the small square has area $2^2 = 4$, the four triangles have area $30$, and $c^2 = 30 + 4 = 34$.",
            "边长为 $c$ 的正方形可以分成四个直角边为 $a < b$、斜边为 $c$ 的全等直角三角形，以及中间的一个小正方形。小正方形的边长是两条直角边之差 $b - a$。把各部分加起来得 $c^2 = 4 \\cdot \\tfrac{1}{2}ab + (b - a)^2$。当直角边为 $3$ 和 $5$ 时：小正方形面积为 $2^2 = 4$，四个三角形面积为 $30$，所以 $c^2 = 30 + 4 = 34$。",
          ],
          ["And $3^2 + 5^2 = 9 + 25 = 34$ too, as the Pythagorean theorem says.", "而 $3^2 + 5^2 = 9 + 25 = 34$，正如勾股定理所说。"],
          [
            "The small square has side $b - a$, not $b + a$: each long leg is a short leg plus one side of the small square.",
            "小正方形的边长是 $b - a$，不是 $b + a$：每条长直角边等于一条短直角边加上小正方形的一条边。",
          ],
        ],
        (rng) => {
          for (;;) {
            const a = rng.int(1, 8);
            const b = rng.int(a + 1, 12);
            if (b > 4 * a || 4 * (b - a) < b || b - a < 2) continue;
            const [side, four] = [b - a, 2 * a * b];
            const intro: Pair = [
              "The large square below is made of four copies of a right triangle and a small square in the middle.",
              "下图中的大正方形由四个全等的直角三角形和中间的一个小正方形组成。",
            ];
            const figure = pinwheelFigure(a, b);
            const sideStep: Walk = [
              ["Find the small square", "求小正方形"],
              [
                "Each long leg is a short leg plus a side of the small square, so its side is:",
                "每条长直角边等于一条短直角边加上小正方形的一条边，所以它的边长是：",
              ],
              [`${b} - ${a} = ${side}`],
            ];
            if (rng.bool(0.4))
              return valued(
                [`${intro[0]} Find the area of the small square.`, `${intro[1]}求小正方形的面积。`],
                side * side,
                [
                  sideStep,
                  [["Square it", "平方"], ["Its area is the side squared:", "面积是边长的平方："], [`${side}^2 = ${side * side}`]],
                ],
                [
                  `The pieces fill the large square: $${four} + ${side * side} = ${a * a + b * b}$, which is $${a}^2 + ${b}^2$.`,
                  `各部分正好拼成大正方形：$${four} + ${side * side} = ${a * a + b * b}$，正是 $${a}^2 + ${b}^2$。`,
                ],
                [
                  [
                    b * b - a * a,
                    "That subtracts the squares of the legs; the side of the small square is $b - a$.",
                    "这是把两条直角边的平方相减了；小正方形的边长是 $b - a$。",
                  ],
                  [side, "That is the side of the small square, not its area.", "这是小正方形的边长，不是它的面积。"],
                  [
                    (a + b) ** 2,
                    "That uses $a + b$; the side of the small square is the difference of the legs.",
                    "这是用了 $a + b$；小正方形的边长是两条直角边之差。",
                  ],
                ],
                { figure },
              );
            return valued(
              [`${intro[0]} Find the area of the large square.`, `${intro[1]}求大正方形的面积。`],
              a * a + b * b,
              [
                sideStep,
                [
                  ["Find the four triangles", "求四个三角形"],
                  ["Each triangle is half of an $a$ by $b$ rectangle:", "每个三角形是一个长方形的一半："],
                  [`4 \\cdot \\tfrac{1}{2} \\cdot ${a} \\cdot ${b} = ${four}`],
                ],
                [
                  ["Add the pieces", "把各部分相加"],
                  ["The small square and the four triangles make the large square:", "小正方形和四个三角形拼成大正方形："],
                  [`${four} + ${side}^2 = ${a * a + b * b}`],
                ],
              ],
              [
                `This is the square on the hypotenuse: $${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${a * a + b * b}$.`,
                `这正是斜边上的正方形：$${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${a * a + b * b}$。`,
              ],
              [
                [
                  2 * four + side * side,
                  "That counts each triangle as a whole $a$ by $b$ rectangle; a triangle is half of one.",
                  "这是把每个三角形当成了整个长方形；三角形只是长方形的一半。",
                ],
                [a * b + side * side, "That counts only two of the four triangles.", "这是只算了四个三角形中的两个。"],
                [
                  (a + b) ** 2,
                  "That uses a square of side $a + b$; the large square's side is the hypotenuse.",
                  "这是用了边长为 $a + b$ 的正方形；大正方形的边长是斜边。",
                ],
              ],
              { figure },
            );
          }
        },
        drawn(gradeDrawings3["understanding-and-proving-the-pythagorean-theorem#the-inner-square-proof"]),
      ),
    ],
  ),
  [
    "Two paper squares, of sides $3$ cm and $4$ cm, lie along the legs of a right triangle. Can they be cut up to cover the square on the hypotenuse exactly?",
    "两张边长为 $3$ 厘米和 $4$ 厘米的正方形纸片沿直角三角形的两条直角边放着。能把它们剪开，正好盖住斜边上的正方形吗？",
  ],
  ["Yes: $9 + 16 = 25$, and the square on the hypotenuse has area $5^2 = 25$.", "能：$9 + 16 = 25$，而斜边上的正方形面积是 $5^2 = 25$。"],
  [
    "read the theorem as a fact about squares on the sides, and prove it by arranging four copies of a right triangle in two ways.",
    "把勾股定理看作关于三边上正方形的结论，并用四个全等的直角三角形的两种摆法来证明它。",
  ],
);

// ---------------------------------------------------------------------------
// Real-world problems

/** Part is a side of a right triangle standing on the ground: the horizontal leg, the vertical leg or the hypotenuse. */
type Part = "run" | "rise" | "hyp";

/** Story is a real-world right triangle with a vertical leg. */
interface Story {
  readonly units: readonly string[];
  /** shape says whether the rise is more than the run ("steep"), less ("gentle") or either. */
  readonly shape: "steep" | "gentle" | "any";
  /** hyp names the hypotenuse in the solution. */
  readonly hyp: Text;
  /** ask writes the prompt that asks for one part, given the other two as LaTeX numbers. */
  readonly ask: (want: Part, v: Record<Part, string>, u: string, uz: string) => Text;
}

const stories: readonly Story[] = [
  {
    units: ["ft", "m"],
    shape: "steep",
    hyp: t("The ladder", "梯子"),
    ask: (want, v, u, uz) =>
      want === "rise"
        ? t(
            `${article(v.hyp, true)} $${v.hyp}$-${u} ladder leans against a wall with its foot $${v.run}$ ${u} from the wall. How high up the wall does the ladder reach?`,
            `一架长 $${v.hyp}$ ${uz}的梯子靠在墙上，梯脚离墙 $${v.run}$ ${uz}。梯子顶端离地面多高？`,
          )
        : want === "run"
          ? t(
              `${article(v.hyp, true)} $${v.hyp}$-${u} ladder leans against a wall and reaches $${v.rise}$ ${u} up the wall. How far is the foot of the ladder from the wall?`,
              `一架长 $${v.hyp}$ ${uz}的梯子靠在墙上，顶端离地面 $${v.rise}$ ${uz}。梯脚离墙多远？`,
            )
          : t(
              `A ladder leans against a wall. Its foot is $${v.run}$ ${u} from the wall, and its top is $${v.rise}$ ${u} up the wall. How long is the ladder?`,
              `一架梯子靠在墙上，梯脚离墙 $${v.run}$ ${uz}，顶端离地面 $${v.rise}$ ${uz}。梯子有多长？`,
            ),
  },
  {
    units: ["m", "ft"],
    shape: "any",
    hyp: t("The wire", "拉线"),
    ask: (want, v, u, uz) =>
      want === "hyp"
        ? t(
            `A wire runs from the top of ${article(v.rise)} $${v.rise}$-${u} pole to a stake in the ground $${v.run}$ ${u} from the foot of the pole. How long is the wire?`,
            `一根拉线从一根高 $${v.rise}$ ${uz}的电线杆顶端拉到地面上的木桩，木桩离杆脚 $${v.run}$ ${uz}。拉线有多长？`,
          )
        : want === "rise"
          ? t(
              `${article(v.hyp, true)} $${v.hyp}$-${u} wire runs from the top of a pole to a stake in the ground $${v.run}$ ${u} from the foot of the pole. How tall is the pole?`,
              `一根长 $${v.hyp}$ ${uz}的拉线从电线杆顶端拉到地面上的木桩，木桩离杆脚 $${v.run}$ ${uz}。电线杆有多高？`,
            )
          : t(
              `${article(v.hyp, true)} $${v.hyp}$-${u} wire runs from the top of ${article(v.rise)} $${v.rise}$-${u} pole to a stake in the ground. How far is the stake from the foot of the pole?`,
              `一根长 $${v.hyp}$ ${uz}的拉线从一根高 $${v.rise}$ ${uz}的电线杆顶端拉到地面上的木桩。木桩离杆脚多远？`,
            ),
  },
  {
    units: ["m", "ft"],
    shape: "any",
    hyp: t("The kite string", "风筝线"),
    ask: (want, v, u, uz) =>
      want === "rise"
        ? t(
            `A kite string $${v.hyp}$ ${u} long is held at ground level and pulled straight. The kite is directly above a point $${v.run}$ ${u} from where the string is held. How high is the kite?`,
            `一根长 $${v.hyp}$ ${uz}的风筝线在地面上被拉直。风筝正下方的点离线的固定点 $${v.run}$ ${uz}。风筝有多高？`,
          )
        : want === "run"
          ? t(
              `A kite flies $${v.rise}$ ${u} above the ground on a straight string $${v.hyp}$ ${u} long, held at ground level. How far is the point directly below the kite from where the string is held?`,
              `一只风筝在离地面 $${v.rise}$ ${uz}的高处，长 $${v.hyp}$ ${uz}的风筝线被拉直并在地面上固定。风筝正下方的点离线的固定点多远？`,
            )
          : t(
              `A kite flies $${v.rise}$ ${u} above the ground, directly above a point $${v.run}$ ${u} from where its string is held at ground level. The string is straight. How long is it?`,
              `一只风筝在离地面 $${v.rise}$ ${uz}的高处，它正下方的点离地面上风筝线的固定点 $${v.run}$ ${uz}。风筝线是直的，它有多长？`,
            ),
  },
  {
    units: ["ft", "m"],
    shape: "gentle",
    hyp: t("The ramp's surface", "坡面"),
    ask: (want, v, u, uz) =>
      want === "hyp"
        ? t(
            `A ramp rises $${v.rise}$ ${u} over a horizontal distance of $${v.run}$ ${u}. How long is the ramp's surface?`,
            `一个斜坡在 $${v.run}$ ${uz}的水平距离内升高 $${v.rise}$ ${uz}。坡面有多长？`,
          )
        : want === "rise"
          ? t(
              `A ramp's surface is $${v.hyp}$ ${u} long and covers a horizontal distance of $${v.run}$ ${u}. How high does the ramp rise?`,
              `一个斜坡的坡面长 $${v.hyp}$ ${uz}，水平距离为 $${v.run}$ ${uz}。斜坡升高了多少？`,
            )
          : t(
              `A ramp's surface is $${v.hyp}$ ${u} long, and the ramp rises $${v.rise}$ ${u}. What horizontal distance does it cover?`,
              `一个斜坡的坡面长 $${v.hyp}$ ${uz}，升高 $${v.rise}$ ${uz}。它的水平距离是多少？`,
            ),
  },
];

/** RightValues are the sides of a right triangle for a word problem: the two given ones are whole numbers. */
interface RightValues {
  readonly legs: readonly [number, number];
  readonly hyp: number;
  /** exact tells whether all three sides are whole numbers. */
  readonly exact: boolean;
}

/** pickRight picks the sides of a right triangle with the given unknown; when not exact, the unknown is rounded. */
function pickRight(rng: Rng, want: "leg0" | "leg1" | "hyp", max: number, ok: (p: number, q: number) => boolean): RightValues {
  for (;;) {
    if (rng.bool()) {
      const [p, q, c] = pickTriple(rng, max);
      if (ok(p, q) && Math.min(p, q) >= 2) return { legs: [p, q], hyp: c, exact: true };
      continue;
    }
    const lo = Math.max(2, Math.floor(max / 8));
    if (want === "hyp") {
      const [p, q] = [rng.int(lo, Math.floor((max * 2) / 3)), rng.int(lo, Math.floor((max * 2) / 3))];
      if (ok(p, q) && !isSquare(p * p + q * q)) return { legs: [p, q], hyp: Math.sqrt(p * p + q * q), exact: false };
      continue;
    }
    const c = rng.int(lo + 2, max);
    const known = rng.int(lo, c - 1);
    const other = Math.sqrt(c * c - known * known);
    const legs: [number, number] = want === "leg0" ? [other, known] : [known, other];
    if (ok(legs[0], legs[1]) && !Number.isInteger(other) && other >= 1) return { legs, hyp: c, exact: false };
  }
}

/** wordLabel writes a side for a word problem's figure: "12 ft", or "?" for the unknown. */
const wordLabel = (v: number, u: string, unknown: boolean) => (unknown ? "?" : `${v} ${u}`);

/** RectStory is a real-world rectangle with a diagonal. */
interface RectStory {
  readonly unit: string;
  readonly max: number;
  /** wide tells whether the width must be more than the height. */
  readonly wide: boolean;
  readonly ask: (want: "w" | "h" | "d", w: number, h: number, d: number) => Text;
}

const rectStories: readonly RectStory[] = [
  {
    unit: "in",
    max: 70,
    wide: true,
    ask: (want, w, h, d) =>
      want === "d"
        ? t(
            `A TV screen is $${w}$ in wide and $${h}$ in tall. A TV's size is the length of the screen's diagonal. What is this TV's size?`,
            `一台电视的屏幕宽 $${w}$ 英寸、高 $${h}$ 英寸。电视的尺寸是指屏幕对角线的长度。这台电视的尺寸是多少英寸？`,
          )
        : want === "h"
          ? t(
              `A TV screen is $${w}$ in wide, and its diagonal is $${d}$ in long. How tall is the screen?`,
              `一台电视的屏幕宽 $${w}$ 英寸，对角线长 $${d}$ 英寸。屏幕有多高？`,
            )
          : t(
              `A TV screen is $${h}$ in tall, and its diagonal is $${d}$ in long. How wide is the screen?`,
              `一台电视的屏幕高 $${h}$ 英寸，对角线长 $${d}$ 英寸。屏幕有多宽？`,
            ),
  },
  {
    unit: "m",
    max: 300,
    wide: true,
    ask: (want, w, h, d) =>
      want === "d"
        ? t(
            `A rectangular park is $${w}$ m long and $${h}$ m wide. A straight path crosses it from one corner to the opposite corner. How long is the path?`,
            `一个长方形公园长 $${w}$ 米、宽 $${h}$ 米。一条笔直的小路从公园的一个角通到对角。这条小路有多长？`,
          )
        : want === "h"
          ? t(
              `A straight path $${d}$ m long crosses a rectangular park from one corner to the opposite corner. The park is $${w}$ m long. How wide is it?`,
              `一条长 $${d}$ 米的笔直小路从长方形公园的一个角通到对角。公园长 $${w}$ 米，宽是多少米？`,
            )
          : t(
              `A straight path $${d}$ m long crosses a rectangular park from one corner to the opposite corner. The park is $${h}$ m wide. How long is it?`,
              `一条长 $${d}$ 米的笔直小路从长方形公园的一个角通到对角。公园宽 $${h}$ 米，长是多少米？`,
            ),
  },
  {
    unit: "ft",
    max: 20,
    wide: false,
    ask: (want, w, h, d) =>
      want === "d"
        ? t(
            `A rectangular gate is $${w}$ ft wide and $${h}$ ft tall. A brace runs from one corner of the gate to the opposite corner. How long is the brace?`,
            `一扇长方形的门宽 $${w}$ 英尺、高 $${h}$ 英尺。一根支撑杆从门的一个角斜拉到对角。支撑杆有多长？`,
          )
        : want === "h"
          ? t(
              `A brace $${d}$ ft long runs from one corner of a rectangular gate to the opposite corner. The gate is $${w}$ ft wide. How tall is it?`,
              `一根长 $${d}$ 英尺的支撑杆从长方形门的一个角斜拉到对角。门宽 $${w}$ 英尺，高是多少英尺？`,
            )
          : t(
              `A brace $${d}$ ft long runs from one corner of a rectangular gate to the opposite corner. The gate is $${h}$ ft tall. How wide is it?`,
              `一根长 $${d}$ 英尺的支撑杆从长方形门的一个角斜拉到对角。门高 $${h}$ 英尺，宽是多少英尺？`,
            ),
  },
];

/** rectFigure draws a w by h rectangle with a diagonal and labeled sides. */
function rectFigure(w: number, h: number, labels: readonly [string, string, string], en: string, zh: string): Figure {
  return fig(
    [
      {
        kind: "polygon",
        points: [
          [0, 0],
          [w, 0],
          [w, h],
          [0, h],
        ],
      },
      { kind: "segment", a: [0, 0], b: [w, h], accent: true },
      { kind: "right", vertex: [w, 0], from: [0, 0], to: [w, h] },
      { kind: "side", a: [0, 0], b: [w, 0], text: labels[0] },
      { kind: "side", a: [w, 0], b: [w, h], text: labels[1] },
      { kind: "side", a: [w, h], b: [0, 0], text: labels[2] },
    ],
    en,
    zh,
  );
}

/** ShortcutStory is a trip along two sides of a rectangle that a straight route could replace. */
interface ShortcutStory {
  readonly unit: string;
  readonly max: number;
  readonly ask: (a: number, b: number) => Text;
}

const shortcutStories: readonly ShortcutStory[] = [
  {
    unit: "m",
    max: 120,
    ask: (a, b) =>
      t(
        `A rectangular field is $${a}$ m long and $${b}$ m wide. To get from one corner to the opposite corner, you can walk along two sides of the field or straight across the diagonal. How many meters shorter is the walk across the diagonal?`,
        `一块长方形场地长 $${a}$ 米、宽 $${b}$ 米。从一个角到对角，可以沿场地的两条边走，也可以沿对角线直接穿过去。沿对角线走少走多少米？`,
      ),
  },
  {
    unit: "ft",
    max: 300,
    ask: (a, b) =>
      t(
        `To cross a rectangular parking lot from one corner to the opposite corner, a cart can drive along the edges, $${a}$ ft and then $${b}$ ft, or straight across. How many feet shorter is the straight route?`,
        `从长方形停车场的一个角到对角，小车可以沿边先开 $${a}$ 英尺再开 $${b}$ 英尺，也可以直接斜穿过去。直线路线短多少英尺？`,
      ),
  },
  {
    unit: "km",
    max: 30,
    ask: (a, b) =>
      t(
        `A cyclist rides $${a}$ km east and then $${b}$ km north. How many kilometers shorter would a straight route from the start to the finish be?`,
        `一名骑车人先向东骑 $${a}$ 千米，再向北骑 $${b}$ 千米。从起点到终点走直线可以少骑多少千米？`,
      ),
  },
];

/** RightWork is the labelled work for the unknown side of a right triangle, with its check and the reason for each wrong answer. */
interface RightWork {
  readonly answer: Q;
  readonly walk: Walk[];
  readonly check: Pair;
  readonly offs: Off[];
}

/** rootStep takes the positive square root of x², rounding to the nearest tenth when it is not whole. */
const rootStep = (v: string, n: number): Walk => [
  ["Take the square root", "开平方"],
  isSquare(n)
    ? ["A length is positive, so take the positive square root:", "长度是正数，取正的平方根："]
    : [
        "A length is positive, so take the positive square root and round to the nearest tenth:",
        "长度是正数，取正的平方根，并保留一位小数：",
      ],
  [rootResult(v, n)],
];

/** rightWork finds the unknown side x of a right triangle with legs p, q and hypotenuse c in labelled steps. */
function rightWork(want: "leg0" | "leg1" | "hyp", r: RightValues): RightWork {
  const [p, q] = r.legs;
  const c = r.hyp;
  if (want === "hyp") {
    const n = p * p + q * q;
    const answer = rootValue(n);
    const x = qTex(answer);
    return {
      answer,
      walk: [
        [
          ["Set up the theorem", "列出勾股定理"],
          [
            "The unknown $x$ is the hypotenuse, so its square is the sum of the squares of the legs:",
            "未知长度 $x$ 是斜边，它的平方等于两条直角边的平方和：",
          ],
          [`x^2 = ${p}^2 + ${q}^2 = ${p * p} + ${q * q} = ${n}`],
        ],
        rootStep("x", n),
      ],
      check: r.exact
        ? [`Square back: $${x}^2 = ${n}$, which is $${p * p} + ${q * q}$.`, `平方回去：$${x}^2 = ${n}$，正是 $${p * p} + ${q * q}$。`]
        : [
            `The hypotenuse is the longest side: $${x}$ is longer than $${p}$ and $${q}$, but shorter than $${p} + ${q} = ${p + q}$.`,
            `斜边是最长的边：$${x}$ 比 $${p}$ 和 $${q}$ 都长，但比 $${p} + ${q} = ${p + q}$ 短。`,
          ],
      offs: [
        [
          p + q,
          "That adds the legs; add their squares, then take the square root.",
          "这是把两条直角边相加了；应该把它们的平方相加，再开平方。",
        ],
        [n, "That is $x^2$; take its square root to get $x$.", "这是 $x^2$；还要开平方才得到 $x$。"],
        ...(p !== q
          ? ([
              [
                rootValue(Math.abs(p * p - q * q)),
                "That subtracts the squares; $x$ is the hypotenuse, so add them.",
                "这是把平方相减了；$x$ 是斜边，应该相加。",
              ],
            ] satisfies Off[])
          : []),
      ],
    };
  }
  const known = want === "leg0" ? q : p;
  const n = c * c - known * known;
  const answer = rootValue(n);
  const x = qTex(answer);
  return {
    answer,
    walk: [
      [
        ["Set up the theorem", "列出勾股定理"],
        [
          `The unknown $x$ is a leg and $${c}$ is the hypotenuse, so subtract the square of the other leg from the square of the hypotenuse:`,
          `未知长度 $x$ 是直角边，$${c}$ 是斜边，所以用斜边的平方减去另一条直角边的平方：`,
        ],
        [`x^2 + ${known}^2 = ${c}^2`, `x^2 = ${c * c} - ${known * known} = ${n}`],
      ],
      rootStep("x", n),
    ],
    check: r.exact
      ? [`Square back: $${x}^2 + ${known}^2 = ${c * c}$, which is $${c}^2$.`, `平方回去：$${x}^2 + ${known}^2 = ${c * c}$，正是 $${c}^2$。`]
      : [
          `Square back: $${x}^2 = ${dec(answer.mul(answer))}$ is close to $${n}$, and $${x}$ is shorter than the hypotenuse $${c}$.`,
          `平方回去：$${x}^2 = ${dec(answer.mul(answer))}$，接近 $${n}$，而且 $${x}$ 比斜边 $${c}$ 短。`,
        ],
    offs: [
      [
        rootValue(c * c + known * known),
        "That adds the squares; $x$ is a leg, so subtract from the square of the hypotenuse.",
        "这是把平方相加了；$x$ 是直角边，应该用斜边的平方去减。",
      ],
      [
        c - known,
        "That subtracts the lengths; subtract their squares, then take the square root.",
        "这是把长度直接相减了；应该把平方相减，再开平方。",
      ],
      [n, "That is $x^2$; take its square root to get $x$.", "这是 $x^2$；还要开平方才得到 $x$。"],
    ],
  };
}

/** asked adds the instruction to round when the answer is not a whole number. */
const asked = (ask: Text, exact: boolean): Pair =>
  exact ? [ask.en, ask["zh-CN"]] : [ask.en + roundTenth.en, ask["zh-CN"] + roundTenth["zh-CN"]];

/** squareBack squares a length in simplest radical form back to n. */
function squareBack(n: number): string {
  const [k, m] = rootOf(n);
  if (m === 1) return `${k}^2 = ${n}`;
  if (k === 1) return `(\\sqrt{${m}})^2 = ${n}`;
  return `(${radical(k, m)})^2 = ${k * k} \\cdot ${m} = ${n}`;
}

/** simplestStep writes √n in simplest radical form as a labelled step. */
const simplestStep = (v: string, n: number): Walk => [
  ["Simplify the root", "化简根式"],
  rootOf(n)[0] === 1
    ? [
        "No square factor other than 1 divides it, so the root is already in simplest form:",
        "它没有除 1 以外的平方因数，所以根式已经是最简形式：",
      ]
    : ["Take out the largest square factor:", "提出最大的平方因数："],
  [rootLine(v, n)],
];

/** fractionWords name the fraction in the volume formula of a round solid. */
const fractionWords: Record<Round["kind"], Pair> = {
  cylinder: ["", ""],
  cone: ["one third", "三分之一"],
  sphere: ["four thirds", "三分之四"],
  hemisphere: ["two thirds", "三分之二"],
};

/** piPlain writes a multiple of π without a fraction bar: "32\\pi \\div 3". */
const piPlain = (v: Q) => (v.d === 1n ? piTex(v) : `${v.n}\\pi \\div ${v.d}`);

/** pied asks for an answer in terms of π, works it in labelled steps with a check, and answers each wrong coefficient with its reason. */
function pied(prompt: Pair, coef: Q, walk: readonly Walk[], check: Pair, offs: readonly Off[], figure: Figure): Problem {
  const kept = offs.filter(([v], i) => piTex(v) !== piTex(coef) && offs.findIndex(([w]) => piTex(w) === piTex(v)) === i);
  return {
    ...piProblem({
      prompt: t(prompt[0], prompt[1]),
      coef,
      solution: walkThrough(walk, check),
      mistakes: kept.map(([value, en, zh]) => ({ value, why: t(en, zh) })),
    }),
    figure,
  };
}

const solvingRealWorldProblemsUsingThePythagoreanTheorem = withIntro(
  topic(
    "solving-real-world-problems-using-the-pythagorean-theorem",
    t("Solving Real-World Problems Using the Pythagorean Theorem", "用勾股定理解决实际问题"),
    t(
      "Find the right triangle in a real-world situation (a ladder, a ramp, the diagonal of a rectangle, a shortcut) and use the Pythagorean theorem to find a length.",
      "在实际情境（梯子、斜坡、长方形的对角线、抄近路）中找出直角三角形，并用勾股定理求长度。",
    ),
    ["the-pythagorean-theorem"],
    ["8.G.B.7"],
    [
      lesson(
        "ladders-ramps-and-wires",
        ["Ladders, ramps and wires", "梯子、斜坡和拉线"],
        [
          [
            "A ladder against a wall, a wire from the top of a pole, a kite string and a ramp each form a right triangle with the ground: the ground is one leg, the vertical height is the other, and the slanted object is the **hypotenuse**. Decide which side is unknown before you compute. A $10$-ft ladder whose foot is $6$ ft from a wall reaches $x$ ft up, where $x^2 + 6^2 = 10^2$: $x^2 = 100 - 36 = 64$, so $x = 8$ ft.",
            "靠在墙上的梯子、从电线杆顶端拉下的拉线、风筝线和斜坡，都与地面构成直角三角形：地面是一条直角边，竖直高度是另一条直角边，倾斜的物体是**斜边**。计算前先判断哪条边未知。一架 $10$ 英尺长的梯子，梯脚离墙 $6$ 英尺，它在墙上到达的高度 $x$ 满足 $x^2 + 6^2 = 10^2$：$x^2 = 100 - 36 = 64$，所以 $x = 8$ 英尺。",
          ],
          ["Square back: $8^2 + 6^2 = 64 + 36 = 100 = 10^2$.", "平方回去：$8^2 + 6^2 = 64 + 36 = 100 = 10^2$。"],
          [
            "The ladder is the hypotenuse, so it is the longest side. Adding $10^2 + 6^2$ would give a height longer than the ladder itself.",
            "梯子是斜边，所以它是最长的边。若计算 $10^2 + 6^2$，得到的高度会比梯子本身还长。",
          ],
        ],
        (rng) => {
          const story = rng.pick(stories);
          const want = rng.pick(["run", "rise", "hyp"] as const);
          const u = rng.pick(story.units);
          const uz = zhUnits[u]!;
          const ok = (p: number, q: number) => (story.shape === "steep" ? q > p : story.shape === "gentle" ? q < p : true);
          const kind = want === "hyp" ? "hyp" : want === "run" ? "leg0" : "leg1";
          const r = pickRight(rng, kind, 30, ok);
          const [run, rise] = r.legs;
          const v = { run: `${run}`, rise: `${rise}`, hyp: `${r.hyp}` };
          const work = rightWork(kind, r);
          return valued(
            asked(story.ask(want, v, u, uz), r.exact),
            work.answer,
            [
              [
                ["Find the right triangle", "找出直角三角形"],
                [
                  `${story.hyp.en} is the hypotenuse; the height and the distance along the ground are the legs. Call the unknown length $x$.`,
                  `${story.hyp["zh-CN"]}是斜边，高度和地面上的距离是两条直角边。设未知长度为 $x$。`,
                ],
              ],
              ...work.walk,
            ],
            work.check,
            work.offs,
            {
              form: r.exact ? "integer" : "decimal",
              unit: u,
              figure: fig(
                rightMarks(rightTri(run, rise, { turn: 0, mirror: rng.bool() }), {
                  sides: [wordLabel(run, u, want === "run"), wordLabel(r.hyp, u, want === "hyp"), wordLabel(rise, u, want === "rise")],
                }),
                "A right triangle formed by the ground, a vertical height and a slanted side.",
                "由地面、竖直高度和一条斜边构成的直角三角形。",
              ),
            },
          );
        },
        drawn(gradeDrawings3["solving-real-world-problems-using-the-pythagorean-theorem#ladders-ramps-and-wires"]),
      ),
      lesson(
        "diagonals-of-rectangles",
        ["Diagonals of rectangles", "长方形的对角线"],
        [
          [
            "A diagonal cuts a rectangle into two right triangles. The length and the width are the legs, and the diagonal is the hypotenuse: $d^2 = w^2 + h^2$. A TV screen $48$ in wide and $20$ in tall has diagonal $d$ with $d^2 = 48^2 + 20^2 = 2304 + 400 = 2704$, so $d = 52$ in. To find a side from the diagonal, subtract: $h^2 = d^2 - w^2$.",
            "对角线把长方形分成两个直角三角形：长和宽是直角边，对角线是斜边：$d^2 = w^2 + h^2$。宽 $48$ 英寸、高 $20$ 英寸的电视屏幕，对角线 $d$ 满足 $d^2 = 48^2 + 20^2 = 2304 + 400 = 2704$，所以 $d = 52$ 英寸。由对角线求一边时用减法：$h^2 = d^2 - w^2$。",
          ],
          [
            "The diagonal is the longest side of each triangle: $52$ is more than $48$ and $20$, and less than $48 + 20 = 68$.",
            "对角线是每个三角形中最长的边：$52$ 比 $48$ 和 $20$ 都大，又比 $48 + 20 = 68$ 小。",
          ],
          [
            "The diagonal is not the sum of the sides. Going straight across is shorter than going along two sides.",
            "对角线不等于两边之和。直接穿过比沿两条边走要短。",
          ],
        ],
        (rng) => {
          const story = rng.pick(rectStories);
          const want = rng.pick(["w", "h", "d"] as const);
          const kind = want === "d" ? "hyp" : want === "w" ? "leg0" : "leg1";
          const ok = (w: number, h: number) => !story.wide || (w > h && w < 3 * h);
          const r = pickRight(rng, kind, story.max, ok);
          const [w, h] = r.legs;
          const work = rightWork(kind, r);
          const u = story.unit;
          return valued(
            asked(story.ask(want, w, h, r.hyp), r.exact),
            work.answer,
            [
              [
                ["Find the right triangle", "找出直角三角形"],
                [
                  "The diagonal cuts the rectangle into two right triangles: the diagonal is the hypotenuse, and two sides of the rectangle are the legs. Call the unknown length $x$.",
                  "对角线把长方形分成两个直角三角形：对角线是斜边，长方形的两条边是直角边。设未知长度为 $x$。",
                ],
              ],
              ...work.walk,
            ],
            work.check,
            work.offs,
            {
              form: r.exact ? "integer" : "decimal",
              unit: u,
              figure: rectFigure(
                w,
                h,
                [wordLabel(w, u, want === "w"), wordLabel(h, u, want === "h"), wordLabel(r.hyp, u, want === "d")],
                "A rectangle with one diagonal drawn.",
                "一个画出一条对角线的长方形。",
              ),
            },
          );
        },
        drawn(gradeDrawings3["solving-real-world-problems-using-the-pythagorean-theorem#diagonals-of-rectangles"]),
      ),
      lesson(
        "shortcuts",
        ["Shortcuts", "抄近路"],
        [
          [
            "Going straight across a rectangle is shorter than going along two of its sides. The straight route is the hypotenuse of the right triangle whose legs are the two sides, so the distance saved is the trip along the sides minus the hypotenuse. Along sides of $30$ m and $40$ m you walk $70$ m, but straight across you walk $\\sqrt{900 + 1600} = 50$ m, so you save $70 - 50 = 20$ m.",
            "直接斜穿长方形比沿两条边走要近。直线路线是以这两条边为直角边的直角三角形的斜边，所以少走的距离是沿两边走的路程减去斜边。沿 $30$ 米和 $40$ 米的两条边要走 $70$ 米，而直接穿过只需走 $\\sqrt{900 + 1600} = 50$ 米，所以少走 $70 - 50 = 20$ 米。",
          ],
          [
            "Add back: the straight route and the saving make $50 + 20 = 70$ m, the trip along the sides.",
            "加回去：直线路线加上少走的距离，$50 + 20 = 70$ 米，正是沿两边走的路程。",
          ],
          [
            "The question asks for the difference of the two routes, not the length of the straight route. Finding $50$ is only the middle step.",
            "题目问的是两条路线之差，而不是直线路线的长度。求出 $50$ 只是中间一步。",
          ],
        ],
        (rng) => {
          const story = rng.pick(shortcutStories);
          const r = pickRight(rng, "hyp", story.max, (p, q) => p > q);
          const [a, b] = r.legs;
          const n = a * a + b * b;
          const c = rootValue(n);
          const saved = Q.of(a + b).sub(c);
          const u = story.unit;
          const uz = zhUnits[u]!;
          return valued(
            asked(story.ask(a, b), r.exact),
            saved,
            [
              [
                ["Go along the sides", "沿两边走"],
                ["The trip along the two sides is their sum:", "沿两条边走的路程是它们的和："],
                [`${a} + ${b} = ${a + b}`],
              ],
              [
                ["Go straight across", "直线穿过"],
                [
                  "The straight route is the hypotenuse of a right triangle with these sides as legs:",
                  "直线路线是以这两条边为直角边的直角三角形的斜边：",
                ],
                [`x^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${n}`, rootResult("x", n)],
              ],
              [
                ["Subtract", "相减"],
                ["The distance saved is the difference of the two routes:", "少走的距离是两条路线之差："],
                [`${a + b} - ${qTex(c)} = ${qTex(saved)}`],
              ],
            ],
            [
              `Add back: the straight route and the saving make $${qTex(c)} + ${qTex(saved)} = ${a + b}$ ${u}, the trip along the sides.`,
              `加回去：直线路线加上少走的距离，$${qTex(c)} + ${qTex(saved)} = ${a + b}$ ${uz}，正是沿两边走的路程。`,
            ],
            [
              [
                c,
                "That is the length of the straight route; subtract it from the trip along the sides.",
                "这是直线路线的长度；还要用沿两边走的路程减去它。",
              ],
              [a + b, "That is the trip along the sides; subtract the straight route from it.", "这是沿两边走的路程；还要减去直线路线。"],
              [
                Q.of(a + b).add(c),
                "That adds the two routes; the question asks how much shorter one is.",
                "这是把两条路线相加了；题目问的是短多少。",
              ],
            ],
            {
              form: r.exact ? "integer" : "decimal",
              unit: u,
              figure: rectFigure(
                a,
                b,
                [`${a} ${u}`, `${b} ${u}`, "?"],
                "A rectangle with two sides and the diagonal between their ends.",
                "一个长方形，标出两条边和连接它们端点的对角线。",
              ),
            },
          );
        },
        drawn(gradeDrawings3["solving-real-world-problems-using-the-pythagorean-theorem#shortcuts"]),
      ),
    ],
  ),
  [
    "A $13$-ft ladder leans against a wall with its foot $5$ ft from the wall. Will its top reach a window sill $12$ ft up?",
    "一架 $13$ 英尺长的梯子靠在墙上，梯脚离墙 $5$ 英尺。它的顶端能够到离地 $12$ 英尺的窗台吗？",
  ],
  [
    "Exactly: $13^2 - 5^2 = 169 - 25 = 144 = 12^2$, so the top is $12$ ft up.",
    "正好够到：$13^2 - 5^2 = 169 - 25 = 144 = 12^2$，所以顶端离地 $12$ 英尺。",
  ],
  [
    "find the right triangle in ladders, ramps, rectangles and shortcuts, decide which side is unknown, and use the Pythagorean theorem to find it.",
    "在梯子、斜坡、长方形和抄近路的情境中找出直角三角形，判断哪条边未知，再用勾股定理求出它。",
  ],
);

// ---------------------------------------------------------------------------
// Distance between two points

/** XY is a grid point. */
type XY = readonly [number, number];

/** offAxes tells whether points keep away from the axes, so that their labels do not cover the axis numbers. */
const offAxes = (pts: readonly XY[]) => pts.every((v) => Math.abs(v[0]) > 1 && Math.abs(v[1]) > 1);

const pointNames = [
  ["A", "B"],
  ["P", "Q"],
  ["M", "N"],
  ["R", "S"],
] as const;

const findingTheDistanceBetweenTwoPoints = withIntro(
  topic(
    "finding-the-distance-between-two-points-using-the-pythagorean-theorem",
    t("Finding the Distance Between Two Points Using the Pythagorean Theorem", "用勾股定理求两点间的距离"),
    t(
      "Find the distance between two points of the coordinate plane as the hypotenuse of a right triangle with a horizontal and a vertical leg.",
      "把坐标平面上两点间的距离看作一个直角三角形的斜边（两条直角边分别水平和竖直），并求出它。",
    ),
    ["the-pythagorean-theorem", "the-coordinate-plane"],
    ["8.G.B.8"],
    [
      lesson(
        "distance-on-the-grid",
        ["Distance on the grid", "网格上的距离"],
        [
          [
            "To find the distance between two points that are not on the same horizontal or vertical line, draw a right triangle: a horizontal leg and a vertical leg meet at a corner, and the segment between the points is the hypotenuse. Count the length of each leg, then use the Pythagorean theorem. From $(1, 2)$ to $(4, 6)$ the legs are $3$ and $4$, so the distance is $\\sqrt{9 + 16} = 5$.",
            "要求不在同一条水平线或竖直线上的两点间的距离，就画一个直角三角形：一条水平直角边和一条竖直直角边相交于一个顶点，两点间的线段是斜边。数出每条直角边的长度，再用勾股定理。从 $(1, 2)$ 到 $(4, 6)$，两条直角边为 $3$ 和 $4$，所以距离为 $\\sqrt{9 + 16} = 5$。",
          ],
          ["Square back: $5^2 = 25 = 3^2 + 4^2$.", "平方回去：$5^2 = 25 = 3^2 + 4^2$。"],
          [
            "The distance is not $3 + 4 = 7$: that is the length of the path along the legs, and the straight segment is shorter.",
            "距离不是 $3 + 4 = 7$，那是沿两条直角边走的路程，直线段要短一些。",
          ],
        ],
        (rng) => {
          for (;;) {
            const [p, q, c] = pickTriple(rng, 15);
            const dx = rng.bool() ? p : -p;
            const dy = rng.bool() ? q : -q;
            const a: XY = [rng.int(-7, 7), rng.int(-7, 7)];
            const b: XY = [a[0] + dx, a[1] + dy];
            if (Math.abs(b[0]) > 7 || Math.abs(b[1]) > 7 || !offAxes([a, b])) continue;
            const [na, nb] = rng.pick(pointNames);
            return valued(
              [`Find the distance between points $${na}$ and $${nb}$.`, `求点 $${na}$ 与点 $${nb}$ 之间的距离。`],
              c,
              [
                [
                  ["Find the legs", "求直角边"],
                  [
                    `Read $${na}${pointLatex(a)}$ and $${nb}${pointLatex(b)}$. The horizontal leg, then the vertical leg:`,
                    `读出 $${na}${pointLatex(a)}$ 和 $${nb}${pointLatex(b)}$。先求水平直角边，再求竖直直角边：`,
                  ],
                  [`|${b[0]} - ${paren(a[0])}| = ${p}`, `|${b[1]} - ${paren(a[1])}| = ${q}`],
                ],
                [
                  ["Use the theorem", "用勾股定理"],
                  ["The segment between the points is the hypotenuse:", "两点间的线段是斜边："],
                  [`d^2 = ${p}^2 + ${q}^2 = ${p * p} + ${q * q} = ${c * c}`, `d = \\sqrt{${c * c}} = ${c}`],
                ],
              ],
              [
                `Square back: $${c}^2 = ${c * c}$, and $${c}$ is shorter than the path $${p} + ${q} = ${p + q}$ along the legs.`,
                `平方回去：$${c}^2 = ${c * c}$，而且 $${c}$ 比沿直角边走的路程 $${p} + ${q} = ${p + q}$ 短。`,
              ],
              [
                [p + q, "That is the path along the two legs; the distance is the hypotenuse.", "这是沿两条直角边走的路程；距离是斜边。"],
                [c * c, "That is $d^2$; take its square root.", "这是 $d^2$；还要开平方。"],
                [
                  Math.abs(p - q),
                  "That subtracts the legs; add their squares, then take the square root.",
                  "这是把两条直角边相减了；应该把它们的平方相加，再开平方。",
                ],
              ],
              {
                figure: graph(
                  [
                    { kind: "point", at: [a[0], a[1]], label: na, dir: "nw" },
                    { kind: "point", at: [b[0], b[1]], label: nb, dir: "nw" },
                  ],
                  `Points ${na}${pointLatex(a)} and ${nb}${pointLatex(b)} in the coordinate plane.`,
                  `坐标平面上的点 ${na}${pointLatex(a)} 和 ${nb}${pointLatex(b)}。`,
                ),
              },
            );
          }
        },
        drawn(gradeDrawings3["finding-the-distance-between-two-points-using-the-pythagorean-theorem#distance-on-the-grid"]),
      ),
      lesson(
        "distances-in-simplest-radical-form",
        ["Distances in simplest radical form", "最简根式形式的距离"],
        [
          [
            "You do not need a grid: the legs are the differences of the coordinates. From $(x_1, y_1)$ to $(x_2, y_2)$ the horizontal leg is $|x_2 - x_1|$ and the vertical leg is $|y_2 - y_1|$. From $(-2, 3)$ to $(4, -1)$: the legs are $|4 - (-2)| = 6$ and $|-1 - 3| = 4$, so the distance is $\\sqrt{36 + 16} = \\sqrt{52} = 2\\sqrt{13}$.",
            "不画网格也可以：直角边就是坐标之差。从 $(x_1, y_1)$ 到 $(x_2, y_2)$，水平直角边为 $|x_2 - x_1|$，竖直直角边为 $|y_2 - y_1|$。从 $(-2, 3)$ 到 $(4, -1)$：直角边为 $|4 - (-2)| = 6$ 和 $|-1 - 3| = 4$，所以距离为 $\\sqrt{36 + 16} = \\sqrt{52} = 2\\sqrt{13}$。",
          ],
          [
            "Square back: $(2\\sqrt{13})^2 = 4 \\cdot 13 = 52 = 6^2 + 4^2$.",
            "平方回去：$(2\\sqrt{13})^2 = 4 \\cdot 13 = 52 = 6^2 + 4^2$。",
          ],
          [
            "Subtract the coordinates, do not add them, and take care with negative numbers: $4 - (-2)$ is $6$, not $2$.",
            "要把坐标相减而不是相加，并注意负数：$4 - (-2)$ 是 $6$，不是 $2$。",
          ],
        ],
        (rng) => {
          for (;;) {
            const a: XY = [rng.int(-9, 9), rng.int(-9, 9)];
            const b: XY = [rng.int(-9, 9), rng.int(-9, 9)];
            const [dx, dy] = [Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])];
            const n = dx * dx + dy * dy;
            if (dx === 0 || dy === 0 || isSquare(n) || n > 300) continue;
            if (a[0] >= 0 && a[1] >= 0 && b[0] >= 0 && b[1] >= 0) continue;
            const [na, nb] = rng.pick(pointNames);
            const added = (a[0] + b[0]) ** 2 + (a[1] + b[1]) ** 2;
            return rooted(
              [
                `Find the distance between $${na}${pointLatex(a)}$ and $${nb}${pointLatex(b)}$. Give your answer in simplest radical form.`,
                `求 $${na}${pointLatex(a)}$ 与 $${nb}${pointLatex(b)}$ 之间的距离。答案写成最简根式。`,
              ],
              rootOf(n),
              [
                [
                  ["Find the legs", "求直角边"],
                  ["Subtract the coordinates: the horizontal leg, then the vertical leg:", "把坐标相减：先求水平直角边，再求竖直直角边："],
                  [`|${b[0]} - ${paren(a[0])}| = ${dx}`, `|${b[1]} - ${paren(a[1])}| = ${dy}`],
                ],
                [
                  ["Use the theorem", "用勾股定理"],
                  ["The distance is the hypotenuse:", "距离是斜边："],
                  [`d^2 = ${dx}^2 + ${dy}^2 = ${dx * dx} + ${dy * dy} = ${n}`],
                ],
                simplestStep("d", n),
              ],
              [
                `Square back: $${squareBack(n)}$, which is $${dx}^2 + ${dy}^2$.`,
                `平方回去：$${squareBack(n)}$，正是 $${dx}^2 + ${dy}^2$。`,
              ],
              [
                ...(added > 0 && added !== n
                  ? ([
                      [
                        rootTex(added),
                        "That adds the coordinates; subtract them to find the legs.",
                        "这是把坐标相加了；应该相减来求直角边。",
                      ],
                    ] satisfies Said[])
                  : []),
                [
                  `${dx + dy}`,
                  "That adds the legs; add their squares, then take the square root.",
                  "这是把两条直角边相加了；应该把它们的平方相加，再开平方。",
                ],
                ...(dx !== dy
                  ? ([
                      [
                        rootTex(Math.abs(dx * dx - dy * dy)),
                        "That subtracts the squares of the legs; add them.",
                        "这是把两条直角边的平方相减了；应该相加。",
                      ],
                    ] satisfies Said[])
                  : []),
              ],
            );
          }
        },
        graph(
          [
            { kind: "segment", a: [-2, 3], b: [4, -1], accent: true },
            { kind: "segment", a: [-2, 3], b: [-2, -1], dashed: true },
            { kind: "segment", a: [-2, -1], b: [4, -1], dashed: true },
            { kind: "point", at: [-2, 3], label: "(-2, 3)", dir: "nw" },
            { kind: "point", at: [4, -1], label: "(4, -1)", dir: "se" },
          ],
          "The points (-2, 3) and (4, -1) joined by a segment, with a horizontal leg of 6 and a vertical leg of 4 drawn dashed.",
          "点 (-2, 3) 和 (4, -1) 由线段相连，虚线画出长为 6 的水平直角边和长为 4 的竖直直角边。",
        ),
      ),
      lesson(
        "which-point-is-closer",
        ["Which point is closer?", "哪个点更近？"],
        [
          [
            "To compare distances from a point $P$, compare their squares, the square of the horizontal leg plus the square of the vertical leg: the smaller square belongs to the shorter distance, so you do not need to take square roots. From $P(-3, -2)$, $A(2, -2)$ is $5$ away, so $PA^2 = 25$, while $B(0, 1)$ has legs $3$ and $3$, so $PB^2 = 9 + 9 = 18$. $B$ is closer.",
            "比较各点到点 $P$ 的距离时，可以比较它们的平方，即水平直角边的平方加竖直直角边的平方：平方越小，距离越短，不必开平方。从 $P(-3, -2)$ 出发，$A(2, -2)$ 的距离是 $5$，所以 $PA^2 = 25$；$B(0, 1)$ 的两条直角边都是 $3$，所以 $PB^2 = 9 + 9 = 18$。$B$ 更近。",
          ],
          [
            "Take the roots to see it: $PB = \\sqrt{18} \\approx 4.2$, which is less than $PA = 5$.",
            "开平方看一看：$PB = \\sqrt{18} \\approx 4.2$，比 $PA = 5$ 小。",
          ],
          [
            "Do not compare the sums of the legs. The legs to $B$ add up to $6$, more than $5$, yet $B$ is the closer point.",
            "不要比较两条直角边之和。到 $B$ 的两条直角边之和是 $6$，比 $5$ 大，但 $B$ 才是更近的点。",
          ],
        ],
        (rng) => {
          for (;;) {
            const p: XY = [rng.int(-3, 3), rng.int(-3, 3)];
            const pts: XY[] = [0, 1, 2].map(() => [p[0] + rng.int(-5, 5), p[1] + rng.int(-5, 5)] as XY);
            if (!pts.every((v) => Math.abs(v[0]) <= 7 && Math.abs(v[1]) <= 7) || !offAxes([p, ...pts])) continue;
            const all = [p, ...pts];
            if (all.some((v, i) => all.some((w, j) => j > i && Math.max(Math.abs(v[0] - w[0]), Math.abs(v[1] - w[1])) < 2))) continue;
            const sq = pts.map((v) => (v[0] - p[0]) ** 2 + (v[1] - p[1]) ** 2);
            const sum = pts.map((v) => Math.abs(v[0] - p[0]) + Math.abs(v[1] - p[1]));
            if (new Set(sq).size < 3) continue;
            const far = rng.bool(0.35);
            const pickBy = (xs: number[]) => xs.indexOf(far ? Math.max(...xs) : Math.min(...xs));
            const correct = pickBy(sq);
            // Usually make the sums of the legs point to another answer, so that comparing them fails.
            if (rng.bool(0.7) && pickBy(sum) === correct) continue;
            const names = ["A", "B", "C"] as const;
            const best = names[correct]!;
            const lines = pts.map((v, i) => `P${names[i]}^2 = ${Math.abs(v[0] - p[0])}^2 + ${Math.abs(v[1] - p[1])}^2 = ${sq[i]}`);
            const point = (i: number): Pair => [`Point $${names[i]}$`, `点 $${names[i]}$`];
            return chosen(
              rng,
              far
                ? ["Which point is farthest from $P$?", "哪个点离 $P$ 最远？"]
                : ["Which point is closest to $P$?", "哪个点离 $P$ 最近？"],
              point(correct),
              [0, 1, 2]
                .filter((i) => i !== correct)
                .map((i): Wrong => {
                  const legs = pickBy(sum) === i;
                  return [
                    point(i),
                    `Point $${names[i]}$ is ${far ? "closer" : "farther"}: $P${names[i]}^2 = ${sq[i]}$ is ${far ? "less" : "more"} than $P${best}^2 = ${sq[correct]}$.${legs ? ` Its legs add up to the ${far ? "most" : "least"}, but the path along the legs is not the distance.` : ""}`,
                    `点 $${names[i]}$ 更${far ? "近" : "远"}：$P${names[i]}^2 = ${sq[i]}$ ${far ? "小于" : "大于"} $P${best}^2 = ${sq[correct]}$。${legs ? `它的两条直角边之和${far ? "最大" : "最小"}，但沿直角边走的路程不是距离。` : ""}`,
                  ];
                }),
              [
                [
                  ["Find the squares", "求距离的平方"],
                  [
                    "For each point, add the squares of the horizontal and the vertical leg:",
                    "对每个点，把水平直角边和竖直直角边的平方相加：",
                  ],
                  lines,
                ],
                [
                  ["Compare", "比较"],
                  [
                    `The ${far ? "largest" : "smallest"} square is $P${best}^2 = ${sq[correct]}$, so point $${best}$ is ${far ? "farthest from" : "closest to"} $P$.`,
                    `${far ? "最大" : "最小"}的平方是 $P${best}^2 = ${sq[correct]}$，所以点 $${best}$ 离 $P$ ${far ? "最远" : "最近"}。`,
                  ],
                ],
              ],
              [
                `Taking square roots keeps the order, so the ${far ? "largest" : "smallest"} square belongs to the ${far ? "longest" : "shortest"} distance, $P${best}$.`,
                `开平方不改变大小顺序，所以平方${far ? "最大" : "最小"}的 $P${best}$ 就是${far ? "最长" : "最短"}的距离。`,
              ],
              graph(
                [
                  { kind: "point", at: [p[0], p[1]], label: "P", dir: "nw", accent: true },
                  ...pts.map((v, i): PlaneMark => ({ kind: "point", at: [v[0], v[1]], label: names[i], dir: "nw" })),
                ],
                `Point P${pointLatex(p)} and points ${pts.map((v, i) => `${names[i]}${pointLatex(v)}`).join(", ")}.`,
                `点 P${pointLatex(p)} 以及点 ${pts.map((v, i) => `${names[i]}${pointLatex(v)}`).join("、")}。`,
              ),
            );
          }
        },
        graph(
          [
            { kind: "segment", a: [-3, -2], b: [2, -2], dashed: true },
            { kind: "segment", a: [-3, -2], b: [0, 1], accent: true },
            { kind: "point", at: [-3, -2], label: "P", dir: "sw", accent: true },
            { kind: "point", at: [2, -2], label: "A", dir: "se" },
            { kind: "point", at: [0, 1], label: "B", dir: "nw" },
          ],
          "Point P(-3, -2) with A(2, -2) 5 units to the right and B(0, 1) 3 right and 3 up; B is the closer point.",
          "点 P(-3, -2)，A(2, -2) 在它右边 5 个单位，B(0, 1) 在它右边 3 个、上边 3 个单位；B 更近。",
        ),
      ),
    ],
  ),
  [
    "A treasure map puts the camp at $(1, 2)$ and the treasure at $(4, 6)$, one unit for each kilometer. How far is the treasure in a straight line?",
    "一张藏宝图上，营地在 $(1, 2)$，宝藏在 $(4, 6)$，每个单位代表 $1$ 千米。宝藏的直线距离有多远？",
  ],
  [
    "The legs are $3$ km and $4$ km, so the distance is $\\sqrt{9 + 16} = 5$ km.",
    "两条直角边是 $3$ 千米和 $4$ 千米，所以距离是 $\\sqrt{9 + 16} = 5$ 千米。",
  ],
  [
    "find the distance between two points as the hypotenuse of a right triangle with a horizontal and a vertical leg, on a grid and from coordinates alone.",
    "把两点间的距离看作一条水平直角边和一条竖直直角边所构成的直角三角形的斜边，在网格上求，也只用坐标求。",
  ],
);

// ---------------------------------------------------------------------------
// Three-dimensional figures

/** quadruples are whole-number boxes whose space diagonals are whole numbers too: l² + w² + h² = d². */
const quadruples = [
  [1, 2, 2, 3],
  [2, 3, 6, 7],
  [1, 4, 8, 9],
  [4, 4, 7, 9],
  [2, 6, 9, 11],
  [6, 6, 7, 11],
  [3, 4, 12, 13],
  [2, 10, 11, 15],
  [5, 10, 10, 15],
  [2, 5, 14, 15],
  [8, 9, 12, 17],
  [6, 10, 15, 19],
] as const;

/** len3 writes a length with its unit for a figure. */
const len3 = (v: number, u: Unit) => `${v} ${u}`;

const applyingThePythagoreanTheoremInThreeDimensions = withIntro(
  topic(
    "applying-the-pythagorean-theorem-to-three-dimensional-figures",
    t("Applying the Pythagorean Theorem to Three-Dimensional Figures", "在立体图形中应用勾股定理"),
    t(
      "Find right triangles inside boxes, cones, pyramids and cylinders to compute diagonals, heights and slant heights.",
      "在长方体、圆锥、棱锥和圆柱中找出直角三角形，求对角线、高和斜高。",
    ),
    ["the-pythagorean-theorem"],
    ["8.G.B.7"],
    [
      lesson(
        "the-diagonal-of-a-box",
        ["The diagonal of a box", "长方体的对角线"],
        [
          [
            "The diagonal of a box runs from a bottom corner to the opposite top corner. Find it in two steps. First the diagonal $e$ of the bottom face: $e^2 = l^2 + w^2$. Then $e$, the height $h$ and the box's diagonal $d$ form a right triangle standing up inside the box: $d^2 = e^2 + h^2$. For a $3 \\times 4 \\times 12$ box: $e^2 = 9 + 16 = 25$, then $d^2 = 25 + 144 = 169$, so $d = 13$. The diagonal is the longest straight rod that fits inside the box.",
            "长方体的对角线从底面的一个顶点通到顶面上相对的顶点。分两步求。先求底面的对角线 $e$：$e^2 = l^2 + w^2$。再用 $e$、高 $h$ 和长方体的对角线 $d$ 构成的立在长方体内部的直角三角形：$d^2 = e^2 + h^2$。对于 $3 \\times 4 \\times 12$ 的长方体：$e^2 = 9 + 16 = 25$，再 $d^2 = 25 + 144 = 169$，所以 $d = 13$。这条对角线是能放进长方体内的最长直棒的长度。",
          ],
          [
            "Each edge counts once: $3^2 + 4^2 + 12^2 = 9 + 16 + 144 = 169 = 13^2$.",
            "每条棱各算一次：$3^2 + 4^2 + 12^2 = 9 + 16 + 144 = 169 = 13^2$。",
          ],
          [
            "The diagonal of the bottom face is not the answer: the box's diagonal also climbs the height, so it is longer.",
            "底面的对角线不是答案：长方体的对角线还要向上经过高，所以更长。",
          ],
        ],
        (rng) => {
          for (;;) {
            const exact = rng.bool();
            let dims: number[];
            if (exact) dims = rng.shuffle(rng.pick(quadruples).slice(0, 3));
            else dims = [rng.int(2, 12), rng.int(2, 12), rng.int(2, 12)];
            const [l, w, h] = dims as [number, number, number];
            const base = l * l + w * w;
            const n = base + h * h;
            if (!exact && isSquare(n)) continue;
            const u = pickUnit(rng);
            const rod = rng.bool(0.4);
            const ask: Pair = rod
              ? [
                  `A box is $${l}$ ${u} long, $${w}$ ${u} wide and $${h}$ ${u} tall. What is the length of the longest straight rod that fits inside the box?`,
                  `一个长方体盒子长 $${l}$ ${zhUnits[u]}、宽 $${w}$ ${zhUnits[u]}、高 $${h}$ ${zhUnits[u]}。能放进盒子内的最长直棒有多长？`,
                ]
              : [
                  "Find the length of the diagonal of the box shown, from a bottom corner to the opposite top corner.",
                  "求图中长方体从底面一个顶点到顶面相对顶点的对角线长。",
                ];
            const walk: Walk[] = [
              [
                ["Find the bottom diagonal", "求底面对角线"],
                [
                  "The diagonal $e$ of the bottom face is the hypotenuse of a right triangle with the length and the width as legs:",
                  "底面对角线 $e$ 是以长和宽为直角边的直角三角形的斜边：",
                ],
                [`e^2 = ${l}^2 + ${w}^2 = ${l * l} + ${w * w} = ${base}`],
              ],
              [
                ["Stand up the second triangle", "竖起第二个直角三角形"],
                [
                  "The box's diagonal $d$ is the hypotenuse of a right triangle with $e$ and the height as legs:",
                  "长方体的对角线 $d$ 是以 $e$ 和高为直角边的直角三角形的斜边：",
                ],
                [`d^2 = e^2 + ${h}^2 = ${base} + ${h * h} = ${n}`, ...(exact ? [rootLine("d", n)] : [])],
              ],
              ...(exact ? [] : [simplestStep("d", n)]),
            ];
            const check: Pair = [
              `Each edge counts once: $${l}^2 + ${w}^2 + ${h}^2 = ${n}$, and $${squareBack(n)}$.`,
              `每条棱各算一次：$${l}^2 + ${w}^2 + ${h}^2 = ${n}$，而 $${squareBack(n)}$。`,
            ];
            const figure = fig(
              boxMarks(l, w, h, { l: len3(l, u), d: len3(w, u), h: len3(h, u) }, "space"),
              `A box ${l} by ${w} by ${h} ${u} with a diagonal from a bottom corner to the opposite top corner.`,
              `一个 ${l} × ${w} × ${h} ${zhUnits[u]}的长方体，画出从底面一个顶点到顶面相对顶点的对角线。`,
            );
            const bottom: Pair = [
              "That is the diagonal of the bottom face; the box's diagonal also climbs the height.",
              "这是底面的对角线；长方体的对角线还要向上经过高。",
            ];
            const edges: Pair = [
              "That adds the edges; add their squares, then take the square root.",
              "这是把三条棱相加了；应该把它们的平方相加，再开平方。",
            ];
            if (exact)
              return valued(
                ask,
                Math.sqrt(n),
                walk,
                check,
                [
                  [l + w + h, ...edges],
                  [n, "That is $d^2$; take its square root.", "这是 $d^2$；还要开平方。"],
                  ...(isSquare(base) ? ([[Math.sqrt(base), ...bottom]] satisfies Off[]) : []),
                ],
                { unit: u, figure },
              );
            return rooted(
              [`${ask[0]} Give your answer in simplest radical form.`, `${ask[1]}答案写成最简根式。`],
              rootOf(n),
              walk,
              check,
              [
                [rootTex(base), ...bottom],
                [`${l + w + h}`, ...edges],
                [
                  rootTex(l * l + h * h),
                  "That is the diagonal of a side face; use the diagonal of the bottom face with the height.",
                  "这是一个侧面的对角线；应该用底面的对角线和高。",
                ],
              ],
              figure,
            );
          }
        },
        drawn(gradeDrawings3["applying-the-pythagorean-theorem-to-three-dimensional-figures#the-diagonal-of-a-box"]),
      ),
      lesson(
        "heights-and-slant-heights",
        ["Heights and slant heights", "高和斜高"],
        [
          [
            "Inside a right cone, the height $h$, the radius $r$ and the slant height $l$ form a right triangle with the slant height as hypotenuse: $l^2 = r^2 + h^2$. Inside a pyramid with a square base of side $s$, the height, **half the base side** and the slant height (the height of a triangular face) form a right triangle with the slant height as hypotenuse. A pyramid with base side $12$ and height $8$ has $l^2 = 8^2 + 6^2 = 64 + 36 = 100$, so $l = 10$.",
            "在直圆锥内部，高 $h$、底面半径 $r$ 和母线 $l$ 构成直角三角形，母线是斜边：$l^2 = r^2 + h^2$。在底面是边长为 $s$ 的正方形的棱锥内部，高、**底边长的一半**和斜高（侧面三角形的高）构成直角三角形，斜高是斜边。底边长 $12$、高 $8$ 的棱锥，$l^2 = 8^2 + 6^2 = 64 + 36 = 100$，所以 $l = 10$。",
          ],
          [
            "The slant height is the hypotenuse, so it is the longest: $10$ is more than the height $8$ and the half side $6$.",
            "斜高是斜边，所以最长：$10$ 比高 $8$ 和半边长 $6$ 都大。",
          ],
          [
            "The triangle inside a pyramid reaches from the center of the base to the middle of an edge, which is half the side. Using the whole side $12$ gives a slant height that is too long.",
            "棱锥内部的直角三角形从底面中心连到一条底边的中点，长度是边长的一半。若用整条边长 $12$，算出的斜高就偏长了。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const uz = zhUnits[u]!;
          const [a, b, c] = pickTriple(rng, 30);
          if (rng.bool()) {
            const want = rng.pick(["l", "h", "r"] as const);
            const [r, h, l] = [a, b, c];
            const names = { l: t("slant height", "母线长"), h: t("height", "高"), r: t("radius", "底面半径") };
            const given = (["r", "h", "l"] as const).filter((k) => k !== want);
            const value = { r, h, l };
            const known = given.map((k) => t(`${names[k].en} $${value[k]}$ ${u}`, `${names[k]["zh-CN"]}为 $${value[k]}$ ${uz}`));
            const leg = want === "h" ? r : h;
            const lines =
              want === "l"
                ? [`l^2 = ${r}^2 + ${h}^2 = ${r * r} + ${h * h} = ${l * l}`, `l = \\sqrt{${l * l}} = ${l}`]
                : [
                    `${want}^2 = ${l}^2 - ${leg}^2 = ${l * l} - ${leg * leg} = ${value[want] ** 2}`,
                    `${want} = \\sqrt{${value[want] ** 2}} = ${value[want]}`,
                  ];
            return valued(
              [
                `A right cone has ${known[0]!.en} and ${known[1]!.en}. Find its ${names[want].en}.`,
                `一个直圆锥的${known[0]!["zh-CN"]}，${known[1]!["zh-CN"]}。求它的${names[want]["zh-CN"]}。`,
              ],
              value[want],
              [
                [
                  ["Find the right triangle", "找出直角三角形"],
                  [
                    "The radius, the height and the slant height form a right triangle with the slant height as hypotenuse.",
                    "底面半径、高和母线构成一个直角三角形，母线是斜边。",
                  ],
                ],
                [
                  ["Use the theorem", "用勾股定理"],
                  want === "l"
                    ? ["Add the squares of the legs:", "把两条直角边的平方相加："]
                    : ["Subtract the square of the known leg from the square of the slant height:", "用母线的平方减去已知直角边的平方："],
                  lines,
                ],
              ],
              [
                `Square back: $${r}^2 + ${h}^2 = ${r * r} + ${h * h} = ${l * l} = ${l}^2$.`,
                `平方回去：$${r}^2 + ${h}^2 = ${r * r} + ${h * h} = ${l * l} = ${l}^2$。`,
              ],
              want === "l"
                ? [
                    [
                      r + h,
                      "That adds the legs; add their squares, then take the square root.",
                      "这是把两条直角边相加了；应该把它们的平方相加，再开平方。",
                    ],
                    [l * l, "That is $l^2$; take its square root.", "这是 $l^2$；还要开平方。"],
                  ]
                : [
                    [
                      l - leg,
                      "That subtracts the lengths; subtract their squares, then take the square root.",
                      "这是把长度直接相减了；应该把平方相减，再开平方。",
                    ],
                    [value[want] ** 2, "That is the square of the answer; take its square root.", "这是答案的平方；还要开平方。"],
                    [
                      Math.round(Math.sqrt(l * l + leg * leg)),
                      "That adds the squares; the slant height is the hypotenuse, so subtract.",
                      "这是把平方相加了；母线是斜边，应该相减。",
                    ],
                  ],
              {
                unit: u,
                figure: fig(
                  coneMarks(r, h, {
                    r: want === "r" ? "?" : len3(r, u),
                    h: want === "h" ? "?" : len3(h, u),
                    l: want === "l" ? "?" : len3(l, u),
                  }),
                  "A right cone with its radius, height and slant height marked.",
                  "一个标出底面半径、高和母线的直圆锥。",
                ),
              },
            );
          }
          const [half, h, l] = [Math.min(a, b), Math.max(a, b), c];
          const s = 2 * half;
          const wantSlant = rng.bool();
          const full = wantSlant ? h * h + s * s : l * l - s * s;
          const whole: Off[] =
            full > 0 && isSquare(full)
              ? [
                  [
                    Math.sqrt(full),
                    "That uses the whole base side; the triangle inside reaches only half of it.",
                    "这是用了整条底边；内部的直角三角形只到底边的一半。",
                  ],
                ]
              : [];
          return valued(
            wantSlant
              ? [
                  `A pyramid has a square base with sides $${s}$ ${u} long, and its height is $${h}$ ${u}. Find its slant height, the height of each triangular face.`,
                  `一个棱锥的底面是边长为 $${s}$ ${uz}的正方形，高为 $${h}$ ${uz}。求它的斜高（每个侧面三角形的高）。`,
                ]
              : [
                  `A pyramid has a square base with sides $${s}$ ${u} long, and its slant height (the height of each triangular face) is $${l}$ ${u}. Find the height of the pyramid.`,
                  `一个棱锥的底面是边长为 $${s}$ ${uz}的正方形，斜高（每个侧面三角形的高）为 $${l}$ ${uz}。求棱锥的高。`,
                ],
            wantSlant ? l : h,
            [
              [
                ["Halve the base", "取底边的一半"],
                [
                  "The right triangle inside runs from the center of the base to the middle of a base edge, which is half a side:",
                  "内部的直角三角形从底面中心连到一条底边的中点，这段长是边长的一半：",
                ],
                [`${s} \\div 2 = ${half}`],
              ],
              [
                ["Use the theorem", "用勾股定理"],
                wantSlant
                  ? ["The slant height is the hypotenuse, so add the squares of the legs:", "斜高是斜边，所以把两条直角边的平方相加："]
                  : ["The slant height is the hypotenuse, so subtract the square of the half side:", "斜高是斜边，所以减去半边长的平方："],
                wantSlant
                  ? [`l^2 = ${h}^2 + ${half}^2 = ${h * h} + ${half * half} = ${l * l}`, `l = \\sqrt{${l * l}} = ${l}`]
                  : [`h^2 = ${l}^2 - ${half}^2 = ${l * l} - ${half * half} = ${h * h}`, `h = \\sqrt{${h * h}} = ${h}`],
              ],
            ],
            [
              `Square back: $${h}^2 + ${half}^2 = ${h * h} + ${half * half} = ${l * l} = ${l}^2$.`,
              `平方回去：$${h}^2 + ${half}^2 = ${h * h} + ${half * half} = ${l * l} = ${l}^2$。`,
            ],
            [
              ...whole,
              wantSlant
                ? [
                    h + half,
                    "That adds the lengths; add their squares, then take the square root.",
                    "这是把长度直接相加了；应该把平方相加，再开平方。",
                  ]
                : [
                    l - half,
                    "That subtracts the lengths; subtract their squares, then take the square root.",
                    "这是把长度直接相减了；应该把平方相减，再开平方。",
                  ],
              [wantSlant ? l * l : h * h, "That is the square of the answer; take its square root.", "这是答案的平方；还要开平方。"],
            ],
            {
              unit: u,
              figure: fig(
                pyramidMarks(s, s, h, { l: len3(s, u), h: wantSlant ? len3(h, u) : "?", s: wantSlant ? "?" : len3(l, u) }),
                "A pyramid on a square base with its height and slant height marked.",
                "一个底面为正方形的棱锥，标出了高和斜高。",
              ),
            },
          );
        },
        drawn(gradeDrawings3["applying-the-pythagorean-theorem-to-three-dimensional-figures#heights-and-slant-heights"]),
      ),
      lesson(
        "the-longest-rod-in-a-cylinder",
        ["The longest rod in a cylinder", "圆柱内的最长直棒"],
        [
          [
            "The longest straight rod that fits inside a cylinder runs from a point on the bottom rim to the opposite point on the top rim. It is the hypotenuse of a right triangle whose legs are the **diameter** of the base and the height. A can with radius $3$ cm and height $8$ cm has diameter $6$ cm, so it holds a rod of length $\\sqrt{6^2 + 8^2} = \\sqrt{100} = 10$ cm.",
            "能放进圆柱内的最长直棒，从底面圆周上的一点通到顶面圆周上相对的点。它是一个直角三角形的斜边，两条直角边是底面的**直径**和高。半径 $3$ 厘米、高 $8$ 厘米的罐子，直径为 $6$ 厘米，能放下长 $\\sqrt{6^2 + 8^2} = \\sqrt{100} = 10$ 厘米的直棒。",
          ],
          ["Square back: $10^2 = 100 = 36 + 64$.", "平方回去：$10^2 = 100 = 36 + 64$。"],
          [
            "Use the diameter, not the radius: the rod crosses the whole base. With the radius, $\\sqrt{9 + 64} \\approx 8.5$ cm is too short.",
            "要用直径而不是半径：直棒横跨整个底面。若用半径，$\\sqrt{9 + 64} \\approx 8.5$ 厘米就偏短了。",
          ],
        ],
        (rng) => {
          for (;;) {
            const exact = rng.bool();
            const giveRadius = rng.bool(0.6);
            let width: number;
            let h: number;
            if (exact) [width, h] = pickTriple(rng, 30);
            else [width, h] = [2 * rng.int(1, 6), rng.int(3, 15)];
            if (giveRadius && width % 2 === 1) continue;
            const n = width * width + h * h;
            if (!exact && isSquare(n)) continue;
            const r = width / 2;
            const u = pickUnit(rng);
            const uz = zhUnits[u]!;
            const ask: Pair = giveRadius
              ? [
                  `A cylinder has radius $${r}$ ${u} and height $${h}$ ${u}. What is the length of the longest straight rod that fits inside it?`,
                  `一个圆柱的底面半径为 $${r}$ ${uz}，高为 $${h}$ ${uz}。能放进圆柱内的最长直棒有多长？`,
                ]
              : [
                  `A cylinder has diameter $${width}$ ${u} and height $${h}$ ${u}. What is the length of the longest straight rod that fits inside it?`,
                  `一个圆柱的底面直径为 $${width}$ ${uz}，高为 $${h}$ ${uz}。能放进圆柱内的最长直棒有多长？`,
                ];
            const walk: Walk[] = [
              [
                ["Find the right triangle", "找出直角三角形"],
                giveRadius
                  ? [
                      "The rod runs from the bottom rim to the opposite point of the top rim, so its legs are the height and the diameter, twice the radius:",
                      "直棒从底面圆周通到顶面圆周上相对的点，所以两条直角边是高和直径，直径是半径的两倍：",
                    ]
                  : [
                      "The rod runs from the bottom rim to the opposite point of the top rim, so its legs are the diameter and the height.",
                      "直棒从底面圆周通到顶面圆周上相对的点，所以两条直角边是直径和高。",
                    ],
                giveRadius ? [`2r = 2 \\cdot ${r} = ${width}`] : [],
              ],
              [
                ["Use the theorem", "用勾股定理"],
                ["The rod is the hypotenuse:", "直棒是斜边："],
                [`x^2 = ${width}^2 + ${h}^2 = ${width * width} + ${h * h} = ${n}`, ...(exact ? [rootLine("x", n)] : [])],
              ],
              ...(exact ? [] : [simplestStep("x", n)]),
            ];
            const check: Pair = [
              `Square back: $${squareBack(n)}$, which is $${width}^2 + ${h}^2$.`,
              `平方回去：$${squareBack(n)}$，正是 $${width}^2 + ${h}^2$。`,
            ];
            const [w, hh] = fitBox([width, h]) as [number, number];
            const figure = fig(
              [
                ...cylinderMarks(r, h, giveRadius ? { r: len3(r, u), h: len3(h, u) } : { d: len3(width, u), h: len3(h, u) }),
                { kind: "segment", a: [-w / 2, 0], b: [w / 2, hh], accent: true },
              ],
              "A cylinder with a rod from the bottom rim to the opposite point of the top rim.",
              "一个圆柱，其中一根直棒从底面圆周通到顶面圆周上相对的点。",
            );
            const radiusN = r * r + h * h;
            const radius: Pair = ["That uses the radius; the rod crosses the whole diameter.", "这是用了半径；直棒横跨整条直径。"];
            const adds: Pair = [
              "That adds the lengths; add their squares, then take the square root.",
              "这是把长度直接相加了；应该把平方相加，再开平方。",
            ];
            if (exact)
              return valued(
                ask,
                Math.sqrt(n),
                walk,
                check,
                [
                  [width + h, ...adds],
                  [n, "That is $x^2$; take its square root.", "这是 $x^2$；还要开平方。"],
                  ...(isSquare(radiusN) ? ([[Math.sqrt(radiusN), ...radius]] satisfies Off[]) : []),
                ],
                { unit: u, figure },
              );
            return rooted(
              [`${ask[0]} Give your answer in simplest radical form.`, `${ask[1]}答案写成最简根式。`],
              rootOf(n),
              walk,
              check,
              [
                [rootTex(radiusN), ...radius],
                [`${width + h}`, ...adds],
              ],
              figure,
            );
          }
        },
        drawn(gradeDrawings3["applying-the-pythagorean-theorem-to-three-dimensional-figures#the-longest-rod-in-a-cylinder"]),
      ),
    ],
  ),
  [
    "Will a $13$-cm straw fit inside a box $3$ cm by $4$ cm by $12$ cm with the lid closed?",
    "一根 $13$ 厘米长的吸管，能放进一个 $3$ 厘米 × $4$ 厘米 × $12$ 厘米、盖上盖子的盒子里吗？",
  ],
  [
    "Just: the floor's diagonal is $\\sqrt{9 + 16} = 5$ cm, and the box's diagonal is $\\sqrt{25 + 144} = 13$ cm.",
    "正好放得下：底面对角线是 $\\sqrt{9 + 16} = 5$ 厘米，盒子的对角线是 $\\sqrt{25 + 144} = 13$ 厘米。",
  ],
  [
    "find right triangles inside boxes, cones, pyramids and cylinders, and use them for diagonals, heights and slant heights.",
    "在长方体、圆锥、棱锥和圆柱中找出直角三角形，用它们求对角线、高和斜高。",
  ],
);

// ---------------------------------------------------------------------------
// Real-world problems with volumes

/** Round is a round solid: a cylinder, a cone, a sphere or a hemisphere, with its radius and height. */
interface Round {
  readonly kind: "cylinder" | "cone" | "sphere" | "hemisphere";
  readonly r: number;
  readonly h: number;
}

/** volume is the volume of a round solid divided by π. */
function volume(s: Round): Q {
  const [r, h] = [Q.of(s.r), Q.of(s.h)];
  if (s.kind === "cylinder") return r.mul(r).mul(h);
  if (s.kind === "cone") return r.mul(r).mul(h).div(Q.of(3));
  return r
    .mul(r)
    .mul(r)
    .mul(Q.of(s.kind === "sphere" ? 4 : 2, 3));
}

/** careless is the volume divided by π that a student gets by leaving out the fraction in the formula. */
function careless(s: Round): Q {
  const [r, h] = [Q.of(s.r), Q.of(s.h)];
  if (s.kind === "cylinder" || s.kind === "cone") return r.mul(r).mul(h);
  return r
    .mul(r)
    .mul(r)
    .mul(Q.of(s.kind === "sphere" ? 4 : 2));
}

/** volumeLine computes the volume of a round solid in terms of π, in one line. */
function volumeLine(v: string, s: Round): string {
  const out = piTex(volume(s));
  if (s.kind === "cylinder") return `${v} = \\pi r^2 h = \\pi \\cdot ${s.r}^2 \\cdot ${s.h} = ${out}`;
  if (s.kind === "cone") return `${v} = \\tfrac{1}{3}\\pi r^2 h = \\tfrac{1}{3}\\pi \\cdot ${s.r}^2 \\cdot ${s.h} = ${out}`;
  if (s.kind === "sphere") return `${v} = \\tfrac{4}{3}\\pi r^3 = \\tfrac{4}{3}\\pi \\cdot ${s.r}^3 = ${out}`;
  return `${v} = \\tfrac{2}{3}\\pi r^3 = \\tfrac{2}{3}\\pi \\cdot ${s.r}^3 = ${out}`;
}

/** FillStory fills a large round container with a small round scoop. */
interface FillStory {
  readonly big: Round["kind"];
  readonly small: Round["kind"];
  readonly unit: string;
  readonly ask: (big: Round, small: Round) => Text;
}

const fillStories: readonly FillStory[] = [
  {
    big: "cylinder",
    small: "cone",
    unit: "cm",
    ask: (b, s) =>
      t(
        `A cylindrical tank has radius $${b.r}$ cm and height $${b.h}$ cm. It is filled with water using a cone-shaped cup with radius $${s.r}$ cm and height $${s.h}$ cm. How many full cups does it take to fill the tank?`,
        `一个圆柱形水箱的底面半径为 $${b.r}$ 厘米，高为 $${b.h}$ 厘米。用一个底面半径为 $${s.r}$ 厘米、高为 $${s.h}$ 厘米的圆锥形杯子往水箱里装水。装满水箱需要多少满杯水？`,
      ),
  },
  {
    big: "cylinder",
    small: "sphere",
    unit: "cm",
    ask: (b, s) =>
      t(
        `A cylindrical tub of ice cream has radius $${b.r}$ cm and height $${b.h}$ cm. Each scoop of ice cream is a sphere with radius $${s.r}$ cm. How many scoops does a full tub hold?`,
        `一个圆柱形冰淇淋桶的底面半径为 $${b.r}$ 厘米，高为 $${b.h}$ 厘米。每个冰淇淋球是半径为 $${s.r}$ 厘米的球。一满桶冰淇淋能挖出多少个冰淇淋球？`,
      ),
  },
  {
    big: "sphere",
    small: "cylinder",
    unit: "in",
    ask: (b, s) =>
      t(
        `A spherical fish bowl has radius $${b.r}$ in. It is filled with water using a cylindrical cup with radius $${s.r}$ in and height $${s.h}$ in. How many full cups does it take to fill the bowl?`,
        `一个球形鱼缸的半径为 $${b.r}$ 英寸。用一个底面半径为 $${s.r}$ 英寸、高为 $${s.h}$ 英寸的圆柱形杯子往鱼缸里装水。装满鱼缸需要多少满杯水？`,
      ),
  },
  {
    big: "hemisphere",
    small: "cone",
    unit: "cm",
    ask: (b, s) =>
      t(
        `A bowl is a hemisphere with radius $${b.r}$ cm. It is filled with water using a cone-shaped cup with radius $${s.r}$ cm and height $${s.h}$ cm. How many full cups does it take to fill the bowl?`,
        `一个碗是半径为 $${b.r}$ 厘米的半球。用一个底面半径为 $${s.r}$ 厘米、高为 $${s.h}$ 厘米的圆锥形杯子往碗里装水。装满这个碗需要多少满杯水？`,
      ),
  },
];

/** solidName names a round solid in a solution. */
const solidNames: Record<Round["kind"], Text> = {
  cylinder: t("cylinder", "圆柱"),
  cone: t("cone", "圆锥"),
  sphere: t("sphere", "球"),
  hemisphere: t("hemisphere", "半球"),
};

/** Composite is a solid made of round parts, with the figure and the formulas that go with it. */
interface Composite {
  readonly unit: string;
  readonly parts: (r: number, h: number, h2: number) => readonly Round[];
  readonly wrong: (r: number, h: number, h2: number) => readonly Off[];
  readonly ask: (r: number, h: number, h2: number) => Text;
  readonly marks: (r: number, h: number, h2: number) => Mark[];
}

/** rim draws a circle seen from slightly above at height y: the front half solid, the back half dashed. */
const rim = (y: number, r: number): Mark[] => [
  ...arc(0, y, r, 0.28 * r, Math.PI, 2 * Math.PI, false),
  ...arc(0, y, r, 0.28 * r, 0, Math.PI, true),
];

/** dome draws the outline of a hemisphere of radius r on the circle at height y, bulging up or down. */
const dome = (y: number, r: number, up: boolean): Mark[] => arc(0, y, r, r, up ? 0 : Math.PI, up ? Math.PI : 2 * Math.PI, false);

/** radiusMarks marks a radius at height y. */
const radiusMarks = (y: number, r: number, text: string): Mark[] => [
  { kind: "segment", a: [0, y], b: [r, y], accent: true },
  { kind: "dot", at: [0, y] },
  { kind: "label", at: [r / 2, y], text, dir: "n" },
];

const q = (n: number, d = 1) => Q.of(n, d);

const composites: readonly Composite[] = [
  {
    unit: "m",
    parts: (r, h) => [
      { kind: "cylinder", r, h },
      { kind: "hemisphere", r, h: 0 },
    ],
    wrong: (r, h) => [
      [
        q(r * r * h).add(q(4 * r ** 3, 3)),
        "That puts a whole sphere on top; the roof is a hemisphere, half of one.",
        "这是在顶上放了一个整球；顶部是半球，只是球的一半。",
      ],
      [q(r * r * h), "That leaves out the hemisphere on top.", "这是漏掉了顶上的半球。"],
      [q(r * r * h + 2 * r ** 3), "That leaves the two thirds out of the hemisphere's volume.", "这是漏掉了半球体积公式中的三分之二。"],
    ],
    ask: (r, h) =>
      t(
        `A grain silo is a cylinder with a hemisphere on top. The cylinder has radius $${r}$ m and height $${h}$ m. Find the volume of the silo.`,
        `一个粮仓由一个圆柱和顶上的一个半球组成。圆柱的底面半径为 $${r}$ 米，高为 $${h}$ 米。求粮仓的体积。`,
      ),
    marks: (r, h) => [
      ...rim(0, r),
      { kind: "segment", a: [-r, 0], b: [-r, h] },
      { kind: "segment", a: [r, 0], b: [r, h] },
      ...rim(h, r),
      ...dome(h, r, true),
      ...radiusMarks(h, r, `${r} m`),
      { kind: "side", a: [r, 0], b: [r, h], text: `${h} m` },
    ],
  },
  {
    unit: "cm",
    parts: (r, h) => [
      { kind: "cone", r, h },
      { kind: "hemisphere", r, h: 0 },
    ],
    wrong: (r, h) => [
      [q(r * r * h).add(q(2 * r ** 3, 3)), "That leaves the one third out of the cone's volume.", "这是漏掉了圆锥体积公式中的三分之一。"],
      [
        q(r * r * h, 3).add(q(4 * r ** 3, 3)),
        "That puts a whole sphere on top; the ice cream on top is a hemisphere.",
        "这是在顶上放了一个整球；顶上的冰淇淋是半球。",
      ],
      [q(r * r * h, 3), "That leaves out the hemisphere of ice cream on top.", "这是漏掉了顶上的半球形冰淇淋。"],
    ],
    ask: (r, h) =>
      t(
        `An ice cream cone is a cone with radius $${r}$ cm and height $${h}$ cm, filled with ice cream and topped with a hemisphere of ice cream with the same radius. Find the total volume of the ice cream.`,
        `一个冰淇淋甜筒是底面半径为 $${r}$ 厘米、高为 $${h}$ 厘米的圆锥，里面装满冰淇淋，顶上还有一个半径相同的半球形冰淇淋。求冰淇淋的总体积。`,
      ),
    marks: (r, h) => [
      { kind: "segment", a: [-r, 0], b: [0, -h] },
      { kind: "segment", a: [r, 0], b: [0, -h] },
      ...rim(0, r),
      ...dome(0, r, true),
      ...radiusMarks(0, r, `${r} cm`),
      { kind: "segment", a: [0, 0], b: [0, -h], dashed: true, accent: true },
      { kind: "label", at: [0, -h / 3], text: `${h} cm`, dir: "e" },
    ],
  },
  {
    unit: "mm",
    parts: (r, h) => [
      { kind: "cylinder", r, h },
      { kind: "sphere", r, h: 0 },
    ],
    wrong: (r, h) => [
      [
        q(r * r * h).add(q(2 * r ** 3, 3)),
        "That counts only one hemisphere; the capsule has one on each end.",
        "这是只算了一个半球；胶囊两端各有一个。",
      ],
      [
        q(r * r * h).add(q(8 * r ** 3, 3)),
        "That puts a whole sphere on each end; each end is a hemisphere.",
        "这是在两端各放了一个整球；每一端都是半球。",
      ],
      [q(r * r * h), "That leaves out the two rounded ends.", "这是漏掉了两端的半球。"],
    ],
    ask: (r, h) =>
      t(
        `A capsule is a cylinder with a hemisphere on each end. The cylinder has radius $${r}$ mm and length $${h}$ mm. Find the volume of the capsule.`,
        `一粒胶囊由一个圆柱和两端各一个半球组成。圆柱的底面半径为 $${r}$ 毫米，长为 $${h}$ 毫米。求胶囊的体积。`,
      ),
    marks: (r, h) => [
      ...dome(0, r, false),
      ...rim(0, r),
      { kind: "segment", a: [-r, 0], b: [-r, h] },
      { kind: "segment", a: [r, 0], b: [r, h] },
      ...rim(h, r),
      ...dome(h, r, true),
      ...radiusMarks(h, r, `${r} mm`),
      { kind: "side", a: [r, 0], b: [r, h], text: `${h} mm` },
    ],
  },
  {
    unit: "m",
    parts: (r, h, h2) => [
      { kind: "cylinder", r, h },
      { kind: "cone", r, h: h2 },
    ],
    wrong: (r, h, h2) => [
      [
        q(r * r * (h + h2)),
        "That treats the cone as a cylinder; a cone holds one third as much.",
        "这是把圆锥当成了圆柱；圆锥的体积只有同底等高圆柱的三分之一。",
      ],
      [
        q(r * r * h, 3).add(q(r * r * h2, 3)),
        "That treats the cylinder as a cone; only the cone takes one third.",
        "这是把圆柱当成了圆锥；只有圆锥要乘三分之一。",
      ],
      [q(r * r * h), "That leaves out the cone on top.", "这是漏掉了顶上的圆锥。"],
    ],
    ask: (r, h, h2) =>
      t(
        `A tower is a cylinder with a cone on top. Both have radius $${r}$ m. The cylinder is $${h}$ m tall and the cone is $${h2}$ m tall. Find the volume of the tower.`,
        `一座塔由一个圆柱和顶上的一个圆锥组成，两者的底面半径都是 $${r}$ 米。圆柱高 $${h}$ 米，圆锥高 $${h2}$ 米。求塔的体积。`,
      ),
    marks: (r, h, h2) => [
      ...rim(0, r),
      { kind: "segment", a: [-r, 0], b: [-r, h] },
      { kind: "segment", a: [r, 0], b: [r, h] },
      ...rim(h, r),
      { kind: "segment", a: [-r, h], b: [0, h + h2] },
      { kind: "segment", a: [r, h], b: [0, h + h2] },
      ...radiusMarks(0, r, `${r} m`),
      { kind: "side", a: [r, 0], b: [r, h], text: `${h} m` },
      { kind: "segment", a: [0, h], b: [0, h + h2], dashed: true, accent: true },
      { kind: "label", at: [0, h + h2 / 2], text: `${h2} m`, dir: "e" },
    ],
  },
];

/** RateStory fills a round container at a steady rate. */
interface RateStory {
  readonly kind: Round["kind"];
  readonly unit: "ft" | "m";
  readonly ask: (size: Text, h: number, k: number) => Text;
}

const rateStories: readonly RateStory[] = [
  {
    kind: "cylinder",
    unit: "ft",
    ask: (size, h, k) =>
      t(
        `A cylindrical tank has ${size.en} and height $${h}$ ft. Water flows in at $${k}$ cubic feet per minute. How many minutes does it take to fill the empty tank?`,
        `一个圆柱形水箱的${size["zh-CN"]}，高为 $${h}$ 英尺。水以每分钟 $${k}$ 立方英尺的速度流入。把空水箱注满需要多少分钟？`,
      ),
  },
  {
    kind: "cone",
    unit: "m",
    ask: (size, h, k) =>
      t(
        `A cone-shaped hopper, point down, has ${size.en} and height $${h}$ m. Grain pours in at $${k}$ cubic meters per minute. How many minutes does it take to fill the empty hopper?`,
        `一个尖端朝下的圆锥形料斗，${size["zh-CN"]}，高为 $${h}$ 米。谷物以每分钟 $${k}$ 立方米的速度倒入。把空料斗装满需要多少分钟？`,
      ),
  },
  {
    kind: "sphere",
    unit: "ft",
    ask: (size) => t(`A spherical tank has ${size.en}.`, `一个球形储罐的${size["zh-CN"]}。`),
  },
];

const roundMinute = t(" Use $3.14$ for $\\pi$ and round to the nearest minute.", "取 $\\pi$ 为 $3.14$，结果四舍五入到整数分钟。");

const solvingRealWorldVolumeProblems = withIntro(
  topic(
    "solving-real-world-problems-involving-volumes-of-cylinders-cones-and-spheres",
    t("Solving Real-World Problems Involving Volumes of Cylinders, Cones, and Spheres", "解决圆柱、圆锥和球体积的实际问题"),
    t(
      "Use the volumes of cylinders, cones and spheres to count how many times one container fills another, to find the volume of composite solids and to find filling times.",
      "利用圆柱、圆锥和球的体积，求一个容器能装满另一个容器多少次、组合体的体积以及注满所需的时间。",
    ),
    ["volumes-of-right-cones", "volumes-of-spheres"],
    ["8.G.C.9"],
    [
      lesson(
        "filling-one-container-with-another",
        ["Filling one container with another", "用一个容器装满另一个容器"],
        [
          [
            "To find how many full scoops fill a container, divide the container's volume by the scoop's volume. Leave both in terms of $\\pi$: the $\\pi$'s cancel. A cylindrical tank with radius $6$ and height $10$ holds $360\\pi$. A cone-shaped cup with radius $2$ and height $6$ holds $\\tfrac{1}{3}\\pi \\cdot 2^2 \\cdot 6 = 8\\pi$. It takes $360\\pi \\div 8\\pi = 45$ cups.",
            "要求装满一个容器需要多少满勺（杯），就用容器的体积除以勺（杯）的体积。两个体积都保留 $\\pi$，相除时 $\\pi$ 约掉。底面半径 $6$、高 $10$ 的圆柱形水箱容积为 $360\\pi$；底面半径 $2$、高 $6$ 的圆锥形杯子容积为 $\\tfrac{1}{3}\\pi \\cdot 2^2 \\cdot 6 = 8\\pi$。需要 $360\\pi \\div 8\\pi = 45$ 杯。",
          ],
          [
            "Multiply back: $45$ cups of $8\\pi$ make $45 \\times 8\\pi = 360\\pi$, the tank.",
            "乘回去：$45$ 杯、每杯 $8\\pi$，共 $45 \\times 8\\pi = 360\\pi$，正是水箱的容积。",
          ],
          [
            "Remember the one third for a cone and the four thirds for a sphere. Without the one third, the cup would seem three times as big, and the count would be a third of the truth.",
            "别忘了圆锥的三分之一和球的三分之四。漏掉三分之一，杯子就好像大了三倍，算出的杯数只有实际的三分之一。",
          ],
        ],
        (rng) => {
          const story = rng.pick(fillStories);
          for (;;) {
            const big: Round = { kind: story.big, r: rng.int(3, 12), h: rng.int(4, 20) };
            const small: Round = { kind: story.small, r: rng.int(1, 4), h: rng.int(2, 8) };
            if (small.r >= big.r) continue;
            const [vb, vs] = [volume(big), volume(small)];
            const n = vb.div(vs);
            if (!n.isInteger() || n.toNumber() < 4 || n.toNumber() > 150) continue;
            const [bn, sn] = [solidNames[big.kind], solidNames[small.kind]];
            const [bf, sf] = [fractionWords[big.kind], fractionWords[small.kind]];
            const offs: Off[] = [
              ...(bf[0]
                ? ([
                    [
                      careless(big).div(vs),
                      `That leaves the ${bf[0]} out of the ${bn.en}'s volume.`,
                      `这是漏掉了${bn["zh-CN"]}体积公式中的${bf[1]}。`,
                    ],
                  ] satisfies Off[])
                : []),
              ...(sf[0]
                ? ([
                    [
                      vb.div(careless(small)),
                      `That leaves the ${sf[0]} out of the ${sn.en}'s volume.`,
                      `这是漏掉了${sn["zh-CN"]}体积公式中的${sf[1]}。`,
                    ],
                  ] satisfies Off[])
                : []),
              ...(bf[0] && sf[0]
                ? ([
                    [
                      careless(big).div(careless(small)),
                      "That leaves the fractions out of both volumes.",
                      "这是两个体积公式中的分数都漏掉了。",
                    ],
                  ] satisfies Off[])
                : []),
            ];
            if ([careless(big).div(vs), vb.div(careless(small))].every((w) => w.eq(n))) continue;
            return valued(
              [story.ask(big, small).en, story.ask(big, small)["zh-CN"]],
              n,
              [
                [["Find the large volume", "求大容器的体积"], [`The ${bn.en} holds:`, `${bn["zh-CN"]}的容积：`], [volumeLine("V_1", big)]],
                [
                  ["Find the small volume", "求小容器的体积"],
                  [`The ${sn.en} holds:`, `${sn["zh-CN"]}的容积：`],
                  [volumeLine("V_2", small)],
                ],
                [
                  ["Divide", "相除"],
                  [
                    "The number of fills is the large volume divided by the small one; the $\\pi$'s cancel:",
                    "装满的次数是大容积除以小容积，$\\pi$ 约掉：",
                  ],
                  [`${piTex(vb)} \\div ${piTex(vs)} = ${n.toLatex()}`],
                ],
              ],
              [
                `Multiply back: $${n.toLatex()} \\times ${piPlain(vs)} = ${piPlain(vb)}$, the volume of the ${bn.en}.`,
                `乘回去：$${n.toLatex()} \\times ${piPlain(vs)} = ${piPlain(vb)}$，正是${bn["zh-CN"]}的容积。`,
              ],
              offs,
            );
          }
        },
        drawn(
          gradeDrawings5["solving-real-world-problems-involving-volumes-of-cylinders-cones-and-spheres#filling-one-container-with-another"],
        ),
      ),
      lesson(
        "volumes-of-composite-solids",
        ["Volumes of composite solids", "组合体的体积"],
        [
          [
            "A composite solid is made of simpler solids. Find the volume of each part and add. A silo is a cylinder with radius $3$ m and height $10$ m topped by a hemisphere with radius $3$ m: $\\pi \\cdot 3^2 \\cdot 10 + \\tfrac{2}{3}\\pi \\cdot 3^3 = 90\\pi + 18\\pi = 108\\pi$ m³. A hemisphere is half a sphere, so its volume is $\\tfrac{2}{3}\\pi r^3$; two hemispheres make a whole sphere.",
            "组合体由几个简单立体组成。分别求出每部分的体积，再相加。一个粮仓由底面半径 $3$ 米、高 $10$ 米的圆柱和顶上半径 $3$ 米的半球组成：$\\pi \\cdot 3^2 \\cdot 10 + \\tfrac{2}{3}\\pi \\cdot 3^3 = 90\\pi + 18\\pi = 108\\pi$ 立方米。半球是球的一半，体积为 $\\tfrac{2}{3}\\pi r^3$；两个半球合成一个整球。",
          ],
          [
            "Each part counts once: the cylinder and the hemisphere share only a flat circle, which has no volume, so $90\\pi + 18\\pi$ is the whole silo.",
            "每部分只算一次：圆柱和半球只共用一个平的圆面，它没有体积，所以 $90\\pi + 18\\pi$ 就是整个粮仓。",
          ],
          [
            "The top of the silo is a hemisphere, not a whole sphere: a whole sphere would give $36\\pi$, twice too much.",
            "粮仓的顶部是半球，不是整球：用整球会得到 $36\\pi$，多了一倍。",
          ],
        ],
        (rng) => {
          const c = rng.pick(composites);
          const r = rng.int(2, 6);
          const h = rng.int(r + 1, 3 * r);
          const h2 = rng.int(r, 2 * r);
          const parts = c.parts(r, h, h2);
          const total = parts.reduce((s, p) => s.add(volume(p)), Q.zero);
          const ask = c.ask(r, h, h2);
          const names = parts.map((p) => solidNames[p.kind]);
          const sphere = parts[1]!.kind === "sphere";
          const [n0, n1] = [names[0]!, sphere ? t("two hemispheres, which make a sphere", "两个半球（合成一个球）") : names[1]!];
          return pied(
            [`${ask.en} ${inPi.en}`, `${ask["zh-CN"]}${inPi["zh-CN"]}`],
            total,
            [
              [
                ["Split the solid", "拆分组合体"],
                [
                  `The solid is a ${n0.en} and ${sphere ? "" : "a "}${n1.en}:`,
                  `这个立体由一个${n0["zh-CN"]}和${sphere ? "" : "一个"}${n1["zh-CN"]}组成：`,
                ],
                parts.map((p, i) => volumeLine(`V_${i + 1}`, p)),
              ],
              [
                ["Add", "相加"],
                ["The volume of the solid is the sum of the parts:", "组合体的体积是各部分体积之和："],
                [`V = ${parts.map((p) => piTex(volume(p))).join(" + ")} = ${piTex(total)}`],
              ],
            ],
            [
              `Each part counts once: the parts share only flat circles, which have no volume, so $${parts.map((p) => piPlain(volume(p))).join(" + ")}$ is the whole solid.`,
              `每部分只算一次：各部分只共用平的圆面，圆面没有体积，所以 $${parts.map((p) => piPlain(volume(p))).join(" + ")}$ 就是整个立体。`,
            ],
            c.wrong(r, h, h2),
            fig(c.marks(r, h, h2), "A composite solid made of round parts.", "一个由圆形立体组成的组合体。"),
          );
        },
        drawn(gradeDrawings3["solving-real-world-problems-involving-volumes-of-cylinders-cones-and-spheres#volumes-of-composite-solids"]),
      ),
      lesson(
        "filling-times",
        ["Filling times", "注满所需的时间"],
        [
          [
            "When a container fills at a steady rate, the time to fill it is its volume divided by the rate. Read the dimensions carefully: if the diameter is given, halve it to get the radius. A cylindrical tank with diameter $6$ ft and height $10$ ft has radius $3$ ft and volume $\\pi \\cdot 3^2 \\cdot 10 = 90\\pi \\approx 282.6$ ft³. At $9$ cubic feet per minute it fills in $282.6 \\div 9 \\approx 31$ minutes.",
            "当容器以恒定的速度被注满时，所需时间等于体积除以速度。仔细读题中的尺寸：若给出的是直径，要先除以 $2$ 得到半径。直径 $6$ 英尺、高 $10$ 英尺的圆柱形水箱，半径为 $3$ 英尺，体积为 $\\pi \\cdot 3^2 \\cdot 10 = 90\\pi \\approx 282.6$ 立方英尺。以每分钟 $9$ 立方英尺的速度注水，约需 $282.6 \\div 9 \\approx 31$ 分钟。",
          ],
          [
            "Multiply back: in $31$ minutes, $31 \\times 9 = 279$ cubic feet flow in, close to the volume $282.6$.",
            "乘回去：$31$ 分钟内流入 $31 \\times 9 = 279$ 立方英尺，接近体积 $282.6$。",
          ],
          [
            "Using the diameter $6$ as the radius gives four times the volume, and about $126$ minutes instead of $31$.",
            "若把直径 $6$ 当作半径，体积会变成四倍，时间约为 $126$ 分钟，而不是 $31$ 分钟。",
          ],
        ],
        (rng) => {
          const story = rng.pick(rateStories);
          for (;;) {
            // Radii of spheres are multiples of 3, and cones have r²h divisible by 3, so that the volume is a whole number times π.
            const r = story.kind === "sphere" ? rng.pick([3, 6]) : rng.int(2, 8);
            const h = story.kind === "sphere" ? 0 : rng.int(3, 15);
            const solid: Round = { kind: story.kind, r, h };
            const coef = volume(solid);
            if (!coef.isInteger()) continue;
            const k = rng.int(2, 12);
            const diameter = rng.bool(0.4);
            const u = story.unit;
            const uz = zhUnits[u]!;
            const minutes = (c: Q) => Math.round((c.toNumber() * 3.14) / k);
            const answer = minutes(coef);
            if (answer < 3 || answer > 400) continue;
            const size = diameter
              ? t(`diameter $${2 * r}$ ${u}`, `直径为 $${2 * r}$ ${uz}`)
              : t(`radius $${r}$ ${u}`, `半径为 $${r}$ ${uz}`);
            const sizeZh = story.kind === "sphere" ? size : t(size.en, `底面${size["zh-CN"]}`);
            const base = story.ask(sizeZh, h, k);
            const rate =
              story.kind === "sphere"
                ? t(
                    ` It is filled with water at $${k}$ cubic feet per minute. How many minutes does it take to fill the empty tank?`,
                    `以每分钟 $${k}$ 立方英尺的速度往空储罐里注水。注满需要多少分钟？`,
                  )
                : t("", "");
            const wide: Round = { ...solid, r: 2 * r };
            const v = Q.of(Math.round(coef.toNumber() * 314), 100);
            const decVolume = dec(v);
            const fw = fractionWords[story.kind];
            const name = solidNames[story.kind];
            return valued(
              [base.en + rate.en + roundMinute.en, base["zh-CN"] + rate["zh-CN"] + roundMinute["zh-CN"]],
              answer,
              [
                ...(diameter
                  ? ([
                      [
                        ["Halve the diameter", "把直径减半"],
                        ["The formula uses the radius:", "公式用的是半径："],
                        [`r = ${2 * r} \\div 2 = ${r}`],
                      ],
                    ] satisfies Walk[])
                  : []),
                [
                  ["Find the volume", "求体积"],
                  ["Use the formula, then $3.14$ for $\\pi$:", "代入公式，再取 $\\pi$ 为 $3.14$："],
                  [volumeLine("V", solid), `V \\approx ${coef.toString()} \\times 3.14 = ${decVolume}`],
                ],
                [
                  ["Divide by the rate", "除以速度"],
                  ["The time is the volume divided by the volume that flows in each minute:", "时间等于体积除以每分钟流入的体积："],
                  [`t = ${decVolume} \\div ${k} \\approx ${answer}`],
                ],
              ],
              [
                `Multiply back: in $${answer}$ minutes, $${answer} \\times ${k} = ${answer * k}$ cubic ${u === "ft" ? "feet" : "meters"} flow in, close to the volume $${decVolume}$.`,
                `乘回去：$${answer}$ 分钟内流入 $${answer} \\times ${k} = ${answer * k}$ 立方${uz}，接近体积 $${decVolume}$。`,
              ],
              [
                ...(fw[0]
                  ? ([
                      [
                        minutes(careless(solid)),
                        `That leaves the ${fw[0]} out of the ${name.en}'s volume.`,
                        `这是漏掉了${name["zh-CN"]}体积公式中的${fw[1]}。`,
                      ],
                    ] satisfies Off[])
                  : []),
                ...(diameter
                  ? ([
                      [
                        minutes(volume(wide)),
                        "That uses the diameter as the radius; halve it first.",
                        "这是把直径当成了半径；要先除以 2。",
                      ],
                    ] satisfies Off[])
                  : []),
                [
                  Math.round(v.toNumber()),
                  "That is the volume; divide it by the rate to get the time.",
                  "这是体积；还要除以速度才得到时间。",
                ],
                [
                  Math.round(coef.toNumber() / k),
                  "That leaves out $\\pi$; multiply by $3.14$ before dividing.",
                  "这是漏掉了 $\\pi$；相除之前要乘 $3.14$。",
                ],
              ],
              { unit: "min" },
            );
          }
        },
        fig(
          cylinderMarks(3, 10, { d: "6 ft", h: "10 ft" }),
          "A cylindrical tank with diameter 6 ft and height 10 ft.",
          "一个直径 6 英尺、高 10 英尺的圆柱形水箱。",
        ),
      ),
    ],
  ),
  [
    "How many cone-shaped cups of radius $2$ cm and height $6$ cm does it take to fill a cylindrical tank of radius $6$ cm and height $10$ cm?",
    "用底面半径 $2$ 厘米、高 $6$ 厘米的圆锥形杯子，装满底面半径 $6$ 厘米、高 $10$ 厘米的圆柱形水箱，需要多少杯？",
  ],
  [
    "The tank holds $360\\pi$ and a cup holds $8\\pi$, so it takes $360 \\div 8 = 45$ cups.",
    "水箱容积为 $360\\pi$，一杯为 $8\\pi$，所以需要 $360 \\div 8 = 45$ 杯。",
  ],
  [
    "use the volumes of cylinders, cones and spheres to count how many fills a container takes, to add up composite solids and to find filling times.",
    "利用圆柱、圆锥和球的体积，求装满一个容器需要多少次、求组合体的体积，并求注满所需的时间。",
  ],
);

/** grade8PythagoreanTopics are the topics of 8th Grade Math, Unit 8, that other courses do not already have. */
export const grade8PythagoreanTopics: readonly TopicDef[] = [
  theConverseOfThePythagoreanTheorem,
  understandingAndProvingThePythagoreanTheorem,
  solvingRealWorldProblemsUsingThePythagoreanTheorem,
  findingTheDistanceBetweenTwoPoints,
  applyingThePythagoreanTheoremInThreeDimensions,
  solvingRealWorldVolumeProblems,
];
