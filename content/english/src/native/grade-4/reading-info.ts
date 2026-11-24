// Grade 4: the reading skills of informational texts: chains of causes and effects, explanations of how things
// work, data in tables, skimming and scanning, how authors support points, and combining two texts.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { fields, type Item, itemGenerator, pick, range } from "./kit.ts";
import { after } from "./prior.ts";

// Chains of causes and effects.

const chainLines = `
  Heavy rain soaks a hillside|The soil grows heavy with water|The soil can no longer hold on to the slope|A landslide crashes down the hill
  A volcano erupts|Ash rises high into the sky|The ash blocks some sunlight|The weather around the world turns cooler
  An earthquake shakes the sea floor|A huge wave forms in the ocean|The wave races toward the coast|Water floods the towns along the shore
  Farmers cut down the trees on a hill|No roots hold the soil in place|Rain washes the soil away|The river below turns brown with mud
  Water seeps into a crack in a rock|The water freezes at night|The ice pushes the crack wider|The rock breaks into pieces
  A river carries sand and mud downstream|The river slows as it reaches the sea|The sand and mud sink to the bottom|New land builds up at the river's mouth
  No rain falls for many months|The ground dries out and cracks|Crops cannot grow|Food becomes scarce and costly
  Two plates of the Earth's crust push together|The rock between them bends and folds|The folded rock is pushed upward|A mountain range slowly rises
  Hot magma rises under the ground|The magma heats the water in the rock|The hot water rises through cracks|A hot spring bubbles up at the surface
  Waves crash against a cliff day after day|The bottom of the cliff wears away|The top of the cliff has nothing under it|The top of the cliff falls into the sea
  A glacier slides slowly down a valley|It scrapes the rock beneath it|The valley grows wider and deeper|A U-shaped valley is left when the ice melts
  Plants and animals die in a swamp|Mud covers their remains|Layers pile up over millions of years|The remains turn into coal
  The wind blows sand across a desert|The sand piles up against a rock|The pile grows larger and larger|A sand dune forms
  A storm drops rain on a mountain|Streams fill and rush downhill|The river below rises over its banks|Farms and roads are flooded
  The ocean warms up near the equator|Warm, wet air rises quickly|Clouds spin around a center|A hurricane forms
  Lava flows into the sea|The lava cools quickly in the water|It hardens into new rock|A new island slowly grows
`;

const chains = fields(chainLines).map((links) => {
  if (links.length !== 4 || links.some((l) => !l)) throw new Error(`a chain needs four links: ${links[0]}`);
  return links as [string, string, string, string];
});

/** orders are the ways the links of a chain are shown scrambled, and two wrong orders for each. */
const scrambles = [
  {
    shown: [2, 0, 3, 1],
    wrong: [
      [1, 0, 2, 3],
      [0, 2, 1, 3],
    ],
  },
  {
    shown: [3, 1, 0, 2],
    wrong: [
      [0, 1, 3, 2],
      [2, 1, 0, 3],
    ],
  },
] as const;

const letters = ["A", "B", "C", "D"];

/** chainOrderBank asks for the order of the scrambled links of a chain. */
const chainOrderBank: readonly Item[] = chains.flatMap((chain) =>
  scrambles.map((s) => {
    const label = (link: number) => letters[s.shown.indexOf(link as 0 | 1 | 2 | 3)] ?? "";
    const order = (o: readonly number[]) => o.map(label).join(" → ");
    const swapped = (o: readonly number[]): [number, number] => {
      const i = o.findIndex((link, k) => link !== k);
      return [o[i] ?? 0, o[i + 1] ?? 0];
    };
    return {
      question: t("Put the links of this chain of causes and effects in order.", "把这条因果链中的环节按顺序排列。"),
      shown: s.shown.map((link, k) => `${letters[k]}. ${chain[link]}`).join("\n"),
      right: order([0, 1, 2, 3]),
      wrong: s.wrong.map(order),
      why: t(
        `The chain runs ${order([0, 1, 2, 3])}: ${chain.join(" → ")}. Each link is the effect of the one before it and the cause of the one after it.\n\n**Check.** Read the four links in order with “so” between them—every step naturally causes the next.`,
        `这条链的顺序是 ${order([0, 1, 2, 3])}。每个环节都是前一个环节的结果，又是后一个环节的原因。\n\n**检验。** 按这个顺序用“因此”把四个环节连起来读——每一步都自然引发下一步。`,
      ),
      whyNot: s.wrong.map((o) => {
        const [first, second] = swapped(o);
        return t(
          `This order puts “${chain[first]}” before “${chain[second]}”, but it is “${chain[second]}” that leads to “${chain[first]}”, so it must come first.`,
          `这个顺序把“${chain[first]}”放在“${chain[second]}”前面，但正是“${chain[second]}”导致了“${chain[first]}”，所以它必须在前。`,
        );
      }),
    };
  }),
);

/** chainMissingBank asks for the link that is missing from a chain. */
const chainMissingBank: readonly Item[] = chains.flatMap((chain, c) =>
  [1, 2].map((gap) => {
    const others = [pick(chains, c + 3)[gap] ?? "", pick(chains, c + 7)[gap === 1 ? 2 : 1] ?? ""];
    const shown = chain.map((link, k) => (k === gap ? "___" : link)).join(" → ");
    return {
      question: t("Which link is missing from this chain?", "这条链缺少了哪个环节？"),
      shown,
      right: chain[gap] ?? "",
      wrong: others,
      why: t(
        `The missing link is “${chain[gap]}”. It is the effect of “${chain[gap - 1]}” and the cause of “${chain[gap + 1]}”, so it joins the two.\n\n**Check.** Read the three consecutive links together—each arrow now connects a real cause to its direct effect.`,
        `缺少的环节是“${chain[gap]}”。它是“${chain[gap - 1]}”的结果，又是“${chain[gap + 1]}”的原因，把两者连了起来。\n\n**检验。** 把前后三个环节连起来读——每个箭头现在都把真正的原因连向直接结果。`,
      ),
      whyNot: [
        t(
          `“${others[0]}” comes from a different process and does not follow from “${chain[gap - 1]}”.`,
          `“${others[0]}” 属于另一个过程，并不是由“${chain[gap - 1]}”引起的。`,
        ),
        t(
          `“${others[1]}” is also from another chain—it cannot lead to “${chain[gap + 1]}”.`,
          `“${others[1]}” 同样属于另一条因果链——它无法导致“${chain[gap + 1]}”。`,
        ),
      ],
    };
  }),
);

// Explanations of how things work.

const processLines = `
  how a geyser erupts|Rain and snow seep deep into the ground|cracks in the rock let the water sink far down
  how a geyser erupts|The water is heated by hot rock below|magma lies close to the surface there
  how a geyser erupts|Pressure builds up in a narrow tube of rock|the steam has no room to spread out
  how a geyser erupts|Water and steam shoot high into the air|the pressure finally pushes them out of the tube
  how a cave forms|Rainwater soaks into limestone|the rock has small cracks
  how a cave forms|The water slowly dissolves the rock|rainwater carries a weak acid
  how a cave forms|The cracks grow into tunnels and rooms|the water keeps flowing through them for thousands of years
  how a cave forms|Icicles of stone grow from the ceiling|dripping water leaves tiny bits of mineral behind
  how a solar panel makes electricity|Sunlight falls on the panel|the panel faces the sun
  how a solar panel makes electricity|The light knocks tiny particles loose inside the panel|the panel is made of a special material
  how a solar panel makes electricity|The loose particles flow along wires|the wires give them a path to follow
  how a solar panel makes electricity|The flow powers lights and machines|a flow of these particles is electricity
  how the heart pumps blood|The heart muscle relaxes|it needs to fill with blood
  how the heart pumps blood|Blood flows into the heart's chambers|the veins carry it back from the body
  how the heart pumps blood|The heart muscle squeezes|the blood has to be pushed out
  how the heart pumps blood|Blood rushes out through the arteries|they carry it to every part of the body
  how a rainbow appears|The sun shines from behind you|light must reach the raindrops in front of you
  how a rainbow appears|Light enters falling raindrops|the rain is still falling while the sun shines
  how a rainbow appears|Each drop splits the light into colors|each color bends by a different amount
  how a rainbow appears|You see a band of colors in the sky|the colors come back to your eyes from many drops
  how food is digested|You chew your food into small pieces|small pieces are easier to swallow and break down
  how food is digested|The stomach churns the food with juices|the juices break the food into a thick liquid
  how food is digested|The small intestine takes in the goodness|its walls let the nutrients pass into the blood
  how food is digested|The body gets rid of what is left|the leftover part cannot be used
  how a wind turbine works|The wind pushes against the long blades|the blades are shaped to catch moving air
  how a wind turbine works|The blades turn a shaft|the shaft is joined to the center of the blades
  how a wind turbine works|The shaft spins a generator|the generator is inside the box behind the blades
  how a wind turbine works|Electricity travels down cables to homes|the generator turns motion into electricity
  how a volcano builds up|Magma pushes up through a vent|it is lighter than the solid rock around it
  how a volcano builds up|Lava pours out and spreads|it is still hot and runny
  how a volcano builds up|The lava cools and hardens|the air is much cooler than the lava
  how a volcano builds up|The mountain grows taller with each eruption|new layers of rock pile on top of old ones
`;

const processes = (() => {
  const groups = new Map<string, { what: string; why: string }[]>();
  for (const [name, what, why] of fields(processLines)) {
    if (!name || !what || !why) throw new Error(`a process line needs three fields: ${name}`);
    groups.set(name, [...(groups.get(name) ?? []), { what, why }]);
  }
  return [...groups].map(([name, stages]) => ({ name, stages }));
})();

/** explanationText writes an explanation of a process from its stages. */
const explanationText = (p: (typeof processes)[number]) => {
  const words = ["First", "Next", "Then", "Finally"];
  return p.stages.map((s, i) => `${words[i]}, ${s.what.charAt(0).toLowerCase()}${s.what.slice(1)}, because ${s.why}.`).join(" ");
};

/** stageBank asks what happens at a stage of a process. */
const stageBank: readonly Item[] = processes.flatMap((p, n) =>
  p.stages.map((stage, i) => {
    const later = p.stages[(i + 2) % p.stages.length]?.what ?? "";
    const elsewhere = pick(processes, n + 1).stages[i]?.what ?? "";
    const before = p.stages[i - 1];
    return {
      question: before
        ? t(
            `According to the explanation of ${p.name}, what happens right after this step: “${before.what}”?`,
            `根据这篇关于“${p.name}”的说明，紧接着“${before.what}”这一步之后发生什么？`,
          )
        : t(`According to the explanation of ${p.name}, what happens first?`, `根据这篇关于“${p.name}”的说明，首先发生什么？`),
      shown: explanationText(p),
      right: stage.what,
      wrong: [later, elsewhere],
      why: t(
        `“${stage.what}” is step ${i + 1} of ${p.stages.length}. The signal words *first*, *next*, *then* and *finally* show the order of the steps.\n\n**Check.** Find the signal word for step ${i + 1} in the paragraph—it introduces “${stage.what}” directly.`,
        `“${stage.what}”是 ${p.stages.length} 步中的第 ${i + 1} 步。信号词 *first*、*next*、*then* 和 *finally* 表示步骤的顺序。\n\n**检验。** 在段落里找到第 ${i + 1} 步的信号词——后面紧跟的就是“${stage.what}”。`,
      ),
      whyNot: [
        t(
          `“${later}” is another step of the process, but it does not come at this point. Follow the signal words.`,
          `“${later}”也是这个过程中的一步，但不在这个位置。顺着信号词找。`,
        ),
        t(
          `“${elsewhere}” is not in this explanation at all: it belongs to a different process.`,
          `“${elsewhere}”根本不在这篇说明里：它属于另一个过程。`,
        ),
      ],
    };
  }),
);

/** reasonBank asks why a step of a process happens. */
const reasonBank: readonly Item[] = processes.flatMap((p, n) =>
  p.stages.map((stage, i) => {
    const sibling = p.stages[(i + 1) % p.stages.length]?.why ?? "";
    const elsewhere = pick(processes, n + 3).stages[i]?.why ?? "";
    return {
      question: t(`Why does this step happen: “${stage.what}”?`, `为什么会有这一步：“${stage.what}”？`),
      shown: explanationText(p),
      right: `Because ${stage.why}.`,
      wrong: [`Because ${sibling}.`, `Because ${elsewhere}.`],
      why: t(
        `The explanation gives the reason right after the step, with *because*: ${stage.why}. An explanation tells not only what happens but why.\n\n**Check.** Locate “${stage.what}” in the text and read the *because* clause right after it—it states this exact reason.`,
        `说明在这一步后面用 *because* 给出了原因。一篇说明不仅告诉你发生了什么，还告诉你为什么。\n\n**检验。** 在文中找到“${stage.what}”，读它后面紧跟的 *because* 从句——写的正是这个原因。`,
      ),
      whyNot: [
        t(
          `This is the reason the text gives for a different step. Match the reason to the step it follows.`,
          `这是文中为另一步给出的原因。要把原因和它所跟随的那一步对应起来。`,
        ),
        t(`The explanation never gives this reason: it belongs to a different process.`, `这篇说明从没给出这个原因：它属于另一个过程。`),
      ],
    };
  }),
);

// Comparing data in a table.

/** Table is a table of places or things measured in several ways. */
interface Table {
  readonly title: readonly [en: string, zh: string];
  readonly thing: string;
  readonly columns: readonly (readonly [name: string, unit: string, more: string, less: string])[];
  readonly rows: readonly (readonly [name: string, ...values: number[]])[];
}

const tables: readonly Table[] = [
  {
    title: ["Five biomes", "五种生物群落"],
    thing: "biome",
    columns: [
      ["average temperature (°C)", "°C", "the warmest", "the coldest"],
      ["rainfall (cm a year)", "cm", "the most rainfall", "the least rainfall"],
      ["kinds of plants", "kinds", "the most kinds of plants", "the fewest kinds of plants"],
    ],
    rows: [
      ["rainforest", 27, 250, 2000],
      ["desert", 30, 20, 120],
      ["tundra", -10, 25, 90],
      ["grassland", 18, 75, 400],
      ["temperate forest", 12, 130, 900],
    ],
  },
  {
    title: ["Four deserts", "四个沙漠"],
    thing: "desert",
    columns: [
      ["area (thousand km²)", "thousand km²", "the largest area", "the smallest area"],
      ["rainfall (cm a year)", "cm", "the most rainfall", "the least rainfall"],
      ["highest temperature (°C)", "°C", "the hottest days", "the coolest days"],
    ],
    rows: [
      ["Sahara", 9200, 8, 58],
      ["Gobi", 1300, 19, 45],
      ["Kalahari", 900, 30, 45],
      ["Atacama", 105, 1, 40],
    ],
  },
  {
    title: ["Four polar animals", "四种极地动物"],
    thing: "animal",
    columns: [
      ["weight (kg)", "kg", "the heaviest", "the lightest"],
      ["length (cm)", "cm", "the longest", "the shortest"],
      ["years it lives", "years", "the longest life", "the shortest life"],
    ],
    rows: [
      ["polar bear", 450, 240, 25],
      ["walrus", 1200, 320, 40],
      ["arctic fox", 4, 60, 4],
      ["emperor penguin", 30, 115, 20],
    ],
  },
  {
    title: ["Four rivers", "四条河流"],
    thing: "river",
    columns: [
      ["length (km)", "km", "the longest", "the shortest"],
      ["countries it flows through", "countries", "the most countries", "the fewest countries"],
      ["kinds of fish", "kinds", "the most kinds of fish", "the fewest kinds of fish"],
    ],
    rows: [
      ["Amazon", 6400, 3, 3000],
      ["Nile", 6650, 11, 130],
      ["Yangtze", 6300, 1, 400],
      ["Danube", 2850, 10, 100],
    ],
  },
  {
    title: ["Five cities in January", "一月份的五座城市"],
    thing: "city",
    columns: [
      ["average temperature (°C)", "°C", "the warmest", "the coldest"],
      ["hours of daylight", "hours", "the most daylight", "the least daylight"],
      ["rainy days", "days", "the most rainy days", "the fewest rainy days"],
    ],
    rows: [
      ["Singapore", 27, 12, 15],
      ["Oslo", -4, 7, 10],
      ["Cairo", 14, 11, 1],
      ["Sydney", 23, 14, 8],
      ["Beijing", -3, 10, 2],
    ],
  },
  {
    title: ["Four rainforest trees", "四种雨林树木"],
    thing: "tree",
    columns: [
      ["height (m)", "m", "the tallest", "the shortest"],
      ["width of trunk (cm)", "cm", "the widest trunk", "the narrowest trunk"],
      ["age (years)", "years", "the oldest", "the youngest"],
    ],
    rows: [
      ["kapok", 60, 300, 200],
      ["Brazil nut", 50, 200, 500],
      ["rubber tree", 30, 90, 100],
      ["cacao", 8, 20, 60],
    ],
  },
];

/** tableText shows a table as rows and columns. */
const tableText = (table: Table) =>
  [
    `**${table.title[0]}**`,
    "",
    `| ${table.thing} | ${table.columns.map((c) => c[0]).join(" | ")} |`,
    `| :--- | ${table.columns.map(() => "---:").join(" | ")} |`,
    ...table.rows.map(([name, ...values]) => `| ${name} | ${values.join(" | ")} |`),
  ].join("\n");

const value = (table: Table, row: number, column: number) => (table.rows[row]?.[column + 1] as number | undefined) ?? 0;

/** extreme finds the row with the greatest or least value of a column. */
const extreme = (table: Table, column: number, most: boolean) =>
  range(table.rows.length).reduce((best, r) =>
    most
      ? value(table, r, column) > value(table, best, column)
        ? r
        : best
      : value(table, r, column) < value(table, best, column)
        ? r
        : best,
  );

/** tableExtremeBank asks which row is greatest or least on a measure. */
const tableExtremeBank: readonly Item[] = tables.flatMap((table) =>
  table.columns.flatMap((column, c) =>
    [true, false].map((most) => {
      const right = extreme(table, c, most);
      const opposite = extreme(table, c, !most);
      const other = range(table.rows.length).find((r) => r !== right && r !== opposite) ?? 0;
      const name = (r: number) => table.rows[r]?.[0] ?? "";
      const phrase = most ? column[2] : column[3];
      return {
        question: t(`Which ${table.thing} has ${phrase}?`, `表中哪一项的“${column[0]}”${most ? "最大" : "最小"}？`),
        shown: tableText(table),
        right: name(right),
        wrong: [name(opposite), name(other)],
        why: t(
          `Read down the column “${column[0]}”: the ${table.thing} with ${phrase} is the **${name(right)}**, with ${value(table, right, c)} ${column[1]}.\n\n**Check.** Compare ${value(table, right, c)} against every other number in the “${column[0]}” column—no other row is ${most ? "higher" : "lower"}.`,
          `往下看“${column[0]}”这一栏：数值${most ? "最大" : "最小"}的是 **${name(right)}**，为 ${value(table, right, c)} ${column[1]}。\n\n**检验。** 把 ${value(table, right, c)} 和“${column[0]}”一栏的其余数字逐一比较——没有哪一行更${most ? "大" : "小"}。`,
        ),
        whyNot: [
          t(
            `The ${name(opposite)} has ${value(table, opposite, c)} ${column[1]}, which is the ${most ? "least" : "most"} in the column, the opposite of what the question asks.`,
            `${name(opposite)} 为 ${value(table, opposite, c)} ${column[1]}，是这一栏中${most ? "最小" : "最大"}的，与问题要求相反。`,
          ),
          t(
            `The ${name(other)} has ${value(table, other, c)} ${column[1]}. Compare it with every number in the column: another is ${most ? "greater" : "smaller"}.`,
            `${name(other)} 为 ${value(table, other, c)} ${column[1]}。把它和这一栏的每个数字比较：还有一个${most ? "更大" : "更小"}。`,
          ),
        ],
      };
    }),
  ),
);

/** tableTwoColumnBank asks a question that needs two columns: find a row by one measure, then read another. */
const tableTwoColumnBank: readonly Item[] = tables.flatMap((table) =>
  table.columns.flatMap((first, a) =>
    table.columns
      .map((second, b) => ({ second, b }))
      .filter(({ b }) => b !== a)
      .map(({ second, b }, k) => {
        const most = k === 0;
        const row = extreme(table, a, most);
        const name = table.rows[row]?.[0] ?? "";
        const wrongRow = extreme(table, b, most) === row ? extreme(table, a, !most) : extreme(table, b, most);
        const third = 3 - a - b;
        const right = `${value(table, row, b)} ${second[1]}`;
        const candidates = [
          `${value(table, wrongRow, b)} ${second[1]}`,
          `${value(table, row, third)} ${second[1]}`,
          `${value(table, row, a)} ${second[1]}`,
        ];
        const wrong = [...new Set(candidates.filter((w) => w !== right))].slice(0, 2);
        return {
          question: t(
            `The ${table.thing} with ${most ? first[2] : first[3]}: what is its ${second[0].replace(/ \(.*\)$/, "")}?`,
            `“${first[0]}”一栏数值${most ? "最大" : "最小"}的那一项，它的“${second[0]}”是多少？`,
          ),
          shown: tableText(table),
          right,
          wrong,
          why: t(
            `First find the row: the ${table.thing} with ${most ? first[2] : first[3]} is the ${name}. Then read across that row to the column “${second[0]}”: **${right}**.\n\n**Check.** Trace across the **${name}** row and down the “${second[0]}” column—they intersect at **${right}**.`,
            `先找到那一行：“${first[0]}”一栏数值${most ? "最大" : "最小"}的是 ${name}。再沿着这一行读到“${second[0]}”一栏：**${right}**。\n\n**检验。** 沿 **${name}** 这一行向右、沿“${second[0]}”这一栏向下——交叉处正好是 **${right}**。`,
          ),
          whyNot: wrong.map((w, idx) =>
            idx === 0
              ? t(`${w} comes from another row in the table rather than the ${name} row.`, `${w} 来自表中的另一行，而不是 ${name} 这一行。`)
              : t(
                  `${w} comes from the wrong column of the table—make sure you read the “${second[0]}” column.`,
                  `${w} 读错了列——要读取“${second[0]}”这一栏的数值。`,
                ),
          ),
        };
      }),
  ),
);

// Skimming and scanning.

const skimLines = `
  how people live in deserts|Finding Water;Homes That Stay Cool;Moving with the Herds|why camels have humps|how rainforests grow|Which section tells how desert families build their houses?|2
  the layers of the rainforest|The Forest Floor;The Understory;The Canopy|how to climb a tree|life in the Arctic|Which section tells about the dark ground under the trees?|1
  animals of the polar lands|Polar Bears on the Ice;Penguins in the South;Whales Under the Floe|the history of maps|how deserts form|Which section tells about penguins?|2
  how the body fights germs|The Skin as a Wall;White Blood Cells;Vaccines|how to wash your hands|how food is digested|Which section tells about the body's first wall against germs?|1
  how energy reaches our homes|Power Plants;Wires and Poles;Using Energy Wisely|how a battery is made|how plants make food|Which section tells about the lines that carry power across the country?|2
  how mountains form|Plates That Collide;Folding Rock;Volcano Mountains|the tallest mountain on Earth|how rivers flow|Which section tells about mountains made by eruptions?|3
  life in a medieval castle|The Lord's Hall;The Kitchens;Guarding the Walls|how to build a moat|life on a modern farm|Which section tells about the people who cooked the food?|2
  trade along the Silk Road|Goods from the East;Goods from the West;Dangers on the Road|how silk is made|how ships are built|Which section tells about robbers and storms?|3
  how artists make colors|Colors from the Earth;Colors from Plants;Colors from Shells|the life of one painter|how cameras work|Which section tells about dyes made from leaves and roots?|2
  how a play is made|Writing the Script;Choosing the Cast;Building the Set|the most famous theater|how to tell a joke|Which section tells about picking the actors?|2
  famous women in science|A Fossil Hunter;A Chemist;A Doctor of the Mind|how to be a scientist|famous kings and queens|Which section tells about a woman who dug up old bones?|1
  how weather changes the land|Wind;Water;Ice|how to read a weather map|how cities are planned|Which section tells about glaciers?|3
  saving water at home|In the Bathroom;In the Kitchen;In the Garden|where rain comes from|how to build a pool|Which section tells about watering plants?|3
  how bees make honey|Collecting Nectar;Inside the Hive;From Nectar to Honey|why bees sting|how butterflies grow|Which section tells about where the bees live?|2
  the planets of the solar system|The Rocky Planets;The Gas Giants;The Dwarf Planets|the history of rockets|how stars are born|Which section tells about Jupiter and Saturn?|2
  healthy habits|Eating Well;Moving Every Day;Sleeping Enough|how to cook rice|the history of medicine|Which section tells about going to bed on time?|3
  life in the ocean|The Sunlit Zone;The Twilight Zone;The Deep Sea|how to sail a boat|life in a pond|Which section tells about the dark bottom of the ocean?|3
  how books were made long ago|Writing by Hand;Making Paper;The Printing Press|how to read faster|how libraries are run|Which section tells about monks copying books?|1
  how sound travels|Vibrations;Sound Through Air;Sound Through Water|how to play a drum|how light travels|Which section tells about how whales hear each other?|3
  why leaves change color|Green All Summer;Days Grow Shorter;Hidden Colors Appear|how to rake leaves|how flowers bloom|Which section tells about the shorter days of autumn?|2
  how the Great Wall was built|Early Walls;Builders and Tools;The Wall Today|the life of one emperor|how bridges are built|Which section tells about what visitors see now?|3
  how a seed grows|Inside the Seed;Roots and Shoots;Reaching the Light|how to plant a garden|how trees are cut down|Which section tells about the first root pushing down?|2
  helping your community|Volunteering;Giving to Charity;Speaking Up|how to run a school|the history of money|Which section tells about donating money or toys?|2
  the inventions of ancient China|Paper;The Compass;Gunpowder|the life of a farmer|how kites fly|Which section tells about a tool that shows north?|2
  how earthquakes are measured|Seismographs;The Scale of Strength;Warning Systems|how to build a house|how volcanoes erupt|Which section tells about alarms that warn people?|3
  the life of a frog|Eggs in the Water;Tadpoles;Grown-Up Frogs|how to catch a frog|life in the desert|Which section tells about the young frogs with tails?|2
  musical instruments of the world|Drums;Strings;Wind Instruments|how to write a song|the life of one composer|Which section tells about flutes?|3
  what makes a good team|Listening;Sharing the Work;Cheering Each Other On|how to win every game|the history of soccer|Which section tells about dividing up the jobs?|2
  keeping teeth healthy|Brushing;Flossing;Visiting the Dentist|why sugar tastes sweet|how bones grow|Which section tells about check-ups?|3
  how glass is made|Sand and Heat;Shaping the Glass;Coloring the Glass|how mirrors work|how to clean windows|Which section tells about blowing glass into shapes?|2
  life in a Roman town|The Forum;The Baths;Homes and Shops|the life of Julius Caesar|life in a medieval town|Which section tells about where people went to wash?|2
  the water cycle|Evaporation;Clouds;Rain and Snow|how to save water|how oceans formed|Which section tells about water rising into the air?|1
`;

const skimRows = fields(skimLines).map(([about, headings, narrow, off, question, n]) => {
  const hs = (headings ?? "").split(";").map((h) => h.trim());
  const index = Number(n) - 1;
  if (!about || hs.length !== 3 || !narrow || !off || !question || !(index >= 0 && index < 3))
    throw new Error(`a skim line needs six fields: ${about}`);
  return { about, headings: hs as [string, string, string], narrow, off, question, index };
});

const headingsText = (hs: readonly string[]) => hs.map((h, i) => `${i + 1}. ${h}`).join("\n");

/** skimBank asks what a text is about from its headings. */
const skimBank: readonly Item[] = skimRows.map((row) => ({
  question: t("Skim the headings of this text. What is the whole text about?", "略读这篇文章的小标题。整篇文章是关于什么的？"),
  shown: headingsText(row.headings),
  right: row.about,
  wrong: [row.narrow, row.off],
  why: t(
    `The text is about ${row.about}. Skimming means reading only the headings and first sentences: together, the headings show the topic that all the sections share.\n\n**Check.** Test “${row.about}” against all three headings—every single heading fits under this topic.`,
    `这篇文章讲的是 ${row.about}。略读就是只读小标题和首句：把小标题放在一起，就能看出所有部分共同的主题。\n\n**检验。** 用“${row.about}”逐一对照三个小标题——每个小标题都属于这个主题。`,
  ),
  whyNot: [
    t(
      `“${row.narrow}” is too narrow: at most it is one detail. The headings together cover much more than that.`,
      `“${row.narrow}”范围太窄：它最多只是一个细节。所有小标题合起来涵盖的内容要多得多。`,
    ),
    t(`“${row.off}” is a different topic: none of the headings is about it.`, `“${row.off}”是另一个话题：没有一个小标题与它有关。`),
  ],
}));

/** scanBank asks which section holds a given fact. */
const scanBank: readonly Item[] = skimRows.map((row) => {
  const right = pick(row.headings, row.index);
  const wrong = row.headings.filter((_, i) => i !== row.index);
  return {
    question: t(`Scan the headings. ${row.question}`, `扫读小标题。${row.question}`),
    shown: headingsText(row.headings),
    right,
    wrong,
    why: t(
      `“${right}” is the section to read. Scanning means looking for the key word of your question, then reading only the section whose heading matches it.\n\n**Check.** Match the key idea of the question to “${right}”—the other two headings cover different subtopics.`,
      `应该读“${right}”这一部分。扫读就是找出问题中的关键词，再只读小标题与之相符的那一部分。\n\n**检验。** 把问题的核心关键词与“${right}”对照——另外两个小标题讲的是别的子话题。`,
    ),
    whyNot: wrong.map((w, idx) =>
      idx === 0
        ? t(
            `The section “${w}” covers a different subtopic and would not answer this specific question.`,
            `“${w}”这一部分讲的是另一个子话题，不会回答这个具体问题。`,
          )
        : t(
            `“${w}” does not match the key idea in the question—scan the headings again for the closest match.`,
            `“${w}”与问题中的核心词不对应——再扫读一遍小标题，找最贴合的那一项。`,
          ),
    ),
  };
});

// How authors support points.

/** supportGroups are the points of one text, each with two pieces of evidence the author gives for it. */
const supportGroups = [
  `
  Exercise makes the heart stronger.|A runner's resting heartbeat is often slower, because the strong heart pumps more blood with each beat.|Doctors found that people who walk every day have fewer heart problems.
  Exercise helps you sleep.|In one study, children who played outside fell asleep faster at night.|Tired muscles help the body relax at bedtime.
  Exercise lifts your mood.|Moving releases chemicals in the brain that make you feel good.|Many people say they feel calmer after a walk.
  `,
  `
  Deserts are not empty of life.|Over two thousand kinds of plants grow in the Sonoran Desert alone.|Foxes, snakes and owls hunt in deserts at night when it is cool.
  Desert plants are built to save water.|A cactus stores water in its thick stem for months.|Many desert plants have tiny leaves or spines, which lose less water.
  Desert animals avoid the heat.|Many desert animals sleep underground during the day.|The fennec fox's huge ears give off heat and keep it cool.
  `,
  `
  Castles were built for defense.|Their walls were often three meters thick.|A moat full of water kept attackers away from the walls.
  Castles were homes as well as forts.|The lord's family ate and slept in the great hall.|Castles had kitchens, chapels and gardens.
  Castles were hard to build.|Building one could take hundreds of workers more than ten years.|Stone had to be cut by hand and dragged up the hill.
  `,
  `
  The Silk Road spread more than goods.|Travelers carried new ideas about medicine and math from land to land.|Music and stories moved along the road with the merchants.
  Travel on the Silk Road was dangerous.|Bandits often attacked caravans in the mountains.|Sandstorms in the desert could bury a camp overnight.
  Silk was very valuable.|In Rome, silk cost as much as gold.|China kept the secret of making silk for hundreds of years.
  `,
  `
  Solar power is clean.|Solar panels make electricity without smoke.|Unlike coal, sunlight does not run out.
  Solar power saves money over time.|After the panels are paid for, the sunlight is free.|One school cut its electric bill in half with solar panels.
  Solar power works in many places.|Panels power lights in villages far from power lines.|Some calculators and road signs run on tiny solar panels.
  `,
  `
  Braille changed life for blind readers.|Before Braille, blind children had very few books they could read.|With Braille, blind people could read and write on their own.
  Louis Braille worked hard on his idea.|He began working on his system when he was only twelve.|He spent years making the dots simpler to feel.
  Braille is still used today.|Braille appears on elevator buttons and medicine boxes.|Millions of people around the world read Braille.
  `,
].map((block) =>
  fields(block).map(([claim, e1, e2]) => {
    if (!claim || !e1 || !e2) throw new Error(`a support line needs three fields: ${claim}`);
    return { claim, evidence: [e1, e2] as const };
  }),
);

/** pointForEvidenceBank asks which point a piece of evidence supports. */
const pointForEvidenceBank: readonly Item[] = supportGroups.flatMap((group) =>
  group.flatMap((p, i) =>
    p.evidence.map((e) => {
      const others = group.filter((_, k) => k !== i).map((o) => o.claim);
      return {
        question: t("Which point of the text does this evidence support?", "这条证据支持文章的哪个观点？"),
        shown: e,
        right: p.claim,
        wrong: others,
        why: t(
          `The evidence supports the point “${p.claim}” It is a fact or an example that shows this point is true.\n\n**Check.** Ask “If this evidence is true, which claim does it prove?”—only “${p.claim}” follows directly from it.`,
          `这条证据支持观点“${p.claim}”。它是证明这个观点正确的事实或例子。\n\n**检验。** 问自己“如果这条证据是真的，它直接证明了哪个观点？”——只有“${p.claim}”能由它直接推出。`,
        ),
        whyNot: others.map((o, idx) =>
          idx === 0
            ? t(
                `“${o}” is another point in the text, but this evidence addresses a different claim.`,
                `“${o}”是文中的另一个观点，但这条证据说明的不是它。`,
              )
            : t(
                `This evidence gives no proof for “${o}”—match the key detail in the evidence to the claim it backs.`,
                `这条证据并不能证明“${o}”——把证据中的关键信息与它所支持的观点对应起来。`,
              ),
        ),
      };
    }),
  ),
);

/** evidenceForPointBank asks which piece of evidence supports a given point. */
const evidenceForPointBank: readonly Item[] = supportGroups.flatMap((group) =>
  group.flatMap((p, i) =>
    p.evidence.map((e, k) => {
      const others = [pick(group, i + 1).evidence[k] ?? "", pick(group, i + 2).evidence[1 - k] ?? ""];
      return {
        question: t(`Which evidence supports this point: “${p.claim}”?`, `哪条证据支持这个观点：“${p.claim}”？`),
        shown: "",
        right: e,
        wrong: others,
        why: t(
          `This evidence backs the point: it gives a fact or an example that shows “${p.claim}” is true.\n\n**Check.** Read the claim and this sentence back to back—the evidence gives concrete proof for “${p.claim}”.`,
          `这条证据支持了这个观点：它给出的事实或例子证明“${p.claim}”是对的。\n\n**检验。** 把观点和这句话连起来读——这条证据为“${p.claim}”提供了具体依据。`,
        ),
        whyNot: others.map((o, idx) =>
          idx === 0
            ? t(
                `“${o}” is a true fact from the same article, but it backs a different claim.`,
                `“${o}”虽然出自同一篇文章且属实，但它支持的是另一个观点。`,
              )
            : t(
                `“${o}” does not prove “${p.claim}”—check which sentence directly gives a reason or example for this claim.`,
                `“${o}”并不能证明“${p.claim}”——找找哪一句直接为这个观点提供了理由或例证。`,
              ),
        ),
      };
    }),
  ),
);

// Combining information from two texts.

const twoTextLines = `
  Wind turbines turn moving air into electricity. A large turbine can power about a thousand homes.|Wind is strongest on hills and along coasts. In some places, the wind blows almost every day.|A large turbine on a windy coast could power about a thousand homes.|Building turbines on windy hills gives the most power for many homes.|A turbine turns moving air into electricity.|Wind blows almost every day in some places.|Wind turbines are the cheapest kind of power.
  Solar panels make electricity from sunlight. They make the most power at midday.|Deserts get more sunshine than any other land. Some deserts have over 3,500 hours of sun a year.|Solar panels in a desert would make a lot of power at midday.|A desert is a good place for solar panels because it has so much sun.|Solar panels make the most power at midday.|Some deserts have over 3,500 hours of sun a year.|Solar panels work best when they are cold.
  Coal is burned in power plants to make electricity. Burning coal makes smoke that dirties the air.|Many cities are now closing their coal plants. They are building wind and solar farms instead.|Cities are replacing smoky coal plants with cleaner wind and solar farms.|Closing coal plants means less smoke in city air.|Burning coal makes smoke.|Many cities are building wind and solar farms.|Coal is found only in deserts.
  Water flowing downhill can spin a turbine. Dams hold back rivers to make the water fall.|The Three Gorges Dam in China is the largest power station in the world. It holds back the Yangtze River.|The Three Gorges Dam makes power by letting the Yangtze fall through turbines.|The world's largest power station uses falling river water to spin turbines.|Dams make water fall to spin turbines.|The Three Gorges Dam holds back the Yangtze River.|Dams are built only in deserts.
  A light bulb that is left on wastes energy. Old bulbs also turn most of their energy into heat.|New LED bulbs use much less energy. They stay cool when they shine.|Changing old bulbs for cool LEDs and turning them off saves energy.|Old bulbs waste energy as heat, but LEDs stay cool and use less.|Old bulbs turn most of their energy into heat.|LED bulbs stay cool when they shine.|LED bulbs were invented in Rome.
  Insulation keeps heat inside a house in winter. It works like a warm coat for the walls.|Most heat escapes from a house through the roof and windows. Thick curtains can help.|Insulating the roof and hanging thick curtains keep a house warm.|Since most heat leaves through the roof, insulation there is like a warm coat.|Insulation works like a warm coat for the walls.|Thick curtains can help keep heat in.|Insulation makes a house cooler in winter.
  Plants use sunlight to make their food. The energy is stored in their leaves, stems and roots.|When we eat plants, our bodies take in their stored energy. We use it to move and grow.|The energy we use to move came from sunlight stored by plants.|Eating plants gives us energy that the plants took from the sun.|Plants store energy in their leaves, stems and roots.|We use energy from food to move and grow.|Plants make their food at night only.
  Batteries store energy and let us use it later. A phone battery lasts about a day.|Some old batteries leak harmful metals. They must be taken to special recycling bins.|Batteries let us use stored energy, but old ones must be recycled safely.|A phone battery that stops working should go to a special recycling bin.|A phone battery lasts about a day.|Old batteries can leak harmful metals.|Batteries make energy out of nothing.
  Sound travels as vibrations through the air. It moves about 340 meters each second.|Light travels almost a million times faster than sound. That is why we see lightning before we hear thunder.|We see lightning first because light is far faster than sound's 340 meters a second.|Sound is slow at about 340 meters a second, so thunder reaches us after the flash.|Sound moves about 340 meters each second.|Light is almost a million times faster than sound.|Sound travels faster in empty space.
  Cars that burn gasoline give off smoke. Many cities have smoggy air.|Electric cars run on batteries. They give off no smoke from a tailpipe.|Electric cars could help clear the smog that gasoline cars make in cities.|Switching from gasoline to electric cars would cut the smoke in city air.|Many cities have smoggy air.|Electric cars run on batteries.|Electric cars need gasoline to start.
  Food scraps make up about a third of the trash many families throw away.|Food scraps can be turned into compost, which feeds gardens.|A third of a family's trash could become compost for a garden.|Turning food scraps into compost would make a family's trash much smaller.|Food scraps are about a third of the trash.|Compost feeds gardens.|Compost is made from plastic.
  The sun heats the land faster than the sea. Warm air rises over the land.|Cool air from the sea rushes in to take the place of the rising air. This makes a sea breeze.|A sea breeze blows because land heats faster and cool sea air rushes in.|Because warm air rises over land, cool air flows in from the sea as a breeze.|The sun heats land faster than sea.|A sea breeze is cool air rushing in from the sea.|Sea breezes only blow at night.
  Ice keeps food cold because it takes heat away as it melts.|Long ago, people cut blocks of ice from frozen lakes in winter. They stored it in sawdust to keep it all summer.|People once kept food cold all summer with lake ice stored in sawdust.|Lake ice stored in sawdust could later melt and take heat from food.|Ice takes heat away as it melts.|People once cut ice from frozen lakes.|Ice was invented in summer.
  Bicycles use no fuel. The rider's legs give all the power.|Riding a bike for thirty minutes a day keeps the heart healthy.|Riding to school uses no fuel and keeps your heart healthy.|A daily bike ride saves fuel and is good exercise for the heart.|Bicycles use no fuel.|Thirty minutes of riding a day is good for the heart.|Bicycles run on electricity.
  A tree's leaves shade a house in summer. The house stays cooler without air conditioning.|In winter, many trees lose their leaves. Then sunlight can reach and warm the house.|A tree beside a house keeps it cool in summer and lets in sun in winter.|Leafy trees in summer and bare trees in winter both help a house save energy.|Leaves shade a house in summer.|Many trees lose their leaves in winter.|Trees grow faster in a dark room.
  A kilogram of recycled aluminum saves the energy of making new metal from rock.|Each can that is thrown away takes hundreds of years to break down.|Recycling cans saves energy and keeps them out of the trash for hundreds of years.|Throwing away cans wastes energy and leaves trash that lasts for centuries.|Recycled aluminum saves energy.|A thrown-away can lasts hundreds of years.|Aluminum is made from trees.
`;

const twoTextRows = fields(twoTextLines).map(([a, b, both1, both2, onlyA, onlyB, neither]) => {
  if (!a || !b || !both1 || !both2 || !onlyA || !onlyB || !neither) throw new Error(`a two-text line needs seven fields: ${a}`);
  return { a, b, both: [both1, both2] as const, onlyA, onlyB, neither };
});

const twoTexts = (row: (typeof twoTextRows)[number]) => `Text A: ${row.a}\n\nText B: ${row.b}`;

/** bothTextsBank asks for the statement that needs both texts. */
const bothTextsBank: readonly Item[] = twoTextRows.flatMap((row, r) =>
  row.both.map((both, k) => {
    const foreign = pick(twoTextRows, r + 5).both[1 - k] ?? "";
    return {
      question: t("Which statement needs information from both texts?", "哪个说法需要用到两篇文章的信息？"),
      shown: twoTexts(row),
      right: both,
      wrong: [row.onlyA, row.onlyB, foreign],
      why: t(
        `“${both}” joins a fact from Text A with a fact from Text B. Neither text says this alone; a reader puts them together.\n\n**Check.** Cover Text B and see if Text A alone proves “${both}”, then cover Text A—neither single text is enough on its own.`,
        `“${both}”把文章 A 的一个事实和文章 B 的一个事实结合在一起。两篇文章单独都没这样说；是读者把它们合在一起的。\n\n**检验。** 盖住文章 B 看文章 A 能否单独推出“${both}”，再盖住文章 A——单看哪一篇都不够。`,
      ),
      whyNot: [
        t(`“${row.onlyA}” comes from Text A alone. You do not need Text B for it.`, `“${row.onlyA}”只来自文章 A，不需要文章 B。`),
        t(`“${row.onlyB}” comes from Text B alone. You do not need Text A for it.`, `“${row.onlyB}”只来自文章 B，不需要文章 A。`),
        t(
          `“${foreign}” joins two facts, but not facts from these texts: neither Text A nor Text B is about it.`,
          `“${foreign}”也结合了两个事实，但不是这两篇文章里的事实：文章 A 和文章 B 都没有讲到它。`,
        ),
      ],
    };
  }),
);

const sources = ["Text A", "Text B", "neither text"] as const;

/** whichTextBank asks which text a statement comes from. */
const whichTextBank: readonly Item[] = twoTextRows.flatMap((row) =>
  (
    [
      [row.onlyA, 0],
      [row.onlyB, 1],
    ] as const
  ).map(([statement, source]) => {
    const right = sources[source];
    const wrong = sources.filter((s) => s !== right);
    return {
      question: t(`Which text gives this information: “${statement}”?`, `哪篇文章给出了这条信息：“${statement}”？`),
      shown: twoTexts(row),
      right,
      wrong,
      why: t(
        `**${right}** says it. When you write about a topic from two texts, keep track of which fact came from which source.\n\n**Check.** Re-read **${right}** directly—the exact idea “${statement}” is stated there and not in the other text.`,
        `**${right}** 说了这一点。用两篇文章写一个话题时，要记清每个事实来自哪篇文章。\n\n**检验。** 重读 **${right}**——“${statement}”这个信息明确出现在这里，而另一篇里没有。`,
      ),
      whyNot: wrong.map((w) =>
        w === "neither text"
          ? t(
              "One of the texts does say this, so it is not missing from both. Look again for the same fact in other words.",
              "其中一篇文章确实说了这一点，所以并非两篇都没有。再找找用别的话说的同一个事实。",
            )
          : t(
              `${w} does not say this. Check each text for the fact before you choose.`,
              `${w} 没有这样说。选之前，在每篇文章里查一查这个事实。`,
            ),
      ),
    };
  }),
);

/** neitherBank asks which text gives a statement that neither text gives, so that the answer is not always a text. */
const neitherBank: readonly Item[] = twoTextRows.map((row) => ({
  question: t(`Which text gives this information: “${row.neither}”?`, `哪篇文章给出了这条信息：“${row.neither}”？`),
  shown: twoTexts(row),
  right: "neither text",
  wrong: ["Text A", "Text B"],
  why: t(
    "**Neither text** says this, and it is not true. A statement about a topic is not supported just because the texts are about the same topic.\n\n**Check.** Scan both Text A and Text B for this claim—neither passage mentions or supports it.",
    "**两篇文章都没有**这样说，而且这个说法并不正确。不能因为两篇文章话题相同，就认为某个说法得到了支持。\n\n**检验。** 把文章 A 和文章 B 各扫读一遍——两篇都既没提到也没支持这个说法。",
  ),
  whyNot: [
    t("Text A is on the same general topic, but it never states this claim.", "文章 A 虽然话题相同，但从未说过这句话。"),
    t(
      "Text B does not state this claim either—verify the exact fact instead of matching by topic alone.",
      "文章 B 同样没有这样说——要核对具体事实，不能只看话题相关就选。",
    ),
  ],
}));

/** infoTopics4 are the reading topics of grade 4 about informational texts. */
export const infoTopics4: readonly TopicDef[] = [
  {
    id: "cause-and-effect-chains",
    title: t("Chains of Causes and Effects", "因果链"),
    summary: t(
      "In science and history one effect often becomes the cause of the next: rain soaks a hillside, the soil grows heavy, the slope slides.",
      "在科学和历史中，一个结果常常成为下一个结果的原因：雨水浸透山坡，土壤变重，山坡滑落。",
    ),
    intro: t(
      "When water seeps into a rock crack and freezes, the ice pushes the crack wider until the rock splits apart. In science and history, one effect often triggers the next like falling dominoes—that linked sequence is a cause-and-effect chain.",
      "当水渗进岩石裂缝并在夜里结冰，冰把裂缝撑宽，岩石最终裂成碎块。在科学与历史中，一个结果常常像多米诺骨牌一样引发下一个结果——这就是因果链。",
    ),
    prerequisites: ["cause-and-effect-in-texts"],
    encompasses: [{ topic: "cause-and-effect-in-texts", weight: 0.3 }],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "ordering-a-chain",
        t("Putting a Chain in Order", "把因果链排序"),
        t(
          "A **chain of causes and effects** is a row of events in which each one makes the next happen: *rain soaks a hillside*, so *the soil grows heavy*, so *the slope slides*. To put the links in order, find the one that starts everything, then ask of each link: what did this cause? The last link is the final effect.\n\n> **Watch out.** Do not just spot the first and last events—check the two middle links carefully so you do not swap cause and effect.",
          "**因果链**是一串事件，每个事件都引起下一个：*雨水浸透山坡*，所以*土壤变重*，所以*山坡滑落*。要排好环节的顺序，先找到引起一切的那个环节，然后对每个环节问：它引起了什么？最后一个环节是最终的结果。\n\n> **注意。** 不要只看头尾两个事件——中间两个环节也要仔细核对，免得把因果顺序颠倒。",
        ),
        itemGenerator(chainOrderBank),
      ),
      point(
        "finding-the-missing-link",
        t("Finding the Missing Link", "找出缺失的环节"),
        t(
          "When one link is missing, look at the links on each side of the gap. For example, between *A volcano erupts* and *The ash blocks some sunlight*, the missing link must be *Ash rises high into the sky*—it is caused by the eruption and causes the blocked sunlight.\n\n> **Watch out.** An event that is true in nature but belongs to a different chain will not connect both sides of the gap.",
          "缺少一个环节时，看看空缺两边的环节。例如在“火山喷发”和“火山灰遮挡部分阳光”之间，缺失的环节一定是“火山灰升到高空”——它由喷发引起，又导致遮挡阳光。\n\n> **注意。** 即使某个事件本身符合科学事实，只要它属于另一条因果链，就无法把空缺前后连起来。",
        ),
        itemGenerator(chainMissingBank),
      ),
    ],
  },
  {
    id: "explanations-of-how-things-work",
    title: t("Explanations of How Things Work", "说明事物如何运作的文章"),
    summary: t(
      "An explanation tells what happens and why, step by step, in a process of nature or a machine.",
      "说明文一步一步地讲述自然过程或机器中发生了什么以及为什么。",
    ),
    intro: t(
      "A geyser does not just shoot water into the sky by magic—rainwater seeps down, hot rock heats it, pressure builds in a narrow tube, and steam blasts upward. Reading an explanation means tracking both the steps and the reasons behind each one.",
      "间歇泉并不是凭空把水喷向天空——雨水渗入地下，滚烫的岩石将其加热，狭窄管道里压力积聚，最后蒸汽和水柱冲天而出。读懂说明文，既要理清步骤，也要抓住每一步背后的原因。",
    ),
    prerequisites: after("steps-in-a-procedure"),
    encompasses: [{ topic: "sequence-in-texts", weight: 0.2 }],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "what-happens-at-each-stage",
        t("What Happens at Each Stage", "每个阶段发生什么"),
        t(
          "An explanation of how something works goes through a **process** in order: how a geyser erupts, how a turbine makes power. Signal words such as *first*, *next*, *then*, *after that* and *finally* mark the stages. To find what happens at a stage, find the stage before it, then read on to the next signal word.\n\n> **Watch out.** Do not skip ahead a step—when asked what happens *right after* step 1, choose step 2, not step 3 or 4.",
          "说明事物如何运作的文章按顺序讲述一个**过程**：间歇泉怎样喷发，涡轮机怎样发电。*first*、*next*、*then*、*after that*、*finally* 这样的信号词标出各个阶段。要找出某个阶段发生什么，先找到它前面的阶段，再读到下一个信号词。\n\n> **注意。** 不要跳步——问某一步*紧接着*发生什么时，要找紧邻的下一步，不要跳到更后面的阶段。",
        ),
        itemGenerator(stageBank),
      ),
      point(
        "why-each-stage-happens",
        t("Why Each Stage Happens", "每个阶段为什么发生"),
        t(
          "An explanation does more than list steps: it tells **why** each one happens, often with *because*, *so*, *since* or *as a result*. For example, *the blades turn a shaft, because the shaft is joined to the center of the blades*. Find the exact step in the text and read the reason attached to it.\n\n> **Watch out.** Every step in the passage has its own *because* clause—do not borrow the reason belonging to a neighboring step.",
          "说明文不只是列出步骤：它还告诉你每一步**为什么**发生，常用 *because*、*so*、*since* 或 *as a result*。例如“叶片带动转轴，因为转轴连接在叶片中心”。在文中找到对应步骤，读紧跟它的原因。\n\n> **注意。** 文中每一步都有自己的 *because* 原因——不要张冠李戴，拿相邻步骤的原因来回答。",
        ),
        itemGenerator(reasonBank),
      ),
    ],
  },
  {
    id: "comparing-data-in-a-table",
    title: t("Comparing Data in a Table", "比较表格中的数据"),
    summary: t(
      "A table of several places or things lets a reader compare them on each measure and find the largest, the smallest and the differences.",
      "包含多个地方或事物的表格让读者能按每项指标比较它们，找出最大、最小和差异。",
    ),
    intro: t(
      "Which desert is larger, the Sahara or the Gobi—and which gets less rain? Putting measurements into rows and columns lets you compare several places or animals at a glance without hunting through paragraphs.",
      "撒哈拉沙漠和戈壁沙漠哪个面积更大，哪个降雨更少？把数据放进表格的行和列里，就能一眼比较多个地方或动物，不用在长段文字里翻找。",
    ),
    prerequisites: after("reading-a-table"),
    encompasses: [],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "greatest-and-least-in-a-table",
        t("Greatest and Least", "最大和最小"),
        t(
          "A **table** puts facts into **rows** (one for each place or thing) and **columns** (one for each measure). To find which is greatest or least on a measure, find its column by the heading, read every number down that column, and pick the largest or smallest. Then read across to the start of the row for its name.\n\n> **Watch out.** Watch negative numbers in temperature columns—`-10 °C` is colder (smaller) than `-3 °C`, and both are colder than `12 °C`.",
          "**表格**把事实排成**行**（每个地方或事物一行）和**列**（每项指标一列）。要找出某项指标最大或最小的是哪个，先按标题找到那一列，往下读这一列的每个数字，挑出最大或最小的，再沿着这一行读到开头找出它的名称。\n\n> **注意。** 温度栏里要留意负数——`-10 °C` 比 `-3 °C` 更冷（数值更小），两者都比 `12 °C` 冷。",
        ),
        itemGenerator(tableExtremeBank),
      ),
      point(
        "questions-that-need-two-columns",
        t("Questions That Need Two Columns", "需要两栏的问题"),
        t(
          "Some questions need two columns. *The coldest biome: how much rain does it get?* First use one column to find the row: the coldest is the tundra. Then stay in that row and move across to the other column to read the answer. Keep your finger on the row so you do not slip into the row above or below.\n\n> **Watch out.** Do not answer with the greatest/least value of the second column—use the first column to pick the row, then read the second column in *that same row*.",
          "有些问题需要用到两栏。*最冷的生物群落降雨量是多少？* 先用一栏找到那一行：最冷的是苔原。然后留在这一行，横着移到另一栏读出答案。用手指按住这一行，以免看错到上一行或下一行。\n\n> **注意。** 不要直接找第二栏的最大/最小值——先用第一栏锁定那一行，再读*同一行*里第二栏的数据。",
        ),
        itemGenerator(tableTwoColumnBank),
      ),
    ],
  },
  {
    id: "skimming-and-scanning",
    title: t("Skimming and Scanning", "略读和扫读"),
    summary: t(
      "Skimming reads headings and first sentences to learn what a text is about; scanning looks for one key word or number.",
      "略读是读小标题和首句以了解文章大意；扫读是寻找一个关键词或数字。",
    ),
    intro: t(
      "Before reading a long encyclopedia article on bees, you can glance over its three headings (*Collecting Nectar*, *Inside the Hive*, *From Nectar to Honey*) to see the whole topic—or jump straight to *Inside the Hive* when you only need to know where bees live.",
      "读一篇关于蜜蜂的长科普前，扫一眼三个小标题（*Collecting Nectar*、*Inside the Hive*、*From Nectar to Honey*）就能掌握全篇主题；如果只想知道蜜蜂住在哪儿，直接跳到 *Inside the Hive* 就行。",
    ),
    prerequisites: ["text-features"],
    encompasses: [{ topic: "text-features", weight: 0.2 }],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "skimming-for-the-topic",
        t("Skimming for the Topic", "略读找主题"),
        t(
          "To **skim**, read only the title, the headings and the first sentence of each section. For example, headings like *Wind*, *Water*, and *Ice* together point to *how weather changes the land*. The topic is what every heading has in common.\n\n> **Watch out.** Do not pick an answer that fits only one heading—the whole text's topic must cover all the headings together.",
          "**略读**时只读标题、小标题和每一部分的第一句。例如 *Wind*、*Water*、*Ice* 三个小标题合在一起指向“天气如何改变地表”。主题是所有小标题的共同点。\n\n> **注意。** 不要选只符合其中一个小标题的选项——整篇文章的主题必须能涵盖全部小标题。",
        ),
        itemGenerator(skimBank),
      ),
      point(
        "scanning-for-a-fact",
        t("Scanning for a Fact", "扫读找事实"),
        t(
          "To **scan**, you already know what you are looking for: a name, a date, a number, a key word. Pick the key word of your question—for example, *penguins* points straight to *Penguins in the South*—and read only that section.\n\n> **Watch out.** Sometimes the question uses a synonym or example instead of the exact heading word (like *flutes* under *Wind Instruments*), so link the idea, not only identical spelling.",
          "**扫读**时你已经知道要找什么：一个名字、一个日期、一个数字、一个关键词。挑出问题中的关键词——例如 *penguins* 直接指向 *Penguins in the South*——只读那一部分。\n\n> **注意。** 有时问题里用的是同义词或具体例子，而不是小标题原词（如用 *flutes* 对应 *Wind Instruments*），要按语义对应，不要只找一模一样的词。",
        ),
        itemGenerator(scanBank),
      ),
    ],
  },
  {
    id: "how-authors-support-points",
    title: t("How Authors Support Points", "作者如何支持观点"),
    summary: t("An author backs each point of a text with reasons and evidence.", "作者用理由和证据来支持文章中的每个观点。"),
    intro: t(
      "Anyone can claim *Castles were built for defense*, but a strong writer proves it with concrete evidence: three-meter-thick stone walls and water-filled moats. Good readers always link each claim to the specific facts that back it up.",
      "谁都可以说“城堡是为防御而建的”，但好作者会给出具体证据：三米厚的石墙和注满水的护城河。会读文章的人总会把每个观点和支撑它的具体事实连起来看。",
    ),
    prerequisites: ["supporting-details"],
    encompasses: [
      { topic: "main-idea", weight: 0.2 },
      { topic: "supporting-details", weight: 0.3 },
    ],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "the-point-evidence-supports",
        t("The Point the Evidence Supports", "证据支持的观点"),
        t(
          "An author of an informational text makes **points**, such as *Exercise makes the heart stronger*, and backs each one with **evidence**: facts, numbers, examples and the words of experts. To find which point a piece of evidence supports, ask: if this is true, what does it prove?\n\n> **Watch out.** All three choices may be real points from the same article—check which specific point the given fact actually proves.",
          "信息类文章的作者会提出**观点**，例如 *Exercise makes the heart stronger*，并用**证据**来支持每个观点：事实、数字、例子和专家的话。要找出一条证据支持哪个观点，就问：如果这是真的，它证明了什么？\n\n> **注意。** 三个选项可能都是同一篇文章里的真实观点——要核对这条事实到底证明哪一个。",
        ),
        itemGenerator(pointForEvidenceBank),
      ),
      point(
        "evidence-for-a-point",
        t("Evidence for a Point", "支持观点的证据"),
        t(
          "Now start from the point and look for its evidence. For *Solar power is clean*, the fact *Solar panels make electricity without smoke* directly proves it. Other sentences of the text may be true too, but if they are about a different point, they do not support this one.\n\n> **Watch out.** Being true and on the same broad topic is not enough—the evidence must directly back the specific claim asked about.",
          "现在从观点出发去找证据。对于“太阳能很清洁”，*Solar panels make electricity without smoke* 直接证明了它。文章中的其他句子也许也是真的，但如果它们说的是另一个观点，就不能支持这一个。\n\n> **注意。** 光是“真实且主题相关”还不够——证据必须直接支撑题目问的那个具体观点。",
        ),
        itemGenerator(evidenceForPointBank),
      ),
    ],
  },
  {
    id: "combining-information-from-two-texts",
    title: t("Combining Information from Two Texts", "整合两篇文章的信息"),
    summary: t(
      "To write or speak about a topic, a reader joins what two texts say into one picture.",
      "要就一个话题写作或发言，读者要把两篇文章所说的内容整合起来。",
    ),
    intro: t(
      "Text A explains that wind turbines turn moving air into electricity; Text B notes that winds blow strongest along coasts and hills. Putting both together lets you conclude something neither text stated alone: windy coasts are ideal spots for turbines.",
      "文章 A 讲风力涡轮机能把风转化为电，文章 B 讲海岸和山丘的风力最强。把两篇合起来看，就能得出任何一篇单独没说的结论：多风的海岸非常适合建风力涡轮机。",
    ),
    prerequisites: after("two-texts-on-one-topic"),
    encompasses: [],
    xp: 14,
    strand: "reading",
    knowledgePoints: [
      point(
        "statements-that-need-both-texts",
        t("Statements That Need Both Texts", "需要两篇文章的说法"),
        t(
          "Two texts on one topic often give different facts. A reader who knows both can say something neither text says alone: Text A says solar panels make the most power at midday, Text B says deserts get the most sun, so a desert is a good place for solar panels. A statement that joins a fact from each text needs both.\n\n> **Watch out.** Do not pick a true sentence that comes from Text A alone or Text B alone—the right answer must combine a detail from *each* text.",
          "关于同一话题的两篇文章常常给出不同的事实。两篇都读过的读者能说出两篇单独都没说的话：文章 A 说太阳能板正午发电最多，文章 B 说沙漠阳光最多，所以沙漠是安装太阳能板的好地方。把两篇文章各一个事实结合起来的说法需要两篇文章。\n\n> **注意。** 不要选只来自文章 A 或只来自文章 B 的正确句子——正确答案必须同时用到*两篇*文章的信息。",
        ),
        itemGenerator(bothTextsBank),
      ),
      point(
        "which-text-a-fact-comes-from",
        t("Which Text a Fact Comes From", "事实来自哪篇文章"),
        t(
          "When you use two texts, keep track of where each fact came from, so you can check it and name your source. Find the fact in the text itself, even if it is said in other words. For example, *Bicycles use no fuel* may appear in Text A, while *Bicycles run on electricity* appears in neither text.\n\n> **Watch out.** Never assume a statement is in a text just because it shares keywords—verify that the passage actually makes that claim.",
          "使用两篇文章时，要记清每个事实来自哪里，这样才能核对并说明出处。要在文章中找到这个事实本身，即使它是用别的话说的。例如“自行车不用燃料”可能出自文章 A，而“自行车用电驱动”在两篇里都没出现。\n\n> **注意。** 别因为句子里有相同关键词就以为文章说过——必须核实文章里确实表达了这个事实。",
        ),
        itemGenerator([...whichTextBank, ...neitherBank]),
      ),
    ],
  },
];
