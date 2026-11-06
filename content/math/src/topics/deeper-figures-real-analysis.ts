// Knowledge points of Real Analysis that ask the learner to read a drawing: sequence plots with bands, step functions,
// partitions and graphs for continuity. See `deeperFiguresRealAnalysisPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { Q, svgDocument } from "@ga/subject-math";
import { calculusDrawings1 } from "../explanation-drawings-calculus-1.ts";
import { calculusDrawings2 } from "../explanation-drawings-calculus-2.ts";
import { calculusDrawings3 } from "../explanation-drawings-calculus-3.ts";

import { ask, choose, observed, type Pair, point } from "../university-kit.ts";
import { drawn, label } from "./figure-reading-more.ts";

/** fig wraps marks in a figure with its description in both languages. */
const fig = (v: PlaneView, marks: readonly PlaneMark[], [en, zh]: Pair) => drawn(v, marks, t(en, zh));

/** dots draws a list of values as points above the positions 1, 2, 3 and so on. */
const dots = (values: readonly number[]): PlaneMark[] => values.map((v, i): PlaneMark => ({ kind: "point", at: [i + 1, v], accent: true }));

/** steps draws a step function from cut points and the values between them, with an open dot on the right end of each piece and a filled dot on its left. */
function steps(cuts: readonly number[], values: readonly number[]): PlaneMark[] {
  const marks: PlaneMark[] = [];
  values.forEach((v, i) => {
    const [a, b] = [cuts[i] as number, cuts[i + 1] as number];
    marks.push({ kind: "segment", a: [a, v], b: [b, v], accent: true }, { kind: "point", at: [a, v], accent: true });
    if (i + 1 < values.length) marks.push({ kind: "point", at: [b, v], open: true, accent: true });
  });
  return marks;
}

const epsilonBand = point(
  "the-index-from-a-drawn-epsilon-band",
  ["The index from a drawn epsilon band", "由图中的 epsilon 带读下标"],
  [
    "The definition of a limit asks for an index $N$ after which every term stays within $\\varepsilon$ of the limit. On a plot this is a band around the limit, and $N$ is the first position from which no dot lies outside. One dot inside the band is not enough, because all the later dots must stay inside too.",
    "极限的定义要求存在下标 $N$，使其后每一项都与极限相差不到 $\\varepsilon$。在图上这是极限周围的一条带，$N$ 是从它开始不再有点落在带外的第一个位置。一个点在带内还不够，后面所有的点都必须留在带内。",
  ],
  (rng) => {
    const L = rng.int(-1, 2);
    const eps = rng.pick([1.35, 1.75, 2.5, 4.5]);
    const form = rng.pick([1, -1, 0]);
    const value = (n: number) => L + (form === 0 ? (n % 2 === 0 ? 6 : -6) : 6 * form) / n;
    const values = Array.from({ length: 12 }, (_, i) => value(i + 1));
    const N = Math.floor(6 / eps) + 1;
    return ask(
      [
        "The dots show a sequence tending to the solid line, and the dashed lines bound a band around that limit. What is the smallest $N$ such that every term with $n \\geq N$ lies inside the band?",
        "图中的点是趋向实线的数列，虚线围成极限周围的带。使所有满足 $n \\geq N$ 的项都落在带内的最小 $N$ 是多少？",
      ],
      N,
      [N - 1, N + 1, N + 2],
      [
        `The dot at position $${N - 1}$ is still outside the band, while the dot at $${N}$ and all those after it are inside, because the distance to the limit keeps shrinking.`,
        `位置 $${N - 1}$ 的点仍在带外，而位置 $${N}$ 及其后的所有点都在带内，因为与极限的距离不断缩小。`,
      ],
      fig(
        { xMin: 0, xMax: 13, yMin: L - 7, yMax: L + 7, xName: "n" },
        [
          ...dots(values),
          { kind: "segment", a: [0, L], b: [13, L] },
          { kind: "segment", a: [0, L + eps], b: [13, L + eps], dashed: true },
          { kind: "segment", a: [0, L - eps], b: [13, L - eps], dashed: true },
        ],
        [
          `A sequence of 12 dots tending to ${L}, with a dashed band of half-width ${eps} around the limit.`,
          `趋向 ${L} 的数列的 12 个点，极限周围有半宽为 ${eps} 的虚线带。`,
        ],
      ),
    );
  },
);

const limsupPlot = point(
  "limit-superior-from-a-plot",
  ["Limit superior from a plot", "由图读上极限"],
  [
    "The limit superior of a sequence is the largest value that a subsequence approaches, and the limit inferior is the smallest. They ignore any finite number of early terms. So a tall first dot may be the supremum of the sequence and still have nothing to do with the limit superior, which depends only on the long-run behaviour.",
    "数列的上极限是子列能趋向的最大值，下极限是最小值。它们不考虑前面有限多项。所以很高的第一个点可能是数列的上确界，却与上极限无关，上极限只取决于长期行为。",
  ],
  (rng) => {
    const up = rng.int(1, 4);
    const down = rng.int(-4, 0);
    const askUp = rng.bool();
    const value = (n: number) => (n % 2 === 1 ? up + 3 / n : down - 3 / n);
    const values = Array.from({ length: 14 }, (_, i) => value(i + 1));
    const right = askUp ? up : down;
    const name = askUp ? "\\limsup" : "\\liminf";
    return ask(
      [
        `The dots show a sequence, and the pattern continues in the same way. What is $${name} a_n$?`,
        `图中的点是一个数列，规律一直持续。$${name} a_n$ 是多少？`,
      ],
      right,
      [askUp ? down : up, askUp ? up + 3 : down - 3, Q.of(up + down + (up + down === 0 ? 1 : 0), 2)],
      [
        `The odd terms settle at $${up}$ and the even terms at $${down}$, so these are the only limits of subsequences. The ${askUp ? "larger" : "smaller"} is $${right}$, and the early terms do not matter.`,
        `奇数项稳定在 $${up}$，偶数项稳定在 $${down}$，所以子列的极限只有这两个。其中${askUp ? "较大" : "较小"}的是 $${right}$，前面的项无关紧要。`,
      ],
      fig({ xMin: 0, xMax: 15, yMin: -7, yMax: 8, xName: "n" }, dots(values), [
        "A plot of a sequence whose dots alternate between an upper branch and a lower branch.",
        "一个数列的图，点在上下两支之间交替。",
      ]),
    );
  },
);

const clusterCount = point(
  "counting-subsequential-limits-on-a-plot",
  ["Counting subsequential limits on a plot", "在图上数子列极限"],
  [
    "A bounded sequence always has a convergent subsequence, by the Bolzano-Weierstrass theorem, and it may have several limits of subsequences. On a plot, each height that the dots keep returning to forever is one such limit. Count the heights, and note that the dots need not settle in order for a height to count.",
    "由波尔查诺-魏尔斯特拉斯定理，有界数列总有收敛子列，并且子列极限可能不止一个。在图上，点无限次回到的每个高度都是一个这样的极限。数一数这些高度，注意点不必依次稳定，这个高度也算。",
  ],
  (rng) => {
    const k = rng.int(2, 5);
    const heights = rng.sample([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6], k);
    const values = Array.from({ length: 20 }, (_, i) => {
      const h = heights[i % k] as number;
      return h + 0.8 / (i + 1);
    });
    return ask(
      [
        "The dots show a sequence, whose pattern repeats and settles. How many different limits do its convergent subsequences have?",
        "图中的点是一个数列，其规律重复并逐渐稳定。它的收敛子列有多少个不同的极限？",
      ],
      k,
      [k - 1, k + 1, 1, 0],
      [
        `The dots return forever to $${k}$ different heights, and each height is the limit of the subsequence of terms approaching it. Any other convergent subsequence must end up among these.`,
        `点无限次回到 $${k}$ 个不同的高度，每个高度都是趋向它的那些项组成的子列的极限。其他收敛子列最终也只能落在这些高度之中。`,
      ],
      fig({ xMin: 0, xMax: 21, yMin: -7, yMax: 8, xName: "n" }, dots(values), [
        "A plot of a sequence whose dots keep returning to certain heights as n grows.",
        "一个数列的图，随着 n 增大，点不断回到某些高度。",
      ]),
    );
  },
);

const holeValue = {
  ...point(
    "the-value-that-repairs-a-hole",
    ["The value that repairs a hole", "补上空洞的值"],
    [
      "A function is continuous at a point when its limit there exists and equals its value. If the graph has a hole at $a$ and a separate dot, the limit is the height of the hole, whatever the dot does. To repair the discontinuity, the function value must be moved to the height of the hole.",
      "函数在一点连续，是指它在该点的极限存在并等于函数值。如果图在 $a$ 处有空洞，另有一个单独的点，那么极限是空洞的高度，与那个点无关。要消除间断，函数值必须移到空洞的高度。",
    ],
    (rng) => {
      const a = rng.int(-3, 3);
      const hole = rng.int(-3, 4);
      let dot = rng.int(-4, 5);
      if (dot === hole) dot = hole + 2;
      const slope = rng.pick([-1, -0.5, 0.5, 1]);
      const bend = rng.pick([-0.2, 0, 0.15]);
      const f = (x: number) => hole + slope * (x - a) + bend * (x - a) ** 2;
      return ask(
        [
          "The graph of $f$ has one point of discontinuity. To what value must $f$ be changed at that point to make it continuous there?",
          "$f$ 的图有一个间断点。要使它在那里连续，$f$ 在该点的值必须改成多少？",
        ],
        hole,
        [dot, a === hole || a === dot ? hole + 1 : a, hole - 1],
        [
          `Approaching from both sides, the graph heads to the open circle at height $${hole}$, so that is the limit. The separate dot at height $${dot}$ is the current value, which must be moved to match.`,
          `从两侧趋近时，图都趋向高度 $${hole}$ 的空心圆，所以这就是极限。高度 $${dot}$ 的单独的点是当前的函数值，必须移过去才能相等。`,
        ],
        fig(
          { xMin: -7, xMax: 7, yMin: -7, yMax: 7 },
          [
            { kind: "curve", f, accent: true },
            { kind: "point", at: [a, hole], open: true, accent: true },
            { kind: "point", at: [a, dot], accent: true },
          ],
          [
            `A curve with an open circle at (${a}, ${hole}) and a separate dot at (${a}, ${dot}).`,
            `一条曲线，在 (${a}, ${hole}) 处有空心圆，在 (${a}, ${dot}) 处有单独的点。`,
          ],
        ),
      );
    },
  ),
  figure: calculusDrawings1["defining-continuity-at-a-point#the-value-that-repairs-a-hole"],
};

const discontinuityKind = point(
  "the-kind-of-a-drawn-discontinuity",
  ["The kind of a drawn discontinuity", "图中间断的类型"],
  [
    "Discontinuities are classified by one-sided limits. If both exist and agree, the discontinuity is removable. If both exist and differ, it is a jump. If a side grows without bound, it is an infinite discontinuity. A graph shows at a glance which case holds, by what happens as it approaches the point from each side.",
    "间断按单侧极限分类。两侧极限都存在且相等，是可去间断。都存在但不相等，是跳跃间断。若有一侧无界增大，是无穷间断。看图趋近该点时两侧发生什么，就能立刻判断属于哪种情况。",
  ],
  (rng) => {
    const a = rng.int(-3, 3);
    const kind = rng.pick(["removable", "jump", "infinite"] as const);
    const m = rng.pick([-1, -0.5, 0.5, 1]);
    const h = rng.int(-2, 2);
    const gap = rng.nonZero(-3, 3);
    const names: Record<string, Pair> = {
      removable: ["A removable discontinuity", "可去间断"],
      jump: ["A jump discontinuity", "跳跃间断"],
      infinite: ["An infinite discontinuity", "无穷间断"],
      none: ["No discontinuity, because the graph is continuous there", "没有间断，图在那里连续"],
    };
    const marks: PlaneMark[] =
      kind === "removable"
        ? [
            { kind: "curve", f: (x) => h + m * (x - a), accent: true },
            { kind: "point", at: [a, h], open: true, accent: true },
            { kind: "point", at: [a, h + gap], accent: true },
          ]
        : kind === "jump"
          ? [
              { kind: "curve", f: (x) => h + m * (x - a), to: a, accent: true },
              { kind: "curve", f: (x) => h + gap + m * (x - a), from: a, accent: true },
              { kind: "point", at: [a, h], accent: true },
              { kind: "point", at: [a, h + gap], open: true, accent: true },
            ]
          : [
              { kind: "curve", f: (x) => h + (gap > 0 ? 1 : -1) / (x - a), from: -7, to: a - 0.14, accent: true },
              { kind: "curve", f: (x) => h + (gap > 0 ? 1 : -1) / (x - a), from: a + 0.14, to: 7, accent: true },
              { kind: "segment", a: [a, -7], b: [a, 7], dashed: true },
            ];
    const seen: Pair =
      kind === "removable"
        ? [
            "Both sides approach the open circle, so the two one-sided limits agree and only the value at the point is off",
            "两侧都趋向空心圆，所以两个单侧极限相等，只是该点的值不对",
          ]
        : kind === "jump"
          ? [
              "The two sides approach different finite heights, so both one-sided limits exist and they differ",
              "两侧趋向不同的有限高度，所以两个单侧极限都存在但不相等",
            ]
          : [
              "The graph rises or falls without bound next to the dashed line, so the one-sided limits are not finite",
              "图在虚线旁无界地上升或下降，所以单侧极限不是有限值",
            ];
    return choose(
      rng,
      [`What kind of discontinuity does the function drawn have at $x = ${a}$?`, `图中函数在 $x = ${a}$ 处是哪种间断？`],
      names[kind] as Pair,
      Object.keys(names)
        .filter((n) => n !== kind)
        .map((n) => names[n] as Pair),
      [
        `${seen[0]}. That is the meaning of ${(names[kind] as Pair)[0].toLowerCase()}.`,
        `${seen[1]}。这就是${(names[kind] as Pair)[1]}的含义。`,
      ],
      fig({ xMin: -7, xMax: 7, yMin: -7, yMax: 7 }, marks, [
        `A graph near x = ${a}. ${observed(seen)[0]}.`,
        `x = ${a} 附近的图。${observed(seen)[1]}。`,
      ]),
    );
  },
);

const jumpsOfStep = point(
  "the-jumps-of-a-monotone-step-graph",
  ["The jumps of a monotone step graph", "单调阶梯图的跃变"],
  [
    "A monotone function has one-sided limits at every point, so its only discontinuities are jumps. The size of a jump is the right limit minus the left limit. For an increasing function, the jumps add up to at most the total rise, and for a step function they add up to exactly that rise.",
    "单调函数在每一点都有单侧极限，所以它的间断只能是跳跃。跃变的大小等于右极限减左极限。对于增函数，跃变之和不超过总上升量，而对于阶梯函数，跃变之和恰好等于总上升量。",
  ],
  (rng) => {
    const count = rng.int(3, 5);
    const cuts = [0];
    for (let i = 0; i < count; i++) cuts.push((cuts[i] as number) + rng.int(1, 2));
    const values = [rng.int(-3, 0)];
    for (let i = 1; i < count; i++) values.push((values[i - 1] as number) + rng.int(1, 3));
    const index = rng.int(1, count - 1);
    const at = cuts[index] as number;
    const jump = (values[index] as number) - (values[index - 1] as number);
    const total = (values[count - 1] as number) - (values[0] as number);
    const whole = rng.bool();
    return ask(
      whole
        ? [
            "The graph shows an increasing step function. What is the sum of the sizes of all of its jumps?",
            "图中是一个递增的阶梯函数。它所有跃变大小之和是多少？",
          ]
        : [
            `The graph shows an increasing step function. What is the size of its jump at $x = ${at}$?`,
            `图中是一个递增的阶梯函数。它在 $x = ${at}$ 处的跃变大小是多少？`,
          ],
      whole ? total : jump,
      whole ? [count - 1, values[count - 1] as number, total + 1] : [values[index] as number, values[index - 1] as number, jump + 1],
      whole
        ? [
            `The function rises from $${values[0]}$ on the left to $${values[count - 1]}$ on the right only by jumping, so its jumps add up to the total rise, $${total}$.`,
            `函数从左边的 $${values[0]}$ 升到右边的 $${values[count - 1]}$，全靠跃变，所以跃变之和等于总上升量 $${total}$。`,
          ]
        : [
            `Just left of $x = ${at}$ the height is $${values[index - 1]}$, and from $x = ${at}$ on it is $${values[index]}$. The jump is the difference, $${jump}$.`,
            `$x = ${at}$ 左侧的高度是 $${values[index - 1]}$，从 $x = ${at}$ 起是 $${values[index]}$。跃变是二者之差 $${jump}$。`,
          ],
      fig({ xMin: -1, xMax: 11, yMin: -4, yMax: 10 }, steps(cuts, values), [
        `Steps at heights ${values.join(", ")}, changing at x = ${cuts.slice(1, -1).join(", ")}.`,
        `高度依次为 ${values.join("，")} 的阶梯，在 x = ${cuts.slice(1, -1).join("，")} 处变化。`,
      ]),
    );
  },
);

const totalVariation = point(
  "the-total-variation-of-a-drawn-path",
  ["The total variation of a drawn path", "图中折线的全变差"],
  [
    "The total variation of a function adds up every rise and every fall, as positive amounts. For a graph of straight pieces, it is the sum of the absolute changes in height on the pieces. It differs from the net change, where falls cancel rises, and from the range, which ignores repeated travel over the same heights.",
    "函数的全变差把每次上升和下降都按正数加起来。对于由直线段组成的图，它是各段高度变化绝对值之和。它不同于净变化，后者中下降抵消上升；也不同于值域长度，后者忽略在相同高度上的重复往返。",
  ],
  (rng) => {
    const n = rng.int(4, 7);
    const h = [rng.int(-2, 2)];
    for (let i = 1; i <= n; i++) {
      let next = rng.int(-4, 5);
      if (next === h[i - 1]) next = (h[i - 1] as number) + 1;
      h.push(next);
    }
    let tv = 0;
    for (let i = 0; i < n; i++) tv += Math.abs((h[i + 1] as number) - (h[i] as number));
    const net = (h[n] as number) - (h[0] as number);
    const range = Math.max(...h) - Math.min(...h);
    return ask(
      [
        "What is the total variation of the function drawn, over the whole interval on which it is drawn?",
        "图中函数在所画的整个区间上的全变差是多少？",
      ],
      tv,
      [Math.abs(net) === tv ? tv + 1 : Math.abs(net), range === tv ? tv + 2 : range, tv + 1],
      [
        `The heights in turn are $${h.join(", ")}$. Adding the absolute change on each piece gives $${tv}$, and every fall counts as a positive amount.`,
        `高度依次为 $${h.join(", ")}$。把每段高度变化的绝对值相加得 $${tv}$，每次下降都算作正数。`,
      ],
      fig(
        { xMin: -1, xMax: 8, yMin: -5, yMax: 6 },
        [{ kind: "path", points: h.map((v, i): Point => [i, v]), accent: true }],
        [
          `Straight pieces through the heights ${h.join(", ")} at x = 0, 1, 2 and so on.`,
          `经过高度 ${h.join("，")} 的直线段，横坐标依次为 0、1、2 等。`,
        ],
      ),
    );
  },
);

const crossings = {
  ...point(
    "intermediate-values-at-a-drawn-level",
    ["Intermediate values at a drawn level", "图中水平线处的介值"],
    [
      "If a continuous function is below a level at one point and above it at another, the intermediate value theorem gives a solution between them. Each change of side forces a separate crossing. Counting the changes of side along a graph gives the number of solutions the theorem guarantees, and the drawn graph shows how the sides change.",
      "如果连续函数在一点低于某水平，在另一点高于它，介值定理就保证它们之间有解。每换一次边都迫使出现一次单独的穿越。沿着图数换边的次数，就得到定理保证的解的个数，而图显示了换边的情况。",
    ],
    (rng) => {
      const n = rng.int(5, 8);
      const level = rng.int(-1, 2);
      const h = Array.from({ length: n + 1 }, () => rng.int(-4, 5) + 0);
      const adjusted = h.map((v) => (v === level ? v + 1 : v));
      let count = 0;
      for (let i = 0; i < n; i++) if (((adjusted[i] as number) - level) * ((adjusted[i + 1] as number) - level) < 0) count++;
      return ask(
        [
          "The continuous function drawn is defined on the whole interval shown, and the dashed line is a level $k$. How many solutions does $f(x) = k$ have on the interval?",
          "图中的连续函数定义在所示整个区间上，虚线是水平 $k$。$f(x) = k$ 在该区间上有多少个解？",
        ],
        count,
        [count + 1, count === 0 ? 2 : count - 1, n],
        [
          `The graph is made of straight pieces, so each piece meets the level at most once, and it does so exactly when it changes side. There are $${count}$ such changes.`,
          `图由直线段组成，所以每段至多与水平线相交一次，恰好在换边时相交。这样的换边有 $${count}$ 次。`,
        ],
        fig(
          { xMin: -1, xMax: 9, yMin: -5, yMax: 7 },
          [
            { kind: "path", points: adjusted.map((v, i): Point => [i, v]), accent: true },
            { kind: "segment", a: [-1, level], b: [9, level], dashed: true },
          ],
          [
            `Straight pieces through the heights ${adjusted.join(", ")}, with a dashed level at ${level}.`,
            `经过高度 ${adjusted.join("，")} 的直线段，虚线水平为 ${level}。`,
          ],
        ),
      );
    },
  ),
  figure: calculusDrawings1["the-intermediate-value-theorem#intermediate-values-at-a-drawn-level"],
};

const extremeAttained = {
  ...point(
    "whether-a-drawn-maximum-is-attained",
    ["Whether a drawn maximum is attained", "图中的最大值是否取到"],
    [
      "The extreme value theorem needs a continuous function on a closed bounded interval. If the top of a graph sits at an open circle, the function comes arbitrarily close to that height but never reaches it, so there is no maximum. If the top is on the graph itself, the maximum is attained there, whatever the hypotheses say.",
      "极值定理要求函数在有界闭区间上连续。如果图的最高处是空心圆，函数能任意接近这个高度却永远达不到，所以没有最大值。如果最高处就在图上，最大值就在那里取到，不管定理的条件是否满足。",
    ],
    (rng) => {
      const a = rng.int(-5, -2);
      const b = a + rng.int(5, 8);
      const top = rng.int(2, 5);
      const kind = rng.pick(["closedPeak", "openEnd", "jumpTop", "openPeak"] as const);
      const c = rng.int(a + 2, b - 2);
      const left = (x: number) => top - 0.5 * ((x - c) * (x - c)) * 0.3;
      const rise = (x: number) => top - (b - x) * 0.7;
      let marks: PlaneMark[];
      let attained = true;
      let where = c;
      let reason: Pair;
      if (kind === "closedPeak") {
        marks = [
          { kind: "curve", f: left, from: a, to: b, accent: true },
          { kind: "point", at: [a, left(a)], accent: true },
          { kind: "point", at: [b, left(b)], accent: true },
        ];
        reason = [`The highest point of the graph is at $x = ${c}$, and it belongs to the graph`, `图的最高点在 $x = ${c}$，并且属于图`];
      } else if (kind === "openPeak") {
        marks = [
          { kind: "curve", f: left, from: a, to: b, accent: true },
          { kind: "point", at: [a, left(a)], open: true, accent: true },
          { kind: "point", at: [b, left(b)], open: true, accent: true },
        ];
        reason = [
          `The ends are open, but the highest point of the graph is at $x = ${c}$ and it belongs to the graph`,
          `两端是空心的，但图的最高点在 $x = ${c}$，并且属于图`,
        ];
      } else if (kind === "openEnd") {
        attained = false;
        where = b;
        marks = [
          { kind: "curve", f: rise, from: a, to: b, accent: true },
          { kind: "point", at: [a, rise(a)], accent: true },
          { kind: "point", at: [b, rise(b)], open: true, accent: true },
        ];
        reason = [
          `The graph climbs toward an open circle at $x = ${b}$, so it gets close to that height without reaching it`,
          `图向 $x = ${b}$ 处的空心圆上升，所以接近这个高度却达不到`,
        ];
      } else {
        attained = false;
        where = c;
        marks = [
          { kind: "curve", f: (x) => top - (c - x) * 0.7, from: a, to: c, accent: true },
          { kind: "curve", f: (x) => top - 3 - (x - c) * 0.3, from: c, to: b, accent: true },
          { kind: "point", at: [c, top], open: true, accent: true },
          { kind: "point", at: [c, top - 3], accent: true },
          { kind: "point", at: [a, top - (c - a) * 0.7], accent: true },
          { kind: "point", at: [b, top - 3 - (b - c) * 0.3], accent: true },
        ];
        reason = [
          `The graph climbs toward an open circle at $x = ${c}$ and the function value there is lower, so that height is never reached`,
          `图向 $x = ${c}$ 处的空心圆上升，而那里的函数值更低，所以永远达不到这个高度`,
        ];
      }
      const at = (v: number): Pair => [`The maximum is attained at $x = ${v}$`, `最大值在 $x = ${v}$ 处取到`];
      const none: Pair = ["There is no maximum", "没有最大值"];
      return choose(
        rng,
        [
          "Filled and open circles show which points belong to the function drawn. What can be said about its maximum on its domain?",
          "实心圆和空心圆表示哪些点属于图中函数。关于它在定义域上的最大值，可以得出什么结论？",
        ],
        attained ? at(where) : none,
        attained ? [none, at(b), at(a), at(c + 1)] : [at(where), at(a), at(where === b ? c : b)],
        [`${reason[0]}.`, `${reason[1]}。`],
        fig({ xMin: -7, xMax: 7, yMin: -7, yMax: 7 }, marks, [
          `A graph from x = ${a} to x = ${b}. ${observed(reason)[0].replaceAll("$", "")}.`,
          `从 x = ${a} 到 x = ${b} 的图。${observed(reason)[1].replaceAll("$", "")}。`,
        ]),
      );
    },
  ),
  figure: calculusDrawings2["the-extreme-value-theorem#whether-a-drawn-maximum-is-attained"],
};

const darboux = point(
  "a-darboux-sum-on-a-drawn-partition",
  ["A Darboux sum on a drawn partition", "图中分割上的达布和"],
  [
    "An upper Darboux sum multiplies the width of each piece of a partition by the largest value of the function on that piece, and a lower sum uses the smallest. For an increasing function, the largest value on a piece is at its right end, and for a decreasing function it is at its left end.",
    "达布上和把分割每一段的宽度乘以函数在该段上的最大值，下和则用最小值。对于增函数，一段上的最大值在右端；对于减函数，则在左端。",
  ],
  (rng) => {
    const up = rng.bool();
    const b0 = up ? rng.int(0, 2) : rng.int(5, 7);
    const m = up ? 1 : -1;
    const f = (x: number) => b0 + m * x;
    const cuts = [0];
    for (let i = 0; i < 3; i++) cuts.push((cuts[i] as number) + rng.int(1, 2));
    const upper = rng.bool();
    let U = 0;
    let L = 0;
    const parts: string[] = [];
    for (let i = 0; i < 3; i++) {
      const [p, q] = [cuts[i] as number, cuts[i + 1] as number];
      const [hi, lo] = [Math.max(f(p), f(q)), Math.min(f(p), f(q))];
      U += hi * (q - p);
      L += lo * (q - p);
      parts.push(`${q - p} \\cdot ${upper ? hi : lo}`);
    }
    const end = cuts[3] as number;
    const exact = Q.of((f(0) + f(end)) * end, 2);
    const answer = upper ? U : L;
    const marks: PlaneMark[] = [
      { kind: "curve", f, from: 0, to: end, accent: true },
      ...cuts.map((c): PlaneMark => ({ kind: "segment", a: [c, 0], b: [c, f(c)], dashed: true })),
    ];
    return ask(
      [
        `The dashed lines mark a partition of the interval for the increasing or decreasing function drawn. What is the ${upper ? "upper" : "lower"} Darboux sum for this partition?`,
        `虚线标出图中单调函数所在区间的一个分割。这个分割的达布${upper ? "上" : "下"}和是多少？`,
      ],
      answer,
      [upper ? L : U, exact.eq(Q.of(answer, 1)) ? answer + 1 : exact, answer + 2],
      [
        `Each piece contributes its width times the ${upper ? "largest" : "smallest"} height on it: $${parts.join(" + ")} = ${answer}$.`,
        `每段贡献其宽度乘以其上${upper ? "最大" : "最小"}的高度：$${parts.join(" + ")} = ${answer}$。`,
      ],
      fig({ xMin: -1, xMax: 8, yMin: -1, yMax: 8 }, marks, [
        `A straight line from height ${f(0)} at x = 0 to height ${f(end)} at x = ${end}, with partition points ${cuts.join(", ")}.`,
        `一条直线，从 x = 0 处高度 ${f(0)} 到 x = ${end} 处高度 ${f(end)}，分割点为 ${cuts.join("，")}。`,
      ]),
    );
  },
);

const riemannRectangles = {
  ...point(
    "reading-a-riemann-sum-from-its-rectangles",
    ["Reading a Riemann sum from its rectangles", "由矩形读黎曼和"],
    [
      "A Riemann sum picks one height for each piece of the interval. Rectangles touching the graph at their left corners make a left sum, and those touching it at their right corners make a right sum. The value is the total area of the rectangles, which is the sum of the heights times the common width.",
      "黎曼和为区间的每一段选一个高度。在左上角碰到图的矩形构成左和，在右上角碰到图的构成右和。值是矩形的总面积，也就是各高度之和乘以相同的宽度。",
    ],
    (rng) => {
      const width = rng.pick([1, 2]);
      const count = width === 1 ? rng.int(4, 6) : 3;
      const h = Array.from({ length: count + 1 }, () => rng.int(1, 6));
      if (h[0] === h[count]) h[count] = (h[count] as number) + 1;
      const leftSum = rng.bool();
      let L = 0;
      let R = 0;
      for (let i = 0; i < count; i++) {
        L += (h[i] as number) * width;
        R += (h[i + 1] as number) * width;
      }
      const marks: PlaneMark[] = [];
      for (let i = 0; i < count; i++) {
        const v = (leftSum ? h[i] : h[i + 1]) as number;
        const [p, q] = [i * width, (i + 1) * width];
        marks.push({
          kind: "polygon",
          points: [
            [p, 0],
            [q, 0],
            [q, v],
            [p, v],
          ],
        });
      }
      marks.push({ kind: "path", points: h.map((v, i): Point => [i * width, v]), accent: true });
      const option = (left: boolean, v: number): Pair => [
        `A ${left ? "left" : "right"} sum, with value $${v}$`,
        `${left ? "左" : "右"}和，值为 $${v}$`,
      ];
      const [v, other] = leftSum ? [L, R] : [R, L];
      return choose(
        rng,
        ["The rectangles approximate the area under the graph. Which sum do they show?", "这些矩形近似图下方的面积。它们表示哪种和？"],
        option(leftSum, v),
        [
          option(!leftSum, v),
          option(leftSum, other === v ? v + width : other),
          option(!leftSum, other === v ? v + 2 * width : other),
          option(leftSum, v / width === v ? v + 1 : v / width),
        ],
        [
          `Each rectangle reaches the graph at its ${leftSum ? "left" : "right"} corner, so this is a ${leftSum ? "left" : "right"} sum. The heights are ${(leftSum ? h.slice(0, -1) : h.slice(1)).join(", ")}, and multiplying their sum by the width $${width}$ gives $${v}$.`,
          `每个矩形在${leftSum ? "左" : "右"}上角碰到图，所以这是${leftSum ? "左" : "右"}和。高度依次为 ${(leftSum ? h.slice(0, -1) : h.slice(1)).join("，")}，它们的和乘以宽度 $${width}$ 得 $${v}$。`,
        ],
        fig({ xMin: -1, xMax: 8, yMin: -1, yMax: 8 }, marks, [
          `Rectangles of width ${width} and a path through the heights ${h.join(", ")}.`,
          `宽度为 ${width} 的矩形和经过高度 ${h.join("，")} 的折线。`,
        ]),
      );
    },
  ),
  figure: calculusDrawings3["defining-definite-integrals-using-left-and-right-riemann-sums#reading-a-riemann-sum-from-its-rectangles"],
};

const simpleIntegral = point(
  "the-integral-of-a-drawn-simple-function",
  ["The integral of a drawn simple function", "图中简单函数的积分"],
  [
    "A simple function takes finitely many values, each on a set of some measure. Its Lebesgue integral is the sum of each value times the measure of the set where it is taken. A part of the graph below the axis has a negative value, so it subtracts from the total rather than adding to it.",
    "简单函数只取有限多个值，每个值在一个有测度的集合上取到。它的勒贝格积分是每个值乘以取到该值的集合的测度之和。图在轴下方的部分取负值，所以从总数中减去，而不是加上。",
  ],
  (rng) => {
    const count = rng.int(3, 5);
    const cuts = [0];
    for (let i = 0; i < count; i++) cuts.push((cuts[i] as number) + rng.int(1, 3));
    const values = Array.from({ length: count }, () => rng.nonZero(-3, 4));
    let total = 0;
    let absolute = 0;
    for (let i = 0; i < count; i++) {
      const length = (cuts[i + 1] as number) - (cuts[i] as number);
      total += (values[i] as number) * length;
      absolute += Math.abs(values[i] as number) * length;
    }
    const heights = values.reduce((a, b) => a + b, 0);
    const end = cuts[count] as number;
    return ask(
      [
        "The graph shows a simple function that is zero outside the part drawn. What is its Lebesgue integral?",
        "图中是一个简单函数，它在所画部分之外为零。它的勒贝格积分是多少？",
      ],
      total,
      [absolute === total ? total + 1 : absolute, heights === total ? total + 2 : heights, -total === total ? total - 1 : -total],
      [
        `Each piece contributes its value times its length, with the parts below the axis counting as negative. The total of these contributions is $${total}$.`,
        `每段贡献其值乘以长度，轴下方的部分算作负值。这些贡献的总和是 $${total}$。`,
      ],
      fig({ xMin: -1, xMax: Math.max(end + 1, 9), yMin: -4, yMax: 5 }, steps(cuts, values), [
        `Values ${values.join(", ")} on pieces with end points ${cuts.join(", ")}.`,
        `各段的值依次为 ${values.join("，")}，端点为 ${cuts.join("，")}。`,
      ]),
    );
  },
);

const meanValueSlope = {
  ...point(
    "the-mean-value-slope-from-a-graph",
    ["The mean value slope from a graph", "由图读中值定理的斜率"],
    [
      "The mean value theorem says that a differentiable function has a point between $a$ and $b$ where the tangent is parallel to the chord. So the derivative at that point equals the slope of the chord, which depends only on the end points. The wiggles between them decide where the point is, but not the slope.",
      "中值定理说，可导函数在 $a$ 和 $b$ 之间有一点，切线与弦平行。所以该点的导数等于弦的斜率，它只取决于两个端点。两点之间的起伏决定这一点在哪里，但不影响斜率。",
    ],
    (rng) => {
      const a = rng.int(-5, -1);
      const b = a + rng.int(2, 6);
      const fa = rng.int(-4, 4);
      let fb = rng.int(-4, 5);
      if (fb === fa) fb = fa + 1;
      const w = rng.pick([-1.5, -1, 1, 1.5]);
      const f = (x: number) => fa + ((fb - fa) * (x - a)) / (b - a) + w * Math.sin((Math.PI * (x - a)) / (b - a));
      const slope = Q.of(fb - fa, b - a);
      const rise = fb - fa;
      const run = b - a;
      return ask(
        [
          "The function drawn is differentiable. By the mean value theorem, some $c$ between the marked points has what value of $f'(c)$?",
          "图中函数可导。由中值定理，所标两点之间存在 $c$，使 $f'(c)$ 等于多少？",
        ],
        slope,
        [Q.of(run, rise), Q.of(-rise, run), Q.of(rise, 1).eq(slope) ? Q.of(rise + 1, 1) : Q.of(rise, 1)],
        [
          `The points are $(${a}, ${fa})$ and $(${b}, ${fb})$. The chord between them rises $${rise}$ over a run of $${run}$, so its slope is $${slope.toLatex()}$, and the theorem gives a tangent with that slope.`,
          `两点是 $(${a}, ${fa})$ 和 $(${b}, ${fb})$。它们之间的弦在水平距离 $${run}$ 上升高 $${rise}$，所以斜率是 $${slope.toLatex()}$，定理给出具有这一斜率的切线。`,
        ],
        fig(
          { xMin: -7, xMax: 7, yMin: -7, yMax: 7 },
          [
            { kind: "curve", f, from: a, to: b, accent: true },
            { kind: "point", at: [a, fa], label: "A", dir: "n" },
            { kind: "point", at: [b, fb], label: "B", dir: "n" },
          ],
          [`A wavy curve from A at (${a}, ${fa}) to B at (${b}, ${fb}).`, `从 A (${a}, ${fa}) 到 B (${b}, ${fb}) 的波浪曲线。`],
        ),
      );
    },
  ),
  figure: calculusDrawings2["the-mean-value-theorem#the-mean-value-slope-from-a-graph"],
};

const uniformGap = point(
  "the-uniform-distance-from-a-graph",
  ["The uniform distance from a graph", "由图读一致距离"],
  [
    "Uniform convergence measures the largest vertical distance between $f_n$ and $f$ over the whole interval, and this distance must tend to zero. A moving bump is the standard warning: at each fixed point the functions eventually settle, yet the height of the bump stays the same, and so the convergence is not uniform.",
    "一致收敛度量的是 $f_n$ 与 $f$ 在整个区间上的最大竖直距离，这个距离必须趋于零。移动的凸起是典型的警示：在每个固定点上函数最终都会稳定，但凸起的高度不变，所以收敛不一致。",
  ],
  (rng) => {
    const k = rng.int(-2, 2);
    const h = rng.int(1, 4);
    const c = rng.int(-3, 3);
    const w = rng.int(1, 2);
    const sign = rng.sign();
    const tent = (x: number) => k + sign * h * Math.max(0, 1 - Math.abs(x - c) / w);
    const tip = k + sign * h;
    return ask(
      [
        "The solid graph is $f_n$ and the dashed line is $f$. What is $\\sup_x |f_n(x) - f(x)|$ on the interval shown?",
        "实线是 $f_n$，虚线是 $f$。在所示区间上 $\\sup_x |f_n(x) - f(x)|$ 是多少？",
      ],
      h,
      [Math.abs(tip) === h ? h + 1 : Math.abs(tip), 2 * h, w === h ? h + 2 : w],
      [
        `The two graphs agree outside the bump. The largest gap is at the tip of the bump, at height $${tip}$, and that is $${h}$ away from the line at height $${k}$.`,
        `两个图在凸起之外重合。最大距离在凸起的顶端，高度为 $${tip}$，与高度 $${k}$ 的直线相距 $${h}$。`,
      ],
      fig(
        { xMin: -7, xMax: 7, yMin: -7, yMax: 7 },
        [
          { kind: "curve", f: tent, from: -7, to: 7, accent: true },
          { kind: "segment", a: [-7, k], b: [7, k], dashed: true },
        ],
        [
          `A horizontal dashed line at height ${k} and a graph with one bump reaching height ${tip} at x = ${c}.`,
          `高度 ${k} 处的水平虚线，和一个在 x = ${c} 处有一个凸起、高度达到 ${tip} 的图。`,
        ],
      ),
    );
  },
);

const cobweb = point(
  "the-fixed-point-of-a-drawn-cobweb",
  ["The fixed point of a drawn cobweb", "图中蛛网的不动点"],
  [
    "Iterating a contraction from any start converges to its unique fixed point, which is where the graph meets the line $y = x$. A cobweb draws the iteration by bouncing between the graph and that line. It tightens around the fixed point, so the limit can be read from the drawing without following any of the steps.",
    "从任意起点迭代压缩映射，都收敛到唯一的不动点，也就是图与直线 $y = x$ 的交点。蛛网图通过在图和这条直线之间来回反弹表示迭代。它在不动点周围收紧，所以不必跟踪每一步，就能从图中读出极限。",
  ],
  (rng) => {
    const p = rng.int(-3, 3);
    const m = rng.pick([0.5, -0.5, 0.4, -0.6]);
    const x0 = p + rng.pick([-4, -3, 3, 4]);
    const f = (x: number) => p + m * (x - p);
    const path: Point[] = [[x0, x0]];
    let x = x0;
    for (let i = 0; i < 6; i++) {
      const y = f(x);
      path.push([x, y], [y, y]);
      x = y;
    }
    const first = f(x0);
    const round = Math.round(first);
    return ask(
      [
        "The solid straight line is the graph of a contraction $f$, and the thin line is $y = x$. The cobweb shows the iteration $x_{k+1} = f(x_k)$. What does the iteration converge to?",
        "粗直线是压缩映射 $f$ 的图，细线是 $y = x$。蛛网图表示迭代 $x_{k+1} = f(x_k)$。迭代收敛到什么值？",
      ],
      p,
      [x0, round === p ? p + 1 : round, p + (p === 0 ? 2 : -2 * Math.sign(p))],
      [
        `The cobweb closes in on the point where the graph meets $y = x$, which is at $x = ${p}$. There $f(x) = x$, so it is the fixed point and the limit.`,
        `蛛网收紧到图与 $y = x$ 的交点，即 $x = ${p}$。那里 $f(x) = x$，所以它是不动点，也是极限。`,
      ],
      fig(
        { xMin: -8, xMax: 8, yMin: -8, yMax: 8 },
        [
          { kind: "curve", f, accent: true },
          { kind: "line", a: [0, 0], b: [1, 1] },
          { kind: "path", points: path },
        ],
        [
          `A sloping line and the line y = x, with a cobweb path starting from x = ${x0}.`,
          `一条斜线和直线 y = x，蛛网路径从 x = ${x0} 出发。`,
        ],
      ),
    );
  },
);

const openClosed = point(
  "open-or-closed-on-a-drawn-line",
  ["Open or closed on a drawn line", "在图中数轴上判断开闭"],
  [
    "A set of reals is open when each of its points has a small interval around it inside the set, and closed when it contains all its limit points. An interval is open when neither end belongs, closed when both ends belong, and neither when only one end belongs. A set made of several intervals needs every end to agree.",
    "实数集是开集，当它的每一点都有一个小区间包含在集合内；是闭集，当它包含所有极限点。区间两端都不属于时是开的，都属于时是闭的，只有一端属于时既不开也不闭。由几个区间组成的集合要求所有端点都一致。",
  ],
  (rng) => {
    const count = rng.int(1, 2);
    const ends = rng.sample([-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7], 2 * count).sort((a, b) => a - b);
    const mode = rng.pick(["open", "closed", "neither"] as const);
    const flags = ends.map((_, i) => (mode === "open" ? false : mode === "closed" ? true : i === 0));
    if (mode === "neither" && count === 2 && rng.bool()) {
      flags[0] = false;
      flags[3] = true;
    }
    const x = (v: number) => 160 + v * 19;
    let body = `<line x1="14" y1="50" x2="306" y2="50"/>`;
    for (let v = -7; v <= 7; v++)
      body += `<line x1="${x(v)}" y1="46" x2="${x(v)}" y2="54"/>${v % 2 === 1 ? label(x(v), 74, String(v).replace("-", "−")) : ""}`;
    for (let i = 0; i < count; i++)
      body += `<line class="accent" stroke="currentColor" stroke-width="3" x1="${x(ends[2 * i] as number)}" y1="50" x2="${x(ends[2 * i + 1] as number)}" y2="50"/>`;
    ends.forEach((e, i) => {
      body += `<circle class="accent" cx="${x(e)}" cy="50" r="5" fill="${flags[i] ? "currentColor" : "none"}" stroke="currentColor"/>`;
    });
    const names: Record<string, Pair> = {
      open: ["Open, and not closed", "是开集，不是闭集"],
      closed: ["Closed, and not open", "是闭集，不是开集"],
      neither: ["Neither open nor closed", "既不是开集也不是闭集"],
      both: ["Both open and closed", "既是开集也是闭集"],
    };
    const reason: Pair =
      mode === "open"
        ? ["No end point belongs to the set, so each point has room around it", "端点都不属于集合，所以每一点周围都有空间"]
        : mode === "closed"
          ? ["Every end point belongs to the set, so it holds all its limit points", "每个端点都属于集合，所以它包含所有极限点"]
          : [
              "A filled end point has no room around it, and an open end point is a limit point that is missing",
              "实心端点周围没有空间，空心端点是缺失的极限点",
            ];
    return choose(
      rng,
      [
        "The thick segments show a set of reals, with filled circles for points in the set and open circles for points outside it. What kind of set is it?",
        "粗线段表示一个实数集，实心圆是集合中的点，空心圆是集合外的点。这是哪种集合？",
      ],
      names[mode] as Pair,
      Object.keys(names)
        .filter((n) => n !== mode)
        .map((n) => names[n] as Pair),
      [`${reason[0]}. So the set is ${(names[mode] as Pair)[0].toLowerCase()}.`, `${reason[1]}。所以这个集合${(names[mode] as Pair)[1]}。`],
      {
        svg: svgDocument(90, body),
        alt: t(
          `A set on a number line with end points ${ends.join(", ")}. ${mode === "open" ? "No end point belongs to the set" : mode === "closed" ? "Every end point belongs to the set" : "Some end points are filled and others are open"}.`,
          `数轴上的集合，端点为 ${ends.join("，")}。${mode === "open" ? "端点都不属于集合" : mode === "closed" ? "每个端点都属于集合" : "有的端点是实心，有的是空心"}。`,
        ),
      },
    );
  },
);

/** deeperFiguresRealAnalysisPoints adds knowledge points of Real Analysis that are answered by reading a drawing. */
export const deeperFiguresRealAnalysisPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-epsilon-definition-for-sequences": [epsilonBand],
  "limit-superior-and-limit-inferior": [limsupPlot],
  "subsequences-and-the-bolzano-weierstrass-theorem": [clusterCount],
  "defining-continuity-at-a-point": [holeValue],
  "kinds-of-discontinuities": [discontinuityKind],
  "monotone-functions-and-their-jumps": [jumpsOfStep],
  "functions-of-bounded-variation": [totalVariation],
  "the-intermediate-value-theorem": [crossings],
  "the-extreme-value-theorem": [extremeAttained],
  "upper-and-lower-darboux-sums": [darboux],
  "defining-definite-integrals-using-left-and-right-riemann-sums": [riemannRectangles],
  "the-lebesgue-integral-of-simple-functions": [simpleIntegral],
  "the-mean-value-theorem": [meanValueSlope],
  "pointwise-and-uniform-convergence": [uniformGap],
  "the-contraction-mapping-principle": [cobweb],
  "open-and-closed-sets-of-reals": [openClosed],
};
