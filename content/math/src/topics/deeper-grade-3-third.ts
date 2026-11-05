// A third knowledge point for the 3rd Grade Math topics that had two: facts used
// backwards, a second representation, or the same skill in a short story.

import type { KnowledgePointDef, Rng } from "@ga/content";
import { t } from "@ga/content";
import { earlyNames, earlyThings } from "../early-grades-kit.ts";
import { gradeDrawings2 } from "../explanation-drawings-grades-2.ts";
import { choose, chooseMath, type Pair, whole } from "./early-grades-more-kit.ts";

/** skill builds a knowledge point from its texts and generator. */
const skill = (id: string, title: Pair, explanation: Pair, generate: KnowledgePointDef["generate"]): KnowledgePointDef => ({
  id,
  title: t(title[0], title[1]),
  explanation: t(explanation[0], explanation[1]),
  generate,
});

/** storyThing picks a name and a thing for a word problem. */
const storyThing = (rng: Rng) => ({ who: rng.pick(earlyNames), thing: rng.pick(earlyThings) });

/** betweenProducts builds the knowledge point of a product one step from a known fact, for the factors in a list. */
const betweenProducts = (id: string, title: Pair, factors: readonly number[]) =>
  skill(
    id,
    title,
    [
      "A product one step away can be reached from a known fact. Going from $6 \\times 7$ to $6 \\times 8$ adds one more group of 6, and going down takes one group away.",
      "相差一步的积可以由已知的算式得到。从 $6 \\times 7$ 到 $6 \\times 8$ 是多一组 6，往下就是少一组。",
    ],
    (rng) => {
      const a = rng.pick(factors);
      const b = rng.int(2, 9);
      const up = rng.bool();
      const other = up ? b + 1 : b - 1;
      return whole(
        [
          `Given that $${a} \\times ${b} = ${a * b}$, what is $${a} \\times ${other}$?`,
          `已知 $${a} \\times ${b} = ${a * b}$，$${a} \\times ${other}$ 是多少？`,
        ],
        a * other,
        [a * b + (up ? 1 : -1), up ? a * b - a : a * b + a, a * other + a + 1],
        [
          `${up ? "One more" : "One fewer"} group of ${a} ${up ? "adds" : "takes away"} ${a}, so the product is $${a * b} ${up ? "+" : "-"} ${a} = ${a * other}$.`,
          `${up ? "多" : "少"}一组 ${a}，就${up ? "加上" : "减去"} ${a}，所以积是 $${a * b} ${up ? "+" : "-"} ${a} = ${a * other}$。`,
        ],
      );
    },
  );

/** deeperGrade3ThirdPoints holds the third knowledge points of 3rd Grade Math, by topic. */
export const deeperGrade3ThirdPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "multiplication-as-equal-groups": [
    skill(
      "what-a-product-means",
      ["What a product means", "积表示什么"],
      [
        "The product $4 \\times 6$ means 4 groups with 6 in each group. The first number counts the groups and the second tells the size of each, and the story must match both.",
        "积 $4 \\times 6$ 表示 4 组，每组 6 个。第一个数是组数，第二个数是每组的个数，故事要与两者都相符。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        let b = rng.int(2, 9);
        if (a === b) b = a === 9 ? 8 : a + 1;
        const { thing } = storyThing(rng);
        const line = (x: number, y: number): Pair => [
          `${x} bags with ${y} ${thing.en} in each bag`,
          `${x} 个袋子，每袋 ${y} 个${thing.zh}`,
        ];
        return choose(
          rng,
          [
            `Which story matches the groups in $${a} \\times ${b}$, read as $${a}$ groups of $${b}$?`,
            `把 $${a} \\times ${b}$ 读作 $${a}$ 组、每组 $${b}$ 个，哪个故事与它相符？`,
          ],
          line(a, b),
          [
            line(b, a),
            [`${a} bags and ${b} more ${thing.en}`, `${a} 个袋子，另外还有 ${b} 个${thing.zh}`],
            [`${a + b} bags with just 1 in each bag`, `${a + b} 个袋子，每袋 1 个${thing.zh}`],
          ],
          [
            `Read as ${a} groups of ${b}, there are ${a} bags and ${b} in each. Swapping them gives the same total but tells a different story.`,
            `读作 ${a} 组、每组 ${b} 个，就是 ${a} 个袋子，每袋 ${b} 个。交换后总数相同，但故事不同。`,
          ],
        );
      },
    ),
  ],
  "multiplication-with-arrays": [
    skill(
      "rows-and-columns-swapped",
      ["An array turned on its side", "把数组转过来"],
      [
        "Turning an array on its side swaps rows and columns but moves no dots. So 3 rows of 7 and 7 rows of 3 hold the same number, and one fact gives the other.",
        "把数组转过来，行和列互换，但点没有移动。所以 3 行每行 7 个和 7 行每行 3 个的数量相同，知道一个就知道另一个。",
      ],
      (rng) => {
        const r = rng.int(2, 9);
        const c = rng.int(2, 9);
        return whole(
          [
            `An array has ${r} rows of ${c}. It is turned on its side so that it has ${c} rows. How many dots are in each row now?`,
            `一个数组有 ${r} 行，每行 ${c} 个。把它转过来变成 ${c} 行。现在每行有多少个点？`,
          ],
          r,
          [c, r * c, r + c],
          [
            `Turning swaps rows and columns: the ${r * c} dots now make ${c} rows of ${r}.`,
            `转过来后行和列互换：${r * c} 个点现在是 ${c} 行，每行 ${r} 个。`,
          ],
        );
      },
    ),
  ],
  "multiplying-by-2-5-and-10": [
    skill(
      "fives-as-half-of-tens",
      ["Fives as half of tens", "乘 5 是乘 10 的一半"],
      [
        "Five is half of ten, so five groups are half of ten groups. To find $5 \\times 8$, take $10 \\times 8 = 80$ and halve it to get 40. Doubling a times-five fact gives the times-ten one.",
        "5 是 10 的一半，所以 5 组是 10 组的一半。要算 $5 \\times 8$，先算 $10 \\times 8 = 80$，再取一半得 40。把乘 5 的结果翻倍就是乘 10 的结果。",
      ],
      (rng) => {
        const a = rng.int(2, 29);
        const known = 10 * a;
        return whole(
          [
            `Given that $10 \\times ${a} = ${known}$, what is $5 \\times ${a}$?`,
            `已知 $10 \\times ${a} = ${known}$，$5 \\times ${a}$ 是多少？`,
          ],
          5 * a,
          [known - 5, known + 5, 2 * a],
          [`5 groups are half of 10 groups, and half of ${known} is ${5 * a}.`, `5 组是 10 组的一半，${known} 的一半是 ${5 * a}。`],
        );
      },
    ),
  ],
  "multiplying-by-3-and-4": [
    betweenProducts("threes-and-fours-from-a-neighbor", ["Threes and fours from a neighbor", "由相邻算式求乘 3 和乘 4"], [3, 4]),
  ],
  "multiplying-by-6-7-8-and-9": [
    betweenProducts("sixes-to-nines-from-a-neighbor", ["Sixes to nines from a neighbor", "由相邻算式求乘 6 到乘 9"], [6, 7, 8, 9]),
  ],
  "multiplying-by-0-and-1": [
    skill(
      "zero-and-one-in-stories",
      ["Zero and one in stories", "故事中的零和一"],
      [
        "Empty groups hold nothing, so any number of them is still 0. One group of a number is that number. Reading the story tells which rule applies before any calculating.",
        "空的组里什么也没有，所以再多的组也还是 0。一组就是这个数本身。读懂故事就知道用哪条规则，不必计算。",
      ],
      (rng) => {
        const n = rng.int(12, 99);
        const zero = rng.bool();
        const { who, thing } = storyThing(rng);
        return whole(
          zero
            ? [
                `${who} has ${n} empty boxes with 0 ${thing.en} in each. How many ${thing.en} is that?`,
                `${who} 有 ${n} 个空盒子，每盒 0 个${thing.zh}。一共有多少个${thing.zh}？`,
              ]
            : [
                `${who} has 1 box with ${n} ${thing.en} in it. How many ${thing.en} is that?`,
                `${who} 有 1 个盒子，里面有 ${n} 个${thing.zh}。一共有多少个${thing.zh}？`,
              ],
          zero ? 0 : n,
          zero ? [n, 1, n - 1] : [1, 0, n + 1],
          zero
            ? [`Any number of groups of 0 is 0: $${n} \\times 0 = 0$.`, `任意多组 0 都是 0：$${n} \\times 0 = 0$。`]
            : [`One group of ${n} is ${n}: $1 \\times ${n} = ${n}$.`, `一组 ${n} 就是 ${n}：$1 \\times ${n} = ${n}$。`],
        );
      },
    ),
  ],
  "properties-of-multiplication": [
    skill(
      "the-box-in-a-regrouped-product",
      ["The box in a regrouped product", "重新分组后的方框"],
      [
        "Three factors can be grouped either way without changing the product. Since the same numbers appear on both sides, the box holds the factor the other side has not yet used.",
        "三个因数不管怎样分组，积都不变。两边的数相同，所以方框里是另一边还没有用到的因数。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        return whole(
          [
            `What number goes in the box? $$(${a} \\times ${b}) \\times ${c} = ${a} \\times (\\square \\times ${c})$$`,
            `方框里填几？$$(${a} \\times ${b}) \\times ${c} = ${a} \\times (\\square \\times ${c})$$`,
          ],
          b,
          [a * b, b * c, a + c],
          [
            `Regrouping keeps the same three factors, ${a}, ${b} and ${c}, so the missing one is ${b}.`,
            `重新分组后仍是 ${a}、${b}、${c} 这三个因数，所以缺少的是 ${b}。`,
          ],
        );
      },
    ),
  ],
  "splitting-a-factor-to-multiply": [
    skill(
      "splitting-with-subtraction",
      ["Splitting with subtraction", "用减法拆分"],
      [
        "A factor just below a round number can be split by subtracting. For $6 \\times 9$, take $6 \\times 10 = 60$ and remove one group of 6, which gives $60 - 6 = 54$.",
        "接近整十的因数可以用减法拆分。算 $6 \\times 9$ 时，先算 $6 \\times 10 = 60$，再去掉一组 6，得 $60 - 6 = 54$。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const tens = rng.pick([10, 20, 30, 40]);
        const b = tens - 1;
        return whole(
          [`Use $${a} \\times ${tens}$ to find $${a} \\times ${b}$.`, `利用 $${a} \\times ${tens}$ 求 $${a} \\times ${b}$。`],
          a * b,
          [a * tens - 1, a * tens + a, a * tens],
          [
            `$${a} \\times ${tens} = ${a * tens}$ has one group of ${a} too many, so $${a * tens} - ${a} = ${a * b}$.`,
            `$${a} \\times ${tens} = ${a * tens}$ 多了一组 ${a}，所以 $${a * tens} - ${a} = ${a * b}$。`,
          ],
        );
      },
    ),
  ],
  "multiplying-by-multiples-of-10": [
    skill(
      "the-missing-multiple-of-ten",
      ["The missing multiple of ten", "缺少的整十因数"],
      [
        "A product with a round factor is a basic fact counted in tens. Since $4 \\times 6 = 24$, we have $4 \\times 60 = 240$, so a missing round factor is found from the fact.",
        "含整十因数的积就是以十为单位的基本算式。因为 $4 \\times 6 = 24$，所以 $4 \\times 60 = 240$，由此可以求出缺少的整十因数。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        const b = rng.int(2, 9);
        return whole(
          [
            `What number goes in the box? $$${a} \\times \\square = ${a * b * 10}$$`,
            `方框里填几？$$${a} \\times \\square = ${a * b * 10}$$`,
          ],
          b * 10,
          [b, b * 100, a * b],
          [
            `$${a} \\times ${b} = ${a * b}$, and ${a * b * 10} is ${a * b} tens, so the factor is ${b} tens: ${b * 10}.`,
            `$${a} \\times ${b} = ${a * b}$，${a * b * 10} 是 ${a * b} 个十，所以因数是 ${b} 个十：${b * 10}。`,
          ],
        );
      },
    ),
  ],
  "division-as-sharing": [
    skill(
      "sharing-and-the-whole",
      ["The whole from the shares", "由每份求总数"],
      [
        "If a number is shared equally, the whole is the size of a share times the number of shares. Multiplication undoes sharing, so a share and a count give back what was shared.",
        "如果平均分，总数就是每份的数量乘以份数。乘法可以还原平均分，所以知道每份和份数就能求出总数。",
      ],
      (rng) => {
        const each = rng.int(2, 9);
        const n = rng.int(2, 9);
        const { who, thing } = storyThing(rng);
        return whole(
          [
            `${who} shared some ${thing.en} equally among ${n} friends, and each friend got ${each}. How many ${thing.en} were shared?`,
            `${who} 把一些${thing.zh}平均分给 ${n} 个朋友，每人得到 ${each} 个。一共分了多少个${thing.zh}？`,
          ],
          each * n,
          [each + n, each * n + n, each * n + each],
          [
            `${n} shares of ${each} make $${n} \\times ${each} = ${each * n}$.`,
            `${n} 份，每份 ${each} 个，共 $${n} \\times ${each} = ${each * n}$ 个。`,
          ],
        );
      },
    ),
  ],
  "division-as-making-groups": [
    skill(
      "a-group-size-from-the-count",
      ["A group size from the count", "由组数求每组数量"],
      [
        "The same division answers two questions: how many groups, and how big each group is. If 24 items fill 6 equal bags, then each bag holds $24 \\div 6 = 4$.",
        "同一个除法可以回答两个问题：有几组，每组有多少。如果 24 个物品正好装满 6 个相同的袋子，每袋就有 $24 \\div 6 = 4$ 个。",
      ],
      (rng) => {
        const each = rng.int(2, 9);
        const n = rng.int(2, 9);
        const { thing } = storyThing(rng);
        return whole(
          [
            `${each * n} ${thing.en} fill ${n} bags, with the same number in each bag. How many ${thing.en} go in each bag?`,
            `${each * n} 个${thing.zh}装满 ${n} 个袋子，每袋数量相同。每袋有多少个${thing.zh}？`,
          ],
          each,
          [n === each ? each + 1 : n, each * n - n, each + 1],
          [
            `${n} equal bags split ${each * n} into groups of ${each}, since $${n} \\times ${each} = ${each * n}$.`,
            `${n} 个相同的袋子把 ${each * n} 分成每组 ${each} 个，因为 $${n} \\times ${each} = ${each * n}$。`,
          ],
        );
      },
    ),
  ],
  "relating-multiplication-and-division": [
    skill(
      "the-fact-that-does-not-belong",
      ["The fact that does not belong", "不属于这一家的算式"],
      [
        "A multiplication and division family uses the same three numbers, with the product always being the number divided. A sentence that divides a smaller number by the product is not in the family.",
        "乘除算式家族用同样的三个数，被除数总是那个积。用较小的数除以积的算式不属于这个家族。",
      ],
      (rng) => {
        const a = rng.int(2, 9);
        let b = rng.int(2, 9);
        if (a === b) b = a === 9 ? 8 : a + 1;
        const p = a * b;
        return chooseMath(
          rng,
          [
            `Which sentence is not in the same family as $${a} \\times ${b} = ${p}$?`,
            `哪个算式与 $${a} \\times ${b} = ${p}$ 不属于同一家族？`,
          ],
          `${a} \\div ${p} = ${b}`,
          [`${b} \\times ${a} = ${p}`, `${p} \\div ${a} = ${b}`, `${p} \\div ${b} = ${a}`],
          [
            `In the family, ${p} is the number being divided. Dividing ${a} by ${p} does not give ${b}.`,
            `在这个家族中，${p} 是被除数。${a} 除以 ${p} 得不到 ${b}。`,
          ],
        );
      },
    ),
  ],
  "division-facts-to-100": [
    skill(
      "the-divisor-from-a-fact",
      ["The missing number being divided", "缺少的被除数"],
      [
        "In $\\square \\div 7 = 6$ the box is the number being divided. Division undoes multiplication, so multiply the two numbers you see: $7 \\times 6 = 42$.",
        "在 $\\square \\div 7 = 6$ 中，方框是被除数。除法是乘法的逆运算，所以把看到的两个数相乘：$7 \\times 6 = 42$。",
      ],
      (rng) => {
        const b = rng.int(2, 10);
        const c = rng.int(2, 10);
        return whole(
          [`What number goes in the box? $$\\square \\div ${b} = ${c}$$`, `方框里填几？$$\\square \\div ${b} = ${c}$$`],
          b * c,
          [b + c, b * c + b, b === c ? b + 1 : Math.max(b, c)],
          [
            `$\\square$ is ${b} groups of ${c}: $${b} \\times ${c} = ${b * c}$. Check: $${b * c} \\div ${b} = ${c}$.`,
            `方框是 ${b} 组 ${c}：$${b} \\times ${c} = ${b * c}$。验算：$${b * c} \\div ${b} = ${c}$。`,
          ],
        );
      },
    ),
  ],
  "multiplication-and-division-word-problems": [
    skill(
      "times-as-many-backwards",
      ["Times as many, backwards", "由几倍求原数"],
      [
        "If one amount is some number of times another, the smaller amount is found by dividing. If Ben has 24, which is 4 times what Leo has, then Leo has $24 \\div 4 = 6$.",
        "如果一个数是另一个数的几倍，较小的数用除法求。如果 Ben 有 24 个，是 Leo 的 4 倍，那么 Leo 有 $24 \\div 4 = 6$ 个。",
      ],
      (rng) => {
        const small = rng.int(2, 9);
        const k = rng.int(2, 9);
        const [p, q] = rng.sample(earlyNames, 2) as [string, string];
        const thing = rng.pick(earlyThings);
        return whole(
          [
            `${p} has ${small * k} ${thing.en}, which is ${k} times as many as ${q} has. How many ${thing.en} does ${q} have?`,
            `${p} 有 ${small * k} 个${thing.zh}，是 ${q} 的 ${k} 倍。${q} 有多少个${thing.zh}？`,
          ],
          small,
          [small * k * k, small * k - k, small * k + k],
          [
            `${p}'s ${small * k} is ${k} groups the size of ${q}'s amount, so ${q} has $${small * k} \\div ${k} = ${small}$.`,
            `${p} 的 ${small * k} 个是 ${q} 的 ${k} 倍，所以 ${q} 有 $${small * k} \\div ${k} = ${small}$ 个。`,
          ],
        );
      },
    ),
  ],
  "two-step-word-problems-with-all-operations": [
    skill(
      "the-sentence-for-two-steps",
      ["The sentence for two steps", "两步问题的算式"],
      [
        "A letter can stand for the unknown in a two-step story. Write each step in the order of the story, using parentheses so that the step done first is done first.",
        "两步故事中可以用字母表示未知数。按故事的顺序写出每一步，用括号保证先做的那一步先算。",
      ],
      (rng) => {
        const packs = rng.int(2, 9);
        const per = rng.int(3, 9);
        const more = rng.int(2, 20);
        const { who, thing } = storyThing(rng);
        return chooseMath(
          rng,
          [
            `${who} has ${packs} packs with ${per} ${thing.en} in each and gives away ${more}. Which equation gives $n$, the number left?`,
            `${who} 有 ${packs} 包${thing.zh}，每包 ${per} 个，送出 ${more} 个。哪个方程能求出剩下的数量 $n$？`,
          ],
          `n = (${packs} \\times ${per}) - ${more}`,
          [`n = (${packs} + ${per}) - ${more}`, `n = (${packs} \\times ${per}) + ${more}`, `n = ${packs} \\times (${per} + ${more})`],
          [
            `First the packs give $${packs} \\times ${per}$, and giving away ${more} subtracts from that.`,
            `先由包数得 $${packs} \\times ${per}$，送出 ${more} 个就从中减去。`,
          ],
        );
      },
    ),
  ],
  "expressions-with-two-operations": [
    skill(
      "subtraction-and-multiplication-together",
      ["Subtraction and multiplication together", "减法和乘法同时出现"],
      [
        "Multiplication and division come before addition and subtraction, wherever they stand, unless parentheses say otherwise. In $30 - 4 \\times 5$ first find $4 \\times 5 = 20$, then subtract from 30.",
        "除非有括号，乘除总是先于加减，不管它们写在哪里。在 $30 - 4 \\times 5$ 中，先算 $4 \\times 5 = 20$，再从 30 中减去。",
      ],
      (rng) => {
        const b = rng.int(2, 9);
        const c = rng.int(2, 9);
        const a = b * c + rng.int(1, 30);
        return whole(
          [`What is $${a} - ${b} \\times ${c}$?`, `$${a} - ${b} \\times ${c}$ 是多少？`],
          a - b * c,
          [(a - b) * c, a - b - c, a + b * c],
          [
            `Multiply first: $${b} \\times ${c} = ${b * c}$. Then $${a} - ${b * c} = ${a - b * c}$.`,
            `先算乘法：$${b} \\times ${c} = ${b * c}$。再算 $${a} - ${b * c} = ${a - b * c}$。`,
          ],
        );
      },
    ),
  ],
  "arithmetic-patterns": [
    skill(
      "patterns-in-a-times-table",
      ["Patterns in a times table", "乘法表中的规律"],
      [
        "A multiple of 5 always ends in 0 or 5, a multiple of 10 ends in 0, and a multiple of 2 ends in an even digit. The last digit alone can rule a number out.",
        "5 的倍数个位总是 0 或 5，10 的倍数个位是 0，2 的倍数个位是偶数。只看个位就可以排除一些数。",
      ],
      (rng) => {
        const k = rng.pick([2, 5, 10]);
        const right = k * rng.int(5, 40);
        const off = (x: number) => (k === 2 ? x * 2 + 1 : k === 5 ? x * 5 + rng.pick([1, 2, 3, 4]) : x * 10 + rng.int(1, 9));
        const others = [off(rng.int(5, 40)), off(rng.int(41, 80)), off(rng.int(81, 120))];
        const rule: Pair =
          k === 2 ? ["ends in an even digit", "个位是偶数"] : k === 5 ? ["ends in 0 or 5", "个位是 0 或 5"] : ["ends in 0", "个位是 0"];
        return choose(
          rng,
          [`Which of these numbers is a multiple of ${k}?`, `下面哪个数是 ${k} 的倍数？`],
          [`${right}`, `${right}`],
          others.map((o): Pair => [`${o}`, `${o}`]),
          [`A multiple of ${k} ${rule[0]}, and of these only ${right} does.`, `${k} 的倍数${rule[1]}，这些数中只有 ${right} 符合。`],
        );
      },
    ),
  ],
  "understanding-three-digit-numbers": [
    skill(
      "ten-or-a-hundred-more-in-a-digit",
      ["The digit that changes", "哪个数字变了"],
      [
        "Adding 10 raises the tens digit by one, and adding 100 raises the hundreds digit by one, when no trade is needed. The other digits stay exactly as they were.",
        "不需要进位时，加 10 使十位多 1，加 100 使百位多 1。其他数字完全不变。",
      ],
      (rng) => {
        const h = rng.int(1, 8);
        const te = rng.int(0, 8);
        const o = rng.int(0, 9);
        const n = h * 100 + te * 10 + o;
        const hundred = rng.bool();
        return whole(
          hundred
            ? [`What is the hundreds digit of $${n} + 100$?`, `$${n} + 100$ 的百位数字是几？`]
            : [`What is the tens digit of $${n} + 10$?`, `$${n} + 10$ 的十位数字是几？`],
          hundred ? h + 1 : te + 1,
          hundred ? [h, te, o] : [te, h, o],
          hundred
            ? [`Adding 100 raises the hundreds digit by one, from ${h} to ${h + 1}.`, `加 100 使百位多 1，从 ${h} 变成 ${h + 1}。`]
            : [`Adding 10 raises the tens digit by one, from ${te} to ${te + 1}.`, `加 10 使十位多 1，从 ${te} 变成 ${te + 1}。`],
        );
      },
    ),
  ],
  "rounding-to-the-nearest-ten": [
    skill(
      "the-largest-that-rounds-to-a-ten",
      ["The largest that rounds to a ten", "四舍五入到某个十的最大数"],
      [
        "A number rounds to 40 when it is closer to 40 than to 30 or 50. Numbers from 35 to 44 all round to 40: 35 goes up by convention and 45 would already go to 50.",
        "一个数离 40 比离 30 或 50 更近时，四舍五入到 40。从 35 到 44 都四舍五入为 40：35 按约定向上，而 45 已经入到 50。",
      ],
      (rng) => {
        const tens = rng.int(2, 90) * 10;
        const largest = rng.bool();
        return whole(
          largest
            ? [
                `A whole number rounds to ${tens} when rounded to the nearest ten. What is the largest it could be?`,
                `一个整数四舍五入到十位后是 ${tens}。它最大可能是多少？`,
              ]
            : [
                `A whole number rounds to ${tens} when rounded to the nearest ten. What is the smallest it could be?`,
                `一个整数四舍五入到十位后是 ${tens}。它最小可能是多少？`,
              ],
          largest ? tens + 4 : tens - 5,
          largest ? [tens + 5, tens + 9, tens - 5] : [tens - 4, tens - 9, tens + 4],
          largest
            ? [
                `${tens + 4} is closer to ${tens}, but ${tens + 5} already rounds up to ${tens + 10}.`,
                `${tens + 4} 离 ${tens} 更近，而 ${tens + 5} 已经入到 ${tens + 10}。`,
              ]
            : [
                `${tens - 5} rounds up to ${tens} because a 5 goes up, while ${tens - 6} rounds down to ${tens - 10}.`,
                `${tens - 5} 的个位是 5，向上入到 ${tens}，而 ${tens - 6} 舍到 ${tens - 10}。`,
              ],
        );
      },
    ),
  ],
  "rounding-to-the-nearest-hundred": [
    skill(
      "estimating-with-hundreds",
      ["Estimating with hundreds", "用整百估算"],
      [
        "To estimate a sum or difference, round each number to the nearest hundred first and then add or subtract. The estimate shows about how large the exact answer should be.",
        "估算和或差时，先把每个数四舍五入到百位，再相加或相减。估算结果说明准确答案大约有多大。",
      ],
      (rng) => {
        const a = rng.int(120, 480);
        const b = rng.int(120, 480);
        const ra = Math.round(a / 100) * 100;
        const rb = Math.round(b / 100) * 100;
        return whole(
          [
            `Round each number to the nearest hundred to estimate $${a} + ${b}$. What is the estimate?`,
            `把每个数四舍五入到百位，估算 $${a} + ${b}$。估算结果是多少？`,
          ],
          ra + rb,
          [a + b, ra + rb + 100, ra + rb - 100],
          [
            `${a} rounds to ${ra} and ${b} rounds to ${rb}, and $${ra} + ${rb} = ${ra + rb}$.`,
            `${a} 约等于 ${ra}，${b} 约等于 ${rb}，$${ra} + ${rb} = ${ra + rb}$。`,
          ],
        );
      },
    ),
  ],
  "adding-within-1000": [
    skill(
      "three-addends-within-1000",
      ["Three addends within 1000", "1000 以内三个数相加"],
      [
        "Adding three numbers is two additions in a row. Add any two first, using whichever pair is easier, and then add the third to that sum.",
        "三个数相加就是连续做两次加法。先把任意两个数相加，选更好算的一对，再加上第三个数。",
      ],
      (rng) => {
        const a = rng.int(101, 299);
        const b = rng.int(101, 299);
        const c = rng.int(101, 399);
        return whole(
          [`What is $${a} + ${b} + ${c}$?`, `$${a} + ${b} + ${c}$ 是多少？`],
          a + b + c,
          [a + b, a + b + c + 100, a + b + c - 10],
          [
            `$${a} + ${b} = ${a + b}$, and $${a + b} + ${c} = ${a + b + c}$.`,
            `$${a} + ${b} = ${a + b}$，$${a + b} + ${c} = ${a + b + c}$。`,
          ],
        );
      },
    ),
  ],
  "subtracting-within-1000": [
    skill(
      "checking-a-difference-by-adding",
      ["Checking a difference by adding", "用加法验算差"],
      [
        "Addition checks subtraction. If $523 - 148 = 375$, then $375 + 148$ must give back 523. A student's answer that fails this check has gone wrong somewhere.",
        "加法可以验算减法。如果 $523 - 148 = 375$，那么 $375 + 148$ 一定等于 523。不能通过验算的答案一定有错。",
      ],
      (rng) => {
        const a = rng.int(310, 990);
        const b = rng.int(110, a - 110);
        const diff = a - b;
        const who = rng.pick(earlyNames);
        return whole(
          [
            `${who} found that $${a} - ${b} = ${diff}$. To check, what should $${diff} + ${b}$ equal?`,
            `${who} 算得 $${a} - ${b} = ${diff}$。为了验算，$${diff} + ${b}$ 应该等于多少？`,
          ],
          a,
          [diff, b, a + 10],
          [`The difference and the part taken away put back together give the start, ${a}.`, `差和减去的部分合起来就是开始的数 ${a}。`],
        );
      },
    ),
  ],
  "unit-fractions": [
    skill(
      "a-unit-fraction-of-a-number",
      ["A unit fraction of a number", "一个数的几分之一"],
      [
        "One third of a group means splitting it into 3 equal parts and taking one. So a unit fraction of a number is found by dividing by the denominator.",
        "一组的三分之一，就是把它平均分成 3 份取 1 份。所以一个数的几分之一可以用除以分母来求。",
      ],
      (rng) => {
        const d = rng.int(2, 8);
        const each = rng.int(2, 10);
        const { who, thing } = storyThing(rng);
        return whole(
          [
            `${who} has ${d * each} ${thing.en} and gives away $\\frac{1}{${d}}$ of them. How many does ${who} give away?`,
            `${who} 有 ${d * each} 个${thing.zh}，送出其中的 $\\frac{1}{${d}}$。送出了多少个？`,
          ],
          each,
          [d * each - each, d, each + d],
          [
            `Split ${d * each} into ${d} equal parts: each part is $${d * each} \\div ${d} = ${each}$.`,
            `把 ${d * each} 平均分成 ${d} 份：每份是 $${d * each} \\div ${d} = ${each}$。`,
          ],
        );
      },
    ),
  ],
  "fractions-as-parts-of-a-whole": [
    skill(
      "the-part-not-shaded",
      ["The part not shaded", "没有涂色的部分"],
      [
        "The shaded and unshaded parts together make the whole. If 3 of 8 equal parts are shaded, then 5 of 8 are not, because the numerators must add to the denominator.",
        "涂色和未涂色的部分合起来是整体。如果 8 份中有 3 份涂色，那么有 5 份没涂色，因为分子之和必须等于分母。",
      ],
      (rng) => {
        const d = rng.int(3, 12);
        const n = rng.int(1, d - 1);
        return whole(
          [
            `A bar is cut into ${d} equal parts, and $\\frac{${n}}{${d}}$ of it is shaded. The part not shaded is $\\frac{a}{${d}}$. What is $a$?`,
            `一个长条被平均分成 ${d} 份，其中 $\\frac{${n}}{${d}}$ 涂了色。没有涂色的部分是 $\\frac{a}{${d}}$。$a$ 是多少？`,
          ],
          d - n,
          [n, d, d - n + 1],
          [
            `${n} of the ${d} parts are shaded, which leaves $${d} - ${n} = ${d - n}$.`,
            `${d} 份中有 ${n} 份涂色，还剩 $${d} - ${n} = ${d - n}$ 份。`,
          ],
        );
      },
    ),
  ],
  "fractions-on-the-number-line": [
    {
      ...skill(
        "the-point-past-one",
        ["A point past one", "超过 1 的点"],
        [
          "A number line keeps going past 1, with the same equal parts in each whole. The point 5 parts from 0, when each whole has 4 parts, is at $\\frac{5}{4}$, which lies between 1 and 2.",
          "数轴在 1 之后继续延伸，每个整数之间都有相同的等份。如果每个单位分成 4 份，距 0 有 5 份的点在 $\\frac{5}{4}$，位于 1 和 2 之间。",
        ],
        (rng) => {
          const d = rng.int(2, 8);
          const k = rng.int(1, 2);
          const extra = rng.int(1, d - 1);
          const n = k * d + extra;
          return whole(
            [
              `Each space from one whole number to the next on a number line is cut into ${d} equal parts. A point is ${extra} part${extra > 1 ? "s" : ""} past ${k}. It is at $\\frac{a}{${d}}$. What is $a$?`,
              `数轴上每两个相邻整数之间都平均分成 ${d} 份。一个点在 ${k} 之后 ${extra} 份。它的位置是 $\\frac{a}{${d}}$。$a$ 是多少？`,
            ],
            n,
            [extra, k + extra, n + d],
            [
              `${k} is ${k * d} parts from 0, and ${extra} more make ${n}, so the point is at $\\frac{${n}}{${d}}$.`,
              `${k} 距 0 有 ${k * d} 份，再加 ${extra} 份是 ${n} 份，所以这个点在 $\\frac{${n}}{${d}}$。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["fractions-on-the-number-line#the-point-past-one"],
    },
  ],
  "equal-fractions-with-pictures": [
    skill(
      "a-whole-in-different-parts",
      ["A whole in different parts", "用不同份数表示 1"],
      [
        "A fraction whose top and bottom match is exactly one whole, because all of the parts are taken. So $\\frac{6}{6}$ and $\\frac{9}{9}$ both equal 1, and any number of equal parts can make the whole.",
        "分子和分母相同的分数正好是 1，因为取了所有的份。所以 $\\frac{6}{6}$ 和 $\\frac{9}{9}$ 都等于 1，任意份数都能组成整体。",
      ],
      (rng) => {
        const d = rng.int(2, 12);
        const e = rng.int(2, 12);
        const n = e === d ? e + 1 : e;
        return whole(
          [
            `What number goes in the box? $$\\frac{${d}}{${d}} = \\frac{\\square}{${n}}$$`,
            `方框里填几？$$\\frac{${d}}{${d}} = \\frac{\\square}{${n}}$$`,
          ],
          n,
          [d, 1, n + 1],
          [
            `$\\frac{${d}}{${d}}$ is one whole, and one whole cut into ${n} parts has all ${n} of them.`,
            `$\\frac{${d}}{${d}}$ 就是 1，把 1 分成 ${n} 份，就是全部 ${n} 份。`,
          ],
        );
      },
    ),
  ],
  "comparing-fractions-with-a-common-part": [
    skill(
      "ordering-with-a-common-part",
      ["Ordering with a common part", "有相同部分的分数排序"],
      [
        "With the same denominator, more parts means more. With the same numerator, smaller parts mean less, so the larger denominator gives the smaller fraction. First see which part is shared.",
        "分母相同时，份数多的大。分子相同时，每份越小总量越小，所以分母大的分数小。先看哪个部分相同。",
      ],
      (rng) => {
        const sameBottom = rng.bool();
        const greatest = rng.bool();
        const nums = rng.sample([1, 2, 3, 4, 5, 6, 7], 4) as number[];
        const dens = rng.sample([2, 3, 4, 5, 6, 8, 10, 12], 4) as number[];
        const d = rng.int(8, 12);
        const n = 1;
        const items = sameBottom ? nums.map((x) => ({ a: x, b: d })) : dens.map((x) => ({ a: n, b: x }));
        const value = (x: { a: number; b: number }) => x.a / x.b;
        const ordered = [...items].sort((x, y) => value(x) - value(y));
        const answer = greatest ? ordered[ordered.length - 1]! : ordered[0]!;
        const show = (x: { a: number; b: number }) => `\\frac{${x.a}}{${x.b}}`;
        return chooseMath(
          rng,
          greatest
            ? ["Which of these fractions is the greatest?", "下面哪个分数最大？"]
            : ["Which of these fractions is the least?", "下面哪个分数最小？"],
          show(answer),
          items.filter((x) => x !== answer).map(show),
          sameBottom
            ? [
                `They share the denominator ${d}, so the number of parts decides, and ${answer.a} is the ${greatest ? "most" : "fewest"}.`,
                `它们的分母都是 ${d}，所以由份数决定，${answer.a} 份${greatest ? "最多" : "最少"}。`,
              ]
            : [
                `They share the numerator 1, so the size of the parts decides. Denominator ${answer.b} gives the ${greatest ? "largest" : "smallest"} parts.`,
                `它们的分子都是 1，所以由每份的大小决定。分母 ${answer.b} 使每份${greatest ? "最大" : "最小"}。`,
              ],
        );
      },
    ),
  ],
  "telling-time-to-the-minute": [
    skill(
      "minutes-before-the-next-hour",
      ["Minutes before the next hour", "还有几分钟到下一个整点"],
      [
        "An hour has 60 minutes. To find how long until the next hour, subtract the minutes past the hour from 60. At 4:47 there are $60 - 47 = 13$ minutes to go.",
        "一小时有 60 分钟。要知道还有多久到下一个整点，用 60 减去已过的分钟数。4:47 时还有 $60 - 47 = 13$ 分钟。",
      ],
      (rng) => {
        const h = rng.int(1, 11);
        const m = rng.int(6, 59);
        return whole(
          [
            `A clock shows ${h}:${String(m).padStart(2, "0")}. How many minutes is it until ${h + 1}:00?`,
            `钟面显示 ${h}:${String(m).padStart(2, "0")}。还有多少分钟到 ${h + 1}:00？`,
          ],
          60 - m,
          [m, 100 - m, 60 - m + 1],
          [
            `There are 60 minutes in an hour and ${m} have passed, so $60 - ${m} = ${60 - m}$ remain.`,
            `一小时有 60 分钟，已过 ${m} 分钟，所以还剩 $60 - ${m} = ${60 - m}$ 分钟。`,
          ],
        );
      },
    ),
  ],
  "elapsed-time-in-minutes": [
    skill(
      "the-start-from-the-end",
      ["The start from the end", "由结束时间求开始时间"],
      [
        "If a time span and its end are known, count back to find the start. Subtract the minutes, and when they run out, cross the hour, which holds 60 minutes.",
        "如果知道时长和结束时间，就往回数求开始时间。减去分钟数，不够减时就跨过整点，一小时有 60 分钟。",
      ],
      (rng) => {
        const h = rng.int(2, 11);
        const endM = rng.int(5, 40);
        const len = rng.int(endM + 5, 55);
        const startM = 60 + endM - len;
        return whole(
          [
            `A movie clip ends at ${h}:${String(endM).padStart(2, "0")} and lasts ${len} minutes. It started at ${h - 1}:$\\square$. What number of minutes goes in the box?`,
            `一段影片在 ${h}:${String(endM).padStart(2, "0")} 结束，时长 ${len} 分钟。它开始于 ${h - 1}:$\\square$。方框里的分钟数是多少？`,
          ],
          startM,
          [len - endM, startM + 10, endM + len],
          [
            `From the start to ${h}:00 is $${len} - ${endM} = ${len - endM}$ minutes, so the start is at $60 - ${len - endM} = ${startM}$ minutes past ${h - 1}.`,
            `从开始到 ${h}:00 是 $${len} - ${endM} = ${len - endM}$ 分钟，所以开始时间是 ${h - 1} 点过 $60 - ${len - endM} = ${startM}$ 分。`,
          ],
        );
      },
    ),
  ],
  "grams-kilograms-and-liters": [
    skill(
      "kilograms-as-grams",
      ["Kilograms as grams", "千克换算成克"],
      [
        "One kilogram is 1000 grams, and a mass may be given as both. Turn the kilograms into grams and add the leftover grams, or compare two masses in the same unit.",
        "1 千克是 1000 克，质量可能同时用两个单位表示。把千克换成克，再加上多出的克数，或者把两个质量换成同一单位再比较。",
      ],
      (rng) => {
        const kg = rng.int(1, 6);
        const g = rng.int(1, 9) * 100;
        const things: readonly Pair[] = [
          ["bag of rice", "一袋大米"],
          ["melon", "一个甜瓜"],
          ["box of books", "一箱书"],
          ["bag of apples", "一袋苹果"],
        ];
        const it = rng.pick(things);
        return whole(
          [
            `A ${it[0]} has a mass of ${kg} kilograms ${g} grams. What is its mass in grams?`,
            `${it[1]}的质量是 ${kg} 千克 ${g} 克。它是多少克？`,
          ],
          kg * 1000 + g,
          [kg * 100 + g, kg + g, kg * 1000],
          [
            `${kg} kilograms are ${kg * 1000} grams, and ${g} more make ${kg * 1000 + g}.`,
            `${kg} 千克是 ${kg * 1000} 克，再加 ${g} 克是 ${kg * 1000 + g} 克。`,
          ],
        );
      },
    ),
  ],
  "scaled-picture-graphs": [
    skill(
      "dots-from-a-value",
      ["Dots from a value", "由数值求点数"],
      [
        "When each dot stands for several, a row's value is the count of dots times the scale. Going the other way, divide a value by the scale to find how many dots to draw.",
        "每个点代表多个时，一行的值是点数乘以比例。反过来，用值除以比例，就知道要画几个点。",
      ],
      (rng) => {
        const per = rng.pick([2, 3, 4, 5, 10]);
        const dots = rng.int(2, 9);
        return whole(
          [
            `In a picture graph, each dot stands for ${per} votes. A row must show ${per * dots} votes. How many dots should it have?`,
            `在一张图画统计图中，每个点代表 ${per} 票。一行要表示 ${per * dots} 票。应该画几个点？`,
          ],
          dots,
          [per * dots, per, dots + 1],
          [
            `${per * dots} votes are ${dots} groups of ${per}, so ${dots} dots.`,
            `${per * dots} 票是 ${dots} 组，每组 ${per} 票，所以画 ${dots} 个点。`,
          ],
        );
      },
    ),
  ],
  "scaled-bar-graphs": [
    skill(
      "a-bar-between-the-lines",
      ["A bar between the lines", "条形停在两条线之间"],
      [
        "A bar can stop halfway between two lines of a scale. Its value is then halfway between the two line values, which is half of a step above the lower line.",
        "条形可以停在刻度的两条线中间。它的值就是两条线数值的正中间，也就是比下面的线多半个步长。",
      ],
      (rng) => {
        const step = rng.pick([2, 4, 10, 20]);
        const k = rng.int(1, 9);
        const lo = step * k;
        return whole(
          [
            `A bar graph has lines every ${step}. A bar stops halfway between ${lo} and ${lo + step}. What is its value?`,
            `一张条形统计图每隔 ${step} 有一条线。一个条形停在 ${lo} 和 ${lo + step} 的正中间。它的值是多少？`,
          ],
          lo + step / 2,
          [lo, lo + step, lo + 1],
          [
            `Half of a step is ${step / 2}, so the value is $${lo} + ${step / 2} = ${lo + step / 2}$.`,
            `半个步长是 ${step / 2}，所以值是 $${lo} + ${step / 2} = ${lo + step / 2}$。`,
          ],
        );
      },
    ),
  ],
  "line-plots-of-measurements": [
    skill(
      "the-total-length-on-a-line-plot",
      ["The total length on a line plot", "线状图上的总长度"],
      [
        "A line plot lists every measurement. To find the total length, multiply each length by the number of marks above it and add the results, since each mark stands for one length.",
        "线状图列出了每一个测量值。要求总长度，就把每个长度乘以它上方的标记数，再把结果相加，因为每个标记代表一个长度。",
      ],
      (rng) => {
        const l = [rng.int(2, 4), rng.int(5, 7), rng.int(8, 10)] as const;
        const m = [rng.int(1, 4), rng.int(1, 4), rng.int(1, 4)] as const;
        const total = l[0] * m[0] + l[1] * m[1] + l[2] * m[2];
        return whole(
          [
            `A line plot of ribbon lengths has ${m[0]} ${m[0] === 1 ? "mark" : "marks"} at ${l[0]} inches, ${m[1]} at ${l[1]} inches and ${m[2]} at ${l[2]} inches. What is the total length of the ribbons, in inches?`,
            `一张丝带长度线状图上，${l[0]} 英寸处有 ${m[0]} 个标记，${l[1]} 英寸处有 ${m[1]} 个，${l[2]} 英寸处有 ${m[2]} 个。这些丝带的总长度是多少英寸？`,
          ],
          total,
          [l[0] + l[1] + l[2], m[0] + m[1] + m[2], total + l[0]],
          [
            `Multiply and add: $${m[0]} \\times ${l[0]} + ${m[1]} \\times ${l[1]} + ${m[2]} \\times ${l[2]} = ${total}$.`,
            `相乘再相加：$${m[0]} \\times ${l[0]} + ${m[1]} \\times ${l[1]} + ${m[2]} \\times ${l[2]} = ${total}$。`,
          ],
        );
      },
    ),
  ],
  "area-with-unit-squares": [
    skill(
      "half-squares-in-an-area",
      ["Half squares in an area", "面积中的半格"],
      [
        "Two half squares fit together to make one whole square. So when a shape uses half squares, pair them up and add the pairs to the count of whole squares.",
        "两个半格拼起来是一个整格。所以图形中有半格时，把它们两两配对，再加到整格的数量上。",
      ],
      (rng) => {
        const whole1 = rng.int(3, 20);
        const pairs = rng.int(1, 6);
        return whole(
          [
            `A shape covers ${whole1} whole unit squares and ${2 * pairs} half squares. What is its area, in square units?`,
            `一个图形覆盖 ${whole1} 个整格和 ${2 * pairs} 个半格。它的面积是多少平方单位？`,
          ],
          whole1 + pairs,
          [whole1 + 2 * pairs, whole1, whole1 + pairs + 1],
          [
            `${2 * pairs} half squares make ${pairs} whole ones, so the area is $${whole1} + ${pairs} = ${whole1 + pairs}$.`,
            `${2 * pairs} 个半格拼成 ${pairs} 个整格，所以面积是 $${whole1} + ${pairs} = ${whole1 + pairs}$。`,
          ],
        );
      },
    ),
  ],
  "area-of-a-rectangle-by-multiplying": [
    {
      ...skill(
        "doubling-a-side-of-a-rectangle",
        ["Doubling a side of a rectangle", "把长方形的一边加倍"],
        [
          "Doubling one side of a rectangle doubles the number of rows or columns, and so it doubles the area. The other side stays the same, so the area grows by the same factor.",
          "把长方形的一边加倍，行数或列数也加倍，所以面积也加倍。另一边不变，面积按同样的倍数增大。",
        ],
        (rng) => {
          const a = rng.int(2, 12);
          const b = rng.int(2, 12);
          const k = rng.int(2, 3);
          return whole(
            [
              `A rectangle is ${a} cm by ${b} cm. Its side of ${a} cm is made ${k} times as long, and the other side stays. What is the new area, in square centimeters?`,
              `一个长方形长 ${a} 厘米、宽 ${b} 厘米。把 ${a} 厘米的边变成原来的 ${k} 倍，另一边不变。新的面积是多少平方厘米？`,
            ],
            k * a * b,
            [a * b, k * a + b, k * k * a * b],
            [
              `The new sides are ${k * a} cm and ${b} cm, so the area is $${k * a} \\times ${b} = ${k * a * b}$, which is ${k} times the old ${a * b}.`,
              `新的边长是 ${k * a} 厘米和 ${b} 厘米，面积是 $${k * a} \\times ${b} = ${k * a * b}$，是原来 ${a * b} 的 ${k} 倍。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["area-of-a-rectangle-by-multiplying#doubling-a-side-of-a-rectangle"],
    },
  ],
  "area-of-combined-rectangles": [
    {
      ...skill(
        "an-l-shape-from-its-sides",
        ["An L shape from a big rectangle", "由大长方形求 L 形"],
        [
          "An L shape can be seen as a big rectangle with a corner rectangle taken out. Find both areas and subtract, without having to split the L into two parts.",
          "L 形可以看作大长方形去掉一个角上的小长方形。求出两个面积再相减，不必把 L 形分成两部分。",
        ],
        (rng) => {
          const w = rng.int(6, 12);
          const h = rng.int(6, 12);
          const a = rng.int(2, w - 2);
          const b = rng.int(2, h - 2);
          return whole(
            [
              `An L-shaped floor is a ${w} m by ${h} m rectangle with a ${a} m by ${b} m corner removed. What is its area, in square meters?`,
              `一块 L 形地面是由 ${w} 米乘 ${h} 米的长方形去掉一个 ${a} 米乘 ${b} 米的角得到的。它的面积是多少平方米？`,
            ],
            w * h - a * b,
            [w * h + a * b, w * h, (w - a) * (h - b)],
            [
              `The big rectangle is $${w} \\times ${h} = ${w * h}$ and the corner is $${a} \\times ${b} = ${a * b}$, so the L is $${w * h} - ${a * b} = ${w * h - a * b}$.`,
              `大长方形是 $${w} \\times ${h} = ${w * h}$，角是 $${a} \\times ${b} = ${a * b}$，所以 L 形是 $${w * h} - ${a * b} = ${w * h - a * b}$。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["area-of-combined-rectangles#an-l-shape-from-its-sides"],
    },
  ],
  "perimeter-of-polygons": [
    {
      ...skill(
        "a-side-from-a-regular-perimeter",
        ["A side from a perimeter with equal sides", "由周长求等边图形的边长"],
        [
          "If all sides of a polygon are equal, its perimeter is the side times the number of sides. Dividing the perimeter by the number of sides gives the length of one side.",
          "如果多边形的边都相等，周长就是边长乘以边数。周长除以边数，就得到一条边的长度。",
        ],
        (rng) => {
          const kinds: readonly [Pair, number][] = [
            [["equilateral triangle", "等边三角形"], 3],
            [["square", "正方形"], 4],
            [["pentagon with all sides equal", "各边相等的五边形"], 5],
            [["hexagon with all sides equal", "各边相等的六边形"], 6],
            [["octagon with all sides equal", "各边相等的八边形"], 8],
          ];
          const [name, n] = rng.pick(kinds);
          const s = rng.int(2, 12);
          return whole(
            [
              `A ${name[0]} has a perimeter of ${n * s} cm. How long is each side, in centimeters?`,
              `一个${name[1]}的周长是 ${n * s} 厘米。每条边长多少厘米？`,
            ],
            s,
            [n * s - n, n, s + 1],
            [
              `All ${n} sides are equal, so one side is $${n * s} \\div ${n} = ${s}$.`,
              `${n} 条边都相等，所以一条边是 $${n * s} \\div ${n} = ${s}$。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["perimeter-of-polygons#a-side-from-a-regular-perimeter"],
    },
  ],
  "same-perimeter-or-same-area": [
    {
      ...skill(
        "the-longest-perimeter-for-an-area",
        ["The longest perimeter for an area", "面积一定时最大的周长"],
        [
          "Rectangles with the same area can have very different perimeters. The longest, thinnest one has the greatest perimeter; with whole sides that is the one with a side of 1.",
          "面积相同的长方形周长可能相差很大。最细长的那个周长最大；边长为整数时，就是有一条边长为 1 的那个。",
        ],
        (rng) => {
          const area = rng.int(12, 60);
          return whole(
            [
              `A rectangle with whole-number sides has an area of ${area} square centimeters. What is the largest perimeter it can have, in centimeters?`,
              `一个边长为整数的长方形面积是 ${area} 平方厘米。它的周长最大是多少厘米？`,
            ],
            2 * (area + 1),
            [area + 1, 2 * area, 4 * Math.ceil(Math.sqrt(area))],
            [
              `The thinnest rectangle is 1 cm by ${area} cm, with perimeter $2 \\times (1 + ${area}) = ${2 * (area + 1)}$.`,
              `最细长的长方形是 1 厘米乘 ${area} 厘米，周长是 $2 \\times (1 + ${area}) = ${2 * (area + 1)}$。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["same-perimeter-or-same-area#the-longest-perimeter-for-an-area"],
    },
  ],
  "sorting-quadrilaterals": [
    {
      ...skill(
        "true-of-every-rectangle",
        ["True of every shape in a family", "一族图形共有的性质"],
        [
          "A name can cover several shapes. Every square is a rectangle and a rhombus, but not every rectangle is a square. A statement about a family must hold for all its members.",
          "一个名称可以包含多种图形。每个正方形都是长方形和菱形，但不是每个长方形都是正方形。关于一族图形的说法必须对其中每一个都成立。",
        ],
        (rng) => {
          const facts: readonly [Pair, Pair, readonly Pair[]][] = [
            [
              ["rectangle", "长方形"],
              ["four right angles", "四个直角"],
              [
                ["four equal sides", "四条相等的边"],
                ["no parallel sides", "没有平行的边"],
                ["exactly one pair of parallel sides", "恰好一组平行的边"],
              ],
            ],
            [
              ["rhombus", "菱形"],
              ["four equal sides", "四条相等的边"],
              [
                ["four right angles", "四个直角"],
                ["no parallel sides", "没有平行的边"],
                ["exactly one pair of parallel sides", "恰好一组平行的边"],
              ],
            ],
            [
              ["square", "正方形"],
              ["four equal sides and four right angles", "四条相等的边和四个直角"],
              [
                ["four equal sides and no right angles", "四条相等的边，没有直角"],
                ["exactly one right angle", "恰好一个直角"],
                ["exactly one pair of parallel sides", "恰好一组平行的边"],
              ],
            ],
            [
              ["trapezoid", "梯形"],
              ["at least one pair of parallel sides", "至少一组平行的边"],
              [
                ["four right angles", "四个直角"],
                ["four equal sides", "四条相等的边"],
                ["no parallel sides", "没有平行的边"],
              ],
            ],
          ];
          const [name, right, wrong] = rng.pick(facts);
          const names = rng.pick(earlyNames);
          return choose(
            rng,
            [
              `${names} draws a ${name[0]}. What must it have, however it is drawn?`,
              `${names} 画了一个${name[1]}。无论怎么画，它一定有什么？`,
            ],
            right,
            wrong,
            [
              `Being a ${name[0]} means having ${right[0]}; the other features can fail for some ${name[0]}s or never hold.`,
              `作为${name[1]}就要有${right[1]}；其他特征对某些${name[1]}不成立，或者永远不成立。`,
            ],
          );
        },
      ),
      figure: gradeDrawings2["sorting-quadrilaterals#true-of-every-rectangle"],
    },
  ],
  "equal-parts-of-shapes": [
    skill(
      "how-many-equal-parts-from-the-area",
      ["How many equal parts from the area", "由面积求份数"],
      [
        "When a shape is cut into parts of equal area, each part is the same unit fraction of the whole. The number of parts is the whole area divided by the area of one part.",
        "把图形分成面积相等的几份时，每份都是整体的同一个几分之一。份数等于总面积除以一份的面积。",
      ],
      (rng) => {
        const each = rng.int(2, 9);
        const parts = rng.int(2, 8);
        return whole(
          [
            `A garden with an area of ${each * parts} square meters is cut into parts of ${each} square meters each. Each part is $\\frac{1}{n}$ of the garden. What is $n$?`,
            `一块面积为 ${each * parts} 平方米的花园被分成若干份，每份 ${each} 平方米。每份是花园的 $\\frac{1}{n}$。$n$ 是多少？`,
          ],
          parts,
          [each, each * parts, parts + 1],
          [
            `$${each * parts} \\div ${each} = ${parts}$ parts, so each part is $\\frac{1}{${parts}}$ of the garden.`,
            `$${each * parts} \\div ${each} = ${parts}$ 份，所以每份是花园的 $\\frac{1}{${parts}}$。`,
          ],
        );
      },
    ),
  ],
};
