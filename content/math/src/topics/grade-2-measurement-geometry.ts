// 2nd Grade Math: length in inches, feet, centimeters and meters, time to five
// minutes, money, line plots, picture graphs and bar graphs, and shapes.

import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { dotPlot, svgDocument } from "@ga/subject-math";

import {
  barGraphFigure,
  clockFigure,
  coinsFigure,
  cutBarFigure,
  earlyNames,
  earlyPoint,
  earlyTopic,
  gridFigure,
  lengthBarsFigure,
  nearbyWrong,
  numberLineFigure,
  pictureGraphFigure,
  polygonFigure,
  rulerFigure,
  slicedCircleFigure,
} from "../early-grades-kit.ts";
import { numberProblem } from "../problems.ts";
import { plural } from "./grade-2-numbers-operations.ts";
import { pickChoice } from "./grade-4-fractions.ts";

/** whole builds a problem whose answer is a whole number, with a figure when one is given. */
function whole(
  prompt: readonly [string, string],
  answer: number,
  wrong: readonly number[],
  solution: readonly [string, string],
  figure?: Figure,
): Problem {
  const problem = numberProblem({
    prompt: t(prompt[0], prompt[1]),
    answer,
    form: "integer",
    wrong: nearbyWrong(answer, ...wrong),
    solution: t(solution[0], solution[1]),
  });
  return figure ? { ...problem, figure } : problem;
}

/** timeText writes a time such as 3:05. */
const timeText = (hour: number, minute: number) => `${hour}:${String(minute).padStart(2, "0")}`;

/** LengthUnit is a unit of length as a singular and plural English word, a Chinese word and a symbol for figures. */
interface LengthUnit {
  readonly one: string;
  readonly many: string;
  readonly zh: string;
  readonly symbol: string;
}

const inch: LengthUnit = { one: "inch", many: "inches", zh: "英寸", symbol: "in" };
const foot: LengthUnit = { one: "foot", many: "feet", zh: "英尺", symbol: "ft" };
const centimeter: LengthUnit = { one: "centimeter", many: "centimeters", zh: "厘米", symbol: "cm" };
const meter: LengthUnit = { one: "meter", many: "meters", zh: "米", symbol: "m" };

/** unitCount writes a count with a unit of length in English, using the singular for 1. */
const unitCount = (n: number, unit: LengthUnit) => `${n} ${n === 1 ? unit.one : unit.many}`;

/** smallObjects are things short enough to lay along a ruler. */
const smallObjects: readonly { readonly en: string; readonly zh: string; readonly measure: string }[] = [
  { en: "crayon", zh: "蜡笔", measure: "支" },
  { en: "pencil", zh: "铅笔", measure: "支" },
  { en: "ribbon", zh: "丝带", measure: "条" },
  { en: "paper strip", zh: "纸条", measure: "张" },
  { en: "stick", zh: "木棍", measure: "根" },
  { en: "straw", zh: "吸管", measure: "根" },
];

const measuringInchesCentimeters = earlyTopic(
  "measuring-length-in-inches-and-centimeters",
  ["Measuring Length in Inches and Centimeters", "用英寸和厘米量长度"],
  [
    "Use a ruler to measure a length in whole inches or centimeters, even when the object does not start at 0.",
    "用尺子量出长度是几英寸或几厘米，物体不从 0 开始时也能量。",
  ],
  ["measuring-with-non-standard-units"],
  ["2.MD.A.1"],
  [
    earlyPoint(
      "reading-a-ruler-from-zero",
      ["Reading a ruler from zero", "从 0 开始读尺子"],
      [
        "A ruler is a row of equal units laid end to end, with a number to count each one. Line up one end of the object with the 0. Then look across to where the other end stops and read the number there. That number tells how many units fit along the object, so you do not have to count them.",
        "尺子是一排首尾相接的相同单位，每个单位都用一个数来计数。把物体的一端对准 0，再看另一端停在哪里，读出那里的数。这个数说明物体上能排下几个单位，所以不用一个一个地数。",
      ],
      (rng) => {
        const unit = rng.pick([inch, centimeter]);
        const max = rng.int(8, 12);
        const length = rng.int(2, max);
        const object = rng.pick(smallObjects);
        return whole(
          [`How long is this ${object.en}, in ${unit.many}?`, `这${object.measure}${object.zh}有多长？（单位：${unit.zh}）`],
          length,
          [max, length + 2],
          [
            `Its left end is at 0 and its right end is at ${length}, so it is ${unitCount(length, unit)} long.`,
            `它的左端对着 0，右端对着 ${length}，所以长 ${length} ${unit.zh}。`,
          ],
          rulerFigure(length, unit.symbol, max),
        );
      },
    ),
    earlyPoint(
      "reading-a-ruler-not-from-zero",
      ["Reading a ruler when the start is not zero", "不从 0 开始读尺子"],
      [
        "An object need not sit at the 0 of a ruler. Then the number at its end is not its length, because the units before its start do not count. Find the number at each end and subtract, or count the spaces between them. Counting the tick marks instead of the spaces gives one too many, so count the spaces.",
        "物体不一定对着尺子的 0。这时右端的数就不是它的长度，因为它左端之前的那些单位不算。读出两端的数再相减，或者数两端之间的格子。数刻度线会多出一个，所以要数格子。",
      ],
      (rng) => {
        const unit = rng.pick([inch, centimeter]);
        const max = 12;
        const start = rng.int(1, 6);
        const length = rng.int(2, max - start);
        const object = rng.pick(smallObjects);
        return whole(
          [`How long is this ${object.en}, in ${unit.many}?`, `这${object.measure}${object.zh}有多长？（单位：${unit.zh}）`],
          length,
          [start + length, start, length + 1],
          [
            `It runs from ${start} to ${start + length}, and $${start + length} - ${start} = ${length}$, so it is ${unitCount(length, unit)} long.`,
            `它从 ${start} 到 ${start + length}，$${start + length} - ${start} = ${length}$，所以长 ${length} ${unit.zh}。`,
          ],
          rulerFigure(length, unit.symbol, max, start),
        );
      },
    ),
  ],
);

const feetAndMeters = earlyTopic(
  "feet-and-meters",
  ["Feet and Meters", "英尺和米"],
  ["Know how long a foot and a meter are, and choose a tool to measure with.", "知道 1 英尺和 1 米有多长，并选择合适的测量工具。"],
  ["measuring-length-in-inches-and-centimeters"],
  ["2.MD.A.1"],
  [
    earlyPoint(
      "inches-in-feet-and-centimeters-in-meters",
      ["Inches in feet and centimeters in meters", "英尺里的英寸和米里的厘米"],
      [
        "Long things are easier to measure with long units. One foot is the same as 12 inches, about the length of a large school ruler. One meter is the same as 100 centimeters, a bit taller than a kitchen counter. To find how many small units there are, add the small units for each large unit, one after another.",
        "长的东西用长的单位量更容易。1 英尺等于 12 英寸，大约是学校里一把大尺子的长度。1 米等于 100 厘米，比厨房的台面高一点。要求有多少个小单位，就每个大单位加一次小单位，一个接一个地加。",
      ],
      (rng) => {
        const object = rng.pick([
          { en: "rope", zh: "绳子", measure: "根" },
          { en: "board", zh: "木板", measure: "块" },
          { en: "pipe", zh: "管子", measure: "根" },
          { en: "bench", zh: "长椅", measure: "条" },
          { en: "carpet", zh: "地毯", measure: "块" },
          { en: "fence", zh: "栅栏", measure: "段" },
        ]);
        const feet = rng.bool();
        const count = rng.int(2, feet ? 5 : 9);
        const each = feet ? 12 : 100;
        const answer = count * each;
        const large = feet ? foot : meter;
        const small = feet ? inch : centimeter;
        const sum = Array(count).fill(`${each}`).join(" + ");
        return whole(
          [
            `A ${object.en} is ${unitCount(count, large)} long. How many ${small.many} is that?`,
            `一${object.measure}${object.zh}长 ${count} ${large.zh}。这是多少${small.zh}？`,
          ],
          answer,
          [count + each, each, answer + each, answer - each],
          [
            `Each ${large.one} is ${each} ${small.many}, so add ${each} once for each ${large.one}: $${sum} = ${answer}$.`,
            `每 1 ${large.zh}是 ${each} ${small.zh}，有几${large.zh}就加几次 ${each}：$${sum} = ${answer}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "choosing-a-measuring-tool",
      ["Choosing a measuring tool", "选择测量工具"],
      [
        "Good measuring starts with the right tool. A ruler is handy for things that fit on a desk. A meter stick or a yardstick is better for longer things, such as a door or a table. A measuring tape bends, so it can go around a curved thing such as a head or a ball, or stretch along a whole room.",
        "测量得准，先要选对工具。尺子适合量能放在桌上的东西。米尺或码尺更适合量较长的东西，比如门或桌子。卷尺可以弯，所以能绕着弯曲的东西量，比如头或球，也能拉开量整个房间。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const tools = {
          ruler: t("a ruler", "尺子"),
          stick: t("a meter stick", "米尺"),
          tape: t("a measuring tape", "卷尺"),
          clock: t("a clock", "钟表"),
          scale: t("a kitchen scale", "厨房秤"),
        };
        const task = rng.pick<{ en: string; zh: string; tool: "ruler" | "stick" | "tape" }>([
          { en: "the length of a paper clip", zh: "回形针的长度", tool: "ruler" },
          { en: "the length of an eraser", zh: "橡皮的长度", tool: "ruler" },
          { en: "the width of a notebook", zh: "笔记本的宽度", tool: "ruler" },
          { en: "the length of a crayon", zh: "蜡笔的长度", tool: "ruler" },
          { en: "the height of a door", zh: "门的高度", tool: "stick" },
          { en: "the width of a table", zh: "桌子的宽度", tool: "stick" },
          { en: "the height of a bookcase", zh: "书架的高度", tool: "stick" },
          { en: "the distance around a ball", zh: "球一周的长度", tool: "tape" },
          { en: "the distance around a tree trunk", zh: "树干一周的长度", tool: "tape" },
          { en: "the distance around a person's head", zh: "头一周的长度", tool: "tape" },
        ]);
        const others =
          task.tool === "tape"
            ? [tools.ruler, tools.stick, rng.pick([tools.clock, tools.scale])]
            : [task.tool === "ruler" ? tools.stick : tools.ruler, tools.clock, tools.scale];
        const reason = {
          ruler: t("fits on a desk, so a short ruler is easy to use", "能放在桌上，用短尺子很方便"),
          stick: t(
            "is too long for a short ruler but straight, so a meter stick suits it",
            "太长，短尺子不合适，但它是直的，所以用米尺合适",
          ),
          tape: t("is curved, and only a tape can bend around it", "是弯的，只有卷尺能绕着它弯"),
        }[task.tool];
        return pickChoice(
          rng,
          t(`${name} wants to measure ${task.en}. Which tool is best?`, `${name} 想量${task.zh}。用哪种工具最好？`),
          tools[task.tool],
          others,
          t(`The thing being measured ${reason.en}.`, `要量的东西${reason["zh-CN"]}。`),
        );
      },
    ),
  ],
);

const sameLengthDifferentUnits = earlyTopic(
  "same-length-in-different-units",
  ["The Same Length in Different Units", "同一长度用不同单位"],
  ["See that a smaller unit needs a bigger number to measure the same length.", "明白量同样的长度时，单位越小，数就越大。"],
  ["feet-and-meters"],
  ["2.MD.A.2"],
  [
    earlyPoint(
      "smaller-units-mean-a-bigger-number",
      ["Smaller units mean a bigger number", "单位越小，数越大"],
      [
        "Measuring a thing with a different unit does not change how long it is. It only changes the number you say. Small units need many copies to cover the length, and large units need only a few. So the same rope is a few feet long and many inches long. Whenever the unit shrinks, the number grows.",
        "用不同的单位量同一个东西，它的长短并没有变，变的只是说出来的数。小单位要很多个才能铺满，大单位只要几个。所以同一根绳子是几英尺，也是很多英寸。单位变小，数就变大。",
      ],
      (rng) => {
        const object = rng.pick([
          { en: "rope", zh: "绳子", measure: "根" },
          { en: "plank", zh: "木板", measure: "块" },
          { en: "hose", zh: "水管", measure: "根" },
          { en: "ladder", zh: "梯子", measure: "架" },
          { en: "rug", zh: "地毯", measure: "块" },
        ]);
        const usesFeet = rng.bool();
        const count = rng.int(2, 8);
        const large = usesFeet ? foot : meter;
        const small = usesFeet ? inch : centimeter;
        const each = usesFeet ? 12 : 100;
        const line = (n: number) => t(unitCount(n, small), `${n} ${small.zh}`);
        return pickChoice(
          rng,
          t(
            `A ${object.en} measures ${unitCount(count, large)}. Which of these could be its length in ${small.many}?`,
            `一${object.measure}${object.zh}长 ${count} ${large.zh}。用${small.zh}量，它的长度可能是下面哪一个？`,
          ),
          line(count * each),
          [line(count), line(count + each), line(Math.max(1, Math.floor(count / 2)))],
          t(
            `${usesFeet ? "An inch" : "A centimeter"} is much smaller than a ${large.one}, so the number must be much bigger. Each ${large.one} is ${each} ${small.many}, which makes ${count * each}.`,
            `${small.zh}比${large.zh}小得多，所以数一定大得多。每 1 ${large.zh}是 ${each} ${small.zh}，一共是 ${count * each}。`,
          ),
        );
      },
    ),
    earlyPoint(
      "from-big-blocks-to-small-blocks",
      ["From big blocks to small blocks", "从大方块到小方块"],
      [
        "Picture a line of big blocks with small blocks laid beside it. If each big block is as long as a few small ones, every big block in the line brings that many small ones with it. So you add the small ones again for each big one. The line stays exactly as long as it was before.",
        "想象一排大方块，旁边摆着小方块。如果每个大方块和几个小方块一样长，那么这排中每个大方块都对应那么多小方块。所以每有一个大方块，就再加一次小方块。这一排的长度和原来完全一样。",
      ],
      (rng) => {
        const big = rng.int(2, 8);
        const each = rng.int(2, 4);
        const answer = big * each;
        const widths = Array<number>(big).fill(1);
        const object = rng.pick([
          { en: "shelf", zh: "架子" },
          { en: "wall", zh: "墙" },
          { en: "table", zh: "桌子" },
        ]);
        return whole(
          [
            `This bar shows big blocks along a ${object.en}. One big block is as long as ${each} small blocks. How many small blocks would it take to cover the same length?`,
            `这个长条表示沿着${object.zh}排的大方块。1 个大方块和 ${each} 个小方块一样长。铺满同样的长度需要多少个小方块？`,
          ],
          answer,
          [big + each, big, each],
          [
            `There are ${big} big blocks, and each is ${each} small blocks, so add ${each} a total of ${big} times to get ${answer}.`,
            `有 ${big} 个大方块，每个是 ${each} 个小方块，所以把 ${each} 加 ${big} 次，得到 ${answer}。`,
          ],
          cutBarFigure(widths),
        );
      },
    ),
  ],
);

const estimatingLengths = earlyTopic(
  "estimating-lengths",
  ["Estimating Lengths", "估计长度"],
  ["Make a sensible guess at a length using what you know about units.", "利用对单位的了解，合理地估计长度。"],
  ["feet-and-meters"],
  ["2.MD.A.3"],
  [
    earlyPoint(
      "about-how-long-is-it",
      ["About how long is it", "大约有多长"],
      [
        "An estimate is a sensible guess, close to the true length, made without measuring. It helps to carry pictures in your head. An inch is about as wide as your thumb, a centimeter about as wide as your little finger, a foot about as long as a big ruler, and a meter about as long as a big step.",
        "估计是不用尺子量，做出接近真实长度的合理猜测。心里有几个参照很有帮助。1 英寸大约是大拇指的宽度，1 厘米大约是小指的宽度，1 英尺大约是一把大尺子的长度，1 米大约是大步走一步的长度。",
      ],
      (rng) => {
        const item = rng.pick<{ en: string; zh: string; right: number; unit: LengthUnit; wrong: readonly [number, LengthUnit][] }>([
          {
            en: "a new crayon",
            zh: "一支新蜡笔",
            right: 4,
            unit: inch,
            wrong: [
              [4, foot],
              [40, inch],
            ],
          },
          {
            en: "a toothbrush",
            zh: "一把牙刷",
            right: 7,
            unit: inch,
            wrong: [
              [7, foot],
              [70, inch],
            ],
          },
          {
            en: "a soup spoon",
            zh: "一把汤匙",
            right: 6,
            unit: inch,
            wrong: [
              [6, foot],
              [60, inch],
            ],
          },
          {
            en: "a sheet of writing paper",
            zh: "一张写字纸",
            right: 11,
            unit: inch,
            wrong: [
              [11, foot],
              [1, inch],
            ],
          },
          {
            en: "a door",
            zh: "一扇门",
            right: 7,
            unit: foot,
            wrong: [
              [7, inch],
              [70, foot],
            ],
          },
          {
            en: "a classroom",
            zh: "一间教室",
            right: 30,
            unit: foot,
            wrong: [
              [30, inch],
              [300, foot],
            ],
          },
          {
            en: "a bus",
            zh: "一辆公共汽车",
            right: 40,
            unit: foot,
            wrong: [
              [40, inch],
              [4, inch],
            ],
          },
          {
            en: "a bed",
            zh: "一张床",
            right: 6,
            unit: foot,
            wrong: [
              [6, inch],
              [60, foot],
            ],
          },
          {
            en: "a paper clip",
            zh: "一枚回形针",
            right: 3,
            unit: centimeter,
            wrong: [
              [3, meter],
              [30, centimeter],
            ],
          },
          {
            en: "a pencil",
            zh: "一支铅笔",
            right: 18,
            unit: centimeter,
            wrong: [
              [18, meter],
              [2, centimeter],
            ],
          },
          {
            en: "a house key",
            zh: "一把钥匙",
            right: 5,
            unit: centimeter,
            wrong: [
              [5, meter],
              [50, centimeter],
            ],
          },
          {
            en: "a sneaker",
            zh: "一只运动鞋",
            right: 25,
            unit: centimeter,
            wrong: [
              [25, meter],
              [2, centimeter],
            ],
          },
          {
            en: "a swimming pool",
            zh: "一个游泳池",
            right: 25,
            unit: meter,
            wrong: [
              [25, centimeter],
              [2, centimeter],
            ],
          },
          {
            en: "a tall tree",
            zh: "一棵大树",
            right: 15,
            unit: meter,
            wrong: [
              [15, centimeter],
              [150, meter],
            ],
          },
          {
            en: "a car",
            zh: "一辆汽车",
            right: 4,
            unit: meter,
            wrong: [
              [4, centimeter],
              [40, meter],
            ],
          },
          {
            en: "a soccer field",
            zh: "一个足球场",
            right: 100,
            unit: meter,
            wrong: [
              [100, centimeter],
              [10, centimeter],
            ],
          },
        ]);
        const name = rng.pick(earlyNames);
        const line = (n: number, unit: LengthUnit) => t(unitCount(n, unit), `${n} ${unit.zh}`);
        const [w1, w2] = item.wrong as [[number, LengthUnit], [number, LengthUnit]];
        return pickChoice(
          rng,
          t(
            `${name} estimates the size of ${item.en}. Which estimate makes the most sense?`,
            `${name} 估计${item.zh}有多长或多高。哪个估计最合理？`,
          ),
          line(item.right, item.unit),
          [line(w1[0], w1[1]), line(w2[0], w2[1]), line(item.right * 20, item.unit)],
          t(
            `Think about the size of the unit: ${item.en} is about ${unitCount(item.right, item.unit)}, and the other choices are far too long or too short.`,
            `想一想单位的大小：${item.zh}大约是 ${item.right} ${item.unit.zh}，其他选项都太长或太短了。`,
          ),
        );
      },
    ),
    earlyPoint(
      "estimating-from-a-known-length",
      ["Estimating from a known length", "由已知长度来估计"],
      [
        "A length you already know is a good measuring stick for your eyes. Picture how many copies of the known bar would fit along the new one, and lay them out in your head. Then count up by that length once for each copy. It will not always come out exact, but it should come close to the true length.",
        "已知的长度可以当作眼中的尺子。想一想新长条上能排下几个已知长条，在脑子里把它们摆好。再按这个长度，每个数一次。不一定完全准确，但应该接近真实的长度。",
      ],
      (rng) => {
        const known = rng.int(2, 5);
        const copies = rng.int(2, 4);
        const unit = rng.pick([inch, centimeter]);
        const answer = known * copies;
        const swap = rng.bool();
        const [knownLabel, otherLabel] = swap ? ["B", "A"] : ["A", "B"];
        const line = (n: number) => t(unitCount(n, unit), `${n} ${unit.zh}`);
        return pickChoice(
          rng,
          t(
            `Bar ${knownLabel} is ${unitCount(known, unit)} long. About how long is bar ${otherLabel}?`,
            `长条 ${knownLabel} 长 ${known} ${unit.zh}。长条 ${otherLabel} 大约有多长？`,
          ),
          line(answer),
          [line(known), line(answer + 2 * known), line(answer + 1 + known * 4)],
          t(
            `About ${copies} copies of bar ${knownLabel} fit along bar ${otherLabel}, and ${copies} copies of ${known} make ${answer}.`,
            `长条 ${otherLabel} 上大约能排下 ${copies} 个长条 ${knownLabel}，${copies} 个 ${known} 是 ${answer}。`,
          ),
          lengthBarsFigure(["A", "B"], swap ? [answer, known] : [known, answer]),
        );
      },
    ),
  ],
);

const comparingLengths = earlyTopic(
  "comparing-lengths-by-measuring",
  ["Comparing Lengths by Measuring", "通过测量比较长度"],
  ["Measure two objects and find how much longer one is than the other.", "量出两个物体的长度，求一个比另一个长多少。"],
  ["measuring-length-in-inches-and-centimeters"],
  ["2.MD.A.4"],
  [
    earlyPoint(
      "how-much-longer-from-unit-blocks",
      ["How much longer from unit blocks", "由单位方块看长多少"],
      [
        "Two bars that start from the same line are easy to compare. The longer bar sticks out past the end of the shorter one, and that extra part is how much longer it is. You can count the blocks in the extra part, or count the blocks in each bar and subtract. Both ways must give you the same answer.",
        "从同一条线开始的两个长条很容易比较。长的那个比短的那个多出一截，这一截就是长多少。可以数多出来的方块，也可以数每个长条的方块再相减。两种方法的答案一定相同。",
      ],
      (rng) => {
        const a = rng.int(3, 10);
        const answer = rng.int(1, 12 - a);
        const b = a + answer;
        const unit = rng.pick([inch, centimeter]);
        const swap = rng.bool();
        const [shortLabel, longLabel] = swap ? ["B", "A"] : ["A", "B"];
        return whole(
          [
            `Each block is 1 ${unit.one} long. How much longer is bar ${longLabel} than bar ${shortLabel}, in ${unit.many}?`,
            `每个方块长 1 ${unit.zh}。长条 ${longLabel} 比长条 ${shortLabel} 长多少${unit.zh}？`,
          ],
          answer,
          [a, b, a + b],
          [
            `Bar ${longLabel} has ${b} blocks and bar ${shortLabel} has ${a}, and $${b} - ${a} = ${answer}$.`,
            `长条 ${longLabel} 有 ${b} 个方块，长条 ${shortLabel} 有 ${a} 个，$${b} - ${a} = ${answer}$。`,
          ],
          lengthBarsFigure(["A", "B"], swap ? [b, a] : [a, b], true),
        );
      },
    ),
    earlyPoint(
      "how-much-longer-from-a-ruler",
      ["How much longer from a ruler", "由尺子看长多少"],
      [
        "To compare a thing you can measure with a length you have been told, first read the ruler to find the length, and then compare the two numbers. Check the question to see which one is longer before subtracting. The units must be the same, or else the numbers cannot be compared in this simple way.",
        "要比较一个能量的东西和一个已知的长度，先读尺子求出长度，再比较两个数。相减之前，看清问题，弄清哪个更长。单位必须相同，不然这两个数就不能这样简单地比较。",
      ],
      (rng) => {
        const unit = rng.pick([inch, centimeter]);
        const object = rng.pick(smallObjects);
        const length = rng.int(3, 11);
        const diff = rng.int(1, 12);
        const other = length + diff;
        return whole(
          [
            `A second ${object.en} is ${unitCount(other, unit)} long. How much longer is it than the ${object.en} shown on the ruler, in ${unit.many}?`,
            `另一${object.measure}${object.zh}长 ${other} ${unit.zh}。它比尺子上的${object.zh}长多少${unit.zh}？`,
          ],
          diff,
          [length, other, length + other],
          [
            `The ruler shows ${unitCount(length, unit)}, and $${other} - ${length} = ${diff}$.`,
            `尺子显示 ${length} ${unit.zh}，$${other} - ${length} = ${diff}$。`,
          ],
          rulerFigure(length, unit.symbol, 12),
        );
      },
    ),
  ],
);

const lengthWordProblems = earlyTopic(
  "length-word-problems",
  ["Length Word Problems", "长度应用题"],
  [
    "Add and subtract lengths within 100 to solve stories about ropes, ribbons and paths.",
    "在 100 以内加减长度，解决关于绳子、丝带和小路的问题。",
  ],
  ["comparing-lengths-by-measuring", "subtracting-within-100"],
  ["2.MD.B.5"],
  [
    earlyPoint(
      "joining-lengths-end-to-end",
      ["Joining lengths end to end", "把长度首尾相接"],
      [
        "When you tie two ropes together or walk one stretch of a path after another, the lengths add up. Picture them end to end along a line. Keep the unit with your answer, as a number by itself does not tell how long something is. Both lengths must use the same unit before you can add them.",
        "把两根绳子系在一起，或者走完一段路再走一段，长度就要相加。想象它们在一条线上首尾相接。答案要带上单位，因为只有一个数说不清有多长。两个长度必须用同一个单位，才能相加。",
      ],
      (rng) => {
        const story = rng.pick([
          { en: "ropes", zh: "绳子", one: "rope", unit: foot, measure: "根" },
          { en: "ribbons", zh: "丝带", one: "ribbon", unit: centimeter, measure: "条" },
          { en: "ribbons", zh: "丝带", one: "ribbon", unit: inch, measure: "条" },
          { en: "hoses", zh: "水管", one: "hose", unit: meter, measure: "根" },
        ]);
        const a = rng.int(12, 58);
        const b = rng.int(11, 40);
        const answer = a + b;
        const name = rng.pick(earlyNames);
        return whole(
          [
            `${name} joins two ${story.en} end to end. One is ${a} ${story.unit.many} long and the other is ${b} ${story.unit.many} long. How long are they together, in ${story.unit.many}?`,
            `${name} 把两${story.measure}${story.zh}首尾相接。一${story.measure}长 ${a} ${story.unit.zh}，另一${story.measure}长 ${b} ${story.unit.zh}。合起来有多长？（单位：${story.unit.zh}）`,
          ],
          answer,
          [Math.abs(a - b), answer + 10, answer - 10],
          [
            `Lengths end to end add up: $${a} + ${b} = ${answer}$ ${story.unit.many}.`,
            `首尾相接的长度相加：$${a} + ${b} = ${answer}$ ${story.unit.zh}。`,
          ],
        );
      },
    ),
    earlyPoint(
      "cutting-a-length",
      ["Cutting off a length", "剪去一段长度"],
      [
        "When a piece is cut off, what is left is shorter than the whole length. A picture is a good help: draw one long bar, and mark the piece that was cut. The bar now has two parts that add up to the whole. If you know the whole and one part, you can subtract to find the other part.",
        "剪掉一段后，剩下的比原来短。画图很有帮助：画一个长条，标出剪掉的那一段。这个长条就有了两部分，加起来等于全长。知道全长和其中一部分，就可以用减法求另一部分。",
      ],
      (rng) => {
        const story = rng.pick([
          { en: "ribbon", zh: "丝带", unit: centimeter, measure: "条" },
          { en: "ribbon", zh: "丝带", unit: inch, measure: "条" },
          { en: "rope", zh: "绳子", unit: foot, measure: "根" },
          { en: "wire", zh: "铁丝", unit: meter, measure: "根" },
        ]);
        const left = rng.int(11, 50);
        const cut = rng.int(11, 39);
        const full = left + cut;
        const name = rng.pick(earlyNames);
        const askLeft = rng.bool();
        return askLeft
          ? whole(
              [
                `A ${story.en} is ${full} ${story.unit.many} long. ${name} cuts off ${cut} ${story.unit.many}. How long is the piece that is left, in ${story.unit.many}?`,
                `一${story.measure}${story.zh}长 ${full} ${story.unit.zh}。${name} 剪掉 ${cut} ${story.unit.zh}。剩下的有多长？（单位：${story.unit.zh}）`,
              ],
              left,
              [full + cut, left + 10, left - 10],
              [
                `The whole length take away the cut piece: $${full} - ${cut} = ${left}$.`,
                `全长减去剪掉的部分：$${full} - ${cut} = ${left}$。`,
              ],
            )
          : whole(
              [
                `${name} cuts a piece off a ${story.en} that was ${full} ${story.unit.many} long. The piece that is left is ${left} ${story.unit.many} long. How long is the piece that was cut off, in ${story.unit.many}?`,
                `${name} 从一${story.measure}长 ${full} ${story.unit.zh}的${story.zh}上剪下一段。剩下的长 ${left} ${story.unit.zh}。剪下的那段有多长？（单位：${story.unit.zh}）`,
              ],
              cut,
              [full + left, cut + 10, left],
              [`The two pieces make the whole, so $${full} - ${left} = ${cut}$.`, `两段合起来是全长，所以 $${full} - ${left} = ${cut}$。`],
            );
      },
    ),
  ],
);

const sumsOnANumberLine = earlyTopic(
  "sums-and-differences-on-a-number-line",
  ["Sums and Differences on a Number Line", "数轴上的和与差"],
  [
    "Show adding as a jump to the right and subtracting as a jump to the left on a number line.",
    "在数轴上，用向右跳表示加，用向左跳表示减。",
  ],
  ["subtracting-within-100"],
  ["2.MD.B.6"],
  [
    earlyPoint(
      "jumping-right-to-add",
      ["Jumping right to add", "向右跳表示加"],
      [
        "A number line is like a ruler that goes on and on, with each number the same distance from the next. To add, begin at the first number and move right by the second number. Where you land is the sum. The tick marks may count by fives or tens, so check what each space is worth before moving.",
        "数轴就像一把长长的尺子，相邻两个数之间的距离都一样。要做加法，就从第一个数开始，向右移动第二个数那么多。落在哪里，和就是几。刻度可能按 5 或按 10 增加，所以移动之前，先看清每一格代表多少。",
      ],
      (rng) => {
        const step = rng.pick([5, 10]);
        const lo = step === 5 ? 5 * rng.int(0, 10) : 0;
        const ticks = 10;
        const hi = lo + ticks * step;
        const start = lo + step * rng.int(1, 5);
        const jump = step * rng.int(1, Math.floor((hi - start) / step));
        const answer = start + jump;
        return whole(
          [
            `The marked point is at the start. Move right by ${jump}. Which number do you land on?`,
            `标出的点是起点。向右移动 ${jump}。落在哪个数上？`,
          ],
          answer,
          [start - jump > 0 ? start - jump : start, answer + step, jump],
          [
            `Moving right means adding: $${start} + ${jump} = ${answer}$, which is ${jump / step === 1 ? "1 space" : `${jump / step} spaces`} of ${step} from the start.`,
            `向右移动就是加：$${start} + ${jump} = ${answer}$，也就是从起点跳 ${jump / step} 格，每格 ${step}。`,
          ],
          numberLineFigure(lo, hi, step, start),
        );
      },
    ),
    earlyPoint(
      "jumping-left-to-subtract",
      ["Jumping left to subtract", "向左跳表示减"],
      [
        "To subtract on a number line, begin at the larger number and move left by the amount taken away. Where you land is the difference. Moving left makes numbers smaller, and moving right makes them larger, so the direction tells you the operation. Counting the spaces you pass, not the tick marks you touch, keeps your count correct.",
        "在数轴上做减法，就从较大的数开始，向左移动减去的数那么多。落在哪里，差就是几。向左移动，数变小；向右移动，数变大，所以方向说明了运算。要数经过的格子，不要数碰到的刻度，这样才数得对。",
      ],
      (rng) => {
        const step = rng.pick([5, 10]);
        const lo = step === 5 ? 5 * rng.int(0, 10) : 0;
        const ticks = 10;
        const start = lo + step * rng.int(5, ticks);
        const jump = step * rng.int(1, (start - lo) / step);
        const answer = start - jump;
        return whole(
          [
            `The marked point is at the start. Move left by ${jump}. Which number do you land on?`,
            `标出的点是起点。向左移动 ${jump}。落在哪个数上？`,
          ],
          answer,
          [start + jump, answer + step],
          [
            `Moving left means subtracting: $${start} - ${jump} = ${answer}$, which is ${jump / step === 1 ? "1 space" : `${jump / step} spaces`} of ${step} from the start.`,
            `向左移动就是减：$${start} - ${jump} = ${answer}$，也就是从起点跳 ${jump / step} 格，每格 ${step}。`,
          ],
          numberLineFigure(lo, lo + ticks * step, step, start),
        );
      },
    ),
  ],
);

const tellingTimeFiveMinutes = earlyTopic(
  "telling-time-to-five-minutes",
  ["Telling Time to Five Minutes", "认识钟表：精确到 5 分钟"],
  ["Read the minute hand by counting by fives, and write the time a clock shows.", "按 5 数来读分针，并写出钟面上的时间。"],
  ["telling-time-to-the-half-hour", "skip-counting-by-2s-5s-and-10s"],
  ["2.MD.C.7"],
  [
    earlyPoint(
      "counting-minutes-by-fives",
      ["Counting minutes by fives", "按 5 数分钟"],
      [
        "The long hand counts minutes, and it takes 5 minutes to go from one number on the clock to the next. So count by fives, starting at the 12, until you reach the long hand. If it points at the 3, you say 5, 10, 15, and that is 15 minutes after the hour. The number the hand points at is not the minutes.",
        "长针表示分钟，从钟面上的一个数走到下一个数要 5 分钟。所以从 12 开始按 5 数，一直数到长针。如果它指着 3，就数 5、10、15，也就是过了 15 分钟。长针指着的数并不是分钟数。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        const minute = 5 * rng.int(1, 11);
        return whole(
          ["How many minutes past the hour does this clock show?", "这个钟面上显示过了整点多少分钟？"],
          minute,
          [minute / 5, 60 - minute, hour],
          [
            `The long hand points at the ${minute / 5}, and counting by fives from the 12 reaches ${minute}.`,
            `长针指着 ${minute / 5}，从 12 开始按 5 数，数到 ${minute}。`,
          ],
          clockFigure(hour, minute),
        );
      },
    ),
    earlyPoint(
      "reading-the-whole-time",
      ["Reading the whole time", "读出完整的时间"],
      [
        "To read a clock, take the short hand first. It tells the hour, and when it sits between two numbers, the hour is the smaller one that it has already passed. Then count the long hand by fives to find the minutes. Write the hour, then a colon, then the minutes, using two digits, such as 3:05.",
        "读钟面时，先看短针，它表示几时。如果它在两个数之间，就取已经走过的那个较小的数。再按 5 数长针，求出几分。先写时，再写冒号，再写分，分要写两位，比如 3:05。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        const minute = 5 * rng.int(1, 11);
        const next = hour === 12 ? 1 : hour + 1;
        const asOption = (h: number, m: number) => t(timeText(h, m), timeText(h, m));
        return pickChoice(
          rng,
          t("What time does this clock show?", "这个钟面显示几时几分？"),
          asOption(hour, minute),
          [
            asOption(next, minute),
            asOption(minute / 5, (hour * 5) % 60),
            asOption(hour, minute === 5 ? 55 : minute - 5),
            asOption(hour === 1 ? 12 : hour - 1, minute),
          ],
          t(
            `The short hand has passed the ${hour}, and the long hand at the ${minute / 5} means ${minute} minutes, so the time is ${timeText(hour, minute)}.`,
            `短针已经走过 ${hour}，长针指着 ${minute / 5} 表示 ${minute} 分，所以时间是 ${timeText(hour, minute)}。`,
          ),
          clockFigure(hour, minute),
        );
      },
    ),
  ],
);

const amAndPm = earlyTopic(
  "a-m-and-p-m",
  ["A.M. and P.M.", "上午和下午"],
  [
    "Use a.m. for times from midnight to noon and p.m. for times from noon to midnight.",
    "午夜到中午用上午（a.m.），中午到午夜用下午（p.m.）。",
  ],
  ["telling-time-to-five-minutes"],
  ["2.MD.C.7"],
  [
    earlyPoint(
      "the-best-time-for-an-activity",
      ["The best time for an activity", "活动的合适时间"],
      [
        "A clock goes around twice a day, so every time comes up twice. To tell them apart we write a.m. for the part of the day from midnight to noon, and p.m. for the part from noon to midnight. Think about what you are doing at that time of day, and whether it comes before lunch or after it.",
        "钟表一天走两圈，所以每个时刻都会出现两次。为了区分，午夜到中午这段时间写作上午（a.m.），中午到午夜这段时间写作下午（p.m.）。想一想这时你在做什么，是在午饭之前，还是午饭之后。",
      ],
      (rng) => {
        const act = rng.pick<{ en: string; zh: string; hour: number; minute: number; am: boolean }>([
          { en: "eat breakfast", zh: "吃早饭", hour: 7, minute: 30, am: true },
          { en: "wake up for school", zh: "起床上学", hour: 6, minute: 45, am: true },
          { en: "ride the bus to school", zh: "坐校车上学", hour: 7, minute: 50, am: true },
          { en: "start the first lesson of the school day", zh: "上第一节课", hour: 8, minute: 15, am: true },
          { en: "play at morning recess", zh: "课间玩耍", hour: 10, minute: 20, am: true },
          { en: "eat lunch", zh: "吃午饭", hour: 12, minute: 15, am: false },
          { en: "come home from school", zh: "放学回家", hour: 3, minute: 30, am: false },
          { en: "go to soccer practice after school", zh: "放学后去踢足球", hour: 4, minute: 15, am: false },
          { en: "eat dinner", zh: "吃晚饭", hour: 6, minute: 30, am: false },
          { en: "go to bed", zh: "上床睡觉", hour: 8, minute: 30, am: false },
        ]);
        const name = rng.pick(earlyNames);
        const clock = (h: number, m: number, am: boolean) =>
          t(`${timeText(h, m)} ${am ? "a.m." : "p.m."}`, `${am ? "上午" : "下午"} ${timeText(h, m)}`);
        const elsewhere = act.hour <= 3 || act.hour === 12 ? 9 : 2;
        return pickChoice(
          rng,
          t(`Which is the most likely time for ${name} to ${act.en}?`, `${name} 什么时间最有可能${act.zh}？`),
          clock(act.hour, act.minute, act.am),
          [clock(act.hour, act.minute, !act.am), clock(elsewhere, act.minute, !act.am), clock(elsewhere + 1, act.minute, !act.am)],
          act.am
            ? t(
                `This happens before noon, so it is an a.m. time: ${timeText(act.hour, act.minute)} a.m.`,
                `这件事发生在中午之前，所以是上午：上午 ${timeText(act.hour, act.minute)}。`,
              )
            : t(
                `This happens after noon, so it is a p.m. time: ${timeText(act.hour, act.minute)} p.m.`,
                `这件事发生在中午之后，所以是下午：下午 ${timeText(act.hour, act.minute)}。`,
              ),
        );
      },
    ),
    earlyPoint(
      "which-happens-in-the-a-m-or-p-m",
      ["Which happens in the a.m. or p.m.", "哪件事发生在上午或下午"],
      [
        "Noon is the middle of the day, and midnight is the middle of the night. Most people sleep through the very start of the a.m. hours and wake up later in the morning. The p.m. hours bring the afternoon and evening. Picture your own day from morning to night and place each event where it belongs.",
        "中午是一天的中间，午夜是夜晚的中间。上午刚开始时大多数人还在睡觉，到了早晨才起床。下午包括午后和晚上。想象自己从早到晚的一天，把每件事放到它应该在的位置。",
      ],
      (rng) => {
        const mornings: readonly Text[] = [
          t("Watching the sun rise", "看日出"),
          t("Brushing teeth after waking up", "起床后刷牙"),
          t("Packing a school bag before leaving home", "出门前收拾书包"),
          t("Eating a morning bowl of cereal", "早上吃一碗麦片"),
          t("Walking to school", "走路去上学"),
        ];
        const evenings: readonly Text[] = [
          t("Watching the sun set", "看日落"),
          t("Doing homework after school", "放学后做作业"),
          t("Eating dinner with the family", "和家人吃晚饭"),
          t("Reading a story at bedtime", "睡前读故事"),
          t("Looking at the stars", "看星星"),
        ];
        const asksAm = rng.bool();
        const [right, wrong] = asksAm ? [mornings, evenings] : [evenings, mornings];
        const correct = rng.pick(right);
        const others = rng.sample(wrong, 3);
        return pickChoice(
          rng,
          t(
            `Which of these most likely happens in the ${asksAm ? "a.m." : "p.m."}?`,
            `下面哪件事最有可能发生在${asksAm ? "上午" : "下午"}？`,
          ),
          correct,
          others,
          asksAm
            ? t(
                `A.m. is from midnight to noon, so it fits "${correct.en.toLowerCase()}", and the others come after noon.`,
                `上午是午夜到中午，所以应该是“${correct["zh-CN"]}”，其他的都在中午之后。`,
              )
            : t(
                `P.m. is from noon to midnight, so it fits "${correct.en.toLowerCase()}", and the others come before noon.`,
                `下午是中午到午夜，所以应该是“${correct["zh-CN"]}”，其他的都在中午之前。`,
              ),
        );
      },
    ),
  ],
);

const coinNames: readonly { readonly value: number; readonly en: string; readonly many: string; readonly zh: string }[] = [
  { value: 1, en: "penny", many: "pennies", zh: "1 美分" },
  { value: 5, en: "nickel", many: "nickels", zh: "5 美分" },
  { value: 10, en: "dime", many: "dimes", zh: "10 美分" },
  { value: 25, en: "quarter", many: "quarters", zh: "25 美分" },
];

const countingCoins = earlyTopic(
  "counting-coins",
  ["Counting Coins", "数硬币"],
  [
    "Know what pennies, nickels, dimes and quarters are worth, and count a group of coins.",
    "知道 1 美分、5 美分、10 美分和 25 美分硬币的面值，并数出一组硬币共值多少。",
  ],
  ["skip-counting-by-2s-5s-and-10s"],
  ["2.MD.C.8"],
  [
    earlyPoint(
      "cents-from-coin-names",
      ["Cents from coin names", "由硬币名称求美分数"],
      [
        "A penny is worth 1 cent, a nickel is worth 5 cents, a dime is worth 10 cents and a quarter is worth 25 cents. Size does not tell you the value, since a dime is smaller than a nickel. Start with the coins worth the most, and then count on by the values of the smaller coins until you run out.",
        "1 美分硬币（penny）值 1 美分，5 美分硬币（nickel）值 5 美分，10 美分硬币（dime）值 10 美分，25 美分硬币（quarter）值 25 美分。大小并不说明面值，10 美分硬币比 5 美分硬币还小。从面值最大的硬币开始，再按较小硬币的面值往后数，直到数完。",
      ],
      (rng) => {
        const [low, high] = rng.pick([
          [coinNames[0], coinNames[1]],
          [coinNames[0], coinNames[2]],
          [coinNames[1], coinNames[2]],
          [coinNames[0], coinNames[3]],
          [coinNames[1], coinNames[3]],
        ]) as [(typeof coinNames)[number], (typeof coinNames)[number]];
        const nh = rng.int(high.value === 25 ? 1 : 2, high.value === 25 ? 3 : 6);
        const nl = rng.int(2, high.value === 25 ? 4 : 6);
        const answer = nh * high.value + nl * low.value;
        const name = rng.pick(earlyNames);
        const coinsEn = (n: number, c: (typeof coinNames)[number]) => `${n} ${n === 1 ? c.en : c.many}`;
        return whole(
          [
            `${name} has ${coinsEn(nh, high)} and ${coinsEn(nl, low)}. How many cents is that?`,
            `${name} 有 ${nh} 枚 ${high.zh}硬币和 ${nl} 枚 ${low.zh}硬币。一共是多少美分？`,
          ],
          answer,
          [nh + nl, nh * low.value + nl * high.value],
          [
            `${nh === 1 ? `The ${high.en} makes` : `The ${high.many} make`} ${nh * high.value} cents and the ${low.many} make ${nl * low.value} cents, and $${nh * high.value} + ${nl * low.value} = ${answer}$.`,
            `${high.zh}硬币共 ${nh * high.value} 美分，${low.zh}硬币共 ${nl * low.value} 美分，$${nh * high.value} + ${nl * low.value} = ${answer}$。`,
          ],
        );
      },
    ),
    earlyPoint(
      "counting-a-picture-of-coins",
      ["Counting a picture of coins", "数图中的硬币"],
      [
        "To count a mix of coins, line them up from the largest value to the smallest, and count on as you touch each one. Say the running total aloud as you go: 25, 35, 40, 41, for instance. The number of coins is not the amount of money, and five coins may be worth far more than ten others.",
        "数混在一起的硬币时，从面值最大的排到最小的，摸一枚就往后数一枚。一边数一边说出累计的数，比如 25、35、40、41。硬币的枚数不等于钱数，5 枚硬币可能比 10 枚别的硬币值钱得多。",
      ],
      (rng) => {
        const counts = [rng.int(0, 2), rng.int(1, 3), rng.int(0, 3), rng.int(1, 4)] as const;
        const [q, d, n, p] = counts;
        const coins = rng.shuffle([
          ...Array<number>(q).fill(25),
          ...Array<number>(d).fill(10),
          ...Array<number>(n).fill(5),
          ...Array<number>(p).fill(1),
        ]);
        const answer = 25 * q + 10 * d + 5 * n + p;
        const sorted = [...coins].sort((a, b) => b - a);
        let running = 0;
        const steps = sorted.map((v) => {
          running += v;
          return running;
        });
        return whole(
          ["How many cents are these coins worth?", "这些硬币一共值多少美分？"],
          answer,
          [coins.length, answer + 5, answer - 5],
          [
            `Count on from the largest coin: ${steps.join(", ")}. That is ${answer} cents.`,
            `从面值最大的硬币开始往后数：${steps.join("、")}。一共是 ${answer} 美分。`,
          ],
          coinsFigure(coins),
        );
      },
    ),
  ],
);

const dollarsAndCents = earlyTopic(
  "dollars-and-cents",
  ["Dollars and Cents", "美元和美分"],
  ["Write amounts with dollars and cents, and solve money stories.", "用美元和美分写出钱数，并解决关于钱的问题。"],
  ["counting-coins"],
  ["2.MD.C.8"],
  [
    earlyPoint(
      "writing-dollars-and-cents",
      ["Writing dollars and cents", "写出美元和美分"],
      [
        "One dollar is worth 100 cents. We write money with a dollar sign, a point and two more digits, such as \\$2.35, which is 2 dollars and 35 cents. Count the bills first and write that number before the point. Then count the coins, and write the cents in the two places after the point, using a zero if needed.",
        "1 美元等于 100 美分。写钱数时，用美元符号、小数点和后面的两位数字，比如 \\$2.35，就是 2 美元 35 美分。先数纸币，把这个数写在小数点前。再数硬币，把美分写在小数点后的两位上，需要时补 0。",
      ],
      (rng) => {
        const bills = rng.int(1, 3);
        const q = rng.int(0, 2);
        const d = rng.int(0, 2);
        const n = rng.int(0, 1);
        const p = rng.int(q + d + n === 0 ? 1 : 0, 3);
        const cents = 25 * q + 10 * d + 5 * n + p;
        const money = (dollars: number, c: number) =>
          t(`\\$${dollars}.${String(c).padStart(2, "0")}`, `\\$${dollars}.${String(c).padStart(2, "0")}`);
        const coins = [
          ...Array<number>(bills).fill(100),
          ...Array<number>(q).fill(25),
          ...Array<number>(d).fill(10),
          ...Array<number>(n).fill(5),
          ...Array<number>(p).fill(1),
        ];
        return pickChoice(
          rng,
          t("How much money is shown here?", "这里一共有多少钱？"),
          money(bills, cents),
          [money(bills + 1, cents), money(bills, cents + 10), money(bills, cents >= 10 ? cents - 5 : cents + 5)],
          t(
            `The bills make ${plural(bills, "dollar")} and the coins make ${cents} cents, so the amount is \\$${bills}.${String(cents).padStart(2, "0")}.`,
            `纸币是 ${bills} 美元，硬币是 ${cents} 美分，所以钱数是 \\$${bills}.${String(cents).padStart(2, "0")}。`,
          ),
          coinsFigure(coins),
        );
      },
    ),
    earlyPoint(
      "money-word-problems",
      ["Money word problems", "关于钱的问题"],
      [
        "Money stories work like other adding and subtracting stories, as long as you keep to one unit. Add when buying two things to find the cost, and subtract to find what is left. When you pay with a dollar, change is what you get back, so start with 100 cents and take away the price of what you bought.",
        "关于钱的问题和其他加减问题一样，只要用同一个单位就行。买两样东西求总价就相加，求剩下多少就相减。用 1 美元付钱时，找回的钱就是用 100 美分减去东西的价钱。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const item = rng.pick([
          { en: "pencil", zh: "铅笔" },
          { en: "sticker", zh: "贴纸" },
          { en: "notebook", zh: "笔记本" },
          { en: "bouncy ball", zh: "弹力球" },
          { en: "toy car", zh: "玩具汽车" },
        ]);
        const kind = rng.int(0, 2);
        if (kind === 0) {
          const price = 5 * rng.int(3, 19);
          const answer = 100 - price;
          return whole(
            [
              `${name} pays for a ${item.en} with 1 dollar. The ${item.en} costs ${price} cents. How many cents does ${name} get back?`,
              `${name} 用 1 美元买${item.zh}，${item.zh}的价钱是 ${price} 美分。${name} 应该找回多少美分？`,
            ],
            answer,
            [price, 100 + price, answer + 10],
            [`A dollar is 100 cents, and $100 - ${price} = ${answer}$.`, `1 美元是 100 美分，$100 - ${price} = ${answer}$。`],
          );
        }
        if (kind === 1) {
          const a = rng.int(11, 55);
          const b = rng.int(11, 40);
          const answer = a + b;
          return whole(
            [
              `A ${item.en} costs ${a} cents and a marker costs ${b} cents. How many cents do they cost together?`,
              `${item.zh}的价钱是 ${a} 美分，记号笔的价钱是 ${b} 美分。两样一共多少美分？`,
            ],
            answer,
            [Math.abs(a - b), answer + 10, answer - 10],
            [`Add the two prices: $${a} + ${b} = ${answer}$ cents.`, `把两个价钱相加：$${a} + ${b} = ${answer}$ 美分。`],
          );
        }
        const start = rng.int(10, 40);
        const spend = rng.int(2, start - 2);
        const answer = start - spend;
        return whole(
          [
            `${name} has ${start} dollars and spends ${spend} dollars on a book. How many dollars does ${name} have left?`,
            `${name} 有 ${start} 美元，买书用了 ${spend} 美元。${name} 还剩多少美元？`,
          ],
          answer,
          [start + spend, answer + 10],
          [
            `Take what was spent from the start: $${start} - ${spend} = ${answer}$ dollars.`,
            `从开始的钱里减去花掉的：$${start} - ${spend} = ${answer}$ 美元。`,
          ],
        );
      },
    ),
  ],
);

/** linePlotData draws a stack of pencil lengths for a line plot, with one length having the most marks. */
function linePlotData(rng: Rng): { readonly values: number[]; readonly top: number } {
  const lengths = [3, 4, 5, 6, 7, 8, 9];
  const top = rng.pick(lengths);
  const values: number[] = [];
  for (const length of lengths) {
    const marks = length === top ? 4 : rng.int(0, 3);
    for (let i = 0; i < marks; i++) values.push(length);
  }
  return { values, top };
}

/** linePlotFigure draws a line plot of pencil lengths in inches. */
const linePlotFigure = (values: readonly number[]): Figure => ({
  svg: dotPlot(values, { min: 3, max: 9, step: 1 }),
  alt: t(
    `A line plot of pencil lengths from 3 to 9 inches, with one dot at each of: ${values.join(", ")}.`,
    `铅笔长度的线图，从 3 到 9 英寸，点分别在：${values.join("、")}。`,
  ),
});

const linePlotsOfLengths = earlyTopic(
  "line-plots-of-lengths",
  ["Line Plots of Lengths", "长度的线图"],
  ["Read a line plot made from lengths measured in whole inches.", "读用整数英寸测量长度所画的线图。"],
  ["measuring-length-in-inches-and-centimeters"],
  ["2.MD.D.9"],
  [
    earlyPoint(
      "reading-marks-on-a-line-plot",
      ["Reading marks on a line plot", "读线图上的点"],
      [
        "A line plot is a number line with marks stacked above it. Each mark stands for one thing that was measured, and the number below it tells its length. So to find how many things have one length, count the marks in that one stack. The number below tells you the length, and the marks tell you how many.",
        "线图是在数轴上方摞起一些点。每个点代表一个被测量的东西，下面的数说明它的长度。所以要知道某个长度的东西有几个，就数那一摞的点。下面的数说明长度，点说明有几个。",
      ],
      (rng) => {
        const { values } = linePlotData(rng);
        const v = rng.pick(values);
        const answer = values.filter((x) => x === v).length;
        return whole(
          [
            `This line plot shows the lengths of some pencils, in inches. How many pencils are ${unitCount(v, inch)} long?`,
            `这个线图表示一些铅笔的长度（英寸）。长 ${v} 英寸的铅笔有多少支？`,
          ],
          answer,
          [v, values.length],
          [
            `There ${answer === 1 ? "is 1 mark" : `are ${answer} marks`} above the ${v}, one for each pencil.`,
            `${v} 上方有 ${answer} 个点，每个点是一支铅笔。`,
          ],
          linePlotFigure(values),
        );
      },
    ),
    earlyPoint(
      "finding-the-most-common-length",
      ["The most common length", "最常见的长度"],
      [
        "A line plot lets you see at a glance how measurements are spread out. The tallest stack shows the length that came up most often. The answer to which length is most common is the number below the stack, and not the number of marks in it. Reading both carefully stops you from mixing them up.",
        "从线图上一眼就能看出测量结果是怎样分布的。最高的那一摞，表示出现次数最多的长度。问哪个长度最常见，答案是这一摞下面的数，而不是这一摞点的个数。两样都看清楚，就不会弄混。",
      ],
      (rng) => {
        const { values, top } = linePlotData(rng);
        return whole(
          [
            "This line plot shows the lengths of some pencils, in inches. Which length came up most often, in inches?",
            "这个线图表示一些铅笔的长度（英寸）。哪个长度出现的次数最多？（单位：英寸）",
          ],
          top,
          [4, values.length],
          [
            `The tallest stack, with 4 marks, is above the ${top}, so ${top} inches is the most common length.`,
            `最高的一摞有 4 个点，在 ${top} 的上方，所以 ${top} 英寸是最常见的长度。`,
          ],
          linePlotFigure(values),
        );
      },
    ),
  ],
);

/** graphStories are the things that the picture graphs of this course count. */
const graphStories = [
  {
    en: "Four classes voted for a favorite game. Each dot is one vote.",
    zh: "四个班投票选最喜欢的游戏。每个点代表一票。",
    thing: "votes",
    zhThing: "票",
  },
  {
    en: "Four friends collected shells. Each dot is one shell.",
    zh: "四个朋友捡贝壳。每个点代表一个贝壳。",
    thing: "shells",
    zhThing: "个贝壳",
  },
  { en: "Four teams scored goals. Each dot is one goal.", zh: "四个队进球。每个点代表一个球。", thing: "goals", zhThing: "个球" },
  { en: "Four children read books. Each dot is one book.", zh: "四个孩子读书。每个点代表一本书。", thing: "books", zhThing: "本书" },
];

const pictureGraphs = earlyTopic(
  "picture-graphs-of-single-units",
  ["Picture Graphs With Single Units", "每个图案代表一个的象形统计图"],
  [
    "Read a picture graph in which each picture stands for one thing, and compare its rows.",
    "读每个图案代表一个物品的象形统计图，并比较各行。",
  ],
  ["first-picture-graphs"],
  ["2.MD.D.10"],
  [
    earlyPoint(
      "how-many-more-in-a-row",
      ["How many more in a row", "一行多多少"],
      [
        "In a picture graph each row shows one group, and each picture stands for one thing in the group. To see how many more one group has than another, compare the two rows. The pictures that line up cancel out, and the extra ones at the end of the longer row are the answer to your question.",
        "象形统计图中，每一行表示一组，每个图案代表组里的一个东西。要知道一组比另一组多多少，就比较这两行。对齐的图案可以不管，较长的那一行末尾多出来的，就是答案。",
      ],
      (rng) => {
        const story = rng.pick(graphStories);
        const labels = ["A", "B", "C", "D"];
        const values = labels.map(() => rng.int(2, 11));
        const [i, j] = rng.sample([0, 1, 2, 3], 2) as [number, number];
        const big = Math.max(values[i] as number, values[j] as number);
        const small = Math.min(values[i] as number, values[j] as number);
        if (big === small) values[i] = big + 1 > 11 ? big - 1 : big + 1;
        const vi = values[i] as number;
        const vj = values[j] as number;
        const [hi, lo] = vi > vj ? [i, j] : [j, i];
        const answer = Math.abs(vi - vj);
        return whole(
          [
            `${story.en} How many more ${story.thing} does row ${labels[hi]} have than row ${labels[lo]}?`,
            `${story.zh}${labels[hi]} 行比 ${labels[lo]} 行多多少${story.zhThing}？`,
          ],
          answer,
          [vi + vj, Math.max(vi, vj)],
          [
            `Row ${labels[hi]} has ${Math.max(vi, vj)} dots and row ${labels[lo]} has ${Math.min(vi, vj)}, and $${Math.max(vi, vj)} - ${Math.min(vi, vj)} = ${answer}$.`,
            `${labels[hi]} 行有 ${Math.max(vi, vj)} 个点，${labels[lo]} 行有 ${Math.min(vi, vj)} 个点，$${Math.max(vi, vj)} - ${Math.min(vi, vj)} = ${answer}$。`,
          ],
          pictureGraphFigure(labels, values, 1),
        );
      },
    ),
    earlyPoint(
      "adding-rows-of-a-picture-graph",
      ["Adding rows of a picture graph", "把象形统计图的行加起来"],
      [
        "A picture graph can also tell how many there are in several rows together. Count the pictures in each row and write the number down. Then add the numbers. If you are asked for all the rows, leave none out, and if you are asked for just two of them, take care to use the ones that were named.",
        "象形统计图也能说明几行一共有多少。数出每一行的图案，把数写下来，再相加。如果问的是所有的行，一行也不能漏；如果只问其中两行，就要用题目说的那两行。",
      ],
      (rng) => {
        const story = rng.pick(graphStories);
        const labels = ["A", "B", "C", "D"];
        const values = labels.map(() => rng.int(2, 10));
        const all = rng.bool();
        const [i, j] = rng.sample([0, 1, 2, 3], 2) as [number, number];
        const shown = all ? values : [values[i] as number, values[j] as number];
        const answer = shown.reduce((s, v) => s + v, 0);
        return whole(
          all
            ? [`${story.en} How many ${story.thing} are there in all?`, `${story.zh}一共有多少${story.zhThing}？`]
            : [
                `${story.en} How many ${story.thing} do rows ${labels[i]} and ${labels[j]} have together?`,
                `${story.zh}${labels[i]} 行和 ${labels[j]} 行一共有多少${story.zhThing}？`,
              ],
          answer,
          all
            ? [answer - (values[3] as number), 4]
            : [Math.abs((values[i] as number) - (values[j] as number)), values.reduce((s, v) => s + v, 0)],
          [
            `The rows have ${all ? shown.join(", ") : shown.join(" and ")} dots, and $${shown.join(" + ")} = ${answer}$.`,
            `这几行分别有 ${shown.join("、")} 个点，$${shown.join(" + ")} = ${answer}$。`,
          ],
          pictureGraphFigure(labels, values, 1),
        );
      },
    ),
  ],
);

const readingBarGraphs = earlyTopic(
  "reading-bar-graphs",
  ["Bar Graphs With Single Units", "读条形图"],
  ["Read a bar graph whose scale counts by ones, and use it to add and compare.", "读刻度按 1 增加的条形图，并用它来相加和比较。"],
  ["first-bar-graphs"],
  ["2.MD.D.10"],
  [
    earlyPoint(
      "the-value-of-a-bar-by-ones",
      ["The value of a bar", "一个条的值"],
      [
        "A bar graph shows each amount as a bar. To read a bar, look at its top and follow the line straight across to the numbers at the side. The number there is the amount. The bar's width means nothing, and the letter under the bar only tells you which one it is, so your eyes need only check the height.",
        "条形图用条来表示数量。读一个条时，看它的顶端，顺着线横着看到旁边的数。那个数就是数量。条的宽度没有意义，条下面的字母只说明它是哪一条，所以只要看高度就行。",
      ],
      (rng) => {
        const labels = ["A", "B", "C", "D"];
        const values = labels.map(() => rng.int(1, 10));
        const i = rng.int(0, 3);
        const answer = values[i] as number;
        return whole(
          [`What is the value of bar ${labels[i]} in this graph?`, `这个图中条 ${labels[i]} 的值是多少？`],
          answer,
          [Math.max(...values)],
          [`The top of bar ${labels[i]} lines up with ${answer} on the scale.`, `条 ${labels[i]} 的顶端对着刻度 ${answer}。`],
          barGraphFigure(labels, values, 1),
        );
      },
    ),
    earlyPoint(
      "adding-and-comparing-bars",
      ["Adding and comparing bars", "把条相加和比较"],
      [
        "After you can read one bar, you can answer questions about several. Read each bar you need and write its value down. To ask how many altogether, add the values, and to ask how many more, subtract the smaller from the larger. You can check a difference by counting the squares between the tops of the two bars.",
        "会读一个条之后，就能回答关于几个条的问题。读出需要的每个条，把值写下来。问一共多少，就把这些值相加；问多多少，就用较大的减较小的。还可以数两个条顶端之间的格子，来检验差。",
      ],
      (rng) => {
        const labels = ["A", "B", "C", "D"];
        const values = labels.map(() => rng.int(1, 10));
        const [i, j] = rng.sample([0, 1, 2, 3], 2) as [number, number];
        if (values[i] === values[j]) values[i] = (values[j] as number) === 10 ? 9 : (values[j] as number) + 1;
        const vi = values[i] as number;
        const vj = values[j] as number;
        const adds = rng.bool();
        const answer = adds ? vi + vj : Math.abs(vi - vj);
        const [hi, lo] = vi > vj ? [i, j] : [j, i];
        return whole(
          adds
            ? [`What is the total of bars ${labels[i]} and ${labels[j]}?`, `条 ${labels[i]} 和条 ${labels[j]} 的总和是多少？`]
            : [`How much greater is bar ${labels[hi]} than bar ${labels[lo]}?`, `条 ${labels[hi]} 比条 ${labels[lo]} 大多少？`],
          answer,
          adds ? [Math.abs(vi - vj), vi] : [vi + vj, Math.max(vi, vj)],
          adds
            ? [
                `The bars show ${vi} and ${vj}, and $${vi} + ${vj} = ${answer}$.`,
                `这两个条分别是 ${vi} 和 ${vj}，$${vi} + ${vj} = ${answer}$。`,
              ]
            : [
                `The bars show ${Math.max(vi, vj)} and ${Math.min(vi, vj)}, and $${Math.max(vi, vj)} - ${Math.min(vi, vj)} = ${answer}$.`,
                `这两个条分别是 ${Math.max(vi, vj)} 和 ${Math.min(vi, vj)}，$${Math.max(vi, vj)} - ${Math.min(vi, vj)} = ${answer}$。`,
              ],
          barGraphFigure(labels, values, 1),
        );
      },
    ),
  ],
);

/** PolygonKind is a polygon's name with its number of sides and some outlines to draw it with. */
interface PolygonKind {
  readonly sides: number;
  readonly en: string;
  readonly zh: string;
  readonly outlines: readonly (readonly (readonly [number, number])[])[];
}

/** polygonKinds are the shapes of 2nd grade, each drawn from several outlines, not all of them regular. */
const polygonKinds: readonly PolygonKind[] = [
  {
    sides: 3,
    en: "triangle",
    zh: "三角形",
    outlines: [
      [
        [1, 1],
        [9, 1],
        [5, 9],
      ],
      [
        [1, 1],
        [8, 1],
        [1, 8],
      ],
      [
        [0, 2],
        [10, 1],
        [7, 7],
      ],
      [
        [2, 1],
        [9, 4],
        [1, 9],
      ],
    ],
  },
  {
    sides: 4,
    en: "quadrilateral",
    zh: "四边形",
    outlines: [
      [
        [1, 1],
        [9, 1],
        [9, 8],
        [1, 8],
      ],
      [
        [2, 1],
        [10, 1],
        [8, 7],
        [0, 7],
      ],
      [
        [0, 1],
        [10, 1],
        [7, 7],
        [3, 7],
      ],
      [
        [1, 2],
        [9, 1],
        [7, 9],
        [3, 7],
      ],
      [
        [5, 0],
        [9, 5],
        [5, 10],
        [1, 5],
      ],
    ],
  },
  {
    sides: 5,
    en: "pentagon",
    zh: "五边形",
    outlines: [
      [
        [5, 9],
        [9, 6],
        [7, 1],
        [3, 1],
        [1, 6],
      ],
      [
        [1, 1],
        [9, 1],
        [9, 6],
        [5, 9],
        [1, 6],
      ],
      [
        [0, 3],
        [5, 0],
        [10, 3],
        [8, 9],
        [2, 7],
      ],
    ],
  },
  {
    sides: 6,
    en: "hexagon",
    zh: "六边形",
    outlines: [
      [
        [3, 1],
        [7, 1],
        [9, 5],
        [7, 9],
        [3, 9],
        [1, 5],
      ],
      [
        [1, 1],
        [9, 1],
        [9, 5],
        [5, 5],
        [5, 9],
        [1, 9],
      ],
      [
        [2, 0],
        [8, 1],
        [10, 5],
        [7, 9],
        [2, 8],
        [0, 4],
      ],
    ],
  },
];

/** polygonIn draws one outline of a kind of polygon, nudged a little so that its drawing varies. */
function polygonIn(rng: Rng, kind: PolygonKind): Figure {
  const outline = rng.pick(kind.outlines);
  const nudge = rng.int(0, 1) * 0.5;
  const points = outline.map(([x, y]) => [Math.min(10, x + (rng.bool() ? nudge : 0)), Math.min(10, y + (rng.bool() ? nudge : 0))] as const);
  return polygonFigure(points, t("A closed shape with straight sides.", "一个由直边围成的封闭图形。"));
}

const namingPolygons = earlyTopic(
  "naming-polygons-by-their-sides",
  ["Naming Shapes by Their Sides", "按边数给图形命名"],
  [
    "Tell triangles, quadrilaterals, pentagons and hexagons apart by counting their sides.",
    "数一数边的条数，分辨三角形、四边形、五边形和六边形。",
  ],
  ["defining-attributes-of-shapes"],
  ["2.G.A.1"],
  [
    earlyPoint(
      "the-name-of-a-drawn-shape",
      ["The name of a drawn shape", "说出图形的名称"],
      [
        "A shape's name depends on how many straight sides it has, and not on how it looks or which way it faces. Three sides make a triangle, four make a quadrilateral, five make a pentagon and six make a hexagon. A stretched or lopsided shape keeps its name, so count the sides each time and do not trust the first look.",
        "图形的名称取决于它有几条直边，而不是它看起来怎样，或朝哪个方向。三条边是三角形，四条边是四边形，五条边是五边形，六条边是六边形。被拉长或歪斜的图形名称不变，所以每次都要数边，不要只凭第一眼。",
      ],
      (rng) => {
        const kind = rng.pick(polygonKinds);
        const name = (k: PolygonKind) => t(`A ${k.en}`, k.zh);
        return pickChoice(
          rng,
          t("What is this shape called?", "这个图形叫什么？"),
          name(kind),
          polygonKinds.filter((k) => k !== kind).map(name),
          t(`It has ${kind.sides} straight sides, so it is a ${kind.en}.`, `它有 ${kind.sides} 条直边，所以它是${kind.zh}。`),
          polygonIn(rng, kind),
        );
      },
    ),
    earlyPoint(
      "the-name-from-the-number-of-sides",
      ["The name from the number of sides", "由边数说出名称"],
      [
        "You can name a shape without seeing it, if you are told how many sides or angles it has. A closed shape with straight sides has the same number of angles as it has sides, since each corner joins two sides. So a shape with five angles has five sides as well, and it is a pentagon however it is drawn.",
        "知道一个图形有几条边或几个角，不用看图也能说出它的名称。由直边围成的封闭图形，角的个数和边的条数相同，因为每个角连着两条边。所以有五个角的图形也有五条边，不管怎么画，它都是五边形。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const kind = rng.pick(polygonKinds);
        const byAngles = rng.bool();
        const name = (k: PolygonKind) => t(`A ${k.en}`, k.zh);
        return pickChoice(
          rng,
          byAngles
            ? t(
                `${who} draws a closed shape with straight sides and exactly ${kind.sides} angles. What is it?`,
                `${who} 画了一个由直边围成的封闭图形，它正好有 ${kind.sides} 个角。它是什么图形？`,
              )
            : t(
                `${who} draws a closed shape with exactly ${kind.sides} straight sides. What is it?`,
                `${who} 画了一个正好有 ${kind.sides} 条直边的封闭图形。它是什么图形？`,
              ),
          name(kind),
          polygonKinds.filter((k) => k !== kind).map(name),
          t(
            `A shape with ${kind.sides} sides and ${kind.sides} angles is a ${kind.en}.`,
            `有 ${kind.sides} 条边和 ${kind.sides} 个角的图形是${kind.zh}。`,
          ),
        );
      },
    ),
  ],
);

const countingSidesAndAngles = earlyTopic(
  "counting-sides-and-angles",
  ["Counting Sides and Angles", "数边和角"],
  ["Count the sides and angles of a shape, and add them across several shapes.", "数出图形的边和角，并把几个图形的边或角加起来。"],
  ["naming-polygons-by-their-sides"],
  ["2.G.A.1"],
  [
    earlyPoint(
      "angles-of-a-drawn-shape",
      ["Angles of a drawn shape", "图形的角"],
      [
        "An angle is the corner made where two sides of a shape meet. To count angles, pick a corner to begin with, go around the shape in one direction, and stop when you get back. Marking your starting corner helps you to avoid counting it twice. You should find as many angles as there are sides, and that gives you a check.",
        "角是图形两条边相交形成的尖角。数角时，选一个角作为开始，沿着一个方向绕图形一周，回到开始的地方就停下。在开始的角上做个记号，就不会数两次。角的个数应该和边的条数一样多，这也是一种检查。",
      ],
      (rng) => {
        const kind = rng.pick(polygonKinds);
        const asksAngles = rng.bool();
        return whole(
          asksAngles
            ? ["How many angles does this shape have?", "这个图形有几个角？"]
            : ["How many sides does this shape have?", "这个图形有几条边？"],
          kind.sides,
          [kind.sides * 2, kind.sides === 3 ? 6 : kind.sides - 3],
          [
            `Going around the shape once, you pass ${kind.sides} sides and ${kind.sides} corners, so it is a ${kind.en}.`,
            `绕图形一周，经过 ${kind.sides} 条边和 ${kind.sides} 个角，所以它是${kind.zh}。`,
          ],
          polygonIn(rng, kind),
        );
      },
    ),
    earlyPoint(
      "sides-of-several-shapes",
      ["Sides of several shapes", "几个图形的边数"],
      [
        "If you know a shape's name, you know how many sides it has without looking. So you can find the total for several shapes by adding the sides of each. Say the number for each name to yourself and then add. Remember that a triangle has three, a quadrilateral four, a pentagon five and a hexagon six.",
        "知道图形的名称，不用看就知道它有几条边。所以可以把每个图形的边数相加，求出几个图形一共有几条边。先在心里说出每个名称对应的数，再相加。记住三角形有三条，四边形有四条，五边形有五条，六边形有六条。",
      ],
      (rng) => {
        const [a, b] = rng.sample(polygonKinds, 2) as [PolygonKind, PolygonKind];
        const na = rng.int(1, 3);
        const nb = rng.int(1, 3);
        const answer = na * a.sides + nb * b.sides;
        const who = rng.pick(earlyNames);
        const many = (n: number, k: PolygonKind) => `${n} ${k.en}${n === 1 ? "" : "s"}`;
        return whole(
          [
            `${who} draws ${many(na, a)} and ${many(nb, b)}. How many sides are there in all?`,
            `${who} 画了 ${na} 个${a.zh}和 ${nb} 个${b.zh}。一共有多少条边？`,
          ],
          answer,
          [na + nb, a.sides + b.sides],
          [
            `The ${a.en}${na === 1 ? " has" : "s have"} ${na * a.sides} sides and the ${b.en}${nb === 1 ? " has" : "s have"} ${nb * b.sides} sides, and $${na * a.sides} + ${nb * b.sides} = ${answer}$.`,
            `${a.zh}一共有 ${na * a.sides} 条边，${b.zh}一共有 ${nb * b.sides} 条边，$${na * a.sides} + ${nb * b.sides} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

/** cubeFigure draws a cube with its hidden edges dashed. */
function cubeFigure(): Figure {
  const front = `<rect x="110" y="40" width="80" height="80" class="accent" fill="currentColor" fill-opacity="0.2"/><rect x="110" y="40" width="80" height="80"/>`;
  const top = `<polygon points="110,40 145,12 225,12 190,40"/>`;
  const side = `<polygon points="190,40 225,12 225,92 190,120"/>`;
  const hidden = `<line x1="145" y1="12" x2="145" y2="92" stroke-dasharray="4 3"/><line x1="145" y1="92" x2="225" y2="92" stroke-dasharray="4 3"/><line x1="145" y1="92" x2="110" y2="120" stroke-dasharray="4 3"/>`;
  return {
    svg: svgDocument(130, front + top + side + hidden),
    alt: t("A cube, with its hidden edges drawn as dashed lines.", "一个正方体，看不见的棱用虚线表示。"),
  };
}

const facesOfACube = earlyTopic(
  "faces-of-a-cube",
  ["Faces, Edges and Corners of a Cube", "正方体的面、棱和顶点"],
  [
    "Know that a cube has 6 square faces, 12 edges and 8 corners, and use these numbers.",
    "知道正方体有 6 个正方形的面、12 条棱和 8 个顶点，并运用这些数。",
  ],
  ["naming-polygons-by-their-sides"],
  ["2.G.A.1"],
  [
    earlyPoint(
      "the-faces-that-are-left",
      ["The faces that are left", "剩下的面"],
      [
        "A cube is a solid shape with six flat faces, all of them squares of the same size. Think of a die or a box for a toy. You can never see all of the faces at once, as some are hidden at the back. So when you count faces, remember those that are out of sight: there are always six.",
        "正方体是有 6 个平平的面的立体图形，每个面都是同样大小的正方形。想一想骰子或玩具盒。不可能同时看到所有的面，有些面藏在背后。所以数面的时候，要记得那些看不见的面：一共总是 6 个。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const painted = rng.int(1, 5);
        const answer = 6 - painted;
        const box = rng.pick([
          { en: "toy box", zh: "玩具盒" },
          { en: "wooden block", zh: "木块" },
          { en: "gift box", zh: "礼品盒" },
        ]);
        return whole(
          [
            `${who} has a ${box.en} shaped like this cube and paints ${painted} of its faces. How many faces are not painted?`,
            `${who} 有一个形状像这个正方体的${box.zh}，给它的 ${painted} 个面涂了颜色。有多少个面没有涂？`,
          ],
          answer,
          [8 - painted, 12 - painted, painted],
          [`A cube has 6 faces, and $6 - ${painted} = ${answer}$.`, `正方体有 6 个面，$6 - ${painted} = ${answer}$。`],
          cubeFigure(),
        );
      },
    ),
    earlyPoint(
      "edges-and-corners-of-cubes",
      ["Edges and corners of cubes", "正方体的棱和顶点"],
      [
        "An edge is a line where two faces of a cube meet, and a corner is a point where three edges meet. A cube has 12 edges and 8 corners. Four edges go around the top, four go around the bottom and four go up the sides. That is an easy way to remember how many there are, if you forget.",
        "棱是正方体两个面相交的线，顶点是三条棱相交的点。正方体有 12 条棱和 8 个顶点。上面一圈有 4 条棱，下面一圈有 4 条，竖着的还有 4 条。如果忘了，这是一个容易记住的办法。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const parts = rng.pick([
          { en: "faces", zh: "个面", each: 6 },
          { en: "edges", zh: "条棱", each: 12 },
          { en: "corners", zh: "个顶点", each: 8 },
        ]);
        const cubes = rng.int(2, 4);
        const answer = cubes * parts.each;
        const sum = Array(cubes).fill(`${parts.each}`).join(" + ");
        return whole(
          [
            `${who} has ${cubes} cubes that are not touching. How many ${parts.en} do they have in all?`,
            `${who} 有 ${cubes} 个没有挨在一起的正方体。它们一共有多少${parts.zh}？`,
          ],
          answer,
          [cubes + parts.each, parts.each, answer + parts.each],
          [
            `Each cube has ${parts.each} ${parts.en}, so add: $${sum} = ${answer}$.`,
            `每个正方体有 ${parts.each} ${parts.zh}，所以相加：$${sum} = ${answer}$。`,
          ],
          cubeFigure(),
        );
      },
    ),
  ],
);

const rowsAndColumnsOfSquares = earlyTopic(
  "rows-and-columns-of-squares",
  ["Rows and Columns of Squares", "方格的行和列"],
  ["Cut a rectangle into rows and columns of equal squares, and count them.", "把长方形分成若干行和列的相同方格，并数出个数。"],
  ["arrays-and-repeated-addition"],
  ["2.G.A.2"],
  [
    earlyPoint(
      "counting-squares-in-a-rectangle",
      ["Counting squares in a rectangle", "数长方形里的方格"],
      [
        "A rectangle can be cut into equal squares set out in straight rows and columns. Rows go across, and columns go up and down. As with an array, you do not need to count one by one. Count the squares in one row, and then add this number once for each row. Your eyes can check the columns too.",
        "长方形可以分成相同的方格，排成整齐的行和列。行是横着的，列是竖着的。和点阵一样，不用一个一个地数。数出一行有几个方格，有几行就把这个数加几次。还可以用眼睛再查查每一列。",
      ],
      (rng) => {
        const rows = rng.int(2, 5);
        const columns = rng.int(2, 6);
        const total = rows * columns;
        const shaded = rng.bool() ? total : rng.int(1, total - 1);
        const sum = Array(rows).fill(`${columns}`).join(" + ");
        return shaded === total
          ? whole(
              ["How many squares is this rectangle cut into?", "这个长方形被分成了多少个方格？"],
              total,
              [rows + columns, 2 * (rows + columns)],
              [
                `There are ${rows} rows of ${columns} squares, so $${sum} = ${total}$.`,
                `有 ${rows} 行，每行 ${columns} 个方格，所以 $${sum} = ${total}$。`,
              ],
              gridFigure(rows, columns),
            )
          : whole(
              ["How many squares of this rectangle are not shaded?", "这个长方形有多少个方格没有涂色？"],
              total - shaded,
              [shaded, total],
              [
                `There are $${sum} = ${total}$ squares, and ${shaded} of them are shaded, so $${total} - ${shaded} = ${total - shaded}$ are not.`,
                `一共有 $${sum} = ${total}$ 个方格，其中 ${shaded} 个涂了颜色，所以 $${total} - ${shaded} = ${total - shaded}$ 个没有涂。`,
              ],
              gridFigure(rows, columns, shaded),
            );
      },
    ),
    earlyPoint(
      "cutting-a-tray-into-pieces",
      ["Cutting a tray into pieces", "把一盘切成小块"],
      [
        "When you cut a tray of food into rows and columns, each row has the same number of pieces. So you can picture the rows without drawing every piece. Each row adds the same amount, and the number of rows tells how many times to add it. A quick drawing with just a few lines will show you the cuts.",
        "把一盘食物切成行和列时，每行的块数都一样。所以不用把每一块都画出来，也能想象出这些行。每一行加同样多，有几行就加几次。只用几条线画个草图，就能看出是怎么切的。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const food = rng.pick([
          { en: "tray of cornbread", zh: "玉米面包", many: "盘" },
          { en: "pan of brownies", zh: "巧克力蛋糕", many: "盘" },
          { en: "sheet of crackers", zh: "饼干", many: "张" },
        ]);
        const rows = rng.int(2, 5);
        const columns = rng.int(2, 5);
        const answer = rows * columns;
        const sum = Array(rows).fill(`${columns}`).join(" + ");
        return whole(
          [
            `${who} cuts a ${food.en} into ${rows} rows with ${columns} pieces in each row. How many pieces are there?`,
            `${who} 把一${food.many}${food.zh}切成 ${rows} 行，每行 ${columns} 块。一共有多少块？`,
          ],
          answer,
          [rows + columns, answer + columns],
          [
            `There are ${rows} rows of ${columns}, so $${sum} = ${answer}$.`,
            `有 ${rows} 行，每行 ${columns} 块，所以 $${sum} = ${answer}$。`,
          ],
        );
      },
    ),
  ],
);

/** sharedRectangle draws a rectangle cut into equal shares, the first `shaded` of them shaded. */
function sharedRectangle(parts: number, shaded: number): Figure {
  return {
    svg: gridFigure(parts === 4 ? 2 : 1, parts === 4 ? 2 : parts, shaded).svg,
    alt: t("A rectangle cut into equal shares, some of them shaded.", "一个长方形被平均分成几份，其中一些涂了颜色。"),
  };
}

/** partsName gives the words for a count of equal parts of a whole, such as two thirds. */
function partsName(shaded: number, parts: number): Text {
  const en: Record<number, readonly [string, string]> = { 2: ["half", "halves"], 3: ["third", "thirds"], 4: ["fourth", "fourths"] };
  const zh: Record<number, string> = { 2: "二分之", 3: "三分之", 4: "四分之" };
  const words = ["", "one", "two", "three"];
  const zhDigits = ["", "一", "二", "三"];
  const [one, many] = en[parts] as readonly [string, string];
  return t(`${words[shaded]} ${shaded === 1 ? one : many}`, `${zh[parts]}${zhDigits[shaded]}`);
}

const halvesThirdsFourths = earlyTopic(
  "halves-thirds-and-fourths-of-shapes",
  ["Halves, Thirds and Fourths of Shapes", "图形的二分之一、三分之一和四分之一"],
  [
    "Name equal shares of a shape as halves, thirds or fourths, and see that the parts must be equal.",
    "把图形的相等部分说成二分之几、三分之几或四分之几，并明白每份必须相等。",
  ],
  ["halves-and-fourths-of-shapes", "rows-and-columns-of-squares"],
  ["2.G.A.3"],
  [
    earlyPoint(
      "naming-the-shaded-share",
      ["Naming the shaded share", "说出涂色的部分"],
      [
        "When a whole is cut into equal shares, the number of shares gives their name. Two equal shares are halves, three are thirds and four are fourths. Count the shares that are shaded to know how many you are talking about, so two of three equal shares is two thirds. More shares means that each one is smaller.",
        "把一个整体分成相等的几份时，份数决定了名称。平均分成 2 份是二分之几，3 份是三分之几，4 份是四分之几。数一数涂了几份，就知道说的是几份，所以 3 份中的 2 份是三分之二。份数越多，每份就越小。",
      ],
      (rng) => {
        const parts = rng.int(2, 4);
        const shaded = rng.int(1, parts - 1);
        const object = rng.pick([
          { en: "pizza", zh: "披萨", round: true },
          { en: "pie", zh: "馅饼", round: true },
          { en: "cake", zh: "蛋糕", round: true },
          { en: "flag", zh: "旗子", round: false },
          { en: "garden", zh: "花园", round: false },
          { en: "sandwich", zh: "三明治", round: false },
        ]);
        const options = [partsName(shaded, parts)];
        const pool: readonly (readonly [number, number])[] = [
          [1, 2],
          [1, 3],
          [2, 3],
          [1, 4],
          [2, 4],
          [3, 4],
        ];
        for (const [s, p] of rng.shuffle(pool)) if (s !== shaded || p !== parts) options.push(partsName(s, p));
        const figure = object.round ? slicedCircleFigure(parts, shaded) : sharedRectangle(parts, shaded);
        return pickChoice(
          rng,
          t(`This ${object.en} is cut into equal shares. How much of it is shaded?`, `${object.zh}被平均分了。涂色的部分占多少？`),
          options[0] as Text,
          options.slice(1, 4),
          t(
            `There are ${parts} equal shares and ${shaded} ${shaded === 1 ? "is" : "are"} shaded, which is ${partsName(shaded, parts).en}.`,
            `一共平均分成 ${parts} 份，涂了 ${shaded} 份，也就是${partsName(shaded, parts)["zh-CN"]}。`,
          ),
          figure,
        );
      },
    ),
    earlyPoint(
      "shares-in-a-whole",
      ["Shares in a whole", "整体里的份数"],
      [
        "A whole shape is made of all its equal shares. Two halves make a whole, three thirds make a whole and four fourths make a whole. If some of the shares have gone, the ones still there are the difference. Equal shares of the same whole are the same size, even when they are cut in different ways.",
        "一个整体由所有相等的部分组成。两个二分之一是一个整体，三个三分之一是一个整体，四个四分之一是一个整体。如果拿走了几份，剩下的就是它们的差。同一个整体的相等部分大小相同，即使切法不一样。",
      ],
      (rng) => {
        const who = rng.pick(earlyNames);
        const parts = rng.int(2, 4);
        const eaten = rng.int(1, parts - 1);
        const answer = parts - eaten;
        const food = rng.pick([
          { en: "sandwich", zh: "三明治" },
          { en: "pizza", zh: "披萨" },
          { en: "pie", zh: "馅饼" },
          { en: "brownie", zh: "巧克力蛋糕" },
          { en: "pancake", zh: "煎饼" },
        ]);
        const word = partsName(1, parts).en.split(" ")[1] as string;
        const many = partsName(2, parts).en.split(" ")[1] as string;
        const zhShare = partsName(1, parts)["zh-CN"];
        return whole(
          [
            `${who} cuts a ${food.en} into ${many} and eats ${eaten} of the ${many}. How many of the ${many} are left?`,
            `${who} 把一个${food.zh}平均分成 ${parts} 份，每份是${zhShare}，吃掉了 ${eaten} 份。还剩多少份？`,
          ],
          answer,
          [parts, eaten === answer ? parts + 1 : eaten, 2 * parts],
          [
            `A whole is ${parts} ${many}, and $${parts} - ${eaten} = ${answer}$, so ${answer === 1 ? `1 ${word} is` : `${answer} ${many} are`} left.`,
            `一个整体是 ${parts} 份，$${parts} - ${eaten} = ${answer}$，所以还剩 ${answer} 份。`,
          ],
        );
      },
    ),
    earlyPoint(
      "are-the-shares-equal",
      ["Are the shares equal", "每份相等吗"],
      [
        "Cutting a shape into three pieces does not always make thirds. The pieces have to be the same size, or else they are just three pieces. Before you use a name such as thirds or fourths, look to see that every piece matches. If one piece is clearly bigger than another, the shares are not equal, and that name does not fit.",
        "把图形切成三块，不一定就是三分之一。每块必须一样大，不然就只是三块而已。用三分之一、四分之一这样的说法之前，先看看每块是不是相同。如果有一块明显比另一块大，每份就不相等，这种说法就不合适。",
      ],
      (rng) => {
        const parts = rng.int(2, 4);
        const equal = rng.bool();
        const widths = equal
          ? Array<number>(parts).fill(1)
          : rng.shuffle(parts === 2 ? [1, rng.int(2, 3)] : parts === 3 ? [1, 2, rng.int(3, 4)] : [1, 1, 2, rng.int(3, 4)]);
        const name = {
          2: t("Equal shares: halves", "相等的份：二分之一"),
          3: t("Equal shares: thirds", "相等的份：三分之一"),
          4: t("Equal shares: fourths", "相等的份：四分之一"),
        } as Record<number, Text>;
        const unequal = t(`${parts} parts that are not equal`, `${parts} 份，但并不相等`);
        const correct = equal ? (name[parts] as Text) : unequal;
        const others = [name[2], name[3], name[4], unequal].filter((o) => o !== correct) as Text[];
        return pickChoice(
          rng,
          t("Look at how this bar is cut. Which of these describes it?", "看看这个长条是怎么切的。下面哪一句符合它？"),
          correct,
          others,
          equal
            ? t(
                `${parts === 2 ? "Both" : `All ${parts}`} parts are the same size, so they are ${partsName(2, parts).en.split(" ")[1]}.`,
                `这 ${parts} 份大小相同，所以每份是${partsName(1, parts)["zh-CN"]}。`,
              )
            : t(
                `Some of the ${parts} parts are bigger than others, so they are not equal shares.`,
                `这 ${parts} 份有大有小，所以不是相等的份。`,
              ),
          cutBarFigure(widths),
        );
      },
    ),
  ],
);

/** gradeTwoMeasureTopics are the measurement, data and geometry topics of 2nd Grade Math, in teaching order. */
export const gradeTwoMeasureTopics: readonly TopicDef[] = [
  measuringInchesCentimeters,
  feetAndMeters,
  sameLengthDifferentUnits,
  estimatingLengths,
  comparingLengths,
  lengthWordProblems,
  sumsOnANumberLine,
  tellingTimeFiveMinutes,
  amAndPm,
  countingCoins,
  dollarsAndCents,
  linePlotsOfLengths,
  pictureGraphs,
  readingBarGraphs,
  namingPolygons,
  countingSidesAndAngles,
  facesOfACube,
  rowsAndColumnsOfSquares,
  halvesThirdsFourths,
];
