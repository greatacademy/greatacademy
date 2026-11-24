import type { Figure, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { linear, type Mark, type Point, sketch } from "@ga/subject-math";
import { gradeDrawings } from "../explanation-drawings-grades.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";
import { remainingDrawings10 } from "../explanation-drawings-remaining-10.ts";
import { article, numberProblem, steps } from "../problems.ts";
import { type Pair, picked, type Walk, type Wrong } from "./early-grades-more-kit.ts";
import { chosen, drawn, lesson, valued, withIntro } from "./grade-6-kit.ts";
import { answered, point } from "./upper-grades-kit.ts";

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

/** collecting says how to finish solving for x from the lines that remain: divide only when a step is left after collecting. */
const collecting = (rest: readonly string[]): Pair =>
  rest.length > 1
    ? ["Collect $x$ on one side, then divide:", "把 $x$ 集中到一边，再相除："]
    : ["Collect $x$ on one side:", "把 $x$ 集中到一边："];

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
  title: t("Angles and Measures of Angles", "角与角的度量"),
  summary: t("Classify angles by their measures, and add and subtract adjacent angles.", "按度数给角分类，并对相邻的角做加减。"),
  prerequisites: [],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.4.MD.C.5", "CCSS.4.MD.C.7"],
  intro: t(
    "The hands of a clock, the blades of a pair of scissors and the covers of a book all make angles. The wider they open, the bigger the angle.\n\nCheck: a book opened flat on the table makes a straight angle, $180^\\circ$.\n\nIn this lesson we name angles by their size and add and subtract angles that sit side by side.",
    "钟面的指针、剪刀的两片刀刃、书的两面封皮都能组成角。张得越开，角就越大。\n\n检验：书摊平在桌上，两面封皮组成平角，$180^\\circ$。\n\n本课我们按大小给角命名，并对并排的角做加减。",
  ),
  knowledgePoints: [
    point(
      "classifying-angles",
      ["Kinds of angles", "角的分类"],
      [
        "Open scissors a little and the blades make an acute angle, less than $90^\\circ$. The corner of a book is a right angle, exactly $90^\\circ$, marked with a small square. A laptop opened wide makes an obtuse angle, between $90^\\circ$ and $180^\\circ$. A book laid open flat makes a straight angle, $180^\\circ$.\n\nCheck: $50^\\circ$ is less than $90^\\circ$, so a $50^\\circ$ angle is acute.\n\n> **Watch out.** Compare the angle with $90^\\circ$. How long the rays are drawn does not matter.",
        "剪刀张开一点，两片刀刃组成锐角，小于 $90^\\circ$。书的角是直角，正好 $90^\\circ$，用小正方形标出。笔记本电脑张得很开，组成钝角，在 $90^\\circ$ 和 $180^\\circ$ 之间。书摊平，两面封皮组成平角，$180^\\circ$。\n\n检验：$50^\\circ$ 小于 $90^\\circ$，所以 $50^\\circ$ 的角是锐角。\n\n> **注意。** 要拿角和 $90^\\circ$ 比，边画得长短没有关系。",
      ],
      (rng) => {
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
        const opt = (i: number): Pair => [angleKinds[i]!.en, angleKinds[i]!["zh-CN"]];
        const defs: readonly Pair[] = [
          ["An acute angle is less than 90°.", "锐角小于 90°。"],
          ["A right angle is exactly 90°, marked with a small square.", "直角正好是 90°，用小正方形标出。"],
          ["An obtuse angle is between 90° and 180°.", "钝角在 90° 和 180° 之间。"],
          ["A straight angle is 180°: its rays make a line.", "平角是 180°：两条边成一条直线。"],
        ];
        const look: readonly Pair[] = [
          [`The angle is $${m}^\\circ$, less than $90^\\circ$.`, `这个角是 $${m}^\\circ$，小于 $90^\\circ$。`],
          ["The small square marks exactly $90^\\circ$.", "小正方形表示正好 $90^\\circ$。"],
          [
            `The angle is $${m}^\\circ$, more than $90^\\circ$ and less than $180^\\circ$.`,
            `这个角是 $${m}^\\circ$，大于 $90^\\circ$，小于 $180^\\circ$。`,
          ],
          ["The two rays make one straight line, $180^\\circ$.", "两条边成一条直线，$180^\\circ$。"],
        ];
        const name: readonly Pair[] = [
          ["So it is an acute angle.", "所以它是锐角。"],
          ["So it is a right angle.", "所以它是直角。"],
          ["So it is an obtuse angle.", "所以它是钝角。"],
          ["So it is a straight angle.", "所以它是平角。"],
        ];
        const check: readonly Pair[] = [
          [`It is $${90 - m}^\\circ$ short of a right angle.`, `它比直角少 $${90 - m}^\\circ$。`],
          [
            "Two such angles side by side make a straight line: $90^\\circ + 90^\\circ = 180^\\circ$.",
            "两个这样的角并在一起成一条直线：$90^\\circ + 90^\\circ = 180^\\circ$。",
          ],
          [
            `It is $${m - 90}^\\circ$ more than a right angle and $${180 - m}^\\circ$ less than a straight angle.`,
            `它比直角多 $${m - 90}^\\circ$，比平角少 $${180 - m}^\\circ$。`,
          ],
          [
            "It is two right angles side by side: $90^\\circ + 90^\\circ = 180^\\circ$.",
            "它是两个直角并在一起：$90^\\circ + 90^\\circ = 180^\\circ$。",
          ],
        ];
        return picked(
          rng,
          ["What kind of angle is shown?", "图中是什么角？"],
          opt(kind),
          [0, 1, 2, 3].filter((i) => i !== kind).map((i) => [opt(i), defs[i]![0], defs[i]![1]] as const),
          [
            [["Compare with $90^\\circ$", "和 $90^\\circ$ 比"], look[kind]!],
            [["Name it", "说出名称"], name[kind]!],
          ],
          check[kind]!,
          figure(
            marks,
            m === 90 ? "An angle marked as a right angle." : `An angle of ${m}°.`,
            m === 90 ? "一个标有直角记号的角。" : `一个 ${m}° 的角。`,
          ),
        );
      },
      gradeDrawings["classifying-angles"]!,
    ),
    point(
      "adjacent-angles",
      ["Adjacent angles", "相邻的角"],
      [
        "Two slices of pie sit side by side with their points together at $O$. One slice is $\\angle AOB = 45^\\circ$ and the other is $\\angle BOC = 65^\\circ$. Together they make $\\angle AOC = 45^\\circ + 65^\\circ = 110^\\circ$.\n\nCheck: $110^\\circ - 45^\\circ = 65^\\circ$.\n\n> **Watch out.** $\\angle AOC$ is the whole. To find a part, subtract the other part from it. Do not add.",
        "两块馅饼尖对尖并排放着，尖都在 $O$ 点。一块是 $\\angle AOB = 45^\\circ$，另一块是 $\\angle BOC = 65^\\circ$。合起来是 $\\angle AOC = 45^\\circ + 65^\\circ = 110^\\circ$。\n\n检验：$110^\\circ - 45^\\circ = 65^\\circ$。\n\n> **注意。** $\\angle AOC$ 是整个角。求其中一部分，要用它减去另一部分，不能相加。",
      ],
      (rng) => {
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
          return answered(
            [
              `In the figure, $\\angle AOB = ${a}^\\circ$ and $\\angle BOC = ${b}^\\circ$. Find $\\angle AOC$.`,
              `如图，$\\angle AOB = ${a}^\\circ$，$\\angle BOC = ${b}^\\circ$。求 $\\angle AOC$。`,
            ],
            a + b,
            [
              [
                ["See the parts", "看清各部分"],
                [
                  "$OB$ lies inside $\\angle AOC$, so it splits it into $\\angle AOB$ and $\\angle BOC$.",
                  "$OB$ 在 $\\angle AOC$ 内部，把它分成 $\\angle AOB$ 和 $\\angle BOC$。",
                ],
              ],
              [
                ["Add", "相加"],
                [
                  `$\\angle AOC = ${a}^\\circ + ${b}^\\circ = ${a + b}^\\circ$.`,
                  `$\\angle AOC = ${a}^\\circ + ${b}^\\circ = ${a + b}^\\circ$。`,
                ],
              ],
            ],
            [`Subtract back: $${a + b}^\\circ - ${a}^\\circ = ${b}^\\circ$.`, `减回去：$${a + b}^\\circ - ${a}^\\circ = ${b}^\\circ$。`],
            [
              [Math.abs(a - b), "That subtracts the two parts. Parts side by side add.", "这是把两部分相减了。并排的角要相加。"],
              [
                180 - a - b,
                "That takes the parts from a straight angle, but $\\angle AOC$ is not a straight angle.",
                "这是用平角减去两部分，但 $\\angle AOC$ 不是平角。",
              ],
              [180 - a, "That takes $\\angle AOB$ from a straight angle.", "这是用平角减去 $\\angle AOB$。"],
            ],
            { form: "integer", unit: "°", figure: fig },
          );
        }
        return answered(
          [
            `In the figure, $\\angle AOC = ${a + b}^\\circ$ and $\\angle AOB = ${a}^\\circ$. Find $\\angle BOC$.`,
            `如图，$\\angle AOC = ${a + b}^\\circ$，$\\angle AOB = ${a}^\\circ$。求 $\\angle BOC$。`,
          ],
          b,
          [
            [
              ["See the whole", "看清整体"],
              [
                "$\\angle AOC$ is the whole, made of $\\angle AOB$ and $\\angle BOC$.",
                "$\\angle AOC$ 是整个角，由 $\\angle AOB$ 和 $\\angle BOC$ 组成。",
              ],
            ],
            [
              ["Subtract", "相减"],
              [
                `$\\angle BOC = ${a + b}^\\circ - ${a}^\\circ = ${b}^\\circ$.`,
                `$\\angle BOC = ${a + b}^\\circ - ${a}^\\circ = ${b}^\\circ$。`,
              ],
            ],
          ],
          [`Add back: $${a}^\\circ + ${b}^\\circ = ${a + b}^\\circ$.`, `加回去：$${a}^\\circ + ${b}^\\circ = ${a + b}^\\circ$。`],
          [
            [2 * a + b, "That adds the part to the whole instead of subtracting.", "这是把部分加到整体上了，应该相减。"],
            [a + b, "That is the whole angle, not the part.", "这是整个角，不是要求的部分。"],
            [180 - a - b, "That takes the whole from a straight angle.", "这是用平角减去整个角。"],
          ],
          { form: "integer", unit: "°", figure: fig },
        );
      },
      gradeDrawings["adjacent-angles"]!,
    ),
  ],
};

/** equalAnglesInAnAngle shares an angle among equal smaller angles cut by rays from its vertex. */
export const equalAnglesInAnAngle = point(
  "an-angle-cut-into-equal-angles",
  ["An angle cut into equal angles", "把角平均分"],
  [
    "A paper fan opens to $120^\\circ$ and has 4 equal sections. The sections fill the whole fan, so each one is $120^\\circ \\div 4 = 30^\\circ$.\n\nCheck: $4 \\times 30^\\circ = 120^\\circ$.\n\n> **Watch out.** Divide by the number of equal angles, not by the number of rays. 4 sections have 5 rays.",
    "一把纸扇打开到 $120^\\circ$，分成 4 个相等的扇面。扇面合起来是整把扇子，所以每个是 $120^\\circ \\div 4 = 30^\\circ$。\n\n检验：$4 \\times 30^\\circ = 120^\\circ$。\n\n> **注意。** 要除以相等的角的个数，不是射线的条数。4 个扇面有 5 条边。",
  ],
  (rng) => {
    const k = rng.int(2, 6);
    const each = rng.int(5, 30);
    const whole = k * each;
    return answered(
      [
        `Rays from the vertex cut an angle of $${whole}^\\circ$ into $${k}$ equal angles. What is the measure of each, in degrees?`,
        `从顶点引出的射线把 $${whole}^\\circ$ 的角分成 $${k}$ 个相等的角。每个角是多少度？`,
      ],
      each,
      [
        [
          ["The parts fill the whole", "各部分合成整体"],
          [`The ${k} equal angles together make $${whole}^\\circ$.`, `${k} 个相等的角合起来是 $${whole}^\\circ$。`],
        ],
        [
          ["Divide", "相除"],
          [`$${whole} \\div ${k} = ${each}$.`, `$${whole} \\div ${k} = ${each}$。`],
        ],
      ],
      [
        `Add the equal angles: $${Array.from({ length: k }, () => each).join(" + ")} = ${whole}$.`,
        `把相等的角加起来：$${Array.from({ length: k }, () => each).join(" + ")} = ${whole}$。`,
      ],
      [
        ...(whole % (k + 1) === 0
          ? ([
              [
                whole / (k + 1),
                `That divides by the ${k + 1} rays, not the ${k} angles.`,
                `这是除以 ${k + 1} 条射线，应该除以 ${k} 个角。`,
              ],
            ] as const)
          : []),
        [whole - k, `That subtracts ${k} instead of dividing.`, `这是减去 ${k}，应该相除。`],
        [whole * k, `That multiplies by ${k} instead of dividing.`, `这是乘 ${k}，应该相除。`],
      ],
      { form: "integer", unit: "°" },
    );
  },
  gradeDrawings2["angles-and-angle-measures#an-angle-cut-into-equal-angles"]!,
);

/** splitAngle draws a right or straight angle split in two from direction base: the known part labeled a°, the other x, the known one first or second. */
function splitAngle(total: 90 | 180, a: number, base: number, knownFirst: boolean): Figure {
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

/** splitAngleFor draws a right or straight angle split in two: the known part labeled a°, the other x, in either order. */
function splitAngleFor(rng: Rng, total: 90 | 180, a: number): Figure {
  const base = total === 180 ? 0 : rng.pick([0, 15, 30]);
  return splitAngle(total, a, base, rng.bool());
}

/** partnerProblem asks for the complement or supplement of a°, as a number or from a split figure, in labelled steps with a check. */
function partnerProblem(rng: Rng, total: 90 | 180, a: number, offs: readonly (readonly [number, string, string])[]) {
  const [word, wordZh, whole, wholeZh] =
    total === 90 ? ["complement", "余角", "right", "直角"] : ["supplement", "补角", "straight", "平角"];
  const pairWord = total === 90 ? ["Complementary", "互余"] : ["Supplementary", "互补"];
  const inFigure = rng.bool();
  const walk: Walk[] = [
    [
      ["Use the total", "用总和"],
      inFigure
        ? [
            `The two angles make a ${whole} angle, so they add up to $${total}^\\circ$.`,
            `两个角合成一个${wholeZh}，所以和为 $${total}^\\circ$。`,
          ]
        : [`${pairWord[0]} angles add up to $${total}^\\circ$.`, `${pairWord[1]}的两个角和为 $${total}^\\circ$。`],
    ],
    [
      ["Subtract the known angle", "减去已知角"],
      ["Take the known angle away from the total:", "从总和中减去已知角："],
      [`${inFigure ? "x = " : ""}${total}^\\circ - ${a}^\\circ = ${total - a}^\\circ`],
    ],
  ];
  return valued(
    inFigure
      ? [`The two angles in the figure form a ${whole} angle. Find $x$.`, `图中两个角合起来是一个${wholeZh}。求 $x$。`]
      : [`What is the ${word} of ${article(a)} $${a}^\\circ$ angle?`, `$${a}^\\circ$ 的角的${wordZh}是多少度？`],
    total - a,
    walk,
    [
      `Add the two angles back: $${a}^\\circ + ${total - a}^\\circ = ${total}^\\circ$.`,
      `把两个角加回去：$${a}^\\circ + ${total - a}^\\circ = ${total}^\\circ$。`,
    ],
    offs,
    { unit: "°", ...(inFigure && { figure: splitAngleFor(rng, total, a) }) },
  );
}

/** complementaryAndSupplementaryAngles finds the complement and the supplement of an angle. */
export const complementaryAndSupplementaryAngles: TopicDef = withIntro(
  {
    id: "complementary-and-supplementary-angles",
    title: t("Complementary and Supplementary Angles", "互余与互补的角"),
    summary: t("Find the complement and the supplement of an angle.", "求一个角的余角和补角。"),
    prerequisites: ["angles-and-angle-measures"],
    encompasses: [],
    xp: 8,
    standards: ["CCSS.7.G.B.5"],
    knowledgePoints: [
      lesson(
        "complementary-angles",
        ["Complementary angles", "互余的角"],
        [
          [
            "Two angles are **complementary** when their measures add up to $90^\\circ$; each is the **complement** of the other. Side by side, they make a right angle. The complement of $35^\\circ$ is $90^\\circ - 35^\\circ = 55^\\circ$.",
            "和为 $90^\\circ$ 的两个角**互余**，每个角是另一个角的**余角**。两个角并排放在一起，合成一个直角。$35^\\circ$ 的余角是 $90^\\circ - 35^\\circ = 55^\\circ$。",
          ],
          ["$35^\\circ + 55^\\circ = 90^\\circ$, a right angle.", "$35^\\circ + 55^\\circ = 90^\\circ$，正好是直角。"],
          [
            "The complement comes from $90^\\circ$, not $180^\\circ$: $180^\\circ - 35^\\circ$ is the supplement.",
            "余角是从 $90^\\circ$ 里减，不是 $180^\\circ$：$180^\\circ - 35^\\circ$ 是补角。",
          ],
        ],
        (rng) => {
          const a = rng.int(8, 82);
          return partnerProblem(rng, 90, a, [
            [180 - a, "That is the supplement, taken from $180^\\circ$.", "这是补角，是从 $180^\\circ$ 里减的。"],
            [a, "That is the given angle itself.", "这是已知角本身。"],
            [90 + a, "That adds the angle to $90^\\circ$ instead of subtracting it.", "这是把这个角加到 $90^\\circ$ 上，而不是减去它。"],
          ]);
        },
        splitAngle(90, 35, 15, true),
      ),
      lesson(
        "supplementary-angles",
        ["Supplementary angles", "互补的角"],
        [
          [
            "Two angles are **supplementary** when their measures add up to $180^\\circ$; each is the **supplement** of the other. Side by side, they make a straight angle, a **linear pair**. The supplement of $35^\\circ$ is $180^\\circ - 35^\\circ = 145^\\circ$.",
            "和为 $180^\\circ$ 的两个角**互补**，每个角是另一个角的**补角**。两个角并排放在一起，合成一个平角，称为**邻补角**。$35^\\circ$ 的补角是 $180^\\circ - 35^\\circ = 145^\\circ$。",
          ],
          ["$35^\\circ + 145^\\circ = 180^\\circ$, a straight line.", "$35^\\circ + 145^\\circ = 180^\\circ$，正好是一条直线。"],
          [
            "A straight angle is $180^\\circ$, not $360^\\circ$: a whole turn is two straight angles.",
            "平角是 $180^\\circ$，不是 $360^\\circ$：一整圈是两个平角。",
          ],
        ],
        (rng) => {
          const a = rng.int(10, 170);
          return partnerProblem(rng, 180, a, [
            ...(a < 90
              ? [[90 - a, "That is the complement, taken from $90^\\circ$.", "这是余角，是从 $90^\\circ$ 里减的。"] as const]
              : []),
            [a, "That is the given angle itself.", "这是已知角本身。"],
            [
              360 - a,
              "That takes the angle from a whole turn, $360^\\circ$, not from a straight angle.",
              "这是从一整圈 $360^\\circ$ 里减，而不是从平角里减。",
            ],
          ]);
        },
        splitAngle(180, 35, 0, true),
      ),
    ],
  },
  [
    "A door opened $30^\\circ$ from the wall leaves $60^\\circ$ to swing before it stands square to the wall at $90^\\circ$.",
    "一扇门从墙边打开了 $30^\\circ$，再转 $60^\\circ$ 就和墙成 $90^\\circ$ 的直角。",
  ],
  ["$30^\\circ + 60^\\circ = 90^\\circ$.", "$30^\\circ + 60^\\circ = 90^\\circ$。"],
  [
    "find the complement and the supplement of an angle, and split right and straight angles.",
    "学习求一个角的余角和补角，并把直角和平角分开计算。",
  ],
);

/** chain writes solution steps, dropping a line that repeats the one before it. */
const chain = (...lines: string[]) => steps(...lines.filter((l, i) => l !== lines[i - 1]));

/** intOr is a / b when it is a whole number, and fallback otherwise. */
const intOr = (a: number, b: number, fallback: number) => (b !== 0 && Number.isInteger(a / b) ? a / b : fallback);

/** whenWhole lists a / b with its reason only when it is a whole number. */
const whenWhole = (a: number, b: number, en: string, zh: string): (readonly [number, string, string])[] =>
  b !== 0 && Number.isInteger(a / b) ? [[a / b, en, zh]] : [];

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

/** subst writes c·x + d with a number put in for x: "3 \\cdot 20 + 10". */
function subst(c: number, d: number, x: number): string {
  const head = c === 1 ? `${x}` : `${c} \\cdot ${x}`;
  return d === 0 ? head : `${head} ${d < 0 ? "-" : "+"} ${Math.abs(d)}`;
}

/** verticalAngles finds angles where two lines cross, from vertical angles and linear pairs. */
export const verticalAngles: TopicDef = withIntro(
  {
    id: "vertical-angles",
    title: t("Vertical Angles", "对顶角"),
    summary: t(
      "Use vertical angles and linear pairs to find unknown angles where two lines cross.",
      "利用对顶角和邻补角求两直线相交处的未知角。",
    ),
    prerequisites: ["complementary-and-supplementary-angles", "equations-with-variables-on-both-sides"],
    encompasses: [],
    xp: 10,
    standards: ["CCSS.7.G.B.5"],
    knowledgePoints: [
      lesson(
        "vertical-angles-and-linear-pairs",
        ["Vertical angles and linear pairs", "对顶角与邻补角"],
        [
          [
            "Two crossing lines form four angles. Opposite angles are **vertical angles**, and they are equal. Neighboring angles form a linear pair, so they add up to $180^\\circ$. If one angle is $50^\\circ$, the one opposite is $50^\\circ$, and each of the other two is $180^\\circ - 50^\\circ = 130^\\circ$.",
            "两条相交直线形成四个角。相对的两个角是**对顶角**，它们相等。相邻的两个角是邻补角，和为 $180^\\circ$。若一个角是 $50^\\circ$，它的对顶角也是 $50^\\circ$，另外两个角都是 $180^\\circ - 50^\\circ = 130^\\circ$。",
          ],
          ["All four add up to a whole turn: $50 + 130 + 50 + 130 = 360$.", "四个角加起来是一整圈：$50 + 130 + 50 + 130 = 360$。"],
          [
            "Vertical angles sit across the crossing from each other, not side by side; side by side they add to $180^\\circ$.",
            "对顶角隔着交点相对，不是并排的；并排的两个角和为 $180^\\circ$。",
          ],
        ],
        (rng) => {
          const a = rng.pick([rng.int(30, 80), rng.int(100, 150)]);
          const known = rng.int(0, 3);
          const opposite = rng.bool();
          const asked = (known + (opposite ? 2 : rng.pick([1, 3]))) % 4;
          const m = known % 2 === 0 ? a : 180 - a;
          const answer = opposite ? m : 180 - m;
          return valued(
            ["Two lines cross as shown. Find $x$.", "两条直线如图相交。求 $x$。"],
            answer,
            opposite
              ? [
                  [
                    ["Name the pair", "判断角的关系"],
                    [
                      `$x$ is across the crossing from the $${m}^\\circ$ angle, so they are vertical angles.`,
                      `$x$ 与 $${m}^\\circ$ 的角隔着交点相对，所以是对顶角。`,
                    ],
                  ],
                  [["Use equal angles", "用相等关系"], ["Vertical angles are equal:", "对顶角相等："], [`x = ${m}^\\circ`]],
                ]
              : [
                  [
                    ["Name the pair", "判断角的关系"],
                    [
                      `$x$ sits beside the $${m}^\\circ$ angle on a straight line, so they form a linear pair.`,
                      `$x$ 与 $${m}^\\circ$ 的角在一条直线上并排，所以是邻补角。`,
                    ],
                  ],
                  [
                    ["Subtract from 180°", "用 180° 相减"],
                    ["A linear pair adds up to $180^\\circ$:", "邻补角和为 $180^\\circ$："],
                    [`x = 180^\\circ - ${m}^\\circ = ${180 - m}^\\circ`],
                  ],
                ],
            opposite
              ? [
                  `The angle between them makes a linear pair with each: it is $${180 - m}^\\circ$, and $180^\\circ - ${180 - m}^\\circ = ${m}^\\circ$.`,
                  `夹在中间的角与它们都是邻补角：它是 $${180 - m}^\\circ$，$180^\\circ - ${180 - m}^\\circ = ${m}^\\circ$。`,
                ]
              : [
                  `$${m}^\\circ + ${180 - m}^\\circ = 180^\\circ$, a straight line.`,
                  `$${m}^\\circ + ${180 - m}^\\circ = 180^\\circ$，正好是一条直线。`,
                ],
            [
              opposite
                ? [
                    180 - m,
                    "That is the neighboring angle; $x$ is across the crossing, so it is equal.",
                    "这是相邻的角；$x$ 隔着交点相对，所以相等。",
                  ]
                : [m, "That treats $x$ as opposite the known angle, but it is beside it.", "这是把 $x$ 当成了对顶角，但它与已知角相邻。"],
              ...(m < 90
                ? [
                    [
                      90 - m,
                      "That is the complement, but the angles here meet on a straight line.",
                      "这是余角，但这里的角是在一条直线上相接的。",
                    ] as const,
                  ]
                : []),
              [360 - m, "That takes the angle from a whole turn instead of a straight line.", "这是从一整圈里减，而不是从一条直线里减。"],
            ],
            {
              unit: "°",
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
            },
          );
        },
        drawn(gradeDrawings3["vertical-angles#vertical-angles-and-linear-pairs"]),
      ),
      lesson(
        "equations-from-crossing-lines",
        ["Equations from crossing lines", "由相交直线列方程"],
        [
          [
            "When angles are written with a variable, the angle relationships give equations: vertical angles are equal, and a linear pair adds up to $180^\\circ$. If vertical angles measure $(3x + 10)^\\circ$ and $(5x - 30)^\\circ$, then $3x + 10 = 5x - 30$, so $40 = 2x$ and $x = 20$.",
            "当角用含变量的式子表示时，角之间的关系给出方程：对顶角相等，邻补角之和为 $180^\\circ$。若一对对顶角为 $(3x + 10)^\\circ$ 和 $(5x - 30)^\\circ$，则 $3x + 10 = 5x - 30$，所以 $40 = 2x$，$x = 20$。",
          ],
          [
            "Both angles come out equal at $x = 20$: $3 \\cdot 20 + 10 = 70$ and $5 \\cdot 20 - 30 = 70$.",
            "$x = 20$ 时两个角相等：$3 \\cdot 20 + 10 = 70$，$5 \\cdot 20 - 30 = 70$。",
          ],
          [
            "Check which pair you have first: setting a linear pair equal, or adding vertical angles to $180^\\circ$, gives the wrong equation.",
            "先看清是哪一种角：把邻补角设为相等，或把对顶角加成 $180^\\circ$，列出的方程都是错的。",
          ],
        ],
        (rng) => {
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
          const pair = [`$${angleTex(c1, d1)}$ and $${angleTex(c2, d2)}$`, `$${angleTex(c1, d1)}$ 和 $${angleTex(c2, d2)}$`];
          const lines = vertical
            ? equalSteps(c1, d1, c2, d2)
            : sumSteps(
                [
                  [c1, d1],
                  [c2, d2],
                ],
                180,
              );
          const other = vertical ? m : 180 - m;
          return valued(
            ["Two lines cross as shown. Find $x$.", "两条直线如图相交。求 $x$。"],
            x,
            [
              vertical
                ? [
                    ["Write the equation", "列方程"],
                    [`${pair[0]} are vertical angles, so they are equal:`, `${pair[1]} 是对顶角，所以相等：`],
                    lines.slice(0, 1),
                  ]
                : [
                    ["Write the equation", "列方程"],
                    [`${pair[0]} form a linear pair, so they add up to $180^\\circ$:`, `${pair[1]} 是邻补角，和为 $180^\\circ$：`],
                    lines.slice(0, 1),
                  ],
              [
                ["Solve for x", "解出 x"],
                ["Collect the $x$ terms and undo each operation:", "合并含 $x$ 的项，再逐步还原："],
                lines.slice(1).filter((l, i, all) => l !== (i === 0 ? lines[0] : all[i - 1])),
              ],
            ],
            [
              `At $x = ${x}$: $${subst(c1, d1, x)} = ${m}$ and $${subst(c2, d2, x)} = ${other}$, ${vertical ? "equal, as vertical angles must be" : `and $${m} + ${other} = 180$`}.`,
              `$x = ${x}$ 时：$${subst(c1, d1, x)} = ${m}$，$${subst(c2, d2, x)} = ${other}$，${vertical ? "两者相等，符合对顶角" : `$${m} + ${other} = 180$`}。`,
            ],
            vertical
              ? [
                  [m, "That is the measure of the angles, not $x$.", "这是角的度数，不是 $x$。"],
                  ...whenWhole(
                    180 - d1 - d2,
                    c1 + c2,
                    "That adds the angles to $180^\\circ$, but vertical angles are equal.",
                    "这是让两角之和为 $180^\\circ$，但对顶角是相等的。",
                  ),
                  ...whenWhole(d1 - d2, c1 - c2, "That moves the constants across with the wrong signs.", "移项时常数的符号弄错了。"),
                ]
              : [
                  [m, "That is the measure of an angle, not $x$.", "这是一个角的度数，不是 $x$。"],
                  ...whenWhole(
                    d2 - d1,
                    c1 - c2,
                    "That sets the angles equal, but a linear pair adds up to $180^\\circ$.",
                    "这是让两角相等，但邻补角之和为 $180^\\circ$。",
                  ),
                  ...whenWhole(
                    90 - d1 - d2,
                    c1 + c2,
                    "That adds the angles to $90^\\circ$, but a linear pair makes a straight line.",
                    "这是让两角之和为 $90^\\circ$，但邻补角合成一条直线。",
                  ),
                ],
            { solveFor: "x", figure: fig },
          );
        },
        drawn(gradeDrawings3["vertical-angles#equations-from-crossing-lines"]),
      ),
    ],
  },
  [
    "Two straight roads cross at a junction. The corner one driver sees and the corner across the junction from it open by the same amount.",
    "两条笔直的路在路口相交。一个司机看到的那个角，和路口对面的那个角张开的大小一样。",
  ],
  [
    "Each of those corners and the corner between them fill a straight road: both are $180^\\circ$ minus the same angle.",
    "这两个角都和夹在中间的角合成一条直路：它们都是 $180^\\circ$ 减去同一个角。",
  ],
  [
    "use vertical angles and linear pairs to find angles where two lines cross, and solve equations from them.",
    "学习利用对顶角和邻补角求两直线相交处的角，并由它们列方程求解。",
  ],
);

/** theAnglesAroundACrossing is the third knowledge point of vertical angles: the four angles at a crossing from the sum of one vertical pair. */
export const theAnglesAroundACrossing = lesson(
  "the-angles-around-a-crossing",
  ["The angles around a crossing", "交点周围的角"],
  [
    [
      "Two crossing lines make four angles that total $360^\\circ$, in two equal pairs. If one vertical pair adds up to $100^\\circ$, each of those angles is $50^\\circ$, each of the other two is $180^\\circ - 50^\\circ = 130^\\circ$, and those two add up to $260^\\circ$.",
      "两条相交直线形成四个角，总和 $360^\\circ$，并且两两相等。若一对对顶角之和是 $100^\\circ$，这两个角各是 $50^\\circ$，另外两个角各是 $180^\\circ - 50^\\circ = 130^\\circ$，它们的和是 $260^\\circ$。",
    ],
    ["The whole turn checks it: $100 + 260 = 360$.", "用一整圈检验：$100 + 260 = 360$。"],
    ["The sum of the pair is two angles; halve it before using the linear pair.", "这一对的和是两个角的和；先取一半，再用邻补角关系。"],
  ],
  (rng) => {
    const each = rng.int(16, 80);
    const askEach = rng.bool();
    const answer = askEach ? 180 - each : 360 - 2 * each;
    return valued(
      [
        `Two lines cross, and one pair of vertical angles has a sum of $${2 * each}^\\circ$. What is ${askEach ? "the measure of each of the other two angles" : "the sum of the other two angles"}?`,
        `两条直线相交，一对对顶角的和是 $${2 * each}^\\circ$。另外两个角${askEach ? "各是多少度" : "的和是多少度"}？`,
      ],
      answer,
      [
        [
          ["Halve the pair", "把这一对取一半"],
          ["Vertical angles are equal, so each is half the sum:", "对顶角相等，所以每个是和的一半："],
          [`${2 * each}^\\circ \\div 2 = ${each}^\\circ`],
        ],
        [
          ["Use the linear pair", "用邻补角"],
          ["Each other angle sits beside one of these on a straight line:", "其余每个角都与其中一个角在一条直线上相邻："],
          [
            `180^\\circ - ${each}^\\circ = ${180 - each}^\\circ`,
            ...(askEach ? [] : [`2 \\times ${180 - each}^\\circ = ${360 - 2 * each}^\\circ`]),
          ],
        ],
      ],
      askEach
        ? [
            `All four angles make a whole turn: $${each} + ${180 - each} + ${each} + ${180 - each} = 360$.`,
            `四个角合成一整圈：$${each} + ${180 - each} + ${each} + ${180 - each} = 360$。`,
          ]
        : [
            `The whole turn is $360^\\circ$: $360 - ${2 * each} = ${360 - 2 * each}$.`,
            `一整圈是 $360^\\circ$：$360 - ${2 * each} = ${360 - 2 * each}$。`,
          ],
      askEach
        ? [
            [each, "That is an angle of the given pair, not one of the other two.", "这是已知那一对中的角，不是另外两个角。"],
            [
              180 - 2 * each,
              "That takes the whole pair from $180^\\circ$ instead of one angle.",
              "这是从 $180^\\circ$ 里减去整对角，而不是减去一个角。",
            ],
            [360 - 2 * each, "That is the sum of the other two, not each one.", "这是另外两个角的和，不是每一个。"],
          ]
        : [
            [2 * each, "That is the sum of the given pair.", "这是已知那一对的和。"],
            [180 - each, "That is only one of the other two angles.", "这只是另外两个角中的一个。"],
            [
              180 - 2 * each,
              "That takes the pair from $180^\\circ$ instead of from a whole turn.",
              "这是从 $180^\\circ$ 里减，而不是从一整圈里减。",
            ],
          ],
      {
        unit: "°",
        figure: crossingLines(
          10,
          each,
          [
            [0, "a"],
            [2, "a"],
            [1, "?"],
          ],
          "Two lines crossing at a point, with the vertical pair marked a and a neighboring angle marked with a question mark.",
          "两条直线相交于一点，一对对顶角标为 a，与它们相邻的一个角标为问号。",
        ),
      },
    );
  },
  crossingLines(
    10,
    50,
    [
      [0, "50°"],
      [1, "130°"],
      [2, "50°"],
      [3, "130°"],
    ],
    "Two lines crossing with angles of 50°, 130°, 50° and 130° around the point.",
    "两条直线相交，交点周围的角依次是 50°、130°、50°、130°。",
  ),
);
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

/** pairTests are, for each kind of angle pair, what both angles must be, in both languages. */
const pairTests: readonly Pair[] = [
  ["Corresponding angles sit in the same position at each crossing", "同位角在两个交点处的位置相同"],
  ["Alternate interior angles are both between the lines, on opposite sides of the transversal", "内错角都在两条直线之间，分别在截线两侧"],
  ["Alternate exterior angles are both outside the lines, on opposite sides of the transversal", "外错角都在两条直线之外，分别在截线两侧"],
  ["Consecutive interior angles are both between the lines, on the same side of the transversal", "同旁内角都在两条直线之间，在截线同一侧"],
];

/** pairChecks confirm a kind of angle pair another way: by a slide, a half turn or a straight line. */
const pairChecks: readonly Pair[] = [
  [
    "Slide one crossing along the transversal onto the other: the two angles land on each other.",
    "把一个交点沿截线平移到另一个交点上：两个角正好重合。",
  ],
  [
    "Give the figure a half turn about the middle of the transversal between the lines: angle $1$ lands on angle $2$.",
    "把图形绕截线在两线之间部分的中点旋转半周：角 $1$ 正好落到角 $2$ 上。",
  ],
  [
    "Give the figure a half turn about the middle of the transversal between the lines: angle $1$ lands on angle $2$.",
    "把图形绕截线在两线之间部分的中点旋转半周：角 $1$ 正好落到角 $2$ 上。",
  ],
  [
    "Slide one crossing along the transversal onto the other: the two angles land side by side and make a straight line.",
    "把一个交点沿截线平移到另一个交点上：两个角并排拼成一条直线。",
  ],
];

/** interior tells whether the angle with index i at a crossing lies between the two lines: above m at P, below ℓ at Q. */
const interior = (v: "P" | "Q", i: number) => (v === "P" ? i < 2 : i >= 2);

/** rightSide tells whether the angle with index i lies to the right of the transversal. */
const rightSide = (i: number) => i === 0 || i === 3;

/** pairOf names a kind of angle pair as an answer option. */
const pairOf = (i: number): Pair => [anglePairNames[i]!.en, anglePairNames[i]!["zh-CN"]];

/** worked writes c·x + d with x put in, worked out: "3 \cdot 20 + 15 = 75". */
const worked = (c: number, d: number, x: number) =>
  `${c === 1 ? "" : `${c} \\cdot `}${x}${d === 0 ? "" : d > 0 ? ` + ${d}` : ` - ${-d}`} = ${c * x + d}`;

export const parallelLinesAndTransversals: TopicDef = withIntro(
  {
    id: "parallel-lines-and-transversals",
    title: t("Parallel Lines and Transversals", "平行线与截线"),
    summary: t(
      "Name the angle pairs a transversal forms with two parallel lines, and use them to find angles.",
      "认识截线与两条平行线形成的角对，并用它们求角。",
    ),
    prerequisites: ["vertical-angles"],
    encompasses: [],
    xp: 12,
    standards: ["CCSS.8.G.A.5"],
    knowledgePoints: [
      lesson(
        "naming-angle-pairs",
        ["Angle pairs", "角对的名称"],
        [
          [
            "A **transversal** is a line that crosses two other lines, forming eight angles. The angles between the two lines are **interior**; the others are **exterior**. Pairs of angles at the two crossings have names:\n\n- **Corresponding angles** are in the same position at each crossing.\n- **Alternate interior angles** are between the lines, on opposite sides of the transversal.\n- **Alternate exterior angles** are outside the lines, on opposite sides of the transversal.\n- **Consecutive interior angles** are between the lines, on the same side of the transversal.",
            "**截线**是与另外两条直线都相交的直线，共形成八个角。两条直线之间的角是**内角**，其余的是**外角**。两个交点处的角组成的角对各有名称：\n\n- **同位角**：在两个交点处位置相同。\n- **内错角**：在两条直线之间，分别在截线两侧。\n- **外错角**：在两条直线之外，分别在截线两侧。\n- **同旁内角**：在两条直线之间，在截线同一侧。",
          ],
          [
            "Slide one crossing along the transversal onto the other: corresponding angles land on each other, while a half turn swaps alternate angles.",
            "把一个交点沿截线平移到另一个交点上，同位角会重合；而旋转半周会让内错角或外错角互换位置。",
          ],
          [
            "Interior means between the two lines, not inside a shape. Decide that first, then look at the sides of the transversal.",
            "内角指在两条直线之间，不是在某个图形里面。先判断这一点，再看在截线的哪一侧。",
          ],
        ],
        (rng) => {
          const pair = rng.pick(anglePairs);
          const correct = anglePairNames.indexOf(pair.name);
          const [first, second] = rng.bool() ? (["P", "Q"] as const) : (["Q", "P"] as const);
          const index = { P: pair.p, Q: pair.q };
          const [i1, i2] = [index[first], index[second]];
          const place = (v: "P" | "Q", i: number): Pair =>
            interior(v, i) ? ["between the lines", "在两条直线之间"] : ["outside the lines", "在两条直线之外"];
          const side = (i: number): Pair => (rightSide(i) ? ["right", "右"] : ["left", "左"]);
          const [p1, p2, s1, s2] = [place(first, i1), place(second, i2), side(i1), side(i2)];
          return chosen(
            rng,
            [
              "A transversal crosses two lines. What kind of pair are angles $1$ and $2$?",
              "一条截线与两条直线相交。角 $1$ 与角 $2$ 是什么角对？",
            ],
            pairOf(correct),
            [0, 1, 2, 3]
              .filter((i) => i !== correct)
              .map((i) => [pairOf(i), `${pairTests[i]![0]}; these are not.`, `${pairTests[i]![1]}，这两个角不是。`] as const),
            [
              [
                ["Between or outside", "在两线之间还是之外"],
                [`Angle $1$ is ${p1[0]}, and angle $2$ is ${p2[0]}.`, `角 $1$ ${p1[1]}，角 $2$ ${p2[1]}。`],
              ],
              [
                ["Sides of the transversal", "截线的哪一侧"],
                [
                  `Angle $1$ is to the ${s1[0]} of the transversal and angle $2$ to the ${s2[0]}, so they are ${pair.name.en.toLowerCase()}.`,
                  `角 $1$ 在截线${s1[1]}侧，角 $2$ 在截线${s2[1]}侧，所以它们是${pair.name["zh-CN"]}。`,
                ],
              ],
            ],
            pairChecks[correct]!,
            transversal(
              pickTheta(rng),
              [
                [first, i1, "1"],
                [second, i2, "2"],
              ],
              "Two lines cut by a transversal, with angle 1 at one crossing and angle 2 at the other.",
              "两条直线被一条截线所截，角 1 在一个交点处，角 2 在另一个交点处。",
            ),
          );
        },
        drawn(remainingDrawings10["parallel-lines-and-transversals#naming-angle-pairs"]),
      ),
      lesson(
        "angles-from-parallel-lines",
        ["Finding angles with parallel lines", "利用平行线求角"],
        [
          [
            "When the two lines are **parallel** (marked with matching arrows), the angle pairs are related:\n\n- corresponding, alternate interior and alternate exterior angles are **equal**;\n- consecutive interior angles are **supplementary**.",
            "当两条直线**平行**（用相同的箭头标出）时，角对之间有如下关系：\n\n- 同位角、内错角、外错角都**相等**；\n- 同旁内角**互补**。",
          ],
          [
            "All eight angles take only two values, which add up to $180^\\circ$: if one angle is $65^\\circ$, every acute angle is $65^\\circ$ and every obtuse one is $115^\\circ$.",
            "八个角只有两种度数，且两者之和为 $180^\\circ$：若一个角是 $65^\\circ$，那么每个锐角都是 $65^\\circ$，每个钝角都是 $115^\\circ$。",
          ],
          ["Consecutive interior angles are not equal: they add up to $180^\\circ$.", "同旁内角不相等：它们的和是 $180^\\circ$。"],
        ],
        (rng) => {
          const pair = rng.pick(anglePairs);
          const theta = pickTheta(rng);
          const knownAtP = rng.bool();
          const [kv, ki, xv, xi] = knownAtP ? (["P", pair.p, "Q", pair.q] as const) : (["Q", pair.q, "P", pair.p] as const);
          const m = ki % 2 === 0 ? theta : 180 - theta;
          const answer = pair.equal ? m : 180 - m;
          const rule = pairRule(pair);
          const acute = answer < 90;
          return valued(
            ["Lines $\\ell$ and $m$ are parallel. Find $x$.", "直线 $\\ell$ 与 $m$ 平行。求 $x$。"],
            answer,
            [
              [
                ["Name the pair", "说出角对"],
                [`${rule.en}.`, `${rule["zh-CN"]}。`],
              ],
              pair.equal
                ? [["Find x", "求 x"], ["So $x$ equals the marked angle:", "所以 $x$ 等于标出的角："], [`x = ${m}`]]
                : [
                    ["Find x", "求 x"],
                    ["So $x$ and the marked angle add up to $180^\\circ$:", "所以 $x$ 与标出的角之和为 $180^\\circ$："],
                    [`x + ${m} = 180`, `x = ${180 - m}`],
                  ],
            ],
            [
              `Angle $x$ looks ${acute ? "acute" : "obtuse"} in the figure. Of the only two sizes, $${m}^\\circ$ and $${180 - m}^\\circ$, the ${acute ? "smaller" : "larger"} is $${answer}^\\circ$.`,
              `图中角 $x$ 看起来是${acute ? "锐角" : "钝角"}。所有角只有 $${m}^\\circ$ 和 $${180 - m}^\\circ$ 两种，其中${acute ? "较小" : "较大"}的是 $${answer}^\\circ$。`,
            ],
            [
              [
                pair.equal ? 180 - m : m,
                pair.equal ? "These angles are equal, not supplementary." : "Consecutive interior angles are supplementary, not equal.",
                pair.equal ? "这两个角相等，不是互补。" : "同旁内角互补，不相等。",
              ],
              ...(m < 90
                ? [
                    [
                      90 - m,
                      "That is the complement of the marked angle. Parallel lines give equal or supplementary angles.",
                      "这是标出的角的余角。平行线给出的是相等或互补的角。",
                    ] as const,
                  ]
                : []),
              [
                360 - m,
                "That subtracts from $360^\\circ$. Angle pairs here are equal or add up to $180^\\circ$.",
                "这是用 $360^\\circ$ 去减。这里的角对要么相等，要么和为 $180^\\circ$。",
              ],
            ],
            {
              form: "integer",
              unit: "°",
              figure: transversal(
                theta,
                [
                  [kv, ki, deg(m)],
                  [xv, xi, "x"],
                ],
                `Parallel lines ℓ and m cut by a transversal. One angle measures ${m}°; another angle, at the other crossing, is x.`,
                `平行线 ℓ 与 m 被一条截线所截。一个角是 ${m}°，另一个交点处的一个角是 x。`,
              ),
            },
          );
        },
        drawn(remainingDrawings10["parallel-lines-and-transversals#angles-from-parallel-lines"]),
      ),
      {
        ...lesson(
          "equations-from-parallel-lines",
          ["Equations from parallel lines", "由平行线列方程"],
          [
            [
              "When the angles are written with a variable, the pair's relationship gives an equation: equal angles give $A = B$, supplementary angles give $A + B = 180$.\n\nIf consecutive interior angles measure $(2x + 15)^\\circ$ and $(3x - 10)^\\circ$, then $(2x + 15) + (3x - 10) = 180$, so $5x + 5 = 180$, $5x = 175$ and $x = 35$.",
              "当角用含变量的式子表示时，角对的关系给出方程：相等的角得 $A = B$，互补的角得 $A + B = 180$。\n\n若一对同旁内角为 $(2x + 15)^\\circ$ 和 $(3x - 10)^\\circ$，则 $(2x + 15) + (3x - 10) = 180$，所以 $5x + 5 = 180$，$5x = 175$，$x = 35$。",
            ],
            [
              "Put $x = 35$ in: $2 \\cdot 35 + 15 = 85$ and $3 \\cdot 35 - 10 = 95$, and $85 + 95 = 180$.",
              "代入 $x = 35$：$2 \\cdot 35 + 15 = 85$，$3 \\cdot 35 - 10 = 95$，$85 + 95 = 180$。",
            ],
            [
              "Name the pair before writing the equation: setting supplementary angles equal gives a wrong $x$.",
              "列方程前先说出是哪种角对：把互补的角当成相等，会得到错误的 $x$。",
            ],
          ],
          (rng) => {
            const pair = rng.pick(anglePairs);
            const { x, c1, d1, c2, d2, m } = expressionPair(rng, pair.equal, 45, 135);
            const theta = pair.p % 2 === 0 ? m : 180 - m;
            const rule = pairRule(pair);
            const work = (
              pair.equal
                ? equalSteps(c1, d1, c2, d2)
                : sumSteps(
                    [
                      [c1, d1],
                      [c2, d2],
                    ],
                    180,
                  )
            ).filter((l, i, all) => l !== all[i - 1]);
            const m2 = c2 * x + d2;
            const whole = (top: number, bottom: number) => bottom !== 0 && Number.isInteger(top / bottom);
            return valued(
              ["Lines $\\ell$ and $m$ are parallel. Find $x$.", "直线 $\\ell$ 与 $m$ 平行。求 $x$。"],
              x,
              [
                [["Write the equation", "列方程"], [`${rule.en}:`, `${rule["zh-CN"]}：`], work.slice(0, pair.equal ? 1 : 2)],
                [["Solve", "求解"], collecting(work.slice(pair.equal ? 1 : 2)), work.slice(pair.equal ? 1 : 2)],
              ],
              [
                `Put $x = ${x}$ in: $${worked(c1, d1, x)}$ and $${worked(c2, d2, x)}$, ${pair.equal ? "the same measure" : `and $${m} + ${m2} = 180$`}.`,
                `代入 $x = ${x}$：$${worked(c1, d1, x)}$，$${worked(c2, d2, x)}$，${pair.equal ? "度数相同" : `$${m} + ${m2} = 180$`}。`,
              ],
              [
                [m, "That is the measure of an angle, not $x$.", "这是角的度数，不是 $x$。"],
                ...(pair.equal
                  ? whole(180 - d1 - d2, c1 + c2)
                    ? [
                        [
                          (180 - d1 - d2) / (c1 + c2),
                          "That adds the angles to $180$, but these angles are equal.",
                          "这是令两角之和为 $180$，但这两个角相等。",
                        ] as const,
                      ]
                    : []
                  : [
                      ...(whole(d2 - d1, c1 - c2)
                        ? [
                            [
                              (d2 - d1) / (c1 - c2),
                              "That sets the angles equal, but consecutive interior angles are supplementary.",
                              "这是令两角相等，但同旁内角互补。",
                            ] as const,
                          ]
                        : []),
                      ...(whole(90 - d1 - d2, c1 + c2)
                        ? [
                            [
                              (90 - d1 - d2) / (c1 + c2),
                              "That uses $90$ as the sum, but supplementary angles add up to $180$.",
                              "这是把和当成了 $90$，但互补的角之和是 $180$。",
                            ] as const,
                          ]
                        : []),
                    ]),
              ],
              {
                form: "integer",
                solveFor: "x",
                figure: transversal(
                  theta,
                  [
                    ["P", pair.p, angleLabel(c1, d1)],
                    ["Q", pair.q, angleLabel(c2, d2)],
                  ],
                  `Parallel lines ℓ and m cut by a transversal, with angles marked ${angleLabel(c1, d1)} and ${angleLabel(c2, d2)} at the two crossings.`,
                  `平行线 ℓ 与 m 被一条截线所截，两个交点处的角分别标为 ${angleLabel(c1, d1)} 和 ${angleLabel(c2, d2)}。`,
                ),
              },
            );
          },
          drawn(remainingDrawings10["parallel-lines-and-transversals#equations-from-parallel-lines"]),
        ),
        keyPrerequisites: ["vertical-angles"],
      },
    ],
  },
  [
    "Railway tracks are parallel lines, and a straight road crossing them is a transversal. The road meets both tracks at the same slant, so the angles in matching positions are equal.",
    "铁轨是平行线，横穿铁轨的一条直路是截线。这条路与两条铁轨的倾斜程度相同，所以位置对应的角相等。",
  ],
  [
    "Measure where the road meets each track: the same angle, say $60^\\circ$, at both.",
    "量一量路与每条铁轨相交处的角：两处一样，比如都是 $60^\\circ$。",
  ],
  [
    "name the angle pairs a transversal makes with two lines, and use parallel lines to find angles and solve equations.",
    "认识截线与两条直线形成的角对，并利用平行线求角、解方程。",
  ],
);

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

export const anglesOfATriangle: TopicDef = withIntro(
  {
    id: "angles-of-a-triangle",
    title: t("Interior Angles of Triangles", "三角形的内角"),
    summary: t("Use the fact that the angles of a triangle add up to 180° to find unknown angles.", "利用三角形内角和为 180° 求未知角。"),
    prerequisites: ["parallel-lines-and-transversals"],
    encompasses: [],
    xp: 10,
    standards: ["CCSS.8.G.A.5"],
    knowledgePoints: [
      lesson(
        "the-third-angle",
        ["The angle sum of a triangle", "三角形的内角和"],
        [
          [
            "The three angles of every triangle add up to $180^\\circ$. To see why, draw the line through one vertex parallel to the opposite side. The three angles at that vertex form a straight angle, and by alternate interior angles the outer two equal the triangle's other two angles.\n\nSo if two angles of a triangle are $50^\\circ$ and $70^\\circ$, the third is $180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$.",
            "任何三角形的三个内角之和都是 $180^\\circ$。要说明这一点，过一个顶点作对边的平行线。该顶点处的三个角合成一个平角，由内错角相等，两侧的两个角分别等于三角形的另外两个角。\n\n所以若三角形的两个角是 $50^\\circ$ 和 $70^\\circ$，第三个角是 $180^\\circ - 50^\\circ - 70^\\circ = 60^\\circ$。",
          ],
          ["Add all three: $50 + 70 + 60 = 180$.", "三个角加起来：$50 + 70 + 60 = 180$。"],
          [
            "In a right triangle, do not forget the right angle: the two other angles add up to $90^\\circ$, not $180^\\circ$.",
            "在直角三角形中，别忘了直角：另外两个角之和是 $90^\\circ$，不是 $180^\\circ$。",
          ],
        ],
        (rng) => {
          if (rng.bool(0.3)) {
            const a = rng.int(20, 70);
            return valued(
              ["Find $x$ in the right triangle.", "求直角三角形中的 $x$。"],
              90 - a,
              [
                [
                  ["Use the angle sum", "用内角和"],
                  ["The angles add up to $180^\\circ$, and one of them is the right angle:", "三个角之和为 $180^\\circ$，其中一个是直角："],
                  [`x + 90 + ${a} = 180`],
                ],
                [
                  ["Subtract", "相减"],
                  ["Take both known angles from $180$:", "用 $180$ 减去两个已知角："],
                  [`x = 180 - 90 - ${a} = ${90 - a}`],
                ],
              ],
              [
                `The two acute angles share the other $90^\\circ$: $${a} + ${90 - a} = 90$.`,
                `两个锐角分享剩下的 $90^\\circ$：$${a} + ${90 - a} = 90$。`,
              ],
              [
                [
                  180 - a,
                  "You forgot the right angle. In a right triangle the two other angles add to $90^\\circ$.",
                  "你忘了直角。直角三角形中另外两个角之和是 $90^\\circ$。",
                ],
                [
                  90 + a,
                  "You added. The two acute angles add to $90^\\circ$, so subtract from $90^\\circ$.",
                  "你做了加法。两个锐角之和是 $90^\\circ$，应该从 $90^\\circ$ 中减去。",
                ],
                [
                  180 - 2 * a,
                  "You treated the two acute angles as equal. Subtract the given angle from $90^\\circ$.",
                  "你把两个锐角当成相等了。应从 $90^\\circ$ 中减去已知角。",
                ],
              ],
              {
                form: "integer",
                unit: "°",
                figure: triangleFigure(
                  [a, 90],
                  [deg(a), "90", "x"],
                  rng.bool(),
                  `A right triangle with one acute angle of ${a}° and the other marked x.`,
                  `一个直角三角形，一个锐角是 ${a}°，另一个锐角标为 x。`,
                ),
              },
            );
          }
          for (;;) {
            const a = rng.int(25, 110);
            const b = rng.int(25, 110);
            const c = 180 - a - b;
            if (c < 25 || a === 90 || b === 90 || c === 90) continue;
            const walk: Walk[] = [
              [
                ["Use the angle sum", "用内角和"],
                ["The angles of a triangle add up to $180^\\circ$:", "三角形内角和为 $180^\\circ$："],
                [`x + ${a} + ${b} = 180`],
              ],
              [["Subtract", "相减"], ["Take both known angles from $180$:", "用 $180$ 减去两个已知角："], [`x = 180 - ${a} - ${b} = ${c}`]],
            ];
            const check: Pair = [
              `Add the known angles first: $${a} + ${b} = ${a + b}$, and $180 - ${a + b} = ${c}$.`,
              `先把两个已知角相加：$${a} + ${b} = ${a + b}$，$180 - ${a + b} = ${c}$。`,
            ];
            const offs = [
              [
                a + b,
                "That is the sum of the two known angles. The third is what remains of $180^\\circ$.",
                "这是两个已知角的和。第三个角是 $180^\\circ$ 减去它后剩下的部分。",
              ],
              [
                360 - a - b,
                "You used $360^\\circ$. The angles of a triangle add to $180^\\circ$.",
                "你用了 $360^\\circ$。三角形内角和是 $180^\\circ$。",
              ],
              [
                Math.abs(a - b),
                "You subtracted the two known angles. Subtract both from $180^\\circ$.",
                "你把两个已知角相减了。应从 $180^\\circ$ 中减去这两个角。",
              ],
            ] as const;
            if (rng.bool(0.3))
              return valued(
                [
                  `Two angles of a triangle measure $${a}^\\circ$ and $${b}^\\circ$. What is the third angle?`,
                  `三角形的两个角分别是 $${a}^\\circ$ 和 $${b}^\\circ$。第三个角是多少度？`,
                ],
                c,
                walk,
                check,
                offs,
                { form: "integer", unit: "°" },
              );
            // x may sit at any corner: the drawing is the same triangle, turned.
            const [shape, labels] = rng.pick([
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
            return valued(["Find $x$.", "求 $x$。"], c, walk, check, offs, {
              form: "integer",
              unit: "°",
              figure: triangleFigure(
                shape,
                labels,
                rng.bool(),
                `A triangle with two angles of ${a}° and ${b}°; the third is marked x.`,
                `一个三角形，两个角分别是 ${a}° 和 ${b}°，第三个角标为 x。`,
              ),
            });
          }
        },
        figure(
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
      ),
      {
        ...lesson(
          "triangle-angle-equations",
          ["Equations from the angle sum", "由内角和列方程"],
          [
            [
              "When the angles of a triangle are written with a variable, their sum gives an equation. Add the angles, set the sum equal to $180$, and solve.\n\nIf the angles are $x^\\circ$, $(2x + 10)^\\circ$ and $(3x - 10)^\\circ$, then $x + (2x + 10) + (3x - 10) = 180$, so $6x = 180$ and $x = 30$.",
              "当三角形的角用含变量的式子表示时，它们的和给出一个方程：把三个角相加，令和等于 $180$，再求解。\n\n若三个角为 $x^\\circ$、$(2x + 10)^\\circ$、$(3x - 10)^\\circ$，则 $x + (2x + 10) + (3x - 10) = 180$，所以 $6x = 180$，$x = 30$。",
            ],
            [
              "Put $x = 30$ into each angle: $30^\\circ$, $70^\\circ$ and $80^\\circ$, and $30 + 70 + 80 = 180$.",
              "把 $x = 30$ 代入每个角：$30^\\circ$、$70^\\circ$、$80^\\circ$，$30 + 70 + 80 = 180$。",
            ],
            [
              "Add the constants too: $+10$ and $-10$ cancel here, but usually they change the right side.",
              "常数也要相加：这里 $+10$ 和 $-10$ 抵消了，但一般它们会改变右边的数。",
            ],
          ],
          (rng) => {
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
              const work = sumSteps(terms, 180).filter((l, i, all) => l !== all[i - 1]);
              const maybe = (top: number, en: string, zh: string) => (Number.isInteger(top / cs) ? [[top / cs, en, zh] as const] : []);
              return valued(
                [
                  `In $\\triangle ABC$, $\\angle A = ${ta}$, $\\angle B = ${tb}$ and $\\angle C = ${tc}$. Find $x$.`,
                  `在 $\\triangle ABC$ 中，$\\angle A = ${ta}$，$\\angle B = ${tb}$，$\\angle C = ${tc}$。求 $x$。`,
                ],
                x,
                [
                  [
                    ["Add the angles", "把三个角相加"],
                    ["The angles of a triangle add up to $180^\\circ$:", "三角形内角和为 $180^\\circ$："],
                    work.slice(0, 2),
                  ],
                  [
                    ["Solve for x", "解出 x"],
                    ds === 0
                      ? ["Divide by the coefficient of $x$:", "除以 $x$ 的系数："]
                      : ["Undo the constant, then divide by the coefficient of $x$:", "先抵消常数，再除以 $x$ 的系数："],
                    work.slice(2),
                  ],
                ],
                [
                  `Put $x = ${x}$ into each angle: $${a}^\\circ$, $${b}^\\circ$ and $${c}^\\circ$, and $${a} + ${b} + ${c} = 180$.`,
                  `把 $x = ${x}$ 代入每个角：$${a}^\\circ$、$${b}^\\circ$、$${c}^\\circ$，$${a} + ${b} + ${c} = 180$。`,
                ],
                [
                  ...maybe(
                    360 - ds,
                    "That uses $360$ as the sum. The angles of a triangle add up to $180^\\circ$.",
                    "这是把和当成了 $360$。三角形内角和是 $180^\\circ$。",
                  ),
                  ...maybe(
                    90 - ds,
                    "That uses $90$ as the sum. The angles of a triangle add up to $180^\\circ$.",
                    "这是把和当成了 $90$。三角形内角和是 $180^\\circ$。",
                  ),
                  ...maybe(
                    180 + ds,
                    "That moves the constant with the wrong sign. Undo it by doing the opposite.",
                    "这是把常数移项时符号弄错了。移项要做相反的运算。",
                  ),
                  ...(ds === 0
                    ? []
                    : maybe(
                        180,
                        `That leaves out the constants. They add up to $${ds}$, which must come off $180$ first.`,
                        `这是漏掉了常数。它们的和是 $${ds}$，要先从 $180$ 中去掉。`,
                      )),
                  [a, "That is $m\\angle A$, an angle, not $x$.", "这是 $m\\angle A$，是角的度数，不是 $x$。"],
                  [
                    60,
                    "That shares $180$ equally among the three angles, but the angles are not equal.",
                    "这是把 $180$ 平均分给三个角，但这三个角并不相等。",
                  ],
                ],
                { form: "integer", solveFor: "x", figure: namedTriangle(triangleByAngles(a, b)) },
              );
            }
          },
          drawn(gradeDrawings3["angles-of-a-triangle#triangle-angle-equations"]),
        ),
        keyPrerequisites: ["two-step-equations", "combining-like-terms"],
      },
    ],
  },
  [
    "Tear the three corners off a paper triangle and line them up point to point. Whatever the triangle, they always make a straight line, so the three angles add up to $180^\\circ$.",
    "把纸三角形的三个角撕下来，顶点对顶点拼在一起。不管是什么样的三角形，它们总是拼成一条直线，所以三个角之和是 $180^\\circ$。",
  ],
  ["An equilateral triangle has three equal angles: $60 + 60 + 60 = 180$.", "等边三角形的三个角相等：$60 + 60 + 60 = 180$。"],
  [
    "use the $180^\\circ$ angle sum to find a missing angle, to solve equations, and to share $180^\\circ$ in a ratio.",
    "利用 $180^\\circ$ 的内角和求未知角、解方程，以及按比分配 $180^\\circ$。",
  ],
);

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
      figure: gradeDrawings3["exterior-angles-of-triangles#the-exterior-angle-theorem"],
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
      figure: gradeDrawings3["exterior-angles-of-triangles#exterior-angle-equations"],
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

/** classifyingTriangles names a triangle by its sides and by its angles. */
export const classifyingTriangles: TopicDef = withIntro(
  {
    id: "classifying-triangles",
    title: t("Classifying Triangles", "三角形的分类"),
    summary: t("Classify triangles by their sides and by their angles.", "按边和按角给三角形分类。"),
    prerequisites: ["angles-and-angle-measures"],
    encompasses: [],
    xp: 6,
    standards: ["CCSS.4.G.A.2"],
    knowledgePoints: [
      lesson(
        "classifying-by-sides",
        ["Classifying by sides", "按边分类"],
        [
          [
            "By its sides, a triangle is **equilateral** when all three sides are equal, **isosceles** when at least two sides are equal, and **scalene** when no two sides are equal. Sides $5$, $5$, $5$ make an equilateral triangle; $5$, $5$, $8$ an isosceles one; $5$, $6$, $8$ a scalene one. Every equilateral triangle is also isosceles, and we call it by the more exact name, equilateral.",
            "按边分，三条边都相等的是**等边三角形**，至少两条边相等的是**等腰三角形**，任意两条边都不相等的是**不等边三角形**。边长 $5$、$5$、$5$ 是等边三角形；$5$、$5$、$8$ 是等腰三角形；$5$、$6$、$8$ 是不等边三角形。等边三角形也是等腰三角形，我们用更准确的名称叫它等边三角形。",
          ],
          [
            "Count the different lengths: one length means equilateral, two mean isosceles, three mean scalene.",
            "数一数有几种不同的长度：一种是等边，两种是等腰，三种是不等边。",
          ],
          [
            "Matching tick marks show equal sides; read the numbers too, not only how the sides look.",
            "相同的短线表示边相等；也要看边上的数，不能只看样子。",
          ],
        ],
        (rng) => {
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
          const sorted = [...sides].sort((m, n) => m - n);
          const twin = sorted[1] === sorted[0] ? sorted[0]! : sorted[1]!;
          const name = (k: number): Pair => [sideKinds[k]!.en, sideKinds[k]!["zh-CN"]];
          const compare: Pair[] = [
            ["All three sides are equal.", "三条边都相等。"],
            [`Exactly two sides are equal: two of them are $${twin}$.`, `恰有两条边相等：有两条都是 $${twin}$。`],
            ["No two sides are equal.", "任意两条边都不相等。"],
          ];
          const reasons: Record<number, Pair> =
            kind === 0
              ? {
                  1: [
                    "Isosceles is true, but all three sides are equal, so the more exact name is equilateral.",
                    "等腰也对，但三条边都相等，更准确的名称是等边三角形。",
                  ],
                  2: ["All three sides are equal, so it is not scalene.", "三条边都相等，所以不是不等边三角形。"],
                }
              : kind === 1
                ? {
                    0: [`Only two sides are $${twin}$; the third side is different.`, `只有两条边是 $${twin}$，第三条边不同。`],
                    2: [`Two sides are both $${twin}$, so it is not scalene.`, `有两条边都是 $${twin}$，所以不是不等边三角形。`],
                  }
                : {
                    0: ["The three sides are all different, so they are not all equal.", "三条边各不相同，所以不是三条边都相等。"],
                    1: ["No two sides are equal, so it has no pair of equal sides.", "任意两条边都不相等，所以没有一对相等的边。"],
                  };
          const count = new Set(sides).size;
          return chosen(
            rng,
            ["Classify the triangle by its sides.", "按边给这个三角形分类。"],
            name(kind),
            [0, 1, 2].filter((k) => k !== kind).map((k): Wrong => [name(k), reasons[k]![0], reasons[k]![1]]),
            [
              [
                ["Read the sides", "读出三条边"],
                [`The sides are $${c}$, $${a}$ and $${b}$.`, `三条边是 $${c}$、$${a}$、$${b}$。`],
              ],
              [
                ["Compare them", "比较它们"],
                [
                  `${compare[kind]![0]} The triangle is ${sideKinds[kind]!.en.toLowerCase()}.`,
                  `${compare[kind]![1]}所以是${sideKinds[kind]!["zh-CN"]}。`,
                ],
              ],
            ],
            [
              `There ${count === 1 ? "is $1$ different length" : `are $${count}$ different lengths`}, which means ${sideKinds[kind]!.en.toLowerCase()}.`,
              `一共有 $${count}$ 种不同的长度，说明是${sideKinds[kind]!["zh-CN"]}。`,
            ],
            figure(
              [
                { kind: "polygon", points },
                { kind: "side", a: pa, b: pb, text: `${c}` },
                { kind: "side", a: pb, b: pc, text: `${a}` },
                { kind: "side", a: pc, b: pa, text: `${b}` },
              ],
              `A triangle with sides ${c}, ${a} and ${b}.`,
              `一个三角形，三条边分别是 ${c}、${a}、${b}。`,
            ),
          );
        },
        drawn(gradeDrawings3["classifying-triangles#classifying-by-sides"]),
      ),
      lesson(
        "classifying-by-angles",
        ["Classifying by angles", "按角分类"],
        [
          [
            "By its angles, a triangle is **acute** when all three angles are less than $90^\\circ$, **right** when one angle is $90^\\circ$, and **obtuse** when one angle is more than $90^\\circ$. A triangle can have at most one right or obtuse angle, so look at the largest angle: $50^\\circ$, $60^\\circ$, $70^\\circ$ is acute; $30^\\circ$, $60^\\circ$, $90^\\circ$ is right; $20^\\circ$, $40^\\circ$, $120^\\circ$ is obtuse.",
            "按角分，三个角都小于 $90^\\circ$ 的是**锐角三角形**，有一个角等于 $90^\\circ$ 的是**直角三角形**，有一个角大于 $90^\\circ$ 的是**钝角三角形**。三角形最多只有一个直角或钝角，所以看最大的角：$50^\\circ$、$60^\\circ$、$70^\\circ$ 是锐角三角形；$30^\\circ$、$60^\\circ$、$90^\\circ$ 是直角三角形；$20^\\circ$、$40^\\circ$、$120^\\circ$ 是钝角三角形。",
          ],
          [
            "Add the two smaller angles instead: more than $90^\\circ$ means acute, exactly $90^\\circ$ means right, less than $90^\\circ$ means obtuse. For $20^\\circ$ and $40^\\circ$: $60 < 90$, obtuse.",
            "也可以把两个较小的角相加：大于 $90^\\circ$ 是锐角三角形，等于 $90^\\circ$ 是直角三角形，小于 $90^\\circ$ 是钝角三角形。$20^\\circ$ 和 $40^\\circ$：$60 < 90$，是钝角三角形。",
          ],
          [
            "Every triangle has acute angles, even a right or an obtuse one. Name it by its largest angle, not by its smaller ones.",
            "每个三角形都有锐角，直角三角形和钝角三角形也有。要按最大的角来命名，而不是按较小的角。",
          ],
        ],
        (rng) => {
          const kind = rng.int(0, 2);
          let angles: number[];
          let big: number;
          for (;;) {
            big = [rng.int(61, 89), 90, rng.int(95, 140)][kind]!;
            const a = rng.int(15, 180 - big - 15);
            const b = 180 - big - a;
            if (b < 15 || b > big || a > big || (kind === 0 && (a === 90 || b === 90))) continue;
            angles = rng.shuffle([big, a, b]);
            break;
          }
          const list = angles.map((m) => `$${m}^\\circ$`);
          const rest = 180 - big;
          const name = (k: number): Pair => [angleKindsOfTriangles[k]!.en, angleKindsOfTriangles[k]!["zh-CN"]];
          const compare: Pair = [
            [
              `$${big}^\\circ$ is less than $90^\\circ$, so every angle is acute.`,
              `$${big}^\\circ$ is exactly a right angle.`,
              `$${big}^\\circ$ is more than $90^\\circ$, so it is obtuse.`,
            ][kind]!,
            [
              `$${big}^\\circ$ 小于 $90^\\circ$，所以每个角都是锐角。`,
              `$${big}^\\circ$ 正好是直角。`,
              `$${big}^\\circ$ 大于 $90^\\circ$，是钝角。`,
            ][kind]!,
          ];
          const reasons: Pair[] = [
            [
              `The largest angle, $${big}^\\circ$, is not less than $90^\\circ$; the smaller angles being acute is not enough.`,
              `最大的角 $${big}^\\circ$ 不小于 $90^\\circ$；只有较小的角是锐角还不够。`,
            ],
            [
              `No angle is exactly $90^\\circ$; the largest is $${big}^\\circ$.`,
              `没有哪个角正好是 $90^\\circ$；最大的角是 $${big}^\\circ$。`,
            ],
            [
              `No angle is more than $90^\\circ$; the largest is $${big}^\\circ$.`,
              `没有哪个角大于 $90^\\circ$；最大的角是 $${big}^\\circ$。`,
            ],
          ];
          const [p, q, r] = angles as [number, number, number];
          const points = triangleByAngles(p, q);
          const label = (m: number) => (m === 90 ? "90" : deg(m));
          return chosen(
            rng,
            [
              `A triangle has angles of ${list.join(", ")}. Classify it by its angles.`,
              `一个三角形的三个角是 ${list.join("、")}。按角给它分类。`,
            ],
            name(kind),
            [0, 1, 2].filter((k) => k !== kind).map((k): Wrong => [name(k), reasons[k]![0], reasons[k]![1]]),
            [
              [
                ["Find the largest angle", "找出最大的角"],
                [`The largest of ${list.join(", ")} is $${big}^\\circ$.`, `${list.join("、")} 中最大的是 $${big}^\\circ$。`],
              ],
              [
                ["Compare it with 90°", "和 90° 比较"],
                [
                  `${compare[0]} The triangle is ${angleKindsOfTriangles[kind]!.en.toLowerCase()}.`,
                  `${compare[1]}这是${angleKindsOfTriangles[kind]!["zh-CN"]}。`,
                ],
              ],
            ],
            [
              `The other two angles add up to $180 - ${big} = ${rest}$, which is ${["more than", "exactly", "less than"][kind]} $90$, so the triangle is ${angleKindsOfTriangles[kind]!.en.toLowerCase()}.`,
              `另外两个角的和是 $180 - ${big} = ${rest}$，${["大于", "正好等于", "小于"][kind]} $90$，所以是${angleKindsOfTriangles[kind]!["zh-CN"]}。`,
            ],
            figure(
              [{ kind: "polygon", points }, ...triangleArcs(points, [label(p), label(q), label(r)])],
              `A triangle with angles of ${p}°, ${q}° and ${r}°.`,
              `一个三角形，三个角分别是 ${p}°、${q}°、${r}°。`,
            ),
          );
        },
        drawn(gradeDrawings3["classifying-triangles#classifying-by-angles"]),
      ),
    ],
  },
  [
    "A coat hanger has two equal sloping sides and a long bottom bar, so by its sides it is an isosceles triangle. Its top angle is wide, more than $90^\\circ$, so by its angles it is an obtuse triangle.",
    "衣架有两条一样长的斜边和一根长长的底杆，所以按边分它是等腰三角形。它顶上的角很宽，大于 $90^\\circ$，所以按角分它是钝角三角形。",
  ],
  [
    "The two bottom angles of the hanger are equal and small, and together they leave more than $90^\\circ$ for the top angle.",
    "衣架底下的两个角相等而且很小，合起来给顶角留下了超过 $90^\\circ$。",
  ],
  [
    "name a triangle by its sides, as equilateral, isosceles or scalene, and by its angles, as acute, right or obtuse.",
    "学习按边把三角形分为等边、等腰、不等边三角形，按角分为锐角、直角、钝角三角形。",
  ],
);

/** whatATriangleMustBe is the third knowledge point of classifying triangles: which pairs of a side name and an angle name cannot happen. */
export const whatATriangleMustBe = lesson(
  "what-a-triangle-must-be",
  ["What a triangle must be", "三角形一定是什么"],
  [
    [
      "A triangle has one name by its sides and one by its angles, and some pairs cannot happen. An equilateral triangle has three equal angles that share $180^\\circ$, so each is $60^\\circ$: it is always acute, never right or obtuse. Two right or obtuse angles are also impossible, because together they already use up $180^\\circ$ or more.",
      "三角形按边有一个名称，按角也有一个名称，有些组合不可能出现。等边三角形的三个角相等，共分 $180^\\circ$，所以每个都是 $60^\\circ$：它总是锐角三角形，不可能是直角或钝角三角形。两个直角或两个钝角也不可能，因为它们合起来已经用掉 $180^\\circ$ 或更多。",
    ],
    [
      "Try to build an equilateral right triangle: its three equal angles would each be $90^\\circ$, and $3 \\times 90 = 270$ is not $180$.",
      "试着画一个等边直角三角形：三个相等的角都得是 $90^\\circ$，而 $3 \\times 90 = 270$ 不等于 $180$。",
    ],
    [
      "Isosceles triangles can be acute, right or obtuse: two equal sides do not make every angle $60^\\circ$. Only three equal sides do.",
      "等腰三角形可以是锐角、直角或钝角三角形：两条边相等并不要求角是 $60^\\circ$。只有等边三角形才这样。",
    ],
  ],
  (rng) => {
    const impossible: [Pair, Pair, Pair][] = [
      [
        ["An equilateral right triangle", "等边直角三角形"],
        [
          "All three angles of an equilateral triangle are $60^\\circ$, so none is a right angle.",
          "等边三角形的三个角都是 $60^\\circ$，所以没有直角。",
        ],
        [
          "Three equal $90^\\circ$ angles would total $270^\\circ$, not $180^\\circ$.",
          "三个相等的 $90^\\circ$ 角合起来是 $270^\\circ$，不是 $180^\\circ$。",
        ],
      ],
      [
        ["An equilateral obtuse triangle", "等边钝角三角形"],
        [
          "All three angles of an equilateral triangle are $60^\\circ$, so none is obtuse.",
          "等边三角形的三个角都是 $60^\\circ$，所以没有钝角。",
        ],
        [
          "Three equal angles, each more than $90^\\circ$, would total more than $270^\\circ$.",
          "三个相等的角都大于 $90^\\circ$，合起来会超过 $270^\\circ$。",
        ],
      ],
      [
        ["A right triangle with an obtuse angle", "有一个钝角的直角三角形"],
        ["The right angle and the obtuse angle alone add up to more than $180^\\circ$.", "直角和钝角加起来已经超过 $180^\\circ$。"],
        [
          "Even the smallest obtuse angle, just over $90^\\circ$, plus $90^\\circ$ is over $180^\\circ$, which leaves nothing for the third angle.",
          "最小的钝角也比 $90^\\circ$ 大，再加 $90^\\circ$ 就超过 $180^\\circ$，第三个角没有度数可用了。",
        ],
      ],
      [
        ["A triangle with two right angles", "有两个直角的三角形"],
        [
          "Two right angles already add up to $180^\\circ$, which leaves $0^\\circ$ for the third angle.",
          "两个直角的和已经是 $180^\\circ$，第三个角只剩 $0^\\circ$。",
        ],
        [
          "Two sides standing straight up from the same base never lean toward each other, so they never meet.",
          "从同一条底边垂直竖起的两条边不会互相靠近，所以永远不会相交。",
        ],
      ],
    ];
    const possible: [Pair, string, string][] = [
      [
        ["An isosceles right triangle", "等腰直角三角形"],
        "It exists: angles $45^\\circ$, $45^\\circ$, $90^\\circ$ with two equal legs.",
        "它存在：角为 $45^\\circ$、$45^\\circ$、$90^\\circ$，两条直角边相等。",
      ],
      [
        ["An isosceles obtuse triangle", "等腰钝角三角形"],
        "It exists: angles $30^\\circ$, $30^\\circ$, $120^\\circ$.",
        "它存在：角为 $30^\\circ$、$30^\\circ$、$120^\\circ$。",
      ],
      [
        ["A scalene right triangle", "不等边直角三角形"],
        "It exists: sides $3$, $4$, $5$ make a right angle.",
        "它存在：边长 $3$、$4$、$5$ 构成直角。",
      ],
      [
        ["A scalene obtuse triangle", "不等边钝角三角形"],
        "It exists: angles $20^\\circ$, $40^\\circ$, $120^\\circ$.",
        "它存在：角为 $20^\\circ$、$40^\\circ$、$120^\\circ$。",
      ],
      [
        ["An isosceles acute triangle", "等腰锐角三角形"],
        "It exists: angles $50^\\circ$, $50^\\circ$, $80^\\circ$.",
        "它存在：角为 $50^\\circ$、$50^\\circ$、$80^\\circ$。",
      ],
      [
        ["A scalene acute triangle", "不等边锐角三角形"],
        "It exists: angles $50^\\circ$, $60^\\circ$, $70^\\circ$.",
        "它存在：角为 $50^\\circ$、$60^\\circ$、$70^\\circ$。",
      ],
      [
        ["An equilateral acute triangle", "等边锐角三角形"],
        "It exists: every equilateral triangle has three $60^\\circ$ angles, so it is acute.",
        "它存在：每个等边三角形都有三个 $60^\\circ$ 的角，所以是锐角三角形。",
      ],
    ];
    const [bad, why, again] = rng.pick(impossible);
    return chosen(
      rng,
      ["Which of these triangles cannot exist?", "下面哪种三角形不可能存在？"],
      bad,
      rng.sample(possible, 3),
      [
        [
          ["Use the angle sum", "用内角和"],
          ["The three angles of any triangle add up to $180^\\circ$.", "任何三角形的三个角之和都是 $180^\\circ$。"],
        ],
        [
          ["Test the impossible one", "检验不可能的那个"],
          [`${bad[0]} cannot exist. ${why[0]}`, `${bad[1]}不可能存在。${why[1]}`],
        ],
      ],
      again,
    );
  },
  drawn(gradeDrawings4["classifying-triangles#what-a-triangle-must-be"]),
);
export const isoscelesTriangles: TopicDef = {
  id: "isosceles-triangles",
  title: t("The Isosceles Triangle Theorem", "等腰三角形定理"),
  summary: t(
    "Use equal base angles to find the angles of isosceles and equilateral triangles.",
    "利用底角相等求等腰三角形和等边三角形的角。",
  ),
  prerequisites: ["classifying-triangles", "angles-of-a-triangle"],
  encompasses: [{ topic: "angles-of-a-triangle", weight: 0.6 }],
  xp: 10,
  standards: ["CCSS.8.G.A.5"],
  knowledgePoints: [
    {
      id: "base-angles",
      figure: gradeDrawings3["isosceles-triangles#base-angles"],
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
      figure: gradeDrawings5["isosceles-triangles#isosceles-angle-equations"],
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
                `In an isosceles triangle, the vertex angle is $${k}$ times a base angle. Find a base angle $x$.`,
                `在一个等腰三角形中，顶角是底角的 $${k}$ 倍。求底角 $x$。`,
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
export const polygonName = (n: number): Text => polygonNames[n] ?? t(`${n}-gon`, `${n} 边形`);

/** interiorAngle is the measure of an interior angle at vertex i of a polygon. */
function interiorAngle(points: readonly Point[], i: number): number {
  const n = points.length;
  const [p, v, q] = [points[(i + n - 1) % n]!, points[i]!, points[(i + 1) % n]!];
  const a = Math.atan2(p[1] - v[1], p[0] - v[0]) - Math.atan2(q[1] - v[1], q[0] - v[0]);
  return ((a * 180) / Math.PI + 720) % 360;
}

export const anglesOfPolygons: TopicDef = {
  id: "angles-of-polygons",
  title: t("Interior Angles of Polygons", "多边形的内角"),
  summary: t(
    "Find the angle sum of a polygon, the angles of regular polygons, and missing angles.",
    "求多边形的内角和、正多边形的角以及未知角。",
  ),
  prerequisites: ["angles-of-a-triangle"],
  encompasses: [],
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
            ? t(
                `What is the sum of the interior angles of ${/^[aeio]/.test(name.en) ? "an" : "a"} ${name.en}?`,
                `${name["zh-CN"]}的内角和是多少度？`,
              )
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
      figure: gradeDrawings5["angles-of-polygons#angles-of-regular-polygons"],
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
      figure: gradeDrawings3["angles-of-polygons#missing-angles-in-polygons"],
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
