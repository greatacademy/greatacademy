import type { Figure, KnowledgePointDef, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type Mark, type Point, Q, sketch } from "@ga/subject-math";
import { gradeDrawings3 } from "../explanation-drawings-grades-3.ts";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";

import { unitLatex } from "../problems.ts";
import { rectangle, sides } from "./area.ts";
import type { Pair, Walk, Wrong } from "./early-grades-more-kit.ts";
import { arcPoints, PI_EN, PI_ZH, piQ, piSum, piTex } from "./geometry-circles.ts";
import { chosen, drawn, expressed, lesson, type Said, valued, withIntro } from "./grade-6-kit.ts";
import { equalTape, tapeFigure } from "./upper-grades-kit.ts";

// 7th Grade Math, measurement: scale drawings, circles and composite shapes with them, and prisms.

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

const units = ["cm", "m", "in", "ft"] as const;

/** Unit is a unit of length. */
type Unit = (typeof units)[number];

/** pickUnit draws a unit of length. */
const pickUnit = (rng: Rng): Unit => rng.pick(units);

/** fig builds a figure from sketch marks. */
const fig = (marks: readonly Mark[], en: string, zh: string): Figure => ({ svg: sketch(marks), alt: t(en, zh) });

/** num writes a terminating number in decimal form: "78.5", "12". */
const num = (v: number | Q) => dec(typeof v === "number" ? Q.of(v) : v);

/** lenTex writes a measure with its unit, squared or cubed when power is 2 or 3: "8\text{ cm}", "24\text{ cm}^2". */
const lenTex = (v: number | Q | string, u: string, power = 1) =>
  `${typeof v === "string" ? v : num(v)}${unitLatex(power > 1 ? `${u}^${power}` : u)}`;

/** group writes an integer with thin spaces between groups of three digits: "250\\,000". */
const group = (v: number | Q) => num(v).replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");

/** gcd is the greatest common divisor of two positive integers. */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

// ---------------------------------------------------------------------------
// Scale drawings

/** Plan is a kind of scale drawing, with the units it is drawn and measured in. */
interface Plan {
  readonly name: Text;
  readonly plural: Text;
  readonly object: Text;
  /** du is the unit on the drawing. */
  readonly du: "cm" | "in";
  /** au is the unit of the actual object. */
  readonly au: "m" | "km" | "ft";
  /** factor is how many drawing units make one actual unit. */
  readonly factor: number;
  /** scales are the actual lengths that one drawing unit may stand for. */
  readonly scales: readonly number[];
}

const plans: readonly Plan[] = [
  {
    name: t("floor plan", "平面图"),
    plural: t("floor plans", "平面图"),
    object: t("wall", "墙"),
    du: "cm",
    au: "m",
    factor: 100,
    scales: [2, 3, 4, 5, 8, 10],
  },
  {
    name: t("map", "地图"),
    plural: t("maps", "地图"),
    object: t("road", "公路"),
    du: "cm",
    au: "km",
    factor: 100000,
    scales: [2, 4, 5, 10, 20, 25],
  },
  {
    name: t("blueprint", "设计图"),
    plural: t("blueprints", "设计图"),
    object: t("deck", "平台"),
    du: "in",
    au: "ft",
    factor: 12,
    scales: [2, 3, 4, 5, 6, 8],
  },
];

/** perUnit says how many drawing units make one actual unit, in words for a solution. */
const perUnit = (p: Plan): Pair =>
  p.au === "m"
    ? ["$1\\text{ m} = 100\\text{ cm}$", "$1\\text{ m} = 100\\text{ cm}$"]
    : p.au === "km"
      ? ["$1\\text{ km} = 100\\,000\\text{ cm}$", "$1\\text{ km} = 100\\,000\\text{ cm}$"]
      : ["$1\\text{ ft} = 12\\text{ in}$", "$1\\text{ ft} = 12\\text{ in}$"];

/** introductionToScaleDrawings reads, writes and compares the scales of scale drawings. */
export const introductionToScaleDrawings = withIntro(
  topic(
    "introduction-to-scale-drawings",
    t("Introduction to Scale Drawings", "比例图入门"),
    t(
      "A scale drawing shows an object with every length multiplied by the same factor. Its scale, such as 1 cm : 4 m, says what actual length one unit on the drawing stands for; written in one unit, it becomes a ratio without units, such as 1 : 400.",
      "比例图把物体的每个长度都乘同一个数后画出来。比例尺（例如 1 cm : 4 m）说明图上的一个单位代表多长的实际长度；把两边换成同一个单位，就得到没有单位的比，例如 1 : 400。",
    ),
    ["understanding-proportional-relationships-using-tables"],
    ["7.G.A.1"],
    [
      lesson(
        "finding-the-scale",
        ["Finding the scale", "求比例尺"],
        [
          [
            "Every centimeter of a scale drawing stands for the same actual length. If a $12$ m wall is drawn $3$ cm long, each centimeter stands for $12 \\div 3 = 4$ m, so the scale is $1\\text{ cm} : 4\\text{ m}$.",
            "比例图上每厘米代表的实际长度都相同。若一面 $12$ m 长的墙在图上画成 $3$ cm，那么每厘米代表 $12 \\div 3 = 4$ m，比例尺是 $1\\text{ cm} : 4\\text{ m}$。",
          ],
          [
            "Multiply back: $3$ centimeters of $4$ m each make $3 \\cdot 4 = 12$ m.",
            "乘回去：$3$ 厘米，每厘米 $4$ m，合起来是 $3 \\cdot 4 = 12$ m。",
          ],
          ["Divide the actual length by the drawn length, not the other way round.", "要用实际长度除以图上长度，不要反过来。"],
        ],
        (rng) => {
          const p = rng.pick(plans);
          const k = rng.pick(p.scales) * rng.pick([1, 1, 2, 3]);
          const d = rng.int(2, 12);
          const actual = k * d;
          const [name, object]: [Pair, Pair] = [
            [p.name.en, p.name["zh-CN"]],
            [p.object.en, p.object["zh-CN"]],
          ];
          return valued(
            [
              `On a ${name[0]}, a ${object[0]} that is $${lenTex(actual, p.au)}$ long is drawn $${lenTex(d, p.du)}$ long. Complete the scale: $1\\text{ ${p.du}} : ?\\text{ ${p.au}}$.`,
              `在一张${name[1]}上，一条实际长 $${lenTex(actual, p.au)}$ 的${object[1]}画成 $${lenTex(d, p.du)}$ 长。把比例尺补充完整：$1\\text{ ${p.du}} : ?\\text{ ${p.au}}$。`,
            ],
            k,
            [
              [
                ["Read the scale", "理解比例尺"],
                [
                  `The scale asks what $1$ ${p.du} stands for. Here $${d}$ ${p.du} stand for $${actual}$ ${p.au}, shared equally among them.`,
                  `比例尺问的是图上 $1$ ${p.du} 代表多长。这里 $${d}$ ${p.du} 一共代表 $${actual}$ ${p.au}，每份一样多。`,
                ],
              ],
              [
                ["Divide", "相除"],
                ["Share the actual length among the drawn units:", "把实际长度平均分给图上的每个单位："],
                [`${actual} \\div ${d} = ${lenTex(k, p.au)}`],
              ],
            ],
            [
              `Multiply back: $${d}$ ${p.du} of $${k}$ ${p.au} each make $${d} \\cdot ${k} = ${actual}$ ${p.au}.`,
              `乘回去：$${d}$ ${p.du}，每个代表 $${k}$ ${p.au}，合起来是 $${d} \\cdot ${k} = ${actual}$ ${p.au}。`,
            ],
            [
              [Q.of(d, actual), "That divides the drawn length by the actual length, upside down.", "这是用图上长度除以实际长度，除反了。"],
              [actual * d, "That multiplies the two lengths instead of dividing.", "这是把两个长度相乘了，应该相除。"],
              [actual, "That is the whole length, not what one unit stands for.", "这是整个长度，不是图上一个单位代表的长度。"],
              [actual - d, "That subtracts the drawn length instead of dividing by it.", "这是减去图上长度，应该除以它。"],
            ],
            { unit: p.au, figure: equalTape(d, `? ${p.au}`, `${actual} ${p.au}`) },
          );
        },
        equalTape(3, "? m", "12 m"),
      ),
      lesson(
        "scales-as-ratios",
        ["Scales as ratios", "用比表示比例尺"],
        [
          [
            "To write a scale without units, put both sides in the same unit. Since $1\\text{ m} = 100\\text{ cm}$, the scale $1\\text{ cm} : 4\\text{ m}$ is $1\\text{ cm} : 400\\text{ cm}$, or $1 : 400$: every length on the drawing is $\\frac{1}{400}$ of the real one. Likewise $1\\text{ cm} : 2\\text{ km}$ is $1 : 200\\,000$, and $1\\text{ in} : 3\\text{ ft}$ is $1 : 36$.",
            "要写出不带单位的比例尺，先把两边换成同一个单位。因为 $1\\text{ m} = 100\\text{ cm}$，比例尺 $1\\text{ cm} : 4\\text{ m}$ 就是 $1\\text{ cm} : 400\\text{ cm}$，即 $1 : 400$：图上每个长度都是实际的 $\\frac{1}{400}$。同样，$1\\text{ cm} : 2\\text{ km}$ 是 $1 : 200\\,000$，$1\\text{ in} : 3\\text{ ft}$ 是 $1 : 36$。",
          ],
          [
            "Go back: $400 \\div 100 = 4$, so $400$ cm is the $4$ m we started with.",
            "反过来算：$400 \\div 100 = 4$，所以 $400$ cm 正是原来的 $4$ m。",
          ],
          [
            "Do not just drop the units: $1 : 4$ would mean the real wall is only $4$ times as long as the drawing.",
            "不能直接去掉单位：$1 : 4$ 表示实际只是图上的 $4$ 倍。",
          ],
        ],
        (rng) => {
          const p = rng.pick(plans);
          const k = rng.pick(p.scales) * rng.pick([1, 2, 3]);
          const n = k * p.factor;
          const per = perUnit(p);
          const name: Pair = [p.name.en, p.name["zh-CN"]];
          const small: [number, string, string] =
            p.factor === 12
              ? [k * 10, "That uses $10$ inches in a foot, but there are $12$.", "这是把 $1$ 英尺当成 $10$ 英寸，其实是 $12$ 英寸。"]
              : p.au === "m"
                ? [
                    n / 10,
                    "That uses $10$ centimeters in a meter, but there are $100$.",
                    "这是把 $1$ 米当成 $10$ 厘米，其实是 $100$ 厘米。",
                  ]
                : [
                    n / 10,
                    "That uses $10\\,000$ centimeters in a kilometer, but there are $100\\,000$.",
                    "这是把 $1$ 千米当成 $10\\,000$ 厘米，其实是 $100\\,000$ 厘米。",
                  ];
          return valued(
            [
              `A ${name[0]} has the scale $1\\text{ ${p.du}} : ${lenTex(k, p.au)}$. Written without units, the scale is $1 : n$. What is $n$?`,
              `一张${name[1]}的比例尺是 $1\\text{ ${p.du}} : ${lenTex(k, p.au)}$。写成不带单位的比是 $1 : n$。$n$ 是多少？`,
            ],
            n,
            [
              [
                ["Use one unit", "换成同一个单位"],
                [
                  `Write the right side in ${p.du === "cm" ? "centimeters" : "inches"}, since ${per[0]}:`,
                  `把右边换成${p.du === "cm" ? "厘米" : "英寸"}，因为${per[1]}：`,
                ],
                [`${lenTex(k, p.au)} = ${k} \\cdot ${group(p.factor)} = ${lenTex(group(n), p.du)}`],
              ],
              [
                ["Drop the units", "去掉单位"],
                ["Both sides are now in the same unit:", "两边单位相同了："],
                [`1\\text{ ${p.du}} : ${lenTex(group(n), p.du)} = 1 : ${group(n)}`],
              ],
            ],
            [
              `Go back: $${group(n)} \\div ${group(p.factor)} = ${k}$, the $${k}$ ${p.au} we started with.`,
              `反过来算：$${group(n)} \\div ${group(p.factor)} = ${k}$，正是原来的 $${k}$ ${p.au}。`,
            ],
            [
              [k, "That drops the units without changing them to the same unit.", "这是没有换成同一个单位就去掉了单位。"],
              small,
              [n * 10, "That converts with a number ten times too big.", "这是换算时用的数大了十倍。"],
            ],
            { form: "integer" },
          );
        },
        equalTape(4, "100 cm", "4 m = 400 cm"),
      ),
      lesson(
        "comparing-scales",
        ["Comparing scales", "比较比例尺"],
        [
          [
            "A $60$ m wall is $60 \\div 5 = 12$ cm long at the scale $1\\text{ cm} : 5\\text{ m}$, but $60 \\div 2 = 30$ cm long at $1\\text{ cm} : 2\\text{ m}$. The less each centimeter stands for, the bigger the drawing. Work out each drawn length before comparing.",
            "一面 $60$ m 长的墙，按比例尺 $1\\text{ cm} : 5\\text{ m}$ 画是 $60 \\div 5 = 12$ cm，按 $1\\text{ cm} : 2\\text{ m}$ 画是 $60 \\div 2 = 30$ cm。每厘米代表得越少，画出的图越大。先分别算出图上长度，再比较。",
          ],
          [
            "Each centimeter at $1 : 2$ covers $2$ m, so $30$ cm cover $60$ m; and $12$ cm at $5$ m each also make $60$ m.",
            "按 $1\\text{ cm} : 2\\text{ m}$，$30$ cm 代表 $60$ m；按 $5$ m 每厘米，$12$ cm 也代表 $60$ m。",
          ],
          [
            "Do not subtract the scales: $5 - 2 = 3$ says nothing about the drawn lengths.",
            "不要把比例尺相减：$5 - 2 = 3$ 和图上长度没有关系。",
          ],
        ],
        (rng) => {
          const p = rng.pick(plans);
          const [k1, k2] = rng
            .shuffle([...p.scales])
            .slice(0, 2)
            .sort((a, b) => a - b) as [number, number];
          const lcm = (k1 * k2) / gcd(k1, k2);
          const actual = lcm * rng.int(1, Math.max(1, Math.floor(120 / lcm)));
          const [d1, d2] = [actual / k1, actual / k2];
          const [plural, object, name]: [Pair, Pair, Pair] = [
            [p.plural.en, p.plural["zh-CN"]],
            [p.object.en, p.object["zh-CN"]],
            [p.name.en, p.name["zh-CN"]],
          ];
          return valued(
            [
              `Two ${plural[0]} show the same ${object[0]}, which is $${lenTex(actual, p.au)}$ long. One uses the scale $1\\text{ ${p.du}} : ${lenTex(k1, p.au)}$ and the other $1\\text{ ${p.du}} : ${lenTex(k2, p.au)}$. How much longer is the ${object[0]} on the first ${name[0]} than on the second?`,
              `两张${plural[1]}画了同一条 $${lenTex(actual, p.au)}$ 长的${object[1]}。一张的比例尺是 $1\\text{ ${p.du}} : ${lenTex(k1, p.au)}$，另一张是 $1\\text{ ${p.du}} : ${lenTex(k2, p.au)}$。第一张图上的${object[1]}比第二张上的长多少？`,
            ],
            d1 - d2,
            [
              [
                ["Find each drawn length", "分别求图上长度"],
                ["Divide the actual length by what one unit stands for:", "用实际长度除以每个单位代表的长度："],
                [`${actual} \\div ${k1} = ${lenTex(d1, p.du)}`, `${actual} \\div ${k2} = ${lenTex(d2, p.du)}`],
              ],
              [["Subtract", "相减"], ["The first drawing is longer by", "第一张图上长出"], [`${d1} - ${d2} = ${lenTex(d1 - d2, p.du)}`]],
            ],
            [
              `Multiply back: $${d1} \\cdot ${k1} = ${actual}$ and $${d2} \\cdot ${k2} = ${actual}$, so both drawings show the same ${object[0]}.`,
              `乘回去：$${d1} \\cdot ${k1} = ${actual}$，$${d2} \\cdot ${k2} = ${actual}$，两张图画的是同一条${object[1]}。`,
            ],
            [
              [k2 - k1, "That subtracts the scales, not the drawn lengths.", "这是把比例尺相减了，不是图上长度相减。"],
              [d1, "That is the length on the first drawing only.", "这只是第一张图上的长度。"],
              [d2, "That is the length on the second drawing only.", "这只是第二张图上的长度。"],
              [d1 + d2, "That adds the two drawn lengths instead of subtracting.", "这是把两个图上长度相加了，应该相减。"],
            ],
            {
              unit: p.du,
              figure: tapeFigure(
                [
                  { total: `${d1} ${p.du}`, pieces: [{ size: d1, text: `1 ${p.du} : ${k1} ${p.au}` }] },
                  { total: `${d2} ${p.du}`, pieces: [{ size: d2, text: d2 >= d1 / 2 ? `1 ${p.du} : ${k2} ${p.au}` : "" }] },
                ],
                [
                  `Two bars for the same ${object[0]}: ${d1} ${p.du} long at the first scale and ${d2} ${p.du} long at the second.`,
                  `同一条${object[1]}的两个长条：按第一种比例尺长 ${d1} ${p.du}，按第二种长 ${d2} ${p.du}。`,
                ],
              ),
            },
          );
        },
        tapeFigure(
          [
            { total: "30 cm", pieces: [{ size: 30, text: "1 cm : 2 m" }] },
            { total: "12 cm", pieces: [{ size: 12, text: "1 cm : 5 m" }] },
          ],
          [
            "The same 60 m wall drawn 30 cm long at 1 cm : 2 m and 12 cm long at 1 cm : 5 m.",
            "同一面 60 m 的墙，按 1 cm : 2 m 画长 30 cm，按 1 cm : 5 m 画长 12 cm。",
          ],
        ),
      ),
    ],
  ),
  [
    "A toy car is a tiny copy of a real car: every length is shrunk by the same amount, so it still looks right. A map does the same thing to a whole town.",
    "玩具汽车是真汽车的小复制品：每个长度都缩小同样的倍数，所以看起来还是一模一样。地图对整座城镇也是这样做的。",
  ],
  [
    "If each centimeter of the toy stands for $20$ cm of the real car, a $4$ m car becomes a $20$ cm toy, since $400 \\div 20 = 20$.",
    "如果玩具上每厘米代表真车的 $20$ cm，那么 $4$ m 长的车变成 $20$ cm 长的玩具，因为 $400 \\div 20 = 20$。",
  ],
  [
    "find the scale of a drawing, write it as a ratio without units, and compare drawings made at different scales.",
    "学习求比例图的比例尺，把它写成不带单位的比，并比较不同比例尺画出的图。",
  ],
);

/** calculatingLengthsFromScaleDrawings converts between drawn and actual lengths. */
export const calculatingLengthsFromScaleDrawings = withIntro(
  topic(
    "calculating-lengths-from-scale-drawings",
    t("Calculating Lengths From Scale Drawings", "根据比例图计算长度"),
    t(
      "A scale is a ratio of drawn length to actual length, so a scale drawing is a proportional relationship. Multiply to go from the drawing to the actual object, divide to go back, and convert units when the scale is written without them.",
      "比例尺是图上长度与实际长度的比，所以比例图是一种正比例关系。从图上长度求实际长度用乘法，反过来用除法；比例尺不带单位时，还要换算单位。",
    ),
    ["introduction-to-scale-drawings"],
    ["7.G.A.1", "7.RP.A.2"],
    [
      lesson(
        "from-drawing-to-actual",
        ["From the drawing to the actual length", "由图上长度求实际长度"],
        [
          [
            "The drawn and actual lengths are in proportion. With the scale $2\\text{ cm} : 5\\text{ m}$, a $14$ cm line solves $\\frac{2}{5} = \\frac{14}{x}$, so $x = \\frac{14 \\cdot 5}{2} = 35$ m.",
            "图上长度与实际长度成比例。比例尺为 $2\\text{ cm} : 5\\text{ m}$ 时，图上 $14$ cm 的线段满足 $\\frac{2}{5} = \\frac{14}{x}$，所以 $x = \\frac{14 \\cdot 5}{2} = 35$ m。",
          ],
          [
            "Count groups: $14$ cm is $7$ groups of $2$ cm, and each group stands for $5$ m, so $7 \\cdot 5 = 35$ m.",
            "按组数：$14$ cm 是 $7$ 组 $2$ cm，每组代表 $5$ m，所以 $7 \\cdot 5 = 35$ m。",
          ],
          [
            "The scale starts at $2$ cm, not $1$ cm: $14 \\cdot 5 = 70$ forgets to divide by $2$.",
            "比例尺左边是 $2$ cm 而不是 $1$ cm：$14 \\cdot 5 = 70$ 忘了除以 $2$。",
          ],
        ],
        (rng) => {
          const p = rng.pick(plans);
          let a: number;
          let b: number;
          let d: number;
          do {
            a = rng.pick([2, 3, 4, 5]);
            b = rng.int(3, 30);
            d = rng.int(3, 20);
          } while (gcd(a, b) !== 1 || d % a !== 0 || d === a);
          const actual = (d * b) / a;
          const [name, object]: [Pair, Pair] = [
            [p.name.en, p.name["zh-CN"]],
            [p.object.en, p.object["zh-CN"]],
          ];
          return valued(
            [
              `The scale of a ${name[0]} is $${lenTex(a, p.du)} : ${lenTex(b, p.au)}$. A ${object[0]} is $${lenTex(d, p.du)}$ long on the ${name[0]}. How long is the actual ${object[0]}?`,
              `一张${name[1]}的比例尺是 $${lenTex(a, p.du)} : ${lenTex(b, p.au)}$。一条${object[1]}在图上长 $${lenTex(d, p.du)}$。这条${object[1]}实际有多长？`,
            ],
            actual,
            [
              [
                ["Write a proportion", "列比例式"],
                [
                  `Drawn over actual is the same for the scale and for the ${object[0]}:`,
                  `比例尺和这条${object[1]}的图上长度与实际长度之比相同：`,
                ],
                [`\\frac{${a}}{${b}} = \\frac{${d}}{x}`],
              ],
              [
                ["Solve", "求解"],
                ["Cross-multiply and divide:", "交叉相乘再除："],
                [`x = \\frac{${d} \\cdot ${b}}{${a}} = ${lenTex(actual, p.au)}`],
              ],
            ],
            [
              `Count groups: $${d}$ ${p.du} is $${d / a}$ groups of $${a}$ ${p.du}, each standing for $${b}$ ${p.au}: $${d / a} \\cdot ${b} = ${actual}$.`,
              `按组数：$${d}$ ${p.du} 是 $${d / a}$ 组 $${a}$ ${p.du}，每组代表 $${b}$ ${p.au}：$${d / a} \\cdot ${b} = ${actual}$。`,
            ],
            [
              [Q.of(d * a, b), "That turns the scale upside down.", "这是把比例尺倒过来用了。"],
              [
                d * b,
                `That treats the scale as $1$ ${p.du} : $${b}$ ${p.au}, but it starts at $${a}$ ${p.du}.`,
                `这是把比例尺当成 $1$ ${p.du} : $${b}$ ${p.au}，但左边是 $${a}$ ${p.du}。`,
              ],
              [
                d / a,
                "That counts the groups but does not multiply by what each group stands for.",
                "这只数了组数，没有乘每组代表的长度。",
              ],
            ],
            { unit: p.au, figure: equalTape(d / a, `${a} ${p.du}`, `${d} ${p.du}`) },
          );
        },
        equalTape(7, "2 cm", "14 cm"),
      ),
      lesson(
        "from-actual-to-drawing",
        ["From the actual length to the drawing", "由实际长度求图上长度"],
        [
          [
            "To draw a $27$ m wall at the scale $2\\text{ cm} : 3\\text{ m}$, solve $\\frac{2}{3} = \\frac{x}{27}$: $x = \\frac{2 \\cdot 27}{3} = 18$ cm.",
            "按比例尺 $2\\text{ cm} : 3\\text{ m}$ 画一面 $27$ m 长的墙，解 $\\frac{2}{3} = \\frac{x}{27}$：$x = \\frac{2 \\cdot 27}{3} = 18$ cm。",
          ],
          [
            "Go back: $18$ cm is $9$ groups of $2$ cm, which stand for $9 \\cdot 3 = 27$ m.",
            "反过来：$18$ cm 是 $9$ 组 $2$ cm，代表 $9 \\cdot 3 = 27$ m。",
          ],
          [
            "The drawing is the smaller one: if your answer is longer than the real wall, the scale was turned upside down.",
            "图上的长度更小：如果答案比实际的墙还长，就是把比例尺倒过来用了。",
          ],
        ],
        (rng) => {
          const p = rng.pick(plans);
          let a: number;
          let b: number;
          let m: number;
          do {
            a = rng.pick([1, 1, 2, 3, 4]);
            b = rng.int(2, 25);
            m = rng.int(3, 36);
          } while (gcd(a, b) !== 1 || (m * b) % (2 * a) !== 0 || b === 2 * a);
          // The drawn length is m halves, so it may end in .5.
          const drawnLength = Q.of(m, 2);
          const actual = (m * b) / (2 * a);
          const [name, object]: [Pair, Pair] = [
            [p.name.en, p.name["zh-CN"]],
            [p.object.en, p.object["zh-CN"]],
          ];
          return valued(
            [
              `The scale of a ${name[0]} is $${lenTex(a, p.du)} : ${lenTex(b, p.au)}$. How long should a ${object[0]} that is $${lenTex(actual, p.au)}$ long be drawn?`,
              `一张${name[1]}的比例尺是 $${lenTex(a, p.du)} : ${lenTex(b, p.au)}$。一条实际长 $${lenTex(actual, p.au)}$ 的${object[1]}在图上应画多长？`,
            ],
            drawnLength,
            [
              [
                ["Write a proportion", "列比例式"],
                [
                  `Drawn over actual is the same for the scale and for the ${object[0]}:`,
                  `比例尺和这条${object[1]}的图上长度与实际长度之比相同：`,
                ],
                [`\\frac{${a}}{${b}} = \\frac{x}{${actual}}`],
              ],
              [
                ["Solve", "求解"],
                ["Multiply both sides by the actual length:", "两边同乘实际长度："],
                [`x = \\frac{${a} \\cdot ${actual}}{${b}} = ${lenTex(drawnLength, p.du)}`],
              ],
            ],
            [
              a === 1
                ? `Go back: each ${p.du} stands for $${b}$ ${p.au}, so $${num(drawnLength)} \\cdot ${b} = ${actual}$ ${p.au}, the length we started with.`
                : `Go back: each ${p.du} stands for $\\frac{${b}}{${a}}$ ${p.au}, so $${num(drawnLength)} \\cdot ${b} \\div ${a} = ${actual}$ ${p.au}, the length we started with.`,
              a === 1
                ? `反过来算：每 ${p.du} 代表 $${b}$ ${p.au}，所以 $${num(drawnLength)} \\cdot ${b} = ${actual}$ ${p.au}，正是原来的长度。`
                : `反过来算：每 ${p.du} 代表 $\\frac{${b}}{${a}}$ ${p.au}，所以 $${num(drawnLength)} \\cdot ${b} \\div ${a} = ${actual}$ ${p.au}，正是原来的长度。`,
            ],
            [
              [
                Q.of(actual * b, a),
                "That turns the scale upside down, so the drawing comes out bigger than the real thing.",
                "这是把比例尺倒过来用了，图上长度反而比实际还长。",
              ],
              [
                Q.of(actual, b),
                `That divides by $${b}$ but forgets that the scale starts at $${a}$ ${p.du}.`,
                `这是除以了 $${b}$，但忘了比例尺左边是 $${a}$ ${p.du}。`,
              ],
              [actual, "That is the actual length, not the drawn one.", "这是实际长度，不是图上长度。"],
            ],
            { unit: p.du },
          );
        },
        equalTape(9, "2 cm : 3 m", "18 cm : 27 m"),
      ),
      lesson(
        "scales-without-units",
        ["Scales without units", "不带单位的比例尺"],
        [
          [
            "On a map with the scale $1 : 50\\,000$, every real length is $50\\,000$ times the map length, in the same unit. A $6$ cm distance on the map is $6 \\cdot 50\\,000 = 300\\,000$ cm. Since $1\\text{ km} = 100\\,000\\text{ cm}$, that is $3$ km.",
            "在比例尺为 $1 : 50\\,000$ 的地图上，每个实际长度都是图上的 $50\\,000$ 倍，单位相同。图上 $6$ cm 的距离实际是 $6 \\cdot 50\\,000 = 300\\,000$ cm。因为 $1\\text{ km} = 100\\,000\\text{ cm}$，这就是 $3$ km。",
          ],
          [
            "Change the scale first: $1$ cm stands for $50\\,000$ cm $= 0.5$ km, so $6$ cm stand for $6 \\cdot 0.5 = 3$ km.",
            "先换算比例尺：$1$ cm 代表 $50\\,000$ cm $= 0.5$ km，所以 $6$ cm 代表 $6 \\cdot 0.5 = 3$ km。",
          ],
          ["A kilometer is $100\\,000$ centimeters: count the zeros carefully.", "$1$ 千米是 $100\\,000$ 厘米：数清楚有几个零。"],
        ],
        (rng) => {
          const n = rng.pick([20000, 25000, 50000, 100000, 200000, 250000]);
          const toKm = rng.bool();
          let cm: Q;
          do cm = Q.of(rng.int(2, 30), rng.pick([1, 2]));
          while (!cm.mul(Q.of(n, 100000)).mul(Q.of(100)).isInteger());
          const km = cm.mul(Q.of(n, 100000));
          const real = cm.mul(Q.of(n));
          const each = Q.of(n, 100000);
          const scaleCheck: Pair = toKm
            ? [
                `Change the scale first: $1$ cm stands for $${group(n)}$ cm $= ${num(each)}$ km, so $${num(cm)}$ cm stand for $${num(cm)} \\cdot ${num(each)} = ${num(km)}$ km.`,
                `先换算比例尺：$1$ cm 代表 $${group(n)}$ cm $= ${num(each)}$ km，所以 $${num(cm)}$ cm 代表 $${num(cm)} \\cdot ${num(each)} = ${num(km)}$ km。`,
              ]
            : [
                `Change the scale first: $1$ cm stands for $${group(n)}$ cm $= ${num(each)}$ km, so the map distance is $${num(km)} \\div ${num(each)} = ${num(cm)}$ cm.`,
                `先换算比例尺：$1$ cm 代表 $${group(n)}$ cm $= ${num(each)}$ km，所以图上距离是 $${num(km)} \\div ${num(each)} = ${num(cm)}$ cm。`,
              ];
          if (toKm) {
            return valued(
              [
                `A map has the scale $1 : ${group(n)}$. Two towns are $${lenTex(cm, "cm")}$ apart on the map. How far apart are they in kilometers?`,
                `一张地图的比例尺是 $1 : ${group(n)}$。两个镇在地图上相距 $${lenTex(cm, "cm")}$。它们实际相距多少千米？`,
              ],
              km,
              [
                [
                  ["Multiply by the scale", "乘比例尺"],
                  [
                    `The real distance is $${group(n)}$ times the map distance, in the same unit:`,
                    `实际距离是图上距离的 $${group(n)}$ 倍，单位相同：`,
                  ],
                  [`${num(cm)} \\cdot ${group(n)} = ${lenTex(group(real), "cm")}`],
                ],
                [
                  ["Change to kilometers", "换成千米"],
                  ["A kilometer is $100\\,000$ cm:", "$1$ 千米是 $100\\,000$ 厘米："],
                  [`${group(real)} \\div 100\\,000 = ${lenTex(km, "km")}`],
                ],
              ],
              scaleCheck,
              [
                [
                  km.mul(Q.of(100)),
                  "That divides by $1\\,000$ instead of $100\\,000$ to get kilometers.",
                  "这是除以 $1\\,000$ 换成千米，应该除以 $100\\,000$。",
                ],
                [
                  km.mul(Q.of(10)),
                  "That divides by $10\\,000$, one zero short of $100\\,000$.",
                  "这是除以 $10\\,000$，比 $100\\,000$ 少一个零。",
                ],
                [km.div(Q.of(10)), "That divides by $1\\,000\\,000$, one zero too many.", "这是除以 $1\\,000\\,000$，多了一个零。"],
              ],
              { unit: "km" },
            );
          }
          return valued(
            [
              `A map has the scale $1 : ${group(n)}$. Two towns are $${lenTex(km, "km")}$ apart. How far apart are they on the map, in centimeters?`,
              `一张地图的比例尺是 $1 : ${group(n)}$。两个镇实际相距 $${lenTex(km, "km")}$。它们在地图上相距多少厘米？`,
            ],
            cm,
            [
              [
                ["Change to centimeters", "换成厘米"],
                ["A kilometer is $100\\,000$ cm:", "$1$ 千米是 $100\\,000$ 厘米："],
                [`${num(km)} \\cdot 100\\,000 = ${lenTex(group(real), "cm")}`],
              ],
              [
                ["Divide by the scale", "除以比例尺"],
                [`The map distance is $\\frac{1}{${group(n)}}$ of the real one:`, `图上距离是实际距离的 $\\frac{1}{${group(n)}}$：`],
                [`${group(real)} \\div ${group(n)} = ${lenTex(cm, "cm")}`],
              ],
            ],
            scaleCheck,
            [
              [
                cm.mul(Q.of(100)),
                "That uses $10\\,000\\,000$ cm in a kilometer, two zeros too many.",
                "这是把 $1$ 千米当成 $10\\,000\\,000$ 厘米，多了两个零。",
              ],
              [
                cm.mul(Q.of(10)),
                "That uses $1\\,000\\,000$ cm in a kilometer, one zero too many.",
                "这是把 $1$ 千米当成 $1\\,000\\,000$ 厘米，多了一个零。",
              ],
              [
                cm.div(Q.of(10)),
                "That uses $10\\,000$ cm in a kilometer, one zero short.",
                "这是把 $1$ 千米当成 $10\\,000$ 厘米，少了一个零。",
              ],
            ],
            { unit: "cm" },
          );
        },
        equalTape(6, "50 000 cm", "300 000 cm = 3 km"),
      ),
    ],
  ),
  [
    "A treasure map says $1\\text{ cm} : 5\\text{ m}$. On the map, the X is $6$ cm from the old tree. How far from the tree should you dig?",
    "一张藏宝图上写着 $1\\text{ cm} : 5\\text{ m}$。图上的 X 离老树 $6$ cm。应该在离树多远的地方挖？",
  ],
  [
    "Each centimeter stands for $5$ m, so $6$ cm stand for $6 \\cdot 5 = 30$ m.",
    "每厘米代表 $5$ m，所以 $6$ cm 代表 $6 \\cdot 5 = 30$ m。",
  ],
  [
    "turn drawn lengths into real ones and back with a proportion, including scales written without units.",
    "学习用比例式在图上长度和实际长度之间互相换算，包括不带单位的比例尺。",
  ],
);

/** twoRectangles draws a small rectangle and a copy k times as large beside it. */
function twoRectangles(l: number, w: number, k: number, small: [string, string], big: [string, string]): Mark[] {
  const gap = l + 1;
  const bigRect: Point[] = rectangle(l * k, w * k).map(([x, y]) => [x + gap, y]);
  return [
    { kind: "polygon", points: rectangle(l, w) },
    ...sides(rectangle(l, w), [small[0], small[1], null, null]),
    { kind: "polygon", points: bigRect },
    ...sides(bigRect, [big[0], big[1], null, null]),
  ];
}

/** calculatingPerimetersAndAreasOfScaledShapes scales perimeters by the scale factor and areas by its square. */
export const calculatingPerimetersAndAreasOfScaledShapes = withIntro(
  topic(
    "calculating-perimeters-and-areas-of-scaled-shapes",
    t("Calculating Perimeters and Areas of Scaled Shapes", "计算缩放图形的周长和面积"),
    t(
      "When every length of a shape is multiplied by k, its perimeter is also multiplied by k, but its area is multiplied by k², because both the length and the width grow by k. So a floor plan at 1 cm : 3 m turns each square centimeter into 9 square meters.",
      "把图形的每个长度都乘 k 时，周长也乘 k，面积却乘 k²，因为长和宽都变成 k 倍。所以在比例尺为 1 cm : 3 m 的平面图上，每平方厘米代表 9 平方米。",
    ),
    ["calculating-lengths-from-scale-drawings", "area-of-rectangles-and-squares", "perimeters-of-shapes"],
    ["7.G.A.1"],
    [
      lesson(
        "actual-perimeters-and-areas",
        ["Actual perimeters and areas", "实际的周长和面积"],
        [
          [
            "Find the actual lengths first, then the perimeter or area. A room drawn $5$ cm by $4$ cm at $1\\text{ cm} : 3\\text{ m}$ is really $15$ m by $12$ m, so its perimeter is $2(15 + 12) = 54$ m and its area is $15 \\cdot 12 = 180\\text{ m}^2$.",
            "先求实际长度，再求周长或面积。在 $1\\text{ cm} : 3\\text{ m}$ 的图上画成 $5$ cm × $4$ cm 的房间，实际是 $15$ m × $12$ m，所以周长是 $2(15 + 12) = 54$ m，面积是 $15 \\cdot 12 = 180\\text{ m}^2$。",
          ],
          [
            "Scale the drawn area instead: $20\\text{ cm}^2$, and each square centimeter stands for $3 \\cdot 3 = 9\\text{ m}^2$, so $20 \\cdot 9 = 180$.",
            "也可以缩放图上面积：$20\\text{ cm}^2$，每平方厘米代表 $3 \\cdot 3 = 9\\text{ m}^2$，所以 $20 \\cdot 9 = 180$。",
          ],
          [
            "$20 \\cdot 3 = 60$ is wrong: an area grows in two directions, so it is multiplied by $3$ twice.",
            "$20 \\cdot 3 = 60$ 是错的：面积在两个方向上都变大，所以要乘两次 $3$。",
          ],
        ],
        (rng) => {
          const k = rng.pick([2, 3, 4, 5, 6, 10]);
          const l = rng.int(3, 9);
          let w = rng.int(2, 7);
          if (w === l) w = l - 1;
          const [L, W] = [l * k, w * k];
          const area = rng.bool();
          const room = rng.pick([
            [t("room", "房间"), t("A floor plan", "一张平面图")],
            [t("garden", "花园"), t("A plan", "一张规划图")],
            [t("parking lot", "停车场"), t("A site plan", "一张场地图")],
          ] as const);
          const head: Pair = [
            `${room[1].en} has the scale $1\\text{ cm} : ${lenTex(k, "m")}$. A rectangular ${room[0].en} is drawn $${lenTex(l, "cm")}$ by $${lenTex(w, "cm")}$.`,
            `${room[1]["zh-CN"]}的比例尺是 $1\\text{ cm} : ${lenTex(k, "m")}$。一个长方形${room[0]["zh-CN"]}在图上画成 $${lenTex(l, "cm")}$ × $${lenTex(w, "cm")}$。`,
          ];
          const first: Walk = [
            ["Find the actual lengths", "求实际长度"],
            [`Each centimeter stands for $${k}$ m:`, `每厘米代表 $${k}$ m：`],
            [`${l} \\cdot ${k} = ${lenTex(L, "m")}`, `${w} \\cdot ${k} = ${lenTex(W, "m")}`],
          ];
          const figure = fig(
            [{ kind: "polygon", points: rectangle(l, w) }, ...sides(rectangle(l, w), [`${l} cm`, `${w} cm`, null, null])],
            `A rectangle drawn ${l} cm by ${w} cm.`,
            `画成 ${l} cm × ${w} cm 的长方形。`,
          );
          if (area) {
            return valued(
              [`${head[0]} What is the actual area of the ${room[0].en}?`, `${head[1]}这个${room[0]["zh-CN"]}的实际面积是多少？`],
              L * W,
              [first, [["Multiply", "相乘"], ["Length times width:", "长乘宽："], [`${L} \\cdot ${W} = ${lenTex(L * W, "m", 2)}`]]],
              [
                `Scale the drawn area: $${l} \\cdot ${w} = ${l * w}\\text{ cm}^2$, and each square centimeter stands for $${k} \\cdot ${k} = ${k * k}\\text{ m}^2$: $${l * w} \\cdot ${k * k} = ${L * W}$.`,
                `缩放图上面积：$${l} \\cdot ${w} = ${l * w}\\text{ cm}^2$，每平方厘米代表 $${k} \\cdot ${k} = ${k * k}\\text{ m}^2$：$${l * w} \\cdot ${k * k} = ${L * W}$。`,
              ],
              [
                [
                  l * w * k,
                  `That multiplies the drawn area by $${k}$ once, but an area is multiplied by $${k}$ twice.`,
                  `这是把图上面积只乘了一次 $${k}$，面积要乘两次。`,
                ],
                [l * w, "That is the area on the drawing, not the real one.", "这是图上的面积，不是实际面积。"],
                [2 * (L + W), "That is the actual perimeter, not the area.", "这是实际周长，不是面积。"],
              ],
              { unit: "m^2", form: "integer", figure },
            );
          }
          return valued(
            [`${head[0]} What is the actual perimeter of the ${room[0].en}?`, `${head[1]}这个${room[0]["zh-CN"]}的实际周长是多少？`],
            2 * (L + W),
            [
              first,
              [
                ["Add the sides", "四边相加"],
                ["Two lengths and two widths:", "两条长加两条宽："],
                [`2(${L} + ${W}) = ${lenTex(2 * (L + W), "m")}`],
              ],
            ],
            [
              `Scale the drawn perimeter: $2(${l} + ${w}) = ${2 * (l + w)}$ cm, and a perimeter is a length, so $${2 * (l + w)} \\cdot ${k} = ${2 * (L + W)}$.`,
              `缩放图上周长：$2(${l} + ${w}) = ${2 * (l + w)}$ cm，周长是长度，所以 $${2 * (l + w)} \\cdot ${k} = ${2 * (L + W)}$。`,
            ],
            [
              [
                2 * (l + w) * k * k,
                `That multiplies by $${k}$ twice, as for an area, but a perimeter is a length.`,
                `这是像面积那样乘了两次 $${k}$，但周长是长度。`,
              ],
              [2 * (l + w), "That is the perimeter on the drawing, not the real one.", "这是图上的周长，不是实际周长。"],
              [L + W, "That adds only one length and one width.", "这只加了一条长和一条宽。"],
              [L * W, "That is the actual area, not the perimeter.", "这是实际面积，不是周长。"],
            ],
            { unit: "m", form: "integer", figure },
          );
        },
        drawn(gradeDrawings4["calculating-perimeters-and-areas-of-scaled-shapes#actual-perimeters-and-areas"]),
      ),
      lesson(
        "scale-factors-and-area",
        ["Scale factors, perimeter and area", "比例系数、周长与面积"],
        [
          [
            "If a shape is copied with scale factor $3$, every length triples. A perimeter of $14$ cm becomes $3 \\cdot 14 = 42$ cm. An area grows in two directions, so it is multiplied by $3^2 = 9$: $10\\text{ cm}^2$ becomes $90\\text{ cm}^2$. With scale factor $\\frac{1}{2}$, the perimeter halves and the area becomes $\\frac{1}{4}$ of the original.",
            "若按比例系数 $3$ 复制一个图形，每个长度都变成 $3$ 倍。周长 $14$ cm 变成 $3 \\cdot 14 = 42$ cm。面积在两个方向上变大，所以乘 $3^2 = 9$：$10\\text{ cm}^2$ 变成 $90\\text{ cm}^2$。比例系数为 $\\frac{1}{2}$ 时，周长减半，面积变为原来的 $\\frac{1}{4}$。",
          ],
          ["Go back: $90 \\div 9 = 10$ and $42 \\div 3 = 14$.", "反过来算：$90 \\div 9 = 10$，$42 \\div 3 = 14$。"],
          ["Square the scale factor for an area, but not for a perimeter.", "面积要乘比例系数的平方，周长不用。"],
        ],
        (rng) => {
          const k = rng.pick([Q.of(2), Q.of(3), Q.of(4), Q.of(5), Q.of(1, 2), Q.of(1, 3)]);
          const down = k.d !== 1n;
          const s = Number(k.d);
          const perimeter = rng.int(4, 20) * s;
          const area = rng.int(2, 15) * s * s;
          const u = pickUnit(rng);
          const shape = rng.pick([t("triangle", "三角形"), t("hexagon", "六边形"), t("logo", "标志"), t("trapezoid", "梯形")]);
          const askArea = rng.bool();
          const k2 = k.mul(k);
          const kTex = k.toLatex();
          const answer = askArea ? k2.mul(Q.of(area)) : k.mul(Q.of(perimeter));
          const prompt: Pair = [
            `A ${shape.en} has a perimeter of $${lenTex(perimeter, u)}$ and an area of $${lenTex(area, u, 2)}$. It is ${down ? "reduced" : "enlarged"} with scale factor $${kTex}$. What is the ${askArea ? "area" : "perimeter"} of the new ${shape.en}?`,
            `一个${shape["zh-CN"]}的周长是 $${lenTex(perimeter, u)}$，面积是 $${lenTex(area, u, 2)}$。按比例系数 $${kTex}$ 把它${down ? "缩小" : "放大"}。新${shape["zh-CN"]}的${askArea ? "面积" : "周长"}是多少？`,
          ];
          if (askArea) {
            return valued(
              prompt,
              answer,
              [
                [
                  ["Square the factor", "比例系数平方"],
                  [`Length and width both change by $${kTex}$, so the area changes by`, `长和宽都乘 $${kTex}$，所以面积乘`],
                  [`\\left(${kTex}\\right)^2 = ${k2.toLatex()}`],
                ],
                [
                  ["Multiply", "相乘"],
                  ["Apply it to the old area:", "用它乘原来的面积："],
                  [`${k2.toLatex()} \\cdot ${area} = ${lenTex(answer, u, 2)}`],
                ],
              ],
              [
                `Go back: $${num(answer)} \\div ${k2.toLatex()} = ${area}$, the old area.`,
                `反过来算：$${num(answer)} \\div ${k2.toLatex()} = ${area}$，正是原来的面积。`,
              ],
              [
                [
                  k.mul(Q.of(area)),
                  "That multiplies by the scale factor once, but an area grows in two directions.",
                  "这是只乘了一次比例系数，但面积在两个方向上都变化。",
                ],
                [Q.of(area).div(k2), "That divides by the square instead of multiplying.", "这是除以了平方，应该乘。"],
                [k.mul(Q.of(2 * area)), "That doubles the scale factor instead of squaring it.", "这是把比例系数乘 $2$，应该平方。"],
                [k.mul(Q.of(perimeter)), "That is the new perimeter, not the area.", "这是新的周长，不是面积。"],
              ],
              { unit: `${u}^2` },
            );
          }
          return valued(
            prompt,
            answer,
            [
              [
                ["Decide the factor", "确定倍数"],
                [
                  `A perimeter is a length, so it changes by $${kTex}$ itself, not by its square.`,
                  `周长是长度，所以乘 $${kTex}$ 本身，而不是它的平方。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                ["Apply it to the old perimeter:", "用它乘原来的周长："],
                [`${kTex} \\cdot ${perimeter} = ${lenTex(answer, u)}`],
              ],
            ],
            [
              `Go back: $${num(answer)} \\div ${kTex} = ${perimeter}$, the old perimeter.`,
              `反过来算：$${num(answer)} \\div ${kTex} = ${perimeter}$，正是原来的周长。`,
            ],
            [
              [
                k2.mul(Q.of(perimeter)),
                "That squares the scale factor, as for an area, but a perimeter is a length.",
                "这是像面积那样把比例系数平方了，但周长是长度。",
              ],
              [Q.of(perimeter).div(k), "That divides by the scale factor instead of multiplying.", "这是除以比例系数，应该乘。"],
              [k.add(Q.of(perimeter)), "That adds the scale factor instead of multiplying.", "这是加上比例系数，应该乘。"],
            ],
            { unit: u },
          );
        },
        fig(
          twoRectangles(2, 1, 3, ["2", "1"], ["6", "3"]),
          "A 2 by 1 rectangle and a copy with scale factor 3, 6 by 3: the perimeter is 3 times as long and the area 9 times as large.",
          "一个 2 × 1 的长方形和按比例系数 3 放大的 6 × 3 的长方形：周长是 3 倍，面积是 9 倍。",
        ),
      ),
      lesson(
        "areas-on-scale-drawings",
        ["Areas on scale drawings", "比例图上的面积"],
        [
          [
            "At the scale $1\\text{ cm} : 4\\text{ m}$, a $1$ cm by $1$ cm square stands for a $4$ m by $4$ m square, so $1\\text{ cm}^2$ stands for $16\\text{ m}^2$. A park drawn with an area of $35\\text{ cm}^2$ is really $35 \\cdot 16 = 560\\text{ m}^2$. Going back, divide by $16$.",
            "比例尺为 $1\\text{ cm} : 4\\text{ m}$ 时，图上 $1$ cm × $1$ cm 的正方形代表 $4$ m × $4$ m 的正方形，所以 $1\\text{ cm}^2$ 代表 $16\\text{ m}^2$。图上面积为 $35\\text{ cm}^2$ 的公园，实际面积是 $35 \\cdot 16 = 560\\text{ m}^2$。反过来就除以 $16$。",
          ],
          ["Go back: $560 \\div 16 = 35$, the drawn area.", "反过来算：$560 \\div 16 = 35$，正是图上面积。"],
          [
            "One square centimeter stands for $4 \\cdot 4$ square meters, not $4$.",
            "$1$ 平方厘米代表 $4 \\cdot 4$ 平方米，而不是 $4$ 平方米。",
          ],
        ],
        (rng) => {
          const k = rng.pick([2, 3, 4, 5, 6, 8, 10, 20]);
          const drawnArea = rng.int(6, 60);
          const actual = drawnArea * k * k;
          const place = rng.pick([t("park", "公园"), t("lake", "湖"), t("farm field", "农田"), t("campus", "校园")]);
          const toActual = rng.bool();
          const square: Walk = [
            ["One square centimeter", "图上 1 平方厘米"],
            [`A square centimeter on the plan is a square $${k}$ m on each side:`, `图上 $1$ 平方厘米代表边长 $${k}$ m 的正方形：`],
            [`1\\text{ cm}^2 \\to ${k} \\cdot ${k} = ${lenTex(k * k, "m", 2)}`],
          ];
          if (toActual) {
            return valued(
              [
                `On a plan with the scale $1\\text{ cm} : ${lenTex(k, "m")}$, a ${place.en} has an area of $${lenTex(drawnArea, "cm", 2)}$. What is its actual area?`,
                `在比例尺为 $1\\text{ cm} : ${lenTex(k, "m")}$ 的规划图上，一个${place["zh-CN"]}的面积是 $${lenTex(drawnArea, "cm", 2)}$。它的实际面积是多少？`,
              ],
              actual,
              [
                square,
                [
                  ["Multiply", "相乘"],
                  ["Every square centimeter stands for that much:", "每平方厘米都代表这么多："],
                  [`${drawnArea} \\cdot ${k * k} = ${lenTex(actual, "m", 2)}`],
                ],
              ],
              [
                `Go back: $${actual} \\div ${k * k} = ${drawnArea}$, the drawn area.`,
                `反过来算：$${actual} \\div ${k * k} = ${drawnArea}$，正是图上面积。`,
              ],
              [
                [
                  drawnArea * k,
                  `That multiplies by $${k}$ once, but a square centimeter stands for $${k} \\cdot ${k}$ square meters.`,
                  `这是只乘了一次 $${k}$，但 $1$ 平方厘米代表 $${k} \\cdot ${k}$ 平方米。`,
                ],
                [drawnArea * 2 * k, `That doubles $${k}$ instead of squaring it.`, `这是把 $${k}$ 乘 $2$，应该平方。`],
                [drawnArea, "That is the area on the plan, not the real one.", "这是图上的面积，不是实际面积。"],
              ],
              { unit: "m^2", form: "integer" },
            );
          }
          return valued(
            [
              `A ${place.en} has an area of $${lenTex(actual, "m", 2)}$. What is its area on a plan with the scale $1\\text{ cm} : ${lenTex(k, "m")}$?`,
              `一个${place["zh-CN"]}的面积是 $${lenTex(actual, "m", 2)}$。在比例尺为 $1\\text{ cm} : ${lenTex(k, "m")}$ 的规划图上，它的面积是多少？`,
            ],
            drawnArea,
            [
              square,
              [
                ["Divide", "相除"],
                ["Count how many of those squares fit:", "看能放下多少个这样的正方形："],
                [`${actual} \\div ${k * k} = ${lenTex(drawnArea, "cm", 2)}`],
              ],
            ],
            [
              `Go back: $${drawnArea} \\cdot ${k * k} = ${actual}$, the real area.`,
              `反过来算：$${drawnArea} \\cdot ${k * k} = ${actual}$，正是实际面积。`,
            ],
            [
              [
                Q.of(actual, k),
                `That divides by $${k}$ once, but a square centimeter stands for $${k} \\cdot ${k}$ square meters.`,
                `这是只除以了一次 $${k}$，但 $1$ 平方厘米代表 $${k} \\cdot ${k}$ 平方米。`,
              ],
              [
                Q.of(actual, 2 * k),
                `That divides by $2 \\cdot ${k}$ instead of $${k}^2$.`,
                `这是除以 $2 \\cdot ${k}$，应该除以 $${k}^2$。`,
              ],
              [actual * k * k, "That multiplies instead of dividing.", "这是乘了，应该除。"],
            ],
            { unit: "cm^2", form: "integer" },
          );
        },
        fig(
          twoRectangles(1, 1, 4, ["1 cm", "1 cm"], ["4 m", "4 m"]),
          "A 1 cm square on the plan and the 4 m by 4 m square it stands for.",
          "图上 1 cm 的正方形和它代表的 4 m × 4 m 的正方形。",
        ),
      ),
    ],
  ),
  [
    "You draw your bedroom at $1\\text{ cm} : 2\\text{ m}$, as a $2$ cm by $2$ cm square. The real room is $4$ m by $4$ m. Is its area $2$ times, or more, than the $4\\text{ cm}^2$ on paper?",
    "你按 $1\\text{ cm} : 2\\text{ m}$ 画自己的卧室，画成 $2$ cm × $2$ cm 的正方形。实际房间是 $4$ m × $4$ m。它的面积只是纸上 $4\\text{ cm}^2$ 的 $2$ 倍，还是更多？",
  ],
  [
    "The real room is $4 \\cdot 4 = 16\\text{ m}^2$, which is $4$ times the $4$ on paper: $2$ times as long and $2$ times as wide.",
    "实际房间是 $4 \\cdot 4 = 16\\text{ m}^2$，是纸上 $4$ 的 $4$ 倍：长是 $2$ 倍，宽也是 $2$ 倍。",
  ],
  [
    "find real perimeters and areas from scale drawings, and see why an area changes by the square of the scale factor.",
    "学习由比例图求实际的周长和面积，并理解面积为什么要乘比例系数的平方。",
  ],
);

// ---------------------------------------------------------------------------
// Circles

/** sectorsFigure shows a circle cut into 12 equal sectors, the upper half shaded, and the same sectors laid side by side, pointing up and down in turn, as a near-parallelogram with base πr and height r. */
const sectorsFigure: Figure = (() => {
  const r = 2;
  const n = 12;
  const half = 180 / n;
  const at = (c: Point, d: number): Point => [c[0] + r * Math.cos((d * Math.PI) / 180), c[1] + r * Math.sin((d * Math.PI) / 180)];
  // sector is the wedge with apex c, opening around direction d degrees.
  const sector = (c: Point, d: number): Point[] => [c, ...Array.from({ length: 7 }, (_, i) => at(c, d - half + (i * 2 * half) / 6))];
  const marks: Mark[] = [];
  for (let k = 0; k < n; k++) {
    const pts = sector([0, 0], (k + 0.5) * 2 * half);
    if (k < n / 2) marks.push({ kind: "shade", points: pts });
    marks.push({ kind: "polygon", points: pts });
  }
  const w = (Math.PI * r) / (n / 2);
  const x0 = 3.2;
  for (let j = 0; j < n / 2; j++) {
    const up = sector([x0 + w / 2 + j * w, 0], 90);
    const down = sector([x0 + w + j * w, r], 270);
    marks.push({ kind: "shade", points: up }, { kind: "polygon", points: up }, { kind: "polygon", points: down });
  }
  marks.push(
    { kind: "segment", a: [x0 + w / 2, 0], b: [x0 + w / 2, r], dashed: true },
    { kind: "label", at: [x0 + w / 2, r / 2], text: "r", dir: "w", italic: true },
    { kind: "label", at: [x0 + w / 2 + 3 * w, -0.1], text: "½C = πr", dir: "s" },
  );
  return {
    svg: sketch(marks),
    alt: t(
      "A circle cut into 12 equal sectors, the upper 6 shaded. Beside it the same sectors are laid in a row, the shaded ones pointing up and the others pointing down between them, forming a shape close to a parallelogram whose base is half the circumference, πr, and whose height is the radius r.",
      "一个圆被分成 12 个相等的扇形，上面 6 个涂上阴影。旁边把这些扇形排成一行，涂阴影的朝上，其余的朝下插在它们之间，拼成接近平行四边形的图形：底是周长的一半 πr，高是半径 r。",
    ),
  };
})();

/** piValued asks for an exact answer in terms of π with a unit, works it in labelled steps with a check, and answers each wrong response with its reason. */
function piValued(
  prompt: Pair,
  answer: string,
  walk: readonly Walk[],
  check: Pair,
  saids: readonly Said[],
  unit: string,
  figure: Figure,
): Problem {
  const base = expressed([`${prompt[0]}${PI_EN}`, `${prompt[1]}${PI_ZH}`], answer, walk, check, saids, { simplified: true, figure });
  return { ...base, answer: { ...base.answer, input: { kind: "math", suffix: unitLatex(unit) } } };
}

/** relatingTheCircumferenceAndAreaOfACircle goes between the circumference and the area through the radius. */
export const relatingTheCircumferenceAndAreaOfACircle = withIntro(
  topic(
    "relating-the-circumference-and-area-of-a-circle",
    t("Relating the Circumference and Area of a Circle", "圆的周长与面积的关系"),
    t(
      "The circumference and the area of a circle both depend on its radius, so one gives the other: find the radius, then use the other formula. Cutting a circle into thin sectors and laying them side by side gives a near-parallelogram with base half the circumference and height the radius, so A = ½ · C · r.",
      "圆的周长和面积都由半径决定，所以知道一个就能求另一个：先求半径，再用另一个公式。把圆剪成许多细小的扇形并排拼起来，近似得到底为周长的一半、高为半径的平行四边形，所以 A = ½ · C · r。",
    ),
    ["areas-of-circles"],
    ["7.G.B.4"],
    [
      lesson(
        "area-from-circumference",
        ["Area from the circumference", "由周长求面积"],
        [
          [
            "The radius links the circumference and the area. From the circumference, find the radius with $r = C \\div 2\\pi$, then use $A = \\pi r^2$. A circle with circumference $31.4$ cm, using $3.14$ for $\\pi$, has $r = 31.4 \\div 6.28 = 5$ cm and $A = 3.14 \\cdot 25 = 78.5\\text{ cm}^2$.",
            "半径把周长和面积联系起来。由周长用 $r = C \\div 2\\pi$ 求出半径，再用 $A = \\pi r^2$。周长 $31.4$ cm 的圆，取 $\\pi$ 为 $3.14$，$r = 31.4 \\div 6.28 = 5$ cm，$A = 3.14 \\cdot 25 = 78.5\\text{ cm}^2$。",
          ],
          [
            "Use $A = \\tfrac{1}{2} \\cdot C \\cdot r$ instead: $\\tfrac{1}{2} \\cdot 31.4 \\cdot 5 = 78.5$.",
            "也可以用 $A = \\tfrac{1}{2} \\cdot C \\cdot r$：$\\tfrac{1}{2} \\cdot 31.4 \\cdot 5 = 78.5$。",
          ],
          [
            "Square the radius, not the diameter: divide the circumference by $2\\pi$, not by $\\pi$.",
            "要平方的是半径，不是直径：周长要除以 $2\\pi$，不是除以 $\\pi$。",
          ],
        ],
        (rng) => {
          const r = rng.int(2, 15);
          const u = pickUnit(rng);
          const c = piQ.mul(Q.of(2 * r));
          const a = piQ.mul(Q.of(r * r));
          return valued(
            [
              `A circle has a circumference of $${lenTex(c, u)}$. Use $3.14$ for $\\pi$ to find its area.`,
              `一个圆的周长是 $${lenTex(c, u)}$。取 $\\pi$ 为 $3.14$，求它的面积。`,
            ],
            a,
            [
              [
                ["Find the radius", "求半径"],
                ["From $C = 2\\pi r$, divide by $2 \\cdot 3.14$:", "由 $C = 2\\pi r$，除以 $2 \\cdot 3.14$："],
                [`r = ${num(c)} \\div 6.28 = ${lenTex(r, u)}`],
              ],
              [
                ["Find the area", "求面积"],
                ["Use $A = \\pi r^2$:", "用 $A = \\pi r^2$："],
                [`A = 3.14 \\cdot ${r}^2 = 3.14 \\cdot ${r * r} = ${lenTex(a, u, 2)}`],
              ],
            ],
            [
              `Use $A = \\tfrac{1}{2} \\cdot C \\cdot r$ instead: $\\tfrac{1}{2} \\cdot ${num(c)} \\cdot ${r} = ${num(a)}$.`,
              `也可以用 $A = \\tfrac{1}{2} \\cdot C \\cdot r$：$\\tfrac{1}{2} \\cdot ${num(c)} \\cdot ${r} = ${num(a)}$。`,
            ],
            [
              [piQ.mul(Q.of(4 * r * r)), "That squares the diameter instead of the radius.", "这是把直径平方了，应该平方半径。"],
              [
                c.mul(Q.of(r)),
                "That multiplies the circumference by the radius but forgets the $\\tfrac{1}{2}$.",
                "这是用周长乘半径，但忘了 $\\tfrac{1}{2}$。",
              ],
              [r * r, "That squares the radius but leaves out $\\pi$.", "这是平方了半径，但漏掉了 $\\pi$。"],
            ],
            { unit: `${u}^2` },
          );
        },
        drawn(gradeDrawings4["relating-the-circumference-and-area-of-a-circle#area-from-circumference"]),
      ),
      lesson(
        "circumference-from-area",
        ["Circumference from the area", "由面积求周长"],
        [
          [
            "Go the other way through the radius. A circle has area $113.04\\text{ cm}^2$. Using $3.14$ for $\\pi$, $r^2 = 113.04 \\div 3.14 = 36$, so $r = 6$ cm, the number whose square is $36$. Then $C = 2 \\cdot 3.14 \\cdot 6 = 37.68$ cm.",
            "反过来也经过半径。一个圆的面积是 $113.04\\text{ cm}^2$。取 $\\pi$ 为 $3.14$，$r^2 = 113.04 \\div 3.14 = 36$，所以 $r = 6$ cm，即平方等于 $36$ 的数。于是 $C = 2 \\cdot 3.14 \\cdot 6 = 37.68$ cm。",
          ],
          [
            "From $A = \\tfrac{1}{2} \\cdot C \\cdot r$: $C = 2A \\div r = 226.08 \\div 6 = 37.68$.",
            "由 $A = \\tfrac{1}{2} \\cdot C \\cdot r$：$C = 2A \\div r = 226.08 \\div 6 = 37.68$。",
          ],
          [
            "$r^2 = 36$ means $r = 6$, not $36 \\div 2 = 18$: undo a square with a square root.",
            "$r^2 = 36$ 表示 $r = 6$，而不是 $36 \\div 2 = 18$：平方要用开平方来还原。",
          ],
        ],
        (rng) => {
          const r = rng.int(2, 15);
          const u = pickUnit(rng);
          const a = piQ.mul(Q.of(r * r));
          const c = piQ.mul(Q.of(2 * r));
          return valued(
            [
              `A circle has an area of $${lenTex(a, u, 2)}$. Use $3.14$ for $\\pi$ to find its circumference.`,
              `一个圆的面积是 $${lenTex(a, u, 2)}$。取 $\\pi$ 为 $3.14$，求它的周长。`,
            ],
            c,
            [
              [
                ["Find the radius", "求半径"],
                [
                  "From $A = \\pi r^2$, divide by $3.14$, then find the number whose square that is:",
                  "由 $A = \\pi r^2$，先除以 $3.14$，再找平方等于它的数：",
                ],
                [`r^2 = ${num(a)} \\div 3.14 = ${r * r}`, `r = ${lenTex(r, u)}`],
              ],
              [
                ["Find the circumference", "求周长"],
                ["Use $C = 2\\pi r$:", "用 $C = 2\\pi r$："],
                [`C = 2 \\cdot 3.14 \\cdot ${r} = ${lenTex(c, u)}`],
              ],
            ],
            [
              `From $A = \\tfrac{1}{2} \\cdot C \\cdot r$: $C = 2A \\div r = ${num(a.mul(Q.of(2)))} \\div ${r} = ${num(c)}$.`,
              `由 $A = \\tfrac{1}{2} \\cdot C \\cdot r$：$C = 2A \\div r = ${num(a.mul(Q.of(2)))} \\div ${r} = ${num(c)}$。`,
            ],
            [
              [piQ.mul(Q.of(r)), "That forgets the $2$ in $C = 2\\pi r$.", "这是忘了 $C = 2\\pi r$ 中的 $2$。"],
              [piQ.mul(Q.of(r * r)), "That uses $r^2$ as the radius instead of its square root.", "这是把 $r^2$ 当成了半径，没有开平方。"],
              [
                piQ.mul(Q.of(4 * r)),
                "That uses the diameter in place of the radius in $2\\pi r$.",
                "这是在 $2\\pi r$ 中用直径代替了半径。",
              ],
            ],
            { unit: u },
          );
        },
        drawn(gradeDrawings4["relating-the-circumference-and-area-of-a-circle#circumference-from-area"]),
      ),
      lesson(
        "half-the-circumference-times-the-radius",
        ["Half the circumference times the radius", "周长的一半乘半径"],
        [
          [
            "Cut a circle into many thin, equal sectors and lay them side by side, pointing up and down in turn. The result is close to a parallelogram: its base is half the circumference, $\\pi r$, and its height is the radius $r$. So $A = \\tfrac{1}{2} \\cdot C \\cdot r = \\pi r^2$. A round tabletop with circumference $220$ cm and radius $35$ cm has area about $110 \\cdot 35 = 3850\\text{ cm}^2$.",
            "把圆剪成许多相等的细小扇形，一个朝上、一个朝下地并排拼起来，得到的图形接近平行四边形：底是周长的一半 $\\pi r$，高是半径 $r$。所以 $A = \\tfrac{1}{2} \\cdot C \\cdot r = \\pi r^2$。周长 $220$ cm、半径 $35$ cm 的圆桌面，面积约为 $110 \\cdot 35 = 3850\\text{ cm}^2$。",
          ],
          [
            "Multiply first, then halve: $220 \\cdot 35 = 7700$ and $7700 \\div 2 = 3850$.",
            "先乘再取一半：$220 \\cdot 35 = 7700$，$7700 \\div 2 = 3850$。",
          ],
          [
            "Only half the circumference is the base: the other half lines the top of the parallelogram.",
            "底只是周长的一半：另一半在平行四边形的上边。",
          ],
        ],
        (rng) => {
          if (rng.bool()) {
            // Measured circles: the radius to the nearest tenth and the circumference to the nearest whole unit.
            const tenths = rng.int(25, 400);
            const r = Q.of(tenths, 10);
            const c = Math.round((2 * Math.PI * tenths) / 10);
            const half = Q.of(c, 2);
            const a = half.mul(r);
            const whole = r.mul(Q.of(c));
            const thing = rng.pick([
              [t("round tabletop", "圆桌面"), "cm"],
              [t("circular rug", "圆形地毯"), "cm"],
              [t("round flower bed", "圆形花坛"), "m"],
            ] as const);
            return valued(
              [
                `A ${thing[0].en} has a measured circumference of $${lenTex(c, thing[1])}$ and a radius of $${lenTex(r, thing[1])}$. Use $A = \\tfrac{1}{2} \\cdot C \\cdot r$ to estimate its area.`,
                `测得一个${thing[0]["zh-CN"]}的周长是 $${lenTex(c, thing[1])}$，半径是 $${lenTex(r, thing[1])}$。用 $A = \\tfrac{1}{2} \\cdot C \\cdot r$ 估计它的面积。`,
              ],
              a,
              [
                [
                  ["Halve the circumference", "周长取一半"],
                  ["Half the circumference is the base of the parallelogram:", "周长的一半是平行四边形的底："],
                  [`${c} \\div 2 = ${num(half)}`],
                ],
                [
                  ["Multiply by the radius", "乘半径"],
                  ["The radius is its height:", "半径是它的高："],
                  [`A \\approx ${num(half)} \\cdot ${num(r)} = ${lenTex(a, thing[1], 2)}`],
                ],
              ],
              [
                `Multiply first, then halve: $${c} \\cdot ${num(r)} = ${num(whole)}$ and $${num(whole)} \\div 2 = ${num(a)}$.`,
                `先乘再取一半：$${c} \\cdot ${num(r)} = ${num(whole)}$，$${num(whole)} \\div 2 = ${num(a)}$。`,
              ],
              [
                [
                  whole,
                  "That multiplies the whole circumference by the radius; only half of it is the base.",
                  "这是用整个周长乘半径；底只是周长的一半。",
                ],
                [
                  half.add(r),
                  "That adds half the circumference and the radius instead of multiplying.",
                  "这是把周长的一半和半径相加了，应该相乘。",
                ],
                [a.div(Q.of(2)), "That halves twice.", "这是取了两次一半。"],
              ],
              { unit: `${thing[1]}^2` },
            );
          }
          const r = rng.int(2, 30);
          const ratio = Q.of(r, 2);
          return valued(
            [
              `A circle has a radius of $${r}$ cm. Its area in square centimeters is how many times its circumference in centimeters?`,
              `一个圆的半径是 $${r}$ cm。它以平方厘米为单位的面积是以厘米为单位的周长的多少倍？`,
            ],
            ratio,
            [
              [
                ["Write both", "写出两者"],
                ["The area and the circumference are", "面积和周长分别是"],
                [`A = \\pi \\cdot ${r}^2 = ${r * r}\\pi`, `C = 2\\pi \\cdot ${r} = ${2 * r}\\pi`],
              ],
              [
                ["Divide", "相除"],
                ["The $\\pi$ cancels:", "$\\pi$ 约掉了："],
                [`\\frac{A}{C} = \\frac{${r * r}\\pi}{${2 * r}\\pi} = ${num(ratio)}`],
              ],
            ],
            [
              `Use $A = \\tfrac{1}{2} \\cdot C \\cdot r$: the area is the circumference times $\\frac{r}{2} = \\frac{${r}}{2} = ${num(ratio)}$.`,
              `用 $A = \\tfrac{1}{2} \\cdot C \\cdot r$：面积是周长乘 $\\frac{r}{2} = \\frac{${r}}{2} = ${num(ratio)}$。`,
            ],
            [
              [r, "That forgets the $2$ in $C = 2\\pi r$.", "这是忘了 $C = 2\\pi r$ 中的 $2$。"],
              [2 * r, "That multiplies by $2$ instead of dividing.", "这是乘了 $2$，应该除以 $2$。"],
              [Q.of(2, r), "That divides the circumference by the area, upside down.", "这是用周长除以面积，除反了。"],
            ],
          );
        },
        sectorsFigure,
      ),
    ],
  ),
  [
    "A pizza menu says the large pizza has a circumference of $94.2$ cm. Is that enough to tell how much pizza you get?",
    "菜单上写着大号比萨的周长是 $94.2$ cm。凭这个能知道比萨有多大吗？",
  ],
  [
    "Yes: $94.2 \\div 6.28 = 15$ cm is the radius, so the area is $3.14 \\cdot 15^2 = 706.5\\text{ cm}^2$.",
    "能：$94.2 \\div 6.28 = 15$ cm 是半径，所以面积是 $3.14 \\cdot 15^2 = 706.5\\text{ cm}^2$。",
  ],
  [
    "go from the circumference of a circle to its area and back through the radius, and see why the area is half the circumference times the radius.",
    "学习经过半径在圆的周长和面积之间互相换算，并理解为什么面积等于周长的一半乘半径。",
  ],
);

/** roundedRectangle is a rectangle l by w with a semicircle on its right side, bulging out or cut in. */
function roundedRectangle(l: number, w: number, out: boolean): Point[] {
  const r = w / 2;
  const curve = out ? arcPoints(-90, 90, r, [l, r]) : arcPoints(90, 270, r, [l, r]).reverse();
  return [[0, 0], ...curve, [0, w]];
}

/** roundedFigure draws a rectangle with a semicircle added on or cut out of its right side. */
function roundedFigure(l: number, w: number, out: boolean, u: Unit): Figure {
  const pts = roundedRectangle(l, w, out);
  return fig(
    [
      { kind: "polygon", points: pts },
      { kind: "segment", a: [l, 0], b: [l, w], dashed: true },
      { kind: "side", a: [0, 0], b: [l, 0], text: `${l} ${u}` },
      { kind: "side", a: [0, w], b: [0, 0], text: `${w} ${u}` },
    ],
    `A rectangle ${l} ${u} by ${w} ${u} with a semicircle of diameter ${w} ${u} ${out ? "added to" : "cut out of"} its right side.`,
    `${l} ${u} × ${w} ${u} 的长方形，右边${out ? "加上" : "挖去"}一个直径为 ${w} ${u} 的半圆。`,
  );
}

/** compositeShapesWithCircles finds areas and perimeters of shapes made of rectangles and parts of circles. */
export const compositeShapesWithCircles = withIntro(
  topic(
    "composite-shapes-with-circles",
    t("Composite Shapes With Circles", "含圆的组合图形"),
    t(
      "Split a composite shape into rectangles, circles and parts of circles. Add or subtract their areas, and for the perimeter go around the outside only: a curved edge contributes part of a circumference, and an edge where two pieces meet does not count.",
      "把组合图形分成长方形、圆和圆的一部分。面积是各部分面积相加或相减；周长只沿外边走一圈：曲线边贡献圆周长的一部分，两部分相接的边不计入。",
    ),
    ["areas-of-circles", "composite-shapes"],
    ["7.G.B.4", "7.G.B.6"],
    [
      lesson(
        "areas-with-semicircles",
        ["Areas with semicircles", "含半圆的面积"],
        [
          [
            "Find each piece and add or subtract. A $10$ cm by $6$ cm rectangle with a semicircle on a $6$ cm side: the semicircle has radius $3$ cm and area $\\tfrac{1}{2}\\pi \\cdot 3^2 = \\tfrac{9}{2}\\pi$. Added on, the area is $60 + \\tfrac{9}{2}\\pi\\text{ cm}^2$; cut out, it is $60 - \\tfrac{9}{2}\\pi\\text{ cm}^2$.",
            "分别求出每一块，再相加或相减。$10$ cm × $6$ cm 的长方形在一条 $6$ cm 的边上有一个半圆：半圆半径为 $3$ cm，面积为 $\\tfrac{1}{2}\\pi \\cdot 3^2 = \\tfrac{9}{2}\\pi$。加上半圆时面积是 $60 + \\tfrac{9}{2}\\pi\\text{ cm}^2$；挖去时是 $60 - \\tfrac{9}{2}\\pi\\text{ cm}^2$。",
          ],
          [
            "The semicircle fits in a $6$ by $3$ box of area $18$, and $\\tfrac{9}{2}\\pi \\approx 14.1$ is a bit less, as it should be.",
            "半圆能放进一个 $6$ × $3$、面积为 $18$ 的框里，而 $\\tfrac{9}{2}\\pi \\approx 14.1$ 比它小一点，这是对的。",
          ],
          [
            "The semicircle sits on a side of length $6$, its diameter: halve it to get the radius before squaring.",
            "半圆所在的那条 $6$ 的边是它的直径：要先取一半得到半径，再平方。",
          ],
        ],
        (rng) => {
          const r = rng.int(2, 7);
          const w = 2 * r;
          const l = rng.int(w, 20);
          const out = rng.bool();
          const u = pickUnit(rng);
          const half = Q.of(r * r, 2);
          const sign = out ? half : half.neg();
          const estimate = piQ.mul(half);
          return piValued(
            ["Find the area of the shape.", "求这个图形的面积。"],
            piSum(l * w, sign),
            [
              [["Find the rectangle", "求长方形"], ["Length times width:", "长乘宽："], [`${l} \\cdot ${w} = ${l * w}`]],
              [
                ["Find the semicircle", "求半圆"],
                [`Its diameter is $${w}$, so its radius is $${r}$:`, `它的直径是 $${w}$，所以半径是 $${r}$：`],
                [`\\tfrac{1}{2}\\pi \\cdot ${r}^2 = ${piTex(half)}`],
              ],
              [
                [out ? "Add" : "Subtract", out ? "相加" : "相减"],
                [out ? "The semicircle is added on:" : "The semicircle is cut out:", out ? "半圆是加上去的：" : "半圆是挖掉的："],
                [`A = ${piSum(l * w, sign)}\\text{ ${u}}^2`],
              ],
            ],
            [
              `The semicircle fits in a $${w}$ by $${r}$ box of area $${w * r}$, and $${piTex(half)} \\approx ${num(estimate)}$ is a bit less, as it should be.`,
              `半圆能放进一个 $${w}$ × $${r}$、面积为 $${w * r}$ 的框里，而 $${piTex(half)} \\approx ${num(estimate)}$ 比它小一点，这是对的。`,
            ],
            [
              [piSum(l * w, out ? r * r : -r * r), "That uses a whole circle, not half of one.", "这是用了整个圆，不是半个圆。"],
              [piSum(l * w, out ? Q.of(w * w, 2) : Q.of(-w * w, 2)), "That uses the diameter as the radius.", "这是把直径当成了半径。"],
              [`${l * w}`, "That leaves out the semicircle.", "这是漏掉了半圆。"],
              [
                piSum(l * w, sign.neg()),
                out ? "That subtracts the semicircle, but it is added on." : "That adds the semicircle, but it is cut out.",
                out ? "这是减去了半圆，但半圆是加上去的。" : "这是加上了半圆，但半圆是挖掉的。",
              ],
            ],
            `${u}^2`,
            roundedFigure(l, w, out, u),
          );
        },
        drawn(gradeDrawings3["composite-shapes-with-circles#areas-with-semicircles"]),
      ),
      lesson(
        "perimeters-with-semicircles",
        ["Perimeters with semicircles", "含半圆的周长"],
        [
          [
            "Go around the outside. For a $10$ cm by $6$ cm rectangle with a semicircle on a $6$ cm side, the straight edges are $10$, $6$ and $10$, and the curve is half of a circle of diameter $6$: $\\tfrac{1}{2}\\pi \\cdot 6 = 3\\pi$. The perimeter is $26 + 3\\pi$ cm, whether the semicircle is added on or cut out.",
            "沿外边走一圈。$10$ cm × $6$ cm 的长方形在一条 $6$ cm 的边上有半圆，直边是 $10$、$6$、$10$，曲线是直径为 $6$ 的圆的一半：$\\tfrac{1}{2}\\pi \\cdot 6 = 3\\pi$。无论半圆是加上还是挖去，周长都是 $26 + 3\\pi$ cm。",
          ],
          [
            "Start from the rectangle, $2(10 + 6) = 32$, and swap the side $6$ under the curve for the curve $3\\pi$: $32 - 6 + 3\\pi = 26 + 3\\pi$.",
            "从长方形出发，$2(10 + 6) = 32$，把曲线下的那条边 $6$ 换成曲线 $3\\pi$：$32 - 6 + 3\\pi = 26 + 3\\pi$。",
          ],
          ["The side under the semicircle is no longer on the outside, so it does not count.", "半圆处的那条边已不在外边上，所以不计入。"],
        ],
        (rng) => {
          const r = rng.int(2, 8);
          const w = 2 * r;
          const l = rng.int(w, 20);
          const out = rng.bool();
          const u = pickUnit(rng);
          const straight = 2 * l + w;
          return piValued(
            ["Find the perimeter of the shape.", "求这个图形的周长。"],
            piSum(straight, r),
            [
              [
                ["Add the straight edges", "直边相加"],
                ["The side under the semicircle is not on the outside:", "半圆处的那条边不在外边上："],
                [`${l} + ${w} + ${l} = ${straight}`],
              ],
              [
                ["Find the curve", "求曲线"],
                [`Half a circle of diameter $${w}$:`, `直径为 $${w}$ 的圆的一半：`],
                [`\\tfrac{1}{2}\\pi \\cdot ${w} = ${piTex(r)}`],
              ],
              [["Add", "相加"], ["Go all the way around:", "绕一整圈："], [`P = ${piSum(straight, r)}\\text{ ${u}}`]],
            ],
            [
              `Start from the rectangle, $2(${l} + ${w}) = ${2 * (l + w)}$, and swap the side $${w}$ under the curve for the curve: $${2 * (l + w)} - ${w} + ${piTex(r)} = ${piSum(straight, r)}$.`,
              `从长方形出发，$2(${l} + ${w}) = ${2 * (l + w)}$，把曲线下的那条边 $${w}$ 换成曲线：$${2 * (l + w)} - ${w} + ${piTex(r)} = ${piSum(straight, r)}$。`,
            ],
            [
              [
                piSum(straight + w, r),
                "That also counts the side under the semicircle, which is not on the outside.",
                "这是把半圆处的那条边也算上了，但它不在外边上。",
              ],
              [piSum(straight, 2 * r), "That uses the whole circumference, not half of it.", "这是用了整个圆周长，不是一半。"],
              [piSum(straight, w), "That uses the diameter as the radius.", "这是把直径当成了半径。"],
              [
                piSum(straight, Q.of(r * r, 2)),
                "That uses the area of the semicircle instead of its curve.",
                "这是用了半圆的面积，而不是曲线的长度。",
              ],
            ],
            u,
            roundedFigure(l, w, out, u),
          );
        },
        drawn(gradeDrawings3["composite-shapes-with-circles#perimeters-with-semicircles"]),
      ),
      lesson(
        "regions-around-circles",
        ["Regions around circles", "圆周围的区域"],
        [
          [
            "A circular pond of radius $3$ m sits in a square lawn $10$ m on each side. The grass covers the square minus the circle. Using $3.14$ for $\\pi$: $10^2 - 3.14 \\cdot 3^2 = 100 - 28.26 = 71.74\\text{ m}^2$.",
            "一个半径为 $3$ m 的圆形池塘位于边长 $10$ m 的正方形草坪中。草地面积是正方形减去圆。取 $\\pi$ 为 $3.14$：$10^2 - 3.14 \\cdot 3^2 = 100 - 28.26 = 71.74\\text{ m}^2$。",
          ],
          ["Add the pond back: $71.74 + 28.26 = 100$, the whole square.", "把池塘加回去：$71.74 + 28.26 = 100$，正好是整个正方形。"],
          [
            "Subtract the area of the circle, $\\pi r^2$, not its circumference $2\\pi r$.",
            "要减去圆的面积 $\\pi r^2$，而不是周长 $2\\pi r$。",
          ],
        ],
        (rng) => {
          const s = rng.int(6, 30);
          const r = rng.int(1, Math.floor(s / 2));
          const [outer, inner, unit] = rng.pick([
            [t("square lawn", "正方形草坪"), t("circular pond", "圆形池塘"), "m"],
            [t("square tablecloth", "正方形桌布"), t("round plate", "圆盘"), "cm"],
            [t("square tile", "正方形瓷砖"), t("circular hole", "圆孔"), "cm"],
          ] as const);
          const circle = piQ.mul(Q.of(r * r));
          const left = Q.of(s * s).sub(circle);
          const offs: [Q, string, string][] = [
            [
              Q.of(s * s).sub(piQ.mul(Q.of(2 * r))),
              "That subtracts the circumference instead of the area.",
              "这是减去了周长，应该减去面积。",
            ],
            [
              Q.of(s * s).sub(piQ.mul(Q.of(4 * r * r))),
              "That squares the diameter instead of the radius.",
              "这是把直径平方了，应该平方半径。",
            ],
            [circle, "That is the area of the circle, not the part around it.", "这是圆的面积，不是圆外的部分。"],
            [Q.of(s * s), "That forgets to take the circle away.", "这是忘了减去圆。"],
          ];
          return valued(
            [
              `A ${inner.en} with a radius of $${lenTex(r, unit)}$ sits inside a ${outer.en} $${lenTex(s, unit)}$ on each side. Use $3.14$ for $\\pi$ to find the area of the ${outer.en} outside the ${inner.en}.`,
              `一个半径为 $${lenTex(r, unit)}$ 的${inner["zh-CN"]}位于边长 $${lenTex(s, unit)}$ 的${outer["zh-CN"]}内。取 $\\pi$ 为 $3.14$，求${outer["zh-CN"]}在${inner["zh-CN"]}之外部分的面积。`,
            ],
            left,
            [
              [
                ["Find both areas", "求两个面积"],
                ["The square and the circle:", "正方形和圆："],
                [`${s}^2 = ${s * s}`, `3.14 \\cdot ${r}^2 = ${num(circle)}`],
              ],
              [
                ["Subtract", "相减"],
                ["Take the circle away from the square:", "用正方形减去圆："],
                [`${s * s} - ${num(circle)} = ${lenTex(left, unit, 2)}`],
              ],
            ],
            [
              `Add the circle back: $${num(left)} + ${num(circle)} = ${s * s}$, the whole square.`,
              `把圆加回去：$${num(left)} + ${num(circle)} = ${s * s}$，正好是整个正方形。`,
            ],
            offs.filter(([v]) => v.sign() > 0),
            {
              form: "decimal",
              unit: `${unit}^2`,
              figure: fig(
                [
                  { kind: "polygon", points: rectangle(s, s) },
                  { kind: "polygon", points: arcPoints(0, 360, r, [s / 2, s / 2]) },
                  { kind: "segment", a: [s / 2, s / 2], b: [s / 2 + r, s / 2], dashed: true },
                  { kind: "dot", at: [s / 2, s / 2] },
                  { kind: "label", at: [s / 2 + r / 2, s / 2], text: `${r} ${unit}`, dir: "n" },
                  { kind: "side", a: [0, 0], b: [s, 0], text: `${s} ${unit}` },
                ],
                `A circle of radius ${r} ${unit} inside a square ${s} ${unit} on each side.`,
                `边长 ${s} ${unit} 的正方形内有一个半径为 ${r} ${unit} 的圆。`,
              ),
            },
          );
        },
        drawn(gradeDrawings3["composite-shapes-with-circles#regions-around-circles"]),
      ),
    ],
  ),
  [
    "A running track is a rectangle with a semicircle at each end. The two ends together make one whole circle.",
    "跑道是一个长方形，两端各有一个半圆。两端的半圆合起来正好是一个整圆。",
  ],
  [
    "With a $100$ m straight part and ends of radius $30$ m, the area inside is $100 \\cdot 60 + \\pi \\cdot 30^2$.",
    "直道长 $100$ m、两端半径 $30$ m 时，跑道围起来的面积是 $100 \\cdot 60 + \\pi \\cdot 30^2$。",
  ],
  ["find the areas and perimeters of shapes made of rectangles and parts of circles.", "学习求由长方形和部分圆组成的图形的面积和周长。"],
);

/** PartCircle is a semicircle, a quarter circle or three quarters of a circle. */
interface PartCircle {
  readonly part: Q;
  readonly name: Text;
  /** sweep is the angle of the arc in degrees. */
  readonly sweep: number;
}

const semicircle: PartCircle = { part: Q.of(1, 2), name: t("semicircle", "半圆"), sweep: 180 };
const quarterCircle: PartCircle = { part: Q.of(1, 4), name: t("quarter circle", "四分之一圆"), sweep: 90 };
const threeQuarterCircle: PartCircle = { part: Q.of(3, 4), name: t("three-quarter circle", "四分之三圆"), sweep: 270 };

/** partFigure draws a part of a circle of radius r with its straight edges, labeling a radius, or the diameter of a semicircle. */
function partFigure(p: PartCircle, r: number, text: string, diameter = false): Figure {
  const O: Point = [0, 0];
  const curve = arcPoints(0, p.sweep, r);
  const edges: Mark[] =
    p.sweep === 180
      ? [{ kind: "segment", a: [-r, 0], b: [r, 0] }]
      : [
          { kind: "segment", a: O, b: [r, 0] },
          { kind: "segment", a: O, b: curve[curve.length - 1]! },
        ];
  return fig(
    [
      ...curve.slice(1).map((q, i): Mark => ({ kind: "segment", a: curve[i]!, b: q })),
      ...edges,
      { kind: "dot", at: O },
      diameter ? { kind: "side", a: [-r, 0], b: [r, 0], text } : { kind: "side", a: O, b: [r, 0], text },
    ],
    `A ${p.name.en} with ${diameter ? "diameter" : "radius"} ${text}.`,
    `${diameter ? "直径" : "半径"}为 ${text} 的${p.name["zh-CN"]}。`,
  );
}

/** findingAreasAndPerimetersOfPartCircles finds the areas and perimeters of semicircles, quarter circles and three-quarter circles. */
export const findingAreasAndPerimetersOfPartCircles = withIntro(
  topic(
    "finding-areas-and-perimeters-of-part-circles",
    t("Finding Areas and Perimeters of Part-Circles", "求部分圆的面积和周长"),
    t(
      "A semicircle is half a circle and a quarter circle a quarter of one, so their areas are those fractions of πr². Their perimeters are that fraction of the circumference plus the straight edges: a diameter for a semicircle, and two radii for a quarter circle.",
      "半圆是圆的一半，四分之一圆是圆的四分之一，所以它们的面积是 πr² 的相应部分。它们的周长是圆周长的相应部分再加上直边：半圆加一条直径，四分之一圆加两条半径。",
    ),
    ["areas-of-circles"],
    ["7.G.B.4"],
    [
      lesson(
        "areas-of-part-circles",
        ["Areas of part-circles", "部分圆的面积"],
        [
          [
            "A part-circle has that part of the whole circle's area. A quarter circle of radius $6$ cm has area $\\tfrac{1}{4}\\pi \\cdot 6^2 = 9\\pi\\text{ cm}^2$. A semicircle of diameter $10$ cm has radius $5$ cm, so its area is $\\tfrac{1}{2}\\pi \\cdot 5^2 = \\tfrac{25}{2}\\pi\\text{ cm}^2$.",
            "部分圆的面积是整圆面积的相应部分。半径为 $6$ cm 的四分之一圆面积是 $\\tfrac{1}{4}\\pi \\cdot 6^2 = 9\\pi\\text{ cm}^2$。直径为 $10$ cm 的半圆半径是 $5$ cm，面积是 $\\tfrac{1}{2}\\pi \\cdot 5^2 = \\tfrac{25}{2}\\pi\\text{ cm}^2$。",
          ],
          [
            "Four quarter circles make the whole circle: $4 \\cdot 9\\pi = 36\\pi = \\pi \\cdot 6^2$.",
            "四个四分之一圆拼成整圆：$4 \\cdot 9\\pi = 36\\pi = \\pi \\cdot 6^2$。",
          ],
          ["Halve a diameter before squaring.", "先把直径减半，再平方。"],
        ],
        (rng) => {
          const p = rng.pick([semicircle, quarterCircle]);
          const r = rng.int(2, 14);
          const u = pickUnit(rng);
          const byDiameter = p === semicircle && rng.bool();
          const area = p.part.mul(Q.of(r * r));
          const pieces = p === semicircle ? 2 : 4;
          const name: Pair = [p.name.en, p.name["zh-CN"]];
          const given: Pair = byDiameter
            ? [`a diameter of $${lenTex(2 * r, u)}$`, `直径为 $${lenTex(2 * r, u)}$`]
            : [`a radius of $${lenTex(r, u)}$`, `半径为 $${lenTex(r, u)}$`];
          const saids: Said[] = [
            [piTex(r * r), "That is the area of the whole circle.", "这是整个圆的面积。"],
            [piTex(p.part.mul(Q.of(4 * r * r))), "That squares the diameter instead of the radius.", "这是把直径平方了，应该平方半径。"],
            [
              piTex(p.part.mul(Q.of(2 * r))),
              "That takes part of the circumference, not of the area.",
              "这是取了周长的一部分，不是面积的。",
            ],
          ];
          if (p === quarterCircle)
            saids.push([
              piTex(Q.of(r * r, 2)),
              "That takes half of the circle, but a quarter circle is a quarter.",
              "这是取了圆的一半，但四分之一圆是四分之一。",
            ]);
          return piValued(
            [`Find the area of a ${name[0]} with ${given[0]}.`, `求${given[1]}的${name[1]}的面积。`],
            piTex(area),
            [
              byDiameter
                ? [
                    ["Find the radius", "求半径"],
                    ["The radius is half the diameter:", "半径是直径的一半："],
                    [`r = ${2 * r} \\div 2 = ${r}`],
                  ]
                : [
                    ["Find the whole circle", "求整圆"],
                    ["The whole circle would have area", "整个圆的面积是"],
                    [`\\pi \\cdot ${r}^2 = ${piTex(r * r)}`],
                  ],
              [
                ["Take the part", "取相应部分"],
                [`A ${name[0]} is $${p.part.toLatex()}$ of the circle:`, `${name[1]}是整圆的 $${p.part.toLatex()}$：`],
                [`${p.part.toLatex()} \\cdot \\pi \\cdot ${r}^2 = ${piTex(area)}\\text{ ${u}}^2`],
              ],
            ],
            [
              `${pieces} such pieces make the whole circle: $${pieces} \\cdot ${piTex(area)} = ${piTex(r * r)} = \\pi \\cdot ${r}^2$.`,
              `${pieces} 个这样的部分拼成整圆：$${pieces} \\cdot ${piTex(area)} = ${piTex(r * r)} = \\pi \\cdot ${r}^2$。`,
            ],
            saids,
            `${u}^2`,
            byDiameter ? partFigure(p, 5, `${2 * r} ${u}`, true) : partFigure(p, 5, `${r} ${u}`),
          );
        },
        drawn(gradeDrawings3["finding-areas-and-perimeters-of-part-circles#areas-of-part-circles"]),
      ),
      lesson(
        "perimeters-of-part-circles",
        ["Perimeters of part-circles", "部分圆的周长"],
        [
          [
            "The perimeter of a part-circle is its arc plus its straight edges. A semicircle of radius $5$ has arc $\\tfrac{1}{2} \\cdot 2\\pi \\cdot 5 = 5\\pi$ and a diameter $10$, so its perimeter is $10 + 5\\pi$. A quarter circle of radius $8$ has arc $\\tfrac{1}{4} \\cdot 2\\pi \\cdot 8 = 4\\pi$ and two radii, so its perimeter is $16 + 4\\pi$.",
            "部分圆的周长是弧长加直边。半径为 $5$ 的半圆，弧长是 $\\tfrac{1}{2} \\cdot 2\\pi \\cdot 5 = 5\\pi$，直径是 $10$，所以周长是 $10 + 5\\pi$。半径为 $8$ 的四分之一圆，弧长是 $\\tfrac{1}{4} \\cdot 2\\pi \\cdot 8 = 4\\pi$，加上两条半径，周长是 $16 + 4\\pi$。",
          ],
          [
            "Use $C = \\pi d$ for the arc instead: $\\tfrac{1}{4} \\cdot \\pi \\cdot 16 = 4\\pi$.",
            "也可以用 $C = \\pi d$ 求弧长：$\\tfrac{1}{4} \\cdot \\pi \\cdot 16 = 4\\pi$。",
          ],
          ["Do not stop at the arc: the straight edges are part of the perimeter too.", "不要只算弧长：直边也是周长的一部分。"],
        ],
        (rng) => {
          const p = rng.pick([semicircle, quarterCircle]);
          const r = rng.int(2, 15);
          const u = pickUnit(rng);
          const arc = p.part.mul(Q.of(2 * r));
          const name: Pair = [p.name.en, p.name["zh-CN"]];
          const semi = p === semicircle;
          return piValued(
            [`Find the perimeter of the ${name[0]}.`, `求这个${name[1]}的周长。`],
            piSum(2 * r, arc),
            [
              [
                ["Find the arc", "求弧长"],
                [`The arc is $${p.part.toLatex()}$ of the circumference:`, `弧长是圆周长的 $${p.part.toLatex()}$：`],
                [`${p.part.toLatex()} \\cdot 2\\pi \\cdot ${r} = ${piTex(arc)}`],
              ],
              [
                ["Add the straight edges", "加上直边"],
                semi
                  ? [`The straight edge is a diameter, $${2 * r}$:`, `直边是一条直径 $${2 * r}$：`]
                  : [`The straight edges are two radii, $${r} + ${r} = ${2 * r}$:`, `直边是两条半径 $${r} + ${r} = ${2 * r}$：`],
                [`P = ${piSum(2 * r, arc)}\\text{ ${u}}`],
              ],
            ],
            [
              `Use $C = \\pi d$ for the arc instead: $${p.part.toLatex()} \\cdot \\pi \\cdot ${2 * r} = ${piTex(arc)}$, then add $${2 * r}$.`,
              `也可以用 $C = \\pi d$ 求弧长：$${p.part.toLatex()} \\cdot \\pi \\cdot ${2 * r} = ${piTex(arc)}$，再加 $${2 * r}$。`,
            ],
            [
              [piTex(arc), "That is only the arc; the straight edges count too.", "这只是弧长；直边也要算。"],
              [
                piSum(r, arc),
                semi ? "That adds a radius, but the straight edge is a whole diameter." : "That adds only one radius, but there are two.",
                semi ? "这是加了一条半径，但直边是一整条直径。" : "这只加了一条半径，但有两条。",
              ],
              [piTex(p.part.mul(Q.of(r * r))), "That uses the area formula, not the circumference.", "这是用了面积公式，不是周长公式。"],
              [
                piSum(2 * r, p.part.mul(Q.of(4 * r))),
                "That uses the diameter in place of the radius in $2\\pi r$.",
                "这是在 $2\\pi r$ 中用直径代替了半径。",
              ],
            ],
            u,
            partFigure(p, 5, `${r} ${u}`),
          );
        },
        drawn(gradeDrawings3["finding-areas-and-perimeters-of-part-circles#perimeters-of-part-circles"]),
      ),
      lesson(
        "part-circles-with-approximations",
        ["Part-circles with 3.14", "用 3.14 计算部分圆"],
        [
          [
            "With $3.14$ for $\\pi$, a three-quarter circle of radius $4$ cm has area $\\tfrac{3}{4} \\cdot 3.14 \\cdot 4^2 = 37.68\\text{ cm}^2$ and perimeter $\\tfrac{3}{4} \\cdot 2 \\cdot 3.14 \\cdot 4 + 4 + 4 = 26.84$ cm.",
            "取 $\\pi$ 为 $3.14$，半径为 $4$ cm 的四分之三圆，面积是 $\\tfrac{3}{4} \\cdot 3.14 \\cdot 4^2 = 37.68\\text{ cm}^2$，周长是 $\\tfrac{3}{4} \\cdot 2 \\cdot 3.14 \\cdot 4 + 4 + 4 = 26.84$ cm。",
          ],
          [
            "Find the whole circle first, $3.14 \\cdot 16 = 50.24$, and take three quarters: $50.24 \\div 4 \\cdot 3 = 37.68$.",
            "先求整圆 $3.14 \\cdot 16 = 50.24$，再取四分之三：$50.24 \\div 4 \\cdot 3 = 37.68$。",
          ],
          [
            "The two radii are part of the perimeter: they are the straight edges of the cut.",
            "两条半径也是周长的一部分：它们是切口处的直边。",
          ],
        ],
        (rng) => {
          const p = rng.pick([semicircle, quarterCircle, threeQuarterCircle]);
          const r = rng.int(2, 12) * (p === threeQuarterCircle ? 1 : 2);
          const u = pickUnit(rng);
          const askArea = rng.bool();
          const whole = piQ.mul(Q.of(r * r));
          const area = p.part.mul(whole);
          const circumference = piQ.mul(Q.of(2 * r));
          const arc = p.part.mul(circumference);
          const perimeter = arc.add(Q.of(2 * r));
          const parts = Number(p.part.d);
          const name: Pair = [p.name.en, p.name["zh-CN"]];
          const prompt: Pair = [
            `Use $3.14$ for $\\pi$ to find the ${askArea ? "area" : "perimeter"} of the ${name[0]}.`,
            `取 $\\pi$ 为 $3.14$，求这个${name[1]}的${askArea ? "面积" : "周长"}。`,
          ];
          const figure = partFigure(p, 5, `${r} ${u}`);
          if (askArea) {
            return valued(
              prompt,
              area,
              [
                [["Square the radius", "半径平方"], ["First the radius squared:", "先求半径的平方："], [`${r}^2 = ${r * r}`]],
                [
                  ["Take the part", "取相应部分"],
                  [
                    `The area is $${p.part.toLatex()}$ of $3.14 \\cdot ${r * r}$:`,
                    `面积是 $3.14 \\cdot ${r * r}$ 的 $${p.part.toLatex()}$：`,
                  ],
                  [`${p.part.toLatex()} \\cdot 3.14 \\cdot ${r * r} = ${lenTex(area, u, 2)}`],
                ],
              ],
              [
                `Find the whole circle first, $3.14 \\cdot ${r * r} = ${num(whole)}$, and take the part: $${num(whole)} \\div ${parts} \\cdot ${Number(p.part.n)} = ${num(area)}$.`,
                `先求整圆 $3.14 \\cdot ${r * r} = ${num(whole)}$，再取相应部分：$${num(whole)} \\div ${parts} \\cdot ${Number(p.part.n)} = ${num(area)}$。`,
              ],
              [
                [whole, "That is the area of the whole circle.", "这是整个圆的面积。"],
                [arc, "That takes part of the circumference, not of the area.", "这是取了周长的一部分，不是面积的。"],
                [
                  p.part.mul(piQ).mul(Q.of(4 * r * r)),
                  "That squares the diameter instead of the radius.",
                  "这是把直径平方了，应该平方半径。",
                ],
              ],
              { unit: `${u}^2`, figure },
            );
          }
          return valued(
            prompt,
            perimeter,
            [
              [
                ["Find the arc", "求弧长"],
                [`The arc is $${p.part.toLatex()}$ of the circumference:`, `弧长是圆周长的 $${p.part.toLatex()}$：`],
                [`${p.part.toLatex()} \\cdot 2 \\cdot 3.14 \\cdot ${r} = ${num(arc)}`],
              ],
              [
                ["Add the straight edges", "加上直边"],
                [
                  p === semicircle ? "The straight edge is a diameter:" : "The straight edges are two radii:",
                  p === semicircle ? "直边是一条直径：" : "直边是两条半径：",
                ],
                [`${num(arc)} + ${2 * r} = ${lenTex(perimeter, u)}`],
              ],
            ],
            [
              `Use $C = \\pi d$: the whole circle is $3.14 \\cdot ${2 * r} = ${num(circumference)}$, the part is $${num(circumference)} \\div ${parts} \\cdot ${Number(p.part.n)} = ${num(arc)}$, and $${num(arc)} + ${2 * r} = ${num(perimeter)}$.`,
              `用 $C = \\pi d$：整圆周长是 $3.14 \\cdot ${2 * r} = ${num(circumference)}$，相应部分是 $${num(circumference)} \\div ${parts} \\cdot ${Number(p.part.n)} = ${num(arc)}$，再加 $${2 * r}$ 得 $${num(perimeter)}$。`,
            ],
            [
              [arc, "That is only the arc; the straight edges count too.", "这只是弧长；直边也要算。"],
              [
                arc.add(Q.of(r)),
                p === semicircle
                  ? "That adds a radius, but the straight edge is a whole diameter."
                  : "That adds only one radius, but there are two.",
                p === semicircle ? "这是加了一条半径，但直边是一整条直径。" : "这只加了一条半径，但有两条。",
              ],
              [area, "That is the area, not the perimeter.", "这是面积，不是周长。"],
            ],
            { unit: u, figure },
          );
        },
        drawn(gradeDrawings3["finding-areas-and-perimeters-of-part-circles#part-circles-with-approximations"]),
      ),
    ],
  ),
  [
    "Cut a round cake into four equal pieces. Each piece is a quarter circle: its top is a quarter of the cake, and its edge is a curve plus two straight cuts.",
    "把一个圆蛋糕平均切成四块。每一块都是四分之一圆：它的上面是蛋糕的四分之一，边是一段弧加两条直的切口。",
  ],
  [
    "A cake of radius $10$ cm has top $100\\pi$, so each piece has $\\tfrac{1}{4} \\cdot 100\\pi = 25\\pi\\text{ cm}^2$.",
    "半径 $10$ cm 的蛋糕上面面积是 $100\\pi$，所以每块是 $\\tfrac{1}{4} \\cdot 100\\pi = 25\\pi\\text{ cm}^2$。",
  ],
  [
    "find the areas and perimeters of semicircles, quarter circles and three-quarter circles.",
    "学习求半圆、四分之一圆和四分之三圆的面积和周长。",
  ],
);

// ---------------------------------------------------------------------------
// Prisms and cross-sections

/** P3 projects a point of space onto the page in oblique projection, depth going up and to the right. */
const P3 = (x: number, y: number, z: number): Point => [x + 0.45 * z, y + 0.3 * z];

/** prismFigure draws a prism on the triangle (0, 0), (b, 0), (a, h) with depth d, hidden edges dashed. */
function prismFigure(b: number, a: number, h: number, d: number, labels: readonly Mark[], showHeight: string | null): Mark[] {
  const [A, B, C] = [P3(0, 0, 0), P3(b, 0, 0), P3(a, h, 0)];
  const [A2, B2, C2] = [P3(0, 0, d), P3(b, 0, d), P3(a, h, d)];
  // The left face is hidden unless it is flat enough to face the viewer: its outward normal is (-h, a, 0).
  const leftHidden = 0.3 * a <= 0.45 * h;
  const marks: Mark[] = [
    { kind: "polygon", points: [A, B, C] },
    { kind: "segment", a: B, b: B2 },
    { kind: "segment", a: C, b: C2 },
    { kind: "segment", a: B2, b: C2 },
    { kind: "segment", a: A, b: A2, dashed: leftHidden },
    { kind: "segment", a: A2, b: B2, dashed: true },
    { kind: "segment", a: A2, b: C2, dashed: leftHidden },
    ...labels,
  ];
  if (showHeight !== null && a > 0) {
    const foot = P3(a, 0, 0);
    marks.push(
      { kind: "segment", a: C, b: foot, dashed: true, accent: true },
      { kind: "right", vertex: foot, from: C, to: B },
      { kind: "side", a: foot, b: C, text: showHeight },
    );
  }
  return marks;
}

/** Triple is a Pythagorean triple: legs and hypotenuse. */
type Triple = readonly [number, number, number];

const triples: readonly Triple[] = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [8, 6, 10],
  [9, 12, 15],
  [12, 5, 13],
  [8, 15, 17],
  [4, 3, 5],
];

/** volumesOfTriangularPrisms multiplies the area of the triangular base by the length of the prism. */
export const volumesOfTriangularPrisms = withIntro(
  topic(
    "volumes-of-triangular-prisms",
    t("Volumes of Triangular Prisms", "三棱柱的体积"),
    t(
      "The volume of any prism is the area of its base times its length: V = B · l. For a triangular prism the base is a triangle, so V = ½ · b · h · l, where b and h are the base and height of the triangle.",
      "任何棱柱的体积都等于底面积乘长度：V = B · l。三棱柱的底面是三角形，所以 V = ½ · b · h · l，其中 b、h 是三角形的底和高。",
    ),
    ["volumes-of-rectangular-solids", "areas-of-triangles"],
    ["7.G.B.6"],
    [
      lesson(
        "volume-of-a-triangular-prism",
        ["Volume of a triangular prism", "三棱柱的体积"],
        [
          [
            "Find the area of the triangle, then multiply by the length of the prism. A prism whose triangle has base $6$ cm and height $4$ cm, and which is $10$ cm long, has $B = \\tfrac{1}{2} \\cdot 6 \\cdot 4 = 12$ and $V = 12 \\cdot 10 = 120\\text{ cm}^3$.",
            "先求三角形的面积，再乘棱柱的长。三角形底 $6$ cm、高 $4$ cm、长 $10$ cm 的三棱柱，$B = \\tfrac{1}{2} \\cdot 6 \\cdot 4 = 12$，$V = 12 \\cdot 10 = 120\\text{ cm}^3$。",
          ],
          [
            "Two such prisms make a $6$ by $4$ by $10$ box: $6 \\cdot 4 \\cdot 10 = 240$, and half of it is $120$.",
            "两个这样的三棱柱拼成 $6$ × $4$ × $10$ 的长方体：$6 \\cdot 4 \\cdot 10 = 240$，一半是 $120$。",
          ],
          ["Use the height of the triangle, at a right angle to its base, not a slanted side.", "要用三角形的高（与底垂直），不要用斜边。"],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const right = rng.bool();
          const [b, h, c] = right ? rng.pick(triples) : [rng.int(4, 14), rng.int(3, 12), 0];
          const l = rng.int(3, 20);
          const v = Q.of(b * h * l, 2);
          const base = Q.of(b * h, 2);
          const a = right ? 0 : b * rng.pick([0.35, 0.5, 0.65]);
          const labels: Mark[] = [
            { kind: "side", a: P3(0, 0, 0), b: P3(b, 0, 0), text: `${b} ${u}` },
            { kind: "side", a: P3(b, 0, 0), b: P3(b, 0, l), text: `${l} ${u}` },
            ...(right
              ? [
                  { kind: "side", a: P3(0, h, 0), b: P3(0, 0, 0), text: `${h} ${u}` } as Mark,
                  { kind: "side", a: P3(0, h, 0), b: P3(b, 0, 0), text: `${c} ${u}` } as Mark,
                  { kind: "right", vertex: P3(0, 0, 0), from: P3(b, 0, 0), to: P3(0, h, 0) } as Mark,
                ]
              : []),
          ];
          return valued(
            ["Find the volume of the triangular prism.", "求这个三棱柱的体积。"],
            v,
            [
              [
                ["Find the base area", "求底面积"],
                [`The base is the triangle, with base $${b}$ and height $${h}$:`, `底面是三角形，底为 $${b}$，高为 $${h}$：`],
                [`B = \\tfrac{1}{2} \\cdot ${b} \\cdot ${h} = ${num(base)}`],
              ],
              [
                ["Multiply by the length", "乘长度"],
                ["The volume is base area times length:", "体积等于底面积乘长度："],
                [`V = ${num(base)} \\cdot ${l} = ${lenTex(v, u, 3)}`],
              ],
            ],
            [
              `Two such prisms make a $${b}$ by $${h}$ by $${l}$ box: $${b} \\cdot ${h} \\cdot ${l} = ${b * h * l}$, and half of it is $${num(v)}$.`,
              `两个这样的三棱柱拼成 $${b}$ × $${h}$ × $${l}$ 的长方体：$${b} \\cdot ${h} \\cdot ${l} = ${b * h * l}$，一半是 $${num(v)}$。`,
            ],
            [
              [
                b * h * l,
                "That forgets the $\\tfrac{1}{2}$: it is the box made of two prisms.",
                "这是忘了 $\\tfrac{1}{2}$：这是两个三棱柱拼成的长方体。",
              ],
              [Q.of(b * h * l, 6), "That divides by $6$, but a prism is not a pyramid.", "这是除以 $6$，但棱柱不是棱锥。"],
              ...(right ? [[Q.of(b * c * l, 2), "That uses the slanted side as the height.", "这是把斜边当成了高。"] as const] : []),
              [base, "That is the area of the triangle; multiply by the length too.", "这是三角形的面积；还要乘长度。"],
            ],
            {
              unit: `${u}^3`,
              figure: fig(
                prismFigure(b, a, h, l, labels, right ? null : `${h} ${u}`),
                `A triangular prism ${l} ${u} long. Its triangular face has base ${b} ${u} and height ${h} ${u}${right ? `, with a right angle and a slanted side of ${c} ${u}` : ""}.`,
                `长 ${l} ${u} 的三棱柱。三角形面的底为 ${b} ${u}，高为 ${h} ${u}${right ? `，有一个直角，斜边为 ${c} ${u}` : ""}。`,
              ),
            },
          );
        },
        drawn(gradeDrawings3["volumes-of-triangular-prisms#volume-of-a-triangular-prism"]),
      ),
      lesson(
        "missing-dimensions-from-volume",
        ["Missing dimensions from the volume", "由体积求未知尺寸"],
        [
          [
            "Undo $V = B \\cdot l$. A triangular prism of volume $180\\text{ cm}^3$ whose triangle has base $8$ cm and height $5$ cm has $B = 20$, so its length is $180 \\div 20 = 9$ cm. If the length and the triangle's base are known instead, divide the volume by the length to get $B$, then solve $\\tfrac{1}{2} \\cdot b \\cdot h = B$.",
            "把 $V = B \\cdot l$ 倒过来用。体积 $180\\text{ cm}^3$、三角形底 $8$ cm、高 $5$ cm 的三棱柱，$B = 20$，所以长是 $180 \\div 20 = 9$ cm。若已知长和三角形的底，先用体积除以长得到 $B$，再解 $\\tfrac{1}{2} \\cdot b \\cdot h = B$。",
          ],
          ["Put it back: $\\tfrac{1}{2} \\cdot 8 \\cdot 5 \\cdot 9 = 180$.", "代回去：$\\tfrac{1}{2} \\cdot 8 \\cdot 5 \\cdot 9 = 180$。"],
          [
            "Remember the $\\tfrac{1}{2}$ of the triangle: $180 \\div 40$ would give only half the length.",
            "别忘了三角形的 $\\tfrac{1}{2}$：$180 \\div 40$ 只得到长度的一半。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          let b: number;
          let h: number;
          do {
            b = rng.int(3, 14);
            h = rng.int(3, 12);
          } while ((b * h) % 2 !== 0);
          const l = rng.int(3, 20);
          const area = (b * h) / 2;
          const v = area * l;
          const askLength = rng.bool();
          const back: Pair = [
            `Put it back: $\\tfrac{1}{2} \\cdot ${b} \\cdot ${h} \\cdot ${l} = ${v}$.`,
            `代回去：$\\tfrac{1}{2} \\cdot ${b} \\cdot ${h} \\cdot ${l} = ${v}$。`,
          ];
          const figure = fig(
            prismFigure(
              b,
              b * 0.5,
              h,
              l,
              [
                { kind: "side", a: P3(0, 0, 0), b: P3(b, 0, 0), text: `${b} ${u}` },
                { kind: "side", a: P3(b, 0, 0), b: P3(b, 0, l), text: askLength ? "?" : `${l} ${u}` },
              ],
              askLength ? `${h} ${u}` : "?",
            ),
            `A triangular prism. Its triangular face has base ${b} ${u} and height ${askLength ? `${h} ${u}` : "unknown"}; its length is ${askLength ? "unknown" : `${l} ${u}`}.`,
            `一个三棱柱。三角形面的底为 ${b} ${u}，高${askLength ? `为 ${h} ${u}` : "未知"}；长度${askLength ? "未知" : `为 ${l} ${u}`}。`,
          );
          if (askLength) {
            return valued(
              [
                `A triangular prism has a volume of $${lenTex(v, u, 3)}$. Its triangular face has a base of $${lenTex(b, u)}$ and a height of $${lenTex(h, u)}$. How long is the prism?`,
                `一个三棱柱的体积是 $${lenTex(v, u, 3)}$，三角形面的底为 $${lenTex(b, u)}$，高为 $${lenTex(h, u)}$。这个棱柱有多长？`,
              ],
              l,
              [
                [
                  ["Find the base area", "求底面积"],
                  ["The triangle's area:", "三角形的面积："],
                  [`B = \\tfrac{1}{2} \\cdot ${b} \\cdot ${h} = ${area}`],
                ],
                [
                  ["Divide", "相除"],
                  ["Since $V = B \\cdot l$, divide the volume by the base area:", "因为 $V = B \\cdot l$，用体积除以底面积："],
                  [`l = ${v} \\div ${area} = ${lenTex(l, u)}`],
                ],
              ],
              back,
              [
                [Q.of(v, b * h), "That forgets the $\\tfrac{1}{2}$ of the triangle's area.", "这是忘了三角形面积的 $\\tfrac{1}{2}$。"],
                [v - area, "That subtracts the base area instead of dividing by it.", "这是减去底面积，应该除以底面积。"],
                [Q.of(v, b), "That divides by the base of the triangle only.", "这是只除以三角形的底。"],
              ],
              { unit: u, form: "integer", figure },
            );
          }
          return valued(
            [
              `A triangular prism has a volume of $${lenTex(v, u, 3)}$ and a length of $${lenTex(l, u)}$. Its triangular face has a base of $${lenTex(b, u)}$. What is the height of the triangle?`,
              `一个三棱柱的体积是 $${lenTex(v, u, 3)}$，长 $${lenTex(l, u)}$，三角形面的底为 $${lenTex(b, u)}$。三角形的高是多少？`,
            ],
            h,
            [
              [
                ["Find the base area", "求底面积"],
                ["Divide the volume by the length:", "用体积除以长："],
                [`B = ${v} \\div ${l} = ${area}`],
              ],
              [
                ["Solve for the height", "求高"],
                ["Double the area and divide by the base:", "面积乘 $2$ 再除以底："],
                [`\\tfrac{1}{2} \\cdot ${b} \\cdot h = ${area}`, `h = ${2 * area} \\div ${b} = ${lenTex(h, u)}`],
              ],
            ],
            back,
            [
              [Q.of(v, b * l), "That forgets the $\\tfrac{1}{2}$ of the triangle's area.", "这是忘了三角形面积的 $\\tfrac{1}{2}$。"],
              [Q.of(2 * v, l), "That doubles the base area but does not divide by the base.", "这是把底面积乘 $2$ 了，但没有除以底。"],
              [area, "That is the area of the triangle, not its height.", "这是三角形的面积，不是高。"],
            ],
            { unit: u, form: "integer", figure },
          );
        },
        drawn(gradeDrawings4["volumes-of-triangular-prisms#missing-dimensions-from-volume"]),
      ),
    ],
  ),
  [
    "A wedge of cheese is a triangle pushed straight back. Each slice you cut parallel to the front is the same triangle.",
    "一块楔形奶酪就是一个三角形笔直地往后推出来的。平行于正面切下的每一片都是同样的三角形。",
  ],
  [
    "Stack up enough triangle slices: the volume is the triangle's area times how far back it goes.",
    "把足够多的三角形片叠起来：体积就是三角形的面积乘往后的长度。",
  ],
  [
    "find the volume of a triangular prism as its base area times its length, and find a missing length from the volume.",
    "学习用底面积乘长度求三棱柱的体积，并由体积求未知的长度。",
  ],
);

/** surfaceAreasOfTriangularPrisms adds the two triangles and the three rectangles of a triangular prism. */
export const surfaceAreasOfTriangularPrisms = withIntro(
  topic(
    "surface-areas-of-triangular-prisms",
    t("Surface Areas of Triangular Prisms", "三棱柱的表面积"),
    t(
      "A triangular prism has five faces: two congruent triangles and three rectangles. The rectangles are as long as the prism and as wide as the three sides of the triangle, so together they make a rectangle whose width is the perimeter of the triangle.",
      "三棱柱有五个面：两个全等的三角形和三个长方形。三个长方形的长都等于棱柱的长，宽分别等于三角形的三条边，所以合起来是一个宽为三角形周长的长方形。",
    ),
    ["surface-areas-of-rectangular-solids"],
    ["7.G.B.6"],
    [
      lesson(
        "surface-area-of-a-right-triangular-prism",
        ["Surface area of a right triangular prism", "直角三棱柱的表面积"],
        [
          [
            "Add the five faces: two triangles and three rectangles. For a prism $10$ cm long on a right triangle with legs $3$ and $4$ cm and slanted side $5$ cm, the triangles give $2 \\cdot \\tfrac{1}{2} \\cdot 3 \\cdot 4 = 12$ and the rectangles $(3 + 4 + 5) \\cdot 10 = 120$, so the surface area is $132\\text{ cm}^2$.",
            "把五个面加起来：两个三角形和三个长方形。长 $10$ cm、底面是直角边 $3$ cm 和 $4$ cm、斜边 $5$ cm 的直角三棱柱，两个三角形是 $2 \\cdot \\tfrac{1}{2} \\cdot 3 \\cdot 4 = 12$，三个长方形是 $(3 + 4 + 5) \\cdot 10 = 120$，表面积是 $132\\text{ cm}^2$。",
          ],
          [
            "Add the rectangles one at a time: $30 + 40 + 50 = 120$, and $120 + 12 = 132$.",
            "一个一个地加长方形：$30 + 40 + 50 = 120$，再加 $12$ 得 $132$。",
          ],
          [
            "There are two triangles, one at each end, and each is half of a rectangle.",
            "三角形有两个，两端各一个，每个都是长方形的一半。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const [b, h, c] = rng.pick(triples);
          const l = rng.int(3, 20);
          const triangles = b * h;
          const lateral = (b + h + c) * l;
          return valued(
            ["Find the surface area of the triangular prism.", "求这个三棱柱的表面积。"],
            triangles + lateral,
            [
              [
                ["Add the triangles", "两个三角形"],
                ["The two ends:", "两个端面："],
                [`2 \\cdot \\tfrac{1}{2} \\cdot ${b} \\cdot ${h} = ${triangles}`],
              ],
              [
                ["Add the rectangles", "三个长方形"],
                ["The three rectangles make one strip as wide as the triangle's perimeter:", "三个长方形合成一条宽为三角形周长的长条："],
                [`(${b} + ${h} + ${c}) \\cdot ${l} = ${lateral}`],
              ],
              [
                ["Add", "相加"],
                ["All five faces:", "五个面合起来："],
                [`${triangles} + ${lateral} = ${lenTex(triangles + lateral, u, 2)}`],
              ],
            ],
            [
              `Add the rectangles one at a time: $${b * l} + ${h * l} + ${c * l} = ${lateral}$, and $${lateral} + ${triangles} = ${triangles + lateral}$.`,
              `一个一个地加长方形：$${b * l} + ${h * l} + ${c * l} = ${lateral}$，再加 $${triangles}$ 得 $${triangles + lateral}$。`,
            ],
            [
              [
                triangles / 2 + lateral,
                "That counts only one triangle, but there is one at each end.",
                "这只算了一个三角形，但两端各有一个。",
              ],
              [
                2 * triangles + lateral,
                `That forgets that each triangle is half of $${b} \\cdot ${h}$.`,
                `这是忘了每个三角形是 $${b} \\cdot ${h}$ 的一半。`,
              ],
              [lateral, "That leaves out the two triangles.", "这是漏掉了两个三角形。"],
              [Q.of(b * h * l, 2), "That is the volume, not the surface area.", "这是体积，不是表面积。"],
            ],
            {
              unit: `${u}^2`,
              form: "integer",
              figure: fig(
                prismFigure(
                  b,
                  0,
                  h,
                  l,
                  [
                    { kind: "side", a: P3(0, 0, 0), b: P3(b, 0, 0), text: `${b} ${u}` },
                    { kind: "side", a: P3(b, 0, 0), b: P3(b, 0, l), text: `${l} ${u}` },
                    { kind: "side", a: P3(0, h, 0), b: P3(0, 0, 0), text: `${h} ${u}` },
                    { kind: "side", a: P3(0, h, 0), b: P3(b, 0, 0), text: `${c} ${u}` },
                    { kind: "right", vertex: P3(0, 0, 0), from: P3(b, 0, 0), to: P3(0, h, 0) },
                  ],
                  null,
                ),
                `A prism ${l} ${u} long on a right triangle with legs ${b} ${u} and ${h} ${u} and slanted side ${c} ${u}.`,
                `长 ${l} ${u} 的三棱柱，底面是直角边为 ${b} ${u}、${h} ${u}，斜边为 ${c} ${u} 的直角三角形。`,
              ),
            },
          );
        },
        drawn(gradeDrawings3["surface-areas-of-triangular-prisms#surface-area-of-a-right-triangular-prism"]),
      ),
      lesson(
        "tents-and-roofs",
        ["Tents and roofs", "帐篷与屋顶"],
        [
          [
            "A tent is a prism on an isosceles triangle. With base $6$ ft, height $4$ ft, slanted sides $5$ ft and length $8$ ft, the two ends and two slanted sides need $2 \\cdot \\tfrac{1}{2} \\cdot 6 \\cdot 4 + 2 \\cdot 5 \\cdot 8 = 24 + 80 = 104\\text{ ft}^2$ of fabric. A floor adds $6 \\cdot 8 = 48\\text{ ft}^2$.",
            "帐篷是底面为等腰三角形的棱柱。底 $6$ ft、高 $4$ ft、两腰 $5$ ft、长 $8$ ft 时，两端和两个斜面需要 $2 \\cdot \\tfrac{1}{2} \\cdot 6 \\cdot 4 + 2 \\cdot 5 \\cdot 8 = 24 + 80 = 104\\text{ ft}^2$ 布料。加上底面还要 $6 \\cdot 8 = 48\\text{ ft}^2$。",
          ],
          [
            "The two ends together are one $6$ by $4$ rectangle, $24$, and the two slanted sides are one $10$ by $8$ rectangle, $80$.",
            "两个端面合起来是一个 $6$ × $4$ 的长方形，$24$；两个斜面合起来是一个 $10$ × $8$ 的长方形，$80$。",
          ],
          ["The roof rectangles are as wide as the slanted sides, not as the height.", "斜面长方形的宽是腰长，不是高。"],
        ],
        (rng) => {
          // Half the base, the height and the slanted side of the triangular end.
          const [p, q, s] = rng.pick([
            [3, 4, 5],
            [4, 3, 5],
            [6, 8, 10],
            [8, 6, 10],
            [5, 12, 13],
          ] as const);
          const u = p > 4 ? "ft" : rng.pick(["ft", "m"] as const);
          const l = rng.int(4, 16);
          const floor = rng.bool();
          const ends = 2 * p * q;
          const roof = 2 * s * l;
          const bottom = 2 * p * l;
          const total = ends + roof + (floor ? bottom : 0);
          return valued(
            [
              `A tent is shaped like a triangular prism $${lenTex(l, u)}$ long. Each end is a triangle with a base of $${lenTex(2 * p, u)}$, a height of $${lenTex(q, u)}$ and slanted sides of $${lenTex(s, u)}$. How much fabric covers the tent ${floor ? "including" : "not including"} the floor?`,
              `一顶帐篷是长 $${lenTex(l, u)}$ 的三棱柱形。每一端是底为 $${lenTex(2 * p, u)}$、高为 $${lenTex(q, u)}$、两腰为 $${lenTex(s, u)}$ 的三角形。${floor ? "包括" : "不包括"}底面在内，这顶帐篷需要多少布料？`,
            ],
            total,
            [
              [
                ["The ends", "两个端面"],
                ["Two triangles:", "两个三角形："],
                [`2 \\cdot \\tfrac{1}{2} \\cdot ${2 * p} \\cdot ${q} = ${ends}`],
              ],
              [
                ["The sides", "侧面"],
                floor
                  ? ["Two slanted rectangles and the floor:", "两个斜面和底面："]
                  : ["Two slanted rectangles; the floor is left out:", "两个斜面；不算底面："],
                [`2 \\cdot ${s} \\cdot ${l} = ${roof}`, ...(floor ? [`${2 * p} \\cdot ${l} = ${bottom}`] : [])],
              ],
              [
                ["Add", "相加"],
                ["All the fabric:", "全部布料："],
                [`${floor ? `${ends} + ${roof} + ${bottom}` : `${ends} + ${roof}`} = ${lenTex(total, u, 2)}`],
              ],
            ],
            [
              `The two ends together are one $${2 * p}$ by $${q}$ rectangle, $${ends}$, and the two slanted sides one $${2 * s}$ by $${l}$ rectangle, $${roof}$${floor ? `; with the floor, $${bottom}$` : ""}: $${total}$ in all.`,
              `两个端面合起来是一个 $${2 * p}$ × $${q}$ 的长方形，$${ends}$；两个斜面合起来是一个 $${2 * s}$ × $${l}$ 的长方形，$${roof}$${floor ? `；加上底面 $${bottom}$` : ""}：共 $${total}$。`,
            ],
            [
              floor
                ? [ends + roof, "That leaves out the floor, but it is included.", "这是漏掉了底面，但题目要算底面。"]
                : [ends + roof + bottom, "That adds the floor, but it is left out.", "这是加上了底面，但题目不算底面。"],
              [
                ends + 2 * q * l + (floor ? bottom : 0),
                "That uses the height for the roof, but the roof is as wide as the slanted sides.",
                "这是用高作斜面的宽，但斜面的宽是腰长。",
              ],
              [ends / 2 + roof + (floor ? bottom : 0), "That counts only one end.", "这只算了一个端面。"],
            ],
            {
              unit: `${u}^2`,
              form: "integer",
              figure: fig(
                prismFigure(
                  2 * p,
                  p,
                  q,
                  l,
                  [
                    { kind: "side", a: P3(0, 0, 0), b: P3(2 * p, 0, 0), text: `${2 * p} ${u}` },
                    { kind: "side", a: P3(2 * p, 0, 0), b: P3(2 * p, 0, l), text: `${l} ${u}` },
                    { kind: "side", a: P3(p, q, 0), b: P3(0, 0, 0), text: `${s} ${u}` },
                  ],
                  `${q} ${u}`,
                ),
                `A tent shaped like a triangular prism ${l} ${u} long, with a triangular end of base ${2 * p} ${u}, height ${q} ${u} and slanted sides ${s} ${u}.`,
                `长 ${l} ${u} 的三棱柱形帐篷，三角形端面底为 ${2 * p} ${u}，高为 ${q} ${u}，两腰为 ${s} ${u}。`,
              ),
            },
          );
        },
        drawn(gradeDrawings3["surface-areas-of-triangular-prisms#tents-and-roofs"]),
      ),
    ],
  ),
  [
    "To wrap a chocolate bar shaped like a triangular prism, you need paper for every face: two triangle ends and three rectangle sides.",
    "要包一块三棱柱形的巧克力，每个面都需要包装纸：两个三角形端面和三个长方形侧面。",
  ],
  [
    "Unfold the wrapper: the three rectangles lie in one long strip, as wide as the triangle's perimeter.",
    "把包装纸展开：三个长方形连成一条长条，宽等于三角形的周长。",
  ],
  [
    "find the surface area of a triangular prism by adding its two triangles and three rectangles, including tents with or without a floor.",
    "学习把两个三角形和三个长方形加起来求三棱柱的表面积，包括带底或不带底的帐篷。",
  ],
);

/** Box is the length, depth and height of a rectangular prism. */
type Box = readonly [number, number, number];

/** boxArea is the surface area of a box. */
const boxArea = ([l, d, h]: Box) => 2 * (l * d + l * h + d * h);

/** stackedBoxes draws a small box standing on the back left corner of a big box, with only the visible edges. */
function stackedBoxes(big: Box, small: Box, u: string): Mark[] {
  const [L, D, H] = big;
  const [l, d, h] = small;
  const z0 = D - d;
  const top = (x: number, z: number) => P3(x, H, z);
  const s = (x: number, y: number, z: number) => P3(x, H + y, z0 + z);
  return [
    { kind: "polygon", points: [P3(0, 0, 0), P3(L, 0, 0), P3(L, H, 0), P3(0, H, 0)] },
    { kind: "polygon", points: [P3(L, 0, 0), P3(L, 0, D), P3(L, H, D), P3(L, H, 0)] },
    // The top of the big box: the parts of its edges that the small box does not cover.
    { kind: "segment", a: top(L, 0), b: top(L, D) },
    { kind: "segment", a: top(l, D), b: top(L, D) },
    { kind: "segment", a: top(0, 0), b: top(0, z0) },
    { kind: "polygon", points: [s(0, 0, 0), s(l, 0, 0), s(l, h, 0), s(0, h, 0)] },
    { kind: "polygon", points: [s(0, h, 0), s(l, h, 0), s(l, h, d), s(0, h, d)] },
    { kind: "polygon", points: [s(l, 0, 0), s(l, 0, d), s(l, h, d), s(l, h, 0)] },
    { kind: "side", a: P3(0, 0, 0), b: P3(L, 0, 0), text: `${L} ${u}` },
    { kind: "side", a: P3(L, 0, 0), b: P3(L, 0, D), text: `${D} ${u}` },
    { kind: "side", a: P3(0, H, 0), b: P3(0, 0, 0), text: `${H} ${u}` },
    { kind: "side", a: s(0, h, 0), b: s(0, 0, 0), text: `${h} ${u}` },
    { kind: "side", a: s(0, h, d), b: s(0, h, 0), text: `${d} ${u}` },
    { kind: "side", a: s(l, h, 0), b: s(0, h, 0), text: `${l} ${u}` },
  ];
}

/** topView is the surface area of a box standing on a box, found by looking from above, below and the four sides: twice the big top, and the walls of both boxes. */
const topView = (big: Box, small: Box) => 2 * big[0] * big[1] + 2 * (big[0] + big[1]) * big[2] + 2 * (small[0] + small[1]) * small[2];

/** surfaceAreasOfCombinedRectangularPrisms finds the surface area of one box standing on another. */
export const surfaceAreasOfCombinedRectangularPrisms = withIntro(
  topic(
    "surface-areas-of-combined-rectangular-prisms",
    t("Surface Areas of Combined Rectangular Prisms", "组合长方体的表面积"),
    t(
      "When a box stands on another, the face where they touch is hidden twice: once on top of the bottom box and once under the top box. So the surface area of the combined solid is the sum of the two surface areas minus twice the area of contact.",
      "一个长方体放在另一个上面时，两者接触的面被遮住了两次：一次在下面长方体的顶面上，一次在上面长方体的底面上。所以组合体的表面积等于两个表面积之和减去接触面积的两倍。",
    ),
    ["surface-areas-of-rectangular-solids"],
    ["7.G.B.6"],
    [
      lesson(
        "boxes-on-boxes",
        ["Boxes on boxes", "叠放的长方体"],
        [
          [
            "Add the two surface areas, then take away the contact area twice: it is hidden on top of the bottom box and under the top box. A $4 \\times 3 \\times 2$ box on a $10 \\times 6 \\times 5$ box: $52 + 280 - 2 \\cdot 12 = 308$.",
            "把两个表面积相加，再减去两次接触面积：它在下面长方体的顶上和上面长方体的底下都被遮住了。$4 \\times 3 \\times 2$ 的长方体放在 $10 \\times 6 \\times 5$ 的长方体上：$52 + 280 - 2 \\cdot 12 = 308$。",
          ],
          [
            "Look from outside instead: from above and below you see $10 \\cdot 6$ each, the big walls are $2(10 + 6) \\cdot 5 = 160$ and the small walls $2(4 + 3) \\cdot 2 = 28$: $120 + 160 + 28 = 308$.",
            "也可以从外面看：从上面和下面各看到 $10 \\cdot 6$，大长方体的四壁是 $2(10 + 6) \\cdot 5 = 160$，小长方体的四壁是 $2(4 + 3) \\cdot 2 = 28$：$120 + 160 + 28 = 308$。",
          ],
          ["The contact area is hidden twice, once on each box, so subtract it twice.", "接触面在两个长方体上各被遮住一次，所以要减两次。"],
        ],
        (rng) => {
          const big: Box = [rng.int(6, 14), rng.int(4, 10), rng.int(2, 8)];
          const small: Box = [rng.int(2, big[0] - 2), rng.int(2, big[1] - 1), rng.int(2, 8)];
          const u = pickUnit(rng);
          const [a1, a2] = [boxArea(big), boxArea(small)];
          const contact = small[0] * small[1];
          const total = a1 + a2 - 2 * contact;
          const [L, D, H] = big;
          const [l, d, h] = small;
          return valued(
            [
              "A box stands on top of a larger box. Find the surface area of the combined solid.",
              "一个长方体放在一个较大的长方体上。求组合体的表面积。",
            ],
            total,
            [
              [
                ["Find both surface areas", "求两个表面积"],
                ["Each box on its own:", "每个长方体单独的表面积："],
                [
                  `2(${L} \\cdot ${D} + ${L} \\cdot ${H} + ${D} \\cdot ${H}) = ${a1}`,
                  `2(${l} \\cdot ${d} + ${l} \\cdot ${h} + ${d} \\cdot ${h}) = ${a2}`,
                ],
              ],
              [
                ["Take away the contact twice", "减去两次接触面积"],
                [
                  `The $${l} \\times ${d}$ face where they touch is hidden on both boxes:`,
                  `两者接触的 $${l} \\times ${d}$ 的面在两个长方体上都被遮住：`,
                ],
                [`${a1} + ${a2} - 2 \\cdot ${contact} = ${lenTex(total, u, 2)}`],
              ],
            ],
            [
              `Look from outside: from above and below you see $${L} \\cdot ${D}$ each, the big walls are $2(${L} + ${D}) \\cdot ${H}$ and the small walls $2(${l} + ${d}) \\cdot ${h}$: $${2 * L * D} + ${2 * (L + D) * H} + ${2 * (l + d) * h} = ${topView(big, small)}$.`,
              `从外面看：从上面和下面各看到 $${L} \\cdot ${D}$，大长方体的四壁是 $2(${L} + ${D}) \\cdot ${H}$，小长方体的四壁是 $2(${l} + ${d}) \\cdot ${h}$：$${2 * L * D} + ${2 * (L + D) * H} + ${2 * (l + d) * h} = ${topView(big, small)}$。`,
            ],
            [
              [a1 + a2, "That adds the two surface areas but keeps the hidden faces.", "这是把两个表面积相加了，但没有去掉被遮住的面。"],
              [
                a1 + a2 - contact,
                "That takes the contact away once, but it is hidden on both boxes.",
                "这只减了一次接触面积，但它在两个长方体上都被遮住了。",
              ],
              [L * D * H + l * d * h, "That is the volume, not the surface area.", "这是体积，不是表面积。"],
            ],
            {
              unit: `${u}^2`,
              form: "integer",
              figure: fig(
                stackedBoxes(big, small, u),
                `A box ${l} by ${d} by ${h} ${u} standing on a box ${L} by ${D} by ${H} ${u}.`,
                `一个 ${l} × ${d} × ${h} ${u} 的长方体放在 ${L} × ${D} × ${H} ${u} 的长方体上。`,
              ),
            },
          );
        },
        fig(
          stackedBoxes([10, 6, 5], [4, 3, 2], "cm"),
          "A box 4 by 3 by 2 cm standing on a box 10 by 6 by 5 cm.",
          "一个 4 × 3 × 2 cm 的长方体放在 10 × 6 × 5 cm 的长方体上。",
        ),
      ),
      lesson(
        "painting-combined-prisms",
        ["Painting combined prisms", "给组合体刷漆"],
        [
          [
            "If the combined solid sits on the floor, its bottom is not painted either. Subtract the contact area twice and the bottom once. For a $4 \\times 3 \\times 2$ box on a $10 \\times 6 \\times 5$ box: $52 + 280 - 2 \\cdot 12 - 10 \\cdot 6 = 248$.",
            "若组合体放在地面上，底面也不刷漆。接触面积减两次，底面减一次。$4 \\times 3 \\times 2$ 的长方体放在 $10 \\times 6 \\times 5$ 的长方体上：$52 + 280 - 2 \\cdot 12 - 10 \\cdot 6 = 248$。",
          ],
          [
            "From outside: the view from above is $60$, the big walls $160$ and the small walls $28$: $60 + 160 + 28 = 248$.",
            "从外面看：从上面看到 $60$，大长方体四壁 $160$，小长方体四壁 $28$：$60 + 160 + 28 = 248$。",
          ],
          [
            "Only the part of the big top under the small box is hidden; the rest of the top is painted.",
            "大长方体的顶面只有小长方体下面那一块被遮住；其余部分要刷漆。",
          ],
        ],
        (rng) => {
          const big: Box = [rng.int(6, 14), rng.int(4, 10), rng.int(2, 8)];
          const small: Box = [rng.int(2, big[0] - 2), rng.int(2, big[1] - 1), rng.int(2, 8)];
          const [a1, a2] = [boxArea(big), boxArea(small)];
          const contact = small[0] * small[1];
          const floor = big[0] * big[1];
          const total = a1 + a2 - 2 * contact - floor;
          const [thing, thingZh] = rng.pick([
            [
              "A concrete stage with a smaller block on top stands in a park, and every outside face is painted",
              "公园里有一个水泥舞台，上面放着一个较小的台子，所有露在外面的面都要刷漆",
            ],
            [
              "A wooden podium stands on the floor and is painted on every visible face",
              "一个木制领奖台放在地上，所有露在外面的面都要刷漆",
            ],
            [
              "A building and its tower stand on the ground; the outside walls and roofs are painted",
              "一座楼和楼顶的塔楼建在地面上，外墙和屋顶都要刷漆",
            ],
          ] as const);
          const [L, D, H] = big;
          const [l, d, h] = small;
          const seen = floor + 2 * (L + D) * H + 2 * (l + d) * h;
          return valued(
            [
              `${thing}. The bottom part is $${L} \\times ${D} \\times ${H}$ and the top part, standing on it, is $${l} \\times ${d} \\times ${h}$, all in feet. What area is painted?`,
              `${thingZh}。下层是 $${L} \\times ${D} \\times ${H}$，放在上面的上层是 $${l} \\times ${d} \\times ${h}$，单位都是英尺。需要刷漆的面积是多少？`,
            ],
            total,
            [
              [
                ["Add both surface areas", "两个表面积相加"],
                ["Each part on its own:", "每部分单独的表面积："],
                [`${a1} + ${a2} = ${a1 + a2}`],
              ],
              [
                ["Take away the hidden faces", "减去看不见的面"],
                ["The contact twice, and the bottom once:", "接触面减两次，底面减一次："],
                [`${a1 + a2} - 2 \\cdot ${contact} - ${L} \\cdot ${D} = ${lenTex(total, "ft", 2)}`],
              ],
            ],
            [
              `From outside: the view from above is $${floor}$, the big walls $2(${L} + ${D}) \\cdot ${H} = ${2 * (L + D) * H}$ and the small walls $2(${l} + ${d}) \\cdot ${h} = ${2 * (l + d) * h}$: $${seen}$.`,
              `从外面看：从上面看到 $${floor}$，大的四壁 $2(${L} + ${D}) \\cdot ${H} = ${2 * (L + D) * H}$，小的四壁 $2(${l} + ${d}) \\cdot ${h} = ${2 * (l + d) * h}$：共 $${seen}$。`,
            ],
            [
              [total + floor, "That also covers the bottom, which rests on the ground.", "这是把底面也算上了，但底面贴着地面。"],
              [
                total + contact,
                "That takes the contact away once, but it is hidden on both parts.",
                "这只减了一次接触面积，但它在两部分上都被遮住了。",
              ],
              [
                total - (floor - contact),
                "That leaves out the whole top of the bottom part, but only the piece under the top part is hidden.",
                "这是把下层的整个顶面都去掉了，但只有上层下面那一块被遮住。",
              ],
            ],
            {
              unit: "ft^2",
              form: "integer",
              figure: fig(
                stackedBoxes(big, small, "ft"),
                `A block ${l} by ${d} by ${h} ft standing on a block ${L} by ${D} by ${H} ft.`,
                `一个 ${l} × ${d} × ${h} ft 的长方体放在 ${L} × ${D} × ${H} ft 的长方体上。`,
              ),
            },
          );
        },
        drawn(gradeDrawings4["surface-areas-of-combined-rectangular-prisms#painting-combined-prisms"]),
      ),
    ],
  ),
  [
    "A two-layer birthday cake gets icing on every outside face. Where the small layer sits on the big one, no icing is needed, on either layer.",
    "一个两层的生日蛋糕，外面每个面都要抹奶油。小的一层压在大的一层上面的地方，两层都不用抹。",
  ],
  [
    "The hidden square is the bottom of the small layer and also part of the top of the big layer: two faces' worth.",
    "被遮住的那一块既是小层的底面，也是大层顶面的一部分：相当于两个面。",
  ],
  [
    "find the surface area of a box standing on another box, and of solids that rest on the ground.",
    "学习求一个长方体叠在另一个上面的组合体的表面积，以及放在地上的立体的表面积。",
  ],
);

/** cubeRowFigure draws n cubes in a row in oblique projection, with the edge of one labeled. */
export function cubeRowFigure(n: number, edge: string): Figure {
  const marks: Mark[] = [];
  for (let i = 0; i < n; i++) {
    marks.push(
      { kind: "polygon", points: [P3(i, 0, 0), P3(i + 1, 0, 0), P3(i + 1, 1, 0), P3(i, 1, 0)] },
      { kind: "polygon", points: [P3(i, 1, 0), P3(i + 1, 1, 0), P3(i + 1, 1, 1), P3(i, 1, 1)] },
    );
  }
  marks.push(
    { kind: "polygon", points: [P3(n, 0, 0), P3(n, 0, 1), P3(n, 1, 1), P3(n, 1, 0)] },
    { kind: "side", a: P3(0, 0, 0), b: P3(1, 0, 0), text: edge },
  );
  return fig(marks, `${n} cubes with edges of ${edge} glued face to face in a row.`, `${n} 个棱长 ${edge} 的立方体面对面粘成一排。`);
}

/** rightPrismFigure draws a right triangular prism lying on its long leg q, with the upright leg p, the hypotenuse r and the length l labeled. */
export function rightPrismFigure(p: number, q: number, r: number, l: number, u: string): Figure {
  const labels: Mark[] = [
    { kind: "right", vertex: P3(0, 0, 0), from: P3(0, p, 0), to: P3(q, 0, 0) },
    { kind: "side", a: P3(0, 0, 0), b: P3(q, 0, 0), text: `${q} ${u}` },
    { kind: "side", a: P3(0, p, 0), b: P3(0, 0, 0), text: `${p} ${u}` },
    { kind: "side", a: P3(q, 0, 0), b: P3(0, p, 0), text: `${r} ${u}` },
    { kind: "side", a: P3(q, 0, 0), b: P3(q, 0, l), text: `${l} ${u}` },
  ];
  return fig(
    prismFigure(q, 0, p, l, labels, null),
    `A prism ${l} ${u} long whose ends are right triangles with legs ${p} and ${q} ${u} and hypotenuse ${r} ${u}.`,
    `一个长 ${l} ${u} 的棱柱，端面是直角边 ${p} ${u}、${q} ${u}，斜边 ${r} ${u} 的直角三角形。`,
  );
}

/** cutBoxFigure draws an a by b by c box with a cut parallel to its front a by b face, halfway back. */
export function cutBoxFigure(a: number, b: number, c: number, u: string): Figure {
  const z = c / 2;
  const marks: Mark[] = [
    { kind: "polygon", points: [P3(0, 0, 0), P3(a, 0, 0), P3(a, b, 0), P3(0, b, 0)] },
    { kind: "polygon", points: [P3(0, b, 0), P3(a, b, 0), P3(a, b, c), P3(0, b, c)] },
    { kind: "polygon", points: [P3(a, 0, 0), P3(a, 0, c), P3(a, b, c), P3(a, b, 0)] },
    { kind: "polygon", points: [P3(0, 0, z), P3(a, 0, z), P3(a, b, z), P3(0, b, z)], accent: true },
    { kind: "side", a: P3(0, 0, 0), b: P3(a, 0, 0), text: `${a} ${u}` },
    { kind: "side", a: P3(0, b, 0), b: P3(0, 0, 0), text: `${b} ${u}` },
    { kind: "side", a: P3(a, 0, 0), b: P3(a, 0, c), text: `${c} ${u}` },
  ];
  return fig(
    marks,
    `A box ${a} by ${b} by ${c} ${u}, cut by a plane parallel to its ${a} by ${b} face.`,
    `一个 ${a} × ${b} × ${c} ${u} 的长方体，被平行于 ${a} × ${b} 面的平面切开。`,
  );
}

/** Section is a solid cut by a plane, with the shape the cut makes. */
interface Section {
  readonly solid: Text;
  readonly cut: Text;
  readonly shape: "circle" | "square" | "rectangle" | "triangle";
  /** why explains the shape when the cut is not parallel to a face or base. */
  readonly why?: Text;
}

const shapeNames: Record<Section["shape"], Text> = {
  circle: t("A circle", "圆"),
  square: t("A square", "正方形"),
  rectangle: t("A rectangle that is not a square", "不是正方形的长方形"),
  triangle: t("A triangle", "三角形"),
};

const parallel = t("parallel to its base", "平行于底面");
const throughApex = t("perpendicular to its base, through its top point", "垂直于底面且经过顶点");
const apexWhy = t(
  "The plane passes through the top point and cuts the base along a line, so the cut has three sides: a triangle.",
  "平面经过顶点，并沿一条线切过底面，所以截面有三条边，是三角形。",
);

const sections: readonly Section[] = [
  { solid: t("a cylinder", "圆柱"), cut: parallel, shape: "circle" },
  {
    solid: t("a tall cylinder", "高圆柱"),
    cut: t("perpendicular to its base, through its center", "垂直于底面且经过中心"),
    shape: "rectangle",
    why: t(
      "The plane cuts each circular base along a diameter and runs straight up the curved side, so the cut has two straight sides as tall as the cylinder and right angles: a rectangle. It is a square only if the height equals the diameter, and this cylinder is tall.",
      "平面沿直径切过两个圆形底面，并竖直穿过侧面，所以截面有两条与圆柱等高的直边，四个角都是直角，是长方形。只有高等于直径时才是正方形，而这个圆柱较高。",
    ),
  },
  { solid: t("a cone", "圆锥"), cut: parallel, shape: "circle" },
  { solid: t("a cone", "圆锥"), cut: throughApex, shape: "triangle", why: apexWhy },
  { solid: t("a square pyramid", "正四棱锥"), cut: parallel, shape: "square" },
  { solid: t("a square pyramid", "正四棱锥"), cut: throughApex, shape: "triangle", why: apexWhy },
  {
    solid: t("a sphere", "球"),
    cut: t("through any point inside it", "经过球内任意一点"),
    shape: "circle",
    why: t(
      "Every point of the sphere is the same distance from its center, so wherever the plane cuts it, the edge of the cut is the same distance from one point of the plane: a circle.",
      "球面上每一点到球心的距离都相等，所以无论平面从哪里切，截面的边缘到平面上某一点的距离都相等，是圆。",
    ),
  },
  { solid: t("a cube", "正方体"), cut: t("parallel to one of its faces", "平行于它的一个面"), shape: "square" },
  {
    solid: t("a cylinder", "圆柱"),
    cut: t("perpendicular to its base, not through its center", "垂直于底面但不经过中心"),
    shape: "rectangle",
    why: t(
      "The plane cuts each circular base along a chord and runs straight up the curved side, so the cut has four straight sides and right angles: a rectangle, narrower than the one through the center.",
      "平面沿一条弦切过两个圆形底面，并竖直穿过侧面，所以截面有四条直边，四个角都是直角，是长方形，比经过中心的截面窄。",
    ),
  },
  { solid: t("a pyramid with a 6 cm by 4 cm rectangular base", "底面是 6 cm × 4 cm 长方形的四棱锥"), cut: parallel, shape: "rectangle" },
  { solid: t("a triangular pyramid", "三棱锥"), cut: parallel, shape: "triangle" },
  {
    solid: t("a cube", "正方体"),
    cut: t("through two opposite edges", "经过两条相对的棱"),
    shape: "rectangle",
    why: t(
      "Two sides of the cut are the opposite edges of the cube and the other two are diagonals of faces, which are longer than an edge. The angles are right angles, so the cut is a rectangle that is not a square.",
      "截面的两条边是正方体的两条相对的棱，另两条边是面的对角线，比棱长。四个角都是直角，所以截面是不是正方形的长方形。",
    ),
  },
  { solid: t("a triangular prism", "三棱柱"), cut: t("parallel to its triangular faces", "平行于它的三角形面"), shape: "triangle" },
  {
    solid: t("a triangular prism", "三棱柱"),
    cut: t("parallel to one of its rectangular faces", "平行于它的一个长方形面"),
    shape: "rectangle",
  },
];

/** edgeOf says what the edge of each cross-section looks like. */
const edgeOf: Record<Section["shape"], Pair> = {
  circle: ["one curved edge and no corners", "一条弯曲的边，没有角"],
  triangle: ["three straight sides and three corners", "三条直边、三个角"],
  square: ["four equal sides and four right angles", "四条相等的边、四个直角"],
  rectangle: ["four right angles, with two long sides and two short ones", "四个直角，两条长边和两条短边"],
};

/** cornerCheck counts the corners of each cross-section, a second way to name it. */
const cornerCheck: Record<Section["shape"], Pair> = {
  circle: [
    "Count the corners: the edge turns smoothly with none, and only a circle among the choices has no corners.",
    "数角：边缘平滑地弯过来，一个角也没有，选项中只有圆没有角。",
  ],
  triangle: [
    "Count the corners: the cut has three, and only a triangle among the choices has three corners.",
    "数角：截面有三个角，选项中只有三角形有三个角。",
  ],
  square: [
    "Count the corners and compare the sides: four right angles and four equal sides make a square.",
    "数角并比较边长：四个直角、四条边相等，就是正方形。",
  ],
  rectangle: [
    "Count the corners and compare the sides: four right angles, but the sides are not all equal, so it is a rectangle and not a square.",
    "数角并比较边长：四个直角，但四条边不都相等，所以是长方形而不是正方形。",
  ],
};

/** shapeWord is the plain name of each shape. */
const shapeWord: Record<Section["shape"], Pair> = {
  circle: ["circle", "圆"],
  triangle: ["triangle", "三角形"],
  square: ["square", "正方形"],
  rectangle: ["rectangle that is not a square", "不是正方形的长方形"],
};

/** sectionMiss gives the reason a learner's shape is wrong for a cut of the right shape. */
function sectionMiss(right: Section["shape"], wrong: Section["shape"]): Pair {
  const [w, wZh] = shapeWord[wrong];
  if (right === "circle")
    return [
      `The edge of this cut is one curved line with no corners, so it is not a ${w}.`,
      `这个截面的边缘是一条没有角的曲线，所以不是${wZh}。`,
    ];
  if (wrong === "circle") return [`This cut has straight sides and corners, so it is not a circle.`, `这个截面有直边和角，所以不是圆。`];
  if (right === "triangle")
    return [`This cut has three sides, not four, so it is not a ${w}.`, `这个截面有三条边，不是四条，所以不是${wZh}。`];
  if (wrong === "triangle")
    return ["This cut has four sides, not three, so it is not a triangle.", "这个截面有四条边，不是三条，所以不是三角形。"];
  if (right === "square") return ["All four sides of this cut are equal, so it is a square.", "这个截面的四条边都相等，所以是正方形。"];
  return ["The sides of this cut are not all equal, so it is not a square.", "这个截面的四条边不都相等，所以不是正方形。"];
}

/** crossSectionsOfThreeDimensionalShapes names and measures the shapes made by slicing solids with planes. */
export const crossSectionsOfThreeDimensionalShapes = withIntro(
  topic(
    "cross-sections-of-three-dimensional-shapes",
    t("Cross-Sections of Three-Dimensional Shapes", "立体图形的截面"),
    t(
      "A cross-section is the flat shape made by slicing a solid with a plane. Slicing a prism or a cylinder parallel to its base gives a copy of the base; slicing a pyramid or a cone through its top point and perpendicular to the base gives a triangle; every slice of a sphere is a circle.",
      "截面是用一个平面切开立体图形时得到的平面图形。平行于底面切棱柱或圆柱，得到与底面相同的图形；垂直于底面并经过顶点切棱锥或圆锥，得到三角形；球的每个截面都是圆。",
    ),
    ["identifying-three-dimensional-shapes", "areas-of-triangles", "areas-of-circles"],
    ["7.G.A.3"],
    [
      lesson(
        "naming-cross-sections",
        ["Naming cross-sections", "说出截面的形状"],
        [
          [
            "Imagine where the plane meets each face. A cylinder sliced parallel to its base gives a circle; sliced straight down through its center, it gives a rectangle as tall as the cylinder and as wide as its diameter. A square pyramid sliced parallel to its base gives a smaller square; sliced straight down through its top point, it gives a triangle.",
            "想象平面与每个面相交的地方。平行于底面切圆柱，得到圆；竖直经过中心切下去，得到一个高等于圆柱的高、宽等于直径的长方形。平行于底面切正四棱锥，得到一个较小的正方形；竖直经过顶点切下去，得到三角形。",
          ],
          [
            "Count the corners of the cut: a circle has none, a triangle three, a square or a rectangle four. The slice through the top of a pyramid has three corners: the top point and two on the base.",
            "数一数截面的角：圆没有角，三角形有三个，正方形或长方形有四个。经过棱锥顶点的截面有三个角：顶点和底面上的两个点。",
          ],
          [
            "Only a slice parallel to the base of a cylinder is a circle; a slice straight down through it is a rectangle.",
            "只有平行于底面切圆柱才得到圆；竖直切下去得到的是长方形。",
          ],
        ],
        (rng) => {
          const [l, w] = [rng.int(5, 12), rng.int(2, 4)];
          const long = t(`a rectangular prism ${l} cm long, ${w} cm wide and ${w} cm high`, `长 ${l} cm、宽 ${w} cm、高 ${w} cm 的长方体`);
          const s = rng.pick([
            ...sections,
            { solid: long, cut: t(`parallel to its ${w} cm by ${w} cm end`, `平行于 ${w} cm × ${w} cm 的端面`), shape: "square" },
            { solid: long, cut: t(`parallel to its ${l} cm by ${w} cm bottom`, `平行于 ${l} cm × ${w} cm 的底面`), shape: "rectangle" },
          ] satisfies Section[]);
          const [word, wordZh] = shapeWord[s.shape];
          // A cut parallel to a face or a base has the same shape as that face or base.
          const meets: Pair = s.why
            ? [s.why.en, s.why["zh-CN"]]
            : [
                `The plane is parallel to a face or base that is a ${word}, so the cut is a copy of it.`,
                `平面平行于一个${wordZh}的面或底面，所以截面和它一样。`,
              ];
          const wrong = (Object.keys(shapeNames) as Section["shape"][])
            .filter((k) => k !== s.shape)
            .map((k): Wrong => {
              const [en, zh] = sectionMiss(s.shape, k);
              return [[shapeNames[k].en, shapeNames[k]["zh-CN"]], en, zh];
            });
          const [edge, edgeZh] = edgeOf[s.shape];
          return chosen(
            rng,
            [
              `What shape is the cross-section when ${s.solid.en} is sliced ${s.cut.en}?`,
              `用平面${s.cut["zh-CN"]}切开${s.solid["zh-CN"]}，截面是什么形状？`,
            ],
            [shapeNames[s.shape].en, shapeNames[s.shape]["zh-CN"]],
            wrong,
            [
              [["See where the plane meets the solid", "看平面与立体图形相交的地方"], meets],
              [
                ["Name the shape", "说出形状"],
                [`The cut has ${edge}: a ${word}.`, `截面有${edgeZh}：${wordZh}。`],
              ],
            ],
            cornerCheck[s.shape],
          );
        },
        drawn(gradeDrawings4["cross-sections-of-three-dimensional-shapes#naming-cross-sections"]),
      ),
      lesson(
        "areas-of-cross-sections",
        ["Areas of cross-sections", "截面的面积"],
        [
          [
            "Find the shape of the cross-section, then its dimensions from the solid. A $10 \\times 4 \\times 6$ cm prism sliced parallel to its $10 \\times 4$ base gives a $10 \\times 4$ rectangle, area $40\\text{ cm}^2$. A cylinder of radius $3$ cm and height $8$ cm sliced through its center perpendicular to its base gives a $6 \\times 8$ rectangle, area $48\\text{ cm}^2$, because its width is the diameter.",
            "先确定截面的形状，再从立体图形中找出它的尺寸。$10 \\times 4 \\times 6$ cm 的长方体平行于 $10 \\times 4$ 的底面切开，截面是 $10 \\times 4$ 的长方形，面积 $40\\text{ cm}^2$。半径 $3$ cm、高 $8$ cm 的圆柱经过中心垂直于底面切开，截面是 $6 \\times 8$ 的长方形，面积 $48\\text{ cm}^2$，因为它的宽是直径。",
          ],
          [
            "A slice of a prism parallel to its base is the volume shared out over the height: $240 \\div 6 = 40\\text{ cm}^2$.",
            "长方体平行于底面的截面，等于体积除以高：$240 \\div 6 = 40\\text{ cm}^2$。",
          ],
          [
            "A slice through the center of a cylinder is as wide as the diameter, not the radius.",
            "经过圆柱中心的截面，宽是直径，不是半径。",
          ],
        ],
        (rng) => {
          const u = pickUnit(rng);
          const kind = rng.pick(["prism", "cylinder", "pyramid", "disk"] as const);
          if (kind === "prism") {
            const [l, w, h] = [rng.int(5, 15), rng.int(2, 9), rng.int(3, 12)];
            const base = rng.bool();
            const other = base ? w : h;
            const area = l * other;
            const across = base ? h : w;
            return valued(
              [
                `A rectangular prism is $${lenTex(l, u)}$ long, $${lenTex(w, u)}$ wide and $${lenTex(h, u)}$ high. It is sliced ${base ? "parallel to its base" : "parallel to its front face, which is as long and as high as the prism"}. What is the area of the cross-section?`,
                `一个长方体长 $${lenTex(l, u)}$、宽 $${lenTex(w, u)}$、高 $${lenTex(h, u)}$。用平面${base ? "平行于底面" : "平行于前面（与长方体等长、等高）"}切开。截面的面积是多少？`,
              ],
              area,
              [
                [
                  ["Name the cross-section", "确定截面"],
                  [
                    `It is a copy of the ${base ? "base" : "front face"}, a $${l} \\times ${other}$ rectangle.`,
                    `它与${base ? "底面" : "前面"}相同，是 $${l} \\times ${other}$ 的长方形。`,
                  ],
                ],
                [
                  ["Find its area", "求面积"],
                  ["Length times the other side:", "长乘另一条边："],
                  [`${l} \\cdot ${other} = ${lenTex(area, u, 2)}`],
                ],
              ],
              [
                `Share the volume out over the ${base ? "height" : "width"}: $${l} \\cdot ${w} \\cdot ${h} = ${l * w * h}$ and $${l * w * h} \\div ${across} = ${area}$.`,
                `用体积除以${base ? "高" : "宽"}：$${l} \\cdot ${w} \\cdot ${h} = ${l * w * h}$，$${l * w * h} \\div ${across} = ${area}$。`,
              ],
              [
                base
                  ? [l * h, "That is the front face, but the slice is parallel to the base.", "这是前面的面积，但截面平行于底面。"]
                  : [l * w, "That is the base, but the slice is parallel to the front face.", "这是底面的面积，但截面平行于前面。"],
                [w * h, "That is the end face, which the slice does not copy.", "这是端面的面积，截面与端面不一样。"],
                [l * w * h, "That is the volume of the prism, not the area of a flat slice.", "这是长方体的体积，不是截面的面积。"],
              ],
              { form: "integer", unit: `${u}^2` },
            );
          }
          if (kind === "cylinder") {
            const [r, h] = [rng.int(2, 9), rng.int(3, 15)];
            return valued(
              [
                `A cylinder has a radius of $${lenTex(r, u)}$ and a height of $${lenTex(h, u)}$. It is sliced perpendicular to its base, through the center of the base. What is the area of the cross-section?`,
                `一个圆柱的半径是 $${lenTex(r, u)}$，高是 $${lenTex(h, u)}$。用平面垂直于底面、经过底面圆心切开。截面的面积是多少？`,
              ],
              2 * r * h,
              [
                [
                  ["Name the cross-section", "确定截面"],
                  ["It is a rectangle as tall as the cylinder and as wide as its diameter:", "它是长方形，高等于圆柱的高，宽等于直径："],
                  [`2 \\cdot ${r} = ${2 * r}`],
                ],
                [["Find its area", "求面积"], ["Width times height:", "宽乘高："], [`${2 * r} \\cdot ${h} = ${lenTex(2 * r * h, u, 2)}`]],
              ],
              [
                `The center line splits the slice into two rectangles $${r}$ wide: $2 \\cdot (${r} \\cdot ${h}) = 2 \\cdot ${r * h} = ${2 * r * h}$.`,
                `中线把截面分成两个宽 $${r}$ 的长方形：$2 \\cdot (${r} \\cdot ${h}) = 2 \\cdot ${r * h} = ${2 * r * h}$。`,
              ],
              [
                [
                  r * h,
                  "That uses the radius as the width, but the slice runs across the whole diameter.",
                  "这是把半径当成了宽，但截面横跨整条直径。",
                ],
                [
                  piQ.mul(Q.of(r * r)),
                  "That is the circular base, the slice parallel to the base.",
                  "这是圆形底面的面积，是平行于底面的截面。",
                ],
                [piQ.mul(Q.of(2 * r * h)), "That is the curved side of the cylinder, not a flat slice.", "这是圆柱的侧面积，不是截面。"],
              ],
              { form: "integer", unit: `${u}^2` },
            );
          }
          if (kind === "pyramid") {
            let s: number;
            let h: number;
            do {
              s = rng.int(4, 16);
              h = rng.int(3, 15);
            } while ((s * h) % 2 !== 0);
            const area = (s * h) / 2;
            return valued(
              [
                `A square pyramid has a base $${lenTex(s, u)}$ on each side and a height of $${lenTex(h, u)}$. It is sliced through its top point, perpendicular to its base and parallel to one side of the base. What is the area of the cross-section?`,
                `一个正四棱锥的底面边长是 $${lenTex(s, u)}$，高是 $${lenTex(h, u)}$。用平面经过顶点、垂直于底面且平行于底面的一条边切开。截面的面积是多少？`,
              ],
              area,
              [
                [
                  ["Name the cross-section", "确定截面"],
                  [
                    `It is a triangle with the width of the base, $${s}$, and the height of the pyramid, $${h}$.`,
                    `它是三角形，底等于底面的边长 $${s}$，高等于棱锥的高 $${h}$。`,
                  ],
                ],
                [
                  ["Find its area", "求面积"],
                  ["Half of base times height:", "底乘高的一半："],
                  [`\\tfrac{1}{2} \\cdot ${s} \\cdot ${h} = ${lenTex(area, u, 2)}`],
                ],
              ],
              [
                `The triangle is half of the $${s} \\times ${h}$ rectangle around it: $${s * h} \\div 2 = ${area}$.`,
                `三角形是围着它的 $${s} \\times ${h}$ 长方形的一半：$${s * h} \\div 2 = ${area}$。`,
              ],
              [
                [
                  s * h,
                  "That forgets the half: a triangle is half of the rectangle around it.",
                  "这是忘了除以 2：三角形是外面长方形的一半。",
                ],
                [
                  s * s,
                  "That is the square base, but this slice stands straight up through the top.",
                  "这是正方形底面的面积，但这个截面是竖直经过顶点的。",
                ],
              ],
              { form: "integer", unit: `${u}^2` },
            );
          }
          const [r, h] = [rng.int(2, 12), rng.int(3, 15)];
          const area = piQ.mul(Q.of(r * r));
          const once = piQ.mul(Q.of(r));
          return valued(
            [
              `A cylinder has a radius of $${lenTex(r, u)}$ and a height of $${lenTex(h, u)}$. It is sliced parallel to its base. Use $3.14$ for $\\pi$ to find the area of the cross-section.`,
              `一个圆柱的半径是 $${lenTex(r, u)}$，高是 $${lenTex(h, u)}$。用平面平行于底面切开。取 $\\pi$ 为 $3.14$，求截面的面积。`,
            ],
            area,
            [
              [
                ["Name the cross-section", "确定截面"],
                [
                  `It is a copy of the circular base, radius $${r}$, whatever the height.`,
                  `无论圆柱多高，截面都与圆形底面相同，半径是 $${r}$。`,
                ],
              ],
              [
                ["Find its area", "求面积"],
                ["Pi times the radius squared:", "圆周率乘半径的平方："],
                [`3.14 \\cdot ${r}^2 = 3.14 \\cdot ${r * r} = ${lenTex(area, u, 2)}`],
              ],
            ],
            [
              `Multiply by the radius one at a time: $3.14 \\cdot ${r} = ${once.toLatex()}$ and $${once.toLatex()} \\cdot ${r} = ${area.toLatex()}$.`,
              `逐次乘半径：$3.14 \\cdot ${r} = ${once.toLatex()}$，$${once.toLatex()} \\cdot ${r} = ${area.toLatex()}$。`,
            ],
            [
              [
                piQ.mul(Q.of(2 * r)),
                "That is the circumference, the distance around the slice, not its area.",
                "这是周长，是截面一圈的长度，不是面积。",
              ],
              [
                area.mul(Q.of(h)),
                "That multiplies by the height too, which gives the volume of the cylinder.",
                "这是又乘了高，得到的是圆柱的体积。",
              ],
              [piQ.mul(Q.of(4 * r * r)), "That squares the diameter in place of the radius.", "这是把直径当成半径来平方了。"],
            ],
            { unit: `${u}^2` },
          );
        },
        drawn(gradeDrawings4["cross-sections-of-three-dimensional-shapes#areas-of-cross-sections"]),
      ),
    ],
  ),
  [
    "Slice a loaf of bread straight across and every slice has the same shape. Slice a carrot at a slant, or an orange anywhere, and look at the face you made.",
    "把一条面包横着切，每一片的形状都一样。斜着切胡萝卜，或随便切一个橙子，看看切出来的面是什么形状。",
  ],
  [
    "The shape of the face depends on how the knife meets the solid: a slice of an orange is always round.",
    "切面的形状取决于刀怎样与物体相交：橙子无论怎么切，切面都是圆的。",
  ],
  [
    "name the shape a flat cut makes in a solid, and find its area from the solid's measurements.",
    "学习说出平面切开立体图形所得截面的形状，并根据立体图形的尺寸求截面的面积。",
  ],
);

/** grade7MeasurementTopics lists the 7th grade topics on scale drawings, circles and prisms. */
export const grade7MeasurementTopics: readonly TopicDef[] = [
  introductionToScaleDrawings,
  calculatingLengthsFromScaleDrawings,
  calculatingPerimetersAndAreasOfScaledShapes,
  relatingTheCircumferenceAndAreaOfACircle,
  compositeShapesWithCircles,
  findingAreasAndPerimetersOfPartCircles,
  volumesOfTriangularPrisms,
  surfaceAreasOfTriangularPrisms,
  surfaceAreasOfCombinedRectangularPrisms,
  crossSectionsOfThreeDimensionalShapes,
];
