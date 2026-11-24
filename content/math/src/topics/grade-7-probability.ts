import type { Figure, KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { type MathWrong, tableFigure as rowFigure, type Wrong } from "./early-grades-more-kit.ts";
import { chosen, chosenMath, lesson, type Off, valued, withIntro } from "./grade-6-kit.ts";
import { mdTable, sum } from "./grade-7-statistics.ts";
import { tableFigure } from "./grade-8-kit.ts";
import { tapeFigure } from "./upper-grades-kit.ts";

// 7th Grade Math, probability: probability models and how well they fit data, sample spaces of
// compound events, experimental and theoretical probabilities of compound events, and simulation.

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

/** frac writes n/d as a fraction, followed by its lowest terms when they differ: "\frac{6}{8} = \frac{3}{4}". */
function frac(n: number, d: number): string {
  const raw = `\\frac{${n}}{${d}}`;
  const v = Q.of(n, d).toLatex();
  return v === raw ? raw : `${raw} = ${v}`;
}

// ---------------------------------------------------------------------------
// Probability models

/** Model is a chance process and the names of its outcomes: [English, Chinese], with a short mark for each in drawings. */
interface Model {
  readonly intro: Text;
  readonly outcome: Text;
  readonly outcomes: readonly (readonly [string, string])[];
  readonly marks: readonly string[];
  /** happens says that the process gave an outcome, for counts: "landed on blue". */
  readonly happens: (o: readonly [string, string]) => Text;
  readonly trials: Text;
}

const models: readonly Model[] = [
  {
    intro: t("A spinner lands on one of four colors.", "一个转盘会停在四种颜色之一上。"),
    outcome: t("Color", "颜色"),
    outcomes: [
      ["red", "红色"],
      ["blue", "蓝色"],
      ["green", "绿色"],
      ["yellow", "黄色"],
    ],
    marks: ["R", "B", "G", "Y"],
    happens: (o) => t(`landed on ${o[0]}`, `停在${o[1]}上`),
    trials: t("spins", "次转动"),
  },
  {
    intro: t("A café records the size of each drink it sells.", "一家咖啡馆记录了卖出的每杯饮料的杯型。"),
    outcome: t("Size", "杯型"),
    outcomes: [
      ["small", "小杯"],
      ["medium", "中杯"],
      ["large", "大杯"],
      ["extra large", "特大杯"],
    ],
    marks: ["S", "M", "L", "XL"],
    happens: (o) => t(`was ${o[0] === "extra large" ? "an" : "a"} ${o[0]}`, `是${o[1]}`),
    trials: t("drinks sold", "杯卖出的饮料"),
  },
  {
    intro: t("A game card shows one of four symbols.", "一张游戏卡片上印着四种符号之一。"),
    outcome: t("Symbol", "符号"),
    outcomes: [
      ["star", "星形"],
      ["moon", "月亮"],
      ["sun", "太阳"],
      ["cloud", "云朵"],
    ],
    marks: ["★", "☾", "☀", "☁"],
    happens: (o) => t(`showed a ${o[0]}`, `是${o[1]}`),
    trials: t("cards drawn", "张抽出的卡片"),
  },
];

/** modelProbabilities draws four probabilities, multiples of 0.05 that are at least 0.05, adding up to 1. */
function modelProbabilities(rng: Rng): number[] {
  for (;;) {
    const ps = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)];
    const last = 20 - sum(ps);
    if (last >= 1 && last <= 9) return [...ps, last];
  }
}

/** p20 is a whole number of twentieths as a rational number. */
const p20 = (k: number) => Q.of(k, 20);

/** modelTable writes a probability model as a table, with "?" in place of the outcome at hide. */
function modelTable(md: Model, ps: readonly number[], hide: number): Text {
  const rows = (lang: 0 | 1) =>
    mdTable(
      [md.outcome[lang === 0 ? "en" : "zh-CN"], lang === 0 ? "Probability" : "概率"],
      md.outcomes.map((o, i) => [o[lang], i === hide ? "?" : `$${dec(p20(ps[i]!))}$`]),
    );
  return t(rows(0), rows(1));
}

/** modelFigure draws a probability model as a row of marks over probabilities, the one at hide shown as a question mark. */
function modelFigure(md: Model, ps: readonly number[], hide: number): Figure {
  return rowFigure(
    md.marks,
    ps.map((p, i) => (i === hide ? null : Number(dec(p20(p))))),
  );
}

/** faceCounts are the counts of the six faces of a number cube in a drawing. */
const faceCounts = (counts: readonly number[]): Figure =>
  rowFigure(
    ["1", "2", "3", "4", "5", "6"],
    counts.map((c) => c),
  );

/** analyzingProbabilityModels completes probability models, compares them with observed frequencies and judges whether they fit. */
export const analyzingProbabilityModels = withIntro(
  topic(
    "analyzing-probability-models",
    t("Analyzing Probability Models", "分析概率模型"),
    t(
      "A probability model lists the outcomes of a chance process and a probability for each; the probabilities add up to 1. A uniform model gives every outcome the same probability. A model predicts that an outcome of probability p happens about p × n times in n trials; when the observed frequencies are far from these predictions, the model does not fit the process.",
      "概率模型列出一个随机过程的所有结果以及每个结果的概率，这些概率之和为 1。等可能模型中每个结果的概率都相同。模型预测：概率为 p 的结果在 n 次试验中大约出现 p × n 次；如果观察到的频数与预测相差很远，模型就不符合这个过程。",
    ),
    ["using-probability-to-make-predictions"],
    ["7.SP.C.7.A", "7.SP.C.7.B"],
    [
      lesson(
        "completing-a-probability-model",
        ["Completing a probability model", "补全概率模型"],
        [
          [
            "The probabilities of all the outcomes add up to $1$, so a missing one is $1$ minus the others. If red, blue and green have probabilities $0.35$, $0.2$ and $0.15$, yellow has\n\n$$1 - (0.35 + 0.2 + 0.15) = 1 - 0.7 = 0.3.$$",
            "所有结果的概率之和为 $1$，所以缺少的概率等于 $1$ 减去其他概率。如果红色、蓝色、绿色的概率分别是 $0.35$、$0.2$、$0.15$，黄色的概率就是\n\n$$1 - (0.35 + 0.2 + 0.15) = 1 - 0.7 = 0.3.$$",
          ],
          ["Add all four: $0.35 + 0.2 + 0.15 + 0.3 = 1$.", "四个相加：$0.35 + 0.2 + 0.15 + 0.3 = 1$。"],
          [
            "The outcomes need not be equally likely, so the missing probability is not simply $\\frac{1}{4}$.",
            "这些结果不一定等可能，所以缺少的概率并不就是 $\\frac{1}{4}$。",
          ],
        ],
        (rng) => {
          const md = rng.pick(models);
          const ps = modelProbabilities(rng);
          const i = rng.int(0, 3);
          const known = ps.filter((_, k) => k !== i);
          const o = md.outcomes[i]!;
          const answer = p20(ps[i]!);
          const offs: Off[] = [
            [
              p20(sum(known)),
              "That is the sum of the other three probabilities; it still has to be subtracted from $1$.",
              "这是其他三个概率之和，还要用 $1$ 去减。",
            ],
            [
              Q.of(1, 4),
              "That assumes the four outcomes are equally likely; the table shows they are not.",
              "这是假定四个结果等可能，但表格表明并非如此。",
            ],
            [
              p20(20 - known[0]!),
              `That subtracts only $${dec(p20(known[0]!))}$ from $1$ and leaves out the other known probabilities.`,
              `这只用 $1$ 减去了 $${dec(p20(known[0]!))}$，漏掉了其他已知概率。`,
            ],
          ];
          return valued(
            [
              `${md.intro.en} The table shows a probability model for it.${modelTable(md, ps, i).en}What is the probability of ${o[0]}?`,
              `${md.intro["zh-CN"]}下表是它的一个概率模型。${modelTable(md, ps, i)["zh-CN"]}${o[1]}的概率是多少？`,
            ],
            answer,
            [
              [
                ["Add the known probabilities", "把已知概率相加"],
                ["The other three outcomes have", "其他三个结果的概率之和为"],
                [`${known.map((k) => dec(p20(k))).join(" + ")} = ${dec(p20(sum(known)))}`],
              ],
              [
                ["Subtract from 1", "用 1 去减"],
                [
                  "Every trial gives exactly one outcome, so the probabilities add up to $1$:",
                  "每次试验恰好出现一个结果，所以各概率之和为 $1$：",
                ],
                [`1 - ${dec(p20(sum(known)))} = ${dec(answer)}`],
              ],
            ],
            [
              `Put the answer back and add all four: $${ps.map((p) => dec(p20(p))).join(" + ")} = 1$.`,
              `把答案放回去，四个相加：$${ps.map((p) => dec(p20(p))).join(" + ")} = 1$。`,
            ],
            offs,
            { form: "decimal", figure: modelFigure(md, ps, i) },
          );
        },
        rowFigure(["R", "B", "G", "Y"], [0.35, 0.2, 0.15, null]),
      ),
      lesson(
        "observed-and-predicted-frequencies",
        ["Observed and predicted frequencies", "观察频数与预测频数"],
        [
          [
            "A model gives blue a probability of $0.25$. In $200$ spins it predicts about $0.25 \\times 200 = 50$ blues. If blue came up $63$ times, that is $63 - 50 = 13$ more than predicted.",
            "一个模型给出蓝色的概率为 $0.25$。转 $200$ 次，它预测大约出现 $0.25 \\times 200 = 50$ 次蓝色。如果蓝色实际出现了 $63$ 次，就比预测多 $63 - 50 = 13$ 次。",
          ],
          ["The prediction plus the difference gives back the count: $50 + 13 = 63$.", "预测加上差就回到实际次数：$50 + 13 = 63$。"],
          [
            "Compare counts with counts: $63$ against $50$, not against the probability $0.25$.",
            "要用次数和次数比较：$63$ 对 $50$，而不是对概率 $0.25$。",
          ],
        ],
        (rng) => {
          const md = rng.pick(models);
          for (;;) {
            const ps = modelProbabilities(rng);
            const n = rng.pick([100, 200, 300, 400, 500]);
            const i = rng.int(0, 3);
            const predicted = Q.of(ps[i]! * n, 20);
            if (!predicted.isInteger()) continue;
            const pred = Number(predicted.n);
            const observed = pred + rng.int(4, 20);
            const o = md.outcomes[i]!;
            const p = dec(p20(ps[i]!));
            return valued(
              [
                `${md.intro.en} The table shows a probability model for it.${modelTable(md, ps, -1).en}In ${n} ${md.trials.en}, it ${md.happens(o).en} ${observed} times. How many more times is that than the model predicts?`,
                `${md.intro["zh-CN"]}下表是它的一个概率模型。${modelTable(md, ps, -1)["zh-CN"]}在 ${n} ${md.trials["zh-CN"]}中，有 ${observed} 次${md.happens(o)["zh-CN"]}。这比模型预测的多多少次？`,
              ],
              observed - pred,
              [
                [
                  ["Predict the count", "求预测次数"],
                  [`The probability of ${o[0]} times the ${n} trials:`, `${o[1]}的概率乘试验次数 ${n}：`],
                  [`${p} \\times ${n} = ${pred}`],
                ],
                [
                  ["Compare the counts", "比较次数"],
                  ["Observed minus predicted:", "实际次数减去预测次数："],
                  [`${observed} - ${pred} = ${observed - pred}`],
                ],
              ],
              [
                `The prediction plus the difference gives back the observed count: $${pred} + ${observed - pred} = ${observed}$.`,
                `预测次数加上差就回到实际次数：$${pred} + ${observed - pred} = ${observed}$。`,
              ],
              [
                [
                  predicted,
                  "That is the model’s prediction itself, not how far the count is from it.",
                  "这是模型的预测次数本身，而不是实际次数与它的差。",
                ],
                [
                  Q.of(observed).sub(Q.of(n, 4)),
                  `That predicts with a uniform model, $\\frac{1}{4}$ of the trials, instead of the table’s probability $${p}$.`,
                  `这是按等可能模型取试验次数的 $\\frac{1}{4}$ 来预测，而没有用表中的概率 $${p}$。`,
                ],
                [observed, "That is the observed count itself.", "这是实际次数本身。"],
              ],
              { form: "integer", figure: modelFigure(md, ps, -1) },
            );
          }
        },
        rowFigure(["R", "B", "G", "Y"], [0.3, 0.25, 0.25, 0.2]),
      ),
      lesson(
        "does-a-uniform-model-fit",
        ["Does a uniform model fit?", "等可能模型是否符合"],
        [
          [
            "A fair number cube makes each face equally likely, so in $600$ rolls each face should come up about $100$ times. Counts of $94, 108, 97, 103, 92, 106$ are all close to $100$: the data fit a uniform model. If the $6$ came up $171$ times, far more than the others, the cube seems to favor $6$.",
            "公平的骰子每个面出现的可能性相同，所以掷 $600$ 次，每个面大约应出现 $100$ 次。次数为 $94, 108, 97, 103, 92, 106$ 时都接近 $100$：数据符合等可能模型。如果 $6$ 出现了 $171$ 次，远多于其他面，这枚骰子似乎偏向 $6$。",
          ],
          [
            "As shares of the $600$ rolls, the counts run from $\\frac{92}{600} \\approx 0.153$ to $\\frac{108}{600} = 0.18$, all near $\\frac{1}{6} \\approx 0.167$.",
            "按占 $600$ 次的比例看，这些次数从 $\\frac{92}{600} \\approx 0.153$ 到 $\\frac{108}{600} = 0.18$，都接近 $\\frac{1}{6} \\approx 0.167$。",
          ],
          [
            "Counts from chance are almost never exactly equal; ask whether they are close to the prediction, not whether they match it.",
            "随机得到的次数几乎不会完全相等；要看它们是否接近预测，而不是是否与预测完全一致。",
          ],
        ],
        (rng) => {
          const n = rng.pick([300, 600, 1200]);
          const each = n / 6;
          const fair = rng.bool();
          const favored = rng.int(1, 6);
          // Counts near their predictions, adding up to n: the last count makes up the total and must stay near too.
          const near = (k: number, total: number): number[] => {
            const base = Math.round(total / k);
            const spread = Math.round(base * 0.08);
            for (;;) {
              const xs = Array.from({ length: k - 1 }, () => base + rng.int(-spread, spread));
              const last = total - sum(xs);
              if (Math.abs(last - total / k) <= spread) return [...xs, last];
            }
          };
          const heavy = Math.round(each * (1.6 + rng.int(0, 4) / 10));
          const counts = fair ? near(6, n) : near(5, n - heavy);
          if (!fair) counts.splice(favored - 1, 0, heavy);
          const other = ((favored + rng.int(1, 4)) % 6) + 1;
          const table = (lang: 0 | 1) =>
            mdTable(
              [lang === 0 ? "Face" : "点数", ...[1, 2, 3, 4, 5, 6].map((k) => `$${k}$`)],
              [[lang === 0 ? "Frequency" : "频数", ...counts.map((c) => `$${c}$`)]],
            );
          const uniform: [string, string] = [
            "The data fit a uniform model: each face seems equally likely.",
            "数据符合等可能模型：每个面出现的可能性似乎相同。",
          ];
          const biased = (k: number): [string, string] => [
            `The data do not fit a uniform model: the cube seems to favor $${k}$.`,
            `数据不符合等可能模型：这枚骰子似乎偏向 $${k}$。`,
          ];
          const none: [string, string] = [
            "No conclusion is possible, because the counts are not all equal.",
            "无法得出结论，因为各次数并不完全相等。",
          ];
          const noneWhy = [
            `Counts from chance are almost never all equal; what matters is how close they are to the predicted $${each}$.`,
            `随机得到的次数几乎不会完全相等；关键是它们与预测的 $${each}$ 是否接近。`,
          ] as const;
          const hi = counts.indexOf(Math.max(...counts)) + 1;
          const lo = counts.indexOf(Math.min(...counts)) + 1;
          const dev = (k: number) => Math.abs(counts[k - 1]! - each);
          const others = counts.filter((_, k) => fair || k !== favored - 1);
          const spread = Math.max(...others.map((c) => Math.abs(c - each)));
          const wrong: Wrong[] = fair
            ? [
                [
                  biased(hi),
                  `The face $${hi}$ came up $${counts[hi - 1]}$ times, only $${dev(hi)}$ away from $${each}$, a difference chance alone easily makes.`,
                  `$${hi}$ 出现了 $${counts[hi - 1]}$ 次，与 $${each}$ 只差 $${dev(hi)}$，这样的差异仅靠偶然就很容易出现。`,
                ],
                [
                  biased(lo),
                  `The face $${lo}$ came up the fewest times, $${counts[lo - 1]}$, so the cube does not favor it, and that count is still close to $${each}$.`,
                  `$${lo}$ 出现的次数最少，只有 $${counts[lo - 1]}$ 次，骰子并不偏向它，而且这个次数也接近 $${each}$。`,
                ],
                [none, ...noneWhy],
              ]
            : [
                [
                  uniform,
                  `The face $${favored}$ came up $${heavy}$ times, $${heavy - each}$ more than the $${each}$ a uniform model predicts; chance rarely makes a gap that large.`,
                  `$${favored}$ 出现了 $${heavy}$ 次，比等可能模型预测的 $${each}$ 多 $${heavy - each}$ 次；偶然很少造成这么大的差距。`,
                ],
                [
                  biased(other),
                  `The face $${other}$ came up $${counts[other - 1]}$ times, close to $${each}$; it is $${favored}$ that stands out.`,
                  `$${other}$ 出现了 $${counts[other - 1]}$ 次，接近 $${each}$；突出的是 $${favored}$。`,
                ],
                [none, ...noneWhy],
              ];
          const share = (c: number) => (c / n).toFixed(3);
          return chosen(
            rng,
            [
              `A number cube was rolled ${n} times.${table(0)}Which conclusion do the data support?`,
              `把一枚骰子掷了 ${n} 次。${table(1)}数据支持哪个结论？`,
            ],
            fair ? uniform : biased(favored),
            wrong,
            [
              [
                ["Predict each count", "预测每个次数"],
                ["A uniform model gives each face $\\frac{1}{6}$ of the rolls:", "等可能模型中每个面占 $\\frac{1}{6}$："],
                [`\\frac{${n}}{6} = ${each}`],
              ],
              fair
                ? [
                    ["Compare with the data", "与数据比较"],
                    [
                      `Every count is within $${spread}$ of $${each}$; differences this small are expected by chance, so the data fit a uniform model.`,
                      `每个次数与 $${each}$ 相差都不超过 $${spread}$；这样小的差异是偶然造成的，所以数据符合等可能模型。`,
                    ],
                  ]
                : [
                    ["Compare with the data", "与数据比较"],
                    [
                      `The face $${favored}$ came up $${heavy}$ times, $${heavy - each}$ more than predicted, while the others are within $${spread}$ of $${each}$, so the cube seems to favor $${favored}$.`,
                      `$${favored}$ 出现了 $${heavy}$ 次，比预测多 $${heavy - each}$ 次，而其他面与 $${each}$ 相差都不超过 $${spread}$，所以这枚骰子似乎偏向 $${favored}$。`,
                    ],
                  ],
            ],
            fair
              ? [
                  `As shares of the $${n}$ rolls, the counts run from $${share(Math.min(...counts))}$ to $${share(Math.max(...counts))}$, all near $\\frac{1}{6} \\approx 0.167$.`,
                  `按占 $${n}$ 次的比例看，这些次数从 $${share(Math.min(...counts))}$ 到 $${share(Math.max(...counts))}$，都接近 $\\frac{1}{6} \\approx 0.167$。`,
                ]
              : [
                  `As a share of the $${n}$ rolls, the face $${favored}$ came up $\\frac{${heavy}}{${n}} \\approx ${share(heavy)}$ of the time, far above $\\frac{1}{6} \\approx 0.167$.`,
                  `按占 $${n}$ 次的比例看，$${favored}$ 出现的比例是 $\\frac{${heavy}}{${n}} \\approx ${share(heavy)}$，远高于 $\\frac{1}{6} \\approx 0.167$。`,
                ],
            faceCounts(counts),
          );
        },
        faceCounts([94, 108, 97, 103, 92, 106]),
      ),
    ],
  ),
  [
    "A spinner comes with a card that lists each color and its probability: red $0.4$, blue $0.3$, green $0.2$. The yellow entry is smudged. One color comes up on every spin, so the four probabilities add up to $1$ and yellow is $1 - 0.9 = 0.1$.",
    "一个转盘附有一张卡片，列出每种颜色和它的概率：红色 $0.4$，蓝色 $0.3$，绿色 $0.2$。黄色那一项被弄脏了。每次转动都会出现一种颜色，所以四个概率之和为 $1$，黄色是 $1 - 0.9 = 0.1$。",
  ],
  [
    "In $100$ spins the card predicts about $40 + 30 + 20 + 10 = 100$ results, one for every spin.",
    "转 $100$ 次，卡片预测大约 $40 + 30 + 20 + 10 = 100$ 个结果，每次转动一个。",
  ],
  [
    "complete probability models, compare their predictions with what happened, and decide whether a uniform model fits the data.",
    "补全概率模型，把模型的预测与实际结果比较，并判断等可能模型是否符合数据。",
  ],
);

// ---------------------------------------------------------------------------
// Sample spaces of compound events

/** Stage is one experiment of a compound event, with events on it: [English, Chinese, the outcomes in it]. */
interface Stage {
  readonly en: string;
  readonly zh: string;
  readonly size: number;
  readonly events: readonly (readonly [string, string, number])[];
}

const stages: readonly Stage[] = [
  { en: "flipping a coin", zh: "抛一枚硬币", size: 2, events: [["heads", "正面朝上", 1]] },
  {
    en: "rolling a number cube",
    zh: "掷一枚骰子",
    size: 6,
    events: [
      ["an even number", "点数为偶数", 3],
      ["a number greater than 4", "点数大于 4", 2],
      ["a 6", "点数为 6", 1],
      ["a prime number", "点数为质数", 3],
    ],
  },
  {
    en: "spinning a spinner numbered 1 to 4",
    zh: "转一个标有 1 到 4 的转盘",
    size: 4,
    events: [
      ["an odd number", "转到奇数", 2],
      ["a 4", "转到 4", 1],
      ["a number less than 4", "转到小于 4 的数", 3],
    ],
  },
  {
    en: "spinning a spinner with equal red, blue and green sections",
    zh: "转一个红、蓝、绿三块大小相同的转盘",
    size: 3,
    events: [
      ["red", "转到红色", 1],
      ["a color other than green", "转到的不是绿色", 2],
    ],
  },
  {
    en: "drawing a card from cards numbered 1 to 5",
    zh: "从标有 1 到 5 的卡片中抽一张",
    size: 5,
    events: [
      ["an odd number", "抽到奇数", 3],
      ["a 5", "抽到 5", 1],
      ["a number less than 3", "抽到小于 3 的数", 2],
    ],
  },
];

const coin = ["H", "T"] as const;

const spinnerColors: readonly (readonly [string, string, string])[] = [
  ["R", "red", "红色"],
  ["B", "blue", "蓝色"],
  ["G", "green", "绿色"],
  ["Y", "yellow", "黄色"],
  ["P", "purple", "紫色"],
];

/** outcomeSet writes a list of outcomes as a set in LaTeX: "\{\text{HH}, \text{HT}\}". */
const outcomeSet = (xs: readonly string[]) => `\\{${xs.map((x) => `\\text{${x}}`).join(", ")}\\}`;

/** arrangements lists the outcomes of n coin flips with exactly h heads, in alphabetical order: "HHT", "HTH", "THH". */
function arrangements(n: number, h: number): string[] {
  if (h < 0 || h > n) return [];
  if (n === 0) return [""];
  return [...arrangements(n - 1, h - 1).map((x) => `H${x}`), ...arrangements(n - 1, h).map((x) => `T${x}`)];
}

/** pairGrid draws the sample space of two experiments as a grid, each cell holding a first outcome followed by a second. */
function pairGrid(first: readonly string[], second: readonly string[], filled: boolean): Figure {
  return tableFigure(
    first,
    second,
    first.map((a) => second.map((b) => (filled ? a + b : ""))),
    [
      `A grid with the outcomes ${first.join(", ")} down the side and ${second.join(", ")} across the top, one cell for each pair${filled ? "" : ", left empty"}.`,
      `一个方格表，左边是 ${first.join("、")}，上边是 ${second.join("、")}，每个格子对应一对结果${filled ? "" : "，格子是空的"}。`,
    ],
  );
}

/** eventBars draws the outcomes of each part of a compound experiment as a bar, the outcomes in the event shaded. */
function eventBars(a: number, inA: number, b: number, inB: number): Figure {
  const bar = (size: number, hit: number) => ({
    total: `${size}`,
    pieces: [{ size: hit, text: `${hit}`, lit: true }, ...(size > hit ? [{ size: size - hit, text: `${size - hit}` }] : [])],
  });
  return tapeFigure(
    [bar(a, inA), bar(b, inB)],
    [
      `Two bars for the two parts: ${inA} of ${a} outcomes shaded in the first, ${inB} of ${b} in the second.`,
      `两个长条表示两个部分：第一个的 ${a} 个结果中有 ${inA} 个涂色，第二个的 ${b} 个结果中有 ${inB} 个涂色。`,
    ],
  );
}

/** flipSlots draws n coin flips as a bar of n slots, each heads or tails. */
function flipSlots(n: number): Figure {
  return tapeFigure(
    [{ total: `${2 ** n}`, pieces: Array.from({ length: n }, () => ({ size: 1, text: "H/T" })) }],
    [
      `A bar of ${n} slots, one for each flip, each H or T, with ${2 ** n} outcomes in all.`,
      `一个分成 ${n} 格的长条，每格表示一次抛掷，是 H 或 T，共 ${2 ** n} 个结果。`,
    ],
  );
}

/** sampleSpacesForCompoundEvents lists and counts the outcomes of compound events. */
export const sampleSpacesForCompoundEvents = withIntro(
  topic(
    "sample-spaces-for-compound-events",
    t("Sample Spaces for Compound Events", "复合事件的样本空间"),
    t(
      "A compound event is made of two or more simple experiments, such as flipping a coin and then rolling a cube. Its sample space pairs every outcome of the first experiment with every outcome of the second, and order matters: HT and TH are different outcomes. Organized lists, tables and tree diagrams make sure no outcome is missed or counted twice.",
      "复合事件由两个或更多简单试验组成，比如先抛一枚硬币，再掷一枚骰子。它的样本空间把第一个试验的每个结果与第二个试验的每个结果配对，而且顺序要考虑：HT 和 TH 是不同的结果。有序列举、表格和树状图能保证结果既不遗漏也不重复。",
    ),
    ["sample-spaces-and-events-in-probability"],
    ["7.SP.C.8.B"],
    [
      lesson(
        "listing-a-compound-sample-space",
        ["Listing a compound sample space", "列出复合事件的样本空间"],
        [
          [
            "Flipping a coin and spinning a red-blue-green spinner: each of $\\text{H}, \\text{T}$ pairs with each of $\\text{R}, \\text{B}, \\text{G}$, so the sample space is $\\{\\text{HR}, \\text{HB}, \\text{HG}, \\text{TR}, \\text{TB}, \\text{TG}\\}$.",
            "抛一枚硬币并转一个红蓝绿转盘：$\\text{H}, \\text{T}$ 中的每一个都与 $\\text{R}, \\text{B}, \\text{G}$ 中的每一个配对，所以样本空间是 $\\{\\text{HR}, \\text{HB}, \\text{HG}, \\text{TR}, \\text{TB}, \\text{TG}\\}$。",
          ],
          [
            "Count it another way: $2$ coin faces times $3$ colors is $2 \\times 3 = 6$ outcomes, and six are listed.",
            "换个方法数：$2$ 个硬币面乘 $3$ 种颜色，$2 \\times 3 = 6$ 个结果，正好列出了六个。",
          ],
          [
            "Order matters: for two coins, $\\text{HT}$ and $\\text{TH}$ are different outcomes and both belong in $\\{\\text{HH}, \\text{HT}, \\text{TH}, \\text{TT}\\}$.",
            "顺序要考虑：抛两枚硬币时，$\\text{HT}$ 和 $\\text{TH}$ 是不同的结果，都要列进 $\\{\\text{HH}, \\text{HT}, \\text{TH}, \\text{TT}\\}$。",
          ],
        ],
        (rng) => {
          const twoCoins = rng.bool(0.2);
          const colors = twoCoins ? [] : rng.sample([...spinnerColors], rng.int(2, 3));
          const spinnerFirst = !twoCoins && rng.bool();
          const first = twoCoins ? [...coin] : spinnerFirst ? colors.map((c) => c[0]) : [...coin];
          const second = twoCoins ? [...coin] : spinnerFirst ? [...coin] : colors.map((c) => c[0]);
          const all = first.flatMap((a) => second.map((b) => a + b));
          const spinnerEn = `a spinner with equal ${colors
            .map((c) => c[1])
            .join(colors.length === 3 ? ", " : " and ")
            .replace(/, ([a-z]+)$/, " and $1")} sections`;
          const spinnerZh = `一个分成${colors.map((c) => c[2].replace("色", "")).join("、")}${colors.length === 2 ? "两" : "三"}块且大小相同的转盘`;
          const key = colors.map((c) => `${c[0]} for ${c[1]}`).join(", ");
          const keyZh = colors.map((c) => `${c[0]} 表示${c[2]}`).join("，");
          const prompt: [string, string] = twoCoins
            ? [
                "A coin is flipped twice. Write H for heads and T for tails. Which is the sample space?",
                "把一枚硬币抛两次。用 H 表示正面，T 表示反面。哪个是样本空间？",
              ]
            : [
                `${spinnerFirst ? `First ${spinnerEn} is spun, then a coin is flipped` : `First a coin is flipped, then ${spinnerEn} is spun`}. Write H for heads, T for tails, and ${key}. Which is the sample space?`,
                `${spinnerFirst ? `先转${spinnerZh}，再抛一枚硬币` : `先抛一枚硬币，再转${spinnerZh}`}。用 H 表示正面，T 表示反面，${keyZh}。哪个是样本空间？`,
              ];
          const drop = rng.int(1, all.length - 1);
          const wrong: MathWrong[] = twoCoins
            ? [
                [
                  outcomeSet(["HH", "HT", "TT"]),
                  "That leaves out TH: heads then tails and tails then heads are different outcomes.",
                  "这漏掉了 TH：先正后反与先反后正是不同的结果。",
                ],
                [outcomeSet(["H", "T"]), "Those are the outcomes of one flip, not of two.", "这是抛一次的结果，不是抛两次的。"],
                [outcomeSet(["HH", "TT"]), "That keeps only the outcomes in which both flips match.", "这只保留了两次结果相同的情况。"],
              ]
            : [
                [
                  outcomeSet([...new Set([...first, ...second])]),
                  "That lists the outcomes of each part on its own, not pairs of them.",
                  "这只列出了每个部分各自的结果，没有把它们配对。",
                ],
                [
                  outcomeSet(all.filter((_, k) => k !== drop)),
                  `That misses ${all[drop]}: there should be $${first.length} \\times ${second.length} = ${all.length}$ outcomes.`,
                  `这漏掉了 ${all[drop]}：应该有 $${first.length} \\times ${second.length} = ${all.length}$ 个结果。`,
                ],
                [
                  outcomeSet(first.map((a, k) => a + second[k % second.length]!)),
                  "That pairs each first outcome with only one second outcome, instead of with every one.",
                  "这让第一步的每个结果只与第二步的一个结果配对，而不是与每一个配对。",
                ],
              ];
          return chosenMath(
            rng,
            prompt,
            outcomeSet(all),
            wrong,
            [
              [
                ["Count the outcomes", "数结果的个数"],
                [
                  `The first part has $${first.length}$ outcomes and the second has $${second.length}$:`,
                  `第一步有 $${first.length}$ 个结果，第二步有 $${second.length}$ 个：`,
                ],
                [`${first.length} \\times ${second.length} = ${all.length}`],
              ],
              [
                ["Pair them in order", "按顺序配对"],
                ["Write each first outcome followed by each second outcome:", "把第一步的每个结果分别写在第二步每个结果的前面："],
                [outcomeSet(all)],
              ],
            ],
            [
              `Each of the $${first.length}$ rows of the grid holds $${second.length}$ outcomes: $${first.map(() => second.length).join(" + ")} = ${all.length}$, and none is repeated.`,
              `方格表的 $${first.length}$ 行每行有 $${second.length}$ 个结果：$${first.map(() => second.length).join(" + ")} = ${all.length}$，没有重复。`,
            ],
            pairGrid(first, second, false),
          );
        },
        pairGrid(["H", "T"], ["R", "B", "G"], true),
      ),
      lesson(
        "counting-outcomes-in-a-compound-event",
        ["Counting outcomes in a compound event", "数出复合事件中的结果"],
        [
          [
            "For flipping a coin and rolling a cube, “heads and an even number” has $1 \\times 3 = 3$ outcomes: H2, H4, H6. “Heads or an even number” has the $6$ outcomes with heads plus the $2 \\times 3 = 6$ with an even number, minus the $3$ counted in both: $6 + 6 - 3 = 9$.",
            "抛一枚硬币并掷一枚骰子，“正面朝上且点数为偶数”有 $1 \\times 3 = 3$ 个结果：H2、H4、H6。“正面朝上或点数为偶数”包括正面朝上的 $6$ 个结果，加上点数为偶数的 $2 \\times 3 = 6$ 个结果，再减去两边都算了的 $3$ 个：$6 + 6 - 3 = 9$。",
          ],
          [
            "Count the outcomes with neither instead: tails with an odd number, $1 \\times 3 = 3$, and $12 - 3 = 9$.",
            "换个方法，数两者都不满足的结果：反面且奇数，$1 \\times 3 = 3$ 个，$12 - 3 = 9$。",
          ],
          [
            "For “or”, the outcomes with both are in each count; adding $6 + 6 = 12$ counts them twice.",
            "对于“或”，两者都满足的结果在两个计数里都有；直接相加 $6 + 6 = 12$ 就把它们算了两次。",
          ],
        ],
        (rng) => {
          const [a, b] = rng.sample([...stages], 2) as [Stage, Stage];
          const [ea, eb] = [rng.pick(a.events), rng.pick(b.events)];
          const or = rng.bool();
          const both = ea[2] * eb[2];
          const inA = ea[2] * b.size;
          const inB = a.size * eb[2];
          const all = a.size * b.size;
          const none = (a.size - ea[2]) * (b.size - eb[2]);
          const answer = or ? inA + inB - both : both;
          const offs: Off[] = or
            ? [
                [inA + inB, "That counts the outcomes with both twice.", "这把两者都满足的结果算了两次。"],
                [both, "That counts only the outcomes with both, which answers “and”.", "这只数了两者都满足的结果，回答的是“且”。"],
                [
                  ea[2] + eb[2],
                  "That adds the counts in each part without pairing them with the other part.",
                  "这只把两部分各自的个数相加，没有与另一部分配对。",
                ],
              ]
            : [
                [
                  inA + inB - both,
                  "That counts the outcomes with either one, which answers “or”.",
                  "这数的是满足其中之一的结果，回答的是“或”。",
                ],
                [ea[2] + eb[2], "That adds the counts instead of pairing each with each.", "这是把个数相加，而不是两两配对。"],
                [all - both, "That counts the outcomes that are not in the event.", "这数的是不属于这个事件的结果。"],
              ];
          return valued(
            [
              `An experiment consists of ${a.en} and ${b.en}. How many outcomes have ${ea[0]} ${or ? "or" : "and"} ${eb[0]}?`,
              `一个试验包括${a.zh}和${b.zh}。有多少个结果满足“${ea[1]}${or ? "或" : "且"}${eb[1]}”？`,
            ],
            answer,
            or
              ? [
                  [
                    ["Count each event", "分别计数"],
                    [`Outcomes with ${ea[0]}, then outcomes with ${eb[0]}:`, `满足“${ea[1]}”的结果，再数满足“${eb[1]}”的结果：`],
                    [`${ea[2]} \\times ${b.size} = ${inA}`, `${a.size} \\times ${eb[2]} = ${inB}`],
                  ],
                  [
                    ["Remove the overlap", "去掉重复"],
                    [
                      `The $${ea[2]} \\times ${eb[2]} = ${both}$ outcomes with both were counted twice:`,
                      `两者都满足的 $${ea[2]} \\times ${eb[2]} = ${both}$ 个结果被算了两次：`,
                    ],
                    [`${inA} + ${inB} - ${both} = ${answer}`],
                  ],
                ]
              : [
                  [
                    ["Count each part", "分别计数"],
                    [
                      `The first part has $${ea[2]}$ of its $${a.size}$ outcomes with ${ea[0]}; the second has $${eb[2]}$ of its $${b.size}$ with ${eb[0]}.`,
                      `第一部分的 $${a.size}$ 个结果中有 $${ea[2]}$ 个满足“${ea[1]}”；第二部分的 $${b.size}$ 个结果中有 $${eb[2]}$ 个满足“${eb[1]}”。`,
                    ],
                  ],
                  [["Pair them", "两两配对"], ["Each pairs with each:", "每一个都与每一个配对："], [`${ea[2]} \\times ${eb[2]} = ${both}`]],
                ],
            or
              ? [
                  `Count the outcomes with neither and take them away from all $${all}$: $${a.size - ea[2]} \\times ${b.size - eb[2]} = ${none}$, and $${all} - ${none} = ${answer}$.`,
                  `数出两者都不满足的结果，再从全部 $${all}$ 个中减去：$${a.size - ea[2]} \\times ${b.size - eb[2]} = ${none}$，$${all} - ${none} = ${answer}$。`,
                ]
              : [
                  `Take away the outcomes that fail in the first part, then those that pass it but fail in the second: $${all} - ${(a.size - ea[2]) * b.size} - ${ea[2] * (b.size - eb[2])} = ${both}$.`,
                  `从全部结果中减去第一部分不满足的，再减去第一部分满足但第二部分不满足的：$${all} - ${(a.size - ea[2]) * b.size} - ${ea[2] * (b.size - eb[2])} = ${both}$。`,
                ],
            offs,
            { figure: eventBars(a.size, ea[2], b.size, eb[2]) },
          );
        },
        eventBars(2, 1, 6, 3),
      ),
      lesson(
        "counting-heads-in-coin-flips",
        ["Counting heads in coin flips", "数抛硬币中的正面"],
        [
          [
            "Flipping a coin $3$ times has $2 \\times 2 \\times 2 = 8$ outcomes. Exactly $2$ heads happens in $3$ of them: HHT, HTH, THH. At least $2$ heads adds HHH, for $4$ outcomes.",
            "把一枚硬币抛 $3$ 次有 $2 \\times 2 \\times 2 = 8$ 个结果。恰好 $2$ 次正面的有 $3$ 个：HHT、HTH、THH。至少 $2$ 次正面还要加上 HHH，共 $4$ 个结果。",
          ],
          [
            "Count the rest: $0$ heads is TTT and $1$ head is HTT, THT, TTH, $4$ outcomes, and $8 - 4 = 4$.",
            "数剩下的：$0$ 次正面是 TTT，$1$ 次正面是 HTT、THT、TTH，共 $4$ 个，$8 - 4 = 4$。",
          ],
          [
            "HHT, HTH and THH have the same number of heads in different places; they are three outcomes, not one.",
            "HHT、HTH、THH 正面次数相同但位置不同；它们是三个结果，不是一个。",
          ],
        ],
        (rng) => {
          for (;;) {
            const n = rng.int(3, 5);
            const kind = rng.pick(["exactly", "at least", "at most"] as const);
            const [face, faceZh, letter] = rng.pick([
              ["head", "正面", "H"],
              ["tail", "反面", "T"],
            ] as const);
            const k = rng.int(1, n - 1);
            const counts = Array.from({ length: n + 1 }, (_, i) => i);
            const heads = counts.filter((h) => (kind === "exactly" ? h === k : kind === "at least" ? h >= k : h <= k));
            const rest = counts.filter((h) => !heads.includes(h));
            // arrangements counts heads; for tails, swap the letters.
            const found = heads.map((h) =>
              arrangements(n, h).map((x) => (letter === "H" ? x : x.replace(/[HT]/g, (c) => (c === "H" ? "T" : "H")))),
            );
            const answer = sum(found.map((f) => f.length));
            if (answer > 16 || (heads.length === 1 && kind !== "exactly")) continue;
            const restSizes = rest.map((h) => arrangements(n, h).length);
            const plural = (h: number) => `${h} ${face}${h === 1 ? "" : "s"}`;
            const listed = (lang: 0 | 1) =>
              found
                .map((f, i) => {
                  const h = heads[i]!;
                  const items = `$${f.map((x) => `\\text{${x}}`).join(", ")}$`;
                  return lang === 0 ? `${plural(h)}: ${items}` : `${h} 次${faceZh}：${items}`;
                })
                .join("\n\n");
            const kindZh = { exactly: "恰好", "at least": "至少", "at most": "至多" }[kind];
            const offs: Off[] = [
              [
                heads.length,
                `That counts the possible numbers of ${face}s, not the outcomes; each number of ${face}s can happen in several orders.`,
                `这数的是${faceZh}可能出现的次数有几种，而不是结果的个数；同样的次数可以有多种顺序。`,
              ],
              [
                kind === "exactly" ? n : answer - arrangements(n, k).length,
                kind === "exactly"
                  ? `That counts the $${n}$ places a single ${face} could be, which is right only for exactly one ${face}.`
                  : `That leaves out the outcomes with exactly ${plural(k)}.`,
                kind === "exactly"
                  ? `这数的是一次${faceZh}可能出现的 $${n}$ 个位置，只有恰好 1 次${faceZh}时才对。`
                  : `这漏掉了恰好 ${k} 次${faceZh}的结果。`,
              ],
              [2 ** n - answer, "That counts the outcomes that are not in the event.", "这数的是不属于这个事件的结果。"],
            ];
            return valued(
              [
                `A coin is flipped ${n} times. How many of the $${2 ** n}$ outcomes have ${kind} ${plural(k)}?`,
                `把一枚硬币抛 ${n} 次。在 $${2 ** n}$ 个结果中，有多少个${kindZh}有 ${k} 次${faceZh}？`,
              ],
              answer,
              [
                [
                  ["Find the numbers that count", "找出符合的次数"],
                  [
                    `The outcomes with ${kind} ${plural(k)} have ${heads.length === 1 ? `exactly ${plural(heads[0]!)}` : `${heads.slice(0, -1).join(", ")} or ${heads.at(-1)} ${face}s`}.`,
                    `${kindZh} ${k} 次${faceZh}，就是${faceZh}出现 ${heads.join(" 或 ")} 次。`,
                  ],
                ],
                [
                  ["List and add", "列出并相加"],
                  [
                    `List the outcomes for each, keeping track of where the ${face}s are:\n\n${listed(0)}\n\nAdd them:`,
                    `逐个列出，注意${faceZh}出现的位置：\n\n${listed(1)}\n\n相加：`,
                  ],
                  [`${found.map((f) => f.length).join(" + ")} = ${answer}`],
                ],
              ],
              [
                `Count the rest: the outcomes with ${rest.join(" or ")} ${face}s number $${restSizes.join(" + ")} = ${sum(restSizes)}$, and $${2 ** n} - ${sum(restSizes)} = ${answer}$.`,
                `数剩下的：${faceZh}出现 ${rest.join(" 或 ")} 次的结果有 $${restSizes.join(" + ")} = ${sum(restSizes)}$ 个，$${2 ** n} - ${sum(restSizes)} = ${answer}$。`,
              ],
              offs,
              { figure: flipSlots(n) },
            );
          }
        },
        flipSlots(3),
      ),
    ],
  ),
  [
    "A lunch deal lets you choose a sandwich, ham or cheese, and a drink, milk, juice or water. Every sandwich goes with every drink, so there are $2 \\times 3 = 6$ different lunches.",
    "一份午餐套餐可以选一种三明治（火腿或奶酪）和一种饮料（牛奶、果汁或水）。每种三明治都能配每种饮料，所以共有 $2 \\times 3 = 6$ 种不同的午餐。",
  ],
  [
    "List them: ham with milk, juice or water, and cheese with milk, juice or water, $3 + 3 = 6$.",
    "列出来：火腿配牛奶、果汁或水，奶酪配牛奶、果汁或水，$3 + 3 = 6$ 种。",
  ],
  [
    "list the sample spaces of compound events in grids and organized lists, and count the outcomes in an event.",
    "用方格表和有序列举列出复合事件的样本空间，并数出一个事件包含的结果。",
  ],
);

// ---------------------------------------------------------------------------
// Experimental and theoretical probabilities of compound events

/** Repeated is a compound experiment repeated many times: its outcomes with their theoretical probabilities, and events on it. */
interface Repeated {
  readonly intro: (n: number) => Text;
  readonly outcomes: readonly string[];
  readonly events: readonly (readonly [Text, (o: string) => boolean])[];
}

const repeated: readonly Repeated[] = [
  {
    intro: (n) => t(`Two coins were tossed together ${n} times.`, `把两枚硬币一起抛了 ${n} 次。`),
    outcomes: ["HH", "HT", "TH", "TT"],
    events: [
      [t("exactly one head", "恰好一枚正面朝上"), (o) => o === "HT" || o === "TH"],
      [t("at least one head", "至少一枚正面朝上"), (o) => o !== "TT"],
      [t("two tails", "两枚都是反面朝上"), (o) => o === "TT"],
      [t("both coins showing the same face", "两枚硬币朝上的面相同"), (o) => o[0] === o[1]],
    ],
  },
  {
    intro: (n) =>
      t(
        `A coin was flipped and a spinner with equal red, blue and green sections was spun, ${n} times in all.`,
        `抛一枚硬币并转一个红、蓝、绿三块大小相同的转盘，共做了 ${n} 次。`,
      ),
    outcomes: ["HR", "HB", "HG", "TR", "TB", "TG"],
    events: [
      [t("heads and red", "正面朝上且转到红色"), (o) => o === "HR"],
      [t("tails and a color other than green", "反面朝上且转到的不是绿色"), (o) => o === "TR" || o === "TB"],
      [t("heads or blue", "正面朝上或转到蓝色"), (o) => o[0] === "H" || o[1] === "B"],
      [t("not green", "转到的不是绿色"), (o) => o[1] !== "G"],
    ],
  },
];

/** pairCounts draws the frequencies of the outcomes of n repetitions, each near its theoretical share. */
function pairCounts(rng: Rng, outcomes: number, n: number): number[] {
  const base = Math.round(n / outcomes);
  for (;;) {
    const xs = Array.from({ length: outcomes - 1 }, () => base + rng.int(-Math.round(base * 0.3), Math.round(base * 0.3)));
    const last = n - sum(xs);
    if (Math.abs(last - base) <= base * 0.3) return [...xs, last];
  }
}

/** outcomeTable writes the frequency of each outcome of a repeated experiment. */
function outcomeTable(r: Repeated, counts: readonly number[]): Text {
  const rows = (lang: 0 | 1) =>
    mdTable([lang === 0 ? "Outcome" : "结果", ...r.outcomes], [[lang === 0 ? "Frequency" : "频数", ...counts.map((c) => `$${c}$`)]]);
  return t(rows(0), rows(1));
}

/** experimentalProbabilityForCompoundEvents finds experimental probabilities of compound events and compares them with theory. */
export const experimentalProbabilityForCompoundEvents = withIntro(
  topic(
    "experimental-probability-for-compound-events",
    t("Experimental Probability for Compound Events", "复合事件的试验概率"),
    t(
      "The experimental probability of a compound event is the number of trials in which it happened divided by the number of trials. Add the frequencies of all the outcomes that make up the event. The experimental probability is usually close to the theoretical one, found from the sample space, and gets closer as the number of trials grows.",
      "复合事件的试验概率等于它发生的次数除以试验总次数。要把构成这个事件的所有结果的频数相加。试验概率通常接近由样本空间求出的理论概率，而且试验次数越多越接近。",
    ),
    ["experimental-probability", "sample-spaces-for-compound-events"],
    ["7.SP.C.6", "7.SP.C.8.A"],
    [
      lesson(
        "experimental-probabilities-of-compound-events",
        ["Experimental probabilities of compound events", "复合事件的试验概率"],
        [
          [
            "Two coins were tossed $80$ times: HH $18$ times, HT $22$, TH $19$ and TT $21$. Exactly one head happened in the HT and TH trials, $22 + 19 = 41$ of them, so its experimental probability is $\\frac{41}{80}$.",
            "把两枚硬币抛了 $80$ 次：HH $18$ 次，HT $22$ 次，TH $19$ 次，TT $21$ 次。恰好一枚正面朝上发生在 HT 和 TH 的试验中，共 $22 + 19 = 41$ 次，所以它的试验概率是 $\\frac{41}{80}$。",
          ],
          [
            "Count the trials outside the event, HH and TT: $18 + 21 = 39$, and $1 - \\frac{39}{80} = \\frac{41}{80}$.",
            "数事件以外的试验 HH 和 TT：$18 + 21 = 39$，$1 - \\frac{39}{80} = \\frac{41}{80}$。",
          ],
          [
            "Both HT and TH count: the event is made of two outcomes, so adding only one of them is too small.",
            "HT 和 TH 都要算：这个事件由两个结果组成，只算其中一个就少了。",
          ],
        ],
        (rng) => {
          const r = rng.pick(repeated);
          const n = rng.pick([40, 60, 80, 120, 150, 200]);
          const counts = pairCounts(rng, r.outcomes.length, n);
          const [name, inEvent] = rng.pick(r.events);
          const picked = r.outcomes.map((o, i) => [o, counts[i]!] as const).filter(([o]) => inEvent(o));
          const k = sum(picked.map(([, c]) => c));
          const outside = r.outcomes.filter((o) => !inEvent(o));
          const offs: Off[] = [
            ...(picked.length > 1
              ? [
                  [
                    Q.of(picked[0]![1], n),
                    `That counts only ${picked[0]![0]}; the event also includes ${picked
                      .slice(1)
                      .map(([o]) => o)
                      .join(", ")}.`,
                    `这只算了 ${picked[0]![0]}；这个事件还包括 ${picked
                      .slice(1)
                      .map(([o]) => o)
                      .join("、")}。`,
                  ] as const,
                ]
              : []),
            [
              Q.of(picked.length, r.outcomes.length),
              "That is the theoretical probability from the sample space, not the result of the experiment.",
              "这是由样本空间求出的理论概率，不是试验的结果。",
            ],
            [
              Q.of(k, n - k),
              `That divides by the $${n - k}$ trials outside the event instead of by all $${n}$.`,
              `这是除以事件以外的 $${n - k}$ 次试验，而不是全部 $${n}$ 次。`,
            ],
            [
              k,
              `That is the number of trials in the event, not yet divided by the $${n}$ trials.`,
              `这是事件发生的次数，还没有除以试验次数 $${n}$。`,
            ],
          ];
          return valued(
            [
              `${r.intro(n).en}${outcomeTable(r, counts).en}What is the experimental probability of ${name.en}?`,
              `${r.intro(n)["zh-CN"]}${outcomeTable(r, counts)["zh-CN"]}“${name["zh-CN"]}”的试验概率是多少？`,
            ],
            Q.of(k, n),
            [
              picked.length === 1
                ? [
                    ["Pick the outcomes", "选出结果"],
                    [
                      `The event is the single outcome ${picked[0]![0]}, which happened $${k}$ times.`,
                      `这个事件只有一个结果 ${picked[0]![0]}，它发生了 $${k}$ 次。`,
                    ],
                  ]
                : [
                    ["Pick the outcomes", "选出结果"],
                    [
                      `The event is made of ${picked
                        .slice(0, -1)
                        .map(([o]) => o)
                        .join(", ")} and ${picked.at(-1)![0]}. Add their frequencies:`,
                      `这个事件由 ${picked.map(([o]) => o).join("、")} 组成。把它们的频数相加：`,
                    ],
                    [`${picked.map(([, c]) => c).join(" + ")} = ${k}`],
                  ],
              [["Divide by the trials", "除以试验次数"], [`There were $${n}$ trials:`, `一共试验了 $${n}$ 次：`], [frac(k, n)]],
            ],
            [
              `Count the trials outside the event, ${outside.join(", ")}: $${n - k}$ of them, and $1 - \\frac{${n - k}}{${n}} = ${Q.of(k, n).toLatex()}$.`,
              `数事件以外的试验 ${outside.join("、")}：共 $${n - k}$ 次，$1 - \\frac{${n - k}}{${n}} = ${Q.of(k, n).toLatex()}$。`,
            ],
            offs,
            { figure: rowFigure(r.outcomes, counts) },
          );
        },
        rowFigure(["HH", "HT", "TH", "TT"], [18, 22, 19, 21]),
      ),
      lesson(
        "experimental-and-theoretical-probabilities",
        ["Experimental and theoretical probabilities", "试验概率与理论概率"],
        [
          [
            "In the $80$ tosses, exactly one head happened $41$ times, an experimental probability of $\\frac{41}{80} = 0.5125$. The theoretical probability is $\\frac{2}{4} = 0.5$, since $2$ of the $4$ equally likely outcomes have exactly one head. They differ by $0.5125 - 0.5 = 0.0125$.",
            "在 $80$ 次抛掷中，恰好一枚正面朝上发生了 $41$ 次，试验概率为 $\\frac{41}{80} = 0.5125$。理论概率是 $\\frac{2}{4} = 0.5$，因为 $4$ 个等可能结果中有 $2$ 个恰好一枚正面朝上。两者相差 $0.5125 - 0.5 = 0.0125$。",
          ],
          [
            "In counts: theory predicts $0.5 \\times 80 = 40$ such tosses, there were $41$, and $\\frac{41 - 40}{80} = 0.0125$.",
            "用次数看：理论预测有 $0.5 \\times 80 = 40$ 次，实际有 $41$ 次，$\\frac{41 - 40}{80} = 0.0125$。",
          ],
          [
            "The gap is between two probabilities; the gap of $1$ toss is a difference in counts and must still be divided by the $80$ trials.",
            "要比较的是两个概率之差；相差 $1$ 次是次数之差，还要除以试验次数 $80$。",
          ],
        ],
        (rng) => {
          const r = rng.pick(repeated);
          for (;;) {
            const n = rng.pick([40, 60, 80, 120, 200]);
            const counts = pairCounts(rng, r.outcomes.length, n);
            const [name, inEvent] = rng.pick(r.events);
            const k = sum(counts.filter((_, i) => inEvent(r.outcomes[i]!)));
            const size = r.outcomes.length;
            const m = r.outcomes.filter(inEvent).length;
            const [exp, theo] = [Q.of(k, n), Q.of(m, size)];
            const diff = exp.sub(theo).abs();
            if (diff.isZero()) continue;
            const [lo, hi] = exp.cmp(theo) > 0 ? [theo, exp] : [exp, theo];
            const predicted = theo.mul(Q.of(n));
            return valued(
              [
                `${r.intro(n).en}${outcomeTable(r, counts).en}By how much does the experimental probability of ${name.en} differ from its theoretical probability?`,
                `${r.intro(n)["zh-CN"]}${outcomeTable(r, counts)["zh-CN"]}“${name["zh-CN"]}”的试验概率与理论概率相差多少？`,
              ],
              diff,
              [
                [
                  ["Find the experimental probability", "求试验概率"],
                  [`The event happened in $${k}$ of the $${n}$ trials:`, `事件在 $${n}$ 次试验中发生了 $${k}$ 次：`],
                  [frac(k, n)],
                ],
                [
                  ["Find the theoretical probability", "求理论概率"],
                  [`It is $${m}$ of the $${size}$ equally likely outcomes:`, `它包含 $${size}$ 个等可能结果中的 $${m}$ 个：`],
                  [frac(m, size)],
                ],
                [
                  ["Subtract", "相减"],
                  ["The larger minus the smaller:", "用较大的减去较小的："],
                  [`${hi.toLatex()} - ${lo.toLatex()} = ${diff.toLatex()}`],
                ],
              ],
              [
                `In counts: theory predicts $${theo.toLatex()} \\times ${n} = ${predicted.toLatex()}$ such trials, there were $${k}$, and the gap divided by $${n}$ is $${diff.toLatex()}$.`,
                `用次数看：理论预测有 $${theo.toLatex()} \\times ${n} = ${predicted.toLatex()}$ 次，实际有 $${k}$ 次，差再除以 $${n}$ 得 $${diff.toLatex()}$。`,
              ],
              [
                [
                  exp,
                  "That is the experimental probability alone; it still has to be compared with the theoretical one.",
                  "这只是试验概率，还要与理论概率比较。",
                ],
                [theo, "That is the theoretical probability alone.", "这只是理论概率。"],
                [
                  Q.of(k).sub(predicted).abs(),
                  `That is the gap in counts; divide it by the $${n}$ trials to compare probabilities.`,
                  `这是次数之差；要除以试验次数 $${n}$ 才能比较概率。`,
                ],
                [exp.add(theo), "That adds the two probabilities instead of subtracting.", "这是把两个概率相加，而不是相减。"],
              ],
              { figure: rowFigure(r.outcomes, counts) },
            );
          }
        },
        rowFigure(["HH", "HT", "TH", "TT"], [18, 22, 19, 21]),
      ),
    ],
  ),
  [
    "Two coins were tossed $40$ times and showed one head and one tail $21$ times. The experimental probability of that event is $\\frac{21}{40} = 0.525$, close to the $\\frac{2}{4} = 0.5$ that the sample space gives.",
    "把两枚硬币抛了 $40$ 次，其中一正一反出现了 $21$ 次。这个事件的试验概率是 $\\frac{21}{40} = 0.525$，接近由样本空间得到的 $\\frac{2}{4} = 0.5$。",
  ],
  [
    "HT and TH are $2$ of the $4$ outcomes HH, HT, TH, TT, and $\\frac{2}{4} = 0.5$.",
    "HT 和 TH 是 HH、HT、TH、TT 这 $4$ 个结果中的 $2$ 个，$\\frac{2}{4} = 0.5$。",
  ],
  [
    "find experimental probabilities of compound events from frequency tables and compare them with theoretical probabilities.",
    "由频数表求复合事件的试验概率，并与理论概率比较。",
  ],
);

/** spinnerGrid draws the pairs of two numbered spinners as a grid holding a value of each pair. */
function spinnerGrid(a: number, b: number, value: (x: number, y: number) => number, en: string, zh: string): Figure {
  const rows = Array.from({ length: a }, (_, i) => `${i + 1}`);
  const columns = Array.from({ length: b }, (_, j) => `${j + 1}`);
  return tableFigure(
    rows,
    columns,
    rows.map((_, i) => columns.map((_, j) => `${value(i + 1, j + 1)}`)),
    [
      `A grid of the ${a * b} pairs, the first spinner 1 to ${a} down the side and the second 1 to ${b} across the top, each cell holding ${en}.`,
      `一个方格表列出 ${a * b} 个数对，左边是第一个转盘的 1 到 ${a}，上边是第二个转盘的 1 到 ${b}，每格写着${zh}。`,
    ],
  );
}

/** twoBars draws two collections as bars, the part in the event shaded in each. */
function twoBars(hitA: number, missA: number, hitB: number, missB: number, en: string, zh: string): Figure {
  const bar = (hit: number, miss: number) => ({
    total: `${hit + miss}`,
    pieces: [{ size: hit, text: `${hit}`, lit: true }, ...(miss > 0 ? [{ size: miss, text: `${miss}` }] : [])],
  });
  return tapeFigure([bar(hitA, missA), bar(hitB, missB)], [en, zh]);
}

/** computingProbabilitiesOfCompoundEvents finds probabilities of compound events from sample spaces and by multiplying. */
export const computingProbabilitiesOfCompoundEvents = withIntro(
  topic(
    "computing-probabilities-of-compound-events",
    t("Computing Probabilities of Compound Events", "计算复合事件的概率"),
    t(
      "When all the outcomes of a compound experiment are equally likely, the probability of an event is the number of outcomes in it divided by the size of the sample space. When the parts of the experiment do not affect each other, the probability that one event happens in the first part and another in the second is the product of their probabilities.",
      "复合试验的所有结果等可能时，事件的概率等于它包含的结果数除以样本空间的大小。当试验的各部分互不影响时，第一部分发生某事件且第二部分发生另一事件的概率，等于它们概率的乘积。",
    ),
    ["sample-spaces-for-compound-events", "single-events-in-probability"],
    ["7.SP.C.8.A", "7.SP.C.8.B"],
    [
      lesson(
        "probabilities-from-a-compound-sample-space",
        ["Probabilities from a compound sample space", "由复合样本空间求概率"],
        [
          [
            "Spinners numbered $1$ to $4$ and $1$ to $3$ give $4 \\times 3 = 12$ equally likely pairs. A sum of $5$ comes from $(2, 3), (3, 2), (4, 1)$, so its probability is $\\frac{3}{12} = \\frac{1}{4}$.",
            "标有 $1$ 到 $4$ 和 $1$ 到 $3$ 的两个转盘共有 $4 \\times 3 = 12$ 个等可能的数对。和为 $5$ 的有 $(2, 3), (3, 2), (4, 1)$，所以概率是 $\\frac{3}{12} = \\frac{1}{4}$。",
          ],
          [
            "The other $9$ pairs have other sums, and $1 - \\frac{9}{12} = \\frac{1}{4}$.",
            "其余 $9$ 个数对的和不是 $5$，$1 - \\frac{9}{12} = \\frac{1}{4}$。",
          ],
          [
            "Divide by the $12$ pairs, not by the $6$ possible sums: the sums are not equally likely.",
            "要除以 $12$ 个数对，而不是 $6$ 种可能的和：各种和并不等可能。",
          ],
        ],
        (rng) => {
          for (;;) {
            const [a, b] = [rng.int(3, 6), rng.int(2, 4)];
            const pairs = Array.from({ length: a }, (_, i) => Array.from({ length: b }, (_, j) => [i + 1, j + 1] as const)).flat();
            const kind = rng.pick(["sum", "even", "greater", "product"] as const);
            const s = rng.int(4, a + b - 1);
            const events: Record<typeof kind, readonly [Text, (x: number, y: number) => boolean]> = {
              sum: [t(`a sum of ${s}`, `两数之和为 ${s}`), (x: number, y: number) => x + y === s],
              even: [t("an even sum", "两数之和为偶数"), (x: number, y: number) => (x + y) % 2 === 0],
              greater: [t("a first number greater than the second", "第一个数大于第二个数"), (x: number, y: number) => x > y],
              product: [t("an odd product", "两数之积为奇数"), (x: number, y: number) => (x * y) % 2 === 1],
            };
            const event = events[kind];
            const hits = pairs.filter(([x, y]) => event[1](x, y));
            if (hits.length === 0 || hits.length > 8) continue;
            const all = a * b;
            const h = hits.length;
            const sums = new Set(pairs.map(([x, y]) => x + y)).size;
            const grid =
              kind === "product"
                ? spinnerGrid(a, b, (x, y) => x * y, "the product", "两数之积")
                : kind === "greater"
                  ? spinnerGrid(a, b, (x, y) => x - y, "the first number minus the second", "第一个数减第二个数的差")
                  : spinnerGrid(a, b, (x, y) => x + y, "the sum", "两数之和");
            const offs: Off[] = [
              [
                Q.of(h, a + b),
                `That divides by $${a} + ${b}$, the sections of the two spinners, instead of by the $${all}$ pairs.`,
                `这是除以两个转盘的格数之和 $${a} + ${b}$，而不是 $${all}$ 个数对。`,
              ],
              ...(kind === "sum"
                ? [
                    [
                      Q.of(1, sums),
                      `That treats the $${sums}$ possible sums as equally likely; they are not.`,
                      `这是把 $${sums}$ 种可能的和当成等可能，但它们并不等可能。`,
                    ] as const,
                  ]
                : []),
              [
                Q.of(h, all - h),
                `That divides by the $${all - h}$ pairs outside the event instead of by all $${all}$.`,
                `这是除以事件以外的 $${all - h}$ 个数对，而不是全部 $${all}$ 个。`,
              ],
              [
                h,
                `That is the number of pairs in the event, not yet divided by the $${all}$ pairs.`,
                `这是事件包含的数对个数，还没有除以 $${all}$。`,
              ],
            ];
            return valued(
              [
                `Two spinners are spun: one numbered 1 to ${a} and one numbered 1 to ${b}, with equal sections. What is the probability of ${event[0].en}?`,
                `转两个各部分大小相同的转盘：一个标有 1 到 ${a}，另一个标有 1 到 ${b}。${event[0]["zh-CN"]}的概率是多少？`,
              ],
              Q.of(h, all),
              [
                [
                  ["Count the sample space", "数样本空间"],
                  ["Each number on the first spinner pairs with each on the second:", "第一个转盘的每个数都与第二个转盘的每个数配对："],
                  [`${a} \\times ${b} = ${all}`],
                ],
                [
                  ["Count the event", "数事件"],
                  [
                    `The pairs with ${event[0].en} are $${hits.map(([x, y]) => `(${x}, ${y})`).join(", ")}$, $${h}$ of them.`,
                    `满足“${event[0]["zh-CN"]}”的数对是 $${hits.map(([x, y]) => `(${x}, ${y})`).join(", ")}$，共 $${h}$ 个。`,
                  ],
                ],
                [["Divide", "相除"], ["The pairs are equally likely:", "这些数对等可能："], [frac(h, all)]],
              ],
              [
                `The other $${all - h}$ pairs are outside the event, and $1 - \\frac{${all - h}}{${all}} = ${Q.of(h, all).toLatex()}$.`,
                `其余 $${all - h}$ 个数对不在事件中，$1 - \\frac{${all - h}}{${all}} = ${Q.of(h, all).toLatex()}$。`,
              ],
              offs,
              { figure: grid },
            );
          }
        },
        spinnerGrid(4, 3, (x, y) => x + y, "the sum", "两数之和"),
      ),
      lesson(
        "multiplying-probabilities",
        ["Multiplying probabilities", "概率相乘"],
        [
          [
            "A bag holds $3$ red and $5$ blue marbles, and a number cube is rolled. The probability of drawing red and rolling more than $4$ is\n\n$$\\frac{3}{8} \\times \\frac{2}{6} = \\frac{6}{48} = \\frac{1}{8}.$$",
            "袋子里有 $3$ 颗红色和 $5$ 颗蓝色弹珠，另外掷一枚骰子。摸到红色且掷出大于 $4$ 的数的概率是\n\n$$\\frac{3}{8} \\times \\frac{2}{6} = \\frac{6}{48} = \\frac{1}{8}.$$",
          ],
          [
            "Count pairs: of the $8 \\times 6 = 48$ equally likely marble-and-roll pairs, $3 \\times 2 = 6$ are in the event, and $\\frac{6}{48} = \\frac{1}{8}$.",
            "数组合：在 $8 \\times 6 = 48$ 个等可能的“弹珠与点数”组合中，有 $3 \\times 2 = 6$ 个属于这个事件，$\\frac{6}{48} = \\frac{1}{8}$。",
          ],
          [
            "Adding the probabilities, $\\frac{3}{8} + \\frac{2}{6}$, comes closer to “or”; for “and”, multiply.",
            "把概率相加，$\\frac{3}{8} + \\frac{2}{6}$，更接近“或”；求“且”要相乘。",
          ],
        ],
        (rng) => {
          const [c1, c2] = rng.sample(
            [
              ["red", "红色"],
              ["blue", "蓝色"],
              ["green", "绿色"],
              ["yellow", "黄色"],
            ] as const,
            2,
          ) as [readonly [string, string], readonly [string, string]];
          const [r, o] = [rng.int(2, 7), rng.int(2, 7)];
          const n = r + o;
          const [en, zh, k] = rng.pick([
            ["an even number", "偶数", 3],
            ["a number greater than 4", "大于 4 的数", 2],
            ["a 6", "6", 1],
            ["a number less than 5", "小于 5 的数", 4],
          ] as const);
          const answer = Q.of(r * k, n * 6);
          const offs: Off[] = [
            [
              Q.of(r, n).add(Q.of(k, 6)),
              "That adds the probabilities, which comes closer to “or” than to “and”.",
              "这是把概率相加，更接近“或”而不是“且”。",
            ],
            [
              Q.of(r + k, n + 6),
              "That adds the counts and the totals instead of multiplying the probabilities.",
              "这是把个数和总数分别相加，而不是把概率相乘。",
            ],
            [
              Q.of(r, o).mul(Q.of(k, 6)),
              `That uses the ratio $${r} : ${o}$ of the colors instead of the share $\\frac{${r}}{${n}}$.`,
              `这是用了颜色之比 $${r} : ${o}$，而不是所占比例 $\\frac{${r}}{${n}}$。`,
            ],
            [
              Q.of(r, n),
              "That is the probability of the draw alone; the roll must happen too.",
              "这只是摸弹珠的概率；掷骰子的条件也要满足。",
            ],
          ];
          return valued(
            [
              `A bag holds ${r} ${c1[0]} and ${o} ${c2[0]} marbles. One marble is drawn at random and a number cube is rolled. What is the probability of drawing ${c1[0]} and rolling ${en}?`,
              `袋子里有 ${r} 颗${c1[1]}和 ${o} 颗${c2[1]}弹珠。随机摸出一颗弹珠，再掷一枚骰子。摸到${c1[1]}弹珠且掷出${zh}的概率是多少？`,
            ],
            answer,
            [
              [
                ["Find each probability", "分别求概率"],
                [
                  `Drawing ${c1[0]}: $\\frac{${r}}{${n}}$, since $${r}$ of the $${n}$ marbles are ${c1[0]}. Rolling ${en}: $\\frac{${k}}{6}$.`,
                  `摸到${c1[1]}：$${n}$ 颗中有 $${r}$ 颗，概率 $\\frac{${r}}{${n}}$。掷出${zh}：$\\frac{${k}}{6}$。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                ["The draw and the roll do not affect each other, so multiply:", "摸弹珠和掷骰子互不影响，所以相乘："],
                [`\\frac{${r}}{${n}} \\times \\frac{${k}}{6} = ${frac(r * k, n * 6)}`],
              ],
            ],
            [
              `Count pairs: of the $${n} \\times 6 = ${n * 6}$ equally likely marble-and-roll pairs, $${r} \\times ${k} = ${r * k}$ are in the event, and $${frac(r * k, n * 6)}$.`,
              `数组合：在 $${n} \\times 6 = ${n * 6}$ 个等可能的组合中，有 $${r} \\times ${k} = ${r * k}$ 个属于这个事件，$${frac(r * k, n * 6)}$。`,
            ],
            offs,
            {
              figure: twoBars(
                r,
                o,
                k,
                6 - k,
                `Two bars: ${r} of ${n} marbles shaded, and ${k} of the 6 faces of the cube shaded.`,
                `两个长条：${n} 颗弹珠中 ${r} 颗涂色，骰子的 6 个面中 ${k} 个涂色。`,
              ),
            },
          );
        },
        twoBars(
          3,
          5,
          2,
          4,
          "Two bars: 3 of 8 marbles shaded, and 2 of the 6 faces of the cube shaded.",
          "两个长条：8 颗弹珠中 3 颗涂色，骰子的 6 个面中 2 个涂色。",
        ),
      ),
      lesson(
        "two-draws-with-replacement",
        ["Two draws with replacement", "有放回地抽两次"],
        [
          [
            "A bag holds $3$ red and $2$ blue tiles. A tile is drawn, put back, and a tile is drawn again. Putting it back makes the second draw just like the first, so\n\n$$P(\\text{red, then red}) = \\frac{3}{5} \\times \\frac{3}{5} = \\frac{9}{25}.$$",
            "袋子里有 $3$ 块红色和 $2$ 块蓝色的方块。摸出一块后放回，再摸一块。放回使第二次和第一次完全一样，所以\n\n$$P(\\text{红，再红}) = \\frac{3}{5} \\times \\frac{3}{5} = \\frac{9}{25}.$$",
          ],
          [
            "Count ordered pairs of tiles: $5 \\times 5 = 25$ equally likely pairs, $3 \\times 3 = 9$ of them red then red.",
            "数有序的方块对：$5 \\times 5 = 25$ 个等可能的对，其中 $3 \\times 3 = 9$ 个是红再红。",
          ],
          [
            "Without putting it back, the second draw would be from $4$ tiles; with replacement it is from all $5$ again.",
            "如果不放回，第二次就是从 $4$ 块中摸；有放回时又是从全部 $5$ 块中摸。",
          ],
        ],
        (rng) => {
          const [r, b] = [rng.int(2, 6), rng.int(2, 6)];
          const n = r + b;
          const mixed = rng.bool();
          const x = mixed ? b : r;
          const answer = Q.of(r * x, n * n);
          const [second, secondZh] = mixed ? ["blue", "蓝色"] : ["red", "红色"];
          const offs: Off[] = [
            [
              Q.of(r * (mixed ? b : r - 1), n * (n - 1)),
              `That draws the second tile from $${n - 1}$ tiles, as if the first were not put back.`,
              `这是从 $${n - 1}$ 块中摸第二块，好像第一块没有放回。`,
            ],
            [Q.of(x, n), "That is the probability of the second draw alone.", "这只是第二次摸的概率。"],
            [
              Q.of(r + x, n),
              "That adds the two counts over one draw instead of multiplying the probabilities.",
              "这是把两个个数相加后只除一次，而不是把概率相乘。",
            ],
            [
              Q.of(r, n).add(Q.of(x, n)),
              "That adds the two probabilities instead of multiplying them.",
              "这是把两个概率相加，而不是相乘。",
            ],
          ];
          return valued(
            [
              `A bag holds ${r} red and ${b} blue tiles. A tile is drawn at random, put back, and a second tile is drawn. What is the probability of ${mixed ? "red on the first draw and blue on the second" : "red on both draws"}?`,
              `袋子里有 ${r} 块红色和 ${b} 块蓝色的方块。随机摸出一块，放回后再摸一块。${mixed ? "第一次摸到红色且第二次摸到蓝色" : "两次都摸到红色"}的概率是多少？`,
            ],
            answer,
            [
              [
                ["Each draw on its own", "分别看每次"],
                [
                  `The tile is put back, so both draws are from all $${n}$ tiles: red first is $\\frac{${r}}{${n}}$ and ${second} second is $\\frac{${x}}{${n}}$.`,
                  `方块放回了，所以两次都是从全部 $${n}$ 块中摸：第一次红色是 $\\frac{${r}}{${n}}$，第二次${secondZh}是 $\\frac{${x}}{${n}}$。`,
                ],
              ],
              [
                ["Multiply", "相乘"],
                ["The draws do not affect each other:", "两次摸互不影响："],
                [`\\frac{${r}}{${n}} \\times \\frac{${x}}{${n}} = ${frac(r * x, n * n)}`],
              ],
            ],
            [
              `Count ordered pairs of tiles: $${n} \\times ${n} = ${n * n}$ equally likely pairs, $${r} \\times ${x} = ${r * x}$ of them in the event, and $${frac(r * x, n * n)}$.`,
              `数有序的方块对：$${n} \\times ${n} = ${n * n}$ 个等可能的对，其中 $${r} \\times ${x} = ${r * x}$ 个属于这个事件，$${frac(r * x, n * n)}$。`,
            ],
            offs,
            {
              figure: twoBars(
                r,
                b,
                x,
                n - x,
                `Two bars of ${n} tiles, one for each draw: ${r} red shaded in the first and ${x} ${second} shaded in the second.`,
                `两个各有 ${n} 块的长条，每次摸一条：第一条中 ${r} 块红色涂色，第二条中 ${x} 块${secondZh}涂色。`,
              ),
            },
          );
        },
        twoBars(
          3,
          2,
          3,
          2,
          "Two bars of 5 tiles, one for each draw, 3 red shaded in each.",
          "两个各有 5 块的长条，每次摸一条，每条中 3 块红色涂色。",
        ),
      ),
    ],
  ),
  [
    "A coin is flipped and a number cube is rolled. Of the $2 \\times 6 = 12$ equally likely pairs, one is heads with a $6$, so the probability of heads and a $6$ is $\\frac{1}{12}$.",
    "抛一枚硬币并掷一枚骰子。在 $2 \\times 6 = 12$ 个等可能的组合中，只有一个是正面且 $6$ 点，所以正面且 $6$ 点的概率是 $\\frac{1}{12}$。",
  ],
  [
    "Multiplying the parts gives the same: $\\frac{1}{2} \\times \\frac{1}{6} = \\frac{1}{12}$.",
    "把两部分的概率相乘也一样：$\\frac{1}{2} \\times \\frac{1}{6} = \\frac{1}{12}$。",
  ],
  [
    "find probabilities of compound events by counting outcomes in the sample space and by multiplying the probabilities of the parts.",
    "通过数样本空间中的结果，以及把各部分的概率相乘，求复合事件的概率。",
  ],
);

// ---------------------------------------------------------------------------
// Simulation

/** chances are events with a probability, for simulations: [the event, what repeats it in English, the same in Chinese with a measure word]. */
const chances: readonly (readonly [string, string, string, string])[] = [
  ["a basketball player makes a free throw", "free throws", "一名篮球运动员罚球命中", "次罚球"],
  ["a seed sprouts", "seeds", "一粒种子发芽", "粒种子"],
  ["it rains on a given day", "days", "某一天下雨", "天"],
  ["a cereal box holds a prize", "cereal boxes", "一盒麦片里有奖品", "盒麦片"],
];

/** digitsFor writes the digits 0 to k - 1: "0, 1 and 2", or "0" alone. */
function digitsFor(k: number): Text {
  if (k === 1) return t("the digit 0", "数字 0");
  const ds = Array.from({ length: k }, (_, i) => i);
  return t(`the digits ${ds.slice(0, -1).join(", ")} and ${k - 1}`, `数字 ${ds.join("、")}`);
}

/** digitBar draws the ten digits 0 to 9 as a bar of equal pieces, the first `lit` of them shaded. */
function digitBar(lit: number): Figure {
  return tapeFigure(
    [{ total: "10", pieces: Array.from({ length: 10 }, (_, d) => ({ size: 1, text: `${d}`, lit: d < lit })) }],
    [
      `The ten digits 0 to 9 as equal pieces of a bar${lit > 0 ? `, the digits 0 to ${lit - 1} shaded` : ""}.`,
      `把 0 到 9 十个数字画成一个长条的相等小段${lit > 0 ? `，0 到 ${lit - 1} 涂色` : ""}。`,
    ],
  );
}

/** simulatingCompoundEvents designs simulations with random digits and estimates compound probabilities from them. */
export const simulatingCompoundEvents = withIntro(
  topic(
    "simulating-compound-events",
    t("Simulating Compound Events", "模拟复合事件"),
    t(
      "A simulation imitates a chance process with something whose probabilities are known, such as random digits. With digits from 0 to 9, each digit has probability 1/10, so letting 3 of the digits stand for an event models a probability of 30%. For a compound event, each trial uses one digit per part, and the share of trials in which the event happens estimates its probability.",
      "模拟是用概率已知的东西（例如随机数字）来模仿一个随机过程。在 0 到 9 的数字中，每个数字的概率都是 1/10，所以用其中 3 个数字代表某事件，就模拟了 30% 的概率。对于复合事件，每次试验中每个部分用一个数字，事件发生的试验所占的比例就是它概率的估计值。",
    ),
    ["experimental-probability-for-compound-events"],
    ["7.SP.C.8.C"],
    [
      lesson(
        "designing-a-simulation",
        ["Designing a simulation", "设计模拟"],
        [
          [
            "To simulate a player who makes $30\\%$ of free throws, choose a random digit from $0$ to $9$ and let $0, 1, 2$ stand for a make: $3$ of the $10$ digits give $\\frac{3}{10} = 30\\%$.",
            "要模拟一名罚球命中率为 $30\\%$ 的运动员，可以从 $0$ 到 $9$ 中随机选一个数字，用 $0, 1, 2$ 代表命中：$10$ 个数字中有 $3$ 个，概率为 $\\frac{3}{10} = 30\\%$。",
          ],
          [
            "Over $100$ random digits, about $10$ of each digit come up, so about $30$ fall among $0, 1, 2$: $30\\%$ of them.",
            "在 $100$ 个随机数字中，每个数字大约出现 $10$ 次，所以大约有 $30$ 个落在 $0, 1, 2$ 中：占 $30\\%$。",
          ],
          [
            "The digits $0$ to $3$ are $4$ digits, or $40\\%$, and a coin models $50\\%$: count the digits, not the largest one.",
            "$0$ 到 $3$ 是 $4$ 个数字，即 $40\\%$；硬币模拟的是 $50\\%$：要数数字的个数，而不是看最大的那个数字。",
          ],
        ],
        (rng) => {
          const [en, , zh] = rng.pick(chances);
          const k = rng.pick([1, 2, 3, 4, 6, 7, 8, 9]);
          const digits = (j: number): [string, string] => [
            `Pick a random digit from 0 to 9, and let ${digitsFor(j).en} stand for “yes”.`,
            `从 0 到 9 中随机选一个数字，用${digitsFor(j)["zh-CN"]} 代表“是”。`,
          ];
          const uses = (j: number) =>
            [
              `That uses $${j}$ ${j === 1 ? "digit" : "digits"}, a probability of $${j * 10}\\%$.`,
              `这用了 $${j}$ 个数字，概率是 $${j * 10}\\%$。`,
            ] as const;
          const lower = k === 1 ? 2 : k - 1;
          const wrong: Wrong[] = [
            [digits(k + 1), ...uses(k + 1)],
            [digits(lower), ...uses(lower)],
            [
              ["Flip a coin, and let heads stand for “yes”.", "抛一枚硬币，用正面代表“是”。"],
              `A coin gives “yes” half the time, $50\\%$, not $${k * 10}\\%$.`,
              `硬币给出“是”的概率是一半，即 $50\\%$，而不是 $${k * 10}\\%$。`,
            ],
            k === 1
              ? [digits(3), ...uses(3)]
              : [
                  [
                    `Pick a random digit from 0 to 9, and let the digit ${k} stand for “yes”.`,
                    `从 0 到 9 中随机选一个数字，用数字 ${k} 代表“是”。`,
                  ],
                  `One digit has only a $10\\%$ chance; $${k * 10}\\%$ needs $${k}$ digits, not the digit $${k}$.`,
                  `一个数字的概率只有 $10\\%$；$${k * 10}\\%$ 需要 $${k}$ 个数字，而不是数字 $${k}$。`,
                ],
          ];
          return chosen(
            rng,
            [
              `The probability that ${en} is $${k * 10}\\%$. Which simulation models one trial?`,
              `${zh}的概率是 $${k * 10}\\%$。哪种模拟能模仿一次试验？`,
            ],
            digits(k),
            wrong,
            [
              [
                ["Match the probability", "对应概率"],
                [
                  `Each of the $10$ digits has probability $\\frac{1}{10}$, so $${k * 10}\\%$ needs $${k}$ ${k === 1 ? "digit" : "digits"}:`,
                  `$10$ 个数字中每个的概率都是 $\\frac{1}{10}$，所以 $${k * 10}\\%$ 需要 $${k}$ 个数字：`,
                ],
                [`\\frac{${k}}{10} = ${k * 10}\\%`],
              ],
              [
                ["Choose the digits", "选数字"],
                [
                  k === 1 ? "The digit $0$ alone will do." : `Starting at $0$, these are the digits $0$ to $${k - 1}$.`,
                  k === 1 ? "只用数字 $0$ 即可。" : `从 $0$ 开始，就是 $0$ 到 $${k - 1}$。`,
                ],
              ],
            ],
            [
              `Over $100$ random digits, about $10$ of each come up, so about $${k} \\times 10 = ${k * 10}$ fall among the chosen ones: $${k * 10}\\%$.`,
              `在 $100$ 个随机数字中，每个数字大约出现 $10$ 次，所以大约有 $${k} \\times 10 = ${k * 10}$ 个落在选定的数字中：$${k * 10}\\%$。`,
            ],
            digitBar(0),
          );
        },
        digitBar(3),
      ),
      lesson(
        "estimating-from-a-simulation",
        ["Estimating from a simulation", "由模拟作估计"],
        [
          [
            "A player makes $30\\%$ of free throws, simulated by the digits $0, 1, 2$. Each pair of random digits is a trial of two shots: in $\\text{07}$ the first shot is made and the second missed, and in $\\text{21}$ both are made. If $2$ of $20$ pairs have both digits from $0$ to $2$, the estimated probability of making both shots is $\\frac{2}{20} = 0.1$.",
            "一名运动员的罚球命中率为 $30\\%$，用数字 $0, 1, 2$ 模拟命中。每一对随机数字代表一次两罚的试验：$\\text{07}$ 表示第一罚命中、第二罚未中，$\\text{21}$ 表示两罚都中。如果 $20$ 对数字中有 $2$ 对的两个数字都在 $0$ 到 $2$ 之间，两罚都中的概率估计值就是 $\\frac{2}{20} = 0.1$。",
          ],
          [
            "The other $18$ pairs miss at least once, and $1 - \\frac{18}{20} = 0.1$.",
            "其余 $18$ 对至少有一罚未中，$1 - \\frac{18}{20} = 0.1$。",
          ],
          [
            "Each pair is one trial, so divide by the $20$ pairs, not by the $40$ digits.",
            "每一对数字是一次试验，所以要除以 $20$ 对，而不是 $40$ 个数字。",
          ],
        ],
        (rng) => {
          const [en, things, zh, thingsZh] = rng.pick(chances);
          for (;;) {
            const k = rng.int(2, 6);
            const trials = Array.from({ length: 20 }, () => [rng.int(0, 9), rng.int(0, 9)] as const);
            const yes = (d: number) => d < k;
            const atLeast = rng.bool();
            const hits = trials.filter(([x, y]) => (atLeast ? yes(x) || yes(y) : yes(x) && yes(y)));
            if (hits.length === 0 || hits.length === 20) continue;
            const h = hits.length;
            const singles = trials.flat().filter(yes).length;
            const theory = atLeast ? Q.of(1).sub(Q.of((10 - k) ** 2, 100)) : Q.of(k * k, 100);
            const pairs = trials.map(([x, y]) => `\\text{${x}${y}}`).join(", ");
            const range = k === 2 ? ["$0$ or $1$", "是 $0$ 或 $1$"] : [`from $0$ to $${k - 1}$`, `在 $0$ 到 $${k - 1}$ 之间`];
            return valued(
              [
                `The probability that ${en} is $${k * 10}\\%$. A simulation uses ${digitsFor(k).en} for “yes”, and each pair of random digits stands for 2 ${things}. Here are 20 trials:\n\n$${pairs}$\n\nEstimate the probability of “yes” for ${atLeast ? `at least one of the 2 ${things}` : `both ${things}`}.`,
                `${zh}的概率是 $${k * 10}\\%$。模拟时用${digitsFor(k)["zh-CN"]} 代表“是”，每一对随机数字代表 2 ${thingsZh}。下面是 20 次试验：\n\n$${pairs}$\n\n估计这 2 ${thingsZh}${atLeast ? "中至少有一个" : "都"}为“是”的概率。`,
              ],
              Q.of(h, 20),
              [
                [
                  ["Mark the trials", "标出试验"],
                  [
                    `A trial counts when ${atLeast ? "at least one" : "both"} of its digits ${atLeast ? "is" : "are"} ${range[0]}. These are $${hits.map(([x, y]) => `\\text{${x}${y}}`).join(", ")}$, $${h}$ of the $20$.`,
                    `当一对数字中${atLeast ? "至少有一个" : "两个都"}${range[1]}时，这次试验算作发生。这样的试验是 $${hits.map(([x, y]) => `\\text{${x}${y}}`).join(", ")}$，$20$ 次中有 $${h}$ 次。`,
                  ],
                ],
                [
                  ["Divide by the trials", "除以试验次数"],
                  ["Each pair is one trial:", "每一对数字是一次试验："],
                  [`\\frac{${h}}{20} = ${dec(Q.of(h, 20))}`],
                ],
              ],
              [
                `Count the trials that do not count, $${20 - h}$ of them, and $1 - \\frac{${20 - h}}{20} = ${dec(Q.of(h, 20))}$.`,
                `数不算作发生的试验，共 $${20 - h}$ 次，$1 - \\frac{${20 - h}}{20} = ${dec(Q.of(h, 20))}$。`,
              ],
              [
                [
                  theory,
                  `That is the theoretical probability, $${dec(theory)}$; the question asks for the estimate from these $20$ trials.`,
                  `这是理论概率 $${dec(theory)}$；题目要的是由这 $20$ 次试验得到的估计值。`,
                ],
                [
                  Q.of(singles, 40),
                  "That is the share of single digits meaning “yes”, not the share of trials.",
                  "这是单个数字为“是”所占的比例，而不是试验所占的比例。",
                ],
                [
                  Q.of(h, 40),
                  "That divides by the $40$ digits; each trial is a pair, so there are $20$ trials.",
                  "这是除以 $40$ 个数字；每次试验是一对数字，所以只有 $20$ 次试验。",
                ],
              ],
              { form: "decimal", figure: digitBar(k) },
            );
          }
        },
        digitBar(3),
      ),
    ],
  ),
  [
    "A player makes $60\\%$ of free throws. To imitate one shot, pick a random digit and let $0$ to $5$ stand for a make: $6$ of the $10$ digits. A pair of digits imitates two shots: $\\text{37}$ is a make, then a miss.",
    "一名运动员罚球命中率为 $60\\%$。要模仿一次投篮，就随机选一个数字，用 $0$ 到 $5$ 代表命中：$10$ 个数字中的 $6$ 个。一对数字模仿两次投篮：$\\text{37}$ 表示先中后不中。",
  ],
  [
    "Over many random digits, about $\\frac{6}{10}$ of them fall in $0$ to $5$, matching the $60\\%$.",
    "在大量随机数字中，大约 $\\frac{6}{10}$ 落在 $0$ 到 $5$ 之间，正好对应 $60\\%$。",
  ],
  [
    "design simulations with random digits and use their results to estimate probabilities of compound events.",
    "用随机数字设计模拟，并用模拟结果估计复合事件的概率。",
  ],
);

/** grade7ProbabilityTopics lists the 7th grade probability topics. */
export const grade7ProbabilityTopics: readonly TopicDef[] = [
  analyzingProbabilityModels,
  sampleSpacesForCompoundEvents,
  experimentalProbabilityForCompoundEvents,
  computingProbabilitiesOfCompoundEvents,
  simulatingCompoundEvents,
];
