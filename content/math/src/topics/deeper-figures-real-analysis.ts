// Knowledge points of Real Analysis that ask the learner to read a drawing: sequence plots with bands, step functions,
// partitions and graphs for continuity. See `deeperFiguresRealAnalysisPoints`.

import type { KnowledgePointDef } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { dec, Q, svgDocument } from "@ga/subject-math";
import { calculusDrawings1 } from "../explanation-drawings-calculus-1.ts";
import { calculusDrawings2 } from "../explanation-drawings-calculus-2.ts";
import { calculusDrawings3 } from "../explanation-drawings-calculus-3.ts";
import { analysisDrawings1 } from "../explanation-drawings-real-analysis-1.ts";

import { why } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";
import { ask, choose, observed, type Pair, point } from "../university-kit.ts";
import { reasoned } from "../wrong-reasons.ts";
import { table } from "./calculus-common.ts";
import { drawn, label } from "./figure-reading-more.ts";
import { solved } from "./real-analysis.ts";

/** fig wraps marks in a figure with its description in both languages. */
const fig = (v: PlaneView, marks: readonly PlaneMark[], [en, zh]: Pair) => drawn(v, marks, t(en, zh));

/** walk writes a solution as labelled steps, each a title and what it says in both languages, followed by a check that takes a second route. */
function walk(parts: readonly (readonly [en: string, zh: string, sayEn: string, sayZh: string])[], check: Pair): Pair {
  const write = (zh: boolean) =>
    `${parts.map(([en, z, se, sz], i) => `${stepLabel(i + 1, en, z)[zh ? "zh-CN" : "en"]} ${zh ? sz : se}`).join("\n\n")}\n\n${zh ? `**检验。** ${check[1]}` : `**Check.** ${check[0]}`}`;
  return [write(false), write(true)];
}

/** num writes a value rounded to three decimal places, without trailing zeros. */
const num = (v: number) => dec(Q.of(Math.round(v * 1000) || 0, 1000));

/** around gives a − 0.01, a − 0.001, a + 0.001 and a + 0.01, rounded to three decimal places. */
const around = (a: number) => [-0.01, -0.001, 0.001, 0.01].map((d) => Math.round((a + d) * 1000) / 1000);

/** valueTable tabulates functions at some x-values to three decimal places; each row is a name in LaTeX and a function. */
function valueTable(xs: readonly number[], rows: readonly (readonly [string, (x: number) => number])[]): string {
  return table(["$x$", ...xs.map((x) => `$${x}$`)], ...rows.map(([name, f]) => [`$${name}$`, ...xs.map((x) => `$${num(f(x))}$`)]));
}

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
    "The definition of a limit asks for an index $N$ after which every term stays within $\\varepsilon$ of the limit. On a plot this is a band around the limit, and $N$ is the first position from which no dot lies outside. One dot inside the band is not enough, because all the later dots must stay inside too.\n\nFor dots at $a_n = \\frac{6}{n}$ tending to 0 and a band of half-width $1.75$, the condition $\\frac{6}{n} < 1.75$ means $n > 3.43$, so $N = 4$.\n\nCheck: $a_3 = 2$ lies outside the band, while $a_4 = 1.5$ lies inside, and the later dots are closer still.\n\n> **Watch out.** When the dots alternate above and below the limit, an early dot may sit inside the band while a later one is outside. Find the last dot outside and take the next position.",
    "极限的定义要求存在下标 $N$，使其后每一项都与极限相差不到 $\\varepsilon$。在图上这是极限周围的一条带，$N$ 是从它开始不再有点落在带外的第一个位置。一个点在带内还不够，后面所有的点都必须留在带内。\n\n对趋向 0 的点 $a_n = \\frac{6}{n}$ 和半宽为 $1.75$ 的带，条件 $\\frac{6}{n} < 1.75$ 就是 $n > 3.43$，所以 $N = 4$。\n\n检验：$a_3 = 2$ 在带外，而 $a_4 = 1.5$ 在带内，后面的点更接近极限。\n\n> **注意。** 当点在极限上下交替时，前面的某个点可能在带内，而后面的点却在带外。要找到最后一个带外的点，再取下一个位置。",
  ],
  (rng) => {
    const L = rng.int(-1, 2);
    const eps = rng.pick([1.35, 1.75, 2.5, 4.5]);
    const form = rng.pick([1, -1, 0]);
    const value = (n: number) => L + (form === 0 ? (n % 2 === 0 ? 6 : -6) : 6 * form) / n;
    const values = Array.from({ length: 12 }, (_, i) => value(i + 1));
    const N = Math.floor(6 / eps) + 1;
    const [before, at] = [num(6 / (N - 1)), num(6 / N)];
    const worked = walk(
      [
        [
          "Find the last dot outside",
          "找最后一个带外的点",
          `The dot at position $${N - 1}$ is about $${before}$ from the limit $${L}$, more than the half-width $${eps}$, so it lies outside the band.`,
          `位置 $${N - 1}$ 的点与极限 $${L}$ 相距约 $${before}$，大于半宽 $${eps}$，所以在带外。`,
        ],
        [
          "Take the next position",
          "取下一个位置",
          `The dot at position $${N}$ is about $${at}$ away, less than $${eps}$, and the distance keeps shrinking, so every later dot is inside too. So $N = ${N}$.`,
          `位置 $${N}$ 的点相距约 $${at}$，小于 $${eps}$，而距离不断缩小，所以后面的每个点也都在带内。所以 $N = ${N}$。`,
        ],
      ],
      [
        `The band runs from $${num(L - eps)}$ to $${num(L + eps)}$. The dot at $${N - 1}$ has height about $${num(value(N - 1))}$, outside it, and the dot at $${N}$ has height about $${num(value(N))}$, inside it.`,
        `带从 $${num(L - eps)}$ 到 $${num(L + eps)}$。位置 $${N - 1}$ 的点高度约为 $${num(value(N - 1))}$，在带外；位置 $${N}$ 的点高度约为 $${num(value(N))}$，在带内。`,
      ],
    );
    return solved(
      [
        "The dots show a sequence tending to the solid line, and the dashed lines bound a band around that limit. What is the smallest $N$ such that every term with $n \\geq N$ lies inside the band?",
        "图中的点是趋向实线的数列，虚线围成极限周围的带。使所有满足 $n \\geq N$ 的项都落在带内的最小 $N$ 是多少？",
      ],
      N,
      [
        why(
          N - 1,
          `That is the position of the last dot outside the band; that dot is about $${before}$ from the limit, more than $${eps}$.`,
          `这是最后一个带外点的位置；那个点与极限相距约 $${before}$，大于 $${eps}$。`,
        ),
        why(
          N + 1,
          `That is one position too late; the dot at $${N}$ is already inside, about $${at}$ from the limit.`,
          `这晚了一个位置；位置 $${N}$ 的点已经在带内，与极限相距约 $${at}$。`,
        ),
        why(
          N + 2,
          `That is two positions too late; it works, but the question asks for the smallest $N$, which is $${N}$.`,
          `这晚了两个位置；它也满足，但题目要的是最小的 $N$，即 $${N}$。`,
        ),
      ],
      t(worked[0], worked[1]),
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
    "The limit superior of a sequence is the largest value that a subsequence approaches, and the limit inferior is the smallest. They ignore any finite number of early terms. So a tall first dot may be the supremum of the sequence and still have nothing to do with the limit superior, which depends only on the long-run behaviour.\n\nIf the odd terms are $2 + \\frac{3}{n}$ and the even terms are $-1 - \\frac{3}{n}$, the first dot $a_1 = 5$ is the largest term, but the limit superior is 2 and the limit inferior is $-1$.\n\nCheck: far along, $a_{13} \\approx 2.23$ and $a_{14} \\approx -1.21$, already close to 2 and $-1$.\n\n> **Watch out.** The supremum of the terms and the limit superior are different things. Read where the branches level off, not the highest dot.",
    "数列的上极限是子列能趋向的最大值，下极限是最小值。它们不考虑前面有限多项。所以很高的第一个点可能是数列的上确界，却与上极限无关，上极限只取决于长期行为。\n\n若奇数项是 $2 + \\frac{3}{n}$，偶数项是 $-1 - \\frac{3}{n}$，第一个点 $a_1 = 5$ 是最大的项，但上极限是 2，下极限是 $-1$。\n\n检验：往后看，$a_{13} \\approx 2.23$，$a_{14} \\approx -1.21$，已经接近 2 和 $-1$。\n\n> **注意。** 各项的上确界与上极限是不同的东西。要读两支最终稳定的高度，而不是最高的点。",
  ],
  (rng) => {
    const up = rng.int(1, 4);
    const down = rng.int(-4, 0);
    const askUp = rng.bool();
    const value = (n: number) => (n % 2 === 1 ? up + 3 / n : down - 3 / n);
    const values = Array.from({ length: 14 }, (_, i) => value(i + 1));
    const right = askUp ? up : down;
    const name = askUp ? "\\limsup" : "\\liminf";
    const worked = walk(
      [
        [
          "Follow the two branches",
          "看两支",
          `The odd terms settle at $${up}$ and the even terms at $${down}$, so these are the only limits of subsequences.`,
          `奇数项稳定在 $${up}$，偶数项稳定在 $${down}$，所以子列的极限只有这两个。`,
        ],
        [
          "Ignore the early dots",
          "不管前面的点",
          `The first dots, such as $a_1 = ${up + 3}$, stick out beyond the branches, but finitely many terms do not change a limit of a subsequence.`,
          `前面的点，例如 $a_1 = ${up + 3}$，超出了两支，但有限多项不改变子列的极限。`,
        ],
        [
          `Take the ${askUp ? "larger" : "smaller"} limit`,
          askUp ? "取较大的极限" : "取较小的极限",
          `The ${askUp ? "larger" : "smaller"} of $${up}$ and $${down}$ is $${right}$.`,
          `$${up}$ 和 $${down}$ 中较${askUp ? "大" : "小"}的是 $${right}$。`,
        ],
      ],
      [
        `Far along, $a_{13} \\approx ${num(value(13))}$ and $a_{14} \\approx ${num(value(14))}$, already close to $${up}$ and $${down}$.`,
        `往后看，$a_{13} \\approx ${num(value(13))}$，$a_{14} \\approx ${num(value(14))}$，已经接近 $${up}$ 和 $${down}$。`,
      ],
    );
    return solved(
      [
        `The dots show a sequence, and the pattern continues in the same way. What is $${name} a_n$?`,
        `图中的点是一个数列，规律一直持续。$${name} a_n$ 是多少？`,
      ],
      right,
      [
        why(
          askUp ? down : up,
          `That is the limit ${askUp ? "inferior" : "superior"}, where the ${askUp ? "even" : "odd"} terms settle; the ${askUp ? "larger" : "smaller"} limit is wanted.`,
          `这是${askUp ? "下" : "上"}极限，即${askUp ? "偶" : "奇"}数项稳定的高度；题目要的是较${askUp ? "大" : "小"}的极限。`,
        ),
        askUp
          ? why(
              up + 3,
              `That is the first dot $a_1$, the largest term; the odd terms come down to $${up}$, and one early term does not count.`,
              `这是第一个点 $a_1$，即最大的项；奇数项降到 $${up}$，一个前面的项不算数。`,
            )
          : why(
              down - 3,
              `That pushes the lower branch down by the overshoot 3 of the first dot; the even terms come up to $${down}$, and early terms do not count.`,
              `这把下面一支按第一个点超出的 3 往下推了；偶数项升到 $${down}$，前面的项不算数。`,
            ),
        why(
          Q.of(up + down + (up + down === 0 ? 1 : 0), 2),
          "That lies between the two branches; the terms keep jumping from one branch to the other, so no subsequence approaches it.",
          "这在两支之间；各项一直在两支之间跳动，所以没有子列趋向它。",
        ),
      ],
      t(worked[0], worked[1]),
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
    "A bounded sequence always has a convergent subsequence, by the Bolzano-Weierstrass theorem, and it may have several limits of subsequences. On a plot, each height that the dots keep returning to forever is one such limit. Count the heights, and note that the dots need not settle in order for a height to count.\n\nIf the terms cycle through heights near 1, 4 and $-2$, getting closer each time, the sequence has 3 limits of subsequences: 1, 4 and $-2$.\n\nCheck: $a_1, a_4, a_7, \\dots$ approach 1, $a_2, a_5, a_8, \\dots$ approach 4 and $a_3, a_6, a_9, \\dots$ approach $-2$, and any convergent subsequence has infinitely many terms in one of these classes, so its limit is one of the three.\n\n> **Watch out.** Count heights, not dots. The early dots sit a little off their heights, and they do not add limits of their own.",
    "由波尔查诺-魏尔斯特拉斯定理，有界数列总有收敛子列，并且子列极限可能不止一个。在图上，点无限次回到的每个高度都是一个这样的极限。数一数这些高度，注意点不必依次稳定，这个高度也算。\n\n若各项轮流靠近 1、4 和 $-2$，并且一次比一次更近，那么数列有 3 个子列极限：1、4 和 $-2$。\n\n检验：$a_1, a_4, a_7, \\dots$ 趋向 1，$a_2, a_5, a_8, \\dots$ 趋向 4，$a_3, a_6, a_9, \\dots$ 趋向 $-2$；任何收敛子列都有无限多项落在其中一类里，所以它的极限是这三个之一。\n\n> **注意。** 要数高度，不是数点。前面的点稍稍偏离各自的高度，它们不会带来新的极限。",
  ],
  (rng) => {
    const k = rng.int(2, 5);
    const heights = rng.sample([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6], k);
    const values = Array.from({ length: 20 }, (_, i) => {
      const h = heights[i % k] as number;
      return h + 0.8 / (i + 1);
    });
    const levels = [...heights].sort((a, b) => a - b).join(", ");
    const worked = walk(
      [
        [
          "Find the heights",
          "找出高度",
          `Far to the right the dots keep returning to the heights $${levels}$, one after another in a repeating pattern of ${k} terms.`,
          `在右边，点按 ${k} 项一组的规律不断回到高度 $${levels}$。`,
        ],
        [
          "Count them",
          "数一数",
          `Each height is the limit of the subsequence of terms approaching it, so there are $${k}$ different limits.`,
          `每个高度都是趋向它的那些项组成的子列的极限，所以共有 $${k}$ 个不同的极限。`,
        ],
      ],
      [
        `The terms $a_1, a_{${k + 1}}, a_{${2 * k + 1}}, \\dots$ approach $${heights[0]}$, and so on for each starting term up to $a_{${k}}$. Every term lies in one of these ${k} subsequences, so any convergent subsequence has a limit among the ${k} heights.`,
        `$a_1, a_{${k + 1}}, a_{${2 * k + 1}}, \\dots$ 趋向 $${heights[0]}$，从 $a_{${k}}$ 以前的每一项开始都类似。每一项都属于这 ${k} 个子列之一，所以任何收敛子列的极限都在这 ${k} 个高度之中。`,
      ],
    );
    return solved(
      [
        "The dots show a sequence, whose pattern repeats and settles. How many different limits do its convergent subsequences have?",
        "图中的点是一个数列，其规律重复并逐渐稳定。它的收敛子列有多少个不同的极限？",
      ],
      k,
      [
        why(
          k - 1,
          `That leaves out one height; the dots return to ${k} different heights, $${levels}$.`,
          `这漏掉了一个高度；点回到 ${k} 个不同的高度：$${levels}$。`,
        ),
        why(
          k + 1,
          "That counts an extra height, such as the first dot's; early dots sit a little above their heights and do not form a height of their own.",
          "这多数了一个高度，比如第一个点的高度；前面的点稍稍高于各自的高度，并不构成新的高度。",
        ),
        why(
          1,
          `That treats the sequence as convergent; it keeps returning to ${k} different heights, so it has ${k} limits of subsequences and does not converge.`,
          `这把数列当作收敛的；它不断回到 ${k} 个不同的高度，所以有 ${k} 个子列极限，并不收敛。`,
        ),
        why(
          0,
          "A bounded sequence always has a convergent subsequence, by the Bolzano-Weierstrass theorem, so there is at least one limit.",
          "由波尔查诺-魏尔斯特拉斯定理，有界数列总有收敛子列，所以至少有一个极限。",
        ),
      ],
      t(worked[0], worked[1]),
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
      "A function is continuous at a point when its limit there exists and equals its value. If the graph has a hole at $a$ and a separate dot, the limit is the height of the hole, whatever the dot does. To repair the discontinuity, the function value must be moved to the height of the hole.\n\nFor example, if the curve runs into an open circle at $(1, 3)$ and a filled dot sits at $(1, 5)$, the limit at $1$ is $3$ and $f(1) = 5$, so $f(1)$ must be changed to $3$.\n\nCheck: if the curve is $y = x + 2$ near $x = 1$, its heights at $0.99$ and $1.01$ are $2.99$ and $3.01$, close to $3$ and not to $5$.\n\n> **Watch out.** The filled dot is the current value, not the limit. The limit is read from the open circle that the curve runs into.",
      "函数在一点连续，是指它在该点的极限存在并等于函数值。如果图在 $a$ 处有空洞，另有一个单独的点，那么极限是空洞的高度，与那个点无关。要消除间断，函数值必须移到空洞的高度。\n\n例如，若曲线通向 $(1, 3)$ 处的空心圆，而实心点在 $(1, 5)$，那么在 $1$ 处的极限是 $3$，$f(1) = 5$，所以 $f(1)$ 必须改为 $3$。\n\n检验：若曲线在 $x = 1$ 附近是 $y = x + 2$，它在 $0.99$ 和 $1.01$ 处的高度是 $2.99$ 和 $3.01$，接近 $3$ 而不是 $5$。\n\n> **注意。** 实心点是当前的函数值，不是极限。极限要从曲线所通向的空心圆读出。",
    ],
    (rng) => {
      const a = rng.int(-3, 3);
      const hole = rng.int(-3, 4);
      let dot = rng.int(-4, 5);
      if (dot === hole) dot = hole + 2;
      const slope = rng.pick([-1, -0.5, 0.5, 1]);
      const bend = rng.pick([-0.2, 0, 0.15]);
      const f = (x: number) => hole + slope * (x - a) + bend * (x - a) ** 2;
      const rows = valueTable(around(a), [["f(x)", f]]);
      return ask(
        [
          "The graph of $f$ has one point of discontinuity. To what value must $f$ be changed at that point to make it continuous there?",
          "$f$ 的图有一个间断点。要使它在那里连续，$f$ 在该点的值必须改成多少？",
        ],
        hole,
        [dot, a === hole || a === dot ? hole + 1 : a, hole - 1],
        walk(
          [
            [
              "Read the limit",
              "读出极限",
              `Approaching $x = ${a}$ from both sides, the graph heads to the open circle at height $${hole}$, so the limit is $${hole}$.`,
              `从两侧趋近 $x = ${a}$ 时，图都趋向高度 $${hole}$ 的空心圆，所以极限是 $${hole}$。`,
            ],
            [
              "Compare with the value",
              "与函数值比较",
              `The separate dot gives $f(${a}) = ${dot}$, the current value. It must be moved to $${hole}$ to match the limit.`,
              `单独的点给出 $f(${a}) = ${dot}$，这是当前的函数值。必须把它移到 $${hole}$ 才能与极限相等。`,
            ],
          ],
          [
            `Read the heights of the drawn curve just beside $x = ${a}$:\n\n${rows}\n\nThey close in on $${hole}$, not on $${dot}$, so $${hole}$ is the value that repairs the hole.`,
            `读出图中曲线在 $x = ${a}$ 两旁的高度：\n\n${rows}\n\n这些值逼近 $${hole}$ 而不是 $${dot}$，所以补上空洞的值是 $${hole}$。`,
          ],
        ),
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

const discontinuityKind = {
  ...point(
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
  ),
  figure: analysisDrawings1["kinds-of-discontinuities#the-kind-of-a-drawn-discontinuity"],
};

const jumpsOfStep = {
  ...point(
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
  ),
  figure: analysisDrawings1["monotone-functions-and-their-jumps#the-jumps-of-a-monotone-step-graph"],
};

const totalVariation = {
  ...point(
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
  ),
  figure: analysisDrawings1["functions-of-bounded-variation#the-total-variation-of-a-drawn-path"],
};

const crossings = {
  ...point(
    "intermediate-values-at-a-drawn-level",
    ["Intermediate values at a drawn level", "图中水平线处的介值"],
    [
      "If a continuous function is below a level at one point and above it at another, the intermediate value theorem gives a solution between them. Each change of side forces a separate crossing. Counting the changes of side along a graph gives the number of solutions the theorem guarantees, and the drawn graph shows how the sides change.\n\nFor example, straight pieces through the heights $2, -1, 3, 4$ against the level $0$ go above, below, above, above. The side changes twice, so $f(x) = 0$ has two solutions.\n\nCheck: the piece from $2$ to $-1$ crosses $0$, the piece from $-1$ to $3$ crosses it again, and the piece from $3$ to $4$ stays above.\n\n> **Watch out.** Count changes of side, not pieces or peaks. A piece that stays on one side of the level, however steep, gives no solution.",
      "如果连续函数在一点低于某水平，在另一点高于它，介值定理就保证它们之间有解。每换一次边都迫使出现一次单独的穿越。沿着图数换边的次数，就得到定理保证的解的个数，而图显示了换边的情况。\n\n例如，经过高度 $2, -1, 3, 4$ 的直线段相对于水平 $0$ 依次在上、下、上、上。换边两次，所以 $f(x) = 0$ 有两个解。\n\n检验：从 $2$ 到 $-1$ 的一段穿过 $0$，从 $-1$ 到 $3$ 的一段再次穿过，从 $3$ 到 $4$ 的一段始终在上方。\n\n> **注意。** 要数换边的次数，而不是线段或峰的个数。始终在水平线同一侧的线段，无论多陡，都不给出解。",
    ],
    (rng) => {
      const n = rng.int(5, 8);
      const level = rng.int(-1, 2);
      const h = Array.from({ length: n + 1 }, () => rng.int(-4, 5) + 0);
      const adjusted = h.map((v) => (v === level ? v + 1 : v));
      let count = 0;
      for (let i = 0; i < n; i++) if (((adjusted[i] as number) - level) * ((adjusted[i + 1] as number) - level) < 0) count++;
      const xs = adjusted.map((_, i) => i);
      const rows = valueTable(xs, [
        ["f(x)", (x) => adjusted[x] as number],
        ["f(x) - k", (x) => (adjusted[x] as number) - level],
      ]);
      return ask(
        [
          "The continuous function drawn is defined on the whole interval shown, and the dashed line is a level $k$. How many solutions does $f(x) = k$ have on the interval?",
          "图中的连续函数定义在所示整个区间上，虚线是水平 $k$。$f(x) = k$ 在该区间上有多少个解？",
        ],
        count,
        [count + 1, count === 0 ? 2 : count - 1, n],
        walk(
          [
            [
              "Read the pieces",
              "读出各段",
              `The graph is made of straight pieces between $x = 0$ and $x = ${n}$, and the level is $k = ${level}$. Each piece meets the level at most once, and does so exactly when it changes side.`,
              `图由 $x = 0$ 到 $x = ${n}$ 之间的直线段组成，水平是 $k = ${level}$。每段至多与水平线相交一次，恰好在换边时相交。`,
            ],
            [
              "Count the changes of side",
              "数换边的次数",
              `Going from left to right, the graph changes side $${count}$ times, so $f(x) = k$ has $${count}$ solutions.`,
              `从左到右，图换边 $${count}$ 次，所以 $f(x) = k$ 有 $${count}$ 个解。`,
            ],
          ],
          [
            `Read the height at each corner and subtract the level:\n\n${rows}\n\nThe sign of $f(x) - k$ changes between adjacent corners exactly $${count}$ times, once for each solution.`,
            `读出每个拐点的高度并减去水平值：\n\n${rows}\n\n$f(x) - k$ 的符号在相邻拐点之间恰好改变 $${count}$ 次，每次对应一个解。`,
          ],
        ),
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
      "The extreme value theorem needs a continuous function on a closed bounded interval. If the top of a graph sits at an open circle, the function comes arbitrarily close to that height but never reaches it, so there is no maximum. If the top is on the graph itself, the maximum is attained there, whatever the hypotheses say. For example, the graph of $f(x) = x + 1$ on $[-2, 3)$ climbs toward an open circle at $(3, 4)$, so $f$ has no maximum.\n\nCheck: $f(2.9) = 3.9$, $f(2.99) = 3.99$ and $f(2.999) = 3.999$ get ever closer to $4$, and each is beaten by a point further right, so no value is the largest.\n\n> **Watch out.** Read the circles, not just the height. An open circle at the top means the height is not attained, and a filled peak inside means it is, even when the ends of the graph are open.",
      "极值定理要求函数在有界闭区间上连续。如果图的最高处是空心圆，函数能任意接近这个高度却永远达不到，所以没有最大值。如果最高处就在图上，最大值就在那里取到，不管定理的条件是否满足。例如，$[-2, 3)$ 上 $f(x) = x + 1$ 的图像向 $(3, 4)$ 处的空心圆上升，所以 $f$ 没有最大值。\n\n检验：$f(2.9) = 3.9$，$f(2.99) = 3.99$，$f(2.999) = 3.999$ 越来越接近 $4$，而每一个都被更靠右的点超过，所以没有哪个值是最大的。\n\n> **注意。** 要看圆圈，不只看高度。最高处是空心圆，说明这个高度取不到；最高点在内部且是实心的，说明能取到，即使图像两端是空心的。",
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
      const height = (x: number) =>
        kind === "openEnd" ? rise(x) : kind === "jumpTop" ? (x < c ? top - (c - x) * 0.7 : top - 3 - (x - c) * 0.3) : left(x);
      const xs = attained ? [c - 1, c, c + 1] : [where - 0.1, where - 0.01, where - 0.001].map((x) => Math.round(x * 1000) / 1000);
      const others = attained ? [b, a, c + 1] : [a, where === b ? c : b];
      const missing: Pair =
        kind === "openEnd"
          ? [`The point at $x = ${b}$ is an open circle, so it is not on the graph`, `$x = ${b}$ 处是空心圆，所以不在图上`]
          : [
              `The value at $x = ${c}$ is the filled dot at height $${top - 3}$, below the graph just to its left`,
              `$x = ${c}$ 处的函数值是高度为 $${top - 3}$ 的实心点，低于它左边紧挨着的图像`,
            ];
      return reasoned(
        choose(
          rng,
          [
            "Filled and open circles show which points belong to the function drawn. What can be said about its maximum on its domain?",
            "实心圆和空心圆表示哪些点属于图中函数。关于它在定义域上的最大值，可以得出什么结论？",
          ],
          attained ? at(where) : none,
          attained ? [none, at(b), at(a), at(c + 1)] : [at(where), at(a), at(where === b ? c : b)],
          walk(
            [
              ["Find the top of the graph", "找出图像的最高处", `${reason[0]}.`, `${reason[1]}。`],
              [
                "Conclude",
                "得出结论",
                attained
                  ? `So the maximum is attained at $x = ${where}$, with value $${top}$.`
                  : `So the height $${top}$ is approached but never reached, and no value of $f$ is the largest: there is no maximum.`,
                attained
                  ? `所以最大值在 $x = ${where}$ 处取到，值为 $${top}$。`
                  : `所以高度 $${top}$ 只能接近，永远达不到，$f$ 没有哪个值是最大的：没有最大值。`,
              ],
            ],
            [
              `${attained ? `Heights of the graph around the peak` : `Heights of the graph approaching $x = ${where}$ from the left`}:\n\n${valueTable(xs, [["f(x)", height]])}\n\n${attained ? `The middle value is the largest, as at a maximum.` : `They keep rising toward $${top}$, and each is beaten by the next.`}`,
              `${attained ? "最高点附近图像的高度" : `从左侧趋向 $x = ${where}$ 时图像的高度`}：\n\n${valueTable(xs, [["f(x)", height]])}\n\n${attained ? "中间的值最大，符合最大值的情形。" : `它们不断上升并趋于 $${top}$，每一个都被下一个超过。`}`,
            ],
          ),
          fig({ xMin: -7, xMax: 7, yMin: -7, yMax: 7 }, marks, [
            `A graph from x = ${a} to x = ${b}. ${observed(reason)[0].replaceAll("$", "")}.`,
            `从 x = ${a} 到 x = ${b} 的图。${observed(reason)[1].replaceAll("$", "")}。`,
          ]),
        ),
        attained
          ? [
              [
                none[0],
                `The highest point, at $x = ${where}$, is on the graph, so the maximum is attained.`,
                `最高点在 $x = ${where}$，它在图上，所以最大值能取到。`,
              ],
              ...others.map((v): [string, string, string] => [
                at(v)[0],
                `The graph is lower at $x = ${v}$ than at $x = ${where}$.`,
                `图像在 $x = ${v}$ 处比在 $x = ${where}$ 处低。`,
              ]),
            ]
          : [
              [at(where)[0], `${missing[0]}.`, `${missing[1]}。`],
              ...others.map((v): [string, string, string] => [
                at(v)[0],
                `Points just left of $x = ${where}$ are higher than the graph at $x = ${v}$.`,
                `$x = ${where}$ 左边紧挨着的点比图像在 $x = ${v}$ 处更高。`,
              ]),
            ],
      );
    },
  ),
  figure: calculusDrawings2["the-extreme-value-theorem#whether-a-drawn-maximum-is-attained"],
};

const darboux = point(
  "a-darboux-sum-on-a-drawn-partition",
  ["A Darboux sum on a drawn partition", "图中分割上的达布和"],
  [
    "An upper Darboux sum multiplies the width of each piece of a partition by the largest value of the function on that piece, and a lower sum uses the smallest. For an increasing function, the largest value on a piece is at its right end, and for a decreasing function it is at its left end.\n\nFor $f(x) = x + 1$ on $[0, 3]$ with the cuts $0, 1, 3$, the upper sum is $1 \\times 2 + 2 \\times 4 = 10$ and the lower sum is $1 \\times 1 + 2 \\times 2 = 5$.\n\nCheck: the exact area under the line is $\\frac{(1 + 4) \\times 3}{2} = 7.5$, which lies between the lower sum 5 and the upper sum 10.\n\n> **Watch out.** For a decreasing function the ends swap: the largest value on a piece is at its left end. Read the direction of the line before choosing the heights.",
    "达布上和把分割每一段的宽度乘以函数在该段上的最大值，下和则用最小值。对于增函数，一段上的最大值在右端；对于减函数，则在左端。\n\n对 $[0, 3]$ 上的 $f(x) = x + 1$ 和分割点 $0, 1, 3$，上和是 $1 \\times 2 + 2 \\times 4 = 10$，下和是 $1 \\times 1 + 2 \\times 2 = 5$。\n\n检验：直线下方的准确面积是 $\\frac{(1 + 4) \\times 3}{2} = 7.5$，介于下和 5 与上和 10 之间。\n\n> **注意。** 对于减函数，两端要对调：一段上的最大值在左端。选高度之前先看直线的方向。",
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
      parts.push(`${q - p} \\times ${upper ? hi : lo}`);
    }
    const end = cuts[3] as number;
    const exact = Q.of((f(0) + f(end)) * end, 2);
    const answer = upper ? U : L;
    const marks: PlaneMark[] = [
      { kind: "curve", f, from: 0, to: end, accent: true },
      ...cuts.map((c): PlaneMark => ({ kind: "segment", a: [c, 0], b: [c, f(c)], dashed: true })),
    ];
    const widths = cuts.slice(1).map((c, i) => c - (cuts[i] as number));
    const side = (up ? upper : !upper) ? "right" : "left";
    const worked = walk(
      [
        [
          "Read the partition",
          "读出分割",
          `The cuts are at $${cuts.join(", ")}$, so the pieces have widths $${widths.join(", ")}$.`,
          `分割点是 $${cuts.join(", ")}$，所以各段宽度是 $${widths.join(", ")}$。`,
        ],
        [
          "Pick the heights",
          "选高度",
          `The line is ${up ? "increasing" : "decreasing"}, so the ${upper ? "largest" : "smallest"} value on each piece is at its ${side} end.`,
          `直线${up ? "递增" : "递减"}，所以每段上的${upper ? "最大" : "最小"}值在它的${side === "right" ? "右" : "左"}端。`,
        ],
        [
          "Add the pieces",
          "把各段加起来",
          `Each piece contributes its width times that height: $${parts.join(" + ")} = ${answer}$.`,
          `每段贡献其宽度乘以这个高度：$${parts.join(" + ")} = ${answer}$。`,
        ],
      ],
      [
        `The exact integral is the average of the end heights times the length, $\\frac{${f(0) + f(end)} \\times ${end}}{2} = ${exact.toLatex()}$, and the ${upper ? "upper" : "lower"} sum $${answer}$ lies ${upper ? "above" : "below"} it, as it must.`,
        `准确的积分是两端高度的平均值乘长度，$\\frac{${f(0) + f(end)} \\times ${end}}{2} = ${exact.toLatex()}$，而${upper ? "上" : "下"}和 $${answer}$ 在它的${upper ? "上方" : "下方"}，理应如此。`,
      ],
    );
    return solved(
      [
        `The dashed lines mark a partition of the interval for the increasing or decreasing function drawn. What is the ${upper ? "upper" : "lower"} Darboux sum for this partition?`,
        `虚线标出图中单调函数所在区间的一个分割。这个分割的达布${upper ? "上" : "下"}和是多少？`,
      ],
      answer,
      [
        why(
          upper ? L : U,
          `That is the ${upper ? "lower" : "upper"} sum, which uses the ${upper ? "smallest" : "largest"} height on each piece.`,
          `这是${upper ? "下" : "上"}和，它用的是每段上${upper ? "最小" : "最大"}的高度。`,
        ),
        exact.eq(Q.of(answer, 1))
          ? why(
              answer + 1,
              `That is one more than the sum; recheck each width times height, $${parts.join(" + ")}$.`,
              `这比和多一；重新检查每段的宽度乘高度：$${parts.join(" + ")}$。`,
            )
          : why(
              exact,
              `That is the exact integral of the line; the ${upper ? "upper" : "lower"} sum lies ${upper ? "above" : "below"} it.`,
              `这是直线的准确积分；${upper ? "上" : "下"}和在它的${upper ? "上方" : "下方"}。`,
            ),
        why(
          answer + 2,
          `That misreads a width or a height; the widths are $${widths.join(", ")}$ and the heights come from the ${side} ends.`,
          `这读错了某个宽度或高度；各段宽度是 $${widths.join(", ")}$，高度取自${side === "right" ? "右" : "左"}端。`,
        ),
      ],
      t(worked[0], worked[1]),
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
      "A Riemann sum picks one height for each piece of the interval. Rectangles touching the graph at their left corners make a left sum, and those touching it at their right corners make a right sum. The value is the total area of the rectangles, which is the sum of the heights times the common width.\n\nSay the graph passes through heights $2, 4, 3, 5$ at $x = 0, 1, 2, 3$, and the three rectangles of width $1$ touch it at their left corners. That is a left sum, with value $1 \\cdot (2 + 4 + 3) = 9$.\n\nCheck: the right sum uses $4, 3, 5$ and is $12$. The two differ only in the end heights, $1 \\cdot (5 - 2) = 3$, and indeed $12 - 9 = 3$.\n\n> **Watch out.** $n$ rectangles use only $n$ of the $n + 1$ heights: the left sum leaves out the last one and the right sum the first. And multiply by the width when it is not $1$.",
      "黎曼和为区间的每一段选一个高度。在左上角碰到图的矩形构成左和，在右上角碰到图的构成右和。值是矩形的总面积，也就是各高度之和乘以相同的宽度。\n\n设图在 $x = 0, 1, 2, 3$ 处的高度为 $2, 4, 3, 5$，三个宽为 $1$ 的矩形都在左上角碰到图。这是左和，值为 $1 \\cdot (2 + 4 + 3) = 9$。\n\n检验：右和用 $4, 3, 5$，值为 $12$。两者只在两端的高度上不同，$1 \\cdot (5 - 2) = 3$，而 $12 - 9$ 确实等于 $3$。\n\n> **注意。** $n$ 个矩形只用 $n + 1$ 个高度中的 $n$ 个：左和不用最后一个，右和不用第一个。宽度不是 $1$ 时还要乘以宽度。",
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
      const side = leftSum ? "left" : "right";
      const sideZh = leftSum ? "左" : "右";
      const otherSide = leftSum ? "right" : "left";
      const otherSideZh = leftSum ? "右" : "左";
      const first = h[0] as number;
      const last = h[count] as number;
      const used = leftSum ? h.slice(0, -1) : h.slice(1);
      const unused = leftSum ? h.slice(1) : h.slice(0, -1);
      const all = L + last * width;
      const halved = width === 2 && v / 2 !== other ? v / 2 : null;
      const fourth = halved ?? all;
      return reasoned(
        choose(
          rng,
          ["The rectangles approximate the area under the graph. Which sum do they show?", "这些矩形近似图下方的面积。它们表示哪种和？"],
          option(leftSum, v),
          [option(!leftSum, v), option(leftSum, other), option(!leftSum, other), option(leftSum, fourth)],
          walk(
            [
              [
                "Read the corners",
                "看矩形的角",
                `Each rectangle reaches the graph at its ${side} corner, so this is a ${side} sum, using the heights $${used.join(", ")}$.`,
                `每个矩形在${sideZh}上角碰到图，所以这是${sideZh}和，所用的高度依次为 $${used.join(", ")}$。`,
              ],
              [
                "Add the areas",
                "把面积相加",
                `$$${width} \\cdot (${used.join(" + ")}) = ${v}$$`,
                `$$${width} \\cdot (${used.join(" + ")}) = ${v}$$`,
              ],
            ],
            [
              `The ${otherSide} sum uses $${unused.join(", ")}$ and is $${other}$. The two sums differ only in the end heights, so $R - L$ should be $${width} \\cdot (${last} - ${first}) = ${width * (last - first)}$, and indeed $${R} - ${L} = ${R - L}$.`,
              `${otherSideZh}和用 $${unused.join(", ")}$，值为 $${other}$。两个和只在两端的高度上不同，所以 $R - L$ 应为 $${width} \\cdot (${last} - ${first}) = ${width * (last - first)}$，而 $${R} - ${L}$ 确实等于 $${R - L}$。`,
            ],
          ),
          fig({ xMin: -1, xMax: 8, yMin: -1, yMax: 8 }, marks, [
            `Rectangles of width ${width} and a path through the heights ${h.join(", ")}.`,
            `宽度为 ${width} 的矩形和经过高度 ${h.join("，")} 的折线。`,
          ]),
        ),
        [
          [
            option(!leftSum, v)[0],
            `The value is right, but each rectangle meets the graph at its ${side} corner, which makes a ${side} sum.`,
            `值是对的，但每个矩形在${sideZh}上角碰到图，这是${sideZh}和。`,
          ],
          [
            option(leftSum, other)[0],
            `$${other}$ is the value of the ${otherSide} sum, which uses the heights $${unused.join(", ")}$; the drawn rectangles use $${used.join(", ")}$.`,
            `$${other}$ 是${otherSideZh}和的值，它用的高度是 $${unused.join(", ")}$；图中的矩形用的是 $${used.join(", ")}$。`,
          ],
          [
            option(!leftSum, other)[0],
            `That describes the ${otherSide} sum, which has different rectangles from the ones drawn: these touch the graph at their ${side} corners.`,
            `那描述的是${otherSideZh}和，它的矩形与图中的不同：图中的矩形在${sideZh}上角碰到图。`,
          ],
          halved === null
            ? [
                option(leftSum, all)[0],
                `This uses all $${count + 1}$ heights; $${count}$ rectangles use only $${count}$ of them, leaving out the ${leftSum ? "last" : "first"} one.`,
                `这里用了全部 $${count + 1}$ 个高度；$${count}$ 个矩形只用其中 $${count}$ 个，${leftSum ? "最后" : "第一"}个不用。`,
              ]
            : [
                option(leftSum, halved)[0],
                "This adds the heights without multiplying by the width $2$ of the rectangles.",
                "这里只把高度相加，没有乘以矩形的宽度 $2$。",
              ],
        ],
      );
    },
  ),
  figure: calculusDrawings3["defining-definite-integrals-using-left-and-right-riemann-sums#reading-a-riemann-sum-from-its-rectangles"],
};

const simpleIntegral = {
  ...point(
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
  ),
  figure: analysisDrawings1["the-lebesgue-integral-of-simple-functions#the-integral-of-a-drawn-simple-function"],
};

const meanValueSlope = {
  ...point(
    "the-mean-value-slope-from-a-graph",
    ["The mean value slope from a graph", "由图读中值定理的斜率"],
    [
      "The mean value theorem says that a differentiable function has a point between $a$ and $b$ where the tangent is parallel to the chord. So the derivative at that point equals the slope of the chord, which depends only on the end points. The wiggles between them decide where the point is, but not the slope. For a curve from $A(-2, 1)$ to $B(2, 3)$, the chord rises $2$ over a run of $4$, so some $c$ has $f'(c) = \\frac{1}{2}$.\n\nCheck: starting at $A$ and moving $4$ to the right with slope $\\frac{1}{2}$ rises $2$, from height $1$ to height $3$, which is $B$.\n\n> **Watch out.** The slope is rise over run, not run over rise, and it is negative when $B$ is lower than $A$.",
      "中值定理说，可导函数在 $a$ 和 $b$ 之间有一点，切线与弦平行。所以该点的导数等于弦的斜率，它只取决于两个端点。两点之间的起伏决定这一点在哪里，但不影响斜率。对从 $A(-2, 1)$ 到 $B(2, 3)$ 的曲线，弦在水平距离 $4$ 上升高 $2$，所以存在 $c$ 使 $f'(c) = \\frac{1}{2}$。\n\n检验：从 $A$ 出发向右移动 $4$，以斜率 $\\frac{1}{2}$ 升高 $2$，高度从 $1$ 变为 $3$，正好到达 $B$。\n\n> **注意。** 斜率是升高量除以水平距离，不是反过来；当 $B$ 比 $A$ 低时斜率为负。",
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
      const slopeTerm = slope.sign() < 0 ? `\\left(${slope.toLatex()}\\right)` : slope.toLatex();
      return ask(
        [
          "The function drawn is differentiable. By the mean value theorem, some $c$ between the marked points has what value of $f'(c)$?",
          "图中函数可导。由中值定理，所标两点之间存在 $c$，使 $f'(c)$ 等于多少？",
        ],
        slope,
        [Q.of(run, rise), Q.of(-rise, run), Q.of(rise, 1).eq(slope) ? Q.of(rise + 1, 1) : Q.of(rise, 1)],
        walk(
          [
            [
              "Read the end points",
              "读出端点",
              `The marked points are $A(${a}, ${fa})$ and $B(${b}, ${fb})$, so the run is $${b} - (${a}) = ${run}$ and the rise is $${fb} - ${fa < 0 ? `(${fa})` : fa} = ${rise}$.`,
              `所标两点是 $A(${a}, ${fa})$ 和 $B(${b}, ${fb})$，所以水平距离为 $${b} - (${a}) = ${run}$，升高量为 $${fb} - ${fa < 0 ? `(${fa})` : fa} = ${rise}$。`,
            ],
            [
              "Take the slope of the chord",
              "求弦的斜率",
              `The chord has slope $${slope.toLatex()}$, and the theorem gives a point $c$ where the tangent has that slope, so $f'(c) = ${slope.toLatex()}$.`,
              `弦的斜率为 $${slope.toLatex()}$，定理给出一点 $c$，那里切线的斜率与之相同，所以 $f'(c) = ${slope.toLatex()}$。`,
            ],
          ],
          [
            `Starting at $A$ and moving $${run}$ to the right with this slope changes the height by $${slopeTerm} \\cdot ${run} = ${rise}$, from $${fa}$ to $${fb}$, which is the height of $B$.`,
            `从 $A$ 出发以这个斜率向右移动 $${run}$，高度变化 $${slopeTerm} \\cdot ${run} = ${rise}$，从 $${fa}$ 变为 $${fb}$，正是 $B$ 的高度。`,
          ],
        ),
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

const uniformGap = {
  ...point(
    "the-uniform-distance-from-a-graph",
    ["The uniform distance from a graph", "由图读一致距离"],
    [
      "Uniform convergence measures the largest vertical distance between $f_n$ and $f$ over the whole interval, and this distance must tend to zero. A moving bump is the standard warning: at each fixed point the functions eventually settle, yet the height of the bump stays the same, and so the convergence is not uniform.\n\nIf $f = 1$ and $f_n$ follows it except for a bump reaching height 4, then $\\sup_x |f_n(x) - f(x)| = 4 - 1 = 3$.\n\nCheck: away from the bump the gap is 0, and halfway up the bump it is $1.5$, so the tip gives the largest gap.\n\n> **Watch out.** Measure the gap from the dashed line $f$, not from the $x$-axis. The height of the tip is the gap only when $f = 0$.",
      "一致收敛度量的是 $f_n$ 与 $f$ 在整个区间上的最大竖直距离，这个距离必须趋于零。移动的凸起是典型的警示：在每个固定点上函数最终都会稳定，但凸起的高度不变，所以收敛不一致。\n\n若 $f = 1$，$f_n$ 除了一个达到高度 4 的凸起外都与它重合，那么 $\\sup_x |f_n(x) - f(x)| = 4 - 1 = 3$。\n\n检验：凸起之外距离是 0，在凸起的半高处距离是 $1.5$，所以顶端给出最大距离。\n\n> **注意。** 距离要从虚线 $f$ 量起，而不是从 $x$ 轴量起。只有当 $f = 0$ 时，顶端的高度才等于距离。",
    ],
    (rng) => {
      const k = rng.int(-2, 2);
      const h = rng.int(1, 4);
      const c = rng.int(-3, 3);
      const w = rng.int(1, 2);
      const sign = rng.sign();
      const tent = (x: number) => k + sign * h * Math.max(0, 1 - Math.abs(x - c) / w);
      const tip = k + sign * h;
      const worked = walk(
        [
          [
            "Where the graphs agree",
            "两图重合的地方",
            `Outside the bump the solid graph lies on the dashed line at height $${k}$, so the gap there is 0.`,
            `在凸起之外，实线落在高度 $${k}$ 的虚线上，所以那里的距离是 0。`,
          ],
          [
            "Measure at the tip",
            "在顶端量",
            `The bump reaches height $${tip}$ at $x = ${c}$, so the gap there is $|${tip} - ${k < 0 ? `(${k})` : k}| = ${h}$.`,
            `凸起在 $x = ${c}$ 处达到高度 $${tip}$，所以那里的距离是 $|${tip} - ${k < 0 ? `(${k})` : k}| = ${h}$。`,
          ],
        ],
        [
          `Halfway between the tip and the edge of the bump the gap is $${num(h / 2)}$, smaller than at the tip, so the largest gap is $${h}$.`,
          `在顶端与凸起边缘的中间，距离是 $${num(h / 2)}$，比顶端小，所以最大距离是 $${h}$。`,
        ],
      );
      return solved(
        [
          "The solid graph is $f_n$ and the dashed line is $f$. What is $\\sup_x |f_n(x) - f(x)|$ on the interval shown?",
          "实线是 $f_n$，虚线是 $f$。在所示区间上 $\\sup_x |f_n(x) - f(x)|$ 是多少？",
        ],
        h,
        [
          Math.abs(tip) === h
            ? why(h + 1, `That is more than the gap at the tip, which is exactly $${h}$.`, `这比顶端的距离大，顶端的距离恰好是 $${h}$。`)
            : why(
                Math.abs(tip),
                `That measures the tip from the $x$-axis; measure from the dashed line at height $${k}$ instead.`,
                `这是从 $x$ 轴量的顶端高度；应该从高度 $${k}$ 的虚线量起。`,
              ),
          why(
            2 * h,
            "That doubles the gap, as if going up the bump and back down; the supremum is a single vertical distance.",
            "这把距离加倍了，好像算了上去再下来；上确界是单个竖直距离。",
          ),
          w === h
            ? why(
                h + 2,
                `That is more than the largest gap; the tip is only $${h}$ away from the line.`,
                `这比最大距离大；顶端离直线只有 $${h}$。`,
              )
            : why(
                w,
                "That is the half-width of the bump, a horizontal distance; the uniform distance is measured vertically.",
                "这是凸起的半宽，是水平距离；一致距离是竖直量的。",
              ),
        ],
        t(worked[0], worked[1]),
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
  ),
  figure: analysisDrawings1["pointwise-and-uniform-convergence#the-uniform-distance-from-a-graph"],
};

const cobweb = {
  ...point(
    "the-fixed-point-of-a-drawn-cobweb",
    ["The fixed point of a drawn cobweb", "图中蛛网的不动点"],
    [
      "Iterating a contraction from any start converges to its unique fixed point, which is where the graph meets the line $y = x$. A cobweb draws the iteration by bouncing between the graph and that line. It tightens around the fixed point, so the limit can be read from the drawing without following any of the steps.\n\nFor $f(x) = 2 + 0.5 (x - 2)$ started at $x_0 = 6$, the iterates are $4, 3, 2.5, 2.25, \\dots$, closing in on 2, where the graph meets $y = x$.\n\nCheck: $f(2) = 2 + 0.5 \\cdot 0 = 2$, so 2 is indeed fixed, and each step halves the distance to it.\n\n> **Watch out.** The limit is the crossing with $y = x$, not the starting point or the first bounce of the cobweb.",
      "从任意起点迭代压缩映射，都收敛到唯一的不动点，也就是图与直线 $y = x$ 的交点。蛛网图通过在图和这条直线之间来回反弹表示迭代。它在不动点周围收紧，所以不必跟踪每一步，就能从图中读出极限。\n\n对 $f(x) = 2 + 0.5 (x - 2)$，从 $x_0 = 6$ 开始，迭代值是 $4, 3, 2.5, 2.25, \\dots$，逐渐逼近 2，即图与 $y = x$ 的交点。\n\n检验：$f(2) = 2 + 0.5 \\cdot 0 = 2$，所以 2 确实是不动点，而每一步都使到它的距离减半。\n\n> **注意。** 极限是与 $y = x$ 的交点，而不是起点，也不是蛛网的第一次反弹。",
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
      const wrong = p + (p === 0 ? 2 : -2 * Math.sign(p));
      const worked = walk(
        [
          [
            "Find the crossing",
            "找交点",
            `The graph of $f$ meets the line $y = x$ at $x = ${p}$, where $f(${p}) = ${p}$, so ${p} is the fixed point.`,
            `$f$ 的图与直线 $y = x$ 交于 $x = ${p}$，那里 $f(${p}) = ${p}$，所以 ${p} 是不动点。`,
          ],
          [
            "Follow the cobweb",
            "跟着蛛网走",
            `Each bounce brings the iterate closer to the crossing, by the factor $${num(Math.abs(m))}$, so the iteration converges to $${p}$.`,
            `每次反弹都使迭代值更接近交点，距离乘以 $${num(Math.abs(m))}$，所以迭代收敛到 $${p}$。`,
          ],
        ],
        [
          `From $x_0 = ${x0}$, the first step gives $x_1 \\approx ${num(first)}$, which is $${num(Math.abs(first - p))}$ from ${p}, closer than the start at distance $${Math.abs(x0 - p)}$.`,
          `从 $x_0 = ${x0}$ 出发，第一步得 $x_1 \\approx ${num(first)}$，与 ${p} 相距 $${num(Math.abs(first - p))}$，比起点的距离 $${Math.abs(x0 - p)}$ 更近。`,
        ],
      );
      return solved(
        [
          "The solid straight line is the graph of a contraction $f$, and the thin line is $y = x$. The cobweb shows the iteration $x_{k+1} = f(x_k)$. What does the iteration converge to?",
          "粗直线是压缩映射 $f$ 的图，细线是 $y = x$。蛛网图表示迭代 $x_{k+1} = f(x_k)$。迭代收敛到什么值？",
        ],
        p,
        [
          why(
            x0,
            "That is the starting point of the cobweb; the iteration moves away from it toward the crossing.",
            "这是蛛网的起点；迭代离开它，向交点移动。",
          ),
          round === p
            ? why(
                p + 1,
                `That is next to the crossing; at $x = ${p + 1}$ the graph is at height $${num(f(p + 1))}$, not on $y = x$.`,
                `这在交点旁边；在 $x = ${p + 1}$ 处图的高度是 $${num(f(p + 1))}$，不在 $y = x$ 上。`,
              )
            : why(
                round,
                `That is about the first iterate $x_1 \\approx ${num(first)}$; the cobweb keeps going past it toward the crossing.`,
                `这大约是第一个迭代值 $x_1 \\approx ${num(first)}$；蛛网继续越过它，向交点前进。`,
              ),
          why(
            wrong,
            `That is not where the lines cross; at $x = ${wrong}$ the graph is at height $${num(f(wrong))}$, not $${wrong}$.`,
            `这不是两条线的交点；在 $x = ${wrong}$ 处图的高度是 $${num(f(wrong))}$，而不是 $${wrong}$。`,
          ),
        ],
        t(worked[0], worked[1]),
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
  ),
  figure: analysisDrawings1["the-contraction-mapping-principle#the-fixed-point-of-a-drawn-cobweb"],
};

const openClosed = point(
  "open-or-closed-on-a-drawn-line",
  ["Open or closed on a drawn line", "在图中数轴上判断开闭"],
  [
    "A set of reals is open when each of its points has a small interval around it inside the set, and closed when it contains all its limit points. An interval is open when neither end belongs, closed when both ends belong, and neither when only one end belongs. A set made of several intervals needs every end to agree.\n\nThe set $[1, 3) \\cup (5, 6)$ is neither open nor closed: the filled end 1 belongs to it, and the open ends 3, 5 and 6 do not.\n\nCheck: every interval around 1 reaches points below 1, outside the set, so the set is not open; and the points $2.9, 2.99, \\dots$ of the set approach 3, which is missing, so it is not closed.\n\n> **Watch out.** Not open does not mean closed. A set with one filled end and one open end is neither.",
    "实数集是开集，当它的每一点都有一个小区间包含在集合内；是闭集，当它包含所有极限点。区间两端都不属于时是开的，都属于时是闭的，只有一端属于时既不开也不闭。由几个区间组成的集合要求所有端点都一致。\n\n集合 $[1, 3) \\cup (5, 6)$ 既不是开集也不是闭集：实心端点 1 属于它，空心端点 3、5、6 不属于它。\n\n检验：1 周围的每个区间都含有小于 1 的点，它们在集合外，所以这个集合不是开集；集合中的点 $2.9, 2.99, \\dots$ 趋向 3，而 3 不在集合中，所以它不是闭集。\n\n> **注意。** 不是开集并不意味着是闭集。一端实心、一端空心的集合既不开也不闭。",
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
    const openList = ends.filter((_, i) => !flags[i]);
    const filledList = ends.filter((_, i) => flags[i]);
    const openEnds = openList.join(", ");
    const filledEnds = filledList.join(", ");
    const both: Pair = [
      "Only the empty set and the whole line are both open and closed, and this set is neither of those.",
      "只有空集和整条直线既是开集又是闭集，而这个集合两者都不是。",
    ];
    const notOpen: Pair = [
      filledList.length > 1
        ? `The filled end points at ${filledEnds} belong to the set, but every interval around them reaches outside, so the set is not open.`
        : `The filled end point at ${filledEnds} belongs to the set, but every interval around it reaches outside, so the set is not open.`,
      `实心端点 ${filledList.join("、")} 属于集合，但它周围的每个区间都伸到集合外，所以这个集合不是开集。`,
    ];
    const notClosed: Pair = [
      openList.length > 1
        ? `The open end points at ${openEnds} are limit points of the set that are missing from it, so the set is not closed.`
        : `The open end point at ${openEnds} is a limit point of the set that is missing from it, so the set is not closed.`,
      `空心端点 ${openList.join("、")} 是集合的极限点，却不在集合中，所以这个集合不是闭集。`,
    ];
    const reasons: Record<string, Pair> = {
      open: notOpen,
      closed: notClosed,
      neither:
        mode === "open"
          ? [
              "Every point of the set has room around it inside the set, so the set is open.",
              "集合的每一点周围都有包含在集合内的空间，所以这个集合是开集。",
            ]
          : [
              "Every end point belongs to the set, so it holds all its limit points and is closed.",
              "每个端点都属于集合，所以它包含所有极限点，是闭集。",
            ],
      both,
    };
    const worked = walk(
      [
        openEnds === ""
          ? [
              "Check the open circles",
              "看空心圆",
              "There are no open circles: every end point belongs to the set, so no limit point is missing and the set is closed.",
              "没有空心圆：每个端点都属于集合，所以没有缺失的极限点，这个集合是闭集。",
            ]
          : ["Check the open circles", "看空心圆", notClosed[0], notClosed[1]],
        filledEnds === ""
          ? [
              "Check the filled circles",
              "看实心圆",
              "There are no filled circles: every point of the set lies strictly inside a segment and has room around it, so the set is open.",
              "没有实心圆：集合的每一点都严格在某条线段内部，周围有空间，所以这个集合是开集。",
            ]
          : ["Check the filled circles", "看实心圆", notOpen[0], notOpen[1]],
      ],
      [
        `So the set is ${(names[mode] as Pair)[0].toLowerCase()}. It cannot be both, since only the empty set and the whole line are both open and closed.`,
        `所以这个集合${(names[mode] as Pair)[1]}。它不可能两者都是，因为只有空集和整条直线既是开集又是闭集。`,
      ],
    );
    return reasoned(
      choose(
        rng,
        [
          "The thick segments show a set of reals, with filled circles for points in the set and open circles for points outside it. What kind of set is it?",
          "粗线段表示一个实数集，实心圆是集合中的点，空心圆是集合外的点。这是哪种集合？",
        ],
        names[mode] as Pair,
        Object.keys(names)
          .filter((n) => n !== mode)
          .map((n) => names[n] as Pair),
        worked,
        {
          svg: svgDocument(90, body),
          alt: t(
            `A set on a number line with end points ${ends.join(", ")}. ${mode === "open" ? "No end point belongs to the set" : mode === "closed" ? "Every end point belongs to the set" : "Some end points are filled and others are open"}.`,
            `数轴上的集合，端点为 ${ends.join("，")}。${mode === "open" ? "端点都不属于集合" : mode === "closed" ? "每个端点都属于集合" : "有的端点是实心，有的是空心"}。`,
          ),
        },
      ),
      Object.keys(names)
        .filter((n) => n !== mode)
        .map((n) => [(names[n] as Pair)[0], ...(reasons[n] as Pair)] as const),
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
