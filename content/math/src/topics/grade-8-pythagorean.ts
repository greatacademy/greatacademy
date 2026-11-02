import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import { dec, type Mark, type PlaneMark, type PlaneView, type Point, plane, Q, radical, sketch } from "@ga/subject-math";

import { choiceProblem, numberProblem, pointLatex, radicalProblem, steps, yesNo } from "../problems.ts";
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

/** yesNoProblem asks a yes-or-no question, with Yes always first. */
const yesNoProblem = (prompt: Text, yes: boolean, solution: Text, figure?: Figure): Problem => ({
  ...choiceProblem({ prompt, options: yesNo, correct: yes ? 0 : 1, solution }),
  ...(figure && { figure }),
});

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

/** converseLines compares the square of the longest side with the sum of the squares of the other two. */
function converseLines([x, y, z]: readonly [Len, Len, Len]): string {
  const sum = x.sq.add(y.sq);
  const rel = sum.eq(z.sq) ? "=" : "\\ne";
  const lines = [`${squared(x)} + ${squared(y)} = ${qTex(x.sq)} + ${qTex(y.sq)} = ${qTex(sum)}`, `${squared(z)} = ${qTex(z.sq)}`];
  return steps(...lines, ...(rel === "=" ? [] : [`${qTex(sum)} \\ne ${qTex(z.sq)}`]));
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

const theConverseOfThePythagoreanTheorem = topic(
  "the-converse-of-the-pythagorean-theorem",
  t("The Converse of the Pythagorean Theorem", "勾股定理的逆定理"),
  t(
    "Use the converse of the Pythagorean theorem to decide whether a triangle is a right triangle and where its right angle is.",
    "用勾股定理的逆定理判断三角形是否为直角三角形，并找出直角的位置。",
  ),
  ["the-pythagorean-theorem"],
  ["8.G.B.6"],
  [
    {
      id: "is-it-a-right-triangle",
      title: t("Is it a right triangle?", "是直角三角形吗？"),
      explanation: t(
        "The **converse of the Pythagorean theorem**: if the square of the longest side of a triangle equals the sum of the squares of the other two sides, the triangle is a right triangle. If the two are not equal, it is not a right triangle.\n\nAlways test with the longest side. When some sides are decimals or radicals, square every side first: the largest square belongs to the longest side.\n\nSides $1.5$, $2.5$ and $2$: the longest side is $2.5$, and $1.5^2 + 2^2 = 2.25 + 4 = 6.25 = 2.5^2$, so the triangle is a right triangle.",
        "**勾股定理的逆定理**：若三角形最长边的平方等于另两边的平方和，则这个三角形是直角三角形；若两者不相等，它就不是直角三角形。\n\n一定要用最长边来检验。若有的边是小数或根式，先把每条边平方：平方最大的就是最长边。\n\n三边为 $1.5$、$2.5$、$2$：最长边是 $2.5$，$1.5^2 + 2^2 = 2.25 + 4 = 6.25 = 2.5^2$，所以这是直角三角形。",
      ),
      generate(rng) {
        const right = rng.bool();
        const sides = sideSet(rng, right);
        const shown = listTex(rng.shuffle(sides.map((s) => s.tex)));
        const z = sides[2].tex;
        return yesNoProblem(
          t(
            `A triangle has sides of lengths ${shown.en}. Is it a right triangle?`,
            `一个三角形的三边长为 ${shown["zh-CN"]}。它是直角三角形吗？`,
          ),
          right,
          t(
            `The longest side is $${z}$. Compare its square with the sum of the squares of the other two sides:${converseLines(sides)}${right ? "They are equal, so by the converse of the Pythagorean theorem the triangle is a right triangle." : "They are not equal, so the triangle is not a right triangle."}`,
            `最长边是 $${z}$。把它的平方与另两边的平方和比较：${converseLines(sides)}${right ? "两者相等，由勾股定理的逆定理，这是直角三角形。" : "两者不相等，所以这不是直角三角形。"}`,
          ),
        );
      },
    },
    {
      id: "which-angle-is-the-right-angle",
      title: t("Which angle is the right angle?", "哪个角是直角？"),
      explanation: t(
        "When the converse shows that a triangle is a right triangle, its right angle is the angle **opposite the longest side**, the hypotenuse. It is not at either end of that side.\n\nIn triangle $ABC$ with $AB = 5$, $BC = 13$ and $AC = 12$: $5^2 + 12^2 = 25 + 144 = 169 = 13^2$, so the triangle is a right triangle. The longest side is $BC$, and the angle opposite it is $\\angle A$, so $\\angle A$ is the right angle.",
        "当逆定理说明一个三角形是直角三角形时，它的直角是**最长边（斜边）所对的角**，而不在这条边的两个端点处。\n\n在三角形 $ABC$ 中，$AB = 5$，$BC = 13$，$AC = 12$：$5^2 + 12^2 = 25 + 144 = 169 = 13^2$，所以这是直角三角形。最长边是 $BC$，它所对的角是 $\\angle A$，所以 $\\angle A$ 是直角。",
      ),
      generate(rng) {
        const letters = rng.pick(triangleNames).split("");
        const sides = sideSet(rng, true);
        const opp = rng.int(0, 2);
        const seg = (i: number) => letters.filter((_, j) => j !== i).join("");
        const [l1, l2] = rng.shuffle([sides[0], sides[1]]);
        const others = [0, 1, 2].filter((i) => i !== opp);
        const len = (i: number) => (i === opp ? sides[2] : i === others[0] ? l1! : l2!).tex;
        // The segments in the order AB, BC, AC are opposite C, A and B.
        const [s2, s0, s1] = [seg(2), seg(0), seg(1)];
        const name = letters.join("");
        return choiceProblem({
          prompt: t(
            `In triangle $${name}$, $${s2} = ${len(2)}$, $${s0} = ${len(0)}$ and $${s1} = ${len(1)}$. Which angle is a right angle?`,
            `在三角形 $${name}$ 中，$${s2} = ${len(2)}$，$${s0} = ${len(0)}$，$${s1} = ${len(1)}$。哪个角是直角？`,
          ),
          options: letters.map((l) => same(`$\\angle ${l}$`)),
          correct: opp,
          solution: t(
            `The longest side is $${seg(opp)}$. Check the converse:${converseLines(sides)}They are equal, so the triangle is a right triangle. Its right angle is opposite the longest side $${seg(opp)}$: it is $\\angle ${letters[opp]}$.`,
            `最长边是 $${seg(opp)}$。用逆定理检验：${converseLines(sides)}两者相等，所以这是直角三角形。直角是最长边 $${seg(opp)}$ 所对的角，即 $\\angle ${letters[opp]}$。`,
          ),
        });
      },
    },
    {
      id: "which-set-forms-a-right-triangle",
      title: t("Which set forms a right triangle?", "哪组数能构成直角三角形？"),
      explanation: t(
        "To find which set of lengths forms a right triangle, test each set with the converse, always using its longest length.\n\nMultiplying the sides of a right triangle by the same number gives another right triangle: $6$, $8$, $10$ works because $36 + 64 = 100$. Adding the same number to each side does not: for $4$, $5$, $6$, $16 + 25 = 41 \\ne 36$.",
        "要找出哪组长度能构成直角三角形，就用逆定理逐组检验，每次都用该组中最长的长度。\n\n把直角三角形的三边都乘同一个数，得到的仍是直角三角形：$6$、$8$、$10$ 可以，因为 $36 + 64 = 100$。但把三边都加上同一个数就不行：对 $4$、$5$、$6$，$16 + 25 = 41 \\ne 36$。",
      ),
      generate(rng) {
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
          const shown = sets.map((w, i) => {
            const v = w.map((x) => dec(Q.of(x, d)));
            return `- ${numerals[i]}: ${listTex(v).en}`;
          });
          const shownZh = sets.map((w, i) => `- ${numerals[i]}：${listTex(w.map((x) => dec(Q.of(x, d))))["zh-CN"]}`);
          const lines = steps(...sets.map((w, i) => `\\text{${numerals[i]}: } ${setLine(w, d)}`));
          return choiceProblem({
            prompt: t(
              `Which set of side lengths forms a right triangle?\n\n${shown.join("\n")}`,
              `哪组边长能构成直角三角形？\n\n${shownZh.join("\n")}`,
            ),
            options: numerals.map((n) => same(n)),
            correct,
            solution: t(
              `Test each set with the converse, using its longest length:${lines}Only set ${numerals[correct]} forms a right triangle.`,
              `用逆定理逐组检验，每次都用该组中最长的长度：${lines}只有第 ${numerals[correct]} 组能构成直角三角形。`,
            ),
          });
        }
      },
    },
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

const understandingAndProvingThePythagoreanTheorem = topic(
  "understanding-and-proving-the-pythagorean-theorem",
  t("Understanding and Proving the Pythagorean Theorem", "理解并证明勾股定理"),
  t(
    "See the Pythagorean theorem as a statement about the areas of squares on the sides, and prove it by cutting and rearranging squares.",
    "把勾股定理看作关于三边上正方形面积的结论，并通过分割、拼接正方形来证明它。",
  ),
  ["the-pythagorean-theorem"],
  ["8.G.B.6"],
  [
    {
      id: "squares-on-the-sides",
      title: t("Squares on the sides", "三边上的正方形"),
      explanation: t(
        "Draw a square on each side of a right triangle. The square on a side of length $a$ has area $a^2$, so the Pythagorean theorem says: **the area of the square on the hypotenuse equals the sum of the areas of the squares on the legs.**\n\nIf the squares on the legs have areas $9$ and $16$, the square on the hypotenuse has area $9 + 16 = 25$, and the hypotenuse is $\\sqrt{25} = 5$ long.",
        "在直角三角形的每条边上各画一个正方形。边长为 $a$ 的边上的正方形面积是 $a^2$，所以勾股定理说的是：**斜边上的正方形面积等于两条直角边上的正方形面积之和。**\n\n若两条直角边上的正方形面积为 $9$ 和 $16$，则斜边上的正方形面积为 $9 + 16 = 25$，斜边长为 $\\sqrt{25} = 5$。",
      ),
      generate(rng) {
        const ask = rng.pick(["hyp", "hyp", "leg", "side"] as const);
        if (ask === "side") {
          const [a, b, c] = pickTriple(rng, 20);
          return {
            ...numberProblem({
              prompt: t(
                "Squares are drawn on the two legs of a right triangle, and their areas are shown. How long is the hypotenuse of the triangle?",
                "在直角三角形的两条直角边上各画一个正方形，图中标出了它们的面积。三角形的斜边有多长？",
              ),
              answer: c,
              form: "integer",
              wrong: [c * c, a + b],
              solution: t(
                `The square on the hypotenuse has area $${a * a} + ${b * b} = ${c * c}$, so the hypotenuse is $\\sqrt{${c * c}} = ${c}$ long.`,
                `斜边上的正方形面积为 $${a * a} + ${b * b} = ${c * c}$，所以斜边长为 $\\sqrt{${c * c}} = ${c}$。`,
              ),
            }),
            figure: squaresFigure(
              rng,
              a,
              b,
              [`${a * a}`, "", `${b * b}`],
              `A right triangle with squares on its sides; the squares on the legs have areas ${a * a} and ${b * b}.`,
              `一个三边上画有正方形的直角三角形，两条直角边上的正方形面积为 ${a * a} 和 ${b * b}。`,
            ),
          };
        }
        for (;;) {
          const [p, q] = [rng.int(4, 80), rng.int(4, 80)];
          if (p === q || Math.max(p, q) > 3 * Math.min(p, q)) continue;
          const hyp = ask === "hyp";
          const labels: [string, string, string] = hyp ? [`${p}`, "A", `${q}`] : [`${p}`, `${p + q}`, "A"];
          return {
            ...numberProblem({
              prompt: t(
                "Squares are drawn on the sides of a right triangle. Two of their areas are shown. Find the area $A$ of the third square.",
                "在直角三角形的三条边上各画一个正方形，图中标出了其中两个的面积。求第三个正方形的面积 $A$。",
              ),
              answer: hyp ? p + q : q,
              form: "integer",
              wrong: hyp ? [Math.abs(p - q)] : [2 * p + q],
              solution: hyp
                ? t(
                    `$A$ is the square on the hypotenuse, so it is the sum of the squares on the legs: $A = ${p} + ${q} = ${p + q}$.`,
                    `$A$ 是斜边上的正方形，它等于两条直角边上的正方形面积之和：$A = ${p} + ${q} = ${p + q}$。`,
                  )
                : t(
                    `$${p + q}$ is the square on the hypotenuse, and it is the sum of the squares on the legs: $${p} + A = ${p + q}$, so $A = ${p + q} - ${p} = ${q}$.`,
                    `$${p + q}$ 是斜边上的正方形面积，它等于两条直角边上的正方形面积之和：$${p} + A = ${p + q}$，所以 $A = ${p + q} - ${p} = ${q}$。`,
                  ),
            }),
            figure: squaresFigure(
              rng,
              Math.sqrt(p),
              Math.sqrt(q),
              labels,
              `A right triangle with a square on each side, labeled with areas ${labels.join(", ")}.`,
              `一个每条边上都画有正方形的直角三角形，正方形的面积分别标为 ${labels.join("、")}。`,
            ),
          };
        }
      },
    },
    {
      id: "the-rearrangement-proof",
      title: t("The rearrangement proof", "拼图证明"),
      explanation: t(
        "Place four copies of a right triangle with legs $a$ and $b$ and hypotenuse $c$ in the corners of a square of side $a + b$. The space left in the middle is a square of side $c$. So\n\n$$c^2 = (a + b)^2 - 4 \\cdot \\tfrac{1}{2}ab.$$\n\nWith $a = 3$ and $b = 4$: the large square has area $7^2 = 49$, the four triangles have area $4 \\cdot \\tfrac{1}{2} \\cdot 3 \\cdot 4 = 24$, and the middle square has area $49 - 24 = 25 = 3^2 + 4^2$. The same happens for any legs, which proves $a^2 + b^2 = c^2$.",
        "把四个直角边为 $a$、$b$、斜边为 $c$ 的直角三角形放在边长为 $a + b$ 的正方形的四个角上，中间剩下的是一个边长为 $c$ 的正方形。所以\n\n$$c^2 = (a + b)^2 - 4 \\cdot \\tfrac{1}{2}ab.$$\n\n当 $a = 3$、$b = 4$ 时：大正方形面积为 $7^2 = 49$，四个三角形面积为 $4 \\cdot \\tfrac{1}{2} \\cdot 3 \\cdot 4 = 24$，中间正方形面积为 $49 - 24 = 25 = 3^2 + 4^2$。对任意直角边都是如此，这就证明了 $a^2 + b^2 = c^2$。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(1, 9);
          const b = rng.int(1, 9);
          if (a === b || Math.max(a, b) > 3 * Math.min(a, b)) continue;
          const s = a + b;
          if (rng.bool(0.65))
            return {
              ...numberProblem({
                prompt: t(
                  "Four copies of a right triangle are placed in the corners of a square, as shown. Find the area of the tilted square in the middle.",
                  "如图，把四个全等的直角三角形放在一个正方形的四个角上。求中间倾斜的正方形的面积。",
                ),
                answer: a * a + b * b,
                form: "integer",
                wrong: [s * s - 4 * a * b, s * s - a * b, s * s],
                solution: t(
                  `The large square has side $${a} + ${b} = ${s}$, so its area is $${s}^2 = ${s * s}$. Each triangle has area $\\tfrac{1}{2} \\cdot ${a} \\cdot ${b}$, so the four triangles have area $4 \\cdot \\tfrac{1}{2} \\cdot ${a} \\cdot ${b} = ${2 * a * b}$. The middle square is what is left: $${s * s} - ${2 * a * b} = ${a * a + b * b}$. (This is $${a}^2 + ${b}^2$: the square on the hypotenuse.)`,
                  `大正方形边长为 $${a} + ${b} = ${s}$，面积为 $${s}^2 = ${s * s}$。每个三角形面积为 $\\tfrac{1}{2} \\cdot ${a} \\cdot ${b}$，四个三角形面积为 $4 \\cdot \\tfrac{1}{2} \\cdot ${a} \\cdot ${b} = ${2 * a * b}$。中间的正方形就是剩下的部分：$${s * s} - ${2 * a * b} = ${a * a + b * b}$。（它等于 $${a}^2 + ${b}^2$，即斜边上的正方形。）`,
                ),
              }),
              figure: frameFigure(a, b, true),
            };
          const [big, mid] = [s * s, a * a + b * b];
          return {
            ...numberProblem({
              prompt: t(
                `Four copies of a right triangle are placed in the corners of a square, as shown. The large square has area $${big}$, and the tilted square in the middle has area $${mid}$. Find the area of one triangle.`,
                `如图，把四个全等的直角三角形放在一个正方形的四个角上。大正方形的面积为 $${big}$，中间倾斜的正方形面积为 $${mid}$。求一个三角形的面积。`,
              ),
              answer: Q.of(big - mid, 4),
              wrong: [big - mid, Q.of(big - mid, 2), big + mid],
              solution: t(
                `The four triangles fill the large square apart from the middle square, so together they have area $${big} - ${mid} = ${big - mid}$. One triangle has area $${big - mid} \\div 4 = ${Q.of(big - mid, 4).toLatex()}$.`,
                `四个三角形填满了大正方形中除中间正方形以外的部分，所以它们的面积之和为 $${big} - ${mid} = ${big - mid}$。一个三角形的面积为 $${big - mid} \\div 4 = ${Q.of(big - mid, 4).toLatex()}$。`,
              ),
            }),
            figure: frameFigure(a, b, false),
          };
        }
      },
    },
    {
      id: "the-inner-square-proof",
      title: t("The inner-square proof", "弦图证明"),
      explanation: t(
        "A square of side $c$ can be cut into four copies of a right triangle with legs $a < b$ and hypotenuse $c$, plus a small square in the middle. The side of the small square is the difference of the legs, $b - a$. Adding the pieces,\n\n$$c^2 = 4 \\cdot \\tfrac{1}{2}ab + (b - a)^2.$$\n\nWith legs $3$ and $5$: the small square has side $2$ and area $4$, the four triangles have area $4 \\cdot \\tfrac{1}{2} \\cdot 3 \\cdot 5 = 30$, and $c^2 = 30 + 4 = 34 = 3^2 + 5^2$.",
        "边长为 $c$ 的正方形可以分成四个直角边为 $a < b$、斜边为 $c$ 的全等直角三角形，以及中间的一个小正方形。小正方形的边长是两条直角边之差 $b - a$。把各部分加起来：\n\n$$c^2 = 4 \\cdot \\tfrac{1}{2}ab + (b - a)^2.$$\n\n当直角边为 $3$ 和 $5$ 时：小正方形边长为 $2$，面积为 $4$；四个三角形面积为 $4 \\cdot \\tfrac{1}{2} \\cdot 3 \\cdot 5 = 30$；所以 $c^2 = 30 + 4 = 34 = 3^2 + 5^2$。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(1, 8);
          const b = rng.int(a + 1, 12);
          if (b > 4 * a || 4 * (b - a) < b || b - a < 2) continue;
          const [side, four] = [b - a, 2 * a * b];
          const intro = t(
            "The large square below is made of four copies of a right triangle and a small square in the middle.",
            "下图中的大正方形由四个全等的直角三角形和中间的一个小正方形组成。",
          );
          const figure = pinwheelFigure(a, b);
          if (rng.bool(0.4))
            return {
              ...numberProblem({
                prompt: t(`${intro.en} Find the area of the small square.`, `${intro["zh-CN"]}求小正方形的面积。`),
                answer: side * side,
                form: "integer",
                wrong: [b * b - a * a, side, (a + b) ** 2],
                solution: t(
                  `The long leg of each triangle is made of a short leg and a side of the small square, so the small square has side $${b} - ${a} = ${side}$ and area $${side}^2 = ${side * side}$.`,
                  `每个三角形的长直角边由一条短直角边和小正方形的一条边组成，所以小正方形边长为 $${b} - ${a} = ${side}$，面积为 $${side}^2 = ${side * side}$。`,
                ),
              }),
              figure,
            };
          return {
            ...numberProblem({
              prompt: t(`${intro.en} Find the area of the large square.`, `${intro["zh-CN"]}求大正方形的面积。`),
              answer: a * a + b * b,
              form: "integer",
              wrong: [2 * four + side * side, a * b + side * side, (a + b) ** 2],
              solution: t(
                `The small square has side $${b} - ${a} = ${side}$, so its area is $${side * side}$. The four triangles have area $4 \\cdot \\tfrac{1}{2} \\cdot ${a} \\cdot ${b} = ${four}$. Together: $${four} + ${side * side} = ${a * a + b * b}$, which is $${a}^2 + ${b}^2$.`,
                `小正方形边长为 $${b} - ${a} = ${side}$，面积为 $${side * side}$。四个三角形面积为 $4 \\cdot \\tfrac{1}{2} \\cdot ${a} \\cdot ${b} = ${four}$。合起来：$${four} + ${side * side} = ${a * a + b * b}$，正好是 $${a}^2 + ${b}^2$。`,
              ),
            }),
            figure,
          };
        }
      },
    },
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
            `A $${v.hyp}$-${u} ladder leans against a wall with its foot $${v.run}$ ${u} from the wall. How high up the wall does the ladder reach?`,
            `一架长 $${v.hyp}$ ${uz}的梯子靠在墙上，梯脚离墙 $${v.run}$ ${uz}。梯子顶端离地面多高？`,
          )
        : want === "run"
          ? t(
              `A $${v.hyp}$-${u} ladder leans against a wall and reaches $${v.rise}$ ${u} up the wall. How far is the foot of the ladder from the wall?`,
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
            `A wire runs from the top of a $${v.rise}$-${u} pole to a stake in the ground $${v.run}$ ${u} from the foot of the pole. How long is the wire?`,
            `一根拉线从一根高 $${v.rise}$ ${uz}的电线杆顶端拉到地面上的木桩，木桩离杆脚 $${v.run}$ ${uz}。拉线有多长？`,
          )
        : want === "rise"
          ? t(
              `A $${v.hyp}$-${u} wire runs from the top of a pole to a stake in the ground $${v.run}$ ${u} from the foot of the pole. How tall is the pole?`,
              `一根长 $${v.hyp}$ ${uz}的拉线从电线杆顶端拉到地面上的木桩，木桩离杆脚 $${v.run}$ ${uz}。电线杆有多高？`,
            )
          : t(
              `A $${v.hyp}$-${u} wire runs from the top of a $${v.rise}$-${u} pole to a stake in the ground. How far is the stake from the foot of the pole?`,
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

/** rightSteps finds the unknown side x of a right triangle with legs p, q and hypotenuse c. */
function rightSteps(want: "leg0" | "leg1" | "hyp", r: RightValues): { answer: Q; wrong: Q[]; lines: string } {
  const [p, q] = r.legs;
  const c = r.hyp;
  if (want === "hyp") {
    const n = p * p + q * q;
    return {
      answer: rootValue(n),
      wrong: [Q.of(p + q), Q.of(n), ...(p !== q ? [rootValue(Math.abs(p * p - q * q))] : [])],
      lines: steps(`x^2 = ${p}^2 + ${q}^2 = ${p * p} + ${q * q} = ${n}`, rootResult("x", n)),
    };
  }
  const known = want === "leg0" ? q : p;
  const n = c * c - known * known;
  return {
    answer: rootValue(n),
    wrong: [rootValue(c * c + known * known), Q.of(c - known), Q.of(n)],
    lines: steps(`x^2 + ${known}^2 = ${c}^2`, `x^2 = ${c * c} - ${known * known} = ${n}`, rootResult("x", n)),
  };
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

const solvingRealWorldProblemsUsingThePythagoreanTheorem = topic(
  "solving-real-world-problems-using-the-pythagorean-theorem",
  t("Solving Real-World Problems Using the Pythagorean Theorem", "用勾股定理解决实际问题"),
  t(
    "Find the right triangle in a real-world situation (a ladder, a ramp, the diagonal of a rectangle, a shortcut) and use the Pythagorean theorem to find a length.",
    "在实际情境（梯子、斜坡、长方形的对角线、抄近路）中找出直角三角形，并用勾股定理求长度。",
  ),
  ["the-pythagorean-theorem"],
  ["8.G.B.7"],
  [
    {
      id: "ladders-ramps-and-wires",
      title: t("Ladders, ramps and wires", "梯子、斜坡和拉线"),
      explanation: t(
        "A ladder against a wall, a wire from the top of a pole, a kite string and a ramp each form a right triangle with the ground: the ground is one leg, the vertical height is the other, and the slanted object is the **hypotenuse**.\n\nDecide which side is unknown before you compute. A $10$-ft ladder whose foot is $6$ ft from a wall reaches $x$ ft up, where $x^2 + 6^2 = 10^2$: $x^2 = 100 - 36 = 64$, so $x = 8$ ft.",
        "靠在墙上的梯子、从电线杆顶端拉下的拉线、风筝线和斜坡，都与地面构成直角三角形：地面是一条直角边，竖直高度是另一条直角边，倾斜的物体是**斜边**。\n\n计算前先判断哪条边未知。一架 $10$ 英尺长的梯子，梯脚离墙 $6$ 英尺，它在墙上到达的高度 $x$ 满足 $x^2 + 6^2 = 10^2$：$x^2 = 100 - 36 = 64$，所以 $x = 8$ 英尺。",
      ),
      generate(rng) {
        const story = rng.pick(stories);
        const want = rng.pick(["run", "rise", "hyp"] as const);
        const u = rng.pick(story.units);
        const uz = zhUnits[u]!;
        const ok = (p: number, q: number) => (story.shape === "steep" ? q > p : story.shape === "gentle" ? q < p : true);
        const r = pickRight(rng, want === "hyp" ? "hyp" : want === "run" ? "leg0" : "leg1", 30, ok);
        const [run, rise] = r.legs;
        const v = { run: `${run}`, rise: `${rise}`, hyp: `${r.hyp}` };
        const { answer, wrong, lines } = rightSteps(want === "hyp" ? "hyp" : want === "run" ? "leg0" : "leg1", r);
        const ask = story.ask(want, v, u, uz);
        return {
          ...numberProblem({
            prompt: r.exact ? ask : t(ask.en + roundTenth.en, ask["zh-CN"] + roundTenth["zh-CN"]),
            answer,
            form: r.exact ? "integer" : "decimal",
            unit: u,
            wrong,
            solution: t(
              `${story.hyp.en} is the hypotenuse of a right triangle whose legs are the height and the distance along the ground. Call the unknown length $x$:${lines}`,
              `${story.hyp["zh-CN"]}是一个直角三角形的斜边，两条直角边是高度和地面上的距离。设未知长度为 $x$：${lines}`,
            ),
          }),
          figure: fig(
            rightMarks(rightTri(run, rise, { turn: 0, mirror: rng.bool() }), {
              sides: [wordLabel(run, u, want === "run"), wordLabel(r.hyp, u, want === "hyp"), wordLabel(rise, u, want === "rise")],
            }),
            "A right triangle formed by the ground, a vertical height and a slanted side.",
            "由地面、竖直高度和一条斜边构成的直角三角形。",
          ),
        };
      },
    },
    {
      id: "diagonals-of-rectangles",
      title: t("Diagonals of rectangles", "长方形的对角线"),
      explanation: t(
        "A diagonal cuts a rectangle into two right triangles. The length and the width are the legs, and the diagonal is the hypotenuse: $d^2 = w^2 + h^2$.\n\nA TV screen $48$ in wide and $20$ in tall has diagonal $d$ with $d^2 = 48^2 + 20^2 = 2304 + 400 = 2704$, so $d = 52$ in. To find a side from the diagonal, subtract: $h^2 = d^2 - w^2$.",
        "对角线把长方形分成两个直角三角形：长和宽是直角边，对角线是斜边：$d^2 = w^2 + h^2$。\n\n宽 $48$ 英寸、高 $20$ 英寸的电视屏幕，对角线 $d$ 满足 $d^2 = 48^2 + 20^2 = 2304 + 400 = 2704$，所以 $d = 52$ 英寸。由对角线求一边时用减法：$h^2 = d^2 - w^2$。",
      ),
      generate(rng) {
        const story = rng.pick(rectStories);
        const want = rng.pick(["w", "h", "d"] as const);
        const kind = want === "d" ? "hyp" : want === "w" ? "leg0" : "leg1";
        const ok = (w: number, h: number) => !story.wide || (w > h && w < 3 * h);
        const r = pickRight(rng, kind, story.max, ok);
        const [w, h] = r.legs;
        const { answer, wrong, lines } = rightSteps(kind, r);
        const ask = story.ask(want, w, h, r.hyp);
        const u = story.unit;
        return {
          ...numberProblem({
            prompt: r.exact ? ask : t(ask.en + roundTenth.en, ask["zh-CN"] + roundTenth["zh-CN"]),
            answer,
            form: r.exact ? "integer" : "decimal",
            unit: u,
            wrong,
            solution: t(
              `The diagonal is the hypotenuse of a right triangle whose legs are two sides of the rectangle. Call the unknown length $x$:${lines}`,
              `对角线是一个直角三角形的斜边，两条直角边是长方形的两条边。设未知长度为 $x$：${lines}`,
            ),
          }),
          figure: rectFigure(
            w,
            h,
            [wordLabel(w, u, want === "w"), wordLabel(h, u, want === "h"), wordLabel(r.hyp, u, want === "d")],
            "A rectangle with one diagonal drawn.",
            "一个画出一条对角线的长方形。",
          ),
        };
      },
    },
    {
      id: "shortcuts",
      title: t("Shortcuts", "抄近路"),
      explanation: t(
        "Going straight across a rectangle is shorter than going along two of its sides. The straight route is the hypotenuse of the right triangle whose legs are the two sides, so the distance saved is\n\n$$(a + b) - \\sqrt{a^2 + b^2}.$$\n\nAlong sides of $30$ m and $40$ m you walk $70$ m, but straight across you walk $\\sqrt{900 + 1600} = 50$ m, so you save $70 - 50 = 20$ m.",
        "直接斜穿长方形比沿两条边走要近。直线路线是以这两条边为直角边的直角三角形的斜边，所以少走的距离是\n\n$$(a + b) - \\sqrt{a^2 + b^2}.$$\n\n沿 $30$ 米和 $40$ 米的两条边要走 $70$ 米，而直接穿过只需走 $\\sqrt{900 + 1600} = 50$ 米，所以少走 $70 - 50 = 20$ 米。",
      ),
      generate(rng) {
        const story = rng.pick(shortcutStories);
        const r = pickRight(rng, "hyp", story.max, (p, q) => p > q);
        const [a, b] = r.legs;
        const n = a * a + b * b;
        const c = rootValue(n);
        const saved = Q.of(a + b).sub(c);
        const u = story.unit;
        const ask = story.ask(a, b);
        return {
          ...numberProblem({
            prompt: r.exact ? ask : t(ask.en + roundTenth.en, ask["zh-CN"] + roundTenth["zh-CN"]),
            answer: saved,
            form: r.exact ? "integer" : "decimal",
            unit: u,
            wrong: [c, Q.of(a + b), Q.of(a + b).add(c)],
            solution: t(
              `Along the two sides the trip is $${a} + ${b} = ${a + b}$ ${u}. The straight route is the hypotenuse:${steps(`x^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${n}`, rootResult("x", n))}The straight route is shorter by $${a + b} - ${qTex(c)} ${r.exact ? "=" : "\\approx"} ${qTex(saved)}$ ${u}.`,
              `沿两条边走的路程为 $${a} + ${b} = ${a + b}$ ${zhUnits[u]}。直线路线是斜边：${steps(`x^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${n}`, rootResult("x", n))}直线路线短 $${a + b} - ${qTex(c)} ${r.exact ? "=" : "\\approx"} ${qTex(saved)}$ ${zhUnits[u]}。`,
            ),
          }),
          figure: rectFigure(
            a,
            b,
            [`${a} ${u}`, `${b} ${u}`, "?"],
            "A rectangle with two sides and the diagonal between their ends.",
            "一个长方形，标出两条边和连接它们端点的对角线。",
          ),
        };
      },
    },
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

/** legLines finds the legs of the right triangle between two points. */
function legLines(p: XY, q: XY): string {
  return steps(
    `\\text{horizontal leg} = |${q[0]} - ${paren(p[0])}| = ${Math.abs(q[0] - p[0])}`,
    `\\text{vertical leg} = |${q[1]} - ${paren(p[1])}| = ${Math.abs(q[1] - p[1])}`,
  );
}

/** legLinesZh finds the legs of the right triangle between two points, in Chinese. */
function legLinesZh(p: XY, q: XY): string {
  return steps(
    `\\text{水平直角边} = |${q[0]} - ${paren(p[0])}| = ${Math.abs(q[0] - p[0])}`,
    `\\text{竖直直角边} = |${q[1]} - ${paren(p[1])}| = ${Math.abs(q[1] - p[1])}`,
  );
}

const findingTheDistanceBetweenTwoPoints = topic(
  "finding-the-distance-between-two-points-using-the-pythagorean-theorem",
  t("Finding the Distance Between Two Points Using the Pythagorean Theorem", "用勾股定理求两点间的距离"),
  t(
    "Find the distance between two points of the coordinate plane as the hypotenuse of a right triangle with a horizontal and a vertical leg.",
    "把坐标平面上两点间的距离看作一个直角三角形的斜边（两条直角边分别水平和竖直），并求出它。",
  ),
  ["the-pythagorean-theorem", "the-coordinate-plane"],
  ["8.G.B.8"],
  [
    {
      id: "distance-on-the-grid",
      title: t("Distance on the grid", "网格上的距离"),
      explanation: t(
        "To find the distance between two points that are not on the same horizontal or vertical line, draw a right triangle: a horizontal leg and a vertical leg meet at a corner, and the segment between the points is the hypotenuse. Count the length of each leg, then use the Pythagorean theorem.\n\nFrom $(1, 2)$ to $(4, 6)$ the legs are $3$ and $4$, so the distance is $\\sqrt{9 + 16} = 5$. The distance is not $3 + 4 = 7$: that is the length of the path along the legs.",
        "要求不在同一条水平线或竖直线上的两点间的距离，就画一个直角三角形：一条水平直角边和一条竖直直角边相交于一个顶点，两点间的线段是斜边。数出每条直角边的长度，再用勾股定理。\n\n从 $(1, 2)$ 到 $(4, 6)$，两条直角边为 $3$ 和 $4$，所以距离为 $\\sqrt{9 + 16} = 5$。距离不是 $3 + 4 = 7$，那是沿两条直角边走的路程。",
      ),
      generate(rng) {
        for (;;) {
          const [p, q, c] = pickTriple(rng, 15);
          const dx = rng.bool() ? p : -p;
          const dy = rng.bool() ? q : -q;
          const a: XY = [rng.int(-7, 7), rng.int(-7, 7)];
          const b: XY = [a[0] + dx, a[1] + dy];
          if (Math.abs(b[0]) > 7 || Math.abs(b[1]) > 7 || !offAxes([a, b])) continue;
          const [na, nb] = rng.pick(pointNames);
          return {
            ...numberProblem({
              prompt: t(`Find the distance between points $${na}$ and $${nb}$.`, `求点 $${na}$ 与点 $${nb}$ 之间的距离。`),
              answer: c,
              form: "integer",
              wrong: [p + q, c * c, Math.abs(p - q)],
              solution: t(
                `$${na}${pointLatex(a)}$ and $${nb}${pointLatex(b)}$ are the ends of the hypotenuse of a right triangle with a horizontal and a vertical leg:${legLines(a, b)}So the distance is${steps(`d^2 = ${p}^2 + ${q}^2 = ${p * p} + ${q * q} = ${c * c}`, `d = \\sqrt{${c * c}} = ${c}`)}`,
                `$${na}${pointLatex(a)}$ 和 $${nb}${pointLatex(b)}$ 是一个直角三角形斜边的两个端点，它的两条直角边分别水平和竖直：${legLinesZh(a, b)}所以距离为${steps(`d^2 = ${p}^2 + ${q}^2 = ${p * p} + ${q * q} = ${c * c}`, `d = \\sqrt{${c * c}} = ${c}`)}`,
              ),
            }),
            figure: graph(
              [
                { kind: "point", at: [a[0], a[1]], label: na, dir: "nw" },
                { kind: "point", at: [b[0], b[1]], label: nb, dir: "nw" },
              ],
              `Points ${na}${pointLatex(a)} and ${nb}${pointLatex(b)} in the coordinate plane.`,
              `坐标平面上的点 ${na}${pointLatex(a)} 和 ${nb}${pointLatex(b)}。`,
            ),
          };
        }
      },
    },
    {
      id: "distances-in-simplest-radical-form",
      title: t("Distances in simplest radical form", "最简根式形式的距离"),
      explanation: t(
        "You do not need a grid: the legs are the differences of the coordinates. From $(x_1, y_1)$ to $(x_2, y_2)$ the horizontal leg is $|x_2 - x_1|$ and the vertical leg is $|y_2 - y_1|$. Subtract the coordinates (do not add them), and take care with negative numbers.\n\nFrom $(-2, 3)$ to $(4, -1)$: the legs are $|4 - (-2)| = 6$ and $|-1 - 3| = 4$, so the distance is $\\sqrt{36 + 16} = \\sqrt{52} = 2\\sqrt{13}$.",
        "不画网格也可以：直角边就是坐标之差。从 $(x_1, y_1)$ 到 $(x_2, y_2)$，水平直角边为 $|x_2 - x_1|$，竖直直角边为 $|y_2 - y_1|$。要把坐标相减（而不是相加），并注意负数。\n\n从 $(-2, 3)$ 到 $(4, -1)$：直角边为 $|4 - (-2)| = 6$ 和 $|-1 - 3| = 4$，所以距离为 $\\sqrt{36 + 16} = \\sqrt{52} = 2\\sqrt{13}$。",
      ),
      generate(rng) {
        for (;;) {
          const a: XY = [rng.int(-9, 9), rng.int(-9, 9)];
          const b: XY = [rng.int(-9, 9), rng.int(-9, 9)];
          const [dx, dy] = [Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])];
          const n = dx * dx + dy * dy;
          if (dx === 0 || dy === 0 || isSquare(n) || n > 300) continue;
          if (a[0] >= 0 && a[1] >= 0 && b[0] >= 0 && b[1] >= 0) continue;
          const [na, nb] = rng.pick(pointNames);
          const added = (a[0] + b[0]) ** 2 + (a[1] + b[1]) ** 2;
          return radicalProblem({
            prompt: t(
              `Find the distance between $${na}${pointLatex(a)}$ and $${nb}${pointLatex(b)}$. Give your answer in simplest radical form.`,
              `求 $${na}${pointLatex(a)}$ 与 $${nb}${pointLatex(b)}$ 之间的距离。答案写成最简根式。`,
            ),
            answer: rootOf(n),
            wrong: [rootTex(added), `${dx + dy}`, ...(dx !== dy ? [rootTex(Math.abs(dx * dx - dy * dy))] : [])],
            solution: t(
              `The distance is the hypotenuse of a right triangle whose legs are the differences of the coordinates:${legLines(a, b)}${steps(`d^2 = ${dx}^2 + ${dy}^2 = ${dx * dx} + ${dy * dy} = ${n}`, rootLine("d", n))}`,
              `距离是一个直角三角形的斜边，两条直角边是坐标之差：${legLinesZh(a, b)}${steps(`d^2 = ${dx}^2 + ${dy}^2 = ${dx * dx} + ${dy * dy} = ${n}`, rootLine("d", n))}`,
            ),
          });
        }
      },
    },
    {
      id: "which-point-is-closer",
      title: t("Which point is closer?", "哪个点更近？"),
      explanation: t(
        "To compare distances from a point $P$, compare their squares $(\\text{horizontal leg})^2 + (\\text{vertical leg})^2$: the smaller square belongs to the shorter distance, so you do not need to take square roots.\n\nDo not compare the sums of the legs. From $P(0, 0)$, $A(5, 0)$ is $5$ away, while $B(3, 3)$ has legs adding to $6$ but is only $\\sqrt{18} \\approx 4.2$ away, so $B$ is closer.",
        "比较各点到点 $P$ 的距离时，可以比较它们的平方 $(\\text{水平直角边})^2 + (\\text{竖直直角边})^2$：平方越小，距离越短，不必开平方。\n\n不要比较两条直角边之和。从 $P(0, 0)$ 出发，$A(5, 0)$ 的距离是 $5$；$B(3, 3)$ 的两条直角边之和是 $6$，但距离只有 $\\sqrt{18} \\approx 4.2$，所以 $B$ 更近。",
      ),
      generate(rng) {
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
          const names = ["A", "B", "C"];
          const lines = pts.map((v, i) => `P${names[i]}^2 = ${Math.abs(v[0] - p[0])}^2 + ${Math.abs(v[1] - p[1])}^2 = ${sq[i]}`);
          const best = names[correct]!;
          return {
            ...choiceProblem({
              prompt: far
                ? t("Which point is farthest from $P$?", "哪个点离 $P$ 最远？")
                : t("Which point is closest to $P$?", "哪个点离 $P$ 最近？"),
              options: names.map((n) => t(`Point $${n}$`, `点 $${n}$`)),
              correct,
              solution: t(
                `Compare the squares of the distances, using the horizontal and vertical legs:${steps(...lines)}The ${far ? "largest" : "smallest"} is $P${best}^2 = ${sq[correct]}$, so point $${best}$ is ${far ? "farthest from" : "closest to"} $P$.`,
                `用水平和竖直直角边比较距离的平方：${steps(...lines)}${far ? "最大" : "最小"}的是 $P${best}^2 = ${sq[correct]}$，所以点 $${best}$ 离 $P$ ${far ? "最远" : "最近"}。`,
              ),
            }),
            figure: graph(
              [
                { kind: "point", at: [p[0], p[1]], label: "P", dir: "nw", accent: true },
                ...pts.map((v, i): PlaneMark => ({ kind: "point", at: [v[0], v[1]], label: names[i], dir: "nw" })),
              ],
              `Point P${pointLatex(p)} and points ${pts.map((v, i) => `${names[i]}${pointLatex(v)}`).join(", ")}.`,
              `点 P${pointLatex(p)} 以及点 ${pts.map((v, i) => `${names[i]}${pointLatex(v)}`).join("、")}。`,
            ),
          };
        }
      },
    },
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

const applyingThePythagoreanTheoremInThreeDimensions = topic(
  "applying-the-pythagorean-theorem-to-three-dimensional-figures",
  t("Applying the Pythagorean Theorem to Three-Dimensional Figures", "在立体图形中应用勾股定理"),
  t(
    "Find right triangles inside boxes, cones, pyramids and cylinders to compute diagonals, heights and slant heights.",
    "在长方体、圆锥、棱锥和圆柱中找出直角三角形，求对角线、高和斜高。",
  ),
  ["the-pythagorean-theorem"],
  ["8.G.B.7"],
  [
    {
      id: "the-diagonal-of-a-box",
      title: t("The diagonal of a box", "长方体的对角线"),
      explanation: t(
        "The diagonal of a box runs from a bottom corner to the opposite top corner. Find it in two steps:\n\n1. The diagonal $e$ of the bottom face: $e^2 = l^2 + w^2$.\n2. The diagonal $e$, the height $h$ and the box's diagonal $d$ form a right triangle standing up inside the box: $d^2 = e^2 + h^2$.\n\nFor a $3 \\times 4 \\times 12$ box: $e^2 = 9 + 16 = 25$, then $d^2 = 25 + 144 = 169$, so $d = 13$. The diagonal is the longest straight rod that fits inside the box.",
        "长方体的对角线从底面的一个顶点通到顶面上相对的顶点。分两步求：\n\n1. 底面的对角线 $e$：$e^2 = l^2 + w^2$。\n2. 对角线 $e$、高 $h$ 和长方体的对角线 $d$ 构成一个立在长方体内部的直角三角形：$d^2 = e^2 + h^2$。\n\n对于 $3 \\times 4 \\times 12$ 的长方体：$e^2 = 9 + 16 = 25$，再 $d^2 = 25 + 144 = 169$，所以 $d = 13$。这条对角线是能放进长方体内的最长直棒的长度。",
      ),
      generate(rng) {
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
          const ask = rod
            ? t(
                `A box is $${l}$ ${u} long, $${w}$ ${u} wide and $${h}$ ${u} tall. What is the length of the longest straight rod that fits inside the box?`,
                `一个长方体盒子长 $${l}$ ${zhUnits[u]}、宽 $${w}$ ${zhUnits[u]}、高 $${h}$ ${zhUnits[u]}。能放进盒子内的最长直棒有多长？`,
              )
            : t(
                "Find the length of the diagonal of the box shown, from a bottom corner to the opposite top corner.",
                "求图中长方体从底面一个顶点到顶面相对顶点的对角线长。",
              );
          const solution = t(
            `First find the diagonal $e$ of the bottom face, then use it as a leg with the height:${steps(`e^2 = ${l}^2 + ${w}^2 = ${l * l} + ${w * w} = ${base}`, `d^2 = e^2 + ${h}^2 = ${base} + ${h * h} = ${n}`, rootLine("d", n))}`,
            `先求底面的对角线 $e$，再把它和高作为两条直角边：${steps(`e^2 = ${l}^2 + ${w}^2 = ${l * l} + ${w * w} = ${base}`, `d^2 = e^2 + ${h}^2 = ${base} + ${h * h} = ${n}`, rootLine("d", n))}`,
          );
          const figure = fig(
            boxMarks(l, w, h, { l: len3(l, u), d: len3(w, u), h: len3(h, u) }, "space"),
            `A box ${l} by ${w} by ${h} ${u} with a diagonal from a bottom corner to the opposite top corner.`,
            `一个 ${l} × ${w} × ${h} ${zhUnits[u]}的长方体，画出从底面一个顶点到顶面相对顶点的对角线。`,
          );
          if (exact)
            return {
              ...numberProblem({
                prompt: ask,
                answer: Math.sqrt(n),
                form: "integer",
                unit: u,
                wrong: [l + w + h, n, ...(isSquare(base) ? [Math.sqrt(base)] : [])],
                solution,
              }),
              figure,
            };
          return {
            ...radicalProblem({
              prompt: t(`${ask.en} Give your answer in simplest radical form.`, `${ask["zh-CN"]}答案写成最简根式。`),
              answer: rootOf(n),
              wrong: [rootTex(base), `${l + w + h}`, rootTex(l * l + h * h)],
              solution,
            }),
            figure,
          };
        }
      },
    },
    {
      id: "heights-and-slant-heights",
      title: t("Heights and slant heights", "高和斜高"),
      explanation: t(
        "Inside a right cone, the height $h$, the radius $r$ and the slant height $l$ form a right triangle with the slant height as hypotenuse: $l^2 = r^2 + h^2$.\n\nInside a pyramid with a square base of side $s$, the height $h$, **half the base side** $\\tfrac{s}{2}$ and the slant height $l$ (the height of a triangular face) form a right triangle: $l^2 = h^2 + \\left(\\tfrac{s}{2}\\right)^2$. A pyramid with base side $12$ and height $8$ has $l^2 = 64 + 36 = 100$, so $l = 10$.",
        "在直圆锥内部，高 $h$、底面半径 $r$ 和母线 $l$ 构成直角三角形，母线是斜边：$l^2 = r^2 + h^2$。\n\n在底面是边长为 $s$ 的正方形的棱锥内部，高 $h$、**底边长的一半** $\\tfrac{s}{2}$ 和斜高 $l$（侧面三角形的高）构成直角三角形：$l^2 = h^2 + \\left(\\tfrac{s}{2}\\right)^2$。底边长 $12$、高 $8$ 的棱锥，$l^2 = 64 + 36 = 100$，所以 $l = 10$。",
      ),
      generate(rng) {
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
          const lines =
            want === "l"
              ? steps(`l^2 = ${r}^2 + ${h}^2 = ${r * r} + ${h * h} = ${l * l}`, `l = ${l}`)
              : want === "h"
                ? steps(`h^2 = ${l}^2 - ${r}^2 = ${l * l} - ${r * r} = ${h * h}`, `h = ${h}`)
                : steps(`r^2 = ${l}^2 - ${h}^2 = ${l * l} - ${h * h} = ${r * r}`, `r = ${r}`);
          return {
            ...numberProblem({
              prompt: t(
                `A right cone has ${known[0]!.en} and ${known[1]!.en}. Find its ${names[want].en}.`,
                `一个直圆锥的${known[0]!["zh-CN"]}，${known[1]!["zh-CN"]}。求它的${names[want]["zh-CN"]}。`,
              ),
              answer: value[want],
              form: "integer",
              unit: u,
              wrong:
                want === "l"
                  ? [r + h, l * l]
                  : [l - value[given[0] === "l" ? given[1]! : given[0]!], Math.round(Math.sqrt(l * l + (want === "h" ? r * r : h * h)))],
              solution: t(
                `The radius, the height and the slant height form a right triangle with the slant height as hypotenuse:${lines}`,
                `底面半径、高和母线构成一个直角三角形，母线是斜边：${lines}`,
              ),
            }),
            figure: fig(
              coneMarks(r, h, {
                r: want === "r" ? "?" : len3(r, u),
                h: want === "h" ? "?" : len3(h, u),
                l: want === "l" ? "?" : len3(l, u),
              }),
              "A right cone with its radius, height and slant height marked.",
              "一个标出底面半径、高和母线的直圆锥。",
            ),
          };
        }
        const [half, h, l] = [Math.min(a, b), Math.max(a, b), c];
        const s = 2 * half;
        const wantSlant = rng.bool();
        const lines = wantSlant
          ? steps(`\\tfrac{s}{2} = ${s} \\div 2 = ${half}`, `l^2 = ${h}^2 + ${half}^2 = ${h * h} + ${half * half} = ${l * l}`, `l = ${l}`)
          : steps(`\\tfrac{s}{2} = ${s} \\div 2 = ${half}`, `h^2 = ${l}^2 - ${half}^2 = ${l * l} - ${half * half} = ${h * h}`, `h = ${h}`);
        const full = wantSlant ? h * h + s * s : l * l - s * s;
        return {
          ...numberProblem({
            prompt: wantSlant
              ? t(
                  `A pyramid has a square base with sides $${s}$ ${u} long, and its height is $${h}$ ${u}. Find its slant height, the height of each triangular face.`,
                  `一个棱锥的底面是边长为 $${s}$ ${uz}的正方形，高为 $${h}$ ${uz}。求它的斜高（每个侧面三角形的高）。`,
                )
              : t(
                  `A pyramid has a square base with sides $${s}$ ${u} long, and its slant height (the height of each triangular face) is $${l}$ ${u}. Find the height of the pyramid.`,
                  `一个棱锥的底面是边长为 $${s}$ ${uz}的正方形，斜高（每个侧面三角形的高）为 $${l}$ ${uz}。求棱锥的高。`,
                ),
            answer: wantSlant ? l : h,
            form: "integer",
            unit: u,
            wrong: [...(full > 0 && isSquare(full) ? [Math.sqrt(full)] : []), wantSlant ? h + half : l - half, wantSlant ? l * l : h * h],
            solution: t(
              `The height, half of a base side and the slant height form a right triangle with the slant height as hypotenuse:${lines}`,
              `高、底边长的一半和斜高构成一个直角三角形，斜高是斜边：${lines}`,
            ),
          }),
          figure: fig(
            pyramidMarks(s, s, h, { l: len3(s, u), h: wantSlant ? len3(h, u) : "?", s: wantSlant ? "?" : len3(l, u) }),
            "A pyramid on a square base with its height and slant height marked.",
            "一个底面为正方形的棱锥，标出了高和斜高。",
          ),
        };
      },
    },
    {
      id: "the-longest-rod-in-a-cylinder",
      title: t("The longest rod in a cylinder", "圆柱内的最长直棒"),
      explanation: t(
        "The longest straight rod that fits inside a cylinder runs from a point on the bottom rim to the opposite point on the top rim. It is the hypotenuse of a right triangle whose legs are the **diameter** of the base and the height: $d^2 = (2r)^2 + h^2$.\n\nA can with radius $3$ cm and height $8$ cm holds a rod of length $\\sqrt{6^2 + 8^2} = \\sqrt{100} = 10$ cm. Using the radius instead of the diameter gives a rod that is too short.",
        "能放进圆柱内的最长直棒，从底面圆周上的一点通到顶面圆周上相对的点。它是一个直角三角形的斜边，两条直角边是底面的**直径**和高：$d^2 = (2r)^2 + h^2$。\n\n半径 $3$ 厘米、高 $8$ 厘米的罐子，能放下长 $\\sqrt{6^2 + 8^2} = \\sqrt{100} = 10$ 厘米的直棒。若用半径代替直径，算出的长度就偏短了。",
      ),
      generate(rng) {
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
          const ask = giveRadius
            ? t(
                `A cylinder has radius $${r}$ ${u} and height $${h}$ ${u}. What is the length of the longest straight rod that fits inside it?`,
                `一个圆柱的底面半径为 $${r}$ ${uz}，高为 $${h}$ ${uz}。能放进圆柱内的最长直棒有多长？`,
              )
            : t(
                `A cylinder has diameter $${width}$ ${u} and height $${h}$ ${u}. What is the length of the longest straight rod that fits inside it?`,
                `一个圆柱的底面直径为 $${width}$ ${uz}，高为 $${h}$ ${uz}。能放进圆柱内的最长直棒有多长？`,
              );
          const lines = steps(
            ...(giveRadius ? [`2r = 2 \\cdot ${r} = ${width}`] : []),
            `x^2 = ${width}^2 + ${h}^2 = ${width * width} + ${h * h} = ${n}`,
            rootLine("x", n),
          );
          const solution = t(
            `The rod runs from the bottom rim to the opposite point of the top rim: it is the hypotenuse of a right triangle whose legs are the diameter and the height.${lines}`,
            `直棒从底面圆周通到顶面圆周上相对的点：它是一个直角三角形的斜边，两条直角边是直径和高。${lines}`,
          );
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
          if (exact)
            return {
              ...numberProblem({
                prompt: ask,
                answer: Math.sqrt(n),
                form: "integer",
                unit: u,
                wrong: [width + h, n, ...(isSquare(radiusN) ? [Math.sqrt(radiusN)] : [])],
                solution,
              }),
              figure,
            };
          return {
            ...radicalProblem({
              prompt: t(`${ask.en} Give your answer in simplest radical form.`, `${ask["zh-CN"]}答案写成最简根式。`),
              answer: rootOf(n),
              wrong: [rootTex(radiusN), `${width + h}`],
              solution,
            }),
            figure,
          };
        }
      },
    },
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
  readonly wrong: (r: number, h: number, h2: number) => readonly Q[];
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
    wrong: (r, h) => [q(r * r * h).add(q(4 * r ** 3, 3)), q(r * r * h), q(r * r * h + 2 * r ** 3)],
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
    wrong: (r, h) => [q(r * r * h).add(q(2 * r ** 3, 3)), q(r * r * h, 3).add(q(4 * r ** 3, 3)), q(r * r * h, 3)],
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
    wrong: (r, h) => [q(r * r * h).add(q(2 * r ** 3, 3)), q(r * r * h).add(q(8 * r ** 3, 3)), q(r * r * h)],
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
    wrong: (r, h, h2) => [q(r * r * (h + h2)), q(r * r * h, 3).add(q(r * r * h2, 3)), q(r * r * h)],
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

const solvingRealWorldVolumeProblems = topic(
  "solving-real-world-problems-involving-volumes-of-cylinders-cones-and-spheres",
  t("Solving Real-World Problems Involving Volumes of Cylinders, Cones, and Spheres", "解决圆柱、圆锥和球体积的实际问题"),
  t(
    "Use the volumes of cylinders, cones and spheres to count how many times one container fills another, to find the volume of composite solids and to find filling times.",
    "利用圆柱、圆锥和球的体积，求一个容器能装满另一个容器多少次、组合体的体积以及注满所需的时间。",
  ),
  ["volumes-of-right-cones", "volumes-of-spheres"],
  ["8.G.C.9"],
  [
    {
      id: "filling-one-container-with-another",
      title: t("Filling one container with another", "用一个容器装满另一个容器"),
      explanation: t(
        "To find how many full scoops fill a container, divide the container's volume by the scoop's volume. Leave both in terms of $\\pi$: the $\\pi$'s cancel.\n\nA cylindrical tank with radius $6$ and height $10$ holds $360\\pi$. A cone-shaped cup with radius $2$ and height $6$ holds $\\tfrac{1}{3}\\pi \\cdot 2^2 \\cdot 6 = 8\\pi$. It takes $360\\pi \\div 8\\pi = 45$ cups. Remember the $\\tfrac{1}{3}$ for cones and the $\\tfrac{4}{3}$ for spheres.",
        "要求装满一个容器需要多少满勺（杯），就用容器的体积除以勺（杯）的体积。两个体积都保留 $\\pi$，相除时 $\\pi$ 约掉。\n\n底面半径 $6$、高 $10$ 的圆柱形水箱容积为 $360\\pi$；底面半径 $2$、高 $6$ 的圆锥形杯子容积为 $\\tfrac{1}{3}\\pi \\cdot 2^2 \\cdot 6 = 8\\pi$。需要 $360\\pi \\div 8\\pi = 45$ 杯。别忘了圆锥的 $\\tfrac{1}{3}$ 和球的 $\\tfrac{4}{3}$。",
      ),
      generate(rng) {
        const story = rng.pick(fillStories);
        for (;;) {
          const big: Round = { kind: story.big, r: rng.int(3, 12), h: rng.int(4, 20) };
          const small: Round = { kind: story.small, r: rng.int(1, 4), h: rng.int(2, 8) };
          if (small.r >= big.r) continue;
          const n = volume(big).div(volume(small));
          if (!n.isInteger() || n.toNumber() < 4 || n.toNumber() > 150) continue;
          const slip = [careless(big).div(volume(small)), volume(big).div(careless(small)), careless(big).div(careless(small))].filter(
            (w) => !w.eq(n),
          );
          if (slip.length === 0) continue;
          return numberProblem({
            prompt: story.ask(big, small),
            answer: n,
            form: "integer",
            wrong: slip,
            solution: t(
              `Find both volumes in terms of $\\pi$, then divide:${steps(volumeLine(`V_{\\text{${solidNames[big.kind].en}}}`, big), volumeLine(`V_{\\text{${solidNames[small.kind].en}}}`, small))}It takes $${piTex(volume(big))} \\div ${piTex(volume(small))} = ${n.toLatex()}$ of them.`,
              `先用含 $\\pi$ 的式子求出两个体积，再相除：${steps(volumeLine("V_1", big), volumeLine("V_2", small))}（$V_1$ 是${solidNames[big.kind]["zh-CN"]}的体积，$V_2$ 是${solidNames[small.kind]["zh-CN"]}的体积。）需要 $${piTex(volume(big))} \\div ${piTex(volume(small))} = ${n.toLatex()}$ 个。`,
            ),
          });
        }
      },
    },
    {
      id: "volumes-of-composite-solids",
      title: t("Volumes of composite solids", "组合体的体积"),
      explanation: t(
        "A composite solid is made of simpler solids. Find the volume of each part and add.\n\nA silo is a cylinder with radius $3$ m and height $10$ m topped by a hemisphere with radius $3$ m:\n\n$$\\pi \\cdot 3^2 \\cdot 10 + \\tfrac{2}{3}\\pi \\cdot 3^3 = 90\\pi + 18\\pi = 108\\pi \\text{ m}^3.$$\n\nA hemisphere is half a sphere, so its volume is $\\tfrac{2}{3}\\pi r^3$; two hemispheres make a whole sphere.",
        "组合体由几个简单立体组成。分别求出每部分的体积，再相加。\n\n一个粮仓由底面半径 $3$ 米、高 $10$ 米的圆柱和顶上半径 $3$ 米的半球组成：\n\n$$\\pi \\cdot 3^2 \\cdot 10 + \\tfrac{2}{3}\\pi \\cdot 3^3 = 90\\pi + 18\\pi = 108\\pi \\text{ m}^3.$$\n\n半球是球的一半，体积为 $\\tfrac{2}{3}\\pi r^3$；两个半球合成一个整球。",
      ),
      generate(rng) {
        const c = rng.pick(composites);
        const r = rng.int(2, 6);
        const h = rng.int(r + 1, 3 * r);
        const h2 = rng.int(r, 2 * r);
        const parts = c.parts(r, h, h2);
        const total = parts.reduce((s, p) => s.add(volume(p)), Q.zero);
        const lines = steps(
          ...parts.map((p, i) => volumeLine(`V_${i + 1}`, p)),
          `V = ${parts.map((p) => piTex(volume(p))).join(" + ")} = ${piTex(total)}`,
        );
        const ask = c.ask(r, h, h2);
        const names = parts.map((p) => solidNames[p.kind]);
        return {
          ...piProblem({
            prompt: t(`${ask.en} ${inPi.en}`, `${ask["zh-CN"]}${inPi["zh-CN"]}`),
            coef: total,
            wrong: c.wrong(r, h, h2).filter((w) => !w.eq(total)),
            solution: t(
              `Add the volumes of the parts ($V_1$ for the ${names[0]!.en}, $V_2$ for the ${names[1]!.en}${parts[1]!.kind === "sphere" ? ", the two hemispheres together" : ""}):${lines}`,
              `把各部分的体积相加（$V_1$ 是${names[0]!["zh-CN"]}的体积，$V_2$ 是${parts[1]!.kind === "sphere" ? "两个半球合成的球" : names[1]!["zh-CN"]}的体积）：${lines}`,
            ),
          }),
          figure: fig(c.marks(r, h, h2), "A composite solid made of round parts.", "一个由圆形立体组成的组合体。"),
        };
      },
    },
    {
      id: "filling-times",
      title: t("Filling times", "注满所需的时间"),
      explanation: t(
        "When a container fills at a steady rate, the time to fill it is its volume divided by the rate. Read the dimensions carefully: if the diameter is given, halve it to get the radius.\n\nA cylindrical tank with diameter $6$ ft and height $10$ ft has radius $3$ ft and volume $\\pi \\cdot 3^2 \\cdot 10 = 90\\pi \\approx 282.6$ ft³. At $9$ cubic feet per minute it fills in $282.6 \\div 9 \\approx 31$ minutes.",
        "当容器以恒定的速度被注满时，所需时间等于体积除以速度。仔细读题中的尺寸：若给出的是直径，要先除以 $2$ 得到半径。\n\n直径 $6$ 英尺、高 $10$ 英尺的圆柱形水箱，半径为 $3$ 英尺，体积为 $\\pi \\cdot 3^2 \\cdot 10 = 90\\pi \\approx 282.6$ 立方英尺。以每分钟 $9$ 立方英尺的速度注水，约需 $282.6 \\div 9 \\approx 31$ 分钟。",
      ),
      generate(rng) {
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
          const size = diameter ? t(`diameter $${2 * r}$ ${u}`, `直径为 $${2 * r}$ ${uz}`) : t(`radius $${r}$ ${u}`, `半径为 $${r}$ ${uz}`);
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
          return numberProblem({
            prompt: t(base.en + rate.en + roundMinute.en, base["zh-CN"] + rate["zh-CN"] + roundMinute["zh-CN"]),
            answer,
            form: "integer",
            unit: "min",
            wrong: [minutes(careless(solid)), ...(diameter ? [minutes(volume(wide))] : []), Math.round(v.toNumber())],
            solution: t(
              `${diameter ? `The radius is half the diameter: $r = ${2 * r} \\div 2 = ${r}$. ` : ""}Find the volume, then divide by the rate:${steps(volumeLine("V", solid), `V \\approx ${coef.toString()} \\cdot 3.14 = ${decVolume}\\text{ ${u}}^3`, `t = ${decVolume} \\div ${k} \\approx ${answer}`)}It takes about $${answer}$ minutes.`,
              `${diameter ? `半径是直径的一半：$r = ${2 * r} \\div 2 = ${r}$。` : ""}先求体积，再除以速度：${steps(volumeLine("V", solid), `V \\approx ${coef.toString()} \\cdot 3.14 = ${decVolume}\\text{ ${u}}^3`, `t = ${decVolume} \\div ${k} \\approx ${answer}`)}大约需要 $${answer}$ 分钟。`,
            ),
          });
        }
      },
    },
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
