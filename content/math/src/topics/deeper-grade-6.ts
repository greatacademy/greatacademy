// Further knowledge points for topics of 6th Grade Math, each a skill the topic's
// own points leave out: working backwards, reasoning about a whole problem instead
// of one step, or a fact used in a new setting. See `deeperGrade6Points`.

import type { Figure, KnowledgePointDef } from "@ga/content";
import { dec, Q } from "@ga/subject-math";
import { earlyNames } from "../early-grades-kit.ts";
import { gradeDrawings4 } from "../explanation-drawings-grades-4.ts";
import { remainingDrawings2 } from "../explanation-drawings-remaining-2.ts";
import { mixedLatex } from "../problems.ts";
import { type Pair, tableFigure } from "./early-grades-more-kit.ts";
import { theFirstPowerAboveANumber, theMissingExponentOfAFraction } from "./grade-5-decimals.ts";
import { drawn, lesson, type Off, valued } from "./grade-6-kit.ts";
import { equalTape, lineFigure, tapeFigure } from "./upper-grades-kit.ts";

/** gcd6 is the greatest common factor of two positive integers. */
const gcd6 = (a: number, b: number): number => (b === 0 ? a : gcd6(b, a % b));

const ratioAfterAdding = lesson(
  "how-much-to-add-for-a-new-ratio",
  ["How much to add for a new ratio", "加多少才得到新的比"],
  [
    [
      "When only one amount changes, the other stays the same and fixes the size of a group. Find the number of groups from the fixed amount, then use the new ratio to see what the changing amount must become. $6$ red and $2$ blue beads, new ratio $3 : 4$: the red make $2$ groups of $3$, so blue must become $4 \\times 2 = 8$, and we add $8 - 2 = 6$.",
      "只有一个量变化时，另一个量不变，它决定了每组的大小。先用不变的量求出有几组，再用新的比算出变化的量应该变成多少。$6$ 颗红珠子和 $2$ 颗蓝珠子，新比是 $3 : 4$：红珠子是 $2$ 组 $3$ 颗，所以蓝珠子要变成 $4 \\times 2 = 8$ 颗，要加 $8 - 2 = 6$ 颗。",
    ],
    ["$6 : 8 = 3 : 4$.", "$6 : 8 = 3 : 4$。"],
    [
      "The answer is the amount to add, not the new amount. Here $8$ is the new number of blue beads; we add $6$.",
      "答案是要加的数量，不是加后的数量。这里 $8$ 是加后蓝珠子的数量，要加的是 $6$。",
    ],
  ],
  (rng) => {
    const p = rng.int(2, 7);
    const q = rng.pick([1, 2, 3, 4, 5, 6, 7].filter((v) => gcd6(v, p) === 1));
    const r = rng.pick([...Array(8).keys()].map((i) => q + 1 + i).filter((v) => gcd6(v, p) === 1));
    const k = rng.int(2, 12);
    const answer = (r - q) * k;
    return valued(
      [
        `A bag has $${p * k}$ red beads and $${q * k}$ blue beads. How many blue beads must be added so that the ratio of red to blue becomes $${p} : ${r}$?`,
        `袋子里有 $${p * k}$ 颗红珠子和 $${q * k}$ 颗蓝珠子。要加多少颗蓝珠子，才能使红珠子与蓝珠子的比变成 $${p} : ${r}$？`,
      ],
      answer,
      [
        [
          ["Count the groups", "求组数"],
          [`The red beads stay the same, in groups of $${p}$:`, `红珠子不变，每组 $${p}$ 颗：`],
          [`${p * k} \\div ${p} = ${k}`],
        ],
        [
          ["Find the new blue", "求加后的蓝珠子"],
          [`Blue needs $${r}$ in each group:`, `每组要有 $${r}$ 颗蓝珠子：`],
          [`${r} \\times ${k} = ${r * k}`],
        ],
        [["Subtract", "相减"], ["The beads to add:", "要加的珠子："], [`${r * k} - ${q * k} = ${answer}`]],
      ],
      [
        `$${p * k} : ${r * k}$, and dividing both by $${k}$ gives $${p} : ${r}$.`,
        `$${p * k} : ${r * k}$，前后项都除以 $${k}$ 得 $${p} : ${r}$。`,
      ],
      [
        [r * k, "That is the new number of blue beads, not the number added.", "这是加后蓝珠子的数量，不是要加的数量。"],
        [
          r - q,
          `That adds only $${r} - ${q}$, as if there were one group. There are $${k}$ groups.`,
          `这只加了 $${r} - ${q}$，好像只有一组。其实有 $${k}$ 组。`,
        ],
        [r, `That is the number in the ratio. The red beads make $${k}$ groups.`, `这是比里的数。红珠子有 $${k}$ 组。`],
        [answer + k, "That is one group too many.", "这多算了一组。"],
      ],
    );
  },
  tapeFigure(
    [
      { total: "6", pieces: [0, 1].map(() => ({ size: 3, text: "3" })) },
      {
        total: "8",
        pieces: [
          { size: 2, text: "2" },
          { size: 6, text: "+6", lit: true, dashed: true },
        ],
      },
    ],
    [
      "Red stays at 6, two groups of 3, so blue must grow from 2 to 8: add 6.",
      "红珠子仍是 6 颗，2 组 3 颗，所以蓝珠子要从 2 颗变成 8 颗：加 6 颗。",
    ],
  ),
);

const closingSpeeds = lesson(
  "how-long-until-two-movers-meet",
  ["How long until two movers meet", "两个运动者多久相遇"],
  [
    [
      "When two cars drive towards each other, the gap shrinks by both speeds together each hour, so add the speeds. When one chases the other, the gap shrinks only by the difference. Divide the gap by that closing speed. $300$ km apart at $60$ and $40$ km/h towards each other: $300 \\div 100 = 3$ hours.",
      "两辆车相向而行时，每小时距离缩小两个速度之和，所以要把速度相加。一辆追另一辆时，距离只缩小速度之差。用距离除以这个缩小的速度。相距 $300$ 千米，时速 $60$ 和 $40$ 千米相向而行：$300 \\div 100 = 3$ 小时。",
    ],
    ["In $3$ hours they drive $180$ and $120$ km, and $180 + 120 = 300$.", "$3$ 小时里两车分别行 $180$ 和 $120$ 千米，$180 + 120 = 300$。"],
    [
      "Use both speeds, not just one. $300 \\div 60 = 5$ hours would be right only if the other car stood still.",
      "两个速度都要用，不能只用一个。$300 \\div 60 = 5$ 小时只有在另一辆车不动时才对。",
    ],
  ],
  (rng) => {
    const fast = rng.int(8, 18) * 5;
    const slow = rng.int(2, fast / 5 - 2) * 5;
    const hours = rng.int(2, 9);
    const towards = rng.bool();
    const rate = towards ? fast + slow : fast - slow;
    const gap = rate * hours;
    const sign = towards ? "+" : "-";
    const other = towards ? fast - slow : fast + slow;
    const offs: Off[] = [
      [Q.of(gap, fast), "That uses only the faster car's speed.", "这只用了快车的速度。"],
      [Q.of(gap, slow), "That uses only the slower car's speed.", "这只用了慢车的速度。"],
      [
        Q.of(gap, other),
        towards ? "That subtracts the speeds. Driving towards each other, add them." : "That adds the speeds. In a chase, subtract them.",
        towards ? "这是把速度相减。相向而行要相加。" : "这是把速度相加。追及要相减。",
      ],
      [hours + 1, "That is one hour too long.", "这多了一小时。"],
    ];
    return valued(
      towards
        ? [
            `Two cars start $${gap}$ km apart and drive towards each other at $${fast}$ km/h and $${slow}$ km/h. After how many hours do they meet?`,
            `两辆车相距 $${gap}$ 千米，分别以每小时 $${fast}$ 千米和 $${slow}$ 千米相向而行。多少小时后相遇？`,
          ]
        : [
            `A car driving at $${slow}$ km/h is $${gap}$ km ahead of a car driving at $${fast}$ km/h in the same direction. After how many hours does the faster car catch up?`,
            `一辆时速 $${slow}$ 千米的车在一辆时速 $${fast}$ 千米的车前方 $${gap}$ 千米，同向行驶。多少小时后快车追上慢车？`,
          ],
      hours,
      [
        [
          ["Find the closing speed", "求距离缩小的速度"],
          towards ? ["They come together, so add:", "相向而行，速度相加："] : ["One chases the other, so subtract:", "追及，速度相减："],
          [`${fast} ${sign} ${slow} = ${rate}`],
        ],
        [["Divide the gap", "用距离除"], ["Hours to close the gap:", "缩完这段距离要的时间："], [`${gap} \\div ${rate} = ${hours}`]],
      ],
      towards
        ? [
            `In $${hours}$ hours the cars drive $${fast * hours}$ and $${slow * hours}$ km, and $${fast * hours} + ${slow * hours} = ${gap}$.`,
            `$${hours}$ 小时里两车分别行 $${fast * hours}$ 和 $${slow * hours}$ 千米，$${fast * hours} + ${slow * hours} = ${gap}$。`,
          ]
        : [
            `In $${hours}$ hours the fast car drives $${fast * hours}$ km and the slow one $${slow * hours}$ km, and $${fast * hours} - ${slow * hours} = ${gap}$.`,
            `$${hours}$ 小时里快车行 $${fast * hours}$ 千米，慢车行 $${slow * hours}$ 千米，$${fast * hours} - ${slow * hours} = ${gap}$。`,
          ],
      offs,
    );
  },
  lineFigure(
    {
      lo: 0,
      hi: 300,
      step: 50,
      labels: [0, 300],
      marks: [{ at: 180, text: "180", result: true }],
      jumps: [
        [0, 180],
        [300, 180],
      ],
    },
    [
      "Starting 300 km apart, the cars close 100 km each hour and meet at 180 after 3 hours.",
      "两车相距 300 千米，每小时靠近 100 千米，3 小时后在 180 处相遇。",
    ],
  ),
);

const givingToEqualize = lesson(
  "giving-away-to-make-two-amounts-equal",
  ["Giving away to make two amounts equal", "给出多少使两个量相等"],
  [
    [
      "When one person gives some to another, the giver loses it and the receiver gains it, so the gap shrinks by twice the amount given. To make two amounts equal, give half of the difference. $40$ marbles in the ratio $3 : 1$ are $30$ and $10$; the difference is $20$, so give $10$.",
      "一个人给另一个人一些时，给的人少了这些，收的人多了这些，所以差距缩小的是给出数量的两倍。要使两个量相等，只需给出差的一半。$40$ 颗弹珠按 $3 : 1$ 是 $30$ 颗和 $10$ 颗，差是 $20$，所以给 $10$ 颗。",
    ],
    ["After giving $10$: $30 - 10 = 20$ and $10 + 10 = 20$.", "给出 $10$ 颗后：$30 - 10 = 20$，$10 + 10 = 20$。"],
    [
      "Do not give the whole difference. Giving $20$ would leave $10$ and $30$, just swapped.",
      "不要给出整个差。给 $20$ 颗会变成 $10$ 和 $30$，只是对调了。",
    ],
  ],
  (rng) => {
    const q = rng.int(1, 6);
    const p = rng.pick([1, 2, 3, 4, 5].map((i) => q + i).filter((v) => gcd6(v, q) === 1));
    const unit = 2 * rng.int(2, 12);
    const total = (p + q) * unit;
    const diff = (p - q) * unit;
    const answer = diff / 2;
    return valued(
      [
        `Sam and Kim have $${total}$ marbles in all, in the ratio $${p} : ${q}$. How many marbles must Sam give to Kim so that they have the same number?`,
        `萨姆和基姆一共有 $${total}$ 颗弹珠，比是 $${p} : ${q}$。萨姆要给基姆多少颗，两人才一样多？`,
      ],
      answer,
      [
        [
          ["Find both amounts", "求两人各有多少"],
          [`One part is $${total} \\div ${p + q} = ${unit}$:`, `一份是 $${total} \\div ${p + q} = ${unit}$：`],
          [`${p} \\times ${unit} = ${p * unit}`, `${q} \\times ${unit} = ${q * unit}`],
        ],
        [
          ["Halve the difference", "差的一半"],
          ["Giving moves both amounts, so give half:", "给出会让两边都变，所以给一半："],
          [`(${p * unit} - ${q * unit}) \\div 2 = ${answer}`],
        ],
      ],
      [
        `Each ends with $${total} \\div 2 = ${total / 2}$, and $${p * unit} - ${answer} = ${total / 2}$.`,
        `两人最后各有 $${total} \\div 2 = ${total / 2}$ 颗，而 $${p * unit} - ${answer} = ${total / 2}$。`,
      ],
      [
        [diff, "That is the whole difference; it would just swap the amounts.", "这是整个差，给了只会让两人的数量对调。"],
        [total / 2, "That is how many each will have, not how many to give.", "这是每人最后有多少，不是要给多少。"],
        [q * unit, "That is how many Kim has now.", "这是基姆现在有的数量。"],
        [p - q, "That is the difference of the ratio's numbers, not of the marbles.", "这是比的两项之差，不是弹珠数之差。"],
      ],
    );
  },
  drawn(gradeDrawings4["tape-diagrams#giving-away-to-make-two-amounts-equal"]),
);

const totalFromTheRest = lesson(
  "the-total-from-the-rest-of-a-group",
  ["The total from the rest of a group", "由其余部分求总数"],
  [
    [
      "The percents of the parts of a group add up to $100\\%$. If a count belongs to the other part, first find that part's percent by subtracting from $100\\%$. Then divide the count by that percent. $30\\%$ walk and the other $140$ ride: riders are $70\\%$, so the total is $140 \\div 0.7 = 200$.",
      "一个群体各部分的百分数加起来是 $100\\%$。如果给出的人数属于另一部分，先用 $100\\%$ 减，求出这部分的百分数。再用人数除以这个百分数。$30\\%$ 步行，其余 $140$ 人乘车：乘车的占 $70\\%$，所以总数是 $140 \\div 0.7 = 200$。",
    ],
    ["$30\\%$ of $200$ is $60$, and $60 + 140 = 200$.", "$200$ 的 $30\\%$ 是 $60$，$60 + 140 = 200$。"],
    [
      "Match the count with its own percent. The $140$ riders are $70\\%$, not $30\\%$.",
      "人数要配上它自己的百分数。$140$ 名乘车的学生占 $70\\%$，不是 $30\\%$。",
    ],
  ],
  (rng) => {
    const pct = rng.pick([10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90]);
    const total = 20 * rng.int(2, 40);
    const rest = (total * (100 - pct)) / 100;
    const walkers = total - rest;
    return valued(
      [
        `In a school, $${pct}\\%$ of the students walk to school. The other $${rest}$ students ride. How many students are in the school?`,
        `一所学校有 $${pct}\\%$ 的学生步行上学，其余 $${rest}$ 名学生乘车。这所学校有多少名学生？`,
      ],
      total,
      [
        [
          ["Find the riders' percent", "求乘车的百分数"],
          ["The parts make $100\\%$:", "各部分合起来是 $100\\%$："],
          [`100\\% - ${pct}\\% = ${100 - pct}\\%`],
        ],
        [
          ["Find the total", "求总数"],
          [`$${rest}$ students are $${100 - pct}\\%$:`, `$${rest}$ 人占 $${100 - pct}\\%$：`],
          [`${rest} \\div ${dec(Q.of(100 - pct, 100))} = ${total}`],
        ],
      ],
      [
        `$${pct}\\%$ of $${total}$ is $${walkers}$, and $${walkers} + ${rest} = ${total}$.`,
        `$${total}$ 的 $${pct}\\%$ 是 $${walkers}$，$${walkers} + ${rest} = ${total}$。`,
      ],
      [
        [
          Q.of(rest * 100, pct),
          `That pairs $${rest}$ with $${pct}\\%$. The riders are $${100 - pct}\\%$.`,
          `这是把 $${rest}$ 和 $${pct}\\%$ 配在一起。乘车的占 $${100 - pct}\\%$。`,
        ],
        [rest, "That is only the students who ride.", "这只是乘车的学生。"],
        [
          rest + pct,
          "That adds the percent to the count, which are different kinds of number.",
          "这是把百分数加到人数上，两者不能直接相加。",
        ],
        [total + walkers, `That adds the $${walkers}$ walkers twice.`, `这把 $${walkers}$ 名步行的学生算了两次。`],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "200",
        pieces: [
          { size: 30, text: "30%" },
          { size: 70, text: "140", lit: true },
        ],
      },
    ],
    ["The 140 riders fill the 70% part of the bar, so the whole bar is 200.", "140 名乘车的学生占长条的 70%，所以整条是 200。"],
  ),
);

const swappingPercent = lesson(
  "swapping-a-percent-and-its-number",
  ["Swapping a percent and its number", "交换百分数和它的数"],
  [
    [
      "$a\\%$ of $b$ means $a \\times b \\div 100$, and the order of multiplying does not matter. So $a\\%$ of $b$ always equals $b\\%$ of $a$. That can make a hard one easy: $36\\%$ of $25$ equals $25\\%$ of $36$, a quarter of $36$, which is $9$.",
      "$b$ 的 $a\\%$ 就是 $a \\times b \\div 100$，而乘法的顺序不影响结果。所以 $b$ 的 $a\\%$ 总是等于 $a$ 的 $b\\%$。这能把难题变容易：$25$ 的 $36\\%$ 等于 $36$ 的 $25\\%$，也就是 $36$ 的四分之一，是 $9$。",
    ],
    ["$36 \\times 25 \\div 100 = 900 \\div 100 = 9$.", "$36 \\times 25 \\div 100 = 900 \\div 100 = 9$。"],
    [
      "The two numbers trade places; they do not add up to $100$. $36\\%$ of $25$ is not $64\\%$ of anything.",
      "两个数是交换位置，不是凑成 $100$。$25$ 的 $36\\%$ 和 $64\\%$ 无关。",
    ],
  ],
  (rng) => {
    const a = rng.int(2, 99);
    let b = rng.int(2, 98);
    if (b >= a) b += 1;
    return valued(
      [
        `Find the missing number: $${a}\\%$ of $${b}$ equals $\\square\\%$ of $${a}$.`,
        `求缺失的数：$${b}$ 的 $${a}\\%$ 等于 $${a}$ 的 $\\square\\%$。`,
      ],
      b,
      [
        [
          ["Write the left side", "写出左边"],
          ["A percent of a number is a product over 100:", "一个数的百分之几是乘积除以 100："],
          [`${a}\\% \\text{ of } ${b} = ${a} \\times ${b} \\div 100`],
        ],
        [
          ["Swap the order", "交换顺序"],
          ["Multiplying in the other order:", "换个顺序相乘："],
          [`${b} \\times ${a} \\div 100 = ${b}\\% \\text{ of } ${a}`],
        ],
      ],
      [`Both sides are $${a * b} \\div 100 = ${dec(Q.of(a * b, 100))}$.`, `两边都是 $${a * b} \\div 100 = ${dec(Q.of(a * b, 100))}$。`],
      [
        [a, `That is the number $${a}$ again. The percent and its number trade places.`, `这又是 $${a}$。应该是百分数和它的数交换位置。`],
        [100 - b, `That makes the two percents add to $100$. They should swap instead.`, `这是让两个百分数凑成 $100$。应该交换位置。`],
        [a + b, "That adds the numbers instead of swapping them.", "这是把两个数相加，不是交换。"],
        [b + 1, `That is one more than $${b}$.`, `这比 $${b}$ 多了 $1$。`],
      ],
    );
  },
  tableFigure(["36% x 25", "25% x 36"], [9, 9]),
);

const sumAcrossForms = lesson(
  "adding-a-fraction-a-percent-and-a-decimal",
  ["Adding a fraction, a percent and a decimal", "分数、百分数和小数相加"],
  [
    [
      "A fraction, a percent and a decimal can be added once they are in the same form. Percents are often easiest: write the fraction over $100$ and multiply the decimal by $100$. $\\frac{1}{4} + 30\\% + 0.2 = 25\\% + 30\\% + 20\\% = 75\\%$.",
      "分数、百分数和小数化成同一种形式后就能相加。百分数通常最方便：把分数写成分母是 $100$ 的分数，把小数乘 $100$。$\\frac{1}{4} + 30\\% + 0.2 = 25\\% + 30\\% + 20\\% = 75\\%$。",
    ],
    ["As decimals: $0.25 + 0.3 + 0.2 = 0.75 = 75\\%$.", "化成小数：$0.25 + 0.3 + 0.2 = 0.75 = 75\\%$。"],
    [
      "Change every part first. $0.2$ is $20\\%$, not $0.2\\%$, and $\\frac{1}{4}$ is not $1\\%$ or $4\\%$.",
      "每一部分都要先化。$0.2$ 是 $20\\%$，不是 $0.2\\%$；$\\frac{1}{4}$ 也不是 $1\\%$ 或 $4\\%$。",
    ],
  ],
  (rng) => {
    const [n, d] = rng.pick([
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [1, 2],
      [1, 10],
      [3, 10],
      [7, 10],
      [1, 20],
    ]) as [number, number];
    const fracPct = (n * 100) / d;
    const pct = 5 * rng.int(1, 12);
    const decTenths = rng.int(1, 9);
    const hundredths = rng.bool() ? 0 : rng.pick([2, 4, 5, 6, 8]);
    const decPct = decTenths * 10 + hundredths;
    const answer = fracPct + pct + decPct;
    const decText = `0.${decTenths}${hundredths === 0 ? "" : hundredths}`;
    return valued(
      [
        `Write $\\frac{${n}}{${d}} + ${pct}\\% + ${decText}$ as a percent.`,
        `把 $\\frac{${n}}{${d}} + ${pct}\\% + ${decText}$ 写成百分数。`,
      ],
      answer,
      [
        [
          ["Change each to a percent", "都化成百分数"],
          ["Fraction over 100, decimal times 100:", "分数化成分母 100，小数乘 100："],
          [`\\frac{${n}}{${d}} = \\frac{${fracPct}}{100} = ${fracPct}\\%`, `${decText} = ${decPct}\\%`],
        ],
        [
          ["Add", "相加"],
          ["Now all three are percents:", "三个都是百分数了："],
          [`${fracPct}\\% + ${pct}\\% + ${decPct}\\% = ${answer}\\%`],
        ],
      ],
      [
        `As decimals: $${dec(Q.of(fracPct, 100))} + ${dec(Q.of(pct, 100))} + ${decText} = ${dec(Q.of(answer, 100))}$, which is $${answer}\\%$.`,
        `化成小数：$${dec(Q.of(fracPct, 100))} + ${dec(Q.of(pct, 100))} + ${decText} = ${dec(Q.of(answer, 100))}$，就是 $${answer}\\%$。`,
      ],
      [
        [fracPct + pct, `That leaves out the decimal $${decText}$.`, `这漏掉了小数 $${decText}$。`],
        [pct + decPct, `That leaves out the fraction $\\frac{${n}}{${d}}$.`, `这漏掉了分数 $\\frac{${n}}{${d}}$。`],
        [
          n + d + pct + decPct,
          `That uses $${n} + ${d}$ for the fraction. Write it over $100$ instead.`,
          `这把分数当成 $${n} + ${d}$。应该化成分母 $100$ 的分数。`,
        ],
        [answer + 10, "That is $10\\%$ too much.", "这多了 $10\\%$。"],
      ],
      { percent: true },
    );
  },
  tapeFigure(
    [
      {
        total: "75%",
        pieces: [
          { size: 25, text: "25" },
          { size: 30, text: "30", lit: true },
          { size: 20, text: "20" },
        ],
      },
    ],
    ["1/4, 30% and 0.2 as percents: 25 + 30 + 20 = 75%.", "1/4、30% 和 0.2 化成百分数：25 + 30 + 20 = 75%。"],
  ),
);
const perimeterFromFractionalArea = lesson(
  "the-perimeter-from-a-fractional-area",
  ["The perimeter from a fractional area", "由分数面积求周长"],
  [
    [
      "A rectangle's area divided by one side gives the other side, even when the numbers are fractions. With both sides known, add them and double for the perimeter. Area $\\frac{3}{4}$ m² and a side of $\\frac{3}{2}$ m: the other side is $\\frac{3}{4} \\div \\frac{3}{2} = \\frac{1}{2}$ m, so the perimeter is $2 \\times (\\frac{3}{2} + \\frac{1}{2}) = 4$ m.",
      "长方形的面积除以一条边，得到另一条边，分数也一样。两条边都知道后，相加再乘 2 就是周长。面积 $\\frac{3}{4}$ 平方米，一条边 $\\frac{3}{2}$ 米：另一条边是 $\\frac{3}{4} \\div \\frac{3}{2} = \\frac{1}{2}$ 米，所以周长是 $2 \\times (\\frac{3}{2} + \\frac{1}{2}) = 4$ 米。",
    ],
    [
      "$\\frac{3}{2} \\times \\frac{1}{2} = \\frac{3}{4}$, the given area, so the second side is right.",
      "$\\frac{3}{2} \\times \\frac{1}{2} = \\frac{3}{4}$，正是给出的面积，所以另一条边对了。",
    ],
    [
      "Keep area and perimeter apart: the area is in square meters, the perimeter in meters, and both pairs of sides count.",
      "分清面积和周长：面积用平方米，周长用米，而且两组边都要算上。",
    ],
  ],
  (rng) => {
    const u = Q.of(rng.int(1, 5), rng.pick([2, 3, 4, 5]));
    let v = Q.of(rng.int(1, 7), rng.pick([2, 3, 4, 6]));
    while (v.eq(u)) v = Q.of(rng.int(1, 7), rng.pick([2, 3, 4, 6]));
    const area = u.mul(v);
    const half = u.add(v);
    const answer = half.mul(Q.of(2));
    return valued(
      [
        `A rectangle has an area of $${area.toLatex()}$ square meters, and one side measures $${u.toLatex()}$ m. What is its perimeter, in meters?`,
        `一个长方形的面积是 $${area.toLatex()}$ 平方米，一条边长 $${u.toLatex()}$ 米。它的周长是多少米？`,
      ],
      answer,
      [
        [
          ["The other side", "另一条边"],
          ["Divide the area by the known side:", "用面积除以已知的边："],
          [`${area.toLatex()} \\div ${u.toLatex()} = ${area.toLatex()} \\times ${Q.one.div(u).toLatex()} = ${v.toLatex()}`],
        ],
        [
          ["The perimeter", "周长"],
          ["Add the two sides and double:", "两条边相加再乘 2："],
          [`2 \\times (${u.toLatex()} + ${v.toLatex()}) = 2 \\times ${half.toLatex()} = ${answer.toLatex()}`],
        ],
      ],
      [
        `$${u.toLatex()} \\times ${v.toLatex()} = ${area.toLatex()}$, the given area, and $${u.toLatex()} + ${v.toLatex()} + ${u.toLatex()} + ${v.toLatex()} = ${answer.toLatex()}$.`,
        `$${u.toLatex()} \\times ${v.toLatex()} = ${area.toLatex()}$，正是给出的面积；$${u.toLatex()} + ${v.toLatex()} + ${u.toLatex()} + ${v.toLatex()} = ${answer.toLatex()}$。`,
      ],
      [
        [half, "That adds the two sides once; a rectangle has two of each.", "这只把两条边各加了一次；长方形每种边各有两条。"],
        [v, "That is the other side, not the perimeter.", "这是另一条边，不是周长。"],
        [area.mul(Q.of(2)), "That doubles the area instead of adding the sides.", "这是把面积乘 2，不是把边相加。"],
        [area.add(u).mul(Q.of(2)), "That uses the area as a side length.", "这把面积当成了边长。"],
      ],
      { unit: "m" },
    );
  },
  drawn(remainingDrawings2["finding-side-lengths-using-fraction-division#the-perimeter-from-a-fractional-area"]),
);

/** mixedText writes a fraction as plain text for a figure, like "2 1/4". */
function mixedText(q: Q): string {
  if (q.isInteger()) return `${q.n}`;
  const whole = q.n / q.d;
  const rest = q.n % q.d;
  return whole === 0n ? `${rest}/${q.d}` : `${whole} ${rest}/${q.d}`;
}

/** bottlesFigure draws the total as full bottles and the part left over, dashed. */
function bottlesFigure(size: Q, count: number, left: Q): Figure {
  const total = size.mul(Q.of(count)).add(left);
  return tapeFigure(
    [
      {
        total: `${mixedText(total)} L`,
        pieces: [
          ...Array.from({ length: count }, () => ({ size: size.toNumber(), text: mixedText(size), lit: true })),
          { size: left.toNumber(), text: "?", dashed: true },
        ],
      },
    ],
    [
      `A bar of ${mixedText(total)} liters cut into ${count} full bottles of ${mixedText(size)} liters and a dashed part left over.`,
      `一个 ${mixedText(total)} 升的长条，分成 ${count} 个装满的 ${mixedText(size)} 升瓶子和剩下的一段虚线部分。`,
    ],
  );
}

const leftoverAfterFilling = lesson(
  "what-is-left-after-filling-containers",
  ["What is left after filling containers", "装满容器后还剩多少"],
  [
    [
      "When a total is poured into containers of one size, find how many containers can be filled, multiply that count by the size of one, and subtract from the total. A tank of $10\\frac{1}{2}$ liters fills $4$ bottles of $2\\frac{1}{4}$ liters, since $4 \\times 2\\frac{1}{4} = 9$ and a fifth would need $11\\frac{1}{4}$; the rest is $10\\frac{1}{2} - 9 = 1\\frac{1}{2}$ liters.",
      "把总量倒进同样大小的容器里，先求能装满几个，用个数乘一个容器的大小，再从总量中减去。$10\\frac{1}{2}$ 升的果汁能装满 $4$ 个 $2\\frac{1}{4}$ 升的瓶子，因为 $4 \\times 2\\frac{1}{4} = 9$，而第五瓶需要 $11\\frac{1}{4}$；剩下 $10\\frac{1}{2} - 9 = 1\\frac{1}{2}$ 升。",
    ],
    [
      "$9 + 1\\frac{1}{2} = 10\\frac{1}{2}$, the total, and $1\\frac{1}{2}$ is less than one bottle.",
      "$9 + 1\\frac{1}{2} = 10\\frac{1}{2}$，正是总量，而且 $1\\frac{1}{2}$ 不到一瓶。",
    ],
    [
      "$10\\frac{1}{2} \\div 2\\frac{1}{4} = 4\\frac{2}{3}$: the $\\frac{2}{3}$ is a part of one bottle, not liters left over.",
      "$10\\frac{1}{2} \\div 2\\frac{1}{4} = 4\\frac{2}{3}$：这个 $\\frac{2}{3}$ 是一瓶的几分之几，不是剩下的升数。",
    ],
  ],
  (rng) => {
    const d = rng.pick([2, 3, 4, 5, 6, 8]);
    const size = Q.of(d + rng.pick([...Array(d - 1).keys()].map((i) => i + 1).filter((v) => gcd6(v, d) === 1)), d);
    const count = rng.int(3, 9);
    const answer = Q.of(rng.int(1, Number(size.n) - 1), Number(size.d));
    const filled = size.mul(Q.of(count));
    const total = filled.add(answer);
    return valued(
      [
        `A tank holds $${mixedLatex(total)}$ liters of juice. As many bottles as possible are filled, each holding $${mixedLatex(size)}$ liters. How many liters are left over?`,
        `一个罐子里有 $${mixedLatex(total)}$ 升果汁。尽量装满每瓶 $${mixedLatex(size)}$ 升的瓶子。还剩多少升？`,
      ],
      answer,
      [
        [
          ["Full bottles", "装满几瓶"],
          [
            `$${count}$ bottles fit, but $${count + 1}$ would need more than the tank holds:`,
            `能装 $${count}$ 瓶，装 $${count + 1}$ 瓶就超过了罐里的量：`,
          ],
          [
            `${count} \\times ${mixedLatex(size)} = ${mixedLatex(filled)}`,
            `${count + 1} \\times ${mixedLatex(size)} = ${mixedLatex(filled.add(size))} > ${mixedLatex(total)}`,
          ],
        ],
        [
          ["What is left", "剩下多少"],
          ["Subtract the juice in the bottles:", "减去瓶里的果汁："],
          [`${mixedLatex(total)} - ${mixedLatex(filled)} = ${mixedLatex(answer)}`],
        ],
      ],
      [
        `$${mixedLatex(filled)} + ${mixedLatex(answer)} = ${mixedLatex(total)}$, the total, and $${mixedLatex(answer)}$ is less than one bottle.`,
        `$${mixedLatex(filled)} + ${mixedLatex(answer)} = ${mixedLatex(total)}$，正是总量，而且 $${mixedLatex(answer)}$ 不到一瓶。`,
      ],
      [
        [Q.of(count), "That is the number of full bottles, not the juice left over.", "这是装满的瓶数，不是剩下的果汁。"],
        [answer.div(size), "That is the part of one bottle left over, not liters.", "这是剩下的部分占一瓶的几分之几，不是升数。"],
        [size.sub(answer), "That is how much more would fill one more bottle.", "这是再装满一瓶还差多少。"],
        [total.sub(size), "That takes away only one bottle.", "这只减去了一瓶。"],
      ],
      { figure: bottlesFigure(size, count, answer) },
    );
  },
  bottlesFigure(Q.of(9, 4), 4, Q.of(3, 2)),
);

const numbersAtADistance = lesson(
  "numbers-at-a-given-distance",
  ["Numbers at a given distance", "距离一定的数"],
  [
    [
      "Distance works from any starting number, not only from zero: two numbers lie at a given distance from a start, one on each side. Moving right adds the distance and moving left subtracts it. The numbers $9$ units from $-4$ are $-4 + 9 = 5$ and $-4 - 9 = -13$.",
      "距离可以从任何起点算起，不只是从零：与起点距离一定的数有两个，两侧各一个。向右移动加上距离，向左移动减去距离。与 $-4$ 相距 $9$ 的数是 $-4 + 9 = 5$ 和 $-4 - 9 = -13$。",
    ],
    [
      "From $-13$ up to $5$ is $13 + 5 = 18 = 2 \\times 9$, and $-4$ is in the middle.",
      "从 $-13$ 到 $5$ 是 $13 + 5 = 18 = 2 \\times 9$，$-4$ 正好在中间。",
    ],
    [
      "Start from $-4$, not from zero: $9$ and $-9$ are $9$ units from zero, not from $-4$.",
      "要从 $-4$ 出发，而不是从零：$9$ 和 $-9$ 与零相距 $9$，不是与 $-4$。",
    ],
  ],
  (rng) => {
    const start = rng.pick([...Array(40).keys()].map((i) => i - 20).filter((v) => v !== 0));
    const distance = rng.int(2, 30);
    const larger = rng.bool();
    const answer = larger ? start + distance : start - distance;
    const other = larger ? start - distance : start + distance;
    const s = start < 0 ? `(${start})` : `${start}`;
    return valued(
      [
        `Two numbers are each $${distance}$ units from $${start}$ on the number line. What is the ${larger ? "larger" : "smaller"} of the two?`,
        `数轴上有两个数，它们与 $${start}$ 的距离都是 $${distance}$。其中${larger ? "较大" : "较小"}的数是多少？`,
      ],
      answer,
      [
        [
          ["Pick the side", "选方向"],
          larger
            ? ["The larger one is to the right of the start, so add the distance.", "较大的数在起点右边，所以加上距离。"]
            : ["The smaller one is to the left of the start, so subtract the distance.", "较小的数在起点左边，所以减去距离。"],
        ],
        [
          ["Move", "移动"],
          [`From $${start}$, move $${distance}$:`, `从 $${start}$ 移动 $${distance}$：`],
          [`${start} ${larger ? "+" : "-"} ${distance} = ${answer}`],
        ],
      ],
      [
        `Back from $${answer}$ to $${start}$: $${larger ? `${answer} - ${s}` : `${start} - (${answer})`} = ${distance}$, and the other number is $${other}$.`,
        `从 $${answer}$ 回到 $${start}$：$${larger ? `${answer} - ${s}` : `${start} - (${answer})`} = ${distance}$，另一个数是 $${other}$。`,
      ],
      [
        [other, `That is the ${larger ? "smaller" : "larger"} of the two.`, `这是两个数中${larger ? "较小" : "较大"}的那个。`],
        [distance, "That is the distance itself, not a number at that distance.", "这是距离本身，不是与起点相距这么远的数。"],
        [-answer, "That has the wrong sign.", "这个数的符号错了。"],
        [larger ? distance : -distance, "That measures from zero instead of from the start.", "这是从零量起，而不是从起点量起。"],
      ],
      { form: "integer" },
    );
  },
  drawn(gradeDrawings4["interpreting-absolute-value#numbers-at-a-given-distance"]),
);

const halfwayPoint = lesson(
  "the-number-halfway-between-two-rationals",
  ["The number halfway between two rationals", "两个有理数正中间的数"],
  [
    [
      "The number halfway between two numbers is their mean: add them and divide by $2$, even when one is negative. Halfway between $-\\frac{3}{4}$ and $\\frac{5}{4}$ is $(-\\frac{3}{4} + \\frac{5}{4}) \\div 2 = \\frac{2}{4} \\div 2 = \\frac{1}{4}$.",
      "两个数正中间的数就是它们的平均数：相加后除以 $2$，其中一个是负数时也一样。$-\\frac{3}{4}$ 和 $\\frac{5}{4}$ 正中间的数是 $(-\\frac{3}{4} + \\frac{5}{4}) \\div 2 = \\frac{2}{4} \\div 2 = \\frac{1}{4}$。",
    ],
    [
      "From $-\\frac{3}{4}$ to $\\frac{5}{4}$ is $2$; half of it is $1$, and $-\\frac{3}{4} + 1 = \\frac{1}{4}$.",
      "从 $-\\frac{3}{4}$ 到 $\\frac{5}{4}$ 是 $2$；一半是 $1$，$-\\frac{3}{4} + 1 = \\frac{1}{4}$。",
    ],
    [
      "Half the distance, $1$, is how far to move, not where you land: add it to the smaller number.",
      "距离的一半 $1$ 是要走多远，不是落在哪里：要把它加到较小的数上。",
    ],
  ],
  (rng) => {
    const d = rng.pick([2, 3, 4, 5, 6]);
    const lowTop = rng.int(1, 12);
    const low = Q.of(-lowTop, d);
    const high = Q.of(((lowTop + rng.int(0, 10)) % 12) + 1, d);
    const sum = low.add(high);
    const answer = sum.div(Q.of(2));
    const gap = high.sub(low);
    const half = gap.div(Q.of(2));
    return valued(
      [
        `What number is halfway between $${low.toLatex()}$ and $${high.toLatex()}$?`,
        `$${low.toLatex()}$ 和 $${high.toLatex()}$ 正中间的数是多少？`,
      ],
      answer,
      [
        [["Add", "相加"], ["Add the two numbers:", "把两个数相加："], [`${low.toLatex()} + ${high.toLatex()} = ${sum.toLatex()}`]],
        [["Halve", "除以 2"], ["Divide the sum by $2$:", "把和除以 $2$："], [`${sum.toLatex()} \\div 2 = ${answer.toLatex()}`]],
      ],
      [
        `The distance is $${high.toLatex()} - (${low.toLatex()}) = ${gap.toLatex()}$; half of it is $${half.toLatex()}$, and $${low.toLatex()} + ${half.toLatex()} = ${answer.toLatex()}$.`,
        `距离是 $${high.toLatex()} - (${low.toLatex()}) = ${gap.toLatex()}$；一半是 $${half.toLatex()}$，$${low.toLatex()} + ${half.toLatex()} = ${answer.toLatex()}$。`,
      ],
      [
        [half, "That is half the distance, which still has to be added to the smaller number.", "这是距离的一半，还要加到较小的数上。"],
        [sum, "That adds the numbers but forgets to divide by $2$.", "这只相加了，忘了除以 $2$。"],
        [gap, "That is the distance between them, not the middle.", "这是两数间的距离，不是正中间的数。"],
        [high, "That is the larger number itself.", "这是较大的那个数本身。"],
      ],
    );
  },
  drawn(gradeDrawings4["identifying-rational-numbers-on-a-number-line#the-number-halfway-between-two-rationals"]),
);

const distanceToReflection = lesson(
  "the-distance-from-a-point-to-its-reflection",
  ["The distance from a point to its reflection", "点与它的对称点的距离"],
  [
    [
      "Reflecting a point in an axis keeps its distance from that axis and moves it to the other side, so the point and its image are twice as far apart as the point is from the axis. Across the $x$-axis only $y$ matters: $(4, -3)$ goes to $(4, 3)$, and they are $2 \\times 3 = 6$ apart.",
      "把一个点沿坐标轴对称，它到这条轴的距离不变，只是到了另一侧，所以点和它的像的距离是点到轴距离的两倍。沿 $x$ 轴对称只看 $y$：$(4, -3)$ 变成 $(4, 3)$，相距 $2 \\times 3 = 6$。",
    ],
    ["From $y = -3$ to $y = 3$ crosses the axis: $3 + 3 = 6$.", "从 $y = -3$ 到 $y = 3$ 跨过坐标轴：$3 + 3 = 6$。"],
    ["Across the $x$-axis, the $x$-coordinate $4$ stays the same and plays no part.", "沿 $x$ 轴对称时，横坐标 $4$ 不变，和距离无关。"],
  ],
  (rng) => {
    const nonzero = [...Array(30).keys()].map((i) => i - 15).filter((v) => v !== 0);
    const x = rng.pick(nonzero);
    const y = rng.pick(nonzero.filter((v) => Math.abs(v) !== Math.abs(x)));
    const overX = rng.bool();
    const c = overX ? y : x;
    const other = overX ? x : y;
    const image = overX ? `(${x}, ${-y})` : `(${-x}, ${y})`;
    const axis = overX ? "x" : "y";
    const answer = 2 * Math.abs(c);
    return valued(
      [
        `The point $(${x}, ${y})$ is reflected across the $${axis}$-axis. How far is the point from its image?`,
        `点 $(${x}, ${y})$ 沿 $${axis}$ 轴对称。这个点与它的像相距多远？`,
      ],
      answer,
      [
        [
          ["The image", "找出像"],
          [
            `Across the $${axis}$-axis the other coordinate changes sign; the point is $${Math.abs(c)}$ from the axis:`,
            `沿 $${axis}$ 轴对称，另一个坐标变号；点到轴的距离是 $${Math.abs(c)}$：`,
          ],
          [`(${x}, ${y}) \\to ${image}`],
        ],
        [
          ["Double", "乘 2"],
          ["The image is just as far on the other side:", "像在另一侧，距离一样远："],
          [`2 \\times ${Math.abs(c)} = ${answer}`],
        ],
      ],
      [
        `From $${c}$ to $${-c}$ crosses the axis: $${Math.abs(c)} + ${Math.abs(c)} = ${answer}$.`,
        `从 $${c}$ 到 $${-c}$ 跨过坐标轴：$${Math.abs(c)} + ${Math.abs(c)} = ${answer}$。`,
      ],
      [
        [2 * Math.abs(other), "That uses the coordinate that does not change.", "这用的是不变的那个坐标。"],
        [Math.abs(c), "That is the distance to the axis, only half the way.", "这只是到轴的距离，只走了一半。"],
        [Math.abs(x) + Math.abs(y), "That adds both coordinates, but only one of them changes.", "这把两个坐标相加了，但只有一个会变。"],
      ],
      { form: "integer" },
    );
  },
  drawn(gradeDrawings4["reflections-of-points-in-the-coordinate-plane#the-distance-from-a-point-to-its-reflection"]),
);

const cornerFromArea = lesson(
  "a-missing-corner-from-the-area",
  ["A missing corner from the area", "由面积求缺失的顶点"],
  [
    [
      "Two corners on a horizontal line give the width of a rectangle; the area divided by the width gives the height, and the other corners lie that far above or below. Corners $(-2, 1)$ and $(4, 1)$ are $6$ apart; with area $30$ the height is $30 \\div 6 = 5$, so corners above lie at $y = 1 + 5 = 6$.",
      "水平线上的两个顶点给出长方形的宽；面积除以宽得到高，另外两个顶点就在上方或下方这么远。顶点 $(-2, 1)$ 和 $(4, 1)$ 相距 $6$；面积是 $30$ 时，高是 $30 \\div 6 = 5$，所以上方的顶点在 $y = 1 + 5 = 6$。",
    ],
    [
      "The rectangle from $y = 1$ to $y = 6$ is $5$ tall, and $6 \\times 5 = 30$, the area.",
      "从 $y = 1$ 到 $y = 6$ 的长方形高 $5$，$6 \\times 5 = 30$，正是面积。",
    ],
    ["The height $5$ is how far to move, not the coordinate: start from $y = 1$.", "高 $5$ 是要移动的距离，不是坐标：要从 $y = 1$ 出发。"],
  ],
  (rng) => {
    const x = rng.int(-9, 5);
    const y = rng.int(-9, 9);
    const w = rng.int(2, 12);
    const h = rng.int(2, 12);
    const above = rng.bool();
    const answer = above ? y + h : y - h;
    const area = w * h;
    return valued(
      [
        `A rectangle has corners at $(${x}, ${y})$ and $(${x + w}, ${y})$, and its area is $${area}$ square units. The other two corners lie ${above ? "above" : "below"} these. What is their $y$-coordinate?`,
        `一个长方形有顶点 $(${x}, ${y})$ 和 $(${x + w}, ${y})$，面积是 $${area}$ 平方单位。另外两个顶点在它们${above ? "上方" : "下方"}。它们的 $y$ 坐标是多少？`,
      ],
      answer,
      [
        [
          ["The width", "求宽"],
          ["The corners share $y$; compare the $x$-coordinates:", "两个顶点纵坐标相同；比较横坐标："],
          [`${x + w} - ${x < 0 ? `(${x})` : x} = ${w}`],
        ],
        [["The height", "求高"], ["Area divided by width:", "面积除以宽："], [`${area} \\div ${w} = ${h}`]],
        [
          ["Move", "移动"],
          [`Go ${above ? "up" : "down"} $${h}$ from $y = ${y}$:`, `从 $y = ${y}$ 向${above ? "上" : "下"}移动 $${h}$：`],
          [`${y} ${above ? "+" : "-"} ${h} = ${answer}`],
        ],
      ],
      [
        `From $y = ${Math.min(y, answer)}$ to $y = ${Math.max(y, answer)}$ is $${h}$, and $${w} \\times ${h} = ${area}$, the area.`,
        `从 $y = ${Math.min(y, answer)}$ 到 $y = ${Math.max(y, answer)}$ 是 $${h}$，$${w} \\times ${h} = ${area}$，正是面积。`,
      ],
      [
        [
          above ? y - h : y + h,
          `That moves ${above ? "down" : "up"}, but the corners lie ${above ? "above" : "below"}.`,
          `这是向${above ? "下" : "上"}移动，但顶点在${above ? "上方" : "下方"}。`,
        ],
        [h, "That is the height, how far to move, not the coordinate.", "这是高，即移动的距离，不是坐标。"],
        [above ? y + w : y - w, "That moves by the width instead of the height.", "这是按宽移动，而不是按高。"],
        [above ? y + area : y - area, "That moves by the area instead of the height.", "这是按面积移动，而不是按高。"],
      ],
      { form: "integer" },
    );
  },
  drawn(gradeDrawings4["finding-areas-and-perimeters-in-the-coordinate-plane#a-missing-corner-from-the-area"]),
);

const changeInLinearExpression: KnowledgePointDef = lesson(
  "how-much-an-expression-grows",
  ["How much an expression grows", "算式增加多少"],
  [
    [
      "The constant term of a linear expression stays the same whatever the letter does, so it adds nothing to a change. Each step of $1$ in the letter adds the coefficient. So when the letter goes up by some amount, the expression goes up by the coefficient times that amount. When $x$ goes up by $4$, $3x + 7$ goes up by $3 \\times 4 = 12$, wherever $x$ starts.",
      "一次式的常数项不管字母怎样变都不变，所以它对变化没有贡献。字母每增加 $1$，算式就增加一个系数。所以字母增加多少，算式就增加系数乘这个量。$x$ 增加 $4$ 时，$3x + 7$ 增加 $3 \\times 4 = 12$，与 $x$ 从几开始无关。",
    ],
    [
      "From $x = 1$ to $x = 5$: $3 \\times 1 + 7 = 10$ and $3 \\times 5 + 7 = 22$, and $22 - 10 = 12$.",
      "从 $x = 1$ 到 $x = 5$：$3 \\times 1 + 7 = 10$，$3 \\times 5 + 7 = 22$，$22 - 10 = 12$。",
    ],
    [
      "The constant does not grow. The change in $3x + 7$ is $3 \\times 4$, not $3 \\times 4 + 7$.",
      "常数项不会增加。$3x + 7$ 的变化是 $3 \\times 4$，不是 $3 \\times 4 + 7$。",
    ],
  ],
  (rng) => {
    const a = rng.int(2, 15);
    const b = rng.int(1, 40);
    const change = rng.int(2, 20);
    const answer = a * change;
    const start = rng.int(1, 9);
    return valued(
      [
        `The value of $x$ goes up by $${change}$. By how much does $${a}x + ${b}$ go up?`,
        `$x$ 的值增加了 $${change}$。$${a}x + ${b}$ 增加了多少？`,
      ],
      answer,
      [
        [
          ["The constant", "看常数项"],
          [`$${b}$ stays the same, so it adds nothing to the change.`, `$${b}$ 不变，对变化没有贡献。`],
        ],
        [
          ["The letter term", "看字母项"],
          [`Each $1$ added to $x$ adds $${a}$:`, `$x$ 每增加 $1$，就增加 $${a}$：`],
          [`${a} \\times ${change} = ${answer}`],
        ],
      ],
      [
        `Try $x = ${start}$ and $x = ${start + change}$: $${a * start + b}$ and $${a * (start + change) + b}$, which differ by $${answer}$.`,
        `取 $x = ${start}$ 和 $x = ${start + change}$：得 $${a * start + b}$ 和 $${a * (start + change) + b}$，相差 $${answer}$。`,
      ],
      [
        [
          a + change,
          "That adds the coefficient and the change. Each step adds the coefficient, so multiply.",
          "这是把系数和增加量相加。每增加 $1$ 都加一个系数，所以要相乘。",
        ],
        [answer + b, `That adds the constant $${b}$ too, but the constant does not change.`, `这把常数 $${b}$ 也加上了，但常数不变。`],
        [
          change,
          "That is how much $x$ grows. The expression grows by the coefficient for each step.",
          "这是 $x$ 增加的量。算式每步增加一个系数。",
        ],
      ],
    );
  },
  lineFigure(
    {
      lo: 0,
      hi: 24,
      step: 3,
      labels: [0, 12, 24],
      jumps: [
        [0, 3],
        [3, 6],
        [6, 9],
        [9, 12],
      ],
      marks: [{ at: 12, text: "12", result: true }],
    },
    [
      "Four jumps of 3 from 0 reach 12: when x goes up by 4, 3x goes up by 3 × 4 = 12.",
      "从 0 开始跳 4 次，每次 3，到 12：x 增加 4，3x 就增加 3 × 4 = 12。",
    ],
  ),
);

const perimeterExpression: KnowledgePointDef = lesson(
  "a-perimeter-as-an-expression",
  ["A perimeter as an expression", "用算式表示周长"],
  [
    [
      "When the sides of a rectangle are written with a letter, the perimeter is an expression too. Add the length and the width, then double the sum, or add all four sides. Either way, combine the letter terms and combine the constants. A rectangle with length $3x + 2$ and width $x + 4$ has perimeter $2(4x + 6) = 8x + 12$.",
      "长方形的边用字母表示时，周长也是一个算式。把长和宽相加再乘 $2$，或者把四条边都加起来。无论哪种方法，都要合并字母项、合并常数项。长 $3x + 2$、宽 $x + 4$ 的长方形，周长是 $2(4x + 6) = 8x + 12$。",
    ],
    [
      "Try $x = 1$: the sides are $5$ and $5$, the perimeter is $20$, and $8 + 12 = 20$.",
      "取 $x = 1$：两边是 $5$ 和 $5$，周长是 $20$，而 $8 + 12 = 20$。",
    ],
    [
      "Double the whole sum. Doubling only the letter terms gives $8x + 6$, which leaves out two sides' worth of constants.",
      "要把整个和乘 $2$。只把字母项乘 $2$ 得 $8x + 6$，少算了两条边的常数。",
    ],
  ],
  (rng) => {
    const a = rng.int(2, 9);
    const b = rng.int(1, 15);
    let c = rng.int(2, 9);
    let d = rng.int(1, 15);
    if (c === a) c = a === 9 ? 2 : a + 1;
    if (d === b) d = b === 15 ? 1 : b + 1;
    const coefficient = rng.bool();
    const answer = 2 * (coefficient ? a + c : b + d);
    const per = 2 * (a + c) + 2 * (b + d);
    return valued(
      [
        `A rectangle has a length of $${a}x + ${b}$ and a width of $${c}x + ${d}$. Write its perimeter in simplest form. What is the ${coefficient ? "coefficient of $x$" : "constant term"}?`,
        `一个长方形的长是 $${a}x + ${b}$，宽是 $${c}x + ${d}$。把它的周长写成最简形式。${coefficient ? "$x$ 的系数" : "常数项"}是多少？`,
      ],
      answer,
      [
        [["Add a length and a width", "长加宽"], ["", ""], [`(${a}x + ${b}) + (${c}x + ${d}) = ${a + c}x + ${b + d}`]],
        [
          ["Double it", "乘 2"],
          ["Two lengths and two widths:", "两条长和两条宽："],
          [`2(${a + c}x + ${b + d}) = ${2 * (a + c)}x + ${2 * (b + d)}`],
        ],
        [
          ["Read the answer", "读出答案"],
          [
            `The ${coefficient ? "coefficient of $x$" : "constant term"} is $${answer}$.`,
            `${coefficient ? "$x$ 的系数" : "常数项"}是 $${answer}$。`,
          ],
        ],
      ],
      [
        `Try $x = 1$: the sides are $${a + b}$ and $${c + d}$, so the perimeter is $${per}$, and $${2 * (a + c)} + ${2 * (b + d)} = ${per}$.`,
        `取 $x = 1$：两边是 $${a + b}$ 和 $${c + d}$，周长是 $${per}$，而 $${2 * (a + c)} + ${2 * (b + d)} = ${per}$。`,
      ],
      [
        [answer / 2, "That is one length plus one width. The perimeter has two of each.", "这只是一条长加一条宽。周长有两条长、两条宽。"],
        [
          coefficient ? 2 * (b + d) : 2 * (a + c),
          coefficient
            ? "That is the constant term. The question asks for the coefficient of $x$."
            : "That is the coefficient of $x$. The question asks for the constant term.",
          coefficient ? "这是常数项。题目问的是 $x$ 的系数。" : "这是 $x$ 的系数。题目问的是常数项。",
        ],
        [coefficient ? 2 * a + c : 2 * b + d, "That doubles the length but counts the width only once.", "这把长算了两次，宽只算了一次。"],
      ],
    );
  },
  drawn(gradeDrawings4["simplifying-linear-expressions#a-perimeter-as-an-expression"]),
);
const anotherMultiple = lesson(
  "another-multiple-of-the-unknown",
  ["Another multiple of the unknown", "未知数的另一个倍数"],
  [
    [
      "Sometimes a question asks for a multiple of the unknown, not the unknown itself. Find $x$ first, then multiply. From $8x = 40$, $x = 40 \\div 8 = 5$, so $4x = 4 \\times 5 = 20$.",
      "有时问题求的不是未知数本身，而是它的某个倍数。先求出 $x$，再乘。由 $8x = 40$，得 $x = 40 \\div 8 = 5$，所以 $4x = 4 \\times 5 = 20$。",
    ],
    ["$4x$ is half of $8x$, and half of $40$ is $20$.", "$4x$ 是 $8x$ 的一半，$40$ 的一半是 $20$。"],
    [
      "Read what is asked. Here $x = 5$ is only a step, and the answer is $4x$.",
      "看清问的是什么。这里 $x = 5$ 只是中间一步，答案是 $4x$。",
    ],
  ],
  (rng) => {
    const x = rng.int(2, 30);
    const half = rng.int(2, 9);
    const k = 2 * half;
    const times = rng.int(2, 3);
    const asksHalf = rng.bool();
    const wanted = asksHalf ? half : k * times;
    const answer = wanted * x;
    const check: Pair = asksHalf
      ? [
          `$${wanted}x$ is half of $${k}x$, and half of $${k * x}$ is $${answer}$.`,
          `$${wanted}x$ 是 $${k}x$ 的一半，$${k * x}$ 的一半是 $${answer}$。`,
        ]
      : [
          `$${wanted}x$ is $${times}$ times $${k}x$, and $${times} \\times ${k * x} = ${answer}$.`,
          `$${wanted}x$ 是 $${k}x$ 的 $${times}$ 倍，$${times} \\times ${k * x} = ${answer}$。`,
        ];
    return valued(
      [`Given that $${k}x = ${k * x}$, find the value of $${wanted}x$.`, `已知 $${k}x = ${k * x}$，求 $${wanted}x$ 的值。`],
      answer,
      [
        [["Find x", "求出 x"], [`Divide both sides by $${k}$:`, `两边同时除以 $${k}$：`], [`x = ${k * x} \\div ${k} = ${x}`]],
        [
          ["Multiply", "再乘"],
          [`The question asks for $${wanted}x$:`, `问题求的是 $${wanted}x$：`],
          [`${wanted}x = ${wanted} \\times ${x} = ${answer}`],
        ],
      ],
      check,
      [
        [x, `That is $x$, only the first step. The question asks for $${wanted}x$.`, `这是 $x$，只是第一步。问题求的是 $${wanted}x$。`],
        [
          k * x,
          `That is the value of $${k}x$ given in the question, not $${wanted}x$.`,
          `这是题目给出的 $${k}x$ 的值，不是 $${wanted}x$。`,
        ],
        [wanted, `That is the number in front of $x$. Multiply it by $x = ${x}$.`, `这是 $x$ 前面的数。还要乘 $x = ${x}$。`],
        [answer + x, `That is $${wanted + 1}x$, one $x$ too many.`, `这是 $${wanted + 1}x$，多算了一个 $x$。`],
      ],
    );
  },
  equalTape(8, "5", "40", 4),
);

const countingInequalitySolutions = lesson(
  "counting-positive-whole-solutions",
  ["Counting whole-number solutions", "数整数解的个数"],
  [
    [
      "To count the positive whole numbers that solve an inequality, divide to find the boundary, then count from $1$ up to it. For $2x < 9$, $x < 4.5$, so $x$ can be $1, 2, 3$ or $4$: four solutions.",
      "数一个不等式有几个正整数解，先做除法求出边界，再从 $1$ 数到边界。$2x < 9$，得 $x < 4.5$，所以 $x$ 可以是 $1, 2, 3, 4$，共四个解。",
    ],
    ["$2 \\times 4 = 8 < 9$, but $2 \\times 5 = 10$ is not less than $9$.", "$2 \\times 4 = 8 < 9$，而 $2 \\times 5 = 10$ 不小于 $9$。"],
    [
      "When the boundary is a whole number, look at the sign. $2x < 8$ leaves out $4$ and has $3$ solutions, while $2x \\le 8$ keeps it and has $4$.",
      "边界是整数时，要看符号。$2x < 8$ 不包括 $4$，有 $3$ 个解；$2x \\le 8$ 包括 $4$，有 $4$ 个解。",
    ],
  ],
  (rng) => {
    const k = rng.int(2, 12);
    const quotient = rng.int(3, 40);
    const exact = rng.bool();
    const m = exact ? k * quotient : k * quotient + rng.int(1, k - 1);
    const strict = rng.bool();
    const sign = strict ? "<" : "\\le";
    const answer = exact && strict ? quotient - 1 : quotient;
    const bound = Q.of(m, k).toLatex();
    const last: Pair = exact
      ? strict
        ? [
            `$${bound}$ itself is left out by $<$, so the last solution is $${answer}$.`,
            `$<$ 不包括 $${bound}$ 本身，所以最后一个解是 $${answer}$。`,
          ]
        : [
            `$${bound}$ itself is kept by $\\le$, so the last solution is $${answer}$.`,
            `$\\le$ 包括 $${bound}$ 本身，所以最后一个解是 $${answer}$。`,
          ]
      : [`The last whole number below $${bound}$ is $${answer}$.`, `比 $${bound}$ 小的最后一个整数是 $${answer}$。`];
    const over: Off =
      exact && strict
        ? [
            answer + 1,
            `That counts $${quotient}$, but $${k} \\times ${quotient} = ${m}$ is not less than $${m}$.`,
            `这把 $${quotient}$ 也算上了，但 $${k} \\times ${quotient} = ${m}$ 不小于 $${m}$。`,
          ]
        : [
            answer + 1,
            `That counts $${answer + 1}$, but $${k} \\times ${answer + 1} = ${k * (answer + 1)}$ is more than $${m}$.`,
            `这把 $${answer + 1}$ 也算上了，但 $${k} \\times ${answer + 1} = ${k * (answer + 1)}$ 大于 $${m}$。`,
          ];
    const under: Off =
      exact && !strict
        ? [
            answer - 1,
            `That leaves out $${answer}$, but $\\le$ keeps it: $${k} \\times ${answer} = ${m}$.`,
            `这漏掉了 $${answer}$，但 $\\le$ 包括它：$${k} \\times ${answer} = ${m}$。`,
          ]
        : [
            answer - 1,
            `That stops one too early. $${k} \\times ${answer} = ${k * answer}$ still works.`,
            `这少数了一个。$${k} \\times ${answer} = ${k * answer}$ 仍然满足。`,
          ];
    return valued(
      [`How many positive whole numbers $x$ satisfy $${k}x ${sign} ${m}$?`, `有多少个正整数 $x$ 满足 $${k}x ${sign} ${m}$？`],
      answer,
      [
        [["Find the boundary", "求边界"], [`Divide both sides by $${k}$:`, `两边同时除以 $${k}$：`], [`x ${sign} ${bound}`]],
        [["Find the last solution", "找最后一个解"], last],
        [
          ["Count", "数个数"],
          [`The solutions are $1$ to $${answer}$, so there are $${answer}$.`, `解是 $1$ 到 $${answer}$，所以有 $${answer}$ 个。`],
        ],
      ],
      [
        `$${k} \\times ${answer} = ${k * answer}$ works and $${k} \\times ${answer + 1} = ${k * (answer + 1)}$ does not, so the solutions stop at $${answer}$.`,
        `$${k} \\times ${answer} = ${k * answer}$ 满足，$${k} \\times ${answer + 1} = ${k * (answer + 1)}$ 不满足，所以解到 $${answer}$ 为止。`,
      ],
      [over, under, [m, `That is the number on the right side, not how many solutions there are.`, `这是不等式右边的数，不是解的个数。`]],
    );
  },
  lineFigure({ lo: 0, hi: 6, step: 1, labels: [0, 1, 2, 3, 4, 5, 6], marks: [1, 2, 3, 4].map((at) => ({ at, result: true })) }, [
    "The positive whole numbers with 2x < 9 are 1, 2, 3 and 4.",
    "满足 2x < 9 的正整数是 1、2、3、4。",
  ]),
);

const mostWithBudget = lesson(
  "the-most-that-a-budget-allows",
  ["The most that a budget allows", "预算最多允许多少"],
  [
    [
      "A budget gives an inequality: the fee plus the rides must not pass the limit. With a $\\$10$ fee, rides at $\\$9$ and $\\$50$ to spend, $10 + 9r \\le 50$, so $9r \\le 40$ and $r \\le 4.4$. That allows $4$ rides.",
      "预算给出一个不等式：门票加上项目的费用不能超过限额。门票 $\\$10$，每个项目 $\\$9$，共有 $\\$50$：$10 + 9r \\le 50$，所以 $9r \\le 40$，$r \\le 4.4$。最多玩 $4$ 个项目。",
    ],
    ["$10 + 9 \\times 4 = 46 \\le 50$, and a fifth ride would make $55$.", "$10 + 9 \\times 4 = 46 \\le 50$，再玩第五个就是 $55$ 了。"],
    [
      "Round down, even when the quotient is close to the next whole number. Rounding up would go over the budget.",
      "要向下取整，即使商很接近下一个整数。向上取整就超出预算了。",
    ],
  ],
  (rng) => {
    const fee = rng.int(3, 25);
    const price = rng.int(3, 14);
    const count = rng.int(4, 30);
    const budget = fee + price * count + rng.int(1, price - 1);
    const who = rng.pick(earlyNames);
    const spent = fee + price * count;
    return valued(
      [
        `A park charges a $${fee}$-dollar entry fee plus $${price}$ dollars for each ride. ${who} has $${budget}$ dollars. What is the greatest number of rides ${who} can take?`,
        `一个公园收 $${fee}$ 美元门票，每玩一个项目再收 $${price}$ 美元。${who} 有 $${budget}$ 美元，最多能玩多少个项目？`,
      ],
      count,
      [
        [
          ["Take away the fee", "减去门票"],
          [`The fee is paid once, however many rides:`, `不管玩几个项目，门票只付一次：`],
          [`${budget} - ${fee} = ${budget - fee}`],
        ],
        [
          ["Divide and round down", "相除并向下取整"],
          [
            `$${budget - fee} \\div ${price}$ is $${count}$ with $${budget - spent}$ left over. Only whole rides count, so the answer is $${count}$.`,
            `$${budget - fee} \\div ${price}$ 商 $${count}$ 余 $${budget - spent}$。项目只能按整个算，所以是 $${count}$ 个。`,
          ],
        ],
      ],
      [
        `$${fee} + ${price} \\times ${count} = ${spent} \\le ${budget}$, and one more ride would make $${spent + price} > ${budget}$.`,
        `$${fee} + ${price} \\times ${count} = ${spent} \\le ${budget}$，再多玩一个就是 $${spent + price} > ${budget}$。`,
      ],
      [
        [
          count + 1,
          `That rounds up. $${count + 1}$ rides cost $${spent + price}$ dollars, more than $${budget}$.`,
          `这是向上取整了。$${count + 1}$ 个项目要 $${spent + price}$ 美元，超过了 $${budget}$。`,
        ],
        [Math.floor(budget / price), "That divides the whole budget and forgets the entry fee.", "这是用全部的钱去除，忘了门票。"],
        [
          count - 1,
          `That stops one too early. $${count}$ rides cost $${spent}$ dollars, within $${budget}$.`,
          `这少算了一个。$${count}$ 个项目只要 $${spent}$ 美元，没有超过 $${budget}$。`,
        ],
        [budget - fee, "That is the money left after the fee, not a number of rides.", "这是付完门票剩下的钱，不是项目的个数。"],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "50",
        pieces: [
          { size: 10, text: "10", lit: true },
          { size: 9, text: "9" },
          { size: 9, text: "9" },
          { size: 9, text: "9" },
          { size: 9, text: "9" },
          { size: 4, text: "4", dashed: true },
        ],
      },
    ],
    [
      "A budget of 50: a fee of 10, four rides of 9, and 4 left over, too little for a fifth ride.",
      "预算 50：门票 10，四个项目各 9，剩下 4，不够再玩第五个。",
    ],
  ),
);
const secondHeight = lesson(
  "the-second-height-of-a-parallelogram",
  ["The second height of a parallelogram", "平行四边形的另一条高"],
  [
    [
      "Each pair of sides of a parallelogram has its own height, and the area is the same with either pair: find the area from one side and its height, then divide by the other side. Sides $12$ cm and $8$ cm with height $6$ cm onto the $12$ cm side give area $12 \\times 6 = 72$, so the height onto the $8$ cm side is $72 \\div 8 = 9$ cm.",
      "平行四边形的每组边都有自己的高，用哪一组算面积都一样：先用一条边和它上面的高求面积，再除以另一条边。两边长 $12$ 厘米和 $8$ 厘米，$12$ 厘米边上的高是 $6$ 厘米，面积是 $12 \\times 6 = 72$，所以 $8$ 厘米边上的高是 $72 \\div 8 = 9$ 厘米。",
    ],
    [
      "$8 \\times 9 = 72$, the same area, and the height $9$ is shorter than the neighboring side $12$.",
      "$8 \\times 9 = 72$，面积相同，而且高 $9$ 比相邻的边 $12$ 短。",
    ],
    [
      "Each height goes with the side it is perpendicular to: do not multiply $8$ by the height $6$.",
      "每条高对应和它垂直的那条边：不要用 $8$ 乘高 $6$。",
    ],
  ],
  (rng) => {
    const x = rng.int(3, 9);
    const w = rng.int(2, x - 1);
    const y = rng.int(2, 7);
    const z = rng.pick([2, 3, 4, 5, 6, 7].filter((v) => v !== y));
    const baseA = x * y;
    const heightA = z * w;
    const baseB = x * z;
    const answer = y * w;
    const area = baseA * heightA;
    return valued(
      [
        `A parallelogram has sides of $${baseA}$ cm and $${baseB}$ cm. The height onto the $${baseA}$ cm side is $${heightA}$ cm. What is the height onto the $${baseB}$ cm side?`,
        `一个平行四边形的两条边长 $${baseA}$ 厘米和 $${baseB}$ 厘米，$${baseA}$ 厘米边上的高是 $${heightA}$ 厘米。$${baseB}$ 厘米边上的高是多少？`,
      ],
      answer,
      [
        [
          ["The area", "求面积"],
          [`The $${baseA}$ cm side times its height:`, `$${baseA}$ 厘米的边乘它上面的高：`],
          [`${baseA} \\times ${heightA} = ${area}`],
        ],
        [
          ["The other height", "求另一条高"],
          [`Divide the area by the $${baseB}$ cm side:`, `面积除以 $${baseB}$ 厘米的边：`],
          [`${area} \\div ${baseB} = ${answer}`],
        ],
      ],
      [
        `$${baseB} \\times ${answer} = ${area}$, the same area, and $${answer}$ is shorter than the neighboring side $${baseA}$.`,
        `$${baseB} \\times ${answer} = ${area}$，面积相同，而且 $${answer}$ 比相邻的边 $${baseA}$ 短。`,
      ],
      [
        [heightA, "That keeps the first height, but each pair of sides has its own.", "这沿用了第一条高，但每组边都有自己的高。"],
        [area, "That is the area, not a height.", "这是面积，不是高。"],
        [baseB * heightA, "That multiplies the other side by a height that does not belong to it.", "这用另一条边乘了不属于它的高。"],
        [Math.round(area / (2 * baseB)), "That halves the area as for a triangle.", "这像三角形那样把面积除以 2 了。"],
      ],
      { form: "integer", unit: "cm" },
    );
  },
  drawn(gradeDrawings4["areas-and-perimeters-of-parallelograms#the-second-height-of-a-parallelogram"]),
);

const altitudeToHypotenuse = lesson(
  "the-height-onto-the-longest-side",
  ["The height onto the longest side", "最长边上的高"],
  [
    [
      "The two shorter sides of a right triangle are a base and a height, so its area is easy; the same area, with the longest side as the base, gives the height onto it. Sides $6$, $8$ and $10$ cm: the area is $\\frac{1}{2} \\times 6 \\times 8 = 24$, so $\\frac{1}{2} \\times 10 \\times h = 24$ and $h = 48 \\div 10 = \\frac{24}{5}$ cm.",
      "直角三角形两条较短的边就是底和高，所以面积很好求；同一个面积用最长边作底，就能求出它上面的高。三边长 $6$、$8$、$10$ 厘米：面积是 $\\frac{1}{2} \\times 6 \\times 8 = 24$，所以 $\\frac{1}{2} \\times 10 \\times h = 24$，$h = 48 \\div 10 = \\frac{24}{5}$ 厘米。",
    ],
    [
      "Twice the area both ways: $6 \\times 8 = 48$ and $10 \\times \\frac{24}{5} = 48$.",
      "两种算法的面积 2 倍都一样：$6 \\times 8 = 48$，$10 \\times \\frac{24}{5} = 48$。",
    ],
    [
      "Do not forget the $\\frac{1}{2}$ on the new side too: $24 \\div 10$ is only half the height.",
      "用新的底时也别忘了 $\\frac{1}{2}$：$24 \\div 10$ 只是高的一半。",
    ],
  ],
  (rng) => {
    const [a, b, c] = rng.pick([
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
      [7, 24, 25],
      [20, 21, 29],
      [9, 40, 41],
    ]) as [number, number, number];
    const k = rng.int(1, 5);
    const [p, q, r] = [a * k, b * k, c * k];
    const answer = Q.of(p * q, r);
    const area = Q.of(p * q, 2);
    return valued(
      [
        `A right triangle has sides of $${p}$ cm, $${q}$ cm and $${r}$ cm. What is the height onto the $${r}$ cm side? Give an exact value.`,
        `一个直角三角形的三条边长 $${p}$ 厘米、$${q}$ 厘米和 $${r}$ 厘米。$${r}$ 厘米边上的高是多少？写出准确值。`,
      ],
      answer,
      [
        [
          ["The area", "求面积"],
          ["The two shorter sides are a base and a height:", "两条较短的边就是底和高："],
          [`\\frac{1}{2} \\times ${p} \\times ${q} = ${area.toLatex()}`],
        ],
        [
          ["The height", "求高"],
          [`Use the $${r}$ cm side as the base:`, `用 $${r}$ 厘米的边作底：`],
          [`\\frac{1}{2} \\times ${r} \\times h = ${area.toLatex()}`, `h = ${p * q} \\div ${r} = ${answer.toLatex()}`],
        ],
      ],
      [
        `Twice the area both ways: $${p} \\times ${q} = ${p * q}$ and $${r} \\times ${answer.toLatex()} = ${p * q}$.`,
        `两种算法的面积 2 倍都一样：$${p} \\times ${q} = ${p * q}$，$${r} \\times ${answer.toLatex()} = ${p * q}$。`,
      ],
      [
        [answer.div(Q.of(2)), "That forgets the one half when the longest side is the base.", "用最长边作底时忘了二分之一。"],
        [area, "That is the area, not a height.", "这是面积，不是高。"],
        [
          Q.of(p),
          "That is a shorter side; the height onto the longest side is shorter than both.",
          "这是一条较短的边；最长边上的高比两条较短的边都短。",
        ],
        [
          Q.of(q),
          "That is a shorter side; the height onto the longest side is shorter than both.",
          "这是一条较短的边；最长边上的高比两条较短的边都短。",
        ],
      ],
      { unit: "cm" },
    );
  },
  drawn(gradeDrawings4["areas-of-right-triangles#the-height-onto-the-longest-side"]),
);

const pictureFrame = lesson(
  "the-area-of-a-border",
  ["The area of a border", "边框的面积"],
  [
    [
      "The area of a border is the outer rectangle minus the inner one. A border of a given width makes each inner side shorter by twice the width, since the border is on both ends. A frame $14$ cm by $10$ cm outside and $2$ cm wide holds a picture $10$ cm by $6$ cm, so the frame is $140 - 60 = 80\\text{ cm}^2$.",
      "边框的面积等于外面的长方形减去里面的长方形。一定宽度的边框使里面的每条边少两倍的宽度，因为两端都有边框。外面 $14$ 厘米乘 $10$ 厘米、宽 $2$ 厘米的画框，里面的画是 $10$ 厘米乘 $6$ 厘米，所以画框是 $140 - 60 = 80\\text{ cm}^2$。",
    ],
    [
      "Four strips: two $14 \\times 2$ along the long sides and two $6 \\times 2$ between them, $56 + 24 = 80$.",
      "分成四条：长边上两条 $14 \\times 2$，中间两条 $6 \\times 2$，$56 + 24 = 80$。",
    ],
    [
      "Take the width off both ends: $14 - 2 = 12$ leaves the frame on one end in the picture.",
      "两端都要减去宽：$14 - 2 = 12$ 把一端的边框算进了画里。",
    ],
  ],
  (rng) => {
    const border = rng.int(1, 4);
    const innerW = rng.int(3, 20);
    const innerH = rng.int(3, 20);
    const w = innerW + 2 * border;
    const h = innerH + 2 * border;
    const answer = w * h - innerW * innerH;
    return valued(
      [
        `A framed picture measures $${w}$ cm by $${h}$ cm on the outside, and the frame is $${border}$ cm wide all round. What is the area of the frame?`,
        `一幅带框的画外部尺寸是 $${w}$ 厘米乘 $${h}$ 厘米，画框四周宽 $${border}$ 厘米。画框的面积是多少？`,
      ],
      answer,
      [
        [
          ["The picture", "里面的画"],
          [`Take $${border}$ cm off both ends of each side:`, `每条边两端各减去 $${border}$ 厘米：`],
          [`${w} - 2 \\times ${border} = ${innerW}`, `${h} - 2 \\times ${border} = ${innerH}`],
        ],
        [
          ["Subtract", "相减"],
          ["Outer area minus inner area:", "外面的面积减去里面的面积："],
          [`${w} \\times ${h} - ${innerW} \\times ${innerH} = ${w * h} - ${innerW * innerH} = ${answer}`],
        ],
      ],
      [
        `Four strips: two $${w} \\times ${border}$ and two $${innerH} \\times ${border}$, $${2 * w * border} + ${2 * innerH * border} = ${answer}$.`,
        `分成四条：两条 $${w} \\times ${border}$，两条 $${innerH} \\times ${border}$，$${2 * w * border} + ${2 * innerH * border} = ${answer}$。`,
      ],
      [
        [w * h - (w - border) * (h - border), "That takes the frame off only one end of each side.", "这只在每条边的一端减去了边框。"],
        [innerW * innerH, "That is the picture inside, not the frame.", "这是里面的画，不是画框。"],
        [w * h, "That is the whole outside, picture included.", "这是外面的整个面积，包括了画。"],
        [2 * (w + h) * border, "That counts the four corner squares twice.", "这把四个角上的小正方形算了两次。"],
      ],
      { form: "integer", unit: "cm^2" },
    );
  },
  drawn(gradeDrawings4["finding-areas-of-polygons-using-decomposition#the-area-of-a-border"]),
);

const madAfterChange: KnowledgePointDef = lesson(
  "the-mad-after-changing-every-value",
  ["The MAD after changing every value", "所有值变化后的平均绝对偏差"],
  [
    [
      "The mean absolute deviation measures how far values lie from their mean. Adding the same number to every value slides the whole data set along the number line; the mean slides with it, so no distance changes and the MAD stays the same. Multiplying every value by a number stretches every distance by that number, so the MAD is multiplied too. The data $2, 4, 6, 8$ have MAD $2$; adding $10$ gives $12, 14, 16, 18$, still MAD $2$, and doubling gives $4, 8, 12, 16$, MAD $4$.",
      "平均绝对偏差度量各值离平均数有多远。给每个值加同一个数，整个数据集沿数轴平移，平均数也跟着平移，所以距离都不变，平均绝对偏差不变。给每个值乘一个数，所有距离都按这个数拉伸，所以平均绝对偏差也乘以这个数。数据 $2, 4, 6, 8$ 的平均绝对偏差是 $2$；都加 $10$ 得 $12, 14, 16, 18$，仍是 $2$；都乘 $2$ 得 $4, 8, 12, 16$，变成 $4$。",
    ],
    [
      "$4, 8, 12, 16$ has mean $10$ and distances $6, 2, 2, 6$, whose mean is $16 \\div 4 = 4$.",
      "$4, 8, 12, 16$ 的平均数是 $10$，距离是 $6, 2, 2, 6$，平均是 $16 \\div 4 = 4$。",
    ],
    [
      "Adding a number changes the mean but not the MAD. Do not add it to the MAD.",
      "加一个数会改变平均数，但不改变平均绝对偏差。不要把它加到平均绝对偏差上。",
    ],
  ],
  (rng) => {
    const mad = rng.int(2, 15);
    const add = rng.int(2, 20);
    const times = rng.int(2, 6);
    const kind = rng.int(0, 2);
    const answer = kind === 0 ? mad : times * mad;
    const change: Pair =
      kind === 0
        ? [`$${add}$ is added to every value`, `每个值都加 $${add}$`]
        : kind === 1
          ? [`every value is multiplied by $${times}$`, `每个值都乘 $${times}$`]
          : [`every value is multiplied by $${times}$ and then $${add}$ is added`, `每个值都乘 $${times}$ 再加 $${add}$`];
    const [a, b] = kind === 0 ? [add, add + 2 * mad] : kind === 1 ? [0, 2 * times * mad] : [add, 2 * times * mad + add];
    return valued(
      [
        `A data set has a mean absolute deviation of $${mad}$. Then ${change[0]}. What is the new mean absolute deviation?`,
        `一个数据集的平均绝对偏差是 $${mad}$。然后${change[1]}。新的平均绝对偏差是多少？`,
      ],
      answer,
      [
        kind === 0
          ? [
              ["Multiplying", "乘法"],
              ["Nothing is multiplied, so no distance is stretched.", "没有乘法，所以距离没有被拉伸。"],
            ]
          : [
              ["Multiplying", "乘法"],
              [`Every distance from the mean is stretched by $${times}$:`, `每个到平均数的距离都拉伸到 $${times}$ 倍：`],
              [`${times} \\times ${mad} = ${times * mad}`],
            ],
        kind === 1
          ? [
              ["Adding", "加法"],
              [`Nothing is added, so the MAD is $${answer}$.`, `没有加法，所以平均绝对偏差是 $${answer}$。`],
            ]
          : [
              ["Adding", "加法"],
              [
                `Adding $${add}$ moves the values and the mean together, so no distance changes:`,
                `加 $${add}$ 使各值和平均数一起移动，距离不变：`,
              ],
              [`\\text{MAD} = ${answer}`],
            ],
      ],
      [
        `Try two values, $0$ and $${2 * mad}$: their mean is $${mad}$ and their MAD is $${mad}$. After the change they are $${a}$ and $${b}$, whose MAD is $${b - a} \\div 2 = ${answer}$.`,
        `试两个值 $0$ 和 $${2 * mad}$：平均数是 $${mad}$，平均绝对偏差是 $${mad}$。变化后它们是 $${a}$ 和 $${b}$，平均绝对偏差是 $${b - a} \\div 2 = ${answer}$。`,
      ],
      [
        [
          mad + add,
          "That adds the number to the MAD, but adding moves the mean with the values.",
          "这是把这个数加到平均绝对偏差上，可是加法会让平均数和各值一起移动。",
        ],
        [
          times * mad + add,
          "That changes the MAD as if it were a data value; only the multiplying stretches it.",
          "这是把平均绝对偏差当成一个数据来变化；只有乘法会拉伸它。",
        ],
        kind === 0
          ? [times * mad, "That multiplies, but the values were only shifted.", "这是乘了，可是各值只是平移了。"]
          : [mad, "That keeps the MAD, but multiplying stretches every distance.", "这是保持不变，可是乘法会拉伸每个距离。"],
        [
          0,
          "Changing every value the same way keeps them apart, so the spread is not $0$.",
          "所有值做同样的变化后仍然分散，所以离散程度不是 $0$。",
        ],
      ],
    );
  },
  drawn(gradeDrawings4["mean-absolute-deviation#the-mad-after-changing-every-value"]),
);

const meanWithoutOutlier: KnowledgePointDef = lesson(
  "the-mean-after-removing-an-outlier",
  ["The mean after removing an outlier", "去掉离群值后的平均数"],
  [
    [
      "The mean times the count gives the sum of all the values. Take the outlier away from this sum, and divide by one fewer value. Five values with mean $12$ add to $60$; removing the outlier $40$ leaves $20$ for $4$ values, a mean of $5$. The median usually moves much less, which is why it is preferred for data with outliers.",
      "平均数乘个数得到所有值的和。从和中减去离群值，再除以少一个的个数。五个数的平均数是 $12$，和是 $60$；去掉离群值 $40$ 后剩 $20$，分给 $4$ 个数，平均数是 $5$。中位数通常变化小得多，所以有离群值的数据更适合用中位数。",
    ],
    ["$4 \\times 5 + 40 = 60$, the old total.", "$4 \\times 5 + 40 = 60$，正是原来的和。"],
    [
      "After removing a value, divide by one fewer. Here $20 \\div 5 = 4$ is wrong; only $4$ values are left.",
      "去掉一个值后，要除以少一个的个数。这里 $20 \\div 5 = 4$ 是错的，只剩 $4$ 个数。",
    ],
  ],
  (rng) => {
    const n = rng.int(5, 12);
    const answer = rng.int(10, 60);
    const extra = rng.int(3, 20);
    const outlier = answer + n * extra;
    const mean = answer + extra;
    const total = n * mean;
    const rest = total - outlier;
    return valued(
      [
        `A data set of $${n}$ values has a mean of $${mean}$. One value, $${outlier}$, is an outlier and is removed. What is the mean of the remaining values?`,
        `一个有 $${n}$ 个值的数据集，平均数是 $${mean}$。其中一个值 $${outlier}$ 是离群值，被去掉了。其余各值的平均数是多少？`,
      ],
      answer,
      [
        [
          ["Find the sum", "求和"],
          [`$${n}$ values with mean $${mean}$:`, `$${n}$ 个值，平均数是 $${mean}$：`],
          [`${n} \\times ${mean} = ${total}`],
        ],
        [["Remove the outlier", "去掉离群值"], ["Subtract it from the sum:", "从和中减去它："], [`${total} - ${outlier} = ${rest}`]],
        [["Divide", "相除"], [`$${n - 1}$ values are left:`, `剩下 $${n - 1}$ 个值：`], [`${rest} \\div ${n - 1} = ${answer}`]],
      ],
      [
        `$${n - 1} \\times ${answer} + ${outlier} = ${rest} + ${outlier} = ${total}$, the old sum.`,
        `$${n - 1} \\times ${answer} + ${outlier} = ${rest} + ${outlier} = ${total}$，正是原来的和。`,
      ],
      [
        [mean, "That is the old mean, with the outlier still in.", "这是原来的平均数，离群值还在里面。"],
        [Q.of(rest, n), `That divides by $${n}$; only $${n - 1}$ values are left.`, `这是除以 $${n}$，可是只剩 $${n - 1}$ 个值。`],
        [rest, "That is the sum of the remaining values; divide it by their count.", "这是剩下各值的和，还要除以个数。"],
        [
          Q.of(total, n - 1),
          "That divides the old sum, with the outlier still in it, by the new count.",
          "这是用含离群值的原来的和除以新的个数。",
        ],
      ],
    );
  },
  tapeFigure(
    [
      {
        total: "60",
        pieces: [
          { size: 5, text: "5" },
          { size: 5, text: "5" },
          { size: 5, text: "5" },
          { size: 5, text: "5" },
          { size: 40, text: "40", lit: true },
        ],
      },
    ],
    [
      "Five values with mean 12 make 60; without the outlier 40, the other four share 20, 5 each.",
      "平均数为 12 的五个数共 60；去掉离群值 40 后，其余四个数共 20，每个 5。",
    ],
  ),
);
const copiesForMode: KnowledgePointDef = lesson(
  "copies-needed-to-change-the-mode",
  ["Copies needed to change the mode", "要多少个才能改变众数"],
  [
    [
      "To become the only mode, a value must appear strictly more often than the current mode. Having the same count only produces two modes. So the number of copies needed is the difference between the two counts, plus one more to break the tie. If $6$ appears $5$ times and $9$ appears $2$ times, $9$ needs $5 + 1 - 2 = 4$ more copies.",
      "要成为唯一的众数，一个值出现的次数必须严格多于当前的众数。次数相同只会产生两个众数。所以需要的个数是两个次数的差，再多一个来打破平局。如果 $6$ 出现 $5$ 次，$9$ 出现 $2$ 次，$9$ 还需要 $5 + 1 - 2 = 4$ 个。",
    ],
    [
      "With $4$ more, $9$ appears $2 + 4 = 6$ times, one more than the $5$ times of $6$.",
      "再加 $4$ 个后，$9$ 出现 $2 + 4 = 6$ 次，比 $6$ 的 $5$ 次多一次。",
    ],
    ["Only the difference makes a tie. Add one more copy to break it.", "只补上差值会打成平局，还要再多加一个才能打破。"],
  ],
  (rng) => {
    const value = rng.int(2, 30);
    const other = rng.pick([...Array(29).keys()].map((i) => i + 2).filter((v) => v !== value));
    const low = rng.int(1, 12);
    const high = low + rng.int(1, 12);
    const answer = high - low + 1;
    return valued(
      [
        `In a data set, the value $${value}$ appears $${high}$ times and is the only mode. The value $${other}$ appears $${low}$ ${low === 1 ? "time" : "times"}. How many more copies of $${other}$ must be added for $${other}$ to become the only mode?`,
        `在一个数据集中，$${value}$ 出现 $${high}$ 次，是唯一的众数。$${other}$ 出现 $${low}$ 次。至少要再加入多少个 $${other}$，才能使 $${other}$ 成为唯一的众数？`,
      ],
      answer,
      [
        [
          ["Find the target", "找目标"],
          [`$${other}$ must appear more than $${high}$ times, so at least`, `$${other}$ 必须出现多于 $${high}$ 次，所以至少`],
          [`${high} + 1 = ${high + 1}`],
        ],
        [
          ["Subtract what is there", "减去已有的"],
          [`It already appears $${low}$ times:`, `它已经出现了 $${low}$ 次：`],
          [`${high + 1} - ${low} = ${answer}`],
        ],
      ],
      [`$${low} + ${answer} = ${high + 1}$, one more than $${high}$.`, `$${low} + ${answer} = ${high + 1}$，比 $${high}$ 多一。`],
      [
        [high - low, "That only ties the counts, which gives two modes.", "这只是让次数相同，会有两个众数。"],
        [
          high,
          `That is how often $${value}$ appears; $${other}$ already has $${low}$.`,
          `这是 $${value}$ 出现的次数；$${other}$ 已经有 $${low}$ 个了。`,
        ],
        [high + 1, `That is the count $${other}$ needs in all, not how many to add.`, `这是 $${other}$ 一共需要的个数，不是要加的个数。`],
        [high + low, "That adds the two counts instead of comparing them.", "这是把两个次数相加，不是比较。"],
      ],
    );
  },
  tapeFigure(
    [
      { pieces: [{ size: 5, text: "5" }] },
      {
        pieces: [
          { size: 2, text: "2" },
          { size: 4, text: "4", lit: true, dashed: true },
        ],
      },
    ],
    [
      "The mode appears 5 times; the other value appears 2 times and needs 4 more to reach 6, one past 5.",
      "众数出现 5 次；另一个值出现 2 次，再加 4 个达到 6 次，比 5 多一次。",
    ],
  ),
);
/** deeperGrade6Points maps topics of 6th Grade Math to further knowledge points. */
export const deeperGrade6Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "reasoning-with-equivalent-ratios": [ratioAfterAdding],
  "speed-as-a-unit-rate": [closingSpeeds],
  "tape-diagrams": [givingToEqualize],
  "finding-a-total-given-a-part-and-a-percentage": [totalFromTheRest],
  "finding-part-of-a-number-given-a-whole-and-a-percentage": [swappingPercent],
  "comparing-fractions-percents-and-decimals": [sumAcrossForms],
  "finding-side-lengths-using-fraction-division": [perimeterFromFractionalArea],
  "dividing-mixed-numbers-word-problems": [leftoverAfterFilling],
  "interpreting-absolute-value": [numbersAtADistance],
  "identifying-rational-numbers-on-a-number-line": [halfwayPoint],
  "reflections-of-points-in-the-coordinate-plane": [distanceToReflection],
  "finding-areas-and-perimeters-in-the-coordinate-plane": [cornerFromArea],
  "comparing-exponents": [theFirstPowerAboveANumber],
  "evaluating-exponents-with-fractional-bases": [theMissingExponentOfAFraction],
  "evaluating-linear-expressions": [changeInLinearExpression],
  "simplifying-linear-expressions": [perimeterExpression],
  "one-step-multiplication-equations": [anotherMultiple],
  "identifying-solutions-to-linear-inequalities": [countingInequalitySolutions],
  "modeling-real-world-problems-using-inequalities": [mostWithBudget],
  "areas-and-perimeters-of-parallelograms": [secondHeight],
  "areas-of-right-triangles": [altitudeToHypotenuse],
  "finding-areas-of-polygons-using-decomposition": [pictureFrame],
  "mean-absolute-deviation": [madAfterChange],
  outliers: [meanWithoutOutlier],
  "the-mode-of-a-data-set": [copiesForMode],
};
