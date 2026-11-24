import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type PlaneMark, plane, Q, svgDocument } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { mixedLatex } from "../problems.ts";
import { type MathWrong, type Pair, tableFigure, type Wrong } from "./early-grades-more-kit.ts";
import { fr } from "./grade-4-fractions.ts";
import { chosen, chosenMath, decided, drawn, lesson, type Off, valued, withIntro } from "./grade-6-kit.ts";
import { tapeFigure as barFigure, equalTape, lineFigure } from "./upper-grades-kit.ts";

// 6th Grade Math: ratios, ratio tables and tape diagrams, unit rates, percentages, and unit conversions by long division.

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

/** gcd is the greatest common divisor of two positive whole numbers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** coprimePair draws two different whole numbers in [lo, hi] with no common factor. */
function coprimePair(rng: Rng, lo: number, hi: number): [number, number] {
  for (;;) {
    const a = rng.int(lo, hi);
    const b = rng.int(lo, hi);
    if (a !== b && gcd(a, b) === 1) return [a, b];
  }
}

/** ratio writes a ratio in LaTeX: "3 : 4". */
const ratio = (...terms: readonly (number | string)[]) => terms.join(" : ");

/** Things is a pair of kinds of things counted in a ratio, in both languages. */
interface Things {
  readonly a: Text;
  readonly b: Text;
}

const things: readonly Things[] = [
  { a: t("red marbles", "红色弹珠"), b: t("blue marbles", "蓝色弹珠") },
  { a: t("green marbles", "绿色弹珠"), b: t("yellow marbles", "黄色弹珠") },
  { a: t("stickers", "贴纸"), b: t("stamps", "邮票") },
  { a: t("apples", "苹果"), b: t("oranges", "橙子") },
  { a: t("pencils", "铅笔"), b: t("pens", "钢笔") },
  { a: t("roses", "玫瑰"), b: t("tulips", "郁金香") },
];

/** Mix is a recipe of two ingredients mixed in a ratio. */
interface Mix {
  readonly a: Text;
  readonly b: Text;
  readonly unit: Text;
}

const mixes: readonly Mix[] = [
  { a: t("juice", "果汁"), b: t("water", "水"), unit: t("cups", "杯") },
  { a: t("red paint", "红色颜料"), b: t("white paint", "白色颜料"), unit: t("cans", "罐") },
  { a: t("flour", "面粉"), b: t("sugar", "糖"), unit: t("cups", "杯") },
  { a: t("cement", "水泥"), b: t("sand", "沙子"), unit: t("buckets", "桶") },
];

/** tableLatex writes a two-row table with a label in front of each row. */
export function tableLatex(labels: readonly [string, string], top: readonly string[], bottom: readonly string[]): string {
  const cols = "c".repeat(top.length);
  return `\\begin{array}{|l|${cols.split("").join("|")}|}\\hline \\text{${labels[0]}} & ${top.join(" & ")} \\\\ \\hline \\text{${labels[1]}} & ${bottom.join(" & ")} \\\\ \\hline\\end{array}`;
}

// ---------------------------------------------------------------------------
// Ratios
// ---------------------------------------------------------------------------
// Ratios

export const equivalentRatios = withIntro(
  topic(
    "equivalent-ratios",
    t("Equivalent Ratios", "等比"),
    t(
      "Two ratios are equivalent when one is found by multiplying or dividing both terms of the other by the same nonzero number. 2 : 3, 4 : 6 and 10 : 15 are all equivalent.",
      "把一个比的前项和后项同时乘或除以同一个不为 0 的数，得到的比与原来的比相等（等比）。2 : 3、4 : 6 与 10 : 15 都相等。",
    ),
    ["ratios"],
    ["6.RP.A.1", "6.RP.A.3"],
    [
      lesson(
        "scaling-a-ratio",
        ["Finding a missing term", "求缺少的项"],
        [
          [
            "Equivalent ratios are made by multiplying or dividing both terms by the same number. To find a missing term, see what one term was multiplied by, and do the same to the other. In $2 : 3 = 8 : \\square$, the first term was multiplied by $4$, so the second is $3 \\times 4 = 12$.",
            "比的前项和后项同时乘或除以同一个数，得到的比与原来相等。求未知项时，先看已知的一项乘了几，另一项也乘几。在 $2 : 3 = 8 : \\square$ 中，前项乘了 $4$，所以后项是 $3 \\times 4 = 12$。",
          ],
          ["Dividing both terms of $8 : 12$ by $4$ gives back $2 : 3$.", "把 $8 : 12$ 的两项都除以 $4$，又得到 $2 : 3$。"],
          [
            "Multiply, do not add. $2 + 6 = 8$, but $3 + 6 = 9$ gives $8 : 9$, which is not the same ratio as $2 : 3$.",
            "要用乘法，不能用加法。$2 + 6 = 8$，但 $3 + 6 = 9$ 得到 $8 : 9$，和 $2 : 3$ 不相等。",
          ],
        ],
        (rng) => {
          const [a, b] = coprimePair(rng, 1, 9);
          const k = rng.int(2, 9);
          const askSecond = rng.bool();
          const shown = askSecond ? ratio(a * k, "\\square") : ratio("\\square", b * k);
          const [known, knownNew, other] = askSecond ? [a, a * k, b] : [b, b * k, a];
          const answer = other * k;
          const [which, whichZh] = askSecond ? ["first", "前"] : ["second", "后"];
          return valued(
            [
              `Find the missing number that makes the ratios equivalent. $$${ratio(a, b)} = ${shown}$$`,
              `求使两个比相等的缺少的数。$$${ratio(a, b)} = ${shown}$$`,
            ],
            answer,
            [
              [
                ["Find the multiplier", "找出乘了几"],
                [`The ${which} term went from $${known}$ to $${knownNew}$:`, `${whichZh}项从 $${known}$ 变成了 $${knownNew}$：`],
                [`${knownNew} \\div ${known} = ${k}`],
              ],
              [
                ["Do the same to the other term", "另一项也这样做"],
                [`Multiply $${other}$ by $${k}$ too:`, `把 $${other}$ 也乘 $${k}$：`],
                [`${other} \\times ${k} = ${answer}`],
              ],
            ],
            [
              `Divide both terms of the new ratio by $${k}$: $${a * k} \\div ${k} = ${a}$ and $${b * k} \\div ${k} = ${b}$, which is $${ratio(a, b)}$ again.`,
              `把新比的两项都除以 $${k}$：$${a * k} \\div ${k} = ${a}$，$${b * k} \\div ${k} = ${b}$，又得到 $${ratio(a, b)}$。`,
            ],
            [
              [
                other + knownNew - known,
                `That adds $${knownNew - known}$ to both terms. Equivalent ratios multiply both terms by the same number.`,
                `这是给两项都加上 $${knownNew - known}$。等比要把两项乘同一个数。`,
              ],
              [
                knownNew,
                "That copies the term that is given. The other term changes by the same multiplier.",
                "这是照抄已知的那一项。另一项要乘同一个数。",
              ],
              [
                other * (k + 1),
                `That multiplies by $${k + 1}$, but the ${which} term was multiplied by $${k}$.`,
                `这是乘了 $${k + 1}$，但${whichZh}项乘的是 $${k}$。`,
              ],
            ],
          );
        },
        tapeFigure(2, 3, ["A", "B"]),
      ),
      lesson(
        "checking-equivalent-ratios",
        ["Checking whether ratios are equivalent", "判断两个比是否相等"],
        [
          [
            "Two ratios are equivalent when both terms were multiplied by the same number. $3 : 5$ and $12 : 20$ are equivalent, because $12 \\div 3 = 4$ and $20 \\div 5 = 4$.",
            "两个比相等，要两项乘的是同一个数。$3 : 5$ 与 $12 : 20$ 相等，因为 $12 \\div 3 = 4$，$20 \\div 5 = 4$。",
          ],
          [
            "Cross products agree: $3 \\times 20 = 60$ and $5 \\times 12 = 60$.",
            "交叉相乘的积相等：$3 \\times 20 = 60$，$5 \\times 12 = 60$。",
          ],
          [
            "Adding the same number to both terms changes the ratio. $3 : 5$ and $5 : 7$ are not equivalent: $3 \\times 7 = 21$ but $5 \\times 5 = 25$.",
            "两项加上同一个数，比就变了。$3 : 5$ 与 $5 : 7$ 不相等：$3 \\times 7 = 21$，而 $5 \\times 5 = 25$。",
          ],
        ],
        (rng) => {
          const [a, b] = coprimePair(rng, 1, 9);
          const k = rng.int(2, 8);
          const kind = rng.int(0, 2);
          const [c, d] = kind === 0 ? [a * k, b * k] : kind === 1 ? [a + k, b + k] : [a * k, b * k + rng.pick([-1, 1])];
          const equal = kind === 0;
          const other: Pair = equal
            ? [`Both terms were multiplied by $${k}$, which keeps the ratio.`, `两项都乘了 $${k}$，比不变。`]
            : kind === 1
              ? [
                  `$${k}$ was added to both terms. Adding changes a ratio; only multiplying keeps it.`,
                  `两项都加上了 $${k}$。加法会改变比，只有乘法才能保持。`,
                ]
              : [
                  `The first term was multiplied by $${k}$, but $${b} \\times ${k} = ${b * k}$, not $${d}$.`,
                  `前项乘了 $${k}$，但 $${b} \\times ${k} = ${b * k}$，不是 $${d}$。`,
                ];
          return decided(
            rng,
            [`Are the ratios $${ratio(a, b)}$ and $${ratio(c, d)}$ equivalent?`, `$${ratio(a, b)}$ 与 $${ratio(c, d)}$ 这两个比相等吗？`],
            equal,
            [
              [
                ["Divide each pair of terms", "分别相除"],
                [`First terms and second terms:`, `前项和前项、后项和后项：`],
                [`${c} \\div ${a} = ${mixedLatex(Q.of(c, a))}`, `${d} \\div ${b} = ${mixedLatex(Q.of(d, b))}`],
              ],
              [
                ["Compare the multipliers", "比较乘的数"],
                equal
                  ? [`Both are $${k}$, so the ratios are equivalent.`, `都是 $${k}$，所以两个比相等。`]
                  : ["They differ, so the ratios are not equivalent.", "两者不同，所以两个比不相等。"],
              ],
            ],
            [
              `Cross products: $${a} \\times ${d} = ${a * d}$ and $${b} \\times ${c} = ${b * c}$, ${equal ? "equal" : "not equal"}.`,
              `交叉相乘：$${a} \\times ${d} = ${a * d}$，$${b} \\times ${c} = ${b * c}$，${equal ? "相等" : "不相等"}。`,
            ],
            other,
          );
        },
        tapeFigure(3, 5, ["A", "B"]),
      ),
    ],
  ),
  [
    "A lemonade recipe uses $2$ cups of lemon juice for every $3$ cups of water. For a jug twice as big that tastes the same, double both: $4$ cups of juice and $6$ cups of water.",
    "一份柠檬水配方是每 $3$ 杯水配 $2$ 杯柠檬汁。要调一大壶两倍的、味道一样的柠檬水，两样都加倍：$4$ 杯柠檬汁、$6$ 杯水。",
  ],
  [
    "$4 : 6$ halves back to $2 : 3$, so each $3$ cups of water still get $2$ cups of juice.",
    "$4 : 6$ 两项都除以 $2$，又是 $2 : 3$，所以每 $3$ 杯水仍然配 $2$ 杯柠檬汁。",
  ],
  ["find missing terms of equivalent ratios and decide whether two ratios are equivalent.", "求等比中缺少的项，并判断两个比是否相等。"],
);

export const writingRatiosUsingFractions = withIntro(
  topic(
    "writing-ratios-using-fractions",
    t("Writing Ratios Using Fractions", "用分数表示比"),
    t(
      "The ratio a : b can be written as the fraction a/b and simplified like any fraction: 6 : 8 = 6/8 = 3/4. A part-to-whole ratio compares one part with the total.",
      "比 a : b 可以写成分数 a/b，并像分数一样化简：6 : 8 = 6/8 = 3/4。部分与整体的比是把一部分与总数相比。",
    ),
    ["equivalent-ratios", "writing-fractions-in-lowest-terms"],
    ["6.RP.A.1"],
    [
      lesson(
        "part-to-part-as-a-fraction",
        ["Part to part", "部分与部分"],
        [
          [
            "A ratio $a : b$ can be written as the fraction $\\frac{a}{b}$, with the first quantity named on top. Then simplify it like any fraction. With $6$ cats and $9$ dogs, the ratio of cats to dogs is $6 : 9 = \\frac{6}{9} = \\frac{2}{3}$.",
            "比 $a : b$ 可以写成分数 $\\frac{a}{b}$，先说到的量作分子，再像分数一样约分。有 $6$ 只猫和 $9$ 只狗，猫与狗的比是 $6 : 9 = \\frac{6}{9} = \\frac{2}{3}$。",
          ],
          [
            "$\\frac{2}{3}$ means $2$ cats for every $3$ dogs: three groups of $2$ cats and three groups of $3$ dogs.",
            "$\\frac{2}{3}$ 表示每 $3$ 只狗对应 $2$ 只猫：$3$ 组各 $2$ 只猫，$3$ 组各 $3$ 只狗。",
          ],
          [
            "The order matters. Cats to dogs is $\\frac{2}{3}$, while dogs to cats is $\\frac{3}{2}$.",
            "顺序很重要。猫与狗的比是 $\\frac{2}{3}$，狗与猫的比是 $\\frac{3}{2}$。",
          ],
        ],
        (rng) => {
          const th = rng.pick(things);
          const [p, q] = coprimePair(rng, 1, 9);
          const k = rng.int(2, 6);
          const [a, b] = [p * k, q * k];
          return valued(
            [
              `A box has $${a}$ ${th.a.en} and $${b}$ ${th.b.en}. Write the ratio of ${th.a.en} to ${th.b.en} as a fraction in simplest form.`,
              `盒子里有 $${a}$ 个${th.a["zh-CN"]}和 $${b}$ 个${th.b["zh-CN"]}。把${th.a["zh-CN"]}与${th.b["zh-CN"]}的比写成最简分数。`,
            ],
            Q.of(p, q),
            [
              [
                ["Write the fraction", "写成分数"],
                [`The ${th.a.en} go on top:`, `${th.a["zh-CN"]}的数量作分子：`],
                [`${ratio(a, b)} = ${fr(a, b)}`],
              ],
              [["Simplify", "约分"], [`Divide both by $${k}$:`, `分子分母都除以 $${k}$：`], [`${fr(a, b)} = ${fr(p, q)}`]],
            ],
            [
              `$${p} \\times ${k} = ${a}$ and $${q} \\times ${k} = ${b}$, so $${fr(p, q)}$ gives back the counts.`,
              `$${p} \\times ${k} = ${a}$，$${q} \\times ${k} = ${b}$，所以 $${fr(p, q)}$ 又得到原来的数量。`,
            ],
            [
              [Q.of(q, p), `That is ${th.b.en} to ${th.a.en}, upside down.`, `这是${th.b["zh-CN"]}与${th.a["zh-CN"]}的比，颠倒了。`],
              [
                Q.of(p, p + q),
                `That compares the ${th.a.en} with all the items, not with the ${th.b.en}.`,
                `这是${th.a["zh-CN"]}与物品总数的比，不是与${th.b["zh-CN"]}的比。`,
              ],
              [Q.of(q, p + q), `That compares the ${th.b.en} with all the items.`, `这是${th.b["zh-CN"]}与物品总数的比。`],
            ],
            { form: "fraction" },
          );
        },
        tapeFigure(2, 3, ["A", "B"]),
      ),
      lesson(
        "part-to-whole-as-a-fraction",
        ["Part to whole", "部分与整体"],
        [
          [
            "A part-to-whole ratio compares one part with the total, so add the parts first. With $6$ cats and $9$ dogs there are $15$ animals, so the ratio of cats to all the animals is $\\frac{6}{15} = \\frac{2}{5}$.",
            "部分与整体的比是把一部分与总数相比，所以先把各部分加起来。有 $6$ 只猫和 $9$ 只狗，共 $15$ 只动物，猫与动物总数的比是 $\\frac{6}{15} = \\frac{2}{5}$。",
          ],
          [
            "Dogs to all the animals is $\\frac{9}{15} = \\frac{3}{5}$, and $\\frac{2}{5} + \\frac{3}{5} = 1$.",
            "狗与动物总数的比是 $\\frac{9}{15} = \\frac{3}{5}$，而 $\\frac{2}{5} + \\frac{3}{5} = 1$。",
          ],
          [
            "The bottom is the total, not the other part. $\\frac{6}{9}$ compares cats with dogs.",
            "分母是总数，不是另一部分。$\\frac{6}{9}$ 是猫与狗的比。",
          ],
        ],
        (rng) => {
          const th = rng.pick(things);
          const [p, q] = coprimePair(rng, 1, 8);
          const k = rng.int(2, 5);
          const [a, b] = [p * k, q * k];
          const total = a + b;
          const g = gcd(a, total);
          const simple = Q.of(a, total);
          return valued(
            [
              `A box has $${a}$ ${th.a.en} and $${b}$ ${th.b.en}. Write the ratio of ${th.a.en} to all the items in the box as a fraction in simplest form.`,
              `盒子里有 $${a}$ 个${th.a["zh-CN"]}和 $${b}$ 个${th.b["zh-CN"]}。把${th.a["zh-CN"]}与盒子里物品总数的比写成最简分数。`,
            ],
            simple,
            [
              [["Find the total", "求总数"], ["Add the two parts:", "把两部分加起来："], [`${a} + ${b} = ${total}`]],
              [
                ["Write and simplify", "写成分数并约分"],
                [`The ${th.a.en} over the total, divided by $${g}$:`, `${th.a["zh-CN"]}的数量除以总数，再约去 $${g}$：`],
                [`${fr(a, total)} = ${simple.toLatex()}`],
              ],
            ],
            [
              `The ${th.b.en} make $${Q.of(b, total).toLatex()}$ of the box, and $${simple.toLatex()} + ${Q.of(b, total).toLatex()} = 1$.`,
              `${th.b["zh-CN"]}占 $${Q.of(b, total).toLatex()}$，而 $${simple.toLatex()} + ${Q.of(b, total).toLatex()} = 1$。`,
            ],
            [
              [
                Q.of(a, b),
                `That compares the ${th.a.en} with the ${th.b.en}, not with all the items.`,
                `这是${th.a["zh-CN"]}与${th.b["zh-CN"]}的比，不是与总数的比。`,
              ],
              [Q.of(b, total), `That is the ${th.b.en} out of all the items.`, `这是${th.b["zh-CN"]}占总数的比。`],
              [Q.of(total, a), "That is upside down: the total goes on the bottom.", "这颠倒了：总数应该作分母。"],
            ],
            { form: "fraction" },
          );
        },
        tapeFigure(2, 3, ["A", "B"]),
      ),
    ],
  ),
  [
    "A class has $12$ girls and $18$ boys. The ratio of girls to boys, $12 : 18$, can be written as the fraction $\\frac{12}{18}$, which simplifies to $\\frac{2}{3}$.",
    "一个班有 $12$ 名女生和 $18$ 名男生。女生与男生的比 $12 : 18$ 可以写成分数 $\\frac{12}{18}$，约分后是 $\\frac{2}{3}$。",
  ],
  ["$\\frac{2}{3}$ of $18$ is $12$, the number of girls.", "$18$ 的 $\\frac{2}{3}$ 是 $12$，正是女生人数。"],
  ["write part-to-part and part-to-whole ratios as fractions in simplest form.", "把部分与部分、部分与整体的比写成最简分数。"],
);

/** relationWrong gives the reason a wrong comparison sign fails, from the two numerators over a common denominator. */
const relationWrong = (left: string, right: string, sym: string, m: number, n: number, den: number): MathWrong => {
  const why: Pair =
    sym === "="
      ? [
          `Over $${den}$ the fractions are $${fr(m, den)}$ and $${fr(n, den)}$, which are not equal.`,
          `化成分母 $${den}$ 后是 $${fr(m, den)}$ 和 $${fr(n, den)}$，并不相等。`,
        ]
      : [
          `That points the wrong way: over $${den}$ the numerators are $${m}$ and $${n}$.`,
          `方向反了：化成分母 $${den}$ 后，分子是 $${m}$ 和 $${n}$。`,
        ];
  return [`${left} ${sym} ${right}`, why[0], why[1]];
};

export const comparingRatios = withIntro(
  topic(
    "comparing-ratios",
    t("Comparing Ratios", "比较比的大小"),
    t(
      "To compare $a : b$ with $c : d$, compare the fractions $\\frac{a}{b}$ and $\\frac{c}{d}$, for example by rewriting them with a common denominator. A juice mix of $2 : 3$ is stronger than $3 : 5$ because $\\frac{2}{3} = \\frac{10}{15}$ > $\\frac{9}{15} = \\frac{3}{5}$.",
      "比较 $a : b$ 与 $c : d$，就是比较分数 $\\frac{a}{b}$ 与 $\\frac{c}{d}$，例如先通分。果汁与水按 $2 : 3$ 调的比按 $3 : 5$ 调的更浓，因为 $\\frac{2}{3} = \\frac{10}{15}$ > $\\frac{9}{15} = \\frac{3}{5}$。",
    ),
    ["writing-ratios-using-fractions", "comparing-fractions"],
    ["6.RP.A.3"],
    [
      lesson(
        "comparing-ratios-as-fractions",
        ["Comparing as fractions", "化成分数比较"],
        [
          [
            "To compare two ratios, write each as a fraction and give the fractions a common denominator. For $3 : 4$ and $5 : 7$: $\\frac{3}{4} = \\frac{21}{28}$ and $\\frac{5}{7} = \\frac{20}{28}$. Since $21 > 20$, $3 : 4 > 5 : 7$.",
            "比较两个比，把它们写成分数，再通分。$3 : 4$ 与 $5 : 7$：$\\frac{3}{4} = \\frac{21}{28}$，$\\frac{5}{7} = \\frac{20}{28}$。因为 $21 > 20$，所以 $3 : 4 > 5 : 7$。",
          ],
          ["As decimals, $3 \\div 4 = 0.75$ and $5 \\div 7$ is about $0.71$.", "化成小数，$3 \\div 4 = 0.75$，$5 \\div 7$ 约为 $0.71$。"],
          [
            "Do not compare only the second terms. $7$ is more than $4$, yet $5 : 7$ is the smaller ratio.",
            "不能只比较后项。$7$ 比 $4$ 大，但 $5 : 7$ 反而是较小的比。",
          ],
        ],
        (rng) => {
          let a: number, b: number, c: number, d: number;
          do {
            [a, b] = coprimePair(rng, 1, 9);
            [c, d] = coprimePair(rng, 1, 9);
          } while (a * d === b * c || b === d || b === 1 || d === 1);
          const [m, n, den] = [a * d, c * b, b * d];
          const sym = m > n ? ">" : "<";
          const [left, right] = [ratio(a, b), ratio(c, d)];
          return chosenMath(
            rng,
            [`Which is true?`, `哪一个正确？`],
            `${left} ${sym} ${right}`,
            [relationWrong(left, right, "=", m, n, den), relationWrong(left, right, sym === ">" ? "<" : ">", m, n, den)],
            [
              [
                ["Write as fractions", "写成分数"],
                [`Give both the denominator $${den}$:`, `都化成分母 $${den}$：`],
                [`${fr(a, b)} = ${fr(m, den)}`, `${fr(c, d)} = ${fr(n, den)}`],
              ],
              [
                ["Compare the numerators", "比较分子"],
                [`$${m} ${sym} ${n}$, so:`, `$${m} ${sym} ${n}$，所以：`],
                [`${left} ${sym} ${right}`],
              ],
            ],
            [
              `Cross products: $${a} \\times ${d} = ${m}$ and $${c} \\times ${b} = ${n}$, and $${m} ${sym} ${n}$.`,
              `交叉相乘：$${a} \\times ${d} = ${m}$，$${c} \\times ${b} = ${n}$，$${m} ${sym} ${n}$。`,
            ],
          );
        },
        barFigure(
          [
            {
              total: "3/4",
              pieces: [
                { size: 21, text: "21", lit: true },
                { size: 7, text: "7" },
              ],
            },
            {
              total: "5/7",
              pieces: [
                { size: 20, text: "20", lit: true },
                { size: 8, text: "8" },
              ],
            },
          ],
          [
            "Two bars of 28 parts: 3/4 shades 21 parts and 5/7 shades 20, so 3/4 is greater.",
            "两条各 28 份的长条：3/4 涂 21 份，5/7 涂 20 份，所以 3/4 更大。",
          ],
        ),
      ),
      lesson(
        "comparing-mixtures",
        ["Which mixture is stronger?", "哪种混合更浓？"],
        [
          [
            "To see which mix has more juice for its water, compare juice to water as fractions. Mix A uses $2$ cups of juice for $3$ cups of water, mix B $3$ cups of juice for $5$ cups of water: $\\frac{2}{3} = \\frac{10}{15}$ and $\\frac{3}{5} = \\frac{9}{15}$, so mix A tastes more of juice.",
            "要看哪种混合的果汁相对水更多，就把果汁与水的比写成分数来比较。A 种用 $2$ 杯果汁配 $3$ 杯水，B 种用 $3$ 杯果汁配 $5$ 杯水：$\\frac{2}{3} = \\frac{10}{15}$，$\\frac{3}{5} = \\frac{9}{15}$，所以 A 种果汁味更浓。",
          ],
          [
            "Make $15$ cups of water: mix A needs $10$ cups of juice and mix B only $9$.",
            "都配 $15$ 杯水：A 种要 $10$ 杯果汁，B 种只要 $9$ 杯。",
          ],
          [
            "More juice in the recipe does not mean a stronger mix. Mix B has $3$ cups of juice, but also more water.",
            "配方里果汁多，不一定更浓。B 种有 $3$ 杯果汁，但水也更多。",
          ],
        ],
        (rng) => {
          const mix = rng.pick(mixes);
          let a: number, b: number, c: number, d: number;
          do {
            [a, b] = coprimePair(rng, 2, 9);
            [c, d] = coprimePair(rng, 2, 9);
          } while (b === d || a === c);
          const [m, n, den] = [a * d, c * b, b * d];
          const sym = m === n ? "=" : m > n ? ">" : "<";
          const A: Pair = ["Mix A", "A 种"];
          const B: Pair = ["Mix B", "B 种"];
          const same: Pair = ["They are the same", "一样大"];
          const correct = m === n ? same : m > n ? A : B;
          const loses = (p: Pair): Wrong =>
            p === same
              ? [
                  p,
                  `Over $${den}$ the numerators are $${m}$ and $${n}$, which differ.`,
                  `化成分母 $${den}$ 后，分子是 $${m}$ 和 $${n}$，并不相同。`,
                ]
              : [
                  p,
                  `Over $${den}$ that mix has only $${p === A ? m : n}$, the smaller numerator.`,
                  `化成分母 $${den}$ 后，这种只有 $${p === A ? m : n}$，分子较小。`,
                ];
          return chosen(
            rng,
            [
              `Mix A uses ${a} ${mix.unit.en} of ${mix.a.en} for every ${b} ${mix.unit.en} of ${mix.b.en}. Mix B uses ${c} ${mix.unit.en} of ${mix.a.en} for every ${d} ${mix.unit.en} of ${mix.b.en}. Which mix has the greater ratio of ${mix.a.en} to ${mix.b.en}?`,
              `A 种混合物每 ${b} ${mix.unit["zh-CN"]}${mix.b["zh-CN"]}配 ${a} ${mix.unit["zh-CN"]}${mix.a["zh-CN"]}，B 种每 ${d} ${mix.unit["zh-CN"]}${mix.b["zh-CN"]}配 ${c} ${mix.unit["zh-CN"]}${mix.a["zh-CN"]}。哪种混合物中${mix.a["zh-CN"]}与${mix.b["zh-CN"]}的比更大？`,
            ],
            correct,
            [A, B, same].filter((p) => p !== correct).map(loses),
            [
              [
                ["Write as fractions", "写成分数"],
                [
                  `${mix.a.en} over ${mix.b.en}, with the denominator $${den}$:`,
                  `${mix.a["zh-CN"]}比${mix.b["zh-CN"]}，化成分母 $${den}$：`,
                ],
                [`${fr(a, b)} = ${fr(m, den)}`, `${fr(c, d)} = ${fr(n, den)}`],
              ],
              [["Compare", "比较"], [`$${m} ${sym} ${n}$, so:`, `$${m} ${sym} ${n}$，所以：`], [`${fr(a, b)} ${sym} ${fr(c, d)}`]],
            ],
            [
              `With $${den}$ ${mix.unit.en} of ${mix.b.en}, mix A takes $${m}$ ${mix.unit.en} of ${mix.a.en} and mix B takes $${n}$.`,
              `都配 $${den}$ ${mix.unit["zh-CN"]}${mix.b["zh-CN"]}时，A 种要 $${m}$ ${mix.unit["zh-CN"]}${mix.a["zh-CN"]}，B 种要 $${n}$ ${mix.unit["zh-CN"]}。`,
            ],
          );
        },
        barFigure(
          [
            {
              total: "A",
              pieces: [
                { size: 2, text: "2", lit: true },
                { size: 3, text: "3" },
              ],
            },
            {
              total: "B",
              pieces: [
                { size: 3, text: "3", lit: true },
                { size: 5, text: "5" },
              ],
            },
          ],
          [
            "Mix A: 2 cups of juice, shaded, with 3 of water. Mix B: 3 of juice with 5 of water.",
            "A 种：2 杯果汁（涂色）配 3 杯水。B 种：3 杯果汁配 5 杯水。",
          ],
        ),
      ),
    ],
  ),
  [
    "Two pitchers of lemonade: one uses $2$ scoops of mix for $3$ cups of water, the other $3$ scoops for $5$ cups. Which tastes stronger? Compare $\\frac{2}{3}$ with $\\frac{3}{5}$.",
    "两壶柠檬水：一壶用 $2$ 勺粉配 $3$ 杯水，另一壶用 $3$ 勺粉配 $5$ 杯水。哪壶味道更浓？比较 $\\frac{2}{3}$ 和 $\\frac{3}{5}$。",
  ],
  [
    "$\\frac{2}{3} = \\frac{10}{15}$ and $\\frac{3}{5} = \\frac{9}{15}$, so the first is stronger.",
    "$\\frac{2}{3} = \\frac{10}{15}$，$\\frac{3}{5} = \\frac{9}{15}$，所以第一壶更浓。",
  ],
  ["compare ratios by writing them as fractions with a common denominator.", "把比写成分数并通分，来比较比的大小。"],
);

export const approximatingRatios = withIntro(
  topic(
    "approximating-ratios",
    t("Approximating Ratios", "估计比"),
    t(
      "When the numbers in a ratio are awkward, round them to nearby numbers that share a factor. 31 : 46 is close to 30 : 45 = 2 : 3.",
      "当比中的数不好算时，把它们取成相近的、有公因数的数。31 : 46 接近 30 : 45 = 2 : 3。",
    ),
    ["equivalent-ratios", "rounding-up-whole-numbers"],
    ["6.RP.A.3"],
    [
      lesson(
        "nearest-simple-ratio",
        ["The nearest simple ratio", "最接近的简单比"],
        [
          [
            "To approximate a ratio, round both terms to nearby numbers that share a large factor, then simplify. $41 : 59$ is close to $40 : 60$, and dividing both by $20$ gives $2 : 3$.",
            "求一个比的近似比，把前后项都取成相近的、有较大公因数的数，再化简。$41 : 59$ 接近 $40 : 60$，前后项都除以 $20$，得 $2 : 3$。",
          ],
          [
            "$2 : 3$ scaled by $20$ is $40 : 60$, only $1$ away from each term of $41 : 59$.",
            "$2 : 3$ 两项乘 $20$ 是 $40 : 60$，和 $41 : 59$ 的每一项都只差 $1$。",
          ],
          [
            "Keep the order. $3 : 2$ would mean more of the first quantity, but $41$ is less than $59$.",
            "顺序不能变。$3 : 2$ 表示前一个量更多，但 $41$ 比 $59$ 小。",
          ],
        ],
        (rng) => {
          const [p, q] = coprimePair(rng, 1, 5);
          const k = rng.pick([10, 20, 25, 50]);
          const [a, b] = [p * k + rng.pick([-2, -1, 1, 2]), q * k + rng.pick([-2, -1, 1, 2])];
          const far = (x: number, y: number, en: string, zh: string): MathWrong => [
            ratio(x, y),
            `${en} Scaled by $${k}$ it is $${ratio(x * k, y * k)}$, far from $${ratio(a, b)}$.`,
            `${zh}乘 $${k}$ 后是 $${ratio(x * k, y * k)}$，和 $${ratio(a, b)}$ 相差很远。`,
          ];
          const wrong: MathWrong[] = [
            [ratio(q, p), "That is upside down: the terms are swapped.", "这颠倒了：前后项对调了。"],
            far(p + 1, q, "The first term is one too big.", "前项多了 $1$。"),
            far(p, q + 1, "The second term is one too big.", "后项多了 $1$。"),
            far(p + 1, q + 1, "That adds $1$ to both terms.", "这是两项都加了 $1$。"),
          ];
          return chosenMath(
            rng,
            [`Which simple ratio is closest to $${ratio(a, b)}$?`, `哪个简单的比最接近 $${ratio(a, b)}$？`],
            ratio(p, q),
            wrong.filter(([w]) => {
              const [x, y] = w.split(" : ").map(Number) as [number, number];
              return x * q !== y * p;
            }),
            [
              [
                ["Round both terms", "两项都取近似值"],
                [`Round to numbers that share the factor $${k}$:`, `取成都有因数 $${k}$ 的数：`],
                [`${ratio(a, b)} \\approx ${ratio(p * k, q * k)}`],
              ],
              [["Simplify", "化简"], [`Divide both by $${k}$:`, `两项都除以 $${k}$：`], [`${ratio(p * k, q * k)} = ${ratio(p, q)}`]],
            ],
            [
              `Scaling back, $${p} \\times ${k} = ${p * k}$ is within $2$ of $${a}$, and $${q} \\times ${k} = ${q * k}$ is within $2$ of $${b}$.`,
              `反过来乘 $${k}$：$${p} \\times ${k} = ${p * k}$ 与 $${a}$ 相差不超过 $2$，$${q} \\times ${k} = ${q * k}$ 与 $${b}$ 相差不超过 $2$。`,
            ],
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 60,
            step: 10,
            marks: [
              { at: 41, text: "41" },
              { at: 59, text: "59" },
            ],
          },
          ["41 lies next to 40 and 59 next to 60, and 40 : 60 = 2 : 3.", "41 靠近 40，59 靠近 60，而 40 : 60 = 2 : 3。"],
        ),
      ),
      lesson(
        "estimating-with-an-approximate-ratio",
        ["Estimating with an approximate ratio", "用近似的比估算"],
        [
          [
            "Round an awkward ratio to a simple one, then scale it. In a town, $198$ of $602$ people ride bikes: about $200 : 600 = 1 : 3$. So in a group of $90$ people, about $90 \\div 3 = 30$ would ride bikes.",
            "把不好算的比取成简单的比，再按比例算。某镇 $602$ 人中有 $198$ 人骑车：约为 $200 : 600 = 1 : 3$。所以 $90$ 人中大约有 $90 \\div 3 = 30$ 人骑车。",
          ],
          ["$30 : 90 = 1 : 3$, the same as the rounded ratio.", "$30 : 90 = 1 : 3$，和近似的比相同。"],
          [
            "Answer the group asked about. $60$ is how many of the $90$ would not ride bikes.",
            "回答所问的那部分人。$60$ 是 $90$ 人中不骑车的人数。",
          ],
        ],
        (rng) => {
          const [p, q] = coprimePair(rng, 1, 5);
          const [pp, qq] = p < q ? [p, q] : [q, p];
          const k = rng.pick([100, 200]);
          const a = pp * k + rng.int(-4, 4);
          const total = qq * k + rng.int(-4, 4);
          const share = rng.int(30, 150);
          const group = qq * share;
          const answer = share * pp;
          return valued(
            [
              `In a survey, $${a}$ of $${total}$ students said they like chess. About how many students in a school of $${group}$ would you expect to like chess?`,
              `一项调查中，$${total}$ 名学生里有 $${a}$ 名说喜欢国际象棋。在一所有 $${group}$ 名学生的学校里，估计大约有多少名学生喜欢国际象棋？`,
            ],
            answer,
            [
              [
                ["Round the ratio", "取近似的比"],
                [`$${a}$ out of $${total}$ is about:`, `$${total}$ 人中有 $${a}$ 人，约为：`],
                [`${ratio(pp * k, qq * k)} = ${ratio(pp, qq)}`],
              ],
              [
                ["Scale it", "按比例算"],
                [`Split the school into groups of $${qq}$ and take $${pp}$ from each:`, `把全校按每 $${qq}$ 人分组，每组取 $${pp}$ 人：`],
                [`${group} \\div ${qq} = ${share}`, `${share} \\times ${pp} = ${answer}`],
              ],
            ],
            [
              `$${answer} : ${group}$ simplifies to $${ratio(pp, qq)}$ when both are divided by $${share}$.`,
              `$${answer} : ${group}$ 两项都除以 $${share}$，得 $${ratio(pp, qq)}$。`,
            ],
            [
              [group - answer, "That is the students who would not like chess.", "这是不喜欢国际象棋的人数。"],
              [
                answer * 2,
                `That doubles the estimate. Use $${ratio(pp, qq)}$ as it is.`,
                `这把估计值翻了一倍。应该直接用 $${ratio(pp, qq)}$。`,
              ],
              [group * pp, `That multiplies by $${pp}$ without dividing by $${qq}$ first.`, `这是乘了 $${pp}$，但没有先除以 $${qq}$。`],
            ],
          );
        },
        equalTape(3, "30", "90", 1),
      ),
    ],
  ),
  [
    "A team won $19$ of its $41$ games. That is awkward to picture, but $19 : 41$ is close to $20 : 40 = 1 : 2$: the team won about half its games.",
    "一支球队 $41$ 场比赛赢了 $19$ 场。这不好想象，但 $19 : 41$ 接近 $20 : 40 = 1 : 2$：球队大约赢了一半。",
  ],
  ["Half of $41$ is $20.5$, close to $19$.", "$41$ 的一半是 $20.5$，和 $19$ 接近。"],
  ["round awkward ratios to simple ones and use them to estimate.", "把不好算的比取成简单的比，并用它来估算。"],
);

export const reasoningWithEquivalentRatios = withIntro(
  topic(
    "reasoning-with-equivalent-ratios",
    t("Reasoning With Equivalent Ratios", "用等比推理"),
    t(
      "If boys and girls are in the ratio 3 : 4 and there are 12 boys, the ratio was scaled by 4, so there are 16 girls. If instead there are 28 students in all, each of the 7 equal parts is 4 students.",
      "如果男生与女生的比是 3 : 4，有 12 名男生，那么比扩大了 4 倍，女生有 16 名。如果一共有 28 名学生，那么 7 份中的每一份是 4 名学生。",
    ),
    ["equivalent-ratios"],
    ["6.RP.A.3"],
    [
      lesson(
        "scaling-from-one-quantity",
        ["Finding one quantity from the other", "由一个量求另一个量"],
        [
          [
            "When one quantity is known, find what its ratio term was multiplied by, then multiply the other term by the same number. The ratio of boys to girls is $3 : 4$ and there are $12$ boys. Since $12 = 3 \\times 4$, the ratio was scaled by $4$, so there are $4 \\times 4 = 16$ girls.",
            "已知其中一个量时，先求出它对应的项乘了几，再把另一项也乘这个数。男生与女生的比是 $3 : 4$，男生有 $12$ 名。因为 $12 = 3 \\times 4$，比扩大了 $4$ 倍，所以女生有 $4 \\times 4 = 16$ 名。",
          ],
          ["$12 : 16$ divided by $4$ is $3 : 4$.", "$12 : 16$ 两项都除以 $4$，得 $3 : 4$。"],
          [
            "Adding does not keep a ratio. $12$ is $9$ more than $3$, but $4 + 9 = 13$ girls would give $12 : 13$.",
            "加法不能保持比不变。$12$ 比 $3$ 多 $9$，但女生若是 $4 + 9 = 13$ 名，比就成了 $12 : 13$。",
          ],
        ],
        (rng) => {
          const th = rng.pick(things);
          const [a, b] = coprimePair(rng, 1, 9);
          const k = rng.int(2, 12);
          return valued(
            [
              `The ratio of ${th.a.en} to ${th.b.en} in a collection is $${ratio(a, b)}$. There are $${a * k}$ ${th.a.en}. How many ${th.b.en} are there?`,
              `一组物品中${th.a["zh-CN"]}与${th.b["zh-CN"]}的比是 $${ratio(a, b)}$。有 $${a * k}$ 个${th.a["zh-CN"]}，有多少个${th.b["zh-CN"]}？`,
            ],
            b * k,
            [
              [
                ["Find the multiplier", "找出扩大的倍数"],
                [`$${a}$ became $${a * k}$:`, `$${a}$ 变成了 $${a * k}$：`],
                [`${a * k} \\div ${a} = ${k}`],
              ],
              [
                ["Scale the other term", "另一项也扩大"],
                [`Multiply $${b}$ by $${k}$:`, `把 $${b}$ 乘 $${k}$：`],
                [`${b} \\times ${k} = ${b * k}`],
              ],
            ],
            [
              `$${ratio(a * k, b * k)}$ divided by $${k}$ is $${ratio(a, b)}$.`,
              `$${ratio(a * k, b * k)}$ 两项都除以 $${k}$，得 $${ratio(a, b)}$。`,
            ],
            [
              [
                a * k + (b - a),
                `That adds $${a * k - a}$ to $${b}$. Multiply by $${k}$ instead.`,
                `这是给 $${b}$ 加上 $${a * k - a}$。应该乘 $${k}$。`,
              ],
              [
                a * k * b,
                `That multiplies $${a * k}$ by $${b}$. First find how many times $${a}$ went into $${a * k}$.`,
                `这是用 $${a * k}$ 乘 $${b}$。应该先求 $${a * k}$ 是 $${a}$ 的几倍。`,
              ],
              [b * (k + 1), `That multiplies by $${k + 1}$, but the multiplier is $${k}$.`, `这是乘了 $${k + 1}$，但倍数是 $${k}$。`],
            ],
          );
        },
        tapeFigure(3, 4, ["A", "B"]),
      ),
      lesson(
        "scaling-from-the-total",
        ["Finding a part from the total", "由总数求部分"],
        [
          [
            "When the total is known, add the ratio terms to find how many equal parts there are. Divide to find one part, then multiply by the term you want. Ratio $3 : 4$ with $28$ in all: $3 + 4 = 7$ parts, each $28 \\div 7 = 4$, so there are $3 \\times 4 = 12$ boys and $4 \\times 4 = 16$ girls.",
            "已知总数时，先把比的各项相加，得到一共几份。用除法求出一份，再乘所求的那一项。比为 $3 : 4$，共 $28$ 人：共 $3 + 4 = 7$ 份，每份 $28 \\div 7 = 4$ 人，所以男生 $3 \\times 4 = 12$ 名，女生 $4 \\times 4 = 16$ 名。",
          ],
          ["$12 + 16 = 28$, and $12 : 16 = 3 : 4$.", "$12 + 16 = 28$，而 $12 : 16 = 3 : 4$。"],
          [
            "Divide by the number of parts, not by one term. $28 \\div 3$ is not even a whole number.",
            "要除以总份数，不能只除以其中一项。$28 \\div 3$ 连整数都不是。",
          ],
        ],
        (rng) => {
          const th = rng.pick(things);
          const [a, b] = coprimePair(rng, 1, 9);
          const k = rng.int(2, 10);
          const total = (a + b) * k;
          const askA = rng.bool();
          const [mine, theirs] = askA ? [a, b] : [b, a];
          const answer = mine * k;
          const name = askA ? th.a : th.b;
          return valued(
            [
              `The ratio of ${th.a.en} to ${th.b.en} is $${ratio(a, b)}$, and there are $${total}$ of them altogether. How many ${name.en} are there?`,
              `${th.a["zh-CN"]}与${th.b["zh-CN"]}的比是 $${ratio(a, b)}$，一共有 $${total}$ 个。${name["zh-CN"]}有多少个？`,
            ],
            answer,
            [
              [["Count the parts", "数份数"], ["Add the terms:", "把各项相加："], [`${a} + ${b} = ${a + b}`]],
              [
                ["Find one part", "求一份"],
                [`Share $${total}$ among the parts:`, `把 $${total}$ 平均分成这些份：`],
                [`${total} \\div ${a + b} = ${k}`],
              ],
              [
                ["Multiply", "乘对应的项"],
                [`The ${name.en} are $${mine}$ parts:`, `${name["zh-CN"]}占 $${mine}$ 份：`],
                [`${mine} \\times ${k} = ${answer}`],
              ],
            ],
            [
              `The others are $${theirs} \\times ${k} = ${theirs * k}$, and $${answer} + ${theirs * k} = ${total}$.`,
              `另一种有 $${theirs} \\times ${k} = ${theirs * k}$ 个，而 $${answer} + ${theirs * k} = ${total}$。`,
            ],
            [
              [total - answer, `That is the other kind, the $${theirs}$ parts.`, `这是另一种的数量，占 $${theirs}$ 份。`],
              [k, `That is one part. The ${name.en} are $${mine}$ parts.`, `这是一份的数量。${name["zh-CN"]}占 $${mine}$ 份。`],
              [
                mine * (k + 1),
                `That makes each part $${k + 1}$, but $${total} \\div ${a + b} = ${k}$.`,
                `这把每份算成了 $${k + 1}$，但 $${total} \\div ${a + b} = ${k}$。`,
              ],
            ],
          );
        },
        barFigure(
          [
            { total: "12", pieces: [0, 1, 2].map(() => ({ size: 4, text: "4", lit: true })) },
            { total: "16", pieces: [0, 1, 2, 3].map(() => ({ size: 4, text: "4" })) },
          ],
          [
            "28 split into 3 + 4 = 7 equal parts of 4: 3 parts make 12 and 4 parts make 16.",
            "28 分成 3 + 4 = 7 份，每份 4：3 份是 12，4 份是 16。",
          ],
        ),
      ),
    ],
  ),
  [
    "A recipe uses $2$ eggs for every $3$ cups of flour. A baker has $12$ eggs. Since $12 = 2 \\times 6$, the recipe is made $6$ times over, with $3 \\times 6 = 18$ cups of flour.",
    "一份食谱每 $3$ 杯面粉配 $2$ 个鸡蛋。面包师有 $12$ 个鸡蛋。因为 $12 = 2 \\times 6$，要做 $6$ 份，需要 $3 \\times 6 = 18$ 杯面粉。",
  ],
  ["$12 : 18$ divided by $6$ is $2 : 3$.", "$12 : 18$ 两项都除以 $6$，得 $2 : 3$。"],
  ["find a quantity from the other one, and find the parts from a total.", "由一个量求另一个量，以及由总数求各部分。"],
);

export const furtherReasoningWithEquivalentRatios = withIntro(
  topic(
    "further-reasoning-with-equivalent-ratios",
    t("Further Reasoning With Equivalent Ratios", "用等比推理（进阶）"),
    t(
      "The difference between the terms also scales. With a ratio of $2 : 5$ and $21$ more of the second kind, the difference $3$ parts is $21$, so one part is $7$. A ratio of three quantities a : b : c works the same way, with a + b + c parts in all.",
      "两项之差也按同样倍数变化。比是 $2 : 5$，第二种多 $21$ 个，相差的 $3$ 份是 $21$，所以每份是 $7$。三个量的连比 a : b : c 也一样，总共有 a + b + c 份。",
    ),
    ["reasoning-with-equivalent-ratios"],
    ["6.RP.A.3"],
    [
      lesson(
        "scaling-from-the-difference",
        ["Finding a part from the difference", "由差求部分"],
        [
          [
            "When the difference is known, it matches the difference of the terms. Ratio $2 : 5$ with $21$ more tulips than roses: $5 - 2 = 3$ parts are $21$, one part is $7$, so there are $2 \\times 7 = 14$ roses.",
            "已知两数之差时，它对应两项之差。比为 $2 : 5$，郁金香比玫瑰多 $21$ 枝：$5 - 2 = 3$ 份是 $21$，每份 $7$，所以玫瑰有 $2 \\times 7 = 14$ 枝。",
          ],
          ["There are $5 \\times 7 = 35$ tulips, and $35 - 14 = 21$.", "郁金香有 $5 \\times 7 = 35$ 枝，而 $35 - 14 = 21$。"],
          [
            "The $21$ is the gap, not the total. Divide it by the difference of the terms, $3$, not by $2 + 5 = 7$.",
            "$21$ 是差，不是总数。要除以两项之差 $3$，不是 $2 + 5 = 7$。",
          ],
        ],
        (rng) => {
          const th = rng.pick(things);
          let a: number, b: number;
          do [a, b] = coprimePair(rng, 1, 9);
          while (a >= b);
          const k = rng.int(2, 12);
          const diff = (b - a) * k;
          const askA = rng.bool();
          const [mine, theirs] = askA ? [a, b] : [b, a];
          const answer = mine * k;
          const name = askA ? th.a : th.b;
          return valued(
            [
              `The ratio of ${th.a.en} to ${th.b.en} is $${ratio(a, b)}$. There are $${diff}$ more ${th.b.en} than ${th.a.en}. How many ${name.en} are there?`,
              `${th.a["zh-CN"]}与${th.b["zh-CN"]}的比是 $${ratio(a, b)}$。${th.b["zh-CN"]}比${th.a["zh-CN"]}多 $${diff}$ 个。${name["zh-CN"]}有多少个？`,
            ],
            answer,
            [
              [
                ["Match the difference", "对应差"],
                [`The gap is $${b} - ${a} = ${b - a}$ parts, so one part is:`, `相差 $${b} - ${a} = ${b - a}$ 份，所以一份是：`],
                [`${diff} \\div ${b - a} = ${k}`],
              ],
              [
                ["Multiply", "乘对应的项"],
                [`The ${name.en} are $${mine}$ parts:`, `${name["zh-CN"]}占 $${mine}$ 份：`],
                [`${mine} \\times ${k} = ${answer}`],
              ],
            ],
            [
              `$${b} \\times ${k} - ${a} \\times ${k} = ${b * k} - ${a * k} = ${diff}$, the difference given.`,
              `$${b} \\times ${k} - ${a} \\times ${k} = ${b * k} - ${a * k} = ${diff}$，正是已知的差。`,
            ],
            [
              [
                diff * mine,
                `That multiplies the gap by $${mine}$. First divide the gap by $${b - a}$ parts.`,
                `这是用差乘 $${mine}$。应该先用差除以 $${b - a}$ 份。`,
              ],
              [(a + b) * k, "That is the total of both kinds.", "这是两种的总数。"],
              [theirs * k, `That is the other kind, the $${theirs}$ parts.`, `这是另一种的数量，占 $${theirs}$ 份。`],
            ],
          );
        },
        tapeFigure(2, 5, ["A", "B"]),
      ),
      lesson(
        "three-part-ratios",
        ["Ratios of three quantities", "三个量的连比"],
        [
          [
            "A ratio of three quantities works like one of two: add all the terms to count the parts. Red, green and blue beads in the ratio $1 : 2 : 3$, $48$ beads in all: $1 + 2 + 3 = 6$ parts, each $48 \\div 6 = 8$. So there are $8$ red, $16$ green and $24$ blue.",
            "三个量的连比和两个量的比一样：把各项都加起来得到总份数。红、绿、蓝珠子的比是 $1 : 2 : 3$，共 $48$ 颗：$1 + 2 + 3 = 6$ 份，每份 $48 \\div 6 = 8$ 颗。所以红珠 $8$ 颗、绿珠 $16$ 颗、蓝珠 $24$ 颗。",
          ],
          ["$8 + 16 + 24 = 48$.", "$8 + 16 + 24 = 48$。"],
          ["Add all three terms. Using only $1 + 2 = 3$ parts leaves the blue beads out.", "三项都要加。只用 $1 + 2 = 3$ 份就漏掉了蓝珠。"],
        ],
        (rng) => {
          const a = rng.int(1, 5);
          const b = rng.int(1, 6);
          const c = rng.int(2, 7);
          const k = rng.int(2, 9);
          const parts = a + b + c;
          const total = parts * k;
          const which = rng.int(0, 2);
          const colors = [t("red", "红"), t("green", "绿"), t("blue", "蓝")] as const;
          const terms = [a, b, c] as const;
          const mine = terms[which] as number;
          const color = colors[which] as Text;
          const answer = mine * k;
          return valued(
            [
              `A bag holds red, green and blue beads in the ratio $${ratio(a, b, c)}$. There are $${total}$ beads. How many ${color.en} beads are there?`,
              `袋子里红、绿、蓝珠子的比是 $${ratio(a, b, c)}$，共 $${total}$ 颗。${color["zh-CN"]}珠子有多少颗？`,
            ],
            answer,
            [
              [["Count the parts", "数份数"], ["Add all three terms:", "三项相加："], [`${a} + ${b} + ${c} = ${parts}`]],
              [["Find one part", "求一份"], [`Share $${total}$ among them:`, `把 $${total}$ 平均分：`], [`${total} \\div ${parts} = ${k}`]],
              [
                ["Multiply", "乘对应的项"],
                [`The ${color.en} beads are $${mine}$ parts:`, `${color["zh-CN"]}珠子占 $${mine}$ 份：`],
                [`${mine} \\times ${k} = ${answer}`],
              ],
            ],
            [
              `$${a * k} + ${b * k} + ${c * k} = ${total}$ beads, all three colors together.`,
              `三种颜色合起来：$${a * k} + ${b * k} + ${c * k} = ${total}$ 颗。`,
            ],
            [
              [k, `That is one part. The ${color.en} beads are $${mine}$ parts.`, `这是一份的数量。${color["zh-CN"]}珠子占 $${mine}$ 份。`],
              [total - answer, "That is all the other beads together.", "这是其余珠子的总数。"],
              [
                mine * (k + 1),
                `That makes each part $${k + 1}$, but $${total} \\div ${parts} = ${k}$.`,
                `这把每份算成了 $${k + 1}$，但 $${total} \\div ${parts} = ${k}$。`,
              ],
            ],
          );
        },
        barFigure(
          [
            { total: "R", pieces: [{ size: 8, text: "8", lit: true }] },
            { total: "G", pieces: [0, 1].map(() => ({ size: 8, text: "8" })) },
            { total: "B", pieces: [0, 1, 2].map(() => ({ size: 8, text: "8" })) },
          ],
          [
            "Red, green and blue as 1, 2 and 3 parts of 8: 8, 16 and 24 beads, 48 in all.",
            "红、绿、蓝分别是 1、2、3 份，每份 8：8、16、24 颗，共 48 颗。",
          ],
        ),
      ),
    ],
  ),
  [
    "A garden has roses and tulips in the ratio $2 : 5$, and there are $21$ more tulips than roses. The tulips are $3$ parts ahead, so $3$ parts make $21$ flowers.",
    "花园里玫瑰与郁金香的比是 $2 : 5$，郁金香比玫瑰多 $21$ 枝。郁金香多出 $3$ 份，所以 $3$ 份是 $21$ 枝。",
  ],
  ["One part is $7$: $14$ roses and $35$ tulips, and $35 - 14 = 21$.", "一份是 $7$：玫瑰 $14$ 枝，郁金香 $35$ 枝，$35 - 14 = 21$。"],
  [
    "find quantities from the difference of a ratio and work with ratios of three quantities.",
    "由比的差求各个量，并解决三个量的连比问题。",
  ],
);

// ---------------------------------------------------------------------------
// Representing ratios

export const ratioTables = withIntro(
  topic(
    "ratio-tables",
    t("Ratio Tables", "比例表"),
    t(
      "A ratio table lists equivalent ratios in columns. Each column is found from another by multiplying or dividing both entries by the same number, or by adding two columns.",
      "比例表把相等的比按列排出。每一列可以由另一列的两个数同乘或同除以一个数得到，也可以把两列相加得到。",
    ),
    ["equivalent-ratios"],
    ["6.RP.A.3a"],
    [
      lesson(
        "completing-a-ratio-table",
        ["Completing a ratio table", "补全比例表"],
        [
          [
            "Every column of a ratio table is an equivalent ratio. Find what the top entry of the column was multiplied by, then do the same to the bottom. With $2, 4, 6$ on top and $5, 10, \\square$ below, $6 = 2 \\times 3$, so $\\square = 5 \\times 3 = 15$.",
            "比例表的每一列都是相等的比。先看这一列上面的数乘了几，再把下面的数也乘几。上行为 $2, 4, 6$，下行为 $5, 10, \\square$：$6 = 2 \\times 3$，所以 $\\square = 5 \\times 3 = 15$。",
          ],
          [
            "The bottom row is $\\frac{5}{2}$ of the top row, and $6 \\times \\frac{5}{2} = 15$.",
            "下行是上行的 $\\frac{5}{2}$ 倍，而 $6 \\times \\frac{5}{2} = 15$。",
          ],
          [
            "Do not just continue the pattern by adding. Each column comes from multiplying, not from adding a fixed step to the last one.",
            "不要只按加法接着往下写。每一列是由乘法得到的，不是在上一列上加一个固定的数。",
          ],
        ],
        (rng) => {
          const mix = rng.pick(mixes);
          const [a, b] = coprimePair(rng, 1, 9);
          const ks = rng.sample([1, 2, 3, 4, 5, 6, 8, 10], 4).sort((x, y) => x - y);
          const hole = rng.int(1, 3);
          const top = ks.map((k) => String(a * k));
          const bottom = ks.map((k, i) => (i === hole ? "\\square" : String(b * k)));
          const k = ks[hole] as number;
          const k0 = ks[0] as number;
          const before = ks[hole - 1] as number;
          return valued(
            [
              `The table shows amounts of ${mix.a.en} and ${mix.b.en} (in ${mix.unit.en}) mixed in the same ratio. Find the missing number. $$${tableLatex([mix.a.en, mix.b.en], top, bottom)}$$`,
              `下表是按相同比例混合的${mix.a["zh-CN"]}和${mix.b["zh-CN"]}的量（单位：${mix.unit["zh-CN"]}）。求缺少的数。$$${tableLatex([mix.a["zh-CN"], mix.b["zh-CN"]], top, bottom)}$$`,
            ],
            b * k,
            [
              [
                ["Find the simplest ratio", "求最简比"],
                [`The first column is $${ratio(a * k0, b * k0)}$, which is:`, `第一列是 $${ratio(a * k0, b * k0)}$，也就是：`],
                [`${ratio(a, b)}`],
              ],
              [
                ["Scale to the column", "按这一列扩大"],
                [
                  `The top entry is $${a * k} = ${a} \\times ${k}$, so multiply $${b}$ by $${k}$:`,
                  `上面的数 $${a * k} = ${a} \\times ${k}$，所以把 $${b}$ 乘 $${k}$：`,
                ],
                [`${b} \\times ${k} = ${b * k}`],
              ],
            ],
            [
              `The bottom row is $${Q.of(b, a).toLatex()}$ times the top row, and $${a * k} \\times ${Q.of(b, a).toLatex()} = ${b * k}$.`,
              `下行是上行的 $${Q.of(b, a).toLatex()}$ 倍，而 $${a * k} \\times ${Q.of(b, a).toLatex()} = ${b * k}$。`,
            ],
            [
              [
                a * k + (b - a),
                `That adds $${b - a}$ to the top entry. The bottom is a multiple of the top, not a fixed amount more.`,
                `这是在上面的数上加 $${b - a}$。下面的数是上面的倍数，不是多一个固定的数。`,
              ],
              [
                b * (k + 1),
                `That multiplies by $${k + 1}$, but the top entry is $${a}$ times $${k}$.`,
                `这是乘了 $${k + 1}$，但上面的数是 $${a}$ 的 $${k}$ 倍。`,
              ],
              [
                b * before + b,
                "That adds one more step to the column before. Columns come from multiplying.",
                "这是在前一列上加了一步。各列是由乘法得到的。",
              ],
            ],
          );
        },
        tableFigure(["2", "4", "6"], [5, 10, null]),
      ),
      lesson(
        "ratio-tables-through-the-unit-rate",
        ["Going through one unit", "先求一份"],
        [
          [
            "When the new amount is not a whole-number multiple of the old one, divide first to reach a smaller column, then multiply. $4$ cups of flour make $6$ muffins. For $10$ cups, divide both by $2$: $2$ cups make $3$ muffins. Then multiply by $5$: $10$ cups make $15$ muffins.",
            "新的量不是原来的整数倍时，先除到一个较小的列，再乘。$4$ 杯面粉做 $6$ 个松饼。求 $10$ 杯能做多少个：两项都除以 $2$，$2$ 杯做 $3$ 个。再乘 $5$：$10$ 杯做 $15$ 个。",
          ],
          ["Each cup makes $6 \\div 4 = 1.5$ muffins, and $10 \\times 1.5 = 15$.", "每杯做 $6 \\div 4 = 1.5$ 个，$10 \\times 1.5 = 15$。"],
          [
            "Adding the same amount to both rows does not keep the ratio. $10$ is $6$ more than $4$, but $6 + 6 = 12$ muffins is wrong.",
            "两行加上同一个数，比就变了。$10$ 比 $4$ 多 $6$，但 $6 + 6 = 12$ 个是错的。",
          ],
        ],
        (rng) => {
          const [p, q] = coprimePair(rng, 1, 7);
          const g = rng.int(2, 4);
          let m: number;
          do m = rng.int(2, 12);
          while (m % g === 0);
          const [a, b] = [p * g, q * g];
          const x = p * m;
          return valued(
            [
              `A recipe uses $${a}$ cups of flour for every $${b}$ muffins. Complete the ratio table: how many muffins can be made with $${x}$ cups of flour? $$${tableLatex(["flour (cups)", "muffins"], [String(a), String(x)], [String(b), "\\square"])}$$`,
              `一份食谱每 $${b}$ 个松饼用 $${a}$ 杯面粉。补全比例表：用 $${x}$ 杯面粉可以做多少个松饼？$$${tableLatex(["面粉（杯）", "松饼（个）"], [String(a), String(x)], [String(b), "\\square"])}$$`,
            ],
            q * m,
            [
              [
                ["Divide to a smaller column", "先除到较小的列"],
                [`Divide both entries by $${g}$:`, `两项都除以 $${g}$：`],
                [`${ratio(a, b)} = ${ratio(p, q)}`],
              ],
              [
                ["Multiply up", "再乘"],
                [`$${x} = ${p} \\times ${m}$, so multiply both by $${m}$:`, `$${x} = ${p} \\times ${m}$，所以两项都乘 $${m}$：`],
                [`${ratio(p, q)} = ${ratio(x, q * m)}`],
              ],
            ],
            [
              `Each cup makes $${Q.of(b, a).toLatex()}$ muffins, and $${x} \\times ${Q.of(b, a).toLatex()} = ${q * m}$.`,
              `每杯做 $${Q.of(b, a).toLatex()}$ 个，$${x} \\times ${Q.of(b, a).toLatex()} = ${q * m}$。`,
            ],
            [
              [
                x + (b - a),
                `That adds the same amount to both rows. The rows must be multiplied.`,
                `这是两行加上同一个数。两行应该乘同一个数。`,
              ],
              [
                b * m,
                `That multiplies $${b}$ by $${m}$ without dividing by $${g}$ first.`,
                `这是直接用 $${b}$ 乘 $${m}$，没有先除以 $${g}$。`,
              ],
              [
                q * (m + 1),
                `That multiplies by $${m + 1}$, but $${x} = ${p} \\times ${m}$.`,
                `这是乘了 $${m + 1}$，但 $${x} = ${p} \\times ${m}$。`,
              ],
            ],
          );
        },
        tableFigure(["4", "2", "10"], [6, 3, 15]),
      ),
    ],
  ),
  [
    "A ratio table keeps a recipe in step: $1$ bag of rice for $4$ people, $2$ bags for $8$, $3$ bags for $12$. Each column is the first column multiplied by the same number.",
    "比例表让配方保持比例：$1$ 袋米够 $4$ 人吃，$2$ 袋够 $8$ 人，$3$ 袋够 $12$ 人。每一列都是第一列乘同一个数。",
  ],
  ["Adding the first two columns gives $3$ bags for $12$ people, the third column.", "把前两列相加，得到 $3$ 袋对 $12$ 人，正是第三列。"],
  ["complete ratio tables, going through a smaller column when needed.", "补全比例表，必要时先求一个较小的列。"],
);

/** ratioGraph draws the points (ka, kb) of a ratio a : b for k = 1, 2, 3. */
function ratioGraph(a: number, b: number, view: number): Figure {
  const marks: PlaneMark[] = [1, 2, 3].map((k) => ({ kind: "point", at: [k * a, k * b], accent: true }));
  const step = view <= 12 ? 1 : 2;
  return {
    svg: plane({ xMin: 0, xMax: view, yMin: 0, yMax: view, step, labelEvery: view <= 12 ? 2 : 1 }, marks),
    alt: t(
      `Points (${a}, ${b}), (${2 * a}, ${2 * b}) and (${3 * a}, ${3 * b}) in the first quadrant.`,
      `第一象限中的点 (${a}, ${b})、(${2 * a}, ${2 * b}) 和 (${3 * a}, ${3 * b})。`,
    ),
  };
}

/** tapeFigure draws two tapes of a and b equal boxes, one above the other. */
export function tapeFigure(a: number, b: number, labels: readonly [string, string]): Figure {
  const box = 24;
  let body = "";
  [a, b].forEach((n, row) => {
    const y = 12 + row * 40;
    body += `<text x="30" y="${y + 17}">${labels[row]}</text>`;
    for (let i = 0; i < n; i++) body += `<rect class="accent" x="${60 + i * box}" y="${y}" width="${box}" height="${box}"/>`;
  });
  return {
    svg: svgDocument(92, body),
    alt: t(
      `A tape diagram: ${labels[0]} has ${a} equal boxes and ${labels[1]} has ${b}.`,
      `线段图：${labels[0]} 有 ${a} 个相等的格子，${labels[1]} 有 ${b} 个。`,
    ),
  };
}

export const graphingRatios = withIntro(
  topic(
    "graphing-ratios",
    t("Graphing Ratios", "比的图像"),
    t(
      "Each pair in a ratio table can be plotted as a point (x, y). The points of equivalent ratios lie on a straight line through the origin, so the graph can be extended to find new pairs.",
      "比例表中的每一对数都可以画成点 (x, y)。相等的比所对应的点在一条过原点的直线上，所以延长图像就能找到新的数对。",
    ),
    ["ratio-tables", "describing-the-coordinate-plane"],
    ["6.RP.A.3a"],
    [
      lesson(
        "reading-a-ratio-graph",
        ["Reading a ratio graph", "读比的图像"],
        [
          [
            "The points of a ratio graph are the columns of a ratio table. Read the first point to get the ratio, then scale it. If the points $(2, 3)$, $(4, 6)$ and $(6, 9)$ show $x$ to $y$, the ratio is $2 : 3$, and when $x = 10 = 2 \\times 5$, $y = 3 \\times 5 = 15$.",
            "比的图像上的点就是比例表的各列。先读出第一个点得到比，再按倍数扩大。如果点 $(2, 3)$、$(4, 6)$、$(6, 9)$ 表示 $x$ 与 $y$ 的比，比就是 $2 : 3$；当 $x = 10 = 2 \\times 5$ 时，$y = 3 \\times 5 = 15$。",
          ],
          [
            "The points rise by $3$ for every $2$ across: $9 + 3 + 3 = 15$ at $x = 10$.",
            "点每向右 $2$ 就向上 $3$：$x = 10$ 时 $y = 9 + 3 + 3 = 15$。",
          ],
          ["Read $x$ across and $y$ up. Swapping them gives the ratio $3 : 2$.", "$x$ 横着读，$y$ 竖着读。读反了就成了 $3 : 2$。"],
        ],
        (rng) => {
          const [a, b] = coprimePair(rng, 1, 4);
          const k = rng.int(4, 7);
          const view = Math.max(3 * a, 3 * b) + 1;
          return valued(
            [
              `The graph shows equivalent ratios of $x$ to $y$. What is $y$ when $x = ${a * k}$?`,
              `图中的点表示相等的 $x$ 与 $y$ 的比。当 $x = ${a * k}$ 时，$y$ 是多少？`,
            ],
            b * k,
            [
              [
                ["Read the ratio", "读出比"],
                [`The first point is $(${a}, ${b})$, so the ratio is:`, `第一个点是 $(${a}, ${b})$，所以比是：`],
                [ratio(a, b)],
              ],
              [
                ["Scale it", "按倍数扩大"],
                [`$${a * k} = ${a} \\times ${k}$, so:`, `$${a * k} = ${a} \\times ${k}$，所以：`],
                [`y = ${b} \\times ${k} = ${b * k}`],
              ],
            ],
            [
              `$${ratio(a * k, b * k)}$ divided by $${k}$ is $${ratio(a, b)}$, the first point.`,
              `$${ratio(a * k, b * k)}$ 两项都除以 $${k}$，得 $${ratio(a, b)}$，正是第一个点。`,
            ],
            [
              [
                a * k + (b - a),
                `That adds $${b - a}$ to $x$. On a ratio graph $y$ is a multiple of $x$.`,
                `这是给 $x$ 加上 $${b - a}$。比的图像上 $y$ 是 $x$ 的倍数。`,
              ],
              [a * k, "That copies $x$. The points do not have equal coordinates.", "这是照抄 $x$。图上的点两个坐标并不相等。"],
              [
                b * (k + 1),
                `That multiplies by $${k + 1}$, but $x$ is $${a}$ times $${k}$.`,
                `这是乘了 $${k + 1}$，但 $x$ 是 $${a}$ 的 $${k}$ 倍。`,
              ],
            ],
            { figure: ratioGraph(a, b, view) },
          );
        },
        drawn(gradeDrawings3["graphing-ratios#reading-a-ratio-graph"]),
      ),
      lesson(
        "points-on-a-ratio-graph",
        ["Which point belongs on the graph?", "哪个点在图像上？"],
        [
          [
            "The points of a ratio graph all form the same ratio, so they lie on one straight line through $(0, 0)$. To test a point, check that its coordinates form an equivalent ratio. For the ratio $2 : 3$, $(8, 12)$ belongs on the graph because $8 : 12 = 2 : 3$.",
            "比的图像上的点组成的比都相等，所以它们在一条经过 $(0, 0)$ 的直线上。判断一个点，就看它的两个坐标组成的比是否相等。对于比 $2 : 3$，点 $(8, 12)$ 在图像上，因为 $8 : 12 = 2 : 3$。",
          ],
          ["$(8, 12)$ is $(2, 3)$ with both coordinates multiplied by $4$.", "$(8, 12)$ 是把 $(2, 3)$ 的两个坐标都乘 $4$ 得到的。"],
          [
            "Adding the same number to both coordinates leaves the line. $(6, 7)$ is $(2, 3)$ plus $4$, but $6 : 7$ is not $2 : 3$.",
            "两个坐标加上同一个数，点就离开了直线。$(6, 7)$ 是 $(2, 3)$ 各加 $4$，但 $6 : 7$ 不等于 $2 : 3$。",
          ],
        ],
        (rng) => {
          const [a, b] = coprimePair(rng, 1, 7);
          const k = rng.int(3, 12);
          const wrong: MathWrong[] = [
            [
              `(${b * k}, ${a * k})`,
              `That swaps the coordinates: it shows $${ratio(b, a)}$.`,
              `这把坐标对调了：表示的是 $${ratio(b, a)}$。`,
            ],
            [
              `(${a * k}, ${b * k + 1})`,
              `At $x = ${a * k}$ the graph has $y = ${b * k}$, not $${b * k + 1}$.`,
              `$x = ${a * k}$ 时图像上 $y = ${b * k}$，不是 $${b * k + 1}$。`,
            ],
            [
              `(${a + k}, ${b + k})`,
              `That adds $${k}$ to both coordinates. Adding does not keep a ratio.`,
              `这是两个坐标都加 $${k}$。加法不能保持比不变。`,
            ],
            [
              `(${a * k}, ${b * (k - 1)})`,
              `The coordinates were multiplied by different numbers, $${k}$ and $${k - 1}$.`,
              `两个坐标乘的数不同，分别是 $${k}$ 和 $${k - 1}$。`,
            ],
          ];
          return chosenMath(
            rng,
            [
              `The points of a graph show equivalent ratios of $x$ to $y$, starting with $(${a}, ${b})$. Which point also belongs on the graph?`,
              `一个图像上的点表示相等的 $x$ 与 $y$ 的比，第一个点是 $(${a}, ${b})$。下面哪个点也在这个图像上？`,
            ],
            `(${a * k}, ${b * k})`,
            wrong.filter(([w]) => w !== `(${a * k}, ${b * k})`),
            [
              [
                ["Find the multiplier", "找出倍数"],
                [
                  `For each point, divide $x$ by $${a}$. For $(${a * k}, ${b * k})$:`,
                  `对每个点，用 $x$ 除以 $${a}$。对于 $(${a * k}, ${b * k})$：`,
                ],
                [`${a * k} \\div ${a} = ${k}`],
              ],
              [
                ["Check y", "检查 y"],
                [`$y$ must be $${b}$ times the same number:`, `$y$ 也必须是 $${b}$ 乘同一个数：`],
                [`${b} \\times ${k} = ${b * k}`],
              ],
            ],
            [
              `Cross products: $${a} \\times ${b * k} = ${a * b * k}$ and $${b} \\times ${a * k} = ${a * b * k}$, equal.`,
              `交叉相乘：$${a} \\times ${b * k} = ${a * b * k}$，$${b} \\times ${a * k} = ${a * b * k}$，相等。`,
            ],
          );
        },
        drawn(gradeDrawings3["graphing-ratios#points-on-a-ratio-graph"]),
      ),
    ],
  ),
  [
    "A ratio table of $2$ cups of rice for $3$ people can be drawn: $(2, 3)$, $(4, 6)$ and $(6, 9)$ are points that line up, straight toward $(0, 0)$.",
    "$2$ 杯米够 $3$ 人吃的比例表可以画出来：$(2, 3)$、$(4, 6)$、$(6, 9)$ 这些点排成一条直线，正对着 $(0, 0)$。",
  ],
  ["Each step right by $2$ goes up by $3$, the same ratio $2 : 3$.", "每向右 $2$ 就向上 $3$，比始终是 $2 : 3$。"],
  ["read ratios from a graph and decide which points belong on it.", "从图像中读出比，并判断哪些点在图像上。"],
);

export const tapeDiagrams = withIntro(
  topic(
    "tape-diagrams",
    t("Tape Diagrams", "线段图（条形图）"),
    t(
      "A tape diagram shows a ratio as rows of equal boxes: 3 : 5 is a row of 3 boxes and a row of 5 boxes of the same size. If the 8 boxes hold 40 in all, each box holds 5.",
      "线段图用一排排大小相同的格子表示比：3 : 5 就是一排 3 格、一排 5 格。如果 8 格一共是 40，那么每格是 5。",
    ),
    ["reasoning-with-equivalent-ratios"],
    ["6.RP.A.3"],
    [
      lesson(
        "tape-diagrams-with-a-total",
        ["Tape diagrams with a total", "已知总数的线段图"],
        [
          [
            "In a tape diagram every box is the same size. When the total is given, count all the boxes and divide to get one box. A has $3$ boxes, B has $5$, and the total is $40$: $8$ boxes make $40$, so one box is $5$ and B is $5 \\times 5 = 25$.",
            "线段图中每一格大小相同。已知总数时，数出一共几格，用除法求出一格。A 有 $3$ 格，B 有 $5$ 格，共 $40$：$8$ 格是 $40$，每格 $5$，所以 B 是 $5 \\times 5 = 25$。",
          ],
          ["A is $3 \\times 5 = 15$, and $15 + 25 = 40$.", "A 是 $3 \\times 5 = 15$，而 $15 + 25 = 40$。"],
          ["One box is not the answer. B is $5$ boxes, so multiply the box by $5$.", "一格不是答案。B 有 $5$ 格，所以要乘 $5$。"],
        ],
        (rng) => {
          const [a, b] = coprimePair(rng, 1, 7);
          const k = rng.int(3, 15);
          const total = (a + b) * k;
          const askA = rng.bool();
          const [mine, theirs] = askA ? [a, b] : [b, a];
          const name = askA ? "A" : "B";
          const answer = mine * k;
          return valued(
            [
              `The tape diagram shows the ratio of A to B. Together A and B are $${total}$. What is ${name}?`,
              `线段图表示 A 与 B 的比。A 与 B 的和是 $${total}$。${name} 是多少？`,
            ],
            answer,
            [
              [["Count the boxes", "数格子"], ["All the boxes:", "一共的格数："], [`${a} + ${b} = ${a + b}`]],
              [
                ["Find one box", "求一格"],
                [`$${a + b}$ boxes make $${total}$:`, `$${a + b}$ 格是 $${total}$：`],
                [`${total} \\div ${a + b} = ${k}`],
              ],
              [["Multiply", "乘格数"], [`${name} has $${mine}$ boxes:`, `${name} 有 $${mine}$ 格：`], [`${mine} \\times ${k} = ${answer}`]],
            ],
            [
              `The other tape is $${theirs} \\times ${k} = ${theirs * k}$, and $${answer} + ${theirs * k} = ${total}$.`,
              `另一段是 $${theirs} \\times ${k} = ${theirs * k}$，而 $${answer} + ${theirs * k} = ${total}$。`,
            ],
            [
              [k, `That is one box. ${name} has $${mine}$ boxes.`, `这是一格的值。${name} 有 $${mine}$ 格。`],
              [total - answer, `That is the other tape.`, `这是另一段的值。`],
              [
                mine * (k + 1),
                `That makes a box $${k + 1}$, but $${total} \\div ${a + b} = ${k}$.`,
                `这把一格算成了 $${k + 1}$，但 $${total} \\div ${a + b} = ${k}$。`,
              ],
            ],
            { figure: tapeFigure(a, b, ["A", "B"]) },
          );
        },
        drawn(gradeDrawings3["tape-diagrams#tape-diagrams-with-a-total"]),
      ),
      lesson(
        "tape-diagrams-with-a-difference",
        ["Tape diagrams with a difference", "已知差的线段图"],
        [
          [
            "When the difference is given, look only at the extra boxes: they are what makes one tape longer. A has $3$ boxes, B has $5$, and B is $12$ more than A. The $2$ extra boxes are $12$, so one box is $6$ and A is $3 \\times 6 = 18$.",
            "已知相差多少时，只看多出来的格子，正是它们让一段比另一段长。A 有 $3$ 格，B 有 $5$ 格，B 比 A 多 $12$。多出的 $2$ 格是 $12$，每格 $6$，所以 A 是 $3 \\times 6 = 18$。",
          ],
          ["B is $5 \\times 6 = 30$, and $30 - 18 = 12$.", "B 是 $5 \\times 6 = 30$，而 $30 - 18 = 12$。"],
          [
            "Divide the difference by the extra boxes only. $12 \\div 8$ would share it over all the boxes.",
            "差只除以多出的格数。$12 \\div 8$ 就是把差分给了所有格子。",
          ],
        ],
        (rng) => {
          let a: number, b: number;
          do [a, b] = coprimePair(rng, 1, 8);
          while (a >= b);
          const k = rng.int(3, 15);
          const diff = (b - a) * k;
          const askA = rng.bool();
          const [mine, theirs] = askA ? [a, b] : [b, a];
          const name = askA ? "A" : "B";
          const answer = mine * k;
          return valued(
            [
              `The tape diagram shows the ratio of A to B. B is $${diff}$ more than A. What is ${name}?`,
              `线段图表示 A 与 B 的比。B 比 A 多 $${diff}$。${name} 是多少？`,
            ],
            answer,
            [
              [["Count the extra boxes", "数多出的格子"], ["B has more boxes than A by:", "B 比 A 多的格数："], [`${b} - ${a} = ${b - a}`]],
              [["Find one box", "求一格"], [`They make $${diff}$:`, `它们是 $${diff}$：`], [`${diff} \\div ${b - a} = ${k}`]],
              [["Multiply", "乘格数"], [`${name} has $${mine}$ boxes:`, `${name} 有 $${mine}$ 格：`], [`${mine} \\times ${k} = ${answer}`]],
            ],
            [
              `The other tape is $${theirs} \\times ${k} = ${theirs * k}$, and $${b * k} - ${a * k} = ${diff}$.`,
              `另一段是 $${theirs} \\times ${k} = ${theirs * k}$，而 $${b * k} - ${a * k} = ${diff}$。`,
            ],
            [
              [k, `That is one box. ${name} has $${mine}$ boxes.`, `这是一格的值。${name} 有 $${mine}$ 格。`],
              [
                diff * mine,
                `That multiplies the difference by $${mine}$. First divide it by the $${b - a}$ extra boxes.`,
                `这是用差乘 $${mine}$。应该先除以多出的 $${b - a}$ 格。`,
              ],
              [(a + b) * k, "That is A and B together.", "这是 A 与 B 的和。"],
            ],
            { figure: tapeFigure(a, b, ["A", "B"]) },
          );
        },
        drawn(gradeDrawings3["tape-diagrams#tape-diagrams-with-a-difference"]),
      ),
    ],
  ),
  [
    "Mia and Sam share stickers in the ratio $3 : 5$. Draw Mia's tape as $3$ equal boxes and Sam's as $5$ boxes of the same size. If they have $40$ stickers, the $8$ boxes hold $40$.",
    "Mia 和 Sam 按 $3 : 5$ 分贴纸。Mia 的线段画 $3$ 个相同的格子，Sam 的画 $5$ 个同样大的格子。如果共有 $40$ 张贴纸，这 $8$ 格就是 $40$ 张。",
  ],
  [
    "One box is $40 \\div 8 = 5$: Mia has $15$ and Sam $25$, and $15 + 25 = 40$.",
    "一格是 $40 \\div 8 = 5$：Mia 有 $15$ 张，Sam 有 $25$ 张，$15 + 25 = 40$。",
  ],
  ["use tape diagrams to find quantities from a total or a difference.", "用线段图由总数或差求出各个量。"],
);

// ---------------------------------------------------------------------------
// Unit rates

/** Item is something sold by the piece. */
interface Item {
  readonly one: Text;
  readonly many: Text;
}

const items: readonly Item[] = [
  { one: t("notebook", "本笔记本"), many: t("notebooks", "本笔记本") },
  { one: t("ticket", "张票"), many: t("tickets", "张票") },
  { one: t("pen", "支笔"), many: t("pens", "支笔") },
  { one: t("bottle of water", "瓶水"), many: t("bottles of water", "瓶水") },
  { one: t("sandwich", "个三明治"), many: t("sandwiches", "个三明治") },
];

export const solvingProblemsUsingUnitRates = withIntro(
  topic(
    "solving-problems-using-unit-rates",
    t("Solving Problems Using Unit Rates", "用单位率解决问题"),
    t(
      "Find the unit rate first, then multiply. If 5 notebooks cost \\$15, one costs \\$3, so 8 cost \\$24. To find the better buy, compare the price of one item at each store.",
      "先求单位率，再相乘。5 本笔记本 15 美元，那么每本 3 美元，8 本就是 24 美元。比较哪家更划算，就比较每家单价。",
    ),
    ["unit-rates", "ratio-tables"],
    ["6.RP.A.2", "6.RP.A.3b"],
    [
      lesson(
        "scaling-with-the-unit-rate",
        ["Using the unit price", "用单价计算"],
        [
          [
            "A unit rate is the amount for one unit. Find it by dividing, then multiply by the number of units you need. $5$ notebooks cost $\\$15$, so one costs $\\$15 \\div 5 = \\$3$, and $8$ notebooks cost $8 \\times \\$3 = \\$24$.",
            "单位率是每一个单位对应的量。先用除法求出它，再乘需要的个数。$5$ 本笔记本 $\\$15$，每本 $\\$15 \\div 5 = \\$3$，所以 $8$ 本 $8 \\times \\$3 = \\$24$。",
          ],
          ["$8$ notebooks are $5$ notebooks and $3$ more: $\\$15 + \\$9 = \\$24$.", "$8$ 本是 $5$ 本再加 $3$ 本：$\\$15 + \\$9 = \\$24$。"],
          [
            "Price grows by multiplying, not by adding. $3$ more notebooks cost $\\$9$ more, not $\\$3$ more.",
            "总价是按乘法增长的，不是加法。多 $3$ 本要多 $\\$9$，不是多 $\\$3$。",
          ],
        ],
        (rng) => {
          const it = rng.pick(items);
          const unit = rng.int(2, 12);
          const n = rng.int(3, 9);
          let m: number;
          do m = rng.int(2, 15);
          while (m === n);
          return valued(
            [
              `$${n}$ ${it.many.en} cost $\\$${n * unit}$. At the same price, how many dollars do $${m}$ ${it.many.en} cost?`,
              `$${n}$ ${it.many["zh-CN"]}共 $\\$${n * unit}$。按同样的价格，$${m}$ ${it.many["zh-CN"]}要多少美元？`,
            ],
            m * unit,
            [
              [
                ["Find the unit price", "求单价"],
                ["Divide the cost by the number bought:", "用总价除以数量："],
                [`${n * unit} \\div ${n} = ${unit}`],
              ],
              [["Multiply", "相乘"], [`$${m}$ of them cost:`, `$${m}$ 个要：`], [`${m} \\times ${unit} = ${m * unit}`]],
            ],
            [
              `Compare with the first price: $${m * unit} \\div ${m} = ${unit}$ and $${n * unit} \\div ${n} = ${unit}$, the same price for one.`,
              `和原来的价格比较：$${m * unit} \\div ${m} = ${unit}$，$${n * unit} \\div ${n} = ${unit}$，单价相同。`,
            ],
            [
              [
                n * unit + (m - n),
                `That adds $${m - n}$ dollars for the change in number. Each one costs $\\$${unit}$.`,
                `这是数量变了多少就加多少美元。每个要 $\\$${unit}$。`,
              ],
              [unit, "That is the price of one, only the first step.", "这是一个的价格，只是第一步。"],
              [
                m * (unit + 1),
                `That uses a price of $\\$${unit + 1}$ each, but $${n * unit} \\div ${n} = ${unit}$.`,
                `这是按每个 $\\$${unit + 1}$ 算的，但 $${n * unit} \\div ${n} = ${unit}$。`,
              ],
            ],
          );
        },
        equalTape(5, "3", "15", 1),
      ),
      lesson(
        "comparing-unit-prices",
        ["Finding the better buy", "哪家更划算"],
        [
          [
            "To find the better buy, work out the price of one item at each store and compare. Store A sells $4$ pens for $\\$6$, which is $\\$1.50$ each; store B sells $6$ pens for $\\$8.40$, which is $\\$1.40$ each. Store B is the better buy.",
            "要比较哪家更划算，就分别求出每家的单价再比较。A 店 $4$ 支笔 $\\$6$，每支 $\\$1.50$；B 店 $6$ 支笔 $\\$8.40$，每支 $\\$1.40$。B 店更划算。",
          ],
          ["For $12$ pens, store A charges $\\$18$ and store B $\\$16.80$.", "买 $12$ 支笔，A 店要 $\\$18$，B 店要 $\\$16.80$。"],
          [
            "A lower total is not a lower price. Store A's $\\$6$ is less than $\\$8.40$, but it buys fewer pens.",
            "总价低不等于单价低。A 店的 $\\$6$ 比 $\\$8.40$ 少，但买到的笔也少。",
          ],
        ],
        (rng) => {
          const it = rng.pick(items);
          let pa: number, pb: number;
          do {
            pa = rng.int(11, 40) * 10;
            pb = rng.int(11, 40) * 10;
          } while (pa === pb);
          const na = rng.int(2, 8);
          let nb: number;
          do nb = rng.int(2, 8);
          while (nb === na);
          const cents = (c: number) => (c / 100).toFixed(2);
          const A: Pair = ["Store A", "A 店"];
          const B: Pair = ["Store B", "B 店"];
          const [win, lose, winP, loseP] = pa < pb ? [A, B, pa, pb] : [B, A, pb, pa];
          const both = na * nb;
          return chosen(
            rng,
            [
              `Store A sells $${na}$ ${it.many.en} for $\\$${cents(na * pa)}$. Store B sells $${nb}$ ${it.many.en} for $\\$${cents(nb * pb)}$. Which store has the lower price for one ${it.one.en}?`,
              `A 店 $${na}$ ${it.many["zh-CN"]}卖 $\\$${cents(na * pa)}$，B 店 $${nb}$ ${it.many["zh-CN"]}卖 $\\$${cents(nb * pb)}$。哪家店的单价更低？`,
            ],
            win,
            [
              [
                lose,
                `${lose[0]} charges $\\$${cents(loseP)}$ for one, more than $\\$${cents(winP)}$.`,
                `${lose[1]}每个 $\\$${cents(loseP)}$，比 $\\$${cents(winP)}$ 贵。`,
              ],
            ],
            [
              [
                ["Find each unit price", "分别求单价"],
                ["Divide each total by the number bought:", "用各自的总价除以数量："],
                [`${cents(na * pa)} \\div ${na} = ${cents(pa)}`, `${cents(nb * pb)} \\div ${nb} = ${cents(pb)}`],
              ],
              [
                ["Compare", "比较"],
                [
                  `$\\$${cents(winP)}$ is less than $\\$${cents(loseP)}$, so ${win[0]} is cheaper.`,
                  `$\\$${cents(winP)}$ 比 $\\$${cents(loseP)}$ 少，所以${win[1]}更便宜。`,
                ],
              ],
            ],
            [
              `For $${both}$ ${it.many.en}, store A charges $\\$${cents(both * pa)}$ and store B $\\$${cents(both * pb)}$.`,
              `买 $${both}$ ${it.many["zh-CN"]}，A 店要 $\\$${cents(both * pa)}$，B 店要 $\\$${cents(both * pb)}$。`,
            ],
          );
        },
        tableFigure(["A", "B"], [1.5, 1.4]),
      ),
    ],
  ),
  [
    "A shop sells $3$ apples for $\\$2.40$. To know what $5$ apples cost, first find one apple: $\\$2.40 \\div 3 = \\$0.80$.",
    "商店 $3$ 个苹果卖 $\\$2.40$。要知道 $5$ 个苹果多少钱，先求一个：$\\$2.40 \\div 3 = \\$0.80$。",
  ],
  [
    "$5$ apples cost $5 \\times \\$0.80 = \\$4$, and $\\$4 \\div 5 = \\$0.80$ again.",
    "$5$ 个苹果要 $5 \\times \\$0.80 = \\$4$，而 $\\$4 \\div 5$ 又是 $\\$0.80$。",
  ],
  ["use unit prices to find costs and to find the better buy.", "用单价求总价，并比较哪家更划算。"],
);

/** Mover is something that moves at a steady speed, with its units in both languages. */
interface Mover {
  readonly who: Text;
  readonly d: Text;
  readonly tu: Text;
  readonly per: Text;
  readonly lo: number;
  readonly hi: number;
}

const movers: readonly Mover[] = [
  { who: t("A car", "一辆汽车"), d: t("miles", "英里"), tu: t("hours", "小时"), per: t("miles per hour", "英里/小时"), lo: 30, hi: 70 },
  {
    who: t("A cyclist", "一名骑车人"),
    d: t("kilometers", "千米"),
    tu: t("hours", "小时"),
    per: t("kilometers per hour", "千米/小时"),
    lo: 12,
    hi: 25,
  },
  { who: t("A runner", "一名跑步者"), d: t("meters", "米"), tu: t("seconds", "秒"), per: t("meters per second", "米/秒"), lo: 4, hi: 9 },
];

export const speedAsAUnitRate = withIntro(
  topic(
    "speed-as-a-unit-rate",
    t("Speed as a Unit Rate", "速度是单位率"),
    t(
      "Speed is the distance traveled per unit of time: speed = distance ÷ time. A car that goes $150$ miles in $3$ hours travels $50$ miles per hour, so in $5$ hours it goes $250$ miles.",
      "速度是单位时间内走过的路程：速度 = 路程 ÷ 时间。汽车 $3$ 小时行驶 $150$ 英里，速度是每小时 $50$ 英里，$5$ 小时能行驶 $250$ 英里。",
    ),
    ["solving-problems-using-unit-rates"],
    ["6.RP.A.2", "6.RP.A.3b"],
    [
      lesson(
        "finding-a-speed",
        ["Finding a speed", "求速度"],
        [
          [
            "Speed is a unit rate: the distance traveled in one unit of time. Divide the distance by the time. $150$ miles in $3$ hours is $150 \\div 3 = 50$ miles per hour.",
            "速度是一种单位率：单位时间内所行的路程。用路程除以时间。$3$ 小时行驶 $150$ 英里，速度是 $150 \\div 3 = 50$ 英里/小时。",
          ],
          ["$50$ miles each hour for $3$ hours: $50 \\times 3 = 150$ miles.", "每小时 $50$ 英里，$3$ 小时：$50 \\times 3 = 150$ 英里。"],
          [
            "Divide the distance by the time, not the time by the distance. $3 \\div 150$ is a tiny number, not a speed.",
            "要用路程除以时间，不能用时间除以路程。$3 \\div 150$ 很小，不是速度。",
          ],
        ],
        (rng) => {
          const kind = rng.pick(movers);
          const v = rng.int(kind.lo, kind.hi);
          const time = rng.int(2, 9);
          return valued(
            [
              `${kind.who.en} travels $${v * time}$ ${kind.d.en} in $${time}$ ${kind.tu.en} at a constant speed. What is its speed in ${kind.per.en}?`,
              `${kind.who["zh-CN"]}匀速行驶，$${time}$ ${kind.tu["zh-CN"]}行驶了 $${v * time}$ ${kind.d["zh-CN"]}。速度是多少${kind.per["zh-CN"]}？`,
            ],
            v,
            [
              [
                ["Recall the rule", "写出关系"],
                ["Speed is distance per unit of time:", "速度是单位时间的路程："],
                ["\\text{speed} = \\text{distance} \\div \\text{time}"],
              ],
              [["Divide", "相除"], ["Put in the numbers:", "代入数："], [`${v * time} \\div ${time} = ${v}`]],
            ],
            [
              `At $${v}$ ${kind.per.en}, $${time}$ ${kind.tu.en} cover $${v} \\times ${time} = ${v * time}$ ${kind.d.en}.`,
              `以 $${v}$ ${kind.per["zh-CN"]}的速度，$${time}$ ${kind.tu["zh-CN"]}行驶 $${v} \\times ${time} = ${v * time}$ ${kind.d["zh-CN"]}。`,
            ],
            [
              [v * time * time, "That multiplies the distance by the time. Divide instead.", "这是用路程乘时间。应该相除。"],
              [v + time, "That is not a quotient. Divide the distance by the time.", "这不是商。应该用路程除以时间。"],
              [v * time - time, "That subtracts the time from the distance. Divide instead.", "这是用路程减时间。应该相除。"],
            ],
          );
        },
        equalTape(3, "50", "150", 1),
      ),
      lesson(
        "using-a-speed",
        ["Using a speed", "用速度求路程或时间"],
        [
          [
            "From a speed you can find a distance or a time. Distance is speed times time; time is distance divided by speed. At $50$ miles per hour, $5$ hours cover $50 \\times 5 = 250$ miles, and $400$ miles take $400 \\div 50 = 8$ hours.",
            "知道速度，就能求路程或时间：路程 = 速度 × 时间，时间 = 路程 ÷ 速度。以 $50$ 英里/小时的速度，$5$ 小时行驶 $50 \\times 5 = 250$ 英里，$400$ 英里需要 $400 \\div 50 = 8$ 小时。",
          ],
          ["$250 \\div 5 = 50$, the speed again.", "$250 \\div 5 = 50$，又得到速度。"],
          [
            "Check which quantity is asked for. For a time, divide the distance by the speed; multiplying would give a far too large number.",
            "看清求的是什么。求时间要用路程除以速度；相乘会得到大得离谱的数。",
          ],
        ],
        (rng) => {
          const v = rng.int(4, 15) * 5;
          const time = rng.int(2, 9);
          if (rng.bool())
            return valued(
              [
                `A train travels at a constant speed of $${v}$ miles per hour. How many miles does it travel in $${time}$ hours?`,
                `一列火车以 $${v}$ 英里/小时的速度匀速行驶。$${time}$ 小时行驶多少英里？`,
              ],
              v * time,
              [
                [
                  ["Choose the rule", "选择关系"],
                  ["For a distance:", "求路程："],
                  ["\\text{distance} = \\text{speed} \\times \\text{time}"],
                ],
                [["Multiply", "相乘"], ["Put in the numbers:", "代入数："], [`${v} \\times ${time} = ${v * time}`]],
              ],
              [
                `$${v * time} \\div ${time} = ${v}$ miles per hour, the speed given.`,
                `$${v * time} \\div ${time} = ${v}$ 英里/小时，正是已知的速度。`,
              ],
              [
                [v + time, "That adds the speed and the time. Multiply them.", "这是把速度和时间相加。应该相乘。"],
                [v * (time + 1), `That is the distance for $${time + 1}$ hours.`, `这是 $${time + 1}$ 小时的路程。`],
                [Math.round(v / time), "That divides the speed by the time. Multiply them.", "这是用速度除以时间。应该相乘。"],
              ],
            );
          return valued(
            [
              `A train travels at a constant speed of $${v}$ miles per hour. How many hours does it take to travel $${v * time}$ miles?`,
              `一列火车以 $${v}$ 英里/小时的速度匀速行驶。行驶 $${v * time}$ 英里需要多少小时？`,
            ],
            time,
            [
              [["Choose the rule", "选择关系"], ["For a time:", "求时间："], ["\\text{time} = \\text{distance} \\div \\text{speed}"]],
              [["Divide", "相除"], ["Put in the numbers:", "代入数："], [`${v * time} \\div ${v} = ${time}`]],
            ],
            [
              `In $${time}$ hours the train goes $${v} \\times ${time} = ${v * time}$ miles.`,
              `$${time}$ 小时火车行驶 $${v} \\times ${time} = ${v * time}$ 英里。`,
            ],
            [
              [
                time + 1,
                `In $${time + 1}$ hours the train would go $${v * (time + 1)}$ miles.`,
                `$${time + 1}$ 小时火车会行驶 $${v * (time + 1)}$ 英里。`,
              ],
              [
                time * 2,
                `In $${time * 2}$ hours the train would go $${v * time * 2}$ miles.`,
                `$${time * 2}$ 小时火车会行驶 $${v * time * 2}$ 英里。`,
              ],
              [v, "That is the speed, not the time.", "这是速度，不是时间。"],
            ],
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 250,
            step: 50,
            labels: [0, 50, 100, 150, 200, 250],
            jumps: [
              [0, 50],
              [50, 100],
              [100, 150],
              [150, 200],
              [200, 250],
            ],
            marks: [{ at: 250, text: "250", result: true }],
          },
          ["Five jumps of 50 miles, one for each hour, reach 250 miles.", "每小时跳 50 英里，跳 5 次到 250 英里。"],
        ),
      ),
    ],
  ),
  [
    "A cyclist rides $36$ kilometers in $2$ hours. Her speed is how far she goes in one hour: $36 \\div 2 = 18$ kilometers per hour.",
    "一名骑车人 $2$ 小时骑了 $36$ 千米。她的速度就是一小时骑多远：$36 \\div 2 = 18$ 千米/小时。",
  ],
  [
    "$18$ kilometers each hour for $2$ hours is $18 \\times 2 = 36$ kilometers.",
    "每小时 $18$ 千米，$2$ 小时就是 $18 \\times 2 = 36$ 千米。",
  ],
  ["find speeds as unit rates and use them to find distances and times.", "把速度当作单位率来求，并用它求路程和时间。"],
);

// ---------------------------------------------------------------------------
// Introduction to percentages

/** gridFigure draws a 10-by-10 grid with the first n squares shaded. */
function gridFigure(n: number): Figure {
  const s = 16;
  let body = "";
  for (let i = 0; i < 100; i++) {
    const [r, c] = [Math.floor(i / 10), i % 10];
    const fill = i < n ? ' class="accent" fill="currentColor" fill-opacity="0.35"' : "";
    body += `<rect x="${80 + c * s}" y="${8 + r * s}" width="${s}" height="${s}"${fill}/>`;
  }
  return {
    svg: svgDocument(176, body),
    alt: t(
      `A 10-by-10 grid of squares with ${Math.floor(n / 10)} full rows shaded${n % 10 === 0 ? "" : ` and ${n % 10} more squares shaded in the next row`}.`,
      `一个 10 × 10 的方格图，涂色的有 ${Math.floor(n / 10)} 个整行${n % 10 === 0 ? "" : `，下一行另有 ${n % 10} 格`}。`,
    ),
  };
}

/** barFigure draws a bar split into d equal parts with the first k shaded. */
function percentBar(d: number, k: number): Figure {
  const w = 280 / d;
  let body = "";
  for (let i = 0; i < d; i++) {
    const fill = i < k ? ' class="accent" fill="currentColor" fill-opacity="0.35"' : "";
    body += `<rect x="${20 + i * w}" y="10" width="${Math.round(w * 100) / 100}" height="30"${fill}/>`;
  }
  return {
    svg: svgDocument(50, body),
    alt: t(`A bar split into ${d} equal parts with ${k} parts shaded.`, `一个长条平均分成 ${d} 份，其中 ${k} 份涂色。`),
  };
}

export const understandingPercentagesUsingModels = withIntro(
  topic(
    "understanding-percentages-using-models",
    t("Understanding Percentages Using Models", "用模型理解百分数"),
    t(
      "Percent means “per hundred”: $37\\%$ is $37$ out of $100$. On a $10$-by-$10$ grid, $37$ shaded squares show $37\\%$. A bar split into $4$ equal parts with $1$ part shaded shows $\\frac{1}{4} = \\frac{25}{100} = 25\\%$.",
      "百分数表示“每一百中的多少”：$37\\%$ 就是 $100$ 份中的 $37$ 份。在 $10 \\times 10$ 的方格图中，涂色 $37$ 格表示 $37\\%$。一个长条平均分成 $4$ 份，涂色 $1$ 份，表示 $\\frac{1}{4} = \\frac{25}{100} = 25\\%$。",
    ),
    ["equivalent-fractions", "decimal-fractions"],
    ["6.RP.A.3c"],
    [
      lesson(
        "percent-from-a-hundred-grid",
        ["Percent on a hundred grid", "百格图中的百分数"],
        [
          [
            "Percent means “out of $100$”. A hundred grid has $100$ equal squares, so the number of shaded squares is the percent. Count the full rows of $10$, then the extra squares: $4$ rows and $2$ more are $42$ squares, which is $42\\%$.",
            "百分数表示“每一百份中占几份”。百格图有 $100$ 个相等的小方格，涂色的格数就是百分数。先数整行（每行 $10$ 格），再数多出的格子：$4$ 行加 $2$ 格是 $42$ 格，就是 $42\\%$。",
          ],
          ["The unshaded squares are $58$, and $42 + 58 = 100$.", "没涂色的有 $58$ 格，而 $42 + 58 = 100$。"],
          [
            "Count the shaded squares, not the white ones. $58\\%$ is the part left white.",
            "要数涂色的格子，不是白色的。$58\\%$ 是没涂色的部分。",
          ],
        ],
        (rng) => {
          const n = rng.int(3, 97);
          const rows = Math.floor(n / 10);
          return valued(
            ["What percent of the grid is shaded?", "方格图中涂色部分占百分之几？"],
            n,
            [
              [
                ["Count full rows", "数整行"],
                [`There are $${rows}$ full rows of $10$:`, `有 $${rows}$ 个整行，每行 $10$ 格：`],
                [`${rows} \\times 10 = ${rows * 10}`],
              ],
              [
                ["Add the extra squares", "加上多出的格子"],
                [`and $${n % 10}$ more, out of $100$:`, `再加 $${n % 10}$ 格，共 $100$ 格：`],
                [`${rows * 10} + ${n % 10} = ${n}`],
              ],
            ],
            [`$${100 - n}$ squares are white, and $${n} + ${100 - n} = 100$.`, `白色的有 $${100 - n}$ 格，而 $${n} + ${100 - n} = 100$。`],
            [
              [100 - n, "That counts the white squares.", "这数的是白色的格子。"],
              [n + 10, "That counts one row too many.", "这多数了一行。"],
              [rows, "That counts only the full rows, not the squares in them.", "这只数了整行的行数，不是格数。"],
            ],
            { percent: true, form: "integer", figure: gridFigure(n) },
          );
        },
        gridFigure(42),
      ),
      lesson(
        "percent-from-a-bar-model",
        ["Percent on a bar model", "长条模型中的百分数"],
        [
          [
            "When a bar is not cut into $100$ parts, write the shaded part as a fraction, then rewrite it with denominator $100$. The numerator is the percent. A bar of $5$ equal parts with $2$ shaded shows $\\frac{2}{5} = \\frac{40}{100} = 40\\%$.",
            "长条没有分成 $100$ 份时，先把涂色部分写成分数，再化成分母是 $100$ 的分数，分子就是百分数。长条平均分成 $5$ 份，涂色 $2$ 份，表示 $\\frac{2}{5} = \\frac{40}{100} = 40\\%$。",
          ],
          ["Each fifth is $100\\% \\div 5 = 20\\%$, and $2$ fifths are $40\\%$.", "每一份是 $100\\% \\div 5 = 20\\%$，$2$ 份是 $40\\%$。"],
          [
            "The number of shaded parts is not the percent. $2$ parts of $5$ is $40\\%$, not $2\\%$.",
            "涂色的份数不是百分数。$5$ 份中的 $2$ 份是 $40\\%$，不是 $2\\%$。",
          ],
        ],
        (rng) => {
          const d = rng.pick([2, 4, 5, 10, 20, 25]);
          const k = rng.int(1, d - 1);
          const pct = (k * 100) / d;
          return valued(
            ["The bar is split into equal parts. What percent of the bar is shaded?", "长条被平均分成若干份。涂色部分占百分之几？"],
            pct,
            [
              [["Write a fraction", "写成分数"], [`$${k}$ of $${d}$ equal parts are shaded:`, `$${d}$ 份中有 $${k}$ 份涂色：`], [fr(k, d)]],
              [
                ["Make the denominator 100", "化成分母 100"],
                [`Multiply both by $${100 / d}$:`, `分子分母都乘 $${100 / d}$：`],
                [`${fr(k, d)} = ${fr(pct, 100)} = ${pct}\\%`],
              ],
            ],
            [
              `Each part is $100\\% \\div ${d} = ${dec(Q.of(100, d))}\\%$, and $${k}$ parts make $${pct}\\%$.`,
              `每一份是 $100\\% \\div ${d} = ${dec(Q.of(100, d))}\\%$，$${k}$ 份是 $${pct}\\%$。`,
            ],
            [
              [k, "That counts the shaded parts. Turn them into hundredths first.", "这是涂色的份数。要先化成百分之几。"],
              [100 - pct, "That is the unshaded part.", "这是没涂色的部分。"],
              [
                k * 10,
                `That treats each part as $10\\%$, but there are $${d}$ parts, not $10$.`,
                `这把每份当成 $10\\%$，但一共有 $${d}$ 份，不是 $10$ 份。`,
              ],
            ],
            { percent: true, form: "integer", figure: percentBar(d, k) },
          );
        },
        drawn(gradeDrawings3["understanding-percentages-using-models#percent-from-a-bar-model"]),
      ),
    ],
  ),
  [
    "In a class survey, $100$ students each colored one square of a big grid: a shaded square for each student who walks to school. $37$ squares are shaded, so $37\\%$ of the students walk.",
    "一次班级调查中，$100$ 名学生每人在大方格图上涂一格：走路上学的学生涂色。有 $37$ 格涂色，所以 $37\\%$ 的学生走路上学。",
  ],
  ["$63$ squares are white, and $37 + 63 = 100$.", "白色的有 $63$ 格，而 $37 + 63 = 100$。"],
  ["read percents from hundred grids and bar models.", "从百格图和长条模型中读出百分数。"],
);

/** nicePercent draws a fraction k/d whose percent is a whole number, with d one of the denominators that divide 100. */
function nicePercent(rng: Rng): { k: number; d: number; pct: number } {
  const d = rng.pick([2, 4, 5, 10, 20, 25, 50]);
  let k: number;
  do k = rng.int(1, d - 1);
  while (gcd(k, d) !== 1);
  return { k, d, pct: (k * 100) / d };
}

export const convertingBetweenPercentagesAndFractions = withIntro(
  topic(
    "converting-between-percentages-and-fractions",
    t("Converting Between Percentages and Fractions", "百分数与分数互化"),
    t(
      "A percent is a fraction with denominator 100: 35% = 35/100 = 7/20. To write a fraction as a percent, find an equivalent fraction with denominator 100: 3/4 = 75/100 = 75%.",
      "百分数就是分母为 100 的分数：35% = 35/100 = 7/20。把分数化成百分数，先化成分母为 100 的分数：3/4 = 75/100 = 75%。",
    ),
    ["understanding-percentages-using-models", "writing-fractions-in-lowest-terms"],
    ["6.RP.A.3c"],
    [
      lesson(
        "percent-to-fraction",
        ["Percent to fraction", "百分数化成分数"],
        [
          [
            "To write a percent as a fraction, put the number over $100$ and simplify. $35\\% = \\frac{35}{100}$, and dividing both by $5$ gives $\\frac{7}{20}$.",
            "把百分数化成分数，就把百分号前的数写在 $100$ 上面，再约分。$35\\% = \\frac{35}{100}$，分子分母同时除以 $5$，得 $\\frac{7}{20}$。",
          ],
          [
            "$\\frac{7}{20} = \\frac{7 \\times 5}{20 \\times 5} = \\frac{35}{100}$.",
            "$\\frac{7}{20} = \\frac{7 \\times 5}{20 \\times 5} = \\frac{35}{100}$。",
          ],
          ["The denominator is $100$, not $10$. $\\frac{35}{10}$ is $350\\%$.", "分母是 $100$，不是 $10$。$\\frac{35}{10}$ 是 $350\\%$。"],
        ],
        (rng) => {
          let p: number;
          do p = rng.int(1, 99);
          while (p % 10 === 0 && rng.bool(0.5));
          const g = gcd(p, 100);
          const [n, d] = [p / g, 100 / g];
          return valued(
            [`Write $${p}\\%$ as a fraction in simplest form.`, `把 $${p}\\%$ 写成最简分数。`],
            Q.of(p, 100),
            [
              [["Write over 100", "写成分母 100"], ["Percent means hundredths:", "百分数表示百分之几："], [`${p}\\% = ${fr(p, 100)}`]],
              [
                ["Simplify", "约分"],
                g > 1
                  ? [`Divide both by $${g}$:`, `分子分母都除以 $${g}$：`]
                  : ["There is no common factor, so it is already simplest:", "没有公因数，已经是最简分数："],
                [g > 1 ? `${fr(p, 100)} = ${fr(n, d)}` : fr(p, 100)],
              ],
            ],
            [
              `$${fr(n, d)}$ times $${fr(g, g)}$ is $${fr(p, 100)}$, which is $${p}\\%$.`,
              `$${fr(n, d)}$ 的分子分母都乘 $${g}$，得 $${fr(p, 100)}$，就是 $${p}\\%$。`,
            ],
            [
              [Q.of(p, 10), "That puts the number over $10$. Percent means hundredths.", "这是把数写在 $10$ 上面。百分数表示百分之几。"],
              [Q.of(100, p), "That is upside down: $100$ goes on the bottom.", "这颠倒了：$100$ 应该作分母。"],
              [Q.of(1, p), "That puts the number on the bottom.", "这把数放在了分母上。"],
            ],
            { form: "fraction" },
          );
        },
        gridFigure(35),
      ),
      lesson(
        "fraction-to-percent",
        ["Fraction to percent", "分数化成百分数"],
        [
          [
            "To write a fraction as a percent, make an equivalent fraction with denominator $100$; the numerator is the percent. $\\frac{3}{4} = \\frac{75}{100} = 75\\%$, multiplying the numerator and denominator by $25$.",
            "把分数化成百分数，就把它化成分母是 $100$ 的分数，分子就是百分数。$\\frac{3}{4} = \\frac{75}{100} = 75\\%$（分子分母同乘 $25$）。",
          ],
          ["Each quarter is $25\\%$, and $3$ quarters are $75\\%$.", "每个四分之一是 $25\\%$，$3$ 个是 $75\\%$。"],
          ["Multiply the numerator too. $\\frac{3}{4}$ is not $3\\%$.", "分子也要乘。$\\frac{3}{4}$ 不是 $3\\%$。"],
        ],
        (rng) => {
          const { k, d, pct } = nicePercent(rng);
          const m = 100 / d;
          return valued(
            [`Write $${fr(k, d)}$ as a percent.`, `把 $${fr(k, d)}$ 写成百分数。`],
            pct,
            [
              [["Find the multiplier", "找出乘数"], [`To make the denominator $100$:`, `要把分母化成 $100$：`], [`100 \\div ${d} = ${m}`]],
              [
                ["Multiply both", "分子分母同乘"],
                [`Multiply by $${m}$ and read the numerator:`, `都乘 $${m}$，读出分子：`],
                [`${fr(k, d)} = ${fr(pct, 100)} = ${pct}\\%`],
              ],
            ],
            [
              `$${pct}\\% = ${fr(pct, 100)}$, which simplifies back to $${fr(k, d)}$.`,
              `$${pct}\\% = ${fr(pct, 100)}$，约分后又是 $${fr(k, d)}$。`,
            ],
            [
              [k, "That keeps the numerator as it is. Multiply it as well.", "这是分子没变。分子也要乘。"],
              [k * d, "That multiplies the numerator by the denominator.", "这是用分子乘分母。"],
              [Math.round((d * 100) / k), "That turns the fraction upside down.", "这把分数颠倒了。"],
            ],
            { percent: true, form: "integer" },
          );
        },
        percentBar(4, 3),
      ),
    ],
  ),
  [
    "A store sign says $25\\%$ of the shirts are on sale. That is $\\frac{25}{100}$, or $\\frac{1}{4}$: one shirt in every four.",
    "商店的牌子上写着 $25\\%$ 的衬衫打折。那就是 $\\frac{25}{100}$，即 $\\frac{1}{4}$：每四件中有一件。",
  ],
  ["Four quarters make $4 \\times 25\\% = 100\\%$.", "四个四分之一是 $4 \\times 25\\% = 100\\%$。"],
  ["write percents as fractions and fractions as percents.", "把百分数化成分数，把分数化成百分数。"],
);

export const convertingBetweenPercentagesAndDecimals = withIntro(
  topic(
    "converting-between-percentages-and-decimals",
    t("Converting Between Percentages and Decimals", "百分数与小数互化"),
    t(
      "Since percent means hundredths, divide by 100 to go from a percent to a decimal (45% = 0.45, 7% = 0.07) and multiply by 100 to go back (0.6 = 60%, 1.25 = 125%).",
      "百分数表示百分之几，所以百分数化小数要除以 100（45% = 0.45，7% = 0.07），小数化百分数要乘 100（0.6 = 60%，1.25 = 125%）。",
    ),
    ["understanding-percentages-using-models", "multiplying-decimals-by-powers-of-ten-using-decimal-point-placement"],
    ["6.RP.A.3c"],
    [
      lesson(
        "percent-to-decimal",
        ["Percent to decimal", "百分数化成小数"],
        [
          [
            "A percent is a number of hundredths, so to write it as a decimal divide by $100$: move the decimal point two places to the left, writing zeros if needed. $45\\% = 0.45$, $7\\% = 0.07$ and $130\\% = 1.3$.",
            "百分数表示百分之几，所以化成小数要除以 $100$：小数点向左移动两位，位数不够时补 $0$。$45\\% = 0.45$，$7\\% = 0.07$，$130\\% = 1.3$。",
          ],
          [
            "$0.07 \\times 100 = 7$, so $0.07$ is $7$ hundredths, $7\\%$.",
            "$0.07 \\times 100 = 7$，所以 $0.07$ 是 $7$ 个百分之一，即 $7\\%$。",
          ],
          [
            "Move the point two places, not one. $0.7$ is $70\\%$, not $7\\%$.",
            "小数点要移两位，不是一位。$0.7$ 是 $70\\%$，不是 $7\\%$。",
          ],
        ],
        (rng) => {
          const tenths = rng.pick([rng.int(1, 9) * 10, rng.int(11, 99) * 10, rng.int(101, 250) * 10, rng.int(10, 999)]);
          const pq = Q.of(tenths, 10);
          const v = pq.div(Q.of(100));
          const ps = dec(pq);
          return valued(
            [`Write $${ps}\\%$ as a decimal.`, `把 $${ps}\\%$ 写成小数。`],
            v,
            [
              [
                ["Write as hundredths", "写成百分之几"],
                ["Percent means divide by $100$:", "百分数就是除以 $100$："],
                [`${ps}\\% = ${ps} \\div 100`],
              ],
              [
                ["Move the point", "移动小数点"],
                ["Move it two places to the left:", "小数点向左移动两位："],
                [`${ps} \\div 100 = ${dec(v)}`],
              ],
            ],
            [
              `$${dec(v)} \\times 100 = ${ps}$, so $${dec(v)}$ is $${ps}\\%$.`,
              `$${dec(v)} \\times 100 = ${ps}$，所以 $${dec(v)}$ 就是 $${ps}\\%$。`,
            ],
            [
              [v.mul(Q.of(10)), "That moves the point only one place.", "这只把小数点移了一位。"],
              [v.div(Q.of(10)), "That moves the point three places.", "这把小数点移了三位。"],
              [pq, "That drops the percent sign without dividing by $100$.", "这只是去掉了百分号，没有除以 $100$。"],
            ],
            { form: "decimal" },
          );
        },
        gridFigure(45),
      ),
      lesson(
        "decimal-to-percent",
        ["Decimal to percent", "小数化成百分数"],
        [
          [
            "To write a decimal as a percent, multiply by $100$: move the decimal point two places to the right and add the percent sign. $0.6 = 60\\%$, $0.035 = 3.5\\%$ and $1.25 = 125\\%$.",
            "把小数化成百分数，就乘 $100$：小数点向右移动两位，再添上百分号。$0.6 = 60\\%$，$0.035 = 3.5\\%$，$1.25 = 125\\%$。",
          ],
          ["$125\\% = 125 \\div 100 = 1.25$.", "$125\\% = 125 \\div 100 = 1.25$。"],
          [
            "A number greater than $1$ is more than $100\\%$. $1.25$ is $125\\%$, not $12.5\\%$.",
            "大于 $1$ 的数化成百分数后大于 $100\\%$。$1.25$ 是 $125\\%$，不是 $12.5\\%$。",
          ],
        ],
        (rng) => {
          const n = rng.pick([rng.int(1, 9) * 10, rng.int(1, 99), rng.int(101, 250), rng.int(1, 99) * 10 + rng.int(1, 9)]);
          const p = rng.bool(0.25) ? 3 : 2;
          const v = Q.of(n, 10 ** p);
          const pct = v.mul(Q.of(100));
          return valued(
            [`Write $${dec(v)}$ as a percent.`, `把 $${dec(v)}$ 写成百分数。`],
            pct,
            [
              [
                ["Multiply by 100", "乘 100"],
                ["Move the point two places to the right:", "小数点向右移动两位："],
                [`${dec(v)} \\times 100 = ${dec(pct)}`],
              ],
              [["Add the sign", "添上百分号"], ["Write it as a percent:", "写成百分数："], [`${dec(v)} = ${dec(pct)}\\%`]],
            ],
            [`$${dec(pct)}\\% = ${dec(pct)} \\div 100 = ${dec(v)}$.`, `$${dec(pct)}\\% = ${dec(pct)} \\div 100 = ${dec(v)}$。`],
            [
              [pct.div(Q.of(10)), "That moves the point only one place.", "这只把小数点移了一位。"],
              [pct.mul(Q.of(10)), "That moves the point three places.", "这把小数点移了三位。"],
              [v, "That adds the percent sign without multiplying by $100$.", "这只是添了百分号，没有乘 $100$。"],
            ],
            { percent: true, form: "decimal" },
          );
        },
        gridFigure(60),
      ),
    ],
  ),
  [
    "A phone battery shows $0.85$ of its charge left. Phones show it as a percent: $0.85$ is $85$ hundredths, so the screen says $85\\%$.",
    "手机电池还剩 $0.85$ 的电量。手机用百分数显示：$0.85$ 是 $85$ 个百分之一，所以屏幕上显示 $85\\%$。",
  ],
  ["$85\\% = 85 \\div 100 = 0.85$.", "$85\\% = 85 \\div 100 = 0.85$。"],
  ["move between percents and decimals by dividing or multiplying by $100$.", "通过除以或乘 $100$ 在百分数和小数之间互化。"],
);

/** Rep is a number written as a fraction, a decimal or a percent. */
interface Rep {
  readonly v: Q;
  readonly latex: string;
}

/** randomRep writes a value with a whole-number percent as a fraction, decimal or percent. */
function randomRep(pct: number, form: number): Rep {
  const v = Q.of(pct, 100);
  if (form === 0) return { v, latex: `${pct}\\%` };
  if (form === 1) return { v, latex: dec(v) };
  return { v, latex: v.toLatex() };
}

/** pctOf writes the percent of a represented number. */
const pctOf = (r: Rep) => `${dec(r.v.mul(Q.of(100)))}\\%`;

export const comparingFractionsPercentsAndDecimals = withIntro(
  topic(
    "comparing-fractions-percents-and-decimals",
    t("Comparing Fractions, Percents, and Decimals", "比较分数、百分数和小数"),
    t(
      "To compare numbers written in different forms, write them all in the same form, for example as percents: 3/5 = 60%, 0.58 = 58%, so 3/5 > 0.58 > 55%.",
      "比较不同形式的数，先把它们化成同一种形式，例如都化成百分数：3/5 = 60%，0.58 = 58%，所以 3/5 > 0.58 > 55%。",
    ),
    ["converting-between-percentages-and-fractions", "converting-between-percentages-and-decimals"],
    ["6.RP.A.3c"],
    [
      lesson(
        "comparing-two-forms",
        ["Comparing two numbers", "比较两个数"],
        [
          [
            "To compare numbers written in different forms, first write them in the same form, such as both as percents, then compare. $\\frac{2}{5}$ or $38\\%$? $\\frac{2}{5} = \\frac{40}{100} = 40\\%$, and $40\\% > 38\\%$, so $\\frac{2}{5}$ is greater.",
            "比较不同形式的数，先把它们化成同一种形式，比如都化成百分数，再比较。$\\frac{2}{5}$ 与 $38\\%$：$\\frac{2}{5} = \\frac{40}{100} = 40\\%$，$40\\% > 38\\%$，所以 $\\frac{2}{5}$ 大。",
          ],
          [
            "As decimals: $2 \\div 5 = 0.4$ and $38\\% = 0.38$, and $0.4 > 0.38$.",
            "化成小数：$2 \\div 5 = 0.4$，$38\\% = 0.38$，$0.4 > 0.38$。",
          ],
          [
            "Do not compare the digits you see. $38$ is bigger than $2$ and $5$, but $38\\%$ is the smaller number.",
            "不能只看写出来的数字。$38$ 比 $2$ 和 $5$ 都大，但 $38\\%$ 反而小。",
          ],
        ],
        (rng) => {
          const { pct } = nicePercent(rng);
          const other = pct + rng.pick([-6, -3, -1, 0, 1, 3, 6]);
          const [fa, fb] = rng.shuffle([0, 1, 2]) as [number, number];
          const a = randomRep(pct, fa === 0 && fb === 0 ? 2 : fa);
          const b = randomRep(Math.max(1, Math.min(99, other)), fb);
          const c = a.v.cmp(b.v);
          const sym = c > 0 ? ">" : c < 0 ? "<" : "=";
          const [pa, pb] = [pctOf(a), pctOf(b)];
          const why = (s: string): MathWrong => [
            `${a.latex} ${s} ${b.latex}`,
            c === 0
              ? `As percents both are $${pa}$, so they are equal.`
              : s === "="
                ? `As percents they are $${pa}$ and $${pb}$, which differ.`
                : `That points the wrong way: they are $${pa}$ and $${pb}$.`,
            c === 0
              ? `化成百分数都是 $${pa}$，所以相等。`
              : s === "="
                ? `化成百分数是 $${pa}$ 和 $${pb}$，并不相等。`
                : `方向反了：它们是 $${pa}$ 和 $${pb}$。`,
          ];
          return chosenMath(
            rng,
            ["Which is true?", "哪一个正确？"],
            `${a.latex} ${sym} ${b.latex}`,
            ["<", "=", ">"].filter((s) => s !== sym).map(why),
            [
              [
                ["Write both as percents", "都化成百分数"],
                ["Change each to hundredths:", "都化成百分之几："],
                [`${a.latex} = ${pa}`, `${b.latex} = ${pb}`],
              ],
              [["Compare", "比较"], ["Compare the percents:", "比较百分数："], [`${a.latex} ${sym} ${b.latex}`]],
            ],
            [
              `As decimals: $${dec(a.v)}$ and $${dec(b.v)}$, and $${dec(a.v)} ${sym} ${dec(b.v)}$.`,
              `化成小数：$${dec(a.v)}$ 和 $${dec(b.v)}$，$${dec(a.v)} ${sym} ${dec(b.v)}$。`,
            ],
          );
        },
        percentBar(5, 2),
      ),
      lesson(
        "finding-the-greatest",
        ["Finding the greatest", "找出最大的数"],
        [
          [
            "To find the greatest of several numbers in different forms, write all of them in one form and compare. Among $0.7$, $\\frac{3}{4}$ and $72\\%$: they are $70\\%$, $75\\%$ and $72\\%$, so $\\frac{3}{4}$ is the greatest.",
            "在几个不同形式的数中找最大的，先把它们都化成同一种形式，再比较。$0.7$、$\\frac{3}{4}$、$72\\%$ 分别是 $70\\%$、$75\\%$、$72\\%$，所以 $\\frac{3}{4}$ 最大。",
          ],
          ["As decimals they are $0.7$, $0.75$ and $0.72$, and $0.75$ is the greatest.", "化成小数是 $0.7$、$0.75$、$0.72$，$0.75$ 最大。"],
          [
            "$0.7$ is $70\\%$, not $7\\%$. Write the decimal with two places, $0.70$, before comparing.",
            "$0.7$ 是 $70\\%$，不是 $7\\%$。比较前把它写成两位小数 $0.70$。",
          ],
        ],
        (rng) => {
          const { pct } = nicePercent(rng);
          let ps: number[];
          do ps = [pct, ...rng.sample([-7, -5, -4, -2, -1, 1, 2, 4], 3).map((d) => pct + d)].map((p) => Math.max(1, Math.min(99, p)));
          while (new Set(ps).size < 4);
          const reps = ps.map((p, i) => randomRep(p, i === 0 ? 2 : rng.int(0, 1)));
          const max = reps.reduce((m, r) => (r.v.cmp(m.v) > 0 ? r : m));
          const others = reps.filter((r) => r !== max);
          return chosenMath(
            rng,
            [
              `Which number is the greatest: ${reps.map((r) => `$${r.latex}$`).join(", ")}?`,
              `${reps.map((r) => `$${r.latex}$`).join("、")}中哪个数最大？`,
            ],
            max.latex,
            others.map(
              (r) =>
                [r.latex, `That is $${pctOf(r)}$, less than $${pctOf(max)}$.`, `它是 $${pctOf(r)}$，比 $${pctOf(max)}$ 小。`] as MathWrong,
            ),
            [
              [
                ["Write all as percents", "都化成百分数"],
                ["Change each one:", "逐个化成百分数："],
                reps.map((r) => `${r.latex} = ${pctOf(r)}`),
              ],
              [
                ["Pick the greatest", "找出最大的"],
                [
                  `The greatest percent is $${pctOf(max)}$, which is $${max.latex}$.`,
                  `最大的百分数是 $${pctOf(max)}$，也就是 $${max.latex}$。`,
                ],
              ],
            ],
            [
              `As decimals: ${reps.map((r) => `$${dec(r.v)}$`).join(", ")}. The greatest is $${dec(max.v)}$.`,
              `化成小数：${reps.map((r) => `$${dec(r.v)}$`).join("、")}。最大的是 $${dec(max.v)}$。`,
            ],
          );
        },
        tableFigure(["0.7", "3/4", "72%"], [70, 75, 72]),
      ),
    ],
  ),
  [
    "Two friends compare their test scores: one got $\\frac{4}{5}$ of the questions right, the other $78\\%$. To see who did better, write both as percents: $\\frac{4}{5} = 80\\%$.",
    "两个朋友比较测验成绩：一个答对了 $\\frac{4}{5}$ 的题，另一个答对了 $78\\%$。要看谁更好，都化成百分数：$\\frac{4}{5} = 80\\%$。",
  ],
  ["As decimals, $0.8 > 0.78$, so the first friend did better.", "化成小数，$0.8 > 0.78$，所以第一个朋友成绩更好。"],
  ["compare fractions, decimals and percents by writing them in one form.", "把分数、小数和百分数化成同一种形式来比较。"],
);

// ---------------------------------------------------------------------------
// Solving problems with percentages

/** percentWhole draws a whole number and a whole-number percent of it with a whole-number part. */
function percentWhole(rng: Rng, easy: boolean): { whole: number; pct: number; part: number } {
  for (;;) {
    const pct = easy ? rng.pick([10, 20, 25, 50, 75]) : rng.int(1, 19) * 5 + (rng.bool(0.3) ? rng.int(-2, 2) : 0);
    const whole = easy ? rng.int(1, 30) * 4 * 5 : rng.int(2, 60) * 10;
    const part = (pct * whole) / 100;
    if (Number.isInteger(part) && pct > 0 && pct < 100) return { whole, pct, part };
  }
}

export const findingAPercentageGivenTwoNumbers = withIntro(
  topic(
    "finding-a-percentage-given-two-numbers",
    t("Finding a Percentage Given Two Numbers", "求一个数是另一个数的百分之几"),
    t(
      "To find what percent a part is of a whole, write the fraction part/whole and convert it to a percent: 12 out of 40 is 12/40 = 30/100 = 30%.",
      "求部分是整体的百分之几，先写出分数“部分/整体”，再化成百分数：40 中的 12 是 12/40 = 30/100 = 30%。",
    ),
    ["converting-between-percentages-and-fractions"],
    ["6.RP.A.3c"],
    [
      lesson(
        "percent-of-a-small-whole",
        ["Wholes that divide 100", "整体能整除 100"],
        [
          [
            "To find what percent one number is of another, write the part over the whole, then rewrite it with denominator $100$. $7$ out of $20$: $\\frac{7}{20} = \\frac{35}{100} = 35\\%$, multiplying both by $5$.",
            "求一个数是另一个数的百分之几，先把部分比整体写成分数，再化成分母是 $100$ 的分数。$20$ 中的 $7$：$\\frac{7}{20} = \\frac{35}{100} = 35\\%$（分子分母同乘 $5$）。",
          ],
          ["Each of the $20$ is $5\\%$, and $7 \\times 5\\% = 35\\%$.", "$20$ 个中的每一个是 $5\\%$，$7 \\times 5\\% = 35\\%$。"],
          ["The part goes on top. $\\frac{20}{7}$ would be more than $100\\%$.", "部分作分子。$\\frac{20}{7}$ 会超过 $100\\%$。"],
        ],
        (rng) => {
          const whole = rng.pick([2, 4, 5, 10, 20, 25, 50]);
          const part = rng.int(1, whole - 1);
          const pct = (part * 100) / whole;
          const m = 100 / whole;
          return valued(
            [`What percent of $${whole}$ is $${part}$?`, `$${part}$ 是 $${whole}$ 的百分之几？`],
            pct,
            [
              [["Write part over whole", "写成部分比整体"], ["The part goes on top:", "部分作分子："], [fr(part, whole)]],
              [
                ["Make the denominator 100", "化成分母 100"],
                [`Multiply both by $${m}$:`, `分子分母都乘 $${m}$：`],
                [`${fr(part, whole)} = ${fr(pct, 100)} = ${pct}\\%`],
              ],
            ],
            [
              `Each one of the $${whole}$ is $${m}\\%$, and $${part} \\times ${m}\\% = ${pct}\\%$.`,
              `$${whole}$ 个中的每一个是 $${m}\\%$，$${part} \\times ${m}\\% = ${pct}\\%$。`,
            ],
            [
              [part, "That is the part, not the percent.", "这是部分本身，不是百分数。"],
              [Math.round((whole * 100) / part), "That puts the whole on top.", "这把整体放在了分子上。"],
              [100 - pct, "That is the percent that is left.", "这是剩下部分的百分数。"],
            ],
            { percent: true, form: "integer" },
          );
        },
        percentBar(20, 7),
      ),
      lesson(
        "percent-of-a-larger-whole",
        ["Larger wholes", "较大的整体"],
        [
          [
            "Write the part over the whole. If the denominator does not divide $100$, simplify first, then rewrite it out of $100$. $12$ out of $40$: $\\frac{12}{40} = \\frac{3}{10} = \\frac{30}{100} = 30\\%$.",
            "把部分比整体写成分数。如果分母不能整除 $100$，先约分，再化成分母是 $100$ 的分数。$40$ 中的 $12$：$\\frac{12}{40} = \\frac{3}{10} = \\frac{30}{100} = 30\\%$。",
          ],
          ["$10\\%$ of $40$ is $4$, and $30\\%$ is $3 \\times 4 = 12$.", "$40$ 的 $10\\%$ 是 $4$，$30\\%$ 是 $3 \\times 4 = 12$。"],
          ["The part is not the percent. $12$ out of $40$ is not $12\\%$.", "部分不是百分数。$40$ 中的 $12$ 不是 $12\\%$。"],
        ],
        (rng) => {
          let w: { whole: number; pct: number; part: number };
          do w = percentWhole(rng, false);
          while (100 % w.whole === 0);
          const { whole, pct, part } = w;
          const g = gcd(part, whole);
          const [n, d] = [part / g, whole / g];
          return valued(
            [`What percent of $${whole}$ is $${part}$?`, `$${part}$ 是 $${whole}$ 的百分之几？`],
            pct,
            [
              [["Simplify", "约分"], [`Divide both by $${g}$:`, `分子分母都除以 $${g}$：`], [`${fr(part, whole)} = ${fr(n, d)}`]],
              [
                ["Make the denominator 100", "化成分母 100"],
                ["Rewrite it out of $100$:", "化成分母是 $100$ 的分数："],
                [`${fr(n, d)} = ${fr(pct, 100)} = ${pct}\\%`],
              ],
            ],
            [
              `$${pct}\\%$ of $${whole}$ is $${fr(pct, 100)} \\times ${whole} = ${part}$.`,
              `$${whole}$ 的 $${pct}\\%$ 是 $${fr(pct, 100)} \\times ${whole} = ${part}$。`,
            ],
            [
              [part, "That is the part, not the percent.", "这是部分本身，不是百分数。"],
              [100 - pct, "That is the percent that is left.", "这是剩下部分的百分数。"],
              [Math.round((whole * 100) / part), "That puts the whole on top.", "这把整体放在了分子上。"],
            ],
            { percent: true, form: "integer" },
          );
        },
        equalTape(10, "4", "40", 3),
      ),
    ],
  ),
  [
    "A player made $9$ of her $20$ shots. To say how well she did, write it as a percent: $\\frac{9}{20} = \\frac{45}{100} = 45\\%$.",
    "一名球员投了 $20$ 次，进了 $9$ 球。用百分数表示命中率：$\\frac{9}{20} = \\frac{45}{100} = 45\\%$。",
  ],
  ["Each shot is $5\\%$ of $20$, and $9 \\times 5\\% = 45\\%$.", "每一投是 $20$ 次的 $5\\%$，$9 \\times 5\\% = 45\\%$。"],
  ["find what percent one number is of another.", "求一个数是另一个数的百分之几。"],
);

export const findingPartOfANumberGivenAWholeAndAPercentage = withIntro(
  topic(
    "finding-part-of-a-number-given-a-whole-and-a-percentage",
    t("Finding Part of a Number Given a Whole and a Percentage", "求一个数的百分之几"),
    t(
      "To find p% of a number, multiply the number by p/100. 10% of a number is one tenth of it, 25% is one quarter and 50% is half: 30% of 80 is 3 × 8 = 24.",
      "求一个数的 p%，就用这个数乘 p/100。一个数的 10% 是它的十分之一，25% 是四分之一，50% 是一半：80 的 30% 是 3 × 8 = 24。",
    ),
    ["converting-between-percentages-and-fractions", "multiplying-fractions-by-whole-numbers"],
    ["6.RP.A.3c"],
    [
      lesson(
        "benchmark-percents-of-a-number",
        ["Benchmark percents", "常用百分数"],
        [
          [
            "Some percents are simple fractions: $50\\%$ is $\\frac{1}{2}$, $25\\%$ is $\\frac{1}{4}$, $10\\%$ is $\\frac{1}{10}$. Use the fraction to find the percent quickly. $25\\%$ of $80$ is $\\frac{1}{4}$ of $80$, which is $20$, and $75\\%$ of $80$ is three times that, $60$.",
            "有些百分数就是简单的分数：$50\\%$ 是 $\\frac{1}{2}$，$25\\%$ 是 $\\frac{1}{4}$，$10\\%$ 是 $\\frac{1}{10}$。用这些分数可以很快求出结果。$80$ 的 $25\\%$ 是 $80$ 的 $\\frac{1}{4}$，即 $20$；$80$ 的 $75\\%$ 是它的 $3$ 倍，即 $60$。",
          ],
          ["$\\frac{75}{100} \\times 80 = \\frac{6000}{100} = 60$.", "$\\frac{75}{100} \\times 80 = \\frac{6000}{100} = 60$。"],
          [
            "A percent below $100\\%$ gives less than the whole. An answer larger than $80$ cannot be right.",
            "小于 $100\\%$ 的百分数得到的比整体小。比 $80$ 大的答案不可能对。",
          ],
        ],
        (rng) => {
          const { whole, pct, part } = percentWhole(rng, true);
          const g = gcd(pct, 100);
          const [n, d] = [pct / g, 100 / g];
          const offs: Off[] = [
            [whole - part, `That is the other $${100 - pct}\\%$.`, `这是另外的 $${100 - pct}\\%$。`],
            [pct, "That is the percent itself, not a part of the number.", "这是百分数本身，不是这个数的一部分。"],
            [whole * pct, "That multiplies by the percent but does not divide by $100$.", "这是乘了百分数，但没有除以 $100$。"],
          ];
          return valued(
            [`What is $${pct}\\%$ of $${whole}$?`, `$${whole}$ 的 $${pct}\\%$ 是多少？`],
            part,
            [
              [
                ["Write the percent as a fraction", "把百分数写成分数"],
                ["Simplify the hundredths:", "约分："],
                [`${pct}\\% = ${fr(n, d)}`],
              ],
              [
                ["Take that fraction", "求分数"],
                [
                  `One ${d === 2 ? "half" : d === 4 ? "quarter" : "part"} of $${whole}$ is $${whole / d}$, so:`,
                  `$${whole}$ 的 $${fr(1, d)}$ 是 $${whole / d}$，所以：`,
                ],
                [`${n} \\times ${whole / d} = ${part}`],
              ],
            ],
            [
              `$${fr(pct, 100)} \\times ${whole} = ${fr(pct * whole, 100)} = ${part}$.`,
              `$${fr(pct, 100)} \\times ${whole} = ${fr(pct * whole, 100)} = ${part}$。`,
            ],
            offs,
          );
        },
        equalTape(4, "20", "80", 1),
      ),
      lesson(
        "any-percent-of-a-number",
        ["Any percent", "任意百分数"],
        [
          [
            "To find any percent of a number, multiply the number by the percent over $100$. $\\frac{35}{100} \\times 60 = \\frac{2100}{100} = 21$.",
            "求一个数的百分之几，用这个数乘分母为 $100$ 的分数。$\\frac{35}{100} \\times 60 = \\frac{2100}{100} = 21$。",
          ],
          [
            "Build it from pieces: $10\\%$ of $60$ is $6$ and $5\\%$ is $3$, so $35\\%$ is $3 \\times 6 + 3 = 21$.",
            "用小块拼：$60$ 的 $10\\%$ 是 $6$，$5\\%$ 是 $3$，所以 $35\\%$ 是 $3 \\times 6 + 3 = 21$。",
          ],
          [
            "Divide by $100$, not $10$. $\\frac{2100}{10} = 210$ is more than the whole $60$.",
            "要除以 $100$，不是 $10$。$\\frac{2100}{10} = 210$ 比整体 $60$ 还大。",
          ],
        ],
        (rng) => {
          const { whole, pct, part } = percentWhole(rng, false);
          const tenth = whole / 10;
          return valued(
            [`What is $${pct}\\%$ of $${whole}$?`, `$${whole}$ 的 $${pct}\\%$ 是多少？`],
            part,
            [
              [
                ["Multiply", "相乘"],
                [`Multiply $${whole}$ by $${pct}$ hundredths:`, `用 $${whole}$ 乘 $${pct}$ 个百分之一：`],
                [`${fr(pct, 100)} \\times ${whole} = ${fr(pct * whole, 100)}`],
              ],
              [["Divide by 100", "除以 100"], ["Move the point two places:", "小数点移两位："], [`${fr(pct * whole, 100)} = ${part}`]],
            ],
            [
              `$1\\%$ of $${whole}$ is $${dec(Q.of(whole, 100))}$, and $${pct} \\times ${dec(Q.of(whole, 100))} = ${part}$.`,
              `$${whole}$ 的 $1\\%$ 是 $${dec(Q.of(whole, 100))}$，$${pct} \\times ${dec(Q.of(whole, 100))} = ${part}$。`,
            ],
            [
              [whole - part, `That is the other $${100 - pct}\\%$.`, `这是另外的 $${100 - pct}\\%$。`],
              [
                part * 10,
                `That divides by $10$ instead of $100$. $10\\%$ of $${whole}$ is only $${tenth}$.`,
                `这是除以 $10$ 而不是 $100$。$${whole}$ 的 $10\\%$ 才 $${tenth}$。`,
              ],
              [Math.round(part / 10), "That divides by $1000$, ten times too small.", "这是除以了 $1000$，小了十倍。"],
            ],
          );
        },
        equalTape(20, "3", "60", 7),
      ),
    ],
  ),
  [
    "A $\\$80$ jacket is $25\\%$ off. The discount is $25\\%$ of $\\$80$: a quarter of $80$, which is $\\$20$.",
    "一件 $\\$80$ 的夹克打折 $25\\%$。优惠是 $\\$80$ 的 $25\\%$：$80$ 的四分之一，即 $\\$20$。",
  ],
  ["$\\frac{25}{100} \\times 80 = 20$.", "$\\frac{25}{100} \\times 80 = 20$。"],
  ["find a percent of a number with benchmark fractions and by multiplying.", "用常用分数或乘法求一个数的百分之几。"],
);

export const findingATotalGivenAPartAndAPercentage = withIntro(
  topic(
    "finding-a-total-given-a-part-and-a-percentage",
    t("Finding a Total Given a Part and a Percentage", "已知一个数的百分之几求这个数"),
    t(
      "If 12 is 25% of a number, then 1% of the number is 12 ÷ 25 and the whole 100% is 100 times that: 48. Equivalently, divide the part by the percent written as a fraction: 12 ÷ 1/4 = 48.",
      "如果 12 是某数的 25%，那么该数的 1% 是 12 ÷ 25，100% 是它的 100 倍：48。也可以用部分除以百分数对应的分数：12 ÷ 1/4 = 48。",
    ),
    ["finding-part-of-a-number-given-a-whole-and-a-percentage"],
    ["6.RP.A.3c"],
    [
      lesson(
        "total-from-a-benchmark-percent",
        ["Benchmark percents", "常用百分数"],
        [
          [
            "When a part and its percent are known, work back to $100\\%$. $15$ is $25\\%$ of what? $25\\%$ is a quarter, and four quarters make the whole, so the whole is $4 \\times 15 = 60$.",
            "已知部分和它所占的百分数，要倒推出 $100\\%$。$15$ 是多少的 $25\\%$？$25\\%$ 是四分之一，四个四分之一是整体，所以整体是 $4 \\times 15 = 60$。",
          ],
          ["$25\\%$ of $60$ is $60 \\div 4 = 15$.", "$60$ 的 $25\\%$ 是 $60 \\div 4 = 15$。"],
          ["The whole is larger than the part. Taking $25\\%$ of $15$ goes the wrong way.", "整体比部分大。求 $15$ 的 $25\\%$ 是反方向。"],
        ],
        (rng) => {
          const { whole, pct, part } = percentWhole(rng, true);
          const g = gcd(pct, 100);
          const [n, d] = [pct / g, 100 / g];
          const offs: Off[] = [
            [
              Q.of(part * pct, 100),
              `That takes $${pct}\\%$ of $${part}$. The part is already $${pct}\\%$ of the number.`,
              `这是求 $${part}$ 的 $${pct}\\%$。$${part}$ 已经是那个数的 $${pct}\\%$ 了。`,
            ],
            [part + pct, "That adds the percent to the part.", "这是把百分数加到部分上。"],
            [whole / 2, "That is only half of the number.", "这只是那个数的一半。"],
          ];
          return valued(
            [`$${part}$ is $${pct}\\%$ of what number?`, `$${part}$ 是哪个数的 $${pct}\\%$？`],
            whole,
            [
              [
                ["Write the percent as a fraction", "把百分数写成分数"],
                [`$${pct}\\%$ is $${n}$ of $${d}$ equal parts:`, `$${pct}\\%$ 是 $${d}$ 等份中的 $${n}$ 份：`],
                [`${pct}\\% = ${fr(n, d)}`],
              ],
              [
                ["Work back to the whole", "倒推整体"],
                [
                  `One part is $${part} \\div ${n} = ${part / n}$, and the whole is $${d}$ parts:`,
                  `一份是 $${part} \\div ${n} = ${part / n}$，整体是 $${d}$ 份：`,
                ],
                [`${d} \\times ${part / n} = ${whole}`],
              ],
            ],
            [
              `$${pct}\\%$ of $${whole}$ is $${fr(n, d)} \\times ${whole} = ${part}$.`,
              `$${whole}$ 的 $${pct}\\%$ 是 $${fr(n, d)} \\times ${whole} = ${part}$。`,
            ],
            offs,
          );
        },
        equalTape(4, "15", "60", 1),
      ),
      lesson(
        "total-from-any-percent",
        ["Any percent", "任意百分数"],
        [
          [
            "Divide the part to find a small percent such as $1\\%$ or $5\\%$, then multiply up to $100\\%$. $21$ is $35\\%$ of what? $35\\%$ is seven $5\\%$ pieces, so $5\\%$ is $21 \\div 7 = 3$, and $100\\%$ is $20 \\times 3 = 60$.",
            "先用部分除以合适的数，求出 $1\\%$ 或 $5\\%$ 这样的小百分数，再乘到 $100\\%$。$21$ 是多少的 $35\\%$？$35\\%$ 是七个 $5\\%$，所以 $5\\%$ 是 $21 \\div 7 = 3$，$100\\%$ 是 $20 \\times 3 = 60$。",
          ],
          ["$35\\%$ of $60$ is $\\frac{35}{100} \\times 60 = 21$.", "$60$ 的 $35\\%$ 是 $\\frac{35}{100} \\times 60 = 21$。"],
          [
            "Multiplying the part by the percent gives a smaller number, which cannot be the whole.",
            "用部分乘百分数，得数会更小，不可能是整体。",
          ],
        ],
        (rng) => {
          const { whole, pct, part } = percentWhole(rng, false);
          const g = gcd(pct, 100);
          const [n, d] = [pct / g, 100 / g];
          const one = Q.of(part, n);
          return valued(
            [`$${part}$ is $${pct}\\%$ of what number?`, `$${part}$ 是哪个数的 $${pct}\\%$？`],
            whole,
            [
              [
                ["Find one small part", "求一小份"],
                [
                  `$${pct}\\% = ${fr(n, d)}$, so $${n}$ of $${d}$ equal parts make $${part}$:`,
                  `$${pct}\\% = ${fr(n, d)}$，所以 $${d}$ 等份中的 $${n}$ 份是 $${part}$：`,
                ],
                [`${part} \\div ${n} = ${dec(one)}`],
              ],
              [
                ["Multiply up to 100%", "乘到 100%"],
                [`The whole is $${d}$ parts:`, `整体是 $${d}$ 份：`],
                [`${d} \\times ${dec(one)} = ${whole}`],
              ],
            ],
            [
              `$${pct}\\%$ of $${whole}$ is $${fr(pct, 100)} \\times ${whole} = ${part}$.`,
              `$${whole}$ 的 $${pct}\\%$ 是 $${fr(pct, 100)} \\times ${whole} = ${part}$。`,
            ],
            [
              [
                Math.round((part * pct) / 100),
                `That takes $${pct}\\%$ of $${part}$, which is smaller than the part.`,
                `这是求 $${part}$ 的 $${pct}\\%$，比部分还小。`,
              ],
              [part + pct, "That adds the percent to the part.", "这是把百分数加到部分上。"],
              [whole * 2, "That is twice the number.", "这是那个数的两倍。"],
            ],
          );
        },
        equalTape(20, "3", "60", 7),
      ),
    ],
  ),
  [
    "A water tank shows that $30$ liters is $25\\%$ of its full amount. Four quarters fill the tank, so it holds $4 \\times 30 = 120$ liters.",
    "水箱显示 $30$ 升是装满时的 $25\\%$。四个四分之一装满水箱，所以它能装 $4 \\times 30 = 120$ 升。",
  ],
  ["$25\\%$ of $120$ is $120 \\div 4 = 30$.", "$120$ 的 $25\\%$ 是 $120 \\div 4 = 30$。"],
  ["work back from a part and its percent to the whole.", "由部分和它的百分数倒推出整体。"],
);

export const findingAPercentageGivenTwoNumbersWordProblems = withIntro(
  topic(
    "finding-a-percentage-given-two-numbers-word-problems",
    t("Finding a Percentage Given Two Numbers: Word Problems", "求百分之几的应用题"),
    t(
      "Identify the whole (what the part is “out of”) and the part, then convert part/whole to a percent. A student who answers 18 of 24 questions correctly scores 18/24 = 3/4 = 75%.",
      "先找出整体（“在多少之中”）和部分，再把“部分/整体”化成百分数。学生 24 道题答对 18 道，正确率是 18/24 = 3/4 = 75%。",
    ),
    ["finding-a-percentage-given-two-numbers"],
    ["6.RP.A.3c"],
    [
      lesson(
        "test-score-percent",
        ["Scores and results", "得分与结果"],
        [
          [
            "A score as a percent is the number made over the number tried, rewritten out of $100$. Simplify first if that helps. $18$ correct out of $24$: $\\frac{18}{24} = \\frac{3}{4} = \\frac{75}{100} = 75\\%$.",
            "把成绩写成百分数，就用成功的次数比总次数，再化成分母是 $100$ 的分数。能约分时先约分。$24$ 题中答对 $18$ 题：$\\frac{18}{24} = \\frac{3}{4} = \\frac{75}{100} = 75\\%$。",
          ],
          ["$75\\%$ of $24$ is $\\frac{3}{4} \\times 24 = 18$.", "$24$ 的 $75\\%$ 是 $\\frac{3}{4} \\times 24 = 18$。"],
          [
            "The number tried is the whole. The $6$ missed questions are $25\\%$, not the score.",
            "总次数是整体。没答对的 $6$ 题占 $25\\%$，不是得分。",
          ],
        ],
        (rng) => {
          let w: { whole: number; pct: number; part: number };
          do w = percentWhole(rng, rng.bool());
          while (w.whole > 200);
          const { whole, pct, part } = w;
          const g = gcd(part, whole);
          const name = rng.pick(["Maya", "Leo", "Nora", "Sam", "Iris"]);
          return valued(
            [
              `${name} made $${part}$ of $${whole}$ free throws. What percent of the free throws did ${name} make?`,
              `${name} 投了 $${whole}$ 次罚球，投中 $${part}$ 次。投中的次数占百分之几？`,
            ],
            pct,
            [
              [
                ["Write made over tried", "写成投中比总数"],
                [`Simplify by $${g}$:`, `约去 $${g}$：`],
                [`${fr(part, whole)} = ${fr(part / g, whole / g)}`],
              ],
              [
                ["Make the denominator 100", "化成分母 100"],
                ["Rewrite out of $100$:", "化成分母是 $100$ 的分数："],
                [`${fr(part / g, whole / g)} = ${fr(pct, 100)} = ${pct}\\%`],
              ],
            ],
            [
              `$${pct}\\%$ of $${whole}$ is $${fr(pct, 100)} \\times ${whole} = ${part}$ free throws.`,
              `$${whole}$ 的 $${pct}\\%$ 是 $${fr(pct, 100)} \\times ${whole} = ${part}$ 次。`,
            ],
            [
              [100 - pct, "That is the percent missed.", "这是没投中的百分数。"],
              [part, "That is the number made, not the percent.", "这是投中的次数，不是百分数。"],
              [Math.round((whole * 100) / part), "That puts the number tried on top.", "这把总次数放在了分子上。"],
            ],
            { percent: true, form: "integer" },
          );
        },
        percentBar(4, 3),
      ),
      lesson(
        "percent-of-the-rest",
        ["Finding the whole first", "先求整体"],
        [
          [
            "Sometimes the whole is not given and must be found by adding. A class has $12$ boys and $13$ girls, so the whole is $12 + 13 = 25$, and the girls are $\\frac{13}{25} = \\frac{52}{100} = 52\\%$ of the class.",
            "有时整体没有直接给出，要先相加求出。一个班有男生 $12$ 名、女生 $13$ 名，整体是 $12 + 13 = 25$，女生占全班的 $\\frac{13}{25} = \\frac{52}{100} = 52\\%$。",
          ],
          [
            "The boys are $\\frac{12}{25} = 48\\%$, and $48\\% + 52\\% = 100\\%$.",
            "男生占 $\\frac{12}{25} = 48\\%$，而 $48\\% + 52\\% = 100\\%$。",
          ],
          [
            "The whole is the class, not the boys. $\\frac{13}{12}$ compares girls with boys.",
            "整体是全班，不是男生。$\\frac{13}{12}$ 是女生与男生的比。",
          ],
        ],
        (rng) => {
          let whole: number, a: number, b: number, pct: number;
          do {
            whole = rng.pick([20, 25, 40, 50]);
            a = rng.int(1, whole - 1);
            b = whole - a;
            pct = (b * 100) / whole;
          } while (!Number.isInteger(pct));
          return valued(
            [
              `A club has $${a}$ members who play the piano and $${b}$ who play the guitar. Each member plays exactly one of them. What percent of the members play the guitar?`,
              `一个社团中有 $${a}$ 名成员弹钢琴，$${b}$ 名成员弹吉他，每人只弹其中一种。弹吉他的成员占百分之几？`,
            ],
            pct,
            [
              [["Find the whole", "求整体"], ["Add the two groups:", "把两组加起来："], [`${a} + ${b} = ${whole}`]],
              [
                ["Write as a percent", "化成百分数"],
                ["Guitar players over all members:", "弹吉他的人数比总人数："],
                [`${fr(b, whole)} = ${fr(pct, 100)} = ${pct}\\%`],
              ],
            ],
            [
              `The piano players are $${100 - pct}\\%$, and $${pct}\\% + ${100 - pct}\\% = 100\\%$.`,
              `弹钢琴的占 $${100 - pct}\\%$，而 $${pct}\\% + ${100 - pct}\\% = 100\\%$。`,
            ],
            [
              [100 - pct, "That is the percent who play the piano.", "这是弹钢琴的百分数。"],
              [
                Math.round((b * 100) / a),
                "That compares the guitar players with the piano players, not with all members.",
                "这是弹吉他的人数与弹钢琴的人数相比，不是与总人数相比。",
              ],
              [b, "That is the number of guitar players, not the percent.", "这是弹吉他的人数，不是百分数。"],
            ],
            { percent: true, form: "integer" },
          );
        },
        barFigure(
          [
            {
              total: "25",
              pieces: [
                { size: 12, text: "12" },
                { size: 13, text: "13", lit: true },
              ],
            },
          ],
          [
            "A class of 25: 12 boys and 13 girls, shaded. The girls are 13 of 25, or 52%.",
            "全班 25 人：男生 12 人，女生 13 人（涂色）。女生占 25 人中的 13 人，即 52%。",
          ],
        ),
      ),
    ],
  ),
  [
    "A baker sold $36$ of the $48$ muffins she made. What percent sold? The whole is the $48$ she made: $\\frac{36}{48} = \\frac{3}{4} = 75\\%$.",
    "面包师做了 $48$ 个松饼，卖出 $36$ 个。卖出了百分之几？整体是做的 $48$ 个：$\\frac{36}{48} = \\frac{3}{4} = 75\\%$。",
  ],
  ["$75\\%$ of $48$ is $36$.", "$48$ 的 $75\\%$ 是 $36$。"],
  ["find the part and the whole in a story and write the part as a percent.", "在应用题中找出部分和整体，把部分写成百分数。"],
);

export const findingPartOfANumberGivenAWholeAndAPercentageWordProblems = withIntro(
  topic(
    "finding-part-of-a-number-given-a-whole-and-a-percentage-word-problems",
    t("Finding Part of a Number Given a Whole and a Percentage: Word Problems", "求一个数的百分之几的应用题"),
    t(
      "In a word problem, find the whole and the percent, then multiply. If $40\\%$ of $30$ students walk to school, $12$ walk, and the other $60\\%$, or $18$ students, do not.",
      "应用题中先找出整体与百分数，再相乘。$30$ 名学生中 $40\\%$ 步行上学，就是 $12$ 人；其余 $60\\%$，即 $18$ 人，不步行上学。",
    ),
    ["finding-part-of-a-number-given-a-whole-and-a-percentage"],
    ["6.RP.A.3c"],
    [
      lesson(
        "part-of-a-group",
        ["Part of a group", "一组中的一部分"],
        [
          [
            "To find how many in a group have some property, multiply the group size by the percent written over $100$. $40\\%$ of $30$ students walk: $\\frac{40}{100} \\times 30 = 12$ students.",
            "求一群中具有某种特点的有多少，就用总数乘写成分母为 $100$ 的百分数。$30$ 名学生中 $40\\%$ 步行：$\\frac{40}{100} \\times 30 = 12$ 名。",
          ],
          ["$10\\%$ of $30$ is $3$, and $40\\%$ is $4 \\times 3 = 12$.", "$30$ 的 $10\\%$ 是 $3$，$40\\%$ 是 $4 \\times 3 = 12$。"],
          [
            "The percent is not a number of people. $40\\%$ of $30$ students cannot be $40$ students.",
            "百分数不是人数。$30$ 名学生的 $40\\%$ 不可能是 $40$ 名。",
          ],
        ],
        (rng) => {
          const { whole, pct, part } = percentWhole(rng, rng.bool());
          return valued(
            [
              `A school has $${whole}$ students, and $${pct}\\%$ of them take the bus. How many students take the bus?`,
              `一所学校有 $${whole}$ 名学生，其中 $${pct}\\%$ 乘校车。乘校车的学生有多少名？`,
            ],
            part,
            [
              [
                ["Write the percent over 100", "把百分数写成分数"],
                ["Take that part of the school:", "求全校的这一部分："],
                [`${fr(pct, 100)} \\times ${whole}`],
              ],
              [
                ["Work it out", "算出结果"],
                ["Multiply, then divide by $100$:", "先乘，再除以 $100$："],
                [`${fr(pct * whole, 100)} = ${part}`],
              ],
            ],
            [
              `$${part}$ out of $${whole}$ is $${fr(part, whole)} = ${pct}\\%$.`,
              `$${whole}$ 名中的 $${part}$ 名是 $${fr(part, whole)} = ${pct}\\%$。`,
            ],
            [
              [whole - part, "That is the students who do not take the bus.", "这是不乘校车的人数。"],
              [pct, "That is the percent, not a number of students.", "这是百分数，不是人数。"],
              [
                Math.round(whole / pct),
                "That divides by the percent. Multiply by it over $100$.",
                "这是除以百分数。应该乘以它对应的分数。",
              ],
            ],
          );
        },
        equalTape(10, "3", "30", 4),
      ),
      lesson(
        "the-rest-of-a-group",
        ["The rest of a group", "其余部分"],
        [
          [
            "The whole group is $100\\%$. For those without the property, subtract the percent from $100\\%$ first, then take that percent of the group. If $40\\%$ of $30$ students walk, the other $60\\%$ do not: $\\frac{60}{100} \\times 30 = 18$ students.",
            "整个群体是 $100\\%$。求不具有这个特点的，先用 $100\\%$ 减去这个百分数，再求总数的百分之几。$30$ 名学生中 $40\\%$ 步行，其余 $60\\%$ 不步行：$\\frac{60}{100} \\times 30 = 18$ 名。",
          ],
          ["$12$ walk, and $30 - 12 = 18$ do not.", "步行的有 $12$ 名，不步行的有 $30 - 12 = 18$ 名。"],
          [
            "Subtract percents from percents, not from the number of people. $30 - 40$ makes no sense here.",
            "百分数要和百分数相减，不能用人数减百分数。这里 $30 - 40$ 没有意义。",
          ],
        ],
        (rng) => {
          const { whole, pct, part } = percentWhole(rng, rng.bool());
          const rest = whole - part;
          return valued(
            [
              `A store has $${whole}$ shirts, and $${pct}\\%$ of them are on sale. How many shirts are not on sale?`,
              `一家商店有 $${whole}$ 件衬衫，其中 $${pct}\\%$ 在打折。不打折的衬衫有多少件？`,
            ],
            rest,
            [
              [
                ["Find the other percent", "求另一部分的百分数"],
                ["The rest of the $100\\%$:", "$100\\%$ 中剩下的："],
                [`100\\% - ${pct}\\% = ${100 - pct}\\%`],
              ],
              [
                ["Take that percent", "求这个百分数"],
                [`$${100 - pct}\\%$ of $${whole}$:`, `$${whole}$ 的 $${100 - pct}\\%$：`],
                [`${fr(100 - pct, 100)} \\times ${whole} = ${rest}`],
              ],
            ],
            [
              `$${part}$ shirts are on sale, and $${part} + ${rest} = ${whole}$.`,
              `打折的有 $${part}$ 件，而 $${part} + ${rest} = ${whole}$。`,
            ],
            [
              [part, "That is the shirts on sale.", "这是打折的衬衫。"],
              [100 - pct, "That is the percent not on sale, not a number of shirts.", "这是不打折的百分数，不是件数。"],
              [whole - pct, "That subtracts the percent from the number of shirts.", "这是用件数减百分数。"],
            ],
          );
        },
        barFigure(
          [
            {
              total: "30",
              pieces: [
                { size: 12, text: "12" },
                { size: 18, text: "18", lit: true },
              ],
            },
          ],
          [
            "A bar of 30 students: 40% walk, 12, and the shaded 60%, 18, do not.",
            "30 名学生的长条：40% 步行，是 12 名；涂色的 60% 不步行，是 18 名。",
          ],
        ),
      ),
    ],
  ),
  [
    "A garden has $40$ plants, and $25\\%$ of them are tomatoes. To find how many, take a quarter of $40$: $10$ tomato plants.",
    "菜园有 $40$ 株植物，其中 $25\\%$ 是番茄。求番茄有多少株，就取 $40$ 的四分之一：$10$ 株。",
  ],
  [
    "$\\frac{25}{100} \\times 40 = 10$, and the other $30$ plants are $75\\%$.",
    "$\\frac{25}{100} \\times 40 = 10$，其余 $30$ 株占 $75\\%$。",
  ],
  ["find a percent of a group in a story, and the rest of the group.", "在应用题中求一个群体的百分之几，以及其余部分。"],
);

// ---------------------------------------------------------------------------
// Unit conversions using long division

/** Conversion is a pair of units of length and how many of the smaller make one of the larger. */
interface Conversion {
  readonly big: Text;
  readonly one: Text;
  readonly small: Text;
  readonly f: number;
}

const conversions: readonly Conversion[] = [
  { big: t("feet", "英尺"), one: t("foot", "英尺"), small: t("inches", "英寸"), f: 12 },
  { big: t("yards", "码"), one: t("yard", "码"), small: t("feet", "英尺"), f: 3 },
  { big: t("yards", "码"), one: t("yard", "码"), small: t("inches", "英寸"), f: 36 },
  { big: t("miles", "英里"), one: t("mile", "英里"), small: t("yards", "码"), f: 1760 },
];

export const convertingUnitsOfLengthToLargerUnitsUsingLongDivision = withIntro(
  topic(
    "converting-units-of-length-to-larger-units-using-long-division",
    t("Converting Units of Length to Larger Units Using Long Division", "用长除法把长度单位化成较大单位"),
    t(
      "To convert a large number of small units, divide by the conversion factor with long division. The quotient is the number of larger units and the remainder is what is left in smaller units: $1$,$000$ inches ÷ $12 = 83$ R $4$, so $1$,$000$ in = $83$ ft $4$ in = $83$ $\\frac{1}{3}$ ft.",
      "把较多的小单位化成大单位，用长除法除以进率。商是大单位的个数，余数是剩下的小单位：$1000 \\div 12 = 83$ 余 $4$，所以 $1000$ 英寸 = $83$ 英尺 $4$ 英寸 = $83$ $\\frac{1}{3}$ 英尺。",
    ),
    ["converting-customary-units-of-length-to-larger-units", "multi-digit-by-two-digit-division-using-partial-quotients"],
    ["6.RP.A.3d"],
    [
      lesson(
        "quotient-and-remainder-units",
        ["Larger and smaller units", "大单位与小单位"],
        [
          [
            "To change to a larger unit, divide by the conversion factor using long division. The quotient is the number of larger units and the remainder is what is left in the smaller unit. $1{,}000$ in: $1{,}000 \\div 12 = 83$ R $4$, so it is $83$ ft $4$ in.",
            "换成较大的单位时，用竖式除以进率。商是大单位的个数，余数是剩下的小单位。$1000$ 英寸：$1000 \\div 12 = 83$ 余 $4$，所以是 $83$ 英尺 $4$ 英寸。",
          ],
          ["$83 \\times 12 + 4 = 996 + 4 = 1{,}000$ inches.", "$83 \\times 12 + 4 = 996 + 4 = 1000$ 英寸。"],
          [
            "The remainder stays in the smaller unit, and it is always less than the factor. $4$ in left over cannot make another foot.",
            "余数仍是小单位，而且总比进率小。剩下的 $4$ 英寸不够再凑 $1$ 英尺。",
          ],
        ],
        (rng) => {
          const c = rng.pick(conversions);
          let n: number;
          do n = c.f >= 1000 ? rng.int(2000, 9999) : rng.int(200, 2999);
          while (n % c.f === 0);
          const q = Math.floor(n / c.f);
          const r = n % c.f;
          const nTex = n.toLocaleString("en-US").replace(/,/g, "{,}");
          const opt = (a: number, b: number): Pair => [
            `${a} ${c.big.en} ${b} ${c.small.en}`,
            `${a} ${c.big["zh-CN"]} ${b} ${c.small["zh-CN"]}`,
          ];
          const back = (a: number, b: number) => a * c.f + b;
          const wrong: Wrong[] = [
            [
              opt(q, r + 1),
              `That makes $${back(q, r + 1)}$ ${c.small.en}, one too many.`,
              `这是 $${back(q, r + 1)}$ ${c.small["zh-CN"]}，多了 $1$。`,
            ],
            [
              opt(q - 1, r),
              `That makes only $${back(q - 1, r)}$ ${c.small.en}: one ${c.one.en} is missing.`,
              `这只有 $${back(q - 1, r)}$ ${c.small["zh-CN"]}，少了 $1$ ${c.one["zh-CN"]}。`,
            ],
            [
              opt(q + 1, r),
              `That makes $${back(q + 1, r)}$ ${c.small.en}, one ${c.one.en} too many.`,
              `这是 $${back(q + 1, r)}$ ${c.small["zh-CN"]}，多了 $1$ ${c.one["zh-CN"]}。`,
            ],
          ];
          if (c.f - r !== r)
            wrong.push([
              opt(q, c.f - r),
              `$${c.f - r}$ is what is still missing to make one more ${c.one.en}, not what is left over.`,
              `$${c.f - r}$ 是再凑满 $1$ ${c.one["zh-CN"]}还差的，不是剩下的。`,
            ]);
          return chosen(
            rng,
            [
              `Write $${nTex}$ ${c.small.en} in ${c.big.en} and ${c.small.en}.`,
              `把 $${n}$ ${c.small["zh-CN"]}写成几${c.big["zh-CN"]}几${c.small["zh-CN"]}。`,
            ],
            opt(q, r),
            wrong,
            [
              [
                ["Divide", "相除"],
                [
                  `There are $${c.f}$ ${c.small.en} in $1$ ${c.one.en}. Long division gives:`,
                  `$1$ ${c.one["zh-CN"]} $= ${c.f}$ ${c.small["zh-CN"]}。长除法得：`,
                ],
                [`${nTex} \\div ${c.f} = ${q} \\text{ R } ${r}`],
              ],
              [
                ["Read the answer", "读出结果"],
                [
                  `The quotient is the ${c.big.en} and the remainder the ${c.small.en}: $${q}$ ${c.big.en} $${r}$ ${c.small.en}.`,
                  `商是${c.big["zh-CN"]}数，余数是${c.small["zh-CN"]}数：$${q}$ ${c.big["zh-CN"]} $${r}$ ${c.small["zh-CN"]}。`,
                ],
              ],
            ],
            [
              `$${q} \\times ${c.f} + ${r} = ${q * c.f} + ${r} = ${n}$ ${c.small.en}.`,
              `$${q} \\times ${c.f} + ${r} = ${q * c.f} + ${r} = ${n}$ ${c.small["zh-CN"]}。`,
            ],
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 36,
            step: 12,
            labels: [0, 12, 24, 36],
            jumps: [
              [0, 12],
              [12, 24],
            ],
            marks: [{ at: 28, text: "28", result: true }],
          },
          ["28 inches: two jumps of 12 inches, 2 feet, and 4 inches more.", "28 英寸：跳两次、每次 12 英寸，是 2 英尺，再多 4 英寸。"],
        ),
      ),
      lesson(
        "converting-to-a-mixed-number-of-larger-units",
        ["Writing the result as a mixed number", "把结果写成带分数"],
        [
          [
            "To write the result as a mixed number, keep the quotient as the whole part and write the remainder as a fraction of one larger unit: remainder over the factor, simplified. $1{,}000$ in $= 83$ ft $4$ in, and $4$ in is $\\frac{4}{12} = \\frac{1}{3}$ ft, so $1{,}000$ in $= 83\\frac{1}{3}$ ft.",
            "把结果写成带分数时，商作整数部分，余数写成一个大单位的几分之几：余数比进率，再约分。$1000$ 英寸 $= 83$ 英尺 $4$ 英寸，$4$ 英寸是 $\\frac{4}{12} = \\frac{1}{3}$ 英尺，所以 $1000$ 英寸 $= 83\\frac{1}{3}$ 英尺。",
          ],
          ["$83\\frac{1}{3} \\times 12 = 996 + 4 = 1{,}000$.", "$83\\frac{1}{3} \\times 12 = 996 + 4 = 1000$。"],
          [
            "The remainder is a fraction of the factor, not a decimal. $4$ inches is $\\frac{1}{3}$ foot, not $0.4$ foot.",
            "余数要写成进率的几分之几，不是小数。$4$ 英寸是 $\\frac{1}{3}$ 英尺，不是 $0.4$ 英尺。",
          ],
        ],
        (rng) => {
          const c = rng.pick(conversions.slice(0, 3));
          let n: number;
          do n = rng.int(200, 2999);
          while (n % c.f === 0);
          const v = Q.of(n, c.f);
          const q = Math.floor(n / c.f);
          const r = n % c.f;
          return valued(
            [
              `Write $${n}$ ${c.small.en} in ${c.big.en}, as a mixed number.`,
              `把 $${n}$ ${c.small["zh-CN"]}写成以${c.big["zh-CN"]}为单位的带分数。`,
            ],
            v,
            [
              [["Divide", "相除"], ["Long division:", "长除法："], [`${n} \\div ${c.f} = ${q} \\text{ R } ${r}`]],
              [
                ["Write the remainder as a fraction", "把余数写成分数"],
                [
                  `$${r}$ ${c.small.en} is $${fr(r, c.f)}$ of one ${c.one.en}:`,
                  `$${r}$ ${c.small["zh-CN"]}是 $1$ ${c.one["zh-CN"]}的 $${fr(r, c.f)}$：`,
                ],
                [`${n} \\div ${c.f} = ${mixedLatex(v)}`],
              ],
            ],
            [
              `$${q} \\times ${c.f} + ${r} = ${n}$, so $${mixedLatex(v)}$ ${c.big.en} is $${n}$ ${c.small.en}.`,
              `$${q} \\times ${c.f} + ${r} = ${n}$，所以 $${mixedLatex(v)}$ ${c.big["zh-CN"]}就是 $${n}$ ${c.small["zh-CN"]}。`,
            ],
            [
              [Q.of(q), "That drops the remainder.", "这丢掉了余数。"],
              [
                Q.of(q).add(Q.of(r, 10)),
                `That writes the remainder as tenths. It is a fraction of $${c.f}$.`,
                `这把余数写成了十分之几。它应该是 $${c.f}$ 的几分之几。`,
              ],
              [Q.of(n * c.f), "That multiplies. Changing to a larger unit means dividing.", "这是乘法。换成较大的单位要用除法。"],
            ],
            { form: "mixed" },
          );
        },
        lineFigure(
          {
            lo: 0,
            hi: 48,
            step: 12,
            labels: [0, 12, 24, 36, 48],
            jumps: [
              [0, 12],
              [12, 24],
              [24, 36],
            ],
            marks: [{ at: 40, text: "40", result: true }],
          },
          [
            "40 inches: three jumps of 12 and 4 more, which is 4/12 = 1/3 of a foot.",
            "40 英寸：跳三次、每次 12，再多 4，而 4 是 1 英尺的 4/12 = 1/3。",
          ],
        ),
      ),
    ],
  ),
  [
    "A roll of ribbon is $100$ inches long. How many feet is that? $12$ inches make a foot, and $100 \\div 12 = 8$ R $4$: $8$ feet and $4$ inches.",
    "一卷丝带长 $100$ 英寸。合多少英尺？$12$ 英寸是 $1$ 英尺，$100 \\div 12 = 8$ 余 $4$：$8$ 英尺 $4$ 英寸。",
  ],
  ["$8 \\times 12 + 4 = 100$ inches.", "$8 \\times 12 + 4 = 100$ 英寸。"],
  [
    "change to larger units of length by long division and write the result with a remainder or as a mixed number.",
    "用长除法把长度化成较大的单位，用余数或带分数表示结果。",
  ],
);

/** grade6RatioTopics lists the 6th grade topics on ratios, rates, percentages and unit conversions. */
export const grade6RatioTopics: readonly TopicDef[] = [
  equivalentRatios,
  writingRatiosUsingFractions,
  comparingRatios,
  approximatingRatios,
  reasoningWithEquivalentRatios,
  furtherReasoningWithEquivalentRatios,
  ratioTables,
  graphingRatios,
  tapeDiagrams,
  solvingProblemsUsingUnitRates,
  speedAsAUnitRate,
  understandingPercentagesUsingModels,
  convertingBetweenPercentagesAndFractions,
  convertingBetweenPercentagesAndDecimals,
  comparingFractionsPercentsAndDecimals,
  findingAPercentageGivenTwoNumbers,
  findingPartOfANumberGivenAWholeAndAPercentage,
  findingATotalGivenAPartAndAPercentage,
  findingAPercentageGivenTwoNumbersWordProblems,
  findingPartOfANumberGivenAWholeAndAPercentageWordProblems,
  convertingUnitsOfLengthToLargerUnitsUsingLongDivision,
];
