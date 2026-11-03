import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, type Mark, type Point, Q, sketch } from "@ga/subject-math";

import { numberProblem, steps, unitLatex } from "../problems.ts";
import { rectangle, sides } from "./area.ts";
import { arcPoints, PI_EN, PI_ZH, piProblem, piQ, piSum, piTex } from "./geometry-circles.ts";
import { pickChoice } from "./grade-4-fractions.ts";

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

/** introductionToScaleDrawings reads, writes and compares the scales of scale drawings. */
export const introductionToScaleDrawings = topic(
  "introduction-to-scale-drawings",
  t("Introduction to Scale Drawings", "比例图入门"),
  t(
    "A scale drawing shows an object with every length multiplied by the same factor. Its scale, such as 1 cm : 4 m, says what actual length one unit on the drawing stands for; written in one unit, it becomes a ratio without units, such as 1 : 400.",
    "比例图把物体的每个长度都乘同一个数后画出来。比例尺（例如 1 cm : 4 m）说明图上的一个单位代表多长的实际长度；把两边换成同一个单位，就得到没有单位的比，例如 1 : 400。",
  ),
  ["understanding-proportional-relationships-using-tables"],
  ["7.G.A.1"],
  [
    {
      id: "finding-the-scale",
      title: t("Finding the scale", "求比例尺"),
      explanation: t(
        "If a $12$ m wall is drawn $3$ cm long, each centimeter of the drawing stands for $12 \\div 3 = 4$ m, so the scale is $1\\text{ cm} : 4\\text{ m}$. Divide the actual length by the drawn length, not the other way round.",
        "若一面 $12$ m 长的墙在图上画成 $3$ cm，那么图上每厘米代表 $12 \\div 3 = 4$ m，比例尺是 $1\\text{ cm} : 4\\text{ m}$。要用实际长度除以图上长度，不要反过来。",
      ),
      generate(rng) {
        const p = rng.pick(plans);
        const k = rng.pick(p.scales) * rng.pick([1, 1, 2, 3]);
        const d = rng.int(2, 12);
        const actual = k * d;
        return numberProblem({
          prompt: t(
            `On a ${p.name.en}, a ${p.object.en} that is $${lenTex(actual, p.au)}$ long is drawn $${lenTex(d, p.du)}$ long. Complete the scale: $1\\text{ ${p.du}} : ?\\text{ ${p.au}}$.`,
            `在一张${p.name["zh-CN"]}上，一条实际长 $${lenTex(actual, p.au)}$ 的${p.object["zh-CN"]}画成 $${lenTex(d, p.du)}$ 长。把比例尺补充完整：$1\\text{ ${p.du}} : ?\\text{ ${p.au}}$。`,
          ),
          answer: k,
          unit: p.au,
          wrong: [Q.of(d, actual), actual * d],
          solution: t(
            `The scale says how much actual length $1$ ${p.du} stands for. $${lenTex(d, p.du)}$ stand for $${lenTex(actual, p.au)}$, so${steps(`1\\text{ ${p.du}} : ${actual} \\div ${d} = ${lenTex(k, p.au)}`)}`,
            `比例尺说明图上 $1$ ${p.du} 代表多长的实际长度。$${lenTex(d, p.du)}$ 代表 $${lenTex(actual, p.au)}$，所以${steps(`1\\text{ ${p.du}} : ${actual} \\div ${d} = ${lenTex(k, p.au)}`)}`,
          ),
        });
      },
    },
    {
      id: "scales-as-ratios",
      title: t("Scales as ratios", "用比表示比例尺"),
      explanation: t(
        "To write a scale without units, put both sides in the same unit. Since $1\\text{ m} = 100\\text{ cm}$, the scale $1\\text{ cm} : 4\\text{ m}$ is $1\\text{ cm} : 400\\text{ cm}$, or $1 : 400$: every length on the drawing is $\\frac{1}{400}$ of the actual length. Likewise $1\\text{ cm} : 2\\text{ km}$ is $1 : 200\\,000$, and $1\\text{ in} : 3\\text{ ft}$ is $1 : 36$.",
        "要写出不带单位的比例尺，先把两边换成同一个单位。因为 $1\\text{ m} = 100\\text{ cm}$，比例尺 $1\\text{ cm} : 4\\text{ m}$ 就是 $1\\text{ cm} : 400\\text{ cm}$，即 $1 : 400$：图上每个长度都是实际长度的 $\\frac{1}{400}$。同样，$1\\text{ cm} : 2\\text{ km}$ 是 $1 : 200\\,000$，$1\\text{ in} : 3\\text{ ft}$ 是 $1 : 36$。",
      ),
      generate(rng) {
        const p = rng.pick(plans);
        const k = rng.pick(p.scales) * rng.pick([1, 2, 3]);
        const n = k * p.factor;
        const per = t(
          p.au === "m"
            ? "$1\\text{ m} = 100\\text{ cm}$"
            : p.au === "km"
              ? "$1\\text{ km} = 100\\,000\\text{ cm}$"
              : "$1\\text{ ft} = 12\\text{ in}$",
          p.au === "m"
            ? "$1\\text{ m} = 100\\text{ cm}$"
            : p.au === "km"
              ? "$1\\text{ km} = 100\\,000\\text{ cm}$"
              : "$1\\text{ ft} = 12\\text{ in}$",
        );
        return numberProblem({
          prompt: t(
            `A ${p.name.en} has the scale $1\\text{ ${p.du}} : ${lenTex(k, p.au)}$. Written without units, the scale is $1 : n$. What is $n$?`,
            `一张${p.name["zh-CN"]}的比例尺是 $1\\text{ ${p.du}} : ${lenTex(k, p.au)}$。写成不带单位的比是 $1 : n$。$n$ 是多少？`,
          ),
          answer: n,
          form: "integer",
          // Dropping the units, and converting with the wrong factor.
          wrong: [k, p.factor === 12 ? k * 10 : n / 10, n * 10],
          solution: t(
            `Write both sides in ${p.du === "cm" ? "centimeters" : "inches"}. Since ${per.en},${steps(`1\\text{ ${p.du}} : ${lenTex(k, p.au)} = 1\\text{ ${p.du}} : ${lenTex(group(n), p.du)}`)}So the scale is $1 : ${group(n)}$.`,
            `把两边都换成${p.du === "cm" ? "厘米" : "英寸"}。因为${per["zh-CN"]}，${steps(`1\\text{ ${p.du}} : ${lenTex(k, p.au)} = 1\\text{ ${p.du}} : ${lenTex(group(n), p.du)}`)}所以比例尺是 $1 : ${group(n)}$。`,
          ),
        });
      },
    },
    {
      id: "comparing-scales",
      title: t("Comparing scales", "比较比例尺"),
      explanation: t(
        "A $60$ m wall is $60 \\div 5 = 12$ cm long at the scale $1\\text{ cm} : 5\\text{ m}$, but $60 \\div 2 = 30$ cm long at $1\\text{ cm} : 2\\text{ m}$. The smaller the actual length that one unit stands for, the larger the drawing. Work out each drawn length before comparing.",
        "一面 $60$ m 长的墙，按比例尺 $1\\text{ cm} : 5\\text{ m}$ 画是 $60 \\div 5 = 12$ cm，按 $1\\text{ cm} : 2\\text{ m}$ 画是 $60 \\div 2 = 30$ cm。图上一个单位代表的实际长度越小，画出的图越大。先分别算出图上长度，再比较。",
      ),
      generate(rng) {
        const p = rng.pick(plans);
        const [k1, k2] = rng
          .shuffle([...p.scales])
          .slice(0, 2)
          .sort((a, b) => a - b) as [number, number];
        const lcm = (k1 * k2) / gcd(k1, k2);
        const actual = lcm * rng.int(1, Math.max(1, Math.floor(120 / lcm)));
        const [d1, d2] = [actual / k1, actual / k2];
        return numberProblem({
          prompt: t(
            `Two ${p.plural.en} show the same ${p.object.en}, which is $${lenTex(actual, p.au)}$ long. One uses the scale $1\\text{ ${p.du}} : ${lenTex(k1, p.au)}$ and the other $1\\text{ ${p.du}} : ${lenTex(k2, p.au)}$. How much longer is the ${p.object.en} on the first ${p.name.en} than on the second?`,
            `两张${p.plural["zh-CN"]}画了同一条 $${lenTex(actual, p.au)}$ 长的${p.object["zh-CN"]}。一张的比例尺是 $1\\text{ ${p.du}} : ${lenTex(k1, p.au)}$，另一张是 $1\\text{ ${p.du}} : ${lenTex(k2, p.au)}$。第一张图上的${p.object["zh-CN"]}比第二张上的长多少？`,
          ),
          answer: d1 - d2,
          unit: p.du,
          wrong: [k2 - k1, d1, d2].filter((w) => w !== d1 - d2),
          solution: t(
            `Find each drawn length, then subtract:${steps(`${actual} \\div ${k1} = ${lenTex(d1, p.du)}`, `${actual} \\div ${k2} = ${lenTex(d2, p.du)}`, `${d1} - ${d2} = ${lenTex(d1 - d2, p.du)}`)}`,
            `分别求出图上长度，再相减：${steps(`${actual} \\div ${k1} = ${lenTex(d1, p.du)}`, `${actual} \\div ${k2} = ${lenTex(d2, p.du)}`, `${d1} - ${d2} = ${lenTex(d1 - d2, p.du)}`)}`,
          ),
        });
      },
    },
  ],
);

/** calculatingLengthsFromScaleDrawings converts between drawn and actual lengths. */
export const calculatingLengthsFromScaleDrawings = topic(
  "calculating-lengths-from-scale-drawings",
  t("Calculating Lengths From Scale Drawings", "根据比例图计算长度"),
  t(
    "A scale is a ratio of drawn length to actual length, so a scale drawing is a proportional relationship. Multiply to go from the drawing to the actual object, divide to go back, and convert units when the scale is written without them.",
    "比例尺是图上长度与实际长度的比，所以比例图是一种正比例关系。从图上长度求实际长度用乘法，反过来用除法；比例尺不带单位时，还要换算单位。",
  ),
  ["introduction-to-scale-drawings"],
  ["7.G.A.1", "7.RP.A.2"],
  [
    {
      id: "from-drawing-to-actual",
      title: t("From the drawing to the actual length", "由图上长度求实际长度"),
      explanation: t(
        "With the scale $2\\text{ cm} : 5\\text{ m}$, each centimeter stands for $5 \\div 2 = 2.5$ m. A $14$ cm line on the drawing stands for\n\n$$14 \\cdot 2.5 = 35\\text{ m}.$$\n\nYou can also set up a proportion: $\\frac{2}{5} = \\frac{14}{x}$, so $x = 35$.",
        "比例尺为 $2\\text{ cm} : 5\\text{ m}$ 时，图上每厘米代表 $5 \\div 2 = 2.5$ m。图上 $14$ cm 的线段代表\n\n$$14 \\cdot 2.5 = 35\\text{ m}.$$\n\n也可以列比例式：$\\frac{2}{5} = \\frac{14}{x}$，所以 $x = 35$。",
      ),
      generate(rng) {
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
        return numberProblem({
          prompt: t(
            `The scale of a ${p.name.en} is $${lenTex(a, p.du)} : ${lenTex(b, p.au)}$. A ${p.object.en} is $${lenTex(d, p.du)}$ long on the ${p.name.en}. How long is the actual ${p.object.en}?`,
            `一张${p.name["zh-CN"]}的比例尺是 $${lenTex(a, p.du)} : ${lenTex(b, p.au)}$。一条${p.object["zh-CN"]}在图上长 $${lenTex(d, p.du)}$。这条${p.object["zh-CN"]}实际有多长？`,
          ),
          answer: actual,
          unit: p.au,
          // Inverting the scale, and ignoring that it starts at more than one unit.
          wrong: [Q.of(d * a, b), d * b],
          solution: t(
            `The drawn and actual lengths are in proportion:${steps(`\\frac{${a}}{${b}} = \\frac{${d}}{x}`, `x = \\frac{${d} \\cdot ${b}}{${a}} = ${lenTex(actual, p.au)}`)}`,
            `图上长度与实际长度成比例：${steps(`\\frac{${a}}{${b}} = \\frac{${d}}{x}`, `x = \\frac{${d} \\cdot ${b}}{${a}} = ${lenTex(actual, p.au)}`)}`,
          ),
        });
      },
    },
    {
      id: "from-actual-to-drawing",
      title: t("From the actual length to the drawing", "由实际长度求图上长度"),
      explanation: t(
        "To draw a $27$ m wall at the scale $2\\text{ cm} : 3\\text{ m}$, solve $\\frac{2}{3} = \\frac{x}{27}$:\n\n$$x = \\frac{2 \\cdot 27}{3} = 18\\text{ cm}.$$\n\nThe drawn length is always the smaller one, so check that your answer is shorter than the actual length.",
        "按比例尺 $2\\text{ cm} : 3\\text{ m}$ 画一面 $27$ m 长的墙，解 $\\frac{2}{3} = \\frac{x}{27}$：\n\n$$x = \\frac{2 \\cdot 27}{3} = 18\\text{ cm}.$$\n\n图上长度一定比实际的小，可以借此检验答案。",
      ),
      generate(rng) {
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
        const drawn = Q.of(m, 2);
        const actual = (m * b) / (2 * a);
        return numberProblem({
          prompt: t(
            `The scale of a ${p.name.en} is $${lenTex(a, p.du)} : ${lenTex(b, p.au)}$. How long should a ${p.object.en} that is $${lenTex(actual, p.au)}$ long be drawn?`,
            `一张${p.name["zh-CN"]}的比例尺是 $${lenTex(a, p.du)} : ${lenTex(b, p.au)}$。一条实际长 $${lenTex(actual, p.au)}$ 的${p.object["zh-CN"]}在图上应画多长？`,
          ),
          answer: drawn,
          unit: p.du,
          wrong: [Q.of(actual * b, a), Q.of(actual, b)].filter((w) => !w.sub(drawn).isZero()),
          solution: t(
            `The drawn and actual lengths are in proportion:${steps(`\\frac{${a}}{${b}} = \\frac{x}{${actual}}`, `x = \\frac{${a} \\cdot ${actual}}{${b}} = ${lenTex(drawn, p.du)}`)}`,
            `图上长度与实际长度成比例：${steps(`\\frac{${a}}{${b}} = \\frac{x}{${actual}}`, `x = \\frac{${a} \\cdot ${actual}}{${b}} = ${lenTex(drawn, p.du)}`)}`,
          ),
        });
      },
    },
    {
      id: "scales-without-units",
      title: t("Scales without units", "不带单位的比例尺"),
      explanation: t(
        "On a map with the scale $1 : 50\\,000$, every length is $50\\,000$ times longer in reality, in the same unit. A $6$ cm distance on the map is $6 \\cdot 50\\,000 = 300\\,000$ cm. Since $1\\text{ km} = 100\\,000\\text{ cm}$, that is $3$ km.",
        "在比例尺为 $1 : 50\\,000$ 的地图上，每个长度的实际值都是图上的 $50\\,000$ 倍，单位相同。图上 $6$ cm 的距离实际是 $6 \\cdot 50\\,000 = 300\\,000$ cm。因为 $1\\text{ km} = 100\\,000\\text{ cm}$，这就是 $3$ km。",
      ),
      generate(rng) {
        const n = rng.pick([20000, 25000, 50000, 100000, 200000, 250000]);
        const toKm = rng.bool();
        let cm: Q;
        do cm = Q.of(rng.int(2, 30), rng.pick([1, 2]));
        while (!cm.mul(Q.of(n, 100000)).mul(Q.of(100)).isInteger());
        const km = cm.mul(Q.of(n, 100000));
        const real = cm.mul(Q.of(n));
        if (toKm) {
          return numberProblem({
            prompt: t(
              `A map has the scale $1 : ${group(n)}$. Two towns are $${lenTex(cm, "cm")}$ apart on the map. How far apart are they in kilometers?`,
              `一张地图的比例尺是 $1 : ${group(n)}$。两个镇在地图上相距 $${lenTex(cm, "cm")}$。它们实际相距多少千米？`,
            ),
            answer: km,
            unit: "km",
            // Converting centimeters to kilometers with the wrong factor.
            wrong: [km.mul(Q.of(100)), km.mul(Q.of(10)), km.div(Q.of(10))],
            solution: t(
              `The actual distance is $${group(n)}$ times the map distance, in the same unit:${steps(`${num(cm)} \\cdot ${group(n)} = ${lenTex(group(real), "cm")}`)}Since $1\\text{ km} = 100\\,000\\text{ cm}$, divide by $100\\,000$:${steps(`${group(real)} \\div 100\\,000 = ${lenTex(km, "km")}`)}`,
              `实际距离是图上距离的 $${group(n)}$ 倍，单位相同：${steps(`${num(cm)} \\cdot ${group(n)} = ${lenTex(group(real), "cm")}`)}因为 $1\\text{ km} = 100\\,000\\text{ cm}$，再除以 $100\\,000$：${steps(`${group(real)} \\div 100\\,000 = ${lenTex(km, "km")}`)}`,
            ),
          });
        }
        return numberProblem({
          prompt: t(
            `A map has the scale $1 : ${group(n)}$. Two towns are $${lenTex(km, "km")}$ apart. How far apart are they on the map, in centimeters?`,
            `一张地图的比例尺是 $1 : ${group(n)}$。两个镇实际相距 $${lenTex(km, "km")}$。它们在地图上相距多少厘米？`,
          ),
          answer: cm,
          unit: "cm",
          wrong: [cm.mul(Q.of(100)), cm.mul(Q.of(10)), cm.div(Q.of(10))],
          solution: t(
            `First write the distance in centimeters: $${lenTex(km, "km")} = ${num(km)} \\cdot 100\\,000 = ${lenTex(group(real), "cm")}$. The map distance is $\\frac{1}{${group(n)}}$ of that:${steps(`${group(real)} \\div ${group(n)} = ${lenTex(cm, "cm")}`)}`,
            `先把距离换成厘米：$${lenTex(km, "km")} = ${num(km)} \\cdot 100\\,000 = ${lenTex(group(real), "cm")}$。图上距离是它的 $\\frac{1}{${group(n)}}$：${steps(`${group(real)} \\div ${group(n)} = ${lenTex(cm, "cm")}`)}`,
          ),
        });
      },
    },
  ],
);

/** calculatingPerimetersAndAreasOfScaledShapes scales perimeters by the scale factor and areas by its square. */
export const calculatingPerimetersAndAreasOfScaledShapes = topic(
  "calculating-perimeters-and-areas-of-scaled-shapes",
  t("Calculating Perimeters and Areas of Scaled Shapes", "计算缩放图形的周长和面积"),
  t(
    "When every length of a shape is multiplied by k, its perimeter is also multiplied by k, but its area is multiplied by k², because both the length and the width grow by k. So a floor plan at 1 cm : 3 m turns each square centimeter into 9 square meters.",
    "把图形的每个长度都乘 k 时，周长也乘 k，面积却乘 k²，因为长和宽都变成 k 倍。所以在比例尺为 1 cm : 3 m 的平面图上，每平方厘米代表 9 平方米。",
  ),
  ["calculating-lengths-from-scale-drawings", "area-of-rectangles-and-squares", "perimeters-of-shapes"],
  ["7.G.A.1"],
  [
    {
      id: "actual-perimeters-and-areas",
      title: t("Actual perimeters and areas", "实际的周长和面积"),
      explanation: t(
        "A room is drawn as a $5$ cm by $4$ cm rectangle at the scale $1\\text{ cm} : 3\\text{ m}$. First find the actual lengths: $5 \\cdot 3 = 15$ m and $4 \\cdot 3 = 12$ m. Then the actual perimeter is $2(15 + 12) = 54$ m and the actual area is $15 \\cdot 12 = 180\\text{ m}^2$.\n\nThe drawn area is $20\\text{ cm}^2$, and $20 \\cdot 3 = 60$ is wrong: each square centimeter stands for $3 \\cdot 3 = 9\\text{ m}^2$.",
        "在比例尺为 $1\\text{ cm} : 3\\text{ m}$ 的图上，一个房间画成 $5$ cm × $4$ cm 的长方形。先求实际长度：$5 \\cdot 3 = 15$ m，$4 \\cdot 3 = 12$ m。实际周长是 $2(15 + 12) = 54$ m，实际面积是 $15 \\cdot 12 = 180\\text{ m}^2$。\n\n图上面积是 $20\\text{ cm}^2$，用 $20 \\cdot 3 = 60$ 是错的：每平方厘米代表 $3 \\cdot 3 = 9\\text{ m}^2$。",
      ),
      generate(rng) {
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
        const head = t(
          `${room[1].en} has the scale $1\\text{ cm} : ${lenTex(k, "m")}$. A rectangular ${room[0].en} is drawn $${lenTex(l, "cm")}$ by $${lenTex(w, "cm")}$.`,
          `${room[1]["zh-CN"]}的比例尺是 $1\\text{ cm} : ${lenTex(k, "m")}$。一个长方形${room[0]["zh-CN"]}在图上画成 $${lenTex(l, "cm")}$ × $${lenTex(w, "cm")}$。`,
        );
        const actual = steps(`${l} \\cdot ${k} = ${lenTex(L, "m")}`, `${w} \\cdot ${k} = ${lenTex(W, "m")}`);
        return {
          ...numberProblem({
            prompt: area
              ? t(`${head.en} What is the actual area of the ${room[0].en}?`, `${head["zh-CN"]}这个${room[0]["zh-CN"]}的实际面积是多少？`)
              : t(
                  `${head.en} What is the actual perimeter of the ${room[0].en}?`,
                  `${head["zh-CN"]}这个${room[0]["zh-CN"]}的实际周长是多少？`,
                ),
            answer: area ? L * W : 2 * (L + W),
            form: "integer",
            unit: area ? "m^2" : "m",
            // Scaling the area by k instead of k², or the perimeter by k².
            wrong: area ? [l * w * k, l * w] : [2 * (l + w) * k * k, 2 * (l + w)],
            solution: area
              ? t(
                  `First find the actual length and width:${actual}Then multiply:${steps(`${L} \\cdot ${W} = ${lenTex(L * W, "m", 2)}`)}`,
                  `先求实际的长和宽：${actual}再相乘：${steps(`${L} \\cdot ${W} = ${lenTex(L * W, "m", 2)}`)}`,
                )
              : t(
                  `First find the actual length and width:${actual}Then add the four sides:${steps(`2(${L} + ${W}) = ${lenTex(2 * (L + W), "m")}`)}`,
                  `先求实际的长和宽：${actual}再把四条边相加：${steps(`2(${L} + ${W}) = ${lenTex(2 * (L + W), "m")}`)}`,
                ),
          }),
          figure: fig(
            [{ kind: "polygon", points: rectangle(l, w) }, ...sides(rectangle(l, w), [`${l} cm`, `${w} cm`, null, null])],
            `A rectangle drawn ${l} cm by ${w} cm.`,
            `画成 ${l} cm × ${w} cm 的长方形。`,
          ),
        };
      },
    },
    {
      id: "scale-factors-and-area",
      title: t("Scale factors, perimeter and area", "比例系数、周长与面积"),
      explanation: t(
        "If a shape is copied with scale factor $3$, every length triples. A perimeter of $14$ cm becomes $3 \\cdot 14 = 42$ cm, and an area of $10\\text{ cm}^2$ becomes $3^2 \\cdot 10 = 90\\text{ cm}^2$. With scale factor $\\frac{1}{2}$, the perimeter halves and the area becomes $\\frac{1}{4}$ of the original.",
        "若按比例系数 $3$ 复制一个图形，每个长度都变成 $3$ 倍。周长 $14$ cm 变成 $3 \\cdot 14 = 42$ cm，面积 $10\\text{ cm}^2$ 变成 $3^2 \\cdot 10 = 90\\text{ cm}^2$。比例系数为 $\\frac{1}{2}$ 时，周长减半，面积变为原来的 $\\frac{1}{4}$。",
      ),
      generate(rng) {
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
        return numberProblem({
          prompt: t(
            `A ${shape.en} has a perimeter of $${lenTex(perimeter, u)}$ and an area of $${lenTex(area, u, 2)}$. It is ${down ? "reduced" : "enlarged"} with scale factor $${kTex}$. What is the ${askArea ? "area" : "perimeter"} of the new ${shape.en}?`,
            `一个${shape["zh-CN"]}的周长是 $${lenTex(perimeter, u)}$，面积是 $${lenTex(area, u, 2)}$。按比例系数 $${kTex}$ 把它${down ? "缩小" : "放大"}。新${shape["zh-CN"]}的${askArea ? "面积" : "周长"}是多少？`,
          ),
          answer,
          unit: askArea ? `${u}^2` : u,
          wrong: askArea ? [k.mul(Q.of(area)), Q.of(area).div(k2)] : [k2.mul(Q.of(perimeter)), Q.of(perimeter).div(k)],
          solution: askArea
            ? t(
                `Each length is multiplied by $${kTex}$, so the length and the width of every part are multiplied by $${kTex}$ and the area by $\\left(${kTex}\\right)^2 = ${k2.toLatex()}$:${steps(`${k2.toLatex()} \\cdot ${area} = ${lenTex(answer, u, 2)}`)}`,
                `每个长度都乘 $${kTex}$，所以每一部分的长和宽都乘 $${kTex}$，面积乘 $\\left(${kTex}\\right)^2 = ${k2.toLatex()}$：${steps(`${k2.toLatex()} \\cdot ${area} = ${lenTex(answer, u, 2)}`)}`,
              )
            : t(
                `The perimeter is a length, so it is multiplied by the scale factor:${steps(`${kTex} \\cdot ${perimeter} = ${lenTex(answer, u)}`)}`,
                `周长是长度，所以乘比例系数：${steps(`${kTex} \\cdot ${perimeter} = ${lenTex(answer, u)}`)}`,
              ),
        });
      },
    },
    {
      id: "areas-on-scale-drawings",
      title: t("Areas on scale drawings", "比例图上的面积"),
      explanation: t(
        "At the scale $1\\text{ cm} : 4\\text{ m}$, a $1$ cm by $1$ cm square stands for a $4$ m by $4$ m square, so $1\\text{ cm}^2$ stands for $16\\text{ m}^2$. A park drawn with an area of $35\\text{ cm}^2$ has an actual area of $35 \\cdot 16 = 560\\text{ m}^2$. Going back, divide by $16$.",
        "比例尺为 $1\\text{ cm} : 4\\text{ m}$ 时，图上 $1$ cm × $1$ cm 的正方形代表 $4$ m × $4$ m 的正方形，所以 $1\\text{ cm}^2$ 代表 $16\\text{ m}^2$。图上面积为 $35\\text{ cm}^2$ 的公园，实际面积是 $35 \\cdot 16 = 560\\text{ m}^2$。反过来就除以 $16$。",
      ),
      generate(rng) {
        const k = rng.pick([2, 3, 4, 5, 6, 8, 10, 20]);
        const drawn = rng.int(6, 60);
        const actual = drawn * k * k;
        const place = rng.pick([t("park", "公园"), t("lake", "湖"), t("farm field", "农田"), t("campus", "校园")]);
        const toActual = rng.bool();
        const sq = steps(`1\\text{ cm}^2 \\to ${k} \\cdot ${k} = ${lenTex(k * k, "m", 2)}`);
        return numberProblem({
          prompt: toActual
            ? t(
                `On a plan with the scale $1\\text{ cm} : ${lenTex(k, "m")}$, a ${place.en} has an area of $${lenTex(drawn, "cm", 2)}$. What is its actual area?`,
                `在比例尺为 $1\\text{ cm} : ${lenTex(k, "m")}$ 的规划图上，一个${place["zh-CN"]}的面积是 $${lenTex(drawn, "cm", 2)}$。它的实际面积是多少？`,
              )
            : t(
                `A ${place.en} has an area of $${lenTex(actual, "m", 2)}$. What is its area on a plan with the scale $1\\text{ cm} : ${lenTex(k, "m")}$?`,
                `一个${place["zh-CN"]}的面积是 $${lenTex(actual, "m", 2)}$。在比例尺为 $1\\text{ cm} : ${lenTex(k, "m")}$ 的规划图上，它的面积是多少？`,
              ),
          answer: toActual ? actual : drawn,
          form: "integer",
          unit: toActual ? "m^2" : "cm^2",
          wrong: toActual ? [drawn * k, drawn * 2 * k] : [Q.of(actual, k), Q.of(actual, 2 * k)],
          solution: toActual
            ? t(
                `A square centimeter on the plan is a square $${k}$ m on each side:${sq}So the actual area is${steps(`${drawn} \\cdot ${k * k} = ${lenTex(actual, "m", 2)}`)}`,
                `图上 1 平方厘米代表边长 $${k}$ m 的正方形：${sq}所以实际面积是${steps(`${drawn} \\cdot ${k * k} = ${lenTex(actual, "m", 2)}`)}`,
              )
            : t(
                `A square centimeter on the plan is a square $${k}$ m on each side:${sq}So the area on the plan is${steps(`${actual} \\div ${k * k} = ${lenTex(drawn, "cm", 2)}`)}`,
                `图上 1 平方厘米代表边长 $${k}$ m 的正方形：${sq}所以图上面积是${steps(`${actual} \\div ${k * k} = ${lenTex(drawn, "cm", 2)}`)}`,
              ),
        });
      },
    },
  ],
);

// ---------------------------------------------------------------------------
// Circles

/** relatingTheCircumferenceAndAreaOfACircle goes between the circumference and the area through the radius. */
export const relatingTheCircumferenceAndAreaOfACircle = topic(
  "relating-the-circumference-and-area-of-a-circle",
  t("Relating the Circumference and Area of a Circle", "圆的周长与面积的关系"),
  t(
    "The circumference and the area of a circle both depend on its radius, so one gives the other: find the radius, then use the other formula. Cutting a circle into thin sectors and laying them side by side gives a near-parallelogram with base half the circumference and height the radius, so A = ½ · C · r.",
    "圆的周长和面积都由半径决定，所以知道一个就能求另一个：先求半径，再用另一个公式。把圆剪成许多细小的扇形并排拼起来，近似得到底为周长的一半、高为半径的平行四边形，所以 A = ½ · C · r。",
  ),
  ["areas-of-circles"],
  ["7.G.B.4"],
  [
    {
      id: "area-from-circumference",
      title: t("Area from the circumference", "由周长求面积"),
      explanation: t(
        "The radius links the circumference and the area of a circle. From the circumference, find the radius with $r = \\frac{C}{2\\pi}$, then use it in the area formula $A = \\pi r^2$.\n\nA circle has a circumference of $31.4$ cm. Using $3.14$ for $\\pi$:\n\n$$r = \\frac{C}{2\\pi} = \\frac{31.4}{6.28} = 5\\text{ cm}, \\qquad A = \\pi r^2 = 3.14 \\cdot 25 = 78.5\\text{ cm}^2.$$\n\nUse the radius, not the diameter, in $\\pi r^2$.",
        "半径把圆的周长和面积联系起来。由周长用 $r = \\frac{C}{2\\pi}$ 求出半径，再代入面积公式 $A = \\pi r^2$。\n\n一个圆的周长是 $31.4$ cm。取 $\\pi$ 为 $3.14$：\n\n$$r = \\frac{C}{2\\pi} = \\frac{31.4}{6.28} = 5\\text{ cm}, \\qquad A = \\pi r^2 = 3.14 \\cdot 25 = 78.5\\text{ cm}^2.$$\n\n$\\pi r^2$ 中用的是半径，不是直径。",
      ),
      generate(rng) {
        const r = rng.int(2, 15);
        const u = pickUnit(rng);
        const c = piQ.mul(Q.of(2 * r));
        const a = piQ.mul(Q.of(r * r));
        return numberProblem({
          prompt: t(
            `A circle has a circumference of $${lenTex(c, u)}$. Use $3.14$ for $\\pi$ to find its area.`,
            `一个圆的周长是 $${lenTex(c, u)}$。取 $\\pi$ 为 $3.14$，求它的面积。`,
          ),
          answer: a,
          unit: `${u}^2`,
          // Squaring the diameter, and multiplying the circumference by the radius.
          wrong: [piQ.mul(Q.of(4 * r * r)), c.mul(Q.of(r))],
          solution: t(
            `First find the radius from $C = 2\\pi r$:${steps(`r = ${num(c)} \\div 6.28 = ${lenTex(r, u)}`)}Then the area is${steps(`A = 3.14 \\cdot ${r}^2 = 3.14 \\cdot ${r * r} = ${lenTex(a, u, 2)}`)}`,
            `先由 $C = 2\\pi r$ 求半径：${steps(`r = ${num(c)} \\div 6.28 = ${lenTex(r, u)}`)}再求面积：${steps(`A = 3.14 \\cdot ${r}^2 = 3.14 \\cdot ${r * r} = ${lenTex(a, u, 2)}`)}`,
          ),
        });
      },
    },
    {
      id: "circumference-from-area",
      title: t("Circumference from the area", "由面积求周长"),
      explanation: t(
        "A circle has an area of $113.04\\text{ cm}^2$. Using $3.14$ for $\\pi$, $r^2 = 113.04 \\div 3.14 = 36$, so $r = 6$ cm, the number whose square is $36$. Then\n\n$$C = 2\\pi r = 2 \\cdot 3.14 \\cdot 6 = 37.68\\text{ cm}.$$",
        "一个圆的面积是 $113.04\\text{ cm}^2$。取 $\\pi$ 为 $3.14$，$r^2 = 113.04 \\div 3.14 = 36$，所以 $r = 6$ cm，即平方等于 $36$ 的数。于是\n\n$$C = 2\\pi r = 2 \\cdot 3.14 \\cdot 6 = 37.68\\text{ cm}.$$",
      ),
      generate(rng) {
        const r = rng.int(2, 15);
        const u = pickUnit(rng);
        const a = piQ.mul(Q.of(r * r));
        const c = piQ.mul(Q.of(2 * r));
        return numberProblem({
          prompt: t(
            `A circle has an area of $${lenTex(a, u, 2)}$. Use $3.14$ for $\\pi$ to find its circumference.`,
            `一个圆的面积是 $${lenTex(a, u, 2)}$。取 $\\pi$ 为 $3.14$，求它的周长。`,
          ),
          answer: c,
          unit: u,
          // Forgetting the 2 in 2πr, and dividing r² by 2 instead of taking its square root.
          wrong: [piQ.mul(Q.of(r)), piQ.mul(Q.of(r * r))],
          solution: t(
            `First find the radius from $A = \\pi r^2$:${steps(`r^2 = ${num(a)} \\div 3.14 = ${r * r}`, `r = ${lenTex(r, u)}`)}Then the circumference is${steps(`C = 2 \\cdot 3.14 \\cdot ${r} = ${lenTex(c, u)}`)}`,
            `先由 $A = \\pi r^2$ 求半径：${steps(`r^2 = ${num(a)} \\div 3.14 = ${r * r}`, `r = ${lenTex(r, u)}`)}再求周长：${steps(`C = 2 \\cdot 3.14 \\cdot ${r} = ${lenTex(c, u)}`)}`,
          ),
        });
      },
    },
    {
      id: "half-the-circumference-times-the-radius",
      title: t("Half the circumference times the radius", "周长的一半乘半径"),
      explanation: t(
        "Cut a circle into many thin, equal sectors and lay them side by side, pointing up and down in turn. The result is close to a parallelogram: its base is half the circumference, $\\pi r$, and its height is the radius $r$. So\n\n$$A = \\tfrac{1}{2} \\cdot C \\cdot r = \\pi r \\cdot r = \\pi r^2.$$\n\nThis also works with measured values: a round tabletop with circumference $220$ cm and radius $35$ cm has area about $\\frac{1}{2} \\cdot 220 \\cdot 35 = 3850\\text{ cm}^2$.",
        "把圆剪成许多相等的细小扇形，一个朝上、一个朝下地并排拼起来，得到的图形接近平行四边形：底是周长的一半 $\\pi r$，高是半径 $r$。所以\n\n$$A = \\tfrac{1}{2} \\cdot C \\cdot r = \\pi r \\cdot r = \\pi r^2.$$\n\n对测量值同样适用：周长 $220$ cm、半径 $35$ cm 的圆桌面，面积约为 $\\frac{1}{2} \\cdot 220 \\cdot 35 = 3850\\text{ cm}^2$。",
      ),
      generate(rng) {
        if (rng.bool()) {
          // Measured circles: the radius to the nearest tenth and the circumference to the nearest whole unit.
          const r = Q.of(rng.int(25, 400), 10);
          const c = Math.round((2 * Math.PI * Number(r.n)) / 10);
          const half = Q.of(c, 2);
          const a = half.mul(r);
          const thing = rng.pick([
            [t("round tabletop", "圆桌面"), "cm"],
            [t("circular rug", "圆形地毯"), "cm"],
            [t("round flower bed", "圆形花坛"), "m"],
          ] as const);
          return numberProblem({
            prompt: t(
              `A ${thing[0].en} has a measured circumference of $${lenTex(c, thing[1])}$ and a radius of $${lenTex(r, thing[1])}$. Use $A = \\tfrac{1}{2} \\cdot C \\cdot r$ to estimate its area.`,
              `测得一个${thing[0]["zh-CN"]}的周长是 $${lenTex(c, thing[1])}$，半径是 $${lenTex(r, thing[1])}$。用 $A = \\tfrac{1}{2} \\cdot C \\cdot r$ 估计它的面积。`,
            ),
            answer: a,
            unit: `${thing[1]}^2`,
            wrong: [r.mul(Q.of(c)), half.mul(r.mul(Q.of(2)))].filter((w) => !w.sub(a).isZero()),
            solution: t(
              `Half the circumference is $${num(c)} \\div 2 = ${num(half)}$. Multiply by the radius:${steps(`A \\approx ${num(half)} \\cdot ${num(r)} = ${lenTex(a, thing[1], 2)}`)}`,
              `周长的一半是 $${num(c)} \\div 2 = ${num(half)}$。再乘半径：${steps(`A \\approx ${num(half)} \\cdot ${num(r)} = ${lenTex(a, thing[1], 2)}`)}`,
            ),
          });
        }
        const r = rng.int(2, 30);
        const ratio = Q.of(r, 2);
        return numberProblem({
          prompt: t(
            `A circle has a radius of $${r}$ cm. Its area in square centimeters is how many times its circumference in centimeters?`,
            `一个圆的半径是 $${r}$ cm。它以平方厘米为单位的面积是以厘米为单位的周长的多少倍？`,
          ),
          answer: ratio,
          wrong: [Q.of(r), Q.of(2 * r), Q.of(2, r)].filter((w) => !w.sub(ratio).isZero()),
          solution: t(
            `Since $A = \\tfrac{1}{2} \\cdot C \\cdot r$, the area is $\\frac{r}{2}$ times the circumference:${steps(`\\frac{A}{C} = \\frac{\\pi \\cdot ${r}^2}{2\\pi \\cdot ${r}} = \\frac{${r}}{2} = ${ratio.isInteger() ? ratio.toLatex() : dec(ratio)}`)}`,
            `因为 $A = \\tfrac{1}{2} \\cdot C \\cdot r$，面积是周长的 $\\frac{r}{2}$ 倍：${steps(`\\frac{A}{C} = \\frac{\\pi \\cdot ${r}^2}{2\\pi \\cdot ${r}} = \\frac{${r}}{2} = ${ratio.isInteger() ? ratio.toLatex() : dec(ratio)}`)}`,
          ),
        });
      },
    },
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
export const compositeShapesWithCircles = topic(
  "composite-shapes-with-circles",
  t("Composite Shapes With Circles", "含圆的组合图形"),
  t(
    "Split a composite shape into rectangles, circles and parts of circles. Add or subtract their areas, and for the perimeter go around the outside only: a curved edge contributes part of a circumference, and an edge where two pieces meet does not count.",
    "把组合图形分成长方形、圆和圆的一部分。面积是各部分面积相加或相减；周长只沿外边走一圈：曲线边贡献圆周长的一部分，两部分相接的边不计入。",
  ),
  ["areas-of-circles", "composite-shapes"],
  ["7.G.B.4", "7.G.B.6"],
  [
    {
      id: "areas-with-semicircles",
      title: t("Areas with semicircles", "含半圆的面积"),
      explanation: t(
        "A $10$ cm by $6$ cm rectangle with a semicircle on one $6$ cm side: the semicircle has radius $3$ cm and area $\\frac{1}{2}\\pi \\cdot 3^2 = \\frac{9}{2}\\pi$. If it is added on, the area is $60 + \\frac{9}{2}\\pi\\text{ cm}^2$; if it is cut out, the area is $60 - \\frac{9}{2}\\pi\\text{ cm}^2$.",
        "$10$ cm × $6$ cm 的长方形，在一条 $6$ cm 的边上有一个半圆：半圆半径为 $3$ cm，面积为 $\\frac{1}{2}\\pi \\cdot 3^2 = \\frac{9}{2}\\pi$。加上半圆时面积是 $60 + \\frac{9}{2}\\pi\\text{ cm}^2$；挖去半圆时面积是 $60 - \\frac{9}{2}\\pi\\text{ cm}^2$。",
      ),
      generate(rng) {
        const r = rng.int(2, 7);
        const w = 2 * r;
        const l = rng.int(w, 20);
        const out = rng.bool();
        const u = pickUnit(rng);
        const half = Q.of(r * r, 2);
        const sign = out ? half : half.neg();
        return {
          ...piProblem({
            prompt: t(`Find the area of the shape.${PI_EN}`, `求这个图形的面积。${PI_ZH}`),
            answer: piSum(l * w, sign),
            unit: `${u}^2`,
            // A whole circle, the diameter used as the radius, and the semicircle left out.
            wrong: [piSum(l * w, out ? r * r : -r * r), piSum(l * w, out ? Q.of(w * w, 2) : Q.of(-w * w, 2)), String(l * w)],
            solution: t(
              `The rectangle has area $${l} \\cdot ${w} = ${l * w}$. The semicircle has diameter $${w}$, so its radius is $${r}$ and its area is${steps(`\\tfrac{1}{2}\\pi \\cdot ${r}^2 = ${piTex(half)}`)}${out ? "Add" : "Subtract"} it:${steps(`A = ${piSum(l * w, sign)}\\text{ ${u}}^2`)}`,
              `长方形的面积是 $${l} \\cdot ${w} = ${l * w}$。半圆的直径是 $${w}$，所以半径是 $${r}$，面积是${steps(`\\tfrac{1}{2}\\pi \\cdot ${r}^2 = ${piTex(half)}`)}${out ? "加上" : "减去"}它：${steps(`A = ${piSum(l * w, sign)}\\text{ ${u}}^2`)}`,
            ),
          }),
          figure: roundedFigure(l, w, out, u),
        };
      },
    },
    {
      id: "perimeters-with-semicircles",
      title: t("Perimeters with semicircles", "含半圆的周长"),
      explanation: t(
        "Go around the outside. For a $10$ cm by $6$ cm rectangle with a semicircle on a $6$ cm side, the edges are $10$, $6$ and $10$, plus the curve, half of a circle of diameter $6$: $\\frac{1}{2}\\pi \\cdot 6 = 3\\pi$. The perimeter is $26 + 3\\pi$ cm.\n\nThe $6$ cm side under the semicircle is no longer on the outside, so it does not count, whether the semicircle is added on or cut out.",
        "沿外边走一圈。$10$ cm × $6$ cm 的长方形在一条 $6$ cm 的边上有半圆，外边是 $10$、$6$、$10$，再加上曲线，即直径为 $6$ 的圆的一半：$\\frac{1}{2}\\pi \\cdot 6 = 3\\pi$。周长是 $26 + 3\\pi$ cm。\n\n半圆处的那条 $6$ cm 的边已不在外边上，所以无论半圆是加上还是挖去，它都不计入。",
      ),
      generate(rng) {
        const r = rng.int(2, 8);
        const w = 2 * r;
        const l = rng.int(w, 20);
        const out = rng.bool();
        const u = pickUnit(rng);
        const straight = 2 * l + w;
        return {
          ...piProblem({
            prompt: t(`Find the perimeter of the shape.${PI_EN}`, `求这个图形的周长。${PI_ZH}`),
            answer: piSum(straight, r),
            unit: u,
            // Counting the side under the curve, a whole circle, and the diameter used as the radius.
            wrong: [piSum(straight + w, r), piSum(straight, 2 * r), piSum(straight, w)],
            solution: t(
              `The straight edges on the outside are $${l}$, $${w}$ and $${l}$; the side under the semicircle is not on the outside. The curve is half a circle of diameter $${w}$:${steps(`\\tfrac{1}{2}\\pi \\cdot ${w} = ${piTex(r)}`)}So the perimeter is${steps(`${l} + ${w} + ${l} + ${piTex(r)} = ${piSum(straight, r)}\\text{ ${u}}`)}`,
              `外边上的直边是 $${l}$、$${w}$、$${l}$；半圆处的那条边不在外边上。曲线是直径为 $${w}$ 的圆的一半：${steps(`\\tfrac{1}{2}\\pi \\cdot ${w} = ${piTex(r)}`)}所以周长是${steps(`${l} + ${w} + ${l} + ${piTex(r)} = ${piSum(straight, r)}\\text{ ${u}}`)}`,
            ),
          }),
          figure: roundedFigure(l, w, out, u),
        };
      },
    },
    {
      id: "regions-around-circles",
      title: t("Regions around circles", "圆周围的区域"),
      explanation: t(
        "A circular pond of radius $3$ m sits in a square lawn $10$ m on each side. The grass covers the square minus the circle. Using $3.14$ for $\\pi$:\n\n$$10^2 - 3.14 \\cdot 3^2 = 100 - 28.26 = 71.74\\text{ m}^2.$$",
        "一个半径为 $3$ m 的圆形池塘位于边长 $10$ m 的正方形草坪中。草地面积是正方形减去圆。取 $\\pi$ 为 $3.14$：\n\n$$10^2 - 3.14 \\cdot 3^2 = 100 - 28.26 = 71.74\\text{ m}^2.$$",
      ),
      generate(rng) {
        const s = rng.int(6, 30);
        const r = rng.int(1, Math.floor(s / 2));
        const [outer, inner, unit] = rng.pick([
          [t("square lawn", "正方形草坪"), t("circular pond", "圆形池塘"), "m"],
          [t("square tablecloth", "正方形桌布"), t("round plate", "圆盘"), "cm"],
          [t("square tile", "正方形瓷砖"), t("circular hole", "圆孔"), "cm"],
        ] as const);
        const circle = piQ.mul(Q.of(r * r));
        const left = Q.of(s * s).sub(circle);
        return {
          ...numberProblem({
            prompt: t(
              `A ${inner.en} with a radius of $${lenTex(r, unit)}$ sits inside a ${outer.en} $${lenTex(s, unit)}$ on each side. Use $3.14$ for $\\pi$ to find the area of the ${outer.en} outside the ${inner.en}.`,
              `一个半径为 $${lenTex(r, unit)}$ 的${inner["zh-CN"]}位于边长 $${lenTex(s, unit)}$ 的${outer["zh-CN"]}内。取 $\\pi$ 为 $3.14$，求${outer["zh-CN"]}在${inner["zh-CN"]}之外部分的面积。`,
            ),
            answer: left,
            unit: `${unit}^2`,
            // Subtracting the circumference, and squaring the diameter.
            wrong: [Q.of(s * s).sub(piQ.mul(Q.of(2 * r))), Q.of(s * s).sub(piQ.mul(Q.of(4 * r * r))), circle].filter((w) => w.sign() > 0),
            solution: t(
              `Subtract the area of the circle from the area of the square:${steps(`${s}^2 - 3.14 \\cdot ${r}^2 = ${s * s} - ${num(circle)} = ${lenTex(left, unit, 2)}`)}`,
              `用正方形的面积减去圆的面积：${steps(`${s}^2 - 3.14 \\cdot ${r}^2 = ${s * s} - ${num(circle)} = ${lenTex(left, unit, 2)}`)}`,
            ),
          }),
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
        };
      },
    },
  ],
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
export const findingAreasAndPerimetersOfPartCircles = topic(
  "finding-areas-and-perimeters-of-part-circles",
  t("Finding Areas and Perimeters of Part-Circles", "求部分圆的面积和周长"),
  t(
    "A semicircle is half a circle and a quarter circle a quarter of one, so their areas are those fractions of πr². Their perimeters are that fraction of the circumference plus the straight edges: a diameter for a semicircle, and two radii for a quarter circle.",
    "半圆是圆的一半，四分之一圆是圆的四分之一，所以它们的面积是 πr² 的相应部分。它们的周长是圆周长的相应部分再加上直边：半圆加一条直径，四分之一圆加两条半径。",
  ),
  ["areas-of-circles"],
  ["7.G.B.4"],
  [
    {
      id: "areas-of-part-circles",
      title: t("Areas of part-circles", "部分圆的面积"),
      explanation: t(
        "A quarter circle of radius $6$ cm has area $\\frac{1}{4}\\pi \\cdot 6^2 = 9\\pi\\text{ cm}^2$. A semicircle of diameter $10$ cm has radius $5$ cm, so its area is $\\frac{1}{2}\\pi \\cdot 5^2 = \\frac{25}{2}\\pi\\text{ cm}^2$. Halve a diameter before squaring.",
        "半径为 $6$ cm 的四分之一圆面积是 $\\frac{1}{4}\\pi \\cdot 6^2 = 9\\pi\\text{ cm}^2$。直径为 $10$ cm 的半圆半径是 $5$ cm，面积是 $\\frac{1}{2}\\pi \\cdot 5^2 = \\frac{25}{2}\\pi\\text{ cm}^2$。先把直径减半，再平方。",
      ),
      generate(rng) {
        const p = rng.pick([semicircle, quarterCircle]);
        const r = rng.int(2, 14);
        const u = pickUnit(rng);
        const byDiameter = p === semicircle && rng.bool();
        const area = p.part.mul(Q.of(r * r));
        const given = byDiameter
          ? t(`a diameter of $${lenTex(2 * r, u)}$`, `直径为 $${lenTex(2 * r, u)}$`)
          : t(`a radius of $${lenTex(r, u)}$`, `半径为 $${lenTex(r, u)}$`);
        return {
          ...piProblem({
            prompt: t(
              `Find the area of a ${p.name.en} with ${given.en}.${PI_EN}`,
              `求${given["zh-CN"]}的${p.name["zh-CN"]}的面积。${PI_ZH}`,
            ),
            answer: piTex(area),
            unit: `${u}^2`,
            // The whole circle, the diameter squared, and the arc length instead.
            wrong: [piTex(r * r), piTex(p.part.mul(Q.of(4 * r * r))), piTex(p.part.mul(Q.of(2 * r)))],
            solution: t(
              `${byDiameter ? `The radius is half the diameter, $${r}$. ` : ""}The area is $${p.part.toLatex()}$ of the area of the whole circle:${steps(`${p.part.toLatex()} \\cdot \\pi \\cdot ${r}^2 = ${piTex(area)}\\text{ ${u}}^2`)}`,
              `${byDiameter ? `半径是直径的一半，为 $${r}$。` : ""}面积是整圆面积的 $${p.part.toLatex()}$：${steps(`${p.part.toLatex()} \\cdot \\pi \\cdot ${r}^2 = ${piTex(area)}\\text{ ${u}}^2`)}`,
            ),
          }),
          figure: byDiameter ? partFigure(p, 5, `${2 * r} ${u}`, true) : partFigure(p, 5, `${r} ${u}`),
        };
      },
    },
    {
      id: "perimeters-of-part-circles",
      title: t("Perimeters of part-circles", "部分圆的周长"),
      explanation: t(
        "The perimeter of a part-circle is its arc plus its straight edges. A semicircle of radius $5$ has arc $\\frac{1}{2} \\cdot 2\\pi \\cdot 5 = 5\\pi$ and a diameter $10$, so its perimeter is $10 + 5\\pi$. A quarter circle of radius $8$ has arc $\\frac{1}{4} \\cdot 2\\pi \\cdot 8 = 4\\pi$ and two radii, so its perimeter is $16 + 4\\pi$.",
        "部分圆的周长是弧长加直边。半径为 $5$ 的半圆，弧长是 $\\frac{1}{2} \\cdot 2\\pi \\cdot 5 = 5\\pi$，直径是 $10$，所以周长是 $10 + 5\\pi$。半径为 $8$ 的四分之一圆，弧长是 $\\frac{1}{4} \\cdot 2\\pi \\cdot 8 = 4\\pi$，加上两条半径，周长是 $16 + 4\\pi$。",
      ),
      generate(rng) {
        const p = rng.pick([semicircle, quarterCircle]);
        const r = rng.int(2, 15);
        const u = pickUnit(rng);
        const arc = p.part.mul(Q.of(2 * r));
        return {
          ...piProblem({
            prompt: t(`Find the perimeter of the ${p.name.en}.${PI_EN}`, `求这个${p.name["zh-CN"]}的周长。${PI_ZH}`),
            answer: piSum(2 * r, arc),
            unit: u,
            // The arc alone, one radius left out, and the area formula.
            wrong: [piTex(arc), piSum(r, arc), piTex(p.part.mul(Q.of(r * r)))],
            solution: t(
              `The arc is $${p.part.toLatex()}$ of the circumference:${steps(`${p.part.toLatex()} \\cdot 2\\pi \\cdot ${r} = ${piTex(arc)}`)}The straight edges are ${p === semicircle ? `a diameter, $${2 * r}$` : `two radii, $${r} + ${r} = ${2 * r}$`}. So the perimeter is${steps(`${piSum(2 * r, arc)}\\text{ ${u}}`)}`,
              `弧长是圆周长的 $${p.part.toLatex()}$：${steps(`${p.part.toLatex()} \\cdot 2\\pi \\cdot ${r} = ${piTex(arc)}`)}直边是${p === semicircle ? `一条直径 $${2 * r}$` : `两条半径 $${r} + ${r} = ${2 * r}$`}。所以周长是${steps(`${piSum(2 * r, arc)}\\text{ ${u}}`)}`,
            ),
          }),
          figure: partFigure(p, 5, `${r} ${u}`),
        };
      },
    },
    {
      id: "part-circles-with-approximations",
      title: t("Part-circles with 3.14", "用 3.14 计算部分圆"),
      explanation: t(
        "With $3.14$ for $\\pi$, a three-quarter circle of radius $4$ cm has\n\n$$\\text{area } \\tfrac{3}{4} \\cdot 3.14 \\cdot 4^2 = 37.68\\text{ cm}^2, \\qquad \\text{perimeter } \\tfrac{3}{4} \\cdot 2 \\cdot 3.14 \\cdot 4 + 4 + 4 = 26.84\\text{ cm}.$$\n\nThe two radii are part of the perimeter: they are the straight edges of the cut.",
        "取 $\\pi$ 为 $3.14$，半径为 $4$ cm 的四分之三圆\n\n$$\\text{面积为 } \\tfrac{3}{4} \\cdot 3.14 \\cdot 4^2 = 37.68\\text{ cm}^2, \\qquad \\text{周长为 } \\tfrac{3}{4} \\cdot 2 \\cdot 3.14 \\cdot 4 + 4 + 4 = 26.84\\text{ cm}.$$\n\n两条半径也是周长的一部分：它们是切口处的直边。",
      ),
      generate(rng) {
        const p = rng.pick([semicircle, quarterCircle, threeQuarterCircle]);
        const r = rng.int(2, 12) * (p === threeQuarterCircle ? 1 : 2);
        const u = pickUnit(rng);
        const askArea = rng.bool();
        const area = p.part.mul(piQ).mul(Q.of(r * r));
        const arc = p.part.mul(piQ).mul(Q.of(2 * r));
        const perimeter = arc.add(Q.of(2 * r));
        return {
          ...numberProblem({
            prompt: t(
              `Use $3.14$ for $\\pi$ to find the ${askArea ? "area" : "perimeter"} of the ${p.name.en}.`,
              `取 $\\pi$ 为 $3.14$，求这个${p.name["zh-CN"]}的${askArea ? "面积" : "周长"}。`,
            ),
            answer: askArea ? area : perimeter,
            unit: askArea ? `${u}^2` : u,
            wrong: askArea ? [piQ.mul(Q.of(r * r)), arc] : [arc, arc.add(Q.of(r))],
            solution: askArea
              ? t(
                  `The area is $${p.part.toLatex()}$ of the circle's:${steps(`${p.part.toLatex()} \\cdot 3.14 \\cdot ${r}^2 = ${lenTex(area, u, 2)}`)}`,
                  `面积是整圆面积的 $${p.part.toLatex()}$：${steps(`${p.part.toLatex()} \\cdot 3.14 \\cdot ${r}^2 = ${lenTex(area, u, 2)}`)}`,
                )
              : t(
                  `The arc is $${p.part.toLatex()}$ of the circumference, and the straight edges add up to $${2 * r}$:${steps(`${p.part.toLatex()} \\cdot 2 \\cdot 3.14 \\cdot ${r} = ${num(arc)}`, `${num(arc)} + ${2 * r} = ${lenTex(perimeter, u)}`)}`,
                  `弧长是圆周长的 $${p.part.toLatex()}$，直边之和是 $${2 * r}$：${steps(`${p.part.toLatex()} \\cdot 2 \\cdot 3.14 \\cdot ${r} = ${num(arc)}`, `${num(arc)} + ${2 * r} = ${lenTex(perimeter, u)}`)}`,
                ),
          }),
          figure: partFigure(p, 5, `${r} ${u}`),
        };
      },
    },
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
export const volumesOfTriangularPrisms = topic(
  "volumes-of-triangular-prisms",
  t("Volumes of Triangular Prisms", "三棱柱的体积"),
  t(
    "The volume of any prism is the area of its base times its length: V = B · l. For a triangular prism the base is a triangle, so V = ½ · b · h · l, where b and h are the base and height of the triangle.",
    "任何棱柱的体积都等于底面积乘长度：V = B · l。三棱柱的底面是三角形，所以 V = ½ · b · h · l，其中 b、h 是三角形的底和高。",
  ),
  ["volumes-of-rectangular-solids", "areas-of-triangles"],
  ["7.G.B.6"],
  [
    {
      id: "volume-of-a-triangular-prism",
      title: t("Volume of a triangular prism", "三棱柱的体积"),
      explanation: t(
        "A prism whose triangular face has base $6$ cm and height $4$ cm, and which is $10$ cm long, has\n\n$$V = \\tfrac{1}{2} \\cdot 6 \\cdot 4 \\cdot 10 = 120\\text{ cm}^3.$$\n\nUse the height of the triangle, which is perpendicular to its base, not a slanted side.",
        "一个三棱柱的三角形面底为 $6$ cm、高为 $4$ cm，棱柱长 $10$ cm，体积为\n\n$$V = \\tfrac{1}{2} \\cdot 6 \\cdot 4 \\cdot 10 = 120\\text{ cm}^3.$$\n\n要用三角形的高（与底垂直），不要用斜边。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const right = rng.bool();
        const [b, h, c] = right ? rng.pick(triples) : [rng.int(4, 14), rng.int(3, 12), 0];
        const l = rng.int(3, 20);
        const v = Q.of(b * h * l, 2);
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
        return {
          ...numberProblem({
            prompt: t("Find the volume of the triangular prism.", "求这个三棱柱的体积。"),
            answer: v,
            unit: `${u}^3`,
            // Forgetting the half, the pyramid formula, and a slanted side used as the height.
            wrong: [Q.of(b * h * l), Q.of(b * h * l, 6), ...(right ? [Q.of(b * c * l, 2)] : [])],
            solution: t(
              `The base of the prism is the triangle, with base $${b}$ and height $${h}$:${steps(`B = \\tfrac{1}{2} \\cdot ${b} \\cdot ${h} = ${num(Q.of(b * h, 2))}`, `V = B \\cdot l = ${num(Q.of(b * h, 2))} \\cdot ${l} = ${lenTex(v, u, 3)}`)}`,
              `棱柱的底面是三角形，底为 $${b}$，高为 $${h}$：${steps(`B = \\tfrac{1}{2} \\cdot ${b} \\cdot ${h} = ${num(Q.of(b * h, 2))}`, `V = B \\cdot l = ${num(Q.of(b * h, 2))} \\cdot ${l} = ${lenTex(v, u, 3)}`)}`,
            ),
          }),
          figure: fig(
            prismFigure(b, a, h, l, labels, right ? null : `${h} ${u}`),
            `A triangular prism ${l} ${u} long. Its triangular face has base ${b} ${u} and height ${h} ${u}${right ? `, with a right angle and a slanted side of ${c} ${u}` : ""}.`,
            `长 ${l} ${u} 的三棱柱。三角形面的底为 ${b} ${u}，高为 ${h} ${u}${right ? `，有一个直角，斜边为 ${c} ${u}` : ""}。`,
          ),
        };
      },
    },
    {
      id: "missing-dimensions-from-volume",
      title: t("Missing dimensions from the volume", "由体积求未知尺寸"),
      explanation: t(
        "If a triangular prism has volume $180\\text{ cm}^3$ and its triangle has base $8$ cm and height $5$ cm, the base area is $\\frac{1}{2} \\cdot 8 \\cdot 5 = 20\\text{ cm}^2$, so the length is $180 \\div 20 = 9$ cm. If instead the length and the triangle's base are known, divide the volume by the length to get the base area, then solve $\\frac{1}{2} \\cdot b \\cdot h = B$.",
        "若三棱柱的体积是 $180\\text{ cm}^3$，三角形的底为 $8$ cm、高为 $5$ cm，则底面积是 $\\frac{1}{2} \\cdot 8 \\cdot 5 = 20\\text{ cm}^2$，长度是 $180 \\div 20 = 9$ cm。若已知长度和三角形的底，先用体积除以长度得到底面积，再解 $\\frac{1}{2} \\cdot b \\cdot h = B$。",
      ),
      generate(rng) {
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
        return {
          ...numberProblem({
            prompt: askLength
              ? t(
                  `A triangular prism has a volume of $${lenTex(v, u, 3)}$. Its triangular face has a base of $${lenTex(b, u)}$ and a height of $${lenTex(h, u)}$. How long is the prism?`,
                  `一个三棱柱的体积是 $${lenTex(v, u, 3)}$，三角形面的底为 $${lenTex(b, u)}$，高为 $${lenTex(h, u)}$。这个棱柱有多长？`,
                )
              : t(
                  `A triangular prism has a volume of $${lenTex(v, u, 3)}$ and a length of $${lenTex(l, u)}$. Its triangular face has a base of $${lenTex(b, u)}$. What is the height of the triangle?`,
                  `一个三棱柱的体积是 $${lenTex(v, u, 3)}$，长 $${lenTex(l, u)}$，三角形面的底为 $${lenTex(b, u)}$。三角形的高是多少？`,
                ),
            answer: askLength ? l : h,
            form: "integer",
            unit: u,
            // Forgetting the half of the triangle's area.
            wrong: askLength ? [Q.of(v, b * h), v - area] : [Q.of(v, b * l), Q.of(2 * v, l)],
            solution: askLength
              ? t(
                  `The base area is $\\tfrac{1}{2} \\cdot ${b} \\cdot ${h} = ${area}$. Since $V = B \\cdot l$:${steps(`l = ${v} \\div ${area} = ${lenTex(l, u)}`)}`,
                  `底面积是 $\\tfrac{1}{2} \\cdot ${b} \\cdot ${h} = ${area}$。因为 $V = B \\cdot l$：${steps(`l = ${v} \\div ${area} = ${lenTex(l, u)}`)}`,
                )
              : t(
                  `The base area is the volume divided by the length, $${v} \\div ${l} = ${area}$. Then solve for the height:${steps(`\\tfrac{1}{2} \\cdot ${b} \\cdot h = ${area}`, `${num(Q.of(b, 2))}h = ${area}`, `h = ${lenTex(h, u)}`)}`,
                  `底面积等于体积除以长度，$${v} \\div ${l} = ${area}$。再求高：${steps(`\\tfrac{1}{2} \\cdot ${b} \\cdot h = ${area}`, `${num(Q.of(b, 2))}h = ${area}`, `h = ${lenTex(h, u)}`)}`,
                ),
          }),
          figure: fig(
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
          ),
        };
      },
    },
  ],
);

/** surfaceAreasOfTriangularPrisms adds the two triangles and the three rectangles of a triangular prism. */
export const surfaceAreasOfTriangularPrisms = topic(
  "surface-areas-of-triangular-prisms",
  t("Surface Areas of Triangular Prisms", "三棱柱的表面积"),
  t(
    "A triangular prism has five faces: two congruent triangles and three rectangles. The rectangles are as long as the prism and as wide as the three sides of the triangle, so together they make a rectangle whose width is the perimeter of the triangle.",
    "三棱柱有五个面：两个全等的三角形和三个长方形。三个长方形的长都等于棱柱的长，宽分别等于三角形的三条边，所以合起来是一个宽为三角形周长的长方形。",
  ),
  ["surface-areas-of-rectangular-solids", "areas-of-triangles"],
  ["7.G.B.6"],
  [
    {
      id: "surface-area-of-a-right-triangular-prism",
      title: t("Surface area of a right triangular prism", "直角三棱柱的表面积"),
      explanation: t(
        "For a prism $10$ cm long on a right triangle with legs $3$ and $4$ cm and slanted side $5$ cm:\n\n- the two triangles: $2 \\cdot \\tfrac{1}{2} \\cdot 3 \\cdot 4 = 12$;\n- the three rectangles: $(3 + 4 + 5) \\cdot 10 = 120$.\n\nThe surface area is $12 + 120 = 132\\text{ cm}^2$.",
        "棱柱长 $10$ cm，底面是两条直角边为 $3$ cm、$4$ cm、斜边为 $5$ cm 的直角三角形：\n\n- 两个三角形：$2 \\cdot \\tfrac{1}{2} \\cdot 3 \\cdot 4 = 12$；\n- 三个长方形：$(3 + 4 + 5) \\cdot 10 = 120$。\n\n表面积是 $12 + 120 = 132\\text{ cm}^2$。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const [b, h, c] = rng.pick(triples);
        const l = rng.int(3, 20);
        const triangles = b * h;
        const lateral = (b + h + c) * l;
        return {
          ...numberProblem({
            prompt: t("Find the surface area of the triangular prism.", "求这个三棱柱的表面积。"),
            answer: triangles + lateral,
            form: "integer",
            unit: `${u}^2`,
            // One triangle only, triangles without the half, and the rectangles only.
            wrong: [triangles / 2 + lateral, 2 * triangles + lateral, lateral],
            solution: t(
              `Add the two triangles and the three rectangles:${steps(`2 \\cdot \\tfrac{1}{2} \\cdot ${b} \\cdot ${h} = ${triangles}`, `(${b} + ${h} + ${c}) \\cdot ${l} = ${lateral}`, `${triangles} + ${lateral} = ${lenTex(triangles + lateral, u, 2)}`)}`,
              `把两个三角形和三个长方形的面积相加：${steps(`2 \\cdot \\tfrac{1}{2} \\cdot ${b} \\cdot ${h} = ${triangles}`, `(${b} + ${h} + ${c}) \\cdot ${l} = ${lateral}`, `${triangles} + ${lateral} = ${lenTex(triangles + lateral, u, 2)}`)}`,
            ),
          }),
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
        };
      },
    },
    {
      id: "tents-and-roofs",
      title: t("Tents and roofs", "帐篷与屋顶"),
      explanation: t(
        "A tent is a prism on an isosceles triangle. If the triangle has base $6$ ft, height $4$ ft and slanted sides $5$ ft, and the tent is $8$ ft long, then the fabric for the two ends and the two slanted sides is\n\n$$2 \\cdot \\tfrac{1}{2} \\cdot 6 \\cdot 4 + 2 \\cdot 5 \\cdot 8 = 24 + 80 = 104\\text{ ft}^2.$$\n\nA floor adds $6 \\cdot 8 = 48\\text{ ft}^2$. The roof rectangles are as wide as the slanted sides, not the height.",
        "帐篷是底面为等腰三角形的棱柱。若三角形底为 $6$ ft、高为 $4$ ft、两腰为 $5$ ft，帐篷长 $8$ ft，则两端和两个斜面所需的布料是\n\n$$2 \\cdot \\tfrac{1}{2} \\cdot 6 \\cdot 4 + 2 \\cdot 5 \\cdot 8 = 24 + 80 = 104\\text{ ft}^2.$$\n\n加上底面还要 $6 \\cdot 8 = 48\\text{ ft}^2$。斜面长方形的宽是腰长，不是高。",
      ),
      generate(rng) {
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
        return {
          ...numberProblem({
            prompt: t(
              `A tent is shaped like a triangular prism $${lenTex(l, u)}$ long. Each end is a triangle with a base of $${lenTex(2 * p, u)}$, a height of $${lenTex(q, u)}$ and slanted sides of $${lenTex(s, u)}$. How much fabric covers the tent ${floor ? "including" : "not including"} the floor?`,
              `一顶帐篷是长 $${lenTex(l, u)}$ 的三棱柱形。每一端是底为 $${lenTex(2 * p, u)}$、高为 $${lenTex(q, u)}$、两腰为 $${lenTex(s, u)}$ 的三角形。${floor ? "包括" : "不包括"}底面在内，这顶帐篷需要多少布料？`,
            ),
            answer: total,
            form: "integer",
            unit: `${u}^2`,
            // The floor handled the wrong way, the height used for the roof, and only one end.
            wrong: [
              floor ? ends + roof : ends + roof + bottom,
              ends + 2 * q * l + (floor ? bottom : 0),
              ends / 2 + roof + (floor ? bottom : 0),
            ],
            solution: t(
              `Add the faces of the tent:${steps(`\\text{two ends: } 2 \\cdot \\tfrac{1}{2} \\cdot ${2 * p} \\cdot ${q} = ${ends}`, `\\text{two slanted sides: } 2 \\cdot ${s} \\cdot ${l} = ${roof}`, ...(floor ? [`\\text{floor: } ${2 * p} \\cdot ${l} = ${bottom}`] : []))}The total is $${floor ? `${ends} + ${roof} + ${bottom}` : `${ends} + ${roof}`} = ${lenTex(total, u, 2)}$.`,
              `把帐篷各面的面积相加：${steps(`\\text{两端：} 2 \\cdot \\tfrac{1}{2} \\cdot ${2 * p} \\cdot ${q} = ${ends}`, `\\text{两个斜面：} 2 \\cdot ${s} \\cdot ${l} = ${roof}`, ...(floor ? [`\\text{底面：} ${2 * p} \\cdot ${l} = ${bottom}`] : []))}总面积是 $${floor ? `${ends} + ${roof} + ${bottom}` : `${ends} + ${roof}`} = ${lenTex(total, u, 2)}$。`,
            ),
          }),
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
        };
      },
    },
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

/** surfaceAreasOfCombinedRectangularPrisms finds the surface area of one box standing on another. */
export const surfaceAreasOfCombinedRectangularPrisms = topic(
  "surface-areas-of-combined-rectangular-prisms",
  t("Surface Areas of Combined Rectangular Prisms", "组合长方体的表面积"),
  t(
    "When a box stands on another, the face where they touch is hidden twice: once on top of the bottom box and once under the top box. So the surface area of the combined solid is the sum of the two surface areas minus twice the area of contact.",
    "一个长方体放在另一个上面时，两者接触的面被遮住了两次：一次在下面长方体的顶面上，一次在上面长方体的底面上。所以组合体的表面积等于两个表面积之和减去接触面积的两倍。",
  ),
  ["surface-areas-of-rectangular-solids"],
  ["7.G.B.6"],
  [
    {
      id: "boxes-on-boxes",
      title: t("Boxes on boxes", "叠放的长方体"),
      explanation: t(
        "A $4 \\times 3 \\times 2$ box stands on a $10 \\times 6 \\times 5$ box. Their surface areas are $2(12 + 8 + 6) = 52$ and $2(60 + 50 + 30) = 280$. The contact area is $4 \\cdot 3 = 12$, hidden on both boxes, so the combined surface area is\n\n$$52 + 280 - 2 \\cdot 12 = 308.$$",
        "一个 $4 \\times 3 \\times 2$ 的长方体放在一个 $10 \\times 6 \\times 5$ 的长方体上。它们的表面积分别是 $2(12 + 8 + 6) = 52$ 和 $2(60 + 50 + 30) = 280$。接触面积是 $4 \\cdot 3 = 12$，在两个长方体上都被遮住，所以组合体的表面积是\n\n$$52 + 280 - 2 \\cdot 12 = 308.$$",
      ),
      generate(rng) {
        const big: Box = [rng.int(6, 14), rng.int(4, 10), rng.int(2, 8)];
        const small: Box = [rng.int(2, big[0] - 2), rng.int(2, big[1] - 1), rng.int(2, 8)];
        const u = pickUnit(rng);
        const [a1, a2] = [boxArea(big), boxArea(small)];
        const contact = small[0] * small[1];
        const total = a1 + a2 - 2 * contact;
        return {
          ...numberProblem({
            prompt: t(
              "A box stands on top of a larger box. Find the surface area of the combined solid.",
              "一个长方体放在一个较大的长方体上。求组合体的表面积。",
            ),
            answer: total,
            form: "integer",
            unit: `${u}^2`,
            // Not removing the contact area, or removing it only once.
            wrong: [a1 + a2, a1 + a2 - contact],
            solution: t(
              `Find both surface areas, then take away the contact area twice, once from each box:${steps(`2(${big[0]} \\cdot ${big[1]} + ${big[0]} \\cdot ${big[2]} + ${big[1]} \\cdot ${big[2]}) = ${a1}`, `2(${small[0]} \\cdot ${small[1]} + ${small[0]} \\cdot ${small[2]} + ${small[1]} \\cdot ${small[2]}) = ${a2}`, `${a1} + ${a2} - 2 \\cdot ${small[0]} \\cdot ${small[1]} = ${lenTex(total, u, 2)}`)}`,
              `求出两个表面积，再减去两次接触面积（每个长方体各一次）：${steps(`2(${big[0]} \\cdot ${big[1]} + ${big[0]} \\cdot ${big[2]} + ${big[1]} \\cdot ${big[2]}) = ${a1}`, `2(${small[0]} \\cdot ${small[1]} + ${small[0]} \\cdot ${small[2]} + ${small[1]} \\cdot ${small[2]}) = ${a2}`, `${a1} + ${a2} - 2 \\cdot ${small[0]} \\cdot ${small[1]} = ${lenTex(total, u, 2)}`)}`,
            ),
          }),
          figure: fig(
            stackedBoxes([big[0], big[1], big[2]], [small[0], small[1], small[2]], u),
            `A box ${small[0]} by ${small[1]} by ${small[2]} ${u} standing on a box ${big[0]} by ${big[1]} by ${big[2]} ${u}.`,
            `一个 ${small[0]} × ${small[1]} × ${small[2]} ${u} 的长方体放在 ${big[0]} × ${big[1]} × ${big[2]} ${u} 的长方体上。`,
          ),
        };
      },
    },
    {
      id: "painting-combined-prisms",
      title: t("Painting combined prisms", "给组合体刷漆"),
      explanation: t(
        "If the combined solid sits on the floor, its bottom face is not painted either. For a $4 \\times 3 \\times 2$ box on a $10 \\times 6 \\times 5$ box, the painted area is\n\n$$52 + 280 - 2 \\cdot 12 - 10 \\cdot 6 = 248.$$\n\nSubtract the contact area twice and the bottom once.",
        "若组合体放在地面上，底面也不刷漆。对于放在 $10 \\times 6 \\times 5$ 的长方体上的 $4 \\times 3 \\times 2$ 的长方体，刷漆的面积是\n\n$$52 + 280 - 2 \\cdot 12 - 10 \\cdot 6 = 248.$$\n\n接触面积减两次，底面减一次。",
      ),
      generate(rng) {
        const big: Box = [rng.int(6, 14), rng.int(4, 10), rng.int(2, 8)];
        const small: Box = [rng.int(2, big[0] - 2), rng.int(2, big[1] - 1), rng.int(2, 8)];
        const [a1, a2] = [boxArea(big), boxArea(small)];
        const contact = small[0] * small[1];
        const floor = big[0] * big[1];
        const total = a1 + a2 - 2 * contact - floor;
        const [thing, thingZh] = rng.pick([
          ["A two-tier cake stands on a table. Only its outside is covered with icing", "一个两层蛋糕放在桌上，只有外表面抹奶油"],
          ["A wooden podium stands on the floor and is painted on every visible face", "一个木制领奖台放在地上，所有露在外面的面都要刷漆"],
          [
            "A building and its tower stand on the ground; the outside walls and roofs are painted",
            "一座楼和楼顶的塔楼建在地面上，外墙和屋顶都要刷漆",
          ],
        ] as const);
        return {
          ...numberProblem({
            prompt: t(
              `${thing}. The bottom part is $${big[0]} \\times ${big[1]} \\times ${big[2]}$ and the top part, standing on it, is $${small[0]} \\times ${small[1]} \\times ${small[2]}$, all in feet. What area is covered?`,
              `${thingZh}。下层是 $${big[0]} \\times ${big[1]} \\times ${big[2]}$，放在上面的上层是 $${small[0]} \\times ${small[1]} \\times ${small[2]}$，单位都是英尺。需要覆盖的面积是多少？`,
            ),
            answer: total,
            form: "integer",
            unit: "ft^2",
            // Covering the bottom, and removing the contact area once.
            wrong: [total + floor, total + contact],
            solution: t(
              `Add the two surface areas, take away the contact area twice and the bottom once:${steps(`${a1} + ${a2} - 2 \\cdot ${contact} - ${big[0]} \\cdot ${big[1]} = ${lenTex(total, "ft", 2)}`)}`,
              `把两个表面积相加，减去两次接触面积，再减去一次底面：${steps(`${a1} + ${a2} - 2 \\cdot ${contact} - ${big[0]} \\cdot ${big[1]} = ${lenTex(total, "ft", 2)}`)}`,
            ),
          }),
          figure: fig(
            stackedBoxes([big[0], big[1], big[2]], [small[0], small[1], small[2]], "ft"),
            `A block ${small[0]} by ${small[1]} by ${small[2]} ft standing on a block ${big[0]} by ${big[1]} by ${big[2]} ft.`,
            `一个 ${small[0]} × ${small[1]} × ${small[2]} ft 的长方体放在 ${big[0]} × ${big[1]} × ${big[2]} ft 的长方体上。`,
          ),
        };
      },
    },
  ],
);

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

/** crossSectionsOfThreeDimensionalShapes names and measures the shapes made by slicing solids with planes. */
export const crossSectionsOfThreeDimensionalShapes = topic(
  "cross-sections-of-three-dimensional-shapes",
  t("Cross-Sections of Three-Dimensional Shapes", "立体图形的截面"),
  t(
    "A cross-section is the flat shape made by slicing a solid with a plane. Slicing a prism or a cylinder parallel to its base gives a copy of the base; slicing a pyramid or a cone through its top point and perpendicular to the base gives a triangle; every slice of a sphere is a circle.",
    "截面是用一个平面切开立体图形时得到的平面图形。平行于底面切棱柱或圆柱，得到与底面相同的图形；垂直于底面并经过顶点切棱锥或圆锥，得到三角形；球的每个截面都是圆。",
  ),
  ["identifying-three-dimensional-shapes", "areas-of-triangles", "areas-of-circles"],
  ["7.G.A.3"],
  [
    {
      id: "naming-cross-sections",
      title: t("Naming cross-sections", "说出截面的形状"),
      explanation: t(
        "Imagine where the plane meets each face. A cylinder sliced parallel to its base gives a circle; sliced straight down through its center, it gives a rectangle as tall as the cylinder and as wide as its diameter. A square pyramid sliced parallel to its base gives a smaller square; sliced straight down through its top point, it gives a triangle.",
        "想象平面与每个面相交的地方。平行于底面切圆柱，得到圆；竖直经过中心切下去，得到一个高等于圆柱的高、宽等于直径的长方形。平行于底面切正四棱锥，得到一个较小的正方形；竖直经过顶点切下去，得到三角形。",
      ),
      generate(rng) {
        const [l, w] = [rng.int(5, 12), rng.int(2, 4)];
        const long = t(`a rectangular prism ${l} cm long, ${w} cm wide and ${w} cm high`, `长 ${l} cm、宽 ${w} cm、高 ${w} cm 的长方体`);
        const s = rng.pick([
          ...sections,
          { solid: long, cut: t(`parallel to its ${w} cm by ${w} cm end`, `平行于 ${w} cm × ${w} cm 的端面`), shape: "square" },
          { solid: long, cut: t(`parallel to its ${l} cm by ${w} cm bottom`, `平行于 ${l} cm × ${w} cm 的底面`), shape: "rectangle" },
        ] satisfies Section[]);
        const wrong = (Object.keys(shapeNames) as Section["shape"][]).filter((k) => k !== s.shape).map((k) => shapeNames[k]);
        // A cut parallel to a face or a base has the same shape as that face or base.
        const plain = {
          circle: t("circle", "圆"),
          square: t("square", "正方形"),
          rectangle: t("rectangle", "长方形"),
          triangle: t("triangle", "三角形"),
        }[s.shape];
        const parallelWhy = t(
          `The plane is parallel to a face or base that is a ${plain.en}, so the cut is a ${plain.en} too${s.shape === "rectangle" ? ", and its sides are not all equal" : ""}.`,
          `平面平行于一个${plain["zh-CN"]}的面或底面，所以截面也是${plain["zh-CN"]}${s.shape === "rectangle" ? "，而且四条边不都相等" : ""}。`,
        );
        return pickChoice(
          rng,
          t(
            `What shape is the cross-section when ${s.solid.en} is sliced ${s.cut.en}?`,
            `用平面${s.cut["zh-CN"]}切开${s.solid["zh-CN"]}，截面是什么形状？`,
          ),
          shapeNames[s.shape],
          wrong,
          s.why ?? parallelWhy,
        );
      },
    },
    {
      id: "areas-of-cross-sections",
      title: t("Areas of cross-sections", "截面的面积"),
      explanation: t(
        "Find the shape of the cross-section, then its dimensions from the solid. A $10 \\times 4 \\times 6$ cm prism sliced parallel to its $10 \\times 4$ base gives a $10 \\times 4$ rectangle, area $40\\text{ cm}^2$. A cylinder of radius $3$ cm and height $8$ cm sliced through its center perpendicular to its base gives a $6 \\times 8$ rectangle, area $48\\text{ cm}^2$, because its width is the diameter.",
        "先确定截面的形状，再从立体图形中找出它的尺寸。$10 \\times 4 \\times 6$ cm 的长方体平行于 $10 \\times 4$ 的底面切开，截面是 $10 \\times 4$ 的长方形，面积 $40\\text{ cm}^2$。半径 $3$ cm、高 $8$ cm 的圆柱经过中心垂直于底面切开，截面是 $6 \\times 8$ 的长方形，面积 $48\\text{ cm}^2$，因为它的宽是直径。",
      ),
      generate(rng) {
        const u = pickUnit(rng);
        const kind = rng.pick(["prism", "cylinder", "pyramid", "disk"] as const);
        if (kind === "prism") {
          const [l, w, h] = [rng.int(5, 15), rng.int(2, 9), rng.int(3, 12)];
          const base = rng.bool();
          const area = base ? l * w : l * h;
          return numberProblem({
            prompt: t(
              `A rectangular prism is $${lenTex(l, u)}$ long, $${lenTex(w, u)}$ wide and $${lenTex(h, u)}$ high. It is sliced ${base ? "parallel to its base" : "parallel to its front face, which is as long and as high as the prism"}. What is the area of the cross-section?`,
              `一个长方体长 $${lenTex(l, u)}$、宽 $${lenTex(w, u)}$、高 $${lenTex(h, u)}$。用平面${base ? "平行于底面" : "平行于前面（与棱柱等长、等高）"}切开。截面的面积是多少？`,
            ),
            answer: area,
            form: "integer",
            unit: `${u}^2`,
            wrong: [base ? l * h : l * w, w * h, l * w * h].filter((v) => v !== area),
            solution: t(
              `The cross-section is a copy of the ${base ? "base" : "front face"}, which measures $${l} \\times ${base ? w : h}$:${steps(`${l} \\cdot ${base ? w : h} = ${lenTex(area, u, 2)}`)}`,
              `截面与${base ? "底面" : "前面"}相同，是 $${l} \\times ${base ? w : h}$ 的长方形：${steps(`${l} \\cdot ${base ? w : h} = ${lenTex(area, u, 2)}`)}`,
            ),
          });
        }
        if (kind === "cylinder") {
          const [r, h] = [rng.int(2, 9), rng.int(3, 15)];
          return numberProblem({
            prompt: t(
              `A cylinder has a radius of $${lenTex(r, u)}$ and a height of $${lenTex(h, u)}$. It is sliced perpendicular to its base, through the center of the base. What is the area of the cross-section?`,
              `一个圆柱的半径是 $${lenTex(r, u)}$，高是 $${lenTex(h, u)}$。用平面垂直于底面、经过底面圆心切开。截面的面积是多少？`,
            ),
            answer: 2 * r * h,
            form: "integer",
            unit: `${u}^2`,
            // The radius used as the width.
            wrong: [r * h, piQ.mul(Q.of(r * r))],
            solution: t(
              `The cross-section is a rectangle as tall as the cylinder and as wide as its diameter, $2 \\cdot ${r} = ${2 * r}$:${steps(`${2 * r} \\cdot ${h} = ${lenTex(2 * r * h, u, 2)}`)}`,
              `截面是长方形，高等于圆柱的高，宽等于直径 $2 \\cdot ${r} = ${2 * r}$：${steps(`${2 * r} \\cdot ${h} = ${lenTex(2 * r * h, u, 2)}`)}`,
            ),
          });
        }
        if (kind === "pyramid") {
          let s: number;
          let h: number;
          do {
            s = rng.int(4, 16);
            h = rng.int(3, 15);
          } while ((s * h) % 2 !== 0);
          return numberProblem({
            prompt: t(
              `A square pyramid has a base $${lenTex(s, u)}$ on each side and a height of $${lenTex(h, u)}$. It is sliced through its top point, perpendicular to its base and parallel to one side of the base. What is the area of the cross-section?`,
              `一个正四棱锥的底面边长是 $${lenTex(s, u)}$，高是 $${lenTex(h, u)}$。用平面经过顶点、垂直于底面且平行于底面的一条边切开。截面的面积是多少？`,
            ),
            answer: (s * h) / 2,
            form: "integer",
            unit: `${u}^2`,
            wrong: [s * h, s * s],
            solution: t(
              `The cross-section is a triangle with the width of the base, $${s}$, and the height of the pyramid, $${h}$:${steps(`\\tfrac{1}{2} \\cdot ${s} \\cdot ${h} = ${lenTex((s * h) / 2, u, 2)}`)}`,
              `截面是三角形，底等于底面的边长 $${s}$，高等于棱锥的高 $${h}$：${steps(`\\tfrac{1}{2} \\cdot ${s} \\cdot ${h} = ${lenTex((s * h) / 2, u, 2)}`)}`,
            ),
          });
        }
        const [r, h] = [rng.int(2, 12), rng.int(3, 15)];
        const area = piQ.mul(Q.of(r * r));
        return numberProblem({
          prompt: t(
            `A cylinder has a radius of $${lenTex(r, u)}$ and a height of $${lenTex(h, u)}$. It is sliced parallel to its base. Use $3.14$ for $\\pi$ to find the area of the cross-section.`,
            `一个圆柱的半径是 $${lenTex(r, u)}$，高是 $${lenTex(h, u)}$。用平面平行于底面切开。取 $\\pi$ 为 $3.14$，求截面的面积。`,
          ),
          answer: area,
          unit: `${u}^2`,
          // The circumference instead of the area, and the height multiplied in.
          wrong: [piQ.mul(Q.of(2 * r)), area.mul(Q.of(h))],
          solution: t(
            `The cross-section is a copy of the circular base, whatever the height of the cylinder:${steps(`3.14 \\cdot ${r}^2 = ${lenTex(area, u, 2)}`)}`,
            `无论圆柱多高，截面都与圆形底面相同：${steps(`3.14 \\cdot ${r}^2 = ${lenTex(area, u, 2)}`)}`,
          ),
        });
      },
    },
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
