// Knowledge points of Probability and Statistics that ask the learner to read a drawing: density curves, shaded normal
// areas, scatter plots and histograms. See `deeperFiguresProbabilityCalculusPoints` and `deeperFiguresProbabilityCollegePoints`.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, Point } from "@ga/subject-math";
import { Q } from "@ga/subject-math";

import { ask, choose, type Pair, point, same } from "../university-kit.ts";
import { bars, chart, curvePath, intTicks, normal, shadeUnder, tenthTicks } from "./figure-charts.ts";
import { drawn, label } from "./figure-reading-more.ts";

const densityHeight = point(
  "the-height-that-makes-a-density",
  ["The height that makes a density", "使密度成立的高度"],
  [
    "A probability density must enclose a total area of one. So when a graph has a single unknown height $k$, the area under the drawn shape gives an equation for it. A rectangle has area base times height, a triangle has half of that, and a trapezoid has the average of its parallel sides times its height.",
    "概率密度围成的总面积必须为一。所以当图只有一个未知高度 $k$ 时，所画形状下的面积给出它的方程。矩形面积是底乘高，三角形是它的一半，梯形是两条平行边的平均乘以高。",
  ],
  (rng) => {
    const a = rng.int(0, 3);
    const width = rng.int(2, 6);
    const b = a + width;
    const shape = rng.pick(width >= 3 ? (["rectangle", "triangle", "trapezoid"] as const) : (["rectangle", "triangle"] as const));
    const area = shape === "rectangle" ? Q.of(width, 1) : shape === "triangle" ? Q.of(width, 2) : Q.of(width - 1, 1);
    const k = Q.one.div(area);
    const peak = shape === "triangle" ? a + rng.int(0, width) : a;
    const pts: Point[] =
      shape === "rectangle"
        ? [
            [a, 0],
            [a, 1],
            [b, 1],
            [b, 0],
          ]
        : shape === "triangle"
          ? [
              [a, 0],
              [peak, 1],
              [b, 0],
            ]
          : [
              [a, 0],
              [a + 1, 1],
              [b - 1, 1],
              [b, 0],
            ];
    const name: Pair =
      shape === "rectangle" ? ["a rectangle", "矩形"] : shape === "triangle" ? ["a triangle", "三角形"] : ["a trapezoid", "梯形"];
    const svg = chart(
      [0, 10],
      [0, 1.3],
      intTicks(0, 10),
      [[1, "k"]],
      (x, y) =>
        `<polygon class="accent" stroke="currentColor" fill-opacity="0.2" fill="currentColor" points="${pts.map(([u, v]) => `${x(u)},${y(v)}`).join(" ")}"/>`,
    );
    return ask(
      [
        "The graph shows the density of a random variable, which is zero outside the shape drawn. What is the height $k$?",
        "图中是某随机变量的密度，在所画形状之外为零。高度 $k$ 是多少？",
      ],
      k,
      [
        Q.of(1, width + 1),
        Q.of(2, width + (shape === "triangle" ? 1 : 0)),
        Q.of(1, 1).eq(k) ? Q.of(1, 3) : Q.of(1, 1),
        Q.of(width, 2).eq(k) ? Q.of(3, 1) : Q.of(width, 2),
      ],
      [
        `The shape is ${name[0]} with base $${width}$. Its area, written in terms of $k$, must equal one, which gives $k = ${k.toLatex()}$.`,
        `这个形状是底为 $${width}$ 的${name[1]}。用 $k$ 表示的面积必须等于一，于是 $k = ${k.toLatex()}$。`,
      ],
      {
        svg,
        alt: t(
          `A density shaped as ${name[0]} on the interval from ${a} to ${b}, with height k.`,
          `从 ${a} 到 ${b} 的区间上形状为${name[1]}的密度，高度为 k。`,
        ),
      },
    );
  },
);

/** tenths splits ten tenths of probability over several unit intervals. */
function tenths(rng: Rng, n: number): number[] {
  const out = Array.from({ length: n }, () => 1);
  for (let i = 0; i < 10 - n; i++) {
    const j = rng.int(0, n - 1);
    out[j] = (out[j] as number) + 1;
  }
  return out;
}

const shadedStepProbability = point(
  "a-probability-shaded-under-a-step-density",
  ["A probability shaded under a step density", "阶梯密度下阴影表示的概率"],
  [
    "For a continuous random variable, the probability of an interval is the area under the density over that interval. When the density is a set of steps, this area is a sum of rectangles, each with its height read from the vertical axis. The height alone is not a probability, so it must be multiplied by the width.",
    "对连续随机变量，一个区间的概率是密度在该区间上的面积。当密度是一些阶梯时，这个面积是若干矩形之和，每个矩形的高度从纵轴读出。高度本身不是概率，必须乘以宽度。",
  ],
  (rng) => {
    const n = rng.int(3, 6);
    const w = tenths(rng, n);
    const cuts = Array.from({ length: n + 1 }, (_, i) => i);
    const heights = w.map((v) => v / 10);
    const c = rng.int(0, n - 1);
    const d = rng.int(c + 1, n);
    const parts = w.slice(c, d);
    const sum = parts.reduce((a, b) => a + b, 0);
    const P = Q.of(sum, 10);
    const other = 10 - sum;
    const top = Math.max(...heights);
    const svg = chart([0, 7], [0, Math.ceil(top * 10 + 1) / 10], intTicks(0, 7), tenthTicks(0, Math.ceil(top * 10 + 1)), (x, y) => {
      let shade = "";
      for (let i = c; i < d; i++)
        shade += `<rect class="accent" fill="currentColor" fill-opacity="0.3" stroke="none" x="${x(i)}" y="${y(heights[i] as number)}" width="${x(1) - x(0)}" height="${y(0) - y(heights[i] as number)}"/>`;
      return shade + bars(cuts, heights, x, y);
    });
    return ask(
      ["The graph shows a step density. What is the probability of the shaded event?", "图中是一个阶梯密度。阴影事件的概率是多少？"],
      P,
      [
        Q.of(other === sum ? other + 1 : other, 10),
        Q.of(Math.max(...parts), 10).eq(P) ? P.add(Q.of(1, 10)) : Q.of(Math.max(...parts), 10),
        Q.of(sum, 5).eq(P) ? Q.of(1, 5) : Q.of(sum, 5),
      ],
      [
        `Each shaded rectangle has width $1$, so the shaded area is the sum of the heights, in tenths: $${parts.join(" + ")}$ tenths, which is $${P.toLatex()}$.`,
        `每个阴影矩形宽度为 $1$，所以阴影面积是高度之和，以十分之一为单位：$${parts.join(" + ")}$，即 $${P.toLatex()}$。`,
      ],
      {
        svg,
        alt: t(
          `A step density with heights ${heights.join(", ")} on unit intervals from 0, shaded from ${c} to ${d}.`,
          `从 0 开始的单位区间上的阶梯密度，高度为 ${heights.join("，")}，从 ${c} 到 ${d} 有阴影。`,
        ),
      },
    );
  },
);

const zTable: readonly (readonly [string, number])[] = [
  ["0.5", 0.6915],
  ["0.75", 0.7734],
  ["1", 0.8413],
  ["1.25", 0.8944],
  ["1.5", 0.9332],
  ["1.645", 0.95],
  ["1.96", 0.975],
  ["2", 0.9772],
  ["2.33", 0.9901],
];

/** fourPlaces writes a probability with four decimal places. */
const fourPlaces = (v: number) => v.toFixed(4);

type ShadeKind = "left" | "right" | "between" | "negLeft" | "negRight" | "outside";

/** normalArea asks for a shaded area of the standard normal, given one value of its distribution function. */
function normalArea(rng: Rng, kinds: readonly ShadeKind[]) {
  const [zText, phi] = rng.pick(zTable);
  const z = Number(zText);
  const kind = rng.pick(kinds);
  const f = normal(0, 1);
  const value = { left: phi, right: 1 - phi, between: 2 * phi - 1, negLeft: 1 - phi, negRight: phi, outside: 2 - 2 * phi }[kind];
  const candidates = [phi, 1 - phi, 2 * phi - 1, 2 - 2 * phi, phi / 2].map(fourPlaces);
  const right = fourPlaces(value);
  const wrong = [...new Set(candidates)].filter((c) => c !== right);
  const why: Pair =
    kind === "left"
      ? [
          `The shaded area is everything to the left of $${zText}$, which is the given value`,
          `阴影是 $${zText}$ 左边的全部，也就是给定的值`,
        ]
      : kind === "right"
        ? [
            `The shaded area is everything to the right of $${zText}$, which is one minus the given value`,
            `阴影是 $${zText}$ 右边的全部，等于一减给定的值`,
          ]
        : kind === "between"
          ? ["The shaded area is the middle part, which is the whole minus two equal tails", "阴影是中间部分，等于全部减去两个相等的尾部"]
          : kind === "negLeft"
            ? [
                `By symmetry, the tail to the left of $-${zText}$ equals the tail to the right of $${zText}$, which is one minus the given value`,
                `由对称性，$-${zText}$ 左边的尾部等于 $${zText}$ 右边的尾部，即一减给定的值`,
              ]
            : kind === "negRight"
              ? [
                  `By symmetry, the area to the right of $-${zText}$ equals the area to the left of $${zText}$, which is the given value`,
                  `由对称性，$-${zText}$ 右边的面积等于 $${zText}$ 左边的面积，即给定的值`,
                ]
              : [
                  "The shaded area is two equal tails, each of which is one minus the given value",
                  "阴影是两个相等的尾部，每个都等于一减给定的值",
                ];
  const svg = chart(
    [-3.5, 3.5],
    [0, 0.45],
    [
      [0, "0"],
      [z, zText],
      [-z, `−${zText}`],
    ],
    [],
    (x, y) => {
      const shade =
        kind === "left"
          ? shadeUnder(f, -3.5, z, x, y)
          : kind === "right"
            ? shadeUnder(f, z, 3.5, x, y)
            : kind === "between"
              ? shadeUnder(f, -z, z, x, y)
              : kind === "negLeft"
                ? shadeUnder(f, -3.5, -z, x, y)
                : kind === "negRight"
                  ? shadeUnder(f, -z, 3.5, x, y)
                  : shadeUnder(f, -3.5, -z, x, y) + shadeUnder(f, z, 3.5, x, y);
      return shade + curvePath(f, -3.5, 3.5, x, y);
    },
  );
  return choose(
    rng,
    [
      `The curve is the standard normal density, and $\\Phi(${zText}) = ${fourPlaces(phi)}$. What is the shaded area?`,
      `曲线是标准正态密度，$\\Phi(${zText}) = ${fourPlaces(phi)}$。阴影面积是多少？`,
    ],
    same(right),
    rng.shuffle(wrong).map((c) => same(c)),
    [`${why[0]}, so the area is $${right}$.`, `${why[1]}，所以面积是 $${right}$。`],
    {
      svg,
      alt: t(
        `A standard normal curve with ticks at plus and minus ${zText}. ${{ left: `Everything to the left of ${zText} is shaded`, right: `Everything to the right of ${zText} is shaded`, between: `The part between −${zText} and ${zText} is shaded`, negLeft: `Everything to the left of −${zText} is shaded`, negRight: `Everything to the right of −${zText} is shaded`, outside: `The two tails beyond −${zText} and ${zText} are shaded` }[kind]}.`,
        `标准正态曲线，在正负 ${zText} 处有刻度。${{ left: `${zText} 左边全部涂色`, right: `${zText} 右边全部涂色`, between: `−${zText} 与 ${zText} 之间涂色`, negLeft: `−${zText} 左边全部涂色`, negRight: `−${zText} 右边全部涂色`, outside: `−${zText} 和 ${zText} 外侧的两条尾部涂色` }[kind]}。`,
      ),
    },
  );
}

const standardArea = point(
  "a-shaded-area-under-the-standard-normal",
  ["A shaded area under the standard normal", "标准正态曲线下的阴影面积"],
  [
    "The distribution function $\\Phi(z)$ gives the area under the standard normal curve to the left of $z$. Any other area comes from this one. The area to the right of $z$ is one minus $\\Phi(z)$, and the middle area between $-z$ and $z$ is the whole area minus two tails of equal size.",
    "分布函数 $\\Phi(z)$ 给出标准正态曲线在 $z$ 左边的面积。其他面积都由它得到。$z$ 右边的面积是一减 $\\Phi(z)$，$-z$ 与 $z$ 之间的中间面积是全部面积减去两个相等的尾部。",
  ],
  (rng) => normalArea(rng, ["left", "right", "between"]),
);

const symmetricArea = point(
  "a-shaded-tail-by-symmetry",
  ["A shaded tail by symmetry", "由对称性求阴影尾部"],
  [
    "The standard normal curve is a mirror image in the vertical axis, so areas on the negative side equal areas on the positive side. A table lists $\\Phi(z)$ only for positive values, so a shaded region on the left must be turned into the matching region on the right, and then read through the table or the given value.",
    "标准正态曲线关于纵轴镜像对称，所以负的一侧的面积等于正的一侧相应的面积。表只列出正值的 $\\Phi(z)$，所以左边的阴影必须转换成右边相应的区域，再通过表或给定的值读出。",
  ],
  (rng) => normalArea(rng, ["negLeft", "negRight", "outside"]),
);

const compareCurves = point(
  "comparing-two-drawn-normal-curves",
  ["Comparing two drawn normal curves", "比较图中的两条正态曲线"],
  [
    "The mean of a normal distribution is where its curve peaks, and its standard deviation is how wide the curve is. A taller curve is always narrower, because the total area is one. So a comparison of two curves separates into two readings: which peak lies further to the right, and which curve is more spread out.",
    "正态分布的均值是曲线的峰所在之处，标准差是曲线的宽度。较高的曲线总是较窄，因为总面积是一。所以比较两条曲线分成两个读数：哪个峰更靠右，哪条曲线更分散。",
  ],
  (rng) => {
    const [m1, m2] = rng.sample([-3, -2, -1, 0, 1, 2, 3], 2) as [number, number];
    const [s1, s2] = rng.sample([0.5, 0.8, 1, 1.5, 2], 2) as [number, number];
    const option = (mean: boolean, sd: boolean): Pair => [
      `$A$ has the ${mean ? "larger" : "smaller"} mean and the ${sd ? "larger" : "smaller"} standard deviation`,
      `$A$ 的均值${mean ? "较大" : "较小"}，标准差${sd ? "较大" : "较小"}`,
    ];
    const [a, b] = [normal(m1, s1), normal(m2, s2)];
    const svg = chart(
      [-6, 6],
      [0, 0.9],
      intTicks(-6, 6, 2),
      [],
      (x, y) =>
        curvePath(a, -6, 6, x, y) +
        curvePath(b, -6, 6, x, y, 'stroke-dasharray="5 4"') +
        label(x(m1), y(a(m1)) - 6, "A") +
        label(x(m2), y(b(m2)) - 6, "B"),
    );
    return choose(
      rng,
      [
        "The two curves are normal densities, labeled at their peaks. How do they compare?",
        "这两条曲线是正态密度，标记在各自的峰上。它们如何比较？",
      ],
      option(m1 > m2, s1 > s2),
      [option(m1 < m2, s1 > s2), option(m1 > m2, s1 < s2), option(m1 < m2, s1 < s2)],
      [
        `The peak of $A$ is at $${m1}$ and that of $B$ is at $${m2}$, so the means compare that way. The curve of $${s1 > s2 ? "A" : "B"}$ is lower and wider, so it has the larger standard deviation.`,
        `$A$ 的峰在 $${m1}$，$B$ 的峰在 $${m2}$，均值由此比较。$${s1 > s2 ? "A" : "B"}$ 的曲线更低更宽，所以标准差更大。`,
      ],
      {
        svg,
        alt: t(
          `Two normal curves: A with mean ${m1} and spread ${s1}, and a dashed B with mean ${m2} and spread ${s2}.`,
          `两条正态曲线：A 的均值 ${m1}、分散度 ${s1}，虚线 B 的均值 ${m2}、分散度 ${s2}。`,
        ),
      },
    );
  },
);

const varianceFromInflection = point(
  "mean-and-variance-from-inflection-points",
  ["Mean and variance from inflection points", "由拐点读均值和方差"],
  [
    "A normal curve changes its bending at exactly one standard deviation on each side of its mean. So the two inflection points are symmetric about the mean, and half the distance between them is the standard deviation. The variance is the square of this value, which is easy to forget when reading the answer off a picture.",
    "正态曲线恰好在均值两侧各一个标准差处改变弯曲方向。所以两个拐点关于均值对称，它们之间距离的一半就是标准差。方差是这个值的平方，从图上读答案时很容易忘记。",
  ],
  (rng) => {
    const mu = rng.int(2, 8);
    const sigma = rng.int(1, 3);
    const askMean = rng.bool();
    const f = normal(mu, sigma);
    const [lo, hi] = [mu - sigma, mu + sigma];
    const svg = chart(
      [mu - 4 * sigma, mu + 4 * sigma],
      [0, 1.2 * f(mu)],
      [
        [lo, String(lo).replace("-", "−")],
        [hi, String(hi)],
      ],
      [],
      (x, y) =>
        curvePath(f, mu - 4 * sigma, mu + 4 * sigma, x, y) +
        `<circle cx="${x(lo)}" cy="${y(f(lo))}" r="4" fill="currentColor"/><circle cx="${x(hi)}" cy="${y(f(hi))}" r="4" fill="currentColor"/><line stroke-dasharray="4 3" x1="${x(lo)}" y1="${y(f(lo))}" x2="${x(lo)}" y2="${y(0)}"/><line stroke-dasharray="4 3" x1="${x(hi)}" y1="${y(f(hi))}" x2="${x(hi)}" y2="${y(0)}"/>`,
    );
    return ask(
      askMean
        ? ["The dots mark the inflection points of a normal density. What is its mean?", "这些点标出某正态密度的拐点。它的均值是多少？"]
        : [
            "The dots mark the inflection points of a normal density. What is its variance?",
            "这些点标出某正态密度的拐点。它的方差是多少？",
          ],
      askMean ? mu : sigma * sigma,
      askMean ? [lo, hi, sigma] : [sigma === 1 ? 2 : sigma, 2 * sigma === sigma * sigma ? 3 * sigma : 2 * sigma, mu],
      askMean
        ? [
            `The inflection points are at $${lo}$ and $${hi}$, and the mean lies halfway between them, at $${mu}$.`,
            `拐点在 $${lo}$ 和 $${hi}$，均值在它们正中间，即 $${mu}$。`,
          ]
        : [
            `The inflection points are at $${lo}$ and $${hi}$, so half their distance gives $\\sigma = ${sigma}$, and the variance is $\\sigma^2 = ${sigma * sigma}$.`,
            `拐点在 $${lo}$ 和 $${hi}$，距离的一半给出 $\\sigma = ${sigma}$，方差是 $\\sigma^2 = ${sigma * sigma}$。`,
          ],
      { svg, alt: t(`A normal curve with inflection points at ${lo} and ${hi}.`, `拐点在 ${lo} 和 ${hi} 的正态曲线。`) },
    );
  },
);

const zFromCurve = point(
  "a-z-score-read-from-a-curve",
  ["A z-score read from a curve", "由曲线读 z 分数"],
  [
    "A z-score counts how many standard deviations a value lies above or below the mean. On a normal curve, the mean is at the peak and the standard deviation is the distance from the peak to an inflection point. A value on the left of the peak has a negative z-score, however far along the axis it may be.",
    "z 分数表示一个值比均值高或低多少个标准差。在正态曲线上，均值在峰处，标准差是峰到拐点的距离。峰左边的值 z 分数为负，不管它在轴上的什么位置。",
  ],
  (rng) => {
    const mu = rng.int(3, 9) * 10;
    const sigma = rng.pick([4, 6, 8, 10, 12, 20]);
    const steps = rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
    const value = mu + (steps * sigma) / 2;
    const f = normal(mu, sigma);
    const z = Q.of(steps, 2);
    const svg = chart(
      [mu - 3.2 * sigma, mu + 3.2 * sigma],
      [0, 1.2 * f(mu)],
      [
        [mu, String(mu)],
        [mu + sigma, String(mu + sigma)],
        [value, String(value)],
      ].filter(([v], i, all) => all.findIndex(([u]) => u === v) === i) as [number, string][],
      [],
      (x, y) =>
        curvePath(f, mu - 3.2 * sigma, mu + 3.2 * sigma, x, y) +
        `<circle cx="${x(mu + sigma)}" cy="${y(f(mu + sigma))}" r="4" fill="currentColor"/><line stroke-dasharray="4 3" x1="${x(mu)}" y1="${y(f(mu))}" x2="${x(mu)}" y2="${y(0)}"/><circle class="accent" cx="${x(value)}" cy="${y(0)}" r="5" fill="currentColor"/>`,
    );
    return ask(
      [
        "The curve is a normal density, with a dot at the inflection point on the right and a dashed line at the mean. What is the z-score of the value marked on the axis?",
        "曲线是正态密度，点标出右边的拐点，虚线标出均值。轴上所标值的 z 分数是多少？",
      ],
      z,
      [z.neg(), Q.of(value, sigma), Q.of(steps, 1).eq(z) ? z.add(Q.of(1, 2)) : Q.of(steps, 1)],
      [
        `The mean is $${mu}$ and the inflection point is at $${mu + sigma}$, so $\\sigma = ${sigma}$. The marked value is $${value}$, and $(${value} - ${mu}) / ${sigma} = ${z.toLatex()}$.`,
        `均值是 $${mu}$，拐点在 $${mu + sigma}$，所以 $\\sigma = ${sigma}$。所标的值是 $${value}$，$(${value} - ${mu}) / ${sigma} = ${z.toLatex()}$。`,
      ],
      {
        svg,
        alt: t(
          `A normal curve with mean ${mu}, inflection point at ${mu + sigma} and a marked value at ${value}.`,
          `正态曲线，均值 ${mu}，拐点在 ${mu + sigma}，所标值在 ${value}。`,
        ),
      },
    );
  },
);

const lineEquation = point(
  "the-equation-of-a-drawn-regression-line",
  ["The equation of a drawn regression line", "图中回归线的方程"],
  [
    "A regression line summarizes a scatter plot. To read its equation, find the intercept where it meets the vertical axis and the slope from two clear points on the line itself. The individual data points do not lie on the line, so they should not be used to compute the slope, and the sign of the slope shows the trend.",
    "回归线概括散点图。要读它的方程，就找它与纵轴的交点得到截距，再用直线上两个清楚的点求斜率。各数据点不在直线上，所以不应该用它们计算斜率，斜率的符号显示趋势。",
  ],
  (rng) => {
    const b = rng.int(-2, 6);
    const [num, den] = rng.pick<Point>([
      [1, 1],
      [1, 2],
      [2, 1],
      [3, 2],
      [-1, 1],
      [-1, 2],
      [-2, 1],
      [-3, 2],
    ]);
    const m = Q.of(num, den);
    const eq = (slope: Q, intercept: number) => {
      const s = slope.eq(Q.one) ? "" : slope.eq(Q.one.neg()) ? "-" : slope.toLatex();
      return `\\hat{y} = ${s}x${intercept === 0 ? "" : intercept < 0 ? ` - ${-intercept}` : ` + ${intercept}`}`;
    };
    const f = (x: number) => (num * x) / den + b;
    const xs = [1, 2, 3, 4, 5, 6, 7];
    const marks: PlaneMark[] = [{ kind: "curve", f, from: 0, to: 8, accent: true }];
    for (const x of xs) marks.push({ kind: "point", at: [x, f(x) + rng.pick([-1, -0.5, 0.5, 1])] });
    const ys = xs.map(f);
    const top = Math.max(b, ...ys) + 2;
    const bottom = Math.min(b, ...ys) - 2;
    return choose(
      rng,
      ["Which equation describes the line fitted through the scatter plot?", "哪个方程描述拟合散点图的直线？"],
      same(eq(m, b)),
      [
        same(eq(m.neg(), b)),
        same(eq(m, b + 2)),
        same(eq(Q.of(den, Math.abs(num)).mul(Q.of(Math.sign(num), 1)), b)),
        same(eq(m, -b === b ? b - 2 : -b)),
        same(eq(m.neg(), b + 2)),
      ],
      [
        `The line meets the vertical axis at $${b}$, and it changes by $${num}$ for every $${den}$ across. So its slope is $${m.toLatex()}$, which gives $${eq(m, b)}$.`,
        `直线与纵轴交于 $${b}$，每向右 $${den}$ 变化 $${num}$。所以斜率是 $${m.toLatex()}$，得 $${eq(m, b)}$。`,
      ],
      drawn(
        { xMin: -1, xMax: 9, yMin: Math.floor(bottom), yMax: Math.ceil(top), xName: "x", yName: "y" },
        marks,
        t(
          `Scattered points around a line through (0, ${b}) and (${den}, ${b + num}).`,
          `散布在一条直线周围的点，直线过 (0, ${b}) 和 (${den}, ${b + num})。`,
        ),
      ),
    );
  },
);

const residualPattern = point(
  "what-a-residual-plot-shows",
  ["What a residual plot shows", "残差图显示什么"],
  [
    "A residual plot shows what the fitted line missed. Residuals scattered evenly around zero support the linear model. A curved band means that the relationship is not linear, and a band that fans out means that the spread changes with $x$. So the shape of the plot checks the model, even when the line itself looks reasonable.",
    "残差图显示拟合直线遗漏的东西。残差均匀地散布在零附近，支持线性模型。弯曲的带状说明关系不是线性的，呈扇形散开说明分散程度随 $x$ 变化。所以即使直线本身看起来合理，图的形状也能检验模型。",
  ],
  (rng) => {
    const kind = rng.pick(["random", "curve", "fan"] as const);
    const flip = rng.sign();
    const noise = () => rng.int(-10, 10) / 10;
    const marks: PlaneMark[] = [{ kind: "segment", a: [0, 0], b: [10, 0], dashed: true }];
    for (let i = 0; i < 16; i++) {
      const x = 0.4 + (i * 9.2) / 15;
      const y =
        kind === "random"
          ? 2 * noise()
          : kind === "curve"
            ? flip * (0.17 * (x - 5) ** 2 - 1.6) + 0.5 * noise()
            : (x / 2.5) * rng.sign() * (0.5 + 0.5 * Math.abs(noise()));
      marks.push({ kind: "point", at: [Math.round(x * 100) / 100, Math.round(y * 100) / 100], accent: true });
    }
    const names: Record<string, Pair> = {
      random: ["The linear model looks suitable", "线性模型看起来合适"],
      curve: ["The relationship is not linear", "关系不是线性的"],
      fan: ["The spread of the residuals changes with $x$", "残差的分散程度随 $x$ 变化"],
      big: ["The slope of the line must be zero", "直线的斜率必须为零"],
    };
    const why: Pair =
      kind === "random"
        ? ["The residuals scatter evenly around zero with no pattern", "残差均匀地散布在零附近，没有规律"]
        : kind === "curve"
          ? ["The residuals form a curved band instead of an even scatter", "残差构成弯曲的带状，而不是均匀的散布"]
          : ["The band of residuals gets wider as $x$ grows", "残差的带随 $x$ 增大而变宽"];
    return choose(
      rng,
      [
        "The plot shows the residuals of a fitted line against $x$. What does it suggest?",
        "图中是拟合直线的残差对 $x$ 的图。它说明了什么？",
      ],
      names[kind] as Pair,
      Object.keys(names)
        .filter((n) => n !== kind)
        .map((n) => names[n] as Pair),
      [
        `${why[0]}, so ${(names[kind] as Pair)[0].charAt(0).toLowerCase()}${(names[kind] as Pair)[0].slice(1)}.`,
        `${why[1]}，所以${(names[kind] as Pair)[1]}。`,
      ],
      drawn(
        { xMin: -1, xMax: 11, yMin: -5, yMax: 5, xName: "x" },
        marks,
        t(
          `A plot of 16 residuals against x, with a dashed line at zero. ${{ random: "The points scatter on both sides of the line", curve: flip > 0 ? "The points are high at both ends and low in the middle" : "The points are low at both ends and high in the middle", fan: "The points lie close to the line on the left and far from it on the right" }[kind]}.`,
          `16 个残差对 x 的图，零处有虚线。${{ random: "这些点散布在虚线两侧", curve: flip > 0 ? "这些点两端高、中间低" : "这些点两端低、中间高", fan: "这些点在左边靠近虚线，在右边远离虚线" }[kind]}。`,
        ),
      ),
    );
  },
);

const jointRectangle = point(
  "a-joint-probability-from-a-shaded-rectangle",
  ["A joint probability from a shaded rectangle", "由阴影矩形读联合概率"],
  [
    "A pair uniform on a rectangle has a joint density equal to one divided by the area of the rectangle. So the probability of an event is its area divided by the area of the rectangle. A drawing shows the event directly, and a region like a corner triangle is handled by the same ratio of areas.",
    "在矩形上均匀分布的一对变量，联合密度等于一除以矩形的面积。所以事件的概率是它的面积除以矩形的面积。图直接显示事件，像角上的三角形这样的区域也用同样的面积比处理。",
  ],
  (rng) => {
    const a = rng.int(3, 8);
    const b = rng.int(3, 8);
    const triangle = rng.bool();
    const p = rng.int(1, a - 1);
    const q = rng.int(1, b - 1);
    const areaDoubled = triangle ? p * q : 2 * p * q;
    const P = Q.of(areaDoubled, 2 * a * b);
    const region: Point[] = triangle
      ? [
          [0, 0],
          [p, 0],
          [0, q],
        ]
      : [
          [0, 0],
          [p, 0],
          [p, q],
          [0, q],
        ];
    return ask(
      [
        "The pair $(X, Y)$ is uniform on the outlined rectangle. What is the probability that it lands in the shaded region?",
        "$(X, Y)$ 在画出的矩形上均匀分布。它落在阴影区域内的概率是多少？",
      ],
      P,
      [
        Q.of(areaDoubled, 2 * (a + b)),
        Q.of(p, a),
        Q.of(q, b).eq(P) ? P.add(Q.of(1, a * b)) : Q.of(q, b),
        Q.of(p * q, a * b).eq(P) ? Q.of(p * q, 2 * a * b) : Q.of(p * q, a * b),
      ],
      [
        `The rectangle has area $${a * b}$ and the shaded ${triangle ? "triangle" : "rectangle"} has area $${Q.of(areaDoubled, 2).toLatex()}$. The density is constant, so the probability is the ratio of the areas, $${P.toLatex()}$.`,
        `矩形面积是 $${a * b}$，阴影${triangle ? "三角形" : "矩形"}面积是 $${Q.of(areaDoubled, 2).toLatex()}$。密度为常数，所以概率是面积之比 $${P.toLatex()}$。`,
      ],
      drawn(
        { xMin: -1, xMax: 9, yMin: -1, yMax: 9, xName: "x", yName: "y" },
        [
          { kind: "polygon", points: region },
          { kind: "segment", a: [a, 0], b: [a, b], accent: true },
          { kind: "segment", a: [0, b], b: [a, b], accent: true },
          { kind: "segment", a: [0, 0], b: [a, 0], accent: true },
          { kind: "segment", a: [0, 0], b: [0, b], accent: true },
        ],
        t(
          `A rectangle up to x = ${a} and y = ${b}, with a shaded ${triangle ? "triangle" : "rectangle"} at the origin reaching ${p} along x and ${q} along y.`,
          `到 x = ${a} 和 y = ${b} 的矩形，原点处有阴影${triangle ? "三角形" : "矩形"}，沿 x 到 ${p}，沿 y 到 ${q}。`,
        ),
      ),
    );
  },
);

const geometricBars = point(
  "a-geometric-distribution-from-its-bars",
  ["A geometric distribution from its bars", "由条形读几何分布"],
  [
    "The geometric distribution counts trials up to the first success. Its bars start with height $p$ at one and shrink by the factor $1 - p$ at each step. So the first bar gives the parameter directly. From $p$ the mean follows as $1 / p$, and the probability of needing more than one trial is $1 - p$.",
    "几何分布计算到首次成功为止的试验次数。它的条形从一处的高度 $p$ 开始，每一步按因子 $1 - p$ 缩小。所以第一根条形直接给出参数。由 $p$ 得到均值 $1 / p$，需要超过一次试验的概率是 $1 - p$。",
  ],
  (rng) => {
    const tenthsP = rng.int(1, 7);
    const p = tenthsP / 10;
    const P = Q.of(tenthsP, 10);
    const kind = rng.pick(["p", "mean", "more", "second"] as const);
    const values = Array.from({ length: 8 }, (_, i) => p * (1 - p) ** i);
    const cuts = Array.from({ length: 9 }, (_, i) => i + 0.6);
    const tick = Math.ceil(tenthsP + 1);
    const svg = chart([0, 9], [0, tick / 10], intTicks(1, 8), tenthTicks(0, tick), (x, y) => bars(cuts, values, x, y));
    const answer = kind === "p" ? P : kind === "mean" ? Q.of(10, tenthsP) : kind === "more" ? Q.one.sub(P) : Q.one.sub(P).mul(P);
    const q: Pair =
      kind === "p"
        ? ["the parameter $p$", "参数 $p$"]
        : kind === "mean"
          ? ["the mean", "均值"]
          : kind === "more"
            ? ["$P(X > 1)$", "$P(X > 1)$"]
            : ["$P(X = 2)$", "$P(X = 2)$"];
    return ask(
      [
        `The bars show a geometric distribution on the positive integers. What is ${q[0]}?`,
        `这些条形表示正整数上的几何分布。${q[1]}是多少？`,
      ],
      answer,
      [
        P.eq(answer) ? P.add(Q.of(1, 10)) : P,
        Q.of(tenthsP + 1, 10).eq(answer) ? Q.of(tenthsP + 2, 10) : Q.of(tenthsP + 1, 10),
        Q.of(10, tenthsP + 1),
        Q.one.sub(P).eq(answer) ? Q.of(1, 20) : Q.one.sub(P),
      ],
      [
        `The first bar has height $${P.toLatex()}$, so $p = ${P.toLatex()}$. From this, ${q[0]} equals $${answer.toLatex()}$.`,
        `第一根条形的高度是 $${P.toLatex()}$，所以 $p = ${P.toLatex()}$。由此，${q[1]}等于 $${answer.toLatex()}$。`,
      ],
      {
        svg,
        alt: t(
          `Bars at 1, 2, 3 and so on with first height ${p}, each later bar shrinking by a factor ${(1 - p).toFixed(1)}.`,
          `在 1、2、3 等处的条形，第一根高度为 ${p}，之后每根按因子 ${(1 - p).toFixed(1)} 缩小。`,
        ),
      },
    );
  },
);

const cdfDifference = point(
  "an-interval-probability-from-a-drawn-cdf",
  ["An interval probability from a drawn CDF", "由图中分布函数读区间概率"],
  [
    "The cumulative distribution function $F$ gives the probability of being at most $x$. So the probability of landing between $a$ and $b$ is $F(b) - F(a)$, a difference of two heights on the graph. A common slip is to read just $F(b)$, which counts everything up to $b$, including what lies below $a$.",
    "累积分布函数 $F$ 给出不超过 $x$ 的概率。所以落在 $a$ 与 $b$ 之间的概率是 $F(b) - F(a)$，即图上两个高度之差。常见错误是只读 $F(b)$，它把 $b$ 以下的全部都算进去，包括 $a$ 下面的部分。",
  ],
  (rng) => {
    const n = rng.int(4, 6);
    const w = tenths(rng, n);
    const F = [0];
    for (let i = 0; i < n; i++) F.push((F[i] as number) + (w[i] as number));
    const c = rng.int(0, n - 1);
    const d = rng.int(c + 1, n);
    const [low, high] = [F[c] as number, F[d] as number];
    const P = Q.of(high - low, 10);
    const svg = chart(
      [0, 7],
      [0, 1.05],
      intTicks(0, 7),
      tenthTicks(0, 10),
      (x, y) =>
        F.map((v, i) => `<circle cx="${x(i)}" cy="${y(v / 10)}" r="3" fill="currentColor"/>`).join("") +
        curvePath(
          (v) =>
            F[Math.floor(v)] === undefined
              ? 1
              : ((F[Math.floor(v)] as number) + ((F[Math.floor(v) + 1] ?? 10) - (F[Math.floor(v)] as number)) * (v - Math.floor(v))) / 10,
          0,
          n,
          x,
          y,
        ) +
        `<line class="accent" stroke="currentColor" x1="${x(n)}" y1="${y(1)}" x2="${x(7)}" y2="${y(1)}"/>`,
    );
    return ask(
      [
        `The graph shows a distribution function $F$. What is $P(${c} < X \\leq ${d})$?`,
        `图中是分布函数 $F$。$P(${c} < X \\leq ${d})$ 是多少？`,
      ],
      P,
      [
        Q.of(high, 10).eq(P) ? P.add(Q.of(1, 10)) : Q.of(high, 10),
        Q.of(10 - high + low === high - low ? 10 - high + low + 1 : 10 - high + low, 10),
        Q.of(high + low, 10).eq(P) ? Q.of(1, 20) : Q.of(high + low, 10),
      ],
      [
        `The graph has height $${Q.of(high, 10).toLatex()}$ at $x = ${d}$ and height $${Q.of(low, 10).toLatex()}$ at $x = ${c}$. The probability of the interval is the difference, $${P.toLatex()}$.`,
        `图在 $x = ${d}$ 处的高度是 $${Q.of(high, 10).toLatex()}$，在 $x = ${c}$ 处是 $${Q.of(low, 10).toLatex()}$。区间的概率是它们之差 $${P.toLatex()}$。`,
      ],
      {
        svg,
        alt: t(
          `A distribution function through the heights ${F.map((v) => v / 10).join(", ")} at x = 0, 1, 2 and so on.`,
          `经过高度 ${F.map((v) => v / 10).join("，")} 的分布函数，横坐标依次为 0、1、2 等。`,
        ),
      },
    );
  },
);

const quantileFromCdf = point(
  "a-quartile-from-a-drawn-cdf",
  ["A quartile from a drawn CDF", "由图中分布函数读四分位数"],
  [
    "A percentile reverses the reading of a distribution function. Rather than going up from a value of $x$, start at a height on the vertical axis, go across to the graph and then down to the horizontal axis. The median corresponds to a height of one half, and the quartiles correspond to heights of one quarter and three quarters.",
    "百分位数把分布函数的读法反过来。不是从 $x$ 的值向上读，而是从纵轴上的高度出发，横向到图，再向下到横轴。中位数对应高度二分之一，四分位数对应高度四分之一和四分之三。",
  ],
  (rng) => {
    const x0 = rng.int(0, 2);
    const stepsX = [rng.int(1, 3), rng.int(1, 2), rng.int(1, 2), rng.int(1, 3)];
    const xs = [x0];
    for (let i = 0; i < 4; i++) xs.push((xs[i] as number) + (stepsX[i] as number));
    const heights = [0, 0.25, 0.5, 0.75, 1];
    const which = rng.int(1, 3);
    const answer = xs[which] as number;
    const q: Pair =
      which === 1 ? ["the lower quartile", "下四分位数"] : which === 2 ? ["the median", "中位数"] : ["the upper quartile", "上四分位数"];
    const end = Math.max(xs[4] as number, 9);
    const svg = chart(
      [0, end + 1],
      [0, 1.05],
      intTicks(0, end + 1),
      [
        [0, "0"],
        [0.25, "0.25"],
        [0.5, "0.5"],
        [0.75, "0.75"],
        [1, "1"],
      ],
      (x, y) =>
        `<polyline class="accent" stroke="currentColor" fill="none" points="${x(0)},${y(0)} ${xs.map((v, i) => `${x(v)},${y(heights[i] as number)}`).join(" ")} ${x(end + 1)},${y(1)}"/>`,
    );
    return ask(
      [
        `The graph shows the distribution function of a continuous random variable. What is ${q[0]}?`,
        `图中是某连续随机变量的分布函数。${q[1]}是多少？`,
      ],
      answer,
      [xs[which === 1 ? 2 : 1] as number, xs[which === 3 ? 2 : 3] as number, xs[4] as number, answer + 1],
      [
        `The value reaches the height $${heights[which]}$ at $x = ${answer}$, and that height defines ${q[0]}.`,
        `函数值在 $x = ${answer}$ 处达到高度 $${heights[which]}$，这个高度对应${q[1]}。`,
      ],
      {
        svg,
        alt: t(
          `A distribution function with heights 0, 0.25, 0.5, 0.75 and 1 at x = ${xs.join(", ")}.`,
          `分布函数在 x = ${xs.join("，")} 处的高度分别为 0、0.25、0.5、0.75 和 1。`,
        ),
      },
    );
  },
);

const exponentialCurve = point(
  "reading-the-rate-of-an-exponential-density",
  ["Reading the rate of an exponential density", "读指数密度的速率"],
  [
    "The density of an exponential distribution is $\\lambda e^{-\\lambda x}$, so it starts at height $\\lambda$ on the vertical axis. The mean is $1 / \\lambda$, which means a tall starting point goes with a small mean. The probability of exceeding a value $x$ is $e^{-\\lambda x}$, and the drawing gives $\\lambda$ from the intercept.",
    "指数分布的密度是 $\\lambda e^{-\\lambda x}$，所以它从纵轴上的高度 $\\lambda$ 开始。均值是 $1 / \\lambda$，所以起点高就意味着均值小。超过值 $x$ 的概率是 $e^{-\\lambda x}$，图通过截距给出 $\\lambda$。",
  ],
  (rng) => {
    const rate = rng.pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8, 1, 1.25, 1.5, 1.6, 2, 2.5]);
    const R = Q.of(Math.round(rate * 100), 100);
    const f = (v: number) => rate * Math.exp(-rate * v);
    const top = rate <= 0.5 ? 0.6 : rate <= 1.25 ? 1.5 : 3;
    const ticks: [number, string][] = [
      [0, "0"],
      [rate, String(rate)],
    ];
    const svg = chart([0, 10], [0, top], intTicks(0, 10, 2), ticks, (x, y) => curvePath(f, 0, 10, x, y));
    const asksMean = rng.bool();
    const answer = asksMean ? Q.one.div(R) : R;
    return ask(
      asksMean
        ? ["The curve is an exponential density. What is the mean of the distribution?", "曲线是指数密度。这个分布的均值是多少？"]
        : [
            "The curve is an exponential density. What is its rate parameter $\\lambda$?",
            "曲线是指数密度。它的速率参数 $\\lambda$ 是多少？",
          ],
      answer,
      [asksMean ? R : Q.one.div(R), R.mul(Q.of(2, 1)), R.mul(Q.of(1, 2)), R.add(Q.one)],
      [
        `The curve starts at height $${R.toLatex()}$, which is $\\lambda$. The mean is $1 / \\lambda$, which equals $${Q.one.div(R).toLatex()}$.`,
        `曲线从高度 $${R.toLatex()}$ 开始，这就是 $\\lambda$。均值是 $1 / \\lambda$，等于 $${Q.one.div(R).toLatex()}$。`,
      ],
      { svg, alt: t(`An exponential density starting at height ${rate} on the vertical axis.`, `从纵轴高度 ${rate} 开始的指数密度。`) },
    );
  },
);

const histogramMean = point(
  "the-mean-of-a-drawn-frequency-chart",
  ["The mean of a drawn frequency chart", "图中频数图的均值"],
  [
    "A frequency chart lists how many observations take each value. The sample mean adds each value times its frequency, and then divides by the total frequency, which is the number of observations. Dividing by the number of bars is a common slip, and it gives a wrong result unless all the frequencies happen to be equal.",
    "频数图列出每个值有多少个观测。样本均值把每个值乘以频数相加，再除以总频数，也就是观测个数。除以条形的个数是常见错误，除非所有频数恰好相等，否则结果不对。",
  ],
  (rng) => {
    const first = rng.int(1, 4);
    const n = rng.int(3, 6);
    const counts = Array.from({ length: n }, () => rng.int(1, 7));
    const values = counts.map((_, i) => first + i);
    const total = counts.reduce((a, b) => a + b, 0);
    const weighted = counts.reduce((a, c, i) => a + c * (values[i] as number), 0);
    const mean = Q.of(weighted, total);
    const plain = Q.of(
      values.reduce((a, b) => a + b, 0),
      n,
    );
    const svg = chart([first - 1, first + n], [0, 8], intTicks(first - 1, first + n), intTicks(0, 8, 2), (x, y) =>
      bars(values.map((v) => v - 0.4).concat([(values[n - 1] as number) + 0.6]), counts, x, y),
    );
    return ask(
      ["The bars give the frequency of each value in a sample. What is the sample mean?", "条形给出样本中每个值的频数。样本均值是多少？"],
      mean,
      [plain.eq(mean) ? mean.add(Q.of(1, total)) : plain, Q.of(weighted, n), Q.of(total, n)],
      [
        `There are $${total}$ observations, and the values times their frequencies add up to $${weighted}$. Dividing gives $${mean.toLatex()}$.`,
        `共有 $${total}$ 个观测，值乘以频数之和是 $${weighted}$。相除得 $${mean.toLatex()}$。`,
      ],
      {
        svg,
        alt: t(
          `A frequency chart with counts ${counts.join(", ")} at the values ${values.join(", ")}.`,
          `频数图，值 ${values.join("，")} 的频数依次为 ${counts.join("，")}。`,
        ),
      },
    );
  },
);

const errorArea = point(
  "naming-a-shaded-area-in-a-hypothesis-test",
  ["Naming a shaded area in a hypothesis test", "说出假设检验中阴影面积的名称"],
  [
    "A hypothesis test draws a critical line between two curves for the null and alternative hypotheses. Rejecting is on one side of the line. The probability of a type I error is the part of the null curve in the rejection region. The probability of a type II error is the part of the alternative curve outside that region, and the power is its complement.",
    "假设检验在原假设和备择假设的两条曲线之间画一条临界线。拒绝在线的一侧。第一类错误的概率是原假设曲线落在拒绝域的部分。第二类错误的概率是备择假设曲线落在拒绝域之外的部分，功效是它的补。",
  ],
  (rng) => {
    const m0 = rng.int(0, 2);
    const m1 = m0 + rng.int(3, 5);
    const c = (m0 + m1) / 2 + rng.pick([-0.5, 0, 0.5]);
    const kind = rng.pick(["one", "two", "power", "keep"] as const);
    const [f0, f1] = [normal(m0, 1), normal(m1, 1)];
    const svg = chart(
      [m0 - 3, m1 + 3],
      [0, 0.5],
      [
        [m0, "μ₀"],
        [m1, "μ₁"],
        [c, "c"],
      ],
      [],
      (x, y) => {
        const [lo, hi] = [m0 - 3, m1 + 3];
        const shade =
          kind === "one"
            ? shadeUnder(f0, c, hi, x, y)
            : kind === "two"
              ? shadeUnder(f1, lo, c, x, y)
              : kind === "power"
                ? shadeUnder(f1, c, hi, x, y)
                : shadeUnder(f0, lo, c, x, y);
        return `${shade}${curvePath(f0, lo, hi, x, y, 'stroke="currentColor"')}${curvePath(f1, lo, hi, x, y)}<line stroke-dasharray="4 3" x1="${x(c)}" y1="${y(0)}" x2="${x(c)}" y2="${y(0.48)}"/>`;
      },
    );
    const names: Record<string, Pair> = {
      one: ["The probability of a type I error", "第一类错误的概率"],
      two: ["The probability of a type II error", "第二类错误的概率"],
      power: ["The power of the test", "检验的功效"],
      keep: ["The probability of correctly keeping the null hypothesis", "正确保留原假设的概率"],
    };
    const why: Pair =
      kind === "one"
        ? [
            "It lies under the null curve in the rejection region to the right of $c$, so the null is true and is rejected",
            "它在原假设曲线下、$c$ 右边的拒绝域内，所以原假设为真却被拒绝",
          ]
        : kind === "two"
          ? [
              "It lies under the alternative curve to the left of $c$, so the alternative is true and the null is kept",
              "它在备择假设曲线下、$c$ 左边，所以备择假设为真却保留了原假设",
            ]
          : kind === "power"
            ? [
                "It lies under the alternative curve in the rejection region, so the alternative is true and the null is rejected",
                "它在备择假设曲线下的拒绝域内，所以备择假设为真并拒绝了原假设",
              ]
            : [
                "It lies under the null curve to the left of $c$, so the null is true and is kept",
                "它在原假设曲线下、$c$ 左边，所以原假设为真并被保留",
              ];
    return choose(
      rng,
      [
        "The left curve is the null distribution with mean $\\mu_0$, and the right curve is the alternative with mean $\\mu_1$. The test rejects to the right of $c$. What is the shaded area?",
        "左边的曲线是均值为 $\\mu_0$ 的原假设分布，右边的曲线是均值为 $\\mu_1$ 的备择分布。检验在 $c$ 右边拒绝。阴影面积是什么？",
      ],
      names[kind] as Pair,
      Object.keys(names)
        .filter((n) => n !== kind)
        .map((n) => names[n] as Pair),
      [`${why[0]}.`, `${why[1]}。`],
      {
        svg,
        alt: t(
          `Two normal curves, centered at μ₀ and at μ₁ to its right, with a critical line at c. The area under the ${kind === "one" || kind === "keep" ? "μ₀" : "μ₁"} curve to the ${kind === "one" || kind === "power" ? "right" : "left"} of c is shaded.`,
          `两条正态曲线，中心分别在 μ₀ 和其右边的 μ₁，c 处有临界线。${kind === "one" || kind === "keep" ? "μ₀" : "μ₁"} 曲线下、c ${kind === "one" || kind === "power" ? "右" : "左"}边的面积涂色。`,
        ),
      },
    );
  },
);

const cltSpread = point(
  "the-spread-of-a-sample-mean-from-a-curve",
  ["The spread of a sample mean from a curve", "由曲线读样本均值的分散度"],
  [
    "By the central limit theorem, the mean of a sample of size $n$ has roughly a normal distribution with the same mean as the population, and with standard deviation $\\sigma / \\sqrt{n}$. So a drawing of the population gives $\\sigma$ from its inflection points, and the sample size then shrinks that value by a factor of $\\sqrt{n}$.",
    "由中心极限定理，容量为 $n$ 的样本均值近似服从正态分布，均值与总体相同，标准差为 $\\sigma / \\sqrt{n}$。所以总体的图从拐点给出 $\\sigma$，样本容量再把这个值缩小 $\\sqrt{n}$ 倍。",
  ],
  (rng) => {
    const mu = rng.int(2, 8) * 10;
    const sigma = rng.pick([4, 6, 8, 10, 12, 15, 20]);
    const root = rng.pick([2, 3, 4, 5, 6, 10]);
    const n = root * root;
    const f = normal(mu, sigma);
    const se = Q.of(sigma, root);
    const svg = chart(
      [mu - 3.5 * sigma, mu + 3.5 * sigma],
      [0, 1.2 * f(mu)],
      [
        [mu - sigma, String(mu - sigma)],
        [mu, String(mu)],
        [mu + sigma, String(mu + sigma)],
      ],
      [],
      (x, y) =>
        curvePath(f, mu - 3.5 * sigma, mu + 3.5 * sigma, x, y) +
        `<circle cx="${x(mu - sigma)}" cy="${y(f(mu - sigma))}" r="4" fill="currentColor"/><circle cx="${x(mu + sigma)}" cy="${y(f(mu + sigma))}" r="4" fill="currentColor"/>`,
    );
    return ask(
      [
        `The curve shows the population, with dots at its inflection points. What is the standard deviation of the mean of a sample of size $${n}$?`,
        `曲线表示总体，点标出它的拐点。容量为 $${n}$ 的样本均值的标准差是多少？`,
      ],
      se,
      [Q.of(sigma, n), Q.of(sigma, 1), Q.of(mu, root)],
      [
        `The inflection points show that $\\sigma = ${sigma}$. So the mean has standard deviation $${sigma} / \\sqrt{${n}} = ${sigma} / ${root} = ${se.toLatex()}$.`,
        `拐点表明 $\\sigma = ${sigma}$。所以均值的标准差是 $${sigma} / \\sqrt{${n}} = ${sigma} / ${root} = ${se.toLatex()}$。`,
      ],
      {
        svg,
        alt: t(
          `A normal curve with mean ${mu} and inflection points at ${mu - sigma} and ${mu + sigma}.`,
          `均值为 ${mu} 的正态曲线，拐点在 ${mu - sigma} 和 ${mu + sigma}。`,
        ),
      },
    );
  },
);

const bivariateContours = point(
  "the-correlation-from-contour-ellipses",
  ["The correlation from contour ellipses", "由等高椭圆读相关系数"],
  [
    "The contours of a bivariate normal density are ellipses centered at the means. When the ellipses tilt up to the right, large values of $x$ go with large values of $y$, so the correlation is positive. A tilt down to the right means negative correlation. Ellipses with axes along the coordinate axes mean zero correlation, whatever their width.",
    "二元正态密度的等高线是以均值为中心的椭圆。椭圆向右上倾斜时，大的 $x$ 伴随大的 $y$，相关系数为正。向右下倾斜表示负相关。椭圆的轴沿坐标轴时相关系数为零，与椭圆的宽度无关。",
  ],
  (rng) => {
    const rho = rng.pick([-0.8, -0.6, -0.4, 0, 0, 0.4, 0.6, 0.8]);
    const [cx, cy] = [rng.int(-2, 2), rng.int(-2, 2)];
    const [sx, sy] = rng.pick<Point>([
      [1, 1],
      [1.4, 1],
      [1, 1.4],
    ]);
    const form = (x: number, y: number) => {
      const [u, v] = [(x - cx) / sx, (y - cy) / sy];
      return (u * u - 2 * rho * u * v + v * v) / (1 - rho * rho);
    };
    const marks: PlaneMark[] = [1, 3, 6].map((level): PlaneMark => ({ kind: "contour", f: form, level, accent: true }));
    const names: Record<string, Pair> = {
      positive: ["The correlation is positive", "相关系数为正"],
      negative: ["The correlation is negative", "相关系数为负"],
      zero: ["The correlation is zero", "相关系数为零"],
      one: ["The correlation is exactly one", "相关系数恰好为一"],
    };
    const kind = rho > 0 ? "positive" : rho < 0 ? "negative" : "zero";
    const why: Pair =
      rho > 0
        ? ["The ellipses tilt up to the right, so large values go together", "椭圆向右上倾斜，所以大的值同时出现"]
        : rho < 0
          ? [
              "The ellipses tilt down to the right, so a large value of one goes with a small value of the other",
              "椭圆向右下倾斜，所以一个值大时另一个值小",
            ]
          : ["The axes of the ellipses run along the coordinate axes, with no tilt", "椭圆的轴沿坐标轴，没有倾斜"];
    return choose(
      rng,
      [
        "The curves are contours of a bivariate normal density. What do they show about the correlation of $X$ and $Y$?",
        "这些曲线是二元正态密度的等高线。关于 $X$ 和 $Y$ 的相关系数，它们说明了什么？",
      ],
      names[kind] as Pair,
      Object.keys(names)
        .filter((n) => n !== kind)
        .map((n) => names[n] as Pair),
      [`${why[0]}.`, `${why[1]}。`],
      drawn(
        { xMin: -8, xMax: 8, yMin: -8, yMax: 8, xName: "x", yName: "y" },
        marks,
        t(
          `Contour ellipses centered at (${cx}, ${cy}). ${rho > 0 ? "They tilt up to the right" : rho < 0 ? "They tilt down to the right" : "Their axes run along the coordinate axes"}.`,
          `以 (${cx}, ${cy}) 为中心的等高椭圆。${rho > 0 ? "它们向右上倾斜" : rho < 0 ? "它们向右下倾斜" : "它们的轴沿坐标轴"}。`,
        ),
      ),
    );
  },
);

/** deeperFiguresProbabilityCalculusPoints adds knowledge points of Probability and Statistics, for topics of the calculus shard, that are answered by reading a drawing. */
export const deeperFiguresProbabilityCalculusPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "probability-density-functions-of-continuous-random-variables": [densityHeight],
  "calculating-probabilities-with-continuous-random-variables": [shadedStepProbability],
  "the-standard-normal-distribution": [standardArea],
  "symmetry-properties-of-the-standard-normal-distribution": [symmetricArea],
  "the-normal-distribution": [compareCurves],
  "mean-and-variance-of-the-normal-distribution": [varianceFromInflection],
  "the-z-score": [zFromCurve],
  "linear-regression": [lineEquation],
  "residuals-and-residual-plots": [residualPattern],
  "joint-distributions-for-continuous-random-variables": [jointRectangle],
  "the-geometric-distribution": [geometricBars],
};

/** deeperFiguresProbabilityCollegePoints adds knowledge points of Probability and Statistics, for topics of the college shard, that are answered by reading a drawing. */
export const deeperFiguresProbabilityCollegePoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "cumulative-distribution-functions-for-continuous-random-variables": [cdfDifference],
  "median-quartiles-and-percentiles-of-continuous-random-variables": [quantileFromCdf],
  "the-exponential-distribution": [exponentialCurve],
  "the-sample-mean": [histogramMean],
  "type-i-and-type-ii-errors": [errorArea],
  "the-central-limit-theorem": [cltSpread],
  "the-bivariate-normal-distribution": [bivariateContours],
};
