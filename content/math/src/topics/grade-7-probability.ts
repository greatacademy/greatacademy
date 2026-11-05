import type { KnowledgePointDef, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dec, Q } from "@ga/subject-math";

import { numberProblem, steps } from "../problems.ts";
import { mathText, pickChoice } from "./grade-4-fractions.ts";
import { mdTable, sum } from "./grade-7-statistics.ts";

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

/** Model is a chance process and the names of its outcomes: [English, Chinese]. */
interface Model {
  readonly intro: Text;
  readonly outcome: Text;
  readonly outcomes: readonly (readonly [string, string])[];
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

/** analyzingProbabilityModels completes probability models, compares them with observed frequencies and judges whether they fit. */
export const analyzingProbabilityModels = topic(
  "analyzing-probability-models",
  t("Analyzing Probability Models", "分析概率模型"),
  t(
    "A probability model lists the outcomes of a chance process and a probability for each; the probabilities add up to 1. A uniform model gives every outcome the same probability. A model predicts that an outcome of probability p happens about p × n times in n trials; when the observed frequencies are far from these predictions, the model does not fit the process.",
    "概率模型列出一个随机过程的所有结果以及每个结果的概率，这些概率之和为 1。等可能模型中每个结果的概率都相同。模型预测：概率为 p 的结果在 n 次试验中大约出现 p × n 次；如果观察到的频数与预测相差很远，模型就不符合这个过程。",
  ),
  ["using-probability-to-make-predictions"],
  ["7.SP.C.7.A", "7.SP.C.7.B"],
  [
    {
      id: "completing-a-probability-model",
      title: t("Completing a probability model", "补全概率模型"),
      explanation: t(
        "The probabilities of all the outcomes add up to $1$, so a missing one is $1$ minus the others. If red, blue and green have probabilities $0.35$, $0.2$ and $0.15$, yellow has\n\n$$1 - (0.35 + 0.2 + 0.15) = 1 - 0.7 = 0.3.$$\n\nThe outcomes need not be equally likely, so the answer is not simply $\\frac{1}{4}$.",
        "所有结果的概率之和为 $1$，所以缺少的概率等于 $1$ 减去其他概率。如果红色、蓝色、绿色的概率分别是 $0.35$、$0.2$、$0.15$，黄色的概率就是\n\n$$1 - (0.35 + 0.2 + 0.15) = 1 - 0.7 = 0.3.$$\n\n这些结果不一定等可能，所以答案并不就是 $\\frac{1}{4}$。",
      ),
      generate(rng) {
        const md = rng.pick(models);
        const ps = modelProbabilities(rng);
        const i = rng.int(0, 3);
        const known = ps.filter((_, k) => k !== i);
        const o = md.outcomes[i]!;
        return numberProblem({
          prompt: t(
            `${md.intro.en} The table shows a probability model for it.${modelTable(md, ps, i).en}What is the probability of ${o[0]}?`,
            `${md.intro["zh-CN"]}下表是它的一个概率模型。${modelTable(md, ps, i)["zh-CN"]}${o[1]}的概率是多少？`,
          ),
          answer: p20(ps[i]!),
          form: "decimal",
          // The sum of the others, and a uniform model.
          wrong: [p20(sum(known)), Q.of(1, 4)],
          solution: t(
            `The probabilities add up to $1$:${steps(`1 - (${known.map((k) => dec(p20(k))).join(" + ")}) = 1 - ${dec(p20(sum(known)))} = ${dec(p20(ps[i]!))}`)}`,
            `各概率之和为 $1$：${steps(`1 - (${known.map((k) => dec(p20(k))).join(" + ")}) = 1 - ${dec(p20(sum(known)))} = ${dec(p20(ps[i]!))}`)}`,
          ),
        });
      },
    },
    {
      id: "observed-and-predicted-frequencies",
      title: t("Observed and predicted frequencies", "观察频数与预测频数"),
      explanation: t(
        "A model gives blue a probability of $0.25$. In $200$ spins it predicts about $0.25 \\times 200 = 50$ blues. If blue came up $63$ times, that is $63 - 50 = 13$ more than predicted. Compare counts with counts: $63$ against $50$, not against $0.25$.",
        "一个模型给出蓝色的概率为 $0.25$。转 $200$ 次，它预测大约出现 $0.25 \\times 200 = 50$ 次蓝色。如果蓝色实际出现了 $63$ 次，就比预测多 $63 - 50 = 13$ 次。要用次数和次数比较：$63$ 对 $50$，而不是对 $0.25$。",
      ),
      generate(rng) {
        const md = rng.pick(models);
        for (;;) {
          const ps = modelProbabilities(rng);
          const n = rng.pick([100, 200, 300, 400, 500]);
          const i = rng.int(0, 3);
          const predicted = Q.of(ps[i]! * n, 20);
          if (!predicted.isInteger()) continue;
          const observed = Number(predicted.n) + rng.int(4, 20);
          const o = md.outcomes[i]!;
          return numberProblem({
            prompt: t(
              `${md.intro.en} The table shows a probability model for it.${modelTable(md, ps, -1).en}In ${n} ${md.trials.en}, it ${md.happens(o).en} ${observed} times. How many more times is that than the model predicts?`,
              `${md.intro["zh-CN"]}下表是它的一个概率模型。${modelTable(md, ps, -1)["zh-CN"]}在 ${n} ${md.trials["zh-CN"]}中，有 ${observed} 次${md.happens(o)["zh-CN"]}。这比模型预测的多多少次？`,
            ),
            answer: observed - Number(predicted.n),
            form: "integer",
            // The prediction itself, and a uniform model's prediction.
            wrong: [predicted, Q.of(observed).sub(Q.of(n, 4))],
            solution: t(
              `The model predicts $${dec(p20(ps[i]!))} \\times ${n} = ${predicted.toLatex()}$ times:${steps(`${observed} - ${predicted.toLatex()} = ${observed - Number(predicted.n)}`)}`,
              `模型预测出现 $${dec(p20(ps[i]!))} \\times ${n} = ${predicted.toLatex()}$ 次：${steps(`${observed} - ${predicted.toLatex()} = ${observed - Number(predicted.n)}`)}`,
            ),
          });
        }
      },
    },
    {
      id: "does-a-uniform-model-fit",
      title: t("Does a uniform model fit?", "等可能模型是否符合"),
      explanation: t(
        "A fair number cube makes each face equally likely, so in $600$ rolls each face should come up about $100$ times. Counts of $94, 108, 97, 103, 92, 106$ are all close to $100$: the data fit a uniform model. If the $6$ came up $171$ times, far more than the others, the cube seems to favor $6$ and a uniform model does not fit.",
        "公平的骰子每个面出现的可能性相同，所以掷 $600$ 次，每个面大约应出现 $100$ 次。次数为 $94, 108, 97, 103, 92, 106$ 时都接近 $100$：数据符合等可能模型。如果 $6$ 出现了 $171$ 次，远多于其他面，这枚骰子似乎偏向 $6$，等可能模型就不符合。",
      ),
      generate(rng) {
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
        const uniform = t(
          "The data fit a uniform model: each face seems equally likely.",
          "数据符合等可能模型：每个面出现的可能性似乎相同。",
        );
        const biased = (k: number) =>
          t(`The data do not fit a uniform model: the cube seems to favor $${k}$.`, `数据不符合等可能模型：这枚骰子似乎偏向 $${k}$。`);
        return pickChoice(
          rng,
          t(
            `A number cube was rolled ${n} times.${table(0)}Which conclusion do the data support?`,
            `把一枚骰子掷了 ${n} 次。${table(1)}数据支持哪个结论？`,
          ),
          fair ? uniform : biased(favored),
          [
            fair ? biased(counts.indexOf(Math.max(...counts)) + 1) : uniform,
            biased(fair ? counts.indexOf(Math.min(...counts)) + 1 : other),
            t("No conclusion is possible, because the counts are not all equal.", "无法得出结论，因为各次数并不完全相等。"),
          ],
          fair
            ? t(
                `A uniform model predicts about $\\frac{${n}}{6} = ${each}$ of each face. Every count is close to $${each}$; small differences like these are expected by chance, so the data fit a uniform model.`,
                `等可能模型预测每个面大约出现 $\\frac{${n}}{6} = ${each}$ 次。每个次数都接近 $${each}$；这样小的差异是偶然造成的，所以数据符合等可能模型。`,
              )
            : t(
                `A uniform model predicts about $\\frac{${n}}{6} = ${each}$ of each face. The face $${favored}$ came up $${counts[favored - 1]}$ times, far more than predicted, while the others are close to $${each}$, so the cube seems to favor $${favored}$.`,
                `等可能模型预测每个面大约出现 $\\frac{${n}}{6} = ${each}$ 次。$${favored}$ 出现了 $${counts[favored - 1]}$ 次，远多于预测，而其他面都接近 $${each}$，所以这枚骰子似乎偏向 $${favored}$。`,
              ),
        );
      },
    },
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

/** outcomeSet writes a list of outcomes as a set: "\{\text{HH}, \text{HT}\}". */
const outcomeSet = (xs: readonly string[]) => mathText(`\\{${xs.map((x) => `\\text{${x}}`).join(", ")}\\}`);

/** arrangements lists the outcomes of n coin flips with exactly h heads, in alphabetical order: "HHT", "HTH", "THH". */
function arrangements(n: number, h: number): string[] {
  if (h < 0 || h > n) return [];
  if (n === 0) return [""];
  return [...arrangements(n - 1, h - 1).map((x) => `H${x}`), ...arrangements(n - 1, h).map((x) => `T${x}`)];
}

/** sampleSpacesForCompoundEvents lists and counts the outcomes of compound events. */
export const sampleSpacesForCompoundEvents = topic(
  "sample-spaces-for-compound-events",
  t("Sample Spaces for Compound Events", "复合事件的样本空间"),
  t(
    "A compound event is made of two or more simple experiments, such as flipping a coin and then rolling a cube. Its sample space pairs every outcome of the first experiment with every outcome of the second, and order matters: HT and TH are different outcomes. Organized lists, tables and tree diagrams make sure no outcome is missed or counted twice.",
    "复合事件由两个或更多简单试验组成，比如先抛一枚硬币，再掷一枚骰子。它的样本空间把第一个试验的每个结果与第二个试验的每个结果配对，而且顺序要考虑：HT 和 TH 是不同的结果。有序列举、表格和树状图能保证结果既不遗漏也不重复。",
  ),
  ["sample-spaces-and-events-in-probability"],
  ["7.SP.C.8.B"],
  [
    {
      id: "listing-a-compound-sample-space",
      title: t("Listing a compound sample space", "列出复合事件的样本空间"),
      explanation: t(
        "Flipping a coin and spinning a red-blue-green spinner: each of $\\text{H}, \\text{T}$ pairs with each of $\\text{R}, \\text{B}, \\text{G}$, so the sample space is $\\{\\text{HR}, \\text{HB}, \\text{HG}, \\text{TR}, \\text{TB}, \\text{TG}\\}$, $2 \\times 3 = 6$ outcomes. For two coins it is $\\{\\text{HH}, \\text{HT}, \\text{TH}, \\text{TT}\\}$: $\\text{HT}$ and $\\text{TH}$ are both listed.",
        "抛一枚硬币并转一个红蓝绿转盘：$\\text{H}, \\text{T}$ 中的每一个都与 $\\text{R}, \\text{B}, \\text{G}$ 中的每一个配对，所以样本空间是 $\\{\\text{HR}, \\text{HB}, \\text{HG}, \\text{TR}, \\text{TB}, \\text{TG}\\}$，共 $2 \\times 3 = 6$ 个结果。抛两枚硬币时是 $\\{\\text{HH}, \\text{HT}, \\text{TH}, \\text{TT}\\}$：$\\text{HT}$ 和 $\\text{TH}$ 都要列出。",
      ),
      generate(rng) {
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
        const prompt = twoCoins
          ? t(
              "A coin is flipped twice. Write H for heads and T for tails. Which is the sample space?",
              "把一枚硬币抛两次。用 H 表示正面，T 表示反面。哪个是样本空间？",
            )
          : t(
              `${spinnerFirst ? `First ${spinnerEn} is spun, then a coin is flipped` : `First a coin is flipped, then ${spinnerEn} is spun`}. Write H for heads, T for tails, and ${key}. Which is the sample space?`,
              `${spinnerFirst ? `先转${spinnerZh}，再抛一枚硬币` : `先抛一枚硬币，再转${spinnerZh}`}。用 H 表示正面，T 表示反面，${keyZh}。哪个是样本空间？`,
            );
        const missing = all.filter((_, k) => k !== rng.int(1, all.length - 1));
        const wrong = twoCoins
          ? [outcomeSet(["HH", "HT", "TT"]), outcomeSet(["H", "T"]), outcomeSet(["HH", "TT"])]
          : [
              outcomeSet([...new Set([...first, ...second])]),
              outcomeSet(missing),
              outcomeSet(first.map((a, k) => a + second[k % second.length]!)),
            ];
        return pickChoice(
          rng,
          prompt,
          outcomeSet(all),
          wrong,
          t(
            `Pair each of the ${first.length} first outcomes with each of the ${second.length} second outcomes, keeping the order: $${first.length} \\times ${second.length} = ${all.length}$ outcomes.`,
            `把第一步的 ${first.length} 个结果分别与第二步的 ${second.length} 个结果配对，并保持顺序：共 $${first.length} \\times ${second.length} = ${all.length}$ 个结果。`,
          ),
        );
      },
    },
    {
      id: "counting-outcomes-in-a-compound-event",
      title: t("Counting outcomes in a compound event", "数出复合事件中的结果"),
      explanation: t(
        "For flipping a coin and rolling a cube, “heads and an even number” has $1 \\times 3 = 3$ outcomes: H2, H4, H6. “Heads or an even number” has the $6$ outcomes with heads plus the $2 \\times 3 = 6$ with an even number, minus the $3$ counted in both: $6 + 6 - 3 = 9$.",
        "抛一枚硬币并掷一枚骰子，“正面朝上且点数为偶数”有 $1 \\times 3 = 3$ 个结果：H2、H4、H6。“正面朝上或点数为偶数”包括正面朝上的 $6$ 个结果，加上点数为偶数的 $2 \\times 3 = 6$ 个结果，再减去两边都算了的 $3$ 个：$6 + 6 - 3 = 9$。",
      ),
      generate(rng) {
        const [a, b] = rng.sample([...stages], 2) as [Stage, Stage];
        const [ea, eb] = [rng.pick(a.events), rng.pick(b.events)];
        const or = rng.bool();
        const both = ea[2] * eb[2];
        const inA = ea[2] * b.size;
        const inB = a.size * eb[2];
        const answer = or ? inA + inB - both : both;
        return numberProblem({
          prompt: t(
            `An experiment consists of ${a.en} and ${b.en}. How many outcomes have ${ea[0]} ${or ? "or" : "and"} ${eb[0]}?`,
            `一个试验包括${a.zh}和${b.zh}。有多少个结果满足“${ea[1]}${or ? "或" : "且"}${eb[1]}”？`,
          ),
          answer,
          form: "integer",
          // Counting the overlap twice, the other connective, and adding the event sizes.
          wrong: or ? [inA + inB, both, ea[2] + eb[2]] : [inA + inB - both, ea[2] + eb[2], a.size * b.size - both],
          solution: or
            ? t(
                `There are $${ea[2]} \\times ${b.size} = ${inA}$ outcomes with ${ea[0]} and $${a.size} \\times ${eb[2]} = ${inB}$ with ${eb[0]}. The $${ea[2]} \\times ${eb[2]} = ${both}$ outcomes with both are counted twice:${steps(`${inA} + ${inB} - ${both} = ${answer}`)}`,
                `满足“${ea[1]}”的结果有 $${ea[2]} \\times ${b.size} = ${inA}$ 个，满足“${eb[1]}”的结果有 $${a.size} \\times ${eb[2]} = ${inB}$ 个。两者都满足的 $${ea[2]} \\times ${eb[2]} = ${both}$ 个结果被算了两次：${steps(`${inA} + ${inB} - ${both} = ${answer}`)}`,
              )
            : t(
                `The first part has $${ea[2]}$ ${ea[2] === 1 ? "outcome" : "outcomes"} with ${ea[0]} and the second has $${eb[2]}$ with ${eb[0]}, and each pairs with each:${steps(`${ea[2]} \\times ${eb[2]} = ${both}`)}`,
                `满足“${ea[1]}”的 $${ea[2]}$ 种情况分别与满足“${eb[1]}”的 $${eb[2]}$ 种情况配对：${steps(`${ea[2]} \\times ${eb[2]} = ${both}`)}`,
              ),
        });
      },
    },
    {
      id: "counting-heads-in-coin-flips",
      title: t("Counting heads in coin flips", "数抛硬币中的正面"),
      explanation: t(
        "Flipping a coin $3$ times has $2 \\times 2 \\times 2 = 8$ outcomes. Exactly $2$ heads happens in $3$ of them: HHT, HTH, THH. The head-free flip can be in any of the three places, so these are different outcomes. At least $2$ heads adds HHH, for $4$ outcomes.",
        "把一枚硬币抛 $3$ 次有 $2 \\times 2 \\times 2 = 8$ 个结果。恰好 $2$ 次正面的有 $3$ 个：HHT、HTH、THH。反面可以出现在三个位置中的任何一个，所以它们是不同的结果。至少 $2$ 次正面还要加上 HHH，共 $4$ 个结果。",
      ),
      generate(rng) {
        for (;;) {
          const n = rng.int(3, 5);
          const kind = rng.pick(["exactly", "at least", "at most"] as const);
          const [face, faceZh, letter] = rng.pick([
            ["head", "正面", "H"],
            ["tail", "反面", "T"],
          ] as const);
          const k = rng.int(1, n - 1);
          const heads = Array.from({ length: n + 1 }, (_, i) => i).filter((h) =>
            kind === "exactly" ? h === k : kind === "at least" ? h >= k : h <= k,
          );
          // arrangements counts heads; for tails, swap the letters.
          const found = heads.map((h) =>
            arrangements(n, h).map((x) => (letter === "H" ? x : x.replace(/[HT]/g, (c) => (c === "H" ? "T" : "H")))),
          );
          const answer = sum(found.map((f) => f.length));
          if (answer > 16 || (heads.length === 1 && kind !== "exactly")) continue;
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
          return numberProblem({
            prompt: t(
              `A coin is flipped ${n} times. How many of the $${2 ** n}$ outcomes have ${kind} ${plural(k)}?`,
              `把一枚硬币抛 ${n} 次。在 $${2 ** n}$ 个结果中，有多少个${kindZh}有 ${k} 次${faceZh}？`,
            ),
            answer,
            form: "integer",
            // A single arrangement for each count, ignoring order, and leaving out the boundary count.
            wrong: [heads.length, found[0]!.length, kind === "exactly" ? n : answer - arrangements(n, k).length],
            solution: t(
              `List the outcomes, keeping track of where the ${face}s are; outcomes with the same number of ${face}s in different places are different:\n\n${listed(0)}\n\nThat is $${answer}$ outcomes.`,
              `列出这些结果，注意${faceZh}出现的位置；${faceZh}次数相同但位置不同的是不同的结果：\n\n${listed(1)}\n\n共 $${answer}$ 个结果。`,
            ),
          });
        }
      },
    },
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
export const experimentalProbabilityForCompoundEvents = topic(
  "experimental-probability-for-compound-events",
  t("Experimental Probability for Compound Events", "复合事件的试验概率"),
  t(
    "The experimental probability of a compound event is the number of trials in which it happened divided by the number of trials. Add the frequencies of all the outcomes that make up the event. The experimental probability is usually close to the theoretical one, found from the sample space, and gets closer as the number of trials grows.",
    "复合事件的试验概率等于它发生的次数除以试验总次数。要把构成这个事件的所有结果的频数相加。试验概率通常接近由样本空间求出的理论概率，而且试验次数越多越接近。",
  ),
  ["experimental-probability", "sample-spaces-for-compound-events"],
  ["7.SP.C.6", "7.SP.C.8.A"],
  [
    {
      id: "experimental-probabilities-of-compound-events",
      title: t("Experimental probabilities of compound events", "复合事件的试验概率"),
      explanation: t(
        "Two coins were tossed $80$ times: HH $18$ times, HT $22$, TH $19$ and TT $21$. Exactly one head happened in the HT and TH trials, $22 + 19 = 41$ of them, so its experimental probability is $\\frac{41}{80}$. Both HT and TH count: the event is made of two outcomes.",
        "把两枚硬币抛了 $80$ 次：HH $18$ 次，HT $22$ 次，TH $19$ 次，TT $21$ 次。恰好一枚正面朝上发生在 HT 和 TH 的试验中，共 $22 + 19 = 41$ 次，所以它的试验概率是 $\\frac{41}{80}$。HT 和 TH 都要算：这个事件由两个结果组成。",
      ),
      generate(rng) {
        const r = rng.pick(repeated);
        const n = rng.pick([40, 60, 80, 120, 150, 200]);
        const counts = pairCounts(rng, r.outcomes.length, n);
        const [name, inEvent] = rng.pick(r.events);
        const picked = r.outcomes.map((o, i) => [o, counts[i]!] as const).filter(([o]) => inEvent(o));
        const k = sum(picked.map(([, c]) => c));
        const raw = `\\frac{${picked.map(([, c]) => c).join(" + ")}}{${n}}`;
        const shown = raw === frac(k, n) ? raw : `${raw} = ${frac(k, n)}`;
        return numberProblem({
          prompt: t(
            `${r.intro(n).en}${outcomeTable(r, counts).en}What is the experimental probability of ${name.en}?`,
            `${r.intro(n)["zh-CN"]}${outcomeTable(r, counts)["zh-CN"]}“${name["zh-CN"]}”的试验概率是多少？`,
          ),
          answer: Q.of(k, n),
          // Only one of the outcomes, the theoretical probability, and the count over the number of outcomes.
          wrong: [Q.of(picked[0]![1], n), Q.of(picked.length, r.outcomes.length), Q.of(k, n - k)],
          solution: t(
            `${
              picked.length === 1
                ? `The event is the single outcome ${picked[0]![0]}. Divide its frequency by the ${n} trials:`
                : `The event is made of ${picked
                    .slice(0, -1)
                    .map(([o]) => o)
                    .join(", ")} and ${picked.at(-1)![0]}. Add their frequencies and divide by the ${n} trials:`
            }${steps(shown)}`,
            `${
              picked.length === 1
                ? `这个事件只有一个结果 ${picked[0]![0]}。用它的频数除以试验次数 ${n}：`
                : `这个事件由 ${picked.map(([o]) => o).join("、")} 组成。把它们的频数相加，再除以试验次数 ${n}：`
            }${steps(shown)}`,
          ),
        });
      },
    },
    {
      id: "experimental-and-theoretical-probabilities",
      title: t("Experimental and theoretical probabilities", "试验概率与理论概率"),
      explanation: t(
        "In the $80$ tosses, exactly one head happened $41$ times, an experimental probability of $\\frac{41}{80} = 0.5125$. The theoretical probability is $\\frac{2}{4} = 0.5$, since $2$ of the $4$ equally likely outcomes have exactly one head. They differ by $0.5125 - 0.5 = 0.0125$: close, as expected after many trials.",
        "在 $80$ 次抛掷中，恰好一枚正面朝上发生了 $41$ 次，试验概率为 $\\frac{41}{80} = 0.5125$。理论概率是 $\\frac{2}{4} = 0.5$，因为 $4$ 个等可能结果中有 $2$ 个恰好一枚正面朝上。两者相差 $0.5125 - 0.5 = 0.0125$：试验次数多时，它们本来就应该很接近。",
      ),
      generate(rng) {
        const r = rng.pick(repeated);
        for (;;) {
          const n = rng.pick([40, 60, 80, 120, 200]);
          const counts = pairCounts(rng, r.outcomes.length, n);
          const [name, inEvent] = rng.pick(r.events);
          const k = sum(counts.filter((_, i) => inEvent(r.outcomes[i]!)));
          const m = r.outcomes.filter(inEvent).length;
          const [exp, theo] = [Q.of(k, n), Q.of(m, r.outcomes.length)];
          const diff = exp.sub(theo).abs();
          if (diff.isZero()) continue;
          const [lo, hi] = exp.cmp(theo) > 0 ? [theo, exp] : [exp, theo];
          return numberProblem({
            prompt: t(
              `${r.intro(n).en}${outcomeTable(r, counts).en}By how much does the experimental probability of ${name.en} differ from its theoretical probability?`,
              `${r.intro(n)["zh-CN"]}${outcomeTable(r, counts)["zh-CN"]}“${name["zh-CN"]}”的试验概率与理论概率相差多少？`,
            ),
            answer: diff,
            // The experimental probability alone, the theoretical one alone, and the difference of counts from the prediction.
            wrong: [
              exp,
              theo,
              Q.of(k)
                .sub(theo.mul(Q.of(n)))
                .abs(),
            ],
            solution: t(
              `Experimental: $${frac(k, n)}$. Theoretical: $${m}$ of the $${r.outcomes.length}$ equally likely outcomes, $${frac(m, r.outcomes.length)}$. Subtract the smaller from the larger:${steps(`${hi.toLatex()} - ${lo.toLatex()} = ${diff.toLatex()}`)}`,
              `试验概率：$${frac(k, n)}$。理论概率：$${r.outcomes.length}$ 个等可能结果中有 $${m}$ 个，$${frac(m, r.outcomes.length)}$。用较大的减去较小的：${steps(`${hi.toLatex()} - ${lo.toLatex()} = ${diff.toLatex()}`)}`,
            ),
          });
        }
      },
    },
  ],
);

/** computingProbabilitiesOfCompoundEvents finds probabilities of compound events from sample spaces and by multiplying. */
export const computingProbabilitiesOfCompoundEvents = topic(
  "computing-probabilities-of-compound-events",
  t("Computing Probabilities of Compound Events", "计算复合事件的概率"),
  t(
    "When all the outcomes of a compound experiment are equally likely, the probability of an event is the number of outcomes in it divided by the size of the sample space. When the parts of the experiment do not affect each other, the probability that one event happens in the first part and another in the second is the product of their probabilities.",
    "复合试验的所有结果等可能时，事件的概率等于它包含的结果数除以样本空间的大小。当试验的各部分互不影响时，第一部分发生某事件且第二部分发生另一事件的概率，等于它们概率的乘积。",
  ),
  ["sample-spaces-for-compound-events", "single-events-in-probability"],
  ["7.SP.C.8.A", "7.SP.C.8.B"],
  [
    {
      id: "probabilities-from-a-compound-sample-space",
      title: t("Probabilities from a compound sample space", "由复合样本空间求概率"),
      explanation: t(
        "Spinners numbered $1$ to $4$ and $1$ to $3$ give $4 \\times 3 = 12$ equally likely pairs. A sum of $5$ comes from $(2, 3), (3, 2), (4, 1)$, so its probability is $\\frac{3}{12} = \\frac{1}{4}$. Divide by the $12$ pairs, not by the $6$ possible sums: the sums are not equally likely.",
        "标有 $1$ 到 $4$ 和 $1$ 到 $3$ 的两个转盘共有 $4 \\times 3 = 12$ 个等可能的数对。和为 $5$ 的有 $(2, 3), (3, 2), (4, 1)$，所以概率是 $\\frac{3}{12} = \\frac{1}{4}$。要除以 $12$ 个数对，而不是 $6$ 种可能的和：各种和并不等可能。",
      ),
      generate(rng) {
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
          const sums = new Set(pairs.map(([x, y]) => x + y)).size;
          return numberProblem({
            prompt: t(
              `Two spinners are spun: one numbered 1 to ${a} and one numbered 1 to ${b}, with equal sections. What is the probability of ${event[0].en}?`,
              `转两个各部分大小相同的转盘：一个标有 1 到 ${a}，另一个标有 1 到 ${b}。${event[0]["zh-CN"]}的概率是多少？`,
            ),
            answer: Q.of(hits.length, a * b),
            // Dividing by the sum of the sizes, and, for sums, by the number of possible sums.
            wrong: [Q.of(hits.length, a + b), ...(kind === "sum" ? [Q.of(1, sums)] : []), Q.of(hits.length, a * b - hits.length)],
            solution: t(
              `There are $${a} \\times ${b} = ${a * b}$ equally likely pairs. Those with ${event[0].en} are $${hits.map(([x, y]) => `(${x}, ${y})`).join(", ")}$:${steps(frac(hits.length, a * b))}`,
              `共有 $${a} \\times ${b} = ${a * b}$ 个等可能的数对。满足“${event[0]["zh-CN"]}”的是 $${hits.map(([x, y]) => `(${x}, ${y})`).join(", ")}$：${steps(frac(hits.length, a * b))}`,
            ),
          });
        }
      },
    },
    {
      id: "multiplying-probabilities",
      title: t("Multiplying probabilities", "概率相乘"),
      explanation: t(
        "A bag holds $3$ red and $5$ blue marbles, and a number cube is rolled. The probability of drawing red and rolling more than $4$ is\n\n$$\\frac{3}{8} \\times \\frac{2}{6} = \\frac{6}{48} = \\frac{1}{8}.$$\n\nOf the $8 \\times 6 = 48$ equally likely pairs, $3 \\times 2 = 6$ are in the event. Adding the probabilities would answer “or”, and is wrong for “and”.",
        "袋子里有 $3$ 颗红色和 $5$ 颗蓝色弹珠，另外掷一枚骰子。摸到红色且掷出大于 $4$ 的数的概率是\n\n$$\\frac{3}{8} \\times \\frac{2}{6} = \\frac{6}{48} = \\frac{1}{8}.$$\n\n在 $8 \\times 6 = 48$ 个等可能的组合中，有 $3 \\times 2 = 6$ 个属于这个事件。把两个概率相加是在近似回答“或”，对“且”来说是错的。",
      ),
      generate(rng) {
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
        return numberProblem({
          prompt: t(
            `A bag holds ${r} ${c1[0]} and ${o} ${c2[0]} marbles. One marble is drawn at random and a number cube is rolled. What is the probability of drawing ${c1[0]} and rolling ${en}?`,
            `袋子里有 ${r} 颗${c1[1]}和 ${o} 颗${c2[1]}弹珠。随机摸出一颗弹珠，再掷一枚骰子。摸到${c1[1]}弹珠且掷出${zh}的概率是多少？`,
          ),
          answer,
          // Adding the probabilities, adding the counts, and using the ratio of colors instead of the share.
          wrong: [Q.of(r, n).add(Q.of(k, 6)), Q.of(r + k, n + 6), Q.of(r, o).mul(Q.of(k, 6))].filter((w) => w.cmp(Q.of(1)) <= 0),
          solution: t(
            `The draw and the roll do not affect each other, so multiply:${steps(`\\frac{${r}}{${n}} \\times \\frac{${k}}{6} = ${frac(r * k, n * 6)}`)}`,
            `摸弹珠和掷骰子互不影响，所以相乘：${steps(`\\frac{${r}}{${n}} \\times \\frac{${k}}{6} = ${frac(r * k, n * 6)}`)}`,
          ),
        });
      },
    },
    {
      id: "two-draws-with-replacement",
      title: t("Two draws with replacement", "有放回地抽两次"),
      explanation: t(
        "A bag holds $3$ red and $2$ blue tiles. A tile is drawn, put back, and a tile is drawn again. Putting it back makes the second draw just like the first, so\n\n$$P(\\text{red, then red}) = \\frac{3}{5} \\times \\frac{3}{5} = \\frac{9}{25}.$$\n\nWithout putting it back, the second draw would be from $4$ tiles, $2$ of them red.",
        "袋子里有 $3$ 块红色和 $2$ 块蓝色的方块。摸出一块后放回，再摸一块。放回使第二次和第一次完全一样，所以\n\n$$P(\\text{红，再红}) = \\frac{3}{5} \\times \\frac{3}{5} = \\frac{9}{25}.$$\n\n如果不放回，第二次就是从 $4$ 块中摸，其中只有 $2$ 块红色。",
      ),
      generate(rng) {
        const [r, b] = [rng.int(2, 6), rng.int(2, 6)];
        const n = r + b;
        const mixed = rng.bool();
        const answer = mixed ? Q.of(r * b, n * n) : Q.of(r * r, n * n);
        return numberProblem({
          prompt: t(
            `A bag holds ${r} red and ${b} blue tiles. A tile is drawn at random, put back, and a second tile is drawn. What is the probability of ${mixed ? "red on the first draw and blue on the second" : "red on both draws"}?`,
            `袋子里有 ${r} 块红色和 ${b} 块蓝色的方块。随机摸出一块，放回后再摸一块。${mixed ? "第一次摸到红色且第二次摸到蓝色" : "两次都摸到红色"}的概率是多少？`,
          ),
          answer,
          // Not putting the tile back, the probability of a single draw, and adding instead of multiplying.
          wrong: [
            mixed ? Q.of(r * b, n * (n - 1)) : Q.of(r * (r - 1), n * (n - 1)),
            Q.of(mixed ? b : r, n),
            Q.of(mixed ? r + b : 2 * r, n),
          ].filter((w) => w.cmp(Q.of(1)) < 0),
          solution: t(
            `The tile is put back, so each draw is from all ${n} tiles:${steps(`\\frac{${r}}{${n}} \\times \\frac{${mixed ? b : r}}{${n}} = ${frac(mixed ? r * b : r * r, n * n)}`)}`,
            `方块放回了，所以每次都是从全部 ${n} 块中摸：${steps(`\\frac{${r}}{${n}} \\times \\frac{${mixed ? b : r}}{${n}} = ${frac(mixed ? r * b : r * r, n * n)}`)}`,
          ),
        });
      },
    },
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

/** simulatingCompoundEvents designs simulations with random digits and estimates compound probabilities from them. */
export const simulatingCompoundEvents = topic(
  "simulating-compound-events",
  t("Simulating Compound Events", "模拟复合事件"),
  t(
    "A simulation imitates a chance process with something whose probabilities are known, such as random digits. With digits from 0 to 9, each digit has probability 1/10, so letting 3 of the digits stand for an event models a probability of 30%. For a compound event, each trial uses one digit per part, and the share of trials in which the event happens estimates its probability.",
    "模拟是用概率已知的东西（例如随机数字）来模仿一个随机过程。在 0 到 9 的数字中，每个数字的概率都是 1/10，所以用其中 3 个数字代表某事件，就模拟了 30% 的概率。对于复合事件，每次试验中每个部分用一个数字，事件发生的试验所占的比例就是它概率的估计值。",
  ),
  ["experimental-probability-for-compound-events"],
  ["7.SP.C.8.C"],
  [
    {
      id: "designing-a-simulation",
      title: t("Designing a simulation", "设计模拟"),
      explanation: t(
        "To simulate a player who makes $30\\%$ of free throws, choose a random digit from $0$ to $9$ and let $0, 1, 2$ stand for a make: $3$ of the $10$ digits give $\\frac{3}{10} = 30\\%$. The digits $0$ to $3$ would be $4$ digits, or $40\\%$, and a coin would model $50\\%$.",
        "要模拟一名罚球命中率为 $30\\%$ 的运动员，可以从 $0$ 到 $9$ 中随机选一个数字，用 $0, 1, 2$ 代表命中：$10$ 个数字中有 $3$ 个，概率为 $\\frac{3}{10} = 30\\%$。用 $0$ 到 $3$ 就是 $4$ 个数字，即 $40\\%$；用硬币则模拟的是 $50\\%$。",
      ),
      generate(rng) {
        const [en, , zh] = rng.pick(chances);
        const k = rng.pick([1, 2, 3, 4, 6, 7, 8, 9]);
        const digits = (j: number) =>
          t(
            `Pick a random digit from 0 to 9, and let ${digitsFor(j).en} stand for “yes”.`,
            `从 0 到 9 中随机选一个数字，用${digitsFor(j)["zh-CN"]} 代表“是”。`,
          );
        return pickChoice(
          rng,
          t(
            `The probability that ${en} is $${k * 10}\\%$. Which simulation models one trial?`,
            `${zh}的概率是 $${k * 10}\\%$。哪种模拟能模仿一次试验？`,
          ),
          digits(k),
          [
            digits(k + 1),
            k === 1 ? digits(2) : digits(k - 1),
            t("Flip a coin, and let heads stand for “yes”.", "抛一枚硬币，用正面代表“是”。"),
            k === 1
              ? digits(3)
              : t(
                  `Pick a random digit from 0 to 9, and let the digit ${k} stand for “yes”.`,
                  `从 0 到 9 中随机选一个数字，用数字 ${k} 代表“是”。`,
                ),
          ],
          t(
            `Each of the $10$ digits has probability $\\frac{1}{10}$, so ${k === 1 ? "1 digit is" : `${k} digits are`} needed for $\\frac{${k}}{10} = ${k * 10}\\%$. ${k === 1 ? "The digit $0$ alone will do" : `Starting at $0$, these are the digits $0$ to $${k - 1}$`}. A coin models $50\\%$.`,
            `$10$ 个数字中每个的概率都是 $\\frac{1}{10}$，所以需要 ${k} 个数字才能得到 $\\frac{${k}}{10} = ${k * 10}\\%$。${k === 1 ? "只用数字 $0$ 即可" : `从 $0$ 开始，就是 $0$ 到 $${k - 1}$`}。硬币模拟的是 $50\\%$。`,
          ),
        );
      },
    },
    {
      id: "estimating-from-a-simulation",
      title: t("Estimating from a simulation", "由模拟作估计"),
      explanation: t(
        "A player makes $30\\%$ of free throws, simulated by the digits $0, 1, 2$. Each pair of random digits is a trial of two shots: in $\\text{07}$ the first shot is made and the second missed, and in $\\text{21}$ both are made. If $2$ of $20$ pairs have both digits from $0$ to $2$, the estimated probability of making both shots is $\\frac{2}{20} = 0.1$.",
        "一名运动员的罚球命中率为 $30\\%$，用数字 $0, 1, 2$ 模拟命中。每一对随机数字代表一次两罚的试验：$\\text{07}$ 表示第一罚命中、第二罚未中，$\\text{21}$ 表示两罚都中。如果 $20$ 对数字中有 $2$ 对的两个数字都在 $0$ 到 $2$ 之间，两罚都中的概率估计值就是 $\\frac{2}{20} = 0.1$。",
      ),
      generate(rng) {
        const [en, things, zh, thingsZh] = rng.pick(chances);
        for (;;) {
          const k = rng.int(2, 6);
          const trials = Array.from({ length: 20 }, () => [rng.int(0, 9), rng.int(0, 9)] as const);
          const yes = (d: number) => d < k;
          const atLeast = rng.bool();
          const hits = trials.filter(([x, y]) => (atLeast ? yes(x) || yes(y) : yes(x) && yes(y)));
          if (hits.length === 0 || hits.length === 20) continue;
          const singles = trials.flat().filter(yes).length;
          const theory = atLeast ? Q.of(1).sub(Q.of((10 - k) ** 2, 100)) : Q.of(k * k, 100);
          const pairs = trials.map(([x, y]) => `\\text{${x}${y}}`).join(", ");
          return numberProblem({
            prompt: t(
              `The probability that ${en} is $${k * 10}\\%$. A simulation uses ${digitsFor(k).en} for “yes”, and each pair of random digits stands for 2 ${things}. Here are 20 trials:\n\n$${pairs}$\n\nEstimate the probability of “yes” for ${atLeast ? `at least one of the 2 ${things}` : `both ${things}`}.`,
              `${zh}的概率是 $${k * 10}\\%$。模拟时用${digitsFor(k)["zh-CN"]} 代表“是”，每一对随机数字代表 2 ${thingsZh}。下面是 20 次试验：\n\n$${pairs}$\n\n估计这 2 ${thingsZh}${atLeast ? "中至少有一个" : "都"}为“是”的概率。`,
            ),
            answer: Q.of(hits.length, 20),
            form: "decimal",
            // The theoretical probability, the share of single digits, and counting the pairs as 40 trials.
            wrong: [theory, Q.of(singles, 40), Q.of(hits.length, 40)],
            solution: t(
              `A trial counts when ${atLeast ? "at least one" : "both"} of its digits ${atLeast ? "is" : "are"} ${k === 2 ? "$0$ or $1$" : `from $0$ to $${k - 1}$`}. These trials are $${hits.map(([x, y]) => `\\text{${x}${y}}`).join(", ")}$, $${hits.length}$ of the $20$:${steps(`\\frac{${hits.length}}{20} = ${dec(Q.of(hits.length, 20))}`)}`,
              `当一对数字中${atLeast ? "至少有一个" : "两个都"}${k === 2 ? "是 $0$ 或 $1$ " : `在 $0$ 到 $${k - 1}$ 之间`}时，这次试验算作发生。这样的试验是 $${hits.map(([x, y]) => `\\text{${x}${y}}`).join(", ")}$，$20$ 次中有 $${hits.length}$ 次：${steps(`\\frac{${hits.length}}{20} = ${dec(Q.of(hits.length, 20))}`)}`,
            ),
          });
        }
      },
    },
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
