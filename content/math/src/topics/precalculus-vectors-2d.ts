import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Mark, type Point, paren, poly, Q, sketch } from "@ga/subject-math";
import { precalculusDrawings2 } from "../explanation-drawings-precalculus-2.ts";
import { precalculusDrawings4 } from "../explanation-drawings-precalculus-4.ts";
import { choiceProblem, numberProblem, pointProblem, steps } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { type Reason, reasoned } from "../wrong-reasons.ts";

// Precalculus unit 5: Vectors (modules 5.16 and 5.17: 2D Vectors).

/** Step is one step of a solution: its title in English and Chinese, what it does, and the lines it displays. */
type Step = readonly [title: readonly [en: string, zh: string], say: Text, lines?: readonly string[]];

/** walked writes a solution as labelled steps followed by a check, in each locale. */
function walked(parts: readonly Step[], check: Text): Text {
  const write = (locale: keyof Text) =>
    parts
      .map(
        ([[en, zh], say, lines = []], i) =>
          `${stepLabel(i + 1, en, zh)[locale]} ${say[locale]}${lines.length > 0 ? steps(...lines) : "\n\n"}`,
      )
      .join("") + (locale === "en" ? `**Check.** ${check.en}` : `**检验。** ${check["zh-CN"]}`);
  return t(write("en"), write("zh-CN"));
}

/** why pairs a wrong option with what is wrong with it in English and Chinese. */
const why = (option: Text, en: string, zh: string): Reason => [option.en, en, zh];

/** same writes one text for both locales, as for an option that is only mathematics. */
const same = (s: string) => t(s, s);

/** oneOf builds a choice problem from the right option and up to three wrong ones, with reasons for the wrong ones. */
function oneOf(rng: Rng, prompt: Text, right: Text, wrong: readonly Text[], solution: Text, reasons: readonly Reason[] = []): Problem {
  const seen = new Set([right.en]);
  const rest: Text[] = [];
  for (const w of wrong) {
    if (!seen.has(w.en)) {
      seen.add(w.en);
      rest.push(w);
    }
  }
  const options = [right, ...rest.slice(0, 3)];
  const order = rng.shuffle(options.map((_, i) => i));
  const problem = choiceProblem({ prompt, options: order.map((i) => options[i]!), correct: order.indexOf(0), solution });
  return reasons.length > 0 ? reasoned(problem, reasons) : problem;
}

// ─── 5.16.1 Introduction to Vectors ─────────────────────────────────────────

/** introductionToVectors covers vector concepts, notations, and initial/terminal points. */
export const introductionToVectors: TopicDef = {
  id: "introduction-to-vectors",
  title: t("Introduction to Vectors", "向量的概念与表示"),
  summary: t(
    "Understand vectors as directed line segments with magnitude and direction, distinguish between scalar and vector quantities, and identify initial and terminal points.",
    "理解向量作为有向线段（既有大小又有方向）的概念，区分标量与向量，并识别向量的起点与终点。",
  ),
  prerequisites: ["the-pythagorean-theorem"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.1"],
  intro: t(
    `A wind of $30\\text{ km/h}$ blowing north has a size and a direction; a temperature of $30^\\circ\\text{C}$ has only a size. Quantities like the wind are vectors, drawn as arrows: $\\vec{PQ}$ starts at its initial point $P$ and ends at its terminal point $Q$.

Check: reversing the arrow keeps its length but swaps its ends, so $-\\vec{PQ} = \\vec{QP}$, which starts at $Q$.

In this lesson we tell scalars from vectors, name the ends of a directed segment, and find equal vectors in a parallelogram.`,
    `以 $30\\text{ km/h}$ 向北吹的风既有大小又有方向；$30^\\circ\\text{C}$ 的温度只有大小。像风这样的量是向量，用箭头表示：$\\vec{PQ}$ 从起点 $P$ 出发，到终点 $Q$ 结束。

检验：把箭头反过来，长度不变，两端互换，所以 $-\\vec{PQ} = \\vec{QP}$，它从 $Q$ 出发。

这节课我们区分标量和向量，说出有向线段的两端，并在平行四边形中找出相等的向量。`,
  ),
  knowledgePoints: [
    {
      id: "scalars-versus-vectors",
      title: t("Distinguish between scalars and vectors", "区分标量与向量"),
      explanation: t(
        "A **scalar** is a quantity described completely by its magnitude (a numerical value with units, such as mass, temperature, time, distance, or speed).\n\nA **vector** is a quantity that possesses both **magnitude** and **direction** (such as displacement, velocity, acceleration, force, or momentum).\n\nFor a ball thrown at $20\\text{ m/s}$ straight up: $20\\text{ m/s}$ is a magnitude and straight up is a direction, so it is a vector, a velocity. Check: drop the direction and only the speed $20\\text{ m/s}$ is left, which is a scalar.\n\n> **Watch out.** A number with units is not enough to make a vector; it needs a direction. Speed, distance, time, mass and energy are scalars however they are measured.",
        "**标量**是仅由大小（数值和单位）完全确定的物理量，如质量、温度、时间、路程或速率。\n\n**向量**（矢量）是既有**大小**又有**方向**的量，如位移、速度、加速度、力或动量等。\n\n对以 $20\\text{ m/s}$ 竖直上抛的球：$20\\text{ m/s}$ 是大小，竖直向上是方向，所以它是向量，即速度。检验：去掉方向，只剩速率 $20\\text{ m/s}$，那是标量。\n\n> **注意。** 有数值和单位还不够，向量必须有方向。速率、路程、时间、质量和能量不管怎么测量都是标量。",
      ),
      generate(rng) {
        const item = rng.pick([
          {
            desc: (v: number) => ({
              en: `A car traveling at $${v}\\text{ km/h}$ due north`,
              zh: `一辆汽车以 $${v}\\text{ km/h}$ 向正北行驶`,
            }),
            isVector: true,
            concept: { en: "velocity", zh: "速度" },
          },
          {
            desc: (v: number) => ({ en: `A temperature reading of $${v}^\\circ\\text{C}$`, zh: `温度计读数为 $${v}^\\circ\\text{C}$` }),
            isVector: false,
            concept: { en: "temperature", zh: "温度" },
          },
          {
            desc: (v: number) => ({
              en: `A downward gravitational force of $${v}\\text{ N}$`,
              zh: `一个大小为 $${v}\\text{ N}$ 向下的重力`,
            }),
            isVector: true,
            concept: { en: "force", zh: "力" },
          },
          {
            desc: (v: number) => ({ en: `A gold bar with a mass of $${v}\\text{ kg}$`, zh: `一块质量为 $${v}\\text{ kg}$ 的金条` }),
            isVector: false,
            concept: { en: "mass", zh: "质量" },
          },
          {
            desc: (v: number) => ({
              en: `An airplane flying with a speed of $${v}\\text{ knots}$ at a bearing of $120^\\circ$`,
              zh: `一架飞机以 $${v}\\text{ 节}$ 的速率沿方位角 $120^\\circ$ 飞行`,
            }),
            isVector: true,
            concept: { en: "velocity", zh: "速度" },
          },
          {
            desc: (v: number) => ({
              en: `A road trip spanning a total distance of $${v}\\text{ miles}$`,
              zh: `一段总路程为 $${v}\\text{ 英里}$ 的公路旅行`,
            }),
            isVector: false,
            concept: { en: "distance", zh: "路程" },
          },
          {
            desc: (v: number) => ({
              en: `A rocket accelerating at $${v}\\text{ m/s}^2$ straight up`,
              zh: `一枚火箭以 $${v}\\text{ m/s}^2$ 竖直向上加速`,
            }),
            isVector: true,
            concept: { en: "acceleration", zh: "加速度" },
          },
          {
            desc: (v: number) => ({ en: `An elapsed time interval of $${v}\\text{ seconds}$`, zh: `经过了 $${v}\\text{ 秒}$ 的时间间隔` }),
            isVector: false,
            concept: { en: "time", zh: "时间" },
          },
          {
            desc: (v: number) => ({
              en: `A water tank with a capacity of $${v}\\text{ liters}$`,
              zh: `一个容量为 $${v}\\text{ 升}$ 的水箱`,
            }),
            isVector: false,
            concept: { en: "volume", zh: "体积" },
          },
          {
            desc: (v: number) => ({
              en: `A wind blowing at $${v}\\text{ mph}$ toward the southwest`,
              zh: `以 $${v}\\text{ mph}$ 吹向西南方向的风`,
            }),
            isVector: true,
            concept: { en: "velocity", zh: "速度" },
          },
          {
            desc: (v: number) => ({
              en: `A person pushing a crate with $${v}\\text{ N}$ of force horizontally to the right`,
              zh: `一人用 $${v}\\text{ N}$ 的力水平向右推箱子`,
            }),
            isVector: true,
            concept: { en: "force", zh: "力" },
          },
          {
            desc: (v: number) => ({
              en: `A light bulb consuming $${v}\\text{ joules}$ of electrical energy`,
              zh: `一个灯泡消耗了 $${v}\\text{ 焦耳}$ 的电能`,
            }),
            isVector: false,
            concept: { en: "energy", zh: "能量" },
          },
        ]);
        const val = rng.pick([15, 24, 35, 42, 50, 68, 75, 84, 96, 110, 125, 250]);
        const d = item.desc(val);
        const isVec = item.isVector;

        const right = isVec
          ? t("Vector, because it has both magnitude and direction.", "向量，因为它既有大小又有方向。")
          : t("Scalar, because it has magnitude but no direction.", "标量，因为它只有大小而没有方向。");

        const wrong = isVec
          ? [
              t("Scalar, because it only has magnitude.", "标量，因为只有大小。"),
              t("Scalar, because all physical measurements are scalars.", "标量，因为所有物理测量值都是标量。"),
              t("Vector, because it has no magnitude.", "向量，因为没有大小。"),
            ]
          : [
              t("Vector, because it specifies a physical measurement.", "向量，因为它表示一个物理测量值。"),
              t("Vector, because it has both magnitude and direction.", "向量，因为它既有大小又有方向。"),
              t("Scalar, because it has direction but no magnitude.", "标量，因为它有方向但没有大小。"),
            ];

        return oneOf(
          rng,
          t(`Determine whether the given quantity is a scalar or a vector: "${d.en}".`, `判断下列物理量是标量还是向量："${d.zh}"。`),
          right,
          wrong,
          walked(
            [
              [
                ["Look for a direction", "找方向"],
                isVec
                  ? t(`Besides the size $${val}$, the description names a direction.`, `除了大小 $${val}$ 之外，描述中还指明了方向。`)
                  : t(
                      `The description gives only the size $${val}$ and its unit; it names no direction.`,
                      `描述中只给出大小 $${val}$ 和单位，没有指明方向。`,
                    ),
              ],
              [
                ["Classify it", "判断类别"],
                isVec
                  ? t(
                      `A quantity with both a magnitude and a direction is a vector: this is a ${item.concept.en}.`,
                      `既有大小又有方向的量是向量：这是${item.concept.zh}。`,
                    )
                  : t(
                      `A quantity with a magnitude only is a scalar: this is a ${item.concept.en}.`,
                      `只有大小的量是标量：这是${item.concept.zh}。`,
                    ),
              ],
            ],
            isVec
              ? t(
                  `Reversing the direction would describe a different ${item.concept.en} of the same size $${val}$, so the direction is part of the quantity.`,
                  `把方向反过来，会得到大小同为 $${val}$ 的另一个${item.concept.zh}，所以方向是这个量的一部分。`,
                )
              : t(
                  `Turning or reversing would not change a ${item.concept.en} of $${val}$: there is no direction to change.`,
                  `转动或反向都不会改变 $${val}$ 的${item.concept.zh}：它没有可以改变的方向。`,
                ),
          ),
          isVec
            ? [
                why(wrong[0]!, "It also names a direction, so it has more than a magnitude.", "它还指明了方向，所以不只有大小。"),
                why(
                  wrong[1]!,
                  "Many measurements, such as force and velocity, have a direction, and this one does.",
                  "许多测量值，例如力和速度，都有方向，这个量也有。",
                ),
                why(
                  wrong[2]!,
                  `It has the magnitude $${val}$; a vector has both a magnitude and a direction.`,
                  `它有大小 $${val}$；向量既有大小又有方向。`,
                ),
              ]
            : [
                why(
                  wrong[0]!,
                  "Being a measurement does not make a vector; a vector needs a direction, and none is given.",
                  "是测量值并不就是向量；向量需要方向，而这里没有。",
                ),
                why(wrong[1]!, `No direction is given, only the size $${val}$.`, `这里没有方向，只有大小 $${val}$。`),
                why(
                  wrong[2]!,
                  `It has the magnitude $${val}$ and no direction; the reason is backwards.`,
                  `它有大小 $${val}$ 而没有方向；理由说反了。`,
                ),
              ],
        );
      },
    },
    {
      id: "initial-and-terminal-points",
      title: t("Identify initial and terminal points of a directed line segment", "确定有向线段的起点与终点"),
      explanation: t(
        "A directed line segment representing vector $\\vec{AB}$ originates at point $A$ (**initial point** or tail) and points to point $B$ (**terminal point** or head).\n\nThe opposite vector $-\\vec{AB}$ has reversed direction: $-\\vec{AB} = \\vec{BA}$, with initial point $B$ and terminal point $A$.\n\nFor $\\vec{MN}$: the initial point is $M$ and the terminal point is $N$, and $-\\vec{MN} = \\vec{NM}$ starts at $N$. Check: $\\vec{MN} + \\vec{NM}$ goes from $M$ to $N$ and back, which is the zero vector.\n\n> **Watch out.** Read the letters in order: the first is where the arrow starts. Neither end is the origin unless the vector is written from $O$.",
        "表示向量 $\\vec{AB}$ 的有向线段始于点 $A$（**起点**），指向点 $B$（**终点**）。\n\n相反向量 $-\\vec{AB}$ 的方向相反：$-\\vec{AB} = \\vec{BA}$，其起点为 $B$，终点为 $A$。\n\n对 $\\vec{MN}$：起点是 $M$，终点是 $N$；$-\\vec{MN} = \\vec{NM}$ 从 $N$ 出发。检验：$\\vec{MN} + \\vec{NM}$ 从 $M$ 到 $N$ 再回来，是零向量。\n\n> **注意。** 按字母顺序读：第一个字母是箭头的出发点。除非向量从 $O$ 写起，否则两端都不是原点。",
      ),
      generate(rng) {
        const letters = ["A", "B", "C", "D", "P", "Q", "R", "S", "M", "N"];
        const p1 = rng.pick(letters);
        let p2 = rng.pick(letters);
        while (p2 === p1) p2 = rng.pick(letters);

        const mode = rng.pick(["identify", "opposite"]);
        if (mode === "identify") {
          return oneOf(
            rng,
            t(
              `For the directed line segment representing the vector $\\vec{${p1}${p2}}$, identify its initial point and terminal point.`,
              `对于表示向量 $\\vec{${p1}${p2}}$ 的有向线段，确定其起点和终点。`,
            ),
            t(`Initial point: $${p1}$, Terminal point: $${p2}$`, `起点：$${p1}$，终点：$${p2}$`),
            [
              t(`Initial point: $${p2}$, Terminal point: $${p1}$`, `起点：$${p2}$，终点：$${p1}$`),
              t(`Initial point: $${p1}$, Terminal point: the origin`, `起点：$${p1}$，终点：原点`),
              t(`Initial point: the origin, Terminal point: $${p2}$`, `起点：原点，终点：$${p2}$`),
            ],
            walked(
              [
                [
                  ["Read the first letter", "读第一个字母"],
                  t(
                    `The first letter of $\\vec{${p1}${p2}}$ is where the arrow starts: the initial point is $${p1}$.`,
                    `$\\vec{${p1}${p2}}$ 的第一个字母是箭头出发的地方：起点是 $${p1}$。`,
                  ),
                ],
                [
                  ["Read the second letter", "读第二个字母"],
                  t(
                    `The second letter is where the arrow ends: the terminal point is $${p2}$.`,
                    `第二个字母是箭头结束的地方：终点是 $${p2}$。`,
                  ),
                ],
              ],
              t(
                `The arrow points from $${p1}$ toward $${p2}$; reversing it gives $\\vec{${p2}${p1}}$, whose ends are swapped.`,
                `箭头从 $${p1}$ 指向 $${p2}$；把它反过来得到 $\\vec{${p2}${p1}}$，两端互换。`,
              ),
            ),
            [
              why(
                t(`Initial point: $${p2}$, Terminal point: $${p1}$`, ""),
                `These are the ends of $\\vec{${p2}${p1}}$, the opposite vector.`,
                `这是相反向量 $\\vec{${p2}${p1}}$ 的两端。`,
              ),
              why(
                t(`Initial point: $${p1}$, Terminal point: the origin`, ""),
                `The terminal point is the second letter, $${p2}$; the origin appears only in vectors written from $O$.`,
                `终点是第二个字母 $${p2}$；只有从 $O$ 写起的向量才涉及原点。`,
              ),
              why(
                t(`Initial point: the origin, Terminal point: $${p2}$`, ""),
                `The initial point is the first letter, $${p1}$; the origin appears only in vectors written from $O$.`,
                `起点是第一个字母 $${p1}$；只有从 $O$ 写起的向量才涉及原点。`,
              ),
            ],
          );
        }

        return oneOf(
          rng,
          t(
            `Which directed line segment represents the opposite (negative) vector of $\\vec{${p1}${p2}}$?`,
            `哪个有向线段表示向量 $\\vec{${p1}${p2}}$ 的相反向量？`,
          ),
          t(`$\\vec{${p2}${p1}}$`, `$\\vec{${p2}${p1}}$`),
          [
            t(`$\\vec{${p1}${p2}}$`, `$\\vec{${p1}${p2}}$`),
            t(`$\\vec{${p1}${p1}}$`, `$\\vec{${p1}${p1}}$`),
            t(`$\\vec{${p2}${p2}}$`, `$\\vec{${p2}${p2}}$`),
          ],
          walked(
            [
              [
                ["Keep the length, reverse the direction", "长度不变，方向相反"],
                t(
                  `The opposite vector is as long as $\\vec{${p1}${p2}}$ and points the other way, from $${p2}$ back to $${p1}$.`,
                  `相反向量与 $\\vec{${p1}${p2}}$ 一样长，方向相反，从 $${p2}$ 指回 $${p1}$。`,
                ),
              ],
              [
                ["Swap the letters", "交换字母"],
                t(`So the initial and terminal points trade places:`, `所以起点和终点互换：`),
                [`-\\vec{${p1}${p2}} = \\vec{${p2}${p1}}`],
              ],
            ],
            t(
              `Going from $${p1}$ to $${p2}$ and back ends where it started: $\\vec{${p1}${p2}} + \\vec{${p2}${p1}} = \\vec{${p1}${p1}} = \\mathbf{0}$.`,
              `从 $${p1}$ 到 $${p2}$ 再回来，回到出发点：$\\vec{${p1}${p2}} + \\vec{${p2}${p1}} = \\vec{${p1}${p1}} = \\mathbf{0}$。`,
            ),
          ),
          [
            why(same(`$\\vec{${p1}${p2}}$`), "This is the vector itself, pointing the same way.", "这是向量本身，方向没变。"),
            why(
              same(`$\\vec{${p1}${p1}}$`),
              `This starts and ends at $${p1}$, so it is the zero vector.`,
              `它的起点和终点都是 $${p1}$，所以是零向量。`,
            ),
            why(
              same(`$\\vec{${p2}${p2}}$`),
              `This starts and ends at $${p2}$, so it is the zero vector.`,
              `它的起点和终点都是 $${p2}$，所以是零向量。`,
            ),
          ],
        );
      },
    },
  ],
};

// ─── 5.16.2 The Triangle Law for the Addition of Two Vectors ────────────────

/** vectorArrow draws the vector from a to b as a segment with an arrowhead at b. */
function vectorArrow(a: Point, b: Point, style: { accent?: boolean; dashed?: boolean } = {}): Mark[] {
  const n = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const [ux, uy] = [(b[0] - a[0]) / n, (b[1] - a[1]) / n];
  const head = [0.45, -0.45].map((ang): Mark => {
    const [c, s] = [Math.cos(ang), Math.sin(ang)];
    return { kind: "segment", a: b, b: [b[0] - 0.4 * (ux * c - uy * s), b[1] - 0.4 * (ux * s + uy * c)], accent: style.accent };
  });
  return [{ kind: "segment", a, b, ...style }, ...head];
}

/** triangleLawFigure shows AB and BC placed head to tail, with their sum AC closing the triangle. */
const triangleLawFigure: Figure = (() => {
  const [a, b, c]: Point[] = [
    [0, 0],
    [4, 0.5],
    [5.5, 3.5],
  ];
  return {
    svg: sketch([
      ...vectorArrow(a!, b!),
      ...vectorArrow(b!, c!),
      ...vectorArrow(a!, c!, { accent: true }),
      { kind: "label", at: a!, text: "A", dir: "w" },
      { kind: "label", at: b!, text: "B", dir: "se" },
      { kind: "label", at: c!, text: "C", dir: "n" },
    ]),
    alt: t(
      "Triangle ABC with arrows from A to B and from B to C, the second starting where the first ends, and a highlighted arrow from A to C showing their sum.",
      "三角形 ABC：从 A 指向 B 的箭头，以及从它的终点 B 出发指向 C 的箭头；高亮的从 A 指向 C 的箭头表示两者之和。",
    ),
  };
})();

/** parallelogramLawFigure shows parallelogram ABCD with u = AB and v = AD, the diagonal AC = u + v and the diagonal BD = v − u. */
const parallelogramLawFigure: Figure = (() => {
  const [a, b, c, d]: Point[] = [
    [0, 0],
    [5, 0],
    [7, 3],
    [2, 3],
  ];
  return {
    svg: sketch([
      { kind: "segment", a: b!, b: c! },
      { kind: "segment", a: d!, b: c! },
      ...vectorArrow(a!, b!),
      ...vectorArrow(a!, d!),
      ...vectorArrow(a!, c!, { accent: true }),
      ...vectorArrow(b!, d!, { dashed: true }),
      { kind: "side", a: a!, b: b!, text: "u" },
      { kind: "side", a: d!, b: a!, text: "v" },
      { kind: "label", at: [2.8, 1.2], text: "u + v", dir: "nw" },
      { kind: "label", at: [4.1, 0.9], text: "v − u", dir: "ne" },
      { kind: "label", at: a!, text: "A", dir: "sw" },
      { kind: "label", at: b!, text: "B", dir: "se" },
      { kind: "label", at: c!, text: "C", dir: "ne" },
      { kind: "label", at: d!, text: "D", dir: "nw" },
    ]),
    alt: t(
      "Parallelogram ABCD with u the arrow from A to B and v the arrow from A to D. The highlighted diagonal from A to C is u + v, and the dashed diagonal from B to D is v − u.",
      "平行四边形 ABCD：u 是从 A 指向 B 的箭头，v 是从 A 指向 D 的箭头。高亮的对角线从 A 指向 C，表示 u + v；虚线对角线从 B 指向 D，表示 v − u。",
    ),
  };
})();

/** theTriangleLawForTheAdditionOfTwoVectors covers head-to-tail addition and parallelogram law. */
export const theTriangleLawForTheAdditionOfTwoVectors: TopicDef = {
  id: "the-triangle-law-for-the-addition-of-two-vectors",
  title: t("The Triangle Law for the Addition of Two Vectors", "向量加法的三角形法则"),
  summary: t(
    "Apply the triangle law and the parallelogram law to find the resultant sum and difference of vectors.",
    "应用三角形法则与平行四边形法则求解向量的和（合向量）与差。",
  ),
  prerequisites: ["introduction-to-vectors"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.VM.B.4"],
  intro: t(
    `To add $\\vec{AB}$ and $\\vec{BC}$, follow the first arrow from $A$ to $B$ and then the second from $B$ to $C$; the trip from $A$ to $C$ is the sum, $\\vec{AB} + \\vec{BC} = \\vec{AC}$. If $\\vec{AB}$ is $3$ units east and $\\vec{BC}$ is $4$ units north, the sum is $5$ units long, not $7$.

Check: walking $3$ east and then $4$ north ends at $(3, 4)$, which is $\\sqrt{9 + 16} = 5$ from the start.

In this lesson we add vectors head to tail, read sums and differences off a parallelogram, and find the longest and shortest possible sum of two vectors.`,
    `要把 $\\vec{AB}$ 和 $\\vec{BC}$ 相加，先沿第一个箭头从 $A$ 到 $B$，再沿第二个箭头从 $B$ 到 $C$；从 $A$ 到 $C$ 的这一趟就是和，$\\vec{AB} + \\vec{BC} = \\vec{AC}$。如果 $\\vec{AB}$ 是向东 $3$ 个单位，$\\vec{BC}$ 是向北 $4$ 个单位，和的长度是 $5$，不是 $7$。

检验：向东走 $3$ 再向北走 $4$，到达 $(3, 4)$，离出发点 $\\sqrt{9 + 16} = 5$。

这节课我们首尾相接地把向量相加，从平行四边形读出和与差，并求两个向量之和可能的最大长度和最小长度。`,
  ),
  knowledgePoints: [
    {
      id: "triangle-law-head-to-tail",
      title: t("Apply the triangle law (head-to-tail addition)", "应用向量加法的三角形法则（首尾相接）"),
      explanation: t(
        "By the **triangle law** of vector addition, placing the tail of vector $\\vec{BC}$ at the head of vector $\\vec{AB}$ results in the sum:\n\n$$\\vec{AB} + \\vec{BC} = \\vec{AC}$$\n\nFor vector subtraction: $\\vec{AB} - \\vec{AC} = \\vec{AB} + \\vec{CA} = \\vec{CB}$.\n\nFor $\\vec{PQ} + \\vec{QR} + \\vec{RS}$: the first two give $\\vec{PR}$, and adding $\\vec{RS}$ gives $\\vec{PS}$. Check: the inner letters $Q$ and $R$ each end one arrow and start the next, so only the first letter $P$ and the last letter $S$ remain.\n\n> **Watch out.** The triangle law needs the second vector to start where the first ends. $\\vec{AB} + \\vec{CB}$ is not $\\vec{AC}$; rewrite $\\vec{CB}$ as $-\\vec{BC}$ first.",
        "根据向量加法的**三角形法则**，将向量 $\\vec{BC}$ 的起点接在向量 $\\vec{AB}$ 的终点上，其和向量为：\n\n$$\\vec{AB} + \\vec{BC} = \\vec{AC}$$\n\n对于向量减法：$$\\vec{AB} - \\vec{AC} = \\vec{AB} + \\vec{CA} = \\vec{CB}$$。\n\n对 $\\vec{PQ} + \\vec{QR} + \\vec{RS}$：前两个得 $\\vec{PR}$，再加 $\\vec{RS}$ 得 $\\vec{PS}$。检验：中间的字母 $Q$ 和 $R$ 各是一个箭头的终点、下一个箭头的起点，所以只剩第一个字母 $P$ 和最后一个字母 $S$。\n\n> **注意。** 三角形法则要求第二个向量从第一个向量的终点出发。$\\vec{AB} + \\vec{CB}$ 不是 $\\vec{AC}$；要先把 $\\vec{CB}$ 写成 $-\\vec{BC}$。",
      ),
      figure: triangleLawFigure,
      generate(rng) {
        const letters = ["A", "B", "C", "D", "E", "P", "Q", "R", "S"];
        const p1 = rng.pick(letters);
        let p2 = rng.pick(letters);
        while (p2 === p1) p2 = rng.pick(letters);
        let p3 = rng.pick(letters);
        while (p3 === p1 || p3 === p2) p3 = rng.pick(letters);
        let p4 = rng.pick(letters);
        while (p4 === p1 || p4 === p2 || p4 === p3) p4 = rng.pick(letters);

        const kind = rng.pick(["two-sum", "three-sum", "subtraction"]);
        if (kind === "two-sum") {
          return oneOf(
            rng,
            t(
              `Simplify the vector expression: $\\vec{${p1}${p2}} + \\vec{${p2}${p3}}$.`,
              `化简向量表达式：$\\vec{${p1}${p2}} + \\vec{${p2}${p3}}$。`,
            ),
            t(`$\\vec{${p1}${p3}}$`, `$\\vec{${p1}${p3}}$`),
            [
              t(`$\\vec{${p3}${p1}}$`, `$\\vec{${p3}${p1}}$`),
              t(`$\\vec{${p2}${p3}}$`, `$\\vec{${p2}${p3}}$`),
              t(`$\\vec{${p1}${p2}}$`, `$\\vec{${p1}${p2}}$`),
            ],
            walked(
              [
                [
                  ["Check that the arrows meet", "确认首尾相接"],
                  t(
                    `$\\vec{${p1}${p2}}$ ends at $${p2}$, which is where $\\vec{${p2}${p3}}$ starts.`,
                    `$\\vec{${p1}${p2}}$ 的终点是 $${p2}$，正是 $\\vec{${p2}${p3}}$ 的起点。`,
                  ),
                ],
                [
                  ["Join the ends", "连接首尾"],
                  t(
                    `The sum runs from the start of the first arrow to the end of the second:`,
                    `和从第一个箭头的起点指向第二个箭头的终点：`,
                  ),
                  [`\\vec{${p1}${p2}} + \\vec{${p2}${p3}} = \\vec{${p1}${p3}}`],
                ],
              ],
              t(
                `Taking the second vector away again, $\\vec{${p1}${p3}} + \\vec{${p3}${p2}} = \\vec{${p1}${p2}}$, the first vector.`,
                `再减去第二个向量：$\\vec{${p1}${p3}} + \\vec{${p3}${p2}} = \\vec{${p1}${p2}}$，正是第一个向量。`,
              ),
            ),
            [
              why(
                same(`$\\vec{${p3}${p1}}$`),
                `This points from $${p3}$ back to $${p1}$, the opposite of the sum.`,
                `它从 $${p3}$ 指回 $${p1}$，与和的方向相反。`,
              ),
              why(
                same(`$\\vec{${p2}${p3}}$`),
                "This is only the second vector; the sum starts where the first vector starts.",
                "这只是第二个向量；和应从第一个向量的起点出发。",
              ),
              why(
                same(`$\\vec{${p1}${p2}}$`),
                "This is only the first vector; the sum ends where the second vector ends.",
                "这只是第一个向量；和应到第二个向量的终点结束。",
              ),
            ],
          );
        }

        if (kind === "three-sum") {
          return oneOf(
            rng,
            t(
              `Simplify the chain of vectors: $\\vec{${p1}${p2}} + \\vec{${p2}${p3}} + \\vec{${p3}${p4}}$.`,
              `化简向量连加表达式：$\\vec{${p1}${p2}} + \\vec{${p2}${p3}} + \\vec{${p3}${p4}}$。`,
            ),
            t(`$\\vec{${p1}${p4}}$`, `$\\vec{${p1}${p4}}$`),
            [
              t(`$\\vec{${p4}${p1}}$`, `$\\vec{${p4}${p1}}$`),
              t(`$\\vec{${p1}${p3}}$`, `$\\vec{${p1}${p3}}$`),
              t(`$\\vec{${p2}${p4}}$`, `$\\vec{${p2}${p4}}$`),
            ],
            walked(
              [
                [
                  ["Add the first two", "先加前两个"],
                  t(
                    `$\\vec{${p1}${p2}}$ ends where $\\vec{${p2}${p3}}$ starts:`,
                    `$\\vec{${p1}${p2}}$ 的终点正是 $\\vec{${p2}${p3}}$ 的起点：`,
                  ),
                  [`\\vec{${p1}${p2}} + \\vec{${p2}${p3}} = \\vec{${p1}${p3}}`],
                ],
                [
                  ["Add the third", "再加第三个"],
                  t(
                    `$\\vec{${p1}${p3}}$ ends where $\\vec{${p3}${p4}}$ starts:`,
                    `$\\vec{${p1}${p3}}$ 的终点正是 $\\vec{${p3}${p4}}$ 的起点：`,
                  ),
                  [`\\vec{${p1}${p3}} + \\vec{${p3}${p4}} = \\vec{${p1}${p4}}`],
                ],
              ],
              t(
                `The inner points $${p2}$ and $${p3}$ each end one arrow and start the next, so only the first point $${p1}$ and the last point $${p4}$ remain.`,
                `中间的点 $${p2}$ 和 $${p3}$ 各是一个箭头的终点、下一个箭头的起点，所以只剩第一个点 $${p1}$ 和最后一个点 $${p4}$。`,
              ),
            ),
            [
              why(
                same(`$\\vec{${p4}${p1}}$`),
                `This points from $${p4}$ back to $${p1}$, the opposite of the sum.`,
                `它从 $${p4}$ 指回 $${p1}$，与和的方向相反。`,
              ),
              why(
                same(`$\\vec{${p1}${p3}}$`),
                `This leaves out the last vector, $\\vec{${p3}${p4}}$.`,
                `这漏掉了最后一个向量 $\\vec{${p3}${p4}}$。`,
              ),
              why(
                same(`$\\vec{${p2}${p4}}$`),
                `This leaves out the first vector, $\\vec{${p1}${p2}}$.`,
                `这漏掉了第一个向量 $\\vec{${p1}${p2}}$。`,
              ),
            ],
          );
        }

        return oneOf(
          rng,
          t(
            `Simplify the vector subtraction: $\\vec{${p1}${p2}} - \\vec{${p1}${p3}}$.`,
            `化简向量减法表达式：$\\vec{${p1}${p2}} - \\vec{${p1}${p3}}$。`,
          ),
          t(`$\\vec{${p3}${p2}}$`, `$\\vec{${p3}${p2}}$`),
          [
            t(`$\\vec{${p2}${p3}}$`, `$\\vec{${p2}${p3}}$`),
            t(`$\\vec{${p1}${p2}}$`, `$\\vec{${p1}${p2}}$`),
            t(`$\\vec{${p1}${p3}}$`, `$\\vec{${p1}${p3}}$`),
          ],
          walked(
            [
              [
                ["Turn the subtraction into addition", "把减法变成加法"],
                t(`Subtracting a vector adds its opposite:`, `减去一个向量就是加上它的相反向量：`),
                [`-\\vec{${p1}${p3}} = \\vec{${p3}${p1}}`],
              ],
              [
                ["Add head to tail", "首尾相接相加"],
                t(
                  `Put $\\vec{${p3}${p1}}$ first, so that it ends where $\\vec{${p1}${p2}}$ starts:`,
                  `把 $\\vec{${p3}${p1}}$ 放在前面，它的终点正是 $\\vec{${p1}${p2}}$ 的起点：`,
                ),
                [`\\vec{${p3}${p1}} + \\vec{${p1}${p2}} = \\vec{${p3}${p2}}`],
              ],
            ],
            t(
              `Adding the subtracted vector back gives the first one: $\\vec{${p1}${p3}} + \\vec{${p3}${p2}} = \\vec{${p1}${p2}}$.`,
              `把减去的向量加回去，得到第一个向量：$\\vec{${p1}${p3}} + \\vec{${p3}${p2}} = \\vec{${p1}${p2}}$。`,
            ),
          ),
          [
            why(
              same(`$\\vec{${p2}${p3}}$`),
              `This is $\\vec{${p1}${p3}} - \\vec{${p1}${p2}}$; the order of a subtraction matters.`,
              `这是 $\\vec{${p1}${p3}} - \\vec{${p1}${p2}}$；减法的顺序不能交换。`,
            ),
            why(same(`$\\vec{${p1}${p2}}$`), "This ignores the vector being subtracted.", "这忽略了被减去的向量。"),
            why(same(`$\\vec{${p1}${p3}}$`), "This is the vector being subtracted, not the result.", "这是被减去的向量，不是结果。"),
          ],
        );
      },
    },
    {
      id: "parallelogram-law-resultant",
      title: t("Apply the parallelogram law of vector addition", "应用向量加法的平行四边形法则"),
      explanation: t(
        "In a parallelogram $ABCD$ with adjacent edges representing vectors $\\mathbf{u} = \\vec{AB}$ and $\\mathbf{v} = \\vec{AD}$:\n\n- The main diagonal starting from $A$ represents the sum: $\\vec{AC} = \\mathbf{u} + \\mathbf{v}$\n- The diagonal $\\vec{BD}$ represents the difference: $\\vec{BD} = \\vec{AD} - \\vec{AB} = \\mathbf{v} - \\mathbf{u}$\n\nFor parallelogram $PQRS$ with $\\vec{PQ} = \\mathbf{u}$ and $\\vec{PS} = \\mathbf{v}$: $\\vec{PR} = \\mathbf{u} + \\mathbf{v}$ and $\\vec{QS} = \\mathbf{v} - \\mathbf{u}$. Check: $\\vec{PQ} + \\vec{QS} = \\mathbf{u} + (\\mathbf{v} - \\mathbf{u}) = \\mathbf{v}$, which is $\\vec{PS}$.\n\n> **Watch out.** The difference diagonal points toward the end of the vector that is not subtracted: $\\vec{BD} = \\mathbf{v} - \\mathbf{u}$ points toward $D$, the end of $\\mathbf{v}$, while $\\vec{DB} = \\mathbf{u} - \\mathbf{v}$.",
        "在以相邻边表示向量 $\\mathbf{u} = \\vec{AB}$ 和 $\\mathbf{v} = \\vec{AD}$ 的平行四边形 $ABCD$ 中：\n\n- 从 $A$ 出发的主对角线表示和向量：$$\\vec{AC} = \\mathbf{u} + \\mathbf{v}$$\n- 对角线 $\\vec{BD}$ 表示差向量：$$\\vec{BD} = \\vec{AD} - \\vec{AB} = \\mathbf{v} - \\mathbf{u}$$\n\n对平行四边形 $PQRS$，$\\vec{PQ} = \\mathbf{u}$，$\\vec{PS} = \\mathbf{v}$：$\\vec{PR} = \\mathbf{u} + \\mathbf{v}$，$\\vec{QS} = \\mathbf{v} - \\mathbf{u}$。检验：$\\vec{PQ} + \\vec{QS} = \\mathbf{u} + (\\mathbf{v} - \\mathbf{u}) = \\mathbf{v}$，正是 $\\vec{PS}$。\n\n> **注意。** 差的对角线指向被减数那个向量的终点：$\\vec{BD} = \\mathbf{v} - \\mathbf{u}$ 指向 $\\mathbf{v}$ 的终点 $D$，而 $\\vec{DB} = \\mathbf{u} - \\mathbf{v}$。",
      ),
      figure: parallelogramLawFigure,
      generate(rng) {
        const names = [
          ["A", "B", "C", "D"],
          ["P", "Q", "R", "S"],
          ["K", "L", "M", "N"],
          ["W", "X", "Y", "Z"],
          ["E", "F", "G", "H"],
        ];
        const [a, b, c, d] = rng.pick(names)!;
        const u = rng.pick(["\\mathbf{u}", "\\mathbf{a}", "\\vec{u}"]);
        const v = rng.pick(["\\mathbf{v}", "\\mathbf{b}", "\\vec{v}"]);

        const query = rng.pick(["sum-diag", "diff-diag-1", "diff-diag-2"]);
        if (query === "sum-diag") {
          return oneOf(
            rng,
            t(
              `In parallelogram $${a}${b}${c}${d}$, let $\\vec{${a}${b}} = ${u}$ and $\\vec{${a}${d}} = ${v}$. Express the diagonal $\\vec{${a}${c}}$ in terms of $${u}$ and $${v}$.`,
              `在平行四边形 $${a}${b}${c}${d}$ 中，设 $\\vec{${a}${b}} = ${u}$，$\\vec{${a}${d}} = ${v}$。用 $${u}$ 和 $${v}$ 表示对角线 $\\vec{${a}${c}}$。`,
            ),
            t(`$${u} + ${v}$`, `$${u} + ${v}$`),
            [t(`$${u} - ${v}$`, `$${u} - ${v}$`), t(`$${v} - ${u}$`, `$${v} - ${u}$`), t(`$2${u} + 2${v}$`, `$2${u} + 2${v}$`)],
            walked(
              [
                [
                  ["Use the opposite side", "利用对边"],
                  t(
                    `$\\vec{${b}${c}}$ is the side opposite $\\vec{${a}${d}}$ and points the same way, so $\\vec{${b}${c}} = ${v}$.`,
                    `$\\vec{${b}${c}}$ 是 $\\vec{${a}${d}}$ 的对边，方向相同，所以 $\\vec{${b}${c}} = ${v}$。`,
                  ),
                ],
                [
                  ["Add head to tail", "首尾相接相加"],
                  t(`Go from $${a}$ to $${b}$ and then to $${c}$:`, `从 $${a}$ 到 $${b}$，再到 $${c}$：`),
                  [`\\vec{${a}${c}} = \\vec{${a}${b}} + \\vec{${b}${c}} = ${u} + ${v}`],
                ],
              ],
              t(
                `Going through $${d}$ instead gives the same diagonal: $\\vec{${a}${d}} + \\vec{${d}${c}} = ${v} + ${u}$.`,
                `改为经过 $${d}$，得到同一条对角线：$\\vec{${a}${d}} + \\vec{${d}${c}} = ${v} + ${u}$。`,
              ),
            ),
            [
              why(same(`$${u} - ${v}$`), `This is $\\vec{${d}${b}}$, the other diagonal.`, `这是另一条对角线 $\\vec{${d}${b}}$。`),
              why(same(`$${v} - ${u}$`), `This is $\\vec{${b}${d}}$, the other diagonal.`, `这是另一条对角线 $\\vec{${b}${d}}$。`),
              why(
                same(`$2${u} + 2${v}$`),
                "This is twice the diagonal; the path uses each side once.",
                "这是对角线的两倍；路径中每条边只走一次。",
              ),
            ],
          );
        }

        if (query === "diff-diag-1") {
          return oneOf(
            rng,
            t(
              `In parallelogram $${a}${b}${c}${d}$, let $\\vec{${a}${b}} = ${u}$ and $\\vec{${a}${d}} = ${v}$. Express the diagonal $\\vec{${b}${d}}$ in terms of $${u}$ and $${v}$.`,
              `在平行四边形 $${a}${b}${c}${d}$ 中，设 $\\vec{${a}${b}} = ${u}$，$\\vec{${a}${d}} = ${v}$。用 $${u}$ 和 $${v}$ 表示对角线 $\\vec{${b}${d}}$。`,
            ),
            t(`$${v} - ${u}$`, `$${v} - ${u}$`),
            [t(`$${u} - ${v}$`, `$${u} - ${v}$`), t(`$${u} + ${v}$`, `$${u} + ${v}$`), t(`$-${u} - ${v}$`, `$-${u} - ${v}$`)],
            walked(
              [
                [
                  ["Go back through the corner", "经过顶点绕行"],
                  t(`Go from $${b}$ back to $${a}$ and then to $${d}$:`, `从 $${b}$ 回到 $${a}$，再到 $${d}$：`),
                  [`\\vec{${b}${d}} = \\vec{${b}${a}} + \\vec{${a}${d}}`],
                ],
                [
                  ["Write it in the given vectors", "用已知向量表示"],
                  t(`$\\vec{${b}${a}}$ is $\\vec{${a}${b}}$ reversed:`, `$\\vec{${b}${a}}$ 是 $\\vec{${a}${b}}$ 的反向：`),
                  [`\\vec{${b}${d}} = -${u} + ${v} = ${v} - ${u}`],
                ],
              ],
              t(
                `Going from $${a}$ to $${b}$ and then along the diagonal reaches $${d}$: $${u} + (${v} - ${u}) = ${v} = \\vec{${a}${d}}$.`,
                `从 $${a}$ 到 $${b}$，再沿这条对角线，就到达 $${d}$：$${u} + (${v} - ${u}) = ${v} = \\vec{${a}${d}}$。`,
              ),
            ),
            [
              why(
                same(`$${u} - ${v}$`),
                `This is $\\vec{${d}${b}}$, the same diagonal in the other direction.`,
                `这是 $\\vec{${d}${b}}$，同一条对角线的反方向。`,
              ),
              why(same(`$${u} + ${v}$`), `This is the other diagonal, $\\vec{${a}${c}}$.`, `这是另一条对角线 $\\vec{${a}${c}}$。`),
              why(
                same(`$-${u} - ${v}$`),
                `This is $\\vec{${c}${a}}$, the other diagonal reversed.`,
                `这是 $\\vec{${c}${a}}$，另一条对角线的反方向。`,
              ),
            ],
          );
        }

        return oneOf(
          rng,
          t(
            `In parallelogram $${a}${b}${c}${d}$, let $\\vec{${a}${b}} = ${u}$ and $\\vec{${a}${d}} = ${v}$. Express the diagonal $\\vec{${d}${b}}$ in terms of $${u}$ and $${v}$.`,
            `在平行四边形 $${a}${b}${c}${d}$ 中，设 $\\vec{${a}${b}} = ${u}$，$\\vec{${a}${d}} = ${v}$。用 $${u}$ 和 $${v}$ 表示对角线 $\\vec{${d}${b}}$。`,
          ),
          t(`$${u} - ${v}$`, `$${u} - ${v}$`),
          [t(`$${v} - ${u}$`, `$${v} - ${u}$`), t(`$${u} + ${v}$`, `$${u} + ${v}$`), t(`$-${u} - ${v}$`, `$-${u} - ${v}$`)],
          walked(
            [
              [
                ["Go back through the corner", "经过顶点绕行"],
                t(`Go from $${d}$ back to $${a}$ and then to $${b}$:`, `从 $${d}$ 回到 $${a}$，再到 $${b}$：`),
                [`\\vec{${d}${b}} = \\vec{${d}${a}} + \\vec{${a}${b}}`],
              ],
              [
                ["Write it in the given vectors", "用已知向量表示"],
                t(`$\\vec{${d}${a}}$ is $\\vec{${a}${d}}$ reversed:`, `$\\vec{${d}${a}}$ 是 $\\vec{${a}${d}}$ 的反向：`),
                [`\\vec{${d}${b}} = -${v} + ${u} = ${u} - ${v}`],
              ],
            ],
            t(
              `Going from $${a}$ to $${d}$ and then along the diagonal reaches $${b}$: $${v} + (${u} - ${v}) = ${u} = \\vec{${a}${b}}$.`,
              `从 $${a}$ 到 $${d}$，再沿这条对角线，就到达 $${b}$：$${v} + (${u} - ${v}) = ${u} = \\vec{${a}${b}}$。`,
            ),
          ),
          [
            why(
              same(`$${v} - ${u}$`),
              `This is $\\vec{${b}${d}}$, the same diagonal in the other direction.`,
              `这是 $\\vec{${b}${d}}$，同一条对角线的反方向。`,
            ),
            why(same(`$${u} + ${v}$`), `This is the other diagonal, $\\vec{${a}${c}}$.`, `这是另一条对角线 $\\vec{${a}${c}}$。`),
            why(
              same(`$-${u} - ${v}$`),
              `This is $\\vec{${c}${a}}$, the other diagonal reversed.`,
              `这是 $\\vec{${c}${a}}$，另一条对角线的反方向。`,
            ),
          ],
        );
      },
    },
  ],
};

// ─── 5.16.3 The Magnitude of a Vector ───────────────────────────────────────

/** theMagnitudeOfAVector covers vector magnitude notation, scaling, and zero vector. */
export const theMagnitudeOfAVector: TopicDef = {
  id: "the-magnitude-of-a-vector",
  title: t("The Magnitude of a Vector", "向量的模长"),
  summary: t(
    "Understand vector magnitude notation, the non-negativity of length, and properties of the zero vector.",
    "理解向量模长的符号表示、非负性以及零向量的性质。",
  ),
  prerequisites: ["introduction-to-vectors"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.1"],
  intro: t(
    `The magnitude of a vector is its length, written $\\|\\mathbf{v}\\|$. If $\\|\\mathbf{v}\\| = 4$, then $3\\mathbf{v}$ is the same arrow three times as long, so $\\|3\\mathbf{v}\\| = 12$; and $-3\\mathbf{v}$ points the other way but is just as long, so $\\|-3\\mathbf{v}\\| = 12$ too.

Check: a length is never negative, and $|-3| \\cdot 4 = 12$.

In this lesson we find the magnitudes of multiples of a vector, work with the zero vector, and find the magnitude of the sum of two perpendicular vectors.`,
    `向量的模就是它的长度，记作 $\\|\\mathbf{v}\\|$。若 $\\|\\mathbf{v}\\| = 4$，那么 $3\\mathbf{v}$ 是同一个箭头拉长到三倍，所以 $\\|3\\mathbf{v}\\| = 12$；$-3\\mathbf{v}$ 方向相反，但同样长，所以 $\\|-3\\mathbf{v}\\| = 12$。

检验：长度不会是负数，而 $|-3| \\cdot 4 = 12$。

这节课我们求向量倍数的模，运用零向量，并求两个垂直向量之和的模。`,
  ),
  knowledgePoints: [
    {
      id: "magnitude-notation-and-scaling",
      title: t("Compute vector magnitude under scalar multiplication", "计算数乘向量的模长"),
      explanation: t(
        "The **magnitude** (or length) of a vector $\\mathbf{v}$ is denoted by $\\|\\mathbf{v}\\|$ or $|\\mathbf{v}|$. It is always a non-negative real number ($\\|\\mathbf{v}\\| \\ge 0$).\n\nFor any real scalar $k$, the magnitude of the scaled vector $k\\mathbf{v}$ satisfies:\n\n$$\\|k\\mathbf{v}\\| = |k|\\,\\|\\mathbf{v}\\|$$\n\nFor $\\|\\mathbf{w}\\| = 7$: $\\|-2\\mathbf{w}\\| = |-2| \\cdot 7 = 14$. Check: $-2\\mathbf{w}$ is $\\mathbf{w}$ doubled and reversed, and reversing does not change a length, so it is as long as $2\\mathbf{w}$, which is $14$.\n\n> **Watch out.** Take the absolute value of the scalar. A magnitude is never negative, so $\\|-2\\mathbf{w}\\|$ is $14$, not $-14$.",
        "向量 $\\mathbf{v}$ 的**模长**（长度）记为 $\\|\\mathbf{v}\\|$ 或 $|\\mathbf{v}|$，始终为非负实数（$\\|\\mathbf{v}\\| \\ge 0$）。\n\n对于任意实数标量 $k$，数乘向量 $k\\mathbf{v}$ 的模长满足：\n\n$$\\|k\\mathbf{v}\\| = |k|\\,\\|\\mathbf{v}\\|$$\n\n对 $\\|\\mathbf{w}\\| = 7$：$\\|-2\\mathbf{w}\\| = |-2| \\cdot 7 = 14$。检验：$-2\\mathbf{w}$ 是把 $\\mathbf{w}$ 加倍并反向，反向不改变长度，所以它和 $2\\mathbf{w}$ 一样长，是 $14$。\n\n> **注意。** 要取数乘因子的绝对值。模不会是负数，所以 $\\|-2\\mathbf{w}\\|$ 是 $14$，不是 $-14$。",
      ),
      generate(rng) {
        const len = rng.pick([3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 17, 20]);
        const k = rng.pick([-8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
        const vec = rng.pick(["\\mathbf{v}", "\\mathbf{u}", "\\vec{a}", "\\vec{w}"]);
        const rightVal = Math.abs(k) * len;

        const wrongVals = [k * len, len * (Math.abs(k) + 1), Math.abs(k) + len].filter((v) => v !== rightVal);

        return numberProblem({
          prompt: t(
            `Given that $\\|${vec}\\| = ${len}$, find the magnitude $\\|${k}${vec}\\|$.`,
            `已知 $\\|${vec}\\| = ${len}$，求模长 $\\|${k}${vec}\\|$。`,
          ),
          answer: rightVal,
          wrong: wrongVals,
          solution: walked(
            [
              [
                ["Take the size of the scalar", "取数乘因子的大小"],
                t(
                  `Multiplying by $${k}$ stretches the vector by $|${k}| = ${Math.abs(k)}$${k < 0 ? " and reverses it; reversing does not change its length" : ""}.`,
                  `乘以 $${k}$ 把向量拉长到 $|${k}| = ${Math.abs(k)}$ 倍${k < 0 ? "并反向；反向不改变长度" : ""}。`,
                ),
              ],
              [
                ["Multiply the length", "乘以长度"],
                t(`Use $\\|k\\mathbf{v}\\| = |k|\\,\\|\\mathbf{v}\\|$:`, `用 $\\|k\\mathbf{v}\\| = |k|\\,\\|\\mathbf{v}\\|$：`),
                [`\\|${k}${vec}\\| = |${k}|\\,\\|${vec}\\| = ${Math.abs(k)} \\times ${len} = ${rightVal}`],
              ],
            ],
            t(
              `$${Math.abs(k)}$ copies of an arrow of length $${len}$, laid end to end in one direction, reach $${rightVal}$, and the result is positive, as a length must be.`,
              `把 $${Math.abs(k)}$ 个长度为 $${len}$ 的箭头沿同一方向首尾相接，总长 $${rightVal}$，结果为正，长度本应如此。`,
            ),
          ),
        });
      },
    },
    {
      id: "zero-vector-properties",
      title: t("Properties of the zero vector", "零向量的性质"),
      explanation: t(
        "The **zero vector**, denoted $\\mathbf{0}$ or $\\vec{0}$, is the unique vector with length zero:\n\n$$\\|\\mathbf{0}\\| = 0$$\n\nIts direction is arbitrary (not pointing in any single direction). For any vector $\\mathbf{v}$ and scalar $k$:\n- $\\mathbf{v} + \\mathbf{0} = \\mathbf{v}$\n- $\\mathbf{v} + (-\\mathbf{v}) = \\mathbf{0}$\n- $0\\mathbf{v} = \\mathbf{0}$\n- $k\\mathbf{0} = \\mathbf{0}$\n\nFor $\\mathbf{a} + (-\\mathbf{a})$: walk along $\\mathbf{a}$ and then back by the same amount, and you end where you started, so the sum is $\\mathbf{0}$. Check: $\\|\\mathbf{0}\\| = 0$, the length of a trip that goes nowhere.\n\n> **Watch out.** $\\mathbf{0}$ is a vector and $0$ is a number. $0\\mathbf{v}$ and $\\mathbf{v} - \\mathbf{v}$ are the zero vector, not the scalar $0$.",
        "**零向量**记为 $\\mathbf{0}$ 或 $\\vec{0}$，是唯一长度为零的向量：\n\n$$\\|\\mathbf{0}\\| = 0$$\n\n它的方向是任意的（不指向任何单一特定方向）。对任意向量 $\\mathbf{v}$ 和标量 $k$：\n- $\\mathbf{v} + \\mathbf{0} = \\mathbf{v}$\n- $\\mathbf{v} + (-\\mathbf{v}) = \\mathbf{0}$\n- $0\\mathbf{v} = \\mathbf{0}$\n- $k\\mathbf{0} = \\mathbf{0}$\n\n对 $\\mathbf{a} + (-\\mathbf{a})$：沿 $\\mathbf{a}$ 走，再按同样的长度走回来，就回到出发点，所以和是 $\\mathbf{0}$。检验：$\\|\\mathbf{0}\\| = 0$，这一趟哪儿也没去。\n\n> **注意。** $\\mathbf{0}$ 是向量，$0$ 是数。$0\\mathbf{v}$ 和 $\\mathbf{v} - \\mathbf{v}$ 都是零向量，不是标量 $0$。",
      ),
      generate(rng) {
        const v = rng.pick([
          "\\mathbf{u}",
          "\\mathbf{v}",
          "\\mathbf{a}",
          "\\mathbf{w}",
          "\\vec{x}",
          "\\mathbf{b}",
          "\\mathbf{c}",
          "\\mathbf{p}",
          "\\mathbf{q}",
          "\\vec{m}",
        ]);
        const kind = rng.pick(["eval-zero", "identity", "inverse-sum", "scalar-zero"]);

        if (kind === "eval-zero") {
          return oneOf(
            rng,
            t(`What is the value of the scalar product $0 \\cdot ${v}$?`, `数乘运算 $0 \\cdot ${v}$ 的结果是什么？`),
            t("$\\mathbf{0}$ (the zero vector)", "$\\mathbf{0}$（零向量）"),
            [t("$0$ (the scalar zero)", "$0$（标量零）"), t(`$${v}$`, `$${v}$`), t("$1$", "$1$")],
            walked(
              [
                [
                  ["Scale the length", "按比例求长度"],
                  t(`Multiplying by $0$ scales the length by $0$:`, `乘以 $0$ 把长度乘以 $0$：`),
                  [`\\|0 \\cdot ${v}\\| = 0 \\cdot \\|${v}\\| = 0`],
                ],
                [
                  ["Name the result", "说出结果"],
                  t(
                    "A scalar times a vector is a vector, so the result is the vector of length $0$, the zero vector $\\mathbf{0}$.",
                    "数乘向量的结果是向量，所以结果是长度为 $0$ 的向量，即零向量 $\\mathbf{0}$。",
                  ),
                ],
              ],
              t(
                `Adding it to $${v}$ changes nothing: $${v} + 0 \\cdot ${v} = (1 + 0)${v} = ${v}$, which is what the zero vector does.`,
                `把它加到 $${v}$ 上没有变化：$${v} + 0 \\cdot ${v} = (1 + 0)${v} = ${v}$，这正是零向量的作用。`,
              ),
            ),
            [
              why(
                t("$0$ (the scalar zero)", ""),
                "A scalar times a vector is a vector; the number $0$ is only its length.",
                "数乘向量的结果是向量；数 $0$ 只是它的长度。",
              ),
              why(
                same(`$${v}$`),
                `$${v}$ is $1 \\cdot ${v}$; multiplying by $0$ shrinks the vector to nothing.`,
                `$${v}$ 是 $1 \\cdot ${v}$；乘以 $0$ 会把向量缩成零。`,
              ),
              why(
                same("$1$"),
                "$1$ is a number, not a vector, and the length of the result is $0$, not $1$.",
                "$1$ 是数，不是向量，而且结果的长度是 $0$，不是 $1$。",
              ),
            ],
          );
        }

        if (kind === "scalar-zero") {
          const k = rng.pick([-15, -12, -9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9, 12, 15]);
          const zeroSym = rng.pick(["\\mathbf{0}", "\\vec{0}"]);
          return oneOf(
            rng,
            t(`Evaluate the scalar multiple $${k}${zeroSym}$.`, `计算数乘运算 $${k}${zeroSym}$ 的值。`),
            t(`$${zeroSym}$`, `$${zeroSym}$`),
            [t(`$${k}$`, `$${k}$`), t("$0$", "$0$"), t(`$${k}\\mathbf{v}$`, `$${k}\\mathbf{v}$`)],
            walked(
              [
                [
                  ["Scale the length", "按比例求长度"],
                  t(`Multiplying by $${k}$ multiplies the length by $|${k}|$:`, `乘以 $${k}$ 把长度乘以 $|${k}|$：`),
                  [`\\|${k}${zeroSym}\\| = |${k}| \\cdot 0 = 0`],
                ],
                [
                  ["Name the result", "说出结果"],
                  t(
                    `The only vector of length $0$ is the zero vector, so $${k}${zeroSym} = ${zeroSym}$.`,
                    `长度为 $0$ 的向量只有零向量，所以 $${k}${zeroSym} = ${zeroSym}$。`,
                  ),
                ],
              ],
              t(
                `For any vector $\\mathbf{v}$, distributing gives $${k}(\\mathbf{v} - \\mathbf{v}) = ${k}\\mathbf{v} - ${paren(k)}\\mathbf{v} = ${zeroSym}$.`,
                `对任意向量 $\\mathbf{v}$，用分配律得 $${k}(\\mathbf{v} - \\mathbf{v}) = ${k}\\mathbf{v} - ${paren(k)}\\mathbf{v} = ${zeroSym}$。`,
              ),
            ),
            [
              why(same(`$${k}$`), `A scalar times a vector is a vector, not the number $${k}$.`, `数乘向量的结果是向量，不是数 $${k}$。`),
              why(same("$0$"), "The result is a vector, the zero vector, not the number $0$.", "结果是向量，即零向量，不是数 $0$。"),
              why(
                same(`$${k}\\mathbf{v}$`),
                `There is no $\\mathbf{v}$ in the expression; $${k}$ multiplies the zero vector.`,
                `表达式中没有 $\\mathbf{v}$；$${k}$ 乘的是零向量。`,
              ),
            ],
          );
        }

        if (kind === "inverse-sum") {
          const isSub = rng.pick([true, false]);
          const expr = isSub ? `${v} - ${v}` : `${v} + (-${v})`;
          return oneOf(
            rng,
            t(`Simplify the vector expression: $${expr}$.`, `化简向量表达式：$${expr}$。`),
            t("$\\mathbf{0}$", "$\\mathbf{0}$"),
            [t("$0$", "$0$"), t(`$2${v}$`, `$2${v}$`), t(`$-${v}$`, `$-${v}$`)],
            walked(
              [
                [
                  ["Write it as a sum", "写成加法"],
                  t(`Subtracting $${v}$ adds its opposite:`, `减去 $${v}$ 就是加上它的相反向量：`),
                  [`${expr} = ${v} + (-${v})`],
                ],
                [
                  ["Add head to tail", "首尾相接相加"],
                  t(
                    `$-${v}$ is as long as $${v}$ and points back, so the trip ends where it started: the result is $\\mathbf{0}$.`,
                    `$-${v}$ 与 $${v}$ 一样长、方向相反，所以这一趟回到出发点：结果是 $\\mathbf{0}$。`,
                  ),
                ],
              ],
              t(
                `In coefficients, $(1 - 1)${v} = 0${v} = \\mathbf{0}$, and its length is $\\|\\mathbf{0}\\| = 0$.`,
                `用系数算：$(1 - 1)${v} = 0${v} = \\mathbf{0}$，它的长度是 $\\|\\mathbf{0}\\| = 0$。`,
              ),
            ),
            [
              why(same("$0$"), "The result is a vector, the zero vector, not the number $0$.", "结果是向量，即零向量，不是数 $0$。"),
              why(
                same(`$2${v}$`),
                `This adds $${v}$ to itself; here the second term is $-${v}$.`,
                `这是 $${v}$ 加自身；这里第二项是 $-${v}$。`,
              ),
              why(same(`$-${v}$`), `This drops the first $${v}$.`, `这漏掉了第一个 $${v}$。`),
            ],
          );
        }

        return oneOf(
          rng,
          t(
            `Which of the following statements about the zero vector $\\mathbf{0}$ is FALSE?`,
            `下列关于零向量 $\\mathbf{0}$ 的陈述中，哪一个是错误的？`,
          ),
          t("The zero vector has a unique, fixed direction pointing along the positive x-axis.", "零向量具有唯一确定的方向，指向正 x 轴。"),
          [
            t("$\\|\\mathbf{0}\\| = 0$", "$\\|\\mathbf{0}\\| = 0$"),
            t(
              `For every vector $\\mathbf{v}$, $\\mathbf{v} + \\mathbf{0} = \\mathbf{v}$.`,
              `对任意向量 $\\mathbf{v}$，都有 $\\mathbf{v} + \\mathbf{0} = \\mathbf{v}$。`,
            ),
            t("For any real scalar $k$, $k\\mathbf{0} = \\mathbf{0}$.", "对任意实数标量 $k$，都有 $k\\mathbf{0} = \\mathbf{0}$。"),
          ],
          walked(
            [
              [
                ["Test the properties", "检验各条性质"],
                t(
                  "$\\|\\mathbf{0}\\| = 0$, $\\mathbf{v} + \\mathbf{0} = \\mathbf{v}$ and $k\\mathbf{0} = \\mathbf{0}$ hold for every vector $\\mathbf{v}$ and scalar $k$.",
                  "$\\|\\mathbf{0}\\| = 0$、$\\mathbf{v} + \\mathbf{0} = \\mathbf{v}$ 和 $k\\mathbf{0} = \\mathbf{0}$ 对任意向量 $\\mathbf{v}$ 和数 $k$ 都成立。",
                ),
              ],
              [
                ["Find the false one", "找出错误的一条"],
                t(
                  "The zero vector has no length to point with, so it has no particular direction; the statement that it points along the positive $x$-axis is false.",
                  "零向量没有长度，无从指向，所以没有特定方向；说它指向正 $x$ 轴是错误的。",
                ),
              ],
            ],
            t(
              "If $\\mathbf{0}$ pointed along the positive $x$-axis, then $-\\mathbf{0}$ would point along the negative $x$-axis. But $-\\mathbf{0} = \\mathbf{0}$, so it cannot have that fixed direction.",
              "如果 $\\mathbf{0}$ 指向正 $x$ 轴，那么 $-\\mathbf{0}$ 就指向负 $x$ 轴。但 $-\\mathbf{0} = \\mathbf{0}$，所以它不可能有这个固定方向。",
            ),
          ),
          [
            why(same("$\\|\\mathbf{0}\\| = 0$"), "This is true: the zero vector has length $0$.", "这是对的：零向量的长度是 $0$。"),
            why(
              t(`For every vector $\\mathbf{v}$, $\\mathbf{v} + \\mathbf{0} = \\mathbf{v}$.`, ""),
              "This is true: adding the zero vector changes nothing.",
              "这是对的：加上零向量没有任何变化。",
            ),
            why(
              t("For any real scalar $k$, $k\\mathbf{0} = \\mathbf{0}$.", ""),
              "This is true: every multiple of the zero vector is the zero vector.",
              "这是对的：零向量的任何倍数都是零向量。",
            ),
          ],
        );
      },
    },
  ],
};

// ─── 5.16.4 Problem Solving Using Vector Diagrams ───────────────────────────

/** vectorLoopFigure shows quadrilateral ABCD with arrows AB, BC, CD and DA running once around it. */
const vectorLoopFigure: Figure = (() => {
  const [a, b, c, d]: Point[] = [
    [0, 0],
    [5, -0.5],
    [6, 3],
    [1.5, 3.5],
  ];
  return {
    svg: sketch([
      ...vectorArrow(a!, b!),
      ...vectorArrow(b!, c!),
      ...vectorArrow(c!, d!),
      ...vectorArrow(d!, a!, { accent: true }),
      { kind: "label", at: a!, text: "A", dir: "sw" },
      { kind: "label", at: b!, text: "B", dir: "se" },
      { kind: "label", at: c!, text: "C", dir: "ne" },
      { kind: "label", at: d!, text: "D", dir: "nw" },
    ]),
    alt: t(
      "Quadrilateral ABCD with arrows from A to B, B to C, C to D and D back to A, each starting where the last ends. The loop returns to its start, so the four vectors add up to the zero vector.",
      "四边形 ABCD，箭头依次从 A 到 B、B 到 C、C 到 D，再从 D 回到 A，每条都从上一条的终点出发。回路回到起点，所以四个向量之和为零向量。",
    ),
  };
})();

/** trapezoidVectorsFigure shows trapezoid ABCD with a = AB, b = AD, DC = k·a parallel to AB and the diagonal AC = b + k·a. */
const trapezoidVectorsFigure: Figure = (() => {
  const [a, b, c, d]: Point[] = [
    [0, 0],
    [3, 0],
    [7, 3],
    [1, 3],
  ];
  return {
    svg: sketch([
      { kind: "segment", a: b!, b: c! },
      ...vectorArrow(a!, b!),
      ...vectorArrow(a!, d!),
      ...vectorArrow(d!, c!),
      ...vectorArrow(a!, c!, { accent: true }),
      { kind: "side", a: a!, b: b!, text: "a" },
      { kind: "side", a: d!, b: a!, text: "b" },
      { kind: "side", a: c!, b: d!, text: "ka" },
      { kind: "label", at: [2.8, 1.2], text: "b + ka", dir: "nw" },
      { kind: "label", at: a!, text: "A", dir: "sw" },
      { kind: "label", at: b!, text: "B", dir: "se" },
      { kind: "label", at: c!, text: "C", dir: "ne" },
      { kind: "label", at: d!, text: "D", dir: "nw" },
    ]),
    alt: t(
      "Trapezoid ABCD with base AB the vector a, side AD the vector b, and the longer parallel base DC the vector ka. The highlighted diagonal from A to C goes along AD and then DC, so it is b + ka.",
      "梯形 ABCD：底 AB 是向量 a，腰 AD 是向量 b，较长的平行底边 DC 是向量 ka。高亮的对角线从 A 到 C，先沿 AD 再沿 DC，所以它等于 b + ka。",
    ),
  };
})();

/** problemSolvingUsingVectorDiagrams covers closed loops and geometric vector decomposition. */
export const problemSolvingUsingVectorDiagrams: TopicDef = {
  id: "problem-solving-using-vector-diagrams",
  title: t("Problem Solving Using Vector Diagrams", "利用向量图解决几何问题"),
  summary: t(
    "Express unknown vectors in polygons and geometric configurations using closed vector loops.",
    "利用多边形中的闭合向量回路，用已知向量表示未知向量。",
  ),
  prerequisites: ["the-triangle-law-for-the-addition-of-two-vectors"],
  encompasses: [{ topic: "the-triangle-law-for-the-addition-of-two-vectors", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.B.4"],
  intro: t(
    `Walk around triangle $PQR$: $\\vec{PQ} + \\vec{QR} + \\vec{RP}$ ends back at $P$, so the sum is $\\mathbf{0}$. Such a loop lets one side be written through the others, $\\vec{RP} = -(\\vec{PQ} + \\vec{QR})$. If $\\vec{PQ} = \\langle 2, 0 \\rangle$ and $\\vec{QR} = \\langle 1, 3 \\rangle$, then $\\vec{RP} = \\langle -3, -3 \\rangle$.

Check: the three sides add to $\\langle 2 + 1 - 3, 0 + 3 - 3 \\rangle = \\langle 0, 0 \\rangle$.

In this lesson we use loops and paths to express sides and diagonals of polygons, including trapezoids and points that divide a side.`,
    `绕三角形 $PQR$ 走一圈：$\\vec{PQ} + \\vec{QR} + \\vec{RP}$ 回到 $P$，所以和是 $\\mathbf{0}$。这样的回路可以用其他边表示一条边，$\\vec{RP} = -(\\vec{PQ} + \\vec{QR})$。若 $\\vec{PQ} = \\langle 2, 0 \\rangle$，$\\vec{QR} = \\langle 1, 3 \\rangle$，则 $\\vec{RP} = \\langle -3, -3 \\rangle$。

检验：三条边相加得 $\\langle 2 + 1 - 3, 0 + 3 - 3 \\rangle = \\langle 0, 0 \\rangle$。

这节课我们用回路和路径表示多边形的边和对角线，包括梯形以及分一条边的点。`,
  ),
  knowledgePoints: [
    {
      id: "vector-loops-in-polygons",
      title: t("Use closed vector loops in polygons", "利用多边形中的闭合回路求向量"),
      explanation: t(
        "For any closed polygon with vertices $A_1, A_2, \\dots, A_n$ in order, the sum of directed vectors around the closed perimeter is the zero vector:\n\n$$\\vec{A_1 A_2} + \\vec{A_2 A_3} + \\dots + \\vec{A_n A_1} = \\mathbf{0}$$\n\nIn $\\triangle ABC$, $\\vec{AB} + \\vec{BC} + \\vec{CA} = \\mathbf{0}$, which implies $\\vec{CA} = -(\\vec{AB} + \\vec{BC})$.\n\nFor quadrilateral $KLMN$ with $\\vec{KL} = \\mathbf{a}$, $\\vec{LM} = \\mathbf{b}$ and $\\vec{MN} = \\mathbf{c}$: going round, $\\vec{KN} = \\mathbf{a} + \\mathbf{b} + \\mathbf{c}$ and $\\vec{NK} = -\\mathbf{a} - \\mathbf{b} - \\mathbf{c}$. Check: $\\vec{KL} + \\vec{LM} + \\vec{MN} + \\vec{NK} = \\mathbf{0}$.\n\n> **Watch out.** Follow each arrow the way it points. A vector walked backwards changes sign, so in triangle $ABC$ with $\\vec{AB} = \\mathbf{a}$ and $\\vec{BC} = \\mathbf{b}$ the side $\\vec{CA}$ is $-(\\mathbf{a} + \\mathbf{b})$, not $\\mathbf{a} + \\mathbf{b}$.",
        "对于任意顶点依次为 $A_1, A_2, \\dots, A_n$ 的闭合多边形，沿周长依次相连的向量之和为零向量：\n\n$$\\vec{A_1 A_2} + \\vec{A_2 A_3} + \\dots + \\vec{A_n A_1} = \\mathbf{0}$$\n\n在 $\\triangle ABC$ 中，$\\vec{AB} + \\vec{BC} + \\vec{CA} = \\mathbf{0}$，从而 $\\vec{CA} = -(\\vec{AB} + \\vec{BC})$。\n\n对四边形 $KLMN$，$\\vec{KL} = \\mathbf{a}$，$\\vec{LM} = \\mathbf{b}$，$\\vec{MN} = \\mathbf{c}$：沿边走，$\\vec{KN} = \\mathbf{a} + \\mathbf{b} + \\mathbf{c}$，$\\vec{NK} = -\\mathbf{a} - \\mathbf{b} - \\mathbf{c}$。检验：$\\vec{KL} + \\vec{LM} + \\vec{MN} + \\vec{NK} = \\mathbf{0}$。\n\n> **注意。** 要顺着箭头的方向走。逆着箭头走，向量要变号，所以在三角形 $ABC$ 中，若 $\\vec{AB} = \\mathbf{a}$，$\\vec{BC} = \\mathbf{b}$，边 $\\vec{CA}$ 是 $-(\\mathbf{a} + \\mathbf{b})$，不是 $\\mathbf{a} + \\mathbf{b}$。",
      ),
      figure: vectorLoopFigure,
      generate(rng) {
        const polyShape = rng.pick([
          { pts: ["A", "B", "C"], n: 3 },
          { pts: ["P", "Q", "R"], n: 3 },
          { pts: ["K", "L", "M"], n: 3 },
          { pts: ["D", "E", "F"], n: 3 },
          { pts: ["A", "B", "C", "D"], n: 4 },
          { pts: ["P", "Q", "R", "S"], n: 4 },
          { pts: ["K", "L", "M", "N"], n: 4 },
          { pts: ["E", "F", "G", "H"], n: 4 },
        ]);

        const a = rng.pick(["\\mathbf{a}", "\\mathbf{u}"]);
        const b = rng.pick(["\\mathbf{b}", "\\mathbf{v}"]);
        const c = rng.pick(["\\mathbf{c}", "\\mathbf{w}"]);

        if (polyShape.n === 3) {
          const [p1, p2, p3] = polyShape.pts;
          return oneOf(
            rng,
            t(
              `In $\\triangle ${p1}${p2}${p3}$, let $\\vec{${p1}${p2}} = ${a}$ and $\\vec{${p2}${p3}} = ${b}$. Express $\\vec{${p3}${p1}}$ in terms of $${a}$ and $${b}$.`,
              `在 $\\triangle ${p1}${p2}${p3}$ 中，设 $\\vec{${p1}${p2}} = ${a}$，$\\vec{${p2}${p3}} = ${b}$。用 $${a}$ 和 $${b}$ 表示 $\\vec{${p3}${p1}}$。`,
            ),
            t(`$-${a} - ${b}$`, `$-${a} - ${b}$`),
            [t(`$${a} + ${b}$`, `$${a} + ${b}$`), t(`$${a} - ${b}$`, `$${a} - ${b}$`), t(`$${b} - ${a}$`, `$${b} - ${a}$`)],
            walked(
              [
                [
                  ["Close the loop", "构成回路"],
                  t(`Walking once around the triangle returns to $${p1}$:`, `绕三角形走一圈回到 $${p1}$：`),
                  [`\\vec{${p1}${p2}} + \\vec{${p2}${p3}} + \\vec{${p3}${p1}} = \\mathbf{0}`],
                ],
                [
                  ["Solve for the third side", "解出第三条边"],
                  t(`Move the two known sides across:`, `把两条已知边移到另一边：`),
                  [`\\vec{${p3}${p1}} = -(${a} + ${b}) = -${a} - ${b}`],
                ],
              ],
              t(
                `The three sides add to $${a} + ${b} + (-${a} - ${b}) = \\mathbf{0}$, so the walk ends back at $${p1}$.`,
                `三条边相加得 $${a} + ${b} + (-${a} - ${b}) = \\mathbf{0}$，所以回到 $${p1}$。`,
              ),
            ),
            [
              why(
                same(`$${a} + ${b}$`),
                `This is $\\vec{${p1}${p3}}$, the same side walked the other way.`,
                `这是 $\\vec{${p1}${p3}}$，同一条边的反方向。`,
              ),
              why(
                same(`$${a} - ${b}$`),
                `Only the sign of $${b}$ is flipped; going from $${p3}$ back to $${p1}$ reverses both.`,
                `只改变了 $${b}$ 的符号；从 $${p3}$ 回到 $${p1}$ 要把两个都反向。`,
              ),
              why(
                same(`$${b} - ${a}$`),
                `Only the sign of $${a}$ is flipped; going from $${p3}$ back to $${p1}$ reverses both.`,
                `只改变了 $${a}$ 的符号；从 $${p3}$ 回到 $${p1}$ 要把两个都反向。`,
              ),
            ],
          );
        }

        const [p1, p2, p3, p4] = polyShape.pts;
        return oneOf(
          rng,
          t(
            `In quadrilateral $${p1}${p2}${p3}${p4}$, let $\\vec{${p1}${p2}} = ${a}$, $\\vec{${p2}${p3}} = ${b}$, and $\\vec{${p3}${p4}} = ${c}$. Express $\\vec{${p1}${p4}}$ in terms of $${a}$, $${b}$, and $${c}$.`,
            `在四边形 $${p1}${p2}${p3}${p4}$ 中，设 $\\vec{${p1}${p2}} = ${a}$，$\\vec{${p2}${p3}} = ${b}$，$\\vec{${p3}${p4}} = ${c}$。用 $${a}$、$${b}$ 和 $${c}$ 表示 $\\vec{${p1}${p4}}$。`,
          ),
          t(`$${a} + ${b} + ${c}$`, `$${a} + ${b} + ${c}$`),
          [
            t(`$${a} + ${b} - ${c}$`, `$${a} + ${b} - ${c}$`),
            t(`$-${a} - ${b} - ${c}$`, `$-${a} - ${b} - ${c}$`),
            t(`$${a} - ${b} + ${c}$`, `$${a} - ${b} + ${c}$`),
          ],
          walked(
            [
              [
                ["Walk along the sides", "沿边走"],
                t(
                  `Go $${p1} \\to ${p2} \\to ${p3} \\to ${p4}$; each arrow starts where the last one ends and is walked the way it points.`,
                  `沿 $${p1} \\to ${p2} \\to ${p3} \\to ${p4}$ 走；每个箭头都从上一个的终点出发，顺着箭头方向走。`,
                ),
              ],
              [
                ["Add the vectors", "把向量相加"],
                t(`The trip from $${p1}$ to $${p4}$ is the sum:`, `从 $${p1}$ 到 $${p4}$ 的一趟就是和：`),
                [`\\vec{${p1}${p4}} = \\vec{${p1}${p2}} + \\vec{${p2}${p3}} + \\vec{${p3}${p4}} = ${a} + ${b} + ${c}`],
              ],
            ],
            t(
              `Closing the loop with $\\vec{${p4}${p1}} = -\\vec{${p1}${p4}}$ gives $(${a} + ${b} + ${c}) - (${a} + ${b} + ${c}) = \\mathbf{0}$.`,
              `用 $\\vec{${p4}${p1}} = -\\vec{${p1}${p4}}$ 闭合回路：$(${a} + ${b} + ${c}) - (${a} + ${b} + ${c}) = \\mathbf{0}$。`,
            ),
          ),
          [
            why(
              same(`$${a} + ${b} - ${c}$`),
              `$${c}$ is walked from $${p3}$ to $${p4}$, the way it points, so it is added.`,
              `$${c}$ 从 $${p3}$ 走到 $${p4}$，顺着它的方向，所以要加上。`,
            ),
            why(
              same(`$-${a} - ${b} - ${c}$`),
              `This is $\\vec{${p4}${p1}}$, the same side walked the other way.`,
              `这是 $\\vec{${p4}${p1}}$，同一条边的反方向。`,
            ),
            why(
              same(`$${a} - ${b} + ${c}$`),
              `$${b}$ is walked from $${p2}$ to $${p3}$, the way it points, so it is added.`,
              `$${b}$ 从 $${p2}$ 走到 $${p3}$，顺着它的方向，所以要加上。`,
            ),
          ],
        );
      },
    },
    {
      id: "express-vector-in-polygon",
      title: t("Express diagonals and segments in geometric figures", "在几何图形中表示对角线与线段向量"),
      explanation: t(
        "In a trapezoid $ABCD$ where base $DC$ is parallel to base $AB$ with $\\vec{DC} = k\\vec{AB}$, side and diagonal vectors can be decomposed using the boundary vectors $\\mathbf{a} = \\vec{AB}$ and $\\mathbf{b} = \\vec{AD}$:\n\n$$\\vec{AC} = \\vec{AD} + \\vec{DC} = \\mathbf{b} + k\\mathbf{a}$$\n\nFor $\\vec{DC} = 3\\vec{AB}$ with $\\vec{AB} = \\mathbf{a}$ and $\\vec{AD} = \\mathbf{b}$: $\\vec{AC} = \\mathbf{b} + 3\\mathbf{a}$ and $\\vec{BD} = \\mathbf{b} - \\mathbf{a}$. Check: going $A \\to B \\to D$ gives $\\mathbf{a} + (\\mathbf{b} - \\mathbf{a}) = \\mathbf{b}$, which is $\\vec{AD}$.\n\n> **Watch out.** The factor $k$ belongs to the parallel side $DC$, which runs along $\\mathbf{a}$: $\\vec{AC}$ is $\\mathbf{b} + k\\mathbf{a}$, not $\\mathbf{a} + k\\mathbf{b}$.",
        "在梯形 $ABCD$ 中，底边 $DC$ 平行于底边 $AB$ 且 $\\vec{DC} = k\\vec{AB}$。对角线向量可分解为基底向量 $\\mathbf{a} = \\vec{AB}$ 和 $\\mathbf{b} = \\vec{AD}$：\n\n$$\\vec{AC} = \\vec{AD} + \\vec{DC} = \\mathbf{b} + k\\mathbf{a}$$\n\n对 $\\vec{DC} = 3\\vec{AB}$，$\\vec{AB} = \\mathbf{a}$，$\\vec{AD} = \\mathbf{b}$：$\\vec{AC} = \\mathbf{b} + 3\\mathbf{a}$，$\\vec{BD} = \\mathbf{b} - \\mathbf{a}$。检验：沿 $A \\to B \\to D$ 得 $\\mathbf{a} + (\\mathbf{b} - \\mathbf{a}) = \\mathbf{b}$，正是 $\\vec{AD}$。\n\n> **注意。** 因子 $k$ 属于平行边 $DC$，它沿 $\\mathbf{a}$ 的方向：$\\vec{AC}$ 是 $\\mathbf{b} + k\\mathbf{a}$，不是 $\\mathbf{a} + k\\mathbf{b}$。",
      ),
      figure: trapezoidVectorsFigure,
      generate(rng) {
        const polyNames = [
          ["A", "B", "C", "D"],
          ["P", "Q", "R", "S"],
          ["K", "L", "M", "N"],
          ["W", "X", "Y", "Z"],
        ];
        const [p1, p2, p3, p4] = rng.pick(polyNames)!;
        const k = rng.pick([2, 3, 4, 5, 6]);
        const a = rng.pick(["\\mathbf{a}", "\\mathbf{u}", "\\mathbf{x}"]);
        const b = rng.pick(["\\mathbf{b}", "\\mathbf{v}", "\\mathbf{y}"]);
        const kStr = `${k}`;

        const query = rng.pick(["AC", "CA", "BD", "DB"]);
        if (query === "AC") {
          return oneOf(
            rng,
            t(
              `In trapezoid $${p1}${p2}${p3}${p4}$, side $${p4}${p3}$ is parallel to side $${p1}${p2}$ with $\\vec{${p4}${p3}} = ${kStr}\\vec{${p1}${p2}}$. Let $\\vec{${p1}${p2}} = ${a}$ and $\\vec{${p1}${p4}} = ${b}$. Express the diagonal $\\vec{${p1}${p3}}$ in terms of $${a}$ and $${b}$.`,
              `在梯形 $${p1}${p2}${p3}${p4}$ 中，底边 $${p4}${p3}$ 平行于底边 $${p1}${p2}$ 且 $\\vec{${p4}${p3}} = ${kStr}\\vec{${p1}${p2}}$。设 $\\vec{${p1}${p2}} = ${a}$，$\\vec{${p1}${p4}} = ${b}$。用 $${a}$ 和 $${b}$ 表示对角线 $\\vec{${p1}${p3}}$。`,
            ),
            t(`$${kStr}${a} + ${b}$`, `$${kStr}${a} + ${b}$`),
            [
              t(`$${a} + ${kStr}${b}$`, `$${a} + ${kStr}${b}$`),
              t(`$${kStr}${a} - ${b}$`, `$${kStr}${a} - ${b}$`),
              t(`$${b} - ${kStr}${a}$`, `$${b} - ${kStr}${a}$`),
            ],
            walked(
              [
                [
                  ["Choose a path", "选一条路径"],
                  t(
                    `Go from $${p1}$ to $${p4}$ and then along the parallel side to $${p3}$:`,
                    `从 $${p1}$ 到 $${p4}$，再沿平行边到 $${p3}$：`,
                  ),
                  [`\\vec{${p1}${p3}} = \\vec{${p1}${p4}} + \\vec{${p4}${p3}}`],
                ],
                [
                  ["Substitute", "代入"],
                  t(
                    `The parallel side is $${kStr}$ times $\\vec{${p1}${p2}} = ${a}$:`,
                    `平行边是 $\\vec{${p1}${p2}} = ${a}$ 的 $${kStr}$ 倍：`,
                  ),
                  [`\\vec{${p1}${p3}} = ${b} + ${kStr}${a} = ${kStr}${a} + ${b}`],
                ],
              ],
              t(
                `Through $${p2}$ instead: $\\vec{${p2}${p3}} = \\vec{${p2}${p1}} + \\vec{${p1}${p3}} = ${poly([k - 1, a], [1, b])}$, and $\\vec{${p1}${p2}} + \\vec{${p2}${p3}} = ${a} + ${poly([k - 1, a], [1, b])} = ${kStr}${a} + ${b}$ again.`,
                `改为经过 $${p2}$：$\\vec{${p2}${p3}} = \\vec{${p2}${p1}} + \\vec{${p1}${p3}} = ${poly([k - 1, a], [1, b])}$，而 $\\vec{${p1}${p2}} + \\vec{${p2}${p3}} = ${a} + ${poly([k - 1, a], [1, b])} = ${kStr}${a} + ${b}$，结果相同。`,
              ),
            ),
            [
              why(
                same(`$${a} + ${kStr}${b}$`),
                `The factor $${kStr}$ belongs to the parallel side $\\vec{${p4}${p3}}$, which runs along $${a}$, not $${b}$.`,
                `因子 $${kStr}$ 属于平行边 $\\vec{${p4}${p3}}$，它沿 $${a}$ 的方向，不是 $${b}$。`,
              ),
              why(
                same(`$${kStr}${a} - ${b}$`),
                `The path from $${p1}$ to $${p4}$ follows $${b}$ the way it points, so $${b}$ is added.`,
                `从 $${p1}$ 到 $${p4}$ 顺着 $${b}$ 的方向走，所以 $${b}$ 要加上。`,
              ),
              why(
                same(`$${b} - ${kStr}${a}$`),
                `The path from $${p4}$ to $${p3}$ follows $${a}$ the way it points, so $${kStr}${a}$ is added.`,
                `从 $${p4}$ 到 $${p3}$ 顺着 $${a}$ 的方向走，所以 $${kStr}${a}$ 要加上。`,
              ),
            ],
          );
        }

        if (query === "CA") {
          return oneOf(
            rng,
            t(
              `In trapezoid $${p1}${p2}${p3}${p4}$, side $${p4}${p3}$ is parallel to side $${p1}${p2}$ with $\\vec{${p4}${p3}} = ${kStr}\\vec{${p1}${p2}}$. Let $\\vec{${p1}${p2}} = ${a}$ and $\\vec{${p1}${p4}} = ${b}$. Express $\\vec{${p3}${p1}}$ in terms of $${a}$ and $${b}$.`,
              `在梯形 $${p1}${p2}${p3}${p4}$ 中，底边 $${p4}${p3}$ 平行于底边 $${p1}${p2}$ 且 $\\vec{${p4}${p3}} = ${kStr}\\vec{${p1}${p2}}$。设 $\\vec{${p1}${p2}} = ${a}$，$\\vec{${p1}${p4}} = ${b}$。用 $${a}$ 和 $${b}$ 表示 $\\vec{${p3}${p1}}$。`,
            ),
            t(`$-${kStr}${a} - ${b}$`, `$-${kStr}${a} - ${b}$`),
            [
              t(`$${kStr}${a} + ${b}$`, `$${kStr}${a} + ${b}$`),
              t(`$-${a} - ${kStr}${b}$`, `$-${a} - ${kStr}${b}$`),
              t(`$${kStr}${a} - ${b}$`, `$${kStr}${a} - ${b}$`),
            ],
            walked(
              [
                [
                  ["Find the diagonal from the start", "先求从起点出发的对角线"],
                  t(
                    `Go from $${p1}$ to $${p4}$ and then along the parallel side to $${p3}$:`,
                    `从 $${p1}$ 到 $${p4}$，再沿平行边到 $${p3}$：`,
                  ),
                  [`\\vec{${p1}${p3}} = \\vec{${p1}${p4}} + \\vec{${p4}${p3}} = ${b} + ${kStr}${a}`],
                ],
                [
                  ["Reverse it", "反向"],
                  t(
                    `$\\vec{${p3}${p1}}$ is the same diagonal walked backwards, so both signs change:`,
                    `$\\vec{${p3}${p1}}$ 是同一条对角线反着走，所以两个符号都要变：`,
                  ),
                  [`\\vec{${p3}${p1}} = -\\vec{${p1}${p3}} = -${kStr}${a} - ${b}`],
                ],
              ],
              t(
                `There and back cancels: $(${kStr}${a} + ${b}) + (-${kStr}${a} - ${b}) = \\mathbf{0}$.`,
                `去了又回来，互相抵消：$(${kStr}${a} + ${b}) + (-${kStr}${a} - ${b}) = \\mathbf{0}$。`,
              ),
            ),
            [
              why(
                same(`$${kStr}${a} + ${b}$`),
                `This is $\\vec{${p1}${p3}}$, the diagonal in the other direction.`,
                `这是 $\\vec{${p1}${p3}}$，对角线的反方向。`,
              ),
              why(
                same(`$-${a} - ${kStr}${b}$`),
                `The factor $${kStr}$ belongs to the parallel side, which runs along $${a}$, not $${b}$.`,
                `因子 $${kStr}$ 属于平行边，它沿 $${a}$ 的方向，不是 $${b}$。`,
              ),
              why(
                same(`$${kStr}${a} - ${b}$`),
                "Reversing the diagonal changes the sign of both terms.",
                "对角线反向时，两项的符号都要变。",
              ),
            ],
          );
        }

        return oneOf(
          rng,
          t(
            `In trapezoid $${p1}${p2}${p3}${p4}$, side $${p4}${p3}$ is parallel to side $${p1}${p2}$ with $\\vec{${p4}${p3}} = ${kStr}\\vec{${p1}${p2}}$. Let $\\vec{${p1}${p2}} = ${a}$ and $\\vec{${p1}${p4}} = ${b}$. Express $\\vec{${p2}${p4}}$ in terms of $${a}$ and $${b}$.`,
            `在梯形 $${p1}${p2}${p3}${p4}$ 中，底边 $${p4}${p3}$ 平行于底边 $${p1}${p2}$ 且 $\\vec{${p4}${p3}} = ${kStr}\\vec{${p1}${p2}}$。设 $\\vec{${p1}${p2}} = ${a}$，$\\vec{${p1}${p4}} = ${b}$。用 $${a}$ 和 $${b}$ 表示 $\\vec{${p2}${p4}}$。`,
          ),
          t(`$${b} - ${a}$`, `$${b} - ${a}$`),
          [t(`$${a} - ${b}$`, `$${a} - ${b}$`), t(`$${b} + ${a}$`, `$${b} + ${a}$`), t(`$${kStr}${b} - ${a}$`, `$${kStr}${b} - ${a}$`)],
          walked(
            [
              [
                ["Go back through the corner", "经过顶点绕行"],
                t(`Go from $${p2}$ back to $${p1}$ and then to $${p4}$:`, `从 $${p2}$ 回到 $${p1}$，再到 $${p4}$：`),
                [`\\vec{${p2}${p4}} = \\vec{${p2}${p1}} + \\vec{${p1}${p4}}`],
              ],
              [
                ["Substitute", "代入"],
                t(`$\\vec{${p2}${p1}}$ is $${a}$ walked backwards:`, `$\\vec{${p2}${p1}}$ 是逆着 $${a}$ 走：`),
                [`\\vec{${p2}${p4}} = -${a} + ${b} = ${b} - ${a}`],
              ],
            ],
            t(
              `Going from $${p1}$ to $${p2}$ and then along this vector reaches $${p4}$: $${a} + (${b} - ${a}) = ${b} = \\vec{${p1}${p4}}$.`,
              `从 $${p1}$ 到 $${p2}$，再沿这个向量走，到达 $${p4}$：$${a} + (${b} - ${a}) = ${b} = \\vec{${p1}${p4}}$。`,
            ),
          ),
          [
            why(
              same(`$${a} - ${b}$`),
              `This is $\\vec{${p4}${p2}}$, the same segment in the other direction.`,
              `这是 $\\vec{${p4}${p2}}$，同一条线段的反方向。`,
            ),
            why(
              same(`$${b} + ${a}$`),
              `From $${p2}$ the path walks back along $${a}$ to $${p1}$, so $${a}$ is subtracted.`,
              `从 $${p2}$ 出发要逆着 $${a}$ 回到 $${p1}$，所以要减去 $${a}$。`,
            ),
            why(
              same(`$${kStr}${b} - ${a}$`),
              `The factor $${kStr}$ belongs to the side $\\vec{${p4}${p3}}$; this path does not use it.`,
              `因子 $${kStr}$ 属于边 $\\vec{${p4}${p3}}$；这条路径用不到它。`,
            ),
          ],
        );
      },
    },
  ],
};

// ─── 5.16.5 Parallel Vectors ────────────────────────────────────────────────

/** parallelVectors covers collinearity, scalar multiples, and direction. */
export const parallelVectors: TopicDef = {
  id: "parallel-vectors",
  title: t("Parallel Vectors", "平行向量与共线向量"),
  summary: t(
    "Determine whether two vectors are parallel (collinear) and understand same versus opposite directions using scalar multiples.",
    "根据数乘倍数判断两个向量是否平行（共线），并区分同向与反向。",
  ),
  prerequisites: ["introduction-to-vectors"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.VM.B.5"],
  intro: t(
    `Two vectors are parallel when one is a multiple of the other. For $\\mathbf{u} = \\langle 2, -1 \\rangle$ and $\\mathbf{v} = \\langle -6, 3 \\rangle$, $\\mathbf{v} = -3\\mathbf{u}$: the vectors are parallel, the minus sign makes them point in opposite directions, and $\\mathbf{v}$ is $3$ times as long.

Check: $-3 \\cdot 2 = -6$ and $-3 \\cdot (-1) = 3$, so the same multiple works for both components.

In this lesson we use multiples to decide when vectors are parallel, read direction and length from the multiple, and find an unknown that appears in both vectors of a parallel pair.`,
    `一个向量是另一个向量的倍数时，两者平行。对 $\\mathbf{u} = \\langle 2, -1 \\rangle$ 和 $\\mathbf{v} = \\langle -6, 3 \\rangle$，$\\mathbf{v} = -3\\mathbf{u}$：两个向量平行，负号使它们方向相反，$\\mathbf{v}$ 的长度是 $\\mathbf{u}$ 的 $3$ 倍。

检验：$-3 \\cdot 2 = -6$，$-3 \\cdot (-1) = 3$，同一个倍数对两个分量都成立。

这节课我们用倍数判断向量是否平行，由倍数读出方向和长度，并求一对平行向量中都含有的未知数。`,
  ),
  knowledgePoints: [
    {
      id: "collinearity-condition",
      figure: precalculusDrawings4["parallel-vectors#collinearity-condition"],
      title: t("Collinearity condition for vectors", "向量平行的共线条件"),
      explanation: t(
        "Two non-zero vectors $\\mathbf{u}$ and $\\mathbf{v}$ are **parallel** (or collinear), written $\\mathbf{u} \\parallel \\mathbf{v}$, if and only if there exists a non-zero scalar $k$ such that:\n\n$$\\mathbf{u} = k\\mathbf{v}$$\n\nFor $\\mathbf{u} = 2\\mathbf{a} - 3\\mathbf{b}$ and $\\mathbf{v} = 6\\mathbf{a} + m\\mathbf{b}$: the coefficients of $\\mathbf{a}$ give $k = 6 \\div 2 = 3$, so $m = 3 \\cdot (-3) = -9$. Check: $-9 \\div (-3) = 3$, the same multiple as for $\\mathbf{a}$.\n\n> **Watch out.** Find $k$ from the pair of coefficients that are both known, then apply the same $k$ to the other basis vector. The unknown is not simply the coefficient copied from $\\mathbf{u}$.",
        "两个非零向量 $\\mathbf{u}$ 和 $\\mathbf{v}$ **平行**（或共线），记作 $\\mathbf{u} \\parallel \\mathbf{v}$，当且仅当存在一个非零标量 $k$，使得：\n\n$$\\mathbf{u} = k\\mathbf{v}$$\n\n对 $\\mathbf{u} = 2\\mathbf{a} - 3\\mathbf{b}$ 和 $\\mathbf{v} = 6\\mathbf{a} + m\\mathbf{b}$：由 $\\mathbf{a}$ 的系数得 $k = 6 \\div 2 = 3$，所以 $m = 3 \\cdot (-3) = -9$。检验：$-9 \\div (-3) = 3$，与 $\\mathbf{a}$ 的倍数相同。\n\n> **注意。** 先用两个都已知的系数求 $k$，再把同一个 $k$ 用到另一个基底向量上。未知系数不是直接照抄 $\\mathbf{u}$ 中的系数。",
      ),
      generate(rng) {
        const k = rng.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
        const aCoeff = rng.pick([1, 2, 3]);
        const bCoeff = rng.pick([2, 3, 4, 5]);
        const sign = rng.pick([1, -1]);
        const bSigned = sign * bCoeff;

        const uA = aCoeff;
        const uB = bSigned;
        const vA = k * aCoeff;
        const vB = k * bSigned;

        const aVec = rng.pick(["\\mathbf{a}", "\\mathbf{e}_1"]);
        const bVec = rng.pick(["\\mathbf{b}", "\\mathbf{e}_2"]);

        const uStr = poly([uA, aVec], [uB, bVec]);
        const vPromptStr = `${poly([vA, aVec])} + m${bVec}`;

        return numberProblem({
          prompt: t(
            `Let $${aVec}$ and $${bVec}$ be non-collinear basis vectors. If $\\mathbf{u} = ${uStr}$ and $\\mathbf{v} = ${vPromptStr}$ are parallel, find the value of $m$.`,
            `设 $${aVec}$ 和 $${bVec}$ 为不共线的基底向量。若 $\\mathbf{u} = ${uStr}$ 与 $\\mathbf{v} = ${vPromptStr}$ 平行，求 $m$ 的值。`,
          ),
          solveFor: "m",
          answer: vB,
          wrong: [-vB, vB + (k > 0 ? 1 : -1), Math.round(uB / aCoeff)],
          solution: walked(
            [
              [
                ["Write the multiple", "写出倍数关系"],
                t(
                  `Parallel vectors are multiples of each other, so $\\mathbf{v} = k\\mathbf{u}$ for some scalar $k$: the coefficients of $${aVec}$ and of $${bVec}$ in $\\mathbf{u}$ are both multiplied by $k$.`,
                  `平行向量互为倍数，所以存在标量 $k$ 使 $\\mathbf{v} = k\\mathbf{u}$：$\\mathbf{u}$ 中 $${aVec}$ 和 $${bVec}$ 的系数都乘以 $k$。`,
                ),
              ],
              [
                ["Find k from the known pair", "由已知的一对系数求 k"],
                t(`Both coefficients of $${aVec}$ are known:`, `$${aVec}$ 的两个系数都已知：`),
                [`k \\cdot ${uA} = ${vA} \\implies k = ${k}`],
              ],
              [
                ["Find m", "求 m"],
                t(`Multiply the coefficient of $${bVec}$ in $\\mathbf{u}$ by $k$:`, `把 $\\mathbf{u}$ 中 $${bVec}$ 的系数乘以 $k$：`),
                [`m = ${k} \\times ${paren(uB)} = ${vB}`],
              ],
            ],
            t(
              `Divide the coefficients of $\\mathbf{v}$ by those of $\\mathbf{u}$: $${vA} \\div ${uA} = ${k}$ and $${vB} \\div ${paren(uB)} = ${k}$. The multiple is the same, so the vectors are parallel.`,
              `把 $\\mathbf{v}$ 的系数除以 $\\mathbf{u}$ 的系数：$${vA} \\div ${uA} = ${k}$，$${vB} \\div ${paren(uB)} = ${k}$。倍数相同，所以两个向量平行。`,
            ),
          ),
        });
      },
    },
    {
      id: "parallel-direction-and-sign",
      figure: precalculusDrawings2["parallel-vectors#parallel-direction-and-sign"],
      title: t("Direction and magnitude ratio of parallel vectors", "平行向量的方向与模长比"),
      explanation: t(
        "For two parallel vectors $\\mathbf{u} = k\\mathbf{v}$ ($k \\neq 0$):\n\n- If $k > 0$, $\\mathbf{u}$ and $\\mathbf{v}$ have the **same direction**.\n- If $k < 0$, $\\mathbf{u}$ and $\\mathbf{v}$ have **opposite directions**.\n\nIn both cases, their lengths satisfy $\\|\\mathbf{u}\\| = |k|\\,\\|\\mathbf{v}\\|$.\n\nFor $\\mathbf{u} = -4\\mathbf{v}$ with $\\|\\mathbf{v}\\| = 5$: the multiplier is negative, so $\\mathbf{u}$ points opposite to $\\mathbf{v}$, and $\\|\\mathbf{u}\\| = 4 \\cdot 5 = 20$. Check: $\\mathbf{u} + 4\\mathbf{v} = \\mathbf{0}$, so $\\mathbf{u}$ undoes four copies of $\\mathbf{v}$.\n\n> **Watch out.** The sign of $k$ gives the direction and $|k|$ gives the stretch. A magnitude is never negative, so $\\mathbf{u} = -4\\mathbf{v}$ has length $20$, not $-20$.",
        "对于两个平行向量 $\\mathbf{u} = k\\mathbf{v}$（$k \\neq 0$）：\n\n- 若 $k > 0$，则 $\\mathbf{u}$ 与 $\\mathbf{v}$ **同向**。\n- 若 $k < 0$，则 $\\mathbf{u}$ 与 $\\mathbf{v}$ **反向**。\n\n两种情况下，模长均满足 $\\|\\mathbf{u}\\| = |k|\\,\\|\\mathbf{v}\\|$。\n\n对 $\\mathbf{u} = -4\\mathbf{v}$，$\\|\\mathbf{v}\\| = 5$：倍数为负，所以 $\\mathbf{u}$ 与 $\\mathbf{v}$ 反向，$\\|\\mathbf{u}\\| = 4 \\cdot 5 = 20$。检验：$\\mathbf{u} + 4\\mathbf{v} = \\mathbf{0}$，即 $\\mathbf{u}$ 抵消了四个 $\\mathbf{v}$。\n\n> **注意。** $k$ 的符号决定方向，$|k|$ 决定伸缩。模不会是负数，所以 $\\mathbf{u} = -4\\mathbf{v}$ 的长度是 $20$，不是 $-20$。",
      ),
      generate(rng) {
        const k = rng.pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]);
        const len = rng.pick([3, 4, 5, 6, 7, 8, 9, 10]);
        const uLen = Math.abs(k) * len;
        const isSame = k > 0;

        const right = isSame
          ? t(`Same direction, with $\\|\\mathbf{u}\\| = ${uLen}$`, `同向，且 $\\|\\mathbf{u}\\| = ${uLen}$`)
          : t(`Opposite directions, with $\\|\\mathbf{u}\\| = ${uLen}$`, `反向，且 $\\|\\mathbf{u}\\| = ${uLen}$`);

        const wrong = isSame
          ? [
              t(`Opposite directions, with $\\|\\mathbf{u}\\| = ${uLen}$`, `反向，且 $\\|\\mathbf{u}\\| = ${uLen}$`),
              t(`Same direction, with $\\|\\mathbf{u}\\| = ${len}$`, `同向，且 $\\|\\mathbf{u}\\| = ${len}$`),
              t(`Opposite directions, with $\\|\\mathbf{u}\\| = ${-uLen}$`, `反向，且 $\\|\\mathbf{u}\\| = ${-uLen}$`),
            ]
          : [
              t(`Same direction, with $\\|\\mathbf{u}\\| = ${uLen}$`, `同向，且 $\\|\\mathbf{u}\\| = ${uLen}$`),
              t(`Opposite directions, with $\\|\\mathbf{u}\\| = ${-uLen}$`, `反向，且 $\\|\\mathbf{u}\\| = ${-uLen}$`),
              t(`Same direction, with $\\|\\mathbf{u}\\| = ${len}$`, `同向，且 $\\|\\mathbf{u}\\| = ${len}$`),
            ];

        return oneOf(
          rng,
          t(
            `Given that $\\mathbf{u} = ${k}\\mathbf{v}$ and $\\|\\mathbf{v}\\| = ${len}$, describe the direction of $\\mathbf{u}$ relative to $\\mathbf{v}$ and find the magnitude $\\|\\mathbf{u}\\|$.`,
            `已知 $\\mathbf{u} = ${k}\\mathbf{v}$ 且 $\\|\\mathbf{v}\\| = ${len}$，说明 $\\mathbf{u}$ 相对 $\\mathbf{v}$ 的方向，并求其模长 $\\|\\mathbf{u}\\|$。`,
          ),
          right,
          wrong,
          walked(
            [
              [
                ["Read the direction from the sign", "由符号判断方向"],
                isSame
                  ? t(
                      `The multiplier $${k}$ is positive, so $\\mathbf{u}$ points the same way as $\\mathbf{v}$.`,
                      `倍数 $${k}$ 为正，所以 $\\mathbf{u}$ 与 $\\mathbf{v}$ 同向。`,
                    )
                  : t(
                      `The multiplier $${k}$ is negative, so $\\mathbf{u}$ points the opposite way to $\\mathbf{v}$.`,
                      `倍数 $${k}$ 为负，所以 $\\mathbf{u}$ 与 $\\mathbf{v}$ 反向。`,
                    ),
              ],
              [
                ["Scale the length", "按比例求长度"],
                t(`The length is multiplied by the size of the multiplier:`, `长度乘以倍数的绝对值：`),
                [`\\|\\mathbf{u}\\| = |${k}|\\,\\|\\mathbf{v}\\| = ${Math.abs(k)} \\times ${len} = ${uLen}`],
              ],
            ],
            t(
              `$\\mathbf{u}$ is $${Math.abs(k)}$ copies of $${isSame ? "" : "-"}\\mathbf{v}$ laid end to end, each of length $${len}$, so it has length $${uLen}$ and points ${isSame ? "along" : "against"} $\\mathbf{v}$.`,
              `$\\mathbf{u}$ 是 $${Math.abs(k)}$ 个长度为 $${len}$ 的 $${isSame ? "" : "-"}\\mathbf{v}$ 首尾相接，所以长 $${uLen}$，方向与 $\\mathbf{v}$ ${isSame ? "相同" : "相反"}。`,
            ),
          ),
          isSame
            ? [
                why(
                  wrong[0]!,
                  "A positive multiplier keeps the direction; only a negative one reverses it.",
                  "正的倍数保持方向；只有负的倍数才使方向相反。",
                ),
                why(
                  wrong[1]!,
                  `This is the length of $\\mathbf{v}$; multiplying by $${k}$ makes $\\mathbf{u}$ ${k} times as long.`,
                  `这是 $\\mathbf{v}$ 的长度；乘以 $${k}$ 使 $\\mathbf{u}$ 的长度变为 ${k} 倍。`,
                ),
                why(
                  wrong[2]!,
                  "A magnitude is never negative, and a positive multiplier keeps the direction.",
                  "模不会是负数，而且正的倍数保持方向。",
                ),
              ]
            : [
                why(wrong[0]!, "A negative multiplier reverses the direction.", "负的倍数使方向相反。"),
                why(
                  wrong[1]!,
                  `A magnitude is never negative; the length uses $|${k}| = ${-k}$.`,
                  `模不会是负数；长度要用 $|${k}| = ${-k}$。`,
                ),
                why(
                  wrong[2]!,
                  `A negative multiplier reverses the direction, and $\\mathbf{u}$ is ${-k} times as long as $\\mathbf{v}$, not equally long.`,
                  `负的倍数使方向相反，而且 $\\mathbf{u}$ 的长度是 $\\mathbf{v}$ 的 ${-k} 倍，不是一样长。`,
                ),
              ],
        );
      },
    },
  ],
};

// ─── 5.16.6 Unit Vectors ────────────────────────────────────────────────────

/** unitVectors covers unit vector definition and normalizing vectors. */
export const unitVectors: TopicDef = {
  id: "unit-vectors",
  title: t("Unit Vectors", "单位向量"),
  summary: t(
    "Define unit vectors and compute the unit vector in the same or opposite direction as a given vector.",
    "理解单位向量的定义，并计算与给定向量同向或反向的单位向量。",
  ),
  prerequisites: ["the-magnitude-of-a-vector"],
  encompasses: [{ topic: "the-magnitude-of-a-vector", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.1", "CCSS.HSN.VM.B.5"],
  intro: t(
    `A unit vector has length $1$, so it records a direction and nothing else. The vector $\\mathbf{v} = \\langle 3, 4 \\rangle$ has length $5$; dividing it by $5$ gives $\\langle 3/5, 4/5 \\rangle$, the unit vector in the same direction, and multiplying that by $10$ gives $\\langle 6, 8 \\rangle$, the vector of length $10$ in that direction.

Check: $(3/5)^2 + (4/5)^2 = 9/25 + 16/25 = 1$, and $\\sqrt{6^2 + 8^2} = 10$.

In this lesson we recognize unit vectors, find the unit vector along a given vector, and scale it to a vector of a given length.`,
    `单位向量的长度是 $1$，所以它只记录方向。向量 $\\mathbf{v} = \\langle 3, 4 \\rangle$ 的长度是 $5$；除以 $5$ 得 $\\langle 3/5, 4/5 \\rangle$，这是同方向的单位向量；再乘以 $10$ 得 $\\langle 6, 8 \\rangle$，这是该方向上长度为 $10$ 的向量。

检验：$(3/5)^2 + (4/5)^2 = 9/25 + 16/25 = 1$，$\\sqrt{6^2 + 8^2} = 10$。

这节课我们识别单位向量，求沿给定向量的单位向量，并把它伸缩成给定长度的向量。`,
  ),
  knowledgePoints: [
    {
      id: "unit-vector-definition",
      title: t("Definition of a unit vector", "单位向量的定义"),
      explanation: t(
        "A **unit vector** is any vector whose magnitude is exactly $1$:\n\n$$\\|\\mathbf{u}\\| = 1$$\n\nThe standard unit coordinate vectors in 2D are $\\mathbf{i} = \\langle 1, 0 \\rangle$ and $\\mathbf{j} = \\langle 0, 1 \\rangle$.\n\nFor $\\langle 0.6, 0.8 \\rangle$: $0.6^2 + 0.8^2 = 0.36 + 0.64 = 1$, so it is a unit vector. For $\\langle 1, 1 \\rangle$ the magnitude is $\\sqrt{2}$, so it is not. Check: $\\langle 0.6, 0.8 \\rangle$ is $\\langle 3, 4 \\rangle$ divided by its length $5$.\n\n> **Watch out.** Small or fractional components do not make a unit vector, and negative ones do not stop it. Only the magnitude decides: $\\langle 1/2, 1/2 \\rangle$ has magnitude $\\sqrt{2}/2$, so it is not a unit vector.",
        "**单位向量**是模长恰好等于 $1$ 的向量：\n\n$$\\|\\mathbf{u}\\| = 1$$\n\n二维平面中的标准单位坐标向量为 $\\mathbf{i} = \\langle 1, 0 \\rangle$ 和 $\\mathbf{j} = \\langle 0, 1 \\rangle$。\n\n对 $\\langle 0.6, 0.8 \\rangle$：$0.6^2 + 0.8^2 = 0.36 + 0.64 = 1$，所以它是单位向量。$\\langle 1, 1 \\rangle$ 的模是 $\\sqrt{2}$，所以不是。检验：$\\langle 0.6, 0.8 \\rangle$ 正是 $\\langle 3, 4 \\rangle$ 除以它的长度 $5$。\n\n> **注意。** 分量小或是分数并不使它成为单位向量，分量为负也不妨碍。只有模长说了算：$\\langle 1/2, 1/2 \\rangle$ 的模是 $\\sqrt{2}/2$，所以不是单位向量。",
      ),
      generate(rng) {
        const units = [
          { vec: "\\left\\langle \\frac{3}{5}, \\frac{4}{5} \\right\\rangle", isUnit: true, mag: "\\sqrt{(3/5)^2 + (4/5)^2} = 1" },
          { vec: "\\left\\langle -\\frac{3}{5}, \\frac{4}{5} \\right\\rangle", isUnit: true, mag: "\\sqrt{(-3/5)^2 + (4/5)^2} = 1" },
          { vec: "\\left\\langle \\frac{3}{5}, -\\frac{4}{5} \\right\\rangle", isUnit: true, mag: "\\sqrt{(3/5)^2 + (-4/5)^2} = 1" },
          { vec: "\\left\\langle -\\frac{3}{5}, -\\frac{4}{5} \\right\\rangle", isUnit: true, mag: "\\sqrt{(-3/5)^2 + (-4/5)^2} = 1" },
          { vec: "\\left\\langle \\frac{4}{5}, \\frac{3}{5} \\right\\rangle", isUnit: true, mag: "\\sqrt{(4/5)^2 + (3/5)^2} = 1" },
          { vec: "\\left\\langle -\\frac{4}{5}, \\frac{3}{5} \\right\\rangle", isUnit: true, mag: "\\sqrt{(-4/5)^2 + (3/5)^2} = 1" },
          { vec: "\\left\\langle -\\frac{5}{13}, \\frac{12}{13} \\right\\rangle", isUnit: true, mag: "\\sqrt{(-5/13)^2 + (12/13)^2} = 1" },
          { vec: "\\left\\langle \\frac{5}{13}, -\\frac{12}{13} \\right\\rangle", isUnit: true, mag: "\\sqrt{(5/13)^2 + (-12/13)^2} = 1" },
          { vec: "\\left\\langle \\frac{12}{13}, \\frac{5}{13} \\right\\rangle", isUnit: true, mag: "\\sqrt{(12/13)^2 + (5/13)^2} = 1" },
          {
            vec: "\\left\\langle -\\frac{12}{13}, -\\frac{5}{13} \\right\\rangle",
            isUnit: true,
            mag: "\\sqrt{(-12/13)^2 + (-5/13)^2} = 1",
          },
          { vec: "\\left\\langle \\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{2}}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{2/4 + 2/4} = 1" },
          { vec: "\\left\\langle -\\frac{\\sqrt{2}}{2}, \\frac{\\sqrt{2}}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{2/4 + 2/4} = 1" },
          { vec: "\\left\\langle \\frac{\\sqrt{2}}{2}, -\\frac{\\sqrt{2}}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{2/4 + 2/4} = 1" },
          {
            vec: "\\left\\langle -\\frac{\\sqrt{2}}{2}, -\\frac{\\sqrt{2}}{2} \\right\\rangle",
            isUnit: true,
            mag: "\\sqrt{2/4 + 2/4} = 1",
          },
          { vec: "\\left\\langle \\frac{1}{2}, \\frac{\\sqrt{3}}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{1/4 + 3/4} = 1" },
          { vec: "\\left\\langle -\\frac{1}{2}, \\frac{\\sqrt{3}}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{1/4 + 3/4} = 1" },
          { vec: "\\left\\langle \\frac{1}{2}, -\\frac{\\sqrt{3}}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{1/4 + 3/4} = 1" },
          { vec: "\\left\\langle -\\frac{1}{2}, -\\frac{\\sqrt{3}}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{1/4 + 3/4} = 1" },
          { vec: "\\left\\langle \\frac{\\sqrt{3}}{2}, \\frac{1}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{3/4 + 1/4} = 1" },
          { vec: "\\left\\langle -\\frac{\\sqrt{3}}{2}, \\frac{1}{2} \\right\\rangle", isUnit: true, mag: "\\sqrt{3/4 + 1/4} = 1" },
          { vec: "\\langle 1, 0 \\rangle", isUnit: true, mag: "\\sqrt{1^2 + 0^2} = 1" },
          { vec: "\\langle 0, -1 \\rangle", isUnit: true, mag: "\\sqrt{0^2 + (-1)^2} = 1" },
          { vec: "\\langle -1, 0 \\rangle", isUnit: true, mag: "\\sqrt{(-1)^2 + 0^2} = 1" },
          { vec: "\\langle 0, 1 \\rangle", isUnit: true, mag: "\\sqrt{0^2 + 1^2} = 1" },
          { vec: "\\left\\langle \\frac{7}{25}, \\frac{24}{25} \\right\\rangle", isUnit: true, mag: "\\sqrt{49/625 + 576/625} = 1" },
          { vec: "\\left\\langle -\\frac{8}{17}, \\frac{15}{17} \\right\\rangle", isUnit: true, mag: "\\sqrt{64/289 + 225/289} = 1" },
          { vec: "\\left\\langle \\frac{8}{17}, -\\frac{15}{17} \\right\\rangle", isUnit: true, mag: "\\sqrt{64/289 + 225/289} = 1" },
          { vec: "\\left\\langle -\\frac{7}{25}, -\\frac{24}{25} \\right\\rangle", isUnit: true, mag: "\\sqrt{49/625 + 576/625} = 1" },
          { vec: "\\left\\langle \\frac{20}{29}, \\frac{21}{29} \\right\\rangle", isUnit: true, mag: "\\sqrt{400/841 + 441/841} = 1" },
          { vec: "\\left\\langle -\\frac{20}{29}, \\frac{21}{29} \\right\\rangle", isUnit: true, mag: "\\sqrt{400/841 + 441/841} = 1" },
          // non-units
          { vec: "\\langle 1, 1 \\rangle", isUnit: false, mag: "\\sqrt{1^2 + 1^2} = \\sqrt{2} \\neq 1" },
          { vec: "\\langle 2, 0 \\rangle", isUnit: false, mag: "2 \\neq 1" },
          { vec: "\\langle 0, -3 \\rangle", isUnit: false, mag: "3 \\neq 1" },
          {
            vec: "\\left\\langle \\frac{1}{2}, \\frac{1}{2} \\right\\rangle",
            isUnit: false,
            mag: "\\sqrt{1/4 + 1/4} = \\frac{\\sqrt{2}}{2} \\neq 1",
          },
          {
            vec: "\\left\\langle \\frac{2}{3}, \\frac{2}{3} \\right\\rangle",
            isUnit: false,
            mag: "\\sqrt{4/9 + 4/9} = \\frac{\\sqrt{8}}{3} \\neq 1",
          },
          { vec: "\\langle -1, -1 \\rangle", isUnit: false, mag: "\\sqrt{2} \\neq 1" },
          { vec: "\\left\\langle \\frac{3}{4}, \\frac{3}{4} \\right\\rangle", isUnit: false, mag: "\\frac{3\\sqrt{2}}{4} \\neq 1" },
          { vec: "\\langle 1, 2 \\rangle", isUnit: false, mag: "\\sqrt{5} \\neq 1" },
          { vec: "\\langle -2, 1 \\rangle", isUnit: false, mag: "\\sqrt{5} \\neq 1" },
          { vec: "\\langle 3, 4 \\rangle", isUnit: false, mag: "5 \\neq 1" },
          { vec: "\\langle -5, 12 \\rangle", isUnit: false, mag: "13 \\neq 1" },
          { vec: "\\left\\langle \\frac{1}{3}, \\frac{2}{3} \\right\\rangle", isUnit: false, mag: "\\frac{\\sqrt{5}}{3} \\neq 1" },
          { vec: "\\langle 0, 2 \\rangle", isUnit: false, mag: "2 \\neq 1" },
          { vec: "\\langle -4, 0 \\rangle", isUnit: false, mag: "4 \\neq 1" },
          { vec: "\\left\\langle \\frac{2}{5}, \\frac{3}{5} \\right\\rangle", isUnit: false, mag: "\\frac{\\sqrt{13}}{5} \\neq 1" },
        ];
        const pick = rng.pick(units);
        const right = pick.isUnit
          ? t("Yes, because its magnitude is $1$.", "是，因为其模长为 $1$。")
          : t("No, because its magnitude is not $1$.", "否，因为其模长不为 $1$。");
        const wrong = pick.isUnit
          ? [
              t("No, because its components are fractions.", "否，因为它的分量是分数。"),
              t("No, because its magnitude is not $1$.", "否，因为其模长不为 $1$。"),
              t("Yes, because all two-dimensional vectors are unit vectors.", "是，因为所有二维向量都是单位向量。"),
            ]
          : [
              t("Yes, because its components are positive.", "是，因为它的分量都是正数。"),
              t("Yes, because its magnitude is $1$.", "是，因为其模长为 $1$。"),
              t("No, because a unit vector cannot have two components.", "否，因为单位向量不能有两个分量。"),
            ];

        return oneOf(
          rng,
          t(`Is the vector $\\mathbf{u} = ${pick.vec}$ a unit vector?`, `向量 $\\mathbf{u} = ${pick.vec}$ 是单位向量吗？`),
          right,
          wrong,
          walked(
            [
              [
                ["Find the magnitude", "求模长"],
                t("Square the components, add them, and take the square root:", "把分量平方、相加，再开平方："),
                [`\\|\\mathbf{u}\\| = ${pick.mag}`],
              ],
              [
                ["Compare with 1", "与 1 比较"],
                pick.isUnit
                  ? t("The magnitude is exactly $1$, so $\\mathbf{u}$ is a unit vector.", "模长恰好是 $1$，所以 $\\mathbf{u}$ 是单位向量。")
                  : t(
                      "The magnitude is not $1$, so $\\mathbf{u}$ is not a unit vector.",
                      "模长不是 $1$，所以 $\\mathbf{u}$ 不是单位向量。",
                    ),
              ],
            ],
            pick.isUnit
              ? t(
                  "Dividing $\\mathbf{u}$ by its magnitude $1$ leaves it unchanged, so it is already the unit vector in its own direction.",
                  "把 $\\mathbf{u}$ 除以它的模 $1$，它不变，所以它本身就是自己方向上的单位向量。",
                )
              : t(
                  "Dividing $\\mathbf{u}$ by its magnitude would change it, which never happens to a unit vector: $\\mathbf{u}$ is longer or shorter than $1$.",
                  "把 $\\mathbf{u}$ 除以它的模会改变它，而单位向量除以模不会变：$\\mathbf{u}$ 比 $1$ 长或短。",
                ),
          ),
          pick.isUnit
            ? [
                why(
                  wrong[0]!,
                  "The form of the components does not decide it; only the magnitude does, and it is $1$.",
                  "分量的形式不能决定；只有模长能决定，而它等于 $1$。",
                ),
                why(wrong[1]!, "The magnitude works out to exactly $1$.", "模长算出来恰好是 $1$。"),
                why(
                  wrong[2]!,
                  "Most vectors are not unit vectors: $\\langle 3, 4 \\rangle$ has magnitude $5$.",
                  "大多数向量都不是单位向量：$\\langle 3, 4 \\rangle$ 的模是 $5$。",
                ),
              ]
            : [
                why(
                  wrong[0]!,
                  "The signs of the components do not decide it; only the magnitude does, and it is not $1$.",
                  "分量的符号不能决定；只有模长能决定，而它不是 $1$。",
                ),
                why(wrong[1]!, "The magnitude works out to a number other than $1$.", "模长算出来不是 $1$。"),
                why(
                  wrong[2]!,
                  "A unit vector can have two nonzero components, as $\\langle 3/5, 4/5 \\rangle$ does.",
                  "单位向量可以有两个非零分量，例如 $\\langle 3/5, 4/5 \\rangle$。",
                ),
              ],
        );
      },
    },
    {
      id: "unit-vector-in-direction",
      title: t("Find a unit vector in the direction of a given vector", "求与给定向量同向或反向的单位向量"),
      explanation: t(
        "To find a unit vector $\\mathbf{u}$ pointing in the **same direction** as non-zero vector $\\mathbf{v}$, divide $\\mathbf{v}$ by its magnitude (normalization):\n\n$$\\mathbf{u} = \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}$$\n\nA unit vector pointing in the **opposite direction** is $-\\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}$.\n\nFor $\\mathbf{v} = \\langle -5, 12 \\rangle$: $\\|\\mathbf{v}\\| = \\sqrt{25 + 144} = 13$, so the unit vector in its direction is $\\langle -5/13, 12/13 \\rangle$ and the one in the opposite direction is $\\langle 5/13, -12/13 \\rangle$. Check: $25/169 + 144/169 = 1$.\n\n> **Watch out.** Divide each component by the magnitude itself, not by its square or by the sum of the components. For the opposite direction, change the sign of both components.",
        "求与非零向量 $\\mathbf{v}$ **同方向**的单位向量 $\\mathbf{u}$，只需将 $\\mathbf{v}$ 除以其模长（归一化）：\n\n$$\\mathbf{u} = \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}$$\n\n与 $\\mathbf{v}$ **反方向**的单位向量为 $-\\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|}$。\n\n对 $\\mathbf{v} = \\langle -5, 12 \\rangle$：$\\|\\mathbf{v}\\| = \\sqrt{25 + 144} = 13$，所以同方向的单位向量是 $\\langle -5/13, 12/13 \\rangle$，反方向的是 $\\langle 5/13, -12/13 \\rangle$。检验：$25/169 + 144/169 = 1$。\n\n> **注意。** 每个分量要除以模长本身，不是模长的平方，也不是分量之和。求反方向时，两个分量都要变号。",
      ),
      generate(rng) {
        const baseTriples = [
          { a: 3, b: 4, mag: 5 },
          { a: 4, b: 3, mag: 5 },
          { a: 5, b: 12, mag: 13 },
          { a: 12, b: 5, mag: 13 },
          { a: 8, b: 15, mag: 17 },
          { a: 15, b: 8, mag: 17 },
          { a: 7, b: 24, mag: 25 },
          { a: 24, b: 7, mag: 25 },
          { a: 20, b: 21, mag: 29 },
          { a: 21, b: 20, mag: 29 },
          { a: 9, b: 40, mag: 41 },
          { a: 40, b: 9, mag: 41 },
          { a: 12, b: 35, mag: 37 },
          { a: 35, b: 12, mag: 37 },
        ];
        const triple = rng.pick(baseTriples);
        const sx = rng.pick([1, -1]);
        const sy = rng.pick([1, -1]);
        const x = sx * triple.a;
        const y = sy * triple.b;
        const mag = triple.mag;

        const dir = rng.pick(["same", "opposite"]);
        const isSame = dir === "same";

        const ux = isSame ? x : -x;
        const uy = isSame ? y : -y;
        const qx = Q.of(ux, mag);
        const qy = Q.of(uy, mag);

        return pointProblem({
          prompt: t(
            `Find the unit vector pointing in the ${isSame ? "same" : "opposite"} direction as $\\mathbf{v} = \\langle ${x}, ${y} \\rangle$. Write your answer in component form $\\langle x, y \\rangle$.`,
            `求与向量 $\\mathbf{v} = \\langle ${x}, ${y} \\rangle$ ${isSame ? "同向" : "反向"}的单位向量。请用坐标分量形式 $\\langle x, y \\rangle$ 作答。`,
          ),
          vector: true,
          answer: [qx, qy],
          wrong: [
            [Q.of(-ux, mag), Q.of(-uy, mag)],
            [ux, uy],
            [Q.of(ux, mag * mag), Q.of(uy, mag * mag)],
            [Q.of(uy, mag), Q.of(ux, mag)],
          ],
          solution: walked(
            [
              [
                ["Find the magnitude", "求模长"],
                t(`Use the components of $\\mathbf{v}$:`, `用 $\\mathbf{v}$ 的分量：`),
                [`\\|\\mathbf{v}\\| = \\sqrt{(${x})^2 + (${y})^2} = \\sqrt{${x * x + y * y}} = ${mag}`],
              ],
              [
                ["Divide by the magnitude", "除以模长"],
                isSame
                  ? t(`Divide each component by $${mag}$, which keeps the direction:`, `每个分量除以 $${mag}$，方向不变：`)
                  : t(
                      `Divide each component by $${mag}$ and change both signs to reverse the direction:`,
                      `每个分量除以 $${mag}$，再把两个符号都变过来，使方向相反：`,
                    ),
                [`${isSame ? "" : "-"}\\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|} = \\langle ${qx.toLatex()}, ${qy.toLatex()} \\rangle`],
              ],
            ],
            t(
              `The result has length $1$:\n\n$$\\sqrt{\\left(${qx.toLatex()}\\right)^2 + \\left(${qy.toLatex()}\\right)^2} = \\sqrt{\\frac{${ux * ux} + ${uy * uy}}{${mag * mag}}} = 1$$\n\nIts components have ${isSame ? "the same signs as" : "the opposite signs to"} those of $\\mathbf{v}$, so it points ${isSame ? "the same way" : "the opposite way"}.`,
              `结果的长度是 $1$：\n\n$$\\sqrt{\\left(${qx.toLatex()}\\right)^2 + \\left(${qy.toLatex()}\\right)^2} = \\sqrt{\\frac{${ux * ux} + ${uy * uy}}{${mag * mag}}} = 1$$\n\n它的分量与 $\\mathbf{v}$ 的分量${isSame ? "同号" : "异号"}，所以方向${isSame ? "相同" : "相反"}。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 5.16.7 Linear Combinations of Vectors ──────────────────────────────────

/** linearCombinationsOfVectorsAndTheirProperties covers vector algebra and solving scalar systems. */
export const linearCombinationsOfVectorsAndTheirProperties: TopicDef = {
  id: "linear-combinations-of-vectors-and-their-properties",
  title: t("Linear Combinations of Vectors and Their Properties", "向量的线性组合及其性质"),
  summary: t(
    "Form linear combinations of vectors, apply algebraic properties, and solve for unknown scalar coefficients.",
    "计算向量的线性组合，应用代数运算性质，并求解未知数乘系数。",
  ),
  prerequisites: ["the-triangle-law-for-the-addition-of-two-vectors", "parallel-vectors"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.VM.B.4", "CCSS.HSN.VM.B.5"],
  intro: t(
    `Vectors combine like algebraic terms: scalars distribute over brackets and multiples of the same vector collect. For example, $2(\\mathbf{u} + \\mathbf{v}) - (\\mathbf{u} - 3\\mathbf{v}) = 2\\mathbf{u} + 2\\mathbf{v} - \\mathbf{u} + 3\\mathbf{v} = \\mathbf{u} + 5\\mathbf{v}$.

Check: putting the same vector $\\mathbf{w}$ for both $\\mathbf{u}$ and $\\mathbf{v}$, the left side is $2 \\cdot 2\\mathbf{w} - (-2\\mathbf{w}) = 6\\mathbf{w}$, and the right side is $\\mathbf{w} + 5\\mathbf{w} = 6\\mathbf{w}$.

In this lesson we simplify combinations of vectors, match coefficients of non-parallel vectors, and write a vector in terms of two others.`,
    `向量的组合就像代数式：数乘对括号分配，同一向量的倍数可以合并。例如 $2(\\mathbf{u} + \\mathbf{v}) - (\\mathbf{u} - 3\\mathbf{v}) = 2\\mathbf{u} + 2\\mathbf{v} - \\mathbf{u} + 3\\mathbf{v} = \\mathbf{u} + 5\\mathbf{v}$。

检验：把 $\\mathbf{u}$ 和 $\\mathbf{v}$ 都换成同一个向量 $\\mathbf{w}$，左边是 $2 \\cdot 2\\mathbf{w} - (-2\\mathbf{w}) = 6\\mathbf{w}$，右边是 $\\mathbf{w} + 5\\mathbf{w} = 6\\mathbf{w}$。

这节课我们化简向量的组合，比较不平行向量的系数，并用两个向量表示另一个向量。`,
  ),
  knowledgePoints: [
    {
      id: "simplify-linear-combinations",
      title: t("Simplify linear combinations of vectors", "化简向量的线性组合"),
      explanation: t(
        "To simplify a combination of vectors, distribute each scalar over its parentheses and then collect the multiples of each vector, just as you collect like terms in algebra. Vector addition and scalar multiplication satisfy distributive properties:\n\n$$c_1(a_1\\mathbf{u} + b_1\\mathbf{v}) + c_2(a_2\\mathbf{u} + b_2\\mathbf{v}) = (c_1 a_1 + c_2 a_2)\\mathbf{u} + (c_1 b_1 + c_2 b_2)\\mathbf{v}$$\n\nFor $3(\\mathbf{u} + 2\\mathbf{v}) - 2(\\mathbf{u} - \\mathbf{v})$: distributing gives $3\\mathbf{u} + 6\\mathbf{v} - 2\\mathbf{u} + 2\\mathbf{v}$, which collects to $\\mathbf{u} + 8\\mathbf{v}$. Check: with $\\mathbf{u} = \\mathbf{v} = \\mathbf{w}$ the expression is $3 \\cdot 3\\mathbf{w} - 2 \\cdot 0\\mathbf{w} = 9\\mathbf{w}$, and $1 + 8 = 9$.\n\n> **Watch out.** A minus sign in front of a bracket multiplies every term inside it: $-2(\\mathbf{u} - \\mathbf{v}) = -2\\mathbf{u} + 2\\mathbf{v}$, not $-2\\mathbf{u} - 2\\mathbf{v}$.",
        "化简向量的组合时，先把每个数乘分配到括号里，再合并同一向量的倍数，就像代数中合并同类项一样。向量加法与数乘满足乘法对加法的分配律：\n\n$$c_1(a_1\\mathbf{u} + b_1\\mathbf{v}) + c_2(a_2\\mathbf{u} + b_2\\mathbf{v}) = (c_1 a_1 + c_2 a_2)\\mathbf{u} + (c_1 b_1 + c_2 b_2)\\mathbf{v}$$\n\n对 $3(\\mathbf{u} + 2\\mathbf{v}) - 2(\\mathbf{u} - \\mathbf{v})$：展开得 $3\\mathbf{u} + 6\\mathbf{v} - 2\\mathbf{u} + 2\\mathbf{v}$，合并得 $\\mathbf{u} + 8\\mathbf{v}$。检验：令 $\\mathbf{u} = \\mathbf{v} = \\mathbf{w}$，表达式为 $3 \\cdot 3\\mathbf{w} - 2 \\cdot 0\\mathbf{w} = 9\\mathbf{w}$，而 $1 + 8 = 9$。\n\n> **注意。** 括号前的负号要乘到括号里的每一项：$-2(\\mathbf{u} - \\mathbf{v}) = -2\\mathbf{u} + 2\\mathbf{v}$，不是 $-2\\mathbf{u} - 2\\mathbf{v}$。",
      ),
      generate(rng) {
        const c1 = rng.pick([2, 3, 4, 5]);
        const c2 = rng.pick([-4, -3, -2, 2, 3, 4]);
        const a1 = rng.pick([1, 2, 3]);
        const b1 = rng.pick([-3, -2, -1, 1, 2, 3]);
        const a2 = rng.pick([1, 2, -2]);
        const b2 = rng.pick([-2, -1, 1, 2]);

        const u = rng.pick(["\\mathbf{u}", "\\mathbf{a}"]);
        const v = rng.pick(["\\mathbf{v}", "\\mathbf{b}"]);

        const resU = c1 * a1 + c2 * a2;
        const resV = c1 * b1 + c2 * b2;

        const ansStr = poly([resU, u], [resV, v]);
        const wrong1Str = poly([resU + 2, u], [resV, v]);
        const wrong2Str = resV !== 0 ? poly([resU, u], [-resV, v]) : poly([-resU, u], [resV, v]);
        const wrong3Str = poly([c1 * a1, u], [c2 * b2, v]);

        const pStr = `${c1}(${poly([a1, u], [b1, v])}) ${c2 > 0 ? "+" : "-"} ${Math.abs(c2)}(${poly([a2, u], [b2, v])})`;

        return oneOf(
          rng,
          t(`Simplify the expression: $${pStr}$.`, `化简表达式：$${pStr}$。`),
          t(`$${ansStr}$`, `$${ansStr}$`),
          [t(`$${wrong1Str}$`, `$${wrong1Str}$`), t(`$${wrong2Str}$`, `$${wrong2Str}$`), t(`$${wrong3Str}$`, `$${wrong3Str}$`)],
          walked(
            [
              [
                ["Distribute", "展开括号"],
                t(
                  `Multiply every term in each bracket by the scalar in front of it, sign included:`,
                  `把每个括号里的每一项都乘以括号前的数，连同符号：`,
                ),
                [`${pStr} = ${poly([c1 * a1, u], [c1 * b1, v], [c2 * a2, u], [c2 * b2, v])}`],
              ],
              [
                ["Collect", "合并"],
                t(`Add the multiples of each vector:`, `把同一向量的倍数相加：`),
                [
                  `(${c1 * a1} ${c2 * a2 < 0 ? "-" : "+"} ${Math.abs(c2 * a2)})${u} + (${c1 * b1} ${c2 * b2 < 0 ? "-" : "+"} ${Math.abs(c2 * b2)})${v} = ${ansStr}`,
                ],
              ],
            ],
            t(
              `Put the same vector $\\mathbf{w}$ for both $${u}$ and $${v}$. The expression becomes $${c1} \\cdot ${paren(a1 + b1)} + ${paren(c2)} \\cdot ${paren(a2 + b2)} = ${c1 * (a1 + b1) + c2 * (a2 + b2)}$ copies of $\\mathbf{w}$, and the answer gives $${resU} + ${paren(resV)} = ${resU + resV}$ as well.`,
              `把 $${u}$ 和 $${v}$ 都换成同一个向量 $\\mathbf{w}$。表达式变为 $${c1} \\cdot ${paren(a1 + b1)} + ${paren(c2)} \\cdot ${paren(a2 + b2)} = ${c1 * (a1 + b1) + c2 * (a2 + b2)}$ 个 $\\mathbf{w}$，答案也给出 $${resU} + ${paren(resV)} = ${resU + resV}$。`,
            ),
          ),
          [
            why(
              same(`$${wrong1Str}$`),
              `The coefficient of $${u}$ is $${c1} \\cdot ${a1} + ${paren(c2)} \\cdot ${paren(a2)} = ${resU}$, not $${resU + 2}$.`,
              `$${u}$ 的系数是 $${c1} \\cdot ${a1} + ${paren(c2)} \\cdot ${paren(a2)} = ${resU}$，不是 $${resU + 2}$。`,
            ),
            resV !== 0
              ? why(
                  same(`$${wrong2Str}$`),
                  `The coefficient of $${v}$ has the wrong sign: $${c1} \\cdot ${paren(b1)} + ${paren(c2)} \\cdot ${paren(b2)} = ${resV}$.`,
                  `$${v}$ 的系数符号错了：$${c1} \\cdot ${paren(b1)} + ${paren(c2)} \\cdot ${paren(b2)} = ${resV}$。`,
                )
              : why(
                  same(`$${wrong2Str}$`),
                  `The coefficient of $${u}$ has the wrong sign: $${c1} \\cdot ${a1} + ${paren(c2)} \\cdot ${paren(a2)} = ${resU}$.`,
                  `$${u}$ 的系数符号错了：$${c1} \\cdot ${a1} + ${paren(c2)} \\cdot ${paren(a2)} = ${resU}$。`,
                ),
            why(
              same(`$${wrong3Str}$`),
              `This keeps only $${c1} \\cdot ${a1}$ for $${u}$ and $${paren(c2)} \\cdot ${paren(b2)}$ for $${v}$; each bracket adds to both coefficients.`,
              `这只保留了 $${u}$ 的 $${c1} \\cdot ${a1}$ 和 $${v}$ 的 $${paren(c2)} \\cdot ${paren(b2)}$；每个括号对两个系数都有贡献。`,
            ),
          ],
        );
      },
    },
    {
      id: "solve-for-scalar-coefficients",
      title: t("Solve for unknown scalar coefficients in linear combinations", "求解向量线性组合中的未知标量系数"),
      explanation: t(
        "When two vectors do not point along the same line, each vector in their plane has only one way to be written as a combination of them, so the coefficients can be matched. If vectors $\\mathbf{u}$ and $\\mathbf{v}$ are non-collinear (linearly independent), then:\n\n$$x\\mathbf{u} + y\\mathbf{v} = a\\mathbf{u} + b\\mathbf{v} \\iff x = a \\text{ and } y = b$$\n\nFor $(x + y)\\mathbf{u} + (x - y)\\mathbf{v} = 5\\mathbf{u} + \\mathbf{v}$: matching gives $x + y = 5$ and $x - y = 1$, so adding, $2x = 6$, $x = 3$ and $y = 2$. Check: $3 + 2 = 5$ and $3 - 2 = 1$.\n\n> **Watch out.** Matching coefficients works only because $\\mathbf{u}$ and $\\mathbf{v}$ are not parallel. If $\\mathbf{v} = 2\\mathbf{u}$, then $\\mathbf{u} + \\mathbf{v}$ and $3\\mathbf{u}$ are the same vector with different coefficients.",
        "当两个向量不在同一直线上时，它们所在平面中的每个向量只有一种方式写成它们的组合，所以可以对应比较系数。若向量 $\\mathbf{u}$ 和 $\\mathbf{v}$ 不共线（线性无关），则：\n\n$$x\\mathbf{u} + y\\mathbf{v} = a\\mathbf{u} + b\\mathbf{v} \\iff x = a \\text{ 且 } y = b$$\n\n对 $(x + y)\\mathbf{u} + (x - y)\\mathbf{v} = 5\\mathbf{u} + \\mathbf{v}$：比较系数得 $x + y = 5$，$x - y = 1$，相加得 $2x = 6$，所以 $x = 3$，$y = 2$。检验：$3 + 2 = 5$，$3 - 2 = 1$。\n\n> **注意。** 能比较系数，正是因为 $\\mathbf{u}$ 和 $\\mathbf{v}$ 不平行。若 $\\mathbf{v} = 2\\mathbf{u}$，那么 $\\mathbf{u} + \\mathbf{v}$ 和 $3\\mathbf{u}$ 是同一个向量，系数却不同。",
      ),
      generate(rng) {
        const x = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8]);
        const y = rng.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8]);
        const c1 = 2 * x + y;
        const c2 = x - y;
        const rhs = poly([c1, "\\mathbf{u}"], [c2, "\\mathbf{v}"]);

        return pointProblem({
          prompt: t(
            `Let $\\mathbf{u}$ and $\\mathbf{v}$ be non-collinear vectors. If $(2x + y)\\mathbf{u} + (x - y)\\mathbf{v} = ${rhs}$, solve for $x$ and $y$.`,
            `设 $\\mathbf{u}$ 与 $\\mathbf{v}$ 为不共线的向量。若 $(2x + y)\\mathbf{u} + (x - y)\\mathbf{v} = ${rhs}$，求 $x$ 与 $y$ 的值。`,
          ),
          vars: ["x", "y"],
          answer: [x, y],
          wrong: [
            [y, x],
            [x + 1, y - 1],
            [x, -y],
            [-x, y],
          ],
          solution: walked(
            [
              [
                ["Match the coefficients", "比较系数"],
                t(
                  `Since $\\mathbf{u}$ and $\\mathbf{v}$ are not parallel, a vector has only one way to be written in terms of them, so the coefficients on the two sides are equal:`,
                  `因为 $\\mathbf{u}$ 和 $\\mathbf{v}$ 不平行，一个向量用它们表示的方式只有一种，所以两边的系数相等：`,
                ),
                [`2x + y = ${c1}`, `x - y = ${c2}`],
              ],
              [
                ["Eliminate y", "消去 y"],
                t(`Add the two equations, which removes $y$:`, `两式相加，消去 $y$：`),
                [`3x = ${c1 + c2} \\implies x = ${x}`],
              ],
              [
                ["Find y", "求 y"],
                t(`The second equation gives $y = x - ${paren(c2)}$:`, `由第二个方程得 $y = x - ${paren(c2)}$：`),
                [`y = ${x} - ${paren(c2)} = ${y}`],
              ],
            ],
            t(
              `$2 \\cdot ${paren(x)} + ${paren(y)} = ${c1}$ and $${x} - ${paren(y)} = ${c2}$, which are the coefficients on the right.`,
              `$2 \\cdot ${paren(x)} + ${paren(y)} = ${c1}$，$${x} - ${paren(y)} = ${c2}$，正是右边的系数。`,
            ),
          ),
        });
      },
    },
  ],
};

// ─── 5.16.8 Describing the Position Vector of a Point ────────────────────────

/** describingThePositionVectorOfAPointUsingKnownVectors covers section formula and midpoints. */
export const describingThePositionVectorOfAPointUsingKnownVectors: TopicDef = {
  id: "describing-the-position-vector-of-a-point-using-known-vectors",
  title: t("Describing the Position Vector of a Point Using Known Vectors", "用已知向量表示点的未知位置向量"),
  summary: t(
    "Express the position vector of a point relative to an origin using section formulas and midpoints.",
    "利用定比分点公式与中点公式，用已知基底向量表示某点相对于原点的位置向量。",
  ),
  prerequisites: ["linear-combinations-of-vectors-and-their-properties"],
  encompasses: [{ topic: "linear-combinations-of-vectors-and-their-properties", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.B.4", "CCSS.HSN.VM.B.5"],
  intro: t(
    `The position vector of a point is the arrow from the origin $O$ to it. To reach a point on segment $AB$, go to $A$ and then part of the way along $\\vec{AB} = \\mathbf{b} - \\mathbf{a}$. For the midpoint $M$ with $\\mathbf{a} = \\langle 2, 0 \\rangle$ and $\\mathbf{b} = \\langle 4, 6 \\rangle$: $\\vec{OM} = \\mathbf{a} + \\tfrac{1}{2}(\\mathbf{b} - \\mathbf{a}) = \\langle 3, 3 \\rangle$.

Check: the step from $A$ to $M$ is $\\langle 1, 3 \\rangle$, and the step from $M$ to $B$ is $\\langle 1, 3 \\rangle$ too, so $M$ is halfway.

In this lesson we find the position vectors of midpoints and of points dividing a segment in a ratio, and find a missing endpoint from a point that divides a segment.`,
    `点的位置向量是从原点 $O$ 指向它的箭头。要到达线段 $AB$ 上的点，先到 $A$，再沿 $\\vec{AB} = \\mathbf{b} - \\mathbf{a}$ 走一部分。对中点 $M$，$\\mathbf{a} = \\langle 2, 0 \\rangle$，$\\mathbf{b} = \\langle 4, 6 \\rangle$：$\\vec{OM} = \\mathbf{a} + \\tfrac{1}{2}(\\mathbf{b} - \\mathbf{a}) = \\langle 3, 3 \\rangle$。

检验：从 $A$ 到 $M$ 是 $\\langle 1, 3 \\rangle$，从 $M$ 到 $B$ 也是 $\\langle 1, 3 \\rangle$，所以 $M$ 在正中间。

这节课我们求中点和按比分线段的点的位置向量，并由分线段的点求缺失的端点。`,
  ),
  knowledgePoints: [
    {
      id: "midpoint-position-vector",
      title: t("Position vector of a midpoint", "中点的位置向量"),
      explanation: t(
        "Let $O$ be the origin, and let $\\mathbf{a} = \\vec{OA}$ and $\\mathbf{b} = \\vec{OB}$ be the position vectors of points $A$ and $B$. If $M$ is the **midpoint** of line segment $AB$, then:\n\n$$\\vec{OM} = \\frac{\\vec{OA} + \\vec{OB}}{2} = \\frac{1}{2}\\mathbf{a} + \\frac{1}{2}\\mathbf{b}$$\n\nFor $\\mathbf{a} = \\langle -2, 4 \\rangle$ and $\\mathbf{b} = \\langle 6, 0 \\rangle$: $\\vec{OM} = \\tfrac{1}{2}\\langle 4, 4 \\rangle = \\langle 2, 2 \\rangle$. Check: $\\langle 2, 2 \\rangle - \\langle -2, 4 \\rangle = \\langle 4, -2 \\rangle$ and $\\langle 6, 0 \\rangle - \\langle 2, 2 \\rangle = \\langle 4, -2 \\rangle$, two equal halves.\n\n> **Watch out.** The midpoint is half of the sum. $\\mathbf{a} + \\mathbf{b}$ itself is the fourth corner of the parallelogram on $OA$ and $OB$, and $\\tfrac{1}{2}(\\mathbf{b} - \\mathbf{a})$ is only the step from $A$ to $M$.",
        "设 $O$ 为原点，$\\mathbf{a} = \\vec{OA}$ 和 $\\mathbf{b} = \\vec{OB}$ 分别为点 $A$ 和点 $B$ 的位置向量。若 $M$ 为线段 $AB$ 的**中点**，则：\n\n$$\\vec{OM} = \\frac{\\vec{OA} + \\vec{OB}}{2} = \\frac{1}{2}\\mathbf{a} + \\frac{1}{2}\\mathbf{b}$$\n\n对 $\\mathbf{a} = \\langle -2, 4 \\rangle$，$\\mathbf{b} = \\langle 6, 0 \\rangle$：$\\vec{OM} = \\tfrac{1}{2}\\langle 4, 4 \\rangle = \\langle 2, 2 \\rangle$。检验：$\\langle 2, 2 \\rangle - \\langle -2, 4 \\rangle = \\langle 4, -2 \\rangle$，$\\langle 6, 0 \\rangle - \\langle 2, 2 \\rangle = \\langle 4, -2 \\rangle$，两半相等。\n\n> **注意。** 中点是和的一半。$\\mathbf{a} + \\mathbf{b}$ 本身是以 $OA$、$OB$ 为边的平行四边形的第四个顶点，而 $\\tfrac{1}{2}(\\mathbf{b} - \\mathbf{a})$ 只是从 $A$ 到 $M$ 的一步。",
      ),
      generate(rng) {
        const letters = ["A", "B", "C", "D", "P", "Q", "R", "S"];
        const p1 = rng.pick(letters);
        let p2 = rng.pick(letters);
        while (p2 === p1) p2 = rng.pick(letters);

        const a = `\\mathbf{${p1.toLowerCase()}}`;
        const b = `\\mathbf{${p2.toLowerCase()}}`;

        return oneOf(
          rng,
          t(
            `Let $O$ be the origin, with position vectors $\\vec{O${p1}} = ${a}$ and $\\vec{O${p2}} = ${b}$. Express the position vector $\\vec{OM}$ of the midpoint $M$ of segment $${p1}${p2}$ in terms of $${a}$ and $${b}$.`,
            `设 $O$ 为原点，已知位置向量 $\\vec{O${p1}} = ${a}$，$\\vec{O${p2}} = ${b}$。用 $${a}$ 和 $${b}$ 表示线段 $${p1}${p2}$ 的中点 $M$ 的位置向量 $\\vec{OM}$。`,
          ),
          t(`$\\frac{1}{2}${a} + \\frac{1}{2}${b}$`, `$\\frac{1}{2}${a} + \\frac{1}{2}${b}$`),
          [
            t(`$${a} + ${b}$`, `$${a} + ${b}$`),
            t(`$\\frac{1}{2}${a} - \\frac{1}{2}${b}$`, `$\\frac{1}{2}${a} - \\frac{1}{2}${b}$`),
            t(`$2${a} + 2${b}$`, `$2${a} + 2${b}$`),
          ],
          walked(
            [
              [
                ["Write the segment as a vector", "把线段写成向量"],
                t(`Go from $${p1}$ back to $O$ and then to $${p2}$:`, `从 $${p1}$ 回到 $O$，再到 $${p2}$：`),
                [`\\vec{${p1}${p2}} = -${a} + ${b} = ${b} - ${a}`],
              ],
              [
                ["Go halfway along it", "沿它走一半"],
                t(`$M$ is halfway from $${p1}$ to $${p2}$:`, `$M$ 在从 $${p1}$ 到 $${p2}$ 的正中间：`),
                [`\\vec{OM} = ${a} + \\frac{1}{2}(${b} - ${a}) = \\frac{1}{2}${a} + \\frac{1}{2}${b}`],
              ],
            ],
            t(
              `Starting from $${p2}$ and going halfway back reaches the same point:\n\n$$${b} + \\frac{1}{2}(${a} - ${b}) = \\frac{1}{2}${a} + \\frac{1}{2}${b}$$`,
              `从 $${p2}$ 出发往回走一半，到达同一点：\n\n$$${b} + \\frac{1}{2}(${a} - ${b}) = \\frac{1}{2}${a} + \\frac{1}{2}${b}$$`,
            ),
          ),
          [
            why(
              same(`$${a} + ${b}$`),
              `This is twice $\\vec{OM}$, the fourth corner of the parallelogram on $O${p1}$ and $O${p2}$.`,
              `这是 $\\vec{OM}$ 的两倍，即以 $O${p1}$、$O${p2}$ 为边的平行四边形的第四个顶点。`,
            ),
            why(
              t(`$\\frac{1}{2}${a} - \\frac{1}{2}${b}$`, ""),
              `This is half of $\\vec{${p2}${p1}}$, a step along the segment, not a position on it.`,
              `这是 $\\vec{${p2}${p1}}$ 的一半，是沿线段的一步，不是线段上的位置。`,
            ),
            why(
              same(`$2${a} + 2${b}$`),
              "This is four times $\\vec{OM}$; the two position vectors are averaged, not doubled.",
              "这是 $\\vec{OM}$ 的四倍；两个位置向量要取平均，而不是加倍。",
            ),
          ],
        );
      },
    },
    {
      id: "section-formula-position-vector",
      title: t("Position vector dividing a segment in a given ratio", "定比分点的位置向量"),
      explanation: t(
        "If a point $P$ divides the directed line segment $AB$ internally in the ratio $m : n$ (that is, $AP : PB = m : n$), its position vector with respect to origin $O$ is given by the **section formula**:\n\n$$\\vec{OP} = \\frac{n\\vec{OA} + m\\vec{OB}}{m + n}$$\n\nFor $AP : PB = 1 : 2$: $P$ is $1/3$ of the way from $A$ to $B$, so $\\vec{OP} = \\mathbf{a} + \\tfrac{1}{3}(\\mathbf{b} - \\mathbf{a}) = \\tfrac{2}{3}\\mathbf{a} + \\tfrac{1}{3}\\mathbf{b}$. Check: the coefficients add to $1$, and $P$ is nearer $A$, so $\\mathbf{a}$ has the larger coefficient.\n\n> **Watch out.** Each endpoint takes the part of the ratio next to the other endpoint: in $\\frac{n\\mathbf{a} + m\\mathbf{b}}{m + n}$ the $n$ of $PB$ goes with $\\mathbf{a}$.",
        "若点 $P$ 内分有向线段 $AB$，使得 $AP : PB = m : n$，则其相对于原点 $O$ 的位置向量由**定比分点公式**给出：\n\n$$\\vec{OP} = \\frac{n\\vec{OA} + m\\vec{OB}}{m + n}$$\n\n对 $AP : PB = 1 : 2$：$P$ 在从 $A$ 到 $B$ 的 $1/3$ 处，所以 $\\vec{OP} = \\mathbf{a} + \\tfrac{1}{3}(\\mathbf{b} - \\mathbf{a}) = \\tfrac{2}{3}\\mathbf{a} + \\tfrac{1}{3}\\mathbf{b}$。检验：系数之和为 $1$，且 $P$ 离 $A$ 较近，所以 $\\mathbf{a}$ 的系数较大。\n\n> **注意。** 每个端点取比中靠近另一个端点的那一份：在 $\\frac{n\\mathbf{a} + m\\mathbf{b}}{m + n}$ 中，$PB$ 的 $n$ 配 $\\mathbf{a}$。",
      ),
      generate(rng) {
        const pointPairs = [
          { p1: "A", p2: "B", a: "\\mathbf{a}", b: "\\mathbf{b}" },
          { p1: "P", p2: "Q", a: "\\mathbf{p}", b: "\\mathbf{q}" },
          { p1: "C", p2: "D", a: "\\mathbf{c}", b: "\\mathbf{d}" },
          { p1: "M", p2: "N", a: "\\mathbf{m}", b: "\\mathbf{n}" },
          { p1: "X", p2: "Y", a: "\\mathbf{u}", b: "\\mathbf{v}" },
        ];
        const { p1, p2, a, b } = rng.pick(pointPairs)!;

        const ratios = [
          { m: 1, n: 2 },
          { m: 2, n: 1 },
          { m: 1, n: 3 },
          { m: 3, n: 1 },
          { m: 2, n: 3 },
          { m: 3, n: 2 },
          { m: 1, n: 4 },
          { m: 4, n: 1 },
          { m: 2, n: 5 },
          { m: 5, n: 2 },
          { m: 3, n: 4 },
          { m: 4, n: 3 },
          { m: 1, n: 5 },
          { m: 5, n: 1 },
          { m: 3, n: 5 },
          { m: 5, n: 3 },
        ];
        const { m, n } = rng.pick(ratios);
        const sum = m + n;

        const divPt = rng.pick(["K", "R", "T", "S", "W"]);

        const rightAns = `\\frac{${n}}{${sum}}${a} + \\frac{${m}}{${sum}}${b}`;
        const swappedAns = `\\frac{${m}}{${sum}}${a} + \\frac{${n}}{${sum}}${b}`;
        const wrong1 = `\\frac{${m}}{${sum}}${a} - \\frac{${n}}{${sum}}${b}`;
        const wrong2 = `${m === 1 ? "" : m}${a} + ${n === 1 ? "" : n}${b}`;

        return oneOf(
          rng,
          t(
            `Point $${divPt}$ lies on segment $${p1}${p2}$ such that $${p1}${divPt} : ${divPt}${p2} = ${m} : ${n}$. If $\\vec{O${p1}} = ${a}$ and $\\vec{O${p2}} = ${b}$, express $\\vec{O${divPt}}$ in terms of $${a}$ and $${b}$.`,
            `点 $${divPt}$ 在线段 $${p1}${p2}$ 上，满足 $${p1}${divPt} : ${divPt}${p2} = ${m} : ${n}$。若 $\\vec{O${p1}} = ${a}$，$\\vec{O${p2}} = ${b}$，用 $${a}$ 和 $${b}$ 表示 $\\vec{O${divPt}}$。`,
          ),
          t(`$${rightAns}$`, `$${rightAns}$`),
          [t(`$${swappedAns}$`, `$${swappedAns}$`), t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`)],
          walked(
            [
              [
                ["Write the segment as a vector", "把线段写成向量"],
                t(`Go from $${p1}$ back to $O$ and then to $${p2}$:`, `从 $${p1}$ 回到 $O$，再到 $${p2}$：`),
                [`\\vec{${p1}${p2}} = ${b} - ${a}`],
              ],
              [
                ["Walk to the point", "走到分点"],
                t(
                  `The ratio $${m} : ${n}$ cuts the segment into ${sum} equal parts, and $${divPt}$ is ${m} of them from $${p1}$:`,
                  `比 $${m} : ${n}$ 把线段分成 ${sum} 等份，$${divPt}$ 离 $${p1}$ 有 ${m} 份：`,
                ),
                [`\\vec{O${divPt}} = ${a} + \\frac{${m}}{${sum}}(${b} - ${a}) = ${rightAns}`],
              ],
            ],
            t(
              `A point on the segment has coefficients that add to $1$, and these do:\n\n$$\\frac{${n}}{${sum}} + \\frac{${m}}{${sum}} = 1$$\n\nThe larger coefficient belongs to $${m < n ? a : b}$, and $${divPt}$ is nearer $${m < n ? p1 : p2}$, as the ratio $${m} : ${n}$ says.`,
              `线段上的点的系数之和为 $1$，这里正是如此：\n\n$$\\frac{${n}}{${sum}} + \\frac{${m}}{${sum}} = 1$$\n\n较大的系数属于 $${m < n ? a : b}$，而 $${divPt}$ 离 $${m < n ? p1 : p2}$ 较近，与比 $${m} : ${n}$ 一致。`,
            ),
          ),
          [
            why(
              same(`$${swappedAns}$`),
              `The fractions are swapped: each end takes the share of the part on the far side of $${divPt}$, so $${a}$ gets $${n}/${sum}$.`,
              `两个分数对调了：每个端点取 $${divPt}$ 另一侧那一段的份额，所以 $${a}$ 的系数是 $${n}/${sum}$。`,
            ),
            why(
              same(`$${wrong1}$`),
              `This swaps the fractions and subtracts; expanding $${a} + k(${b} - ${a})$ gives two positive coefficients that add to $1$.`,
              `这把分数对调了，还用了减号；展开 $${a} + k(${b} - ${a})$ 得到两个和为 $1$ 的正系数。`,
            ),
            why(
              same(`$${wrong2}$`),
              `The ratio numbers are not the coefficients; they are divided by the whole, ${sum}, and each goes to the opposite end.`,
              `比的数不是系数；要除以总份数 ${sum}，并且各自配给另一端。`,
            ),
          ],
        );
      },
    },
  ],
};

// ─── 5.17.1 Two-Dimensional Vectors Expressed in Component Form ─────────────

/** twoDimensionalVectorsExpressedInComponentForm covers coordinates and standard basis. */
export const twoDimensionalVectorsExpressedInComponentForm: TopicDef = {
  id: "two-dimensional-vectors-expressed-in-component-form",
  title: t("Two-Dimensional Vectors Expressed in Component Form", "二维向量的坐标表示"),
  summary: t(
    "Represent 2D vectors in component form ⟨x, y⟩ and standard basis form xi + yj from initial and terminal coordinates.",
    "根据起点和终点坐标，将二维向量表示为坐标分量形式 ⟨x, y⟩ 或标准基底形式 xi + yj。",
  ),
  prerequisites: ["describing-the-position-vector-of-a-point-using-known-vectors"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.1", "CCSS.HSN.VM.A.2"],
  knowledgePoints: [
    {
      id: "vector-from-two-points",
      title: t("Find component form from initial and terminal points", "由起点与终点坐标求向量的坐标分量"),
      explanation: t(
        "For a directed line segment with initial point $A(x_1, y_1)$ and terminal point $B(x_2, y_2)$, the component form of vector $\\vec{AB}$ is obtained by subtracting initial coordinates from terminal coordinates:\n\n$$\\vec{AB} = \\langle x_2 - x_1,\\, y_2 - y_1 \\rangle$$",
        "对于起点为 $A(x_1, y_1)$、终点为 $B(x_2, y_2)$ 的有向线段，向量 $\\vec{AB}$ 的坐标分量形式由终点坐标减去起点坐标得到：\n\n$$\\vec{AB} = \\langle x_2 - x_1,\\, y_2 - y_1 \\rangle$$",
      ),
      generate(rng) {
        const x1 = rng.pick([-8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 8]);
        const y1 = rng.pick([-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7]);
        const dx = rng.pick([-9, -7, -5, -4, -3, -2, 2, 3, 4, 5, 7, 9]);
        const dy = rng.pick([-8, -6, -4, -3, -2, 2, 3, 4, 6, 8]);
        const x2 = x1 + dx;
        const y2 = y1 + dy;

        return pointProblem({
          prompt: t(
            `Find the component form $\\langle x, y \\rangle$ of the vector $\\vec{AB}$ given initial point $A(${x1}, ${y1})$ and terminal point $B(${x2}, ${y2})$.`,
            `已知起点 $A(${x1}, ${y1})$ 与终点 $B(${x2}, ${y2})$，求向量 $\\vec{AB}$ 的坐标分量形式 $\\langle x, y \\rangle$。`,
          ),
          vector: true,
          answer: [dx, dy],
          wrong: [
            [-dx, -dy],
            [x1 + x2, y1 + y2],
            [dy, dx],
          ],
          solution: t(
            `Subtract initial point coordinates from terminal point coordinates: $\\vec{AB} = \\langle ${x2} - ${paren(x1)},\\, ${y2} - ${paren(y1)} \\rangle = \\langle ${dx}, ${dy} \\rangle$.`,
            `终点坐标减去起点坐标：$\\vec{AB} = \\langle ${x2} - ${paren(x1)},\\, ${y2} - ${paren(y1)} \\rangle = \\langle ${dx}, ${dy} \\rangle$。`,
          ),
        });
      },
    },
    {
      id: "component-and-standard-basis-forms",
      title: t("Convert between component form and standard basis form", "分量形式与标准基底形式之间的转换"),
      explanation: t(
        "A 2D vector in component form $\\mathbf{v} = \\langle x, y \\rangle$ can be written uniquely as a linear combination of the standard unit basis vectors $\\mathbf{i} = \\langle 1, 0 \\rangle$ and $\\mathbf{j} = \\langle 0, 1 \\rangle$:\n\n$$\\mathbf{v} = x\\mathbf{i} + y\\mathbf{j}$$",
        "二维向量的坐标形式 $\\mathbf{v} = \\langle x, y \\rangle$ 可以唯一表示为标准单位基底向量 $\\mathbf{i} = \\langle 1, 0 \\rangle$ 和 $\\mathbf{j} = \\langle 0, 1 \\rangle$ 的线性组合：\n\n$$\\mathbf{v} = x\\mathbf{i} + y\\mathbf{j}$$",
      ),
      generate(rng) {
        const x = rng.pick([-9, -7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7, 9]);
        const y = rng.pick([-8, -6, -5, -3, -2, -1, 1, 2, 3, 5, 6, 8]);

        const fmtBasis = (a: number, b: number) => poly([a, "\\mathbf{i}"], [b, "\\mathbf{j}"]);

        const ansBasis = fmtBasis(x, y);
        const wrong1 = fmtBasis(x, -y);
        const wrong2 = fmtBasis(y, x);
        const wrong3 = fmtBasis(-x, -y);

        return oneOf(
          rng,
          t(
            `Express the vector $\\mathbf{v} = \\langle ${x}, ${y} \\rangle$ in terms of the standard unit basis vectors $\\mathbf{i}$ and $\\mathbf{j}$.`,
            `用标准单位基底向量 $\\mathbf{i}$ 和 $\\mathbf{j}$ 表示向量 $\\mathbf{v} = \\langle ${x}, ${y} \\rangle$。`,
          ),
          t(`$${ansBasis}$`, `$${ansBasis}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Since $\\mathbf{v} = \\langle x, y \\rangle = x\\mathbf{i} + y\\mathbf{j}$, substituting $x = ${x}$ and $y = ${y}$ yields $${ansBasis}$.`,
            `因为 $\\mathbf{v} = \\langle x, y \\rangle = x\\mathbf{i} + y\\mathbf{j}$，代入 $x = ${x}$ 和 $y = ${y}$ 得 $${ansBasis}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.17.2 Addition and Scalar Multiplication in 2D ────────────────────────

/** additionAndScalarMultiplicationOfCartesianVectorsIn2d covers Cartesian vector arithmetic. */
export const additionAndScalarMultiplicationOfCartesianVectorsIn2d: TopicDef = {
  id: "addition-and-scalar-multiplication-of-cartesian-vectors-in-2d",
  title: t("Addition and Scalar Multiplication of Cartesian Vectors in 2D", "二维平面向量的加法与数乘运算"),
  summary: t(
    "Perform vector addition, subtraction, and scalar multiplication algebraically using Cartesian coordinates.",
    "利用直角坐标代数计算二维向量的加法、减法和数乘运算。",
  ),
  prerequisites: ["two-dimensional-vectors-expressed-in-component-form"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.VM.B.4", "CCSS.HSN.VM.B.5"],
  knowledgePoints: [
    {
      id: "add-and-subtract-cartesian-vectors",
      title: t("Add and subtract 2D Cartesian vectors", "二维直角坐标向量的加减运算"),
      explanation: t(
        "Vectors in component form are added and subtracted one component at a time: the $x$-components together and the $y$-components together.\n\nFor vectors $\\mathbf{u} = \\langle u_1, u_2 \\rangle$ and $\\mathbf{v} = \\langle v_1, v_2 \\rangle$:\n\n$$\\mathbf{u} + \\mathbf{v} = \\langle u_1 + v_1,\\, u_2 + v_2 \\rangle$$\n\n$$\\mathbf{u} - \\mathbf{v} = \\langle u_1 - v_1,\\, u_2 - v_2 \\rangle$$",
        "用分量表示的向量相加减时，逐个分量进行：$x$ 分量与 $x$ 分量运算，$y$ 分量与 $y$ 分量运算。\n\n对于向量 $\\mathbf{u} = \\langle u_1, u_2 \\rangle$ 和 $\\mathbf{v} = \\langle v_1, v_2 \\rangle$：\n\n$$\\mathbf{u} + \\mathbf{v} = \\langle u_1 + v_1,\\, u_2 + v_2 \\rangle$$\n\n$$\\mathbf{u} - \\mathbf{v} = \\langle u_1 - v_1,\\, u_2 - v_2 \\rangle$$",
      ),
      generate(rng) {
        const u1 = rng.pick([-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7]);
        const u2 = rng.pick([-6, -5, -3, -2, 2, 3, 5, 6]);
        const v1 = rng.pick([-8, -6, -4, -2, 1, 3, 5, 7]);
        const v2 = rng.pick([-7, -4, -1, 1, 4, 7]);

        const isAdd = rng.pick([true, false]);
        const rx = isAdd ? u1 + v1 : u1 - v1;
        const ry = isAdd ? u2 + v2 : u2 - v2;

        const opSymbol = isAdd ? "+" : "-";

        return pointProblem({
          prompt: t(
            `Given $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ and $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$, calculate $\\mathbf{u} ${opSymbol} \\mathbf{v}$. Write your answer in component form $\\langle x, y \\rangle$.`,
            `已知 $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ 且 $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$，计算 $\\mathbf{u} ${opSymbol} \\mathbf{v}$。请用坐标分量形式 $\\langle x, y \\rangle$ 作答。`,
          ),
          vector: true,
          answer: [rx, ry],
          wrong: [
            [isAdd ? u1 - v1 : u1 + v1, isAdd ? u2 - v2 : u2 + v2],
            [rx, -ry],
            [ry, rx],
          ],
          solution: t(
            `Combine corresponding components: $\\mathbf{u} ${opSymbol} \\mathbf{v} = \\langle ${u1} ${opSymbol} ${paren(v1)},\\, ${u2} ${opSymbol} ${paren(v2)} \\rangle = \\langle ${rx}, ${ry} \\rangle$.`,
            `对应分量分别进行运算：$\\mathbf{u} ${opSymbol} \\mathbf{v} = \\langle ${u1} ${opSymbol} ${paren(v1)},\\, ${u2} ${opSymbol} ${paren(v2)} \\rangle = \\langle ${rx}, ${ry} \\rangle$。`,
          ),
        });
      },
    },
    {
      id: "scalar-multiplication-and-linear-combination-2d",
      title: t("Scalar multiplication and linear combinations in 2D", "二维向量的数乘与线性组合"),
      explanation: t(
        "A scalar stretches or shrinks a vector, and a negative scalar also reverses it. Each component is multiplied by the scalar.\n\nMultiplying vector $\\mathbf{v} = \\langle x, y \\rangle$ by scalar $k$ yields $k\\mathbf{v} = \\langle kx, ky \\rangle$.\n\nA linear combination is computed component-wise:\n\n$$a\\mathbf{u} + b\\mathbf{v} = \\langle a u_1 + b v_1,\\, a u_2 + b v_2 \\rangle$$",
        "标量会把向量拉长或缩短，负的标量还会把它反向。每个分量都乘这个标量。\n\n标量 $k$ 乘以向量 $\\mathbf{v} = \\langle x, y \\rangle$ 得 $k\\mathbf{v} = \\langle kx, ky \\rangle$。\n\n线性组合按分量分别计算：\n\n$$a\\mathbf{u} + b\\mathbf{v} = \\langle a u_1 + b v_1,\\, a u_2 + b v_2 \\rangle$$",
      ),
      generate(rng) {
        const a = rng.pick([2, 3, 4, -2, -3]);
        const b = rng.pick([2, 3, -2, -3]);
        const u1 = rng.pick([-4, -3, -2, 1, 2, 3, 4]);
        const u2 = rng.pick([-3, -1, 1, 2, 3]);
        const v1 = rng.pick([-3, -2, 1, 2, 3]);
        const v2 = rng.pick([-4, -2, 1, 2, 4]);

        const rx = a * u1 + b * v1;
        const ry = a * u2 + b * v2;

        const bSignStr = b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`;

        return pointProblem({
          prompt: t(
            `Given $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ and $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$, evaluate the linear combination $${a}\\mathbf{u} ${bSignStr}\\mathbf{v}$. Write your answer in component form $\\langle x, y \\rangle$.`,
            `已知 $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ 且 $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$，计算线性组合 $${a}\\mathbf{u} ${bSignStr}\\mathbf{v}$。请用坐标分量形式 $\\langle x, y \\rangle$ 作答。`,
          ),
          vector: true,
          answer: [rx, ry],
          wrong: [
            [rx + 1, ry - 1],
            [a * u1 - b * v1, a * u2 - b * v2],
            [ry, rx],
          ],
          solution: t(
            `Compute each component: $x = ${a}(${u1}) ${b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`}(${v1}) = ${rx}$, and $y = ${a}(${u2}) ${b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`}(${v2}) = ${ry}$, giving $\\langle ${rx}, ${ry} \\rangle$.`,
            `分别计算各分量：$x = ${a}(${u1}) ${b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`}(${v1}) = ${rx}$，$y = ${a}(${u2}) ${b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`}(${v2}) = ${ry}$，得到 $\\langle ${rx}, ${ry} \\rangle$。`,
          ),
        });
      },
    },
  ],
};

// ─── 5.17.3 Calculating the Magnitude of Cartesian Vectors in 2D ────────────

/** calculatingTheMagnitudeOfCartesianVectorsIn2d covers vector length via the Pythagorean theorem. */
export const calculatingTheMagnitudeOfCartesianVectorsIn2d: TopicDef = {
  id: "calculating-the-magnitude-of-cartesian-vectors-in-2d",
  title: t("Calculating the Magnitude of Cartesian Vectors in 2D", "计算二维平面向量的模长"),
  summary: t(
    "Calculate the magnitude (length) of a Cartesian vector in 2D using the Pythagorean formula.",
    "利用勾股定理计算二维直角坐标向量的模长（长度）。",
  ),
  prerequisites: ["addition-and-scalar-multiplication-of-cartesian-vectors-in-2d"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.1", "CCSS.HSN.VM.A.2"],
  knowledgePoints: [
    {
      id: "magnitude-of-component-vector",
      title: t("Magnitude of a vector in component form", "坐标形式向量的模长"),
      explanation: t(
        "By the Pythagorean theorem, the **magnitude** of vector $\\mathbf{v} = \\langle x, y \\rangle$ is the distance from the origin to $(x, y)$:\n\n$$\\|\\mathbf{v}\\| = \\sqrt{x^2 + y^2}$$",
        "由勾股定理，向量 $\\mathbf{v} = \\langle x, y \\rangle$ 的**模长**是原点到点 $(x, y)$ 的距离：\n\n$$\\|\\mathbf{v}\\| = \\sqrt{x^2 + y^2}$$",
      ),
      generate(rng) {
        const triples = [
          { a: 3, b: 4, c: 5 },
          { a: 4, b: 3, c: 5 },
          { a: 6, b: 8, c: 10 },
          { a: 8, b: 6, c: 10 },
          { a: 5, b: 12, c: 13 },
          { a: 12, b: 5, c: 13 },
          { a: 9, b: 12, c: 15 },
          { a: 12, b: 9, c: 15 },
          { a: 8, b: 15, c: 17 },
          { a: 15, b: 8, c: 17 },
          { a: 12, b: 16, c: 20 },
          { a: 16, b: 12, c: 20 },
          { a: 7, b: 24, c: 25 },
          { a: 24, b: 7, c: 25 },
          { a: 15, b: 20, c: 25 },
          { a: 20, b: 15, c: 25 },
          { a: 10, b: 24, c: 26 },
          { a: 24, b: 10, c: 26 },
          { a: 20, b: 21, c: 29 },
          { a: 21, b: 20, c: 29 },
          { a: 9, b: 40, c: 41 },
          { a: 40, b: 9, c: 41 },
          { a: 12, b: 35, c: 37 },
          { a: 35, b: 12, c: 37 },
        ];
        const triple = rng.pick(triples);
        const sx = rng.pick([1, -1]);
        const sy = rng.pick([1, -1]);
        const x = sx * triple.a;
        const y = sy * triple.b;
        const ans = triple.c;

        const wrong1 = ans + 2;
        const wrong2 = Math.abs(x) + Math.abs(y);
        const wrong3 = Math.max(1, ans - 2);

        return numberProblem({
          prompt: t(
            `Find the magnitude of the vector $\\mathbf{v} = \\langle ${x}, ${y} \\rangle$.`,
            `求向量 $\\mathbf{v} = \\langle ${x}, ${y} \\rangle$ 的模长。`,
          ),
          answer: ans,
          wrong: [wrong1, wrong2, wrong3],
          solution: t(
            `Using the magnitude formula: $\\|\\mathbf{v}\\| = \\sqrt{(${x})^2 + (${y})^2} = \\sqrt{${x * x + y * y}} = ${ans}$.`,
            `由模长公式：$\\|\\mathbf{v}\\| = \\sqrt{(${x})^2 + (${y})^2} = \\sqrt{${x * x + y * y}} = ${ans}$。`,
          ),
        });
      },
    },
    {
      id: "magnitude-of-linear-combination",
      title: t("Magnitude of a sum or scaled vector", "和向量或数乘向量的模长"),
      explanation: t(
        "To find the magnitude of a linear combination such as $\\|\\mathbf{u} + \\mathbf{v}\\|$, first calculate the component coordinates of the resulting vector, then apply $\\|\\mathbf{w}\\| = \\sqrt{w_1^2 + w_2^2}$.",
        "求和向量或线性组合的模长（如 $\\|\\mathbf{u} + \\mathbf{v}\\|$），先计算出合向量的坐标分量，再应用公式 $\\|\\mathbf{w}\\| = \\sqrt{w_1^2 + w_2^2}$。",
      ),
      generate(rng) {
        const pairs = [
          { u1: 1, u2: 2, v1: 2, v2: 2, s1: 3, s2: 4, mag: 5 },
          { u1: 2, u2: 1, v1: 1, v2: 3, s1: 3, s2: 4, mag: 5 },
          { u1: -1, u2: 3, v1: 4, v2: 1, s1: 3, s2: 4, mag: 5 },
          { u1: 5, u2: 1, v1: -2, v2: 3, s1: 3, s2: 4, mag: 5 },
          { u1: 6, u2: 2, v1: -2, v2: 1, s1: 4, s2: 3, mag: 5 },
          { u1: 0, u2: 4, v1: 3, v2: 0, s1: 3, s2: 4, mag: 5 },
          { u1: -4, u2: 1, v1: 1, v2: 3, s1: -3, s2: 4, mag: 5 },
          { u1: 2, u2: -1, v1: 2, v2: -2, s1: 4, s2: -3, mag: 5 },
          { u1: 2, u2: 3, v1: 1, v2: 1, s1: 3, s2: 4, mag: 5 },
          { u1: 5, u2: 3, v1: -2, v2: 1, s1: 3, s2: 4, mag: 5 },
          { u1: 4, u2: 1, v1: 2, v2: 7, s1: 6, s2: 8, mag: 10 },
          { u1: 3, u2: 5, v1: 3, v2: 3, s1: 6, s2: 8, mag: 10 },
          { u1: 1, u2: 4, v1: 5, v2: 4, s1: 6, s2: 8, mag: 10 },
          { u1: 1, u2: 1, v1: 5, v2: 7, s1: 6, s2: 8, mag: 10 },
          { u1: -2, u2: 3, v1: -4, v2: 5, s1: -6, s2: 8, mag: 10 },
          { u1: 5, u2: 2, v1: 3, v2: 4, s1: 8, s2: 6, mag: 10 },
          { u1: 7, u2: 1, v1: 1, v2: 5, s1: 8, s2: 6, mag: 10 },
          { u1: -2, u2: 5, v1: 7, v2: 7, s1: 5, s2: 12, mag: 13 },
          { u1: 1, u2: 8, v1: 4, v2: 4, s1: 5, s2: 12, mag: 13 },
          { u1: 2, u2: 6, v1: 3, v2: 6, s1: 5, s2: 12, mag: 13 },
          { u1: 3, u2: 2, v1: 2, v2: 10, s1: 5, s2: 12, mag: 13 },
          { u1: 8, u2: 5, v1: -3, v2: 7, s1: 5, s2: 12, mag: 13 },
          { u1: 10, u2: 3, v1: 2, v2: 2, s1: 12, s2: 5, mag: 13 },
          { u1: 7, u2: 1, v1: 5, v2: 4, s1: 12, s2: 5, mag: 13 },
          { u1: 3, u2: -1, v1: 5, v2: 16, s1: 8, s2: 15, mag: 17 },
          { u1: 4, u2: 7, v1: 4, v2: 8, s1: 8, s2: 15, mag: 17 },
          { u1: 2, u2: 5, v1: 6, v2: 10, s1: 8, s2: 15, mag: 17 },
          { u1: 10, u2: 3, v1: 5, v2: 5, s1: 15, s2: 8, mag: 17 },
          { u1: 11, u2: 2, v1: 4, v2: 6, s1: 15, s2: 8, mag: 17 },
          { u1: 5, u2: 4, v1: 4, v2: 8, s1: 9, s2: 12, mag: 15 },
          { u1: 6, u2: 5, v1: 3, v2: 7, s1: 9, s2: 12, mag: 15 },
          { u1: 8, u2: 3, v1: 4, v2: 6, s1: 12, s2: 9, mag: 15 },
          { u1: -1, u2: 10, v1: 8, v2: 14, s1: 7, s2: 24, mag: 25 },
          { u1: 5, u2: 12, v1: 2, v2: 12, s1: 7, s2: 24, mag: 25 },
          { u1: 4, u2: 9, v1: 3, v2: 15, s1: 7, s2: 24, mag: 25 },
          { u1: 15, u2: 4, v1: 9, v2: 3, s1: 24, s2: 7, mag: 25 },
          { u1: 10, u2: 2, v1: 14, v2: 5, s1: 24, s2: 7, mag: 25 },
          { u1: 8, u2: 10, v1: 4, v2: 6, s1: 12, s2: 16, mag: 20 },
          { u1: 9, u2: 7, v1: 7, v2: 5, s1: 16, s2: 12, mag: 20 },
          { u1: 6, u2: 14, v1: 4, v2: 10, s1: 10, s2: 24, mag: 26 },
        ];
        const item = rng.pick(pairs);
        const { u1, u2, v1, v2, s1, s2, mag } = item;

        const wrong1 = mag + 2;
        const wrong2 = Math.abs(s1) + Math.abs(s2);
        const wrong3 = Math.max(1, mag - 2);

        return numberProblem({
          prompt: t(
            `Given $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ and $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$, find the magnitude of their sum, $\\|\\mathbf{u} + \\mathbf{v}\\|$.`,
            `已知 $\\mathbf{u} = \\langle ${u1}, ${u2} \\rangle$ 且 $\\mathbf{v} = \\langle ${v1}, ${v2} \\rangle$，求它们的和向量模长 $\\|\\mathbf{u} + \\mathbf{v}\\|$。`,
          ),
          answer: mag,
          wrong: [wrong1, wrong2, wrong3],
          solution: t(
            `First add the vectors: $\\mathbf{u} + \\mathbf{v} = \\langle ${u1} + ${paren(v1)},\\, ${u2} + ${paren(v2)} \\rangle = \\langle ${s1}, ${s2} \\rangle$. Then compute magnitude: $\\sqrt{(${s1})^2 + (${s2})^2} = ${mag}$.`,
            `首先计算向量之和：$\\mathbf{u} + \\mathbf{v} = \\langle ${u1} + ${paren(v1)},\\, ${u2} + ${paren(v2)} \\rangle = \\langle ${s1}, ${s2} \\rangle$。然后计算模长：$\\sqrt{(${s1})^2 + (${s2})^2} = ${mag}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 5.17.4 Calculating the Direction of Cartesian Vectors in 2D ────────────

/** calculatingTheDirectionOfCartesianVectorsIn2d covers quadrant-aware direction angles. */
export const calculatingTheDirectionOfCartesianVectorsIn2d: TopicDef = {
  id: "calculating-the-direction-of-cartesian-vectors-in-2d",
  title: t("Calculating the Direction of Cartesian Vectors in 2D", "计算二维平面向量的方向角"),
  summary: t(
    "Determine the direction angle θ ∈ [0°, 360°) of a 2D vector from its Cartesian components using inverse tangent and quadrant analysis.",
    "利用反正切函数与象限分析，由二维向量的坐标分量计算其方向角 θ ∈ [0°, 360°)。",
  ),
  prerequisites: ["calculating-the-magnitude-of-cartesian-vectors-in-2d"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.1"],
  knowledgePoints: [
    {
      id: "direction-angle-quadrant-i-and-axes",
      figure: precalculusDrawings4["calculating-the-direction-of-cartesian-vectors-in-2d#direction-angle-quadrant-i-and-axes"],
      title: t("Direction angle on coordinate axes and Quadrant I", "坐标轴上及第一象限向量的方向角"),
      explanation: t(
        "The **direction angle** $\\theta \\in [0^\\circ, 360^\\circ)$ of vector $\\mathbf{v} = \\langle x, y \\rangle$ is measured counterclockwise from the positive $x$-axis.\n\n- Along axes: $\\langle c, 0 \\rangle$ has $\\theta = 0^\\circ$ ($c > 0$) or $180^\\circ$ ($c < 0$); $\\langle 0, c \\rangle$ has $\\theta = 90^\\circ$ ($c > 0$) or $270^\\circ$ ($c < 0$).\n- In Quadrant I ($x > 0, y > 0$): $\\theta = \\arctan\\left(\\frac{y}{x}\\right)$.",
        "向量 $\\mathbf{v} = \\langle x, y \\rangle$ 的**方向角** $\\theta \\in [0^\\circ, 360^\\circ)$ 是从正 $x$ 轴逆时针测量的角度。\n\n- 在坐标轴上：$\\langle c, 0 \\rangle$ 的方向角为 $0^\\circ$（$c > 0$）或 $180^\\circ$（$c < 0$）；$\\langle 0, c \\rangle$ 的方向角为 $90^\\circ$（$c > 0$）或 $270^\\circ$（$c < 0$）。\n- 在第一象限（$x > 0, y > 0$）：$\\theta = \\arctan\\left(\\frac{y}{x}\\right)$。",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        const kSurd = k === 1 ? "\\sqrt{3}" : `${k}\\sqrt{3}`;
        const items = [
          { vec: `\\langle ${k}, 0 \\rangle`, theta: 0 },
          { vec: `\\langle 0, ${k} \\rangle`, theta: 90 },
          { vec: `\\langle ${k}, ${k} \\rangle`, theta: 45 },
          { vec: `\\langle ${kSurd}, ${k} \\rangle`, theta: 30 },
          { vec: `\\langle ${k}, ${kSurd} \\rangle`, theta: 60 },
        ];
        const item = rng.pick(items);
        const { vec, theta } = item;

        const wrongAngles = [30, 45, 60, 90, 0].filter((a) => a !== theta).slice(0, 3);

        return numberProblem({
          prompt: t(
            `Find the direction angle $\\theta \\in [0^\\circ, 360^\\circ)$ of the vector $\\mathbf{v} = ${vec}$.`,
            `求向量 $\\mathbf{v} = ${vec}$ 的方向角 $\\theta \\in [0^\\circ, 360^\\circ)$。`,
          ),
          answer: theta,
          unit: "°",
          form: "integer",
          wrong: wrongAngles,
          solution: t(
            `The vector lies ${theta % 90 === 0 ? "on a positive coordinate axis" : "in Quadrant I"}. Using $\\tan\\theta = y/x$, we obtain $\\theta = ${theta}^\\circ$.`,
            `该向量位于${theta % 90 === 0 ? "正坐标轴上" : "第一象限"}。由 $\\tan\\theta = y/x$ 求得 $\\theta = ${theta}^\\circ$。`,
          ),
        });
      },
    },
    {
      id: "direction-angle-all-quadrants",
      figure: precalculusDrawings2["calculating-the-direction-of-cartesian-vectors-in-2d#direction-angle-all-quadrants"],
      title: t("Direction angle in Quadrants II, III, and IV", "第二、三、四象限向量的方向角"),
      explanation: t(
        "For a vector $\\mathbf{v} = \\langle x, y \\rangle$ outside Quadrant I, first find the reference angle $\\alpha = \\arctan\\left(\\left|\\frac{y}{x}\\right|\\right)$:\n\n- Quadrant II ($x < 0, y > 0$): $\\theta = 180^\\circ - \\alpha$\n- Quadrant III ($x < 0, y < 0$): $\\theta = 180^\\circ + \\alpha$\n- Quadrant IV ($x > 0, y < 0$): $\\theta = 360^\\circ - \\alpha$",
        "对于不在第一象限的向量 $\\mathbf{v} = \\langle x, y \\rangle$，先计算参考角 $\\alpha = \\arctan\\left(\\left|\\frac{y}{x}\\right|\\right)$：\n\n- 第二象限（$x < 0, y > 0$）：$\\theta = 180^\\circ - \\alpha$\n- 第三象限（$x < 0, y < 0$）：$\\theta = 180^\\circ + \\alpha$\n- 第四象限（$x > 0, y < 0$）：$\\theta = 360^\\circ - \\alpha$",
      ),
      generate(rng) {
        const k = rng.pick([1, 2, 3, 4, 5, 6, 7, 8]);
        const kSurd = k === 1 ? "\\sqrt{3}" : `${k}\\sqrt{3}`;
        const cases = [
          // Q2
          { vec: `\\langle -${k}, ${k} \\rangle`, theta: 135, quad: t("in Quadrant II", "第二象限"), ref: 45 },
          { vec: `\\langle -${kSurd}, ${k} \\rangle`, theta: 150, quad: t("in Quadrant II", "第二象限"), ref: 30 },
          { vec: `\\langle -${k}, ${kSurd} \\rangle`, theta: 120, quad: t("in Quadrant II", "第二象限"), ref: 60 },
          { vec: `\\langle -${k}, 0 \\rangle`, theta: 180, quad: t("on the negative $x$-axis", "$x$ 轴负半轴上"), ref: 0 },
          // Q3
          { vec: `\\langle -${k}, -${k} \\rangle`, theta: 225, quad: t("in Quadrant III", "第三象限"), ref: 45 },
          { vec: `\\langle -${kSurd}, -${k} \\rangle`, theta: 210, quad: t("in Quadrant III", "第三象限"), ref: 30 },
          { vec: `\\langle -${k}, -${kSurd} \\rangle`, theta: 240, quad: t("in Quadrant III", "第三象限"), ref: 60 },
          { vec: `\\langle 0, -${k} \\rangle`, theta: 270, quad: t("on the negative $y$-axis", "$y$ 轴负半轴上"), ref: 0 },
          // Q4
          { vec: `\\langle ${k}, -${k} \\rangle`, theta: 315, quad: t("in Quadrant IV", "第四象限"), ref: 45 },
          { vec: `\\langle ${kSurd}, -${k} \\rangle`, theta: 330, quad: t("in Quadrant IV", "第四象限"), ref: 30 },
          { vec: `\\langle ${k}, -${kSurd} \\rangle`, theta: 300, quad: t("in Quadrant IV", "第四象限"), ref: 60 },
        ];
        const pick = rng.pick(cases);
        const { vec, theta, quad, ref } = pick;

        const wrongAngles = [(theta + 180) % 360, ref, (360 - theta + 360) % 360, (theta + 90) % 360]
          .filter((a) => a !== theta)
          .slice(0, 3);

        return numberProblem({
          prompt: t(
            `Find the direction angle $\\theta \\in [0^\\circ, 360^\\circ)$ of the vector $\\mathbf{v} = ${vec}$.`,
            `求向量 $\\mathbf{v} = ${vec}$ 的方向角 $\\theta \\in [0^\\circ, 360^\\circ)$。`,
          ),
          answer: theta,
          unit: "°",
          form: "integer",
          wrong: wrongAngles,
          solution: t(
            `The vector lies ${quad.en}. With reference angle $\\alpha = ${ref}^\\circ$, the standard direction angle is $\\theta = ${theta}^\\circ$.`,
            `该向量位于${quad["zh-CN"]}。参考角为 $\\alpha = ${ref}^\\circ$，因此标准方向角为 $\\theta = ${theta}^\\circ$。`,
          ),
        });
      },
    },
  ],
};

// ─── 5.17.5 Calculating the Components of Cartesian Vectors in 2D ───────────

/** calculatingTheComponentsOfCartesianVectorsIn2d covers resolving magnitude and angle into components. */
export const calculatingTheComponentsOfCartesianVectorsIn2d: TopicDef = {
  id: "calculating-the-components-of-cartesian-vectors-in-2d",
  title: t("Calculating the Components of Cartesian Vectors in 2D", "由模长与方向角计算二维平面向量的分量"),
  summary: t(
    "Find the horizontal and vertical components of a 2D vector given its magnitude and direction angle using trigonometry.",
    "利用三角函数，根据二维向量的模长与方向角求解其水平与垂直坐标分量。",
  ),
  prerequisites: ["calculating-the-direction-of-cartesian-vectors-in-2d"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.1", "CCSS.HSN.VM.A.2"],
  knowledgePoints: [
    {
      id: "components-from-magnitude-and-angle-special",
      figure: precalculusDrawings2["calculating-the-components-of-cartesian-vectors-in-2d#components-from-magnitude-and-angle-special"],
      title: t("Compute components for special angles", "特殊方向角的向量坐标分量计算"),
      explanation: t(
        "A vector's components are the legs of a right triangle whose hypotenuse is the magnitude, so cosine gives the horizontal part and sine the vertical part. Given magnitude $\\|\\mathbf{v}\\| = r$ and direction angle $\\theta$, the components are given by:\n\n$$x = r\\cos\\theta,\\quad y = r\\sin\\theta$$\n\nso $\\mathbf{v} = \\langle r\\cos\\theta,\\, r\\sin\\theta \\rangle$.",
        "向量的分量是以模为斜边的直角三角形的两条直角边，所以余弦给出水平分量，正弦给出竖直分量。已知模长 $\\|\\mathbf{v}\\| = r$ 与方向角 $\\theta$，坐标分量由下列公式给出：\n\n$$x = r\\cos\\theta,\\quad y = r\\sin\\theta$$\n\n即 $\\mathbf{v} = \\langle r\\cos\\theta,\\, r\\sin\\theta \\rangle$。",
      ),
      generate(rng) {
        const r = rng.pick([2, 4, 6, 8, 10, 12]);
        const h = r / 2;
        const hSurd = h === 1 ? "\\sqrt{3}" : `${h}\\sqrt{3}`;
        const angleData = [
          { deg: 0, x: `${r}`, y: "0" },
          { deg: 30, x: `${hSurd}`, y: `${h}` },
          { deg: 60, x: `${h}`, y: `${hSurd}` },
          { deg: 90, x: "0", y: `${r}` },
          { deg: 120, x: `-${h}`, y: `${hSurd}` },
          { deg: 150, x: `-${hSurd}`, y: `${h}` },
          { deg: 180, x: `-${r}`, y: "0" },
          { deg: 210, x: `-${hSurd}`, y: `-${h}` },
          { deg: 240, x: `-${h}`, y: `-${hSurd}` },
          { deg: 270, x: "0", y: `-${r}` },
          { deg: 300, x: `${h}`, y: `-${hSurd}` },
          { deg: 330, x: `${hSurd}`, y: `-${h}` },
        ];
        const item = rng.pick(angleData);
        const ans = `\\langle ${item.x}, ${item.y} \\rangle`;
        const wrong1 = `\\langle ${item.y}, ${item.x} \\rangle`;
        const negX = item.x.startsWith("-") ? item.x.slice(1) : item.x === "0" ? "0" : `-${item.x}`;
        const wrong2 = `\\langle ${negX}, ${item.y} \\rangle`;
        const wrong3 = `\\langle ${r}, ${item.deg} \\rangle`;

        return oneOf(
          rng,
          t(
            `A vector $\\mathbf{v}$ has magnitude $\\|\\mathbf{v}\\| = ${r}$ and direction angle $\\theta = ${item.deg}^\\circ$. Find its component form $\\langle x, y \\rangle$.`,
            `向量 $\\mathbf{v}$ 的模长为 $\\|\\mathbf{v}\\| = ${r}$，方向角为 $\\theta = ${item.deg}^\\circ$。求其坐标分量形式 $\\langle x, y \\rangle$。`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Using $x = ${r}\\cos(${item.deg}^\\circ) = ${item.x}$ and $y = ${r}\\sin(${item.deg}^\\circ) = ${item.y}$, the component form is $${ans}$.`,
            `利用 $x = ${r}\\cos(${item.deg}^\\circ) = ${item.x}$ 和 $y = ${r}\\sin(${item.deg}^\\circ) = ${item.y}$，得坐标分量形式为 $${ans}$。`,
          ),
        );
      },
    },
    {
      id: "components-from-magnitude-and-angle-general",
      title: t("Express vector in terms of standard basis given magnitude and direction", "由模长和方向角用基底向量表示向量"),
      explanation: t(
        "A vector with magnitude $r$ and direction $\\theta$ can be expressed in terms of standard unit basis vectors $\\mathbf{i}$ and $\\mathbf{j}$:\n\n$$\\mathbf{v} = (r\\cos\\theta)\\mathbf{i} + (r\\sin\\theta)\\mathbf{j}$$",
        "模长为 $r$、方向角为 $\\theta$ 的向量可用标准单位基底向量 $\\mathbf{i}$ 和 $\\mathbf{j}$ 表示为：\n\n$$\\mathbf{v} = (r\\cos\\theta)\\mathbf{i} + (r\\sin\\theta)\\mathbf{j}$$",
      ),
      generate(rng) {
        const r = rng.pick([2, 4, 6, 8, 10, 12]);
        const h = r / 2;
        const hSqrt3 = h === 1 ? "\\sqrt{3}" : `${h}\\sqrt{3}`;
        const hSqrt2 = h === 1 ? "\\sqrt{2}" : `${h}\\sqrt{2}`;
        const vName = rng.pick(["\\mathbf{v}", "\\mathbf{u}", "\\mathbf{w}", "\\mathbf{a}"]);
        const angleList = [
          { deg: 30, x: `${hSqrt3}`, y: `${h}` },
          { deg: 45, x: `${hSqrt2}`, y: `${hSqrt2}` },
          { deg: 60, x: `${h}`, y: `${hSqrt3}` },
          { deg: 120, x: `-${h}`, y: `${hSqrt3}` },
          { deg: 135, x: `-${hSqrt2}`, y: `${hSqrt2}` },
          { deg: 150, x: `-${hSqrt3}`, y: `${h}` },
          { deg: 210, x: `-${hSqrt3}`, y: `-${h}` },
          { deg: 225, x: `-${hSqrt2}`, y: `-${hSqrt2}` },
          { deg: 240, x: `-${h}`, y: `-${hSqrt3}` },
          { deg: 300, x: `${h}`, y: `-${hSqrt3}` },
          { deg: 315, x: `${hSqrt2}`, y: `-${hSqrt2}` },
          { deg: 330, x: `${hSqrt3}`, y: `-${h}` },
        ];
        const item = rng.pick(angleList);

        const formatBasis = (xStr: string, yStr: string) => {
          const term = (c: string, unit: string) => {
            if (c === "1") return unit;
            if (c === "-1") return `-${unit}`;
            return `${c}${unit}`;
          };
          const xPart = term(xStr, "\\mathbf{i}");
          let yPart = "";
          if (yStr.startsWith("-")) {
            const absY = yStr.slice(1);
            yPart = ` - ${term(absY, "\\mathbf{j}")}`;
          } else {
            yPart = ` + ${term(yStr, "\\mathbf{j}")}`;
          }
          return `${xPart}${yPart}`;
        };

        const neg = (c: string) => (c.startsWith("-") ? c.slice(1) : `-${c}`);
        const ans = formatBasis(item.x, item.y);
        const wrong1 = formatBasis(item.y, item.x);
        const wrong2 = formatBasis(item.x, neg(item.y));
        const wrong3 = formatBasis(String(r), String(item.deg));

        return oneOf(
          rng,
          t(
            `Express the vector $${vName}$ with magnitude $\\|${vName}\\| = ${r}$ and direction angle $\\theta = ${item.deg}^\\circ$ in terms of standard unit basis vectors $\\mathbf{i}$ and $\\mathbf{j}$.`,
            `已知向量 $${vName}$ 的模长为 $\\|${vName}\\| = ${r}$，方向角为 $\\theta = ${item.deg}^\\circ$，用标准单位基底向量 $\\mathbf{i}$ 和 $\\mathbf{j}$ 表示 $${vName}$。`,
          ),
          t(`$${ans}$`, `$${ans}$`),
          [t(`$${wrong1}$`, `$${wrong1}$`), t(`$${wrong2}$`, `$${wrong2}$`), t(`$${wrong3}$`, `$${wrong3}$`)],
          t(
            `Using $x = ${r}\\cos(${item.deg}^\\circ) = ${item.x}$ and $y = ${r}\\sin(${item.deg}^\\circ) = ${item.y}$, the basis form is $${vName} = ${ans}$.`,
            `由 $x = ${r}\\cos(${item.deg}^\\circ) = ${item.x}$ 与 $y = ${r}\\sin(${item.deg}^\\circ) = ${item.y}$，得基底形式为 $${vName} = ${ans}$。`,
          ),
        );
      },
    },
  ],
};

// ─── 5.17.6 Velocity and Acceleration for Plane Motion ──────────────────────

/** velocityAndAccelerationForPlaneMotion covers speed and resultant velocities in modeling motion. */
export const velocityAndAccelerationForPlaneMotion: TopicDef = {
  id: "velocity-and-acceleration-for-plane-motion",
  title: t("Velocity and Acceleration for Plane Motion", "平面运动的速度与加速度向量"),
  summary: t(
    "Model planar motion using velocity and acceleration vectors, calculate speed as vector magnitude, and find resultant velocities.",
    "使用速度与加速度向量为平面运动建模，将速率计算为速度向量的模长，并求解合速度。",
  ),
  prerequisites: ["calculating-the-components-of-cartesian-vectors-in-2d"],
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.3"],
  knowledgePoints: [
    {
      id: "speed-as-magnitude-of-velocity",
      title: t("Calculate speed from velocity vector components", "由速度向量分量计算速率"),
      explanation: t(
        "Velocity is a vector quantity with magnitude and direction. **Speed** is the scalar magnitude of the velocity vector:\n\n$$\\text{speed} = \\|\\mathbf{v}\\| = \\sqrt{v_x^2 + v_y^2}$$",
        "速度是既有大小又有方向的向量。**速率**是速度向量的标量模长：\n\n$$\\text{速率} = \\|\\mathbf{v}\\| = \\sqrt{v_x^2 + v_y^2}$$",
      ),
      generate(rng) {
        const triples = [
          { vx: 15, vy: 20, speed: 25 },
          { vx: -15, vy: 20, speed: 25 },
          { vx: 15, vy: -20, speed: 25 },
          { vx: -15, vy: -20, speed: 25 },
          { vx: 20, vy: 15, speed: 25 },
          { vx: -20, vy: 15, speed: 25 },
          { vx: 20, vy: -15, speed: 25 },
          { vx: -20, vy: -15, speed: 25 },
          { vx: 30, vy: 40, speed: 50 },
          { vx: -30, vy: 40, speed: 50 },
          { vx: 30, vy: -40, speed: 50 },
          { vx: -30, vy: -40, speed: 50 },
          { vx: 40, vy: 30, speed: 50 },
          { vx: -40, vy: 30, speed: 50 },
          { vx: 40, vy: -30, speed: 50 },
          { vx: -40, vy: -30, speed: 50 },
          { vx: 50, vy: 120, speed: 130 },
          { vx: -50, vy: 120, speed: 130 },
          { vx: 50, vy: -120, speed: 130 },
          { vx: -50, vy: -120, speed: 130 },
          { vx: 120, vy: 50, speed: 130 },
          { vx: -120, vy: 50, speed: 130 },
          { vx: 60, vy: 80, speed: 100 },
          { vx: -60, vy: 80, speed: 100 },
          { vx: 80, vy: 60, speed: 100 },
          { vx: -80, vy: 60, speed: 100 },
          { vx: 70, vy: 240, speed: 250 },
          { vx: -70, vy: 240, speed: 250 },
          { vx: 240, vy: 70, speed: 250 },
          { vx: 240, vy: -70, speed: 250 },
          { vx: -240, vy: 70, speed: 250 },
          { vx: -240, vy: -70, speed: 250 },
          { vx: -80, vy: 150, speed: 170 },
          { vx: 80, vy: 150, speed: 170 },
          { vx: 150, vy: 80, speed: 170 },
          { vx: 150, vy: -80, speed: 170 },
          { vx: -150, vy: 80, speed: 170 },
          { vx: -150, vy: -80, speed: 170 },
          { vx: 90, vy: 120, speed: 150 },
          { vx: -90, vy: 120, speed: 150 },
          { vx: 120, vy: 90, speed: 150 },
          { vx: 120, vy: 160, speed: 200 },
          { vx: -120, vy: 160, speed: 200 },
          { vx: 160, vy: 120, speed: 200 },
          { vx: 100, vy: 240, speed: 260 },
          { vx: -100, vy: 240, speed: 260 },
          { vx: 240, vy: 100, speed: 260 },
          { vx: -240, vy: 100, speed: 260 },
          { vx: 200, vy: 210, speed: 290 },
          { vx: -200, vy: 210, speed: 290 },
          { vx: 210, vy: 200, speed: 290 },
          { vx: -210, vy: 200, speed: 290 },
        ];
        const item = rng.pick(triples);
        const { vx, vy, speed } = item;

        const wrong1 = speed + 20;
        const wrong2 = Math.abs(vx) + Math.abs(vy);
        const wrong3 = Math.round(speed * 0.8);

        return numberProblem({
          prompt: t(
            `An object moves in the coordinate plane with velocity vector $\\mathbf{v} = \\langle ${vx}, ${vy} \\rangle\\text{ m/s}$. Find its speed.`,
            `一物体在坐标平面内运动，其速度向量为 $\\mathbf{v} = \\langle ${vx}, ${vy} \\rangle\\text{ m/s}$。求该物体的速率。`,
          ),
          answer: speed,
          unit: "m/s",
          wrong: [wrong1, wrong2, wrong3],
          solution: t(
            `Speed is the magnitude of the velocity vector: $\\|\\mathbf{v}\\| = \\sqrt{(${vx})^2 + (${vy})^2} = \\sqrt{${vx * vx + vy * vy}} = ${speed}\\text{ m/s}$.`,
            `速率是速度向量的模长：$\\|\\mathbf{v}\\| = \\sqrt{(${vx})^2 + (${vy})^2} = \\sqrt{${vx * vx + vy * vy}} = ${speed}\\text{ m/s}$。`,
          ),
        });
      },
    },
    {
      id: "resultant-velocity-plane",
      title: t("Calculate resultant velocity in two dimensions", "计算二维平面中的合速度"),
      explanation: t(
        "When an object moves through a moving medium (such as an aircraft in a wind current or a boat across a flowing river), the **resultant velocity** is the vector sum:\n\n$$\\mathbf{v}_{\\text{resultant}} = \\mathbf{v}_{\\text{object}} + \\mathbf{v}_{\\text{medium}}$$",
        "当物体在流动的介质中运动时（如飞机在风中飞行或小船在水流中航行），其**合速度**为各分速度的向量和：\n\n$$\\mathbf{v}_{\\text{合}} = \\mathbf{v}_{\\text{自身}} + \\mathbf{v}_{\\text{介质}}$$",
      ),
      generate(rng) {
        const boatSpeed = rng.pick([12, 15, 18, 20, 24, 25, 30]);
        const currentSpeed = rng.pick([3, 4, 5, 6, 8, 9, 10, 12]);

        return pointProblem({
          prompt: t(
            `A boat is heading due north across a river with a velocity of $${boatSpeed}\\text{ km/h}$ relative to the water ($\\mathbf{v}_{\\text{boat}} = \\langle 0, ${boatSpeed} \\rangle$). The river flows due east with a current velocity of $${currentSpeed}\\text{ km/h}$ ($\\mathbf{v}_{\\text{river}} = \\langle ${currentSpeed}, 0 \\rangle$). Find the boat's resultant velocity vector relative to the riverbank in component form $\\langle v_x, v_y \\rangle$.`,
            `一艘小船相对于水面以 $${boatSpeed}\\text{ km/h}$ 的速度向正北航行（$\\mathbf{v}_{\\text{船}} = \\langle 0, ${boatSpeed} \\rangle$）。河水以 $${currentSpeed}\\text{ km/h}$ 的流速向正东流动（$\\mathbf{v}_{\\text{水}} = \\langle ${currentSpeed}, 0 \\rangle$）。用坐标分量形式 $\\langle v_x, v_y \\rangle$ 求小船相对于河岸的合速度向量。`,
          ),
          vector: true,
          answer: [currentSpeed, boatSpeed],
          wrong: [
            [boatSpeed, currentSpeed],
            [-currentSpeed, boatSpeed],
            [currentSpeed, -boatSpeed],
          ],
          solution: t(
            `Add the velocity vectors: $\\mathbf{v}_{\\text{resultant}} = \\langle 0, ${boatSpeed} \\rangle + \\langle ${currentSpeed}, 0 \\rangle = \\langle ${currentSpeed}, ${boatSpeed} \\rangle\\text{ km/h}$.`,
            `相加各速度向量：$\\mathbf{v}_{\\text{合}} = \\langle 0, ${boatSpeed} \\rangle + \\langle ${currentSpeed}, 0 \\rangle = \\langle ${currentSpeed}, ${boatSpeed} \\rangle\\text{ km/h}$。`,
          ),
        });
      },
    },
  ],
};

// ─── 5.17.7 Calculating Displacement for Plane Motion ───────────────────────

/** calculatingDisplacementForPlaneMotion covers s = vt and multi-stage journeys. */
export const calculatingDisplacementForPlaneMotion: TopicDef = {
  id: "calculating-displacement-for-plane-motion",
  title: t("Calculating Displacement for Plane Motion", "平面运动的位移向量计算"),
  summary: t(
    "Calculate displacement vectors for planar motion using s = vt, sum successive displacements, and find net distance from the origin.",
    "利用 s = vt 计算平面运动的位移向量，求多段连续位移的合位移，并计算距起点的直线距离。",
  ),
  prerequisites: ["velocity-and-acceleration-for-plane-motion"],
  encompasses: [{ topic: "velocity-and-acceleration-for-plane-motion", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSN.VM.A.3"],
  knowledgePoints: [
    {
      id: "displacement-from-constant-velocity",
      title: t("Calculate displacement vector from velocity and time", "由速度与时间计算位移向量"),
      explanation: t(
        "For an object moving with constant velocity vector $\\mathbf{v} = \\langle v_x, v_y \\rangle$, the displacement vector $\\vec{s}$ over a time interval $t$ is given by scalar multiplication:\n\n$$\\vec{s} = \\mathbf{v}t = \\langle v_x t,\\, v_y t \\rangle$$",
        "以恒定速度向量 $\\mathbf{v} = \\langle v_x, v_y \\rangle$ 运动的物体，在时间间隔 $t$ 内的位移向量 $\\vec{s}$ 由标量乘法给出：\n\n$$\\vec{s} = \\mathbf{v}t = \\langle v_x t,\\, v_y t \\rangle$$",
      ),
      generate(rng) {
        const vx = rng.pick([-15, -12, -8, -5, 6, 8, 10, 12, 15, 20]);
        const vy = rng.pick([-20, -10, -5, 5, 8, 12, 16, 20, 25]);
        const tVal = rng.pick([2, 3, 4, 5, 6]);

        const sx = vx * tVal;
        const sy = vy * tVal;

        return pointProblem({
          prompt: t(
            `A particle moves with constant velocity $\\mathbf{v} = \\langle ${vx}, ${vy} \\rangle\\text{ m/s}$ for $t = ${tVal}\\text{ s}$. Find its total displacement vector $\\vec{s}$ in component form $\\langle x, y \\rangle$.`,
            `一质点以恒定速度 $\\mathbf{v} = \\langle ${vx}, ${vy} \\rangle\\text{ m/s}$ 运动了 $t = ${tVal}\\text{ s}$。用坐标分量形式 $\\langle x, y \\rangle$ 求其总位移向量 $\\vec{s}$。`,
          ),
          vector: true,
          answer: [sx, sy],
          wrong: [
            [sx + tVal, sy],
            [vx, vy],
            [sy, sx],
            [-sx, -sy],
          ],
          solution: t(
            `Multiply velocity by time: $\\vec{s} = \\mathbf{v}t = \\langle (${vx})(${tVal}),\\, (${vy})(${tVal}) \\rangle = \\langle ${sx}, ${sy} \\rangle\\text{ m}$.`,
            `速度乘以时间：$\\vec{s} = \\mathbf{v}t = \\langle (${vx})(${tVal}),\\, (${vy})(${tVal}) \\rangle = \\langle ${sx}, ${sy} \\rangle\\text{ m}$。`,
          ),
        });
      },
    },
    {
      id: "total-displacement-and-distance",
      figure: precalculusDrawings2["calculating-displacement-for-plane-motion#total-displacement-and-distance"],
      title: t("Net displacement and straight-line distance for multi-leg journeys", "多段旅程的合位移与直线距离"),
      explanation: t(
        "For an object undergoing consecutive displacements $\\vec{s}_1$ and $\\vec{s}_2$:\n\n- The **net displacement vector** is $\\vec{s}_{\\text{net}} = \\vec{s}_1 + \\vec{s}_2 = \\langle x_1 + x_2,\\, y_1 + y_2 \\rangle$\n- The **straight-line distance** from the starting point is the magnitude $\\|\\vec{s}_{\\text{net}}\\| = \\sqrt{(x_1+x_2)^2 + (y_1+y_2)^2}$",
        "对于连续经历两段位移 $\\vec{s}_1$ 和 $\\vec{s}_2$ 的物体：\n\n- **合位移向量**为 $\\vec{s}_{\\text{合}} = \\vec{s}_1 + \\vec{s}_2 = \\langle x_1 + x_2,\\, y_1 + y_2 \\rangle$\n- 距起点的**直线距离**为其模长 $\\|\\vec{s}_{\\text{合}}\\| = \\sqrt{(x_1+x_2)^2 + (y_1+y_2)^2}$",
      ),
      generate(rng) {
        const scenarios = [
          { x1: 2, y1: 1, x2: 1, y2: 3, tx: 3, ty: 4, dist: 5 },
          { x1: -1, y1: 2, x2: 4, y2: 2, tx: 3, ty: 4, dist: 5 },
          { x1: 1, y1: -2, x2: 5, y2: 10, tx: 6, ty: 8, dist: 10 },
          { x1: 4, y1: 3, x2: 2, y2: 5, tx: 6, ty: 8, dist: 10 },
          { x1: 3, y1: 7, x2: 2, y2: 5, tx: 5, ty: 12, dist: 13 },
          { x1: -2, y1: 5, x2: 7, y2: 7, tx: 5, ty: 12, dist: 13 },
          { x1: 1, y1: 4, x2: 4, y2: 8, tx: 5, ty: 12, dist: 13 },
          { x1: -2, y1: 4, x2: 10, y2: 11, tx: 8, ty: 15, dist: 17 },
          { x1: 3, y1: 8, x2: 5, y2: 7, tx: 8, ty: 15, dist: 17 },
          { x1: 4, y1: 9, x2: 3, y2: 15, tx: 7, ty: 24, dist: 25 },
          { x1: 2, y1: 10, x2: 5, y2: 14, tx: 7, ty: 24, dist: 25 },
          { x1: 5, y1: 2, x2: 4, y2: 10, tx: 9, ty: 12, dist: 15 },
          { x1: 6, y1: 4, x2: 3, y2: 8, tx: 9, ty: 12, dist: 15 },
          { x1: 10, y1: 5, x2: 2, y2: 11, tx: 12, ty: 16, dist: 20 },
          { x1: 7, y1: 8, x2: 5, y2: 8, tx: 12, ty: 16, dist: 20 },
          { x1: -1, y1: 3, x2: 4, y2: 1, tx: 3, ty: 4, dist: 5 },
          { x1: 6, y1: 2, x2: -1, y2: 10, tx: 5, ty: 12, dist: 13 },
          { x1: 2, y1: 5, x2: 6, y2: 10, tx: 8, ty: 15, dist: 17 },
          { x1: 3, y1: 1, x2: 1, y2: 2, tx: 4, ty: 3, dist: 5 },
          { x1: 5, y1: -1, x2: -1, y2: 4, tx: 4, ty: 3, dist: 5 },
          { x1: 2, y1: 2, x2: 6, y2: 4, tx: 8, ty: 6, dist: 10 },
          { x1: 7, y1: 1, x2: 1, y2: 5, tx: 8, ty: 6, dist: 10 },
          { x1: 8, y1: 3, x2: 4, y2: 2, tx: 12, ty: 5, dist: 13 },
          { x1: 9, y1: -2, x2: 3, y2: 7, tx: 12, ty: 5, dist: 13 },
          { x1: 10, y1: 4, x2: 5, y2: 4, tx: 15, ty: 8, dist: 17 },
          { x1: 12, y1: 10, x2: 8, y2: 5, tx: 20, ty: 15, dist: 25 },
          { x1: 11, y1: 6, x2: 9, y2: 9, tx: 20, ty: 15, dist: 25 },
          { x1: 8, y1: 12, x2: 4, y2: 8, tx: 12, ty: 20, dist: 20 },
          { x1: 3, y1: 6, x2: 7, y2: 18, tx: 10, ty: 24, dist: 26 },
          { x1: 14, y1: 8, x2: 6, y2: 13, tx: 20, ty: 21, dist: 29 },
          { x1: -3, y1: 1, x2: 7, y2: 2, tx: 4, ty: 3, dist: 5 },
          { x1: 2, y1: 7, x2: 4, y2: 1, tx: 6, ty: 8, dist: 10 },
          { x1: 7, y1: 3, x2: -1, y2: 5, tx: 6, ty: 8, dist: 10 },
          { x1: 1, y1: 6, x2: 11, y2: -1, tx: 12, ty: 5, dist: 13 },
          { x1: 4, y1: 2, x2: 8, y2: 3, tx: 12, ty: 5, dist: 13 },
          { x1: 5, y1: 6, x2: 10, y2: 2, tx: 15, ty: 8, dist: 17 },
          { x1: 6, y1: 3, x2: 9, y2: 5, tx: 15, ty: 8, dist: 17 },
          { x1: 9, y1: 11, x2: 7, y2: 1, tx: 16, ty: 12, dist: 20 },
          { x1: 11, y1: 4, x2: 5, y2: 8, tx: 16, ty: 12, dist: 20 },
          { x1: 10, y1: 9, x2: 6, y2: 3, tx: 16, ty: 12, dist: 20 },
          { x1: 13, y1: 5, x2: 7, y2: 10, tx: 20, ty: 15, dist: 25 },
          { x1: 8, y1: 7, x2: 12, y2: 8, tx: 20, ty: 15, dist: 25 },
          { x1: 14, y1: 2, x2: 10, y2: 5, tx: 24, ty: 7, dist: 25 },
          { x1: 16, y1: 4, x2: 8, y2: 3, tx: 24, ty: 7, dist: 25 },
          { x1: 18, y1: 1, x2: 6, y2: 6, tx: 24, ty: 7, dist: 25 },
          { x1: 5, y1: 14, x2: 5, y2: 10, tx: 10, ty: 24, dist: 26 },
          { x1: 7, y1: 9, x2: 3, y2: 15, tx: 10, ty: 24, dist: 26 },
        ];
        const item = rng.pick(scenarios);
        const { x1, y1, x2, y2, tx, ty, dist } = item;

        const wrong1 = dist + 2;
        const wrong2 = Math.abs(tx) + Math.abs(ty);
        const wrong3 = dist * 2;

        return numberProblem({
          prompt: t(
            `A hiker travels displacement $\\vec{s}_1 = \\langle ${x1}, ${y1} \\rangle\\text{ km}$ on the first day, and displacement $\\vec{s}_2 = \\langle ${x2}, ${y2} \\rangle\\text{ km}$ on the second day. What is the hiker's net straight-line distance from the starting position?`,
            `一名徒步旅行者第一天的位移为 $\\vec{s}_1 = \\langle ${x1}, ${y1} \\rangle\\text{ km}$，第二天的位移为 $\\vec{s}_2 = \\langle ${x2}, ${y2} \\rangle\\text{ km}$。求该旅行者距离起点的直线距离。`,
          ),
          answer: dist,
          unit: "km",
          wrong: [wrong1, wrong2, wrong3],
          solution: t(
            `The total displacement vector is $\\vec{s}_{\\text{net}} = \\langle ${x1} + ${paren(x2)},\\, ${y1} + ${paren(y2)} \\rangle = \\langle ${tx}, ${ty} \\rangle\\text{ km}$. The straight-line distance is its magnitude: $\\|\\vec{s}_{\\text{net}}\\| = \\sqrt{(${tx})^2 + (${ty})^2} = ${dist}\\text{ km}$.`,
            `总位移向量为 $\\vec{s}_{\\text{合}} = \\langle ${x1} + ${paren(x2)},\\, ${y1} + ${paren(y2)} \\rangle = \\langle ${tx}, ${ty} \\rangle\\text{ km}$。直线距离为其模长：$\\|\\vec{s}_{\\text{合}}\\| = \\sqrt{(${tx})^2 + (${ty})^2} = ${dist}\\text{ km}$。`,
          ),
        });
      },
    },
  ],
};

// ─── Module Export ──────────────────────────────────────────────────────────

/** precalculusVector2DTopics contains all 15 topics in Modules 5.16 and 5.17. */
export const precalculusVector2DTopics: readonly TopicDef[] = [
  introductionToVectors,
  theTriangleLawForTheAdditionOfTwoVectors,
  theMagnitudeOfAVector,
  problemSolvingUsingVectorDiagrams,
  parallelVectors,
  unitVectors,
  linearCombinationsOfVectorsAndTheirProperties,
  describingThePositionVectorOfAPointUsingKnownVectors,
  twoDimensionalVectorsExpressedInComponentForm,
  additionAndScalarMultiplicationOfCartesianVectorsIn2d,
  calculatingTheMagnitudeOfCartesianVectorsIn2d,
  calculatingTheDirectionOfCartesianVectorsIn2d,
  calculatingTheComponentsOfCartesianVectorsIn2d,
  velocityAndAccelerationForPlaneMotion,
  calculatingDisplacementForPlaneMotion,
];
