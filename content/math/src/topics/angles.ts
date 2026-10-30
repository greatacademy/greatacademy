import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, type Mark, type Point, sketch } from "@ga/subject-math";

import { choiceProblem, numberProblem, steps } from "../problems.ts";

const rad = (d: number) => (d * Math.PI) / 180;

/** dir is the point at distance r from o in direction d degrees. */
const dir = (d: number, r = 5, o: Point = [0, 0]): Point => [o[0] + r * Math.cos(rad(d)), o[1] + r * Math.sin(rad(d))];

/** deg writes a measure in degrees for a figure: "35°". */
const deg = (d: number | string) => `${d}°`;

/** plain writes cx + d for a figure, with a true minus sign: "3x − 20". */
function plain(c: number, d: number): string {
  return linear(c, d).replace(/ - /g, " − ").replace(/^-/, "−");
}

/** angleTex writes cx + d degrees in LaTeX: "(3x - 20)^\circ", or "x^\circ". */
function angleTex(c: number, d: number): string {
  return d === 0 && c === 1 ? "x^\\circ" : `(${linear(c, d)})^\\circ`;
}

/** angleLabel writes cx + d degrees for a figure: "(3x − 20)°", or "x°". */
function angleLabel(c: number, d: number): string {
  return d === 0 && c === 1 ? "x°" : `(${plain(c, d)})°`;
}

const figure = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** triangleByAngles draws a triangle with angles a at (0, 0) and b at (6, 0), counterclockwise. */
function triangleByAngles(a: number, b: number): [Point, Point, Point] {
  const side = (6 * Math.sin(rad(b))) / Math.sin(rad(a + b));
  return [[0, 0], [6, 0], dir(a, side)];
}

/** pointNames labels the vertices of a figure A, B, C, … in the given compass directions. */
function pointNames(
  points: readonly Point[],
  dirs: readonly ("n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw")[],
  names = "ABCDEFGH",
): Mark[] {
  return points.map((at, i) => ({ kind: "label", at, text: names[i]!, dir: dirs[i]!, italic: true }));
}

const angleKinds: readonly Text[] = [t("Acute", "锐角"), t("Right", "直角"), t("Obtuse", "钝角"), t("Straight", "平角")];

export const anglesAndAngleMeasures: TopicDef = {
  id: "angles-and-angle-measures",
  title: t("Angles and Angle Measures", "角与角的度量"),
  summary: t("Classify angles by their measures, and add and subtract adjacent angles.", "按度数给角分类，并对相邻的角做加减。"),
  prerequisites: [],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.4.MD.C.5", "CCSS.4.MD.C.7"],
  knowledgePoints: [
    {
      id: "classifying-angles",
      title: t("Kinds of angles", "角的分类"),
      explanation: t(
        "An **angle** is formed by two rays from a common point, its **vertex**. Its measure, in **degrees** ($^\\circ$), tells how far one ray turns to reach the other; a full turn is $360^\\circ$.\n\n- An **acute** angle measures less than $90^\\circ$.\n- A **right** angle measures exactly $90^\\circ$; it is marked with a small square.\n- An **obtuse** angle measures between $90^\\circ$ and $180^\\circ$.\n- A **straight** angle measures $180^\\circ$: its rays form a line.",
        "**角**由从同一点出发的两条射线组成，这个点叫**顶点**。角的度数（单位为**度**，$^\\circ$）表示一条射线转到另一条射线转过了多少；转一整圈是 $360^\\circ$。\n\n- **锐角**小于 $90^\\circ$。\n- **直角**恰好是 $90^\\circ$，用一个小正方形标出。\n- **钝角**大于 $90^\\circ$ 而小于 $180^\\circ$。\n- **平角**是 $180^\\circ$：两条射线成一条直线。",
      ),
      generate(rng) {
        const kind = rng.int(0, 3);
        const m = [rng.int(10, 80), 90, rng.int(100, 170), 180][kind]!;
        const base = rng.pick([0, 15, 30, 45, 60, 75, 90]) * (kind === 3 ? 0 : 1);
        const o: Point = [0, 0];
        const [a, b] = [dir(base), dir(base + m)];
        const marks: Mark[] = [
          { kind: "segment", a: o, b: a },
          { kind: "segment", a: o, b: b },
          m === 90 ? { kind: "right", vertex: o, from: a, to: b } : { kind: "arc", vertex: o, from: a, to: b, label: deg(m), accent: true },
          { kind: "dot", at: o },
        ];
        const reason = [
          t(`$${m}^\\circ$ is less than $90^\\circ$`, `$${m}^\\circ$ 小于 $90^\\circ$`),
          t("the square marks a right angle, $90^\\circ$", "小正方形标出的是直角，即 $90^\\circ$"),
          t(`$${m}^\\circ$ is between $90^\\circ$ and $180^\\circ$`, `$${m}^\\circ$ 在 $90^\\circ$ 与 $180^\\circ$ 之间`),
          t("the two rays form a line, $180^\\circ$", "两条射线成一条直线，即 $180^\\circ$"),
        ][kind]!;
        return {
          ...choiceProblem({
            prompt: t("What kind of angle is shown?", "图中是什么角？"),
            options: angleKinds,
            correct: kind,
            solution: t(
              `The angle is ${angleKinds[kind]!.en.toLowerCase()}: ${reason.en}.`,
              `这是${angleKinds[kind]!["zh-CN"]}：${reason["zh-CN"]}。`,
            ),
          }),
          figure: figure(
            marks,
            m === 90 ? "An angle marked as a right angle." : `An angle of ${m}°.`,
            m === 90 ? "一个标有直角记号的角。" : `一个 ${m}° 的角。`,
          ),
        };
      },
    },
    {
      id: "adjacent-angles",
      title: t("Adjacent angles", "相邻的角"),
      explanation: t(
        "Angles that share a vertex and a side, without overlapping, are **adjacent**. Their measures add: if ray $OB$ lies inside $\\angle AOC$, then $\\angle AOB + \\angle BOC = \\angle AOC$.\n\nSo if $\\angle AOC = 110^\\circ$ and $\\angle AOB = 45^\\circ$, then $\\angle BOC = 110^\\circ - 45^\\circ = 65^\\circ$.",
        "有公共顶点和一条公共边、且互不重叠的两个角叫**相邻的角**。它们的度数相加：若射线 $OB$ 在 $\\angle AOC$ 内部，则 $\\angle AOB + \\angle BOC = \\angle AOC$。\n\n所以若 $\\angle AOC = 110^\\circ$，$\\angle AOB = 45^\\circ$，则 $\\angle BOC = 110^\\circ - 45^\\circ = 65^\\circ$。",
      ),
      generate(rng) {
        const a = rng.int(20, 90);
        const b = rng.int(20, 170 - a);
        const base = rng.pick([0, 10, 20, 30]);
        const o: Point = [0, 0];
        const [pa, pb, pc] = [dir(base), dir(base + a), dir(base + a + b)];
        const marks: Mark[] = [
          { kind: "segment", a: o, b: pa },
          { kind: "segment", a: o, b: pb },
          { kind: "segment", a: o, b: pc },
          { kind: "dot", at: o },
          ...pointNames([pa, pb, pc], ["e", "ne", "n"]),
          { kind: "label", at: o, text: "O", dir: "s", italic: true },
        ];
        const fig = figure(
          marks,
          "Rays OA, OB and OC from the point O, with OB between OA and OC.",
          "从点 O 出发的射线 OA、OB、OC，OB 在 OA 与 OC 之间。",
        );
        if (rng.bool()) {
          return {
            ...numberProblem({
              prompt: t(
                `In the figure, $\\angle AOB = ${a}^\\circ$ and $\\angle BOC = ${b}^\\circ$. Find $\\angle AOC$.`,
                `如图，$\\angle AOB = ${a}^\\circ$，$\\angle BOC = ${b}^\\circ$。求 $\\angle AOC$。`,
              ),
              answer: a + b,
              form: "integer",
              unit: "°",
              wrong: [Math.abs(a - b), 180 - a - b, 180 - a],
              solution: t(
                `$OB$ lies inside $\\angle AOC$, so the two angles add:${steps(`\\angle AOC = ${a}^\\circ + ${b}^\\circ = ${a + b}^\\circ`)}`,
                `$OB$ 在 $\\angle AOC$ 内部，所以两角相加：${steps(`\\angle AOC = ${a}^\\circ + ${b}^\\circ = ${a + b}^\\circ`)}`,
              ),
            }),
            figure: fig,
          };
        }
        return {
          ...numberProblem({
            prompt: t(
              `In the figure, $\\angle AOC = ${a + b}^\\circ$ and $\\angle AOB = ${a}^\\circ$. Find $\\angle BOC$.`,
              `如图，$\\angle AOC = ${a + b}^\\circ$，$\\angle AOB = ${a}^\\circ$。求 $\\angle BOC$。`,
            ),
            answer: b,
            form: "integer",
            unit: "°",
            wrong: [2 * a + b, 180 - a - b, 180 - a],
            solution: t(
              `$\\angle AOB + \\angle BOC = \\angle AOC$, so:${steps(`\\angle BOC = ${a + b}^\\circ - ${a}^\\circ = ${b}^\\circ`)}`,
              `$\\angle AOB + \\angle BOC = \\angle AOC$，所以：${steps(`\\angle BOC = ${a + b}^\\circ - ${a}^\\circ = ${b}^\\circ`)}`,
            ),
          }),
          figure: fig,
        };
      },
    },
  ],
};

/** splitAngleFor draws a right or straight angle split in two: the known part labeled a°, the other x, in either order. */
function splitAngleFor(rng: Rng, total: 90 | 180, a: number): Figure {
  const base = total === 180 ? 0 : rng.pick([0, 15, 30]);
  const knownFirst = rng.bool();
  const first = knownFirst ? a : total - a;
  const o: Point = [0, 0];
  const [p, q, r] = [dir(base), dir(base + first), dir(base + total)];
  const marks: Mark[] = [
    ...(total === 180
      ? [{ kind: "segment", a: p, b: r } as const]
      : [{ kind: "segment", a: o, b: p } as const, { kind: "segment", a: o, b: r } as const]),
    { kind: "segment", a: o, b: q },
    { kind: "arc", vertex: o, from: p, to: q, label: knownFirst ? deg(a) : "x", accent: !knownFirst },
    { kind: "arc", vertex: o, from: q, to: r, label: knownFirst ? "x" : deg(a), accent: knownFirst },
  ];
  const kind = total === 90 ? ["right", "直角"] : ["straight", "平角"];
  return figure(marks, `A ${kind[0]} angle split into an angle of ${a}° and an angle x.`, `一个${kind[1]}被分成 ${a}° 的角和角 x。`);
}

export const complementaryAndSupplementaryAngles: TopicDef = {
  id: "complementary-and-supplementary-angles",
  title: t("Complementary and Supplementary Angles", "互余与互补的角"),
  summary: t("Find the complement and the supplement of an angle.", "求一个角的余角和补角。"),
  prerequisites: ["angles-and-angle-measures"],
  encompasses: [{ topic: "angles-and-angle-measures", weight: 0.5 }],
  xp: 8,
  standards: ["CCSS.7.G.B.5"],
  knowledgePoints: [
    {
      id: "complementary-angles",
      title: t("Complementary angles", "互余的角"),
      explanation: t(
        "Two angles are **complementary** when their measures add up to $90^\\circ$; each is the **complement** of the other. Two adjacent complementary angles together form a right angle.\n\nThe complement of $35^\\circ$ is $90^\\circ - 35^\\circ = 55^\\circ$.",
        "和为 $90^\\circ$ 的两个角**互余**，每个角是另一个角的**余角**。两个相邻的互余角合起来是一个直角。\n\n$35^\\circ$ 的余角是 $90^\\circ - 35^\\circ = 55^\\circ$。",
      ),
      generate(rng) {
        const a = rng.int(8, 82);
        const wrong = [180 - a, a, 90 + a];
        const solution = t(
          `Complementary angles add up to $90^\\circ$:${steps(`x = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)}`,
          `互余的两角和为 $90^\\circ$：${steps(`x = 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)}`,
        );
        if (rng.bool()) {
          return numberProblem({
            prompt: t(`What is the complement of a $${a}^\\circ$ angle?`, `$${a}^\\circ$ 的角的余角是多少度？`),
            answer: 90 - a,
            form: "integer",
            unit: "°",
            wrong,
            solution: t(
              `The complement of $${a}^\\circ$ is:${steps(`90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)}`,
              `$${a}^\\circ$ 的余角是：${steps(`90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)}`,
            ),
          });
        }
        return {
          ...numberProblem({
            prompt: t("The two angles in the figure form a right angle. Find $x$.", "图中两个角合起来是一个直角。求 $x$。"),
            answer: 90 - a,
            form: "integer",
            unit: "°",
            wrong,
            solution,
          }),
          figure: splitAngleFor(rng, 90, a),
        };
      },
    },
    {
      id: "supplementary-angles",
      title: t("Supplementary angles", "互补的角"),
      explanation: t(
        "Two angles are **supplementary** when their measures add up to $180^\\circ$; each is the **supplement** of the other. Two adjacent supplementary angles together form a straight angle: they make a **linear pair**.\n\nThe supplement of $35^\\circ$ is $180^\\circ - 35^\\circ = 145^\\circ$.",
        "和为 $180^\\circ$ 的两个角**互补**，每个角是另一个角的**补角**。两个相邻的互补角合起来是一个平角，称为**邻补角**。\n\n$35^\\circ$ 的补角是 $180^\\circ - 35^\\circ = 145^\\circ$。",
      ),
      generate(rng) {
        const a = rng.int(10, 170);
        const wrong = [...(a < 90 ? [90 - a] : []), a, 360 - a];
        if (rng.bool()) {
          return numberProblem({
            prompt: t(`What is the supplement of a $${a}^\\circ$ angle?`, `$${a}^\\circ$ 的角的补角是多少度？`),
            answer: 180 - a,
            form: "integer",
            unit: "°",
            wrong,
            solution: t(
              `The supplement of $${a}^\\circ$ is:${steps(`180^\\circ - ${a}^\\circ = ${180 - a}^\\circ`)}`,
              `$${a}^\\circ$ 的补角是：${steps(`180^\\circ - ${a}^\\circ = ${180 - a}^\\circ`)}`,
            ),
          });
        }
        return {
          ...numberProblem({
            prompt: t("The two angles in the figure form a straight angle. Find $x$.", "图中两个角合起来是一个平角。求 $x$。"),
            answer: 180 - a,
            form: "integer",
            unit: "°",
            wrong,
            solution: t(
              `Angles that form a straight angle add up to $180^\\circ$:${steps(`x = 180^\\circ - ${a}^\\circ = ${180 - a}^\\circ`)}`,
              `合成平角的两角和为 $180^\\circ$：${steps(`x = 180^\\circ - ${a}^\\circ = ${180 - a}^\\circ`)}`,
            ),
          }),
          figure: splitAngleFor(rng, 180, a),
        };
      },
    },
  ],
};

/** chain writes solution steps, dropping a line that repeats the one before it. */
const chain = (...lines: string[]) => steps(...lines.filter((l, i) => l !== lines[i - 1]));

/** intOr is a / b when it is a whole number, and fallback otherwise. */
const intOr = (a: number, b: number, fallback: number) => (b !== 0 && Number.isInteger(a / b) ? a / b : fallback);

/** equalSteps solves c1·x + d1 = c2·x + d2 (c1 ≠ c2), collecting x on the side with the larger coefficient. */
function equalSteps(c1: number, d1: number, c2: number, d2: number): string[] {
  const x = (d2 - d1) / (c1 - c2);
  const collected = c1 > c2 ? `${linear(c1 - c2, 0)} = ${d2 - d1}` : `${d1 - d2} = ${linear(c2 - c1, 0)}`;
  return [`${linear(c1, d1)} = ${linear(c2, d2)}`, collected, `x = ${x}`];
}

/** sumSteps solves (c1·x + d1) + (c2·x + d2) + … = total. */
function sumSteps(terms: readonly (readonly [number, number])[], total: number): string[] {
  const c = terms.reduce((s, [ci]) => s + ci, 0);
  const d = terms.reduce((s, [, di]) => s + di, 0);
  const sum = terms.map(([ci, di]) => (di === 0 ? linear(ci, 0) : `(${linear(ci, di)})`)).join(" + ");
  return [`${sum} = ${total}`, `${linear(c, d)} = ${total}`, `${linear(c, 0)} = ${total - d}`, `x = ${(total - d) / c}`];
}

/** crossingLines draws two lines crossing at O, at directions base and base + a; arcs label the angles listed by index (0 to 3, counterclockwise). */
function crossingLines(base: number, a: number, arcs: readonly (readonly [number, string])[], en: string, zh: string): Figure {
  const o: Point = [0, 0];
  const rays = [base, base + a, base + 180, base + a + 180].map((d) => dir(d));
  const marks: Mark[] = [
    { kind: "segment", a: rays[0]!, b: rays[2]! },
    { kind: "segment", a: rays[1]!, b: rays[3]! },
    ...arcs.map(([i, label]): Mark => ({ kind: "arc", vertex: o, from: rays[i]!, to: rays[(i + 1) % 4]!, label, accent: true })),
  ];
  return figure(marks, en, zh);
}

const crossingBases = [0, 10, 20, 160, 170];

export const verticalAngles: TopicDef = {
  id: "vertical-angles",
  title: t("Vertical Angles", "对顶角"),
  summary: t(
    "Use vertical angles and linear pairs to find unknown angles where two lines cross.",
    "利用对顶角和邻补角求两直线相交处的未知角。",
  ),
  prerequisites: ["complementary-and-supplementary-angles", "equations-with-variables-on-both-sides"],
  encompasses: [
    { topic: "complementary-and-supplementary-angles", weight: 0.4 },
    { topic: "equations-with-variables-on-both-sides", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.7.G.B.5"],
  knowledgePoints: [
    {
      id: "vertical-angles-and-linear-pairs",
      title: t("Vertical angles and linear pairs", "对顶角与邻补角"),
      explanation: t(
        "Two crossing lines form four angles. Opposite angles are **vertical angles**, and they are equal. Neighboring angles form a linear pair, so they are supplementary.\n\nIf one of the four angles is $50^\\circ$, the angle opposite it is also $50^\\circ$, and each of the other two is $180^\\circ - 50^\\circ = 130^\\circ$.",
        "两条相交直线形成四个角。相对的两个角是**对顶角**，它们相等。相邻的两个角是邻补角，所以互补。\n\n若四个角中有一个是 $50^\\circ$，它的对顶角也是 $50^\\circ$，另外两个角都是 $180^\\circ - 50^\\circ = 130^\\circ$。",
      ),
      generate(rng) {
        const a = rng.pick([rng.int(30, 80), rng.int(100, 150)]);
        const known = rng.int(0, 3);
        const opposite = rng.bool();
        const asked = (known + (opposite ? 2 : rng.pick([1, 3]))) % 4;
        const m = known % 2 === 0 ? a : 180 - a;
        const answer = opposite ? m : 180 - m;
        return {
          ...numberProblem({
            prompt: t("Two lines cross as shown. Find $x$.", "两条直线如图相交。求 $x$。"),
            answer,
            form: "integer",
            unit: "°",
            wrong: [opposite ? 180 - m : m, ...(m < 90 ? [90 - m] : []), 360 - m],
            solution: opposite
              ? t(
                  `The angle $x$ is opposite the $${m}^\\circ$ angle. Vertical angles are equal, so $x = ${m}^\\circ$.`,
                  `角 $x$ 与 $${m}^\\circ$ 的角是对顶角。对顶角相等，所以 $x = ${m}^\\circ$。`,
                )
              : t(
                  `The angle $x$ and the $${m}^\\circ$ angle form a linear pair, so they are supplementary:${steps(`x = 180^\\circ - ${m}^\\circ = ${180 - m}^\\circ`)}`,
                  `角 $x$ 与 $${m}^\\circ$ 的角是邻补角，所以互补：${steps(`x = 180^\\circ - ${m}^\\circ = ${180 - m}^\\circ`)}`,
                ),
          }),
          figure: crossingLines(
            rng.pick(crossingBases),
            a,
            [
              [known, deg(m)],
              [asked, "x"],
            ],
            `Two lines crossing at a point. One of the four angles measures ${m}°; the angle ${opposite ? "opposite" : "next to"} it is x.`,
            `两条直线相交于一点。四个角中有一个是 ${m}°，与它${opposite ? "相对" : "相邻"}的角是 x。`,
          ),
        };
      },
    },
    {
      id: "equations-from-crossing-lines",
      title: t("Equations from crossing lines", "由相交直线列方程"),
      explanation: t(
        "When angles are written with a variable, the angle relationships give equations: vertical angles are equal, and a linear pair adds up to $180^\\circ$.\n\nIf vertical angles measure $(3x + 10)^\\circ$ and $(5x - 30)^\\circ$, then $3x + 10 = 5x - 30$, so $40 = 2x$ and $x = 20$. Each angle is $3 \\cdot 20 + 10 = 70^\\circ$.",
        "当角用含变量的式子表示时，角之间的关系给出方程：对顶角相等，邻补角之和为 $180^\\circ$。\n\n若一对对顶角为 $(3x + 10)^\\circ$ 和 $(5x - 30)^\\circ$，则 $3x + 10 = 5x - 30$，所以 $40 = 2x$，$x = 20$。每个角都是 $3 \\cdot 20 + 10 = 70^\\circ$。",
      ),
      keyPrerequisites: ["equations-with-variables-on-both-sides"],
      generate(rng) {
        const base = rng.pick(crossingBases);
        const known = rng.int(0, 3);
        const vertical = rng.bool();
        const { x, c1, d1, c2, d2, m } = expressionPair(rng, vertical);
        const a = known % 2 === 0 ? m : 180 - m;
        const fig = crossingLines(
          base,
          a,
          [
            [known, angleLabel(c1, d1)],
            [(known + (vertical ? 2 : 1)) % 4, angleLabel(c2, d2)],
          ],
          `Two lines crossing at a point, with two ${vertical ? "opposite" : "neighboring"} angles marked ${angleLabel(c1, d1)} and ${angleLabel(c2, d2)}.`,
          `两条直线相交于一点，两个${vertical ? "相对" : "相邻"}的角分别标为 ${angleLabel(c1, d1)} 和 ${angleLabel(c2, d2)}。`,
        );
        const pair = `$${angleTex(c1, d1)}$, $${angleTex(c2, d2)}$`;
        if (vertical) {
          return {
            ...numberProblem({
              prompt: t(`Two lines cross as shown. Find $x$.`, `两条直线如图相交。求 $x$。`),
              answer: x,
              form: "integer",
              solveFor: "x",
              wrong: [m, intOr(180 - d1 - d2, c1 + c2, -x), -x],
              solution: t(
                `The angles ${pair} are vertical angles, so they are equal:${chain(...equalSteps(c1, d1, c2, d2))}`,
                `角 ${pair} 是对顶角，所以相等：${chain(...equalSteps(c1, d1, c2, d2))}`,
              ),
            }),
            figure: fig,
          };
        }
        return {
          ...numberProblem({
            prompt: t(`Two lines cross as shown. Find $x$.`, `两条直线如图相交。求 $x$。`),
            answer: x,
            form: "integer",
            solveFor: "x",
            wrong: [m, c1 === c2 ? -x : intOr(d2 - d1, c1 - c2, -x), intOr(90 - d1 - d2, c1 + c2, -x)],
            solution: t(
              `The angles ${pair} form a linear pair, so they add up to $180^\\circ$:${chain(
                ...sumSteps(
                  [
                    [c1, d1],
                    [c2, d2],
                  ],
                  180,
                ),
              )}`,
              `角 ${pair} 是邻补角，和为 $180^\\circ$：${chain(
                ...sumSteps(
                  [
                    [c1, d1],
                    [c2, d2],
                  ],
                  180,
                ),
              )}`,
            ),
          }),
          figure: fig,
        };
      },
    },
  ],
};

/** expressionPair picks x and angle expressions c1·x + d1 and c2·x + d2 that are equal (or supplementary) at x; m is the first angle's measure. */
function expressionPair(
  rng: Rng,
  equal: boolean,
  lo = 30,
  hi = 150,
): { x: number; c1: number; d1: number; c2: number; d2: number; m: number } {
  for (;;) {
    const x = rng.int(5, 30);
    const [c1, c2] = equal ? (rng.sample([1, 2, 3, 4, 5], 2) as [number, number]) : [rng.int(1, 4), rng.int(1, 4)];
    const m = rng.int(lo, hi);
    const d1 = m - c1 * x;
    const d2 = (equal ? m : 180 - m) - c2 * x;
    if (Math.abs(m - 90) >= 10 && Math.abs(d1) <= 60 && Math.abs(d2) <= 60) return { x, c1, d1, c2, d2, m };
  }
}

/** transversal draws parallel lines ℓ (above) and m (below) cut by a transversal at angle theta; arcs label angles at P (on m) and Q (on ℓ), indexed 0 to 3 counterclockwise from the right. */
function transversal(theta: number, arcs: readonly (readonly ["P" | "Q", number, string])[], en: string, zh: string): Figure {
  const p: Point = [0, 0];
  const q: Point = [3 / Math.tan(rad(theta)), 3];
  const rays = (o: Point) => [0, theta, 180, theta + 180].map((d) => dir(d, 2, o));
  const at = { P: rays(p), Q: rays(q) };
  const arrowX = theta < 90 ? -6 : 6;
  const marks: Mark[] = [
    { kind: "segment", a: [-7, 3], b: [7, 3] },
    { kind: "segment", a: [-7, 0], b: [7, 0] },
    { kind: "segment", a: dir(theta + 180, 2), b: dir(theta, 2, q) },
    { kind: "arrows", a: [arrowX - 1, 3], b: [arrowX + 3, 3], count: 1 },
    { kind: "arrows", a: [arrowX - 1, 0], b: [arrowX + 3, 0], count: 1 },
    { kind: "label", at: [7, 3], text: "ℓ", dir: "e" },
    { kind: "label", at: [7, 0], text: "m", dir: "e", italic: true },
    ...arcs.map(
      ([v, i, label]): Mark => ({ kind: "arc", vertex: v === "P" ? p : q, from: at[v][i]!, to: at[v][(i + 1) % 4]!, label, accent: true }),
    ),
  ];
  return figure(marks, en, zh);
}

/** AnglePair is a named pair of angles formed by a transversal: the angle index at P, at Q, and whether they are equal. */
interface AnglePair {
  readonly p: number;
  readonly q: number;
  readonly name: Text;
  readonly equal: boolean;
}

const anglePairNames = [
  t("Corresponding angles", "同位角"),
  t("Alternate interior angles", "内错角"),
  t("Alternate exterior angles", "外错角"),
  t("Consecutive interior angles", "同旁内角"),
];

const anglePairs: readonly AnglePair[] = [
  ...[0, 1, 2, 3].map((i) => ({ p: i, q: i, name: anglePairNames[0]!, equal: true })),
  { p: 0, q: 2, name: anglePairNames[1]!, equal: true },
  { p: 1, q: 3, name: anglePairNames[1]!, equal: true },
  { p: 2, q: 0, name: anglePairNames[2]!, equal: true },
  { p: 3, q: 1, name: anglePairNames[2]!, equal: true },
  { p: 0, q: 3, name: anglePairNames[3]!, equal: false },
  { p: 1, q: 2, name: anglePairNames[3]!, equal: false },
];

/** pairRule states why a pair of angles is equal or supplementary. */
function pairRule(pair: AnglePair): Text {
  const name = pair.name;
  return pair.equal
    ? t(`They are ${name.en.toLowerCase()}, and parallel lines make them equal`, `它们是${name["zh-CN"]}，两直线平行，所以相等`)
    : t(`They are ${name.en.toLowerCase()}, and parallel lines make them supplementary`, `它们是${name["zh-CN"]}，两直线平行，所以互补`);
}

/** pickTheta picks the transversal's angle with the lines, at least 15° from a right angle. */
const pickTheta = (rng: Rng) => rng.pick([rng.int(50, 75), rng.int(105, 130)]);

export const parallelLinesAndTransversals: TopicDef = {
  id: "parallel-lines-and-transversals",
  title: t("Parallel Lines and Transversals", "平行线与截线"),
  summary: t(
    "Name the angle pairs a transversal forms with two parallel lines, and use them to find angles.",
    "认识截线与两条平行线形成的角对，并用它们求角。",
  ),
  prerequisites: ["vertical-angles"],
  encompasses: [{ topic: "vertical-angles", weight: 0.6 }],
  xp: 12,
  standards: ["CCSS.8.G.A.5"],
  knowledgePoints: [
    {
      id: "naming-angle-pairs",
      title: t("Angle pairs", "角对的名称"),
      explanation: t(
        "A **transversal** is a line that crosses two other lines, forming eight angles. The angles between the two lines are **interior**; the others are **exterior**. Pairs of angles at the two crossings have names:\n\n- **Corresponding angles** are in the same position at each crossing.\n- **Alternate interior angles** are between the lines, on opposite sides of the transversal.\n- **Alternate exterior angles** are outside the lines, on opposite sides of the transversal.\n- **Consecutive interior angles** are between the lines, on the same side of the transversal.",
        "**截线**是与另外两条直线都相交的直线，共形成八个角。两条直线之间的角是**内角**，其余的是**外角**。两个交点处的角组成的角对各有名称：\n\n- **同位角**：在两个交点处位置相同。\n- **内错角**：在两条直线之间，分别在截线两侧。\n- **外错角**：在两条直线之外，分别在截线两侧。\n- **同旁内角**：在两条直线之间，在截线同一侧。",
      ),
      generate(rng) {
        const pair = rng.pick(anglePairs);
        const correct = anglePairNames.indexOf(pair.name);
        const [first, second] = rng.bool() ? (["P", "Q"] as const) : (["Q", "P"] as const);
        const index = { P: pair.p, Q: pair.q };
        return {
          ...choiceProblem({
            prompt: t(
              "A transversal crosses two lines. What kind of pair are angles $1$ and $2$?",
              "一条截线与两条直线相交。角 $1$ 与角 $2$ 是什么角对？",
            ),
            options: anglePairNames,
            correct,
            solution: t(
              `${[
                "The two angles are in the same position at their crossings",
                "Both angles are between the lines, on opposite sides of the transversal",
                "Both angles are outside the lines, on opposite sides of the transversal",
                "Both angles are between the lines, on the same side of the transversal",
              ][correct]!}: they are ${pair.name.en.toLowerCase()}.`,
              `${["两个角在各自交点处的位置相同", "两个角都在两条直线之间，分别在截线两侧", "两个角都在两条直线之外，分别在截线两侧", "两个角都在两条直线之间，在截线同一侧"][correct]!}：它们是${pair.name["zh-CN"]}。`,
            ),
          }),
          figure: transversal(
            pickTheta(rng),
            [
              [first, index[first], "1"],
              [second, index[second], "2"],
            ],
            "Two lines cut by a transversal, with angle 1 at one crossing and angle 2 at the other.",
            "两条直线被一条截线所截，角 1 在一个交点处，角 2 在另一个交点处。",
          ),
        };
      },
    },
    {
      id: "angles-from-parallel-lines",
      title: t("Finding angles with parallel lines", "利用平行线求角"),
      explanation: t(
        "When the two lines are **parallel** (marked with matching arrows), the angle pairs are related:\n\n- corresponding, alternate interior and alternate exterior angles are **equal**;\n- consecutive interior angles are **supplementary**.\n\nIn fact all eight angles take only two values, which add up to $180^\\circ$: if one angle is $65^\\circ$, every angle is $65^\\circ$ or $115^\\circ$.",
        "当两条直线**平行**（用相同的箭头标出）时，角对之间有如下关系：\n\n- 同位角、内错角、外错角都**相等**；\n- 同旁内角**互补**。\n\n其实八个角只有两种度数，且两者之和为 $180^\\circ$：若一个角是 $65^\\circ$，那么每个角不是 $65^\\circ$ 就是 $115^\\circ$。",
      ),
      generate(rng) {
        const pair = rng.pick(anglePairs);
        const theta = pickTheta(rng);
        const knownAtP = rng.bool();
        const [kv, ki, xv, xi] = knownAtP ? (["P", pair.p, "Q", pair.q] as const) : (["Q", pair.q, "P", pair.p] as const);
        const m = ki % 2 === 0 ? theta : 180 - theta;
        const answer = pair.equal ? m : 180 - m;
        const rule = pairRule(pair);
        return {
          ...numberProblem({
            prompt: t("Lines $\\ell$ and $m$ are parallel. Find $x$.", "直线 $\\ell$ 与 $m$ 平行。求 $x$。"),
            answer,
            form: "integer",
            unit: "°",
            wrong: [pair.equal ? 180 - m : m, ...(m < 90 ? [90 - m] : []), 360 - m],
            solution: pair.equal
              ? t(`${rule.en}:${steps(`x = ${m}^\\circ`)}`, `${rule["zh-CN"]}：${steps(`x = ${m}^\\circ`)}`)
              : t(
                  `${rule.en}:${steps(`x = 180^\\circ - ${m}^\\circ = ${180 - m}^\\circ`)}`,
                  `${rule["zh-CN"]}：${steps(`x = 180^\\circ - ${m}^\\circ = ${180 - m}^\\circ`)}`,
                ),
          }),
          figure: transversal(
            theta,
            [
              [kv, ki, deg(m)],
              [xv, xi, "x"],
            ],
            `Parallel lines ℓ and m cut by a transversal. One angle measures ${m}°; another angle, at the other crossing, is x.`,
            `平行线 ℓ 与 m 被一条截线所截。一个角是 ${m}°，另一个交点处的一个角是 x。`,
          ),
        };
      },
    },
    {
      id: "equations-from-parallel-lines",
      title: t("Equations from parallel lines", "由平行线列方程"),
      explanation: t(
        "When the angles are written with a variable, the pair's relationship gives an equation: equal angles give $A = B$, supplementary angles give $A + B = 180$.\n\nIf consecutive interior angles measure $(2x + 15)^\\circ$ and $(3x - 10)^\\circ$, then $(2x + 15) + (3x - 10) = 180$, so $5x + 5 = 180$, $5x = 175$ and $x = 35$.",
        "当角用含变量的式子表示时，角对的关系给出方程：相等的角得 $A = B$，互补的角得 $A + B = 180$。\n\n若一对同旁内角为 $(2x + 15)^\\circ$ 和 $(3x - 10)^\\circ$，则 $(2x + 15) + (3x - 10) = 180$，所以 $5x + 5 = 180$，$5x = 175$，$x = 35$。",
      ),
      keyPrerequisites: ["vertical-angles"],
      generate(rng) {
        const pair = rng.pick(anglePairs);
        const { x, c1, d1, c2, d2, m } = expressionPair(rng, pair.equal, 45, 135);
        const theta = pair.p % 2 === 0 ? m : 180 - m;
        const rule = pairRule(pair);
        const work = pair.equal
          ? equalSteps(c1, d1, c2, d2)
          : sumSteps(
              [
                [c1, d1],
                [c2, d2],
              ],
              180,
            );
        return {
          ...numberProblem({
            prompt: t("Lines $\\ell$ and $m$ are parallel. Find $x$.", "直线 $\\ell$ 与 $m$ 平行。求 $x$。"),
            answer: x,
            form: "integer",
            solveFor: "x",
            wrong: pair.equal
              ? [m, intOr(180 - d1 - d2, c1 + c2, -x), -x]
              : [m, c1 === c2 ? -x : intOr(d2 - d1, c1 - c2, -x), intOr(90 - d1 - d2, c1 + c2, -x)],
            solution: t(`${rule.en}:${chain(...work)}`, `${rule["zh-CN"]}：${chain(...work)}`),
          }),
          figure: transversal(
            theta,
            [
              ["P", pair.p, angleLabel(c1, d1)],
              ["Q", pair.q, angleLabel(c2, d2)],
            ],
            `Parallel lines ℓ and m cut by a transversal, with angles marked ${angleLabel(c1, d1)} and ${angleLabel(c2, d2)} at the two crossings.`,
            `平行线 ℓ 与 m 被一条截线所截，两个交点处的角分别标为 ${angleLabel(c1, d1)} 和 ${angleLabel(c2, d2)}。`,
          ),
        };
      },
    },
  ],
};

/** triangleArcs marks the angles of triangle ABC (counterclockwise) with the given labels; an empty label leaves the angle unmarked, "90" marks a right angle. */
function triangleArcs([a, b, c]: readonly [Point, Point, Point], labels: readonly [string, string, string]): Mark[] {
  const corners: [Point, Point, Point][] = [
    [a, b, c],
    [b, c, a],
    [c, a, b],
  ];
  return corners.flatMap(([v, from, to], i): Mark[] => {
    const label = labels[i]!;
    if (label === "") return [];
    if (label === "90") return [{ kind: "right", vertex: v, from, to }];
    return [{ kind: "arc", vertex: v, from, to, label, accent: !label.endsWith("°") || label.includes("x") }];
  });
}

/** mirror reflects a triangle left to right, keeping it counterclockwise. */
function mirror([a, b, c]: readonly [Point, Point, Point]): [Point, Point, Point] {
  const flip = (p: Point): Point => [6 - p[0], p[1]];
  return [flip(b), flip(a), flip(c)];
}

/** triangleFigure draws triangle ABC with its angles at A, B, C marked; flipped mirrors it, swapping where A and B sit. */
function triangleFigure(
  angles: readonly [number, number],
  labels: readonly [string, string, string],
  flipped: boolean,
  en: string,
  zh: string,
): Figure {
  let points = triangleByAngles(angles[0], angles[1]);
  let marks = labels;
  if (flipped) {
    points = mirror(points);
    marks = [labels[1], labels[0], labels[2]];
  }
  return figure([{ kind: "polygon", points }, ...triangleArcs(points, marks)], en, zh);
}

/** namedTriangle draws triangle ABC with its vertices named and its angles marked, for problems that state the angles in the prompt. */
function namedTriangle(points: [Point, Point, Point]): Figure {
  const [a, b, c] = points;
  return figure(
    [
      { kind: "polygon", points },
      { kind: "arc", vertex: a, from: b, to: c, accent: true },
      { kind: "arc", vertex: b, from: c, to: a, accent: true },
      { kind: "arc", vertex: c, from: a, to: b, accent: true },
      ...pointNames(points, ["sw", "se", "n"]),
    ],
    "Triangle ABC with its three angles marked.",
    "三角形 ABC，三个角已标出。",
  );
}

const proofTriangle = triangleByAngles(50, 70);
const apex = proofTriangle[2];

export const anglesOfATriangle: TopicDef = {
  id: "angles-of-a-triangle",
  title: t("Angles of a Triangle", "三角形的内角"),
  summary: t("Use the fact that the angles of a triangle add up to 180° to find unknown angles.", "利用三角形内角和为 180° 求未知角。"),
  prerequisites: ["parallel-lines-and-transversals"],
  encompasses: [{ topic: "complementary-and-supplementary-angles", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.8.G.A.5"],
  knowledgePoints: [
    {
      id: "the-third-angle",
      title: t("The angle sum of a triangle", "三角形的内角和"),
      explanation: t(
        "The three angles of every triangle add up to $180^\\circ$. To see why, draw the line through one vertex parallel to the opposite side. The three angles at that vertex form a straight angle, and by alternate interior angles the outer two equal the triangle's other two angles.\n\nSo if two angles of a triangle are $50^\\circ$ and $70^\\circ$, the third is $180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$. In a right triangle the two other angles add up to $90^\\circ$.",
        "任何三角形的三个内角之和都是 $180^\\circ$。要说明这一点，过一个顶点作对边的平行线。该顶点处的三个角合成一个平角，由内错角相等，两侧的两个角分别等于三角形的另外两个角。\n\n所以若三角形的两个角是 $50^\\circ$ 和 $70^\\circ$，第三个角是 $180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$。直角三角形中另外两个角之和为 $90^\\circ$。",
      ),
      figure: figure(
        [
          { kind: "polygon", points: proofTriangle },
          { kind: "segment", a: dir(180, 3, apex), b: dir(0, 3, apex), dashed: true },
          ...triangleArcs(proofTriangle, ["1", "2", "3"]),
          { kind: "arc", vertex: apex, from: dir(180, 1, apex), to: proofTriangle[0], label: "1", accent: true },
          { kind: "arc", vertex: apex, from: proofTriangle[1], to: dir(0, 1, apex), label: "2", accent: true },
        ],
        "A triangle with angles 1, 2 and 3, and a dashed line through the top vertex parallel to the base. At the top vertex, angles equal to 1 and 2 sit on either side of angle 3 and together form a straight angle.",
        "一个三角形，三个角标为 1、2、3；过顶点作底边的平行线（虚线）。顶点处，等于角 1 和角 2 的两个角在角 3 两侧，三者合成一个平角。",
      ),
      generate(rng) {
        if (rng.bool(0.3)) {
          const a = rng.int(20, 70);
          return {
            ...numberProblem({
              prompt: t("Find $x$ in the right triangle.", "求直角三角形中的 $x$。"),
              answer: 90 - a,
              form: "integer",
              unit: "°",
              wrong: [180 - a, 90 + a, 180 - 2 * a],
              solution: t(
                `The angles add up to $180^\\circ$, and one of them is $90^\\circ$:${steps(`x = 180^\\circ - 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)}`,
                `三个角之和为 $180^\\circ$，其中一个是 $90^\\circ$：${steps(`x = 180^\\circ - 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)}`,
              ),
            }),
            figure: triangleFigure(
              [a, 90],
              [deg(a), "90", "x"],
              rng.bool(),
              `A right triangle with one acute angle of ${a}° and the other marked x.`,
              `一个直角三角形，一个锐角是 ${a}°，另一个锐角标为 x。`,
            ),
          };
        }
        for (;;) {
          const a = rng.int(25, 110);
          const b = rng.int(25, 110);
          const c = 180 - a - b;
          if (c < 25 || a === 90 || b === 90 || c === 90) continue;
          const solution = t(
            `The angles of a triangle add up to $180^\\circ$:${steps(`x = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ`)}`,
            `三角形内角和为 $180^\\circ$：${steps(`x = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${c}^\\circ`)}`,
          );
          const problem = { answer: c, form: "integer", unit: "°", wrong: [a + b, 360 - a - b, Math.abs(a - b)], solution } as const;
          if (rng.bool(0.3)) {
            return numberProblem({
              prompt: t(
                `Two angles of a triangle measure $${a}^\\circ$ and $${b}^\\circ$. What is the third angle?`,
                `三角形的两个角分别是 $${a}^\\circ$ 和 $${b}^\\circ$。第三个角是多少度？`,
              ),
              ...problem,
            });
          }
          // x may sit at any corner: the drawing is the same triangle, turned.
          const [drawn, labels] = rng.pick([
            [
              [a, b],
              [deg(a), deg(b), "x"],
            ],
            [
              [c, a],
              ["x", deg(a), deg(b)],
            ],
            [
              [b, c],
              [deg(b), "x", deg(a)],
            ],
          ] as const);
          return {
            ...numberProblem({ prompt: t("Find $x$.", "求 $x$。"), ...problem }),
            figure: triangleFigure(
              drawn,
              labels,
              rng.bool(),
              `A triangle with two angles of ${a}° and ${b}°; the third is marked x.`,
              `一个三角形，两个角分别是 ${a}° 和 ${b}°，第三个角标为 x。`,
            ),
          };
        }
      },
    },
    {
      id: "triangle-angle-equations",
      title: t("Equations from the angle sum", "由内角和列方程"),
      explanation: t(
        "When the angles of a triangle are written with a variable, their sum gives an equation. Add the angles, set the sum equal to $180$, and solve.\n\nIf the angles are $x^\\circ$, $(2x + 10)^\\circ$ and $(3x - 10)^\\circ$, then $x + (2x + 10) + (3x - 10) = 180$, so $6x = 180$ and $x = 30$. The angles are $30^\\circ$, $70^\\circ$ and $80^\\circ$; check that they add up to $180^\\circ$.",
        "当三角形的角用含变量的式子表示时，它们的和给出一个方程：把三个角相加，令和等于 $180$，再求解。\n\n若三个角为 $x^\\circ$、$(2x + 10)^\\circ$、$(3x - 10)^\\circ$，则 $x + (2x + 10) + (3x - 10) = 180$，所以 $6x = 180$，$x = 30$。三个角是 $30^\\circ$、$70^\\circ$、$80^\\circ$；验算它们的和是 $180^\\circ$。",
      ),
      keyPrerequisites: ["two-step-equations", "combining-like-terms"],
      generate(rng) {
        for (;;) {
          const x = rng.int(5, 30);
          const a = rng.int(25, 110);
          const b = rng.int(25, 110);
          const c = 180 - a - b;
          if (c < 25 || [a, b, c].includes(90)) continue;
          const terms = [a, b, c].map((m): [number, number] => {
            if (m % x === 0 && m / x <= 4 && rng.bool(0.5)) return [m / x, 0];
            const k = rng.int(1, 4);
            return [k, m - k * x];
          });
          if (terms.some(([, d]) => Math.abs(d) > 50) || terms.every(([, d]) => d === 0)) continue;
          if (new Set(terms.map(([k, d]) => `${k},${d}`)).size < 3) continue;
          const [ta, tb, tc] = terms.map(([k, d]) => angleTex(k, d));
          const [cs, ds] = [terms.reduce((s, [k]) => s + k, 0), terms.reduce((s, [, d]) => s + d, 0)];
          const work = sumSteps(terms, 180);
          return {
            ...numberProblem({
              prompt: t(
                `In $\\triangle ABC$, $\\angle A = ${ta}$, $\\angle B = ${tb}$ and $\\angle C = ${tc}$. Find $x$.`,
                `在 $\\triangle ABC$ 中，$\\angle A = ${ta}$，$\\angle B = ${tb}$，$\\angle C = ${tc}$。求 $x$。`,
              ),
              answer: x,
              form: "integer",
              solveFor: "x",
              wrong: [intOr(360 - ds, cs, -x), intOr(90 - ds, cs, -x), intOr(180 + ds, cs, -x)],
              solution: t(
                `The angles of a triangle add up to $180^\\circ$:${chain(...work)}`,
                `三角形内角和为 $180^\\circ$：${chain(...work)}`,
              ),
            }),
            figure: namedTriangle(triangleByAngles(a, b)),
          };
        }
      },
    },
  ],
};

/** exteriorFigure draws triangle ABC with AB extended past B to D, marking the angles at A and C and the exterior angle CBD; an empty label leaves an angle's arc unlabeled. */
function exteriorFigure(a: number, b: number, labels: readonly [string, string, string], en: string, zh: string): Figure {
  const [pa, pb, pc] = triangleByAngles(a, b);
  const e: Point = [9, 0];
  const accent = (label: string) => !/^\d+°$/.test(label);
  return figure(
    [
      { kind: "polygon", points: [pa, pb, pc] },
      { kind: "segment", a: pb, b: e },
      { kind: "arc", vertex: pa, from: pb, to: pc, label: labels[0], accent: accent(labels[0]) },
      { kind: "arc", vertex: pc, from: pa, to: pb, label: labels[1], accent: accent(labels[1]) },
      { kind: "arc", vertex: pb, from: e, to: pc, label: labels[2], accent: accent(labels[2]) },
      ...pointNames([pa, pb, pc, e], ["sw", "s", "n", "s"], "ABCD"),
    ],
    en,
    zh,
  );
}

export const exteriorAnglesOfTriangles: TopicDef = {
  id: "exterior-angles-of-triangles",
  title: t("Exterior Angles of Triangles", "三角形的外角"),
  summary: t("Find exterior angles of a triangle from the two remote interior angles.", "由两个不相邻的内角求三角形的外角。"),
  prerequisites: ["angles-of-a-triangle"],
  encompasses: [{ topic: "angles-of-a-triangle", weight: 0.5 }],
  xp: 8,
  standards: ["CCSS.8.G.A.5"],
  knowledgePoints: [
    {
      id: "the-exterior-angle-theorem",
      title: t("The exterior angle theorem", "外角定理"),
      explanation: t(
        "Extending one side of a triangle forms an **exterior angle**. It forms a linear pair with the interior angle beside it, and the other two interior angles are its **remote interior angles**.\n\nAn exterior angle equals the sum of its two remote interior angles: both it and their sum are $180^\\circ$ minus the interior angle beside it. If the remote interior angles are $45^\\circ$ and $60^\\circ$, the exterior angle is $45^\\circ + 60^\\circ = 105^\\circ$.",
        "延长三角形的一边，就形成一个**外角**。它与相邻的内角是邻补角，另外两个内角是与它**不相邻的内角**。\n\n外角等于与它不相邻的两个内角之和：外角和这两个内角之和都等于 $180^\\circ$ 减去与外角相邻的内角。若不相邻的两个内角是 $45^\\circ$ 和 $60^\\circ$，外角是 $45^\\circ + 60^\\circ = 105^\\circ$。",
      ),
      generate(rng) {
        for (;;) {
          const a = rng.int(25, 100);
          const c = rng.int(25, 100);
          const b = 180 - a - c;
          if (b < 25 || b === 90 || a === 90 || c === 90) continue;
          const e = a + c;
          const findExterior = rng.bool();
          if (findExterior) {
            return {
              ...numberProblem({
                prompt: t("Find the exterior angle $x$.", "求外角 $x$。"),
                answer: e,
                form: "integer",
                unit: "°",
                wrong: [b, 180 - e, 360 - e],
                solution: t(
                  `The exterior angle equals the sum of the two remote interior angles:${steps(`x = ${a}^\\circ + ${c}^\\circ = ${e}^\\circ`)}`,
                  `外角等于与它不相邻的两个内角之和：${steps(`x = ${a}^\\circ + ${c}^\\circ = ${e}^\\circ`)}`,
                ),
              }),
              figure: exteriorFigure(
                a,
                b,
                [deg(a), deg(c), "x"],
                `A triangle with one side extended. The remote interior angles are ${a}° and ${c}°; the exterior angle is x.`,
                `一个三角形的一边被延长。不相邻的两个内角是 ${a}° 和 ${c}°，外角是 x。`,
              ),
            };
          }
          const xAtA = rng.bool();
          const [known, asked] = xAtA ? [c, a] : [a, c];
          return {
            ...numberProblem({
              prompt: t("Find $x$.", "求 $x$。"),
              answer: asked,
              form: "integer",
              unit: "°",
              wrong: [e + known, 180 - e, 180 - known, b],
              solution: t(
                `The exterior angle equals the sum of the two remote interior angles, so $${e}^\\circ = x + ${known}^\\circ$:${steps(`x = ${e}^\\circ - ${known}^\\circ = ${asked}^\\circ`)}`,
                `外角等于与它不相邻的两个内角之和，所以 $${e}^\\circ = x + ${known}^\\circ$：${steps(`x = ${e}^\\circ - ${known}^\\circ = ${asked}^\\circ`)}`,
              ),
            }),
            figure: exteriorFigure(
              a,
              b,
              xAtA ? ["x", deg(c), deg(e)] : [deg(a), "x", deg(e)],
              `A triangle with one side extended. The exterior angle is ${e}°; one remote interior angle is ${known}° and the other is x.`,
              `一个三角形的一边被延长。外角是 ${e}°，一个不相邻的内角是 ${known}°，另一个是 x。`,
            ),
          };
        }
      },
    },
    {
      id: "exterior-angle-equations",
      title: t("Equations from exterior angles", "由外角列方程"),
      explanation: t(
        "When the angles are written with a variable, the theorem gives an equation: the exterior angle equals the sum of the remote interior angles.\n\nIf the remote interior angles are $x^\\circ$ and $(2x + 5)^\\circ$ and the exterior angle is $110^\\circ$, then $x + (2x + 5) = 110$, so $3x = 105$ and $x = 35$.",
        "当角用含变量的式子表示时，外角定理给出方程：外角等于与它不相邻的两个内角之和。\n\n若不相邻的两个内角是 $x^\\circ$ 和 $(2x + 5)^\\circ$，外角是 $110^\\circ$，则 $x + (2x + 5) = 110$，所以 $3x = 105$，$x = 35$。",
      ),
      keyPrerequisites: ["angles-of-a-triangle"],
      generate(rng) {
        for (;;) {
          const x = rng.int(5, 30);
          const a = rng.int(25, 100);
          const c = rng.int(25, 100);
          const b = 180 - a - c;
          if (b < 25 || [a, b, c].includes(90)) continue;
          const k1 = a % x === 0 && a / x <= 4 && rng.bool(0.5) ? a / x : rng.int(1, 4);
          const k2 = rng.int(1, 4);
          const [d1, d2] = [a - k1 * x, c - k2 * x];
          if (Math.abs(d1) > 50 || Math.abs(d2) > 50) continue;
          const e = a + c;
          const work = sumSteps(
            [
              [k1, d1],
              [k2, d2],
            ],
            e,
          );
          return {
            ...numberProblem({
              prompt: t(
                `In the figure, $\\angle A = ${angleTex(k1, d1)}$, $\\angle C = ${angleTex(k2, d2)}$ and the exterior angle $\\angle CBD = ${e}^\\circ$. Find $x$.`,
                `如图，$\\angle A = ${angleTex(k1, d1)}$，$\\angle C = ${angleTex(k2, d2)}$，外角 $\\angle CBD = ${e}^\\circ$。求 $x$。`,
              ),
              answer: x,
              form: "integer",
              solveFor: "x",
              wrong: [intOr(180 - d1 - d2, k1 + k2, -x), intOr(180 - e - d1 - d2, k1 + k2, -x), b],
              solution: t(
                `The exterior angle equals the sum of the two remote interior angles:${chain(...work)}`,
                `外角等于与它不相邻的两个内角之和：${chain(...work)}`,
              ),
            }),
            figure: exteriorFigure(
              a,
              b,
              ["", "", deg(e)],
              `Triangle ABC with side AB extended past B to D, forming the exterior angle CBD of ${e}°.`,
              `三角形 ABC，边 AB 延长到 D，形成外角 CBD，为 ${e}°。`,
            ),
          };
        }
      },
    },
  ],
};

/** triangleBySides places a triangle with sides a = BC, b = CA, c = AB, with AB along the bottom, counterclockwise. */
function triangleBySides(a: number, b: number, c: number): [Point, Point, Point] {
  const x = (b * b + c * c - a * a) / (2 * c);
  return [
    [0, 0],
    [c, 0],
    [x, Math.sqrt(b * b - x * x)],
  ];
}

const sideKinds: readonly Text[] = [t("Equilateral", "等边三角形"), t("Isosceles", "等腰三角形"), t("Scalene", "不等边三角形")];
const angleKindsOfTriangles: readonly Text[] = [t("Acute", "锐角三角形"), t("Right", "直角三角形"), t("Obtuse", "钝角三角形")];

export const classifyingTriangles: TopicDef = {
  id: "classifying-triangles",
  title: t("Classifying Triangles", "三角形的分类"),
  summary: t("Classify triangles by their sides and by their angles.", "按边和按角给三角形分类。"),
  prerequisites: ["angles-and-angle-measures"],
  encompasses: [{ topic: "angles-and-angle-measures", weight: 0.3 }],
  xp: 6,
  standards: ["CCSS.4.G.A.2"],
  knowledgePoints: [
    {
      id: "classifying-by-sides",
      title: t("Classifying by sides", "按边分类"),
      explanation: t(
        "By its sides, a triangle is\n\n- **equilateral** when all three sides are equal;\n- **isosceles** when at least two sides are equal;\n- **scalene** when no two sides are equal.\n\nEqual sides are often marked with matching tick marks. Every equilateral triangle is also isosceles; we name it by the more specific word.",
        "按边分，三角形可以是\n\n- **等边三角形**：三条边都相等；\n- **等腰三角形**：至少两条边相等；\n- **不等边三角形**：任意两条边都不相等。\n\n相等的边常用相同的短线标出。等边三角形也是等腰三角形；我们用更具体的名称称呼它。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let sides: [number, number, number];
        for (;;) {
          const s = rng.int(4, 15);
          const u = rng.int(4, 15);
          const v = rng.int(4, 15);
          sides = kind === 0 ? [s, s, s] : kind === 1 ? (rng.shuffle([s, s, u]) as [number, number, number]) : [s, u, v];
          const [p, q, r] = sides;
          const sorted = [...sides].sort((m, n) => m - n);
          if (sorted[0]! + sorted[1]! <= sorted[2]! + 1) continue;
          if (kind === 1 && u === s) continue;
          if (kind === 2 && (p === q || q === r || p === r)) continue;
          if (Math.max(p, q, r) > 2.2 * Math.min(p, q, r)) continue;
          break;
        }
        const [a, b, c] = sides;
        const points = triangleBySides(a, b, c);
        const [pa, pb, pc] = points;
        const reason = [
          t("all three sides are equal", "三条边都相等"),
          t("exactly two sides are equal", "恰有两条边相等"),
          t("no two sides are equal", "任意两条边都不相等"),
        ][kind]!;
        return {
          ...choiceProblem({
            prompt: t("Classify the triangle by its sides.", "按边给这个三角形分类。"),
            options: sideKinds,
            correct: kind,
            solution: t(
              `The sides are ${c}, ${a} and ${b}: ${reason.en}. The triangle is ${sideKinds[kind]!.en.toLowerCase()}.`,
              `三条边是 ${c}、${a}、${b}：${reason["zh-CN"]}，所以是${sideKinds[kind]!["zh-CN"]}。`,
            ),
          }),
          figure: figure(
            [
              { kind: "polygon", points },
              { kind: "side", a: pa, b: pb, text: `${c}` },
              { kind: "side", a: pb, b: pc, text: `${a}` },
              { kind: "side", a: pc, b: pa, text: `${b}` },
            ],
            `A triangle with sides ${c}, ${a} and ${b}.`,
            `一个三角形，三条边分别是 ${c}、${a}、${b}。`,
          ),
        };
      },
    },
    {
      id: "classifying-by-angles",
      title: t("Classifying by angles", "按角分类"),
      explanation: t(
        "By its largest angle, a triangle is\n\n- **acute** when all three angles are acute;\n- **right** when one angle is a right angle;\n- **obtuse** when one angle is obtuse.\n\nA triangle cannot have two right or obtuse angles, so its largest angle decides.",
        "按最大的角分，三角形可以是\n\n- **锐角三角形**：三个角都是锐角；\n- **直角三角形**：有一个角是直角；\n- **钝角三角形**：有一个角是钝角。\n\n三角形不可能有两个直角或钝角，所以由最大的角决定。",
      ),
      generate(rng) {
        const kind = rng.int(0, 2);
        let angles: number[];
        for (;;) {
          const big = [rng.int(61, 89), 90, rng.int(95, 140)][kind]!;
          const a = rng.int(15, 180 - big - 15);
          const b = 180 - big - a;
          if (b < 15 || b > big || a > big || (kind === 0 && (a === 90 || b === 90))) continue;
          angles = rng.shuffle([big, a, b]);
          break;
        }
        const list = angles.map((m) => `$${m}^\\circ$`);
        const largest = Math.max(...angles);
        const reason = [
          t(`every angle is less than $90^\\circ$`, `每个角都小于 $90^\\circ$`),
          t(`one angle is $90^\\circ$`, `有一个角是 $90^\\circ$`),
          t(`the $${largest}^\\circ$ angle is obtuse`, `$${largest}^\\circ$ 的角是钝角`),
        ][kind]!;
        return choiceProblem({
          prompt: t(
            `A triangle has angles of ${list.join(", ")}. Classify it by its angles.`,
            `一个三角形的三个角是 ${list.join("、")}。按角给它分类。`,
          ),
          options: angleKindsOfTriangles,
          correct: kind,
          solution: t(
            `The triangle is ${angleKindsOfTriangles[kind]!.en.toLowerCase()}: ${reason.en}.`,
            `这是${angleKindsOfTriangles[kind]!["zh-CN"]}：${reason["zh-CN"]}。`,
          ),
        });
      },
    },
  ],
};

export const isoscelesTriangles: TopicDef = {
  id: "isosceles-triangles",
  title: t("Isosceles and Equilateral Triangles", "等腰三角形与等边三角形"),
  summary: t(
    "Use equal base angles to find the angles of isosceles and equilateral triangles.",
    "利用底角相等求等腰三角形和等边三角形的角。",
  ),
  prerequisites: ["classifying-triangles", "angles-of-a-triangle"],
  encompasses: [
    { topic: "angles-of-a-triangle", weight: 0.6 },
    { topic: "classifying-triangles", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.8.G.A.5"],
  knowledgePoints: [
    {
      id: "base-angles",
      title: t("Base angles", "底角"),
      explanation: t(
        "In an isosceles triangle the two equal sides are the **legs**; the angle between them is the **vertex angle**, and the other two are the **base angles**. The base angles are equal.\n\nIf the vertex angle is $40^\\circ$, the base angles share $180^\\circ - 40^\\circ = 140^\\circ$, so each is $70^\\circ$. If a base angle is $70^\\circ$, the vertex angle is $180^\\circ - 2 \\cdot 70^\\circ = 40^\\circ$. In an equilateral triangle all three angles are equal, so each is $60^\\circ$.",
        "等腰三角形中相等的两边叫**腰**；两腰的夹角叫**顶角**，另外两个角叫**底角**。两个底角相等。\n\n若顶角是 $40^\\circ$，两个底角共占 $180^\\circ - 40^\\circ = 140^\\circ$，所以每个是 $70^\\circ$。若底角是 $70^\\circ$，顶角是 $180^\\circ - 2 \\cdot 70^\\circ = 40^\\circ$。等边三角形的三个角都相等，所以每个都是 $60^\\circ$。",
      ),
      generate(rng) {
        const base = rng.int(25, 80);
        const vertex = 180 - 2 * base;
        const points = triangleByAngles(base, base);
        const ticks: Mark[] = [
          { kind: "ticks", a: points[1], b: points[2], count: 1 },
          { kind: "ticks", a: points[2], b: points[0], count: 1 },
        ];
        if (base === 60 || rng.bool(0.5)) {
          return {
            ...numberProblem({
              prompt: t("The triangle is isosceles. Find the vertex angle $x$.", "这个三角形是等腰三角形。求顶角 $x$。"),
              answer: vertex,
              form: "integer",
              unit: "°",
              wrong: [180 - base, 90 - base, 180 - 3 * base > 0 ? 180 - 3 * base : base],
              solution: t(
                `The base angles are equal, so both are $${base}^\\circ$:${steps(`x = 180^\\circ - 2 \\cdot ${base}^\\circ = ${vertex}^\\circ`)}`,
                `两个底角相等，都是 $${base}^\\circ$：${steps(`x = 180^\\circ - 2 \\cdot ${base}^\\circ = ${vertex}^\\circ`)}`,
              ),
            }),
            figure: figure(
              [{ kind: "polygon", points }, ...ticks, ...triangleArcs(points, [deg(base), "", "x"])],
              `An isosceles triangle with its equal sides marked. One base angle is ${base}°; the vertex angle is x.`,
              `一个等腰三角形，相等的两边已标出。一个底角是 ${base}°，顶角是 x。`,
            ),
          };
        }
        return {
          ...numberProblem({
            prompt: t("The triangle is isosceles. Find the base angle $x$.", "这个三角形是等腰三角形。求底角 $x$。"),
            answer: base,
            form: "integer",
            unit: "°",
            wrong: [180 - vertex, 180 - 2 * vertex > 0 ? 180 - 2 * vertex : vertex, 90 - vertex > 0 ? 90 - vertex : 2 * base],
            solution: t(
              `The two base angles are equal and share $180^\\circ - ${vertex}^\\circ = ${2 * base}^\\circ$:${steps(`x = ${2 * base}^\\circ \\div 2 = ${base}^\\circ`)}`,
              `两个底角相等，共占 $180^\\circ - ${vertex}^\\circ = ${2 * base}^\\circ$：${steps(`x = ${2 * base}^\\circ \\div 2 = ${base}^\\circ`)}`,
            ),
          }),
          figure: figure(
            [{ kind: "polygon", points }, ...ticks, ...triangleArcs(points, rng.bool() ? ["x", "", deg(vertex)] : ["", "x", deg(vertex)])],
            `An isosceles triangle with its equal sides marked. The vertex angle is ${vertex}°; a base angle is x.`,
            `一个等腰三角形，相等的两边已标出。顶角是 ${vertex}°，一个底角是 x。`,
          ),
        };
      },
    },
    {
      id: "isosceles-angle-equations",
      title: t("Equations in isosceles triangles", "等腰三角形中的方程"),
      explanation: t(
        "Equal base angles let one variable describe all three angles. If each base angle is $x^\\circ$ and the vertex angle is $(2x + 20)^\\circ$, then $x + x + (2x + 20) = 180$, so $4x + 20 = 180$, $4x = 160$ and $x = 40$.\n\nA relationship stated in words works the same way: if the vertex angle is three times a base angle $x$, then $x + x + 3x = 180$ and $x = 36$.",
        "底角相等，所以一个变量就能表示三个角。若每个底角是 $x^\\circ$，顶角是 $(2x + 20)^\\circ$，则 $x + x + (2x + 20) = 180$，所以 $4x + 20 = 180$，$4x = 160$，$x = 40$。\n\n用文字给出的关系也一样：若顶角是底角 $x$ 的三倍，则 $x + x + 3x = 180$，$x = 36$。",
      ),
      keyPrerequisites: ["angles-of-a-triangle"],
      generate(rng) {
        for (;;) {
          const x = rng.int(25, 80);
          const vertex = 180 - 2 * x;
          if (rng.bool(0.4)) {
            const k = rng.pick([2, 3, 4, 5, 6, 7, 8]);
            if (180 % (k + 2) !== 0) continue;
            const base = 180 / (k + 2);
            const work = sumSteps(
              [
                [1, 0],
                [1, 0],
                [k, 0],
              ],
              180,
            );
            return numberProblem({
              prompt: t(
                `In an isosceles triangle, the vertex angle is ${k} times a base angle. Find a base angle $x$.`,
                `在一个等腰三角形中，顶角是底角的 ${k} 倍。求底角 $x$。`,
              ),
              answer: base,
              form: "integer",
              unit: "°",
              wrong: [intOr(180, k, k * base), intOr(180, k + 1, k * base), k * base],
              solution: t(
                `The angles are $x$, $x$ and $${k}x$, and they add up to $180^\\circ$:${chain(...work)}`,
                `三个角是 $x$、$x$、$${k}x$，和为 $180^\\circ$：${chain(...work)}`,
              ),
            });
          }
          const k = rng.int(1, 4);
          const d = vertex - k * x;
          if (Math.abs(d) > 60 || d === 0) continue;
          const work = sumSteps(
            [
              [1, 0],
              [1, 0],
              [k, d],
            ],
            180,
          );
          const points = triangleByAngles(x, x);
          return {
            ...numberProblem({
              prompt: t("The triangle is isosceles. Find $x$.", "这个三角形是等腰三角形。求 $x$。"),
              answer: x,
              form: "integer",
              solveFor: "x",
              wrong: [intOr(180 - d, k + 1, -x), intOr(180 - d, k, -x), vertex],
              solution: t(
                `The base angles are both $x^\\circ$, and the three angles add up to $180^\\circ$:${chain(...work)}`,
                `两个底角都是 $x^\\circ$，三个角之和为 $180^\\circ$：${chain(...work)}`,
              ),
            }),
            figure: figure(
              [
                { kind: "polygon", points },
                { kind: "ticks", a: points[1], b: points[2], count: 1 },
                { kind: "ticks", a: points[2], b: points[0], count: 1 },
                ...triangleArcs(points, ["x°", "", angleLabel(k, d)]),
              ],
              `An isosceles triangle with its equal sides marked. A base angle is x°; the vertex angle is ${angleLabel(k, d)}.`,
              `一个等腰三角形，相等的两边已标出。一个底角是 x°，顶角是 ${angleLabel(k, d)}。`,
            ),
          };
        }
      },
    },
  ],
};

const polygonNames: Record<number, Text> = {
  3: t("triangle", "三角形"),
  4: t("quadrilateral", "四边形"),
  5: t("pentagon", "五边形"),
  6: t("hexagon", "六边形"),
  7: t("heptagon", "七边形"),
  8: t("octagon", "八边形"),
  9: t("nonagon", "九边形"),
  10: t("decagon", "十边形"),
  12: t("dodecagon", "十二边形"),
};

/** polygonName names an n-gon: "hexagon", or "15-gon" when it has no common name. */
const polygonName = (n: number): Text => polygonNames[n] ?? t(`${n}-gon`, `${n} 边形`);

/** interiorAngle is the measure of an interior angle at vertex i of a polygon. */
function interiorAngle(points: readonly Point[], i: number): number {
  const n = points.length;
  const [p, v, q] = [points[(i + n - 1) % n]!, points[i]!, points[(i + 1) % n]!];
  const a = Math.atan2(p[1] - v[1], p[0] - v[0]) - Math.atan2(q[1] - v[1], q[0] - v[0]);
  return ((a * 180) / Math.PI + 720) % 360;
}

export const anglesOfPolygons: TopicDef = {
  id: "angles-of-polygons",
  title: t("Angles of Polygons", "多边形的内角"),
  summary: t(
    "Find the angle sum of a polygon, the angles of regular polygons, and missing angles.",
    "求多边形的内角和、正多边形的角以及未知角。",
  ),
  prerequisites: ["angles-of-a-triangle"],
  encompasses: [{ topic: "angles-of-a-triangle", weight: 0.4 }],
  xp: 12,
  knowledgePoints: [
    {
      id: "the-angle-sum-of-a-polygon",
      title: t("The angle sum of a polygon", "多边形的内角和"),
      explanation: t(
        "The diagonals from one vertex of a polygon with $n$ sides cut it into $n - 2$ triangles, and the triangles' angles together make up the polygon's angles. So the interior angles of an $n$-sided polygon add up to\n\n$$(n - 2) \\cdot 180^\\circ.$$\n\nA quadrilateral's angles add up to $2 \\cdot 180^\\circ = 360^\\circ$; a hexagon's add up to $4 \\cdot 180^\\circ = 720^\\circ$.",
        "从 $n$ 边形的一个顶点出发的对角线把它分成 $n - 2$ 个三角形，这些三角形的角合起来正好组成多边形的角。所以 $n$ 边形的内角和是\n\n$$(n - 2) \\cdot 180^\\circ.$$\n\n四边形的内角和是 $2 \\cdot 180^\\circ = 360^\\circ$；六边形的内角和是 $4 \\cdot 180^\\circ = 720^\\circ$。",
      ),
      figure: (() => {
        const points = [0, 1, 2, 3, 4, 5].map((i) => dir(90 + 60 * i, 3));
        return figure(
          [
            { kind: "polygon", points },
            ...[2, 3, 4].map((i): Mark => ({ kind: "segment", a: points[0]!, b: points[i]!, accent: true, dashed: true })),
          ],
          "A hexagon with the three diagonals from one vertex drawn, cutting it into four triangles.",
          "一个六边形，从一个顶点画出三条对角线，把它分成四个三角形。",
        );
      })(),
      generate(rng) {
        const n = rng.bool(0.5) ? rng.pick([4, 5, 6, 7, 8, 9, 10, 12]) : rng.int(11, 40);
        const sum = (n - 2) * 180;
        const name = polygonName(n);
        if (rng.bool(0.3)) {
          return numberProblem({
            prompt: t(
              `The interior angles of a polygon add up to $${sum}^\\circ$. How many sides does it have?`,
              `一个多边形的内角和是 $${sum}^\\circ$。它有几条边？`,
            ),
            answer: n,
            form: "integer",
            wrong: [n - 2, n - 1, sum / 180],
            solution: t(
              `The polygon splits into $${sum}^\\circ \\div 180^\\circ = ${n - 2}$ triangles, two fewer than its sides:${steps(`n = ${n - 2} + 2 = ${n}`)}`,
              `这个多边形可以分成 $${sum}^\\circ \\div 180^\\circ = ${n - 2}$ 个三角形，比边数少 2：${steps(`n = ${n - 2} + 2 = ${n}`)}`,
            ),
          });
        }
        const named = polygonNames[n] !== undefined && rng.bool(0.7);
        return numberProblem({
          prompt: named
            ? t(`What is the sum of the interior angles of a ${name.en}?`, `${name["zh-CN"]}的内角和是多少度？`)
            : t(`What is the sum of the interior angles of a polygon with $${n}$ sides?`, `一个 $${n}$ 边形的内角和是多少度？`),
          answer: sum,
          form: "integer",
          unit: "°",
          wrong: [n * 180, (n - 1) * 180, 360, intOr(sum, n, n * 360)],
          solution: t(
            `A polygon with $${n}$ sides splits into $${n - 2}$ triangles:${steps(`(${n} - 2) \\cdot 180^\\circ = ${sum}^\\circ`)}`,
            `$${n}$ 边形可以分成 $${n - 2}$ 个三角形：${steps(`(${n} - 2) \\cdot 180^\\circ = ${sum}^\\circ`)}`,
          ),
        });
      },
    },
    {
      id: "angles-of-regular-polygons",
      title: t("Regular polygons", "正多边形"),
      explanation: t(
        "A **regular** polygon has equal sides and equal angles, so each interior angle is the angle sum divided by $n$:\n\n$$\\frac{(n - 2) \\cdot 180^\\circ}{n}.$$\n\nAn **exterior angle** forms a linear pair with an interior angle. Walking around any convex polygon turns you once around, so its exterior angles add up to $360^\\circ$; in a regular polygon each is $360^\\circ \\div n$. For a regular octagon, each exterior angle is $45^\\circ$ and each interior angle is $180^\\circ - 45^\\circ = 135^\\circ$.",
        "**正多边形**的各边相等、各角相等，所以每个内角等于内角和除以 $n$：\n\n$$\\frac{(n - 2) \\cdot 180^\\circ}{n}.$$\n\n**外角**与相邻的内角是邻补角。沿任何凸多边形走一圈正好转一整圈，所以它的外角和是 $360^\\circ$；正多边形的每个外角是 $360^\\circ \\div n$。正八边形每个外角是 $45^\\circ$，每个内角是 $180^\\circ - 45^\\circ = 135^\\circ$。",
      ),
      generate(rng) {
        const n = rng.pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]);
        const exterior = 360 / n;
        const interior = 180 - exterior;
        const name = polygonName(n);
        const kind = rng.int(0, 2);
        if (kind === 0) {
          return numberProblem({
            prompt: t(`What is the measure of each interior angle of a regular ${name.en}?`, `正${name["zh-CN"]}的每个内角是多少度？`),
            answer: interior,
            form: "integer",
            unit: "°",
            wrong: [exterior, (n - 2) * 180, intOr(n * 180, n - 2, exterior)],
            solution: t(
              `The angle sum is $(${n} - 2) \\cdot 180^\\circ = ${(n - 2) * 180}^\\circ$, shared by $${n}$ equal angles:${steps(`${(n - 2) * 180}^\\circ \\div ${n} = ${interior}^\\circ`)}`,
              `内角和是 $(${n} - 2) \\cdot 180^\\circ = ${(n - 2) * 180}^\\circ$，由 $${n}$ 个相等的角平分：${steps(`${(n - 2) * 180}^\\circ \\div ${n} = ${interior}^\\circ`)}`,
            ),
          });
        }
        if (kind === 1) {
          return numberProblem({
            prompt: t(`What is the measure of each exterior angle of a regular ${name.en}?`, `正${name["zh-CN"]}的每个外角是多少度？`),
            answer: exterior,
            form: "integer",
            unit: "°",
            wrong: [interior, intOr(180, n, 360), 360 - exterior],
            solution: t(
              `The exterior angles add up to $360^\\circ$ and are equal:${steps(`360^\\circ \\div ${n} = ${exterior}^\\circ`)}`,
              `外角和是 $360^\\circ$，且各外角相等：${steps(`360^\\circ \\div ${n} = ${exterior}^\\circ`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `Each interior angle of a regular polygon measures $${interior}^\\circ$. How many sides does it have?`,
            `一个正多边形的每个内角是 $${interior}^\\circ$。它有几条边？`,
          ),
          answer: n,
          form: "integer",
          wrong: [intOr(360, interior, n + 2), intOr(180, exterior, n + 1), n + 2],
          solution: t(
            `Each exterior angle is $180^\\circ - ${interior}^\\circ = ${exterior}^\\circ$, and the exterior angles add up to $360^\\circ$:${steps(`n = 360^\\circ \\div ${exterior}^\\circ = ${n}`)}`,
            `每个外角是 $180^\\circ - ${interior}^\\circ = ${exterior}^\\circ$，外角和是 $360^\\circ$：${steps(`n = 360^\\circ \\div ${exterior}^\\circ = ${n}`)}`,
          ),
        });
      },
    },
    {
      id: "missing-angles-in-polygons",
      title: t("Missing angles in polygons", "多边形中的未知角"),
      explanation: t(
        "To find a missing angle of a polygon, subtract the known angles from the angle sum.\n\nThe angles of a quadrilateral add up to $360^\\circ$, so if three of them are $80^\\circ$, $95^\\circ$ and $110^\\circ$, the fourth is $360^\\circ - 80^\\circ - 95^\\circ - 110^\\circ = 75^\\circ$.",
        "求多边形的未知角，用内角和减去已知的角。\n\n四边形的内角和是 $360^\\circ$，所以若其中三个角是 $80^\\circ$、$95^\\circ$、$110^\\circ$，第四个角是 $360^\\circ - 80^\\circ - 95^\\circ - 110^\\circ = 75^\\circ$。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.pick([4, 4, 5]);
          const turns = Array.from({ length: n }, () => rng.int(50, 100));
          const total = turns.reduce((s, v) => s + v, 0);
          let phi = rng.int(0, 359);
          const points = turns.map((v) => {
            phi += (v * 360) / total;
            return dir(phi, 1, [0, 0]);
          });
          const shape = points.map(([px, py]): Point => [px * 5, py * 3.5]);
          const angles = shape.map((_, i) => Math.round(interiorAngle(shape, i)));
          const sum = (n - 2) * 180;
          const asked = rng.int(0, n - 1);
          const known = angles.filter((_, i) => i !== asked);
          const knownSum = known.reduce((s, v) => s + v, 0);
          const answer = sum - knownSum;
          if ([...known, answer].some((m) => m < 45 || m > 165 || m === 90 || m === 180)) continue;
          const labels = angles.map((m, i) => (i === asked ? "x" : deg(m)));
          const marks: Mark[] = [
            { kind: "polygon", points: shape },
            ...shape.map(
              (v, i): Mark => ({
                kind: "arc",
                vertex: v,
                from: shape[(i + 1) % n]!,
                to: shape[(i + n - 1) % n]!,
                label: labels[i]!,
                accent: i === asked,
              }),
            ),
          ];
          const name = polygonName(n);
          const knownTex = known.map((m) => `${m}^\\circ`).join(" - ");
          return {
            ...numberProblem({
              prompt: t("Find $x$.", "求 $x$。"),
              answer,
              form: "integer",
              unit: "°",
              wrong: [360 - knownSum, (n - 1) * 180 - knownSum, 180 - answer],
              solution: t(
                `The angles of a ${name.en} add up to $(${n} - 2) \\cdot 180^\\circ = ${sum}^\\circ$:${steps(`x = ${sum}^\\circ - ${knownTex} = ${answer}^\\circ`)}`,
                `${name["zh-CN"]}的内角和是 $(${n} - 2) \\cdot 180^\\circ = ${sum}^\\circ$：${steps(`x = ${sum}^\\circ - ${knownTex} = ${answer}^\\circ`)}`,
              ),
            }),
            figure: figure(
              marks,
              `A ${name.en} with angles ${known.map((m) => `${m}°`).join(", ")} and x.`,
              `一个${name["zh-CN"]}，各角为 ${known.map((m) => `${m}°`).join("、")} 和 x。`,
            ),
          };
        }
      },
    },
  ],
};

/** angleTopics are the topics on angles, triangles and polygons. */
export const angleTopics: readonly TopicDef[] = [
  anglesAndAngleMeasures,
  complementaryAndSupplementaryAngles,
  verticalAngles,
  parallelLinesAndTransversals,
  classifyingTriangles,
  anglesOfATriangle,
  exteriorAnglesOfTriangles,
  isoscelesTriangles,
  anglesOfPolygons,
];
