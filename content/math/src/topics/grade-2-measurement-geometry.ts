// 2nd Grade Math: length in inches, feet, centimeters and meters, time to five
// minutes, money, line plots, picture graphs and bar graphs, and shapes.

import type { Figure, Rng, Text, TopicDef } from "@ga/content";
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
  jumpsFigure,
  lengthBarsFigure,
  numberLineFigure,
  pictureGraphFigure,
  polygonFigure,
  rulerFigure,
  slicedCircleFigure,
} from "../early-grades-kit.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import { captioned, type Pair, partWholeBarFigure, picked, solved, type Wrong } from "./early-grades-more-kit.ts";
import { plural } from "./grade-2-numbers-operations.ts";

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
        "This crayon starts at 0 and ends at 6. So it is 6 centimeters long.\n\nCheck: count the spaces under the crayon: 1, 2, 3, 4, 5, 6.\n\n> **Watch out.** Read the number at the crayon's end, not the last number on the ruler.",
        "这支蜡笔从 0 开始，到 6 结束，所以长 6 厘米。\n\n检验：数一数蜡笔下面的格子：1、2、3、4、5、6。\n\n> **注意。** 读蜡笔末端对着的数，不是尺子上最后一个数。",
      ],
      (rng) => {
        const unit = rng.pick([inch, centimeter]);
        const max = rng.int(8, 12);
        const length = rng.int(2, max - 1);
        const object = rng.pick(smallObjects);
        return solved(
          [`How long is this ${object.en}, in ${unit.many}?`, `这${object.measure}${object.zh}有多长？（单位：${unit.zh}）`],
          length,
          [
            [
              ["Check the start", "看起点"],
              ["The left end is at 0.", "左端对着 0。"],
            ],
            [
              ["Read the end", "读终点"],
              [
                `The right end is at ${length}, so it is ${unitCount(length, unit)} long.`,
                `右端对着 ${length}，所以长 ${length} ${unit.zh}。`,
              ],
            ],
          ],
          [`Count the spaces under it: there are ${length}.`, `数一数它下面的格子：有 ${length} 格。`],
          [
            [max, "That is the end of the ruler, not the end of the object.", "这是尺子的末端，不是物体的末端。"],
            [length + 1, "That counts the tick marks, not the spaces.", "这数的是刻度线，不是格子。"],
            [length - 1, "That is one short. Read where the end stops.", "少了 1。看清末端停在哪里。"],
          ],
          rulerFigure(length, unit.symbol, max),
        );
      },
      captioned(rulerFigure(6, "cm", 10), "A crayon from 0 to 6 on a centimeter ruler.", "厘米尺上从 0 到 6 的一支蜡笔。"),
    ),
    earlyPoint(
      "reading-a-ruler-not-from-zero",
      ["Reading a ruler when the start is not zero", "不从 0 开始读尺子"],
      [
        "This straw runs from 3 to 8. Its length is $8 - 3 = 5$ centimeters.\n\nCheck: count the spaces from 3 to 8: 4, 5, 6, 7, 8. That is 5.\n\n> **Watch out.** The straw is not 8 long. The 3 units before it do not count.",
        "这根吸管从 3 到 8。它长 $8 - 3 = 5$ 厘米。\n\n检验：数从 3 到 8 的格子：4、5、6、7、8，一共 5 格。\n\n> **注意。** 吸管不是 8 厘米长。它前面的 3 格不算。",
      ],
      (rng) => {
        const unit = rng.pick([inch, centimeter]);
        const max = 12;
        const start = rng.int(1, 6);
        const length = rng.int(2, max - start);
        const end = start + length;
        const object = rng.pick(smallObjects);
        return solved(
          [`How long is this ${object.en}, in ${unit.many}?`, `这${object.measure}${object.zh}有多长？（单位：${unit.zh}）`],
          length,
          [
            [
              ["Read both ends", "读两端"],
              [`It starts at ${start} and ends at ${end}.`, `它从 ${start} 开始，到 ${end} 结束。`],
            ],
            [["Subtract", "相减"], ["The length is the end minus the start:", "长度是终点减起点："], [`${end} - ${start} = ${length}`]],
          ],
          [`Count the spaces from ${start} to ${end}: there are ${length}.`, `数从 ${start} 到 ${end} 的格子：有 ${length} 格。`],
          [
            [end, "That is where it ends. It does not start at 0.", "这是终点的数。它不是从 0 开始的。"],
            [start, "That is where it starts, not how long it is.", "这是起点的数，不是长度。"],
            [length + 1, "That counts the tick marks, not the spaces.", "这数的是刻度线，不是格子。"],
          ],
          rulerFigure(length, unit.symbol, max, start),
        );
      },
      captioned(rulerFigure(5, "cm", 10, 3), "A straw from 3 to 8 on a centimeter ruler.", "厘米尺上从 3 到 8 的一根吸管。"),
    ),
  ],
  [
    "Lily lays her pencil on a ruler. One end is at 0 and the other at 7, so the pencil is 7 inches long.\n\nCheck: 7 one-inch spaces fit under the pencil.\n\nIn this lesson we read a ruler to measure lengths, even when the object does not start at 0.",
    "莉莉把铅笔放在尺子上。一端对着 0，另一端对着 7，所以铅笔长 7 英寸。\n\n检验：铅笔下面正好有 7 个 1 英寸的格子。\n\n本课我们读尺子量长度，物体不从 0 开始时也能量。",
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
        "1 foot is 12 inches. A board 3 feet long is $12 + 12 + 12 = 36$ inches.\n\nCheck: 3 feet is 1 foot and 2 more; $12 + 24 = 36$.\n\n> **Watch out.** Do not add 3 and 12. Add 12 once for each foot.",
        "1 英尺是 12 英寸。一块 3 英尺长的木板是 $12 + 12 + 12 = 36$ 英寸。\n\n检验：3 英尺是 1 英尺再加 2 英尺；$12 + 24 = 36$。\n\n> **注意。** 不要把 3 和 12 相加。每 1 英尺加一次 12。",
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
        return solved(
          [
            `A ${object.en} is ${unitCount(count, large)} long. How many ${small.many} is that?`,
            `一${object.measure}${object.zh}长 ${count} ${large.zh}。这是多少${small.zh}？`,
          ],
          answer,
          [
            [
              ["Know the unit", "记住换算"],
              [`1 ${large.one} is ${each} ${small.many}.`, `1 ${large.zh}是 ${each} ${small.zh}。`],
            ],
            [
              [`Add ${each} for each ${large.one}`, `每 1 ${large.zh}加一次 ${each}`],
              [`There are ${count} of them:`, `一共 ${count} 个：`],
              [`${sum} = ${answer}`],
            ],
          ],
          [
            `Count by ${each}s: ${Array.from({ length: count }, (_, i) => each * (i + 1)).join(", ")}.`,
            `${each} 个 ${each} 个地数：${Array.from({ length: count }, (_, i) => each * (i + 1)).join("、")}。`,
          ],
          [
            [
              count + each,
              `That adds the ${large.many} to ${each} instead of adding ${each} for each.`,
              `这是把${large.zh}数和 ${each} 相加，没有每个加一次 ${each}。`,
            ],
            [each, `That is just one ${large.one}.`, `这只是 1 ${large.zh}。`],
            [answer + each, `That adds one ${large.one} too many.`, `这多加了 1 ${large.zh}。`],
          ],
          cutBarFigure(Array<number>(count).fill(1)),
        );
      },
      captioned(
        cutBarFigure([1, 1, 1]),
        "A board cut into 3 one-foot pieces; each piece is 12 inches.",
        "木板分成 3 段，每段 1 英尺，也就是 12 英寸。",
      ),
    ),
    earlyPoint(
      "choosing-a-measuring-tool",
      ["Choosing a measuring tool", "选择测量工具"],
      [
        "To measure around a ball, use a measuring tape. It bends to wrap around the ball. A ruler is good for a crayon, and a meter stick for a door.\n\nCheck: a straight ruler cannot curve, so it cannot go around a ball.\n\n> **Watch out.** A clock or a scale does not measure length at all.",
        "要量球一周的长度，用卷尺。卷尺可以弯，能绕着球量。量蜡笔用尺子，量门用米尺。\n\n检验：直尺弯不了，没法绕着球量。\n\n> **注意。** 钟表和秤根本不量长度。",
      ],
      (rng) => {
        const name = rng.pick(earlyNames);
        const tools: Record<string, Pair> = {
          ruler: ["a ruler", "尺子"],
          stick: ["a meter stick", "米尺"],
          tape: ["a measuring tape", "卷尺"],
          clock: ["a clock", "钟表"],
          scale: ["a kitchen scale", "厨房秤"],
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
        const why: Record<string, [string, string]> = {
          ruler: ["A ruler is too short for this.", "尺子太短了。"],
          stick: [
            task.tool === "ruler"
              ? "A meter stick is far too long for something so small."
              : "A meter stick is straight and cannot bend around it.",
            task.tool === "ruler" ? "米尺对这么小的东西来说太长了。" : "米尺是直的，不能绕着它弯。",
          ],
          tape: ["", ""],
          clock: ["A clock measures time, not length.", "钟表量的是时间，不是长度。"],
          scale: ["A scale measures how heavy something is, not how long.", "秤量的是轻重，不是长短。"],
        };
        if (task.tool === "tape") why.ruler = ["A ruler is straight and cannot bend around it.", "尺子是直的，不能绕着它弯。"];
        if (task.tool === "ruler") why.ruler = ["", ""];
        const others =
          task.tool === "tape"
            ? ["ruler", "stick", rng.pick(["clock", "scale"])]
            : [task.tool === "ruler" ? "stick" : "ruler", "clock", "scale"];
        const reason: Pair = {
          ruler: ["It fits on a desk, so a short ruler is easy to use.", "它能放在桌上，用短尺子很方便。"] as Pair,
          stick: [
            "It is too long for a short ruler but straight, so a meter stick suits it.",
            "它太长，短尺子不合适，但它是直的，所以用米尺合适。",
          ] as Pair,
          tape: ["It is curved, and only a tape can bend around it.", "它是弯的，只有卷尺能绕着它弯。"] as Pair,
        }[task.tool];
        const wrong: Wrong[] = others.map((k) => [tools[k] as Pair, (why[k] as [string, string])[0], (why[k] as [string, string])[1]]);
        return picked(
          rng,
          [`${name} wants to measure ${task.en}. Which tool is best?`, `${name} 想量${task.zh}。用哪种工具最好？`],
          tools[task.tool] as Pair,
          wrong,
          [
            [
              ["Is it length?", "量的是长度吗？"],
              ["Yes, so the tool must measure length.", "是长度，所以工具要能量长度。"],
            ],
            [["Size and shape", "看大小和形状"], reason],
          ],
          [
            `Try the others in your head: each one is too short, too long, too stiff, or measures something else.`,
            `在心里试试别的工具：不是太短、太长、太硬，就是量别的东西。`,
          ],
        );
      },
      captioned(rulerFigure(4, "cm", 10), "A short ruler suits small things on a desk.", "短尺子适合量桌上的小东西。"),
    ),
  ],
  [
    "A door is too tall for a short ruler. Mr. Lee uses a meter stick instead: the door is 2 meters, which is 200 centimeters.\n\nCheck: $100 + 100 = 200$.\n\nIn this lesson we learn how long a foot and a meter are, and choose a tool to measure with.",
    "门太高，用短尺子不方便。李老师改用米尺：门高 2 米，也就是 200 厘米。\n\n检验：$100 + 100 = 200$。\n\n本课我们知道 1 英尺和 1 米有多长，并选择合适的测量工具。",
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
        "A rope is 2 feet long. In inches it is $12 + 12 = 24$ inches. The rope did not change; the unit got smaller, so the number got bigger.\n\nCheck: 24 inches make 2 groups of 12, which is 2 feet.\n\n> **Watch out.** Do not answer 2 inches. Inches are small, so you need many of them.",
        "一根绳子长 2 英尺。用英寸量，是 $12 + 12 = 24$ 英寸。绳子没变；单位变小了，所以数变大了。\n\n检验：24 英寸是 2 个 12，也就是 2 英尺。\n\n> **注意。** 不要答 2 英寸。英寸很小，需要很多个。",
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
        const line = (n: number): Pair => [unitCount(n, small), `${n} ${small.zh}`];
        const half = Math.max(1, Math.floor(count / 2));
        return picked(
          rng,
          [
            `A ${object.en} measures ${unitCount(count, large)}. Which of these could be its length in ${small.many}?`,
            `一${object.measure}${object.zh}长 ${count} ${large.zh}。用${small.zh}量，它的长度可能是下面哪一个？`,
          ],
          line(count * each),
          [
            [
              line(count),
              `That keeps the same number. ${small.many} are smaller, so the number must be bigger.`,
              `数没变。${small.zh}更小，数应该更大。`,
            ],
            [
              line(count + each),
              `That adds ${each} only once instead of once for each ${large.one}.`,
              `这只加了一次 ${each}，没有每 1 ${large.zh}加一次。`,
            ],
            [line(half), "A smaller unit never gives a smaller number.", "单位更小，数不会更小。"],
          ],
          [
            [
              ["Compare the units", "比较单位"],
              [
                `${usesFeet ? "An inch" : "A centimeter"} is much smaller than a ${large.one}, so the number must be much bigger.`,
                `${small.zh}比${large.zh}小得多，所以数一定大得多。`,
              ],
            ],
            [
              ["Find the number", "求出数"],
              [`Each ${large.one} is ${each} ${small.many}:`, `每 1 ${large.zh}是 ${each} ${small.zh}：`],
              [`${Array(count).fill(`${each}`).join(" + ")} = ${count * each}`],
            ],
          ],
          [
            `${count * each} ${small.many} make ${count} groups of ${each}, which is ${unitCount(count, large)}.`,
            `${count * each} ${small.zh}是 ${count} 个 ${each}，也就是 ${count} ${large.zh}。`,
          ],
        );
      },
      captioned(cutBarFigure([1, 1]), "A rope of 2 feet; each foot is 12 inches.", "一根 2 英尺的绳子；每英尺是 12 英寸。"),
    ),
    earlyPoint(
      "from-big-blocks-to-small-blocks",
      ["From big blocks to small blocks", "从大方块到小方块"],
      [
        "A shelf is 4 big blocks long. Each big block is as long as 3 small blocks. So the shelf is $3 + 3 + 3 + 3 = 12$ small blocks.\n\nCheck: 12 small blocks make 4 groups of 3, one group per big block.\n\n> **Watch out.** Do not add 4 and 3. Each big block brings 3 small ones.",
        "一个架子长 4 个大方块。每个大方块和 3 个小方块一样长。所以架子长 $3 + 3 + 3 + 3 = 12$ 个小方块。\n\n检验：12 个小方块是 4 组，每组 3 个，一个大方块对应一组。\n\n> **注意。** 不要把 4 和 3 相加。每个大方块都对应 3 个小方块。",
      ],
      (rng) => {
        const big = rng.int(2, 8);
        const each = rng.int(2, 4);
        const answer = big * each;
        const object = rng.pick([
          { en: "shelf", zh: "架子" },
          { en: "wall", zh: "墙" },
          { en: "table", zh: "桌子" },
        ]);
        return solved(
          [
            `This bar shows big blocks along a ${object.en}. One big block is as long as ${each} small blocks. How many small blocks would it take to cover the same length?`,
            `这个长条表示沿着${object.zh}排的大方块。1 个大方块和 ${each} 个小方块一样长。铺满同样的长度需要多少个小方块？`,
          ],
          answer,
          [
            [
              ["Count the big blocks", "数大方块"],
              [`There are ${big} big blocks.`, `有 ${big} 个大方块。`],
            ],
            [
              [`Add ${each} for each one`, `每个加一次 ${each}`],
              ["Each big block is the same as small blocks:", "每个大方块换成小方块："],
              [`${Array(big).fill(`${each}`).join(" + ")} = ${answer}`],
            ],
          ],
          [
            `${answer} small blocks make ${big} groups of ${each}, one group per big block.`,
            `${answer} 个小方块是 ${big} 组，每组 ${each} 个，一个大方块对应一组。`,
          ],
          [
            [
              big + each,
              `That adds ${big} and ${each} instead of adding ${each} for each big block.`,
              `这是 ${big} 加 ${each}，没有每个大方块加一次 ${each}。`,
            ],
            [big, "That is the number of big blocks. Small blocks need a bigger number.", "这是大方块的个数。小方块的个数应该更大。"],
            [answer - each, "That misses one big block.", "这漏了一个大方块。"],
          ],
          cutBarFigure(Array<number>(big).fill(1)),
        );
      },
      captioned(
        cutBarFigure([1, 1, 1, 1]),
        "A shelf 4 big blocks long; each big block is 3 small blocks.",
        "架子长 4 个大方块；每个大方块是 3 个小方块。",
      ),
    ),
  ],
  [
    "Ben measures his desk with paper clips: 20 clips. His sister uses pencils: 4 pencils. The desk is the same; a pencil is longer than a clip, so it takes fewer.\n\nCheck: 1 pencil is as long as 5 clips, and $5 + 5 + 5 + 5 = 20$.\n\nIn this lesson we see that a smaller unit needs a bigger number for the same length.",
    "本用回形针量书桌：20 个。妹妹用铅笔量：4 支。书桌一样长；铅笔比回形针长，所以要的个数少。\n\n检验：1 支铅笔和 5 个回形针一样长，$5 + 5 + 5 + 5 = 20$。\n\n本课我们明白量同样的长度时，单位越小，数就越大。",
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
        "How long is a crayon? An inch is about as wide as your thumb, and about 4 thumbs fit along a crayon. So a good estimate is 4 inches.\n\nCheck: 4 feet would be taller than a small child, far too long for a crayon.\n\n> **Watch out.** Look at the unit, not just the number. 4 inches and 4 feet are very different.",
        "一支蜡笔有多长？1 英寸大约是大拇指的宽度，一支蜡笔大约能排 4 个拇指宽。所以合理的估计是 4 英寸。\n\n检验：4 英尺比一个小孩还高，对蜡笔来说太长了。\n\n> **注意。** 要看单位，不能只看数。4 英寸和 4 英尺差得很远。",
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
        const line = (n: number, unit: LengthUnit): Pair => [unitCount(n, unit), `${n} ${unit.zh}`];
        const size = (n: number, unit: LengthUnit): Pair => {
          const bigger =
            n * (unit === foot ? 12 : unit === meter ? 100 : 1) > item.right * (item.unit === foot ? 12 : item.unit === meter ? 100 : 1);
          return bigger ? ["That is far too long.", "这太长了。"] : ["That is far too short.", "这太短了。"];
        };
        const wrong: Wrong[] = [...item.wrong, [item.right * 20, item.unit] as [number, LengthUnit]].map(([n, unit]) => {
          const [en, zh] = size(n, unit);
          return [
            line(n, unit),
            unit === item.unit ? en : `${en} Check the unit: ${unit.many}, not ${item.unit.many}.`,
            unit === item.unit ? zh : `${zh}看清单位：是${unit.zh}，不是${item.unit.zh}。`,
          ];
        });
        return picked(
          rng,
          [
            `${name} estimates the size of ${item.en}. Which estimate makes the most sense?`,
            `${name} 估计${item.zh}有多长或多高。哪个估计最合理？`,
          ],
          line(item.right, item.unit),
          wrong,
          [
            [
              ["Picture the unit", "想象单位"],
              [`Think of how big one ${item.unit.one} is.`, `想一想 1 ${item.unit.zh}有多大。`],
            ],
            [
              ["Count copies in your head", "在心里数一数"],
              [`About ${item.right} of them fit along ${item.en}.`, `${item.zh}大约能排下 ${item.right} 个。`],
            ],
          ],
          [`Each other choice is far too long or too short for ${item.en}.`, `其他选项对${item.zh}来说都太长或太短了。`],
        );
      },
      captioned(rulerFigure(4, "in", 6), "A crayon about 4 inches long on an inch ruler.", "英寸尺上一支大约 4 英寸长的蜡笔。"),
    ),
    earlyPoint(
      "estimating-from-a-known-length",
      ["Estimating from a known length", "由已知长度来估计"],
      [
        "Bar A is 3 inches. About 4 copies of bar A fit along bar B. So bar B is about $3 + 3 + 3 + 3 = 12$ inches.\n\nCheck: bar B looks about 4 times as long as bar A, and 12 is 4 threes.\n\n> **Watch out.** Bar B is longer than bar A, so its length cannot be 3 inches.",
        "长条 A 长 3 英寸。长条 B 上大约能排下 4 个长条 A。所以长条 B 大约长 $3 + 3 + 3 + 3 = 12$ 英寸。\n\n检验：长条 B 看起来大约是长条 A 的 4 倍长，12 正是 4 个 3。\n\n> **注意。** 长条 B 比长条 A 长，所以它不可能是 3 英寸。",
      ],
      (rng) => {
        const known = rng.int(2, 5);
        const copies = rng.int(2, 4);
        const unit = rng.pick([inch, centimeter]);
        const answer = known * copies;
        const swap = rng.bool();
        const [knownLabel, otherLabel] = swap ? ["B", "A"] : ["A", "B"];
        const line = (n: number): Pair => [unitCount(n, unit), `${n} ${unit.zh}`];
        return picked(
          rng,
          [
            `Bar ${knownLabel} is ${unitCount(known, unit)} long. About how long is bar ${otherLabel}?`,
            `长条 ${knownLabel} 长 ${known} ${unit.zh}。长条 ${otherLabel} 大约有多长？`,
          ],
          line(answer),
          [
            [
              line(known),
              `That is the length of bar ${knownLabel}, but bar ${otherLabel} is longer.`,
              `这是长条 ${knownLabel} 的长度，可长条 ${otherLabel} 更长。`,
            ],
            [line(answer + 2 * known), `That is two copies of bar ${knownLabel} too many.`, `这多算了两个长条 ${knownLabel}。`],
            [line(answer + 1 + known * 4), "That is far too long for the bar in the picture.", "这比图中的长条长得多。"],
          ],
          [
            [
              ["Lay copies along it", "沿着排一排"],
              [
                `About ${copies} copies of bar ${knownLabel} fit along bar ${otherLabel}.`,
                `长条 ${otherLabel} 上大约能排下 ${copies} 个长条 ${knownLabel}。`,
              ],
            ],
            [
              [`Count by ${known}s`, `${known} 个 ${known} 个地数`],
              [`Add ${known} for each copy:`, `每个加一次 ${known}：`],
              [`${Array(copies).fill(`${known}`).join(" + ")} = ${answer}`],
            ],
          ],
          [
            `${answer} is ${copies} copies of ${known}, and bar ${otherLabel} looks about ${copies} times as long as bar ${knownLabel}.`,
            `${answer} 是 ${copies} 个 ${known}，长条 ${otherLabel} 看起来大约是长条 ${knownLabel} 的 ${copies} 倍长。`,
          ],
          lengthBarsFigure(["A", "B"], swap ? [answer, known] : [known, answer]),
        );
      },
      captioned(
        lengthBarsFigure(["A", "B"], [3, 12]),
        "Bar A is 3 inches; bar B is about 4 copies of bar A.",
        "长条 A 长 3 英寸；长条 B 大约是 4 个长条 A。",
      ),
    ),
  ],
  [
    "Sam wants to guess how long his room is without a tape. He walks across it in big steps. A big step is about a meter, and he takes 5 steps. So the room is about 5 meters long.\n\nCheck: 5 centimeters would be shorter than his hand, so meters make sense.\n\nIn this lesson we make sensible guesses at lengths using what we know about units.",
    "萨姆想不用卷尺猜猜房间有多长。他大步走过去。一大步大约 1 米，他走了 5 步。所以房间大约长 5 米。\n\n检验：5 厘米比他的手还短，所以用米才合理。\n\n本课我们利用对单位的了解，合理地估计长度。",
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
        "Bar A has 5 blocks and bar B has 8. Bar B sticks out past bar A by $8 - 5 = 3$ blocks. So bar B is 3 units longer.\n\nCheck: count the blocks that stick out: 3.\n\n> **Watch out.** The question asks how much longer, not how long. 8 is the length of bar B.",
        "长条 A 有 5 个方块，长条 B 有 8 个。长条 B 比长条 A 多出 $8 - 5 = 3$ 个方块。所以长条 B 长 3 个单位。\n\n检验：数多出来的方块：3 个。\n\n> **注意。** 问的是长多少，不是有多长。8 是长条 B 的长度。",
      ],
      (rng) => {
        const a = rng.int(3, 10);
        const answer = rng.int(1, 12 - a);
        const b = a + answer;
        const unit = rng.pick([inch, centimeter]);
        const swap = rng.bool();
        const [shortLabel, longLabel] = swap ? ["B", "A"] : ["A", "B"];
        return solved(
          [
            `Each block is 1 ${unit.one} long. How much longer is bar ${longLabel} than bar ${shortLabel}, in ${unit.many}?`,
            `每个方块长 1 ${unit.zh}。长条 ${longLabel} 比长条 ${shortLabel} 长多少${unit.zh}？`,
          ],
          answer,
          [
            [
              ["Count each bar", "数每个长条"],
              [
                `Bar ${longLabel} has ${b} blocks and bar ${shortLabel} has ${a}.`,
                `长条 ${longLabel} 有 ${b} 个方块，长条 ${shortLabel} 有 ${a} 个。`,
              ],
            ],
            [["Find the difference", "求差"], ["Subtract:", "相减："], [`${b} - ${a} = ${answer}`]],
          ],
          [
            `Count the blocks of bar ${longLabel} that stick out past bar ${shortLabel}: ${answer}.`,
            `数长条 ${longLabel} 比长条 ${shortLabel} 多出来的方块：${answer} 个。`,
          ],
          [
            [b, `That is the length of bar ${longLabel}, not how much longer it is.`, `这是长条 ${longLabel} 的长度，不是长多少。`],
            [a, `That is the length of bar ${shortLabel}.`, `这是长条 ${shortLabel} 的长度。`],
            [a + b, "That adds the two bars instead of comparing them.", "这把两个长条加起来了，没有比较。"],
          ],
          lengthBarsFigure(["A", "B"], swap ? [b, a] : [a, b], true),
        );
      },
      captioned(lengthBarsFigure(["A", "B"], [5, 8], true), "Bar A has 5 blocks and bar B has 8.", "长条 A 有 5 个方块，长条 B 有 8 个。"),
    ),
    earlyPoint(
      "how-much-longer-from-a-ruler",
      ["How much longer from a ruler", "由尺子看长多少"],
      [
        "The ruler shows a ribbon 7 centimeters long. Another ribbon is 11 centimeters. The second is $11 - 7 = 4$ centimeters longer.\n\nCheck: $7 + 4 = 11$.\n\n> **Watch out.** Read the ruler first. Do not subtract the ruler's last number.",
        "尺子显示一条丝带长 7 厘米。另一条丝带长 11 厘米。第二条长 $11 - 7 = 4$ 厘米。\n\n检验：$7 + 4 = 11$。\n\n> **注意。** 先读尺子。不要拿尺子上最后一个数去减。",
      ],
      (rng) => {
        const unit = rng.pick([inch, centimeter]);
        const object = rng.pick(smallObjects);
        const length = rng.int(3, 11);
        const diff = rng.int(1, 12);
        const other = length + diff;
        return solved(
          [
            `A second ${object.en} is ${unitCount(other, unit)} long. How much longer is it than the ${object.en} shown on the ruler, in ${unit.many}?`,
            `另一${object.measure}${object.zh}长 ${other} ${unit.zh}。它比尺子上的${object.zh}长多少${unit.zh}？`,
          ],
          diff,
          [
            [
              ["Read the ruler", "读尺子"],
              [`The ${object.en} on the ruler is ${unitCount(length, unit)} long.`, `尺子上的${object.zh}长 ${length} ${unit.zh}。`],
            ],
            [["Find the difference", "求差"], ["Subtract:", "相减："], [`${other} - ${length} = ${diff}`]],
          ],
          [`$${length} + ${diff} = ${other}$.`, `$${length} + ${diff} = ${other}$。`],
          [
            [length, "That is the length on the ruler, not the difference.", "这是尺子上的长度，不是差。"],
            [other, "That is the length of the second one, not the difference.", "这是第二个的长度，不是差。"],
            [other - 12, "That subtracts the end of the ruler instead of the reading.", "这减的是尺子的末端，不是读数。"],
            [length + other, "That adds the two lengths instead of comparing them.", "这把两个长度加起来了，没有比较。"],
          ],
          rulerFigure(length, unit.symbol, 12),
        );
      },
      captioned(rulerFigure(7, "cm", 12), "A ribbon 7 centimeters long on a ruler.", "尺子上一条 7 厘米长的丝带。"),
    ),
  ],
  [
    "Mia's pencil is 15 centimeters and Leo's is 11 centimeters. Mia's sticks out past Leo's by $15 - 11 = 4$ centimeters.\n\nCheck: $11 + 4 = 15$.\n\nIn this lesson we measure two objects and find how much longer one is.",
    "米娅的铅笔长 15 厘米，利奥的长 11 厘米。米娅的比利奥的多出 $15 - 11 = 4$ 厘米。\n\n检验：$11 + 4 = 15$。\n\n本课我们量出两个物体的长度，求一个比另一个长多少。",
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
        "Two ropes, 25 feet and 18 feet, are tied end to end. Together they are $25 + 18 = 43$ feet.\n\nCheck: $43 - 18 = 25$.\n\n> **Watch out.** Joined lengths get longer, so add. Do not subtract.",
        "两根绳子，一根 25 英尺，一根 18 英尺，首尾系在一起。合起来是 $25 + 18 = 43$ 英尺。\n\n检验：$43 - 18 = 25$。\n\n> **注意。** 接起来长度会变长，所以要加，不要减。",
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
        return solved(
          [
            `${name} joins two ${story.en} end to end. One is ${a} ${story.unit.many} long and the other is ${b} ${story.unit.many} long. How long are they together, in ${story.unit.many}?`,
            `${name} 把两${story.measure}${story.zh}首尾相接。一${story.measure}长 ${a} ${story.unit.zh}，另一${story.measure}长 ${b} ${story.unit.zh}。合起来有多长？（单位：${story.unit.zh}）`,
          ],
          answer,
          [
            [
              ["Picture them end to end", "想象首尾相接"],
              ["Joined lengths add up.", "接起来的长度要相加。"],
            ],
            [["Add", "相加"], [`In ${story.unit.many}:`, `单位是${story.unit.zh}：`], [`${a} + ${b} = ${answer}`]],
          ],
          [`$${answer} - ${b} = ${a}$.`, `$${answer} - ${b} = ${a}$。`],
          [
            [Math.abs(a - b), "That subtracts. Joining makes the length longer.", "这是相减。接起来长度会变长。"],
            [answer + 10, "That has one ten too many.", "这多了一个十。"],
            [answer - 10, "That forgets the new ten from the ones.", "这忘了个位满十进的那个十。"],
          ],
          partWholeBarFigure([a, b], -1),
        );
      },
      captioned(
        partWholeBarFigure([25, 18], -1),
        "Lengths 25 and 18 end to end; the total is unknown.",
        "长度 25 和 18 首尾相接，总长未知。",
      ),
    ),
    earlyPoint(
      "cutting-a-length",
      ["Cutting off a length", "剪去一段长度"],
      [
        "A ribbon is 60 centimeters. Kim cuts off 24 centimeters. What is left is $60 - 24 = 36$ centimeters.\n\nCheck: $36 + 24 = 60$, the whole ribbon.\n\n> **Watch out.** The piece left is shorter than the whole. Do not add the cut piece.",
        "一条丝带长 60 厘米。金剪掉 24 厘米。剩下 $60 - 24 = 36$ 厘米。\n\n检验：$36 + 24 = 60$，正是整条丝带。\n\n> **注意。** 剩下的比原来短。不要把剪掉的加上去。",
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
        if (rng.bool())
          return solved(
            [
              `A ${story.en} is ${full} ${story.unit.many} long. ${name} cuts off ${cut} ${story.unit.many}. How long is the piece that is left, in ${story.unit.many}?`,
              `一${story.measure}${story.zh}长 ${full} ${story.unit.zh}。${name} 剪掉 ${cut} ${story.unit.zh}。剩下的有多长？（单位：${story.unit.zh}）`,
            ],
            left,
            [
              [
                ["See the parts", "看清两部分"],
                [`The whole is ${full}. The cut piece is ${cut}.`, `全长 ${full}，剪掉 ${cut}。`],
              ],
              [["Subtract", "相减"], ["Whole minus the cut piece:", "全长减去剪掉的："], [`${full} - ${cut} = ${left}`]],
            ],
            [`$${left} + ${cut} = ${full}$, the whole length.`, `$${left} + ${cut} = ${full}$，正是全长。`],
            [
              [full + cut, "That adds. Cutting makes it shorter.", "这是相加。剪掉以后会变短。"],
              [left + 10, "That takes away one ten too few.", "这少减了一个十。"],
              [left - 10, "That takes away one ten too many.", "这多减了一个十。"],
            ],
            partWholeBarFigure([cut, left], 1),
          );
        return solved(
          [
            `${name} cuts a piece off a ${story.en} that was ${full} ${story.unit.many} long. The piece that is left is ${left} ${story.unit.many} long. How long is the piece that was cut off, in ${story.unit.many}?`,
            `${name} 从一${story.measure}长 ${full} ${story.unit.zh}的${story.zh}上剪下一段。剩下的长 ${left} ${story.unit.zh}。剪下的那段有多长？（单位：${story.unit.zh}）`,
          ],
          cut,
          [
            [
              ["See the parts", "看清两部分"],
              [`The whole is ${full}. The piece left is ${left}.`, `全长 ${full}，剩下 ${left}。`],
            ],
            [["Subtract", "相减"], ["Whole minus the piece left:", "全长减去剩下的："], [`${full} - ${left} = ${cut}`]],
          ],
          [`$${cut} + ${left} = ${full}$, the whole length.`, `$${cut} + ${left} = ${full}$，正是全长。`],
          [
            [full + left, "That adds. The cut piece is part of the whole.", "这是相加。剪下的只是一部分。"],
            [left, "That is the piece left, not the piece cut off.", "这是剩下的那段，不是剪下的。"],
            [cut + 10, "That has one ten too many.", "这多了一个十。"],
          ],
          partWholeBarFigure([cut, left], 0),
        );
      },
      captioned(partWholeBarFigure([24, 36], 1), "A ribbon of 60: 24 cut off, the rest unknown.", "60 长的丝带：剪掉 24，剩下的未知。"),
    ),
  ],
  [
    "A path is 45 meters to the pond and 30 more meters to the barn. Walking both, Max goes $45 + 30 = 75$ meters.\n\nCheck: $75 - 30 = 45$.\n\nIn this lesson we add and take away lengths to solve stories.",
    "一条小路到池塘是 45 米，再到谷仓还有 30 米。两段都走完，马克斯走了 $45 + 30 = 75$ 米。\n\n检验：$75 - 30 = 45$。\n\n本课我们加减长度，解决长度的故事。",
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
    {
      ...earlyPoint(
        "jumping-right-to-add",
        ["Jumping right to add", "向右跳表示加"],
        [
          "$24 + 12$: start at 24 and jump right 12. Go 6 to reach 30, then 6 more to land on 36.\n\nCheck: from 36, jump back 12 and you are at 24 again.\n\n> **Watch out.** Count the spaces you jump, not the tick marks you touch. Touching the start mark gives one too many.",
          "$24 + 12$：从 24 开始向右跳 12。先跳 6 到 30，再跳 6，落在 36。\n\n检验：从 36 往回跳 12，又回到 24。\n\n> **注意。** 数跳过的格子，不要数碰到的刻度。把起点的刻度也数进去，就会多一个。",
        ],
        (rng) => {
          const step = rng.pick([5, 10]);
          const lo = step === 5 ? 5 * rng.int(0, 10) : 0;
          const ticks = 10;
          const hi = lo + ticks * step;
          const start = lo + step * rng.int(1, 5);
          const spaces = rng.int(1, Math.floor((hi - start) / step));
          const jump = step * spaces;
          const answer = start + jump;
          const stops = Array.from({ length: spaces }, (_, i) => start + (i + 1) * step);
          return {
            ...solved(
              [
                `The marked point is at the start. Move right by ${jump}. Which number do you land on?`,
                `标出的点是起点。向右移动 ${jump}。落在哪个数上？`,
              ],
              answer,
              [
                [
                  ["Read the scale", "看刻度"],
                  [
                    `Each space is worth ${step}, so ${jump} is ${spaces === 1 ? "1 space" : `${spaces} spaces`}.`,
                    `每格是 ${step}，所以 ${jump} 是 ${spaces} 格。`,
                  ],
                ],
                [
                  ["Jump right", "向右跳"],
                  [`From ${start}: ${stops.join(", ")}.`, `从 ${start} 开始：${stops.join("、")}。`],
                  [`${start} + ${jump} = ${answer}`],
                ],
              ],
              [`Jump back: $${answer} - ${jump} = ${start}$.`, `往回跳：$${answer} - ${jump} = ${start}$。`],
              [
                [start - jump, "That moves left. Adding moves right.", "这是向左移了。加法要向右移。"],
                [answer + step, "That counts the starting mark as a jump.", "这把起点也算成了一跳。"],
                [jump, "That is the size of the jump, not where you land.", "这是跳的距离，不是落点。"],
                [start + spaces, "That treats each space as 1, not as its value.", "这把每格当成 1，没看刻度。"],
              ],
              numberLineFigure(lo, hi, step, start),
            ),
            solutionFigure: jumpsFigure(lo, hi, step, [start, ...stops]),
          };
        },
      ),
      figure: gradeDrawings2["sums-and-differences-on-a-number-line#jumping-right-to-add"],
    },
    {
      ...earlyPoint(
        "jumping-left-to-subtract",
        ["Jumping left to subtract", "向左跳表示减"],
        [
          "$36 - 9$: start at 36 and jump left 9. Go 6 to reach 30, then 3 more to land on 27.\n\nCheck: $27 + 9 = 36$.\n\n> **Watch out.** Taking away moves left. Moving right would give 45.",
          "$36 - 9$：从 36 开始向左跳 9。先跳 6 到 30，再跳 3，落在 27。\n\n检验：$27 + 9 = 36$。\n\n> **注意。** 减法向左移。向右移会得到 45。",
        ],
        (rng) => {
          const step = rng.pick([5, 10]);
          const lo = step === 5 ? 5 * rng.int(0, 10) : 0;
          const ticks = 10;
          const start = lo + step * rng.int(5, ticks);
          const spaces = rng.int(1, (start - lo) / step);
          const jump = step * spaces;
          const answer = start - jump;
          const stops = Array.from({ length: spaces }, (_, i) => start - (i + 1) * step);
          return solved(
            [
              `The marked point is at the start. Move left by ${jump}. Which number do you land on?`,
              `标出的点是起点。向左移动 ${jump}。落在哪个数上？`,
            ],
            answer,
            [
              [
                ["Read the scale", "看刻度"],
                [
                  `Each space is worth ${step}, so ${jump} is ${spaces === 1 ? "1 space" : `${spaces} spaces`}.`,
                  `每格是 ${step}，所以 ${jump} 是 ${spaces} 格。`,
                ],
              ],
              [
                ["Jump left", "向左跳"],
                [`From ${start}: ${stops.join(", ")}.`, `从 ${start} 开始：${stops.join("、")}。`],
                [`${start} - ${jump} = ${answer}`],
              ],
            ],
            [`Jump forward again: $${answer} + ${jump} = ${start}$.`, `再向右跳回去：$${answer} + ${jump} = ${start}$。`],
            [
              [start + jump, "That moves right. Taking away moves left.", "这是向右移了。减法要向左移。"],
              [answer + step, "That is one space short of the landing point.", "这离落点还差一格。"],
              [answer - step, "That counts the starting mark as a jump.", "这把起点也算成了一跳。"],
            ],
            numberLineFigure(lo, lo + ticks * step, step, start),
          );
        },
      ),
      figure: gradeDrawings2["sums-and-differences-on-a-number-line#jumping-left-to-subtract"],
    },
  ],
  [
    "A frog sits on 30 on a number line. It hops 15 to the right and lands on 45. Hopping right adds: $30 + 15 = 45$.\n\nCheck: hopping 15 to the left from 45 brings it back to 30.\n\nIn this lesson we add by jumping right and subtract by jumping left on a number line.",
    "一只青蛙在数轴的 30 上。它向右跳 15，落在 45。向右跳就是加：$30 + 15 = 45$。\n\n检验：从 45 向左跳 15，又回到 30。\n\n本课我们在数轴上向右跳表示加，向左跳表示减。",
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
        "The long hand points at the 4. Count by fives from the 12: 5, 10, 15, 20. That is 20 minutes past the hour.\n\nCheck: $5 + 5 + 5 + 5 = 20$, five minutes for each of the 4 numbers.\n\n> **Watch out.** The 4 is not 4 minutes. Each number on the clock is 5 minutes.",
        "长针指着 4。从 12 开始按 5 数：5、10、15、20。也就是过了 20 分钟。\n\n检验：走过 4 个数，每个 5 分钟，$5 + 5 + 5 + 5 = 20$。\n\n> **注意。** 4 不是 4 分钟。钟面上每个数代表 5 分钟。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        const n = rng.int(1, 11);
        const minute = 5 * n;
        const counts = Array.from({ length: n }, (_, i) => 5 * (i + 1));
        return solved(
          ["How many minutes past the hour does this clock show?", "这个钟面上显示过了整点多少分钟？"],
          minute,
          [
            [
              ["Find the long hand", "找长针"],
              [`The long hand points at the ${n}.`, `长针指着 ${n}。`],
            ],
            [
              ["Count by fives from the 12", "从 12 开始按 5 数"],
              [`${counts.join(", ")}: ${minute} minutes.`, `${counts.join("、")}：${minute} 分钟。`],
            ],
          ],
          [
            `It is $60 - ${minute} = ${60 - minute}$ minutes until the next hour, and $${minute} + ${60 - minute} = 60$.`,
            `离下一个整点还有 $60 - ${minute} = ${60 - minute}$ 分钟，$${minute} + ${60 - minute} = 60$。`,
          ],
          [
            [n, "That is the number the hand points at, not the minutes.", "这是长针指着的数，不是分钟数。"],
            [60 - minute, "That counts the minutes left until the next hour.", "这数的是离下一个整点还剩的分钟。"],
            [minute + 5, "That counts one five too many.", "这多数了一个 5。"],
          ],
          clockFigure(hour, minute),
        );
      },
      captioned(clockFigure(3, 20), "The long hand on the 4: 20 minutes past the hour.", "长针指着 4：过了 20 分钟。"),
    ),
    earlyPoint(
      "reading-the-whole-time",
      ["Reading the whole time", "读出完整的时间"],
      [
        "The short hand is just past the 8, so the hour is 8. The long hand is on the 1: 5 minutes. The time is 8:05.\n\nCheck: the short hand has only moved a little past the 8, which fits 5 minutes after 8.\n\n> **Watch out.** When the short hand sits between two numbers, the hour is the one it has passed, not the next one.",
        "短针刚过 8，所以是 8 时。长针指着 1：5 分。时间是 8:05。\n\n检验：短针只比 8 多走了一点点，正好是 8 时过 5 分。\n\n> **注意。** 短针在两个数之间时，取已经走过的那个数，不是下一个。",
      ],
      (rng) => {
        const hour = rng.int(1, 12);
        const minute = 5 * rng.int(1, 11);
        const next = hour === 12 ? 1 : hour + 1;
        const asOption = (h: number, m: number): Pair => [timeText(h, m), timeText(h, m)];
        const wrong: Wrong[] = [
          [
            asOption(next, minute),
            "That reads the hour the short hand is moving toward, not the one it passed.",
            "这读的是短针要走到的数，不是已经走过的数。",
          ],
          [asOption(minute / 5, (hour * 5) % 60), "That mixes up the two hands.", "这把两根针弄反了。"],
          [asOption(hour, minute === 5 ? 55 : minute - 5), "That misses one five on the long hand.", "长针少数了一个 5。"],
        ];
        return picked(
          rng,
          ["What time does this clock show?", "这个钟面显示几时几分？"],
          asOption(hour, minute),
          wrong,
          [
            [
              ["Read the short hand", "先读短针"],
              [`It has passed the ${hour}, so the hour is ${hour}.`, `它已经走过 ${hour}，所以是 ${hour} 时。`],
            ],
            [
              ["Read the long hand", "再读长针"],
              [
                `It points at the ${minute / 5}: ${minute} minutes. The time is ${timeText(hour, minute)}.`,
                `它指着 ${minute / 5}：${minute} 分。时间是 ${timeText(hour, minute)}。`,
              ],
            ],
          ],
          [
            `At ${timeText(hour, minute)} the short hand has gone ${minute < 30 ? "less" : "more"} than halfway from the ${hour} to the ${next}, as the clock shows.`,
            `${timeText(hour, minute)} 时，短针从 ${hour} 走向 ${next}，走了${minute < 30 ? "不到" : "超过"}一半，和钟面一样。`,
          ],
          clockFigure(hour, minute),
        );
      },
      captioned(clockFigure(8, 5), "A clock showing 8:05.", "显示 8:05 的钟面。"),
    ),
  ],
  [
    "The school bus comes when the long hand is on the 6 and the short hand is halfway between the 7 and the 8. Count by fives to the 6: 30 minutes. So the bus comes at 7:30.\n\nCheck: the short hand is halfway between 7 and 8, which fits half past 7.\n\nIn this lesson we count the minute hand by fives and write the time a clock shows.",
    "校车来的时候，长针指着 6，短针在 7 和 8 的中间。按 5 数到 6：30 分。所以校车 7:30 来。\n\n检验：短针在 7 和 8 的正中间，正是 7 时半。\n\n本课我们按 5 数分针，写出钟面上的时间。",
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
        "When do you eat breakfast? In the morning, before noon. So 7:30 a.m. fits, and 7:30 p.m. does not.\n\nCheck: 7:30 p.m. is in the evening, near bedtime.\n\n> **Watch out.** The clock looks the same at 7:30 a.m. and 7:30 p.m. Think about what happens at that part of the day.",
        "你什么时候吃早饭？早上，在中午之前。所以上午 7:30 合适，下午 7:30 不合适。\n\n检验：下午 7:30 是晚上，快睡觉了。\n\n> **注意。** 上午 7:30 和下午 7:30 的钟面一模一样。要想一想一天中那个时候在做什么。",
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
        const clock = (h: number, m: number, am: boolean): Pair => [
          `${timeText(h, m)} ${am ? "a.m." : "p.m."}`,
          `${am ? "上午" : "下午"} ${timeText(h, m)}`,
        ];
        const elsewhere = act.hour <= 3 || act.hour === 12 ? 9 : 2;
        const half: Pair = act.am ? ["after noon", "中午以后"] : ["before noon", "中午以前"];
        const wrong: Wrong[] = [
          [clock(act.hour, act.minute, !act.am), `The clock looks right, but that is ${half[0]}.`, `钟面一样，可那是${half[1]}。`],
          [
            clock(elsewhere, act.minute, !act.am),
            `That time is ${half[0]}, at the wrong part of the day.`,
            `那个时间在${half[1]}，时段不对。`,
          ],
          [
            clock(elsewhere + 1, act.minute, !act.am),
            `That time is ${half[0]}, at the wrong part of the day.`,
            `那个时间在${half[1]}，时段不对。`,
          ],
        ];
        return picked(
          rng,
          [`Which is the most likely time for ${name} to ${act.en}?`, `${name} 什么时间最有可能${act.zh}？`],
          clock(act.hour, act.minute, act.am),
          wrong,
          [
            [
              ["Place it in the day", "放到一天里"],
              act.am ? ["This happens before noon.", "这件事发生在中午之前。"] : ["This happens after noon.", "这件事发生在中午之后。"],
            ],
            [
              ["Choose a.m. or p.m.", "选上午或下午"],
              act.am
                ? [`So it is a.m.: ${timeText(act.hour, act.minute)} a.m.`, `所以是上午：上午 ${timeText(act.hour, act.minute)}。`]
                : [`So it is p.m.: ${timeText(act.hour, act.minute)} p.m.`, `所以是下午：下午 ${timeText(act.hour, act.minute)}。`],
            ],
          ],
          [
            `Picture your own day: ${act.en} comes ${act.am ? "before" : "after"} lunch, which matches ${act.am ? "a.m." : "p.m."}`,
            `想想自己的一天：${act.zh}在午饭${act.am ? "之前" : "之后"}，正是${act.am ? "上午" : "下午"}。`,
          ],
        );
      },
      captioned(
        clockFigure(7, 30),
        "7:30 comes twice a day: once in the morning and once in the evening.",
        "7:30 一天出现两次：早上一次，晚上一次。",
      ),
    ),
    earlyPoint(
      "which-happens-in-the-a-m-or-p-m",
      ["Which happens in the a.m. or p.m.", "哪件事发生在上午或下午"],
      [
        "Watching the sun rise happens early in the morning, before noon: a.m. Watching the sun set happens in the evening, after noon: p.m.\n\nCheck: noon is lunchtime, and sunrise comes long before lunch.\n\n> **Watch out.** A.m. starts at midnight, not when you wake up. Late night before midnight is p.m.",
        "看日出是在清早，中午之前：上午。看日落是在傍晚，中午之后：下午。\n\n检验：中午是午饭时间，日出比午饭早得多。\n\n> **注意。** 上午从午夜开始，不是从起床开始。午夜之前的深夜也属于 p.m.。",
      ],
      (rng) => {
        const mornings: readonly Pair[] = [
          ["Watching the sun rise", "看日出"],
          ["Brushing teeth after waking up", "起床后刷牙"],
          ["Packing a school bag before leaving home", "出门前收拾书包"],
          ["Eating a morning bowl of cereal", "早上吃一碗麦片"],
          ["Walking to school", "走路去上学"],
        ];
        const evenings: readonly Pair[] = [
          ["Watching the sun set", "看日落"],
          ["Doing homework after school", "放学后做作业"],
          ["Eating dinner with the family", "和家人吃晚饭"],
          ["Reading a story at bedtime", "睡前读故事"],
          ["Looking at the stars", "看星星"],
        ];
        const asksAm = rng.bool();
        const [right, other] = asksAm ? [mornings, evenings] : [evenings, mornings];
        const correct = rng.pick(right);
        const others = rng.sample(other, 3);
        const wrong: Wrong[] = others.map((o) => [
          o,
          `This usually happens ${asksAm ? "after noon, in the p.m." : "before noon, in the a.m."}`,
          `这件事通常发生在${asksAm ? "中午以后，也就是下午" : "中午以前，也就是上午"}。`,
        ]);
        return picked(
          rng,
          [
            `Which of these most likely happens in the ${asksAm ? "a.m." : "p.m."}?`,
            `下面哪件事最有可能发生在${asksAm ? "上午" : "下午"}？`,
          ],
          correct,
          wrong,
          [
            [
              ["Know the halves of the day", "分清两个半天"],
              asksAm
                ? ["A.m. is from midnight to noon.", "上午是从午夜到中午。"]
                : ["P.m. is from noon to midnight.", "下午是从中午到午夜。"],
            ],
            [
              ["Place each event", "给每件事找位置"],
              [`"${correct[0]}" comes ${asksAm ? "before" : "after"} noon.`, `“${correct[1]}”在中午${asksAm ? "之前" : "之后"}。`],
            ],
          ],
          [`Each other choice happens ${asksAm ? "after" : "before"} noon.`, `其他几件事都在中午${asksAm ? "之后" : "之前"}。`],
        );
      },
      captioned(clockFigure(12, 0), "12:00: noon splits a.m. from p.m.", "12:00：中午把上午和下午分开。"),
    ),
  ],
  [
    "Ella's clock says 6:00. Is it time to get up or time for dinner? If the sun is coming up, it is 6:00 a.m.; if it is going down, it is 6:00 p.m.\n\nCheck: a.m. runs from midnight to noon, and sunrise is in that part.\n\nIn this lesson we use a.m. for midnight to noon and p.m. for noon to midnight.",
    "埃拉的钟显示 6:00。是该起床了，还是该吃晚饭了？如果太阳正在升起，就是上午 6:00；如果太阳正在落下，就是下午 6:00。\n\n检验：上午是午夜到中午，日出就在这段时间里。\n\n本课我们知道午夜到中午是上午（a.m.），中午到午夜是下午（p.m.）。",
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
        "3 dimes and 2 nickels: count the dimes by tens, 10, 20, 30. Then the nickels by fives, 35, 40. That is 40 cents.\n\nCheck: dimes $30$, nickels $10$, and $30 + 10 = 40$.\n\n> **Watch out.** A dime is smaller than a nickel but worth more. Go by the value, not the size.",
        "3 枚 10 美分和 2 枚 5 美分：先按 10 数 10 美分硬币，10、20、30；再按 5 数 5 美分硬币，35、40。一共 40 美分。\n\n检验：10 美分硬币共 30，5 美分硬币共 10，$30 + 10 = 40$。\n\n> **注意。** 10 美分硬币比 5 美分硬币小，却更值钱。要看面值，不看大小。",
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
        const a = nh * high.value;
        const b = nl * low.value;
        const answer = a + b;
        const name = rng.pick(earlyNames);
        const coinsEn = (n: number, c: (typeof coinNames)[number]) => `${n} ${n === 1 ? c.en : c.many}`;
        const highCounts = Array.from({ length: nh }, (_, i) => high.value * (i + 1));
        const lowCounts = Array.from({ length: nl }, (_, i) => a + low.value * (i + 1));
        return solved(
          [
            `${name} has ${coinsEn(nh, high)} and ${coinsEn(nl, low)}. How many cents is that?`,
            `${name} 有 ${nh} 枚 ${high.zh}硬币和 ${nl} 枚 ${low.zh}硬币。一共是多少美分？`,
          ],
          answer,
          [
            [
              ["Count the bigger coins", "先数面值大的"],
              [`Each ${high.en} is ${high.value} cents: ${highCounts.join(", ")}.`, `每枚 ${high.zh}：${highCounts.join("、")}。`],
            ],
            [
              ["Count on with the smaller coins", "再接着数面值小的"],
              [
                `Each ${low.en} is ${low.value} ${low.value === 1 ? "cent" : "cents"}: ${lowCounts.join(", ")}.`,
                `每枚 ${low.zh}：${lowCounts.join("、")}。`,
              ],
            ],
          ],
          [`$${a} + ${b} = ${answer}$.`, `$${a} + ${b} = ${answer}$。`],
          [
            [nh + nl, "That counts the coins, not the cents.", "这数的是硬币的枚数，不是美分。"],
            [nh * low.value + nl * high.value, "That swaps the values of the two kinds of coins.", "这把两种硬币的面值弄反了。"],
            [answer - low.value, `That misses one ${low.en}.`, `这漏了一枚 ${low.zh}硬币。`],
          ],
        );
      },
      captioned(coinsFigure([10, 10, 10, 5, 5]), "3 dimes and 2 nickels: 40 cents.", "3 枚 10 美分和 2 枚 5 美分：40 美分。"),
    ),
    earlyPoint(
      "counting-a-picture-of-coins",
      ["Counting a picture of coins", "数图中的硬币"],
      [
        "A quarter, a dime, a nickel and a penny. Start with the biggest value and count on: 25, 35, 40, 41. That is 41 cents.\n\nCheck: $25 + 10 + 5 + 1 = 41$.\n\n> **Watch out.** 4 coins is not 4 cents. Count the value of each coin.",
        "1 枚 25 美分、1 枚 10 美分、1 枚 5 美分和 1 枚 1 美分。从面值最大的开始往后数：25、35、40、41。一共 41 美分。\n\n检验：$25 + 10 + 5 + 1 = 41$。\n\n> **注意。** 4 枚硬币不是 4 美分。要数每枚硬币的面值。",
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
        return solved(
          ["How many cents are these coins worth?", "这些硬币一共值多少美分？"],
          answer,
          [
            [
              ["Order the coins", "给硬币排队"],
              [`From the biggest value: ${sorted.join(", ")}.`, `从面值最大的排起：${sorted.join("、")}。`],
            ],
            [
              ["Count on", "往后数"],
              [`${steps.join(", ")}: ${answer} cents.`, `${steps.join("、")}：${answer} 美分。`],
            ],
          ],
          [
            `Add by kind: $${[25 * q, 10 * d, 5 * n, p].filter((v) => v > 0).join(" + ")} = ${answer}$.`,
            `按种类相加：$${[25 * q, 10 * d, 5 * n, p].filter((v) => v > 0).join(" + ")} = ${answer}$。`,
          ],
          [
            [coins.length, "That counts the coins, not the cents.", "这数的是硬币的枚数，不是美分。"],
            [answer + 5, "That counts one nickel too many.", "这多数了 5 美分。"],
            [answer - 5, "That misses 5 cents.", "这漏了 5 美分。"],
          ],
          coinsFigure(coins),
        );
      },
      captioned(
        coinsFigure([25, 10, 5, 1]),
        "A quarter, a dime, a nickel and a penny: 41 cents.",
        "25 美分、10 美分、5 美分和 1 美分各一枚：41 美分。",
      ),
    ),
  ],
  [
    "Jay finds 2 dimes and 3 pennies in his pocket. Count the dimes by tens, 10, 20, then the pennies by ones, 21, 22, 23. He has 23 cents.\n\nCheck: $20 + 3 = 23$.\n\nIn this lesson we learn what each coin is worth and count a group of coins.",
    "杰在口袋里找到 2 枚 10 美分和 3 枚 1 美分。先按 10 数：10、20，再按 1 数：21、22、23。他有 23 美分。\n\n检验：$20 + 3 = 23$。\n\n本课我们认识每种硬币的面值，并数出一组硬币值多少。",
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
        "2 dollar bills and coins worth 35 cents make 2 dollars and 35 cents. Write the dollars before the point and the cents after it: \\$2.35.\n\nCheck: 1 dollar is 100 cents, so \\$2.35 is $100 + 100 + 35 = 235$ cents.\n\n> **Watch out.** Cents always take two places. 5 cents is written .05, not .5.",
        "2 张 1 美元纸币和共值 35 美分的硬币，合起来是 2 美元 35 美分。美元写在小数点前，美分写在小数点后：\\$2.35。\n\n检验：1 美元是 100 美分，所以 \\$2.35 是 $100 + 100 + 35 = 235$ 美分。\n\n> **注意。** 美分总要占两位。5 美分写作 .05，不是 .5。",
      ],
      (rng) => {
        const bills = rng.int(1, 3);
        const q = rng.int(0, 2);
        const d = rng.int(0, 2);
        const n = rng.int(0, 1);
        const p = rng.int(q + d + n === 0 ? 1 : 0, 3);
        const cents = 25 * q + 10 * d + 5 * n + p;
        const text = (dollars: number, c: number) => `\\$${dollars}.${String(c).padStart(2, "0")}`;
        const money = (dollars: number, c: number): Pair => [text(dollars, c), text(dollars, c)];
        const coins = [
          ...Array<number>(bills).fill(100),
          ...Array<number>(q).fill(25),
          ...Array<number>(d).fill(10),
          ...Array<number>(n).fill(5),
          ...Array<number>(p).fill(1),
        ];
        const wrong: Wrong[] = [
          [money(bills + 1, cents), "That has one dollar too many.", "这多了 1 美元。"],
          [money(bills, cents + 10), "That has 10 cents too many.", "这多了 10 美分。"],
          [money(bills, cents >= 10 ? cents - 5 : cents + 5), "That counts one coin as 5 cents wrongly.", "有一枚硬币算错了 5 美分。"],
        ];
        return picked(
          rng,
          ["How much money is shown here?", "这里一共有多少钱？"],
          money(bills, cents),
          wrong,
          [
            [
              ["Count the bills", "数纸币"],
              [`${plural(bills, "dollar")}.`, `${bills} 美元。`],
            ],
            [
              ["Count the coins", "数硬币"],
              [`${cents} cents, so the amount is ${text(bills, cents)}.`, `${cents} 美分，所以钱数是 ${text(bills, cents)}。`],
            ],
          ],
          [
            `${text(bills, cents)} is $${Array(bills).fill("100").join(" + ")} + ${cents} = ${100 * bills + cents}$ cents, matching the bills and coins.`,
            `${text(bills, cents)} 是 $${Array(bills).fill("100").join(" + ")} + ${cents} = ${100 * bills + cents}$ 美分，和纸币、硬币一致。`,
          ],
          coinsFigure(coins),
        );
      },
      captioned(
        coinsFigure([100, 100, 25, 10]),
        "2 dollar bills, a quarter and a dime: \\$2.35.",
        "2 张 1 美元纸币、1 枚 25 美分和 1 枚 10 美分：\\$2.35。",
      ),
    ),
    earlyPoint(
      "money-word-problems",
      ["Money word problems", "关于钱的问题"],
      [
        "Ivy pays 1 dollar for a pencil that costs 65 cents. A dollar is 100 cents, so her change is $100 - 65 = 35$ cents.\n\nCheck: $65 + 35 = 100$.\n\n> **Watch out.** Change is what comes back, so subtract the price from 100. Do not answer with the price.",
        "艾薇用 1 美元买一支 65 美分的铅笔。1 美元是 100 美分，所以找回 $100 - 65 = 35$ 美分。\n\n检验：$65 + 35 = 100$。\n\n> **注意。** 找回的钱是用 100 减去价钱。不要把价钱当答案。",
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
          return solved(
            [
              `${name} pays for a ${item.en} with 1 dollar. The ${item.en} costs ${price} cents. How many cents does ${name} get back?`,
              `${name} 用 1 美元买${item.zh}，${item.zh}的价钱是 ${price} 美分。${name} 应该找回多少美分？`,
            ],
            answer,
            [
              [
                ["Change the dollar to cents", "把美元换成美分"],
                ["1 dollar is 100 cents.", "1 美元是 100 美分。"],
              ],
              [["Take away the price", "减去价钱"], ["Change is what is left:", "找回的是剩下的："], [`100 - ${price} = ${answer}`]],
            ],
            [`$${price} + ${answer} = 100$, the whole dollar.`, `$${price} + ${answer} = 100$，正好 1 美元。`],
            [
              [price, "That is the price, not the change.", "这是价钱，不是找回的钱。"],
              [100 + price, "That adds the price instead of taking it away.", "价钱应该减，却加了。"],
              [answer + 10, "That has 10 cents too many.", "这多了 10 美分。"],
            ],
            partWholeBarFigure([price, answer], 1),
          );
        }
        if (kind === 1) {
          const a = rng.int(11, 55);
          const b = rng.int(11, 40);
          const answer = a + b;
          return solved(
            [
              `A ${item.en} costs ${a} cents and a marker costs ${b} cents. How many cents do they cost together?`,
              `${item.zh}的价钱是 ${a} 美分，记号笔的价钱是 ${b} 美分。两样一共多少美分？`,
            ],
            answer,
            [
              [
                ["Decide what to do", "想好怎么算"],
                ["Two prices together means add.", "两样一共，就要相加。"],
              ],
              [["Add", "相加"], ["Add the prices:", "把价钱相加："], [`${a} + ${b} = ${answer}`]],
            ],
            [`$${answer} - ${b} = ${a}$.`, `$${answer} - ${b} = ${a}$。`],
            [
              [Math.abs(a - b), "That subtracts. Together means add.", "这是相减。一共应该相加。"],
              [answer + 10, "That has 10 cents too many.", "这多了 10 美分。"],
              [answer - 10, "That forgets the new ten from the ones.", "这忘了个位满十进的那个十。"],
            ],
            partWholeBarFigure([a, b], -1),
          );
        }
        const start = rng.int(10, 40);
        const spend = rng.int(2, start - 2);
        const answer = start - spend;
        return solved(
          [
            `${name} has ${start} dollars and spends ${spend} dollars on a book. How many dollars does ${name} have left?`,
            `${name} 有 ${start} 美元，买书用了 ${spend} 美元。${name} 还剩多少美元？`,
          ],
          answer,
          [
            [
              ["Decide what to do", "想好怎么算"],
              ["Spending makes the money less, so subtract.", "花钱会让钱变少，所以相减。"],
            ],
            [["Subtract", "相减"], ["Start minus what was spent:", "原来的钱减去花掉的："], [`${start} - ${spend} = ${answer}`]],
          ],
          [`$${answer} + ${spend} = ${start}$.`, `$${answer} + ${spend} = ${start}$。`],
          [
            [start + spend, "That adds. Spending makes the money less.", "这是相加。花钱会让钱变少。"],
            [spend, "That is what was spent, not what is left.", "这是花掉的钱，不是剩下的。"],
            [answer + 10, "That takes away 10 too few.", "这少减了 10。"],
          ],
          partWholeBarFigure([spend, answer], 1),
        );
      },
      captioned(
        partWholeBarFigure([65, 35], 1),
        "A dollar of 100 cents: 65 for the pencil, the change unknown.",
        "1 美元是 100 美分：铅笔 65，找回的未知。",
      ),
    ),
  ],
  [
    "Mom gives Nia 1 dollar bill and 3 dimes. That is 1 dollar and 30 cents, written \\$1.30.\n\nCheck: $100 + 30 = 130$ cents.\n\nIn this lesson we write amounts with dollars and cents and solve money stories.",
    "妈妈给妮娅 1 张 1 美元纸币和 3 枚 10 美分硬币。一共是 1 美元 30 美分，写作 \\$1.30。\n\n检验：$100 + 30 = 130$ 美分。\n\n本课我们用美元和美分写出钱数，并解决关于钱的问题。",
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
    {
      ...earlyPoint(
        "reading-marks-on-a-line-plot",
        ["Reading marks on a line plot", "读线图上的点"],
        [
          "In this line plot, there are 3 marks above the 5. Each mark is one pencil, so 3 pencils are 5 inches long.\n\nCheck: count the marks in that stack one by one: 1, 2, 3.\n\n> **Watch out.** The number under the stack is the length, not how many. Count the marks.",
          "这个线图中，5 的上方有 3 个点。每个点是一支铅笔，所以长 5 英寸的铅笔有 3 支。\n\n检验：把这一摞的点一个一个数：1、2、3。\n\n> **注意。** 下面的数是长度，不是个数。要数点。",
        ],
        (rng) => {
          const { values } = linePlotData(rng);
          const v = rng.pick(values);
          const answer = values.filter((x) => x === v).length;
          return solved(
            [
              `This line plot shows the lengths of some pencils, in inches. How many pencils are ${unitCount(v, inch)} long?`,
              `这个线图表示一些铅笔的长度（英寸）。长 ${v} 英寸的铅笔有多少支？`,
            ],
            answer,
            [
              [
                ["Find the length", "找到长度"],
                [`Find ${v} on the line.`, `在线上找到 ${v}。`],
              ],
              [
                ["Count the marks", "数点"],
                [
                  `There ${answer === 1 ? "is 1 mark" : `are ${answer} marks`} above it, one for each pencil.`,
                  `它上方有 ${answer} 个点，每个点是一支铅笔。`,
                ],
              ],
            ],
            [
              `All the marks together make ${values.length}, one for each pencil measured.`,
              `所有的点加起来是 ${values.length} 个，每支量过的铅笔一个。`,
            ],
            [
              [v, "That is the length, not the number of pencils.", "这是长度，不是铅笔的支数。"],
              [values.length, "That counts every mark on the plot, not just that stack.", "这数了图上所有的点，不只是那一摞。"],
              [answer + 1, "That is one mark too many.", "这多数了一个点。"],
            ],
            linePlotFigure(values),
          );
        },
      ),
      figure: gradeDrawings2["line-plots-of-lengths#reading-marks-on-a-line-plot"],
    },
    earlyPoint(
      "finding-the-most-common-length",
      ["The most common length", "最常见的长度"],
      [
        "The tallest stack has 4 marks, and it sits above the 7. So 7 inches is the most common length.\n\nCheck: every other stack has fewer than 4 marks.\n\n> **Watch out.** The answer is the length under the stack, 7, not the number of marks, 4.",
        "最高的一摞有 4 个点，在 7 的上方。所以 7 英寸是最常见的长度。\n\n检验：其他每一摞都不到 4 个点。\n\n> **注意。** 答案是这一摞下面的长度 7，不是点的个数 4。",
      ],
      (rng) => {
        const { values, top } = linePlotData(rng);
        return solved(
          [
            "This line plot shows the lengths of some pencils, in inches. Which length came up most often, in inches?",
            "这个线图表示一些铅笔的长度（英寸）。哪个长度出现的次数最多？（单位：英寸）",
          ],
          top,
          [
            [
              ["Find the tallest stack", "找最高的一摞"],
              ["The tallest stack has 4 marks.", "最高的一摞有 4 个点。"],
            ],
            [
              ["Read the length under it", "读它下面的长度"],
              [`It sits above the ${top}.`, `它在 ${top} 的上方。`],
            ],
          ],
          ["Every other stack has fewer than 4 marks.", "其他每一摞都不到 4 个点。"],
          [
            [4, "That is the number of marks, not the length.", "这是点的个数，不是长度。"],
            [values.length, "That counts all the marks.", "这数的是所有的点。"],
            [top === 9 ? 8 : top + 1, "That stack is not the tallest.", "那一摞不是最高的。"],
          ],
          linePlotFigure(values),
        );
      },
      captioned(
        linePlotFigure([4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8]),
        "A line plot with the tallest stack, 4 marks, above the 7.",
        "线图中最高的一摞有 4 个点，在 7 的上方。",
      ),
    ),
  ],
  [
    "A class measures their pencils and puts a mark above each length on a number line. Three pencils are 6 inches, so three marks stack above the 6.\n\nCheck: the number of marks equals the number of pencils measured.\n\nIn this lesson we read line plots of lengths measured in whole inches.",
    "全班量自己的铅笔，在数轴上每个长度的上方画一个点。有三支铅笔长 6 英寸，所以 6 的上方摞了三个点。\n\n检验：点的个数等于量过的铅笔的支数。\n\n本课我们读用整数英寸测量长度所画的线图。",
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
    {
      ...earlyPoint(
        "how-many-more-in-a-row",
        ["How many more in a row", "一行多多少"],
        [
          "Row A has 8 pictures and row B has 5. Line them up: 5 pairs match, and 3 are left over in row A. So row A has 3 more.\n\nCheck: $8 - 5 = 3$.\n\n> **Watch out.** How many more is the extra part, not the whole row. 8 is how many row A has.",
          "A 行有 8 个图案，B 行有 5 个。把它们对齐：5 对一样，A 行多出 3 个。所以 A 行多 3 个。\n\n检验：$8 - 5 = 3$。\n\n> **注意。** 多多少是多出来的部分，不是整行。8 是 A 行的个数。",
        ],
        (rng) => {
          const story = rng.pick(graphStories);
          const labels = ["A", "B", "C", "D"];
          const values = labels.map(() => rng.int(2, 11));
          const [i, j] = rng.sample([0, 1, 2, 3], 2) as [number, number];
          if (values[i] === values[j]) values[i] = (values[j] as number) + 1 > 11 ? (values[j] as number) - 1 : (values[j] as number) + 1;
          const vi = values[i] as number;
          const vj = values[j] as number;
          const [hi, lo] = vi > vj ? [i, j] : [j, i];
          const big = Math.max(vi, vj);
          const small = Math.min(vi, vj);
          const answer = big - small;
          return solved(
            [
              `${story.en} How many more ${story.thing} does row ${labels[hi]} have than row ${labels[lo]}?`,
              `${story.zh}${labels[hi]} 行比 ${labels[lo]} 行多多少${story.zhThing}？`,
            ],
            answer,
            [
              [
                ["Count each row", "数每一行"],
                [
                  `Row ${labels[hi]} has ${big} and row ${labels[lo]} has ${small}.`,
                  `${labels[hi]} 行有 ${big} 个，${labels[lo]} 行有 ${small} 个。`,
                ],
              ],
              [["Find the extra", "求多出的"], ["Subtract:", "相减："], [`${big} - ${small} = ${answer}`]],
            ],
            [
              `Count the dots of row ${labels[hi]} past the end of row ${labels[lo]}: ${answer}.`,
              `数 ${labels[hi]} 行比 ${labels[lo]} 行多出的点：${answer} 个。`,
            ],
            [
              [vi + vj, "That adds the rows instead of comparing them.", "这把两行加起来了，没有比较。"],
              [big, `That is row ${labels[hi]} alone, not the difference.`, `这只是 ${labels[hi]} 行的个数，不是差。`],
              [answer + 1, "That is one too many. Count again.", "多了 1，再数一遍。"],
            ],
            pictureGraphFigure(labels, values, 1),
          );
        },
      ),
      figure: gradeDrawings2["picture-graphs-of-single-units#how-many-more-in-a-row"],
    },
    {
      ...earlyPoint(
        "adding-rows-of-a-picture-graph",
        ["Adding rows of a picture graph", "把象形统计图的行加起来"],
        [
          "Rows A, B and C have 5, 7 and 4 pictures. Together that is $5 + 7 + 4 = 16$.\n\nCheck: add in another order, $7 + 4 = 11$ and $11 + 5 = 16$.\n\n> **Watch out.** Use only the rows the question names, and leave none of them out.",
          "A、B、C 三行分别有 5、7、4 个图案。合起来是 $5 + 7 + 4 = 16$。\n\n检验：换个顺序加，$7 + 4 = 11$，$11 + 5 = 16$。\n\n> **注意。** 只用题目说到的那几行，一行也不能漏。",
        ],
        (rng) => {
          const story = rng.pick(graphStories);
          const labels = ["A", "B", "C", "D"];
          const values = labels.map(() => rng.int(2, 10));
          const all = rng.bool();
          const [i, j] = rng.sample([0, 1, 2, 3], 2) as [number, number];
          const shown = all ? values : [values[i] as number, values[j] as number];
          const answer = shown.reduce((s, v) => s + v, 0);
          const total = values.reduce((s, v) => s + v, 0);
          const back = [...shown].reverse();
          return solved(
            all
              ? [`${story.en} How many ${story.thing} are there in all?`, `${story.zh}一共有多少${story.zhThing}？`]
              : [
                  `${story.en} How many ${story.thing} do rows ${labels[i]} and ${labels[j]} have together?`,
                  `${story.zh}${labels[i]} 行和 ${labels[j]} 行一共有多少${story.zhThing}？`,
                ],
            answer,
            [
              [
                ["Count the rows you need", "数需要的行"],
                [
                  all ? `All four rows: ${shown.join(", ")}.` : `Row ${labels[i]} has ${shown[0]} and row ${labels[j]} has ${shown[1]}.`,
                  all ? `四行都要：${shown.join("、")}。` : `${labels[i]} 行有 ${shown[0]} 个，${labels[j]} 行有 ${shown[1]} 个。`,
                ],
              ],
              [["Add", "相加"], ["Add them up:", "把它们加起来："], [`${shown.join(" + ")} = ${answer}`]],
            ],
            [`Add in another order: $${back.join(" + ")} = ${answer}$.`, `换个顺序加：$${back.join(" + ")} = ${answer}$。`],
            all
              ? [
                  [answer - (values[3] as number), "That leaves out the last row.", "这漏了最后一行。"],
                  [answer + 1, "That is one too many. Count again.", "多了 1，再数一遍。"],
                  [4, "That counts the rows, not the dots.", "这数的是行数，不是点数。"],
                ]
              : [
                  [
                    Math.abs((values[i] as number) - (values[j] as number)),
                    "That compares the rows instead of adding them.",
                    "这是比较两行，没有相加。",
                  ],
                  [total, "That adds every row, not just the two named.", "这把所有的行都加了，不只是说到的两行。"],
                  [answer + 1, "That is one too many. Count again.", "多了 1，再数一遍。"],
                ],
            pictureGraphFigure(labels, values, 1),
          );
        },
      ),
      figure: gradeDrawings2["picture-graphs-of-single-units#adding-rows-of-a-picture-graph"],
    },
  ],
  [
    "Four friends count their stickers and draw one dot for each sticker in a row with their letter. Row C is the longest, so C has the most stickers.\n\nCheck: count the dots in row C and in each other row.\n\nIn this lesson we read picture graphs where each picture is one thing, and compare and add their rows.",
    "四个朋友数自己的贴纸，在写着自己字母的那一行里，每张贴纸画一个点。C 行最长，所以 C 的贴纸最多。\n\n检验：数一数 C 行和其他每行的点。\n\n本课我们读每个图案代表一个的象形统计图，并比较和相加各行。",
  ],
);

const readingBarGraphs = earlyTopic(
  "reading-bar-graphs",
  ["Bar Graphs With Single Units", "读条形图"],
  ["Read a bar graph whose scale counts by ones, and use it to add and compare.", "读刻度按 1 增加的条形图，并用它来相加和比较。"],
  ["first-bar-graphs"],
  ["2.MD.D.10"],
  [
    {
      ...earlyPoint(
        "the-value-of-a-bar-by-ones",
        ["The value of a bar", "一个条的值"],
        [
          "Look at the top of bar Y and follow the line across to the scale. It lines up with 9, so bar Y is 9.\n\nCheck: count the steps of the scale up to the top of bar Y: 9 of them.\n\n> **Watch out.** Read across from the top of the bar. Do not count the bars or read the tallest one.",
          "看条 Y 的顶端，顺着线横着看到刻度。它对着 9，所以条 Y 是 9。\n\n检验：数刻度一格一格到条 Y 顶端：9 格。\n\n> **注意。** 要从条的顶端横着读。不要数有几个条，也不要读最高的那个条。",
        ],
        (rng) => {
          const labels = ["A", "B", "C", "D"];
          const values = labels.map(() => rng.int(1, 10));
          const i = rng.int(0, 3);
          const answer = values[i] as number;
          return solved(
            [`What is the value of bar ${labels[i]} in this graph?`, `这个图中条 ${labels[i]} 的值是多少？`],
            answer,
            [
              [
                ["Find the top", "找顶端"],
                [`Look at the top of bar ${labels[i]}.`, `看条 ${labels[i]} 的顶端。`],
              ],
              [
                ["Read across", "横着读"],
                [`It lines up with ${answer} on the scale.`, `它对着刻度 ${answer}。`],
              ],
            ],
            [`Count the steps of the scale up to the top: ${answer}.`, `一格一格数到顶端：${answer} 格。`],
            [
              [Math.max(...values), "That is the tallest bar, not this one.", "这是最高的条，不是这一条。"],
              [answer + 1, "That reads the line just above the top.", "这读的是顶端上面那条线。"],
              [
                answer === 1 ? answer + 2 : answer - 1,
                answer === 1 ? "That reads a line above the top." : "That reads the line just below the top.",
                answer === 1 ? "这读的是顶端上面的线。" : "这读的是顶端下面那条线。",
              ],
            ],
            barGraphFigure(labels, values, 1),
          );
        },
      ),
      figure: gradeDrawings2["reading-bar-graphs#the-value-of-a-bar-by-ones"],
    },
    earlyPoint(
      "adding-and-comparing-bars",
      ["Adding and comparing bars", "把条相加和比较"],
      [
        "Bars A and C show 7 and 9. Together they make $7 + 9 = 16$. Bar C is greater by $9 - 7 = 2$.\n\nCheck: count the squares between the tops of the two bars: 2.\n\n> **Watch out.** Read the question. In all means add; how much greater means subtract.",
        "条 A 和条 C 分别是 7 和 9。合起来是 $7 + 9 = 16$。条 C 比条 A 大 $9 - 7 = 2$。\n\n检验：数两个条顶端之间的格子：2 格。\n\n> **注意。** 看清问题。一共要加；大多少要减。",
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
        const big = Math.max(vi, vj);
        const small = Math.min(vi, vj);
        return solved(
          adds
            ? [`What is the total of bars ${labels[i]} and ${labels[j]}?`, `条 ${labels[i]} 和条 ${labels[j]} 的总和是多少？`]
            : [`How much greater is bar ${labels[hi]} than bar ${labels[lo]}?`, `条 ${labels[hi]} 比条 ${labels[lo]} 大多少？`],
          answer,
          [
            [
              ["Read the bars", "读出两个条"],
              [`The bars show ${vi} and ${vj}.`, `这两个条分别是 ${vi} 和 ${vj}。`],
            ],
            adds
              ? [["Add", "相加"], ["The total:", "总和："], [`${vi} + ${vj} = ${answer}`]]
              : [["Subtract", "相减"], ["Bigger minus smaller:", "大的减小的："], [`${big} - ${small} = ${answer}`]],
          ],
          adds
            ? [`$${answer} - ${vj} = ${vi}$.`, `$${answer} - ${vj} = ${vi}$。`]
            : [`Count the squares between the tops of the two bars: ${answer}.`, `数两个条顶端之间的格子：${answer} 格。`],
          adds
            ? [
                [big - small, "That subtracts. Total means add.", "这是相减。总和要相加。"],
                [vi, "That is only one bar.", "这只是一个条。"],
                [answer + 1, "That is one too many. Read the bars again.", "多了 1，再读一遍。"],
              ]
            : [
                [vi + vj, "That adds. How much greater means subtract.", "这是相加。大多少要相减。"],
                [big, "That is the bigger bar, not the difference.", "这是较大的条，不是差。"],
                [answer + 1, "That is one too many. Count the squares again.", "多了 1，再数一遍格子。"],
              ],
          barGraphFigure(labels, values, 1),
        );
      },
      captioned(
        barGraphFigure(["A", "B", "C"], [7, 4, 9], 1),
        "Bars of 7, 4 and 9: A and C make 16, and C is 2 more.",
        "条形是 7、4、9：A 和 C 合起来是 16，C 多 2。",
      ),
    ),
  ],
  [
    "A class counts pets: 6 dogs, 4 cats and 2 fish. The bar for dogs reaches 6 on the scale, the cats' bar reaches 4, and the fish bar reaches 2.\n\nCheck: $6 + 4 + 2 = 12$ pets in all.\n\nIn this lesson we read bar graphs whose scale counts by ones, and add and compare the bars.",
    "全班数宠物：6 只狗、4 只猫、2 条鱼。狗的条到刻度 6，猫的条到 4，鱼的条到 2。\n\n检验：一共 $6 + 4 + 2 = 12$ 只宠物。\n\n本课我们读刻度按 1 增加的条形图，并把条相加和比较。",
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

/** polygonName gives a polygon's name as an answer option. */
const polygonName = (k: PolygonKind): Pair => [`A ${k.en}`, k.zh];

/** polygonWrongs gives the other shape names, each with why it does not fit a shape of `kind.sides` sides. */
const polygonWrongs = (kind: PolygonKind): Wrong[] =>
  polygonKinds
    .filter((k) => k !== kind)
    .map((k) => [
      polygonName(k),
      `A ${k.en} has ${k.sides} sides, but this shape has ${kind.sides}.`,
      `${k.zh}有 ${k.sides} 条边，这个图形有 ${kind.sides} 条。`,
    ]);

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
    {
      ...earlyPoint(
        "the-name-of-a-drawn-shape",
        ["The name of a drawn shape", "说出图形的名称"],
        [
          "This shape has 5 straight sides: count them, 1, 2, 3, 4, 5. Five sides make a pentagon. Three sides make a triangle, four a quadrilateral and six a hexagon.\n\nCheck: count the corners too. There are 5, the same as the sides.\n\n> **Watch out.** A tilted or stretched shape keeps its name. Count the sides; do not go by the look.",
          "这个图形有 5 条直边：数一数，1、2、3、4、5。五条边是五边形。三条边是三角形，四条边是四边形，六条边是六边形。\n\n检验：再数一数角，也是 5 个，和边一样多。\n\n> **注意。** 图形斜着放或被拉长，名称不变。要数边，不要只看样子。",
        ],
        (rng) => {
          const kind = rng.pick(polygonKinds);
          return picked(
            rng,
            ["What is this shape called?", "这个图形叫什么？"],
            polygonName(kind),
            polygonWrongs(kind),
            [
              [
                ["Count the sides", "数边"],
                [`Go around the shape once: ${kind.sides} straight sides.`, `绕图形一周：${kind.sides} 条直边。`],
              ],
              [
                ["Name it", "说名称"],
                [`${kind.sides} sides make a ${kind.en}.`, `${kind.sides} 条边是${kind.zh}。`],
              ],
            ],
            [`Count the corners too: ${kind.sides}, the same as the sides.`, `再数角：${kind.sides} 个，和边一样多。`],
            polygonIn(rng, kind),
          );
        },
      ),
      figure: gradeDrawings2["naming-polygons-by-their-sides#the-name-of-a-drawn-shape"],
    },
    {
      ...earlyPoint(
        "the-name-from-the-number-of-sides",
        ["The name from the number of sides", "由边数说出名称"],
        [
          "A shape has 5 angles. Each corner joins two sides, so a shape has as many sides as angles: 5 sides. That makes it a pentagon.\n\nCheck: number the corners of a pentagon, 1 to 5, and count its sides, also 5.\n\n> **Watch out.** Angles and sides come in the same number. 5 angles is not a hexagon.",
          "一个图形有 5 个角。每个角连着两条边，所以图形的边和角一样多：5 条边。所以它是五边形。\n\n检验：给五边形的角编号，1 到 5，再数它的边，也是 5 条。\n\n> **注意。** 角和边的个数一样。5 个角不是六边形。",
        ],
        (rng) => {
          const who = rng.pick(earlyNames);
          const kind = rng.pick(polygonKinds);
          const byAngles = rng.bool();
          return picked(
            rng,
            byAngles
              ? [
                  `${who} draws a closed shape with straight sides and exactly ${kind.sides} angles. What is it?`,
                  `${who} 画了一个由直边围成的封闭图形，它正好有 ${kind.sides} 个角。它是什么图形？`,
                ]
              : [
                  `${who} draws a closed shape with exactly ${kind.sides} straight sides. What is it?`,
                  `${who} 画了一个正好有 ${kind.sides} 条直边的封闭图形。它是什么图形？`,
                ],
            polygonName(kind),
            polygonWrongs(kind),
            [
              [
                ["Find the sides", "求边数"],
                byAngles
                  ? [
                      `Angles and sides come in the same number, so it has ${kind.sides} sides.`,
                      `角和边一样多，所以它有 ${kind.sides} 条边。`,
                    ]
                  : [`It has ${kind.sides} sides.`, `它有 ${kind.sides} 条边。`],
              ],
              [
                ["Name it", "说名称"],
                [`${kind.sides} sides make a ${kind.en}.`, `${kind.sides} 条边是${kind.zh}。`],
              ],
            ],
            [
              `A ${kind.en} has ${kind.sides} sides and ${kind.sides} angles, as the shape does.`,
              `${kind.zh}有 ${kind.sides} 条边和 ${kind.sides} 个角，和这个图形一样。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["naming-polygons-by-their-sides#the-name-from-the-number-of-sides"],
    },
  ],
  [
    "A kite has 4 straight sides, and a road sign for stop has 8. We name a shape by counting its sides.\n\nCheck: a shape with 3 sides is a triangle, whatever way it points.\n\nIn this lesson we name triangles, quadrilaterals, pentagons and hexagons by their sides.",
    "风筝有 4 条直边，停车标志有 8 条。我们数边来给图形命名。\n\n检验：有 3 条边的图形是三角形，不管它朝哪边。\n\n本课我们按边数说出三角形、四边形、五边形和六边形。",
  ],
);

const countingSidesAndAngles = earlyTopic(
  "counting-sides-and-angles",
  ["Counting Sides and Angles", "数边和角"],
  ["Count the sides and angles of a shape, and add them across several shapes.", "数出图形的边和角，并把几个图形的边或角加起来。"],
  ["naming-polygons-by-their-sides"],
  ["2.G.A.1"],
  [
    {
      ...earlyPoint(
        "angles-of-a-drawn-shape",
        ["Angles of a drawn shape", "图形的角"],
        [
          "Start at one corner of this hexagon and mark it. Go around: 1, 2, 3, 4, 5, 6, and you are back at the mark. So it has 6 angles.\n\nCheck: count its sides as well. There are 6, the same as the angles.\n\n> **Watch out.** Stop when you reach the marked corner. Counting it again gives one too many.",
          "从这个六边形的一个角开始，做个记号。绕一周：1、2、3、4、5、6，回到记号处。所以它有 6 个角。\n\n检验：再数一数边，也是 6 条，和角一样多。\n\n> **注意。** 回到做记号的角就停下。再数一次就多了一个。",
        ],
        (rng) => {
          const kind = rng.pick(polygonKinds);
          const asksAngles = rng.bool();
          const [part, other] = asksAngles ? (["angles", "sides"] as const) : (["sides", "angles"] as const);
          const zhPart = asksAngles ? "个角" : "条边";
          const zhOther = asksAngles ? "条边" : "个角";
          return solved(
            asksAngles
              ? ["How many angles does this shape have?", "这个图形有几个角？"]
              : ["How many sides does this shape have?", "这个图形有几条边？"],
            kind.sides,
            [
              [
                ["Mark a start", "做记号"],
                ["Mark one corner to begin at.", "在一个角上做记号，从这里开始。"],
              ],
              [
                ["Go around once", "绕一周"],
                [
                  `Count the ${part} until you are back at the mark: ${kind.sides}.`,
                  `数${zhPart.slice(1)}，回到记号处：${kind.sides} ${zhPart}。`,
                ],
              ],
            ],
            [`Count the ${other} too: ${kind.sides}, the same number.`, `再数${zhOther.slice(1)}：${kind.sides} ${zhOther}，个数一样。`],
            [
              [kind.sides + 1, "That counts the starting corner twice.", "这把开始的那个角数了两次。"],
              [kind.sides * 2, "That adds the sides and the angles together.", "这把边和角加在一起了。"],
              [kind.sides - 1, "That misses one. Go all the way around.", "这漏了一个。要绕满一周。"],
            ],
            polygonIn(rng, kind),
          );
        },
      ),
      figure: gradeDrawings2["counting-sides-and-angles#angles-of-a-drawn-shape"],
    },
    {
      ...earlyPoint(
        "sides-of-several-shapes",
        ["Sides of several shapes", "几个图形的边数"],
        [
          "A triangle, a quadrilateral and a pentagon have 3, 4 and 5 sides. In all that is $3 + 4 + 5 = 12$ sides.\n\nCheck: add in another order, $5 + 4 = 9$ and $9 + 3 = 12$.\n\n> **Watch out.** Add the sides, not the shapes. 3 shapes is not 3 sides.",
          "三角形、四边形和五边形分别有 3、4、5 条边。一共 $3 + 4 + 5 = 12$ 条边。\n\n检验：换个顺序加，$5 + 4 = 9$，$9 + 3 = 12$。\n\n> **注意。** 要加边数，不是图形个数。3 个图形不是 3 条边。",
        ],
        (rng) => {
          const [a, b] = rng.sample(polygonKinds, 2) as [PolygonKind, PolygonKind];
          const na = rng.int(1, 3);
          const nb = rng.int(1, 3);
          const sa = na * a.sides;
          const sb = nb * b.sides;
          const answer = sa + sb;
          const who = rng.pick(earlyNames);
          const many = (n: number, k: PolygonKind) => `${n} ${k.en}${n === 1 ? "" : "s"}`;
          const list = (n: number, s: number) => Array<string>(n).fill(`${s}`).join(" + ");
          return solved(
            [
              `${who} draws ${many(na, a)} and ${many(nb, b)}. How many sides are there in all?`,
              `${who} 画了 ${na} 个${a.zh}和 ${nb} 个${b.zh}。一共有多少条边？`,
            ],
            answer,
            [
              [
                [`Sides of the ${a.en}${na === 1 ? "" : "s"}`, `${a.zh}的边`],
                [`Each has ${a.sides}:`, `每个有 ${a.sides} 条：`],
                [`${list(na, a.sides)} = ${sa}`],
              ],
              [
                [`Sides of the ${b.en}${nb === 1 ? "" : "s"}`, `${b.zh}的边`],
                [`Each has ${b.sides}:`, `每个有 ${b.sides} 条：`],
                [`${list(nb, b.sides)} = ${sb}`],
              ],
              [["Add", "相加"], ["All the sides:", "所有的边："], [`${sa} + ${sb} = ${answer}`]],
            ],
            [
              `$${answer} - ${sb} = ${sa}$, the sides of the ${a.en}${na === 1 ? "" : "s"}.`,
              `$${answer} - ${sb} = ${sa}$，正是${a.zh}的边数。`,
            ],
            [
              [na + nb, "That counts the shapes, not their sides.", "这数的是图形的个数，不是边数。"],
              [a.sides + b.sides, "That counts one of each shape. Use every shape.", "这每种只算了一个。每个图形都要算。"],
              [answer + 1, "That is one too many. Add again.", "多了 1，再加一遍。"],
            ],
          );
        },
      ),
      figure: gradeDrawings2["counting-sides-and-angles#sides-of-several-shapes"],
    },
  ],
  [
    "A window pane has 4 sides and 4 corners. Each corner, where two sides meet, is an angle.\n\nCheck: going around the pane you pass a side, then a corner, again and again, 4 of each.\n\nIn this lesson we count sides and angles, and add the sides of several shapes.",
    "一块窗玻璃有 4 条边和 4 个角。两条边相交的地方就是一个角。\n\n检验：绕窗玻璃一周，经过一条边，再经过一个角，这样反复，各 4 个。\n\n本课我们数边和角，并把几个图形的边数加起来。",
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
        "A cube has 6 square faces: top, bottom, front, back, left and right. If 2 of them are painted, $6 - 2 = 4$ are not.\n\nCheck: $4 + 2 = 6$, all the faces.\n\n> **Watch out.** The faces at the back are hidden but still there. A cube always has 6 faces, not just the 3 you see.",
        "正方体有 6 个正方形的面：上、下、前、后、左、右。如果涂了其中 2 个，没涂的有 $6 - 2 = 4$ 个。\n\n检验：$4 + 2 = 6$，正好是所有的面。\n\n> **注意。** 背后的面看不见，但它们还在。正方体总是有 6 个面，不只是看得见的 3 个。",
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
        return solved(
          [
            `${who} has a ${box.en} shaped like this cube and paints ${painted} of its faces. How many faces are not painted?`,
            `${who} 有一个形状像这个正方体的${box.zh}，给它的 ${painted} 个面涂了颜色。有多少个面没有涂？`,
          ],
          answer,
          [
            [
              ["Count all the faces", "数所有的面"],
              ["A cube has 6 faces, the hidden ones too.", "正方体有 6 个面，看不见的也算。"],
            ],
            [["Take away the painted ones", "去掉涂了的"], ["Subtract:", "相减："], [`6 - ${painted} = ${answer}`]],
          ],
          [`$${answer} + ${painted} = 6$, all the faces.`, `$${answer} + ${painted} = 6$，正好是所有的面。`],
          [
            [3 - painted, "That uses only the 3 faces you can see.", "这只算了看得见的 3 个面。"],
            [8 - painted, "A cube has 8 corners but only 6 faces.", "正方体有 8 个顶点，但只有 6 个面。"],
            [12 - painted, "A cube has 12 edges but only 6 faces.", "正方体有 12 条棱，但只有 6 个面。"],
            [painted, "That is the painted faces, not the ones left.", "这是涂了的面，不是剩下的面。"],
          ],
          cubeFigure(),
        );
      },
      captioned(
        cubeFigure(),
        "A cube: 3 faces show and 3 are hidden at the back, 6 in all.",
        "正方体：看得见 3 个面，背后藏着 3 个，一共 6 个。",
      ),
    ),
    earlyPoint(
      "edges-and-corners-of-cubes",
      ["Edges and corners of cubes", "正方体的棱和顶点"],
      [
        "A cube has 4 edges around the top, 4 around the bottom and 4 going up: $4 + 4 + 4 = 12$ edges. It has 4 corners on top and 4 below: 8 corners.\n\nCheck: 2 cubes have $8 + 8 = 16$ corners, and $12 + 12 = 24$ edges.\n\n> **Watch out.** Edges are the lines and corners are the points. A cube has 12 edges but only 8 corners.",
        "正方体上面一圈有 4 条棱，下面一圈有 4 条，竖着的有 4 条：$4 + 4 + 4 = 12$ 条棱。上面有 4 个顶点，下面有 4 个：8 个顶点。\n\n检验：2 个正方体有 $8 + 8 = 16$ 个顶点，$12 + 12 = 24$ 条棱。\n\n> **注意。** 棱是线，顶点是点。正方体有 12 条棱，但只有 8 个顶点。",
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
        return solved(
          [
            `${who} has ${cubes} cubes that are not touching. How many ${parts.en} do they have in all?`,
            `${who} 有 ${cubes} 个没有挨在一起的正方体。它们一共有多少${parts.zh}？`,
          ],
          answer,
          [
            [
              ["One cube", "一个正方体"],
              [`One cube has ${parts.each} ${parts.en}.`, `一个正方体有 ${parts.each} ${parts.zh}。`],
            ],
            [
              ["Add for each cube", "每个正方体加一次"],
              [`Add ${parts.each} once for each of the ${cubes} cubes:`, `${cubes} 个正方体，就把 ${parts.each} 加 ${cubes} 次：`],
              [`${sum} = ${answer}`],
            ],
          ],
          [
            `Count on by ${parts.each}s from ${parts.each}: ${Array.from({ length: cubes }, (_, k) => (k + 1) * parts.each).join(", ")}.`,
            `从 ${parts.each} 开始，每次加 ${parts.each}：${Array.from({ length: cubes }, (_, k) => (k + 1) * parts.each).join("、")}。`,
          ],
          [
            [
              cubes + parts.each,
              "That adds the number of cubes once. Add the parts for every cube.",
              "这只是把正方体个数加了一次。每个正方体的都要加。",
            ],
            [parts.each, "That is just one cube.", "这只是一个正方体的。"],
            [answer + parts.each, "That counts one cube too many.", "这多算了一个正方体。"],
          ],
          cubeFigure(),
        );
      },
      captioned(
        cubeFigure(),
        "A cube: 4 edges on top, 4 on the bottom and 4 going up, with 8 corners.",
        "正方体：上面 4 条棱，下面 4 条，竖着 4 条，有 8 个顶点。",
      ),
    ),
  ],
  [
    "A die is a cube. It has a face with each number from 1 to 6, so it has 6 faces. Every face is a square.\n\nCheck: roll it and you can see at most 3 faces; the other 3 are hidden.\n\nIn this lesson we count the faces, edges and corners of cubes.",
    "骰子是一个正方体。它的每个面上分别是 1 到 6，所以它有 6 个面。每个面都是正方形。\n\n检验：掷出去时最多能看到 3 个面，另外 3 个藏着。\n\n本课我们数正方体的面、棱和顶点。",
  ],
);

const rowsAndColumnsOfSquares = earlyTopic(
  "rows-and-columns-of-squares",
  ["Rows and Columns of Squares", "方格的行和列"],
  ["Cut a rectangle into rows and columns of equal squares, and count them.", "把长方形分成若干行和列的相同方格，并数出个数。"],
  ["arrays-and-repeated-addition"],
  ["2.G.A.2"],
  [
    {
      ...earlyPoint(
        "counting-squares-in-a-rectangle",
        ["Counting squares in a rectangle", "数长方形里的方格"],
        [
          "This rectangle has 3 rows with 5 squares in each row. Add 5 once for each row: $5 + 5 + 5 = 15$ squares.\n\nCheck: count by columns. There are 5 columns of 3, and $3 + 3 + 3 + 3 + 3 = 15$.\n\n> **Watch out.** Rows plus columns, $3 + 5 = 8$, is not the number of squares.",
          "这个长方形有 3 行，每行 5 个方格。有几行就加几次 5：$5 + 5 + 5 = 15$ 个方格。\n\n检验：按列数。有 5 列，每列 3 个，$3 + 3 + 3 + 3 + 3 = 15$。\n\n> **注意。** 行数加列数，$3 + 5 = 8$，不是方格的个数。",
        ],
        (rng) => {
          const rows = rng.int(2, 5);
          const columns = rng.int(2, 6);
          const total = rows * columns;
          const shaded = rng.bool() ? total : rng.int(1, total - 1);
          const sum = Array(rows).fill(`${columns}`).join(" + ");
          const byColumns = Array(columns).fill(`${rows}`).join(" + ");
          return shaded === total
            ? solved(
                ["How many squares is this rectangle cut into?", "这个长方形被分成了多少个方格？"],
                total,
                [
                  [
                    ["Count one row", "数一行"],
                    [`There are ${rows} rows with ${columns} squares in each.`, `有 ${rows} 行，每行 ${columns} 个方格。`],
                  ],
                  [
                    ["Add the rows", "把各行加起来"],
                    [`Add ${columns} once for each row:`, `有几行就加几次 ${columns}：`],
                    [`${sum} = ${total}`],
                  ],
                ],
                [`Count by columns: $${byColumns} = ${total}$.`, `按列数：$${byColumns} = ${total}$。`],
                [
                  [rows + columns, "That adds the rows and columns, not the squares.", "这是行数加列数，不是方格数。"],
                  [
                    2 * (rows + columns),
                    "That is the length around the edge, not the squares inside.",
                    "这是周围一圈的长度，不是里面的方格。",
                  ],
                  [total + columns, "That adds one row too many.", "这多加了一行。"],
                ],
                gridFigure(rows, columns),
              )
            : solved(
                ["How many squares of this rectangle are not shaded?", "这个长方形有多少个方格没有涂色？"],
                total - shaded,
                [
                  [
                    ["Count all the squares", "数所有的方格"],
                    [`${rows} rows of ${columns}:`, `${rows} 行，每行 ${columns} 个：`],
                    [`${sum} = ${total}`],
                  ],
                  [
                    ["Take away the shaded", "去掉涂色的"],
                    [`${shaded} are shaded:`, `涂色的有 ${shaded} 个：`],
                    [`${total} - ${shaded} = ${total - shaded}`],
                  ],
                ],
                [
                  `$${total - shaded} + ${shaded} = ${total}$, all the squares.`,
                  `$${total - shaded} + ${shaded} = ${total}$，正好是所有的方格。`,
                ],
                [
                  [shaded, "That is the shaded squares, not the others.", "这是涂色的方格，不是没涂的。"],
                  [total, "That is all the squares. Take away the shaded ones.", "这是所有的方格。要去掉涂色的。"],
                  [total - shaded + 1, "That is one too many. Count again.", "多了 1，再数一遍。"],
                ],
                gridFigure(rows, columns, shaded),
              );
        },
      ),
      figure: gradeDrawings2["rows-and-columns-of-squares#counting-squares-in-a-rectangle"],
    },
    earlyPoint(
      "cutting-a-tray-into-pieces",
      ["Cutting a tray into pieces", "把一盘切成小块"],
      [
        "A tray is cut into 3 rows with 4 pieces in each row. Add 4 once for each row: $4 + 4 + 4 = 12$ pieces.\n\nCheck: count by columns, 4 columns of 3: $3 + 3 + 3 + 3 = 12$.\n\n> **Watch out.** Add the 4 three times, once for each row. $3 + 4 = 7$ adds the rows and the pieces in a row.",
        "一盘被切成 3 行，每行 4 块。有几行就加几次 4：$4 + 4 + 4 = 12$ 块。\n\n检验：按列数，4 列，每列 3 块：$3 + 3 + 3 + 3 = 12$。\n\n> **注意。** 4 要加三次，每行一次。$3 + 4 = 7$ 是把行数和每行的块数加在一起了。",
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
        const byColumns = Array(columns).fill(`${rows}`).join(" + ");
        return solved(
          [
            `${who} cuts a ${food.en} into ${rows} rows with ${columns} pieces in each row. How many pieces are there?`,
            `${who} 把一${food.many}${food.zh}切成 ${rows} 行，每行 ${columns} 块。一共有多少块？`,
          ],
          answer,
          [
            [
              ["Picture the rows", "想象各行"],
              [`${rows} rows, each with ${columns} pieces.`, `${rows} 行，每行 ${columns} 块。`],
            ],
            [
              ["Add the rows", "把各行加起来"],
              [`Add ${columns} once for each row:`, `有几行就加几次 ${columns}：`],
              [`${sum} = ${answer}`],
            ],
          ],
          [`Count by columns: $${byColumns} = ${answer}$.`, `按列数：$${byColumns} = ${answer}$。`],
          [
            [rows + columns, "That adds the rows and the pieces in one row.", "这是把行数和一行的块数加在一起了。"],
            [answer + columns, "That adds one row too many.", "这多加了一行。"],
            [answer - columns, "That leaves out one row.", "这漏了一行。"],
          ],
        );
      },
      captioned(gridFigure(3, 4), "A tray cut into 3 rows of 4 pieces: 12 in all.", "一盘切成 3 行，每行 4 块：一共 12 块。"),
    ),
  ],
  [
    "A chocolate bar is marked into little squares: 2 rows with 4 squares in each. Snap off a row and you hold 4 squares.\n\nCheck: $4 + 4 = 8$ squares in the whole bar.\n\nIn this lesson we cut rectangles into rows and columns of equal squares and count them.",
    "一块巧克力被分成小方格：2 行，每行 4 格。掰下一行，手里就有 4 格。\n\n检验：整块有 $4 + 4 = 8$ 格。\n\n本课我们把长方形分成行和列的相同方格，并数出个数。",
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

/** partsPair gives partsName as an English and Chinese pair. */
const partsPair = (shaded: number, parts: number): Pair => {
  const name = partsName(shaded, parts);
  return [name.en, name["zh-CN"]];
};

/** shareWord gives the English plural for shares of a whole cut into `parts`, such as thirds. */
const shareWord = (parts: number): string => partsName(2, parts).en.split(" ")[1] as string;

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
        "This pizza is cut into 3 equal shares, so the shares are thirds. 2 of them are shaded, so two thirds is shaded.\n\nCheck: the share that is not shaded is one third, and two thirds and one third make three thirds, the whole pizza.\n\n> **Watch out.** Name the shares by how many there are in all, 3, not by how many are shaded, 2.",
        "这个披萨被平均分成 3 份，每份是三分之一。涂了其中 2 份，所以涂色的部分是三分之二。\n\n检验：没涂的一份是三分之一，三分之二和三分之一合起来是三分之三，正好是整个披萨。\n\n> **注意。** 名称看一共分成几份（3 份），不是看涂了几份（2 份）。",
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
        const pool: readonly (readonly [number, number])[] = [
          [1, 2],
          [1, 3],
          [2, 3],
          [1, 4],
          [2, 4],
          [3, 4],
          [shaded, parts + 1 > 4 ? 2 : parts + 1],
        ];
        const seen = new Set<string>([`${shaded}/${parts}`]);
        const wrong: Wrong[] = [];
        for (const [s, p] of rng.shuffle(pool)) {
          if (seen.has(`${s}/${p}`) || s >= p || wrong.length === 3) continue;
          seen.add(`${s}/${p}`);
          wrong.push(
            p === parts
              ? [
                  partsPair(s, p),
                  `That is ${s} shaded ${s === 1 ? "share" : "shares"}, but ${shaded} ${shaded === 1 ? "is" : "are"} shaded.`,
                  `那是涂了 ${s} 份，但这里涂了 ${shaded} 份。`,
                ]
              : [
                  partsPair(s, p),
                  `That is for ${p} equal shares, but this ${object.en} has ${parts}.`,
                  `那是平均分成 ${p} 份的，这个${object.zh}分成了 ${parts} 份。`,
                ],
          );
        }
        const figure = object.round ? slicedCircleFigure(parts, shaded) : sharedRectangle(parts, shaded);
        const rest = parts - shaded;
        return picked(
          rng,
          [`This ${object.en} is cut into equal shares. How much of it is shaded?`, `${object.zh}被平均分了。涂色的部分占多少？`],
          partsPair(shaded, parts),
          wrong,
          [
            [
              ["Count all the shares", "数一共几份"],
              [
                `There are ${parts} equal shares, so they are ${shareWord(parts)}.`,
                `一共平均分成 ${parts} 份，每份是${partsName(1, parts)["zh-CN"]}。`,
              ],
            ],
            [
              ["Count the shaded shares", "数涂色的份"],
              [
                `${shaded} ${shaded === 1 ? "is" : "are"} shaded, so ${partsName(shaded, parts).en} is shaded.`,
                `涂了 ${shaded} 份，所以涂色的部分是${partsName(shaded, parts)["zh-CN"]}。`,
              ],
            ],
          ],
          [
            `The rest is ${partsName(rest, parts).en}, and ${partsName(shaded, parts).en} and ${partsName(rest, parts).en} make ${parts} ${shareWord(parts)}, the whole.`,
            `剩下的是${partsName(rest, parts)["zh-CN"]}，${shaded} 份和 ${rest} 份合起来是 ${parts} 份，正好是整体。`,
          ],
          figure,
        );
      },
      captioned(
        slicedCircleFigure(3, 2),
        "A pizza cut into 3 equal shares, 2 of them shaded: two thirds.",
        "披萨平均分成 3 份，涂了 2 份：三分之二。",
      ),
    ),
    earlyPoint(
      "shares-in-a-whole",
      ["Shares in a whole", "整体里的份数"],
      [
        "A pie is cut into fourths, so the whole pie is 4 fourths. Eat 1 of them and $4 - 1 = 3$ fourths are left.\n\nCheck: 3 fourths left and 1 fourth eaten make $3 + 1 = 4$ fourths, the whole pie.\n\n> **Watch out.** The name tells how many shares make the whole: 2 halves, 3 thirds or 4 fourths.",
        "一个馅饼被平均分成 4 份，每份是四分之一，整个馅饼是 4 份。吃掉 1 份，还剩 $4 - 1 = 3$ 份。\n\n检验：剩下 3 份，吃掉 1 份，$3 + 1 = 4$ 份，正好是整个馅饼。\n\n> **注意。** 整体分成几份，名称就是几分之一：2 份是二分之一，3 份是三分之一，4 份是四分之一。",
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
        const many = shareWord(parts);
        const zhShare = partsName(1, parts)["zh-CN"];
        return solved(
          [
            `${who} cuts a ${food.en} into ${many} and eats ${eaten} of the ${many}. How many of the ${many} are left?`,
            `${who} 把一个${food.zh}平均分成 ${parts} 份，每份是${zhShare}，吃掉了 ${eaten} 份。还剩多少份？`,
          ],
          answer,
          [
            [
              ["The whole", "整体"],
              [`A whole cut into ${many} has ${parts} of them.`, `平均分成 ${parts} 份，整体就是 ${parts} 份。`],
            ],
            [["Take away", "去掉"], ["Take away the ones eaten:", "去掉吃掉的："], [`${parts} - ${eaten} = ${answer}`]],
          ],
          [`$${answer} + ${eaten} = ${parts}$, the whole.`, `$${answer} + ${eaten} = ${parts}$，正好是整体。`],
          [
            [parts, "That is the whole. Take away the shares eaten.", "这是整体。要去掉吃掉的份。"],
            [eaten, "That is the shares eaten, not the ones left.", "这是吃掉的份数，不是剩下的。"],
            [parts + eaten, "That adds the shares eaten instead of taking them away.", "这把吃掉的加上了，应该减去。"],
          ],
        );
      },
      captioned(
        slicedCircleFigure(4, 3),
        "A pie in 4 equal shares: 3 shaded shares are left after 1 is eaten.",
        "馅饼平均分成 4 份：吃掉 1 份后，还剩涂色的 3 份。",
      ),
    ),
    earlyPoint(
      "are-the-shares-equal",
      ["Are the shares equal", "每份相等吗"],
      [
        "This bar is cut into 3 parts, but the middle part is twice as wide as the end parts. The parts are not the same size, so they are not thirds. They are just 3 parts.\n\nCheck: lay an end part on the middle part. It covers only half of it.\n\n> **Watch out.** 3 pieces are thirds only when every piece is the same size.",
        "这个长条被切成 3 份，但中间一份是两端每份的两倍宽。每份大小不同，所以不是三分之一，只是 3 份而已。\n\n检验：把一端的一份放到中间那份上，只盖住它的一半。\n\n> **注意。** 只有每份一样大时，3 份才是三分之一。",
      ],
      (rng) => {
        const parts = rng.int(2, 4);
        const equal = rng.bool();
        const widths = equal
          ? Array<number>(parts).fill(1)
          : rng.shuffle(parts === 2 ? [1, rng.int(2, 3)] : parts === 3 ? [1, 2, rng.int(3, 4)] : [1, 1, 2, rng.int(3, 4)]);
        const name: Record<number, Pair> = {
          2: ["Equal shares: halves", "相等的份：二分之一"],
          3: ["Equal shares: thirds", "相等的份：三分之一"],
          4: ["Equal shares: fourths", "相等的份：四分之一"],
        };
        const unequal: Pair = [`${parts} parts that are not equal`, `${parts} 份，但并不相等`];
        const correct = equal ? (name[parts] as Pair) : unequal;
        const wrong: Wrong[] = [2, 3, 4]
          .filter((k) => !(equal && k === parts))
          .map(
            (k): Wrong =>
              k === parts
                ? [
                    name[k] as Pair,
                    `The parts are not the same size, so they are not ${shareWord(k)}.`,
                    `每份大小不同，所以不是${partsName(1, k)["zh-CN"]}。`,
                  ]
                : [name[k] as Pair, `There are ${parts} parts, not ${k}.`, `一共是 ${parts} 份，不是 ${k} 份。`],
          );
        if (equal) wrong.push([unequal, "Every part is the same size, so the shares are equal.", "每份都一样大，所以是相等的份。"]);
        return picked(
          rng,
          ["Look at how this bar is cut. Which of these describes it?", "看看这个长条是怎么切的。下面哪一句符合它？"],
          correct,
          wrong,
          [
            [
              ["Count the parts", "数份数"],
              [`The bar is cut into ${parts} parts.`, `长条被切成 ${parts} 份。`],
            ],
            equal
              ? [
                  ["Compare the sizes", "比较大小"],
                  [
                    `${parts === 2 ? "Both" : `All ${parts}`} parts are the same size, so they are ${shareWord(parts)}.`,
                    `这 ${parts} 份大小相同，所以每份是${partsName(1, parts)["zh-CN"]}。`,
                  ],
                ]
              : [
                  ["Compare the sizes", "比较大小"],
                  ["Some parts are bigger than others, so they are not equal shares.", "这几份有大有小，所以不是相等的份。"],
                ],
          ],
          equal
            ? ["Lay one part on another: each covers the other exactly.", "把一份放到另一份上：正好完全盖住。"]
            : ["Lay the smallest part on the biggest: it does not cover all of it.", "把最小的一份放到最大的一份上：盖不满。"],
          cutBarFigure(widths),
        );
      },
      captioned(
        cutBarFigure([1, 2, 1]),
        "A bar cut into 3 parts, the middle one twice as wide: not thirds.",
        "长条切成 3 份，中间一份宽一倍：不是三分之一。",
      ),
    ),
  ],
  [
    "Two friends share a sandwich. If it is cut down the middle, each gets a half. If one piece is much bigger, those are not halves.\n\nCheck: put one half on top of the other. They match.\n\nIn this lesson we name equal shares of shapes as halves, thirds and fourths, and check that the shares are equal.",
    "两个朋友分一个三明治。从中间切开，每人得到二分之一。如果一块大很多，那就不是二分之一。\n\n检验：把一半叠到另一半上，正好重合。\n\n本课我们把图形的相等部分说成二分之几、三分之几、四分之几，并检查每份是否相等。",
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
